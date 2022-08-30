import { ActionIcon, createStyles, Text } from "@mantine/core";
import { IconListCheck } from "@tabler/icons";
import { formatFileSize } from "../../util";

export type Props = {
  totalDemoCount: number;
  totalFileSize: number;
  selectedDemoCount: number;
  selectedFileSize: number;
  selectionMode: boolean;
  toggleSelectionMode(): void;
};

const useStyles = createStyles(
  (theme, { selectionMode }: { selectionMode: boolean }) => ({
    root: {
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "left",
      backgroundColor: selectionMode
        ? theme.colors.blue
        : theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.white,
      color: theme.white,
    },
  })
);

export default function BottomBar({
  totalDemoCount,
  totalFileSize,
  selectedDemoCount,
  selectedFileSize,
  selectionMode,
  toggleSelectionMode,
}: Props) {
  const { classes } = useStyles({ selectionMode });
  return (
    <div className={classes.root}>
      <ActionIcon
        variant="subtle"
        radius={0}
        size={40}
        onClick={toggleSelectionMode}
      >
        <IconListCheck />
      </ActionIcon>
      <Text inline ml="sm">
        Demos: {totalDemoCount} ({formatFileSize(totalFileSize)})
      </Text>
      {selectionMode && (
        <Text inline ml="sm">
          Selected: {selectedDemoCount} ({formatFileSize(selectedFileSize)})
        </Text>
      )}
    </div>
  );
}
