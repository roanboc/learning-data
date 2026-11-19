/* Learning Data: Data as software (its engine copied from Data that moves, the pilot). The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine:
   the series' labs page and scenarios page load a film's bundle (for its parts: glass, T, withA, rr, tw), the words (learn.en.js or
   learn.es.js, which set window.DM), and this file.
   Every lab is a playground (kind "play"), one for each film, as the author set on 18 November 2026: the visitor switches, picks and
   presses, and watches what happens; each playground has three to five experiments (w.goals), each ticked when the visitor makes it
   happen, and its end once all are ticked. Each playground's own rules are in PLAY below, its words in the pack.
   The scenarios are the series' evaluation, every one a choice, its options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its words stay
   big enough to read on a phone. Things move and settle, or jump to where they end when the visitor asks for reduced motion, and every
   change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films), both from
   site-tools/build_series.py. Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments)
   and "quiz" (answers by scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.DM,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-data-as-software";
let FILMS={};try{FILMS=JSON.parse(app.dataset.films||"{}");}catch(e){}
const get=(k,d)=>{try{const v=localStorage.getItem(P+":"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const put=(k,v)=>{try{localStorage.setItem(P+":"+k,JSON.stringify(v));}catch(e){}
  try{window.dispatchEvent(new StorageEvent("storage",{key:P+":"+k}));}catch(e){}};
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(v==null||v===false)continue;if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?"":v);}
  kids.flat().forEach(c=>{if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));});return e;}
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
// words carry <b>…</b>: made into elements, never read as HTML
const rich=s=>String(s).split(/(<b>.*?<\/b>)/).filter(Boolean).map(x=>/^<b>/.test(x)?h("b",null,x.slice(3,-4)):x);
const RM=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}};
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).length||4,filmN=n=>fill(U.filmN,{n,of:NF});

/* ---------- drawing, with the films' parts ---------- */
const DRAW=typeof glass==="function"&&typeof T==="function"&&typeof withA==="function"&&typeof rr==="function"&&typeof tw==="function";
const TP=Math.PI*2,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lp=(a,b,t)=>a+(b-a)*t;
const eo=u=>1-Math.pow(1-cl(u,0,1),3),ei=u=>{u=cl(u,0,1);return u<0.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;};
const rgb=s=>{const n=parseInt(String(s).slice(1),16);return[n>>16&255,n>>8&255,n&255];};
// the films' colours: ink, soft ink, right, wrong, gold, and the systems' own (HR pink, Finance yellow, the platform's blue, bronze)
const K={ink:[236,243,255],soft:[160,178,205],good:[120,240,170],bad:[255,112,100],gold:[255,209,102],hr:[255,150,200],fin:[255,226,122],
  plat:[120,200,255],bronze:[232,162,107],hot:[90,220,255],warm:[255,176,64],cold:[160,178,255],arch:[150,222,196]};
const rgbaS=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")",mixC=(a,b,t)=>[lp(a[0],b[0],t),lp(a[1],b[1],t),lp(a[2],b[2],t)];
const TW=(ctx,s,z,wt)=>tw(ctx,String(s),z,wt||700);
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/data-that-moves.js)
const MISS=window.DM_MISS=new Set();
// one line that fits a width: smaller, down to 12, then cut short
function fit1(ctx,s,w,z,wt){s=String(s);let k=z;while(k>12&&TW(ctx,s,k,wt)>w)k-=0.5;if(TW(ctx,s,k,wt)<=w)return[s,k];MISS.add(s);let t=s;while(t.length>2&&TW(ctx,t+"…",k,wt)>w)t=t.slice(0,-1);return[t+"…",k];}
// lines that fit a width, at most max of them, a little smaller if need be (down to 12); remembered, since pictures repaint as they move
const FIT=new Map();
function wrap(ctx,s,w,z,wt){const out=[];let cur="";String(s).split(" ").forEach(wd=>{const t=cur?cur+" "+wd:wd;if(cur&&TW(ctx,t,z,wt)>w){out.push(cur);cur=wd;}else cur=t;});if(cur)out.push(cur);return out;}
function fitL(ctx,s,w,z,max,wt){s=String(s);const key=s+"|"+Math.round(w)+"|"+z+"|"+max+"|"+(wt||700);if(FIT.has(key)){const c=FIT.get(key);if(c.miss)MISS.add(s);return c;}
  let r=null;for(let k=z;k>=12-0.01&&!r;k-=0.5){const ls=wrap(ctx,s,w,k,wt);if(ls.length<=max&&ls.every(l=>TW(ctx,l,k,wt)<=w+0.5))r=[ls,k];}
  if(!r){r=[wrap(ctx,s,w,12,wt).slice(0,max),12];r.miss=1;MISS.add(s);}if(FIT.size>4000)FIT.clear();FIT.set(key,r);return r;}
