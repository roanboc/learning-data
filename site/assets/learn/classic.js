/* Learning Data: the classic lab kinds, shared by every series' engine (site/assets/<dir>/learn.js) beside its playgrounds.
   A film has up to four labs (the author, 19 November 2026): its playground, and up to three more, chosen for being the most
   interactive and meaningful to people. Those come back from the films' first labs in these kinds, each described entirely by its
   words (Lb.w), as they were written then:
     count    tick what counts, watch the total, and see which definition gives it (w.items, w.targets, w.unit, w.start)
     compose  write a request, a rule or a card from parts, one choice a row, with why each part holds (w.slots, w.head)
     pick     choose one option and see what it gets right, and what it costs (w.opts, w.checks, w.res, w.say, w.stats)
     sort     put each item where it belongs, then check, with why (w.buckets, w.items)
     steps    follow a sequence one step at a time (w.steps)
   Since 20 November 2026 each kind plays like a playground, as the intro's Auto Loader lab does: a live picture that answers every
   choice (cards fly into their boxes, checks fill like a run, a sentence is typed, a total stacks up, a token walks the path),
   readouts, and three experiments a visitor ticks as they happen, kept in this browser. The picture repeats what the controls and
   the line under it say, so it is hidden from screen readers; every change is said in words (.lab-say).
   An engine takes them with BUILD=Object.assign({},window.LD_CLASSIC.kinds,{play:labPlay}). The parts use the site's shared lab
   classes (.lab, .seg, .chip-btn, .lab-controls, .lab-read, .lab-info, .lab-say) and classic.css; nothing waits for a film's player.
   site-tools/smoke/classic.js plays each kind through for smoke.py's series-learn check. */
(function(){"use strict";
const ES=(document.documentElement.lang||"en").slice(0,2)==="es";
const U=ES?{check:"Comprobar",again:"Empezar de nuevo",right:"Correcto.",wrong:"No del todo:",belongs:"va en «{b}».",placed:"{n} de {of} ubicados.",
  ready:"Todos ubicados: comprueba tus respuestas.",back:"Atrás",nextStep:"Siguiente paso",stepOf:"Paso {n} de {of}.",total:"Total",
  goals:"Experimentos",nOf:"{n} de {of} hechos",reachedOne:"Experimento hecho: {t}.",toPlace:"Por ubicar",put:"«{s}» va a «{b}».",
  rPlaced:"Ubicados",rRight:"Bien ubicados",rChecks:"Comprobaciones",rChosen:"Partes elegidas",rHold:"Partes que se sostienen",
  rPassed:"Criterios cumplidos",rTried:"Opciones probadas",rTicked:"Marcados",rMatched:"Conteos encontrados",rStep:"Paso",
  pickStart:"Elige una opción y mira lo que consigue, criterio por criterio.",play:"Recorrerlo solo",stop:"Parar",
  gSortAll:"Ubica cada tarjeta en una caja",gSortCheck:"Comprueba y lee por qué va cada una",gSortRight:"Ubica todas bien",
  gComposeAll:"Completa cada parte",gComposeNo:"Elige una parte que no se sostiene y lee por qué",gComposeGood:"Escribe una en la que todas las partes se sostienen",
  gPickOne:"Elige una opción y mira cómo se desarrolla",gPickTwo:"Compara dos opciones",gPickAll:"Prueba todas y mira qué le falta a cada una",
  gCountMove:"Marca o desmarca uno y mira el total",gCountOne:"Encuentra uno de los conteos",gCountAll:"Encuentra todos los conteos",
  gStepsEnd:"Llega al final, paso a paso",gStepsBack:"Vuelve a un paso anterior y reléelo",gStepsPlay:"Recórrelo solo de principio a fin"}
 :{check:"Check",again:"Start again",right:"Right.",wrong:"Not quite:",belongs:"it belongs in “{b}”.",placed:"{n} of {of} placed.",
  ready:"All placed: check your answers.",back:"Back",nextStep:"Next step",stepOf:"Step {n} of {of}.",total:"Total",
  goals:"Experiments",nOf:"{n} of {of} done",reachedOne:"Experiment done: {t}.",toPlace:"To place",put:"“{s}” goes in “{b}”.",
  rPlaced:"Placed",rRight:"In the right place",rChecks:"Checks",rChosen:"Parts chosen",rHold:"Parts that hold",
  rPassed:"Passed",rTried:"Options tried",rTicked:"Ticked",rMatched:"Counts found",rStep:"Step",
  pickStart:"Choose one, and watch what it gets right, check by check.",play:"Play it through",stop:"Stop",
  gSortAll:"Put every card in a box",gSortCheck:"Check, and read why each belongs",gSortRight:"Get every card in the right place",
  gComposeAll:"Fill every part",gComposeNo:"Choose a part that doesn't hold, and read why",gComposeGood:"Write one where every part holds",
  gPickOne:"Choose one, and watch it play out",gPickTwo:"Compare two options",gPickAll:"Try every option, and see what each one misses",
  gCountMove:"Tick or untick one, and watch the total",gCountOne:"Find one of the counts",gCountAll:"Find every count",
  gStepsEnd:"Walk to the end, step by step",gStepsBack:"Step back, and read one again",gStepsPlay:"Play it through on its own"};
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(v==null||v===false)continue;
  if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?"":v);}
  for(const c of kids.flat())if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(String(c)));return e;}
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const num=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,ES?".":",");
const RM=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}};
const PAL=["#ffd166","#7ec8ff","#ff9f80","#9be38f","#c9a7ff","#ffb3d1","#7fe0d0","#f5e08a"];
const plain=s=>String(s==null?"":s).replace(/<\/?b>/g,"");
const short=(t,n)=>{t=plain(t);n=n||34;return t.length>n?t.slice(0,n-1).replace(/\s+\S*$/,"")+"…":t;};
// words carry <b>…</b>: made into elements, never read as HTML
const rich=s=>String(s==null?"":s).split(/(<b>.*?<\/b>)/).filter(Boolean).map(x=>/^<b>/.test(x)?h("b",null,x.slice(3,-4)):x);
function seg(opts,cur,on,label){const s=h("div",{class:"seg",role:"group","aria-label":label||""});
  opts.forEach(([k,t])=>s.append(h("button",{type:"button","aria-pressed":String(String(k)===String(cur)),"data-k":k,
    onclick:()=>{s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===String(k))));on(k);}},t)));return s;}
