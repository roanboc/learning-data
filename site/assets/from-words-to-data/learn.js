/* Learning Data: From words to data. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine,
   copied from Data that moves' (site/assets/data-that-moves/learn.js): the series' labs page and scenarios page load a film's bundle
   (for its parts: glass, T, withA, rr, tw), the words (learn.en.js or learn.es.js, which set window.WD), and this file.
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
const L=window.WD,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-from-words-to-data";
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
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).length||7,filmN=n=>fill(U.filmN,{n,of:NF});

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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/from-words-to-data.js)
const MISS=window.WD_MISS=new Set();
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
// experiment; api.kick(ms) keeps the picture moving. Start again puts everything back as it was, the ticks included.
const PLAY={};
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab pg-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls pg-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"pg-goals","aria-label":U.goals}),end=h("div",{class:"pg-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"pg-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"pg-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm pg-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"pg-goalbox"},h("p",{class:"pg-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"pg-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}


/* ---------- 1 · What's in a word: count the credentials ---------- */
// Five kinds of thing the university issued this year, each a block as big as its number. Switch which ones count as credentials,
// and the total moves, though nothing in the world did. Each office's answer is one set of switches; so is the agreed definition.
PLAY.count=(Lb,api)=>{const W=Lb.w,IT=W.items,S={on:new Set(W.on0),t0:-1e5,from:0};
  const total=()=>IT.reduce((a,x)=>a+(S.on.has(x.k)?x.n:0),0),same=set=>set.length===S.on.size&&set.every(k=>S.on.has(k));
  const match=()=>W.offices.find(o=>same(o.set))||null;S.from=total();
  const r1=api.group(W.countL);IT.forEach(x=>api.toggle(r1,x.t,S.on.has(x.k),v=>{S.from=shown(performance.now());if(v)S.on.add(x.k);else S.on.delete(x.k);S.t0=performance.now();api.kick(1100);
    const o=match(),n=nf(total());if(o){api.say(fill(o.say,{n}),o.k==="agreed"?"ok":null);api.reach(o.k);}else api.say(fill(W.msg.none,{n}));}));
  const nf=n=>Number(n).toLocaleString(L.lang==="es"?"es-MX":"en-AU");
  function shown(now){const u=RM()?1:eo(cl((now-S.t0)/900,0,1));return Math.round(lp(S.from,total(),u));}
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.top={y:12,h:88};o.rows=IT.map((x,i)=>({y:o.top.y+o.top.h+10+i*38,h:32}));const oy=o.rows[IT.length-1].y+44,cols=lw>=520?3:2,
    cw=(lw-m*2-(cols-1)*8)/cols;const nO=W.offices.length;o.off=W.offices.map((x,i)=>{const last=i===nO-1&&nO%cols!==0,col=i%cols;return{x:last?m:m+col*(cw+8),y:oy+Math.floor(i/cols)*60,w:last?lw-m*2:cw,h:52};});o.h=o.off[o.off.length-1].y+52+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const mo=match(),max=Math.max(...IT.map(x=>x.n));
    card(ctx,o.m,o.top.y,o.lw-o.m*2,o.top.h,K.gold,W.totalL,{glow:8,size:13.5});
    T(ctx,nf(shown(now)),o.m+14,o.top.y+58,{w:800,size:28,color:rgbaS(K.ink,1)});
    line1(ctx,mo?fill(W.isOf,{o:mo.name}):W.noOne,o.m+14,o.top.y+78,o.lw-o.m*2-28,12.5,{w:700,color:rgbaS(mo?K.gold:K.soft,1)});
    IT.forEach((x,i)=>{const r=o.rows[i],on=S.on.has(x.k),bw=(o.lw-o.m*2)*x.n/max;
      glass(ctx,o.m,r.y,o.lw-o.m*2,r.h,8,K.soft,{fill:"rgba(7,12,24,0.85)",glow:0,ea:0.3});
      ctx.save();ctx.fillStyle=rgbaS(on?K.gold:K.soft,on?0.32:0.1);rr(ctx,o.m,r.y,Math.max(10,bw),r.h,8);ctx.fill();ctx.restore();
      const nt=nf(x.n),nw=TW(ctx,nt,12.5)+10;line1(ctx,x.t,o.m+10,r.y+r.h/2+4.5,o.lw-o.m*2-24-nw,12.5,{w:700,color:rgbaS(on?K.ink:K.soft,on?1:0.8)});
      T(ctx,nt,o.lw-o.m-10,r.y+r.h/2+4.5,{w:700,size:12.5,align:"right",color:rgbaS(on?K.gold:K.soft,1)});if(on)mark(ctx,o.lw-o.m-2,r.y+2,"ok");});
    W.offices.forEach((x,i)=>{const b=o.off[i],hit=mo&&mo.k===x.k,ag=x.k==="agreed",col=ag?K.gold:K.plat;
      card(ctx,b.x,b.y,b.w,b.h,hit?K.good:col,x.name,{glow:hit?16:4,size:12.5,dash:ag&&!hit});
      line1(ctx,nf(IT.reduce((a,y)=>a+(x.set.includes(y.k)?y.n:0),0)),b.x+12,b.y+42,b.w-24,13.5,{w:800,color:rgbaS(hit?K.good:K.ink,1)});if(hit)mark(ctx,b.x+b.w-2,b.y+2,"ok");});};
  return{S,lay,draw,readouts:[[W.read.total,()=>nf(total())],[W.read.match,()=>{const m=match();return m?m.name:"–";}]]};};

