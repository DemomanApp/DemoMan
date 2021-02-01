import React, { PureComponent } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import cfg from "electron-cfg";

import Checkbox from "@material-ui/core/Checkbox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Refresh";

import { Demo, getDemosInDirectory } from "./Demos";

interface DemoListEntry {
  filename: string;
  map: string;
  playbackTime: number;
  player: string;
  server: string;
  numEvents: number;
  numTicks: number;
}

function leftPadTwo(val: string) {
  return `00${val}`.slice(-Math.max(val.length, 2));
}

function formatPlaybackTime(seconds: number): string {
  const fSeconds = Math.floor(seconds % 60);
  const tMinutes = Math.floor(seconds / 60);
  const fMinutes = tMinutes % 60;
  const fHours = Math.floor(tMinutes / 60);
  /* eslint-disable */
  return `${
    leftPadTwo(fHours.toString())}:${
    leftPadTwo(fMinutes.toString())}:${
    leftPadTwo(fSeconds.toString())}`;
  /* eslint-enable */
}

const CustomTimeCell = ({ row }: { row: DemoListEntry }) => (
  <div>{formatPlaybackTime(row.playbackTime)}</div>
);

function getDemoListEntry(demo: Demo): DemoListEntry {
  return {
    filename: demo.getShortName(),
    map: demo.header().mapName,
    playbackTime: demo.header().playbackTime,
    player: demo.header().clientName,
    server: demo.header().serverName,
    numEvents: demo.events().length,
    numTicks: demo.header().numTicks,
  };
}

const columns = [
  {
    name: "Filename",
    selector: "filename",
    sortable: true,
    grow: 1.3,
  },
  {
    name: "Map",
    selector: "map",
    sortable: true,
  },
  {
    name: "Playback Time",
    selector: "playbackTime",
    sortable: true,
    cell: (row: DemoListEntry) => <CustomTimeCell row={row} />,
    grow: 0.2,
    right: true,
  },
  {
    name: "Player",
    selector: "player",
    sortable: true,
    grow: 0.5,
  },
  {
    name: "Server",
    selector: "server",
    sortable: true,
    grow: 1.2,
  },
  {
    name: "Events",
    selector: "numEvents",
    sortable: true,
    grow: 0.1,
    right: true,
  },
  {
    name: "Ticks",
    selector: "numTicks",
    sortable: true,
    grow: 0.5,
    right: true,
  },
  {
    name: "View",
    cell: () => (
      <IconButton color="primary">
        <ChevronRightIcon />
      </IconButton>
    ),
    button: true,
  },
];

createTheme("theme_demoman_dark", {
  text: {
    primary: "#268bd2",
    secondary: "#2aa198",
  },
  background: {
    default: "#002b36",
  },
  context: {
    background: "#cb4b16",
    text: "#FFFFFF",
  },
  divider: {
    default: "#073642",
  },
  action: {
    button: "rgba(0,0,0,.54)",
    hover: "rgba(0,0,0,.08)",
    disabled: "rgba(0,0,0,.12)",
  },
});

function getDemosPath() {
  return cfg.get("demos.path");
}

type DemoTableProps = unknown;

type DemoTableState = {
  selectedRows: DemoListEntry[];
  toggleCleared: boolean;
  data: DemoListEntry[];
};

export default class DemoTable extends PureComponent<
  DemoTableProps,
  DemoTableState
> {
  constructor(props: DemoTableProps) {
    super(props);
    this.state = {
      selectedRows: [],
      toggleCleared: false,
      data: getDemosInDirectory(getDemosPath()).map(getDemoListEntry),
    };
  }

  RefreshDemoList = () => {
    this.setState({
      selectedRows: [],
      data: getDemosInDirectory(getDemosPath()).map(getDemoListEntry),
    });
  };

  deleteMultiple = () => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map((r) => r.filename);

    if (window.confirm(`Are you sure you want to delete:\r ${rows}?`)) {
      // Delete files
    }
  };

  /* eslint-disable react/sort-comp */
  actions = (
    <IconButton color="default" onClick={this.RefreshDemoList}>
      <RefreshIcon />
    </IconButton>
  );

  contextActions = (
    <IconButton color="default" onClick={this.deleteMultiple}>
      <DeleteIcon />
    </IconButton>
  );
  /* eslint-enable react/sort-comp */

  handleChange = (selectedRowState: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: DemoListEntry[];
  }) => {
    this.setState({ selectedRows: selectedRowState.selectedRows });
    console.log("Selected Rows: ", selectedRowState.selectedRows);
  };

  handleRowClicked = (row: DemoListEntry) => {
    console.log(`${row.filename} was clicked!`);
  };

  render() {
    const { data, toggleCleared } = this.state;

    return (
      <DataTable
        title="Demos"
        columns={columns}
        defaultSortField="filename"
        defaultSortAsc={false}
        keyField="filename"
        selectableRows
        highlightOnHover
        actions={this.actions}
        data={data}
        contextActions={this.contextActions}
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{ color: "primary" }}
        sortIcon={<ArrowDownward />}
        // selectableRowsComponentProps={selectProps}
        onSelectedRowsChange={this.handleChange}
        clearSelectedRows={toggleCleared}
        onRowClicked={this.handleRowClicked}
        fixedHeader
        // 56px is the height of the table title, 57px is the height of the header.
        fixedHeaderScrollHeight="calc(100vh - (56px + 57px))"
        // theme="theme_demoman_dark"
      />
    );
  }
}
