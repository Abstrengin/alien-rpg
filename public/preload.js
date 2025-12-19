const { contextBridge, ipcRenderer } = require("electron");

// Expose limited APIs to renderer process
contextBridge.exposeInMainWorld("electron", {
  isElectron: true,
  app: {
    getName: () => "Alien RPG Generator",
    getVersion: () => "1.0.0",
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
