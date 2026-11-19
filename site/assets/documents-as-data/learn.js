/* Learning Data: Documents and closing remarks (its engine copied from Data that moves, the pilot). The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine:
   the series' labs page and scenarios page load a film's bundle (for its parts: glass, T, withA, rr, tw), the words (learn.en.js or
   learn.es.js, which set window.DM), and this file.
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
const L=window.DM,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-documents-as-data";
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
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab dm-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls dm-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"dm-goals","aria-label":U.goals}),end=h("div",{class:"dm-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"dm-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"dm-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm dm-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"dm-goalbox"},h("p",{class:"dm-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"dm-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}


/* ---------- 1 · Files as data and context: read, keep, or write ---------- */
// Three kinds of documents. October's 3,860 invoices, typed by hand or read by the platform's functions, then checked (fields read and
// lines that add up; Finance's rules on invoices sent twice), land in passed, to a person, or paid twice. Linh's two contract files,
// with or without metadata, answer when her contract ends. Claims arrive as spreadsheets, or written as data by the app.
PLAY.docs=(Lb,api)=>{const W=Lb.w,S={way:"hand",checks:false,rules:false,path:false,meta:false,claims:"sheet",read:null,res:null,asked:null,open:null};
  const r1=api.group(W.invL);api.seg(r1,W.ways,"hand",k=>{S.way=k;S.read=null;S.res=null;api.say(W.msg[k]);api.kick(300);},W.invL);
  const r2=api.group(W.checksL);
  api.toggle(r2,W.checksT,false,v=>{S.checks=v;api.say(v?W.msg.checksOn:W.msg.checksOff);});
  api.toggle(r2,W.rulesT,false,v=>{S.rules=v;api.say(v?W.msg.rulesOn:W.msg.rulesOff);});
  api.toggle(r2,W.pathT,false,v=>{S.path=v;api.say(v?W.msg.pathOn:W.msg.pathOff);});
  const r3=api.group();
  api.btn(r3,W.readB,()=>{S.read=performance.now();api.kick(1800);let res,msg,ok=false;
    if(S.way==="hand"){res={pass:3859,person:0,twice:1};msg=W.msg.readHand;}
    else if(!S.checks){res={pass:3860,person:0,twice:9};msg=W.msg.readNone;}
    else if(!S.rules){res={pass:3743,person:117,twice:9};msg=W.msg.readChecks;api.reach("checked");}
    else{res={pass:3734,person:126,twice:0};msg=W.msg.readAll;ok=true;api.reach("checked");api.reach("twice");}
    S.res=res;api.say(msg,ok?"ok":res.twice?"no":"warn");},"go");
  api.btn(r3,W.openB,()=>{S.open=performance.now();api.kick(900);const yes=S.path&&S.way==="fn";api.say(yes?W.msg.openYes:W.msg.openNo,yes?"ok":"no");if(yes)api.reach("cite");S.openOk=yes;});
  const r4=api.group(W.conL);api.toggle(r4,W.metaT,false,v=>{S.meta=v;api.say(v?W.msg.metaOn:W.msg.metaOff);api.kick(300);});
  api.btn(r4,W.askB,()=>{S.asked=performance.now();api.kick(1000);api.say(S.meta?W.msg.askMeta:W.msg.askNone,S.meta?"ok":"no");if(S.meta)api.reach("signed");S.askOk=S.meta;});
  const r5=api.group(W.claimsL);api.seg(r5,W.claims,"sheet",k=>{S.claims=k;api.kick(600);api.say(W.msg[k],k==="app"?"ok":null);if(k==="app")api.reach("written");},W.claimsL);
  const lay=(lw)=>{const m=12,o={lw,m};o.inv={y:12,h:204};o.con={y:o.inv.y+o.inv.h+10,h:118};o.cl={y:o.con.y+o.con.h+10,h:76};o.h=o.cl.y+o.cl.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.bad);const w=o.lw-o.m*2,I=o.inv;
    // invoices: files, how they're read, and where they land
    card(ctx,o.m,I.y,w,I.h,K.fin,W.invL);
    for(let i=0;i<5;i++){const x=o.m+14+i*9,y=I.y+38+i*4;ctx.save();ctx.fillStyle="rgba(239,232,218,0.92)";rr(ctx,x,y,34,44,4);ctx.fill();ctx.strokeStyle="rgba(40,40,48,0.5)";ctx.stroke();ctx.restore();}
    T(ctx,"PDF",o.m+14+4*9+17,I.y+38+16+30,{w:800,size:12,align:"center",color:"rgba(40,40,48,0.9)"});
    const fx=o.m+100,fw=w-100-10;chip(ctx,fx,I.y+42,fw,40,"",S.way==="fn"?K.plat:K.soft);{const nm=S.way==="fn"?W.fnName:W.handName,[ls,z]=fitL(ctx,nm,fw-12,12.5,2,700);lines(ctx,nm,fx+6,I.y+62-(ls.length-1)*z*0.61+z*0.36,fw-12,{size:12.5,max:2,align:"center"});}
    arrow(ctx,o.m+86,I.y+62,fx-4,I.y+62,K.soft,0.7,{head:5});
    const bw=(w-24-12)/3,keys=["pass","person","twice"],cols={pass:K.good,person:K.gold,twice:K.bad},t=S.read!=null?eo(since(now,S.read)/1200):0;
    keys.forEach((k,i)=>{const x=o.m+12+i*(bw+6),y=I.y+96;glass(ctx,x,y,bw,68,8,cols[k],{fill:"rgba(7,12,24,0.9)",glow:S.res&&S.res[k]&&k!=="pass"?10:3,ea:0.7});
      lines(ctx,W.bins[k],x+6,y+17,bw-12,{size:12.5,max:2,align:"center",color:rgbaS(cols[k],1)});
      if(S.res)T(ctx,String(Math.round(S.res[k]*t)).replace(/\B(?=(\d{3})+(?!\d))/g,L.lang==="es"?".":","),x+bw/2,y+58,{w:800,size:18,align:"center",color:rgbaS(K.ink,1)});});
    if(S.open!=null&&S.openOk){const a=eo(since(now,S.open)/500);withA(ctx,a,()=>pill(ctx,o.lw-o.m-12,I.y+172,"…/2026-10/INV-…pdf",K.good,{align:"right",size:12,max:w*0.55}));}
    // the contract: two files that look alike
    const C=o.con;card(ctx,o.m,C.y,w,C.h,K.hr,W.conL);const fw2=(w-24-10)/2;
    W.files.forEach((f,i)=>{const x=o.m+12+i*(fw2+10),y=C.y+32,hit=S.asked!=null&&(S.askOk?f.v==="signed":f.v==="offer");
      ctx.save();ctx.fillStyle="rgba(239,232,218,0.92)";rr(ctx,x,y,fw2,40,6);ctx.fill();ctx.restore();line1(ctx,S.meta?f.t:"T-26188.pdf",x+8,y+25,fw2-16,12.5,{w:700,color:"rgba(40,40,48,0.95)"});
      if(S.meta)pill(ctx,x,y+46,fill(W.metaTag,{v:f.v}),K.hr,{size:12,max:fw2});
      if(hit){mark(ctx,x+fw2-2,y+2,S.askOk?"ok":"no");T(ctx,f.end,x+fw2/2,C.y+C.h-10,{w:800,size:15,align:"center",color:rgbaS(S.askOk?K.good:K.bad,1)});}});
    // claims: a spreadsheet by email, or a row as it's made
    const Cl=o.cl,app=S.claims==="app";card(ctx,o.m,Cl.y,w,Cl.h,app?K.good:K.soft,W.claimsL,{glow:app?10:3});
    tile(ctx,o.m+12,Cl.y+36,w-24,26,app?W.row:W.sheet,app?K.good:K.soft,{size:12.5});};
  return{S,lay,draw,readouts:[[W.read.pass,()=>S.res?String(S.res.pass):"–"],[W.read.person,()=>S.res?String(S.res.person):"–"],[W.read.twice,()=>S.res?String(S.res.twice):"–"]]};};

