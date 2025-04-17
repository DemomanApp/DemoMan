import { useNavigate } from "react-router";

import {
  ActionIcon,
  Checkbox,
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
  type Icon as IconType,
  IconCalendarEvent,
  IconDeviceTv,
  IconPencil,
  IconTrash,
  IconUser,
  IconPlayerPlayFilled,
  IconClockPlay,
  IconBookmarks,
  IconBookmark,
  IconFolder,
} from "@tabler/icons-react";

import { revealItemInDir } from "@tauri-apps/plugin-opener";
import * as log from "@tauri-apps/plugin-log";

import { formatDuration } from "@/util";
import { type Demo, isStvDemo } from "@/demo";
import { IconKillstreak } from "@/components/icons";
import { openRenameDemoModal } from "@/modals/RenameDemoModal";
import { openDeleteDemoModal } from "@/modals/DeleteDemoModal";
import { sendRconCommand } from "@/api";
import useStore from "@/hooks/useStore";
import MapBox from "./MapBox";
import Badges from "./Badges";

import classes from "./DemoListRow.module.css";

type DemoListRowProps = {
  demo: Demo;
  selected: boolean;
  onSelect: React.MouseEventHandler;
};

function HoverMenuItem({
  Icon,
  label,
  onClick,
}: {
  Icon: IconType;
  label: string;
  onClick: React.MouseEventHandler;
}) {
  return (
    <Tooltip label={label}>
      <ActionIcon
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          onClick(event);
        }}
        variant="transparent"
        color="gray"
      >
        <Icon size={20} />
      </ActionIcon>
    </Tooltip>
  );
}

export default function DemoListRow({
  demo,
  selected,
  onSelect,
}: DemoListRowProps) {
  const navigate = useNavigate();

  // TODO: update the page without reloading
  const reloadPage = () => navigate(0);

  const [rconPassword, _] = useStore("rconPassword");

  const birthtime = new Date(demo.birthtime * 1000);

  return (
    <Paper
      className={classes.paper}
      radius="md"
      shadow="xl"
      onClick={() => {
        navigate(`../show/${btoa(demo.path)}`);
      }}
      data-selected={selected}
    >
      <div
        className={classes.checkboxRoot}
        data-checked={selected}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(event);
        }}
      >
        <Checkbox.Indicator checked={selected} />
      </div>
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
          <span>&nbsp;</span>
          <IconClockPlay />
          <Text c="dimmed">{formatDuration(demo.playbackTime)}</Text>
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
                    <Group
                      key={`${idx}${event.tick}`}
                      align="center"
                      justify="left"
                      gap={0}
                    >
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
          onClick={() => openRenameDemoModal(demo, reloadPage)}
        />
        <HoverMenuItem
          Icon={IconPlayerPlayFilled}
          label="Play"
          onClick={() =>
            sendRconCommand(`playdemo "${demo.path}"`, rconPassword)
          }
        />
        <HoverMenuItem
          Icon={IconFolder}
          label="Show in explorer"
          onClick={() => revealItemInDir(demo.path).catch(log.error)}
        />
      </Paper>
    </Paper>
  );
}
