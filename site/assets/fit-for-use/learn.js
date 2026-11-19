/* Learning Data: Fit for use. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine,
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
const U=L.ui,P=app.dataset.store||"ld-fit-for-use";
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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/fit-for-use.js)
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


/* ---------- 1 · Good enough for what?: one list, four uses ---------- */
// December's list, with what's wrong in it: names, awards, missing graduates, and old phone numbers no use needs. Three ways to
// judge it: the checks it already had (every value allowed), one level for every field and every use (perfect), or a level for each
// use, agreed with its users. Each fix costs hours. Send it to the printer, and count the certificates printed again.
PLAY.uses=(Lb,api)=>{const W=Lb.w,I=W.issues,US=W.uses,S={mode:"checks",fix:{},sent:null,res:null,changed:performance.now()-1e5};I.forEach(x=>S.fix[x.k]=false);
  const left=k=>!S.fix[k],crit=()=>I.filter(x=>x.crit&&left(x.k));
  const verdict=u=>S.mode==="checks"?"none":S.mode==="perfect"?(I.some(x=>left(x.k))?"no":"ok"):(u.needs.some(left)?"no":"ok");
  const hours=()=>I.reduce((a,x)=>a+(S.fix[x.k]?x.h:0),0);
  const touch=()=>{S.sent=null;S.res=null;S.changed=performance.now();api.kick(500);};
  const r1=api.group(W.modeL);api.seg(r1,W.modes,S.mode,k=>{S.mode=k;touch();api.say(W.msg[k]);if(k==="each"&&left("names"))api.reach("seat");},W.modeL);
  const r2=api.group(W.fixL);I.forEach(x=>api.toggle(r2,x.fix,false,v=>{S.fix[x.k]=v;touch();api.say(fill(v?W.msg.fixOn:W.msg.fixOff,{what:x.short,h:x.h}));}));
  const r3=api.group();api.btn(r3,W.send,()=>{const c=crit(),rep=c.reduce((a,x)=>a+x.n,0);let res;
    if(S.mode==="checks"){res={go:true,rep};api.say(rep?fill(W.msg.sentChecks,{n:rep}):W.msg.sentClean,rep?"no":"ok");if(rep===41)api.reach("checks");}
    else if(S.mode==="perfect"){const any=I.filter(x=>left(x.k));if(any.length){res={go:false,why:any.map(x=>x.short).join(", ")};api.say(fill(W.msg.heldPerfect,{what:res.why}),"warn");if(!c.length)api.reach("perfect");}
      else{res={go:true,rep:0};api.say(fill(W.msg.sentPerfect,{h:hours()}),"ok");}}
    else{const bad=US.filter(u=>verdict(u)==="no");if(bad.length){res={go:false,why:bad.map(u=>u.short).join(", ")};api.say(fill(W.msg.heldEach,{uses:res.why}),"warn");}
      else{res={go:true,rep:0};api.say(fill(left("phones")?W.msg.sentEachSpare:W.msg.sentEach,{h:hours()}),"ok");api.reach("fit");}}
    S.sent=performance.now();S.res=res;api.kick(2200);},"go");
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.list={x:m,y:12,w:lw-m*2};const f=flow(ctx,I.map(x=>x.label),o.list.w-24,12.5,6,26);
    o.chips=f.pos.map(p=>({x:o.list.x+12+p.x,y:o.list.y+52+p.y,w:p.w,h:p.h}));o.list.h=52+f.h+12;
    const gy=o.list.y+o.list.h+10,cw=(lw-m*2-8)/2,ch=lw<440?152:122;o.cards=US.map((u,i)=>({x:m+(i%2)*(cw+8),y:gy+Math.floor(i/2)*(ch+8),w:cw,h:ch}));
    o.pr={x:m,y:gy+2*(ch+8)+2,w:lw-m*2,h:78};o.h=o.pr.y+o.pr.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.brass);
    card(ctx,o.list.x,o.list.y,o.list.w,o.list.h,K.cream,W.listName);
    line1(ctx,S.mode==="checks"?W.allowed:fill(W.fixedH,{h:hours()}),o.list.x+12,o.list.y+40,o.list.w-24,12.5,{w:600,color:rgbaS(S.mode==="checks"?K.good:K.soft,1)});
    I.forEach((x,i)=>{const c=o.chips[i];chip(ctx,c.x,c.y,c.w,c.h,x.label,x.crit?K.warm:K.soft,{size:12.5,strike:S.fix[x.k],a:S.fix[x.k]?0.6:1});});
    const t=eo(since(now,S.changed)/500);
    US.forEach((u,i)=>{const c=o.cards[i],v=verdict(u),col=v==="ok"?K.good:v==="no"?K.bad:K.soft;
      card(ctx,c.x,c.y,c.w,c.h,K.brass,u.name,{size:13.5,glow:v==="none"?3:8});
      const lv=S.mode==="checks"?W.checksLevel:S.mode==="perfect"?W.perfectLevel:u.level;
      const hh=lines(ctx,lv,c.x+12,c.y+42,c.w-24,{size:12.5,max:3,color:rgbaS(K.brass,1)});
      if(S.mode==="each")lines(ctx,u.crit,c.x+12,c.y+46+hh,c.w-24,{size:12,max:2,w:600,color:rgbaS(K.soft,1)});
      withA(ctx,0.4+0.6*t,()=>pill(ctx,c.x+10,c.y+c.h-30,W.verdict[v],col,{size:12,max:c.w-20}));});
    const p=o.pr;card(ctx,p.x,p.y,p.w,p.h,K.steel,W.printer);
    if(!S.res)line1(ctx,W.waiting,p.x+12,p.y+48,p.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    else if(!S.res.go){line1(ctx,fill(W.heldV,{why:S.res.why}),p.x+12,p.y+48,p.w-24,12.5,{w:700,color:rgbaS(K.warm,1)});}
    else{const u=cl(since(now,S.sent)/1600,0,1),n=Math.round(S.res.rep*eo(u));
      line1(ctx,S.res.rep?fill(W.reprintV,{n}):W.noReprint,p.x+12,p.y+46,S.res.rep?Math.min(220,p.w*0.5):p.w-24,12.5,{w:700,color:rgbaS(S.res.rep?K.bad:K.good,1)});
      const x0=p.x+Math.min(240,p.w*0.52),cols=Math.max(6,Math.floor((p.x+p.w-12-x0)/9));for(let k=0;k<n;k++){const xx=x0+(k%cols)*9,yy=p.y+30+Math.floor(k/cols)*9;ctx.fillStyle=rgbaS(K.bad,0.9);ctx.fillRect(xx,yy,7,7);}}};
  return{S,lay,draw,readouts:[[W.read.fit,()=>S.mode==="checks"?W.read.notAsked:fill(W.read.nOf,{n:US.filter(u=>verdict(u)==="ok").length,of:US.length})],
    [W.read.hours,()=>String(hours())],[W.read.reprints,()=>!S.res?"–":S.res.go?String(S.res.rep):W.read.held]]};};

