import { app, net, shell } from "@electron/remote";
import { useEffect, useState } from "react";

import semver from "semver";

import { Button, Divider } from "@mui/material";
import {
  GitHub as GitHubIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";

import ReactMarkdown from "react-markdown";

import SmallDialog from "../SmallDialog";
import AppBarButton from "../AppBarButton";

const API_ENDPOINT = "https://api.github.com/repos/Narcha/DemoMan/releases";

type Release = {
  changelog: string;
  semver: string;
  publishedDate: Date;
  url: string;
};

const currentVersion = app.getVersion();

export default () => {
  const [open, setOpen] = useState(false);
  const [newRelease, setNewRelease] = useState<Release | null>(null);

  useEffect(() => {
    // Check for updates
    const request = net.request(API_ENDPOINT);
    request.on("response", (response) => {
      response.on("data", (chunk) => {
        try {
          const latestReleaseObject = JSON.parse(chunk.toString())[0];

          const latestRelease: Release = {
            semver: latestReleaseObject.tag_name,
            changelog: latestReleaseObject.body,
            publishedDate: new Date(latestReleaseObject.published_at),
            url: latestReleaseObject.html_url,
          };
          if (semver.gt(latestRelease.semver, currentVersion))
            setNewRelease(latestRelease);
        } catch {
          // If something goes wrong, ignore the update. ¯\_(ツ)_/¯
        }
      });
    });
    request.end();
  }, []);

  return (
    <>
      {newRelease !== null && (
        <AppBarButton
          icon={<UpdateIcon />}
          tooltip="An update is available!"
          onClick={() => setOpen(true)}
          color="success"
        />
      )}
      <SmallDialog
        open={open}
        title="An update is available!"
        onClose={() => setOpen(false)}
        maxWidth="sm"
        actions={
          <>
            <Button variant="text" onClick={() => setOpen(false)}>
              Ignore
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => {
                if (newRelease !== null) {
                  shell.openExternal(newRelease.url);
                }
                setOpen(false);
              }}
              endIcon={<GitHubIcon />}
            >
              View on
            </Button>
          </>
        }
      >
        {/* If the dialog is open, this is always true */}
        {newRelease !== null && (
          <>
            Current version: {currentVersion}
            <br />
            Latest version: {newRelease.semver}
            <br />
            Uploaded on: {newRelease.publishedDate.toDateString()}
            <Divider>Changes</Divider>
            <ReactMarkdown>{newRelease.changelog}</ReactMarkdown>
          </>
        )}
      </SmallDialog>
    </>
  );
};
