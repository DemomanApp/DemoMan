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
  server_name: string;
  client_name: string;
  map_name: string;
  playback_time: number;
  num_ticks: number;
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
