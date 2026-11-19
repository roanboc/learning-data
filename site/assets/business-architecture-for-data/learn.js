/* Learning Data: Business architecture for data. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from
   one engine, copied from Data that moves' (site/assets/data-that-moves/learn.js): the series' labs page and scenarios page load a
   film's bundle (for its parts: glass, T, withA, rr, tw), the words (learn.en.js or learn.es.js, which set window.BA), and this file.
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
const L=window.BA,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-business-architecture-for-data";
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
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).length||5,filmN=n=>fill(U.filmN,{n,of:NF});

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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/business-architecture-for-data.js)
const MISS=window.BA_MISS=new Set();
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
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab ba-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls ba-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"ba-goals","aria-label":U.goals}),end=h("div",{class:"ba-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"ba-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"ba-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm ba-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"ba-goalbox"},h("p",{class:"ba-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"ba-foot"},again));}
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

/* ---------- 1 · What the business owns: the water and the channel ---------- */
// A ticket for all customers, by district, and three counts, each right about its own meaning. Who decides what the report counts:
// the data team picking one, the data team fixing its merged table, or the owners. Six jobs to sort between the business and the data
// team, the merged table to retire, and the ticket to close, with or without the person who asked checking the counts.
PLAY.own=(Lb,api)=>{const W=Lb.w,S={who:null,side:{},retired:false,ama:false,closed:null},G={};W.jobs.forEach(j=>S.side[j[0]]="dt");
  const r1=api.group(W.whoL);api.seg(r1,W.whos,null,k=>{S.who=k;api.kick(900);
    if(k==="owners"){api.say(W.msg.owners+" "+W.msg.agree,"ok");api.reach("agree");}else api.say(W.msg[k],"warn");},W.whoL);
  const r2=api.group(W.jobsL);W.jobs.forEach(([k,t])=>api.toggle(r2,t,false,v=>{S.side[k]=v?"biz":"dt";api.kick(800);api.say(fill(W.msg.job,{j:t,s:W.sides[S.side[k]]}));
    if(W.jobs.every(j=>S.side[j[0]]===j[2])){api.say(W.msg.split,"ok");api.reach("split");}}));
  const r3=api.group();
  api.btn(r3,W.retireB,()=>{if(S.who!=="owners"){api.say(W.msg.retireNo,"warn");return;}S.retired=true;api.kick(900);api.say(W.msg.retireOk,"ok");api.reach("retire");});
  api.toggle(r3,W.amaT,false,v=>{S.ama=v;api.say(v?W.msg.amaOn:W.msg.amaOff);});
  api.btn(r3,W.closeB,()=>{if(S.who!=="owners"){api.say(W.msg.closeNo,"warn");return;}S.closed=performance.now();api.kick(1200);
    if(S.ama){api.say(W.msg.closeOk,"ok");api.reach("check");}else api.say(W.msg.closeNoCheck,"warn");},"go");
  const N=W.nums,rep=()=>S.who==="pick"?N.acc:S.who==="fix"?N.merged:S.who==="owners"?W.both:"–",ret=()=>S.who==="owners"?W.both:S.who?N.cp:"–";
  const lay=lw=>{const m=12,o={lw,m,cw:(lw-m*2-10)/2};o.tk=12;o.cy=58;o.ry=o.cy+3*40+6;o.jy=o.ry+2*40+10;o.jh=34+W.jobs.length*40;o.h=o.jy+o.jh+12;return o;};
  // a row: its name on the left, its value on the right, the name given whatever room the value leaves
  const row=(ctx,x,y,w,a,b,col,o2)=>{const vw=Math.min(w*0.62,TW(ctx,b,13)+6);card(ctx,x,y,w,34,col,a,Object.assign({size:13,right:vw+6},o2));line1(ctx,b,x+w-12-vw,y+22,vw,13,{w:700,align:"right",color:rgbaS(o2&&o2.vc||K.ink,0.95)});};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.str);const m=o.m,W2=o.lw-m*2;let mv=false;
    const done=S.closed!=null;chip(ctx,m,o.tk,W2,36,W.ticket,done?K.good:K.gold,{size:14,glow:done?12:6,mark:done&&S.ama?"ok":null});
    W.counts.forEach(([a,b],i)=>{const y=o.cy+i*40,used=S.who==="pick"?i===0:S.who==="fix"?i===2:S.who==="owners"?i<2:false,gone=i===2&&S.retired;
      row(ctx,m,y,W2,a,gone?W.retired:b,used?K.gold:i===0?K.ret:i===1?K.net:K.soft,{glow:used?12:3,a:gone?0.45:1,vc:gone?K.soft:K.ink});});
    const ag=S.who==="owners";[[W.report,rep()],[W.ret,ret()]].forEach(([a,b],i)=>row(ctx,m,o.ry+i*40,W2,a,b,S.who?(ag?K.good:K.bad):K.soft,{glow:S.who?10:3}));
    const cols={biz:{x:m,c:K.str,t:W.sides.biz},dt:{x:m+o.cw+10,c:K.app,t:W.sides.dt}};
    Object.values(cols).forEach(c=>card(ctx,c.x,o.jy,o.cw,o.jh,c.c,c.t,{glow:4,size:13.5}));
    const n={biz:0,dt:0};W.jobs.forEach(([k,t])=>{const s=S.side[k],c=cols[s],i=n[s]++,[x,y,mov]=glide(G,k,c.x+8,o.jy+32+i*40,now,550);mv=mv||mov;
      chip2(ctx,x,y,o.cw-16,34,t,c.c,{size:12.5,glow:4});});
    if(mv)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.report,rep],[W.read.ret,ret],[W.read.agree,()=>S.who?(S.who==="owners"?W.read.yes:W.read.no):"–"]]};};