/* ---------- 2 · A hundred records: measure, then check ---------- */
// A sample of the most recent records, 20, 100 or 400, looked at by hand: each record perfect or not, the share perfect, and how far
// that share can be trusted (the margin). Then the platform profiles the whole list and shows what no sample saw; and only then the
// checks, each saying what it finds.
PLAY.hundred=(Lb,api)=>{const W=Lb.w,R=W.res,S={n:100,looked:new Set(),look:null,lookN:null,prof:null,chk:{}};
  // which records in a sample have an error: the same ones every time, spread through it
  const bad=n=>{const k=n-R[n].ok,ix=[...Array(n).keys()].sort((a,b)=>((a*7919)%997)-((b*7919)%997));return new Set(ix.slice(0,k));};
  const BAD={};Object.keys(R).forEach(n=>BAD[n]=bad(+n));
  const r1=api.group(W.sizeL);api.seg(r1,W.sizes,"100",k=>{S.n=+k;S.look=null;api.say(fill(W.msg.size,{n:k,t:R[k].time}));api.kick(300);},W.sizeL);
  const r2=api.group();api.btn(r2,W.lookB,()=>{S.look=performance.now();S.lookN=S.n;S.looked.add(S.n);api.kick(2000);const r=R[S.n];
    api.say(fill(W.msg.look,{ok:r.ok,n:S.n,lo:r.lo,hi:r.hi,t:r.time})+(S.n===100?" "+W.msg.kinds:""),"ok");if(S.n===100)api.reach("measure");if(S.looked.size>=2)api.reach("margin");},"go");
  api.btn(r2,W.profB,()=>{S.prof=performance.now();api.kick(2200);api.say(W.msg.prof,"ok");api.reach("profile");});
  const r3=api.group(W.chkL),btns={};
  W.checks.forEach(c=>{btns[c.k]=api.toggle(r3,c.name,false,v=>{if(v&&c.prof&&S.prof==null){btns[c.k].setAttribute("aria-pressed","false");api.say(W.msg.first,"warn");return;}
    S.chk[c.k]=v;api.kick(400);api.say(v?c.found:fill(W.msg.off,{c:c.name}),v?(c.n?"ok":"warn"):null);
    if(S.prof!=null&&W.checks.filter(x=>x.prof).every(x=>S.chk[x.k]))api.reach("checks");});});
  const lay=(lw)=>{const m=12,o={lw,m};o.g={x:m,y:12,w:lw-m*2};o.box=Math.min(o.g.w-24,250);o.g.h=40+o.box+52;
    o.rh=lw<440?58:38;o.p={x:m,y:o.g.y+o.g.h+10,w:lw-m*2,h:40+W.rows.length*o.rh+6};o.h=o.p.y+o.p.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.steel);const n=S.n,cols=n===20?5:n===100?10:20,rows=n/cols,cs=Math.min(40,o.box/Math.max(cols,rows)),gx=o.g.x+(o.g.w-cols*cs)/2,gy=o.g.y+40;
    card(ctx,o.g.x,o.g.y,o.g.w,o.g.h,K.cream,fill(W.gridName,{n}));
    const shown=S.look!=null&&S.lookN===n,u=shown?cl(since(now,S.look)/1500,0,1):0,B=BAD[n];
    for(let i=0;i<n;i++){const x=gx+(i%cols)*cs,y=gy+Math.floor(i/cols)*cs,seen=shown&&i<u*n;
      ctx.fillStyle=seen?(B.has(i)?rgbaS(K.bad,0.9):rgbaS(K.good,0.75)):"rgba(239,232,218,0.22)";rr(ctx,x+1.5,y+1.5,cs-3,cs-3,Math.min(4,cs/4));ctx.fill();}
    const ry=o.g.y+o.g.h-22;
    if(shown&&u>=1){const r=R[n];lines(ctx,fill(W.result,{ok:r.ok,n,lo:r.lo,hi:r.hi}),o.g.x+12,ry-14,o.g.w-24,{size:13,max:2,w:700,color:rgbaS(K.ink,1)});}
    else line1(ctx,shown?W.looking:W.notYet,o.g.x+12,ry,o.g.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    card(ctx,o.p.x,o.p.y,o.p.w,o.p.h,K.steel,W.profName);const pu=S.prof==null?0:cl(since(now,S.prof)/1600,0,1);
    W.rows.forEach((rw,i)=>{const y=o.p.y+40+i*o.rh,nar=o.rh>40,c=W.checks.find(x=>x.k===rw.chk),on=c&&S.chk[c.k],vw=64;
      lines(ctx,rw.name,o.p.x+12,y+13,o.p.w-24-vw-(on&&!nar?100:0),{size:12.5,max:2,w:600,color:rgbaS(K.ink,0.92)});
      const v=S.prof==null?"–":String(Math.round(rw.v*eo(pu)));line1(ctx,v,o.p.x+o.p.w-12-vw,y+19,vw,14,{w:800,align:"right",color:rgbaS(rw.v?K.warm:K.soft,1)});
      if(on)pill(ctx,nar?o.p.x+12:o.p.x+o.p.w-12-vw-8,nar?y+34:y+5,c.tag,c.n?K.warm:K.soft,{align:nar?"left":"right",size:12});});
    if(S.look&&u<1||S.prof&&pu<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.perfect,()=>S.look==null?"–":R[S.lookN].ok+" / "+S.lookN],[W.read.margin,()=>S.look==null?"–":R[S.lookN].lo+"–"+R[S.lookN].hi],
    [W.read.held,()=>String(W.checks.reduce((a,c)=>a+(S.chk[c.k]?c.n:0),0))]]};};

