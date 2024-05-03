import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import router from "./routes/router";
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
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>
);