/* ---------- 2 · What the business needs to know: never a blank page ---------- */
// Three capabilities, each with the concepts it needs. Draft them from a blank page (days of interviews) or from the reference model,
// CIM (minutes, each a draft, a connection point named usage point), confirm them with the capability's people, choose the word for a
// connection point, and find the concept nobody holds: hosting capacity, on the map with its owner before any data exists.
PLAY.draft=(Lb,api)=>{const W=Lb.w,CAPS=W.caps.map(c=>c[0]),S={start:"blank",cap:"connect",drafted:{},ok:{},word:null,host:false,t:-1e5};
  const capName=k=>W.caps.find(c=>c[0]===k)[1];
  const label=(cap,c)=>c!==W.cpWord?c:S.word?W.words.find(x=>x[0]===S.word)[1]:S.drafted[cap]==="cim"?W.cimWord:W.cpWord;
  const r1=api.group(W.startL);api.seg(r1,W.starts,"blank",k=>{S.start=k;api.say(W.msg[k]);},W.startL);
  const r2=api.group(W.capL);api.seg(r2,W.caps,"connect",k=>{S.cap=k;S.t=performance.now();api.kick(700);api.say(fill(W.msg.cap,{c:capName(k)}));},W.capL);
  const r3=api.group();
  api.btn(r3,W.draftB,()=>{const c=S.cap,n=W.concepts[c].length;S.drafted[c]=S.start;S.ok[c]=false;S.t=performance.now();api.kick(900);
    if(S.start==="cim"){api.say(fill(W.msg.draftCim,{n,c:capName(c)}),"ok");api.reach("draft");}else api.say(fill(W.msg.draftBlank,{n,c:capName(c)}),"warn");},"go");
  api.btn(r3,W.confirmB,()=>{const c=S.cap;if(!S.drafted[c]){api.say(W.msg.confirmNo,"warn");return;}S.ok[c]=true;S.t=performance.now();api.kick(900);
    api.say(fill(W.msg.confirm,{c:capName(c)}),"ok");if(CAPS.every(k=>S.ok[k]))api.reach("confirm");});
  const r4=api.group(W.wordL);api.seg(r4,W.words,null,k=>{S.word=k;api.kick(400);api.say(W.msg[k],k==="connection"?"ok":"warn");if(k==="connection")api.reach("words");},W.wordL);
  const r5=api.group();api.btn(r5,W.missB,()=>{if(S.cap!=="connect"){api.say(W.msg.missNo,"warn");return;}S.host=true;S.t=performance.now();api.kick(900);api.say(W.msg.miss,"ok");api.reach("missing");});
  const terms=()=>CAPS.reduce((a,k)=>a+(S.drafted[k]?W.concepts[k].length:0),0)+(S.host?1:0),owned=()=>CAPS.reduce((a,k)=>a+(S.ok[k]?W.concepts[k].length:0),0)+(S.host?1:0);
  const days=()=>CAPS.reduce((a,k)=>a+(S.drafted[k]==="blank"?5:0),0);
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.cy=12;o.ch=50;o.ky=o.cy+o.ch+12;const inner=lw-m*2-24;
    let mh=0;CAPS.forEach(c=>{const longest=W.concepts[c].concat([W.cimWord,W.cpWord,W.words[1][1],W.host]);mh=Math.max(mh,flow(ctx,longest,inner,13,8,32).h);});
    o.kh=34+mh+50;o.gy=o.ky+o.kh+10;o.h=o.gy+40+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.inf);const m=o.m,W2=o.lw-m*2,cw=(W2-16)/3,c=S.cap,d=S.drafted[c],t=eo(since(now,S.t)/700);
    CAPS.forEach((k,i)=>{const on=k===c;chip2(ctx,m+i*(cw+8),o.cy,cw,o.ch,capName(k),S.ok[k]?K.good:K.str,{glow:on?14:3,a:on?1:0.6,size:13,mark:S.ok[k]?"ok":null});});
    card(ctx,m,o.ky,W2,o.kh,K.inf,fill(W.needs,{c:capName(c)}),{glow:6,size:13.5});
    const ls=d?W.concepts[c].map(x=>label(c,x)):[],host=c==="connect"&&S.host,all=ls.concat(host?[W.host]:[]);
    if(!all.length)line1(ctx,W.none,m+12,o.ky+54,W2-24,13,{w:600,color:rgbaS(K.soft,1)});
    else{const f=flow(ctx,all,W2-24,13,8,32);f.pos.forEach((p,i)=>{const h0=i>=ls.length,col=h0?K.gold:S.ok[c]?K.good:d==="cim"?K.app:K.paper;
        tile(ctx,m+12+p.x,o.ky+34+p.y+(1-t)*8,p.w,p.h,all[i],col,{a:t,size:13,mark:S.ok[c]&&!h0?"ok":null});});
      const tl=[d?(S.ok[c]?W.tags.ok:W.tags[d==="cim"?"cim":"hand"]):null,host?W.host+": "+W.hostSub:null].filter(Boolean);
      tl.forEach((s2,k)=>line1(ctx,s2,m+12,o.ky+o.kh-12-(tl.length-1-k)*17,W2-24,12.5,{w:600,color:rgbaS(k===1||!d?K.gold:K.soft,1)}));}
    card(ctx,m,o.gy,W2,40,K.gold,fill(W.gloss,{n:terms(),o:owned()}),{glow:4,size:13.5});
    if(t<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.terms,()=>String(terms())],[W.read.owned,()=>String(owned())],[W.read.time,()=>days()?fill(W.read.days,{d:days()}):CAPS.some(k=>S.drafted[k])?W.read.mins:"–"]]};};

