/* Learning Data: Data architecture. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one
   engine: the series' labs page and scenarios page load a film's bundle (for the films' own parts: glass, paper, ArchiMate's
   glyphs), the words (learn.en.js or learn.es.js, which set window.DA), and this file.
   Every lab is a playground (kind "play"), one for each film, as the author set on 18 November 2026: the visitor switches, picks,
   steps and presses, and watches what happens; each playground has three to five experiments (w.goals), each ticked when the
   visitor makes it happen, and its end once all are ticked. Each playground's own rules are in PLAY below, its words in the pack.
   The play kit is Data that moves' (assets/data-that-moves/learn.js); the drawing parts are The map before the data's.
   The scenarios are the series' evaluation, every one a choice, its options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its
   words stay big enough to read on a phone. Things move and settle, or jump to where they end when the visitor asks for reduced
   motion, and every change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films: by
   number, each film's title, page and chapter starts), both from site-tools/build_series.py.
   Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments) and "quiz" (answers by
   scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.DA,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-data-architecture";
let FILMS={};try{FILMS=JSON.parse(app.dataset.films||"{}");}catch(e){}
const get=(k,d)=>{try{const v=localStorage.getItem(P+":"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const put=(k,v)=>{try{localStorage.setItem(P+":"+k,JSON.stringify(v));}catch(e){}
  // path.js repaints the course bar on "storage", which only other tabs fire: fire it here too
  try{window.dispatchEvent(new StorageEvent("storage",{key:P+":"+k}));}catch(e){}};
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(v==null||v===false)continue;if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?"":v);}
  kids.flat().forEach(c=>{if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));});return e;}
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
// the points carry <b>…</b>: made into elements, never read as HTML
const rich=s=>String(s).split(/(<b>.*?<\/b>)/).filter(Boolean).map(x=>/^<b>/.test(x)?h("b",null,x.slice(3,-4)):x);
const ready=()=>window.FILM&&FILM.ready?FILM.ready:Promise.resolve();
const RM=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}};
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).length||6,filmN=n=>fill(U.filmN,{n,of:NF});
const later=(fn,ms)=>RM()?fn():setTimeout(fn,ms);

/* ---------- drawing: the films' parts, at the size of the page ---------- */
// the pictures need the film bundle's parts; without them, the labs still work, without pictures
const DRAW=typeof glass==="function"&&typeof T==="function"&&typeof archGlyph==="function"&&typeof wrapT==="function";
const TP=Math.PI*2,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lp=(a,b,t)=>a+(b-a)*t;
const eo=u=>1-Math.pow(1-cl(u,0,1),3);                              // eases out
const sp=u=>u>=1?1:u<=0?0:1-Math.exp(-6*u)*Math.cos(7.5*u);           // a spring: overshoots a little, then settles
const hs=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const strH=s=>{let x=7;for(const c of String(s))x=(x*31+c.charCodeAt(0))%100003;return x;};
const rgb=s=>{const n=parseInt(String(s).slice(1),16);return[n>>16&255,n>>8&255,n&255];};
// the films' colours: ink, the six layers (motivation to technology), paper notes, and right, wrong and gold (as The map before the data's)
const K={ink:[236,243,255],soft:[160,178,205],good:[120,240,170],bad:[255,112,100],gold:[255,209,102],inkd:[40,40,48],paper:[239,232,218],
  lay:[[200,186,255],[245,206,140],[255,234,130],[255,186,150],[140,214,255],[160,224,140]],notes:[[255,228,122],[255,176,196],[164,212,255],[188,236,164]],
  mig:[190,228,206],dom:[[110,214,196],[255,176,120]]};
const rgbaS=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")",mixC=(a,b,t)=>[lp(a[0],b[0],t),lp(a[1],b[1],t),lp(a[2],b[2],t)];
const LN=(ctx,s,w,z,wt)=>wrapT(ctx,String(s),0,0,w,{size:z,w:wt||700,measure:true});
const TW=(ctx,s,z,wt)=>tw(ctx,String(s),z,wt||700);
// words a picture had to cut short, or let spill, for smoke.py's series-learn check (site-tools/smoke/data-architecture.js)
const MISS=window.DA_MISS=new Set();
// one line that fits a width: smaller, down to 12, then cut short
function fit1(ctx,s,w,z,wt){s=String(s);let k=z;while(k>12&&TW(ctx,s,k,wt)>w)k-=0.5;if(TW(ctx,s,k,wt)<=w)return[s,k];MISS.add(s);let t=s;while(t.length>2&&TW(ctx,t+"…",k,wt)>w)t=t.slice(0,-1);return[t+"…",k];}
// lines that fit a width, at most max of them: as they are, or a little smaller; else with the longest words broken by a hyphen, smaller
// if need be (down to 10.5), as a long Spanish word needs. Returns [lines, size], remembered, since pictures repaint while they move.
// A word breaks after a dash, or between syllables as Spanish splits them (de|pen, pen|dien, elec|tro), else where it must
const FIT=new Map(),VW=/[aeiouáéíóúü]/i,CL=/^(bl|br|cl|cr|dr|fl|fr|gl|gr|kl|kr|pl|pr|tr|ch|ll|rr)$/i,nLt=x=>x.replace(/[^a-záéíóúüñ]/gi,"").length;
const syl=(wd,i)=>{if(nLt(wd.slice(0,i))<2||nLt(wd.slice(i))<2)return false;const a=wd[i-1],b=wd[i],c=wd[i+1]||"",v=x=>VW.test(x);if(a==="-"||a==="/")return true;
  if(/[^a-záéíóúüñ]/i.test(a+b))return false;if(v(a))return !v(b)&&(v(c)||CL.test(b+c)&&v(wd[i+2]||""));
  return !v(b)&&v(wd[i-2]||"")&&(v(c)?!CL.test(a+b):CL.test(b+c));};
function fitL(ctx,s,w,z,max,wt,quiet){s=String(s);max=max||2;const key=s+"|"+Math.round(w)+"|"+z+"|"+max+"|"+(wt||700);if(FIT.has(key)){const c=FIT.get(key);if(c.miss&&!quiet)MISS.add(s);return c;}
  const wide=(ls,k)=>ls.every(l=>TW(ctx,l,k,wt)<=w+0.5),brk=k=>s.split(" ").map(wd=>{if(TW(ctx,wd,k,wt)<=w)return wd;const out=[];let rest=wd;
    while(rest.length>3&&TW(ctx,rest,k,wt)>w){let n=1;while(n<rest.length-1&&TW(ctx,rest.slice(0,n+1)+"-",k,wt)<=w)n++;let b=n;
      for(let j=n;j>=Math.max(2,n-6);j--)if(syl(rest,j)){b=j;break;}const pc=rest.slice(0,b);out.push(/[-/]$/.test(pc)?pc:pc+"-");rest=rest.slice(b);}
    out.push(rest);return out.join(" ");}).join(" ");
  let r=null,near=null;for(let k=z;k>=Math.max(11.5,z-1)-0.01&&!r;k-=0.5){const ls=LN(ctx,s,w,k,wt);if(ls.length<=max&&wide(ls,k))r=[ls,k];}
  for(let k=z;k>=10.49&&!r;k-=0.5){const ls=LN(ctx,brk(k),w,k,wt);if(wide(ls,k)){if(ls.length<=max)r=[ls,k];else if(!near)near=[ls.slice(0,max),k];}}
  const miss=!r;r=r||near||[LN(ctx,s,w,z,wt).slice(0,max),z];if(miss){r.miss=1;if(!quiet)MISS.add(s);}if(FIT.size>4000)FIT.clear();FIT.set(key,r);return r;}
// up to two lines, as even as they can be, for a heading, so no word or date is left alone on the second line
function bal(ctx,s,w,z){const f=fitL(ctx,s,w,z,2);if(f[0].length<2||LN(ctx,s,w,f[1]).length!==2)return f;let lo=w/2,hi=w;
  for(let k=0;k<12;k++){const mid=(lo+hi)/2;if(LN(ctx,s,mid,f[1]).length<=2)hi=mid;else lo=mid;}return[LN(ctx,s,hi,f[1]),f[1]];}
function line1(ctx,s,x,y,w,z,o){o=o||{};const[t,k]=fit1(ctx,s,w,z,o.w);T(ctx,t,o.align==="center"?x+w/2:o.align==="right"?x+w:x,y,{w:o.w||700,size:k,align:o.align,color:o.color});}
// wrapped lines, up to max, centred in a box or from a corner; returns the height
function lines(ctx,s,x,y,w,o){o=o||{};const[ls,z]=fitL(ctx,s,w,o.size||13,o.max||3,o.w),lh=z*1.2;ls.forEach((l,i)=>T(ctx,l,o.align==="center"?x+w/2:x,y+i*lh,{w:o.w||700,size:z,align:o.align,color:o.color}));return ls.length*lh;}
const H1=z=>Math.round(z*1.2+12),H2=z=>Math.round(z*2.4+12);
// chips in rows across a width: each as wide as its label, two lines when one won't fit; returns where each goes, and the height
function flow(ctx,labels,w,z,gap){const out=[];let x=0,y=0,rh=0;
  labels.forEach(s=>{const t=Math.ceil(TW(ctx,s,z))+18,cw=Math.min(t,w),ch=t>w&&fitL(ctx,s,w-14,z,2)[0].length>1?H2(z):H1(z);if(x>0&&x+cw>w){x=0;y+=rh+gap;rh=0;}out.push({x,y,w:cw,h:ch});x+=cw+gap;rh=Math.max(rh,ch);});
  return{pos:out,h:labels.length?y+rh:0};}
