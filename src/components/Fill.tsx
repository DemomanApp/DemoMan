import { Center } from "@mantine/core";
import type { ReactNode } from "react";

export default function Fill({ children }: { children: ReactNode }) {
  return <Center style={{ width: "100%", height: "100%" }}>{children}</Center>;
}
