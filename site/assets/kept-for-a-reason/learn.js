/* Learning Data: Kept for a reason. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one
   engine: the series' labs page and scenarios page load a film's bundle (for its parts: glass, T, withA, rr, tw), the words
   (learn.en.js or learn.es.js, which set window.KR), and this file. It follows Data that moves' engine, the pilot of the standard.
   Every lab is a playground (kind "play"), one for each film, as the author set on 18 November 2026: the visitor switches, picks and
   presses, and watches what happens; each playground has three to five experiments (w.goals), each ticked when the visitor makes it
   happen, and its end once all are ticked. Each playground's own rules are in PLAY below, its words in the pack. Most draw boxes in a
   grid and the requests between them (shoot): one that gets through ends on its box, one refused stops at a bar, green where that's
   good and red where it isn't.
   The scenarios are the series' evaluation, every one a choice, its options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its words stay
   big enough to read on a phone. Things move and settle, or jump to where they end when the visitor asks for reduced motion, and every
   change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films), both from
   site-tools/build_series.py. Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments)
   and "quiz" (answers by scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.KR,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-kept-for-a-reason";
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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/kept-for-a-reason.js)
const MISS=window.KR_MISS=new Set();
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
// experiment; api.kick(ms) keeps the picture moving. Start again puts everything back as it was, the ticks included, and stops the old playground's timers (S.dead, later()).
const PLAY={};
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab kr-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls kr-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"kr-goals","aria-label":U.goals}),end=h("div",{class:"kr-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"kr-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"kr-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm kr-again",onclick:()=>{if(P&&P.S)P.S.dead=true;got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"kr-goalbox"},h("p",{class:"kr-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"kr-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}
// the series' own colours: the platform's blue, the areas' teal, a person's rose, a workload's violet
K.area=[150,222,196];K.person=[255,150,200];K.work=[190,160,255];K.gate=[255,209,102];

/* ---------- boxes in a grid, and requests between them ---------- */
// grid(o, keys, y, hh, minW): boxes as wide as the width allows, at least minW each, row after row, in o.at; returns the y below them
function grid(o,keys,y,hh,minW,gap){gap=gap||8;const W=o.lw-o.m*2,cols=Math.max(1,Math.min(keys.length,Math.floor((W+gap)/(minW+gap)))),w=(W-(cols-1)*gap)/cols;
  keys.forEach((k,i)=>{o.at[k]={x:o.m+(i%cols)*(w+gap),y:y+Math.floor(i/cols)*(hh+gap),w,h:hh};});return y+Math.ceil(keys.length/cols)*(hh+gap)-gap;}
// a box: its title, on two lines where one is too narrow, and a line or two under it, as many as its height holds; o.a dims it,
// o.mark puts a tick or a cross on its corner
function box(ctx,r,col,title,sub,o){o=o||{};const a=o.a==null?1:o.a,tw2=r.w-24;card(ctx,r.x,r.y,r.w,r.h,col,"",{a,glow:o.glow,dash:o.dash,tint:o.tint});
  withA(ctx,a,()=>{const[tl,z]=fitL(ctx,title,tw2,o.size||13.5,2,800),lh=z*1.18,tc=rgbaS(mixC(col,K.ink,0.3),1);tl.forEach((l,i)=>T(ctx,l,r.x+12,r.y+21+i*lh,{w:800,size:z,color:tc}));
    if(sub){const sy=r.y+21+(tl.length-1)*lh+19,n=Math.max(1,Math.floor((r.y+r.h-8-sy)/15.25)+1);lines(ctx,sub,r.x+12,sy,tw2,{size:12.5,max:n,w:600,color:rgbaS(o.subc||K.soft,1)});}});
  if(o.mark)mark(ctx,r.x+r.w-4,r.y+4,o.mark);}
