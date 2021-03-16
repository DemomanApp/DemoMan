import { nativeTheme } from "electron";
import cfg from "electron-cfg";

export function getPreferredTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function loadPreferredTheme() {
  let theme = cfg.get("theme", undefined);
  if (
    theme === undefined ||
    (theme !== "dark" && theme !== "light" && theme !== "system")
  ) {
    cfg.set("theme", "system");
    theme = "system";
  }
  nativeTheme.themeSource = theme;
}