/* ---------- 3 · Who creates it, who owns it: one creator, one owner ---------- */
// A CRUD matrix: three concepts down the side, three capabilities across the top, a C where a capability creates the concept and an
// R where it reads it. The account's column has two creators until the two owners decide; then a home switched on tells retail, or
// new homes get no account at all. Below, the new homes and what they got, the account's owner and steward, and the outage table.
PLAY.matrix=(Lb,api)=>{const W=Lb.w,S={create:"both",tell:false,stew:null,find:null,t:-1e5};
  const res=()=>S.create==="both"?"both":S.tell?"one":"none";
  const sayCreate=()=>{if(S.create==="both")api.say(W.msg.both,"warn");else if(!S.tell)api.say(W.msg.serve+" "+W.msg.noTell,"warn");else api.say(W.msg.serve+" "+W.msg.one,"ok");
    if(S.create==="serve")api.reach("one");if(S.create==="serve"&&S.tell)api.reach("bill");if(S.create==="serve"&&S.stew==="lead")api.reach("steward");};
  const r1=api.group(W.createL);api.seg(r1,W.creates,"both",k=>{S.create=k;S.t=performance.now();api.kick(900);sayCreate();},W.createL);
  const r1b=api.group();api.toggle(r1b,W.tellT,false,v=>{S.tell=v;S.t=performance.now();api.kick(900);if(S.create==="serve")sayCreate();else api.say(v?W.msg.tellOn:W.msg.tellOff);});
  const r2=api.group(W.stewL);api.seg(r2,W.stews,null,k=>{S.stew=k;api.kick(600);
    if(k==="lead"&&S.create!=="serve"){api.say(W.msg.lead+" "+W.msg.noOwner,"warn");return;}api.say(W.msg[k],k==="lead"?"ok":"warn");if(k==="lead")api.reach("steward");},W.stewL);
  const r3=api.group(W.findL);api.seg(r3,W.finds,null,k=>{S.find=k;api.kick(600);api.say(W.msg[k],k==="cap"?"ok":"warn");if(k==="cap")api.reach("found");},W.findL);
  // the squares, [concept][capability]: connection point, account, outage × connect, serve, operate
  const cell=(i,j)=>i===0?["C","R",""][j]:i===1?[S.create==="both"?"C":"R","C",""][j]:["","R","C"][j];
  const lay=lw=>{const m=12,o={lw,m};o.fc=Math.min(190,Math.round((lw-m*2)*0.34));o.gx=m+o.fc;o.cw=(lw-m*2-o.fc)/3;o.gy=30;o.rh=42;
    o.ky=o.gy+3*o.rh+6;o.oy=o.ky+22;o.ay=o.oy+44;o.h=o.ay+2*68+6;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.inf);const m=o.m,W2=o.lw-m*2,t=eo(since(now,S.t)/700);
    line1(ctx,W.capsH,o.gx,14,o.lw-m-o.gx,12,{w:800,align:"center",color:rgbaS(K.soft,1)});
    W.capsShort.forEach((c,j)=>line1(ctx,c,o.gx+j*o.cw+2,o.gy-2,o.cw-4,13,{w:800,align:"center",color:rgbaS(K.str,1)}));
    W.cons.forEach((c,i)=>{const y=o.gy+6+i*o.rh,two=i===1&&S.create==="both";
      chip2(ctx,m,y,o.fc-6,o.rh-6,c,two?K.bad:K.inf,{glow:two?10:3,size:13});
      for(let j=0;j<3;j++){const v=cell(i,j),x=o.gx+j*o.cw+3,col=v==="C"?(two?K.bad:K.good):K.soft;
        ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.35);ctx.lineWidth=1;rr(ctx,x,y,o.cw-6,o.rh-6,6);ctx.stroke();ctx.restore();
        if(v)line1(ctx,v,x,y+(o.rh-6)/2+6,o.cw-6,16,{w:800,align:"center",color:rgbaS(col,1)});}});
    line1(ctx,W.key,m,o.ky+10,W2,12,{w:600,color:rgbaS(K.soft,1)});
    const r=res(),hw=Math.min(160,W2*0.36);
    chip2(ctx,m,o.oy,hw,36,W.homes,K.app,{size:12.5});arrow(ctx,m+hw+4,o.oy+18,m+hw+20,o.oy+18,K.soft,0.9,{head:6});
    chip2(ctx,m+hw+24,o.oy,W2-hw-24,36,W.res[r],r==="one"?K.good:K.bad,{size:12.5,glow:6+8*(1-t)});
    const ok1=S.create==="serve"&&S.stew==="lead",ok2=S.find==="cap";
    box(ctx,o,o.ay,W.accL,[W.ownerL+": "+(S.create==="serve"?W.owner:W.unknown),W.stewardL+": "+(S.stew?W.stewNames[S.stew]:W.unknown)],ok1?K.good:K.ret);
    box(ctx,o,o.ay+68,W.outL,[W.ownerL+": "+(ok2?W.grace:W.unknown),W.stewardL+": "+(ok2?W.desk:W.unknown)],ok2?K.good:K.net);
    if(t<1)api.kick(60);};
  const box=(ctx,o,y,a,ls,col)=>{const W2=o.lw-o.m*2;card(ctx,o.m,y,W2,62,col,a,{glow:4,size:13});ls.forEach((s,i)=>line1(ctx,s,o.m+12,y+40+i*16,W2-24,12.5,{w:600,color:rgbaS(K.ink,0.9)}));};
  return{S,lay,draw,readouts:[[W.read.two,()=>S.create==="both"?W.nums.two:"0"],[W.read.none,()=>S.create==="serve"&&!S.tell?W.nums.homes:"0"],[W.read.owner,()=>S.create==="serve"?W.owner:W.read.nobody]]};};

