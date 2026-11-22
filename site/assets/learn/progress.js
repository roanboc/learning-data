/* Learning Data: the Topics page's progress, goal and toggle (the author, 21 November 2026: one view, with the list's tiles,
   the route's paths and the progress in one place), and the same tiles and icons on a topic's own page (22 November 2026). Drawn from the route's data in route.<lang>.js (window.LD_ROUTE), so this
   file holds no topic, no link and no word of its own.
   - Progress shows as one line of four icons, never bars: films watched, labs seen, situations answered and right answers.
     A count with nothing to count is left out. The line sits in the hero's box (with Continue, the next film to watch), on
     each topic's row (.tp-mx[data-tmx]) and on each card of a film or series ([data-item]), with Start, Continue or
     Watched · review. The counts come from path.js (window.LD_STATS), with the keys every page uses.
   - The goal ("I want to…") is a drop-down (a button and a listbox, by keyboard too). It is kept in this browser
     ("ld-route:goal") and shared with the map (route.js, the "ld-route" event). With a goal, its films and series are
     numbered (Step 2 of 5), its topics open, and the rest of the list is dimmed.
   - With a goal, one toggle hides what isn't on its path: the topics, films and series off it, here and on the map (the author,
     22 November 2026: no other filter). Kept in this browser ("ld-route:hide"), shared with route.js.
   - On a topic's page ([data-items], the hero's [data-you] with data-scope="<topic>"), the same icon lines on the same tiles,
     and the topic's own total in the hero beside Continue; no goal there. */
