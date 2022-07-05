import React, { useState } from "react";

import { Button, DialogContentText, IconButton } from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";

import SmallDialog from "./SmallDialog";

type HelpButtonProps = {
  helpText: string;
};

const stopPropagation = (event: React.MouseEvent | React.KeyboardEvent) =>
  event.stopPropagation();

export default (props: HelpButtonProps) => {
  const { helpText } = props;

  const [open, setOpen] = useState(false);

  return (
    // This wrapper prevents mouse clicks in the popup from triggering
    // click handlers on the parent
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onMouseUp={stopPropagation}
      onKeyDown={stopPropagation}
    >
      <IconButton
        onClick={() => {
          setOpen(true);
        }}
      >
        <HelpIcon />
      </IconButton>
      <SmallDialog
        title="Help"
        open={open}
        onClose={() => setOpen(false)}
        actions={
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        }
      >
        <DialogContentText>{helpText}</DialogContentText>
      </SmallDialog>
    </div>
  );
};
