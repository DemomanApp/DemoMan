use std::io::{self, ErrorKind};

use serde::Serialize;

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
