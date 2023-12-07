const { ipcRenderer } = require("electron");

ipcRenderer.on("status", (_event, status) => {
  document.getElementById("status").innerText = status;
});
