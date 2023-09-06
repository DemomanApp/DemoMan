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

export const TEAM_NAMES = ["UNASSIGNED", "SPECTATOR", "RED", "BLU"] as const;

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

export type HighlightPlayerSnapshot = {
  user_id: UserId;
  name: string;
  team: string;
};

export type KillHighlight = {
  killer: HighlightPlayerSnapshot;
  assister: HighlightPlayerSnapshot | null;
  victim: HighlightPlayerSnapshot;
  weapon: string;
  kill_icon: string;
  streak: number;
  drop: boolean;
  airshot: boolean;
};

export type KillStreakHighlight = {
  player: HighlightPlayerSnapshot;
  streak: number;
};

export type KillStreakEndedHighlight = {
  killer: HighlightPlayerSnapshot;
  victim: HighlightPlayerSnapshot;
  streak: number;
};

export type ChatMessageHighlight = {
  sender: HighlightPlayerSnapshot;
  text: string;
};

export type AirshotHighlight = {
  attacker: HighlightPlayerSnapshot;
  victim: HighlightPlayerSnapshot;
};

export type CrossbowAirshotHighlight = {
  healer: HighlightPlayerSnapshot;
  target: HighlightPlayerSnapshot;
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
  | { t: "KillStreak"; c: KillStreakHighlight }
  | { t: "KillStreakEnded"; c: KillStreakEndedHighlight }
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

type ScoreboardMap = {
  [key: number]: Scoreboard;
};

export type PlayerSummary = {
  name: string;
  steam_id: SteamID;
  user_id: UserId;

  team: Team;
  time_on_class: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];

  scoreboard: Scoreboard;

  round_scoreboards: ScoreboardMap;
};

export type GameSummary = {
  local_user_id: UserId;
  highlights: HighlightEvent[];
  red_team_score: number;
  blue_team_score: number;
  interval_per_tick: number;
  players: PlayerSummary[];
  num_rounds: number;
};

export type Scoreboard = {
  points: number;
  kills: number;
  assists: number;
  deaths: number;
  buildings_destroyed: number;
  captures: number;
  defenses: number;
  dominations: number;
  revenges: number;
  ubercharges: number;
  headshots: number;
  teleports: number;
  healing: number;
  backstabs: number;
  bonus_points: number;
  support: number;
  damage_dealt: number;
};

export function isStvDemo(demo: Demo) {
  return demo.serverName === "";
}
