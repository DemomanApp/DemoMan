import {
  Anchor,
  Button,
  Indicator,
  IndicatorProps,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { useContext } from "react";
import { HeaderButton } from ".";
import { IconHelp, IconPlug, IconTool } from "@tabler/icons-react";

import { RconContext, RconState } from "@/RconContext";
import { Link } from "react-router-dom";

function helpText(rconState: RconState) {
  switch (rconState.status) {
    case "connected":
      return "Successfully connected to TF2.";
    case "setup required":
      return "Set up RCON first.";
    case "connection error":
      return "Make sure TF2 is running and has the correct launch options set.";
    case "unexpected response":
      return "The RCON server returned an unexpected response.";
    case "unknown":
      return "RCON connection not yet tested";
  }
}

function indicatorColor(rconState: RconState): IndicatorProps["color"] {
  switch (rconState.status) {
    case "connected":
      return "green";
    case "setup required":
      return "red";
    case "connection error":
      return "orange";
    case "unexpected response":
      return "red";
    case "unknown":
      return undefined;
  }
}

export default function RconStateIndicator() {
  const rconState = useContext(RconContext);

  return (
    <Popover
      shadow="md"
      position="bottom-start"
      transitionProps={{
        transition: "pop-top-left",
      }}
      withArrow
      arrowPosition="center"
      arrowSize={12}
    >
      <Popover.Target>
        <HeaderButton>
          <Indicator
            color={indicatorColor(rconState)}
            position="bottom-end"
            style={{
              // Without hard-coding the size, the indicator affects the layout
              // of the icon inside the button :/
              height: 24,
              width: 24,
            }}
          >
            <IconPlug />
          </Indicator>
        </HeaderButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack align="center">
          <div>
            <Text size="lg" fw="bold">
              RCON status: {rconState.status}
            </Text>
          </div>
          {rconState.status === "connection error" && (
            <Text>Reason: {rconState.reason}</Text>
          )}
          <Text c="dimmed">{helpText(rconState)}</Text>
          {(rconState.status === "setup required" ||
            rconState.status === "connection error") && (
            <div>
              <Button
                leftSection={<IconTool />}
                component={Link}
                to="/rcon-setup"
              >
                Set up RCON
              </Button>
            </div>
          )}
          <Anchor
            href="https://github.com/DemomanApp/DemoMan/wiki/All-about-the-RCON-connection-feature"
            target="_blank"
            size="sm"
            c="dimmed"
            style={{
              alignSelf: "end",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <IconHelp size={20} />
            What is this?
          </Anchor>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
