import fs from "fs";
import path from "path";
import log from "electron-log";

import StreamReader from "./StreamReader";
import { DemoHeader, InvalidDemoFileError } from "./DemoHeader";
import DemoEvent from "./DemoEvent";

const HEADER_SIZE = 8 + 4 + 4 + 260 + 260 + 260 + 260 + 4 + 4 + 4 + 4;

export class Demo {
  filename: string;

  creation_time: Date;

  cachedHeader: DemoHeader | null;

  cachedEvents: DemoEvent[] | null;

  constructor(filename: string) {
    this.filename = filename;
    this.cachedHeader = null;
    this.cachedEvents = null;
    this.creation_time = new Date(0);
  }

  readFileHeader(): DemoHeader {
    log.debug(`Reading file header of ${this.filename}`);
    const fd = fs.openSync(this.filename, "r");
    const buf = Buffer.allocUnsafe(HEADER_SIZE);
    const bytesRead = fs.readSync(fd, buf, 0, HEADER_SIZE, 0);
    if (bytesRead !== HEADER_SIZE) {
      log.warn(
        `Error reading file ${this.filename}: read ${bytesRead} bytes, expected ${HEADER_SIZE}.`
      );
      throw new InvalidDemoFileError();
    }
    this.creation_time = fs.fstatSync(fd).birthtime;
    fs.closeSync(fd);
    const sr = new StreamReader(buf);

    const filestamp = sr.readString(8);
    if (filestamp !== "HL2DEMO") {
      log.warn(
        `File ${this.filename} has an invalid file stamp '${filestamp}'!`
      );
      throw new InvalidDemoFileError();
    }

    const header: DemoHeader = {
      demoVersion: sr.readInt(),
      netVersion: sr.readInt(),
      serverName: sr.readString(260),
      clientName: sr.readString(260),
      mapName: sr.readString(260),
      gameDir: sr.readString(260),
      playbackTime: sr.readFloat(),
      numTicks: sr.readInt(),
      numFrames: sr.readInt(),
      signonLength: sr.readInt(),
    };
    return header;
  }

  getJSONPath() {
    return this.filename.replace(/\.dem$/gi, ".json");
  }

  getShortName() {
    return path.basename(this.filename, ".dem");
  }

  readEvents(): DemoEvent[] {
    const jsonPath = this.getJSONPath();
    log.debug(`Looking for events file at ${jsonPath}`);
    let content;
    try {
      content = fs.readFileSync(jsonPath);
    } catch (e) {
      if (e.code === "ENOENT") {
        return [];
      }
      throw e;
    }
    try {
      const parsedJson = JSON.parse(content.toString());
      return parsedJson.events;
    } catch (error) {
      return [];
    }
  }

  getHeader() {
    const newHeader = this.readFileHeader();
    this.cachedHeader = newHeader;
    return newHeader;
  }

  getEvents() {
    const newEvents = this.readEvents();
    this.cachedEvents = newEvents;
    return newEvents;
  }

  header() {
    return this.cachedHeader || this.getHeader();
  }

  events() {
    return this.cachedEvents || this.getEvents();
  }
}

export function getDemosInDirectory(dirPath: string) {
  log.debug(`Finding demo files in ${dirPath}`);

  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    log.error(`Error reading path ${dirPath}: ${e}`);
    return [];
  }

  const demoList: Demo[] = [];
  files.forEach((file) => {
    if (file.endsWith(".dem")) {
      log.debug(`Found demo file ${file}`);
      demoList.push(new Demo(path.join(dirPath, file)));
    } else {
      log.debug(`Found non-demo file ${file}, skipping.`);
    }
  });
  return demoList;
}
