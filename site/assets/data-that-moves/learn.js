/* Learning Data: Data that moves. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one engine:
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
const U=L.ui,P=app.dataset.store||"ld-data-that-moves";
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

/* ---------- 1 · Moving is easy, agreeing is the work: the HR to Finance interface ---------- */
// HR's contracts go to Finance, by a file each teaching period or by a connector and a mirror, and with a contract that says, or
// doesn't, what pay_type means, how a deletion arrives and what's personal. Each row lands in Finance's bin for what Finance reads it
// as: a continuing contract (CON) read without its meaning lands among the casual ones.
PLAY.iface=(Lb,api)=>{const W=Lb.w,R=W.rows,S={way:"file",mean:false,del:false,pers:false,sent:null,sentWay:null,sentMean:false,sentPers:false,cancel:null,cancelDel:false};
  const dur=()=>S.sentWay==="file"?2600:1300,landed=now=>S.sent!=null&&since(now,S.sent)>=dur();
  const binOf=r=>r.pt==="CON"&&!S.sentMean?"CAS":r.pt;
  const r1=api.group(W.wayL);api.seg(r1,W.ways,S.way,k=>{S.way=k;api.say(W.msg[k]);},W.wayL);
  const r2=api.group(W.contractL);
  api.toggle(r2,W.terms.mean,false,v=>{S.mean=v;api.say(v?W.msg.meanOn:W.msg.meanOff);});
  api.toggle(r2,W.terms.del,false,v=>{S.del=v;api.say(v?W.msg.delOn:W.msg.delOff);});
  api.toggle(r2,W.terms.pers,false,v=>{S.pers=v;api.say(v?W.msg.persOn:W.msg.persOff);});
  const r3=api.group();
  api.btn(r3,W.send,()=>{const now=performance.now();Object.assign(S,{sent:now,sentWay:S.way,sentMean:S.mean,sentPers:S.pers,cancel:null});api.kick(dur()+900);
    api.say(S.way==="file"?W.msg.sendFile:W.msg.sendConn);
    setTimeout(()=>{if(S.sent!==now)return;const wrong=R.filter(r=>r.pt==="CON").length;
      const bits=[S.sentWay==="file"?W.msg.landFile:W.msg.landConn,S.sentMean?W.msg.landRight:fill(W.msg.landWrong,{n:wrong}),S.sentPers?W.msg.landHome:W.msg.landLeak];
      api.say(bits.join(" "),S.sentMean&&S.sentPers&&S.sentWay!=="file"?"ok":"warn");
      if(S.sentWay!=="file")api.reach("same");if(S.sentMean)api.reach("right");if(S.sentPers)api.reach("home");api.refresh();},RM()?0:dur());},"go");
  api.btn(r3,W.cancelB,()=>{if(!landed(performance.now())){api.say(W.msg.cancelFirst,"warn");return;}S.cancel=performance.now();S.cancelDel=S.del;api.kick(1600);
    api.say(S.del?W.msg.cancelDel:W.msg.cancelGone,S.del?"ok":"no");if(S.del)api.reach("closed");});
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.hr={x:m,y:12,w:lw-m*2};const labels=R.map(r=>r.ref+" · "+r.pt),f=flow(ctx,labels,o.hr.w-24,12.5,6,26);
    o.chips=f.pos.map(p=>({x:o.hr.x+12+p.x,y:o.hr.y+32+p.y,w:p.w,h:p.h}));o.hr.h=32+f.h+12;
    o.lane={y:o.hr.y+o.hr.h+10,h:104};const fy=o.lane.y+o.lane.h+10,bw=(lw-m*2-24-12)/3;
    o.fin={x:m,y:fy,w:lw-m*2,h:34+5*26+6+34};o.bins=["CAS","FT","CON"].map((k,i)=>({k,x:m+12+i*(bw+6),y:fy+34,w:bw,h:5*26+6}));o.h=fy+o.fin.h+30;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.hr);const L2=o.lane,mid=o.lw/2,on=S.sent!=null,u=on?cl(since(now,S.sent)/dur(),0,1):0,isFile=(on?S.sentWay:S.way)==="file";
    // HR, with its contracts
    card(ctx,o.hr.x,o.hr.y,o.hr.w,o.hr.h,K.hr,W.hrName);
    R.forEach((r,i)=>{const c=o.chips[i],gone=S.cancel!=null&&r.ref===W.cancelId;chip(ctx,c.x,c.y,c.w,c.h,r.ref+" · "+r.pt,K.hr,{size:12.5,strike:gone,a:gone?0.75:1});});
    // the way between: a file, or a connector and a mirror
    const ly=L2.y+L2.h/2;
    if(isFile){const pw=Math.min(240,o.lw-o.m*2-40);ctx.save();ctx.fillStyle="rgba(239,232,218,0.95)";rr(ctx,mid-pw/2,L2.y+28,pw,L2.h-40,6);ctx.fill();ctx.restore();
      line1(ctx,W.fileName,mid-pw/2+10,L2.y+50,pw-20,13,{w:800,color:"rgba(40,40,48,0.95)"});line1(ctx,W.fileSub,mid-pw/2+10,L2.y+70,pw-20,12.5,{w:600,color:"rgba(40,40,48,0.85)"});}
    else{const cw=Math.min(200,(o.lw-o.m*2-30)/2),gx=10;chip(ctx,mid-cw-gx,L2.y+30,cw,40,W.connName,K.plat,{size:13});chip(ctx,mid+gx,L2.y+30,cw,40,W.mirrorName,K.plat,{size:13});
      arrow(ctx,mid-gx+2,L2.y+50,mid+gx-2,L2.y+50,K.plat,0.9,{head:6});line1(ctx,W.connSub,o.m+4,L2.y+L2.h-8,o.lw-o.m*2-8,12.5,{w:600,align:"center",color:rgbaS(K.soft,1)});}
    const terms=[S.mean,S.del,S.pers].filter(Boolean).length;pill(ctx,o.lw-o.m,L2.y,fill(W.agreed,{n:terms,of:3}),terms===3?K.good:K.gold,{align:"right",size:12});
    // Finance, and its bins
    card(ctx,o.fin.x,o.fin.y,o.fin.w,o.fin.h,K.fin,W.finName);
    const fill2={CAS:0,FT:0,CON:0};
    o.bins.forEach(b=>{glass(ctx,b.x,b.y,b.w,b.h,8,K.fin,{fill:"rgba(7,12,24,0.88)",glow:0,ea:0.4});line1(ctx,W.bins[b.k],b.x+6,b.y+b.h-8,b.w-12,12.5,{w:700,align:"center",color:rgbaS(K.soft,1)});});
    if(on){R.forEach((r,i)=>{const c=o.chips[i],bk=binOf(r),b=o.bins.find(x=>x.k===bk),slot=fill2[bk]++,tx=b.x+5,ty=b.y+5+slot*26,tw_=b.w-10,
        // its own moment: each row sets off a little after the one before; a file stops a while at Finance's desk, being worked out
        d=i*0.06,v=cl((u-d)/(1-0.24),0,1),pause=isFile?0.35:0,p=v<0.5-pause/2?v/(1-pause):v>0.5+pause/2?(v-pause)/(1-pause):0.5;
        const x=p<0.5?lp(c.x,mid-tw_/2,ei(p*2)):lp(mid-tw_/2,tx,ei((p-0.5)*2)),y=p<0.5?lp(c.y,ly-11,ei(p*2)):lp(ly-11,ty,ei((p-0.5)*2));
        const wrong=r.pt==="CON"&&!S.sentMean,closed=S.cancel!=null&&S.cancelDel&&r.ref===W.cancelId&&since(now,S.cancel)>900;
        if(p<1)tile(ctx,x,y,tw_,22,r.ref,K.hr,{size:12.5});
        else tile(ctx,tx,ty,tw_,22,r.ref,closed?K.soft:K.hr,{size:12.5,edge:wrong?K.bad:null,mark:wrong?"no":closed?null:"ok",a:closed?0.6:1,strike:closed});});
      if(isFile&&u>0.3&&u<0.72)pill(ctx,mid,ly+16,W.decoding,K.gold,{align:"center",size:12});
      if(!S.sentPers&&u>=1)pill(ctx,o.lw/2,o.fin.y+o.fin.h-27,W.leak,K.bad,{align:"center",size:12,max:o.fin.w-24});
      // a cancellation that arrives as a change, with its time
      if(S.cancel!=null&&S.cancelDel){const t=cl(since(now,S.cancel)/900,0,1),c=o.chips[R.findIndex(r=>r.ref===W.cancelId)];const cw2=Math.ceil(TW(ctx,W.change,12))+20;if(t<1)tile(ctx,lp(c.x,mid-cw2/2,ei(t)),lp(c.y,ly-11,ei(t)),cw2,22,W.change,K.gold,{size:12});}}
    else line1(ctx,W.waiting,o.fin.x+12,o.fin.y+o.fin.h-12,o.fin.w-24,12.5,{w:600,color:rgbaS(K.soft,1)});};
  return{S,lay,draw,readouts:[[W.read.when,()=>S.sent==null?"–":S.sentWay==="file"?W.read.days:W.read.day],
    [W.read.wrong,()=>S.sent==null?"–":String(S.sentMean?0:R.filter(r=>r.pt==="CON").length)],
    [W.read.bank,()=>S.sent==null?"–":S.sentPers?W.read.no:W.read.yes],
    [W.read.open,()=>S.cancel==null?"–":S.cancelDel?"0":"1"]]};};

