/* Learning Data: Platform and solution architecture. The labs (Take it apart) and the scenarios (Make the call) of the whole series,
   from one engine: the series' labs page and scenarios page load a film's bundle (for the films' own parts: glass, paper,
   ArchiMate's glyphs and the series' own), the words (learn.en.js or learn.es.js, which set window.PSA), and this file.
   Every lab is a playground (kind "play"), one for each film, as the author set on 18 November 2026: the visitor switches, picks,
   steps and presses, and watches what happens; each playground has three to five experiments (w.goals), each ticked when the
   visitor makes it happen, and its end once all are ticked. Each playground's own rules are in PLAY below, its words in the pack.
   The play kit is Data that moves' (assets/data-that-moves/learn.js); the drawing parts are Data architecture's, The map before the
   data's before it.
   The scenarios are the series' evaluation, twelve choices, their options shown in the order the words give them, where the right
   answers are spread (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its
   words stay big enough to read on a phone. Things move and settle, or jump to where they end when the visitor asks for reduced
   motion, and every change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films: by
   number, each film's title, page and chapter starts), both from site-tools/build_series.py.
   Progress stays in this browser: "visited" (the lab ids), "goals" (each playground's ticked experiments) and "quiz" (answers by
   scenario number); path.js paints the course bar. */
(()=>{"use strict";
const L=window.PSA,app=document.getElementById("series-labs")||document.getElementById("series-quiz");if(!L||!app)return;
const U=L.ui,P=app.dataset.store||"ld-platform-and-solution-architecture";
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
const filmName=n=>(FILMS[n]||{}).t||"",NF=Object.keys(FILMS).length||8,filmN=n=>fill(U.filmN,{n,of:NF});
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
const MISS=window.PSA_MISS=new Set();
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
// two lines as even as they can be at size z in a width, so words break as one reads them ("each night, / open format", not
// "each night, open / format"); null where they won't go in two. Remembered, since pictures repaint while they move
const EV=new Map();
function even2(ctx,s,w,z,wt){const key=s+"|"+Math.round(w)+"|"+z+"|"+(wt||700);if(EV.has(key))return EV.get(key);let lo=w/2,hi=w;
  for(let k=0;k<12;k++){const mid=(lo+hi)/2;if(LN(ctx,s,mid,z,wt).length<=2)hi=mid;else lo=mid;}
  let ls=LN(ctx,s,hi,z,wt);if(ls.length!==2||!ls.every(l=>TW(ctx,l,z,wt)<=w+0.5))ls=null;if(EV.size>2000)EV.clear();EV.set(key,ls);return ls;}
// lines() for a label: where they take two lines, two as even as they can be at the same size; one line, or three, as lines() draws them
function linesB(ctx,s,x,y,w,o){o=o||{};const f=fitL(ctx,s,w,o.size||13,o.max||3,o.w,true),ls=!f.miss&&f[0].length===2?even2(ctx,s,w,f[1],o.w):null;
  if(!ls)return lines(ctx,s,x,y,w,o);const z=f[1],lh=z*1.2;
  ls.forEach((l,i)=>T(ctx,l,o.align==="center"?x+w/2:x,y+i*lh,{w:o.w||700,size:z,align:o.align,color:o.color}));return 2*lh;}
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
function paper(ctx,x,y,w,hh,label,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const f=fitL(ctx,label,w-12,o.size||13,o.max||2),z=f[1],ls=f[0].length===2&&!f.miss&&even2(ctx,String(label),w-12,z,700)||f[0],lh=z*1.2,rot=o.rot==null?(hs(strH(label))-0.5)*0.06:o.rot;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+hh/2);ctx.rotate(rot);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=8;ctx.shadowOffsetY=3;ctx.fillStyle=rgbaS(col||K.notes[0],1);ctx.fillRect(-w/2,-hh/2,w,hh);
    ctx.shadowBlur=0;ctx.shadowOffsetY=0;const g=ctx.createLinearGradient(0,-hh/2,0,hh/2);g.addColorStop(0,"rgba(0,0,0,0.07)");g.addColorStop(0.3,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(255,255,255,0.12)");ctx.fillStyle=g;ctx.fillRect(-w/2,-hh/2,w,hh);
    if(o.edge){ctx.strokeStyle=rgbaS(o.edge,1);ctx.lineWidth=2.4;ctx.strokeRect(-w/2+1.2,-hh/2+1.2,w-2.4,hh-2.4);}
    const y0=-(ls.length-1)*lh/2+z*0.36;ls.forEach((l,i)=>T(ctx,l,0,y0+i*lh,{w:700,size:z,align:"center",color:rgbaS(K.inkd,0.94)}));
    // struck out: a line through each line of its words
    if(o.strike){ctx.strokeStyle="rgba(190,40,30,0.95)";ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ls.forEach((l,i)=>{const hw=Math.min(w/2-5,TW(ctx,l,z,700)/2+4),yy=y0+i*lh-z*0.3;ctx.moveTo(-hw,yy+1.5);ctx.lineTo(hw,yy-1.5);});ctx.stroke();}ctx.restore();
    if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
// ArchiMate's glyphs: the films' own (archGlyph), and those the films never drew: a requirement and a constraint (parallelograms),
// an interaction (two half circles) and a collaboration (two circles that overlap)
function glyph(ctx,kind,x,y,s,col){if(/^(service|interface|software|artifact)$/.test(kind)&&typeof psaGlyph==="function")return psaGlyph(ctx,kind,x,y,s,col);
  // a product, as ArchiMate draws it: a box with a tab along its top left
  if(kind==="product"){ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.strokeRect(x-s*0.75,y-s*0.55,s*1.5,s*1.1);
    ctx.beginPath();ctx.moveTo(x-s*0.75,y-s*0.2);ctx.lineTo(x-s*0.05,y-s*0.2);ctx.lineTo(x-s*0.05,y-s*0.55);ctx.stroke();ctx.restore();return;}
  if(!/^(requirement|constraint|interaction|collaboration)$/.test(kind))return archGlyph(ctx,kind,x,y,s,col);
  ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";
  if(kind==="requirement"||kind==="constraint"){ctx.beginPath();ctx.moveTo(x-s*0.5,y-s*0.5);ctx.lineTo(x+s*0.85,y-s*0.5);ctx.lineTo(x+s*0.5,y+s*0.5);ctx.lineTo(x-s*0.85,y+s*0.5);ctx.closePath();ctx.stroke();
    if(kind==="constraint"){ctx.beginPath();ctx.moveTo(x-s*0.2,y-s*0.5);ctx.lineTo(x-s*0.55,y+s*0.5);ctx.stroke();}}
  else if(kind==="interaction"){ctx.beginPath();ctx.arc(x-s*0.12,y,s*0.62,Math.PI/2,Math.PI*1.5);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(x+s*0.12,y,s*0.62,-Math.PI/2,Math.PI/2);ctx.closePath();ctx.stroke();}
  else{ctx.beginPath();ctx.arc(x-s*0.3,y,s*0.55,0,TP);ctx.stroke();ctx.beginPath();ctx.arc(x+s*0.3,y,s*0.55,0,TP);ctx.stroke();}
  ctx.restore();}
// an element of the model: glass in its colour, its name, and its glyph in the corner (o.g2: a second glyph beside the first)
// an element's name: in two lines at most if it takes them at up to a unit smaller (so no word is left alone on a third,
// "capacidad / de / alojamiento"), the two as even as they can be; else as fitL() fits it. Remembered
const EF=new Map();
function elFit(ctx,s,w,z,max){s=String(s);const key=s+"|"+Math.round(w)+"|"+z+"|"+max;if(EF.has(key))return EF.get(key);let r=null;
  for(let k=z;k>=z-1-0.01&&!r;k-=0.5){const ls=LN(ctx,s,w,k);if(ls.length<=Math.min(2,max)&&ls.every(l=>TW(ctx,l,k)<=w+0.5))r=[ls.length===2?even2(ctx,s,w,k,700)||ls:ls,k];}
  if(!r){const f=fitL(ctx,s,w,z,max);r=[f[0].length===2&&!f.miss?even2(ctx,s,w,f[1],700)||f[0]:f[0],f[1]];if(f.miss)r.miss=1;}
  if(EF.size>2000)EF.clear();EF.set(key,r);return r;}
function el(ctx,x,y,w,hh,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const z=o.size||13,r=kind==="capability"||kind==="process"?12:6,gs=o.gs||8;
  withA(ctx,a,()=>{glass(ctx,x,y,w,hh,r,col,{glow:10+12*(o.hi||0),ea:0.88,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgbaS(col,0.15+0.12*(o.hi||0));rr(ctx,x,y,w,hh,r);ctx.fill();
    if(o.dash){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgbaS(col,0.9);ctx.lineWidth=1.6;rr(ctx,x+1,y+1,w-2,hh-2,r);ctx.stroke();ctx.restore();}
    const gw=kind?gs*2+10:0,up=o.g2&&fitL(ctx,name,w-16-gw-gs*2-6,z,o.max||2,700,1).miss;if(kind)glyph(ctx,kind,x+w-gs-8,y+gs+7,gs,col);
    // a second glyph sits beside the first, or under it when the name needs the width
    if(o.g2)glyph(ctx,o.g2,up?x+w-gs-8:x+w-gs*3-14,up?y+gs*3+12:y+gs+7,gs,o.c2||col);
    const tw_=w-16-gw-(o.g2&&!up?gs*2+6:0),[ls,zz]=elFit(ctx,name,tw_,z,o.max||2),lh=zz*1.2,y0=y+hh/2-(ls.length-1)*lh/2+zz*0.36;
    ls.forEach((l,i)=>T(ctx,l,o.center?x+(w-gw)/2:x+10,y0+i*lh,{w:700,size:zz,align:o.center?"center":"left",color:rgbaS(K.ink,0.96)}));});}
// an arrow, one way
function arrow(ctx,x0,y0,x1,y1,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.fillStyle=rgbaS(col,1);ctx.lineWidth=o.lw||2;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.setLineDash([]);const an=Math.atan2(y1-y0,x1-x0),hz=o.head||8;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-hz*Math.cos(an-0.45),y1-hz*Math.sin(an-0.45));ctx.lineTo(x1-hz*Math.cos(an+0.45),y1-hz*Math.sin(an+0.45));ctx.closePath();ctx.fill();ctx.restore();});}
function pill(ctx,x,y,s,col,o){o=o||{};const z=o.size||13,w=TW(ctx,s,z)+20,hh=z+12,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;glass(ctx,X,y,w,hh,hh/2,col,{fill:"rgba(7,12,24,0.92)",glow:8,ea:0.85});T(ctx,s,X+10,y+hh/2+z*0.36,{w:700,size:z,color:rgbaS(col,1)});return w;}
// a picture's ground: the films' dark, with a little of the lab's colour from the top
function ground(ctx,w,hh,col){const g=ctx.createRadialGradient(w*0.5,-hh*0.2,10,w*0.5,hh*0.3,Math.max(w,hh));g.addColorStop(0,rgbaS(col,0.16));g.addColorStop(1,rgbaS(col,0));ctx.fillStyle=g;ctx.fillRect(0,0,w,hh);}
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
  if(o.wrap){const h1=lines(ctx,sub,x+8,y+16,w-16,{size:12,max:2,color:rgbaS(mixC(col,K.soft,0.4),1)});lines(ctx,name,x+8,y+16+h1+3,w-16,{size:o.size||14,max:2,w:800,color:rgbaS(K.ink,0.97)});}
  else{line1(ctx,sub,x+8,y+16,w-16,12,{w:700,color:rgbaS(mixC(col,K.soft,0.4),1)});line1(ctx,name,x+8,y+hh-11,w-16,o.size||14,{w:800,color:rgbaS(K.ink,0.97)});}
  if(o.mark)mark(ctx,x+w-2,y+2,o.mark);});}
