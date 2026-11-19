/* Learning Data: Locks before the data. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one
   engine: the series' labs page and scenarios page load a film's bundle (for its parts: glass, T, withA, rr, tw), the words
   (learn.en.js or learn.es.js, which set window.LK), and this file. It follows Data that moves' engine, the pilot of the standard.
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
const L=window.LK,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-locks-before-the-data";
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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/locks-before-the-data.js)
const MISS=window.LK_MISS=new Set();
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
  function loop(){st.raf=-1;paint();st.raf=performance.now()<st.until?requestAnimationFrame(loop):0;}
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
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab lk-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls lk-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"lk-goals","aria-label":U.goals}),end=h("div",{class:"lk-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"lk-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"lk-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm lk-again",onclick:()=>{if(P&&P.S)P.S.dead=true;got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"lk-goalbox"},h("p",{class:"lk-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"lk-foot"},again));}
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

/* ---------- 1 · Who is it, really? An identity of its own, rights from a role ---------- */
// The nightly job signs in as Jun or under its own name; Ana moves team with rights given by name or by a role's group; Leo joins,
// and gets in only once his confidentiality agreement is signed. Requests go from each to the university's five areas.
PLAY.who=(Lb,api)=>{const W=Lb.w,S={id:"jun",rights:"name",moved:false,agree:false,ana:false,leo:false,shots:[]},AR=["reg","learn","plan","hr","fin"];
  const r1=api.group(W.idL);api.seg(r1,W.ids,"jun",k=>{S.id=k;clear(S);api.say(W.msg[k]);api.kick(300);},W.idL);
  api.toggle(r1,W.movedT,false,v=>{S.moved=v;clear(S);api.say(v?W.msg.movedOn:W.msg.movedOff);api.kick(300);});
  const r2=api.group();
  api.btn(r2,W.loadB,()=>{clear(S);const ok=!(S.id==="jun"&&S.moved);shoot(S,"job","reg",ok);api.kick(1400);
    api.say(W.msg[(S.id==="own"?"loadOwn":"loadJun")+(S.moved?"Moved":"")],ok?"ok":"no");if(S.id==="own"&&S.moved)api.reach("moves");},"go");
  api.btn(r2,W.thiefB,()=>{clear(S);AR.forEach((k,i)=>{const ok=S.id==="jun"||k==="reg";shoot(S,"job",k,ok,{good:!ok,delay:i*140});});api.kick(1900);
    if(S.id==="jun")api.say(W.msg.thiefJun,"no");else{api.say(W.msg.thiefOwn,"ok");api.reach("least");}});
  const r3=api.group(W.rightsL);api.seg(r3,W.rights,"name",k=>{S.rights=k;S.ana=false;clear(S);api.say(W.msg["r_"+k]);api.kick(300);},W.rightsL);
  api.btn(r3,W.anaB,()=>{clear(S);S.ana=true;const keep=S.rights==="name";shoot(S,"ana","reg",keep,{good:!keep});shoot(S,"ana","plan",true,{delay:200});api.kick(1500);
    api.say(keep?W.msg.anaName:W.msg.anaRole,keep?"warn":"ok");if(!keep)api.reach("mover");});
  const r4=api.group(W.joinL);api.toggle(r4,W.agreeT,false,v=>{S.agree=v;api.say(v?W.msg.agreeOn:W.msg.agreeOff);api.kick(300);});
  api.btn(r4,W.leoB,()=>{clear(S);S.leo=true;shoot(S,"leo","reg",S.agree,{good:true});api.kick(1400);api.say(S.agree?W.msg.leoIn:W.msg.leoWait,S.agree?"ok":"warn");if(S.agree)api.reach("joiner");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["job","ana","leo"],12,74,130);o.gate=y+26;o.areasY=o.gate+18;y=grid(o,AR,o.areasY+20,46,120);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);
    box(ctx,o.at.job,S.id==="own"?K.work:K.gold,W.jobName,S.id==="own"?W.jobOwn:S.moved?W.jobJunMoved:W.jobJun);
    box(ctx,o.at.ana,K.person,W.anaName,S.ana?W.anaMoved:W.anaSub);
    box(ctx,o.at.leo,K.person,W.leoName,S.agree?W.leoSigned:W.leoSub);
    band(ctx,o,o.gate,W.check,K.plat);line1(ctx,W.areas,o.m,o.areasY+12,o.lw-o.m*2,12.5,{w:700,color:rgbaS(K.soft,1)});
    AR.forEach((k,i)=>box(ctx,o.at[k],K.area,W.areaN[i]));drawShots(ctx,o,now,S);};
  return{S,lay,draw,readouts:[[W.read.as,()=>S.id==="jun"?W.read.jun:"registrar-loader"],[W.read.reach,()=>S.id==="jun"?"5":"1"],[W.read.keeps,()=>S.rights==="name"?W.read.yes:W.read.no]]};};

