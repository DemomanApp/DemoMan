import { useLocation } from "react-router";

import { AppShell } from "@/AppShell";
import { NavigationProgress } from "@/components";
import useStore from "@/hooks/useStore";

import classes from "./RootRoute.module.css";

export default function RootRoute() {
  const [enableLocationOverlay] = useStore("enableLocationOverlay");
  const location = useLocation();

  return (
    <>
      <NavigationProgress />
      {enableLocationOverlay && (
        <div className={classes.locationOverlay}>
          <div className={classes.locationOverlayItem}>
            <b>Path</b> {location.pathname}
          </div>
          <div className={classes.locationOverlayItem}>
            <b>Search</b> {location.search}
          </div>
          <div className={classes.locationOverlayItem}>
            <b>Hash</b> {location.hash}
          </div>
          <div className={classes.locationOverlayItem}>
            <b>State</b> {JSON.stringify(location.state)}
          </div>
        </div>
      )}
      <AppShell />
    </>
  );
}
