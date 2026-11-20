/* Learning Data: AI and continuous architecture. The labs (Take it apart) and the scenarios (Make the call) of the whole series, from
   one engine: the series' labs page and scenarios page load Every change, checked's bundle (for the films' own parts: glass, paper,
   the agent's orb, the stamped brick), the words (learn.en.js or learn.es.js, which set window.ACA), and this file.
   Every lab is a playground, one per film (the author, 18 November 2026): the visitor switches, picks and presses, watches what
   follows in its picture, and ticks four experiments as they happen. The scenarios are the series' evaluation, twelve choices,
   their options in the order the words write them, where the words spread the right ones.
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
  function loop(){st.raf=-1;paint();st.raf=performance.now()<st.until?requestAnimationFrame(loop):0;}
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
const lc=s=>s&&!/^[A-Z]{2}/.test(s)?s[0].toLowerCase()+s.slice(1):s;
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
function labPlay(Lb){const W=Lb.w,G=W.goals,box=h("div",{class:"lab aca-lab","style":"--c:"+Lb.c}),say=h("p",{class:"lab-say",role:"status"});
  const all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const ctrl=h("div",{class:"lab-controls aca-ctrl"}),read=h("div",{class:"lab-read"}),list=h("ol",{class:"aca-goals","aria-label":U.goals}),end=h("div",{class:"aca-endbox"});
  let st=null,P=null,rd=[];
  const api={
    say:(t,tone)=>{say.replaceChildren(tone?h("span",{class:tone},...rich(t)):h("span",null,...rich(t)));},
    kick:ms=>{if(st)st.kick(ms);},relayout:()=>{if(st)st.relayout();},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];put("goals",all);paintGoals(k);},
    refresh:()=>{rd.forEach(([v,f])=>{v.textContent=f();});},
    group:(label)=>{const g=h("div",{class:"aca-row"},label?h("span",{class:"lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","data-k":k,"aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);api.refresh();}},l);g.append(b);});row.append(g);return g;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"chip-btn","aria-pressed":on?"true":"false",onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();}},label);row.append(b);return b;},
    // a button that steps through states, its label saying which: "name: state"
    cycle:(row,label,states,cur,fn)=>{let i=Math.max(0,states.findIndex(s=>s[0]===cur));const b=h("button",{type:"button",class:"chip-btn aca-cyc","data-cycle":label});
      const paint=()=>{b.textContent=label+": "+states[i][1];b.setAttribute("data-state",states[i][0]);};paint();
      b.addEventListener("click",()=>{i=(i+1)%states.length;paint();fn(states[i][0]);api.refresh();});row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=h("button",{type:"button",class:"chip-btn"+(cls?" "+cls:""),onclick:()=>{fn();api.refresh();}},label);row.append(b);return b;}};
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":"","data-k":k},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"aca-end"},...rich(W.end))]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"ok"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end.replace(/<\/?b>/g,"")));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){ctrl.replaceChildren();read.replaceChildren();rd=[];P=PLAY[Lb.id](Lb,api);
    st=DRAW?stage(P.lay,(ctx,o,now)=>P.draw(ctx,o,now),W.alt||Lb.name):null;
    (P.readouts||[]).forEach(([label,f])=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));rd.push([v,f]);});api.refresh();
    const again=h("button",{type:"button",class:"chip-btn sm aca-again",onclick:()=>{got=new Set();all[Lb.id]=[];put("goals",all);box.replaceChildren();build();api.say(W.start);paintGoals();}},U.again);
    box.append(...(st?[st.el]:[]),info(W.prompt),h("div",{class:"aca-goalbox"},h("p",{class:"aca-gh"},U.goals),list),ctrl,read,say,end,h("div",{class:"aca-foot"},again));}
  build();api.say(W.start);paintGoals();return box;}

// a row: its mark at the left (r.ic), its words on up to two lines, its state in a pill on the right, a tick or a cross once judged
function rowW(ctx,o,r,y,rh){const x=o.m,w=o.lw-o.m*2;card(ctx,x,y,w,rh,r.c,null,{glow:r.hot?16:5,tint:r.hot?0.18:0.07,dash:r.dash,a:r.a});
  withA(ctx,r.a==null?1:r.a,()=>{let lx=x+10;if(r.ic){r.ic(ctx,x+18,y+rh/2);lx=x+34;}const pw=r.v?TW(ctx,r.v,12)+20:0,lw=w-(lx-x)-pw-(r.v?18:12);
    const n=fitL(ctx,r.t,lw,13,2,800,true)[0].length;lines(ctx,r.t,lx,y+rh/2+4.5-(n-1)*7.8,lw,{size:13,max:2,w:800,color:rgbaS(K.ink,0.96)});
    if(r.v)pill(ctx,x+w-8,y+(rh-24)/2,r.v,r.vc||r.c,{align:"right",size:12});if(r.mark)mark(ctx,x+w-2,y+2,r.mark);});return y+rh+6;}
// a line of words across the picture, in a colour, fading in from t0
function note(ctx,o,s,y,col,u){lines(ctx,s,o.m,y,o.lw-o.m*2,{size:13,max:2,w:800,align:"center",color:rgbaS(col,u==null?1:u)});}

/* ---------- 1 · Agents on the map: how far, task by task ---------- */
// The chat's first version ran every task alone. Step each task down, or up, to how far it may go; name who answers for it; run a week.
PLAY.far=(Lb,api)=>{const W=Lb.w,TK=W.tasks,S={st:{},owner:false,week:null,res:{}};TK.forEach(t=>S.st[t.k]="run");
  const r1=api.group(W.stepL);TK.forEach(t=>api.cycle(r1,t.s,W.steps,"run",k=>{S.st[t.k]=k;S.week=null;api.kick(500);api.say(fill(W.msg.set,{t:t.s,s:W.steps.find(x=>x[0]===k)[1]}));}));
  const r2=api.group(W.ownL);api.toggle(r2,W.ownT,false,v=>{S.owner=v;S.week=null;api.kick(500);api.say(v?W.msg.ownOn:W.msg.ownOff);});
  const r3=api.group();api.btn(r3,W.weekB,()=>{S.week=performance.now();TK.forEach(t=>S.res[t.k]=t.r[S.st[t.k]]);api.kick(1800);
    const bad=TK.find(t=>S.res[t.k]==="bad"),slow=TK.find(t=>S.res[t.k]==="slow");
    if(bad)api.say(bad.m.bad,"no");else if(!S.owner)api.say(W.msg.noOwner,"no");else api.say(slow?fill(W.msg.slow,{m:slow.m.slow}):W.msg.allOk,"ok");
    if(S.res.bill==="ok")api.reach("bill");if(S.st.plan!=="run")api.reach("plan");if(S.res.check==="ok")api.reach("check");if(S.owner&&!bad)api.reach("owner");},"go");
  const lay=(lw)=>{const m=12,o={lw,m,rh:46};o.y0=58;o.h=o.y0+TK.length*(o.rh+6)+8;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,u=into(now,S.week,900);
    orb(ctx,m+16,28,12,now);line1(ctx,W.agent,m+36,26,o.lw/2-40,14,{w:800,color:rgbaS(K.ai,1)});line1(ctx,W.agentSub,m+36,42,o.lw/2-40,12,{w:700,color:rgbaS(K.soft,1)});
    pill(ctx,o.lw-m,16,S.owner?W.owner:W.nobody,S.owner?K.biz:K.bad,{align:"right",size:12});
    let y=o.y0;TK.forEach((t,i)=>{const k=S.st[t.k],lv=W.steps.findIndex(x=>x[0]===k),r=S.week!=null&&u>=(i+1)/(TK.length+1)?S.res[t.k]:null;
      y=rowW(ctx,o,{t:t.t,v:W.steps[lv][1],c:k==="run"?K.ai:mixC(K.ai,K.biz,0.5-lv*0.12),vc:k==="run"?K.ai:K.biz,ic:(c,x,yy)=>IC.steps(c,x,yy,K.ai,lv),
        hot:r==="bad",mark:r==="ok"?"ok":r==="bad"?"no":null,dash:r==="slow"},y,o.rh);});};
  return{lay,draw,readouts:[[W.read.alone,()=>String(TK.filter(t=>S.st[t.k]==="run").length)],[W.read.plans,()=>S.week!=null&&S.st.plan==="run"?"212":"0"]]};};

