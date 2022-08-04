use std::io;

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
        use std::io::ErrorKind::*;
        match e.kind() {
            NotFound => Self::FileNotFound,
            PermissionDenied => Self::FileNotReadable,
            UnexpectedEof => Self::InvalidHeader,
            _ => Self::OtherIOError,
        }
    }
}
