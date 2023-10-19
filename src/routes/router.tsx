import { createBrowserRouter } from "react-router-dom";

import DemosRoute from "./demos";
import DemoDirRoute from "./demos/demoDir";
import DemoDetailsRoute, {
  loader as demoDetailsLoader,
  ErrorElement as DemoDetailsErrorElement,
} from "./demos/demoDir/demoDetails";
import SettingsView from "./settings";
import RconSetup from "./rconSetup";
import IndexRoute from "./IndexRoute";

export default createBrowserRouter([
  {
    path: "/",
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
            children: [
              {
                path: ":demoName",
                element: <DemoDetailsRoute />,
                loader: demoDetailsLoader,
                errorElement: <DemoDetailsErrorElement />,
              },
            ],
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
