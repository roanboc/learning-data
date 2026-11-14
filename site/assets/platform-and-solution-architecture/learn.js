/* Learning Data: Platform and solution architecture. The labs (Take it apart) and the scenarios (Make the call) of the whole series,
   from one engine: the series' labs page and scenarios page load a film's bundle (for the films' own parts: glass, paper,
   ArchiMate's glyphs and the series' own), the words (learn.en.js or learn.es.js, which set window.PSA), and this file.
   The engine is Data architecture's (assets/data-architecture/learn.js), itself The map before the data's, copied into this
   series' folder so each series keeps its own, with the one kind of lab these films need and the pictures they draw:
     deal       cards dealt one at a time: put each where it belongs, and see why before the next (every lab of the series).
                A card may carry options of its own (opts) in place of the lab's boxes: the series' own lab, Model the data
                practice, places ten parts of a data product as ArchiMate elements, then deals six joins, each a choice of
                relationships, and its picture draws the map as it's built (PIC.practice)
   and one kind of scenario, a choice. A page shows a lab's boxes, its cards and a scenario's options in the order the words give
   them, so the words spread the right answers (site-tools/check_site.py reads them).
   Every picture is laid out for its own width on the page, drawn 320 to 640 units wide (a unit is a CSS pixel there), so its
   words stay big enough to read on a phone. Things move with a spring and settle, or jump to where they end when the visitor asks
   for reduced motion, and every change is also said in words (.lab-say), so nobody needs the picture to follow.
   The page's app element (#series-labs or #series-quiz) carries the progress prefix (data-store) and the films (data-films: by
   number, each film's title, page and chapter starts), both from site-tools/build_series.py.
   Progress stays in this browser: "visited" (the lab ids) and "quiz" (answers by scenario number); path.js paints the course bar. */
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
const why=(ok,txt)=>h("p",{class:"ps-why"},h("b",{class:ok?"ok":"no"},ok?U.right:U.notQuite)," ",txt);
// what the lab says (.lab-say); at the end, its box on the page says it, so the line keeps it only for a screen reader
const sayIt=(say,t)=>{say.classList.remove("sr");say.textContent=t;},endSay=(say,t)=>{say.textContent=t;say.classList.add("sr");};
function focusIn(el){if(!el)return;try{el.focus({preventScroll:true});}catch(e){el.focus();}const r=el.getBoundingClientRect();if(r.bottom>innerHeight-8||r.top<120)el.scrollIntoView({block:"center",behavior:RM()?"auto":"smooth"});}

