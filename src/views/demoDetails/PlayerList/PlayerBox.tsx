import { Text } from "@mantine/core";
import ClassIcon from "../../../components/ClassIcon";

import { PlayerSummary } from "../../../demo";

export function PlayerBox({ player }: { player: PlayerSummary }) {
  return (
    <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
      <div style={{ width: "50%" }}>
        <Text
          style={{
            paddingLeft: "8px",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {player.name}
        </Text>
      </div>
      <div style={{ flexGrow: 1 }}>
        {player.classes.map((cls, i) => (
          <ClassIcon
            key={cls}
            cls={cls}
            muted={i !== 0}
            size={i !== 0 ? 24 : 32}
          />
        ))}
      </div>
      <div style={{ width: 32, textAlign: "center" }}>{player.kills}</div>
      <div style={{ width: 32, textAlign: "center" }}>{player.assists}</div>
      <div style={{ width: 32, textAlign: "center" }}>{player.deaths}</div>
    </div>
  );
}
