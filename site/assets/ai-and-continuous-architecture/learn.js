/* Learning Data: AI and continuous architecture. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from
   one engine: the series' labs page and scenarios page load Every change, checked's bundle (for the films' own parts: glass, paper,
   the agent's orb, the stamped brick), the words (learn.en.js or learn.es.js, which set window.ACA), and this file.
   Every lab is a sort: cards dealt one at a time, each put in its box, and why before the next. Its picture gives each box a row,
   and each card flies to its row as it's placed, through the wrong row first when the first pick was wrong. Every scenario is a
   choice, its options in the order the words write them, where the words spread the right ones.
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its
   words stay big enough to read on a phone. Things move with a spring and settle, or jump to where they end when the visitor asks
   for reduced motion, and every change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films: by
   number, each film's title, page and chapter starts, or "coming" for a film being made), both from site-tools/build_series.py.
   Progress stays in this browser: "visited" (the lab ids) and "quiz" (answers by scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.ACA,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-ai-and-continuous-architecture";
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
const filmName=n=>(FILMS[n]||{}).t||"",NF=L.films||Object.keys(FILMS).length||6,filmN=n=>fill(U.filmN,{n,of:NF});
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
// the films' colours: ink, the six layers (motivation to technology), paper notes, right, wrong and gold; and this series' own: the
// agent's teal, the business side's gold and the technical side's cyan, the network's blue and retail's rose, the four levels a
// product can have (What an agent may read), and fired brick
const K={ink:[236,243,255],soft:[160,178,205],good:[120,240,170],bad:[255,112,100],gold:[255,209,102],inkd:[40,40,48],paper:[239,232,218],
  lay:[[200,186,255],[245,206,140],[255,234,130],[255,186,150],[140,214,255],[160,224,140]],notes:[[255,228,122],[255,176,196],[164,212,255],[188,236,164]],
  ai:[130,230,215],biz:[255,209,102],tech:[120,200,255],net:[132,176,255],ret:[255,150,186],red:[236,104,92],brick:[238,164,112],clay:[226,188,140],
  lv:{public:[132,226,160],internal:[140,214,255],confidential:[255,196,120],restricted:[236,104,92]}};
const rgbaS=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")",mixC=(a,b,t)=>[lp(a[0],b[0],t),lp(a[1],b[1],t),lp(a[2],b[2],t)];
const LN=(ctx,s,w,z,wt)=>wrapT(ctx,String(s),0,0,w,{size:z,w:wt||700,measure:true});
const TW=(ctx,s,z,wt)=>tw(ctx,String(s),z,wt||700);
// words a picture had to cut short, or let spill, for smoke.py's series-learn check (site-tools/smoke/ai-and-continuous-architecture.js)
const MISS=window.ACA_MISS=new Set();
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
// a chip of the model: a short label on glass, in a colour (o.strike crosses it out; o.mark puts a tick on its corner; o.badge an
// icon there, [icon, colour, how much it shows], its words kept clear of it from the start)
function chip(ctx,x,y,w,hh,label,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const tw_=w-14-(o.badge?8:0);let[ls,z]=fitL(ctx,label,tw_,o.size||13,o.max||2);const r=o.r==null?8:o.r;
  // two lines as even as they can be, so no word is left alone on the second
  if(ls.length===2&&(o.max||2)===2){const b=bal(ctx,label,tw_,o.size||13);if(b[0].length===2)[ls,z]=b;}const lh=z*1.2;
  withA(ctx,a,()=>{glass(ctx,x,y,w,hh,r,col,{glow:o.glow==null?8:o.glow,ea:o.ea==null?0.8:o.ea,fill:o.fill||"rgba(7,12,24,0.94)",lw:o.lw});
    ctx.fillStyle=rgbaS(col,o.tint==null?0.13:o.tint);rr(ctx,x,y,w,hh,r);ctx.fill();if(o.dash){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgbaS(col,0.9);ctx.lineWidth=1.6;rr(ctx,x+1,y+1,w-2,hh-2,r);ctx.stroke();ctx.restore();}
    const y0=y+hh/2-(ls.length-1)*lh/2+z*0.36;ls.forEach((l,i)=>T(ctx,l,x+w/2,y0+i*lh,{w:700,size:z,align:"center",color:o.color||rgbaS(K.ink,0.96)}));
    // crossed out: one stroke across a line, or one through the words of each line
    if(o.strike){ctx.save();ctx.strokeStyle=rgbaS(K.bad,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();
      if(ls.length<2){ctx.moveTo(x+5,y+hh/2+2);ctx.lineTo(x+w-5,y+hh/2-2);}
      else ls.forEach((l,i)=>{const d=TW(ctx,l,z)/2+5,yl=y0+i*lh-z*0.3;ctx.moveTo(x+w/2-d,yl+1);ctx.lineTo(x+w/2+d,yl-1);});ctx.stroke();ctx.restore();}
    if(o.badge&&o.badge[2]!==0)withA(ctx,o.badge[2]==null?1:o.badge[2],()=>badge(ctx,x+w-2,y+2,o.badge[0],o.badge[1]));
    if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
// an icon on a chip's corner, where a tick goes, on a dark disc: the lock on what stays outside, the key on what's read on its
// holder's own sign-in
function badge(ctx,x,y,ic,col){ctx.save();ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(x,y,9,0,TP);ctx.fill();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=1.6;ctx.stroke();
  ctx.translate(x,y);ctx.scale(0.72,0.72);ic(ctx,ic===IC.lock?0:-0.2,ic===IC.lock?-0.75:0,col);ctx.restore();}
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
const why=(ok,txt)=>h("p",{class:"aca-why"},h("b",{class:ok?"ok":"no"},ok?U.right:U.notQuite)," ",txt);
// what the lab says (.lab-say); at the end, its box on the page says it, so the line keeps it only for a screen reader
const sayIt=(say,t)=>{say.classList.remove("sr");say.textContent=t;},endSay=(say,t)=>{say.textContent=t;say.classList.add("sr");};
const lc=s=>s&&!/^[A-Z]{2}/.test(s)?s[0].toLowerCase()+s.slice(1):s;
function focusIn(el){if(!el)return;try{el.focus({preventScroll:true});}catch(e){el.focus();}const r=el.getBoundingClientRect();if(r.bottom>innerHeight-8||r.top<120)el.scrollIntoView({block:"center",behavior:RM()?"auto":"smooth"});}

/* ---------- sort: cards dealt one at a time, each to its box ---------- */
// Each lab's picture (PIC[id], made by rows() below) lands each card in the row of its box. S is what has happened so far: the card
// shown (i), the cards placed (done), each one's first pick (first) and when it was made (t).
const PIC={};
function labSort(Lb){const W=Lb.w,its=W.items,n=its.length,S={i:0,done:[],first:{},t:{},fx:{}},box=h("div",{class:"lab aca-lab"}),say=say0();
  const pic=picOf(Lb,PIC[Lb.id]&&(()=>PIC[Lb.id](Lb,S))),st=pic?stage(pic.lay,pic.draw,(W.pic&&W.pic.alt)||Lb.name):null;
  const deal=h("div",{class:"aca-deal"}),ctrl=h("div",{class:"lab-controls"}),nameOf=k=>(W.buckets.find(o=>o[0]===k)||[,""])[1];
  const right=()=>S.done.filter(i=>S.first[i]===its[i].b).length;
  function status(){if(S.i<n)sayIt(say,fill(U.placed,{n:S.done.length,of:n})+(S.done.length?" · "+right()+" "+U.firstTry:""));else endSay(say,fill(W.end,{n:right(),of:n}));}
  function show(focus){deal.replaceChildren();ctrl.replaceChildren();if(pic&&pic.show)pic.show(S.i);if(st)st.kick(900);
    if(S.i>=n)return finish(focus);
    const i=S.i,it=its[i],id="aca-t-"+Lb.id;
    // the boxes, in the order the words give them, the same for every card
    const opts=h("div",{class:"aca-opts",role:"group","aria-labelledby":id},...W.buckets.map(o=>h("button",{type:"button","data-k":o[0],onclick:()=>answer(o[0])},o[1])));
    deal.append(h("div",{class:"aca-card"},h("p",{class:"k"},fill(U.card,{n:i+1,of:n})),h("p",{class:"t",id},it.t)),opts);
    function answer(k){if(S.first[i]!=null)return;S.first[i]=k;S.t[i]=performance.now();S.done.push(i);const ok=k===it.b;
      opts.querySelectorAll("button").forEach(b=>{b.disabled=true;if(b.dataset.k===it.b)b.classList.add("ok");else if(b.dataset.k===k)b.classList.add("no");});
      deal.append(why(ok,(ok?"":fill(U.belongs,{b:nameOf(it.b)})+" ")+it.why));if(st)st.kick(ok?FLY[0]:FLY[1]);
      const nx=btn(S.i+1<n?U.go+" →":U.seeAll,()=>{S.i++;show(true);},"go");ctrl.replaceChildren(nx);status();focusIn(nx);}
    status();if(focus)focusIn(opts.querySelector("button"));}
  function finish(focus){const again=btn(U.again,()=>{S.i=0;S.done=[];S.first={};S.t={};S.fx={};show(true);},"sm");
    deal.append(h("p",{class:"aca-end"},fill(W.end,{n:right(),of:n})));ctrl.replaceChildren(again);status();if(focus)focusIn(again);}
  box.append(...(st?[st.el]:[]),info(W.prompt),deal,ctrl,say);show(false);return box;}