// a tick (ok) or a cross on a chip's corner
function mark(ctx,x,y,k){const c=k==="ok"?K.good:K.bad;ctx.save();ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(x,y,8,0,TP);ctx.fill();ctx.strokeStyle=rgbaS(c,1);ctx.lineWidth=1.6;ctx.stroke();
  ctx.lineWidth=2.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();if(k==="ok"){ctx.moveTo(x-3.4,y+0.2);ctx.lineTo(x-0.9,y+2.8);ctx.lineTo(x+3.6,y-2.8);}else{ctx.moveTo(x-2.8,y-2.8);ctx.lineTo(x+2.8,y+2.8);ctx.moveTo(x+2.8,y-2.8);ctx.lineTo(x-2.8,y+2.8);}ctx.stroke();ctx.restore();}
// a chip of the model: a short label on glass, in a colour (o.strike crosses it out; o.mark puts a tick on its corner)
function chip(ctx,x,y,w,hh,label,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[ls,z]=fitL(ctx,label,w-14,o.size||13,o.max||2),lh=z*1.2,r=o.r==null?8:o.r;
  withA(ctx,a,()=>{glass(ctx,x,y,w,hh,r,col,{glow:o.glow==null?8:o.glow,ea:o.ea==null?0.8:o.ea,fill:o.fill||"rgba(7,12,24,0.94)",lw:o.lw});
    ctx.fillStyle=rgbaS(col,o.tint==null?0.13:o.tint);rr(ctx,x,y,w,hh,r);ctx.fill();if(o.dash){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgbaS(col,0.9);ctx.lineWidth=1.6;rr(ctx,x+1,y+1,w-2,hh-2,r);ctx.stroke();ctx.restore();}
    const y0=y+hh/2-(ls.length-1)*lh/2+z*0.36;ls.forEach((l,i)=>T(ctx,l,x+w/2,y0+i*lh,{w:700,size:z,align:"center",color:o.color||rgbaS(K.ink,0.96)}));
    if(o.strike){ctx.save();ctx.strokeStyle=rgbaS(K.bad,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+5,y+hh/2+2);ctx.lineTo(x+w-5,y+hh/2-2);ctx.stroke();ctx.restore();}
    if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
// a draft: dark ink on paper, a little crooked, as the films draw sticky notes (o.edge outlines it: red when it's in the wrong place)
function paper(ctx,x,y,w,hh,label,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[ls,z]=fitL(ctx,label,w-12,o.size||13,o.max||2),lh=z*1.2,rot=o.rot==null?(hs(strH(label))-0.5)*0.06:o.rot;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+hh/2);ctx.rotate(rot);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=8;ctx.shadowOffsetY=3;ctx.fillStyle=rgbaS(col||K.notes[0],1);ctx.fillRect(-w/2,-hh/2,w,hh);
    ctx.shadowBlur=0;ctx.shadowOffsetY=0;const g=ctx.createLinearGradient(0,-hh/2,0,hh/2);g.addColorStop(0,"rgba(0,0,0,0.07)");g.addColorStop(0.3,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(255,255,255,0.12)");ctx.fillStyle=g;ctx.fillRect(-w/2,-hh/2,w,hh);
    if(o.edge){ctx.strokeStyle=rgbaS(o.edge,1);ctx.lineWidth=2.4;ctx.strokeRect(-w/2+1.2,-hh/2+1.2,w-2.4,hh-2.4);}
    const y0=-(ls.length-1)*lh/2+z*0.36;ls.forEach((l,i)=>T(ctx,l,0,y0+i*lh,{w:700,size:z,align:"center",color:rgbaS(K.inkd,0.94)}));
    if(o.strike){ctx.strokeStyle="rgba(190,40,30,0.95)";ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-w/2+5,2);ctx.lineTo(w/2-5,-2);ctx.stroke();}ctx.restore();
    if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
// ArchiMate's glyphs: the films' own (archGlyph), and those the films never drew: a requirement and a constraint (parallelograms),
// an interaction (two half circles) and a collaboration (two circles that overlap)
function glyph(ctx,kind,x,y,s,col){if(!/^(requirement|constraint|interaction|collaboration)$/.test(kind))return archGlyph(ctx,kind,x,y,s,col);
  ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";
  if(kind==="requirement"||kind==="constraint"){ctx.beginPath();ctx.moveTo(x-s*0.5,y-s*0.5);ctx.lineTo(x+s*0.85,y-s*0.5);ctx.lineTo(x+s*0.5,y+s*0.5);ctx.lineTo(x-s*0.85,y+s*0.5);ctx.closePath();ctx.stroke();
    if(kind==="constraint"){ctx.beginPath();ctx.moveTo(x-s*0.2,y-s*0.5);ctx.lineTo(x-s*0.55,y+s*0.5);ctx.stroke();}}
  else if(kind==="interaction"){ctx.beginPath();ctx.arc(x-s*0.12,y,s*0.62,Math.PI/2,Math.PI*1.5);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(x+s*0.12,y,s*0.62,-Math.PI/2,Math.PI/2);ctx.closePath();ctx.stroke();}
  else{ctx.beginPath();ctx.arc(x-s*0.3,y,s*0.55,0,TP);ctx.stroke();ctx.beginPath();ctx.arc(x+s*0.3,y,s*0.55,0,TP);ctx.stroke();}
  ctx.restore();}
// an element of the model: glass in its colour, its name, and its glyph in the corner (o.g2: a second glyph beside the first)
function el(ctx,x,y,w,hh,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const z=o.size||13,r=kind==="capability"||kind==="process"?12:6,gs=o.gs||8;
  withA(ctx,a,()=>{glass(ctx,x,y,w,hh,r,col,{glow:10+12*(o.hi||0),ea:0.88,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgbaS(col,0.15+0.12*(o.hi||0));rr(ctx,x,y,w,hh,r);ctx.fill();
    if(o.dash){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgbaS(col,0.9);ctx.lineWidth=1.6;rr(ctx,x+1,y+1,w-2,hh-2,r);ctx.stroke();ctx.restore();}
    const gw=kind?gs*2+10:0,up=o.g2&&fitL(ctx,name,w-16-gw-gs*2-6,z,o.max||2,700,1).miss;if(kind)glyph(ctx,kind,x+w-gs-8,y+gs+7,gs,col);
    // a second glyph sits beside the first, or under it when the name needs the width
    if(o.g2)glyph(ctx,o.g2,up?x+w-gs-8:x+w-gs*3-14,up?y+gs*3+12:y+gs+7,gs,o.c2||col);
    const tw_=w-16-gw-(o.g2&&!up?gs*2+6:0),[ls,zz]=fitL(ctx,name,tw_,z,o.max||2),lh=zz*1.2,y0=y+hh/2-(ls.length-1)*lh/2+zz*0.36;
    ls.forEach((l,i)=>T(ctx,l,o.center?x+(w-gw)/2:x+10,y0+i*lh,{w:700,size:zz,align:o.center?"center":"left",color:rgbaS(K.ink,0.96)}));});}
// an arrow, one way
function arrow(ctx,x0,y0,x1,y1,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.fillStyle=rgbaS(col,1);ctx.lineWidth=o.lw||2;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.setLineDash([]);const an=Math.atan2(y1-y0,x1-x0),hz=o.head||8;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-hz*Math.cos(an-0.45),y1-hz*Math.sin(an-0.45));ctx.lineTo(x1-hz*Math.cos(an+0.45),y1-hz*Math.sin(an+0.45));ctx.closePath();ctx.fill();ctx.restore();});}
function pill(ctx,x,y,s,col,o){o=o||{};const z=o.size||13,w=TW(ctx,s,z)+20,hh=z+12,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;glass(ctx,X,y,w,hh,hh/2,col,{fill:"rgba(7,12,24,0.92)",glow:8,ea:0.85});T(ctx,s,X+10,y+hh/2+z*0.36,{w:700,size:z,color:rgbaS(col,1)});return w;}
// a picture's ground: the films' dark, with a little of the lab's colour from the top
function ground(ctx,w,hh,col){const g=ctx.createRadialGradient(w*0.5,-hh*0.2,10,w*0.5,hh*0.3,Math.max(w,hh));g.addColorStop(0,rgbaS(col,0.16));g.addColorStop(1,rgbaS(col,0));ctx.fillStyle=g;ctx.fillRect(0,0,w,hh);}

// A picture: a canvas laid out for its width on the page. lay(lw, ctx) gives the layout for a width (lw: its CSS width, from 320
// to 640) with its height in .h; draw(ctx, layout, now) paints it. kick(ms) keeps it moving for that long; nothing runs after.
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
  requestAnimationFrame(()=>st.paint());ready().then(()=>st.relayout());if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>st.relayout());
  STG.set(cv,st);return st;}
// A web font that comes after a picture was laid out, as on a slow connection, leaves every fit measured with the fallback font
// wrong, and words cut short that now fit: forget both, and lay out again each picture on the page (STG finds a canvas's picture,
// and lets it go with the canvas)
const STG=new WeakMap();
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener("loadingdone",()=>{FIT.clear();MISS.clear();
  document.querySelectorAll("canvas").forEach(c=>{const s=STG.get(c);if(s)s.relayout();});});

