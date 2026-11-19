/* Learning Data: Model the business. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine,
   copied from From words to data's (site/assets/from-words-to-data/learn.js, itself Data that moves'): the series' labs page and
   scenarios page load a film's bundle (for its parts: glass, T, withA, rr, tw), the words (learn.en.js or learn.es.js, which set
   window.WD), and this file.
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
const U=L.ui,P=app.dataset.store||"ld-model-the-business";
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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/model-the-business.js)
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
  function loop(){st.raf=-1;paint();st.raf=performance.now()<st.until?requestAnimationFrame(loop):0;}  // a kick while it paints asks no second frame
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

/* ---------- 1 · The map behind the sketch: place the sketch ---------- */
// The intro's sketch: five boxes, each with four dots, one for each of the map's layers (what it's for, who answers for it, where
// it's written, what it means), lit as the visitor turns each layer on. Below, where a count comes from: the dashboard, the
// platform's copy, and the student system, the record. Ask whose record to check; fix a wrong enrolment in the copy or in the
// record, and watch tonight's load copy the record over the copy; look the sketch's words up; let Planning keep its own list.
const LAY4=["for","owner","home","means"],LC={"for":[236,206,140],owner:[248,160,130],home:[130,224,160],means:[196,168,255]};
PLAY.place=(Lb,api)=>{const W=Lb.w,M=W.msg,S={on:new Set(),lt:{},at:"copy",fix:null,recFixed:false,ask:null,look:null,cr:"one",crT:-1e5};
  const LOAD=1500,STEP=450;  // a fix lands at once; tonight's load reaches the copy LOAD ms later, and the dashboard STEP after that
  const r1=api.group(W.layersL);W.layers.forEach(([k,l])=>api.toggle(r1,l,false,v=>{if(v)S.on.add(k);else S.on.delete(k);S.lt[k]=performance.now();S.ask=null;
    if(k==="means"&&!v)S.look=null;api.kick(700);api.say(v?M.on[k]:fill(M.off,{l}));}));
  const r2=api.group(W.askL);
  api.btn(r2,W.askB,()=>{const o=S.on.has("owner"),hm=S.on.has("home"),res=o&&hm?"ok":hm?"noOwner":o?"noHome":"none";S.ask={t0:performance.now(),res};api.kick(1500);
    api.say(M.ask[res],res==="ok"?"ok":null);if(res==="ok")api.reach("whose");});
  api.btn(r2,W.lookB,()=>{const f=S.on.has("means");S.look={t0:performance.now(),found:f};api.kick(900);api.say(f?M.look.found:M.look.off,f?"ok":null);if(f)api.reach("words");});
  const r3=api.group(W.fixL);api.seg(r3,W.fixes,S.at,k=>{S.at=k;},W.fixAtL);
  api.btn(r3,W.fixB,()=>{const n0=W.n0,n1=W.n1;
    if(S.recFixed){api.say(fill(M.fix.done,{n1}));return;}
    if(S.at==="record"&&!S.on.has("home")){api.say(M.fix.noHome);return;}
    S.fix={t0:performance.now(),at:S.at};api.kick(LOAD+STEP+900);
    if(S.at==="copy"){api.say(fill(M.fix.copy,{n0,n1}));api.reach("undone");}
    else{S.recFixed=true;api.say(fill(M.fix.record,{n0,n1}),"ok");api.reach("source");}});
  const r4=api.group(W.crossL);api.seg(r4,W.creators,S.cr,k=>{S.cr=k;S.crT=performance.now();api.kick(900);
    api.say(fill(M.cross[k],{p:W.plan,n:S.recFixed?W.n1:W.n0}),k==="one"?"ok":null);if(k==="two")api.reach("two");},W.crossL);
  // the counts at a moment: the record's (R), the copy's (C) and the dashboard's (D), and where tonight's load is (u: ms since the fix)
  const vals=now=>{const R=S.recFixed?W.n1:W.n0,f=S.fix;let C=R,D=R,u=-1;if(f){u=since(now,f.t0);
      if(f.at==="copy"){if(u<LOAD){C=W.n1;D=W.n1;}else if(u<LOAD+STEP)D=W.n1;}
      else{if(u<LOAD){C=W.n0;D=W.n0;}else if(u<LOAD+STEP)D=W.n0;}}
    return{R,C,D,u};};
  const lay=(lw,ctx)=>{const m=12,W2=lw-m*2,o={lw,m,W2};
    o.legY=12;o.leg=flow(ctx,W.legend,W2,12.5,12,20);let y=o.legY+o.leg.h+18;
    // the sketch: Student, Enrolment and Class above; Course under Student, and Term under Class; their dots above and below
    const g=10,bw=Math.min(132,(W2-g*2)/3),bh=30,x0=m+(W2-(bw*3+g*2))/2,top=y+8,bot=top+bh+40;o.bw=bw;o.bh=bh;
    o.box={student:{x:x0,y:top},enrol:{x:x0+bw+g,y:top},cls:{x:x0+2*(bw+g),y:top},course:{x:x0,y:bot},term:{x:x0+2*(bw+g),y:bot}};
    y=bot+bh+20;
    // what the glossary finds, as pills laid out for their words; the room is kept, so nothing moves when they come
    o.foundY=y;o.found=flow(ctx,[W.found.cls,W.found.term],W2,12.5,8,24);y=o.foundY+o.found.h+16;
    // where a count comes from: the dashboard, the platform's copy, the student system; tonight's load runs up between them
    const rh=46,rg=28;o.rh=rh;o.rows=[0,1,2].map(i=>({x:m,y:y+i*(rh+rg),w:W2,h:rh}));y+=3*rh+2*rg+16;
    // who creates enrolments
    o.cr={x:m,y,w:W2,h:84};o.h=y+84+12;return o;};
  const dot=(ctx,x,y,k,a,s)=>{ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgbaS(LC[k],1);ctx.shadowColor=rgbaS(LC[k],0.8);ctx.shadowBlur=6*a;ctx.beginPath();ctx.arc(x,y,4.6*s,0,TP);ctx.fill();ctx.restore();};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const m=o.m,V=vals(now),on=k=>S.on.has(k),la=k=>on(k)?eo(since(now,S.lt[k])/420):0;
    // the legend
    W.legend.forEach((s,i)=>{const p=o.leg.pos[i],k=LAY4[i],x=m+p.x,y=o.legY+p.y,a=la(k);
      ctx.save();ctx.strokeStyle=rgbaS(LC[k],0.55);ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x+7,y+10,4.6,0,TP);ctx.stroke();ctx.restore();if(a>0)dot(ctx,x+7,y+10,k,a,1);
      T(ctx,s,x+16,y+14.5,{w:700,size:12.5,color:rgbaS(mixC(K.soft,LC[k],a),0.75+0.25*a)});});
    // the sketch's lines, then its boxes and their dots
    const B=o.box,bw=o.bw,bh=o.bh,cx=b=>b.x+bw/2;
    ctx.save();ctx.strokeStyle=rgbaS(K.plat,0.5);ctx.lineWidth=1.6;ctx.beginPath();
    ctx.moveTo(B.student.x+bw,B.student.y+bh/2);ctx.lineTo(B.enrol.x,B.enrol.y+bh/2);ctx.moveTo(B.enrol.x+bw,B.enrol.y+bh/2);ctx.lineTo(B.cls.x,B.cls.y+bh/2);
    ctx.moveTo(cx(B.student),B.student.y+bh);ctx.lineTo(cx(B.course),B.course.y);ctx.moveTo(cx(B.cls),B.cls.y+bh);ctx.lineTo(cx(B.term),B.term.y);ctx.stroke();ctx.restore();
    const fa=S.look&&S.look.found?eo(since(now,S.look.t0)/520):0;
    ["student","enrol","cls","course","term"].forEach(id=>{const b=B[id],odd=(id==="cls"||id==="term"),f=odd?fa:0,below=id==="course"||id==="term";
      chip(ctx,b.x,b.y,bw,bh,W.boxes[id],f>0?mixC(K.plat,K.warm,f):K.plat,{size:13,glow:f>0?6+8*f:6,strike:f>0.5});
      LAY4.forEach((k,i)=>{const dx=cx(b)+(i-1.5)*12,dy=below?b.y+bh+10:b.y-10;
        ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.4);ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(dx,dy,4.6,0,TP);ctx.stroke();ctx.restore();
        const a=la(k);if(a<=0)return;
        if(k==="means"&&f>0){ctx.save();ctx.globalAlpha*=f;ctx.fillStyle=rgbaS(K.warm,1);ctx.beginPath();ctx.arc(dx,dy,6,0,TP);ctx.fill();ctx.restore();
          T(ctx,"?",dx,dy+3.6,{w:800,size:10,align:"center",color:"rgba(20,14,4,0.95)"});if(f<1)dot(ctx,dx,dy,k,a*(1-f),1);}
        else dot(ctx,dx,dy,k,a,0.6+0.4*a);});});
    // what the glossary found
    if(fa>0)withA(ctx,fa,()=>[W.found.cls,W.found.term].forEach((s,i)=>{const p=o.found.pos[i];pill(ctx,m+p.x,o.foundY+p.y,s,K.warm);}));
    // where a count comes from
    const hm=on("home"),ow=on("owner"),R=o.rows;
    const rowsT=[[W.rows.dash,W.rows.dashSub,V.D,K.gold],[W.rows.copy,W.rows.copySub,V.C,K.plat],
      [hm?W.rows.rec:W.rows.recOff,hm?(ow?W.rows.recSub:W.rows.recSubOff):W.rows.recOffSub,hm?V.R:null,hm?LC.home:K.soft]];
    // tonight's load: up from the record to the copy, then on to the dashboard
    [[2,1],[1,0]].forEach(([a,b],j)=>{const xa=m+o.W2*0.5,y0=R[a].y-3,y1=R[b].y+R[b].h+3;let lit=0;
      if(V.u>=0){const s0=LOAD-STEP+j*STEP,u=V.u;lit=u<s0?0:u<s0+STEP?(u-s0)/STEP:Math.max(0,1-(u-s0-STEP)/900);}
      arrow(ctx,xa,y0,xa,y1,lit>0?mixC(K.soft,K.gold,lit):K.soft,0.55+0.45*lit,{dash:lit>0?null:[4,4],head:7,lw:lit>0?2.4:1.6});
      if(j===0)T(ctx,W.rows.load,xa+12,(y0+y1)/2+4.5,{w:600,size:12,color:rgbaS(lit>0?K.gold:K.soft,lit>0?1:0.75)});
      if(lit>0&&lit<1){const py=lp(y0,y1,lit);ctx.save();ctx.fillStyle=rgbaS(K.gold,1);ctx.shadowColor=rgbaS(K.gold,0.9);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(xa,py,4.5,0,TP);ctx.fill();ctx.restore();}});
    rowsT.forEach(([t,sub,n,col],i)=>{const r=R[i],isRec=i===2;
      card(ctx,r.x,r.y,r.w,r.h,col,t,{glow:isRec&&hm?10:4,size:13.5,right:44,dash:isRec&&!hm});
      line1(ctx,sub,r.x+12,r.y+37,r.w-24-44,12,{w:600,color:rgbaS(isRec&&hm&&!ow?K.warm:K.soft,1)});
      T(ctx,n==null?"?":String(n),r.x+r.w-12,r.y+31,{w:800,size:20,align:"right",color:rgbaS(n===W.n1?K.good:n==null?K.soft:K.ink,1)});});
    // the question, asked down the path: lit row by row, and stopped where the map ends
    if(S.ask){const u=since(now,S.ask.t0),res=S.ask.res,reach=res==="ok"||res==="noOwner"?3:2;
      for(let i=0;i<reach;i++){const a=cl((u-i*280)/320,0,1);if(a<=0)continue;const r=R[i],c=res==="ok"||i<2?K.gold:K.warm;
        ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgbaS(c,0.95);ctx.lineWidth=2.2;ctx.shadowColor=rgbaS(c,0.7);ctx.shadowBlur=12;rr(ctx,r.x-2,r.y-2,r.w+4,r.h+4,13);ctx.stroke();ctx.restore();}
      const end=u>reach*280+200;if(end){const r=R[reach-1];mark(ctx,r.x+r.w-2,r.y+2,res==="ok"?"ok":"bad");}}
    // who creates enrolments
    const c=o.cr,two=S.cr==="two",ca=eo(since(now,S.crT)/500),col=two?mixC(K.arch,K.bad,ca):mixC(K.bad,K.arch,S.crT>0?ca:1);
    card(ctx,c.x,c.y,c.w,c.h,col,W.crossL,{glow:two?12:5,size:13.5});
    lines(ctx,two?fill(W.cross.two,{n:V.R,p:W.plan}):W.cross.one,c.x+12,c.y+42,c.w-24,{size:12.5,max:3,w:600,color:rgbaS(two?K.ink:K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.rec,()=>String(S.recFixed?W.n1:W.n0)],[W.read.layers,()=>fill(W.read.of,{n:S.on.size})]]};};

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
// the sketch's five boxes, each with its four places
VIS.place=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const m=12,t=GO(S,now),P=PK.place,W2=o.lw-m*2,g=10,bw=Math.min(132,(W2-g*2)/3),bh=30,x0=m+(W2-(bw*3+g*2))/2,top=24,bot=top+bh+34;
  const B=[[x0,top],[x0+bw+g,top],[x0+2*(bw+g),top],[x0,bot],[x0+2*(bw+g),bot]];
  ctx.save();ctx.strokeStyle=rgbaS(K.plat,0.5);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(B[0][0]+bw,top+bh/2);ctx.lineTo(B[2][0],top+bh/2);
  ctx.moveTo(B[0][0]+bw/2,top+bh);ctx.lineTo(B[3][0]+bw/2,bot);ctx.moveTo(B[2][0]+bw/2,top+bh);ctx.lineTo(B[4][0]+bw/2,bot);ctx.stroke();ctx.restore();
  P.boxes.forEach((s,i)=>{const[x,y]=B[i],below=i>2;chip(ctx,x,y,bw,bh,s,K.plat,{size:13});
    LAY4.forEach((k,j)=>{const dx=x+bw/2+(j-1.5)*12,dy=below?y+bh+10:y-10;ctx.save();ctx.fillStyle=rgbaS(LC[k],0.9);ctx.beginPath();ctx.arc(dx,dy,4.4,0,TP);ctx.fill();ctx.restore();});});
  line1(ctx,P.ask,m,bot+bh+44,W2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.place.h=()=>24+30+34+30+56;
// where a count comes from: the dashboard, the platform's copy, the record
VIS.rec=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.plat);const m=12,t=GO(S,now),P=PK.rec,W2=o.lw-m*2,rh=34,rg=12;
  P.rows.forEach(([s,n],i)=>{const y=12+i*(rh+rg),rec=i===2,col=rec?(t>0?K.gold:LC.home):i===1?K.plat:K.soft;
    chip(ctx,m,y,W2,rh,"",col,{glow:rec&&t>0?14:5,tint:0.08});line1(ctx,s,m+12,y+rh/2+4.5,W2-24-36,12.5,{w:700});
    T(ctx,n,m+W2-12,y+rh/2+5.5,{w:800,size:15,align:"right",color:rgbaS(K.ink,1)});
    if(i<2)arrow(ctx,m+W2*0.5,y+rh+rg-1,m+W2*0.5,y+rh+1,K.soft,0.6,{head:6,dash:[3,3],lw:1.4});});
  line1(ctx,P.ask,m,12+3*(rh+rg)+16,W2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.rec.h=()=>12+3*(34+12)+28;
})();
