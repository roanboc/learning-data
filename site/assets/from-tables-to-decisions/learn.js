/* Learning Data: From tables to decisions (its engine copied from Data that moves, the pilot). The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine:
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
const U=L.ui,P=app.dataset.store||"ld-from-tables-to-decisions";
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


/* ---------- 1 · Reports on demand: ask, or a dashboard? ---------- */
// Finance's five questions, each on the dashboard or asked when needed: three come back every pay day and are acted on, two are
// asked once. Below, the Genie Agent, with or without one measure, its owners' rules and tests, answers what it's asked.
PLAY.ask=(Lb,api)=>{const W=Lb.w,Q=W.qs,S={dash:new Set(Q.map(q=>q.k)),measure:false,rules:false,tests:false,ans:null,t:null};
  const r1=api.group(W.dashL);
  Q.forEach(q=>api.toggle(r1,q.t,true,v=>{if(v)S.dash.add(q.k);else S.dash.delete(q.k);S.t=performance.now();api.kick(600);
    const right=Q.every(x=>S.dash.has(x.k)===x.back),miss=Q.some(x=>x.back&&!S.dash.has(x.k));
    if(right){api.say(W.msg.dashOk,"ok");api.reach("dash");}else if(miss)api.say(W.msg.dashFew,"warn");else api.say(fill(W.msg.dashMany,{n:S.dash.size}),"warn");}));
  const r2=api.group(W.agentL);
  ["measure","rules","tests"].forEach(k=>api.toggle(r2,W.ctx[k],false,v=>{S[k]=v;api.say(v?W.msg[k+"On"]:W.msg[k+"Off"]);}));
  const r3=api.group();
  const answer=(text,ok,say,goal)=>{S.ans={text,ok,t:performance.now()};api.kick(900);api.say(say,ok?"ok":"no");if(ok&&goal)api.reach(goal);};
  api.btn(r3,W.askB,()=>{S.q=W.asks;answer(S.measure?W.ansGood:W.ansGuess,S.measure,S.measure?W.msg.askGood:W.msg.askGuess,"right");},"go");
  api.btn(r3,W.payB,()=>{S.q=W.payB;answer(S.rules?W.ansPriv:W.ansLeak,S.rules,S.rules?W.msg.payPriv:W.msg.payLeak,"private");});
  api.btn(r3,W.changeB,()=>{S.q=W.changeB;answer(S.tests?W.ansTest:W.ansBroke,S.tests,S.tests?W.msg.testOk:W.msg.testNo,"tested");});
  const lay=(lw)=>{const m=12,o={lw,m};o.board={y:12,h:34+Q.length*34+6};o.ans={y:o.board.y+o.board.h+12,h:132};o.h=o.ans.y+o.ans.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const B=o.board,w=o.lw-o.m*2,tagW=Math.min(110,w*0.3);
    card(ctx,o.m,B.y,w,B.h,K.fin,W.board);
    Q.forEach((q,i)=>{const y=B.y+34+i*34,on=S.dash.has(q.k),good=on===q.back,col=on?K.fin:K.plat;
      chip(ctx,o.m+10,y,w-20-tagW-8,28,q.t,col,{size:12.5,tint:0.06,mark:S.t!=null?(good?"ok":"no"):null});
      pill(ctx,o.lw-o.m-10,y+2,on?W.onDash:W.onAsk,on?K.fin:K.plat,{align:"right",size:12,max:tagW});});
    const A=o.ans;card(ctx,o.m,A.y,w,A.h,K.plat,W.genie);
    if(S.ans){const t=cl(since(now,S.ans.t)/500,0,1);withA(ctx,eo(t),()=>{lines(ctx,S.q||W.asks,o.m+12,A.y+44,w-24,{size:12.5,max:2,w:600,color:rgbaS(K.soft,1)});
      chip(ctx,o.m+10,A.y+74,w-20,48,"",S.ans.ok?K.good:K.bad,{tint:0.1,glow:10});lines(ctx,S.ans.text,o.m+20,A.y+93,w-40,{size:12.5,max:2,w:700});});}
    else lines(ctx,W.asks,o.m+12,A.y+44,w-24,{size:12.5,max:2,w:600,color:rgbaS(K.soft,0.8)});};
  return{S,lay,draw,readouts:[[W.read.dash,()=>S.dash.size+" / "+Q.length],[W.read.ans,()=>S.ans==null?"–":S.ans.ok?"✓":"✗"]]};};

