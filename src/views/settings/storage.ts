import { homeDir } from "@tauri-apps/api/path";
import { type as osType } from "@tauri-apps/api/os";
import { getTf2Dir } from "../../api";

/**
 * Gets the default platform-specific demo file storage directory.
 * Only supports Windows, Mac, and Linux.  This will return `null` if run on any other platform.
 */
export async function getPlatformStorageDir(): Promise<string | null> {
  const type = await osType();
  const separator = type === "Windows_NT" ? "\\" : "/";
  const userHomeDir = await homeDir();

  // Try getting the TF2 game directory, falling back to the user home directory if it couldn't be found
  const tf2Dir = await getTf2Dir().catch((e) => userHomeDir);

  return [tf2Dir, "tf", "demos"]
    .join(separator)
    .replace(/[\\/]{2,}/, separator); // in case userHomeDir has a trailing slash
}
