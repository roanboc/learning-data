/* Learning Data: In the weeds of data crafting. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from
   one engine, copied from From words to data's (site/assets/from-words-to-data/learn.js), itself from Data that moves': the series'
   labs page and scenarios page load a film's bundle (for its parts: glass, T, withA, rr, tw), the words (learn.en.js or learn.es.js,
   which set window.IW), and this file.
   Every lab is a playground (kind "play"), one for each film, as the author set on 18 November 2026: the visitor switches, picks and
   presses, and watches what happens; each playground has three to five experiments (w.goals), each ticked when the visitor makes it
   happen, and its end once all are ticked. Each playground's own rules are in PLAY below, its words in the pack; every one draws a
   board (board(), below): panels of rows and chips that keep their places while their words and tones change.
   The scenarios are the series' evaluation, every one a choice, its options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its words stay
   big enough to read on a phone. Things settle, or jump to where they end when the visitor asks for reduced motion, and every change
   is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films), both from
   site-tools/build_series.py. Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments)
   and "quiz" (answers by scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.IW,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-in-the-weeds";
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
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).length||10,filmN=n=>fill(U.filmN,{n,of:NF});

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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/in-the-weeds.js)
const MISS=window.IW_MISS=new Set();
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


/* ---------- a board: panels of rows and chips, the picture every playground here draws ---------- */
// view() gives the panels, top to bottom, the same ones in every state: only their words and tones change, so the layout holds.
// A panel: {t: title, c: colour, rows: [[text, tone, 2 (two lines kept for it)]], chips: [[label, tone, {strike}]], mark: "ok" | "no",
// half: true (beside the next half, on a wide picture), arrow: true (an arrow down into it)}. A tone is ok, bad, warn, gold, soft or
// ink. A panel whose words or tones change glows for a moment, so the eye finds what moved.
const TONE={ok:K.good,bad:K.bad,warn:K.warm,gold:K.gold,soft:K.soft,ink:K.ink};
function board(api,view){const sig=[],t0=[];
  const rowsH=p=>(p.rows||[]).reduce((a,r)=>a+(r[2]===2?36:20),0);
  const ph=(ctx,p,w)=>{let hh=34+rowsH(p);if(p.chips&&p.chips.length)hh+=flow(ctx,p.chips.map(c=>c[0]),w-24,12.5,6,26).h+8;return hh+6;};
  const lay=(lw,ctx)=>{const m=12,o={lw,m,ps:[]},V=view();let y=10;
    for(let i=0;i<V.length;i++){const p=V[i],q=V[i+1],two=p.half&&q&&q.half&&lw>=600;if(p.arrow||(two&&q.arrow))y+=18;
      if(two){const w=(lw-m*2-10)/2,hh=Math.max(ph(ctx,p,w),ph(ctx,q,w));o.ps.push({x:m,y,w,h:hh},{x:m+w+10,y,w,h:hh});y+=hh+10;i++;}
      else{const w=lw-m*2,hh=ph(ctx,p,w);o.ps.push({x:m,y,w,h:hh});y+=hh+(V[i+1]&&V[i+1].arrow?0:10);}}
    o.h=y;return o;};
  const draw=(ctx,o,now)=>{const V=view();ground(ctx,o.lw,o.h,K[V[0].c]||K.plat);let busy=false;
    V.forEach((p,i)=>{const b=o.ps[i];if(!b)return;const s=JSON.stringify(p);if(sig[i]!==s){if(sig[i]!=null)t0[i]=now;sig[i]=s;}
      const u=t0[i]==null?1:cl(since(now,t0[i])/900,0,1),col=K[p.c]||K.plat,hot=1-eo(u);if(u<1)busy=true;
      if(p.arrow)arrow(ctx,b.x+b.w/2,b.y-16,b.x+b.w/2,b.y-3,hot>0.05?K.gold:K.soft,0.9,{head:6,lw:hot>0.05?2.4:1.8});
      card(ctx,b.x,b.y,b.w,b.h,col,p.t,{glow:4+16*hot,size:13,dash:!!p.dash,right:p.mark?14:0});if(p.mark)mark(ctx,b.x+b.w-4,b.y+4,p.mark);
      let y=b.y+34;(p.rows||[]).forEach(r=>{const c=rgbaS(TONE[r[1]]||K.ink,1);if(r[2]===2){lines(ctx,r[0],b.x+12,y+12,b.w-24,{size:12.5,max:2,color:c});y+=36;}else{line1(ctx,r[0],b.x+12,y+12,b.w-24,12.5,{w:700,color:c});y+=20;}});
      if(p.chips&&p.chips.length){const f=flow(ctx,p.chips.map(c=>c[0]),b.w-24,12.5,6,26);p.chips.forEach((c,j)=>{const q=f.pos[j],tc=TONE[c[1]]||K.soft;
        chip(ctx,b.x+12+q.x,y+4+q.y,q.w,q.h,c[0],tc,{size:12.5,glow:c[1]==="soft"?2:6,tint:c[1]==="soft"?0.05:0.16,strike:c[2]&&c[2].strike,color:c[1]==="soft"?rgbaS(K.soft,1):null});});}});
    if(busy)api.kick(80);};
  return{lay,draw};}
