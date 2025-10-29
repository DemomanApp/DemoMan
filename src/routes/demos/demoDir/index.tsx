import { openPath } from "@tauri-apps/plugin-opener";

import { useEffect, useMemo, useState } from "react";

import { useAsync } from "react-async-hook";
import { useParams } from "react-router";

import { Tooltip } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";

import { HeaderPortal } from "@/AppShell";
import {
  getDemosInDirectory,
  getKnownDemoNames,
  getKnownEvents,
  getKnownMaps,
  getKnownPlayers,
  getKnownTags,
} from "@/api";
import { HeaderButton, LoaderFallback } from "@/components";
import type { Demo, DemoFilter, SortKey, SortOrder } from "@/demo";
import useLocationState from "@/hooks/useLocationState";
import type { Path } from "@/store";
import DemoList from "./DemoList";
import {
  keyValueQueryLanguage,
  literalBackslashPlaceholder,
  type Token,
} from "./KeyValueQueryLanguage";
import SearchInput from "./SearchInput";
import { SortControl } from "./SortControl";

type DemoListLoaderArgs = {
  path: string;
  sortKey: SortKey;
  reverse: boolean;
  filters: DemoFilter[];
};

type FilterPatternKey = "type" | "event" | "name" | "map" | "player" | "tag";

const reassembleFilter = (filter: { key: string; value: string }) =>
  `${filter.key}:${filter.value}`;

const replaceBackslashPlaceholder = (value: string) =>
  value.replaceAll(literalBackslashPlaceholder, "\\");

function tokenToDemoFilter(token: Token): DemoFilter | null {
  switch (token.type) {
    case "filter":
      if (token.value.value === "") {
        return null;
      }

      switch (token.value.key as FilterPatternKey | string) {
        case "type":
          return { demo_type: replaceBackslashPlaceholder(token.value.value) };
        case "event":
          return { event: replaceBackslashPlaceholder(token.value.value) };
        case "name":
          return { file_name: replaceBackslashPlaceholder(token.value.value) };
        case "map":
          return { map_name: replaceBackslashPlaceholder(token.value.value) };
        case "player":
          return {
            player_name: replaceBackslashPlaceholder(token.value.value),
          };
        case "tag":
          return { tag_name: replaceBackslashPlaceholder(token.value.value) };
        default:
          return {
            free_text: replaceBackslashPlaceholder(
              reassembleFilter(token.value)
            ),
          };
      }
    case "text":
      if (token.value === "") {
        return null;
      } else {
        return { free_text: token.value };
      }
    case "invalid-filter":
      return { free_text: reassembleFilter(token.value) };
  }
}

function DemoListLoader({
  path,
  sortKey,
  reverse,
  filters,
}: DemoListLoaderArgs) {
  const [demos, setDemos] = useState<Demo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDemosInDirectory(path, sortKey, reverse, filters)
      .then(setDemos)
      .catch(setError);
  }, [path, sortKey, reverse, filters]);

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

  const asyncKnownEvents = useAsync(getKnownEvents, []);
  const knownEvents = asyncKnownEvents.result ?? [];

  const asyncKnownDemoNames = useAsync(getKnownDemoNames, []);
  const knownDemoNames = asyncKnownDemoNames.result ?? [];

  const asyncKnownMaps = useAsync(getKnownMaps, []);
  const knownMaps = asyncKnownMaps.result ?? [];

  const asyncKnownPlayers = useAsync(getKnownPlayers, []);
  const knownPlayers = asyncKnownPlayers.result ?? [];

  const asyncKnownTags = useAsync(getKnownTags, []);
  const knownTags = asyncKnownTags.result ?? [];

  const { filterPatterns, queryLanguageParameters, filters } = useMemo(() => {
    const filterPatterns = {
      type: ["stv", "pov"],
      event: knownEvents,
      name: knownDemoNames,
      map: knownMaps,
      player: knownPlayers,
      tag: knownTags,
    } satisfies Record<FilterPatternKey, string[]>;

    const queryLanguageParameters = { filterPatterns };

    const tokens = keyValueQueryLanguage
      .tokenizer(query, queryLanguageParameters)
      .map((tokenString) =>
        keyValueQueryLanguage.parser(tokenString, queryLanguageParameters)
      );

    const filters = tokens
      .map(tokenToDemoFilter)
      .filter((filter) => filter !== null);

    return { filterPatterns, queryLanguageParameters, filters };
  }, [query, knownEvents, knownDemoNames, knownMaps, knownPlayers, knownTags]);

  return (
    <>
      <HeaderPortal
        center={
          <SearchInput
            query={query}
            setQuery={setQuery}
            debounceInterval={500}
            filterPatterns={filterPatterns}
            queryLanguage={keyValueQueryLanguage}
            queryLanguageParameters={queryLanguageParameters}
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
      />
    </>
  );
};