/* ---------- the parts of a lab's page ---------- */
const info=t=>h("p",{class:"lab-info"},t);
function focusIn(el){if(!el)return;try{el.focus({preventScroll:true});}catch(e){el.focus();}const r=el.getBoundingClientRect();if(r.bottom>innerHeight-8||r.top<120)el.scrollIntoView({block:"center",behavior:RM()?"auto":"smooth"});}

/* ---------- play: a playground with experiments ---------- */
// Every lab is a playground, as the author set on 18 November 2026 (Data that moves' engine, assets/data-that-moves/learn.js): the
// visitor switches, picks and presses, and watches what follows. PLAY[id](Lb, api) gives the playground: its state, its controls
// (api.group, api.seg, api.toggle, api.cycle, api.btn), its readouts ([[label, () => value]]) and its picture (lay, draw).
// api.say(text, tone) says what just happened; api.reach(key) ticks an experiment (w.goals); api.kick(ms) keeps the picture moving.
// Start again puts everything back as it was, the ticks included.
const PLAY={};
const in1=(now,t0,ms)=>t0==null?1:cl((RM()?1e9:now-t0)/(ms||600),0,1);
const ago=(now,t0)=>t0==null?-1:RM()?1e9:now-t0,into=(now,t0,ms)=>t0==null?0:cl(ago(now,t0)/(ms||600),0,1);
// a box of glass in a colour, its title at the top left
function card(ctx,x,y,w,hh,col,title,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,hh,o.r||12,col,{glow:o.glow==null?10:o.glow,ea:0.85,fill:"rgba(7,12,24,0.92)"});
  ctx.fillStyle=rgbaS(col,o.tint==null?0.08:o.tint);rr(ctx,x,y,w,hh,o.r||12);ctx.fill();
  if(o.dash){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgbaS(col,0.85);ctx.lineWidth=1.5;rr(ctx,x+3,y+3,w-6,hh-6,(o.r||12)-2);ctx.stroke();ctx.restore();}
  if(title)line1(ctx,title,x+12,y+20,w-24-(o.right||0),o.size||13.5,{w:800,color:rgbaS(mixC(col,K.ink,0.3),1)});});}
// a box with two lines: a small label on top (o.sub), and its name, bigger, under it
function box2(ctx,x,y,w,hh,sub,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,hh,8,col,{glow:o.glow==null?8:o.glow,ea:0.85,fill:"rgba(7,12,24,0.94)"});
  ctx.fillStyle=rgbaS(col,o.tint==null?0.12:o.tint);rr(ctx,x,y,w,hh,8);ctx.fill();
  if(o.dash){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgbaS(o.edge||col,0.95);ctx.lineWidth=1.6;rr(ctx,x+1,y+1,w-2,hh-2,8);ctx.stroke();ctx.restore();}
  else if(o.edge){ctx.save();ctx.strokeStyle=rgbaS(o.edge,1);ctx.lineWidth=2.2;rr(ctx,x+1,y+1,w-2,hh-2,8);ctx.stroke();ctx.restore();}
  line1(ctx,sub,x+8,y+16,w-16,12,{w:700,color:rgbaS(mixC(col,K.soft,0.4),1)});line1(ctx,name,x+8,y+hh-11,w-16,o.size||14,{w:800,color:rgbaS(K.ink,0.97)});
  if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
