/* Learning Data: When things go wrong. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine,
   copied from Data that moves' (site/assets/data-that-moves/learn.js), the standard's pilot: the series' labs page and scenarios
   page load a film's bundle (for its parts: glass, T, withA, rr, tw), the words (learn.en.js or learn.es.js, which set window.DQ),
   and this file.
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
const L=window.DQ,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-when-things-go-wrong";
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
// the quality bench's colours: ink, soft ink; green passes, amber holds for a person, red stops, grey wasn't checked; brass is what
// good means for a use, steel blue a measure, cream a record; gold marks what a scenario turns on
const K={ink:[236,243,255],soft:[160,178,205],good:[120,240,170],bad:[255,112,100],warm:[255,176,64],gold:[255,209,102],brass:[214,176,96],
  steel:[130,174,220],cream:[239,232,218],plum:[196,150,220]};
const rgbaS=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")",mixC=(a,b,t)=>[lp(a[0],b[0],t),lp(a[1],b[1],t),lp(a[2],b[2],t)];
const TW=(ctx,s,z,wt)=>tw(ctx,String(s),z,wt||700);
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/when-things-go-wrong.js)
const MISS=window.DQ_MISS=new Set();
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
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab dq-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls dq-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"dq-goals","aria-label":U.goals}),end=h("div",{class:"dq-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"dq-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"dq-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm dq-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"dq-goalbox"},h("p",{class:"dq-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"dq-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}

/* ---------- 1 · Silent change: one change, two halves ---------- */
// Waitlists go live overnight. A test on the status stops the build and keeps the last good number, labelled; without it, 108% full
// reaches Ana. The owner of the meaning decides what waitlisted is; then a contract, checked on every proposed change, catches the
// next status in test, before it ships.
PLAY.change=(Lb,api)=>{const W=Lb.w,S={test:"known",who:"sam",contract:false,night:null,nightT:null,fix:null,fixT:null,defer:null,deferT:null};
  const r1=api.group(W.testL);api.seg(r1,W.tests,"known",k=>{S.test=k;S.night=null;S.fix=null;S.defer=null;api.say(W.msg["t_"+k]);api.kick(300);},W.testL);
  api.btn(r1,W.nightB,()=>{S.night=S.test==="known"?"stopped":"wrong";S.nightT=performance.now();S.fix=null;S.defer=null;api.kick(1600);
    api.say(S.night==="stopped"?W.msg.stopped:W.msg.wrong,S.night==="stopped"?"ok":"no");api.reach(S.night==="stopped"?"stop":"wrong");},"go");
  const r2=api.group(W.whoL);api.seg(r2,W.whos,"sam",k=>{S.who=k;api.say(W.msg["w_"+k]);},W.whoL);
  api.btn(r2,W.fixB,()=>{if(!S.night){api.say(W.msg.nightFirst,"warn");return;}S.fixT=performance.now();api.kick(1600);
    if(S.who==="mei"){S.fix="right";api.say(W.msg.fixRight,"ok");api.reach("fix");}
    else if(S.who==="ben"){S.fix="asked";api.say(W.msg.fixBen,"warn");}
    else{S.fix="guess";api.say(W.msg.fixGuess,"no");}});
  const r3=api.group(W.contractL);api.toggle(r3,W.contractT,false,v=>{S.contract=v;S.defer=null;api.say(v?W.msg.contractOn:W.msg.contractOff);api.kick(400);});
  api.btn(r3,W.deferB,()=>{S.deferT=performance.now();api.kick(1600);
    if(S.contract){S.defer="caught";api.say(W.msg.caught,"ok");api.reach("caught");}
    else if(S.test==="known"){S.defer="stopped";api.say(W.msg.deferStopped,"warn");}
    else{S.defer="wrong";api.say(W.msg.deferWrong,"no");}});
  // what Ana's dashboard shows, from the latest thing that happened
  const dash=()=>{if(S.defer==="caught")return{v:W.fill.later,note:W.notes.fresh,c:K.good};if(S.defer==="stopped")return{v:W.fill.ok,note:W.notes.stale,c:K.warm};
    if(S.defer==="wrong")return{v:W.fill.wrong,note:W.notes.none,c:K.bad};
    if(S.fix==="right")return{v:W.fill.ok,note:W.notes.fresh,c:K.good};if(S.fix==="guess")return{v:W.fill.wrong,note:W.notes.none,c:K.bad};
    if(S.night==="stopped")return{v:W.fill.last,note:W.notes.stale,c:K.warm};if(S.night==="wrong")return{v:W.fill.wrong,note:W.notes.none,c:K.bad};
    return{v:W.fill.last,note:W.notes.before,c:K.ink};};
  const lay=(lw)=>{const m=12,o={lw,m},nar=lw<440;o.a={x:m,y:12,w:lw-m*2,h:92};o.b={x:m,y:o.a.y+o.a.h+10,w:lw-m*2,h:nar?124:88};
    o.c={x:m,y:o.b.y+o.b.h+10,w:lw-m*2,h:nar?150:118};o.h=o.c.y+o.c.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.steel);const a=o.a,d=dash(),nar=o.lw<440,t=S.nightT==null?1:eo(since(now,Math.max(S.nightT||0,S.fixT||0,S.deferT||0))/700);
    card(ctx,a.x,a.y,a.w,a.h,K.cream,W.dashName);withA(ctx,0.35+0.65*t,()=>line1(ctx,d.v,a.x+12,a.y+56,a.w-24,20,{w:800,color:rgbaS(d.c,1)}));
    line1(ctx,d.note,a.x+12,a.y+78,a.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    // the night's build: each step's state
    const b=o.b;card(ctx,b.x,b.y,b.w,b.h,K.steel,W.buildName);const st=W.steps,n=st.length,cols=nar?2:4,cw=(b.w-24-(cols-1)*8)/cols;
    const state=i=>{const run=S.defer||S.fix||S.night;if(!run)return K.soft;if(run==="right"||run==="caught")return K.good;
      if(run==="stopped")return i===0?K.good:i===1?K.bad:K.soft;if(run==="asked")return i===0?K.good:i===1?K.bad:K.soft;return i===n-1?K.bad:K.good;};
    st.forEach((s,i)=>{const x=b.x+12+(i%cols)*(cw+8),y=b.y+36+Math.floor(i/cols)*42;chip(ctx,x,y,cw,32,s,state(i),{size:12.5,glow:8});
      if(!nar&&i<n-1)arrow(ctx,x+cw+1,y+16,x+cw+7,y+16,K.soft,0.8,{head:5});});
    // who knew: what changed, and what it means; the contract joins them to the platform
    const c=o.c;card(ctx,c.x,c.y,c.w,c.h,K.plum,W.whoName);const hw=(c.w-24-8)/2,y1=c.y+36;
    chip(ctx,c.x+12,y1,hw,nar?40:32,W.ben,K.steel,{size:12});chip(ctx,c.x+12+hw+8,y1,hw,nar?40:32,W.mei,K.plum,{size:12});
    const py=y1+(nar?40:32)+26,pw=Math.min(220,c.w-24),px=c.x+(c.w-pw)/2,lit=S.contract;
    [c.x+12+hw/2,c.x+12+hw+8+hw/2].forEach(x0=>arrow(ctx,x0,y1+(nar?41:33),c.x+c.w/2,py-2,lit?K.good:K.soft,lit?0.95:0.5,{head:5,dash:lit?null:[4,4]}));
    chip(ctx,px,py,pw,30,W.platform,lit?K.good:K.soft,{size:12.5,glow:lit?12:4});
    if(lit)pill(ctx,c.x+c.w-12,c.y+10,S.defer==="caught"?W.v11:W.v10,K.good,{align:"right",size:12,max:c.w*0.45});};
  return{S,lay,draw,readouts:[[W.read.dash,()=>dash().v],[W.read.contract,()=>S.contract?(S.defer==="caught"?W.v11:W.v10):W.read.none],
    [W.read.woken,()=>S.night==="stopped"||S.defer==="caught"?W.read.nobody:"–"]]};};

