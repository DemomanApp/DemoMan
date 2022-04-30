import { useContext, useState } from "react";
import { shell } from "electron";
import log from "electron-log";

import {
  Paper,
  Container,
  Typography,
  Autocomplete,
  TextField,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  FolderOpen as FolderOpenIcon,
  ArrowBackIosNew as ArrowBackIcon,
  Check as CheckIcon,
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
import AppBarButton from "./AppBarButton";

type DemoDetailsRouteParams = {
  name: string;
};

export default function DemoDetailsView() {
  const { getDemoByName, deleteDemo, renameDemo, knownTags, addKnownTag } =
    useContext(DemosContext);
  const navigate = useNavigate();

  const demoName = (useParams() as DemoDetailsRouteParams).name;
  const demo = getDemoByName(decodeURIComponent(demoName));

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editDialogMode, setEditDialogMode] = useState(EditDialogMode.closed);
  const [tickInput, setTickInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  const [editedEvent, setEditedEvent] = useState<DemoEvent | null>(null);

  const [demoEvents, setDemoEventsState] = useState(demo.events);

  const [demoTags, setDemoTagsState] = useState(demo.tags);

  const setDemoEvents = (newEvents: DemoEvent[]) => {
    setDemoEventsState(newEvents);
    demo.events = newEvents;
    demo.writeEventsAndTags();
  };

  const setDemoTags = (newTags: string[]) => {
    setDemoTagsState(newTags);
    demo.tags = newTags;
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
          <AppBarButton
            tooltip="Go back"
            icon={<ArrowBackIcon />}
            onClick={() => {
              navigate(-1);
            }}
          />
        }
        center={
          <Typography variant="h5" noWrap component="div">
            {demo.name}
          </Typography>
        }
        right={
          <>
            <AppBarButton
              tooltip="Rename"
              icon={<EditIcon />}
              onClick={() => setRenameDialogOpen(true)}
            />
            <AppBarButton
              tooltip="Delete"
              icon={<DeleteOutlineIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            />
            <AppBarButton
              tooltip="Show in explorer"
              icon={<FolderOpenIcon />}
              onClick={() => shell.showItemInFolder(demo.path)}
            />
          </>
        }
      >
        <Container>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={2}
            pt="24px"
          >
            <Stack
              alignItems="stretch"
              spacing={2}
              justifyContent="space-between"
            >
              <MapThumbnail mapName={demo.mapName} />
              <DemoMetadataList demo={demo} />
              <Autocomplete
                multiple
                disableCloseOnSelect
                size="small"
                options={[...knownTags]}
                fullWidth
                limitTags={3}
                freeSolo
                value={demoTags}
                renderInput={(params) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    label="Tags"
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <li {...props}>
                    {option}
                    {selected && <CheckIcon sx={{ marginLeft: "auto" }} />}
                  </li>
                )}
                sx={{
                  maxWidth: "320px",
                }}
                onChange={(_e, tags: string[]) => {
                  if (tags.length !== 0) {
                    const newTag = tags[tags.length - 1];
                    if (!knownTags.has(newTag)) {
                      addKnownTag(newTag);
                    }
                  }
                  setDemoTags(tags);
                }}
              />
            </Stack>
            <Paper elevation={3} style={{ padding: "5px", minWidth: "640px" }}>
              <EventTable
                data={demoEvents}
                editEvent={editEvent}
                addEvent={addEvent}
              />
            </Paper>
          </Stack>
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
          navigate(`/demos/${encodeURIComponent(newName)}`, { replace: true });
        }}
        oldName={demo.name}
      />
    </>
  );
}
