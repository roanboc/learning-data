/* Learning Data: Data management. The labs (Take it apart) and the scenarios (Make the call) of the module's four series, from one
   engine: each series' labs page and scenarios page load a film's bundle (for its parts: glass, T, withA, rr, tw), the series' words
   (site/assets/<series>/learn.en.js or learn.es.js, which set window.DM), and this file.
   Every lab is a decision playground (kind "play"), one for each film, as the author set on 18 November 2026: the visitor makes a
   manager's choices, then plays them out over weeks or months, and watches what follows, step by step. Each playground has three to
   five experiments (w.goals), each ticked when a run reaches it, and its end once all are ticked. Each playground's rules are in
   MODEL below, its words in its series' pack.
   The scenarios are each series' evaluation, every one a choice, its options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its words stay
   big enough to read on a phone. A run moves one step at a time, or jumps to its end when the visitor asks for reduced motion, and
   every event is also said in words (.lab-say) and kept in the run's log, so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films), both from
   site-tools/build_series.py. Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments)
   and "quiz" (answers by scenario number); path.js paints the course bar. Pilot: Data that moves (site/assets/data-that-moves/). */
(()=>{"use strict";
const L=window.DM,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-data-management";
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
// the module's colours: ink, soft ink, right, wrong, gold, and the films' own: blue is plans and design, orange is data, green is done
const K={ink:[236,243,255],soft:[160,178,205],good:[120,240,170],bad:[255,112,100],gold:[255,209,102],plan:[120,190,255],data:[255,166,92],done:[120,226,160]};
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


/* ---------- play: a decision playground, played out step by step ---------- */
// Every playground is a decision, played out over weeks or months. MODEL[id] holds its rules: its choices (ctl: [kind, key,
// default], kind "seg" or "toggle", their words in w.ctl[key]), its steps (n, named by w.stepL or w.stepNames), its measures
// (m: [[key, max, ref, min]], their words in w.m[key]: name and fmt), and run(S), which plays the choices out and gives
// {v: {key: [the value at each step, 0 to n]}, ev: [[step, key, tone, vars]], end: key, tone, reach: [experiments]}.
// The words of each event are in w.ev[key], of each ending in w.res[key]. A run plays one step at a time: the measures draw their
// lines, each event is said and written in the log as it happens, and the ending ticks the experiments it reached. Changing a
// choice puts the playground back at its start, so each run is one set of choices; Start again also clears the ticks.
const MODEL={},STEP=n=>cl(6400/n,260,560),TONE={ok:"good",warn:"gold",no:"bad"};
const numS=v=>{const r=Math.round(v*10)/10,a=Math.abs(r).toLocaleString(L.lang==="es"?"es-ES":"en-AU");return(r<0?"−":"")+a;};
const fmtV=(f,v)=>fill(f,{v:typeof v==="number"?numS(v):v});
function labWeeks(Lb){const W=Lb.w,G=W.goals,M=MODEL[Lb.id],N=M.n,box=h("div",{class:"lab dm-lab",style:"--c:"+Lb.c,"data-running":"0"}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls dm-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"dm-goals"}),end=h("div",{class:"dm-endbox"}),log=h("ol",{class:"dm-log","aria-label":U.log});
  const S={};let R=null,R0=null,at=-1,timers=[],st=null,runB=null,last=null;
  const stepName=i=>W.stepNames?W.stepNames[i]:fill(W.stepL,{n:i});
  const evText=e=>fill(W.ev[e[1]]||e[1],e[3]||{});
  const sayIt=(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));};
  const val=(k,i)=>{const r=R&&at>=0?R:R0;return r.v[k][Math.max(0,Math.min(i,N))];};
  function paintRead(){read.replaceChildren(...M.m.map(([k])=>h("span",null,W.m[k].name+":",h("b",null,fmtV(W.m[k].fmt,val(k,at<0?0:at))))));}
  function reach(k){if(got.has(k)||!G.some(g=>g[0]===k))return false;got.add(k);all[Lb.id]=[...got];put("goals",all);return true;}
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"dm-end"},...rich(W.end))]:[]));
    (just||[]).forEach(k2=>{const g=G.find(x=>x[0]===k2);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));});
    if(just&&just.length&&done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function halt(){timers.forEach(clearTimeout);timers=[];box.dataset.running="0";if(runB)runB.disabled=false;}
  function reset(){halt();R=null;at=-1;last=null;R0=M.run(Object.assign({},S));log.replaceChildren();paintRead();if(st)st.kick(0);}
  function addLog(e){const t=evText(e);last={t,tone:e[2]};log.append(h("li",{class:e[2]||""},h("b",null,stepName(e[0])+" · "),t));sayIt(stepName(e[0])+": "+t,e[2]);}
  function finish(){halt();const tone=R.tone||"ok";sayIt(fill(W.res[R.end]||R.end,R.vars||{}),tone);const just=(R.reach||[]).filter(reach);paintGoals(just);paintRead();if(st)st.kick(900);}
  function play(){halt();R=M.run(Object.assign({},S));at=0;last=null;log.replaceChildren();box.dataset.running="1";if(runB)runB.disabled=true;
    const dt=RM()?0:STEP(N);sayIt(W.running);paintRead();
    for(let i=1;i<=N;i++){const f=()=>{at=i;R.ev.filter(e=>e[0]===i).forEach(addLog);paintRead();if(st)st.kick(dt+200);if(i===N)finish();};if(dt)timers.push(setTimeout(f,i*dt));else f();}}
  // the picture: a line for each measure across the steps, the events as dots on the steps, and the latest event in words
  const COLS=[K.plan,K.data,K.done];
  const lay=(lw)=>{const m=12,o={lw,m,x0:m+10,x1:lw-m-10};o.bands=M.m.map((x,i)=>({y:40+i*64,h:58}));const y=40+M.m.length*64;o.axis=y+12;o.cap={y:o.axis+34,h:4*17+22};o.h=o.cap.y+o.cap.h+12;return o;};
  const X=(o,i)=>lp(o.x0,o.x1,i/N);
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,COLS[0]);const a=at<0?0:at,on=at>=0;
    line1(ctx,on?stepName(a):W.stepNames?stepName(0):fill(W.stepL,{n:0}),o.m+4,26,o.lw*0.55,14,{w:800,color:rgbaS(K.ink,0.95)});
    pill(ctx,o.lw-o.m,10,!on?U.ready:at<N?U.playing:U.over,!on?K.soft:at<N?K.plan:K.done,{align:"right",size:12,max:o.lw*0.4});
    M.m.forEach(([k,max,ref,min],i)=>{min=min||0;const b=o.bands[i],col=COLS[i%3],mw=W.m[k];glass(ctx,o.m,b.y,o.lw-o.m*2,b.h,10,col,{glow:4,ea:0.6,fill:"rgba(7,12,24,0.9)"});
      const vs=fmtV(mw.fmt,val(k,a)),vw=Math.min(o.lw*0.42,TW(ctx,vs,14)+4);line1(ctx,mw.name,o.m+10,b.y+18,o.lw-o.m*2-24-vw,12.5,{w:700,color:rgbaS(mixC(col,K.ink,0.35),1)});
      line1(ctx,vs,o.lw-o.m-10-vw,b.y+18,vw,14,{w:800,align:"right",color:rgbaS(K.ink,1)});
      const cy0=b.y+b.h-8,ch=b.h-32,Y=v=>cy0-cl((v-min)/(max-min),0,1)*ch;
      if(ref!=null){ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle=rgbaS(K.gold,0.75);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(o.x0,Y(ref));ctx.lineTo(o.x1,Y(ref));ctx.stroke();ctx.restore();}
      ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.25);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(o.x0,cy0);ctx.lineTo(o.x1,cy0);ctx.stroke();ctx.restore();
      const r=on?R:R0,vv=r.v[k];ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=2.6;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();
      for(let j=0;j<=a;j++){const x=X(o,j),y=Y(vv[j]);if(j)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.stroke();
      ctx.fillStyle=rgbaS(col,1);ctx.beginPath();ctx.arc(X(o,a),Y(vv[a]),4.5,0,TP);ctx.fill();ctx.restore();});
    // the steps, and the events so far
    ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.5);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(o.x0,o.axis);ctx.lineTo(o.x1,o.axis);ctx.stroke();
    for(let j=0;j<=N;j++){const x=X(o,j);ctx.beginPath();ctx.moveTo(x,o.axis-3);ctx.lineTo(x,o.axis+3);ctx.stroke();}ctx.restore();
    if(on){const per={};R.ev.forEach(e=>{if(e[0]>a)return;const j=per[e[0]]=(per[e[0]]||0)+1,x=X(o,e[0]),y=o.axis-4-j*9;
      ctx.save();ctx.fillStyle=rgbaS(K[TONE[e[2]]||"soft"],1);ctx.beginPath();ctx.arc(x,y,3.6,0,TP);ctx.fill();ctx.restore();});
      if(at<N){const x=X(o,a);ctx.save();ctx.strokeStyle=rgbaS(K.ink,0.45);ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(x,40);ctx.lineTo(x,o.axis);ctx.stroke();ctx.restore();}}
    const n0=W.stepNames?stepName(0):fill(W.stepL,{n:0}),nN=stepName(N);
    T(ctx,n0,o.x0-4,o.axis+18,{w:600,size:12,align:"left",color:rgbaS(K.soft,1)});T(ctx,nN,o.x1+4,o.axis+18,{w:600,size:12,align:"right",color:rgbaS(K.soft,1)});
    // the latest event, or the ending, in words
    const C=o.cap,fin=on&&at>=N&&R,txt=fin?fill(W.res[R.end]||"",R.vars||{}):last?last.t:on?W.running:U.idle,tc=fin?K[TONE[R.tone||"ok"]]:last?K[TONE[last.tone]||"soft"]:K.soft;
    glass(ctx,o.m,C.y,o.lw-o.m*2,C.h,12,tc,{glow:fin?12:5,ea:0.8,fill:"rgba(7,12,24,0.94)"});
    lines(ctx,txt.replace(/<\/?b>/g,""),o.m+12,C.y+22,o.lw-o.m*2-24,{size:13.5,max:4,w:650});};
  function build(){ctrl.replaceChildren();halt();Object.keys(S).forEach(k=>delete S[k]);M.ctl.forEach(([,key,d])=>S[key]=d);
    M.ctl.forEach(([kind,key,d])=>{const c=W.ctl[key],row=h("div",{class:"dm-row"});
      if(kind==="seg"){row.append(h("span",{class:"lbl"},c.label));const g=h("div",{class:"seg",role:"group","aria-label":c.label});
        c.opts.forEach(([k2,l])=>{const b=h("button",{type:"button","data-k":k2,"aria-pressed":k2===d?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));S[key]=k2;reset();sayIt(fill(U.set,{c:c.label,o:l}));}},l);g.append(b);});row.append(g);}
      else{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":d?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));S[key]=v;reset();sayIt(fill(v?U.setOn:U.setOff,{c:c.label}));}},c.label);row.append(b);}
      ctrl.append(row);});
    runB=h("button",{type:"button",class:"chip-btn go dm-play",onclick:play},W.playB);ctrl.append(h("div",{class:"dm-row"},runB));
    R0=M.run(Object.assign({},S));R=null;at=-1;last=null;log.replaceChildren();
    st=DRAW?stage(lay,draw,W.alt||Lb.name):null;paintRead();
    const again=h("button",{type:"button",class:"chip-btn sm dm-again",onclick:()=>{halt();got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();sayIt(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"dm-goalbox"},h("p",{class:"dm-gh"},U.goals),list),ctrl,read,say,h("details",{class:"dm-logbox"},h("summary",null,U.log),log),end,h("div",{class:"dm-foot"},again));}
  build();sayIt(W.start);paintGoals();return box;}

