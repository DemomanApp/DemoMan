import React from "react";

import "@fontsource/nunito";

import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import ThemeContext from "./ThemeContext";
import { darkTheme, getPreferredTheme, lightTheme } from "./theme";
import useStore from "./hooks/useStore";

export default ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useStore("theme", getPreferredTheme());

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
};
