/* Learning Data: What an agent is. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine,
   copied from Data that moves' (assets/data-that-moves/learn.js), the pilot of the standard the author set on 18 November 2026:
   one playground for each film, and one evaluation for the series. The series' labs page and scenarios page load a film's bundle
   (for its text parts: T, tw, rr and withA), the words (learn.en.js or learn.es.js, which set window.AGL), and this file.
   Every lab is a playground (kind "play"): the visitor switches, picks and presses, and watches what happens; each has three to five
   experiments (w.goals), each ticked when the visitor makes it happen, and its end once all are ticked. Each playground's own rules
   are in PLAY below, its words in the pack. Pictures are drawn in the films' white lab: matte off-white cards, ink words, and the
   module's colours only where they mean something.
   The scenarios are the series' evaluation, every one a choice, its options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its words stay
   big enough to read on a phone. Things move and settle, or jump to where they end when the visitor asks for reduced motion, and every
   change is also said in words (.lab-say), so nobody needs the picture to follow.
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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/what-an-agent-is.js)
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

/* ---------- 1 · Decades in the making: an idea that waited ---------- */
// Pick a year, and give the idea what it waited for: the power to run it (graphics chips, from 2012), data (millions of labelled
// examples, from 2012) and money (from 2017). Train, and see what the model of that year could do with what it had.
PLAY.waited=(Lb,api)=>{const W=Lb.w,Y=W.years,S={yi:0,power:false,data:false,money:false,res:null,t0:null};
  const yr=()=>Y[S.yi][0],avail=k=>yr()>=W.since[k];
  const level=()=>{const y=yr(),big=S.power&&S.data;if(y<1986)return"first";if(!big)return"small";if(y<2017)return"photos";if(y<2020||!S.money)return"reads";return y<2022?"writes":"agent";};
  const tg={};
  const r1=api.group(W.yearL);api.seg(r1,Y.map((y,i)=>[String(i),String(y[0])]),"0",v=>{S.yi=+v;S.res=null;["power","data","money"].forEach(k=>{if(S[k]&&!avail(k)){S[k]=false;tg[k].setAttribute("aria-pressed","false");}});api.say(fill(W.msg.year,{y:yr(),what:Y[S.yi][1]}));api.kick(700);},W.yearL);
  const r2=api.group(W.needL);
  ["power","data","money"].forEach(k=>{tg[k]=api.toggle(r2,W.needs[k],false,v=>{if(v&&!avail(k)){tg[k].setAttribute("aria-pressed","false");api.say(fill(W.msg.notYet,{k:W.needs[k],y:W.since[k]}),"warn");return;}S[k]=v;S.res=null;api.say(v?W.msg.on[k]:W.msg.off[k]);api.kick(500);});});
  const r3=api.group();api.btn(r3,W.trainB,()=>{S.t0=performance.now();S.res=null;api.kick(1700);api.say(fill(W.msg.training,{y:yr()}));
    api.later(()=>{const lv=level();S.res=lv;api.kick(900);api.say(W.res[lv].say,lv==="small"&&yr()>=2012?"warn":"ok");
      if(lv==="first")api.reach("first");if(lv==="photos")api.reach("photos");if(lv==="agent")api.reach("agent");if(lv==="small"&&yr()>=2012&&!S.power)api.reach("waited");},1400);},"go");
  const lay=(lw,M)=>{const m=12,o={lw,m},nar=lw<460;o.ic=chipCols(M,W.ideas.map(x=>x[0]),lw-48);o.tl={y:14,h:62};o.ideas={y:o.tl.y+o.tl.h+10,h:44+Math.ceil(W.ideas.length/o.ic)*44};o.needs={y:o.ideas.y+o.ideas.h+10,h:82};o.res={y:o.needs.y+o.needs.h+10,h:nar?124:96};o.h=o.res.y+o.res.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.violet);const m=o.m,w=o.lw-m*2;
    // the years, and the one picked
    const x0=m+22,x1=o.lw-m-22,X=i=>lp(x0,x1,i/(Y.length-1)),ty=o.tl.y+24;
    ctx.save();ctx.strokeStyle=rgbaS(K.faint,1);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,ty);ctx.lineTo(x1,ty);ctx.stroke();ctx.strokeStyle=rgbaS(K.violet,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,ty);ctx.lineTo(X(S.yi),ty);ctx.stroke();ctx.restore();
    Y.forEach((y,i)=>{const on=i<=S.yi;ctx.save();ctx.fillStyle=rgbaS(on?K.violet:K.sheet,1);ctx.strokeStyle=rgbaS(on?K.violet:K.faint,1);ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(i),ty,i===S.yi?7:5,0,TP);ctx.fill();ctx.stroke();ctx.restore();
      T(ctx,String(y[0]),X(i),ty+24,{w:i===S.yi?800:600,size:12.5,align:"center",color:rgbaS(i===S.yi?K.ink:K.soft,1)});});
    // the ideas, each from its year
    card(ctx,m,o.ideas.y,w,o.ideas.h,K.violet,W.ideasL,{size:13});W.ideas.forEach(([s,y],i)=>{const on=yr()>=y,[cx,cy,cw]=chipAt(i,o.ic,m+12,o.ideas.y+32,w-24,38);chip(ctx,cx,cy,cw,38,s,on?K.violet:K.faint,{size:12.5,on,dash:on?null:[4,4],a:on?1:0.7});});
    // what it waited for
    card(ctx,m,o.needs.y,w,o.needs.h,K.amber,W.needL,{size:13});const nk=["power","data","money"],nw=(w-24-12)/3;
    nk.forEach((k,i)=>{const on=S[k],ok=avail(k);chip(ctx,m+12+i*(nw+6),o.needs.y+32,nw,38,ok?W.short[k]:fill(W.from,{y:W.since[k]}),on?K.amber:K.faint,{size:12.5,on,dash:ok?null:[4,4],a:ok?1:0.65});});
    // what came of it
    const R=o.res,tr=S.t0!=null&&S.res==null;
    if(tr){const u=cl(since(now,S.t0)/1400,0,1);card(ctx,m,R.y,w,R.h,K.violet,W.trainingL,{size:13});meter(ctx,m+12,R.y+36,w-24,fill(W.msg.training,{y:yr()}),Math.round(u*100)+"%",u,K.violet);api.kick(60);}
    else if(S.res){const r=W.res[S.res],col=S.res==="small"?K.amber:K.good;result(ctx,m,R.y,w,R.h,col,r.t,r.d,{kicker:fill(W.resK,{y:yr()}),glow:10});}
    else{card(ctx,m,R.y,w,R.h,null,"",{});lines(ctx,W.idle,m+12,R.y+R.h/2-4,w-24,{size:13,max:2,w:600,align:"center",color:rgbaS(K.soft,1)});}};
  return{S,lay,draw,readouts:[[W.read.year,()=>String(yr())],[W.read.ideas,()=>String(W.ideas.filter(x=>yr()>=x[1]).length)+"/"+W.ideas.length],[W.read.can,()=>S.res?W.res[S.res].short:"–"]]};};