// a request on its way from one box to another (o.at keys): one that gets there ends on its box (ok), one refused stops partway at
// a bar; its colour says whether that's good (good) or bad. o.delay starts it later.
function shoot(S,a,b,ok,o){o=o||{};S.shots=S.shots||[];S.shots.push({a,b,ok,good:o.good==null?ok:o.good,t0:performance.now()+(RM()?0:o.delay||0),dur:o.dur||900,stop:o.stop||0.55});}
function ends(A,B){const ax=A.x+A.w/2,ay=A.y+A.h/2,bx=B.x+B.w/2,by=B.y+B.h/2,dx=bx-ax,dy=by-ay,f=R=>Math.min(dx?R.w/2/Math.abs(dx):1e9,dy?R.h/2/Math.abs(dy):1e9);
  const ta=Math.min(0.45,f(A)+0.01),tb=Math.min(0.45,f(B)+0.01);return[ax+dx*ta,ay+dy*ta,bx-dx*tb,by-dy*tb];}
function drawShots(ctx,o,now,S){(S.shots||[]).forEach(s=>{const A=o.at[s.a],B=o.at[s.b];if(!A||!B)return;const e=since(now,s.t0);if(e<0&&!RM())return;
  const[x0,y0,x1,y1]=ends(A,B),p=ei(cl(e/s.dur,0,1))*(s.ok?1:s.stop),x=lp(x0,x1,p),y=lp(y0,y1,p),col=s.good?K.good:K.bad;
  ctx.save();ctx.strokeStyle=rgbaS(col,0.9);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);
  if(!s.ok&&e>=s.dur){const an=Math.atan2(y1-y0,x1-x0)+Math.PI/2;ctx.strokeStyle=rgbaS(K.gate,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*11,y+Math.sin(an)*11);ctx.lineTo(x-Math.cos(an)*11,y-Math.sin(an)*11);ctx.stroke();}
  ctx.shadowColor=rgbaS(col,0.9);ctx.shadowBlur=12;ctx.fillStyle=rgbaS(col,1);ctx.beginPath();ctx.arc(x,y,e>=s.dur?4:6,0,TP);ctx.fill();ctx.restore();
  if(e>=s.dur)mark(ctx,x+(s.ok?0:12),y-(s.ok?0:10),s.good?"ok":"no");});}
const clear=S=>{S.shots=[];};
// a dashed line across a picture, with its name in a pill at the middle
function band(ctx,o,y,label,col){ctx.save();ctx.strokeStyle=rgbaS(col,0.5);ctx.lineWidth=1.4;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(o.m,y);ctx.lineTo(o.lw-o.m,y);ctx.stroke();ctx.restore();
  if(label)pill(ctx,o.lw/2,y-12,label,col,{align:"center",size:12,max:o.lw-o.m*2});}
// a short record of what happened, newest first, in a box
function logBox(ctx,r,col,title,rows){card(ctx,r.x,r.y,r.w,r.h,col,title,{glow:4,size:13});const n=Math.floor((r.h-34)/19);
  rows.slice(0,n).forEach((s,i)=>line1(ctx,s,r.x+12,r.y+42+i*19,r.w-24,12.5,{w:i?600:700,color:rgbaS(i?K.soft:K.ink,i?0.9:1)}));}
const later=(S,ms,fn)=>setTimeout(()=>{if(!S.dead)fn();},RM()?0:ms);