const tone=b=>b?"ok":"bad";
// one switch, one experiment: a choice in a row, said in words, and the picture moved
function pick(api,label,items,cur,fn){const r=api.group(label);api.seg(r,items,cur,v=>{fn(v);api.kick(1000);},label);return r;}

/* ---------- 1 · Declare it, then build it: the blueprint and the building work ---------- */
// The blueprint (what's declared: grain, keys, contracts, tests, meaning) beside the building work (the queries that make the tables).
// Switch the tool that builds, leave the award undeclared or declare it, slip a bug into its query, and let the agent draft a step.
PLAY.blueprint=(Lb,api)=>{const W=Lb.w,S={tool:"dbt",decl:false,bug:false,agent:0,seen:new Set(["dbt"])};
  pick(api,W.toolL,W.tools.map(t=>[t.k,t.n]),"dbt",v=>{S.tool=v;S.seen.add(v);api.say(fill(W.msg.tool,{t:W.tools.find(t=>t.k===v).n}));if(S.seen.size>=2)api.reach("tool");});
  const r=api.group(W.awardL);api.toggle(r,W.declT,false,v=>{S.decl=v;api.kick(1000);say();});api.toggle(r,W.bugT,false,v=>{S.bug=v;api.kick(1000);say();});
  function say(){if(S.bug&&S.decl){api.say(W.msg.caught,"ok");api.reach("caught");}else if(S.bug){api.say(W.msg.silent,"warn");api.reach("silent");}else api.say(S.decl?W.msg.decl:W.msg.undecl);}
  const r2=api.group(W.agentL);api.btn(r2,W.draftB,()=>{S.agent=1;api.kick(1000);api.say(W.msg.draft);});
  api.btn(r2,W.approveB,()=>{if(!S.agent){api.say(W.msg.nothing);return;}S.agent=2;api.kick(1000);api.say(W.msg.approved,"ok");api.reach("approve");});
  const T0=()=>W.tools.find(t=>t.k===S.tool);
  const view=()=>[{t:W.bpT,c:"gold",half:true,rows:W.bp.map((x,i)=>i===2?[S.decl?x:W.bpNone,S.decl?"ink":"bad"]:[x,"ink"])},
    {t:fill(W.workT,{t:T0().n}),c:"plat",half:true,rows:T0().rows.map(x=>[x,"ink"])},
    {t:W.checkT,c:S.bug&&!S.decl?"bad":"good",arrow:true,mark:S.bug?(S.decl?"ok":"no"):null,
     rows:[[fill(W.tests,{n:S.decl?W.nTests+6:W.nTests}),"soft"],[S.bug?(S.decl?W.res.caught:W.res.silent):W.res.green,S.bug?(S.decl?"ok":"bad"):"ok",2]]},
    {t:W.prT,c:"arch",rows:[[S.agent?W.pr.what:W.pr.none,S.agent?"ink":"soft"],[S.agent===2?W.pr.ok:S.agent?W.pr.wait:"–",S.agent===2?"ok":"warn"]]}];
  return Object.assign({S,readouts:[[W.read.bp,()=>S.decl?W.read.all:W.read.gap],[W.read.tool,()=>T0().n]]},board(api,view));};

