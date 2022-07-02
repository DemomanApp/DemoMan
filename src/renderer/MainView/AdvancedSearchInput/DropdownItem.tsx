import { ReactNode, useEffect, useRef } from "react";

import { ListItemButton, ListItemText } from "@mui/material";
import Kbd from "../../Kbd";

type Props = {
  onClick: () => void;
  children: ReactNode;
  focused: boolean;
};

export default (props: Props) => {
  const { onClick, children, focused } = props;
  const selfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused) {
      selfRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [focused]);

  return (
    <ListItemButton
      ref={selfRef}
      onClick={onClick}
      sx={(theme) => ({
        ".dropdownListIcon": {
          opacity: focused ? "100%" : "0%",
        },
        // Fake hover
        // TODO: Solve this with a palette entry
        // eslint-disable-next-line no-nested-ternary
        backgroundColor: focused
          ? theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.04)"
          : "unset",
        // Disable the background-color transition,
        // which makes navigating look slow
        transition: "none",
      })}
    >
      <ListItemText>{children}</ListItemText>
      <Kbd className="dropdownListIcon">tab</Kbd>
    </ListItemButton>
  );
};
