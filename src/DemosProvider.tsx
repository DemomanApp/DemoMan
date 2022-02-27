import React from "react";
import cfg from "electron-cfg";

import Demo, { DemoDict } from "./Demo";
import getDemosInDirectory from "./getDemosInDirectory";
import DemosContext from "./DemosContext";

type DemosProviderProps = {
  children: React.ReactNode;
};

type DemosProviderState = {
  demos: DemoDict;
  demosPath?: string;
};

export default class DemosProvider extends React.Component<
  DemosProviderProps,
  DemosProviderState
> {
  constructor(props: DemosProviderProps) {
    super(props);
    const demosPath = cfg.get("demo_path");
    const demos =
      demosPath !== undefined ? getDemosInDirectory(cfg.get("demo_path")) : {};
    this.state = {
      demos,
      demosPath,
    };
  }

  reloadEverything = () => {
    let demos: DemoDict;
    const demosPath = cfg.get("demo_path");
    if (demosPath !== undefined) {
      demos = getDemosInDirectory(cfg.get("demo_path"));
    } else {
      demos = {};
    }
    this.setState({
      demos,
      demosPath,
    });
  };

  reloadEvents = () => {
    const { demos } = this.state;
    Object.values(demos).forEach((demo) => {
      const [events, tags] = Demo.readEventsAndTags(demo.path);
      demo.events = events;
      demo.tags = tags;
    });
  };

  getDemoByName = (name: string) => {
    const { demos } = this.state;
    return demos[name];
  };

  renameDemo = (name: string, newName: string) => {
    if (name !== newName) {
      const { demos } = this.state;
      const demo = demos[name];

      demo.rename(newName);
      demos[newName] = demo;
      delete demos[name];
    }
  };

  deleteDemo = (name: string) => {
    const { demos } = this.state;
    const demo = demos[name];

    delete demos[name];
    demo.delete();
  };

  setDemoPath = (newPath: string) => {
    cfg.set("demo_path", newPath);
    this.setState({ demosPath: newPath });
  };

  render() {
    const { children } = this.props;
    const { demos, demosPath } = this.state;
    return (
      <DemosContext.Provider
        value={{
          demos,
          demosPath: demosPath === undefined ? "" : demosPath,
          setupNeeded: demosPath === undefined,
          reloadEverything: this.reloadEverything,
          reloadEvents: this.reloadEvents,
          getDemoByName: this.getDemoByName,
          renameDemo: this.renameDemo,
          deleteDemo: this.deleteDemo,
          setDemoPath: this.setDemoPath,
        }}
      >
        {children}
      </DemosContext.Provider>
    );
  }
}