/* ---------- 2 · Start from a question: the slice ---------- */
// The glossary's terms, and the question's slice of them; a microcredential, a kind of credential or a thing of its own; and two
// meanings of award that disagree, settled by an agent or by the owner.
PLAY.scope=(Lb,api)=>{const W=Lb.w,S={on:new Set(W.on0),kind:"split",who:"agent"};
  const need=W.terms.filter(t=>t.q).map(t=>t.k),exact=()=>need.every(k=>S.on.has(k))&&S.on.size===need.length;
  const r=api.group(W.termsL);W.terms.forEach(t=>api.toggle(r,t.n,S.on.has(t.k),v=>{if(v)S.on.add(t.k);else S.on.delete(t.k);api.kick(1000);
    if(v&&t.k==="fee"){api.say(W.msg.fee,"warn");api.reach("fee");}else if(exact()){api.say(W.msg.exact,"ok");api.reach("slice");}else api.say(v&&!t.q?fill(W.msg.out,{t:t.n}):W.msg.more);}));
  pick(api,W.kindL,W.kinds,"split",v=>{S.kind=v;api.say(W.msg[v],v==="sub"?"ok":"warn");if(v==="sub")api.reach("kind");});
  pick(api,W.whoL,W.whos,"agent",v=>{S.who=v;api.say(W.msg[v],v==="mei"?"ok":"warn");if(v==="mei")api.reach("owner");});
  const status=()=>{const miss=need.filter(k=>!S.on.has(k)),extra=[...S.on].filter(k=>!need.includes(k));
    if(!miss.length&&!extra.length)return[W.st.exact,"ok"];if(extra.includes("fee"))return[W.st.fee,"bad"];if(extra.length)return[W.st.extra,"bad"];return[fill(W.st.miss,{n:miss.length}),"warn"];};
  const view=()=>[{t:W.qT,c:"gold",rows:W.q.map(x=>[x,"ink"])},
    {t:W.glT,c:"plat",arrow:true,chips:W.terms.map(t=>[t.n,S.on.has(t.k)?(t.q?"ok":"bad"):"soft"]),rows:[status().concat([2])],mark:exact()?"ok":null},
    {t:W.microT,c:"arch",half:true,rows:W.micro.map(x=>[x[0],x[1]?"ink":"warn"]).concat([[S.kind==="sub"?W.st.sub:W.st.split,S.kind==="sub"?"ok":"bad",2]])},
    {t:W.awT,c:"warm",half:true,rows:[[W.aw,"soft",2],[S.who==="mei"?W.st.mei:W.st.agent,S.who==="mei"?"ok":"bad",2]]}];
  return Object.assign({S,readouts:[[W.read.slice,()=>String(S.on.size)],[W.read.done,()=>exact()?W.read.yes:W.read.no]]},board(api,view));};

