/* Learning Data: Only what you may see. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one
   engine: the series' labs page and scenarios page load a film's bundle (for its parts: glass, T, withA, rr, tw), the words
   (learn.en.js or learn.es.js, which set window.OS), and this file. It follows Data that moves' engine, the pilot of the standard.
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
const L=window.OS,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-only-what-you-may-see";
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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/only-what-you-may-see.js)
const MISS=window.OS_MISS=new Set();
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
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab os-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls os-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"os-goals","aria-label":U.goals}),end=h("div",{class:"os-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"os-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"os-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm os-again",onclick:()=>{if(P&&P.S)P.S.dead=true;got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"os-goalbox"},h("p",{class:"os-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"os-foot"},again));}
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

/* ---------- 1 · An agreement first: two papers before any data ---------- */
// Each person's confidentiality agreement and the study's data sharing agreement, then access made from it; a new purpose, a
// member with no promise, and the end date.
PLAY.agree=(Lb,api)=>{const W=Lb.w,C=W.cols,S={dsa:false,promise:false,granted:false,ended:false,shots:[]};
  const r1=api.group(W.papersL);api.toggle(r1,W.promiseT,false,v=>{S.promise=v;clear(S);api.say(v?W.msg.promiseOn:W.msg.promiseOff);api.kick(300);});
  api.toggle(r1,W.dsaT,false,v=>{S.dsa=v;S.granted=false;S.ended=false;clear(S);api.say(v?W.msg.dsaOn:W.msg.dsaOff);api.kick(300);});
  const r2=api.group();
  api.btn(r2,W.grantB,()=>{clear(S);S.ended=false;if(!S.dsa){S.granted=false;shoot(S,"reg","study",false,{good:true});api.say(W.msg.noGrant,"ok");api.reach("nogrant");}
    else{S.granted=true;shoot(S,"reg","study",true);api.say(W.msg.granted,"ok");}api.kick(1500);},"go");
  api.btn(r2,W.elenaB,()=>{clear(S);shoot(S,"elena","study",S.promise,{good:true});api.say(S.promise?W.msg.elenaIn:W.msg.elenaOut,S.promise?"ok":"warn");if(!S.promise)api.reach("promise");api.kick(1400);});
  api.btn(r2,W.namesB,()=>{clear(S);if(!S.granted){api.say(W.msg.grantFirst);return;}shoot(S,"study","fac",false,{good:true});api.say(W.msg.names,"ok");api.reach("purpose");api.kick(1400);});
  api.btn(r2,W.endB,()=>{clear(S);if(!S.granted){api.say(W.msg.grantFirst);return;}S.granted=false;S.ended=true;api.say(W.msg.ended,"ok");api.reach("ends");api.kick(600);});
  const lay=(lw,ctx)=>{const o={lw,m:12,at:{}};let y=grid(o,["reg","elena"],12,92,140);y=grid(o,["study","fac"],y+34,92,140);o.colsY=y+14;
    const f=flow(ctx,C.map(c=>c.n),lw-o.m*2,12.5,6,26);o.chips=f.pos;o.h=o.colsY+22+f.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.area);
    box(ctx,o.at.reg,K.gold,W.regN,W.regS);box(ctx,o.at.elena,K.person,W.elenaN,S.promise?W.elenaSigned:W.elenaNot);
    box(ctx,o.at.study,S.granted?K.good:K.soft,W.studyN,S.ended?W.studyEnded:S.granted?W.studyIn:S.dsa?W.studyReady:W.studyNone,{a:S.granted||S.dsa?1:0.65});
    box(ctx,o.at.fac,K.person,W.facN,W.facS);
    line1(ctx,S.dsa?W.colsT:W.colsNone,o.m,o.colsY+12,o.lw-o.m*2,12.5,{w:700,color:rgbaS(K.soft,1)});
    C.forEach((c,i)=>{const p=o.chips[i];chip(ctx,o.m+p.x,o.colsY+22+p.y,p.w,p.h,c.n,!S.dsa?K.soft:c.ok?K.good:K.bad,{size:12.5,strike:S.dsa&&!c.ok,a:S.dsa?1:0.6});});
    drawShots(ctx,o,now,S);};
  return{S,lay,draw,readouts:[[W.read.grants,()=>S.granted?"1":"0"],[W.read.ends,()=>S.dsa?W.read.date:"–"]]};};

