/* Learning Data: The map before the data. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from one
   engine: the series' labs page and scenarios page load the newest film's bundle (for the films' own parts: glass, slabs, paper,
   ArchiMate's glyphs), the words (learn.en.js or learn.es.js, which set window.EA), and this file.
   A lab is one of seven kinds, described by its words:
     deal       cards dealt one at a time: put each where it belongs, and see why before the next (labs 1, 2, 3, 7, 8 and 12)
     change     put a capability map through three changes, and name what was under each box that broke (4)
     night      send two crews into a storm, then find where the rule's facts come from (5)
     gate       mark what may cross the wall between two domains, then open the gate (6)
     rule       split a rule where it crosses the wall, give each half a home, and draw its checks from it (9)
     walk       walk a change down the six layers (10)
     navigator  run the map's own checks, fix what fails, then ask its agent (11)
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its
   words stay big enough to read on a phone. Things move with a spring and settle, or jump to where they end when the visitor asks
   for reduced motion, and every change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films: by
   number, each film's title, page and chapter starts, or "coming" for a film being made), both from site-tools/build_series.py.
   Progress stays in this browser: "visited" (the lab ids) and "quiz" (answers by scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.EA,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-enterprise-architecture";
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
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).length||11,filmN=n=>fill(U.filmN,{n,of:NF});
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
// the films' colours: ink, the six layers (motivation to technology), paper notes, and right, wrong and gold
const K={ink:[236,243,255],soft:[160,178,205],good:[120,240,170],bad:[255,112,100],gold:[255,209,102],inkd:[40,40,48],paper:[239,232,218],
  lay:[[200,186,255],[245,206,140],[255,234,130],[255,186,150],[140,214,255],[160,224,140]],notes:[[255,228,122],[255,176,196],[164,212,255],[188,236,164]],
  mig:[190,228,206],dom:[[110,214,196],[255,176,120]]};
const rgbaS=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")",mixC=(a,b,t)=>[lp(a[0],b[0],t),lp(a[1],b[1],t),lp(a[2],b[2],t)];
const LN=(ctx,s,w,z,wt)=>wrapT(ctx,String(s),0,0,w,{size:z,w:wt||700,measure:true});
const TW=(ctx,s,z,wt)=>tw(ctx,String(s),z,wt||700);
// words a picture had to cut short, or let spill, for smoke.py's series-learn check (site-tools/smoke/enterprise-architecture.js)
const MISS=window.EA_MISS=new Set();
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
// a piece of the map moving into place: from where it was dealt straight to its place, with a spring; when the first pick was wrong,
// to the wrong place first, a shake, then on to the right one. Returns [x, y, scale, still in the wrong place]
function fly(now,t0,ok,A,B,X){const t=RM()?1e9:now-t0;
  if(ok||!X){const u=cl(t/600,0,1);return[lp(A[0],B[0],eo(u)),lp(A[1],B[1],sp(u)),lp(0.75,1,eo(u)),false];}
  if(t<440){const u=eo(t/440);return[lp(A[0],X[0],u),lp(A[1],X[1],u),lp(0.75,1,u),true];}
  if(t<900){const k=(t-440)/460;return[X[0]+Math.sin(k*Math.PI*5)*5*(1-k),X[1],1,true];}
  const u=cl((t-900)/620,0,1);return[lp(X[0],B[0],eo(u)),lp(X[1],B[1],sp(u)),1,false];}
const FLY=[700,1620];
function scaled(ctx,x,y,w,hh,s,fn){if(Math.abs(s-1)<0.002)return fn();ctx.save();ctx.translate(x+w/2,y+hh/2);ctx.scale(s,s);ctx.translate(-(x+w/2),-(y+hh/2));fn();ctx.restore();}
const since=(now,t0)=>RM()?1e9:now-(t0||0);

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
  ready().then(()=>st.relayout());if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>st.relayout());
  return st;}
// a lab's picture, made only when the film's parts are here
const picOf=(Lb,mk)=>DRAW&&mk?mk():null;

/* ---------- the parts of a lab's page ---------- */
const say0=()=>h("p",{class:"lab-say",role:"status"});
const info=t=>h("p",{class:"lab-info"},t);
const btn=(t,on,cls)=>h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:on},t);
// a fixed order for a question's options, the same on every visit: shuffled, with "none" (no one, nothing) kept last
function order(opts,seed){const ix=opts.map((o,i)=>i),last=ix.filter(i=>(opts[i][0]||opts[i].k)==="none");return ix.filter(i=>!last.includes(i)).sort((a,b)=>hs(seed*13+a)-hs(seed*13+b)).concat(last);}
const why=(ok,txt)=>h("p",{class:"ea-why"},h("b",{class:ok?"ok":"no"},ok?U.right:U.notQuite)," ",txt);
// what the lab says (.lab-say); at the end, its box on the page says it, so the line keeps it only for a screen reader
const sayIt=(say,t)=>{say.classList.remove("sr");say.textContent=t;},endSay=(say,t)=>{say.textContent=t;say.classList.add("sr");};
const lc=s=>s&&!/^[A-Z]{2}/.test(s)?s[0].toLowerCase()+s.slice(1):s;
function focusIn(el){if(!el)return;try{el.focus({preventScroll:true});}catch(e){el.focus();}const r=el.getBoundingClientRect();if(r.bottom>innerHeight-8||r.top<120)el.scrollIntoView({block:"center",behavior:RM()?"auto":"smooth"});}

/* ---------- deal: cards dealt one at a time ---------- */
// Each lab of this kind has a picture (PIC[id]), which lands each card where it belongs; S is what has happened so far.
const PIC={};
function labDeal(Lb){const W=Lb.w,its=W.items,n=its.length,S={i:0,done:[],first:{},t:{},fx:{},off:new Set()},box=h("div",{class:"lab ea-lab"}),say=say0();
  const pic=picOf(Lb,PIC[Lb.id]&&(()=>PIC[Lb.id](Lb,S))),st=pic?stage(pic.lay,pic.draw,(W.pic&&W.pic.alt)||Lb.name):null;
  const deal=h("div",{class:"ea-deal"}),ctrl=h("div",{class:"lab-controls"});
  const optsOf=it=>it.opts||W.buckets,lab=(it,k)=>(optsOf(it).find(o=>o[0]===k)||[,""])[1];
  const right=()=>S.done.filter(i=>S.first[i]===its[i].b).length;
  function status(){if(S.i<n)sayIt(say,fill(U.placed,{n:S.done.length,of:n})+(S.done.length?" · "+right()+" "+U.firstTry:""));else endSay(say,fill(W.end,{n:right(),of:n}));}
  function show(focus){deal.replaceChildren();ctrl.replaceChildren();if(pic&&pic.show)pic.show(S.i);if(st)st.kick(900);
    if(S.i>=n)return finish(focus);
    const i=S.i,it=its[i],O=optsOf(it),ix=it.opts?order(O,strH(Lb.id)+i):O.map((o,j)=>j);
    const extra=it.e||it.note||(it.film&&it.from?U.fromFilm+" "+filmN(it.film)+(filmName(it.film)?", "+filmName(it.film):""):null);
    const cardEl=h("div",{class:"ea-card"},h("p",{class:"k"},fill(U.card,{n:i+1,of:n})),h("p",{class:"t",id:"ea-t-"+Lb.id},it.t),extra?h("p",{class:"e"},extra):null);
    const groupsOf=()=>W.groups?W.groups.map(([g,ks])=>h("div",{class:"ea-group"},h("span",{class:"ea-gl"},g),...ks.map(k=>bt(O.findIndex(o=>o[0]===k))))):ix.map(j=>bt(j));
    const opts=h("div",{class:"ea-opts"+(W.groups?" grouped":""),role:"group","aria-labelledby":"ea-t-"+Lb.id});
    function bt(j){const o=O[j];return h("button",{type:"button","data-k":o[0],onclick:()=>answer(o[0])},o[1]);}
    opts.append(...groupsOf());deal.append(cardEl,opts);
    function answer(k){if(S.first[i]!=null)return;S.first[i]=k;S.t[i]=performance.now();S.done.push(i);const ok=k===it.b;
      opts.querySelectorAll("button").forEach(b=>{b.disabled=true;if(b.dataset.k===it.b)b.classList.add("ok");else if(b.dataset.k===k)b.classList.add("no");});
      const no=!ok&&it.no&&it.no[k]?it.no[k]+" ":"",bel=!ok&&!it.opts?fill(U.belongs,{b:lab(it,it.b)})+" ":"";
      deal.append(why(ok,bel+no+it.why));if(pic&&pic.answer)pic.answer(i,k);if(st)st.kick(ok?FLY[0]:FLY[1]);
      const nx=btn(S.i+1<n?U.go+" →":U.seeAll,()=>{S.i++;show(true);},"go");ctrl.replaceChildren(nx);status();focusIn(nx);}
    status();if(focus)focusIn(opts.querySelector("button"));}
  function finish(focus){const again=btn(U.again,()=>{S.i=0;S.done=[];S.first={};S.t={};S.fx={};S.off.clear();show(true);},"sm");
    deal.append(h("p",{class:"ea-end"},fill(W.end,{n:right(),of:n})));if(W.off)deal.append(offs());ctrl.replaceChildren(again);status();if(focus)focusIn(deal.querySelector("button")||again);}
  // the map, once it's whole: switch a system off, and follow it up to what loses support
  function offs(){const id="ea-off-"+Lb.id,g=h("div",{class:"ea-opts ea-off",role:"group","aria-labelledby":id});
    its.forEach((it,i)=>g.append(h("button",{type:"button","aria-pressed":"false",onclick:e=>{const on=!S.off.has(i);on?S.off.add(i):S.off.delete(i);
      e.currentTarget.setAttribute("aria-pressed",String(on));sayIt(say,on?it.off:fill(W.off.back,{t:it.t}));if(st)st.kick(700);}},fill(W.off.label,{t:it.t}))));
    return h("div",{class:"ea-step"},h("p",{class:"ea-q",id},W.off.prompt),g);}
  box.append(...(st?[st.el]:[]),info(W.prompt),deal,ctrl,say);show(false);return box;}

/* ---------- the pictures of the deal labs ---------- */
// 1 · Sort the pile: the six layers, the pieces landing on the one each tells you about, and, at the end, no links between them
PIC.pile=(Lb,S)=>{const W=Lb.w,its=W.items,keys=W.buckets.map(b=>b[0]),col=k=>K.lay[keys.indexOf(k)],nameOf=k=>W.buckets.find(b=>b[0]===k)[1];
  const lay=(lw,ctx)=>{const x0=12,labW=Math.ceil(Math.max(...W.buckets.map(b=>TW(ctx,b[1],14,800))))+26,cw=lw-x0*2-labW-18,o={lw,x0,labW,rows:[],slot:{},row:{}};let y=52;
    W.groups.forEach(([g,ks])=>{o.rows.push({g,y,c:col(ks[0])});y+=19;
      ks.forEach(k=>{const mine=its.map((it,i)=>[it,i]).filter(([it])=>it.b===k),f=flow(ctx,mine.map(([it])=>it.s),cw,13,6),sh=Math.max(38,f.h+14),r={k,y,h:sh,c:col(k)};o.rows.push(r);o.row[k]=r;
        mine.forEach(([it,i],j)=>{const p=f.pos[j];o.slot[i]={x:x0+labW+8+p.x,y:y+(sh-f.h)/2+p.y,w:p.w,h:p.h};});y+=sh+6;});y+=8;});
    o.qx=Math.min(lw-x0-24,Math.max(x0+labW-4,...W.groups.slice(1).map(([g])=>x0+2+TW(ctx,g,13,800)+16)));o.h=y;o.deck=[lw-x0-74,10];return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));const done=S.done.length===its.length,left=its.length-S.done.length;
    o.rows.forEach(r=>{if(r.g){T(ctx,r.g,o.x0+2,r.y+13,{w:800,size:13,color:rgbaS(r.c,1)});return;}
      const n=its.filter(it=>it.b===r.k).length,got=S.done.filter(i=>its[i].b===r.k&&since(now,S.t[i])>500).length;
      slab(ctx,o.x0,r.y,o.lw-o.x0*2-8,r.h,"",r.c,{sk:8,label:false,fill:n?got/n*0.6:0});T(ctx,nameOf(r.k),o.x0+16,r.y+r.h/2+5,{w:800,size:14,color:rgbaS(mixC(r.c,K.ink,0.35),1)});});
    // what he was handed: a pile that shrinks as the pieces land
    const[dx,dy]=o.deck;for(let j=Math.min(left,4)-1;j>=0;j--)paper(ctx,dx+j*3,dy+j*2,70,34,"",K.notes[j%4],{rot:(j-1.5)*0.05});
    if(left){T(ctx,String(left),dx+38,dy+24,{w:800,size:17,align:"center",color:rgbaS(K.inkd,0.9)});T(ctx,W.pic.now,dx-10,dy+24,{w:700,size:13,align:"right",color:rgbaS(K.soft,1)});}
    S.done.forEach(i=>{const it=its[i],B=o.slot[i],ok=S.first[i]===it.b,wr=o.row[S.first[i]],X=ok?null:[o.x0+o.labW+8,wr.y+(wr.h-B.h)/2],[x,y,s,bad]=fly(now,S.t[i],ok,[dx,dy],[B.x,B.y],X);
      scaled(ctx,x,y,B.w,B.h,s,()=>paper(ctx,x,y,B.w,B.h,it.s,K.notes[i%4],{edge:bad?K.bad:null,mark:!bad&&since(now,S.t[i])>(ok?FLY[0]:FLY[1])-80&&ok?"ok":null}));});
    // the pile holds a true piece on every layer, and nothing links them: a question between each layer and the next, clear of the headings
    if(done){const a=eo(since(now,S.fx.end)/700),x=o.qx;const sl=o.rows.filter(r=>!r.g);withA(ctx,a,()=>{for(let j=0;j<sl.length-1;j++){const y0=sl[j].y+sl[j].h-6,y1=sl[j+1].y+6;
      ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle=rgbaS(K.gold,0.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();ctx.restore();
      ctx.save();ctx.fillStyle="rgba(7,12,24,0.95)";ctx.beginPath();ctx.arc(x,(y0+y1)/2,9,0,TP);ctx.fill();ctx.strokeStyle=rgbaS(K.gold,1);ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
      T(ctx,"?",x,(y0+y1)/2+5,{w:800,size:13,align:"center",color:rgbaS(K.gold,1)});}
      T(ctx,W.pic.links,o.lw-o.x0-6,o.deck[1]+24,{w:800,size:13,align:"right",color:rgbaS(K.gold,1)});});}};
  return{lay,draw,show:i=>{if(i>=its.length&&!S.fx.end)S.fx.end=performance.now();},reset:()=>{}};};

