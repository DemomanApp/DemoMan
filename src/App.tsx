import { useEffect, useRef, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";

import { appWindow } from "@tauri-apps/api/window";

import {
  AppShell,
  Navbar,
  Header,
  Stack,
  Menu,
  ActionIcon,
} from "@mantine/core";
import {
  IconSettings,
  IconDots,
  IconFolder,
  IconArrowLeft,
  IconArrowRight,
  IconMaximize,
  IconMinimize,
  IconX,
  IconLetterI,
} from "@tabler/icons";

import { AppShellProvider, NavbarButton } from "./AppShell";

import HomeView from "./views/home";
import SettingsView from "./views/settings";
import DemoDetailsView from "./views/demoDetails";

type HeaderIconProps = {
  icon: JSX.Element;
  onClick(): void;
};

const HeaderIcon = ({ icon, onClick }: HeaderIconProps) => {
  return (
    <ActionIcon
      variant="subtle"
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
        navbar={
          <Navbar width={{ base: 80 }} p="md">
            <Navbar.Section grow>
              <Stack ref={navbarRef} spacing="sm" />
            </Navbar.Section>
            <Navbar.Section>
              <Menu shadow="md" width={200} position="right-end">
                <Menu.Target>
                  <NavbarButton icon={IconDots} />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<IconFolder size={14} />}>
                    Open demos folder
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconSettings size={14} />}
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={40} style={{ display: "flex" }}>
            <HeaderIcon icon={<IconArrowLeft />} onClick={() => navigate(-1)} />
            <HeaderIcon icon={<IconArrowRight />} onClick={() => navigate(1)} />
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // Because there are two buttons on the left and three on the right,
                // this is needed for centering
                marginLeft: "40px",
              }}
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
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/demo/:demoName" element={<DemoDetailsView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </AppShell>
    </AppShellProvider>
  );
}
