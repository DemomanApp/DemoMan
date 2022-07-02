import { app, shell } from "@electron/remote";

import {
  Button,
  DialogContentText,
  Divider,
  Grid,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
} from "@mui/material";
import {
  GitHub as GitHubIcon,
  VolunteerActivism as DonationIcon,
} from "@mui/icons-material";

import SmallDialog from "../SmallDialog";

const DiscordIcon = () => (
  <SvgIcon>
    <g transform="matrix(0.33802817,0,0,0.33802817,-3.7161896e-8,2.7141786)">
      <path
        d="M 60.1045,4.8978 C 55.5792,2.8214 50.7265,1.2916 45.6527,0.41542 45.5603,0.39851 45.468,0.440769 45.4204,0.525289 44.7963,1.6353 44.105,3.0834 43.6209,4.2216 38.1637,3.4046 32.7345,3.4046 27.3892,4.2216 26.905,3.0581 26.1886,1.6353 25.5617,0.525289 25.5141,0.443589 25.4218,0.40133 25.3294,0.41542 20.2584,1.2888 15.4057,2.8186 10.8776,4.8978 10.8384,4.9147 10.8048,4.9429 10.7825,4.9795 1.57795,18.7309 -0.943561,32.1443 0.293408,45.3914 c 0.005597,0.0648 0.041978,0.1268 0.092353,0.1662 6.072899,4.4598 11.955539,7.1673 17.728939,8.9619 0.0924,0.0282 0.1903,-0.0056 0.2491,-0.0817 1.3657,-1.865 2.5831,-3.8315 3.6269,-5.8995 0.0616,-0.1211 0.0028,-0.2648 -0.1231,-0.3127 -1.931,-0.7325 -3.7697,-1.6256 -5.5384,-2.6398 -0.1399,-0.0817 -0.1511,-0.2818 -0.0224,-0.3776 0.3722,-0.2789 0.7445,-0.5691 1.0999,-0.8621 0.0643,-0.0535 0.1539,-0.0648 0.2295,-0.031 11.6196,5.3051 24.1992,5.3051 35.6817,0 0.0756,-0.0366 0.1652,-0.0253 0.2323,0.0282 0.3555,0.293 0.7277,0.586 1.1027,0.8649 0.1287,0.0958 0.1203,0.2959 -0.0196,0.3776 -1.7687,1.0339 -3.6074,1.9073 -5.5412,2.637 -0.1259,0.0479 -0.1819,0.1944 -0.1203,0.3155 1.0662,2.0651 2.2836,4.0316 3.6241,5.8967 0.056,0.0789 0.1567,0.1127 0.2491,0.0845 5.8014,-1.7946 11.684,-4.5021 17.7569,-8.9619 0.0532,-0.0394 0.0868,-0.0986 0.0924,-0.1634 C 72.1747,30.0791 68.2147,16.7757 60.1968,4.9823 60.1772,4.9429 60.1437,4.9147 60.1045,4.8978 Z M 23.7259,37.3253 c -3.4983,0 -6.3808,-3.2117 -6.3808,-7.156 0,-3.9443 2.8266,-7.156 6.3808,-7.156 3.5821,0 6.4367,3.2399 6.3807,7.156 0,3.9443 -2.8266,7.156 -6.3807,7.156 z m 23.5919,0 c -3.4982,0 -6.3807,-3.2117 -6.3807,-7.156 0,-3.9443 2.8265,-7.156 6.3807,-7.156 3.5822,0 6.4367,3.2399 6.3808,7.156 0,3.9443 -2.7986,7.156 -6.3808,7.156 z"
        fill="#ffffff"
        id="path2"
      />
    </g>
  </SvgIcon>
);

type AboutDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function AboutDialog(props: AboutDialogProps) {
  const { open, onClose } = props;

  return (
    <SmallDialog
      title="About DemoMan"
      open={open}
      onClose={onClose}
      actions={
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={6} textAlign="end">
          Version
        </Grid>
        <Grid item xs={6}>
          {app.getVersion()}
        </Grid>
      </Grid>
      <DialogContentText>
        Please report any issues you encounter and submit feedback and
        suggestions on Discord or GitHub. DemoMan is developed by a single
        developer in his free time, you can help keep development going by
        donating items. Thank you!
      </DialogContentText>
      <Divider>Links</Divider>
      <Stack direction="row" justifyContent="center" width="100%">
        <Tooltip title="Open the GitHub page">
          <IconButton
            onClick={() =>
              shell.openExternal("https://github.com/Narcha/DemoMan")
            }
          >
            <GitHubIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Visit the Discord server">
          <IconButton
            onClick={() =>
              shell.openExternal("https://discord.com/invite/GduKxhYFhR")
            }
          >
            <DiscordIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Donate items">
          <IconButton
            onClick={() =>
              shell.openExternal(
                "https://steamcommunity.com/tradeoffer/new/?partner=210105919&token=M-TvzRQf"
              )
            }
          >
            <DonationIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </SmallDialog>
  );
}
