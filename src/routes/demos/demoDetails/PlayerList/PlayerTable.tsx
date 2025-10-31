import { type ReactNode, useMemo } from "react";

import { getScrollbarSize } from "react-window";

import { Anchor } from "@mantine/core";

import { type GameSummary, type PlayerSummary, primaryTeam } from "@/demo";
import { PlayerBox } from "./PlayerBox";
import { TableHeader } from "./TableHeader";

import classes from "./PlayerTable.module.css";

type PlayerTableProps = {
  gameSummary: GameSummary;
  currentPlayer: PlayerSummary;
  setCurrentPlayer(player: PlayerSummary): void;
};

type PlayerColumnProps = {
  players: PlayerSummary[];
  currentPlayer: PlayerSummary;
  setCurrentPlayer(player: PlayerSummary): void;
};

function PlayerColumn({
  players,
  currentPlayer,
  setCurrentPlayer,
}: PlayerColumnProps) {
  return (
    <div className={classes.playerListColumn}>
      {players.map((player) => (
        <PlayerBox
          key={player.user_id}
          player={player}
          onClick={() => {
            setCurrentPlayer(player);
          }}
          selected={player.user_id === currentPlayer.user_id}
        />
      ))}
    </div>
  );
}

export function PlayerTable({
  gameSummary,
  currentPlayer,
  setCurrentPlayer,
}: PlayerTableProps) {
  const [redPlayers, bluPlayers, others] = useMemo(() => {
    const redPlayers: PlayerSummary[] = [];
    const bluPlayers: PlayerSummary[] = [];
    const others: PlayerSummary[] = [];

    for (const player of gameSummary.players) {
      const team = primaryTeam(player);
      if (team === "red") {
        redPlayers.push(player);
      } else if (team === "blue") {
        bluPlayers.push(player);
      } else {
        others.push(player);
      }
    }

    // TODO: Allow the tables to be sorted by the column headers (kills, deaths, etc)
    redPlayers.sort((a, b) => b.scoreboard?.points - a.scoreboard?.points);
    bluPlayers.sort((a, b) => b.scoreboard?.points - a.scoreboard?.points);
    return [redPlayers, bluPlayers, others];
  }, [gameSummary]);

  const scrollbarSize = useMemo(getScrollbarSize, []);

  return (
    <div
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div>
        <div className={classes.bluHeader}>
          <span>BLU</span>
          <span>{gameSummary.blue_team_score}</span>
        </div>
        <div className={classes.redHeader}>
          <span>{gameSummary.red_team_score}</span>
          <span>RED</span>
        </div>
      </div>
      <div style={{ paddingRight: scrollbarSize }}>
        <TableHeader />
        <TableHeader />
      </div>
      <div
        style={{ flexGrow: 1, overflow: "auto", scrollbarGutter: "stable" }}
        className={classes.scrollShadow}
      >
        <PlayerColumn
          players={bluPlayers}
          currentPlayer={currentPlayer}
          setCurrentPlayer={setCurrentPlayer}
        />
        <PlayerColumn
          players={redPlayers}
          currentPlayer={currentPlayer}
          setCurrentPlayer={setCurrentPlayer}
        />
      </div>
      <div className={classes.spectatorList}>
        Spectators:{" "}
        {others
          .map<ReactNode>((player) => (
            <Anchor
              className={classes.spectatorName}
              onClick={() => setCurrentPlayer(player)}
              key={player.user_id}
            >
              {player.name}
            </Anchor>
          ))
          .intersperse(", ")}
      </div>
    </div>
  );
}
