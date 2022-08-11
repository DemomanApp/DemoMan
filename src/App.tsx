import { appWindow } from "@tauri-apps/api/window";
import { Routes, Route, useNavigate } from "react-router-dom";

import {
  AppShell,
  Navbar,
  Header,
  Stack,
  Tooltip,
  UnstyledButton,
  createStyles,
  Menu,
  ActionIcon,
} from "@mantine/core";
import {
  IconSettings,
  IconDots,
  TablerIcon,
  IconFolder,
  IconArrowLeft,
  IconArrowRight,
  IconMaximize,
  IconMinimize,
  IconX,
  IconLetterI,
} from "@tabler/icons";

import HomeView from "./views/home";
import React, { useState } from "react";
import SettingsView from "./views/settings";
import DemoDetailsView from "./views/demoDetails";

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

type NavbarButtonProps = {
  icon: TablerIcon;
  active?: boolean;
  onClick?(): void;
};

const NavbarButton = React.forwardRef<HTMLButtonElement, NavbarButtonProps>(
  function _NavbarButton(
    { icon: Icon, active, onClick }: NavbarButtonProps,
    ref
  ) {
    const { classes, cx } = useStyles();
    return (
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
        ref={ref}
      >
        <Icon stroke={1.5} />
      </UnstyledButton>
    );
  }
);

type HeaderIconProps = {
  icon: JSX.Element;
  onClick(): void;
};

const HeaderIcon = ({ icon, onClick }: HeaderIconProps) => {
  return (
    <ActionIcon variant="subtle" radius={0} size={40} onClick={onClick} tabIndex={-1}>
      {icon}
    </ActionIcon>
  );
};

export default function App() {
  const navigate = useNavigate();
  const [isMaximized, setIsMaximized] = useState(false);

  appWindow.onResized(() => appWindow.isMaximized().then(setIsMaximized));

  return (
    <AppShell
      padding={0}
      navbar={
        <Navbar width={{ base: 80 }} p="md">
          <Navbar.Section grow>
            {/* TODO */}
          </Navbar.Section>
          <Navbar.Section>
            <Stack justify="center" spacing={0}>
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
            </Stack>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={40} style={{ display: "flex" }}>
          <HeaderIcon icon={<IconArrowLeft />} onClick={() => navigate(-1)} />
          <HeaderIcon icon={<IconArrowRight />} onClick={() => navigate(1)} />
          <div style={{ flexGrow: 1 }} data-tauri-drag-region />
          <HeaderIcon
            // Pull a sneaky on them (The icon set has no plain "line" icon)
            icon={<IconLetterI style={{ transform: "rotate(90deg)" }} />}
            onClick={() => appWindow.minimize()}
          />
          <HeaderIcon icon={isMaximized ? <IconMinimize /> : <IconMaximize />} onClick={() => appWindow.toggleMaximize()} />
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
  );
}
