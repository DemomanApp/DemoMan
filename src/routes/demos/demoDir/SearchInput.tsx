import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import classes from "./SearchInput.module.css";

type SearchInputProps = {
  query: string;
  setQuery(newQuery: string): void;
};

export default function SearchInput(_: SearchInputProps) {
  // TODO
  return (
    <Input
      variant="filled"
      placeholder="Search"
      size="sm"
      leftSection={<IconSearch size={18} />}
      classNames={{ input: classes.input, wrapper: classes.wrapper }}
    />
  );
}
