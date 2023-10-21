use std::{
    collections::hash_map::Entry,
    ffi::OsStr,
    fs::{copy, remove_file},
    path::Path,
    vec::Vec,
};

use log::debug;

use tauri::State;

use crate::{
    demo::{
        analyser::{GameDetailsAnalyser, GameSummary},
        errors::DemoReadError,
        read_demo, read_demos_in_directory, write_events_and_tags, Demo, DemoCommandError,
        DemoEvent,
    },
    AppState,
};

#[tauri::command]
pub async fn get_demos_in_directory(dir_path: &Path) -> Result<Vec<Demo>, DemoReadError> {
    debug!(target: "IPC", "get_demos_in_directory {}", dir_path.display());
    Ok(read_demos_in_directory(dir_path)?
        .iter()
        .filter_map(|demo_name| {
            let demo_path = dir_path.join(demo_name).with_extension("dem");
            read_demo(&demo_path).ok()
        })
        .collect())
}

#[tauri::command]
pub fn set_demo_events(
    demo_path: &Path,
    new_events: Vec<DemoEvent>,
    state: State<'_, AppState>,
) -> Result<(), DemoCommandError> {
    debug!(target: "IPC", "set_demo_events {} {new_events:?}", demo_path.display());
    let mut demo_cache = state.demo_cache.lock().expect("Failed to lock mutex");
    let demo = demo_cache
        .get_mut(demo_path)
        .ok_or(DemoCommandError::DemoNotFound)?;
    let json_path = demo.path.with_extension("json");
    write_events_and_tags(&json_path, &new_events, &demo.tags)?;
    demo.events = new_events;
    Ok(())
}

#[tauri::command]
pub fn set_demo_tags(
    demo_path: &Path,
    new_tags: Vec<String>,
    state: State<'_, AppState>,
) -> Result<(), DemoCommandError> {
    debug!(target: "IPC", "set_demo_tags {} {new_tags:?}", demo_path.display());
    let mut demo_cache = state.demo_cache.lock().expect("Failed to lock mutex");
    let demo = demo_cache
        .get_mut(demo_path)
        .ok_or(DemoCommandError::DemoNotFound)?;
    let json_path = demo.path.with_extension("json");
    write_events_and_tags(&json_path, &demo.events, &new_tags)?;
    demo.tags = new_tags;
    Ok(())
}

#[tauri::command]
pub fn delete_demo(
    demo_path: &Path,
    trash: bool,
    state: State<'_, AppState>,
) -> Result<(), DemoCommandError> {
    debug!(target: "IPC", "delete_demo {}", demo_path.display());
    let mut demo_cache = state.demo_cache.lock().expect("Failed to lock mutex");
    let demo = demo_cache
        .get(demo_path)
        .ok_or(DemoCommandError::DemoNotFound)?;

    if trash {
        trash::delete(&demo.path).or(Err(DemoCommandError::FileDeleteFailed))?;

        if let Err(e) = trash::delete(demo.path.with_extension("json")) {
            if let trash::Error::CouldNotAccess { target: _ } = e {
                // We don't care if the file was not found
                // because the demo has no JSON file.
            } else {
                return Err(DemoCommandError::OtherIOError);
            }
        }
    } else {
        remove_file(&demo.path).or(Err(DemoCommandError::FileDeleteFailed))?;

        if let Err(e) = remove_file(demo.path.with_extension("json")) {
            if e.kind() == std::io::ErrorKind::NotFound {
                // We don't care if the file was not found
                // because the demo has no JSON file.
            } else {
                return Err(DemoCommandError::OtherIOError);
            }
        }
    }
    demo_cache.remove(demo_path);

    Ok(())
}

#[tauri::command]
pub fn move_demo(
    demo_path: &Path,
    new_path: &Path,
    state: State<'_, AppState>,
) -> Result<(), DemoCommandError> {
    debug!(target: "IPC", "move_demo {} {}", demo_path.display(), new_path.display());
    let mut demo_cache = state.demo_cache.lock().expect("Failed to lock mutex");
    let mut demo = demo_cache
        .remove(demo_path)
        .ok_or(DemoCommandError::DemoNotFound)?;

    let new_name = new_path
        .file_stem()
        .and_then(OsStr::to_str)
        .ok_or(DemoCommandError::BadFilename)?;

    let json_path = demo_path.with_extension("json");
    let new_json_path = new_path.with_extension("json");

    let json_file_exists = json_path.exists();

    // Check for existing files at destination
    if new_path.exists() || (json_file_exists && new_json_path.exists()) {
        return Err(DemoCommandError::FileExists);
    }

    copy(demo_path, new_path).or(Err(DemoCommandError::FileCopyFailed))?;
    remove_file(demo_path).or(Err(DemoCommandError::FileDeleteFailed))?;

    if json_file_exists {
        copy(&json_path, &new_json_path).or(Err(DemoCommandError::FileCopyFailed))?;
        remove_file(&json_path).or(Err(DemoCommandError::FileDeleteFailed))?;
    }

    demo.name = new_name.into();
    demo.path = new_path.into();

    demo_cache.insert(new_path.into(), demo);

    Ok(())
}

#[tauri::command]
pub fn get_demo(demo_path: &Path, state: State<'_, AppState>) -> Result<Demo, DemoCommandError> {
    debug!(target: "IPC", "get_demo {}", demo_path.display());
    let mut demo_cache = state.demo_cache.lock().expect("Failed to lock mutex");

    let demo = match demo_cache.entry(demo_path.into()) {
        Entry::Occupied(entry) => entry.get().clone(),
        Entry::Vacant(entry) => {
            let demo = read_demo(demo_path).or(Err(DemoCommandError::FileReadFailed))?;
            entry.insert(demo).clone()
        }
    };

    Ok(demo)
}

#[tauri::command]
pub async fn get_demo_details(demo_path: &Path) -> Result<GameSummary, DemoCommandError> {
    debug!(target: "IPC", "get_demo_details {}", demo_path.display());
    let file = std::fs::read(demo_path).or(Err(DemoCommandError::FileReadFailed))?;
    let demo = tf_demo_parser::Demo::new(&file);

    // TODO:
    // Construct the parser with arguments from the frontend
    // which specify the type of events to look for, or other options.

    let analyser = GameDetailsAnalyser::default();

    let parser = tf_demo_parser::DemoParser::new_all_with_analyser(demo.get_stream(), analyser);
    let (_header, state) = parser.parse().or(Err(DemoCommandError::ParsingFailed))?;

    Ok(state)
}
