const { BrowserWindow, app, ipcMain } = require("electron");
const remoteMain = require("@electron/remote/main");
const path = require("node:path");
const { existsSync, renameSync } = require("node:fs");
const { download } = require("electron-dl");

const LlamaCpp = require("./api/llamacpp.js");
const { getFileSHA256 } = require("./api/sha256.js");

remoteMain.initialize();

const ggufPath = path.join(
  app.getPath("home"),
  "MrEagle",
  "MrEagle-Q4_K_M.gguf"
);
const downloadPath = ggufPath.includes("/")
  ? ggufPath.substring(0, ggufPath.lastIndexOf("/"))
  : ggufPath.substring(0, ggufPath.lastIndexOf("\\"));
const downloadFname = ggufPath.includes("/")
  ? ggufPath.substring(ggufPath.lastIndexOf("/") + 1)
  : ggufPath.substring(ggufPath.lastIndexOf("\\") + 1);
const url =
  "https://huggingface.co/EagleConsortium/MrEagle-LoRA-GGUF-quantized/resolve/main/MrEagle-Q4_K_M.gguf?download=true";
const ggufSHA256 =
  "d8340674c7448f59432619b54676bb759a3cc5f1949a280c00e26dff6bb56753";

var onMainWindowReady = () => {};
const createLoadingWindow = () => {
  const loadingWin = new BrowserWindow({
    width: 480,
    height: 240,
    resizable: false,
    maximizable: false,
    minimizable: false,
    transparent: false,
    backgroundColor: "#000",
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      backgroundThrottling: false,
    },
    icon: path.join(__dirname, "src", "icon.png"),
  });
  loadingWin.loadFile(path.join(__dirname, "src", "loading", "index.html"));
  loadingWin.webContents.on("did-finish-load", async () => {
    function downloadModel() {
      setTimeout(() => {
        loadingWin.webContents.send("status", "Need to download model first");
        setTimeout(() => {
          createWindow(false);
          onMainWindowReady = () => {
            loadingWin.close();
          };
        }, 500);
      }, 500);
    }

    loadingWin.webContents.send("status", "Finding model file");
    if (existsSync(ggufPath)) {
      setTimeout(() => {
        loadingWin.webContents.send("status", "Checking model file integrity");
      }, 500);
      const hash = await getFileSHA256(ggufPath);
      if (hash == ggufSHA256) {
        loadingWin.webContents.send("status", "Model file integrity verified");
        setTimeout(() => {
          loadingWin.webContents.send("status", "Initializing Mr. Eagle");
        }, 500);
        createWindow(true);
        onMainWindowReady = () => {
          loadingWin.close();
        };
      } else {
        loadingWin.webContents.send("status", "Model file integrity failed");
        downloadModel();
      }
    } else {
      loadingWin.webContents.send("status", "Model file not found");
      downloadModel();
    }
  });
};

const createWindow = (modelDownloaded) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      backgroundThrottling: false,
    },
    icon: path.join(__dirname, "src", "icon.png"),
    titleBarStyle: "hidden",
    show: false,
  });
  remoteMain.enable(win.webContents);
  win.setMenu(null);
  if (modelDownloaded) {
    win.loadFile(path.join(__dirname, "src", "index.html"));
    var ready = false;
    const ai = new LlamaCpp({
      modelPath: ggufPath,
      onDataChunk: (text) => {
        win.webContents.send("textgen:data-chunk", text);
      },
      onGenerationEnd: () => {
        if (ready == false) {
          ready = true;
          onMainWindowReady();
          win.show();
        }
        win.webContents.send("textgen:finished");
      },
    });
    ipcMain.on("ai:prompt", (_event, text) => {
      ai.prompt(text);
    });
  } else {
    win.loadFile(path.join(__dirname, "src", "download", "index.html"));
    win.webContents.on("did-finish-load", () => {
      onMainWindowReady();
      win.show();
    });
    ipcMain.on("app:relaunch", () => {
      app.relaunch();
      app.quit();
    });
    ipcMain.on("download:path", () => {
      win.webContents.send("download:path", ggufPath);
    });
    ipcMain.on("download:start", async () => {
      if (existsSync(ggufPath)) {
        renameSync(ggufPath, ggufPath + ".old");
      }
      await download(win, url, {
        directory: downloadPath,
        filename: downloadFname,
        onProgress: (state) => {
          win.webContents.send("download:progress", state);
        },
        onCompleted: () => {
          win.webContents.send("download:completed");
        },
      });
    });

    win.on("close", (e) => {
      e.preventDefault();
      win.destroy();
      app.quit();
    });
  }
};
app.on("ready", createLoadingWindow);

process.on("uncaughtException", (err) => {});
process.on("unhandledRejection", (err) => {});