// 2 · Check the fit: the value map on the left, the customer's pains and gains on the right, a line from each to what answers it
PIC.fit=(Lb,S)=>{const W=Lb.w,its=W.items,pc=W.pic,offers=W.buckets.filter(b=>b[0]!=="none"),canvasOf=i=>(its[Math.min(i,its.length-1)]||{}).canvas||"households";
  const PAIN=[196,64,92],GAIN=[38,128,76],RED=[200,52,40];
  const lay=(lw,ctx)=>{const m=16,gx=Math.round(cl(lw*0.1,28,56)),cw=Math.floor((lw-m*2-gx)/2),pw=TW(ctx,pc.households+" · "+pc.fits+" ✓",13)+18,
      t0=TW(ctx,pc.solar,16,800)+pw+20>lw-m*2?26:0,o={lw,m,cw,gx,t0,pw,off:{},row:{}};let y=72+t0;
    offers.forEach(([k,t])=>{const nl=fitL(ctx,t,cw-16,13,3)[0].length,hh=Math.round(nl*15.6+14);o.off[k]={x:m,y,w:cw,h:hh};y+=hh+7;});
    const yr={households:72+t0,solar:72+t0};its.forEach((it,i)=>{if(it.side==="verdict")return;const cv=it.canvas||"households",nl=fitL(ctx,it.s,cw-30,13,3)[0].length,hh=Math.round(nl*15.6+14);
      o.row[i]={x:m+cw+gx,y:yr[cv],w:cw,h:hh};yr[cv]+=hh+7;});
    o.miss={x:m,y:Math.max(yr.solar+10,y-4),w:lw-m*2,h:46};o.h=Math.max(y,yr.households,o.miss.y+o.miss.h)+18;return o;};
  const draw=(ctx,o,now)=>{sheet(ctx,6,6,o.lw-12,o.h-12,{rot:-0.004,plain:true});
    const cvNow=canvasOf(S.i),sol=cvNow==="solar"?eo(since(now,S.fx.sol)/700):0,ink=a=>"rgba(48,44,50,"+a+")";
    // which canvas: households, then homes with solar
    line1(ctx,sol>0.5?pc.solar:pc.households,o.m+4,30,o.t0?o.lw-o.m*2-8:o.lw-o.m*2-o.pw-20,16,{w:800,color:ink(0.92)});
    if(sol>0)withA(ctx,sol,()=>{const w=o.pw,py=o.t0?40:16;ctx.fillStyle="rgba(38,128,76,0.14)";rr(ctx,o.lw-o.m-w,py,w,22,11);ctx.fill();T(ctx,pc.households+" · "+pc.fits+" ✓",o.lw-o.m-w+9,py+15,{w:700,size:13,color:"rgba(30,110,64,1)"});});
    // the value map is a square; the customer profile is a circle
    ctx.save();ctx.strokeStyle=ink(0.8);ctx.lineWidth=1.8;ctx.strokeRect(o.m+2,47+o.t0,11,11);ctx.beginPath();ctx.arc(o.m+o.cw+o.gx+8,52.5+o.t0,6,0,TP);ctx.stroke();ctx.restore();
    T(ctx,pc.map,o.m+20,57+o.t0,{w:800,size:13,color:ink(0.85)});T(ctx,pc.profile,o.m+o.cw+o.gx+20,57+o.t0,{w:800,size:13,color:ink(0.85)});
    offers.forEach(([k,t])=>{const r=o.off[k],hit=S.done.some(i=>its[i].b===k&&canvasOf(i)===cvNow&&since(now,S.t[i])>520);
      ctx.save();ctx.fillStyle=hit?"rgba(255,214,120,0.32)":"rgba(255,255,255,0.35)";ctx.fillRect(r.x,r.y,r.w,r.h);ctx.restore();marker(ctx,[[r.x,r.y],[r.x+r.w,r.y],[r.x+r.w,r.y+r.h],[r.x,r.y+r.h],[r.x,r.y]],1,{lw:1.8,seed:strH(k)%9,col:ink(0.75)});
      lines(ctx,t,r.x+8,r.y+r.h/2-(fitL(ctx,t,r.w-16,13,3)[0].length-1)*7.8+4.7,r.w-16,{size:13,max:3,color:ink(0.92)});});
    S.done.forEach(i=>{const it=its[i];if(it.side==="verdict")return;const cv=canvasOf(i),fade=cv==="households"?1-sol:sol;if(fade<=0.01)return;const r=o.row[i],ok=S.first[i]===it.b,t=since(now,S.t[i]);
      withA(ctx,fade,()=>{const u=eo(t/520);paper(ctx,r.x,r.y+(1-u)*24,r.w,r.h,it.s,it.side==="pain"?K.notes[1]:K.notes[3],{rot:0,a:u,max:3,mark:t>600&&ok?"ok":null});
        T(ctx,it.side==="pain"?"–":"+",r.x-9,r.y+r.h/2+5,{w:800,size:15,align:"center",color:it.side==="pain"?rgbaS(PAIN,1):rgbaS(GAIN,1)});
        const d=cl((t-500)/600,0,1);if(d>0){if(it.b==="none"){T(ctx,"?",r.x-o.gx/2-4,r.y+r.h/2+6,{w:800,size:18,align:"center",color:rgbaS(RED,d)});}
          else{const f=o.off[it.b];marker(ctx,[[r.x-4,r.y+r.h/2],[lp(r.x-4,f.x+f.w+3,0.5),lp(r.y+r.h/2,f.y+f.h/2,0.5)+3],[f.x+f.w+3,f.y+f.h/2]],d,{lw:2.2,seed:i+3,col:it.side==="pain"?rgbaS(PAIN,0.9):rgbaS(GAIN,0.9)});}}});});
    // the card in hand: its place on the profile, dashed, until it's answered
    const cur=S.i<its.length&&S.first[S.i]==null&&its[S.i].side!=="verdict"?S.i:-1;
    if(cur>=0){const it=its[cur],r=o.row[cur],fade=canvasOf(cur)==="households"?1-sol:sol;if(fade>0.01)withA(ctx,fade,()=>{ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=ink(0.55);ctx.lineWidth=1.6;ctx.strokeRect(r.x+0.8,r.y+0.8,r.w-1.6,r.h-1.6);ctx.restore();
      lines(ctx,it.s,r.x+8,r.y+r.h/2-(fitL(ctx,it.s,r.w-16,13,3)[0].length-1)*7.8+4.7,r.w-16,{size:13,max:3,align:"center",color:ink(0.5)});
      T(ctx,it.side==="pain"?"–":"+",r.x-9,r.y+r.h/2+5,{w:800,size:15,align:"center",color:it.side==="pain"?rgbaS(PAIN,0.6):rgbaS(GAIN,0.6)});});}
    // nothing relieves it: a capability is missing
    const v=its.findIndex(it=>it.side==="verdict");if(S.first[v]!=null){const r=o.miss,a=eo(since(now,S.t[v])/700);withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(200,52,40,0.10)";ctx.fillRect(r.x,r.y,r.w,r.h);ctx.restore();
      marker(ctx,[[r.x,r.y],[r.x+r.w,r.y],[r.x+r.w,r.y+r.h],[r.x,r.y+r.h],[r.x,r.y]],a,{lw:2.4,seed:4,col:rgbaS(RED,0.9)});archGlyph(ctx,"capability",r.x+20,r.y+r.h/2,8,RED);
      lines(ctx,pc.missing,r.x+38,r.y+r.h/2-(fitL(ctx,pc.missing,r.w-50,13,2)[0].length-1)*7.8+4.7,r.w-50,{size:13,max:2,color:"rgba(150,36,28,1)"});});}};
  return{lay,draw,show:i=>{if(canvasOf(i)==="solar"&&!S.fx.sol)S.fx.sol=performance.now();}};};

// 3 · Sort the chain: the chain's elements, as ArchiMate draws them, each with the statements that belong to it; a bin for the rest
PIC.chain=(Lb,S)=>{const W=Lb.w,its=W.items,ks=["stakeholder","driver","assessment","goal","outcome","principle","none"],MOT=K.lay[0],nameOf=k=>W.buckets.find(b=>b[0]===k)[1];
  const lay=(lw,ctx)=>{const m=12,ew=Math.round(cl(lw*0.36,118,190)),cx=m+ew+14,cw=lw-cx-m,o={lw,m,ew,cx,row:{},slot:{}};let y=12;
    ks.forEach((k,ki)=>{const mine=its.map((it,i)=>[it,i]).filter(([it])=>it.b===k),f=flow(ctx,mine.map(([it])=>it.s),cw,13,6),rh=Math.max(36,f.h);if(ki===5)y+=8;
      o.row[k]={y,h:rh};mine.forEach(([it,i],j)=>{const p=f.pos[j];o.slot[i]={x:cx+p.x,y:y+(rh-f.h)/2+p.y,w:p.w,h:p.h};});y+=rh+(ki<4?14:10);});o.h=y+2;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));
    ks.forEach((k,ki)=>{const r=o.row[k],y=r.y+(r.h-36)/2;if(k==="none"){chip(ctx,o.m,y,o.ew,36,W.pic.bin,K.soft,{dash:1,tint:0.04,glow:0});return;}
      const lit=S.done.some(i=>its[i].b===k&&since(now,S.t[i])>520);el(ctx,o.m,y,o.ew,36,nameOf(k),MOT,k,{hi:lit?1:0});
      if(ki<4)arrow(ctx,o.m+o.ew/2,y+38,o.m+o.ew/2,o.row[ks[ki+1]].y+(o.row[ks[ki+1]].h-36)/2-2,MOT,0.7,{lw:1.6,head:6});});
    S.done.forEach(i=>{const it=its[i],B=o.slot[i],ok=S.first[i]===it.b,wr=o.row[S.first[i]],X=ok?null:[o.cx,wr.y+(wr.h-B.h)/2],[x,y,s,bad]=fly(now,S.t[i],ok,[o.lw/2,o.h],[B.x,B.y],X),t=since(now,S.t[i]);
      scaled(ctx,x,y,B.w,B.h,s,()=>chip(ctx,x,y,B.w,B.h,it.s,it.b==="none"?K.soft:MOT,{strike:it.b==="none"&&!bad&&t>(ok?FLY[0]:FLY[1]),lw:bad?2.6:null,ea:bad?1:0.8,tint:bad?0.3:0.13,mark:!bad&&ok&&t>FLY[0]-80?"ok":null,glow:bad?0:8}));
      if(bad)withA(ctx,1,()=>{ctx.save();ctx.strokeStyle=rgbaS(K.bad,1);ctx.lineWidth=2.4;rr(ctx,x-1,y-1,B.w+2,B.h+2,9);ctx.stroke();ctx.restore();});});};
  return{lay,draw};};

// 7 · Place the systems: each capability with the systems under it; what appears once they're placed; then switch one off
PIC.place=(Lb,S)=>{const W=Lb.w,its=W.items,ks=W.buckets.map(b=>b[0]),STR=K.lay[1],APP=K.lay[4];
  const lay=(lw,ctx)=>{const m=12,ew=Math.round(cl(lw*0.37,124,200)),cx=m+ew+12,cw=lw-cx-m,o={lw,m,ew,cx,row:{},slot:{}};let y=12;
    // a row is as tall as its capability's name (up to three lines), with room for the tag a placed row can show
    ks.forEach(k=>{const mine=its.map((it,i)=>[it,i]).filter(([it])=>it.b===k),f=flow(ctx,mine.map(([it])=>it.t),cw,13,6),nm=W.buckets.find(b=>b[0]===k)[1];
      const nl=fitL(ctx,nm,k==="none"?ew-14:ew-42,13,3)[0].length,tag=k==="outages"||k==="capacity"||k==="none",rh=Math.max(44,Math.round(nl*15.6+16)+(tag?16:0),f.h);
      o.row[k]={y,h:rh};mine.forEach(([it,i],j)=>{const p=f.pos[j];o.slot[i]={x:cx+p.x,y:y+(rh-f.h)/2+p.y,w:p.w,h:p.h};});y+=rh+10;});o.h=y+2;return o;};
  const landed=(i,now)=>S.first[i]!=null&&since(now,S.t[i])>(S.first[i]===its[i].b?FLY[0]:FLY[1]);
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));
    ks.forEach(k=>{const r=o.row[k],mine=its.map((it,i)=>i).filter(i=>its[i].b===k),on=mine.filter(i=>landed(i,now)&&!S.off.has(i)),lost=mine.length&&mine.every(i=>landed(i,now))&&!on.length&&mine.some(i=>S.off.has(i));
      const hh=r.h,name=W.buckets.find(b=>b[0]===k)[1];
      if(k==="none")chip(ctx,o.m,r.y,o.ew,hh,name,K.soft,{dash:1,tint:0.04,glow:0,max:3});else el(ctx,o.m,r.y,o.ew,hh,name,lost?K.bad:STR,"capability",{hi:lost?1:0,max:3});
      // what a list could never show
      const tg=k==="outages"&&on.length>1?W.tags.overlap:k==="capacity"&&on.length?W.tags.shadow:k==="none"&&on.length?W.tags.nothing:null;
      if(tg)withA(ctx,1,()=>{const z=12.5,w=TW(ctx,tg,z)+14;ctx.save();ctx.fillStyle=rgbaS(K.gold,0.95);rr(ctx,o.m+o.ew-w-4,r.y+hh-12,w,19,9.5);ctx.fill();ctx.restore();T(ctx,tg,o.m+o.ew-w+3,r.y+hh+1.5,{w:800,size:z,color:"rgba(30,22,6,1)"});});});
    S.done.forEach(i=>{const it=its[i],B=o.slot[i],ok=S.first[i]===it.b,wr=o.row[S.first[i]],X=ok?null:[o.cx,wr.y+(wr.h-B.h)/2],[x,y,s,bad]=fly(now,S.t[i],ok,[o.lw/2,o.h],[B.x,B.y],X),off=S.off.has(i);
      scaled(ctx,x,y,B.w,B.h,s,()=>chip(ctx,x,y,B.w,B.h,it.t,bad?K.bad:APP,{a:off?0.4:1,strike:off,mark:!bad&&ok&&landed(i,now)&&!off?"ok":null}));});};
  return{lay,draw};};

