import fs from "fs";
import log from "electron-log";
import path from "path";

import Demo, { DemoDict } from "./Demo";
import store from "../common/store";
import { readPrecFile } from "./PrecConversion";

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

  if (store.get("auto_prec")) {
    const precEvents = readPrecFile(path.join(dirPath, "KillStreaks.txt"));
    Object.keys(precEvents).forEach((demoName) => {
      const demo = demoDict[demoName];
      // Only load events from P-REC file if a demo with the specified
      // name exists and it has no events already
      if (demo !== undefined && demo.events.length === 0) {
        demo.events = precEvents[demoName];
      }
    });
  }
  return demoDict;
}
