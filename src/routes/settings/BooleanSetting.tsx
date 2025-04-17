import { Switch, Text } from "@mantine/core";

import classes from "./settings.module.css";
import type { StoreSchema } from "@/store";
import useStore from "@/hooks/useStore";

type BooleanKey = {
  [storeKey in keyof StoreSchema]: StoreSchema[storeKey] extends boolean
    ? storeKey
    : never;
}[keyof StoreSchema];

// TODO:
// Changing a setting that causes another component to rerender,
// like toggling the location overlay, throws a react warning.
// This could probably be fixed by implementing a custom store using a react context.

export default function BooleanSetting({
  name,
  description,
  storeKey,
}: {
  name: string;
  description?: string;
  storeKey: BooleanKey;
}) {
  const [storeValue, setStoreValue] = useStore(storeKey);
  return (
    <div className={classes.setting}>
      <div
        className={classes.labelRowClickable}
        onClick={() => setStoreValue((v) => !v)}
      >
        <Text className={classes.label}>{name}</Text>
        <Switch size="md" checked={storeValue} className={classes.switch} />
      </div>
      {description !== undefined && <Text c="dimmed">{description}</Text>}
    </div>
  );
}
