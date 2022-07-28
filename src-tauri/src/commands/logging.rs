use log::{debug, error, info, warn};

#[tauri::command]
pub fn debug(message: String) {
    debug!(target:"WebView", "{}", message)
}

#[tauri::command]
pub fn error(message: String) {
    error!(target:"WebView", "{}", message)
}

#[tauri::command]
pub fn info(message: String) {
    info!(target:"WebView", "{}", message)
}

#[tauri::command]
pub fn warn(message: String) {
    warn!(target:"WebView", "{}", message)
}
