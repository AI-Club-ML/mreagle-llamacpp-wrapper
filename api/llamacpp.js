const { spawn } = require("node:child_process");
const path = require("node:path");
const os = require("node:os");

const check_avx = spawn(path.join(__dirname, "bin", "checkavx.exe"));
// Use the most common CPU intrinsics configuration by default
var CPU_FEATURES = {
  AVX: 1,
  AVX2: 1,
  AVX512: 0,
};
check_avx.stdout.on("data", (data) => {
  CPU_FEATURES = JSON.parse(data.toString());
});
const threads = 2 ** ((os.cpus().length - 1).toString(2).length - 1);

const parameters = [
  "-i",
  "-ins",
  "-f",
  "./prompts/alpaca.txt",
  "-t",
  `${threads}`,
  "-r",
  '"### Input:"',
];

/**
 * An instance of llama.cpp.
 */
class LlamaCpp {
  /**
   * Constructor function for the class.
   *
   * @param {object} options - An object containing the following properties:
   *   - modelPath {string} - The path to the model.
   *   - onDataChunk {function} - A callback function to handle data chunks.
   *   - onGenerationEnd {function} - A callback function to handle generation end.
   */
  constructor({ modelPath, onDataChunk, onGenerationEnd }) {
    this.llamacpp = spawn(
      path.join(
        __dirname,
        "bin",
        CPU_FEATURES.AVX2 ? "main_avx2.exe" : "main_avx.exe"
      ),
      [...parameters, "-m", modelPath],
      {
        cwd: path.join(__dirname),
      }
    );
    this.generating = false;
    this.currentResponse = "";
    this.llamacpp.stdout.on("data", (data) => {
      const text = data.toString();
      // console.log(
      //   text
      //     .split("")
      //     .map((x) => x.charCodeAt(0))
      //     .join(" ")
      // );
      process.stdout.write(text); // console.log makes a new line
      if (text == "\r\n> " || text == "\r\n\r\n> ") {
        this.generating = false;
        if (onGenerationEnd) {
          onGenerationEnd();
        }
      } else {
        this.generating = true;
        this.currentResponse += text;
        if (onDataChunk) {
          onDataChunk({
            new: text,
            all: this.currentResponse,
          });
        }
      }
    });
  }

  prompt(text) {
    return new Promise((resolve) => {
      console.log("prompt", text);
      if (!this.generating) {
        this.currentResponse = "";
        this.llamacpp.stdin.write(text + "\n");
        this.llamacpp.stdout.on("data", (data) => {
          if (data.toString() == "\r\n> " || data.toString() == "\r\n\r\n> ") {
            resolve();
          }
        });
      }
    });
  }

  isGenerating() {
    return this.generating;
  }

  kill() {
    this.llamacpp.kill();
  }
}

module.exports = LlamaCpp;
