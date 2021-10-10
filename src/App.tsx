import React from "react";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import blue from "@mui/material/colors/blue";
import red from "@mui/material/colors/red";
import "@fontsource/nunito";

import MainView from "./MainView";
import { getPreferredTheme } from "./theme";

const mode = getPreferredTheme();
const theme = createTheme({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#fafafa",
            paper: "#ffffff",
          },
        }
      : {
          background: {
            default: "#303030",
            paper: "#303030",
          },
        }),
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