function line1(ctx,s,x,y,w,z,o){o=o||{};const[t,k]=fit1(ctx,s,w,z,o.w);T(ctx,t,o.align==="center"?x+w/2:o.align==="right"?x+w:x,y,{w:o.w||700,size:k,align:o.align,color:o.color||rgbaS(K.ink,0.95)});}
function lines(ctx,s,x,y,w,o){o=o||{};const[ls,z]=fitL(ctx,s,w,o.size||13,o.max||2,o.w),lh=z*1.22;ls.forEach((l,i)=>T(ctx,l,o.align==="center"?x+w/2:x,y+i*lh,{w:o.w||700,size:z,align:o.align,color:o.color||rgbaS(K.ink,0.95)}));return ls.length*lh;}
// a box of glass in a colour, its title at the top left
function card(ctx,x,y,w,hh,col,title,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,hh,o.r||12,col,{glow:o.glow==null?10:o.glow,ea:0.85,fill:"rgba(7,12,24,0.92)"});
  ctx.fillStyle=rgbaS(col,o.tint==null?0.08:o.tint);rr(ctx,x,y,w,hh,o.r||12);ctx.fill();
  if(o.dash){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgbaS(col,0.85);ctx.lineWidth=1.5;rr(ctx,x+3,y+3,w-6,hh-6,(o.r||12)-2);ctx.stroke();ctx.restore();}
  if(title)line1(ctx,title,x+12,y+21,w-24-(o.right||0),o.size||14,{w:800,color:rgbaS(mixC(col,K.ink,0.3),1)});});}
// a chip: a short label on glass, centred (o.mark puts a tick or a cross on its corner, o.strike crosses it out)
function chip(ctx,x,y,w,hh,label,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,hh,o.r==null?8:o.r,col,{glow:o.glow==null?6:o.glow,ea:0.85,fill:o.fill||"rgba(7,12,24,0.94)"});
  ctx.fillStyle=rgbaS(col,o.tint==null?0.14:o.tint);rr(ctx,x,y,w,hh,o.r==null?8:o.r);ctx.fill();
  const[t,k]=fit1(ctx,label,w-12,o.size||13,700);T(ctx,t,x+w/2,y+hh/2+k*0.36,{w:700,size:k,align:"center",color:o.color||rgbaS(K.ink,0.96)});
  if(o.strike){ctx.save();ctx.strokeStyle=rgbaS(K.bad,1);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+5,y+hh/2+2);ctx.lineTo(x+w-5,y+hh/2-2);ctx.stroke();ctx.restore();}
  if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
function mark(ctx,x,y,k){const c=k==="ok"?K.good:K.bad;ctx.save();ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(x,y,8,0,TP);ctx.fill();ctx.strokeStyle=rgbaS(c,1);ctx.lineWidth=1.6;ctx.stroke();
  ctx.lineWidth=2.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();if(k==="ok"){ctx.moveTo(x-3.4,y+0.2);ctx.lineTo(x-0.9,y+2.8);ctx.lineTo(x+3.6,y-2.8);}else{ctx.moveTo(x-2.8,y-2.8);ctx.lineTo(x+2.8,y+2.8);ctx.moveTo(x+2.8,y-2.8);ctx.lineTo(x-2.8,y+2.8);}ctx.stroke();ctx.restore();}
