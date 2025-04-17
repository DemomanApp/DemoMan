import { Badge, Group, Text } from "@mantine/core";

export default function Badges({
  items,
  max,
}: {
  items: string[];
  max: number;
}) {
  if (items.length === 0) {
    return null;
  }
  const overflowAmount = items.length - max;
  const shownItems = items.slice(0, max);
  return (
    <div style={{ display: "flex" }}>
      <Group gap={4}>
        {shownItems.map((item) => (
          <Badge
            key={item}
            variant="filled"
            size="sm"
            style={{ maxWidth: "100px" }}
          >
            {item}
          </Badge>
        ))}
        {overflowAmount > 0 && (
          <Text size="sm" c="dimmed">
            +{overflowAmount} more
          </Text>
        )}
      </Group>
    </div>
  );
}
