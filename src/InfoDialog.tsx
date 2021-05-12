import React from "react";

import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";

import { formatFileSize } from "./util";
import SmallDialog from "./SmallDialog";

export type DemoListInfo = {
  totalFilesize: number;
  totalDemos: number;
};

type InfoDialogState = {
  open: boolean;
  info: DemoListInfo | null;
};

export class InfoDialog extends React.Component<
  Readonly<unknown>,
  InfoDialogState
> {
  constructor(props: Readonly<unknown>) {
    super(props);
    this.state = { open: false, info: null };
  }

  setOpen(value: boolean) {
    this.setState({ open: value });
  }

  setInfo(value: DemoListInfo) {
    this.setState({ info: value });
  }

  render() {
    const { open, info } = this.state;
    if (info === null) {
      return null;
    }
    return (
      <SmallDialog
        title="Statistics"
        open={open}
        onClose={() => {
          this.setOpen(false);
        }}
      >
        <Grid item container direction="column" justify="space-between">
          <Grid item style={{ margin: "8px 0px" }}>
            Number of demos: {info.totalDemos}
          </Grid>
          <Grid item style={{ margin: "8px 0px" }}>
            Total filesize: {formatFileSize(info.totalFilesize)}
          </Grid>
        </Grid>
      </SmallDialog>
    );
  }
}
