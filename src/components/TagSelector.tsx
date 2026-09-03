import { type Dispatch, type SetStateAction, useState } from "react";

import {
  Checkbox,
  Combobox,
  Group,
  TextInput,
  useCombobox,
} from "@mantine/core";

import classes from "./TagSelector.module.css";

export type TagSelectorState = boolean | undefined;
export type TagSelectorTag = [string, TagSelectorState];

type Props = {
  state: TagSelectorTag[];
  setState: Dispatch<SetStateAction<TagSelectorTag[]>>;
};

export function TagSelector({ state, setState }: Props) {
  const combobox = useCombobox();

  const [search, setSearch] = useState("");

  const exactOptionMatch = state.some(([tag, _state]) => tag === search);

  const handleValueSelect = (val: string) => {
    setSearch("");

    if (val === "$create") {
      setState((current) => [...current, [search, true] as const]);
    } else {
      setState((tagStates) =>
        tagStates.map(([tag, state]) => {
          if (tag === val) {
            if (state === true) {
              return [tag, false];
            } else {
              return [tag, true];
            }
          } else {
            return [tag, state];
          }
        })
      );
    }
  };

  const options = state
    .filter(([tag, _state]) =>
      tag.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map(([tag, state]) => (
      <Combobox.Option
        value={tag}
        key={tag}
        active={state}
        onMouseOver={() => combobox.resetSelectedOption()}
      >
        <Group gap="sm">
          <Checkbox
            checked={state}
            indeterminate={state === undefined}
            onChange={() => {}}
            aria-hidden
            tabIndex={-1}
            style={{ pointerEvents: "none" }}
          />
          <span>{tag}</span>
        </Group>
      </Combobox.Option>
    ));

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
