import React from "react";

import DataTable, {
  createTheme as createTableTheme,
  defaultThemes,
} from "react-data-table-component";
import merge from "deepmerge";

import ArrowDownward from "@mui/icons-material/ArrowDownward";
import blue from "@mui/material/colors/blue";

import loading from "../assets/loading.gif";

import Demo from "./Demo";
import { formatFileSize, formatPlaybackTime } from "./util";
import { getPreferredTheme } from "./theme";

function CustomTimeCell({ playbackTime }: Demo) {
  return <div>{formatPlaybackTime(playbackTime)}</div>;
}

function CustomBirthtimeCell({ birthtime }: Demo) {
  const date = new Date(birthtime);
  return (
    // "whiteSpace: nowrap" should prevent stuff like "PM"
    // from the time string being pushed to a new line.
    <div style={{ whiteSpace: "nowrap" }}>
      {date.toLocaleDateString()}
      <br />
      {date.toLocaleTimeString()}
    </div>
  );
}

function CustomFilesizeCell({ filesize }: Demo) {
  return <div>{formatFileSize(filesize)}</div>;
}

const columns = [
  {
    name: "Name",
    selector: "name",
    sortable: true,
    grow: 1.3,
  },
  {
    name: "Map",
    selector: "mapName",
    sortable: true,
  },
  {
    name: "Playback Time",
    selector: "playbackTime",
    sortable: true,
    cell: CustomTimeCell,
    grow: 0.2,
    right: true,
  },
  {
    name: "Player",
    selector: "clientName",
    sortable: true,
    grow: 0.5,
  },
  {
    name: "Server",
    selector: "serverName",
    sortable: true,
    grow: 1.2,
  },
  {
    name: "Events",
    selector: "events.length",
    sortable: true,
    grow: 0.1,
    right: true,
  },
  {
    name: "Ticks",
    selector: "numTicks",
    sortable: true,
    grow: 0.1,
    right: true,
  },
  {
    name: "Created",
    selector: "birthtime",
    sortable: true,
    cell: CustomBirthtimeCell,
    grow: 0.1,
    center: true,
  },
  {
    name: "Size",
    selector: "filesize",
    sortable: true,
    cell: CustomFilesizeCell,
    grow: 0.1,
    center: true,
  },
];

createTableTheme(
  "dark_alt",
  merge(defaultThemes.dark, {
    background: { default: "#303030" },
    context: {
      background: blue[500],
    },
  })
);

createTableTheme("light_alt", {
  background: { default: "#fafafa" },
  context: {
    background: blue[500],
  },
});

type DemoTableProps = {
  data: Demo[];
  viewDemo: (demo: Demo) => void;
};

export default function DemoTable(props: DemoTableProps) {
  const { data, viewDemo } = props;

  return (
    <>
      <DataTable
        title="Demos"
        columns={columns}
        defaultSortField="birthtime"
        defaultSortAsc={false}
        keyField="name"
        highlightOnHover
        data={data}
        noDataComponent={
          <div>
            No demos found. Make sure you&apos;ve set the correct file path.
          </div>
        }
        sortIcon={<ArrowDownward />}
        pointerOnHover
        onRowClicked={viewDemo}
        fixedHeader
        // 64px is the height of the app bar, 57px is the height of the header.
        fixedHeaderScrollHeight="calc(100vh - (64px + 57px))"
        progressComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={loading} alt="loading..." width="128px" />
            <span style={{ fontSize: "20px", margin: "1rem" }}>Loading...</span>
          </div>
        }
        theme={`${getPreferredTheme()}_alt`}
        noHeader
      />
    </>
  );
}
