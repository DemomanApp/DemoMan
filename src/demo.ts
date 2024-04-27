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

// Sigh...
// This was once a number, before I realized that
// JS converts these to floats and thus loses
// precision (steamID64s are quite large)
export type SteamID = string;

export type HighlightPlayerSnapshot = {
  user_id: UserId;
  name: string;
  team: Team;
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
  cappers: HighlightPlayerSnapshot[];
};

export type RoundStalemateHighlight = {
  reason: number;
};

export type RoundStartHighlight = {
  full_reset: boolean;
};

export type RoundWinHighlight = {
  winner: Team;
  // TODO: Win reason?
};

export type PlayerConnectedHighlight = {
  player: HighlightPlayerSnapshot;
};

export type PlayerDisconnectedHighlight = {
  player: HighlightPlayerSnapshot;
  reason: string;
};

export type PlayerTeamChangeHighlight = {
  player: HighlightPlayerSnapshot;
  team: Team;
};

export type PauseHighlight = {
  pause: boolean;
};

export type Highlight =
  | { Kill: KillHighlight }
  | { KillStreak: KillStreakHighlight }
  | { KillStreakEnded: KillStreakEndedHighlight }
  | { ChatMessage: ChatMessageHighlight }
  | { Airshot: AirshotHighlight }
  | { CrossbowAirshot: CrossbowAirshotHighlight }
  | { PointCaptured: PointCapturedHighlight }
  | { RoundStalemate: RoundStalemateHighlight }
  | { RoundStart: RoundStartHighlight }
  | { RoundWin: RoundWinHighlight }
  | { PlayerConnected: PlayerConnectedHighlight }
  | { PlayerDisconnected: PlayerDisconnectedHighlight }
  | { PlayerTeamChange: PlayerTeamChangeHighlight }
  | { Pause: PauseHighlight };

// Awful hack to get around using #[serde(tag = "...")],
// which is unsupported by bincode.
export type TaggedHighlight =
  | { type: "Kill"; highlight: KillHighlight }
  | { type: "KillStreak"; highlight: KillStreakHighlight }
  | { type: "KillStreakEnded"; highlight: KillStreakEndedHighlight }
  | { type: "ChatMessage"; highlight: ChatMessageHighlight }
  | { type: "Airshot"; highlight: AirshotHighlight }
  | { type: "CrossbowAirshot"; highlight: CrossbowAirshotHighlight }
  | { type: "PointCaptured"; highlight: PointCapturedHighlight }
  | { type: "RoundStalemate"; highlight: RoundStalemateHighlight }
  | { type: "RoundStart"; highlight: RoundStartHighlight }
  | { type: "RoundWin"; highlight: RoundWinHighlight }
  | { type: "PlayerConnected"; highlight: PlayerConnectedHighlight }
  | { type: "PlayerDisconnected"; highlight: PlayerDisconnectedHighlight }
  | { type: "PlayerTeamChange"; highlight: PlayerTeamChangeHighlight }
  | { type: "Pause"; highlight: PauseHighlight };

export function destructureHighlight(hl: Highlight): TaggedHighlight {
  const [type, highlight] = Object.entries(hl)[0];
  return { type, highlight } as TaggedHighlight;
}

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

  time_on_team: [number, number];

  time_on_class: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];

  scoreboard: Scoreboard;

  round_scoreboards: ScoreboardMap;
};

export function primaryTeam(player: PlayerSummary): Team {
  const [time_on_red, time_on_blue] = player.time_on_team;

  if (time_on_blue > time_on_red) {
    return "blue";
  } else if (time_on_red > time_on_blue) {
    return "red";
  } else {
    return "other";
  }
}

export type UserIdAliases = Record<number, number>;

export type GameSummary = {
  local_user_id: UserId;
  highlights: HighlightEvent[];
  red_team_score: number;
  blue_team_score: number;
  interval_per_tick: number;
  players: PlayerSummary[];
  num_rounds: number;
  aliases: UserIdAliases;
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

export const sortKeys = {
  birthtime: "File creation time",
  file_size: "File size",
  name: "File name",
  map_name: "Map name",
  event_count: "Number of events",
  playback_time: "Playback time",
} as const;

export type SortKey = keyof typeof sortKeys;

export type SortOrder = "ascending" | "descending";

export type DemoFilter =
  | { Name: string }
  | { PlayerName: string }
  | { MapName: string };

export function isStvDemo(demo: Demo) {
  return demo.serverName === "";
}
