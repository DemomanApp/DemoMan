import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import cfg from "electron-cfg";

import DemoTable from "./DemoTable";
import SelectDemoPathModal from "./SelectDemoPathModal";

class Main extends React.Component<unknown> {
  private modal: React.RefObject<SelectDemoPathModal>;

  constructor(props: unknown) {
    super(props);
    this.modal = React.createRef();
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
      <div>
        <DemoTable />
        <SelectDemoPathModal ref={this.modal} />
      </div>
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
