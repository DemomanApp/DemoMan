import React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import SmallDialog from "./SmallDialog";
import EventTableEntry from "./EventTableEntry";

type EditEventDialogProps = {
  addCallback: (event: EventTableEntry) => void;
  editCallback: (event: EventTableEntry) => void;
  deleteCallback: (event: EventTableEntry) => void;
  ref: React.RefObject<EditEventDialog>;
};

type EditEventDialogState = {
  open: boolean;
  event: EventTableEntry | null;
  isEditing: boolean;
  tickError: boolean;
  valueError: boolean;
  hasUnsavedChanges: boolean;
};

export default class EditEventDialog extends React.Component<
  EditEventDialogProps,
  EditEventDialogState
> {
  constructor(props: EditEventDialogProps) {
    super(props);
    this.state = {
      open: false,
      event: null,
      isEditing: true,
      tickError: false,
      valueError: false,
      hasUnsavedChanges: false,
    };
  }

  setEvent(value: EventTableEntry) {
    // spreading creates a shallow copy of the event
    this.setState({
      event: { id: value.id, event: { ...value.event } },
      tickError: false,
      valueError: false,
    });
  }

  setEditing(value: boolean) {
    this.setState({ isEditing: value, hasUnsavedChanges: !value });
  }

  open = () => {
    this.setState({ open: true });
  };

  save = () => {
    const { event, isEditing, tickError, valueError } = this.state;
    const { editCallback, addCallback } = this.props;
    if (event === null) {
      return;
    }
    if (tickError || valueError) {
      return;
    }
    this.setState({ open: false });
    if (event !== null) {
      (isEditing ? editCallback : addCallback)(event);
    }
  };

  cancel = () => {
    this.setState({ open: false });
  };

  delete = () => {
    const { event } = this.state;
    const { deleteCallback } = this.props;
    if (event === null) {
      return;
    }
    this.setState({ open: false });
    if (event !== null) {
      deleteCallback(event);
    }
  };

  validateTickInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { event } = this.state;
    if (event === null) {
      return;
    }
    event.event.tick = parseInt(e.target.value, 10);
    this.setState({
      tickError: Number.isNaN(event.event.tick),
      event,
      hasUnsavedChanges: true,
    });
  };

  validateValueInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { event } = this.state;
    if (event === null) {
      return;
    }
    event.event.value = e.target.value;
    this.setState({
      valueError: event.event.value.length === 0,
      event,
      hasUnsavedChanges: true,
    });
  };

  render() {
    const { open, event, isEditing, tickError, valueError, hasUnsavedChanges } =
      this.state;

    if (event === null) {
      return null;
    }
    return (
      <SmallDialog
        title={isEditing ? "Edit Event" : "Create Event"}
        open={open}
        onClose={this.cancel}
        actions={
          <>
            {isEditing && (
              <Button
                variant="contained"
                color="secondary"
                onClick={this.delete}
              >
                Delete Event
              </Button>
            )}
            <Button variant="contained" color="primary" onClick={this.cancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.save}
              disabled={!hasUnsavedChanges}
            >
              Save changes
            </Button>
          </>
        }
      >
        <Grid container direction="row" spacing={2} style={{ margin: "8px" }}>
          <Grid item xs={4}>
            <TextField
              required
              id="input-tick"
              label="Tick"
              value={event.event.tick}
              type="number"
              onChange={this.validateTickInput}
              variant="outlined"
              error={tickError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Tick</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              required
              id="input-value"
              label="Value"
              value={event.event.value}
              onChange={this.validateValueInput}
              variant="outlined"
              error={valueError}
              fullWidth
            />
          </Grid>
        </Grid>
      </SmallDialog>
    );
  }
}