// a dot on its way along a line, u from 0 to 1
function dot(ctx,x0,y0,x1,y1,u,col,r){if(u<=0||u>=1)return;const x=lp(x0,x1,u),y=lp(y0,y1,u);ctx.save();ctx.shadowColor=rgbaS(col,0.9);ctx.shadowBlur=10;ctx.fillStyle=rgbaS(col,1);ctx.beginPath();ctx.arc(x,y,r||4.5,0,TP);ctx.fill();ctx.restore();}
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab ps-lab","style":"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls ps-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"ps-goals","aria-label":U.goals}),end=h("div",{class:"ps-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},relayout:()=>{if(st)st.relayout();},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"ps-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    // a button that steps through states, its label saying which: "name: state"
    cycle:(row,label,states,cur,fn)=>{let i=Math.max(0,states.findIndex(s=>s[0]===cur));const b=h("button",{type:"button",class:"chip-btn ps-cyc","data-cycle":label});
      const paint=()=>{b.textContent=label+": "+states[i][1];b.setAttribute("data-state",states[i][0]);};paint();
      b.addEventListener("click",()=>{i=(i+1)%states.length;paint();fn(states[i][0]);api.refresh();});row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"ps-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm ps-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"ps-goalbox"},h("p",{class:"ps-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"ps-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}

// rows of things, each with a state: a box for each, its label, its state in a pill on the right, and a tick or a cross once judged
function rowsPic(ctx,o,rows,y0,rh){rows.forEach((r,i)=>{const y=y0+i*(rh+6),x=o.m,w=o.lw-o.m*2;card(ctx,x,y,w,rh,r.c,null,{glow:r.hot?16:5,tint:r.hot?0.18:0.07,dash:r.dash});
  const pw=r.v?Math.min(w*0.46,TW(ctx,r.v,12.5)+20):0;line1(ctx,r.t,x+10,y+rh/2+5,w-pw-26,13.5,{w:800,color:rgbaS(K.ink,0.96)});
  if(r.v)pill(ctx,x+w-8,y+(rh-24.5)/2,r.v,r.vc||r.c,{align:"right",size:12.5});if(r.mark)mark(ctx,x+w-2,y+2,r.mark);});return y0+rows.length*(rh+6);}
// a needle gauge: a value between lo and hi, its label under it
function gauge(ctx,x,y,r,v,lo,hi,label,col){const a0=Math.PI*0.8,a1=Math.PI*2.2,u=cl((v-lo)/(hi-lo),0,1);ctx.save();ctx.lineWidth=7;ctx.lineCap="round";ctx.strokeStyle="rgba(160,178,205,0.25)";ctx.beginPath();ctx.arc(x,y,r,a0,a1);ctx.stroke();
  ctx.strokeStyle=rgbaS(col,1);ctx.beginPath();ctx.arc(x,y,r,a0,lp(a0,a1,u));ctx.stroke();ctx.restore();T(ctx,String(v),x,y+6,{w:800,size:18,align:"center",color:rgbaS(col,1)});lines(ctx,label,x-r-24,y+r+8,r*2+48,{size:12,max:2,align:"center",color:rgbaS(K.soft,1)});}

/* ---------- 1 · An application or a platform: where the logic lives ---------- */
// The rule that leaves major storms out of minutes without power: in the storm tool's export, in the platform's own parts, or in
// network's data product. Then the storm tool updates, and retail builds a product of its own; and the test run on any system.
PLAY.test=(Lb,api)=>{const W=Lb.w,S={home:"export",upd:null,val:8.2,ret:null,retOk:false,look:null,tLook:null};
  const r1=api.group(W.homeL);api.seg(r1,W.homes,S.home,k=>{S.home=k;S.upd=null;S.val=8.2;S.ret=null;api.kick(700);api.say(W.msg["home_"+k]);},W.homeL);
  const r2=api.group();
  api.btn(r2,W.updB,()=>{S.upd=performance.now();S.val=S.home==="export"?19:8.2;api.kick(1800);api.say(W.msg["upd_"+S.home],S.home==="export"?"no":"ok");if(S.home!=="export")api.reach("holds");if(S.home==="product")api.reach("owner");},"go");
  api.btn(r2,W.retB,()=>{S.ret=performance.now();S.retOk=S.home!=="platform";api.kick(1400);api.say(S.retOk?W.msg.retOk:W.msg.retNo,S.retOk?"ok":"no");if(S.home==="product")api.reach("own");});
  const r3=api.group(W.lookL);api.seg(r3,W.systems.map(s=>[s.k,s.t]),null,k=>{S.look=k;S.tLook=performance.now();api.kick(600);const s=W.systems.find(x=>x.k===k);api.say(s.why);if(k==="finance")api.reach("test");},W.lookL);
  const lay=(lw)=>{const m=12,o={lw,m};o.top=12;o.tool={x:m,y:12,w:Math.min(240,lw-m*2-112),h:72};o.g={x:lw-m-50,y:42};o.plat={x:m,y:120,w:lw-m*2,h:170};o.ty=o.plat.y+o.plat.h+14;o.h=o.ty+3*30+14;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,P=o.plat,AC=K.lay[4],PC=K.lay[5];
    box2(ctx,o.tool.x,o.tool.y,o.tool.w,o.tool.h,W.toolSub,W.tool,AC,{size:13.5,wrap:1});
    const v=S.upd!=null&&ago(now,S.upd)>900?S.val:8.2;gauge(ctx,o.g.x,o.g.y,26,v,0,20,W.gaugeL,v>10?K.bad:K.good);
    card(ctx,P.x,P.y,P.w,P.h,PC,W.plat,{glow:6});const pw=(P.w-24-4*6)/5;W.caps.forEach((c,i)=>chip(ctx,P.x+12+i*(pw+6),P.y+P.h-40,pw,30,c,PC,{size:12}));
    const dw=(P.w-36)/2,dy=P.y+32;box2(ctx,P.x+12,dy,dw,62,W.netSub,W.netProd,K.lay[2],{size:13.5,wrap:1});
    if(S.ret!=null){const u=eo(into(now,S.ret,600));withA(ctx,u,()=>box2(ctx,P.x+24+dw,dy,dw,62,W.retSub,W.retProd,K.lay[3],{size:13.5,wrap:1,edge:S.retOk?null:K.bad,mark:u>=1?(S.retOk?"ok":"no"):null}));}
    // where the rule lives
    const rp=S.home==="export"?{x:o.tool.x+8,y:o.tool.y+o.tool.h+6}:S.home==="platform"?{x:P.x+P.w/2-60,y:P.y+P.h-72}:{x:P.x+18,y:dy+68};
    const lost=S.home==="export"&&S.upd!=null&&ago(now,S.upd)>500;pill(ctx,rp.x,rp.y,W.rule,lost?K.bad:K.gold,{size:12});if(lost)mark(ctx,rp.x+4,rp.y+4,"no");
    arrow(ctx,o.tool.x+o.tool.w-22,o.tool.y+o.tool.h+2,o.tool.x+o.tool.w-22,P.y-2,AC,0.7,{head:7});
    // the test, on the system looked at
    const s=S.look?W.systems.find(x=>x.k===S.look):null;line1(ctx,s?s.t:W.lookQ,m,o.ty+2,o.lw-m*2,13.5,{w:800,color:rgbaS(s?K.ink:K.soft,1)});
    if(s){const ua=eo(into(now,S.tLook,500));W.tests.forEach((t,i)=>withA(ctx,ua,()=>{const y=o.ty+14+i*26;mark(ctx,m+8,y+8,s.a[i]?"ok":"no");line1(ctx,t,m+22,y+13,o.lw-m*2-120,12.5,{w:700,color:rgbaS(K.ink,0.9)});}));
      withA(ctx,ua,()=>pill(ctx,o.lw-m,o.ty+40,s.v,s.k==="dp"||s.k==="ip"?PC:AC,{align:"right",size:13}));}};
  return{lay,draw,readouts:[[W.read.mins,()=>S.upd==null?"8.2":String(S.val)],[W.read.rule,()=>W.homes.find(x=>x[0]===S.home)[1]]]};};

/* ---------- 2 · Inside the platform: eight parts, then products ---------- */
// Ravi's eight parts, four along the way and four across, each with the product under it. Turn on what three of the parts across do,
// and see three of the utility's days go well or badly; then draw the parts before the products, and the gap shows.
PLAY.parts=(Lb,api)=>{const W=Lb.w,PT=W.parts,S={on:{},t:{},view:"products",tView:null,ev:{}};
  const r1=api.group(W.onL);W.fixes.forEach(f=>api.toggle(r1,f.t,false,v=>{S.on[f.k]=v;S.t[f.k]=performance.now();api.kick(700);api.say(v?f.on:f.off);}));
  const r2=api.group(W.viewL);api.seg(r2,W.views,S.view,k=>{S.view=k;S.tView=performance.now();api.kick(900);api.say(W.msg["view_"+k],k==="parts"?"ok":null);if(k==="parts")api.reach("gap");},W.viewL);
  const r3=api.group(W.daysL);W.events.forEach(e=>api.btn(r3,e.b,()=>{const ok=!!S.on[e.part];S.ev[e.part]={t:performance.now(),ok};api.kick(1600);api.say(ok?e.ok:e.no,ok?"ok":"no");if(ok)api.reach(e.goal);}));
  const lay=(lw)=>{const m=12,o={lw,m},cols=lw<460?2:4,g=6,cw=(lw-m*2-g*(cols-1))/cols,ch=56;o.cells=PT.map((p,i)=>{const j=i%4,row=Math.floor(i/4),c=j%cols,r=Math.floor(j/cols)+row*(4/cols);return{x:m+c*(cw+g),y:34+r*(ch+g)+row*26,w:cw,h:ch};});
    o.l2=o.cells[4].y-22;o.h=o.cells[7].y+ch+14;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,v=into(now,S.tView,700),parts=S.view==="parts";
    line1(ctx,W.along,m,24,o.lw-m*2,12.5,{w:800,color:rgbaS(K.lay[4],1)});line1(ctx,W.across,m,o.l2+12,o.lw-m*2,12.5,{w:800,color:rgbaS(K.lay[1],1)});
    PT.forEach((p,i)=>{const c=o.cells[i],col2=i<4?K.lay[4]:K.lay[1],on=p.fix?!!S.on[p.fix]:true,prod=p.fix&&!on?p.none:p.prod,ev=S.ev[p.k],hot=ev&&ago(now,ev.t)<1300;
      const big=parts?p.t:prod,small=parts?(prod||W.nothing):"";
      box2(ctx,c.x,c.y,c.w,c.h,parts?W.partWord:W.prodWord,big||W.nothing,col2,{size:13,dash:!prod,edge:parts&&!prod?K.bad:null,glow:hot?18:6,mark:ev&&ago(now,ev.t)>700?(ev.ok?"ok":"no"):null,a:parts?lp(0.6,1,v):1});
      if(parts&&small)line1(ctx,small,c.x+8,c.y+c.h+0,c.w-16,12,{w:700,color:rgbaS(prod?K.soft:K.bad,lp(0,1,v))});});};
  return{lay,draw,readouts:[[W.read.gap,()=>String(PT.filter(p=>p.fix&&!S.on[p.fix]).length)],[W.read.view,()=>W.views.find(x=>x[0]===S.view)[1]]]};};

/* ---------- 3 · One platform or many: a reason you can name ---------- */
// A second platform, for one of four reasons. Move it onto the one, or keep it; open the files and federate the catalogue where one
// stays; then a measure that needs both.
PLAY.second=(Lb,api)=>{const W=Lb.w,R=W.reasons,S={r:R[0].k,act:null,res:null,open:false,fed:false,tH:null,both:null,bothOk:false};
  const rs=()=>R.find(x=>x.k===S.r);
  const r1=api.group(W.reasonL);api.seg(r1,R.map(x=>[x.k,x.t]),S.r,k=>{S.r=k;S.act=null;api.kick(500);api.say(rs().say);},W.reasonL);
  const r2=api.group();const act=k=>{const x=rs();S.act=performance.now();S.res=k==="move"?(x.ty==="good"?"law":x.ty==="while"?"while":"moved"):(x.ty==="good"?"kept":"twice");api.kick(1800);
    api.say(W.msg[S.res],S.res==="law"||S.res==="twice"?"no":"ok");if(S.res==="moved")api.reach("moved");if(S.res==="while")api.reach("while");if(S.res==="kept")api.reach("kept");};
  api.btn(r2,W.moveB,()=>act("move"),"go");api.btn(r2,W.keepB,()=>act("keep"));
  const r3=api.group(W.harmL);api.toggle(r3,W.openT,false,v=>{S.open=v;S.tH=performance.now();api.kick(700);api.say(v?W.msg.openOn:W.msg.openOff);});
  api.toggle(r3,W.fedT,false,v=>{S.fed=v;S.tH=performance.now();api.kick(700);api.say(v?W.msg.fedOn:W.msg.fedOff);});
  api.btn(r3,W.bothB,()=>{S.both=performance.now();S.bothOk=S.open&&S.fed;api.kick(1600);api.say(S.bothOk?W.msg.bothOk:W.msg.bothNo,S.bothOk?"ok":"no");if(S.bothOk)api.reach("less");});
  const gone=()=>S.act!=null&&(S.res==="moved"||S.res==="while");
  const lay=(lw)=>{const m=12,o={lw,m},g=16,w=(lw-m*2-g)/2,bh=84+W.rules.length*30;o.a={x:m,y:12,w,h:bh};o.b={x:m+w+g,y:12,w,h:bh};o.h=12+bh+14+3*28+10;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,A=o.a,B=o.b,PC=K.lay[5],x=rs(),t=S.act!=null?ago(now,S.act):-1;
    const plat=(b,name,sub,c,al)=>{withA(ctx,al,()=>{card(ctx,b.x,b.y,b.w,b.h,c,null,{glow:6});lines(ctx,name,b.x+12,b.y+22,b.w-24,{size:13.5,max:2,w:800,color:rgbaS(mixC(c,K.ink,0.3),1)});
      lines(ctx,sub,b.x+12,b.y+56,b.w-24,{size:12,max:2,color:rgbaS(K.soft,1)});W.rules.forEach((r,i)=>chip(ctx,b.x+12,b.y+82+i*30,b.w-24,24,r,c,{size:12}));});};
    plat(A,W.one,W.oneSub,PC,1);
    const fade=gone()?1-eo(cl((t-600)/900,0,1)):1;plat(B,W.second,x.sub,K.lay[3],0.25+0.75*fade);
    if(gone()&&t>0){const u=cl(t/1200,0,1);for(let k=0;k<4;k++)dot(ctx,B.x+B.w/2,B.y+90+k*20,A.x+A.w/2,A.y+90+k*20,cl(u*1.3-k*0.1,0,1),K.gold,4);}
    if(S.act!=null&&t>700){const ok=S.res!=="law"&&S.res!=="twice";pill(ctx,B.x+B.w/2,B.y+B.h+4,W.res[S.res],ok?K.good:K.bad,{align:"center",size:12.5});}
    // lessening the harm, where one stays
    const y=A.y+A.h+40,ha=into(now,S.tH,500)||1;[[W.openT,S.open],[W.fedT,S.fed]].forEach(([s,on],i)=>{mark(ctx,m+8,y+i*28,on?"ok":"no");line1(ctx,s,m+22,y+i*28+5,o.lw-m*2-30,12.5,{w:700,color:rgbaS(on?K.good:K.soft,ha)});});
    if(S.both!=null){const u=eo(into(now,S.both,700));line1(ctx,S.bothOk?W.bothOk:W.bothNo,m,y+62,o.lw-m*2,13,{w:800,color:rgbaS(S.bothOk?K.good:K.bad,u)});}};
  return{lay,draw,readouts:[[W.read.rules,()=>gone()?W.read.once:W.read.twice],[W.read.reason,()=>rs().t]]};};

/* ---------- 4 · Where it meets the applications: the route for each flow ---------- */
// Five flows, each on a route: a read nobody knew, messages, the platform's own connectors, an event, the gateway. Run a night, and
// upgrade the customer system.
PLAY.routes=(Lb,api)=>{const W=Lb.w,F=W.flows,S={r:{},t:{},night:null,up:null};F.forEach(f=>S.r[f.k]=f.start);
  const name=k=>W.ways.find(x=>x[0]===k)[1];
  const r1=api.group(W.flowsL);F.forEach(f=>api.cycle(r1,f.t,W.ways,f.start,k=>{S.r[f.k]=k;S.t[f.k]=performance.now();api.kick(800);api.say(fill(W.msg.set,{f:f.t,w:name(k)}));
    if(f.k==="risk"&&k==="gw")api.reach("gateway");if(F.filter(x=>x.from==="cust").every(x=>S.r[x.k]==="event"))api.reach("event");}));
  const r2=api.group();
  api.btn(r2,W.nightB,()=>{const v=S.r[W.bulk];S.night=performance.now();api.kick(2000);api.say(W.msg["night_"+v]||W.msg.night_bad,v==="native"?"ok":"no");if(v==="native")api.reach("bulk");},"go");
  api.btn(r2,W.upB,()=>{S.up=performance.now();api.kick(1800);const broke=F.filter(f=>f.from==="cust"&&S.r[f.k]==="query");
    if(broke.length)api.say(fill(W.msg.upNo,{f:broke.map(f=>f.t).join(", ")}),"no");else{api.say(W.msg.upOk,"ok");api.reach("upgrade");}});
  const lay=(lw)=>{const m=12,o={lw,m};o.y0=40;o.rh=46;o.h=o.y0+F.length*(o.rh+8)+20;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,RC={query:K.bad,msg:K.lay[3],native:K.lay[5],event:K.lay[4],gw:[150,222,196]};
    const sw=Math.min(118,(o.lw-m*2)*0.3);T(ctx,W.fromH,m,26,{w:800,size:12,color:rgbaS(K.soft,1)});T(ctx,W.toH,o.lw-m,26,{w:800,size:12,align:"right",color:rgbaS(K.soft,1)});
    F.forEach((f,i)=>{const y=o.y0+i*(o.rh+8),r=S.r[f.k],c=RC[r],ok=r===f.best,u=in1(now,S.t[f.k],500);
      chip(ctx,m,y,sw,o.rh,f.a,K.lay[2],{size:12.5});chip(ctx,o.lw-m-sw,y,sw,o.rh,f.b,K.lay[2],{size:12.5});
      const x0=m+sw+6,x1=o.lw-m-sw-6,yy=y+o.rh/2;ctx.save();ctx.strokeStyle=rgbaS(c,0.4+0.5*u);ctx.lineWidth=r==="msg"?1.4:2.4;if(r==="query")ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x1,yy);ctx.stroke();ctx.restore();
      pill(ctx,(x0+x1)/2,yy-24,name(r),c,{align:"center",size:12});
      const broke=S.up!=null&&f.from==="cust"&&r==="query"&&ago(now,S.up)>600;if(broke)mark(ctx,(x0+x1)/2,yy+8,"no");
      // the night's readings: one fat stream, or a swarm of small messages
      if(f.k===W.bulk&&S.night!=null){const t=ago(now,S.night);if(r==="msg")for(let k=0;k<14;k++)dot(ctx,x0,yy+((k%3)-1)*5,x1,yy+((k%3)-1)*5,cl(t/1900-k*0.05,0,1),c,2);else dot(ctx,x0,yy,x1,yy,cl(t/900,0,1),c,6);}
      if(ok&&u>=1)mark(ctx,o.lw-m-2,y+2,"ok");});};
  return{lay,draw,readouts:[[W.read.right,()=>fill(W.read.nOf,{n:F.filter(f=>S.r[f.k]===f.best).length,of:F.length})],[W.read.hidden,()=>String(F.filter(f=>S.r[f.k]==="query").length)]]};};

/* ---------- 5 · Security all the way through: a pass of its own ---------- */
// Five rules, each on or off; then the regulator asks who read bank details, a laptop reads the files, and a key leaks.
PLAY.pass=(Lb,api)=>{const W=Lb.w,ROUT=W.rules,S={on:{},t:{},ev:{}};
  const r1=api.group(W.rulesL);ROUT.forEach(r=>api.toggle(r1,r.t,false,v=>{S.on[r.k]=v;S.t[r.k]=performance.now();api.kick(700);api.say(v?r.on:r.off);}));
  const r2=api.group(W.evL);
  api.btn(r2,W.whoB,()=>{const id=S.on.id&&S.on.people,least=id&&S.on.role;S.ev.who={t:performance.now(),ok:id,least};api.kick(1800);
    api.say(least?W.msg.whoLeast:id?W.msg.whoId:W.msg.whoNo,least?"ok":id?"warn":"no");if(id)api.reach("who");if(least)api.reach("least");},"go");
  api.btn(r2,W.lapB,()=>{const ok=!!S.on.where;S.ev.lap={t:performance.now(),ok};api.kick(1600);api.say(ok?W.msg.lapOk:W.msg.lapNo,ok?"ok":"no");if(ok)api.reach("laptop");});
  api.btn(r2,W.keyB,()=>{const ok=!!S.on.secret;S.ev.key={t:performance.now(),ok};api.kick(1600);api.say(ok?W.msg.keyOk:W.msg.keyNo,ok?"ok":"no");if(ok)api.reach("secret");});
  const lay=(lw)=>{const m=12,o={lw,m};o.y0=12;o.rh=34;o.ly=o.y0+ROUT.length*(o.rh+6)+16;o.h=o.ly+5*20+30;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m;
    rowsPic(ctx,o,ROUT.map(r=>({t:r.s,v:S.on[r.k]?W.on:W.off,c:S.on[r.k]?K.good:K.soft,vc:S.on[r.k]?K.good:K.soft,hot:in1(now,S.t[r.k],600)<1})),o.y0,o.rh);
    // the log the regulator reads
    card(ctx,m,o.ly,o.lw-m*2,o.h-o.ly-8,K.lay[1],W.logT,{glow:4});const w=S.ev.who,lines_=w?(w.least?W.logLeast:w.ok?W.logId:W.logNo):W.logIdle;
    lines_.forEach((l,i)=>{const u=w?eo(into(now,w.t+i*160,400)):1;withA(ctx,u,()=>line1(ctx,l,m+12,o.ly+42+i*20,o.lw-m*2-24,12.5,{w:700,color:rgbaS(w&&!w.ok?K.bad:K.ink,0.9)}));});
    [["lap",W.lapS],["key",W.keyS]].forEach(([k,s],i)=>{const e=S.ev[k];if(!e)return;const u=eo(into(now,e.t,500));withA(ctx,u,()=>pill(ctx,o.lw-m-8,o.ly+8+i*28,s+": "+(e.ok?W.stopped:W.exposed),e.ok?K.good:K.bad,{align:"right",size:12}));});};
  return{lay,draw,readouts:[[W.read.on,()=>fill(W.read.nOf,{n:ROUT.filter(r=>S.on[r.k]).length,of:ROUT.length})]]};};

/* ---------- 6 · One solution, end to end: one page ---------- */
// The social tariff's context page: what it touches, what's out of scope and what's fixed, and three qualities, each measured. Then
// billing's vendor offers October, the agency is late before a bill run, and the agency changes its file.
PLAY.context=(Lb,api)=>{const W=Lb.w,S={on:{},t:{},q:{},ev:{}};
  const page=()=>W.touches.every(x=>S.on[x.k])&&S.on.out&&S.on.fixed;
  const r1=api.group(W.touchL);W.touches.forEach(x=>api.toggle(r1,x.t,false,v=>{S.on[x.k]=v;S.t[x.k]=performance.now();api.kick(600);api.say(fill(v?W.msg.add:W.msg.drop,{t:x.t}));if(page())api.reach("page");}));
  const r2=api.group(W.scopeL);[["out",W.outT],["fixed",W.fixedT]].forEach(([k,t])=>api.toggle(r2,t,false,v=>{S.on[k]=v;S.t[k]=performance.now();api.kick(600);api.say(v?W.msg[k+"On"]:W.msg[k+"Off"]);if(page())api.reach("page");}));
  const r3=api.group(W.qualL);W.quals.forEach(x=>api.toggle(r3,x.t,false,v=>{S.q[x.k]=v;api.kick(400);api.say(v?x.on:x.off);}));
  const r4=api.group(W.evL);W.events.forEach(e=>api.btn(r4,e.b,()=>{const ok=e.need.every(k=>S.on[k]||S.q[k]);S.ev[e.k]={t:performance.now(),ok};api.kick(1600);api.say(ok?e.ok:e.no,ok?"ok":"no");if(ok)api.reach(e.k);}));
  const lay=(lw)=>{const m=12,o={lw,m};o.cx=lw/2;o.cy=110;o.h=12+200+16+3*42+20;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,n=W.touches.length,rx=Math.min(o.lw/2-70,200),ry=74,TC=K.lay[2];
    W.touches.forEach((x,i)=>{const a=-Math.PI/2+i*TP/n,px=o.cx+Math.cos(a)*rx,py=o.cy+Math.sin(a)*ry,on=!!S.on[x.k],u=on?eo(into(now,S.t[x.k],500)):0,bw=Math.min(122,o.lw*0.3);
      if(u>0){ctx.save();ctx.strokeStyle=rgbaS(K.gold,0.7*u);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(o.cx,o.cy);ctx.lineTo(px,py);ctx.stroke();ctx.restore();}
      chip(ctx,px-bw/2,py-17,bw,34,x.s,on?TC:K.soft,{size:12.5,dash:!on,a:0.35+0.65*Math.max(u,on?1:0)});});
    chip(ctx,o.cx-70,o.cy-22,140,44,W.sol,K.gold,{size:14,glow:14});
    const y=o.cy+ry+40;[["out",W.outS],["fixed",W.fixedS]].forEach(([k,s],i)=>{const on=!!S.on[k];pill(ctx,i?o.lw-m:m,y,s,on?(k==="out"?K.soft:K.gold):[90,100,120],{align:i?"right":"left",size:12});});
    W.quals.forEach((x,i)=>{const yy=y+40+i*42,on=!!S.q[x.k];mark(ctx,m+8,yy,on?"ok":"no");lines(ctx,x.s+(on?": "+x.m:""),m+22,yy+5,o.lw-m*2-50,{size:12.5,max:2,color:rgbaS(on?K.ink:K.soft,0.95)});
      const ev=W.events.find(e=>e.need.includes(x.k)),e=ev&&S.ev[ev.k];if(e&&ago(now,e.t)>500)mark(ctx,o.lw-m-8,yy,e.ok?"ok":"no");});};
  return{lay,draw,readouts:[[W.read.page,()=>fill(W.read.nOf,{n:W.touches.filter(x=>S.on[x.k]).length,of:W.touches.length})],[W.read.quals,()=>String(W.quals.filter(x=>S.q[x.k]).length)]]};};

/* ---------- 7 · A road people choose: the path, laid ---------- */
// Five teams. Lay the path's three pieces, or order everyone onto the platform; start a data product; and a team that needs what
// the path doesn't offer.
PLAY.path=(Lb,api)=>{const W=Lb.w,TM=W.teams,S={on:{},t:{},order:false,start:null,startRes:null,leave:null,leaveOk:false};
  const onPath=()=>S.on.form&&S.on.rules&&S.on.help;
  const where=t=>t.k==="new"?(S.start!=null?"path":"none"):S.order?(t.k==="field"||t.k==="meter"?"hidden":"path"):onPath()?"path":t.home;
  const r1=api.group(W.layL);W.pieces.forEach(p=>api.toggle(r1,p.t,false,v=>{S.on[p.k]=v;S.t[p.k]=performance.now();api.relayout();api.kick(900);api.say(v?p.on:p.off);
    if(onPath()&&!S.order)api.reach("choose");}));
  const r2=api.group(W.orderL);api.toggle(r2,W.orderT,false,v=>{S.order=v;api.relayout();api.kick(900);api.say(v?W.msg.orderOn:W.msg.orderOff,v?"no":null);});
  const r3=api.group();
  api.btn(r3,W.startB,()=>{S.start=performance.now();S.startRes=S.on.form?(S.on.rules?"ok":"refused"):"slow";api.relayout();api.kick(1600);
    api.say(W.msg["start_"+S.startRes],S.startRes==="ok"?"ok":"no");if(S.on.form)api.reach("minutes");if(S.startRes==="ok")api.reach("rules");},"go");
  api.btn(r3,W.leaveB,()=>{S.leave=performance.now();S.leaveOk=onPath()&&!S.order;api.kick(1400);api.say(S.leaveOk?W.msg.leaveOk:W.msg.leaveNo,S.leaveOk?"ok":"warn");if(S.leaveOk)api.reach("leave");});
  const lay=(lw)=>{const m=12,o={lw,m};o.road={x:m,y:12,w:lw-m*2,h:70};o.y0=o.road.y+o.road.h+16;o.rh=36;o.h=o.y0+TM.length*(o.rh+6)+10;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,R=o.road,pw=(R.w-24-12)/3;
    card(ctx,R.x,R.y,R.w,R.h,K.gold,W.road,{glow:onPath()?14:4,dash:!onPath()});W.pieces.forEach((p,i)=>{const on=!!S.on[p.k];chip(ctx,R.x+12+i*(pw+6),R.y+30,pw,30,p.s,on?K.good:K.soft,{size:12,dash:!on,mark:on?"ok":null});});
    rowsPic(ctx,o,TM.map(t=>{const w=where(t),c=w==="path"?K.good:w==="hidden"?K.bad:w==="none"?K.soft:K.lay[3];
      const v=t.k==="new"&&S.start!=null?W.startV[S.startRes]:t.k==="meter"&&S.leave!=null&&S.leaveOk?W.leftV:W.places[w];return{t:t.t,v,c,vc:c,dash:w==="none"};}),o.y0,o.rh);};
  return{lay,draw,readouts:[[W.read.on,()=>fill(W.read.nOf,{n:TM.filter(t=>where(t)==="path").length,of:TM.length})],[W.read.first,()=>S.start==null?"–":W.startV[S.startRes]]]};};

/* ---------- 8 · Built to change: a week on another engine ---------- */
// Hosting capacity, its tables and its logic kept one way or the other, and what it needs set up again written down or not. Then a
// week on another engine, in test.
PLAY.exit=(Lb,api)=>{const W=Lb.w,S={tab:"own",code:"nb",doc:false,run:null,res:null};
  const r1=api.group(W.tabL);api.seg(r1,W.tabs,S.tab,k=>{S.tab=k;S.run=null;api.kick(300);api.say(W.msg["tab_"+k]);},W.tabL);
  const r2=api.group(W.codeL);api.seg(r2,W.codes,S.code,k=>{S.code=k;S.run=null;api.kick(300);api.say(W.msg["code_"+k]);},W.codeL);
  const r3=api.group(W.docL);api.toggle(r3,W.docT,false,v=>{S.doc=v;S.run=null;api.kick(300);api.say(v?W.msg.docOn:W.msg.docOff);});
  const r4=api.group();api.btn(r4,W.runB,()=>{S.run=performance.now();const f=S.tab==="open",c=S.code==="dbt";S.res={f,c,d:S.doc};api.kick(3000);
    const bits=[f?W.msg.runFiles:W.msg.runNoFiles,c?W.msg.runCode:W.msg.runNoCode,S.doc?W.msg.runDoc:W.msg.runNoDoc];if(f&&c)bits.push(W.msg.runSame);
    api.say(bits.join(" "),f&&c&&S.doc?"ok":"warn");if(f)api.reach("files");if(c)api.reach("code");if(S.doc)api.reach("written");if(f&&c)api.reach("numbers");},"go");
  const lay=(lw)=>{const m=12,o={lw,m},g=30,w=(lw-m*2-g)/2;o.a={x:m,y:12,w};o.b={x:m+w+g,y:12,w};o.rh=40;o.h=12+28+W.items.length*(o.rh+6)+40;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,A=o.a,B=o.b,t=S.run!=null?ago(now,S.run):-1;
    line1(ctx,W.here,A.x,A.y+14,A.w,13,{w:800,color:rgbaS(K.lay[5],1)});line1(ctx,W.there,B.x,B.y+14,B.w,13,{w:800,color:rgbaS(K.lay[3],1)});
    W.items.forEach((it,i)=>{const y=A.y+28+i*(o.rh+6),kind=it.k==="tables"?(S.tab==="open"?"same":"export"):it.k==="logic"?(S.code==="dbt"?"lines":"rewrite"):"again";
      chip(ctx,A.x,y,A.w,o.rh,it.t,K.lay[5],{size:12.5});
      const u=t<0?0:eo(cl((t-i*350)/600,0,1));if(u<=0)return;const c=kind==="same"?K.good:kind==="lines"?K.gold:kind==="again"?(S.res.d?K.lay[4]:K.bad):K.bad;
      dot(ctx,A.x+A.w,y+o.rh/2,B.x,y+o.rh/2,cl((t-i*350)/500,0,1),c,4);
      withA(ctx,u,()=>chip(ctx,B.x,y,B.w,o.rh,W.kinds[kind]+(kind==="again"&&S.res.d?" "+W.listed:""),c,{size:12.5,mark:kind==="same"||kind==="lines"||(kind==="again"&&S.res.d)?"ok":"no"}));});
    if(S.run!=null&&t>W.items.length*350+600&&S.res.f&&S.res.c)line1(ctx,W.sameNums,m,o.h-12,o.lw-m*2,13,{w:800,align:"center",color:rgbaS(K.good,1)});};
  return{lay,draw,readouts:[[W.read.lines,()=>S.res?(S.res.c?W.read.few:W.read.all):"–"],[W.read.doc,()=>S.doc?W.read.yes:W.read.no]]};};

const BUILD={play:labPlay};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
if(app.id==="series-labs"){app.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),panel=h("div",{id:"ps-panel",role:"tabpanel"});const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=L.labs.find(x=>x.id===id)||L.labs[0];visited.add(Lb.id);put("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    panel.setAttribute("aria-labelledby","ps-tab-"+Lb.id);
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1],F=FILMS[Lb.film]||{},start=Lb.chapter&&F.starts?F.starts[Lb.chapter]:null;
    const watch=F.href&&!F.coming?h("a",{class:"btn",href:F.href+(start!=null?"#t="+start:"")},U.watch):h("p",{class:"ps-coming"},h("b",null,U.coming)," "+U.comingNote);
    panel.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length+" · "+filmN(Lb.film)),
        h("p",{class:"ps-film"},F.href&&!F.coming?h("a",{href:F.href},F.t||""):h("span",null,F.t||"")),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,...rich(p)))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watch,nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus){panel.scrollIntoView({block:"start",behavior:RM()?"auto":"smooth"});}}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab",id:"ps-tab-"+Lb.id,"aria-controls":"ps-panel","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
  // the rail is one stop for the keyboard: arrows move along it, Home and End go to its ends
  rail.addEventListener("keydown",e=>{const bs=[...rail.children],k=bs.indexOf(document.activeElement);if(k<0)return;let j=null;
    if(e.key==="ArrowRight"||e.key==="ArrowDown")j=(k+1)%bs.length;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")j=(k-1+bs.length)%bs.length;else if(e.key==="Home")j=0;else if(e.key==="End")j=bs.length-1;
    if(j==null)return;e.preventDefault();bs[j].focus();show(bs[j].dataset.id);});
  app.append(rail,panel);show((location.hash||"").slice(1));
  window.addEventListener("hashchange",()=>{const id=(location.hash||"").slice(1);if(L.labs.some(x=>x.id===id))show(id,true);});}