/* ---------- 2 · Too good to be true: levels, tests, and the fix ---------- */
// Four nights: a closing date (+14%, real), a sync that copied a week (+38%), a file that doesn't come, and an ordinary night. Choose
// the test on the total, a test on the business key and a freshness check, and run them; then fix the copies, and see what each fix leaves.
PLAY.tuesday=(Lb,api)=>{const W=Lb.w,S={level:"none",key:false,fresh:false,ran:null,res:null,fix:"patch",fixed:null,fixT:null};
  const touch=()=>{S.ran=null;S.res=null;api.kick(300);};
  const r1=api.group(W.levelL);api.seg(r1,W.levels,"none",k=>{S.level=k;touch();api.say(W.msg["l_"+k]);},W.levelL);
  const r2=api.group(W.alsoL);
  api.toggle(r2,W.keyT,false,v=>{S.key=v;touch();api.say(v?W.msg.keyOn:W.msg.keyOff);});
  api.toggle(r2,W.freshT,false,v=>{S.fresh=v;touch();api.say(v?W.msg.freshOn:W.msg.freshOff);});
  // each night's outcome: pub (published, fine), warn (published with a warning), held (good data stopped), stop (a wrong number stopped,
  // the last good one labelled), leak (a wrong number reaches the committee), wleak (warned, and published anyway), stale (yesterday's
  // number shown as today's, with nothing to say so)
  const out=n=>{const L=S.level;
    if(n.k==="dup"){if(S.key||L==="both"||L==="strict")return"stop";return L==="warn"?"wleak":"leak";}
    if(n.k==="missing")return S.fresh?"stop":"stale";
    if(n.k==="close")return L==="strict"?"held":L==="none"?"pub":"warn";
    return"pub";};
  const r3=api.group();api.btn(r3,W.runB,()=>{S.ran=performance.now();S.res=W.nights.map(out);api.kick(2400);
    const bad=S.res.filter(x=>x==="leak"||x==="wleak"||x==="stale").length,held=S.res.filter(x=>x==="held").length;
    let m=fill(W.msg.ran,{bad,held});if(!bad&&!held)m+=" "+W.msg.ranGood;else if(held)m+=" "+W.msg.ranHeld;else if(S.res[1]==="wleak")m+=" "+W.msg.ranWarn;
    api.say(m,!bad&&!held?"ok":"warn");if(S.res[1]==="stop")api.reach("stop");if(S.res[1]==="stop"&&S.res[0]==="warn")api.reach("balance");if(S.res[2]==="stop")api.reach("late");},"go");
  const r4=api.group(W.fixL);api.seg(r4,W.fixes,"patch",k=>{S.fix=k;S.fixed=null;api.say(W.msg["f_"+k]);api.kick(300);},W.fixL);
  api.btn(r4,W.fixB,()=>{S.fixed=S.fix;S.fixT=performance.now();api.kick(1800);api.say(W.msg["fixed_"+S.fix],S.fix==="source"?"ok":"no");if(S.fix==="source")api.reach("source");});
  const lay=(lw)=>{const m=12,o={lw,m},nar=lw<440,rh=nar?50:30;o.a={x:m,y:12,w:lw-m*2,h:40+W.nights.length*rh+8,rh};
    o.b={x:m,y:o.a.y+o.a.h+10,w:lw-m*2,h:104+W.checks.length*(nar?34:22)};o.h=o.b.y+o.b.h+12;return o;};
  const col={pub:K.good,warn:K.warm,held:K.warm,stop:K.good,leak:K.bad,wleak:K.bad,stale:K.bad};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.warm);const a=o.a,nar=o.lw<440,u=S.ran==null?0:eo(since(now,S.ran)/1800);
    card(ctx,a.x,a.y,a.w,a.h,K.brass,W.nightsName);
    W.nights.forEach((n,i)=>{const y=a.y+40+i*a.rh,shown=S.res&&u>=(i+1)/(W.nights.length+1),r=shown?S.res[i]:null;
      if(nar){line1(ctx,n.name,a.x+12,y+14,a.w-24-62,12.5,{w:700});line1(ctx,n.change,a.x+a.w-12-56,y+14,56,12.5,{w:800,align:"right",color:rgbaS(n.real?K.ink:K.bad,1)});
        if(r)line1(ctx,W.res[r],a.x+12,y+34,a.w-24,12,{w:700,color:rgbaS(col[r],1)});else line1(ctx,W.res.wait,a.x+12,y+34,a.w-24,12,{w:600,color:rgbaS(K.soft,0.8)});}
      else{const nw=a.w*0.46;line1(ctx,n.name,a.x+12,y+18,nw,12.5,{w:700});line1(ctx,n.change,a.x+12+nw,y+18,50,12.5,{w:800,align:"right",color:rgbaS(n.real?K.ink:K.bad,1)});
        const rx=a.x+12+nw+62;if(r)line1(ctx,W.res[r],rx,y+18,a.x+a.w-12-rx,12,{w:700,color:rgbaS(col[r],1)});else line1(ctx,W.res.wait,rx,y+18,a.x+a.w-12-rx,12,{w:600,color:rgbaS(K.soft,0.8)});}});
    if(S.ran!=null&&u<1)api.kick(60);
    // the fix: the source and the platform, and what each fix leaves
    const b=o.b,f=S.fixed,v=f?eo(since(now,S.fixT)/1200):0;card(ctx,b.x,b.y,b.w,b.h,K.steel,W.fixName);const hw=(b.w-24-8)/2,y1=b.y+36;
    const src=f==="source"?W.after:W.before,plat=f?W.after:W.before;
    chip(ctx,b.x+12,y1,hw,44,"",K.cream,{size:12});line1(ctx,W.src,b.x+20,y1+17,hw-16,12,{w:700,color:rgbaS(K.soft,1)});line1(ctx,src,b.x+20,y1+36,hw-16,14,{w:800,color:rgbaS(f==="source"?K.good:K.ink,1)});
    chip(ctx,b.x+12+hw+8,y1,hw,44,"",K.steel,{size:12});line1(ctx,W.plat,b.x+hw+28,y1+17,hw-16,12,{w:700,color:rgbaS(K.soft,1)});line1(ctx,plat,b.x+hw+28,y1+36,hw-16,14,{w:800,color:rgbaS(f?K.good:K.ink,1)});
    const rows=W.checks,res=f?W.fixRes[f]:null,rh=nar?34:22;
    rows.forEach((t,i)=>{const y=b.y+102+i*rh,ok=res&&v>=(i+1)/(rows.length+1)?res[i]:null;
      ctx.fillStyle=rgbaS(ok==null?K.soft:ok?K.good:K.bad,ok==null?0.4:0.95);ctx.beginPath();ctx.arc(b.x+18,y+(nar?5:0)-4,4,0,6.3);ctx.fill();
      lines(ctx,t,b.x+30,y,b.w-42,{size:12,max:nar?2:1,w:600,color:rgbaS(ok==null?K.soft:K.ink,0.95)});});
    if(f&&v<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.leak,()=>S.res?String(S.res.filter(x=>x==="leak"||x==="wleak"||x==="stale").length):"–"],
    [W.read.held,()=>S.res?String(S.res.filter(x=>x==="held").length):"–"],[W.read.plat,()=>S.fixed?W.after:W.before]]};};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"dq-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","dq-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"dq-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"dq-tab-"+Lb.id,"aria-controls":"dq-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
  // the rail is one stop for the keyboard: arrows move along it, Home and End go to its ends
  rail.addEventListener("keydown",e=>{const bs=[...rail.children],k=bs.indexOf(document.activeElement);if(k<0)return;let j=null;
    if(e.key==="ArrowRight"||e.key==="ArrowDown")j=(k+1)%bs.length;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")j=(k-1+bs.length)%bs.length;else if(e.key==="Home")j=0;else if(e.key==="End")j=bs.length-1;
    if(j==null)return;e.preventDefault();bs[j].focus();show(bs[j].dataset.id);});
  app.append(rail,panel);show((location.hash||"").slice(1));
  window.addEventListener("hashchange",()=>{const id=(location.hash||"").slice(1);if(L.labs.some(x=>x.id===id))show(id,true);});}

