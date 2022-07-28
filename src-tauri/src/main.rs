#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_store::PluginBuilder as StorePluginBuilder;

mod commands;

fn main() {
    simple_logger::init().unwrap();

    tauri::Builder::default()
        .plugin(StorePluginBuilder::default().build())
        .invoke_handler(tauri::generate_handler![
            commands::logging::debug,
            commands::logging::error,
            commands::logging::info,
            commands::logging::warn
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
