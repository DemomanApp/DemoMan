import { Chip, Box } from "@mui/material";

import { AdvancedFilterFilter } from "./types";

type Props = {
  filterListItems: AdvancedFilterFilter[];
  removeQueryItem: (index: number) => void;
};

export default (props: Props) => {
  const { filterListItems, removeQueryItem } = props;

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: "12px",
      }}
    >
      {filterListItems.map(({ key, value }, index) => (
        <Chip
          label={
            <>
              <b>{key}: </b>
              {value}
            </>
          }
          onDelete={() => {
            removeQueryItem(index);
          }}
          size="small"
          key={key}
          sx={{
            marginRight: "4px",
          }}
        />
      ))}
    </Box>
  );
};
