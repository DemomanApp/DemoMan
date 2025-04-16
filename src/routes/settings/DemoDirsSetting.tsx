import { useState } from "react";

import { useForm } from "@mantine/form";
import {
  ActionIcon,
  Button,
  Group,
  Input,
  Modal,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconPlus, IconTrash, IconFolder, IconExternalLink } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import * as log from "@tauri-apps/plugin-log";

import useStore from "@/hooks/useStore";
import PathPicker from "./PathPicker";
import BooleanSetting from "./BooleanSetting";

import classes from "./settings.module.css";
import { drop } from "@/util";

export default function DemoDirsSetting() {
  const [demoDirs, setDemoDirs] = useStore("demoDirs");
  // const [showMultipleDemoDirs, setShowMultipleDemoDirs] = useStore("showMultipleDemoDirs");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPath, setEditPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editingLabelPath, setEditingLabelPath] = useState<string | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState<string>("");
  const form = useForm<{ label: string; path: string }>({
    initialValues: {
      label: "My Demos",
      path: "",
    },
    validate: {
      label: (newLabel) => {
        if (newLabel.length == 0) {
          return "Label cannot be empty";
        }
        if (Object.values(demoDirs).some((label) => label === newLabel)) {
          return "A demo directory with this label already exists";
        }
        return null;
      },
      path: (newPath: string) => {
        if (newPath.length == 0) {
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

  const navigate = useNavigate();

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
              <IconPlus />
            </ActionIcon>
          </Tooltip>
        </div>
        <Text c="dimmed">
          These are the locations where DemoMan searches for demo files.
        </Text>
        {/* Only show the toggle if there is more than one demo directory */}
        {Object.keys(demoDirs).length > 1 && (
          <div className={classes.showMultiDirToggle}>
            <BooleanSetting
              name="Show demos from all folders at once"
              storeKey="showMultipleDemoDirs"
            />
          </div>
        )}
        <Stack align="stretch" pt="md" gap="sm">
          {Object.entries(demoDirs).map(([path, label]) => (
            <div key={path} className={classes.demoDir}>
              <div className={classes.labelRow}>
                {editingLabelPath === path ? (
                  <TextInput
                    size="sm"
                    value={editingLabelValue}
                    autoFocus
                    onChange={e => setEditingLabelValue(e.target.value)}
                    onBlur={() => {
                      if (editingLabelValue !== "" && editingLabelValue !== label) {
                        setDemoDirs({ ...demoDirs, [path]: editingLabelValue });
                      }
                      setEditingLabelPath(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        if (editingLabelValue !== "" && editingLabelValue !== label) {
                          setDemoDirs({ ...demoDirs, [path]: editingLabelValue });
                        }
                        setEditingLabelPath(null);
                      } else if (e.key === "Escape") {
                        setEditingLabelPath(null);
                      }
                    }}
                    style={{ flex: 1, minWidth: 0 }}
                  />
                ) : (
                  <Text
                    size="lg"
                    fw={600}
                    className={classes.label}
                    style={{ cursor: "pointer" }}
                    title="Click to edit label"
                    onClick={() => {
                      setEditingLabelPath(path);
                      setEditingLabelValue(label);
                    }}
                  >
                    {label}
                  </Text>
                )}
                <Group gap={4} className={classes["demoDirActions"]}>
                  <Tooltip label="Open in DemoMan">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => navigate(`/demos/dir/${btoa(path)}`)}
                    >
                      <IconFolder size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Open in File Explorer">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={() => revealItemInDir(path).catch(log.error)}
                    >
                      <IconExternalLink size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <ActionIcon
                  variant="subtle"
                  color="red.9"
                  className={classes.demoDirAction}
                  onClick={() => setDemoDirs(drop(path))}
                >
                  <IconTrash />
                </ActionIcon>
              </div>
              <Text
                c="dimmed"
                style={{ wordBreak: "break-all", cursor: "pointer" }}
                onClick={() => {
                  setEditPath(path);
                  setEditValue(path);
                }}
                title="Click to change directory path"
              >
                {path}
              </Text>
            </div>
          ))}
        </Stack>
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
              [path]: label,
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
      <Modal
        title="Edit demo directory path"
        opened={editPath !== null}
        centered
        size="lg"
        onClose={() => setEditPath(null)}
      >
        <Input.Wrapper label="Path" description="Select a new directory path">
          <PathPicker
            value={editValue}
            setValue={setEditValue}
          />
        </Input.Wrapper>
        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={() => setEditPath(null)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (
                editPath === null ||
                editPath === "" ||
                editValue === null ||
                editValue === "" ||
                editValue === editPath
              ) {
                setEditPath(null);
                return;
              }
              // Prevent duplicate paths
              if (typeof editValue === "string" && editValue !== "" && demoDirs[editValue] !== undefined) {
                // Optionally show error/notification here
                setEditPath(null);
                return;
              }
              const newDemoDirs = { ...demoDirs };
              const label = newDemoDirs[editPath];
              delete newDemoDirs[editPath];
              newDemoDirs[editValue] = label;
              setDemoDirs(newDemoDirs);
              setEditPath(null);
            }}
            disabled={
              editValue === "" ||
              editValue === editPath ||
              (editValue !== "" && demoDirs[editValue] !== undefined)
            }
          >
            Save
          </Button>
        </Group>
      </Modal>
    </>
  );
}
