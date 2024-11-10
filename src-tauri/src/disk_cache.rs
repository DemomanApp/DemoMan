use std::{
    io::ErrorKind,
    path::{Path, PathBuf},
};

use crate::traits::Cache;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("I/O Error: {0}")]
    Io(#[from] std::io::Error),

    #[error("(de-)serialization error: {0}")]
    Serde(#[from] bincode::Error),

    #[error("invalid filename: {0}")]
    InvalidFilename(PathBuf),
}

pub struct DiskCache {
    path: PathBuf,
}

impl DiskCache {
    pub fn new(path: PathBuf) -> Self {
        Self { path }
    }

    fn path_of_key(&self, key: impl AsRef<Path>) -> PathBuf {
        self.path.join(key)
    }
}

impl Cache for DiskCache {
    type Key = Path;
    type Value = Vec<u8>;
    type Error = Error;

    async fn get(&self, key: impl AsRef<Self::Key>) -> Result<Option<Self::Value>, Self::Error> {
        let path = self.path_of_key(key);

        let bytes = match tokio::fs::read(path).await {
            Ok(bytes) => bytes,
            Err(error) => match error.kind() {
                ErrorKind::NotFound => return Ok(None),
                _ => return Err(error.into()),
            },
        };

        Ok(Some(bytes))
    }

    async fn insert(
        &self,
        key: impl AsRef<Self::Key>,
        bytes: &Self::Value,
    ) -> Result<(), Self::Error> {
        let path = self.path_of_key(key);

        if let Some(parent) = path.parent() {
            if let Err(error) = tokio::fs::create_dir_all(parent).await {
                if error.kind() != ErrorKind::AlreadyExists {
                    return Err(error.into());
                }
            }
        }

        tokio::fs::write(path, bytes).await?;

        Ok(())
    }

    async fn remove(&self, key: impl AsRef<Self::Key>) -> Result<(), Self::Error> {
        let path = self.path_of_key(key);

        tokio::fs::remove_file(path).await?;

        Ok(())
    }
}
