use std::{
    ffi::OsStr,
    io,
    process::{Child, Command},
};

use crate::demo::error::Result;

fn launch_game(args: impl IntoIterator<Item = impl AsRef<OsStr>>) -> Result<Child, io::Error> {
    Command::new("steam")
        .args(["-applaunch", "440"])
        .args(args)
        .spawn()
}

#[tauri::command]
pub fn launch_and_play_demo(demo_path: &str) -> Result<()> {
    launch_game(["-novid", "+playdemo", demo_path])?;

    Ok(())
}