/* ---------- 2 · Hot, warm, cold: in time to act ---------- */
// Three kinds of data, each on a day's line: when it changes, when it arrives at the speed picked for it, and when someone acts on it.
// Run the day: a cursor crosses the line, and each lane says whether it came in time. A cost meter adds up the three speeds. Below,
// Auto Loader reads files as they land, by schedule or by hand (triggered), or on its own as each lands (continuous).
PLAY.fresh=(Lb,api)=>{const W=Lb.w,Kd=W.kinds,S={sp:{},run:null,ran:null,al:"trig",files:[],alRun:null};Kd.forEach(k=>S.sp[k.key]="night");
  const ARR={night:k=>k.change<2?2:26,five:k=>k.change+5/60,event:k=>k.change+1/3600},cost=()=>Kd.reduce((a,k)=>a+W.cost[S.sp[k.key]],0);
  const inTime=(k,sp)=>ARR[sp](k)<=k.act,DUR=5200,H0=0,H1=27;
  Kd.forEach(k=>{const r=api.group(k.name);api.seg(r,W.speeds,"night",v=>{S.sp[k.key]=v;api.say(fill(W.msg.set,{k:k.short,s:W.speeds.find(x=>x[0]===v)[1].toLowerCase()}));api.kick(200);},k.name);});
  const rr_=api.group();api.btn(rr_,W.runB,()=>{S.run=performance.now();S.ran=Object.assign({},S.sp);api.kick(DUR+600);api.say(W.msg.running);
    const t0=S.run;setTimeout(()=>{if(S.run!==t0)return;const late=Kd.filter(k=>!inTime(k,S.ran[k.key]));
      const bits=Kd.map(k=>{const ok=inTime(k,S.ran[k.key]),m=W.msg[k.key];return ok?(S.ran[k.key]===k.best?m.ok:m.over):m.late;});
      const best=Kd.every(k=>S.ran[k.key]===k.best);bits.push(best?W.msg.best:late.length?"":fill(W.msg.dear,{c:cost()}));
      api.say(bits.filter(Boolean).join(" "),late.length?"warn":"ok");
      if(inTime(Kd.find(k=>k.key==="contract"),S.ran.contract))api.reach("tutors");if(inTime(Kd.find(k=>k.key==="bank"),S.ran.bank))api.reach("held");if(best)api.reach("cheap");api.refresh();},RM()?0:DUR);},"go");
  // Auto Loader: triggered or continuous
  const ra=api.group(W.alL),runB={};api.seg(ra,W.alModes,"trig",v=>{S.al=v;S.pulse=performance.now();api.kick(4000);if(runB.b)runB.b.disabled=v==="cont";api.say(v==="cont"?W.msg.contOn:W.msg.trigOn);if(v==="cont")readAll();api.kick(1200);},W.alL);
  const ra2=api.group();api.btn(ra2,W.landB,()=>{const now=performance.now();if(S.files.filter(f=>!f.read).length>=6){api.say(W.msg.full,"warn");return;}S.files=S.files.filter(f=>!f.read||now-f.read<1500).slice(-5);
    S.files.push({t0:now,read:null});api.kick(1400);if(S.al==="cont"){S.pulse=now;api.kick(4000);}if(S.al==="cont"){setTimeout(()=>readAll(true),RM()?0:700);api.say(W.msg.landCont);}else api.say(W.msg.landTrig);});
  runB.b=api.btn(ra2,W.alRunB,()=>{const n=S.files.filter(f=>!f.read).length;if(!n){api.say(W.msg.noFiles);return;}readAll();api.say(fill(W.msg.readTrig,{n}),"ok");});
  function readAll(auto){const now=performance.now(),todo=S.files.filter(f=>!f.read);if(!todo.length)return;todo.forEach((f,i)=>f.read=now+i*180);S.alRun=now;api.kick(1600+todo.length*180);
    if(auto){api.say(fill(W.msg.readCont,{n:todo.length}),"ok");api.reach("auto");}api.refresh();}
  const lay=(lw,ctx)=>{const m=12,o={lw,m,x0:m+8,x1:lw-m-8,lanes:[]};let y=14;
    Kd.forEach(k=>{o.lanes.push({k,y,h:76});y+=82;});o.axis=y+4;o.al={y:o.axis+34,h:120};o.h=o.al.y+o.al.h+12;return o;};
  const X=(o,hr)=>lp(o.x0,o.x1,(cl(hr,H0,H1)-H0)/(H1-H0));
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.hot);const run=S.run!=null,u=run?cl(since(now,S.run)/DUR,0,1):0,hrNow=lp(H0,H1,u),sp=run?S.ran:S.sp;
    o.lanes.forEach(({k,y,h:hh})=>{const col=K[W.tone[sp[k.key]]],sl=W.speeds.find(x=>x[0]===sp[k.key])[1];card(ctx,o.m,y,o.lw-o.m*2,hh,col,k.name,{glow:6,right:TW(ctx,sl,12)+30,size:13.5});
      pill(ctx,o.lw-o.m-8,y+6,sl,col,{align:"right",size:12});
      const ly=y+hh-22;ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.4);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(o.x0,ly);ctx.lineTo(o.x1,ly);ctx.stroke();ctx.restore();
      // when it changes, and when someone acts on it
      const xc=X(o,k.change),xa=X(o,k.act),arr=ARR[sp[k.key]](k),xr=X(o,arr),ok=arr<=k.act,seen=run&&hrNow>=Math.min(arr,H1);
      ctx.save();ctx.fillStyle=rgbaS(K.ink,0.95);ctx.beginPath();ctx.arc(xc,ly,4.5,0,TP);ctx.fill();ctx.restore();
      ctx.save();ctx.strokeStyle=rgbaS(K.gold,0.95);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(xa,ly-9);ctx.lineTo(xa,ly+5);ctx.stroke();ctx.restore();
      const lab=k.actL,lw_=TW(ctx,lab,12);T(ctx,lab,cl(xa,o.x0+lw_/2,o.x1-lw_/2),ly+16,{w:700,size:12,align:"center",color:rgbaS(K.gold,1)});
      if(run&&hrNow>=k.change){const t=cl((hrNow-k.change)/Math.max(0.0001,Math.min(arr,H1)-k.change),0,1);ctx.save();ctx.strokeStyle=rgbaS(col,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(xc,ly);ctx.lineTo(lp(xc,xr,t),ly);ctx.stroke();ctx.restore();}
      if(seen){ctx.save();ctx.fillStyle=rgbaS(ok?K.good:K.bad,1);ctx.beginPath();ctx.arc(xr,ly,5.5,0,TP);ctx.fill();ctx.restore();if(xr>=o.x1-2)arrow(ctx,o.x1-14,ly,o.x1+2,ly,K.bad,1,{head:6});
        mark(ctx,cl(xr,o.x0+10,o.x1-10),ly-14,ok?"ok":"no");}});
    // the hours, and the cursor of the day being run
    [0,6,12,18,24].forEach(t=>{const x=X(o,t);T(ctx,W.hours[t/6],cl(x,o.x0+14,o.x1-14),o.axis+12,{w:600,size:12,align:"center",color:rgbaS(K.soft,1)});});
    T(ctx,W.nextDay,o.x1,o.axis+26,{w:600,size:12,align:"right",color:rgbaS(K.soft,0.9)});
    if(run&&u<1){const x=X(o,hrNow);ctx.save();ctx.strokeStyle=rgbaS(K.ink,0.6);ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(x,10);ctx.lineTo(x,o.axis);ctx.stroke();ctx.restore();}
    // Auto Loader
    const A=o.al,cont=S.al==="cont",zw=Math.min(160,(o.lw-o.m*2)*0.35),aw=Math.min(150,(o.lw-o.m*2)*0.31),bw=Math.min(120,(o.lw-o.m*2)*0.25),gap=(o.lw-o.m*2-zw-aw-bw)/2;
    const zx=o.m,ax=zx+zw+gap,bx=ax+aw+gap;
    card(ctx,zx,A.y,zw,A.h,K.warm,W.zone,{glow:4,size:12.5});card(ctx,bx,A.y,bw,A.h,K.bronze,W.bronze,{glow:4,size:12.5});
    const busy=S.files.some(f=>f.read&&now<f.read+900);chip(ctx,ax,A.y+20,aw,40,"Auto Loader",cont?K.good:K.plat,{size:13.5,glow:cont||busy?14:6});
    line1(ctx,cont?W.alCont:W.alTrig,ax,A.y+80,aw,12.5,{w:700,align:"center",color:rgbaS(cont?K.good:K.soft,1)});
    if(cont){const live=S.pulse!=null&&now-S.pulse<4000&&!RM(),p=live?(now/900)%1:0.35;ctx.save();ctx.strokeStyle=rgbaS(K.good,0.5*(1-p));ctx.lineWidth=2;ctx.beginPath();ctx.arc(ax+aw/2,A.y+40,24+p*14,0,TP);ctx.stroke();ctx.restore();}
    arrow(ctx,zx+zw+4,A.y+40,ax-4,A.y+40,K.soft,0.6,{dash:[4,4],head:6});arrow(ctx,ax+aw+4,A.y+40,bx-4,A.y+40,K.soft,0.6,{dash:[4,4],head:6});
    let nb=0;S.files.forEach((f,i)=>{const sl=i%6,fx=zx+10+(sl%3)*((zw-20)/3),fy=A.y+34+Math.floor(sl/3)*30,fw=(zw-20)/3-6,t=cl(since(now,f.t0)/500,0,1);
      if(f.read&&now>=f.read){const v=cl((now-f.read)/800,0,1);if(v<1)tile(ctx,lp(fx,bx+10,ei(v)),lp(fy,A.y+40,ei(v)),fw,22,"",K.warm);else nb++;tile(ctx,fx,fy,fw,22,"",K.soft,{a:0.35});}
      else tile(ctx,fx,lp(fy-24,fy,eo(t)),fw,22,"",K.warm,{a:t});});
    for(let j=0;j<Math.min(nb,8);j++)tile(ctx,bx+10+(j%2)*((bw-20)/2),A.y+34+Math.floor(j/2)*20,(bw-20)/2-4,16,"",K.bronze);};
  return{S,lay,draw,readouts:[[W.read.cost,()=>fill(W.costV,{c:cost()})],[W.read.al,()=>S.al==="cont"?W.read.allDay:W.read.minutes],
    [W.read.waiting,()=>String(S.files.filter(f=>!f.read).length)]]};};

