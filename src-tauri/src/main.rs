#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![warn(clippy::pedantic)]
#![allow(clippy::module_name_repetitions)]
#![allow(clippy::enum_variant_names)]
// Disabled because of false positives inside tauri macros
#![allow(clippy::used_underscore_binding)]

use clap::Parser;
use log::LevelFilter;
use tauri::{async_runtime::Mutex, Manager};
use tauri_plugin_log::{
    fern::colors::{Color, ColoredLevelConfig},
    Target, TargetKind,
};

use cli::Args;
use demo_cache::DemoMetadataCache;

mod cli;
mod commands;
mod demo;
mod demo_cache;
mod disk_cache;
mod parsed_demo_cache;
mod std_ext;
mod traits;

#[cfg(test)]
mod tests;

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
        .targets([
            Target::new(TargetKind::LogDir {
                file_name: Some("logs".into()),
            }),
            Target::new(TargetKind::Stdout),
        ])
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
    let args = Args::parse();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(build_log_plugin())
        .manage(args)
        .setup(|app| {
            let cache_path = app
                .path()
                .app_cache_dir()
                .map_err(|error| format!("Failed to resolve cache directory: {error}"))?;

            app.manage(parsed_demo_cache::ParsedDemoCache::new(
                cache_path.join("parsed"),
            ));
            app.manage(Mutex::new(DemoMetadataCache::new()));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::cli::get_file_argument,
            commands::demos::delete_demo,
            commands::demos::get_demo,
            commands::demos::get_demo_details,
            commands::demos::get_demos_in_directory,
            commands::demos::get_known_tags,
            commands::demos::rename_demo,
            commands::demos::set_demo_events,
            commands::demos::set_demo_tags,
            commands::files::get_tf2_dir,
            commands::rcon::send_rcon_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
