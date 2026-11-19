/* Learning Data: Leading data people. The labs (Take it apart) and the scenarios (Make the call) of each of the module's series, from
   one engine: a series' labs page and scenarios page load the series' words (site/assets/<series>/learn.en.js or learn.es.js, which
   set window.LDP) and this file. It draws everything itself, so the pages load no film.
   Every lab is a decision playground (kind "weeks"), one for each film, as the author set on 18 November 2026: the visitor makes the
   choices a leader in the film faces, plays the weeks, and watches what the choices do to the people and the work, week by week; each
   playground has three to five experiments (w.goals), each ticked when the visitor makes it happen, and its end once all are ticked.
   A playground is all words and numbers in its pack, read here by one set of rules:
     w.choices  [{k, label, v (the first pick), picks:[[key, label, what it means]]}]
     w.meters   [{k, name, c (colour), v0 (where it starts, 0 to 100)}], each moved week by week by the picks:
     w.fx       {"<choice>=<pick>": {meter: change each week}}, and w.late [{when, from (a week), fx}] for what shows only later
     w.people   [{name, m (the meter their face follows), inv (true when a higher meter means a harder week for them)}]
     w.events   [{when, wk, t, tone ("ok", "warn" or "no")}], what happens in a week, when its condition holds
     w.goals    [[key, words, when]]: an experiment, ticked when a run ends and its condition holds
   A condition is tokens joined by "&": "<choice>=<pick>" (or several picks, "a/b"), "<choice>!=<pick>", or "<meter>>=<n>" and
   "<meter><=<n>", read at the event's week, or at the run's end.
   The scenarios are the series' evaluation, every one a choice, its options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them). Each one's picture shows the people in it, whose faces answer the pick.
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its words stay
   big enough to read on a phone. Things move and settle, or jump to where they end when the visitor asks for reduced motion, and every
   change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films), both from
   site-tools/build_series.py. Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments)
   and "quiz" (answers by scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.LDP,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-leading-data-people";
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
const filmN=n=>fill(U.filmN,{n,of:Object.keys(FILMS).length||L.films||4});

/* ---------- drawing: ink on paper, like the films' notes ---------- */
const TP=Math.PI*2,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lp=(a,b,t)=>a+(b-a)*t;
const eo=u=>1-Math.pow(1-cl(u,0,1),3),ei=u=>{u=cl(u,0,1);return u<0.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;};
const rgb=s=>{const n=parseInt(String(s).slice(1),16);return[n>>16&255,n>>8&255,n&255];};
const rgbaS=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")",mixC=(a,b,t)=>[lp(a[0],b[0],t),lp(a[1],b[1],t),lp(a[2],b[2],t)];
// the paper, the ink, and the tones of what happens: went well, a warning, went wrong; gold for what the visitor just did
const K={paper:[247,242,231],paper2:[238,231,215],ink:[43,42,51],soft:[104,99,116],line:[196,186,166],ok:[46,138,92],warn:[196,122,20],no:[196,64,52],gold:[201,146,24]};
const TONE={ok:K.ok,warn:K.warn,no:K.no};
const FONT=(z,wt)=>(wt||700)+" "+z+"px Manrope, system-ui, -apple-system, 'Segoe UI', sans-serif";
const TW=(ctx,s,z,wt)=>{ctx.font=FONT(z,wt);return ctx.measureText(String(s)).width;};
function T(ctx,s,x,y,o){o=o||{};ctx.font=FONT(o.size||13,o.w);ctx.textAlign=o.align||"left";ctx.textBaseline="alphabetic";ctx.fillStyle=o.color||rgbaS(K.ink,1);ctx.fillText(String(s),x,y);}
// words a picture had to cut short, for smoke.py's series-learn check (site-tools/smoke/<series>.js)
const MISS=window.LDP_MISS=new Set();
// one line that fits a width: smaller, down to 12, then cut short
function fit1(ctx,s,w,z,wt){s=String(s);let k=z;while(k>12&&TW(ctx,s,k,wt)>w)k-=0.5;if(TW(ctx,s,k,wt)<=w)return[s,k];MISS.add(s);let t=s;while(t.length>2&&TW(ctx,t+"…",k,wt)>w)t=t.slice(0,-1);return[t+"…",k];}
// lines that fit a width, at most max of them, a little smaller if need be (down to 12); remembered, since pictures repaint as they move
const FIT=new Map();
function wrap(ctx,s,w,z,wt){const out=[];let cur="";String(s).split(" ").forEach(wd=>{const t=cur?cur+" "+wd:wd;if(cur&&TW(ctx,t,z,wt)>w){out.push(cur);cur=wd;}else cur=t;});if(cur)out.push(cur);return out;}
function fitL(ctx,s,w,z,max,wt){s=String(s);const key=s+"|"+Math.round(w)+"|"+z+"|"+max+"|"+(wt||700);if(FIT.has(key)){const c=FIT.get(key);if(c.miss)MISS.add(s);return c;}
  let r=null;for(let k=z;k>=12-0.01&&!r;k-=0.5){const ls=wrap(ctx,s,w,k,wt);if(ls.length<=max&&ls.every(l=>TW(ctx,l,k,wt)<=w+0.5))r=[ls,k];}
  if(!r){r=[wrap(ctx,s,w,12,wt).slice(0,max),12];r.miss=1;MISS.add(s);}if(FIT.size>4000)FIT.clear();FIT.set(key,r);return r;}
