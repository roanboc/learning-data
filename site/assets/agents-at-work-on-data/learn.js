/* Learning Data: Agents at work on data. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine,
   copied from What an agent is' (assets/what-an-agent-is/learn.js), itself from Data that moves', the pilot of the standard the author
   set on 18 November 2026: one playground for each film, and one evaluation for the series. The series' labs page and scenarios page
   load a film's bundle (for its text parts: T, tw, rr and withA), the words (learn.en.js or learn.es.js, which set window.AGL), and
   this file.
   Every lab is a playground (kind "play"), and here every playground is one machine (see machine below): the visitor sets how the
   team works, plays a situation from the film, and watches the steps the agent takes and what comes of it. Each has three to five
   experiments (w.goals), each ticked when the visitor makes it happen, and its end once all are ticked. Each playground's rules are
   in RULE below, its words in the pack. Pictures are drawn in the films' white lab: matte off-white cards, ink words, and the module's
   colours only where they mean something.
   The scenarios are the series' evaluation, every one a choice, its options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), its heights
   measured from its words, so they stay whole and big enough to read on a phone. Things move and settle, or jump to where they end
   when the visitor asks for reduced motion, and every change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films), both from
   site-tools/build_series.py. Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments)
   and "quiz" (answers by scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.AGL,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||L.store||"ld-agents";
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
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).length||(L.films||[]).length||1,filmN=n=>fill(U.filmN,{n,of:NF});

/* ---------- drawing, in the films' white lab ---------- */
const DRAW=typeof T==="function"&&typeof withA==="function"&&typeof rr==="function"&&typeof tw==="function";
const TP=Math.PI*2,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lp=(a,b,t)=>a+(b-a)*t;
const eo=u=>1-Math.pow(1-cl(u,0,1),3),ei=u=>{u=cl(u,0,1);return u<0.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;};
// the films' colours: ink, soft ink, the paper and the sheet, right, wrong, and the module's own (blue, violet, orange, green, amber)
const K={ink:[35,39,45],soft:[86,92,100],faint:[150,146,140],paper:[239,237,232],sheet:[248,247,244],good:[50,116,80],bad:[170,56,40],
  blue:[38,102,132],violet:[88,78,196],orange:[186,94,54],green:[50,116,80],amber:[156,100,18],gold:[156,100,18]};
const rgbaS=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")",mixC=(a,b,t)=>[lp(a[0],b[0],t),lp(a[1],b[1],t),lp(a[2],b[2],t)];
// widths remembered: setting a font is slow, and pictures repaint as they move (forgotten when the page's fonts come)
const TWM=new Map(),TW=(ctx,s,z,wt)=>{const k=s+"|"+z+"|"+(wt||700);let v=TWM.get(k);if(v==null){v=tw(ctx,String(s),z,wt||700);if(TWM.size>20000)TWM.clear();TWM.set(k,v);}return v;};
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/<series>.js)
const MISS=window.AGL_MISS=new Set();
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
// a matte sheet: off-white, a soft shadow, an edge in a colour (or the soft ink), a faint wash of the colour
function sheet(ctx,x,y,w,hh,r,col,o){o=o||{};ctx.save();ctx.shadowColor="rgba(40,30,20,"+(o.lift==null?0.13:o.lift)+")";ctx.shadowBlur=o.blur==null?8:o.blur;ctx.shadowOffsetY=2;
  rr(ctx,x,y,w,hh,r);ctx.fillStyle=o.fill||rgbaS(K.sheet,1);ctx.fill();ctx.shadowColor="transparent";
  if(col&&o.tint!==0){ctx.fillStyle=rgbaS(col,o.tint==null?0.06:o.tint);rr(ctx,x,y,w,hh,r);ctx.fill();}
  ctx.lineWidth=o.lw||1.5;ctx.strokeStyle=col?rgbaS(col,o.ea==null?0.75:o.ea):"rgba(60,50,40,0.22)";if(o.dash)ctx.setLineDash(o.dash);rr(ctx,x+0.5,y+0.5,w-1,hh-1,r);ctx.stroke();ctx.restore();}
// a card: a sheet with its title at the top left
function card(ctx,x,y,w,hh,col,title,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{sheet(ctx,x,y,w,hh,o.r||12,col,{tint:o.tint,dash:o.dash,lw:o.glow>8?2.4:1.5,ea:o.glow>8?1:0.75});
  if(title)line1(ctx,title,x+12,y+21,w-24-(o.right||0),o.size||14,{w:800,color:rgbaS(col?mixC(col,K.ink,0.35):K.ink,1)});});}