/* ---------- 2 · No secret to lose: the ladder of sign-ins ---------- */
// Six ways for the job to sign in, worst at the bottom; a thief copies whatever the job holds, Jun moves team; and four ways for
// people, where a fake page asks for a sign-in.
PLAY.ladder=(Lb,api)=>{const W=Lb.w,R=W.rungs,P=W.ppl,S={r:0,from:0,at:performance.now()-1e5,p:0,thief:null,moved:null,fake:null};
  const r1=api.group(W.rungL);api.seg(r1,R.map((x,i)=>[String(i),x.name]),"0",k=>{S.from=S.r;S.r=+k;S.at=performance.now();S.thief=null;S.moved=null;api.kick(900);api.say(R[S.r].say);},W.rungL);
  const r2=api.group();
  api.btn(r2,W.thiefB,()=>{S.thief=S.r;S.moved=null;api.kick(600);const safe=S.r>=4;api.say(R[S.r].thief,safe?"ok":S.r>=2?"warn":"no");if(safe)api.reach("nothing");},"go");
  api.btn(r2,W.movedB,()=>{S.moved=S.r;S.thief=null;api.kick(600);const ok=S.r>0;api.say(ok?W.msg.movedOk:W.msg.movedStop,ok?"ok":"no");if(ok)api.reach("moves");});
  const r3=api.group(W.pplL);api.seg(r3,P.map((x,i)=>[String(i),x.name]),"0",k=>{S.p=+k;S.fake=null;api.kick(300);api.say(P[S.p].say);},W.pplL);
  api.btn(r3,W.fakeB,()=>{S.fake=S.p;api.kick(600);const ok=S.p===P.length-1;api.say(P[S.p].fake,ok?"ok":"no");if(ok)api.reach("fake");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};o.rung0=12;o.rh=30;o.rg=6;let y=o.rung0+R.length*(o.rh+o.rg);o.haul={x:o.m,y:y+6,w:lw-o.m*2,h:78};y=o.haul.y+o.haul.h+16;
    o.pplY=y;y=grid(o,P.map((x,i)=>"p"+i),y+20,38,130,6);o.fake={x:o.m,y:y+10,w:lw-o.m*2,h:60};o.h=o.fake.y+o.fake.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.work);const x0=o.m+8,x1=o.lw-o.m-8,ry=i=>o.rung0+(R.length-1-i)*(o.rh+o.rg);
    ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.5);ctx.lineWidth=3;[x0,x1].forEach(x=>{ctx.beginPath();ctx.moveTo(x,o.rung0-4);ctx.lineTo(x,o.rung0+R.length*(o.rh+o.rg)-o.rg+4);ctx.stroke();});ctx.restore();
    const t=eo(since(now,S.at)/700),yy=lp(ry(S.from),ry(S.r),t);
    R.forEach((x,i)=>{const on=i===S.r,col=i>=4?K.good:i>=2?K.gold:K.bad;chip(ctx,x0+10,ry(i),x1-x0-20,o.rh,x.name,col,{size:12.5,a:on?1:0.55,glow:on?12:3,tint:on?0.22:0.08});});
    ctx.save();ctx.strokeStyle=rgbaS(K.ink,0.95);ctx.lineWidth=2;rr(ctx,x0+6,yy-3,x1-x0-12,o.rh+6,10);ctx.stroke();ctx.restore();
    const H=o.haul,showT=S.thief!=null,showM=S.moved!=null,safe=showT?S.thief>=4:showM?S.moved>0:true;
    card(ctx,H.x,H.y,H.w,H.h,showT||showM?(safe?K.good:K.bad):K.soft,showT?W.haulT:showM?W.haulM:W.haulN,{glow:6,size:13.5});
    lines(ctx,showT?R[S.thief].haul:showM?(S.moved>0?W.msg.movedOkS:W.msg.movedStopS):fill(W.holds,{h:R[S.r].holds}),H.x+12,H.y+42,H.w-24,{size:12.5,max:2,w:600,color:rgbaS(K.soft,1)});
    line1(ctx,W.pplT,o.m,o.pplY+12,o.lw-o.m*2,12.5,{w:700,color:rgbaS(K.soft,1)});
    P.forEach((x,i)=>{const r=o.at["p"+i],on=i===S.p;chip(ctx,r.x,r.y,r.w,r.h,x.name,i===P.length-1?K.good:K.person,{size:12.5,a:on?1:0.55,glow:on?12:3});});
    const F=o.fake,fk=S.fake!=null,ok=fk&&S.fake===P.length-1;card(ctx,F.x,F.y,F.w,F.h,fk?(ok?K.good:K.bad):K.soft,W.fakeName,{glow:4,size:13});
    line1(ctx,fk?P[S.fake].got:W.fakeIdle,F.x+12,F.y+44,F.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.holds,()=>R[S.r].holds],[W.read.lasts,()=>R[S.r].lasts]]};};

