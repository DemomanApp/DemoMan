import { Text } from "@mantine/core";
import ClassIcon from "../../../components/ClassIcon";

import { GameSummary, PlayerSummary } from "../../../demo";

interface PlayerBoxProps {
    player: PlayerSummary;
    selected: boolean;
    onClick: () => void;
}

export function PlayerBox({ player, selected, onClick }: PlayerBoxProps) {
  return (
    <div onClick={ onClick } style={{ height: "40px", display: "flex", alignItems: "center", paddingRight: 8, background: selected ? "#444" : "none" }}>
      <div style={{ width: 32 }}>
        <ClassIcon cls={player.classes[0]} muted={false} size={24} />
      </div>
      <div style={{ flexGrow: 1 }}>
        <Text
          style={{
            paddingLeft: "8px",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontFamily: "Verdana",
          }}
        >
          {player.name}
        </Text>
      </div>
      {/* TODO: Show player's dominations */}
      <div style={{ width: 40, textAlign: "right", fontFamily: "Verdana" }}>{player.scoreboard.points}</div>
      <div style={{ width: 32, textAlign: "right", fontFamily: "Verdana"  }}>{player.scoreboard.kills}</div>
      <div style={{ width: 32, textAlign: "right", fontFamily: "Verdana"  }}>{player.scoreboard.assists}</div>
      <div style={{ width: 32, textAlign: "right", fontFamily: "Verdana"  }}>{player.scoreboard.deaths}</div>
    </div>
  );
}
