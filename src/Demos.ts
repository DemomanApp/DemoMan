import { promises as fs } from "fs";
import path from "path";
import log from "electron-log";

import StreamReader from "./StreamReader";
import { DemoHeader, InvalidDemoFileError } from "./DemoHeader";
import DemoEvent from "./DemoEvent";

const HEADER_SIZE = 8 + 4 + 4 + 260 + 260 + 260 + 260 + 4 + 4 + 4 + 4;

export class Demo {
  filename: string;

  birthtime: number;

  filesize: number;

  cachedHeader: DemoHeader | null;

  cachedEvents: DemoEvent[] | null;

  constructor(filename: string) {
    this.filename = filename;
    this.cachedHeader = null;
    this.cachedEvents = null;
    this.birthtime = 0;
    this.filesize = 0;
  }

  async readFileHeader(): Promise<DemoHeader> {
    log.debug(`Reading file header of ${this.filename}`);
    const fd = await fs.open(this.filename, "r");
    const stats = await fs.stat(this.filename);
    const buf = Buffer.allocUnsafe(HEADER_SIZE);

    const { bytesRead } = await fd.read(buf, 0, HEADER_SIZE, 0);
    if (bytesRead !== HEADER_SIZE) {
      log.warn(
        `Error reading file ${this.filename}: read ${bytesRead} bytes, expected ${HEADER_SIZE}.`
      );
      throw new InvalidDemoFileError();
    }
    this.birthtime = stats.birthtimeMs;
    this.filesize = stats.size;
    fd.close();
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

  async readEvents(): Promise<DemoEvent[]> {
    const jsonPath = this.getJSONPath();
    log.debug(`Looking for events file at ${jsonPath}`);
    let content;
    try {
      content = await fs.readFile(jsonPath);
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

  async getHeader() {
    const newHeader = await this.readFileHeader();
    this.cachedHeader = newHeader;
    return newHeader;
  }

  async getEvents() {
    const newEvents = await this.readEvents();
    this.cachedEvents = newEvents;
    return newEvents;
  }

  async header() {
    return this.cachedHeader || this.getHeader();
  }

  async events() {
    return this.cachedEvents || this.getEvents();
  }
}

export async function getDemosInDirectory(dirPath: string) {
  log.debug(`Finding demo files in ${dirPath}`);

  let files;
  try {
    files = await fs.readdir(dirPath);
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