/* ---------- 3 · Walls, doors and keys: an attacker's way in ---------- */
// Four locks, each switched on or off: no door on the open internet, three workspaces, the catalog as the files' only door, and
// locked copies apart. Four tries at getting in, each stopped by its lock or not.
PLAY.walls=(Lb,api)=>{const W=Lb.w,S={door:false,rooms:false,cat:false,copies:false,shots:[],lost:false};
  const r1=api.group(W.locksL);["door","rooms","cat","copies"].forEach(k=>api.toggle(r1,W.locks[k],false,v=>{S[k]=v;clear(S);S.lost=false;api.say(W.msg[k+(v?"On":"Off")]);api.kick(300);}));
  const r2=api.group(W.triesL);
  api.btn(r2,W.tries.web,()=>{clear(S);shoot(S,"atk","door",!S.door,{good:S.door});if(!S.door){shoot(S,"door","ws",true,{good:false,delay:900});}api.kick(2000);api.say(S.door?W.msg.webNo:W.msg.webYes,S.door?"ok":"no");if(S.door)api.reach("nodoor");},"go");
  api.btn(r2,W.tries.stolen,()=>{clear(S);shoot(S,"ws","real",!S.rooms,{good:S.rooms});api.kick(1400);api.say(S.rooms?W.msg.stolenNo:W.msg.stolenYes,S.rooms?"ok":"no");if(S.rooms)api.reach("small");});
  api.btn(r2,W.tries.files,()=>{clear(S);shoot(S,"ws","files",!S.cat,{good:S.cat});api.kick(1400);api.say(S.cat?W.msg.filesNo:W.msg.filesYes,S.cat?"ok":"no");if(S.cat)api.reach("files");});
  api.btn(r2,W.tries.ransom,()=>{clear(S);shoot(S,"ws","bak",!S.copies,{good:S.copies});S.lost=!S.copies;api.kick(1400);api.say(S.copies?W.msg.ransomNo:W.msg.ransomYes,S.copies?"ok":"no");if(S.copies)api.reach("copy");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["atk","door"],12,72,130);y=grid(o,["ws","real"],y+26,72,130);y=grid(o,["files","bak"],y+26,72,130);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.area);
    box(ctx,o.at.atk,K.bad,W.atk,W.atkSub);box(ctx,o.at.door,K.plat,W.doorN,S.door?W.doorOn:W.doorOff,{dash:S.door});
    box(ctx,o.at.ws,K.plat,S.rooms?W.wsOn:W.wsOff,S.rooms?W.wsOnS:W.wsOffS);box(ctx,o.at.real,K.area,W.realN,S.rooms?W.realOn:W.realOff);
    box(ctx,o.at.files,K.gold,W.filesN,S.cat?W.filesOn:W.filesOff);box(ctx,o.at.bak,S.lost?K.bad:K.good,W.bakN,S.lost?W.bakLost:S.copies?W.bakOn:W.bakOff);drawShots(ctx,o,now,S);};
  return{S,lay,draw,readouts:[[W.read.doors,()=>S.door?"0":"1"],[W.read.files,()=>S.cat?"1":"2"],[W.read.bak,()=>S.copies?W.read.none:W.read.any]]};};

