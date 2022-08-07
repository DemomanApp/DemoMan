import { invoke } from "@tauri-apps/api/tauri";

export type DemoEvent = {
  name: "Killstreak" | "Bookmark";
  value: string;
  tick: number;
};

export type Demo = {
  name: string;
  path: string;
  birthtime: number;
  filesize: number;
  events: DemoEvent[];
  tags: string[];
  serverName: string;
  clientName: string;
  mapName: string;
  playbackTime: number;
  numTicks: number;
};

export async function getDemosInDirectory(dirPath: string) {
  return invoke<Demo[]>("get_demos_in_directory", {
    dirPath,
  });
}

export async function setDemoEvents(demoName: string, newEvents: DemoEvent[]) {
  return invoke<void>("set_demo_events", {
    demoName,
    newEvents,
  });
}

export async function setDemoTags(demoName: string, newTags: string[]) {
  return invoke<void>("set_demo_tags", {
    demoName,
    newTags,
  });
}

export async function deleteDemo(demoName: string, trash: boolean) {
  return invoke<void>("delete_demo", {
    demoName,
    trash
  });
}

export async function renameDemo(demoName: string, newName: string) {
  return invoke<void>("rename_demo", {
    demoName,
    newName,
  });
}

export async function getDemoByName(demoName: string) {
  return invoke<Demo>("get_demo_by_name", {
    demoName,
  });
}
