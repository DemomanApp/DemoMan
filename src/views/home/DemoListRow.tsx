import { memo } from "react";

import { Box, Group, Paper, Text, Title } from "@mantine/core";
import {
  IconCalendarEvent,
  IconCheck,
  IconDeviceTv,
  IconUser,
} from "@tabler/icons";

import { Demo, isStvDemo } from "../../demo";
import { areEqual } from "react-window";
import EventsBox from "./EventsBox";
import MapBox from "./MapBox";
import Badges from "./Badges";

type DemoListRowProps = {
  demo: Demo;
  selected: boolean;
  selectionMode: boolean;
  onClick(): void;
};

function DemoListRow({
  demo,
  selected,
  selectionMode,
  onClick,
}: DemoListRowProps) {
  const birthtime = new Date(demo.birthtime * 1000);
  return (
    <Paper
      sx={(theme) => ({
        height: "120px",
        display: "flex",
        alignItems: "stretch",
        // Needed so the corners of the child elements respect the border radius
        overflow: "hidden",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
        },
        boxShadow: selectionMode
          ? `0 0 0 3px ${
              selected ? theme.colors.blue[8] : theme.colors.gray[8]
            }`
          : "none",
        cursor: "pointer",
      })}
      radius="md"
      shadow="xl"
      onClick={onClick}
    >
      {selectionMode && selected && (
        <Box
          sx={(theme) => ({
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
            left: 0,
            height: "40px",
            width: "40px",
            backgroundColor: theme.colors.blue[8],
            borderBottomRightRadius: "8px",
          })}
        >
          <IconCheck color="white" />
        </Box>
      )}
      <MapBox mapName={demo.mapName} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          padding: "8px",
          flexGrow: 1,
        }}
      >
        <Group spacing="xs">
          <Title order={3} inline>
            {demo.name}
          </Title>
          {isStvDemo(demo) && <IconDeviceTv />}
        </Group>
        <Badges items={demo.tags} max={3} />
        {!isStvDemo(demo) && (
          <Group spacing={4}>
            <IconUser color="grey" />
            <Text color="dimmed">{demo.clientName}</Text>
          </Group>
        )}
        <Group spacing={4}>
          <IconCalendarEvent color="gray" />
          <Text color="dimmed">{birthtime.toLocaleString()}</Text>
        </Group>
      </div>
      <EventsBox events={demo.events} />
    </Paper>
  );
}

export default memo(DemoListRow, areEqual);
