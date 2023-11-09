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
          <HeaderButton onClick={() => navigate(-1)}>
            <IconChevronLeft />
          </HeaderButton>
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
    </AppShell>
  );
}
