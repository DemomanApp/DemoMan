import { useRef } from "react";
import { Outlet } from "react-router-dom";

import { AppShell } from "@mantine/core";

import { AppShellProvider } from "./AppShell";

import classes from "./App.module.css";

export default function App() {
  const headerLeftRef = useRef<HTMLDivElement>(null);
  const headerCenterRef = useRef<HTMLDivElement>(null);
  const headerRightRef = useRef<HTMLDivElement>(null);

  return (
    <AppShellProvider
      value={{ headerLeftRef, headerCenterRef, headerRightRef }}
    >
      <AppShell padding={0} header={{ height: 50 }} classNames={classes}>
        <AppShell.Header>
          <div ref={headerLeftRef} className={classes.headerLeft} />
          <div ref={headerCenterRef} className={classes.headerCenter} />
          <div ref={headerRightRef} className={classes.headerRight} />
        </AppShell.Header>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </AppShellProvider>
  );
}
