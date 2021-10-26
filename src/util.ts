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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNodeError = (error: any): error is NodeJS.ErrnoException =>
  error instanceof Error && "code" in error;
