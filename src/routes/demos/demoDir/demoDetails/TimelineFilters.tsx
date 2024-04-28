import { Checkbox, MultiSelect, TextInput } from "@mantine/core";

import { GameSummary } from "@/demo";

import classes from "./TimelineFilters.module.css";

export type Filters = {
  playerIds: number[];
  chatSearch: string;
  visibleHighlights: {
    killfeed: boolean;
    captures: boolean;
    chat: boolean;
    connectionMessages: boolean;
    killstreaks: boolean;
    rounds: boolean;
    airshots: boolean;
  };
};

export type TimelineFiltersProps = {
  gameSummary: GameSummary;
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

type ToggleButtonProps = {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: (selected: boolean) => void;
};

function ToggleButton({
  label,
  checked,
  indeterminate,
  onChange,
}: ToggleButtonProps) {
  return (
    <Checkbox
      classNames={{ root: classes.toggleButton }}
      label={label}
      checked={checked}
      indeterminate={indeterminate}
      onChange={(event) => {
        onChange(event.currentTarget.checked);
      }}
      wrapperProps={{
        onClick: () => onChange(!checked),
      }}
    />
  );
}

export default function TimelineFilters({
  gameSummary,
  filters,
  setFilters,
}: TimelineFiltersProps) {
  function handleChange(filter: keyof Filters["visibleHighlights"]) {
    return (checked: boolean) => {
      setFilters({
        ...filters,
        visibleHighlights: { ...filters.visibleHighlights, [filter]: checked },
      });
    };
  }

  const values = Object.values(filters.visibleHighlights);

  const allChecked = values.every((value) => value);
  const indeterminate = values.some((value) => value) && !allChecked;

  return (
    <div className={classes.root}>
      <div className={classes.buttonBar}>
        <ToggleButton
          label="All"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={(checked) => {
            setFilters({
              ...filters,
              visibleHighlights: {
                killfeed: checked,
                captures: checked,
                chat: checked,
                connectionMessages: checked,
                killstreaks: checked,
                rounds: checked,
                airshots: checked,
              },
            });
          }}
        />
        <ToggleButton
          label="Killfeed"
          checked={filters.visibleHighlights.killfeed}
          onChange={handleChange("killfeed")}
        />
        <ToggleButton
          label="Killstreaks"
          checked={filters.visibleHighlights.killstreaks}
          onChange={handleChange("killstreaks")}
        />
        <ToggleButton
          label="Captures"
          checked={filters.visibleHighlights.captures}
          onChange={handleChange("captures")}
        />
        <ToggleButton
          label="Chat"
          checked={filters.visibleHighlights.chat}
          onChange={handleChange("chat")}
        />
        <ToggleButton
          label="Player Joins"
          checked={filters.visibleHighlights.connectionMessages}
          onChange={handleChange("connectionMessages")}
        />
        <ToggleButton
          label="Rounds"
          checked={filters.visibleHighlights.rounds}
          onChange={handleChange("rounds")}
        />
        <ToggleButton
          label="Airshots"
          checked={filters.visibleHighlights.airshots}
          onChange={handleChange("airshots")}
        />
      </div>

      <TextInput
        label={"Search Chat"}
        placeholder={"Filter chat messages"}
        onChange={(event) => {
          setFilters({ ...filters, chatSearch: event.target.value });
        }}
      />
      <MultiSelect
        label={"Filter players"}
        data={gameSummary.players
          .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
          .map((player) => ({
            label: player.name,
            value: player.user_id.toString(10),
          }))}
        placeholder={"Select one or more players"}
        onChange={(values) => {
          setFilters({
            ...filters,
            playerIds: values.map((value) => Number.parseInt(value, 10)),
          });
        }}
        searchable
      />
    </div>
  );
}
