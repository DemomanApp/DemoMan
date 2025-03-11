import { useState } from "react";
import { Alert, AppShell, Center, Paper, Stack, Text, Button, PasswordInput, Tooltip } from "@mantine/core";
import { IconAlertCircle, IconCircleCheck, IconEyeOff, IconEye } from "@tabler/icons-react";
import useStore from "@/hooks/useStore";
import { sendRconCommand } from "@/api";
import { AsyncButton, AsyncCopyButton } from "@/components";
import { HeaderBar } from "@/AppShell";

export default function RconSetup() {
  const [rconPassword, setRconPassword] = useStore("rconPassword");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = () => {
    setRconPassword(newPassword);
    setNewPassword("");
  };

  if (rconPassword === undefined) {
    // Set a new random password
    setRconPassword(btoa(Math.random().toString()).substring(10, 20));
    return null;
  }

  const launchFlags = `-usercon +rcon_password ${rconPassword} +ip 0.0.0.0 +hostport 27969 +net_start`;
  const maskedLaunchFlags = `-usercon +rcon_password ${showPassword ? rconPassword : "********"} +ip 0.0.0.0 +hostport 27969 +net_start`;

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
                {maskedLaunchFlags}
              </Text>
              <AsyncCopyButton text={launchFlags} />
            </Paper>
            <PasswordInput
              label="Set RCON Password"
              placeholder="Enter new RCON password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.currentTarget.value)}
              style={{ width: "100%", minWidth: "100%" }}
              visibilityToggleIcon={({ reveal }) => (
              <Tooltip label={reveal ? "Hide Password" : "Show Password"}>
                {reveal ? (
                <IconEye size={16} style={{ backgroundColor: "var(--mantine-color-gray-filled)", width: "100%", height: "100%" }} />
                ) : (
                <IconEyeOff size={16} style={{ backgroundColor: "var(--mantine-color-gray-filled)", width: "100%", height: "100%" }} />
                )}
              </Tooltip>
              )}
              onVisibilityChange={(visible) => setShowPassword(visible)}
            />
            <Button onClick={handlePasswordChange}>Click to Generate or Enter Your Own Password</Button>
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