/* Learning Data: Model the business. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine,
   copied from From words to data's (site/assets/from-words-to-data/learn.js, itself Data that moves'): the series' labs page and
   scenarios page load a film's bundle (for its parts: glass, T, withA, rr, tw), the words (learn.en.js or learn.es.js, which set
   window.WD), and this file.
   Every lab is a playground (kind "play"), as the author set on 18 November 2026, and up to four for each film, the most interactive
   and meaningful, as the author set on 19 November 2026: the visitor switches, picks, slides and presses, and watches what happens;
   each playground has three to five experiments (w.goals), each ticked when the visitor makes it happen, and its end once all are
   ticked. Each playground's own rules are in PLAY below, its words in the pack.
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
// PLAY[id](Lb, api) gives the playground: its state (S), its controls (built with api.seg, api.toggle, api.btn and api.range), its readouts
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
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;},
    // a slider: fn(value, done) as it moves (done false) and where it's let go (done true); txt(value) says the value in words
    range:(row,label,min,max,v,fn,txt)=>{const vt=x=>txt?txt(x):String(x),r=h("input",{type:"range",min:String(min),max:String(max),step:"1",value:String(v),"aria-label":label,"aria-valuetext":vt(v)});
      const on=done=>{const x=+r.value;r.setAttribute("aria-valuetext",vt(x));fn(x,done);api.refresh();};
      r.addEventListener("input",()=>on(false));r.addEventListener("change",()=>on(true));
      r.set=x=>{r.value=String(x);r.setAttribute("aria-valuetext",vt(x));};row.append(r);return r;}};
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

/* ---------- 2 · A Sharper Sketch: sharpen the sketch ---------- */
// The intro's sketch on a grid of three by three, as the film sharpens it: the student, the course admission and the course across
// the top; the enrolment, the class box (which becomes the unit offering) and the unit across the middle; the status change, the
// class and the term (the teaching period) below. Four switches set what the film sets, in any order: one row per student in an
// offering (the class box splits into the unit offering, the unit and the class), the census date on each offering (it moves there
// from the term), enrolments joined to courses through a course admission (a box between them), and the count on census date (a
// status change under each enrolment, and its history in four columns). Genie's number, beside the census report's 118, closes by
// what each one fixes: 6 places in second tutorials, 4 enrolments in the summer intensive, 2 double-degree students counted twice,
// and 1 more today than on census date. Then the reference, laid over the sketch, pins what it has (blue), what the university adds
// (amber) and what it doesn't have at all (a question mark); and the fit register records the university's own, as the film's does.
const SH_ERR={grain:6,date:4,join:2,when:1},SH_ON={grain:"offer",date:"offer",join:"adm",when:"census"},SH_MS=620,ADOPT=[120,176,255];
// a list in words: "a", "a and b", "a, b and c"
const andList=(L,and)=>L.length<2?L.join(""):L.slice(0,-1).join(", ")+and+L[L.length-1];
PLAY.sharpen=(Lb,api)=>{const W=Lb.w,M=W.msg,B=W.boxes,S={v:{grain:"place",date:"term",join:"student",when:"now"},t:{},ref:false,refT:null,rec:null,n0:131,n1:131,nT:null};
  const on=k=>S.v[k]===SH_ON[k],N=()=>118+Object.keys(SH_ERR).reduce((a,k)=>a+(on(k)?0:SH_ERR[k]),0);
  // how far each switch is on its way (0: the sketch as it was, 1: sharpened); one turned back half-way goes back from where it is
  const pr=(k,now)=>{const t0=S.t[k];if(t0==null)return on(k)?1:0;const e=eo(since(now,t0)/SH_MS);return on(k)?e:1-e;};
  const shown=now=>S.nT==null?S.n1:Math.round(lp(S.n0,S.n1,eo(since(now,S.nT)/700)));
  // what the university adds to the reference, as the film's fit register lists it
  const exts=()=>[on("grain")?"offer":null,on("grain")?"cls":null,on("date")?"period":null,on("when")?"status":null].filter(Boolean);
  function set(k,v,words){const now=performance.now();if(S.v[k]===v)return;const p=pr(k,now);S.n0=shown(now);S.v[k]=v;
    S.t[k]=now-(on(k)?1-Math.cbrt(1-p):1-Math.cbrt(p))*SH_MS;S.n1=N();S.nT=now;S.rec=null;api.kick(1100);
    const n=N();api.say(fill(words[v],{n})+(n===118?M.match:""),on(k)?"ok":null);
    if(on(k)&&k!=="when")api.reach({grain:"grain",date:"date",join:"once"}[k]);if(n===118)api.reach("match");}
  [["grain",W.grainL,W.grains],["date",W.dateL,W.dates],["join",W.joinL,W.joins],["when",W.whenL,W.whens]].forEach(([k,l,items])=>{
    const r=api.group(l);api.seg(r,items,S.v[k],v=>set(k,v,M[k]),l);});
  const r5=api.group(W.refL);
  api.toggle(r5,W.refB,false,v=>{S.ref=v;S.refT=performance.now();if(!v)S.rec=null;api.kick(800);api.say(v?(on("grain")&&on("date")?M.ref.on:M.ref.ask):M.ref.off);});
  api.btn(r5,W.recB,()=>{if(!S.ref){api.say(M.rec.noRef);return;}const L=exts();if(!L.length){api.say(M.rec.none);return;}
    S.rec={t0:performance.now(),L};api.kick(900);api.say(fill(M.rec.done,{list:andList(L.map(k=>M.rec[k]),M.rec.and)}),"ok");api.reach("record");});
  const lay=(lw,ctx)=>{const m=10,W2=lw-m*2,o={lw,m,W2};
    o.cmp={x:m,y:12,w:W2,h:66};let y=12+66+20;
    // three columns as wide as the picture allows; a name of up to two lines, and room under it for the census date
    const g=8,bw=Math.min(150,Math.floor((W2-g*2)/3));o.bw=bw;o.tw=bw-8;o.lh=15;
    const L1=Math.max(...Object.values(B).map(s=>fitL(ctx,s,o.tw,12.5,2,700)[0].length));
    o.bh=Math.round(12+(L1+1)*o.lh);
    const x0=m+(W2-(bw*3+g*2))/2,rg=26;o.col=[0,1,2].map(i=>x0+i*(bw+g));o.row=[0,1,2].map(i=>y+8+i*(o.bh+rg));y=o.row[2]+o.bh+14;
    // the pins' legend, its room kept so nothing moves when it comes
    o.legY=y;o.leg=flow(ctx,[W.pins.ref,W.pins.ours,W.pins.none],W2,12.5,12,20);y+=o.leg.h+14;
    o.four={x:m,y,w:W2,h:96};y+=96+12;
    o.fit={x:m,y,w:W2,h:40+4*19+6};y+=o.fit.h+12;o.h=y;return o;};
  const box=(ctx,o,x,y,a,glow)=>{if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,o.bw,o.bh,8,K.plat,{glow:glow==null?6:glow,ea:0.85,fill:"rgba(7,12,24,0.94)"});
    ctx.fillStyle=rgbaS(K.plat,0.12);rr(ctx,x,y,o.bw,o.bh,8);ctx.fill();});};
  // a box's name, centred in the box, and above the census date while the date is there (sub, 0 to 1)
  const name=(ctx,o,x,y,s,a,sub)=>{if(a<=0.01)return;const[ls,z]=fitL(ctx,s,o.tw,12.5,2,700),lh=z*1.2,bot=y+o.bh-(o.lh+2)*sub,y0=(y+bot)/2-ls.length*lh/2+z*0.85;
    withA(ctx,a,()=>ls.forEach((l,i)=>T(ctx,l,x+o.bw/2,y0+i*lh,{w:700,size:z,align:"center",color:rgbaS(K.ink,0.96)})));};
  const census=(ctx,o,x,y,a)=>{if(a<=0.01)return;withA(ctx,a,()=>line1(ctx,W.census,x+4,y,o.bw-8,12,{w:700,align:"center",color:rgbaS(K.warm,1)}));};
  const link=(ctx,x0,y0,x1,y1,a)=>{if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgbaS(K.plat,0.55);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.plat);const m=o.m,bw=o.bw,bh=o.bh,gr=ei(pr("grain",now)),dt=ei(pr("date",now)),jn=pr("join",now),wh=pr("when",now);
    // Genie's number beside the census report's, and the gap between them
    const c=o.cmp,n=shown(now),gap=n-118,xr=c.x+c.w/2+6;glass(ctx,c.x,c.y,c.w,c.h,12,K.plat,{glow:6,ea:0.85,fill:"rgba(7,12,24,0.92)"});
    line1(ctx,W.cmp.genie,c.x+12,c.y+22,c.w/2-18,12.5,{w:600,color:rgbaS(K.soft,1)});T(ctx,String(n),c.x+12,c.y+52,{w:800,size:26,color:rgbaS(K.hot,1)});
    line1(ctx,W.cmp.report,xr,c.y+22,c.w/2-18,12.5,{w:600,color:rgbaS(K.soft,1)});T(ctx,"118",xr,c.y+52,{w:800,size:26,color:rgbaS(K.gold,1)});
    line1(ctx,gap?fill(W.cmp.gap,{n:gap}):W.cmp.match,xr+52,c.y+52,c.x+c.w-12-xr-52,14,{w:800,align:"right",color:rgbaS(gap?K.bad:K.good,1)});
    // the sketch: its lines under its boxes
    const X=i=>o.col[i],Y=i=>o.row[i],cx=i=>o.col[i]+bw/2,ux=lp(X(1),X(2),gr),cy=lp(Y(1),Y(2),gr);
    link(ctx,X(0)+bw,Y(0)+bh/2,X(2),Y(0)+bh/2,1-jn);                                        // student to course
    link(ctx,X(0)+bw,Y(0)+bh/2,X(1),Y(0)+bh/2,jn);link(ctx,X(1)+bw,Y(0)+bh/2,X(2),Y(0)+bh/2,jn); // through the admission
    link(ctx,cx(0),Y(0)+bh,cx(0),Y(1),1-jn);                                                // student to enrolment
    link(ctx,cx(1)-bw*0.25,Y(0)+bh,cx(0)+bw*0.25,Y(1),jn);                                  // admission to enrolment
    link(ctx,X(0)+bw,Y(1)+bh/2,X(1),Y(1)+bh/2,1);                                           // enrolment to the class box
    link(ctx,X(1)+bw,Y(1)+bh/2,ux,Y(1)+bh/2,gr);link(ctx,cx(1),Y(1)+bh,cx(1),cy,gr);       // the offering to its unit and its classes
    link(ctx,X(1)+bw-12,Y(1)+bh,cx(2)-bw*0.2,Y(2),1);                                       // the class box to the term
    link(ctx,cx(0),Y(1)+bh,cx(0),Y(2),wh);                                                  // enrolment to its status changes
    // the unit and the class come out from under the class box, which becomes the unit offering
    box(ctx,o,ux,Y(1),gr,8);name(ctx,o,ux,Y(1),B.unit,gr,0);box(ctx,o,X(1),cy,gr,8);name(ctx,o,X(1),cy,B.split,gr,0);
    box(ctx,o,X(0),Y(0),1);name(ctx,o,X(0),Y(0),B.student,1,0);box(ctx,o,X(2),Y(0),1);name(ctx,o,X(2),Y(0),B.course,1,0);
    box(ctx,o,X(1),Y(0),jn,6+6*jn);name(ctx,o,X(1),Y(0),B.adm,jn,0);
    box(ctx,o,X(0),Y(1),1);name(ctx,o,X(0),Y(1),B.enrol,1-gr,0);name(ctx,o,X(0),Y(1),B.uenrol,gr,0);
    box(ctx,o,X(1),Y(1),1,6+8*Math.sin(Math.PI*gr));name(ctx,o,X(1),Y(1),B.cls,1-gr,dt);name(ctx,o,X(1),Y(1),B.offer,gr,dt);
    box(ctx,o,X(2),Y(2),1);name(ctx,o,X(2),Y(2),B.term,1-dt,1-dt);name(ctx,o,X(2),Y(2),B.period,dt,1-dt);
    box(ctx,o,X(0),Y(2),wh,6+6*wh);name(ctx,o,X(0),Y(2),B.status,wh,0);
    // the census date: under the term's name, or the offering's, and on its way between them
    const sy=i=>Y(i)+bh-9;
    if(dt<=0.002)census(ctx,o,X(2),sy(2),1);else if(dt>=0.998)census(ctx,o,X(1),sy(1),1);
    else{ctx.save();ctx.shadowColor=rgbaS(K.warm,0.9);ctx.shadowBlur=10;census(ctx,o,lp(X(2),X(1),dt),lp(sy(2),sy(1),dt),1);ctx.restore();}
    // the reference, laid over the sketch: a pin on each box
    const ra=S.refT==null?(S.ref?1:0):(S.ref?eo(since(now,S.refT)/400):1-eo(since(now,S.refT)/400));
    if(ra>0.01){const at=(x,y,k,a)=>pin(ctx,x+bw-3,y+3,k,ra*a);
      at(X(0),Y(0),"ref",1);at(X(2),Y(0),"ref",1);at(X(1),Y(0),"ref",jn);at(X(0),Y(1),"ref",1);at(ux,Y(1),"ref",gr);
      at(X(1),cy,"ours",gr);at(X(0),Y(2),"ours",wh);at(X(1),Y(1),"none",1-gr);at(X(1),Y(1),"ours",gr);at(X(2),Y(2),"none",1-dt);at(X(2),Y(2),"ours",dt);
      withA(ctx,ra,()=>[W.pins.ref,W.pins.ours,W.pins.none].forEach((s,i)=>{const p=o.leg.pos[i];pin(ctx,m+p.x+8,o.legY+p.y+10,["ref","ours","none"][i],1);
        T(ctx,s,m+p.x+19,o.legY+p.y+14.5,{w:700,size:12.5,color:rgbaS(K.soft,1)});}));}
    // each enrolment's history, in four columns, once the count is on census date
    fourCols(ctx,o.four,W.four,wh);
    // the fit register: what the university adds, recorded
    const f=o.fit,ra2=S.rec?eo(since(now,S.rec.t0)/500):0;
    card(ctx,f.x,f.y,f.w,f.h,ra2>0?K.warm:K.soft,W.fit.h,{glow:ra2>0?8:2,dash:ra2<=0,a:ra2>0?1:0.55,size:13.5});
    if(S.rec)withA(ctx,ra2,()=>S.rec.L.forEach((k,i)=>{const y=f.y+44+i*19;ctx.save();ctx.fillStyle=rgbaS(K.warm,1);ctx.beginPath();ctx.arc(f.x+18,y-4,4,0,TP);ctx.fill();ctx.restore();
      line1(ctx,W.fit[k]+" · "+W.fit.tag,f.x+30,y,f.w-42,12.5,{w:700,color:rgbaS(K.ink,0.95)});}));};
  return{S,lay,draw,readouts:[[W.read.genie,()=>String(N())],[W.read.gap,()=>N()===118?W.read.none:String(N()-118)]]};};
