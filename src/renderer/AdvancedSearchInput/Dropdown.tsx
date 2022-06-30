import { List } from "@mui/material";

import DropdownItem from "./DropdownItem";

type DropdownListProps = {
  width: string;
  items: string[];
  onItemClick: (dropdownIndex: number) => void;
  focusedIndex: number | null;
};

export default (props: DropdownListProps) => {
  const { width, items, focusedIndex, onItemClick } = props;

  return (
    <List
      sx={{
        width,
        tabIndex: -1,
        padding: 0,
        overflowY: "overlay",
        maxHeight: "400px",
      }}
    >
      {items.map((item, index) => (
        <DropdownItem
          onClick={() => onItemClick(index)}
          focused={index === focusedIndex}
          key={item}
        >
          {item}
        </DropdownItem>
      ))}
    </List>
  );
};
