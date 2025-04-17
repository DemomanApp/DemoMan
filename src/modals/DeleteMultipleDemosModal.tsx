import * as log from "@tauri-apps/plugin-log";

import { Button, Group, Stack } from "@mantine/core";
import { type ContextModalProps, modals } from "@mantine/modals";

import { deleteDemo } from "@/api";
import type { Demo } from "@/demo";
import useStore from "@/hooks/useStore";

export async function openDeleteMultipleDemosModal(
  demos: Demo[],
  onConfirm: () => void
) {
  modals.openContextModal({
    modal: "delete_multiple_demos",
    title: `Delete ${demos.length} demos`,
    centered: true,
    innerProps: {
      demos,
      onConfirm,
    },
  });
}

type DeleteMultipleDemosModalProps = { demos: Demo[]; onConfirm(): void };

export const DeleteMultipleDemosModal = ({
  context,
  id,
  innerProps: { demos, onConfirm },
}: ContextModalProps<DeleteMultipleDemosModalProps>) => {
  const [skipTrash, _] = useStore("skipTrash");

  const handleDelete = () => {
    Promise.all(demos.map((demo) => deleteDemo(demo.path, !skipTrash)))
      .catch(log.error)
      .finally(onConfirm);
  };

  return (
    <Stack gap="xs">
      <div>You are about to delete {demos.length} demos. Are you sure?</div>
      <Group gap="xs" justify="end">
        <Button variant="default" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="red">
          {skipTrash ? "Delete permanently" : "Move to trash"}
        </Button>
      </Group>
    </Stack>
  );
};
