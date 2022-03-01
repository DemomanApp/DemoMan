import fs from "fs";
import log from "electron-log";
import path from "path";

import Demo, { DemoDict } from "./Demo";

export default function getDemosInDirectory(dirPath: string): DemoDict {
  log.debug(`Finding demo files in ${dirPath}`);

  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    log.error(`Error reading path ${dirPath}: ${e}`);
    return {};
  }

  const demoDict: DemoDict = {};
  files.forEach((file) => {
    const { ext, name } = path.parse(file);
    if (ext === ".dem") {
      try {
        demoDict[name] = Demo.getDemoByPath(path.join(dirPath, file));
      } catch {
        // ignore this file if it throws errors
      }
    }
  });
  return demoDict;
}