// a dot on its way along a line, u from 0 to 1
function dot(ctx,x0,y0,x1,y1,u,col,r){if(u<=0||u>=1)return;const x=lp(x0,x1,u),y=lp(y0,y1,u);ctx.save();ctx.shadowColor=rgbaS(col,0.9);ctx.shadowBlur=10;ctx.fillStyle=rgbaS(col,1);ctx.beginPath();ctx.arc(x,y,r||4.5,0,TP);ctx.fill();ctx.restore();}
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab da-lab","style":"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls da-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"da-goals","aria-label":U.goals}),end=h("div",{class:"da-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},relayout:()=>{if(st)st.relayout();},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"da-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    // a button that steps through states, its label saying which: "name: state"
    cycle:(row,label,states,cur,fn)=>{let i=Math.max(0,states.findIndex(s=>s[0]===cur));const b=h("button",{type:"button",class:"chip-btn da-cyc","data-cycle":label});
      const paint=()=>{b.textContent=label+": "+states[i][1];b.setAttribute("data-state",states[i][0]);};paint();
      b.addEventListener("click",()=>{i=(i+1)%states.length;paint();fn(states[i][0]);api.refresh();});row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"da-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm da-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"da-goalbox"},h("p",{class:"da-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"da-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}

/* ---------- 1 · Between the business and the systems: one word, six records ---------- */
// The business's word, connection point, and six systems' records of it. Each record gets a line to the word, or not; the word gets
// its owner, or not. A storm sends outage texts matched on copied addresses or on the connection point; billing moves to a new system.
PLAY.records=(Lb,api)=>{const W=Lb.w,R=W.recs,S={on:{},t:{},owner:false,tOwn:null,match:"addr",storm:null,stormOk:false,move:null,moveOk:false};
  const n=()=>R.filter(r=>S.on[r.k]).length;
  const r1=api.group(W.linksL);R.forEach(r=>api.toggle(r1,r.t,false,v=>{S.on[r.k]=v;S.t[r.k]=performance.now();api.kick(900);
    api.say(fill(v?W.msg.on:W.msg.off,{r:r.rec,s:r.sys}));if(n()===R.length)api.reach("linked");}));
  const r2=api.group(W.wordL);api.toggle(r2,W.ownerT,false,v=>{S.owner=v;S.tOwn=performance.now();api.kick(800);api.say(v?W.msg.ownerOn:W.msg.ownerOff);if(v)api.reach("owner");});
  const r3=api.group(W.matchL);api.seg(r3,W.matches,S.match,k=>{S.match=k;S.storm=null;api.kick(100);api.say(W.msg[k]);},W.matchL);
  const r4=api.group();
  api.btn(r4,W.stormB,()=>{const ok=S.match==="point"&&S.on.sup&&S.on.loc;S.storm=performance.now();S.stormOk=ok;api.kick(2800);
    api.say(ok?W.msg.stormOk:S.match==="point"?W.msg.stormHalf:W.msg.stormAddr,ok?"ok":"no");if(ok)api.reach("texts");},"go");
  api.btn(r4,W.moveB,()=>{const ok=!!S.on.prem&&S.owner;S.move=performance.now();S.moveOk=ok;api.kick(1800);
    api.say(ok?W.msg.moveOk:!S.on.prem?W.msg.moveNoLine:W.msg.moveNoOwner,ok?"ok":"warn");if(ok)api.reach("move");});
  const HN=12,MISSED=[3,8];
  const lay=(lw)=>{const m=12,o={lw,m},cols=lw<440?2:3,g=8,cw=(lw-m*2-g*(cols-1))/cols,ch=48;o.cols=cols;o.word={w:lw-m*2,y:12,h:84};o.word.x=m;
    const y0=o.word.y+o.word.h+44;o.recs=R.map((r,i)=>({x:m+(i%cols)*(cw+g),y:y0+Math.floor(i/cols)*(ch+g),w:cw,h:ch}));
    const rb=o.recs[o.recs.length-1].y+ch;o.hy=rb+22;o.hw=(lw-m*2)/HN;o.h=o.hy+44+26;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const Wd=o.word;
    // the lines, from each record up to the word
    R.forEach((r,i)=>{const b=o.recs[i],u=S.on[r.k]?eo(into(now,S.t[r.k],600)):0;if(u<=0)return;const x0=b.x+b.w*(0.3+0.4*(Math.floor(i/(o.cols))%2)),y0=b.y,x1=cl(x0,Wd.x+14,Wd.x+Wd.w-14),y1=Wd.y+Wd.h;
      ctx.save();ctx.strokeStyle=rgbaS(K.gold,0.85);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lp(x0,x1,u),lp(y0,y1,u));ctx.stroke();ctx.restore();});
    card(ctx,Wd.x,Wd.y,Wd.w,Wd.h,K.lay[2],W.word,{glow:S.owner?16:8,right:0});lines(ctx,W.def,Wd.x+12,Wd.y+40,Wd.w-24,{size:12.5,max:2,color:rgbaS(K.ink,0.85)});
    const oa=S.owner?eo(into(now,S.tOwn,500)):1;withA(ctx,oa,()=>line1(ctx,S.owner?W.ownerName:W.noOwner,Wd.x+12,Wd.y+Wd.h-11,Wd.w-24,12.5,{w:800,color:rgbaS(S.owner?K.gold:K.soft,1)}));
    R.forEach((r,i)=>{const b=o.recs[i],moved=r.k==="prem"&&S.move!=null,u=moved?into(now,S.move,700):0,sys=moved&&u>0.5?W.newBilling:r.sys,
      bad=moved&&!S.moveOk&&u>=1,linked=!!S.on[r.k];
      box2(ctx,b.x,b.y,b.w,b.h,sys,r.rec,K.lay[3],{dash:!linked,glow:linked?10:4,edge:bad?K.bad:null,mark:bad?"no":moved&&S.moveOk&&u>=1?"ok":null,a:moved?0.4+0.6*Math.abs(u*2-1):1});});
    // the households, and the texts the storm sends from the outage system
    const L2=o.recs[R.findIndex(r=>r.k==="loc")];T(ctx,W.homes,o.m,o.hy-6,{w:700,size:12,color:rgbaS(K.soft,1)});
    for(let i=0;i<HN;i++){const x=o.m+i*o.hw+o.hw/2,y=o.hy+18,t=ago(now,S.storm)-i*90,miss=!S.stormOk&&MISSED.includes(i),c=S.storm==null||t<700?K.soft:miss?K.bad:K.good;
      ctx.save();ctx.fillStyle=rgbaS(c,0.9);ctx.beginPath();ctx.moveTo(x-8,y);ctx.lineTo(x,y-8);ctx.lineTo(x+8,y);ctx.lineTo(x+8,y+10);ctx.lineTo(x-8,y+10);ctx.closePath();ctx.fill();ctx.restore();
      if(S.storm!=null&&t>0&&t<700&&!miss)dot(ctx,L2.x+L2.w/2,L2.y+L2.h,x,y-4,t/700,K.gold,3.5);
      if(S.storm!=null&&t>=700)mark(ctx,x+7,y-6,miss?"no":"ok");}
    if(S.storm!=null&&ago(now,S.storm)>1700)line1(ctx,S.stormOk?W.allReached:W.missed,o.m,o.hy+50,o.lw-o.m*2,13,{w:800,color:rgbaS(S.stormOk?K.good:K.bad,1)});};
  return{lay,draw,readouts:[[W.read.lines,()=>fill(W.read.nOf,{n:n(),of:R.length})],[W.read.owner,()=>S.owner?W.ownerShort:W.read.none],[W.read.missed,()=>S.storm==null?"–":S.stormOk?"0":W.missedN]]};};

/* ---------- 2 · The pyramid, taken apart: down, then up ---------- */
// Five steps, from a decision down to the records. Start from every table there is, or from a decision; change what an
// interruption means, and watch the measure move; then let the answer climb back up to the person who decides.
PLAY.chain=(Lb,api)=>{const W=Lb.w,D=W.decs,S={from:"data",dec:null,seen:new Set(),x:5,tx:null,t:performance.now(),up:null};
  const val=()=>(W.cuts.filter(c=>c>S.x).length*W.per).toFixed(2);
  const down=()=>{if(S.from!=="dec"||S.dec==null)return;S.seen.add(S.dec);api.reach("down");if(S.seen.size>=D.length)api.reach("two");};
  const r1=api.group(W.fromL);api.seg(r1,W.froms,S.from,k=>{S.from=k;S.t=performance.now();S.up=null;api.kick(1600);
    api.say(k==="data"?W.msg.data:S.dec==null?W.msg.pick:fill(W.msg.chain,{d:D[S.dec].d}));down();},W.fromL);
  const r2=api.group(W.decL);api.seg(r2,D.map((d,i)=>[String(i),d.d]),null,k=>{S.dec=+k;S.t=performance.now();S.up=null;api.kick(1600);
    api.say(S.from==="dec"?fill(W.msg.chain,{d:D[S.dec].d}):W.msg.notYet);down();},W.decL);
  const r3=api.group(W.defL);api.seg(r3,W.xs,String(S.x),k=>{S.x=+k;S.tx=performance.now();api.kick(900);api.say(fill(W.msg.def,{x:S.x,v:val()}));api.reach("def");},W.defL);
  const r4=api.group();api.btn(r4,W.decideB,()=>{if(S.from!=="dec"||S.dec==null){api.say(W.msg.noDecide,"warn");return;}S.up=performance.now();api.kick(2600);
    api.say(D[S.dec].up,"ok");api.reach("up");},"go");
  const lay=(lw)=>{const m=12,o={lw,m},rh=60,g=9,side=34;o.rows=W.steps.map((s,i)=>{const w=(lw-m*2-side*2)*lp(0.8,1,i/(W.steps.length-1));return{x:(lw-w)/2,y:26+i*(rh+g),w,h:rh};});
    o.side=side;o.h=26+W.steps.length*(rh+g)+30;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const d=S.dec!=null?D[S.dec]:null,on=S.from==="dec"&&d,n=W.steps.length;
    const txt=i=>!on?(i===n-1?W.allTables:"?"):i===0?d.d:i===1?d.q:i===2?(d.m+(S.dec===0?": "+val():"")):i===3?fill(d.def,{x:S.x}):d.r;
    o.rows.forEach((r,i)=>{const u=on?eo(into(now,S.t+i*220,500)):1,hot=S.up!=null&&ago(now,S.up)>(n-1-i)*380,flash=i===3&&S.tx!=null&&ago(now,S.tx)<700;
      const c=K.lay[i%K.lay.length];withA(ctx,0.35+0.65*u,()=>{card(ctx,r.x,r.y,r.w,r.h,c,null,{glow:hot||flash?18:6,tint:hot?0.2:0.08,dash:!on&&i<n-1});
        line1(ctx,W.steps[i],r.x+10,r.y+16,r.w-20,12,{w:800,color:rgbaS(mixC(c,K.soft,0.3),1)});
        lines(ctx,txt(i),r.x+10,r.y+34,r.w-20,{size:13,max:2,w:700,color:rgbaS(!on&&i<n-1?K.soft:K.ink,0.97)});});
      if(!on&&i===n-1){for(let k=0;k<26;k++){const bx=r.x+r.w-14-(k%13)*9,by=r.y+8+Math.floor(k/13)*9;ctx.fillStyle=rgbaS(K.lay[4],0.45);ctx.fillRect(bx,by,6,6);}}});
    // down the left: asks; up the right: answers
    const top=o.rows[0],bot=o.rows[n-1],lx=o.m+o.side/2,rx=o.lw-o.m-o.side/2,ua=on?eo(into(now,S.t,1200)):0;
    arrow(ctx,lx,top.y+8,lx,lp(top.y+8,bot.y+bot.h-8,ua),K.gold,on?0.9:0.25,{lw:2.2});
    if(on)T(ctx,W.asks,lx,top.y-8,{w:800,size:12,align:"center",color:rgbaS(K.gold,1)});
    const uu=S.up!=null?eo(into(now,S.up,n*380)):0;if(uu>0){arrow(ctx,rx,bot.y+bot.h-8,rx,lp(bot.y+bot.h-8,top.y+8,uu),K.good,0.95,{lw:2.4});T(ctx,W.answers,rx,bot.y+bot.h+14,{w:800,size:12,align:"center",color:rgbaS(K.good,1)});}
    if(S.up!=null&&ago(now,S.up)>n*380)pill(ctx,top.x+top.w/2,top.y+top.h+1,d.who,K.good,{align:"center",size:12});
    line1(ctx,on?fill(W.need,{n:d.recs}):W.loaded,o.m,o.h-10,o.lw-o.m*2,12.5,{w:700,align:"center",color:rgbaS(on?K.good:K.soft,1)});};
  return{lay,draw,readouts:[[W.read.tables,()=>S.from==="data"?W.read.all:S.dec==null?"–":String(D[S.dec].recs)],[W.read.measure,()=>val()]]};};

/* ---------- 3 · Where each fact is born: one home for each fact ---------- */
// Five systems. New homes are created in two of them, or in one with the other copying; a wrong address is corrected in a copy
// or at home, with or without lines back home; a storm leaves three records, kept as one fact or three.
PLAY.born=(Lb,api)=>{const W=Lb.w,SY=W.sys,S={create:"both",year:null,dups:0,lin:false,tLin:null,at:"copy",fix:null,fixRes:null,as:"one",storm:null,stormAs:"one"};
  const r1=api.group(W.createL);api.seg(r1,W.creates,S.create,k=>{S.create=k;S.year=null;api.kick(100);api.say(W.msg[k]);},W.createL);
  api.btn(r1,W.yearB,()=>{S.year=performance.now();S.dups=S.create==="both"?W.twice:0;api.kick(1400);
    api.say(S.dups?fill(W.msg.yearBoth,{n:W.twiceS}):W.msg.yearHome,S.dups?"no":"ok");if(!S.dups)api.reach("once");});
  const r2=api.group(W.copiesL);api.toggle(r2,W.linT,false,v=>{S.lin=v;S.tLin=performance.now();api.kick(900);api.say(v?W.msg.linOn:W.msg.linOff);if(v)api.reach("lineage");});
  const r3=api.group(W.fixL);api.seg(r3,W.ats,S.at,k=>{S.at=k;api.say(W.msg["at_"+k]);},W.fixL);
  api.btn(r3,W.fixB,()=>{S.fix=performance.now();S.fixRes=S.at==="copy"?"copy":S.lin?"ok":"half";api.kick(2600);
    api.say(W.msg["fix_"+S.fixRes],S.fixRes==="ok"?"ok":"warn");if(S.fixRes==="ok")api.reach("fix");});
  const r4=api.group(W.stormL);api.seg(r4,W.ases,S.as,k=>{S.as=k;S.storm=null;api.kick(100);api.say(W.msg["as_"+k]);},W.stormL);
  api.btn(r4,W.stormB,()=>{S.storm=performance.now();S.stormAs=S.as;api.kick(1800);api.say(S.as==="three"?W.msg.stormThree:W.msg.stormOne,S.as==="three"?"ok":"no");if(S.as==="three")api.reach("three");});
  // which systems hold the address, and which tile each system shows
  const lay=(lw)=>{const m=12,o={lw,m},rh=52,g=8,nw=Math.min(150,(lw-m*2)*0.34);o.nw=nw;o.rows=SY.map((s,i)=>({x:m+18,y:12+i*(rh+g),w:lw-m*2-18,h:rh}));o.h=12+SY.length*(rh+g)+4;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const homeI=0;
    // lines back home, from the network map to its copies
    const la=S.lin?eo(into(now,S.tLin,700)):0;if(la>0)W.addrIn.forEach(i=>{if(i===homeI)return;const a=o.rows[homeI],b=o.rows[i];ctx.save();ctx.strokeStyle=rgbaS(K.gold,0.8*la);ctx.lineWidth=1.8;ctx.setLineDash([4,3]);
      ctx.beginPath();ctx.moveTo(a.x,a.y+a.h/2);ctx.bezierCurveTo(a.x-16-i*1.5,a.y+a.h/2,b.x-16-i*1.5,b.y+b.h/2,b.x,b.y+b.h/2);ctx.stroke();ctx.restore();});
    o.rows.forEach((r,i)=>{const s=SY[i],home=i===homeI;card(ctx,r.x,r.y,r.w,r.h,home?K.gold:K.lay[4],null,{glow:home?12:5,tint:home?0.1:0.06});
      lines(ctx,s,r.x+10,r.y+20,o.nw-14,{size:13,max:2,w:800,color:rgbaS(home?K.gold:K.ink,0.95)});
      const tx=r.x+o.nw,tw_=(r.w-o.nw-8-6)/2,ty=r.y+8,th=r.h-16,slot=k=>tx+k*(tw_+6);
      // new homes
      if(S.year!=null&&(i===0||i===1)){const u=eo(into(now,S.year,700));withA(ctx,u,()=>{
        if(i===0)chip(ctx,slot(0),ty,tw_,th,W.created,K.good,{size:12.5});
        else if(S.dups)chip(ctx,slot(0),ty,tw_,th,fill(W.twiceT,{n:W.twiceS}),K.bad,{size:12.5,mark:"no"});else chip(ctx,slot(0),ty,tw_,th,W.copied,K.lay[4],{size:12.5,dash:true});});}
      // the address
      if(W.addrIn.includes(i)){const f=S.fix!=null?ago(now,S.fix):-1,res=S.fixRes;let right=false;
        if(f>=0){if(res==="copy")right=i===2&&f<1500;else if(i===0)right=f>200;else if(res==="ok")right=f>200+W.addrIn.indexOf(i)*300;}
        const back=res==="copy"&&i===2&&f>=1500;chip(ctx,slot(1),ty,tw_,th,right?W.addrRight:W.addrWrong,right?K.good:back?K.bad:K.lay[3],{size:12.5,mark:right?"ok":back?"no":null});}
      // the storm's records
      const sk=W.stormIn.indexOf(i);if(S.storm!=null&&sk>=0){const t=ago(now,S.storm),u=eo(cl(t/600,0,1));
        if(S.stormAs==="three")withA(ctx,u,()=>chip(ctx,slot(i===2?0:0),ty,tw_,th,W.stormRec[sk],K.lay[1],{size:12.5,mark:t>900?"ok":null}));
        else{const m2=cl((t-700)/600,0,1),tgt=o.rows[W.stormIn[1]];if(i===W.stormIn[1])withA(ctx,u,()=>chip(ctx,slot(0),ty,tw_,th,W.oneFact,K.lay[1],{size:12.5,mark:t>1300?"no":null}));
          else withA(ctx,u*(1-m2),()=>chip(ctx,slot(0),lp(ty,tgt.y+8,eo(m2)),tw_,th,W.stormRec[sk],K.lay[1],{size:12.5}));}}});};
  return{lay,draw,readouts:[[W.read.twice,()=>S.year==null?"–":S.dups?W.twiceS:"0"],[W.read.copies,()=>S.lin?W.read.yes:W.read.no]]};};

/* ---------- 4 · How it travels: on the map, or gone ---------- */
// Eleven paths across the wall between the network and retail, four of them on the map. Each other one stays as it is, becomes a
// flow or is closed; an agreed list says what may cross; contracts are agreed by the teams at both ends. Then the network replaces
// a meter's readings, and the group's own retailer asks for every reading.
PLAY.paths=(Lb,api)=>{const W=Lb.w,PT=W.paths,S={st:{},t:{},list:false,ct:false,tCt:null,chg:null,chgRes:null,ask:null,askOk:false};PT.forEach(p=>S.st[p.k]=p.on?"flow":"open");
  const open=()=>PT.filter(p=>S.st[p.k]==="open").length,flows=()=>PT.filter(p=>S.st[p.k]==="flow").length,closed=()=>PT.filter(p=>S.st[p.k]==="closed").length;
  const r1=api.group(W.offL);PT.filter(p=>!p.on).forEach(p=>api.cycle(r1,p.t,W.states,"open",k=>{S.st[p.k]=k;S.t[p.k]=performance.now();api.kick(900);
    api.say(fill(W.msg[k],{p:p.t}));if(!open())api.reach("mapped");}));
  const r2=api.group(W.wallL);api.toggle(r2,W.listT,false,v=>{S.list=v;api.kick(300);api.say(v?W.msg.listOn:W.msg.listOff);});
  api.toggle(r2,W.ctT,false,v=>{S.ct=v;S.tCt=performance.now();api.kick(900);api.say(v?W.msg.ctOn:W.msg.ctOff);if(v)api.reach("contract");});
  const r3=api.group();
  api.btn(r3,W.chgB,()=>{const s=S.st[W.key];S.chg=performance.now();S.chgRes=s==="flow"?(S.ct?"ok":"bare"):s;api.kick(2200);
    api.say(W.msg["chg_"+S.chgRes],S.chgRes==="ok"?"ok":"no");if(S.chgRes==="ok")api.reach("change");},"go");
  api.btn(r3,W.askB,()=>{S.ask=performance.now();S.askOk=S.list;api.kick(1800);api.say(S.list?W.msg.askOk:W.msg.askAll,S.list?"ok":"no");if(S.list)api.reach("fair");});
  const lay=(lw)=>{const m=12,o={lw,m},rh=30;o.top=12;o.hh=42;o.y0=o.top+o.hh+12;o.rh=rh;o.rows=PT.map((p,i)=>o.y0+i*rh+rh/2);o.wx=lw/2;o.h=o.y0+PT.length*rh+40;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c),NC=[150,222,196],RC=[255,176,196];ground(ctx,o.lw,o.h,col);const m=o.m,bw=(o.lw-m*2-16)/2;
    [[m,NC,W.net],[o.lw-m-bw,RC,W.ret]].forEach(([x,c,t])=>{card(ctx,x,o.top,bw,o.hh,c,null);lines(ctx,t,x+12,o.top+18,bw-24,{size:13,max:2,w:800,color:rgbaS(mixC(c,K.ink,0.3),1)});});
    ctx.save();ctx.fillStyle="rgba(160,178,205,0.14)";ctx.fillRect(o.wx-7,o.y0-6,14,o.rows.length*o.rh+8);ctx.strokeStyle="rgba(160,178,205,0.45)";ctx.lineWidth=1;ctx.strokeRect(o.wx-7,o.y0-6,14,o.rows.length*o.rh+8);ctx.restore();
    PT.forEach((p,i)=>{const y=o.rows[i],s=S.st[p.k],x0=m+6,x1=o.lw-m-6,u=eo(in1(now,S.t[p.k],500));
      ctx.save();ctx.lineWidth=2;if(s==="flow"){ctx.strokeStyle=rgbaS(K.gold,0.85);ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();}
      else if(s==="open"){ctx.setLineDash([4,4]);ctx.strokeStyle=rgbaS(K.soft,0.55);ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();}
      else{ctx.strokeStyle=rgbaS(K.bad,0.6*u+0.2);ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lp(x1,o.wx-9,u),y);ctx.stroke();}ctx.restore();
      if(s==="flow"&&!RM()){const k=((now/2600+i*0.37)%1);dot(ctx,x0,y,x1,y,k,K.gold,3);}
      const lab=p.s,z=12.5,tw_=Math.min(TW(ctx,lab,z)+18,o.lw*0.62),lx=s==="closed"?(m+o.wx)/2:o.lw/2;
      withA(ctx,s==="closed"?0.6:1,()=>pill(ctx,lx,y-10,lab,s==="flow"?K.gold:s==="open"?K.soft:K.bad,{align:"center",size:z}));
      if(s==="closed")mark(ctx,o.wx,y,"no");
      if(s==="flow"&&S.ct){const ca=eo(into(now,S.tCt,500));withA(ctx,ca,()=>{ctx.save();ctx.fillStyle=rgbaS(K.paper,0.95);ctx.fillRect(o.lw-m-24,y-8,14,16);ctx.strokeStyle=rgbaS(K.inkd,0.8);ctx.lineWidth=1;
        for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(o.lw-m-21,y-4+k*4);ctx.lineTo(o.lw-m-13,y-4+k*4);ctx.stroke();}ctx.restore();});}
      if(p.k===W.key&&S.chg!=null){const t=ago(now,S.chg);if(s!=="closed"&&t<1200)dot(ctx,x0,y,s==="flow"?x1:o.lw*0.7,y,t/1200,S.chgRes==="ok"?K.good:K.bad,5);
        if(t>=1200)mark(ctx,x1-2,y-8,S.chgRes==="ok"?"ok":"no");}});
    if(S.ask!=null){const t=ago(now,S.ask),u=eo(cl(t/900,0,1));line1(ctx,S.askOk?W.askOwn:W.askAll,m,o.h-12,o.lw-m*2,13,{w:800,align:"center",color:rgbaS(S.askOk?K.good:K.bad,u)});}
    else line1(ctx,fill(W.tally,{f:flows(),c:closed(),o:open()}),m,o.h-12,o.lw-m*2,12.5,{w:700,align:"center",color:rgbaS(K.soft,1)});};
  return{lay,draw,readouts:[[W.read.flows,()=>String(flows())],[W.read.closed,()=>String(closed())],[W.read.open,()=>String(open())]]};};