/* ---------- the scenarios page: the series' evaluation ---------- */
// Situations from every film, or from one (#film-3); each answer explains why and points back to its lab. Answers are kept by
// the scenario's number (film × 10 + its place), so a new situation never takes over an old answer. Every situation is a choice,
// its options shown in the order the words give them, where the right answers are spread. Each has a picture, VIS[vis.k], whose
// height, VIS[k].h(lw, ctx, q), may measure its words, so a box grows where a Spanish name takes two lines.
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
    const vis=DRAW&&f?stage((lw,M)=>({lw,h:Math.round(f.h?f.h(lw,M,q):cl(lw*0.56,190,300))}),(ctx,o,now)=>f(ctx,o,now,q,S),(L.pics.alt&&L.pics.alt[q.vis.k])||q.title):null;
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
      film&&open?h("p",{class:"ps-open"},h("a",{href:"#",onclick:e=>{e.preventDefault();setFilm(0);}},fill(U.stillOpen,{n:open}))):null,
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
// a measure built on the platform from three systems, its jump in March, and whose rule it is: a question, until it's answered
VIS.minutes=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const M=PK.minutes,m=12,t=GO(S,now),mw=Math.min(320,o.lw-m*2),mx=(o.lw-mw)/2,my=14,mh=44;
  const n=M.sys.length,g=8,cw=(o.lw-m*2-g*(n-1))/n,cy=my+mh+86,ch=40;
  M.sys.forEach((s,i)=>{const x=m+i*(cw+g);joinLine(ctx,x+cw/2,cy,mx+mw*(0.2+0.3*i),my+mh,t);});
  el(ctx,mx,my,mw,mh,M.m,K.gold,"object",{size:15});
  M.sys.forEach((s,i)=>chip(ctx,m+i*(cw+g),cy,cw,ch,s,K.lay[4],{size:13,glow:i===n-1&&t<1?12:6}));
  pill(ctx,mx,my+mh+10,M.jump,K.bad,{size:12.5});
  withA(ctx,1-t,()=>pill(ctx,mx+mw,my+mh+44,M.q,K.soft,{size:12.5,align:"right"}));withA(ctx,t,()=>pill(ctx,mx+mw,my+mh+44,M.own,K.gold,{size:12.5,align:"right"}));};
