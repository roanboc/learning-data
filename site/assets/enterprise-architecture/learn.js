/* Learning Data: The map before the data. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from
   one engine, copied from Data that moves' (site/assets/data-that-moves/learn.js): the series' labs page and scenarios page load a
   film's bundle (for its parts: glass, T, withA, rr, tw), the words (learn.en.js or learn.es.js, which set window.EA), and this file.
   Every lab is a playground (kind "play"), one for each film, as the author set on 18 November 2026: the visitor switches, picks and
   presses, and watches what happens; each playground has four experiments (w.goals), each ticked when the visitor makes it happen,
   and its end once all are ticked. Each playground's own rules are in PLAY below, its words in the pack.
   The scenarios are the series' evaluation, every one a choice, its options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its words stay
   big enough to read on a phone. Things move and settle, or jump to where they end when the visitor asks for reduced motion, and every
   change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films), both from
   site-tools/build_series.py. Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments)
   and "quiz" (answers by scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.EA,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-enterprise-architecture";
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
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).length||11,filmN=n=>fill(U.filmN,{n,of:NF});

/* ---------- drawing, with the films' parts ---------- */
const DRAW=typeof glass==="function"&&typeof T==="function"&&typeof withA==="function"&&typeof rr==="function"&&typeof tw==="function";
const TP=Math.PI*2,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lp=(a,b,t)=>a+(b-a)*t;
const eo=u=>1-Math.pow(1-cl(u,0,1),3),ei=u=>{u=cl(u,0,1);return u<0.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;};
const rgb=s=>{const n=parseInt(String(s).slice(1),16);return[n>>16&255,n>>8&255,n&255];};
// the films' colours: ink, soft ink, right, wrong, gold, the six layers of the map (motivation, strategy, business, information,
// application, technology), the network's blue and retail's pink, and paper for a draft
const K={ink:[236,243,255],soft:[160,178,205],good:[120,240,170],bad:[255,112,100],gold:[255,209,102],
  mot:[200,186,255],str:[245,206,140],bus:[255,234,130],inf:[255,186,150],app:[140,214,255],tec:[160,224,140],
  net:[120,200,255],ret:[255,150,200],paper:[239,232,218]};
K.lay=[K.mot,K.str,K.bus,K.inf,K.app,K.tec];
const rgbaS=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")",mixC=(a,b,t)=>[lp(a[0],b[0],t),lp(a[1],b[1],t),lp(a[2],b[2],t)];
const TW=(ctx,s,z,wt)=>tw(ctx,String(s),z,wt||700);
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/enterprise-architecture.js)
const MISS=window.EA_MISS=new Set();
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
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab ea-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls ea-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"ea-goals","aria-label":U.goals}),end=h("div",{class:"ea-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"ea-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"ea-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm ea-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"ea-goalbox"},h("p",{class:"ea-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"ea-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}


/* ---------- moving things, and words on two lines ---------- */
// glide(G, key, x, y, now): where a thing is on its way to (x, y), from wherever it was when its target last changed; the third value
// says it's still moving, so the picture keeps painting
function glide(G,k,x,y,now,ms){ms=ms||600;let g=G[k];if(!g)g=G[k]={x,y,fx:x,fy:y,tx:x,ty:y,t:0};
  if(g.tx!==x||g.ty!==y){g.fx=g.x;g.fy=g.y;g.tx=x;g.ty=y;g.t=now;}const u=RM()?1:cl((now-g.t)/ms,0,1),e=ei(u);g.x=lp(g.fx,g.tx,e);g.y=lp(g.fy,g.ty,e);return[g.x,g.y,u<1];}
// a chip whose label may take two lines, centred
function chip2(ctx,x,y,w,hh,label,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,hh,o.r==null?8:o.r,col,{glow:o.glow==null?6:o.glow,ea:0.85,fill:"rgba(7,12,24,0.94)"});
  ctx.fillStyle=rgbaS(col,o.tint==null?0.14:o.tint);rr(ctx,x,y,w,hh,o.r==null?8:o.r);ctx.fill();
  if(o.dash){ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle=rgbaS(col,0.9);ctx.lineWidth=1.4;rr(ctx,x+2,y+2,w-4,hh-4,(o.r==null?8:o.r)-1);ctx.stroke();ctx.restore();}
  const[ls,z]=fitL(ctx,label,w-12,o.size||13,2,700),lh=z*1.2,y0=y+hh/2-(ls.length*lh)/2+z*0.86;
  ls.forEach((l,i)=>T(ctx,l,x+w/2,y0+i*lh,{w:700,size:z,align:"center",color:o.color||rgbaS(K.ink,0.96)}));if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
// press(g, k): a row of choices (from api.seg) shows k as chosen, when a button elsewhere picks it
const press=(g,k)=>{[...g.children].forEach(b=>b.setAttribute("aria-pressed",b.getAttribute("data-k")===k?"true":"false"));};
const fmtN=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,L.lang==="es"?".":",");

/* ---------- 1 · Day one: bottom up, or top down ---------- */
// Six empty layers and a pile. From the bottom, the pile's pieces land a layer pair a week, fast, and link nothing; from the top, each
// week works out one layer from the one above, but only with the owners to talk to. Then ask what the outage system is for.
PLAY.pile=(Lb,api)=>{const W=Lb.w,N=W.layers.length,S={from:"bottom",talk:false,week:0,fill:[],ask:false,t:-1e5};
  const reset=()=>{S.week=0;S.fill=W.layers.map(()=>null);S.ask=false;S.t=performance.now();};reset();
  const filled=()=>S.fill.filter(Boolean).length,links=()=>{let n=0;for(let i=0;i<N-1;i++)if(S.fill[i]==="map"&&S.fill[i+1]==="map")n++;return n;};
  const r1=api.group(W.fromL);api.seg(r1,W.froms,"bottom",k=>{S.from=k;reset();api.kick(700);api.say(W.msg[k]);},W.fromL);
  const r2=api.group();api.toggle(r2,W.talkT,false,v=>{S.talk=v;api.say(v?W.msg.talkOn:W.msg.talkOff,v?"ok":null);});
  api.btn(r2,W.weekB,()=>{if(filled()===N){api.say(W.msg.done,"ok");return;}S.week++;S.t=performance.now();api.kick(900);
    if(S.from==="bottom"){const a=N-2*S.week,b=a+1;S.fill[a]=S.fill[b]="pile";
      if(filled()===N){api.say(W.msg.full,"warn");api.reach("pile");}else api.say(fill(W.msg.weekB,{w:S.week,a:W.layers[b],b:W.layers[a]}));
      if(S.week===1)api.reach("fast");return;}
    const i=S.fill.indexOf(null);if(!S.talk){api.say(fill(W.msg.noTalk,{w:S.week}),"warn");return;}
    S.fill[i]="map";if(i===1)api.reach("owners");
    if(filled()===N)api.say(W.msg.done,"ok");else api.say(fill(W.msg.weekT,{w:S.week,a:W.layers[i]}),"ok");},"go");
  const r3=api.group();api.btn(r3,W.askB,()=>{S.ask=true;S.t=performance.now();api.kick(900);const app=S.fill[4];
    if(!app)api.say(W.msg.askNone,"warn");else if(app==="pile")api.say(W.msg.askPile,"warn");
    else if(S.fill.slice(0,5).every(x=>x==="map")){api.say(W.msg.askMap,"ok");api.reach("why");}else api.say(W.msg.askPile,"warn");});
  const lay=(lw,ctx)=>{const m=12,o={lw,m},w=lw-m*2-30;o.rh=W.layers.map((_,i)=>18+Math.max(flow(ctx,W.pile[i],w,13,6,28).h,flow(ctx,W.map[i],w,13,6,28).h)+12);
    o.ry=[];let y=10;o.rh.forEach(h=>{o.ry.push(y);y+=h+6;});o.h=y+6;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.mot);const m=o.m,W2=o.lw-m*2,t=eo(since(now,S.t)/700),chain=S.ask&&S.fill.slice(0,5).every(x=>x==="map");
    W.layers.forEach((nm,i)=>{const y=o.ry[i],f=S.fill[i],col=K.lay[i];
      card(ctx,m+22,y,W2-22,o.rh[i],col,null,{glow:f?6:2,a:f?1:0.55});line1(ctx,nm,m+32,y+15,W2-44,12,{w:800,color:rgbaS(col,1)});
      if(f){const its=f==="pile"?W.pile[i]:W.map[i],fl=flow(ctx,its,W2-52,13,6,28),fresh=S.week&&since(now,S.t)<900;
        fl.pos.forEach((p,k)=>{const hot=chain&&k===0&&i!==3;tile(ctx,m+30+p.x,y+22+p.y,p.w,p.h,its[k],hot?K.gold:f==="pile"?K.paper:col,{a:fresh?Math.max(t,0.25):1,size:13});});}
      ctx.save();ctx.fillStyle=rgbaS(f==="map"?K.gold:K.soft,f?1:0.4);ctx.beginPath();ctx.arc(m+8,y+o.rh[i]/2,4,0,TP);ctx.fill();ctx.restore();
      if(i<N-1&&f==="map"&&S.fill[i+1]==="map"){ctx.save();ctx.strokeStyle=rgbaS(K.gold,chain?1:0.75);ctx.lineWidth=chain?3:2;ctx.beginPath();ctx.moveTo(m+8,y+o.rh[i]/2+5);ctx.lineTo(m+8,o.ry[i+1]+o.rh[i+1]/2-5);ctx.stroke();ctx.restore();}});
    line1(ctx,fill(W.links,{n:links()}),o.lw-m-120,o.h-2,110,12,{w:700,align:"right",color:rgbaS(K.soft,1)});
    if(t<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.week,()=>String(S.week)],[W.read.layers,()=>filled()+" / "+N],[W.read.links,()=>String(links())]]};};