/* ---------- 2 · Older than the systems: one source, one model ---------- */
// The systems that hold a learner's facts, joined each to each or through one model, and the alumni platform that's coming; Aisha's
// email, corrected where it's created or in a copy, then the night's sync; and Aisha kept as two records, or one person in two roles.
PLAY.source=(Lb,api)=>{const W=Lb.w,S={link:"mesh",alumni:false,typed:"lp",sync:null,syncFrom:null,party:"two",renamed:null,renParty:null};
  const sys=()=>W.systems.slice(0,S.alumni?6:5),nIf=()=>{const n=sys().length;return S.link==="mesh"?n*(n-1)/2:n;};
  const r1=api.group(W.linkL);api.seg(r1,W.links,"mesh",v=>{S.link=v;api.kick(500);api.say(fill(v==="hub"?W.msg.hub:W.msg.mesh,{n:nIf()}));check();},W.linkL);
  api.toggle(r1,W.alumniT,false,v=>{S.alumni=v;api.kick(700);api.say(v?fill(S.link==="hub"?W.msg.addHub:W.msg.addMesh,{n:nIf()}):W.msg.noAlumni,v&&S.link==="hub"?"ok":null);check();});
  function check(){if(S.alumni&&S.link==="hub")api.reach("hub");if(S.alumni&&S.link==="mesh")api.reach("mesh");}
  const r2=api.group(W.typedL);api.seg(r2,W.typeds,"lp",v=>{S.typed=v;S.sync=null;api.kick(300);api.say(v==="it"?W.msg.typedIt:W.msg.typedLp);},W.typedL);
  api.btn(r2,W.syncB,()=>{S.sync=performance.now();S.syncFrom=S.typed;api.kick(2600);api.say(W.msg.syncing);const t=S.sync;
    setTimeout(()=>{if(S.sync!==t)return;if(S.syncFrom==="it"){api.say(W.msg.syncIt,"ok");api.reach("email");}else api.say(W.msg.syncLp,"warn");api.refresh();},RM()?0:2000);},"go");
  const r3=api.group(W.partyL);api.seg(r3,W.parties,"two",v=>{S.party=v;S.renamed=null;api.kick(300);api.say(v==="one"?W.msg.one:W.msg.two);},W.partyL);
  api.btn(r3,W.renameB,()=>{S.renamed=performance.now();S.renParty=S.party;api.kick(1400);if(S.party==="one"){api.say(W.msg.renOne,"ok");api.reach("roles");}else api.say(W.msg.renTwo,"warn");});
  // where Aisha's email stands in each system: the new one, or the old
  const emailAt=(i,now)=>{if(S.sync==null)return i===1&&S.typed==="it"||i===4&&S.typed==="lp"?"new":"old";const t=since(now,S.sync);
    if(S.syncFrom==="it")return i===1||t>1200?"new":"old";return i===4&&t<1400?"new":"old";};
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.net={y:12,h:250};o.cw=Math.min(132,(lw-m*2)*0.36);o.mail={y:o.net.y+o.net.h+10};
    const f=flow(ctx,W.systems.map(s=>s),lw-m*2-24,12.5,6,28);o.mail.h=34+f.h+10;o.mail.pos=f.pos;o.party={y:o.mail.y+o.mail.h+10,h:112};o.h=o.party.y+o.party.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const N=o.net,cx=o.lw/2,cy=N.y+30+(N.h-30)/2,rx=(o.lw-o.m*2-o.cw)/2,ry=(N.h-30)/2-20,list=sys(),n=list.length;
    card(ctx,o.m,N.y,o.lw-o.m*2,N.h,K.plat,W.netT,{glow:4,size:13,right:TW(ctx,fill(W.ifL,{n:nIf()}),12)+30});
    const P=list.map((s,i)=>{const a=-Math.PI/2+i*TP/n;return{x:cx+rx*Math.cos(a),y:cy+ry*Math.sin(a)};});
    ctx.save();ctx.lineWidth=1.4;ctx.strokeStyle=rgbaS(S.link==="hub"?K.good:K.bad,0.5);
    if(S.link==="mesh"){for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){ctx.beginPath();ctx.moveTo(P[i].x,P[i].y);ctx.lineTo(P[j].x,P[j].y);ctx.stroke();}}
    else P.forEach(p=>{ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(cx,cy);ctx.stroke();});ctx.restore();
    if(S.link==="hub"){const hw=Math.min(o.cw*1.2,TW(ctx,W.hubName,12.5)+22);chip(ctx,cx-hw/2,cy-16,hw,32,W.hubName,K.gold,{size:12.5,glow:10});}
    list.forEach((s,i)=>{const nw=i===5;chip(ctx,P[i].x-o.cw/2,P[i].y-14,o.cw,28,W.nodes[i],nw?K.warm:K.plat,{size:12.5,glow:nw?12:6});});
    pill(ctx,o.lw-o.m-8,N.y+6,fill(W.ifL,{n:nIf()}),S.link==="hub"?K.good:K.bad,{align:"right",size:12});
    // her email, in every copy
    const M=o.mail;card(ctx,o.m,M.y,o.lw-o.m*2,M.h,K.hot,W.mailT,{glow:4,size:13});
    W.systems.forEach((s,i)=>{if(i===5&&!S.alumni)return;const p=M.pos[i],st=emailAt(i,now),src=i===1;
      chip(ctx,o.m+12+p.x,M.y+32+p.y,p.w,p.h,s,st==="new"?K.good:K.soft,{size:12.5,mark:st==="new"?"ok":null,glow:src?10:4});});
    if(S.sync!=null&&since(now,S.sync)<2000)api.kick(100);
    // Aisha: two records, or one person with two roles
    const Y=o.party,two=S.party==="two",ren=S.renamed!=null&&since(now,S.renamed)>500,nm=ren?W.newName:W.oldName;card(ctx,o.m,Y.y,o.lw-o.m*2,Y.h,K.hr,two?W.twoT:W.oneT,{glow:4,size:13});
    const w2=(o.lw-o.m*2-24-10)/2;
    if(two){chip(ctx,o.m+12,Y.y+36,w2,30,W.recA,K.hr,{size:12.5});chip(ctx,o.m+22+w2,Y.y+36,w2,30,W.recB,K.hr,{size:12.5});
      line1(ctx,nm,o.m+12,Y.y+88,w2,13,{w:800,align:"center",color:rgbaS(ren?K.good:K.ink,1)});line1(ctx,W.oldName,o.m+22+w2,Y.y+88,w2,13,{w:800,align:"center",color:rgbaS(ren?K.bad:K.ink,1)});}
    else{chip(ctx,o.m+12,Y.y+36,o.lw-o.m*2-24,30,nm,ren?K.good:K.gold,{size:13.5,glow:10});
      [W.roleA,W.roleB].forEach((r,i)=>pill(ctx,o.m+12+i*(w2+10)+w2/2,Y.y+76,r,K.hr,{align:"center",size:12,max:w2}));}};
  return{S,lay,draw,readouts:[[W.read.ifs,()=>String(nIf())],[W.read.agree,()=>{const now=performance.now(),n=sys().length,k=sys().filter((s,i)=>emailAt(i,now)===emailAt(1,now)).length;return fill(W.read.agreeV,{k,n});}],
    [W.read.recs,()=>S.party==="two"?"2":"1"]]};};

