import React from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stack from "@mui/material/Stack";
import ForwardIcon from "@mui/icons-material/ArrowForwardIos";
import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import Card from "@mui/material/Card";

import PageLayout from "./PageLayout";

type StepType = {
  key: number;
  name: string;
  element: JSX.Element;
};

const steps: StepType[] = [
  {
    key: 0,
    name: "Welcome",
    element: (
      <Card
        sx={{
          width: "700px",
          height: "500px",
        }}
      >
        <Stack alignItems="center">
          <Typography variant="h4" component="span">
            Thank you for installing DemoMan!
          </Typography>
        </Stack>
      </Card>
    ),
  },
  {
    key: 1,
    name: "Select your demo location",
    element: (
      <Card
        sx={{
          width: "300px",
          height: "500px",
        }}
      >
        2
      </Card>
    ),
  },
  {
    key: 2,
    name: "Choose a theme",
    element: (
      <Card
        sx={{
          width: "300px",
          height: "500px",
        }}
      >
        3
      </Card>
    ),
  },
  {
    key: 3,
    name: "Done",
    element: (
      <Card
        sx={{
          width: "300px",
          height: "500px",
        }}
      >
        4
      </Card>
    ),
  },
];

export default function SetupView() {
  const [step, setStep] = React.useState(0);

  return (
    <>
      <PageLayout center={<Typography variant="h5">Setup</Typography>}>
        <Container sx={{ height: "100%" }}>
          <Stack height="100%" justifyContent="space-between">
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {steps.map((e: { key: number; element: JSX.Element }) => {
                const offset = e.key - step;
                return (
                  <Box
                    key={e.key}
                    sx={{
                      position: "absolute",
                      transition: "opacity 500ms, transform 500ms",
                      opacity: offset === 0 ? 1 : 0,
                      transform: `translateX(${200 * offset}px) scale(${
                        offset === 0 ? 1 : 0.8
                      })`,
                    }}
                  >
                    {e.element}
                  </Box>
                );
              })}
            </Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              justifySelf="flex-end"
              paddingBottom="8px"
            >
              <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
                <Button
                  onClick={() => {
                    setStep(step - 1);
                  }}
                  disabled={step === 0}
                  variant="outlined"
                >
                  <BackIcon /> Previous
                </Button>
              </Box>
              <Stepper
                alternativeLabel
                activeStep={step}
                sx={{
                  flexGrow: 5,
                  flexBasis: 0,
                  userSelect: "none",
                  paddingTop: "6px",
                }}
              >
                {steps.map(({ name, key }) => (
                  <Step key={key}>
                    <StepLabel>{name}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
                {step === steps.length - 1 ? (
                  <Button onClick={() => {}} variant="contained">
                    Finish
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setStep(step + 1);
                    }}
                    variant="contained"
                  >
                    Next <ForwardIcon />
                  </Button>
                )}
              </Box>
            </Stack>
          </Stack>
        </Container>
      </PageLayout>
    </>
  );
}
