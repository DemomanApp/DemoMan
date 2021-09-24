import React, { PureComponent } from "react";
import { shell } from "electron";

import DataTable, {
  createTheme as createTableTheme,
  defaultThemes,
} from "react-data-table-component";
import cfg from "electron-cfg";
import merge from "deepmerge";

import ArrowDownward from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import blue from "@mui/material/colors/blue";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import ClearIcon from "@mui/icons-material/Clear";
import Divider from "@mui/material/Divider";

import loading from "../assets/loading.gif";

import { Demo, getDemosInDirectory } from "./Demos";
import { formatFileSize, formatPlaybackTime } from "./util";
import { getPreferredTheme } from "./theme";
import { DemoListInfo } from "./InfoDialog";
import convertPrecEvents from "./ConvertPrecEvents";

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
  const { header, events } = demo;
  return {
    filename: demo.getShortName(),
    map: header.mapName,
    playbackTime: header.playbackTime,
    player: header.clientName,
    server: header.serverName,
    numEvents: events.length,
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
  viewDemo: (demo: Demo) => void;
  viewSettings: () => void;
  viewInfoDialog: (info: DemoListInfo) => void;
  viewAutoDeleteDialog: () => void;
};

type DemoTableState = {
  data: DemoListEntry[];
  filteredData: DemoListEntry[];
  quickFilterQuery: string;
  progressPending: boolean;
  moreMenuAnchor: Element | null;
};

export default class DemoTable extends PureComponent<
  DemoTableProps,
  DemoTableState
> {
  constructor(props: DemoTableProps) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      quickFilterQuery: "",
      progressPending: false,
      moreMenuAnchor: null,
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
      filteredData: [],
      progressPending: true,
    });
    const newDemos = await getDemosInDirectory(cfg.get("demo_path"));
    const newData = newDemos.map(getDemoListEntry);
    this.setState({
      data: newData,
      progressPending: false,
    });
    this.updateQuickFilter("");
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

  openMoreMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ moreMenuAnchor: event.currentTarget });
  };

  closeMoreMenu = () => {
    this.setState({ moreMenuAnchor: null });
  };

  quickFilterChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    this.updateQuickFilter(e.target.value);
  };

  updateQuickFilter = (query: string) => {
    const { data } = this.state;
    this.setState({
      quickFilterQuery: query,
    });
    if (query === "") {
      this.setState({
        filteredData: data,
      });
    } else {
      const lowerCaseQuery = query.toLowerCase();
      setTimeout(() => {
        this.setState({
          filteredData: data.filter((value: DemoListEntry) =>
            [value.filename, value.map, value.player, value.server].some(
              (attribute: string) =>
                attribute.toLowerCase().includes(lowerCaseQuery)
            )
          ),
        });
      }, 0);
    }
  };

  render() {
    const { filteredData, quickFilterQuery, progressPending, moreMenuAnchor } =
      this.state;
    const { viewDemo, viewSettings, viewAutoDeleteDialog } = this.props;

    return (
      <>
        <DataTable
          title="Demos"
          columns={columns}
          defaultSortField="birthtime"
          defaultSortAsc={false}
          keyField="filename"
          highlightOnHover
          actions={
            <>
              <Paper
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InputBase
                  placeholder="Quick filter"
                  style={{ paddingLeft: "12px", width: "300px" }}
                  onChange={this.quickFilterChanged}
                  value={quickFilterQuery}
                  spellCheck={false}
                />
                <Divider orientation="vertical" style={{ height: "28px" }} />
                <Tooltip title="Clear filter">
                  <IconButton
                    onClick={() => {
                      this.updateQuickFilter("");
                    }}
                    size="large"
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Paper>
              <Tooltip title="Reload demos">
                <IconButton
                  color="default"
                  onClick={this.RefreshDemoList}
                  size="large"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Info">
                <IconButton
                  color="default"
                  onClick={this.viewInfo}
                  size="large"
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton color="default" onClick={viewSettings} size="large">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="More...">
                <IconButton
                  color="default"
                  onClick={this.openMoreMenu}
                  size="large"
                >
                  <MoreHorizIcon />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={moreMenuAnchor}
                keepMounted
                open={moreMenuAnchor !== null}
                onClose={this.closeMoreMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={() => {
                    viewAutoDeleteDialog();
                    this.closeMoreMenu();
                  }}
                >
                  Auto-delete demos and events...
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    shell.openPath(cfg.get("demo_path"));
                    this.closeMoreMenu();
                  }}
                >
                  Open demos folder
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    convertPrecEvents();
                    this.closeMoreMenu();
                    this.RefreshDemoList();
                  }}
                >
                  Convert P-REC bookmarks
                </MenuItem>
              </Menu>
            </>
          }
          data={filteredData}
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
              <span style={{ fontSize: "20px", margin: "1rem" }}>
                Loading...
              </span>
            </div>
          }
          theme={`${getPreferredTheme()}_alt`}
        />
      </>
    );
  }
}
