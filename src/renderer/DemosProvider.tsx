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
  const [knownTags, setKnownTags] = useState<Set<string>>(new Set());
  const [knownMaps, setKnownMaps] = useState<Set<string>>(new Set());
  const [knownPlayers, setKnownPlayers] = useState<Set<string>>(new Set());

  const reloadEverything = useCallback(() => {
    if (demosPath !== undefined) {
      const newDemos = getDemosInDirectory(demosPath);
      const newKnownTags: Set<string> = new Set();
      const newKnownMaps: Set<string> = new Set();
      const newKnownPlayers: Set<string> = new Set();
      Object.values(newDemos).forEach((demo) => {
        demo.tags.forEach((tag) => {
          newKnownTags.add(tag);
        });
        newKnownMaps.add(demo.mapName);
        newKnownPlayers.add(demo.clientName);
      });
      setDemos(newDemos);
      setKnownTags(newKnownTags);
      setKnownMaps(newKnownMaps);
      setKnownPlayers(newKnownPlayers);
    } else {
      setDemos({});
    }
  }, [demosPath]);

  const reloadEvents = useCallback(() => {
    Object.values(demos).forEach((demo) => {
      const [events, tags] = Demo.readEventsAndTags(demo.path);
      demo.events = events;
      demo.tags = tags;
      const newKnownTags: Set<string> = new Set(knownTags);
      tags.forEach((tag) => {
        if (!knownTags.has(tag)) {
          newKnownTags.add(tag);
        }
      });
      if (newKnownTags !== knownTags) {
        setKnownTags(newKnownTags);
      }
    });
  }, [demos, knownTags]);

  const addKnownTag = (tag: string) => {
    const newKnownTags = new Set(knownTags);
    newKnownTags.add(tag);
    setKnownTags(newKnownTags);
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
        knownTags,
        knownMaps,
        knownPlayers,
        addKnownTag,
      }}
    >
      {children}
    </DemosContext.Provider>
  );
}
