import React from "react";
import cfg from "electron-cfg";
import log from "electron-log";

import { Demo } from "./Demos";
import DemoTable from "./DemoTable";
import SelectDemoPathModal from "./SelectDemoPathModal";
import DemoDetails from "./DemoDetailsView";
import SettingsView from "./SettingsView";
import { InfoDialog, DemoListInfo } from "./InfoDialog";

export default class MainView extends React.Component<unknown> {
  private modal: React.RefObject<SelectDemoPathModal>;

  private table: React.RefObject<DemoTable>;

  private demoDetails: React.RefObject<DemoDetails>;

  private settings: React.RefObject<SettingsView>;

  private info: React.RefObject<InfoDialog>;

  constructor(props: unknown) {
    super(props);
    this.modal = React.createRef();
    this.table = React.createRef();
    this.demoDetails = React.createRef();
    this.settings = React.createRef();
    this.info = React.createRef();
  }

  componentDidMount() {
    if (!cfg.has("demo_path")) {
      if (this.modal.current) {
        this.modal.current.setOpen(true);
      }
    }
  }

  viewDemo = (demo: Demo) => {
    log.debug(`Viewing demo ${demo.filename}`);
    if (this.demoDetails.current) {
      this.demoDetails.current.viewDemo(demo);
    }
  };

  viewSettings = () => {
    if (this.settings.current) {
      this.settings.current.setState({ unsavedChanges: {} });
      this.settings.current.setOpen(true);
    }
  };

  viewInfoDialog = (info: DemoListInfo) => {
    if (this.info.current) {
      this.info.current.setInfo(info);
      this.info.current.setOpen(true);
    }
  };

  render() {
    return (
      <>
        <DemoTable
          ref={this.table}
          viewDemo={this.viewDemo}
          viewSettings={this.viewSettings}
          viewInfoDialog={this.viewInfoDialog}
        />
        <SelectDemoPathModal
          ref={this.modal}
          onComplete={() => {
            this.table.current?.RefreshDemoList();
          }}
        />
        <DemoDetails ref={this.demoDetails} demo={null} />
        <SettingsView ref={this.settings} />
        <InfoDialog ref={this.info} />
      </>
    );
  }
}