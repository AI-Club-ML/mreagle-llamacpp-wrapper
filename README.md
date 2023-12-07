<h1 align="center">Mr. Eagle LLaMaCpp Wrapper</h1>
<p align="center">
    <a href="https://www.electronjs.org/">
        <img src="https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white">
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/">
        <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
    </a>
    <br />
    <a href="https://cmake.org/">
        <img src="https://img.shields.io/badge/CMake-%23008FBA.svg?style=for-the-badge&logo=cmake&logoColor=white">
    </a>
    <a href="https://learn.microsoft.com/en-us/cpp/cpp/">
        <img src="https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white">
    </a>
</p>
<p align="center">
    <i>Simple Electron.js wrapper app with a nice UI for running llama.cpp.<br />(I'm so good at coming up with creative software names)</i>
</p>

This markdown file will split into two sections, the first will be for the [Electron](#electron) app while the second will be for the [C++ applications](#c-apps) that are used inside the Electron.js app.

**IMPORTANT NOTE:**  
For now, this app is meant to only run on Windows. However, it will support MacOS and Linux in the future.

# Electron

## 🚀 Running from source

### Prerequisites

- Node.js

### Steps

1. Clone the repo
   ```bash
   git clone https://github.com/Eagle-Consortium/mreagle-llamacpp-wrapper
   cd mreagle-llamacpp-wrapper
   ```
2. Install the dependencies
   ```bash
   npm install
   ```
3. Run the app
   ```bash
   npm start
   ```

## 📦 Packaging and Distribution

1. Build the app
   ```bash
   npm run dist
   ```
2. The packaged NSIS app installer will be located in the `dist` folder.

# C++ apps

There are two apps that are used inside this Electron.js app. The reason I did not use external tools (e.g. 7zip for SHA256 calculation) is because I wanted to keep the code as simple and lightweight as possible.

Information about the apps can be found in their respective README files:

- [checkavx](./api/cpp/checkavx/README.md)  
   Used to determine the availabile CPU instruction sets so that the right llama.cpp executable can be used.
- [sha256](./api/cpp/sha256/README.md)  
   Used for calculating the SHA256 hash of a file to determine its integrity. Can be used to check for corrupted or incompletely downloaded files.