/* ---------- 2 · Who it serves, and how it pays: check the fit ---------- */
// The value map on the left (what the utility offers, each switched on or off), the customer profile on the right (pains and gains,
// each joined to what answers it, or red). Households fit once the right offers are on; homes with solar keep one pain nothing answers,
// until the visitor says what it is, and a new offer appears: connect new solar, faster.
PLAY.fit=(Lb,api)=>{const W=Lb.w,S={cust:"house",on:{},cap:false,seen:false,t:-1e5};const off=k=>W.offers.find(o=>o[0]===k)[1];
  const items=()=>W.items[S.cust],ans=it=>!!S.on[it[2]],open=()=>items().filter(it=>!ans(it)).length;
  const check=()=>{if(S.cust==="house"&&!open()){api.say(W.msg.fits,"ok");api.reach("fits");return true;}
    if(S.cust==="solar"){const left=items().filter(it=>!ans(it));
      if(left.length===1&&left[0][2]==="fast"&&!S.cap){S.seen=true;api.say(W.msg.gap,"warn");api.reach("gap");return true;}
      if(!left.length){api.say(W.msg.solarFits,"ok");api.reach("solar");return true;}}return false;};
  const r1=api.group(W.custL);api.seg(r1,W.custs,"house",k=>{S.cust=k;S.t=performance.now();api.kick(800);if(!check())api.say(W.msg[k]);},W.custL);
  const r2=api.group(W.offersL);W.offers.filter(o=>o[0]!=="fast").forEach(([k,t])=>api.toggle(r2,t,false,v=>{S.on[k]=v;S.t=performance.now();api.kick(800);if(!check())api.say(fill(v?W.msg.on:W.msg.off,{o:t}));}));
  const r3=api.group(W.gapL);api.seg(r3,W.gaps,null,k=>{if(!S.seen){api.say(W.msg.gapFirst,"warn");return;}
    if(k==="serve"){api.say(W.msg.serve,"warn");return;}if(S.cap){api.say(W.msg.cap,"ok");return;}S.cap=true;api.kick(800);api.say(W.msg.cap,"ok");api.reach("cap");
    api.toggle(r2,off("fast"),false,v=>{S.on.fast=v;S.t=performance.now();api.kick(800);if(!check())api.say(fill(v?W.msg.on:W.msg.off,{o:off("fast")}));});},W.gapL);
  const lay=lw=>{const m=12,o={lw,m};o.cw=(lw-m*2-28)/2;o.y0=40;o.rh=46;o.h=o.y0+W.offers.length*o.rh+8;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.ret);const m=o.m,lx=m,rx=m+o.cw+28,t=eo(since(now,S.t)/600);
    line1(ctx,W.mapH,lx,22,o.cw,12.5,{w:800,align:"center",color:rgbaS(K.app,1)});line1(ctx,W.profH,rx,22,o.cw,12.5,{w:800,align:"center",color:rgbaS(K.ret,1)});
    const oy={};W.offers.forEach(([k,tx],i)=>{const y=o.y0+i*o.rh,on=!!S.on[k],gapBox=k==="fast"&&S.cap&&!on;oy[k]=y+20;
      if(k==="fast"&&!S.cap){chip2(ctx,lx,y,o.cw,40,"?",K.soft,{a:0.35,dash:true,glow:0});return;}
      chip2(ctx,lx,y,o.cw,40,tx,gapBox?K.bad:on?K.app:K.soft,{a:on||gapBox?1:0.5,glow:on?8:2,size:12.5,dash:gapBox});});
    items().forEach((it,i)=>{const y=o.y0+i*o.rh,a=ans(it),col=it[0]==="pain"?K.ret:K.good;
      if(a)arrow(ctx,lx+o.cw+2,oy[it[2]],rx-2,y+20,K.good,0.5+0.5*t,{head:6,lw:1.8});
      chip2(ctx,rx,y,o.cw,40,it[1],a?col:K.bad,{glow:a?6:10,size:12.5,mark:a?"ok":"no",dash:!a});});
    if(t<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.customer,()=>W.custs.find(c=>c[0]===S.cust)[1]],[W.read.answered,()=>String(items().length-open())],[W.read.open,()=>String(open())]]};};

