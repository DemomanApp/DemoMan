import { homeDir, join } from "@tauri-apps/api/path";
import { getTf2Dir } from "../../api";

/**
 * Gets the default platform-specific demo file storage directory, assuming Steam and TF2 are installed on the local
 * machine.  Falls back to the user's home directory if neither is found.
 */
export async function getDefaultDemosDir(): Promise<string> {
  const userHomeDir = await homeDir();

  // Try getting the TF2 game directory, falling back to the user home directory if it couldn't be found
  return await getTf2Dir()
    .then((tf2Dir) => join(tf2Dir, "tf", "demos"))
    .catch((_error) => userHomeDir);
}
