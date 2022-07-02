import { ChangeEvent, useState } from "react";

import { Grid, Button, TextField, InputAdornment } from "@mui/material";

import SmallDialog from "../SmallDialog";

export enum EditDialogMode {
  closed,
  edit,
  add,
}

type EditEventDialogProps = {
  tickInput: string;
  valueInput: string;
  onTickChanged: (newTick: string) => void;
  onValueChanged: (newValue: string) => void;
  mode: EditDialogMode;
  onClose: () => void;
  onDelete: () => void;
  onConfirm: () => void;
};

export default (props: EditEventDialogProps) => {
  const {
    tickInput,
    valueInput,
    onTickChanged,
    onValueChanged,
    mode,
    onClose,
    onDelete,
    onConfirm,
  } = props;

  const [tickError, setTickError] = useState(false);
  const [valueError, setValueError] = useState(false);

  const validateTickInput = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const parsedInt = parseInt(e.target.value, 10);
    setTickError(Number.isNaN(parsedInt) || parsedInt < 0);
    onTickChanged(e.target.value);
  };

  const validateValueInput = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setValueError(e.target.value.length === 0);
    onValueChanged(e.target.value);
  };

  return (
    <SmallDialog
      title={mode === EditDialogMode.edit ? "Edit Event" : "Add Event"}
      open={mode !== EditDialogMode.closed}
      onClose={onClose}
      actions={
        <>
          {/* Only include the "delete" button on existing events */}
          {mode === EditDialogMode.edit && (
            <Button variant="contained" color="secondary" onClick={onDelete}>
              Delete Event
            </Button>
          )}
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            disabled={tickError || valueError}
          >
            {mode === EditDialogMode.edit ? "Save Changes" : "Create Event"}
          </Button>
        </>
      }
      maxWidth="sm"
    >
      <Grid container direction="row" spacing={2}>
        <Grid item xs={4}>
          <TextField
            required
            label="Tick"
            value={tickInput}
            type="number"
            onChange={validateTickInput}
            variant="outlined"
            error={tickError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Tick</InputAdornment>
              ),
            }}
            margin="dense"
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            required
            label="Value"
            value={valueInput}
            onChange={validateValueInput}
            variant="outlined"
            error={valueError}
            fullWidth
            margin="dense"
          />
        </Grid>
      </Grid>
    </SmallDialog>
  );
};
