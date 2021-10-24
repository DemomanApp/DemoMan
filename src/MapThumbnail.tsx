import React from "react";
import { shell } from "electron";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

type MapThumbnailProps = {
  mapName: string;
};

export default function MapThumbnail(props: MapThumbnailProps) {
  const { mapName } = props;
  const [loadFailed, setLoadFailed] = React.useState(false);

  return (
    <Paper
      style={{
        width: "320px",
        height: "180px",
      }}
      elevation={3}
    >
      {loadFailed ? (
        <Stack alignItems="center" justifyContent="center" height="100%">
          <span>No thumbnail available.</span>
          <Button
            variant="text"
            onClick={() => {
              shell.openExternal(
                "https://github.com/Narcha/DemoMan/wiki/Contributing-a-map-thumbnail"
              );
            }}
          >
            Contribute
          </Button>
        </Stack>
      ) : (
        <img
          src={`../assets/map_thumbnails/${mapName}.png`}
          alt={mapName}
          width="320px"
          height="180px"
          onError={() => {
            setLoadFailed(true);
          }}
          style={{ borderRadius: "inherit" }}
        />
      )}
    </Paper>
  );
}
