import { ActionIcon, Stack, Text, Tooltip } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import useStore from "@/hooks/useStore";

import { drop } from "@/util";
import classes from "./settings.module.css";
import { openAddDemoDirModal } from "@/modals/DemoDirModal";

export default function DemoDirsSetting() {
  const [demoDirs, setDemoDirs] = useStore("demoDirs");

  return (
    <div className={classes.setting}>
      <div className={classes.labelRow}>
        <Text className={classes.label}>Demo Directories</Text>
        <Tooltip label="Add demo directory...">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={openAddDemoDirModal}
          >
            <IconPlus />
          </ActionIcon>
        </Tooltip>
      </div>
      <Text c="dimmed">
        These are the locations where DemoMan searches for demo files.
      </Text>
      <Stack align="stretch" pt="md" gap="sm">
        {Object.entries(demoDirs).map(([path, label]) => (
          <div key={path} className={classes.demoDir}>
            <div className={classes.labelRow}>
              <Text size="lg" fw={600} style={{ flex: 1 }}>
                {label}
              </Text>
              <ActionIcon
                variant="subtle"
                color="red.9"
                className={classes.demoDirAction}
                onClick={() => setDemoDirs(drop(path))}
              >
                <IconTrash />
              </ActionIcon>
            </div>
            <Text c="dimmed" style={{ wordBreak: "break-all" }}>
              {path}
            </Text>
          </div>
        ))}
      </Stack>
    </div>
  );
}
