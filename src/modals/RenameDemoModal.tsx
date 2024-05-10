import { path } from "@tauri-apps/api";

import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ContextModalProps, modals } from "@mantine/modals";

import { renameDemo } from "@/api";
import { Demo } from "@/demo";

export async function openRenameDemoModal(
  demo: Demo,
  onConfirm: (newPath: string) => void
) {
  const parentDirectory = await path.dirname(demo.path);

  async function handleSubmit(newName: string) {
    const newPath = await path.join(parentDirectory, `${newName}.dem`);

    await renameDemo(demo.path, newPath);

    onConfirm(newPath);
  }

  modals.openContextModal({
    modal: "rename_demo",
    title: `Rename ${demo.name}`,
    centered: true,
    innerProps: {
      oldName: demo.name,
      handleSubmit,
    },
  });
}

type RenameDemoModalProps = {
  oldName: string;
  handleSubmit(newName: string): void;
};

export const RenameDemoModal = ({
  context,
  id,
  innerProps: { oldName, handleSubmit },
}: ContextModalProps<RenameDemoModalProps>) => {
  console.log(id);

  const form = useForm<{ name: string }>({
    initialValues: {
      name: oldName,
    },
    validate: {
      name(value) {
        if (value.length === 0) {
          return "This cannot be empty";
        }
        return null;
      },
    },
    validateInputOnBlur: true,
  });

  return (
    <form
      onSubmit={form.onSubmit(({ name }) => {
        handleSubmit(name);
        context.closeModal(id);
      })}
    >
      <Stack gap="xs">
        <TextInput
          label="Demo name"
          placeholder="Demo name"
          data-autofocus
          {...form.getInputProps("name")}
        />
        <Group gap="xs" justify="end">
          <Button variant="default" onClick={() => context.closeModal(id)}>
            Cancel
          </Button>
          <Button type="submit">Confirm</Button>
        </Group>
      </Stack>
    </form>
  );
};