// 8 · The skipper's test: a ladder from the request up to a decision, a capability and a goal; a tray for what goes back
PIC.skipper=(Lb,S)=>{const W=Lb.w,its=W.items,R=W.rungs,AC=rgb(Lb.c);
  const lay=(lw,ctx)=>{const m=12,rh=40,g=8,o={lw,m,rh,rung:[],tray:{},slot:{}};let y=12;for(let k=3;k>=0;k--){o.rung[k]={y};y+=rh+g;}
    const tw_=Math.floor((lw-m*2-10)/2),up=its.map((it,i)=>[it,i]).filter(([it])=>it.b!=="none"),back=its.map((it,i)=>[it,i]).filter(([it])=>it.b==="none");y+=4;
    const fa=flow(ctx,up.map(([it])=>it.s),tw_-12,13,5),fb=flow(ctx,back.map(([it])=>it.s),tw_-12,13,5),th=Math.max(fa.h,fb.h)+34;
    o.tray={y,h:th,w:tw_,a:m,b:m+tw_+10};up.forEach(([it,i],j)=>{const p=fa.pos[j];o.slot[i]={x:m+6+p.x,y:y+28+p.y,w:p.w,h:p.h};});back.forEach(([it,i],j)=>{const p=fb.pos[j];o.slot[i]={x:m+tw_+16+p.x,y:y+28+p.y,w:p.w,h:p.h};});
    o.h=y+th+10;return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,AC);const cur=S.done.length?S.done[S.done.length-1]:-1,live=S.i<its.length&&S.first[S.i]==null?S.i:cur,it=its[live]||null,t=it&&S.first[live]!=null?since(now,S.t[live]):-1;
    const lab=Math.ceil(Math.max(...R.map(r=>TW(ctx,r,12.5,800))))+22;
    R.forEach((nm,k)=>{const y=o.rung[k].y,lit=it&&(k===0||(it.up&&t>=0&&t>k*360+200));const col=lit?(k===0?AC:K.gold):K.soft;
      glass(ctx,o.m,y,o.lw-o.m*2,o.rh,10,col,{glow:lit?14:0,ea:lit?0.9:0.35,fill:"rgba(7,12,24,0.92)"});T(ctx,nm,o.m+12,y+o.rh/2+4.5,{w:800,size:12.5,color:rgbaS(col,1)});
      const val=!it?"":k===0?it.s:it.up&&lit?it.up[k-1]:"";if(val)withA(ctx,k===0?1:eo((t-k*360-200)/400),()=>lines(ctx,val,o.m+lab,y+o.rh/2-(fitL(ctx,val,o.lw-o.m*2-lab-12,13.5,2)[0].length-1)*8.1+4.9,o.lw-o.m*2-lab-12,{size:13.5,max:2}));
      if(k<3)ctx.save(),ctx.strokeStyle=rgbaS(K.soft,0.35),ctx.lineWidth=2,ctx.beginPath(),ctx.moveTo(o.m+26,y),ctx.lineTo(o.m+26,y-8),ctx.moveTo(o.lw-o.m-26,y),ctx.lineTo(o.lw-o.m-26,y-8),ctx.stroke(),ctx.restore();});
    // a request that reaches nothing goes back, with one question
    if(it&&!it.up&&t>=0)withA(ctx,eo((t-300)/500),()=>{const q=W.back,z=13,w=Math.min(o.lw-o.m*2-lab,TW(ctx,q,z)+22),y=o.rung[1].y+6;glass(ctx,o.lw-o.m-w-6,y,w,o.rh-12,14,K.gold,{fill:"rgba(30,22,6,0.92)",glow:10});line1(ctx,q,o.lw-o.m-w+5,y+(o.rh-12)/2+4.6,w-22,z,{color:rgbaS(K.gold,1)});});
    const tr=o.tray;[[tr.a,W.pic.reached,K.good],[tr.b,W.pic.back,K.gold]].forEach(([x,nm,c])=>{glass(ctx,x,tr.y,tr.w,tr.h,12,c,{glow:0,ea:0.45,fill:"rgba(7,12,24,0.7)"});T(ctx,nm,x+10,tr.y+19,{w:800,size:12.5,color:rgbaS(c,1)});});
    S.done.forEach(i=>{const t2=since(now,S.t[i]),it2=its[i],B=o.slot[i],wait=it2.up?1500:1100;if(t2<wait&&i===cur)return;const u=i===cur?eo((t2-wait)/600):1,A=[o.m+lab,o.rung[it2.up?3:0].y+8];
      const x=lp(A[0],B.x,u),y=lp(A[1],B.y,sp(u));chip(ctx,x,y,B.w,B.h,it2.s,it2.up?K.good:K.gold,{a:cl(u*3,0,1),mark:u>=1&&S.first[i]===it2.b?"ok":null});});};
  return{lay,draw};};

// 12 · Redraw it in ArchiMate 4: the element as version 3.2 drew it, and how version 4 draws it; the ones done so far, below
const KIND_COL=k=>({actor:K.lay[2],contract:K.lay[2],object:K.lay[2],role:K.lay[2],process:K.lay[2],interaction:K.lay[2],collaboration:K.lay[2],gap:K.mig,assessment:K.lay[0],
  requirement:K.lay[0],constraint:K.lay[0],component:K.lay[4],capability:K.lay[1]})[k]||K.soft;
const V4=it=>({kind:it.to,g2:it.to==="role"?"component":it.to==="process"&&it.from==="interaction"?"collaboration":null});
PIC.notation=(Lb,S)=>{const W=Lb.w,its=W.items;
  // the ones done so far go in rows, in order, each as tall as its longer name (up to two lines)
  const lay=(lw,ctx)=>{const m=12,gap=Math.round(cl(lw*0.1,34,64)),cw=Math.floor((lw-m*2-gap)/2),o={lw,m,gap,cw,y:34,eh:54,ly:34+54+26,row:[]};let y=o.ly;
    its.forEach((it,i)=>{const nl=Math.max(fitL(ctx,it.fromT,cw-34,13,2)[0].length,fitL(ctx,it.toT,cw-48,13,2)[0].length)>1?2:1,rh=nl>1?46:30;o.row[i]={y,h:rh,nl};y+=rh;});o.h=y+10;return o;};
  const two=(ctx,s,x,y,rh,w,col)=>{const n=fitL(ctx,s,w,13,2)[0].length;lines(ctx,s,x,y+rh/2-(n-1)*7.8+1.5,w,{size:13,max:2,color:col});};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));const live=Math.min(S.i,its.length-1),it=its[live],x2=o.m+o.cw+o.gap;
    T(ctx,W.pic.v3,o.m+o.cw/2,22,{w:800,size:13,align:"center",color:rgbaS(K.soft,1)});T(ctx,W.pic.v4,x2+o.cw/2,22,{w:800,size:13,align:"center",color:rgbaS(K.ink,0.95)});
    if(S.i<its.length){const t=S.first[live]!=null?since(now,S.t[live]):-1;el(ctx,o.m,o.y,o.cw,o.eh,it.fromT,KIND_COL(it.from),it.from,{size:13.5});
      arrow(ctx,o.m+o.cw+6,o.y+o.eh/2,x2-6,o.y+o.eh/2,K.soft,0.8,{dash:[4,4],lw:1.6});
      if(t<0){chip(ctx,x2,o.y,o.cw,o.eh,"?",K.soft,{dash:1,tint:0.04,glow:0,size:18});}
      else{const u=eo(t/600),v=V4(it);scaled(ctx,x2,o.y,o.cw,o.eh,lp(0.85,1,sp(t/600)),()=>el(ctx,x2,o.y,o.cw,o.eh,it.toT,KIND_COL(v.kind),v.kind,{a:u,size:13.5,g2:v.g2,c2:KIND_COL(v.g2),hi:0.5}));}}
    // at the end, where the element was: what version 4 calls its layers, and the word the series keeps
    else{const a=eo(since(now,S.fx.end)/700),P=W.pic;withA(ctx,a,()=>{chip(ctx,o.m,o.y+4,o.cw,40,P.layers,K.soft,{size:13.5,glow:0});arrow(ctx,o.m+o.cw+6,o.y+24,x2-6,o.y+24,K.soft,0.8,{dash:[4,4],lw:1.6});
      chip(ctx,x2,o.y+4,o.cw,40,P.domains,K.ink,{size:13.5,tint:0.08});line1(ctx,P.keeps,o.m,o.y+o.eh+20,o.lw-o.m*2,12.5,{align:"center",color:rgbaS(K.gold,1)});});}
    // the ones done so far
    S.done.forEach(i=>{if(i===live&&S.i<its.length)return;const it2=its[i],R=o.row[i],y=R.y,rh=R.h,v=V4(it2),c1=KIND_COL(it2.from),c2=KIND_COL(v.kind);
      glyph(ctx,it2.from,o.m+12,y+rh/2-3,7,c1);two(ctx,it2.fromT,o.m+28,y,rh,o.cw-34,rgbaS(K.soft,1));
      arrow(ctx,o.m+o.cw+4,y+rh/2-3,x2-6,y+rh/2-3,K.soft,0.6,{lw:1.4,head:6});glyph(ctx,v.kind,x2+12,y+rh/2-3,7,c2);two(ctx,it2.toT,x2+28,y,rh,o.cw-48,rgbaS(K.ink,0.96));
      if(S.first[i]===it2.b)mark(ctx,o.lw-o.m-8,y+rh/2-3,"ok");});};
  return{lay,draw,show:i=>{if(i>=its.length&&!S.fx.end)S.fx.end=performance.now();}};};

/* ---------- change: a capability map, through three changes ---------- */
function labChange(Lb){const W=Lb.w,B=W.boxes,box=h("div",{class:"lab ea-lab"}),say=say0(),S={applied:{},broke:{},named:{},merged:{},tries:{},queue:[],end:0};
  const STR=K.lay[1],optLab=k=>(W.rename.opts.find(o=>o[0]===k)||[,""])[1];
  // at the end, the boxes that are left close up, in order, so the map has no hole where a box merged into another
  const st=picOf(Lb,()=>1)?stage(lw=>{const cols=lw<460?2:3,m=12,g=10,bw=Math.floor((lw-m*2-g*(cols-1))/cols),bh=54,n=S.end?B.filter((b,i)=>!S.merged[i]).length:B.length,rows=Math.ceil(n/cols);
      return{lw,cols,m,g,bw,bh,top:40,h:40+rows*(bh+g)+8};},(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));
      const all=S.end>0,re=all?eo(since(now,S.end)/700):0,cell=k=>[o.m+(k%o.cols)*(o.bw+o.g),o.top+Math.floor(k/o.cols)*(o.bh+o.g)];let kept=0;
      T(ctx,all?W.pic.cap:W.pic.draft,o.m+2,24,{w:800,size:14,color:rgbaS(all?STR:K.soft,1)});
      B.forEach((b,i)=>{const[x0,y0]=cell(i),[x1,y1]=cell(S.merged[i]?i:kept++),x=lp(x0,x1,re),y=lp(y0,y1,re);
        if(S.merged[i]){const u=eo(since(now,S.merged[i])/700),j=B.findIndex((x_,k)=>k!==i&&S.named[k]===b.to&&!S.merged[k]),[xj,yj]=cell(j);
          if(u<1)withA(ctx,1-u,()=>el(ctx,lp(x,xj,u),lp(y,yj,u),o.bw,o.bh,optLab(b.to),STR,"capability"));return;}
        const nm=S.named[i],br=S.broke[i];
        if(nm||(all&&b.k==="what")){const t=since(now,nm?S.nameT[i]:S.end),u=eo(t/600);if(u<1)withA(ctx,1-u,()=>paper(ctx,x,y,o.bw,o.bh,b.t,K.notes[0],{size:13.5,rot:br?0.08:0}));
          scaled(ctx,x,y,o.bw,o.bh,lp(0.9,1,sp(t/600)),()=>el(ctx,x,y,o.bw,o.bh,nm?optLab(nm):lc(b.t),STR,"capability",{a:u,size:13.5,hi:all?0.5:0}));return;}
        if(br){const t=since(now,br),u=sp(t/700);paper(ctx,x,y+u*6,o.bw,o.bh,b.t,K.notes[0],{size:13.5,rot:u*(i%2?-0.07:0.08),a:0.85});
          // a tear across it, and what it really named
          ctx.save();ctx.strokeStyle="rgba(150,40,30,0.85)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+o.bw*0.55,y+u*6);ctx.lineTo(x+o.bw*0.48,y+o.bh*0.45+u*6);ctx.lineTo(x+o.bw*0.58,y+o.bh+u*6);ctx.stroke();ctx.restore();
          withA(ctx,eo((t-300)/500),()=>{const s=W.kinds[b.k],tw_=o.bw-16,one=[12.5,12,11.5].find(k=>TW(ctx,s,k)<=tw_),[ls,z]=one?[[s],one]:fitL(ctx,s,tw_,12.5,2),lh=z*1.15,
            ph=19+(ls.length-1)*lh,w=Math.min(Math.max(...ls.map(l=>TW(ctx,l,z)))+16,o.bw-4);ctx.save();ctx.fillStyle=rgbaS(K.bad,0.95);rr(ctx,x+o.bw/2-w/2,y+o.bh+5-ph+u*6,w,ph,9.5);ctx.fill();ctx.restore();
            ls.forEach((l,j)=>T(ctx,l,x+o.bw/2,y+o.bh+0.5-(ls.length-1-j)*lh+u*6,{w:700,size:z,align:"center",color:"rgba(40,8,6,1)"}));});return;}
        paper(ctx,x,y,o.bw,o.bh,b.t,K.notes[0],{size:13.5});});}
    ,(W.pic&&W.pic.alt)||Lb.name):null;
  S.nameT={};
  const ch=h("div",{class:"ea-changes",role:"group","aria-label":W.prompt}),q=h("div",{class:"ea-rename"});
  W.changes.forEach(c=>ch.append(h("button",{type:"button",class:"ea-change","data-k":c.k,onclick:e=>apply(c,e.currentTarget)},h("b",null,c.t),h("span",null,c.d))));
  function apply(c,el_){if(S.applied[c.k])return;S.applied[c.k]=1;el_.disabled=true;el_.classList.add("done");const now=performance.now(),hit=B.map((b,i)=>i).filter(i=>B[i].k===c.k&&!S.named[i]);
    hit.forEach(i=>{S.broke[i]=now;S.queue.push(i);});sayIt(say,hit.map(i=>fill(W.broke,{c:c.t,t:B[i].t,kind:W.kinds[B[i].k]})).join(" ")+" "+W.stood);if(st)st.kick(1200);ch.querySelectorAll("button").forEach(b=>b.disabled=true);ask(true);}
  function ask(focus){q.replaceChildren();if(!S.queue.length){ch.querySelectorAll("button").forEach(b=>{b.disabled=!!S.applied[b.dataset.k];});if(W.changes.every(c=>S.applied[c.k]))end();else if(focus)focusIn(ch.querySelector("button:not([disabled])"));return;}
    const i=S.queue[0],b=B[i],g=h("div",{class:"ea-opts",role:"group","aria-labelledby":"ea-rq"}),fb=h("div");
    W.rename.opts.forEach(([k,t])=>g.append(h("button",{type:"button","data-k":k,onclick:e=>{const ok=k===b.to,el_=e.currentTarget;
      if(!ok){el_.disabled=true;el_.classList.add("no");fb.replaceChildren(why(false,fill(W.rename.wrong,{to:t,t:b.t})));sayIt(say,fill(W.rename.wrong,{to:t,t:b.t}));return;}
      g.querySelectorAll("button").forEach(x=>x.disabled=true);el_.classList.add("ok");const other=B.findIndex((x,j)=>j!==i&&S.named[j]===b.to);
      S.named[i]=b.to;S.nameT[i]=performance.now();if(other>=0){S.merged[i]=performance.now();}if(st)st.kick(1000);
      fb.replaceChildren(why(true,other>=0?W.rename.merged:fill(W.rename.right,{to:t})));sayIt(say,other>=0?W.rename.merged:fill(W.rename.right,{to:t}));S.queue.shift();const nx=btn(U.go+" →",()=>ask(true),"go");fb.append(h("div",{class:"lab-controls"},nx));focusIn(nx);}},t)));
    q.append(h("p",{class:"ea-q",id:"ea-rq"},fill(W.rename.q,{t:b.t})),g,fb);if(focus)focusIn(g.querySelector("button"));}
  function end(){S.end=performance.now();if(st){st.relayout();st.kick(900);}endSay(say,W.end);q.replaceChildren(h("p",{class:"ea-end"},W.end),h("div",{class:"lab-controls"},btn(U.again,()=>{for(const k of ["applied","broke","named","merged","nameT"])S[k]={};S.queue=[];S.end=0;
    ch.querySelectorAll("button").forEach(b=>{b.disabled=false;b.classList.remove("done");});q.replaceChildren();sayIt(say,"");if(st)st.relayout();focusIn(ch.querySelector("button"));},"sm")));}
  box.append(...(st?[st.el]:[]),info(W.prompt),ch,q,say);return box;}

