import { Link } from "react-router-dom";

import { DemoDir } from "@/store";
import { Text, UnstyledButton } from "@mantine/core";

import classes from "./DemoDirButton.module.css";

export default function DemoDirButton({
  id,
  demoDir,
}: {
  id: string;
  demoDir: DemoDir;
}) {
  return (
    <UnstyledButton
      component={Link}
      to={id}
      variant="default"
      className={classes.root}
    >
      <Text>{demoDir.label}</Text>
      <Text size="sm" c="dimmed">
        {demoDir.path}
      </Text>
    </UnstyledButton>
  );
}
