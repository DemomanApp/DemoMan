import { useMemo, useState } from "react";

import {
  Checkbox,
  Combobox,
  Group,
  TextInput,
  useCombobox,
} from "@mantine/core";

import classes from "./TagSelector.module.css";

export type TagsState = Map<string, TagSelectionState>;
export type TagSelectionState = boolean | undefined;
export type TagSelectorTag = [string, TagSelectionState];

type Props = {
  state: TagsState;
  onChange: (tag: string, newState: boolean) => void;
};

export function TagSelector({ state, onChange }: Props) {
  const combobox = useCombobox();

  const [search, setSearch] = useState("");

  const sortedStateKeys = useMemo(() => [...state.keys()].sort(), [state]);

  const exactOptionMatch = state.keys().some((tag) => tag === search);

  const handleValueSelect = (val: string) => {
    setSearch("");

    if (val === "$create") {
      onChange(search, true);
    } else {
      const oldValue = state.get(val);
      const newValue = !oldValue;
      onChange(val, newValue);
    }
  };

  const options = sortedStateKeys
    .values()
    .filter((tag) => tag.toLowerCase().includes(search.toLowerCase().trim()))
    .map((tag) => {
      const tagState = state.get(tag);
      const isChecked = tagState ?? false;
      const isIndeterminate = tagState === undefined;

      return (
        <Combobox.Option
          value={tag}
          key={tag}
          active={isChecked}
          onMouseOver={() => combobox.resetSelectedOption()}
        >
          <Group gap="sm">
            <Checkbox
              checked={isChecked}
              indeterminate={isIndeterminate}
              aria-hidden
              tabIndex={-1}
              style={{ pointerEvents: "none" }}
            />
            <span>{tag}</span>
          </Group>
        </Combobox.Option>
      );
    })
    .toArray();

  return (
    <div>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
        <Combobox.EventsTarget>
          <TextInput
            placeholder="Search tags"
            classNames={{ input: classes.input }}
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              combobox.updateSelectedOptionIndex();
            }}
          />
        </Combobox.EventsTarget>

        <div className={classes.list}>
          <Combobox.Options>
            {options}

            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value="$create">
                + Create {search}
              </Combobox.Option>
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}