/* ---------- 3 · Valid isn't true: allowed, and true ---------- */
// Eight graduates' names, each allowed by the name checks; some are true and some aren't. A reference outside the data settles each
// doubt: the graduate, the document seen at enrolment, and the exam boards' approved lists, kept apart. A copy of the student system
// agrees with the list, and both are wrong.
PLAY.truth=(Lb,api)=>{const W=Lb.w,RW=W.rows,S={valid:null,asked:null,doc:null,copy:null,boards:null,last:null};
  const fixed=r=>S.asked!=null&&r.err!=="ok"&&r.err!=="silent"&&(r.err!=="changed"||S.doc!=null);
  const trueN=()=>S.asked==null?0:RW.filter(r=>r.err!=="silent"&&(r.err!=="changed"||S.doc!=null)).length;
  const go=(k,ms)=>{S[k]=performance.now();S.last=k;api.kick(ms||1600);};
  const r1=api.group(W.actL);
  api.btn(r1,W.validB,()=>{go("valid");api.say(W.msg.valid,"warn");api.reach("valid");},"go");
  api.btn(r1,W.askB,()=>{go("asked",2000);api.say(W.msg.asked,"ok");api.reach("asked");});
  api.btn(r1,W.docB,()=>{if(S.asked==null){api.say(W.msg.docFirst,"warn");return;}go("doc");api.say(W.msg.doc,"ok");api.reach("doc");});
  const r2=api.group(W.refL);
  api.btn(r2,W.copyB,()=>{go("copy");api.say(W.msg.copy,"no");api.reach("copy");});
  api.btn(r2,W.boardsB,()=>{go("boards");api.say(W.msg.boards,"ok");api.reach("boards");});
  const lay=(lw)=>{const m=12,o={lw,m};o.nar=lw<460;o.rh=o.nar?46:28;o.t={x:m,y:12,w:lw-m*2,h:62+RW.length*o.rh+8};o.mw=o.nar?(o.t.w-24)/3:Math.min(96,(o.t.w-24)*0.2);o.a={x:m,y:o.t.y+o.t.h+10,w:lw-m*2,h:lw<460?134:118};o.h=o.a.y+o.a.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.brass);const t=o.t,mw=o.mw,nx=t.x+12,nw=o.nar?t.w-24:t.w-24-mw*3,cx=k=>t.x+t.w-12-mw*(3-k),dy=o.nar?38:19;
    card(ctx,t.x,t.y,t.w,t.h,K.cream,W.tableName);
    W.cols.forEach((c,k)=>line1(ctx,c,cx(k),t.y+48,mw,12,{w:800,align:"center",color:rgbaS(K.soft,1)}));
    if(!o.nar)line1(ctx,W.nameCol,nx,t.y+48,nw,12,{w:800,color:rgbaS(K.soft,1)});
    const fade=k=>S[k]==null?0:eo(since(now,S[k])/600);
    RW.forEach((r,i)=>{const y=t.y+62+i*o.rh,fx=fixed(r);if(i%2===0){ctx.fillStyle="rgba(239,232,218,0.05)";ctx.fillRect(t.x+6,y,t.w-12,o.rh);}
      line1(ctx,fx?r.truth:r.shown,nx,y+19,nw,13,{w:700,color:rgbaS(fx?K.good:K.ink,0.96)});
      const mid=k=>cx(k)+mw/2;
      if(S.valid!=null)withA(ctx,fade("valid"),()=>mark(ctx,mid(0),y+dy-5,"ok"));
      if(S.asked!=null)withA(ctx,fade("asked"),()=>{const s=r.err==="ok"?W.said.ok:r.err==="silent"?W.said.silent:W.said.fixed;
        line1(ctx,s,cx(1),y+dy,mw,12,{w:700,align:"center",color:rgbaS(r.err==="ok"?K.good:r.err==="silent"?K.soft:K.warm,1)});});
      if(S.doc!=null&&r.err!=="silent")withA(ctx,fade("doc"),()=>{line1(ctx,r.err==="changed"?W.said.newDoc:W.said.match,cx(2),y+dy,mw,12,{w:700,align:"center",color:rgbaS(K.good,1)});});});
    const a=o.a;card(ctx,a.x,a.y,a.w,a.h,K.steel,W.awardsName);
    line1(ctx,W.onList,a.x+12,a.y+46,a.w-24,13,{w:700});
    const ref=S.last==="copy"?"copy":S.last==="boards"?"boards":S.boards!=null?"boards":S.copy!=null?"copy":null;
    if(!ref)line1(ctx,W.noRef,a.x+12,a.y+72,a.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    else{const f=fade(ref);withA(ctx,f,()=>{line1(ctx,ref==="copy"?W.copySays:W.boardsSay,a.x+12,a.y+72,a.w-24,13,{w:700});
      lines(ctx,ref==="copy"?W.agrees:W.missing,a.x+12,a.y+96,a.w-24,{size:12.5,max:2,w:700,color:rgbaS(ref==="copy"?K.warm:K.bad,1)});});}};
  return{S,lay,draw,readouts:[[W.read.allowed,()=>S.valid==null?"–":RW.length+" / "+RW.length],[W.read.trueN,()=>S.asked==null?"–":trueN()+" / "+RW.length],
    [W.read.awards,()=>S.boards!=null?W.read.found:S.copy!=null?W.read.agreed:"–"]]};};