(()=>{"use strict";
const D=window.LD_ROUTE,list=document.getElementById("list")||document.querySelector("[data-items]");if(!D||!D.topics||!list)return;
const X=D.text,fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const get=k=>{try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}};
const set=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const S=window.LD_STATS||(()=>({watched:false,labs:0,n:0,ok:0}));
const ITEM={};D.topics.forEach(t=>t.items.forEach(i=>{ITEM[i.id]=i;i.topic=t.id;}));
const goal=id=>D.goals.find(g=>g.id===id)||null,live=t=>t.items.filter(i=>!i.soon);
const you=document.querySelector("[data-you]"),pick=document.querySelector("[data-goalpick]"),gline=document.querySelector("[data-gline]");
const hideBox=document.querySelector(".tp-hide"),hideIn=hideBox&&hideBox.querySelector("[data-tphide]"),rows=[...list.querySelectorAll("section.topic")];
const base=you&&you.dataset.base||"",TOP=you&&you.dataset.scope?D.topics.find(t=>t.id===you.dataset.scope):null;
const IC={fw:'<circle cx="10" cy="10" r="6.8"/><path d="M8.7 7.3v5.4l4.3-2.7z" class="f"/>',ls:'<path d="M8 3h4M9 3v5l-4.5 7.2A1.2 1.2 0 0 0 5.5 17h9a1.2 1.2 0 0 0 1-1.8L11 8V3"/><path d="M6.6 12.5h6.8"/>',
  an:'<path d="M4 5.5A2 2 0 0 1 6 3.5h8a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2H9l-3.6 3v-3H6a2 2 0 0 1-2-2z"/>',ok:'<circle cx="10" cy="10" r="6.8"/><path d="M7 10.2l2.1 2.1 4-4.3"/>'};
const icon=k=>'<svg class="mx-ic ic-'+k+'" viewBox="0 0 20 20" aria-hidden="true" focusable="false">'+IC[k]+'</svg>';
const CHEV='<svg class="tp-chev" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5.5 7.5l4.5 4.5 4.5-4.5"/></svg>';
// what a set of films and series adds up to
function sum(items){const o={f:0,fn:0,l:0,ln:0,q:0,n:0,ok:0};
  items.forEach(i=>{if(i.soon)return;o.fn+=i.films.length;o.f+=i.films.filter(p=>S(p,0,0).watched).length;
    if(i.pr){const st=S(i.pr[0],i.pr[1],i.pr[2]);o.ln+=i.pr[1];o.l+=st.labs;o.q+=i.pr[2];o.n+=st.n;o.ok+=st.ok;}});return o;}
// one line of icons: n/of for each count; before anything is started, only how much there is
function line(o){const c=(k,txt,lab)=>'<li class="mx-'+k+'" title="'+esc(lab)+'">'+icon(k)+'<span class="route-sr">'+esc(lab)+': </span>'+txt+'</li>',
    of=(n,m)=>'<b>'+n+'</b><small>/'+m+'</small>',started=o.f||o.l||o.n;
  if(!started)return '<ul class="mx">'+c("fw",'<small>'+o.fn+'</small>',X.fw)+(o.ln?c("ls",'<small>'+o.ln+'</small>',X.ls):"")+'<li class="mx-new">'+esc(X.notyet)+'</li></ul>';
  return '<ul class="mx">'+c("fw",of(o.f,o.fn),X.fw)+(o.ln?c("ls",of(o.l,o.ln),X.ls):"")+(o.q&&o.n?c("an",of(o.n,o.q),X.an):"")+
    (o.n?c("ok",'<b>'+o.ok+'</b><small> '+esc(fill(X.right,{n:""}).trim())+'</small>',X.ok):"")+'</ul>';}
const state=o=>o.fn&&o.f>=o.fn?"done":o.f||o.l||o.n?"on":"new";

// ---- the goal: a drop-down of the route's goals, and all topics
let openMenu=false,act=0;
function goals(){return [{id:"",name:X.gall,line:X.gall_line}].concat(D.goals);}
function drawPick(){if(!pick)return;const g=goal(get("ld-route:goal")),gs=goals();
  pick.innerHTML='<button type="button" class="tp-gb" aria-haspopup="listbox" aria-expanded="'+openMenu+'" aria-controls="tp-goals" data-k="gb"><span class="tp-gl">'+esc(X.want)+'</span>'+
    '<b>'+esc(g?g.name:X.gall)+'</b>'+CHEV+'</button>'+
    (openMenu?'<ul class="tp-menu" id="tp-goals" role="listbox" tabindex="-1" aria-label="'+esc(X.want)+'" aria-activedescendant="tp-g-'+act+'">'+
      gs.map((x,i)=>'<li role="option" id="tp-g-'+i+'" data-goal="'+x.id+'" aria-selected="'+((g?g.id:"")===x.id)+'"'+(i===act?' class="act"':'')+'><b>'+esc(x.name)+'</b><span>'+esc(x.line)+'</span></li>').join("")+'</ul>':'');
  if(openMenu){const m=pick.querySelector(".tp-menu");m.focus({preventScroll:true});const a=m.querySelector(".act");if(a&&a.scrollIntoView)a.scrollIntoView({block:"nearest"});}}
function choose(id){set("ld-route:goal",id||null);openMenu=false;drawPick();pick.querySelector(".tp-gb").focus({preventScroll:true});paint(true);
  window.dispatchEvent(new CustomEvent("ld-route",{detail:"prog"}));}
if(pick){
  pick.addEventListener("click",e=>{e.stopPropagation();const o=e.target.closest("[data-goal]");if(o){choose(o.dataset.goal);return;}
    if(e.target.closest(".tp-gb")){openMenu=!openMenu;const g=goal(get("ld-route:goal"));act=Math.max(0,goals().findIndex(x=>x.id===(g?g.id:"")));drawPick();}});
  pick.addEventListener("keydown",e=>{const n=goals().length;
    if(!openMenu){if(e.target.closest(".tp-gb")&&(e.key==="ArrowDown"||e.key==="ArrowUp")){e.preventDefault();openMenu=true;const g=goal(get("ld-route:goal"));act=Math.max(0,goals().findIndex(x=>x.id===(g?g.id:"")));drawPick();}return;}
    if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();act=(act+(e.key==="ArrowDown"?1:n-1))%n;drawPick();}
    else if(e.key==="Home"||e.key==="End"){e.preventDefault();act=e.key==="Home"?0:n-1;drawPick();}
    else if(e.key==="Enter"||e.key===" "){e.preventDefault();choose(goals()[act].id);}
    else if(e.key==="Escape"||e.key==="Tab"){openMenu=false;drawPick();if(e.key==="Escape")pick.querySelector(".tp-gb").focus();}});
  document.addEventListener("click",e=>{if(openMenu&&!pick.contains(e.target)){openMenu=false;drawPick();}});}

