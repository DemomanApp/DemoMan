import { useNavigate } from "react-router-dom";

import { Container, Divider, ScrollArea, Stack, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

import AppShell, { HeaderButton } from "@/AppShell";
import BooleanSetting from "./BooleanSetting";
import DemoDirsSetting from "./DemoDirsSetting";

export default function SettingsView() {
  const navigate = useNavigate();

  return (
    <AppShell
      header={{
        left: (
          <HeaderButton icon={IconChevronLeft} onClick={() => navigate(-1)} />
        ),
        center: (
          <Text
            fw={500}
            size="lg"
            inline
            style={{ cursor: "default", textAlign: "center" }}
          >
            Settings
          </Text>
        ),
      }}
    >
      <ScrollArea h="100%">
        <Container size="xs" pt="md">
          <Stack>
            <BooleanSetting
              name="Example boolean setting"
              description="This is an example setting. It does not do anything."
              storeKey="exampleBoolean"
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
    </AppShell>
  );
}
