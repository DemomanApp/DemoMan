import { useLocalStorage } from "@mantine/hooks";

export type StoreSchema = {
  demoPaths: string[];
};

const storeDefaults: Required<StoreSchema> = {
  demoPaths: [],
};

export function useStore<K extends keyof StoreSchema>(key: K) {
  return useLocalStorage<StoreSchema[K]>({
    key,
    defaultValue: storeDefaults[key],
  });
}
