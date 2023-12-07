const { spawn } = require("node:child_process");
const path = require("node:path");

function getFileSHA256(file) {
  return new Promise((resolve, reject) => {
    sha256checker = spawn(path.join(__dirname, "bin", "sha256.exe"), [file]);
    sha256checker.stdout.on("data", (data) => {
      if (data == "File not found") {
        reject();
      } else {
        resolve(data.toString());
      }
    });
  });
}

module.exports = {
  getFileSHA256,
};
