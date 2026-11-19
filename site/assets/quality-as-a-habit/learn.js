/* Learning Data: Quality as a habit. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine,
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
const U=L.ui,P=app.dataset.store||"ld-quality-as-a-habit";
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
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/quality-as-a-habit.js)
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


/* ---------- 1 · The hidden factory: count it, then fix where it's born ---------- */
// December's list left the platform with 543 names wrong, and two people put them right by hand, in a copy. Count that work, then
// change what makes the errors, bone by bone of the fishbone: where corrections are made (process), the family name field (systems)
// and the nightly file's encoding (interfaces). Build the next list and see which errors come back, and the hours they cost.
PLAY.factory=(Lb,api)=>{const W=Lb.w,B=W.bones,S={counted:null,where:"copy",field:false,enc:false,built:null,res:null};
  const N=W.total,hrs=wrong=>Math.round(((N-wrong)*2+wrong*20)/60/10)*10;
  // what comes back on the next list: each bone's errors, unless what makes them is fixed (corrections in the student system, the
  // longer field, the file that keeps every letter); the process bone has no names of its own, only the way back
  const fx=by=>by==="enc"?S.enc:by==="field"?S.field:S.where==="source",left=b=>b.parts.reduce((x,[n,by])=>x+(fx(by)?0:n),0);
  const back=()=>B.reduce((a,b)=>a+left(b),0),fixed=b=>b.parts.length?b.parts.every(([,by])=>fx(by)):S.where==="source";
  const touch=()=>{S.built=null;S.res=null;api.kick(500);};
  const r1=api.group();api.btn(r1,W.countB,()=>{S.counted=performance.now();api.kick(1800);api.say(fill(W.msg.count,{h:hrs(W.wrong),w:W.wrong}),"ok");api.reach("count");},"go");
  const r2=api.group(W.whereL);api.seg(r2,W.wheres,"copy",k=>{S.where=k;touch();api.say(W.msg["w_"+k]);},W.whereL);
  const r3=api.group(W.fixL);
  api.toggle(r3,W.fieldT,false,v=>{S.field=v;touch();api.say(v?W.msg.fieldOn:W.msg.fieldOff);});
  api.toggle(r3,W.encT,false,v=>{S.enc=v;touch();api.say(v?W.msg.encOn:W.msg.encOff);});
  const r4=api.group();api.btn(r4,W.buildB,()=>{const w=back();S.built=performance.now();S.res={w,h:hrs(w)};api.kick(1800);
    let s;if(S.where==="copy")s=fill(W.msg.backCopy,{w,h:hrs(w)});else if(!S.enc)s=fill(W.msg.backEnc,{w,h:hrs(w),n:B.reduce((a,b)=>a+b.parts.filter(x=>x[1]==="enc").reduce((y,x)=>y+x[0],0),0)});else if(w)s=fill(W.msg.backSome,{w,h:hrs(w)});else s=fill(W.msg.backNone,{h:hrs(w),was:hrs(W.wrong)});
    api.say(s,w?"warn":"ok");if(S.where==="copy"&&w>=W.wrong-20)api.reach("back");if(S.where==="source"&&!S.enc)api.reach("lose");if(!w)api.reach("zero");},"go");
  const lay=(lw)=>{const m=12,o={lw,m};o.head={x:m,y:12,w:lw-m*2,h:54};const one=lw<440,bw=one?lw-m*2:(lw-m*2-8)/2,bh=one?92:100,by=o.head.y+o.head.h+26,rows=one?4:2;
    o.bones=B.map((b,i)=>one?{x:m,y:by+i*(bh+8),w:bw,h:bh}:{x:m+(i%2)*(bw+8),y:by+Math.floor(i/2)*(bh+8),w:bw,h:bh});o.hid={x:m,y:by+rows*(bh+8)+4,w:lw-m*2,h:one?124:92};o.h=o.hid.y+o.hid.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.warm);const hd=o.head,ns=S.res?S.res.w:W.wrong;
    card(ctx,hd.x,hd.y,hd.w,hd.h,K.bad,S.res?W.headNext:W.headName);line1(ctx,fill(W.headV,{w:ns,n:N}),hd.x+12,hd.y+42,hd.w-24,13,{w:700,color:rgbaS(ns?K.bad:K.good,1)});
    // the spine: every bone leads to the problem at its head
    ctx.strokeStyle=rgbaS(K.soft,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(o.lw/2,hd.y+hd.h);ctx.lineTo(o.lw/2,o.hid.y);ctx.stroke();
    B.forEach((b,i)=>{const c=o.bones[i],f=fixed(b);card(ctx,c.x,c.y,c.w,c.h,f?K.good:K.warm,b.bone,{size:13,glow:f?10:5});
      lines(ctx,b.cause,c.x+12,c.y+42,c.w-24,{size:12.5,max:3,w:600,color:rgbaS(K.ink,0.9)});
      pill(ctx,c.x+c.w-10,c.y+8,f?W.fixedT:b.parts.length?fill(W.namesN,{n:left(b)}):W.noWay,f?K.good:K.warm,{align:"right",size:12,max:c.w*0.5});});
    const hi=o.hid;card(ctx,hi.x,hi.y,hi.w,hi.h,K.steel,W.hiddenName);
    if(S.counted==null)line1(ctx,W.notCounted,hi.x+12,hi.y+50,hi.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    else{const u=eo(since(now,S.counted)/1400),was=hrs(W.wrong),now_=S.res?S.res.h:was,bw=hi.w-24,maxH=was;
      const one=o.lw<440,bar=(y,v,col,label)=>{ctx.fillStyle=rgbaS(col,0.85);rr(ctx,hi.x+12,one?y+20:y,Math.max(4,bw*(one?1:0.62)*u*v/maxH),12,4);ctx.fill();
        if(one)line1(ctx,label,hi.x+12,y+14,bw,12.5,{w:700,color:rgbaS(col,1)});else line1(ctx,label,hi.x+12+bw*0.64,y+11,bw*0.36,12.5,{w:700,align:"right",color:rgbaS(col,1)});};
      bar(hi.y+40,was,K.warm,fill(W.hoursV,{h:was}));if(S.res)bar(hi.y+(one?78:64),now_,now_<was/2?K.good:K.warm,fill(W.nextV,{h:now_}));
      if(u<1)api.kick(60);}};
  const lw2=o=>o.lw<440;
  return{S,lay,draw,readouts:[[W.read.hours,()=>S.counted==null?W.read.uncounted:fill(W.read.h,{h:hrs(W.wrong)})],[W.read.back,()=>S.res?String(S.res.w):"–"],[W.read.next,()=>S.res?fill(W.read.h,{h:S.res.h}):"–"]]};};

/* ---------- 2 · Report, fix, tell: answer the people who find errors ---------- */
// Andrés reports his name. Where it's fixed (the list, a copy, or the student system) decides whether the fix lasts; a promise and a
// morning alert decide whether reports are answered in time; telling people decides whether they keep reporting; and a check made
// from his kind of error finds the next ones. Run October's 64 reports to see each choice add up.
PLAY.report=(Lb,api)=>{const W=Lb.w,S={where:"list",promise:false,tell:false,check:false,note:false,sent:null,sentS:null,oct:null,octS:null};
  const r1=api.group(W.whereL);api.seg(r1,W.wheres,"list",k=>{S.where=k;S.sent=null;api.say(W.msg["w_"+k]);api.kick(300);},W.whereL);
  const r2=api.group(W.withL);
  api.toggle(r2,W.promiseT,false,v=>{S.promise=v;api.say(v?W.msg.promiseOn:W.msg.promiseOff);});
  api.toggle(r2,W.tellT,false,v=>{S.tell=v;api.say(v?W.msg.tellOn:W.msg.tellOff);});
  api.toggle(r2,W.checkT,false,v=>{S.check=v;api.say(v?W.msg.checkOn:W.msg.checkOff);});
  api.toggle(r2,W.noteT,false,v=>{S.note=v;api.say(v?W.msg.noteOn:W.msg.noteOff);});
  const r3=api.group();
  api.btn(r3,W.reportB,()=>{S.sent=performance.now();S.sentS=Object.assign({},S);api.kick(3600);api.say(W.msg.reported);const t0=S.sent;
    setTimeout(()=>{if(S.sent!==t0)return;const s=S.sentS,M=W.msg;let m=M["fix_"+s.where];if(s.tell)m+=" "+(s.where==="source"?M.told:M.toldWrong);else m+=" "+M.untold;
      api.say(m,s.where==="source"?"ok":"no");if(s.where==="source")api.reach("source");if(s.where==="source"&&s.tell)api.reach("told");api.refresh();},RM()?0:3200);},"go");
  api.btn(r3,W.octB,()=>{S.oct=performance.now();S.octS=Object.assign({},S);api.kick(2200);const s=S.octS,M=W.msg,o=out(s);
    const bits=[fill(s.promise?M.octOnTime:M.octLate,{n:o.onTime,of:W.oct}),fill(s.tell?M.novKeep:M.novDrop,{n:o.nov})];if(s.check)bits.push(M.octCheck);if(s.note)bits.push(M.octNote);
    api.say(bits.join(" "),s.promise&&s.tell?"ok":"warn");if(s.promise)api.reach("time");if(s.tell)api.reach("keep");if(s.check)api.reach("check");api.refresh();});
  // October's reports, and November's, by the choices made
  const out=s=>({onTime:s.promise?W.onTime:W.lateOnTime,nov:s.tell?W.novKeep:W.novDrop,held:s.check?W.held:0});
  const lay=(lw)=>{const m=12,o={lw,m};o.a={x:m,y:12,w:lw-m*2,h:lw<440?100:82};o.f={x:m,y:o.a.y+o.a.h+10,w:lw-m*2,h:lw<440?206:150};o.t={x:m,y:o.f.y+o.f.h+10,w:lw-m*2,h:40+4*24+6};o.h=o.t.y+o.t.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plum);const a=o.a,s=S.sentS,u=S.sent==null?0:cl(since(now,S.sent)/3200,0,1);
    // what Andrés sees in the portal
    card(ctx,a.x,a.y,a.w,a.h,K.plum,W.portalName);const right=s&&u>=0.6&&s.where==="source";
    line1(ctx,right?W.nameRight:W.nameWrong,a.x+12,a.y+48,a.w-24,15,{w:800,color:rgbaS(right?K.good:K.ink,1)});
    const said=S.sent==null?W.portalAsk:u<0.2?W.portalSent:s.tell&&u>=0.8?(s.where==="source"?W.portalTold:W.portalToldWrong):s.promise?W.portalDue:W.portalQuiet;
    lines(ctx,said,a.x+12,a.y+70,a.w-24,{size:12.5,max:o.lw<440?2:1,w:600,color:rgbaS(K.soft,1)});
    // the report's way: to the owner, the fix, and the copies it reaches
    const f=o.f,cols=3,cw=(f.w-24-(cols-1)*8)/cols;card(ctx,f.x,f.y,f.w,f.h,K.steel,W.flowName);
    const where=s?s.where:S.where,box=[[W.owner,K.plum],[W.wheres.find(x=>x[0]===where)[1],where==="source"?K.good:K.warm],[W.copies,K.steel]];
    const nar=o.lw<440,bw2=(f.w-24)*0.6,tw=f.w-24-bw2-10;
    box.forEach(([t,c],i)=>{const g={glow:s&&u>i*0.3?10:3,size:12.5};if(nar){const y=f.y+36+i*40;chip(ctx,f.x+12,y,bw2,30,t,c,g);if(i<2)arrow(ctx,f.x+12+bw2/2,y+31,f.x+12+bw2/2,y+39,K.soft,0.8,{head:5});}
      else{const x=f.x+12+i*(cw+8);chip(ctx,x,f.y+36,cw,40,t,c,g);if(i<2)arrow(ctx,x+cw+1,f.y+56,x+cw+7,f.y+56,K.soft,0.8,{head:5});}});
    if(s){const p=ei(Math.min(u/0.6,1));if(nar)tile(ctx,f.x+f.w-12-tw,lp(f.y+39,f.y+119,p),tw,24,W.reportTile,K.plum,{size:12});else tile(ctx,lp(f.x+12,f.x+12+2*(cw+8),p),f.y+84,cw,24,W.reportTile,K.plum,{size:12});}
    const cy=nar?f.y+164:f.y+116;
    const cs=W.copyNames,ccw=(f.w-24-(cs.length-1)*6)/cs.length;cs.forEach((t,i)=>{const x=f.x+12+i*(ccw+6),okc=s&&u>=0.6&&s.where==="source",wrongC=s&&u>=0.6&&s.where==="list"&&i===0;
      chip(ctx,x,cy,ccw,26,t,okc?K.good:wrongC?K.warm:K.soft,{size:12,mark:okc?"ok":null});});
    // October, and after
    const t=o.t,oc=S.octS;card(ctx,t.x,t.y,t.w,t.h,K.brass,W.octName);
    if(!oc)lines(ctx,W.notOct,t.x+12,t.y+46,t.w-24,{size:12.5,max:2,w:600,color:rgbaS(K.soft,1)});
    else{const o2=out(oc),ou=eo(since(now,S.oct)/1200);
      [[W.rows.reports,W.oct],[W.rows.onTime,o2.onTime],[W.rows.nov,o2.nov],[W.rows.held,o2.held]].forEach(([l,v],i)=>{const y=t.y+40+i*24;
        line1(ctx,l,t.x+12,y+14,t.w-24-60,12.5,{w:600});line1(ctx,String(Math.round(v*ou)),t.x+t.w-12-56,y+14,56,13.5,{w:800,align:"right",color:rgbaS(K.ink,1)});});
      if(ou<1)api.kick(60);}
    if(S.sent!=null&&u<1)api.kick(60);};
  return{S,lay,draw,readouts:[[W.read.fix,()=>!S.sentS?"–":S.sentS.where==="source"?W.read.lasts:W.read.undone],[W.read.onTime,()=>S.octS?out(S.octS).onTime+" / "+W.oct:"–"],
    [W.read.made,()=>S.octS?(S.octS.note?W.read.told:W.read.notTold):"–"]]};};

