import { createBrowserRouter } from "react-router";

import DemosRoute from "./demos";
import DemoDirRoute from "./demos/demoDir";
import DemoDetailsRoute, {
  loader as demoDetailsLoader,
} from "./demos/demoDetails";
import SettingsView from "./settings";
import RconSetup from "./rconSetup";
import IndexRoute from "./IndexRoute";
import LocationOverlay from "./LocationOverlay";
import RconConsole from "./rconConsole";

export default createBrowserRouter([
  {
    path: "/",
    element: <LocationOverlay />,
    children: [
      {
        index: true,
        element: <IndexRoute />,
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
