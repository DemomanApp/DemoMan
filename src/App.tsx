import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "fontsource-nunito";

import MainView from "./MainView";
import { getPreferredTheme } from "./theme";

const theme = createMuiTheme({
  palette: {
    type: getPreferredTheme(),
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
