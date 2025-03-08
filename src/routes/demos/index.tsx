import useStore from "@/hooks/useStore";
import { Fill } from "@/components";
import DemoDirButton from "./DemoDirButton";
import { Anchor, AppShell, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";
import { HeaderBar } from "@/AppShell";

export default () => {
  const [demoDirs] = useStore("demoDirs");

  const demoDirEntries = Object.entries(demoDirs);
  return (
    <AppShell>
      <AppShell.Header>
        <HeaderBar />
      </AppShell.Header>
      <AppShell.Main>
        <Fill>
          <Stack gap="sm">
            <Title order={2} ta="center">
              Select a demo directory
            </Title>
            {demoDirEntries.length === 0 ? (
              <Text ta="center">No demo directories set.</Text>
            ) : (
              demoDirEntries.map(([path, label]) => (
                <DemoDirButton path={path} label={label} key={path} />
              ))
            )}

            <Text ta="center">
              {/*
                TODO: Maybe allow demo directories to be added in-place?
                      Or maybe add functionality to link to a specific setting
                      and have it highlighted         
              */}
              You can add or remove demo directories in the{" "}
              <Anchor component={Link} to="/settings">
                settings
              </Anchor>
              .
            </Text>
          </Stack>
        </Fill>
      </AppShell.Main>
    </AppShell>
  );
};
