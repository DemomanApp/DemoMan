import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Badge,
  Box,
  createStyles,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBookmarks,
  IconCalendarEvent,
  IconDeviceTv,
  IconTags,
  IconUser,
} from "@tabler/icons";

import { normalizeMapName } from "../../util";
import { Demo, DemoEvent, isStvDemo } from "../../demo";
import { IconKillstreak } from "../../icons";

type DemoListRowProps = {
  demo: Demo;
};

function Badges({ items, max }: { items: string[]; max: number }) {
  if (items.length === 0) {
    return null;
  }
  const overflowAmount = items.length - max;
  const shownItems = items.slice(0, max);
  return (
    <div style={{ display: "flex" }}>
      <Group spacing={4}>
        <IconTags color="gray" />
        {shownItems.map((item) => (
          <Badge
            key={item}
            variant="filled"
            size="sm"
            style={{ maxWidth: "100px" }}
          >
            {item}
          </Badge>
        ))}
        {overflowAmount > 0 && (
          <Text size="sm" color="dimmed">
            +{overflowAmount} more
          </Text>
        )}
      </Group>
    </div>
  );
}

const useMapBoxStyles = createStyles((theme) => {
  const totalHeight = 120;
  const textBoxHeight = 24;
  const imageAspectRatio = 16 / 9;
  const width = (totalHeight - textBoxHeight) * imageAspectRatio;
  const border = `1px solid ${
    theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
  }`;
  return {
    wrapper: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    img: {
      height: totalHeight - textBoxHeight,
      width: width,
    },
    imgFallback: {
      height: totalHeight - textBoxHeight,
      width: width,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRight: border,
      borderBottom: border,
    },
    textBox: {
      height: textBoxHeight,
      borderRight: border,
    },
    text: { overflow: "hidden", textOverflow: "ellipsis", maxWidth: width },
  };
});

function MapBox({ mapName }: { mapName: string }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const { classes } = useMapBoxStyles();
  return (
    <div className={classes.wrapper}>
      {loadFailed ? (
        <div className={classes.imgFallback}>
          <Text color="dimmed" align="center">
            No thumbnail
            <br />
            available.
          </Text>
        </div>
      ) : (
        <img
          src={`/map_thumbnails/${normalizeMapName(mapName)}.png`}
          className={classes.img}
          onError={() => setLoadFailed(true)}
        />
      )}
      <div className={classes.textBox}>
        <Text
          color="dimmed"
          align="center"
          className={classes.text}
          weight={600}
        >
          {mapName}
        </Text>
      </div>
    </div>
  );
}

function EventsBox({ events }: { events: DemoEvent[] }) {
  if (events.length === 0) {
    return null;
  }

  const maxDisplayedEvents = 3;
  const displayedEvents = events.slice(0, maxDisplayedEvents);
  const overflowAmount = events.length - maxDisplayedEvents;

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        marginLeft: "auto",
        flexDirection: "column",
        padding: "8px",
        width: "180px",
        borderLeft: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[3]
        }`,
      })}
    >
      {displayedEvents.map((event, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          {event.name === "Killstreak" ? (
            <IconKillstreak color="gray" />
          ) : (
            <IconBookmarks color="gray" />
          )}
          <Text inline color="dimmed">
            {event.value}
          </Text>
        </div>
      ))}
      {overflowAmount > 0 && <div>+{overflowAmount} more</div>}
    </Box>
  );
}

export default function DemoListRow({ demo }: DemoListRowProps) {
  const birthtime = new Date(demo.birthtime * 1000);
  return (
    <Paper
      sx={(theme) => ({
        margin: "16px",
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
      })}
      radius="md"
      shadow="lg"
      component={Link}
      to={`/demo/${encodeURIComponent(demo.name)}`}
    >
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