/* ---------- 3 · Why it moves: ready for the chain? ---------- */
// The chain: stakeholder, driver, assessment, goal, outcome, and a principle beside it; three statements wait outside. Asked the right
// question, each becomes a link (its new words in its slot). Then a choice is checked against the principle, if there is one.
PLAY.chain=(Lb,api)=>{const W=Lb.w,S={st:null,done:{},choice:null,checked:null,t:-1e5};const slotOf={};Object.keys(W.slot).forEach(k=>slotOf[W.slot[k]]=k);
  const r1=api.group(W.stL);api.seg(r1,W.sts,null,k=>{S.st=k;api.say(S.done[k]?fill(W.msg.done,{b:W.became[k]}):W.sts.find(s=>s[0]===k)[1]);},W.stL);
  const r2=api.group(W.askL);api.seg(r2,W.asks,null,k=>{const s=S.st;if(!s){api.say(W.prompt);return;}if(S.done[s]){api.say(fill(W.msg.done,{b:W.became[s]}));return;}
    if(W.right[s]!==k){api.say(W.msg[s+"_"+k],"warn");return;}S.done[s]=true;S.t=performance.now();api.kick(900);api.say(W.msg[s],"ok");
    api.reach({op:"source",wish:"check",slogan:"fail"}[s]);},W.askL);
  const r3=api.group(W.choiceL);api.seg(r3,W.choices,null,k=>{S.choice=k;S.checked=null;},W.choiceL);
  api.btn(r3,W.checkB,()=>{if(!S.choice){api.say(W.choiceL);return;}if(!S.done.slogan){S.checked=null;api.say(W.msg.noPrin,"warn");return;}
    S.checked=S.choice;S.t=performance.now();api.kick(800);api.say(W.msg[S.choice],S.choice==="upgrade"?"ok":"warn");api.reach("test");},"go");
  const lay=(lw,ctx)=>{const m=12,o={lw,m},W2=lw-m*2;o.sh=64;o.y0=10;o.wy=o.y0+W.kinds.length*(o.sh+8)+8;
    o.wh=26+W.sts.length*50;o.cy=o.wy+o.wh+10;o.h=o.cy+46+10;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.mot);const m=o.m,W2=o.lw-m*2,t=eo(since(now,S.t)/700);
    W.kinds.forEach((kd,i)=>{const kk=(W.kindKeys||W.kinds)[i],y=o.y0+i*(o.sh+8),s=slotOf[kk],txt=W.fixed[i]||(s&&S.done[s]?W.became[s]:null),isP=kk==="principle",x=m+(isP?18:0),w=W2-(isP?18:0);
      const fresh=s&&S.done[s]&&since(now,S.t)<900,col=txt?(isP?K.gold:K.mot):K.soft;
      card(ctx,x,y,w,o.sh,col,kd,{glow:fresh?16:txt?5:1,a:txt?1:0.55,dash:!txt,size:12.5});
      if(txt)lines(ctx,txt,x+12,y+38,w-24,{size:13,max:2,color:rgbaS(K.ink,fresh?0.4+0.6*t:0.95)});
      if(i&&!isP)arrow(ctx,m+16,y-8,m+16,y,K.soft,0.8,{head:5});
      if(isP){ctx.save();ctx.setLineDash([3,4]);ctx.strokeStyle=rgbaS(K.gold,0.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(m+6,o.y0+20);ctx.lineTo(m+6,y+o.sh/2);ctx.lineTo(x,y+o.sh/2);ctx.stroke();ctx.restore();}});
    card(ctx,m,o.wy,W2,o.wh,K.soft,W.waiting,{glow:2,size:12.5});
    W.sts.forEach(([k,tx],i)=>{const y=o.wy+30+i*50;chip2(ctx,m+10,y,W2-20,42,tx,S.done[k]?K.good:S.st===k?K.gold:K.paper,{a:S.done[k]?0.35:1,glow:S.st===k?10:3,size:13,mark:S.done[k]?"ok":null});});
    const c=S.checked;chip2(ctx,m,o.cy,W2,46,S.choice?W.choices.find(x=>x[0]===S.choice)[1]:W.choiceL,c?(c==="upgrade"?K.good:K.bad):K.soft,{a:S.choice?1:0.5,glow:c?12:3,size:13,mark:c?(c==="upgrade"?"ok":"no"):null});
    if(t<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.inChain,()=>String(3+Object.keys(S.done).length)],[W.read.waiting,()=>String(W.sts.length-Object.keys(S.done).length)]]};};

/* ---------- 4 · What it must be able to do: survive the change ---------- */
// Tomás's first capability map, seven boxes, each naming what, who, with what or how. Three changes, each switched on or off; a box that
// names what the change changes breaks. Rewritten as what must be done, seven boxes become six, and every change leaves them standing.
PLAY.survive=(Lb,api)=>{const W=Lb.w,S={ch:{who:false,with:false,how:false},rw:false,t:-1e5},G={};
  const shown=()=>{if(!S.rw)return W.boxes.map((b,i)=>({i,k:b[0],t:b[1]}));const seen=new Set(),out=[];
    W.boxes.forEach((b,i)=>{const t=b[2]||b[1];if(seen.has(t))return;seen.add(t);out.push({i,k:"what",t});});return out;};
  const broken=()=>shown().filter(b=>b.k!=="what"&&S.ch[b.k]);
  const after=()=>{const br=broken();if(br.length)api.say(fill(W.msg.broke,{t:br[0].t,k:W.kinds[br[0].k]}),"warn");
    if(!S.rw&&S.ch.who&&br.some(b=>b.k==="who"))api.reach("team");if(!S.rw&&br.some(b=>b.k==="with"||b.k==="how"))api.reach("tool");
    if(S.rw&&S.ch.who&&S.ch.with&&S.ch.how){api.say(W.msg.all,"ok");api.reach("stand");}return br.length;};
  const r1=api.group(W.chL);W.changes.forEach(([k,t])=>api.toggle(r1,t,false,v=>{S.ch[k]=v;S.t=performance.now();api.kick(800);
    api.say(v?W.msg[k]:fill(W.msg.off,{c:t}));if(v){const n=after();if(!n&&!(S.rw&&S.ch.who&&S.ch.with&&S.ch.how))api.say(W.msg[k]+" "+W.msg.stood,"ok");}}));
  const r2=api.group();api.toggle(r2,W.rwT,false,v=>{S.rw=v;S.t=performance.now();api.kick(900);api.say(v?W.msg.rw:W.msg.unrw,v?"ok":null);if(v){api.reach("six");after();}});
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.cw=(lw-m*2-10)/2;o.top=10;o.cf=flow(ctx,W.changes.map(c=>c[1]),lw-m*2,13,8,34);o.by=o.top+o.cf.h+16;o.rh=52;o.h=o.by+4*o.rh+4;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.str);const m=o.m,W2=o.lw-m*2;let mv=false;
    W.changes.forEach(([k,tx],i)=>{const p=o.cf.pos[i];chip(ctx,m+p.x,o.top+p.y,p.w,p.h,tx,S.ch[k]?K.gold:K.soft,{a:S.ch[k]?1:0.5,glow:S.ch[k]?10:2,size:13});});
    const br=new Set(broken().map(b=>b.i));shown().forEach((b,j)=>{const[x,y,mov]=glide(G,"b"+b.i,m+(j%2)*(o.cw+10),o.by+Math.floor(j/2)*o.rh,now,600);mv=mv||mov;
      const bad=br.has(b.i);chip2(ctx,x,y,o.cw,44,b.t,bad?K.bad:S.rw?K.good:K.str,{glow:bad?12:4,size:13,dash:bad,mark:bad?"no":S.rw?"ok":null});});
    if(mv)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.boxes,()=>String(shown().length)],[W.read.broken,()=>String(broken().length)]]};};

