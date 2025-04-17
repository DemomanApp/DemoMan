import { redirect, replace } from "react-router";

import { getFileArgument } from "@/api";

export async function loader() {
  // This is the first route the app loads.
  // TODO: Check the store first, then redirect to an
  //       appropriate destination (e.g. setup page if necessary)

  const fileArgument = await getFileArgument();

  if (fileArgument === null) {
    return replace("/demos");
  }

  history.replaceState(history.state, "", "/demos");
  return redirect(`/demos/show/${btoa(fileArgument)}`);
}