/* ---------- 3 · Built to write, built to read: two shapes, one set of facts ---------- */
// The awards kept built to write (each fact once), built to read (a star), or both, kept in step. Graduation day issues 300 awards
// one by one; the ten-year report adds up credit points by faculty. Aisha moves faculty: with history kept, last year's report stays.
PLAY.shape=(Lb,api)=>{const W=Lb.w,S={shape:"write",hist:false,runs:{},moved:null,movedHist:false};
  const R={issue:{write:"fast",read:"slow",both:"fast"},report:{write:"slow",read:"fast",both:"fast"}};
  const r1=api.group(W.shapeL);api.seg(r1,W.shapes,"write",v=>{S.shape=v;S.runs={};api.kick(400);api.say(W.msg[v]);},W.shapeL);
  const r2=api.group();
  const run=k=>{const now=performance.now(),sp=R[k][S.shape];S.runs[k]={t0:now,sp,shape:S.shape};api.kick(sp==="fast"?900:2900);api.say(W.msg.running[k]);
    setTimeout(()=>{const x=S.runs[k];if(!x||x.t0!==now)return;api.say(W.msg[k][S.shape],sp==="fast"?"ok":"warn");if(sp==="fast")api.reach(k);
      if(S.runs.issue&&S.runs.report&&S.runs.issue.sp==="fast"&&S.runs.report.sp==="fast"&&S.runs.issue.shape===S.runs.report.shape)api.reach("both");api.refresh();},RM()?0:sp==="fast"?700:2600);};
  api.btn(r2,W.issueB,()=>run("issue"),"go");api.btn(r2,W.reportB,()=>run("report"),"go");
  const r3=api.group(W.histL);api.toggle(r3,W.histT,false,v=>{S.hist=v;S.moved=null;api.say(v?W.msg.histOn:W.msg.histOff);api.kick(200);});
  api.btn(r3,W.moveB,()=>{S.moved=performance.now();S.movedHist=S.hist;api.kick(1200);api.say(S.hist?W.msg.moveHist:W.msg.moveOver,S.hist?"ok":"warn");if(S.hist)api.reach("history");});
  const lay=(lw,ctx)=>{const m=12,o={lw,m},two=lw>=520,pw=two?(lw-m*2-10)/2:lw-m*2;o.pa={x:m,y:12,w:pw,h:132};o.pb={x:two?m+pw+10:m,y:two?12:12+132+10,w:pw,h:132};
    o.bars={y:o.pb.y+o.pb.h+12,h:2*46+10};o.last={y:o.bars.y+o.bars.h+10,h:56};o.h=o.last.y+o.last.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const on=k=>S.shape===k||S.shape==="both";
    // built to write: each fact once, in its own table
    const A=o.pa;card(ctx,A.x,A.y,A.w,A.h,K.plat,W.writeT,{glow:on("write")?12:2,a:on("write")?1:0.45,dash:!on("write"),size:13});
    withA(ctx,on("write")?1:0.45,()=>{const tw_=(A.w-24-16)/3;W.writeTables.forEach((t,i)=>{const x=A.x+12+i*(tw_+8);chip(ctx,x,A.y+40,tw_,30,t,K.plat,{size:12.5});if(i)arrow(ctx,x-8,A.y+55,x-1,A.y+55,K.soft,0.8,{head:5});});
      lines(ctx,W.writeSub,A.x+12,A.y+96,A.w-24,{size:12.5,max:2,color:rgbaS(K.soft,1),w:600});});
    // built to read: a star, the facts in the middle
    const B=o.pb;card(ctx,B.x,B.y,B.w,B.h,K.gold,W.readT,{glow:on("read")?12:2,a:on("read")?1:0.45,dash:!on("read"),size:13});
    withA(ctx,on("read")?1:0.45,()=>{const cx=B.x+B.w/2,cy=B.y+70,dw=Math.min((B.w-24-16)*0.36,Math.max(...W.dims.map(d=>TW(ctx,d,12)))+22),fw=Math.min(120,B.w-24-16-dw*2);
      chip(ctx,cx-fw/2,cy-15,fw,30,W.fact,K.gold,{size:12.5,glow:8});
      W.dims.forEach((d,i)=>{const x=i%2?cx+fw/2+8:cx-fw/2-8-dw,y=cy-36+Math.floor(i/2)*44;chip(ctx,x,y,dw,26,d,K.gold,{size:12,tint:0.06});});
      line1(ctx,W.readSub,B.x+12,B.y+B.h-10,B.w-24,12.5,{w:600,align:"center",color:rgbaS(K.soft,1)});});
    if(S.shape==="both"){const x0=o.lw>=520?A.x+A.w+1:o.lw/2,y0=o.lw>=520?A.y+A.h/2:A.y+A.h+1,x1=o.lw>=520?B.x-1:o.lw/2,y1=o.lw>=520?B.y+B.h/2:B.y-1;arrow(ctx,x0,y0,x1,y1,K.good,0.9,{head:6});}
    // the two jobs, and how long each takes in the shape picked
    ["issue","report"].forEach((k,i)=>{const y=o.bars.y+i*56,x=S.runs[k],bw=o.lw-o.m*2;glass(ctx,o.m,y,bw,46,10,K.soft,{fill:"rgba(7,12,24,0.88)",glow:0,ea:0.35});
      line1(ctx,W.jobs[k],o.m+12,y+19,bw-24,12.5,{w:700,color:rgbaS(K.ink,0.95)});
      if(x){const dur=x.sp==="fast"?700:2600,u=cl(since(now,x.t0)/dur,0,1),full=x.sp==="fast"?0.16:1,col=x.sp==="fast"?K.good:K.bad;
        const tt=W.time[k][x.shape],room=bw-24-Math.min(bw-24-60,TW(ctx,tt,12.5)+14);
        ctx.save();ctx.fillStyle=rgbaS(col,0.55);rr(ctx,o.m+12,y+28,Math.max(6,room*full*eo(u)),10,5);ctx.fill();ctx.restore();
        if(u>=1)line1(ctx,tt,o.m+12+room+8,y+38,bw-24-room-8,12.5,{w:800,align:"right",color:rgbaS(col,1)});}});
    // last year's report, as it was published
    const Lr=o.last,ch=S.moved!=null&&!S.movedHist&&since(now,S.moved)>400;card(ctx,o.m,Lr.y,o.lw-o.m*2,Lr.h,ch?K.bad:K.gold,W.lastT,{glow:4,size:12.5});
    line1(ctx,ch?W.lastChanged:W.lastSame,o.m+12,Lr.y+44,o.lw-o.m*2-24,13,{w:800,color:rgbaS(ch?K.bad:K.ink,1)});};
  return{S,lay,draw,readouts:[[W.read.issue,()=>S.runs.issue?W.time.issue[S.runs.issue.shape]:"–"],[W.read.report,()=>S.runs.report?W.time.report[S.runs.report.shape]:"–"],
    [W.read.last,()=>S.moved==null?W.read.same:S.movedHist?W.read.same:W.read.changed]]};};