/* ---------- 5 · How value reaches people: who goes first? ---------- */
// 2:15 a.m.: three faults, two crews. Send them by hand, by habit (both to the biggest) or by the rule (wires down, then life support,
// then the most homes), which reads three facts; the register can be a week late. Running the night says what each choice did.
PLAY.first=(Lb,api)=>{const W=Lb.w,F=W.faults,S={crew:[null,null],by:null,reg:false,ran:null,t:-1e5},G={},segs=[];
  const HOMES={hill:40,river:12,east:1200};
  W.crewL.forEach((l,i)=>{const g=api.group(l);segs.push(api.seg(g,F.map(f=>[f[0],f[1]]),null,k=>{S.crew[i]=k;S.by=null;S.ran=null;api.kick(700);
    api.say(fill(W.msg.set,{c:W.crews[i],f:F.find(f=>f[0]===k)[1]}));},l));});
  const setC=(a,b,by)=>{S.crew=[a,b];S.by=by;S.ran=null;press(segs[0],a);press(segs[1],b);S.t=performance.now();api.kick(800);};
  const r2=api.group();api.btn(r2,W.ruleB,()=>{if(S.reg){setC("hill","east","rule");api.say(W.msg.ruleLate,"warn");}else{setC("hill","river","rule");api.say(W.msg.rule,"ok");}});
  api.btn(r2,W.habitB,()=>{setC("east","east","habit");api.say(W.msg.habit,"warn");});
  api.toggle(r2,W.regT,false,v=>{S.reg=v;S.by=null;S.ran=null;api.say(v?W.msg.regOn:W.msg.regOff,v?"warn":null);});
  const res=()=>{const c=S.crew;if(!c[0]||!c[1])return null;const at=new Set(c);
    return{safe:at.has("hill"),life:at.has("river"),homes:[...at].reduce((a,k)=>a+HOMES[k],0)+(at.has("east")?0:HOMES.east)};};
  const r3=api.group();api.btn(r3,W.runB,()=>{const r=res();if(!r){api.say(W.prompt,"warn");return;}S.ran=performance.now();S.t=S.ran;api.kick(1400);
    const c=S.crew;if(S.by==="habit")api.reach("habit");
    if(c[0]===c[1]){api.say((r.safe?"":W.msg.wire+" ")+W.msg.same,"warn");return;}
    if(!r.safe){api.say(W.msg.wire,"warn");return;}api.reach("safe");
    if(!r.life){if(S.reg&&S.by==="rule"){api.say(W.msg.late,"warn");api.reach("late");}else api.say(W.msg.life,"warn");return;}
    api.say(W.msg.good,"ok");if(S.by==="rule"&&!S.reg)api.reach("rule");},"go");
  const lay=lw=>{const m=12,o={lw,m};o.fy=10;o.fh=60;o.dy=o.fy+3*(o.fh+8)+6;o.xy=o.dy+46;o.h=o.xy+3*36+8;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.bus);const m=o.m,W2=o.lw-m*2,cwid=Math.min(96,W2*0.3),r=S.ran?res():null,u=since(now,S.ran);let mv=false;
    F.forEach(([k,nm,sub],i)=>{const y=o.fy+i*(o.fh+8),ok=r&&u>1200?(k==="hill"?r.safe:k==="river"?r.life:true):null;
      card(ctx,m,y,W2,o.fh,k==="hill"?K.bad:k==="river"?K.ret:K.app,nm,{glow:ok===false?14:4,size:13.5,right:cwid+8});
      line1(ctx,sub,m+12,y+50,W2-24,12.5,{w:600,color:rgbaS(K.ink,0.85)});if(ok!=null)mark(ctx,m+W2-4,y+4,ok?"ok":"no");});
    card(ctx,m,o.dy,W2,38,K.soft,W.depot,{glow:2,size:12.5,right:2*cwid+16});
    S.crew.forEach((k,i)=>{const fi=F.findIndex(f=>f[0]===k),same=S.crew[0]&&S.crew[0]===S.crew[1];
      const tx=k?m+W2-cwid-8:m+W2-2*cwid-16+i*(cwid+8),ty=k?o.fy+fi*(o.fh+8)+5+(same?i*14-6:0):o.dy+4;
      const[x,y,mov]=glide(G,"c"+i,tx,ty,now,900);mv=mv||mov;
      chip(ctx,x,y+(same?6:0),cwid,same?20:26,W.crews[i],K.gold,{glow:8,size:12.5});});
    W.facts.forEach(([k,tx],i)=>{const late=k==="register"&&S.reg,y=o.xy+i*36;
      chip(ctx,m,y,W2,30,tx,late?K.bad:K.net,{glow:late?10:3,size:12.5,mark:late?"no":null});});
    if(mv||(S.ran&&u<1400))api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.safe,()=>{const r=S.ran&&res();return r?(r.safe?"✓":"✗"):"–";}],[W.read.life,()=>{const r=S.ran&&res();return r?(r.life?"✓":"✗"):"–";}],
    [W.read.homes,()=>{const r=S.ran&&res();return r?fmtN(r.homes):"–";}]]};};

/* ---------- 6 · Who does it, and where meaning changes: what may cross? ---------- */
// The network on the left, retail on the right, a wall between them. Eight facts, each switched onto the list or off it; opening the
// gate sends what's on the list across, and says what that did: which needs it met, and which information left its side.
PLAY.cross=(Lb,api)=>{const W=Lb.w,FX=W.facts,S={on:{},open:false,t:-1e5},G={};
  const right=()=>FX.filter(f=>!!S.on[f[0]]===!!f[4]).length;
  const r1=api.group(W.markL);FX.forEach(([k,,long,short])=>api.toggle(r1,short,false,v=>{S.on[k]=v;S.open=false;api.kick(700);api.say(fill(v?W.msg.on:W.msg.off,{t:long}));}));
  const r2=api.group();api.btn(r2,W.openB,()=>{S.open=true;S.t=performance.now();api.kick(1200);const on=FX.filter(f=>S.on[f[0]]);
    if(!on.length){api.say(W.msg.empty,"warn");return;}const out=[],ok=[];
    if(S.on.cp){ok.push(W.msg.cp);api.reach("key");}else out.push(W.msg.cpNo);
    if(S.on.life){ok.push(W.msg.life);api.reach("life");}else out.push(W.msg.lifeNo);
    const leak=on.filter(f=>f[1]==="ret"&&!f[4]),extra=on.filter(f=>f[1]==="net"&&!f[4]);
    if(leak.length)out.push(fill(W.msg.leak,{x:leak.map(f=>f[3]).join(", ")}));else api.reach("kept");
    if(extra.length)out.push(fill(W.msg.extra,{x:extra.map(f=>f[3]).join(", ")}));
    if(right()===FX.length){api.say(W.msg.short,"ok");api.reach("short");}else api.say(ok.concat(out).join(" "),out.length?"warn":"ok");},"go");
  const lay=lw=>{const m=12,o={lw,m};o.cw=(lw-m*2-30)/2;o.hy=10;o.fy=34;o.rh=44;o.ly=o.fy+4*o.rh+10;o.lh=30+4*30;o.h=o.ly+o.lh+10;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.inf);const m=o.m,W2=o.lw-m*2,cx=m+o.cw+15,u=eo(since(now,S.t)/1000);let mv=false;
    line1(ctx,W.sides.net,m,o.hy+12,o.cw,13,{w:800,align:"center",color:rgbaS(K.net,1)});line1(ctx,W.sides.ret,cx+15,o.hy+12,o.cw,13,{w:800,align:"center",color:rgbaS(K.ret,1)});
    const gy=o.fy+2*o.rh-6;ctx.save();ctx.strokeStyle=rgbaS(K.paper,0.7);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,o.fy-4);ctx.lineTo(cx,gy-(S.open?14:0));
    ctx.moveTo(cx,gy+(S.open?14:0));ctx.lineTo(cx,o.fy+4*o.rh);ctx.stroke();ctx.restore();
    const n={net:0,ret:0},lst=[];FX.forEach(([k,side,,short])=>{const i=n[side]++,x0=side==="net"?m:cx+15,y=o.fy+i*o.rh,on=!!S.on[k],gone=on&&S.open;
      if(gone)lst.push([k,short,side]);
      chip(ctx,x0,y,o.cw,36,short,side==="net"?K.net:K.ret,{a:gone?lp(1,0.35,u):1,glow:on?10:3,size:12.5,mark:on?"ok":null,tint:on?0.22:0.1});});
    card(ctx,m,o.ly,W2,o.lh,K.gold,W.listH,{glow:4,size:12.5});
    lst.forEach(([k,short,side],i)=>{const tx=m+12,ty=o.ly+28+Math.min(i,3)*30;
      const[x,y,mov]=glide(G,"l"+k,tx,ty,now,700);mv=mv||mov;const bad=!FX.find(f=>f[0]===k)[4];
      if(i<4)tile(ctx,x,y,W2-24,26,(side==="net"?"→ ":"← ")+short,bad?K.bad:K.good,{size:12.5,mark:bad?"no":"ok"});
      else if(i===4)line1(ctx,"+"+(lst.length-4),m+W2-60,o.ly+20,48,12.5,{w:800,align:"right",color:rgbaS(K.bad,1)});});
    if(mv||u<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.onList,()=>String(FX.filter(f=>S.on[f[0]]).length)],[W.read.right,()=>String(right())]]};};

