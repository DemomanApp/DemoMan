import * as log from "@tauri-apps/plugin-log";

import type { ReactNode } from "react";

import CapturePoints from "@/assets/translations/capture_points.json";
import { KillIcon } from "@/components";
import KillstreakIcon from "@/components/KillstreakIcon";
import {
  type AirshotHighlight,
  type ChatMessageHighlight,
  type CrossbowAirshotHighlight,
  destructureHighlight,
  type Highlight,
  type HighlightPlayerSnapshot,
  type KillHighlight,
  type KillStreakEndedHighlight,
  type KillStreakHighlight,
  type MessageHighlight,
  type PauseHighlight,
  type PlayerConnectedHighlight,
  type PlayerDisconnectedHighlight,
  type PlayerTeamChangeHighlight,
  type PointCapturedHighlight,
  type RoundStalemateHighlight,
  type RoundStartHighlight,
  type RoundWinHighlight,
  type Team,
} from "@/demo";

import classes from "./HighlightBox.module.css";

type HighlightProps = {
  event: Highlight;
};

type PlayerNameProps = {
  player: HighlightPlayerSnapshot | undefined;
};

function PlayerName({ player }: PlayerNameProps) {
  const name = player?.name ?? "<unknown>";
  const team = player?.team ?? "other";

  const color = teamColor(team);
  return <span style={{ color }}>{name}</span>;
}

function TeamName({ team }: { team: Team }) {
  let teamName: string;
  switch (team) {
    case "red":
      teamName = "RED";
      break;
    case "blue":
      teamName = "BLU";
      break;
    case "spectator":
      teamName = "SPECTATOR";
      break;
    case "other":
      teamName = "OTHER";
      break;
  }
  return <span style={{ color: teamColor(team) }}>{teamName}</span>;
}

function teamColor(team: Team): string {
  let color: string;
  switch (team) {
    case "red":
      color = "var(--mantine-color-red-filled)";
      break;
    case "blue":
      color = "var(--mantine-color-blue-filled)";
      break;
    default:
      color = "var(--mantine-color-text)";
      break;
  }
  return color;
}

function intersperse<T>(array: T[], filler: (index: number) => T): T[] {
  const output: T[] = [];
  array.forEach((value, i) => {
    output.push(value);
    if (i < array.length - 1) {
      output.push(filler(i));
    }
  });
  return output;
}

function PlayerNames({ players }: { players: HighlightPlayerSnapshot[] }) {
  if (players.length === 0) {
    return undefined;
  }

  return (
    <>
      {intersperse(
        players.map((player) => {
          return <PlayerName key={player?.user_id} player={player} />;
        }),
        (index) => {
          return <span key={index}>&nbsp;+&nbsp;</span>;
        }
      )}
    </>
  );
}

function KillHighlightBox(highlight: KillHighlight) {
  const { killer, assister, victim } = highlight;

  // Special case for kill messages with text instead of a kill icon
  if (highlight.kill_icon === "#fall") {
    return (
      <div className={classes.highlightRight}>
        <PlayerName player={victim} />
        &nbsp;fell to a clumsy, painful death
      </div>
    );
  }
  if (highlight.kill_icon === "#suicide") {
    return (
      <div className={classes.highlightRight}>
        <PlayerName player={victim} />
        &nbsp;bid farewell, cruel world!
      </div>
    );
  }
  if (highlight.kill_icon === "#assisted_suicide") {
    return (
      <div className={classes.highlightRight}>
        <PlayerName player={killer} />
        {assister !== null && (
          <>
            &nbsp;+&nbsp;
            <PlayerName player={assister} />
          </>
        )}
        &nbsp; finished off &nbsp;
        <PlayerName player={victim} />
      </div>
    );
  }

  return (
    <div className={classes.highlightRight}>
      {killer !== null &&
        killer.user_id !== victim.user_id &&
        killer.team !== "other" && <PlayerName player={killer} />}
      {assister !== null && (
        <>
          &nbsp;+&nbsp;
          <PlayerName player={assister} />
        </>
      )}
      &nbsp;
      <KillstreakIcon streak={highlight.streak} />
      <KillIcon killIcon={highlight.kill_icon} />
      &nbsp;
      <PlayerName player={victim} />
    </div>
  );
}

function KillStreakHighlightBox(highlight: KillStreakHighlight) {
  const { player, streak } = highlight;
  let message: string;
  switch (streak) {
    case 5:
      message = "is on a Killing Spree!";
      break;
    case 10:
      message = "is Unstoppable!";
      break;
    case 15:
      message = "is on a Rampage!";
      break;
    case 20:
      message = "is GOD-like!";
      break;
    default:
      if (streak > 0 && streak % 5 === 0) {
        // Multiple of 5 and greater than 20, so it's a continuation of a godlike streak
        message = "is still GOD-like!";
      } else {
        // Bad reporting? Fall back to reasonable message
        message = "is collecting frags!";
      }
      break;
  }

  return (
    <div className={classes.highlightCenter}>
      <span>
        <PlayerName player={player} /> {message}
      </span>
      <KillstreakIcon streak={streak} />
    </div>
  );
}

function KillStreakEndedHighlightBox(highlight: KillStreakEndedHighlight) {
  const { killer, victim, streak } = highlight;

  let message: ReactNode;
  if (killer.user_id === victim.user_id) {
    message = (
      <span>
        <PlayerName player={killer} /> ended their own killstreak
      </span>
    );
  } else {
    message = (
      <span>
        <PlayerName player={killer} /> ended <PlayerName player={victim} />
        &apos;s killstreak
      </span>
    );
  }

  return (
    <div className={classes.highlightCenter}>
      <span>{message}</span>
      <KillstreakIcon streak={streak} />
    </div>
  );
}

