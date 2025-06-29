import * as log from "@tauri-apps/plugin-log";
import { check, type Update } from "@tauri-apps/plugin-updater";

import { createContext, type ReactNode, useEffect, useState } from "react";

type UpdateState =
  | { status: "up_to_date" }
  | { status: "unknown" }
  | { status: "update_available"; update: Update };

export const UpdateStateContext = createContext<UpdateState>({
  status: "unknown",
});

export const UpdateStateProvider = ({ children }: { children: ReactNode }) => {
  const [updateState, setUpdateState] = useState<UpdateState>({
    status: "unknown",
  });

  useEffect(() => {
    check()
      .then((update) => {
        if (update !== null) {
          log.info(`found update ${update.version}`);

          setUpdateState({ status: "update_available", update });
        } else {
          setUpdateState({ status: "up_to_date" });
        }
      })
      .catch((reason) => {
        log.warn(`failed to fetch update: ${reason}`);
      });
  }, []);

  return (
    <UpdateStateContext.Provider value={updateState}>
      {children}
    </UpdateStateContext.Provider>
  );
};
