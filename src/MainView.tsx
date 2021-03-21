import React from "react";
import cfg from "electron-cfg";
import log from "electron-log";

import { Demo } from "./Demos";
import DemoTable from "./DemoTable";
import SelectDemoPathModal from "./SelectDemoPathModal";
import DemoDetails from "./DemoDetailsView";

export default class MainView extends React.Component<unknown> {
  private modal: React.RefObject<SelectDemoPathModal>;

  private table: React.RefObject<DemoTable>;

  private demoDetails: React.RefObject<DemoDetails>;

  constructor(props: unknown) {
    super(props);
    this.modal = React.createRef();
    this.table = React.createRef();
    this.demoDetails = React.createRef();
  }

  componentDidMount() {
    if (!cfg.has("demos.path")) {
      if (this.modal.current) {
        this.modal.current.setOpen(true);
      }
    }
  }

  viewDemo = (demo: Demo) => {
    log.debug(`Viewing demo ${demo.filename}`);
    if (this.demoDetails.current) {
      this.demoDetails.current.viewDemo(demo);
      // this.demoDetails.current.setDemo(demo);
      // this.demoDetails.current.setOpen(true);
    }
  };

  render() {
    return (
      <>
        <DemoTable ref={this.table} viewDemo={this.viewDemo} />
        <SelectDemoPathModal
          ref={this.modal}
          onComplete={() => {
            this.table.current?.RefreshDemoList();
          }}
        />
        <DemoDetails ref={this.demoDetails} demo={null} />
      </>
    );
  }
}
