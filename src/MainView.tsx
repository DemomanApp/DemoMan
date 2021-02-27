import React from "react";
import cfg from "electron-cfg";

import DemoTable from "./DemoTable";
import SelectDemoPathModal from "./SelectDemoPathModal";

export default class MainView extends React.Component<unknown> {
  private modal: React.RefObject<SelectDemoPathModal>;

  private table: React.RefObject<DemoTable>;

  constructor(props: unknown) {
    super(props);
    this.modal = React.createRef();
    this.table = React.createRef();
  }

  componentDidMount() {
    if (!cfg.has("demos.path")) {
      if (this.modal.current) {
        this.modal.current.setOpen(true);
      }
    }
  }

  render() {
    return (
      <>
        <div>
          <DemoTable ref={this.table} />
        </div>
        <SelectDemoPathModal
          ref={this.modal}
          onComplete={() => {
            this.table.current?.RefreshDemoList();
          }}
        />
      </>
    );
  }
}