/* ---------- night: who goes first ---------- */
function labNight(Lb){const W=Lb.w,F=W.faults,box=h("div",{class:"lab ea-lab"}),say=say0(),S={a:[null,null],run:0,good:0,rule:0,facts:{},checked:0};
  const fk=k=>F.find(f=>f.k===k);
  function judge(a){const s=new Set(a),out=[];if(a[0]===a[1])out.push(W.out.same);if(!s.has("hill"))out.push(W.out.wire);if(!s.has("river"))out.push(W.out.life);const good=s.has("hill")&&s.has("river");if(good)out.push(W.out.good);return{good,text:out.join(" ")};}
  const st=picOf(Lb,()=>1)?stage(lw=>({lw,h:Math.round(cl(lw*0.68,300,380))}),(ctx,o,now)=>{const w=o.lw,hh=o.h,rule=S.rule?eo(since(now,S.rule)/800):0;
      if(rule<1)withA(ctx,1-rule,()=>nightMap(ctx,w,hh,now));if(rule>0)withA(ctx,rule,()=>ruleMap(ctx,w,hh,now));},(W.pic&&W.pic.alt)||Lb.name):null;
  // the town at night: three faults, the depot, and the crews on their way
  const POS={hill:[0.2,0.2],river:[0.22,0.62],east:[0.72,0.3]},DEP=[0.62,0.86];
  function nightMap(ctx,w,hh,now){const g=ctx.createLinearGradient(0,0,0,hh);g.addColorStop(0,"#0a1428");g.addColorStop(1,"#050a16");ctx.fillStyle=g;ctx.fillRect(0,0,w,hh);
    ctx.save();ctx.strokeStyle="rgba(120,160,220,0.16)";ctx.lineWidth=9;ctx.lineCap="round";Object.values(POS).forEach(p=>{ctx.beginPath();ctx.moveTo(DEP[0]*w,DEP[1]*hh);ctx.quadraticCurveTo(lp(DEP[0],p[0],0.5)*w,DEP[1]*hh,p[0]*w,p[1]*hh+16);ctx.stroke();});ctx.restore();
    // the river
    ctx.save();ctx.strokeStyle="rgba(90,150,220,0.35)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,hh*0.8);ctx.bezierCurveTo(w*0.2,hh*0.72,w*0.3,hh*0.95,w*0.48,hh*1.02);ctx.stroke();ctx.restore();
    const t=S.run?since(now,S.run):-1,at=k=>S.run&&S.a.includes(k),arrive=k=>{const c=S.a.indexOf(k);return c<0?-1:1500+c*140;};
    F.forEach((f,fi)=>{const[px,py]=POS[f.k],cx=px*w,cy=py*hh,n=f.k==="east"?16:f.k==="hill"?6:4,lit=t>=0&&at(f.k)?cl((t-arrive(f.k)-200)/600,0,1):0,late=f.k==="east"&&S.good&&t>=0?cl((t-3400)/900,0,1):0,L=Math.max(lit,late);
      for(let j=0;j<n;j++){const hx=cx-34+(j%(f.k==="east"?6:3))*14+(f.k==="east"?-6:6),hy=cy+Math.floor(j/(f.k==="east"?6:3))*13;ctx.fillStyle=L>0?rgbaS(mixC([30,38,60],[255,214,120],L),1):"rgba(30,38,60,1)";ctx.fillRect(hx,hy,10,9);
        ctx.beginPath();ctx.moveTo(hx-1,hy);ctx.lineTo(hx+5,hy-5);ctx.lineTo(hx+11,hy);ctx.fill();}
      // what's wrong there: a wire down sparks; someone on life support
      const ix=cx+(f.k==="east"?56:30),iy=cy-4;if(f.wire){const on=t>=0&&!at("hill")?0.5+0.5*Math.sin(now/90):0.6;ctx.save();ctx.strokeStyle=rgbaS([255,150,60],0.6+0.4*on);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(ix-8,iy-9);ctx.lineTo(ix+1,iy-1);ctx.lineTo(ix-3,iy+1);ctx.lineTo(ix+8,iy+10);ctx.stroke();ctx.restore();}
      if(f.life){const beat=t>=0&&!at("river")?1+0.18*Math.max(0,Math.sin(now/160)):1;ctx.save();ctx.translate(ix,iy);ctx.scale(beat,beat);ctx.fillStyle=rgbaS([255,110,120],0.95);ctx.beginPath();ctx.moveTo(0,7);ctx.bezierCurveTo(-11,-1,-7,-10,0,-4);ctx.bezierCurveTo(7,-10,11,-1,0,7);ctx.fill();ctx.restore();}
      const tx=f.k==="east"?cx-40:cx-34,ty=cy-14;T(ctx,f.t,tx,ty-16,{w:800,size:14,color:rgbaS(K.ink,0.96)});line1(ctx,f.d,tx,ty,f.k==="hill"?POS.east[0]*w-40-tx-12:w-tx-10,12.5,{color:rgbaS(K.soft,1)});});
    // the depot, and the crews leaving it
    const dx=DEP[0]*w,dy=DEP[1]*hh;T(ctx,W.pic.depot,dx,dy+26,{w:700,size:12.5,align:"center",color:rgbaS(K.soft,1)});
    const cws=W.crews.map(c=>TW(ctx,c,12.5,800)+16),c0=dx-(cws.reduce((a,b)=>a+b,0)+6*(cws.length-1))/2;
    W.crews.forEach((c,ci)=>{const k=S.a[ci],p=k?POS[k]:null;let x=c0+cws.slice(0,ci).reduce((a,b)=>a+b+6,0)+cws[ci]/2,y=dy;if(t>=0&&p){const u=eo(cl((t-ci*140)/1400,0,1));x=lp(x,p[0]*w+(ci?16:-16),u);y=lp(y,p[1]*hh+30,u);
        if(S.good&&k==="river"&&t>3200){const v=eo(cl((t-3200)/1200,0,1));x=lp(x,POS.east[0]*w,v);y=lp(y,POS.east[1]*hh+30,v);}}
      const cw_=cws[ci];glass(ctx,x-cw_/2,y-11,cw_,22,11,K.gold,{fill:"rgba(30,22,6,0.95)",glow:10});T(ctx,c,x,y+4.5,{w:800,size:12.5,align:"center",color:rgbaS(K.gold,1)});});}
  // the rule, once the night has gone the right way, and where each of its facts comes from
  function ruleMap(ctx,w,hh,now){ground(ctx,w,hh,rgb(Lb.c));const R=W.rule,m=10,sx=m,sw=Math.round(w*0.27),cx=sx+sw+14,dw=Math.round(w*0.33),rx=cx+dw+30,rw=w-rx-m;
    const oy=Math.max(0,Math.round((hh-276)/2));T(ctx,R.t,m+2,22+oy,{w:800,size:14,color:rgbaS(K.lay[2],1)});const ys=[48+oy,128+oy,214+oy],dh=50,boxD=(x,y,ww,t,col,diam)=>{ctx.save();ctx.fillStyle="rgba(7,12,24,0.95)";ctx.strokeStyle=rgbaS(col,0.95);ctx.lineWidth=1.8;
      if(diam){ctx.beginPath();ctx.moveTo(x+ww/2,y);ctx.lineTo(x+ww,y+dh/2);ctx.lineTo(x+ww/2,y+dh);ctx.lineTo(x,y+dh/2);ctx.closePath();}else rr(ctx,x,y+4,ww,dh-8,10);ctx.fill();ctx.stroke();ctx.restore();
      const[ls,z]=fitL(ctx,t,diam?ww*0.62:ww-12,13,2);ls.forEach((l,i)=>T(ctx,l,x+ww/2,y+dh/2+z*0.36-(ls.length-1)*z*0.6+i*z*1.2,{w:700,size:z,align:"center"}));};
    boxD(cx,ys[0],dw,R.wire,K.lay[2],1);boxD(cx,ys[1],dw,R.life,K.lay[2],1);boxD(cx,ys[2],dw,R.rank,K.lay[2],0);
    boxD(rx,ys[0],rw,R.first,K.good,0);boxD(rx,ys[1],rw,R.first,K.good,0);boxD(rx,ys[2],rw,R.next,K.good,0);
    [0,1,2].forEach(k=>{arrow(ctx,cx+dw+1,ys[k]+dh/2,rx-2,ys[k]+dh/2,K.good,0.9,{lw:1.6,head:6});if(k<2){arrow(ctx,cx+dw/2,ys[k]+dh,cx+dw/2,ys[k+1]+2,K.soft,0.8,{lw:1.6,head:6});
      T(ctx,R.no,cx+dw/2+6,ys[k]+dh+15,{w:700,size:12.5,color:rgbaS(K.soft,1)});}if(k<2)T(ctx,R.yes,cx+dw+15,ys[k]+dh/2-6,{w:700,size:12.5,align:"center",color:rgbaS(K.good,1)});});
    // the facts it reads, each from its source, on a chip as tall as its name (up to three lines)
    W.facts.items.forEach((f,k)=>{const got=S.facts[k]!=null&&S.checked;if(!got)return;const a=eo(since(now,S.checked)/600-k*0.25),src=(W.facts.opts.find(o=>o[0]===f.b)||[,""])[1]+(f.b==="model"?" ?":"");
      withA(ctx,a,()=>{const y=ys[k]+dh/2,hh2=Math.round(fitL(ctx,src,sw-14,12.5,3)[0].length*15+12);chip(ctx,sx,y-hh2/2,sw,hh2,src,f.b==="model"?K.gold:K.lay[3],{size:12.5,max:3});arrow(ctx,sx+sw+1,y,cx-2,y,K.lay[3],0.85,{lw:1.4,head:5,dash:[3,3]});});});
}
  // the controls: send each crew, run the night; then the facts
  const rows=h("div",{class:"ea-crews"}),run=btn(W.run,()=>go(false),"go"),habit=btn(W.habit,()=>{S.a=["east","east"];paintSeg();go(true);},"sm"),ctl=h("div",{class:"lab-controls"},run,habit),more=h("div",{class:"ea-area"});
  const segs=W.crews.map((c,ci)=>{const s=h("div",{class:"seg",role:"group","aria-label":fill(W.send,{c})});F.forEach(f=>s.append(h("button",{type:"button","aria-pressed":"false","data-k":f.k,onclick:()=>{S.a[ci]=f.k;paintSeg();upd();}},f.t)));
    rows.append(h("div",{class:"ea-crew"},h("span",{class:"lbl"},fill(W.send,{c})),s));return s;});
  function paintSeg(){segs.forEach((s,ci)=>s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===S.a[ci]))));}
  function upd(){run.disabled=!(S.a[0]&&S.a[1]);}
  // a good night settles it: the crews and the run stay as they went, and the rule comes up
  function go(isHabit){if(!(S.a[0]&&S.a[1]))return;S.run=performance.now();const r=judge(S.a);S.good=r.good;sayIt(say,(isHabit?W.out.habit+" ":"")+r.text);if(st)st.kick(r.good?5200:3600);
    if(r.good){[run,habit,...rows.querySelectorAll("button")].forEach(b=>b.disabled=true);if(!S.rule)later(()=>{S.rule=performance.now();if(st)st.kick(1200);facts();},5000);}}
  function facts(){const F2=W.facts,box2=h("div",{class:"ea-facts"}),pick={},chk=btn(U.check,()=>{S.checked=performance.now();if(st)st.kick(1800);
      box2.querySelectorAll(".ea-fact").forEach((r,k)=>{const f=F2.items[k],ok=pick[k]===f.b;r.classList.add(ok?"ok":"no");r.querySelectorAll("button").forEach(b=>{b.disabled=true;if(b.dataset.k===f.b)b.classList.add("ok");else if(b.dataset.k===pick[k])b.classList.add("no");});
        r.append(why(ok,(ok?"":fill(U.belongs,{b:(F2.opts.find(o=>o[0]===f.b)||[,""])[1]})+" ")+f.why));});chk.remove();endSay(say,W.end);
      const again=btn(U.again,()=>{const nb=labNight(Lb);box.replaceWith(nb);focusIn(nb.querySelector("button"));},"sm");more.append(h("p",{class:"ea-end"},W.end),h("div",{class:"lab-controls"},again));focusIn(again);},"go");chk.disabled=true;
    F2.items.forEach((f,k)=>{const s=h("div",{class:"seg",role:"group","aria-label":f.t});F2.opts.forEach(([key,t])=>s.append(h("button",{type:"button","aria-pressed":"false","data-k":key,onclick:()=>{pick[k]=key;S.facts[k]=key;
      s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===key)));chk.disabled=Object.keys(pick).length<F2.items.length;}},t)));box2.append(h("div",{class:"ea-fact"},h("p",{class:"ea-q"},f.t),s));});
    more.replaceChildren(info(F2.prompt),box2,h("div",{class:"lab-controls"},chk));sayIt(say,F2.prompt);focusIn(box2.querySelector("button"));}
  upd();box.append(...(st?[st.el]:[]),info(W.prompt),rows,ctl,more,say);return box;}