VIS.minutes.h=()=>14+44+86+40+14;
// the finance system, three parts with their logic built in, beside the data platform, with each owner's product on it;
// once answered, what each one is. A box's last line takes two lines where one won't fit, and both boxes grow by one
const suiteDy=(ctx,lw)=>{const U2=PK.suite,w=(lw-12*2-12)/2-16;return(Math.max(fitL(ctx,U2.inside,w,12.5,2,700,true)[0].length,fitL(ctx,U2.own,w,12.5,2,700,true)[0].length)-1)*15;};
VIS.suite=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[4]);const U2=PK.suite,m=12,g=12,w=(o.lw-m*2-g)/2,y0=12,hh=186+suiteDy(ctx,o.lw),t=GO(S,now),AC=K.lay[4],PC=K.lay[5];
  [[m,U2.app,AC,U2.parts,U2.inside,AC],[m+w+g,U2.plat,PC,U2.prods,U2.own,K.gold]].forEach(([x,name,c,items,foot,ic],k)=>{
    glass(ctx,x,y0,w,hh,10,c,{fill:"rgba(7,12,24,0.9)",glow:6,ea:0.7});line1(ctx,name,x+10,y0+22,w-20,14,{w:800,color:rgbaS(c,1)});
    items.forEach((s,i)=>chip(ctx,x+10,y0+36+i*40,w-20,32,s,ic,{size:12.5}));
    // the platform under its products, its front edge clear of the words below
    if(k)slab(ctx,x+6,y0+150,w-12,7,"",PC,{sk:4,label:false,fill:0.5});
    linesB(ctx,foot,x+8,y0+178,w-16,{size:12.5,max:2,w:700,align:"center",color:rgbaS(K.soft,1)});
    withA(ctx,t,()=>pill(ctx,x+w/2,y0+hh+8,k?U2.p:U2.a,K.gold,{size:12.5,align:"center"}));});};