/* ---------- 2 · Know what you hold: a class for every column ---------- */
// The learner table's columns, each with the class the old register gave it; pick a column and give it a class. A scan
// suggests, exam support moves to a table of its own, and a new column comes with no class.
PLAY.classes=(Lb,api)=>{const W=Lb.w,C=W.cols,S={cl:C.map(c=>c.old),pick:0,scan:false,moved:false,newcol:null};
  const ORD=["special","direct","pseud","indirect","none"],RIGHT=()=>C.every((c,i)=>S.cl[i]===c.right);
  const lvl=()=>{const live=C.filter((c,i)=>!(S.moved&&c.k==="support")).map(c=>S.cl[C.indexOf(c)]);return live.includes("special")?"restricted":live.some(x=>x!=="none")?"confidential":"public";};
  const check=()=>{if(RIGHT())api.reach("named");if(S.scan&&S.cl[C.findIndex(c=>c.k==="support")]==="special")api.reach("scan");if(S.moved&&RIGHT()&&lvl()==="confidential")api.reach("support");};
  let segC=null;const r1=api.group(W.colL);api.seg(r1,C.map((c,i)=>[String(i),c.n]),"0",k=>{S.pick=+k;[...segC.children].forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===S.cl[S.pick])));api.kick(300);},W.colL);
  const r2=api.group(W.classL);segC=api.seg(r2,ORD.map(k=>[k,W.cls[k]]),S.cl[0],k=>{S.cl[S.pick]=k;const c=C[S.pick];api.say(fill(k===c.right?W.msg.set:W.msg.setOff,{c:c.n,k:W.cls[k]}),k===c.right?"ok":"warn");check();api.kick(400);},W.classL);
  const r3=api.group();
  api.btn(r3,W.scanB,()=>{S.scan=true;api.say(W.msg.scan);check();api.kick(400);},"go");
  api.btn(r3,W.moveB,()=>{S.moved=!S.moved;api.say(S.moved?fill(W.msg.moved,{l:W.lv[lvl()]}):W.msg.back,S.moved&&lvl()==="confidential"?"ok":"warn");check();api.kick(400);});
  api.btn(r3,W.newB,()=>{S.newcol=performance.now();api.say(W.msg.newcol,"ok");api.reach("stopped");api.kick(1600);});
  const lay=(lw)=>{const o={lw,m:12,at:{}};o.rows=40;o.rh=34;o.h=o.rows+C.length*(o.rh+6)+48+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const L2=lvl();pill(ctx,o.m,10,fill(W.levelV,{l:W.lv[L2]}),L2==="restricted"?K.bad:L2==="confidential"?K.gold:K.good,{size:12.5,max:o.lw-o.m*2});
    C.forEach((c,i)=>{const y=o.rows+i*(o.rh+6),out=S.moved&&c.k==="support",on=i===S.pick,k=S.cl[i],col=k===c.right?K.good:K.bad;
      chip(ctx,o.m,y,o.lw-o.m*2,o.rh,"",on?K.plat:K.soft,{a:out?0.45:1,glow:on?12:2,tint:on?0.14:0.05});
      line1(ctx,c.n,o.m+12,y+o.rh/2+5,o.lw*0.5-o.m-14,13,{w:700});
      const sc=S.scan&&c.scan;pill(ctx,o.lw-o.m-8,y+5,out?W.ownTable:W.cls[k]+(sc?" · "+W.scanned:""),out?K.soft:col,{align:"right",size:12,max:o.lw*0.5-12});});
    const ny=o.rows+C.length*(o.rh+6)+4;if(S.newcol!=null){const t=eo(since(now,S.newcol)/900);chip(ctx,lp(o.lw,o.m,t),ny,o.lw-o.m*2,o.rh,W.newN,K.bad,{size:13,mark:t>=1?"no":null});}
    else line1(ctx,W.newIdle,o.m,ny+22,o.lw-o.m*2,12.5,{w:600,color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.right,()=>C.filter((c,i)=>S.cl[i]===c.right).length+" / "+C.length],[W.read.level,()=>W.lv[lvl()]]]};};

