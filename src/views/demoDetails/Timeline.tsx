import { useState } from "react";
import { Text, createStyles, Stack } from "@mantine/core";
import { useMove } from "@mantine/hooks";

const useStyles = createStyles((theme, { value }: { value: number }) => {
  const barHeight = 100;
  const thumbSize = 16;
  return {
    bar: {
      width: "100%",
      height: barHeight,
      marginTop: theme.spacing.md,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      position: "relative",
    },
    filledBar: {
      width: `${value * 100}%`,
      height: barHeight,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.blue[9]
          : theme.colors.blue[2],
    },
    thumb: {
      position: "absolute",
      left: `calc(${value * 100}% - ${thumbSize / 2}px)`,
      top: -thumbSize,
      width: thumbSize,
      height: barHeight,
      display: "flex",
      alignItems: "center",
      justifyContent: "start",
      flexDirection: "column",
    },
    thumbBox: {
      width: thumbSize,
      height: thumbSize,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      backgroundColor: theme.colors.blue[7],
    },
    thumbArrow: {
      width: thumbSize / Math.SQRT2,
      height: thumbSize / Math.SQRT2,
      backgroundColor: theme.colors.blue[7],
      transform: "translateY(-50%) rotate(45deg)",
    },
    thumbLine: {
      flexGrow: 1,
      backgroundColor: theme.colors.blue[5],
      width: 2,
      position: "absolute",
      height: barHeight,
      top: thumbSize,
    },
  };
});

export default function Timeline() {
  const [value, setValue] = useState(0);
  const { ref } = useMove(({ x }) => setValue(x));

  const { classes } = useStyles({ value });

  return (
    <Stack align="center" spacing="sm">
      <div ref={ref} className={classes.bar}>
        {/* Filled bar */}
        <div className={classes.filledBar} />
        {/* Thumb */}
        <div className={classes.thumb}>
          <div className={classes.thumbLine}/>
          <div className={classes.thumbBox}/>
          <div className={classes.thumbArrow}/>
        </div>
      </div>
      <Text>Value: {Math.round(value * 100)}</Text>
    </Stack>
  );
}
