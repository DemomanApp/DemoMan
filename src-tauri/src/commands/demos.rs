use std::{sync::Arc, vec::Vec};

use tauri::{async_runtime::Mutex, State};

use crate::{
    demo::{analyser::GameSummary, error::Result, Demo, DemoEvent},
    demo_cache::{DemoCache, Filter, SortKey},
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
    demo_list_cache: State<'_, Mutex<DemoCache>>,
) -> Result<Vec<Arc<Demo>>> {
    log_command!("get_demos_in_directory {dir_path}");

    let mut demo_cache = demo_list_cache.lock().await;

    demo_cache
        .get_sorted_and_filtered_demos_in_directory(dir_path, sort_key, reverse, filters, query)
}

#[tauri::command]
pub async fn set_demo_events(
    demo_path: &str,
    new_events: Vec<DemoEvent>,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> Result<()> {
    log_command!("set_demo_events {demo_path} {new_events:?}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.set_events(demo_path, new_events)
}

#[tauri::command]
pub async fn set_demo_tags(
    demo_path: &str,
    new_tags: Vec<String>,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> Result<()> {
    log_command!("set_demo_tags {demo_path} {new_tags:?}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.set_tags(demo_path, new_tags)
}

#[tauri::command]
pub async fn delete_demo(
    demo_path: &str,
    trash: bool,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> Result<()> {
    log_command!("delete_demo {demo_path}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.delete(demo_path, trash)
}

#[tauri::command]
pub async fn rename_demo(
    demo_path: &str,
    new_path: &str,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> Result<()> {
    log_command!("rename_demo {demo_path} {new_path}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.rename(demo_path, new_path).await
}

#[tauri::command]
pub async fn get_demo(
    demo_path: &str,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> Result<Arc<Demo>> {
    log_command!("get_demo {demo_path}");

    let mut demo_cache = demo_cache.lock().await;

    demo_cache.get_demo(demo_path)
}

#[tauri::command]
pub async fn get_demo_details(
    demo_path: &str,
    disk_cache: State<'_, Mutex<DemoCache>>,
) -> Result<GameSummary> {
    log_command!("get_demo_details {}", demo_path);

    let mut disk_cache = disk_cache.lock().await;

    disk_cache.get_demo_details(demo_path).await
}
