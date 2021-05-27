import React, { ReactNode } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Zoom from "@material-ui/core/Zoom";

type SmallDialogProps = {
  title: string;
  open: boolean;
  actions: ReactNode;
  children: ReactNode;
  onClose: () => void;
};

export default function SmallDialog(props: SmallDialogProps) {
  const { children, title, open, onClose, actions } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}
