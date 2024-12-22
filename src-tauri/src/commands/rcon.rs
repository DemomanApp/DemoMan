use tauri::State;

use rcon::Connection;
use tokio::{net::TcpStream, sync::Mutex};

pub struct RconConnection {
    inner: Connection<TcpStream>,
    password: String,
}

pub type RconConnectionState = Mutex<Option<RconConnection>>;

#[tauri::command]
pub async fn send_rcon_command(
    command: String,
    password: String,
    rcon_connection: State<'_, RconConnectionState>,
) -> Result<String, String> {
    let mut connection = rcon_connection.lock().await;

    let connection = match connection.as_mut() {
        Some(connection) if connection.password == password => connection,
        _ => {
            let new_connection = Connection::builder()
                .connect("localhost:27969", &password)
                .await
                .map_err(|error| error.to_string())?;

            connection.insert(RconConnection {
                inner: new_connection,
                password,
            })
        }
    };

    let response = connection
        .inner
        .cmd(&command)
        .await
        .map_err(|error| error.to_string())?;

    Ok(response)
}
