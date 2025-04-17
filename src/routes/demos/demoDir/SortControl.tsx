import { Menu } from "@mantine/core";
import { IconArrowsSort, IconCheck } from "@tabler/icons-react";

import { type SortKey, type SortOrder, sortKeys } from "@/demo";
import { HeaderButton } from "@/components";

type SortControlProps = {
  sortKey: SortKey;
  setSortKey: (newSortKey: SortKey) => void;
  sortOrder: SortOrder;
  setSortOrder: (newSortOrder: SortOrder) => void;
};

export const SortControl = ({
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
}: SortControlProps) => {
  return (
    <Menu position="bottom">
      <Menu.Target>
        <HeaderButton>
          <IconArrowsSort />
        </HeaderButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Sort by</Menu.Label>
        {Object.entries(sortKeys).map(([value, label]) => (
          <Menu.Item
            key={value}
            rightSection={sortKey === value && <IconCheck size={20} />}
            onClick={() => setSortKey(value as SortKey)}
          >
            {label}
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Label>Sort direction</Menu.Label>
        {Object.entries({
          ascending: "Ascending",
          descending: "Descending",
        }).map(([key, value]) => (
          <Menu.Item
            key={key}
            rightSection={sortOrder === key && <IconCheck size={20} />}
            onClick={() => setSortOrder(key as SortOrder)}
          >
            {value}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
