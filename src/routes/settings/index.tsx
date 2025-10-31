import {
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

import { HeaderPortal } from "@/AppShell";
import useStore from "@/hooks/useStore";
import BooleanSetting from "./BooleanSetting";
import DemoDirsSetting from "./DemoDirsSetting";

import classes from "./settings.module.css";

export default function SettingsView() {
  const [rconPassword, setRconPassword] = useStore("rconPassword");

  function generatePassword() {
    setRconPassword(btoa(Math.random().toString()).substring(10, 20));
  }

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
            Settings
          </Text>
        }
      />
      <div style={{ height: "100%", overflowY: "auto" }}>
        <Container size="xs" pt="md">
          <Stack>
            <Group align="end" className={classes.rconPasswordRow}>
              <TextInput
                label="RCON Password"
                description="Set or generate your own RCON password"
                placeholder="RCON Password"
                value={rconPassword}
                onChange={(e) => setRconPassword(e.currentTarget.value)}
                type="text"
                className={classes.rconPasswordInput}
              />
              <Tooltip label="Generate random password">
                <Button
                  variant="default"
                  onClick={generatePassword}
                  leftSection={<IconRefresh size={16} />}
                >
                  Generate
                </Button>
              </Tooltip>
            </Group>
            <BooleanSetting
              name="Skip trash"
              description="Delete demos permanently instead of moving them to trash"
              storeKey="skipTrash"
            />
            <Divider mt="md" />
            <DemoDirsSetting />
            {import.meta.env.DEV && (
              /* Dev-only settings */
              <>
                <Divider label="Dev-only settings" variant="dashed" />
                <BooleanSetting
                  name="Enable location overlay"
                  storeKey="enableLocationOverlay"
                />
              </>
            )}
          </Stack>
        </Container>
      </div>
    </>
  );
}
