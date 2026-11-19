/* Learning Data: Governance principles. The labs (Take it apart) and the scenarios (Make the call) of the whole series, the prologue
   (film 0) and its ten films, from one engine, copied from Data that moves' (assets/data-that-moves/learn.js): the series' labs page
   and scenarios page load a film's bundle (off-the-shelf, for its parts: glass, T, withA, rr, tw), the words (learn.en.js or
   learn.es.js, which set window.GVL), and this file.
   Every lab is a playground (kind "play"), one for each film, as the author set on 18 November 2026: the visitor switches, picks and
   presses, and watches what happens; each playground has three to five experiments (w.goals), each ticked when the visitor makes it
   happen, and its end once all are ticked. Each playground's own rules are in PLAY below, its words in the pack.
   The scenarios are the series' evaluation, twelve choices, their options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them). Each has one picture, a card of what the situation holds (VIS.rows).
   The series' first part shows papers and people, never code, file paths or tool screens: so do its playgrounds.
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its words stay
   big enough to read on a phone. Things move and settle, or jump to where they end when the visitor asks for reduced motion, and every
   change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films), both from
   site-tools/build_series.py. Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments)
   and "quiz" (answers by scenario number); path.js paints the course bar. The prologue is film 0, and is named so, not numbered. */
(()=>{"use strict";
const L=window.GVL,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-data-governance";
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
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).filter(k=>+k>0).length||10,filmN=n=>n===0?U.prologue:fill(U.filmN,{n,of:NF});

/* ---------- drawing, with the films' parts ---------- */
const DRAW=typeof glass==="function"&&typeof T==="function"&&typeof withA==="function"&&typeof rr==="function"&&typeof tw==="function";
const TP=Math.PI*2,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lp=(a,b,t)=>a+(b-a)*t;
const eo=u=>1-Math.pow(1-cl(u,0,1),3),ei=u=>{u=cl(u,0,1);return u<0.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;};
const rgb=s=>{const n=parseInt(String(s).slice(1),16);return[n>>16&255,n>>8&255,n&255];};
// the colours: ink, soft ink, right, wrong, gold (governance's decisions), and the films' own (Finance yellow, the platform's blue)
const K={ink:[236,243,255],soft:[160,178,205],good:[120,240,170],bad:[255,112,100],gold:[255,209,102],hr:[255,150,200],fin:[255,226,122],
  plat:[120,200,255],bronze:[232,162,107],hot:[90,220,255],warm:[255,176,64],cold:[160,178,255],arch:[150,222,196]};
const rgbaS=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")",mixC=(a,b,t)=>[lp(a[0],b[0],t),lp(a[1],b[1],t),lp(a[2],b[2],t)];
const TW=(ctx,s,z,wt)=>tw(ctx,String(s),z,wt||700);
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/data-governance.js)
const MISS=window.GVL_MISS=new Set();
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
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab gv-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls gv-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"gv-goals","aria-label":U.goals}),end=h("div",{class:"gv-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"gv-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"gv-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm gv-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"gv-goalbox"},h("p",{class:"gv-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"gv-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}


// a card with a title and a line under it, and a mark on its corner where o.mark says so
function node(ctx,x,y,w,hh,col,title,sub,o){o=o||{};card(ctx,x,y,w,hh,col,title,{glow:o.glow==null?6:o.glow,dash:o.dash,a:o.a,size:o.size||13.5,tint:o.tint});
  if(sub)lines(ctx,sub,x+12,y+40,w-24,{size:o.subSize||12.5,max:o.max||2,w:600,color:o.subCol||rgbaS(K.soft,1)});if(o.mark)mark(ctx,x+w-4,y+4,o.mark);}
// a piece on its way from one point to another, at u (0 to 1)
function travel(ctx,x0,y0,x1,y1,u,w,hh,s,col,o){if(u<=0)return;const v=ei(u);tile(ctx,lp(x0,x1,v)-w/2,lp(y0,y1,v)-hh/2,w,hh,s,col,o);}
// how far a moment has run: 0 before it starts, 1 once it's done
const run=(now,t0,ms)=>t0==null?0:cl(since(now,t0)/ms,0,1);
const later=(fn,ms)=>setTimeout(fn,RM()?0:ms);

/* ---------- 0 · The same problem, everywhere: add it up by Monday ---------- */
// A bank's board asks what it could lose if another bank fails. Four business lines each hold part of the answer, under their own
// name for the same bank. With no shared names, the total can't be added up; with no owner, nobody can say which figure to trust.
// A year later a new system arrives: a one-off project has ended, so it brings its own names; governance that lasts keeps them one.
PLAY.hub=(Lb,api)=>{const W=Lb.w,S={names:false,owner:false,fix:"project",ask:null,res:null,year:null,yres:null};
  const r1=api.group(W.fixL);
  api.toggle(r1,W.namesT,false,v=>{S.names=v;api.say(v?W.msg.namesOn:W.msg.namesOff);});
  api.toggle(r1,W.ownerT,false,v=>{S.owner=v;api.say(v?W.msg.ownerOn:W.msg.ownerOff);});
  const r2=api.group(W.howL);api.seg(r2,W.hows,S.fix,k=>{S.fix=k;api.say(W.msg[k]);},W.howL);
  const total=(ls,names)=>ls.reduce((a,l)=>a+(names||l.cust===W.bank?l.amt:0),0);
  const r3=api.group();
  api.btn(r3,W.askB,()=>{S.ask=performance.now();S.year=null;S.res={names:S.names,owner:S.owner};api.kick(2600);api.say(W.msg.asking);
    const t0=S.ask;later(()=>{if(S.ask!==t0)return;const r=S.res;
      if(!r.names){api.say(fill(W.msg.noNames,{n:W.lines.length-1}),"no");}
      else if(!r.owner){api.say(W.msg.noOwner,"warn");api.reach("names");}
      else{api.say(fill(W.msg.sum,{t:total(W.lines,true)}),"ok");api.reach("names");api.reach("owner");api.reach("sum");}api.refresh();},2000);},"go");
  api.btn(r3,W.yearB,()=>{if(!S.res||!S.res.names||!S.res.owner){api.say(W.msg.yearFirst,"warn");return;}S.year=performance.now();S.yres=S.fix;api.kick(2400);
    const t0=S.year;later(()=>{if(S.year!==t0)return;if(S.yres==="gov"){api.say(fill(W.msg.yearGov,{t:total(W.lines.concat([W.newLine]),true)}),"ok");api.reach("lasts");}else api.say(W.msg.yearProject,"no");api.refresh();},1800);});
  const lay=(lw)=>{const m=12,o={lw,m},cols=lw>=460?3:2,gw=(lw-m*2-(cols-1)*8)/cols;o.board={x:m,y:12,w:lw-m*2,h:62};o.hub={y:86,h:34};
    const all=W.lines.concat([W.newLine]);o.cells=all.map((l,i)=>({x:m+(i%cols)*(gw+8),y:132+Math.floor(i/cols)*86,w:gw,h:78}));o.h=132+Math.ceil(all.length/cols)*86+4;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const u=run(now,S.ask,1800),yu=run(now,S.year,1600),r=S.res||{},showNew=S.year!=null;
    const ls=W.lines.concat(showNew?[W.newLine]:[]),useNames=l=>l===W.newLine?S.yres==="gov":S.names;
    // the board, and its total
    const done=S.ask!=null&&u>=1,both=r.names&&r.owner,lost=showNew&&yu>=1&&S.yres!=="gov";
    card(ctx,o.board.x,o.board.y,o.board.w,o.board.h,K.gold,W.boardName,{glow:done&&both?14:6});
    const val=!done?W.boardWait:!r.names?fill(W.boardPart,{t:total(W.lines,false)}):!r.owner?W.boardTwo:lost?fill(W.boardPart,{t:total(W.lines,true)}):fill(W.boardSum,{t:total(showNew&&yu>=1?ls:W.lines,true)});
    line1(ctx,val,o.board.x+12,o.board.y+48,o.board.w-24,15,{w:800,color:rgbaS(!done?K.soft:both&&!lost?K.good:K.bad,1)});
    // the hub: an owner who answers for the risk data, or nobody
    const hw=Math.min(300,o.lw-o.m*2);chip(ctx,(o.lw-hw)/2,o.hub.y,hw,o.hub.h,S.owner?W.hubOwner:W.hubNone,S.owner?K.gold:K.soft,{size:13,glow:S.owner?10:0,dash:!S.owner});
    ls.forEach((l,i)=>{const c=o.cells[i],isNew=l===W.newLine,a=isNew?ei(yu):1;if(a<=0.01)return;const same=useNames(l)||l.cust===W.bank;
      withA(ctx,a,()=>{card(ctx,c.x,c.y,c.w,c.h,isNew?K.warm:K.plat,l.name,{glow:4,size:13.5});
        chip(ctx,c.x+10,c.y+30,c.w-20,22,useNames(l)?W.bank:l.cust,same?K.good:K.bad,{size:12.5,tint:0.12});
        const two=l.alt&&!(isNew?false:r.owner)&&S.ask!=null;line1(ctx,two?fill(W.twoFig,{a:l.amt,b:l.alt}):fill(W.fig,{a:l.amt}),c.x+12,c.y+70,c.w-24,12.5,{w:700,color:rgbaS(two?K.warm:K.ink,0.95)});});
      // each line's figure travels up to the board, and lands, or doesn't
      const uu=isNew?yu:u;if(uu>0&&uu<1){const ok=same&&(!l.alt||(isNew?true:r.owner));travel(ctx,c.x+c.w/2,c.y,o.lw/2,o.board.y+o.board.h,uu,96,22,fill(W.fig,{a:l.amt}),ok?K.good:K.bad,{size:12});}});};
  return{S,lay,draw,readouts:[[W.read.total,()=>S.res&&S.res.names&&S.res.owner?fill(W.boardSum,{t:total(W.lines,true)}):S.res?W.read.none:"–"],
    [W.read.names,()=>String(S.names?1:new Set(W.lines.map(l=>l.cust)).size)],[W.read.who,()=>S.owner?W.read.owner:W.read.nobody]]};};

/* ---------- 1 · Off the shelf: a rule, a copy where the work is, and someone who checks ---------- */
// Monday's new meaning of award travels from Mei, through Jun's build, to two reports. The surgical checklist's three parts decide
// whether it reaches both: one agreed rule (who decides), a copy where the work happens (it reaches the build), and someone who
// checks each step (the census report waits for the new meaning). And Yusuf's first move: a thirty-fifth policy, or a question.
PLAY.shelf=(Lb,api)=>{const W=Lb.w,S={rule:false,copy:false,check:false,move:null,go:null,res:null};
  const r1=api.group(W.partsL);
  api.toggle(r1,W.ruleT,false,v=>{S.rule=v;api.say(v?W.msg.ruleOn:W.msg.ruleOff);});
  api.toggle(r1,W.copyT,false,v=>{S.copy=v;api.say(v?W.msg.copyOn:W.msg.copyOff);});
  api.toggle(r1,W.checkT,false,v=>{S.check=v;api.say(v?W.msg.checkOn:W.msg.checkOff);});
  const r2=api.group(W.moveL);api.seg(r2,W.moves,null,k=>{S.move=k;S.moveT=performance.now();api.kick(1400);api.say(W.msg[k],k==="ask"?"ok":"warn");if(k==="ask")api.reach("listen");},W.moveL);
  const r3=api.group();
  const res=()=>{const reach=S.rule&&S.copy,agree=reach&&S.check;return{reach,agree,census:agree?W.newN:W.oldN,draft:W.newN};};
  api.btn(r3,W.goB,()=>{S.go=performance.now();S.res=res();api.kick(3000);api.say(W.msg.going);const t0=S.go;
    later(()=>{if(S.go!==t0)return;const r=S.res;api.say(!S.rule?W.msg.noRule:!S.copy?W.msg.noCopy:!S.check?W.msg.noCheck:W.msg.all,r.agree?"ok":"no");
      if(r.reach)api.reach("reach");if(r.agree)api.reach("agree");api.refresh();},2400);},"go");
  const lay=(lw)=>{const m=12,o={lw,m},n=lw>=560?4:2,sw=(lw-m*2-(n-1)*10)/n,rows=4/n;o.steps=W.steps.map((s,i)=>({x:m+(i%n)*(sw+10),y:90+Math.floor(i/n)*72,w:sw,h:64}));o.shelf={x:m,y:12,w:lw-m*2,h:38};
    const y=90+rows*72;o.rep={y:y+4,h:60};o.say={y:y+76};o.h=o.say.y+(lw>=460?2:4)*34+6;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const u=run(now,S.go,2400),r=S.res;
    // the shelf: thirty-four policies, or thirty-five
    const nPol=S.move==="write"?35:34;card(ctx,o.shelf.x,o.shelf.y,o.shelf.w,o.shelf.h,K.soft,"",{glow:0,tint:0.04});
    const bw=Math.max(3,(o.shelf.w-150)/36);for(let i=0;i<nPol;i++){const fresh=i===34,a=fresh?ei(run(now,S.moveT,700)):1;withA(ctx,a,()=>{ctx.fillStyle=rgbaS(fresh?K.warm:K.soft,fresh?0.9:0.55);rr(ctx,o.shelf.x+10+i*bw,o.shelf.y+8,bw-1.5,22,1.5);ctx.fill();});}
    line1(ctx,fill(W.shelfN,{n:nPol}),o.shelf.x+o.shelf.w-136,o.shelf.y+25,126,12.5,{w:700,align:"right",color:rgbaS(K.soft,1)});
    // the steps, Mei to the reports, and what reaches each
    const lit=[S.rule,S.rule&&S.copy,S.rule&&S.copy,S.rule&&S.copy&&S.check];
    o.steps.forEach((c,i)=>{const st=W.steps[i],on=r?[r.reach||S.rule,r.reach,r.reach,r.agree][i]&&u>=(i+1)/4:false;
      card(ctx,c.x,c.y,c.w,c.h,i===0?K.gold:i<3?K.plat:K.fin,st[0],{glow:on?12:4,size:13});lines(ctx,st[1],c.x+10,c.y+40,c.w-18,{size:12,max:2,w:600,color:rgbaS(K.soft,1)});
      const nx=o.steps[i+1];if(nx&&nx.y===c.y)arrow(ctx,c.x+c.w+1,c.y+c.h/2,nx.x-2,c.y+c.h/2,lit[i+1]?K.gold:K.soft,0.9,{head:5,lw:1.5});});
    if(S.check){pill(ctx,o.lw/2,58,W.checker,K.good,{align:"center",size:12});}else line1(ctx,W.nocheck,o.m,74,o.lw-o.m*2,12.5,{w:600,align:"center",color:rgbaS(K.soft,1)});
    if(r&&u<1){const k=Math.min(3,Math.floor(u*4)),c=o.steps[k],c2=o.steps[Math.min(3,k+1)],f=u*4-k;travel(ctx,c.x+c.w/2,c.y+c.h/2,c2.x+c2.w/2,c2.y+c2.h/2,f,110,22,W.change,K.gold,{size:12});}
    // the two reports
    const rw=(o.lw-o.m*2-8)/2;[[W.census,r&&u>=1?r.census:"–"],[W.draft,r&&u>=1?r.draft:"–"]].forEach(([n,v],i)=>{const x=o.m+i*(rw+8),agree=r&&u>=1&&r.agree;
      card(ctx,x,o.rep.y,rw,o.rep.h,K.fin,n,{glow:4,size:13});line1(ctx,v,x+12,o.rep.y+48,rw-24,16,{w:800,color:rgbaS(r&&u>=1?(agree?K.good:K.bad):K.soft,1)});});
    // what each person said, once Yusuf asks
    if(S.move==="ask"){const a=ei(run(now,S.moveT,900)),f=flow(ctx,W.slow,o.lw-o.m*2,12.5,6,28);withA(ctx,a,()=>f.pos.forEach((p,i)=>chip(ctx,o.m+p.x,o.say.y+p.y,p.w,p.h,W.slow[i],K.gold,{size:12.5,tint:0.1})));}
    else line1(ctx,S.move==="write"?W.wrote:W.notYet,o.m,o.say.y+20,o.lw-o.m*2,12.5,{w:600,color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.census,()=>S.res?S.res.census:"–"],[W.read.draft,()=>S.res?S.res.draft:"–"],[W.read.shelf,()=>String(S.move==="write"?35:34)]]};};

/* ---------- 2 · Who decides: the cord within reach ---------- */
// A change request about award's meaning goes where the register sends it: into an email thread, or to Mei by name. With time to
// answer, she decides in days; with an area's decision book, what she decided is found where the work is. And a new report for
// Planning either leaves with its owner line blank, or comes back until someone answers for it.
PLAY.cord=(Lb,api)=>{const W=Lb.w,S={reg:"tbc",req:false,book:false,time:false,cr:null,crRes:null,rep:null,repRes:null};
  const r1=api.group(W.regL);api.seg(r1,W.regs,S.reg,k=>{S.reg=k;api.say(W.msg[k]);api.kick(300);},W.regL);
  const r2=api.group(W.withL);
  api.toggle(r2,W.reqT,false,v=>{S.req=v;api.say(v?W.msg.reqOn:W.msg.reqOff);});
  api.toggle(r2,W.bookT,false,v=>{S.book=v;api.say(v?W.msg.bookOn:W.msg.bookOff);});
  api.toggle(r2,W.timeT,false,v=>{S.time=v;api.say(v?W.msg.timeOn:W.msg.timeOff);});
  const r3=api.group();
  api.btn(r3,W.crB,()=>{S.cr=performance.now();S.crRes={reg:S.reg,book:S.book,time:S.time};api.kick(2600);api.say(W.msg.crGo);const t0=S.cr;
    later(()=>{if(S.cr!==t0)return;const c=S.crRes;if(c.reg==="tbc"){api.say(W.msg.crThread,"no");return;}
      api.reach("asked");const bits=[W.msg.crMei,c.time?W.msg.crQuick:W.msg.crSlow,c.book?W.msg.crBook:W.msg.crMail];api.say(bits.join(" "),c.time&&c.book?"ok":"warn");
      if(c.time)api.reach("quick");if(c.book)api.reach("logged");api.refresh();},1900);},"go");
  api.btn(r3,W.repB,()=>{S.rep=performance.now();S.repRes={req:S.req};api.kick(2400);const t0=S.rep;api.say(W.msg.repGo);
    later(()=>{if(S.rep!==t0)return;if(S.repRes.req){api.say(W.msg.repBack,"ok");api.reach("signed");}else api.say(W.msg.repOut,"no");api.refresh();},1800);});
  const lay=(lw)=>{const m=12,o={lw,m},wide=lw>=520,hw=wide?(lw-m*2-10)/2:lw-m*2;o.jun={x:m,y:12,w:lw-m*2,h:40};o.mail={x:m,y:110,w:hw,h:80};o.mei={x:wide?m+hw+10:m,y:wide?110:200,w:hw,h:80};
    const y=o.mei.y+90;o.book={x:m,y,w:lw-m*2,h:62};o.rep={x:m,y:y+72,w:lw-m*2,h:110};o.h=o.rep.y+o.rep.h+8;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const u=run(now,S.cr,1900),c=S.crRes;
    chip(ctx,o.jun.x,o.jun.y,o.jun.w,o.jun.h,W.request,K.plat,{size:13});
    // where it goes: an email thread, or Mei by name
    const toMail=c&&c.reg==="tbc",toMei=c&&c.reg==="named",owner=S.reg==="named"?W.meiName:W.tbcName;
    node(ctx,o.mail.x,o.mail.y,o.mail.w,o.mail.h,K.soft,W.mailName,toMail&&u>0.4?fill(W.replies,{n:Math.round(lp(1,23,cl((u-0.4)/0.6,0,1)))}):W.mailSub,{glow:toMail?10:0,dash:true,mark:toMail&&u>=1?"no":null});
    node(ctx,o.mei.x,o.mei.y,o.mei.w,o.mei.h,S.reg==="named"?K.gold:K.bad,owner,toMei&&u>=1?(c.time?W.meiQuick:W.meiSlow):W.meiSub,{glow:toMei?12:4,dash:S.reg!=="named",mark:toMei&&u>=1?(c.time?"ok":null):null});
    arrow(ctx,o.lw/2,o.jun.y+o.jun.h+4,o.lw/2,o.mail.y-30,K.soft,0.8,{head:6});
    chip(ctx,o.lw/2-90,o.mail.y-30,180,24,S.reg==="named"?W.slip:W.noSlip,S.reg==="named"?K.gold:K.soft,{size:12,dash:S.reg!=="named"});
    if(c&&u<1){const d=toMei?o.mei:o.mail;travel(ctx,o.lw/2,o.mail.y-6,d.x+d.w/2,d.y+20,u,90,22,W.crShort,K.plat,{size:12});}
    // the decision book
    const logged=toMei&&u>=1&&c.book;card(ctx,o.book.x,o.book.y,o.book.w,o.book.h,logged?K.gold:K.soft,W.bookName,{glow:logged?10:0,dash:!S.book});
    line1(ctx,logged?W.bookLine:toMei&&u>=1?W.bookMail:W.bookEmpty,o.book.x+12,o.book.y+48,o.book.w-24,12.5,{w:700,color:rgbaS(logged?K.good:K.soft,1)});
    // Jun's new report, and its sign-off sheet
    const ru=run(now,S.rep,1800),rr0=S.repRes;card(ctx,o.rep.x,o.rep.y,o.rep.w,o.rep.h,K.fin,W.repName,{glow:4});
    line1(ctx,W.sheetLine,o.rep.x+12,o.rep.y+46,o.rep.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    const signed=rr0&&rr0.req&&ru>=1,blank=rr0&&!rr0.req;const tx=o.rep.x+12,tw2=Math.min(220,o.rep.w-24);
    chip(ctx,tx,o.rep.y+56,tw2,26,signed?W.clara:blank?W.blank:S.req?W.required:W.blank,signed?K.good:blank&&ru>=1?K.bad:K.soft,{size:12.5,dash:!signed});
    line1(ctx,signed?W.repSigned:blank&&ru>=1?W.repNobody:rr0&&rr0.req&&ru<1?W.repReturned:"",o.rep.x+12,o.rep.y+100,o.rep.w-24,12.5,{w:700,color:rgbaS(signed?K.good:K.bad,1)});};
  return{S,lay,draw,readouts:[[W.read.owner,()=>S.reg==="named"?W.read.mei:W.read.tbc],[W.read.answer,()=>!S.crRes?"–":S.crRes.reg==="tbc"?W.read.never:S.crRes.time?W.read.week:W.read.days],[W.read.report,()=>!S.repRes?"–":S.repRes.req?W.read.clara:W.read.nobody]]};};

/* ---------- 3 · One word, one home: five glossaries, one to keep ---------- */
// Five places define award, three ways. Pick the home, make each other place read from it or keep its own words, and change the word
// on Monday: what reads from the home changes with it, the rest drift. With a nightly check, the change notice lists what the word
// touches and who owns each part.
PLAY.gloss=(Lb,api)=>{const W=Lb.w,G=W.places,S={home:"tool",read:{},check:false,mon:null,monRes:null,changed:false};G.forEach(g=>S.read[g.key]=false);
  const r1=api.group(W.homeL);api.seg(r1,W.homes,S.home,k=>{S.home=k;api.say(W.msg[k],k==="plat"?"ok":"warn");if(k==="plat")api.reach("home");api.kick(800);},W.homeL);
  G.forEach(g=>{const r=api.group(g.name);api.seg(r,W.ways,"own",k=>{S.read[g.key]=k==="read";api.say(fill(k==="read"?(S.home==="plat"?W.msg.reads:W.msg.readsTool):W.msg.keeps,{g:g.short}));api.kick(800);},g.name);});
  const r2=api.group();api.toggle(r2,W.checkT,false,v=>{S.check=v;api.say(v?W.msg.checkOn:W.msg.checkOff);});
  // what each place says: the home's meaning where it reads from the home (and can: the 2019 tool can't be read by the other tools)
  const homeSays=()=>S.home==="plat"?(S.changed?"new":"old"):"old";
  const says=g=>S.read[g.key]&&(S.home==="plat"||g.canTool)?homeSays():g.own;
  const meanings=()=>new Set([homeSays()].concat(G.map(says))).size;
  api.btn(r2,W.monB,()=>{S.mon=performance.now();S.changed=true;S.monRes={check:S.check};api.kick(2600);api.say(W.msg.monGo);const t0=S.mon;
    later(()=>{if(S.mon!==t0)return;const n=meanings();const bits=[n===1?W.msg.oneMeaning:fill(W.msg.many,{n})];
      bits.push(S.monRes.check&&S.home==="plat"?W.msg.notice:W.msg.noNotice);api.say(bits.join(" "),n===1&&S.monRes.check&&S.home==="plat"?"ok":"warn");
      if(n===1&&S.home==="plat")api.reach("agree");if(S.monRes.check&&S.home==="plat")api.reach("notice");api.refresh();},2000);},"go");
  const lay=(lw)=>{const m=12,o={lw,m},nc=lw>=520?2:1,cw=(lw-m*2-(nc-1)*10)/nc;o.home={x:m,y:12,w:lw-m*2,h:96};const ind=nc===1?14:0;o.rail=nc===1;o.cells=G.map((g,i)=>({x:m+ind+(i%nc)*(cw+10),y:140+Math.floor(i/nc)*80,w:cw-ind,h:70}));
    o.notice={x:m,y:140+Math.ceil(G.length/nc)*80+4,w:lw-m*2,h:nc===1?110:92};o.h=o.notice.y+o.notice.h+8;return o;};
  const col={old:K.plat,new:K.gold,deg:K.bad,micro:K.warm};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const u=run(now,S.mon,2000);const hm=homeSays();
    node(ctx,o.home.x,o.home.y,o.home.w,o.home.h,K.gold,S.home==="plat"?W.platName:W.toolName,S.home==="plat"?W.platSub:W.toolSub,{glow:12});
    chip(ctx,o.home.x+12,o.home.y+62,Math.min(240,o.home.w-24),24,W.mean[hm],col[hm],{size:12.5});
    G.forEach((g,i)=>{const c=o.cells[i],rd=S.read[g.key]&&(S.home==="plat"||g.canTool),s=says(g),stale=S.changed&&s!==hm;
      if(rd){const pu=S.mon!=null&&u<1?u:1,ac=pu<1?K.gold:K.good,ad=pu<1?[4,4]:null;
        // one column: a rail down the left edge, so no arrow crosses another card's words
        if(o.rail){const rx=o.home.x+3,cy=c.y+c.h/2;arrow(ctx,rx,o.home.y+o.home.h+2,rx,cy,ac,0.85,{head:0.01,dash:ad});arrow(ctx,rx,cy,c.x-2,cy,ac,0.85,{head:5});}
        else arrow(ctx,lp(o.home.x+o.home.w/2,c.x+c.w/2,0.05),o.home.y+o.home.h+2,c.x+c.w/2,c.y-4,ac,0.85,{head:6,dash:ad});}
      card(ctx,c.x,c.y,c.w,c.h,rd?K.good:K.soft,g.name,{glow:rd?8:0,dash:!rd,size:13});
      chip(ctx,c.x+10,c.y+32,Math.min(260,c.w-20),26,(S.read[g.key]&&!rd)?W.cant:W.mean[s],(S.read[g.key]&&!rd)?K.bad:col[s],{size:12,mark:S.changed&&u>=1?(stale?"no":"ok"):null});});
    // the change notice: what the word touches, and who owns each part
    const nn=S.monRes&&S.monRes.check&&S.home==="plat"&&u>=1;card(ctx,o.notice.x,o.notice.y,o.notice.w,o.notice.h,nn?K.gold:K.soft,W.noticeName,{glow:nn?10:0,dash:!nn});
    lines(ctx,nn?W.noticeLine:S.changed&&u>=1?W.noticeNone:W.noticeWait,o.notice.x+12,o.notice.y+42,o.notice.w-24,{size:12.5,max:4,w:600,color:rgbaS(nn?K.ink:K.soft,0.95)});};
  return{S,lay,draw,readouts:[[W.read.meanings,()=>String(meanings())],[W.read.home,()=>S.home==="plat"?W.read.plat:W.read.tool]]};};

/* ---------- 4 · Who may see it: a purpose and a date ---------- */
// Clara's access to the learner table: to her by name or to a group, the whole table or only what planning needs, with an end date
// or none. Each column carries a class; masks follow it by label, or are added table by table. Then life happens: she moves job,
// the date comes, a new table is built with the email in it.
PLAY.access=(Lb,api)=>{const W=Lb.w,C=W.cols,S={to:"name",sees:"all",end:false,cls:false,prot:"table",grant:null,g:null,moved:false,ended:false,nt:null,ntRes:null};
  const r1=api.group(W.toL);api.seg(r1,W.tos,S.to,k=>{S.to=k;api.say(W.msg[k]);},W.toL);
  const r2=api.group(W.seesL);api.seg(r2,W.seess,S.sees,k=>{S.sees=k;api.say(W.msg[k]);},W.seesL);
  const r3=api.group(W.withL);
  api.toggle(r3,W.endT,false,v=>{S.end=v;api.say(v?W.msg.endOn:W.msg.endOff);});
  api.toggle(r3,W.clsT,false,v=>{S.cls=v;api.say(v?W.msg.clsOn:W.msg.clsOff);api.kick(400);});
  const r4=api.group(W.protL);api.seg(r4,W.prots,S.prot,k=>{S.prot=k;api.say(W.msg[k]);},W.protL);
  const classOf=c=>c.key==="cred"?(S.cls?"direct":"none"):c.cls;
  const shown=(c,g)=>g.sees==="all"||classOf(c)!=="direct";
  const r5=api.group();
  api.btn(r5,W.grantB,()=>{S.grant=performance.now();S.g={to:S.to,sees:S.sees,end:S.end,cls:S.cls};S.moved=false;S.ended=false;api.kick(1400);
    const leak=C.filter(c=>shown(c,S.g)&&(c.cls==="direct"||(c.key==="cred"))).length;
    if(S.g.sees==="all")api.say(W.msg.grantAll,"no");else if(!S.g.cls)api.say(W.msg.grantCode,"warn");else{api.say(W.msg.grantNeed,"ok");api.reach("need");}
    void leak;},"go");
  api.btn(r5,W.moveB,()=>{if(!S.g){api.say(W.msg.first,"warn");return;}S.moved=true;S.moveT=performance.now();api.kick(1200);
    if(S.g.to==="group"){api.say(W.msg.moveGroup,"ok");api.reach("job");}else api.say(W.msg.moveName,"no");});
  api.btn(r5,W.decB,()=>{if(!S.g){api.say(W.msg.first,"warn");return;}S.decT=performance.now();api.kick(1200);
    if(S.g.end){S.ended=true;api.say(W.msg.decEnd,"ok");api.reach("ends");}else api.say(W.msg.decOn,"no");});
  api.btn(r5,W.newB,()=>{S.nt=performance.now();S.ntRes={prot:S.prot};api.kick(1600);if(S.prot==="label"){api.say(W.msg.newLabel,"ok");api.reach("label");}else api.say(W.msg.newTable,"no");});
  const lay=(lw,ctx)=>{const m=12,o={lw,m},n=C.length,cols=lw>=460?3:2,cw=(lw-m*2-24-(cols-1)*6)/cols,rows=Math.ceil(n/cols);
    o.cols=cols;o.cw=cw;o.tab={x:m,y:12,w:lw-m*2,h:34+rows*58+6};o.cla={x:m,y:o.tab.y+o.tab.h+10,w:lw-m*2,h:34+rows*30+38};o.nt={x:m,y:o.cla.y+o.cla.h+10,w:lw-m*2,h:74};o.h=o.nt.y+o.nt.h+8;return o;};
  const cpos=(o,box,i,hh,dy)=>({x:box.x+12+(i%o.cols)*(o.cw+6),y:box.y+34+Math.floor(i/o.cols)*hh+(dy||0)});
  const ccol={direct:K.bad,pseudo:K.warm,none:K.good};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.good);
    // the learner table: each column and its class
    card(ctx,o.tab.x,o.tab.y,o.tab.w,o.tab.h,K.plat,W.tabName,{glow:4});
    C.forEach((c,i)=>{const p=cpos(o,o.tab,i,58),k=classOf(c);chip(ctx,p.x,p.y,o.cw,24,c.name,K.plat,{size:12.5});chip(ctx,p.x,p.y+28,o.cw,20,W.cls[k],ccol[k],{size:12,tint:0.12,glow:0});});
    // what Clara sees
    const g=S.g,a=g?ei(run(now,S.grant,700)):0,off=S.ended||(S.moved&&g&&g.to==="group");
    const who=g?(g.to==="group"?W.group:W.clara)+(S.moved?" · "+W.inFinance:""):W.noGrant;
    card(ctx,o.cla.x,o.cla.y,o.cla.w,o.cla.h,K.gold,who,{glow:g&&!off?10:0,dash:!g||off});
    if(g)withA(ctx,a*(off?0.35:1),()=>C.forEach((c,i)=>{const p=cpos(o,o.cla,i,30),vis=shown(c,g);chip(ctx,p.x,p.y,o.cw,24,vis?c.val:"★★★★",vis?(c.cls==="direct"||c.key==="cred"&&!g.cls?K.bad:K.good):K.soft,{size:12.5,tint:0.1})}));
    line1(ctx,!g?"":off?W.ended:g.end?W.until:W.noEnd,o.cla.x+12,o.cla.y+o.cla.h-12,o.cla.w-24,12.5,{w:700,color:rgbaS(!g?K.soft:off||g.end?K.good:K.bad,1)});
    // a new table, built tomorrow, with the email in it
    const nu=run(now,S.nt,900),nr=S.ntRes;card(ctx,o.nt.x,o.nt.y,o.nt.w,o.nt.h,nr?K.plat:K.soft,W.ntName,{glow:nr?6:0,dash:!nr});
    if(nr)withA(ctx,ei(nu),()=>{const w2=Math.min(220,o.nt.w-24);chip(ctx,o.nt.x+12,o.nt.y+34,w2,26,nr.prot==="label"?W.emailStars:W.emailShown,nr.prot==="label"?K.good:K.bad,{size:12.5});
      if(o.nt.w-w2-36>80)line1(ctx,nr.prot==="label"?W.byLabel:W.byTable,o.nt.x+w2+24,o.nt.y+52,o.nt.w-w2-36,12.5,{w:600,color:rgbaS(K.soft,1)});});
    else line1(ctx,W.ntWait,o.nt.x+12,o.nt.y+52,o.nt.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.sees,()=>!S.g?"–":S.g.sees==="all"?W.read.all:W.read.need],[W.read.ends,()=>!S.g?"–":S.g.end?W.read.dec:W.read.never],
    [W.read.newT,()=>!S.ntRes?"–":S.ntRes.prot==="label"?W.read.stars:W.read.shown]]};};

