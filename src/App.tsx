import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import MainView from "./MainView";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <MainView />
    </ThemeProvider>
  );
}
