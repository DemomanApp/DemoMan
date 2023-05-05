import useStore from "../../hooks/useStore";
import {
  Button,
  createStyles,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import { open as dialogOpen } from "@tauri-apps/api/dialog";
import { HeaderPortal } from "../../AppShell";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100%",
  },
  row: {
    display: "flex",
    gap: theme.spacing.xs,
  },
  rowLabel: {
    width: 160,
    fontSize: "16pt",
  },
  viewport: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
    margin: theme.spacing.sm,
  },
}));

export default function SettingsView() {
  const [demoPath, setDemoPath] = useStore("demoPath");

  const { classes } = useStyles();

  return (
    <>
      <HeaderPortal>
        <Text
          align="center"
          weight={500}
          size="lg"
          inline
          style={{ cursor: "default" }}
          data-tauri-drag-region
        >
          Settings
        </Text>
      </HeaderPortal>
      <ScrollArea classNames={{ root: classes.root }}>
        <div className={classes.viewport}>
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
        </div>
      </ScrollArea>
    </>
  );
}
