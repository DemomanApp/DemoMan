use std::path::Path;
use std::vec::Vec;

use log::info;

use tauri::State;

use crate::demo::errors::DemoReadError;
use crate::demo::{
    read_demos_in_directory, write_events_and_tags, Demo, DemoEvent, DemoJsonFileWriteError,
};
use crate::AppState;

/// Load the demos in the directory at `dir_path` into the demo cache.
/// Returns the number of demos loaded if successful.
#[tauri::command]
pub async fn get_demos_in_directory(
    dir_path: String,
    state: State<'_, AppState>,
) -> Result<Vec<Demo>, DemoReadError> {
    let mut demos_cache = state.demo_cache.lock().expect("Failed to lock mutex");
    let mut cached_directory = state.cached_directory.lock().expect("Failed to lock mutex");

    let dir_path = Path::new(&dir_path).canonicalize()?;

    info!("Reading demos from {}", dir_path.display());

    if Some(&dir_path) != cached_directory.as_ref() {
        // The cache contains the wrong or no directory
        info!("Cache miss! loading demos from disk...");

        *cached_directory = Some(dir_path.clone());
        *demos_cache = read_demos_in_directory(&dir_path)?
    } else {
        info!("Using cached demos");
    }

    // TODO: figure out how to avoid cloning here,
    // possibly by wrapping the demos in some sort
    // of smart pointer
    Ok(demos_cache.values().cloned().collect())
}

#[tauri::command]
pub fn set_demo_events(
    demo_name: String,
    new_events: Vec<DemoEvent>,
    state: State<'_, AppState>,
) -> Result<(), DemoJsonFileWriteError> {
    let mut demos_cache = state.demo_cache.lock().expect("Failed to lock mutex");
    if let Some(demo) = demos_cache.get_mut(&demo_name) {
        let json_path = demo.path.with_extension("json");
        write_events_and_tags(&json_path, &new_events, &demo.tags)?;
        demo.events = new_events;
    } else {
        return Err(DemoJsonFileWriteError::DemoNotFound);
    }
    Ok(())
}

#[tauri::command]
pub fn set_demo_tags(
    demo_name: String,
    new_tags: Vec<String>,
    state: State<'_, AppState>,
) -> Result<(), DemoJsonFileWriteError> {
    let mut demos_cache = state.demo_cache.lock().expect("Failed to lock mutex");
    if let Some(demo) = demos_cache.get_mut(&demo_name) {
        let json_path = demo.path.with_extension("json");
        write_events_and_tags(&json_path, &demo.events, &new_tags)?;
        demo.tags = new_tags;
    } else {
        return Err(DemoJsonFileWriteError::DemoNotFound);
    }
    Ok(())
}
