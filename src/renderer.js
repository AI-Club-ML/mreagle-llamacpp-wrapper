const { ipcRenderer } = require("electron");
const { throttle } = require("../api/utils/timing");

var isGenerating = true;
function updateUI(chatInputPlaceholder = "Generating...") {
  if (isGenerating) {
    document.getElementById("chat-input").placeholder = chatInputPlaceholder;
    document.getElementById("chat-input").disabled = true;
    document.getElementById("send-button").disabled = true;
  } else {
    document.getElementById("chat-input").placeholder = "Type something...";
    document.getElementById("chat-input").disabled = false;
    document.getElementById("send-button").disabled = false;
  }
}
updateUI("Loading model...");

function addUserMessage(message) {
  var messageElement = document.createElement("div");
  messageElement.classList.add("chat", "user");
  messageElement.innerText = message || " ";
  document.querySelector("div.chat-container").appendChild(messageElement);
}
function addBotMessage(message) {
  var messageElement = document.createElement("div");
  messageElement.classList.add("chat", "bot");
  messageElement.innerText = message || " ";
  document.querySelector("div.chat-container").appendChild(messageElement);
}
function updateLastBotMessage(message) {
  var messageElement = document.querySelector(
    "div.chat-container > div.bot:last-child"
  );
  messageElement.innerText = message || " ";
}

// Event listeners
document.getElementById("send-button").addEventListener("click", () => {
  if (isGenerating) return;
  if (document.getElementById("chat-input").value.trim() === "") return;
  isGenerating = true;
  const input = document.getElementById("chat-input").value;
  addUserMessage(input);
  ipcRenderer.send("ai:prompt", input);
  addBotMessage("...");
  document.getElementById("chat-input").value = "";
  updateUI();
});
const clickSendButton = throttle(() => {
  document.getElementById("send-button").click();
}, 1000);
document.getElementById("chat-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    clickSendButton();
  }
});

ipcRenderer.on("textgen:data-chunk", (_event, text) => {
  updateLastBotMessage(text.all);
});
ipcRenderer.on("textgen:finished", () => {
  isGenerating = false;
  updateUI();
});
