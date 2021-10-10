import React from "react";
import DataTable from "react-data-table-component";

import ArrowDownward from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";

import { getPreferredTheme } from "./theme";
import EventTableEntry from "./EventTableEntry";

const columns = [
  {
    name: "Tick",
    selector: "event.tick",
    sortable: true,
    grow: 1,
  },
  {
    name: "Type",
    selector: "event.name",
    sortable: true,
    grow: 1,
  },
  {
    name: "Value",
    selector: "event.value",
    sortable: true,
    grow: 4,
  },
];

type EventTableProps = {
  data: EventTableEntry[];
  editEvent: (event: EventTableEntry) => void;
  addEvent: () => void;
};

export default function EventTable(props: EventTableProps) {
  const { data, editEvent, addEvent } = props;
  return (
    <DataTable
      title="Events"
      columns={columns}
      defaultSortField="event.tick"
      defaultSortAsc
      highlightOnHover
      noDataComponent={
        <div style={{ height: "2rem" }}>
          This demo doesn&apos;t have any events recorded.
        </div>
      }
      actions={
        <Tooltip title="Add event">
          <IconButton onClick={addEvent} size="large">
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
      data={data}
      onRowClicked={editEvent}
      pointerOnHover
      sortIcon={<ArrowDownward />}
      fixedHeader
      // 64px: Page title,
      // 1px: Divider,
      // 24px and 5px: padding,
      // 56px: table title,
      // 57px: table header.
      fixedHeaderScrollHeight="calc(100vh - 64px - 1px - 2 * 24px - 2 * 5px - 56px - 57px)"
      theme={getPreferredTheme()}
    />
  );
}
