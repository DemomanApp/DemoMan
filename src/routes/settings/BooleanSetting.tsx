import { Divider, Switch, Text } from "@mantine/core";

import classes from "./settings.module.css";

export default function BooleanSetting({
  name,
  description,
  value,
  setValue,
}: {
  name: string;
  description: string;
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className={classes.setting}>
      <div
        className={classes.labelRowClickable}
        onClick={() => setValue((v) => !v)}
      >
        <Text className={classes.label}>{name}</Text>
        <Switch size="md" checked={value} className={classes.switch} />
      </div>
      <Text c="dimmed">{description}</Text>
      <Divider mt="md" />
    </div>
  );
}
