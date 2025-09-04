function download(filename,text){
  const a=document.createElement('a');
  a.setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(text));
  a.setAttribute('download',filename); a.style.display='none';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
function exportTxt(){ const t=document.getElementById('answerBox').innerText||''; download('chaitanya_answer.txt',t); }
function exportJson(){ const prefs=JSON.parse(localStorage.getItem('chaitanya_user')||'{}'); const data={ts:new Date().toISOString(),prefs,answer:document.getElementById('answerBox').innerText||''}; download('chaitanya_session.json', JSON.stringify(data,null,2)); }
function exportPdf(){ window.print(); }
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('exportTxtBtn').addEventListener('click', exportTxt);
  document.getElementById('exportJsonBtn').addEventListener('click', exportJson);
  document.getElementById('exportPdfBtn').addEventListener('click', exportPdf);
});