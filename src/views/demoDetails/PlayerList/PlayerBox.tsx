import { Text } from "@mantine/core";

import ClassIcon from "../../../components/ClassIcon";
import { PlayerSummary } from "../../../demo";
import { indexOfMax } from "../../../util";

import classes from "./PlayerBox.module.css";

interface PlayerBoxProps {
  player: PlayerSummary;
  selected: boolean;
  onClick: () => void;
}

export function PlayerBox({ player, selected, onClick }: PlayerBoxProps) {
  const primary_class = indexOfMax(player.time_on_class);

  return (
    <div onClick={onClick} className={classes.root} data-selected={selected}>
      <div className={classes.classIcon}>
        {primary_class !== undefined && (
          <ClassIcon cls={primary_class} size={24} />
        )}
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
