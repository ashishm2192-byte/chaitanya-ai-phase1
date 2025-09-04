function ask(q){
  const box=document.getElementById('answerBox');
  if(!q){ box.textContent='Please type a question.'; return; }
  box.textContent='Processing (free adapters)…\n\n• Query: '+q+'\n• Mode: Free-sources only\n• Note: This static preview simulates the final answer.';
}
document.addEventListener('DOMContentLoaded',()=>{
  const input=document.getElementById('userQuery');
  document.getElementById('askBtn').addEventListener('click',()=>ask(input.value.trim()));
  document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>ask(c.dataset.q)));
});