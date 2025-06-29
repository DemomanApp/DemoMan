import type { ReactNode } from "react";

import { Center } from "@mantine/core";

export default function Fill({ children }: { children: ReactNode }) {
  return <Center style={{ width: "100%", height: "100%" }}>{children}</Center>;
}
