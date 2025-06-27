import { Link } from "react-router";

import { Anchor, Button, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { HeaderPortal } from "@/AppShell";
import { Fill } from "@/components";
import useStore from "@/hooks/useStore";
import DemoDirButton from "./DemoDirButton";
import { openAddDemoDirModal } from "@/modals/DemoDirModal";

export default () => {
  const [demoDirs] = useStore("demoDirs");

  const demoDirEntries = Object.entries(demoDirs);
  return (
    <>
      <HeaderPortal />
      <Fill>
        <Stack gap="md" align="center">
          <Title order={2} ta="center">
            Select a demo directory
          </Title>
          {demoDirEntries.length === 0 ? (
            <Text ta="center">No demo directories set.</Text>
          ) : (
            <Stack gap="sm" style={{ alignSelf: "stretch" }}>
              {demoDirEntries.map(([path, label]) => (
                <DemoDirButton path={path} label={label} key={path} />
              ))}
            </Stack>
          )}

          <Button
            leftSection={<IconPlus />}
            variant="subtle"
            onClick={openAddDemoDirModal}
          >
            Add demo directory
          </Button>

          <Text c="dimmed">
            You can manage your demo directories in the{" "}
            <Anchor component={Link} to="/settings">
              settings
            </Anchor>
            .
          </Text>
        </Stack>
      </Fill>
    </>
  );
};