/* ---------- 2 · Ideas that last: test what's new ---------- */
// The loop: investigate (from the newest feature, or a real need), adapt (build it fully, or two days small), implement (properly, or
// straight from the sandbox) and iterate (look each month, or not). Two ideas to try: reading invoices (it works, 188 of 200) and
// picking cost centres (not needed: the supplier list gives it). An idea goes round the stations its path reaches.
PLAY.loop=(Lb,api)=>{const W=Lb.w,S={start:"feature",trial:"build",proper:false,iter:false,run:null,path:null,time:"–",learned:null};
  const r1=api.group(W.startL);api.seg(r1,W.starts,"feature",k=>{S.start=k;api.say(W.msg[k]);},W.startL);
  const r2=api.group(W.trialL);api.seg(r2,W.trials,"build",k=>{S.trial=k;api.say(W.msg[k]);},W.trialL);
  const r3=api.group(W.implL);
  api.toggle(r3,W.properT,false,v=>{S.proper=v;api.say(v?W.msg.properOn:W.msg.properOff);});
  api.toggle(r3,W.iterT,false,v=>{S.iter=v;api.say(v?W.msg.iterOn:W.msg.iterOff);});
  const STEP=600;
  function go(idea){const now=performance.now(),A=idea==="A",bits=[];let path=[0],tone="no",time,learned=null;
    if(S.start==="feature"){bits.push(A?W.msg.featA:W.msg.featB);path=[0,2];time=W.time.feature;}
    else if(S.trial==="build"){bits.push(A?W.msg.buildA:W.msg.buildB);path=[0,2];time=A?W.time.buildA:W.time.buildB;}
    else if(!A){bits.push(W.msg.smallB);path=[0,1];time=W.time.small;learned="no";tone="ok";api.reach("no");}
    else{bits.push(W.msg.smallA);path=[0,1];time=W.time.small;learned="where";tone="ok";api.reach("match");
      if(S.proper){bits.push(W.msg.proper);path.push(2);time=W.time.smallProper;api.reach("proper");
        if(S.iter){bits.push(W.msg.iter);path.push(3);api.reach("iterate");}}else{bits.push(W.msg.noProper);path.push(2);tone="warn";}}
    S.run=now;S.path=path;S.time=time;S.learned=learned;S.ok=tone==="ok";api.kick(STEP*path.length+800);api.say(bits.join(" "),tone);api.refresh();}
  const r4=api.group();api.btn(r4,W.tryA,()=>go("A"),"go");api.btn(r4,W.tryB,()=>go("B"),"go");
  const lay=(lw)=>{const m=12,o={lw,m},cw=(lw-m*2-40)/2;o.cw=cw;o.st=[[m,14],[m+cw+40,14],[m+cw+40,104],[m,104]].map(([x,y])=>({x,y,w:cw,h:58}));o.bar={y:184,h:40};o.h=o.bar.y+o.bar.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.good);const run=S.run!=null,el=run?since(now,S.run):-1;
    o.st.forEach((s,i)=>{const on=run&&S.path.includes(i)&&el>=S.path.indexOf(i)*STEP,col=on?(S.ok?K.good:K.gold):K.plat;
      chip(ctx,s.x,s.y,s.w,s.h,W.stations[i],col,{size:14,glow:on?12:4,a:run&&!S.path.includes(i)?0.5:1});});
    // arrows round the loop
    const c=o.st;arrow(ctx,c[0].x+c[0].w+4,c[0].y+29,c[1].x-4,c[1].y+29,K.soft,0.7,{head:6});arrow(ctx,c[1].x+c[1].w/2,c[1].y+c[1].h+4,c[2].x+c[2].w/2,c[2].y-4,K.soft,0.7,{head:6});
    arrow(ctx,c[2].x-4,c[2].y+29,c[3].x+c[3].w+4,c[3].y+29,K.soft,0.7,{head:6});arrow(ctx,c[3].x+c[3].w/2,c[3].y-4,c[0].x+c[0].w/2,c[0].y+c[0].h+4,K.soft,0.7,{head:6});
    // a token going round the stations its path reaches
    if(run){const k=cl(el/STEP,0,S.path.length-1),i=Math.floor(k),f=ei(k-i),a=c[S.path[i]],b=c[S.path[Math.min(S.path.length-1,i+1)]];
      const x=lp(a.x+a.w/2,b.x+b.w/2,f),y=lp(a.y+a.h/2,b.y+b.h/2,f);ctx.save();ctx.fillStyle=rgbaS(K.gold,1);ctx.shadowColor=rgbaS(K.gold,0.8);ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y+22,6,0,TP);ctx.fill();ctx.restore();
      if(el<STEP*S.path.length)api.kick(80);}
    chip(ctx,o.m,o.bar.y,o.lw-o.m*2,o.bar.h,fill(W.spent,{t:S.time}),run?(S.ok?K.good:K.bad):K.soft,{size:13.5});};
  return{S,lay,draw,readouts:[[W.read.spent,()=>S.time],[W.read.learned,()=>S.learned==="where"?W.read.where:S.learned==="no"?W.read.no:S.run?W.read.nothing:"–"]]};};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)

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
// The situations from every film; each answer explains why and points back to its playground. Answers are kept by the scenario's
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
// three kinds of documents, and their three answers
VIS.docs=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.bad);const m=12,t=GO(S,now),P=PK.docs,w=(o.lw-m*2-16)/3,cols=[K.fin,K.hr,K.good];
  P.d.forEach((s,i)=>{const x=m+i*(w+8);card(ctx,x,14,w,104,cols[i],"",{glow:t>0?10:4});line1(ctx,s,x+6,48,w-12,13,{w:700,align:"center",color:rgbaS(K.soft,1)});
    chip(ctx,x+10,66,w-20,36,P.k[i],cols[i],{size:13.5});});};
VIS.docs.h=()=>132;
// the loop of four steps
VIS.loop=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.good);const m=12,t=GO(S,now),P=PK.loop,cw=(o.lw-m*2-40)/2,pos=[[m,14],[m+cw+40,14],[m+cw+40,84],[m,84]];
  pos.forEach(([x,y],i)=>chip(ctx,x,y,cw,46,P.st[i],t>i/4?K.gold:K.plat,{size:13.5,glow:t>i/4?12:4}));
  arrow(ctx,m+cw+4,37,m+cw+36,37,K.soft,0.7,{head:6});arrow(ctx,m+cw*1.5+40,62,m+cw*1.5+40,82,K.soft,0.7,{head:6});arrow(ctx,m+cw+36,107,m+cw+4,107,K.soft,0.7,{head:6});arrow(ctx,m+cw/2,82,m+cw/2,62,K.soft,0.7,{head:6});};
VIS.loop.h=()=>144;
})();
