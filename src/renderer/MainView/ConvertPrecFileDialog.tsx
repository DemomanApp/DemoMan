import { useContext } from "react";

import { Button } from "@mui/material";

import SmallDialog from "../SmallDialog";
import { convertPrecEvents } from "../PrecConversion";
import DemosContext from "../DemosContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default (props: Props) => {
  const { open, onClose } = props;
  const { reloadEvents } = useContext(DemosContext);

  return (
    <SmallDialog
      open={open}
      onClose={onClose}
      title="Convert P-REC file"
      actions={
        <>
          <Button onClick={onClose} variant="text">
            Cancel
          </Button>
          <Button
            onClick={() => {
              convertPrecEvents();
              reloadEvents();
              onClose();
            }}
            variant="contained"
          >
            Convert
          </Button>
        </>
      }
    >
      This will convert the events in the P-REC <code>KillStreaks.txt</code>{" "}
      file into the native format used by TF2. An events file will only be
      created if a demo with that name exists, and it will not overwrite
      existing files. The App will hang until the process is complete.
    </SmallDialog>
  );
};
