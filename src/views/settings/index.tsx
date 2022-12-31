import { Link } from "react-router-dom";
import useStore from "../../hooks/useStore";
import { Button, createStyles, TextInput } from "@mantine/core";
import { fs } from "@tauri-apps/api";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    margin: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  }
}));

export default function SettingsView() {
  const [demoPath, setDemoPath] = useStore("demoPath");
  const [validPath, setValidPath] = useState(true);

  const { classes } = useStyles();

  return (
    <div className={ classes.root }>
      <h1>Settings</h1>

      <TextInput
        label={ "Demos Folder" }
        // Let's be honest, most users will be on Windows
        placeholder={ "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Team Fortress 2\\tf\\demos" }
        error={ validPath ? undefined : "Directory does not exist!" }
        defaultValue={demoPath}
        onChange={ (event) => {
          const dirPath = event.target.value;
          if (dirPath.length === 0) {
            setValidPath(true);
          } else {
            // fs doesn't have a way to check if the directory exists, so dirPath may point to a file and we'll
            // still accept it
            fs.exists(dirPath)
              .then((result) => {
                if (result as unknown as boolean) {
                  setDemoPath(dirPath);
                  setValidPath(true);
                } else {
                  setValidPath(false);
                }
                return;
              })
              .catch((err) => {
                console.log(`Given directory ${ dirPath } does not exist!`, err);
                setValidPath(false);
              });
          }
        } }
      />

      <div>
        <Link to={"/"}>
          <Button>
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
