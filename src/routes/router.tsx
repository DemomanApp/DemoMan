import { createBrowserRouter } from "react-router-dom";

import DemosRoute from "./demos";
import DemoDirRoute, { loader as demoDirLoader } from "./demos/demoDir";
import DemoDetailsRoute, {
  loader as demoDetailsLoader,
} from "./demos/demoDir/demoDetails";
import SettingsView from "./settings";
import RconSetup from "./rconSetup";
import IndexRoute from "./IndexRoute";
import LocationOverlay from "./LocationOverlay";

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
            path: "dir/:demoDirPath",
            element: <DemoDirRoute />,
            loader: demoDirLoader,
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
    ],
  },
]);