/* ---------- 1 · A reason to keep it: a reason for every piece ---------- */
// The pieces HR holds about Linh, each resting on the blanket yes of the 2023 form; give each the reason that really allows it,
// delete what has none, let her say no to the list, and answer Planning's new use.
PLAY.reason=(Lb,api)=>{const W=Lb.w,C=W.pieces,S={why:C.map(()=>"yes"),pick:0,gone:false,no:null,small:false,plan:null};
  const RIGHT=()=>C.every((c,i)=>S.why[i]===c.right),ORD=["contract","law","yes","task","none"];
  const check=()=>{if(RIGHT())api.reach("reasons");};
  let segR=null;const r1=api.group(W.pieceL);api.seg(r1,C.map((c,i)=>[String(i),c.n]),"0",k=>{S.pick=+k;[...segR.children].forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===S.why[S.pick])));api.kick(300);},W.pieceL);
  const r2=api.group(W.whyL);segR=api.seg(r2,ORD.map(k=>[k,W.whys[k]]),"yes",k=>{S.why[S.pick]=k;const c=C[S.pick];api.say(fill(k===c.right?W.msg.set:W.msg.setOff,{p:c.n,w:W.whys[k]}),k===c.right?"ok":"warn");check();api.kick(400);},W.whyL);
  const r3=api.group();
  api.btn(r3,W.dropB,()=>{const wrong=C.filter((c,i)=>S.why[i]==="none"&&c.right!=="none"),none=C.filter((c,i)=>c.right==="none"&&S.why[i]==="none");
    if(wrong.length){api.say(fill(W.msg.dropWrong,{p:wrong[0].n}),"no");return;}if(none.length<C.filter(c=>c.right==="none").length){api.say(W.msg.dropNone,"warn");return;}
    S.gone=true;api.say(W.msg.dropped,"ok");api.reach("less");api.kick(600);},"go");
  api.btn(r3,W.noB,()=>{const li=C.findIndex(c=>c.right==="yes"),others=C.some((c,i)=>i!==li&&S.why[i]==="yes"&&!(S.gone&&c.right==="none"));
    S.no=others?"bad":S.why[li]==="yes"?"ok":"off";api.kick(400);
    if(S.no==="ok"){api.say(W.msg.noOk,"ok");api.reach("yes");}else if(S.no==="bad")api.say(W.msg.noBad,"no");else api.say(W.msg.noOff,"warn");});
  const r4=api.group(W.planL);api.toggle(r4,W.smallT,false,v=>{S.small=v;S.plan=null;api.say(v?W.msg.smallOn:W.msg.smallOff);api.kick(300);});
  api.btn(r4,W.planB,()=>{S.plan=S.small?"ok":"bad";api.kick(400);api.say(S.small?W.msg.planOk:W.msg.planBad,S.small?"ok":"warn");if(S.small)api.reach("plan");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};o.rows=40;o.rh=34;o.plan=o.rows+C.length*(o.rh+6)+8;o.h=o.plan+62+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.area);line1(ctx,W.rowsT,o.m,24,o.lw-o.m*2,13,{w:800});
    C.forEach((c,i)=>{const y=o.rows+i*(o.rh+6),out=S.gone&&c.right==="none",on=i===S.pick,k=S.why[i],col=k===c.right?K.good:K.bad;
      chip(ctx,o.m,y,o.lw-o.m*2,o.rh,"",on?K.plat:K.soft,{a:out?0.4:1,glow:on?12:2,tint:on?0.14:0.05});
      line1(ctx,c.n,o.m+12,y+o.rh/2+5,o.lw*0.52-o.m-14,13,{w:700,color:rgbaS(K.ink,out?0.5:0.95)});
      pill(ctx,o.lw-o.m-8,y+5,out?W.deleted:W.whys[k],out?K.soft:col,{align:"right",size:12,max:o.lw*0.46-12});});
    const P=o.plan;card(ctx,o.m,P,o.lw-o.m*2,62,S.plan==null?K.soft:S.plan==="ok"?K.good:K.gold,W.planN,{glow:S.plan?10:3,a:S.plan?1:0.6,size:13.5});
    line1(ctx,S.plan==null?W.planIdle:S.plan==="ok"?W.planShowOk:W.planShowBad,o.m+12,P+46,o.lw-o.m*2-24,12.5,{w:600,color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.right,()=>C.filter((c,i)=>S.why[i]===c.right).length+" / "+C.length],[W.read.held,()=>String(S.gone?C.length-2:C.length)]]};};

