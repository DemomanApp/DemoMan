import type { ReactNode } from "react";

import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

import { Alert, Button, Group, Stack } from "@mantine/core";
import { IconArrowLeft, IconBrandGithub } from "@tabler/icons-react";

import { Fill } from "@/components";

import classes from "./ErrorBoundary.module.css";

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  function ErrorBox({ children }: { children: ReactNode }) {
    return (
      <Fill>
        <Alert title="An error occurred" color="red" className={classes.alert}>
          <Stack>
            <p className={classes.errorText}>{children}</p>
            <Group>
              <Button
                color="gray"
                variant="outline"
                onClick={() => navigate(-1)}
                leftSection={<IconArrowLeft />}
              >
                Go back
              </Button>
              <Button
                color="gray"
                variant="outline"
                leftSection={<IconBrandGithub />}
                component="a"
                href="https://github.com/DemomanApp/DemoMan/issues/new/"
                target="_blank"
                rel="noreferrer"
              >
                Report issue on GitHub
              </Button>
            </Group>
          </Stack>
        </Alert>
      </Fill>
    );
  }

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorBox>
        {error.status} {error.statusText}
        <br />
        {error.data}
      </ErrorBox>
    );
  } else if (error instanceof Error) {
    return <ErrorBox>{error.message}</ErrorBox>;
  } else if (typeof error === "string") {
    return <ErrorBox>{error}</ErrorBox>;
  } else {
    return <ErrorBox>Unknown error: {JSON.stringify(error)}</ErrorBox>;
  }
}