/* ---------- 3 · What makes it the same one: keys, rules and a person's decision ---------- */
// Aisha's keys in three systems, and a second Aisha whose account holds our Aisha's student ID by mistake. Write keys one way, switch
// the rules on, most trusted first, record Mei's decision; then hash a key, with a trailing space, as typed or through one macro.
PLAY.same=(Lb,api)=>{const W=Lb.w,S={norm:false,r2:false,r3:false,apart:false,hash:"typed",space:false,merged:false};
  const res=()=>{const a="aisha";return{p88:S.r2?a:"own",p91:S.r2&&!S.apart?a:"own",mail:S.r3&&S.norm?a:"own"};};
  const mine=()=>{const R=res();return 1+(R.p88==="own"?1:0)+(R.mail==="own"?1:0);},wrong=()=>res().p91==="aisha";
  const r=api.group(W.rulesL);api.toggle(r,W.normT,false,v=>{S.norm=v;after();});api.toggle(r,W.r2T,false,v=>{S.r2=v;after();});api.toggle(r,W.r3T,false,v=>{S.r3=v;after();});
  api.toggle(api.group(W.meiL),W.apartT,false,v=>{S.apart=v;after();});
  function after(){api.kick(1000);if(wrong()){S.merged=true;api.say(W.msg.merged,"warn");api.reach("merge");}
    else if(S.apart&&S.merged&&mine()===1){api.say(W.msg.apart,"ok");api.reach("apart");api.reach("one");}
    else if(mine()===1){api.say(W.msg.one,"ok");api.reach("one");}else api.say(fill(W.msg.n,{n:mine()}));}
  const r3=api.group(W.hashL);api.seg(r3,W.hashes,"typed",v=>{S.hash=v;api.kick(1000);hashSay();},W.hashL);api.toggle(r3,W.spaceT,false,v=>{S.space=v;api.kick(1000);hashSay();});
  function hashSay(){const same=S.hash==="macro"||!S.space;api.say(same?W.msg.same:W.msg.moved,same?"ok":"warn");if(S.space&&S.hash==="macro")api.reach("hash");}
  // a stand-in for a hash: 64 characters a key always gives, shown by its first twelve
  const hx=s=>{let a=2166136261,o="";for(let k=0;k<8;k++){for(let i=0;i<s.length;i++){a^=s.charCodeAt(i)+k;a=Math.imul(a,16777619)>>>0;}o+=(a>>>0).toString(16).padStart(8,"0");}return o.slice(0,12)+"…";};
  const key=()=>{const raw=W.key+(S.space?" ":"");return S.hash==="macro"?raw.trim().toUpperCase():raw;};
  const view=()=>{const R=res(),tn=v=>v==="aisha"?"gold":"soft";
    return[{t:W.keysT,c:"gold",chips:[[W.k.sis,"gold"],[W.k.p88,tn(R.p88)],[W.k.mail,tn(R.mail)],[W.k.p91,R.p91==="aisha"?"bad":"soft"]],rows:[[S.norm?W.mailN:W.mailRaw,S.norm?"ok":"warn",2]]},
      {t:W.ruleT,c:"plat",arrow:true,rows:W.rules.map((x,i)=>[x,i===1?(S.r2?"ink":"soft"):i===2?(S.r3?"ink":"soft"):"ink"])},
      {t:W.aishaT,c:wrong()?"bad":"good",arrow:true,mark:wrong()?"no":mine()===1?"ok":null,rows:[[fill(W.learners,{n:mine()}),mine()===1?"ok":"warn"],[wrong()?W.wallet6:W.wallet5,wrong()?"bad":"ink"],[S.apart?W.decided:W.tests,S.apart?"ok":"soft"]]},
      {t:W.hashT,c:"arch",rows:[[fill(W.input,{k:key().replace(/ $/,"␣")}),"ink"],[hx(key()),"gold"],[S.hash==="macro"||!S.space?W.st.same:W.st.moved,S.hash==="macro"||!S.space?"ok":"bad"]]}];};
  return Object.assign({S,readouts:[[W.read.learners,()=>String(mine())],[W.read.wallet,()=>wrong()?"6":"5"]]},board(api,view));};

/* ---------- 4 · One row of what, and when: grain and time ---------- */
// Health's graduate certificate, renamed in July: join on its key alone, or on the version valid on the day. Ask about census day or
// today. Date Priya's withdrawal by when it took effect, or by when it was recorded.
PLAY.grain=(Lb,api)=>{const W=Lb.w,S={join:"version",day:"census",by:"recorded",fan:false,seen:new Set(["census"]),late:false};
  pick(api,W.joinL,W.joins,"version",v=>{S.join=v;if(v==="key"){S.fan=true;api.say(W.msg.fan,"warn");api.reach("fan");}else{api.say(W.msg.fixed,"ok");if(S.fan)api.reach("fixfan");}});
  pick(api,W.dayL,W.days,"census",v=>{S.day=v;S.seen.add(v);api.say(W.msg[v]);if(S.seen.size===2)api.reach("days");});
  pick(api,W.byL,W.bys,"recorded",v=>{S.by=v;api.say(W.msg[v],v==="effect"?"ok":"warn");if(v==="effect")api.reach("late");});
  const fan=()=>S.join==="key",near=()=>S.day==="census"?12:9;
  const view=()=>[{t:W.awT,c:"warm",rows:W.vers.map((x,i)=>[x,fan()||i===0?"ink":"soft"])},
    {t:W.tabT,c:fan()?"bad":"good",arrow:true,mark:fan()?"no":"ok",rows:[[fill(W.rows,{n:fan()?16:8,p:fan()?370:185}),fan()?"bad":"ink"],[fan()?W.gFail:W.gPass,fan()?"bad":"ok"]]},
    {t:W.dayT,c:"plat",half:true,rows:[[S.day==="census"?W.aishaC:W.aishaT,"ink",2],[fill(W.near,{n:near()}),"gold"]]},
    {t:W.priyaT,c:S.by==="effect"?"good":"warm",half:true,rows:[[W.priya,"soft",2],[S.by==="effect"?W.bus3:W.bus4,S.by==="effect"?"ok":"bad"]]}];
  return Object.assign({S,readouts:[[W.read.rows,()=>String(fan()?16:8)],[W.read.near,()=>String(near())]]},board(api,view));};

