import {
  AppShell,
  Container,
  Divider,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";

import BooleanSetting from "./BooleanSetting";
import DemoDirsSetting from "./DemoDirsSetting";
import { HeaderBar } from "@/AppShell";

export default function SettingsView() {
  return (
    <AppShell header={{ height: 50 }}>
      <AppShell.Header>
        <HeaderBar
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
      </AppShell.Header>
      <AppShell.Main>
        <ScrollArea h="100%">
          <Container size="xs" pt="md">
            <Stack>
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
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
}