const box=Lb=>h("div",{class:"lab lc-lab","data-kind":Lb.kind,style:"--c:"+Lb.c});
const say=()=>h("p",{class:"lab-say",role:"status"});
const info=t=>t?h("p",{class:"lab-info"},...rich(t)):null;
const pic=(...kids)=>h("div",{class:"lc-pic","aria-hidden":"true"},...kids);
// a short animation, skipped when the visitor asks for less motion
function anim(el,frames,o){if(RM()||!el||!el.animate)return;try{el.animate(frames,Object.assign({duration:420,easing:"cubic-bezier(.3,1.3,.5,1)"},o||{}));}catch(e){}}
// moves an element to a new parent, and lets it glide there from where it was
function glide(el,parent,before){const a=el.getBoundingClientRect();parent.insertBefore(el,before||null);if(RM())return;
  const z=el.getBoundingClientRect(),dx=a.left-z.left,dy=a.top-z.top;if((!dx&&!dy)||!a.width)return;
  anim(el,[{transform:`translate(${dx}px,${dy}px) scale(1.08)`,boxShadow:"0 10px 24px rgba(0,0,0,.45)"},{transform:"none",boxShadow:"none"}],{duration:560});}
// a number that counts up or down to its new value
function tally(el,to,fmt){fmt=fmt||num;const from=+(el.dataset.v||0);el.dataset.v=to;if(RM()||from===to){el.textContent=fmt(to);return;}
  const t0=performance.now(),d=480;(function f(now){const u=Math.min(1,(now-t0)/d),e=1-Math.pow(1-u,3);el.textContent=fmt(from+(to-from)*e);if(u<1)requestAnimationFrame(f);})(t0);}
// the readouts under the controls, as on every playground
function readouts(pairs){const el=h("div",{class:"lab-read"}),vs=pairs.map(([l])=>{const v=h("b",null,"–");el.append(h("span",null,l+":",v));return v;});
  return{el,set:(...xs)=>xs.forEach((x,i)=>{if(vs[i]&&vs[i].textContent!==String(x)){vs[i].textContent=String(x);anim(vs[i],[{color:"#ffd166"},{color:""}],{duration:700,easing:"ease-out"});}})};}