/* ---------- 5 · Rules that run: whose level? ---------- */
// The night's update runs a hundred and sixty checks. Two matter here: the learning team's enrolments with no email, and Planning's
// match with the census report. Set each level, give the checks owners, and run a usual night, a bad one, and a night when Planning's
// number is off: the scorecard turns amber or red, and the update runs or keeps yesterday's numbers.
PLAY.level=(Lb,api)=>{const W=Lb.w,S={own:false,lv:"any",pl:"warn",night:null,res:null};
  const r1=api.group();api.toggle(r1,W.ownT,false,v=>{S.own=v;api.say(v?W.msg.ownOn:W.msg.ownOff);api.kick(300);});
  const r2=api.group(W.lvL);api.seg(r2,W.lvs,S.lv,k=>{S.lv=k;api.say(W.msg[k]);},W.lvL);
  const r3=api.group(W.plL);api.seg(r3,W.pls,S.pl,k=>{S.pl=k;api.say(W.msg["pl_"+k]);},W.plL);
  const night=(kind,n)=>{S.night=performance.now();const lv=S.lv,pl=S.pl;let state="ok",cell="pass",pcell="pass",msg,tone;
    if(kind==="email"){const over=lv==="any"?n>0:lv==="five"?n>5:false,warn=n>0&&lv!=="never";state=over?"held":"ok";cell=over?"fail":warn?"warn":"pass";
      if(n<=5){msg=lv==="any"?W.msg.n2any:lv==="five"?W.msg.n2five:W.msg.n2never;tone=lv==="five"?"ok":lv==="any"?"no":"warn";}
      else{msg=lv==="never"?W.msg.n6never:S.own?W.msg.n6own:W.msg.n6none;tone=lv==="never"?"no":S.own?"ok":"warn";}
      if(n<=5&&lv==="five")api.reach("calm");if(n>5&&over&&S.own)api.reach("held");}
    else{const stop=pl==="stop";state=stop?"held":"ok";pcell=stop?"fail":"warn";msg=stop?(S.own?W.msg.diffStop:W.msg.diffStopNone):W.msg.diffWarn;tone=stop?(S.own?"ok":"warn"):"no";if(stop&&S.own)api.reach("census");}
    S.res={kind,n,state,cell,pcell,own:S.own};api.kick(1600);api.say(msg,tone);};
  const r4=api.group();
  api.btn(r4,W.n2B,()=>night("email",2),"go");api.btn(r4,W.n6B,()=>night("email",6));api.btn(r4,W.diffB,()=>night("diff",3));
  const lay=(lw)=>{const m=12,o={lw,m};o.stack=lw<460;o.lead=o.stack?0:130;o.rh=o.stack?52:40;o.cw=(lw-m*2-24-o.lead)/W.dims.length;o.card={x:m,y:12,w:lw-m*2,h:34+24+W.areas.length*o.rh+6};
    o.upd={x:m,y:o.card.y+o.card.h+10,w:lw-m*2,h:62};o.iss={x:m,y:o.upd.y+o.upd.h+10,w:lw-m*2,h:44};o.h=o.iss.y+o.iss.h+8;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.warm);const r=S.res,u=run(now,S.night,900);
    card(ctx,o.card.x,o.card.y,o.card.w,o.card.h,K.warm,W.cardName,{glow:4});
    W.dims.forEach((d,j)=>line1(ctx,d,o.card.x+12+o.lead+j*o.cw,o.card.y+50,o.cw-4,12,{w:700,align:"center",color:rgbaS(K.soft,1)}));
    W.areas.forEach((a,i)=>{const y=o.card.y+58+i*o.rh+(o.stack?16:0);line1(ctx,S.own?a.name:W.unknown,o.card.x+12,o.stack?y-1:y+21,o.stack?o.card.w-24:o.lead-6,12,{w:700,color:rgbaS(S.own?K.ink:K.soft,0.95)});
      W.dims.forEach((d,j)=>{const x=o.card.x+12+o.lead+j*o.cw;let st="pass",lbl=a.cells[j];
        if(r&&u>0.5){if(a.key==="learn"&&j===0)st=r.kind==="email"?r.cell:"pass";if(a.key==="plan"&&j===2)st=r.kind==="diff"?r.pcell:"pass";}
        const cc=st==="fail"?K.bad:st==="warn"?K.warm:K.good;if(!lbl)return;chip(ctx,x+2,y+4,o.cw-4,28,st==="fail"?W.failL:lbl,cc,{size:12,tint:st==="pass"?0.1:0.25,glow:st==="pass"?0:8});});});
    // the night's update: it runs, or keeps yesterday's numbers
    const held=r&&r.state==="held"&&u>=1;card(ctx,o.upd.x,o.upd.y,o.upd.w,o.upd.h,held?K.bad:K.plat,W.updName,{glow:r?8:2});
    const bw=o.upd.w-24;ctx.save();ctx.fillStyle=rgbaS(K.soft,0.25);rr(ctx,o.upd.x+12,o.upd.y+34,bw,10,5);ctx.fill();ctx.fillStyle=rgbaS(held?K.bad:K.good,0.9);rr(ctx,o.upd.x+12,o.upd.y+34,bw*(r?(held?Math.min(u,0.55):u):0),10,5);ctx.fill();ctx.restore();
    line1(ctx,!r?W.updWait:u<1?W.updRun:held?W.updHeld:W.updDone,o.upd.x+12,o.upd.y+o.upd.h-6,bw,12.5,{w:700,color:rgbaS(!r?K.soft:held?K.bad:K.good,1)});
    // the issue, and whose it is
    const iss=r&&u>=1&&(r.cell!=="pass"||r.pcell!=="pass");card(ctx,o.iss.x,o.iss.y,o.iss.w,o.iss.h,iss?(r.own?K.gold:K.bad):K.soft,W.issName,{glow:iss?8:0,dash:!iss,right:o.iss.w*0.55});
    line1(ctx,!iss?W.issNone:r.own?(r.kind==="email"?W.issLearn:W.issPlan):W.issNobody,o.iss.x+o.iss.w*0.42,o.iss.y+27,o.iss.w*0.58-12,12.5,{w:700,align:"right",color:rgbaS(!iss?K.soft:r.own?K.good:K.bad,1)});};
  return{S,lay,draw,readouts:[[W.read.upd,()=>!S.res?"–":S.res.state==="held"?W.read.held:W.read.ran],[W.read.whose,()=>!S.res?"–":S.res.own?W.read.owner:W.read.nobody]]};};

