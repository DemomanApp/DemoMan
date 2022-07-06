import { useCallback, useContext, useEffect, useState } from "react";
import { shell } from "electron";
import { useNavigate } from "react-router";
import {
  Settings as SettingsIcon,
  InfoOutlined as InfoIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";

import Demo from "../Demo";
import DemoTable from "./DemoTable";
import InfoDialog from "./InfoDialog";
import AboutDialog from "./AboutDialog";
import AutoDeleteDialog from "./AutoDeleteDialog";
import { convertPrecEvents } from "../PrecConversion";
import DemosContext from "../DemosContext";
import PageLayout from "../PageLayout";
import AppBarButton from "../AppBarButton";
import AppBarMenu from "../AppBarMenu";
import store from "../../common/store";
import AdvancedSearchInput, {
  Query,
  AdvancedFilterKeys,
} from "./AdvancedSearchInput";
import UpdateIndicator from "./UpdateIndicator";

export default function MainView() {
  const {
    demos,
    reloadEvents,
    reloadEverything,
    knownTags,
    knownMaps,
    knownPlayers,
  } = useContext(DemosContext);
  const navigate = useNavigate();

  const [filteredDemos, setFilteredDemos] = useState<Demo[]>([]);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [autoDeleteDialogOpen, setAutoDeleteDialogOpen] = useState(false);

  const advancedFilterKeys: AdvancedFilterKeys = {
    map: {
      possibleValues: [...knownMaps],
      freeInput: true,
    },
    tag: {
      possibleValues: [...knownTags],
      freeInput: false,
    },
    player: {
      possibleValues: [...knownPlayers],
      freeInput: false,
    },
    type: {
      possibleValues: ["stv", "pov"],
      freeInput: false,
    },
  };

  const applyQuickFilter = useCallback(
    (query: Query) => {
      const { text, filters } = query;
      const demoList = Object.values(demos);
      const filterKeys = Object.keys(filters);

      if (text === "" && filterKeys.length === 0) {
        setFilteredDemos(demoList);
        return;
      }
      const lowerCaseQuery = text.toLowerCase();
      let newFilteredDemos = [...demoList];

      // Apply each filter
      filterKeys.forEach((key) => {
        const value = filters[key];
        newFilteredDemos = newFilteredDemos.filter((demo: Demo) => {
          switch (key) {
            case "map":
              return demo.mapName.includes(value);
            case "tag":
              return demo.tags.some((tag: string) => tag === value);
            case "player":
              return demo.clientName === value;
            case "type":
              switch (value) {
                case "stv":
                  return demo.serverName === "";
                case "pov":
                  return demo.serverName !== "";
                default:
                  // Should never occur
                  return false;
              }
            default:
              // Should never occur
              return false;
          }
        });
      });

      // Additionally, filter by the leftover query text
      setFilteredDemos(
        newFilteredDemos.filter((demo: Demo) =>
          [demo.name, demo.mapName, demo.clientName, demo.serverName].some(
            (attribute: string) =>
              attribute.toLowerCase().includes(lowerCaseQuery)
          )
        )
      );
    },
    [demos]
  );

  useEffect(() => {
    // Initially, fill the demo list with all entries, unfiltered.
    applyQuickFilter({ filters: {}, text: "" });
  }, [applyQuickFilter]);

  const viewDemo = (demo: Demo) => {
    navigate(`${encodeURIComponent(demo.name)}`);
  };

  return (
    <>
      <PageLayout
        center={
          <AdvancedSearchInput
            placeholder="Filter..."
            width="550px"
            keys={advancedFilterKeys}
            onSubmit={applyQuickFilter}
          />
        }
        right={
          <>
            <UpdateIndicator />
            <AppBarButton
              icon={<InfoIcon />}
              tooltip="Info"
              onClick={() => setInfoDialogOpen(true)}
            />
            <AppBarButton
              icon={<SettingsIcon />}
              tooltip="Settings"
              onClick={() => navigate("/settings")}
            />
            <AppBarMenu icon={<MoreHorizIcon />} tooltip="More...">
              {[
                {
                  text: "Auto-delete demos and events...",
                  onClick: () => setAutoDeleteDialogOpen(true),
                },
                {
                  text: "Open demos folder",
                  onClick: () => {
                    const demoPath = store.get("demo_path");
                    if (demoPath !== undefined) {
                      shell.openPath(demoPath);
                    }
                  },
                },
                {
                  text: "Convert P-REC bookmarks",
                  onClick: () => {
                    convertPrecEvents();
                    reloadEvents();
                  },
                },
                {
                  text: "About DemoMan...",
                  onClick: () => {
                    setAboutDialogOpen(true);
                  },
                },
              ]}
            </AppBarMenu>
          </>
        }
      >
        <DemoTable data={filteredDemos} viewDemo={viewDemo} />
      </PageLayout>
      <InfoDialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
      />
      <AboutDialog
        open={aboutDialogOpen}
        onClose={() => setAboutDialogOpen(false)}
      />
      <AutoDeleteDialog
        open={autoDeleteDialogOpen}
        onClose={() => {
          setAutoDeleteDialogOpen(false);
          reloadEverything();
        }}
      />
    </>
  );
}
