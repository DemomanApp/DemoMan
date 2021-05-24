import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import "fontsource-nunito";

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
