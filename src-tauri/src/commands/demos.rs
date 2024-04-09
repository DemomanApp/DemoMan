use std::{
    ffi::OsStr,
    fs::{copy, remove_file},
    path::Path,
    sync::{Arc, Mutex},
    vec::Vec,
};

use log::info;
use tauri::State;

use crate::{
    demo::{
        analyser::GameSummary, cache::DiskCache, read_demo, read_demo_details,
        read_demos_in_directory, write_events_and_tags, Demo, DemoCommandError, DemoEvent,
    },
    std_ext::OrTryInsertWith,
    DemoCache,
};

pub type DemoCommandResult<T> = Result<T, DemoCommandError>;

/// Log the invocation of a tauri command
macro_rules! log_command {
    ($($arg:tt)+) => (log::trace!(target: "IPC", $($arg)+))
}

#[tauri::command]
pub async fn get_demos_in_directory(
    dir_path: &Path,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> DemoCommandResult<Vec<Arc<Demo>>> {
    log_command!("get_demos_in_directory {}", dir_path.display());

    let mut demo_cache = demo_cache.lock().expect("Failed to lock mutex");
    let demos = read_demos_in_directory(dir_path)
        .or(Err(DemoCommandError::DirReadFailed))?
        .iter()
        .filter_map(|demo_name| {
            let demo_path = dir_path.join(demo_name).with_extension("dem");
            let demo = demo_cache
                .entry(demo_path.clone())
                .or_try_insert_with(|| read_demo(&demo_path).map(Arc::new))
                .ok()?;
            Some(Arc::clone(demo))
        })
        .collect();

    Ok(demos)
}

#[tauri::command]
pub async fn set_demo_events(
    demo_path: &Path,
    new_events: Vec<DemoEvent>,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> DemoCommandResult<()> {
    log_command!("set_demo_events {} {new_events:?}", demo_path.display());

    let mut demo_cache = demo_cache.lock().expect("Failed to lock mutex");
    let demo = Arc::make_mut(
        demo_cache
            .get_mut(demo_path)
            .ok_or(DemoCommandError::DemoNotFound)?,
    );

    let json_path = demo.path.with_extension("json");
    write_events_and_tags(&json_path, &new_events, &demo.tags)?;
    demo.events = new_events;
    Ok(())
}

#[tauri::command]
pub async fn set_demo_tags(
    demo_path: &Path,
    new_tags: Vec<String>,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> DemoCommandResult<()> {
    log_command!("set_demo_tags {} {new_tags:?}", demo_path.display());

    let mut demo_cache = demo_cache.lock().expect("Failed to lock mutex");
    let demo = Arc::make_mut(
        demo_cache
            .get_mut(demo_path)
            .ok_or(DemoCommandError::DemoNotFound)?,
    );

    let json_path = demo.path.with_extension("json");
    write_events_and_tags(&json_path, &demo.events, &new_tags)?;
    demo.tags = new_tags;
    Ok(())
}

#[tauri::command]
pub async fn delete_demo(
    demo_path: &Path,
    trash: bool,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> DemoCommandResult<()> {
    log_command!("delete_demo {}", demo_path.display());

    let mut demo_cache = demo_cache.lock().expect("Failed to lock mutex");
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
pub async fn move_demo(
    demo_path: &Path,
    new_path: &Path,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> DemoCommandResult<()> {
    log_command!("move_demo {} {}", demo_path.display(), new_path.display());

    let mut demo_cache = demo_cache.lock().expect("Failed to lock mutex");
    let mut demo = Arc::unwrap_or_clone(
        demo_cache
            .remove(demo_path)
            .ok_or(DemoCommandError::DemoNotFound)?,
    );

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

    demo_cache.insert(new_path.into(), Arc::new(demo));

    Ok(())
}

#[tauri::command]
pub async fn get_demo(
    demo_path: &Path,
    demo_cache: State<'_, Mutex<DemoCache>>,
) -> DemoCommandResult<Arc<Demo>> {
    log_command!("get_demo {}", demo_path.display());

    let mut demo_cache = demo_cache.lock().expect("Failed to lock mutex");

    let demo = demo_cache.entry(demo_path.into()).or_try_insert_with(|| {
        read_demo(demo_path)
            .map(Arc::new)
            .or(Err(DemoCommandError::FileReadFailed))
    })?;

    Ok(Arc::clone(demo))
}

#[tauri::command]
pub async fn get_demo_details(
    demo_path: &str,
    disk_cache: State<'_, DiskCache<GameSummary>>,
) -> DemoCommandResult<GameSummary> {
    log_command!("get_demo_details {}", demo_path);

    if let Some(game_summary) = disk_cache.get(demo_path).await {
        Ok(game_summary)
    } else {
        info!("Cache miss");
        let game_summary = read_demo_details(Path::new(demo_path))?;

        disk_cache.set(demo_path, &game_summary).await;

        Ok(game_summary)
    }
}
