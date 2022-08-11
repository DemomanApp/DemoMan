import { Paper, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { Demo } from "../../api";

type DemoListRowProps = {
  demo: Demo;
};

export default function DemoListRow({ demo }: DemoListRowProps) {
  return (
    <Paper
      sx={{
        margin: "16px",
        height: "80px",
        display: "flex",
        alignItems: "stretch",
      }}
      radius="md"
      shadow="lg"
      component={Link}
      to={`/demo/${encodeURIComponent(demo.name)}`}
    >
      <img
        src={`/map_thumbnails/${demo.mapName}.png`}
        style={{
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
        }}
        height={80}
        width={80 * (16 / 9)}
      />
      <Text size="xl">{demo.name}</Text>
    </Paper>
  );
}
