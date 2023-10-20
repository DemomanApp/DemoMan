import { Text } from "@mantine/core";

import { MapThumbnail } from "@/components";

import classes from "./MapBox.module.css";

export default function MapBox({ mapName }: { mapName: string }) {
  return (
    <div className={classes.wrapper}>
      <MapThumbnail
        mapName={mapName}
        className={classes.img}
        fallback={
          <div className={classes.imgFallback}>
            <Text c="dimmed" style={{ textAlign: "center" }}>
              No thumbnail
              <br />
              available.
            </Text>
          </div>
        }
      />
      <div className={classes.textBox}>
        <Text c="dimmed" className={classes.text} fw={600}>
          {mapName}
        </Text>
      </div>
    </div>
  );
}
