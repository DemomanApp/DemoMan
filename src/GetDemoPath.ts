import { dialog } from "@electron/remote";
import cfg from "electron-cfg";
import log from "electron-log";

export function GetDemoPath(defaultPath?: string) {
  const filePaths = dialog.showOpenDialogSync({
    title: "Select your demo folder",
    defaultPath,
    properties: ["openDirectory", "showHiddenFiles"],
  });

  // This happens when the user cancels the path selection
  if (filePaths === undefined) {
    return undefined;
  }
  return filePaths[0];
}

export function GetSetDemoPath(defaultPath?: string) {
  const newPath = GetDemoPath(defaultPath);
  if (newPath === undefined) {
    log.info("Demo path selection canceled by user.");
    return false;
  }
  log.info(`Set new demo path "${newPath}"`);
  cfg.set("demo_path", newPath);
  return true;
}
