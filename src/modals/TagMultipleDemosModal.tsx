import * as log from "@tauri-apps/plugin-log";

import { useEffect, useMemo, useState } from "react";

import { Button, Group, Stack } from "@mantine/core";
import { type ContextModalProps, modals } from "@mantine/modals";

import { getKnownTags } from "@/api";
import {
  TagSelector,
  TagSelectorState,
  type TagSelectorTag,
} from "@/components/TagSelector";
import type { Demo } from "@/demo";
import { difference, intersection, union } from "@/util";

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
  const [knownTags, setKnownTags] = useState<Set<string>>(new Set());
  const [newTags, setNewTags] = useState<Set<string>>(new Set());
  const [tagsFromDemos, setTagsFromDemos] = useState<
    Record<string, TagSelectorState>
  >({});

  useEffect(() => {
    getKnownTags()
      .then((knownTags) => setKnownTags(new Set(knownTags)))
      .catch(log.error);
  });

  useEffect(() => {
    demos.reduce((accumulator, demo) => {
      accumulator.entries();

      return accumulator;
    }, new Map());
  }, [demos]);

  const allPossibleTags = useMemo(
    () => union(knownTags, newTags),
    [knownTags, newTags, tagsFromDemos]
  );

  const tagsUnionAndIntersection = useMemo(
    () =>
      demos.reduce<[Set<string>, Set<string>] | null>((accumulator, demo) => {
        if (accumulator === null) {
          return [new Set(demo.tags), new Set(demo.tags)];
        }

        const [tagUnion, tagIntersection] = accumulator;

        const tagSet = new Set(demo.tags);

        return [
          union(tagUnion, tagSet),
          intersection(tagIntersection, tagSet),
        ] as const;
      }, null),
    [demos]
  );

  // should never be reached
  if (tagsUnionAndIntersection === null) {
    return;
  }

  const foo = {};

  const [tagUnion, tagIntersection] = tagsUnionAndIntersection;
  const indeterminateTags = difference(tagUnion, tagIntersection);
  const unusedKnownTags =
    knownTags === null ? new Set() : difference(knownTags, tagUnion);

  const initialTags: TagSelectorTag[] = [
    ...[...tagIntersection].map((tag) => [tag, true] as TagSelectorTag),
    ...[...indeterminateTags].map((tag) => [tag, undefined] as TagSelectorTag),
    ...[...unusedKnownTags].map((tag) => [tag, false] as TagSelectorTag),
  ];

  console.log(tagUnion, tagIntersection);

  const [tagSelectorState, setTagSelectorState] = useState(initialTags);

  const handleTag = () => {
    // Promise.all(demos.map((demo) => deleteDemo(demo.path, !skipTrash)))
    //   .catch(log.error)
    //   .finally(onConfirm);
  };

  return (
    <Stack gap="xs">
      <TagSelector state={tagSelectorState} setState={setTagSelectorState} />
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