const BUILD={sort:labSort};

/* ---------- the labs' pictures ---------- */
// the agent, as the films draw one (aca_agent, Keeping it true's glass orb), or a plain teal one if the film's parts lack it
const orb=(ctx,x,y,r,now,o)=>{o=o||{};if(typeof aca_agent==="function")return aca_agent(ctx,x,y,r,now/1000,o);
  withA(ctx,o.a==null?1:o.a,()=>{ctx.save();const g=ctx.createRadialGradient(x-r*0.3,y-r*0.3,1,x,y,r);g.addColorStop(0,rgbaS(mixC(K.ai,K.ink,0.6),1));g.addColorStop(1,rgbaS(K.ai,0.7));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TP);ctx.fill();ctx.restore();});};
// the rows' marks, about 16 units across, centred on (x, y)
const IC={
  // how far an agent may go: four bars rising, lit as high as the step (0: inform, to 3: run)
  steps:(ctx,x,y,col,k)=>{for(let i=0;i<4;i++){const bh=4+i*3.4;ctx.fillStyle=rgbaS(col,k>=i?1:0.22);ctx.fillRect(x-8+i*4.6,y+6.5-bh,3.2,bh);}},
  person:(ctx,x,y,col)=>{ctx.save();ctx.fillStyle=rgbaS(col,1);ctx.beginPath();ctx.arc(x,y-3.6,3.7,0,TP);ctx.fill();ctx.beginPath();ctx.ellipse(x,y+7,6.6,5,0,Math.PI,TP);ctx.fill();ctx.restore();},
  agent:(ctx,x,y,col,now)=>orb(ctx,x,y,6.5,now),
  // a service, as ArchiMate draws one: a rounded pill
  service:(ctx,x,y,col)=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=1.8;rr(ctx,x-8,y-5,16,10,5);ctx.stroke();ctx.restore();},
  // struck: a circle crossed through
  gone:(ctx,x,y,col)=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(x,y,6.5,0,TP);ctx.stroke();ctx.beginPath();ctx.moveTo(x-4.6,y+4.6);ctx.lineTo(x+4.6,y-4.6);ctx.stroke();ctx.restore();},
  // the chat's own place: a drawer
  place:(ctx,x,y,col)=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=1.8;rr(ctx,x-8,y-6,16,12,3);ctx.stroke();ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+3,y);ctx.stroke();ctx.restore();},
  key:(ctx,x,y,col)=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(x-4,y,3.6,0,TP);ctx.stroke();ctx.beginPath();ctx.moveTo(x-0.4,y);ctx.lineTo(x+8,y);ctx.moveTo(x+5,y);ctx.lineTo(x+5,y+3.6);ctx.moveTo(x+8,y);ctx.lineTo(x+8,y+3);ctx.stroke();ctx.restore();},
  // a small tool's answer: a switch, yes or no
  tool:(ctx,x,y,col)=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=1.8;rr(ctx,x-8,y-5,16,10,5);ctx.stroke();ctx.fillStyle=rgbaS(col,1);ctx.beginPath();ctx.arc(x+3,y,2.8,0,TP);ctx.fill();ctx.restore();},
  lock:(ctx,x,y,col)=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.fillStyle=rgbaS(col,1);ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(x,y-2,4,Math.PI,TP);ctx.stroke();rr(ctx,x-6,y-1.5,12,9,2);ctx.fill();ctx.restore();},
  // an owner's tag, as the films hang one on an element
  tag:(ctx,x,y,col)=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x-7,y-5);ctx.lineTo(x+3,y-5);ctx.lineTo(x+8,y);ctx.lineTo(x+3,y+5);ctx.lineTo(x-7,y+5);ctx.closePath();ctx.stroke();
    ctx.beginPath();ctx.arc(x+2,y,1.4,0,TP);ctx.fillStyle=rgbaS(col,1);ctx.fill();ctx.restore();},
  no:(ctx,x,y)=>mark(ctx,x,y,"no"),ok:(ctx,x,y)=>mark(ctx,x,y,"ok"),
  // a month: a calendar's page, its rings at the top and one day marked
  cal:(ctx,x,y,col)=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=1.6;rr(ctx,x-7,y-5.5,14,13,2);ctx.stroke();ctx.beginPath();ctx.moveTo(x-7,y-1.5);ctx.lineTo(x+7,y-1.5);
    ctx.moveTo(x-3.5,y-8);ctx.lineTo(x-3.5,y-4);ctx.moveTo(x+3.5,y-8);ctx.lineTo(x+3.5,y-4);ctx.stroke();ctx.fillStyle=rgbaS(col,1);ctx.fillRect(x-4.5,y+1.5,3.4,3.4);ctx.restore();}};
