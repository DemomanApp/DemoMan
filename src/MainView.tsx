import React from "react";
import cfg from "electron-cfg";
import log from "electron-log";

import { Demo } from "./Demos";
import DemoTable from "./DemoTable";
import SelectDemoPathDialog from "./SelectDemoPathDialog";
import DemoDetails from "./DemoDetailsView";
import SettingsDialog from "./SettingsDialog";
import { InfoDialog, DemoListInfo } from "./InfoDialog";
import AutoDeleteDialog from "./AutoDeleteDialog";

type MainViewState = {
  selectDemoPathDialogOpen: boolean;
  table: React.RefObject<DemoTable>;
  demoDetails: React.RefObject<DemoDetails>;
  settings: React.RefObject<SettingsDialog>;
  info: React.RefObject<InfoDialog>;
  autoDeleteDialog: React.RefObject<AutoDeleteDialog>;
};

export default class MainView extends React.Component<
  Readonly<unknown>,
  MainViewState
> {
  constructor(props: Readonly<unknown>) {
    super(props);
    this.state = {
      table: React.createRef(),
      demoDetails: React.createRef(),
      settings: React.createRef(),
      info: React.createRef(),
      autoDeleteDialog: React.createRef(),
      selectDemoPathDialogOpen: !cfg.has("demo_path"),
    };
  }

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

  viewInfoDialog = (newInfo: DemoListInfo) => {
    const { info } = this.state;
    if (info.current) {
      info.current.setInfo(newInfo);
      info.current.setOpen(true);
    }
  };

  viewAutoDeleteDialog = () => {
    const { autoDeleteDialog } = this.state;
    autoDeleteDialog.current?.open();
  };

  render() {
    const {
      table,
      selectDemoPathDialogOpen,
      demoDetails,
      settings,
      autoDeleteDialog,
      info,
    } = this.state;
    return (
      <>
        <DemoTable
          ref={table}
          viewDemo={this.viewDemo}
          viewSettings={this.viewSettings}
          viewInfoDialog={this.viewInfoDialog}
          viewAutoDeleteDialog={this.viewAutoDeleteDialog}
        />
        <SelectDemoPathDialog
          open={selectDemoPathDialogOpen}
          onComplete={() => {
            this.setState({
              selectDemoPathDialogOpen: false,
            });
            table.current?.RefreshDemoList();
          }}
        />
        <DemoDetails
          ref={demoDetails}
          demo={null}
          onClose={() => {
            table.current?.RefreshDemoList();
          }}
        />
        <SettingsDialog ref={settings} />
        <InfoDialog ref={info} />
        <AutoDeleteDialog
          ref={autoDeleteDialog}
          onClose={() => {
            table.current?.RefreshDemoList();
          }}
        />
      </>
    );
  }
}
