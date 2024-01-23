use std::io::{self, ErrorKind};

use serde::Serialize;

#[derive(Debug, Serialize)]
pub enum DemoReadError {
    FileNotFound,
    FileNotReadable,
    InvalidFilename,
    InvalidHeader,
    NotAFile,
    NotTF2,
    OtherIOError,
}

impl From<io::Error> for DemoReadError {
    fn from(e: io::Error) -> Self {
        match e.kind() {
            ErrorKind::NotFound => Self::FileNotFound,
            ErrorKind::PermissionDenied => Self::FileNotReadable,
            ErrorKind::UnexpectedEof => Self::InvalidHeader,
            _ => Self::OtherIOError,
        }
    }
}