/* ---------- 7 · Today, and where it's going: place the systems ---------- */
// Eight systems, as a list or placed under the capability each serves, with the goals above. Switched off, a system is struck through;
// a capability left with none turns red, and so does the goal it served. In the list, nothing shows what a switch-off reaches.
PLAY.place=(Lb,api)=>{const W=Lb.w,SY=W.systems,CP=W.caps,S={view:"list",off:{},t:-1e5};
  const lost=k=>k!=="none"&&SY.filter(s=>s[2]===k).every(s=>S.off[s[0]]),nLost=()=>CP.filter(c=>lost(c[0])).length;
  const goalLost=g=>CP.some(c=>c[2]===g&&lost(c[0]));
  const GC={reliable:K.net,renew:K.tec,afford:K.gold};
  const r1=api.group(W.viewL);api.seg(r1,W.views,"list",k=>{S.view=k;S.t=performance.now();api.kick(800);api.say(W.msg[k],k==="map"?"ok":null);if(k==="map")api.reach("overlap");},W.viewL);
  const r2=api.group(W.offL);SY.forEach(([k,nm,cap])=>api.toggle(r2,nm,false,v=>{S.off[k]=v;S.t=performance.now();api.kick(700);
    if(!v){api.say(fill(W.msg.back,{t:nm}));return;}if(S.view==="list"){api.say(W.msg.listOff,"warn");return;}
    api.say(W.msg[k],k==="fleet"?"ok":lost(cap)?"warn":null);if(k==="sheet")api.reach("shadow");if(k==="fleet")api.reach("saving");
    if(lost(cap)&&k!=="sheet")api.reach("up");if(k==="sheet")api.reach("up");}));
  const lay=(lw,ctx)=>{const m=12,o={lw,m},W2=lw-m*2;o.gy=10;o.gh=flow(ctx,W.goalsTop.map(g=>g[1]),W2,12.5,6,30).h;o.cy=o.gy+o.gh+14;o.ch={};let y=o.cy;
    CP.forEach(([k])=>{const its=SY.filter(s=>s[2]===k).map(s=>s[1]),f=flow(ctx,its,W2-24,13,6,28);o.ch[k]={y,h:30+f.h+(k==="outages"||k==="capacity"||k==="none"?20:0)+8};y+=o.ch[k].h+6;});
    o.mh=y;const lf=flow(ctx,SY.map(s=>s[1]),W2-24,13,6,28);o.h=Math.max(y,o.gy+40+lf.h+30)+4;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.app);const m=o.m,W2=o.lw-m*2,t=eo(since(now,S.t)/700);
    if(S.view==="list"){card(ctx,m,o.gy,W2,o.h-o.gy-6,K.soft,W.listH,{glow:3,size:13});const f=flow(ctx,SY.map(s=>s[1]),W2-24,13,6,28);
      f.pos.forEach((p,i)=>tile(ctx,m+12+p.x,o.gy+34+p.y,p.w,p.h,SY[i][1],K.paper,{size:13,strike:!!S.off[SY[i][0]]}));if(t<1)api.kick(60);return;}
    const gf=flow(ctx,W.goalsTop.map(g=>g[1]),W2,12.5,6,30);W.goalsTop.forEach(([g,nm],i)=>{const bad=goalLost(g),p=gf.pos[i];chip(ctx,m+p.x,o.gy+p.y,p.w,p.h,nm,bad?K.bad:GC[g],{glow:bad?14:5,size:12.5,mark:bad?"no":null});});
    CP.forEach(([k,nm,g])=>{const b=o.ch[k],bad=lost(k),col=k==="none"?K.soft:bad?K.bad:GC[g],its=SY.filter(s=>s[2]===k);
      card(ctx,m,b.y,W2,b.h,col,nm,{glow:bad?12:4,size:13,a:lp(0.4,1,t),dash:k==="none"});
      const f=flow(ctx,its.map(s=>s[1]),W2-24,13,6,28);f.pos.forEach((p,i)=>tile(ctx,m+12+p.x,b.y+30+p.y,p.w,p.h,its[i][1],S.off[its[i][0]]?K.soft:K.paper,{size:13,strike:!!S.off[its[i][0]],a:lp(0.3,1,t)}));
      const tag=k==="outages"?W.tags.overlap:k==="capacity"?W.tags.shadow:k==="none"?W.tags.nothing:null;
      if(tag)line1(ctx,"● "+tag,m+12,b.y+b.h-10,W2-24,12.5,{w:700,color:rgbaS(k==="capacity"?K.bad:K.gold,1)});});
    if(t<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.off,()=>String(SY.filter(s=>S.off[s[0]]).length)],[W.read.lost,()=>S.view==="map"?String(nLost()):"?"]]};};

