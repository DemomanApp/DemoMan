import { MouseEventHandler, memo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

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
  IconPlayerPlay,
  IconBookmarks,
  IconBookmark,
} from "@tabler/icons-react";
import { areEqual } from "react-window";

import { Demo, isStvDemo } from "@/demo";
import { IconKillstreak } from "@/components/icons";
import { openRenameDemoModal } from "@/modals/RenameDemoModal";
import { openDeleteDemoModal } from "@/modals/DeleteDemoModal";
import { formatDuration } from "@/util"; // Assuming you have a utility to format duration
import { sendRconCommand } from "@/api";
import useStore from "@/hooks/useStore";
import MapBox from "./MapBox";
import Badges from "./Badges";

import classes from "./DemoListRow.module.css";

type DemoListRowProps = {
  demo: Demo;
  selected: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const DemoListRow: React.FC<DemoListRowProps> = ({ demo, selected, onClick }) => {
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
          <IconPlayerPlay />
          <Text c="dimmed">{formatDuration(demo.playbackTime)}</Text> {/* Display playback time */}
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
          onClick={() => openRenameDemoModal(demo, reloadPage)}
        />
        <HoverMenuItem
          Icon={IconPlayerPlay}
          label="Play"
          onClick={() =>
            sendRconCommand(`playdemo "${demo.path}"`, rconPassword)
          }
        />
      </Paper>
    </Paper>
  );
};

DemoListRow.propTypes = {
  demo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    birthtime: PropTypes.number.isRequired,
    filesize: PropTypes.number.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.oneOf(["Killstreak", "Bookmark"]).isRequired,
        value: PropTypes.string.isRequired,
        tick: PropTypes.number.isRequired,
      })
    ).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    serverName: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    mapName: PropTypes.string.isRequired,
    playbackTime: PropTypes.number.isRequired,
    numTicks: PropTypes.number.isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
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

export default memo(DemoListRow, areEqual);