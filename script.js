// Chaitanya × Jarvis — Merged Assistant (Phase 4)
const els = {
  chat: document.getElementById('chat'),
  msg: document.getElementById('msg'),
  send: document.getElementById('sendBtn'),
  mic: document.getElementById('micBtn'),
  theme: document.getElementById('themeBtn'),
  settings: document.getElementById('settings'),
  settingsBtn: document.getElementById('settingsBtn'),
  nameInput: document.getElementById('nameInput'),
  addressInput: document.getElementById('addressInput'),
  voiceInput: document.getElementById('voiceInput'),
  saveProfile: document.getElementById('saveProfile'),
  profileLine: document.getElementById('profileLine'),
  exportTxt: document.getElementById('exportTxt'),
  printPdf: document.getElementById('printPdf'),
  clearChat: document.getElementById('clearChat'),
  weather: document.getElementById('weather'),
  news: document.getElementById('news'),
  mode: document.getElementById('mode'),
  status: document.getElementById('status'),
};
let state = {
  profile: JSON.parse(localStorage.getItem('cj_profile')||'{}'),
  history: [],
  recognition: null,
  speakingVoice: null
};

function saveProfile(){
  state.profile = {
    name: els.nameInput.value.trim() || 'Friend',
    address: els.addressInput.value || 'Boss',
    voice: els.voiceInput.value || ''
  };
  localStorage.setItem('cj_profile', JSON.stringify(state.profile));
  els.profileLine.textContent = `${state.profile.name} (${state.profile.address})`;
  els.mode.textContent = state.profile.address;
  toast(`Saved. I will address you as ${state.profile.address}.`);
}

function speak(text){
  try{
    const u = new SpeechSynthesisUtterance(text);
    if(state.profile.voice){
      const v = speechSynthesis.getVoices().find(v=>v.name===state.profile.voice);
      if(v) u.voice = v;
    }
    speechSynthesis.speak(u);
  }catch(e){}
}

function addMsg(role, text){
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = text;
  els.chat.appendChild(div);
  els.chat.scrollTop = els.chat.scrollHeight;
  state.history.push({role, text, ts: Date.now()});
}

function reply(text){ addMsg('ai', text); speak(text); }

function greet(){
  const {name='Friend', address='Boss'} = state.profile;
  els.profileLine.textContent = `${name} (${address})`;
  els.mode.textContent = address;
  reply(`Namaste ${address}! Main Chaitanya × Jarvis hoon. Kaise madad kar sakta/sakti hoon?`);
}

function handleIntent(q){
  const low = q.toLowerCase().trim();
  if(low === 'time' || low.includes('time')){
    const t = new Date().toLocaleTimeString();
    reply(`Current time is ${t}.`); return;
  }
  if(low.includes('date')){
    const d = new Date().toLocaleDateString();
    reply(`Aaj ki tareekh ${d} hai.`); return;
  }
  if(low.startsWith('open ')){
    const site = low.replace('open ','').trim();
    const map = {
      youtube:'https://youtube.com', gmail:'https://mail.google.com',
      instagram:'https://instagram.com', google:'https://google.com'
    };
    const url = map[site] || ('https://' + site);
    window.open(url, '_blank'); reply(`Opening ${site}…`); return;
  }
  // simple calculator: calculate 12 + 7, add 2 and 3
  const calc = low.match(/(?:calculate|calc|add)\s+([0-9\.\s\+\-\*\/x]+)/);
  if(calc){
    try{
      const expr = calc[1].replace(/x/gi,'*');
      if(!expr.match(/^[0-9\.\s\+\-\*\/]+$/)) throw 0;
      const ans = eval(expr);
      reply(`Answer: ${ans}`);
    }catch{ reply('Sorry, expression samajh nahi aaya.'); }
    return;
  }
  if(low.includes('who are you')){ reply('Main Chaitanya × Jarvis assistant hoon — local-first, free adapters ke sath.'); return; }
  reply("Maine message note kiya. Advanced knowledge adapters Phase 5-7 me aayenge. Filhal main web open, weather, news, time/date aur basic maths kar sakta/sakti hoon.");
}

function send(){
  const val = els.msg.value.trim();
  if(!val) return;
  addMsg('you', val);
  els.msg.value='';
  handleIntent(val);
}

function initMic(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ els.mic.disabled = true; toast('SpeechRecognition not available in this browser.'); return; }
  const r = new SR();
  r.lang = 'en-IN';
  r.interimResults = false;
  r.maxAlternatives = 1;
  r.onresult = (e)=>{
    const txt = e.results[0][0].transcript;
    addMsg('you', `🎙️ ${txt}`);
    handleIntent(txt);
  };
  r.onend = ()=> els.mic.classList.remove('rec');
  state.recognition = r;
}
function startMic(){
  if(state.recognition){ els.mic.classList.add('rec'); state.recognition.start(); }
}

function toast(t){
  els.status.textContent = t;
  setTimeout(()=>els.status.textContent='Online', 3000);
}

// adapters
async function loadWeather(){
  try{
    const pos = await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej,{enableHighAccuracy:true,timeout:4000}));
    const {latitude, longitude} = pos.coords;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
    const r = await fetch(url);
    const j = await r.json();
    const t = j?.current?.temperature_2m;
    els.weather.textContent = t!=null ? `Current: ${t}°C` : 'N/A';
  }catch(e){ els.weather.textContent = 'Location blocked. Set location permission to allow weather.'; }
}

async function loadNews(){
  const rss = 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms';
  const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(rss)}`;
  try{
    const txt = await (await fetch(url)).text();
    const items = [...txt.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)].slice(1,6).map(m=>m[1]);
    els.news.innerHTML = items.map(i=>`<li>${i}</li>`).join('');
  }catch(e){
    els.news.innerHTML = `<li>News adapters unavailable. Try later.</li>`;
  }
}

function loadVoices(){
  const fill = ()=>{
    els.voiceInput.innerHTML = '';
    for(const v of speechSynthesis.getVoices()){
      const o = document.createElement('option');
      o.value = o.textContent = v.name;
      if(state.profile.voice===v.name) o.selected = true;
      els.voiceInput.appendChild(o);
    }
  };
  window.speechSynthesis.onvoiceschanged = fill;
  fill();
}

function initTheme(){
  const current = localStorage.getItem('cj_theme') || 'dark';
  document.documentElement.dataset.theme = current;
  els.theme.addEventListener('click', ()=>{
    const next = (document.documentElement.dataset.theme === 'dark') ? 'light':'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('cj_theme', next);
  });
}
initTheme();

// events
els.send.addEventListener('click', send);
els.msg.addEventListener('keydown', e=>{ if(e.key==='Enter') send(); });
els.mic.addEventListener('mousedown', startMic);
els.settingsBtn.addEventListener('click', ()=> els.settings.showModal());
els.saveProfile.addEventListener('click', (e)=>{ e.preventDefault(); saveProfile(); els.settings.close(); });
els.clearChat.addEventListener('click', ()=>{ els.chat.innerHTML=''; state.history=[]; });
els.exportTxt.addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(state.history, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'chat_history.json'; a.click();
});
els.printPdf.addEventListener('click', ()=>window.print());

// quick chips
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
  const text = c.getAttribute('data-intent'); addMsg('you', text); handleIntent(text);
}));

// boot
(function boot(){
  els.nameInput.value = state.profile.name || '';
  els.addressInput.value = state.profile.address || 'Boss';
  initMic(); loadVoices(); greet(); loadWeather(); loadNews();
})();
