#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![warn(clippy::pedantic)]
#![allow(clippy::module_name_repetitions)]
#![allow(clippy::enum_variant_names)]
// Disabled because of false positives inside tauri macros
#![allow(clippy::used_underscore_binding)]

use log::LevelFilter;
use tauri::{async_runtime::Mutex, Manager};
use tauri_plugin_log::{
    fern::colors::{Color, ColoredLevelConfig},
    LogTarget,
};

use rcon::Connection;
use tokio::net::TcpStream;

use demo_cache::DemoCache;

mod commands;
mod demo;
mod demo_cache;
mod std_ext;

#[cfg(test)]
mod tests;

pub type RconConnection = Mutex<Option<Connection<TcpStream>>>;

fn build_log_plugin<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    const COLORS: ColoredLevelConfig = ColoredLevelConfig {
        error: Color::Red,
        warn: Color::Yellow,
        debug: Color::Blue,
        info: Color::Green,
        trace: Color::BrightBlack,
    };
    const LEVEL_FILTER: LevelFilter = if cfg!(debug_assertions) {
        LevelFilter::Trace
    } else {
        LevelFilter::Info
    };

    tauri_plugin_log::Builder::default()
        .targets([LogTarget::LogDir, LogTarget::Stdout])
        .level(LEVEL_FILTER)
        .format(move |out, message, record| {
            out.finish(format_args!(
                "[{:^5}][{}] {}",
                COLORS.color(record.level()),
                record.target(),
                message
            ));
        })
        .build()
}

fn main() {
    tauri::Builder::default()
        .plugin(build_log_plugin())
        .manage(RconConnection::default())
        .setup(|app| {
            let cache_path = app
                .path_resolver()
                .app_cache_dir()
                .ok_or("Failed to resolve cache directory")?;

            app.manage(Mutex::new(DemoCache::new(cache_path.join("parsed"))));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::demos::delete_demo,
            commands::demos::get_demo_details,
            commands::demos::get_demos_in_directory,
            commands::demos::get_demo,
            commands::demos::rename_demo,
            commands::demos::set_demo_events,
            commands::demos::set_demo_tags,
            commands::files::get_tf2_dir,
            commands::rcon::init_rcon,
            commands::rcon::send_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
