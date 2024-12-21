import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as log from "@tauri-apps/plugin-log";

import { getFileArgument } from "@/api";

export default () => {
  // This is the first route the app loads.
  // TODO: Check the store first, then redirect to an
  //       appropriate destination (e.g. setup page if necessary)

  const [fileArgument, setFileArgument] = useState<string | null | undefined>(
    undefined
  );

  const navigate = useNavigate();

  getFileArgument()
    .then(setFileArgument)
    .catch((e) => log.error(`failed to get file argument: ${e}`));

  if (fileArgument === null) {
    navigate("/demos", { replace: true });
  } else if (typeof fileArgument == "string") {
    navigate("/demos", { replace: true });
    navigate(`/demos/show/${btoa(fileArgument)}`);
  }

  return null;
};