/* ---------- 6 · Fixed where it starts: follow it back ---------- */
// A week of sign-ups flows from the form, through the learning platform and the data team's clean-up, to the wallet and two other
// readers. Fix the form, correct the old emails and the clean-up can go; keep a check that should never fail, and the owner hears
// first when the form breaks; watch each table's usual shape, and a surprise no rule names is caught.
PLAY.source=(Lb,api)=>{const W=Lb.w,E=W.emails,S={form:false,old:false,clean:true,check:false,watch:false,wk:null,res:null,ev:null,evRes:null};
  const r1=api.group(W.atL);api.toggle(r1,W.formT,false,v=>{S.form=v;api.say(v?W.msg.formOn:W.msg.formOff);});api.toggle(r1,W.oldT,false,v=>{S.old=v;api.say(v?W.msg.oldOn:W.msg.oldOff);});
  const r2=api.group(W.downL);api.toggle(r2,W.cleanT,true,v=>{S.clean=v;api.say(v?W.msg.cleanOn:W.msg.cleanOff);api.kick(300);});
  const r3=api.group(W.guardL);api.toggle(r3,W.checkT,false,v=>{S.check=v;api.say(v?W.msg.checkOn:W.msg.checkOff);});api.toggle(r3,W.watchT,false,v=>{S.watch=v;api.say(v?W.msg.watchOn:W.msg.watchOff);});
  const r4=api.group();
  api.btn(r4,W.weekB,()=>{S.wk=performance.now();S.ev=null;S.res={form:S.form,old:S.old,clean:S.clean};api.kick(3000);api.say(W.msg.weekGo);const t0=S.wk;
    later(()=>{if(S.wk!==t0)return;const r=S.res,bits=[];
      bits.push(r.form?W.msg.wkRight:W.msg.wkBad);
      const walletOk=r.clean||(r.form&&r.old);bits.push(walletOk?(r.clean?W.msg.wkMop:W.msg.wkNoMop):r.form?W.msg.wkOld:W.msg.wkTwo);
      api.say(bits.join(" "),r.form&&r.old&&!r.clean?"ok":walletOk?"warn":"no");if(r.form)api.reach("right");if(r.form&&r.old&&!r.clean)api.reach("mop");api.refresh();},2400);},"go");
  api.btn(r4,W.breakB,()=>{S.ev=performance.now();S.evRes={kind:"break",check:S.check,clean:S.clean};api.kick(1800);const t0=S.ev;
    later(()=>{if(S.ev!==t0)return;if(S.evRes.check){api.say(W.msg.brCheck,"ok");api.reach("first");}else api.say(S.evRes.clean?W.msg.brHidden:W.msg.brTwo,"no");},1200);});
  api.btn(r4,W.badgeB,()=>{S.ev=performance.now();S.evRes={kind:"badge",watch:S.watch};api.kick(1800);const t0=S.ev;
    later(()=>{if(S.ev!==t0)return;if(S.evRes.watch){api.say(W.msg.bdWatch,"ok");api.reach("shape");}else api.say(W.msg.bdPass,"no");},1200);});
  const lay=(lw)=>{const m=12,o={lw,m};o.form={x:m,y:12,w:lw-m*2,h:80};o.plat={x:m,y:116,w:lw-m*2,h:80};o.clean={x:m,y:220,w:lw-m*2,h:40};
    const n=W.readers.length,rw=(lw-m*2-(n-1)*8)/n;o.rd=W.readers.map((s,i)=>({x:m+i*(rw+8),y:296,w:rw,h:62}));o.h=296+62+10;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.arch);const u=run(now,S.wk,2400),r=S.res,ev=S.evRes,eu=run(now,S.ev,1200);
    const broken=ev&&ev.kind==="break",formOk=S.form&&!broken;
    node(ctx,o.form.x,o.form.y,o.form.w,o.form.h,formOk?K.good:K.warm,W.formName,null,{glow:formOk?8:4});line1(ctx,formOk?W.formFixed:broken?W.formBroken:W.formPlain,o.form.x+12,o.form.y+42,o.form.w-24,12.5,{w:700,color:rgbaS(formOk?K.good:K.warm,1)});
    if(S.check)pill(ctx,o.form.x+12,o.form.y+50,ev&&ev.kind==="break"&&ev.check&&eu>=1?W.checkFail:W.checkStays,ev&&ev.kind==="break"&&ev.check&&eu>=1?K.bad:K.good,{size:12});
    node(ctx,o.plat.x,o.plat.y,o.plat.w,o.plat.h,K.plat,W.platName,null,{glow:4});
    if(S.watch)pill(ctx,o.plat.x+12,o.plat.y+50,ev&&ev.kind==="badge"&&eu>=1?W.shapeAlert:W.shapeOn,ev&&ev.kind==="badge"&&eu>=1?K.warm:K.good,{size:12});
    line1(ctx,ev&&ev.kind==="badge"&&eu>=1?W.badgeLine:W.platSub,o.plat.x+12,o.plat.y+42,o.plat.w-24,12.5,{w:700,color:rgbaS(ev&&ev.kind==="badge"&&eu>=1?K.warm:K.soft,1)});
    card(ctx,o.clean.x,o.clean.y,o.clean.w,o.clean.h,S.clean?K.soft:K.good,S.clean?W.cleanName:W.cleanGone,{glow:0,dash:true,size:13});
    arrow(ctx,o.lw/2,o.form.y+o.form.h+3,o.lw/2,o.plat.y-3,K.soft,0.8,{head:6});arrow(ctx,o.lw/2,o.plat.y+o.plat.h+3,o.lw/2,o.clean.y-3,K.soft,0.8,{head:6});
    o.rd.forEach((c,i)=>{arrow(ctx,o.lw/2,o.clean.y+o.clean.h+3,c.x+c.w/2,c.y-3,K.soft,0.7,{head:5});
      const wallet=i===0,ok=!r||u<1?null:r.form&&(r.old||!wallet&&true)?"ok":wallet&&r.clean?"ok":"no";
      node(ctx,c.x,c.y,c.w,c.h,K.gold,W.readers[i],r&&u>=1?(ok==="ok"?W.rdOk:wallet?W.rdTwo:W.rdClean):null,{glow:4,size:13,subSize:12,mark:ok});});
    // a week's emails, each as typed: those with a capital or a space glow red until they're right
    if(r&&u<1)E.forEach((e,i)=>{const d=i*0.07,v=cl((u-d)/0.6,0,1);if(v<=0)return;const bad=e.bad&&!r.form,y=lp(o.form.y+o.form.h,o.rd[0].y-14,v),x=o.m+12+((i*97)%(o.lw-o.m*2-130));
      const fixed=bad&&r.clean&&y>o.clean.y+o.clean.h;tile(ctx,x,y-11,118,22,bad&&!fixed?e.t:e.ok,bad&&!fixed?K.bad:K.good,{size:12});});};
  return{S,lay,draw,readouts:[[W.read.typed,()=>!S.res?"–":S.res.form?W.read.right:W.read.third],[W.read.clean,()=>S.clean?W.read.every:W.read.gone]]};};

