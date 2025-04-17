import { ClassIcon } from "@/components";
import { type PlayerSummary, stringifyClass } from "@/demo";
import { formatDuration } from "@/util";
import { Progress, Tooltip } from "@mantine/core";

export default function ClassPlaytimeIndicator({
  player,
  intervalPerTick,
}: {
  player: PlayerSummary;
  intervalPerTick: number;
}) {
  const totalPlaytime = player.time_on_class.reduce(
    (sum, value) => sum + value
  );
  const sections = player.time_on_class
    .map((playtime, cls) => ({ playtime, cls }))
    // Filter out classes with less than 1s of playtime
    // I've encountered demos with class playtimes of more than 0, but less than 1s.
    .filter(({ playtime }) => playtime > 1 / intervalPerTick)
    .sort(
      ({ playtime: playtime1 }, { playtime: playtime2 }) =>
        playtime2 - playtime1
    )
    .map(({ playtime, cls }, index) => (
      <Tooltip
        label={`${stringifyClass(cls)}: ${formatDuration(
          playtime * intervalPerTick
        )}`}
        key={cls}
      >
        <Progress.Section
          value={(100 * playtime) / totalPlaytime}
          color={`blue.${9 - index}`}
        >
          <ClassIcon size={20} cls={cls} />
        </Progress.Section>
      </Tooltip>
    ));
  return <Progress.Root size={24}>{sections}</Progress.Root>;
}
