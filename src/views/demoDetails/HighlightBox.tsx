import { createStyles, useMantineTheme } from "@mantine/core";

import {
  ChatMessageHighlight,
  AirshotHighlight,
  CrossbowAirshotHighlight,
  Highlight,
  KillHighlight,
  PointCapturedHighlight,
  RoundWinHighlight,
  PlayerConnectedHighlight,
  PlayerDisconnectedHighlight,
  UserId,
  PlayerSummary,
  TEAM_NAMES,
} from "../../demo";
import { KillIcon } from "../../components";

type HighlightProps = {
  event: Highlight;
  playerMap: Map<UserId, PlayerSummary>;
};

const useStyles = createStyles(
  (
    theme,
    {
      justifyContent,
    }: { justifyContent: React.CSSProperties["justifyContent"] }
  ) => ({
    root: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      justifyContent,
      height: 40,
    },
  })
);

function PlayerName({ player }: { player: PlayerSummary }) {
  const theme = useMantineTheme();
  let color = "unset";
  if (player.team === "red") {
    color = theme.colors.red[6];
  } else if (player.team === "blue") {
    color = theme.colors.blue[6];
  }
  return <span style={{ color }}>{player.name}</span>;
}

function KillHighlightBox(
  highlight: KillHighlight,
  playerMap: Map<UserId, PlayerSummary>
) {
  const defaultPlayerSummary: PlayerSummary = {
    name: "<unknown>",
    steam_id: 0,
    user_id: 0,
    team: "other",
    classes: [],
    damage: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    healing: 0,
    invulns: 0,
    captures: 0,
  };

  const { classes } = useStyles({ justifyContent: "right" });

  const killer = playerMap.get(highlight.killer_id);
  const assister =
    highlight.assister_id === null
      ? undefined
      : playerMap.get(highlight.assister_id) ?? defaultPlayerSummary;

  // Victim should always be known, but just in case...
  const victim = playerMap.get(highlight.victim_id) ?? defaultPlayerSummary;

  // Special case for kill messages with text instead of a kill icon
  if (highlight.kill_icon === "#fall") {
    return (
      <div className={classes.root}>
        <PlayerName player={victim} />
        &nbsp;fell to a clumsy, painful death
      </div>
    );
  } else if (highlight.kill_icon === "#suicide") {
    return (
      <div className={classes.root}>
        <PlayerName player={victim} />
        &nbsp;bid farewell, cruel world!
      </div>
    );
  } else if (highlight.kill_icon === "#assisted_suicide") {
    return (
      <div className={classes.root}>
        <PlayerName player={killer ?? defaultPlayerSummary} />
        {assister !== undefined && (
          <>
            &nbsp;+&nbsp;
            <PlayerName player={assister} />
          </>
        )}
        &nbsp;
        <b>finished off</b>
        &nbsp;
        <PlayerName player={victim} />
      </div>
    );
  } else {
    return (
      <div className={classes.root}>
        {killer !== undefined && <PlayerName player={killer} />}
        {assister !== undefined && (
          <>
            &nbsp;+&nbsp;
            <PlayerName player={assister} />
          </>
        )}
        &nbsp;
        <KillIcon killIcon={highlight.kill_icon} />
        &nbsp;
        <PlayerName player={victim} />
      </div>
    );
  }
}

function ChatMessageHighlightBox(
  highlight: ChatMessageHighlight,
  playerMap: Map<UserId, PlayerSummary>
) {
  const { classes } = useStyles({ justifyContent: "left" });
  const playerName = playerMap.get(highlight.sender)?.name ?? "<unknown>";
  return (
    <div className={classes.root}>
      <b>{playerName}:</b>&nbsp;
      {highlight.text}
    </div>
  );
}

function AirshotHighlightBox(
  highlight: AirshotHighlight,
  playerMap: Map<UserId, PlayerSummary>
) {
  const { classes } = useStyles({ justifyContent: "center" });
  const attackerName =
    playerMap.get(highlight.attacker_id)?.name ?? "<unknown>";
  const victimName = playerMap.get(highlight.victim_id)?.name ?? "<unknown>";
  return (
    <div className={classes.root}>
      AIRSHOT: {attackerName} airshot {victimName}
    </div>
  );
}