/* ---------- 5 · Who owns which data: whose product? ---------- */
// Seven tables, all the data team's by default. Give each an owner; then the engineers change a method, the regulator asks for a
// measure across domains, and what nobody claims is archived, its readers told first.
PLAY.owner=(Lb,api)=>{const W=Lb.w,TB=W.tables,O=W.owners,S={o:{},t:{},arch:false,tArch:null,meth:null,methOk:false,reg:null,regOk:false};TB.forEach(t=>S.o[t.k]="team");
  const biz=TB.filter(t=>t.right!=="team"&&t.right!=="none");
  const teamOk=()=>biz.every(t=>S.o[t.k]===t.right)&&S.o[TB.find(t=>t.right==="team").k]==="team";
  const check=()=>{if(teamOk())api.reach("team");};
  const r1=api.group(W.ownL);TB.forEach(t=>api.cycle(r1,t.t,O.map(x=>[x.k,x.s]),"team",k=>{S.o[t.k]=k;S.t[t.k]=performance.now();api.kick(800);
    api.relayout();api.say(fill(W.msg.own,{t:t.t,o:O.find(x=>x.k===k).n}));check();}));
  const r2=api.group();
  api.btn(r2,W.methB,()=>{const ok=S.o[W.methT]==="net";S.meth=performance.now();S.methOk=ok;api.kick(1600);api.say(ok?W.msg.methOk:W.msg.methNo,ok?"ok":"no");if(ok)api.reach("method");},"go");
  api.btn(r2,W.regB,()=>{const k=S.o[W.regT],ok=k==="ent";S.reg=performance.now();S.regOk=ok;api.kick(1600);api.say(ok?W.msg.regOk:k==="team"?W.msg.regTeam:W.msg.regOne,ok?"ok":"no");if(ok)api.reach("cross");});
  const r3=api.group();api.toggle(r3,W.archT,false,v=>{S.arch=v;S.tArch=performance.now();api.relayout();api.kick(1000);
    if(!v){api.say(W.msg.archOff);return;}const lost=biz.filter(t=>S.o[t.k]==="team");
    if(lost.length){api.say(fill(W.msg.archLost,{t:lost.map(t=>t.t).join(", ")}),"warn");return;}
    const old=TB.find(t=>t.right==="none");if(S.o[old.k]!=="team"){api.say(W.msg.archClaimed,"warn");return;}
    api.say(W.msg.archOk,"ok");api.reach("unclaimed");});
  const archived=t=>S.arch&&S.o[t.k]==="team"&&t.right!=="team";
  const lay=(lw,ctx)=>{const m=12,o={lw,m},lanes=O.map(x=>x.k).concat(["arch"]);o.lanes=[];let y=12;
    lanes.forEach(k=>{const labels=TB.filter(t=>k==="arch"?archived(t):(S.o[t.k]===k&&!archived(t))).map(t=>t.s),f=flow(ctx,labels,lw-m*2-20,12.5,6);o.lanes.push({k,y,h:24+Math.max(H1(12.5),f.h)+10});y+=o.lanes[o.lanes.length-1].h+8;});o.h=y+4;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,LC={net:[150,222,196],ret:[255,176,196],ent:K.gold,team:K.lay[4],arch:K.soft};
    o.lanes.forEach(L2=>{const c=LC[L2.k],own=O.find(x=>x.k===L2.k);card(ctx,m,L2.y,o.lw-m*2,L2.h,c,own?own.n:W.archive,{dash:L2.k==="arch",glow:4,size:13});
      const here=TB.filter(t=>L2.k==="arch"?archived(t):(S.o[t.k]===L2.k&&!archived(t)));const f=flow(ctx,here.map(t=>t.s),o.lw-m*2-20,12.5,6);
      here.forEach((t,i)=>{const p=f.pos[i],u=eo(in1(now,L2.k==="arch"?S.tArch:S.t[t.k],500)),hot=(t.k===W.methT&&S.meth!=null&&ago(now,S.meth)<1400)||(t.k===W.regT&&S.reg!=null&&ago(now,S.reg)<1400);
        const mk=t.k===W.methT&&S.meth!=null&&ago(now,S.meth)>700?(S.methOk?"ok":"no"):t.k===W.regT&&S.reg!=null&&ago(now,S.reg)>700?(S.regOk?"ok":"no"):null;
        chip(ctx,m+10+p.x,L2.y+26+p.y+(1-u)*8,p.w,p.h,t.s,c,{a:u,size:12.5,glow:hot?16:6,mark:mk,strike:L2.k==="arch"});});});};
  return{lay,draw,readouts:[[W.read.biz,()=>fill(W.read.nOf,{n:biz.filter(t=>S.o[t.k]!=="team").length,of:biz.length})],[W.read.arch,()=>String(TB.filter(archived).length)]]};};

