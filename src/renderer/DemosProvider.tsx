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
  const [knownBookmarks, setKnownBookmarks] = useState<Set<string>>(new Set());

  const addKnownTag = useCallback((tag: string) => {
    setKnownTags((oldKnownTags) => {
      const newKnownTags = new Set(oldKnownTags);
      newKnownTags.add(tag);
      return newKnownTags;
    });
  }, []);

  const addKnownBookmark = useCallback((event: string) => {
    setKnownBookmarks((oldKnownBookmarks) => {
      const newKnownBookmarks = new Set(oldKnownBookmarks);
      newKnownBookmarks.add(event);
      return newKnownBookmarks;
    });
  }, []);

  const reloadEverything = useCallback(() => {
    if (demosPath !== undefined) {
      const newDemos = getDemosInDirectory(demosPath);
      const newKnownTags: Set<string> = new Set();
      const newKnownMaps: Set<string> = new Set();
      const newKnownPlayers: Set<string> = new Set();
      const newKnownBookmarks: Set<string> = new Set();
      Object.values(newDemos).forEach((demo) => {
        demo.tags.forEach((tag) => {
          newKnownTags.add(tag);
        });
        newKnownMaps.add(demo.mapName);
        newKnownPlayers.add(demo.clientName);
        demo.events.forEach((event) => {
          if (event.name === "Bookmark") {
            newKnownBookmarks.add(event.value);
          }
        });
      });
      setDemos(newDemos);
      setKnownTags(newKnownTags);
      setKnownMaps(newKnownMaps);
      setKnownPlayers(newKnownPlayers);
      setKnownBookmarks(newKnownBookmarks);
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
        events.forEach((event) => {
          if (event.name === "Bookmark") {
            addKnownBookmark(event.value);
          }
        });
      });
      return newDemos;
    });
  }, [addKnownTag, addKnownBookmark, autoPrec, demosPath]);

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

  const deleteDemo = (name: string, trash: boolean) => {
    // Delete the actual demo file and associated .json file
    const demo = demos[name];
    demo.delete(trash);

    // Update the demo list
    const newDemos = { ...demos };
    delete newDemos[name];
    setDemos(newDemos);
  };

  const deleteDemos = (names: string[], trash: boolean) => {
    // This function is needed to delete multiple demos at once,
    // since calling `deleteDemo` multiple times would not produce
    // the correct result due to react's delayed state updates.

    const newDemos = { ...demos };
    names.forEach((name) => {
      // Delete the actual demo file and associated .json file
      const demo = demos[name];
      demo.delete(trash);

      // Update the demo list
      delete newDemos[name];
    });

    setDemos(newDemos);
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
        deleteDemos,
        knownTags,
        knownMaps,
        knownPlayers,
        knownBookmarks,
        addKnownBookmark,
        addKnownTag,
      }}
    >
      {children}
    </DemosContext.Provider>
  );
}
