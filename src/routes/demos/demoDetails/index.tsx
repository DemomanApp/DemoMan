import { Suspense, useContext, useState } from "react";
import {
  Await,
  type LoaderFunction,
  redirect,
  useAsyncError,
  useLoaderData,
  useNavigate,
} from "react-router";

import * as log from "@tauri-apps/plugin-log";
import { revealItemInDir } from "@tauri-apps/plugin-opener";

import {
  ActionIcon,
  Alert,
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
  IconFolder,
  IconPencil,
  IconPlayerPlay,
  IconPlugX,
  IconServer,
  IconTimeline,
  IconTrash,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import { HeaderPortal } from "@/AppShell";
import { RconContext } from "@/RconContext";
import { getDemo, getDemoDetails, sendRconCommand, setDemoTags } from "@/api";
import {
  AsyncButton,
  Fill,
  HeaderButton,
  LoaderFallback,
  MapThumbnail,
} from "@/components";
import type { Demo, GameSummary } from "@/demo";
import useStore from "@/hooks/useStore";
import { openDeleteDemoModal } from "@/modals/DeleteDemoModal";
import { openRenameDemoModal } from "@/modals/RenameDemoModal";
import { decodeParam, formatDuration, formatFileSize } from "@/util";
import DemoTagsInput from "./DemoTagsInput";
import EventsList from "./EventsList";
import Highlights from "./Highlights";
import PlayerList from "./PlayerList";

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
  demo: Demo;
  details: Promise<GameSummary>;
};

export default function DemoDetailsView() {
  const { demo, details } = useLoaderData() as LoaderData;

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("players");

  const [rconPassword, _] = useStore("rconPassword");

  const rconState = useContext(RconContext);

  return (
    <>
      <HeaderPortal
        center={<DemoTitle demo={demo} />}
        right={
          <>
            <Tooltip label="Delete demo">
              <HeaderButton
                onClick={() => openDeleteDemoModal(demo, () => navigate(-1))}
              >
                <IconTrash />
              </HeaderButton>
            </Tooltip>
            <Tooltip label="Show in explorer">
              <HeaderButton
                onClick={() => {
                  revealItemInDir(demo.path).catch(log.error);
                }}
              >
                <IconFolder />
              </HeaderButton>
            </Tooltip>
            <DemoTagsInput
              tags={demo.tags}
              setTags={(tags: string[]) => {
                setDemoTags(demo.path, tags);
                navigate(0);
              }}
            />
          </>
        }
      />
      <Suspense fallback={<LoaderFallback />}>
        <Await resolve={demo} errorElement={<ErrorElement />}>
          {(demo: Demo) => (
            <Container className={classes.container}>
              <Stack style={{ height: "100%" }}>
                <Group align="stretch">
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
                          value={currentTab}
                          onChange={(newTab) =>
                            // biome-ignore lint/style/noNonNullAssertion: newTab cannot be null since `allowTabDeactivation` is not set on `Tabs`
                            setCurrentTab(newTab!)
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
    </>
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

  const demo = await getDemo(demoPath);

  return {
    demo,
    details: getDemoDetails(demoPath),
  } satisfies LoaderData;
};