/* ---------- 4 · Power you switch on: an admin account, off until a task ---------- */
// Great power (read the storage, change the settings, restore a table) sits in Jun's everyday account, always on, or in an admin
// account that's off until switched on: one power, for a time, approved by someone else. Last night's file, and a fake link.
PLAY.power=(Lb,api)=>{const W=Lb.w,S={where:"every",pw:"storage",hrs:1,appr:"sam",on:null,until:0,log:[],shots:[],phish:false};
  const HOUR=2600,isOn=now=>S.on!=null&&now<S.until,note=s=>{S.log.unshift(s);S.log=S.log.slice(0,6);};
  const r1=api.group(W.whereL);api.seg(r1,W.wheres,"every",k=>{S.where=k;S.on=null;clear(S);S.phish=false;api.say(W.msg[k]);api.kick(300);},W.whereL);
  const r2=api.group(W.askL);api.seg(r2,W.pws,"storage",k=>{S.pw=k;},W.askL);api.seg(r2,W.times,"1",k=>{S.hrs=+k;},W.askL);api.seg(r2,W.apprs,"sam",k=>{S.appr=k;},W.askL);
  api.btn(r2,W.askB,()=>{const now=performance.now();if(S.where==="every"){api.say(W.msg.always,"warn");return;}
    if(S.appr==="jun"){api.say(W.msg.self,"ok");note(W.logSelf);api.reach("self");api.kick(300);return;}
    const end=now+HOUR*S.hrs;S.on=S.pw;S.until=end;note(fill(W.logOn,{p:W.pwN[S.pw],h:S.hrs}));api.say(fill(W.msg.on,{p:W.pwN[S.pw],h:S.hrs}),"ok");api.kick(HOUR*S.hrs+300);
    setTimeout(()=>{if(S.dead||S.on==null||S.until!==end)return;S.on=null;note(W.logOff);api.say(W.msg.off,"ok");api.reach("off");api.refresh();api.kick(300);},HOUR*S.hrs);},"go");
  const r3=api.group(W.morningL);
  api.btn(r3,W.fileB,()=>{const now=performance.now();clear(S);
    if(S.where==="every"){shoot(S,"every","storage",true,{good:false});api.say(W.msg.fileEvery,"warn");}
    else if(isOn(now)&&S.on==="storage"){shoot(S,"admin","storage",true);note(W.logRead);api.say(W.msg.fileOk,"ok");api.reach("task");}
    else if(isOn(now)){shoot(S,"admin","storage",false,{good:false});api.say(W.msg.fileWrong,"no");}
    else{shoot(S,"every","storage",false,{good:false});api.say(W.msg.fileShut,"no");}api.kick(1400);});
  api.btn(r3,W.phishB,()=>{clear(S);S.phish=true;const ev=S.where==="every";["storage","settings","restore"].forEach((k,i)=>shoot(S,"every",k,ev,{good:!ev,delay:i*140}));api.kick(1800);
    api.say(ev?W.msg.phishEvery:W.msg.phishAdmin,ev?"no":"ok");if(!ev)api.reach("phish");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["every","admin"],12,94,130);y=grid(o,["storage","settings","restore"],y+40,56,90);o.log={x:o.m,y:y+12,w:lw-o.m*2,h:34+4*19+6};o.h=o.log.y+o.log.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const on=isOn(now),ev=S.where==="every";
    box(ctx,o.at.every,S.phish?K.bad:K.person,W.everyN,ev?W.everyOn:W.everyOff);
    box(ctx,o.at.admin,on?K.gold:K.soft,W.adminN,ev?W.adminNone:on?fill(W.adminOn,{p:W.pwN[S.on]}):W.adminOff,{a:ev?0.5:1,glow:on?16:4});
    if(on){const A=o.at.admin,u=1-cl((S.until-now)/(HOUR*S.hrs),0,1);ctx.save();ctx.strokeStyle=rgbaS(K.gold,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.arc(A.x+A.w-20,A.y+20,9,-Math.PI/2+TP*u,-Math.PI/2+TP);ctx.stroke();ctx.restore();
      pill(ctx,o.lw/2,o.at.storage.y-32,W.alert,K.gold,{align:"center",size:12,max:o.lw-o.m*2});}
    ["storage","settings","restore"].forEach(k=>{const lit=ev||on&&S.on===k;box(ctx,o.at[k],lit?K.bad:K.area,W.pwN[k],null,{glow:lit?12:3});});
    drawShots(ctx,o,now,S);logBox(ctx,o.log,K.plat,W.logT,S.log.length?S.log:[W.logEmpty]);if(on)api.kick(80);};
  return{S,lay,draw,readouts:[[W.read.always,()=>S.where==="every"?W.read.three:W.read.none],[W.read.now,()=>isOn(performance.now())?W.pwN[S.on]:W.read.off]]};};

/* ---------- 5 · People and groups: keys that end with the stay ---------- */
// Who gets into the production workspace (people added by hand, or groups from the directory), how everyone signs in, and whether
// personal tokens are allowed; Ana moves team, Leo joins, a fake page asks for a sign-in, and the token report is read.
PLAY.groups=(Lb,api)=>{const W=Lb.w,S={who:"hand",sign:"pw",tok:true,shots:[],rep:null};
  const r1=api.group(W.whoL);api.seg(r1,W.whos,"hand",k=>{S.who=k;clear(S);api.say(W.msg[k]);api.kick(300);},W.whoL);
  const r2=api.group(W.signL);api.seg(r2,W.signs,"pw",k=>{S.sign=k;clear(S);api.say(W.msg[k]);api.kick(300);},W.signL);
  api.toggle(r2,W.tokT,true,v=>{S.tok=v;S.rep=null;api.say(v?W.msg.tokOn:W.msg.tokOff);api.kick(300);});
  const r3=api.group();
  api.btn(r3,W.anaB,()=>{clear(S);const keep=S.who==="hand";shoot(S,"ana","ws",keep,{good:!keep});api.kick(1400);api.say(keep?W.msg.anaHand:W.msg.anaDir,keep?"no":"ok");if(!keep)api.reach("mover");},"go");
  api.btn(r3,W.leoB,()=>{clear(S);const dir=S.who==="dir";shoot(S,"leo","ws",dir,{good:dir});api.kick(1400);api.say(dir?W.msg.leoDir:W.msg.leoHand,dir?"ok":"warn");if(dir)api.reach("joiner");});
  api.btn(r3,W.fakeB,()=>{clear(S);const pass=S.sign==="pass";shoot(S,"fake","ws",!pass,{good:pass});api.kick(1400);api.say(pass?W.msg.fakePass:W.msg.fakePw,pass?"ok":"no");if(pass)api.reach("fake");});
  api.btn(r3,W.repB,()=>{S.rep=S.tok?7:0;api.kick(300);api.say(S.tok?W.msg.repSome:W.msg.repNone,S.tok?"warn":"ok");if(!S.tok)api.reach("tokens");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["ana","leo","fake"],12,72,120);y=grid(o,["dir","ws"],y+30,104,140);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.person);const dir=S.who==="dir";
    box(ctx,o.at.ana,K.person,W.anaN,W.anaS);box(ctx,o.at.leo,K.person,W.leoN,W.leoS);box(ctx,o.at.fake,K.bad,W.fakeN,W.fakeS);
    box(ctx,o.at.dir,K.plat,W.dirN,dir?W.dirOn:W.dirOff,{a:dir?1:0.6,max:3});
    box(ctx,o.at.ws,K.area,W.wsN,(dir?W.wsDir:W.wsHand)+" "+(S.sign==="pass"?W.wsPass:W.wsPw)+(S.rep!=null?" "+fill(W.wsRep,{n:S.rep}):""),{max:3});
    if(dir){const A=o.at.dir,B=o.at.ws;if(A.y===B.y)arrow(ctx,A.x+A.w+1,A.y+A.h/2,B.x-1,B.y+B.h/2,K.plat,0.8,{head:6});else arrow(ctx,A.x+A.w/2,A.y+A.h+1,B.x+B.w/2,B.y-1,K.plat,0.8,{head:6});}
    drawShots(ctx,o,now,S);};
  return{S,lay,draw,readouts:[[W.read.hand,()=>S.who==="hand"?"214":"0"],[W.read.stale,()=>S.who==="hand"?"19":"0"],[W.read.tok,()=>S.rep==null?"–":String(S.rep)]]};};