/* ---------- 2 · Borrowed from the brain: likely words, and a loop that expects ---------- */
// A model's next word, as a wheel: a slice for each word, sized by its chance; temperature reshapes the slices (each chance to the
// power 1/t, then shared out again), and a spin draws one. Below, a nightly check that only reacts, or one that expects.
PLAY.wheel=(Lb,api)=>{const W=Lb.w,Wd=W.words,S={t:1,spins:[],spin0:null,from:0,to:0,check:"empty",ran:null};let R=rng(7);
  const probs=()=>{const p=Wd.map(([,c])=>Math.pow(c,1/S.t)),s=p.reduce((a,b)=>a+b,0);return p.map(x=>x/s);};
  const draw1=()=>{const p=probs(),r=R();let a=0;for(let i=0;i<p.length;i++){a+=p[i];if(r<a)return i;}return p.length-1;};
  const mid=i=>{const p=probs();let a=0;for(let j=0;j<i;j++)a+=p[j];return(a+p[i]/2)*TP;};
  const r1=api.group(W.tempL);api.seg(r1,W.temps.map(([t,l])=>[String(t),l]),"1",v=>{S.t=+v;S.spins=[];api.say(S.t<1?W.msg.low:S.t>1?W.msg.high:W.msg.mid);api.kick(400);},W.tempL);
  const spin=n=>{const got=[];for(let k=0;k<n;k++)got.push(draw1());S.spins=got.concat(S.spins).slice(0,10);const last=got[got.length-1];
    S.from=S.to;S.to=(Math.floor(S.from/TP)+3)*TP-mid(last);S.spin0=performance.now();api.kick(1500);
    const top=got.filter(i=>i===0).length,diff=new Set(got).size;
    api.say(n===1?fill(W.msg.one,{w:Wd[last][0]}):fill(W.msg.ten,{w:Wd[last][0],n,d:diff,top}));
    if(n>=10&&S.t===1&&diff>1)api.reach("varied");if(n>=10&&S.t<1&&top>=9)api.reach("stuck");if(S.t>1&&got.some(i=>i>=2))api.reach("rare");};
  const r2=api.group();api.btn(r2,W.spinOne,()=>spin(1),"go");api.btn(r2,W.spinTen,()=>spin(10));
  const r3=api.group(W.checkL);api.seg(r3,W.checks,"empty",v=>{S.check=v;S.ran=null;api.say(W.msg.checkSet[v]);api.kick(300);},W.checkL);
  const r4=api.group();api.btn(r4,W.mondayB,()=>{S.ran=S.check;api.kick(900);const c=W.res[S.check];api.say(c.say,c.ok?"ok":"no");if(S.check==="campus")api.reach("expect");});
  const lay=(lw)=>{const m=12,o={lw,m},wide=lw>=460;o.r=wide?Math.min(96,(lw-m*2)*0.2):Math.min(96,(lw-m*2)*0.3);o.wh={y:14,h:wide?o.r*2+72:o.r*2+112+Wd.length*24};  // narrow: the wheel, then its chances and the last spins below
    o.cx=wide?m+12+o.r+4:lw/2;o.cy=o.wh.y+o.r+(wide?58:46);/* below the question, on up to two lines */o.lg={x:wide?o.cx+o.r+24:m+12,y:wide?o.wh.y+70:o.cy+o.r+22,w:wide?lw-m-12-(o.cx+o.r+24):lw-m*2-24};
    o.ex2=!wide;o.mon={y:o.wh.y+o.wh.h+10,h:wide?150:166};o.h=o.mon.y+o.mon.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.blue);const m=o.m,p=probs(),cols=[K.blue,K.violet,K.orange,K.green,K.amber];
    card(ctx,m,o.wh.y,o.lw-m*2,o.wh.h,K.blue,"",{});lines(ctx,W.stem,m+12,o.wh.y+20,o.lw-m*2-24,{size:13,max:2,w:700,color:rgbaS(K.soft,1)});
    const u=S.spin0==null?1:eo(cl(since(now,S.spin0)/1300,0,1)),ang=lp(S.from,S.to,u)-Math.PI/2;let a=ang;
    p.forEach((q,i)=>{ctx.save();ctx.beginPath();ctx.moveTo(o.cx,o.cy);ctx.arc(o.cx,o.cy,o.r,a,a+q*TP);ctx.closePath();ctx.fillStyle=rgbaS(cols[i],0.25+0.5*(i===0?1:0.6));ctx.fill();ctx.strokeStyle=rgbaS(K.sheet,1);ctx.lineWidth=2;ctx.stroke();ctx.restore();a+=q*TP;});
    ctx.save();ctx.fillStyle=rgbaS(K.ink,1);ctx.beginPath();ctx.moveTo(o.cx,o.cy-o.r+10);ctx.lineTo(o.cx-8,o.cy-o.r-12);ctx.lineTo(o.cx+8,o.cy-o.r-12);ctx.closePath();ctx.fill();ctx.restore();
    if(u<1)api.kick(60);
    // the chances, and the last spins
    const L2=o.lg;Wd.forEach(([s],i)=>{const y=L2.y+i*24;ctx.save();ctx.fillStyle=rgbaS(cols[i],0.8);rr(ctx,L2.x,y-10,12,12,3);ctx.fill();ctx.restore();
      line1(ctx,s,L2.x+18,y,L2.w*0.45,12.5,{w:700});const bw=L2.w*0.4;ctx.save();ctx.fillStyle="rgba(60,50,40,0.1)";rr(ctx,L2.x+L2.w*0.47,y-9,bw,9,4);ctx.fill();ctx.fillStyle=rgbaS(cols[i],0.9);rr(ctx,L2.x+L2.w*0.47,y-9,Math.max(4,bw*p[i]),9,4);ctx.fill();ctx.restore();
      T(ctx,Math.round(p[i]*100)+"%",L2.x+L2.w,y,{w:700,size:12,align:"right",color:rgbaS(K.soft,1)});});
    if(S.spins.length&&u>=1){const sy=L2.y+Wd.length*24+4;lines(ctx,W.lastL+": "+S.spins.slice(0,6).map(i=>Wd[i][0]).join(", "),L2.x,sy,L2.w,{size:12.5,max:o.lw>=460?1:2,w:600,color:rgbaS(K.soft,1)});}
    // Monday night: what each campus sent, against what was expected, and the check's verdict
    const M=o.mon,w=o.lw-m*2;card(ctx,m,M.y,w,M.h,K.orange,W.monL,{size:13});const cw=(w-24-12)/3;
    W.campus.forEach(([s,ex,got],i)=>{const x=m+12+i*(cw+6),y=M.y+34,hh=o.ex2?88:72,sh=S.ran?got/ex:0;sheet(ctx,x,y,cw,hh,8,null,{blur:0});
      const d2=o.ex2?15:0;line1(ctx,s,x+8,y+18,cw-16,12.5,{w:800});lines(ctx,fill(W.expL,{n:ex.toLocaleString("en")}),x+8,y+36,cw-16,{size:12,max:o.ex2?2:1,w:600,color:rgbaS(K.soft,1)});
      ctx.save();ctx.fillStyle="rgba(60,50,40,0.1)";rr(ctx,x+8,y+46+d2,cw-16,8,4);ctx.fill();ctx.fillStyle=rgbaS(sh<0.5&&S.ran?K.bad:K.green,0.9);if(S.ran&&sh>0)rr(ctx,x+8,y+46+d2,(cw-16)*Math.min(1,sh),8,4),ctx.fill();ctx.restore();
      if(S.ran)line1(ctx,fill(W.gotL,{n:got.toLocaleString("en")}),x+8,y+66+d2,cw-16,12,{w:700,color:rgbaS(got===0?K.bad:K.ink,1)});});
    if(S.ran){const c=W.res[S.ran];pill(ctx,o.lw/2,M.y+M.h-28,c.short,c.ok?K.good:K.bad,{align:"center",size:12,max:w-24});}
    else line1(ctx,W.monIdle,m+12,M.y+M.h-14,w-24,12.5,{w:600,align:"center",color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.temp,()=>W.temps.find(x=>+x[0]===S.t)[1]],[W.read.top,()=>Math.round(probs()[0]*100)+"%"],[W.read.spins,()=>String(S.spins.length)]]};};

