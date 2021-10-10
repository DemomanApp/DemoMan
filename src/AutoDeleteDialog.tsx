import React from "react";
import fs from "fs";
import path from "path";
import cfg from "electron-cfg";
import log from "electron-log";

import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import DialogContentText from "@mui/material/DialogContentText";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import styled from "@mui/material/styles/styled";

import { formatFileSize } from "./util";
import SmallDialog from "./SmallDialog";

type AutoDeleteDialogProps = {
  ref: React.RefObject<AutoDeleteDialog>;
  onClose: () => void;
};

type AutoDeleteDialogState = {
  files: AutoDeleteDialogFileListEntry[] | null;
  open: boolean;
  numberSelected: number;
};

type AutoDeleteDialogFileListEntry = {
  fileName: string;
  selected: boolean;
  filesize: number;
};

async function findFilesWithoutCounterpart() {
  const demoDir = cfg.get("demo_path");
  log.info(`Finding demos with no events in ${demoDir}`);
  const files = await fs.promises.readdir(demoDir);

  const filesWithoutCounterpart: string[] = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    let counterpart;
    if (file.endsWith(".dem")) {
      counterpart = file.replace(/\.dem$/, ".json");
      const counterpartIndex = filesWithoutCounterpart.indexOf(counterpart);
      if (counterpartIndex !== -1) {
        filesWithoutCounterpart.splice(counterpartIndex, 1);
      } else {
        filesWithoutCounterpart.push(file);
      }
    } else if (file.endsWith(".json")) {
      counterpart = file.replace(/\.json$/, ".dem");
      const counterpartIndex = filesWithoutCounterpart.indexOf(counterpart);
      if (counterpartIndex !== -1) {
        filesWithoutCounterpart.splice(counterpartIndex, 1);
      } else {
        filesWithoutCounterpart.push(file);
      }
    }
  }
  return filesWithoutCounterpart;
}

const ScrollList = styled(List)({
  overflow: "overlay",
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#ccc",
    borderRadius: "8px",
    border: "4px solid transparent",
    backgroundClip: "content-box",
    minHeight: "64px",
  },
  "&::-webkit-scrollbar": {
    width: "16px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#999",
  },
});

export default class AutoDeleteDialog extends React.Component<
  AutoDeleteDialogProps,
  AutoDeleteDialogState
> {
  constructor(props: AutoDeleteDialogProps) {
    super(props);
    this.state = {
      files: null,
      open: false,
      numberSelected: 0,
    };
  }

  close = () => {
    const { onClose } = this.props;
    this.setState({
      open: false,
    });
    onClose();
  };

  open = async () => {
    const files = await findFilesWithoutCounterpart();
    const demoDir = cfg.get("demo_path");
    const fileListEntries = files.map<AutoDeleteDialogFileListEntry>((file) => {
      const filesize = fs.statSync(path.join(demoDir, file)).size;
      return { fileName: file, selected: true, filesize };
    });
    this.setState({
      files: fileListEntries,
      open: true,
      numberSelected: files.length,
    });
  };

  confirm = () => {
    const { files } = this.state;
    if (files === null) {
      return;
    }
    const demoDir = cfg.get("demo_path");
    files
      .filter((listEntry: AutoDeleteDialogFileListEntry) => listEntry.selected)
      .map((listEntry: AutoDeleteDialogFileListEntry) =>
        fs.rmSync(path.join(demoDir, listEntry.fileName))
      );
    this.close();
  };

  handleSelect = (index: number) => {
    const { files, numberSelected } = this.state;
    if (files === null) {
      return;
    }
    files[index].selected = true;
    this.setState({
      files,
      numberSelected: numberSelected + 1,
    });
  };

  handleDeselect = (index: number) => {
    const { files, numberSelected } = this.state;
    if (files === null) {
      return;
    }
    files[index].selected = false;
    this.setState({
      files,
      numberSelected: numberSelected - 1,
    });
  };

  selectAll = () => {
    const { files } = this.state;
    if (files === null) {
      return;
    }
    for (let i = 0; i < files.length; i += 1) {
      files[i].selected = true;
    }
    this.setState({
      files,
      numberSelected: files.length,
    });
  };

  deselectAll = () => {
    const { files } = this.state;
    if (files === null) {
      return;
    }
    for (let i = 0; i < files.length; i += 1) {
      files[i].selected = false;
    }
    this.setState({
      files,
      numberSelected: 0,
    });
  };

  selectedFilesize = () => {
    const { files } = this.state;
    if (files === null) {
      return 0;
    }
    return files.reduce<number>(
      (sum, f) => (f.selected ? sum + f.filesize : sum),
      0
    );
  };

  render() {
    const { open, files, numberSelected } = this.state;
    if (files === null) {
      return null;
    }
    if (files.length === 0) {
      return (
        <SmallDialog
          title="Auto-delete files"
          open={open}
          onClose={this.close}
          actions={
            <Button onClick={this.close} variant="contained">
              Close
            </Button>
          }
        >
          <DialogContentText>
            There are no files to auto-delete.
          </DialogContentText>
        </SmallDialog>
      );
    }
    return (
      <SmallDialog
        title="Auto-delete files"
        open={open}
        onClose={this.close}
        actions={
          <>
            <Button variant="contained" onClick={this.close}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.confirm}
              disabled={numberSelected === 0}
            >
              Delete selected
            </Button>
          </>
        }
      >
        <DialogContentText>
          These are demo files without events or event files without an
          associated demo file.
          <br />
          Deselect the ones you want to keep.
        </DialogContentText>
        <Paper variant="outlined">
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  checked={numberSelected === files.length}
                  indeterminate={
                    numberSelected !== 0 && numberSelected !== files.length
                  }
                  disableRipple
                  onChange={
                    numberSelected === files.length
                      ? this.deselectAll
                      : this.selectAll
                  }
                />
              </ListItemIcon>
              <ListItemText
                primary={`${numberSelected} files selected (${formatFileSize(
                  this.selectedFilesize()
                )})`}
              />
            </ListItem>
          </List>
          <Divider />
          <ScrollList style={{ maxHeight: "200px" }} dense>
            {files.map((file, index) => (
              <ListItem
                button
                onClick={() => {
                  (file.selected ? this.handleDeselect : this.handleSelect)(
                    index
                  );
                }}
                key={file.fileName}
              >
                <ListItemIcon>
                  <Checkbox checked={file.selected} disableRipple />
                </ListItemIcon>
                <ListItemText primary={file.fileName} />
              </ListItem>
            ))}
          </ScrollList>
        </Paper>
      </SmallDialog>
    );
  }
}