/* ---------- 6 · Workloads without secrets: a job that proves who it is ---------- */
// What the nightly job runs as, how its code is deployed, where the student system's one password lives, and whether secret
// scanning watches the repository; five things happen.
PLAY.workload=(Lb,api)=>{const W=Lb.w,S={run:"jun",dep:"laptop",pwd:"settings",scan:false,shots:[],printed:null};
  const r1=api.group(W.runL);api.seg(r1,W.runs,"jun",k=>{S.run=k;clear(S);api.say(W.msg[k]);api.kick(300);},W.runL);
  const r2=api.group(W.depL);api.seg(r2,W.deps,"laptop",k=>{S.dep=k;clear(S);api.say(W.msg[k]);api.kick(300);},W.depL);
  const r3=api.group(W.pwdL);api.seg(r3,W.pwds,"settings",k=>{S.pwd=k;S.printed=null;clear(S);api.say(W.msg[k]);api.kick(300);},W.pwdL);
  api.toggle(r3,W.scanT,false,v=>{S.scan=v;api.say(v?W.msg.scanOn:W.msg.scanOff);});
  const r4=api.group();
  api.btn(r4,W.loadB,()=>{clear(S);shoot(S,"job","plat",true,{good:S.run==="sp"});api.kick(1400);api.say(S.run==="sp"?W.msg.loadSp:W.msg.loadJun,S.run==="sp"?"ok":"warn");if(S.run==="sp")api.reach("own");},"go");
  api.btn(r4,W.depB,()=>{clear(S);const src=S.dep==="oidc"?"gh":"dev";shoot(S,src,"plat",true,{good:S.dep==="oidc"});api.kick(1400);api.say(S.dep==="oidc"?W.msg.depOidc:W.msg.depLaptop,S.dep==="oidc"?"ok":"warn");});
  api.btn(r4,W.forkB,()=>{clear(S);const ok=S.dep!=="oidc";shoot(S,"fork","plat",ok,{good:!ok});api.kick(1400);api.say(ok?W.msg.forkYes:W.msg.forkNo,ok?"no":"ok");if(!ok)api.reach("fork");});
  api.btn(r4,W.pushB,()=>{clear(S);shoot(S,"dev","gh",!S.scan,{good:S.scan});api.kick(1400);api.say(S.scan?W.msg.pushNo:W.msg.pushYes,S.scan?"ok":"no");if(S.scan)api.reach("push");});
  api.btn(r4,W.printB,()=>{clear(S);S.printed=S.pwd;shoot(S,"sis","job",true,{good:S.pwd==="vault"});api.kick(1400);api.say(S.pwd==="vault"?W.msg.printVault:W.msg.printSettings,S.pwd==="vault"?"ok":"no");if(S.pwd==="vault")api.reach("vault");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["dev","gh","fork"],12,72,120);y=grid(o,["job","plat","sis"],y+30,92,120);o.out={x:o.m,y:y+12,w:lw-o.m*2,h:44};o.h=o.out.y+o.out.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.work);
    box(ctx,o.at.dev,K.person,W.devN,S.dep==="laptop"?W.devTok:W.devNone);box(ctx,o.at.gh,K.plat,W.ghN,S.scan?W.ghScan:W.ghPlain);box(ctx,o.at.fork,K.bad,W.forkN,W.forkS);
    box(ctx,o.at.job,S.run==="sp"?K.work:K.gold,W.jobN,S.run==="sp"?W.jobSp:W.jobJun);box(ctx,o.at.plat,K.area,W.platN,W.platS);
    box(ctx,o.at.sis,K.gold,W.sisN,S.pwd==="vault"?W.sisVault:W.sisSettings);
    const O=o.out,pr=S.printed;chip(ctx,O.x,O.y,O.w,O.h,pr==null?W.outIdle:pr==="vault"?W.outVault:W.outSettings,pr==null?K.soft:pr==="vault"?K.good:K.bad,{size:13,a:pr==null?0.6:1});drawShots(ctx,o,now,S);};
  return{S,lay,draw,readouts:[[W.read.secrets,()=>String((S.run==="jun"?1:0)+(S.dep==="laptop"?1:0)+1)],[W.read.copies,()=>S.run==="jun"||S.dep==="laptop"?"3":S.pwd==="vault"?"0":"1"]]};};

