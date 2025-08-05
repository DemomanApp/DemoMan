use serde::{Serialize, Serializer};

use crate::disk_cache;

pub type Result<T, E = Error> = std::result::Result<T, E>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("bad filename")]
    BadFilename,
    #[error("bincode (de-)serialization failed: {0}")]
    Bincode(#[from] bincode::Error),
    #[error("bitbuffer error: {0}")]
    Bitbuffer(#[from] bitbuffer::BitError),
    #[error("failed to trash file: {0}")]
    Trash(#[from] trash::Error),
    #[error("not a file")]
    NotAFile,
    #[error("not TF2")]
    NotTf2,
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),
    #[error("parsing failed")]
    DemoParsing(#[from] tf_demo_parser::ParseError),
    #[error("JSON (de-)serialization failed: {0}")]
    SerdeJson(#[from] serde_json::Error),
}

impl From<disk_cache::Error> for Error {
    fn from(e: disk_cache::Error) -> Self {
        match e {
            disk_cache::Error::Io(io_error) => Self::from(io_error),
            disk_cache::Error::Serde(bincode_error) => Self::from(bincode_error),
            disk_cache::Error::InvalidFilename(_) => Self::BadFilename,
        }
    }
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_str())
    }
}
