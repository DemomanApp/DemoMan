import { useMemo, useRef, useState } from "react";

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import { ScrollArea, Text } from "@mantine/core";

import {
  type GameSummary,
  type HighlightEvent,
  type HighlightPlayerSnapshot,
  type HighlightType,
  type TaggedHighlight,
  type UserIdAliases,
  destructureHighlight,
} from "@/demo";
import HighlightBox from "./HighlightBox";
import TimelineFilters, { type Filters } from "./TimelineFilters";

type TimelineProps = {
  gameSummary: GameSummary;
};

function samePlayer(
  playerId: number,
  player: HighlightPlayerSnapshot,
  aliases: UserIdAliases
): boolean {
  return playerId === player.user_id || playerId === aliases[player.user_id];
}

function involvedPlayers(
  taggedHighlight: TaggedHighlight
): HighlightPlayerSnapshot[] {
  const { type, highlight } = taggedHighlight;

  switch (type) {
    case "Kill":
      if (highlight.assister !== null) {
        return [highlight.assister, highlight.killer, highlight.victim];
      }
      return [highlight.killer, highlight.victim];

    case "KillStreak":
      return [highlight.player];
    case "KillStreakEnded":
      return [highlight.killer, highlight.victim];
    case "ChatMessage":
      return [highlight.sender];
    case "Airshot":
      return [highlight.attacker, highlight.victim];
    case "CrossbowAirshot":
      return [highlight.healer, highlight.target];
    case "PointCaptured":
      return highlight.cappers;
    case "PlayerConnected":
      return [highlight.player];
    case "PlayerDisconnected":
      return [highlight.player];
    case "PlayerTeamChange":
      return [highlight.player];
    default:
      return [];
  }
}

function doesHighlightIncludePlayer(
  highlight: TaggedHighlight,
  playerId: number,
  aliases: UserIdAliases
): boolean {
  const players = involvedPlayers(highlight);

  if (players.length === 0) {
    return true;
  }
  return players.some((player) => samePlayer(playerId, player, aliases));
}

function visibleHighlightTypes(filters: Filters): HighlightType[] {
  const result: HighlightType[] = [];

  if (filters.visibleHighlights.airshots) {
    result.push("Airshot");
    result.push("CrossbowAirshot");
  }
  if (filters.visibleHighlights.captures) {
    result.push("PointCaptured");
  }
  if (filters.visibleHighlights.chat) {
    result.push("ChatMessage");
  }
  if (filters.visibleHighlights.connectionMessages) {
    result.push("PlayerConnected");
    result.push("PlayerDisconnected");
    result.push("PlayerTeamChange");
  }
  if (filters.visibleHighlights.killfeed) {
    result.push("Kill");
  }
  if (filters.visibleHighlights.killstreaks) {
    result.push("KillStreak");
    result.push("KillStreakEnded");
  }
  if (filters.visibleHighlights.rounds) {
    result.push("RoundStalemate");
    result.push("RoundStart");
    result.push("RoundWin");
  }

  return result;
}

function filterHighlights(
  highlights: HighlightEvent[],
  filters: Filters,
  aliases: UserIdAliases
): HighlightEvent[] {
  const visibleHighlights = visibleHighlightTypes(filters);
  highlights = highlights.filter((highlight) => {
    const { type } = destructureHighlight(highlight.event);

    return visibleHighlights.includes(type);
  });

  if (filters.playerIds.length > 0) {
    highlights = highlights.filter((highlight) =>
      filters.playerIds.some((playerId) =>
        doesHighlightIncludePlayer(
          destructureHighlight(highlight.event),
          playerId,
          aliases
        )
      )
    );
  }
  if (filters.chatSearch !== "" && filters.visibleHighlights.chat) {
    highlights = highlights.filter((highlightEvent) => {
      const { type, highlight } = destructureHighlight(highlightEvent.event);

      if (type === "ChatMessage") {
        const query = filters.chatSearch.toLowerCase();
        return (
          highlight.sender.name.toLowerCase().includes(query) ||
          highlight.text.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }

  return highlights;
}

export default function HighlightsList({ gameSummary }: TimelineProps) {
  const listRef = useRef<FixedSizeList>(null);

  const [filters, setFilters] = useState<Filters>({
    playerIds: [],
    chatSearch: "",
    visibleHighlights: {
      killfeed: true,
      captures: true,
      chat: true,
      connectionMessages: true,
      killstreaks: true,
      rounds: true,
      airshots: true,
    },
  });

  const highlights = useMemo(
    () =>
      filterHighlights(gameSummary.highlights, filters, gameSummary.aliases),
    [gameSummary, filters]
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TimelineFilters
        gameSummary={gameSummary}
        filters={filters}
        setFilters={setFilters}
      />
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
                itemCount={highlights.length}
                itemSize={40}
                ref={listRef}
              >
                {({ style, index }) => {
                  const { event, tick } = highlights[index];
                  return (
                    <div
                      style={{
                        ...style,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        c="dimmed"
                        size="sm"
                        style={{
                          width: "8ch",
                          fontFamily: "monospace",
                          textAlign: "right",
                          paddingRight: 8,
                        }}
                      >
                        {tick}
                      </Text>
                      <HighlightBox event={event} />
                    </div>
                  );
                }}
              </FixedSizeList>
            </ScrollArea>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