/* ---------- 4 · Many ways to read: same question, four shapes ---------- */
// One set of facts in four shapes: normalised, a star, a data vault, one big table. Ask each the same questions, add a provider, and
// join two stars by learner, each with its own learner table or one shared.
PLAY.shapes=(Lb,api)=>{const W=Lb.w,F=W.facts,S={shape:"norm",asked:null,askT:0,conf:false,joined:null,joinConf:false};
  const r1=api.group(W.shapeL);api.seg(r1,W.shapes,"norm",v=>{S.shape=v;S.asked=null;api.kick(400);api.say(W.msg[v]);},W.shapeL);
  const r2=api.group();
  const ask=k=>{S.asked=k;S.askT=performance.now();api.kick(900);const ok=F[k].good.includes(S.shape);api.say(F[k].say[S.shape],ok?"ok":"warn");if(ok)api.reach(k);};
  api.btn(r2,W.askFac,()=>ask("faculty"),"go");api.btn(r2,W.askWho,()=>ask("who"),"go");api.btn(r2,W.addSrc,()=>ask("add"),"go");
  const r3=api.group(W.joinL);api.toggle(r3,W.confT,false,v=>{S.conf=v;S.joined=null;api.kick(300);api.say(v?W.msg.confOn:W.msg.confOff);});
  api.btn(r3,W.joinB,()=>{S.joined=performance.now();S.joinConf=S.conf;api.kick(1200);api.say(S.conf?W.msg.joinOk:W.msg.joinBad,S.conf?"ok":"warn");if(S.conf)api.reach("conform");});
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.d={y:12,h:168};o.res={y:o.d.y+o.d.h+10,h:78};o.join={y:o.res.y+o.res.h+10,h:148};o.h=o.join.y+o.join.h+12;return o;};
  // the shape, drawn as its tables
  function shapeDraw(ctx,x,y,w,hh,k,now){const cw=Math.min(104,(w-24)/3.4),ch=26,g=W.parts[k],t=S.asked&&S.asked!=="add"?cl(since(now,S.askT)/700,0,1):0;
    if(k==="obt"){const cols=Math.max(5,Math.floor((w-24)/44));chip(ctx,x+12,y+40,w-24,30,g[0],K.cold,{size:12.5,glow:8});for(let i=0;i<cols;i++){ctx.save();ctx.strokeStyle=rgbaS(K.cold,0.35);ctx.beginPath();ctx.moveTo(x+12+(i+1)*(w-24)/(cols+1),y+76);ctx.lineTo(x+12+(i+1)*(w-24)/(cols+1),y+118);ctx.stroke();ctx.restore();}
      line1(ctx,g[1],x+12,y+hh-12,w-24,12.5,{w:600,align:"center",color:rgbaS(K.soft,1)});return;}
    if(k==="star"){const cx=x+w/2,cy=y+88,fw=Math.min(w-24,cw*1.4);chip(ctx,cx-fw/2,cy-14,fw,28,g[0],K.gold,{size:12.5,glow:8});
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b],i)=>{const dx=cx+a*(cw+18)-cw/2,dy=cy+b*30-ch/2;arrow(ctx,cx+a*cw/2,cy,dx+(a<0?cw:0),dy+ch/2,K.soft,0.6,{head:5});chip(ctx,dx,dy,cw,ch,g[1+i],K.gold,{size:12,tint:0.06});});return;}
    if(k==="vault"){const hub=[g[0],g[1],g[2]],hw=(w-24-16)/3;hub.forEach((s,i)=>chip(ctx,x+12+i*(hw+8),y+40,hw,26,s,K.warm,{size:12}));
      [0,1].forEach(i=>chip(ctx,x+12+hw*0.55+i*(hw+8),y+76,hw*0.9,24,g[3],K.cold,{size:12,tint:0.06}));
      for(let i=0;i<3;i++)chip(ctx,x+12+i*(hw+8),y+108,hw,24,g[4],K.arch,{size:12,tint:0.06});
      line1(ctx,g[5],x+12,y+hh-10,w-24,12.5,{w:600,align:"center",color:rgbaS(K.soft,1)});return;}
    const nw=(w-24-2*8)/3;g.slice(0,5).forEach((s,i)=>{const r=Math.floor(i/3),c=i%3,xx=x+12+(r?nw/2+4:0)+c*(nw+8);chip(ctx,xx,y+42+r*38,nw,26,s,K.plat,{size:12});});
    line1(ctx,g[5],x+12,y+hh-12,w-24,12.5,{w:600,align:"center",color:rgbaS(K.soft,1)});}
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.cold);const D=o.d,nm=W.shapes.find(x=>x[0]===S.shape)[1];card(ctx,o.m,D.y,o.lw-o.m*2,D.h,K.plat,nm,{glow:6,size:13.5});
    shapeDraw(ctx,o.m,D.y,o.lw-o.m*2,D.h,S.shape,now);
    const R=o.res;card(ctx,o.m,R.y,o.lw-o.m*2,R.h,S.asked?(F[S.asked].good.includes(S.shape)?K.good:K.bad):K.soft,S.asked?W.qName[S.asked]:W.noQ,{glow:4,size:12.5});
    if(S.asked)lines(ctx,F[S.asked].res[S.shape],o.m+12,R.y+46,o.lw-o.m*2-24,{size:13,max:2,w:700});
    // two stars, joined by learner
    const J=o.join,w2=(o.lw-o.m*2-24-30)/2,ok=S.joined!=null&&S.joinConf,bad=S.joined!=null&&!S.joinConf;card(ctx,o.m,J.y,o.lw-o.m*2,J.h,K.gold,W.joinT,{glow:4,size:12.5});
    chip(ctx,o.m+12,J.y+34,w2,28,W.starA,K.gold,{size:12.5});chip(ctx,o.lw-o.m-12-w2,J.y+34,w2,28,W.starB,K.gold,{size:12.5});
    if(S.conf)chip(ctx,o.lw/2-w2/2,J.y+76,w2,28,W.learnerOne,K.good,{size:12.5,glow:10});
    else{chip(ctx,o.m+12,J.y+76,w2,28,W.learnerA,K.soft,{size:12.5});chip(ctx,o.lw-o.m-12-w2,J.y+76,w2,28,W.learnerB,K.soft,{size:12.5});}
    if(S.joined!=null){const t=cl(since(now,S.joined)/700,0,1);if(t>=1)pill(ctx,o.lw/2,J.y+114,ok?W.joinAll:W.joinThird,ok?K.good:K.bad,{align:"center",size:12,max:o.lw-o.m*2-24});}};
  return{S,lay,draw,readouts:[[W.read.joins,()=>F.faculty.joins[S.shape]],[W.read.who,()=>S.shape==="vault"?W.read.yes:W.read.no],[W.read.changed,()=>F.add.changed[S.shape]]]};};

