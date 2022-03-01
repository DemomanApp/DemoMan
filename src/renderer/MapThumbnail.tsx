import { shell } from "electron";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import MapThumbnailSources from "./MapThumbnailSources";

type MapThumbnailProps = {
  mapName: string;
};

export default function MapThumbnail(props: MapThumbnailProps) {
  const { mapName } = props;
  const mapThumbnailSource = MapThumbnailSources[mapName];
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
