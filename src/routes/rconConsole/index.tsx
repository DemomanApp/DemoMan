import { useCallback, useEffect, useRef, useState } from "react";

import { AppShell, Input, ScrollArea, Text } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
  IconX,
} from "@tabler/icons-react";
import AutoSizer from "react-virtualized-auto-sizer";

import { HeaderBar } from "@/AppShell";

import classes from "./RconConsole.module.css";
import { useListState } from "@mantine/hooks";
import { sendRconCommand } from "@/api";
import useStore from "@/hooks/useStore";

type HistoryEntry = {
  kind: "request" | "response" | "error";
  value: string;
};

function HistoryRowIcon({ entryKind }: { entryKind: HistoryEntry["kind"] }) {
  switch (entryKind) {
    case "request":
      return <IconChevronRight />;
    case "response":
      return <IconChevronLeft color="var(--mantine-color-blue-9)" />;
    case "error":
      return <IconX color="var(--mantine-color-red-9)" />;
  }
}

function HistoryRow({ historyEntry }: { historyEntry: HistoryEntry }) {
  return (
    <div className={classes.historyRow}>
      <HistoryRowIcon entryKind={historyEntry.kind} />
      {historyEntry.value}
    </div>
  );
}

export default function RconConsole() {
  const [password, _] = useStore("rconPassword");
  const [promptInput, setPromptInput] = useState("");
  const [history, historyHandles] = useListState<HistoryEntry>([]);

  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewport.current?.scrollTo({
      top: viewport.current?.scrollHeight,
      behavior: "smooth",
    });
  });

  const handleSubmit = useCallback(
    (command: string) => {
      setPromptInput("");

      historyHandles.append({ kind: "request", value: command });

      sendRconCommand(command, password)
        .then((response) => {
          historyHandles.append({ kind: "response", value: response });
        })
        // `error` can safely be assumed to be a string,
        // since the tauri command returns a `Result<String, String>`
        .catch((error: string) => {
          historyHandles.append({
            kind: "error",
            value: error,
          });
        });
    },
    [historyHandles, password]
  );

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
              RCON Console
            </Text>
          }
        />
      </AppShell.Header>
      <AppShell.Main>
        <div className={classes.root}>
          <div className={classes.history}>
            <AutoSizer>
              {({ height, width }) => (
                <ScrollArea style={{ width, height }} viewportRef={viewport}>
                  {history.map((historyEntry, idx) => (
                    <HistoryRow
                      historyEntry={historyEntry}
                      key={`${idx}${historyEntry.kind}${historyEntry.value}`}
                    />
                  ))}
                </ScrollArea>
              )}
            </AutoSizer>
          </div>
          <Input
            value={promptInput}
            onChange={(event) => setPromptInput(event.currentTarget.value)}
            variant="unstyled"
            classNames={{
              input: classes.input,
              wrapper: classes.inputWrapper,
            }}
            placeholder="Enter RCON command..."
            leftSection={<IconChevronsRight />}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.repeat) {
                handleSubmit(event.currentTarget.value);
              }
            }}
          />
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
