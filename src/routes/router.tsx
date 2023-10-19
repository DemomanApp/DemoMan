import { createBrowserRouter } from "react-router-dom";

import HomeView from "./home";
import DemoDetailsView, {
  loader as demoDetailsLoader,
  ErrorElement as DemoDetailsErrorElement,
} from "./demoDetails";
import SettingsView from "./settings";
import RconSetup from "./rconSetup";

export default createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <HomeView />,
      },
      {
        path: "demo/:demoName/:activeTab",
        element: <DemoDetailsView />,
        loader: demoDetailsLoader,
        errorElement: <DemoDetailsErrorElement />,
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
