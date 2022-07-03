import { useCallback, useEffect, useState, ReactNode } from "react";
import path from "path";

import Demo, { DemoDict, getJSONPath } from "./Demo";
import getDemosInDirectory from "./getDemosInDirectory";
import DemosContext from "./DemosContext";
import useStore from "./hooks/useStore";
import { readPrecFile } from "./PrecConversion";

type DemosProviderProps = {
  children: ReactNode;
};

export default function DemosProvider(props: DemosProviderProps) {
  const { children } = props;

  const [demosPath] = useStore("demo_path");
  const [autoPrec] = useStore("auto_prec");

  const [demos, setDemos] = useState<DemoDict>({});
  const [knownTags, setKnownTags] = useState<Set<string>>(new Set());
  const [knownMaps, setKnownMaps] = useState<Set<string>>(new Set());
  const [knownPlayers, setKnownPlayers] = useState<Set<string>>(new Set());

  const addKnownTag = useCallback((tag: string) => {
    setKnownTags((oldKnownTags) => {
      const newKnownTags = new Set(oldKnownTags);
      newKnownTags.add(tag);
      return newKnownTags;
    });
  }, []);

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
    setDemos((oldDemos) => {
      if (demosPath === undefined) {
        return {};
      }
      const newDemos = { ...oldDemos }; // Shallow copy
      const precEvents = autoPrec
        ? readPrecFile(path.join(demosPath, "KillStreaks.txt"))
        : {};
      Object.values(newDemos).forEach((demo) => {
        const [events, tags] = Demo.readEventsAndTags(getJSONPath(demo.path));
        demo.events = events;
        demo.tags = tags;
        const precDemoEvents = precEvents[demo.name];
        // Only load events from P-REC file if a demo with the specified
        // name exists and it has no events already
        if (precDemoEvents !== undefined && events.length === 0) {
          demo.events = precDemoEvents;
        }
        tags.forEach(addKnownTag);
      });
      return newDemos;
    });
  }, [addKnownTag, autoPrec, demosPath]);

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

  useEffect(() => {
    reloadEvents();
  }, [autoPrec, reloadEvents]);

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
