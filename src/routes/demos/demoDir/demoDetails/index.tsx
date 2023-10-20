import { useState } from "react";
import {
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "react-router-dom";

import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Container,
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
  IconChevronLeft,
  IconClock,
  IconFileAnalytics,
  IconFileInfo,
  IconPencil,
  IconPlayerPlay,
  IconServer,
  IconTimeline,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import { getDemoByName, getDemoDetails, sendCommand } from "../../../../api";
import AppShell, { HeaderButton } from "../../../../AppShell";
import { Async, AsyncButton, Fill, MapThumbnail } from "../../../../components";
import { formatFileSize, formatDuration } from "../../../../util";
import PlayerList from "./PlayerList";
import { Demo } from "../../../../demo";
import Highlights from "./Highlights";

import classes from "./demoDetails.module.css";

export default function DemoDetailsView() {
  const demo = useLoaderData() as Demo;
  const navigate = useNavigate();

  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);

  return (
    <AppShell
      header={{
        left: (
          <HeaderButton icon={IconChevronLeft} onClick={() => navigate(-1)} />
        ),
        center: (
          <>
            <Popover
              trapFocus
              opened={renamePopoverOpen}
              arrowSize={16}
              withArrow
              onClose={() => setRenamePopoverOpen(false)}
            >
              <Popover.Target>
                <Text
                  ta="center"
                  fw={700}
                  size="xl"
                  inline
                  style={{ cursor: "default", whiteSpace: "nowrap" }}
                  c="white"
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
                  <ActionIcon variant="transparent" ml="xs" color="gray">
                    <IconCheck stroke={1.5} />
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
                <IconPencil color="gray" stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </>
        ),
      }}
    >
      <Container className={classes.container}>
        <Stack style={{ height: "100%" }}>
          <Group>
            <Paper radius="md" withBorder style={{ overflow: "hidden" }}>
              <MapThumbnail
                mapName={demo.mapName}
                fallback={
                  <Stack
                    align="center"
                    justify="center"
                    gap="xs"
                    style={{ width: "100%", height: "100%" }}
                  >
                    No thumbnail available.
                    <Button variant="subtle">Contribute</Button>
                  </Stack>
                }
                className={classes.mapThumbnail}
              />
              <Text ta="center" size="lg">
                {demo.mapName}
              </Text>
            </Paper>
            <Stack
              style={{
                height: "100%",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <List>
                <List.Item icon={<IconUser stroke={1.5} />}>
                  {demo.clientName}
                </List.Item>
                <List.Item icon={<IconServer stroke={1.5} />}>
                  <span style={{ fontFamily: "monospace, monospace" }}>
                    {demo.serverName}
                  </span>
                </List.Item>
                <List.Item icon={<IconCalendarEvent stroke={1.5} />}>
                  {new Date(demo.birthtime * 1000).toLocaleString()}
                </List.Item>
                <List.Item icon={<IconFileAnalytics stroke={1.5} />}>
                  {formatFileSize(demo.filesize)}
                </List.Item>
                <List.Item icon={<IconClock stroke={1.5} />}>
                  {formatDuration(demo.playbackTime)}
                </List.Item>
              </List>
              <AsyncButton
                rightSection={<IconPlayerPlay stroke={1.5} />}
                onClick={() => sendCommand(`playdemo "${demo.path}"`)}
              >
                Play demo
              </AsyncButton>
            </Stack>
          </Group>
          <div style={{ flexGrow: 1 }}>
            <Async
              promiseFn={getDemoDetails}
              args={[demo.path]}
              loading={
                <Fill>
                  <Loader size="lg" type="dots" />
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
                <Tabs
                  defaultValue="players"
                  // These styles prevent tall tab panels (mainly the timeline tab)
                  // from overflowing. I want the panel to take up exactly
                  // the remaining vertical space on the page,
                  // keeping eventual overflow to itself.
                  // minHeight: 0 is necessary due to a quirk of FlexBox,
                  // See https://stackoverflow.com/q/36230944/13118494
                  styles={{
                    root: {
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    },
                    panel: { flexGrow: 1, minHeight: 0 },
                  }}
                >
                  <Tabs.List>
                    <Tabs.Tab
                      value="players"
                      leftSection={<IconUsers size={14} stroke={1.5} />}
                    >
                      Players
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="timeline"
                      leftSection={<IconTimeline size={14} stroke={1.5} />}
                    >
                      Timeline
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="info"
                      leftSection={<IconFileInfo size={14} stroke={1.5} />}
                    >
                      Info
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="players" pt="xs">
                    <PlayerList gameSummary={gameSummary} />
                  </Tabs.Panel>

                  <Tabs.Panel value="timeline" pt="xs">
                    <Highlights gameSummary={gameSummary} />
                  </Tabs.Panel>

                  <Tabs.Panel value="info" pt="xs">
                    TODO
                  </Tabs.Panel>
                </Tabs>
              )}
            />
          </div>
        </Stack>
      </Container>
    </AppShell>
  );
}

export function ErrorElement() {
  const error = useRouteError();
  return (
    <Center style={{ height: "100%" }}>
      <Alert
        icon={<IconAlertCircle size={16} stroke={1.5} />}
        title="Error loading demo"
        color="red"
      >
        An error occured while loading this demo: {String(error)}
      </Alert>
    </Center>
  );
}

export const loader: LoaderFunction = async ({ params }): Promise<Demo> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const demoName = decodeURIComponent(params.demoName!);
  return getDemoByName(demoName);
};