/* ---------- 7 · Network, storage and keys: one door to the data ---------- */
// Nine ways to production's files skip the catalog: two account keys, a link signed with one, six people's roles; doors open to the
// internet, a way out to anywhere, and catalogs every workspace sees. Five locks, five tries.
PLAY.tank=(Lb,api)=>{const W=Lb.w,S={keys:false,roles:false,pub:false,pol:false,bind:false,shots:[]},ways=()=>(S.keys?0:3)+(S.roles?0:6);
  const r1=api.group(W.locksL);["keys","roles","pub","pol","bind"].forEach(k=>api.toggle(r1,W.locks[k],false,v=>{S[k]=v;clear(S);api.say(W.msg[k+(v?"On":"Off")]);api.kick(300);}));
  const r2=api.group(W.triesL);
  api.btn(r2,W.tries.around,()=>{clear(S);shoot(S,"keys","files",!S.keys,{good:S.keys});shoot(S,"roles","files",!S.roles,{good:S.roles,delay:150});shoot(S,"cat","files",true,{delay:300});api.kick(1800);
    const n=ways();api.say(n?fill(W.msg.aroundSome,{n}):W.msg.aroundNone,n?"no":"ok");if(!n)api.reach("one");},"go");
  api.btn(r2,W.tries.web,()=>{clear(S);shoot(S,"web","cat",!S.pub,{good:S.pub});api.kick(1400);api.say(S.pub?W.msg.webNo:W.msg.webYes,S.pub?"ok":"no");if(S.pub)api.reach("door");});
  api.btn(r2,W.tries.out,()=>{clear(S);shoot(S,"cat","out",!S.pol,{good:S.pol});api.kick(1400);api.say(S.pol?W.msg.outNo:W.msg.outYes,S.pol?"ok":"no");if(S.pol)api.reach("out");});
  api.btn(r2,W.tries.dev,()=>{clear(S);shoot(S,"dev","cat",!S.bind,{good:S.bind});api.kick(1400);api.say(S.bind?W.msg.devNo:W.msg.devYes,S.bind?"ok":"no");if(S.bind)api.reach("bound");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["keys","roles","web"],12,72,120);y=grid(o,["dev","cat","out"],y+30,72,120);y=grid(o,["files"],y+30,56,120);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);
    box(ctx,o.at.keys,K.gold,W.keysN,S.keys?W.off:W.keysS,{a:S.keys?0.5:1});box(ctx,o.at.roles,K.person,W.rolesN,S.roles?W.rolesOff:W.rolesS,{a:S.roles?0.5:1});
    box(ctx,o.at.web,K.bad,W.webN,S.pub?W.webOff:W.webS);box(ctx,o.at.dev,K.work,W.devN,S.bind?W.devOn:W.devS);
    box(ctx,o.at.cat,K.plat,W.catN,W.catS,{glow:12});box(ctx,o.at.out,K.bad,W.outN,S.pol?W.outOn:W.outS);
    box(ctx,o.at.files,K.area,W.filesN,fill(W.filesS,{n:ways()}));drawShots(ctx,o,now,S);};
  return{S,lay,draw,readouts:[[W.read.ways,()=>fill(W.waysV,{n:ways()})],[W.read.doors,()=>S.pub?"0":"4"]]};};