// how many chips fit side by side: as many as hold every label on one line, or two, at 12 px; down to one a row
function chipCols(M,labels,w,max){for(let c=max||labels.length;c>1;c--){const cw=(w-(c-1)*6)/c;if(labels.every(s=>TW(M,s,12,700)<=cw-12||(String(s).split(" ").every(x=>TW(M,x,12,700)<=cw-10)&&wrap(M,s,cw-10,12,700).length<=2)))return c;}return 1;}
function chipAt(i,c,x,y,w,hh){const cw=(w-(c-1)*6)/c;return[x+(i%c)*(cw+6),y+Math.floor(i/c)*(hh+6),cw];}
// a chip: a short label on a sheet, centred (o.mark puts a tick or a cross on its corner, o.strike crosses it out, o.on fills it)
function chip(ctx,x,y,w,hh,label,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,hh,o.r==null?8:o.r,col,{tint:o.on?0.2:o.tint==null?0.08:o.tint,lw:o.glow>8||o.on?2.4:1.5,ea:o.glow>8||o.on?1:0.7,dash:o.dash,blur:o.flat?0:6});
  const z0=o.size||13;if(hh>=34&&TW(ctx,label,12,700)>w-12){const[ls,k]=fitL(ctx,label,w-10,z0,2,700),lh=k*1.12,y0=y+hh/2-(ls.length-1)*lh/2+k*0.36;  // two lines where one won't fit
    ls.forEach((l,i)=>T(ctx,l,x+w/2,y0+i*lh,{w:700,size:k,align:"center",color:o.color||rgbaS(K.ink,0.96)}));}
  else{const[t,k]=fit1(ctx,label,w-12,z0,700);T(ctx,t,x+w/2,y+hh/2+k*0.36,{w:700,size:k,align:"center",color:o.color||rgbaS(K.ink,0.96)});}
  if(o.strike){ctx.save();ctx.strokeStyle=rgbaS(K.bad,1);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+5,y+hh/2+2);ctx.lineTo(x+w-5,y+hh/2-2);ctx.stroke();ctx.restore();}
  if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
function mark(ctx,x,y,k){const c=k==="ok"?K.good:k==="warn"?K.amber:K.bad;ctx.save();ctx.fillStyle=rgbaS(K.sheet,1);ctx.beginPath();ctx.arc(x,y,8,0,TP);ctx.fill();ctx.strokeStyle=rgbaS(c,1);ctx.lineWidth=1.6;ctx.stroke();
  ctx.strokeStyle=rgbaS(c,1);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();if(k==="ok"){ctx.moveTo(x-3.4,y+0.2);ctx.lineTo(x-0.9,y+2.8);ctx.lineTo(x+3.6,y-2.8);}else if(k==="warn"){ctx.moveTo(x,y-3.6);ctx.lineTo(x,y+0.8);ctx.moveTo(x,y+3.4);ctx.lineTo(x,y+3.6);}else{ctx.moveTo(x-2.8,y-2.8);ctx.lineTo(x+2.8,y+2.8);ctx.moveTo(x+2.8,y-2.8);ctx.lineTo(x-2.8,y+2.8);}ctx.stroke();ctx.restore();}
