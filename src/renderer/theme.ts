import { createTheme, ThemeOptions } from "@mui/material/styles";
import { blue, red } from "@mui/material/colors";

export type ThemeType = "dark" | "light";

export function getPreferredTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#303030",
      paper: "#303030",
    },
    primary: blue,
    secondary: red,
  },
  typography: {
    fontFamily: "nunito",
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    primary: blue,
    secondary: red,
  },
  typography: {
    fontFamily: "nunito",
  },
});
