import { Center, Loader, ScrollArea, Text } from "@mantine/core";
import { IconArrowsSort, IconFilter, IconSearch } from "@tabler/icons";
import { useRef } from "react";
import { useAsync } from "react-async-hook";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import { Demo, getDemosInDirectory } from "../../api";
import { HeaderPortal, NavbarButton, NavbarPortal } from "../../AppShell";
import DemoListRow from "./DemoListRow";

export default function HomeView() {
  const asyncDemos = useAsync<Demo[]>(getDemosInDirectory, [
    "/home/rasmus/steamapps-common/Team Fortress 2/tf/demos/",
  ]);

  const listRef = useRef<FixedSizeList>(null);

  if (asyncDemos.loading) {
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Loader size="lg" variant="dots" />
      </Center>
    );
  }
  if (asyncDemos.error !== undefined) {
    return <div>{`Error: ${asyncDemos.error}`}</div>;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const demos = asyncDemos.result!;

  demos.sort((a, b) => b.birthtime - a.birthtime);

  return (
    <>
      <HeaderPortal>
        <Text align="center" size={"xl"}>
          DemoMan
        </Text>
      </HeaderPortal>
      <NavbarPortal>
        <NavbarButton icon={IconFilter} />
        <NavbarButton icon={IconSearch} />
        <NavbarButton icon={IconArrowsSort} />
      </NavbarPortal>
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
              itemSize={136}
              ref={listRef}
            >
              {({ index, style }) => (
                <div style={style}>
                  <DemoListRow demo={demos[index]} />
                </div>
              )}
            </FixedSizeList>
          </ScrollArea>
        )}
      </AutoSizer>
    </>
  );
}