/* ---------- 7 · Change without surprises: who it reaches ---------- */
// Jun's change to what the reports count: relabel microcredentials, or add a mark. The record of who uses what decides what the
// impact note lists; telling people in their words decides who's ready; and it goes in at next month's board, or when every owner
// says they're ready. Put it in, and see what breaks, who's surprised, and whether Wednesday's draft counts the new way.
PLAY.change=(Lb,api)=>{const W=Lb.w,US=W.users,S={how:"relabel",rec:false,tell:false,when:"board",go:null,res:null};
  const r1=api.group(W.howL);api.seg(r1,W.hows,S.how,k=>{S.how=k;api.say(W.msg[k]);api.kick(300);},W.howL);
  const r2=api.group(W.withL);api.toggle(r2,W.recT,false,v=>{S.rec=v;api.say(v?W.msg.recOn:W.msg.recOff);api.kick(300);});api.toggle(r2,W.tellT,false,v=>{S.tell=v;api.say(v?W.msg.tellOn:W.msg.tellOff);});
  const r3=api.group(W.whenL);api.seg(r3,W.whens,S.when,k=>{S.when=k;api.say(W.msg[k]);},W.whenL);
  const reaches=(u,how)=>how==="relabel"||u.uses;
  const outcome=()=>{const how=S.how,listed=US.filter(u=>reaches(u,how)&&(S.rec||u.asked)),missed=US.filter(u=>reaches(u,how)&&!(S.rec||u.asked));
    const broke=US.filter(u=>reaches(u,how)&&how==="relabel"&&u.breaks),surprised=US.filter(u=>reaches(u,how)&&!u.asked&&(!S.tell||!(S.rec||u.asked)));
    return{how,listed,missed,broke,surprised,late:S.when==="board"};};
  const r4=api.group();
  api.btn(r4,W.goB,()=>{S.go=performance.now();S.res=outcome();api.kick(2600);api.say(W.msg.going);const t0=S.go;
    later(()=>{if(S.go!==t0)return;const r=S.res,bits=[];
      bits.push(r.missed.length?fill(W.msg.missed,{n:r.missed.length}):fill(W.msg.listed,{n:r.listed.length}));
      bits.push(r.broke.length?fill(W.msg.broke,{n:r.broke.length}):W.msg.whole);
      bits.push(r.surprised.length?fill(W.msg.surprised,{w:r.surprised.map(u=>u.short).join(", ")}):W.msg.noSurprise);
      bits.push(r.late?W.msg.late:W.msg.inTime);
      const good=!r.missed.length&&!r.broke.length&&!r.surprised.length&&!r.late;api.say(bits.join(" "),good?"ok":"warn");
      if(!r.missed.length)api.reach("note");if(!r.broke.length)api.reach("whole");if(!r.surprised.length)api.reach("told");if(!r.late)api.reach("draft");api.refresh();},2000);},"go");
  const lay=(lw)=>{const m=12,o={lw,m},cols=lw>=480?3:2,cw=(lw-m*2-(cols-1)*10)/cols;o.tab={x:m+(lw-m*2)*0.15,y:12,w:(lw-m*2)*0.7,h:44};o.note={y:66};
    o.us=US.map((u,i)=>({x:m+(i%cols)*(cw+10),y:118+Math.floor(i/cols)*78,w:cw,h:70}));o.tl={y:118+Math.ceil(US.length/cols)*78+6};o.h=o.tl.y+58;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const r=S.res,u=run(now,S.go,2000);
    chip(ctx,o.tab.x,o.tab.y,o.tab.w,o.tab.h,W.tabName,K.plat,{size:13.5,glow:8});
    lines(ctx,S.how==="relabel"?W.relabelLine:W.markLine,o.m,o.note.y+16,o.lw-o.m*2,{size:12.5,max:2,w:700,align:"center",color:rgbaS(K.gold,1)});
    US.forEach((us,i)=>{const c=o.us[i],re=reaches(us,S.how),listed=re&&(S.rec||us.asked);if(re){const ac=listed?K.gold:K.bad,ad=listed?null:[4,4],bx=c.x-4,by=o.note.y+42,cy=c.y+16;
        // along a bus above the cards, then down the gap at each card's left, so no line crosses another card
        arrow(ctx,o.lw/2,by,bx,by,ac,0.75,{head:0.01,dash:ad});arrow(ctx,bx,by,bx,cy,ac,0.75,{head:0.01,dash:ad});arrow(ctx,bx,cy,c.x-1,cy,ac,0.75,{head:4});}});
    US.forEach((us,i)=>{const c=o.us[i],re=reaches(us,S.how),listed=re&&(S.rec||us.asked);
      if(false)arrow(ctx,o.lw/2,o.tab.y+o.tab.h+2,c.x+c.w/2,c.y-3,listed?K.gold:K.bad,0.75,{head:6,dash:listed?null:[4,4]});
      let st=null,sub=fill(W.ownerL,{o:us.owner});if(r&&u>=1&&reaches(us,r.how)){const br=r.broke.includes(us),su=r.surprised.includes(us);st=br||su?"no":"ok";sub=br?W.breaks:su?W.surprisedL:W.readyL;}
      node(ctx,c.x,c.y,c.w,c.h,re?(listed?K.gold:K.bad):K.soft,us.name,sub,{glow:re?6:0,dash:!re,a:re?1:0.55,size:13,subSize:12,mark:st});});
    // the week: Wednesday's draft, and next month's board
    const tx=o.m,tw2=o.lw-o.m*2,y=o.tl.y+20;ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx,y);ctx.lineTo(tx+tw2,y);ctx.stroke();ctx.restore();
    const at=[[0.05,W.today],[0.32,W.wed],[0.9,W.board]];at.forEach(([f,s],i)=>{const x=tx+tw2*f;ctx.save();ctx.fillStyle=rgbaS(i===1?K.gold:K.soft,1);ctx.beginPath();ctx.arc(x,y,4,0,TP);ctx.fill();ctx.restore();
      line1(ctx,s,cl(x-60,tx,tx+tw2-120),y+22,120,12,{w:700,align:i===0?"left":i===2?"right":"center",color:rgbaS(i===1?K.gold:K.soft,1)});});
    if(r){const f=r.late?0.9:0.05,x=tx+tw2*f*Math.min(1,u*1.2);chip(ctx,cl(x-34,tx,tx+tw2-68),y-30,68,20,W.inL,r.late?K.bad:K.good,{size:12});}};
  return{S,lay,draw,readouts:[[W.read.reach,()=>String(US.filter(u=>reaches(u,S.how)).length)],[W.read.listed,()=>String(US.filter(u=>reaches(u,S.how)&&(S.rec||u.asked)).length)],
    [W.read.when,()=>S.when==="board"?W.read.month:W.read.today]]};};

