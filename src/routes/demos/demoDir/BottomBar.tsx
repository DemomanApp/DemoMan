import { Button, Text } from "@mantine/core";
import { IconTrash, IconX } from "@tabler/icons-react";

import { formatFileSize } from "@/util";

import classes from "./BottomBar.module.css";

export type Props = {
  totalDemoCount: number;
  totalFileSize: number;
  selectedDemoCount: number;
  selectedFileSize: number;
  selectionMode: boolean;
  handleDeselectAll(): void;
  handleDeleteSelected(): void;
};

export default function BottomBar({
  totalDemoCount,
  totalFileSize,
  selectedDemoCount,
  selectedFileSize,
  selectionMode,
  handleDeselectAll,
  handleDeleteSelected,
}: Props) {
  return (
    <div className={classes.root} data-selection-mode={selectionMode}>
      <Text inline ml="sm">
        {totalDemoCount} Demos ({formatFileSize(totalFileSize)})
      </Text>
      {selectionMode && (
        <>
          <Text inline ml="sm">
            {selectedDemoCount} Selected ({formatFileSize(selectedFileSize)})
          </Text>
          <div style={{ flexGrow: 1 }} />
          <Button
            variant="subtle"
            radius={0}
            color="inherit"
            size="md"
            leftSection={<IconTrash />}
            onClick={handleDeleteSelected}
          >
            Delete selected
          </Button>
          <Button
            variant="subtle"
            radius={0}
            color="inherit"
            size="md"
            leftSection={<IconX />}
            onClick={handleDeselectAll}
          >
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}
