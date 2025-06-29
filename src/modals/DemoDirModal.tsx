import { Button, Group, Input, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { type ContextModalProps, modals } from "@mantine/modals";

import useStore from "@/hooks/useStore";
import PathPicker from "@/routes/settings/PathPicker";

export function openAddDemoDirModal() {
  modals.openContextModal({
    modal: "add_demo_dir",
    title: "Add demo directory",
    centered: true,
    size: "lg",
    innerProps: {},
  });
}

export const AddDemoDirModal = ({ id }: ContextModalProps) => {
  const [demoDirs, setDemoDirs] = useStore("demoDirs");

  const form = useForm<{ label: string; path: string }>({
    initialValues: {
      label: "My Demos",
      path: "",
    },
    validate: {
      label: (newLabel) => {
        if (newLabel.length === 0) {
          return "Label cannot be empty";
        }
        if (Object.values(demoDirs).some((label) => label === newLabel)) {
          return "A demo directory with this label already exists";
        }
        return null;
      },
      path: (newPath: string) => {
        if (newPath.length === 0) {
          return "Path cannot be empty";
        }
        if (Object.keys(demoDirs).some((path) => path === newPath)) {
          return "A demo directory with this path already exists";
        }
        return null;
      },
    },
    validateInputOnBlur: true,
  });

  return (
    <form
      onSubmit={form.onSubmit(({ label, path }) => {
        setDemoDirs((previousDemoDirs) => ({
          ...previousDemoDirs,
          [path]: label,
        }));
        modals.close(id);
      })}
    >
      <TextInput
        label="Label"
        description="Give this directory a short name"
        {...form.getInputProps("label")}
      />
      <Input.Wrapper
        label="Path"
        description="The file path to the directory"
        mt="md"
        {...form.getInputProps("path")}
      >
        <Input
          component={PathPicker}
          styles={{
            wrapper: {
              flexGrow: 1,
            },
          }}
          setValue={(newPath) => form.setFieldValue("path", newPath)}
          {...form.getInputProps("path")}
        />
      </Input.Wrapper>
      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};
