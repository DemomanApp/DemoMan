import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { shell } from "electron";
import { useNavigate } from "react-router";

import debounce from "@mui/utils/debounce";
import { Paper, InputBase, Divider, IconButton, Tooltip } from "@mui/material";
import {
  Clear as ClearIcon,
  Settings as SettingsIcon,
  InfoOutlined as InfoIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";

import Demo from "./Demo";
import DemoTable from "./DemoTable";
import InfoDialog from "./InfoDialog";
import AutoDeleteDialog from "./AutoDeleteDialog";
import convertPrecEvents from "./ConvertPrecEvents";
import DemosContext from "./DemosContext";
import PageLayout from "./PageLayout";
import AppBarButton from "./AppBarButton";
import AppBarMenu from "./AppBarMenu";
import store from "../common/store";

export default function MainView() {
  const { demos, reloadEvents, reloadEverything } = useContext(DemosContext);
  const navigate = useNavigate();

  const [filteredDemos, setFilteredDemos] = useState<Demo[]>([]);
  const [quickFilterQuery, setQuickFilterQuery] = useState("");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [autoDeleteDialogOpen, setAutoDeleteDialogOpen] = useState(false);

  const applyQuickFilter = useCallback(
    (query: string) => {
      const demoList = Object.values(demos);

      if (query === "") {
        setFilteredDemos(demoList);
      } else {
        const lowerCaseQuery = query.toLowerCase();
        setFilteredDemos(
          demoList.filter((demo: Demo) =>
            [demo.name, demo.mapName, demo.clientName, demo.serverName].some(
              (attribute: string) =>
                attribute.toLowerCase().includes(lowerCaseQuery)
            )
          )
        );
      }
    },
    [demos]
  );

  // eslint-disable-next-line react/sort-comp
  const applyQuickFilterDebounced = debounce(applyQuickFilter, 300);

  useEffect(() => {
    applyQuickFilter("");
  }, [applyQuickFilter]);

  const setQuickFilter = (query: string) => {
    setQuickFilterQuery(query);
    applyQuickFilterDebounced(query);
  };

  const quickFilterChanged = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setQuickFilter(e.target.value);
  };

  const viewDemo = (demo: Demo) => {
    navigate(`${btoa(demo.name)}`);
  };

  return (
    <>
      <PageLayout
        center={
          <Paper
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <InputBase
              placeholder="Quick filter"
              style={{ paddingLeft: "12px", width: "300px" }}
              onChange={quickFilterChanged}
              value={quickFilterQuery}
              spellCheck={false}
            />
            <Divider orientation="vertical" style={{ height: "28px" }} />
            <Tooltip title="Clear filter">
              <IconButton
                onClick={() => {
                  setQuickFilter("");
                }}
                size="large"
                disableRipple
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        }
        right={
          <>
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
