import { Badge, createStyles, Group, Paper, Text, Title } from "@mantine/core";
import {
  IconBookmarks,
  IconCalendarEvent,
  IconFileAnalytics,
  IconTags,
} from "@tabler/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Demo } from "../../api";
import { formatFileSize, normalizeMapName } from "../../util";

type DemoListRowProps = {
  demo: Demo;
};

function Badges({ items, max }: { items: string[]; max: number }) {
  const overflowAmount = items.length - max;
  const shownItems = items.slice(0, max);
  return (
    <>
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
        <Badge variant="outline" size="sm">
          +{overflowAmount}
        </Badge>
      )}
    </>
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
        <Text color="dimmed" align="center" className={classes.text}>
          {mapName}
        </Text>
      </div>
    </div>
  );
}

export default function DemoListRow({ demo }: DemoListRowProps) {
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
          justifyContent: "space-between",
          padding: "8px",
          flexGrow: 1,
        }}
      >
        <Title order={3} style={{ marginBottom: "auto" }}>
          {demo.name}
        </Title>
        <Group spacing="xs">
          <IconBookmarks />
          <Text color="dimmed">{demo.events.length}</Text>
        </Group>
        <Group spacing="xs">
          <IconTags />
          <Badges items={demo.tags} max={3} />
        </Group>
      </div>
      <div
        style={{
          display: "flex",
          marginLeft: "auto",
          flexDirection: "column",
          padding: "8px",
          width: "200px",
          minWidth: "200px",
        }}
      >
        <Group spacing="xs">
          <IconCalendarEvent />
          <Text color="dimmed">
            {new Date(demo.birthtime * 1000).toLocaleDateString()}
          </Text>
        </Group>
        <Group spacing="xs">
          <IconFileAnalytics />
          <Text color="dimmed">{formatFileSize(demo.filesize)}</Text>
        </Group>
      </div>
    </Paper>
  );
}
