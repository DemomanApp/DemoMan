import { useEffect, useState } from "react";
import fs from "fs";
import path from "path";

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
import useStore from "./hooks/useStore";

type AutoDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
};

type AutoDeleteDialogFileListEntry = {
  fileName: string;
  selected: boolean;
  filesize: number;
};

function findFilesWithoutCounterpart(dirPath: string) {
  const files = fs.readdirSync(dirPath);
  const filesWithoutCounterpart: string[] = [];

  files.forEach((file) => {
    let counterpart: string;
    if (file.endsWith(".dem")) {
      counterpart = file.replace(/\.dem$/, ".json");
    } else if (file.endsWith(".json")) {
      counterpart = file.replace(/\.json$/, ".dem");
    } else return;
    const counterpartIndex = files.indexOf(counterpart);
    if (counterpartIndex === -1) {
      filesWithoutCounterpart.push(file);
    }
  });
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

export default function AutoDeleteDialog(props: AutoDeleteDialogProps) {
  const { open, onClose } = props;
  const [demosPath] = useStore("demo_path");

  const [files, setFiles] = useState<AutoDeleteDialogFileListEntry[]>([]);
  const [numberSelected, setNumberSelected] = useState(0);

  useEffect(() => {
    const newFiles = findFilesWithoutCounterpart(demosPath);
    const fileListEntries = newFiles.map<AutoDeleteDialogFileListEntry>(
      (file) => {
        const filesize = fs.statSync(path.join(demosPath, file)).size;
        return { fileName: file, selected: true, filesize };
      }
    );
    setFiles(fileListEntries);
    setNumberSelected(files.length);
  }, [open, demosPath, files.length]);

  const confirm = () => {
    files
      .filter((listEntry: AutoDeleteDialogFileListEntry) => listEntry.selected)
      .map((listEntry: AutoDeleteDialogFileListEntry) =>
        fs.rmSync(path.join(demosPath, listEntry.fileName))
      );
    onClose();
  };

  const handleSelect = (index: number) => {
    files[index].selected = true;
    setFiles(files);
    setNumberSelected(numberSelected + 1);
  };

  const handleDeselect = (index: number) => {
    files[index].selected = false;
    setFiles(files);
    setNumberSelected(numberSelected - 1);
  };

  const selectAll = () => {
    for (let i = 0; i < files.length; i += 1) {
      files[i].selected = true;
    }
    setFiles(files);
    setNumberSelected(files.length);
  };

  const deselectAll = () => {
    for (let i = 0; i < files.length; i += 1) {
      files[i].selected = false;
    }
    setFiles(files);
    setNumberSelected(0);
  };

  const selectedFilesize = () => {
    return files.reduce<number>(
      (sum, f) => (f.selected ? sum + f.filesize : sum),
      0
    );
  };

  if (files.length === 0) {
    return (
      <SmallDialog
        title="Auto-delete files"
        open={open}
        onClose={onClose}
        actions={
          <Button onClick={onClose} variant="contained">
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
      onClose={onClose}
      actions={
        <>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={confirm}
            disabled={numberSelected === 0}
          >
            Delete selected
          </Button>
        </>
      }
    >
      <DialogContentText>
        These are demo files without events or event files without an associated
        demo file.
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
                  numberSelected === files.length ? deselectAll : selectAll
                }
              />
            </ListItemIcon>
            <ListItemText
              primary={`${numberSelected} files selected (${formatFileSize(
                selectedFilesize()
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
                (file.selected ? handleDeselect : handleSelect)(index);
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
