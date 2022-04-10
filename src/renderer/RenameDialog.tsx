import { ChangeEvent, useContext, useState } from "react";

import { Button, TextField, InputAdornment } from "@mui/material";

import SmallDialog from "./SmallDialog";
import DemosContext from "./DemosContext";

type RenameDialogProps = {
  onClose: () => void;
  onConfirm: (newName: string) => void;
  oldName: string;
  open: boolean;
};

export default function RenameDialog(props: RenameDialogProps) {
  const { onClose, onConfirm, oldName, open } = props;

  const { getDemoByName } = useContext(DemosContext);

  const [newName, setNewName] = useState(oldName);
  const [newNameValid, setNewNameValid] = useState(true);

  const close = () => {
    // reset state in case the user opens the dialog again
    setNewName(oldName);
    setNewNameValid(true);
    onClose();
  };

  const validateNewName = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (
      // Only allow filenames with legal characters and reasonable length
      /^[a-zA-Z0-9\-_ [\]().]{1,50}$/.test(e.target.value) &&
      // Check if this name is available, but allow the old name
      (getDemoByName(e.target.value) === undefined ||
        e.target.value === oldName)
    ) {
      setNewName(e.target.value);
      setNewNameValid(true);
    } else {
      // TODO Add error message to let the user know what's wrong
      setNewNameValid(false);
    }
  };

  return (
    <SmallDialog
      title="Rename"
      open={open}
      onClose={close}
      actions={
        <>
          <Button variant="contained" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onConfirm(newName);
            }}
            disabled={!newNameValid}
          >
            Confirm
          </Button>
        </>
      }
    >
      <TextField
        required
        label="New name"
        InputProps={{
          endAdornment: <InputAdornment position="end">.dem</InputAdornment>,
        }}
        variant="outlined"
        error={!newNameValid}
        onChange={validateNewName}
        fullWidth
        margin="dense"
        defaultValue={oldName}
      />
    </SmallDialog>
  );
}