function pill(ctx,x,y,s,col,o){o=o||{};const z=o.size||12.5,w=Math.min(o.max||1e4,TW(ctx,s,z)+18),hh=z+11,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  sheet(ctx,X,y,w,hh,hh/2,col,{tint:0.12,blur:0,lw:1.4,ea:0.9});line1(ctx,s,X+9,y+hh/2+z*0.36,w-18,z,{w:700,color:rgbaS(mixC(col,K.ink,0.25),1)});return w;}
function arrow(ctx,x0,y0,x1,y1,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.fillStyle=rgbaS(col,1);ctx.lineWidth=o.lw||2;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.setLineDash([]);const an=Math.atan2(y1-y0,x1-x0),hz=o.head||8;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-hz*Math.cos(an-0.45),y1-hz*Math.sin(an-0.45));ctx.lineTo(x1-hz*Math.cos(an+0.45),y1-hz*Math.sin(an+0.45));ctx.closePath();ctx.fill();ctx.restore();});}
// a small tile in a colour, with a label (a row, a file, a message)
function tile(ctx,x,y,w,hh,s,col,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{sheet(ctx,x,y,w,hh,6,col,{tint:0.16,blur:3,lw:o.edge?2.2:1.3,ea:0.9,fill:o.fill});
  if(o.edge){ctx.save();ctx.strokeStyle=rgbaS(o.edge,1);ctx.lineWidth=2.2;rr(ctx,x,y,w,hh,6);ctx.stroke();ctx.restore();}
  if(s&&hh>=34&&TW(ctx,s,12,700)>w-8){const[ls,k]=fitL(ctx,s,w-10,o.size||12.5,2,700),lh=k*1.12,y0=y+hh/2-(ls.length-1)*lh/2+k*0.36;ls.forEach((l,i)=>T(ctx,l,x+w/2,y0+i*lh,{w:700,size:k,align:"center",color:rgbaS(K.ink,0.96)}));}  // two lines where one won't fit
  else if(s){const[t,k]=fit1(ctx,s,w-8,o.size||12.5,700);T(ctx,t,x+w/2,y+hh/2+k*0.36,{w:700,size:k,align:"center",color:rgbaS(K.ink,0.96)});}
  if(o.strike){ctx.save();ctx.strokeStyle=rgbaS(K.bad,1);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+4,y+hh/2+1);ctx.lineTo(x+w-4,y+hh/2-1);ctx.stroke();ctx.restore();}
  if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
// the paper, with a faint wash of a colour from the top
function ground(ctx,w,hh,col){ctx.fillStyle=rgbaS(K.paper,1);ctx.fillRect(0,0,w,hh);const g=ctx.createRadialGradient(w*0.5,-hh*0.2,10,w*0.5,hh*0.3,Math.max(w,hh));g.addColorStop(0,rgbaS(col,0.1));g.addColorStop(1,rgbaS(col,0));ctx.fillStyle=g;ctx.fillRect(0,0,w,hh);}
// a meter: a bar filled to a share, in a colour, with its label and value
function meter(ctx,x,y,w,label,val,share,col){line1(ctx,label,x,y+12,w*0.6,12.5,{w:700,color:rgbaS(K.soft,1)});line1(ctx,val,x+w*0.6,y+12,w*0.4,12.5,{w:800,align:"right",color:rgbaS(mixC(col,K.ink,0.3),1)});
  ctx.save();ctx.fillStyle="rgba(60,50,40,0.1)";rr(ctx,x,y+18,w,8,4);ctx.fill();ctx.fillStyle=rgbaS(col,0.9);rr(ctx,x,y+18,Math.max(8,w*cl(share,0,1)),8,4);ctx.fill();ctx.restore();}
// a dot that pulses while something works
function busy(ctx,x,y,col,now,on){if(!on)return;const p=RM()?0.4:(now/700)%1;ctx.save();ctx.strokeStyle=rgbaS(col,0.6*(1-p));ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,6+p*10,0,TP);ctx.stroke();ctx.fillStyle=rgbaS(col,1);ctx.beginPath();ctx.arc(x,y,4,0,TP);ctx.fill();ctx.restore();}
const since=(now,t0)=>t0==null?-1:RM()?1e9:now-t0;
// chips in rows across a width, each as wide as its label: where each goes, and the height
function flow(ctx,labels,w,z,gap,hh){const out=[];let x=0,y=0;labels.forEach(s=>{const cw=Math.min(w,Math.ceil(TW(ctx,s,z))+20);if(x>0&&x+cw>w){x=0;y+=hh+gap;}out.push({x,y,w:cw,h:hh});x+=cw+gap;});return{pos:out,h:labels.length?y+hh:0};}
// a list of steps done one after another, each with a tick, a cross or a dot: [[label, "ok"|"no"|"warn"|null]]
function steps(ctx,x,y,w,rows,col,o){o=o||{};const lh=o.lh||24;rows.forEach(([s,m],i)=>{const yy=y+i*lh;ctx.save();ctx.fillStyle=rgbaS(m==="ok"?K.good:m==="no"?K.bad:m==="warn"?K.amber:col,1);ctx.beginPath();ctx.arc(x+6,yy-4,4,0,TP);ctx.fill();ctx.restore();
  line1(ctx,s,x+18,yy,w-18,o.size||12.5,{w:o.w||600,color:rgbaS(m==="no"?K.bad:K.ink,0.95)});});return rows.length*lh;}

// A picture: a canvas laid out for its width on the page. lay(lw, ctx) gives the layout for a width (lw, its CSS width, from 320 to
// 640) with its height in .h; draw(ctx, layout, now) paints it. kick(ms) keeps it moving for that long; nothing runs after. It paints
// as soon as it has a width, and never waits for the film's player.
function stage(lay,draw,label){const cv=h("canvas",{role:"img","aria-label":label||""}),st={el:cv,lw:0,lo:null,v:0,until:0,raf:0};
  const M=document.createElement("canvas").getContext("2d");let key="";
  function paint(){const cw=cv.clientWidth||(cv.parentNode&&cv.parentNode.clientWidth)||0;if(!cw)return;const lw=Math.round(cl(cw,320,640)),k2=lw+"/"+st.v;
    if(k2!==key){st.lo=lay(lw,M);key=k2;st.lw=lw;cv.style.aspectRatio=lw+"/"+Math.round(st.lo.h);}
    const d=Math.min(window.devicePixelRatio||1,2),bw=Math.round(cw*d),bh=Math.round(cw*d*st.lo.h/lw);if(cv.width!==bw||cv.height!==bh){cv.width=bw;cv.height=bh;}
    const ctx=cv.getContext("2d"),k=cv.width/lw;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(k,0,0,k,0,0);
    ctx.fillStyle=rgbaS(K.paper,1);ctx.fillRect(0,0,lw,st.lo.h);try{draw(ctx,st.lo,performance.now());}catch(e){console.error(e);}}
  function loop(){st.raf=-1;paint();st.raf=performance.now()<st.until?requestAnimationFrame(loop):0;}  // a kick while it paints asks no second frame
  st.kick=ms=>{st.until=Math.max(st.until,performance.now()+(RM()?0:ms||0)+40);if(!st.raf)st.raf=requestAnimationFrame(loop);};
  st.paint=()=>st.kick(0);st.relayout=()=>{st.v++;st.kick(0);};
  if("ResizeObserver" in window)new ResizeObserver(()=>st.paint()).observe(cv);
  requestAnimationFrame(()=>st.paint());if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>st.relayout());
  STG.set(cv,st);return st;}
