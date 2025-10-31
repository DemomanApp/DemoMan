export type Path = string;
export type Label = string;

export type StoreSchema = {
  demoDirs: Record<Path, Label>;
  rconPassword: string;
  enableLocationOverlay: boolean;
  skipTrash: boolean;
  preferredPlayOption: "rcon" | "copyCommand";
};

const storeDefaults: {
  [k in keyof StoreSchema]: StoreSchema[k] | (() => StoreSchema[k]);
} = {
  demoDirs: {},
  rconPassword: () => btoa(Math.random().toString()).substring(10, 20),
  enableLocationOverlay: false,
  skipTrash: false,
  preferredPlayOption: "rcon",
};

export function storeDefault<K extends keyof StoreSchema>(
  key: K
): StoreSchema[K] {
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

const isObject = (value: unknown) => typeof value === "object";
const isString = (value: unknown) => typeof value === "string";
const isBool = (value: unknown) => typeof value === "boolean";

const storeValidators: {
  [k in keyof StoreSchema]: (value: StoreSchema[k]) => boolean;
} = {
  demoDirs: isObject,
  rconPassword: isString,
  enableLocationOverlay: isBool,
  skipTrash: isBool,
  preferredPlayOption: (value) => value === "rcon" || value === "copyCommand",
};

export function validateStoreValue<K extends keyof StoreSchema>(
  key: K,
  value: StoreSchema[K]
): boolean {
  return storeValidators[key](value);
}

export function getStoreValue<K extends keyof StoreSchema>(
  key: K
): StoreSchema[K] {
  return deserialize(window.localStorage.getItem(key)) ?? storeDefault(key);
}