function ChatMessageHighlightBox(highlight: ChatMessageHighlight) {
  return (
    <div className={classes.highlightLeft}>
      <PlayerName player={highlight.sender} />
      :&nbsp;
      {highlight.text}
    </div>
  );
}

function MessageHighlightBox(highlight: MessageHighlight) {
  let text = highlight.text;
  if (text === "#TF_TeamsSwitched") {
    text = "Teams have been switched.";
  }

  return <div className={classes.highlightCenter}>{text}</div>;
}

function AirshotHighlightBox(highlight: AirshotHighlight) {
  const attackerName = highlight.attacker.name;
  const victimName = highlight.victim.name;
  return (
    <div className={classes.highlightCenter}>
      AIRSHOT: {attackerName} airshot {victimName}
    </div>
  );
}

function CrossbowAirshotHighlightBox(highlight: CrossbowAirshotHighlight) {
  const healerName = highlight.healer.name;
  const targetName = highlight.target.name;
  return (
    <div className={classes.highlightCenter}>
      AIRSHOT: {healerName} airshot {targetName}
    </div>
  );
}

function PointCapturedHighlightBox(highlight: PointCapturedHighlight) {
  let icon: string | undefined;

  // For some reason the two capture icons are slightly
  // misaligned: The red variant has more empty pixels
  // on the right side of the icon.
  // Also, the colors of the icons come straight from the game
  // files and thus do not match the rest of the app's color
  // scheme.
  // TODO fix that.
  if (highlight.capturing_team === 2) {
    icon = "redcapture";
  } else if (highlight.capturing_team === 3) {
    icon = "bluecapture";
  }

  const translationLookup = highlight.point_name.substring(1); // substring(1) to remove the leading "#" character
  const pointName =
    CapturePoints[translationLookup as keyof typeof CapturePoints] ??
    highlight.point_name;

  return (
    <div className={classes.highlightRight}>
      <PlayerNames players={highlight.cappers} />
      &nbsp;
      {icon !== undefined && <KillIcon killIcon={icon} />}
      captured {pointName}
    </div>
  );
}

function RoundStalemateHighlightBox({
  reason: _reason,
}: RoundStalemateHighlight) {
  // TODO: show reason
  return (
    <div className={classes.highlightCenter}>Round ended in a stalemate</div>
  );
}

function RoundStartHighlightBox({
  full_reset: _full_reset,
}: RoundStartHighlight) {
  // TODO: show full reset
  return <div className={classes.highlightCenter}>New round started</div>;
}

function RoundWinHighlightBox(highlight: RoundWinHighlight) {
  return (
    <div className={classes.highlightCenter}>
      <TeamName team={highlight.winner} />
      &nbsp;won the round
    </div>
  );
}

function PlayerConnectedHighlightBox(highlight: PlayerConnectedHighlight) {
  return (
    <div className={classes.highlightLeft}>
      {highlight.player.name} has joined the game
    </div>
  );
}

function PlayerDisconnectedHighlightBox(
  highlight: PlayerDisconnectedHighlight
) {
  let reason = highlight.reason;
  if (reason === "#TF_MM_Generic_Kicked") {
    reason = "Removed from match by system";
  } else if (reason === "#TF_Idle_kicked") {
    reason = "Kicked due to inactivity";
  }
  return (
    <div className={classes.highlightLeft}>
      {highlight.player.name} left the game ({reason})
    </div>
  );
}

function PlayerTeamChangeHighlightBox(highlight: PlayerTeamChangeHighlight) {
  return (
    <div className={classes.highlightLeft}>
      {highlight.player.name} has joined team&nbsp;
      <TeamName team={highlight.team} />
    </div>
  );
}

function PauseHighlightBox({ pause }: PauseHighlight) {
  return (
    <div className={classes.highlightCenter}>
      Game {pause ? "paused" : "resumed"}.
    </div>
  );
}

export default function HighlightBox({ event }: HighlightProps) {
  const { type, highlight } = destructureHighlight(event);

  switch (type) {
    case "Kill":
      return KillHighlightBox(highlight);
    case "KillStreak":
      return KillStreakHighlightBox(highlight);
    case "KillStreakEnded":
      return KillStreakEndedHighlightBox(highlight);
    case "ChatMessage":
      return ChatMessageHighlightBox(highlight);
    case "Message":
      return MessageHighlightBox(highlight);
    case "Airshot":
      return AirshotHighlightBox(highlight);
    case "CrossbowAirshot":
      return CrossbowAirshotHighlightBox(highlight);
    case "PointCaptured":
      return PointCapturedHighlightBox(highlight);
    case "RoundStalemate":
      return RoundStalemateHighlightBox(highlight);
    case "RoundStart":
      return RoundStartHighlightBox(highlight);
    case "RoundWin":
      return RoundWinHighlightBox(highlight);
    case "PlayerConnected":
      return PlayerConnectedHighlightBox(highlight);
    case "PlayerDisconnected":
      return PlayerDisconnectedHighlightBox(highlight);
    case "PlayerTeamChange":
      return PlayerTeamChangeHighlightBox(highlight);
    case "Pause":
      return PauseHighlightBox(highlight);
    default:
      log.error(`unknown highlight: ${event}`);
      return null;
  }
}
