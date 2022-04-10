import { useContext, useState } from "react";
import { shell } from "electron";
import log from "electron-log";

import {
  Paper,
  Grid,
  Tooltip,
  IconButton,
  Container,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  FolderOpen as FolderOpenIcon,
  ArrowBackIosNew as ArrowBackIcon,
} from "@mui/icons-material";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import DemoEvent from "./DemoEvent";
import EventTable from "./EventTable";
import DemoMetadataList from "./DemoMetadataList";
import EditEventDialog, { EditDialogMode } from "./EditEventDialog";
import DeleteDialog from "./DeleteDialog";
import RenameDialog from "./RenameDialog";
import MapThumbnail from "./MapThumbnail";
import PageLayout from "./PageLayout";
import DemosContext from "./DemosContext";

type DemoDetailsRouteParams = {
  name: string;
};

export default function DemoDetailsView() {
  const { getDemoByName, deleteDemo, renameDemo } = useContext(DemosContext);
  const navigate = useNavigate();

  const demoName = (useParams() as DemoDetailsRouteParams).name;
  const demo = getDemoByName(atob(demoName));

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editDialogMode, setEditDialogMode] = useState(EditDialogMode.closed);
  const [tickInput, setTickInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  const [editedEvent, setEditedEvent] = useState<DemoEvent | null>(null);

  const [demoEvents, setDemoEventsState] = useState(demo.events);

  const setDemoEvents = (newEvents: DemoEvent[]) => {
    setDemoEventsState(newEvents);
    demo.events = newEvents;
    demo.writeEventsAndTags();
  };

  if (demo === undefined) {
    // should never happen.
    return <Navigate to="/demos" />;
  }

  const editEvent = (event: DemoEvent) => {
    setEditedEvent(event);
    setTickInput(event.tick.toString());
    setValueInput(event.value);
    setEditDialogMode(EditDialogMode.edit);
  };

  const addEvent = () => {
    setEditedEvent(null);
    setTickInput("0");
    setValueInput("New Bookmark");
    setEditDialogMode(EditDialogMode.add);
  };

  return (
    <>
      <PageLayout
        left={
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
            size="large"
          >
            <ArrowBackIcon />
          </IconButton>
        }
        center={
          <Typography variant="h5" noWrap component="div">
            {demo.name}
          </Typography>
        }
        right={
          <>
            <Tooltip title="Rename">
              <IconButton
                onClick={() => setRenameDialogOpen(true)}
                size="large"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => setDeleteDialogOpen(true)}
                size="large"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Show in explorer">
              <IconButton
                onClick={() => {
                  shell.showItemInFolder(demo.path);
                }}
                size="large"
              >
                <FolderOpenIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      >
        <Container>
          <Grid
            item
            container
            alignItems="stretch"
            justifyContent="space-around"
            style={{ padding: "24px" }}
          >
            <Grid
              item
              container
              direction="column"
              xs={6}
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <MapThumbnail mapName={demo.mapName} />
              </Grid>
              <Grid item>
                <DemoMetadataList demo={demo} />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3} style={{ padding: "5px" }}>
                <EventTable
                  data={demoEvents}
                  editEvent={editEvent}
                  addEvent={addEvent}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </PageLayout>
      <EditEventDialog
        mode={editDialogMode}
        onClose={() => {
          setEditDialogMode(EditDialogMode.closed);
        }}
        tickInput={tickInput}
        valueInput={valueInput}
        onTickChanged={setTickInput}
        onValueChanged={setValueInput}
        onConfirm={() => {
          let newDemoEvents = [...demoEvents]; // shallow copy
          if (editDialogMode === EditDialogMode.add) {
            const newEvent: DemoEvent = {
              name: "Bookmark",
              value: valueInput,
              tick: parseInt(tickInput, 10),
            };
            newDemoEvents = demoEvents.concat([newEvent]);
          } else if (editedEvent === null) {
            // Should never happen
            log.error("editedEvent was null!");
          } else {
            const idx = newDemoEvents.indexOf(editedEvent);
            if (idx !== -1) {
              newDemoEvents[idx] = {
                name: editedEvent.name,
                value: valueInput,
                tick: parseInt(tickInput, 10),
              };
            }
          }
          setEditDialogMode(EditDialogMode.closed);
          setDemoEvents(newDemoEvents);
        }}
        onDelete={() => {
          if (editedEvent === null) {
            // Should never happen
            log.error("editedEvent was null!");
          } else {
            const newDemoEvents = [...demoEvents]; // shallow copy
            const idx = newDemoEvents.indexOf(editedEvent);
            if (idx !== -1) {
              newDemoEvents.splice(idx, 1);
            }
            setDemoEvents(newDemoEvents);
          }
          setEditDialogMode(EditDialogMode.closed);
        }}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        demoName={demo.name}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          setDeleteDialogOpen(false);
          deleteDemo(demo.name);
          navigate("/demos");
        }}
      />
      <RenameDialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        onConfirm={(newName) => {
          setRenameDialogOpen(false);
          renameDemo(demo.name, newName);
          navigate(`/demos/${btoa(newName)}`, { replace: true });
        }}
        oldName={demo.name}
      />
    </>
  );
}