// a run's helpers: a measure's values step by step (f gives each step's value from the one before), and the events of a run
const series=(n,v0,f)=>{const out=[v0];for(let i=1;i<=n;i++)out.push(f(out[i-1],i));return out;};
const clampAll=(a,lo,hi)=>a.map(v=>cl(v,lo,hi));

/* ---------- A plan in ninety days ---------- */
// 1 · Every area, one job: Helena's first twelve weeks, with 46 open requests. Where she starts, who each request goes to, when the
// team's procedures change, and whether everyone waiting hears where their request stands.
MODEL.lanes={n:12,ctl:[["seg","start","old"],["seg","route","me"],["seg","chg","day1"],["toggle","tell",false]],m:[["done",46,46],["silent",46],["rate",6]],
 run(S){const ev=[],base=S.route==="deep"?4:2,pen=S.start==="wheel"?0:1;
  const rate=i=>{if(S.start==="wheel"&&i===1)return 0;let r=Math.max(1,base-pen);if(S.chg==="day1"&&i<=4)r=Math.max(1,Math.floor(r/2));if(S.chg==="wk6"&&i>=9)r+=1;return r;};
  const rt=series(12,0,(p,i)=>rate(i)),done=series(12,0,(p,i)=>Math.min(46,p+rate(i))),silent=done.map((d,i)=>S.tell&&i>=1?0:46-d);
  ev.push([1,S.start==="wheel"?"sorted":S.start==="old"?"oldest":"loudest",S.start==="wheel"?"ok":"warn"]);
  ev.push([2,S.route==="deep"?"deep":"bottle",S.route==="deep"?"ok":"warn"]);
  if(S.chg==="day1")ev.push([2,"day1","no"]);if(S.chg==="wk6"){ev.push([6,"wk6","ok"]);ev.push([9,"test","ok"]);}if(S.chg==="never")ev.push([10,"never","warn"]);
  ev.push(S.tell?[1,"page","ok"]:[4,"chase","warn"]);if(S.start==="loud")ev.push([6,"aug","no"]);
  const w=done.findIndex(d=>d>=46);if(w>0)ev.push([w,"all","ok"]);
  const all=done[12]>=46,reach=[];if(all)reach.push("all");if(S.tell)reach.push("word");if(S.chg!=="day1")reach.push("running");if(S.start==="loud")reach.push("loud");
  const end=all&&S.tell&&S.chg!=="day1"?"best":S.chg==="day1"?"broke":all?"quiet":"short";
  return{v:{done,silent,rate:rt},ev,end,tone:end==="best"?"ok":"warn",vars:{n:done[12]},reach};}};

