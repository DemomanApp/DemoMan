import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import MapIcon from "@material-ui/icons/Map";
import PersonIcon from "@material-ui/icons/Person";
import StorageIcon from "@material-ui/icons/Storage";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

import { Demo } from "./Demos";
import { DemoHeader } from "./DemoHeader";
import { formatFileSize, formatPlaybackTime } from "./util";

type DemoDetailsListProps = {
  demo: Demo;
  demoHeader: DemoHeader;
};

export default function DemoDetailsList(props: DemoDetailsListProps) {
  const { demo, demoHeader } = props;
  return (
    <List>
      <Tooltip title="Playback time" placement="left" arrow>
        <ListItem>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText>
            {formatPlaybackTime(demoHeader.playbackTime)} ({demoHeader.numTicks}
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
          <ListItemText>{demoHeader.mapName}</ListItemText>
        </ListItem>
      </Tooltip>
      <Tooltip title="Player" placement="left" arrow>
        <ListItem>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText>{demoHeader.clientName}</ListItemText>
        </ListItem>
      </Tooltip>
      <Tooltip title="Server" placement="left" arrow>
        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText>{demoHeader.serverName}</ListItemText>
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
