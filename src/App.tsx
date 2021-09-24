import React from "react";
import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import blue from "@mui/material/colors/blue";
import red from "@mui/material/colors/red";
import "@fontsource/nunito";

import MainView from "./MainView";
import { getPreferredTheme } from "./theme";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const theme = createTheme({
  palette: {
    mode: getPreferredTheme(),
    primary: blue,
    secondary: red,
  },
  typography: {
    fontFamily: "nunito",
  },
});

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainView />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