/* ---------- 3 · Read by an agent: for a reader who can't ask ---------- */
// The list's confirmation date, empty for two reasons: not confirmed yet, or confirmed on paper. Ask the agent who hasn't
// confirmed; fix the data (a column that says how) and the words (what empty means); read its answer before acting; then let it
// draft checks, and decide which to keep.
PLAY.agent=(Lb,api)=>{const W=Lb.w,RW=W.rows,S={col:false,desc:false,asked:null,ans:null,work:false,sent:null,drafted:false,acc:{}};
  const answer=()=>S.col&&S.desc?"right":S.desc?"unsure":"sure";
  const r1=api.group(W.dataL);
  api.toggle(r1,W.colT,false,v=>{S.col=v;S.ans=null;api.say(v?W.msg.colOn:W.msg.colOff);api.kick(400);});
  api.toggle(r1,W.descT,false,v=>{S.desc=v;S.ans=null;api.say(v?W.msg.descOn:W.msg.descOff);api.kick(400);});
  const r2=api.group(W.askL);
  api.btn(r2,W.askB,()=>{S.asked=performance.now();S.ans=answer();S.sent=null;api.kick(1400);const a=W.answers[S.ans];api.say(a.say+(S.work?" "+a.work:""),S.ans==="right"?"ok":"warn");
    if(S.ans==="sure")api.reach("sure");if(S.ans==="right")api.reach("right");},"go");
  api.toggle(r2,W.workT,false,v=>{S.work=v;api.say(v?W.msg.workOn:W.msg.workOff);api.kick(300);});
  const r3=api.group(W.actL);
  api.btn(r3,W.sendB,()=>{if(!S.ans){api.say(W.msg.askFirst,"warn");return;}S.sent=W.answers[S.ans].n;api.kick(600);api.say(S.ans==="right"?W.msg.sentRight:fill(W.msg.sentWrong,{n:S.sent,x:S.sent-W.answers.right.n}),S.ans==="right"?"ok":"no");});
  api.btn(r3,W.fitB,()=>{if(!S.ans){api.say(W.msg.askFirst,"warn");return;}api.say(S.ans==="right"?W.msg.fitsRight:W.msg.fitsNot,S.ans==="right"?"ok":"ok");if(S.ans!=="right")api.reach("fits");});
  const r4=api.group(W.draftL),btns=[];
  api.btn(r4,W.draftB,()=>{S.drafted=true;api.say(W.msg.drafted);api.kick(400);btns.forEach(b=>b.hidden=false);});
  W.drafts.forEach((d,i)=>{const b=api.toggle(r4,d.name,false,v=>{if(!S.drafted)return;S.acc[i]=v;api.kick(300);api.say(v?d.on:d.off,d.keep===v?"ok":"warn");
      if(W.drafts.every((x,j)=>!!S.acc[j]===x.keep))api.reach("decide");});b.hidden=true;btns.push(b);});
  const lay=(lw)=>{const m=12,o={lw,m};o.t={x:m,y:12,w:lw-m*2,h:62+RW.length*26+6};o.d={x:m,y:o.t.y+o.t.h+10,w:lw-m*2,h:lw<440?114:78};o.a={x:m,y:o.d.y+o.d.h+10,w:lw-m*2,h:lw<440?96:82};o.h=o.a.y+o.a.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plum);const t=o.t,iw=t.w-24,ws=S.col?[0.44,0.28,0.28]:[0.5,0.5],cx=ws.map((v,k)=>t.x+12+iw*ws.slice(0,k).reduce((a,b)=>a+b,0)),cwk=k=>iw*ws[k]-6;
    card(ctx,t.x,t.y,t.w,t.h,K.cream,W.tableName);const hd=[W.cols.name,W.cols.date].concat(S.col?[W.cols.how]:[]);
    hd.forEach((h2,k)=>line1(ctx,h2,cx[k],t.y+48,cwk(k),12,{w:800,color:rgbaS(K.soft,1)}));
    const hl=S.ans!=null&&since(now,S.asked)>300,counted=r=>S.ans==="right"?(!r.date&&r.how===""):!r.date;
    RW.forEach((r,i)=>{const y=t.y+62+i*26,c=hl&&counted(r);if(c){ctx.fillStyle=rgbaS(K.warm,0.16);ctx.fillRect(t.x+6,y,t.w-12,26);}
      line1(ctx,r.name,cx[0],y+18,cwk(0),12.5,{w:700});line1(ctx,r.date||W.empty,cx[1],y+18,cwk(1),12.5,{w:600,color:rgbaS(r.date?K.ink:K.soft,0.95)});
      if(S.col)line1(ctx,r.how?W.how[r.how]:W.empty,cx[2],y+18,cwk(2),12.5,{w:600,color:rgbaS(r.how?K.ink:K.soft,0.95)});});
    const d=o.d;card(ctx,d.x,d.y,d.w,d.h,K.brass,W.descName);lines(ctx,S.desc?W.descNew:W.descOld,d.x+12,d.y+42,d.w-24,{size:12.5,max:o.lw<440?4:3,w:600,color:rgbaS(K.ink,0.92)});
    const a=o.a;card(ctx,a.x,a.y,a.w,a.h,K.steel,W.agentName);
    if(!S.ans)line1(ctx,W.notAsked,a.x+12,a.y+46,a.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    else{const A=W.answers[S.ans],u=eo(since(now,S.asked)/700);withA(ctx,u,()=>{line1(ctx,A.big,a.x+12,a.y+48,a.w-24,16,{w:800,color:rgbaS(S.ans==="right"?K.good:K.warm,1)});
      lines(ctx,S.work?A.work:A.line,a.x+12,a.y+68,a.w-24,{size:12,max:2,w:600,color:rgbaS(K.soft,1)});});if(u<1)api.kick(60);}};
  return{S,lay,draw,readouts:[[W.read.answer,()=>S.ans?String(W.answers[S.ans].n):"–"],[W.read.emails,()=>S.sent==null?"–":String(S.sent-W.answers.right.n)],
    [W.read.checks,()=>S.drafted?String(W.drafts.filter((x,j)=>S.acc[j]).length):"–"]]};};