/* ---------- 2 · The AI platform: shared, or its own ---------- */
// Six agents, each reaching its model its own way. Put one gateway in front of every model and make search and memory once; keep the
// chat's hand-off logic its own, or move it onto the platform; then a model retires, an agent loops all night, and finance asks the cost.
const PLAT_WHO={retire:1,loop:2};
PLAY.platform=(Lb,api)=>{const W=Lb.w,AG=W.agents,S={gw:false,sh:false,logic:"chat",tG:null,ev:{}};
  const r1=api.group(W.platL);api.toggle(r1,W.gwT,false,v=>{S.gw=v;S.tG=performance.now();S.ev={};api.kick(800);api.say(v?W.msg.gwOn:W.msg.gwOff);own();});
  api.toggle(r1,W.shT,false,v=>{S.sh=v;S.tG=performance.now();api.kick(800);api.say(v?W.msg.shOn:W.msg.shOff);own();});
  const r2=api.group(W.logicL);api.seg(r2,W.logics,S.logic,k=>{S.logic=k;api.kick(700);api.say(W.msg["logic_"+k],k==="platform"?"no":"ok");own();},W.logicL);
  const r3=api.group(W.evL);W.events.forEach(e=>api.btn(r3,e.b,()=>{S.ev[e.k]={t:performance.now(),ok:S.gw};api.kick(1600);api.say(S.gw?e.ok:e.no,S.gw?"ok":"no");if(S.gw)api.reach(e.k);}));
  function own(){if(S.gw&&S.sh&&S.logic==="chat")api.reach("own");}
  const lay=(lw)=>{const m=12,o={lw,m},n=AG.length;o.ax=AG.map((a,i)=>m+(lw-m*2)*(i+0.5)/n);o.ay=30;o.gy=112;o.py=160;o.ph=96;o.h=o.py+o.ph+12;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,PC=K.lay[5],g=into(now,S.tG,700),cw=(o.lw-m*2)/AG.length;
    // each agent, and its line down: to the gateway, or its own way to a model
    AG.forEach((a,i)=>{const x=o.ax[i],ev=Object.entries(S.ev).find(([k,v])=>PLAT_WHO[k]===i&&ago(now,v.t)<4000);
      ctx.save();ctx.strokeStyle=rgbaS(S.gw?K.ai:K.soft,0.6);ctx.lineWidth=1.5;if(!S.gw)ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x,o.ay+30);
      if(S.gw)ctx.lineTo(x,o.gy);else ctx.lineTo(lp(x,o.lw/2,0.35),o.py+8);ctx.stroke();ctx.restore();
      if(!S.gw)IC.key(ctx,lp(x,o.lw/2,0.18)+2,lp(o.ay+30,o.py+8,0.5),K.bad);
      orb(ctx,x,o.ay,9,now);line1(ctx,a,x-cw/2+2,o.ay+24,cw-4,12,{w:700,align:"center",color:rgbaS(K.ink,0.9)});
      if(ev&&ago(now,ev[1].t)>600)mark(ctx,x+10,o.ay-8,ev[1].ok?"ok":"no");});
    // the chat's hand-off logic: under the chat, or on the platform
    const lgOn=S.logic==="platform";chip(ctx,lgOn?o.lw-m-112:m,lgOn?o.py+o.ph-36:o.ay+40,110,26,W.logicChip,lgOn?K.bad:K.ai,{size:12});
    if(S.gw)withA(ctx,g,()=>{card(ctx,m,o.gy,o.lw-m*2,30,K.ai,null,{glow:12,tint:0.16});line1(ctx,W.gw,m+12,o.gy+20,o.lw-m*2-24,13,{w:800,align:"center",color:rgbaS(K.ink,1)});});
    else line1(ctx,W.noGw,m,o.gy+20,o.lw-m*2,12.5,{w:700,align:"center",color:rgbaS(K.bad,0.9)});
    card(ctx,m,o.py,o.lw-m*2,o.ph,PC,W.plat,{glow:6});const pw=(o.lw-m*2-24-18)/4;
    W.parts.forEach((p,i)=>{const shared=i<2||S.sh;chip(ctx,m+12+i*(pw+6),o.py+30,pw,28,shared?p:p+" ×6",shared?PC:K.bad,{size:12,dash:!shared});});};
  return{lay,draw,readouts:[[W.read.routes,()=>S.gw?"1":String(AG.length)],[W.read.logic,()=>W.logics.find(x=>x[0]===S.logic)[1]]]};};

