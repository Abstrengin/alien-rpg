import { app, BrowserWindow, Menu, shell, dialog, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check for explicit dev mode flag from npm script
// In production, this will be false since app-root-path won't point to localhost
const isDevMode = process.env.ELECTRON_IS_DEV === "true";

let mainWindow;
let splashScreen;
let autoUpdater = null;

// Try to load electron-updater, but don't crash if it's missing
(async () => {
  try {
    const pkg = await import("electron-updater");
    autoUpdater = pkg.autoUpdater;

    // Configure auto-updater only in production
    if (!isDevMode) {
      autoUpdater.checkForUpdatesAndNotify();
    }
  } catch {
    console.log("electron-updater not available, skipping auto-updates");
  }
})();

// Handle update events (only if autoUpdater is available)
if (autoUpdater) {
  autoUpdater.on("update-available", () => {
    if (mainWindow) {
      mainWindow.webContents.send("update-available");
    }
  });

  autoUpdater.on("update-progress", (progressObj) => {
    if (mainWindow) {
      mainWindow.webContents.send("update-progress", {
        bytesPerSecond: progressObj.bytesPerSecond,
        percent: progressObj.percent,
        total: progressObj.total,
        transferred: progressObj.transferred,
      });
    }
  });

  autoUpdater.on("update-downloaded", () => {
    if (mainWindow) {
      mainWindow.webContents.send("update-downloaded");
    }
  });
}

// Handle IPC event for restarting to install update
ipcMain.on("app-update:restart", () => {
  if (autoUpdater) {
    autoUpdater.quitAndInstall();
  }
});

function createSplashScreen() {
  splashScreen = new BrowserWindow({
    width: 600,
    height: 400,
    show: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const splashHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Loading...</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #fff;
          overflow: hidden;
        }
        .splash-container {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          z-index: 1000;
        }
        .logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }
        .icon {
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 48px;
        }
        .app-title {
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -0.5px;
          color: #fff;
        }
        .app-subtitle {
          font-size: 14px;
          color: #a0a0b0;
          margin-top: -10px;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #00d4ff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading-text {
          font-size: 14px;
          color: #808090;
          margin-top: 20px;
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <div class="splash-container">
        <div class="logo-container">
          <div class="icon">🚀</div>
          <div>
            <div class="app-title">Alien RPG Star System Generator</div>
            <div class="app-subtitle">Ties That Bind Gaming™</div>
          </div>
        </div>
        <div class="loading-spinner"></div>
        <div class="loading-text">INITIALIZING...</div>
      </div>
    </body>
    </html>
  `;

  const dataUrl =
    "data:text/html;charset=utf-8," + encodeURIComponent(splashHTML);
  splashScreen.loadURL(dataUrl);

  return splashScreen;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    show: false, // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDevMode
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "electron-index.html")}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    // Close splash screen when main window is ready
    if (splashScreen && !splashScreen.isDestroyed()) {
      splashScreen.close();
      splashScreen = null;
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createSplashScreen();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Create application menu
const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Exit",
        accelerator: "CmdOrCtrl+Q",
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "About",
        click: () => {
          dialog
            .showMessageBox(mainWindow, {
              type: "info",
              title: "About Alien RPG Tools",
              message: "Alien RPG Tools",
              detail: `Version: 1.0.0\n\nCopyright © 2025 Ties That Bind Gaming™\nAll rights reserved.\n\nVisit us at: tiesthatbindgaming.com`,
              buttons: ["Visit Ties That Bind Gaming", "Close"],
            })
            .then((result) => {
              if (result.response === 0) {
                shell.openExternal("https://www.tiesthatbindgaming.com");
              }
            });
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
