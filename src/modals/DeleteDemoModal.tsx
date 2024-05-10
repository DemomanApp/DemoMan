import { ContextModalProps, modals } from "@mantine/modals";

import { Demo } from "@/demo";
import { Button, Group, Stack } from "@mantine/core";
import { deleteDemo } from "@/api";

export async function openDeleteDemoModal(demo: Demo, onConfirm: () => void) {
  modals.openContextModal({
    modal: "delete_demo",
    title: `Delete ${demo.name}`,
    centered: true,
    innerProps: {
      demo,
      async onDelete() {
        await deleteDemo(demo.path, false);

        onConfirm();
      },
      async onTrash() {
        await deleteDemo(demo.path, true);

        onConfirm();
      },
    },
  });
}

type DeleteDemoModalProps = { demo: Demo; onDelete(): void; onTrash(): void };

export const DeleteDemoModal = ({
  context,
  id,
  innerProps: { demo, onDelete, onTrash },
}: ContextModalProps<DeleteDemoModalProps>) => {
  return (
    <Stack gap="xs">
      <div>
        You are about to delete the demo &quot;{demo.name}&quot;. Are you sure?
      </div>
      <Group gap="xs" justify="end">
        <Button variant="default" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button onClick={onTrash} color="red">
          Move to trash
        </Button>
        <Button onClick={onDelete} color="red">
          Delete permanently
        </Button>
      </Group>
    </Stack>
  );
};
