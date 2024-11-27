use std::{
    cmp::Ordering,
    ffi::OsStr,
    fs::{self, read_dir, File},
    io::{Read, Write},
    path::{Path, PathBuf},
    sync::Arc,
    time::UNIX_EPOCH,
};

use bitbuffer::BitRead;
use log::warn;
use serde::{Deserialize, Serialize};

use crate::demo_cache::{DemoMetadataCache, Filter, SortKey};

use self::{
    analyser::{GameDetailsAnalyser, GameSummary},
    error::Result,
};

pub use self::error::Error;

pub mod analyser;
pub mod error;

pub const HEADER_SIZE: usize = 8 + 4 + 4 + 260 + 260 + 260 + 260 + 4 + 4 + 4 + 4;

#[cfg_attr(test, derive(PartialEq))]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum DemoEventType {
    Bookmark,
    Killstreak,
}

#[cfg_attr(test, derive(PartialEq))]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DemoEvent {
    pub name: DemoEventType,
    pub value: String,
    pub tick: u64,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Demo {
    pub name: String,
    pub path: String,
    pub birthtime: u64,
    pub filesize: u64,
    pub events: Vec<DemoEvent>,
    pub tags: Vec<String>,
    pub server_name: String,
    pub client_name: String,
    pub map_name: String,
    pub playback_time: f32,
    pub num_ticks: u32,
}

impl Demo {
    pub fn new(
        name: String,
        path: String,
        header: tf_demo_parser::demo::header::Header,
        events: Vec<DemoEvent>,
        tags: Vec<String>,
        metadata: &fs::Metadata,
    ) -> Self {
        Self {
            name,
            path,
            birthtime: metadata
                .modified()
                .unwrap_or(UNIX_EPOCH)
                .duration_since(UNIX_EPOCH)
                .unwrap_or_default()
                .as_secs(),
            filesize: metadata.len(),
            events,
            tags,
            server_name: header.server,
            client_name: header.nick,
            map_name: header.map,
            playback_time: header.duration,
            num_ticks: header.ticks,
        }
    }

    pub fn json_path(&self) -> PathBuf {
        Path::new(&self.path).with_extension("json")
    }
}

// This uses `&'a Vec` instead of just `Vec` so we don't have to copy
// the entire Vector to serialize it
#[derive(Serialize)]
pub struct DemoJsonFileSer<'a> {
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub events: &'a Vec<DemoEvent>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub tags: &'a Vec<String>,
}

// Since deserializing a struct with lifetimes is not supported,
// we have to do a bit of code duplication here and make a second
// struct for deserializing
#[derive(Deserialize)]
pub struct DemoJsonFileDe {
    pub events: Option<Vec<DemoEvent>>,
    pub tags: Option<Vec<String>>,
}

/// Read the header of the demo file at `path`.
///
/// # Errors
/// This fails in the following cases:
/// - The file is not able to be opened, possibly because it doesn't exist or the user has insufficient permissions
/// - The file is incomplete or has an invalid header
/// - The file header indicates that this demo was recorded for a game that is not TF2
pub fn read_demo_header(path: &str) -> Result<tf_demo_parser::demo::header::Header> {
    let mut file = File::open(path)?;

    let mut buf = [0u8; HEADER_SIZE];
    file.read_exact(&mut buf)?;

    let demo = tf_demo_parser::Demo::new(&buf);

    let mut stream = demo.get_stream();
    let header = tf_demo_parser::demo::header::Header::read(&mut stream)?;

    if header.game != *"tf" {
        return Err(Error::NotTf2);
    }

    Ok(header)
}

/// Read the JSON file at `json_path` and extract lists of tags and events.
/// If no JSON file exists or it is invalid, empty lists will be returned.
pub fn read_events_and_tags(json_path: &Path) -> (Vec<DemoEvent>, Vec<String>) {
    // This fails if the file does not exist or is not readable
    if let Ok(bytes) = fs::read(json_path) {
        // This fails if the file does not contain valid JSON matching the `DemoJsonFile` type.
        if let Ok(deserialized) = serde_json::from_slice::<DemoJsonFileDe>(&bytes) {
            return (
                deserialized.events.unwrap_or_default(),
                deserialized.tags.unwrap_or_default(),
            );
        }
        warn!("Invalid JSON file at {}", &json_path.display());
    }

    // If the JSON file does not exist or contains invalid content,
    // Return empty lists for events and tags
    (Vec::new(), Vec::new())
}