// a head over the rows: a mark of the lab's own at its left, a title in the lab's colour and a line under it, clear of the pile at the right
// (L2.hx, L2.hw: where the head's words go; L2.sub: the line under the title, fitted in its layout to one or two lines)
function head(ctx,L2,now,col,P2,mk){if(mk)mk(ctx,L2.x0+13,26,now);line1(ctx,P2.title,L2.hx,24,L2.hw,15,{w:800,color:rgbaS(col,1)});
  if(L2.sub)L2.sub[0].forEach((l,i)=>T(ctx,l,L2.hx,42+i*L2.sub[1]*1.2,{w:600,size:L2.sub[1],color:rgbaS(K.soft,1)}));}
// Every lab's picture: a row for each of its boxes, under a head of its own (its line under the title on two lines, or three on
// the narrowest phones when two won't hold it). The cards wait in a pile at the top right and fly to
// their row as they're placed, through the wrong row first when the first pick was wrong; each settles with a tick. o: col(k), each
// row's colour; icon, each row's mark (IC above, or a function); look(it), "struck" for a card struck out once it's in; mark(ctx, L2,
// now), the head's own mark. Once every card is in, the words of W.pic.done come in under the rows.
function rows(Lb,S,o){const W=Lb.w,its=W.items,keys=W.buckets.map(b=>b[0]),P2=W.pic,col=rgb(Lb.c),nameOf=k=>(P2.rows&&P2.rows[k])||W.buckets.find(b=>b[0]===k)[1];
  const lay=(lw,ctx)=>{const x0=12,cw=lw-x0*2-20,hx=x0+(o.mark?30:2),hw=lw-x0-hx-82,sub=P2.sub?(f=>f.miss?fitL(ctx,P2.sub,hw,12.5,3,600):f)(fitL(ctx,P2.sub,hw,12.5,2,600,1)):null,L2={lw,x0,hx,hw,sub,rows:[],slot:{},row:{}};
    let y=sub?Math.round(52+sub[0].length*sub[1]*1.2):44;
    keys.forEach(k=>{const mine=its.map((it,i)=>[it,i]).filter(([it])=>it.b===k),f=flow(ctx,mine.map(([it])=>it.s),cw,13,6),ch=Math.max(34,f.h+12),r={k,y,h:30+ch,c:o.col(k)};
      L2.rows.push(r);L2.row[k]=r;mine.forEach(([it,i],j)=>{const p=f.pos[j];L2.slot[i]={x:x0+10+p.x,y:y+30+(ch-f.h)/2+p.y,w:p.w,h:p.h};});y+=r.h+6;});
    const[ls,z]=bal(ctx,P2.done,lw-x0*2-8,13);L2.end={y:y+6,ls,z};L2.h=y+12+ls.length*z*1.25+6;L2.deck=[lw-x0-62,10];return L2;};
  const draw=(ctx,L2,now)=>{ground(ctx,L2.lw,L2.h,col);const left=its.length-S.done.length;
    head(ctx,L2,now,col,P2,o.mark);
    L2.rows.forEach(r=>{const n=its.filter(it=>it.b===r.k).length,got=S.done.filter(i=>its[i].b===r.k&&since(now,S.t[i])>500).length,f=n?got/n:0;
      glass(ctx,L2.x0,r.y,L2.lw-L2.x0*2,r.h,12,r.c,{glow:4+8*f,ea:0.5+0.3*f,fill:"rgba(7,12,24,0.92)"});ctx.fillStyle=rgbaS(r.c,0.04+0.1*f);rr(ctx,L2.x0,r.y,L2.lw-L2.x0*2,r.h,12);ctx.fill();
      const ic=typeof o.icon==="function"?o.icon:IC[o.icon];if(ic)ic(ctx,L2.x0+18,r.y+16,r.c,now,r.k);
      line1(ctx,nameOf(r.k),L2.x0+34,r.y+21,L2.lw-L2.x0*2-44,14,{w:800,color:rgbaS(mixC(r.c,K.ink,0.3),1)});});
    // the pile still to place, at the top right
    const[dx,dy]=L2.deck;for(let j=Math.min(left,4)-1;j>=0;j--)glass(ctx,dx+j*3,dy+j*2,56,30,8,K.soft,{fill:"rgba(16,26,50,0.97)",glow:3,ea:0.55});
    if(left)T(ctx,String(left),dx+(Math.min(left,4)-1)*3+28,dy+(Math.min(left,4)-1)*2+20,{w:800,size:15,align:"center",color:rgbaS(K.ink,0.9)});
    S.done.forEach(i=>{const it=its[i],B=L2.slot[i],ok=S.first[i]===it.b,wr=L2.row[S.first[i]],X=ok?null:[L2.x0+10,wr.y+34],[x,y,s,bad]=fly(now,S.t[i],ok,[dx,dy],[B.x,B.y],X);
      const set=!bad&&since(now,S.t[i])>(ok?FLY[0]:FLY[1])-80,c=bad?K.bad:L2.row[it.b].c;
      scaled(ctx,x,y,B.w,B.h,s,()=>chip(ctx,x,y,B.w,B.h,it.s,c,{size:13,mark:set&&ok?"ok":null,strike:set&&o.look&&o.look(it)==="struck"}));});
    if(!left){const a=eo(since(now,S.fx.end)/700);withA(ctx,a,()=>L2.end.ls.forEach((l,i)=>T(ctx,l,L2.lw/2,L2.end.y+L2.end.z+i*L2.end.z*1.25,{w:700,size:L2.end.z,align:"center",color:rgbaS(mixC(col,K.ink,0.35),1)})));}};
  return{lay,draw,show:i=>{if(i<its.length)S.fx.end=0;else if(!S.fx.end)S.fx.end=performance.now();}};}

// 1 · How far, task by task: the four steps, then a person's decisions; the head is the agent
PIC.far=(Lb,S)=>rows(Lb,S,{col:k=>k==="none"?K.biz:K.ai,icon:(ctx,x,y,c,now,k)=>k==="none"?IC.person(ctx,x,y,c):IC.steps(ctx,x,y,c,["inform","draft","verify","run"].indexOf(k)),
  mark:(ctx,x,y,now)=>orb(ctx,x,y,8,now)});