// three experiments, ticked as they happen and kept in this browser, like a playground's
const KEY="ld-classic-goals",ld=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")||{};}catch(e){return{};}};
function goals(Lb,list,s){const id=location.pathname.replace(/^\/es\//,"/")+"#"+Lb.id;let got=new Set((ld()[id]||[]).filter(k=>list.some(g=>g[0]===k)));
  const ol=h("ol",{class:"lc-goals"}),el=h("div",{class:"lc-goalbox"},h("p",{class:"lc-gh"},U.goals),ol);
  function paint(pop){ol.replaceChildren(...list.map(([k,t],i)=>h("li",{class:(got.has(k)?"ok":"")+(pop===k?" pop":"")},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t))));
    ol.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n:got.size,of:list.length}));}
  paint();
  return{el,reach:k=>{if(got.has(k)||!list.some(g=>g[0]===k))return;got.add(k);const all=ld();all[id]=[...got];try{localStorage.setItem(KEY,JSON.stringify(all));}catch(e){}
    paint(k);s.append(h("span",{class:"lc-reached"}," "+fill(U.reachedOne,{t:list.find(g=>g[0]===k)[1]})));}};}

/* ---------- count: what counts, and the number it makes ---------- */
// The picture: a bar that stacks each ticked group, the counts as marks along it, and the total counting up.
function count(Lb){const W=Lb.w,on=new Set(W.start||[]),b=box(Lb),s=say(),total=h("p",{class:"lc-total"}),targets=h("div",{class:"lc-targets"});
  const sum=set=>W.items.filter(it=>set.has?set.has(it.k):set.includes(it.k)).reduce((a,it)=>a+it.n,0),same=(a,set)=>a.length===set.size&&a.every(k=>set.has(k));
  const all=W.items.reduce((a,it)=>a+it.n,0)||1,col=i=>PAL[i%PAL.length];
  const segs=W.items.map((it,i)=>h("i",{style:"--sc:"+col(i)})),bar=h("div",{class:"lc-stack"},...segs);
  const marks=h("div",{class:"lc-marks"},...W.targets.map((tg,i)=>h("span",{class:"lc-mark",style:`--c:${tg.c||Lb.c};left:${(100*sum(tg.set)/all).toFixed(2)}%`},h("b",null,String(i+1)))));
  const big=h("b",null,"0"),found=new Set(),G=goals(Lb,[["move",U.gCountMove],["one",U.gCountOne]].concat(W.targets.length>1?[["all",U.gCountAll]]:[]),s);
  const rd=readouts([[U.rTicked],[U.rMatched]]);let moved=false;
  const toggles=h("div",{class:"lc-toggles",role:"group","aria-label":W.label||W.prompt},...W.items.map((it,i)=>h("label",{style:"--sc:"+col(i)},
    h("input",{type:"checkbox",checked:on.has(it.k)||null,onchange:e=>{e.target.checked?on.add(it.k):on.delete(it.k);moved=true;upd();}}),h("span",null,it.t),h("b",null,num(it.n)))));
  total.append(h("span",null,W.unit||U.total),big);
  function upd(){const n=sum(on),hit=W.targets.findIndex(tg=>same(tg.set,on));tally(big,n);
    W.items.forEach((it,i)=>{segs[i].style.width=on.has(it.k)?(100*it.n/all).toFixed(2)+"%":"0";});
    if(hit>=0)found.add(hit);
    marks.querySelectorAll(".lc-mark").forEach((m,i)=>{m.classList.toggle("hit",i===hit);m.classList.toggle("seen",found.has(i));});
    targets.replaceChildren(...W.targets.map((tg,i)=>{const m=i===hit;
      return h("p",{class:"lc-target"+(m?" hit":"")+(found.has(i)?" seen":""),style:"--c:"+(tg.c||Lb.c)},h("i",null,String(i+1)),h("span",null,tg.name),h("b",null,num(sum(tg.set))));}));
    rd.set(fill("{n} / {of}",{n:on.size,of:W.items.length}),fill("{n} / {of}",{n:found.size,of:W.targets.length}));
    s.replaceChildren(...rich(hit>=0?W.targets[hit].say:W.sayNone));
    if(moved)G.reach("move");if(found.size)G.reach("one");if(found.size===W.targets.length)G.reach("all");}
  b.append(pic(total,h("div",{class:"lc-scale"},bar,marks)),info(W.prompt),G.el,toggles,targets,rd.el,s);upd();return b;}

