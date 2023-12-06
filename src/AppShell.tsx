import { ReactNode, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

import { UnstyledButton } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import classes from "./AppShell.module.css";

type HeaderBarProps = {
  center?: ReactNode;
  right?: ReactNode;
};

function HistoryButtons() {
  const navigate = useNavigate();

  // This isn't perfect and might break at some point.
  // If you find a better way to do this,
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
      </div>
      <div className={classes.headerCenter}>{center}</div>
      <div className={classes.headerRight}>{right}</div>
    </>
  );
}

type HeaderButtonProps = {
  onClick?(): void;
  disabled?: boolean;
  children: ReactNode;
};

export const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
  function _HeaderButton(
    { onClick, disabled, children }: HeaderButtonProps,
    ref
  ) {
    return (
      <UnstyledButton
        onClick={onClick}
        className={classes.navbarButton}
        disabled={disabled}
        ref={ref}
      >
        {children}
      </UnstyledButton>
    );
  }
);
