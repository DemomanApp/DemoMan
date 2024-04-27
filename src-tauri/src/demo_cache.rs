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
        analyser::GameSummary, cache::DiskCache, error::Result, read_demo, read_demo_details,
        read_demos_in_directory, write_events_and_tags, Demo, DemoEvent, Error,
    },
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

fn filter_by(filters: &[Filter], demo: &Demo) -> bool {
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

#[derive(PartialEq, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Filter {
    Name(String),
    PlayerName(String),
    MapName(String),
}

#[derive(Default)]
pub struct DemoListCache {
    path: PathBuf,

    // Invariant: This should always be sorted by sort_key.
    demos: Vec<Arc<Demo>>,

    // Invariant: This should always be sorted and filtered.
    filtered_demos: Vec<Arc<Demo>>,

    filters: Vec<Filter>,
    sort_key: SortKey,
    reverse: bool,
}

impl DemoListCache {
    // TODO: optimize
    fn filter_and_sort(&mut self, sort_key: SortKey, reverse: bool, filters: Vec<Filter>) {
        if self.sort_key != sort_key {
            self.sort_by(sort_key, reverse);
        } else if self.reverse != reverse {
            self.demos.reverse();
            self.reverse = reverse;
        }

        self.filter_by(filters);
    }

    fn filter_by(&mut self, filters: Vec<Filter>) {
        self.filtered_demos = self
            .demos
            .iter()
            .filter(|demo| filter_by(&filters, demo))
            .cloned()
            .collect();

        self.filters = filters;
    }

    fn sort_by(&mut self, sort_key: SortKey, reverse: bool) {
        self.demos
            .sort_unstable_by(|d1, d2| compare_demos_by(sort_key, reverse, d1, d2));
        self.sort_key = sort_key;
        self.reverse = reverse;
    }
}

pub struct DemoCache {
    cache: HashMap<PathBuf, Arc<Demo>>,
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
        path: &Path,
        sort_key: SortKey,
        reverse: bool,
        filters: Vec<Filter>,
    ) -> Result<Vec<Arc<Demo>>> {
        let list_cache = self.list_cache.get_or_insert_with(DemoListCache::default);

        if list_cache.path == path {
            list_cache.filter_and_sort(sort_key, reverse, filters);
        } else {
            list_cache.demos = read_demos_in_directory(path, &mut self.cache)?;
            list_cache.path = path.to_path_buf();
            list_cache.sort_by(sort_key, reverse);
            list_cache.filter_by(filters);
        }

        Ok(list_cache.filtered_demos.clone())
    }

    pub fn get_demo_mut(&mut self, path: &Path) -> Result<&mut Demo> {
        self.cache
            .entry(path.into())
            .or_try_insert_with(|| read_demo(path).map(Arc::new))
            .map(Arc::make_mut)
    }

    pub fn get_demo(&mut self, path: &Path) -> Result<Arc<Demo>> {
        match self.cache.entry(path.into()) {
            Entry::Occupied(entry) => Ok(entry.get().clone()),
            Entry::Vacant(entry) => {
                let demo = read_demo(path).map(Arc::new)?;
                entry.insert(demo.clone());

                Ok(demo)
            }
        }
    }

    pub fn set_events(&mut self, path: &Path, events: Vec<DemoEvent>) -> Result<()> {
        let demo = self.get_demo_mut(path)?;

        let json_path = demo.path.with_extension("json");
        write_events_and_tags(&json_path, &events, &demo.tags).or(Err(Error::OtherIOError))?;
        demo.events = events;

        Ok(())
    }

    pub fn set_tags(&mut self, path: &Path, tags: Vec<String>) -> Result<()> {
        let demo = self.get_demo_mut(path)?;

        let json_path = demo.path.with_extension("json");
        write_events_and_tags(&json_path, &demo.events, &tags).or(Err(Error::OtherIOError))?;
        demo.tags = tags;

        Ok(())
    }

    pub fn delete(&mut self, path: &Path, trash: bool) -> Result<()> {
        self.cache.remove(path);

        if trash {
            trash::delete(path).or(Err(Error::FileDeleteFailed))?;

            if let Err(e) = trash::delete(path.with_extension("json")) {
                if let trash::Error::CouldNotAccess { target: _ } = e {
                    // We don't care if the file was not found
                    // because the demo has no JSON file.
                } else {
                    return Err(Error::OtherIOError);
                }
            }
        } else {
            remove_file(path).or(Err(Error::FileDeleteFailed))?;

            if let Err(e) = remove_file(path.with_extension("json")) {
                if e.kind() == std::io::ErrorKind::NotFound {
                    // We don't care if the file was not found
                    // because the demo has no JSON file.
                } else {
                    return Err(Error::OtherIOError);
                }
            }
        }

        Ok(())
    }

    pub fn rename(&mut self, path: &Path, new_path: &Path) -> Result<()> {
        std::fs::rename(path, new_path)?;
        let _ = std::fs::rename(path.with_extension("json"), new_path.with_extension("json"));

        if let Some(mut cache_entry) = self.cache.remove(path) {
            Arc::make_mut(&mut cache_entry).name = new_path
                .file_stem()
                .and_then(OsStr::to_str)
                .map(String::from)
                .ok_or(Error::BadFilename)?;

            self.cache.insert(new_path.into(), cache_entry);
        }

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