// 2 · Listen first: six weeks of listening. Who she asks, whether she asks everyone the same questions, whether she also counts
// from the systems, and whether she sends what she heard back to the people she asked.
MODEL.listen={n:6,ctl:[["seg","who","few"],["seg","q","free"],["toggle","count",false],["toggle","back",false]],m:[["talks",31],["opps",7,7],["recog",100]],
 run(S){const ev=[],all=S.who==="all",per=all?[0,5,5,5,6,5,5]:[0,2,2,2,2,2,2],talks=series(6,0,(p,i)=>p+per[i]);
  const talk=all&&S.q==="same"?5:all||S.q==="same"?3:2,opps=series(6,0,(p,i)=>{let n=Math.min(talk,Math.round(talk*Math.max(0,i-1)/5));if(S.count&&i>=4)n+=2;return n;});
  const fin=S.back?(all?92:50):(all?68:40),recog=series(6,0,(p,i)=>i<6?0:fin);
  ev.push([1,all?"wide":"narrow",all?"ok":"warn"]);ev.push([2,S.q==="same"?"same":"free",S.q==="same"?"ok":"warn"]);
  ev.push([3,all?"mei":"unseen",all?"ok":"warn"]);ev.push([4,S.count?"count":"howmuch",S.count?"ok":"warn"]);ev.push([6,S.back?"back":"noback",S.back?"ok":"warn"]);
  const reach=[];if(opps[6]>=7)reach.push("seven");if(recog[6]>=90)reach.push("recognise");if(S.count)reach.push("count");if(all)reach.push("works");
  const end=opps[6]>=7&&recog[6]>=90?"best":"part";return{v:{talks,opps,recog},ev,end,tone:end==="best"?"ok":"warn",vars:{n:opps[6],r:recog[6]},reach};}};

