use std::{path::Path, sync::Arc, vec::Vec};

use tauri::{async_runtime::Mutex, State};

use crate::{
    demo::{
        analyser::GameSummary, error::Result, filter_demos, read_demo_details,
        read_demos_in_directory, sort_demos, Demo, DemoEvent,
    },
    demo_cache::{DemoMetadataCache, Filter, SortKey},
    parsed_demo_cache::ParsedDemoCache,
    traits::Cache,
};

/// Log the invocation of a tauri command
macro_rules! log_command {
    ($($arg:tt)+) => (log::trace!(target: "IPC", $($arg)+))
}

#[tauri::command]
pub async fn get_demos_in_directory(
    dir_path: &str,
    sort_key: SortKey,
    reverse: bool,
    filters: Vec<Filter>,
    query: String,
    demo_list_cache: State<'_, Mutex<DemoMetadataCache>>,
) -> Result<Vec<Arc<Demo>>> {
    log_command!("get_demos_in_directory {dir_path}");

    let mut demo_cache = demo_list_cache.lock().await;

    let mut demos = read_demos_in_directory(dir_path, &mut demo_cache)?;
    sort_demos(demos.as_mut_slice(), sort_key, reverse);
    let filtered_demos = filter_demos(&demos, &filters, &query);

    Ok(filtered_demos)
}

#[tauri::command]
pub async fn set_demo_events(
    demo_path: &str,
    new_events: Vec<DemoEvent>,
    demo_cache: State<'_, Mutex<DemoMetadataCache>>,
) -> Result<()> {
    log_command!("set_demo_events {demo_path} {new_events:?}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.set_events(demo_path, new_events)
}

#[tauri::command]
pub async fn set_demo_tags(
    demo_path: &str,
    new_tags: Vec<String>,
    demo_cache: State<'_, Mutex<DemoMetadataCache>>,
) -> Result<()> {
    log_command!("set_demo_tags {demo_path} {new_tags:?}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.set_tags(demo_path, new_tags)
}

#[tauri::command]
pub async fn get_known_tags(
    demo_cache: State<'_, Mutex<DemoMetadataCache>>,
) -> Result<Vec<String>> {
    log_command!("get_known_tags");

    let demo_cache = demo_cache.lock().await;

    Ok(demo_cache.get_known_tags())
}

#[tauri::command]
pub async fn delete_demo(
    demo_path: &str,
    trash: bool,
    demo_cache: State<'_, Mutex<DemoMetadataCache>>,
) -> Result<()> {
    log_command!("delete_demo {demo_path}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.delete(demo_path, trash)
}

#[tauri::command]
pub async fn rename_demo(
    demo_path: &str,
    new_path: &str,
    demo_cache: State<'_, Mutex<DemoMetadataCache>>,
    disk_cache: State<'_, ParsedDemoCache>,
) -> Result<()> {
    log_command!("rename_demo {demo_path} {new_path}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.rename(demo_path, new_path).await?;
    disk_cache.remove(demo_path).await?;

    Ok(())
}

#[tauri::command]
pub async fn get_demo(
    demo_path: &str,
    demo_cache: State<'_, Mutex<DemoMetadataCache>>,
) -> Result<Arc<Demo>> {
    log_command!("get_demo {demo_path}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.get_demo(demo_path)
}

#[tauri::command]
pub async fn get_demo_details(
    demo_path: &str,
    disk_cache: State<'_, ParsedDemoCache>,
) -> Result<GameSummary> {
    log_command!("get_demo_details {}", demo_path);

    match disk_cache.get(demo_path).await {
        Ok(Some(game_summary)) => {
            log::trace!("cache hit for {demo_path}");

            return Ok(game_summary);
        }
        Ok(None) => {
            log::trace!("cache miss for {demo_path}");
        }
        Err(error) => {
            log::warn!("could not read demo cache entry for {demo_path}: {error}");
        }
    }

    let game_summary = read_demo_details(Path::new(demo_path))?;

    if let Err(error) = disk_cache.insert(demo_path, &game_summary).await {
        // Log the error, but don't fail the entire operation
        log::error!("Could not insert cache entry: {error}");
    }

    Ok(game_summary)
}
