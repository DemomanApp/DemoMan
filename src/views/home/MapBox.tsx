import { createStyles, Text } from "@mantine/core";

import { MapThumbnail } from "../../components";

const useStyles = createStyles((theme) => {
  const totalHeight = 120;
  const textBoxHeight = 24;
  const imageAspectRatio = 16 / 9;
  const width = (totalHeight - textBoxHeight) * imageAspectRatio;
  const border = `1px solid ${
    theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
  }`;
  return {
    wrapper: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    img: {
      height: totalHeight - textBoxHeight,
      width,
    },
    imgFallback: {
      height: totalHeight - textBoxHeight,
      width,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRight: border,
      borderBottom: border,
    },
    textBox: {
      height: textBoxHeight,
      borderRight: border,
    },
    text: { overflow: "hidden", textOverflow: "ellipsis", maxWidth: width },
  };
});

export default function MapBox({ mapName }: { mapName: string }) {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <MapThumbnail
        mapName={mapName}
        className={classes.img}
        fallback={
          <div className={classes.imgFallback}>
            <Text color="dimmed" align="center">
              No thumbnail
              <br />
              available.
            </Text>
          </div>
        }
      />
      <div className={classes.textBox}>
        <Text
          color="dimmed"
          align="center"
          className={classes.text}
          weight={600}
        >
          {mapName}
        </Text>
      </div>
    </div>
  );
}