// 2 · Shared, or its own: each agent's own, the platform's, and what has no place any more, struck out; the head is the six agents
PIC.platform=(Lb,S)=>rows(Lb,S,{col:k=>k==="own"?K.lay[4]:k==="platform"?K.lay[5]:K.red,icon:(ctx,x,y,c,now,k)=>k==="own"?IC.agent(ctx,x,y,c,now):k==="platform"?IC.service(ctx,x,y,c):IC.gone(ctx,x,y,c),
  look:it=>it.b==="gone"?"struck":"",mark:(ctx,x,y,now)=>{for(let j=0;j<3;j++)orb(ctx,x-7+j*7,y+(j%2?-5:5),4.6,now+j*400);}});
// 3 · Fill the chat's place: its place, the holder's own sign-in, a small tool's yes or no, and never; each row in its level's colour
PIC.place=(Lb,S)=>rows(Lb,S,{col:k=>k==="place"?K.lv.public:k==="signin"?K.lv.confidential:k==="tool"?K.biz:K.lv.restricted,
  icon:(ctx,x,y,c,now,k)=>(k==="place"?IC.place:k==="signin"?IC.key:k==="tool"?IC.tool:IC.lock)(ctx,x,y,c),mark:(ctx,x,y,now)=>orb(ctx,x,y,8,now)});
// 4 · Draft, ask, confirm: the map agent, Tomás and the owners; the head is a draft on paper
PIC.confirm=(Lb,S)=>rows(Lb,S,{col:k=>k==="agent"?K.ai:k==="tomas"?K.tech:K.biz,icon:(ctx,x,y,c,now,k)=>k==="agent"?IC.agent(ctx,x,y,c,now):k==="tomas"?IC.person(ctx,x,y,c):IC.tag(ctx,x,y,c),
  mark:(ctx,x,y)=>paper(ctx,x-11,y-14,22,28,"",K.paper,{rot:-0.06})});
// 5 · Run the map's checks: each check that stops a change, and what passes; the head is a brick stamped on its edge
PIC.checks=(Lb,S)=>rows(Lb,S,{col:k=>k==="pass"?K.good:K.brick,icon:(ctx,x,y,c,now,k)=>k==="pass"?IC.ok(ctx,x,y):IC.no(ctx,x,y),
  mark:(ctx,x,y)=>{if(typeof bab_brick==="function"){ctx.save();ctx.translate(x,y);ctx.scale(0.42,0.42);bab_brick(ctx,0,0,56,{stamp:1});ctx.restore();}else{ctx.fillStyle=rgbaS(K.brick,1);rr(ctx,x-12,y-7,24,14,2);ctx.fill();}}});
// 6 · Who keeps it, and when: a row for each beat of the map's rhythm, from every change to every year (the checks' tick, a person
// leaving, a month, an agent tested, an owner's tag); the head is the map as a tower of glass, its tiers its layers
PIC.keep=(Lb,S)=>rows(Lb,S,{col:k=>k==="change"?K.good:k==="leaves"?K.ret:k==="month"?K.ai:k==="quarter"?K.tech:K.biz,
  icon:(ctx,x,y,c,now,k)=>k==="change"?IC.ok(ctx,x,y):k==="leaves"?IC.person(ctx,x,y,c):k==="month"?IC.cal(ctx,x,y,c):k==="quarter"?IC.agent(ctx,x,y,c,now):IC.tag(ctx,x,y,c),
  mark:(ctx,x,y)=>{for(let i=0;i<4;i++){const bw=24-i*5;glass(ctx,x-bw/2,y+6-i*6,bw,5,2,K.lay[5-i],{glow:3,ea:0.85,fill:"rgba(7,12,24,0.94)"});}}});

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"aca-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","aca-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):h("p",{class:"aca-coming"},h("b",null,U.coming)," "+U.comingNote);
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"aca-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"aca-tab-"+Lb.id,"aria-controls":"aca-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
  // the rail is one stop for the keyboard: arrows move along it, Home and End go to its ends
  rail.addEventListener("keydown",e=>{const bs=[...rail.children],k=bs.indexOf(document.activeElement);if(k<0)return;let j=null;
    if(e.key==="ArrowRight"||e.key==="ArrowDown")j=(k+1)%bs.length;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")j=(k-1+bs.length)%bs.length;else if(e.key==="Home")j=0;else if(e.key==="End")j=bs.length-1;
    if(j==null)return;e.preventDefault();bs[j].focus();show(bs[j].dataset.id);});
  app.append(rail,panel);show((location.hash||"").slice(1));
  window.addEventListener("hashchange",()=>{const id=(location.hash||"").slice(1);if(L.labs.some(x=>x.id===id))show(id,true);});}

