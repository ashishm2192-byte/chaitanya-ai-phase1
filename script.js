
// Theme toggle
document.getElementById("theme-toggle").onclick = () => {
  document.body.classList.toggle("light");
};

// Chat functionality
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = () => {
  const text = input.value.trim();
  if (!text) return;
  addMessage("You", text);
  input.value = "";
  // Dummy AI reply
  if (text.toLowerCase().includes("hello")) {
    addMessage("Chaitanya AI", "Namaste! 👋 Kaise ho?");
  } else {
    addMessage("Chaitanya AI", "Mujhe abhi basic queries hi aati hain. 🌱");
  }
};

// Weather widget (Open-Meteo API demo)
fetch("https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true")
  .then(res => res.json())
  .then(data => {
    document.getElementById("weather-widget").innerText =
      "🌤 Delhi Weather: " + data.current_weather.temperature + "°C";
  })
  .catch(() => {
    document.getElementById("weather-widget").innerText = "⚠️ Weather unavailable";
  });

// News widget (RSS via free API)
fetch("https://api.rss2json.com/v1/api.json?rss_url=https://timesofindia.indiatimes.com/rssfeedstopstories.cms")
  .then(res => res.json())
  .then(data => {
    let headlines = data.items.slice(0, 3).map(i => "• " + i.title).join("\n");
    document.getElementById("news-widget").innerText = "📰 Headlines:\n" + headlines;
  })
  .catch(() => {
    document.getElementById("news-widget").innerText = "⚠️ News unavailable";
  });
