use std::{
    hash::{Hash, Hasher},
    io,
    path::{Path, PathBuf},
    time::SystemTime,
};

use serde::{Deserialize, Serialize};
use wyhash::WyHash;

use crate::{
    demo::analyser::GameSummary,
    disk_cache::{DiskCache, Error},
    traits::Cache,
};

#[derive(PartialEq, Serialize, Deserialize)]
struct Header {
    path: PathBuf,
    version: String,
    modified_time: SystemTime,
    file_size: u64,
}

#[derive(Serialize, Deserialize)]
struct RawEntry<'a> {
    header: Header,
    content: &'a [u8],
}

pub struct ParsedDemoCache {
    disk_cache: DiskCache,
}

impl<'a> ParsedDemoCache {
    pub fn new(path: PathBuf) -> Self {
        Self {
            disk_cache: DiskCache::new(path),
        }
    }

    fn cache_key(demo_path: impl AsRef<Path>) -> Result<PathBuf, Error> {
        let parent_dir = demo_path.as_ref().parent().unwrap_or(Path::new(""));
        let parent_dir_hash = {
            let mut hasher = WyHash::with_seed(0);
            parent_dir.hash(&mut hasher);
            hasher.finish()
        };

        let name = demo_path
            .as_ref()
            .file_stem()
            .ok_or_else(|| Error::InvalidFilename(demo_path.as_ref().to_owned()))?;

        let mut key = PathBuf::from(format!("{parent_dir_hash:x}"));
        key.push(name);
        key.set_extension("bin");

        Ok(key)
    }

    async fn header(demo_path: impl AsRef<Path>) -> io::Result<Header> {
        let demo_path = demo_path.as_ref();

        let metadata = tokio::fs::metadata(demo_path).await?;

        let header = Header {
            path: demo_path.to_owned(),
            version: String::from(env!("CARGO_PKG_VERSION")),
            modified_time: metadata.modified().unwrap_or(SystemTime::UNIX_EPOCH),
            file_size: metadata.len(),
        };

        Ok(header)
    }
}

impl Cache for ParsedDemoCache {
    type Key = str;
    type Value = GameSummary;
    type Error = Error;

    async fn get(
        &self,
        demo_path: impl AsRef<Self::Key>,
    ) -> Result<Option<Self::Value>, Self::Error> {
        let demo_path = demo_path.as_ref();

        log::trace!(target: "CACHE", "get {demo_path}");

        let key = Self::cache_key(demo_path)?;

        if let Some(raw_entry_bytes) = self.disk_cache.get(&key).await? {
            let raw_entry: RawEntry = bincode::deserialize(&raw_entry_bytes)?;

            let expected_header = Self::header(demo_path).await?;

            if raw_entry.header == expected_header {
                let value: GameSummary = bincode::deserialize(raw_entry.content)?;

                Ok(Some(value))
            } else {
                log::warn!("Header mismatch");
                Ok(None)
            }
        } else {
            Ok(None)
        }
    }

    async fn insert(
        &self,
        demo_path: impl AsRef<Self::Key>,
        game_summary: &Self::Value,
    ) -> Result<(), Self::Error> {
        let demo_path = demo_path.as_ref();

        log::trace!(target: "CACHE", "insert {demo_path}");

        let key = Self::cache_key(demo_path)?;
        let header = Self::header(demo_path).await?;

        let demo_bytes = bincode::serialize(game_summary)?;

        let entry = RawEntry {
            header,
            content: &demo_bytes,
        };
        let entry_bytes = bincode::serialize(&entry)?;

        self.disk_cache.insert(&key, &entry_bytes).await
    }

    async fn remove(&self, demo_path: impl AsRef<Self::Key>) -> Result<(), Self::Error> {
        let demo_path = demo_path.as_ref();

        log::trace!(target: "CACHE", "remove {demo_path}");

        let key = Self::cache_key(demo_path)?;

        self.disk_cache.remove(&key).await
    }
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use crate::{demo::read_demo_details, parsed_demo_cache::ParsedDemoCache, traits::Cache};

    #[tokio::test]
    async fn test_cache_roundtrip() {
        let cache_path = std::env::temp_dir().join("demoman_cache_test");
        let cache = ParsedDemoCache::new(cache_path.clone());
        let demo_path = "src/tests/data/demos/test_demo.dem";

        let original = read_demo_details(Path::new(demo_path)).expect("failed to parse test demo");

        cache.insert(demo_path, &original).await.unwrap();
        let read_back = cache.get(demo_path).await;

        // Clean up even if the test fails
        tokio::fs::remove_dir_all(cache_path).await.unwrap();
        let read_back = read_back.expect("get failed");

        assert_eq!(Some(original), read_back);
    }
}
