import { useState } from "react";

import {
  CheckIcon,
  Combobox,
  Group,
  Indicator,
  useCombobox,
} from "@mantine/core";
import { IconTag } from "@tabler/icons-react";

import { HeaderButton } from "@/components";

type Props = {
  tags: string[];
  setTags: (tags: string[]) => void;
  knownTags: string[];
};

export default function DemoTagsInput({ tags, setTags, knownTags }: Props) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(knownTags);
  const exactOptionMatch = data.some((item) => item === search);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const handleValueSelect = (val: string) => {
    setSearch("");

    if (val === "$create") {
      setData((current) => [...current, search]);
      setTags([...tags, search]);
    } else {
      setTags(
        tags.includes(val) ? tags.filter((v) => v !== val) : [...tags, val]
      );
    }
  };

  const options = data
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
