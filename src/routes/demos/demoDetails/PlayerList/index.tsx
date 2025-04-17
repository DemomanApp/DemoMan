import { useState } from "react";

import { Paper } from "@mantine/core";

import type { GameSummary, PlayerSummary } from "@/demo";
import { PlayerTable } from "./PlayerTable";
import { PlayerDetails } from "./PlayerDetails";

import classes from "./PlayerList.module.css";

export type PlayerListProps = {
  gameSummary: GameSummary;
};

export default function PlayerList({ gameSummary }: PlayerListProps) {
  const mainPlayer: PlayerSummary =
    gameSummary.players.find((p) => p.user_id === gameSummary.local_user_id) ??
    gameSummary.players[0];

  const [currentPlayer, setCurrentPlayer] = useState(mainPlayer);

  return (
    <Paper radius="md" className={classes.paper} withBorder>
      <PlayerTable
        gameSummary={gameSummary}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
      />
      <PlayerDetails gameSummary={gameSummary} player={currentPlayer} />
    </Paper>
  );
}
