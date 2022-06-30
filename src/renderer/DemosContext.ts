import { createContext } from "react";

import Demo, { DemoDict } from "./Demo";

type DemosContextType = {
  demos: DemoDict;
  reloadEverything: () => void;
  reloadEvents: () => void;
  getDemoByName: (name: string) => Demo;
  renameDemo: (name: string, newName: string) => void;
  deleteDemo: (name: string) => void;
  knownTags: Set<string>;
  knownMaps: Set<string>;
  knownPlayers: Set<string>;
  addKnownTag: (tag: string) => void;
};

export default createContext<DemosContextType>({} as DemosContextType);
