import { useContext } from "react";

import { Button, DialogContentText } from "@mui/material";

import { formatFileSize } from "./util";
import SmallDialog from "./SmallDialog";
import DemosContext from "./DemosContext";

type InfoDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function InfoDialog(props: InfoDialogProps) {
  const { open, onClose } = props;

  // TODO: only recompute stats when opening the dialog (not when closing)
  const { demos } = useContext(DemosContext);

  const demoList = Object.values(demos);

  const totalFilesize = demoList.reduce(
    (total, demo) => total + demo.filesize,
    0
  );
  const totalDemos = demoList.length;

  return (
    <SmallDialog
      title="Statistics"
      open={open}
      onClose={onClose}
      actions={
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      }
    >
      <DialogContentText>
        Number of demos: <b>{totalDemos}</b>
        <br />
        Total filesize: <b>{formatFileSize(totalFilesize)}</b>
      </DialogContentText>
    </SmallDialog>
  );
}