// ---- the one toggle: hide what isn't on the goal's path (the map hides its stations too)
if(hideIn)hideIn.addEventListener("change",()=>{set("ld-route:hide",hideIn.checked||null);paint();window.dispatchEvent(new CustomEvent("ld-route",{detail:"prog"}));});

// ---- everything that shows progress or the goal
function paint(fresh){
  const g=TOP?null:goal(get("ld-route:goal")),hide=!!g&&get("ld-route:hide")===true,stops=g?g.stops.map(id=>ITEM[id]).filter(i=>i&&!i.soon):[],onT=new Set(stops.map(i=>i.topic));
  const all=TOP?live(TOP):D.topics.flatMap(live),scope=g?stops:all,tot=sum(scope);
  const nx=scope.find(i=>i.films.some(p=>!S(p,0,0).watched));
  if(you&&TOP){const yb=you.querySelector("[data-yb]");if(yb)yb.innerHTML='<p class="r-kick">'+esc(X.you)+'</p>'+line(tot);}
  else if(you){you.hidden=false;
    you.innerHTML='<div class="tp-yb"><p class="r-kick">'+esc(X.you)+(g?' · '+esc(g.name):'')+'</p>'+line(tot)+'</div>'+
      (nx?'<a class="btn primary tp-cont" href="'+esc(base+nx.href)+'"><span>'+esc(tot.f||tot.l||tot.n?X.cont:X.st_start)+'</span><small'+(nx.lang?' lang="'+nx.lang+'"':'')+'>'+esc(nx.title)+'</small></a>':'');}
  if(gline){const nt=onT.size,st=stops.length;
    gline.innerHTML=g?'<b>'+esc(fill(X.gline,{s:st===1?X.stop1:fill(X.stops,{n:st}),t:nt===1?X.topic1:fill(X.topicn,{n:nt})}))+'</b> '+esc(g.line):esc(X.gline_all);}
  if(hideBox){hideBox.hidden=!g;hideIn.checked=get("ld-route:hide")===true;}
  let shown=0;
  rows.forEach(r=>{const t=D.topics.find(x=>x.id===r.id);if(!t)return;const o=sum(live(t)),off=!!g&&!onT.has(t.id);
    const m=r.querySelector("[data-tmx]");if(m)m.innerHTML=line(o);
    r.classList.toggle("off",off);
    r.hidden=hide&&off;if(!r.hidden)shown++;
    if(fresh&&g&&!off){const d=r.querySelector("details");if(d)d.open=true;}
    r.querySelectorAll(".topic-card.soon").forEach(c=>{c.hidden=hide;});});
  // every card of a film or series: its icon line, what to do next, and its step on the goal's path
  list.querySelectorAll("[data-item]").forEach(c=>{const i=ITEM[c.dataset.item];if(!i)return;const io=sum([i]),n=stops.indexOf(i)+1,on=!g||onT.has(i.topic);
    let el=c.querySelector(".tp-cm");if(!el){el=document.createElement("div");el.className="tp-cm";c.querySelector(".tc-body").appendChild(el);}
    const w=state(io);
    el.innerHTML=line(io)+'<span class="tp-st '+w+'">'+esc(w==="done"?X.st_again:w==="on"?X.st_cont:X.st_start)+'</span>';
    let b=c.querySelector(".tp-step");if(n){if(!b){b=document.createElement("span");b.className="tp-step";c.appendChild(b);}b.textContent=fill(X.step,{n:n,of:stops.length});}else if(b)b.remove();
    c.classList.toggle("off",!!g&&on&&!n);c.hidden=hide&&on&&!n;});
  if(TOP)return;
  list.querySelectorAll(".ix-group").forEach(gr=>{if(gr.dataset.search)return;gr.classList.toggle("tp-empty",[...gr.querySelectorAll("section.topic")].every(r=>r.hidden));});
  let none=list.querySelector(".tp-none");if(!shown){if(!none){none=document.createElement("p");none.className="tp-none";none.textContent=X.none;(gline||list).after(none);}}else if(none)none.remove();}
drawPick();paint(true);
window.addEventListener("ld-route",e=>{if(e.detail!=="prog"){drawPick();paint(true);}});
window.addEventListener("storage",()=>{drawPick();paint(false);});window.addEventListener("pageshow",e=>{if(e.persisted)paint(false);});
})();
