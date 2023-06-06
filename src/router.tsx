import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import HomeView from "./views/home";
import DemoDetailsView, {
  loader as demoDetailsLoader,
  ErrorElement as DemoDetailsErrorElement,
} from "./views/demoDetails";
import SettingsView from "./views/settings";
import RconSetup from "./views/rconSetup";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