/* ---------- 8 · A product with an owner: who stands behind it ---------- */
// Planning's count of learners near an award, with its card filled in or not: an owner, a service level, a place in the catalogue,
// a status. On census day the build runs late; Anil looks for the count; a change adds a table other teams read.
PLAY.product=(Lb,api)=>{const W=Lb.w,S={owner:false,sla:false,cat:false,status:"draft",one:false,ev:null,res:null};
  const r1=api.group(W.cardL);
  api.toggle(r1,W.ownerT,false,v=>{S.owner=v;api.say(v?W.msg.ownerOn:W.msg.ownerOff);api.kick(300);});
  api.toggle(r1,W.slaT,false,v=>{S.sla=v;api.say(v?W.msg.slaOn:W.msg.slaOff);api.kick(300);});
  api.toggle(r1,W.catT,false,v=>{S.cat=v;api.say(v?W.msg.catOn:W.msg.catOff);api.kick(300);});
  const r2=api.group(W.statusL);api.seg(r2,W.statuses,S.status,k=>{S.status=k;api.say(W.msg[k]);api.kick(300);},W.statusL);
  const r3=api.group(W.checkL);api.toggle(r3,W.oneT,false,v=>{S.one=v;api.say(v?W.msg.oneOn:W.msg.oneOff);});
  const r4=api.group();
  const ev=(kind,ms,fn)=>{S.ev=performance.now();S.res={kind,owner:S.owner,sla:S.sla,cat:S.cat,status:S.status,one:S.one};api.kick(ms+600);const t0=S.ev;later(()=>{if(S.ev!==t0)return;fn(S.res);api.refresh();},ms);};
  api.btn(r4,W.lateB,()=>{api.say(W.msg.lateGo);ev("late",2200,r=>{if(r.owner&&r.sla){api.say(W.msg.lateOwner,"ok");api.reach("answer");}else api.say(r.owner?W.msg.lateNoSla:W.msg.lateNobody,"no");});},"go");
  api.btn(r4,W.findB,()=>{ev("find",1200,r=>{if(!r.cat)api.say(W.msg.findNo,"no");else if(r.status!=="active"||!r.owner)api.say(r.status!=="active"?W.msg.findDraft:W.msg.findNoOwner,"warn");else{api.say(W.msg.findOk,"ok");api.reach("found");}});});
  api.btn(r4,W.newB,()=>{ev("new",1200,r=>{if(r.one){api.say(W.msg.newBack,"ok");api.reach("back");}else api.say(W.msg.newIn,"no");});});
  const lay=(lw)=>{const m=12,o={lw,m};o.card={x:m,y:12,w:lw-m*2,h:34+W.fields.length*28+8};o.ev={x:m,y:o.card.y+o.card.h+10,w:lw-m*2,h:132};o.h=o.ev.y+o.ev.h+8;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.arch);const r=S.res,u=run(now,S.ev,r&&r.kind==="late"?2200:1200);
    card(ctx,o.card.x,o.card.y,o.card.w,o.card.h,K.arch,W.cardName,{glow:8,right:110});pill(ctx,o.card.x+o.card.w-12,o.card.y+8,W.statusV[S.status],S.status==="active"?K.good:K.warm,{align:"right",size:12});
    const val={for:W.forV,owner:S.owner?W.ownerV:"",ready:S.sla?W.readyV:"",ask:S.cat?W.askV:"",ver:W.verV},lw2=o.lw>=460?150:96;
    W.fields.forEach(([k,lbl],i)=>{const y=o.card.y+34+i*28,v=val[k];line1(ctx,lbl,o.card.x+12,y+18,lw2-16,12.5,{w:700,color:rgbaS(K.soft,1)});
      if(v)line1(ctx,v,o.card.x+lw2,y+18,o.card.w-lw2-12,12.5,{w:700,color:rgbaS(K.ink,0.95)});else{ctx.save();ctx.strokeStyle=rgbaS(K.bad,0.8);ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(o.card.x+lw2,y+20);ctx.lineTo(o.card.x+o.card.w-16,y+20);ctx.stroke();ctx.restore();}});
    // what happens: census day, Anil's search, or a change
    const e=o.ev;card(ctx,e.x,e.y,e.w,e.h,r?K.gold:K.soft,!r?W.evWait:r.kind==="late"?W.lateName:r.kind==="find"?W.findName:W.newName,{glow:r?6:0,dash:!r});
    if(!r)return;
    if(r.kind==="late"){if(r.owner&&r.sla){const steps=W.lateSteps;steps.forEach((s,i)=>{const a=cl(u*steps.length-i,0,1);withA(ctx,a,()=>chip(ctx,e.x+12,e.y+32+i*30,e.w-24,24,s,K.good,{size:12.5}));});}
      else{const names=W.circle,cx=e.x+e.w/2,cy=e.y+82,R=Math.min(44,e.w/5),k=Math.floor(u*6)%3;names.forEach((n,i)=>{const an=-Math.PI/2+i*TP/3,x=cx+Math.cos(an)*R*2.2,y=cy+Math.sin(an)*R*0.9;
        chip(ctx,x-55,y-12,110,24,n,i===k?K.warm:K.soft,{size:12.5,glow:i===k?8:0});});line1(ctx,r.owner?W.nobodyKnew:W.nobody,e.x+12,e.y+e.h-8,e.w-24,12.5,{w:700,align:"center",color:rgbaS(K.bad,1)});}}
    else if(r.kind==="find"){const ok=r.cat&&r.owner&&r.status==="active";withA(ctx,ei(u),()=>lines(ctx,!r.cat?W.findNoL:ok?W.findOkL:W.findDraftL,e.x+12,e.y+48,e.w-24,{size:13,max:3,w:700,color:rgbaS(ok?K.good:K.warm,1)}));}
    else withA(ctx,ei(u),()=>lines(ctx,r.one?W.newBackL:W.newInL,e.x+12,e.y+48,e.w-24,{size:13,max:3,w:700,color:rgbaS(r.one?K.good:K.bad,1)}));};
  return{S,lay,draw,readouts:[[W.read.owner,()=>S.owner?W.read.clara:W.read.nobody],[W.read.status,()=>W.statusV[S.status]],[W.read.found,()=>S.cat?W.read.yes:W.read.no]]};};

