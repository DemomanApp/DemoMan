import { useState } from "react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import * as log from "@tauri-apps/plugin-log";
import { openUrl } from "@tauri-apps/plugin-opener";

import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Menu,
  Tooltip,
} from "@mantine/core";
import {
  IconPlayerPlay,
  IconCopy,
  IconPlugX,
  IconChevronDown,
  IconBrandSteam,
  IconX,
  IconCheck,
} from "@tabler/icons-react";

import { sendRconCommand } from "@/api";
import type { Demo } from "@/demo";
import type { RconState } from "@/RconContext";
import useStore from "@/hooks/useStore";

import classes from "./PlayDemoButton.module.css";

type CallbackState = "running" | "failed" | "succeeded" | "none";

function CallbackStateIndicator({ state }: { state: CallbackState }) {
  switch (state) {
    case "none":
      return undefined;
    case "running":
      return <Loader size="sm" color="text" />;
    case "failed":
      return <IconX />;
    case "succeeded":
      return <IconCheck />;
  }
}

export default function PlayDemoButton({
  demo,
  rconPassword,
  rconState,
}: { demo: Demo; rconPassword: string; rconState: RconState }) {
  const [preferredOptionKey, setPreferredOptionKey] = useStore(
    "preferredPlayOption"
  );

  const [callbackState, setCallbackState] = useState<CallbackState>("none");

  const isRconConnected = rconState.status === "connected";
  const isCallbackRunning = callbackState === "running";

  type PlayDemoOption = {
    title: string;
    icon: JSX.Element;
    disabled: boolean;
    onClick(): Promise<unknown>;
    tooltip?: JSX.Element;
  };

  const options = {
    rcon: {
      title: "Play demo (RCON)",
      icon: <IconPlayerPlay />,
      disabled: !isRconConnected,
      onClick() {
        return sendRconCommand(`playdemo "${demo.path}"`, rconPassword);
      },
      tooltip: isRconConnected ? undefined : (
        <span
          style={{
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
          }}
        >
          <IconPlugX />
          {"RCON connection required"}
        </span>
      ),
    },
    copyCommand: {
      title: "Copy playdemo command",
      icon: <IconCopy />,
      disabled: false,
      onClick() {
        return writeText(`playdemo "${demo.path}"`);
      },
      tooltip: undefined,
    },
    launch: {
      title: "Launch TF2 to play demo",
      icon: <IconBrandSteam />,
      disabled: false,
      onClick() {
        return openUrl(`steam://run/440//-novid +playdemo ${demo.path}`);
      },
      tooltip: undefined,
    },
  } satisfies Record<typeof preferredOptionKey, PlayDemoOption>;

  const preferredOption = options[preferredOptionKey];
  const otherOptions = Object.entries(options).filter(
    ([key, _option]) => key !== preferredOptionKey
  );

  const handleClick = (key: typeof preferredOptionKey) => {
    setPreferredOptionKey(key);

    // When selecting a disabled option, it moves to the main button but is not executed
    if (options[key].disabled) {
      return;
    }

    setCallbackState("running");

    options[key]
      .onClick()
      .then(() => setCallbackState("succeeded"))
      .catch((reason) => {
        log.error(reason);
        setCallbackState("failed");
      })
      .finally(() =>
        setTimeout(() => {
          setCallbackState("none");
        }, 2000)
      );
  };

  return (
    <Group wrap="nowrap" gap={0}>
      <Tooltip
        label={preferredOption.tooltip}
        disabled={preferredOption.tooltip === undefined}
      >
        <Button
          className={classes.button}
          leftSection={
            callbackState === "none" ? (
              preferredOption.icon
            ) : (
              <CallbackStateIndicator state={callbackState} />
            )
          }
          disabled={preferredOption.disabled || isCallbackRunning}
          onClick={() => handleClick(preferredOptionKey)}
        >
          {preferredOption.title}
        </Button>
      </Tooltip>
      <Menu position="bottom-end">
        <Menu.Target>
          <ActionIcon
            variant="filled"
            size={36}
            className={classes.menuControl}
            disabled={isCallbackRunning}
          >
            <IconChevronDown size={16} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {otherOptions.map(([key, option]) => (
            <Menu.Item
              leftSection={option.icon}
              key={key}
              onClick={() => handleClick(key as typeof preferredOptionKey)}
              color={option.disabled ? "gray" : "white"}
            >
              {option.title}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