/* ---------- 2 · Define it once: three numbers, one name ---------- */
// Three tools answer Health's question: the faculty's spreadsheet (hours contracted, 2.46), payroll's report (pay paid, 1.88) and
// Finance's report (claims plus on-costs, 2.21). Where the measures are defined, and what they're called, decide what each tool says;
// the budget is set on whatever the faculty reads first; and an open format lets a new tool read the measures.
PLAY.measures=(Lb,api)=>{const W=Lb.w,S={home:"tools",names:"one",ossie:false,asked:null,budget:null,newT:null,newOk:false};
  const r1=api.group(W.homeL);api.seg(r1,W.homes,"tools",k=>{S.home=k;S.asked=null;S.budget=null;api.say(W.msg[k]);api.kick(400);},W.homeL);
  const r2=api.group(W.namesL);api.seg(r2,W.namesO,"one",k=>{S.names=k;S.asked=null;S.budget=null;api.say(W.msg[k]);api.kick(400);},W.namesL);
  const r3=api.group();api.toggle(r3,W.ossieT,false,v=>{S.ossie=v;api.say(v?W.msg.ossieOn:W.msg.ossieOff);});
  const same=()=>S.home==="view"&&S.names==="three";
  const r4=api.group();
  api.btn(r4,W.askB,()=>{S.asked=performance.now();api.kick(1200);
    if(same()){api.say(W.msg.askSame,"ok");api.reach("same");api.reach("named");}
    else if(S.names==="three"){api.say(W.msg.askNamed,"ok");api.reach("named");}
    else api.say(S.home==="view"?W.msg.askViewOne:W.msg.askOneTools,"no");},"go");
  api.btn(r4,W.budgetB,()=>{S.budget=performance.now();S.budgetOk=S.names==="three";api.kick(900);api.say(S.budgetOk?W.msg.budgetOk:W.msg.budgetShort,S.budgetOk?"ok":"no");if(S.budgetOk)api.reach("budget");});
  api.btn(r4,W.newB,()=>{S.newT=performance.now();S.newOk=S.home==="view"&&S.ossie;api.kick(1200);
    api.say(S.newOk?W.msg.newOpen:S.home==="tools"?W.msg.newLocked:W.msg.newType,S.newOk?"ok":"no");if(S.newOk)api.reach("open");});
  const lay=(lw)=>{const m=12,o={lw,m};o.q={y:12,h:36};o.mid={y:o.q.y+o.q.h+12,h:104};o.tools={y:o.mid.y+o.mid.h+12};const n=W.tools.length;o.th=(n)*72;o.nt={y:o.tools.y+o.th+4,h:58};o.h=o.nt.y+o.nt.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.cold);const w=o.lw-o.m*2,asked=S.asked!=null,a=asked?eo(since(now,S.asked)/600):0;
    chip(ctx,o.m,o.q.y,w,o.q.h,W.question,K.gold,{size:13.5,glow:8});
    // the middle: nothing shared, or one home with its measures
    const M=o.mid;if(S.home==="view"){card(ctx,o.m,M.y,w,M.h,K.plat,W.view,{glow:10});
      const ms=S.names==="three"?W.measures:[W.measures[2]],mw=(w-24-(ms.length-1)*6)/ms.length;
      ms.forEach((x,i)=>{chip(ctx,o.m+12+i*(mw+6),M.y+32,mw,62,"",K.gold,{tint:0.1});lines(ctx,S.names==="three"?x.t:W.oneName,o.m+18+i*(mw+6),M.y+50,mw-12,{size:12,max:3,align:"center"});});}
    else{card(ctx,o.m,M.y,w,M.h,K.soft,"",{dash:true,glow:0});lines(ctx,W.msg.tools,o.m+14,M.y+40,w-28,{size:12.5,max:3,w:600,color:rgbaS(K.soft,1)});}
    // the tools, each with the number it gives and the name it gives it
    W.tools.forEach((t,i)=>{const y=o.tools.y+i*72,shows=same()?W.measures:[W.measures[t.m]];
      card(ctx,o.m,y,w,64,K.cold,t.t,{glow:5,right:same()?0:w*0.42,size:13.5});
      if(!same()){const nm=S.names==="three"?W.measures[t.m].t:W.oneName,clash=S.names==="one";
        line1(ctx,nm,o.m+12,y+44,w*0.55,12.5,{w:600,color:rgbaS(clash&&asked?K.bad:K.soft,1)});
        if(asked)withA(ctx,a,()=>T(ctx,fill(W.unit,{v:t.v}),o.lw-o.m-14,y+42,{w:800,size:17,align:"right",color:rgbaS(clash?K.bad:K.ink,1)}));}
      else{const cw=(w-24-12)/3;shows.forEach((x,j)=>{chip(ctx,o.m+12+j*(cw+6),y+30,cw,26,asked?fill(W.unit,{v:x.v}):"–",j===2?K.gold:K.plat,{size:12.5,a:asked?1:0.6});});}});
    // a new tool, once it arrives
    if(S.newT!=null){const t=eo(since(now,S.newT)/600);withA(ctx,t,()=>{card(ctx,o.m,o.nt.y,w,o.nt.h,S.newOk?K.good:K.bad,W.newTool,{glow:10});
      line1(ctx,S.newOk?W.measures.map(x=>x.t.split(" ").pop()).join(" · "):"…",o.m+12,o.nt.y+44,w-24,12.5,{w:600,color:rgbaS(S.newOk?K.good:K.soft,1)});});}};
  return{S,lay,draw,readouts:[[W.read.numbers,()=>S.asked==null?"–":S.names==="one"?"3":"0"],[W.read.budget,()=>S.budget==null?"–":S.budgetOk?W.read.ok:W.read.short],
    [W.read.typed,()=>S.newT==null?"–":S.newOk?"0":"3"]]};};

