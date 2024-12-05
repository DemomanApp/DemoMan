use std::{
    collections::{HashMap, HashSet},
    ffi::OsStr,
    fs::remove_file,
    path::Path,
    sync::Arc,
};

use crate::{
    demo::{error::Result, read_demo, write_events_and_tags, Demo, DemoEvent, Error},
    std_ext::OrTryInsertWith,
};

pub struct DemoMetadataCache {
    cache: HashMap<String, Arc<Demo>>,
}

impl DemoMetadataCache {
    pub fn new() -> Self {
        Self {
            cache: HashMap::new(),
        }
    }

    pub fn get_demo_mut(&mut self, path: &str) -> Result<&mut Demo> {
        self.cache
            .entry(path.into())
            .or_try_insert_with(|| read_demo(path).map(Arc::new))
            .map(Arc::make_mut)
    }

    pub fn get_demo(&mut self, path: &str) -> Result<Arc<Demo>> {
        self.cache
            .entry(path.into())
            .or_try_insert_with(|| read_demo(path).map(Arc::new))
            .map(|demo| Arc::clone(demo))
    }

    pub fn set_events(&mut self, path: &str, events: Vec<DemoEvent>) -> Result<()> {
        let demo = self.get_demo_mut(path)?;

        write_events_and_tags(&demo.json_path(), &events, &demo.tags)?;
        demo.events = events;

        Ok(())
    }

    pub fn set_tags(&mut self, path: &str, tags: Vec<String>) -> Result<()> {
        let demo = self.get_demo_mut(path)?;

        write_events_and_tags(&demo.json_path(), &demo.events, &tags)?;
        demo.tags = tags;

        Ok(())
    }

    pub fn get_known_tags(&self) -> Vec<String> {
        self.cache
            .values()
            .flat_map(|demo| demo.tags.as_slice())
            .collect::<HashSet<&String>>()
            .into_iter()
            .cloned()
            .collect()
    }

    pub fn delete(&mut self, path: &str, trash: bool) -> Result<()> {
        self.cache.remove(path);

        let json_path = Path::new(path).with_extension("json");

        if trash {
            trash::delete(path)?;

            if json_path.exists() {
                trash::delete(json_path)?;
            }
        } else {
            remove_file(path)?;

            if json_path.exists() {
                remove_file(json_path)?;
            }
        }

        Ok(())
    }

    pub async fn rename(&mut self, path: &str, new_path: &str) -> Result<()> {
        tokio::fs::rename(path, new_path).await?;

        let json_path = Path::new(path).with_extension("json");
        let new_json_path = Path::new(new_path).with_extension("json");

        let _ = std::fs::rename(json_path, new_json_path);

        if let Some(mut cache_entry) = self.cache.remove(path) {
            let demo = Arc::make_mut(&mut cache_entry);

            demo.name = Path::new(new_path)
                .file_stem()
                .and_then(OsStr::to_str)
                .map(String::from)
                .ok_or(Error::BadFilename)?;

            demo.path = new_path.into();

            self.cache.insert(new_path.into(), cache_entry);
        }

        Ok(())
    }
}
