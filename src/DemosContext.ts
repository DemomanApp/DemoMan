import React from "react";

import Demo, { DemoDict } from "./Demo";

type DemosContextType = {
  demos: DemoDict;
  demosPath: string;
  setupNeeded: boolean;
  reloadEverything: () => void;
  reloadEvents: () => void;
  getDemoByName: (name: string) => Demo;
  renameDemo: (name: string, newName: string) => void;
  deleteDemo: (name: string) => void;
  setDemoPath: (path: string) => void;
};

export default React.createContext<DemosContextType>({} as DemosContextType);
