import { Link } from "react-router";

import { Anchor, Stack, Text, Title } from "@mantine/core";

import { HeaderPortal } from "@/AppShell";
import { Fill } from "@/components";
import useStore from "@/hooks/useStore";
import DemoDirButton from "./DemoDirButton";

export default () => {
  const [demoDirs] = useStore("demoDirs");

  const demoDirEntries = Object.entries(demoDirs);
  return (
    <>
      <HeaderPortal />
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
    </>
  );
};
