import useStore from "../../hooks/useStore";
import { Button, createStyles, ScrollArea, TextInput } from "@mantine/core";
import { open as dialogOpen } from "@tauri-apps/api/dialog";

const useStyles = createStyles({
  root: {
    margin: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
  },
  rowLabel: {
    width: 160,
    fontSize: "16pt",
  },
});

export default function SettingsView() {
  const [demoPath, setDemoPath] = useStore("demoPath");

  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <h1>Settings</h1>

      <ScrollArea.Autosize maxHeight={400}>
        <span className={classes.row}>
          <span className={classes.rowLabel}>
            <label>Demos Folder</label>
          </span>
          <Button
            onClick={() => {
              dialogOpen({
                directory: true,
                defaultPath: demoPath,
                title: "Select Demo Storage Folder",
              })
                .then((value) => {
                  if (value !== null && value !== "") {
                    // Don't set the path if the user cancelled the dialog
                    setDemoPath(value as string);
                  }
                  return;
                })
                .catch((error) => console.error(error));
            }}
          >
            Select a folder...
          </Button>
          <TextInput value={demoPath ?? ""} disabled={true}></TextInput>
        </span>
      </ScrollArea.Autosize>
    </div>
  );
}