/* ---------- 8 · From a branch to production: one way in, with a gate ---------- */
// Rules on main (pull requests only, a code owner's yes, the checks), a release approver for production, and actions pinned to a
// commit; a push straight to main, Jun's pull request (sent back, fixed), the deploy, and a moved tag.
PLAY.gate=(Lb,api)=>{const W=Lb.w,S={rules:false,appr:false,pin:false,pr:null,shots:[],stage:{}};
  const r1=api.group(W.rulesL);api.toggle(r1,W.rulesT,false,v=>{S.rules=v;S.pr=null;clear(S);api.say(v?W.msg.rulesOn:W.msg.rulesOff);api.kick(300);});
  api.toggle(r1,W.apprT,false,v=>{S.appr=v;clear(S);api.say(v?W.msg.apprOn:W.msg.apprOff);api.kick(300);});
  api.toggle(r1,W.pinT,false,v=>{S.pin=v;clear(S);api.say(v?W.msg.pinOn:W.msg.pinOff);api.kick(300);});
  const r2=api.group();
  api.btn(r2,W.pushB,()=>{clear(S);S.pr=null;shoot(S,"anyone","main",!S.rules,{good:S.rules});if(!S.rules)shoot(S,"main","prod",true,{good:false,delay:900});api.kick(2000);
    api.say(S.rules?W.msg.pushNo:W.msg.pushYes,S.rules?"ok":"no");if(S.rules)api.reach("nopush");},"go");
  api.btn(r2,W.prB,()=>{clear(S);shoot(S,"branch","pr",true);if(S.rules){S.pr="back";shoot(S,"pr","main",false,{good:true,delay:900});api.say(W.msg.prBack,"warn");}
    else{S.pr="merged";shoot(S,"pr","main",true,{good:false,delay:900});api.say(W.msg.prNoReview,"no");}api.kick(2000);});
  api.btn(r2,W.fixB,()=>{clear(S);if(S.pr!=="back"){api.say(W.msg.fixFirst);return;}S.pr="merged";shoot(S,"branch","pr",true);shoot(S,"pr","main",true,{delay:900});api.kick(2000);api.say(W.msg.fixed,"ok");api.reach("back");});
  api.btn(r2,W.depB,()=>{clear(S);shoot(S,"main","test",true);if(S.appr){shoot(S,"test","prod",true,{delay:2200});api.say(W.msg.depWait,"ok");later(S,2200,()=>{api.say(W.msg.depNoor,"ok");api.reach("noor");});}
    else{shoot(S,"test","prod",true,{good:false,delay:900});api.say(W.msg.depStraight,"warn");}api.kick(3300);});
  api.btn(r2,W.tagB,()=>{clear(S);shoot(S,"action","prod",!S.pin,{good:S.pin});api.kick(1400);api.say(S.pin?W.msg.tagPinned:W.msg.tagMoved,S.pin?"ok":"no");if(S.pin)api.reach("pin");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["anyone","branch","action"],12,72,120);y=grid(o,["pr","main"],y+30,68,130);y=grid(o,["test","prod"],y+30,68,130);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gate);
    box(ctx,o.at.anyone,K.person,W.anyoneN,W.anyoneS);box(ctx,o.at.branch,K.person,W.branchN,S.pr==="back"?W.branchBack:W.branchS);box(ctx,o.at.action,K.bad,W.actionN,S.pin?W.actionPin:W.actionTag);
    box(ctx,o.at.pr,K.plat,W.prN,S.rules?W.prRules:W.prNone);box(ctx,o.at.main,K.plat,W.mainN,S.rules?W.mainRules:W.mainOpen);
    box(ctx,o.at.test,K.area,W.testN,W.testS);box(ctx,o.at.prod,K.gold,W.prodN,S.appr?W.prodAppr:W.prodOpen);drawShots(ctx,o,now,S);};
  return{S,lay,draw,readouts:[[W.read.ways,()=>S.rules?"1":W.read.any],[W.read.yeses,()=>String((S.rules?1:0)+(S.appr?1:0))]]};};

