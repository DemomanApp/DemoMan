#[tauri::command]
pub async fn send_rcon_command(command: String, password: String) -> Result<String, String> {
    rcon::Connection::builder()
        .connect("localhost:27969", &password)
        .await
        .map_err(|error| error.to_string())?
        .cmd(&command)
        .await
        .map_err(|error| error.to_string())
}
