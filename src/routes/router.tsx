import { createBrowserRouter } from "react-router-dom";

import DemosRoute from "./demos";
import DemoDirRoute, {
  loader as demoDirLoader,
  ErrorElement as DemoDirErrorElement,
} from "./demos/demoDir";
import DemoDetailsRoute, {
  loader as demoDetailsLoader,
  ErrorElement as DemoDetailsErrorElement,
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
            path: ":demoDirId",
            element: <DemoDirRoute />,
            loader: demoDirLoader,
            errorElement: <DemoDirErrorElement />,
          },
          {
            path: ":demoDirId/:demoName",
            element: <DemoDetailsRoute />,
            loader: demoDetailsLoader,
            errorElement: <DemoDetailsErrorElement />,
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