// 3 · Design it simple: the first eight weeks of the design, as it runs. Who builds, how many copies of the staff list, how people
// ask, and who reviews a change.
MODEL.design={n:8,ctl:[["seg","who","central"],["seg","copy","many"],["seg","door","many"],["seg","rev","team"]],m:[["days",45],["clash",12],["wait",6,2]],
 run(S){const ev=[],tgt=(S.who==="central"?41:S.who==="edge"?10:14)+(S.door==="many"?6:0),days=series(8,41,(p)=>p+(tgt-p)*0.45);
  const copies=S.copy==="many"||S.who==="edge",clash=series(8,3,(p,i)=>copies?p+1:Math.max(0,p-1)),wait=series(8,0,(p,i)=>i<3?0:S.rev==="team"?4:1.5);
  ev.push([1,S.who==="central"?"queue":S.who==="edge"?"edges":"hub",S.who==="hub"?"ok":"warn"]);ev.push([2,S.door==="many"?"lost":"form",S.door==="many"?"warn":"ok"]);
  ev.push([3,S.rev==="team"?"anil":"rota",S.rev==="team"?"no":"ok"]);ev.push([4,copies?"three":"onelist",copies?"no":"ok"]);
  if(S.who==="edge")ev.push([6,"edgefast","warn"]);if(S.who==="central")ev.push([6,"slow","warn"]);
  const fast=days[8]<=18,agree=clash[8]===0,rev=S.rev==="named",reach=[];if(fast)reach.push("fast");if(agree)reach.push("agree");if(rev)reach.push("review");if(fast&&agree&&rev)reach.push("simple");
  const end=fast&&agree&&rev?"best":S.who==="edge"?"edge":S.who==="central"?"central":"almost";return{v:{days,clash,wait},ev,end,tone:end==="best"?"ok":"warn",reach};}};

// 4 · From gaps to a roadmap: May 2027 to December 2028. In what order the work goes, how the old warehouse's reports move, and
// whether the money stops part way: would people still have something they use?
MODEL.stages={n:20,ctl:[["seg","ord","loud"],["seg","move","half"],["seg","stop","never"]],m:[["use",8,null],["two",12],["lic",310]],
 run(S){const ev=[],unl=S.ord==="unlock",whole=S.move==="whole",cut=S.stop==="sep"?5:S.stop==="mar"?11:99;
  // when each thing people use arrives: the door, the list, the measures page, three partners, one platform, products owned, mandates, seven partners
  const when=unl?[2,3,3,5,whole?8:99,11,11,20]:[6,7,7,9,whole?8:99,13,13,20],got=i=>when.filter(w=>w<=Math.min(i,cut)).length;
  const use=series(20,0,(p,i)=>got(i)),retired=whole&&cut>8;
  const two=series(20,0,(p,i)=>!whole&&i>=3&&i<=Math.min(cut,99)?(i<=5?Math.round((i-2)*10/3):10):0);
  const lic=series(20,310,(p,i)=>retired&&i>8?0:310);
  if(unl){ev.push([2,"door","ok"]);ev.push([3,"list","ok"]);}else{ev.push([2,"loud","warn"]);ev.push([6,"latedoor","warn"]);}
  if(whole){ev.push([4,"owners","ok"]);if(cut>8)ev.push([8,"retired","ok"]);}else{ev.push([5,"halfway","warn"]);if(cut>8)ev.push([8,"renews","no"]);}
  if(cut<99)ev.push([cut+1,"money","warn"]);if(!whole&&cut===5)ev.push([7,"stranded","no"]);
  if(unl&&cut>=5&&use[5]>=4)ev.push([5,"stage1","ok"]);if(use[20]>=8)ev.push([20,"all","ok"]);
  const maxTwo=Math.max(...two),reach=[];if(S.stop==="sep"&&use[5]>=4&&maxTwo===0)reach.push("useful");if(retired)reach.push("retired");if(use[20]>=8)reach.push("everything");if(!whole&&S.stop==="sep")reach.push("trap");
  const end=use[20]>=8?"best":!whole&&cut===5?"stranded":S.stop==="sep"&&maxTwo===0?"useful":!whole?"half":"part";
  return{v:{use,two,lic},ev,end,tone:end==="best"||end==="useful"?"ok":"warn",vars:{n:use[20]},reach};}};

/* ---------- Making the case ---------- */
// 5 · A case worth funding: the three options over five years, quarter by quarter, against the old licence's A$310,000 a year.
// Whether the case counts running costs, whether Finance checks it, and whether the benefits are tracked after the decision.
MODEL.case={n:22,ctl:[["seg","opt","a"],["toggle","count",false],["toggle","fin",false],["toggle","track",false]],m:[["net",1400,0,-600],["promise",1400,0,-600],["seen",3]],
 run(S){const ev=[],once={a:0,b:520,c:380}[S.opt],save={a:0,b:240,c:270}[S.opt],honest=S.count||S.fin,said=S.opt==="a"?0:honest?save:310;
  const curve=y=>series(22,0,(p,i)=>i<=2?-once*i/2:p+y/4),net=curve(save),promise=curve(said);
  const seen=series(22,0,(p,i)=>!S.track||S.opt==="a"?0:i>=3?3:i>=2?1:0),pay=net.findIndex((v,i)=>i>2&&v>=0);
  if(S.opt==="a"){ev.push([1,"renew","warn"]);ev.push([12,"again","no"]);}
  else{ev.push([1,S.opt==="b"?"moveall":"move21",S.opt==="b"?"warn":"ok"]);
   if(S.fin&&!S.count)ev.push([1,"rohan","ok"]);else if(S.fin)ev.push([1,"checked","ok"]);
   ev.push([3,honest?"bill":"surprise",honest?"ok":"no"]);if(pay>0)ev.push([pay,"paid","ok"]);
   ev.push(S.track?[6,"tracked","ok"]:[12,"untracked","warn"]);ev.push([22,"five","ok",{s:numS(net[22]*1000)}]);}
  const reach=[];if(S.opt==="c")reach.push("payback");if(honest&&S.opt!=="a")reach.push("numbers");if(S.track&&S.opt!=="a")reach.push("tracked");if(S.opt==="a")reach.push("nothing");
  const end=S.opt==="a"?"renew":S.opt==="c"&&honest&&S.track?"best":!honest?"gap":S.opt==="b"?"moveall":"untracked";
  return{v:{net,promise,seen},ev,end,tone:end==="best"?"ok":"warn",vars:{p:save?Math.round(once/(save/12)):"–"},reach};}};