// a pin on a box: blue, from the reference; amber, the university's own; a question mark, not in the reference at all
function pin(ctx,x,y,k,a){if(a<=0.01)return;const col=k==="ref"?ADOPT:K.warm;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(x,y,7.5,0,TP);ctx.fill();
  ctx.fillStyle=rgbaS(col,1);ctx.shadowColor=rgbaS(col,0.8);ctx.shadowBlur=6;ctx.beginPath();ctx.arc(x,y,k==="none"?7:5,0,TP);ctx.fill();ctx.restore();
  if(k==="none")withA(ctx,a,()=>T(ctx,"?",x,y+3.9,{w:800,size:11,align:"center",color:"rgba(20,14,4,0.95)"}));}
// each enrolment's history in four columns: on census date, came in, went out, today; lit with a, a dashed place before
function fourCols(ctx,b,F,a){const lit=a>0.01;card(ctx,b.x,b.y,b.w,b.h,lit?K.gold:K.soft,F.h,{glow:lit?4+6*a:2,dash:!lit,a:0.55+0.45*a,size:13.5});
  if(!lit)return;const cw=b.w/4,cols=[K.gold,K.good,K.bad,K.hot];
  withA(ctx,a,()=>F.cols.forEach(([h,v],i)=>{const x=b.x+i*cw;lines(ctx,h,x+6,b.y+44,cw-12,{size:12,max:2,w:700,align:"center",color:rgbaS(K.soft,1)});
    T(ctx,v,x+cw/2,b.y+b.h-12,{w:800,size:22,align:"center",color:rgbaS(cols[i],1)});
    if(i){ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.25);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,b.y+34);ctx.lineTo(x,b.y+b.h-8);ctx.stroke();ctx.restore();}}));}