/* ---------- 5 · Both at once: a write side and a read side, kept in step ---------- */
// The app's database writes; the read side answers. Changes travel between them, applied as they arrive or in the order they
// happened, by key; a deletion travels as a change, or as nothing. Aisha's wallet reads gold each night or the app's live row, and
// the census count reads the live table or a snapshot taken on census date.
PLAY.sync=(Lb,api)=>{const W=Lb.w,S={order:"arrive",del:false,run:null,runOrder:null,gone:null,goneDel:false,wallet:"gold",done:null,doneWallet:null,census:"live",late:null,lateCensus:null};
  const r1=api.group(W.orderL);api.seg(r1,W.orders,"arrive",v=>{S.order=v;S.run=null;api.kick(300);api.say(v==="happened"?W.msg.happened:W.msg.arrive);},W.orderL);
  api.toggle(r1,W.delT,false,v=>{S.del=v;S.gone=null;api.say(v?W.msg.delOn:W.msg.delOff);api.kick(200);});
  const r2=api.group();
  api.btn(r2,W.replayB,()=>{S.run=performance.now();S.runOrder=S.order;api.kick(2400);api.say(W.msg.replaying);const t=S.run;
    setTimeout(()=>{if(S.run!==t)return;const ok=S.runOrder==="happened";api.say(ok?W.msg.replayOk:W.msg.replayBad,ok?"ok":"no");if(ok)api.reach("order");api.refresh();},RM()?0:2000);},"go");
  api.btn(r2,W.deleteB,()=>{S.gone=performance.now();S.goneDel=S.del;api.kick(1600);api.say(S.del?W.msg.goneOk:W.msg.goneBad,S.del?"ok":"warn");if(S.del)api.reach("delete");});
  const r3=api.group(W.walletL);api.seg(r3,W.wallets,"gold",v=>{S.wallet=v;S.done=null;api.kick(200);api.say(v==="live"?W.msg.walletLive:W.msg.walletGold);},W.walletL);
  api.btn(r3,W.finishB,()=>{S.done=performance.now();S.doneWallet=S.wallet;api.kick(1400);api.say(S.wallet==="live"?W.msg.finLive:W.msg.finGold,S.wallet==="live"?"ok":"warn");if(S.wallet==="live")api.reach("wallet");});
  const r4=api.group(W.censusL);api.seg(r4,W.censuses,"live",v=>{S.census=v;S.late=null;api.kick(200);api.say(v==="snap"?W.msg.censusSnap:W.msg.censusLive);},W.censusL);
  api.btn(r4,W.lateB,()=>{S.late=performance.now();S.lateCensus=S.census;api.kick(1400);api.say(S.census==="snap"?W.msg.lateSnap:W.msg.lateLive,S.census==="snap"?"ok":"warn");if(S.census==="snap")api.reach("census");});
  const nf=n=>Number(n).toLocaleString(L.lang==="es"?"es-MX":"en-AU");
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.head={y:12};o.lanes=[0,1,2,3].map(i=>({y:40+i*74,h:66}));o.h=40+4*74+4;o.cw=Math.min(150,(lw-m*2)*0.34);return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.hot);const cw=o.cw,ax=o.m,bx=o.lw-o.m-cw;
    line1(ctx,W.appT,ax,28,cw,12.5,{w:800,align:"center",color:rgbaS(K.hr,1)});line1(ctx,W.readT,bx,28,cw,12.5,{w:800,align:"center",color:rgbaS(K.gold,1)});
    o.lanes.forEach((L2,i)=>{glass(ctx,o.m-4,L2.y-4,o.lw-o.m*2+8,L2.h,10,K.soft,{fill:"rgba(7,12,24,0.6)",glow:0,ea:0.25});line1(ctx,W.lanes[i],o.m+cw+10,L2.y+12,o.lw-o.m*2-cw*2-20,12,{w:700,align:"center",color:rgbaS(K.soft,1)});
      arrow(ctx,ax+cw+8,L2.y+38,bx-8,L2.y+38,K.soft,0.4,{dash:[4,4],head:6});});
    const mid=(i)=>o.lanes[i].y+38,lane=(i,app,read,col,mk)=>{chip(ctx,ax,o.lanes[i].y+20,cw,36,app,K.hr,{size:12.5});chip(ctx,bx,o.lanes[i].y+20,cw,36,read,col,{size:12.5,mark:mk,glow:mk?10:4});};
    // 1: award A-2210, issued then revoked, and a replayed batch
    let r0=W.v.issued,c0=K.plat,m0=null;
    if(S.run!=null){const t=since(now,S.run),ev=S.runOrder==="happened"?W.events.slice(0,2):W.events,step=2000/ev.length;
      ev.forEach((e,j)=>{const u=cl((t-j*step*0.8)/step,0,1);if(u>0&&u<1){const tw_=Math.min(118,bx-ax-cw-30);tile(ctx,lp(ax+cw+6,bx-tw_-6,ei(u)),mid(0)-11,tw_,22,e,j===2?K.warm:K.plat,{size:12});}});
      if(t>=2000){const ok=S.runOrder==="happened";r0=ok?W.v.revoked:W.v.issued;c0=ok?K.good:K.bad;m0=ok?"ok":"no";}else api.kick(80);}
    lane(0,W.v.revoked,r0,c0,m0);
    // 2: a learner deletes her account
    const g=S.gone!=null&&since(now,S.gone)>900;lane(1,nf(g?W.v.count-1:W.v.count),nf(g&&S.goneDel?W.v.count-1:W.v.count),g?(S.goneDel?K.good:K.bad):K.plat,g?(S.goneDel?"ok":"no"):null);
    if(S.gone!=null&&!g&&S.goneDel){const u=cl(since(now,S.gone)/900,0,1),tw_=Math.min(96,bx-ax-cw-30);tile(ctx,lp(ax+cw+6,bx-tw_-6,ei(u)),mid(1)-11,tw_,22,W.v.delTile,K.warm,{size:12});}
    // 3: Aisha's wallet
    const d=S.done!=null&&since(now,S.done)>600;lane(2,d?W.v.four:W.v.three,d&&S.doneWallet==="live"?W.v.four:W.v.three,d?(S.doneWallet==="live"?K.good:K.bad):K.plat,d?(S.doneWallet==="live"?"ok":"no"):null);
    // 4: census date
    const l=S.late!=null&&since(now,S.late)>600;lane(3,nf(l?W.v.census+W.v.late:W.v.census),nf(l&&S.lateCensus==="live"?W.v.census+W.v.late:W.v.census),l?(S.lateCensus==="snap"?K.good:K.bad):K.plat,l?(S.lateCensus==="snap"?"ok":"no"):null);};
  return{S,lay,draw,readouts:[[W.read.applied,()=>S.order==="happened"?W.read.byKey:W.read.asCome],[W.read.wallet,()=>S.wallet==="live"?W.read.now:W.read.tonight],[W.read.census,()=>S.census==="snap"?W.read.fixed:W.read.moving]]};};