/* ---------- 5 · Promises and proofs: tests, a contract, and levels ---------- */
// Six bad rows made on purpose, and six kinds of test that each catch one; a contract that stops a build when a type disagrees; and
// walk-ins with no email, against the level the learning team set: warn on any, stop above five.
PLAY.catch=(Lb,api)=>{const W=Lb.w,S={on:new Set(),enf:false,txt:false,walk:"0",lv:new Set()};
  const r=api.group(W.testsL);W.bad.forEach(b=>api.toggle(r,b.test,false,v=>{if(v)S.on.add(b.k);else S.on.delete(b.k);api.kick(1000);
    const n=S.on.size;api.say(n===W.bad.length?W.msg.all:fill(W.msg.n,{n,of:W.bad.length}),n===W.bad.length?"ok":null);if(n===W.bad.length)api.reach("all");}));
  const r2=api.group(W.conL);api.toggle(r2,W.enfT,false,v=>{S.enf=v;con();});api.toggle(r2,W.txtT,false,v=>{S.txt=v;con();});
  function con(){api.kick(1000);if(S.txt&&S.enf){api.say(W.msg.stopped,"ok");api.reach("contract");}else if(S.txt)api.say(W.msg.made,"warn");else api.say(W.msg.agree);}
  pick(api,W.walkL,W.walks,"0",v=>{S.walk=v;const k=v==="0"?"pass":v==="1"?"warn":"stop";api.say(W.msg[k],k==="stop"?"warn":null);if(k!=="pass"){S.lv.add(k);api.reach(k);}});
  const lvl=()=>S.walk==="0"?["pass","ok"]:S.walk==="1"?["warn","warn"]:["stop","bad"];
  const view=()=>[{t:fill(W.badT,{n:S.on.size,of:W.bad.length}),c:S.on.size===W.bad.length?"good":"warm",mark:S.on.size===W.bad.length?"ok":null,rows:W.bad.map(b=>[(S.on.has(b.k)?"✓ ":"✗ ")+b.row,S.on.has(b.k)?"ok":"bad"])},
    {t:W.conT,c:"plat",half:true,rows:[[S.enf?W.con.on:W.con.off,S.enf?"ok":"soft"],[S.txt?(S.enf?W.con.stop:W.con.made):W.con.agree,S.txt?(S.enf?"ok":"bad"):"ink",2]]},
    {t:W.lvT,c:"arch",half:true,rows:[[W.level,"soft",2],[W.lv[lvl()[0]],lvl()[1]]]}];
  return Object.assign({S,readouts:[[W.read.caught,()=>S.on.size+" / "+W.bad.length],[W.read.build,()=>S.txt&&S.enf?W.read.stopped:W.read.lv[lvl()[0]]]]},board(api,view));};

