import { openPath } from "@tauri-apps/plugin-opener";

import { useEffect, useState } from "react";

import { useParams } from "react-router";

import { Alert, Tooltip } from "@mantine/core";
import { IconAlertCircle, IconFolder } from "@tabler/icons-react";

import { HeaderPortal } from "@/AppShell";
import { getDemosInDirectory } from "@/api";
import { Fill, HeaderButton, LoaderFallback } from "@/components";
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

function ErrorBox({ error }: { error: string }) {
  return (
    <Fill>
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="An error occurred while scanning for demo files"
        color="red"
      >
        {String(error)}
      </Alert>
    </Fill>
  );
}

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
    return <ErrorBox error={error} />;
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
