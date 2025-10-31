import { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router";
import { List, type RowComponentProps } from "react-window";

import { useDebouncedCallback } from "@mantine/hooks";

import type { Demo } from "@/demo";
import useLocationRef from "@/hooks/useLocationRef";
import { openDeleteMultipleDemosModal } from "@/modals/DeleteMultipleDemosModal";
import BottomBar from "./BottomBar";
import DemoListRow from "./DemoListRow";

const PADDING_SIZE = 16;

type RowProps = {
  demos: Demo[];
  selectedRows: boolean[];
  handleSelect(event: React.MouseEvent, index: number): void;
};

type DemoListProps = {
  demos: Demo[];
};

export default function DemoList({ demos }: DemoListProps) {
  // TODO: update the page without reloading
  const navigate = useNavigate();
  const reloadPage = () => navigate(0);

  const [scrollPos, setScrollPos] = useLocationRef("scrollPos", 0);

  const handleScroll = useDebouncedCallback(setScrollPos, 500);

  const [selectedRows, setSelectedRows] = useState<boolean[]>(
    Array(demos.length).fill(false)
  );
  const [lastSelectedIndex, setLastSelectedIndex] = useState<
    number | undefined
  >(undefined);

  const selectionMode = useMemo(
    () => selectedRows.some((row) => row),
    [selectedRows]
  );

  // Reset the selected rows every time the demos are changed or selection mode is disabled
  useEffect(() => {
    if (!selectionMode) {
      setSelectedRows(Array(demos.length).fill(false));
      setLastSelectedIndex(undefined);
    }
  }, [demos, selectionMode]);

  const handleSelect = useCallback(
    (event: React.MouseEvent, index: number) => {
      if (event.shiftKey && lastSelectedIndex !== undefined) {
        setSelectedRows((oldSelectedIndices) => {
          const newSelectedIndices = [...oldSelectedIndices];
          const value = !newSelectedIndices[index];

          const [from, to] =
            index > lastSelectedIndex
              ? [lastSelectedIndex, index]
              : [index, lastSelectedIndex];

          for (let i = from; i <= to; i++) {
            newSelectedIndices[i] = value;
          }

          return newSelectedIndices;
        });
      } else {
        setSelectedRows((oldSelectedIndices) => {
          const newSelectedIndices = [...oldSelectedIndices];
          newSelectedIndices[index] = !newSelectedIndices[index];
          return newSelectedIndices;
        });
      }
      setLastSelectedIndex(index);
    },
    [lastSelectedIndex]
  );

  const handleDeselectAll = () => {
    setSelectedRows(Array(demos.length).fill(false));
  };

  const handleDeleteSelected = () => {
    const demosToDelete = selectedRows
      .map((selected, index) => [selected, index] as const)
      .filter(([selected, _index]) => selected)
      .map(([_selected, index]) => demos[index]);

    openDeleteMultipleDemosModal(demosToDelete, reloadPage);
  };

  const totalFileSize = useMemo(
    () => demos.reduce((total, demo) => total + demo.filesize, 0),
    [demos]
  );

  const selectedFileSize = useMemo(
    () =>
      demos.reduce(
        (total, demo, index) =>
          selectedRows[index] ? total + demo.filesize : total,
        0
      ),
    [demos, selectedRows]
  );

  const selectedDemoCount = useMemo(
    () => selectedRows.reduce((total, value) => total + Number(value), 0),
    [selectedRows]
  );

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <List
        style={{ height: "1fr", paddingBlock: PADDING_SIZE / 2 }}
        rowComponent={RowComponent}
        rowProps={{ demos, selectedRows, handleSelect }}
        rowCount={demos.length}
        rowHeight={120 + PADDING_SIZE}
        onScroll={(event) => handleScroll(event.currentTarget.scrollTop)}
        listRef={(ref) => {
          ref?.element?.scrollTo({ top: scrollPos, behavior: "instant" });
        }}
      />
      <BottomBar
        totalDemoCount={demos.length}
        totalFileSize={totalFileSize}
        selectedDemoCount={selectedDemoCount}
        selectedFileSize={selectedFileSize}
        selectionMode={selectionMode}
        handleDeselectAll={handleDeselectAll}
        handleDeleteSelected={handleDeleteSelected}
      />
    </div>
  );
}

const RowComponent = ({
  index,
  style,
  demos,
  selectedRows,
  handleSelect,
}: RowComponentProps<RowProps>) => (
  <div style={style}>
    <DemoListRow
      key={demos[index].path}
      demo={demos[index]}
      selected={selectedRows[index]}
      onSelect={(event) => {
        handleSelect(event, index);
      }}
    />
  </div>
);