/* ---------- 6 · Meaning machines can read: ground the answer ---------- */
// Genie is asked who is one microcredential away from a graduate certificate. Switch what it reads: column names, three copies of a
// glossary PDF, one managed glossary, the stacking rule, the metric. Each managed piece takes out one guess, until Genie counts as
// the registrar's list does. Below, the rule "at most four" written three ways, and a fifth microcredential loaded for Aisha.
PLAY.ground=(Lb,api)=>{const W=Lb.w,S={on:new Set(["cols"]),asks:0,ans:null,askT:null,prev:null,as:"tree",fifth:null,fifthAs:null};
  const answer=()=>{let a=W.base;if(S.on.has("gloss"))a-=W.cut.gloss;else if(S.on.has("pdf"))a-=S.asks%2?W.cut.gloss:W.cut.old;if(S.on.has("rule"))a-=W.cut.rule;if(S.on.has("metric"))a-=W.cut.metric;return a;};
  const r1=api.group(W.readsL);W.reads.forEach(([k,t])=>api.toggle(r1,t,S.on.has(k),v=>{if(v)S.on.add(k);else S.on.delete(k);api.say(W.msg[k+(v?"On":"Off")]);api.kick(300);}));
  const r1b=api.group();api.btn(r1b,W.askB,()=>{S.asks++;S.prev=S.ans;S.ans=answer();S.askT=performance.now();api.kick(1200);const ok=S.ans===W.target;
    api.say(fill(ok?W.msg.right:W.msg.wrong,{n:S.ans,t:W.target}),ok?"ok":"warn");if(ok)api.reach("match");
    if(S.prev!=null&&S.prev!==S.ans&&S.on.has("pdf")&&!S.on.has("gloss")){api.say(fill(W.msg.flip,{a:S.prev,b:S.ans}),"warn");api.reach("copies");}},"go");
  const r2=api.group(W.asL);api.seg(r2,W.ases,"tree",v=>{S.as=v;S.fifth=null;api.say(W.msg["as_"+v]);api.kick(200);},W.asL);
  api.btn(r2,W.fifthB,()=>{S.fifth=performance.now();S.fifthAs=S.as;api.kick(1600);api.say(W.msg["fifth_"+S.as],S.as==="test"?"ok":"warn");if(S.as==="test")api.reach("test");if(S.as==="owl")api.reach("owl");});
  const lay=(lw,ctx)=>{const m=12,o={lw,m},two=lw>=520;o.src={x:m,y:12,w:two?(lw-m*2)*0.5:lw-m*2};o.src.h=34+W.reads.length*32+6;
    o.gen={x:two?m+o.src.w+12:m,y:two?12:o.src.y+o.src.h+10,w:two?lw-m*2-o.src.w-12:lw-m*2,h:two?o.src.h:120};o.cert={y:o.gen.y+o.gen.h+10,h:104};o.h=o.cert.y+o.cert.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const A=o.src;card(ctx,A.x,A.y,A.w,A.h,K.plat,W.srcT,{glow:4,size:13});
    W.reads.forEach(([k,t],i)=>{const on=S.on.has(k),y=A.y+32+i*32,good=k==="gloss"||k==="rule"||k==="metric";chip(ctx,A.x+10,y,A.w-20,26,t,on?(good?K.good:k==="pdf"?K.warm:K.plat):K.soft,{size:12,a:on?1:0.45,glow:on?6:0});});
    const G=o.gen,ok=S.ans===W.target,t=S.askT!=null?cl(since(now,S.askT)/600,0,1):0;card(ctx,G.x,G.y,G.w,G.h,S.ans==null?K.plat:ok?K.good:K.bad,W.genie,{glow:8,size:13});
    if(S.ans!=null)withA(ctx,eo(t),()=>T(ctx,String(S.ans),G.x+14,G.y+66,{w:800,size:30,color:rgbaS(ok?K.good:K.ink,1)}));
    else line1(ctx,W.notAsked,G.x+14,G.y+60,G.w-28,12.5,{w:600,color:rgbaS(K.soft,1)});
    line1(ctx,fill(W.list,{t:W.target}),G.x+14,G.y+G.h-14,G.w-28,12.5,{w:700,color:rgbaS(K.gold,1)});
    // Aisha's graduate certificate: four places, and a fifth on its way
    const C=o.cert,sw=Math.min(70,(o.lw-o.m*2-24-5*8)/5);card(ctx,o.m,C.y,o.lw-o.m*2,C.h,K.gold,W.certT,{glow:4,size:12.5});
    for(let i=0;i<4;i++)tile(ctx,o.m+12+i*(sw+8),C.y+38,sw,26,"M"+(i+1),K.gold,{size:12});
    if(S.fifth!=null){const u=cl(since(now,S.fifth)/900,0,1),x5=o.m+12+4*(sw+8),stop=S.fifthAs==="test";
      tile(ctx,lp(o.lw-o.m-sw-4,x5,eo(u)),C.y+38,sw,26,"M5",stop?K.bad:K.warm,{size:12,mark:u>=1?(stop?"no":null):null,strike:stop&&u>=1});
      if(u>=1)line1(ctx,W.out[S.fifthAs],o.m+12,C.y+C.h-14,o.lw-o.m*2-24,12.5,{w:700,color:rgbaS(stop?K.good:K.bad,1)});}
    else line1(ctx,W.out.none,o.m+12,C.y+C.h-14,o.lw-o.m*2-24,12.5,{w:600,color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.answer,()=>S.ans==null?"–":String(S.ans)],[W.read.list,()=>String(W.target)],[W.read.rule,()=>W.ases.find(x=>x[0]===S.as)[1]]]};};