/* ---------- 6 · One language, kept: name it from its parts ---------- */
// A name built from three parts: the thing, in the glossary's words; what about it; and the kind of value. The review reads it
// as it's built. Then an older system's name, mapped once, and the industry's model: rename to it, or map to it.
PLAY.names=(Lb,api)=>{const W=Lb.w,S={th:null,ab:null,kd:null,t:null,map:false,tMap:null,cim:null,tCim:null};
  const name=()=>[S.th,S.ab,S.kd].map((v,i)=>v==null?"…":[W.things,W.abouts,W.kinds][i].find(x=>x[0]===v)[2]).join("_");
  const verdict=()=>{if(S.th==null||S.ab==null||S.kd==null)return null;if(S.th==="customer")return"cust";const want=W.abouts.find(x=>x[0]===S.ab)[3];return S.kd===want?"ok":"kind";};
  const judge=()=>{S.t=performance.now();api.kick(900);const v=verdict();if(S.th==="customer")api.reach("customer");
    if(v==null){api.say(fill(W.msg.part,{n:name()}));return;}if(v==="ok"){api.say(fill(W.msg.ok,{n:name()}),"ok");api.reach("built");}
    else if(v==="cust")api.say(W.msg.cust,"no");else api.say(fill(W.msg.wrongKind,{n:name(),a:W.abouts.find(x=>x[0]===S.ab)[1],k:W.kinds.find(x=>x[0]===W.abouts.find(y=>y[0]===S.ab)[3])[1]}),"warn");};
  const r1=api.group(W.thL);api.seg(r1,W.things.map(x=>[x[0],x[1]]),null,k=>{S.th=k;judge();},W.thL);
  const r2=api.group(W.abL);api.seg(r2,W.abouts.map(x=>[x[0],x[1]]),null,k=>{S.ab=k;judge();},W.abL);
  const r3=api.group(W.kdL);api.seg(r3,W.kinds.map(x=>[x[0],x[1]]),null,k=>{S.kd=k;judge();},W.kdL);
  const r4=api.group(W.oldL);api.toggle(r4,W.mapT,false,v=>{S.map=v;S.tMap=performance.now();api.kick(900);api.say(v?W.msg.mapOn:W.msg.mapOff,v?"ok":null);if(v)api.reach("legacy");});
  const r5=api.group(W.cimL);api.seg(r5,W.cims,null,k=>{S.cim=k;S.tCim=performance.now();api.kick(1200);api.say(W.msg["cim_"+k],k==="map"?"ok":"no");if(k==="map")api.reach("cim");},W.cimL);
  const lay=(lw)=>{const m=12,o={lw,m},g=8,pw=(lw-m*2-g*2)/3,col=lw<500;o.parts=[0,1,2].map(i=>col?{x:m,y:12+i*(46+6),w:lw-m*2,h:46}:{x:m+i*(pw+g),y:12,w:pw,h:50});o.ny=o.parts[2].y+o.parts[2].h+14;o.nh=44;o.oy=o.ny+o.nh+30;o.cy=o.oy+56;o.h=o.cy+56+10;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,C=[K.lay[2],K.lay[3],K.lay[4]],vals=[S.th,S.ab,S.kd],lists=[W.things,W.abouts,W.kinds];
    o.parts.forEach((p,i)=>{const v=vals[i],it=v!=null?lists[i].find(x=>x[0]===v):null;box2(ctx,p.x,p.y,p.w,p.h,W.roles[i],it?it[2]:"…",C[i],{dash:!it,size:14,edge:i===0&&v==="customer"?K.bad:null});
      if(it&&o.parts[0].y===o.parts[2].y)arrow(ctx,p.x+p.w/2,p.y+p.h+2,lp(p.x+p.w/2,o.lw/2,0.35),o.ny-2,C[i],0.6,{head:6,lw:1.5});});
    const v=verdict(),u=into(now,S.t,500),nw=Math.min(o.lw-m*2,Math.max(220,TW(ctx,name(),15.5)+40)),nx=(o.lw-nw)/2,vc=v==="ok"?K.good:v==null?K.soft:v==="kind"?K.gold:K.bad;
    chip(ctx,nx,o.ny,nw,o.nh,name(),vc,{size:15.5,glow:6+10*u,mark:v==="ok"?"ok":v&&v!=="ok"?"no":null});
    if(v&&v!=="ok")line1(ctx,v==="cust"?W.custNote:W.kindNote,m,o.ny+o.nh+18,o.lw-m*2,12.5,{w:700,align:"center",color:rgbaS(vc,1)});
    // an older system's name, and its one mapping to the glossary's
    const ma=S.map?eo(into(now,S.tMap,600)):0,hw=(o.lw-m*2-40)*0.36,rw=(o.lw-m*2-40)-hw;chip(ctx,m,o.oy,hw,40,W.oldName,K.lay[1],{size:13});
    withA(ctx,0.25+0.75*ma,()=>chip(ctx,o.lw-m-rw,o.oy,rw,40,W.oldTo,K.lay[4],{size:12.5,dash:!S.map}));arrow(ctx,m+hw+6,o.oy+20,lp(m+hw+6,o.lw-m-rw-6,Math.max(0.15,ma)),o.oy+20,K.gold,S.map?0.95:0.3,{dash:S.map?null:[4,4]});
    // the industry's model: renamed to, or mapped to
    const ca=S.cim?eo(into(now,S.tCim,700)):0;chip(ctx,m,o.cy,hw,40,W.cimName,[140,214,255],{size:13});
    if(S.cim==="map"){withA(ctx,ca,()=>chip(ctx,o.lw-m-rw,o.cy,rw,40,W.cimOurs,K.lay[4],{size:12.5,mark:ca>=1?"ok":null}));arrow(ctx,o.lw-m-rw-6,o.cy+20,m+hw+6,o.cy+20,K.gold,0.9*ca);}
    else if(S.cim==="rename"){withA(ctx,ca,()=>chip(ctx,o.lw-m-rw,o.cy,rw,40,W.cimBroke,K.bad,{size:12.5,mark:ca>=1?"no":null}));}
    else lines(ctx,W.cimQ,o.lw-m-rw,o.cy+17,rw,{size:12.5,max:2,w:700,align:"center",color:rgbaS(K.soft,1)});};
  return{lay,draw,readouts:[[W.read.name,()=>name()],[W.read.review,()=>{const v=verdict();return v==null?"–":v==="ok"?W.read.pass:W.read.back;}]]};};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"da-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","da-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):h("p",{class:"da-coming"},h("b",null,U.coming)," "+U.comingNote);
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"da-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"da-tab-"+Lb.id,"aria-controls":"da-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
  // the rail is one stop for the keyboard: arrows move along it, Home and End go to its ends
  rail.addEventListener("keydown",e=>{const bs=[...rail.children],k=bs.indexOf(document.activeElement);if(k<0)return;let j=null;
    if(e.key==="ArrowRight"||e.key==="ArrowDown")j=(k+1)%bs.length;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")j=(k-1+bs.length)%bs.length;else if(e.key==="Home")j=0;else if(e.key==="End")j=bs.length-1;
    if(j==null)return;e.preventDefault();bs[j].focus();show(bs[j].dataset.id);});
  app.append(rail,panel);show((location.hash||"").slice(1));
  window.addEventListener("hashchange",()=>{const id=(location.hash||"").slice(1);if(L.labs.some(x=>x.id===id))show(id,true);});}

