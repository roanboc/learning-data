/* Learning Data: the guided tour, opened from "?" in the header (build_series.py's TOUR_JS loads this file, its words and its
   styles only when someone asks). Its steps are in tour.<lang>.js (window.LD_TOUR_STEPS), so this file holds no words.
   - It shows each step whose part is on the page and visible, in the list's order: the same tour serves the film pages, the
     Topics page in either view, and the rest. A step's part gets a ring and is brought into view at once, with no glide; nothing is covered or locked.
   - The card is a dialog at the foot of the window: Back, Next and Close, and how far along it is. Escape closes it, and the
     arrow keys move through it. Focus goes to the card, and back to "?" (or to More, on a phone) when it closes. */
(()=>{"use strict";
const T=window.LD_TOUR_STEPS;if(!T||window.LD_TOUR)return;
const X=T.text,esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const seen=e=>!!e&&e.getClientRects().length>0&&getComputedStyle(e).visibility!=="hidden";
const find=sel=>sel?[...document.querySelectorAll(sel)].find(seen)||null:null;
let card=null,steps=[],at=0,opener=null,lit=null;
function unlight(){if(lit){lit.classList.remove("tour-on");lit=null;}}
function close(){
  if(!card)return;unlight();card.remove();card=null;
  const back=seen(opener)?opener:document.querySelector(".more-btn");if(back&&seen(back))back.focus({preventScroll:true});}
function show(n){
  at=Math.max(0,Math.min(steps.length-1,n));const s=steps[at],last=at===steps.length-1;
  unlight();if(s.el){lit=s.el;lit.classList.add("tour-on");lit.scrollIntoView({block:"center",inline:"nearest",behavior:"auto"});
    // pictures above it that load as the page scrolls can push it out of view again: bring it back once they have
    const el=s.el,keep=()=>{if(lit!==el)return;const r=el.getBoundingClientRect();if(r.bottom<60||r.top>innerHeight-60)el.scrollIntoView({block:"center",inline:"nearest",behavior:"auto"});};
    setTimeout(keep,250);setTimeout(keep,900);}
  card.innerHTML='<p class="tour-n">'+esc(X.of.replace("{n}",at+1).replace("{of}",steps.length))+'</p><h2 id="tour-h">'+esc(s.title)+'</h2><p id="tour-p">'+esc(s.text)+'</p>'+
    '<div class="tour-b"><button type="button" class="btn" data-t="back"'+(at?'':' disabled')+'>'+esc(X.back)+'</button>'+
    '<button type="button" class="btn primary" data-t="'+(last?"close":"next")+'">'+esc(last?X.done:X.next)+'</button><span></span>'+
    '<button type="button" class="tour-x" data-t="close" aria-label="'+esc(X.close)+'">×</button></div>';
  card.querySelector(".primary").focus({preventScroll:true});}
function start(from){
  opener=from||null;
  steps=T.steps.map(s=>({title:s.title,text:s.text,sel:s.sel,el:find(s.sel)})).filter(s=>!s.sel||s.el);
  if(!steps.length)return;
  if(!card){card=document.createElement("div");card.className="tour";card.setAttribute("role","dialog");card.setAttribute("aria-label",X.name);
    card.setAttribute("aria-describedby","tour-p");
    card.addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(!b)return;
      if(b.dataset.t==="close")close();else show(at+(b.dataset.t==="next"?1:-1));});
    card.addEventListener("keydown",e=>{
      if(e.key==="Escape"){e.stopPropagation();close();}
      else if(e.key==="ArrowRight"&&at<steps.length-1){e.preventDefault();show(at+1);}
      else if(e.key==="ArrowLeft"&&at>0){e.preventDefault();show(at-1);}
      else if(e.key===" "||e.key==="Enter")e.stopPropagation();});   // Space on a button must not reach a film's player
    document.body.appendChild(card);}
  show(0);}
window.LD_TOUR={start:start,close:close};
})();
