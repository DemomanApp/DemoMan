import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import StorageIcon from "@mui/icons-material/Storage";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import Demo from "./Demo";
import { formatFileSize, formatPlaybackTime } from "./util";

type DemoMetadataListProps = {
  demo: Demo;
};

export default function DemoMetadataList(props: DemoMetadataListProps) {
  const { demo } = props;
  return (
    <List>
      <Tooltip title="Playback time" placement="left" arrow>
        <ListItem>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText>
            {formatPlaybackTime(demo.playbackTime)} ({demo.numTicks}
            &nbsp;Ticks)
          </ListItemText>
        </ListItem>
      </Tooltip>
      <Tooltip title="Recording date" placement="left" arrow>
        <ListItem>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText>
            {new Date(demo.birthtime).toLocaleString()}
          </ListItemText>
        </ListItem>
      </Tooltip>
      <Tooltip title="Map" placement="left" arrow>
        <ListItem>
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <ListItemText>{demo.mapName}</ListItemText>
        </ListItem>
      </Tooltip>
      <Tooltip title="Player" placement="left" arrow>
        <ListItem>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText>{demo.clientName}</ListItemText>
        </ListItem>
      </Tooltip>
      <Tooltip title="Server" placement="left" arrow>
        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText>{demo.serverName}</ListItemText>
        </ListItem>
      </Tooltip>
      <Tooltip title="File size" placement="left" arrow>
        <ListItem>
          <ListItemIcon>
            <InsertDriveFileIcon />
          </ListItemIcon>
          <ListItemText>{formatFileSize(demo.filesize)}</ListItemText>
        </ListItem>
      </Tooltip>
    </List>
  );
}
