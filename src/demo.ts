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

export type Team = "red" | "blue" | "spectator" | "other";

export enum Class {
  Other = 0,
  Scout = 1,
  Sniper = 2,
  Soldier = 3,
  Demoman = 4,
  Medic = 5,
  Heavy = 6,
  Pyro = 7,
  Spy = 8,
  Engineer = 9,
}

export function stringifyClass(cls: Class) {
  return Class[cls];
}

export type ChatMessageKind =
  | "TF_Chat_All"
  | "TF_Chat_Team"
  | "TF_Chat_AllDead"
  | "TF_Chat_Team_Dead"
  | "TF_Chat_AllSpec"
  | "NameChange"
  | "Empty";

export type ChatMessage = {
  kind: ChatMessageKind;
  from: string;
  text: string;
  tick: number;
};

export type UserInfo = {
  classes: Record<number, number>;
  name: string;
  userId: number;
  steamId: string;
  team: Team;
};

export type Death = {
  weapon: string;
  victim: number;
  assister?: number;
  killer: number;
  tick: number;
};

export type Round = {
  winner: Team;
  length: number;
  endTick: number;
};

export type MatchState = {
  chat: ChatMessage[];
  users: Record<number, UserInfo>;
  deaths: Death[];
  rounds: Round[];
  startTick: number;
  intervalPerTick: number;
};

export function isStvDemo(demo: Demo) {
  return demo.serverName === "";
}
