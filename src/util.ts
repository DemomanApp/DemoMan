function leftPadTwo(val: string) {
  return `00${val}`.slice(-Math.max(val.length, 2));
}

export function formatPlaybackTime(seconds: number): string {
  const fSeconds = Math.floor(seconds % 60);
  const tMinutes = Math.floor(seconds / 60);
  const fMinutes = tMinutes % 60;
  const fHours = Math.floor(tMinutes / 60);
  /* eslint-disable */
  // prettier-ignore
  return `${
	  leftPadTwo(fHours.toString())}:${
	  leftPadTwo(fMinutes.toString())}:${
	  leftPadTwo(fSeconds.toString())}`;
  /* eslint-enable */
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
// final\d*       : final, final1
// rc\d+[a-z]*    : rc1, rc3a
// rcx            : rcx
// [a-z]\d+[a-z]* : a2, b12x, v3b
// [a-z]          : single letters, for maps like koth_lakeside_r
// beta\d*[a-z]*  : beta, beta1b
// fix            : _fix suffix
// pro            : _pro suffix (community competitive map edits)
//
// See https://www.debuggex.com/r/j5BJ9jpaoj9MD9vB
// for a visualization of this regex along with a few test cases
// extracted from real map names
const mapSuffixRegex =
  /^(final\d*|rc\d+[a-z]*|rcx|[a-z]\d+[a-z]*|[a-z]|beta\d+[a-z]*|fix|pro)$/;

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

