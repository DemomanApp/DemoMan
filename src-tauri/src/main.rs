#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    collections::HashMap,
    path::PathBuf,
    sync::{Arc, Mutex},
};

use tauri::async_runtime::Mutex as AsyncMutex;
use tauri_plugin_log::{
    fern::colors::{Color, ColoredLevelConfig},
    LogTarget,
};

use rcon::Connection;
use tokio::net::TcpStream;

use demo::Demo;

mod commands;
mod demo;

#[cfg(test)]
mod tests;

pub type DemoCache = HashMap<PathBuf, Arc<Demo>>;

#[derive(Default)]
pub struct AppState {
    pub demo_cache: Mutex<DemoCache>,

    // We use the Mutex type provided by the tauri async runtime here
    // because we need to hold its content across an .await point.
    // The Mutex in std::sync will not work in this situation.
    pub rcon_connection: AsyncMutex<Option<Connection<TcpStream>>>,
}

fn main() {
    let state = AppState::default();

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout])
                .with_colors(ColoredLevelConfig {
                    error: Color::Red,
                    warn: Color::Yellow,
                    debug: Color::Blue,
                    info: Color::Green,
                    trace: Color::BrightBlack,
                })
                .build(),
        )
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            commands::demos::delete_demo,
            commands::demos::get_demo_details,
            commands::demos::get_demos_in_directory,
            commands::demos::get_demo,
            commands::demos::move_demo,
            commands::demos::set_demo_events,
            commands::demos::set_demo_tags,
            commands::files::get_tf2_dir,
            commands::rcon::init_rcon,
            commands::rcon::send_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