/* ---------- 4 · Processes, as deep as data needs: as deep as it hurts ---------- */
// Meter to cash at level one; its five processes at level two; and level three, the activities as a flow, everywhere or only in
// checking readings, where it hurts. Only level three of checking readings shows where an estimate is born; the data team's tables
// take readings from the meters (every estimate invisible) or from the check.
PLAY.levels=(Lb,api)=>{const W=Lb.w,P=W.procs,PI=W.painIdx,S={depth:"1",pain:false,from:"meter",born:false,t:-1e5},G={};
  const deep=i=>S.depth==="3"||(S.depth==="2"&&S.pain&&i===PI),shown=()=>S.depth!=="1";
  const boxes=()=>1+(shown()?P.length:0)+P.reduce((a,_,i)=>a+(deep(i)?(i===PI?3:4):0),0);
  const r1=api.group(W.depthL);api.seg(r1,W.depths,"1",k=>{S.depth=k;S.t=performance.now();api.kick(900);
    if(k==="1")api.say(W.msg.d1,"warn");else if(k==="2"){api.say(W.msg.d2+(S.pain?" "+W.msg.painOn:""),"ok");api.reach("breadth");if(S.pain)api.reach("pain");}
    else api.say(fill(W.msg.d3,{n:boxes()}),"warn");},W.depthL);
  const r1b=api.group();api.toggle(r1b,W.painT,false,v=>{S.pain=v;S.t=performance.now();api.kick(900);
    if(v&&S.depth==="1"){api.say(W.msg.painNeeds,"warn");return;}api.say(v?W.msg.painOn:W.msg.painOff,v?"ok":null);if(v&&S.depth==="2")api.reach("pain");});
  api.btn(r1b,W.bornB,()=>{if(!deep(PI)){api.say(W.msg.bornNo,"warn");return;}S.born=true;S.t=performance.now();api.kick(900);api.say(W.msg.born,"ok");api.reach("born");
    if(S.from==="check")api.reach("see");},"go");
  const r3=api.group(W.fromL);api.seg(r3,W.froms,"meter",k=>{S.from=k;api.kick(600);if(k==="meter"){api.say(W.msg.meter,"warn");return;}
    if(!S.born){api.say(W.msg.check+" "+W.msg.seeNo,"warn");return;}api.say(W.msg.check,"ok");api.reach("see");},W.fromL);
  const lay=lw=>{const m=12,o={lw,m,nar:lw<460};o.my=12;o.py=64;o.cs=o.nar?3*32+6:46;o.os=24;o.by=o.py+P.length*36+o.cs+(P.length-1)*o.os+6;o.h=o.by+50+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.bus);const m=o.m,W2=o.lw-m*2,x0=m+18,w0=W2-18;let mv=false;
    card(ctx,m,o.my,W2,42,K.bus,W.macro,{glow:8,size:14});
    if(!shown())chip(ctx,x0,o.py,w0,30,W.notDrawn,K.soft,{a:0.6,size:12.5,glow:0});
    let y=o.py;P.forEach((p,i)=>{const[,yy,mov]=glide(G,"p"+i,0,y,now,550);mv=mv||mov;y+=36;if(!shown())return;
      const dp=deep(i),pain=i===PI&&dp,side=!o.nar&&!dp;
      ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.5);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(m+8,o.my+42);ctx.lineTo(m+8,yy+15);ctx.lineTo(x0,yy+15);ctx.stroke();ctx.restore();
      card(ctx,x0,yy,w0,30,pain?K.gold:K.bus,p,{glow:pain?10:3,size:13,r:8,right:side?160:0});
      if(side)line1(ctx,W.notDrawn,x0+w0-12-148,yy+20,148,12,{w:600,align:"right",color:rgbaS(K.soft,1)});
      if(!dp)return;const sy=yy+36;
      if(i===PI){const F=W.flow,cols=[K.bus,K.good,S.born?K.gold:K.inf];
        if(o.nar)F.forEach((s,k)=>chip2(ctx,x0+12,sy+k*32,w0-12,28,s,cols[k],{size:12.5,glow:k===2&&S.born?12:3}));
        else{const fw=(w0-12-2*18)/3;F.forEach((s,k)=>{const fx=x0+12+k*(fw+18);chip2(ctx,fx,sy,fw,38,s,cols[k],{size:12.5,glow:k===2&&S.born?12:3});
          if(k)arrow(ctx,fx-16,sy+19,fx-2,sy+19,K.soft,0.8,{head:5});});}
        y+=o.cs;}
      else{const pw=(w0-12)/4;for(let k=0;k<4;k++){ctx.save();ctx.fillStyle=rgbaS(K.soft,0.22);rr(ctx,x0+12+k*pw,sy+2,pw-6,14,5);ctx.fill();ctx.restore();}y+=o.os;}});
    const ck=S.from==="check";card(ctx,m,o.by,W2,50,ck?K.good:K.soft,W.tables,{glow:ck?10:3,size:13});
    line1(ctx,"← "+W.froms.find(f=>f[0]===S.from)[1],m+12,o.by+40,W2-24,13,{w:700,color:rgbaS(ck?K.good:K.ink,0.95)});
    if(mv)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.boxes,()=>String(boxes())],[W.read.est,()=>S.from==="check"?W.read.all:W.read.none]]};};

