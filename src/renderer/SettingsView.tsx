import { useContext } from "react";
import { ipcRenderer } from "electron";
import { useNavigate } from "react-router-dom";

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Typography,
  Container,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Palette as PaletteIcon,
  ArrowBackIosNew as ArrowBackIcon,
  UploadFile as UploadFileIcon,
  MenuBook,
} from "@mui/icons-material";

import getDemoPath from "./GetDemoPath";
import PageLayout from "./PageLayout";
import AppBarButton from "./AppBarButton";
import ThemeContext from "./ThemeContext";
import useStore from "./hooks/useStore";
import { ThemeType } from "./theme";
import HelpButton from "./HelpButton";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function SettingsView() {
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);

  const [demoPath, setDemoPath] = useStore("demo_path");
  const [autoPrec, setAutoPrec] = useStore("auto_prec");
  const [pagination, setPagination] = useStore("pagination");

  const savePath = (newPath: string) => {
    setDemoPath(newPath);
  };

  const saveTheme = (newTheme: ThemeType) => {
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
            </ListItem>
            <ListItem
              button
              divider
              onClick={async () => {
                const { canceled, filePaths } = await getDemoPath(demoPath);
                if (!canceled) {
                  savePath(filePaths[0]);
                }
              }}
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Demo path" secondary={demoPath} />
            </ListItem>
            <ListItem button onClick={() => setAutoPrec(!autoPrec)}>
              <ListItemIcon>
                <UploadFileIcon />
              </ListItemIcon>
              <ListItemText
                primary="Automatic P-REC event loading"
                secondary={autoPrec ? "on" : "off"}
              />
              <HelpButton
                helpText={
                  'With this option enabled, DemoMan will automatically \
                  search your demo directory for a file called "KillStreaks.txt" \
                  and attempt to load bookmarks from it. \
                  This is useful if you use P-REC. \
                  The file will never be altered.'
                }
              />
              <Switch
                onChange={() => setAutoPrec(!autoPrec)}
                checked={autoPrec}
              />
            </ListItem>
            <ListItem button onClick={() => setPagination(!pagination)}>
              <ListItemIcon>
                <MenuBook />
              </ListItemIcon>
              <ListItemText
                primary="Pagination"
                secondary={pagination ? "on" : "off"}
              />
              <Switch
                onChange={() => setPagination(!pagination)}
                checked={pagination}
              />
            </ListItem>
          </List>
        </Container>
      </PageLayout>
    </>
  );
}
