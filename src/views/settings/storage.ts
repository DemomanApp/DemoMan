import { homeDir, join } from "@tauri-apps/api/path";
import { getTf2Dir } from "../../api";

/**
 * Gets the default platform-specific demo file storage directory.
 * Only supports Windows, Mac, and Linux.  This will return `null` if run on any other platform.
 */
export async function getDefaultDemosDir(): Promise<string | null> {
  const userHomeDir = await homeDir();

  // Try getting the TF2 game directory, falling back to the user home directory if it couldn't be found
  return await getTf2Dir()
    .then((tf2Dir) => join(tf2Dir, "tf", "demos"))
    .catch((_error) => userHomeDir);
}
