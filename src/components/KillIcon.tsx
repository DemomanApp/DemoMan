import { useMantineColorScheme } from "@mantine/core";
import KillIconData from "./KillIconData";

export type KillIconProps = {
  killIcon: string;
};

export default function KillIcon({ killIcon }: KillIconProps) {
  const { colorScheme } = useMantineColorScheme();
  let weaponData = KillIconData[killIcon];
  if (weaponData === undefined) {
    weaponData = KillIconData.skull;
  }
  const { iconFile, iconNegFile, x, y, width, height } = weaponData;

  // Almost all icons are 32px tall.
  // Very few icons are a different size.
  // Some are 31px or 33px tall, but some extreme cases
  // are far away from 32px (like taunt_scout, which is 64px tall).
  // For these special cases, we need to scale everything accordingly
  // so the resulting icons are of uniform height.
  const scale = height / 32;
  return (
    <div
      style={{
        display: "inline-block",
        width: width / scale,
        height: 32,
        backgroundImage: `url(${
          colorScheme === "dark" ? iconFile : iconNegFile
        })`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `-${x / scale}px -${y / scale}px`,
        // All three images are 512px wide.
        // This sets the horizontal size of the background image,
        // the height is "auto".
        backgroundSize: 512 / scale,
      }}
    />
  );
}
