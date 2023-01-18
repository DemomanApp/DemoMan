import { createStyles, Text } from "@mantine/core";
import ClassIcon from "../../../components/ClassIcon";

import { PlayerSummary } from "../../../demo";

interface PlayerBoxProps {
  player: PlayerSummary;
  selected: boolean;
  onClick: () => void;
}

const useStyles = createStyles((theme) => ({
  box: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    paddingRight: 8,
    "&:hover": {
      backgroundColor: theme.colors.dark[5],
      cursor: "pointer",
    },
  },
  selectedBox: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    paddingRight: 8,
    background: theme.colors.indigo[9],
    "&:hover": {
      backgroundColor: theme.colors.indigo[7],
      cursor: "pointer",
    },
  },
  classIcon: {
    width: 32,
  },
  playerName: {
    addingLeft: "8px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  pointsScoreboardValue: {
    width: 40,
    textAlign: "right",
  },
  simpleScoreboardValue: {
    width: 30,
    textAlign: "right",
  },
}));

export function PlayerBox({ player, selected, onClick }: PlayerBoxProps) {
  const { classes } = useStyles();

  return (
    <div
      onClick={onClick}
      className={selected ? classes.selectedBox : classes.box}
    >
      <div className={classes.classIcon}>
        <ClassIcon cls={player.classes[0]} muted={false} size={24} />
      </div>
      <div style={{ flexGrow: 1 }}>
        <Text className={classes.playerName}>{player.name}</Text>
      </div>
      {/* TODO: Show player's dominations */}
      <div className={classes.pointsScoreboardValue}>
        {player.scoreboard.points}
      </div>
      <div className={classes.simpleScoreboardValue}>
        {player.scoreboard.kills}
      </div>
      <div className={classes.simpleScoreboardValue}>
        {player.scoreboard.assists}
      </div>
      <div className={classes.simpleScoreboardValue}>
        {player.scoreboard.deaths}
      </div>
    </div>
  );
}
