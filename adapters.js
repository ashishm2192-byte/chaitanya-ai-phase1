const adapterContainer=document.getElementById('adaptersList');
const scanResult=document.getElementById('scanResult');
async function loadAdapters(){
  try{ const res=await fetch('data/free_adapters.json'); const list=await res.json(); renderAdapters(list); }
  catch(e){ adapterContainer.innerHTML='<div class="adapter">Failed to load adapters.</div>'; }
}
function renderAdapters(list){
  adapterContainer.innerHTML='';
  list.forEach(a=>{
    const el=document.createElement('div'); el.className='adapter';
    el.innerHTML=`<div><strong>${a.name}</strong></div>
      <div class="tag">${a.category} • ${a.type}</div>
      <div class="muted small">${a.desc}</div>
      <div class="muted small">URL: ${a.url}</div>`;
    adapterContainer.appendChild(el);
  });
}
function basicScan(url){
  const suspicious=/(\.exe$|\.(scr|bat|cmd|ps1)$|data:|javascript:)/i.test(url);
  const allowed=/^https?:\/\//i.test(url);
  const tooLong=url.length>300;
  const containsIP=/https?:\/\/(\d{1,3}\.){3}\d{1,3}/.test(url);
  const verdict=(suspicious||!allowed||tooLong||containsIP)?'fail':'ok';
  return {suspicious,allowed,tooLong,containsIP,verdict};
}
document.getElementById('scanAddBtn').addEventListener('click',()=>{
  const url=document.getElementById('adapterUrl').value.trim();
  if(!url){ scanResult.textContent='Enter a URL first.'; return; }
  const r=basicScan(url);
  if(r.verdict==='ok'){
    scanResult.textContent='✓ Looks fine (basic checks passed). Added locally.';
    const el=document.createElement('div'); el.className='adapter';
    el.innerHTML=`<div><strong>Custom Source</strong></div>
      <div class="tag">user-added • free</div>
      <div class="muted small">URL: ${url}</div>`;
    adapterContainer.appendChild(el);
  } else {
    scanResult.textContent='✗ Blocked by pre-scan (unsafe or malformed URL).';
  }
});
document.addEventListener('DOMContentLoaded', loadAdapters);