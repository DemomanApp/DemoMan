import { Suspense } from "react";
import {
  Await,
  Link,
  LoaderFunction,
  defer,
  redirect,
  useLoaderData,
  useRouteError,
} from "react-router-dom";

import { Alert, Input, Menu } from "@mantine/core";
import {
  IconSearch,
  IconDots,
  IconSettings,
  IconPlug,
  IconFolder,
} from "@tabler/icons-react";

import { Demo } from "@/demo";
import AppShell, { HeaderButton } from "@/AppShell";
import { getDemosInDirectory } from "@/api";
import { Fill, LoaderFallback } from "@/components";
import { getStoreValue } from "@/store";
import DemoList from "./DemoList";

export default () => {
  const { demos } = useLoaderData() as { demos: Promise<Demo[]> };

  return (
    <AppShell
      header={{
        center: (
          <Input
            variant="filled"
            placeholder="Search"
            style={{ width: "100%" }}
            size="sm"
            leftSection={<IconSearch size={18} />}
          />
        ),
        right: (
          <Menu
            shadow="md"
            position="bottom-end"
            transitionProps={{
              transition: "pop-top-right",
            }}
          >
            <Menu.Target>
              <HeaderButton icon={IconDots} />
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
              <Menu.Item leftSection={<IconFolder size={14} />}>
                Open demos folder
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ),
      }}
    >
      <Suspense fallback={<LoaderFallback />}>
        <Await resolve={demos} errorElement={<ErrorElement />}>
          {(demos) => <DemoList demos={demos} />}
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

  return defer({ demos: getDemosInDirectory(demoDir.path) });
};
