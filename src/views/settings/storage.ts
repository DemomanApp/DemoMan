import { homeDir } from "@tauri-apps/api/path";
import { type as osType } from "@tauri-apps/api/os";

export const DEFAULT_STORAGE_DIRS = {
  Windows_NT: () => "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Team Fortress 2\\tf\\demos",
  Darwin: (userHome: string) => `${userHome}/Library/Application Support/Steam/steamapps/common/Team Fortress 2/tf/demos`,
  Linux: (userHome: string) => `${userHome}/.local/share/Steam/steamapps/common/Team Fortress 2/tf/demos`,
};

/**
 * Gets the default platform-specific demo file storage directory.
 * Only supports Windows, Mac, and Linux.  This will return `null` if run on any other platform.
 */
export async function getPlatformStorageDir(): Promise<string | null> {
  const type = await osType();
  const userHomeDir = await homeDir();

  if (Object.keys(DEFAULT_STORAGE_DIRS).includes(type)) {
    // eg setDefaultDir(DEFAULT_DIRS["Linux"]("/home/me/"))
    // regex replace to normalize multiple consecutive slashes (/home/me///.local/ becomes /home/me/.local/)
    return DEFAULT_STORAGE_DIRS[type](userHomeDir).replace(/\/{2,}/, "/");
  } else {
    return null;
  }
}