VIS.suite.h=(lw,M)=>12+186+(M?suiteDy(M,lw):0)+8+25+8;
// the platform's bill from June to September, up by half; once answered, each month split by domain
VIS.bill=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[5]);const B=PK.bill,m=18,t=GO(S,now),n=B.months.length,base=o.h-30,top=44,vals=[1,1.12,1.3,1.5],
    DC=[[150,222,196],[255,176,196],[160,178,205]],sh=[[0.42,0.34,0.24],[0.47,0.31,0.22],[0.54,0.27,0.19],[0.61,0.23,0.16]],bw=Math.min(64,(o.lw-m*2)/n-20),gap=(o.lw-m*2-bw*n)/(n-1),hmax=base-top;
  B.months.forEach((mo,i)=>{const x=m+i*(bw+gap),H=hmax*vals[i]/1.5;
    ctx.fillStyle=rgbaS(K.soft,0.5*(1-t));ctx.fillRect(x,base-H,bw,H);let y=base;
    if(t>0)sh[i].forEach((f,k)=>{const hk=H*f;ctx.fillStyle=rgbaS(DC[k],0.85*t);ctx.fillRect(x,y-hk,bw,hk-1);y-=hk;});
    line1(ctx,mo,x-6,base+20,bw+12,12.5,{w:700,align:"center",color:rgbaS(K.soft,1)});});
  ctx.fillStyle=rgbaS(K.soft,0.6);ctx.fillRect(m-4,base,o.lw-m*2+8,1.5);
  withA(ctx,1-t,()=>pill(ctx,o.lw-m,10,B.up,K.bad,{size:12.5,align:"right"}));
  withA(ctx,t,()=>{let x=m;B.doms.forEach((d,k)=>{ctx.fillStyle=rgbaS(DC[k],0.9);ctx.fillRect(x,16,11,11);const w=TW(ctx,d,12.5,700);T(ctx,d,x+16,26,{w:700,size:12.5,color:rgbaS(K.ink,0.92)});x+=w+30;});});};
