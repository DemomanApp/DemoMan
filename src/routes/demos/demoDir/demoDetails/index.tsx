import { Suspense } from "react";
import {
  Await,
  LoaderFunction,
  defer,
  useLoaderData,
  useRouteError,
  redirect,
} from "react-router-dom";

import * as log from "tauri-plugin-log-api";

import {
  ActionIcon,
  Alert,
  AppShell,
  Button,
  Center,
  Container,
  Group,
  List,
  Paper,
  Stack,
  Tabs,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCalendarEvent,
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

import { getDemo, getDemoDetails, sendCommand } from "@/api";
import { HeaderBar } from "@/AppShell";
import { AsyncButton, MapThumbnail, LoaderFallback } from "@/components";
import { formatFileSize, formatDuration, decodeParam } from "@/util";
import PlayerList from "./PlayerList";
import { Demo, GameSummary } from "@/demo";
import Highlights from "./Highlights";

import classes from "./demoDetails.module.css";

type LoaderData = {
  demo: Promise<Demo>;
  details: Promise<GameSummary>;
};

export default function DemoDetailsView() {
  // I'm not sure if this is the correct type. Sadly,
  // the type is not documented by react-router.
  const { demo, details } = useLoaderData() as LoaderData;

  return (
    <AppShell header={{ height: 50 }}>
      <AppShell.Header>
        <HeaderBar
          center={
            <Suspense fallback={<Text c="dimmed">loading...</Text>}>
              <Text
                ta="center"
                fw={700}
                size="xl"
                inline
                style={{ cursor: "default", whiteSpace: "nowrap" }}
                c="white"
              >
                <Await resolve={demo}>{(demo) => demo.name}</Await>
              </Text>
              <Tooltip label="Rename demo">
                <ActionIcon variant="transparent" size="sm">
                  <IconPencil color="gray" />
                </ActionIcon>
              </Tooltip>
            </Suspense>
          }
        />
      </AppShell.Header>
      <AppShell.Main>
        <Suspense fallback={<LoaderFallback />}>
          <Await resolve={demo} errorElement={<ErrorElement />}>
            {(demo: Demo) => (
              <Container className={classes.container}>
                <Stack style={{ height: "100%" }}>
                  <Group align="stretch">
                    <Paper
                      radius="md"
                      withBorder
                      style={{ overflow: "hidden" }}
                    >
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
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <List>
                        <List.Item icon={<IconUser />}>
                          {demo.clientName}
                        </List.Item>
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
                          {formatDuration(demo.playbackTime)}
                        </List.Item>
                      </List>
                      <AsyncButton
                        rightSection={<IconPlayerPlay />}
                        onClick={() => sendCommand(`playdemo "${demo.path}"`)}
                      >
                        Play demo
                      </AsyncButton>
                    </Stack>
                  </Group>
                  <div style={{ flexGrow: 1 }}>
                    <Suspense fallback={<LoaderFallback />}>
                      <Await resolve={details} errorElement={<ErrorElement />}>
                        {(gameSummary: GameSummary) => (
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
                                leftSection={<IconUsers size={14} />}
                              >
                                Players
                              </Tabs.Tab>
                              <Tabs.Tab
                                value="timeline"
                                leftSection={<IconTimeline size={14} />}
                              >
                                Timeline
                              </Tabs.Tab>
                              <Tabs.Tab
                                value="info"
                                leftSection={<IconFileInfo size={14} />}
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
                      </Await>
                    </Suspense>
                  </div>
                </Stack>
              </Container>
            )}
          </Await>
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}

export function ErrorElement() {
  const error = useRouteError();
  return (
    <Center style={{ height: "100%" }}>
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error loading demo"
        color="red"
      >
        An error occured while loading this demo: {String(error)}
      </Alert>
    </Center>
  );
}

export const loader: LoaderFunction = async ({ params }) => {
  const demoPath = decodeParam(params.demoPath);

  if (demoPath === undefined) {
    log.error(
      "demoPath was undefined in demoDetailsRoute. This should not happen."
    );
    return redirect("/demos");
  }

  return defer({
    demo: getDemo(demoPath),
    details: getDemoDetails(demoPath),
  } satisfies LoaderData);
};
