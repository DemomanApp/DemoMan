import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";

import { appWindow } from "@tauri-apps/api/window";

import { AppShell, ActionIcon, Menu, Stack } from "@mantine/core";
import {
  IconMaximize,
  IconMinimize,
  IconX,
  IconLetterI,
  IconChevronLeft,
  IconChevronRight,
  IconDots,
  IconFolder,
  IconSettings,
  IconPlug,
} from "@tabler/icons-react";

import { AppShellProvider, NavbarButton } from "./AppShell";
import classes from "./App.module.css";

type HeaderIconProps = {
  icon: JSX.Element;
  onClick(): void;
};

const HeaderIcon = ({ icon, onClick }: HeaderIconProps) => {
  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      radius={0}
      size={40}
      onClick={onClick}
      tabIndex={-1}
    >
      {icon}
    </ActionIcon>
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const navbarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const unlistenFnPromise = appWindow.onResized(() =>
      appWindow.isMaximized().then(setIsMaximized)
    );
    return () => {
      unlistenFnPromise.then((unlistenFn) => unlistenFn()).catch(console.error);
    };
  }, []);

  return (
    <AppShellProvider value={{ headerRef, navbarRef }}>
      <AppShell
        padding={0}
        header={{ height: 40 }}
        navbar={{ width: 80, breakpoint: 0 }}
        classNames={classes}
      >
        <AppShell.Header data-tauri-drag-region>
          <HeaderIcon icon={<IconChevronLeft />} onClick={() => navigate(-1)} />
          <HeaderIcon icon={<IconChevronRight />} onClick={() => navigate(1)} />
          <div
            className={classes.headerContent}
            data-tauri-drag-region
            ref={headerRef}
          />
          <HeaderIcon
            // Pull a sneaky on them (The icon set has no plain "line" icon)
            icon={<IconLetterI style={{ transform: "rotate(90deg)" }} />}
            onClick={() => appWindow.minimize()}
          />
          <HeaderIcon
            icon={isMaximized ? <IconMinimize /> : <IconMaximize />}
            onClick={() => appWindow.toggleMaximize()}
          />
          <HeaderIcon icon={<IconX />} onClick={() => appWindow.close()} />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <AppShell.Section grow>
            <Stack gap="sm" ref={navbarRef}></Stack>
          </AppShell.Section>
          <AppShell.Section>
            <NavbarButton
              icon={IconSettings}
              onClick={() =>
                location.pathname === "/settings"
                  ? navigate(-1)
                  : navigate("/settings")
              }
              active={location.pathname === "/settings"}
            />
            <Menu shadow="md" width={200} position="right-end">
              <Menu.Target>
                <NavbarButton icon={IconDots} />
              </Menu.Target>
              <Menu.Dropdown>
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
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </AppShellProvider>
  );
}
