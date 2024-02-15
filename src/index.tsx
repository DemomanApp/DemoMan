import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { MantineProvider } from "@mantine/core";

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
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);
