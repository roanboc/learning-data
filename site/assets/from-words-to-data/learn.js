/* Learning Data: From words to data. The labs (Take it apart) and the scenarios (Make the call) of every film in the series,
   from one engine: each film's page loads its film bundle (for the film's own pictures), its words (assets/<film>/learn.en.js or
   learn.es.js, which set window.FW), and this file.
   A lab is one of five kinds, described entirely by its words:
     sort     place each item in a bucket, then check: every item says why it belongs where it does
     count    switch what counts, and watch the number move towards, or away from, each office's answer
     pick     choose one option, and see what it gets right and wrong
     compose  build a sentence from parts, such as a definition: the kind of thing, then what sets it apart
     steps    walk through a sequence, one step at a time
   Pictures come from the film's own components: a lab's or a scenario's "vis" names a function in the film's LV registry
   (or the series' LVS), which draws on a canvas with the same code as the film.
   Progress stays in this browser, under FW.store (visited labs, answers); path.js paints the stepper and the topic cards from it. */
(()=>{"use strict";
const L=window.FW;if(!L)return;const U=L.ui,P=L.store;
const get=(k,d)=>{try{const v=localStorage.getItem(P+":"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const set=(k,v)=>{try{localStorage.setItem(P+":"+k,JSON.stringify(v));}catch(e){}
  // path.js repaints the stepper on "storage", which only other tabs fire: fire it here too
  try{window.dispatchEvent(new StorageEvent("storage",{key:P+":"+k}));}catch(e){}};
/* A lab or a scenario can name the files it's about in the series' example project: repo:[paths], links under L.repoBase.
   Optional: without repo, or without L.repoBase, nothing is drawn. A folder ends with "/". */
const repoLinks=x=>!(x&&x.repo&&x.repo.length&&L.repoBase)?null:h("p",{class:"fw-repo"},h("b",null,(U.repo||"See it in the project:")+" "),
  ...x.repo.flatMap((f,i)=>[i?" · ":"",h("a",{href:L.repoBase.replace(/\/blob\/main\//,f.endsWith("/")?"/tree/main/":"/blob/main/")+f.replace(/\/$/,""),target:"_blank",rel:"noopener"},h("code",null,f))]));
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(v==null||v===false)continue;if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(k==="html")e.innerHTML=v;else e.setAttribute(k,v===true?"":v);}
  kids.flat().forEach(c=>{if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));});return e;}
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
// thousands with a comma in English and a dot in Spanish, for every number (es-ES leaves four-digit numbers ungrouped)
const num=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,L.lang==="es"?".":",");
// rounded up: rounding down lands on the last frame of the chapter before
const chapterStart=id=>{try{const s=SCENES.find(x=>x.id===id);return s?Math.ceil(s.start):0;}catch(e){return 0;}};
const ready=()=>window.FILM&&FILM.ready?FILM.ready:Promise.resolve();
const VIS=n=>{try{if(typeof LV!=="undefined"&&LV[n])return LV[n];}catch(e){}try{if(typeof LVS!=="undefined"&&LVS[n])return LVS[n];}catch(e){}return null;};
function stage(w,hgt,draw,label){const cv=h("canvas",{role:"img","aria-label":label||""});
  function paint(){const d=Math.min(window.devicePixelRatio||1,2),cw=Math.max(300,Math.round((cv.clientWidth||w)*d));if(cv.width!==cw){cv.width=cw;cv.height=Math.round(cw*hgt/w);}
    const ctx=cv.getContext("2d"),k=cv.width/w;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(k,0,0,k,0,0);
    ctx.fillStyle="#070b16";ctx.fillRect(0,0,w,hgt);try{draw(ctx);}catch(e){}}
  cv.style.aspectRatio=w+"/"+hgt;if("ResizeObserver" in window)new ResizeObserver(()=>paint()).observe(cv);return{el:cv,paint};}
function seg(opts,cur,on,label){const s=h("div",{class:"seg",role:"group","aria-label":label||""});opts.forEach(([k,t])=>s.append(h("button",{type:"button","aria-pressed":String(k===cur),"data-k":k,
  onclick:()=>{s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===k)));on(k);}},t)));return s;}
const labOf=id=>L.labs.find(x=>x.id===id);
// a lab's picture, if it has one: the film's own drawing, given the lab's state
function picture(Lb,state){const f=VIS(Lb.vis);if(!f)return null;const st=stage(Lb.vw||960,Lb.vh||420,c=>f(c,Lb.vw||960,Lb.vh||420,state(),L),Lb.name);return st;}

/* ---------- sort: every item in its bucket ---------- */
function labSort(Lb){const W=Lb.w,box=h("div",{class:"lab"}),say=h("p",{class:"lab-say",role:"status"}),pick={};let checked=false;
  const pic=picture(Lb,()=>({pick,checked}));
  const rows=h("div",{class:"fw-rows"}),btn=h("button",{type:"button",class:"chip-btn go",onclick:()=>{checked=true;upd();}},U.check),again=h("button",{type:"button",class:"chip-btn sm",onclick:()=>{for(const k in pick)delete pick[k];checked=false;draw();upd();}},U.again);
  function draw(){rows.replaceChildren(...W.items.map((it,i)=>{const ok=checked&&pick[i]===it.b,no=checked&&pick[i]!==it.b;
    return h("div",{class:"fw-row"+(ok?" ok":no?" no":"")},h("p",{class:"fw-item"},it.t),seg(W.buckets.map(b=>[b[0],b[1]]),pick[i],k=>{pick[i]=k;if(checked){checked=false;}upd();},it.t),
      checked?h("p",{class:"fw-why"},h("b",null,ok?U.right:U.wrong+" "+fill(U.belongs,{b:(W.buckets.find(b=>b[0]===it.b)||[,""])[1]}))," ",it.why):null);}));}
  function upd(){const n=Object.keys(pick).length,right=W.items.filter((it,i)=>pick[i]===it.b).length;btn.disabled=n<W.items.length;
    if(checked)draw();else rows.querySelectorAll(".fw-row").forEach(r=>{r.classList.remove("ok","no");const w=r.querySelector(".fw-why");if(w)w.remove();});
    say.textContent=checked?fill(right===W.items.length?W.sayAll:W.saySome,{n:right,of:W.items.length}):(n<W.items.length?fill(U.placed,{n,of:W.items.length}):U.ready);if(pic)pic.paint();}
  draw();box.append(...(pic?[pic.el]:[]),h("p",{class:"lab-info"},W.prompt),rows,h("div",{class:"lab-controls"},btn,again),say);ready().then(upd);return box;}

/* ---------- count: what counts, and the number it makes ---------- */
function labCount(Lb){const W=Lb.w,on=new Set(W.start||[]),box=h("div",{class:"lab"}),say=h("p",{class:"lab-say",role:"status"}),total=h("p",{class:"fw-total"}),targets=h("div",{class:"fw-targets"});
  const pic=picture(Lb,()=>({on,total:sum()}));
  const sum=()=>W.items.filter(it=>on.has(it.k)).reduce((a,it)=>a+it.n,0),same=(a,b)=>a.length===b.size&&a.every(k=>b.has(k));
  const toggles=h("div",{class:"fw-toggles",role:"group","aria-label":W.label},...W.items.map(it=>h("label",null,h("input",{type:"checkbox",checked:on.has(it.k)||null,onchange:e=>{e.target.checked?on.add(it.k):on.delete(it.k);upd();}}),h("span",null,it.t),h("b",null,num(it.n)))));
  function upd(){const n=sum(),hit=W.targets.find(tg=>same(tg.set,on));total.replaceChildren(h("span",null,W.unit),h("b",null,num(n)));
    targets.replaceChildren(...W.targets.map(tg=>{const v=W.items.filter(it=>tg.set.includes(it.k)).reduce((a,it)=>a+it.n,0),m=same(tg.set,on);
      return h("p",{class:"fw-target"+(m?" hit":""),style:"--c:"+tg.c},h("i"),h("span",null,tg.name),h("b",null,num(v)));}));
    say.textContent=hit?hit.say:W.sayNone;if(pic)pic.paint();}
  box.append(...(pic?[pic.el]:[]),h("p",{class:"lab-info"},W.prompt),toggles,total,targets,say);ready().then(upd);return box;}

/* ---------- pick: one option, and what it gets right ---------- */
function labPick(Lb){const W=Lb.w;let cur=W.opts[0][0];const box=h("div",{class:"lab"}),say=h("p",{class:"lab-say",role:"status"}),list=h("ul",{class:"fw-list"}),stats=h("div",{class:"fw-stats"});
  const pic=picture(Lb,()=>({pick:cur}));
  function upd(){const r=W.res[cur];list.replaceChildren(...W.checks.map((t,i)=>h("li",{class:r[i]===1||r[i]===true?"ok":r[i]===0.5?"warn":"no"},t)));
    stats.replaceChildren(...(W.stats&&W.stats[cur]?W.stats[cur].map(([n,t])=>h("p",null,h("b",null,n),h("span",null,t))):[]));say.textContent=W.say[cur];if(pic)pic.paint();}
  box.append(...(pic?[pic.el]:[]),h("div",{class:"lab-controls"},h("span",{class:"lbl"},W.label),seg(W.opts,cur,k=>{cur=k;upd();},W.label)),stats,list,say);ready().then(upd);return box;}

/* ---------- compose: a sentence from parts ---------- */
function labCompose(Lb){const W=Lb.w,pick=W.slots.map(()=>null),box=h("div",{class:"lab"}),say=h("p",{class:"lab-say",role:"status"}),out=h("p",{class:"fw-sentence"}),notes=h("ul",{class:"fw-list"});
  const pic=picture(Lb,()=>({pick}));
  const slots=W.slots.map((sl,i)=>h("div",{class:"lab-controls fw-slot"},h("span",{class:"lbl"},sl.label),seg(sl.opts.map((o,j)=>[String(j),o.t]),null,k=>{pick[i]=+k;upd();},sl.label)));
  function upd(){out.replaceChildren(h("b",null,W.head+" "),...W.slots.map((sl,i)=>pick[i]==null?h("span",{class:"gap"},"…"):h("span",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].t+" ")));
    notes.replaceChildren(...W.slots.map((sl,i)=>pick[i]==null?null:h("li",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].why)).filter(Boolean));
    const done=pick.every(p=>p!=null),good=done&&pick.every((p,i)=>W.slots[i].opts[p].ok);say.textContent=!done?W.sayStart:good?W.sayGood:W.sayFix;if(pic)pic.paint();}
  box.append(...(pic?[pic.el]:[]),h("p",{class:"lab-info"},W.prompt),...slots,out,notes,say);ready().then(upd);return box;}

/* ---------- steps: a sequence, one step at a time ---------- */
function labSteps(Lb){const W=Lb.w;let cur=0;const box=h("div",{class:"lab"}),say=h("p",{class:"lab-say",role:"status"}),ol=h("ol",{class:"fw-steps"});
  const pic=picture(Lb,()=>({step:cur}));
  const prev=h("button",{type:"button",class:"chip-btn",onclick:()=>{if(cur>0){cur--;upd();}}},"← "+U.back),next=h("button",{type:"button",class:"chip-btn go",onclick:()=>{if(cur<W.steps.length-1){cur++;upd();}}},U.nextStep+" →");
  function upd(){ol.replaceChildren(...W.steps.map((s,i)=>h("li",{class:i<cur?"done":i===cur?"on":"",...(i===cur?{"aria-current":"step"}:{})},h("b",null,s.t),i===cur?h("span",null,s.d):null)));
    prev.disabled=cur===0;next.disabled=cur===W.steps.length-1;say.textContent=cur===W.steps.length-1?W.sayEnd:fill(U.stepOf,{n:cur+1,of:W.steps.length});if(pic)pic.paint();}
  box.append(...(pic?[pic.el]:[]),h("p",{class:"lab-info"},W.prompt),ol,h("div",{class:"lab-controls"},prev,next),say);ready().then(upd);return box;}
const BUILD={sort:labSort,count:labCount,pick:labPick,compose:labCompose,steps:labSteps};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
const labsApp=document.getElementById("fw-labs");
if(labsApp){labsApp.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),holder=h("div");const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=labOf(id)||L.labs[0];visited.add(Lb.id);set("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.classList.toggle("done",visited.has(b.dataset.id));});
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1];
    holder.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,p))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real),repoLinks(Lb)),
        h("div",{class:"stop-nav"},h("a",{class:"btn",href:"../#t="+chapterStart(Lb.chapter)},U.watch),nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus)holder.scrollIntoView({block:"start"});}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
  labsApp.append(rail,holder);show((location.hash||"").slice(1));}