function pill(ctx,x,y,s,col,o){o=o||{};const z=o.size||12.5,w=Math.min(o.max||1e4,TW(ctx,s,z)+18),hh=z+11,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  glass(ctx,X,y,w,hh,hh/2,col,{fill:"rgba(7,12,24,0.92)",glow:6,ea:0.85});line1(ctx,s,X+9,y+hh/2+z*0.36,w-18,z,{w:700,color:rgbaS(col,1)});return w;}
function arrow(ctx,x0,y0,x1,y1,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.fillStyle=rgbaS(col,1);ctx.lineWidth=o.lw||2;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.setLineDash([]);const an=Math.atan2(y1-y0,x1-x0),hz=o.head||8;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-hz*Math.cos(an-0.45),y1-hz*Math.sin(an-0.45));ctx.lineTo(x1-hz*Math.cos(an+0.45),y1-hz*Math.sin(an+0.45));ctx.closePath();ctx.fill();ctx.restore();});}
// a piece of data on its way: a small tile in a colour, with a label
function tile(ctx,x,y,w,hh,s,col,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.shadowColor=rgbaS(col,0.7);ctx.shadowBlur=10;ctx.fillStyle="rgba(10,16,32,0.96)";rr(ctx,x,y,w,hh,6);ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle=rgbaS(o.edge||col,1);ctx.lineWidth=o.edge?2.2:1.4;rr(ctx,x,y,w,hh,6);ctx.stroke();ctx.fillStyle=rgbaS(col,0.18);rr(ctx,x,y,w,hh,6);ctx.fill();ctx.restore();
  if(s){const[t,k]=fit1(ctx,s,w-8,o.size||12.5,700);T(ctx,t,x+w/2,y+hh/2+k*0.36,{w:700,size:k,align:"center",color:rgbaS(K.ink,0.96)});}
  if(o.strike){ctx.save();ctx.strokeStyle=rgbaS(K.soft,1);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+4,y+hh/2+1);ctx.lineTo(x+w-4,y+hh/2-1);ctx.stroke();ctx.restore();}
  if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
function ground(ctx,w,hh,col){const g=ctx.createRadialGradient(w*0.5,-hh*0.2,10,w*0.5,hh*0.3,Math.max(w,hh));g.addColorStop(0,rgbaS(col,0.16));g.addColorStop(1,rgbaS(col,0));ctx.fillStyle=g;ctx.fillRect(0,0,w,hh);}
const since=(now,t0)=>t0==null?-1:RM()?1e9:now-t0;
// chips in rows across a width, each as wide as its label: where each goes, and the height
function flow(ctx,labels,w,z,gap,hh){const out=[];let x=0,y=0;labels.forEach(s=>{const cw=Math.min(w,Math.ceil(TW(ctx,s,z))+20);if(x>0&&x+cw>w){x=0;y+=hh+gap;}out.push({x,y,w:cw,h:hh});x+=cw+gap;});return{pos:out,h:labels.length?y+hh:0};}

// A picture: a canvas laid out for its width on the page. lay(lw, ctx) gives the layout for a width (lw, its CSS width, from 320 to
// 640) with its height in .h; draw(ctx, layout, now) paints it. kick(ms) keeps it moving for that long; nothing runs after. It paints
// as soon as it has a width, and never waits for the film's player.
function stage(lay,draw,label){const cv=h("canvas",{role:"img","aria-label":label||""}),st={el:cv,lw:0,lo:null,v:0,until:0,raf:0};
  const M=document.createElement("canvas").getContext("2d");let key="";
  function paint(){const cw=cv.clientWidth||(cv.parentNode&&cv.parentNode.clientWidth)||0;if(!cw)return;const lw=Math.round(cl(cw,320,640)),k2=lw+"/"+st.v;
    if(k2!==key){st.lo=lay(lw,M);key=k2;st.lw=lw;cv.style.aspectRatio=lw+"/"+Math.round(st.lo.h);}
    const d=Math.min(window.devicePixelRatio||1,2),bw=Math.round(cw*d),bh=Math.round(cw*d*st.lo.h/lw);if(cv.width!==bw||cv.height!==bh){cv.width=bw;cv.height=bh;}
    const ctx=cv.getContext("2d"),k=cv.width/lw;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(k,0,0,k,0,0);
    ctx.fillStyle="#070b16";ctx.fillRect(0,0,lw,st.lo.h);try{draw(ctx,st.lo,performance.now());}catch(e){console.error(e);}}
  function loop(){st.raf=0;paint();if(performance.now()<st.until)st.raf=requestAnimationFrame(loop);}
  st.kick=ms=>{st.until=Math.max(st.until,performance.now()+(RM()?0:ms||0)+40);if(!st.raf)st.raf=requestAnimationFrame(loop);};
  st.paint=()=>st.kick(0);st.relayout=()=>{st.v++;st.kick(0);};
  if("ResizeObserver" in window)new ResizeObserver(()=>st.paint()).observe(cv);
  requestAnimationFrame(()=>st.paint());if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>st.relayout());
  STG.set(cv,st);return st;}