/* ---------- 3 · More readers than people: every reader, the same number ---------- */
// One measure, defined once, and four readers on pay day, each through the door picked for it: a report through the mirror (where the
// measure doesn't appear) or the connector; an app that reads as itself or as the person; an agent with Rohan's sign-in or a name of
// its own; partners outside, by unit or by faculty. Each reader's row says what it got, and what else it could see.
PLAY.readers=(Lb,api)=>{const W=Lb.w,RW=W.rows,S={pick:{},read:null,got:null};RW.forEach(r=>S.pick[r.k]=r.o[0][0]);
  RW.forEach(r=>{const g=api.group(r.t);api.seg(g,r.o,r.o[0][0],k=>{S.pick[r.k]=k;S.read=null;api.say(fill(W.msg.set,{r:r.t,c:r.o.find(x=>x[0]===k)[1].toLowerCase()}));api.kick(300);},r.t);});
  const STEP=500,bad={mirror:1,self:1,borrow:1,unit:1};
  const r9=api.group();api.btn(r9,W.readB,()=>{const now=performance.now();S.read=now;S.got=Object.assign({},S.pick);api.kick(STEP*5+600);api.say(W.msg.read);
    setTimeout(()=>{if(S.read!==now)return;const g=S.got;api.say(RW.map(r=>W.msg[r.k][g[r.k]]).join(" "),RW.some(r=>bad[g[r.k]])?"warn":"ok");
      if(g.bi==="conn")api.reach("same");if(g.app==="person")api.reach("asYou");if(g.agent==="own")api.reach("agent");if(g.share==="faculty")api.reach("least");api.refresh();},RM()?0:STEP*4+200);},"go");
  const lay=(lw)=>{const m=12,o={lw,m};o.top={y:12,h:40};o.r0=o.top.y+o.top.h+14;o.rh=78;o.h=o.r0+RW.length*(o.rh+8)+6;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.good);const w=o.lw-o.m*2,run=S.read!=null,el=run?since(now,S.read):-1,g=run?S.got:S.pick;
    chip(ctx,o.m,o.top.y,w,o.top.h,W.measure,K.gold,{size:13.5,glow:12});
    RW.forEach((r,i)=>{const y=o.r0+i*(o.rh+8),k=g[r.k],door=r.o.find(x=>x[0]===k)[1],lit=run&&el>=i*STEP+300,res=W.res[k],isBad=!!bad[k];
      const col=lit?(isBad?K.bad:K.good):K.plat;
      card(ctx,o.m,y,w,o.rh,col,r.t,{glow:lit?10:4,size:13.5});
      line1(ctx,door,o.m+12,y+42,w*0.6,12.5,{w:600,color:rgbaS(K.soft,1)});
      if(lit){const num=/^\d/.test(res[0])?fill(W.unit,{v:res[0]}):res[0];T(ctx,num,o.lw-o.m-12,y+44,{w:800,size:16,align:"right",color:rgbaS(res[0]==="1.56"?K.bad:K.ink,1)});
        line1(ctx,res[1],o.m+12,y+64,w-24,12.5,{w:700,color:rgbaS(isBad?K.bad:K.good,1)});}});
    if(run&&el<STEP*5)api.kick(80);};
  return{S,lay,draw,readouts:[[W.read.numbers,()=>S.read==null?"–":S.got.bi==="mirror"?"2":"1"],[W.read.tooMuch,()=>S.read==null?"–":String(RW.filter(r=>bad[S.got[r.k]]).length)]]};};

