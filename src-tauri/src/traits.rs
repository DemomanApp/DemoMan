pub trait Cache {
    type Key: ?Sized;
    type Value;
    type Error;

    async fn get(&self, key: impl AsRef<Self::Key>) -> Result<Option<Self::Value>, Self::Error>;
    async fn insert(
        &self,
        key: impl AsRef<Self::Key>,
        value: &Self::Value,
    ) -> Result<(), Self::Error>;
    async fn remove(&self, key: impl AsRef<Self::Key>) -> Result<(), Self::Error>;

    // async fn get_or_insert_with<F, E>(
    //     &self,
    //     key: impl AsRef<Self::Key>,
    //     op: F,
    // ) -> Result<Self::Value, Self::Error>
    // where
    //     F: FnOnce() -> Result<Self::Value, E>,
    //     Self::Error: From<E>,
    //     Self::Key: Clone,
    // {
    //     if let Some(value) = self.get(&key).await? {
    //         Ok(value)
    //     } else {
    //         let value = op()?;

    //         self.insert(key, &value).await?;

    //         Ok(value)
    //     }
    // }
}
