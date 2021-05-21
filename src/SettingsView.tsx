import React from "react";
import { ipcRenderer } from "electron";
import cfg from "electron-cfg";
import log from "electron-log";

import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { GetDemoPath } from "./GetDemoPath";
import SmallDialog from "./SmallDialog";

type SettingsViewState = {
  open: boolean;
  unsavedChanges: { [key: string]: unknown };
};

export default class SettingsView extends React.Component<
  Readonly<unknown>,
  SettingsViewState
> {
  constructor(props: Readonly<unknown>) {
    super(props);
    this.state = { open: false, unsavedChanges: {} };
  }

  setOpen(value: boolean) {
    this.setState({ open: value });
  }

  cancel = () => {
    this.setState({
      unsavedChanges: {},
      open: false,
    });
  };

  render() {
    const { open, unsavedChanges } = this.state;
    const themeSetting = cfg.get("theme");
    return (
      <SmallDialog
        open={open}
        title="Settings"
        onClose={() => {
          this.setOpen(false);
        }}
      >
        <Grid item container direction="column" justify="space-between">
          <Grid
            item
            container
            justify="space-between"
            alignItems="center"
            style={{ margin: "8px 0px" }}
          >
            <Grid item>
              <Typography variant="body1">Theme</Typography>
            </Grid>
            <Grid item>
              <Select
                defaultValue={themeSetting}
                onChange={(event) => {
                  const newTheme = event.target.value;
                  this.setState({
                    unsavedChanges: {
                      ...unsavedChanges,
                      theme: newTheme,
                    },
                  });
                }}
              >
                <MenuItem value="system">Follow system theme</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="light">Light</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid
            item
            container
            justify="space-between"
            alignItems="center"
            style={{ margin: "8px 0px" }}
          >
            <Grid item>
              <Typography variant="body1">Demo path</Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  const newPath = GetDemoPath(cfg.get("demo_path"));
                  if (newPath !== undefined) {
                    this.setState({
                      unsavedChanges: {
                        ...unsavedChanges,
                        demo_path: newPath,
                      },
                    });
                  }
                }}
                variant="outlined"
              >
                Choose...
              </Button>
            </Grid>
          </Grid>
          <Grid item container justify="flex-end">
            <Grid item style={{ marginTop: "8px" }}>
              <Button
                variant="outlined"
                onClick={this.cancel}
                style={{ marginRight: "16px" }}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                disabled={Object.entries(unsavedChanges).length === 0}
                onClick={() => {
                  Object.entries(unsavedChanges).forEach(([key, value]) => {
                    log.debug(`Applying settings change: ${key} -> ${value}`);
                    cfg.set(key, value);
                    if (key === "theme") {
                      ipcRenderer.send("update-theme", value);
                    }
                  });
                  window.location.reload();
                }}
              >
                Save changes
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </SmallDialog>
    );
  }
}
