import { useState, MouseEvent } from "react";

import { Menu, MenuItem } from "@mui/material";

import AppBarButton from "./AppBarButton";

type AppBarMenuProps = {
  children: AppBarMenuItem[];
  icon: JSX.Element;
  tooltip: string;
};

type AppBarMenuItem = {
  text: string;
  onClick: () => void;
};

export default function AppBarMenu(props: AppBarMenuProps) {
  const { children, icon, tooltip } = props;
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  return (
    <>
      <AppBarButton
        icon={icon}
        tooltip={tooltip}
        onClick={(event: MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        }}
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          variant: "outlined",
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 10,
              width: 10,
              height: 10,
              bgcolor: "background.default",
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
              transform: "translateY(calc(-50% - 1px)) rotate(45deg)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.12);",
              borderTop: "1px solid rgba(255, 255, 255, 0.12);",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {children.map((menuItem) => (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              menuItem.onClick();
            }}
            key={menuItem.text}
          >
            {menuItem.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
