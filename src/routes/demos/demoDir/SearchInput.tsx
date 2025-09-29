import { useEffect, useState } from "react";

import { Combobox, Input, useCombobox } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

import KeyValueInputHighlighter from "./StyledInput/KeyValueInputHighlighter";

import classes from "./SearchInput.module.css";

type SearchInputProps = {
  query: string;
  setQuery(newQuery: string): void;
  debounceInterval: number;
};

export default function SearchInput({
  query,
  setQuery,
  debounceInterval,
}: SearchInputProps) {
  const combobox = useCombobox();
  const [rawQueryText, setRawQueryText] = useState(query);
  const [debouncedQueryText] = useDebouncedValue(
    rawQueryText,
    debounceInterval
  );

  useEffect(() => {
    if (debouncedQueryText !== query) {
      setQuery(debouncedQueryText);
    }
  }, [setQuery, debouncedQueryText, query]);

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setRawQueryText(optionValue);
        combobox.closeDropdown();
      }}
      store={combobox}
      withinPortal={false}
    >
      <Combobox.Target>
        <Input
          variant="filled"
          size="md"
          leftSection={<IconSearch size={18} />}
          value={rawQueryText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setRawQueryText(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          classNames={{
            input: classes.input,
            wrapper: classes.wrapper,
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
          placeholder="Search..."
          component={KeyValueInputHighlighter}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <Combobox.Empty>Nothing found</Combobox.Empty>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
