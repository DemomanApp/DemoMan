import React, { ReactNode } from "react";

import withStyles from "@mui/material/styles/withStyles";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "@mui/material/Zoom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

type FullscreenDialogProps = {
  title: string;
  open: boolean;
  children: ReactNode;
  onClose: () => void;
};

export default function FullscreenDialog(props: FullscreenDialogProps) {
  const { children, title, open, onClose } = props;
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      PaperComponent={withStyles((theme) => ({
        root: {
          backgroundColor: theme.palette.background.default,
        },
      }))(Paper)}
    >
      <Container>
        <Grid container direction="column">
          <Grid
            item
            container
            justify="space-between"
            alignItems="center"
            style={{ height: "64px" }}
          >
            <Grid item>
              <Typography variant="h5">{title}</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          {children}
        </Grid>
      </Container>
    </Dialog>
  );
}
