const remote = require("@electron/remote");

const win = remote.getCurrentWindow();

document.getElementById("min-button").addEventListener("click", () => {
  win.minimize();
});
document.getElementById("max-button").addEventListener("click", () => {
  win.maximize();
});
document.getElementById("restore-button").addEventListener("click", () => {
  win.unmaximize();
});
document.getElementById("close-button").addEventListener("click", () => {
  win.close();
});

win.on("maximize", () => {
  document.getElementById("titlebar").classList.add("maximized");
});
win.on("unmaximize", () => {
  document.getElementById("titlebar").classList.remove("maximized");
});

win.on("enter-full-screen", () => {
  document.getElementById("titlebar").classList.remove("titlebar-shown");
  document.body.classList.remove("titlebar-shown");
});
win.on("leave-full-screen", () => {
  document.getElementById("titlebar").classList.add("titlebar-shown");
  document.body.classList.add("titlebar-shown");
});

win.on("ready-to-show", () => {
  document.getElementById("window-title-text").innerText = document.title;
});

// Garbage clean up
window.addEventListener("beforeunload", () => {
  win.removeAllListeners();
});
