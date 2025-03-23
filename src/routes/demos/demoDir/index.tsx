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
  const [demos, setDemos] = useState<Demo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDemosInDirectory(path, sortKey, reverse, filters, query)
      .then(setDemos)
      .catch(setError);
  }, [path, sortKey, reverse, filters, query]);

  if (demos !== null) {
    return <DemoList demos={demos} />;
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
              <div style={{ margin: "auto" }} />
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
