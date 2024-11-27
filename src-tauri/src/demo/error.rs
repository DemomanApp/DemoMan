use std::{fmt::Display, io};

use serde::{Serialize, Serializer};

use crate::disk_cache;

pub type Result<T, E = Error> = std::result::Result<T, E>;

fn serialize_as_string<T: Display, S>(value: &T, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    serializer.serialize_str(value.to_string().as_str())
}

#[derive(Debug, Serialize, thiserror::Error)]
pub enum Error {
    #[error("bad filename")]
    BadFilename,
    #[error("bincode (de-)serialization failed: {0}")]
    Bincode(
        #[from]
        #[serde(serialize_with = "serialize_as_string")]
        bincode::Error,
    ),
    #[error("bitbuffer error: {0}")]
    Bitbuffer(
        #[from]
        #[serde(serialize_with = "serialize_as_string")]
        bitbuffer::BitError,
    ),
    #[error("failed to trash file: {0}")]
    Trash(
        #[from]
        #[serde(serialize_with = "serialize_as_string")]
        trash::Error,
    ),
    #[error("not a file")]
    NotAFile,
    #[error("not TF2")]
    NotTf2,
    #[error("I/O error: {0}")]
    Io(
        #[from]
        #[serde(serialize_with = "serialize_as_string")]
        io::Error,
    ),
    #[error("parsing failed")]
    DemoParsing(
        #[from]
        #[serde(serialize_with = "serialize_as_string")]
        tf_demo_parser::ParseError,
    ),
    #[error("JSON (de-)serialization failed: {0}")]
    SerdeJson(
        #[from]
        #[serde(serialize_with = "serialize_as_string")]
        serde_json::Error,
    ),
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
