import { homeDir, join } from "@tauri-apps/api/path";

import { getTf2Dir } from "@/api";

/**
 * Gets the default platform-specific demo file storage directory, assuming Steam and TF2 are installed on the local
 * machine.  Falls back to the user's home directory if neither is found.
 */
export async function getDefaultDemosDir(): Promise<string> {
  try {
    const Tf2Dir = await getTf2Dir();
    return join(Tf2Dir, "tf", "demos");
  } catch {
    return homeDir();
  }
}
