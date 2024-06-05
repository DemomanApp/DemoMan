use std::{
    cmp::{Ord, Ordering},
    collections::{hash_map::Entry, HashMap},
    ffi::OsStr,
    fs::remove_file,
    path::{Path, PathBuf},
    sync::Arc,
};

use log::trace;
use serde::Deserialize;

use crate::{
    demo::{
        analyser::GameSummary, error::Result, read_demo, read_demo_details,
        read_demos_in_directory, write_events_and_tags, Demo, DemoEvent, Error,
    },
    disk_cache::DiskCache,
    std_ext::OrTryInsertWith,
};

#[derive(Default, Clone, Copy, PartialEq, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SortKey {
    #[default]
    Name,
    FileSize,
    Birthtime,
    MapName,
    EventCount,
    PlaybackTime,
}

fn compare_demos_by(key: SortKey, reverse: bool, d1: &Demo, d2: &Demo) -> Ordering {
    let ordering = match key {
        SortKey::Name => Ord::cmp(&d1.name, &d2.name),
        SortKey::FileSize => Ord::cmp(&d1.filesize, &d2.filesize),
        SortKey::Birthtime => Ord::cmp(&d1.birthtime, &d2.birthtime),
        SortKey::MapName => Ord::cmp(&d1.map_name, &d2.map_name),
        SortKey::EventCount => Ord::cmp(&d1.events.len(), &d2.events.len()),
        SortKey::PlaybackTime => {
            PartialOrd::partial_cmp(&d1.playback_time, &d2.playback_time).unwrap_or(Ordering::Equal)
        }
    };

    if reverse {
        ordering.reverse()
    } else {
        ordering
    }
}

fn filter_matches(demo: &Demo, filters: &[Filter]) -> bool {
    if filters.is_empty() {
        true
    } else {
        filters.iter().any(|filter| match filter {
            Filter::Name(name) => demo.name.contains(name),
            Filter::PlayerName(player_name) => demo.client_name.contains(player_name),
            Filter::MapName(map_name) => demo.map_name.contains(map_name),
        })
    }
}

fn query_matches(demo: &Demo, query: &str) -> bool {
    if query.is_empty() {
        return true;
    }

    let query = query.to_ascii_lowercase();

    let Demo {
        name,
        events,
        tags,
        server_name,
        client_name,
        map_name,
        ..
    } = demo;

    [name, server_name, client_name, map_name]
        .iter()
        .any(|field| field.to_ascii_lowercase().contains(&query))
        || events
            .iter()
            .any(|event| event.value.to_ascii_lowercase().contains(&query))
        || tags
            .iter()
            .any(|tag| tag.to_ascii_lowercase().contains(&query))
}

#[derive(PartialEq, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Filter {
    Name(String),
    PlayerName(String),
    MapName(String),
}

#[derive(Default)]
pub struct DemoListCache {
    path: String,

    // Invariant: This should always be sorted by sort_key.
    demos: Vec<Arc<Demo>>,

    // Invariant: This should always be sorted and filtered.
    filtered_demos: Vec<Arc<Demo>>,

    filters: Vec<Filter>,
    query: String,
    sort_key: SortKey,
    reverse: bool,
}

impl DemoListCache {
    // TODO: optimize
    fn filter_and_sort(
        &mut self,
        sort_key: SortKey,
        reverse: bool,
        filters: Vec<Filter>,
        query: String,
    ) {
        if self.sort_key != sort_key {
            self.sort_by(sort_key, reverse);
        } else if self.reverse != reverse {
            self.demos.reverse();
            self.reverse = reverse;
        }

        self.filter_by(filters, query);
    }

    fn filter_by(&mut self, filters: Vec<Filter>, query: String) {
        self.filtered_demos = self
            .demos
            .iter()
            .filter(|demo| filter_matches(demo, &filters))
            .filter(|demo| query_matches(demo, &query))
            .cloned()
            .collect();

        self.filters = filters;
        self.query = query;
    }

    fn sort_by(&mut self, sort_key: SortKey, reverse: bool) {
        self.demos
            .sort_unstable_by(|d1, d2| compare_demos_by(sort_key, reverse, d1, d2));
        self.sort_key = sort_key;
        self.reverse = reverse;
    }

