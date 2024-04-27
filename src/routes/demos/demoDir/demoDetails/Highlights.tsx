import { useMemo, useRef, useState } from "react";

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import { ScrollArea, Text } from "@mantine/core";

import {
  GameSummary,
  Highlight,
  HighlightEvent,
  HighlightPlayerSnapshot,
  PlayerSummary,
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
  player: PlayerSummary | HighlightPlayerSnapshot | null,
  aliases: UserIdAliases
): boolean {
  if (player === null) {
    return false;
  } else {
    return playerId === player.user_id || playerId === aliases[player.user_id];
  }
}

function doesHighlightIncludePlayer(
  highlight: TaggedHighlight,
  playerId: number,
  aliases: UserIdAliases
): boolean {
  switch (highlight.type) {
    case "Airshot":
      return (
        samePlayer(playerId, highlight.highlight.victim, aliases) ||
        samePlayer(playerId, highlight.highlight.attacker, aliases)
      );
    case "ChatMessage":
      return samePlayer(playerId, highlight.highlight.sender, aliases);
    case "CrossbowAirshot":
      return (
        samePlayer(playerId, highlight.highlight.healer, aliases) ||
        samePlayer(playerId, highlight.highlight.target, aliases)
      );
    case "Kill":
      return (
        samePlayer(playerId, highlight.highlight.killer, aliases) ||
        samePlayer(playerId, highlight.highlight.assister, aliases) ||
        samePlayer(playerId, highlight.highlight.victim, aliases)
      );
    case "KillStreak":
      return samePlayer(playerId, highlight.highlight.player, aliases);
    case "KillStreakEnded":
      return (
        samePlayer(playerId, highlight.highlight.killer, aliases) ||
        samePlayer(playerId, highlight.highlight.victim, aliases)
      );
    case "PlayerConnected":
      return samePlayer(playerId, highlight.highlight.player, aliases);
    case "PlayerDisconnected":
      return samePlayer(playerId, highlight.highlight.player, aliases);
    case "PointCaptured":
      return highlight.highlight.cappers.some((capper) =>
        samePlayer(playerId, capper, aliases)
      );
    case "PlayerTeamChange":
      return samePlayer(playerId, highlight.highlight.player, aliases);
    default:
      return true;
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
        doesHighlightIncludePlayer(
          destructureHighlight(h.event),
          Number.parseInt(p, 10),
          aliases
        )
      )
    );
  }
  if (filters.chatSearch !== "") {
    // Search chat messages for matches (case-insensitive) for player names or text content
    const regex = new RegExp(filters.chatSearch, "i");
    highlights = highlights.filter((highlight) => {
      const taggedHighlight = destructureHighlight(highlight.event);
      if (taggedHighlight.type === "ChatMessage") {
        return (
          regex.test(taggedHighlight.highlight.sender.name) ||
          regex.test(taggedHighlight.highlight.text)
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
    [gameSummary.highlights, filters]
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
