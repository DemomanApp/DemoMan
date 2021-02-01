import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import DemoTable from "./DemoTable";

const Main = () => {
  return <DemoTable />;
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} />
      </Switch>
    </Router>
  );
}