/* ---------- gate: what may cross the wall ---------- */
function labGate(Lb){const W=Lb.w,F=W.facts,box=h("div",{class:"lab ea-lab"}),say=say0(),S={x:new Set(),open:0};
  const st=picOf(Lb,()=>1)?stage((lw,ctx)=>{const m=10,wall=16,cw=Math.floor((lw-m*2-wall-24)/2),o={lw,m,wall,cw,pos:{},top:44};const ys={net:o.top,ret:o.top};
      F.forEach((f,i)=>{const hh=fitL(ctx,f.sl,cw-14,13,2)[0].length>1?H2(13):H1(13);o.pos[i]={x:f.s==="net"?m:lw-m-cw,y:ys[f.s],w:cw,h:hh};ys[f.s]+=hh+6;});
      // under the gate, the agreed list: two to a row, each row as tall as its longer name
      const fy=Math.max(ys.net,ys.ret),cw2=Math.floor((lw-m*2-24-8)/2),agreed=F.map((f,i)=>i).filter(i=>F[i].x);o.gy1=fy+2;o.list={y:fy+38,slot:{}};let y=o.list.y+30;
      for(let k=0;k<agreed.length;k+=2){const two=agreed.slice(k,k+2),rh=Math.max(...two.map(i=>fitL(ctx,F[i].sl,cw2-14,12.5,2)[0].length>1?H2(12.5):H1(12.5)));two.forEach((i,j)=>{o.list.slot[i]={x:m+12+j*(cw2+8),y,w:cw2,h:rh};});y+=rh+6;}
      o.list.h=y-o.list.y+6;o.h=o.list.y+o.list.h+10;return o;},(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));
      const gx=o.lw/2-o.wall/2,t=S.open?since(now,S.open):-1;
      T(ctx,W.sides.net,o.m+o.cw/2,26,{w:800,size:14,align:"center",color:rgbaS(K.dom[0],1)});T(ctx,W.sides.ret,o.lw-o.m-o.cw/2,26,{w:800,size:14,align:"center",color:rgbaS(K.dom[1],1)});
      // the wall, with a gate in it
      const gy0=o.top+20,gy1=o.gy1;ctx.save();ctx.fillStyle="rgba(150,160,180,0.22)";ctx.fillRect(gx,8,o.wall,gy0-8);ctx.fillRect(gx,gy1,o.wall,o.list.y-gy1+o.list.h);ctx.strokeStyle="rgba(200,210,230,0.45)";ctx.lineWidth=1;
      for(let y=10;y<o.h;y+=12){if(y>gy0&&y<gy1)continue;ctx.beginPath();ctx.moveTo(gx,y);ctx.lineTo(gx+o.wall,y);ctx.stroke();}ctx.restore();
      const op=t>=0?eo(t/700):0;ctx.save();ctx.strokeStyle=rgbaS(K.gold,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(gx,gy0);ctx.lineTo(gx+o.wall*(1-op)*0.5,lp(gy0,gy1,0.5));ctx.moveTo(gx+o.wall,gy0);ctx.lineTo(gx+o.wall-o.wall*(1-op)*0.5,lp(gy0,gy1,0.5));ctx.stroke();ctx.restore();
      pill(ctx,o.lw/2,gy1+5,W.pic.gate,K.gold,{size:12.5,align:"center"});
      // the agreed list, under the gate: what crosses, and how
      const L2=o.list;glass(ctx,o.m,L2.y,o.lw-o.m*2,L2.h,12,K.gold,{glow:t>=0?12:0,ea:t>=0?0.85:0.35,fill:"rgba(20,16,8,0.9)"});
      T(ctx,W.list,o.m+12,L2.y+20,{w:800,size:13,color:rgbaS(K.gold,1)});const agreed=F.map((f,i)=>i).filter(i=>F[i].x);
      F.forEach((f,i)=>{const p=o.pos[i],marked=S.x.has(i),k=agreed.indexOf(i);let x=p.x+(marked&&t<0?(f.s==="net"?10:-10):0),y=p.y,a=1;
        if(t>=0&&f.x){const u=eo(cl((t-400-k*220)/800,0,1)),B=L2.slot[i];x=lp(x,B.x,u);y=lp(y,B.y,u);
          if(u>0){const w=lp(p.w,B.w,u),hh=lp(p.h,B.h,u);chip(ctx,x,y,w,hh,f.sl,K.gold,{tint:0.18,size:lp(13,12.5,u),mark:u>=1&&marked?"ok":null});return;}}
        const wrong=t>=0&&marked&&!f.x,missed=t>=0&&!marked&&f.x;if(wrong){x+=Math.sin(cl((t-200)/500,0,1)*Math.PI*4)*4*(1-cl((t-200)/500,0,1));}
        chip(ctx,x,y,p.w,p.h,f.sl,wrong?K.bad:missed?K.gold:K.dom[f.s==="net"?0:1],{a:a,dash:missed,lw:marked&&t<0?2.6:null,ea:marked?1:0.7,mark:wrong?"no":null,tint:marked&&t<0?0.3:0.12});});},
    (W.pic&&W.pic.alt)||Lb.name):null;
  const lists={net:h("div",{class:"ea-side"}),ret:h("div",{class:"ea-side"})},open=btn(W.open,go,"go"),again=btn(U.again,reset,"sm"),fin=h("div");again.hidden=true;
  Object.entries(W.sides).forEach(([k,nm])=>lists[k].append(h("p",{class:"ea-sidet"},nm)));
  F.forEach((f,i)=>lists[f.s].append(h("button",{type:"button",class:"ea-fact-t","aria-pressed":"false","data-i":i,onclick:e=>{if(S.open)return;const b=e.currentTarget;S.x.has(i)?S.x.delete(i):S.x.add(i);b.setAttribute("aria-pressed",String(S.x.has(i)));if(st)st.kick(300);}},h("span",{class:"ea-tick","aria-hidden":"true"}),h("span",null,f.t))));
  function go(){S.open=performance.now();if(st)st.kick(3200);let ok=0;F.forEach((f,i)=>{const m=S.x.has(i),good=m===!!f.x;if(good)ok++;const b=box.querySelector('[data-i="'+i+'"]');b.disabled=true;b.classList.add(good?"ok":"no");
      b.parentNode.insertBefore(h("p",{class:"ea-why sm"},h("b",{class:good?"ok":"no"},good?U.right:U.notQuite)," ",f.why),b.nextSibling);});
    const t=fill(W.sayN,{n:S.x.size,ok})+" "+W.end;fin.replaceChildren(h("p",{class:"ea-end"},t));endSay(say,t);open.hidden=true;again.hidden=false;focusIn(again);}
  function reset(){S.x.clear();S.open=0;box.querySelectorAll(".ea-fact-t").forEach(b=>{b.disabled=false;b.classList.remove("ok","no");b.setAttribute("aria-pressed","false");});box.querySelectorAll(".ea-why.sm").forEach(x=>x.remove());fin.replaceChildren();open.hidden=false;again.hidden=true;sayIt(say,"");if(st)st.paint();focusIn(box.querySelector(".ea-fact-t"));}
  box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"ea-sides"},lists.net,lists.ret),fin,h("div",{class:"lab-controls"},open,again),say);return box;}

/* ---------- rule: a rule with a home ---------- */
function labRule(Lb){const W=Lb.w,box=h("div",{class:"lab ea-lab"}),say=say0(),S={split:0,slots:{net:{},ret:{}},fail:0,gen:0,plant:0};
  const sideCol=s=>K.dom[s==="net"?0:1],cards=W.cards,LB={};
  const st=picOf(Lb,()=>1)?stage((lw,ctx)=>{const m=10,wall=14,cw=Math.floor((lw-m*2-wall-20)/2),o={lw,m,wall,cw,top:40,card:{}};
      // each card as tall as its rule and its answers, whole (up to eight lines, and four for each answer)
      cards.forEach(c=>{let hh=10+Math.min(8,LN(ctx,c.must,cw-20,13).length)*15.6+8;c.slots.forEach(sl=>{hh+=Math.min(4,LN(ctx,sl.label+": "+sl.opts.find(x=>x[0]==="ok")[1],cw-20,12.5).length)*15+3;});o.card[c.side]={y:o.top+44,h:Math.round(hh+10)};});
      const ch=Math.max(o.card.net.h,o.card.ret.h),gh=W.gen.items.map(g=>Math.max(24,Math.round(fitL(ctx,g,cw-38,12.5,3)[0].length*14+9))),gy=[];let yy=8;
      gh.forEach(v=>{gy.push(yy);yy+=v+6;});o.gen={y:o.top+44+ch+16,h:yy+24,ys:gy,hs:gh};o.h=o.gen.y+o.gen.h+8;return o;},(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));
      const gx=o.lw/2-o.wall/2,sp1=S.split?eo(since(now,S.split)/900):0;
      T(ctx,W.pic.net,o.m+o.cw/2,24,{w:800,size:14,align:"center",color:rgbaS(K.dom[0],1)});T(ctx,W.pic.ret,o.lw-o.m-o.cw/2,24,{w:800,size:14,align:"center",color:rgbaS(K.dom[1],1)});
      ctx.save();ctx.fillStyle="rgba(150,160,180,0.2)";ctx.fillRect(gx,8,o.wall,o.h-16);ctx.strokeStyle="rgba(200,210,230,0.4)";ctx.lineWidth=1;for(let y=10;y<o.h-8;y+=12){ctx.beginPath();ctx.moveTo(gx,y);ctx.lineTo(gx+o.wall,y);ctx.stroke();}ctx.restore();
      // the rule on the wall, with no home; then two rules, one on each side, joined by what crosses
      if(sp1<1)withA(ctx,1-sp1,()=>{const w=Math.min(o.lw-o.m*2-20,300),x=o.lw/2-w/2,y=o.top+30,ls=LN(ctx,W.wall,w-24,13.5).slice(0,4),hh=ls.length*16.5+44;
        glass(ctx,x,y,w,hh,12,K.bad,{fill:"rgba(30,10,10,0.95)",glow:14});ls.forEach((l,i)=>T(ctx,l,x+12,y+24+i*16.5,{w:700,size:13.5}));pill(ctx,x+12,y+hh-26,W.pic.homeless,K.bad,{size:12.5});});
      if(sp1>0)cards.forEach(c=>{const r=o.card[c.side],x=c.side==="net"?o.m:o.lw-o.m-o.cw,dx=(c.side==="net"?1:-1)*(1-sp1)*(o.cw/2),col=sideCol(c.side);withA(ctx,sp1,()=>{
        glass(ctx,x+dx,r.y,o.cw,r.h,12,col,{fill:"rgba(7,12,24,0.95)",glow:12});let y=r.y+20;const ls=LN(ctx,c.must,o.cw-20,13).slice(0,8);ls.forEach((l,i)=>T(ctx,l,x+dx+10,y+i*15.6,{w:700,size:13}));y+=ls.length*15.6+6;
        c.slots.forEach((sl,k)=>{const got=S.slots[c.side][k];if(!got)return;const a=eo(since(now,got)/500),txt=sl.label+": "+sl.opts.find(x=>x[0]==="ok")[1],l2=LN(ctx,txt,o.cw-20,12.5).slice(0,4);
          withA(ctx,a,()=>l2.forEach((l,i)=>T(ctx,l,x+dx+10,y+i*15,{w:700,size:12.5,color:rgbaS(mixC(col,K.ink,0.4),1)})));
          // an answer that names an element gets its glyph, after its last line, where the line leaves room
          if(sl.glyph){const gx=x+dx+10+TW(ctx,l2[l2.length-1],12.5,700)+16;if(gx+12<=x+dx+o.cw-8)withA(ctx,a,()=>glyph(ctx,sl.glyph,gx,y+(l2.length-1)*15-4.5,8,K.lay[0]));}
          y+=l2.length*15+3;});});});
      if(sp1>0.9){const y=o.card.net.y+18,a=eo(since(now,S.split)/900-0.6);arrow(ctx,o.m+o.cw+2,y,o.lw-o.m-o.cw-4,y,K.gold,a,{lw:2.2});withA(ctx,a,()=>pill(ctx,o.lw/2,o.top+12,W.pic.crosses,K.gold,{size:12.5,align:"center"}));}
      // the checks drawn from each rule, one way; a planted case must fail
      if(S.gen){const a=eo(since(now,S.gen)/700);cards.forEach(c=>{const r=o.card[c.side],x=c.side==="net"?o.m:o.lw-o.m-o.cw,col=sideCol(c.side);W.gen.items.forEach((g,k)=>{const y=o.gen.y+o.gen.ys[k],gh=o.gen.hs[k],fail=S.plant&&c.side==="ret"&&k===0&&since(now,S.plant)>500;
          withA(ctx,cl(a*3-k*0.6,0,1),()=>{arrow(ctx,x+14,r.y+r.h+2,x+14,y+gh/2-1,col,0.5,{lw:1.2,head:5});chip(ctx,x+24,y,o.cw-24,gh,g,fail?K.bad:col,{size:12.5,max:3,tint:fail?0.35:0.1,mark:fail?"no":null});});});});
        if(S.plant){const t=since(now,S.plant),u=eo(cl((t-900)/700,0,1)),x=lp(o.lw-o.m-o.cw/2,o.lw-o.m-40,u),y=lp(o.gen.y+20,o.gen.y+o.gen.h-14,u);if(t>900)pill(ctx,x,y-10,W.pic.queue,K.bad,{size:12.5,align:"center"});}}
      if(S.fail&&!S.gen)cards.forEach(c=>{const r=o.card[c.side],x=c.side==="net"?o.m:o.lw-o.m-o.cw;withA(ctx,eo(since(now,S.fail)/500),()=>pill(ctx,x+o.cw/2,r.y+r.h+10,W.pic.queue,K.gold,{size:12.5,align:"center"}));});},
    (W.pic&&W.pic.alt)||Lb.name):null;
  const area=h("div",{class:"ea-area"});
  // one question at a time: its options, a wrong pick says why and leaves the rest open, the right one moves on
  function ask(qt,opts,b,no,whyOk,seed,done){const id="ea-q"+seed,g=h("div",{class:"ea-opts",role:"group","aria-labelledby":id}),fb=h("div"),wrap=h("div",{class:"ea-step"},h("p",{class:"ea-q",id},qt),g,fb);
    order(opts,seed).forEach(j=>{const[k,t]=opts[j];g.append(h("button",{type:"button","data-k":k,onclick:e=>{const el_=e.currentTarget;if(k!==b){el_.disabled=true;el_.classList.add("no");fb.replaceChildren(why(false,(no&&(typeof no==="string"?no:no[k]))||""));return;}
      g.querySelectorAll("button").forEach(x=>x.disabled=true);el_.classList.add("ok");fb.replaceChildren(why(true,whyOk));done();}},t));});area.append(wrap);focusIn(g.querySelector("button"));return wrap;}
  function step0(){area.replaceChildren();ask(W.split.t,W.split.opts,W.split.b,W.split.no,W.split.why,11,()=>{S.split=performance.now();if(st)st.kick(1800);sayIt(say,W.split.why);later(()=>card(0,0),500);});}
  function card(ci,k){const c=cards[ci];if(k===0)area.append(h("p",{class:"ea-cardt "+c.side},h("b",null,(c.side==="net"?W.pic.net:W.pic.ret)+": "),c.must));const sl=c.slots[k];
    ask(sl.label,sl.opts,"ok",sl.no,sl.why,20+ci*5+k,()=>{S.slots[c.side][k]=performance.now();if(st){st.relayout();st.kick(700);}sayIt(say,sl.label+": "+sl.opts.find(x=>x[0]==="ok")[1]+". "+sl.why);
      later(()=>{if(k+1<c.slots.length)card(ci,k+1);else if(ci+1<cards.length)card(ci+1,0);else fail();},350);});}
  function fail(){const F2=W.fail;ask(F2.t,F2.opts,F2.b,F2.no,F2.why,40,()=>{S.fail=performance.now();if(st)st.kick(700);sayIt(say,F2.why);later(gen,350);});}
  function gen(){const G=W.gen;S.gen=performance.now();if(st)st.kick(1400);const pl=btn(G.plant,()=>{S.plant=performance.now();if(st)st.kick(1900);pl.disabled=true;endSay(say,G.failed+" "+W.end);const again=btn(U.again,()=>{S.split=0;S.slots={net:{},ret:{}};S.fail=0;S.gen=0;S.plant=0;sayIt(say,"");if(st)st.relayout();step0();},"sm");
      area.append(h("p",{class:"ea-end"},G.failed+" "+W.end),h("div",{class:"lab-controls"},again));focusIn(again);},"go");
    area.append(h("div",{class:"ea-step"},h("p",{class:"ea-q"},G.t),h("ul",{class:"ea-gen"},...G.items.map(x=>h("li",null,x))),h("p",{class:"ea-note"},G.note),h("div",{class:"lab-controls"},pl)));sayIt(say,G.t+" "+G.items.join(", ")+".");focusIn(pl);}
  box.append(...(st?[st.el]:[]),info(W.prompt),area,say);step0();return box;}

