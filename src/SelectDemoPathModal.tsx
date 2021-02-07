import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import GetDemosPath from "./GetDemoPath";

type SelectDemoPathModalProps = {
  onComplete: () => void;
};

type SelectDemoPathModalState = {
  open: boolean;
  onComplete: () => void;
};

export default class SelectDemoPathModal extends React.PureComponent<
  SelectDemoPathModalProps,
  SelectDemoPathModalState
> {
  constructor(props: SelectDemoPathModalProps) {
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
    if (GetDemosPath()) {
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
          <Button onClick={this.handleChoose} color="primary">
            Choose...
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