function line1(ctx,s,x,y,w,z,o){o=o||{};const[t,k]=fit1(ctx,s,w,z,o.w);T(ctx,t,o.align==="center"?x+w/2:o.align==="right"?x+w:x,y,{w:o.w||700,size:k,align:o.align,color:o.color});}
function lines(ctx,s,x,y,w,o){o=o||{};const[ls,z]=fitL(ctx,s,w,o.size||13,o.max||2,o.w),lh=z*1.25;ls.forEach((l,i)=>T(ctx,l,o.align==="center"?x+w/2:x,y+i*lh,{w:o.w||600,size:z,align:o.align,color:o.color}));return ls.length*lh;}
function rr(ctx,x,y,w,hh,r){r=Math.min(r,w/2,hh/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+hh,r);ctx.arcTo(x+w,y+hh,x,y+hh,r);ctx.arcTo(x,y+hh,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function withA(ctx,a,f){ctx.save();ctx.globalAlpha*=cl(a,0,1);f();ctx.restore();}
// the paper: a warm sheet with faint rules, as in a notebook
function paper(ctx,w,hh){ctx.fillStyle=rgbaS(K.paper,1);ctx.fillRect(0,0,w,hh);ctx.strokeStyle=rgbaS(K.line,0.35);ctx.lineWidth=1;
  for(let y=26;y<hh;y+=26){ctx.beginPath();ctx.moveTo(0,y+0.5);ctx.lineTo(w,y+0.5);ctx.stroke();}}
// an ink line that wobbles a little, as a pen draws it
function inkLine(ctx,pts,col,lw,o){o=o||{};if(pts.length<2)return;ctx.save();ctx.strokeStyle=rgbaS(col,o.a==null?1:o.a);ctx.lineWidth=lw;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;ctx.quadraticCurveTo(a[0],a[1],mx,my);if(i===pts.length-1)ctx.lineTo(b[0],b[1]);}ctx.stroke();ctx.restore();}
// a person's face in a round frame, like a photo pinned to a team's wall: mood from -1 (a hard week) to 1 (a good one)
function face(ctx,x,y,r,col,mood,o){o=o||{};const c=rgb(col),hair=mixC(c,K.ink,0.55),skin=mixC(c,K.paper,0.55);ctx.save();
  ctx.fillStyle=rgbaS(mixC(c,K.paper,0.78),1);ctx.beginPath();ctx.arc(x,y,r,0,TP);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r-1,0,TP);ctx.clip();
  // shoulders, then the head and its hair
  ctx.fillStyle=rgbaS(c,0.9);ctx.beginPath();ctx.ellipse(x,y+r*1.02,r*0.78,r*0.5,0,0,TP);ctx.fill();
  ctx.fillStyle=rgbaS(skin,1);ctx.beginPath();ctx.ellipse(x,y-r*0.06,r*0.42,r*0.5,0,0,TP);ctx.fill();
  ctx.fillStyle=rgbaS(hair,1);ctx.beginPath();ctx.ellipse(x,y-r*0.36,r*0.45,r*0.26,0,Math.PI,TP);ctx.fill();ctx.restore();
  // eyes, and a mouth that follows the week
  const m=cl(mood,-1,1),ey=y-r*0.1;ctx.fillStyle=rgbaS(K.ink,1);[-1,1].forEach(s=>{ctx.beginPath();ctx.arc(x+s*r*0.16,ey,Math.max(1.4,r*0.06),0,TP);ctx.fill();});
  ctx.strokeStyle=rgbaS(K.ink,1);ctx.lineWidth=Math.max(1.4,r*0.07);ctx.lineCap="round";const my=y+r*0.18,mw=r*0.17;
  ctx.beginPath();ctx.moveTo(x-mw,my-m*r*0.02);ctx.quadraticCurveTo(x,my+m*r*0.16,x+mw,my-m*r*0.02);ctx.stroke();
  ctx.strokeStyle=rgbaS(o.ring||K.ink,o.ring?1:0.85);ctx.lineWidth=o.ring?2.6:1.6;ctx.beginPath();ctx.arc(x,y,r,0,TP);ctx.stroke();ctx.restore();}
