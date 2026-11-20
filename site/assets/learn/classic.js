/* Learning Data: the classic lab kinds, shared by every series' engine (site/assets/<dir>/learn.js) beside its playgrounds.
   A film has up to four labs (the author, 19 November 2026): its playground, and up to three more, chosen for being the most
   interactive and meaningful to people. Those come back from the films' first labs in these kinds, each described entirely by its
   words (Lb.w), as they were written then:
     count    tick what counts, watch the total, and see which definition gives it (w.items, w.targets, w.unit, w.start)
     compose  write a request, a rule or a card from parts, one choice a row, with why each part holds (w.slots, w.head)
     pick     choose one option and see what it gets right, and what it costs (w.opts, w.checks, w.res, w.say, w.stats)
     sort     put each item where it belongs, then check, with why (w.buckets, w.items)
     steps    follow a sequence one step at a time (w.steps)
   An engine takes them with BUILD=Object.assign({},window.LD_CLASSIC.kinds,{play:labPlay}). The parts use the site's shared lab
   classes (.lab, .seg, .chip-btn, .lab-controls, .lab-info, .lab-say) and classic.css; nothing waits for a film's player.
   site-tools/smoke/classic.js plays each kind through for smoke.py's series-learn check. */
(function(){"use strict";
const ES=(document.documentElement.lang||"en").slice(0,2)==="es";
const U=ES?{check:"Comprobar",again:"Empezar de nuevo",right:"Correcto.",wrong:"No del todo:",belongs:"va en «{b}».",placed:"{n} de {of} ubicados.",
  ready:"Todos ubicados: comprueba tus respuestas.",back:"Atrás",nextStep:"Siguiente paso",stepOf:"Paso {n} de {of}.",total:"Total"}
 :{check:"Check",again:"Start again",right:"Right.",wrong:"Not quite:",belongs:"it belongs in “{b}”.",placed:"{n} of {of} placed.",
  ready:"All placed: check your answers.",back:"Back",nextStep:"Next step",stepOf:"Step {n} of {of}.",total:"Total"};
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(v==null||v===false)continue;
  if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?"":v);}
  for(const c of kids.flat())if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(String(c)));return e;}
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const num=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,ES?".":",");
// words carry <b>…</b>: made into elements, never read as HTML
const rich=s=>String(s==null?"":s).split(/(<b>.*?<\/b>)/).filter(Boolean).map(x=>/^<b>/.test(x)?h("b",null,x.slice(3,-4)):x);
function seg(opts,cur,on,label){const s=h("div",{class:"seg",role:"group","aria-label":label||""});
  opts.forEach(([k,t])=>s.append(h("button",{type:"button","aria-pressed":String(String(k)===String(cur)),"data-k":k,
    onclick:()=>{s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===String(k))));on(k);}},t)));return s;}
const box=Lb=>h("div",{class:"lab lc-lab","data-kind":Lb.kind,style:"--c:"+Lb.c});
const say=()=>h("p",{class:"lab-say",role:"status"});
const info=t=>t?h("p",{class:"lab-info"},...rich(t)):null;

/* ---------- count: what counts, and the number it makes ---------- */
function count(Lb){const W=Lb.w,on=new Set(W.start||[]),b=box(Lb),s=say(),total=h("p",{class:"lc-total"}),targets=h("div",{class:"lc-targets"});
  const sum=()=>W.items.filter(it=>on.has(it.k)).reduce((a,it)=>a+it.n,0),same=(a,set)=>a.length===set.size&&a.every(k=>set.has(k));
  const bar=h("div",{class:"lc-bar","aria-hidden":"true"},h("i"));
  const toggles=h("div",{class:"lc-toggles",role:"group","aria-label":W.label||W.prompt},...W.items.map(it=>h("label",null,
    h("input",{type:"checkbox",checked:on.has(it.k)||null,onchange:e=>{e.target.checked?on.add(it.k):on.delete(it.k);upd();}}),h("span",null,it.t),h("b",null,num(it.n)))));
  const all=W.items.reduce((a,it)=>a+it.n,0)||1;
  function upd(){const n=sum(),hit=W.targets.find(tg=>same(tg.set,on));total.replaceChildren(h("span",null,W.unit||U.total),h("b",null,num(n)));
    bar.firstChild.style.width=Math.round(100*n/all)+"%";
    targets.replaceChildren(...W.targets.map(tg=>{const v=W.items.filter(it=>tg.set.includes(it.k)).reduce((a,it)=>a+it.n,0),m=same(tg.set,on);
      return h("p",{class:"lc-target"+(m?" hit":""),style:"--c:"+(tg.c||Lb.c)},h("i"),h("span",null,tg.name),h("b",null,num(v)));}));
    s.replaceChildren(...rich(hit?hit.say:W.sayNone));}
  b.append(info(W.prompt),toggles,total,bar,targets,s);upd();return b;}

