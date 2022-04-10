import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  Map as MapIcon,
  Person as PersonIcon,
  Storage as StorageIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from "@mui/icons-material";

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
