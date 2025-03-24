import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import "@fontsource-variable/hanken-grotesk";

import router from "./routes/router";
import modals from "./modals";
import { RconProvider } from "./RconContext";
import "./globalExtensions";

import "./index.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      <RconProvider>
        <ModalsProvider modals={modals}>
          <RouterProvider router={router} />
        </ModalsProvider>
      </RconProvider>
    </MantineProvider>
  </StrictMode>
);
