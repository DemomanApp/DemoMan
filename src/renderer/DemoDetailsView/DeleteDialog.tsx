import { Button, DialogContentText } from "@mui/material";

import SmallDialog from "../SmallDialog";
import SplitButton from "../SplitButton";

type DeleteDialogProps = {
  open: boolean;
  demoName: string;
  onClose: () => void;
  onConfirm: (trash: boolean) => void;
};

export default function DeleteDialog(props: DeleteDialogProps) {
  const { open, demoName, onClose, onConfirm } = props;

  return (
    <SmallDialog
      title="Confirm delete"
      open={open}
      onClose={onClose}
      actions={
        <>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <SplitButton
            options={[
              {
                label: "Move to trash",
                onClick: () => onConfirm(true),
              },
              {
                label: "Delete permanently",
                onClick: () => onConfirm(false),
              },
            ]}
            variant="contained"
            color="secondary"
            sx={{
              marginLeft: "8px",
            }}
          />
        </>
      }
    >
      <DialogContentText>
        Are you sure you want to permanently delete <b>{demoName}</b> and all
        associated events and tags?
      </DialogContentText>
    </SmallDialog>
  );
}
