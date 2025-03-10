import { Outlet, useLocation } from "react-router";

import useStore from "@/hooks/useStore";
import { NavigationProgress } from "@/components";
import "./RootRoute.css"; // Import the CSS file

export default function LocationOverlay() {
  const [enableLocationOverlay] = useStore("enableLocationOverlay");
  const location = useLocation();

  return (
    <>
      <NavigationProgress />
      {enableLocationOverlay && (
        <div className="locationOverlay">
          <div>
            <b>Path</b> {location.pathname}
          </div>
          <div>
            <b>Search</b> {location.search}
          </div>
          <div>
            <b>Hash</b> {location.hash}
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
}