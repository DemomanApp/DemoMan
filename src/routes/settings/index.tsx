import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container, ScrollArea, Stack, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

import AppShell, { HeaderButton } from "../../AppShell";
import BooleanSetting from "./BooleanSetting";
import DemoDirsSetting from "./DemoDirsSetting";

export default function SettingsView() {
  const navigate = useNavigate();

  const [value1, setValue1] = useState(false);

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
              value={value1}
              setValue={setValue1}
            />
            <DemoDirsSetting />
          </Stack>
        </Container>
      </ScrollArea>
    </AppShell>
  );
}
