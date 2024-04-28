import { useMemo, useRef, useState } from "react";

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import { ScrollArea, Text } from "@mantine/core";

import {
  GameSummary,
  Highlight,
  HighlightEvent,
  HighlightPlayerSnapshot,
  TaggedHighlight,
  UserIdAliases,
  destructureHighlight,
} from "@/demo";
import HighlightBox from "./HighlightBox";
import TimelineFilters, { Filters } from "./TimelineFilters";

export type TimelineProps = {
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
      } else {
        return [highlight.killer, highlight.victim];
      }
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
  } else {
    return players.some((player) => samePlayer(playerId, player, aliases));
  }
}

function filterHighlights(
  highlights: HighlightEvent[],
  filters: Filters,
  aliases: UserIdAliases
): HighlightEvent[] {
  if (filters.playerIds.length > 0) {
    highlights = highlights.filter((h) =>
      filters.playerIds.find((p) =>
        doesHighlightIncludePlayer(destructureHighlight(h.event), p, aliases)
      )
    );
  }
  if (filters.chatSearch !== "") {
    highlights = highlights.filter((highlight) => {
      const taggedHighlight = destructureHighlight(highlight.event);
      if (taggedHighlight.type === "ChatMessage") {
        const query = filters.chatSearch.toLowerCase();
        return (
          taggedHighlight.highlight.sender.name.toLowerCase().includes(query) ||
          taggedHighlight.highlight.text.toLowerCase().includes(query)
        );
      } else {
        return true;
      }
    });
  }
  if (!filters.visibleHighlights.killfeed) {
    highlights = highlights.filter((h) => !highlightIsType(h.event, "Kill"));
  }
  if (!filters.visibleHighlights.captures) {
    highlights = highlights.filter(
      (h) => !highlightIsType(h.event, "PointCaptured")
    );
  }
  if (!filters.visibleHighlights.chat) {
    highlights = highlights.filter(
      (h) => !highlightIsType(h.event, "ChatMessage")
    );
  }
  if (!filters.visibleHighlights.connectionMessages) {
    highlights = highlights.filter(
      (h) =>
        !(
          highlightIsType(h.event, "PlayerConnected") ||
          highlightIsType(h.event, "PlayerDisconnected") ||
          highlightIsType(h.event, "PlayerTeamChange")
        )
    );
  }
  if (!filters.visibleHighlights.killstreaks) {
    highlights = highlights.filter(
      (h) =>
        !(
          highlightIsType(h.event, "KillStreak") ||
          highlightIsType(h.event, "KillStreakEnded")
        )
    );
  }
  if (!filters.visibleHighlights.rounds) {
    highlights = highlights.filter(
      (h) =>
        !(
          highlightIsType(h.event, "RoundStart") ||
          highlightIsType(h.event, "RoundWin") ||
          highlightIsType(h.event, "RoundStalemate")
        )
    );
  }
  if (!filters.visibleHighlights.airshots) {
    highlights = highlights.filter(
      (h) =>
        !(
          highlightIsType(h.event, "Airshot") ||
          highlightIsType(h.event, "CrossbowAirshot")
        )
    );
  }

  return highlights;
}

function highlightIsType(
  highlight: Highlight,
  type: TaggedHighlight["type"]
): boolean {
  return Object.prototype.hasOwnProperty.call(highlight, type);
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
        margin: "auto",
      }}
    >
      <TimelineFilters
        gameSummary={gameSummary}
        filters={filters}
        setFilters={setFilters}
      />
      <div style={{ height: "100%" }}>
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
                          width: "7ch",
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
