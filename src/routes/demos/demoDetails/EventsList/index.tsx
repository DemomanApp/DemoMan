import * as log from "@tauri-apps/plugin-log";

import { useRef } from "react";

import { useNavigate } from "react-router";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
  IconBookmark,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { setDemoEvents } from "@/api";
import { IconKillstreak } from "@/components/icons";
import type { Demo, DemoEvent } from "@/demo";

import classes from "./EventsList.module.css";

type EventsListProps = {
  demo: Demo;
};

type EventBoxProps = {
  event: DemoEvent;
  onDelete(): void;
  onEdit(): void;
};

function EventBox({ event, onDelete, onEdit }: EventBoxProps) {
  return (
    <div className={classes.eventBox}>
      <Text c="dimmed" size="sm" className={classes.eventBoxTick}>
        {event.tick}
      </Text>
      {event.name === "Killstreak" ? <IconKillstreak /> : <IconBookmark />}
      <div className={classes.eventBoxValue}>{event.value}</div>
      {event.name === "Bookmark" && (
        <Tooltip label="Edit...">
          <ActionIcon
            className={classes.eventBoxButton}
            onClick={() => onEdit()}
            variant="transparent"
            color="gray"
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
      )}
      <Tooltip label="Delete...">
        <ActionIcon
          className={classes.eventBoxButton}
          onClick={() => onDelete()}
          variant="transparent"
          color="red.9"
        >
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}

function openDeleteModal(event: DemoEvent, onConfirm: () => void) {
  modals.openConfirmModal({
    title: "Delete bookmark",
    centered: true,
    children: (
      <Text size="sm">
        You are about to delete the {event.name.toLowerCase()} &quot;
        {event.value}&quot;. Are you sure?
      </Text>
    ),
    labels: { confirm: "Delete it", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm,
  });
}

type EditModalProps = {
  demo: Demo;
  index?: number;
  onConfirm(): void;
};

function EditModal({ demo, index, onConfirm }: EditModalProps) {
  const initialValues: DemoEvent =
    index === undefined
      ? { name: "Bookmark", tick: 0, value: "General" }
      : demo.events[index];

  const form = useForm<DemoEvent>({
    initialValues: {
      ...initialValues,
    },
    validate: {
      tick(newTick) {
        if (0 <= newTick && newTick <= demo.numTicks) {
          return null;
        }
        return "Tick value is outside of the recorded time span";
      },
      value(newValue) {
        if (newValue.length === 0) {
          return "This cannot be empty";
        }
        return null;
      },
    },
    validateInputOnBlur: true,
  });

  function handleSubmit(newEvent: DemoEvent) {
    const newEvents = [...demo.events];

    if (index === undefined) {
      newEvents.push(newEvent);
    } else {
      newEvents[index] = newEvent;
    }

    newEvents.sort((a, b) => a.tick - b.tick);

    setDemoEvents(demo.path, newEvents)
      .catch(log.error)
      .finally(onConfirm)
      .catch(log.error);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xs">
        <Group align="top">
          <NumberInput
            label="Tick"
            placeholder="Tick"
            allowDecimal={false}
            min={0}
            max={demo.numTicks}
            style={{ flexGrow: 1, flexBasis: 0 }}
            {...form.getInputProps("tick")}
          />
          <TextInput
            label="Bookmark text"
            placeholder="Bookmark text"
            data-autofocus
            style={{ flexGrow: 2, flexBasis: 0 }}
            {...form.getInputProps("value")}
          />
        </Group>
        <Group gap="xs" justify="end">
          <Button variant="default" onClick={modals.closeAll}>
            Cancel
          </Button>
          <Button type="submit">Confirm</Button>
        </Group>
      </Stack>
    </form>
  );
}

function openEditModal(demo: Demo, index: number, onConfirm: () => void) {
  modals.open({
    title: "Edit bookmark",
    centered: true,
    children: <EditModal demo={demo} index={index} onConfirm={onConfirm} />,
  });
}

function openAddModal(demo: Demo, onConfirm: () => void) {
  modals.open({
    title: "Add bookmark",
    centered: true,
    children: <EditModal demo={demo} onConfirm={onConfirm} />,
  });
}

export default function EventsList({ demo }: EventsListProps) {
  const listRef = useRef<FixedSizeList>(null);

  const navigate = useNavigate();

  // TODO: gracefully update the state without causing the entire page to reload
  const reloadPage = () => {
    navigate(0);
  };

  const handleDelete = (index: number) => {
    openDeleteModal(demo.events[index], () => {
      const newEvents = [...demo.events];
      newEvents.splice(index, 1);

      setDemoEvents(demo.path, newEvents)
        .catch(log.error)
        .finally(reloadPage)
        .catch(log.error);
    });
  };

  const handleEdit = (index: number) => {
    openEditModal(demo, index, reloadPage);
  };

  const handleAdd = () => {
    openAddModal(demo, reloadPage);
  };

  return (
    <Stack h="100%">
      <Group justify="end">
        <Button onClick={handleAdd} leftSection={<IconPlus />} variant="light">
          Add Bookmark...
        </Button>
      </Group>
      <div style={{ flexGrow: 1 }}>
        <AutoSizer>
          {({ height, width }) => (
            <ScrollArea
              style={{ width, height }}
              onScrollPositionChange={({ y }) => listRef.current?.scrollTo(y)}
            >
              <FixedSizeList
                height={height}
                width={width}
                style={{ overflow: "visible" }}
                itemCount={demo.events.length}
                itemSize={40}
                ref={listRef}
              >
                {({ style, index }) => (
                  <div
                    style={{
                      ...style,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <EventBox
                      event={demo.events[index]}
                      onDelete={() => handleDelete(index)}
                      onEdit={() => handleEdit(index)}
                    />
                  </div>
                )}
              </FixedSizeList>
            </ScrollArea>
          )}
        </AutoSizer>
      </div>
    </Stack>
  );
}