/* ---------- the scenarios page: the series' evaluation ---------- */
// Situations from every film, or from one (#film-3); each answer explains why and points back to its lab. The options show in the
// order the words write them, where the words spread the right ones. Answers are kept by the scenario's number (film × 10 + its
// place), so a new situation never takes over an old answer; a saved pick that no longer gives its saved result is asked again.
const VIS={};
if(app.id==="series-quiz"){app.textContent="";const QS=L.qs,ans=get("quiz",{})||{};let film=0,cur=0;
  const films=[...new Set(QS.map(q=>q.film))].sort((a,b)=>a-b);
  const sel=h("select",{id:"aca-pick"},h("option",{value:"0"},U.allFilms),...films.map(n=>h("option",{value:String(n)},filmN(n)+(filmName(n)?" · "+filmName(n):""))));
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");bar.append(dots,score);
  app.append(h("div",{class:"quiz"},h("p",{class:"aca-filter"},h("label",{for:"aca-pick"},U.filter),sel),bar,card));
  const list=()=>QS.filter(q=>!film||q.film===film),labOf=id=>L.labs.find(x=>x.id===id)||{name:"",c:"#a0b2cd"};
  // forget a saved answer whose option no longer gives the result it was saved with
  QS.forEach(q=>{const a=ans[q.n];if(a&&(a.pick==null||!q.opts[a.pick]||!!q.opts[a.pick].ok!==!!a.ok))delete ans[q.n];});
  function paintBar(){const Q=list();dots.replaceChildren(...Q.map((q,i)=>{const a=ans[q.n];return h("button",{type:"button",class:a?(a.ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1)+(a?" · "+(a.ok?U.right:U.notQuite):""),onclick:()=>{cur=i;render(true);}},String(i+1));}));
    const n=Q.filter(q=>ans[q.n]).length,ok=Q.filter(q=>ans[q.n]&&ans[q.n].ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+n+" "+U.answered+" · "+(Q.length-n)+" "+U.toGo));}
  function done(q,ok,pick){ans[q.n]={ok,pick};put("quiz",ans);paintBar();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why));
  function foot(q){const Q=list(),last=cur===Q.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:"../labs/#"+q.lab},U.explore+" "+labOf(q.lab).name),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results(true);else{cur+=1;render(true);}}},last?U.results:U.nextQ));}
  function render(focus){paintBar();const Q=list(),q=Q[cur];if(!q)return;const f=VIS[q.vis.k],a=ans[q.n],body=h("div",{class:"qbody"}),out=h("div"),S={done:a?performance.now()-1e5:0};
    const vis=DRAW&&f?stage(lw=>({lw,h:Math.round(f.h?f.h(lw,q):cl(lw*0.56,190,300))}),(ctx,o,now)=>f(ctx,o,now,q,S),(L.pics.alt&&L.pics.alt[q.vis.alt||q.vis.k])||q.title):null;
    const F=FILMS[q.film]||{};body.append(h("p",{class:"qtag",style:"--c:"+labOf(q.lab).c},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+Q.length+" · "+filmN(q.film)+(F.t?", "+F.t:"")),h("h3",{tabindex:"-1"},q.title),h("p",{class:"qsit"},q.sit));
    const fin=(ok,pick)=>{if(!a)done(q,ok,pick);S.done=performance.now();if(vis)vis.kick(1600);out.replaceChildren(feed(ok,q),foot(q));};
    const O=q.opts,bx=h("div",{class:"qopts"});
    O.forEach((o,j)=>bx.append(h("button",{type:"button",class:"qopt","data-j":j,onclick:()=>pick(j)},h("span",{class:"k"},"ABCDE"[j]),h("span",null,o.t))));
    function pick(j,quiet){[...bx.children].forEach(b=>{const k=+b.dataset.j;b.disabled=true;if(O[k].ok)b.classList.add("ok");});const o=O[j],b=bx.querySelector('[data-j="'+j+'"]');
      if(!o.ok){b.classList.add("no");if(o.why)b.append(h("small",null,o.why));}fin(!!o.ok,j);if(!quiet)focusIn(out.querySelector(".btn"));}
    body.append(bx);if(a&&a.pick!=null&&O[a.pick])pick(a.pick,true);
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis"},vis?vis.el:null),body));if(focus){const t=body.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}card.scrollIntoView({block:"nearest",behavior:RM()?"auto":"smooth"});}}
  function results(focus){paintBar();const Q=list(),ok=Q.filter(q=>ans[q.n]&&ans[q.n].ok).length,n=Q.length,band=L.done[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};Q.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(ans[q.n]&&ans[q.n].ok)by[k].ok++;});const open=QS.filter(q=>!ans[q.n]).length;
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/Math.max(1,n)*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",{tabindex:"-1"},band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:"../labs/#"+k,class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+labOf(k).c},h("i"),labOf(k).name+" · "+by[k].ok+"/"+by[k].n))),
      film&&open?h("p",{class:"aca-open"},h("a",{href:"#",onclick:e=>{e.preventDefault();setFilm(0);}},fill(U.stillOpen,{n:open}))):null,
      h("button",{type:"button",class:"btn",onclick:()=>{Q.forEach(q=>delete ans[q.n]);put("quiz",ans);cur=0;render(true);}},U.again))));
    if(focus){const t=card.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}}}
  function setFilm(n,keepHash){film=films.includes(n)?n:0;sel.value=String(film);app.dataset.film=String(film);if(!keepHash&&history.replaceState)history.replaceState(null,"",film?"#film-"+film:location.pathname+location.search);
    const Q=list(),first=Q.findIndex(q=>!ans[q.n]);if(first<0)results(false);else{cur=first;render(false);}}
  sel.addEventListener("change",()=>setFilm(+sel.value));
  const fromHash=()=>{const m=(location.hash||"").match(/^#film-(\d+)$/);return m?+m[1]:0;};
  // the first one waits for the rest of this file, where the pictures are
  window.addEventListener("hashchange",()=>setFilm(fromHash(),true));Promise.resolve().then(()=>setFilm(fromHash(),true));}

/* ---------- the scenarios' pictures ---------- */
// Each draws the situation, not its answer; once it's answered (S.done), some show how it ends. Their words are in L.pics.
const PK=L.pics,after=(now,S,ms)=>S.done?eo(since(now,S.done)/(ms||700)):0;
// a title at the top left of a picture
const ttl=(ctx,o,s,c)=>line1(ctx,s,14,24,o.lw-28,14,{w:800,color:rgbaS(c,1)});
// 1 · an agent on the map: its role and identity, the four steps, and the person who answers. vis.own: the identity it doesn't have
// yet, given once it's answered; vis.ghost: the agent nobody drew, drawn once it's answered; vis.hand: a hand-off to a person, which
// comes once it's answered
VIS.role=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.ai);const P2=PK.role,v=q.vis,m=14,a=after(now,S),w=o.lw-m*2;ttl(ctx,o,P2.title,K.ai);
  const cx=m+Math.min(64,w*0.2),cy=Math.round(o.h*0.44),r=Math.min(22,o.h*0.09);orb(ctx,cx,cy,r,now,{ghost:v.ghost?1-a:0});
  const tx=cx+r+16,tw_=Math.min(w-(tx-m)-(v.hand?80:0),230);
  [[P2.role,K.lay[4]],[P2.id,K.ai]].forEach(([s,c],i)=>{const own=v.own&&i===1,faint=v.ghost||own;
    chip(ctx,tx,cy-37+i*38,tw_,32,s,c,{size:13,dash:faint&&a<1,a:faint?0.35+0.65*a:1,mark:own&&a>=1?"ok":null});});
  // the four steps, rising, along the foot
  const sw=(w-3*8)/4,base=o.h-14;P2.steps.forEach((s,i)=>{const sh=18+i*9,x=m+i*(sw+8);
    glass(ctx,x,base-sh,sw,sh,8,K.ai,{glow:4,ea:0.5,fill:"rgba(6,14,20,0.92)"});ctx.fillStyle=rgbaS(K.ai,0.06);rr(ctx,x,base-sh,sw,sh,8);ctx.fill();
    line1(ctx,s,x+4,base-6,sw-8,12.5,{w:800,align:"center",color:rgbaS(mixC(K.ai,K.ink,0.25),1)});});
  // a person, at the right, who takes the task over
  if(v.hand){const x=o.lw-m-38,y=cy;withA(ctx,a,()=>{arrow(ctx,tx+tw_+5,y,x-13,y,K.biz,1,{dash:[5,4]});IC.person(ctx,x,y,K.biz);
    line1(ctx,P2.person,x-38,y+28,76,12.5,{w:700,align:"center",color:rgbaS(K.biz,1)});});}};