/* ---------- deal: cards dealt one at a time ---------- */
// Each lab of this kind has a picture (PIC[id], or the board every lab of this series shares), which lands each card where it
// belongs; S is what has happened so far.
const PIC={};
function labDeal(Lb){const W=Lb.w,its=W.items,n=its.length,S={i:0,done:[],first:{},t:{},fx:{}},box=h("div",{class:"lab ps-lab"}),say=say0();
  const mk=PIC[Lb.id]||PIC.board,pic=picOf(Lb,()=>mk(Lb,S)),st=pic?stage(pic.lay,pic.draw,(W.pic&&W.pic.alt)||Lb.name):null;
  const deal=h("div",{class:"ps-deal"}),ctrl=h("div",{class:"lab-controls"});
  const optsOf=it=>it.opts||W.buckets,lab=(it,k)=>(optsOf(it).find(o=>o[0]===k)||[,""])[1];
  const right=()=>S.done.filter(i=>S.first[i]===its[i].b).length;
  function status(){if(S.i<n)sayIt(say,fill(U.placed,{n:S.done.length,of:n})+(S.done.length?" · "+right()+" "+U.firstTry:""));else endSay(say,fill(W.end,{n:right(),of:n}));}
  function show(focus){deal.replaceChildren();ctrl.replaceChildren();if(pic&&pic.show)pic.show(S.i);if(st)st.kick(900);
    if(S.i>=n)return finish(focus);
    const i=S.i,it=its[i],O=optsOf(it),ix=O.map((o,j)=>j);
    const extra=it.e||it.note||(it.j?U.join:null)||(it.film&&it.from?U.fromFilm+" "+filmN(it.film)+(filmName(it.film)?", "+filmName(it.film):""):null);
    const cardEl=h("div",{class:"ps-card"},h("p",{class:"k"},fill(U.card,{n:i+1,of:n})),h("p",{class:"t",id:"ps-t-"+Lb.id},it.t),extra?h("p",{class:"e"},extra):null);
    const groupsOf=()=>W.groups&&!it.opts?W.groups.map(([g,ks])=>h("div",{class:"ps-group"},h("span",{class:"ps-gl"},g),...ks.map(k=>bt(O.findIndex(o=>o[0]===k))))):ix.map(j=>bt(j));
    const opts=h("div",{class:"ps-opts"+(W.groups&&!it.opts?" grouped":""),role:"group","aria-labelledby":"ps-t-"+Lb.id});
    function bt(j){const o=O[j];return h("button",{type:"button","data-k":o[0],onclick:()=>answer(o[0])},o[1]);}
    opts.append(...groupsOf());deal.append(cardEl,opts);
    function answer(k){if(S.first[i]!=null)return;S.first[i]=k;S.t[i]=performance.now();S.done.push(i);const ok=k===it.b;
      opts.querySelectorAll("button").forEach(b=>{b.disabled=true;if(b.dataset.k===it.b)b.classList.add("ok");else if(b.dataset.k===k)b.classList.add("no");});
      const no=!ok&&it.no&&it.no[k]?it.no[k]+" ":"",bel=!ok&&!it.opts?fill(W.belongs||U.belongs,{b:lab(it,it.b)})+" ":"";
      deal.append(why(ok,bel+no+it.why));if(pic&&pic.answer)pic.answer(i,k);if(st)st.kick(ok?FLY[0]:FLY[1]);
      const nx=btn(S.i+1<n?U.go+" →":U.seeAll,()=>{S.i++;show(true);},"go");ctrl.replaceChildren(nx);status();focusIn(nx);}
    status();if(focus)focusIn(opts.querySelector("button"));}
  function finish(focus){const again=btn(U.again,()=>{S.i=0;S.done=[];S.first={};S.t={};S.fx={};show(true);},"sm");
    deal.append(h("p",{class:"ps-end"},fill(W.end,{n:right(),of:n})));ctrl.replaceChildren(again);status();if(focus)focusIn(deal.querySelector("button")||again);}
  box.append(...(st?[st.el]:[]),info(W.prompt),deal,ctrl,say);show(false);return box;}

/* ---------- the picture of the deal labs ---------- */
// Every lab of the series draws the same picture from its words: a band for each box, in the lab's colours (COLS), its name at the
// top, and the cards landing in the band each belongs to, from the pile in the corner. A card first put in the wrong band lands
// there, shakes, and moves on; each band fills as its cards land.
const COLS={test:[K.lay[4],K.lay[5],K.gold],
  parts:[[140,214,255],[150,222,196],[160,224,140],[255,209,102],[200,186,255],[255,176,196],[245,206,140],[255,186,150]],
  second:[[255,186,150],[255,209,102],[150,222,196]],routes:[[160,224,140],[140,214,255],[200,186,255]],
  pass:[[255,176,196],[255,209,102],[200,186,255],[140,214,255],[120,240,170]],context:[[140,214,255],[160,178,205],[255,209,102],[200,186,255]],
  path:[[245,206,140],[150,222,196],[255,186,150],[140,214,255]],exit:[[150,222,196],[255,209,102],[255,186,150]]};
