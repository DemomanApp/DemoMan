import { ReactNode } from "react";

import { Box } from "@mui/system";
import { AppBar as MuiAppBar, Toolbar } from "@mui/material";

export type AppBarProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export default function AppBar(props: AppBarProps) {
  const { left, center, right } = props;
  return (
    <MuiAppBar position="fixed">
      <Toolbar disableGutters sx={{ paddingX: "8px" }}>
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "flex-start",
            display: "flex",
            flexBasis: 0,
          }}
        >
          {left}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            display: "flex",
            flexBasis: 0,
          }}
        >
          {center}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "flex-end",
            display: "flex",
            flexBasis: 0,
          }}
        >
          {right}
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}

AppBar.defaultProps = {
  left: null,
  center: null,
  right: null,
};