// 6 · Risks, said out loud: the move's first twelve weeks, from Tuesday 1 June. Who owns a risk, whether the team runs a
// pre-mortem, whether each risk has an early sign, and how R1, the licence, is answered.
MODEL.risks={n:12,ctl:[["seg","own","team"],["toggle","pre",false],["toggle","sign",false],["seg","r1","accept"]],m:[["signs",8,8],["issues",3],["moved",21,21]],
 run(S){const ev=[],person=S.own==="person",r3=S.pre&&person,signs=series(12,S.sign?7:0,(p,i)=>S.sign?(S.pre?8:7):0);
  let iss=0;const issAt={};if(!r3)issAt[3]=1;if(S.r1==="accept"&&!S.sign)issAt[11]=(issAt[11]||0)+1;
  const issues=series(12,0,(p,i)=>p+(issAt[i]||0)),moved=series(12,0,(p,i)=>Math.min(21,p+(i<2?1:!person&&i>=7?1:2)));
  ev.push([1,person?"names":"teamown",person?"ok":"warn"]);ev.push([1,S.pre?"pre":"nopre",S.pre?"ok":"warn"]);
  if(S.pre&&!person)ev.push([2,"nobody","no"]);if(S.r1==="reduce")ev.push([2,"busy","ok"]);
  ev.push([3,r3?(S.sign?"caught":"kept"):"leak",r3?"ok":"no"]);if(!person)ev.push([7,"stretch","warn"]);
  if(S.r1==="accept")ev.push(S.sign?[10,"behind","warn"]:[11,"missed","no"]);
  iss=issues[12];const reach=[];if(r3&&S.sign)reach.push("caught");if(iss===0)reach.push("clean");if(person)reach.push("person");if(S.r1==="reduce")reach.push("busy");
  return{v:{signs,issues,moved},ev,end:iss===0?"best":"issues",tone:iss===0?"ok":"warn",vars:{n:iss},reach};}};

// 7 · Everyone at the table: June to December. Who is on the list, who speaks to each, how they hear the news, and when HR's
// reports move.
MODEL.table={n:7,ctl:[["seg","list","loud"],["seg","voice","any"],["seg","page","ask"],["seg","hr","jul"]],m:[["back",14,14],["surp",4]],
 run(S){const ev=[],all=S.list==="all",one=S.voice==="one",mon=S.page==="monthly",aug=S.hr==="aug",hit={};
  if(!all)hit[2]=(hit[2]||0)+1;if(!aug)hit[2]=(hit[2]||0)+1;if(!one)hit[3]=(hit[3]||0)+1;if(!mon)hit[4]=(hit[4]||0)+1;
  const surp=series(7,0,(p,i)=>p+(hit[i]||0)),back=series(7,5,(p,i)=>cl(p+(i===1?(mon?2:1)+(all?1:0)+(one?1:0):mon?1:0.5)-2*(hit[i]||0),0,14));
  if(mon)ev.push([1,"first","ok"]);if(all)ev.push([1,"quiet","ok"]);if(one)ev.push([1,"one","ok"]);if(aug)ev.push([1,"ingrid","ok"]);
  if(!all)ev.push([2,"reps","no"]);if(!aug)ev.push([2,"payroll","no"]);if(!one)ev.push([3,"twov","no"]);if(!mon)ev.push([4,"second","warn"]);
  if(back[7]>=14)ev.push([6,"allback","ok"]);
  const reach=[];if(back[7]>=14)reach.push("all");if(all)reach.push("quiet");if(one)reach.push("onevoice");if(aug)reach.push("constraint");
  return{v:{back,surp},ev,end:back[7]>=14?"best":"part",tone:back[7]>=14?"ok":"warn",vars:{n:Math.round(back[7])},reach};}};

// 8 · One list, not twenty: thirteen weeks from Monday 7 June. How requests come in, how the list is ordered, how much is in
// progress at once, and how the team's time is split.
MODEL.list={n:13,ctl:[["seg","door","many"],["seg","ord","loud"],["seg","wip","none"],["seg","split","req"]],m:[["wait",60],["wip",16,6],["road",100]],
 run(S){const ev=[],one=S.door==="one",val=S.ord==="value",six=S.wip==="six",spl=S.split==="split";
  const wip=series(13,8,(p,i)=>six?6:Math.min(16,p+1)),wait=series(13,45,(p,i)=>{const t=20+(one?0:12)+(six?0:wip[i]*1.2)+(val?0:6);return p+(t-p)*0.3;});
  const road=series(13,0,(p,i)=>spl?Math.min(100,p+(six?5:2.5)):0),ready=val&&six;
  ev.push([1,one?"door":"eleven",one?"ok":"warn"]);if(!one)ev.push([4,"dup","no"]);ev.push([3,"council","ok"]);
  if(!six)ev.push([5,"toomuch","warn"]);ev.push([6,val?"notnow":"clarafirst",val?"ok":"warn"]);if(!spl)ev.push([8,"noroad","warn"]);
  ev.push([13,ready?"ready":"late",ready?"ok":"no"]);
  const reach=[];if(one)reach.push("dups");if(ready)reach.push("timetable");if(six&&wait[13]<27)reach.push("six");if(spl)reach.push("road");
  const best=one&&ready&&spl&&wait[13]<27;return{v:{wait,wip,road},ev,end:best?"best":ready?"part":"late",tone:best?"ok":"warn",reach};}};