/* ---------- 4 · Small, every week: one change, measured, then kept ---------- */
// The year after December's 41: one big clean-up, or one small change a week, each kept, or not, by a check; the hundred records
// measured four times, and the certificates printed again in December. Then one turn of plan, do, study, act, in October: simplify
// the hand checks, or automate them as they are.
PLAY.week=(Lb,api)=>{const W=Lb.w,S={way:"big",keep:false,year:null,yS:null,chg:"simple",step:0,turn:null};
  const curve=(s)=>{s=s||S;return s.way==="big"?W.curves.big:s.keep?W.curves.kept:W.curves.small;};
  const r1=api.group(W.wayL);api.seg(r1,W.ways,"big",k=>{S.way=k;S.year=null;api.say(W.msg["way_"+k]);api.kick(300);},W.wayL);
  const r2=api.group();api.toggle(r2,W.keepT,false,v=>{S.keep=v;S.year=null;api.say(v?W.msg.keepOn:W.msg.keepOff);api.kick(300);});
  api.btn(r2,W.yearB,()=>{S.year=performance.now();S.yS={way:S.way,keep:S.keep};api.kick(2400);const c=curve();
    api.say(fill(W.msg["year_"+(S.way==="big"?"big":S.keep?"kept":"small")],{p:c.p[c.p.length-1],r:c.r,h:c.h}),S.way==="small"&&S.keep?"ok":"warn");
    if(S.way==="big")api.reach("wear");if(S.way==="small"&&S.keep)api.reach("keep");},"go");
  const r3=api.group(W.chgL);api.seg(r3,W.chgs,"simple",k=>{S.chg=k;S.step=0;S.turn=performance.now();api.say(W.msg["chg_"+k]);api.kick(300);},W.chgL);
  const r4=api.group(W.turnL);W.steps.forEach((st,i)=>api.btn(r4,st,()=>{if(i===0&&S.step===4)S.step=0;if(S.step!==i){api.say(fill(W.msg.order,{s:W.steps[S.step]||W.steps[0]}),"warn");return;}
    S.step=i+1;S.turn=performance.now();api.kick(900);const m=W.msg[S.chg][i];api.say(m,i===2?(S.chg==="simple"?"ok":"no"):null);
    if(i===2&&S.chg==="auto")api.reach("order");if(i===3&&S.chg==="simple")api.reach("turn");},i===0?"go":null));
  const lay=(lw)=>{const m=12,o={lw,m};o.c={x:m,y:12,w:lw-m*2,h:200};o.p={x:m,y:o.c.y+o.c.h+10,w:lw-m*2,h:lw<440?178:150};o.h=o.p.y+o.p.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.good);const c=o.c,cv=S.yS?(S.yS.way==="big"?W.curves.big:S.yS.keep?W.curves.kept:W.curves.small):null;
    card(ctx,c.x,c.y,c.w,c.h,K.good,W.chartName);const x0=c.x+40,x1=c.x+c.w-20,y0=c.y+150,y1=c.y+50,Y=v=>lp(y0,y1,(v-70)/30),n=W.months.length,X=i=>lp(x0,x1,i/(n-1));
    [70,80,90,100].forEach(v=>{ctx.strokeStyle=rgbaS(K.soft,0.25);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0,Y(v));ctx.lineTo(x1,Y(v));ctx.stroke();line1(ctx,String(v),c.x+10,Y(v)+4,26,12,{w:600,color:rgbaS(K.soft,1)});});
    ctx.strokeStyle=rgbaS(K.good,0.7);ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x0,Y(95));ctx.lineTo(x1,Y(95));ctx.stroke();ctx.setLineDash([]);
    W.months.forEach((mo,i)=>line1(ctx,mo,X(i)-24,y0+20,48,12,{w:600,align:"center",color:rgbaS(K.soft,1)}));
    if(cv){const u=cl(since(now,S.year)/2000,0,1),k=u*(n-1);ctx.strokeStyle=rgbaS(cv===W.curves.kept?K.good:K.warm,1);ctx.lineWidth=2.6;ctx.beginPath();
      for(let i=0;i<=Math.floor(k);i++){const px=X(i),py=Y(cv.p[i]);if(!i)ctx.moveTo(px,py);else ctx.lineTo(px,py);}
      const f=k-Math.floor(k),i0=Math.floor(k);if(i0<n-1&&f>0)ctx.lineTo(lp(X(i0),X(i0+1),f),lp(Y(cv.p[i0]),Y(cv.p[i0+1]),f));ctx.stroke();
      for(let i=0;i<=Math.floor(k);i++){ctx.fillStyle=rgbaS(K.ink,1);ctx.beginPath();ctx.arc(X(i),Y(cv.p[i]),3.5,0,TP);ctx.fill();}
      if(u>=1)line1(ctx,fill(W.chartEnd,{r:cv.r}),c.x+12,c.y+c.h-12,c.w-24,12.5,{w:700,color:rgbaS(cv===W.curves.kept?K.good:K.warm,1)});else api.kick(60);}
    else line1(ctx,W.notYear,c.x+12,c.y+c.h-12,c.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});
    const p=o.p;card(ctx,p.x,p.y,p.w,p.h,K.brass,fill(W.turnName,{c:W.chgs.find(x=>x[0]===S.chg)[1]}));
    const sw=(p.w-24-18)/4;W.steps.forEach((st,i)=>{const on=i<S.step;
      chip(ctx,p.x+12+i*(sw+6),p.y+38,sw,34,st,on?(i===2&&S.chg==="auto"?K.bad:K.good):K.soft,{size:12.5,glow:on?10:2,mark:on?(i===2&&S.chg==="auto"?"no":"ok"):null});
      if(i<3)arrow(ctx,p.x+12+i*(sw+6)+sw,p.y+55,p.x+12+(i+1)*(sw+6),p.y+55,K.soft,0.6,{head:4});});
    const last=S.step>0?W.msg[S.chg][S.step-1]:W.turnHint;lines(ctx,last,p.x+12,p.y+92,p.w-24,{size:12.5,max:4,w:600,color:rgbaS(K.ink,0.9)});};
  return{S,lay,draw,readouts:[[W.read.reprints,()=>S.yS?String(curve(S.yS).r):"–"],[W.read.perfect,()=>S.yS?curve(S.yS).p[curve(S.yS).p.length-1]+" / 100":"–"],[W.read.hours,()=>S.yS?fill(W.read.h,{h:curve(S.yS).h}):"–"]]};};

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
// the problem at the fishbone's head, and its four bones
VIS.factory=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.warm);const m=12,t=GO(S,now),hw=Math.min(150,o.lw*0.34),hx=o.lw-m-hw,sy=78;
  chip(ctx,hx,sy-20,hw,40,PK.factory.head,K.bad,{size:13,glow:t>0?14:6});ctx.strokeStyle=rgbaS(t>0?K.gold:K.soft,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(m+4,sy);ctx.lineTo(hx-4,sy);ctx.stroke();
  const n=PK.factory.bones.length,span=(hx-m-20)/2,bw=Math.min(110,span-8);PK.factory.bones.forEach((b,i)=>{const col=i%2,up=i<2,x=m+10+col*span,y=up?14:sy+34;
    ctx.strokeStyle=rgbaS(K.soft,0.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+bw/2,up?y+30:y);ctx.lineTo(x+bw/2+26,sy);ctx.stroke();chip(ctx,x,y,bw,30,b,K.warm,{size:12.5});});};
