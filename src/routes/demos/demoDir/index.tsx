import { Suspense } from "react";
import {
  Await,
  Link,
  LoaderFunction,
  defer,
  redirect,
  useAsyncError,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";

import { shell } from "@tauri-apps/api";
import * as log from "tauri-plugin-log-api";

import { Alert, AppShell, Menu } from "@mantine/core";
import {
  IconDots,
  IconSettings,
  IconPlug,
  IconFolder,
  IconAlertCircle,
} from "@tabler/icons-react";

import { Demo } from "@/demo";
import { HeaderButton, HeaderBar } from "@/AppShell";
import { getDemosInDirectory } from "@/api";
import { Fill, LoaderFallback } from "@/components";
import DemoList, { SortOrder, SortKey } from "./DemoList";
import SearchInput from "./SearchInput";
import { SortControl } from "./SortControl";
import { decodeParam } from "@/util";
import { Path } from "@/store";

function useSearchParam<T extends string>(
  name: string,
  fallback: T
): [T, (newValue: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = (searchParams.get(name) ?? fallback) as T;

  const setValue = (newValue: T) =>
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev.entries()),
      [name]: newValue,
    }));

  return [value, setValue];
}

type LoaderData = {
  demos: Promise<Demo[]>;
  path: Path;
};

export default () => {
  const { demos, path } = useLoaderData() as LoaderData;

  const [query, setQuery] = useSearchParam("query", "");
  const [sortKey, setSortKey] = useSearchParam<SortKey>("sort-by", "birthtime");
  const [sortOrder, setSortOrder] = useSearchParam<SortOrder>(
    "sort",
    "descending"
  );

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
        <Suspense fallback={<LoaderFallback />}>
          <Await resolve={demos} errorElement={<ErrorElement />}>
            {(demos) => (
              <DemoList demos={demos} sortKey={sortKey} sortOrder={sortOrder} />
            )}
          </Await>
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
};

function ErrorElement() {
  const error = useAsyncError();
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

export const loader: LoaderFunction = async ({ params }) => {
  const demoDirPath = decodeParam(params.demoDirPath);

  if (demoDirPath === undefined) {
    log.error(
      "demoDirPath was undefined in demoDirRoute. This should not happen."
    );
    return redirect("/demos");
  }

  return defer({
    path: demoDirPath,
    demos: getDemosInDirectory(demoDirPath),
  } satisfies LoaderData);
};
