import React from "react";
import { createMuiTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import blue from "@mui/material/colors/blue";
import red from "@mui/material/colors/red";
import "@fontsource/nunito";

import MainView from "./MainView";
import { getPreferredTheme } from "./theme";

const theme = createMuiTheme({
  palette: {
    type: getPreferredTheme(),
    primary: blue,
    secondary: red,
  },
  typography: {
    fontFamily: "nunito",
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainView />
    </ThemeProvider>
  );
}