PIC.board=(Lb,S)=>{const W=Lb.w,its=W.items,keys=W.buckets.map(b=>b[0]),pal=COLS[Lb.id]||[rgb(Lb.c)],col=k=>pal[keys.indexOf(k)%pal.length],nameOf=k=>W.buckets.find(b=>b[0]===k)[1];
  const lay=(lw,ctx)=>{const x0=12,cw=lw-x0*2-8-24,o={lw,x0,rows:[],slot:{},row:{}};let y=56;
    keys.forEach(k=>{const mine=its.map((it,i)=>[it,i]).filter(([it])=>it.b===k),f=flow(ctx,mine.map(([it])=>it.s),cw,13,6),sh=30+Math.max(30,f.h)+10,r={k,y,h:sh,c:col(k)};o.rows.push(r);o.row[k]=r;
      mine.forEach(([it,i],j)=>{const p=f.pos[j];o.slot[i]={x:x0+14+p.x,y:y+30+p.y,w:p.w,h:p.h};});y+=sh+6;});
    o.h=y+6;o.deck=[lw-x0-74,10];return o;};
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));const left=its.length-S.done.length;
    o.rows.forEach(r=>{const n=its.filter(it=>it.b===r.k).length,got=S.done.filter(i=>its[i].b===r.k&&since(now,S.t[i])>500).length;
      slab(ctx,o.x0,r.y,o.lw-o.x0*2-8,r.h,"",r.c,{sk:8,label:false,fill:n?got/n*0.6:0});
      line1(ctx,nameOf(r.k),o.x0+16,r.y+20,o.lw-o.x0*2-44,14,{w:800,color:rgbaS(mixC(r.c,K.ink,0.35),1)});});
    // what's still to place: a pile that shrinks as the cards land
    const[dx,dy]=o.deck;for(let j=Math.min(left,4)-1;j>=0;j--)paper(ctx,dx+j*3,dy+j*2,70,34,"",K.notes[j%4],{rot:(j-1.5)*0.05});
    if(left){T(ctx,String(left),dx+38,dy+24,{w:800,size:17,align:"center",color:rgbaS(K.inkd,0.9)});line1(ctx,W.pic.now,o.x0+4,dy+24,dx-o.x0-18,13,{w:700,color:rgbaS(K.soft,1)});}
    S.done.forEach(i=>{const it=its[i],B=o.slot[i],ok=S.first[i]===it.b,wr=o.row[S.first[i]],X=ok||!wr?null:[o.x0+14,wr.y+30],[x,y,s,bad]=fly(now,S.t[i],ok,[dx,dy],[B.x,B.y],X);
      scaled(ctx,x,y,B.w,B.h,s,()=>paper(ctx,x,y,B.w,B.h,it.s,K.notes[i%4],{edge:bad?K.bad:null,mark:!bad&&ok&&since(now,S.t[i])>FLY[0]-80?"ok":null}));});};
  return{lay,draw,show:()=>{},reset:()=>{}};};

/* ---------- the picture of Model the data practice ---------- */
// Tomás's map, built as the cards are dealt: four layers, business to technology. Each part lands as an ArchiMate element in its
// layer, in its layer's colour (Grace is on the map already); each join is drawn as ArchiMate draws it, under the elements; and at
// the end the seam shows, between the files and the software that reads them. Where each part sits is the map's, by its key (k):
// [layer, row, column], in two columns on a phone and three from 440 units, 22 units apart, so the ends of a line between two
// neighbours (a diamond, a dot, a head) show whole. A join between layers that aren't next to each other goes round the right-hand
// side, so it never crosses a part.
const PRAC={wide:{grace:[0,0,0],role:[0,0,1],product:[0,1,0],contract:[0,1,1],object:[0,1,2],data:[1,0,2],dash:[2,0,0],port:[2,0,1],pipeline:[2,0,2],software:[3,0,1],files:[3,0,2]},
  narrow:{grace:[0,0,0],role:[0,0,1],product:[0,1,0],contract:[0,1,1],object:[0,2,1],data:[1,0,1],dash:[2,0,0],port:[2,0,1],pipeline:[2,1,1],software:[3,0,0],files:[3,0,1]}};
