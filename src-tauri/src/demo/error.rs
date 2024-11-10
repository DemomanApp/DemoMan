use std::io::{self, ErrorKind};

use serde::Serialize;

use crate::disk_cache;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Serialize)]
pub enum Error {
    BadFilename,
    FileDeleteFailed,
    FileNotFound,
    FileOpenFailed,
    FileReadFailed,
    FileWriteFailed,
    NotAFile,
    NotTf2,
    OtherIOError,
    ParsingFailed,
    PermissionDenied,
    SerializationFailed,
}

impl From<io::Error> for Error {
    fn from(e: io::Error) -> Self {
        match e.kind() {
            ErrorKind::NotFound => Self::FileNotFound,
            ErrorKind::PermissionDenied => Self::PermissionDenied,
            ErrorKind::UnexpectedEof => Self::ParsingFailed,
            _ => Self::OtherIOError,
        }
    }
}

impl From<disk_cache::Error> for Error {
    fn from(e: disk_cache::Error) -> Self {
        match e {
            disk_cache::Error::Io(io_error) => Self::from(io_error),
            disk_cache::Error::Serde(_) => Self::SerializationFailed,
            disk_cache::Error::InvalidFilename(_) => Self::BadFilename,
        }
    }
}
