/* Learning Data: a series' labs page and evaluation page, laid out as their template says (docs/page-templates.md), the same for
   every series. Each series' own engine (assets/<series>/learn.js) draws the labs (#series-labs: a rail of tabs, .stops, and the
   open lab, .stop) or the situations (#series-quiz: .dots, a .qcard, and .qdone at the end). This script moves nothing the engines
   hold on to: it marks what they drew, and practice.css lays it out.
   - Labs: each tab is a circle under its film's number; its ring fills with the lab's experiments done, and shows a tick when all
     are. One line names the open lab. The lab's ideas fold under "What this shows", below the playground.
   - Evaluation: each dot sits under its film's number; the result adds "Retry the ones you missed" and where to go next.
   - The hero's line of icons (labs seen, answered, right) follows what happens on the page.
   What it needs is in the app's data-practice-page (site-tools/build_series.py): map, each lab's [id, film] or each situation's
   film, in the order shown; text, its words; next, where the result leads. Experiments are read where the engines keep them:
   "<store>:goals" by lab id, the classic kinds' "ld-classic-goals" by page and lab, and the open lab's own list. How many a lab
   has is known once it has been opened, and kept ("<store>:goaln"). */
(()=>{"use strict";
const app=document.querySelector("[data-practice-page]");if(!app)return;
let D;try{D=JSON.parse(app.dataset.practicePage);}catch(e){return;}
const X=D.text,P=app.dataset.store,labs=app.id==="series-labs";
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const read=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)||d;}catch(e){return d;}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const h=(t,a,...kids)=>{const el=document.createElement(t);for(const k in a||{})el.setAttribute(k,a[k]);el.append(...kids.filter(x=>x!=null));return el;};
const set=(el,k,v)=>{if(el.getAttribute(k)!==v)el.setAttribute(k,v);};
const cls=(el,c,on)=>{if(el.classList.contains(c)!==!!on)el.classList.toggle(c,!!on);};
const text=(el,t)=>{if(el.textContent!==t)el.textContent=t;};

function strip(){if(!window.LD_STATS)return;document.querySelectorAll(".pr-strip [data-practice]").forEach(u=>{
  const st=window.LD_STATS(u.dataset.practice,+u.dataset.labs,+u.dataset.quiz);u.querySelectorAll("[data-k]").forEach(b=>text(b,String(st[b.dataset.k])));});}
// the first of each film's circles carries the film's number, which practice.css writes above it
function byFilm(btns,film){let last=null;btns.forEach((b,i)=>{const f=film(b,i),first=f!=null&&f!==last;last=f;cls(b,"pr-first",first);
  if(first)set(b,"data-fl",fill(X.film,{n:f}));else if(b.hasAttribute("data-fl"))b.removeAttribute("data-fl");});}