/* ---------- 3 · A model, reasoning, hands and a loop: the four parts, or a plain script ---------- */
// Switch on the parts the model gets, ask for the census-day count, and watch the steps it can take with them. Then, once the count
// is known, next March runs again: as the agent, or as the saved query, a plain script.
PLAY.parts=(Lb,api)=>{const W=Lb.w,X=W.st,S={reason:false,hands:false,loop:false,run:null,t0:null,recipe:false,mode:"agent",march:null,m0:null};
  const plan=()=>{const r=S.reason,hd=S.hands,lo=S.loop;
    if(!hd&&!r)return{k:"guess",rows:[[X.guess,"warn"]]};
    if(!hd)return{k:"plan",rows:[[X.plan,null],[X.noHands,"no"]]};
    if(!r&&!lo)return{k:"short",rows:[[X.catalog,"ok"],[X.query,null],[X.bring,"warn"]]};
    if(!r)return{k:"limit",rows:[[X.catalog,"ok"],[X.query,null],[X.same,"no"],[X.same,"no"],[X.limit,"no"]]};
    if(!lo)return{k:"failed",rows:[[X.plan,null],[X.catalog,"ok"],[X.query,null],[X.check,"no"],[X.stop,"warn"]]};
    return{k:"answer",rows:[[X.plan,null],[X.catalog,"ok"],[X.query,null],[X.check,"no"],[X.rule,"ok"],[X.query2,"ok"],[X.pass,"ok"]]};};
  const STEP=420;
  const r1=api.group(W.partsL);
  api.toggle(r1,W.parts.reason,false,v=>{S.reason=v;S.run=null;api.say(v?W.msg.reasonOn:W.msg.reasonOff);api.kick(300);});
  api.toggle(r1,W.parts.hands,false,v=>{S.hands=v;S.run=null;api.say(v?W.msg.handsOn:W.msg.handsOff);api.kick(300);});
  api.toggle(r1,W.parts.loop,false,v=>{S.loop=v;S.run=null;api.say(v?W.msg.loopOn:W.msg.loopOff);api.kick(300);});
  const r2=api.group();api.btn(r2,W.askB,()=>{const p=plan();S.run=p;S.t0=performance.now();const dur=p.rows.length*STEP;api.kick(dur+600);api.say(W.msg.asking);
    api.later(()=>{const r=W.res[p.k];api.say(r.say,p.k==="answer"?"ok":p.k==="guess"||p.k==="plan"?"warn":"no");
      if(p.k==="guess")api.reach("guess");if(p.k==="short"||p.k==="failed"||p.k==="limit")api.reach("short");if(p.k==="answer"){S.recipe=true;api.reach("loop");}},dur);},"go");
  const r3=api.group(W.marchL);api.seg(r3,W.modes,"agent",v=>{S.mode=v;S.march=null;api.say(W.msg["mode_"+v]);api.kick(300);},W.marchL);
  api.btn(r3,W.marchB,()=>{if(S.mode==="script"&&!S.recipe){S.march=null;api.say(W.msg.noRecipe,"warn");return;}S.march=S.mode;S.m0=performance.now();api.kick(1800);
    api.say(S.mode==="script"?W.msg.marchScript:W.msg.marchAgent,S.mode==="script"?"ok":"warn");if(S.mode==="script")api.reach("script");});
  const lay=(lw,M)=>{const m=12,o={lw,m},nar=lw<460;o.pc=chipCols(M,["model","reason","hands","loop"].map(k=>W.short[k]),lw-48);o.top={y:12,h:46+Math.ceil(4/o.pc)*44};o.st={y:o.top.y+o.top.h+10,h:40+7*22};o.res={y:o.st.y+o.st.h+10,h:nar?92:72};o.mar={y:o.res.y+o.res.h+10,h:74};o.h=o.mar.y+o.mar.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.blue);const m=o.m,w=o.lw-m*2;
    card(ctx,m,o.top.y,w,o.top.h,K.blue,W.agentL,{size:13});const ks=["model","reason","hands","loop"];
    ks.forEach((k,i)=>{const on=k==="model"||S[k],[cx,cy,cw]=chipAt(i,o.pc,m+12,o.top.y+34,w-24,38);chip(ctx,cx,cy,cw,38,W.short[k],on?K.blue:K.faint,{size:12.5,on,dash:on?null:[4,4],a:on?1:0.7});});
    // the steps it takes
    card(ctx,m,o.st.y,w,o.st.h,K.violet,W.stepsL,{size:13});
    if(S.run){const n=Math.min(S.run.rows.length,Math.floor(since(now,S.t0)/STEP)+1);steps(ctx,m+14,o.st.y+44,w-28,S.run.rows.slice(0,n),K.violet,{lh:22});if(n<S.run.rows.length)api.kick(80);busy(ctx,o.lw-m-18,o.st.y+16,K.violet,now,n<S.run.rows.length);}
    else lines(ctx,W.idle,m+14,o.st.y+o.st.h/2,w-28,{size:13,max:2,w:600,align:"center",color:rgbaS(K.soft,1)});
    // what it brings Jun
    const done=S.run&&since(now,S.t0)>=S.run.rows.length*STEP;
    if(done){const r=W.res[S.run.k],col=S.run.k==="answer"?K.good:S.run.k==="guess"||S.run.k==="plan"?K.amber:K.bad;result(ctx,m,o.res.y,w,o.res.h,col,r.t,r.d,{glow:10});}
    else{card(ctx,m,o.res.y,w,o.res.h,null,W.bringL,{size:13});}
    // next March
    const Mr=o.mar;card(ctx,m,Mr.y,w,Mr.h,K.green,W.marchL,{size:13,right:150});pill(ctx,o.lw-m-10,Mr.y+8,S.recipe?W.recipeYes:W.recipeNo,S.recipe?K.good:K.faint,{align:"right",size:12});
    if(S.march){const u=cl(since(now,S.m0)/(S.march==="script"?400:1600),0,1);meter(ctx,m+12,Mr.y+32,w-24,S.march==="script"?W.scriptL:W.agentRunL,S.march==="script"?W.scriptV:W.agentV,u,S.march==="script"?K.good:K.amber);if(u<1)api.kick(60);}
    else line1(ctx,W.marchIdle,m+12,Mr.y+54,w-24,12.5,{w:600,color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.count,()=>S.run&&W.res[S.run.k].count||"–"],[W.read.evidence,()=>S.run&&S.run.k==="answer"?W.read.yes:S.run?W.read.no:"–"],[W.read.march,()=>S.march?(S.march==="script"?W.scriptV:W.agentV):"–"]]};};

