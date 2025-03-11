import { useState, useEffect } from "react";

import { Alert, AppShell, Center, Paper, Stack, Text, TextInput, Button } from "@mantine/core";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";

import useStore from "@/hooks/useStore";
import { sendRconCommand } from "@/api";
import { AsyncButton, AsyncCopyButton } from "@/components";
import { HeaderBar } from "@/AppShell";

export default function RconSetup() {
  const [rconPassword, setRconPassword] = useStore("rconPassword");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (rconPassword === undefined || rconPassword === "") {
      // Set a new random password if none is set
      setRconPassword(btoa(Math.random().toString()).substring(10, 20));
    }
  }, [rconPassword, setRconPassword]);

  const handlePasswordChange = () => {
    if (newPassword.trim() === "") {
      // Set a new random password if the input is empty
      setRconPassword(btoa(Math.random().toString()).substring(10, 20));
    } else {
      setRconPassword(newPassword);
    }
    setNewPassword("");
  };

  const launchFlags = `-usercon +rcon_password ${rconPassword} +ip 0.0.0.0 +hostport 27969 +net_start`;

  return (
    <AppShell header={{ height: 50 }}>
      <AppShell.Header>
        <HeaderBar />
      </AppShell.Header>
      <AppShell.Main>
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
            <TextInput
              label="Set RCON Password"
              placeholder="Enter new RCON password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.currentTarget.value)}
            />
            <Button onClick={handlePasswordChange}>Set Password</Button>
            <div>
              <AsyncButton
                onClick={async () => {
                  let response;
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
            </div>
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
      </AppShell.Main>
    </AppShell>
  );
}