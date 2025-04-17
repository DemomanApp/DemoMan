import { type ContextModalProps, modals } from "@mantine/modals";
import { Button, Group, Stack } from "@mantine/core";

import type { Demo } from "@/demo";
import { deleteDemo } from "@/api";
import useStore from "@/hooks/useStore";

export async function openDeleteDemoModal(demo: Demo, onConfirm: () => void) {
  modals.openContextModal({
    modal: "delete_demo",
    title: `Delete ${demo.name}`,
    centered: true,
    innerProps: {
      demo,
      onConfirm,
    },
  });
}

type DeleteDemoModalProps = { demo: Demo; onConfirm(): void };

export const DeleteDemoModal = ({
  context,
  id,
  innerProps: { demo, onConfirm },
}: ContextModalProps<DeleteDemoModalProps>) => {
  const [skipTrash, _] = useStore("skipTrash");

  const handleDelete = async () => {
    await deleteDemo(demo.path, !skipTrash);

    onConfirm();
  };

  return (
    <Stack gap="xs">
      <div>
        You are about to delete the demo &quot;{demo.name}&quot;. Are you sure?
      </div>
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