/* ---------- 3 · One copy, one platform: one row, read by all ---------- */
// Linh's claim, in the usual design (the app's own database, a pipeline every hour to a copy, and readers on the copy) or as one row
// on one platform, read through the catalog. A correction reaches the readers at once, or an hour later; Finance's heavy report, the
// table's writers, and the one thing that leaves the platform on purpose: the hours to pay, to the payroll system the university buys.
PLAY.copy=(Lb,api)=>{const W=Lb.w,S={design:"usual",hrs:6,copy:6,changed:null,lag:2400,clash:null,rep:null,fw:false,ct:false,sent:null,sentOk:false};
  const readerHrs=now=>S.design==="one"?S.hrs:(S.changed!=null&&since(now,S.changed)<S.lag?S.copy:S.hrs);
  const r1=api.group(W.designL);api.seg(r1,W.designs,"usual",v=>{S.design=v;S.copy=S.hrs;S.changed=null;S.clash=null;api.say(v==="one"?W.msg.one:W.msg.usual);api.kick(600);},W.designL);
  const r2=api.group();
  api.btn(r2,W.correctB,()=>{const now=performance.now();if(S.hrs===4){S.hrs=6;S.copy=6;S.changed=null;api.say(W.msg.back);api.kick(400);return;}
    S.copy=S.hrs;S.hrs=4;S.changed=now;S.clash=null;api.kick(S.lag+800);
    if(S.design==="one"){api.say(W.msg.correctOne,"ok");api.reach("once");}else{api.say(W.msg.correctUsual,"warn");setTimeout(()=>{if(S.changed===now)api.say(W.msg.caughtUp);api.refresh();},RM()?0:S.lag);}},"go");
  api.btn(r2,W.reportB,()=>{S.rep=performance.now();api.kick(1800);if(S.design==="one"){api.say(W.msg.reportOne,"ok");api.reach("fast");}else api.say(W.msg.reportUsual,"warn");});
  const r3=api.group(W.writersL);
  api.toggle(r3,W.fwT,false,v=>{S.fw=v;S.clash=null;api.say(v?W.msg.fwOn:W.msg.fwOff);api.kick(300);});
  api.btn(r3,W.finB,()=>{if(S.fw){S.clash=performance.now();api.kick(1600);api.say(W.msg.clash,"no");}else{S.clash=null;api.say(W.msg.oneWriter,"ok");api.reach("writer");}});
  const r4=api.group(W.payL);
  api.toggle(r4,W.ctT,false,v=>{S.ct=v;api.say(v?W.msg.ctOn:W.msg.ctOff);});
  api.btn(r4,W.sendB,()=>{S.sent=performance.now();S.sentOk=S.ct;api.kick(1800);api.say(S.ct?W.msg.sendOk:W.msg.sendNo,S.ct?"ok":"warn");if(S.ct)api.reach("moves");});
  const lay=(lw,ctx)=>{const m=12,o={lw,m};o.app={x:m,y:12,w:lw-m*2,h:96};o.mid={y:o.app.y+o.app.h+12,h:64};const ry=o.mid.y+o.mid.h+12,n=W.readers.length,rw=(lw-m*2-(n-1)*8)/n;
    o.rd=W.readers.map((s,i)=>({x:m+i*(rw+8),y:ry,w:rw,h:78}));o.pay={y:ry+78+14,h:52};o.h=o.pay.y+o.pay.h+12;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.gold);const one=S.design==="one",A=o.app,hrs=readerHrs(now),clash=S.clash!=null;
    card(ctx,A.x,A.y,A.w,A.h,K.hr,one?W.appOne:W.appUsual);
    // the claim: one row
    const rw=Math.min(A.w-24,360),rx=A.x+(A.w-rw)/2,ry=A.y+34,flick=clash&&Math.floor(since(now,S.clash)/240)%2;
    chip(ctx,rx,ry,rw,34,fill(W.row,{h:flick?5:S.hrs}),clash?K.bad:K.gold,{size:13.5,glow:S.changed!=null&&since(now,S.changed)<700?16:8});
    line1(ctx,clash?W.twoWriters:one?W.oneForm:W.ownDb,A.x+12,A.y+A.h-10,A.w-24,12.5,{w:600,align:"center",color:rgbaS(clash?K.bad:K.soft,1)});
    // between: a pipeline and its copy, or the catalog everyone reads through
    const M=o.mid,cx=o.lw/2;
    if(one){chip(ctx,o.m,M.y+12,o.lw-o.m*2,40,W.catalog,K.plat,{size:13.5,tint:0.1});}
    else{const cw=Math.min(220,(o.lw-o.m*2)*0.55);chip(ctx,cx-cw/2,M.y+12,cw,40,fill(W.copyRow,{h:hrs}),S.changed!=null&&since(now,S.changed)<S.lag?K.bad:K.plat,{size:13});
      if(S.changed!=null&&since(now,S.changed)<S.lag){const t=cl(since(now,S.changed)/S.lag,0,1);ctx.save();ctx.strokeStyle=rgbaS(K.warm,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx+cw/2+18,M.y+32,10,-Math.PI/2,-Math.PI/2+TP*t);ctx.stroke();ctx.restore();api.kick(100);}}
    arrow(ctx,cx,A.y+A.h+2,cx,M.y+10,K.soft,0.7,{head:6,dash:one?null:[4,4]});
    // the readers: each shows the hours it sees
    o.rd.forEach((r,i)=>{const rep=i===2&&S.rep!=null&&since(now,S.rep)<1400;arrow(ctx,lp(o.m+30,o.lw-o.m-30,(i+0.5)/o.rd.length),M.y+M.h-8,r.x+r.w/2,r.y-2,K.soft,0.55,{head:6});
      card(ctx,r.x,r.y,r.w,r.h,rep?K.gold:K.plat,"",{glow:rep?14:6});lines(ctx,W.readers[i],r.x+8,r.y+18,r.w-16,{size:12.5,max:2,align:"center",color:rgbaS(K.soft,1)});
      const bad=hrs!==S.hrs;T(ctx,fill(W.hrsL,{h:hrs}),r.x+r.w/2,r.y+r.h-14,{w:800,size:16,align:"center",color:rgbaS(bad?K.bad:K.ink,1)});});
    // what leaves the platform on purpose: the hours to pay, to payroll's own system
    const Y=o.pay,pw=Math.min(210,(o.lw-o.m*2)*0.5);chip(ctx,o.lw-o.m-pw,Y.y+6,pw,40,W.payroll,K.fin,{size:13});
    line1(ctx,S.ct?W.ctYes:W.ctNo,o.m,Y.y+30,o.lw-o.m*2-pw-14,12.5,{w:700,color:rgbaS(S.ct?K.good:K.soft,1)});
    if(S.sent!=null){const t=cl(since(now,S.sent)/1000,0,1);if(t<1)tile(ctx,lp(o.m,o.lw-o.m-pw-60,ei(t)),Y.y+15,56,22,W.hoursTile,K.gold,{size:12});else mark(ctx,o.lw-o.m-pw+4,Y.y+8,S.sentOk?"ok":"no");}};
  return{S,lay,draw,readouts:[[W.read.copies,()=>S.design==="one"?"1":"2"],[W.read.agree,()=>readerHrs(performance.now())===S.hrs?W.read.yes:W.read.no],
    [W.read.writers,()=>S.fw?"2":"1"]]};};