/* ---------- 2 · A Sharper Sketch: choose a reference model ---------- */
// Four reference models for higher education, and four situations. Pick where to start from: the card shows how it fits the
// situation (where it applies, what it's for, and whether anyone can read it), lit green where it's the best start and amber where
// another fits better. Then write the choice down, and why, as the film's note does. Each situation's best start, and how each
// candidate fits it (fit: y, p or n for each of the three), are in the words (w.sits).
const FIT_MARK={y:"ok",p:"part",n:"bad"};
// a mark for how well something fits: a tick, a dash for partly, or a cross
function fitMark(ctx,x,y,k){if(k!=="part"){mark(ctx,x,y,k);return;}ctx.save();ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(x,y,8,0,TP);ctx.fill();
  ctx.strokeStyle=rgbaS(K.warm,1);ctx.lineWidth=1.6;ctx.stroke();ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-3.4,y);ctx.lineTo(x+3.4,y);ctx.stroke();ctx.restore();}
PLAY.choose=(Lb,api)=>{const W=Lb.w,M=W.msg,C=W.cands,SI=W.sits,S={si:0,pick:SI.map(()=>new Set()),cur:SI.map(()=>null),pT:null,note:SI.map(()=>null)};
  const cand=k=>C.find(c=>c.k===k),found=()=>SI.filter((s,i)=>S.pick[i].has(s.best)).length;
  let gC=null;const sync=()=>{if(gC)[...gC.children].forEach(b=>b.setAttribute("aria-pressed",b.dataset.k===S.cur[S.si]?"true":"false"));};
  api.seg(api.group(W.sitL),SI.map((s,i)=>[String(i),String(i+1)]),"0",k=>{S.si=+k;sync();api.kick(500);api.say(fill(M.sit,{n:S.si+1,t:SI[S.si].t}));},W.sitL);
  gC=api.seg(api.group(W.candL),C.map(c=>[c.k,c.n]),null,k=>{const s=SI[S.si],ok=k===s.best;S.pick[S.si].add(k);S.cur[S.si]=k;S.pT=performance.now();api.kick(600);
    api.say((ok?M.best:M.weak)+" "+s.why[k],ok?"ok":"warn");if(ok)api.reach(s.g);},W.candL);
  api.btn(api.group(W.noteL),W.noteB,()=>{const k=S.cur[S.si];if(!k){api.say(M.note.none);return;}const ok=k===SI[S.si].best;
    S.note[S.si]={k,ok,t0:performance.now()};api.kick(700);api.say(fill(ok?M.note.best:M.note.weak,{c:cand(k).n,n:S.si+1}),ok?"ok":"warn");if(ok)api.reach("why");});
  // the situation; the four cards, two by two, each line of the two cards side by side as many lines as the longer needs at this
  // width; the situation's note
  const lay=(lw,ctx)=>{const m=10,W2=lw-m*2,g=8,cw=(W2-g)/2,o={lw,m,W2,cw,lh:17};
    const sl=Math.max(...SI.map(s=>fitL(ctx,s.t,W2-24,13.5,4,700)[0].length));o.sit={x:m,y:10,w:W2,h:Math.round(32+sl*o.lh+8)};
    let y=o.sit.y+o.sit.h+12;o.cards=[];
    for(let r=0;r*2<C.length;r++){const two=C.slice(r*2,r*2+2),rows=["c","p","a"].map(k=>Math.max(...two.map(c=>fitL(ctx,c[k],cw-44,12.5,2,600)[0].length)));
      const ch=Math.round(30+rows.reduce((a,b)=>a+b,0)*o.lh+8);two.forEach((c,j)=>o.cards.push({x:m+j*(cw+g),y,h:ch,rows}));y+=ch+g;}
    const nl=Math.max(...SI.flatMap(s=>C.map(c=>fitL(ctx,s.why[c.k],W2-24,12.5,4,600)[0].length)));
    o.note={x:m,y:y+6,w:W2,h:Math.round(30+20+nl*16+10)};o.h=o.note.y+o.note.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.cold);const s=SI[S.si];
    card(ctx,o.sit.x,o.sit.y,o.sit.w,o.sit.h,K.cold,fill(W.sitH,{n:S.si+1,of:SI.length}),{glow:6,size:13});
    lines(ctx,s.t,o.sit.x+12,o.sit.y+44,o.sit.w-24,{size:13.5,max:4,w:700});
    C.forEach((c,i)=>{const p=o.cards[i],picked=S.pick[S.si].has(c.k),cur=S.cur[S.si]===c.k,best=c.k===s.best,col=picked?(best?K.good:K.warm):K.soft;
      const gl=cur&&S.pT!=null?6+8*(1-eo(since(now,S.pT)/600)):0;
      glass(ctx,p.x,p.y,o.cw,p.h,10,col,{glow:(picked?(cur?10:5):2)+gl,ea:0.85,fill:"rgba(7,12,24,0.94)"});
      ctx.fillStyle=rgbaS(col,picked?0.1:0.04);rr(ctx,p.x,p.y,o.cw,p.h,10);ctx.fill();
      if(cur){ctx.save();ctx.strokeStyle=rgbaS(col,0.95);ctx.lineWidth=2;rr(ctx,p.x+1,p.y+1,o.cw-2,p.h-2,9);ctx.stroke();ctx.restore();}
      line1(ctx,c.n,p.x+10,p.y+21,o.cw-20,13.5,{w:800,color:rgbaS(picked?mixC(col,K.ink,0.4):K.ink,1)});
      let y=p.y+30;["c","p","a"].forEach((k,j)=>{const[ls,z]=fitL(ctx,c[k],o.cw-44,12.5,2,600);
        ls.forEach((l,q)=>T(ctx,l,p.x+10,y+12+q*o.lh,{w:600,size:z,color:rgbaS(K.soft,1)}));
        if(picked)fitMark(ctx,p.x+o.cw-16,y+8,FIT_MARK[s.fit[c.k][j]]);y+=p.rows[j]*o.lh;});
      if(picked)fitMark(ctx,p.x+o.cw-2,p.y+2,best?"ok":"part");});
    // the situation's note: what was chosen, and why
    const nt=S.note[S.si],na=nt?eo(since(now,nt.t0)/500):0,nc=nt?(nt.ok?K.good:K.warm):K.soft;
    card(ctx,o.note.x,o.note.y,o.note.w,o.note.h,nc,W.noteH,{glow:nt?8:2,dash:!nt,a:nt?1:0.55,size:13.5});
    if(nt)withA(ctx,na,()=>{line1(ctx,fill(W.noteT,{n:S.si+1,c:cand(nt.k).n}),o.note.x+12,o.note.y+44,o.note.w-24,13,{w:800,color:rgbaS(mixC(nc,K.ink,0.3),1)});
      lines(ctx,s.why[nt.k],o.note.x+12,o.note.y+64,o.note.w-24,{size:12.5,max:4,w:600,color:rgbaS(K.ink,0.9)});});};
  return{S,lay,draw,readouts:[[W.read.found,()=>fill(W.read.of,{n:found(),of:SI.length})]]};};

