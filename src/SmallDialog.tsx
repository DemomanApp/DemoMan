import React, { ReactNode } from "react";

import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Zoom from "@material-ui/core/Zoom";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

type SmallDialogProps = {
  title: string;
  open: boolean;
  children: ReactNode;
  onClose: () => void;
};

export default function SmallDialog(props: SmallDialogProps) {
  const { children, title, open, onClose } = props;
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Zoom}>
      <Grid
        container
        direction="column"
        style={{ padding: "24px", minWidth: "400px" }}
      >
        <Grid item container justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">{title}</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => {
                onClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        {children}
      </Grid>
    </Dialog>
  );
}
