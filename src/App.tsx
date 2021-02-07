import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import cfg from "electron-cfg";

import DemoTable from "./DemoTable";
import SelectDemoPathModal from "./SelectDemoPathModal";

class Main extends React.Component<unknown> {
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

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} />
      </Switch>
    </Router>
  );
}
