import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { GetSetDemoPath } from "./GetDemoPath";

type SelectDemoPathDialogProps = {
  open: boolean;
  onComplete: () => void;
};

export default function SelectDemoPathDialog(props: SelectDemoPathDialogProps) {
  const { open, onComplete } = props;

  return (
    <Dialog open={open} onClose={onComplete} disableEscapeKeyDown>
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