/* ---------- 4 · It feels like understanding: say what you mean, check against what it didn't make ---------- */
// Ask how many students the Faculty of Health has, and plan its advisers on the answer: each adviser calls 240 students a term.
// The faculty has 2,880 people; the table the agent reads counts full-time equivalents, 2,160. What reaches Anil depends on the
// question's unit, whether the agent reads it back first, and what its check compares.
PLAY.unit=(Lb,api)=>{const W=Lb.w,S={unit:"students",back:false,chk:"table",ran:null,t0:null};const PEOPLE=2880,FTE=2160,PER=240;
  const r1=api.group(W.unitL);api.seg(r1,W.units,"students",v=>{S.unit=v;S.ran=null;api.say(W.msg["unit_"+v]);api.kick(300);},W.unitL);
  const r2=api.group(W.firstL);api.toggle(r2,W.backT,false,v=>{S.back=v;S.ran=null;api.say(v?W.msg.backOn:W.msg.backOff);api.kick(300);});
  const r3=api.group(W.chkL);api.seg(r3,W.chks,"table",v=>{S.chk=v;S.ran=null;api.say(W.msg["chk_"+v]);api.kick(300);},W.chkL);
  const r4=api.group();api.btn(r4,W.askB,()=>{const people=S.unit==="people"||S.back,count=people?PEOPLE:FTE,pass=S.chk==="table"||count===PEOPLE,adv=pass?Math.ceil(count/PER):null;
    S.ran={people,count,pass,adv,back:S.back&&S.unit!=="people",miss:adv==null?0:Math.max(0,PEOPLE-adv*PER)};S.t0=performance.now();api.kick(2000);
    const bits=[];if(S.ran.back)bits.push(W.msg.saidBack);bits.push(fill(W.msg.count,{n:count.toLocaleString("en")}));
    if(!pass)bits.push(W.msg.flag);else if(S.ran.miss)bits.push(fill(W.msg.short,{a:adv,m:S.ran.miss}));else bits.push(fill(W.msg.right,{a:adv}));
    api.say(bits.join(" "),!pass?"warn":S.ran.miss?"no":"ok");
    if(pass&&S.ran.miss)api.reach("tick");if(S.ran.back)api.reach("back");if(!pass)api.reach("list");if(pass&&!S.ran.miss)api.reach("twelve");},"go");
  const lay=(lw)=>{const m=12,o={lw,m};o.q={y:12,h:92};o.a={y:o.q.y+o.q.h+10,h:96};o.p={y:o.a.y+o.a.h+10,h:lw<460?124:108};o.h=o.p.y+o.p.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.green);const m=o.m,w=o.lw-m*2,R=S.ran,u=R?cl(since(now,S.t0)/1200,0,1):0;
    // Jun's question, and the agent reading it back
    card(ctx,m,o.q.y,w,o.q.h,K.blue,W.qL,{size:13});lines(ctx,S.unit==="people"?W.qPeople:W.qStudents,m+12,o.q.y+42,w-24,{size:13.5,max:2,w:700});
    if(S.back)line1(ctx,S.unit==="people"?W.backSame:W.backAsk,m+12,o.q.y+o.q.h-10,w-24,12.5,{w:600,color:rgbaS(K.violet,1)});
    // the agent's answer, and its check
    card(ctx,m,o.a.y,w,o.a.h,K.violet,W.aL,{size:13});
    if(R&&u>0.25){T(ctx,R.count.toLocaleString("en"),m+14,o.a.y+62,{w:800,size:28,color:rgbaS(K.ink,1)});const nx=m+14+TW(ctx,R.count.toLocaleString("en"),28,800)+10;line1(ctx,R.people?W.unitPeople:W.unitFte,nx,o.a.y+60,o.lw-m-12-nx,12.5,{w:700,color:rgbaS(K.soft,1)});
      pill(ctx,o.lw-m-10,o.a.y+8,R.pass?W.passL:W.failL,R.pass?K.good:K.amber,{align:"right",size:12});line1(ctx,S.chk==="table"?W.vsTable:W.vsList,m+14,o.a.y+o.a.h-12,w-28,12,{w:600,color:rgbaS(K.soft,1)});}
    else line1(ctx,W.aIdle,m+14,o.a.y+60,w-28,13,{w:600,color:rgbaS(K.soft,1)});
    // the advisers, and every student who gets a call: a dot for each 80 students
    card(ctx,m,o.p.y,w,o.p.h,K.orange,W.pL,{size:13});const dots=PEOPLE/80,cols=Math.floor((w-24)/14),covered=R&&R.adv?R.adv*PER/80:0;
    for(let i=0;i<dots;i++){const x=m+14+(i%cols)*14,y=o.p.y+38+Math.floor(i/cols)*14,on=R&&u>0.6&&i<covered;ctx.save();ctx.fillStyle=rgbaS(!R||u<=0.6?K.faint:R.adv==null?K.amber:on?K.good:K.bad,!R||u<=0.6?0.5:1);ctx.beginPath();ctx.arc(x+4,y,4.2,0,TP);ctx.fill();ctx.restore();}
    const nar=o.lw<460,ly=o.p.y+o.p.h-(nar?28:12);if(R&&u>0.6)lines(ctx,R.adv==null?W.pWait:fill(R.miss?W.pShort:W.pAll,{a:R.adv,m:R.miss}),m+12,ly,w-24,{size:12.5,max:nar?2:1,w:700,color:rgbaS(R.adv==null?K.amber:R.miss?K.bad:K.good,1)});
    else lines(ctx,W.pIdle,m+12,ly,w-24,{size:12.5,max:nar?2:1,w:600,color:rgbaS(K.soft,1)});if(R&&u<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.count,()=>S.ran?S.ran.count.toLocaleString("en"):"–"],[W.read.adv,()=>S.ran&&S.ran.adv!=null?String(S.ran.adv):"–"],[W.read.miss,()=>S.ran&&S.ran.adv!=null?String(S.ran.miss):"–"]]};};

/* ---------- 5 · More than a junior: its caution in its rights, its memory in the notes, every yes with a person ---------- */
// Four jobs in Jun's week. The agent's rights, where its memory lives and who says yes decide how each turns out: a path drawn in a
// minute, a correction kept or forgotten by the next session, and three tables nothing seems to read, one of them read once a year.
PLAY.junior=(Lb,api)=>{const W=Lb.w,S={rights:"free",mem:"session",yes:"agent",fixed:false,count:null,path:null,tables:null,t0:null,job:null};
  const r1=api.group(W.rightsL);api.seg(r1,W.rightsO,"free",v=>{S.rights=v;api.say(W.msg["rights_"+v]);api.kick(300);},W.rightsL);
  const r2=api.group(W.memL);api.seg(r2,W.memO,"session",v=>{S.mem=v;api.say(W.msg["mem_"+v]);api.kick(300);},W.memL);
  const r3=api.group(W.yesL);api.seg(r3,W.yesO,"agent",v=>{S.yes=v;api.say(W.msg["yes_"+v]);api.kick(300);},W.yesL);
  const go=(job)=>{S.job=job;S.t0=performance.now();api.kick(1600);};
  const r4=api.group(W.jobsL);
  api.btn(r4,W.pathB,()=>{go("path");S.path=true;api.say(W.msg.path,"ok");api.reach("path");});
  api.btn(r4,W.fixB,()=>{go("fix");S.fixed=true;S.count=4867;api.say(W.msg.fix,"ok");});
  api.btn(r4,W.nextB,()=>{go("next");if(!S.fixed){S.count=4812;api.say(W.msg.nextNoFix,"warn");return;}const keep=S.mem==="notes";S.count=keep?4867:4812;
    api.say(keep?W.msg.nextKept:W.msg.nextLost,keep?"ok":"no");api.reach(keep?"lasts":"forgets");});
  api.btn(r4,W.speedB,()=>{go("speed");const free=S.rights==="free",self=S.yes==="agent";
    S.tables=free?"gone":self?"self":"kept";api.say(free?W.msg.speedFree:self?W.msg.speedSelf:W.msg.speedKept,S.tables==="kept"?"ok":"no");if(S.tables==="kept")api.reach("yearly");});
  const lay=(lw,M)=>{const m=12,o={lw,m};o.sc=chipCols(M,[...Object.values(W.short.rights),...Object.values(W.short.mem),...Object.values(W.short.yes)],lw-48,3);o.tc=chipCols(M,W.tables,lw-48);o.ag={y:12,h:(lw<460?70:56)+Math.ceil(3/o.sc)*46};o.cnt={y:o.ag.y+o.ag.h+10,h:84};o.tb={y:o.cnt.y+o.cnt.h+10,h:64+Math.ceil(3/o.tc)*46};o.h=o.tb.y+o.tb.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.orange);const m=o.m,w=o.lw-m*2,u=S.t0==null?1:cl(since(now,S.t0)/900,0,1);if(u<1)api.kick(60);
    // how it's set up: its rights, its memory, who says yes
    card(ctx,m,o.ag.y,w,o.ag.h,K.orange,W.setL,{size:13});
    [[W.short.rights[S.rights],S.rights==="box"],[W.short.mem[S.mem],S.mem==="notes"],[W.short.yes[S.yes],S.yes==="person"]].forEach(([s,good],i)=>{const[cx,cy,cw]=chipAt(i,o.sc,m+12,o.ag.y+34,w-24,40);chip(ctx,cx,cy,cw,40,s,good?K.green:K.amber,{size:12.5,on:true});});
    lines(ctx,S.path?W.pathDone:W.pathIdle,m+12,o.ag.y+o.ag.h-(o.lw<460?22:8),w-24,{size:12,max:o.lw<460?2:1,w:600,color:rgbaS(S.path?K.good:K.soft,1)});
    // this year's count of awards
    card(ctx,m,o.cnt.y,w,o.cnt.h,K.blue,W.cntL,{size:13,right:120});if(S.count){T(ctx,S.count.toLocaleString("en"),m+14,o.cnt.y+60,{w:800,size:26,color:rgbaS(S.count===4867?K.good:K.bad,1)});
      line1(ctx,S.count===4867?W.withMicro:W.noMicro,m+14+TW(ctx,"4,867",26,800)+12,o.cnt.y+58,w-150,12.5,{w:600,color:rgbaS(K.soft,1)});}
    else line1(ctx,W.cntIdle,m+14,o.cnt.y+58,w-28,12.5,{w:600,color:rgbaS(K.soft,1)});
    pill(ctx,o.lw-m-10,o.cnt.y+8,S.mem==="notes"?W.notesOn:W.notesOff,S.mem==="notes"?K.good:K.faint,{align:"right",size:12});
    // the nightly run's three tables
    card(ctx,m,o.tb.y,w,o.tb.h,K.violet,W.tbL,{size:13});
    W.tables.forEach((s,i)=>{const yearly=i===2,st=S.tables,gone=st==="gone"||st==="self"||(st==="kept"&&!yearly),[x,y,tw_]=chipAt(i,o.tc,m+12,o.tb.y+34,w-24,40);
      chip(ctx,x,y,tw_,40,s,yearly?K.amber:K.violet,{size:12.5,strike:st&&gone&&u>0.5,a:st&&gone&&u>0.5?0.6:1,mark:st&&u>0.5?(yearly?(st==="kept"?"ok":"no"):null):null});});
    line1(ctx,S.tables?W.tbRes[S.tables]:W.tbIdle,m+12,o.tb.y+o.tb.h-12,w-24,12.5,{w:700,color:rgbaS(S.tables==="kept"?K.good:S.tables?K.bad:K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.count,()=>S.count?S.count.toLocaleString("en"):"–"],[W.read.yearly,()=>S.tables==null?"–":S.tables==="kept"?W.read.kept:W.read.gone],[W.read.yes,()=>W.short.yes[S.yes]]]};};

