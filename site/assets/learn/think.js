/* Learning Data: "Pause and think" for the film on any film page. When it's on, the film holds on the last frame of each chapter
   and asks one short question about it, then carries on. The questions come from the page's language pack (window.LEARN.think).
   - Each question's lab link goes to <.player data-labs>#<stop> (default "labs/"); data-labs="" leaves it out.
   - A question's optional "more" ({href,label}) shows a "Go deeper" link once the viewer has answered.
   - #think-list, if the page has one, lists every question with its answer, for a class or a team. */
(()=>{"use strict";
const X=window.LEARN,F=window.FILM,box=document.querySelector(".player"),btn=document.getElementById("think");
if(!X||!X.think||!F||!box)return;
const Q=X.think,get=(k,d)=>{try{const v=localStorage.getItem("ld:"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},put=(k,v)=>{try{localStorage.setItem("ld:"+k,JSON.stringify(v));}catch(e){}};
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
const labs=box.dataset.labs!=null?box.dataset.labs:"labs/";
const labLink=q=>q.stop&&labs?'<a class="think-lab" href="'+esc(labs+"#"+q.stop)+'">'+esc(Q.ui.lab)+' →</a>':"";
const cname=id=>typeof SCENES!=="undefined"&&(SCENES.find(s=>s.id===id)||{}).name||"";
// the questions as a list outside the player, from the same pack, so they live in one place only
const list=document.getElementById("think-list");
if(list){Object.keys(Q.qs).forEach(id=>{const q=Q.qs[id],d=document.createElement("details");d.className="tq";
    d.innerHTML='<summary><span class="tq-k">'+esc(cname(id))+'</span>'+esc(q.q)+'</summary><ul class="tq-opts">'+
      q.opts.map(o=>'<li'+(o.ok?' class="ok"><b>'+esc(Q.ui.right)+'</b> ':'>')+esc(o.t)+'</li>').join("")+
      '</ul><p class="tq-why"><b>'+esc(Q.ui.answer||"")+'</b> '+esc(q.why)+'</p><p class="tq-foot"><button type="button" class="btn" data-scene="'+esc(id)+'">'+esc(Q.ui.watch||"")+'</button>'+labLink(q)+'</p>';
    list.appendChild(d);});
  list.addEventListener("click",e=>{const b=e.target.closest("[data-scene]");if(!b||!F.playScene)return;const w=document.getElementById("watch")||box;w.scrollIntoView();F.playScene(b.dataset.scene,true);});}
if(!btn)return;
let on=get("think",false),last=null,panel=null;
function setOn(v){on=v;btn.setAttribute("aria-pressed",v?"true":"false");btn.classList.toggle("on",v);put("think",v);}
setOn(on);btn.textContent=Q.ui.toggle;
btn.addEventListener("click",()=>setOn(!on));
// the poster offers "Play with pauses to think" next to "Play the film"
box.querySelectorAll("[data-think]").forEach(b=>b.addEventListener("click",()=>{setOn(true);F.play();}));
function close(go){if(!panel)return;panel.remove();panel=null;if(go)F.play();}
F.onChapterEnd=id=>{
  if(!on||id===last)return false;const q=Q.qs[id];if(!q)return false;
  last=id;show(id,q);return true;};
function show(id,q){close(false);
  panel=document.createElement("div");panel.className="think";panel.setAttribute("role","dialog");panel.setAttribute("aria-label",Q.ui.kicker);
  panel.innerHTML='<div class="think-card"><p class="think-k">'+esc(Q.ui.kicker)+" · "+esc(cname(id))+'</p><h3>'+esc(q.q)+'</h3><div class="think-opts"></div><p class="think-why" aria-live="polite"></p>'+
    '<div class="think-foot"><button type="button" class="btn primary" data-go>'+esc(Q.ui.skip)+' ▶</button>'+labLink(q)+'<button type="button" class="think-off">'+esc(Q.ui.off)+'</button></div></div>';
  const opts=panel.querySelector(".think-opts"),why=panel.querySelector(".think-why"),go=panel.querySelector("[data-go]");
  q.opts.forEach((o,k)=>{const b=document.createElement("button");b.type="button";b.className="think-opt";b.textContent=o.t;
    b.onclick=()=>{[...opts.children].forEach((x,j)=>{x.disabled=true;if(q.opts[j].ok)x.classList.add("ok");else if(j===k)x.classList.add("no");});
      // a "Go deeper" link appears only after the answer, so it doesn't pull the viewer away mid-question
      why.innerHTML="<b>"+esc(o.ok?Q.ui.right:Q.ui.wrong)+"</b> "+esc(q.why)+(q.more?' <a class="think-more" href="'+esc(q.more.href)+'">'+esc(q.more.label)+" →</a>":"");
      go.textContent=Q.ui.cont+" ▶";go.focus();};opts.appendChild(b);});
  go.onclick=()=>close(true);
  panel.querySelector(".think-off").onclick=()=>{setOn(false);close(true);};
  panel.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();close(true);}});
  box.insertBefore(panel,box.querySelector(".bar"));opts.firstChild.focus({preventScroll:true});}
// if the film starts again some other way (the Play button, a chapter), the question steps aside
(function watch(){if(panel&&F.playing())close(false);requestAnimationFrame(watch);})();
})();
