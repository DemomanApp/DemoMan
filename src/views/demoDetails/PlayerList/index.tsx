import { createStyles, Paper, ScrollArea, Text } from "@mantine/core";
import { GameSummary, PlayerSummary, EMPTY_SCOREBOARD } from "../../../demo";
import { TableHeader } from "./TableHeader";
import { PlayerBox } from "./PlayerBox";
import { ScoreboardTable } from "./ScoreboardTable";

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

  gameSummary.players.forEach((player) => {
    if (player.team === "red") {
      redPlayers.push(player);
    } else if (player.team === "blue") {
      bluPlayers.push(player);
    } else {
      others.push(player);
    }
  });

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
              <PlayerBox key={player.user_id} player={player} mainPlayer={ player.user_id === gameSummary.local_user_id } />
            ))}
          </div>
          <div className={classes.playerListColumn}>
            {redPlayers.map((player) => (
              <PlayerBox key={player.user_id} player={player} mainPlayer={ player.user_id === gameSummary.local_user_id } />
            ))}
          </div>
        </div>
      </ScrollArea.Autosize>
      <div>
        {/* Player-specific scoreboard */}
        <ScoreboardTable scoreboard={ gameSummary.players.find(s => s.user_id === gameSummary.local_user_id)?.scoreboard ?? EMPTY_SCOREBOARD }/>
      </div>
    </Paper>
  );
}
