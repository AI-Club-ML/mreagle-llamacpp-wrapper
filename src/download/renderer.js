const { ipcRenderer } = require("electron");
const { round } = require("../../api/utils/math.js");

document
  .getElementById("download-button")
  .addEventListener("click", async () => {
    document.getElementById("download-container").style.display = "none";
    document.getElementById("download-progress-container").style.display =
      "block";
    ipcRenderer.send("download:start");
  });
ipcRenderer.on("download:progress", (_event, progress) => {
  document.getElementById("download-progress-bar-inner").style.width =
    progress.percent * 100 + "%";
  document.getElementById("downloaded-gb").innerHTML = round(
    progress.transferredBytes / 1024 / 1024 / 1024,
    2
  );
  document.getElementById("total-gb").innerHTML = round(
    progress.totalBytes / 1024 / 1024 / 1024,
    2
  );
  document.getElementById("downloaded-percent").innerHTML = round(
    progress.percent * 100,
    1
  );
});
ipcRenderer.on("download:completed", () => {
  document.getElementById("download-status").innerText = "Download finished";
  setTimeout(() => {
    ipcRenderer.send("app:relaunch");
  }, 500);
});
