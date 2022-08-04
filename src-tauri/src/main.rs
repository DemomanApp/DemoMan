#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{collections::HashMap, path::PathBuf, str::FromStr, sync::Mutex};

use tauri_plugin_log::{LoggerBuilder as LogPluginBuilder, LogTarget};
use tauri_plugin_store::{PluginBuilder as StorePluginBuilder, StoreBuilder};

use demo::Demo;

mod commands;
mod demo;

#[cfg(test)]
mod tests;

#[derive(Default)]
pub struct AppState {
    pub demo_cache: Mutex<HashMap<String, Demo>>,
    pub cached_directory: Mutex<Option<PathBuf>>,
}

fn main() {
    let state = AppState::default();

    let store = StoreBuilder::new(PathBuf::from_str("config.json").unwrap()).build();

    tauri::Builder::default()
        .plugin(StorePluginBuilder::default().store(store).freeze().build())
        .plugin(
            LogPluginBuilder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout])
                .build(),
        )
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            commands::demos::get_demos_in_directory,
            commands::demos::set_demo_events,
            commands::demos::set_demo_tags,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
