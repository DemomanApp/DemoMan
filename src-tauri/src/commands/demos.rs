use std::{
    collections::hash_map::Entry,
    ffi::OsStr,
    fs::{copy, remove_file},
    path::Path,
    sync::Arc,
    vec::Vec,
};

use tauri::State;

use crate::{
    demo::{
        analyser::{GameDetailsAnalyser, GameSummary},
        read_demo, read_demos_in_directory, write_events_and_tags, Demo, DemoCommandError,
        DemoEvent,
    },
    DemoCache,
};

type DemoCommandResult<T> = Result<T, DemoCommandError>;

/// Log the invocation of a tauri command
macro_rules! log_command {
    ($($arg:tt)+) => (log::trace!(target: "IPC", $($arg)+))
}

// This can be removed once unwrap_or_clone lands in stable
// https://github.com/rust-lang/rust/issues/93610
trait UnwrapOrClone<T> {
    fn unwrap_or_clone(this: Self) -> T;
}

impl<T: Clone> UnwrapOrClone<T> for Arc<T> {
    fn unwrap_or_clone(this: Self) -> T {
        Arc::try_unwrap(this).unwrap_or_else(|arc| (*arc).clone())
    }
}

/// Fallible variant of [or_insert_with](std::collections::hash_map::Entry::or_insert_with)
trait OrTryInsertWith<'a, V, F: FnOnce() -> Result<V, E>, E> {
    fn or_try_insert_with(self, default: F) -> Result<&'a mut V, E>;
}

impl<'a, K, V, F, E> OrTryInsertWith<'a, V, F, E> for Entry<'a, K, V>
where
    F: FnOnce() -> Result<V, E>,
{
    fn or_try_insert_with(self, default: F) -> Result<&'a mut V, E> {
        match self {
            Entry::Occupied(entry) => Ok(entry.into_mut()),
            Entry::Vacant(entry) => Ok(entry.insert(default()?)),
        }
    }
}

#[tauri::command]
pub async fn get_demos_in_directory(
    dir_path: &Path,
    demo_cache: State<'_, DemoCache>,
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
    demo_cache: State<'_, DemoCache>,
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
    demo_cache: State<'_, DemoCache>,
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
    demo_cache: State<'_, DemoCache>,
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
    demo_cache: State<'_, DemoCache>,
) -> DemoCommandResult<()> {
    log_command!("move_demo {} {}", demo_path.display(), new_path.display());

    let mut demo_cache = demo_cache.lock().expect("Failed to lock mutex");
    let mut demo = UnwrapOrClone::unwrap_or_clone(
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
    demo_cache: State<'_, DemoCache>,
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
pub async fn get_demo_details(demo_path: &Path) -> DemoCommandResult<GameSummary> {
    log_command!("get_demo_details {}", demo_path.display());

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
