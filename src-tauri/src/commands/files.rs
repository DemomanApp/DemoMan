use serde::Serialize;
use steamlocate::SteamDir;

#[derive(Clone, Debug, Serialize)]
pub enum TF2DirError {
    /// Could not find Steam installed on the current system
    SteamNotFound,
    /// Found Steam, but could not find TF2 within the Steam installation directory
    Tf2NotFound,
}

impl From<steamlocate::Error> for TF2DirError {
    fn from(_value: steamlocate::Error) -> Self {
        TF2DirError::SteamNotFound
    }
}

#[tauri::command]
pub fn get_tf2_dir() -> Result<String, TF2DirError> {
    const TF2_ID: u32 = 440;

    let steam_dir = SteamDir::locate()?;
    let (tf2, library) = steam_dir
        .find_app(TF2_ID)?
        .ok_or(TF2DirError::Tf2NotFound)?;

    Ok(String::from(
        library.resolve_app_dir(&tf2).to_string_lossy(),
    ))
}