/* ---------- 6 · Minds that change: three answers, or a checked one ---------- */
// Which faculty lost the most first-years? Each new chat can bring another answer, as sure as the last; "are you sure?" brings a third.
// Check the work instead: every answer shows where it came from, and the number is reached a second way. They disagree until the
// three students counted twice are fixed; then Clara signs, and the agent never does.
PLAY.minds=(Lb,api)=>{const W=Lb.w,A=W.answers,S={cur:null,seen:new Set(),asks:0,ev:false,two:false,checked:null,dup:true,signed:false,mem:false,t0:null};
  const r1=api.group(W.askL);
  api.btn(r1,W.askB,()=>{S.cur=S.asks%2;S.asks++;S.seen.add(S.cur);S.checked=null;S.signed=false;S.t0=performance.now();api.kick(900);api.say(fill(W.msg.ask,{who:A[S.cur].who,a:A[S.cur].t}));if(S.seen.size>=3)api.reach("three");},"go");
  api.btn(r1,W.sureB,()=>{if(S.cur==null){api.say(W.msg.askFirst,"warn");return;}S.cur=2;S.seen.add(2);S.checked=null;S.signed=false;S.t0=performance.now();api.kick(900);api.say(fill(W.msg.sure,{a:A[2].t}),"warn");if(S.seen.size>=3)api.reach("three");});
  api.btn(r1,W.memB,()=>{S.mem=true;api.kick(600);api.say(W.msg.mem,"warn");});
  const r2=api.group(W.checkL);
  api.toggle(r2,W.evT,false,v=>{S.ev=v;S.checked=null;api.say(v?W.msg.evOn:W.msg.evOff);api.kick(300);});
  api.toggle(r2,W.twoT,false,v=>{S.two=v;S.checked=null;api.say(v?W.msg.twoOn:W.msg.twoOff);api.kick(300);});
  const r3=api.group();
  api.btn(r3,W.checkB,()=>{if(S.cur==null){api.say(W.msg.askFirst,"warn");return;}if(!S.ev&&!S.two){api.say(W.msg.nothing,"warn");return;}S.checked=performance.now();api.kick(1400);
    const bits=[];if(S.ev)bits.push(S.cur===1?W.msg.noReview:W.msg.shows);if(S.two)bits.push(S.dup?W.msg.disagree:W.msg.agree);api.say(bits.join(" "),S.two&&!S.dup?"ok":"warn");
    if(S.ev&&S.cur===1)api.reach("source");if(S.two&&S.dup)api.reach("twoways");});
  api.btn(r3,W.fixB,()=>{if(!S.two||S.checked==null){api.say(W.msg.fixFirst,"warn");return;}S.dup=false;S.checked=performance.now();api.kick(1200);api.say(W.msg.fixed,"ok");});
  api.btn(r3,W.signB,()=>{if(!(S.ev&&S.two&&!S.dup&&S.checked!=null)){api.say(W.msg.signNo,"warn");return;}S.signed=true;api.kick(900);api.say(W.msg.signed,"ok");api.reach("signed");});
  const lay=(lw,M)=>{const m=12,o={lw,m};o.th=A.every(a=>TW(M,a.who+": "+a.t,12.5,700)<=lw-56)?28:40;o.ch={y:12,h:40+A.length*(o.th+6)+6};o.ev={y:o.ch.y+o.ch.h+10,h:138};o.h=o.ev.y+o.ev.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.violet);const m=o.m,w=o.lw-m*2;
    // the answers each chat gave
    card(ctx,m,o.ch.y,w,o.ch.h,K.violet,W.chatsL,{size:13});
    A.forEach((a,i)=>{const y=o.ch.y+34+i*(o.th+6),seen=S.seen.has(i),cur=S.cur===i;if(!seen){tile(ctx,m+12,y,w-24,o.th,"",K.faint,{a:0.35});return;}
      tile(ctx,m+12,y,w-24,o.th,a.who+": "+a.t,cur?K.violet:K.soft,{size:12.5,edge:cur?K.violet:null,a:cur?1:0.75,mark:S.ev&&S.checked!=null&&cur&&i===1?"no":null});});
    if(S.mem)line1(ctx,W.memLine,m+12,o.ch.y+o.ch.h-4,w-24,12,{w:600,color:rgbaS(K.amber,1)});
    // the work, checked: where it came from, and two ways to the number
    const E=o.ev;card(ctx,m,E.y,w,E.h,K.green,W.workL,{size:13,right:110});
    if(S.signed)pill(ctx,o.lw-m-10,E.y+8,W.signedL,K.good,{align:"right",size:12});
    if(S.checked!=null){const u=cl(since(now,S.checked)/800,0,1);if(u<1)api.kick(60);let y=E.y+48;
      if(S.ev){line1(ctx,S.cur===1?W.evBad:W.evGood,m+12,y,w-24,12.5,{w:700,color:rgbaS(S.cur===1?K.bad:K.ink,1)});y+=22;}
      if(S.two){const a=S.dup?134:131,b=131,bw=w-24-120;[[W.wayA,a],[W.wayB,b]].forEach(([s,n],i)=>{const yy=y+i*24;line1(ctx,s,m+12,yy,110,12.5,{w:600,color:rgbaS(K.soft,1)});
          ctx.save();ctx.fillStyle=rgbaS(a!==b?K.amber:K.green,0.85);rr(ctx,m+12+116,yy-10,bw*(n/140)*u,11,4);ctx.fill();ctx.restore();T(ctx,String(n),m+12+116+bw*(n/140)*u+6,yy,{w:800,size:12.5,color:rgbaS(K.ink,1)});});
        y+=50;line1(ctx,S.dup?W.dupL:W.okL,m+12,y,w-24,12.5,{w:700,color:rgbaS(S.dup?K.amber:K.good,1)});}}
    else lines(ctx,W.workIdle,m+12,E.y+60,w-24,{size:13,max:2,w:600,align:"center",color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.answers,()=>String(S.seen.size)],[W.read.ways,()=>S.two&&S.checked!=null?(S.dup?"134 · 131":"131 · 131"):"–"],[W.read.signed,()=>S.signed?W.read.yes:W.read.no]]};};

