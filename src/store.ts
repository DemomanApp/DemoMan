export type Path = string;
export type Label = string;

export type StoreSchema = {
  demoDirs: Record<Path, Label>;
  rconPassword: string;
  enableLocationOverlay: boolean;
  skipTrash: boolean;
  showMultipleDemoDirs: boolean; // NEW: setting for showing multiple demo dirs
};

export function storeDefault<K extends keyof StoreSchema>(
  key: K
): StoreSchema[K] {
  const storeDefaults: {
    [k in keyof StoreSchema]: StoreSchema[k] | (() => StoreSchema[k]);
  } = {
    demoDirs: {},
    rconPassword: () => btoa(Math.random().toString()).substring(10, 20),
    enableLocationOverlay: false,
    skipTrash: false,
    showMultipleDemoDirs: false, // NEW: default to single folder mode
  };

  const defaultValue = storeDefaults[key];

  return typeof defaultValue === "function"
    ? defaultValue()
    : (defaultValue as StoreSchema[K]); // Is it possible to get rid of this cast?
}

function deserialize(storeValue: string | null) {
  if (storeValue !== null) {
    try {
      return JSON.parse(storeValue);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function getStoreValue<K extends keyof StoreSchema>(
  key: K
): StoreSchema[K] {
  return deserialize(window.localStorage.getItem(key)) ?? storeDefault(key);
}