/* ---------- 6 · Built in layers: once, on the core, and stored to fit ---------- */
// Match a learner's keys in each mart or once, before the core; build the wallet's mart on the core or on Planning's; and run the
// incremental credential table, twice, then with a new rule, then in full.
PLAY.once=(Lb,api)=>{const W=Lb.w,S={match:"each",on:"mart",runs:0,last:null,rule:false,mixed:false};
  pick(api,W.matchL,W.matches,"each",v=>{S.match=v;api.say(W.msg[v],v==="once"?"ok":"warn");if(v==="once")api.reach("once");});
  pick(api,W.onL,W.ons,"mart",v=>{S.on=v;api.say(W.msg["on_"+v],v==="core"?"ok":"warn");if(v==="core")api.reach("core");});
  const r=api.group(W.incL);
  api.btn(r,W.runB,()=>{S.runs++;api.kick(1000);if(S.rule){S.last=W.n.changed;S.mixed=true;S.rule=false;rb.setAttribute("aria-pressed","false");api.say(W.msg.mixed,"warn");}
    else{S.last=S.runs===1&&!S.mixed?W.n.first:0;api.say(S.last===0?W.msg.nothing:W.msg.first,S.last===0?"ok":null);if(S.last===0)api.reach("idem");}},"go");
  const rb=api.toggle(r,W.ruleT,false,v=>{S.rule=v;api.kick(600);api.say(v?W.msg.rule:W.msg.noRule);});
  api.btn(r,W.fullB,()=>{S.runs++;api.kick(1000);S.last=W.n.all;const was=S.mixed;S.mixed=false;S.rule=false;rb.setAttribute("aria-pressed","false");api.say(W.msg.full,"ok");if(was)api.reach("refresh");});
  const view=()=>[{t:W.matchT,c:S.match==="once"?"good":"warm",half:true,rows:S.match==="once"?[[W.m1,"ok"],[W.m1b,"ok"],[W.copies1,"ok"]]:[[W.mP,"ink"],[W.mW,"bad"],[W.copies2,"bad"]]},
    {t:W.onT,c:S.on==="core"?"good":"warm",half:true,rows:S.on==="core"?[[W.oc1,"ok"],[W.oc2,"ok"],[W.oc3,"ink"]]:[[W.om1,"bad"],[W.om2,"bad"],[W.om3,"ink"]]},
    {t:W.incT,c:S.mixed?"bad":"arch",mark:S.mixed?"no":S.last===0?"ok":null,rows:[[fill(W.runs,{n:S.runs,m:S.last==null?"–":S.last}),"ink"],[S.mixed?W.oldRule:S.rule?W.pending:W.allNew,S.mixed?"bad":S.rule?"warn":"ok",2]]}];
  return Object.assign({S,readouts:[[W.read.copies,()=>S.match==="once"?"1":"2"],[W.read.runs,()=>String(S.runs)]]},board(api,view));};

/* ---------- 7 · Who owns what: rings, grants and a shared key ---------- */
// The wallet team builds on a private step, on Planning's protected mart, or on the public core; a grant lets a dashboard read a
// private table all the same; and short courses hash Grace's email with the shared macro, or their own way.
PLAY.access=(Lb,api)=>{const W=Lb.w,S={on:"int",grant:false,hash:"shared"};
  pick(api,W.onL,W.ons,"int",v=>{S.on=v;api.say(W.msg[v],v==="core"?"ok":"warn");if(v==="core")api.reach("core");});
  api.toggle(api.group(W.grantL),W.grantT,false,v=>{S.grant=v;api.kick(1000);api.say(v?W.msg.grant:W.msg.noGrant,v?"warn":null);if(v)api.reach("doors");});
  pick(api,W.hashL,W.hashes,"shared",v=>{S.hash=v;api.say(W.msg[v],v==="own"?"warn":"ok");if(v==="own")api.reach("silo");});
  const view=()=>{const R=W.res[S.on];return[{t:W.ringT,c:"plat",rows:W.rings.map((x,i)=>[x,(S.on==="int"&&i===2)||(S.on==="mart"&&i===1)||(S.on==="core"&&i===0)?"gold":"soft"])},
    {t:W.buildT,c:R[1]==="ok"?"good":R[1]==="bad"?"bad":"warm",arrow:true,mark:R[1]==="ok"?"ok":R[1]==="bad"?"no":null,rows:[[R[0],R[1],2]]},
    {t:W.readT,c:"arch",half:true,rows:[[W.refer,"soft"],[S.grant?W.canRead:W.noRead,S.grant?"warn":"ink",2]]},
    {t:W.hashT,c:S.hash==="own"?"bad":"good",half:true,rows:[[W.here,"ink"],[S.hash==="own"?W.thereOwn:W.there,S.hash==="own"?"bad":"ok"],[S.hash==="own"?W.silo:W.joined,S.hash==="own"?"bad":"ok",2]]}];};
  return Object.assign({S,readouts:[[W.read.builds,()=>W.ons.find(x=>x[0]===S.on)[1]],[W.read.keys,()=>S.hash==="own"?"2":"1"]]},board(api,view));};

