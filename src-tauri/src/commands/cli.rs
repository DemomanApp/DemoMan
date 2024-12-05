use std::sync::Arc;

use tauri::State;

#[tauri::command]
#[expect(clippy::needless_pass_by_value)]
pub fn get_file_argument(args: State<crate::cli::Args>) -> Option<Arc<str>> {
    args.file.as_ref().map(Arc::clone)
}
