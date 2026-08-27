const { contextBridge, ipcRenderer } = require("electron");
const { version: appVersion } = require("../package.json");

// Expose limited APIs to renderer process
contextBridge.exposeInMainWorld("electron", {
  isElectron: true,
  app: {
    getName: () => "Alien RPG Tools",
    getVersion: () => appVersion,
  },
  // Update event listeners
  on: (event, callback) => {
    ipcRenderer.on(event, (e, ...args) => callback(...args));
  },
  once: (event, callback) => {
    ipcRenderer.once(event, (e, ...args) => callback(...args));
  },
  // Update control methods
  installUpdate: () => {
    ipcRenderer.send("app-update:restart");
  },
});