/* ---------- 8 · Now the questions appear: climb the ladder ---------- */
// Four requests from the backlog. Asked what it would decide, a request climbs the ladder, decision, capability, goal, or goes back
// to the tray. Below, the regulator's measure grows into its tree, and the branch nobody asked about is offered to its owner.
PLAY.skipper=(Lb,api)=>{const W=Lb.w,R=W.reqs,TR=W.tree,S={req:null,res:{},tree:false,offered:false,t:-1e5,tt:-1e5};
  const req=k=>R.find(r=>r[0]===k);
  const r1=api.group(W.reqL);api.seg(r1,R.map(r=>[r[0],r[1]]),null,k=>{S.req=k;S.t=performance.now();api.kick(500);api.say(fill(W.msg.pick,{r:req(k)[1]}));},W.reqL);
  const r2=api.group();api.btn(r2,W.askB,()=>{const k=S.req;if(!k){api.say(W.prompt);return;}const up=!!req(k)[2];S.res[k]=up?"up":"back";S.t=performance.now();api.kick(1500);
    api.say(W.msg[k],up?"ok":"warn");api.reach(up?"reach":"back");},"go");
  const r3=api.group();api.toggle(r3,W.treeT,false,v=>{S.tree=v;S.tt=performance.now();api.kick(900);api.say(v?W.msg.treeOn:W.msg.treeOff,v?"ok":null);if(v)api.reach("tree");});
  api.btn(r3,W.offerB,()=>{if(!S.tree){api.say(W.msg.offerNo,"warn");return;}S.offered=true;S.tt=performance.now();api.kick(900);api.say(W.msg.offer,"ok");api.reach("offer");});
  const lay=lw=>{const m=12,o={lw,m};o.qy=10;o.ly=o.qy+52;o.rh=52;o.ty=o.ly+3*(o.rh+8);o.th=28+2*30;o.gy=o.ty+o.th+14;
    o.gh=50+16+66+12+40+30+46;o.h=o.gy+o.gh+8;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.tec);const m=o.m,W2=o.lw-m*2,k=S.req,r=k?req(k):null,res=k?S.res[k]:null,u=since(now,S.t);
    chip2(ctx,m,o.qy,W2,44,r?r[1]:W.reqL,r?K.paper:K.soft,{a:r?1:0.5,glow:res==="back"?10:4,size:13,mark:res?(res==="up"?"ok":"no"):null});
    for(let i=0;i<3;i++){const j=2-i,y=o.ly+i*(o.rh+8),on=res==="up"&&u>j*350,a=on?eo((u-j*350)/400):0;
      card(ctx,m,y,W2,o.rh,on?[K.bus,K.str,K.mot][j]:K.soft,W.rungs[j],{a:on?1:0.5,glow:on?8:1,size:12.5,dash:!on});
      if(on)line1(ctx,r[2][j],m+12,y+40,W2-24,13,{w:700,color:rgbaS(K.ink,0.4+0.6*a)});
      if(i<2)arrow(ctx,m+20,y+o.rh+8,m+20,y+o.rh,on||res==="up"?K.gold:K.soft,0.7,{head:5});}
    const back=R.filter(x=>S.res[x[0]]==="back");card(ctx,m,o.ty,W2,o.th,K.soft,W.tray,{glow:2,size:12.5});
    back.forEach((x,i)=>tile(ctx,m+12,o.ty+28+i*30,W2-24,26,x[1],K.bad,{size:12.5,a:0.85}));
    // the tree
    const tv=eo(since(now,S.tt)/700),y0=o.gy,cw=(W2-30)/2;
    chip2(ctx,m,y0,W2,50,TR.root,K.gold,{glow:6,size:13});
    line1(ctx,TR.who.root,m+12,y0+64,W2-24,12,{w:600,color:rgbaS(K.soft,1)});
    if(S.tree){const a=tv,cy=y0+76;withA(ctx,a,()=>{
      arrow(ctx,m+W2*0.3,y0+50,m+cw/2,cy,K.ink,0.8,{head:5});arrow(ctx,m+W2*0.7,y0+50,m+cw+30+cw/2,cy,K.ink,0.8,{head:5});
      chip2(ctx,m,cy,cw,50,TR.often,K.net,{size:12.5,glow:4});line1(ctx,TR.times,m+cw,cy+31,30,16,{w:800,align:"center",color:rgbaS(K.ink,1)});
      chip2(ctx,m+cw+30,cy,cw,50,TR.long,S.offered?K.good:K.bad,{size:12.5,glow:S.offered?12:6,dash:!S.offered});
      line1(ctx,TR.who.often,m+4,cy+64,cw,12,{w:600,color:rgbaS(K.soft,1)});line1(ctx,S.offered?"✓":TR.who.long,m+cw+34,cy+64,cw,12,{w:700,color:rgbaS(S.offered?K.good:K.bad,1)});
      const ty=cy+78;arrow(ctx,m+cw/2,ty,m+cw/2,cy+50,K.soft,0.9,{head:5,dash:[3,4]});chip2(ctx,m,ty,cw,40,TR.trees,K.tec,{size:12.5,dash:true,glow:2});
      line1(ctx,"— "+TR.solid+"   ┄ "+TR.dotted,m,ty+58,W2,12,{w:600,color:rgbaS(K.soft,1)});
      if(S.offered)chip2(ctx,m,ty+70,W2,40,TR.offer,K.good,{size:12.5,glow:10,mark:"ok"});});}
    if(u<1600||tv<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.climbed,()=>String(R.filter(x=>S.res[x[0]]==="up").length)],[W.read.back,()=>String(R.filter(x=>S.res[x[0]]==="back").length)]]};};

