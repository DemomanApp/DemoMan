import * as log from "@tauri-apps/plugin-log";
import { relaunch } from "@tauri-apps/plugin-process";
import type { Update } from "@tauri-apps/plugin-updater";

import { useEffect, useRef, useState } from "react";

import {
  Alert,
  Button,
  Divider,
  Group,
  Loader,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { type ContextModalProps, modals } from "@mantine/modals";
import { IconBrandGithub, IconDownload } from "@tabler/icons-react";

import { intlFormatDistance } from "date-fns";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Result } from "@/types";
import { formatFileSize } from "@/util";

const API_ENDPOINT =
  "https://api.github.com/repos/DemomanApp/Demoman/releases/tags/";

export async function openUpdateModal(update: Update) {
  modals.openContextModal({
    modal: "update",
    title: "An update is available!",
    centered: true,
    size: "auto",
    innerProps: {
      update,
    },
  });
}

type UpdateModalProps = { update: Update };

export const UpdateModal = ({
  context,
  id,
  innerProps: { update },
}: ContextModalProps<UpdateModalProps>) => {
  type DownloadState =
    | "not_started"
    | "in_progress"
    | "installing"
    | "finished";

  // We save the downloaded bytes to this ref and update the react state periodically,
  // because the updates are too fast for useState and no intermediate state would be rendered.
  const downloadedBytesRef = useRef(0);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);

  const updateDownloadedBytesStateInterval = useInterval(() => {
    setDownloadedBytes(downloadedBytesRef.current);
  }, 100);

  const [downloadState, setDownloadState] =
    useState<DownloadState>("not_started");

  type GithubRelease = {
    changelog: string;
    releasePageUrl: string;
  };

  const [githubRelease, setGithubRelease] = useState<
    Result<GithubRelease, string> | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const response = await fetch(API_ENDPOINT + update.version);
      if (response.ok) {
        const bodyJson = await response.json();

        const changelog = bodyJson.body.replace(
          // Add links to github usernames
          /@(\S+)/g,
          "[@$1](https://github.com/$1)"
        );
        const releasePageUrl = bodyJson.html_url;

        setGithubRelease({
          success: true,
          data: { changelog, releasePageUrl },
        });
      } else {
        throw `GitHub API returned status code ${response.status} (${response.statusText})`;
      }
    })().catch((reason) => {
      setGithubRelease({ success: false, error: reason.toString() });
    });
  }, [update.version]);

  const handleUpdate = async () => {
    // TODO handle errors
    await update.downloadAndInstall((event) => {
      switch (event.event) {
        case "Started":
          log.info(`Starting download of ${event.data.contentLength} bytes`);
          setDownloadState("in_progress");
          setTotalBytes(event.data.contentLength ?? 0);
          downloadedBytesRef.current = 0;
          updateDownloadedBytesStateInterval.start();
          break;
        case "Progress":
          downloadedBytesRef.current += event.data.chunkLength;
          break;
        case "Finished":
          log.info("Download finished. Installing...");
          setDownloadState("installing");
          updateDownloadedBytesStateInterval.stop();
          break;
      }
    });

    log.info("Installation fished.");
    setDownloadState("finished");
  };

  const relativeReleaseDate =
    update.date !== undefined
      ? intlFormatDistance(new Date(update.date), Date.now(), {
          locale: "en-US",
        })
      : undefined;

  return (
    <Stack gap="xs">
      <div>
        Current version: <strong>{update.currentVersion}</strong> <br />
        New version: <strong>{update.version}</strong> <br />
        {relativeReleaseDate !== undefined && (
          <>
            Released: {relativeReleaseDate}
            <br />
          </>
        )}
      </div>
      {githubRelease === undefined ? (
        <Loader />
      ) : githubRelease.success ? (
        <Paper
          withBorder
          shadow="sm"
          radius="md"
          bg="dark"
          miw="400px"
          style={{ overflow: "hidden" }}
        >
          <Group justify="space-between" p="sm">
            <Text size="lg" fw="bold">
              Release notes
            </Text>
            <Button
              variant="outline"
              leftSection={<IconBrandGithub />}
              component="a"
              href={githubRelease.data.releasePageUrl}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </Button>
          </Group>
          <Divider />
          <ScrollArea.Autosize
            mah="300px"
            styles={{
              viewport: { paddingInlineStart: "var(--mantine-spacing-sm)" },
            }}
            offsetScrollbars
          >
            <Markdown
              remarkPlugins={[remarkGfm]} // Needed for links
              components={{
                a({ href, children, target: _target, rel: _rel, ...other }) {
                  return (
                    <a href={href} target="_blank" rel="noreferrer" {...other}>
                      {customChangelogLinkText(href) ?? children}
                    </a>
                  );
                },
              }}
            >
              {githubRelease.data.changelog}
            </Markdown>
          </ScrollArea.Autosize>
        </Paper>
      ) : (
        <Alert>Failed to fetch release notes: {githubRelease.error}</Alert>
      )}
      {downloadState === "not_started" && (
        <Group gap="xs" justify="end">
          <Button variant="default" onClick={() => context.closeModal(id)}>
            Ignore
          </Button>
          <Button
            onClick={handleUpdate}
            color="green"
            leftSection={<IconDownload />}
          >
            Install now
          </Button>
        </Group>
      )}
      {downloadState === "in_progress" && (
        <div>
          Downloading {formatFileSize(downloadedBytes)} of{" "}
          {formatFileSize(totalBytes)}...
          <Progress value={100 * (downloadedBytes / totalBytes)} />
        </div>
      )}
      {downloadState === "installing" && <div>Installing...</div>}
      {downloadState === "finished" && (
        <>
          <div>Update installed successfully.</div>
          <Group gap="xs" justify="end">
            <Button variant="default" onClick={() => context.closeModal(id)}>
              Restart later
            </Button>
            <Button onClick={relaunch}>Restart now</Button>
          </Group>
        </>
      )}
    </Stack>
  );
};

function customChangelogLinkText(href: string | undefined): string | undefined {
  if (href === undefined) {
    return undefined;
  }
  if (href.startsWith("https://github.com/DemomanApp/DemoMan/pull/")) {
    const prNumber = href.replace(
      /^https:\/\/github.com\/DemomanApp\/DemoMan\/pull\/(\d+).*/,
      "$1"
    );
    return `#${prNumber}`;
  }
  if (href.startsWith("https://github.com/DemomanApp/DemoMan/compare/")) {
    return href.replace(
      /^https:\/\/github.com\/DemomanApp\/DemoMan\/compare\/(.+)/,
      "$1"
    );
  }
  return undefined;
}