/* ---------- compose: a sentence from parts ---------- */
function compose(Lb){const W=Lb.w,pick=W.slots.map(()=>null),b=box(Lb),s=say(),out=h("p",{class:"lc-sentence"}),notes=h("ul",{class:"lc-list"});
  const slots=W.slots.map((sl,i)=>h("div",{class:"lab-controls lc-slot"},h("span",{class:"lbl"},sl.label),seg(sl.opts.map((o,j)=>[String(j),o.s||o.t]),null,k=>{pick[i]=+k;upd();},sl.label)));
  const again=h("button",{type:"button",class:"chip-btn sm",onclick:()=>{pick.fill(null);slots.forEach(r=>r.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false")));upd();}},U.again);
  function upd(){out.replaceChildren(h("b",null,W.head+" "),...W.slots.map((sl,i)=>pick[i]==null?h("span",{class:"gap"},"… "):h("span",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].t+" ")));
    notes.replaceChildren(...W.slots.map((sl,i)=>pick[i]==null?null:h("li",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].why)).filter(Boolean));
    const done=pick.every(p=>p!=null),good=done&&pick.every((p,i)=>W.slots[i].opts[p].ok);out.classList.toggle("good",good);
    s.className="lab-say"+(good?" lc-good":"");s.replaceChildren(...rich(!done?W.sayStart:good?W.sayGood:W.sayFix));}
  b.append(info(W.prompt),...slots,out,notes,h("div",{class:"lab-controls"},again),s);upd();return b;}

/* ---------- pick: one option, and what it gets right ---------- */
function pick(Lb){const W=Lb.w;let cur=W.opts[0][0];const b=box(Lb),s=say(),list=h("ul",{class:"lc-list"}),stats=h("div",{class:"lc-stats"});
  function upd(){const r=W.res[cur];list.replaceChildren(...W.checks.map((t,i)=>h("li",{class:r[i]===1||r[i]===true?"ok":r[i]===0.5?"warn":"no"},t)));
    stats.replaceChildren(...(W.stats&&W.stats[cur]?W.stats[cur].map(([n,t])=>h("p",null,h("b",null,n),h("span",null,t))):[]));s.replaceChildren(...rich(W.say[cur]));}
  b.append(info(W.prompt),h("div",{class:"lab-controls"},W.label?h("span",{class:"lbl"},W.label):null,seg(W.opts,cur,k=>{cur=k;upd();},W.label||W.prompt)),stats,list,s);upd();return b;}

/* ---------- sort: every item in its bucket ---------- */
function sort(Lb){const W=Lb.w,b=box(Lb),s=say(),pk={};let checked=false;
  const rows=h("div",{class:"lc-rows"}),bname=k=>(W.buckets.find(x=>x[0]===k)||[,""])[1];
  const go=h("button",{type:"button",class:"chip-btn go",onclick:()=>{checked=true;draw();upd();}},U.check);
  const again=h("button",{type:"button",class:"chip-btn sm",onclick:()=>{for(const k in pk)delete pk[k];checked=false;draw();upd();}},U.again);
  function draw(){rows.replaceChildren(...W.items.map((it,i)=>{const ok=checked&&pk[i]===it.b,no=checked&&pk[i]!==it.b;
    return h("div",{class:"lc-row"+(ok?" ok":no?" no":"")},h("p",{class:"lc-item"},it.t),seg(W.buckets.map(x=>[x[0],x[1]]),pk[i],k=>{pk[i]=k;if(checked){checked=false;draw();}upd();},it.t),
      checked?h("p",{class:"lc-why"},h("b",null,ok?U.right:U.wrong+" "+fill(U.belongs,{b:bname(it.b)}))," ",no&&it.no&&it.no[pk[i]]?it.no[pk[i]]+" ":"",it.why):null);}));}
  function upd(){const n=Object.keys(pk).length,right=W.items.filter((it,i)=>pk[i]===it.b).length;go.disabled=n<W.items.length;
    s.replaceChildren(...rich(checked?fill(right===W.items.length?W.sayAll:W.saySome,{n:right,of:W.items.length}):(n<W.items.length?fill(U.placed,{n,of:W.items.length}):U.ready)));}
  draw();b.append(info(W.prompt),rows,h("div",{class:"lab-controls"},go,again),s);upd();return b;}

/* ---------- steps: a sequence, one step at a time ---------- */
function steps(Lb){const W=Lb.w;let cur=0;const b=box(Lb),s=say(),ol=h("ol",{class:"lc-steps"});
  const prev=h("button",{type:"button",class:"chip-btn",onclick:()=>{if(cur>0){cur--;upd();}}},"← "+U.back),next=h("button",{type:"button",class:"chip-btn go",onclick:()=>{if(cur<W.steps.length-1){cur++;upd();}}},U.nextStep+" →");
  function upd(){ol.replaceChildren(...W.steps.map((st,i)=>h("li",{class:i<cur?"done":i===cur?"on":"",...(i===cur?{"aria-current":"step"}:{})},h("b",null,st.t),i===cur?h("span",null,st.d):null)));
    prev.disabled=cur===0;next.disabled=cur===W.steps.length-1;s.replaceChildren(...rich(cur===W.steps.length-1?W.sayEnd:fill(U.stepOf,{n:cur+1,of:W.steps.length})));}
  b.append(info(W.prompt),ol,h("div",{class:"lab-controls"},prev,next),s);upd();return b;}

window.LD_CLASSIC={kinds:{count,compose,pick,sort,steps},ui:U};
})();