/* ---------- 7 · Ethics we can't read, accountability it can't hold: blunt the horns ---------- */
// At two in the morning, the census-day count fails its checks. Write the night's rules: what the agent may touch and reach, what it's
// asked to do, and who approves. Then run the night, or ask it to compare the university with others.
PLAY.night=(Lb,api)=>{const W=Lb.w,S={touch:"real",reach:"web",ask:"pass",appr:"self",night:null,t0:null,web:null};
  ["touch","reach","ask","appr"].forEach(k=>{const r=api.group(W.L[k]);api.seg(r,W.O[k],S[k],v=>{S[k]=v;S.night=null;S.web=null;api.say(W.msg[k+"_"+v]);api.kick(300);},W.L[k]);});
  const r5=api.group();
  api.btn(r5,W.nightB,()=>{const gone=S.ask==="pass",real=S.touch==="real",person=S.appr==="person";
    const k=gone?(real?"goneLive":person?"goneCaught":"goneSelf"):(real?"realFix":person?"answers":"selfOk");S.night=k;S.t0=performance.now();api.kick(2600);api.say(W.msg.running);
    api.later(()=>{api.say(W.res[k].say,k==="answers"?"ok":k==="goneCaught"?"warn":"no");if(gone)api.reach("untied");if(!gone&&!real)api.reach("question");if(k==="answers")api.reach("answers");},1800);},"go");
  api.btn(r5,W.compareB,()=>{S.web=S.reach;S.t0=performance.now();api.kick(1600);api.say(S.reach==="web"?W.msg.webOut:W.msg.webIn,S.reach==="web"?"no":"ok");if(S.reach==="own")api.reach("fence");});
  const lay=(lw)=>{const m=12,o={lw,m},nar=lw<460;o.fl={y:12,h:nar?166:150};o.out={y:o.fl.y+o.fl.h+10,h:nar?124:92};o.h=o.out.y+o.out.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.amber);const m=o.m,w=o.lw-m*2,u=S.t0==null?1:cl(since(now,S.t0)/1800,0,1);if(u<1)api.kick(60);
    // the night: the agent inside its fence, the test copy, the real count, and the web outside
    const F=o.fl;card(ctx,m,F.y,w,F.h,K.amber,W.fenceL,{size:13,dash:S.reach==="own"?null:[6,5]});
    const bw=(w-24-12)/3,y=F.y+40;chip(ctx,m+12,y,bw,40,W.agentL,K.violet,{size:13,on:true});chip(ctx,m+12+bw+6,y,bw,40,W.testL,K.blue,{size:12.5,on:S.touch==="test"});chip(ctx,m+12+2*(bw+6),y,bw,40,W.countL,K.orange,{size:12.5,on:S.touch==="real"});
    arrow(ctx,m+12+bw,y+20,m+12+bw+6,y+20,K.soft,0.6,{head:5});
    line1(ctx,S.reach==="web"?W.webOpen:W.webShut,m+12,y+64,w-24,12.5,{w:700,color:rgbaS(S.reach==="web"?K.bad:K.good,1)});
    if(S.web&&u<1){const x=lp(m+12+bw/2,o.lw-m,ei(u));tile(ctx,Math.min(x,o.lw-m-60),y+74,56,20,W.reqL,S.web==="web"?K.bad:K.faint,{size:12,a:S.web==="web"?1:1-u});}
    lines(ctx,fill(W.rulesL,{ask:W.short.ask[S.ask],appr:W.short.appr[S.appr]}),m+12,F.y+F.h-(o.lw<460?26:12),w-24,{size:12,max:o.lw<460?2:1,w:600,color:rgbaS(K.soft,1)});
    // the morning: the count, and who answers for it
    const O=o.out;if(S.night&&u>=1){const r=W.res[S.night],ok=S.night==="answers";result(ctx,m,O.y,w,O.h,ok?K.good:S.night==="goneCaught"?K.amber:K.bad,r.t,r.d,{kicker:W.morningL,glow:10});}
    else{card(ctx,m,O.y,w,O.h,null,W.morningL,{size:13});line1(ctx,S.night?W.workingL:W.outIdle,m+12,O.y+56,w-24,12.5,{w:600,color:rgbaS(K.soft,1)});busy(ctx,o.lw-m-18,O.y+18,K.violet,now,!!S.night);}};
  return{S,lay,draw,readouts:[[W.read.count,()=>S.night?W.res[S.night].count:"–"],[W.read.answers,()=>S.night?W.res[S.night].who:"–"]]};};

/* ---------- 8 · Why we govern them: an owner, a name, limits and review ---------- */
// Switch on what the university asks of any new colleague, then let four things happen to Jun's agent and see how each turns out.
PLAY.colleague=(Lb,api)=>{const W=Lb.w,S={owner:false,name:false,limits:false,review:false,log:[]};
  const r1=api.group(W.rulesL);["owner","name","limits","review"].forEach(k=>api.toggle(r1,W.rules[k],false,v=>{S[k]=v;api.say(v?W.msg.on[k]:W.msg.off[k]);api.kick(300);}));
  const ev=(k)=>{const good=k==="moves"?S.owner:k==="who"||k==="stop"?S.name:S.limits&&S.review;const r=k==="change"?(S.limits?(S.review?"good":"noReview"):"noLimits"):good?"good":"bad";
    S.log.unshift({k,r,t:performance.now()});S.log=S.log.slice(0,4);api.kick(900);api.say(W.ev[k][r],r==="good"?"ok":"no");
    if(r==="good")api.reach(k==="moves"?"handed":k==="change"?"approved":k==="who"?"seen":"stopped");};
  const r2=api.group(W.eventsL);["moves","who","stop","change"].forEach(k=>api.btn(r2,W.evB[k],()=>ev(k)));
  const lay=(lw)=>{const m=12,o={lw,m};o.r={y:12,h:84};o.lg={y:o.r.y+o.r.h+10,h:40+4*50};o.h=o.lg.y+o.lg.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.green);const m=o.m,w=o.lw-m*2;
    card(ctx,m,o.r.y,w,o.r.h,K.green,W.askedL,{size:13});const ks=["owner","name","limits","review"],cw=(w-24-18)/4;
    ks.forEach((k,i)=>chip(ctx,m+12+i*(cw+6),o.r.y+34,cw,38,W.short[k],S[k]?K.green:K.faint,{size:12.5,on:S[k],dash:S[k]?null:[4,4],a:S[k]?1:0.75}));
    card(ctx,m,o.lg.y,w,o.lg.h,K.blue,W.logL,{size:13});
    if(!S.log.length)lines(ctx,W.logIdle,m+12,o.lg.y+o.lg.h/2,w-24,{size:13,max:2,w:600,align:"center",color:rgbaS(K.soft,1)});
    S.log.forEach((e,i)=>{const y=o.lg.y+36+i*50,u=cl(since(now,e.t)/500,0,1),good=e.r==="good";withA(ctx,i===0?u:0.85,()=>{sheet(ctx,m+12,y,w-24,44,8,good?K.good:K.bad,{blur:0,tint:0.08});
      line1(ctx,W.evB[e.k],m+22,y+18,w-44,12.5,{w:800});line1(ctx,W.evShort[e.k][e.r],m+22,y+36,w-44,12,{w:600,color:rgbaS(good?K.good:K.bad,1)});});if(u<1)api.kick(60);});};
  return{S,lay,draw,readouts:[[W.read.set,()=>[S.owner,S.name,S.limits,S.review].filter(Boolean).length+"/4"],[W.read.last,()=>S.log.length?(S.log[0].r==="good"?W.read.held:W.read.broke):"–"]]};};