/* ---------- 3 · What an agent may read: fill the chat's place ---------- */
// The chat's first version read everything. Step each thing to where it belongs; then prices change, a caller asks about a neighbour,
// and a household with medical needs calls.
// what each event finds, by where each thing is: the first rule that matches, else it goes well; and the row it shows on
const PLACE_RULES={prices:[["export","place|signin","bad"],["tariffs","signin|tool|never","slow"]],neighbour:[["account","place","bad"],["account","tool|never","slow"]],
  medical:[["medical","place|signin","bad"],["medical","never","slow"]]},PLACE_ON={prices:"tariffs",neighbour:"account",medical:"medical"};
PLAY.place=(Lb,api)=>{const W=Lb.w,IT=W.items,S={at:{},ev:{}};const res=(k,at)=>{for(const[x,v,r]of PLACE_RULES[k])if(v.split("|").includes(at[x]))return r;return"ok";};IT.forEach(x=>S.at[x.k]="place");
  const lvC={place:K.lv.public,signin:K.lv.confidential,tool:K.biz,never:K.lv.restricted};
  const clean=()=>S.at.notes==="never"&&S.at.export==="never"&&S.at.medical!=="place"&&S.at.medical!=="signin";
  const r1=api.group(W.atL);IT.forEach(x=>api.cycle(r1,x.s,W.wheres,"place",k=>{S.at[x.k]=k;S.ev={};api.kick(500);api.say(fill(W.msg.set,{t:x.s,w:W.wheres.find(y=>y[0]===k)[1]}));if(clean())api.reach("clean");}));
  const r2=api.group(W.evL);W.events.forEach(e=>api.btn(r2,e.b,()=>{const r=res(e.k,S.at);S.ev[e.k]={t:performance.now(),r};api.kick(1600);api.say(e.m[r],r==="ok"?"ok":"no");if(r==="ok")api.reach(e.k);}));
  const lay=(lw)=>{const m=12,o={lw,m,rh:44};o.y0=58;o.h=o.y0+IT.length*(o.rh+6)+8;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m;
    orb(ctx,m+16,28,12,now);line1(ctx,W.agent,m+36,26,o.lw-m*2-40,14,{w:800,color:rgbaS(K.ai,1)});line1(ctx,W.agentSub,m+36,42,o.lw-m*2-40,12,{w:700,color:rgbaS(K.soft,1)});
    let y=o.y0;IT.forEach(x=>{const k=S.at[x.k],ev=W.events.find(e=>PLACE_ON[e.k]===x.k),e=ev&&S.ev[ev.k],d=e&&ago(now,e.t)>500;
      y=rowW(ctx,o,{t:x.t,v:W.wheres.find(w=>w[0]===k)[1],c:lvC[k],ic:(c,xx,yy)=>IC[k==="signin"?"key":k==="never"?"lock":k](c,xx,yy,lvC[k]),hot:d&&e.r==="bad",mark:d?(e.r==="ok"?"ok":"no"):null},y,o.rh);});};
  return{lay,draw,readouts:[[W.read.inPlace,()=>String(IT.filter(x=>S.at[x.k]==="place").length)],[W.read.restricted,()=>String(IT.filter(x=>x.lv==="restricted"&&(S.at[x.k]==="place"||S.at[x.k]==="signin")).length)]]};};

