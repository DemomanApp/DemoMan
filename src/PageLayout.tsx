import React from "react";

import Box from "@mui/system/Box";
import AppBar, { AppBarProps } from "./AppBar";
import BounceTransition from "./BounceTransition";

type PageLayoutProps = { children: React.ReactNode } & AppBarProps;

export default function AppContentContainer(props: PageLayoutProps) {
  const { children, left, center, right } = props;
  return (
    <>
      <AppBar left={left} center={center} right={right} />
      <Box sx={{ paddingTop: "64px", height: "100%" }}>
        <BounceTransition>{children}</BounceTransition>
      </Box>
    </>
  );
}
