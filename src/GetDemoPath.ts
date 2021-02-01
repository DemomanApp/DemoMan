import { dialog } from "electron";
import cfg from "electron-cfg";
import log from "electron-log";

export default function GetDemoPath() {
  let filePaths: string[] | undefined;
  while (filePaths === undefined || filePaths.length !== 1) {
    filePaths = dialog.showOpenDialogSync({
      title: "Select your demo folder",
      properties: ["openDirectory"],
    });
  }
  log.info(`Set new demo path "${filePaths[0]}"`);
  cfg.set("demos.path", filePaths[0]);
}