/* ---------- the scenarios page: the series' evaluation ---------- */
// Situations from every film, or from one (#film-3); each answer explains why and points back to its playground. Answers are kept by
// the scenario's number (film × 10 + its place), so a new situation never takes over an old answer. Every situation is a choice,
// its options shown in the order the words give them, where the right answers are spread.
const VIS={};
if(app.id==="series-quiz"){app.textContent="";const QS=L.qs,ans=get("quiz",{})||{};let film=0,cur=0;
  const films=[...new Set(QS.map(q=>q.film))].sort((a,b)=>a-b);
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");bar.append(dots,score);
  app.append(h("div",{class:"quiz"},bar,card));
  const list=()=>QS.filter(q=>!film||q.film===film),labOf=id=>L.labs.find(x=>x.id===id)||{name:"",c:"#a0b2cd"};
  function paintBar(){const Q=list();dots.replaceChildren(...Q.map((q,i)=>{const a=ans[q.n];return h("button",{type:"button",class:a?(a.ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1)+(a?" · "+(a.ok?U.right:U.notQuite):""),onclick:()=>{cur=i;render(true);}},String(i+1));}));
    const n=Q.filter(q=>ans[q.n]).length,ok=Q.filter(q=>ans[q.n]&&ans[q.n].ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+n+" "+U.answered+" · "+(Q.length-n)+" "+U.toGo));}
  function done(q,ok,pick){ans[q.n]={ok,pick};put("quiz",ans);paintBar();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why));
  function foot(q){const Q=list(),last=cur===Q.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:"../labs/#"+q.lab},U.explore+" "+labOf(q.lab).name),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results(true);else{cur+=1;render(true);}}},last?U.results:U.nextQ));}
  function render(focus){paintBar();const Q=list(),q=Q[cur];if(!q)return;app.dataset.film=String(q.film);const f=VIS[q.vis.k],a=ans[q.n],body=h("div",{class:"qbody"}),out=h("div"),S={done:a?performance.now()-1e5:0};
    const vis=DRAW&&f?stage(lw=>({lw,h:Math.round(f.h?f.h(lw):cl(lw*0.56,190,300))}),(ctx,o,now)=>f(ctx,o,now,q,S),(L.pics.alt&&L.pics.alt[q.vis.k])||q.title):null;
    const F=FILMS[q.film]||{};body.append(h("p",{class:"qtag",style:"--c:"+labOf(q.lab).c},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+Q.length+" · "+filmN(q.film)+(F.t?", "+F.t:"")),h("h3",{tabindex:"-1"},q.title),h("p",{class:"qsit"},q.sit));
    const fin=(ok,pick)=>{if(!ans[q.n])done(q,ok,pick);S.done=performance.now();if(vis)vis.kick(1600);out.replaceChildren(feed(ok,q),foot(q));};
    {const O=q.opts,bx=h("div",{class:"qopts"});
      O.forEach((o,j)=>{bx.append(h("button",{type:"button",class:"qopt","data-j":j,onclick:()=>pick(j)},h("span",{class:"k"},"ABCDE"[j]),h("span",null,o.t)));});
      function pick(j,quiet){[...bx.children].forEach(b=>{const k=+b.dataset.j;b.disabled=true;if(O[k].ok)b.classList.add("ok");});const o=O[j],b=bx.querySelector('[data-j="'+j+'"]');
        if(!o.ok){b.classList.add("no");if(o.why)b.append(h("small",null,o.why));}fin(!!o.ok,j);if(!quiet)focusIn(out.querySelector(".btn"));}
      body.append(bx);
      // a saved pick that no longer gives its saved result (the options moved) is asked again
      if(a&&a.pick!=null&&O[a.pick]&&!!O[a.pick].ok===!!a.ok)pick(a.pick,true);else if(a){delete ans[q.n];put("quiz",ans);paintBar();}}
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis"},vis?vis.el:null),body));if(focus){const t=body.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}card.scrollIntoView({block:"nearest",behavior:RM()?"auto":"smooth"});}}
  function results(focus){paintBar();const Q=list(),ok=Q.filter(q=>ans[q.n]&&ans[q.n].ok).length,n=Q.length,band=L.done[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};Q.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(ans[q.n]&&ans[q.n].ok)by[k].ok++;});const open=QS.filter(q=>!ans[q.n]).length;
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/Math.max(1,n)*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",{tabindex:"-1"},band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:"../labs/#"+k,class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+labOf(k).c},h("i"),labOf(k).name+" · "+by[k].ok+"/"+by[k].n))),
      film&&open?h("p",{class:"da-open"},h("a",{href:"#",onclick:e=>{e.preventDefault();setFilm(0);}},fill(U.stillOpen,{n:open}))):null,
      h("button",{type:"button",class:"btn",onclick:()=>{Q.forEach(q=>delete ans[q.n]);put("quiz",ans);cur=0;render(true);}},U.again))));
    if(focus){const t=card.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}}}
  // one list of every scenario of the series, no film level: n, a film whose scenarios to start at (from #film-<n>), opens its first
  // one left, or its first; otherwise the first one left, or the results
  function setFilm(n){film=0;const one=films.includes(n),of=q=>!one||q.film===n,Q=list(),todo=Q.findIndex(q=>of(q)&&!ans[q.n]),first=Q.findIndex(of);
    if(one&&history.replaceState)history.replaceState(null,"",location.pathname+location.search);
    if(todo>=0){cur=todo;render(false);}else if(one&&first>=0){cur=first;render(false);}else results(false);}
  const fromHash=()=>{const m=(location.hash||"").match(/^#film-(\d+)$/);return m?+m[1]:0;};
  // the first one waits for the rest of this file, where the pictures are
  window.addEventListener("hashchange",()=>{const n=fromHash();if(n)setFilm(n);});Promise.resolve().then(()=>setFilm(fromHash()));}


/* ---------- the scenarios' pictures ---------- */
// Each draws the situation, not its answer; once it's answered (S.done), its lines are drawn in, in gold
const PK=L.pics,GO=(S,now)=>S.done?eo((RM()?1e9:now-S.done)/700):0;
// a dashed line, or once answered a drawn one
function joinLine(ctx,x0,y0,x1,y1,t){ctx.save();ctx.strokeStyle=rgbaS(t>0?K.gold:K.soft,t>0?0.45+0.5*t:0.42);ctx.lineWidth=1.5;if(t<1)ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();}
// one word, defined once, with its owner, and six systems' records of it, each with a line up to the word
VIS.records=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[3]);const R=PK.records,m=12,ww=Math.min(260,o.lw-m*2),wx=(o.lw-ww)/2,wy=14,wh=42,t=GO(S,now);
  const cols=o.lw<440?2:3,g=8,cw=(o.lw-m*2-g*(cols-1))/cols,ch=42,y0=wy+wh+40,at=i=>[m+(i%cols)*(cw+g),y0+Math.floor(i/cols)*(ch+10)];
  R.recs.forEach((r,i)=>{const[x,y]=at(i);joinLine(ctx,x+cw/2,y,wx+ww*(0.15+0.7*(i%cols)/Math.max(1,cols-1)),wy+wh,t);});
  el(ctx,wx,wy,ww,wh,R.word,K.lay[2],"object",{size:15});pill(ctx,wx+ww,wy+wh+6,R.owner,K.gold,{align:"right",size:12.5});
  R.recs.forEach((r,i)=>{const[x,y]=at(i);el(ctx,x,y,cw,ch,r,K.lay[3],"object",{size:13});});};