/* ---------- 3 · Show the least that still answers the question ---------- */
// Samuel's row as the study would see it: pick a column, then a way to hide it, and watch the value change. Below, the totals
// the study may publish, and the small count that a sum gives back.
PLAY.least=(Lb,api)=>{const W=Lb.w,C=W.cols,S={way:C.map(c=>c.start),pick:0,pub:false,more:false};
  const way=k=>S.way[C.findIndex(c=>c.k===k)];
  const check=()=>{if(way("num")==="hash")api.reach("follow");if(way("dob")==="gen")api.reach("age");if(way("support")==="out"&&(way("name")==="whole"||way("name")==="out"))api.reach("health");};
  let segW=null;const r1=api.group(W.colL);api.seg(r1,C.map((c,i)=>[String(i),c.n]),"0",k=>{S.pick=+k;const c=C[S.pick];segW.replaceChildren();c.ways.forEach(w=>{const b=h("button",{type:"button","data-k":w,"aria-pressed":String(w===S.way[S.pick]),onclick:()=>{[...segW.children].forEach(x=>x.setAttribute("aria-pressed",String(x===b)));setWay(w);api.refresh();}},W.ways[w]);segW.append(b);});api.kick(300);},W.colL);
  const r2=api.group(W.wayL);segW=api.seg(r2,C[0].ways.map(w=>[w,W.ways[w]]),S.way[0],k=>setWay(k),W.wayL);
  function setWay(k){S.way[S.pick]=k;const c=C[S.pick];api.say(c.say[k],c.best.includes(k)?"ok":"warn");check();api.kick(400);}
  const r3=api.group(W.totalsL);api.toggle(r3,W.moreT,false,v=>{S.more=v;api.say(v?W.msg.moreOn:W.msg.moreOff);api.kick(300);});
  api.btn(r3,W.pubB,()=>{S.pub=true;api.say(S.more?W.msg.pubSafe:W.msg.pubLeak,S.more?"ok":"no");if(S.more)api.reach("totals");api.kick(400);},"go");
  const lay=(lw)=>{const o={lw,m:12,at:{}};o.rows=34;o.rh=34;o.tot=o.rows+C.length*(o.rh+6)+16;o.h=o.tot+34+W.courses.length*24+28;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.person);line1(ctx,W.rowT,o.m,22,o.lw-o.m*2,13,{w:800});const half=o.lw*0.44;
    C.forEach((c,i)=>{const y=o.rows+i*(o.rh+6),on=i===S.pick,w=S.way[i],v=c.v[w];chip(ctx,o.m,y,o.lw-o.m*2,o.rh,"",on?K.plat:K.soft,{glow:on?12:2,tint:on?0.14:0.05});
      line1(ctx,c.n,o.m+12,y+o.rh/2+5,half-o.m-12,12.5,{w:700,color:rgbaS(K.soft,1)});
      line1(ctx,v,half+8,y+o.rh/2+5,o.lw-o.m-half-20,13,{w:800,color:rgbaS(c.best.includes(w)?K.good:K.bad,1)});});
    const y0=o.tot;line1(ctx,W.totalsT,o.m,y0+14,o.lw-o.m*2,13,{w:800});
    W.courses.forEach((r,i)=>{const y=y0+34+i*24,hide=S.pub&&(r[1]<10||S.more&&r[2]),last=i===W.courses.length-1;
      line1(ctx,r[0],o.m+8,y,o.lw*0.6,12.5,{w:last?800:600,color:rgbaS(K.ink,0.95)});
      T(ctx,!S.pub?"–":hide?W.under:String(r[1]),o.lw-o.m-8,y,{w:800,size:13,align:"right",color:rgbaS(hide?K.gold:K.ink,1)});});};
  return{S,lay,draw,readouts:[[W.read.undo,()=>W.undo[way("num")]],[W.read.small,()=>!S.pub?"–":S.more?W.read.no:W.read.yes]]};};