// a web font that comes after a picture was laid out leaves every fit measured with the fallback font: forget them, and lay out again
const STG=new WeakMap();
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener("loadingdone",()=>{FIT.clear();MISS.clear();
  document.querySelectorAll("canvas").forEach(c=>{const s=STG.get(c);if(s)s.relayout();});});

/* ---------- the parts of a lab's page ---------- */
const info=t=>h("p",{class:"lab-info"},t);
function focusIn(el){if(!el)return;try{el.focus({preventScroll:true});}catch(e){el.focus();}const r=el.getBoundingClientRect();if(r.bottom>innerHeight-8||r.top<120)el.scrollIntoView({block:"center",behavior:RM()?"auto":"smooth"});}

/* ---------- play: a playground with experiments ---------- */
// PLAY[id](Lb, api) gives the playground: its state (S), its controls (built with api.seg, api.toggle and api.btn), its readouts
// ([[label, () => value]]), and its picture (lay, draw). api.say(text, tone) says what just happened; api.reach(key) ticks an
// experiment; api.kick(ms) keeps the picture moving. Start again puts everything back as it was, the ticks included.
const PLAY={};
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab dm-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls dm-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"dm-goals","aria-label":U.goals}),end=h("div",{class:"dm-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"dm-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"dm-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm dm-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"dm-goalbox"},h("p",{class:"dm-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"dm-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}


/* ---------- 1 · Scripts became software: a change, and the steps it goes through ---------- */
// Jun's change to the noon rule carries a bug: a claim approved at 11:59 on the Monday would wait two weeks. Where the export is
// kept (one laptop, or Git), whether the rule's edge is tested, who reviews and how it's released decide which steps the change goes
// through, and where, if anywhere, the bug is caught. Each step takes its turn; the bug reaches production if nothing catches it.
PLAY.ship=(Lb,api)=>{const W=Lb.w,R=W.res,S={home:"laptop",tests:false,review:"self",rel:"hand",run:null,steps:null,out:null};
  const STEP=750,KEYS=["home","checks","review","test","prod"];
  const r1=api.group(W.homeL);api.seg(r1,W.homes,"laptop",k=>{S.home=k;api.say(W.msg[k]);api.kick(300);},W.homeL);
  const r2=api.group(W.checksL);api.toggle(r2,W.testsT,false,v=>{S.tests=v;api.say(v?W.msg.testsOn:W.msg.testsOff);api.kick(300);});
  const r3=api.group(W.reviewL);api.seg(r3,W.reviews,"self",k=>{S.review=k;api.say(W.msg[k]);api.kick(300);},W.reviewL);
  const r4=api.group(W.relL);api.seg(r4,W.rels,"hand",k=>{S.rel=k;api.say(W.msg[k]);api.kick(300);},W.relL);
  // what each step finds, worked out when the change is shipped: [result, tone] for each step, and where the bug was caught
  function plan(){const git=S.home==="git";let bug=true,at=null;const st={};
    st.home=git?[R.branch,"ok"]:[R.laptop,"warn"];
    if(!git){st.checks=[R.skip,"skip"];st.review=[R.skip,"skip"];st.test=[R.skip,"skip"];}
    else{if(S.tests){st.checks=[R.caught,"caught"];bug=false;at="checks";}else st.checks=[R.passed,"warn"];
      st.review=S.review==="other"?[R.other,"ok"]:[R.self,"warn"];
      if(S.rel==="bundle"){if(bug){st.test=[R.rohanCaught,"caught"];bug=false;at="test";}else st.test=[R.rohanOk,"ok"];}else st.test=[R.noRun,"skip"];}
    st.prod=git&&S.rel==="bundle"?[R.bundle,"ok"]:[R.hand,"warn"];
    return{st,bug,at,git,other:git&&S.review==="other",bundle:git&&S.rel==="bundle"};}
  const r5=api.group();
  api.btn(r5,W.shipB,()=>{const now=performance.now(),p=plan();S.run=now;S.steps=p;S.out=null;api.kick(STEP*6+600);api.say(W.msg.ship);
    setTimeout(()=>{if(S.run!==now)return;S.out=p;api.say(p.bug?W.msg.endLate:p.at==="checks"?W.msg.endEdge:W.msg.endRohan,p.bug?"no":"ok");
      if(p.at==="checks")api.reach("edge");if(p.other)api.reach("other");if(p.bundle)api.reach("rohan");api.refresh();},RM()?0:STEP*5+200);},"go");
  api.btn(r5,W.traceB,()=>{if(S.home==="git"){api.say(W.msg.traceGit,"ok");api.reach("trace");}else api.say(W.msg.traceLaptop,"no");});
  const lay=(lw)=>{const m=12,o={lw,m,rows:[]};let y=12;KEYS.forEach(k=>{o.rows.push({k,y,h:58});y+=64;});o.end={y:y+2,h:40};o.h=o.end.y+o.end.h+12;return o;};
  const TONE={ok:K.good,warn:K.gold,caught:K.bad,skip:K.soft};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const run=S.run!=null,p=S.steps,el=run?since(now,S.run):-1,git=(run?p.git:S.home==="git");
    o.rows.forEach((r,i)=>{const lit=run&&el>=i*STEP+STEP*0.6,res=lit?p.st[r.k]:null,col=res?TONE[res[1]]:K.plat,skip=!run&&!git&&i>0&&i<4;
      card(ctx,o.m,r.y,o.lw-o.m*2,r.h,col,"",{glow:lit?10:4,a:skip?0.5:1,dash:res&&res[1]==="skip"});
      T(ctx,String(i+1),o.m+20,r.y+r.h/2+5,{w:800,size:14,align:"center",color:rgbaS(col,1)});
      line1(ctx,i===0&&!git?W.homes[0][1]:W.stages[r.k],o.m+38,r.y+22,o.lw-o.m*2-50,14,{w:800,color:rgbaS(K.ink,0.95)});
      if(res)line1(ctx,res[0],o.m+38,r.y+43,o.lw-o.m*2-50,12.5,{w:600,color:rgbaS(col,1)});
      else line1(ctx,"–",o.m+38,r.y+43,40,12.5,{w:600,color:rgbaS(K.soft,0.7)});});
    // the change, moving down the steps; red while it still carries the bug
    if(run){const k=cl(el/STEP,0,5),i=Math.min(4,Math.floor(k)),f=ei(k-Math.floor(k)),y0=o.rows[i].y,y1=o.rows[Math.min(4,i+1)].y,y=k>=5?o.rows[4].y:lp(y0,y1,f);
      const at=p.at?KEYS.indexOf(p.at):9,bad=k<at+0.6,tw2=Math.min(110,(o.lw-o.m*2)*0.3);
      tile(ctx,o.lw-o.m-tw2-10,y+o.rows[0].h/2-11,tw2,22,W.change,bad?K.bad:K.good,{size:12,mark:bad?"no":"ok"});
      if(el<STEP*6)api.kick(80);}
    const E=o.end;if(S.out){const late=S.out.bug;chip(ctx,o.m,E.y,o.lw-o.m*2,E.h,late?R.late:R.fine,late?K.bad:K.good,{size:13.5,glow:12});}};
  return{S,lay,draw,readouts:[[W.read.runs,()=>S.out==null?"–":S.out.bundle?W.read.platform:W.read.person],
    [W.read.caught,()=>S.out==null?"–":S.out.at?W.stages[S.out.at]:W.read.never],[W.read.late,()=>S.out==null?"–":S.out.bug?"38":"0"]]};};

/* ---------- 2 · A platform that watches itself: Monday night ---------- */
// From 15:02 the claims app sends 1:30. Whether the contract changed first, whether an agent watches overnight, whether the platform
// keeps lineage and owners, and who approves the fix decide what happens that night, line by line, and when payroll has the hours.
PLAY.watch=(Lb,api)=>{const W=Lb.w,E=W.ev,S={contract:false,watch:"off",line:false,appr:"sam",run:null,evs:null,out:null,touch:null};
  const STEP=520;
  const r1=api.group(W.contractL);api.toggle(r1,W.contractT,false,v=>{S.contract=v;api.say(v?W.msg.contractOn:W.msg.contractOff);});
  const r2=api.group(W.watchL);api.seg(r2,W.watches,"off",k=>{S.watch=k;api.say(W.msg[k]);},W.watchL);
  api.toggle(r2,W.lineT,false,v=>{S.line=v;api.say(v?W.msg.lineOn:W.msg.lineOff);});
  const r3=api.group(W.apprL);api.seg(r3,W.apprs,"sam",k=>{S.appr=k;api.say(W.msg[k]);},W.apprL);
  // the night's lines: [time, words, tone], and how it ends
  function night(){if(S.contract)return{evs:[["15:02",E.c1502,"ok"],["22:00",E.c2200,"ok"],["22:41",E.c2241,"ok"]],end:"contract",reach:"22:41"};
    const ev=[["15:02",E.a1502,"warn"],["22:03",E.f2203,"no"],["22:03",E.safe,"soft"]];
    if(S.watch==="on"&&S.line){ev.push(["22:03",E.w2203,"ok"],["22:10",E.w2210,"ok"],["22:15",E.w2215,"ok"],["08:30",E.m0830,"ok"],["08:52",E.m0852,"ok"]);
      if(S.appr==="noor"){ev.push(["09:05",E.n0905,"ok"],["09:20",E.r0920,"ok"],["10:00",E.r1000,"ok"]);return{evs:ev,end:"ten",reach:"10:00",found:true};}
      ev.push(["08:55",E.self,"warn"],["09:40",E.n0940,"ok"],["10:30",E.r1030,"ok"]);return{evs:ev,end:"slow",reach:"10:30",found:true};}
    if(S.watch==="on")ev.push(["22:03",E.w2203,"ok"],["22:03",E.nol,"warn"]);
    ev.push(["08:30",E.s0830,"warn"],["11:40",E.s1140,"warn"],["12:10",E.s1210,"warn"],["12:40",E.late,"no"]);return{evs:ev,end:"late",reach:"12:40"};}
  const r4=api.group();
  api.btn(r4,W.runB,()=>{const now=performance.now(),n=night();S.run=now;S.evs=n;S.out=null;S.touch=null;api.kick(STEP*(n.evs.length+1)+600);api.say(W.msg.running);
    setTimeout(()=>{if(S.run!==now)return;S.out=n;const e=n.end;api.say(e==="contract"?W.msg.endContract:e==="ten"?W.msg.endTen:e==="slow"?W.msg.endSlow:W.msg.endLate,e==="late"?"no":"ok");
      if(n.found)api.reach("found");if(e==="ten")api.reach("ten");if(e==="contract")api.reach("contract");api.refresh();},RM()?0:STEP*n.evs.length+200);},"go");
  api.btn(r4,W.touchB,()=>{if(S.line){S.touch=performance.now();api.kick(1200);api.say(W.msg.touchYes,"ok");api.reach("touch");}else{S.touch=null;api.say(W.msg.touchNo,"no");api.kick(200);}});
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.top={y:12,h:62};const f=flow(ctx,W.touches,lw-m*2,12,6,26);o.tpos=f.pos;o.touch={y:o.top.y+o.top.h+6,h:f.h+4};o.ev0=o.touch.y+o.touch.h+8;o.eh=44;o.h=o.ev0+11*o.eh+8;return o;};
  const TONE={ok:K.good,warn:K.gold,no:K.bad,soft:K.soft};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const run=S.run!=null,el=run?since(now,S.run):-1,n=run?S.evs.evs:[],shown=run?Math.min(n.length,Math.floor(el/STEP)+1):0;
    const failed=run&&!S.evs.end.startsWith("contract")&&shown>=2,done=S.out!=null,jobOk=done&&S.out.end!=="late"||run&&S.evs.end==="contract"&&shown>=2;
    // the three systems
    const gap=18,w=(o.lw-o.m*2-gap*2)/3,T0=o.top;[[W.app,K.hr],[W.job,failed&&!jobOk?K.bad:jobOk?K.good:K.plat],[W.pay,done?(S.out.end==="late"?K.bad:K.good):K.fin]].forEach(([s,c],i)=>{
      chip(ctx,o.m+i*(w+gap),T0.y+8,w,40,s,c,{size:13,glow:8});if(i<2)arrow(ctx,o.m+i*(w+gap)+w+2,T0.y+28,o.m+(i+1)*(w+gap)-2,T0.y+28,K.soft,0.8,{head:5});});
    // what the failure touches, once asked, with lineage
    if(S.touch!=null){const t=cl(since(now,S.touch)/600,0,1);W.touches.forEach((s,i)=>{const p=o.tpos[i];chip(ctx,o.m+p.x,o.touch.y+p.y,p.w,p.h,s,K.gold,{size:12,a:eo(t-i*0.2)});});}
    // the night, line by line
    for(let i=0;i<shown;i++){const[tm,s,tone]=n[i],y=o.ev0+i*o.eh,col=TONE[tone],a=RM()?1:eo((el-i*STEP)/300);
      withA(ctx,a,()=>{pill(ctx,o.m,y+4,tm,col,{size:12});lines(ctx,s,o.m+64,y+16,o.lw-o.m*2-66,{size:12.5,max:2,w:600,color:rgbaS(tone==="soft"?K.soft:K.ink,0.95)});});}
    if(run&&shown<n.length)api.kick(80);};
  return{S,lay,draw,readouts:[[W.read.reach,()=>S.out==null?"–":S.out.reach],[W.read.pay,()=>S.out==null?"–":S.out.end==="late"?W.read.late:W.read.onTime],
    [W.read.prod,()=>S.out==null?"–":W.read.nothing]]};};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"dm-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","dm-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"dm-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"dm-tab-"+Lb.id,"aria-controls":"dm-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
  // the rail is one stop for the keyboard: arrows move along it, Home and End go to its ends
  rail.addEventListener("keydown",e=>{const bs=[...rail.children],k=bs.indexOf(document.activeElement);if(k<0)return;let j=null;
    if(e.key==="ArrowRight"||e.key==="ArrowDown")j=(k+1)%bs.length;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")j=(k-1+bs.length)%bs.length;else if(e.key==="Home")j=0;else if(e.key==="End")j=bs.length-1;
    if(j==null)return;e.preventDefault();bs[j].focus();show(bs[j].dataset.id);});
  app.append(rail,panel);show((location.hash||"").slice(1));
  window.addEventListener("hashchange",()=>{const id=(location.hash||"").slice(1);if(L.labs.some(x=>x.id===id))show(id,true);});}