VIS.role.h=lw=>cl(lw*0.6,210,300);
// 2 · the platform: the agents above, the gateway, the models below. vis.round: one call that goes round the gateway; vis.log: the
// gateway's log of calls, under the models; vis.retire: one model struck out, and the agents that call it found
const LOGH=72;
VIS.gate=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[5]);const P2=PK.gate,v=q.vis,m=14,a=after(now,S,900),w=o.lw-m*2,hb=o.h-(v.log?LOGH:0);ttl(ctx,o,P2.title,K.lay[5]);
  const n=6,ay=52,gy=Math.round(hb*0.55),my=hb-34,ax=i=>m+w*(i+0.5)/n;
  for(let i=0;i<n;i++)orb(ctx,ax(i),ay+8,Math.min(11,w/n*0.2),now+i*300,{warn:v.retire&&[1,3,4].includes(i)?a:0});
  // the gateway: one door that every call goes through
  const gw=Math.min(180,w*0.5),gx=o.lw/2-gw/2;glass(ctx,gx,gy-16,gw,32,16,K.lay[5],{glow:10,ea:0.9,fill:"rgba(7,12,24,0.95)"});line1(ctx,P2.gateway,gx+10,gy+5,gw-20,13,{w:800,align:"center",color:rgbaS(K.lay[5],1)});
  for(let i=0;i<n;i++){const x=ax(i),round=v.round&&i===n-1;ctx.save();ctx.strokeStyle=rgbaS(round?K.bad:K.soft,round?0.95:0.45);ctx.lineWidth=1.4;if(round)ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.moveTo(x,ay+22);if(round){ctx.lineTo(x,my-14);}else{ctx.lineTo(lp(gx+16,gx+gw-16,i/(n-1)),gy-16);}ctx.stroke();ctx.restore();}
  const mw=Math.min(100,(w-16)/3);[0,1,2].forEach(j=>{const x=o.lw/2+(j-1)*(mw+8)-mw/2,gone=v.retire&&j===1;chip(ctx,x,my-14,mw,28,P2.models[j],K.lay[5],{size:12.5,strike:gone&&a>0.5,a:gone?1-0.5*a:1});
    ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.45);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(o.lw/2+(j-1)*20,gy+16);ctx.lineTo(x+mw/2,my-14);ctx.stroke();ctx.restore();});
  // the log, under the models: a line for every call, which agent, which model, when; it comes up once it's answered
  if(v.log){const lw_=Math.min(300,w),x=o.lw/2-lw_/2,y=hb-2;withA(ctx,0.45+0.55*a,()=>{paper(ctx,x,y,lw_,LOGH-14,"",K.paper,{rot:0.01});
    P2.log.forEach((s,r)=>line1(ctx,s,x+12,y+18+r*16,lw_-24,12,{w:700,color:rgbaS(K.inkd,0.9)}));});}};
VIS.gate.h=(lw,q)=>cl(lw*0.66,220,320)+(q&&q.vis.log?LOGH:0);
// 3 · the chat's place: what it may read inside, by level, and what stays outside, each behind its lock. vis.hi: the thing the
// situation is about, at the door below until it's answered, then where it ends (vis.to): in its place, with a tick ("in"), on the
// place of the product it updates (vis.at) or under the rest; under the last thing outside, with a key, read on its holder's own
// sign-in ("sign-in"); or struck out where it stands, never made ("out"). vis.lv: its level
const PLC={by:40,top:50,row:32};
VIS.place=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lv.public);const P2=PK.place,v=q.vis,m=14,a=after(now,S,900),w=o.lw-m*2;ttl(ctx,o,P2.title,K.lv.public);
  const ni=P2.inside.length,no=P2.outside.length,bx=m,by=PLC.by,bw=Math.round(w*0.56),bh=PLC.top+4+(ni+1)*PLC.row,ox=bx+bw+10,ow=o.lw-m-ox,iy=i=>by+PLC.top+i*PLC.row;
  glass(ctx,bx,by,bw,bh,14,K.lv.public,{glow:8,ea:0.8,fill:"rgba(7,12,24,0.9)"});orb(ctx,bx+20,by+22,10,now);
  // what's in it, in words beside the chat: on one line, or two
  const[ls,z]=fitL(ctx,P2.its,bw-48,12.5,2);ls.forEach((l,i)=>T(ctx,l,bx+38,by+(ls.length>1?20:27)+i*z*1.15,{w:800,size:z,color:rgbaS(K.lv.public,1)}));
  const land=v.hi&&v.to==="in"&&v.at!=null?v.at:-1;
  P2.inside.forEach(([s,lv],i)=>chip(ctx,bx+10,iy(i),bw-20,26,s,K.lv[lv],{size:12.5,max:1,a:i===land?1-a:1}));
  P2.outside.forEach(([s,lv],i)=>chip(ctx,ox,by+6+i*42,ow,34,s,K.lv[lv],{size:12,max:2,dash:1,tint:0.05,badge:[IC.lock,K.lv[lv]]}));
  if(!v.hi)return;const to=v.to,c=K.lv[v.lv||"public"],dw=Math.min(w,220),A=[o.lw/2-dw/2,by+bh+10,dw,34],B=to==="in"?[bx+10,iy(land>=0?land:ni),bw-20,26]:to==="sign-in"?[ox,by+6+no*42,ow,34]:A,
    k=to==="out"?0:a,x=lp(A[0],B[0],k),y=lp(A[1],B[1],k),cw=lp(A[2],B[2],k),ch=lp(A[3],B[3],k),end=a>=0.999;
  // what lands in the place keeps to one line, as the chips there do; what's read on a sign-in shows its key once it's there
  chip(ctx,x,y,cw,ch,v.hi,c,{size:12.5,max:to==="in"?1:2,glow:14,dash:!S.done||to==="sign-in",strike:to==="out"&&a>0.4,
    badge:to==="sign-in"?[IC.key,c,end?1:0]:null,mark:end?(to==="in"?"ok":to==="out"?"no":null):null});};
