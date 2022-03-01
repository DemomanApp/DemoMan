import fs from "fs";
import path from "path";
import log from "electron-log";

import StreamReader from "./StreamReader";
import { DemoHeader, InvalidDemoFileError } from "./DemoHeader";
import DemoEvent from "./DemoEvent";
import { isNodeError } from "./util";

const HEADER_SIZE = 8 + 4 + 4 + 260 + 260 + 260 + 260 + 4 + 4 + 4 + 4;

export type DemoDict = Record<string, Demo>;

export function getJSONPath(filename: string) {
  return filename.replace(/\.dem$/gi, ".json");
}

export default class Demo {
  path: string;
  name: string;
  birthtime: number;
  filesize: number;
  demoVersion: number;
  netVersion: number;
  serverName: string;
  clientName: string;
  mapName: string;
  gameDir: string;
  playbackTime: number;
  numTicks: number;
  events: DemoEvent[];
  tags: string[];

  private constructor(
    filename: string,
    shortName: string,
    header: DemoHeader,
    events: DemoEvent[],
    tags: string[],
    birthtime: number,
    filesize: number
  ) {
    const {
      demoVersion,
      netVersion,
      serverName,
      clientName,
      mapName,
      gameDir,
      playbackTime,
      numTicks,
    } = header;
    this.path = filename;
    this.name = shortName;
    this.birthtime = birthtime;
    this.filesize = filesize;
    this.demoVersion = demoVersion;
    this.netVersion = netVersion;
    this.serverName = serverName;
    this.clientName = clientName;
    this.mapName = mapName;
    this.gameDir = gameDir;
    this.playbackTime = playbackTime;
    this.numTicks = numTicks;
    this.events = events;
    this.tags = tags;
  }

  writeEventsAndTags() {
    Demo.writeEventsAndTagsFile(
      this.events,
      this.tags,
      getJSONPath(this.path),
      true
    );
  }

  static writeEventsAndTagsFile(
    events: DemoEvent[],
    tags: string[],
    jsonPath: string,
    overwrite: boolean
  ) {
    if (events.length === 0) {
      log.debug(`Deleting events/tags file at ${jsonPath}`);
      fs.rmSync(jsonPath, { force: true });
      return;
    }
    log.debug(`Writing to events/tags file at ${jsonPath}`);
    let fd: number;
    try {
      fd = fs.openSync(jsonPath, overwrite ? "w" : "wx");
    } catch (e) {
      if (isNodeError(e) && e.code === "EEXIST") {
        log.debug(`Events/tags file at ${jsonPath} already exists, skipping.`);
        return;
      }
      throw e;
    }
    fs.writeSync(fd, JSON.stringify({ events, tags }, null, "\t"));
    fs.closeSync(fd);
  }

  static getDemosInDirectory(dirPath: string) {
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
      const { ext } = path.parse(file);
      if (ext === ".dem") {
        log.debug(`Found demo file ${file}`);
        try {
          demoList.push(this.getDemoByPath(path.join(dirPath, file)));
        } catch (error) {
          // ignore this file if it throws errors
        }
      } else {
        log.debug(`Found non-demo file ${file}, skipping.`);
      }
    });
    return demoList;
  }

  private static loadDemo(filePath: string): Demo {
    const stats = fs.statSync(filePath);
    const [events, tags] = this.readEventsAndTags(getJSONPath(filePath));
    const newDemo = new Demo(
      filePath,
      path.parse(filePath).name,
      this.readFileHeader(filePath),
      events,
      tags,
      stats.birthtimeMs,
      stats.size
    );
    return newDemo;
  }

  static getDemoByPath(filePath: string): Demo {
    return Demo.loadDemo(filePath);
  }

  static readFileHeader(filename: string): DemoHeader {
    log.debug(`Reading file header of ${filename}`);
    const fd = fs.openSync(filename, "r");
    const buf = Buffer.allocUnsafe(HEADER_SIZE);

    const bytesRead = fs.readSync(fd, buf, 0, HEADER_SIZE, 0);
    if (bytesRead !== HEADER_SIZE) {
      log.warn(
        `Error reading file ${filename}: read ${bytesRead} bytes, expected ${HEADER_SIZE}.`
      );
      throw new InvalidDemoFileError();
    }
    fs.closeSync(fd);
    const sr = new StreamReader(buf);

    const filestamp = sr.readString(8);
    if (filestamp !== "HL2DEMO") {
      log.warn(`File ${filename} has an invalid file stamp '${filestamp}'!`);
      throw new InvalidDemoFileError();
    }

    return {
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
  }

  static readEventsAndTags(jsonPath: string): [DemoEvent[], string[]] {
    log.debug(`Looking for events file at ${jsonPath}`);
    let content;
    try {
      content = fs.readFileSync(jsonPath);
    } catch (e) {
      if (isNodeError(e) && e.code === "ENOENT") {
        return [[], []];
      }
      throw e;
    }
    try {
      const parsedJson = JSON.parse(content.toString());
      return [parsedJson.events || [], parsedJson.tags || []];
    } catch (error) {
      return [[], []];
    }
  }

  rename(newName: string) {
    log.info(`Renaming demo ${this.name} to ${newName}`);
    const dir = path.dirname(this.path);
    const newNameFull = path.join(dir, `${newName}.dem`);
    fs.renameSync(this.path, newNameFull);
    try {
      fs.renameSync(getJSONPath(this.path), path.join(dir, `${newName}.json`));
    } catch (e) {
      if (isNodeError(e) && e.code === "ENOENT") {
        // This demo has no events file, ignore the error
      } else {
        throw e;
      }
    }
    this.path = newNameFull;
    this.name = newName;
  }

  delete() {
    log.info(`Deleting demo ${this.path}`);
    fs.rmSync(this.path);
    try {
      fs.rmSync(getJSONPath(this.path));
    } catch (e) {
      if (isNodeError(e) && e.code === "ENOENT") {
        // This demo has no events file, ignore the error
      } else {
        throw e;
      }
    }
  }
}