/* ---------- the labs ---------- */
const page=location.pathname.replace(/^\/es\//,"/");
function labsPage(){const rail=app.querySelector(".stops");if(!rail)return;const tabs=[...rail.children],FILM=Object.fromEntries(D.map);
  const stop=app.querySelector(".stop"),on=tabs.find(b=>b.getAttribute("aria-selected")==="true");
  const kept=read(P+":goals",{}),classic=read("ld-classic-goals",{}),count=read(P+":goaln",{});
  // the open lab says how many experiments it has, and how many are done
  let open=null;
  if(stop&&on){const list=stop.querySelector('ol[class$="-goals"],ul[class$="-goals"]');
    open={id:on.dataset.id,of:list?list.children.length:0,n:list?list.querySelectorAll("li.ok").length:0};
    if(count[open.id]!==open.of){count[open.id]=open.of;write(P+":goaln",count);}}
  const exp=id=>{if(open&&open.id===id)return open;const done=(kept[id]||classic[page+"#"+id]||[]).length,of=count[id];
    return{n:done,of:of!=null?Math.max(of,done):done?Math.max(3,done):null};};
  byFilm(tabs,b=>FILM[b.dataset.id]);
  tabs.forEach((b,i)=>{const e=exp(b.dataset.id),seen=b.classList.contains("done"),name=b.textContent.replace(/^\d+/,"").trim();
    const f=e.of?e.n/e.of:e.of===0&&seen?1:0;if(b.style.getPropertyValue("--f")!==String(f))b.style.setProperty("--f",String(f));
    cls(b,"pr-full",f>=1);set(b,"title",fill(X.tab,{i:i+1,t:name})+(e.of?" · "+fill(X.exp,e):seen?" · "+X.seen:""));});
  // one line under the circles: where you are
  let now=app.querySelector(".pr-now");if(!now){now=h("p",{class:"pr-now"},h("b"),h("span"));rail.after(now);}
  // on a phone the circles are one row to swipe along: bring the open one into view, without moving the page
  if(on&&rail.scrollWidth>rail.clientWidth&&rail.dataset.at!==on.dataset.id){rail.dataset.at=on.dataset.id;rail.scrollLeft=on.offsetLeft-rail.offsetLeft-(rail.clientWidth-on.offsetWidth)/2;}
  if(on&&open){text(now.firstChild,fill(X.lab,{i:tabs.indexOf(on)+1,n:tabs.length}));text(now.lastChild,open.of?" · "+fill(X.exp,open):"");}
  if(!stop)return;
  // "Try these", with the count, right above the controls
  const gh=stop.querySelector('p[class$="-gh"]');if(gh&&open&&open.of){let c=gh.querySelector(".pr-n");if(!c){gh.textContent=X.tryit+" ";c=h("b",{class:"pr-n"});gh.append(c);}text(c,open.n+"/"+open.of);}
  if(stop.dataset.pr)return;stop.dataset.pr="1";
  // the lab's ideas, its film and its chapter fold under the playground; the lab's name, its one line and Next stay in sight
  const st=stop.querySelector(".stop-text");if(!st)return;
  const film=st.querySelector(':scope > p[class$="-film"]'),ul=st.querySelector(":scope > ul"),real=st.querySelector(":scope > details.real"),nav=st.querySelector(":scope > .stop-nav");
  const watch=nav&&nav.querySelector('a[href*="#t="]'),name=film?film.textContent.trim():"";
  if(ul||real){const inn=h("div",{class:"pr-in"});
    const fold=h("details",{class:"pr-fold"},h("summary",null,h("b",null,X.shows),name?h("small",null," · "+fill(X.from_,{t:name})):null),inn);
    (nav||st.lastChild).before(fold);inn.append(...[ul,real,film,watch&&h("p",{class:"pr-watch"},watch)].filter(Boolean));}
  const end=nav&&nav.querySelector('a.btn.primary[href$="scenarios/"]');if(end)end.textContent=X.toEval+" →";}

/* ---------- the evaluation ---------- */
function quizPage(){const dots=app.querySelector(".dots");if(!dots)return;byFilm([...dots.children],(b,i)=>D.map[i]);
  const done=app.querySelector(".qdone");if(!done||done.querySelector(".pr-done"))return;
  const all=read(P+":quiz",{}),ans=all.ans||all,missed=Object.keys(ans).filter(k=>/^\d+$/.test(k)&&ans[k]&&!ans[k].ok);
  const retry=missed.length?h("button",{type:"button",class:"btn"},X.retry):null;
  if(retry)retry.addEventListener("click",()=>{missed.forEach(k=>delete ans[k]);write(P+":quiz",all);try{sessionStorage.setItem("pr-retry","1");}catch(e){}location.hash="";location.reload();});
  // one row of buttons: the engine's own "Start again" (it keeps its handler), the missed ones, and the way on
  const box=done.querySelector(":scope > div:last-child")||done,again=box.querySelector(":scope > button.btn");
  box.append(h("div",{class:"pr-done"},h("a",{class:"btn primary",href:D.next[0]},D.next[1]+" →"),retry));if(again)box.lastChild.append(again);}
// after "Retry the ones you missed": open the first situation still to answer
function retried(){let go=false;try{go=sessionStorage.getItem("pr-retry")==="1";sessionStorage.removeItem("pr-retry");}catch(e){}
  if(!go)return;const b=[...app.querySelectorAll(".dots button")].find(x=>!x.classList.contains("ok")&&!x.classList.contains("no"));if(b)b.click();}

let due=0;
function paint(){due=0;try{(labs?labsPage:quizPage)();strip();}catch(e){}}
const later=()=>{if(!due)due=requestAnimationFrame(paint);};
new MutationObserver(later).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:["class","aria-selected"]});
paint();if(!labs)retried();
})();
