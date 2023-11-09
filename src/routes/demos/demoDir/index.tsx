import { Suspense } from "react";
import {
  Await,
  Link,
  LoaderFunction,
  defer,
  redirect,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from "react-router-dom";

import { shell } from "@tauri-apps/api";

import { Alert, Menu } from "@mantine/core";
import {
  IconDots,
  IconSettings,
  IconPlug,
  IconFolder,
} from "@tabler/icons-react";

import { Demo } from "@/demo";
import AppShell, { HeaderButton } from "@/AppShell";
import { getDemosInDirectory } from "@/api";
import { Fill, LoaderFallback } from "@/components";
import { DemoDir, getStoreValue } from "@/store";
import DemoList, { SortOrder, SortKey } from "./DemoList";
import SearchInput from "./SearchInput";
import { SortControl } from "./SortControl";

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

export default () => {
  const { demoDir, demos } = useLoaderData() as {
    demoDir: DemoDir;
    demos: Promise<Demo[]>;
  };

  const [query, setQuery] = useSearchParam("query", "");
  const [sortKey, setSortKey] = useSearchParam<SortKey>("sort-by", "birthtime");
  const [sortOrder, setSortOrder] = useSearchParam<SortOrder>(
    "sort",
    "descending"
  );

  return (
    <AppShell
      header={{
        center: (
          <>
            <SearchInput query={query} setQuery={setQuery} />
          </>
        ),
        right: (
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
                  onClick={() => shell.open(demoDir.path)}
                >
                  Show in explorer
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        ),
      }}
    >
      <Suspense fallback={<LoaderFallback />}>
        <Await resolve={demos} errorElement={<ErrorElement />}>
          {(demos) => (
            <DemoList demos={demos} sortKey={sortKey} sortOrder={sortOrder} />
          )}
        </Await>
      </Suspense>
    </AppShell>
  );
};

export function ErrorElement() {
  const error = useRouteError();
  return (
    <Fill>
      <Alert color="red">
        An error occurred while scanning for demo files. Is the demo storage
        directory set?
        <div>Error: {String(error)}</div>
      </Alert>
    </Fill>
  );
}

export const loader: LoaderFunction = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const demoDirId = params.demoDirId!;

  const demoDirs = getStoreValue("demoDirs");

  const demoDir = demoDirs[demoDirId];

  if (demoDir === undefined) {
    // TODO redirect to a dedicated error page, like "/demos/invalid-id",
    //      that displays an error messages and offers to redirect
    return redirect("/demos");
  }

  return defer({
    demoDir: demoDir,
    demos: getDemosInDirectory(demoDir.path),
  });
};