/* ---------- 2 · How long, and then what: one schedule, by kind ---------- */
// Records with no end date, or one schedule by kind of record; the clean-up, Linh's last contract, and a hold for a claim.
PLAY.schedule=(Lb,api)=>{const W=Lb.w,S={sched:"none",oct:null,linh:null,hold:false,jan:null,settled:false};
  const r1=api.group(W.schedL);api.seg(r1,W.scheds,"none",k=>{S.sched=k;S.oct=S.linh=S.jan=null;S.settled=false;api.say(W.msg[k]);api.kick(300);},W.schedL);
  api.btn(r1,W.octB,()=>{S.oct=S.sched;api.kick(500);if(S.sched==="sched"){api.say(W.msg.octOk,"ok");api.reach("cleanup");}else api.say(W.msg.octNone,"warn");},"go");
  api.btn(r1,W.linhB,()=>{S.linh=S.sched;api.kick(500);if(S.sched==="sched"){api.say(W.msg.linhOk,"ok");api.reach("clock");}else api.say(W.msg.linhNone,"warn");});
  const r2=api.group(W.claimL);api.toggle(r2,W.holdT,false,v=>{S.hold=v;S.jan=null;S.settled=false;api.say(v?W.msg.holdOn:W.msg.holdOff);api.kick(300);});
  api.btn(r2,W.janB,()=>{if(S.sched!=="sched"){api.say(W.msg.needSched,"warn");return;}S.jan=S.hold?"held":"gone";api.kick(500);
    if(S.hold){api.say(W.msg.janHeld,"ok");api.reach("hold");}else api.say(W.msg.janGone,"no");});
  api.btn(r2,W.settleB,()=>{if(S.jan!=="held"){api.say(W.msg.settleFirst,"warn");return;}S.settled=true;api.kick(500);api.say(W.msg.settled,"ok");api.reach("lifted");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["pay16","apps","pay19","claim","linh","deg"],12,90,140);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const sc=S.sched==="sched",B=W.boxes;
    const st={pay16:S.oct==="sched"?"gone":sc?"due":"ever",apps:S.oct==="sched"?"gone":sc?"due":"ever",pay19:S.jan?"gone":sc?"date":"ever",
      claim:S.settled?"gone":S.jan==="held"?"held":S.jan==="gone"?"lost":sc?"date":"ever",linh:S.linh==="sched"?"set":sc?"live":"ever",deg:sc?"good":"ever"};
    Object.keys(st).forEach(k=>{const s=st[k],col=s==="gone"?K.soft:s==="lost"?K.bad:s==="ever"?K.bad:s==="held"?K.gold:K.good;
      box(ctx,o.at[k],col,B[k],W.stat[s]||"",{a:s==="gone"?0.45:1,glow:s==="held"||s==="set"?14:4,mark:s==="lost"?"no":s==="held"||s==="set"?"ok":null});});};
  return{S,lay,draw,readouts:[[W.read.dates,()=>S.sched==="sched"?W.read.every:W.read.none],[W.read.oldest,()=>S.oct==="sched"?"2019":"2016"]]};};

