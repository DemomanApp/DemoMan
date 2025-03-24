import { createBrowserRouter } from "react-router";

import DemosRoute from "./demos";
import DemoDirRoute from "./demos/demoDir";
import DemoDetailsRoute, {
  loader as demoDetailsLoader,
} from "./demos/demoDetails";
import SettingsView from "./settings";
import RconSetup from "./rconSetup";
import { loader as indexLoader } from "./IndexRoute";
import RootRoute from "./RootRoute";
import RconConsole from "./rconConsole";
import AboutRoute from "./AboutRoute";
import { Center } from "@mantine/core";

// Not really needed, but suppresses a warning
function HydrateFallback() {
  return <Center>Loading...</Center>;
}

export default createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    HydrateFallback,
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
          },
          {
            path: "dir/:path",
            element: <DemoDirRoute />,
          },
          {
            path: "show/:demoPath",
            element: <DemoDetailsRoute />,
            loader: demoDetailsLoader,
          },
        ],
      },
      {
        path: "settings",
        element: <SettingsView />,
      },
      {
        path: "about",
        element: <AboutRoute />,
      },
      {
        path: "rcon-setup",
        element: <RconSetup />,
      },
      {
        path: "rcon-console",
        element: <RconConsole />,
      },
    ],
  },
]);