// the glyph of each kind of element: a data object is drawn as a business object is, in its own layer's colour
const GL={actor:"actor",role:"role",product:"product",contract:"contract",object:"object",bservice:"service",data:"object",component:"component",interface:"interface",software:"software",tservice:"service",artifact:"artifact"};
// a relationship, as ArchiMate draws it, along the points P (from the source to the target), drawn in up to t (0 to 1) of its
// length: assignment (a dot at the source, a head at the target), aggregation (a hollow diamond at the whole, the source),
// composition (a filled diamond at the whole, and nothing at the part), realisation (dotted, a hollow head at the target),
// serving (an open head at the target), access (dotted, a small open head at what's written), association (a plain line)
function rel(ctx,P,kind,col,t,a){if(t<=0||a<=0.01||!P||P.length<2)return;const seg=[];let tot=0;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(d);tot+=d;}
  let left=tot*cl(t,0,1);const at=(p,a0,dx,dy)=>[p[0]+dx*Math.cos(a0)-dy*Math.sin(a0),p[1]+dx*Math.sin(a0)+dy*Math.cos(a0)];
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgbaS(col,1);ctx.fillStyle=rgbaS(col,1);ctx.lineWidth=1.8;ctx.lineCap="round";ctx.lineJoin="round";
    if(kind==="real")ctx.setLineDash([2,4]);else if(kind==="access")ctx.setLineDash([1.5,3.5]);
    ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);let an=Math.atan2(P[1][1]-P[0][1],P[1][0]-P[0][0]);
    for(let i=1;i<P.length&&left>0;i++){const d=seg[i-1],u=Math.min(1,left/d);ctx.lineTo(lp(P[i-1][0],P[i][0],u),lp(P[i-1][1],P[i][1],u));an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);left-=d;}
    ctx.stroke();ctx.setLineDash([]);const a0=Math.atan2(P[1][1]-P[0][1],P[1][0]-P[0][0]),s=P[0];
    if(kind==="assign"){const d=at(s,a0,3.6,0);ctx.beginPath();ctx.arc(d[0],d[1],3.4,0,TP);ctx.fill();}
    if(kind==="agg"||kind==="comp"){const d1=at(s,a0,7,-4.5),d2=at(s,a0,14,0),d3=at(s,a0,7,4.5);ctx.beginPath();ctx.moveTo(s[0],s[1]);ctx.lineTo(d1[0],d1[1]);ctx.lineTo(d2[0],d2[1]);ctx.lineTo(d3[0],d3[1]);ctx.closePath();
      if(kind==="comp")ctx.fill();else{ctx.fillStyle="rgba(7,12,24,1)";ctx.fill();ctx.stroke();}}
    if(t>=1){const p=P[P.length-1];
      if(kind==="assign"){const h1=at(p,an,-8,-4.5),h2=at(p,an,-8,4.5);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(h1[0],h1[1]);ctx.lineTo(h2[0],h2[1]);ctx.closePath();ctx.fill();}
      else if(kind==="real"){const h1=at(p,an,-11,-6),h2=at(p,an,-11,6);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(h1[0],h1[1]);ctx.lineTo(h2[0],h2[1]);ctx.closePath();ctx.fillStyle="rgba(7,12,24,1)";ctx.fill();ctx.stroke();}
      else if(kind==="serve"||kind==="access"){const z=kind==="access"?6:9,h1=at(p,an,-z,-z*0.62),h2=at(p,an,-z,z*0.62);ctx.beginPath();ctx.moveTo(h1[0],h1[1]);ctx.lineTo(p[0],p[1]);ctx.lineTo(h2[0],h2[1]);ctx.stroke();}}
    ctx.restore();});}
