const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// data
// project filters (cards are written in index.html)
$("#filters").addEventListener("click",e=>{
  const b=e.target.closest(".chip");if(!b)return;
  $$(".chip").forEach(c=>c.classList.toggle("on",c===b));
  $$(".project").forEach(p=>p.classList.toggle("hide",b.dataset.f!=="all"&&!p.dataset.tags.includes(b.dataset.f)));
});
// typed text
const words=["HTML, Bootstrap, CSS and JavaScript.","pixel-perfect layouts.","mobile-first thinking."];
let wi=0,ci=0,del=false;
(function type(){
  const w=words[wi];$("#typed").textContent=w.slice(0,ci);
  if(!del&&ci===w.length){del=true;return setTimeout(type,1600)}
  if(del&&ci===0){del=false;wi=(wi+1)%words.length}
  ci+=del?-1:1;setTimeout(type,del?30:60);
})();
// reveal + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add("in");
  e.target.querySelectorAll("[data-count]").forEach(n=>{
    const to=+n.dataset.count;let v=0;const s=Math.max(1,Math.ceil(to/40));
    const t=setInterval(()=>{v=Math.min(to,v+s);n.textContent=v;if(v>=to)clearInterval(t)},30);
    n.removeAttribute("data-count");
  });
  io.unobserve(e.target);
}),{threshold:.15});
$$(".reveal").forEach(el=>io.observe(el));
// nav
// responsive behaviour
const links=$("#links"),burger=$("#burger"),mq=matchMedia("(max-width:700px)");
function setMenu(open){
  links.classList.toggle("open",open);
  burger.setAttribute("aria-expanded",open);
  burger.textContent=open?"✕":"☰";
}
burger.setAttribute("aria-controls","links");
setMenu(false);
burger.addEventListener("click",()=>setMenu(!links.classList.contains("open")));
$$("#links a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
document.addEventListener("click",e=>{if(!e.target.closest(".navbar"))setMenu(false)});
addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});
mq.addEventListener("change",e=>{if(!e.matches)setMenu(false)}); // close menu when resizing to desktop
addEventListener("scroll",()=>$(".navbar").classList.toggle("scrolled",scrollY>10),{passive:true});
const secs=$$("section"),navA=$$("#links a");
addEventListener("scroll",()=>{
  let cur="";secs.forEach(s=>{if(scrollY>=s.offsetTop-140)cur=s.id});
  navA.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+cur));
},{passive:true});
// theme (in-memory; persisted only in this session's DOM)
$("#theme").onclick=()=>{
  const r=document.documentElement;
  const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
  r.dataset.theme=dark?"light":"dark";
  try{localStorage.setItem("theme",r.dataset.theme)}catch(e){}
};
try{const t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
// form validation
$("#form").addEventListener("submit",e=>{
  e.preventDefault();
  const n=$("#name").value.trim(),m=$("#email").value.trim(),t=$("#text").value.trim(),out=$("#msg");
  if(!n||!t){out.textContent="Please fill in your name and message.";out.style.color="var(--accent)";return}
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)){out.textContent="Please enter a valid email address.";out.style.color="var(--accent)";return}
  out.textContent="Thanks, "+n+"! Your message is ready to send. Connect this form to Formspree or your backend.";
  out.style.color="var(--muted)";e.target.reset();
});
$("#yr").textContent=new Date().getFullYear();