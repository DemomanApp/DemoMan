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
  Scout,
  Sniper,
  Soldier,
  Demoman,
  Medic,
  Heavy,
  Pyro,
  Spy,
  Engineer,
}

export function stringifyClass(cls: Class) {
  return Class[cls];
}

export type UserId = number;

export type SteamID = number;

export type KillHighlight = {
  killer_id: UserId;
  assister_id: UserId | null;
  victim_id: UserId;
  weapon: string;
  kill_icon: string;
  streak: number;
  drop: boolean;
  airshot: boolean;
};

export type ChatMessageHighlight = {
  sender: UserId;
  text: string;
};

export type AirshotHighlight = {
  attacker_id: UserId;
  victim_id: UserId;
};

export type CrossbowAirshotHighlight = {
  healer_id: UserId;
  target_id: UserId;
};

export type PointCapturedHighlight = {
  point_name: string;
  capturing_team: number;
  cappers: UserId[];
};

export type RoundWinHighlight = {
  winner: number;
  // TODO: Win reason?
};

export type PlayerConnectedHighlight = {
  user_id: UserId;
};

export type PlayerDisconnectedHighlight = {
  user_id: UserId;
  reason: string;
};

export type Highlight =
  | { t: "Kill"; c: KillHighlight }
  | { t: "ChatMessage"; c: ChatMessageHighlight }
  | { t: "Airshot"; c: AirshotHighlight }
  | { t: "CrossbowAirshot"; c: CrossbowAirshotHighlight }
  | { t: "PointCaptured"; c: PointCapturedHighlight }
  | { t: "RoundStalemate" }
  | { t: "RoundStart" }
  | { t: "RoundWin"; c: RoundWinHighlight }
  | { t: "PlayerConnected"; c: PlayerConnectedHighlight }
  | { t: "PlayerDisconnected"; c: PlayerDisconnectedHighlight }
  | { t: "Pause" }
  | { t: "Unpause" };

export type HighlightEvent = {
  tick: number;
  event: Highlight;
};

export type PlayerSummary = {
  name: string,
  steam_id: SteamID,
  user_id: UserId,

  team: Team,
  classes: number[],

  damage: number,
  kills: number,
  deaths: number,
  assists: number,
  healing: number,
  invulns: number,
  captures: number,
};

export type GameSummary = {
  local_user_id: UserId;
  highlights: HighlightEvent[];
  red_team_score: number;
  blue_team_score: number;
  interval_per_tick: number;
  players: PlayerSummary[];
};

export function isStvDemo(demo: Demo) {
  return demo.serverName === "";
}