/* ---------- 9 · Who did what: a record nobody in it can change ---------- */
// Four records, each kept in its own system for its own time, or all sent to one store apart and locked for a year; a bell for a
// risky sign-in, a locked copy each night; the review's 90 days, a copied session, a record gone quiet, a restore.
PLAY.record=(Lb,api)=>{const W=Lb.w,R=W.recs,S={apart:false,bell:false,copy:false,ans:null,night:null,quiet:null,rest:null};
  const r1=api.group(W.whereL);api.seg(r1,W.wheres,"each",k=>{S.apart=k==="apart";S.ans=null;S.quiet=null;api.say(W.msg[k]);api.kick(600);},W.whereL);
  const r2=api.group(W.locksL);api.toggle(r2,W.bellT,false,v=>{S.bell=v;S.night=null;api.say(v?W.msg.bellOn:W.msg.bellOff);api.kick(300);});
  api.toggle(r2,W.copyT,false,v=>{S.copy=v;S.rest=null;api.say(v?W.msg.copyOn:W.msg.copyOff);api.kick(300);});
  const r3=api.group();
  api.btn(r3,W.askB,()=>{S.ans=performance.now();api.kick(1400);api.say(S.apart?W.msg.askAll:W.msg.askGone,S.apart?"ok":"no");if(S.apart)api.reach("answer");},"go");
  api.btn(r3,W.nightB,()=>{S.night=S.bell;api.kick(300);api.say(S.bell?W.msg.nightBell:W.msg.nightNone,S.bell?"ok":"no");if(S.bell)api.reach("night");});
  api.btn(r3,W.quietB,()=>{S.quiet=S.apart;api.kick(300);api.say(S.apart?W.msg.quietTold:W.msg.quietNone,S.apart?"ok":"no");if(S.apart)api.reach("quiet");});
  api.btn(r3,W.restB,()=>{S.rest=S.copy;api.kick(300);api.say(S.copy?W.msg.restOk:W.msg.restNone,S.copy?"ok":"no");if(S.copy)api.reach("restore");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};o.bars=12;o.bh=44;let y=o.bars+R.length*(o.bh+6);o.store={x:o.m,y:y+8,w:lw-o.m*2,h:58};y=o.store.y+o.store.h+10;
    y=grid(o,["night","copy"],y,94,140);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const t=eo(since(now,S.ans)/900),lx=o.m+8,lw2=o.lw-o.m*2-16;
    R.forEach((r,i)=>{const y=o.bars+i*(o.bh+6),kept=S.apart?90:r.days,col=kept>=90?K.good:kept>=30?K.gold:K.bad;
      card(ctx,o.m,y,o.lw-o.m*2,o.bh,col,r.name,{glow:3,size:12.5,right:Math.min(150,o.lw*0.36)});
      line1(ctx,S.apart?W.keptApart:r.keep,o.lw-o.m-12-Math.min(150,o.lw*0.36),y+21,Math.min(150,o.lw*0.36),12,{w:600,align:"right",color:rgbaS(K.soft,1)});
      const by=y+o.bh-12,bw=lw2-8;ctx.save();ctx.fillStyle=rgbaS(K.soft,0.18);rr(ctx,lx+4,by,bw,5,2.5);ctx.fill();ctx.fillStyle=rgbaS(col,0.9);const f=Math.min(1,kept/90)*(S.ans!=null?t:1);rr(ctx,lx+4+bw*(1-f),by,bw*f,5,2.5);ctx.fill();ctx.restore();});
    const T2=o.store;card(ctx,T2.x,T2.y,T2.w,T2.h,S.apart?K.good:K.soft,W.storeN,{glow:S.apart?12:3,a:S.apart?1:0.55,size:13.5});
    line1(ctx,S.apart?(S.quiet?W.storeTold:W.storeOn):W.storeOff,T2.x+12,T2.y+42,T2.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    box(ctx,o.at.night,S.night==null?K.soft:S.night?K.good:K.bad,W.nightN,S.night==null?W.nightIdle:S.night?W.nightOk:W.nightNo);
    box(ctx,o.at.copy,S.rest==null?K.soft:S.rest?K.good:K.bad,W.copyN,S.rest==null?(S.copy?W.copyOnS:W.copyOffS):S.rest?W.copyOk:W.copyNo);};
  return{S,lay,draw,readouts:[[W.read.ans,()=>S.ans==null?"–":S.apart?"3 / 3":"1 / 3"],[W.read.bells,()=>String((S.bell?1:0)+(S.apart?1:0))]]};};
const BUILD={play:labPlay};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"lk-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","lk-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"lk-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"lk-tab-"+Lb.id,"aria-controls":"lk-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
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