/* ---------- walk: a change, walked down the layers ---------- */
function labWalk(Lb){const W=Lb.w,Ls=W.layers,box=h("div",{class:"lab ea-lab"}),say=say0(),S={k:0,pick:{},checked:{},t:{},drop:performance.now()};
  const idx={motivation:0,strategy:1,business:2,information:3,application:4,technology:5};
  const st=picOf(Lb,()=>1)?stage((lw,ctx)=>{const x0=10,labW=Math.ceil(Math.max(...Ls.map(l=>TW(ctx,W.names[l.k],13.5,800))))+24,cw=lw-x0*2-labW-12,dl=bal(ctx,W.drop,lw-52,13.5),o={lw,x0,labW,row:[],slot:{},dl,dh:34+(dl[0].length-1)*17,dw:dl[0].length>1?lw-24:Math.min(lw-24,TW(ctx,W.drop,13.5)+28)};let y=56+o.dh-34;
      Ls.forEach((l,li)=>{const mine=l.items.map((it,j)=>[it,j]).filter(([it])=>it.x||it.trap),f=flow(ctx,mine.map(([it])=>it.s),cw,12.5,5),sh=Math.max(36,f.h+12);o.row[li]={y,h:sh};
        mine.forEach(([it,j],q)=>{const p=f.pos[q];o.slot[li+"/"+j]={x:x0+labW+6+p.x,y:y+(sh-f.h)/2+p.y,w:p.w,h:p.h};});y+=sh+6;});o.h=y+4;return o;},(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));
      // the change, at the top of the map
      const dz=eo(since(now,S.drop)/700),dw=o.dw,ex=o.dh-34,[dls,dzz]=o.dl;withA(ctx,dz,()=>{glass(ctx,o.lw/2-dw/2,10-(1-dz)*14,dw,o.dh,17,K.gold,{fill:"rgba(30,22,6,0.95)",glow:14});
        dls.forEach((l,i)=>T(ctx,l,o.lw/2,32+i*17-(1-dz)*14,{w:700,size:dzz,align:"center",color:rgbaS(K.gold,1)}));});
      Ls.forEach((l,li)=>{const r=o.row[li],col=K.lay[idx[l.k]],cur=li===S.k&&!S.checked[li],t=S.checked[li]?since(now,S.checked[li]):-1;
        slab(ctx,o.x0,r.y,o.lw-o.x0*2-6,r.h,"",col,{sk:8,label:false,hi:cur?0.8:0,fill:t>=0?0.4:0});T(ctx,W.names[l.k],o.x0+14,r.y+r.h/2+5,{w:800,size:13.5,color:rgbaS(mixC(col,K.ink,0.35),1)});
        if(t>=0)l.items.forEach((it,j)=>{const B=o.slot[li+"/"+j];if(!B)return;const u=eo(cl((t-j*120)/500,0,1)),right=!!S.pick[li+"/"+j]===!!it.x;
          withA(ctx,u,()=>{if(it.trap){chip(ctx,B.x,B.y,B.w,B.h,it.s,K.bad,{size:12.5,strike:1,tint:0.2});}else chip(ctx,B.x,B.y,B.w,B.h,it.s,col,{size:12.5,mark:right?"ok":null});});
          if(it.trap&&u>=1)pill(ctx,o.lw-o.x0-6,r.y-8,W.pic.wall,K.bad,{size:12,align:"right"});});});
      // the change coming down, layer by layer, between the layers' names and what it touches
      const cy=S.k<Ls.length?o.row[S.k].y-3:o.row[Ls.length-1].y+o.row[Ls.length-1].h,lx=o.x0+o.labW+1;ctx.save();ctx.strokeStyle=rgbaS(K.gold,0.55);ctx.setLineDash([3,4]);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(o.lw/2,44+ex);ctx.lineTo(o.lw/2,50+ex);ctx.lineTo(lx,50+ex);ctx.lineTo(lx,cy);ctx.stroke();ctx.restore();},
    (W.pic&&W.pic.alt)||Lb.name):null;
  const area=h("div",{class:"ea-area"});
  function layer(focus){const li=S.k,l=Ls[li];if(!l)return end();const g=h("div",{class:"ea-touch",role:"group","aria-label":W.names[l.k]}),fb=h("div"),nx=btn(W.next,check,"go");
    l.items.forEach((it,j)=>g.append(h("button",{type:"button",class:"ea-fact-t","aria-pressed":"false","data-j":j,onclick:e=>{if(S.checked[li])return;const b=e.currentTarget,k=li+"/"+j;S.pick[k]=!S.pick[k];b.setAttribute("aria-pressed",String(!!S.pick[k]));}},h("span",{class:"ea-tick","aria-hidden":"true"}),h("span",null,it.t))));
    function check(){S.checked[li]=performance.now();if(st)st.kick(1300);let n=0;l.items.forEach((it,j)=>{const k=li+"/"+j,ok=!!S.pick[k]===!!it.x;if(ok)n++;const b=g.querySelector('[data-j="'+j+'"]');b.disabled=true;b.classList.add(ok?"ok":"no");
        if(it.why&&(!ok||it.trap||!it.x))b.after(h("p",{class:"ea-why sm"},h("b",{class:ok?"ok":"no"},ok?U.right:U.notQuite)," ",it.why));});
      const s=fill(W.layerSay,{layer:W.names[l.k],n,of:l.items.length});sayIt(say,s);nx.remove();const dn=btn(li+1<Ls.length?W.down:U.seeAll,()=>{S.k++;layer(true);},"go");fb.replaceChildren(h("div",{class:"lab-controls"},dn));focusIn(dn);}
    area.replaceChildren(h("p",{class:"ea-sidet"},W.names[l.k]+" · "+fill(U.nOf,{n:li+1,of:Ls.length})),g,h("div",{class:"lab-controls"},nx),fb);if(st)st.kick(600);if(focus)focusIn(g.querySelector("button"));}
  function end(){if(st)st.kick(600);endSay(say,W.owners+" "+W.end);const again=btn(U.again,()=>{S.k=0;S.pick={};S.checked={};S.drop=performance.now();sayIt(say,"");layer(true);},"sm");
    area.replaceChildren(h("p",{class:"ea-end"},W.owners),h("p",{class:"ea-end"},W.end),h("div",{class:"lab-controls"},again));focusIn(again);}
  box.append(...(st?[st.el]:[]),info(W.prompt),area,say);layer(false);return box;}

/* ---------- navigator: the map's own checks, then its agent ---------- */
function labNavigator(Lb){const W=Lb.w,E=W.els,AG=[120,200,255],box=h("div",{class:"lab ea-lab"}),say=say0(),S={mine:new Set(),ran:0,fixed:0,ask:-1,askT:0};
  const fails=E.map((e,i)=>e.fail!=null?i:-1).filter(i=>i>=0);
  // what the agent says: until the fixes, what the map is missing, where its answer needs one (x.no)
  const said=x=>S.fixed?x.a:(x.no||x.a);
  const st=picOf(Lb,()=>1)?stage((lw,ctx)=>{const m=10,cols=lw>=560?2:1,g=8,cw=Math.floor((lw-m*2-g*(cols-1))/cols),rh=34,o={lw,m,cols,cw,rh,g,top:58};o.h=o.top+Math.ceil(E.length/cols)*(rh+g)+6;return o;},(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));
      // the map's agent, software on the map (APP-030), reading it
      const ax=o.m+18,ay=26;glass(ctx,ax-14,ay-14,28,28,14,AG,{fill:"rgba(7,12,24,0.95)",glow:12});archGlyph(ctx,"component",ax,ay,7,AG);T(ctx,W.pic.agent,ax+22,ay+5,{w:800,size:13.5,color:"rgba(120,200,255,1)"});
      // the agent cites what it read: those elements light in its colour
      const ca=S.ask>=0?eo(since(now,S.askT)/600):0,cited=e=>ca>0&&said(W.ask.qs[S.ask]).indexOf(e.eid)>=0;
      E.forEach((e,i)=>{const c=i%o.cols,r=Math.floor(i/o.cols),x=o.m+c*(o.cw+o.g),y=o.top+r*(o.rh+o.g),f=e.fail!=null,res=S.ran?(f&&!(S.fixed&&e.fix)?"fail":"pass"):null,col=res==="fail"?K.bad:res==="pass"?K.good:K.soft;
        glass(ctx,x,y,o.cw,o.rh,8,col,{fill:"rgba(7,12,24,0.94)",glow:res?10:0,ea:res?0.85:0.4});if(S.mine.has(i)&&!S.ran){ctx.save();ctx.strokeStyle=rgbaS(K.gold,1);ctx.lineWidth=2.4;rr(ctx,x-1.5,y-1.5,o.cw+3,o.rh+3,9);ctx.stroke();ctx.restore();}
        if(cited(e))withA(ctx,ca,()=>{ctx.save();ctx.shadowColor="rgba(120,200,255,0.8)";ctx.shadowBlur=14;ctx.strokeStyle="rgba(120,200,255,1)";ctx.lineWidth=2.4;rr(ctx,x-1.5,y-1.5,o.cw+3,o.rh+3,9);ctx.stroke();ctx.restore();});
        line1(ctx,e.eid,x+10,y+o.rh/2+4.5,o.cw-60,12.5,{w:500,color:rgbaS(K.ink,0.95)});
        if(res)pill(ctx,x+o.cw-6,y+(o.rh-24.5)/2,res==="fail"?W.pic.fail:W.pic.pass,col,{size:12.5,align:"right"});});},
    (W.pic&&W.pic.alt)||Lb.name):null;
  const g=h("div",{class:"ea-els",role:"group","aria-label":W.pick});
  E.forEach((e,i)=>g.append(h("button",{type:"button",class:"ea-el","aria-pressed":"false","data-i":i,onclick:ev=>{if(S.ran)return;const b=ev.currentTarget;S.mine.has(i)?S.mine.delete(i):S.mine.add(i);b.setAttribute("aria-pressed",String(S.mine.has(i)));if(st)st.paint();}},
    h("code",null,e.eid),h("span",{class:"ea-lines"},...e.lines.map(([k,v])=>h("span",{class:"ea-line"},h("i",null,k+": "),v))))));
  const ctl=h("div",{class:"lab-controls"}),more=h("div",{class:"ea-area"}),run=btn(W.run,doRun,"go");ctl.append(run);
  function doRun(){S.ran=performance.now();if(st)st.kick(800);run.remove();const found=fails.filter(i=>S.mine.has(i)).length;
    E.forEach((e,i)=>{const b=g.querySelector('[data-i="'+i+'"]'),f=e.fail!=null,ok=S.mine.has(i)===f;b.disabled=true;b.classList.add(f?"fail":"pass");b.append(h("span",{class:"ea-res "+(f?"no":"ok")},f?W.pic.fail:W.pic.pass));
      if(f)b.after(h("p",{class:"ea-why sm"},h("b",{class:"no"},W.checks[e.fail]+":")," ",e.why));else if(!ok)b.after(h("p",{class:"ea-why sm"},h("b",{class:"no"},U.notQuite)," ",W.passes));});
    sayIt(say,fill(W.ran,{n:found}));const fx=btn(W.fixAll,()=>{S.fixed=performance.now();if(st)st.kick(800);fx.remove();
      // a gap with no fix stays flagged, and says why under its own reason
      E.forEach((e,i)=>{const b=g.querySelector('[data-i="'+i+'"]');if(!e.fix){if(e.stays)(b.nextElementSibling||b).after(h("p",{class:"ea-why sm"},e.stays));return;}b.classList.remove("fail");b.classList.add("pass","fixed");b.querySelector(".ea-res").className="ea-res ok";b.querySelector(".ea-res").textContent=W.pic.pass;
        const L2=b.querySelector(".ea-lines");e.fix.forEach(([k,v])=>{const ex=[...L2.children].find(x=>x.firstChild.textContent===k+": ");if(ex)ex.lastChild.textContent=v;else L2.append(h("span",{class:"ea-line new"},h("i",null,k+": "),v));});});
      sayIt(say,(W.fixed?W.fixed+" ":"")+W.ask.t);askers();},"go");ctl.append(fx);askers();focusIn(fx);}
  // the answer is said where it appears (.ea-answer); the first good one brings the end, and the line below says it once
  function askers(){const A=W.ask,list=h("div",{class:"ea-opts ask",role:"group","aria-label":A.t}),ans=h("p",{class:"ea-answer",role:"status"});
    A.qs.forEach((x,k)=>list.append(h("button",{type:"button",onclick:()=>{S.ask=k;S.askT=performance.now();if(st)st.kick(800);ans.textContent=said(x);
      if(S.fixed&&!more.querySelector(".ea-end")){more.append(h("p",{class:"ea-rights"},W.rights),h("p",{class:"ea-end"},W.end),h("div",{class:"lab-controls"},btn(U.again,reset,"sm")));endSay(say,W.rights+" "+W.end);}}},x.q)));
    more.replaceChildren(h("p",{class:"ea-q"},A.t),list,ans);}
  function reset(){const nb=labNavigator(Lb);box.replaceWith(nb);focusIn(nb.querySelector("button"));}
  box.append(...(st?[st.el]:[]),info(W.prompt),g,ctl,more,say);return box;}