VIS.factory.h=()=>150;
// a report's way, and back
VIS.report=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.plum);const m=12,t=GO(S,now),n=PK.report.steps.length,w=(o.lw-m*2-(n-1)*14)/n;
  PK.report.steps.forEach((s,i)=>{const x=m+i*(w+14);chip(ctx,x,40,w,40,s,i===n-1?K.good:K.plum,{size:12.5,glow:t>0?10:4});if(i<n-1)arrow(ctx,x+w+2,60,x+w+12,60,K.soft,0.9,{head:5});});
  ctx.strokeStyle=rgbaS(t>0?K.gold:K.soft,0.9);ctx.lineWidth=2;ctx.setLineDash(t>=1?[]:[4,4]);ctx.beginPath();ctx.moveTo(o.lw-m-w/2,84);ctx.quadraticCurveTo(o.lw/2,140,m+w/2,84);ctx.stroke();ctx.setLineDash([]);};
VIS.report.h=()=>140;
// what's written, and the agent that reads only that
VIS.agent=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.steel);const m=12,w=(o.lw-m*2-60)/2,t=GO(S,now);card(ctx,m,24,w,80,K.cream,PK.agent.a);card(ctx,o.lw-m-w,24,w,80,K.steel,PK.agent.b);
  arrow(ctx,m+w+6,64,o.lw-m-w-6,64,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[4,4],lw:t>0?2.6:2});line1(ctx,PK.agent.line,m,138,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.agent.h=()=>158;
// one turn: plan, do, study, act, and round again
VIS.week=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.good);const t=GO(S,now),cx=o.lw/2,cy=84,r=58,cols=[K.brass,K.steel,K.good,K.plum];
  PK.week.steps.forEach((s,i)=>{const a0=-Math.PI/2+i*Math.PI/2+0.06,a1=a0+Math.PI/2-0.12;ctx.strokeStyle=rgbaS(cols[i],t>0?1:0.6);ctx.lineWidth=14;ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);ctx.stroke();
    const am=(a0+a1)/2,lx=cx+Math.cos(am)*(r+42),ly=cy+Math.sin(am)*(r+26)+5;line1(ctx,s,lx-40,ly,80,13,{w:800,align:"center",color:rgbaS(cols[i],1)});});};
VIS.week.h=()=>172;
})();
