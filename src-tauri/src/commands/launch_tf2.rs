use std::{
    ffi::OsStr,
    process::{Child, Command},
};

use cfg_if::cfg_if;

use crate::demo::error::Result;

fn launch_game(args: impl IntoIterator<Item = impl AsRef<OsStr>>) -> Result<Child> {
    let mut steam = {
        cfg_if! {
            if #[cfg(target_os = "windows")] {
                use crate::demo::error::Error;

                let steam_path = steamlocate::SteamDir::locate()
                    .ok_or(Error::SteamNotInstalled)?
                    .path
                    .join("Steam.exe");
                Command::new(steam_path)
            } else {
                Command::new("steam")
            }
        }
    };

    let child = steam.args(["-applaunch", "440"]).args(args).spawn()?;

    Ok(child)
}

#[tauri::command]
pub fn launch_and_play_demo(demo_path: &str) -> Result<()> {
    let quoted_demo_path = format!("\"{demo_path}\"");
    launch_game(["-novid", "+playdemo", &quoted_demo_path])?;

    Ok(())
}
