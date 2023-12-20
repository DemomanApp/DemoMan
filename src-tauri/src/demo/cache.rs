use std::{marker::PhantomData, path::PathBuf};

use log::{error, trace, warn};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

pub struct DiskCache<T> {
    cache_path: PathBuf,
    phantom: PhantomData<T>,
}

#[derive(Deserialize, Serialize)]
struct Metadata {
    version: usize,
}

enum CacheReadError {
    EntryNotFound,
    IoError,
    InvalidEntry,
}

impl From<cacache::Error> for CacheReadError {
    fn from(value: cacache::Error) -> Self {
        match value {
            cacache::Error::EntryNotFound(_, _) => Self::EntryNotFound,
            cacache::Error::IoError(_, _) => Self::IoError,
            cacache::Error::SizeMismatch(_, _)
            | cacache::Error::SerdeError(_, _)
            | cacache::Error::IntegrityError(_) => Self::InvalidEntry,
        }
    }
}

impl From<std::boxed::Box<bincode::ErrorKind>> for CacheReadError {
    fn from(value: std::boxed::Box<bincode::ErrorKind>) -> Self {
        match *value {
            bincode::ErrorKind::Io(_) => Self::IoError,
            _ => Self::InvalidEntry,
        }
    }
}

impl<T: DeserializeOwned + Serialize> DiskCache<T> {
    pub fn at_path(cache_path: PathBuf) -> Self {
        Self {
            cache_path,
            phantom: PhantomData,
        }
    }

    pub async fn get(&self, key: &str) -> Option<T> {
        trace!(target: "CACHE", "get {key}");
        let value: Result<T, CacheReadError> = cacache::read(&self.cache_path, key)
            .await
            .map_err(Into::into)
            .and_then(|bytes| bincode::deserialize(&bytes).map_err(Into::into));

        match value {
            Ok(value) => Some(value),
            Err(error) => {
                match error {
                    CacheReadError::EntryNotFound => {}
                    CacheReadError::IoError => {
                        error!(
                            "IO error occurred while reading \"{key}\" from cache at {}",
                            self.cache_path.display()
                        );
                    }
                    CacheReadError::InvalidEntry => {
                        // Something is wrong with this cache entry,
                        // we might as well remove it.
                        let _ = cacache::remove(&self.cache_path, key).await;

                        warn!(
                            "Invalid entry at key \"{key}\" in cache at {}",
                            self.cache_path.display()
                        );
                    }
                }

                None
            }
        }
    }

    pub async fn set(&self, key: &str, value: &T) {
        trace!(target: "CACHE", "set {key}");
        let bytes = bincode::serialize(value).unwrap();

        cacache::write(&self.cache_path, key, bytes).await.unwrap();
    }
}
