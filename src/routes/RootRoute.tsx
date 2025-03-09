import { Outlet, useLocation } from "react-router";

import useStore from "@/hooks/useStore";
import { NavigationProgress } from "@/components";

export default function LocationOverlay() {
  const [enableLocationOverlay] = useStore("enableLocationOverlay");
  const location = useLocation();

  return (
    <>
      <NavigationProgress />
      {enableLocationOverlay && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            display: "flex",
            gap: "var(--mantine-spacing-xs)",
            justifyContent: "center",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--mantine-color-default)",
              padding: 4,
            }}
          >
            <b>Path</b> {location.pathname}
          </div>
          <div
            style={{
              backgroundColor: "var(--mantine-color-default)",
              padding: 4,
            }}
          >
            <b>Search</b> {location.search}
          </div>
          <div
            style={{
              backgroundColor: "var(--mantine-color-default)",
              padding: 4,
            }}
          >
            <b>Hash</b> {location.hash}
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
}