/* ---------- Architecture that keeps up ---------- */
// 9 · Services with customers: eight weeks from the front door's opening, Monday 7 June. How the services are written, whether each
// is walked down every layer, and what happens to a request that lands on no service.
MODEL.services={n:8,ctl:[["seg","words","tools"],["seg","none","refuse"],["toggle","walk",false]],m:[["home",100,100],["orphan",17]],
 run(S){const ev=[],cust=S.words==="cust",route=S.none==="route",pct=(cust?42:18)+(route?3:0),home=series(8,0,(p,i)=>Math.round(pct/45*100));
  const orphan=series(8,17,(p,i)=>S.walk&&i>=6?0:17);
  ev.push([1,cust?"door":"jargon",cust?"ok":"warn"]);if(cust)ev.push([2,"graham","ok"]);
  ev.push([3,route?"booking":"refused",route?"ok":"warn"]);ev.push([4,route?"survey":"hidden",route?"ok":"warn"]);
  if(S.walk){ev.push([3,"walk","ok"]);ev.push([6,"retire","ok"]);}else ev.push([6,"unseen","warn"]);
  const reach=[];if(cust)reach.push("land");if(cust&&route)reach.push("every");if(S.walk)reach.push("orphans");if(route)reach.push("gap");
  const best=cust&&route&&S.walk;return{v:{home,orphan},ev,end:best?"best":"part",tone:best?"ok":"warn",vars:{n:home[8]},reach};}};

// 10 · One map, in the repo: May to December. Where the map lives, how a change goes in, when the map changes with the code, and
// what happens to the agent's draft.
MODEL.map={n:7,ctl:[["seg","src","three"],["seg","rev","direct"],["seg","when","later"],["seg","agent","merge"]],m:[["drift",3],["behind",5],["reasons",63]],
 run(S){const ev=[],repo=S.src==="repo",pr=S.rev==="pr",same=S.when==="same",ok=S.agent==="review";
  const drift=series(7,2,(p,i)=>repo?0:Math.min(3,2+Math.floor(i/3))),behind=series(7,0,(p,i)=>p+(!same&&(i===2||i===4||i===6)?1:0)+(!ok&&i===3?1:0));
  const reasons=series(7,0,(p,i)=>pr?[0,8,17,26,35,44,53,63][i]:0);
  ev.push([1,repo?"repo":"copies",repo?"ok":"warn"]);ev.push([1,pr?"pr":"direct",pr?"ok":"warn"]);
  ev.push([2,same?"feed":"nofeed",same?"ok":"warn"]);ev.push([3,ok?"agentok":"agentbad",ok?"ok":"no"]);
  ev.push([7,repo&&pr?"history":"whichone",repo&&pr?"ok":"warn"]);
  const reach=[];if(drift[7]===0)reach.push("agree");if(behind[7]===0)reach.push("current");if(pr)reach.push("reasons");if(ok)reach.push("caught");
  const best=reach.length===4;return{v:{drift,behind,reasons},ev,end:best?"best":"part",tone:best?"ok":"warn",reach};}};

// 11 · A path for every provider: eight weeks from the new timetable's first day, Monday 19 July. The timetable's path, the check
// on payroll's file, the labs' spreadsheet, and whether the team holds the data back until every provider meets the preferred way.
MODEL.paths={n:8,ctl:[["seg","tt","hourly"],["toggle","guard",false],["seg","labs","wait"],["toggle","ideal",false]],m:[["src",4,4],["ghost",400],["gone",2500]],
 run(S){const ev=[],id=S.ideal,tt=!id&&S.tt!=="wait",lab=!id&&S.labs==="table",n=1+(id?0:1)+(tt?1:0)+(lab?1:0);
  const src=series(8,0,(p,i)=>i<3?Math.min(n,1+(id?0:1)+(tt?1:0)):n),ghost=series(8,0,(p,i)=>tt&&S.tt==="hourly"?(i===1?40:i===2?212:p+50):0);
  const gone=series(8,0,(p,i)=>!id&&!S.guard&&i>=6?2400:0);
  if(id)ev.push([1,"ideal","no"]);else ev.push([1,S.tt==="compare"?"tree":S.tt==="hourly"?"hourly":"ttwait",S.tt==="compare"?"ok":"warn"]);
  if(tt)ev.push([2,S.tt==="compare"?"found":"ghosts",S.tt==="compare"?"ok":"no"]);
  if(!id)ev.push([3,lab?"labs":"nolabs",lab?"ok":"warn"]);if(!id)ev.push([6,S.guard?"stopped":"cut",S.guard?"ok":"no"]);
  if(n===4)ev.push([8,"page","ok"]);
  const reach=[];if(n===4)reach.push("four");if(tt&&S.tt==="compare")reach.push("ghosts");if(S.guard&&!id)reach.push("guard");if(id)reach.push("ideal");
  const best=n===4&&S.tt==="compare"&&S.guard;return{v:{src,ghost,gone},ev,end:best?"best":id?"ideal":"part",tone:best?"ok":"warn",reach};}};