PIC.practice=(Lb,S)=>{const W=Lb.w,its=W.items,G=W.given||[],LY=W.pic.layers,LC=[K.lay[2],K.lay[3],K.lay[4],K.lay[5]];let endT=0;
  const lay=(lw)=>{const m=12,wide=lw>=440,P=wide?PRAC.wide:PRAC.narrow,cols=wide?3:2,g=22,eh=50,top=58,lab=26,pad=10;
    const ix=m+10,iw=lw-m*2-20-14,cw=(iw-g*(cols-1))/cols,rows=[0,0,0,0];Object.values(P).forEach(([b,r])=>{rows[b]=Math.max(rows[b],r+1);});
    const o={lw,m,cw,g,bands:[],box:{},xr:lw-m-9};let y=top;
    for(let b=0;b<4;b++){const hh=lab+rows[b]*(eh+g)-g+pad;o.bands.push({y,h:hh,c:LC[b],name:LY[b]});y+=hh+6;}
    Object.keys(P).forEach(k=>{const[b,r,c]=P[k];o.box[k]={x:ix+c*(cw+g),y:o.bands[b].y+lab+r*(eh+g),w:cw,h:eh,b};});
    o.h=y+4;o.deck=[lw-m-74,10];return o;};
  // where a join's line runs: side to side, up or down, or round the right-hand side when layers lie between its ends
  const ends=(o,f,t)=>{const A=o.box[f],B=o.box[t];if(!A||!B)return null;
    if(Math.abs(A.b-B.b)>1){const ya=A.y+A.h/2,yb=B.y+B.h/2;return[[A.x+A.w,ya],[o.xr,ya],[o.xr,yb],[B.x+B.w,yb]];}
    if(Math.abs(A.y-B.y)<4)return A.x<B.x?[[A.x+A.w,A.y+A.h/2],[B.x,B.y+B.h/2]]:[[A.x,A.y+A.h/2],[B.x+B.w,B.y+B.h/2]];
    const x=A.x+A.w/2;return A.y<B.y?[[x,A.y+A.h],[x,B.y]]:[[x,A.y],[x,B.y+B.h]];};
  const lc=mixC(K.ink,rgb(Lb.c),0.3);
  const draw=(ctx,o,now)=>{ground(ctx,o.lw,o.h,rgb(Lb.c));const left=its.length-S.done.length;
    o.bands.forEach(B=>{slab(ctx,o.m,B.y,o.lw-o.m*2,B.h,"",B.c,{sk:8,label:false,fill:0});line1(ctx,B.name,o.m+12,B.y+18,o.lw*0.45,13,{w:800,color:rgbaS(mixC(B.c,K.ink,0.35),1)});});
    S.done.forEach(i=>{const it=its[i];if(!it.j)return;rel(ctx,ends(o,it.j[0],it.j[1]),it.b,lc,RM()?1:eo(since(now,S.t[i])/700),1);});
    G.forEach(gv=>{const B=o.box[gv.k];if(B)el(ctx,B.x,B.y,B.w,B.h,gv.s,o.bands[B.b].c,gv.g,{size:13,max:3});});
    // what's still to place: a pile that shrinks as the cards land
    const[dx,dy]=o.deck;for(let j=Math.min(left,4)-1;j>=0;j--)paper(ctx,dx+j*3,dy+j*2,70,34,"",K.notes[j%4],{rot:(j-1.5)*0.05});
    if(left){T(ctx,String(left),dx+38,dy+24,{w:800,size:17,align:"center",color:rgbaS(K.inkd,0.9)});line1(ctx,W.pic.now,o.m+4,dy+24,dx-o.m-18,13,{w:700,color:rgbaS(K.soft,1)});}
    // each part flies from the pile to its place; one first put down as the wrong kind lands with a red edge, which fades
    S.done.forEach(i=>{const it=its[i];if(it.j||!it.k)return;const B=o.box[it.k];if(!B)return;const ok=S.first[i]===it.b,e=since(now,S.t[i]),[x,y,s]=fly(now,S.t[i],true,[dx,dy],[B.x,B.y],null),c=o.bands[B.b].c;
      scaled(ctx,x,y,B.w,B.h,s,()=>el(ctx,x,y,B.w,B.h,it.s,c,GL[it.b]||"object",{size:13,max:3}));
      if(!ok&&e<FLY[1]){ctx.save();ctx.strokeStyle=rgbaS(K.bad,cl((FLY[1]-e)/500,0,1));ctx.lineWidth=2.4;rr(ctx,x-1,y-1,B.w+2,B.h+2,7);ctx.stroke();ctx.restore();}
      else if(ok&&e>FLY[0]-80)mark(ctx,B.x+B.w-2,B.y+2,"ok");});
    // the end: the seam between the files and the software that reads them, its name just after the line, clear of the ticks
    const A=o.box.software,F=o.box.files,u=endT?(RM()?1:eo((now-endT-100)/700)):0;
    if(u>0&&A&&F){const x=(A.x+A.w+F.x)/2,Bd=o.bands[F.b];withA(ctx,u,()=>{ctx.save();ctx.strokeStyle=rgbaS(K.gold,1);ctx.lineWidth=2.6;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(x,Bd.y+28);ctx.lineTo(x,Bd.y+Bd.h-4);ctx.stroke();ctx.restore();
      const w=Math.min(o.lw*0.4,TW(ctx,W.pic.seam,13,800)+2);line1(ctx,W.pic.seam,Math.min(x+6,o.lw-o.m-w-4),Bd.y+18,w,13,{w:800,color:rgbaS(K.gold,1)});});}};
  return{lay,draw,show:i=>{endT=i>=its.length?(endT||performance.now()):0;},reset:()=>{endT=0;}};};

