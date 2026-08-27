const { contextBridge } = require("electron");
const { version: appVersion } = require("../package.json");

// Expose a minimal, read-only API to the renderer.
contextBridge.exposeInMainWorld("electron", {
  isElectron: true,
  app: {
    getName: () => "Alien RPG Tools",
    getVersion: () => appVersion,
  },
});
