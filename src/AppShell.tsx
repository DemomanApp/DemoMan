import { type ReactNode, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router";

import {
  AppShell as MantineAppShell,
  Menu,
  Portal,
  Tooltip,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDots,
  IconDownload,
  IconInfoCircle,
  IconPlug,
  IconSettings,
  IconTerminal,
} from "@tabler/icons-react";

import { HeaderButton, RconIndicator } from "@/components";

import { UpdateStateContext } from "./UpdateStateContext";
import { openUpdateModal } from "./modals/UpdateModal";

import classes from "./AppShell.module.css";

function HistoryButtons() {
  const navigate = useNavigate();

  // This isn't perfect and might break at some point.
  // If you find a better way to do this,
  // feel free to change it.
  const canGoBack = window.history.state.idx !== 0;
  const canGoForward = window.history.state.idx < window.history.length - 1;

  return (
    <>
      <HeaderButton onClick={() => navigate(-1)} disabled={!canGoBack}>
        <IconChevronLeft />
      </HeaderButton>
      <HeaderButton onClick={() => navigate(1)} disabled={!canGoForward}>
        <IconChevronRight />
      </HeaderButton>
    </>
  );
}

function HeaderBar() {
  return (
    <>
      <div className={classes.headerLeft}>
        <HistoryButtons />
      </div>
      <div className={classes.headerCenter} id="header-portal-center" />
      <div className={classes.headerRight} id="header-portal-right" />
    </>
  );
}

export function HeaderPortal({
  center,
  right,
}: { center?: ReactNode; right?: ReactNode }) {
  return (
    <>
      <Portal target="#header-portal-center">{center}</Portal>
      <Portal target="#header-portal-right">{right}</Portal>
    </>
  );
}

function UpdateIndicator() {
  const updateState = useContext(UpdateStateContext);

  if (updateState.status === "update_available") {
    return (
      <Tooltip label="Update available!" position="right">
        <HeaderButton
          onClick={() => {
            openUpdateModal(updateState.update);
          }}
        >
          <IconDownload color="var(--mantine-color-green-6)" />
        </HeaderButton>
      </Tooltip>
    );
  }
}

export function AppShell() {
  return (
    <MantineAppShell
      header={{ height: 50 }}
      navbar={{ width: 50, breakpoint: 0 }}
    >
      <MantineAppShell.Header>
        <HeaderBar />
      </MantineAppShell.Header>
      <MantineAppShell.Navbar>
        <MantineAppShell.Section grow />
        <MantineAppShell.Section>
          <UpdateIndicator />
          <RconIndicator />
          <Menu
            shadow="md"
            position="right-end"
            transitionProps={{
              transition: "pop-bottom-left",
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
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
