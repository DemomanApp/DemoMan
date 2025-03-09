import { useState } from "react";

import * as log from "@tauri-apps/plugin-log";

import {
  CheckIcon,
  Combobox,
  Group,
  Indicator,
  useCombobox,
} from "@mantine/core";
import { IconTag } from "@tabler/icons-react";

import { HeaderButton } from "@/components";
import { getKnownTags } from "@/api";

type Props = {
  tags: string[];
  setTags: (tags: string[]) => void;
};

export default function DemoTagsInput({ tags, setTags }: Props) {
  const [search, setSearch] = useState("");
  const [knownTags, setKnownTags] = useState<string[] | null>(null);
  const [additionalKnownTags, setAdditionalKnownTags] = useState<string[]>([]);

  const allKnownTags = [...(knownTags ?? []), ...additionalKnownTags];

  const exactOptionMatch =
    allKnownTags.some((item) => item === search) || false;

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();

      if (knownTags === null) {
        getKnownTags().then(setKnownTags).catch(log.error);
      }
    },
  });

  const handleValueSelect = (val: string) => {
    setSearch("");

    if (val === "$create") {
      setAdditionalKnownTags((current) => [...current, search]);
      setTags([...tags, search]);
    } else {
      setTags(
        tags.includes(val) ? tags.filter((v) => v !== val) : [...tags, val]
      );
    }
  };

  const options = allKnownTags
    .filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={tags.includes(item)}>
        <Group justify="space-between">
          <span>{item}</span>
          {tags.includes(item) ? <CheckIcon size={12} /> : null}
        </Group>
      </Combobox.Option>
    ));

  return (
    <>
      <Combobox
        store={combobox}
        width={250}
        position="bottom-start"
        withinPortal={false}
        onOptionSubmit={handleValueSelect}
      >
        <Combobox.Target withAriaAttributes={false}>
          <Indicator
            label={tags.length}
            disabled={tags.length == 0}
            offset={10}
            size={16}
          >
            <HeaderButton onClick={() => combobox.toggleDropdown()}>
              <IconTag />
            </HeaderButton>
          </Indicator>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search or create tag"
          />
          <Combobox.Options>
            {options}

            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value="$create">
                + Create {search}
              </Combobox.Option>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}