/* ---------- 9 · An agent that checks: people decide ---------- */
// Anil adds a learner's date of birth at night, with nothing marking it personal. Who checks the change, what the agent may do, whether
// the rules are written plainly, and whether it reads with its own identity, from counts and samples: run the night, and read the
// note at eight, or see what goes wrong.
PLAY.agent=(Lb,api)=>{const W=Lb.w,S={who:"jun",list:false,may:"note",own:false,go:null,res:null};
  const r1=api.group(W.whoL);api.seg(r1,W.whos,S.who,k=>{S.who=k;api.say(W.msg[k]);},W.whoL);
  const r2=api.group(W.mayL);api.seg(r2,W.mays,S.may,k=>{S.may=k;api.say(W.msg["may_"+k]);},W.mayL);
  const r3=api.group(W.withL);api.toggle(r3,W.listT,false,v=>{S.list=v;api.say(v?W.msg.listOn:W.msg.listOff);});api.toggle(r3,W.ownT,false,v=>{S.own=v;api.say(v?W.msg.ownOn:W.msg.ownOff);});
  const r4=api.group();
  api.btn(r4,W.goB,()=>{S.go=performance.now();S.res={who:S.who,list:S.list,may:S.may,own:S.own};api.kick(3200);api.say(W.msg.going);const t0=S.go;
    later(()=>{if(S.go!==t0)return;const r=S.res;
      if(r.who==="jun")api.say(W.msg.junWait,"no");
      else if(!r.list)api.say(W.msg.noList,"no");
      else if(r.may==="fix")api.say(W.msg.fixed,"warn");
      else if(r.may==="approve")api.say(W.msg.approved,"no");
      else{api.say(r.own?W.msg.noteOwn:W.msg.noteValues,r.own?"ok":"warn");api.reach("wait");api.reach("decide");if(r.own)api.reach("values");}api.refresh();},2600);},"go");
  const lay=(lw)=>{const m=12,o={lw,m};o.tl={y:14};o.chg={x:m,y:64,w:lw-m*2,h:44};o.note={x:m,y:120,w:lw-m*2,h:34+5*24+10};o.h=o.note.y+o.note.h+10;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const r=S.res,u=run(now,S.go,2600);
    // the night: six in the evening, three, eight
    const tx=o.m+10,tw2=o.lw-o.m*2-20,y=o.tl.y+10;ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx,y);ctx.lineTo(tx+tw2,y);ctx.stroke();ctx.restore();
    W.times.forEach((s,i)=>{const x=tx+tw2*(i/(W.times.length-1));ctx.save();ctx.fillStyle=rgbaS(K.soft,1);ctx.beginPath();ctx.arc(x,y,4,0,TP);ctx.fill();ctx.restore();line1(ctx,s,cl(x-50,o.m,o.lw-o.m-100),y+24,100,12,{w:700,align:i===0?"left":i===W.times.length-1?"right":"center",color:rgbaS(K.soft,1)});});
    if(r){const x=tx+tw2*u;ctx.save();ctx.fillStyle=rgbaS(K.gold,1);ctx.beginPath();ctx.arc(x,y,6,0,TP);ctx.fill();ctx.restore();}
    const marked=r&&u>=1&&((r.who==="agent"&&r.list&&r.may!=="approve"));
    chip(ctx,o.chg.x,o.chg.y,o.chg.w,o.chg.h,marked?W.chgMarked:W.chgName,marked?K.good:K.bad,{size:13,glow:8});
    // what's waiting at eight: a note, a queue, or something done that nobody decided
    const n=o.note;let title=W.noteWait,rows=[],col=K.soft;
    if(r&&u>0.6){if(r.who==="jun"){title=W.queueName;rows=W.queue;col=K.warm;}else if(!r.list){title=W.nothingName;rows=W.nothing;col=K.warm;}
      else if(r.may==="fix"){title=W.fixName;rows=W.fixRows;col=K.warm;}else if(r.may==="approve"){title=W.apprName;rows=W.apprRows;col=K.bad;}
      else{title=W.noteName;rows=W.noteRows.map(x=>x[0]==="count"?[x[1],r.own?W.countOwn:W.countValues]:x.slice(1));col=K.gold;}}
    card(ctx,n.x,n.y,n.w,n.h,col,title,{glow:r?8:0,dash:!r});const lw2=n.w>=460?150:106,a=r?cl((u-0.6)/0.4,0,1):0;
    withA(ctx,a,()=>rows.forEach((row,i)=>{const yy=n.y+38+i*24;if(Array.isArray(row)){line1(ctx,row[0],n.x+12,yy+14,lw2-16,12.5,{w:700,color:rgbaS(K.soft,1)});line1(ctx,row[1],n.x+lw2,yy+14,n.w-lw2-12,12.5,{w:700,color:rgbaS(row[1]===W.countValues?K.bad:K.ink,0.95)});}
      else line1(ctx,row,n.x+12,yy+14,n.w-24,12.5,{w:700,color:rgbaS(K.ink,0.95)});}));};
  return{S,lay,draw,readouts:[[W.read.waits,()=>!S.res?"–":S.res.who==="agent"&&S.res.list?W.read.nobody:W.read.anil],[W.read.decides,()=>!S.res?"–":S.res.who==="agent"&&S.res.list&&S.res.may!=="note"?W.read.agent:W.read.people],
    [W.read.dates,()=>!S.res?"–":S.res.who==="agent"&&S.res.list&&S.res.may==="note"&&!S.res.own?W.read.some:S.res.who==="agent"&&S.res.list&&S.res.may!=="approve"?W.read.none:W.read.anyone]]};};

