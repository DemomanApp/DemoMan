import React from "react";

import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";

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
        actions={
          <Button
            variant="contained"
            onClick={() => {
              this.setOpen(false);
            }}
          >
            Close
          </Button>
        }
      >
        <DialogContentText>
          Number of demos: <b>{info.totalDemos}</b>
          <br />
          Total filesize: <b>{formatFileSize(info.totalFilesize)}</b>
        </DialogContentText>
      </SmallDialog>
    );
  }
}