/* ---------- 4 · Late is wrong too: one list, three clocks ---------- */
// The night of 17 June: the student system's file is due at 2:00, the list is built at 3:00, and it goes to the printer at 17:00.
// The file may not come. A level for how old the list may be, set by one of its uses; what happens when it's too old (warn, stop the
// night's update, or hold the send); and whether every row says its age. Warned people can call, and the file can come at 11:40.
const at=hr=>{const H=Math.floor(hr),M=Math.round((hr-H)*60);return H+":"+String(M).padStart(2,"0");};
PLAY.clock=(Lb,api)=>{const W=Lb.w,S={miss:true,level:"week",mode:"warn",age:false,call:false,run:null,log:[],end:null};const DUR=4600;
  const r1=api.group(W.nightL);api.toggle(r1,W.missT,true,v=>{S.miss=v;S.run=null;api.say(v?W.msg.missOn:W.msg.missOff);api.kick(200);});
  api.toggle(r1,W.callT,false,v=>{S.call=v;S.run=null;api.say(v?W.msg.callOn:W.msg.callOff);api.kick(200);});
  const r2=api.group(W.levelL);api.seg(r2,W.levels,"week",k=>{S.level=k;S.run=null;api.say(W.msg["lv_"+k],k==="day"?"ok":null);if(k==="day")api.reach("strict");api.kick(200);},W.levelL);
  const r3=api.group(W.modeL);api.seg(r3,W.modes,"warn",k=>{S.mode=k;S.run=null;api.say(W.msg["md_"+k]);api.kick(200);},W.modeL);
  const r4=api.group();api.toggle(r4,W.ageT,false,v=>{S.age=v;S.run=null;api.say(v?W.msg.ageOn:W.msg.ageOff);api.kick(200);});
  // the night, worked out: its lines (time in hours, words, tone) and how it ends
  function night(){const L2=[],E=W.ev,old=S.miss,fails=old&&S.level==="day",warned=fails,comes=old&&warned&&S.call;let n=old?W.nOld:W.nAll,built=true,sent=null;
    L2.push([2,old?E.noFile:E.file,old?"no":"ok"]);
    if(fails&&S.mode==="stop"){L2.push([3,E.stopped,"warn"]);built=false;}else {L2.push([3,fill(E.built,{n}),"ok"]);if(S.age)L2.push([3,old?E.ageOld:E.ageNew,"ok"]);}
    if(warned)L2.push([3,E.warned,"warn"]);
    if(comes){L2.push([11.67,E.arrives,"ok"]);L2.push([12.17,fill(E.rebuilt,{n:W.nAll}),"ok"]);n=W.nAll;built=true;}
    const stillOld=old&&!comes;
    if(!built){L2.push([17,E.noList,"no"]);sent=null;}
    else if(stillOld&&S.level==="day"&&S.mode==="hold"){L2.push([17,E.held,"warn"]);sent="held";}
    else if(stillOld){L2.push([17,fill(E.sentMissing,{n,m:W.nAll-W.nOld}),"no"]);sent="missing";}
    else{L2.push([17,fill(E.sent,{n}),"ok"]);sent="ok";}
    return{lines:L2,sent,n,warned,comes};}
  const r5=api.group();api.btn(r5,W.runB,()=>{const N=night();S.run=performance.now();S.log=N.lines;S.end=N;api.kick(DUR+400);api.say(W.msg.running);
    const t0=S.run;setTimeout(()=>{if(S.run!==t0)return;const M=W.msg;let s;
      if(N.sent==="missing")s=S.level!=="day"?M.endPass:N.warned?M.endWarned:M.endPass;else if(N.sent==="held")s=M.endHeld;else if(N.sent==="ok")s=S.miss?(S.mode==="stop"?M.endStopped:M.endAll):M.endNormal;else s=M.endNoList;
      if(S.age&&N.sent!==null)s+=" "+M.ageSaid;api.say(s,N.sent==="ok"?"ok":N.sent==="held"?"ok":"no");
      if(S.miss&&N.sent==="missing"&&S.level!=="day")api.reach("late");if(S.age)api.reach("age");if(N.sent==="held")api.reach("send");if(S.miss&&N.sent==="ok"&&S.level==="day")api.reach("all");api.refresh();},RM()?0:DUR);},"go");
  const lay=(lw)=>{const m=12,o={lw,m};o.tl={x:m,y:12,w:lw-m*2,h:74};o.lg={x:m,y:o.tl.y+o.tl.h+10,w:lw-m*2,h:40+8*(lw<440?40:28)+8};o.h=o.lg.y+o.lg.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.steel);const tl=o.tl,x0=tl.x+16,x1=tl.x+tl.w-16,X=hr=>lp(x0,x1,hr/18),ly=tl.y+50;
    card(ctx,tl.x,tl.y,tl.w,tl.h,K.steel,W.dayName);
    ctx.strokeStyle=rgbaS(K.soft,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(x1,ly);ctx.stroke();
    W.hours.forEach((s,i)=>{const x=X(i*6),last=i===W.hours.length-1;ctx.fillStyle=rgbaS(K.soft,0.8);ctx.fillRect(x-1,ly-5,2,10);line1(ctx,s,!i?x-4:last?x-56:x-30,ly+20,60,12,{w:600,align:!i?"left":last?"right":"center",color:rgbaS(K.soft,1)});});
    const u=S.run==null?0:cl(since(now,S.run)/DUR,0,1),cur=u*17.4;
    if(S.run!=null){(S.log||[]).forEach(l=>{if(l[0]<=cur){const c=l[2]==="ok"?K.good:l[2]==="no"?K.bad:K.warm;ctx.fillStyle=rgbaS(c,1);ctx.beginPath();ctx.arc(X(l[0]),ly,5,0,TP);ctx.fill();}});
      ctx.fillStyle=rgbaS(K.ink,0.95);ctx.fillRect(X(Math.min(cur,17.2))-1.5,ly-14,3,28);}
    const g=o.lg;card(ctx,g.x,g.y,g.w,g.h,K.cream,W.logName);
    if(S.run==null)line1(ctx,W.notRun,g.x+12,g.y+48,g.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    else{let y=g.y+46;(S.log||[]).filter(l=>l[0]<=cur).forEach(l=>{const c=l[2]==="ok"?K.good:l[2]==="no"?K.bad:K.warm,tw_=46;
      line1(ctx,at(l[0]),g.x+12,y,tw_,12.5,{w:800,color:rgbaS(c,1)});y+=lines(ctx,l[1],g.x+12+tw_+6,y,g.w-24-tw_-6,{size:12.5,max:3,w:600})+8;});}
    if(S.run!=null&&u<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.printer,()=>!S.end||S.run==null?"–":S.end.sent==="held"?W.read.waits:S.end.sent?fill(W.read.n,{n:S.end.n}):W.read.none],
    [W.read.missing,()=>!S.end||S.run==null?"–":S.end.sent==="missing"?String(W.nAll-W.nOld):"0"],[W.read.age,()=>S.age?W.read.shown:W.read.hidden]]};};