/* ---------- 10 · Teachers of data: the mime before the fine ---------- */
// A new rule, every column other teams read says what it holds, over eight weeks: say why first, agree it with the stewards, link a
// page from each warning, keep office hours, and block from day one or warn until the first of December. Weeks run in the picture:
// how many columns keep the rule, how many stops, how many copies made around the check. A year later, kept up or left to fade.
PLAY.habit=(Lb,api)=>{const W=Lb.w,N=W.cols,S={why:false,agree:false,page:false,hours:false,start:"block",keep:false,go:null,res:null,yr:null,yres:null};
  const r1=api.group(W.beforeL);
  api.toggle(r1,W.whyT,false,v=>{S.why=v;api.say(v?W.msg.whyOn:W.msg.whyOff);});api.toggle(r1,W.agreeT,false,v=>{S.agree=v;api.say(v?W.msg.agreeOn:W.msg.agreeOff);});
  api.toggle(r1,W.pageT,false,v=>{S.page=v;api.say(v?W.msg.pageOn:W.msg.pageOff);});api.toggle(r1,W.hoursT,false,v=>{S.hours=v;api.say(v?W.msg.hoursOn:W.msg.hoursOff);});
  const r2=api.group(W.startL);api.seg(r2,W.starts,S.start,k=>{S.start=k;api.say(W.msg[k]);},W.startL);
  // each week, a share of the columns not yet described gets described; a stop on a column not described is a person held up, who
  // copies the data somewhere the check can't see unless a page or a person helps them fix it
  const sim=()=>{const a=0.1+(S.why?0.15:0)+(S.agree?0.15:0)+(S.page?0.12:0)+(S.hours?0.08:0),wk=[];let c=0.3,copies=0,stops=0;
    for(let w=1;w<=8;w++){c=1-(1-c)*(1-a);const blocks=S.start==="block"||w>=W.dateWeek,left=Math.round((1-c)*N),st=blocks?left:0;
      const cp=Math.round(st*(S.page?0.15:0.5)*(S.hours?0.4:1));copies+=cp;if(w===W.dateWeek)stops=st;wk.push({c,st,warn:blocks?0:left,cp});}
    return{wk,copies,dateStops:stops,before:wk[W.dateWeek-2].c};};
  const r3=api.group();
  api.btn(r3,W.goB,()=>{S.go=performance.now();S.yr=null;S.res=sim();S.res.start=S.start;api.kick(3800);api.say(W.msg.going);const t0=S.go;
    later(()=>{if(S.go!==t0)return;const r=S.res,bits=[fill(W.msg.kept,{p:Math.round(r.before*100)})];
      bits.push(r.copies?fill(W.msg.copies,{n:r.copies}):W.msg.noCopies);bits.push(r.start==="warn"?(r.dateStops?fill(W.msg.dateStops,{n:r.dateStops}):W.msg.nothingLeft):W.msg.blocked);
      api.say(bits.join(" "),r.before>=0.75&&!r.copies&&r.start==="warn"&&!r.dateStops?"ok":"warn");
      if(r.before>=0.75)api.reach("most");if(!r.copies)api.reach("around");if(r.start==="warn"&&!r.dateStops)api.reach("date");api.refresh();},3200);},"go");
  const r4=api.group(W.afterL);api.toggle(r4,W.keepT,false,v=>{S.keep=v;api.say(v?W.msg.keepOn:W.msg.keepOff);});
  api.btn(r4,W.yearB,()=>{if(!S.res){api.say(W.msg.yearFirst,"warn");return;}S.yr=performance.now();S.yres={keep:S.keep};api.kick(1800);const t0=S.yr;
    later(()=>{if(S.yr!==t0)return;if(S.yres.keep&&S.res.wk[7].c>=0.9){api.say(W.msg.yearKept,"ok");api.reach("lasts");}else api.say(S.yres.keep?W.msg.yearLow:W.msg.yearFade,"no");api.refresh();},1400);});
  const lay=(lw)=>{const m=12,o={lw,m};o.ch={x:m,y:12,w:lw-m*2,h:220};o.h=o.ch.y+o.ch.h+10;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const r=S.res,u=run(now,S.go,3200),c=o.ch;card(ctx,c.x,c.y,c.w,c.h,K.gold,W.chartName,{glow:4});
    const px=c.x+48,pw=c.w-62,py=c.y+58,ph=c.h-98,n=9,bw=pw/n;
    [0,0.5,1].forEach(f=>{const y=py+ph*(1-f);ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.25);ctx.beginPath();ctx.moveTo(px,y);ctx.lineTo(px+pw,y);ctx.stroke();ctx.restore();line1(ctx,Math.round(f*100)+"%",c.x+4,y+4,40,12,{w:700,align:"right",color:rgbaS(K.soft,1)});});
    // the first of December
    const dx=px+bw*(W.dateWeek+0.5);ctx.save();ctx.strokeStyle=rgbaS(K.gold,0.9);ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(dx,py-6);ctx.lineTo(dx,py+ph);ctx.stroke();ctx.restore();
    line1(ctx,W.dateL,cl(dx-60,c.x+8,c.x+c.w-128),py-10,120,12,{w:700,align:"center",color:rgbaS(K.gold,1)});
    for(let w=0;w<n;w++)line1(ctx,w===0?W.week0:String(w),px+bw*w,py+ph+18,bw,12,{w:700,align:"center",color:rgbaS(K.soft,1)});
    if(!r){lines(ctx,W.chartWait,px,py+ph/2,pw,{size:13,max:2,w:600,color:rgbaS(K.soft,1),align:"center"});return;}
    const shown=u*8,yrFade=S.yres&&!(S.yres.keep&&r.wk[7].c>=0.9)?ei(run(now,S.yr,1400)):0;
    const vals=[0.3].concat(r.wk.map(x=>x.c));vals.forEach((v,w)=>{if(w>shown+0.01)return;const a=w===0?1:cl(shown-w+1,0,1),vv=w===8?lp(v,0.45,yrFade):v,hh=ph*vv*a;
      ctx.save();ctx.fillStyle=rgbaS(vv>=0.75?K.good:K.warm,0.85);rr(ctx,px+bw*w+bw*0.18,py+ph-hh,bw*0.64,hh,3);ctx.fill();ctx.restore();
      const wk=r.wk[w-1];if(wk&&a>=1){if(wk.cp)mark(ctx,px+bw*w+bw/2,py+ph-hh-12,"no");}});
    line1(ctx,fill(W.legend,{c:r.copies}),c.x+12,c.y+c.h-10,c.w-24,12,{w:700,color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.kept,()=>!S.res?"–":Math.round(S.res.before*100)+"%"],[W.read.copies,()=>!S.res?"–":String(S.res.copies)],[W.read.stops,()=>!S.res?"–":String(S.res.start==="warn"?S.res.dateStops:S.res.wk[0].st)]]};};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"gv-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","gv-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"gv-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"gv-tab-"+Lb.id,"aria-controls":"gv-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
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
    const vis=DRAW&&f?stage(lw=>({lw,h:q.st?56+q.st.rows.length*32+12:190}),(ctx,o,now)=>f(ctx,o,now,q,S),q.alt||q.title):null;
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
  const fromHash=()=>{const m=(location.hash||"").match(/^#film-(\d+)$/);return m?+m[1]:-1;};
  window.addEventListener("hashchange",()=>{const n=fromHash();if(n>=0)setFilm(n);});Promise.resolve().then(()=>setFilm(fromHash()));}


/* ---------- the scenarios' picture: a card of what the situation holds ---------- */
// A kicker, and rows of a label and a value, each value in its tone (ok, warn, no, or plain). Once it's answered (S.done), the card
// glows gold.
const GO=(S,now)=>S.done?eo(since(now,S.done)/700):0;
VIS.rows=(ctx,o,now,q,S)=>{const st=q.st||{rows:[]},m=12,t=GO(S,now),tone={ok:K.good,warn:K.warm,no:K.bad};ground(ctx,o.lw,o.h,K.gold);
  card(ctx,m,10,o.lw-m*2,o.h-20,t>0?K.gold:K.plat,st.kicker,{glow:6+t*8});const lw2=o.lw>=460?Math.min(220,(o.lw-m*2)*0.42):(o.lw-m*2)*0.44;
  st.rows.forEach((r,i)=>{const y=10+36+i*32;chip(ctx,m+12,y,lw2-8,26,r[0],K.plat,{size:12.5,tint:0.08,glow:0});
    line1(ctx,r[1],m+12+lw2+4,y+18,o.lw-m*2-lw2-28,13,{w:700,color:rgbaS(tone[r[2]]||K.ink,0.96)});});};
VIS.rows.h=lw=>0;
})();
