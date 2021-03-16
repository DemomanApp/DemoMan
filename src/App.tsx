import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import MainView from "./MainView";
import { getPreferredTheme } from "./theme";

const theme = createMuiTheme({
  palette: {
    type: getPreferredTheme(),
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <MainView />
    </ThemeProvider>
  );
}