const BUILD={deal:labDeal};

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
  const sel=h("select",{id:"ps-film"},h("option",{value:"0"},U.allFilms),...films.map(n=>h("option",{value:String(n)},filmN(n)+(filmName(n)?" · "+filmName(n):""))));
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");bar.append(dots,score);
  app.append(h("div",{class:"quiz"},h("p",{class:"ps-filter"},h("label",{for:"ps-film"},U.filter),sel),bar,card));
  const list=()=>QS.filter(q=>!film||q.film===film),labOf=id=>L.labs.find(x=>x.id===id)||{name:"",c:"#a0b2cd"};
  function paintBar(){const Q=list();dots.replaceChildren(...Q.map((q,i)=>{const a=ans[q.n];return h("button",{type:"button",class:a?(a.ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1)+(a?" · "+(a.ok?U.right:U.notQuite):""),onclick:()=>{cur=i;render(true);}},String(i+1));}));
    const n=Q.filter(q=>ans[q.n]).length,ok=Q.filter(q=>ans[q.n]&&ans[q.n].ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+n+" "+U.answered+" · "+(Q.length-n)+" "+U.toGo));}
  function done(q,ok,pick){ans[q.n]={ok,pick};put("quiz",ans);paintBar();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why));
  function foot(q){const Q=list(),last=cur===Q.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:"../labs/#"+q.lab},U.explore+" "+labOf(q.lab).name),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results(true);else{cur+=1;render(true);}}},last?U.results:U.nextQ));}
  function render(focus){paintBar();const Q=list(),q=Q[cur];if(!q)return;const f=VIS[q.vis.k],a=ans[q.n],body=h("div",{class:"qbody"}),out=h("div"),S={done:a?performance.now()-1e5:0};
    const vis=DRAW&&f?stage((lw,M)=>({lw,h:Math.round(f.h?f.h(lw,M,q):cl(lw*0.56,190,300))}),(ctx,o,now)=>f(ctx,o,now,q,S),(L.pics.alt&&L.pics.alt[q.vis.k])||q.title):null;
    const F=FILMS[q.film]||{};body.append(h("p",{class:"qtag",style:"--c:"+labOf(q.lab).c},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+Q.length+" · "+filmN(q.film)+(F.t?", "+F.t:"")),h("h3",{tabindex:"-1"},q.title),h("p",{class:"qsit"},q.sit));
    const fin=(ok,pick)=>{if(!a)done(q,ok,pick);S.done=performance.now();if(vis)vis.kick(1600);out.replaceChildren(feed(ok,q),foot(q));};
    {const O=q.opts,bx=h("div",{class:"qopts"});
      O.forEach((o,j)=>{bx.append(h("button",{type:"button",class:"qopt","data-j":j,onclick:()=>pick(j)},h("span",{class:"k"},"ABCDE"[j]),h("span",null,o.t)));});
      function pick(j,quiet){[...bx.children].forEach(b=>{const k=+b.dataset.j;b.disabled=true;if(O[k].ok)b.classList.add("ok");});const o=O[j],b=bx.querySelector('[data-j="'+j+'"]');
        if(!o.ok){b.classList.add("no");if(o.why)b.append(h("small",null,o.why));}fin(!!o.ok,j);if(!quiet)focusIn(out.querySelector(".btn"));}
      body.append(bx);if(a&&a.pick!=null&&O[a.pick])pick(a.pick,true);}
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis"},vis?vis.el:null),body));if(focus){const t=body.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}card.scrollIntoView({block:"nearest",behavior:RM()?"auto":"smooth"});}}
  function results(focus){paintBar();const Q=list(),ok=Q.filter(q=>ans[q.n]&&ans[q.n].ok).length,n=Q.length,band=L.done[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};Q.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(ans[q.n]&&ans[q.n].ok)by[k].ok++;});const open=QS.filter(q=>!ans[q.n]).length;
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/Math.max(1,n)*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",{tabindex:"-1"},band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:"../labs/#"+k,class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+labOf(k).c},h("i"),labOf(k).name+" · "+by[k].ok+"/"+by[k].n))),
      film&&open?h("p",{class:"ps-open"},h("a",{href:"#",onclick:e=>{e.preventDefault();setFilm(0);}},fill(U.stillOpen,{n:open}))):null,
      h("button",{type:"button",class:"btn",onclick:()=>{Q.forEach(q=>delete ans[q.n]);put("quiz",ans);cur=0;render(true);}},U.again))));
    if(focus){const t=card.querySelector("h3");try{t.focus({preventScroll:true});}catch(e){}}}
  function setFilm(n,keepHash){film=films.includes(n)?n:0;sel.value=String(film);app.dataset.film=String(film);if(!keepHash&&history.replaceState)history.replaceState(null,"",film?"#film-"+film:location.pathname+location.search);
    const Q=list(),first=Q.findIndex(q=>!ans[q.n]);if(first<0)results(false);else{cur=first;render(false);}}
  sel.addEventListener("change",()=>setFilm(+sel.value));
  const fromHash=()=>{const m=(location.hash||"").match(/^#film-(\d+)$/);return m?+m[1]:0;};
  // the first one waits for the rest of this file, where the pictures are
  window.addEventListener("hashchange",()=>setFilm(fromHash(),true));Promise.resolve().then(()=>setFilm(fromHash(),true));}


/* ---------- the scenarios' pictures ---------- */
// Each draws the situation, not its answer; once it's answered (S.done), its lines are drawn in, in gold
const PK=L.pics,GO=(S,now)=>S.done?eo(since(now,S.done)/700):0;
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
