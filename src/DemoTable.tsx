import React, { PureComponent } from "react";
import DataTable, {
  createTheme,
  defaultThemes,
} from "react-data-table-component";
import cfg from "electron-cfg";
import merge from "deepmerge";

import Checkbox from "@material-ui/core/Checkbox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
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

async function getDemoListEntry(demo: Demo): Promise<DemoListEntry> {
  const header = await demo.header();
  return {
    filename: demo.getShortName(),
    map: header.mapName,
    playbackTime: header.playbackTime,
    player: header.clientName,
    server: header.serverName,
    numEvents: (await demo.events()).length,
    numTicks: header.numTicks,
    birthtime: demo.birthtime,
    filesize: demo.filesize,
    demo,
  };
}

function CustomTimeCell(row: DemoListEntry) {
  return <div>{formatPlaybackTime(row.playbackTime)}</div>;
}

function CustomBirthtimeCell(row: DemoListEntry) {
  const date = new Date(row.birthtime);
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

function CustomFilesizeCell(row: DemoListEntry) {
  return <div>{formatFileSize(row.filesize)}</div>;
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
  selectedRows: DemoListEntry[];
  toggleCleared: boolean;
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
      selectedRows: [],
      toggleCleared: false,
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
      selectedRows: [],
      data: [],
      progressPending: true,
    });
    const newDemos = await getDemosInDirectory(cfg.get("demo_path"));
    const newData = await Promise.all(newDemos.map(getDemoListEntry));
    this.setState({
      data: newData,
      progressPending: false,
    });
    // incremental loading prototype,
    // to be experimented with
    // const interval = setInterval(() => {
    //   const e = newData.pop();
    //   if (e !== undefined) {
    //     this.setState((state) => {
    //       return {
    //         data: [...state.data, e],
    //       };
    //     });
    //   } else {
    //     clearInterval(interval);
    //   }
    // }, 5);
    // this.setState({
    //   progressPending: false,
    // });
  };

  deleteMultiple = () => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map((r) => r.filename);

    if (window.confirm(`Are you sure you want to delete:\r ${rows}?`)) {
      // Delete files
    }
  };

  handleChange = (selectedRowState: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: DemoListEntry[];
  }) => {
    this.setState({ selectedRows: selectedRowState.selectedRows });
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
    const { data, toggleCleared, progressPending } = this.state;
    const { viewDemo, viewSettings } = this.props;

    return (
      <DataTable
        title="Demos"
        columns={columns}
        defaultSortField="filename"
        defaultSortAsc={false}
        keyField="filename"
        selectableRows
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
        contextActions={
          <IconButton color="default" onClick={this.deleteMultiple}>
            <DeleteIcon />
          </IconButton>
        }
        contextMessage={{
          singular: "Demo",
          plural: "Demos",
          message: "selected",
        }}
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{ color: "primary" }}
        sortIcon={<ArrowDownward />}
        // selectableRowsComponentProps={selectProps}
        onSelectedRowsChange={this.handleChange}
        clearSelectedRows={toggleCleared}
        pointerOnHover
        onRowClicked={(row: DemoListEntry) => {
          viewDemo(row.demo);
        }}
        fixedHeader
        // 56px is the height of the table title, 57px is the height of the header.
        fixedHeaderScrollHeight="calc(100vh - (56px + 57px))"
        // theme="demoman_dark"
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
