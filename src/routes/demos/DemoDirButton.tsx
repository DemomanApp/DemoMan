import { Link } from "react-router";

import { Text, UnstyledButton } from "@mantine/core";

import type { Label, Path } from "@/store";
import classes from "./DemoDirButton.module.css";

export default function DemoDirButton({
  path,
  label,
}: {
  path: Path;
  label: Label;
}) {
  return (
    <UnstyledButton
      component={Link}
      to={`dir/${btoa(path)}`}
      variant="default"
      className={classes.root}
    >
      <Text>{label}</Text>
      <Text size="sm" c="dimmed">
        {path}
      </Text>
    </UnstyledButton>
  );
}
