import React from "react";
import { ipcRenderer } from "electron";
import cfg from "electron-cfg";
import log from "electron-log";

import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Menu from "@material-ui/core/Menu";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FolderIcon from "@material-ui/icons/Folder";
import PaletteIcon from "@material-ui/icons/Palette";
import DarkThemeIcon from "@material-ui/icons/Brightness3";
import LightThemeIcon from "@material-ui/icons/Brightness7";
import SystemThemeIcon from "@material-ui/icons/SettingsApplications";

import { GetDemoPath } from "./GetDemoPath";
import SmallDialog from "./SmallDialog";

type SettingsViewState = {
  open: boolean;
  themePickerAnchor: HTMLElement | null;
  settings: {
    theme: string;
    demo_path: string;
  };
  settingsChanged: boolean;
};

const ThemeNames: { [key: string]: string } = {
  dark: "Dark",
  light: "Light",
  system: "Follow system theme",
};

const ThemeIcons: { [key: string]: JSX.Element } = {
  dark: <DarkThemeIcon />,
  light: <LightThemeIcon />,
  system: <SystemThemeIcon />,
};

export default class SettingsDialog extends React.Component<
  Readonly<unknown>,
  SettingsViewState
> {
  constructor(props: Readonly<unknown>) {
    super(props);
    this.state = {
      open: false,
      settings: {
        // Placeholders to make TS happy.
        // They shouldn't cause any issues, as they are overwritten when
        // the settings dialog is opened.
        theme: "",
        demo_path: "",
      },
      settingsChanged: false,
      themePickerAnchor: null,
    };
  }

  open = () => {
    this.setState({
      open: true,
      settings: {
        theme: cfg.get("theme"),
        demo_path: cfg.get("demo_path"),
      },
      settingsChanged: false,
    });
  };

  close = () => {
    this.setState({ open: false });
  };

  selectTheme = (newTheme: string) => {
    const { settings } = this.state;
    if (newTheme !== settings.theme) {
      this.setState({
        settings: {
          ...settings,
          theme: newTheme,
        },
        themePickerAnchor: null,
        settingsChanged: true,
      });
    } else {
      this.setState({
        themePickerAnchor: null,
      });
    }
  };

  render() {
    const { open, themePickerAnchor, settings, settingsChanged } = this.state;
    return (
      <>
        <SmallDialog
          open={open}
          title="Settings"
          maxWidth="sm"
          onClose={this.close}
          actions={
            <>
              <Button variant="contained" onClick={this.close}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!settingsChanged}
                onClick={() => {
                  log.debug(`Applying settings: ${settings}`);
                  cfg.setAll(settings);
                  ipcRenderer.send("update-theme", settings.theme);
                  window.location.reload();
                }}
              >
                Save changes
              </Button>
            </>
          }
        >
          <List>
            <ListItem
              button
              divider
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                this.setState({ themePickerAnchor: event.currentTarget });
              }}
            >
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>
              <ListItemText
                primary="Theme"
                secondary={ThemeNames[settings.theme]}
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                const newPath = GetDemoPath(settings.demo_path);
                if (newPath !== undefined && newPath !== settings.demo_path) {
                  this.setState({
                    settings: {
                      ...settings,
                      demo_path: newPath,
                    },
                    settingsChanged: true,
                  });
                }
              }}
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary="Demo path"
                secondary={settings.demo_path}
              />
            </ListItem>
          </List>
          <Menu
            anchorEl={themePickerAnchor}
            open={themePickerAnchor !== null}
            keepMounted
            onClose={() => {
              this.setState({ themePickerAnchor: null });
            }}
            PaperProps={{
              style: { border: "1px solid rgba(255, 255, 255, 0.23)" },
            }}
          >
            {Object.keys(ThemeNames).map((key) => (
              <MenuItem
                key={key}
                selected={settings.theme === key}
                onClick={() => this.selectTheme(key)}
              >
                <ListItemIcon>{ThemeIcons[key]}</ListItemIcon>
                <ListItemText>{ThemeNames[key]}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </SmallDialog>
      </>
    );
  }
}
