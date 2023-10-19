import { useMemo, useState } from "react";

import { Divider, Paper, ScrollArea, Tabs, Text, Title } from "@mantine/core";

import { GameSummary, PlayerSummary } from "../../../../../demo";
import { PlayerBox } from "./PlayerBox";
import { ScoreboardTable } from "./ScoreboardTable";
import { TableHeader } from "./TableHeader";

import classes from "./PlayerList.module.css";

export type PlayerListProps = {
  gameSummary: GameSummary;
};

export default function PlayerList({ gameSummary }: PlayerListProps) {
  const [redPlayers, bluPlayers, _others] = useMemo(() => {
    const redPlayers: PlayerSummary[] = [];
    const bluPlayers: PlayerSummary[] = [];
    const others: PlayerSummary[] = [];

    gameSummary.players.forEach((player) => {
      if (player.team === "red") {
        redPlayers.push(player);
      } else if (player.team === "blue") {
        bluPlayers.push(player);
      } else {
        others.push(player);
      }
    });

    // TODO: Allow the tables to be sorted by the column headers (kills, deaths, etc)
    redPlayers.sort((a, b) => b.scoreboard?.points - a.scoreboard?.points);
    bluPlayers.sort((a, b) => b.scoreboard?.points - a.scoreboard?.points);
    return [redPlayers, bluPlayers, others];
  }, [gameSummary]);

  const mainPlayer: PlayerSummary | null =
    gameSummary.players.find((p) => p.user_id === gameSummary.local_user_id) ??
    null;

  const [currentPlayer, setCurrentPlayer] = useState(mainPlayer);

  // currentTab will be either the round number (0..n), or "match" to display the scoreboard for the entire game
  const [currentTab, setCurrentTab] = useState<"match" | number>("match");

  return (
    <Paper radius="md" className={classes.paper} withBorder>
      {/* Header */}
      <div>
        <div className={classes.header}>
          <Text fz={30} fw={600} c="blue.7">
            BLU
          </Text>
          <Text fz={30} fw={600} c="blue.7">
            {gameSummary.blue_team_score}
          </Text>
        </div>
        <div className={classes.header}>
          <Text fz={30} fw={600} c="red.7">
            {gameSummary.red_team_score}
          </Text>
          <Text fz={30} fw={600} c="red.7">
            RED
          </Text>
        </div>
      </div>
      {/* Divider */}
      <div className={classes.divider} />
      {/* Table header */}
      <div>
        <TableHeader />
        <TableHeader />
      </div>
      <Divider />
      {/* Player list */}
      <ScrollArea.Autosize mah={360}>
        <div>
          <div className={classes.playerListColumn}>
            {bluPlayers.map((player) => (
              <PlayerBox
                key={player.user_id}
                player={player}
                onClick={() => setCurrentPlayer(player)}
                selected={player.user_id === currentPlayer?.user_id}
              />
            ))}
          </div>
          <div className={classes.playerListColumn}>
            {redPlayers.map((player) => (
              <PlayerBox
                key={player.user_id}
                onClick={() => setCurrentPlayer(player)}
                player={player}
                selected={player.user_id === currentPlayer?.user_id}
              />
            ))}
          </div>
        </div>
      </ScrollArea.Autosize>
      {currentPlayer !== null && (
        <>
          {/* Divider above the scoreboard*/}
          <Divider />
          <div className={classes.scoreboardPlayerNameHeader}>
            <Title>{currentPlayer.name}</Title>
          </div>
          <div>
            <Tabs defaultValue={"match"} value={currentTab.toString()}>
              <Tabs.List>
                <Tabs.Tab
                  value={"match"}
                  onClick={() => {
                    setCurrentTab("match");
                  }}
                >
                  Match
                </Tabs.Tab>
                {Array.from(
                  { length: gameSummary.num_rounds },
                  (_x, i) => i
                ).map((roundNum) => {
                  return (
                    <Tabs.Tab
                      value={`${roundNum}`}
                      key={roundNum}
                      disabled={
                        // disable if the player wasn't in this round
                        currentPlayer.round_scoreboards[roundNum] === undefined
                      }
                      onClick={() => {
                        if (
                          currentPlayer.round_scoreboards[roundNum] !==
                          undefined
                        ) {
                          setCurrentTab(roundNum);
                        }
                      }}
                    >
                      Round {roundNum + 1}
                    </Tabs.Tab>
                  );
                })}
              </Tabs.List>
            </Tabs>
            <ScoreboardTable
              scoreboard={
                currentTab === "match"
                  ? currentPlayer.scoreboard
                  : currentPlayer.round_scoreboards[currentTab]
              }
            />
          </div>
        </>
      )}
    </Paper>
  );
}