/* ---------- 4 · Read often, kept close: kept where it's read ---------- */
// A pay record file for each year, 2016 to this year, on the hot tier (cheap to read, costly to keep) or the archive tier (cheap to
// keep, hours to bring back), or deleted. Two rules move them: when a file goes to the archive, and when it's deleted. A payslip
// question reads this year; an auditor asks for an older year.
PLAY.tiers=(Lb,api)=>{const W=Lb.w,NOW=W.now,YEARS=[];for(let y=NOW-10;y<=NOW;y++)YEARS.push(y);
  const S={arch:"never",del:"never",moved:performance.now()-1e5,ask:null,askYear:null,askOk:false};
  const where=y=>{const age=NOW-y;if(S.del==="seven"&&age>=7||S.del==="three"&&age>=3)return"del";if(S.arch==="now"||S.arch==="year"&&age>=1)return"arch";return"hot";};
  const bill=()=>{const c=YEARS.reduce((a,y)=>a+(where(y)==="hot"?10:where(y)==="arch"?1:0),0);return Math.round(c/(YEARS.length*10)*100);};
  const past=()=>YEARS.filter(y=>NOW-y>=7&&where(y)!=="del").length;
  const r1=api.group(W.archL);api.seg(r1,W.archs,"never",v=>{S.arch=v;S.moved=performance.now();api.kick(1200);api.say(fill(W.msg["arch_"+v],{b:bill()}));if(v==="year")api.reach("cost");},W.archL);
  const r2=api.group(W.delL);api.seg(r2,W.dels,"never",v=>{S.del=v;S.moved=performance.now();api.kick(1200);api.say(W.msg["del_"+v],v==="seven"?"ok":"warn");if(v==="seven")api.reach("seven");},W.delL);
  const r3=api.group();
  api.btn(r3,W.payslipB,()=>{S.ask=performance.now();S.askYear=NOW;const w=where(NOW);S.askOk=w==="hot";api.kick(1600);api.say(w==="hot"?W.msg.payslipHot:W.msg.payslipArch,w==="hot"?"ok":"no");if(w==="hot")api.reach("quick");},"go");
  api.btn(r3,fill(W.auditB,{y:W.auditYear}),()=>{const y=W.auditYear,w=where(y);S.ask=performance.now();S.askYear=y;S.askOk=w!=="del";api.kick(1600);
    api.say(w==="del"?W.msg.auditGone:w==="arch"?W.msg.auditArch:W.msg.auditHot,w==="del"?"no":"ok");if(w!=="del")api.reach("audit");});
  const lay=(lw,ctx)=>{const m=12,o={lw,m},cw=58,cols=Math.max(4,Math.floor((lw-m*2-24+6)/(cw+6))),rows=Math.ceil(YEARS.length/cols),sh=36+rows*30+6;
    o.cols=cols;o.cw=(lw-m*2-24-(cols-1)*6)/cols;o.shelf={};let y=12;["hot","arch","del"].forEach(k=>{o.shelf[k]={y,h:k==="del"?36+Math.ceil(YEARS.length/cols)*30+6:sh};y+=o.shelf[k].h+10;});o.h=y+2;return o;};
  const slot=(o,k,i)=>({x:o.m+12+(i%o.cols)*(o.cw+6),y:o.shelf[k].y+34+Math.floor(i/o.cols)*30});
  const pos={};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,K.arch);const cols={hot:K.hot,arch:K.arch,del:K.soft};
    ["hot","arch","del"].forEach(k=>{const s=o.shelf[k];card(ctx,o.m,s.y,o.lw-o.m*2,s.h,cols[k],W.shelves[k],{glow:k==="del"?0:6,dash:k==="del",right:o.lw>=440?220:0,size:13.5});
      if(W.shelfSub[k]&&o.lw>=440)line1(ctx,W.shelfSub[k],o.lw-o.m-12-210,s.y+21,210,12.5,{w:600,align:"right",color:rgbaS(K.soft,1)});});
    const n={hot:0,arch:0,del:0},t=cl(since(now,S.moved)/900,0,1);
    YEARS.forEach(y=>{const k=where(y),p=slot(o,k,n[k]++),was=pos[y]||p,x=lp(was.x,p.x,ei(t)),yy=lp(was.y,p.y,ei(t));if(t>=1)pos[y]=p;
      const old=NOW-y>=7&&k!=="del",asked=S.askYear===y&&S.ask!=null&&since(now,S.ask)<1500;
      tile(ctx,x,yy,o.cw,24,String(y),k==="del"?K.soft:cols[k],{size:13,edge:old?K.warm:asked?(S.askOk?K.good:K.bad):null,a:k==="del"?0.45:1,mark:asked?(S.askOk?"ok":"no"):null});
      if(t<1)api.kick(60);});};
  return{S,lay,draw,readouts:[[W.read.bill,()=>fill(W.billV,{b:bill()})],[W.read.past,()=>String(past())],[W.read.read,()=>S.ask==null?"–":S.askOk?(where(S.askYear)==="hot"?W.read.secs:W.read.hours):W.read.gone]]};};

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
// two systems, and the interface between them, where the contract is agreed
VIS.iface=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.hr);const m=12,w=(o.lw-m*2-70)/2,t=GO(S,now);card(ctx,m,30,w,90,K.hr,PK.iface.a);card(ctx,o.lw-m-w,30,w,90,K.fin,PK.iface.b);
  arrow(ctx,m+w+6,75,o.lw-m-w-6,75,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[4,4],lw:t>0?2.6:2});line1(ctx,PK.iface.mid,m,150,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.iface.h=()=>172;
// three kinds of data, each with when someone acts on it
VIS.fresh=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.hot);const m=12,t=GO(S,now),cols=[K.cold,K.warm,K.hot];PK.fresh.rows.forEach((r,i)=>{const y=14+i*52;card(ctx,m,y,o.lw-m*2,44,cols[i],r[0],{glow:t>0?10:4,right:120,size:13.5});
  pill(ctx,o.lw-m-8,y+10,r[1],cols[i],{align:"right",size:12});});};