VIS.bill.h=()=>200;
// the platform's eight parts, four along the way and four across it all, outlines until they're drawn; once answered, each part
// drawn, and observe with nothing under it, the gap
VIS.parts=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.lay[5]);const P=PK.parts,m=12,t=GO(S,now),g=6,narrow=o.lw<440,cols=narrow?2:4,cw=(o.lw-m*2-g*(cols-1))/cols,ch=34;
  line1(ctx,P.ha,m,22,o.lw-m*2,13,{w:800,color:rgbaS(K.lay[4],1)});
  P.along.forEach((s,i)=>chip(ctx,m+(i%cols)*(cw+g),32+Math.floor(i/cols)*(ch+g),cw,ch,s,K.lay[4],{size:12.5,dash:t<1,tint:0.05+0.1*t,glow:6*t}));
  const y1=32+Math.ceil(4/cols)*(ch+g)+20;line1(ctx,P.hx,m,y1,o.lw-m*2,13,{w:800,color:rgbaS([200,186,255],1)});
  P.across.forEach((s,i)=>{const y=y1+10+i*(ch-4+g),gap=i===3;chip(ctx,m,y,o.lw-m*2,ch-4,s,gap&&t>0?mixC([200,186,255],K.bad,t):[200,186,255],{size:12.5,dash:t<1,tint:0.05+0.1*t,glow:6*t});
    if(gap)withA(ctx,t,()=>pill(ctx,o.lw-m-6,y+3,P.gap,K.bad,{size:12,align:"right"}));});};