/* ---------- 4 · A first draft, not a blank page: draft, ask, confirm ---------- */
// The battery's design: start from a blank page or the agent's draft, ask whether it's right or what's missing and wrong, mark the
// guesses, choose who confirms; then run the five weeks, and see the 58 elements come out.
PLAY.confirm=(Lb,api)=>{const W=Lb.w,S={from:"blank",ask:"right",guess:false,who:"agent",run:null,r:null};
  const r1=api.group(W.fromL);api.seg(r1,W.froms,S.from,k=>{S.from=k;S.run=null;api.kick(400);api.say(W.msg["from_"+k]);},W.fromL);
  const r2=api.group(W.askL);api.seg(r2,W.asks,S.ask,k=>{S.ask=k;S.run=null;api.kick(400);api.say(W.msg["ask_"+k]);},W.askL);
  const r3=api.group(W.whoL);api.seg(r3,W.whos,S.who,k=>{S.who=k;S.run=null;api.kick(400);api.say(W.msg["who_"+k]);},W.whoL);
  const r4=api.group();api.toggle(r4,W.guessT,false,v=>{S.guess=v;S.run=null;api.kick(400);api.say(v?W.msg.guessOn:W.msg.guessOff);});
  api.btn(r4,W.runB,()=>{S.run=performance.now();const d=S.from==="draft",f=d&&S.ask==="wrong";S.r={d,f};api.kick(2200);
    const bad=!d?W.msg.blank:S.ask==="right"?W.msg.nodded:!S.guess?W.msg.guessed:S.who!=="owners"?W.msg["conf_"+S.who]:null;
    api.say(bad||W.msg.done,bad?"no":"ok");if(d)api.reach("draft");if(f)api.reach("found");if(d&&S.guess)api.reach("guess");if(d&&S.who==="owners")api.reach("owners");},"go");
  // what each of the 62 squares ends as: 0-40 as drafted, 41-49 corrected (45: the step across the wall; 46: who decides the charging),
  // 50-57 struck out, 58-61 added (58: switch the battery off before crews work)
  const end=i=>{const R=S.r;if(!R)return"open";if(!R.d)return i<22?"plain":"none";if(!R.f)return i>=58?"none":i===45?"wrong":i===46&&!S.guess?"wrong":"drafted";
    if(i===46&&!S.guess)return"wrong";return i<41?"drafted":i<50?"corrected":i<58?"struck":"added";};
  const C={open:K.soft,plain:K.soft,drafted:K.ai,corrected:K.gold,struck:K.bad,added:K.good,wrong:K.bad};
  const lay=(lw)=>{const m=12,o={lw,m},cols=Math.min(16,Math.floor((lw-m*2+6)/22));o.cols=cols;o.s=Math.min(18,(lw-m*2-(cols-1)*6)/cols);o.y0=58;
    o.ly=o.y0+Math.ceil(62/cols)*(o.s+6)+10;o.h=o.ly+Math.ceil(W.keys.length/2)*30+30;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,u=into(now,S.run,1600),conf=S.r&&S.r.d&&S.who==="owners";
    const cb=fill(W.confBy,{w:W.whos.find(x=>x[0]===S.who)[1]});line1(ctx,W.title,m,24,o.lw-m*2,14,{w:800,color:rgbaS(col,1)});
    line1(ctx,W.sub,m,44,o.lw-m*2,12,{w:700,color:rgbaS(K.soft,1)});line1(ctx,cb,m,o.h-12,o.lw-m*2,13,{w:800,color:rgbaS(S.who==="owners"?K.biz:K.bad,1)});
    for(let i=0;i<62;i++){const c=i%o.cols,r=Math.floor(i/o.cols),x=m+c*(o.s+6),y=o.y0+r*(o.s+6),k=S.run!=null&&u>=i/62?end(i):"open",cc=C[k];
      if(k==="none"){ctx.save();ctx.setLineDash([3,3]);ctx.strokeStyle=rgbaS(K.soft,0.35);rr(ctx,x+1,y+1,o.s-2,o.s-2,4);ctx.stroke();ctx.restore();continue;}
      ctx.save();ctx.fillStyle=rgbaS(cc,k==="open"||k==="plain"?0.18:conf?0.95:0.45);rr(ctx,x,y,o.s,o.s,4);ctx.fill();
      if(k==="wrong"||(!conf&&k!=="open"&&k!=="plain")){ctx.strokeStyle=rgbaS(k==="wrong"?K.bad:cc,1);ctx.lineWidth=k==="wrong"?2.2:1.2;rr(ctx,x+1,y+1,o.s-2,o.s-2,4);ctx.stroke();}
      if(k==="struck"){ctx.strokeStyle=rgbaS(K.ink,0.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+4,y+o.s-4);ctx.lineTo(x+o.s-4,y+4);ctx.stroke();}ctx.restore();}
    const lw2=(o.lw-m*2-8)/2;W.keys.forEach((kk,i)=>{const x=m+(i%2)*(lw2+8),y=o.ly+Math.floor(i/2)*30;ctx.fillStyle=rgbaS(C[kk[0]],0.9);rr(ctx,x,y,14,14,3);ctx.fill();
      const n=S.r?Array.from({length:62},(_,j)=>end(j)).filter(z=>z===kk[0]).length:0;line1(ctx,kk[1]+(S.run!=null?" · "+n:""),x+20,y+12,lw2-22,12.5,{w:700,color:rgbaS(K.ink,0.9)});});};
  return{lay,draw,readouts:[[W.read.weeks,()=>S.r?(S.r.d?"5":"5+"):"–"],[W.read.owners,()=>S.r&&S.r.d&&S.who==="owners"?W.read.yes:W.read.no]]};};

