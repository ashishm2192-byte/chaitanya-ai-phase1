const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function sendMessage() {
  let msg = userInput.value.trim();
  if (!msg) return;

  // Show user message
  let userMsg = document.createElement("div");
  userMsg.className = "user-msg";
  userMsg.innerText = msg;
  chatBox.appendChild(userMsg);

  // Clear input
  userInput.value = "";

  // Simulate AI reply
  setTimeout(() => {
    let botMsg = document.createElement("div");
    botMsg.className = "bot-msg";

    if (msg.toLowerCase().includes("name")) {
      botMsg.innerHTML = "My name is <b>Chaitanya AI</b>, chosen because it means <i>consciousness & life energy</i>. 🌟";
    } else if (msg.toLowerCase().includes("hello") || msg.toLowerCase().includes("hi")) {
      botMsg.innerText = "Hello! Nice to meet you 👋";
    } else {
      botMsg.innerText = "I'm still learning in Phase 1 🤖. Full features coming soon!";
    }

    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 700);
}
