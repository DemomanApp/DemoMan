import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { open } from "@tauri-apps/plugin-shell";

import { Alert, AppShell, Menu } from "@mantine/core";
import {
  IconDots,
  IconSettings,
  IconPlug,
  IconFolder,
  IconAlertCircle,
  IconTerminal,
  IconInfoCircle,
} from "@tabler/icons-react";

import { Demo, DemoFilter, SortKey, SortOrder } from "@/demo";
import { HeaderBar } from "@/AppShell";
import { getDemosInDirectory } from "@/api";
import DemoList from "./DemoList";
import SearchInput from "./SearchInput";
import { SortControl } from "./SortControl";
import { Path } from "@/store";
import { HeaderButton, Fill, LoaderFallback } from "@/components";
import useLocationState from "@/hooks/useLocationState";
import useStore from "@/hooks/useStore";

type DemoListLoaderArgs = {
  path: string;
  sortKey: SortKey;
  reverse: boolean;
  filters: DemoFilter[];
  query: string;
};

function ErrorBox({ error }: { error: string }) {
  return (
    <Fill>
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="An error occurred while scanning for demo files"
        color="red"
      >
        {String(error)}
      </Alert>
    </Fill>
  );
}

function DemoListLoader({
  path,
  sortKey,
  reverse,
  filters,
  query,
}: DemoListLoaderArgs) {
  const [demoDirs] = useStore("demoDirs");
  const [showMultipleDemoDirs] = useStore("showMultipleDemoDirs");
  const [demos, setDemos] = useState<Demo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Map sortKey to actual Demo property
    function getSortValue(demo: Demo, sortKey: string) {
      switch (sortKey) {
        case "birthtime":
          return demo.birthtime;
        case "file_size":
          return demo.filesize;
        case "name":
          return demo.name;
        case "map_name":
          return demo.mapName;
        case "event_count":
          return demo.events?.length ?? 0;
        case "playback_time":
          return demo.playbackTime;
        default:
          return undefined;
      }
    }

    if (showMultipleDemoDirs) {
      Promise.all(
        Object.entries(demoDirs).map(async ([dirPath, label]) => {
          try {
            const demos = await getDemosInDirectory(dirPath, sortKey, reverse, filters, query);
            return demos.map((demo: Demo) => ({ ...demo, _demoDirLabel: label, _demoDirPath: dirPath }));
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            return [];
          }
        })
      )
        .then((results) => {
          const allDemos = results.flat();
          allDemos.sort((a, b) => {
            const aVal = getSortValue(a, sortKey);
            const bVal = getSortValue(b, sortKey);
            // Handle undefined/null
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return reverse ? 1 : -1;
            if (bVal == null) return reverse ? -1 : 1;
            // Compare
            if (typeof aVal === "string" && typeof bVal === "string") {
              return reverse ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
              return reverse ? bVal - aVal : aVal - bVal;
            }
            // Fallback to string compare
            return reverse
              ? String(bVal).localeCompare(String(aVal))
              : String(aVal).localeCompare(String(bVal));
          });
          setDemos(allDemos);
          return undefined; // Ensure a value is returned
        })
        .catch((e) => {
          setError(e instanceof Error ? e.message : String(e));
          return undefined; // Ensure a value is returned
        });
    } else {
      getDemosInDirectory(path, sortKey, reverse, filters, query)
        .then((demos) => setDemos(demos))
        .catch((e) => setError(e instanceof Error ? e.message : String(e)));
    }
  }, [path, sortKey, reverse, filters, query, showMultipleDemoDirs, demoDirs]);

  if (demos !== null) {
    return <DemoList demos={demos} showDirectoryLabel={showMultipleDemoDirs} />;
  } else if (error !== null) {
    return <ErrorBox error={error} />;
  } else {
    return <LoaderFallback />;
  }
}

export default () => {
  const { path: encodedPath } = useParams() as { path: Path };
  const path = atob(encodedPath);

  const [query, setQuery] = useLocationState("query", "");
  const [sortKey, setSortKey] = useLocationState<SortKey>(
    "sortKey",
    "birthtime"
  );
  const [sortOrder, setSortOrder] = useLocationState<SortOrder>(
    "sortOrder",
    "descending"
  );

  const filters: DemoFilter[] = [];

  return (
    <AppShell header={{ height: 50 }}>
      <AppShell.Header>
        <HeaderBar
          center={
            <SearchInput
              query={query}
              setQuery={setQuery}
              debounceInterval={500}
            />
          }
          right={
            <>
              <SortControl
                sortKey={sortKey}
                setSortKey={setSortKey}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
              <div className="autoMargin" />
              <Menu
                shadow="md"
                position="bottom-end"
                transitionProps={{
                  transition: "pop-top-right",
                }}
                withArrow
                arrowPosition="center"
                arrowSize={12}
              >
                <Menu.Target>
                  <HeaderButton>
                    <IconDots />
                  </HeaderButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconSettings size={14} />}
                    component={Link}
                    to="/settings"
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconPlug size={14} />}
                    component={Link}
                    to="/rcon-setup"
                  >
                    Set up RCON
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconFolder size={14} />}
                    onClick={() => open(path)}
                  >
                    Show in explorer
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconInfoCircle size={14} />}
                    component={Link}
                    to="/about"
                  >
                    About DemoMan
                  </Menu.Item>
                  {import.meta.env.DEV && (
                    <>
                      <Menu.Divider />
                      <Menu.Label>Devtools</Menu.Label>
                      <Menu.Item
                        leftSection={<IconTerminal size={14} />}
                        component={Link}
                        to="/rcon-console"
                      >
                        RCON console
                      </Menu.Item>
                    </>
                  )}
                </Menu.Dropdown>
              </Menu>
            </>
          }
        />
      </AppShell.Header>
      <AppShell.Main>
        <DemoListLoader
          path={path}
          sortKey={sortKey}
          reverse={sortOrder === "descending"}
          filters={filters}
          query={query}
        />
      </AppShell.Main>
    </AppShell>
  );
};
