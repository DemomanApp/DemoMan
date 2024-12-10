import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import memoize from "memoize-one";

import { ScrollArea } from "@mantine/core";

import { Demo } from "@/demo";
import DemoListRow from "./DemoListRow";
import BottomBar from "./BottomBar";

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        height: (style!.height as number) + PADDING_SIZE,
      }}
      {...rest}
    />
  )
);

type ItemDataType = {
  demos: Demo[];
  selectedRows: boolean[];
  handleRowClick(index: number): void;
};

const createItemData = memoize(
  (
    demos: Demo[],
    selectedRows: boolean[],
    handleRowClick: (index: number) => void
  ): ItemDataType => ({
    demos,
    selectedRows,
    handleRowClick,
  })
);

type DemoListProps = {
  demos: Demo[];
};

export default function DemoList({ demos }: DemoListProps) {
  const navigate = useNavigate();
  const listRef = useRef<FixedSizeList>(null);

  const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Reset the selected rows every time the demos are changed or selection mode is toggled
  useEffect(() => {
    setSelectedRows(Array(demos.length).fill(false));
  }, [demos, selectionMode]);

  const handleRowClick = useCallback(
    (index: number) => {
      if (selectionMode) {
        setSelectedRows((oldSelectedIndices) => {
          const newSelectedIndices = [...oldSelectedIndices];
          newSelectedIndices[index] = !newSelectedIndices[index];
          return newSelectedIndices;
        });
      } else {
        navigate(`../show/${btoa(demos[index].path)}`);
      }
    },
    [navigate, selectionMode, demos]
  );

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

  const itemData = createItemData(demos, selectedRows, handleRowClick);
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
              onScrollPositionChange={({ y }) => listRef.current?.scrollTo(y)}
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
                {({
                  data: { demos, selectedRows, handleRowClick },
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
                      demo={demos[index]}
                      selected={selectedRows[index]}
                      onClick={() => handleRowClick(index)}
                    />
                  </div>
                )}
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
        toggleSelectionMode={() => setSelectionMode(!selectionMode)}
      />
    </div>
  );
}
