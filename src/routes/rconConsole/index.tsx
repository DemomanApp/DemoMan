import { useCallback, useEffect, useRef, useState } from "react";

import AutoSizer from "react-virtualized-auto-sizer";

import { Input, ScrollArea, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
  IconX,
} from "@tabler/icons-react";

import { HeaderPortal } from "@/AppShell";
import { sendRconCommand } from "@/api";
import useStore from "@/hooks/useStore";

import classes from "./RconConsole.module.css";

type HistoryEntry = {
  kind: "request" | "response" | "error";
  value: string;
};

function HistoryRowIcon({ entryKind }: { entryKind: HistoryEntry["kind"] }) {
  switch (entryKind) {
    case "request":
      return <IconChevronRight className={classes.historyRowIcon} />;
    case "response":
      return (
        <IconChevronLeft
          className={classes.historyRowIcon}
          color="var(--mantine-color-blue-9)"
        />
      );
    case "error":
      return (
        <IconX
          className={classes.historyRowIcon}
          color="var(--mantine-color-red-9)"
        />
      );
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
            RCON Console
          </Text>
        }
      />
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
    </>
  );
}