VIS.fresh.h=()=>14+3*52+4;
// one row, and the readers that read it where it's written
VIS.copy=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const m=12,t=GO(S,now),rw=Math.min(300,o.lw-m*2);chip(ctx,(o.lw-rw)/2,14,rw,38,PK.copy.row,K.gold,{size:14,glow:t>0?14:6});
  const n=PK.copy.readers.length,w=(o.lw-m*2-(n-1)*8)/n;PK.copy.readers.forEach((s,i)=>{const x=m+i*(w+8);arrow(ctx,o.lw/2,54,x+w/2,104,t>0?K.gold:K.soft,0.8,{head:6,dash:t>=1?null:[4,4]});chip(ctx,x,108,w,40,s,K.plat,{size:13});});};
VIS.copy.h=()=>162;
// the tiers, and a file's years moving down them
VIS.tiers=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.arch);const m=12,t=GO(S,now),cols=[K.hot,K.arch,K.soft];PK.tiers.rows.forEach((r,i)=>{const y=14+i*50;card(ctx,m,y,o.lw-m*2,42,cols[i],r,{glow:4,dash:i===2,size:13.5});});
  arrow(ctx,o.lw-m-24,30,o.lw-m-24,30+100,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[4,4],lw:t>0?2.6:2});};
VIS.tiers.h=()=>14+3*50+4;
})();