/* ---------- Small steps, measured ---------- */
// 12 · Prototype first: eight weeks from Tuesday 30 March. What Graham sees first, whether the agent's draft is checked, what each
// round asks, and when the rounds stop.
MODEL.proto={n:8,ctl:[["seg","first","spec"],["toggle","check",false],["seg","ask","like"],["seg","stop","plan"]],m:[["know",3,3],["rounds",8],["days",45,41]],
 run(S){const ev=[],spec=S.first==="spec",real=S.first==="real",use=spec?34:11,mind=S.ask==="mind";
  const k1=!spec&&S.check?2:spec?7:99,k2=real&&S.check?3:99,k3=real&&S.check&&mind?4:99,served=k3<99;
  const know=series(8,0,(p,i)=>[k1,k2,k3].filter(w=>w<=i).length),last=served&&S.stop==="served"?4:8;
  const rounds=series(8,0,(p,i)=>i>=(spec?7:2)&&i<=last?p+1:p),days=series(8,0,(p,i)=>Math.min(use,i*5-1));
  ev.push([1,S.first,spec?"warn":real?"ok":"warn"]);
  if(!spec){ev.push([2,S.check?"caught":"booked",S.check?"ok":"no"]);ev.push([2,mind?"mind":"like",mind?"ok":"warn"]);ev.push([3,"uses","ok"]);ev.push([3,real&&S.check?"peak":real?"nopeakb":"nopeak",real&&S.check?"ok":"warn"]);}
  if(served)ev.push([4,"served","ok"]);if(served&&S.stop==="plan")ev.push([6,"polish","warn"]);if(spec)ev.push([7,"late","warn"]);
  const reach=[];if(!spec)reach.push("eleven");if(!spec&&S.check)reach.push("caught");if(served)reach.push("served");if(served&&S.stop==="served")reach.push("enough");
  const best=served&&S.stop==="served";return{v:{know,rounds,days},ev,end:best?"best":served?"polish":spec?"spec":"part",tone:best?"ok":"warn",reach};}};

// 13 · Measures that matter: February's baseline, then March to December. What the page measures, whether a quality measure sits
// beside the speed, how each measure is shown, and who confirms first use.
MODEL.measures={n:10,ctl:[["seg","what","busy"],["toggle","sent",false],["seg","show","rag"],["seg","conf","builder"]],m:[["days",45,41],["back",30],["load",10,6]],
 run(S){const ev=[],get=S.what==="get",tr=S.show==="trend",G=[41,38,34,29,24,21,19,17,16,15,14];
  const back=series(10,12.5,(p,i)=>i<5?12.5:S.sent?Math.max(6,p-1.3):Math.min(24,p+2.4)),load=series(10,6,(p,i)=>i<6?6+(i>=5?2:0):i===6?9:tr?6:9);
  const days=series(10,41,(p,i)=>{if(!get)return 41-(i%2);let d=G[i];if(!S.sent&&i>=6)d+=(i-5)*1.5;if(!tr&&i>=7)d+=(i-6)*1.5;return d;});
  ev.push([1,get?"get":"busy",get?"ok":"warn"]);ev.push([4,get?"jun":"stillwait",get?"ok":"no"]);
  if(S.sent)ev.push([5,"sent","ok"]);else ev.push([7,"rework","no"]);ev.push([6,tr?"load":"green",tr?"ok":"warn"]);if(tr)ev.push([7,"six","ok"]);
  ev.push([8,S.conf==="asker"?"asker":"goodhart",S.conf==="asker"?"ok":"no"]);
  const reach=[];if(days[10]<=14.5)reach.push("fourteen");if(S.sent&&back[10]<=6)reach.push("rework");if(tr)reach.push("load");if(S.conf==="asker")reach.push("trust");
  const best=reach.length===4;return{v:{days,back,load},ev,end:best?"best":"part",tone:best?"ok":"warn",vars:{n:numS(days[10])},reach};}};

// 14 · Better every week: fifteen weeks, from Friday 3 September to 17 December. Whether the team protects half an hour on Fridays,
// how much it changes at once, what it does with a change that finds nothing, and where a kept change is written.
MODEL.fridays={n:15,ctl:[["toggle","fri",false],["seg","n","many"],["seg","drop","keep"],["seg","write","head"]],m:[["first",7],["kept",15],["ritual",12]],
 run(S){const ev=[],f=S.fri,one=S.n==="one",away=i=>S.write==="head"&&i>=9&&i<=10;
  const first=series(15,6,(p,i)=>!f||i<2?6:away(i)?4:one?1:3),kept=series(15,0,(p,i)=>!f||i<2?0:Math.min(15,p+(one?1:0.5)-(i===3&&S.drop==="drop"&&one?1:0)));
  const ritual=series(15,0,(p,i)=>!f||i<2?0:S.drop==="drop"&&i>=3?0:10);
  if(!f)ev.push([1,"nofri","warn"]);else{ev.push([1,"fri","ok"]);ev.push([2,one?"oneday":"many",one?"ok":"warn"]);ev.push([2,"standup","warn"]);
   ev.push([3,S.drop==="drop"?"dropped":"habit",S.drop==="drop"?"ok":"warn"]);ev.push([9,S.write==="head"?"away":"page",S.write==="head"?"no":"ok"]);}
  const best=f&&one&&S.drop==="drop"&&S.write==="proc";if(best)ev.push([15,"dec","ok"]);
  const reach=[];if(f&&one)reach.push("oneday");if(f&&S.drop==="drop")reach.push("drop");if(f&&one&&S.write==="proc")reach.push("holds");if(best)reach.push("fourteen");
  return{v:{first,kept,ritual},ev,end:best?"best":f?"part":"none",tone:best?"ok":"warn",reach};}};