/* ---------- 8 · An agent on the team: review its pull request ---------- */
// The agent's shortcut fails the census reconciliation. Pick what its draft does about it; ask for its claims with their queries; run
// the diff incrementally or from scratch; and see what it may reach, as its own principal or with a person's login.
PLAY.review=(Lb,api)=>{const W=Lb.w,S={does:"warn",query:false,diff:"inc",as:"sp",weak:new Set()};
  pick(api,W.doesL,W.does,"warn",v=>{S.does=v;if(v==="report"){api.say(W.msg.report,"ok");api.reach("report");}else{api.say(W.msg[v],"warn");api.reach("weak");}});
  api.toggle(api.group(W.claimL),W.queryT,false,v=>{S.query=v;api.kick(1000);api.say(v?W.msg.query:W.msg.noQuery,v?"ok":"warn");if(v)api.reach("evidence");});
  pick(api,W.diffL,W.diffs,"inc",v=>{S.diff=v;api.say(W.msg[v],v==="full"?"ok":"warn");if(v==="full")api.reach("diff");});
  pick(api,W.asL,W.ases,"sp",v=>{S.as=v;api.say(W.msg["as_"+v],v==="sp"?"ok":"warn");});
  const view=()=>{const D=W.out[S.does],ok=S.does==="report";return[{t:W.prT,c:"arch",rows:[[W.pr1,"soft"],[W.pr2,"bad"],[D[0],"ink"]]},
    {t:W.outT,c:ok?"good":"bad",arrow:true,mark:ok?"ok":"no",rows:[[D[1],ok?"ok":"bad",2],[D[2],ok?"ok":"bad"]]},
    {t:W.claimT,c:S.query?"good":"warm",half:true,rows:[[W.claim,"ink",2],[S.query?W.q:W.noQ,S.query?"ok":"bad"]]},
    {t:W.diffT,c:S.diff==="full"?"good":"warm",half:true,rows:[[W.dMart,"ink"],[S.diff==="full"?W.dFull:W.dInc,S.diff==="full"?"ok":"bad",2]]},
    {t:W.asT,c:S.as==="sp"?"plat":"bad",rows:S.as==="sp"?W.sp.map(x=>[x,"ok",2]):W.jun.map(x=>[x,"bad",2])}];};
  return Object.assign({S,readouts:[[W.read.planning,()=>S.does==="report"?"3":"4"],[W.read.moved,()=>S.diff==="full"?"55":"0"]]},board(api,view));};

/* ---------- 9 · Written once: one home, a new version, and who to tell ---------- */
// The award's definition in four places, or once and shown everywhere; an edit made in the catalog; is_revoked becoming status, in
// place or as a new version with a date; and the lineage that says who reads the credential.
PLAY.home=(Lb,api)=>{const W=Lb.w,S={kept:"four",edit:0,ver:"place",who:false};
  pick(api,W.keptL,W.kepts,"four",v=>{S.kept=v;S.edit=0;api.say(W.msg[v],v==="once"?"ok":"warn");if(v==="once")api.reach("once");});
  api.btn(api.group(W.editL),W.editB,()=>{S.edit++;api.kick(1000);if(S.kept==="once"){api.say(W.msg.over,"ok");api.reach("flow");}else api.say(W.msg.fifth,"warn");});
  pick(api,W.verL,W.vers,"place",v=>{S.ver=v;api.say(W.msg[v],v==="v2"?"ok":"warn");if(v==="v2")api.reach("version");});
  api.btn(api.group(W.whoL),W.whoB,()=>{S.who=true;api.kick(1000);api.say(W.msg.who,"ok");api.reach("lineage");});
  const view=()=>{const once=S.kept==="once";return[{t:W.defT,c:once?"good":"warm",mark:once?"ok":"no",rows:W.places.map((p,i)=>[p+": "+(once?W.right:(i===1&&S.edit?W.edited:W.copies[i])),once?"ok":(W.copies[i]===W.right?"ok":"bad")])},
    {t:W.editT,c:"plat",half:true,rows:[[S.edit?(once?W.e.over:W.e.fifth):W.e.none,S.edit?(once?"ok":"bad"):"soft",2]]},
    {t:W.whoT,c:"arch",half:true,rows:[[S.who?W.w1:W.w0,S.who?"ok":"soft"],[S.who?W.w2:"–","soft"]]},
    {t:W.verT,c:S.ver==="v2"?"good":"bad",mark:S.ver==="v2"?"ok":"no",rows:S.ver==="v2"?[[W.v.v2a,"ok"],[W.v.v2b,"ok",2]]:[[W.v.pa,"bad"],[W.v.pb,"bad",2]]}];};
  return Object.assign({S,readouts:[[W.read.homes,()=>S.kept==="once"?"1":"4"],[W.read.wallet,()=>S.ver==="v2"?W.read.warned:W.read.broken]]},board(api,view));};