/* ---------- 2 · A Sharper Sketch: where does it live? ---------- */
// The sketch's class box held every detail. Here it has come apart: the unit, Data Science 101; its two offerings, Semester 1 and
// the summer intensive; and their three tutorials, drawn as a tree, one box for each row. Put a detail on a level, and every box there
// lists it: on the thing it describes, each row has its own value; lower down, the same value is copied into every row under it;
// higher up, one row needs two values. Each detail's level (lv), and its value in each row (v), are in the words (w.details).
const WH_LV=["unit","offer","cls"],WH_ROWS={unit:["u"],offer:["s1","su"],cls:["tue","thu","mon"]},WH_UP={s1:"u",su:"u",tue:"s1",thu:"s1",mon:"su"},
  WH_OF={u:"unit",s1:"offer",su:"offer",tue:"cls",thu:"cls",mon:"cls"},WH_MS=520,WH_COL={own:K.ink,copy:K.warm,clash:K.bad,one:K.soft};
PLAY.where=(Lb,api)=>{const W=Lb.w,M=W.msg,D=W.details,S={at:{},from:{},t:{},sel:D[0].k};D.forEach(d=>{S.at[d.k]="cls";});
  const li=k=>WH_LV.indexOf(k),dk=k=>D.find(d=>d.k===k);
  const anc=(i,lv)=>{let x=i;while(x&&WH_OF[x]!==lv)x=WH_UP[x];return x;},desc=(i,lv)=>WH_ROWS[lv].filter(j=>anc(j,WH_OF[i])===i);
  // a detail on a level, in one of its rows: its values there, and whether they're the row's own, a copy, or two in one place
  const cell=(d,L,i)=>{const a=li(L),b=li(d.lv);if(a===b)return{vs:[d.v[i]],st:"own"};if(a>b)return{vs:[d.v[anc(i,d.lv)]],st:"copy"};
    const vs=[...new Set(desc(i,d.lv).map(j=>d.v[j]))];return{vs,st:vs.length>1?"clash":"one"};};
  const copies=()=>D.reduce((n,d)=>n+(li(S.at[d.k])>li(d.lv)?WH_ROWS[S.at[d.k]].length-WH_ROWS[d.lv].length:0),0);
  const clashes=()=>D.reduce((n,d)=>n+WH_ROWS[S.at[d.k]].filter(i=>cell(d,S.at[d.k],i).st==="clash").length,0);
  const tell=d=>{const L=S.at[d.k],a=li(L),b=li(d.lv);if(a===b)return M.own[d.k];
    if(a>b)return fill(M.copy,{d:d.l,at:W.the[L],n:WH_ROWS[L].length,one:W.one[L],to:W.the[d.lv]});
    const i=WH_ROWS[L].find(x=>cell(d,L,x).st==="clash"),vs=cell(d,L,i).vs;
    return fill(M.clash,{d:d.l,at:W.the[L],row:W.rows[i],vals:andList(vs,W.and),n:vs.length,to:W.the[d.lv]});};
  const tone=d=>{const a=li(S.at[d.k]),b=li(d.lv);return a===b?"ok":a>b?"warn":"no";};
  let gPut=null;const sync=()=>{if(gPut)[...gPut.children].forEach(b=>b.setAttribute("aria-pressed",b.dataset.k===S.at[S.sel]?"true":"false"));};
  function put(L){const d=dk(S.sel);if(S.at[d.k]===L){api.say(tell(d),tone(d));return;}
    S.from[d.k]=S.at[d.k];S.at[d.k]=L;S.t[d.k]=performance.now();api.kick(WH_MS+400);
    const all=D.every(x=>S.at[x.k]===x.lv);api.say(tell(d)+(all?M.all:""),tone(d));
    if(li(L)<li(d.lv))api.reach("clash");if(S.at.census==="offer")api.reach("census");
    if(D.filter(x=>x.lv==="unit").every(x=>S.at[x.k]==="unit"))api.reach("unit");if(all)api.reach("all");}
  api.seg(api.group(W.pickL),D.map(d=>[d.k,d.l]),S.sel,k=>{S.sel=k;sync();api.kick(400);const d=dk(k);api.say(tell(d),tone(d));},W.pickL);
  gPut=api.seg(api.group(W.putL),WH_LV.map(L=>[L,W.levels[L]]),S.at[S.sel],put,W.putL);
  // three levels, one under the other, each a panel with a column for each of its rows, each as wide as the rows under it; each
  // detail a line in the panel of its level, its value in each column. The panels grow and shrink as details move, and the picture
  // stays the same height: each detail is on one level.
  const lay=(lw,ctx)=>{const m=10,W2=lw-m*2,cw=W2/3,o={lw,m,W2,kh:52,lh:32,gap:20,top:10};
    o.x={u:m,s1:m,su:m+2*cw,tue:m,thu:m+cw,mon:m+2*cw};o.w={u:W2,s1:cw*2,su:cw,tue:cw,thu:cw,mon:cw};
    o.legY=o.top+3*(o.kh+6)+D.length*o.lh+2*o.gap+14;o.leg=flow(ctx,[W.legend.own,W.legend.copy,W.legend.clash],W2,12.5,14,20);
    o.h=o.legY+o.leg.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.arch);const sc=rgb(Lb.c);
    // how much of each detail is on each level, as it moves from one to the other
    const wt=D.map(d=>{const t0=S.t[d.k],p=t0==null?1:eo(since(now,t0)/WH_MS),r={};WH_LV.forEach(L=>{r[L]=(S.at[d.k]===L?p:0)+(t0!=null&&S.from[d.k]===L?1-p:0);});return r;});
    const bh=L=>o.kh+wt.reduce((a,r)=>a+r[L],0)*o.lh+6,Y={};let y=o.top;WH_LV.forEach(L=>{Y[L]=y;y+=bh(L)+o.gap;});
    // the tree: each row to the rows under it
    ctx.save();ctx.strokeStyle=rgbaS(K.arch,0.6);ctx.lineWidth=1.6;ctx.beginPath();
    Object.keys(WH_UP).forEach(i=>{const P=WH_OF[WH_UP[i]],x=o.x[i]+o.w[i]/2;ctx.moveTo(x,Y[P]+bh(P));ctx.lineTo(x,Y[WH_OF[i]]);});ctx.stroke();ctx.restore();
    WH_LV.forEach(L=>{const x=o.m,w=o.W2,y0=Y[L],hh=bh(L);
      glass(ctx,x,y0,w,hh,12,K.arch,{glow:5,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgbaS(K.arch,0.06);rr(ctx,x,y0,w,hh,12);ctx.fill();
      line1(ctx,W.kick[L],x+10,y0+17,w-20,12,{w:800,color:rgbaS(K.arch,1)});
      WH_ROWS[L].forEach(i=>chip(ctx,o.x[i]+5,y0+24,o.w[i]-10,22,W.rows[i],K.arch,{size:12.5,glow:4}));
      let yy=y0+o.kh;D.forEach((d,j)=>{const wj=wt[j][L];if(wj<=0.001)return;const a=cl((wj-0.35)/0.65,0,1);
        if(a>0.01)withA(ctx,a,()=>{if(d.k===S.sel){ctx.fillStyle=rgbaS(sc,0.16);rr(ctx,x+4,yy+1,w-8,o.lh-2,6);ctx.fill();}
          line1(ctx,d.l,x+10,yy+13,w-20,12,{w:600,color:rgbaS(K.soft,1)});
          WH_ROWS[L].forEach(i=>{const c=cell(d,L,i);line1(ctx,c.vs.join(" / "),o.x[i]+10,yy+28,o.w[i]-16,13,{w:800,color:rgbaS(WH_COL[c.st],1)});});});
        yy+=wj*o.lh;});});
    [["own",W.legend.own],["copy",W.legend.copy],["clash",W.legend.clash]].forEach(([k,s],j)=>{const p=o.leg.pos[j],x=o.m+p.x,yy=o.legY+p.y;
      ctx.save();ctx.fillStyle=rgbaS(WH_COL[k],1);ctx.beginPath();ctx.arc(x+5,yy+10,4.5,0,TP);ctx.fill();ctx.restore();
      T(ctx,s,x+16,yy+14.5,{w:700,size:12.5,color:rgbaS(K.soft,1)});});};
  return{S,lay,draw,readouts:[[W.read.copies,()=>String(copies())],[W.read.clashes,()=>String(clashes())]]};};

/* ---------- 2 · A Sharper Sketch: enrolled when? ---------- */
// Nine of DS101's students from 15 February to today, 26 April, each change of status with its day (counted from 15 February).
// Keep only each student's status now, and every day looks like today; keep each change with its date, and any day can be counted,
// census date included. The three who changed after census date are the film's: two came in (Isha and Gus), one went out (Dev).
const TM_D0=Date.UTC(2026,1,15),TM_CEN=44,TM_NOW=70,TM_MS=480,TM_COL={e:K.good,w:K.cold,x:K.bad},
  TM_WHO=[["Ana",[["e",5]]],["Ben",[["e",6]]],["Chloe",[["e",7]]],["Dev",[["w",16],["e",23],["x",58]]],["Eli",[["e",10],["x",33]]],
    ["Fatima",[["e",11]]],["Gus",[["w",38],["e",52]]],["Hana",[["e",12]]],["Isha",[["e",46]]]];
const tmSt=(s,d)=>{let st=null;s[1].forEach(([k,t])=>{if(t<=d)st=k;});return st;},tmN=d=>TM_WHO.filter(s=>tmSt(s,d)==="e").length;
// a question mark: not so on that day
function qmark(ctx,x,y){ctx.save();ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(x,y,8,0,TP);ctx.fill();ctx.strokeStyle=rgbaS(K.bad,1);ctx.lineWidth=1.6;ctx.stroke();ctx.restore();
  T(ctx,"?",x,y+4.3,{w:800,size:12,align:"center",color:rgbaS(K.bad,1)});}
PLAY.time=(Lb,api)=>{const W=Lb.w,M=W.msg,S={m:"now",mT:null,day:TM_NOW,d0:TM_NOW,dT:null};
  const date=d=>{const t=new Date(TM_D0+d*864e5);return fill(W.date,{d:t.getUTCDate(),m:W.months[t.getUTCMonth()]});};
  const said=d=>tmN(S.m==="hist"?d:TM_NOW);  // what the model answers for a day
  const shownDay=now=>S.dT==null?S.day:lp(S.d0,S.day,eo(since(now,S.dT)/TM_MS));
  const hp=now=>{const e=S.mT==null?1:eo(since(now,S.mT)/TM_MS);return S.m==="hist"?e:1-e;};
  // the students the model gets wrong on a day: with only the status now, whoever changed between that day and today
  const off=d=>S.m==="hist"?[]:TM_WHO.filter(s=>(tmSt(s,d)==="e")!==(tmSt(s,TM_NOW)==="e")).map(s=>s[0]);
  function told(){const d=S.day,n=tmN(d),D=date(d),o=off(d);
    if(S.m==="hist")return d===TM_CEN?M.hist.census:d===TM_NOW?M.hist.today:n===8?fill(M.hist.peak,{d:D}):fill(M.hist.day,{n,d:D});
    if(d===TM_NOW)return M.now.today;if(d===TM_CEN)return M.now.census;
    const f={d:D,n:said(d),t:n,who:andList(o,W.and)};return !o.length?fill(M.now.same,f):said(d)===n?fill(M.now.swap,f):fill(M.now.day,f);}
  const tone=()=>{const o=off(S.day);return S.m==="now"?(o.length?(said(S.day)===tmN(S.day)?"warn":"no"):null):(S.day===TM_CEN||S.day===TM_NOW||tmN(S.day)===8?"ok":null);};
  function check(){if(S.m==="now"&&S.day===TM_CEN)api.reach("wrong");
    if(S.m==="hist"){if(S.day===TM_CEN)api.reach("census");if(S.day===TM_NOW)api.reach("moves");if(tmN(S.day)===8)api.reach("peak");}}
  let rng=null;
  function go(d,jump,done){const now=performance.now();S.d0=shownDay(now);S.day=d;S.dT=jump?now:null;api.kick(jump?TM_MS+200:80);
    if(rng&&+rng.value!==d)rng.set(d);if(done){api.say(told(),tone());check();}}
  api.seg(api.group(W.modelL),W.models,S.m,m=>{if(m===S.m){api.say(told(),tone());return;}S.m=m;S.mT=performance.now();api.kick(TM_MS+200);api.say(M.model[m]+" "+told(),tone());check();},W.modelL);
  const r2=api.group(W.dayL);rng=api.range(r2,W.dayL,0,TM_NOW,S.day,(v,done)=>go(v,false,done),date);
  api.btn(r2,W.cenB,()=>go(TM_CEN,true,true));api.btn(r2,W.nowB,()=>go(TM_NOW,true,true));
  // the question and the model's answer at the top; a row for each student, the semester across; census date, today and the day asked
  // about down the rows; what the colours mean; and each enrolment's history in four columns, which only the dates can give
  const lay=(lw,ctx)=>{const m=10,W2=lw-m*2,o={lw,m,W2};o.cmp={x:m,y:10,w:W2,h:58};
    o.nw=Math.ceil(Math.max(...TM_WHO.map(s=>TW(ctx,s[0],12.5))))+14;o.x0=m+o.nw;o.x1=m+W2-10;o.rh=20;
    o.top=o.cmp.y+o.cmp.h+30;o.rows=o.top+6;o.bot=o.rows+TM_WHO.length*o.rh;
    o.legY=o.bot+28;o.leg=flow(ctx,[W.legend.e,W.legend.w,W.legend.x,W.legend.q],W2,12.5,14,20);
    o.four={x:m,y:o.legY+o.leg.h+14,w:W2,h:96};o.h=o.four.y+o.four.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.warm);const h1=hp(now),dd=shownDay(now),di=Math.round(dd),X=d=>o.x0+(o.x1-o.x0)*d/TM_NOW,cx=X(dd);
    const c=o.cmp,n=said(di),t=tmN(di),xr=c.x+c.w/2+6;glass(ctx,c.x,c.y,c.w,c.h,12,K.warm,{glow:6,ea:0.85,fill:"rgba(7,12,24,0.92)"});
    line1(ctx,W.cmp.day,c.x+12,c.y+21,c.w/2-18,12.5,{w:600,color:rgbaS(K.soft,1)});T(ctx,date(di),c.x+12,c.y+46,{w:800,size:22,color:rgbaS(K.ink,1)});
    line1(ctx,W.cmp.n,xr,c.y+21,c.x+c.w-12-xr,12.5,{w:600,color:rgbaS(K.soft,1)});T(ctx,String(n),xr,c.y+46,{w:800,size:22,color:rgbaS(n===t?K.good:K.bad,1)});
    if(n!==t)line1(ctx,fill(W.cmp.really,{t}),xr+34,c.y+46,c.x+c.w-12-xr-34,13,{w:800,align:"right",color:rgbaS(K.bad,1)});
    TM_WHO.forEach((s,i)=>{const ym=o.rows+i*o.rh+o.rh/2,st=tmSt(s,TM_NOW);
      T(ctx,s[0],o.x0-10,ym+4.5,{w:700,size:12.5,align:"right",color:rgbaS(K.soft,1)});
      ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.2);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(o.x0,ym);ctx.lineTo(o.x1,ym);ctx.stroke();ctx.restore();
      // each change with its date, as the history keeps them; or only the status now, as if it had always been so
      if(h1>0.01)withA(ctx,h1,()=>s[1].forEach(([k,t0],j)=>{const t1=j<s[1].length-1?s[1][j+1][1]:TM_NOW;
        ctx.fillStyle=rgbaS(TM_COL[k],k==="x"?0.42:0.82);rr(ctx,X(t0),ym-6,Math.max(4,X(t1)-X(t0)),12,5);ctx.fill();}));
      if(h1<0.99)withA(ctx,1-h1,()=>{ctx.fillStyle=rgbaS(TM_COL[st],st==="x"?0.22:0.36);rr(ctx,o.x0,ym-6,o.x1-o.x0,12,5);ctx.fill();
        ctx.save();ctx.setLineDash([4,3]);ctx.strokeStyle=rgbaS(TM_COL[st],0.85);ctx.lineWidth=1.2;rr(ctx,o.x0,ym-6,o.x1-o.x0,12,5);ctx.stroke();ctx.restore();});});
    const vline=(x,col)=>{ctx.save();ctx.strokeStyle=rgbaS(col,0.9);ctx.lineWidth=1.6;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(x,o.top);ctx.lineTo(x,o.bot+3);ctx.stroke();ctx.restore();};
    vline(X(TM_CEN),K.gold);vline(X(TM_NOW),K.hot);
    const lc=W.lines.census,lw2=TW(ctx,lc,12);line1(ctx,lc,cl(X(TM_CEN)-lw2/2,o.m,o.x1-lw2),o.bot+18,lw2+2,12,{w:700,color:rgbaS(K.gold,1)});
    line1(ctx,W.lines.today,o.x0,o.top-14,o.x1-o.x0,12,{w:700,align:"right",color:rgbaS(K.hot,1)});
    // the day asked about, and the model's answer for each student that day: a dot for enrolled, a question mark where it's wrong
    ctx.save();ctx.strokeStyle="rgba(255,255,255,0.95)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx,o.top-2);ctx.lineTo(cx,o.bot+4);ctx.stroke();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(cx,o.top-2,5,0,TP);ctx.fill();ctx.restore();
    TM_WHO.forEach((s,i)=>{const ym=o.rows+i*o.rh+o.rh/2,mine=tmSt(s,S.m==="hist"?di:TM_NOW)==="e",real=tmSt(s,di)==="e";
      if(mine){ctx.save();ctx.fillStyle=rgbaS(K.good,1);ctx.strokeStyle="rgba(7,12,24,0.95)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,ym,4.6,0,TP);ctx.fill();ctx.stroke();ctx.restore();}
      if(mine!==real)qmark(ctx,cx+13>o.x1?cx-13:cx+13,ym);});
    [["e",W.legend.e],["w",W.legend.w],["x",W.legend.x],["q",W.legend.q]].forEach(([k,s],j)=>{const p=o.leg.pos[j],x=o.m+p.x,yy=o.legY+p.y;
      if(k==="q")qmark(ctx,x+7,yy+10);else{ctx.fillStyle=rgbaS(TM_COL[k],k==="x"?0.5:0.85);rr(ctx,x,yy+5,14,10,4);ctx.fill();}
      T(ctx,s,x+20,yy+14.5,{w:700,size:12.5,color:rgbaS(K.soft,1)});});
    fourCols(ctx,o.four,W.four,h1);if(h1<0.99)withA(ctx,1-h1,()=>line1(ctx,W.fourOff,o.four.x+12,o.four.y+64,o.four.w-24,13,{w:700,align:"center",color:rgbaS(K.soft,1)}));};
  return{S,lay,draw,readouts:[[W.read.day,()=>date(S.day)],[W.read.n,()=>String(said(S.day))]]};};

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
// A Sharper Sketch's situations draw with its playground's words (the lab "sharpen"): Genie's number beside the census report's; the
// sketch as it was, with the reference's pins; each enrolment's history in four columns; and the sketch's versions
const SKW=()=>(L.labs.find(x=>x.id==="sharpen")||{w:{}}).w;
VIS.gap=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.hot);const m=12,t=GO(S,now),W2=o.lw-m*2,Wl=SKW(),cw=(W2-10)/2;
  [[Wl.cmp.genie,"131",K.hot],[Wl.cmp.report,"118",K.gold]].forEach(([s,n,col],i)=>{const x=m+i*(cw+10);card(ctx,x,14,cw,74,col,s,{glow:8,size:13});
    T(ctx,n,x+12,14+62,{w:800,size:28,color:rgbaS(col,1)});});
  line1(ctx,PK.gap.note,m,14+74+26,W2,13,{w:700,align:"center",color:rgbaS(K.good,1)});
  lines(ctx,PK.gap.ask,m,14+74+54,W2,{size:13,max:2,w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.gap.h=()=>14+74+54+30;
// the sketch as it was, with the reference laid over it: blue pins on what it has, question marks on what it doesn't
VIS.ref=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,ADOPT);const m=12,t=GO(S,now),Wl=SKW(),Bx=Wl.boxes,W2=o.lw-m*2,g=10,bw=Math.min(132,(W2-g*2)/3),bh=30,x0=m+(W2-(bw*3+g*2))/2,top=24,bot=top+bh+34,x2=x0+2*(bw+g);
  ctx.save();ctx.strokeStyle=rgbaS(K.plat,0.5);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0+bw,top+bh/2);ctx.lineTo(x2,top+bh/2);
  ctx.moveTo(x0+bw/2,top+bh);ctx.lineTo(x0+bw/2,bot);ctx.moveTo(x2+bw/2,top+bh);ctx.lineTo(x2+bw/2,bot);ctx.stroke();ctx.restore();
  [[x0,top,Bx.student,"ref"],[x0+bw+g,top,Bx.enrol,"ref"],[x2,top,Bx.cls,"none"],[x0,bot,Bx.course,"ref"],[x2,bot,Bx.term,"none"]].forEach(([x,y,s,k])=>{
    chip(ctx,x,y,bw,bh,s,K.plat,{size:13});pin(ctx,x+bw-3,y+3,k,1);});
  line1(ctx,Wl.census,x2,bot+bh+17,bw,12,{w:700,align:"center",color:rgbaS(K.warm,1)});
  lines(ctx,PK.ref.ask,m,bot+bh+44,W2,{size:13,max:2,w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.ref.h=()=>24+30+34+30+44+30;
// each enrolment's history in four columns
VIS.four=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const m=12,t=GO(S,now),W2=o.lw-m*2;fourCols(ctx,{x:m,y:14,w:W2,h:96},SKW().four,1);
  lines(ctx,PK.four.ask,m,14+96+30,W2,{size:13,max:2,w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.four.h=()=>14+96+30+30;
// the sketch's versions, each with a note on why it changed, the last still to come
VIS.version=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.warm);const m=12,t=GO(S,now),W2=o.lw-m*2,V=PK.version.v,aw=22,pw=(W2-aw*2)/3,y=26,ph=34;
  V.forEach((s,i)=>{const x=m+i*(pw+aw),last=i===V.length-1;chip(ctx,x,y,pw,ph,s,last?K.soft:K.warm,{size:13,glow:last?2:6,a:last?0.7:1});
    if(i)arrow(ctx,x-aw+4,y+ph/2,x-4,y+ph/2,K.soft,0.8,{head:6,lw:1.6});});
  lines(ctx,PK.version.note,m,y+ph+28,W2,{size:12.5,max:2,w:600,align:"center",color:rgbaS(K.soft,1)});
  lines(ctx,PK.version.ask,m,y+ph+70,W2,{size:13,max:2,w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.version.h=()=>26+34+70+30;
})();
