/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import "core-js/stable";
import "regenerator-runtime/runtime";
import path from "path";
import {
  app,
  BrowserWindow,
  shell,
  Menu,
  nativeTheme,
  ipcMain,
} from "electron";
// import { autoUpdater } from "electron-updater";
import log from "electron-log";

import { resolveHtmlPath } from "./util";

import store from "../common/store";

require("@electron/remote/main").initialize();

ipcMain.on("update-theme", (_, newTheme) => {
  nativeTheme.themeSource = newTheme;
});

// export default class AppUpdater {
//   constructor() {
//     log.transports.file.level = "info";
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDevelopment) {
  require("electron-debug")();
}

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  nativeTheme.themeSource = store.get("theme");

  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // --debug switch increases verbosity in production
  if (app.commandLine.hasSwitch("debug") && !isDevelopment) {
    log.transports.console.level = "debug";
    log.transports.file.level = "debug";
    // electron-log disables IPC transport (needed for logging from the renderer)
    // for performance reasons when the app is packaged, unless this variable is set.
    process.env.ELECTRON_IS_DEV = "1";
    log.info("Debug mode enabled");
  } else {
    log.transports.console.level = "info";
    log.transports.file.level = "info";
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1536,
    height: 728,
    minWidth: 1225,
    minHeight: 695,
    useContentSize: true,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#303030" : "#fafafa",
    icon: getAssetPath("icon.png"),
    title: `${app.getName()} ${app.getVersion()}`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath("index.html"));
  require("@electron/remote/main").enable(mainWindow.webContents);

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  Menu.setApplicationMenu(null);

  // Open urls in the user's browser
  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