    pub fn remove(&mut self, path: &str) {
        self.demos
            .iter()
            .enumerate()
            .find_map(|(index, demo)| if demo.path == path { Some(index) } else { None })
            .map(|index| self.demos.remove(index));
        self.filtered_demos
            .iter()
            .enumerate()
            .find_map(|(index, demo)| if demo.path == path { Some(index) } else { None })
            .map(|index| self.filtered_demos.remove(index));
    }
}

pub struct DemoCache {
    cache: HashMap<String, Arc<Demo>>,
    list_cache: Option<DemoListCache>,
    disk_cache: DiskCache<GameSummary>,
}

impl DemoCache {
    pub fn new(cache_path: PathBuf) -> Self {
        Self {
            cache: HashMap::new(),
            list_cache: None,
            disk_cache: DiskCache::at_path(cache_path),
        }
    }

    pub fn get_sorted_and_filtered_demos_in_directory(
        &mut self,
        path: &str,
        sort_key: SortKey,
        reverse: bool,
        filters: Vec<Filter>,
        query: String,
    ) -> Result<Vec<Arc<Demo>>> {
        let list_cache = self.list_cache.get_or_insert_with(DemoListCache::default);

        if list_cache.path == path {
            list_cache.filter_and_sort(sort_key, reverse, filters, query);
        } else {
            list_cache.demos = read_demos_in_directory(path, &mut self.cache)?;
            list_cache.path = path.into();
            list_cache.sort_by(sort_key, reverse);
            list_cache.filter_by(filters, query);
        }

        Ok(list_cache.filtered_demos.clone())
    }

    pub fn get_demo_mut(&mut self, path: &str) -> Result<&mut Demo> {
        self.cache
            .entry(path.into())
            .or_try_insert_with(|| read_demo(path).map(Arc::new))
            .map(Arc::make_mut)
    }

    pub fn get_demo(&mut self, path: &str) -> Result<Arc<Demo>> {
        match self.cache.entry(path.into()) {
            Entry::Occupied(entry) => Ok(entry.get().clone()),
            Entry::Vacant(entry) => {
                let demo = read_demo(path).map(Arc::new)?;
                entry.insert(demo.clone());

                Ok(demo)
            }
        }
    }

    pub fn set_events(&mut self, path: &str, events: Vec<DemoEvent>) -> Result<()> {
        let demo = self.get_demo_mut(path)?;

        write_events_and_tags(&demo.json_path(), &events, &demo.tags)
            .or(Err(Error::OtherIOError))?;
        demo.events = events;

        Ok(())
    }

    pub fn set_tags(&mut self, path: &str, tags: Vec<String>) -> Result<()> {
        let demo = self.get_demo_mut(path)?;

        write_events_and_tags(&demo.json_path(), &demo.events, &tags)
            .or(Err(Error::OtherIOError))?;
        demo.tags = tags;

        Ok(())
    }

    pub fn delete(&mut self, path: &str, trash: bool) -> Result<()> {
        self.cache.remove(path);
        if let Some(list_cache) = &mut self.list_cache {
            list_cache.remove(path);
        }

        let json_path = Path::new(path).with_extension("json");

        if trash {
            trash::delete(path).or(Err(Error::FileDeleteFailed))?;

            if json_path.exists() {
                trash::delete(json_path).or(Err(Error::FileDeleteFailed))?;
            }
        } else {
            remove_file(path).or(Err(Error::FileDeleteFailed))?;

            if json_path.exists() {
                remove_file(json_path).or(Err(Error::FileDeleteFailed))?;
            }
        }

        Ok(())
    }

    pub async fn rename(&mut self, path: &str, new_path: &str) -> Result<()> {
        std::fs::rename(path, new_path)?;

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

        // TODO rename the demo in place instead of invalidating the entire cache
        self.list_cache = None;

        let _ = self.disk_cache.rename(path, new_path).await;

        Ok(())
    }

    pub async fn get_demo_details(&mut self, path: &str) -> Result<GameSummary> {
        if let Some(game_summary) = self.disk_cache.get(path).await {
            Ok(game_summary)
        } else {
            trace!("Cache miss");
            let game_summary = read_demo_details(Path::new(path))?;

            self.disk_cache.set(path, &game_summary).await;

            Ok(game_summary)
        }
    }
}
