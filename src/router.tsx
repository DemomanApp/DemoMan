import { createBrowserRouter } from "react-router-dom";

import HomeView from "./routes/home";
import DemoDetailsView, {
  loader as demoDetailsLoader,
  ErrorElement as DemoDetailsErrorElement,
} from "./routes/demoDetails";
import SettingsView from "./routes/settings";
import RconSetup from "./routes/rconSetup";

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
