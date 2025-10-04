import { useEffect, useState } from "react";

import { Combobox, Input, useCombobox } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

import { useAutocomplete } from "./useAutocomplete";

import classes from "./SearchInput.module.css";
import {
  KeyValueInputHighlighter,
  keyValueQueryLanguage,
} from "./KeyValueQueryLanguage";
import StyledInput from "./StyledInput";

type SearchInputProps = {
  query: string;
  setQuery(newQuery: string): void;
  debounceInterval: number;
  filterKeys: Record<string, string[]>;
};

export default function SearchInput({
  query,
  setQuery,
  debounceInterval,
  filterKeys,
}: SearchInputProps) {
  const combobox = useCombobox();

  const [rawQueryText, setRawQueryText] = useState(query);
  const [debouncedQueryText] = useDebouncedValue(
    rawQueryText,
    debounceInterval
  );

  const [dropdownItems, onOptionSubmit, onSelect, inputRef] = useAutocomplete(
    rawQueryText,
    setRawQueryText,
    filterKeys
  );

  console.log({ rawQueryText });

  useEffect(() => {
    if (debouncedQueryText !== query) {
      setQuery(debouncedQueryText);
    }
  }, [setQuery, debouncedQueryText, query]);

  return (
    <Combobox
      onOptionSubmit={onOptionSubmit}
      store={combobox}
      withinPortal={false}
    >
      <Combobox.Target>
        <Input
          variant="filled"
          size="md"
          leftSection={<IconSearch size={18} />}
          value={rawQueryText}
          classNames={{
            input: classes.input,
            wrapper: classes.wrapper,
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
          onChange={(event) => {
            setRawQueryText(event.currentTarget.value);
            console.log("change", event.target.selectionStart);
          }}
          onSelect={onSelect}
          placeholder="Search..."
          component={StyledInput}
          queryLanguage={keyValueQueryLanguage}
          queryLanguageParameters={{ filterKeys }}
          inputRef={inputRef}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {dropdownItems.length === 0 ? (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          ) : (
            dropdownItems.map((dropdownItem, index) => (
              <Combobox.Option
                key={index.toString() + dropdownItem}
                value={dropdownItem}
              >
                {dropdownItem}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
