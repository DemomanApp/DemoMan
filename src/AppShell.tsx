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
  headerLeftRef: RefObject<HTMLDivElement>;
  headerCenterRef: RefObject<HTMLDivElement>;
  headerRightRef: RefObject<HTMLDivElement>;
};

const AppShellContext = createContext<AppShellContextType>(
  {} as AppShellContextType
);

export const AppShellProvider = AppShellContext.Provider;

type HeaderPortalProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export function HeaderPortal({ left, center, right }: HeaderPortalProps) {
  const { headerLeftRef, headerCenterRef, headerRightRef } =
    useContext(AppShellContext);
  return (
    <>
      {headerLeftRef.current !== null &&
        ReactDOM.createPortal(left, headerLeftRef.current)}
      {headerCenterRef.current !== null &&
        ReactDOM.createPortal(center, headerCenterRef.current)}
      {headerRightRef.current !== null &&
        ReactDOM.createPortal(right, headerRightRef.current)}
    </>
  );
}

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
        <Icon stroke={1.5} />
      </UnstyledButton>
    );
  }
);