const BUILD={play:labPlay};

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
// Finance's questions, on a dashboard or asked when needed
VIS.ask=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const m=12,t=GO(S,now),w=(o.lw-m*2-10)/2,P=PK.ask;
  card(ctx,m,12,w,150,K.fin,P.dash,{glow:t>0?10:4,size:13});card(ctx,m+w+10,12,w,150,K.plat,P.ask,{glow:4,size:13});
  P.rows.forEach((s,i)=>{const d=i<3,x=d?m+8:m+w+18,y=40+(d?i:i-3)*38;chip(ctx,x,y,w-16,30,s,d?K.fin:K.plat,{size:12});});};
VIS.ask.h=()=>174;
// three tools, three numbers, one name
VIS.measures=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.cold);const m=12,t=GO(S,now),P=PK.measures,w=(o.lw-m*2-16)/3;
  line1(ctx,P.name,m,26,o.lw-m*2,14,{w:800,align:"center",color:rgbaS(K.gold,1)});
  P.tools.forEach((s,i)=>{const x=m+i*(w+8);card(ctx,x,42,w,92,K.cold,"",{glow:4});line1(ctx,s,x+6,66,w-12,12.5,{w:700,align:"center",color:rgbaS(K.soft,1)});
    T(ctx,P.vals[i],x+w/2,110,{w:800,size:20,align:"center",color:rgbaS(t>0?K.gold:K.ink,1)});});};
VIS.measures.h=()=>148;
// one measure, and its four readers
VIS.readers=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.good);const m=12,t=GO(S,now),P=PK.readers,n=P.rs.length,w=(o.lw-m*2-(n-1)*8)/n,cw=Math.min(300,o.lw-m*2);
  chip(ctx,(o.lw-cw)/2,14,cw,38,P.m,K.gold,{size:13.5,glow:t>0?14:6});
  P.rs.forEach((s,i)=>{const x=m+i*(w+8);arrow(ctx,o.lw/2,54,x+w/2,100,t>0?K.gold:K.soft,0.8,{head:6,dash:t>=1?null:[4,4]});chip(ctx,x,104,w,40,s,K.good,{size:12.5});});};
VIS.readers.h=()=>158;
})();
