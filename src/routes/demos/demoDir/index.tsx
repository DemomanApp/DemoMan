import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { shell } from "@tauri-apps/api";

import { Alert, AppShell, Menu } from "@mantine/core";
import {
  IconDots,
  IconSettings,
  IconPlug,
  IconFolder,
  IconAlertCircle,
} from "@tabler/icons-react";

import { Demo, DemoFilter, SortKey, SortOrder } from "@/demo";
import { HeaderButton, HeaderBar } from "@/AppShell";
import { getDemosInDirectory } from "@/api";
import DemoList from "./DemoList";
import SearchInput from "./SearchInput";
import { SortControl } from "./SortControl";
import { Path } from "@/store";
import { Fill, LoaderFallback } from "@/components";

function useSearchParam<T extends string>(
  name: string,
  fallback: T
): [T, (newValue: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = (searchParams.get(name) ?? fallback) as T;

  const setValue = (newValue: T) =>
    setSearchParams(
      (prev) => ({
        ...Object.fromEntries(prev.entries()),
        [name]: newValue,
      }),
      { replace: true }
    );

  return [value, setValue];
}

type DemoListLoaderArgs = {
  path: string;
  sortKey: SortKey;
  reverse: boolean;
  filters: DemoFilter[];
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
}: DemoListLoaderArgs) {
  const [demos, setDemos] = useState<Demo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDemosInDirectory(path, sortKey, reverse, filters)
      .then(setDemos)
      .catch(setError);
  }, [path, sortKey, reverse, filters]);

  if (demos !== null) {
    return <DemoList demos={demos} />;
  } else if (error !== null) {
    return <ErrorBox error={error} />;
  } else {
    return <LoaderFallback />;
  }
}

export default () => {
  const { path } = useParams() as { path: Path };

  const [query, setQuery] = useSearchParam("query", "");
  const [sortKey, setSortKey] = useSearchParam<SortKey>("sort-by", "birthtime");
  const [sortOrder, setSortOrder] = useSearchParam<SortOrder>(
    "sort",
    "descending"
  );

  const filters: DemoFilter[] = [];


  return (
    <AppShell header={{ height: 50 }}>
      <AppShell.Header>
        <HeaderBar
          center={
            <>
              <SearchInput query={query} setQuery={setQuery} />
            </>
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
                    onClick={() => shell.open(path)}
                  >
                    Show in explorer
                  </Menu.Item>
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
        />
      </AppShell.Main>
    </AppShell>
  );
};
