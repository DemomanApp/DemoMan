import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
} from "react";
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import memoize from "memoize-one";

import { Alert, ScrollArea, Input, Menu } from "@mantine/core";
import {
  IconSearch,
  IconDots,
  IconSettings,
  IconPlug,
  IconFolder,
} from "@tabler/icons-react";

import { Demo } from "../../../demo";
import DemoListRow from "./DemoListRow";
import BottomBar from "./BottomBar";
import AppShell, { HeaderButton } from "../../../AppShell";
import { getDemosInDirectory } from "../../../api";
import { Fill } from "../../../components";
import { StoreSchema } from "../../../hooks/useStore";

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
  toggleRowSelected(index: number): void;
};

const createItemData = memoize(
  (
    demos: Demo[],
    selectedRows: boolean[],
    toggleRowSelected: (index: number) => void
  ): ItemDataType => ({
    demos,
    selectedRows,
    toggleRowSelected,
  })
);

export default () => {
  const navigate = useNavigate();
  const listRef = useRef<FixedSizeList>(null);

  const demos = useLoaderData() as Demo[];

  const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  const sortedDemos = useMemo(() => {
    const newSortedDemos = [...demos];
    newSortedDemos.sort((a, b) => b.birthtime - a.birthtime);
    return newSortedDemos;
  }, [demos]);

  // Reset the selected rows every time the demos are changed or selection mode is toggled
  useEffect(() => {
    setSelectedRows(Array(sortedDemos.length).fill(false));
  }, [sortedDemos, selectionMode]);

  const handleRowClick = useCallback(
    (index: number) => {
      if (selectionMode) {
        setSelectedRows((oldSelectedIndices) => {
          const newSelectedIndices = [...oldSelectedIndices];
          newSelectedIndices[index] = !newSelectedIndices[index];
          return newSelectedIndices;
        });
      } else {
        navigate(
          `/demo/${encodeURIComponent(sortedDemos[index].name)}/players`
        );
      }
    },
    [navigate, selectionMode, sortedDemos]
  );

  const totalFileSize = useMemo(
    () => sortedDemos.reduce((total, demo) => total + demo.filesize, 0),
    [sortedDemos]
  );

  const selectedFileSize = useMemo(
    () =>
      sortedDemos.reduce(
        (total, demo, index) =>
          selectedRows[index] ? total + demo.filesize : total,
        0
      ),
    [sortedDemos, selectedRows]
  );

  const selectedDemoCount = useMemo(
    () => selectedRows.reduce((total, value) => total + Number(value), 0),
    [selectedRows]
  );

  const itemData = createItemData(sortedDemos, selectedRows, handleRowClick);

  return (
    <AppShell
      header={{
        center: (
          <Input
            variant="filled"
            placeholder="Search"
            style={{ width: "100%" }}
            size="sm"
            leftSection={<IconSearch size={16} />}
          />
        ),
        right: (
          <Menu
            shadow="md"
            position="bottom-end"
            transitionProps={{
              // This should just be transition: "pop-top-right",
              // but that's not working as intended at the time of writing.
              transition: {
                in: { opacity: 1, transform: "scale(1)" },
                out: {
                  opacity: 0,
                  transform: "scale(.9)",
                },
                common: { transformOrigin: "top right" },
                transitionProperty: "transform, opacity",
              },
            }}
          >
            <Menu.Target>
              <HeaderButton icon={IconDots} />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconSettings size={14} />}
                component={Link}
                to="/settings"
              >
                Settings
              </Menu.Item>
              <Menu.Item
                leftSection={<IconPlug size={14} />}
                component={Link}
                to="/rcon-setup"
              >
                Set up RCON
              </Menu.Item>
              <Menu.Item leftSection={<IconFolder size={14} />}>
                Open demos folder
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ),
      }}
    >
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
                  itemCount={sortedDemos.length}
                  itemSize={120 + PADDING_SIZE}
                  itemData={itemData}
                  innerElementType={innerElementType}
                  ref={listRef}
                >
                  {({
                    data: { demos, selectedRows, toggleRowSelected },
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
                        onClick={() => toggleRowSelected(index)}
                      />
                    </div>
                  )}
                </FixedSizeList>
              </ScrollArea>
            )}
          </AutoSizer>
        </div>
        <BottomBar
          totalDemoCount={sortedDemos.length}
          totalFileSize={totalFileSize}
          selectedDemoCount={selectedDemoCount}
          selectedFileSize={selectedFileSize}
          selectionMode={selectionMode}
          toggleSelectionMode={() => setSelectionMode(!selectionMode)}
        />
      </div>
    </AppShell>
  );
};

export function ErrorElement() {
  const error = useRouteError();
  return (
    <Fill>
      <Alert color="red">
        An error occurred while scanning for demo files. Is the demo storage
        directory set?
        <div>Error: {String(error)}</div>
      </Alert>
    </Fill>
  );
}

export const loader: LoaderFunction = async ({ params }): Promise<Demo[]> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const demoDirId = decodeURIComponent(params.demoDirId!);

  // TODO fix this mess
  // Idea: implement a custom global store
  const demoDirs = JSON.parse(
    window.localStorage.getItem("demoDirs") ?? "{}"
  ) as StoreSchema["demoDirs"];

  const path = demoDirs[demoDirId].path;

  return await getDemosInDirectory(path);
};