VIS.place.h=()=>PLC.by+PLC.top+4+4*PLC.row+10+34+14;
// 4 · a first draft: elements on paper, each with its source and its owner. vis.hi: the line the situation is about; vis.guess: that
// line is the agent's own guess; vis.join: two sources joined in one step, struck out once it's answered. On a wide picture each
// line has its owner in a column at the right; on a narrow one, under its source, beside an owner's tag
const DRW=420,DRH=50;
VIS.draft=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.biz);const P2=PK.draft,v=q.vis,m=12,a=after(now,S);sheet(ctx,m,10,o.lw-m*2,o.h-20,{rot:-0.004,plain:true});
  const ink=c=>"rgba(48,44,50,"+c+")";line1(ctx,P2.title,m+14,34,o.lw-m*2-28,14,{w:800,color:ink(0.9)});
  const rw=o.lw-m*2-28,wide=o.lw>=DRW,rh=wide?Math.min(40,(o.h-70)/P2.rows.length-6):DRH,nw=wide?rw*0.62-12:rw-16;
  P2.rows.forEach(([nm,src,own],i)=>{const y=50+i*(rh+6),x=m+14,hi=v.hi===i,guess=hi&&v.guess,join=hi&&v.join,y1=wide?y+rh*0.42:y+16;
    ctx.save();ctx.fillStyle=hi?"rgba(255,209,102,0.28)":"rgba(0,0,0,0.04)";rr(ctx,x,y,rw,rh,6);ctx.fill();ctx.restore();
    line1(ctx,nm,x+8,y1,nw,12.5,{w:800,color:ink(0.92)});line1(ctx,(guess?P2.guess:src),x+8,y1+14,nw,11.5,{w:700,color:guess?"rgba(170,60,20,0.95)":ink(0.62)});
    if(wide){const tx=x+rw*0.64,tw2=rw*0.36-6;ctx.save();ctx.strokeStyle=ink(0.5);ctx.lineWidth=1.2;ctx.setLineDash([4,3]);rr(ctx,tx,y+5,tw2,rh-10,6);ctx.stroke();ctx.restore();
      line1(ctx,own,tx+6,y+rh/2+4.5,tw2-12,12,{w:700,align:"center",color:ink(0.8)});}
    else{IC.tag(ctx,x+16,y1+24,[110,96,84]);line1(ctx,own,x+30,y1+28.5,nw-22,11.5,{w:700,color:ink(0.8)});}
    if(join&&a>0)withA(ctx,a,()=>{ctx.save();ctx.strokeStyle="rgba(190,40,30,0.95)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x+4,y1-4);ctx.lineTo(x+4+(Math.min(nw,TW(ctx,nm,12.5,800))+8)*eo(a),y1-4);ctx.stroke();ctx.restore();});});};
VIS.draft.h=lw=>lw>=DRW?cl(lw*0.62,240,300):50+4*(DRH+6)+14;
// 5 · the map's checks, each with its last runs: vis.fail, the check that stops the change; vis.agent, the map agent's own test, which
// runs again on its new model once it's answered; vis.estate, the map beside what really runs, with a reader nobody drew
VIS.checks=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.brick);const P2=PK.checks,v=q.vis,m=14,a=after(now,S),w=o.lw-m*2;
  if(v.estate){ttl(ctx,o,P2.estate,K.brick);const pw=(w-12)/2,y0=44,ph=o.h-y0-14;[[P2.map,K.lay[4],0],[P2.running,K.brick,1]].forEach(([s,c,j])=>{const x=m+j*(pw+12);
      glass(ctx,x,y0,pw,ph,12,c,{glow:6,ea:0.7,fill:"rgba(7,12,24,0.92)"});lines(ctx,s,x+10,y0+20,pw-(j?44:20),{size:12.5,max:2,w:800,color:rgbaS(c,1)});
      const tw2=Math.min(pw-24,120),cx=x+pw/2,ty=y0+ph-40;chip(ctx,cx-tw2/2,ty,tw2,28,P2.table,c,{size:12.5});
      // what really runs has a reader the map never drew
      if(j===1){const rw=Math.min(pw-20,130),ry=y0+48;ctx.save();ctx.strokeStyle=rgbaS(K.bad,0.9);ctx.setLineDash([4,3]);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx,ry+34);ctx.lineTo(cx,ty);ctx.stroke();ctx.restore();
        chip(ctx,cx-rw/2,ry,rw,34,P2.reader,K.bad,{size:12,max:2,dash:1});orb(ctx,x+pw-18,y0+18,8,now);}});
    return;}
  if(v.agent){ttl(ctx,o,P2.agent,K.ai);const cy=74;orb(ctx,m+22,cy,14,now);chip(ctx,m+48,cy-18,w-48,36,P2.test,K.ai,{size:12.5,max:2});
    // its runs, oldest at the left, each a pass; then the new model, and the run it needs before anyone relies on its walks
    const ry=Math.round(lp(150,o.h-40,0.5)),n=7,gx=(w-40)/(n+1),x0=m+20,lx=x0+gx*(n-0.5),xn=x0+gx*n;
    ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.5);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x0,ry);ctx.lineTo(xn,ry);ctx.stroke();ctx.restore();
    for(let r=0;r<n;r++){ctx.fillStyle=rgbaS(K.good,0.85);ctx.beginPath();ctx.arc(x0+gx*r,ry,5,0,TP);ctx.fill();}
    ctx.save();ctx.setLineDash([4,3]);ctx.strokeStyle=rgbaS(K.gold,0.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(lx,ry-28);ctx.lineTo(lx,ry+16);ctx.stroke();ctx.restore();
    pill(ctx,lx,ry-54,P2.model,K.gold,{size:12.5,align:"center"});
    ctx.save();ctx.strokeStyle=rgbaS(a>0?K.good:K.soft,1);ctx.lineWidth=2;ctx.beginPath();ctx.arc(xn,ry,8,0,TP);ctx.stroke();ctx.restore();
    if(a>0)withA(ctx,a,()=>{ctx.fillStyle=rgbaS(K.good,1);ctx.beginPath();ctx.arc(xn,ry,8*sp(a),0,TP);ctx.fill();});
    return;}
  ttl(ctx,o,P2.title,K.brick);const n=P2.rows.length,rh=Math.min(30,(o.h-50)/n-5);P2.rows.forEach((s,i)=>{const y=42+i*(rh+5),bad=v.fail===i;
    glass(ctx,m,y,w,rh,8,bad?K.bad:K.brick,{glow:bad?12:3,ea:bad?0.9:0.6,fill:"rgba(7,12,24,0.92)"});line1(ctx,s,m+10,y+rh/2+4.5,w-100,12.5,{w:700,color:rgbaS(K.ink,0.92)});
    // its last runs, newest at the right: green for a pass, red where it stopped a change; the failing check's newest run is red
    for(let r=0;r<6;r++){const x=o.lw-m-12-r*13,fail=bad&&r===0||r>0&&(i*7+r*3+5)%11===0;ctx.fillStyle=rgbaS(fail?K.bad:K.good,0.85);ctx.beginPath();ctx.arc(x,y+rh/2,4,0,TP);ctx.fill();}});};
