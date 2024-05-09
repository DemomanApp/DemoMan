import { Suspense } from "react";
import {
  Await,
  LoaderFunction,
  defer,
  useLoaderData,
  redirect,
  useAsyncError,
  useNavigate,
} from "react-router-dom";
import * as log from "tauri-plugin-log-api";
import { path } from "@tauri-apps/api";

import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
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
  TextInput,
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
  IconServer,
  IconTimeline,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import { getDemo, getDemoDetails, renameDemo, sendCommand } from "@/api";
import { HeaderBar } from "@/AppShell";
import { AsyncButton, MapThumbnail, LoaderFallback, Fill } from "@/components";
import { formatFileSize, formatDuration, decodeParam } from "@/util";
import PlayerList from "./PlayerList";
import EventsList from "./EventsList";
import { Demo, GameSummary } from "@/demo";
import Highlights from "./Highlights";
import useLocationState from "@/hooks/useLocationState";

import classes from "./demoDetails.module.css";

type RenameDemoModalProps = {
  oldName: string;
  handleSubmit(newName: string): void;
};

function RenameDemoModal({ oldName, handleSubmit }: RenameDemoModalProps) {
  const form = useForm<{ name: string }>({
    initialValues: {
      name: oldName,
    },
    validate: {
      name(value) {
        if (value.length === 0) {
          return "This cannot be empty";
        }
        return null;
      },
    },
    validateInputOnBlur: true,
  });

  return (
    <form onSubmit={form.onSubmit(({ name }) => handleSubmit(name))}>
      <Stack gap="xs">
        <TextInput
          label="Demo name"
          placeholder="Demo name"
          data-autofocus
          {...form.getInputProps("name")}
        />
        <Group gap="xs" justify="end">
          <Button variant="default" onClick={modals.closeAll}>
            Cancel
          </Button>
          <Button type="submit">Confirm</Button>
        </Group>
      </Stack>
    </form>
  );
}

function DemoTitle({ demo }: { demo: Demo }) {
  const navigate = useNavigate();

  async function openRenameModal() {
    const parentDirectory = await path.dirname(demo.path);

    async function handleSubmit(newName: string) {
      const newPath = await path.join(parentDirectory, `${newName}.dem`);

      await renameDemo(demo.path, newPath);

      modals.closeAll();

      navigate(`/demos/show/${encodeURIComponent(newPath)}`, {
        replace: true,
      });
    }

    modals.open({
      title: `Rename ${demo.name}`,
      centered: true,
      children: (
        <RenameDemoModal oldName={demo.name} handleSubmit={handleSubmit} />
      ),
    });
  }

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
        <ActionIcon variant="transparent" size="sm" onClick={openRenameModal}>
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

  const [locationState, setLocationState] = useLocationState({
    currentTab: "players",
  });

  return (
    <AppShell header={{ height: 50 }}>
      <AppShell.Header>
        <HeaderBar
          center={
            <Suspense fallback={<Text c="dimmed">loading...</Text>}>
              <Await resolve={demo}>
                {(demo) => <DemoTitle demo={demo} />}
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

  return defer({
    demo: getDemo(demoPath),
    details: getDemoDetails(demoPath),
  } satisfies LoaderData);
};
