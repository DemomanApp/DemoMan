import { useEffect, useState } from "react";

import { Input } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

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
  const [rawQuery, setRawQuery] = useState(query);

  const [debouncedQuery] = useDebouncedValue(rawQuery, debounceInterval);

  useEffect(() => {
    if (debouncedQuery !== query) {
      setQuery(debouncedQuery);
    }
  }, [setQuery, debouncedQuery, query]);

  return (
    <Input
      variant="filled"
      placeholder="Search"
      size="sm"
      leftSection={<IconSearch size={18} />}
      classNames={{ input: classes.input, wrapper: classes.wrapper }}
      value={rawQuery}
      onChange={(event) => {
        setRawQuery(event.currentTarget.value);
      }}
    />
  );
}
