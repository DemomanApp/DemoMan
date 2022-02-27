import { dialog } from "@electron/remote";

export default async function getDemoPath(defaultPath?: string) {
  return dialog.showOpenDialog({
    title: "Select your demo folder",
    defaultPath,
    properties: ["openDirectory", "showHiddenFiles"],
  });
}
