use tauri::State;

use rcon::Connection;

use crate::RconConnection;

#[tauri::command]
pub async fn send_command(
    command: String,
    rcon_connection: State<'_, RconConnection>,
) -> Result<String, ()> {
    let mut conn = rcon_connection.lock().await;

    if let Some(conn) = conn.as_mut() {
        let resp = conn.cmd(&command).await.or(Err(()))?;

        Ok(resp)
    } else {
        Err(())
    }
}

#[tauri::command]
pub async fn init_rcon(
    password: String,
    rcon_connection: State<'_, RconConnection>,
) -> Result<(), ()> {
    let mut conn = rcon_connection.lock().await;
    if conn.is_none() {
        let new_conn = Connection::builder()
            .connect("localhost:27969", &password)
            .await
            .or(Err(()))?;
        *conn = Some(new_conn);
    }
    Ok(())
}
