import {
  type ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useInterval } from "@mantine/hooks";

import { sendRconCommand } from "./api";
import useStore from "./hooks/useStore";

export type RconState =
  | { status: "connected" }
  | { status: "connection error"; reason: string }
  | { status: "unknown" };

export const RconContext = createContext<RconState>({ status: "unknown" });

export const RconProvider = ({ children }: { children: ReactNode }) => {
  const [rconState, setRconState] = useState<RconState>({ status: "unknown" });
  const [rconPassword, _setRconPassword] = useStore("rconPassword");

  const updateRconState = useCallback(async () => {
    try {
      const response = await sendRconCommand("echo ping", rconPassword);

      if (response === "ping \n") {
        setRconState({ status: "connected" });
      } else {
        setRconState({
          status: "connection error",
          reason: "Server returned an unexpected response",
        });
      }
    } catch (error) {
      setRconState({ status: "connection error", reason: error as string });
    }
  }, [rconPassword]);

  useInterval(updateRconState, 5000, { autoInvoke: true });

  useEffect(() => {
    updateRconState();
  }, [updateRconState]);

  return (
    <RconContext.Provider value={rconState}>{children}</RconContext.Provider>
  );
};