/* ---------- compose: a sentence from parts ---------- */
// The picture: the card being written, each part typed in as it's chosen, and a strip that lights green for each part that holds.
function compose(Lb){const W=Lb.w,pick=W.slots.map(()=>null),b=box(Lb),s=say(),out=h("p",{class:"lc-sentence"}),notes=h("ul",{class:"lc-list"});
  const strip=h("div",{class:"lc-strip"},...W.slots.map(sl=>h("span",null,h("i"),h("small",null,sl.label))));
  const G=goals(Lb,[["all",U.gComposeAll],["no",U.gComposeNo],["good",U.gComposeGood]],s),rd=readouts([[U.rChosen],[U.rHold]]);let last=-1;
  const slots=W.slots.map((sl,i)=>h("div",{class:"lab-controls lc-slot"},h("span",{class:"lbl"},sl.label),seg(sl.opts.map((o,j)=>[String(j),o.s||o.t]),null,k=>{pick[i]=+k;last=i;upd();},sl.label)));
  const again=h("button",{type:"button",class:"chip-btn sm",onclick:()=>{pick.fill(null);last=-1;slots.forEach(r=>r.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false")));upd();}},U.again);
  function upd(){out.replaceChildren(h("b",null,W.head+" "),...W.slots.map((sl,i)=>pick[i]==null?h("span",{class:"gap"},"… "):h("span",{class:(sl.opts[pick[i]].ok?"ok":"no")+(i===last?" typed":"")},sl.opts[pick[i]].t+" ")));
    const typed=out.querySelector(".typed");if(typed)anim(typed,[{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0 0 0)"}],{duration:520,easing:"steps(14,end)"});
    notes.replaceChildren(...W.slots.map((sl,i)=>pick[i]==null?null:h("li",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].why)).filter(Boolean));
    [...strip.children].forEach((x,i)=>{x.className=pick[i]==null?"":W.slots[i].opts[pick[i]].ok?"ok":"no";});
    const n=pick.filter(p=>p!=null).length,held=pick.filter((p,i)=>p!=null&&W.slots[i].opts[p].ok).length;
    const done=n===pick.length,good=done&&held===pick.length;out.classList.toggle("good",good);
    if(good)anim(out,[{transform:"scale(1)"},{transform:"scale(1.025)"},{transform:"scale(1)"}],{duration:520});
    rd.set(fill("{n} / {of}",{n,of:pick.length}),fill("{n} / {of}",{n:held,of:pick.length}));
    s.className="lab-say"+(good?" lc-good":"");s.replaceChildren(...rich(!done?W.sayStart:good?W.sayGood:W.sayFix));
    if(done)G.reach("all");if(n>held)G.reach("no");if(good)G.reach("good");}
  b.append(pic(out,strip),info(W.prompt),G.el,...slots,notes,rd.el,h("div",{class:"lab-controls"},again),s);upd();return b;}

/* ---------- pick: one option, and what it gets right ---------- */
// The picture: each check a lane that fills as the chosen option plays out, one after another, and the score it reaches.
function pick(Lb){const W=Lb.w;let cur=null;const b=box(Lb),s=say(),list=h("ul",{class:"lc-list sr"}),stats=h("div",{class:"lc-stats"});
  const tried=new Set(),G=goals(Lb,[["one",U.gPickOne],["two",U.gPickTwo],["all",U.gPickAll]],s),rd=readouts([[U.rPassed],[U.rTried]]);
  const val=r=>r===1||r===true?1:r===0.5?0.5:0,cls=v=>v===1?"ok":v===0.5?"warn":"no";
  const score=h("b",null,"–"),lanes=W.checks.map(t=>{const f=h("i");return{f,el:h("div",{class:"lc-lane"},h("span",null,t),h("p",{class:"lc-track"},f))};});
  const head=h("p",{class:"lc-run"},h("span",null,W.label||""),h("em",null,"–"),score);
  function upd(){if(cur==null){s.replaceChildren(...rich(W.sayStart||U.pickStart));rd.set("–",fill("0 / {of}",{of:W.opts.length}));return;}
    const r=W.res[cur],vs=W.checks.map((t,i)=>val(r[i])),pts=vs.reduce((a,v)=>a+v,0),o=W.opts.find(x=>String(x[0])===String(cur));
    head.querySelector("em").textContent=o?o[1]:"";
    lanes.forEach((l,i)=>{l.el.className="lc-lane "+cls(vs[i]);l.f.style.transitionDelay=RM()?"0s":(i*0.16)+"s";l.f.style.width="0";});
    void head.offsetWidth;lanes.forEach((l,i)=>{l.f.style.width=(vs[i]===1?100:vs[i]===0.5?55:8)+"%";});
    tally(score,pts,v=>(Math.round(v*2)/2)+" / "+W.checks.length);
    list.replaceChildren(...W.checks.map((t,i)=>h("li",{class:cls(vs[i])},t)));
    stats.replaceChildren(...(W.stats&&W.stats[cur]?W.stats[cur].map(([n,t])=>h("p",null,h("b",null,n),h("span",null,t))):[]));
    [...stats.children].forEach((p,i)=>anim(p,[{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"none"}],{delay:200+i*120,fill:"backwards"}));
    s.replaceChildren(...rich(W.say[cur]));tried.add(String(cur));
    rd.set(fill("{n} / {of}",{n:Math.round(pts*2)/2,of:W.checks.length}),fill("{n} / {of}",{n:tried.size,of:W.opts.length}));
    G.reach("one");if(tried.size>1)G.reach("two");if(tried.size===W.opts.length)G.reach("all");}
  b.append(pic(head,h("div",{class:"lc-lanes"},...lanes.map(l=>l.el))),info(W.prompt),G.el,h("div",{class:"lab-controls"},W.label?h("span",{class:"lbl"},W.label):null,seg(W.opts,cur,k=>{cur=k;upd();},W.label||W.prompt)),stats,list,rd.el,s);upd();return b;}

/* ---------- sort: every item in its bucket ---------- */
// The picture: a box for each bucket, and a card for each item that flies into the box it's put in; Check marks each card right or not.
function sort(Lb){const W=Lb.w,b=box(Lb),s=say(),pk={};let checked=false,checks=0;const N=W.items.length;
  const rows=h("div",{class:"lc-rows"}),bname=k=>(W.buckets.find(x=>x[0]===k)||[,""])[1];
  const G=goals(Lb,[["all",U.gSortAll],["check",U.gSortCheck],["right",U.gSortRight]],s),rd=readouts([[U.rPlaced],[U.rRight],[U.rChecks]]);
  const deck=h("div",{class:"lc-deck"}),bins={},stage=h("div",{class:"lc-bins"});
  W.buckets.forEach(([k,t,c,sub],i)=>{const cnt=h("b",null,"0"),drop=h("div",{class:"lc-drop"});bins[k]={drop,cnt};
    stage.append(h("div",{class:"lc-bin",style:"--bc:"+(c||PAL[i%PAL.length])},h("p",{class:"lc-bh"},h("span",null,t),cnt),sub?h("p",{class:"lc-bsub"},sub):null,drop));});
  const toks=W.items.map((it,i)=>h("span",{class:"lc-tok"},h("i",null,String(i+1)),h("span",null,it.s||short(it.t))));toks.forEach(t=>deck.append(t));
  const go=h("button",{type:"button",class:"chip-btn go",onclick:()=>{checked=true;checks++;mark();upd();
    toks.forEach((t,i)=>{if(pk[i]!==W.items[i].b)anim(t,[{transform:"translateX(0)"},{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}],{duration:360,delay:i*40,easing:"ease-in-out"});});}},U.check);
  const again=h("button",{type:"button",class:"chip-btn sm",onclick:()=>{for(const k in pk)delete pk[k];checked=false;
    rs.forEach(r=>r.sg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false")));toks.forEach(t=>glide(t,deck));mark();upd();}},U.again);
  const rs=W.items.map((it,i)=>{const why=h("div",{class:"lc-whyhost"}),sg=seg(W.buckets.map(x=>[x[0],x[1]]),pk[i],k=>{pk[i]=k;glide(toks[i],bins[k].drop);
      if(checked){checked=false;mark();}upd(fill(U.put,{s:it.s||short(it.t),b:bname(k)})+" ");},it.t);
    const el=h("div",{class:"lc-row"},h("p",{class:"lc-item"},h("span",{class:"lc-n","aria-hidden":"true"},String(i+1)),it.t),sg,why);rows.append(el);return{el,sg,why};});
  function mark(){W.items.forEach((it,i)=>{const ok=checked&&pk[i]===it.b,no=checked&&pk[i]!==it.b;rs[i].el.className="lc-row"+(ok?" ok":no?" no":"");
    toks[i].className="lc-tok"+(ok?" ok":no?" no":"");
    rs[i].why.replaceChildren(...(checked?[h("p",{class:"lc-why"},h("b",null,ok?U.right:U.wrong+" "+fill(U.belongs,{b:bname(it.b)}))," ",no&&it.no&&it.no[pk[i]]?it.no[pk[i]]+" ":"",it.why)]:[]));});}
  function upd(pre){const n=Object.keys(pk).length,right=W.items.filter((it,i)=>pk[i]===it.b).length;go.disabled=n<N;
    for(const k in bins)bins[k].cnt.textContent=String(Object.values(pk).filter(v=>v===k).length);
    deck.parentNode&&deck.parentNode.classList.toggle("empty",n===N);
    rd.set(fill("{n} / {of}",{n,of:N}),checked?fill("{n} / {of}",{n:right,of:N}):"–",String(checks));
    s.replaceChildren(...rich((pre||"")+(checked?fill(right===N?W.sayAll:W.saySome,{n:right,of:N}):(n<N?fill(U.placed,{n,of:N}):U.ready))));
    if(n===N)G.reach("all");if(checked)G.reach("check");if(checked&&right===N)G.reach("right");}
  mark();b.append(pic(h("div",{class:"lc-deckrow"},h("span",{class:"lc-dl"},U.toPlace),deck),stage),info(W.prompt),G.el,rows,rd.el,h("div",{class:"lab-controls"},go,again),s);upd();return b;}

/* ---------- steps: a sequence, one step at a time ---------- */
// The picture: the path, a stop for each step, and a token that walks it; Play it through walks it on its own.
function steps(Lb){const W=Lb.w,N=W.steps.length;let cur=0,timer=null,went=false;const b=box(Lb),s=say(),ol=h("ol",{class:"lc-steps"});
  const G=goals(Lb,[["end",U.gStepsEnd],["back",U.gStepsBack],["play",U.gStepsPlay]],s),rd=readouts([[U.rStep]]);
  const fillLine=h("i",{class:"lc-fill"}),tok=h("b",{class:"lc-walker"}),stops=W.steps.map((st,i)=>h("span",{class:"lc-stop",style:"--x:"+(N>1?100*i/(N-1):50)+"%"},h("i",null,String(i+1)),h("small",null,st.s||short(st.t,24))));
  const path=h("div",{class:"lc-path"+(N>5?" many":""),style:"--n:"+N},h("i",{class:"lc-line"}),fillLine,...stops,tok);
  const stopPlay=()=>{if(timer){clearInterval(timer);timer=null;play.textContent="▶ "+U.play;play.setAttribute("aria-pressed","false");}};
  const prev=h("button",{type:"button",class:"chip-btn",onclick:()=>{stopPlay();if(cur>0){cur--;upd();G.reach("back");}}},"← "+U.back),next=h("button",{type:"button",class:"chip-btn go",onclick:()=>{stopPlay();if(cur<N-1){cur++;went=true;upd();}}},U.nextStep+" →");
  const play=h("button",{type:"button",class:"chip-btn","aria-pressed":"false",onclick:()=>{if(timer){stopPlay();return;}cur=0;upd();play.textContent="■ "+U.stop;play.setAttribute("aria-pressed","true");
    timer=setInterval(()=>{if(cur<N-1){cur++;upd();if(cur===N-1){stopPlay();G.reach("play");}}else stopPlay();},RM()?1600:2600);}},"▶ "+U.play);
  function upd(){const x=N>1?100*cur/(N-1):50;tok.style.left=x+"%";fillLine.style.width=x+"%";
    stops.forEach((p,i)=>{p.className="lc-stop"+(i<cur?" done":i===cur?" on":"");});
    ol.replaceChildren(...W.steps.map((st,i)=>h("li",{class:i<cur?"done":i===cur?"on":"",...(i===cur?{"aria-current":"step"}:{})},h("b",null,st.t),i===cur?h("span",null,st.d):null)));
    const on=ol.querySelector("li.on span");if(on)anim(on,[{opacity:0,transform:"translateY(6px)"},{opacity:1,transform:"none"}],{duration:380,easing:"ease-out"});
    prev.disabled=cur===0;next.disabled=cur===N-1;rd.set(fill("{n} / {of}",{n:cur+1,of:N}));
    s.replaceChildren(...rich(cur===N-1?W.sayEnd:fill(U.stepOf,{n:cur+1,of:N})));if(cur===N-1&&went&&!timer)G.reach("end");}
  b.append(pic(path),info(W.prompt),G.el,ol,rd.el,h("div",{class:"lab-controls"},prev,next,play),s);upd();return b;}

window.LD_CLASSIC={kinds:{count,compose,pick,sort,steps},ui:U};
})();