/* ---------- 7 · Keeping it true: one change, through every layer ---------- */
// A change arrives: a new reporting rule that redefines completion rate (version 3), a credential issued in error, or a definition the
// agent drafted that nobody asked for. Send it straight to be merged, or to its owner and a review; keep last year's version, or not.
// Run it, and watch it go down the layers: the glossary, the logical model, the contract and tests, the semantic layer, the dashboards.
PLAY.change=(Lb,api)=>{const W=Lb.w,S={ch:"rule",path:"merge",keep:false,run:null,R:null};
  const r1=api.group(W.chL);api.seg(r1,W.chs,"rule",v=>{S.ch=v;S.run=null;api.kick(300);api.say(W.msg["ch_"+v]);},W.chL);
  const r2=api.group(W.pathL);api.seg(r2,W.paths,"merge",v=>{S.path=v;S.run=null;api.kick(200);api.say(W.msg["path_"+v]);},W.pathL);
  api.toggle(r2,W.keepT,false,v=>{S.keep=v;api.say(v?W.msg.keepOn:W.msg.keepOff);api.kick(200);});
  // what happens at each layer: "ok" (in step), "stop" (stopped there), "skip" (untouched), and where it ends
  const plan=()=>{const n=W.layers.length;if(S.ch==="revoke")return{marks:Array(n).fill("skip"),end:"data"};
    if(S.path==="merge")return{marks:W.layers.map((x,i)=>i<2?"ok":i===2?"stop":"skip"),end:"tests"};
    if(S.ch==="agent")return{marks:Array(n).fill("skip"),end:"reject"};return{marks:Array(n).fill("ok"),end:"step"};};
  const r3=api.group();api.btn(r3,W.runB,()=>{S.run=performance.now();S.R=Object.assign(plan(),{ch:S.ch,keep:S.keep});api.kick(3200);api.say(W.msg.running);const t=S.run;
    setTimeout(()=>{if(S.run!==t)return;const e=S.R.end;api.say(W.msg["end_"+e]+(e==="step"?" "+(S.R.keep?W.msg.kept:W.msg.lost):""),e==="step"&&!S.R.keep?"warn":"ok");
      api.reach(e);if(e==="step"&&S.R.keep)api.reach("version");api.refresh();},RM()?0:2600);},"go");
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.ow={y:12,h:58};o.ly=W.layers.map((x,i)=>({y:o.ow.y+o.ow.h+10+i*42,h:36}));const ly=o.ly[o.ly.length-1];o.dash={y:ly.y+ly.h+12,h:96};o.h=o.dash.y+o.dash.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const R=S.run!=null?S.R:null,t=R?since(now,S.run):0,step=420;
    // the owner, and what she decides
    const cw=W.chs.find(x=>x[0]===(R?R.ch:S.ch))[1],dec=R&&t>800?W.owner[R.end]:W.owner.wait,dc=!R||t<=800?K.soft:R.end==="tests"||R.end==="reject"?K.bad:K.good;
    card(ctx,o.m,o.ow.y,o.lw-o.m*2,o.ow.h,K.warm,cw,{glow:R&&t<600?16:6,size:13});line1(ctx,dec,o.m+12,o.ow.y+44,o.lw-o.m*2-24,12.5,{w:700,color:rgbaS(dc,1)});
    W.layers.forEach((s,i)=>{const L2=o.ly[i],mk=R?R.marks[i]:null,on=R&&t>=(i+1)*step,col=!on||mk==="skip"?K.plat:mk==="ok"?K.good:K.bad;
      card(ctx,o.m,L2.y,o.lw-o.m*2,L2.h,col,s,{glow:on&&mk!=="skip"?12:3,size:12.5,a:on&&mk==="skip"?0.55:1});
      if(on&&mk!=="skip")mark(ctx,o.lw-o.m-2,L2.y+2,mk==="ok"?"ok":"no");if(on&&mk==="stop")pill(ctx,o.lw-o.m-12,L2.y+6,W.stopped,K.bad,{align:"right",size:12});});
    if(R&&t<W.layers.length*step+step)api.kick(100);
    // the dashboards: this year, and last year's report
    const D=o.dash,done=R&&t>=2600,changed=done&&R.end==="step",lastMoved=changed&&!R.keep,dropped=done&&R.end==="data";card(ctx,o.m,D.y,o.lw-o.m*2,D.h,K.gold,W.dashT,{glow:4,size:12.5});
    line1(ctx,fill(W.now,{v:changed?W.v.newNow:W.v.oldNow}),o.m+12,D.y+42,o.lw-o.m*2-24,13,{w:800,color:rgbaS(changed?K.good:K.ink,1)});
    line1(ctx,fill(W.creds,{c:dropped?W.v.credsAfter:W.v.creds}),o.m+12,D.y+63,o.lw-o.m*2-24,13,{w:800,color:rgbaS(dropped?K.good:K.ink,1)});
    line1(ctx,fill(W.last,{v:lastMoved?W.v.lastNew:W.v.lastOld}),o.m+12,D.y+84,o.lw-o.m*2-24,12.5,{w:700,color:rgbaS(lastMoved?K.bad:K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.path,()=>W.paths.find(x=>x[0]===S.path)[1]],[W.read.last,()=>S.keep?W.read.keeps:W.read.recalc]]};};