/* ---------- 10 · End to end: Finance's question, from start to end ---------- */
// Count recognised credit towards every award, or only the one each learner is enrolled in, against Finance's own number; close the
// open items each check enforces, until the file holding them goes; diff against main; and move Finance out, whole.
PLAY.finance=(Lb,api)=>{const W=Lb.w,S={count:"all",done:new Set(),diff:false,moved:false};
  const match=()=>S.count==="enrolled";
  pick(api,W.countL,W.counts,"all",v=>{S.count=v;api.say(W.msg[v],v==="enrolled"?"ok":"warn");if(v==="enrolled")api.reach("match");});
  const r=api.group(W.workL);
  api.btn(r,W.closeB,()=>{api.kick(1000);W.items.forEach((it,i)=>{if(i>0||match())S.done.add(i);});if(S.done.size===W.items.length){api.say(W.msg.gone,"ok");api.reach("tidy");}else api.say(W.msg.open,"warn");});
  api.btn(r,W.diffB,()=>{S.diff=true;api.kick(1000);api.say(W.msg.diff,"ok");api.reach("moved");});
  api.btn(r,W.moveB,()=>{S.moved=true;api.kick(1000);api.say(W.msg.move,"ok");api.reach("move");});
  const gone=()=>S.done.size===W.items.length;
  const view=()=>[{t:W.qT,c:"gold",rows:[[W.q,"ink",2],[W.fin,"gold"]]},
    {t:W.ansT,c:match()?"good":"bad",arrow:true,mark:match()?"ok":"no",rows:[[match()?W.a.en:W.a.all,"ink"],[match()?W.a.enS:W.a.allS,match()?"ok":"bad"]]},
    {t:gone()?W.fileGone:W.fileT,c:gone()?"good":"warm",half:true,dash:gone(),rows:W.items.map((it,i)=>[(S.done.has(i)?"✓ ":"○ ")+it,S.done.has(i)?"ok":"ink"])},
    {t:W.diffT,c:S.diff?"good":"plat",half:true,rows:W.diffs.map(x=>[S.diff?x:"–",S.diff?"ok":"soft"])},
    {t:W.moveT,c:S.moved?"good":"arch",chips:W.folders.map(f=>[f,S.moved?"ok":"soft"]),rows:[[S.moved?W.mv.done:W.mv.wait,S.moved?"ok":"soft",2]]}];
  return Object.assign({S,readouts:[[W.read.saved,()=>match()?W.a.v1:W.a.v0],[W.read.open,()=>String(W.items.length-S.done.size)]]},board(api,view));};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)

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
// every situation's picture: what it's about, the parts in play, and its question, drawn in gold once it's answered
const VISK=Object.keys(PK).filter(k=>k!=="alt");
VISK.forEach(k=>{VIS[k]=(ctx,o,now,q,S)=>{const P=PK[k],m=12,t=GO(S,now),cw=Math.min(300,o.lw-m*2);ground(ctx,o.lw,o.h,t>0?K.gold:K.plat);
  chip(ctx,(o.lw-cw)/2,14,cw,38,P.a,t>0?K.gold:K.plat,{size:13.5,glow:t>0?14:6});
  const f=flow(ctx,P.items,o.lw-m*2,12.5,8,30),x0=m+(o.lw-m*2-Math.max(...f.pos.map(p=>p.x+p.w)))/2;
  P.items.forEach((s,i)=>{const p=f.pos[i];arrow(ctx,o.lw/2,54,x0+p.x+p.w/2,68+p.y,t>0?K.gold:K.soft,0.7,{head:5,dash:t>=1?null:[4,4]});chip(ctx,x0+p.x,72+p.y,p.w,30,s,K.soft,{size:12.5,tint:0.06});});
  line1(ctx,P.ask,m,72+f.h+26,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
  VIS[k].h=lw=>{const M=document.createElement("canvas").getContext("2d");return 72+flow(M,PK[k].items,lw-24,12.5,8,30).h+40;};});
})();
