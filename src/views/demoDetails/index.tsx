import { useState } from "react";
import { useParams } from "react-router-dom";

import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  List,
  Loader,
  Paper,
  Popover,
  Stack,
  Tabs,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCalendarEvent,
  IconCheck,
  IconClock,
  IconFileAnalytics,
  IconFileInfo,
  IconPencil,
  IconServer,
  IconTimeline,
  IconUser,
  IconUsers,
} from "@tabler/icons";

import { getDemoByName, getDemoDetails } from "../../api";
import { HeaderPortal } from "../../AppShell";
import { Async, Fill, MapThumbnail } from "../../components";
import { formatFileSize, formatPlaybackTime } from "../../util";
import PlayerList from "./PlayerList";
import { Demo } from "../../demo";
import Timeline from "./Timeline";

const useStyles = createStyles(() => ({
  container: {
    height: "100%",
    padding: "16px",
  },
  mapThumbnail: {
    width: 320,
    height: 180,
  },
}));

function DemoDetailsView({ demo }: { demo: Demo }) {
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);

  const { classes } = useStyles();

  return (
    <>
      <HeaderPortal>
        <Popover
          trapFocus
          opened={renamePopoverOpen}
          arrowSize={16}
          withArrow
          onClose={() => setRenamePopoverOpen(false)}
        >
          <Popover.Target>
            <Text
              align="center"
              weight={700}
              size="xl"
              inline
              style={{ cursor: "default", whiteSpace: "nowrap" }}
            >
              {demo.name}
            </Text>
          </Popover.Target>
          <Popover.Dropdown>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextInput
                placeholder="New name"
                size="sm"
                defaultValue={demo.name}
              />
              <ActionIcon variant="transparent" ml="xs">
                <IconCheck />
              </ActionIcon>
            </div>
          </Popover.Dropdown>
        </Popover>
        <Tooltip label="Rename demo">
          <ActionIcon
            variant="transparent"
            size="sm"
            onClick={() => setRenamePopoverOpen(!renamePopoverOpen)}
          >
            <IconPencil color="gray" />
          </ActionIcon>
        </Tooltip>
      </HeaderPortal>
      <Container className={classes.container}>
        <Stack>
          <Group>
            <Paper radius="md" withBorder style={{ overflow: "hidden" }}>
              <MapThumbnail
                mapName={demo.mapName}
                fallback={
                  <Stack
                    align="center"
                    justify="center"
                    spacing="xs"
                    style={{ width: "100%", height: "100%" }}
                  >
                    No thumbnail available.
                    <Button variant="subtle">Contribute</Button>
                  </Stack>
                }
                className={classes.mapThumbnail}
              />
              <Text align="center" size="lg">
                {demo.mapName}
              </Text>
            </Paper>
            <List>
              <List.Item icon={<IconUser />}>{demo.clientName}</List.Item>
              <List.Item icon={<IconServer />}>
                <span style={{ fontFamily: "monospace, monospace" }}>
                  {demo.serverName}
                </span>
              </List.Item>
              <List.Item icon={<IconCalendarEvent />}>
                {new Date(demo.birthtime * 1000).toLocaleString()}
              </List.Item>
              <List.Item icon={<IconFileAnalytics />}>
                {formatFileSize(demo.filesize)}
              </List.Item>
              <List.Item icon={<IconClock />}>
                {formatPlaybackTime(demo.playbackTime)}
              </List.Item>
            </List>
          </Group>
          <div style={{ flexGrow: 1 }}>
            <Async
              promiseFn={getDemoDetails}
              args={[demo.path]}
              loading={
                <Fill>
                  <Loader size="lg" variant="dots" />
                </Fill>
              }
              error={(error) => (
                <Fill>
                  <Alert color="red">
                    An error occured while loading this demo: {String(error)}
                  </Alert>
                </Fill>
              )}
              success={(gameSummary) => (
                <>
                  <Tabs defaultValue="players">
                    <Tabs.List>
                      <Tabs.Tab value="players" icon={<IconUsers size={14} />}>
                        Players
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="timeline"
                        icon={<IconTimeline size={14} />}
                      >
                        Timeline
                      </Tabs.Tab>
                      <Tabs.Tab value="info" icon={<IconFileInfo size={14} />}>
                        Info
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="players" pt="xs">
                      <PlayerList gameSummary={gameSummary} />
                    </Tabs.Panel>

                    <Tabs.Panel value="timeline" pt="xs">
                      <Timeline />
                    </Tabs.Panel>

                    <Tabs.Panel value="info" pt="xs">
                      TODO
                    </Tabs.Panel>
                  </Tabs>
                </>
              )}
            />
          </div>
        </Stack>
      </Container>
    </>
  );
}

export default function DemoDetailsViewAsyncWrapper() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const demoName = decodeURIComponent(useParams().demoName!);
  return (
    <Async
      promiseFn={getDemoByName}
      args={[demoName]}
      error={(error) => (
        <Center style={{ height: "100%" }}>
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error loading demo"
            color="red"
          >
            An error occured while loading this demo: {String(error)}
          </Alert>
        </Center>
      )}
      success={(demo) => <DemoDetailsView demo={demo} />}
    />
  );
}
