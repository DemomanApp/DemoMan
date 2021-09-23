import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { GetSetDemoPath } from "./GetDemoPath";

type SelectDemoPathDialogProps = {
  open: boolean;
  onComplete: () => void;
};

export default function SelectDemoPathDialog(props: SelectDemoPathDialogProps) {
  const { open, onComplete } = props;

  return (
    <Dialog
      open={open}
      onClose={onComplete}
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
        <Button
          onClick={() => {
            if (GetSetDemoPath()) {
              onComplete();
            }
          }}
          variant="outlined"
        >
          Choose...
        </Button>
      </DialogActions>
    </Dialog>
  );
}
