import { Text } from "@mantine/core";

import { formatFileSize } from "@/util";

import classes from "./BottomBar.module.css";

export type Props = {
  totalDemoCount: number;
  totalFileSize: number;
  selectedDemoCount: number;
  selectedFileSize: number;
  selectionMode: boolean;
};

export default function BottomBar({
  totalDemoCount,
  totalFileSize,
  selectedDemoCount,
  selectedFileSize,
  selectionMode,
}: Props) {
  return (
    <div className={classes.root} data-selection-mode={selectionMode}>
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
