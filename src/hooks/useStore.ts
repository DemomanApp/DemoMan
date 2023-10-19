import { useLocalStorage } from "@mantine/hooks";

type DemoDirId = string;
type Path = string;

type DemoDir = {
  label: string;
  path: Path;
};

export type StoreSchema = {
  demoDirs: Record<DemoDirId, DemoDir>;
  rconPassword: string | undefined;
};

const storeDefaults: Required<StoreSchema> = {
  demoDirs: {},
  rconPassword: undefined,
};

export default function useStore<K extends keyof StoreSchema>(key: K) {
  return useLocalStorage<StoreSchema[K]>({
    key,
    defaultValue: storeDefaults[key],
    // Force the hook to load the value on the first render,
    // instead of loading the default first and then
    // loading the store value in a useEffect hook later.
    // This might lead to slightly longer initial renders,
    // but prevents an invalid intermediate state.
    getInitialValueInEffect: false,
  });
}
