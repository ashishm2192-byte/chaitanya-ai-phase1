
(() => {
  const $ = sel => document.querySelector(sel);
  const log = $("#chat-log");
  const themeLabel = $("#theme-label");
  const themeBadge = $("#theme-badge");
  const themeOrder = ["ocean", "neon", "amber"];
  let themeIdx = themeOrder.indexOf(localStorage.getItem("theme")) || 0;

  function setTheme(name){
    document.documentElement.classList.remove("theme-ocean","theme-neon","theme-amber");
    document.documentElement.classList.add(`theme-${name}`);
    themeLabel.textContent = name[0].toUpperCase()+name.slice(1);
    themeBadge.textContent = name[0].toUpperCase()+name.slice(1);
    localStorage.setItem("theme", name);
  }
  setTheme(localStorage.getItem("theme") || "ocean");
  $("#btn-theme").addEventListener("click", () => {
    themeIdx = (themeIdx + 1) % themeOrder.length;
    setTheme(themeOrder[themeIdx]);
  });

  // Intro
  const nameInput = $("#inp-name");
  const genderSel = $("#sel-gender");
  const helloName = $("#hello-name");
  const stored = JSON.parse(localStorage.getItem("intro") || "{}");
  if(stored.name){ nameInput.value = stored.name; helloName.textContent = `, ${stored.name}`; }
  if(stored.gender){ genderSel.value = stored.gender; }
  $("#btn-save").addEventListener("click", () => {
    const info = { name: nameInput.value.trim(), gender: genderSel.value };
    localStorage.setItem("intro", JSON.stringify(info));
    helloName.textContent = info.name ? `, ${info.name}` : "";
    say(`Saved. Hello ${titleFor(info)}!`);
  });
  $("#btn-reset").addEventListener("click", () => {
    localStorage.removeItem("intro"); nameInput.value=""; genderSel.value=""; helloName.textContent="";
    say("Intro cleared. Please enter your name and gender again.");
  });
  function titleFor(info){
    if(info.gender === "female") return "Madam";
    if(info.gender === "male") return "Sir";
    return "Friend";
  }

  // Chat I/O (Phase‑2 demo: local rules + a few utilities)
  function pushMsg(text, who="ai"){
    const row = document.createElement("div");
    row.className = `msg ${who==="you"?"you":"ai"}`;
    row.innerHTML = `<div class="bubble">${text}</div>`;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  async function handleQuery(q){
    const info = JSON.parse(localStorage.getItem("intro") || "{}");
    if(!q) return;
    pushMsg(q, "you");

    // Simple router
    let ans = "";
    const lower = q.toLowerCase();

    // Weather via Open‑Meteo (no key)
    if(lower.includes("weather") || lower.includes("mausam")){
      ans = "Locating your position for weather…";
      pushMsg(ans);
      try{
        const loc = await getLocation();
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        const t = Math.round(data.current_weather.temperature);
        ans = `Current temperature near you is ${t}°C, wind ${data.current_weather.windspeed} km/h.`;
      }catch(e){
        ans = "Unable to fetch weather (location blocked). You can type: 'weather in Jaipur' in Phase 3.";
      }
    }
    else if(lower.includes("capital of india")){
      ans = "The capital of India is New Delhi.";
    }
    else if(lower.startsWith("hello") || lower.startsWith("hi")){
      ans = `Hello ${titleFor(info)}! How can I assist you today?`;
    }
    else{
      ans = "Phase 2 demo: I can answer simple questions, do basic weather, and talk. Advanced knowledge will arrive in Phase 3 with free adapters.";
    }
    pushMsg(ans);
    say(ans);
  }

  $("#btn-send").addEventListener("click", () => {
    const q = $("#inp-msg").value.trim();
    $("#inp-msg").value="";
    handleQuery(q);
  });
  $("#inp-msg").addEventListener("keydown", e => { if(e.key==="Enter") $("#btn-send").click(); });

  // Voice (Web Speech API)
  let rec;
  $("#btn-mic").addEventListener("click", () => {
    if(!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)){
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev) => {
      const text = ev.results[0][0].transcript;
      $("#inp-msg").value = text;
      $("#btn-send").click();
    };
    rec.onerror = () => pushMsg("Mic error or permission denied.", "ai");
    rec.start();
  });

  function say(text){
    try{
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-IN";
      speechSynthesis.speak(u);
    }catch(e){}
  }

  // Widgets
  (async () => {
    const sys = `User Agent: ${navigator.userAgent}<br>Viewport: ${window.innerWidth}×${window.innerHeight}`;
    $("#w-system").innerHTML = sys;
    try{
      const loc = await getLocation();
      $("#w-place").textContent = `${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)}`;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true`;
      const res = await fetch(url);
      const data = await res.json();
      $("#w-temp").textContent = Math.round(data.current_weather.temperature) + "°";
    }catch(e){
      $("#w-place").textContent = "Location blocked";
    }
  })();

  function getLocation(){
    return new Promise((resolve,reject)=>{
      if(!navigator.geolocation) return reject("no geo");
      navigator.geolocation.getCurrentPosition(
        pos => resolve({lat: pos.coords.latitude, lon: pos.coords.longitude}),
        err => reject(err),
        { enableHighAccuracy:true, timeout:8000, maximumAge:0 }
      );
    });
  }

  // Export session as PDF (very simple text-based)
  $("#dl-session").addEventListener("click", (e)=>{
    e.preventDefault();
    const lines = Array.from(log.querySelectorAll(".bubble")).map(b => b.textContent);
    const blob = new Blob([lines.join("\n\n")], {type:"application/pdf"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chaitanya_session.pdf";
    a.click();
  });
})(); 
