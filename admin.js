const CONFIG={publicBeta:false,accessCode:'CHAI-PRIVATE-2025',versionLabel:'v1 • Private Beta'};
function qs(id){return document.getElementById(id);}
(function(){
  const p=new URLSearchParams(location.search);
  const forcePublic=p.get('public')==='1'; const showAdmin=p.get('admin')==='1';
  if(forcePublic){CONFIG.publicBeta=true; CONFIG.versionLabel='v1 • Public Preview';}
  if(showAdmin){qs('adminBtn').style.display='inline-flex';}
  qs('versionBadge').textContent=CONFIG.versionLabel;
  qs('adminBtn').addEventListener('click',()=>{
    const panel=qs('adminPanel'); panel.style.display = panel.style.display==='none'?'block':'none';
    qs('publicToggle').checked=CONFIG.publicBeta; qs('accessCodeAdmin').value=CONFIG.accessCode;
  });
  qs('saveAdminBtn').addEventListener('click',()=>{
    CONFIG.publicBeta=qs('publicToggle').checked;
    CONFIG.accessCode=qs('accessCodeAdmin').value||CONFIG.accessCode;
    localStorage.setItem('chaitanya_admin', JSON.stringify(CONFIG));
    qs('versionBadge').textContent=CONFIG.publicBeta?'v1 • Public Preview':'v1 • Private Beta';
    alert('Saved (local preview). Deploy to make permanent.');
  });
  const saved=localStorage.getItem('chaitanya_admin');
  if(saved){ try{Object.assign(CONFIG, JSON.parse(saved));}catch(e){} qs('versionBadge').textContent=CONFIG.publicBeta?'v1 • Public Preview':'v1 • Private Beta';}
  if(!CONFIG.publicBeta){
    const gate=qs('privateGate'); gate.style.display='flex';
    qs('enterGateBtn').addEventListener('click',()=>{
      const code=qs('accessCode').value.trim(); const msg=qs('gateMsg');
      if(code===CONFIG.accessCode){ gate.style.display='none'; msg.textContent=''; }
      else { msg.textContent='Invalid code. Please contact admin.'; }
    });
  }
})();