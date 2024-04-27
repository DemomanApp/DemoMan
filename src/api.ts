import { invoke } from "@tauri-apps/api/tauri";

import { Demo, DemoEvent, DemoFilter, GameSummary, SortKey } from "./demo";

export async function getDemosInDirectory(
  dirPath: string,
  sortKey: SortKey,
  reverse: boolean,
  filters: DemoFilter[]
) {
  return invoke<Demo[]>("get_demos_in_directory", {
    dirPath,
    sortKey,
    reverse,
    filters,
  });
}

export async function setDemoEvents(demoPath: string, newEvents: DemoEvent[]) {
  return invoke<void>("set_demo_events", {
    demoPath,
    newEvents,
  });
}

export async function setDemoTags(demoPath: string, newTags: string[]) {
  return invoke<void>("set_demo_tags", {
    demoPath,
    newTags,
  });
}

export async function deleteDemo(demoPath: string, trash: boolean) {
  return invoke<void>("delete_demo", {
    demoPath,
    trash,
  });
}

export async function renameDemo(demoPath: string, newPath: string) {
  return invoke<void>("rename_demo", {
    demoPath,
    newPath,
  });
}

export async function getDemo(demoPath: string) {
  return invoke<Demo>("get_demo", {
    demoPath,
  });
}

export async function getDemoDetails(demoPath: string) {
  return invoke<GameSummary>("get_demo_details", {
    demoPath,
  });
}

export async function getTf2Dir() {
  return invoke<string>("get_tf2_dir");
}

export async function initRcon(password: string) {
  return invoke<void>("init_rcon", { password });
}

export async function sendCommand(command: string) {
  return invoke<string>("send_command", { command });
}
