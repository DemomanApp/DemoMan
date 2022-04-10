import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";

import MainView from "./MainView";
import DemoDetailsView from "./DemoDetailsView";
import SetupView from "./SetupView";
import SettingsView from "./SettingsView";
import DemosProvider from "./DemosProvider";
import Theming from "./Theming";
import store from "../common/store";

export default function App() {
  return (
    <Theming>
      <DemosProvider>
        <MemoryRouter>
          <Routes>
            <Route
              index
              element={
                store.get("setup_completed") ? (
                  <Navigate to="demos" />
                ) : (
                  <Navigate to="setup" />
                )
              }
            />
            <Route path="setup" element={<SetupView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="demos">
              <Route index element={<MainView />} />
              <Route path=":name" element={<DemoDetailsView />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </DemosProvider>
    </Theming>
  );
}