VIS.records.h=lw=>lw<440?14+42+40+3*52+4:14+42+40+2*52+4;
// five steps from a decision down to a record: an arrow down that asks, and one up that answers
VIS.chain=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[200,186,255]);const C=PK.chain,n=C.length,m=12,hh=30,g=8,y0=12,t=GO(S,now),
    ar=Math.max(56,Math.ceil(Math.max(TW(ctx,PK.down,12.5),TW(ctx,PK.up,12.5)))+30),w=Math.min(300,o.lw-m*2-ar*2),x=(o.lw-w)/2,yb=y0+n*(hh+g)-g;
  C.forEach((s,i)=>chip(ctx,x,y0+i*(hh+g),w,hh,s,mixC([200,186,255],[140,214,255],i/(n-1)),{size:14,glow:i===0?12:6}));
  arrow(ctx,x-16,y0+6,x-16,yb-6,K.soft,0.9,{dash:[5,4]});arrow(ctx,x+w+16,yb-6,x+w+16,y0+6,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[5,4],lw:t>0?2.4:2});
  T(ctx,PK.down,x-24,(y0+yb)/2+4,{w:700,size:12.5,align:"right",color:rgbaS(K.soft,1)});T(ctx,PK.up,x+w+24,(y0+yb)/2+4,{w:700,size:12.5,color:rgbaS(t>0?K.gold:K.soft,1)});};
VIS.chain.h=()=>12+5*38+4;
// a fact born in one system, which creates it, and three that copy it, each with a line back to where it was born. In "Born twice"
// (vis.two) billing creates it too, with no line back, until it's answered; in "A wrong address" (vis.bad) one copy is wrong, until then
VIS.born=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[140,214,255]);const B=PK.born,V=q.vis||{},m=12,hw=Math.min(250,o.lw-m*2),hx=(o.lw-hw)/2,hy=14,hh=40,cs=B.sys.slice(1,4),g=8,cw=(o.lw-m*2-g*2)/3,cy=hy+hh+52,ch=44,t=GO(S,now);
  const dup=i=>V.two&&i===0,lab=(s,x,a,c,w)=>withA(ctx,a,()=>line1(ctx,s,x,cy+ch+17,cw,12.5,{w,align:"center",color:rgbaS(c,1)}));
  cs.forEach((s,i)=>{const x=m+i*(cw+g);if(!dup(i)||t>0)joinLine(ctx,x+cw/2,cy,hx+hw*(0.2+0.3*i),hy+hh,t);});
  chip(ctx,hx,hy,hw,hh,B.sys[0],[150,222,196],{size:15,glow:12});line1(ctx,B.creates,hx,hy+hh+18,hw*0.4,12.5,{w:800,color:rgbaS(K.gold,1)});
  cs.forEach((s,i)=>{const x=m+i*(cw+g);chip(ctx,x,cy,cw,ch,s,V.bad===i?mixC(K.bad,K.lay[4],t):K.lay[4],{size:13,glow:V.bad===i&&t<1?12:6});
    if(dup(i)){lab(B.creates,x,1-t,K.gold,800);lab(B.copies,x,t,K.soft,700);}else lab(B.copies,x,1,K.soft,700);});};
VIS.born.h=()=>14+40+52+44+28;
// the network and retail, a wall between them, and paths across it, dashed and nobody's; once answered, one is a flow, drawn
VIS.wall=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[150,222,196]);const Wl=PK.wall,m=12,mid=o.lw/2,top=40,bot=o.h-12,t=GO(S,now),NC=[150,222,196],RC=[255,176,196];
  glass(ctx,m,top,mid-m-12,bot-top,10,NC,{fill:"rgba(7,12,24,0.9)",glow:6,ea:0.6});glass(ctx,mid+12,top,o.lw-m-mid-12,bot-top,10,RC,{fill:"rgba(7,12,24,0.9)",glow:6,ea:0.6});
  line1(ctx,Wl.net,m+12,top+22,mid-m-36,14,{w:800,color:rgbaS(NC,1)});line1(ctx,Wl.ret,mid+24,top+22,o.lw-m-mid-36,14,{w:800,align:"right",color:rgbaS(RC,1)});
  ctx.save();ctx.fillStyle="rgba(160,178,205,0.9)";ctx.fillRect(mid-4,top-8,8,bot-top+16);ctx.restore();
  [0.22,0.44,0.66,0.88].forEach((f,i)=>{const y=top+34+(bot-top-46)*f,y2=y+(i%2?7:-7),one=i===1;
    if(one)arrow(ctx,m+26,y,o.lw-m-26,y2,t>0?K.gold:K.soft,0.9,{dash:t>=1?null:[4,5],lw:t>0?2.6:2});
    else withA(ctx,1-0.7*t,()=>arrow(ctx,m+26,y,o.lw-m-26,y2,K.soft,0.8,{dash:[4,5]}));});
  line1(ctx,Wl.paths,m,24,o.lw-m*2,13,{w:700,color:rgbaS(K.soft,1)});};
VIS.wall.h=()=>210;
// three domains, each with its owner in gold, and the data team's platform under them all
VIS.owners=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[255,209,102]);const O2=PK.owners,m=12,g=8,hh=46,y0=12,t=GO(S,now),cw=Math.min(190,(o.lw-m*2)*0.48);
  [[O2.net,O2.grace,[150,222,196]],[O2.ret,O2.head,[255,176,196]],[O2.ent,O2.ama,[200,186,255]]].forEach(([d,who,c],i)=>{const y=y0+i*(hh+g),w=o.lw-m*2;
    glass(ctx,m,y,w,hh,10,c,{fill:"rgba(7,12,24,0.9)",glow:6,ea:0.7});ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgbaS(c,0.8);ctx.lineWidth=1.4;rr(ctx,m+4,y+4,w-8,hh-8,8);ctx.stroke();ctx.restore();
    line1(ctx,d,m+16,y+hh/2+5,w-cw-40,14,{w:800,color:rgbaS(c,1)});chip(ctx,m+w-cw-8,y+6,cw,hh-12,who,K.gold,{size:13,glow:t>0?12:6});});
  const py=y0+3*(hh+g)+6,ph=38;glass(ctx,m,py,o.lw-m*2,ph,8,K.lay[4],{fill:"rgba(7,12,24,0.92)",glow:6,ea:0.7});line1(ctx,O2.team,m+16,py+ph/2+5,o.lw-m*2-32,14,{w:700,color:rgbaS(K.lay[4],1)});};
VIS.owners.h=()=>12+3*54+6+38+12;
// a name built from three parts, the thing, what about it and the kind of value, and the column it makes
VIS.name=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[245,206,140]);const N=PK.name,m=12,g=22,w=(o.lw-m*2-g*2)/3,y=16,hh=46,cs=[K.lay[2],K.lay[3],K.lay[4]],t=GO(S,now);
  N.parts.forEach((s,i)=>{const x=m+i*(w+g);chip(ctx,x,y,w,hh,s,cs[i],{size:14});lines(ctx,N.roles[i],x,y+hh+18,w,{size:12.5,max:2,align:"center",color:rgbaS(K.soft,1)});
    if(i)T(ctx,"+",x-g/2,y+hh/2+6,{w:800,size:18,align:"center",color:rgbaS(K.ink,0.9)});});
  const cy=y+hh+56,cw=Math.min(o.lw-m*2,380);joinLine(ctx,o.lw/2,y+hh+40,o.lw/2,cy,t);chip(ctx,(o.lw-cw)/2,cy,cw,40,N.col,K.lay[4],{size:14,glow:t>0?12:6});};
VIS.name.h=()=>16+46+56+40+14;
})();
