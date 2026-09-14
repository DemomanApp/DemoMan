import * as log from "@tauri-apps/plugin-log";

import { useEffect, useMemo, useState } from "react";

import { Button, Group, Stack } from "@mantine/core";
import { type ContextModalProps, modals } from "@mantine/modals";

import { getKnownTags, setDemoTags } from "@/api";
import {
  TagSelector,
  type TagSelectorTag,
  type TagsState,
} from "@/components/TagSelector";
import type { Demo } from "@/demo";

export async function openTagMultipleDemosModal(
  demos: Demo[],
  onConfirm: () => void
) {
  modals.openContextModal({
    modal: "tag_multiple_demos",
    title: `Tag ${demos.length} demos`,
    centered: true,
    innerProps: {
      demos,
      onConfirm,
    },
  });
}

type TagMultipleDemosModalProps = { demos: Demo[]; onConfirm(): void };

export const TagMultipleDemosModal = ({
  context,
  id,
  innerProps: { demos, onConfirm },
}: ContextModalProps<TagMultipleDemosModalProps>) => {
  if (demos.length === 0) {
    return;
  }

  const [knownTags, setKnownTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    getKnownTags()
      .then((knownTags) => setKnownTags(new Set(knownTags)))
      .catch(log.error);
  }, []);

  const [tagUnion, tagIntersection] = useMemo(
    () =>
      demos.reduce<[Set<string>, Set<string>] | null>((accumulator, demo) => {
        if (accumulator === null) {
          return [new Set(demo.tags), new Set(demo.tags)];
        }

        const [tagUnion, tagIntersection] = accumulator;

        const tagSet = new Set(demo.tags);

        return [
          tagUnion.union(tagSet),
          tagIntersection.intersection(tagSet),
        ] as const;
      }, null),
    [demos]
  ) ?? [new Set(), new Set()];

  const allPossibleTags = useMemo(
    () => knownTags.union(tagUnion),
    [knownTags, tagUnion]
  );

  const initialTagState: TagsState = useMemo(
    () =>
      new Map(
        allPossibleTags.values().map((tag: string) => {
          const tagState =
            tagIntersection.has(tag) || (tagUnion.has(tag) ? undefined : false);

          return [tag, tagState] as TagSelectorTag;
        })
      ),
    [allPossibleTags, tagIntersection, tagUnion]
  );

  const [tagSelectorStateDiff, setTagSelectorStateDiff] = useState<
    Map<string, boolean>
  >(new Map());

  const tagSelectorState = useMemo(
    () =>
      new Map([
        ...initialTagState.entries(),
        ...tagSelectorStateDiff.entries(),
      ]),
    [tagSelectorStateDiff, initialTagState]
  );

  const handleTag = () => {
    const applyDiff = (oldTags: string[]) => {
      const tagSet = new Set(oldTags);

      for (const [tag, state] of tagSelectorStateDiff.entries()) {
        if (state === true) {
          tagSet.add(tag);
        } else {
          tagSet.delete(tag);
        }
      }

      return tagSet;
    };

    const demosAndNewTags = demos.map(
      (demo) => [demo, applyDiff(demo.tags)] as const
    );

    Promise.all(
      demosAndNewTags.map(([demo, newTags]) =>
        setDemoTags(demo.path, [...newTags]).catch(log.error)
      )
    ).finally(() => {
      context.closeModal(id);
      onConfirm();
    });
  };

  const handleChange = (tag: string, newState: boolean) => {
    setTagSelectorStateDiff((currentDiff) => {
      return new Map([...currentDiff, [tag, newState]]);
    });
  };

  return (
    <Stack gap="xs">
      <TagSelector state={tagSelectorState} onChange={handleChange} />
      <Group gap="xs" justify="end">
        <Button variant="default" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button onClick={handleTag} type="submit">
          Apply
        </Button>
      </Group>
    </Stack>
  );
};
