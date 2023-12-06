export type Path = string;
export type Label = string;

export type StoreSchema = {
  demoDirs: Record<Path, Label>;
  rconPassword: string | undefined;
  enableLocationOverlay: boolean;
  skipTrash: boolean;
};

export const storeDefaults: Required<StoreSchema> = {
  demoDirs: {},
  rconPassword: undefined,
  enableLocationOverlay: false,
  skipTrash: false,
};

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
  return deserialize(window.localStorage.getItem(key)) ?? storeDefaults[key];
}
