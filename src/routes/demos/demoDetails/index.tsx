import { Suspense, useContext } from "react";
import {
  Await,
  LoaderFunction,
  useLoaderData,
  redirect,
  useAsyncError,
  useNavigate,
} from "react-router";

import * as log from "@tauri-apps/plugin-log";

import {
  ActionIcon,
  Alert,
  AppShell,
  Button,
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
  IconBookmarks,
  IconCalendarEvent,
  IconClock,
  IconFileAnalytics,
  IconPencil,
  IconPlayerPlay,
  IconPlugX,
  IconServer,
  IconTimeline,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import {
  getDemo,
  getDemoDetails,
  sendRconCommand,
  setDemoTags,
} from "@/api";
import { HeaderBar } from "@/AppShell";
import { AsyncButton, MapThumbnail, LoaderFallback, Fill } from "@/components";
import { formatFileSize, formatDuration, decodeParam } from "@/util";
import PlayerList from "./PlayerList";
import EventsList from "./EventsList";
import { Demo, GameSummary } from "@/demo";
import Highlights from "./Highlights";
import DemoTagsInput from "./DemoTagsInput";
import useLocationState from "@/hooks/useLocationState";
import useStore from "@/hooks/useStore";
import { openRenameDemoModal } from "@/modals/RenameDemoModal";
import { RconContext } from "@/RconContext";

import classes from "./demoDetails.module.css";

function DemoTitle({ demo }: { demo: Demo }) {
  const navigate = useNavigate();

  return (
    <>
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
      <Tooltip label="Rename demo">
        <ActionIcon
          variant="transparent"
          size="sm"
          onClick={() =>
            openRenameDemoModal(demo, (newPath) => {
              navigate(`/demos/show/${btoa(newPath)}`, {
                replace: true,
              });
            })
          }
        >
          <IconPencil color="gray" />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

type LoaderData = {
  demo: Promise<Demo>;
  details: Promise<GameSummary>;
};

export default function DemoDetailsView() {
  // I'm not sure if this is the correct type. Sadly,
  // the type is not documented by react-router.
  const { demo, details } = useLoaderData() as LoaderData;

  const navigate = useNavigate();

  const [locationState, setLocationState] = useLocationState({
    currentTab: "players",
  });

  const [rconPassword, _] = useStore("rconPassword");

  const rconState = useContext(RconContext);

  return (
    <AppShell header={{ height: 50 }}>
      <AppShell.Header>
        <HeaderBar
          center={
            <Suspense fallback={<Text c="dimmed">loading...</Text>}>
              <Await resolve={demo} errorElement={<></>}>
                {(demo) => <DemoTitle demo={demo} />}
              </Await>
            </Suspense>
          }
          right={
            <Suspense>
              <Await
                resolve={demo}
                errorElement={<></>}
              >
                {(demo) => (
                  <DemoTagsInput
                    tags={demo.tags}
                    setTags={(tags: string[]) => {
                      setDemoTags(demo.path, tags);
                      navigate(0);
                    }}
                  />
                )}
              </Await>
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
                            <Button
                              variant="subtle"
                              component="a"
                              href="https://github.com/DemomanApp/DemoMan/wiki/Contributing-a-map-thumbnail"
                              target="_blank"
                            >
                              Contribute
                            </Button>
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
                      <Tooltip
                        disabled={rconState.status === "connected"}
                        label={
                          <span
                            style={{
                              lineHeight: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: "0.2rem",
                            }}
                          >
                            <IconPlugX />
                            {"RCON connection required"}
                          </span>
                        }
                      >
                        <AsyncButton
                          rightSection={<IconPlayerPlay />}
                          onClick={() =>
                            sendRconCommand(
                              `playdemo "${demo.path}"`,
                              rconPassword
                            )
                          }
                          disabled={rconState.status !== "connected"}
                        >
                          Play demo
                        </AsyncButton>
                      </Tooltip>
                    </Stack>
                  </Group>
                  <div style={{ flexGrow: 1 }}>
                    <Suspense fallback={<LoaderFallback />}>
                      <Await resolve={details} errorElement={<ErrorElement />}>
                        {(gameSummary: GameSummary) => (
                          <Tabs
                            value={locationState.currentTab}
                            onChange={(newTab) =>
                              // newTab cannot be null since `allowTabDeactivation` is not set on `Tabs`
                              setLocationState("currentTab", newTab!)
                            }
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
                                value="events"
                                leftSection={<IconBookmarks size={14} />}
                              >
                                Bookmarks
                              </Tabs.Tab>
                              <Tabs.Tab
                                value="timeline"
                                leftSection={<IconTimeline size={14} />}
                              >
                                Timeline
                              </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="players" pt="xs">
                              <PlayerList gameSummary={gameSummary} />
                            </Tabs.Panel>

                            <Tabs.Panel value="events" pt="xs">
                              <EventsList demo={demo} />
                            </Tabs.Panel>

                            <Tabs.Panel value="timeline" pt="xs">
                              <Highlights gameSummary={gameSummary} />
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

function ErrorElement() {
  const error = useAsyncError();
  return (
    <Fill>
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="An error occured while loading this demo"
        color="red"
      >
        {String(error)}
      </Alert>
    </Fill>
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

  return {
    demo: getDemo(demoPath),
    details: getDemoDetails(demoPath),
  } satisfies LoaderData;
};