const BUILD={deal:labDeal,change:labChange,night:labNight,gate:labGate,rule:labRule,walk:labWalk,navigator:labNavigator};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"ea-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","ea-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):h("p",{class:"ea-coming"},h("b",null,U.coming)," "+U.comingNote);
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
// Situations from every film, or from one (#film-3); each answer explains why and points back to its lab. Answers are kept by
// the scenario's number (film × 10 + its place), so a new situation never takes over an old answer.
const VIS={};
if(app.id==="series-quiz"){app.textContent="";const QS=L.qs,ans=get("quiz",{})||{};let film=0,cur=0;
  const films=[...new Set(QS.map(q=>q.film))].sort((a,b)=>a-b);
  const sel=h("select",{id:"ea-film"},h("option",{value:"0"},U.allFilms),...films.map(n=>h("option",{value:String(n)},filmN(n)+(filmName(n)?" · "+filmName(n):""))));
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");bar.append(dots,score);
  app.append(h("div",{class:"quiz"},h("p",{class:"ea-filter"},h("label",{for:"ea-film"},U.filter),sel),bar,card));
  const list=()=>QS.filter(q=>!film||q.film===film),labOf=id=>L.labs.find(x=>x.id===id)||{name:"",c:"#a0b2cd"};
  function paintBar(){const Q=list();dots.replaceChildren(...Q.map((q,i)=>{const a=ans[q.n];return h("button",{type:"button",class:a?(a.ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1)+(a?" · "+(a.ok?U.right:U.notQuite):""),onclick:()=>{cur=i;render(true);}},String(i+1));}));
    const n=Q.filter(q=>ans[q.n]).length,ok=Q.filter(q=>ans[q.n]&&ans[q.n].ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+n+" "+U.answered+" · "+(Q.length-n)+" "+U.toGo));}
  function done(q,ok,pick){ans[q.n]={ok,pick};put("quiz",ans);paintBar();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why));
  function foot(q){const Q=list(),last=cur===Q.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:"../labs/#"+q.lab},U.explore+" "+labOf(q.lab).name),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results(true);else{cur+=1;render(true);}}},last?U.results:U.nextQ));}
  function render(focus){paintBar();const Q=list(),q=Q[cur];if(!q)return;const f=VIS[q.vis.k],a=ans[q.n],body=h("div",{class:"qbody"}),out=h("div"),S={done:a?performance.now()-1e5:0};
    const vis=DRAW&&f?stage(lw=>({lw,h:Math.round(f.h?f.h(lw):cl(lw*0.56,190,300))}),(ctx,o,now)=>f(ctx,o,now,q,S),(L.pics.alt&&L.pics.alt[q.vis.k])||q.title):null;
    const F=FILMS[q.film]||{};body.append(h("p",{class:"qtag",style:"--c:"+labOf(q.lab).c},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+Q.length+" · "+filmN(q.film)+(F.t?", "+F.t:"")),h("h3",{tabindex:"-1"},q.title),h("p",{class:"qsit"},q.sit));
    const fin=(ok,pick)=>{if(!a)done(q,ok,pick);S.done=performance.now();if(vis)vis.kick(1600);out.replaceChildren(feed(ok,q),foot(q));};
    if(q.type==="choice"||q.type==="spot"){const O=q.type==="choice"?q.opts:q.lines,ix=order(O.map(o=>[o.ok?"ok":"x"]),q.n),bx=h("div",{class:"qopts"+(q.type==="spot"?" spot":"")});
      if(q.type==="spot")body.append(h("p",{class:"ea-tap"},U.tapOne));
      ix.forEach((j,p)=>{const o=O[j];bx.append(h("button",{type:"button",class:"qopt","data-j":j,onclick:()=>pick(j)},h("span",{class:"k"},"ABCDE"[p]),h("span",null,o.t)));});
      function pick(j,quiet){[...bx.children].forEach(b=>{const k=+b.dataset.j;b.disabled=true;if(O[k].ok)b.classList.add("ok");});const o=O[j],b=bx.querySelector('[data-j="'+j+'"]');
        if(!o.ok){b.classList.add("no");if(o.why)b.append(h("small",null,o.why));}fin(!!o.ok,j);if(!quiet)focusIn(out.querySelector(".btn"));}
      body.append(bx);if(a&&a.pick!=null&&O[a.pick])pick(a.pick,true);}
    if(q.type==="order"){let ord=a&&Array.isArray(a.pick)?a.pick.slice():order(q.items.map(()=>["x"]),q.n);if(!a&&ord.every((x,i)=>x===i))ord.reverse();const bx=h("ol",{class:"qorder"});
      const draw=keep=>{bx.replaceChildren(...ord.map((ix,p)=>h("li",null,h("span",{class:"n"},String(p+1)),h("span",null,q.items[ix]),h("span",{class:"mv"},
        h("button",{type:"button","aria-label":U.up+": "+q.items[ix],disabled:p===0||null,onclick:()=>{[ord[p-1],ord[p]]=[ord[p],ord[p-1]];draw([p-1,"up"]);}},"↑"),
        h("button",{type:"button","aria-label":U.down+": "+q.items[ix],disabled:p===ord.length-1||null,onclick:()=>{[ord[p+1],ord[p]]=[ord[p],ord[p+1]];draw([p+1,"down"]);}},"↓")))));
        // keep the focus on the item that moved, so it can keep moving
        if(keep){const b=bx.children[keep[0]].querySelectorAll(".mv button")[keep[1]==="up"?0:1];(b&&!b.disabled?b:bx.children[keep[0]].querySelector(".mv button:not([disabled])")).focus();}};
      const chk=h("button",{type:"button",class:"btn primary",onclick:()=>check(false)},U.check);
      function check(quiet){const ok=ord.every((ix,p)=>ix===p);[...bx.children].forEach((li,p)=>{li.classList.add(ord[p]===p?"ok":"no");li.querySelectorAll("button").forEach(b=>b.disabled=true);});chk.remove();fin(ok,ord.slice());if(!quiet)focusIn(out.querySelector(".btn"));}
      draw();body.append(bx,chk);if(a)check(true);}
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis"},vis?vis.el:null),body));if(focus){const t=body.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}card.scrollIntoView({block:"nearest",behavior:RM()?"auto":"smooth"});}}
  function results(focus){paintBar();const Q=list(),ok=Q.filter(q=>ans[q.n]&&ans[q.n].ok).length,n=Q.length,band=L.done[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};Q.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(ans[q.n]&&ans[q.n].ok)by[k].ok++;});const open=QS.filter(q=>!ans[q.n]).length;
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/Math.max(1,n)*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",{tabindex:"-1"},band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:"../labs/#"+k,class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+labOf(k).c},h("i"),labOf(k).name+" · "+by[k].ok+"/"+by[k].n))),
      film&&open?h("p",{class:"ea-open"},h("a",{href:"#",onclick:e=>{e.preventDefault();setFilm(0);}},fill(U.stillOpen,{n:open}))):null,
      h("button",{type:"button",class:"btn",onclick:()=>{Q.forEach(q=>delete ans[q.n]);put("quiz",ans);cur=0;render(true);}},U.again))));
    if(focus){const t=card.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}}}
  function setFilm(n,keepHash){film=films.includes(n)?n:0;sel.value=String(film);app.dataset.film=String(film);if(!keepHash&&history.replaceState)history.replaceState(null,"",film?"#film-"+film:location.pathname+location.search);
    const Q=list(),first=Q.findIndex(q=>!ans[q.n]);if(first<0)results(false);else{cur=first;render(false);}}
  sel.addEventListener("change",()=>setFilm(+sel.value));
  const fromHash=()=>{const m=(location.hash||"").match(/^#film-(\d+)$/);return m?+m[1]:0;};
  // the first one waits for the rest of this file, where the pictures are
  window.addEventListener("hashchange",()=>setFilm(fromHash(),true));Promise.resolve().then(()=>setFilm(fromHash(),true));}

/* ---------- the scenarios' pictures ---------- */
// Each draws the situation, not its answer; once it's answered (S.done), some show how it ends
const PK=L.pics;
function slabs(ctx,o,hi,a){const x0=12,top=14,gap=5,sh=(o.h-top*2-gap*5)/6;PK.layers.forEach((nm,i)=>{const y=top+i*(sh+gap),on=hi.includes(i);slab(ctx,x0,y,o.lw-x0*2-8,sh,"",K.lay[i],{sk:10,label:false,hi:on?0.9:0,fill:on?0.5:0.12});
  T(ctx,nm,x0+20,y+sh/2+5,{w:800,size:14,color:rgbaS(mixC(K.lay[i],K.ink,0.35),1)});});}
VIS.layers=(ctx,o,now,q)=>{ground(ctx,o.lw,o.h,K.lay[0]);slabs(ctx,o,q.vis.hi||[]);};
VIS.notes=(ctx,o,now,q,S)=>{const g=ctx.createLinearGradient(0,0,0,o.h);g.addColorStop(0,"#2b2620");g.addColorStop(1,"#15120f");ctx.fillStyle=g;ctx.fillRect(0,0,o.lw,o.h);T(ctx,PK.notes,14,24,{w:800,size:14,color:"rgba(238,226,200,0.9)"});
  const st=[1,1,0.5,null],nw=(o.lw-14*2-14)/2,nh=(o.h-44-14-10)/2;[0,1,2,3].forEach(i=>{const x=14+(i%2)*(nw+14),y=40+Math.floor(i/2)*(nh+10),bad=i===3&&S.done;
    paper(ctx,x,y,nw,nh,"",K.notes[i],{rot:(i%2?0.02:-0.025)});T(ctx,String(i+1),x+18,y+nh/2+9,{w:800,size:24,align:"center",color:rgbaS(K.inkd,0.85)});
    if(st[i]!=null){if(typeof statusDot==="function")statusDot(ctx,x+nw-16,y+15,8,st[i],K.inkd,1);}else T(ctx,"?",x+nw-16,y+21,{w:800,size:16,align:"center",color:"rgba(150,40,30,0.95)"});
    if(bad)withA(ctx,eo(since(now,S.done)/500),()=>{ctx.save();ctx.strokeStyle="rgba(190,40,30,0.95)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+8,y+8);ctx.lineTo(x+nw-8,y+nh-8);ctx.moveTo(x+nw-8,y+8);ctx.lineTo(x+8,y+nh-8);ctx.stroke();ctx.restore();});});};
VIS.canvas=(ctx,o,now,q,S)=>{sheet(ctx,8,8,o.lw-16,o.h-16,{rot:-0.006,plain:true});const ink=a=>"rgba(48,44,50,"+a+")",s=Math.min(o.lw*0.34,o.h-80),sx=o.lw*0.1,sy=(o.h-s)/2+10,cx=o.lw*0.9-s/2,cy=sy+s/2;
  T(ctx,PK.canvas,20,32,{w:800,size:14,color:ink(0.9)});marker(ctx,[[sx,sy],[sx+s,sy],[sx+s,sy+s],[sx,sy+s],[sx,sy]],1,{lw:2.2,col:ink(0.8)});marker(ctx,[[sx+s/2,sy],[sx+s/2,sy+s]],1,{lw:1.6,col:ink(0.6)});marker(ctx,[[sx+s/2,sy+s/2],[sx+s,sy+s/2]],1,{lw:1.6,col:ink(0.6)});
  marker(ctx,circlePts(cx,cy,s/2,48),1,{lw:2.2,col:ink(0.8)});marker(ctx,[[cx,cy-s/2],[cx,cy+s/2]],1,{lw:1.6,col:ink(0.6)});marker(ctx,[[cx-s/2,cy],[cx,cy]],1,{lw:1.6,col:ink(0.6)});
  [[sx+s*0.25,sy+s*0.4,K.notes[2]],[sx+s*0.75,sy+s*0.2,K.notes[3]],[sx+s*0.75,sy+s*0.7,K.notes[0]],[cx-s*0.27,cy-s*0.22,K.notes[3]],[cx-s*0.27,cy+s*0.24,K.notes[1]],[cx+s*0.24,cy,K.notes[2]]].forEach(([x,y,c],i)=>paper(ctx,x-15,y-10,30,20,"",c,{rot:(i%2-0.5)*0.1}));
  if(q.vis.gap)T(ctx,"?",cx-s*0.27,cy+s*0.24+28,{w:800,size:22,align:"center",color:"rgba(190,40,30,0.95)"});};
VIS.chain=(ctx,o,now,q)=>{ground(ctx,o.lw,o.h,K.lay[0]);const ks=["stakeholder","driver","assessment","goal","outcome"],nm=PK.chain,cols=o.lw<460?2:3,m=12,g=8,w=(o.lw-m*2-g*(cols-1))/cols,hh=36;
  ks.concat(["principle"]).forEach((k,i)=>{const c=i%cols,r=Math.floor(i/cols),x=m+c*(w+g),y=16+r*(hh+12);el(ctx,x,y,w,hh,nm[i],K.lay[0],k,{hi:q.vis.hi===i?1:0,a:q.vis.hi!=null&&q.vis.hi!==i?0.55:1});});};
VIS.caps=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[1]);T(ctx,PK.caps,14,24,{w:800,size:14,color:rgbaS(K.lay[1],1)});const L2=q.lines,cols=2,m=12,g=8,w=(o.lw-m*2-g)/cols,hh=Math.min(44,(o.h-44-g*2)/3);
  L2.forEach((l,i)=>{const c=i%cols,r=Math.floor(i/cols),x=m+c*(w+g),y=38+r*(hh+g),bad=l.ok&&S.done;paper(ctx,x,y,w,hh,l.t,K.notes[0],{edge:bad?K.bad:null,strike:bad});});};
VIS.heat=(ctx,o,now,q)=>{ground(ctx,o.lw,o.h,K.lay[1]);T(ctx,PK.heat.t,14,24,{w:800,size:14,color:rgbaS(K.lay[1],1)});const C={g:[110,210,140],a:[255,196,90],r:[255,96,80]},m=12,g=8,w=(o.lw-m*2-g)/2,hh=(o.h-46-g)/2;
  PK.heat.cells.forEach(([nm,k],i)=>{const x=m+(i%2)*(w+g),y=38+Math.floor(i/2)*(hh+g);el(ctx,x,y,w,hh,nm,C[k],"capability",{hi:k==="r"?1:0,size:13.5});});};
VIS.storm=(ctx,o,now,q,S)=>{const g=ctx.createLinearGradient(0,0,0,o.h);g.addColorStop(0,"#0a1428");g.addColorStop(1,"#050a16");ctx.fillStyle=g;ctx.fillRect(0,0,o.lw,o.h);T(ctx,PK.storm,14,24,{w:800,size:14,color:rgbaS(K.soft,1)});
  const P3=[[0.2,0.42,"wire",30],[0.5,0.68,"life",8],[0.8,0.42,"many",900]],cx=o.lw*0.5,cy=o.h-22;P3.forEach(([px,py,k,n],i)=>{const x=px*o.lw,y=py*o.h,lit=S.done&&i===0?eo(since(now,S.done)/600-1.6):0;
    for(let j=0;j<(k==="many"?12:k==="wire"?6:4);j++){const hx=x-24+(j%(k==="many"?4:3))*13,hy=y+Math.floor(j/(k==="many"?4:3))*12;ctx.fillStyle=lit>0?rgbaS(mixC([30,38,60],[255,214,120],lit),1):"rgba(30,38,60,1)";ctx.fillRect(hx,hy,9,8);}
    if(k==="wire"){ctx.save();ctx.strokeStyle="rgba(255,150,60,1)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x+18,y-18);ctx.lineTo(x+26,y-10);ctx.lineTo(x+22,y-8);ctx.lineTo(x+32,y+2);ctx.stroke();ctx.restore();}
    if(k==="life"){ctx.save();ctx.translate(x+30,y-8);ctx.fillStyle="rgba(255,110,120,0.95)";ctx.beginPath();ctx.moveTo(0,7);ctx.bezierCurveTo(-11,-1,-7,-10,0,-4);ctx.bezierCurveTo(7,-10,11,-1,0,7);ctx.fill();ctx.restore();}
    T(ctx,String(n),x,y-22,{w:800,size:13,align:"center",color:rgbaS(K.ink,0.9)});});
  const u=S.done?eo(since(now,S.done)/1400):0,x=lp(cx,P3[0][0]*o.lw,u),y=lp(cy,P3[0][1]*o.h+34,u);glass(ctx,x-18,y-10,36,20,10,K.gold,{fill:"rgba(30,22,6,0.95)",glow:10});T(ctx,"1",x,y+5,{w:800,size:13,align:"center",color:rgbaS(K.gold,1)});};
VIS.steps=(ctx,o,now,q)=>{ground(ctx,o.lw,o.h,K.lay[2]);T(ctx,PK.steps,14,24,{w:800,size:14,color:rgbaS(K.lay[2],1)});const n=7,m=12,cols=o.lw<460?4:7,g=6,w=(o.lw-m*2-g*(cols-1))/cols,hh=44;
  for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols),x=m+c*(w+g),y=44+r*(hh+12);el(ctx,x,y,w,hh,"?",K.lay[2],"process",{center:1,size:16});}};
VIS.wall=(ctx,o,now,q)=>{ground(ctx,o.lw,o.h,K.dom[0]);const gx=o.lw/2-7,v=q.vis;ctx.save();ctx.fillStyle="rgba(150,160,180,0.22)";ctx.fillRect(gx,10,14,o.h-20);ctx.restore();
  T(ctx,PK.wall.net,o.lw*0.25,40,{w:800,size:15,align:"center",color:rgbaS(K.dom[0],1)});T(ctx,v.agency?PK.wall.agency:PK.wall.ret,o.lw*0.75,40,{w:800,size:15,align:"center",color:rgbaS(K.dom[1],1)});
  if(v.agency)T(ctx,"?",o.lw/2,o.h/2+8,{w:800,size:24,align:"center",color:rgbaS(K.gold,1)});
  if(v.rule){const w=Math.min(220,o.lw*0.6),x=o.lw/2-w/2,y=o.h/2-26;glass(ctx,x,y,w,52,12,K.bad,{fill:"rgba(30,10,10,0.95)",glow:14});[0,1,2].forEach(k=>{ctx.fillStyle="rgba(255,200,190,0.5)";rr(ctx,x+14,y+14+k*9,w*(0.75-k*0.15),4,2);ctx.fill();});}
  else for(let k=0;k<3;k++){chip(ctx,o.lw*0.25-60,64+k*36,120,26,"",K.dom[0],{tint:0.15});chip(ctx,o.lw*0.75-60,64+k*36,120,26,"",K.dom[1],{tint:0.15});}};
VIS.systems=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[4]);T(ctx,PK.systems,14,24,{w:800,size:14,color:rgbaS(K.lay[4],1)});const m=12,hh=(o.h-44-3*6)/4;
  q.lines.forEach((l,i)=>{const y=38+i*(hh+6),bad=l.ok&&S.done,ew=(o.lw-m*2)*0.42;el(ctx,m,y,ew,hh,"",K.lay[1],"capability");chip(ctx,m+ew+10,y,o.lw-m*2-ew-10,hh,String.fromCharCode(65+i),bad?K.bad:K.lay[4],{size:15,mark:bad?"no":null});
    arrow(ctx,m+ew+8,y+hh/2,m+ew+1,y+hh/2,K.lay[4],0.6,{lw:1.4,head:5});});};
VIS.ladder=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const R=PK.ladder,m=14,g=8,hh=(o.h-28-g*3)/4,up=S.done?eo(since(now,S.done)/1200):0;
  R.forEach((nm,i)=>{const k=3-i,y=14+i*(hh+g),lit=S.done&&up*4>k;glass(ctx,m,y,o.lw-m*2,hh,10,lit?K.gold:K.soft,{glow:lit?12:0,ea:lit?0.9:0.4,fill:"rgba(7,12,24,0.92)"});T(ctx,nm,m+14,y+hh/2+5,{w:800,size:14,color:rgbaS(lit?K.gold:K.soft,1)});});};