/* ---------- the scenarios page: evaluation ---------- */
const quizApp=document.getElementById("fw-quiz");
if(quizApp){quizApp.textContent="";const QS=L.qs,ans=get("quiz",{});let cur=0;
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");bar.append(dots,score);quizApp.append(h("div",{class:"quiz"},bar,card));
  const labName=id=>(labOf(id)||{name:""}).name,labHref=id=>"../labs/#"+id;
  function paintBar(){dots.replaceChildren(...QS.map((q,i)=>h("button",{type:"button",class:ans[i]?(ans[i].ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1),onclick:()=>{cur=i;render();}},String(i+1))));
    const n=Object.keys(ans).length,ok=Object.values(ans).filter(a=>a.ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+n+" "+U.answered+" · "+(QS.length-n)+" "+U.toGo));}
  function done(ok){ans[cur]={ok};set("quiz",ans);paintBar();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why),repoLinks(q));
  function foot(q){const last=cur===QS.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:labHref(q.lab)},U.explore+" "+labName(q.lab)),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results();else{cur+=1;render();}}},last?U.results:U.nextQ));}
  function render(){paintBar();const q=QS[cur],body=h("div",{class:"qbody"}),f=VIS(q.vis),vis=stage(600,320,c=>{if(f)f(c,600,320,{q},L);},q.title),out=h("div");
    body.append(h("p",{class:"qtag",style:"--c:"+((labOf(q.lab)||{}).c||"#78c8ff")},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+QS.length),h("h3",null,q.title),h("p",{class:"qsit"},q.sit));
    if(q.type==="choice"){const box=h("div",{class:"qopts"});q.opts.forEach((o,i)=>box.append(h("button",{type:"button",class:"qopt",onclick:()=>{[...box.children].forEach((b,j)=>{b.disabled=true;if(q.opts[j].ok)b.classList.add("ok");});
      if(!o.ok){box.children[i].classList.add("no");box.children[i].append(h("small",null,o.why));}done(!!o.ok);out.replaceChildren(feed(!!o.ok,q),foot(q));}},h("span",{class:"k"},"ABCD"[i]),h("span",null,o.t))));body.append(box);}
    if(q.type==="order"){let ord=q.items.map((t,i)=>i).sort((a,b)=>((a*7+3)%q.items.length)-((b*7+3)%q.items.length));const box=h("ol",{class:"qorder"});
      const draw=()=>box.replaceChildren(...ord.map((ix,p)=>h("li",null,h("span",{class:"n"},String(p+1)),h("span",null,q.items[ix]),h("span",{class:"mv"},h("button",{type:"button","aria-label":U.up,onclick:()=>{if(p>0){[ord[p-1],ord[p]]=[ord[p],ord[p-1]];draw();}}},"↑"),h("button",{type:"button","aria-label":U.down,onclick:()=>{if(p<ord.length-1){[ord[p+1],ord[p]]=[ord[p],ord[p+1]];draw();}}},"↓")))));draw();
      body.append(box,h("button",{type:"button",class:"btn primary",onclick:e=>{const ok=ord.every((ix,p)=>ix===p);[...box.children].forEach((li,p)=>{li.classList.add(ord[p]===p?"ok":"no");li.querySelectorAll("button").forEach(b=>b.disabled=true);});e.target.remove();done(ok);out.replaceChildren(feed(ok,q),foot(q));}},U.check));}
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis"},vis.el),body));ready().then(()=>vis.paint());}
  function results(){paintBar();const ok=Object.values(ans).filter(a=>a.ok).length,n=QS.length,band=L.done[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};QS.forEach((q,i)=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(ans[i]&&ans[i].ok)by[k].ok++;});
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/n*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",null,band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:labHref(k),class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+(labOf(k)||{c:"#a0b2cd"}).c},h("i"),labName(k)+" · "+by[k].ok+"/"+by[k].n))),
      h("button",{type:"button",class:"btn",onclick:()=>{for(const k in ans)delete ans[k];set("quiz",ans);cur=0;render();}},U.again))));}
  const first=QS.findIndex((q,i)=>!ans[i]);if(first<0)results();else{cur=first;render();}}
})();
