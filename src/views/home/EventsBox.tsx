import { Box, Text } from "@mantine/core";
import { IconBookmarks } from "@tabler/icons";

import { DemoEvent } from "../../demo";
import { IconKillstreak } from "../../icons";

export default function EventsBox({ events }: { events: DemoEvent[] }) {
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
        borderLeft: `1px solid ${theme.colorScheme === "dark"
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
