import { writeText } from "@tauri-apps/plugin-clipboard-manager";

import { useAsyncCallback } from "react-async-hook";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export type AsyncCopyButtonProps = {
  text: string;
};

export default function AsyncCopyButton({ text }: AsyncCopyButtonProps) {
  const asyncWriteText = useAsyncCallback(writeText);
  return (
    <Tooltip label="Copy to clipboard">
      <ActionIcon
        color={asyncWriteText.status === "success" ? "teal" : "gray"}
        onClick={() =>
          asyncWriteText.execute(text).then(() => {
            setTimeout(() => {
              asyncWriteText.reset();
            }, 1000);
          })
        }
      >
        {asyncWriteText.status === "success" ? (
          <IconCheck size={16} />
        ) : (
          <IconCopy size={16} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
