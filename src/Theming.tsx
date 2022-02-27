import React from "react";
import cfg from "electron-cfg";

import "@fontsource/nunito";

import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import ThemeContext from "./ThemeContext";
import { darkTheme, getPreferredTheme, lightTheme } from "./theme";

export default ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = React.useState(getPreferredTheme());

  const setAndSaveTheme = (newTheme: string) => {
    setTheme(newTheme);
    cfg.set("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setAndSaveTheme }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
};
