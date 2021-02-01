import electron from "electron";
import cfg from "electron-cfg";
import log from "electron-log";

const { dialog } = electron.remote;

export default function GetDemoPath() {
  const filePaths = dialog.showOpenDialogSync({
    title: "Select your demo folder",
    properties: ["openDirectory"],
  });
  if (filePaths === undefined) {
    log.info("Demo path selection canceled by user.");
    return false;
  }
  log.info(`Set new demo path "${filePaths[0]}"`);
  cfg.set("demos.path", filePaths[0]);
  return true;
}