/* ---------- 5 · Every change, checked: run the map's checks ---------- */
// Five checks, each switched on or off; four changes come, one at a time, and fall through the checks to the one that stops them, or
// onto the map.
PLAY.checks=(Lb,api)=>{const W=Lb.w,CK=W.checks,S={on:{},cur:null,t:null,stop:-1};
  const nOn=()=>CK.filter(c=>S.on[c.k]).length;
  const r1=api.group(W.onL);CK.forEach(c=>api.toggle(r1,c.s,false,v=>{S.on[c.k]=v;api.kick(400);api.say(v?c.on:fill(W.msg.off,{t:c.s}));}));
  const r2=api.group(W.chL);W.changes.forEach(ch=>api.btn(r2,ch.b,()=>{S.cur=ch;S.t=performance.now();S.stop=ch.by?CK.findIndex(c=>c.k===ch.by&&S.on[c.k]):-1;api.kick(2200);
    const caught=S.stop>=0;if(!ch.by){const ok=nOn()>=3;api.say(ok?ch.ok:W.msg.fewOn,ok?"ok":null);if(ok)api.reach(ch.k);}
    else{api.say(caught?ch.ok:ch.no,caught?"ok":"no");if(caught)api.reach(ch.k);}}));
  const lay=(lw)=>{const m=12,o={lw,m,rh:40};o.cy=10;o.y0=56;o.my=o.y0+CK.length*(o.rh+6)+4;o.h=o.my+42;o.r={m:m+22,lw:lw+22};return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,ch=S.cur,t=ago(now,S.t),g=m+8,cy=i=>o.y0+i*(o.rh+6)+o.rh/2;
    ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(g,o.cy+32);ctx.lineTo(g,o.my+17);ctx.stroke();ctx.restore();
    let y=o.y0;CK.forEach((c,i)=>{const on=!!S.on[c.k],hit=ch&&S.stop===i&&t>1100;y=rowW(ctx,o.r,{t:c.t,v:on?W.on:W.off,c:on?K.brick:K.soft,vc:on?K.brick:K.soft,dash:!on,hot:hit,mark:hit?"ok":null},y,o.rh);});
    const bad=ch&&ch.by&&S.stop<0&&t>1100,good=ch&&!ch.by&&t>1100;
    card(ctx,o.r.m,o.my,o.lw-m-o.r.m,34,bad?K.bad:K.good,null,{glow:bad||good?14:4});line1(ctx,bad?W.through:W.map,o.r.m+12,o.my+22,o.lw-m-o.r.m-24,13,{w:800,color:rgbaS(bad?K.bad:K.good,1)});
    if(ch){const ty=S.stop>=0?cy(S.stop):o.my+17,u=eo(cl(t/1100,0,1));dot(ctx,g,o.cy+32,g,ty,u,K.gold,5);
      if(u>=1){ctx.fillStyle=rgbaS(bad?K.bad:S.stop>=0?K.brick:K.good,1);ctx.beginPath();ctx.arc(g,ty,5,0,TP);ctx.fill();}
      chip(ctx,m,o.cy,o.lw-m*2,30,ch.s,K.gold,{size:12.5,glow:10});}
    else line1(ctx,W.waiting,m,o.cy+20,o.lw-m*2,13,{w:700,align:"center",color:rgbaS(K.soft,1)});};
  return{lay,draw,readouts:[[W.read.on,()=>fill(W.read.nOf,{n:nOn(),of:CK.length})],[W.read.last,()=>!S.cur?"–":!S.cur.by?W.read.passed:S.stop>=0?W.read.stopped:W.read.through]]};};

