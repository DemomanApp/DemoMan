function plural_s(value: number, text: string) {
  return `${value} ${text}${value === 1 ? "" : "s"}`;
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

/// `drop(key)` returns a function that returns its argument,
/// but without the key `key`. Useful as an argument to `useState` setters.
export function drop<V>(key: string) {
  return ({ [key]: _key, ...rest }: Record<string, V>): Record<string, V> =>
    rest;
}

export function decodeParam(param: string | undefined): string | undefined {
  return param === undefined ? undefined : atob(param);
}