VIS.clock=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[3]);const m=14,max=36,bw=o.lw-m*2-120,bars=[[PK.clock.a,34,K.lay[3]],[PK.clock.b,21,K.lay[4]]].concat(S.done?[[PK.clock.c,24,K.good]]:[]);
  bars.forEach(([t,v,c],i)=>{const y=24+i*((o.h-40)/3),hh=Math.min(34,(o.h-60)/3),u=i===2?eo(since(now,S.done)/800):1;glass(ctx,m,y,Math.max(30,bw*v/max*u),hh,8,c,{fill:"rgba(7,12,24,0.92)",glow:10});ctx.fillStyle=rgbaS(c,0.25);rr(ctx,m,y,Math.max(30,bw*v/max*u),hh,8);ctx.fill();
    withA(ctx,u,()=>line1(ctx,t,m+Math.max(30,bw*v/max)+10,y+hh/2+5,o.lw-m*2-bw*v/max-10,13.5,{color:rgbaS(c,1)}));});};
VIS.checks=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.good);T(ctx,PK.checks,14,24,{w:800,size:14,color:rgbaS(K.good,1)});const n=o.lw<460?7:10,m=14,g=6,w=(o.lw-m*2-g*(n-1))/n;
  for(let i=0;i<n;i++){const x=m+i*(w+g),y=o.h/2-w/2,last=i===n-1&&S.done;glass(ctx,x,y,w,w,8,last?K.bad:K.good,{fill:"rgba(7,12,24,0.92)",glow:8});mark(ctx,x+w/2,y+w/2,last?"no":"ok");}};
VIS.plateaus=(ctx,o,now,q)=>{ground(ctx,o.lw,o.h,K.mig);const P2=PK.plateaus,m=12,n=P2.length,w=(o.lw-m*2-8*(n-1))/n;
  P2.forEach((nm,i)=>{const x=m+i*(w+8),y=o.h-40-i*((o.h-90)/(n-1));glass(ctx,x,y,w,30,6,K.mig,{fill:"rgba(7,12,24,0.92)",glow:8});glyph(ctx,"plateau",x+14,y+15,7,K.mig);line1(ctx,nm,x+26,y+20,w-32,13);if(i<n-1)arrow(ctx,x+w/2,y-4,x+w+8+w/2,y-((o.h-90)/(n-1))+30+4,K.mig,0.5,{lw:1.4,head:6,dash:[3,3]});});};
VIS.agent=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[120,200,255]);const ax=o.lw*0.22,ay=o.h/2;glass(ctx,ax-30,ay-30,60,60,30,[120,200,255],{fill:"rgba(7,12,24,0.95)",glow:16});archGlyph(ctx,"component",ax,ay,14,[120,200,255]);
  T(ctx,PK.agent,ax,ay+52,{w:800,size:13.5,align:"center",color:"rgba(120,200,255,1)"});const mx=o.lw*0.48,mw=o.lw-mx-14;for(let i=0;i<4;i++){const y=24+i*((o.h-48)/4),hh=(o.h-48)/4-8;chip(ctx,mx,y,mw,hh,"",i===1?K.dom[1]:K.soft,{tint:0.1,glow:0,dash:i===1&&!S.done});
    ctx.fillStyle="rgba(200,215,235,0.35)";rr(ctx,mx+12,y+hh/2-3,mw*0.5,6,3);ctx.fill();}arrow(ctx,ax+34,ay,mx-6,24+((o.h-48)/4)*1.5-4,[120,200,255],0.8,{dash:[4,4],lw:1.6});};
VIS.views=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[3]);const V=PK.views,cx=o.lw*0.26,cy=o.h/2,mw=Math.min(130,o.lw*0.3);el(ctx,cx-mw/2,cy-26,mw,52,V.map,K.gold,"",{center:1,size:15,hi:1});
  const vx=o.lw*0.55,vw=o.lw-vx-12,hh=(o.h-24-3*8)/4;V.v.forEach((nm,i)=>{const y=12+i*(hh+8);chip(ctx,vx,y,vw,hh,nm,K.lay[3],{size:13.5});arrow(ctx,cx+mw/2+2,cy,vx-4,y+hh/2,K.gold,0.7,{lw:1.4,head:6});});};
VIS.glyphs=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[0]);const it=(L.labs.find(x=>x.id==="notation").w.items).find(x=>x.from===q.vis.from)||{fromT:"",from:"",toT:"",to:""},m=12,gap=34,w=(o.lw-m*2-gap)/2,hh=60,y=o.h/2-hh/2+8;
  T(ctx,(L.labs.find(x=>x.id==="notation").w.pic||{}).v3||"3.2",m+w/2,y-16,{w:800,size:13,align:"center",color:rgbaS(K.soft,1)});T(ctx,(L.labs.find(x=>x.id==="notation").w.pic||{}).v4||"4",m+w+gap+w/2,y-16,{w:800,size:13,align:"center",color:rgbaS(K.ink,0.95)});
  el(ctx,m,y,w,hh,it.fromT,KIND_COL(it.from),it.from,{size:14});arrow(ctx,m+w+5,y+hh/2,m+w+gap-5,y+hh/2,K.soft,0.8,{dash:[4,4]});
  if(!S.done)chip(ctx,m+w+gap,y,w,hh,"?",K.soft,{dash:1,tint:0.04,glow:0,size:20});else{const t=since(now,S.done),v=V4(it);scaled(ctx,m+w+gap,y,w,hh,lp(0.85,1,sp(t/600)),()=>el(ctx,m+w+gap,y,w,hh,it.toT,KIND_COL(v.kind),v.kind,{size:14,g2:v.g2,c2:KIND_COL(v.g2),a:eo(t/500),hi:0.5}));}};
// a rule's place in ArchiMate 4: its reason, its step, its owner (in gold, as the film draws owners) and its data around an empty place;
// once answered, a requirement, with each joined as ArchiMate draws it, and named: an influence (dashed, an open head), a realisation
// (dotted, a hollow head), an association
VIS.links=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[0]);const P2=PK.links,m=12,g=12,ew=Math.min(230,(o.lw-m*2-g)/2),eh=Math.min(50,(o.h-24-g*2)/3),gy=(o.h-24-eh*3)/2,
    y0=12,y1=y0+eh+gy,y2=y1+eh+gy,rw=Math.min(200,o.lw*0.46),rx=o.lw/2-rw/2,t=S.done?since(now,S.done):-1,
    E=[[P2.code,"driver",K.lay[0],m,y0,"infl"],[P2.owner,"actor",K.gold,o.lw-m-ew,y0,"assoc"],[P2.step,"stream",K.lay[1],m,y2,"real"],[P2.obj,"object",K.lay[3],o.lw-m-ew,y2,"assoc"]];
  const rel=(x0,y0_,x1,y1_,k,p)=>{if(p<=0)return;const an=Math.atan2(y1_-y0_,x1-x0),hz=9,end=p>=1&&k==="real"?hz*0.9:0;ctx.save();ctx.strokeStyle=rgbaS(K.lay[0],1);ctx.lineWidth=1.8;ctx.lineCap="round";
    if(k!=="assoc")ctx.setLineDash(k==="infl"?[6,4]:[2,4]);ctx.beginPath();ctx.moveTo(x0,y0_);ctx.lineTo(lp(x0,x1,p)-Math.cos(an)*end,lp(y0_,y1_,p)-Math.sin(an)*end);ctx.stroke();ctx.setLineDash([]);
    if(p>=1&&k!=="assoc"){ctx.beginPath();ctx.moveTo(x1-hz*Math.cos(an-0.45),y1_-hz*Math.sin(an-0.45));ctx.lineTo(x1,y1_);ctx.lineTo(x1-hz*Math.cos(an+0.45),y1_-hz*Math.sin(an+0.45));
      if(k==="real"){ctx.closePath();ctx.fillStyle="rgba(7,12,24,1)";ctx.fill();}ctx.stroke();}ctx.restore();};
  E.forEach(([nm,kind,col,x,y,k],i)=>{const top=y<y1,left=x<rx,ax=left?x+ew*0.75:x+ew*0.25,ay=top?y+eh:y,bx=o.lw/2+(left?-1:1)*rw*0.25,by=top?y1:y1+eh;
    if(t<0){ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.4);ctx.setLineDash([3,4]);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.restore();}
    else{rel(ax,ay,bx,by,k,eo(cl((t-300-i*220)/400,0,1)));
      // its name beside the line's middle, clear of it however steep the line
      const off=8+6*Math.abs((bx-ax)/(by-ay));withA(ctx,eo(cl((t-1000)/400,0,1)),()=>T(ctx,P2.rel[k],(ax+bx)/2+(left?-off:off),(ay+by)/2+4.5,{w:700,size:12.5,align:left?"right":"left",color:rgbaS(K.lay[0],1)}));}
    el(ctx,x,y,ew,eh,nm,col,kind,{size:13});});
  if(t<0)chip(ctx,rx,y1,rw,eh,"?",K.soft,{dash:1,tint:0.04,glow:0,size:20});
  else scaled(ctx,rx,y1,rw,eh,lp(0.85,1,sp(t/600)),()=>el(ctx,rx,y1,rw,eh,P2.rule,K.lay[0],"requirement",{size:14,a:eo(t/500),hi:0.5}));};
// taller than the others, for the names of the lines
VIS.links.h=lw=>cl(lw*0.7,250,320);
})();