/* ---------- 4 · Grants by design: once, by area and role ---------- */
// Grants made one table at a time by hand, or on shelves to groups; tables owned by whoever made them, or by the owners' group;
// the study's workspace bound read only, or not. New tables arrive, a maker leaves, the study tries to write.
PLAY.shelves=(Lb,api)=>{const W=Lb.w,S={way:"hand",own:"maker",ro:false,shots:[],cred:null,sup:null,left:null};
  const r1=api.group(W.wayL);api.seg(r1,W.ways,"hand",k=>{S.way=k;S.cred=S.sup=null;clear(S);api.say(W.msg[k]);api.kick(300);},W.wayL);
  const r2=api.group(W.ownL);api.seg(r2,W.owns,"maker",k=>{S.own=k;S.left=null;api.say(W.msg[k]);api.kick(300);},W.ownL);
  api.toggle(r2,W.roT,false,v=>{S.ro=v;clear(S);api.say(v?W.msg.roOn:W.msg.roOff);api.kick(300);});
  const r3=api.group();
  api.btn(r3,W.credB,()=>{clear(S);S.cred=S.way;const ok=S.way==="shelf";shoot(S,"office","core",ok,{good:ok});shoot(S,"desk","core",ok,{good:ok,delay:150});api.say(ok?W.msg.credShelf:W.msg.credHand,ok?"ok":"warn");if(ok)api.reach("tomorrow");api.kick(1600);},"go");
  api.btn(r3,W.supB,()=>{clear(S);S.sup=S.way;const ok=S.way==="shelf";shoot(S,"desk","sup",!ok,{good:ok});shoot(S,"exams","sup",true,{good:true,delay:150});api.say(ok?W.msg.supShelf:W.msg.supHand,ok?"ok":"no");if(ok)api.reach("support");api.kick(1600);});
  api.btn(r3,W.leaveB,()=>{S.left=S.own;api.say(S.own==="group"?W.msg.leaveGroup:W.msg.leaveMaker,S.own==="group"?"ok":"no");if(S.own==="group")api.reach("owner");api.kick(300);});
  api.btn(r3,W.writeB,()=>{clear(S);shoot(S,"study","core",!S.ro,{good:S.ro});api.say(S.ro?W.msg.writeNo:W.msg.writeYes,S.ro?"ok":"no");if(S.ro)api.reach("readonly");api.kick(1400);});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["office","desk","exams","study"],12,64,120);y=grid(o,["core","sup"],y+34,92,140);o.h=y+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const sh=S.way==="shelf";
    box(ctx,o.at.office,K.person,W.officeN,W.officeS);box(ctx,o.at.desk,K.person,W.deskN,W.deskS);box(ctx,o.at.exams,K.person,W.examsN,W.examsS);box(ctx,o.at.study,K.work,W.studyN,S.ro?W.studyRo:W.studyRw);
    box(ctx,o.at.core,K.area,sh?W.coreShelf:W.coreHand,(S.cred?W.coreCred+" ":"")+(S.left?(S.left==="group"?W.ownedGroup:W.ownedNone):sh?W.coreReaders:W.coreGrants),{max:3});
    box(ctx,o.at.sup,K.bad,sh?W.supShelf:W.supHand,S.sup?(sh?W.supOwn:W.supOpen):W.supIdle,{a:S.sup?1:0.6,max:3});drawShots(ctx,o,now,S);};
  return{S,lay,draw,readouts:[[W.read.grants,()=>S.way==="hand"?"163":"9"],[W.read.wait,()=>S.way==="hand"?W.read.six:W.read.none],[W.read.orphan,()=>S.own==="maker"?"9":"0"]]};};

