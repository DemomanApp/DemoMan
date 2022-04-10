import { MouseEvent } from "react";

import { Tooltip, IconButton } from "@mui/material";

export type AppBarButtonProps = {
  icon: JSX.Element;
  tooltip: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
};

export default function AppBarButton(props: AppBarButtonProps) {
  const { icon, tooltip, onClick } = props;
  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={onClick} size="large">
        {icon}
      </IconButton>
    </Tooltip>
  );
}
