import { Button, Text } from "@mantine/core";
import { IconChecks, IconTag, IconTrash, IconX } from "@tabler/icons-react";

import { formatFileSize } from "@/util";

import classes from "./BottomBar.module.css";

export type Props = {
  totalDemoCount: number;
  totalFileSize: number;
  selectedDemoCount: number;
  selectedFileSize: number;
  selectionMode: boolean;
  allVisibleSelected: boolean;
  handleSelectAll(): void;
  handleDeselectAll(): void;
  handleDeleteSelected(): void;
  handleTagSelected(): void;
};

export default function BottomBar({
  totalDemoCount,
  totalFileSize,
  selectedDemoCount,
  selectedFileSize,
  selectionMode,
  allVisibleSelected,
  handleSelectAll,
  handleDeselectAll,
  handleDeleteSelected,
  handleTagSelected,
}: Props) {
  return (
    <div className={classes.root} data-selection-mode={selectionMode}>
      <Text inline ml="sm">
        {totalDemoCount} Demos ({formatFileSize(totalFileSize)})
      </Text>
      {(selectionMode || totalDemoCount > 0) && (
        <>
          {selectionMode && (
            <Text inline ml="sm">
              {selectedDemoCount} Selected ({formatFileSize(selectedFileSize)})
            </Text>
          )}
          <div style={{ flexGrow: 1 }} />
          <Button
            variant="subtle"
            radius={0}
            color="inherit"
            size="md"
            leftSection={<IconChecks />}
            onClick={allVisibleSelected ? handleDeselectAll : handleSelectAll}
          >
            {allVisibleSelected ? "Deselect all" : "Select all"}
          </Button>
          {selectionMode && (
            <>
              <Button
                variant="subtle"
                radius={0}
                color="inherit"
                size="md"
                leftSection={<IconTag />}
                onClick={handleTagSelected}
              >
                Tags
              </Button>
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
        </>
      )}
    </div>
  );
}