/* ---------- 9 · Rules with a home: give the rule a home ---------- */
// Day one's rule on the wall between the network and retail. Choose who owns it (the nightly script, Grace, or two rules, one on each
// side, joined by what crosses), how ArchiMate 4 draws it, and where its tracking table's list goes; then move billing, and plant a
// bill that isn't corrected.
PLAY.rule=(Lb,api)=>{const W=Lb.w,S={own:"script",draw:null,fail:"mail",moved:false,plant:false,t:-1e5};
  const r1=api.group(W.ownL);api.seg(r1,W.owns,"script",k=>{S.own=k;S.moved=false;S.plant=false;S.t=performance.now();api.kick(800);api.say(W.msg[k],k==="two"?"ok":"warn");if(k==="two")api.reach("split");},W.ownL);
  const r2=api.group(W.drawL);api.seg(r2,W.draws,null,k=>{S.draw=k;api.kick(400);api.say(W.msg[k],k==="req"?"ok":"warn");if(k==="req")api.reach("req");},W.drawL);
  const r3=api.group(W.failL);api.seg(r3,W.fails,"mail",k=>{S.fail=k;S.plant=false;api.kick(400);api.say(W.msg[k],k==="queue"?"ok":null);},W.failL);
  const r4=api.group();api.btn(r4,W.moveB,()=>{S.moved=true;S.t=performance.now();api.kick(900);if(S.own==="two"){api.say(W.msg.moveOk,"ok");api.reach("move");}else api.say(W.msg.moveNo,"warn");});
  api.btn(r4,W.plantB,()=>{S.plant=true;S.t=performance.now();api.kick(900);if(S.own!=="two")api.say(W.msg.plantNoHome,"warn");
    else if(S.fail!=="queue")api.say(W.msg.plantMail,"warn");else{api.say(W.msg.plantOk,"ok");api.reach("caught");}},"go");
  const lay=lw=>{const m=12,o={lw,m};o.cw=(lw-m*2-24)/2;o.hy=10;o.ry=34;o.rh=96;o.by=o.ry+o.rh+30;o.h=o.by+3*44+8;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.mot);const m=o.m,W2=o.lw-m*2,cx=m+o.cw+12,t=eo(since(now,S.t)/700),two=S.own==="two";
    line1(ctx,W.net,m,o.hy+12,o.cw,13,{w:800,align:"center",color:rgbaS(K.net,1)});line1(ctx,W.ret,cx+12,o.hy+12,o.cw,13,{w:800,align:"center",color:rgbaS(K.ret,1)});
    ctx.save();ctx.strokeStyle=rgbaS(K.paper,0.6);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,o.ry-6);ctx.lineTo(cx,o.ry+o.rh+8);ctx.stroke();ctx.restore();
    const gl=S.draw?W.glyph[S.draw]:W.none,glc=S.draw==="req"?K.good:S.draw?K.bad:K.soft;
    if(!two){const w=Math.min(W2,300),x=m+(W2-w)/2,dead=S.moved;
      card(ctx,x,o.ry+6,w,o.rh-12,dead?K.soft:K.gold,null,{glow:dead?2:8,a:dead?0.5:1});
      lines(ctx,W.wallRule,x+12,o.ry+28,w-24,{size:13,max:2});
      line1(ctx,S.own==="grace"?W.ownerNet+" · ½":W.homeless,x+12,o.ry+o.rh-34,w-24,12.5,{w:700,color:rgbaS(S.own==="grace"?K.net:K.bad,1)});
      line1(ctx,gl,x+12,o.ry+o.rh-16,w-24,12.5,{w:600,color:rgbaS(glc,1)});}
    else{[[m,W.netRule,W.ownerNet,K.net],[cx+12,W.retRule,W.ownerRet,K.ret]].forEach(([x,rt,ow,c],i)=>{withA(ctx,0.3+0.7*t,()=>{
        card(ctx,x,o.ry,o.cw,o.rh,c,null,{glow:6});lines(ctx,rt,x+10,o.ry+20,o.cw-20,{size:13,max:2});
        line1(ctx,ow,x+10,o.ry+o.rh-30,o.cw-20,12.5,{w:700,color:rgbaS(K.good,1)});line1(ctx,gl,x+10,o.ry+o.rh-12,o.cw-20,12.5,{w:600,color:rgbaS(glc,1)});});});
      arrow(ctx,cx-30,o.ry+o.rh+16,cx+30,o.ry+o.rh+16,K.gold,t,{head:6});
      line1(ctx,W.crosses,m,o.ry+o.rh+28,W2,12,{w:700,align:"center",color:rgbaS(K.gold,t)});}
    const bw=Math.min(150,W2*0.42),by=o.by;
    chip2(ctx,m,by,bw,36,S.moved?W.billing2:W.billing,S.moved?K.app:K.soft,{size:12.5,glow:S.moved?8:3});
    const live=two||!S.moved;chip2(ctx,m+bw+18,by,W2-bw-18,36,W.track,live?K.str:K.soft,{size:12.5,a:live?1:0.4,glow:live?6:1,mark:S.moved?(live?"ok":"no"):null});
    arrow(ctx,m+bw+2,by+18,m+bw+16,by+18,K.soft,0.8,{head:5});
    const listed=S.plant&&two;chip2(ctx,m+bw+18,by+44,W2-bw-18,36,listed?W.listed:"–",listed?K.bad:K.soft,{size:12.5,a:listed?1:0.4,glow:listed?10:1});
    const to=W.to[S.fail],ok=S.fail==="queue";chip2(ctx,m+bw+18,by+88,W2-bw-18,36,"→ "+to,ok?K.good:K.soft,{size:12.5,glow:listed?(ok?14:2):3,a:listed&&!ok?0.5:1,mark:listed?(ok?"ok":"no"):null});
    if(t<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.owners,()=>S.own==="two"?"2":S.own==="grace"?"1":"0"],[W.read.home,()=>S.own==="two"?W.net+" · "+W.ret:W.homeless]]};};

/* ---------- 10 · When strategy moves: walk it down ---------- */
// The social tariff lands at the top of the six layers and is walked down a layer at a time, with what it touches and who owns each.
// What to ask the agency for, whether the list crosses the wall, and when the agreement starts decide whether it's ready by 1 July.
PLAY.walk=(Lb,api)=>{const W=Lb.w,N=W.layers.length,S={d:0,ask:null,wall:false,start:null,t:-1e5};
  const end=()=>{if(!S.start)return null;const s0=S.start==="day1"?0:5;return s0+6+(S.ask==="all"?3:0);};
  const ready=()=>S.d===N&&S.ask==="least"&&S.start==="day1"&&!S.wall;
  const judge=()=>{if(S.d<N||!S.ask||!S.start)return;if(ready()){api.say(W.msg.ready,"ok");api.reach("july");return;}
    const why=S.wall?W.msg.whyWall:S.ask==="all"?W.msg.whyAsk:W.msg.whyStart;api.say(fill(W.msg.notReady,{why}),"warn");};
  const r1=api.group();api.btn(r1,W.downB,()=>{if(S.d>=N){api.say(W.msg.bottom);return;}S.d++;S.t=performance.now();api.kick(900);const i=S.d-1;
    let s=fill(W.msg.down,{l:W.layers[i],items:W.touched[i].join(", ")});if(i===2){if(S.wall){s+=" "+W.msg.wallBroke;}else{s+=" "+W.msg.wallKept;api.reach("wall");}}
    api.say(s,i===2&&S.wall?"warn":null);if(S.d===N){api.say(W.msg.walked,"ok");api.reach("walked");judge();}},"go");
  const r2=api.group(W.askL);api.seg(r2,W.asks,null,k=>{S.ask=k;api.kick(700);api.say(W.msg[k],k==="least"?"ok":"warn");if(k==="least")api.reach("least");judge();},W.askL);
  const r3=api.group();api.toggle(r3,W.wallT,false,v=>{S.wall=v;api.kick(500);api.say(v?W.msg.wallOn:W.msg.wallOff,v?"warn":"ok");if(!v&&S.d>=3)api.reach("wall");judge();});
  const r4=api.group(W.startL);api.seg(r4,W.starts,null,k=>{S.start=k;api.kick(700);api.say(W.msg[k],k==="day1"?"ok":"warn");judge();},W.startL);
  const lay=(lw,ctx)=>{const m=12,o={lw,m},w=lw-m*2-24;o.py=10;o.ry=[];o.rh=[];let y=o.py+40;
    W.layers.forEach((_,i)=>{const h=20+flow(ctx,W.touched[i],w,12.5,6,26).h+20;o.ry.push(y);o.rh.push(h);y+=h+6;});o.ty=y+8;o.h=o.ty+90;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.net);const m=o.m,W2=o.lw-m*2,t=eo(since(now,S.t)/700);
    chip2(ctx,m,o.py,W2,32,W.drop,K.gold,{size:12.5,glow:8});
    W.layers.forEach((nm,i)=>{const y=o.ry[i],h=o.rh[i],on=i<S.d,fresh=on&&i===S.d-1,col=K.lay[i];
      card(ctx,m,y,W2,h,on?col:K.soft,nm,{glow:fresh?12:on?5:1,a:on?1:0.45,size:12.5,right:i===2||i===3?110:0});
      if(i===2||i===3){const bad=S.wall;line1(ctx,(bad?"✗ ":"")+W.wall,m+W2-120,y+20,108,12,{w:700,align:"right",color:rgbaS(bad?K.bad:K.soft,1)});}
      if(!on)return;const a=fresh?t:1,f=flow(ctx,W.touched[i],W2-24,12.5,6,26);
      f.pos.forEach((p,k)=>tile(ctx,m+12+p.x,y+26+p.y,p.w,p.h,W.touched[i][k],col,{size:12.5,a}));
      line1(ctx,"✓ "+W.owners[i].join(", "),m+12,y+h-7,W2-24,12,{w:600,color:rgbaS(K.good,a)});});
    // the timeline: November to September, with July marked
    const x0=m+70,x1=m+W2-4,mx=k=>x0+(x1-x0)*k/10,ty=o.ty;
    W.months.forEach((mo,i)=>line1(ctx,mo,mx(i*2)-20,ty+12,40,12,{w:700,align:"center",color:rgbaS(i===4?K.gold:K.soft,1)}));
    ctx.save();ctx.strokeStyle=rgbaS(K.gold,0.8);ctx.setLineDash([3,3]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(mx(8),ty+18);ctx.lineTo(mx(8),ty+80);ctx.stroke();ctx.restore();
    const bar=(lab,y,a,b,col)=>{line1(ctx,lab,m,y+14,64,12,{w:700,color:rgbaS(K.soft,1)});if(a==null)return;const xa=mx(a),xb=mx(Math.min(b,10));
      ctx.save();ctx.fillStyle=rgbaS(col,0.75);rr(ctx,xa,y+2,Math.max(6,xb-xa),16,6);ctx.fill();ctx.restore();if(b>10)arrow(ctx,xb-2,y+10,xb+4,y+10,col,1,{head:6});};
    bar(W.sys,ty+24,0,5,K.app);const e=end();bar(W.agree,ty+52,S.start?(S.start==="day1"?0:5):null,e,e!=null&&e<=8?K.good:K.bad);
    if(t<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.layer,()=>S.d?W.layers[S.d-1]:"–"],[W.read.owners,()=>String(new Set(W.owners.slice(0,S.d).flat()).size)],
    [W.read.ready,()=>S.d===N&&S.ask&&S.start?(ready()?W.read.yes:W.read.no):"–"]]};};

