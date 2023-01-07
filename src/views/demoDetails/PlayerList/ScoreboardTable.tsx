import React from "react";
import { Scoreboard } from "../../../demo";
import { createStyles } from "@mantine/core";

interface ScoreboardTableProps {
  scoreboard: Scoreboard;
}

const useStyles = createStyles((theme) => ({
  scoreboard: {
    tableLayout: "fixed",
    width: "100%",
    background: "rgba(0, 0, 0, 0.4)",
  },
  scoreLabel: {
    textAlign: "right",
  },
  scoreValue: {
    textAlign: "left",
  },
  zeroScore: {
    // Use default text color
  },
  nonZeroScore: {
    color: "#2fdd24", // Default HUD color
  },
}));

export function ScoreboardTable({ scoreboard }: ScoreboardTableProps) {
  const { classes } = useStyles();

  return (
    <div>
      <table className={classes.scoreboard}>
        <thead>{/* No headers */}</thead>
        <tbody>
          {/* Row 1: Kills|Captures|Invulns|Backstabs */}
          <tr>
            <td className={classes.scoreLabel}>Kills:</td>
            <td
              className={
                scoreboard.kills == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.kills}
            </td>
            <td className={classes.scoreLabel}>Captures:</td>
            <td
              className={
                scoreboard.captures == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.captures}
            </td>
            <td className={classes.scoreLabel}>Invulns:</td>
            <td
              className={
                scoreboard.ubercharges == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.ubercharges}
            </td>
            <td className={classes.scoreLabel}>Backstabs:</td>
            <td
              className={
                scoreboard.backstabs == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.backstabs}
            </td>
          </tr>

          {/* Row 2: Deaths|Defenses|Headshots|Bonus */}
          <tr>
            <td className={classes.scoreLabel}>Deaths:</td>
            <td
              className={
                scoreboard.deaths == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.deaths}
            </td>
            <td className={classes.scoreLabel}>Defenses:</td>
            <td
              className={
                scoreboard.defenses == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.defenses}
            </td>
            <td className={classes.scoreLabel}>Headshots:</td>
            <td
              className={
                scoreboard.headshots == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.headshots}
            </td>
            <td className={classes.scoreLabel}>Bonus:</td>
            <td
              className={
                scoreboard.bonus_points == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.bonus_points}
            </td>
          </tr>

          {/* Row 3: Assists|Domination|Teleports|Support */}
          <tr>
            <td className={classes.scoreLabel}>Assists:</td>
            <td
              className={
                scoreboard.assists == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.assists}
            </td>
            <td className={classes.scoreLabel}>Domination:</td>
            <td
              className={
                scoreboard.dominations == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.dominations}
            </td>
            <td className={classes.scoreLabel}>Teleports:</td>
            <td
              className={
                scoreboard.teleports == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.teleports}
            </td>
            <td className={classes.scoreLabel}>Support:</td>
            <td
              className={
                scoreboard.support == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.support}
            </td>
          </tr>

          {/* Row 4: Destruction|Revenge|Healing|Damage */}
          <tr>
            <td className={classes.scoreLabel}>Destruction:</td>
            <td
              className={
                scoreboard.buildings_destroyed == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.buildings_destroyed}
            </td>
            <td className={classes.scoreLabel}>Revenge:</td>
            <td
              className={
                scoreboard.revenges == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.revenges}
            </td>
            <td className={classes.scoreLabel}>Healing:</td>
            <td
              className={
                scoreboard.healing == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.healing}
            </td>
            <td className={classes.scoreLabel}>Damage:</td>
            <td
              className={
                scoreboard.damage_dealt == 0
                  ? `${classes.scoreValue} ${classes.zeroScore}`
                  : `${classes.scoreValue} ${classes.nonZeroScore}`
              }
            >
              {scoreboard.damage_dealt}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