const BUILD={play:labPlay};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"pg-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","pg-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"pg-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"pg-tab-"+Lb.id,"aria-controls":"pg-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
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
const PK=L.pics,GO=(S,now)=>S.done?eo(since(now,S.done)/700):0;
// four offices, four numbers for one question
VIS.count=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const m=12,t=GO(S,now),P=PK.count,cols=2,w=(o.lw-m*2-8)/cols;
  P.offices.forEach(([n,v],i)=>{const x=m+(i%cols)*(w+8),y=12+Math.floor(i/cols)*58;card(ctx,x,y,w,50,K.plat,n,{glow:4,size:12.5});line1(ctx,v,x+12,y+41,w-24,13.5,{w:800});});
  line1(ctx,P.ask,m,148,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.count.h=()=>164;
// one fact, one system of record, and the copies around it
VIS.source=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.plat);const m=12,t=GO(S,now),P=PK.source,cw=Math.min(200,o.lw-m*2);chip(ctx,(o.lw-cw)/2,14,cw,36,P.src,t>0?K.gold:K.plat,{size:13.5,glow:t>0?14:6});
  const n=P.copies.length,w=(o.lw-m*2-(n-1)*8)/n;P.copies.forEach((s,i)=>{const x=m+i*(w+8);arrow(ctx,o.lw/2,52,x+w/2,96,t>0?K.gold:K.soft,0.8,{head:6,dash:t>=1?null:[4,4]});chip(ctx,x,100,w,36,s,K.soft,{size:12.5});});};
VIS.source.h=()=>150;
// two shapes for one set of facts: built to write, built to read
VIS.shape=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.plat);const m=12,t=GO(S,now),P=PK.shape,w=(o.lw-m*2-40)/2;card(ctx,m,20,w,96,K.plat,P.a,{glow:4,size:13});card(ctx,o.lw-m-w,20,w,96,K.gold,P.b,{glow:4,size:13});
  lines(ctx,P.aSub,m+12,66,w-24,{size:12.5,max:2,color:rgbaS(K.soft,1),w:600});lines(ctx,P.bSub,o.lw-m-w+12,66,w-24,{size:12.5,max:2,color:rgbaS(K.soft,1),w:600});
  arrow(ctx,m+w+6,68,o.lw-m-w-6,68,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[4,4],lw:t>0?2.6:2});line1(ctx,P.mid,m,148,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.shape.h=()=>164;
// four shapes of the same facts
VIS.shapes=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.cold);const m=12,t=GO(S,now),P=PK.shapes,w=(o.lw-m*2-8)/2,cols=[K.plat,K.gold,K.warm,K.cold];
  P.rows.forEach((r,i)=>{const x=m+(i%2)*(w+8),y=12+Math.floor(i/2)*52;chip(ctx,x,y,w,44,r,cols[i],{size:13,glow:t>0?10:4});});line1(ctx,P.mid,m,138,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.shapes.h=()=>154;
// a write side and a read side, and changes between them
VIS.sync=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.hot);const m=12,t=GO(S,now),P=PK.sync,w=Math.min(150,(o.lw-m*2)*0.34);card(ctx,m,20,w,80,K.hr,P.a,{glow:4,size:13});card(ctx,o.lw-m-w,20,w,80,K.gold,P.b,{glow:4,size:13});
  const gx=m+w+8,gw=o.lw-m*2-w*2-16;arrow(ctx,gx,74,gx+gw,74,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[4,4],lw:t>0?2.6:2});
  P.tiles.forEach((s,i)=>{const tw_=Math.min(84,gw-8);tile(ctx,gx+(gw-tw_)/2,22+i*24,tw_,20,s,K.plat,{size:12});});line1(ctx,P.mid,m,134,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.sync.h=()=>150;
// what an assistant reads, and the number it gives
VIS.ground=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.plat);const m=12,t=GO(S,now),P=PK.ground,w=(o.lw-m*2-30)/2;P.reads.forEach((s,i)=>chip(ctx,m,14+i*36,w,30,s,K.plat,{size:12.5,tint:0.06}));
  arrow(ctx,m+w+4,70,o.lw-m-w-4,70,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[4,4]});card(ctx,o.lw-m-w,30,w,80,t>0?K.gold:K.plat,P.who,{glow:t>0?14:4,size:13});line1(ctx,P.ans,o.lw-m-w+12,94,w-24,14,{w:800});};
VIS.ground.h=()=>14+3*36+10;
// the layers one change goes through
VIS.change=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const m=12,t=GO(S,now),P=PK.change;P.layers.forEach((s,i)=>{const y=12+i*32;card(ctx,m+i*6,y,o.lw-m*2-i*12,28,t>0?K.gold:K.plat,s,{glow:t>0?8:3,size:12.5});});};
VIS.change.h=n=>12+5*32+4;
})();