// a web font that comes after a picture was laid out leaves every fit measured with the fallback font: forget them, and lay out again
const STG=new WeakMap();
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener("loadingdone",()=>{FIT.clear();TWM.clear();MISS.clear();
  document.querySelectorAll("canvas").forEach(c=>{const s=STG.get(c);if(s)s.relayout();});});

/* ---------- the parts of a lab's page ---------- */
const info=t=>h("p",{class:"lab-info"},t);
function focusIn(el){if(!el)return;try{el.focus({preventScroll:true});}catch(e){el.focus();}const r=el.getBoundingClientRect();if(r.bottom>innerHeight-8||r.top<120)el.scrollIntoView({block:"center",behavior:RM()?"auto":"smooth"});}

/* ---------- play: a playground with experiments ---------- */
// PLAY[id](Lb, api) gives the playground: its state (S), its controls (built with api.seg, api.toggle and api.btn), its readouts
// ([[label, () => value]]), and its picture (lay, draw). api.say(text, tone) says what just happened; api.reach(key) ticks an
// experiment; api.kick(ms) keeps the picture moving; api.later(fn, ms) runs fn after a moment (at once with reduced motion), unless
// the visitor has started again. Start again puts everything back as it was, the ticks included.
const PLAY={};
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab ag-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]),gen=0;
  const ctrl=h("div",{class:"lab-controls ag-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"ag-goals","aria-label":U.goals}),end=h("div",{class:"ag-endbox"});
  let st=null,Pl=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    later:(fn,ms)=>{const g=gen;setTimeout(()=>{if(g===gen){fn();api.refresh();}},RM()?0:ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"ag-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"ag-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){gen++;ctrl.replaceChildren();read.replaceChildren();rd=[];Pl=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(Pl.lay,(ctx,o,now)=>Pl.draw(ctx,o,now),W.alt||Lb.name):null;
    (Pl.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm ag-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"ag-goalbox"},h("p",{class:"ag-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"ag-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}
// a chance that comes out the same each time the playground starts, so a visitor (and the browser check) can replay it
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
// a sheet that says what came of the last run: its title (in a colour), and a line or two under it
function result(ctx,x,y,w,hh,col,title,sub,o){o=o||{};card(ctx,x,y,w,hh,col,"",{glow:o.glow||6});if(o.kicker)line1(ctx,o.kicker,x+12,y+18,w-24,12,{w:800,color:rgbaS(K.soft,1)});
  const ty=y+(o.kicker?38:24);line1(ctx,title,x+12,ty,w-24,o.size||16,{w:800,color:rgbaS(mixC(col,K.ink,0.25),1)});if(sub)lines(ctx,sub,x+12,ty+20,w-24,{size:12.5,max:o.max||Math.max(2,Math.floor((y+hh-ty-16)/15)),w:600,color:rgbaS(K.soft,1)});}  // as many lines as the card holds


/* ---------- a playground of settings and runs ---------- */
// Every playground here is one machine. Its settings (w.set) are rows of choices: each has its key (k), its label, the choice it
// starts on (def), and for each choice [value, label, short word for the picture, 1 if it's the safe one or 0 if not]. Its runs
// (w.runs) are the situations the visitor plays, each a button. RULE[id](S, run) below says what comes of a run with the settings as
// they are: the result's key in w.res, the numbers to fill into its words (v), the experiments it ticks (g, besides the result's own
// goal), anything it leaves for later runs (S.kept), and bars to show. A result (w.res) has a title (t), a line or two (d), what's
// said (say), its tone (ok, warn or no), the steps the run took ([text, "ok" | "no" | "warn" | null]), a short word for the readout,
// and the experiment it ticks (goal). The picture shows the settings as chips, what the team has kept (w.keep), the steps one after
// another, and what came of it. Every height is measured from the words, so nothing is cut on a phone.
const RULE={},STEP=420;
function machine(Lb,api){const W=Lb.w,S={kept:{},run:null,res:null,v:{},bars:null,t0:null};
  const setRow=x=>{const r=api.group(x.label);r.dataset.set=x.k;api.seg(r,x.opts.map(o=>[o[0],o[1]]),x.def,v=>{S[x.k]=v;S.res=null;S.run=null;
    api.say(fill(W.setSay,{what:x.label,v:x.opts.find(o=>o[0]===v)[1]}));api.kick(300);},x.label);};
  W.set.forEach(x=>{S[x.k]=x.def;setRow(x);});
  const runs=api.group(W.runL);W.runs.forEach(([k,l])=>{const b=api.btn(runs,l,()=>go(k),"go");b.dataset.run=k;});
  function go(k){const out=RULE[Lb.id](S,k)||{},key=out.k,R=W.res[key];S.run=k;S.res=key;S.v=out.v||{};S.bars=out.bars||null;S.t0=performance.now();
    Object.assign(S.kept,out.keep||{});const n=(R.steps||[]).length;api.kick(n*STEP+900);
    api.say(fill(R.say||R.t,S.v),R.tone==="ok"?"ok":R.tone==="no"?"no":"warn");
    const gs=[R.goal,...(out.g||[])].filter(Boolean);api.later(()=>gs.forEach(g=>api.reach(g)),Math.min(900,n*STEP));}
  const runName=()=>{const r=W.runs.find(x=>x[0]===S.run);return r?r[1]:"–";};
  // the layout: measured from every result's words, so the tallest fits
  const lay=(lw,M)=>{const m=12,w=lw-m*2,o={lw,m},iw=w-24,shorts=W.set.flatMap(x=>x.opts.map(p=>p[2]||p[1]));
    o.sc=chipCols(M,shorts,iw);const rows=Math.ceil(W.set.length/o.sc);
    o.keepH=0;if(W.keep){const ks=Object.values(W.keep);o.keepH=flow(M,ks.map(s=>"✓ "+s),iw,12,6,24).h+12;}
    o.set={y:12,h:44+rows*46+o.keepH};
    const sw=iw-18,stH=r=>(r.steps||[]).reduce((a,[s])=>a+Math.min(3,Math.max(1,wrap(M,s,sw,12.5,600).length))*16+6,0);
    const resH=r=>{const t=Math.min(2,wrap(M,r.t,iw,16,800).length),d=r.d?Math.min(5,wrap(M,r.d,iw,12.5,600).length):0;return 24+t*20+d*15+(W.bars?W.bars.length*30+4:0)+14;};
    const all=Object.values(W.res);o.st={y:o.set.y+o.set.h+10,h:Math.max(64,40+Math.max(...all.map(stH)))};
    o.res={y:o.st.y+o.st.h+10,h:Math.max(84,...all.map(resH),resH({t:W.idleT||"",d:W.idle}))};o.h=o.res.y+o.res.h+12;return o;};
  const draw=(ctx,o,now)=>{const col=K[W.col||"blue"]||K.blue;ground(ctx,o.lw,o.h,col);const m=o.m,w=o.lw-m*2,iw=w-24;
    // the settings, as they are
    card(ctx,m,o.set.y,w,o.set.h,col,W.setT,{size:13});
    W.set.forEach((x,i)=>{const p=x.opts.find(q=>q[0]===S[x.k])||x.opts[0],[cx,cy,cw]=chipAt(i,o.sc,m+12,o.set.y+34,iw,40);
      chip(ctx,cx,cy,cw,40,p[2]||p[1],p[3]===1?K.green:p[3]===0?K.amber:K.blue,{size:12.5,on:true});});
    if(W.keep){const ks=Object.keys(W.keep),lab=ks.map(k=>"✓ "+W.keep[k]),F=flow(ctx,lab,iw,12,6,24),y0=o.set.y+o.set.h-o.keepH+2;
      ks.forEach((k,i)=>{const P=F.pos[i],on=!!S.kept[k],bad=(W.keepNo||[]).includes(k),c=bad?K.bad:K.green;sheet(ctx,m+12+P.x,y0+P.y,P.w,24,12,on?c:K.faint,{tint:on?0.16:0.04,blur:0,lw:1.3,ea:on?0.9:0.5,dash:on?null:[4,4]});
        line1(ctx,on?(bad?"✗ ":"✓ ")+W.keep[k]:W.keep[k],m+12+P.x+10,y0+P.y+16.5,P.w-20,12,{w:700,color:rgbaS(on?mixC(c,K.ink,0.25):K.faint,1)});});}  // a kept thing that misleads (w.keepNo) in red
    // the steps of the last run, one after another
    const R=S.res?W.res[S.res]:null,el=R?since(now,S.t0):-1,rows=R?R.steps||[]:[],n=R?Math.min(rows.length,Math.floor(el/STEP)+1):0;
    card(ctx,m,o.st.y,w,o.st.h,K.violet,R?runName():W.stepsT,{size:13});
    if(R){let y=o.st.y+44;rows.slice(0,n).forEach(([s,mk])=>{ctx.save();ctx.fillStyle=rgbaS(mk==="ok"?K.good:mk==="no"?K.bad:mk==="warn"?K.amber:K.violet,1);ctx.beginPath();ctx.arc(m+18,y-4,4,0,TP);ctx.fill();ctx.restore();
        y+=lines(ctx,fill(s,S.v),m+30,y,iw-18,{size:12.5,max:3,w:600,color:rgbaS(mk==="no"?K.bad:K.ink,0.95)})+6;});
      busy(ctx,o.lw-m-18,o.st.y+16,K.violet,now,n<rows.length);if(n<rows.length)api.kick(STEP);}
    else lines(ctx,W.stepsIdle,m+12,o.st.y+o.st.h/2+4,iw,{size:13,max:2,w:600,align:"center",color:rgbaS(K.soft,1)});
    // what came of it
    const Rs=o.res,done=R&&n>=rows.length&&el>=rows.length*STEP;
    if(done){const c=R.tone==="ok"?K.good:R.tone==="no"?K.bad:K.amber;card(ctx,m,Rs.y,w,Rs.h,c,"",{glow:10});let y=Rs.y+26;
      y+=lines(ctx,fill(R.t,S.v),m+12,y,iw,{size:16,max:2,w:800,color:rgbaS(mixC(c,K.ink,0.25),1)})+2;
      if(R.d)y+=lines(ctx,fill(R.d,S.v),m+12,y,iw,{size:12.5,max:5,w:600,color:rgbaS(K.soft,1)});
      if(W.bars&&S.bars){y+=4;W.bars.forEach((b,i)=>{const B=S.bars[i];if(!B)return;meter(ctx,m+12,y,iw,b,B[0],B[1],B[2]==="ok"?K.good:B[2]==="no"?K.bad:K.amber);y+=30;});}}
    else{card(ctx,m,Rs.y,w,Rs.h,null,W.resT,{size:13});lines(ctx,R?W.working:W.idle,m+12,Rs.y+48,iw,{size:12.5,max:3,w:600,color:rgbaS(K.soft,1)});busy(ctx,o.lw-m-18,Rs.y+16,K.violet,now,!!R);}};
  return{S,lay,draw,readouts:[[W.read.run,runName],[W.read.out,()=>S.res?fill(W.res[S.res].short||"–",S.v):"–"]]};}

/* ---------- the rules of each playground ---------- */
// 1 · Context engineering: what the agent reads decides what it writes. Asked how many students were commencing, it cites the
// glossary when the meaning is written there and it can read Docs; with the team's rule (look it up, ask if it isn't there) it asks
// Mei instead of guessing; otherwise it reasons from the names and counts 6,931, as sure as if it knew. The right number is 6,212.
RULE.context=(S,run)=>{const can=S.gloss==="page"&&S.docs==="cqd",asks=S.rule==="ask";
  const bars=(n,ok)=>[[n,(ok?6212:6931)/6931,ok?"ok":"no"],["6,212",6212/6931,"ok"]];
  if(can)return{k:run==="new"?"same":"cite",bars:bars("6,212",true)};
  if(asks)return{k:S.gloss==="mail"?"askMail":"ask",bars:[["–",0,"warn"],["6,212",6212/6931,"ok"]]};
  return{k:run==="new"?"guessNew":"guess",bars:bars("6,931",false)};};
// 2 · Skills and workflows: a workflow runs what's known; a skill holds what was learned; a router picks the skill, or asks a person.
RULE.skill=(S,run)=>{const sk=S.skill==="skill",wf=S.flow==="wf";
  if(run==="agree")return{k:wf?"plain":"agentAgree"};
  if(run==="known")return{k:sk?"known":"afternoon"};
  if(run==="odd")return{k:sk?"router":"oddGuess"};
  if(run==="new"){if(S.kept.fixed)return{k:wf?"once":"fixedAgent"};return sk?{k:"newCase",keep:{mei:true}}:{k:"newNoSkill"};}
  if(run==="add")return S.kept.mei?{k:"added",keep:{fixed:true}}:{k:"addEarly"};};
// 3 · Tools are hands: a leak needs private data, strangers' words and a way out; take one away and nothing can leave. A change
// reaches the count through two people; and an agent with its own identity is the one the log names.
RULE.hands=(S,run)=>{if(run==="ticket"){const masked=S.rows==="masked",shut=S.out==="none";
    return{k:masked&&shut?"heldBoth":masked?"heldMask":shut?"heldOut":"leakRisk"};}
  if(run==="change")return{k:S.repo==="branch"?"twoPeople":"noPeople"};
  if(run==="audit")return{k:S.ident==="own"?"ownName":"asJun"};};
// 4 · Memory for the team: where a lesson is kept, and whether a person reads it first.
RULE.memory=(S,run)=>{const team=S.where==="team",rev=S.review==="person";
  if(run==="april")return{k:team?(rev?"learnedReviewed":"learnedTeam"):"learnedChat",keep:{lesson:true,team:team}};
  if(run==="plant"){if(rev)return{k:"refused"};return team?{k:"keptTeam",keep:{bad:true}}:{k:"keptChat"};}
  if(run==="june"){const b=(n,ok)=>[[n,ok?1:18375/18412,ok?"ok":"no"]];if(S.kept.bad)return{k:"poisoned",bars:b("18,375",false)};
    if(S.kept.lesson&&S.kept.team)return{k:"shared",bars:b("18,412",true)};if(S.kept.lesson)return{k:"repeat",bars:b("18,375",false)};return{k:"nobody",bars:b("18,375",false)};}};
// 5 · Plan, define the check, do, check: name the tools, decide the checks before the work, and keep the tests in people's hands.
RULE.check=(S,run)=>{const b=(l,ok)=>[[l,ok?1:18384/18412,ok?"ok":"no"]];
  if(run==="mei"){if(!S.kept.asked)return{k:"meiEarly"};return{k:"passes",bars:b("18,412",true)};}
  if(S.tools==="none")return{k:"web"};
  if(S.sum==="none")return{k:"short",bars:b("18,384",false)};
  if(S.lock==="agent")return{k:"moved",bars:b("18,384",false)};
  return{k:"asks",keep:{asked:true},bars:b("18,384",false)};};
// 6 · How it goes wrong: six known ways, and a design for each.
RULE.wrong=(S,run)=>({k:S.fail+(S.design==="on"?"On":"Off")});
// 7 · Agents on the platform: three agents, each on its own copy or on the governed tables and tools.
RULE.place=(S,run)=>{const own={a1:141,a2:177,a3:168},v=k=>S[k]==="gov"?168:own[k],ks=["a1","a2","a3"],all=ks.every(k=>S[k]==="gov"),none=ks.every(k=>S[k]==="copy");
  const bars=ks.map(k=>[String(v(k)),v(k)/177,v(k)===168?(S[k]==="gov"?"ok":"warn"):"no"]),low=Math.min(...ks.map(v));
  if(run==="ask")return{k:all?"agree":none?"three":"mixed",bars,v:{a:v("a1"),b:v("a2"),c:v("a3")}};
  if(run==="plan"){if(!all&&low<168)return{k:"short",bars,v:{low,n:168-low}};return{k:all?"planned":"plannedLuck",bars};}
  if(run==="delete")return ks.some(k=>S[k]==="copy")?{k:"stillUsed",bars}:{k:"deleted",bars,keep:{gone:true}};};
// 8 · One set of rules: an agent with a name of its own, under the people's masks, calling models through the gateway.
RULE.gate=(S,run)=>{const own=S.ident==="sp",gw=S.model==="gw";
  if(run==="night"){if(!own)return{k:gw?"asAnilGw":"asAnil"};return{k:gw?"starsGw":"stars",g:gw?["cost"]:[]};}
  if(run==="email")return{k:gw?"hidden":"carried"};
  if(run==="stop")return{k:own?"stopAlone":"stopAnil"};};
// 9 · Context and memory, governed: what's governed decides, memory comes second; and delete a thing where it's kept.
RULE.order=(S,run)=>{const lost=S.line==="lost"&&!S.kept.gone,b=(n,ok)=>[[n,ok?1:1142/1236,ok?"ok":"no"]];
  if(run==="ask"){if(!lost)return{k:S.kept.gone?"afterGone":"whole",bars:b("1,236",true)};return S.order==="gov"?{k:"wins",bars:b("1,236",true)}:{k:"short",bars:b("1,142",false)};}
  if(run==="chat")return{k:lost?"chatGone":"chatNothing"};
  if(run==="line")return S.line==="lost"&&!S.kept.gone?{k:"lineGone",keep:{gone:true}}:{k:"lineNone"};};
/* ---------- From helper to colleague: the same machine, its own rules ---------- */
// 1 · Five stages: freedom a stage at a time, for each kind of task, each through its gate.
RULE.stages=(S,run)=>{const sw=S.how==="switch",gate=S.gate==="held",prod=S.where==="prod";
  if(run==="word")return{k:sw?"wordSwitch":"wordSuggest"};
  if(sw)return{k:prod?"switchProd":"switchTest"};
  if(prod)return{k:"prodDraft"};return{k:gate?"testAlone":"testWaits"};};
// 2 · Borrowed rights: on a person's sign-in, its tools are the boundary; and every log says the person.
RULE.borrow=(S,run)=>{const nar=S.tools==="narrow",mask=S.rows==="masked",asks=S.ask==="asks";
  if(run==="approve")return{k:nar?"cantApprove":asks?"tiredNo":"approvedAsJun"};
  if(run==="steer")return{k:!nar?"steered":mask?"nothingToSteer":"readFull"};
  if(run==="log")return{k:"allJun"};};
// 3 · A place on the map: its own identity, a person who owns it, a role; then the gate, and who stops it.
RULE.checkin=(S,run)=>{const own=S.ident==="own",person=S.owner==="clara",role=S.role==="map";
  if(run==="check"){const miss=[!own&&"own name",!person&&"person who owns it",!role&&"role"].filter(Boolean);
    return miss.length?{k:"checkFails",v:{n:miss.length}}:{k:"checkPasses"};}
  if(run==="gate")return{k:role&&own?"gatePassed":"gateNowhere"};
  if(run==="unsure")return{k:role?"asks":"guesses"};
  if(run==="stop")return{k:!own?"stopsJun":person?"stopsAlone":"nobodyAnswers"};};
// 4 · Rights follow the role: rights from its steps, what it reads first, and asking when the work needs more.
RULE.drawer=(S,run)=>{const steps=S.from==="steps",asks=S.more==="ask",gloss=S.first==="gloss";
  if(run==="count")return{k:steps?"fromSteps":"copied"};
  if(run==="more")return{k:asks?"asks":steps?"noWayIn":"borrowedIn"};
  if(run==="clash")return{k:gloss?"definitionWins":"memoryWins"};};
// 5 · The map enforced: one name in every tool, no secret to leak, a nightly check, and a switch for it alone.
RULE.enforce=(S,run)=>{const own=S.ident==="own",pass=S.secret==="pass",chk=S.check==="on";
  if(run==="audit")return{k:own?"oneSearch":"twoDays"};
  if(run==="grant")return{k:chk?"checkFinds":"driftStays"};
  if(run==="leak")return{k:pass?"nothingToLeak":"keyLeaks"};
  if(run==="stop")return{k:own?"stopsAlone":"stopsJun"};};
// 6 · Every change through review: evidence, an agent's review for reference, people approve, a second person releases.
RULE.review=(S,run)=>{const ev=S.hands==="evidence",people=S.approve==="people",rel=S.release==="gated";
  if(run==="open")return{k:ev?"seen":"codeOnly"};
  if(run==="agent")return{k:ev?"suggests":"nothingToRead"};
  if(run==="approve")return{k:people?"peopleApprove":"selfApproved"};
  if(run==="release")return{k:rel?"released":"straightIn"};};
// 7 · A written mandate: one page, held in every tool, alone in test, a draft in production.
RULE.mandate=(S,run)=>{const page=S.page==="signed",held=S.held==="tools",prod=S.where==="prod";
  if(!page)return{k:"noMandate"};
  if(run==="night")return{k:prod?"prodDraft":held?"fixedAlone":"wordsOnly"};
  if(run==="hr")return{k:held||prod?"tellsOwner":"october"};
  if(run==="meaning")return{k:"asksHR"};
  if(run==="loop")return{k:held?"stopsAtLimit":"runsOn"};};
["context","skill","hands","memory","check","wrong","place","gate","order","stages","borrow","checkin","drawer","enforce","review","mandate"].forEach(id=>{PLAY[id]=(Lb,api)=>machine(Lb,api);});
const BUILD={play:labPlay};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"ag-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","ag-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"ag-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"ag-tab-"+Lb.id,"aria-controls":"ag-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
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
    const vis=DRAW&&f?stage(lw=>({lw,h:f.h?f.h(lw):190}),(ctx,o,now)=>f(ctx,o,now,q,S),q.vis.alt||q.title):null;
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

/* ---------- the scenarios' pictures ---------- */
// Each draws the situation, not its answer: its parts as cards in a row (vis.items), joined by arrows, and a line under them
// (vis.note). Once it's answered (S.done), the joins are drawn in, in gold.
const GO=(S,now)=>S.done?eo(since(now,S.done)/700):0;
VIS.flow=(ctx,o,now,q,S)=>{const V=q.vis,col=K[V.c||"violet"]||K.violet;ground(ctx,o.lw,o.h,col);const m=12,n=V.items.length,t=GO(S,now),gap=26,w=(o.lw-m*2-(n-1)*gap)/n;
  V.items.forEach((s,i)=>{const x=m+i*(w+gap);card(ctx,x,24,w,74,i===n-1&&t>0?K.amber:col,"",{glow:i===n-1&&t>0?10:6});lines(ctx,s,x+8,52,w-16,{size:13,max:2,align:"center"});
    if(i<n-1)arrow(ctx,x+w+3,61,x+w+gap-3,61,t>0?K.amber:K.soft,0.9,{dash:t>=1?null:[4,4],lw:t>0?2.6:2,head:6});});
  if(V.note)lines(ctx,V.note,m,124,o.lw-m*2,{size:13,max:2,align:"center",w:700,color:rgbaS(t>0?K.amber:K.soft,1)});};
VIS.flow.h=()=>160;
})();
