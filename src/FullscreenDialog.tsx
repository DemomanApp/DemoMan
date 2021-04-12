import React, { ReactNode } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Zoom from "@material-ui/core/Zoom";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

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
          <Grid item style={{ padding: "24px" }}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </Dialog>
  );
}
