import { useRef, useState } from "react";

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import { ScrollArea, Text } from "@mantine/core";

import {
  GameSummary,
  Highlight,
  HighlightPlayerSnapshot,
  PlayerSummary,
  TaggedHighlight,
  destructureHighlight,
} from "@/demo";
import HighlightBox from "./HighlightBox";
import TimelineFilters, { Filters } from "./TimelineFilters";

export type TimelineProps = {
  gameSummary: GameSummary;
};

function samePlayer(
  playerId: number,
  player: PlayerSummary | HighlightPlayerSnapshot | null
): boolean {
  return playerId === player?.user_id;
}

function doesHighlightIncludePlayer(
  highlight: TaggedHighlight,
  playerId: number
): boolean {
  switch (highlight.type) {
    case "Airshot":
      return (
        samePlayer(playerId, highlight.highlight.victim) ||
        samePlayer(playerId, highlight.highlight.attacker)
      );
    case "ChatMessage":
      return samePlayer(playerId, highlight.highlight.sender);
    case "CrossbowAirshot":
      return (
        samePlayer(playerId, highlight.highlight.healer) ||
        samePlayer(playerId, highlight.highlight.target)
      );
    case "Kill":
      return (
        samePlayer(playerId, highlight.highlight.killer) ||
        samePlayer(playerId, highlight.highlight.assister) ||
        samePlayer(playerId, highlight.highlight.victim)
      );
    case "KillStreak":
      return samePlayer(playerId, highlight.highlight.player);
    case "KillStreakEnded":
      return (
        samePlayer(playerId, highlight.highlight.killer) ||
        samePlayer(playerId, highlight.highlight.victim)
      );
    case "PlayerConnected":
      return samePlayer(playerId, highlight.highlight.player);
    case "PlayerDisconnected":
      return samePlayer(playerId, highlight.highlight.player);
    case "PointCaptured":
      return highlight.highlight.cappers.some((capper) =>
        samePlayer(playerId, capper)
      );
    case "PlayerTeamChange":
      return samePlayer(playerId, highlight.highlight.player);
    default:
      return true;
  }
}

function highlightIsType(
  highlight: Highlight,
  type: TaggedHighlight["type"]
): boolean {
  return Object.prototype.hasOwnProperty.call(highlight, type);
}

export default function HighlightsList({ gameSummary }: TimelineProps) {
  const listRef = useRef<FixedSizeList>(null);

  const [highlights, setHighlights] = useState(gameSummary.highlights);

  const recomputeHighlights = (filters: Filters) => {
    let highlights = gameSummary.highlights;
    if (filters.playerIds.length > 0) {
      highlights = highlights.filter((h) =>
        filters.playerIds.find((p) =>
          doesHighlightIncludePlayer(
            destructureHighlight(h.event),
            Number.parseInt(p, 10)
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
    if (!filters.visibleKillfeed) {
      highlights = highlights.filter((h) => !highlightIsType(h.event, "Kill"));
    }
    if (!filters.visibleCaptures) {
      highlights = highlights.filter(
        (h) => !highlightIsType(h.event, "PointCaptured")
      );
    }
    if (!filters.visibleChat) {
      highlights = highlights.filter(
        (h) => !highlightIsType(h.event, "ChatMessage")
      );
    }
    if (!filters.visibleConnectionMessages) {
      highlights = highlights.filter(
        (h) =>
          !(
            highlightIsType(h.event, "PlayerConnected") ||
            highlightIsType(h.event, "PlayerDisconnected") ||
            highlightIsType(h.event, "PlayerTeamChange")
          )
      );
    }
    if (!filters.visibleKillstreaks) {
      highlights = highlights.filter(
        (h) =>
          !(
            highlightIsType(h.event, "KillStreak") ||
            highlightIsType(h.event, "KillStreakEnded")
          )
      );
    }
    if (!filters.visibleRounds) {
      highlights = highlights.filter(
        (h) =>
          !(
            highlightIsType(h.event, "RoundStart") ||
            highlightIsType(h.event, "RoundWin") ||
            highlightIsType(h.event, "RoundStalemate")
          )
      );
    }
    if (!filters.visibleAirshots) {
      highlights = highlights.filter(
        (h) =>
          !(
            highlightIsType(h.event, "Airshot") ||
            highlightIsType(h.event, "CrossbowAirshot")
          )
      );
    }

    setHighlights(highlights);
  };

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
        onChange={recomputeHighlights}
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
