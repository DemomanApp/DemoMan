import React from "react";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import { Demo } from "./Demos";
import { DemoHeader } from "./DemoHeader";
import DemoEvent from "./DemoEvent";
import EventTable from "./EventTable";
import DemoDetailsList from "./DemoDetailsList";
import FullscreenDialog from "./FullscreenDialog";
import EditEventDialog from "./EditEventDialog";
import EventTableEntry from "./EventTableEntry";

type DemoDetailsProps = {
  demo: Demo | null;
};

type DemoDetailsState = {
  open: boolean;
  demo: Demo | null;
  demoHeader: DemoHeader | null;
  events: EventTableEntry[];
  nextAvailableID: number;
};

export default class DemoDetails extends React.Component<
  DemoDetailsProps,
  DemoDetailsState
> {
  private editEventDialog: React.RefObject<EditEventDialog>;

  constructor(props: DemoDetailsProps) {
    super(props);
    this.state = {
      open: false,
      demo: props.demo,
      demoHeader: null,
      events: [],
      nextAvailableID: 0,
    };
    this.editEventDialog = React.createRef();
  }

  setOpen(value: boolean) {
    this.setState({ open: value });
  }

  viewDemo = async (demo: Demo) => {
    this.setState({ demo, nextAvailableID: 0 });
    (async () => {
      const events = await demo.events();
      const demoHeader = await demo.header();
      const entries: EventTableEntry[] = [];
      let i = 0;
      for (; i < events.length; i += 1) {
        entries.push({ id: i, event: events[i] });
      }
      this.setState({
        events: entries,
        demoHeader,
        open: true,
        nextAvailableID: i,
      });
    })();
  };

  writeEvents = () => {
    const { events, demo } = this.state;
    if (demo === null) {
      return;
    }
    const newEvents: DemoEvent[] = [];
    for (let i = 0; i < events.length; i += 1) {
      newEvents.push(events[i].event);
    }
    demo.writeEvents(newEvents);
  };

  editCallback = (event: EventTableEntry) => {
    const { events } = this.state;
    const index = events.findIndex((value: EventTableEntry) => {
      return value.id === event.id;
    });
    events[index] = event;
    this.setState({
      events,
    });
    this.writeEvents();
  };

  addCallback = (event: EventTableEntry) => {
    const { events, nextAvailableID } = this.state;
    event.id = nextAvailableID;
    events.push(event);
    this.setState({
      events,
      nextAvailableID: nextAvailableID + 1,
    });
    this.writeEvents();
  };

  deleteCallback = (event: EventTableEntry) => {
    const { events } = this.state;
    const index = events.findIndex((value: EventTableEntry) => {
      return value.id === event.id;
    });
    events.splice(index, 1);
    this.setState({
      events,
    });
    this.writeEvents();
  };

  editEvent = (event: EventTableEntry) => {
    this.editOrAddEvent(event, true);
  };

  addEvent = () => {
    this.editOrAddEvent(
      {
        id: -1,
        event: {
          tick: 0,
          name: "Bookmark",
          value: "New Bookmark",
        },
      },
      false
    );
  };

  editOrAddEvent = (event: EventTableEntry, edit: boolean) => {
    if (this.editEventDialog.current) {
      this.editEventDialog.current.setEvent(event);
      this.editEventDialog.current.setEditing(edit);
      this.editEventDialog.current.open();
    }
  };

  render() {
    const { demo, demoHeader, open, events } = this.state;
    if (demo === null || demoHeader === null) {
      return null;
    }
    return (
      <>
        <FullscreenDialog
          title={demo.getShortName()}
          open={open}
          onClose={() => {
            this.setOpen(false);
          }}
        >
          <Grid
            item
            container
            alignItems="stretch"
            justify="space-around"
            style={{ padding: "24px" }}
          >
            <Grid item container direction="column" xs={6} alignItems="center">
              <Grid item>
                <div
                  style={{
                    width: "320px",
                    height: "200px",
                    backgroundColor: "#666",
                    textAlign: "center",
                  }}
                >
                  <h2 style={{ margin: "0px" }}>{demoHeader.mapName}</h2> <br />
                  (Map thumbnail coming soon&trade;)
                </div>
              </Grid>
              <DemoDetailsList demo={demo} demoHeader={demoHeader} />
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3} style={{ padding: "5px" }}>
                <EventTable
                  data={events}
                  editEvent={this.editEvent}
                  addEvent={this.addEvent}
                />
              </Paper>
            </Grid>
          </Grid>
        </FullscreenDialog>
        <EditEventDialog
          ref={this.editEventDialog}
          addCallback={this.addCallback}
          editCallback={this.editCallback}
          deleteCallback={this.deleteCallback}
        />
      </>
    );
  }
}
