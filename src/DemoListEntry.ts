import { Demo } from "./Demos";

export interface DemoListEntry {
  filename: string;
  map: string;
  playbackTime: number;
  player: string;
  server: string;
  numEvents: number;
  numTicks: number;
  birthtime: number;
  filesize: number;
  demo: Demo;
}

export function getDemoListEntry(demo: Demo): DemoListEntry {
  const { header, events } = demo;
  return {
    filename: demo.getShortName(),
    map: header.mapName,
    playbackTime: header.playbackTime,
    player: header.clientName,
    server: header.serverName,
    numEvents: events.length,
    numTicks: header.numTicks,
    birthtime: demo.birthtime,
    filesize: demo.filesize,
    demo,
  };
}
