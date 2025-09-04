const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function addMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.innerHTML = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage("user", text);
  userInput.value = "";

  setTimeout(() => {
    if (text.toLowerCase().includes("name")) {
      addMessage("bot", "Aapka naam kya hai? 😊");
    } else if (text.toLowerCase().includes("gender")) {
      addMessage("bot", "Kripya apna gender batayein (Male/Female/Other). 🌐");
    } else {
      addMessage("bot", "Mujhe abhi sirf basic introductions samajh aati hain. Phase 2 me main aur advanced ho jaungi. 🚀");
    }
  }, 800);
}
