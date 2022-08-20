import { shell } from "electron";

import { Button, Paper, Stack } from "@mui/material";

import MapThumbnailSources from "./MapThumbnailSources";
import { normalizeMapName } from "../util";

type MapThumbnailProps = {
  mapName: string;
};

export default function MapThumbnail(props: MapThumbnailProps) {
  const { mapName } = props;
  const mapThumbnailSource = MapThumbnailSources[normalizeMapName(mapName)];
  return (
    <Paper
      style={{
        width: "320px",
        height: "180px",
      }}
      elevation={3}
    >
      {mapThumbnailSource === undefined ? (
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
          src={mapThumbnailSource}
          alt={mapName}
          width="320px"
          height="180px"
          style={{ borderRadius: "inherit" }}
        />
      )}
    </Paper>
  );
}
