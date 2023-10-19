import { useState } from "react";

import { nanoid } from "nanoid";

import { isNotEmpty, useForm } from "@mantine/form";
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Input,
  Modal,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import useStore from "../../hooks/useStore";
import PathPicker from "./PathPicker";

import classes from "./settings.module.css";
import { drop } from "../../util";

export default function DemoDirsSetting() {
  const [demoDirs, setDemoDirs] = useStore("demoDirs");
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<{ label: string; path: string }>({
    initialValues: {
      label: "My Demos",
      path: "",
    },
    validate: {
      label: (value) => {
        if (value.length == 0) {
          return "Label cannot be empty";
        }
        // TODO: remove the assertion after this is fixed:
        //       https://github.com/mantinedev/mantine/issues/4827
        if (value in demoDirs!) {
          return "A demo directory with this label already exists";
        }
        return null;
      },
      path: isNotEmpty("Path cannot be empty"),
    },
    validateInputOnBlur: true,
  });

  return (
    <>
      <div className={classes.setting}>
        <div className={classes.labelRow}>
          <Text className={classes.label}>Demo Directories</Text>
          <Tooltip label="Add demo directory...">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => {
                form.reset();
                setDialogOpen(true);
              }}
            >
              <IconPlus stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </div>
        <Text c="dimmed">
          These are the locations where DemoMan searches for demo files.
        </Text>
        <Stack align="stretch" pt="md" gap="sm">
          {demoDirs !== undefined &&
            Object.entries(demoDirs).map(([key, { label, path }]) => (
              <div key={key} className={classes.demoDir}>
                <div className={classes.labelRow}>
                  <Text size="lg" fw={600} style={{ flex: 1 }}>
                    {label}
                  </Text>
                  <ActionIcon
                    variant="subtle"
                    color="red.9"
                    className={classes.demoDirAction}
                    onClick={() => setDemoDirs(drop(key))}
                  >
                    <IconTrash stroke={1.5} />
                  </ActionIcon>
                </div>
                <Text c="dimmed" style={{ wordBreak: "break-all" }}>
                  {path}
                </Text>
              </div>
            ))}
        </Stack>
        <Divider mt="md" />
      </div>
      <Modal
        title="New demo directory"
        opened={dialogOpen}
        centered
        size="lg"
        onClose={() => setDialogOpen(false)}
      >
        <form
          onSubmit={form.onSubmit(({ label, path }) => {
            setDemoDirs((previousDemoDirs) => ({
              ...previousDemoDirs,
              [nanoid()]: { label, path },
            }));
            setDialogOpen(false);
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
      </Modal>
    </>
  );
}
