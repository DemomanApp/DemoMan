import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  ArrowForwardIos as ForwardIcon,
  ArrowBackIosNew as BackIcon,
  FolderOpen as FolderIcon,
  Brightness3 as DarkThemeIcon,
  Brightness7 as LightThemeIcon,
  Done as DoneIcon,
} from "@mui/icons-material";

import PageLayout from "./PageLayout";
import AppIcon from "../../assets/icons/1024x1024.png";
import getDemoPath from "./GetDemoPath";
import ThemeContext from "./ThemeContext";

import useStore from "./hooks/useStore";
import store from "../common/store";

type StepType = {
  key: number;
  name: string;
  element: JSX.Element;
};

export default function SetupView() {
  const [step, setStep] = useState(0);
  const { theme, setTheme } = useContext(ThemeContext);
  const [demoPath, setDemoPath] = useStore("demo_path");
  const navigate = useNavigate();

  const steps: StepType[] = [
    {
      key: 0,
      name: "Welcome",
      element: (
        <Box>
          <Stack alignItems="center" spacing={2} height="100%">
            <img src={AppIcon} alt="logo" width="300px" />
            <Typography variant="h4">
              Thank you for installing DemoMan!
            </Typography>
            <Typography variant="body1">
              Just a few things before you get started...
            </Typography>
          </Stack>
        </Box>
      ),
    },
    {
      key: 1,
      name: "Select your demo location",
      element: (
        <Box>
          <Stack alignItems="center" spacing={2} height="100%">
            <Typography variant="h5">
              Where do you keep your demo files?
            </Typography>
            <Button
              onClick={async () => {
                const { canceled, filePaths } = await getDemoPath();
                if (!canceled) {
                  setDemoPath(filePaths[0]);
                }
              }}
              variant="contained"
              endIcon={<FolderIcon />}
            >
              Choose
            </Button>
            {demoPath !== undefined && (
              <Typography variant="body2" color="GrayText">
                {demoPath}
              </Typography>
            )}
          </Stack>
        </Box>
      ),
    },
    {
      key: 2,
      name: "Choose a theme",
      element: (
        <Box>
          <Stack
            alignItems="center"
            justifyContent="space-around"
            spacing={2}
            height="100%"
          >
            <Typography variant="h5">Choose your preferred theme.</Typography>
            <ToggleButtonGroup
              value={theme}
              exclusive
              size="large"
              color="primary"
              onChange={(_, value) => {
                if (value !== null) {
                  setTheme(value);
                }
              }}
            >
              <ToggleButton value="dark">
                <DarkThemeIcon sx={{ width: "32px", height: "32px" }} />
              </ToggleButton>
              <ToggleButton value="light">
                <LightThemeIcon sx={{ width: "32px", height: "32px" }} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
      ),
    },
    {
      key: 3,
      name: "Done",
      element: (
        <Box>
          <Stack
            alignItems="center"
            justifyContent="space-around"
            spacing={2}
            height="100%"
          >
            <Typography variant="h5">You&apos;re all set.</Typography>
            Have fun using DemoMan. Please report any bugs you come across and
            submit feedback on the GitHub page.
          </Stack>
        </Box>
      ),
    },
  ];

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
                  fullWidth
                  startIcon={<BackIcon />}
                >
                  Previous
                </Button>
              </Box>
              <Stepper
                alternativeLabel
                activeStep={step}
                sx={{
                  flexGrow: 7,
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
                  <Button
                    onClick={() => {
                      store.set("setup_completed", true);
                      navigate("/demos");
                    }}
                    variant="contained"
                    fullWidth
                    endIcon={<DoneIcon />}
                  >
                    Finish
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setStep(step + 1);
                    }}
                    variant="contained"
                    disabled={step === 1 && demoPath === undefined}
                    fullWidth
                    endIcon={<ForwardIcon />}
                  >
                    Next
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
