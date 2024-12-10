function plural_s(value: number, text: string) {
  return `${value} ${text}${value == 1 ? "" : "s"}`;
}

export function formatDuration(total_seconds: number): string {
  const seconds = Math.floor(total_seconds % 60);
  const minutes = Math.floor(total_seconds / 60) % 60;
  const hours = Math.floor(total_seconds / 3600);

  const seconds_str = plural_s(seconds, "second");
  if (total_seconds < 60) {
    return seconds_str;
  }

  const minutes_str = plural_s(minutes, "minute");
  if (total_seconds < 3600) {
    return minutes_str;
  }

  const hours_str = plural_s(hours, "hour");
  return `${hours_str}, ${minutes_str}`;
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "kB", "MB", "GB", "TB"];
  let size = bytes;
  let i = 0;
  while (size >= 1000 && i < units.length - 1) {
    size /= 1000;
    i += 1;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

// Explanation:
// Regex pattern  : Example
// -------------- : --------------
// final\d*       : final, final1
// rc\d+[a-z]*    : rc1, rc3a
// rcx            : rcx
// [a-z]\d+[a-z]* : a2, b12x, v3b
// [a-z]          : single letters, for maps like koth_lakeside_r
// beta\d*[a-z]*  : beta, beta1b
// nb\d+          : nb7 (no idea what it means, but ashville uses it in one version)
// fix            : _fix suffix
//
// See https://www.debuggex.com/r/LroqdOxfjME38MNu
// for a visualization of this regex along with a few test cases
// extracted from real map names
const mapSuffixRegex =
  /^(final\d*|rc\d+[a-z]*|rcx|[a-z]\d+[a-z]*|[a-z]|beta\d+[a-z]*|nb\d+|fix)$/;

/**
 * Normalize a map name by removing suffixes such as _rc1, _final, _v3 and so on.
 * This is used to show the same map thumbnail for every version of the map.
 *
 * @param mapName The full name of the map
 */
export function normalizeMapName(mapName: string) {
  const mapNameParts = mapName.toLowerCase().split("_");
  return mapNameParts
    .filter(
      (part, i) =>
        !(
          // Only filter out parts after the second part, just in case a map has
          // a name that matches the suffix regex
          (i > 1 && mapSuffixRegex.test(part))
        )
    )
    .join("_");
}

/// `drop(key)` returns a function that returns its argument,
/// but without the key `key`. Useful as an argument to `useState` setters.
export function drop<V>(key: string) {
  return ({ [key]: _key, ...rest }: Record<string, V>): Record<string, V> =>
    rest;
}

export function decodeParam(param: string | undefined): string | undefined {
  return param === undefined ? undefined : atob(param);
}