VIS.parts.h=lw=>{const r=lw<440?2:1;return 32+r*40+20+10+4*36+12;};
// two data platforms, each with its own rights, masks and log; "A third to join them": a third product proposed between them,
// dashed, which goes once answered, as generation's moves onto the one; "Bought, with a platform" (vis.bought): the company just
// bought, kept until it moves
VIS.barriers=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,K.gold);const B=PK.barriers,V=q.vis||{},m=12,t=GO(S,now),three=!V.bought,g=three?8:44,n=three?3:2,w=(o.lw-m*2-g*(n-1))/n,y0=14,hh=o.h-y0-14;
  const box=(x,name,c,a,dash)=>withA(ctx,a,()=>{glass(ctx,x,y0,w,hh,10,c,{fill:"rgba(7,12,24,0.9)",glow:6,ea:0.7});
    if(dash){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=rgbaS(c,0.9);ctx.lineWidth=1.6;rr(ctx,x+4,y0+4,w-8,hh-8,8);ctx.stroke();ctx.restore();}
    lines(ctx,name,x+8,y0+20,w-16,{size:13,max:2,w:800,color:rgbaS(c,1),align:"center"});
    B.rules.forEach((r,i)=>chip(ctx,x+10,y0+52+i*36,w-20,28,r,c,{size:12.5,dash}));});
  const DP=K.lay[5],GN=[150,222,196],TH=[255,186,150];
  box(m,B.one,DP,1,false);
  if(three){box(m+w+g,B.third,TH,1-t,true);box(m+2*(w+g),B.two,GN,1-0.6*t,false);
    withA(ctx,t,()=>{const y=y0+hh/2+18;arrow(ctx,m+2*(w+g)-4,y,m+w+4,y,K.gold,1,{lw:2.4});pill(ctx,m+w+g+w/2,y-34,B.moves,K.gold,{size:12.5,align:"center"});});}
  else{box(m+w+g,B.bought,GN,1,false);const y=y0+hh/2+10;arrow(ctx,m+w+g-4,y,m+w+4,y,t>0?K.gold:K.soft,0.9,{lw:t>0?2.4:2,dash:t>=1?null:[5,4]});
    withA(ctx,t,()=>lines(ctx,B.until,m+w+2,y+14,g-4,{size:11.5,max:3,align:"center",color:rgbaS(K.gold,1)}));}};
VIS.barriers.h=()=>14+52+3*36+14;
// an application and the data platform, and the routes between them: bulk loads by the platform's own connectors, changes as
// events and data served back through the gateway, both by the integration platform. "A read nobody knew": the customer system,
// with a nightly read of it nobody else can see, which goes once answered, as its changes come as events; "One door for
// everything" (vis.all): every route, drawn once answered
VIS.routes=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[150,222,196]);const R=PK.routes,V=q.vis||{},m=12,t=GO(S,now),aw=Math.min(110,(o.lw-m*2)*0.3),iw=Math.min(120,(o.lw-m*2)*0.3),ch=38,AC=K.lay[4],DP=K.lay[5],IP=[200,186,255];
  const rows=[["read",R.read,K.bad],["native",R.native,DP],["event",R.event,IP],["gate",R.gate,IP]].filter(r=>!V.all||r[0]!=="read");
  rows.forEach(([k,label,c],i)=>{const y=12+i*64,ly=y+14,cy=y+22,ax=m,dx=o.lw-m-aw,ix=(o.lw-iw)/2,mid=cy+ch/2,lit=k==="read"?1-t:(V.all||k==="event")?t:0;
    line1(ctx,label,m,ly,o.lw-m*2,12.5,{w:800,color:rgbaS(lit>0.5?(k==="read"?K.bad:K.gold):K.soft,1)});
    const col=k==="read"?K.bad:lit>0?mixC(K.soft,K.gold,lit):K.soft,a=k==="read"?0.35+0.6*(1-t):0.55+0.45*lit,dash=lit>=1?null:[5,4];
    if(k==="native")arrow(ctx,ax+aw+2,mid,dx-4,mid,col,a,{dash,lw:2});
    else if(k==="read")arrow(ctx,dx-2,mid,ax+aw+4,mid,col,a,{dash:[3,4],lw:2});
    else if(k==="event"){arrow(ctx,ax+aw+2,mid,ix-4,mid,col,a,{dash,lw:2});arrow(ctx,ix+iw+2,mid,dx-4,mid,col,a,{dash,lw:2});}
    else{arrow(ctx,dx-2,mid,ix+iw+4,mid,col,a,{dash,lw:2});arrow(ctx,ix-2,mid,ax+aw+4,mid,col,a,{dash,lw:2});}
    chip(ctx,ax,cy,aw,ch,R.app,AC,{size:12,max:2});chip(ctx,dx,cy,aw,ch,R.dp,DP,{size:12,max:2});
    if(k==="event"||k==="gate")chip(ctx,ix,cy,iw,ch,R.ip,IP,{size:11.5,max:2,glow:lit>0?10:6});});};
VIS.routes.h=lw=>12+4*64-4;
// the audit log's lines, each naming who read the bank details: one account until it's answered, then a name on every line
VIS.log=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[255,176,196]);const Lg=PK.log,m=14,t=GO(S,now),w=o.lw-m*2,y0=14,rh=34;
  glass(ctx,m,y0,w,o.h-y0-12,10,[255,176,196],{fill:"rgba(7,12,24,0.92)",glow:6,ea:0.6});line1(ctx,Lg.h,m+14,y0+24,w-28,13.5,{w:800,color:rgbaS([255,176,196],1)});
  Lg.names.forEach((nm,i)=>{const y=y0+40+i*rh;ctx.fillStyle=rgbaS(K.soft,0.12);ctx.fillRect(m+10,y,w-20,rh-6);
    T(ctx,String(3+i*7).padStart(2,"0")+"·02",m+20,y+19,{f:"mono",w:500,size:12.5,color:rgbaS(K.soft,1)});
    withA(ctx,1-t,()=>line1(ctx,Lg.who,m+86,y+19,w-110,13,{w:700,color:rgbaS(K.bad,1)}));withA(ctx,t,()=>line1(ctx,nm,m+86,y+19,w-110,13,{w:700,color:rgbaS(K.gold,1)}));});};
VIS.log.h=()=>14+40+3*34+12;
// a job with a password written in its code, and the secret store; once answered, the password leaves the code, and the job
// asks the store for it by name. Each name takes two lines where one won't fit, and what's under both moves down by one
const twoDy=(ctx,a,b,w)=>(Math.max(fitL(ctx,a,w,13.5,2,800,true)[0].length,fitL(ctx,b,w,13.5,2,800,true)[0].length)-1)*16;
const secretDy=(ctx,lw)=>twoDy(ctx,PK.secret.job,PK.secret.store,(lw-12*2-40)/2-20),secretAy=(ctx,lw)=>(fitL(ctx,PK.secret.ask,(lw-12*2-40)/2-20,12,2,700,true)[0].length-1)*8;
VIS.secret=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[200,186,255]);const Sc=PK.secret,m=12,t=GO(S,now),g=40,w=(o.lw-m*2-g)/2,y0=14,hh=o.h-y0-14,JC=K.lay[4],SC=[200,186,255],dy=secretDy(ctx,o.lw);
  glass(ctx,m,y0,w,hh,10,JC,{fill:"rgba(7,12,24,0.9)",glow:6,ea:0.7});lines(ctx,Sc.job,m+10,y0+22,w-20,{size:13.5,max:2,w:800,color:rgbaS(JC,1)});
  paper(ctx,m+10,y0+38+dy,w-20,52,Sc.code,K.notes[0],{rot:-0.02,strike:t>0.5});
  glass(ctx,m+w+g,y0,w,hh,10,SC,{fill:"rgba(7,12,24,0.9)",glow:6+8*t,ea:0.7});lines(ctx,Sc.store,m+w+g+10,y0+22,w-20,{size:13.5,max:2,w:800,color:rgbaS(SC,1)});
  const kx=m+w+g+w/2,ky=y0+64+dy;ctx.save();ctx.strokeStyle=rgbaS(K.gold,1);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(kx-12,ky,8,0,TP);ctx.moveTo(kx-4,ky);ctx.lineTo(kx+16,ky);ctx.moveTo(kx+10,ky);ctx.lineTo(kx+10,ky+6);ctx.moveTo(kx+15,ky);ctx.lineTo(kx+15,ky+5);ctx.stroke();ctx.restore();
  withA(ctx,t,()=>{arrow(ctx,m+w+2,y0+hh-26,m+w+g-4,y0+hh-26,K.gold,1,{lw:2.4});linesB(ctx,Sc.ask,m+10,y0+hh-44,w-20,{size:12,max:2,align:"center",color:rgbaS(K.gold,1)});});};
