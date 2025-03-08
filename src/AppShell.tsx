import { ReactNode } from "react";
import { useNavigate } from "react-router";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { HeaderButton, RconIndicator } from "./components";

import classes from "./AppShell.module.css";

type HeaderBarProps = {
  center?: ReactNode;
  right?: ReactNode;
};

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

export function HeaderBar({ center, right }: HeaderBarProps) {
  return (
    <>
      <div className={classes.headerLeft}>
        <HistoryButtons />
        <RconIndicator />
      </div>
      <div className={classes.headerCenter}>{center}</div>
      <div className={classes.headerRight}>{right}</div>
    </>
  );
}
