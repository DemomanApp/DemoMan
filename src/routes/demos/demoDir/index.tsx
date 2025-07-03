import { openPath } from "@tauri-apps/plugin-opener";

import { useEffect, useState } from "react";

import { useParams } from "react-router";

import { Tooltip } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";

import { HeaderPortal } from "@/AppShell";
import { getDemosInDirectory } from "@/api";
import { HeaderButton, LoaderFallback } from "@/components";
import type { Demo, DemoFilter, SortKey, SortOrder } from "@/demo";
import useLocationState from "@/hooks/useLocationState";
import type { Path } from "@/store";
import DemoList from "./DemoList";
import SearchInput from "./SearchInput";
import { SortControl } from "./SortControl";

type DemoListLoaderArgs = {
  path: string;
  sortKey: SortKey;
  reverse: boolean;
  filters: DemoFilter[];
  query: string;
};

function DemoListLoader({
  path,
  sortKey,
  reverse,
  filters,
  query,
}: DemoListLoaderArgs) {
  const [demos, setDemos] = useState<Demo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDemosInDirectory(path, sortKey, reverse, filters, query)
      .then(setDemos)
      .catch(setError);
  }, [path, sortKey, reverse, filters, query]);

  if (demos !== null) {
    return <DemoList demos={demos} />;
  }
  if (error !== null) {
    throw new Error(error);
  }
  return <LoaderFallback />;
}

export default () => {
  const { path: encodedPath } = useParams() as { path: Path };
  const path = atob(encodedPath);

  const [query, setQuery] = useLocationState("query", "");
  const [sortKey, setSortKey] = useLocationState<SortKey>(
    "sortKey",
    "birthtime"
  );
  const [sortOrder, setSortOrder] = useLocationState<SortOrder>(
    "sortOrder",
    "descending"
  );

  const filters: DemoFilter[] = [];

  return (
    <>
      <HeaderPortal
        center={
          <SearchInput
            query={query}
            setQuery={setQuery}
            debounceInterval={500}
          />
        }
        right={
          <>
            <SortControl
              sortKey={sortKey}
              setSortKey={setSortKey}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <div style={{ margin: "auto" }} />
            <Tooltip label="Show folder in explorer">
              <HeaderButton onClick={() => openPath(path)}>
                <IconFolder />
              </HeaderButton>
            </Tooltip>
          </>
        }
      />
      <DemoListLoader
        path={path}
        sortKey={sortKey}
        reverse={sortOrder === "descending"}
        filters={filters}
        query={query}
      />
    </>
  );
};