function mark(ctx,x,y,k){const c=k==="ok"?K.ok:K.no;ctx.save();ctx.fillStyle=rgbaS(K.paper,1);ctx.beginPath();ctx.arc(x,y,8,0,TP);ctx.fill();ctx.strokeStyle=rgbaS(c,1);ctx.lineWidth=1.6;ctx.stroke();
  ctx.lineWidth=2.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();if(k==="ok"){ctx.moveTo(x-3.4,y+0.2);ctx.lineTo(x-0.9,y+2.8);ctx.lineTo(x+3.6,y-2.8);}else{ctx.moveTo(x-2.8,y-2.8);ctx.lineTo(x+2.8,y+2.8);ctx.moveTo(x+2.8,y-2.8);ctx.lineTo(x-2.8,y+2.8);}ctx.stroke();ctx.restore();}
const since=(now,t0)=>t0==null?-1:RM()?1e9:now-t0;

// A picture: a canvas laid out for its width on the page. lay(lw, ctx) gives the layout for a width (lw, its CSS width, from 320 to
// 640) with its height in .h; draw(ctx, layout, now) paints it. kick(ms) keeps it moving for that long; nothing runs after.
function stage(lay,draw,label){const cv=h("canvas",{role:"img","aria-label":label||""}),st={el:cv,lw:0,lo:null,v:0,until:0,raf:0};
  const M=document.createElement("canvas").getContext("2d");let key="";
  function paint(){const cw=cv.clientWidth||(cv.parentNode&&cv.parentNode.clientWidth)||0;if(!cw)return;const lw=Math.round(cl(cw,320,640)),k2=lw+"/"+st.v;
    if(k2!==key){st.lo=lay(lw,M);key=k2;st.lw=lw;cv.style.aspectRatio=lw+"/"+Math.round(st.lo.h);}
    const d=Math.min(window.devicePixelRatio||1,2),bw=Math.round(cw*d),bh=Math.round(cw*d*st.lo.h/lw);if(cv.width!==bw||cv.height!==bh){cv.width=bw;cv.height=bh;}
    const ctx=cv.getContext("2d"),k=cv.width/lw;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(k,0,0,k,0,0);
    paper(ctx,lw,st.lo.h);try{draw(ctx,st.lo,performance.now());}catch(e){console.error(e);}}
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

/* ---------- the rules of a playground: picks, meters, weeks ---------- */
// whether a condition holds, for these picks and these meters (vals[meter][week]) at week wk
function holds(cond,pick,vals,wk){if(!cond)return true;return String(cond).split("&").every(tok=>{tok=tok.trim();let m=tok.match(/^(\w+)(!?=)([\w\/]+)$/);
  if(m){const any=m[3].split("/").includes(pick[m[1]]);return m[2]==="="?any:!any;}
  m=tok.match(/^(\w+)(>=|<=)(\d+)$/);if(m&&vals&&vals[m[1]]){const v=vals[m[1]][cl(wk,0,vals[m[1]].length-1)];return m[2]===">="?v>=+m[3]:v<=+m[3];}
  return false;});}
// the weeks played out: each meter's value at every week, and what happened, in order
function weeks(W,pick){const N=W.weeks,vals={};W.meters.forEach(m=>{vals[m.k]=[m.v0];});
  for(let wk=1;wk<=N;wk++){W.meters.forEach(m=>{let d=0;W.choices.forEach(c=>{const f=(W.fx||{})[c.k+"="+pick[c.k]];if(f&&f[m.k])d+=f[m.k];});
      (W.late||[]).forEach(r=>{if(wk>=r.from&&holds(r.when,pick)&&r.fx[m.k])d+=r.fx[m.k];});vals[m.k].push(cl(vals[m.k][wk-1]+d,0,100));});}
  const ev=(W.events||[]).filter(e=>holds(e.when,pick,vals,e.wk)).sort((a,b)=>a.wk-b.wk);return{vals,ev};}
// every set of picks a playground allows (a few dozen at most)
function allPicks(W){let out=[{}];W.choices.forEach(c=>{const nx=[];out.forEach(p=>c.picks.forEach(([k])=>nx.push(Object.assign({},p,{[c.k]:k}))));out=nx;});return out;}

/* ---------- weeks: a decision playground ---------- */
// The visitor picks what the leader does, then plays the weeks: the meters are drawn week by week, the people's faces follow how the
// weeks go for them, and what happens is pinned to its week, then listed below. The run before stays faint, to compare.
function labWeeks(Lb){const W=Lb.w,G=W.goals,N=W.weeks,box=h("div",{class:"lab lp-lab",style:"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls lp-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"lp-goals","aria-label":U.goals}),end=h("div",{class:"lp-endbox"});
  const MEM={};W.meters.forEach(m=>MEM[m.k]=m);const DUR=N*360;
  let S,st,rd=[];
  const sayIt=(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));};
  const reach=k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"lp-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  const refresh=()=>{rd.forEach(([v,f])=>{v.textContent=f();});};
  // the most that can happen in one run, so the picture keeps one height whatever is picked
  const MAXEV=Math.min(4,Math.max(1,...allPicks(W).map(p=>weeks(W,p).ev.length)));
  function build(){S={pick:{},run:null,res:null,prev:null,ran:null};W.choices.forEach(c=>S.pick[c.k]=c.v);ctrl.replaceChildren();read.replaceChildren();rd=[];
    W.choices.forEach(c=>{const row=h("div",{class:"lp-row"},h("span",{class:"lbl"},c.label)),g=h("div",{class:"seg",role:"group","aria-label":c.label});
      c.picks.forEach(([k,l,msg])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===S.pick[c.k]?"true":"false",onclick:()=>{
        [...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));S.pick[c.k]=k;if(msg)sayIt(msg);if(st)st.kick(0);refresh();}},l);g.append(b);});
      row.append(g);ctrl.append(row);});
    const go=h("button",{type:"button",class:"chip-btn go",onclick:play},fill(W.runB,{n:N}));ctrl.append(h("div",{class:"lp-row"},go));
    st=stage(lay,draw,W.alt||Lb.name);
    W.meters.forEach(m=>{const v=h("b",null,"–");read.append(h("span",null,m.name+":",v));rd.push([v,()=>S.res?String(Math.round(S.res.vals[m.k][N])):"–"]);});refresh();
    const again=h("button",{type:"button",class:"chip-btn sm lp-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();sayIt(W.start);paintGoals();}},U.again);
    box.append(st.el,info(W.prompt),h("div",{class:"lp-goalbox"},h("p",{class:"lp-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"lp-foot"},again));}
  function play(){const now=performance.now();S.prev=S.res?{vals:S.res.vals}:null;S.ran=Object.assign({},S.pick);S.res=weeks(W,S.ran);S.run=now;st.kick(DUR+700);
    sayIt(fill(U.playing,{n:N}));refresh();
    setTimeout(()=>{if(S.run!==now)return;const R=S.res,bad=R.ev.some(e=>e.tone==="no"),bits=R.ev.map(e=>fill(U.weekN,{n:e.wk})+": "+e.t);
      const vals=W.meters.map(m=>m.name+" "+Math.round(R.vals[m.k][N])).join(", ");bits.push(fill(U.after,{n:N,v:vals}));
      sayIt(bits.join(" "),bad?"warn":"ok");G.forEach(([k,,cond])=>{if(holds(cond,S.ran,R.vals,N))reach(k);});},RM()?0:DUR);}
  function lay(lw,ctx){const m=12,o={lw,m},n=W.people.length;let y=12;
    o.r=Math.min(24,((lw-m*2)/n-10)/2);o.peopleY=y+o.r;y+=o.r*2+26;
    // the meters' names in a row, or in two where they don't fit, each as wide as its longest value
    o.leg=[];let lx=m,ly=y+6;W.meters.forEach(mt=>{const w=TW(ctx,mt.name+" 100",13,700)+26;if(lx>m&&lx+w>lw-m){lx=m;ly+=22;}o.leg.push({x:lx,y:ly,w});lx+=w+8;});y=ly+30;
    o.ch={x:m+30,y,w:lw-m*2-40,h:lw>=440?150:130};y+=o.ch.h+36;
    // what happened: a card for each, as tall as the longest needs (up to three lines)
    const tw=lw-m*2-44,most=Math.max(1,...(W.events||[]).map(e=>fitL(ctx,fill(U.weekN,{n:e.wk})+" · "+e.t,tw,13,3,600)[0].length));
    o.evY=y;o.evH=most*16+16;y+=MAXEV*(o.evH+6)+4;o.h=y+6;return o;}
  const X=(o,wk)=>o.ch.x+o.ch.w*wk/N,Y=(o,v)=>o.ch.y+o.ch.h*(1-v/100);
  function draw(ctx,o,now){const R=S.res,u=R?cl(since(now,S.run)/DUR,0,1):0,at=u*N,wkI=Math.floor(at),wkNow=R?at:0;
    // the people, their faces following the week the run has reached
    const n=W.people.length,cw=(o.lw-o.m*2)/n;
    W.people.forEach((p,i)=>{const x=o.m+cw*(i+0.5),mk=p.m||W.mood,arr=R?R.vals[mk]:null,v=arr?lp(arr[Math.min(wkI,N)],arr[Math.min(wkI+1,N)],at-wkI):MEM[mk].v0;
      let mood=(v-50)/30;if(p.inv)mood=-mood;face(ctx,x,o.peopleY,o.r,p.c||"#8a7f9e",mood);
      line1(ctx,p.name,x-cw/2+2,o.peopleY+o.r+17,cw-4,13,{w:700,align:"center",color:rgbaS(K.ink,1)});});
    // the meters' names, each with its value at the week reached
    W.meters.forEach((m,i)=>{const c=rgb(m.c),g=o.leg[i],v=R?Math.round(lp(R.vals[m.k][Math.min(wkI,N)],R.vals[m.k][Math.min(wkI+1,N)],at-wkI)):m.v0;
      ctx.fillStyle=rgbaS(c,1);ctx.fillRect(g.x,g.y+5,14,4);line1(ctx,m.name+" "+v,g.x+18,g.y+11,g.w-18,13,{w:700});});
    // the chart: a week to a column, with a faint line at the middle
    const C=o.ch;ctx.strokeStyle=rgbaS(K.ink,0.7);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(C.x,C.y);ctx.lineTo(C.x,C.y+C.h);ctx.lineTo(C.x+C.w,C.y+C.h);ctx.stroke();
    ctx.setLineDash([3,4]);ctx.strokeStyle=rgbaS(K.soft,0.4);ctx.beginPath();ctx.moveTo(C.x,Y(o,50));ctx.lineTo(C.x+C.w,Y(o,50));ctx.stroke();ctx.setLineDash([]);
    T(ctx,U.high,C.x-6,C.y+10,{size:12,w:600,align:"right",color:rgbaS(K.soft,1)});T(ctx,U.low,C.x-6,C.y+C.h,{size:12,w:600,align:"right",color:rgbaS(K.soft,1)});
    const step=N>8&&o.lw<440?2:1;for(let wk=0;wk<=N;wk+=step)T(ctx,wk===0?U.now:String(wk),X(o,wk),C.y+C.h+16,{size:12,w:600,align:"center",color:rgbaS(K.soft,1)});
    T(ctx,U.weeks,C.x+C.w,C.y+C.h+31,{size:12,w:600,align:"right",color:rgbaS(K.soft,0.9)});
    // the run before, faint, to compare
    if(S.prev)W.meters.forEach(m=>inkLine(ctx,S.prev.vals[m.k].map((v,wk)=>[X(o,wk),Y(o,v)]),rgb(m.c),1.8,{a:0.3,dash:[4,4]}));
    if(!R){line1(ctx,U.pickFirst,C.x+8,C.y+C.h/2-8,C.w-16,13.5,{w:700,align:"center",color:rgbaS(K.soft,1)});
      W.meters.forEach(m=>{const c=rgb(m.c);ctx.fillStyle=rgbaS(c,1);ctx.beginPath();ctx.arc(X(o,0),Y(o,m.v0),4,0,TP);ctx.fill();});}
    else{W.meters.forEach(m=>{const c=rgb(m.c),a=R.vals[m.k],pts=[];for(let wk=0;wk<=Math.min(wkI,N);wk++)pts.push([X(o,wk),Y(o,a[wk])]);
        if(wkI<N)pts.push([X(o,at),Y(o,lp(a[wkI],a[wkI+1],at-wkI))]);inkLine(ctx,pts,c,3);const e=pts[pts.length-1];ctx.fillStyle=rgbaS(c,1);ctx.beginPath();ctx.arc(e[0],e[1],4.5,0,TP);ctx.fill();});
      if(u<1){ctx.strokeStyle=rgbaS(K.ink,0.45);ctx.setLineDash([2,4]);ctx.beginPath();ctx.moveTo(X(o,at),C.y);ctx.lineTo(X(o,at),C.y+C.h);ctx.stroke();ctx.setLineDash([]);}}
    // what happened, pinned to its week and listed below as the weeks reach it
    const evs=R?R.ev.slice(0,MAXEV):[];evs.forEach((e,i)=>{const t=cl((wkNow-e.wk+0.6)/0.6,0,1);if(t<=0)return;const c=TONE[e.tone]||K.soft,x=X(o,e.wk);
      withA(ctx,eo(t),()=>{ctx.strokeStyle=rgbaS(c,0.8);ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(x,C.y+4);ctx.lineTo(x,C.y+C.h);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle=rgbaS(c,1);ctx.beginPath();ctx.arc(x,C.y+4,9,0,TP);ctx.fill();T(ctx,String(i+1),x,C.y+8.5,{size:12,w:800,align:"center",color:"#fff"});
        const y=o.evY+i*(o.evH+6)+lp(8,0,eo(t));ctx.fillStyle=rgbaS(mixC(c,K.paper,0.88),1);rr(ctx,o.m,y,o.lw-o.m*2,o.evH,8);ctx.fill();ctx.fillStyle=rgbaS(c,1);rr(ctx,o.m,y,5,o.evH,2.5);ctx.fill();
        ctx.fillStyle=rgbaS(c,1);ctx.beginPath();ctx.arc(o.m+20,y+o.evH/2,9,0,TP);ctx.fill();T(ctx,String(i+1),o.m+20,y+o.evH/2+4.5,{size:12,w:800,align:"center",color:"#fff"});
        const tx=o.m+36,tw=o.lw-o.m*2-44,[ls,z]=fitL(ctx,fill(U.weekN,{n:e.wk})+" · "+e.t,tw,13,3,600),lh=z*1.25,y0=y+o.evH/2-(ls.length*lh)/2+z*0.95;
        ls.forEach((l,j)=>T(ctx,l,tx,y0+j*lh,{size:z,w:600,color:rgbaS(K.ink,1)}));});});
    if(R&&u>=1&&!evs.length)line1(ctx,U.quiet,o.m,o.evY+20,o.lw-o.m*2,13,{w:600,color:rgbaS(K.soft,1)});
    if(!R){ctx.save();ctx.setLineDash([5,5]);ctx.strokeStyle=rgbaS(K.soft,0.5);ctx.lineWidth=1.4;rr(ctx,o.m,o.evY,o.lw-o.m*2,o.evH,8);ctx.stroke();ctx.restore();
      line1(ctx,U.evFirst,o.m+12,o.evY+o.evH/2+4.5,o.lw-o.m*2-24,13,{w:600,color:rgbaS(K.soft,1)});}}
  build();sayIt(W.start);paintGoals();return box;}

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{weeks:labWeeks});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)


/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"lp-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","lp-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):null;
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"lp-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"lp-tab-"+Lb.id,"aria-controls":"lp-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
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
  function render(focus){paintBar();const q=QS[cur];if(!q)return;app.dataset.film=String(q.film);const f=VIS[q.vis.k||"who"],a=ans[q.n],body=h("div",{class:"qbody"}),out=h("div"),S={done:a?performance.now()-1e5:0};
    const vis=f?stage(lw=>({lw,h:f.h?f.h(lw,q):190}),(ctx,o,now)=>f(ctx,o,now,q,S),fill(U.whoAlt,{who:q.vis.who.join(', ')})):null;
    const F=FILMS[q.film]||{};body.append(h("p",{class:"qtag",style:"--c:"+labOf(q.lab).c},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+QS.length+" · "+filmN(q.film)+(F.t?", "+F.t:"")),h("h3",{tabindex:"-1"},q.title),h("p",{class:"qsit"},q.sit));
    const fin=(ok,pick)=>{if(!a||a.pick!==pick){ans[q.n]={ok,pick};put("quiz",ans);paintBar();}S.done=performance.now();S.ok=ok;if(vis)vis.kick(1000);out.replaceChildren(feed(ok,q),foot(q));};
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


/* ---------- the scenarios' pictures: the people in the situation ---------- */
// Each draws the people the situation is about, waiting; once it's answered (S.done), their faces answer the pick: a better week
// for a good call, a harder one for a call that isn't quite right
VIS.who=(ctx,o,now,q,S)=>{const who=q.vis.who,n=who.length,m=12,cw=(o.lw-m*2)/n,r=Math.min(44,cw/2-10),t=S.done?eo(since(now,S.done)/700):0,mood=t*(S.ok?0.9:-0.8),y=o.h/2-12;
  who.forEach((nm,i)=>{const x=m+cw*(i+0.5);face(ctx,x,y,r,(L.cast||{})[nm]||"#8a7f9e",mood,{ring:t>0.5?(S.ok?K.ok:K.no):null});
    line1(ctx,nm,x-cw/2+2,y+r+22,cw-4,14,{w:700,align:"center"});});
  if(S.done&&t>0.5)mark(ctx,o.lw-m-10,14,S.ok?"ok":"no");};
VIS.who.h=()=>190;
})();