const BUILD={play:labPlay};

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
// one list, and the four uses around it, each with its own level
VIS.uses=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.brass);const m=12,t=GO(S,now),lw=Math.min(260,o.lw-m*2);chip(ctx,(o.lw-lw)/2,12,lw,36,PK.uses.list,K.cream,{size:13.5,glow:t>0?14:6});
  const n=PK.uses.uses.length,w=(o.lw-m*2-(n-1)*6)/n;PK.uses.uses.forEach((s,i)=>{const x=m+i*(w+6);arrow(ctx,o.lw/2,50,x+w/2,96,t>0?K.gold:K.soft,0.8,{head:6,dash:t>=1?null:[4,4]});chip(ctx,x,100,w,40,s,K.brass,{size:12.5});});
  line1(ctx,PK.uses.line,m,166,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.uses.h=()=>182;
// a hundred records, looked at one by one
VIS.hundred=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.steel);const t=GO(S,now),cs=12,gx=(o.lw-10*cs)/2,gy=12;
  for(let i=0;i<100;i++){const bad=((i*7919)%997)%5===0&&i%3!==1;ctx.fillStyle=t>0&&bad?rgbaS(K.bad,0.4+0.5*t):"rgba(239,232,218,0.35)";rr(ctx,gx+(i%10)*cs+1,gy+Math.floor(i/10)*cs+1,cs-2,cs-2,2);ctx.fill();}
  line1(ctx,PK.hundred.line,12,gy+10*cs+26,o.lw-24,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.hundred.h=()=>12+120+40;
// the data, which can only say a value is allowed, and a reference outside it, which says what's true
VIS.truth=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.brass);const m=12,w=(o.lw-m*2-60)/2,t=GO(S,now);card(ctx,m,24,w,90,K.cream,PK.truth.a);card(ctx,o.lw-m-w,24,w,90,K.steel,PK.truth.b);
  lines(ctx,PK.truth.aSub,m+12,70,w-24,{size:12.5,max:2,w:600,color:rgbaS(K.soft,1)});lines(ctx,PK.truth.bSub,o.lw-m-w+12,70,w-24,{size:12.5,max:2,w:600,color:rgbaS(K.soft,1)});
  arrow(ctx,o.lw-m-w-6,69,m+w+6,69,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[4,4],lw:t>0?2.6:2});line1(ctx,PK.truth.mid,m,146,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.truth.h=()=>166;
// one list, three uses, each with its own clock
VIS.clock=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.steel);const m=12,t=GO(S,now),cols=[K.warm,K.brass,K.soft];PK.clock.rows.forEach((r,i)=>{const y=14+i*52;card(ctx,m,y,o.lw-m*2,44,cols[i],r[0],{glow:t>0&&i===0?12:4,right:130,size:13.5});
  pill(ctx,o.lw-m-8,y+10,r[1],cols[i],{align:"right",size:12});});};
VIS.clock.h=()=>14+3*52+4;
})();
