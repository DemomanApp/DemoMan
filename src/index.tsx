import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import "@fontsource-variable/hanken-grotesk";

import modals from "./modals";
import { RconProvider } from "./RconContext";
import router from "./routes/router";
import { UpdateStateProvider } from "./UpdateStateContext";
import "./globalExtensions";

import "./index.css";

// biome-ignore lint/style/noNonNullAssertion: there is always a root element
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        focusRing: "never",
        components: {
          Tooltip: {
            defaultProps: {
              transitionProps: {
                transition: "pop",
              },
            },
          },
        },
      }}
    >
      <UpdateStateProvider>
        <RconProvider>
          <ModalsProvider modals={modals}>
            <RouterProvider router={router} />
          </ModalsProvider>
        </RconProvider>
      </UpdateStateProvider>
    </MantineProvider>
  </StrictMode>
);
