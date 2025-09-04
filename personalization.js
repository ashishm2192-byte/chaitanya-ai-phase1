function applyGreeting(){
  const prefs=JSON.parse(localStorage.getItem('chaitanya_user')||'{}');
  const sal=prefs.salutation||'Friend'; const name=prefs.name||'';
  const display=[name,sal].filter(Boolean).join(' ')||'Friend';
  document.getElementById('userNameDisplay').textContent=display;
  document.getElementById('prefName').value=prefs.name||'';
  document.getElementById('prefSalutation').value=prefs.salutation||'Friend';
}
function savePrefs(){
  const name=document.getElementById('prefName').value.trim();
  const salutation=document.getElementById('prefSalutation').value;
  localStorage.setItem('chaitanya_user', JSON.stringify({name,salutation,ts:Date.now()}));
  applyGreeting();
}
document.addEventListener('DOMContentLoaded',()=>{
  applyGreeting();
  document.getElementById('savePrefsBtn').addEventListener('click', savePrefs);
});