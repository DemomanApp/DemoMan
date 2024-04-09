import { useEffect, useState } from "react";

import { Input } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

import classes from "./SearchInput.module.css";

type SearchInputProps = {
  initialQuery: string;
  setDebouncedQuery(newQuery: string): void;
  debounceInterval: number;
};

export default function SearchInput({
  initialQuery,
  setDebouncedQuery,
  debounceInterval,
}: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);

  const [debouncedQuery] = useDebouncedValue(query, debounceInterval);

  useEffect(() => {
    setDebouncedQuery(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <Input
      variant="filled"
      placeholder="Search"
      size="sm"
      leftSection={<IconSearch size={18} />}
      classNames={{ input: classes.input, wrapper: classes.wrapper }}
      value={query}
      onChange={(event) => {
        setQuery(event.currentTarget.value);
      }}
    />
  );
}
