import React, { ReactNode } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Zoom from "@mui/material/Zoom";

type SmallDialogProps = {
  title: string;
  open: boolean;
  actions: ReactNode;
  children: ReactNode;
  maxWidth?: "sm" | "xs" | "md" | "lg" | "xl" | undefined;
  onClose: () => void;
};

export default function SmallDialog(props: SmallDialogProps) {
  const { children, title, open, onClose, actions, maxWidth } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      fullWidth
      maxWidth={maxWidth}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}

SmallDialog.defaultProps = { maxWidth: "xs" };