/* ---------- 5 · Tags that travel: a class set once, carried everywhere ---------- */
// Mei's classes written in the project and set as tags after each build; propagation through lineage; where the learner code is
// made; and downloads in the studies' workspace. The study's copy is made, the code is made in the copy, a file is downloaded.
PLAY.tags=(Lb,api)=>{const W=Lb.w,C=W.cols,S={dbt:false,prop:false,src:false,dl:true,built:false,copy:null,conflict:null,file:null};
  const r1=api.group(W.setL);api.toggle(r1,W.dbtT,false,v=>{S.dbt=v;S.built=false;api.say(v?W.msg.dbtOn:W.msg.dbtOff);api.kick(300);});
  api.toggle(r1,W.propT,false,v=>{S.prop=v;S.copy=null;api.say(v?W.msg.propOn:W.msg.propOff);api.kick(300);});
  api.toggle(r1,W.srcT,false,v=>{S.src=v;S.conflict=null;api.say(v?W.msg.srcOn:W.msg.srcOff);api.kick(300);});
  api.toggle(r1,W.dlT,true,v=>{S.dl=v;S.file=null;api.say(v?W.msg.dlOn:W.msg.dlOff);api.kick(300);});
  const r2=api.group();
  api.btn(r2,W.buildB,()=>{S.built=S.dbt;S.copy=null;api.say(S.dbt?W.msg.built:W.msg.buildNone,S.dbt?"ok":"warn");if(S.dbt)api.reach("written");api.kick(600);},"go");
  api.btn(r2,W.copyB,()=>{S.copy={t:performance.now(),tags:S.built&&S.prop};api.kick(1600);
    api.say(!S.built?W.msg.copyNoSrc:S.prop?W.msg.copyTags:W.msg.copyBare,S.built&&S.prop?"ok":"no");if(S.built&&S.prop)api.reach("travel");});
  api.btn(r2,W.codeB,()=>{S.conflict=!S.src;api.kick(400);api.say(S.src?W.msg.codeSrc:W.msg.codeConflict,S.src?"ok":"warn");if(S.src)api.reach("source");});
  api.btn(r2,W.fileB,()=>{S.file=performance.now();api.kick(1400);api.say(S.dl?W.msg.fileOut:W.msg.fileNo,S.dl?"no":"ok");if(!S.dl)api.reach("stays");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};o.src={x:o.m,y:12,w:lw-o.m*2,h:34+C.length*28+8};o.cp={x:o.m,y:o.src.y+o.src.h+30,w:lw-o.m*2,h:34+C.length*28+8+20};o.file={x:o.m,y:o.cp.y+o.cp.h+14,w:lw-o.m*2,h:46};o.h=o.file.y+o.file.h+12;return o;};
  const tagCol=k=>k==="special"||k==="direct"?K.bad:k==="pseud"?K.work:k==="indirect"?K.gold:K.soft;
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.work);const A=o.src;card(ctx,A.x,A.y,A.w,A.h,K.area,W.srcN,{glow:6,size:13.5});
    C.forEach((c,i)=>{const y=A.y+34+i*28;line1(ctx,c.n,A.x+12,y+15,A.w*0.45,12.5,{w:700});if(S.built&&c.k!=="none")pill(ctx,A.x+A.w-10,y,W.tag[c.k],tagCol(c.k),{align:"right",size:12,max:A.w*0.5});});
    arrow(ctx,o.lw/2,A.y+A.h+4,o.lw/2,o.cp.y-4,K.soft,0.7,{head:6,dash:[4,4]});
    const B=o.cp,cp=S.copy;card(ctx,B.x,B.y,B.w,B.h,cp?(cp.tags?K.good:K.bad):K.soft,W.cpN,{glow:cp?10:3,a:cp?1:0.55,size:13.5});
    if(cp){const t=cl(since(now,cp.t)/1200,0,1);W.cpCols.forEach((c,i)=>{const y=B.y+34+i*28;line1(ctx,c.n,B.x+12,y+15,B.w*0.45,12.5,{w:700});
        let k=c.k;if(c.code&&S.conflict)k="conflict";if(cp.tags&&k!=="none")withA(ctx,t,()=>pill(ctx,B.x+B.w-10,y,k==="conflict"?W.tag.special+" · "+W.conflictN:W.tag[k],k==="conflict"?K.bad:tagCol(k),{align:"right",size:12,max:B.w*0.52}));});
      line1(ctx,cp.tags?W.cpPolicy:W.cpBare,B.x+12,B.y+B.h-10,B.w-24,12.5,{w:600,color:rgbaS(cp.tags?K.good:K.bad,1)});}
    else line1(ctx,W.cpIdle,B.x+12,B.y+44,B.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    const F=o.file,fl=S.file!=null;chip(ctx,F.x,F.y,F.w,F.h,fl?(S.dl?W.fileOut:W.fileNo):W.fileIdle,fl?(S.dl?K.bad:K.good):K.soft,{size:13,a:fl?1:0.6,dash:true});};
  return{S,lay,draw,readouts:[[W.read.tagged,()=>S.built?"4 / 7":"0 / 7"],[W.read.copy,()=>!S.copy?"–":S.copy.tags?W.read.yes:W.read.no]]};};

