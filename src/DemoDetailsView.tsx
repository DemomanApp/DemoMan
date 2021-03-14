import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import Zoom from "@material-ui/core/Zoom";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import { Demo } from "./Demos";
import { DemoHeader } from "./DemoHeader";
import { formatFileSize, formatPlaybackTime } from "./util";
import EventTable from "./EventTable";

type DemoDetailsProps = {
  demo: Demo | null;
};

type DemoDetailsState = {
  open: boolean;
  demo: Demo | null;
  demoHeader: DemoHeader | null;
};

export default class DemoDetails extends React.Component<
  DemoDetailsProps,
  DemoDetailsState
> {
  constructor(props: DemoDetailsProps) {
    super(props);
    this.state = {
      open: false,
      demo: props.demo,
      demoHeader: null,
    };
  }

  componentDidMount() {
    this.getHeader();
  }

  getHeader = async () => {
    const { demo } = this.state;
    if (demo !== null) {
      this.setState({
        demoHeader: await demo.header(),
      });
    }
  };

  setOpen(value: boolean) {
    this.setState({ open: value });
  }

  viewDemo = async (demo: Demo) => {
    this.setState({ demo });
    const demoHeader = await demo.header();
    this.setState({
      demoHeader,
      open: true,
    });
  };

  render() {
    const { demo, demoHeader, open } = this.state;
    if (demo === null || demoHeader === null) {
      return null;
    }
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={() => {
          this.setOpen(false);
        }}
        TransitionComponent={Zoom}
      >
        <AppBar position="static" style={{ height: "64px" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                this.setOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
            <h2>{demo.getShortName()}</h2>
          </Toolbar>
        </AppBar>
        <Container>
          <Grid
            container
            alignItems="stretch"
            justify="space-around"
            style={{
              padding: "20px",
            }}
          >
            <Grid
              item
              container
              direction="column"
              xs={8}
              alignItems="stretch"
              spacing={10}
            >
              <Grid item>
                <div
                  style={{
                    width: "320px",
                    height: "200px",
                    backgroundColor: "#666",
                    textAlign: "center",
                  }}
                >
                  <h2>{demoHeader.mapName}</h2> <br />
                  (Map thumbnail coming soon&trade;)
                </div>
              </Grid>
              <Grid item container spacing={1}>
                <Grid item xs={4} style={{ textAlign: "right" }}>
                  Recorded on
                </Grid>
                <Grid item xs={8}>
                  {new Date(demo.birthtime).toLocaleString()}
                </Grid>
                <Grid item xs={4} style={{ textAlign: "right" }}>
                  Size
                </Grid>
                <Grid item xs={8}>
                  {formatFileSize(demo.filesize)}
                </Grid>
                <Grid item xs={4} style={{ textAlign: "right" }}>
                  Playback time
                </Grid>
                <Grid item xs={8}>
                  {formatPlaybackTime(demoHeader.playbackTime)}
                </Grid>
                <Grid item xs={4} style={{ textAlign: "right" }}>
                  Server
                </Grid>
                <Grid item xs={8}>
                  {demoHeader.serverName}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={3} style={{ padding: "5px", flexGrow: 1 }}>
                <EventTable demo={demo} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    );
  }
}
