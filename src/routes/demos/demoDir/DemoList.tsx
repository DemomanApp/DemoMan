import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  memo,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeList,
  type ListChildComponentProps,
  areEqual,
} from "react-window";
import memoize from "memoize-one";
import { useNavigate } from "react-router";

import { useDebouncedCallback } from "@mantine/hooks";
import { ScrollArea } from "@mantine/core";

import type { Demo } from "@/demo";
import DemoListRow from "./DemoListRow";
import BottomBar from "./BottomBar";
import useLocationRef from "@/hooks/useLocationRef";
import { openDeleteMultipleDemosModal } from "@/modals/DeleteMultipleDemosModal";

const PADDING_SIZE = 16;

// eslint-disable-next-line react/display-name
const innerElementType = forwardRef<HTMLDivElement>(
  (
    // eslint-disable-next-line react/prop-types
    { style, ...rest }: React.ComponentProps<"div">,
    ref: React.ClassAttributes<HTMLDivElement>["ref"]
  ) => (
    <div
      ref={ref}
      style={{
        ...style,
        paddingLeft: PADDING_SIZE,
        // biome-ignore lint/style/noNonNullAssertion: Style is always defined
        height: (style!.height as number) + PADDING_SIZE,
      }}
      {...rest}
    />
  )
);

type ItemDataType = {
  demos: Demo[];
  selectedRows: boolean[];
  handleSelect(event: React.MouseEvent, index: number): void;
};

const createItemData = memoize(
  (
    demos: Demo[],
    selectedRows: boolean[],
    handleSelect: (event: React.MouseEvent, index: number) => void
  ): ItemDataType => ({
    demos,
    selectedRows,
    handleSelect,
  })
);

type DemoListProps = {
  demos: Demo[];
};

export default function DemoList({ demos }: DemoListProps) {
  const listRef = useRef<FixedSizeList>(null);

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

  const itemData = createItemData(demos, selectedRows, handleSelect);

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
      <div style={{ flexGrow: 1 }}>
        <AutoSizer>
          {({ height, width }) => (
            <ScrollArea
              style={{ width, height }}
              onScrollPositionChange={({ y }) => {
                listRef.current?.scrollTo(y);
                handleScroll(y);
              }}
              viewportRef={(viewport) =>
                viewport?.scrollTo({ top: scrollPos, behavior: "instant" })
              }
            >
              <FixedSizeList
                height={height}
                width={width}
                style={{ overflow: "visible" }}
                itemCount={demos.length}
                itemSize={120 + PADDING_SIZE}
                itemData={itemData}
                innerElementType={innerElementType}
                ref={listRef}
              >
                {Row}
              </FixedSizeList>
            </ScrollArea>
          )}
        </AutoSizer>
      </div>
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

const Row = memo(
  ({
    data: { demos, selectedRows, handleSelect },
    index,
    style,
  }: ListChildComponentProps<ItemDataType>) => (
    <div
      style={{
        ...style,
        left: (style.left as number) + PADDING_SIZE,
        top: (style.top as number) + PADDING_SIZE,
        width: `calc(${style.width} - ${2 * PADDING_SIZE}px)`,
        height: (style.height as number) - PADDING_SIZE,
      }}
    >
      <DemoListRow
        key={demos[index].path}
        demo={demos[index]}
        selected={selectedRows[index]}
        onSelect={(event) => {
          handleSelect(event, index);
        }}
      />
    </div>
  ),
  areEqual
);