/* ---------- 9 · What they tell us about ourselves: a rough copy ---------- */
// Three of the coffee-break questions to try: build a copy from a brain's map (a worm's, a fly's, ours), ask a model to make something
// in each of Margaret Boden's three ways, and choose what to hand the agent and what to keep.
PLAY.copy9=(Lb,api)=>{const W=Lb.w,S={brain:"worm",built:null,way:"combine",tried:new Set(),made:null,count:"agent",sign:"agent",handed:null,t0:null};
  const r1=api.group(W.brainL);api.seg(r1,W.brains.map(b=>[b.k,b.name]),"worm",v=>{S.brain=v;S.built=null;api.say(fill(W.msg.brain,{n:W.brains.find(b=>b.k===v).n}));api.kick(400);},W.brainL);
  api.btn(r1,W.buildB,()=>{S.built=S.brain;S.t0=performance.now();api.kick(1400);const b=W.brains.find(x=>x.k===S.brain);api.say(b.say,S.brain==="human"?"warn":"ok");api.reach(S.brain==="worm"?"worm":S.brain==="fly"?"fly":"_");});
  const r2=api.group(W.wayL);api.seg(r2,W.ways.map(x=>[x.k,x.name]),"combine",v=>{S.way=v;S.made=null;api.kick(300);},W.wayL);
  api.btn(r2,W.makeB,()=>{S.made=S.way;S.tried.add(S.way);S.t0=performance.now();api.kick(1200);const x=W.ways.find(y=>y.k===S.way);api.say(x.say,S.way==="rules"?"warn":"ok");if(S.tried.size===3)api.reach("make");});
  const r3=api.group(W.handL);
  api.seg(r3,W.who.map(([k,l])=>[k,W.countL+": "+l]),"agent",v=>{S.count=v;S.handed=null;api.kick(300);},W.countL);
  api.seg(r3,W.who.map(([k,l])=>[k,W.signL+": "+l]),"agent",v=>{S.sign=v;S.handed=null;api.kick(300);},W.signL);
  api.btn(r3,W.handB,()=>{const k=S.sign==="agent"?"agentSigns":S.count==="person"?"byHand":"kept";S.handed=k;S.t0=performance.now();api.kick(900);api.say(W.hand[k],k==="kept"?"ok":"warn");if(k==="kept")api.reach("keep");});
  const lay=(lw,M)=>{const m=12,o={lw,m},nar=lw<460;o.wc=chipCols(M,W.ways.map(x=>x.name),lw-48);o.b={y:12,h:120};o.w={y:o.b.y+o.b.h+10,h:(nar?72:60)+Math.ceil(3/o.wc)*44};o.k={y:o.w.y+o.w.h+10,h:84};o.h=o.k.y+o.k.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.violet);const m=o.m,w=o.lw-m*2,u=S.t0==null?1:cl(since(now,S.t0)/900,0,1);if(u<1)api.kick(60);
    // a brain's map, and what a copy built from it does
    const B=W.brains.find(x=>x.k===S.brain),Bo=o.b;card(ctx,m,Bo.y,w,Bo.h,K.violet,B.name+" · "+B.n,{size:13});
    const R2=rng(B.k.length*31+3),dots=B.k==="worm"?40:B.k==="fly"?140:260,ax=m+14,aw=Math.min(150,w*0.34);
    for(let i=0;i<dots;i++){const x=ax+R2()*aw,y=Bo.y+36+R2()*(Bo.h-50);ctx.save();ctx.fillStyle=rgbaS(K.violet,B.k==="human"?0.35:0.75);ctx.beginPath();ctx.arc(x,y,B.k==="worm"?2.6:1.7,0,TP);ctx.fill();ctx.restore();}
    const tx=ax+aw+14,tw2=o.lw-m-12-tx;meter(ctx,tx,Bo.y+30,tw2,W.mappedL,B.mapped,B.share,K.violet);
    lines(ctx,S.built===S.brain&&u>0.3?B.does:W.buildIdle,tx,Bo.y+76,tw2,{size:12.5,max:3,w:600,color:rgbaS(S.built===S.brain?K.ink:K.soft,1)});
    // three ways to be creative, and which a model can take
    card(ctx,m,o.w.y,w,o.w.h,K.orange,W.bodenL,{size:13});
    W.ways.forEach((x,i)=>{const tried=S.tried.has(x.k),[cx,cy,cw]=chipAt(i,o.wc,m+12,o.w.y+34,w-24,38);chip(ctx,cx,cy,cw,38,x.name,x.k==="rules"?K.amber:K.orange,{size:12.5,on:S.made===x.k,mark:tried?(x.k==="rules"?"warn":"ok"):null});});
    lines(ctx,S.made?W.ways.find(y=>y.k===S.made).short:W.makeIdle,m+12,o.w.y+o.w.h-(o.lw<460?26:10),w-24,{size:12.5,max:o.lw<460?2:1,w:600,color:rgbaS(K.soft,1)});
    // what to hand the agent, and what to keep
    card(ctx,m,o.k.y,w,o.k.h,K.green,W.handL,{size:13});const hw=(w-24-6)/2;
    [[W.countL,S.count],[W.signL,S.sign]].forEach(([s,who],i)=>{const good=i===0?who==="agent":who==="person";chip(ctx,m+12+i*(hw+6),o.k.y+34,hw,38,s+": "+W.who.find(x=>x[0]===who)[1],S.handed?(good?K.good:K.amber):K.blue,{size:12.5,on:!!S.handed,mark:S.handed?(good?"ok":"warn"):null});});};
  return{S,lay,draw,readouts:[[W.read.mapped,()=>W.brains.find(x=>x.k===S.brain).mapped],[W.read.ways,()=>S.tried.size+"/3"],[W.read.signs,()=>W.who.find(x=>x[0]===S.sign)[1]]]};};

