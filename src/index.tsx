import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { MantineProvider } from "@mantine/core";

import "./index.css";
import router from "./router";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      theme={{
        colorScheme: "dark",
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
      withNormalizeCSS
      withGlobalStyles
    >
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);
