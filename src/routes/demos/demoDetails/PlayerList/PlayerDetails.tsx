import { useState } from "react";

import { open } from "@tauri-apps/plugin-shell";

import { ActionIcon, Tabs, Title, Tooltip } from "@mantine/core";
import { IconBrandSteam } from "@tabler/icons-react";

import type { GameSummary, PlayerSummary, Scoreboard } from "@/demo";
import { ScoreboardTable } from "./ScoreboardTable";
import ClassPlaytimeIndicator from "./ClassPlaytimeIndicator";

import classes from "./PlayerDetails.module.css";

type PlayerDetailsProps = {
  player: PlayerSummary;
  gameSummary: GameSummary;
};

export function PlayerDetails({ player, gameSummary }: PlayerDetailsProps) {
  const [currentTab, setCurrentTab] = useState<string>("match");

  const scoreboard: Scoreboard | undefined =
    currentTab === "match"
      ? player.scoreboard
      : player.round_scoreboards[Number.parseInt(currentTab, 10)];

  if (scoreboard === undefined) {
    setCurrentTab("match");
  }

  return (
    <div className={classes.playerDetails}>
      <div className={classes.scoreboardPlayerNameHeader}>
        <Title order={2}>
          {player.name}
          {player.steam_id !== "0" && (
            <Tooltip label="View steam profile">
              <ActionIcon
                ml="xs"
                variant="transparent"
                color="gray"
                size="lg"
                onClick={() =>
                  open(`https://steamcommunity.com/profiles/${player.steam_id}`)
                }
              >
                <IconBrandSteam />
              </ActionIcon>
            </Tooltip>
          )}
        </Title>
        <ClassPlaytimeIndicator
          player={player}
          intervalPerTick={gameSummary.interval_per_tick}
        />
      </div>
      <div>
        <Tabs
          value={currentTab.toString()}
          onChange={(newTab) => setCurrentTab(newTab ?? "match")}
        >
          <Tabs.List>
            <Tabs.Tab value={"match"}>Match</Tabs.Tab>
            {Array.from({ length: gameSummary.num_rounds }, (_x, roundNum) => (
              <Tabs.Tab
                value={roundNum.toString()}
                key={roundNum}
                disabled={player.round_scoreboards[roundNum] === undefined}
              >
                Round {roundNum + 1}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
        <ScoreboardTable scoreboard={scoreboard} />
      </div>
    </div>
  );
}
