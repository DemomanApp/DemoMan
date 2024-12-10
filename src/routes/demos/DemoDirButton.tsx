import { Link } from "react-router-dom";

import { Text, UnstyledButton } from "@mantine/core";

import classes from "./DemoDirButton.module.css";
import { Label, Path } from "@/store";

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