/* ---------- 5 · Rules and expectations the business owns: late, for whom? ---------- */
// A billing day's clock, midnight to noon. A fault holds back 2,600 meters' readings until nine (January) or eleven (a worse night).
// Billing runs at six while its service level is never written down, and at ten once the head of retail writes it; planning reads
// the readings a week later. The meter system's own check, the platform's check of every active account, and who hears.
PLAY.expect=(Lb,api)=>{const W=Lb.w,S={level:"guess",src:false,plat:false,run:null,kind:null,res:null};
  const bill=()=>S.level==="set"?10:6;
  const r1=api.group(W.levelL);api.seg(r1,W.levels,"guess",k=>{S.level=k;S.res=null;S.run=null;api.kick(300);api.say(W.msg[k],k==="set"?"ok":"warn");},W.levelL);
  const r2=api.group();api.toggle(r2,W.srcT,false,v=>{S.src=v;api.say(v?W.msg.srcOn:W.msg.srcOff);});api.toggle(r2,W.platT,false,v=>{S.plat=v;api.say(v?W.msg.platOn:W.msg.platOff);});
  const run=kind=>{S.kind=kind;S.run=performance.now();api.kick(2400);const set=S.level==="set";let t,tone;
    if(kind==="jan"){if(set){t=W.msg.janSet;tone="ok";api.reach("jan");}else{t=W.msg.janGuess;tone="no";api.reach("whom");}}
    else{if(!set){t=W.msg.worseGuess;tone="no";}else if(S.plat){t=W.msg.worsePlat;tone="ok";api.reach("warn");}else{t=W.msg.worseNoCheck;tone="no";}
      if(set&&S.src)t+=" "+W.msg.worseSrc;}
    if(S.src){t+=" "+W.msg.src;api.reach("source");}
    S.res={est:kind==="jan"&&set?0:2600,heard:kind==="worse"&&set&&S.plat};api.say(t,tone);};
  const r3=api.group();api.btn(r3,W.janB,()=>run("jan"),"go");api.btn(r3,W.worseB,()=>run("worse"));
  const lay=lw=>{const m=12,o={lw,m};o.ly=34;o.by=o.ly+3*46+8;o.h=o.by+50+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.ret);const m=o.m,W2=o.lw-m*2,ax0=m+18,ax1=o.lw-m-18,hx=h=>ax0+(ax1-ax0)*h/12;
    W.hours.forEach((s,i)=>{const x=hx(i*3);line1(ctx,s,x-24,18,48,12,{w:600,align:"center",color:rgbaS(K.soft,1)});
      ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.16);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,24);ctx.lineTo(x,o.ly+3*46);ctx.stroke();ctx.restore();});
    const ran=S.run!=null,arr=S.kind==="worse"?11:9,u=ran?eo(since(now,S.run)/1800):0,b=bill();
    const lane=(i,label,col)=>{const y=o.ly+i*46;line1(ctx,label,m,y+13,W2,12.5,{w:700,color:rgbaS(col||K.ink,0.92)});
      ctx.save();ctx.fillStyle=rgbaS(K.soft,0.13);rr(ctx,ax0,y+21,ax1-ax0,14,7);ctx.fill();ctx.restore();return y+21;};
    let y=lane(0,W.readings+(ran?" · "+W.held:""));
    if(ran){const x=hx(arr*u);ctx.save();ctx.fillStyle=rgbaS(K.app,0.45);rr(ctx,ax0,y,Math.max(14,x-ax0),14,7);ctx.fill();ctx.restore();
      ctx.save();ctx.fillStyle=rgbaS(K.app,1);ctx.beginPath();ctx.arc(x,y+7,7,0,TP);ctx.fill();ctx.restore();}
    y=lane(1,W.billing+" · "+b+":00",K.gold);const bx=hx(b);
    ctx.save();ctx.strokeStyle=rgbaS(K.gold,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx,y-4);ctx.lineTo(bx,y+18);ctx.stroke();ctx.restore();
    if(ran&&u>=1)mark(ctx,bx+12,y+7,arr<=b?"ok":"no");
    y=lane(2,W.planning);if(ran){ctx.save();ctx.fillStyle=rgbaS(K.good,0.35*u);rr(ctx,ax0,y,ax1-ax0,14,7);ctx.fill();ctx.restore();arrow(ctx,ax1-30,y+7,ax1,y+7,K.good,u,{head:6});
      if(u>=1)mark(ctx,ax1-40,y+7,"ok");}
    const bw=(W2-16)/3,heard=S.res&&S.res.heard,on=[S.src,S.plat,heard];
    W.boxes.forEach((s,i)=>chip2(ctx,m+i*(bw+8),o.by,bw,46,s,on[i]?(i===2?K.gold:K.good):K.soft,{size:12.5,glow:on[i]?12:2,dash:!on[i],mark:on[i]?"ok":null}));
    if(ran&&u<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.level,()=>S.level==="set"?W.read.set:W.read.guess],[W.read.est,()=>S.res?(S.res.est?W.nums.held:"0"):"–"],[W.read.heard,()=>S.res?(S.res.heard?W.read.lead:W.read.nobody):"–"]]};};

