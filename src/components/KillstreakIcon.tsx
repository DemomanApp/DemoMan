import KillStreakIcon from "../assets/kill_icons/killstreak_icon.png";
import KillStreakIconNeg from "../assets/kill_icons/killstreak_icon_neg.png";

import { useMantineTheme } from "@mantine/core";

export type KillstreakIconProps = {
  streak: number;
}

export default function KillstreakIcon({ streak }: KillstreakIconProps) {
  const { colorScheme } = useMantineTheme();
  const iconFile = KillStreakIcon;
  const iconNegFile = KillStreakIconNeg;

  if (streak > 0) {
    return (
      <span style={{ display: "flex", flexDirection: "row", paddingLeft: 4, color: "white", fontFamily: "Verdana", fontWeight: 800 }}>
        <span style={{ margin: "auto" }}>{streak}</span>
        <div style={{
          backgroundImage: `url(${
            colorScheme === "dark" ? iconFile : iconNegFile
          })`,
          height: 32,
          width: 33,
          transform: "scale(0.5)",
        }}/>
      </span>
    );
  } else {
    // No streak, render nothing
    return (
      <></>
    );
  }
}
