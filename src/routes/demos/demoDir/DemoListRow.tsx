import { memo } from "react";
import { useNavigate } from "react-router-dom";

import {
  ActionIcon,
  Group,
  HoverCard,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  Icon as IconType,
  IconCalendarEvent,
  IconDeviceTv,
  IconPencil,
  IconTrash,
  IconUser,
  IconPlayerPlayFilled,
  IconBookmarks,
  IconBookmark,
} from "@tabler/icons-react";
import { areEqual } from "react-window";

import { Demo, isStvDemo } from "@/demo";
import { IconKillstreak } from "@/components/icons";
import { openRenameDemoModal } from "@/modals/RenameDemoModal";
import MapBox from "./MapBox";
import Badges from "./Badges";

import classes from "./DemoListRow.module.css";
import { openDeleteDemoModal } from "@/modals/DeleteDemoModal";

type DemoListRowProps = {
  demo: Demo;
  selected: boolean;
  onClick(): void;
};

function HoverMenuItem({
  Icon,
  label,
  onClick,
}: {
  Icon: IconType;
  label: string;
  onClick(): void;
}) {
  return (
    <Tooltip label={label}>
      <ActionIcon
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick();
          event.stopPropagation();
        }}
        variant="transparent"
        color="gray"
      >
        <Icon size={20} />
      </ActionIcon>
    </Tooltip>
  );
}

function DemoListRow({ demo, selected, onClick }: DemoListRowProps) {
  const navigate = useNavigate();

  const reloadPage = () => navigate(0);

  const birthtime = new Date(demo.birthtime * 1000);

  return (
    <Paper
      className={classes.paper}
      radius="md"
      shadow="xl"
      onClick={onClick}
      data-selected={selected}
    >
      <MapBox mapName={demo.mapName} />
      <div className={classes.content}>
        <Group gap="xs">
          <Title order={3} style={{ lineHeight: 1 }}>
            {demo.name}
          </Title>
          {isStvDemo(demo) && (
            <Tooltip label="STV Demo">
              <IconDeviceTv />
            </Tooltip>
          )}
          <Badges items={demo.tags} max={3} />
        </Group>
        {!isStvDemo(demo) && (
          <Group gap={4}>
            <IconUser />
            <Text c="dimmed">{demo.clientName}</Text>
          </Group>
        )}
        <Group gap={4}>
          <IconCalendarEvent />
          <Text c="dimmed">{birthtime.toLocaleString()}</Text>
        </Group>
        {demo.events.length !== 0 && (
          <HoverCard
            withArrow
            position="right-end"
            styles={(theme) => ({
              dropdown: {
                padding: 0,
                paddingLeft: theme.spacing.xs,
              },
            })}
          >
            <HoverCard.Target>
              <Group gap={4}>
                <IconBookmarks />
                <Text c="dimmed">
                  {demo.events.length}{" "}
                  {demo.events.length === 1 ? "Bookmark" : "Bookmarks"}
                </Text>
              </Group>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <ScrollArea.Autosize
                mah="10rem"
                offsetScrollbars
                type="auto"
                styles={(theme) => ({
                  viewport: {
                    paddingTop: theme.spacing.xs,
                    paddingBottom: theme.spacing.xs,
                  },
                })}
              >
                <Stack align="stretch" gap={0}>
                  {demo.events.map((event, idx) => (
                    <Group key={idx} align="center" justify="left" gap={0}>
                      {event.name === "Bookmark" ? (
                        <IconBookmark />
                      ) : (
                        <IconKillstreak />
                      )}
                      <Text
                        style={{
                          flexGrow: 1,
                          marginRight: "var(--mantine-spacing-xs)",
                        }}
                      >
                        {event.value}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {event.tick}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </ScrollArea.Autosize>
            </HoverCard.Dropdown>
          </HoverCard>
        )}
      </div>
      <Paper shadow="xl" withBorder className={classes.menu}>
        <HoverMenuItem
          Icon={IconTrash}
          label="Delete"
          onClick={() => openDeleteDemoModal(demo, reloadPage)}
        />
        <HoverMenuItem
          Icon={IconPencil}
          label="Rename"
          // TODO: update the page without reloading
          onClick={() => openRenameDemoModal(demo, reloadPage)}
        />
        <HoverMenuItem
          Icon={IconPlayerPlayFilled}
          label="Play"
          onClick={() => {
            console.log("play");
          }}
        />
      </Paper>
    </Paper>
  );
}

export default memo(DemoListRow, areEqual);
