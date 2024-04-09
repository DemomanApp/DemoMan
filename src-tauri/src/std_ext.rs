//! Standard library extensions

use std::collections::hash_map::Entry;

/// Fallible variant of [`or_insert_with`](std::collections::hash_map::Entry::or_insert_with)
pub trait OrTryInsertWith<'a, V, F: FnOnce() -> Result<V, E>, E> {
    fn or_try_insert_with(self, default: F) -> Result<&'a mut V, E>;
}

impl<'a, K, V, F, E> OrTryInsertWith<'a, V, F, E> for Entry<'a, K, V>
where
    F: FnOnce() -> Result<V, E>,
{
    fn or_try_insert_with(self, default: F) -> Result<&'a mut V, E> {
        match self {
            Entry::Occupied(entry) => Ok(entry.into_mut()),
            Entry::Vacant(entry) => Ok(entry.insert(default()?)),
        }
    }
}
