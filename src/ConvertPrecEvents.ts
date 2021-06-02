import fs from "fs";
import path from "path";
import cfg from "electron-cfg";
import log from "electron-log";

import DemoEvent from "./DemoEvent";
import { writeEventsFile } from "./Demos";

const regex = /\[[\d/ :]+\] (.*) \("(\w+)" at (\d+)\)/;

export default function convertPrecEvents() {
  const demoDir = cfg.get("demo_path");
  log.debug(`Looking for PREC events file in ${demoDir}`);
  if (demoDir === undefined) {
    return;
  }
  let fd;
  try {
    fd = fs.openSync(path.join(demoDir, "KillStreaks.txt"), "r");
  } catch (e) {
    if (e.code === "ENOENT") {
      // No PREC events file exists, ignore
      log.debug(`No PREC events file found`);
      return;
    }
    throw e;
  }
  log.debug(`Found PREC events file`);
  const fileContent = fs.readFileSync(fd);

  const lines = fileContent.toString().split("\n");

  const events: Record<string, DemoEvent[]> = {};

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const matches = regex.exec(line);
    if (matches !== null) {
      const desc = matches[1];
      const demoName = matches[2];
      const tick = parseInt(matches[3], 10);
      let name;
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

  for (let i = 0; i < Object.keys(events).length; i += 1) {
    const demo = Object.keys(events)[i];
    // only write events for demos that still exist
    let demoExists = true;
    try {
      fs.statSync(path.join(demoDir, `${demo}.dem`));
    } catch (e) {
      if (e.code === "ENOENT") {
        demoExists = false;
      } else {
        throw e;
      }
    }
    if (demoExists) {
      writeEventsFile(events[demo], path.join(demoDir, `${demo}.json`), false);
    }
  }
}
