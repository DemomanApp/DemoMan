import { memo } from "react";

const MAP_THUMBNAILS = import.meta.glob<true, string, string>(
  "../assets/map_thumbnails/*.png",
  {
    query: "?url",
    import: "default",
    eager: true,
  }
);

function getThumbnail(mapName: string): string | undefined {
  const mapNameParts = mapName.toLowerCase().split("_");

  while (mapNameParts.length > 0) {
    const partialName = mapNameParts.join("_");
    const thumbnail =
      MAP_THUMBNAILS[`../assets/map_thumbnails/${partialName}.png`];

    if (thumbnail !== undefined) {
      return thumbnail;
    }

    mapNameParts.pop();
  }

  return undefined;
}

export type MapThumbnailProps = {
  mapName: string;
  className?: string;
  fallback: JSX.Element;
};

export default memo(function MapThumbnail({
  mapName,
  className,
  fallback,
}: MapThumbnailProps) {
  const thumbnail = getThumbnail(mapName);
  if (thumbnail === undefined) {
    return <div className={className}>{fallback}</div>;
  }
  return <img src={thumbnail} className={className} alt={`Thumbnail for ${mapName}`} />;
});
