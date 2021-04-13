import React from "react";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import { Demo } from "./Demos";
import { DemoHeader } from "./DemoHeader";
import EventTable from "./EventTable";
import DemoDetailsList from "./DemoDetailsList";
import FullscreenDialog from "./FullscreenDialog";

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
              <EventTable demo={demo} />
            </Paper>
          </Grid>
        </Grid>
      </FullscreenDialog>
    );
  }
}
