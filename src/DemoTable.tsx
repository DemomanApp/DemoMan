import React, { PureComponent } from "react";
import DataTable, {
  createTheme,
  defaultThemes,
} from "react-data-table-component";
import cfg from "electron-cfg";
import merge from "deepmerge";

import ArrowDownward from "@material-ui/icons/ArrowDownward";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import SettingsIcon from "@material-ui/icons/Settings";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import blue from "@material-ui/core/colors/blue";

import loading from "../assets/loading.gif";

import { Demo, getDemosInDirectory } from "./Demos";
import { formatFileSize, formatPlaybackTime } from "./util";
import { getPreferredTheme } from "./theme";
import { DemoListInfo } from "./InfoDialog";

// Fixes an ESLint false positive
/* eslint-disable react/no-unused-prop-types */
interface DemoListEntry {
  filename: string;
  map: string;
  playbackTime: number;
  player: string;
  server: string;
  numEvents: number;
  numTicks: number;
  birthtime: number;
  filesize: number;
  demo: Demo;
}
/* eslint-enable react/no-unused-prop-types */

function getDemoListEntry(demo: Demo): DemoListEntry {
  const header = demo.header();
  return {
    filename: demo.getShortName(),
    map: header.mapName,
    playbackTime: header.playbackTime,
    player: header.clientName,
    server: header.serverName,
    numEvents: demo.events().length,
    numTicks: header.numTicks,
    birthtime: demo.birthtime,
    filesize: demo.filesize,
    demo,
  };
}

function CustomTimeCell({ playbackTime }: DemoListEntry) {
  return <div>{formatPlaybackTime(playbackTime)}</div>;
}

function CustomBirthtimeCell({ birthtime }: DemoListEntry) {
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

function CustomFilesizeCell({ filesize }: DemoListEntry) {
  return <div>{formatFileSize(filesize)}</div>;
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
    cell: CustomTimeCell,
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

createTheme(
  "dark_alt",
  merge(defaultThemes.dark, {
    background: { default: "#303030" },
    context: {
      background: blue[500],
    },
  })
);

createTheme("light_alt", {
  background: { default: "#fafafa" },
  context: {
    background: blue[500],
  },
});

type DemoTableProps = {
  viewDemo: (demo: Demo) => void;
  viewSettings: () => void;
  viewInfoDialog: (info: DemoListInfo) => void;
};

type DemoTableState = {
  data: DemoListEntry[];
  progressPending: boolean;
};

export default class DemoTable extends PureComponent<
  DemoTableProps,
  DemoTableState
> {
  constructor(props: DemoTableProps) {
    super(props);
    this.state = {
      data: [],
      progressPending: false,
    };
  }

  componentDidMount() {
    if (cfg.has("demo_path")) {
      this.RefreshDemoList();
    }
  }

  RefreshDemoList = async () => {
    this.setState({
      data: [],
      progressPending: true,
    });
    const newDemos = await getDemosInDirectory(cfg.get("demo_path"));
    const newData = newDemos.map(getDemoListEntry);
    this.setState({
      data: newData,
      progressPending: false,
    });
  };

  viewInfo = () => {
    const { viewInfoDialog: openInfoDialog } = this.props;
    const { data } = this.state;
    let totalFilesize = 0;
    data.forEach((element) => {
      totalFilesize += element.filesize;
    });
    openInfoDialog({
      totalDemos: data.length,
      totalFilesize,
    });
  };

  render() {
    const { data, progressPending } = this.state;
    const { viewDemo, viewSettings } = this.props;

    return (
      <DataTable
        title="Demos"
        columns={columns}
        defaultSortField="birthtime"
        defaultSortAsc={false}
        keyField="filename"
        highlightOnHover
        actions={
          <>
            <Tooltip title="Reload demos">
              <IconButton color="default" onClick={this.RefreshDemoList}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Info">
              <IconButton color="default" onClick={this.viewInfo}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton color="default" onClick={viewSettings}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        data={data}
        noDataComponent={
          <div>
            No demos found. Make sure you&apos;ve set the correct file path.
          </div>
        }
        sortIcon={<ArrowDownward />}
        pointerOnHover
        onRowClicked={(row: DemoListEntry) => {
          viewDemo(row.demo);
        }}
        fixedHeader
        // 56px is the height of the table title, 57px is the height of the header.
        fixedHeaderScrollHeight="calc(100vh - (56px + 57px))"
        progressPending={progressPending}
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
      />
    );
  }
}