/* ---------- 3 · Forgetting a person: find her, answer her ---------- */
// Linh's request: check it's her with what's already trusted, find every place she is, keep her off a list that's rebuilt, and say
// what stays if she asks to be forgotten.
PLAY.forget=(Lb,api)=>{const W=Lb.w,P=W.places,S={chk:"passport",logged:null,by:"name",found:null,list:"row",rebuilt:null,all:false};
  const r1=api.group(W.chkL);api.seg(r1,W.chks,"passport",k=>{S.chk=k;S.logged=null;api.say(W.msg[k]);api.kick(300);},W.chkL);
  api.btn(r1,W.logB,()=>{S.logged=S.chk;api.kick(400);if(S.chk==="account"){api.say(W.msg.logOk,"ok");api.reach("her");}else api.say(W.msg.logPass,"warn");},"go");
  const r2=api.group(W.byL);api.seg(r2,W.bys,"name",k=>{S.by=k;S.found=null;S.all=false;api.kick(300);},W.byL);
  api.btn(r2,W.searchB,()=>{S.found=S.by;S.all=false;api.kick(600);if(S.by==="all"){api.say(W.msg.foundAll,"ok");api.reach("found");}else api.say(W.msg.foundName,"warn");});
  const r3=api.group(W.listL);api.seg(r3,W.lists,"row",k=>{S.list=k;S.rebuilt=null;api.say(W.msg[k]);api.kick(300);},W.listL);
  api.btn(r3,W.rebuildB,()=>{S.rebuilt=S.list;api.kick(500);if(S.list==="no"){api.say(W.msg.rebuildNo,"ok");api.reach("list");}else api.say(W.msg.rebuildRow,"no");});
  const r4=api.group();api.btn(r4,W.allB,()=>{if(S.found!=="all"){api.say(W.msg.findFirst,"warn");return;}S.all=true;api.kick(500);api.say(W.msg.allSaid,"ok");api.reach("stays");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};o.top=30;let y=grid(o,P.map(p=>p.k),o.top+8,92,130);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.person);line1(ctx,S.logged==="account"?W.reqOk:S.logged?W.reqPass:W.reqIdle,o.m,20,o.lw-o.m*2,13,{w:800,color:rgbaS(S.logged==="account"?K.good:K.soft,1)});
    P.forEach(p=>{const seen=S.found==="all"||S.found==="name"&&p.name,listOut=p.k==="list"&&S.rebuilt==="no",listBack=p.k==="list"&&S.rebuilt==="row";
      const sub=S.all?p.left:listOut?W.offList:listBack?W.backList:seen?p.found:S.found?W.missed:W.notYet;
      const col=S.all?(p.stays?K.gold:K.soft):listBack?K.bad:listOut?K.good:seen?K.good:S.found?K.bad:K.soft;
      box(ctx,o.at[p.k],col,p.n,sub,{a:seen||S.all?1:0.7,max:3,mark:S.found&&!seen?"no":null});});};
  return{S,lay,draw,readouts:[[W.read.found,()=>S.found==null?"–":(S.found==="all"?P.length:P.filter(p=>p.name).length)+" / "+P.length],[W.read.due,()=>S.logged==="account"?W.read.date:"–"]]};};

