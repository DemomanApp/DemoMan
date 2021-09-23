import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { GetSetDemoPath } from "./GetDemoPath";

type SelectDemoPathDialogProps = {
  onComplete: () => void;
};

type SelectDemoPathDialogState = {
  open: boolean;
  onComplete: () => void;
};

export default class SelectDemoPathDialog extends React.PureComponent<
  SelectDemoPathDialogProps,
  SelectDemoPathDialogState
> {
  constructor(props: SelectDemoPathDialogProps) {
    super(props);
    this.state = {
      open: false,
      onComplete: props.onComplete,
    };
  }

  setOpen(value: boolean) {
    this.setState({ open: value });
  }

  handleClose = () => {
    const { onComplete } = this.state;
    this.setOpen(false);
    onComplete();
  };

  handleChoose = () => {
    if (GetSetDemoPath()) {
      this.handleClose();
    }
  };

  render() {
    const { open } = this.state;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle>First time setup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            It looks like you&apos;re opening DemoMan for the first time. <br />
            Please select the the location where your demo files are stored.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleChoose} variant="outlined">
            Choose...
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
