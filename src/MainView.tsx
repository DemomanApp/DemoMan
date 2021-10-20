import React from "react";
import cfg from "electron-cfg";
import log from "electron-log";

import { Demo, getDemosInDirectory } from "./Demos";
import DemoTable from "./DemoTable";
import SelectDemoPathDialog from "./SelectDemoPathDialog";
import DemoDetails from "./DemoDetailsView";
import SettingsDialog from "./SettingsDialog";
import { InfoDialog } from "./InfoDialog";
import AutoDeleteDialog from "./AutoDeleteDialog";
import convertPrecEvents from "./ConvertPrecEvents";
import { DemoListEntry, getDemoListEntry } from "./DemoListEntry";

type MainViewState = {
  selectDemoPathDialogOpen: boolean;
  demoDetails: React.RefObject<DemoDetails>;
  settings: React.RefObject<SettingsDialog>;
  info: React.RefObject<InfoDialog>;
  autoDeleteDialog: React.RefObject<AutoDeleteDialog>;
  data: DemoListEntry[];
  filteredData: DemoListEntry[];
  quickFilterQuery: string;
  progressPending: boolean;
};

export default class MainView extends React.Component<
  Readonly<unknown>,
  MainViewState
> {
  constructor(props: Readonly<unknown>) {
    super(props);
    this.state = {
      demoDetails: React.createRef(),
      settings: React.createRef(),
      info: React.createRef(),
      autoDeleteDialog: React.createRef(),
      selectDemoPathDialogOpen: !cfg.has("demo_path"),
      data: [],
      filteredData: [],
      quickFilterQuery: "",
      progressPending: true,
    };
  }

  componentDidMount() {
    if (cfg.has("demo_path")) {
      this.refreshDemoList();
    }
  }

  refreshDemoList = async () => {
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

  viewDemo = (demo: Demo) => {
    const { demoDetails } = this.state;
    log.debug(`Viewing demo ${demo.filename}`);
    if (demoDetails.current) {
      demoDetails.current.viewDemo(demo);
    }
  };

  viewSettings = () => {
    const { settings } = this.state;
    if (settings.current) {
      settings.current.open();
    }
  };

  viewInfoDialog = () => {
    const { info, data } = this.state;
    let totalFilesize = 0;
    data.forEach((element) => {
      totalFilesize += element.filesize;
    });

    if (info.current) {
      info.current.setInfo({
        totalDemos: data.length,
        totalFilesize,
      });
      info.current.setOpen(true);
    }
  };

  viewAutoDeleteDialog = () => {
    const { autoDeleteDialog } = this.state;
    autoDeleteDialog.current?.open();
  };

  render() {
    const {
      selectDemoPathDialogOpen,
      demoDetails,
      settings,
      autoDeleteDialog,
      info,
      filteredData,
      quickFilterQuery,
      progressPending,
    } = this.state;
    return (
      <>
        <DemoTable
          data={filteredData}
          viewDemo={this.viewDemo}
          progressPending={progressPending}
          viewInfoDialog={this.viewInfoDialog}
          viewSettings={this.viewSettings}
          viewAutoDeleteDialog={this.viewAutoDeleteDialog}
          convertPrecEvents={convertPrecEvents}
          quickFilterChanged={this.quickFilterChanged}
          refreshDemoList={this.refreshDemoList}
          quickFilterQuery={quickFilterQuery}
          updateQuickFilter={this.updateQuickFilter}
        />
        <SelectDemoPathDialog
          open={selectDemoPathDialogOpen}
          onComplete={() => {
            this.setState({
              selectDemoPathDialogOpen: false,
            });
            this.refreshDemoList();
          }}
        />
        <DemoDetails
          ref={demoDetails}
          demo={null}
          onClose={this.refreshDemoList}
        />
        <SettingsDialog ref={settings} />
        <InfoDialog ref={info} />
        <AutoDeleteDialog
          ref={autoDeleteDialog}
          onClose={this.refreshDemoList}
        />
      </>
    );
  }
}