/* ---------- 4 · Deleted means deleted: every copy, broken or void ---------- */
// The night job's delete, the old files and VACUUM, the list rebuilt from HR, a locked copy restored, and the query history.
PLAY.deleted=(Lb,api)=>{const W=Lb.w,S={rew:false,del:false,vac:false,q:null,src:false,reb:null,re:false,rest:null,named:false,hist:null};
  const r1=api.group(W.delL);api.toggle(r1,W.rewT,false,v=>{S.rew=v;S.del=S.vac=false;S.q=null;api.say(v?W.msg.rewOn:W.msg.rewOff);api.kick(300);});
  api.btn(r1,W.delB,()=>{S.del=true;S.vac=false;S.q=null;S.reb=null;api.kick(500);api.say(S.rew?W.msg.delRew:W.msg.delMark,"ok");},"go");
  api.btn(r1,W.vacB,()=>{if(!S.del){api.say(W.msg.delFirst,"warn");return;}S.vac=true;S.q=null;api.kick(500);api.say(W.msg.vac,"ok");});
  api.btn(r1,W.qB,()=>{S.q=!S.del?"now":!S.vac?"old":!S.rew?"file":"gone";api.kick(500);
    if(S.q==="gone"){api.say(W.msg.qGone,"ok");api.reach("gone");}else api.say(W.msg["q_"+S.q],"no");});
  const r2=api.group(W.srcL);api.toggle(r2,W.srcT,false,v=>{S.src=v;S.reb=null;api.say(v?W.msg.srcOn:W.msg.srcOff);api.kick(300);});
  api.btn(r2,W.rebB,()=>{if(!S.del){api.say(W.msg.delFirst,"warn");return;}S.reb=S.src?"out":"back";api.kick(500);if(S.src){api.say(W.msg.rebOut,"ok");api.reach("source");}else api.say(W.msg.rebBack,"no");});
  const r3=api.group(W.copyL);api.toggle(r3,W.reT,false,v=>{S.re=v;S.rest=null;api.say(v?W.msg.reOn:W.msg.reOff);api.kick(300);});
  api.btn(r3,W.restB,()=>{if(!S.del){api.say(W.msg.delFirst,"warn");return;}S.rest=S.re?"void":"back";api.kick(500);if(S.re){api.say(W.msg.restVoid,"ok");api.reach("restore");}else api.say(W.msg.restBack,"no");});
  const r4=api.group(W.logL);api.toggle(r4,W.namedT,false,v=>{S.named=v;S.hist=null;api.say(v?W.msg.namedOn:W.msg.namedOff);api.kick(300);});
  api.btn(r4,W.histB,()=>{S.hist=S.named?"clean":"her";api.kick(500);if(S.named){api.say(W.msg.histClean,"ok");api.reach("logs");}else api.say(W.msg.histHer,"no");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["list","old","files","tool","copy","hist"],12,90,140);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const B=W.boxes,T2=W.stat;
    const st={list:S.reb==="back"?"back":S.del?"gone":"her",old:S.vac?"gone":S.del?"holds":"her",files:S.vac&&S.rew?"gone":S.del?(S.rew?"rewritten":"marked"):"her",
      tool:S.reb==="back"?"back":S.del?"gone":"her",copy:S.rest==="void"?"void":S.rest==="back"?"back":S.del?"locked":"her",hist:S.hist==="clean"?"clean":S.hist==="her"?"typed":"idle"};
    Object.keys(st).forEach(k=>{const s=st[k],col=s==="gone"||s==="void"||s==="clean"||s==="rewritten"?K.good:s==="locked"||s==="holds"||s==="idle"?K.gold:K.bad;
      box(ctx,o.at[k],col,B[k],T2[k][s],{max:3,glow:s==="gone"||s==="void"||s==="clean"?14:4,mark:s==="back"||s==="typed"?"no":s==="gone"||s==="void"||s==="clean"?"ok":null});});};
  return{S,lay,draw,readouts:[[W.read.query,()=>S.vac&&S.rew?W.read.no:W.read.yes],[W.read.left,()=>String(["list","old","files","tool","copy"].filter(k=>k==="copy"?S.rest!=="void":k==="old"?!S.vac:k==="files"?!(S.vac&&S.rew):!S.del||S.reb==="back").length)]]};};

