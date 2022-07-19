import { dialog, getCurrentWindow } from "@electron/remote";

export default async function getDemoPath(defaultPath?: string) {
  return dialog.showOpenDialog(getCurrentWindow(), {
    title: "Select your demo folder",
    defaultPath,
    properties: ["openDirectory", "showHiddenFiles"],
  });
}
