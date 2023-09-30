import { open as dialogOpen } from "@tauri-apps/api/dialog";
import { useNavigate } from "react-router-dom";
import { Button, ScrollArea, Text, TextInput } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

import useStore from "../../hooks/useStore";
import { HeaderButton, HeaderPortal } from "../../AppShell";

import classes from "./settings.module.css";

export default function SettingsView() {
  const navigate = useNavigate();

  const [demoPath, setDemoPath] = useStore("demoPath");

  return (
    <>
      <HeaderPortal
        left={
          <HeaderButton icon={IconChevronLeft} onClick={() => navigate(-1)} />
        }
        center={
          <Text
            fw={500}
            size="lg"
            inline
            style={{ cursor: "default", textAlign: "center" }}
          >
            Settings
          </Text>
        }
      />
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
