import { useState, useEffect } from "react";

import store, { SchemaType } from "../../common/store";

export default <K extends keyof SchemaType>(
  key: K,
  defaultValue?: Required<SchemaType>[K]
): [SchemaType[K], (newValue: SchemaType[K]) => void] => {
  const [value, setStateValue] = useState(
    defaultValue === undefined ? store.get(key) : store.get(key, defaultValue)
  );
  const setValue = (newValue: SchemaType[K]) => {
    setStateValue(newValue);
    store.set(key, newValue);
  };

  useEffect(() => {
    const unsubscribe = store.onDidChange(key, (newValue, _oldValue) => {
      // Cast is needed because newValue *could* be undefined if the key would get removed from the config file.
      // However, we either have default values set (so we never actually get undefined, even if the key is missing),
      // or we treat undefined as a possible value anyway. Thus, newValue should always hold a valid value.
      setStateValue(newValue as SchemaType[K]);
    });
    return () => {
      unsubscribe();
    };
  });

  return [value, setValue];
};
