import { createStyles, Paper, ScrollArea, Tabs, Text } from "@mantine/core";
import { GameSummary, PlayerSummary, EMPTY_SCOREBOARD } from "../../../demo";
import { TableHeader } from "./TableHeader";
import { PlayerBox } from "./PlayerBox";
import ScoreboardTable from "./ScoreboardTable";
import { MutableRefObject, useRef, useState } from "react";

export type PlayerListProps = {
  gameSummary: GameSummary;
};

const useStyles = createStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    overflow: "hidden",
  },
  header: {
    width: "50%",
    display: "inline-flex",
    justifyContent: "space-between",
    padding: "8px",
  },
  divider: {
    height: "4px",
    width: "100%",
    background: `linear-gradient(90deg,\
        ${theme.colors.blue[7]} 0%,\
        ${theme.colors.blue[7]} 50%,\
        ${theme.colors.red[7]} 50%,\
        ${theme.colors.red[7]} 100%\
        )`,
  },
  playerListColumn: {
    width: "50%",
    display: "inline-block",
    verticalAlign: "top",
  },
}));

export default function PlayerList({ gameSummary }: PlayerListProps) {
  const redPlayers: PlayerSummary[] = [];
  const bluPlayers: PlayerSummary[] = [];
  const others: PlayerSummary[] = [];

  const mainPlayer: PlayerSummary | null = gameSummary.players.find(p => p.user_id === gameSummary.local_user_id) ?? null;

  // Used so we can display the scoreboard for any arbitrary player via user interaction
  const scoreboardRef: MutableRefObject<ScoreboardTable | null> = useRef(null);
  const [currentPlayer, setCurrentPlayer] = useState(mainPlayer);

  // currentTab will be either the round number (0..n), or "match" to display the scoreboard for the entire game
  const [currentTab, setCurrentTab] = useState<string | number>("match");

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
  // TODO: Maybe add a button to export the match data as JSON?
  redPlayers.sort((a, b) => b.scoreboard?.points - a.scoreboard?.points);
  bluPlayers.sort((a, b) => b.scoreboard?.points - a.scoreboard?.points);

  const { classes } = useStyles();

  return (
    <Paper radius="md" className={classes.paper} withBorder>
      {/* Header */}
      <div>
        <div className={classes.header}>
          <Text size={30} weight={600} color="blue.7">
            BLU
          </Text>
          <Text size={30} weight={600} color="blue.7">
            {gameSummary.blue_team_score}
          </Text>
        </div>
        <div className={classes.header}>
          <Text size={30} weight={600} color="red.7">
            {gameSummary.red_team_score}
          </Text>
          <Text size={30} weight={600} color="red.7">
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
      {/* Player list */}
      <ScrollArea.Autosize maxHeight={360}>
        <div>
          <div className={classes.playerListColumn}>
            {bluPlayers.map((player) => (
              <PlayerBox key={player.user_id} player={player} onClick={ () => {
                setCurrentPlayer(player);
                const scoreboard = currentTab === "match" ? player.scoreboard : player.round_scoreboards[currentTab as unknown as number];
                scoreboardRef.current?.setScoreboard(scoreboard);
              } } selected={ player.user_id === mainPlayer?.user_id } />
            ))}
          </div>
          <div className={classes.playerListColumn}>
            {redPlayers.map((player) => (
              <PlayerBox key={player.user_id} onClick={ () => {
                setCurrentPlayer(player);
                const scoreboard = currentTab === "match" ? player.scoreboard : player.round_scoreboards[currentTab as unknown as number];
                scoreboardRef.current?.setScoreboard(scoreboard);
              } } player={player} selected={ player.user_id === mainPlayer?.user_id } />
            ))}
          </div>
        </div>
      </ScrollArea.Autosize>
      <div>
        <Tabs defaultValue={"match"}>
          <Tabs.List>
            <Tabs.Tab
                value={"match"}
                onClick={ () => {
                  setCurrentTab("match");
                  scoreboardRef.current?.setScoreboard(currentPlayer?.scoreboard ?? EMPTY_SCOREBOARD);
                } }
            >
              Match
            </Tabs.Tab>
            {
              Array.from({ length: gameSummary.num_rounds }, (x, i) => i).map((roundNum) => {
                return (
                    <Tabs.Tab
                        value={`round${roundNum}`}
                        key={roundNum}
                        disabled={ (currentPlayer?.round_scoreboards[roundNum] ?? null) === null } // disable if the player wasn't in this round
                        onClick={ () => {
                          setCurrentTab(roundNum);
                          scoreboardRef.current?.setScoreboard(currentPlayer?.round_scoreboards[roundNum] ?? EMPTY_SCOREBOARD);
                        } }
                    >
                      Round {roundNum + 1}
                    </Tabs.Tab>
                );
              })
            }
          </Tabs.List>
        </Tabs>
        {/* The actual scoreboard component.  This will be updated when players or tabs are clicked, rather than creating an entirely new component */}
        <ScoreboardTable ref={scoreboardRef} scoreboard={ mainPlayer?.scoreboard ?? EMPTY_SCOREBOARD }/>
      </div>
    </Paper>
  );
}