/* ---------- the scenarios page: the series' evaluation ---------- */
// The situations from every film; each answer explains why and points back to its playground. Answers are kept by the scenario's
// number (film × 10 + its place), so a new situation never takes over an old answer.
const VIS={};
if(app.id==="series-quiz"){app.textContent="";const QS=L.qs,ans=get("quiz",{})||{};let cur=0;
  const films=[...new Set(QS.map(q=>q.film))].sort((a,b)=>a-b);
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),cardEl=h("div");bar.append(dots,score);
  app.append(h("div",{class:"quiz"},bar,cardEl));
  const labOf=id=>L.labs.find(x=>x.id===id)||{name:"",c:"#a0b2cd"};
  function paintBar(){dots.replaceChildren(...QS.map((q,i)=>{const a=ans[q.n];return h("button",{type:"button",class:a?(a.ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1)+(a?" · "+(a.ok?U.right:U.notQuite):""),onclick:()=>{cur=i;render(true);}},String(i+1));}));
    const n=QS.filter(q=>ans[q.n]).length,ok=QS.filter(q=>ans[q.n]&&ans[q.n].ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+n+" "+U.answered+" · "+(QS.length-n)+" "+U.toGo));}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why));
  function foot(q){const last=cur===QS.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:"../labs/#"+q.lab},U.explore+" "+labOf(q.lab).name),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results(true);else{cur+=1;render(true);}}},last?U.results:U.nextQ));}
  function render(focus){paintBar();const q=QS[cur];if(!q)return;app.dataset.film=String(q.film);const f=VIS[q.vis.k],a=ans[q.n],body=h("div",{class:"qbody"}),out=h("div"),S={done:a?performance.now()-1e5:0};
    const vis=DRAW&&f?stage(lw=>({lw,h:f.h?f.h(lw):190}),(ctx,o,now)=>f(ctx,o,now,q,S),(L.pics.alt&&L.pics.alt[q.vis.k])||q.title):null;
    const F=FILMS[q.film]||{};body.append(h("p",{class:"qtag",style:"--c:"+labOf(q.lab).c},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+QS.length+" · "+filmN(q.film)+(F.t?", "+F.t:"")),h("h3",{tabindex:"-1"},q.title),h("p",{class:"qsit"},q.sit));
    const fin=(ok,pick)=>{if(!a||a.pick!==pick){ans[q.n]={ok,pick};put("quiz",ans);paintBar();}S.done=performance.now();if(vis)vis.kick(1000);out.replaceChildren(feed(ok,q),foot(q));};
    const O=q.opts,bx=h("div",{class:"qopts"});
    O.forEach((o,j)=>{bx.append(h("button",{type:"button",class:"qopt","data-j":j,onclick:()=>pick(j)},h("span",{class:"k"},"ABCDE"[j]),h("span",null,o.t)));});
    function pick(j,quiet){[...bx.children].forEach(b=>{const k=+b.dataset.j;b.disabled=true;if(O[k].ok)b.classList.add("ok");});const o=O[j],b=bx.querySelector('[data-j="'+j+'"]');
      if(!o.ok){b.classList.add("no");if(o.why)b.append(h("small",null,o.why));}fin(!!o.ok,j);if(!quiet)focusIn(out.querySelector(".btn"));}
    body.append(bx);
    // a saved pick that no longer gives its saved result (the options moved) is asked again
    if(a&&a.pick!=null&&O[a.pick]&&!!O[a.pick].ok===!!a.ok)pick(a.pick,true);else if(a){delete ans[q.n];put("quiz",ans);paintBar();}
    body.append(out);cardEl.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis"},vis?vis.el:null),body));if(focus){const t=body.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}cardEl.scrollIntoView({block:"nearest",behavior:RM()?"auto":"smooth"});}}
  function results(focus){paintBar();const ok=QS.filter(q=>ans[q.n]&&ans[q.n].ok).length,n=QS.length,band=L.done[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};QS.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(ans[q.n]&&ans[q.n].ok)by[k].ok++;});
    cardEl.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/Math.max(1,n)*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",{tabindex:"-1"},band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:"../labs/#"+k,class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+labOf(k).c},h("i"),labOf(k).name+" · "+by[k].ok+"/"+by[k].n))),
      h("button",{type:"button",class:"btn",onclick:()=>{QS.forEach(q=>delete ans[q.n]);put("quiz",ans);cur=0;render(true);}},U.again))));
    if(focus){const t=cardEl.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}}}
  // one list of every scenario, no film level: #film-<n> opens that film's first one left, or its first; otherwise the first one left
  function setFilm(n){const one=films.includes(n),of=q=>!one||q.film===n,todo=QS.findIndex(q=>of(q)&&!ans[q.n]),first=QS.findIndex(of);
    if(one&&history.replaceState)history.replaceState(null,"",location.pathname+location.search);
    if(todo>=0){cur=todo;render(false);}else if(one&&first>=0){cur=first;render(false);}else results(false);}
  const fromHash=()=>{const m=(location.hash||"").match(/^#film-(\d+)$/);return m?+m[1]:0;};
  window.addEventListener("hashchange",()=>{const n=fromHash();if(n)setFilm(n);});Promise.resolve().then(()=>setFilm(fromHash()));}

/* ---------- the scenarios' pictures: one for each film's situations ---------- */
// Each draws the situation, not its answer; once it's answered (S.done), its key line is drawn in, in gold
const PK=L.pics,GO=(S,now)=>S.done?eo(since(now,S.done)/700):0;
// a change, and the steps it goes through
VIS.ship=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const m=12,t=GO(S,now),st=PK.ship.steps,n=st.length,w=(o.lw-m*2-(n-1)*8)/n;
  st.forEach((s,i)=>{const x=m+i*(w+8),on=t>i/n;chip(ctx,x,40,w,40,s,on?K.gold:K.plat,{size:12.5,glow:on?12:5});if(i<n-1)arrow(ctx,x+w+1,60,x+w+7,60,K.soft,0.8,{head:4});});};
VIS.ship.h=()=>120;
// the claims app, the claims job and payroll, on the night
VIS.watch=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.plat);const m=12,t=GO(S,now),gap=18,w=(o.lw-m*2-gap*2)/3;
  [[PK.watch.a,K.hr],[PK.watch.b,t>0?K.good:K.bad],[PK.watch.c,K.fin]].forEach(([s,c],i)=>{chip(ctx,m+i*(w+gap),36,w,42,s,c,{size:13,glow:8});if(i<2)arrow(ctx,m+i*(w+gap)+w+2,57,m+(i+1)*(w+gap)-2,57,t>0?K.gold:K.soft,0.9,{head:5,dash:t>=1?null:[4,4]});});
  line1(ctx,PK.watch.mid,m,112,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.watch.h=()=>134;
})();
