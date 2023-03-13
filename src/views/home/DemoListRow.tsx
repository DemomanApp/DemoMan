import { memo } from "react";

import { createStyles, Group, Paper, Text, Title } from "@mantine/core";
import { IconCalendarEvent, IconDeviceTv, IconUser } from "@tabler/icons-react";

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

// TODO fix the background color when hovering,
// maybe add a hover effect to the thumbnail as well
const useStyles = createStyles(
  (
    theme,
    { selectionMode: _, selected }: { selectionMode: boolean; selected: boolean }
  ) => ({
    paper: {
      height: "120px",
      cursor: "pointer",
      display: "flex",
      alignItems: "stretch",
      // Needed so the corners of the child elements respect the border radius
      overflow: "hidden",
      "&:hover": {
        backgroundColor: selected
          ? theme.fn.variant({ variant: "light", color: theme.primaryColor })
              .background
          : theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      },
      transition: "background-color 150ms ease, border-color 150ms ease",
      boxShadow: selected
        ? `0px 0px 0px 2px ${
            theme.fn.variant({ variant: "outline", color: theme.primaryColor })
              .border
          }`
        : undefined,
      borderRadius: theme.radius.md,
      backgroundColor: selected
        ? theme.fn.variant({ variant: "light", color: theme.primaryColor })
            .background
        : theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.white,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "start",
      padding: "8px",
      flexGrow: 1,
    },
  })
);

function DemoListRow({
  demo,
  selected,
  selectionMode,
  onClick,
}: DemoListRowProps) {
  const { classes } = useStyles({ selectionMode, selected });
  const birthtime = new Date(demo.birthtime * 1000);
  return (
    <Paper className={classes.paper} radius="md" shadow="xl" onClick={onClick}>
      <MapBox mapName={demo.mapName} />
      <div className={classes.content}>
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
