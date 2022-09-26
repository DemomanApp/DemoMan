import { CSSProperties, useState } from "react";
import { normalizeMapName } from "../util";

export type MapThumbnailProps = {
  mapName: string;
  style?: CSSProperties;
  className?: string;
  fallback: JSX.Element;
};

export default function MapThumbnail({
  mapName,
  style,
  className,
  fallback,
}: MapThumbnailProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadSucceeded, setLoadSucceeded] = useState(false);

  if (loadFailed) {
    return (
      <div style={style} className={className}>
        {fallback}
      </div>
    );
  }
  return (
    <img
      src={`/map_thumbnails/${normalizeMapName(mapName)}.png`}
      onError={() => setLoadFailed(true)}
      onLoad={() => setLoadSucceeded(true)}
      style={{ opacity: loadSucceeded ? 1 : 0, ...style }}
      className={className}
    />
  );
}