VIS.checks.h=lw=>cl(lw*0.6,220,300);
// 6 · keeping the map. vis.copy: an agent's instructions with a copy pasted in, beside where the things it copies are kept; once it's
// answered, the copy is struck out and the agent reads them where they're kept, through a tool. vis.project: a timeline, the map's
// distance from what's running brought down by a project that ends, and after it, drift again, or, once it's answered, a rhythm that
// keeps it down. vis.read: the map of billing beside what's running there, with a step the map doesn't show; once it's answered, a
// change drafted on the map's side, for its owner to confirm
VIS.keep=(ctx,o,now,q,S)=>{const P2=PK.keep,v=q.vis,m=14,a=after(now,S,900),w=o.lw-m*2;
  if(v.copy){ground(ctx,o.lw,o.h,K.ai);ttl(ctx,o,P2.copyT,K.ai);
    const iw=Math.round(Math.min(w*0.52,250)),ix=m,iy=44,ih=o.h-iy-14,kx=ix+iw+44,kw=o.lw-m-kx;
    glass(ctx,ix,iy,iw,ih,12,K.ai,{glow:6,ea:0.7,fill:"rgba(7,12,24,0.92)"});orb(ctx,ix+19,iy+21,9,now);
    const th=lines(ctx,P2.instr,ix+36,iy+25,iw-46,{size:12.5,max:2,w:800,color:rgbaS(K.ai,1)}),py=iy+Math.max(42,th+22);
    // the copy pasted on top: grey paper, struck out once it's answered
    paper(ctx,ix+12,py,iw-24,iy+ih-py-12,P2.pasted,[206,204,198],{rot:-0.03,size:12.5,max:4,strike:a>0.6});
    // where they're kept, at the right, each on a card; once it's answered, read through a tool as the agent answers
    P2.kept.forEach((s,i)=>chip(ctx,kx,iy+6+i*46,kw,36,s,K.biz,{size:12.5}));
    const ly=iy+6+P2.kept.length*46+14;withA(ctx,1-a,()=>lines(ctx,P2.where,kx,ly,kw,{size:12,max:2,color:rgbaS(K.soft,1)}));
    if(a>0)withA(ctx,a,()=>{const tx=ix+iw+22,ty=iy+6+18;ctx.save();ctx.strokeStyle=rgbaS(K.ai,1);ctx.lineWidth=2;ctx.beginPath();ctx.arc(tx,ty,9,0,TP);ctx.stroke();ctx.restore();IC.key(ctx,tx-1,ty,K.ai);
      arrow(ctx,kx-3,ty,tx+12,ty,K.ai,1,{dash:[4,3],lw:1.6,head:6});arrow(ctx,tx-12,ty,ix+iw-3,ty,K.ai,1,{dash:[4,3],lw:1.6,head:6});
      lines(ctx,P2.tool,kx,ly,kw,{size:12,max:3,color:rgbaS(K.ai,1)});});
    return;}
  if(v.project){ground(ctx,o.lw,o.h,K.biz);ttl(ctx,o,P2.projT,K.biz);
    const x0=m+6,x1=o.lw-m-6,base=o.h-42,top=96,pe=lp(x0,x1,0.42);
    lines(ctx,P2.drift,x0,48,w-12,{size:12,max:2,color:rgbaS(K.soft,1)});
    ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.5);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x0,base);ctx.lineTo(x1,base);ctx.stroke();ctx.restore();
    // the project, along the foot from its start to its end date
    chip(ctx,x0,base+5,pe-x0,34,P2.project,K.biz,{size:12.5,max:2});
    ctx.save();ctx.setLineDash([4,3]);ctx.strokeStyle=rgbaS(K.gold,0.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(pe,top-10);ctx.lineTo(pe,base);ctx.stroke();ctx.restore();
    pill(ctx,pe+6,top-12,P2.ends,K.gold,{size:12});
    // the map's distance from what's running: high where it had drifted, brought down by the project
    const curve=(u0,u1,f,col,dash)=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=2.4;ctx.lineCap="round";if(dash)ctx.setLineDash(dash);ctx.beginPath();
      for(let i=0;i<=40;i++){const u=lp(u0,u1,i/40),x=lp(x0,x1,u),y=f(u);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.restore();};
    curve(0,0.42,u=>lp(top+4,base-10,eo(u/0.42)),K.biz);
    // after it: drifting again, until it's answered; then a rhythm that keeps it down, its beats along the way
    withA(ctx,1-a,()=>{curve(0.42,1,u=>lp(base-10,top+18,0.9*eo((u-0.42)/0.58)),K.bad,[5,4]);line1(ctx,P2.after,pe+12,top+40,x1-pe-12,13,{w:800,align:"right",color:rgbaS(K.bad,1)});});
    if(a>0)withA(ctx,a,()=>{curve(0.42,1,()=>base-10,K.good);for(let i=0;i<8;i++){const x=lp(pe+14,x1-4,i/7);ctx.fillStyle=rgbaS(K.good,1);ctx.beginPath();ctx.arc(x,base-10,3.6,0,TP);ctx.fill();}
      lines(ctx,P2.rhythm,pe+12,top+24,x1-pe-12,{size:12,max:3,color:rgbaS(K.good,1)});});
    return;}
  // vis.read
  ground(ctx,o.lw,o.h,K.ai);ttl(ctx,o,P2.readT,K.ai);
  const pw=(w-12)/2,y0=44,rh=32,gap=6,ph=o.h-y0-14,tl=[P2.map,P2.running].map(s=>fitL(ctx,s,pw-20,12.5,2)),
    ty=y0+14+Math.max(...tl.map(f=>f[0].length*f[1]*1.2))+6,cols=[K.lay[4],K.ai];
  [P2.map,P2.running].forEach((s,j)=>{const x=m+j*(pw+12),c=cols[j];glass(ctx,x,y0,pw,ph,12,c,{glow:6,ea:0.7,fill:"rgba(7,12,24,0.92)"});
    lines(ctx,s,x+10,y0+22,pw-20,{size:12.5,max:2,w:800,color:rgbaS(c,1)});
    P2.rows.forEach((r,i)=>chip(ctx,x+8,ty+i*(rh+gap),pw-16,rh,r,c,{size:12,max:2,tint:0.08}));
    // what's running has a step the map doesn't show, and the map agent reading it
    if(j===1){chip(ctx,x+8,ty+3*(rh+gap),pw-16,rh+8,P2.step,K.gold,{size:12,max:2,dash:1});orb(ctx,x+pw-14,y0+ph-14,7,now);}});
  // once it's answered: a change drafted on the map's side, for its owner to confirm
  if(a>0)withA(ctx,a,()=>{const x=m+8,y=ty+3*(rh+gap),cw=pw-16;paper(ctx,x,y,cw,rh+8,P2.draft,K.notes[0],{size:12,rot:-0.02});
    arrow(ctx,m+pw+12+6,y+(rh+8)/2,x+cw+5,y+(rh+8)/2,K.gold,1,{dash:[4,3],lw:1.6,head:6});
    lines(ctx,P2.confirm,x,y+rh+8+16,cw,{size:12,max:2,color:rgbaS(K.biz,1)});});};
VIS.keep.h=(lw,q)=>q&&q.vis.read?cl(lw*0.74,300,340):cl(lw*0.66,260,300);
})();
