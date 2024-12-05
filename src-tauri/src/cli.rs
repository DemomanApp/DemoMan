use std::sync::Arc;

use clap::Parser;
use serde::Serialize;

#[derive(Parser, Serialize)]
pub(crate) struct Args {
    #[arg()]
    pub file: Option<Arc<str>>,
}