/* ---------- 6 · One policy for many tables: protected the day they appear ---------- */
// Masks written by hand table by table, or one policy for each class on the catalog; a reader picked; a new table, one with no
// level, and older compute.
PLAY.policy=(Lb,api)=>{const W=Lb.w,R=W.readers,S={way:"hand",who:0,seen:new Set(),newT:null,nolevel:null,old:null};
  const r1=api.group(W.wayL);api.seg(r1,W.ways,"hand",k=>{S.way=k;S.newT=S.nolevel=S.old=null;S.seen=new Set();api.say(W.msg[k]);api.kick(300);},W.wayL);
  const r2=api.group(W.whoL);api.seg(r2,R.map((r,i)=>[String(i),r.n]),"0",k=>{S.who=+k;if(S.way==="pol"){S.seen.add(S.who);if(S.seen.size===R.length)api.reach("reader");}api.say(S.way==="pol"?R[S.who].say:W.msg.handReader);api.kick(300);},W.whoL);
  const r3=api.group();
  api.btn(r3,W.newB,()=>{S.newT=S.way;S.nolevel=null;api.kick(500);api.say(S.way==="pol"?W.msg.newPol:W.msg.newHand,S.way==="pol"?"ok":"no");if(S.way==="pol")api.reach("first");},"go");
  api.btn(r3,W.nolevelB,()=>{S.nolevel=S.way;S.newT=null;api.kick(500);api.say(S.way==="pol"?W.msg.nolevelPol:W.msg.nolevelHand,S.way==="pol"?"ok":"no");if(S.way==="pol")api.reach("nolevel");});
  api.btn(r3,W.oldB,()=>{if(S.way!=="pol"){api.say(W.msg.oldHand,"warn");return;}S.old=S.way;api.kick(500);api.say(S.way==="pol"?W.msg.oldPol:W.msg.oldHand,S.way==="pol"?"ok":"no");if(S.way==="pol")api.reach("compute");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};o.t={x:o.m,y:12,w:lw-o.m*2,h:34+W.cols.length*28+10};o.h=o.t.y+o.t.h+60;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const A=o.t,pol=S.way==="pol",r=R[S.who],fresh=S.newT!=null,nl=S.nolevel!=null;
    const title=(fresh||nl?W.newN:W.oldN)+" · "+r.n;card(ctx,A.x,A.y,A.w,A.h,pol?K.good:K.bad,title,{glow:8,size:13.5});
    W.cols.forEach((c,i)=>{const y=A.y+34+i*28;line1(ctx,c,A.x+12,y+15,A.w*0.42,12.5,{w:700,color:rgbaS(K.soft,1)});
      let v;if(nl&&pol)v=r.builder?r.v[i]:W.noRows;else if(old())v=W.refused;else if(!pol&&(fresh||nl))v=W.raw[i];else if(!pol)v=r.hand[i];else v=r.v[i];
      line1(ctx,v,A.x+A.w*0.45,y+15,A.w*0.55-14,13,{w:800,color:rgbaS(v===W.raw[i]?K.bad:K.ink,1)});});
    function old(){return S.old!=null&&S.old==="pol";}
    line1(ctx,pol?W.polNote:W.handNote,o.m,A.y+A.h+24,o.lw-o.m*2,12.5,{w:600,color:rgbaS(pol?K.good:K.gold,1)});};
  return{S,lay,draw,readouts:[[W.read.masks,()=>S.way==="hand"?"140":"5"],[W.read.wait,()=>S.way==="hand"?W.read.later:W.read.none]]};};