const BUILD={play:labPlay};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"ba-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","ba-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"ba-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"ba-tab-"+Lb.id,"aria-controls":"ba-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
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
const VCOL={own:K.str,draft:K.inf,matrix:K.ret,levels:K.bus,expect:K.mot};
const vrows=(ctx,o,now,q,S)=>{const p=PK[q.vis.k],c=VCOL[q.vis.k]||K.app,m=12,t=GO(S,now),W2=o.lw-m*2;ground(ctx,o.lw,o.h,c);
  pill(ctx,m,10,p.t,c,{size:13,max:W2});p.rows.forEach((r,i)=>{const y=46+i*42;card(ctx,m+i*10,y,W2-i*10,34,c,r,{glow:4,size:13});if(i)arrow(ctx,m+8+(i-1)*10,y-7,m+8+i*10,y,K.soft,0.7,{head:5});});
  const ky=46+p.rows.length*42;line1(ctx,p.key,m,ky+16,W2,13.5,{w:800,color:rgbaS(t>0?K.gold:K.soft,t>0?0.4+0.6*t:0.85)});if(t>0&&t<1&&S.vis)S.vis.kick(60);};
vrows.h=()=>46+3*42+28;
["own","draft","matrix","levels","expect"].forEach(k=>VIS[k]=vrows);
})();