/* ---------- the scenarios page: the series' evaluation ---------- */
// Twelve situations from every film; each answer explains why and points back to its playground. Answers are kept by the scenario's
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
/* ---------- the scenarios' pictures: one for each film's situations ---------- */
// Each draws the situation, not its answer; once it's answered (S.done), its key line is drawn in, in gold
const PK=L.pics,GO=(S,now)=>S.done?eo(since(now,S.done)/700):0;
// two teams, each with half of one change, and the platform the numbers come from
VIS.change=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.plum);const m=12,t=GO(S,now),w=(o.lw-m*2-12)/2;
  card(ctx,m,12,w,68,K.steel,PK.change.a);line1(ctx,PK.change.aSub,m+12,64,w-24,12,{w:600,color:rgbaS(K.soft,1)});
  card(ctx,m+w+12,12,w,68,K.plum,PK.change.b);line1(ctx,PK.change.bSub,m+w+24,64,w-24,12,{w:600,color:rgbaS(K.soft,1)});
  const pw=Math.min(240,o.lw-m*2),px=(o.lw-pw)/2;[m+w/2,m+w+12+w/2].forEach(x=>arrow(ctx,x,82,o.lw/2,110,t>0?K.gold:K.soft,0.85,{head:5,dash:t>=1?null:[4,4]}));
  chip(ctx,px,112,pw,32,PK.change.p,t>0?K.gold:K.soft,{size:12.5,glow:t>0?12:4});
  line1(ctx,PK.change.line,m,172,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
// a total on a gauge-like bar, with the warning and error levels marked
VIS.tuesday=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.warm);const m=12,t=GO(S,now),bw=o.lw-m*2-24,x0=m+12,y=70,mx=50;
  card(ctx,m,16,o.lw-m*2,112,K.brass,PK.tuesday.name);ctx.fillStyle=rgbaS(K.soft,0.25);rr(ctx,x0,y,bw,14,6);ctx.fill();
  [[10,K.warm,PK.tuesday.warn],[25,K.bad,PK.tuesday.error]].forEach(([v,c,l],i)=>{const x=x0+bw*v/mx;ctx.fillStyle=rgbaS(c,0.9);ctx.fillRect(x-1,y-6,2,26);
    line1(ctx,l,x+6,y+34+i*18,Math.min(150,x0+bw-x-6),12,{w:700,color:rgbaS(c,1)});});
  line1(ctx,PK.tuesday.line,m,160,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
})();
