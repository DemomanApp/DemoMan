import { useLocalStorage } from "@mantine/hooks";

import { type StoreSchema, storeDefault } from "@/store";

export default function useStore<K extends keyof StoreSchema>(key: K) {
  return useLocalStorage<StoreSchema[K]>({
    key,
    defaultValue: storeDefault(key),
    // Force the hook to load the value on the first render,
    // instead of loading the default first and then
    // loading the store value in a useEffect hook later.
    // This might lead to slightly longer initial renders,
    // but prevents an invalid intermediate state.
    getInitialValueInEffect: false,
  });
}
