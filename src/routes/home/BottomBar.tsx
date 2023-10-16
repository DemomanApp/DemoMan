import { ActionIcon, Text } from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import { formatFileSize } from "../../util";

import classes from "./BottomBar.module.css";

export type Props = {
  totalDemoCount: number;
  totalFileSize: number;
  selectedDemoCount: number;
  selectedFileSize: number;
  selectionMode: boolean;
  toggleSelectionMode(): void;
};

export default function BottomBar({
  totalDemoCount,
  totalFileSize,
  selectedDemoCount,
  selectedFileSize,
  selectionMode,
  toggleSelectionMode,
}: Props) {
  return (
    <div className={classes.root} data-selection-mode={selectionMode}>
      <ActionIcon
        variant="subtle"
        radius={0}
        size={40}
        onClick={toggleSelectionMode}
        className={classes.icon}
        data-selection-mode={selectionMode}
      >
        <IconListCheck />
      </ActionIcon>
      <Text inline ml="sm">
        {totalDemoCount} Demos ({formatFileSize(totalFileSize)})
      </Text>
      {selectionMode && (
        <Text inline ml="sm">
          {selectedDemoCount} Selected ({formatFileSize(selectedFileSize)})
        </Text>
      )}
    </div>
  );
}
