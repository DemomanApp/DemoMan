import { ReactNode, forwardRef } from "react";

import { AppShell, UnstyledButton } from "@mantine/core";
import { Icon } from "@tabler/icons-react";

import classes from "./AppShell.module.css";

type AppShellProps = {
  children: ReactNode;
  header: {
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
  };
};

export default ({ children, header }: AppShellProps) => (
  <AppShell padding={0} header={{ height: 50 }} classNames={classes}>
    <AppShell.Header>
      <div className={classes.headerLeft}>{header.left}</div>
      <div className={classes.headerCenter}>{header.center}</div>
      <div className={classes.headerRight}>{header.right}</div>
    </AppShell.Header>
    <AppShell.Main>{children}</AppShell.Main>
  </AppShell>
);

type HeaderButtonProps = {
  icon: Icon;
  onClick?(): void;
};

export const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
  function _HeaderButton({ icon: Icon, onClick }: HeaderButtonProps, ref) {
    return (
      <UnstyledButton
        onClick={onClick}
        className={classes.navbarButton}
        ref={ref}
      >
        <Icon />
      </UnstyledButton>
    );
  }
);