function CrossbowAirshotHighlightBox(
  highlight: CrossbowAirshotHighlight,
  playerMap: Map<UserId, PlayerSummary>
) {
  const { classes } = useStyles({ justifyContent: "center" });
  const healerName = playerMap.get(highlight.healer_id)?.name ?? "<unknown>";
  const targetName = playerMap.get(highlight.target_id)?.name ?? "<unknown>";
  return (
    <div className={classes.root}>
      AIRSHOT: {healerName} airshot {targetName}
    </div>
  );
}

function PointCapturedHighlightBox(
  highlight: PointCapturedHighlight,
  playerMap: Map<UserId, PlayerSummary>
) {
  const { classes } = useStyles({ justifyContent: "left" });

  const cappers = highlight.cappers.map(
    (capper) => playerMap.get(capper)?.name ?? "<unknown>"
  );

  return (
    <div className={classes.root}>
      {cappers.join(" + ")} captured {highlight.point_name}
    </div>
  );
}

function RoundStalemateHighlightBox() {
  const { classes } = useStyles({ justifyContent: "center" });
  return <div className={classes.root}>Round ended in a stalemate</div>;
}

function RoundStartHighlightBox() {
  const { classes } = useStyles({ justifyContent: "center" });
  return <div className={classes.root}>New round started</div>;
}

function RoundWinHighlightBox(highlight: RoundWinHighlight) {
  const { classes } = useStyles({ justifyContent: "center" });
  const team_number = highlight.winner;
  const teamName = TEAM_NAMES[team_number] ?? TEAM_NAMES[0];
  return <div className={classes.root}>{teamName} won the round</div>;
}

function PlayerConnectedHighlightBox(
  highlight: PlayerConnectedHighlight,
  playerMap: Map<UserId, PlayerSummary>
) {
  const { classes } = useStyles({ justifyContent: "left" });
  const playerName = playerMap.get(highlight.user_id)?.name ?? "<unknown>";

  return <div className={classes.root}>{playerName} has joined the game</div>;
}

function PlayerDisconnectedHighlightBox(
  highlight: PlayerDisconnectedHighlight,
  playerMap: Map<UserId, PlayerSummary>
) {
  const { classes } = useStyles({ justifyContent: "left" });
  const playerName = playerMap.get(highlight.user_id)?.name ?? "<unknown>";
  let reason = highlight.reason;
  if (reason === "#TF_MM_Generic_Kicked") {
    reason = "Removed from match by system";
  } else if (reason === "#TF_Idle_kicked") {
    reason = "Kicked due to inactivity";
  }
  return (
    <div className={classes.root}>
      {playerName} left the game ({reason})
    </div>
  );
}

function PauseHighlightBox() {
  const { classes } = useStyles({ justifyContent: "center" });
  return <div className={classes.root}>Game paused.</div>;
}

function UnpauseHighlightBox() {
  const { classes } = useStyles({ justifyContent: "center" });
  return <div className={classes.root}>Game resumed.</div>;
}

export default function HighlightBox({ event, playerMap }: HighlightProps) {
  if (event.t === "Kill") {
    return KillHighlightBox(event.c, playerMap);
  } else if (event.t === "ChatMessage") {
    return ChatMessageHighlightBox(event.c, playerMap);
  } else if (event.t === "Airshot") {
    return AirshotHighlightBox(event.c, playerMap);
  } else if (event.t === "CrossbowAirshot") {
    return CrossbowAirshotHighlightBox(event.c, playerMap);
  } else if (event.t === "PointCaptured") {
    return PointCapturedHighlightBox(event.c, playerMap);
  } else if (event.t === "RoundStalemate") {
    return RoundStalemateHighlightBox();
  } else if (event.t === "RoundStart") {
    return RoundStartHighlightBox();
  } else if (event.t === "RoundWin") {
    return RoundWinHighlightBox(event.c);
  } else if (event.t === "PlayerConnected") {
    return PlayerConnectedHighlightBox(event.c, playerMap);
  } else if (event.t === "PlayerDisconnected") {
    return PlayerDisconnectedHighlightBox(event.c, playerMap);
  } else if (event.t === "Pause") {
    return PauseHighlightBox();
  } else if (event.t === "Unpause") {
    return UnpauseHighlightBox();
  } else {
    console.error("unknown highlight:", event);
    return null;
  }
}