VIS.secret.h=(lw,M)=>14+150+(M?secretDy(M,lw)+secretAy(M,lw):0)+14;
// two options tested against the same four measures: a question in every cell, until it's answered
VIS.options=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[200,186,255]);const Op=PK.options,m=12,t=GO(S,now),lw0=Math.min(150,(o.lw-m*2)*0.4),cw=(o.lw-m*2-lw0)/2,y0=12,rh=34;
  Op.cols.forEach((c,j)=>lines(ctx,c,m+lw0+j*cw+4,y0+16,cw-8,{size:12.5,max:2,w:800,align:"center",color:rgbaS(j?K.lay[5]:K.lay[4],1)}));
  Op.rows.forEach((r,i)=>{const y=y0+44+i*rh;ctx.fillStyle=rgbaS(K.soft,i%2?0.06:0.12);ctx.fillRect(m,y,o.lw-m*2,rh-4);line1(ctx,r,m+8,y+20,lw0-12,12.5,{w:700,color:rgbaS(K.ink,0.92)});
    Op.res[i].forEach((v,j)=>{const x=m+lw0+j*cw+cw/2;withA(ctx,1-t,()=>T(ctx,"?",x,y+21,{w:800,size:14,align:"center",color:rgbaS(K.soft,1)}));withA(ctx,t,()=>mark(ctx,x,y+15,v?"ok":"no"));});});};
VIS.options.h=()=>12+44+4*34+8;
// a decision record, kept with the code: its four parts, read once answered
VIS.record=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[200,186,255]);const Rc=PK.record,m=14,t=GO(S,now),w=o.lw-m*2,y0=12,lw0=Math.min(112,w*0.34);
  glass(ctx,m,y0,w,o.h-y0-10,10,[200,186,255],{fill:"rgba(7,12,24,0.94)",glow:6+6*t,ea:0.7});line1(ctx,Rc.h,m+14,y0+24,w*0.55,14,{w:800,color:rgbaS([200,186,255],1)});
  pill(ctx,m+w-12,y0+8,Rc.status,K.good,{size:12,align:"right"});
  Rc.rows.forEach(([k,v],i)=>{const y=y0+46+i*42;line1(ctx,k,m+14,y+14,lw0-8,12.5,{w:800,color:rgbaS(K.gold,1)});withA(ctx,0.3+0.7*t,()=>linesB(ctx,v,m+14+lw0,y+14,w-lw0-28,{size:12.5,max:2,color:rgbaS(K.ink,0.94)}));});};
VIS.record.h=()=>12+46+4*42+6;
// eleven teams: two off the platform's path, on their own server and in spreadsheets; once answered, eight on the path, chosen
VIS.count=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[245,206,140]);const Ct=PK.count,m=14,t=GO(S,now),ry=58,rh=34,w=o.lw-m*2,RC=[245,206,140];
  ctx.save();ctx.fillStyle=rgbaS(RC,0.14);rr(ctx,m,ry,w,rh,rh/2);ctx.fill();ctx.strokeStyle=rgbaS(RC,0.6);ctx.lineWidth=1.4;rr(ctx,m,ry,w,rh,rh/2);ctx.stroke();ctx.restore();
  line1(ctx,Ct.road,m+4,ry-10,w*0.6,12.5,{w:800,color:rgbaS(RC,1)});
  const on=k=>[m+24+k*((w-48)/7),ry+rh/2],off=k=>k===0?[m+w*0.22,ry+rh+46]:k===1?[m+w*0.62,ry+rh+46]:[m+w*(0.14+0.14*(k-2)),ry+rh+92];
  for(let k=0;k<11;k++){const start=k<3?on(k):off(k-3),end=k<8?on(k):start,u=k<3?0:t,[x,y]=[lp(start[0],end[0],eo(u)),lp(start[1],end[1],eo(u))],c=k<8&&t>0.5?K.gold:K.soft;
    ctx.save();ctx.fillStyle=rgbaS(c,0.9);ctx.beginPath();ctx.arc(x,y,9,0,TP);ctx.fill();ctx.restore();}
  Ct.off.forEach((s,i)=>{const[x,y]=off(i);withA(ctx,1-t,()=>line1(ctx,s,x-60,y+26,120,12,{w:700,align:"center",color:rgbaS(K.soft,1)}));});
  withA(ctx,t,()=>pill(ctx,o.lw-m,10,Ct.chose,K.gold,{size:12.5,align:"right"}));};
VIS.count.h=()=>58+34+92+24;
// a team's road to a first data product: gates at its end, where a pull request comes back; once answered, the rules along the
// road instead, as guardrails: two above it, on its rail, and one below
VIS.path=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[245,206,140]);const Pt=PK.path,m=14,t=GO(S,now),ry=o.h/2-18,rh=36,w=o.lw-m*2,RC=[245,206,140];
  ctx.save();ctx.fillStyle=rgbaS(RC,0.14);ctx.fillRect(m,ry,w,rh);ctx.restore();arrow(ctx,m+10,ry+rh/2,m+w-6,ry+rh/2,K.soft,0.7,{dash:[6,6]});
  withA(ctx,1-t,()=>{[0.62,0.74,0.86].forEach(f=>{ctx.fillStyle=rgbaS(K.bad,0.9);ctx.fillRect(m+w*f,ry-8,6,rh+16);});pill(ctx,m+w*0.62,ry+rh+14,Pt.gate,K.bad,{size:12});});
  withA(ctx,t,()=>{ctx.fillStyle=rgbaS(K.gold,0.95);ctx.fillRect(m,ry-4,w,3);ctx.fillRect(m,ry+rh+1,w,3);
    Pt.rails.forEach((r,i)=>{const top=i!==1,cw=w*(top?0.46:0.6),x=m+(i===0?0:i===1?w*0.2:w*0.54),[ls,z]=fitL(ctx,r,cw,12,3,700,true);
      linesB(ctx,r,x,top?ry-14-(ls.length-1)*z*1.2:ry+rh+22,cw,{size:12,max:3,align:"center",color:rgbaS(K.gold,1)});});});};
VIS.path.h=()=>172;
// the storm tool, with twelve years locked inside, and the data platform; once answered, every record sent each night, in an
// open format
const outDy=(ctx,lw)=>{const g=Math.min(110,lw*0.26);return twoDy(ctx,PK.out.tool,PK.out.dp,(lw-12*2-g)/2-20);};
VIS.out=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[255,186,150]);const Ot=PK.out,m=12,t=GO(S,now),g=Math.min(110,o.lw*0.26),w=(o.lw-m*2-g)/2,y0=14,hh=o.h-y0-14,TC=[255,186,150],DP=K.lay[5],dy=outDy(ctx,o.lw);
  glass(ctx,m,y0,w,hh,10,TC,{fill:"rgba(7,12,24,0.9)",glow:6,ea:0.7});lines(ctx,Ot.tool,m+10,y0+22,w-20,{size:13.5,max:2,w:800,color:rgbaS(TC,1)});lines(ctx,Ot.inside,m+10,y0+46+dy,w-20,{size:12.5,max:2,color:rgbaS(K.soft,1)});
  const lx=m+w-30,ly=y0+hh-34,op=t*8;ctx.save();ctx.strokeStyle=rgbaS(t>0.5?K.good:K.bad,1);ctx.lineWidth=2.4;ctx.strokeRect(lx-9,ly,18,14);ctx.beginPath();ctx.arc(lx,ly-op,6,Math.PI,0);ctx.lineTo(lx+6,ly-op+4);ctx.stroke();ctx.restore();
  glass(ctx,m+w+g,y0,w,hh,10,DP,{fill:"rgba(7,12,24,0.9)",glow:6+8*t,ea:0.7});lines(ctx,Ot.dp,m+w+g+10,y0+22,w-20,{size:13.5,max:2,w:800,color:rgbaS(DP,1)});
  withA(ctx,t,()=>{arrow(ctx,m+w+4,y0+hh/2+8,m+w+g-4,y0+hh/2+8,K.gold,1,{lw:2.4});linesB(ctx,Ot.night,m+w+2,y0+hh/2-26,g-4,{size:11.5,max:3,align:"center",color:rgbaS(K.gold,1)});});};
VIS.out.h=(lw,M)=>14+110+(M?outDy(M,lw):0)+14;
// hosting capacity on the map, from its owner down to its files; once answered, the lines from the files up to Grace, lit
VIS.trace=(ctx,o,now,q,S)=>{ground(ctx,o.lw,o.h,[255,234,130]);const Tr=PK.trace,m=12,t=GO(S,now),n=Tr.chain.length,w=Math.min(300,o.lw-m*2),x=(o.lw-w)/2,eh=36,g=14,LCs=[K.lay[2],K.lay[2],K.lay[4],K.lay[3],K.lay[5]];
  for(let i=0;i<n-1;i++){const y=12+i*(eh+g),u=cl(t*(n-1)-(n-2-i),0,1);joinLine(ctx,x+w/2,y+eh,x+w/2,y+eh+g,u);}
  Tr.chain.forEach((s,i)=>el(ctx,x,12+i*(eh+g),w,eh,s,LCs[i],Tr.g[i],{size:13.5,hi:i===0?t:0}));};
VIS.trace.h=()=>12+5*36+4*14+12;
})();