/* ---------- 10 · Many agents: two bridges, and one board ---------- */
// Ants leave the nest for food over two bridges. Each picks a bridge by the scent the others left (closely, a little, or not at all),
// and lays scent as it comes back; the short bridge is crossed sooner, so its scent builds faster. Scent fades as set; the short
// bridge is there from the start, or opens later. No ant compares the bridges. The run is worked out the same way each time, as the
// share of the ants choosing each bridge, so it settles where it would on average. Below, helpers pin reasons to one board.
PLAY.swarm=(Lb,api)=>{const W=Lb.w,S={n:2,fade:"slow",late:false,run:null,share:null,hist:[],copy:false,check:false,board:null,b0:null};
  const EXP={0:0,1:1,2:2},EV={never:0,slow:0.004,fast:0.03},TICKS=360,SH=10,LG=20,OPEN=150;
  function sim(){const n=S.n,e=EV[S.fade];let Ss=0,Sl=0,acc=0;const back=[],hist=[];let recent=[];
    for(let t=0;t<TICKS;t++){const open=!S.late||t>=OPEN;(back[t]||[]).forEach(b=>{if(b)Ss+=1;else Sl+=1;});Ss*=1-e;Sl*=1-e;
      for(let a=0;a<2;a++){const p=open?Math.pow(5+Ss,EXP[n])/(Math.pow(5+Ss,EXP[n])+Math.pow(5+Sl,EXP[n])):0;acc+=p;let short=false;if(acc>=1){acc-=1;short=true;}
        const at=t+(short?SH:LG);(back[at]=back[at]||[]).push(short);recent.push(short?1:0);if(recent.length>60)recent.shift();}
      if(t%6===5)hist.push(recent.reduce((x,y)=>x+y,0)/recent.length);}
    return{hist,share:recent.reduce((x,y)=>x+y,0)/recent.length};}
  const r1=api.group(W.followL);api.seg(r1,W.follow,"2",v=>{S.n=+v;S.run=null;api.kick(300);api.say(W.msg["follow"+v]);},W.followL);
  const r2=api.group(W.fadeL);api.seg(r2,W.fades,"slow",v=>{S.fade=v;S.run=null;api.kick(300);api.say(W.msg["fade_"+v]);},W.fadeL);
  const r3=api.group(W.whenL);api.seg(r3,W.whens,"start",v=>{S.late=v==="late";S.run=null;api.kick(300);api.say(S.late?W.msg.late:W.msg.start);},W.whenL);
  const r4=api.group();api.btn(r4,W.runB,()=>{const r=sim();S.run=performance.now();S.hist=r.hist;S.share=r.share;api.kick(4200);api.say(W.msg.running);
    api.later(()=>{const p=Math.round(S.share*100),k=S.n===0?"none":S.share>=0.8?"short":S.share<=0.3?"habit":"mixed";api.say(fill(W.msg[k],{p}),k==="short"?"ok":k==="habit"?"warn":"");
      if(k==="short"&&!S.late)api.reach("short");if(k==="none"&&S.share>0.35&&S.share<0.65)api.reach("none");if(S.late&&k==="habit")api.reach("habit");},3600);},"go");
  const r5=api.group(W.boardL);
  api.toggle(r5,W.copyT,false,v=>{S.copy=v;S.board=null;api.say(v?W.msg.copyOn:W.msg.copyOff);api.kick(300);});
  api.toggle(r5,W.checkT,false,v=>{S.check=v;S.board=null;api.say(v?W.msg.checkOn:W.msg.checkOff);api.kick(300);});
  api.btn(r5,W.pinB,()=>{S.board=S.copy?(S.check?"caught":"spread"):"one";S.b0=performance.now();api.kick(1600);api.say(W.msg.pattern+" "+W.msg["board_"+S.board],S.board==="spread"?"no":"ok");if(S.board==="caught")api.reach("word");});
  const lay=(lw,M)=>{const m=12,o={lw,m};o.nc=W.notes.every(s=>TW(M,s+" · "+W.fixedWord,12.5,700)<=(lw-54)/2-24&&TW(M,s+" · "+W.badWord,12.5,700)<=(lw-54)/2-24)?2:1;o.br={y:12,h:190};o.bd={y:o.br.y+o.br.h+10,h:66+Math.ceil(W.notes.length/o.nc)*44};o.h=o.bd.y+o.bd.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.green);const m=o.m,w=o.lw-m*2,Bx=o.br;card(ctx,m,Bx.y,w,Bx.h,K.green,"",{});
    const nx=m+40,fx=o.lw-m-40,cy=Bx.y+84,u=S.run==null?0:cl(since(now,S.run)/3600,0,1),hi=S.hist.length?S.hist[Math.min(S.hist.length-1,Math.floor(u*S.hist.length))]:0.5;
    const open=!S.late||(S.run!=null&&u*TICKS>=OPEN);
    // the two bridges: the short one straight, the long one bowed
    ctx.save();ctx.lineCap="round";ctx.lineWidth=10;ctx.strokeStyle=rgbaS(K.faint,open?0.55:0.25);if(!open)ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(nx,cy);ctx.lineTo(fx,cy);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle=rgbaS(K.faint,0.55);ctx.beginPath();ctx.moveTo(nx,cy);ctx.bezierCurveTo(nx+(fx-nx)*0.2,cy+86,fx-(fx-nx)*0.2,cy+86,fx,cy);ctx.stroke();ctx.restore();
    const pt=(sh,t)=>sh?[lp(nx,fx,t),cy]:(()=>{const q=1-t,x=q*q*q*nx+3*q*q*t*(nx+(fx-nx)*0.2)+3*q*t*t*(fx-(fx-nx)*0.2)+t*t*t*fx,y=q*q*q*cy+3*q*q*t*(cy+86)+3*q*t*t*(cy+86)+t*t*t*cy;return[x,y];})();
    if(S.run!=null){const N=30;for(let i=0;i<N;i++){const sh=(i+0.5)/N<hi,ph=((now/(sh?1600:3200))+i*0.137)%1,t=ph<0.5?ph*2:2-ph*2,[x,y]=pt(sh,t);ctx.save();ctx.fillStyle=rgbaS(K.ink,0.85);ctx.beginPath();ctx.arc(x,y-2,2.6,0,TP);ctx.fill();ctx.restore();}if(u<1||!RM())api.kick(u<1?80:0);}
    chip(ctx,nx-30,cy-16,60,32,W.nest,K.amber,{size:12.5,on:true});chip(ctx,fx-30,cy-16,60,32,W.food,K.green,{size:12.5,on:true});
    line1(ctx,open?W.shortL:W.shortL+" · "+W.closed,lp(nx,fx,0.5)-80,cy-14,160,12.5,{w:700,align:"center",color:rgbaS(K.soft,1)});line1(ctx,W.longL,lp(nx,fx,0.5)-80,cy+82,160,12.5,{w:700,align:"center",color:rgbaS(K.soft,1)});
    meter(ctx,m+12,Bx.y+8,w-24,W.onShort,S.run==null?"–":Math.round(hi*100)+"%",S.run==null?0:hi,K.green);
    // the board: what each helper pinned
    const D=o.bd;card(ctx,m,D.y,w,D.h,K.blue,W.boardTitle,{size:13});W.notes.forEach((s,i)=>{const[x,y,nw]=chipAt(i,o.nc,m+12,D.y+34,w-24,38),b=S.board,v=S.b0==null?1:cl((since(now,S.b0)-i*220)/500,0,1),word=b&&b!=="one"?true:i===0&&!!b,bad=word&&b!=="caught";
      if(!b){tile(ctx,x,y,nw,38,"",K.faint,{a:0.35});return;}withA(ctx,v,()=>{tile(ctx,x,y,nw,38,s+(word?" · "+(b==="caught"?W.fixedWord:W.badWord):""),bad?K.bad:K.blue,{size:12.5,mark:b==="caught"&&word?"ok":bad?"no":null});});if(v<1)api.kick(60);});
    line1(ctx,S.board?W.boardRes[S.board]:W.boardIdle,m+12,D.y+D.h-10,w-24,12.5,{w:700,color:rgbaS(S.board==="spread"?K.bad:S.board?K.good:K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.short,()=>S.share==null?"–":Math.round(S.share*100)+"%"],[W.read.word,()=>S.board==null?"–":S.board==="spread"?W.read.all:S.board==="caught"?W.read.fixed:W.read.one]]};};

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