/// Read the demo at `path`.
/// This will also read events and tags from the associated JSON file, if it exists.
pub fn read_demo(path: &str) -> Result<Demo> {
    let name: String = Path::new(path)
        .file_stem()
        .ok_or(Error::BadFilename)?
        .to_str()
        .ok_or(Error::BadFilename)?
        .to_owned();
    let metadata = fs::metadata(path)?;
    if !metadata.is_file() {
        return Err(Error::NotAFile);
    }
    let header = read_demo_header(path)?;
    let (events, tags) = read_events_and_tags(&Path::new(path).with_extension("json"));
    Ok(Demo::new(
        name,
        path.into(),
        header,
        events,
        tags,
        &metadata,
    ))
}

/// Find all .dem files in the directory at `dir_path`
/// and return their file stem (name without extension)
pub fn read_demo_names_in_directory(dir_path: &str) -> Result<Vec<String>> {
    let dir_iterator = read_dir(dir_path)?;

    let mut demos = Vec::new();

    for dir_entry in dir_iterator
        .flatten()
        .filter(|entry| entry.file_type().is_ok_and(|file_type| file_type.is_file()))
    {
        let path = dir_entry.path();
        if path.extension() == Some(OsStr::new("dem")) {
            if let Some(stem) = path.file_stem().and_then(OsStr::to_str) {
                demos.push(stem.into());
            }
        }
    }

    Ok(demos)
}

pub fn read_demos_in_directory(
    dir_path: &str,
    demo_cache: &mut DemoMetadataCache,
) -> Result<Vec<Arc<Demo>>> {
    read_demo_names_in_directory(dir_path).map(|demos| {
        demos
            .iter()
            .filter_map(|demo_name| {
                let demo_path = PathBuf::from(dir_path)
                    .join(demo_name)
                    .with_extension("dem");

                // Safety: The PathBuf is constructed only from valid UTF-8 strings,
                // thus as_str will always succeed
                let demo_path_str = demo_path.to_str().unwrap();

                match demo_cache.get_demo(demo_path_str) {
                    Ok(demo) => Some(demo),
                    Err(error) => {
                        log::warn!("Could not load demo at {demo_path_str}: {error}");

                        None
                    }
                }
            })
            .collect()
    })
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

pub fn sort_demos(demos: &mut [Arc<Demo>], sort_key: SortKey, reverse: bool) {
    demos.sort_unstable_by(|d1, d2| compare_demos_by(sort_key, reverse, d1, d2));
}

pub fn filter_demos(demos: &[Arc<Demo>], filters: &[Filter], query: &str) -> Vec<Arc<Demo>> {
    demos
        .iter()
        .filter(|demo| filter_matches(demo, filters))
        .filter(|demo| query_matches(demo, query))
        .cloned()
        .collect()
}

pub fn write_events_and_tags(
    json_path: &Path,
    events: &Vec<DemoEvent>,
    tags: &Vec<String>,
) -> Result<()> {
    if events.is_empty() && tags.is_empty() {
        fs::remove_file(json_path)?;
        return Ok(());
    }

    let mut file = fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .create(true)
        .open(json_path)?;

    // Use tabs for indentation to reproduce the style TF2 produces
    let formatter = serde_json::ser::PrettyFormatter::with_indent(b"\t");
    let mut serializer = serde_json::Serializer::with_formatter(Vec::new(), formatter);
    let new_content = DemoJsonFileSer { events, tags };
    new_content.serialize(&mut serializer)?;

    file.write_all(&serializer.into_inner())?;
    Ok(())
}

pub fn read_demo_details(path: &Path) -> Result<GameSummary> {
    let file = fs::read(path)?;
    let demo = tf_demo_parser::Demo::new(&file);

    let analyser = GameDetailsAnalyser::default();

    let parser = tf_demo_parser::DemoParser::new_all_with_analyser(demo.get_stream(), analyser);
    let (_header, state) = parser.parse()?;

    Ok(state)
}
