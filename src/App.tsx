import React from "react";

import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";

import MainView from "./MainView";
import DemoDetailsView from "./DemoDetailsView";
import SetupView from "./SetupView";
import SettingsView from "./SettingsView";
import DemosProvider from "./DemosProvider";
import DemosContext from "./DemosContext";
import Theming from "./Theming";

export default function App() {
  return (
    <Theming>
      <DemosProvider>
        <MemoryRouter>
          <Routes>
            <Route
              index
              element={
                <DemosContext.Consumer>
                  {(value) => {
                    return value.setupNeeded ? (
                      <Navigate to="setup" />
                    ) : (
                      <Navigate to="demos" />
                    );
                  }}
                </DemosContext.Consumer>
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
