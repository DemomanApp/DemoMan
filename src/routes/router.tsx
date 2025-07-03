import { createBrowserRouter } from "react-router";

import { Center } from "@mantine/core";

import AboutRoute from "./AboutRoute";
import DemosRoute from "./demos";
import DemoDetailsRoute, {
  loader as demoDetailsLoader,
} from "./demos/demoDetails";
import DemoDirRoute from "./demos/demoDir";
import ErrorBoundary from "./ErrorBoundary";
import { loader as indexLoader } from "./IndexRoute";
import RootRoute from "./RootRoute";
import RconConsole from "./rconConsole";
import RconSetup from "./rconSetup";
import SettingsView from "./settings";

// Not really needed, but suppresses a warning
function HydrateFallback() {
  return <Center>Loading...</Center>;
}

export default createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    HydrateFallback,
    ErrorBoundary,
    children: [
      {
        index: true,
        element: null,
        loader: indexLoader,
      },
      {
        path: "demos",
        children: [
          {
            index: true,
            element: <DemosRoute />,
            ErrorBoundary,
          },
          {
            path: "dir/:path",
            element: <DemoDirRoute />,
            ErrorBoundary,
          },
          {
            path: "show/:demoPath",
            element: <DemoDetailsRoute />,
            loader: demoDetailsLoader,
            ErrorBoundary,
          },
        ],
      },
      {
        path: "settings",
        element: <SettingsView />,
        ErrorBoundary,
      },
      {
        path: "about",
        element: <AboutRoute />,
        ErrorBoundary,
      },
      {
        path: "rcon-setup",
        element: <RconSetup />,
        ErrorBoundary,
      },
      {
        path: "rcon-console",
        element: <RconConsole />,
        ErrorBoundary,
      },
    ],
  },
]);