/* ---------- 11 · A map people and agents can read: the navigator's test ---------- */
// Six elements of the map, each with its ID, name and owner. The map's checks mark what's missing; fixing confirms what has an owner,
// and CAP-009 stays flagged. The map's agent answers four questions, citing the element it read, or saying what it can't know.
PLAY.navigator=(Lb,api)=>{const W=Lb.w,E=W.els,S={ran:false,fixed:false,q:null,t:-1e5};
  const miss=e=>!e[3]?null:(S.fixed&&e[3]!=="owner")?null:e[3],fails=()=>S.ran?E.filter(miss).length:null;
  const r1=api.group();api.btn(r1,W.runB,()=>{S.ran=true;S.t=performance.now();api.kick(900);api.say(S.fixed?W.msg.fixed:W.msg.ran,S.fixed?"ok":"warn");api.reach("checks");},"go");
  api.btn(r1,W.fixB,()=>{if(!S.ran){api.say(W.msg.fixNo,"warn");return;}S.fixed=true;S.t=performance.now();api.kick(900);api.say(W.msg.fixed,"ok");api.reach("fixed");});
  const ansK=k=>k==="code"&&!S.fixed?"codeNo":k==="use"&&!S.fixed?"useNo":k;
  const r2=api.group(W.askL);api.seg(r2,W.qs.map(q=>[q[0],q[1]]),null,k=>{S.q=k;S.t=performance.now();api.kick(900);const a=ansK(k),honest=a==="gen"||a==="codeNo"||a==="useNo";
    api.say(W.ans[a],honest?null:"ok");api.reach(honest?"honest":"cite");},W.askL);
  const lay=lw=>{const m=12,o={lw,m};o.ey=10;o.rh=76;o.ay=o.ey+E.length*(o.rh+6)+8;o.h=o.ay+88+8;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.net);const m=o.m,W2=o.lw-m*2,t=eo(since(now,S.t)/700),q=S.q?W.qs.find(x=>x[0]===S.q):null,cited=q?q[2]:null;
    E.forEach((e,i)=>{const y=o.ey+i*(o.rh+6),ms=S.ran?miss(e):null,hot=cited===e[0],col=ms?K.bad:hot?K.gold:S.ran?K.good:K.app;
      card(ctx,m,y,W2,o.rh,col,null,{glow:hot?14:ms?8:3});const pw=pill(ctx,m+10,y+8,e[0],col,{size:12.5});
      const tg=ms?fill(W.missing,{m:W.mtypes[ms]}):"",tw2=ms?TW(ctx,tg,12.5,800)+4:0;
      if(ms)line1(ctx,tg,m+W2-18-tw2,y+23,tw2,12.5,{w:800,align:"right",color:rgbaS(K.bad,1)});
      line1(ctx,e[1],m+12,y+46,W2-24,13,{w:700});line1(ctx,W.ownerL+": "+e[2],m+12,y+66,W2-24,12.5,{w:600,color:rgbaS(K.soft,1)});
      if(S.ran)mark(ctx,m+W2-4,y+4,ms?"no":"ok");});
    card(ctx,m,o.ay,W2,88,K.mot,W.agent,{glow:q?10:3,size:12.5});
    lines(ctx,q?q[1]:"–",m+12,o.ay+42,W2-24,{size:13,max:2,color:rgbaS(K.ink,q?0.4+0.6*t:0.5)});
    if(q){const a=ansK(q[0]),hon=a==="gen"||a==="codeNo"||a==="useNo";line1(ctx,(hon?"? ":"→ ")+(hon?"":cited),m+12,o.ay+78,W2-24,12.5,{w:800,color:rgbaS(hon?K.gold:K.good,t)});}
    if(t<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.fail,()=>S.ran?String(fails()):"–"],[W.read.cited,()=>{if(!S.q)return"–";const a=ansK(S.q);return a==="gen"||a==="codeNo"||a==="useNo"?"–":W.qs.find(x=>x[0]===S.q)[2];}]]};};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"ea-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","ea-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"ea-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"ea-tab-"+Lb.id,"aria-controls":"ea-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
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
// One picture for each film's situations, from its words (pics): a title, and its three rows on the way down, each joined to the
// next, then the film's key line, drawn in gold once the situation is answered (S.done).
const VCOL={pile:K.mot,fit:K.ret,chain:K.mot,survive:K.str,first:K.bus,cross:K.inf,place:K.app,skipper:K.tec,rule:K.mot,walk:K.net,navigator:K.net};
const vrows=(ctx,o,now,q,S)=>{const p=PK[q.vis.k],c=VCOL[q.vis.k]||K.app,m=12,t=GO(S,now),W2=o.lw-m*2;ground(ctx,o.lw,o.h,c);
  pill(ctx,m,10,p.t,c,{size:13,max:W2});p.rows.forEach((r,i)=>{const y=46+i*42;card(ctx,m+i*10,y,W2-i*10,34,c,r,{glow:4,size:13});if(i)arrow(ctx,m+8+(i-1)*10,y-7,m+8+i*10,y,K.soft,0.7,{head:5});});
  const ky=46+p.rows.length*42;line1(ctx,p.key,m,ky+16,W2,13.5,{w:800,color:rgbaS(t>0?K.gold:K.soft,t>0?0.4+0.6*t:0.85)});if(t>0&&t<1&&S.vis)S.vis.kick(60);};
vrows.h=()=>46+3*42+28;
Object.keys(VCOL).forEach(k=>VIS[k]=vrows);
})();
