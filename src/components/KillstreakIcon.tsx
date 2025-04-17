import { Text, useMantineColorScheme } from "@mantine/core";

import KillStreakIcon from "@/assets/kill_icons/killstreak_icon.png";
import KillStreakIconNeg from "@/assets/kill_icons/killstreak_icon_neg.png";

export type KillstreakIconProps = {
  streak: number;
};

export default function KillstreakIcon({ streak }: KillstreakIconProps) {
  const { colorScheme } = useMantineColorScheme();
  const iconFile = KillStreakIcon;
  const iconNegFile = KillStreakIconNeg;

  if (streak > 0) {
    return (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          margin: "0 2px",
        }}
      >
        <Text fw={800}>{streak}</Text>
        <span
          style={{
            backgroundImage: `url(${
              colorScheme === "dark" ? iconFile : iconNegFile
            })`,
            backgroundRepeat: "no-repeat",
            backgroundSize: 17,
            height: 16,
            width: 17,
          }}
        />
      </span>
    );
  }
}
