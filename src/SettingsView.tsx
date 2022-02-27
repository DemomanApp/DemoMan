import React, { useContext } from "react";
import { ipcRenderer } from "electron";
import { useNavigate } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FolderIcon from "@mui/icons-material/Folder";
import PaletteIcon from "@mui/icons-material/Palette";
import DarkThemeIcon from "@mui/icons-material/Brightness3";
import LightThemeIcon from "@mui/icons-material/Brightness7";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import getDemoPath from "./GetDemoPath";
import PageLayout from "./PageLayout";
import AppBarButton from "./AppBarButton";
import DemosContext from "./DemosContext";
import ThemeContext from "./ThemeContext";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function SettingsView() {
  const navigate = useNavigate();
  const { demosPath, setDemoPath, reloadEverything } = useContext(DemosContext);
  const { theme, setTheme } = useContext(ThemeContext);

  const savePath = (newPath: string) => {
    setDemoPath(newPath);
    reloadEverything();
  };

  const saveTheme = (newTheme: string) => {
    setTheme(newTheme);
    ipcRenderer.send("update-theme", newTheme);
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      saveTheme("light");
    } else {
      saveTheme("dark");
    }
  };

  return (
    <>
      <PageLayout
        left={
          <AppBarButton
            icon={<ArrowBackIcon />}
            tooltip="Go back"
            onClick={() => navigate(-1)}
          />
        }
        center={<Typography variant="h5">Settings</Typography>}
      >
        <Container>
          <List>
            <ListItem button divider onClick={toggleTheme}>
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>
              <ListItemText primary="Theme" secondary={capitalize(theme)} />
              <LightThemeIcon />
              <Switch onChange={toggleTheme} checked={theme === "dark"} />
              <DarkThemeIcon />
            </ListItem>
            <ListItem
              button
              onClick={async () => {
                const { canceled, filePaths } = await getDemoPath(demosPath);
                if (!canceled) {
                  savePath(filePaths[0]);
                }
              }}
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Demo path" secondary={demosPath} />
            </ListItem>
          </List>
        </Container>
      </PageLayout>
    </>
  );
}