// 15 · Strategy is a habit: from the strategy's approval in April to the year's review in January. Whether the reviews are in the
// calendar, what happens when the University Council adds online courses in October, and when the map changes.
MODEL.habit={n:9,ctl:[["seg","rev","none"],["seg","move","keep"],["seg","map","end"]],m:[["fit",100],["load",10,6],["ready",4,4]],
 run(S){const ev=[],cal=S.rev==="cal",loud=cal&&S.move==="loud",both=cal&&S.move==="both";
  const fit=series(9,100,(p,i)=>i<6?100:loud?100:both?80:i===9&&!cal?80:60),load=series(9,6,(p,i)=>both&&i>=6?9:6);
  const ready=series(9,0,(p,i)=>loud?(i>=8?4:i>=7?2:0):both?(i>=8?2:0):0);
  ev.push([3,cal?"july":"silent",cal?"ok":"warn"]);ev.push([6,"world","warn"]);
  if(cal)ev.push([6,loud?"moved":both?"both":"kept",loud?"ok":"warn"]);if(S.map==="each")ev.push([6,"mapnow","ok"]);
  ev.push([8,ready[8]>=4?"ready":"short",ready[8]>=4?"ok":"no"]);ev.push([9,cal?"year":"late",cal?"ok":"warn"]);if(S.map==="end")ev.push([9,"stale","warn"]);
  const reach=[];if(cal)reach.push("july");if(loud)reach.push("loud");if(S.map==="each")reach.push("map");if(both)reach.push("trap");
  const best=loud&&S.map==="each";return{v:{fit,load,ready},ev,end:best?"best":both?"both":"part",tone:best?"ok":"warn",reach};}};

// for site-tools/smoke/<series>.js: the runs that tick every experiment of each playground, as the choices a visitor would make
window.DM_RUNS={lanes:[{start:"wheel",route:"deep",chg:"wk6",tell:true},{start:"loud"}],listen:[{who:"all",q:"same",count:true,back:true}],
 design:[{who:"hub",copy:"one",door:"one",rev:"named"}],stages:[{ord:"unlock",move:"whole"},{ord:"unlock",move:"whole",stop:"sep"},{stop:"sep"}],
 case:[{},{opt:"c",count:true,track:true}],risks:[{own:"person",pre:true,sign:true,r1:"reduce"}],table:[{list:"all",voice:"one",page:"monthly",hr:"aug"}],
 list:[{door:"one",ord:"value",wip:"six",split:"split"}],services:[{words:"cust",none:"route",walk:true}],map:[{src:"repo",rev:"pr",when:"same",agent:"review"}],
 paths:[{ideal:true},{tt:"compare",guard:true,labs:"table"}],proto:[{first:"real",check:true,ask:"mind",stop:"served"}],
 measures:[{what:"get",sent:true,show:"trend",conf:"asker"}],fridays:[{fri:true,n:"one",drop:"drop",write:"proc"}],habit:[{rev:"cal",move:"both"},{rev:"cal",move:"loud",map:"each"}]};

window.DM_CTL=Object.fromEntries(Object.entries(MODEL).map(([k,m])=>[k,m.ctl]));
const BUILD={play:labWeeks};

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
  function render(focus){paintBar();const q=QS[cur];if(!q)return;app.dataset.film=String(q.film);const f=VIS[q.vis.k]||VIS.any,a=ans[q.n],body=h("div",{class:"qbody"}),out=h("div"),S={done:a?performance.now()-1e5:0};
    const vis=DRAW&&f?stage((lw,c)=>({lw,h:f.h?f.h(lw,c,q):190}),(ctx,o,now)=>f(ctx,o,now,q,S),(L.pics.alt&&L.pics.alt[q.vis.k])||q.title):null;
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
// Each draws the situation, not its answer: the playground's place (pics[lab].t), what's in play (pics[lab].c) and the question it
// turns on (pics[lab].q); once it's answered (S.done), the question is drawn in gold
const GO=(S,now)=>S.done?eo(since(now,S.done)/700):0;
VIS.any=(ctx,o,now,q,S)=>{const P=L.pics[q.vis.k]||{t:q.title,c:[],q:""},m=12,t=GO(S,now),col=K.plan;ground(ctx,o.lw,o.h,col);
  const f=flow(ctx,P.c,o.lw-m*2-24,13,8,32);card(ctx,m,12,o.lw-m*2,44+f.h+16,col,P.t,{glow:6});
  f.pos.forEach((p,i)=>chip(ctx,m+12+p.x,12+40+p.y,p.w,p.h,P.c[i],i%2?K.data:K.plan,{size:13}));
  const y=12+44+f.h+16+14;lines(ctx,P.q,m+4,y+14,o.lw-m*2-8,{size:13.5,max:2,align:"center",color:rgbaS(mixC(K.soft,K.gold,t),1)});};
VIS.any.h=(lw,ctx,q)=>{const P=L.pics[q.vis.k]||{c:[]},f=flow(ctx,P.c,lw-48,13,8,32);return 12+44+f.h+16+14+2*17+18;};
})();
