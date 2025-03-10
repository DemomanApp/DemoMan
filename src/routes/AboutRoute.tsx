import { Anchor, AppShell, Button, Container, Text } from "@mantine/core";

import { HeaderBar } from "@/AppShell";
import { IconBrandDiscord, IconBrandGithub } from "@tabler/icons-react";
import "./AboutRoute.css";

export default function AboutRoute() {
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
              About DemoMan
            </Text>
          }
        />
      </AppShell.Header>
      <AppShell.Main>
        <Container
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "var(--mantine-spacing-lg)",
            alignItems: "center",
            justifyContent: "center",
          }}
          size="sm"
        >
          <img src="../../githubassets/Banner.png" width="75%" alt="DemoMan Banner" />
          <div className="buttonContainer">
            <Button
              variant="subtle"
              leftSection={<IconBrandGithub />}
              component="a"
              href="https://github.com/DemomanApp/DemoMan"
              target="_blank"
            >
              GitHub
            </Button>
            <Button
              variant="subtle"
              leftSection={<IconBrandDiscord />}
              component="a"
              href="https://discord.gg/GduKxhYFhR"
              target="_blank"
            >
              Discord
            </Button>
          </div>
          <div>Thank you for using DemoMan!</div>
          <div className="centerText">
            Do you want to report a bug or suggest an idea for a new feature?
            <br />
            Please{" "}
            <Anchor
              href="https://github.com/DemomanApp/DemoMan/issues/new/choose"
              target="_blank"
            >
              open an issue on GitHub
            </Anchor>
            .
          </div>
          <div>
            DemoMan is developed mainly by a single developer, with
            contributions by a few awesome{" "}
            <Anchor
              href="https://github.com/DemomanApp/DemoMan/graphs/contributors"
              target="_blank"
            >
              community members
            </Anchor>
            . Since the start of development in 2020, DemoMan has been
            completely rewritten multiple times, each time gaining many features
            and usability improvements. The version you are using right now is
            built with{" "}
            <Anchor href="https://www.rust-lang.org/" target="_blank">
              Rust
            </Anchor>
            ,{" "}
            <Anchor href="https://tauri.app/" target="_blank">
              Tauri
            </Anchor>
            ,{" "}
            <Anchor href="https://react.dev/" target="_blank">
              React
            </Anchor>
            , and{" "}
            <Anchor href="https://mantine.dev/" target="_blank">
              Mantine
            </Anchor>
            . Special thanks to{" "}
            <Anchor href="https://github.com/icewind1991" target="_blank">
              @icewind1991
            </Anchor>{" "}
            for building{" "}
            <Anchor href="https://github.com/demostf/parser" target="_blank">
              demostf/parser
            </Anchor>
            , without which most of the new features in this version would not
            have been possible.
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