/* ---------- 6 · Kept alive: who keeps it, and when ---------- */
// The map's rhythm: five beats, each on or off. Run a year, and six things that move come by, each caught by its beat, or left to drift.
PLAY.keep=(Lb,api)=>{const W=Lb.w,BT=W.beats,MV=W.moves,S={on:{change:true},run:null};
  const r1=api.group(W.onL);BT.forEach(b=>api.toggle(r1,b.s,b.k==="change",v=>{S.on[b.k]=v;S.run=null;api.kick(400);api.say(v?b.on:fill(W.msg.off,{t:b.s}));}));
  const r2=api.group();api.btn(r2,W.runB,()=>{S.run=performance.now();api.kick(3400);const miss=MV.filter(x=>!S.on[x.by]);
    api.say(miss.length?fill(W.msg.miss,{n:MV.length-miss.length,of:MV.length,m:miss[0].no}):W.msg.all,miss.length?"no":"ok");
    BT.forEach(b=>{if(b.k!=="change"&&S.on[b.k]&&MV.some(x=>x.by===b.k))api.reach(b.k);});},"go");
  const lay=(lw)=>{const m=12,o={lw,m,rh:42};o.ty=34;o.y0=72;o.h=o.y0+MV.length*(o.rh+6)+8;return o;};
  const draw=(ctx,o,now)=>{const col=rgb(Lb.c);ground(ctx,o.lw,o.h,col);const m=o.m,u=into(now,S.run,2600),x0=m+8,x1=o.lw-m-8;
    // the year: twelve months, a cursor going along it
    ctx.save();ctx.strokeStyle=rgbaS(K.soft,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,o.ty);ctx.lineTo(x1,o.ty);ctx.stroke();ctx.restore();
    W.months.forEach((mo,i)=>{const x=lp(x0,x1,(i+0.5)/12);ctx.fillStyle=rgbaS(K.soft,0.6);ctx.beginPath();ctx.arc(x,o.ty,2,0,TP);ctx.fill();if(o.lw>420||i%2===0)T(ctx,mo,x,o.ty-10,{w:700,size:11.5,align:"center",color:rgbaS(K.soft,1)});});
    MV.forEach(x=>{const px=lp(x0,x1,(x.mo+0.5)/12),seen=S.run!=null&&u>=(x.mo+0.5)/12;ctx.fillStyle=rgbaS(!seen?K.gold:S.on[x.by]?K.good:K.bad,1);ctx.beginPath();ctx.arc(px,o.ty,5,0,TP);ctx.fill();});
    if(S.run!=null&&u<1){const cx=lp(x0,x1,u);ctx.strokeStyle=rgbaS(K.ink,0.8);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx,o.ty-6);ctx.lineTo(cx,o.ty+12);ctx.stroke();}
    let y=o.y0;MV.forEach(x=>{const seen=S.run!=null&&u>=(x.mo+0.5)/12,ok=!!S.on[x.by],b=BT.find(z=>z.k===x.by);
      y=rowW(ctx,o,{t:x.t,v:seen?(ok?b.s:W.drift):W.months[x.mo],c:seen?(ok?K.good:K.bad):K.soft,vc:seen?(ok?K.good:K.bad):K.soft,hot:seen&&!ok,mark:seen?(ok?"ok":"no"):null},y,o.rh);});};
  return{lay,draw,readouts:[[W.read.beats,()=>fill(W.read.nOf,{n:BT.filter(b=>S.on[b.k]).length,of:BT.length})],[W.read.caught,()=>S.run==null?"–":fill(W.read.nOf,{n:MV.filter(x=>S.on[x.by]).length,of:MV.length})]]};};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)

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
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");bar.append(dots,score);
  app.append(h("div",{class:"quiz"},bar,card));
  const list=()=>QS.filter(q=>!film||q.film===film),labOf=id=>L.labs.find(x=>x.id===id)||{name:"",c:"#a0b2cd"};
  // forget a saved answer whose option no longer gives the result it was saved with
  QS.forEach(q=>{const a=ans[q.n];if(a&&(a.pick==null||!q.opts[a.pick]||!!q.opts[a.pick].ok!==!!a.ok))delete ans[q.n];});
  function paintBar(){const Q=list();dots.replaceChildren(...Q.map((q,i)=>{const a=ans[q.n];return h("button",{type:"button",class:a?(a.ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1)+(a?" · "+(a.ok?U.right:U.notQuite):""),onclick:()=>{cur=i;render(true);}},String(i+1));}));
    const n=Q.filter(q=>ans[q.n]).length,ok=Q.filter(q=>ans[q.n]&&ans[q.n].ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+n+" "+U.answered+" · "+(Q.length-n)+" "+U.toGo));}
  function done(q,ok,pick){ans[q.n]={ok,pick};put("quiz",ans);paintBar();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why));
  function foot(q){const Q=list(),last=cur===Q.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:"../labs/#"+q.lab},U.explore+" "+labOf(q.lab).name),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results(true);else{cur+=1;render(true);}}},last?U.results:U.nextQ));}
  function render(focus){paintBar();const Q=list(),q=Q[cur];if(!q)return;app.dataset.film=String(q.film);const f=VIS[q.vis.k],a=ans[q.n],body=h("div",{class:"qbody"}),out=h("div"),S={done:a?performance.now()-1e5:0};
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
  // one list of every scenario of the series, no film level: n, a film whose scenarios to start at (from #film-<n>), opens its first
  // one left, or its first; otherwise the first one left, or the results
  function setFilm(n){film=0;const one=films.includes(n),of=q=>!one||q.film===n,Q=list(),todo=Q.findIndex(q=>of(q)&&!ans[q.n]),first=Q.findIndex(of);
    if(one&&history.replaceState)history.replaceState(null,"",location.pathname+location.search);
    if(todo>=0){cur=todo;render(false);}else if(one&&first>=0){cur=first;render(false);}else results(false);}
  const fromHash=()=>{const m=(location.hash||"").match(/^#film-(\d+)$/);return m?+m[1]:0;};
  // the first one waits for the rest of this file, where the pictures are
  window.addEventListener("hashchange",()=>{const n=fromHash();if(n)setFilm(n);});Promise.resolve().then(()=>setFilm(fromHash()));}

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
    const th=lines(ctx,P2.instr,ix+41,iy+25,iw-51,{size:12.5,max:2,w:800,color:rgbaS(K.ai,1)}),py=iy+Math.max(42,th+22);
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
