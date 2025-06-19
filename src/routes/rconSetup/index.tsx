import { openUrl } from "@tauri-apps/plugin-opener";

import { useState } from "react";

import {
  Alert,
  Button,
  Center,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";

import { HeaderPortal } from "@/AppShell";
import { sendRconCommand } from "@/api";
import { AsyncButton, AsyncCopyButton } from "@/components";
import useStore from "@/hooks/useStore";

export default function RconSetup() {
  const [rconPassword, _setRconPassword] = useStore("rconPassword");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const launchFlags = `-usercon +rcon_password ${rconPassword} +ip 0.0.0.0 +hostport 27969 +net_start`;

  return (
    <>
      <HeaderPortal
        center={
          <Text
            fw={500}
            size="lg"
            style={{
              cursor: "default",
            }}
          >
            Set up RCON
          </Text>
        }
      />
      <Center style={{ height: "100%" }}>
        <Stack>
          <div>Add this to your launch options:</div>
          <Paper
            withBorder
            p="xs"
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "monospace",
              gap: 8,
            }}
          >
            <Text
              style={{
                userSelect: "text",
                WebkitUserSelect: "text",
              }}
            >
              {launchFlags}
            </Text>
            <AsyncCopyButton text={launchFlags} />
          </Paper>
          <Group>
            <Button onClick={() => openUrl("steam://gameproperties/440")}>
              Open TF2 properties
            </Button>
            <AsyncButton
              onClick={async () => {
                let response: string;
                try {
                  response = await sendRconCommand("echo test", rconPassword);
                } catch (error) {
                  setError(`Failed to send RCON command. Reason: ${error}`);
                  setSuccess(false);
                  return;
                }
                if (response.trim() === "test") {
                  setError(null);
                  setSuccess(true);
                } else {
                  setError(`Unexpected RCON response: "${response}"`);
                  setSuccess(false);
                }
              }}
            >
              Test connection
            </AsyncButton>
          </Group>
          {error !== null && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
            >
              {error}
              <br />
              Make sure TF2 is running and has the correct launch options set.
            </Alert>
          )}
          {success && (
            <Alert icon={<IconCircleCheck size={16} />} title="Success!">
              Connection established.
            </Alert>
          )}
        </Stack>
      </Center>
    </>
  );
}
