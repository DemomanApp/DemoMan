import {
  createContext,
  forwardRef,
  ReactNode,
  RefObject,
  useContext,
} from "react";
import ReactDOM from "react-dom";

import { UnstyledButton } from "@mantine/core";
import { Icon } from "@tabler/icons-react";

import classes from "./AppShell.module.css";

type AppShellContextType = {
  headerRef: RefObject<HTMLDivElement>;
  navbarRef: RefObject<HTMLDivElement>;
};

const AppShellContext = createContext<AppShellContextType>(
  {} as AppShellContextType
);

export const AppShellProvider = AppShellContext.Provider;

export function NavbarPortal({ children }: { children: ReactNode }) {
  const { navbarRef } = useContext(AppShellContext);
  if (navbarRef.current !== null) {
    return ReactDOM.createPortal(children, navbarRef.current);
  }
  return null;
}

export function HeaderPortal({ children }: { children: ReactNode }) {
  const { headerRef } = useContext(AppShellContext);
  if (headerRef.current !== null) {
    return ReactDOM.createPortal(children, headerRef.current);
  }
  return null;
}

type NavbarButtonProps = {
  icon: Icon;
  active?: boolean;
  onClick?(): void;
};

export const NavbarButton = forwardRef<HTMLButtonElement, NavbarButtonProps>(
  function _NavbarButton(
    { icon: Icon, active, onClick }: NavbarButtonProps,
    ref
  ) {
    return (
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active}
        ref={ref}
      >
        <Icon stroke={1.5} />
      </UnstyledButton>
    );
  }
);