/* ---------- 7 · Copies that keep the rules: protected, or not made ---------- */
// Four copies asked for this autumn; pick how each is made, then make it, and see what leaves the catalog's rules.
PLAY.copies=(Lb,api)=>{const W=Lb.w,Q=W.asks,S={pick:Q.map(()=>0),done:Q.map(()=>null),shots:[]};
  Q.forEach((q,i)=>{const r=api.group(q.name);api.seg(r,q.choices.map((x,j)=>[String(j),x.t]),"0",k=>{S.pick[i]=+k;},q.name);
    api.btn(r,q.go,()=>{clear(S);const x=q.choices[S.pick[i]];S.done[i]=S.pick[i];shoot(S,"rec","d"+i,x.fine,{good:x.fine});api.say(x.say,x.fine?"ok":"no");if(x.fine)api.reach(q.k);api.kick(1500);},"go");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};let y=grid(o,["rec"],12,58,200);grid(o,Q.map((q,i)=>"d"+i),y+40,96,130);o.h=o.at["d"+(Q.length-1)].y+96+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.area);box(ctx,o.at.rec,K.gold,W.recN,W.recS);
    Q.forEach((q,i)=>{const d=S.done[i],x=d==null?null:q.choices[d];box(ctx,o.at["d"+i],x==null?K.soft:x.fine?K.good:K.bad,q.who,x==null?W.idle:x.got,{a:x==null?0.65:1,max:3});});drawShots(ctx,o,now,S);};
  return{S,lay,draw,readouts:[[W.read.kept,()=>String(S.done.filter((d,i)=>d!=null&&Q[i].choices[d].fine).length)+" / "+Q.length]]};};

/* ---------- 8 · Proof it held: read from records, not memory ---------- */
// Four promises of the agreement, each proved from a record: the access review, the morning check for gaps, lineage and the
// audit log, and the end date.
PLAY.proof=(Lb,api)=>{const W=Lb.w,S={rev:null,elena:true,gap:null,classed:false,reads:null,ended:false,checked:null};
  const r1=api.group(W.whoL);api.btn(r1,W.revB,()=>{S.rev=true;api.kick(400);api.say(S.elena?W.msg.revFound:W.msg.revClean,S.elena?"warn":"ok");if(!S.elena)api.reach("who");},"go");
  api.btn(r1,W.removeB,()=>{if(!S.rev){api.say(W.msg.revFirst);return;}S.elena=false;api.kick(400);api.say(W.msg.removed,"ok");api.reach("who");});
  const r2=api.group(W.neverL);api.btn(r2,W.checkB,()=>{S.gap=true;api.kick(400);api.say(S.classed?W.msg.checkClean:W.msg.checkGap,S.classed?"ok":"warn");});
  api.btn(r2,W.classB,()=>{if(!S.gap){api.say(W.msg.checkFirst);return;}S.classed=true;api.kick(400);api.say(W.msg.classed,"ok");api.reach("gap");});
  api.btn(r2,W.readsB,()=>{if(!S.gap){api.say(W.msg.checkFirst);return;}S.reads=true;api.kick(400);api.say(W.msg.reads,"ok");api.reach("reads");});
  const r3=api.group(W.endsL);api.btn(r3,W.endB,()=>{S.ended=true;api.kick(400);api.say(W.msg.ended);});
  api.btn(r3,W.julyB,()=>{if(!S.ended){api.say(W.msg.notYet,"warn");return;}S.checked=true;api.kick(400);api.say(W.msg.checked,"ok");api.reach("ends");});
  const lay=(lw)=>{const o={lw,m:12,at:{}};grid(o,["who","never","where","ends"],12,112,140);const L2=o.at.ends;o.h=L2.y+L2.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);
    const st={who:S.rev?(S.elena?"gap":"ok"):"open",never:S.gap?(S.classed?(S.reads?"ok":"half"):"gap"):"open",where:S.reads?"ok":"open",ends:S.checked?"ok":S.ended?"half":"open"};
    ["who","never","where","ends"].forEach(k=>{const s=st[k],col=s==="ok"?K.good:s==="gap"?K.bad:s==="half"?K.gold:K.soft;
      box(ctx,o.at[k],col,W.prom[k],W.stat[k][s],{a:s==="open"?0.7:1,max:3,mark:s==="ok"?"ok":s==="gap"?"no":null});});};
  return{S,lay,draw,readouts:[[W.read.proved,()=>String([S.rev&&!S.elena,S.classed,S.reads,S.checked].filter(Boolean).length)+" / 4"],[W.read.group,()=>S.ended?"0":S.elena?"2":"1"]]};};
const BUILD={play:labPlay};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"os-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","os-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"os-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"os-tab-"+Lb.id,"aria-controls":"os-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
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