/* ---------- 5 · A person asks: a clock, the true reasons, proof ---------- */
// Request 2026-117: left in an inbox, or logged with a clock; a search by her numbers, or by her numbers and the codes made from
// them, through the table of keys; the owners' check, and the answer.
PLAY.asks=(Lb,api)=>{const W=Lb.w,P=W.places,S={req:"inbox",day:null,look:"nums",by:"typed",run:null,checked:false,sent:null};
  const r1=api.group(W.reqL);api.seg(r1,W.reqs,"inbox",k=>{S.req=k;S.day=null;S.sent=null;api.say(W.msg[k]);api.kick(300);},W.reqL);
  api.btn(r1,W.dayB,()=>{S.day=S.req;api.kick(400);if(S.req==="log"){api.say(W.msg.dayLog,"ok");api.reach("clock");}else api.say(W.msg.dayInbox,"warn");},"go");
  const r2=api.group(W.lookL);api.seg(r2,W.looks,"nums",k=>{S.look=k;S.run=null;S.checked=false;api.kick(300);},W.lookL);
  api.seg(r2,W.bys,"typed",k=>{S.by=k;S.run=null;S.checked=false;api.say(W.msg[k]);api.kick(300);},W.byL);
  api.btn(r2,W.runB,()=>{S.run={look:S.look,by:S.by};S.checked=false;api.kick(600);
    const t=(S.look==="codes"?W.msg.runCodes:W.msg.runNums)+" "+(S.by==="keys"?W.msg.runKeys:W.msg.runTyped);api.say(t,S.look==="codes"&&S.by==="keys"?"ok":"warn");
    if(S.look==="codes")api.reach("codes");if(S.by==="keys")api.reach("keys");});
  const r3=api.group(W.ansL);api.btn(r3,W.checkB,()=>{if(!S.run){api.say(W.msg.runFirst,"warn");return;}S.checked=true;api.kick(300);api.say(W.msg.checked,"ok");});
  api.btn(r3,W.sendB,()=>{const ok=S.req==="log"&&S.run&&S.run.look==="codes"&&S.run.by==="keys"&&S.checked;S.sent=ok?"ok":"bad";api.kick(400);
    if(ok){api.say(W.msg.sentOk,"ok");api.reach("proof");}else api.say(S.req!=="log"?W.msg.sentInbox:!S.run||S.run.look!=="codes"?W.msg.sentMissed:S.run.by!=="keys"?W.msg.sentTyped:W.msg.sentUnchecked,"no");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};o.top=30;let y=grid(o,P.map(p=>p.k),o.top+8,80,120);o.log={x:o.m,y:y+12,w:lw-o.m*2,h:34+4*19+6};o.h=o.log.y+o.log.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.work);const R=S.run;line1(ctx,S.req==="log"?W.reqLog:W.reqInbox,o.m,20,o.lw-o.m*2,13,{w:800,color:rgbaS(S.req==="log"?K.good:K.soft,1)});
    P.forEach(p=>{const seen=R&&(!p.code||R.look==="codes"),col=!R?K.soft:seen?(S.checked?K.good:K.plat):K.bad;
      box(ctx,o.at[p.k],col,p.n,!R?W.notYet:seen?(S.checked?W.checkedS:p.found):W.missed,{a:R?1:0.7,mark:R&&!seen?"no":S.checked&&seen?"ok":null});});
    const rows=[S.req==="log"?W.proofLog:W.proofNone];if(R)rows.push(R.by==="keys"?W.proofKeys:W.proofTyped);if(S.checked)rows.push(W.proofChecked);if(S.sent)rows.push(S.sent==="ok"?W.proofSent:W.proofNot);
    logBox(ctx,o.log,K.plat,W.proofT,rows);};
  return{S,lay,draw,readouts:[[W.read.found,()=>!S.run?"–":P.filter(p=>!p.code||S.run.look==="codes").length+" / "+P.length],[W.read.due,()=>S.req==="log"?W.read.date:W.read.none]]};};
const BUILD={play:labPlay};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"kr-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","kr-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"kr-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"kr-tab-"+Lb.id,"aria-controls":"kr-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
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

/* ---------- the scenarios' pictures: one for each playground's situations ---------- */
// Two sides and what stands between them, from the words (pics); once it's answered (S.done), the line between them is drawn in, in gold
const PK=L.pics,GO=(S,now)=>S.done?eo(since(now,S.done)/700):0,hexC=s=>rgb(s);
L.labs.forEach(Lb=>{const p=PK[Lb.id];if(!p)return;const col=hexC(Lb.c);
  VIS[Lb.id]=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,col);const m=12,w=(o.lw-m*2-70)/2,t=GO(S,now);card(ctx,m,24,w,92,col,"",{glow:8});card(ctx,o.lw-m-w,24,w,92,K.plat,"",{glow:8});
    lines(ctx,p.a,m+12,52,w-24,{size:14,max:3,align:"center"});lines(ctx,p.b,o.lw-m-w+12,52,w-24,{size:14,max:3,align:"center"});
    arrow(ctx,m+w+6,70,o.lw-m-w-6,70,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[4,4],lw:t>0?2.6:2});lines(ctx,p.mid,m,144,o.lw-m*2,{size:13,max:2,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
  VIS[Lb.id].h=()=>176;});
})();

