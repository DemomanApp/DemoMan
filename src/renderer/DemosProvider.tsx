import { useCallback, useEffect, useState, ReactNode } from "react";

import Demo, { DemoDict } from "./Demo";
import getDemosInDirectory from "./getDemosInDirectory";
import DemosContext from "./DemosContext";
import useStore from "./hooks/useStore";

type DemosProviderProps = {
  children: ReactNode;
};

export default function DemosProvider(props: DemosProviderProps) {
  const { children } = props;

  const [demosPath] = useStore("demo_path");
  // const [demos, setDemos] = useState<DemoDict>(
  //   demosPath !== undefined ? getDemosInDirectory(demosPath) : {}
  // );
  const [demos, setDemos] = useState<DemoDict>({});

  const reloadEverything = useCallback(() => {
    if (demosPath !== undefined) {
      setDemos(getDemosInDirectory(demosPath));
    } else {
      setDemos({});
    }
  }, [demosPath]);

  const reloadEvents = () => {
    Object.values(demos).forEach((demo) => {
      const [events, tags] = Demo.readEventsAndTags(demo.path);
      demo.events = events;
      demo.tags = tags;
    });
  };

  const getDemoByName = (name: string) => {
    return demos[name];
  };

  const renameDemo = (name: string, newName: string) => {
    if (name !== newName) {
      const demo = demos[name];

      demo.rename(newName);
      demos[newName] = demo;
      delete demos[name];
    }
  };

  const deleteDemo = (name: string) => {
    const demo = demos[name];

    delete demos[name];
    demo.delete();
  };

  useEffect(() => {
    reloadEverything();
  }, [demosPath, reloadEverything]);

  return (
    <DemosContext.Provider
      value={{
        demos,
        reloadEverything,
        reloadEvents,
        getDemoByName,
        renameDemo,
        deleteDemo,
      }}
    >
      {children}
    </DemosContext.Provider>
  );
}
