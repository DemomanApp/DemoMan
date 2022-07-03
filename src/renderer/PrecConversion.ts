import fs from "fs";
import path from "path";
import log from "electron-log";

import DemoEvent from "./DemoEvent";
import Demo from "./Demo";
import { isNodeError } from "./util";
import store from "../common/store";

const regex = /\[[\d/ :]+\] (.*) \("(\w+)" at (\d+)\)/;

export function readPrecFile(filePath: string): Record<string, DemoEvent[]> {
  let fileContent;
  try {
    fileContent = fs.readFileSync(filePath);
  } catch (e) {
    if (isNodeError(e) && e.code === "ENOENT") {
      // No P-REC events file exists
      log.debug(`No PREC events file found`);
      return {};
    }
    throw e;
  }

  const lines = fileContent.toString().split("\n");

  const events: Record<string, DemoEvent[]> = {};

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const matches = regex.exec(line);
    if (matches !== null) {
      const desc = matches[1];
      const demoName = matches[2];
      const tick = parseInt(matches[3], 10);
      let name: "Killstreak" | "Bookmark";
      let value;
      const ksRegexResult = /Kill Streak:(\d+)/.exec(desc);
      if (ksRegexResult !== null) {
        name = "Killstreak";
        // eslint-disable-next-line prefer-destructuring
        value = ksRegexResult[1];
      } else {
        name = "Bookmark";
        value = desc;
      }
      const newEvent: DemoEvent = {
        tick,
        name,
        value,
      };
      if (!(demoName in events)) {
        events[demoName] = [];
      }
      events[demoName].push(newEvent);
    }
  }

  return events;
}

export function convertPrecEvents() {
  const demoDir = store.get("demo_path");
  log.debug(`Looking for P-REC events file in ${demoDir}`);
  if (demoDir === undefined) {
    return;
  }
  const events = readPrecFile(path.join(demoDir, "KillStreaks.txt"));

  for (let i = 0; i < Object.keys(events).length; i += 1) {
    const demoName = Object.keys(events)[i];
    // only write events for demos that still exist
    let demoExists = true;
    try {
      fs.statSync(path.join(demoDir, `${demoName}.dem`));
    } catch (e) {
      if (isNodeError(e) && e.code === "ENOENT") {
        demoExists = false;
      } else {
        throw e;
      }
    }
    if (demoExists) {
      Demo.writeEventsAndTagsFile(
        events[demoName],
        [],
        path.join(demoDir, `${demoName}.json`),
        false
      );
    }
  }
}
