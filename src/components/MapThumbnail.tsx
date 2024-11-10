import { normalizeMapName } from "@/util";

const MAP_THUMBNAILS = import.meta.glob<true, string, string>(
  "../assets/map_thumbnails/*.png",
  {
    query: "?url",
    import: "default",
    eager: true,
  }
);

function getThumbnail(mapName: string) {
  return MAP_THUMBNAILS[`../assets/map_thumbnails/${mapName}.png`];
}

export type MapThumbnailProps = {
  mapName: string;
  className?: string;
  fallback: JSX.Element;
};

export default function MapThumbnail({
  mapName,
  className,
  fallback,
}: MapThumbnailProps) {
  const thumbnail = getThumbnail(normalizeMapName(mapName));
  if (thumbnail === undefined) {
    return <div className={className}>{fallback}</div>;
  }
  return <img src={thumbnail} className={className} />;
}
