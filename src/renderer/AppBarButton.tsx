import { MouseEvent } from "react";

import { Tooltip, IconButton } from "@mui/material";

export type AppBarButtonProps = {
  icon: JSX.Element;
  tooltip: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  color?:
    | "inherit"
    | "default"
    | "error"
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning";
};

export default function AppBarButton(props: AppBarButtonProps) {
  const { icon, tooltip, onClick, color } = props;
  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={onClick} size="large" color={color}>
        {icon}
      </IconButton>
    </Tooltip>
  );
}
