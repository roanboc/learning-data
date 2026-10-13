/* ===== Made to read on a phone =====
   A phone held sideways shows the 1920-pixel frame about 850 pixels wide, so text under about 28 px in the frame is too small to
   read there (PLAYBOOK.md, "Make it read on a phone"). The films made before that rule draw with this layer: every piece of text
   that isn't marked as decoration ({deco:1}) is drawn at least 28 px high in the frame, after the camera's zoom, and the components
   that size themselves to their text (tags) grow with it. Each film's scenes then make room for the larger words, and move the
   camera in on the part of a dense picture the narration is about (focus). The map before the data was drawn to the rule from the
   start and doesn't load this layer; nor does The Inner Life of Data, yet.
   It loads after the film's own files and before the engine, and only wraps: the components it shares with other films are unchanged. */
const PH_MIN=28;let PH_W=0,PH_OFF=0;
// how many frame pixels one unit of the current drawing is, after the camera's zoom; 0 on a canvas that isn't a frame (a cached picture)
function phK(ctx){const c=ctx.canvas;if(!PH_W||c.width!==PH_W)return 0;const m=ctx.getTransform();return Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))*W/c.width;}
// the smallest text size, in the current drawing's units, that reads on a phone (0 where it doesn't apply)
function phMin(ctx){if(PH_OFF)return 0;const k=phK(ctx);return k?PH_MIN/k:0;}
// a component's options, with its text raised to the smallest size that reads, unless it's decoration
function phSize(ctx,o,def){o=o||{};if(o.deco)return o;const m=phMin(ctx),s=o.size||def;return s<m?Object.assign({},o,{size:m}):o;}
// draw fn as decoration: its text is texture (a printed page, a far-off list), not something to read
function phDeco(fn){return function(){PH_OFF++;try{return fn.apply(this,arguments);}finally{PH_OFF--;}};}
// draw now, as decoration when on is true: a picture seen from afar is context, and its words are texture
function phAsDeco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// the lines a string breaks into at a width, for the films that don't load words.js's wrapT
function phWrap(ctx,s,maxW,size,wt,f){const L=[];String(s).split(" ").forEach(wd=>{const c=L.length?L[L.length-1]+" "+wd:wd;if(L.length&&tw(ctx,c,size,wt||600,f)>maxW)L.push(wd);else if(L.length)L[L.length-1]=c;else L.push(wd);});return L;}
// the camera moves in on part of a picture, as The map before the data's focus does: keys are [t, x, y, zoom], from the first
// key's framing, each move gliding over d seconds from its time; returns the zoom
function focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return z;}
// a component whose text sizes are fixed inside it, drawn larger as a whole until its smallest text (base) reads: it grows from the
// point its arguments xi and yi name, by at most kmax, so its box and its words keep their proportions
function phBig(fn,xi,yi,base,kmax){return function(){const a=arguments,ctx=a[0],m=phMin(ctx),k=m?clamp(m/(typeof base==="function"?base.apply(null,a):base),1,kmax||1.7):1;
  if(k<=1.001)return fn.apply(this,a);ctx.save();ctx.translate(a[xi],a[yi]);ctx.scale(k,k);ctx.translate(-a[xi],-a[yi]);try{return fn.apply(this,a);}finally{ctx.restore();}};}
// the frame's width, set as each frame starts, so a cached picture's text isn't measured against the frame
renderFrame=(f=>function(ctx,S,t){PH_W=ctx.canvas.width;PH_OFF=0;return f(ctx,S,t);})(renderFrame);
T=(f=>function(ctx,s,x,y,o){return f(ctx,s,x,y,phSize(ctx,o,24));})(T);
tag=(f=>function(ctx,x,y,s,c,o){return f(ctx,x,y,s,c,phSize(ctx,o,20));})(tag);
// wrapped text (From words to data's wrapT) breaks its lines at the size it's drawn, with its line height grown in proportion
if(typeof wrapT==="function"&&wrapT.length===6)wrapT=(f=>function(ctx,s,x,y,maxW,o){o=o||{};const p=phSize(ctx,o,24);if(p!==o&&o.lh)p.lh=o.lh*p.size/(o.size||24);return f(ctx,s,x,y,maxW,p);})(wrapT);
// chips (a logo, a title, and a smaller line under it) and the year and stamp tags grow as a whole
chip=phBig(chip,1,2,function(ctx,x,y,k,title,sub,o){o=o||{};return sub?(o.ss||17):(o.ts||22);});
if(typeof yearTag==="function")yearTag=phBig(yearTag,1,2,20);
if(typeof stamp==="function")stamp=phBig(stamp,1,2,20);

/* ---------- From words to data's components, at sizes that read ---------- */
// a wax seal's mark is part of the seal, not something to read
if(typeof waxSeal==="function")waxSeal=phDeco(waxSeal);
// a credential card (words.js) with its rows laid out for the larger words: the field names in a column as wide as the widest,
// the values after it, and the rows spaced to fit; everything else as words.js draws it
if(typeof credCard==="function")credCard=(f=>function(ctx,x,y,w,o){const m=phMin(ctx);if(!m)return f(ctx,x,y,w,o);o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;
  const ls=Math.max(17,m),vs=Math.max(18,m),rh=Math.max(o.rh||34,vs*1.32),rowsF=[["issuer",o.issuer],["holder",o.holder],["claim",o.claim],["evidence",o.evidence],["date",o.date]].filter(r=>r[1]);
  // a value too long for the card goes on as many lines as it needs, and the card grows to hold them
  const lw=Math.max(...rowsF.map(r=>tw(ctx,r[0],ls,500,"mono")),0),vw=w-56-lw,LS=rowsF.map(([k,v])=>phWrap(ctx,v,vw,vs,700)),
    xl=LS.reduce((p,L)=>p+L.length-1,0)*vs*1.18,h0=o.h||Math.max(Math.round(w*0.68),(o.title?84:56)+rowsF.length*rh),h=xl?Math.max(h0,(o.title?44+rh:Math.max(42,16+vs))+(rowsF.length-1)*rh+xl+(o.era==="digital"||!o.era?70:34)):h0;
  // the card itself, from words.js, with no rows; then the rows, in the same place and turn
  f(ctx,x,y,w,Object.assign({},o,{h,issuer:null,holder:null,claim:null,evidence:null,date:null,signed:false}));
  const era=o.era||"digital",dk=era==="digital"||era==="badge",hl=o.hl||{},ink=dk?rgba(INK,0.95):(era==="tablet"?"rgba(60,36,20,0.9)":"rgba(52,40,30,0.92)"),lab=dk?rgba(SOFT,1):(era==="tablet"?"rgba(70,44,26,0.7)":"rgba(110,86,54,0.9)");
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);const yy=o.title?44+rh:Math.max(42,16+vs);
    // a digital card's "signed", beside its seal rather than under it, where the larger word fits
    if(era==="digital"&&o.signed!==false)T(ctx,o.signed||"signed",w-78,h-30,{f:"mono",w:500,size:Math.max(12,m),align:"right",color:rgba(SOFT,1)});
    let ry=yy;rowsF.forEach(([k,v],i)=>{const on=hl[k]||0,L=LS[i],ex=(L.length-1)*vs*1.18;if(on>0){ctx.fillStyle=dk?rgba(o.col||TRUST,0.16*on):"rgba(200,140,40,"+(0.22*on)+")";rr(ctx,12,ry-vs*0.95,w-24,rh+ex,8);ctx.fill();}
      T(ctx,k,22,ry,{f:"mono",w:500,size:ls,color:lab});L.forEach((l,j)=>T(ctx,l,34+lw,ry+j*vs*1.18,{w:700,size:vs,color:ink}));ry+=rh+ex;});ctx.restore();});return h;})(credCard);

/* ---------- A Sharper Sketch's entities, at sizes that read ---------- */
// an entity (sketch3.js): its name, its note and its attributes at least the smallest size that reads, the box measured to fit them,
// so the lines that callers draw to its edges (they ask entBox) still meet it
if(typeof entBox==="function"){const EB0=entBox,EN0=ent;
  const phEnt=(ctx,e)=>{const s=e.s||1,m=phMin(ctx);return{s,ns:Math.max(24*s,m),ss:Math.max(16*s,m),as:Math.max(17*s,m)};};
  entBox=function(ctx,e){const m=phMin(ctx);if(!m)return EB0(ctx,e);const{s,ns,ss,as}=phEnt(ctx,e),sub=e.sub,at=e.attrs||[],k1=ns/(24*s),rh=Math.max(30*s,as*1.3);
    let w=Math.max(200*s,tw(ctx,e.name,ns,700)+52*s);if(sub)w=Math.max(w,tw(ctx,sub,ss,600)+44*s);at.forEach(r=>{w=Math.max(w,tw(ctx,r[0],as,500,"mono")+84*s);});
    const head=sub?34*s*k1+ss*1.15+18*s:58*s*k1,h=head+(at.length?at.length*rh+14*s:0);return{x:e.x,y:e.y,w,h,head,rh};};
  ent=function(ctx,e){const m=phMin(ctx);if(!m)return EN0(ctx,e);const a=e.a==null?1:e.a;if(a<=0.01)return;const{s,ns,ss,as}=phEnt(ctx,e),k1=ns/(24*s),col=e.col||SK,b=entBox(ctx,e),x=b.x-b.w/2,y=b.y-b.h/2,hi=e.hi||0;
    ctx.save();ctx.globalAlpha*=a;
    if(hi>0)glow(ctx,b.x,b.y,Math.max(b.w,b.h)*0.9,e.hiCol||col,0.35*hi);
    ctx.fillStyle=e.fill||"rgba(8,14,30,0.94)";rr(ctx,x,y,b.w,b.h,10*s);ctx.fill();
    ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=12+10*hi;ctx.strokeStyle=rgba(e.edge||col,0.95);ctx.lineWidth=(2.2+1.2*hi)*s;if(e.dash)ctx.setLineDash([9*s,7*s]);rr(ctx,x,y,b.w,b.h,10*s);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
    const ny=y+(e.sub?34:37)*s*k1;T(ctx,e.name,b.x,ny,{w:700,size:ns,align:"center",color:rgba(col,1)});
    if(e.sub)withA(ctx,e.subA==null?1:e.subA,()=>T(ctx,e.sub,b.x,ny+ss*1.15,{w:600,size:ss,align:"center",color:rgba(e.subCol||SOFT,1)}));
    if(e.attrs&&e.attrs.length){const y0=y+b.head;ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.2*s;ctx.beginPath();ctx.moveTo(x+12*s,y0);ctx.lineTo(x+b.w-12*s,y0);ctx.stroke();
      e.attrs.forEach((r,i)=>withA(ctx,e.attrA==null?1:clamp(e.attrA*e.attrs.length-i,0,1),()=>{const yy=y0+b.rh*(i+0.5)+as*0.36+6*s;
        if(r[1]==="id"){ctx.fillStyle=rgba(REF,1);ctx.beginPath();ctx.arc(x+24*s,yy-as*0.32,5*s,0,TAU);ctx.fill();}
        T(ctx,r[0],x+40*s,yy,{f:"mono",w:500,size:as,color:r[1]==="id"?rgba(REF,1):rgba(INK,0.9)});}));}
    if(e.pin&&(e.pinA==null||e.pinA>0))withA(ctx,e.pinA==null?1:e.pinA,()=>{const pc=e.pin==="adopt"?ADOPT:EXT,px=x+b.w-4*s,py=y+4*s,pr=(9+4*(e.pinP||0))*s;glow(ctx,px,py,34*s,pc,0.5+0.5*(e.pinP||0));
      ctx.fillStyle=rgba(pc,1);ctx.beginPath();ctx.arc(px,py,pr,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.85)";ctx.beginPath();ctx.arc(px-pr*0.3,py-pr*0.3,pr*0.32,0,TAU);ctx.fill();});
    ctx.restore();return b;};}

/* ---------- The Inner Life of Data's system card, at sizes that read ---------- */
// its title and its line under it at least the smallest size that reads, the card grown about its middle to fit them, taller and wider
if(typeof sysCard==="function"){const SC0=sysCard;sysCard=function(ctx,x,y,w,h,title,sub,c,icon){const m=phMin(ctx);if(!m)return SC0.apply(this,arguments);
  const ts=Math.max(22,m),ss=Math.max(16,m),H=sub?Math.max(h,ts+ss*1.2+26):Math.max(h,ts+26),Y=y+(h-H)/2,W=Math.max(w,32+Math.max(tw(ctx,title,ts,700),sub?tw(ctx,sub,ss,500):0)+(icon?76:24));x+=(w-W)/2;w=W;
  glass(ctx,x,Y,w,H,16,c,{glow:16,ea:0.6});led(ctx,x+12,Y+16,5,H-32,c);
  if(sub){T(ctx,title,x+32,Y+H/2-ss*0.2,{w:700,size:ts});T(ctx,sub,x+32,Y+H/2+ss*0.95,{w:500,size:ss,color:rgba(SOFT,0.95)});}else T(ctx,title,x+32,Y+H/2+ts*0.36,{w:700,size:ts});
  if(icon)icon(ctx,x+w-44,Y+H/2);};}

/* ---------- A Sharper Sketch's table, at sizes that read ---------- */
// its name, its header and its cells at least the smallest size that reads, its columns and rows measured to fit them
if(typeof table==="function"){const TB0=table;table=function(ctx,x,y,name,cols,rows,o){const m=phMin(ctx);if(!m)return TB0.apply(this,arguments);o=o||{};
  const cs=Math.max(16,m),ns=Math.max(18,m),cw=o.cw||cols.map(c=>Math.max(tw(ctx,c,cs,500,"mono"),...rows.map(r=>tw(ctx,r[cols.indexOf(c)],cs,500,"mono")))+30),w=cw.reduce((a,b)=>a+b,0),rh=Math.max(40,cs*1.45),hh=Math.max(46,ns*1.65),h=hh+rh*(rows.length+1);
  glass(ctx,x,y,w,h,12,o.col||SK,{glow:14,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(ctx,name,x+16,y+hh*0.67,{f:"mono",w:500,size:ns,color:rgba(o.col||SK,1)});
  let cx=x;cols.forEach((c,i)=>{T(ctx,c,cx+15,y+hh+rh*0.68,{f:"mono",w:500,size:cs,color:rgba(REF,1)});rows.forEach((r,j)=>withA(ctx,o.rowA?o.rowA(j):1,()=>T(ctx,r[i],cx+15,y+hh+rh*(j+1)+rh*0.68,{f:"mono",w:500,size:cs,color:rgba(INK,0.9)})));cx+=cw[i];});
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1;for(let j=0;j<=rows.length+1;j++){ctx.beginPath();ctx.moveTo(x,y+hh+rh*j);ctx.lineTo(x+w,y+hh+rh*j);ctx.stroke();}
  return{w,h};};}

/* ---------- A Sharper Sketch's number card, at sizes that read ---------- */
// its line under the number wraps to the card's width at the larger size, and the card grows to hold it
if(typeof numCard==="function"){const NC0=numCard;numCard=function(ctx,x,y,w,title,num,sub,col,o){const m=phMin(ctx);if(!m||!sub)return NC0.apply(this,arguments);o=o||{};
  const ss=Math.max(18,m),ls=phWrap(ctx,sub,w-56,ss,600),h=200+(ls.length-1)*ss*1.2;
  glass(ctx,x,y,w,h,18,col,{glow:18,ea:0.7,fill:"rgba(7,12,24,0.92)"});T(ctx,title,x+28,y+46,{w:700,size:24,color:rgba(SOFT,1)});T(ctx,num,x+28,y+140,{w:800,size:88,color:rgba(col,1)});
  ls.forEach((l,i)=>T(ctx,l,x+28,y+180+i*ss*1.2,{w:600,size:ss,color:rgba(SOFT,0.95)}));
  if(o.badge)tag(ctx,x+w-28-(tw(ctx,o.badge,Math.max(16,m),700)+26),y+40,o.badge,o.badgeCol||GOOD,{size:16});};}

/* ---------- Silent change's pictures (silent.js), at sizes that read ---------- */
// the counter widget: the title, the number and its comparison (under the number if it won't fit beside it), and the places.
// The UI's small print (the source table, "last 14 days", "capacity") is texture. The small copy keeps its name, number and places
if(typeof kpiCard==="function"&&typeof dbCard==="function"){const KC0=kpiCard;kpiCard=function(ctx,x,y,w,h,o){const m=phMin(ctx);if(!m)return KC0.apply(this,arguments);o=o||{};
  const s=o.s||1,v=o.value==null?94:o.value,pad=20*s,shown=(o.shown||Math.round(v))+"%",nA=o.numA==null?1:o.numA,col=o.ghost?DB.red:DB.blue,bw=w-2*pad;
  if(h/s<250){dbCard(ctx,x,y,w,h);const by=y+h-pad-m*1.25,ty=y+pad+m*0.8,foot=Math.round(v*1.2)+" of 120 places";T(ctx,o.title||"Data Science 101",x+pad,ty,{w:700,size:18*s,color:DB.text});
    withA(ctx,nA,()=>T(ctx,shown,x+pad,ty+Math.max(48*s,m)*1.05,{w:700,size:48*s,color:o.ghost?DB.red:DB.text}));
    ctx.fillStyle=DB.track;rr(ctx,x+pad,by,bw,10*s,5*s);ctx.fill();ctx.fillStyle=col;rr(ctx,x+pad,by,bw*Math.min(1,v/100),10*s,5*s);ctx.fill();
    T(ctx,tw(ctx,foot,m,500)<=bw?foot:Math.round(v*1.2)+" of 120",x+pad,y+h-pad,{w:500,size:16*s,color:DB.muted});return;}
  dbCard(ctx,x,y,w,h);const ty=y+pad+m*0.85,ny=y+pad+122*s,nw=tw(ctx,shown,78*s,700),dw=o.delta?tw(ctx,o.delta,m,700):0,beside=nw+16*s+dw<=bw;
  T(ctx,o.title||"Places filled · Data Science 101",x+pad,ty,{w:700,size:19*s,color:DB.text});phAsDeco(true,()=>T(ctx,o.source||"fct_offering_fill",x+pad,ty+22,{w:500,size:14*s,f:"mono",color:DB.muted}));
  withA(ctx,nA,()=>{T(ctx,shown,x+pad,ny,{w:700,size:78*s,color:o.ghost?DB.red:DB.text});
    if(o.delta)T(ctx,o.delta,beside?x+pad+nw+16*s:x+pad,beside?y+pad+118*s:ny+m*1.25,{w:700,size:17*s,color:o.deltaCol||DB.green});});
  const by=y+h-pad-Math.max(44*s,m+22),sy0=beside||!o.delta?y+pad+150*s:ny+m*1.25+16,sy1=by-30*s;
  if(sy1-sy0>40*s){const tr=o.trend||[71,74,76,79,81,83,85,86,88,90,91,92,93,v],lo=60,hi=Math.max(100,...tr)+4,px=i=>x+pad+bw*i/(tr.length-1),py=q=>sy1-(sy1-sy0)*(q-lo)/(hi-lo);
    ctx.beginPath();tr.forEach((q,i)=>i?ctx.lineTo(px(i),py(q)):ctx.moveTo(px(i),py(q)));ctx.lineTo(px(tr.length-1),sy1);ctx.lineTo(px(0),sy1);ctx.closePath();ctx.fillStyle=o.ghost?"rgba(200,45,76,0.10)":"rgba(7,122,157,0.10)";ctx.fill();
    ctx.beginPath();tr.forEach((q,i)=>i?ctx.lineTo(px(i),py(q)):ctx.moveTo(px(i),py(q)));ctx.strokeStyle=col;ctx.lineWidth=2.5*s;ctx.stroke();
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(px(tr.length-1),py(tr[tr.length-1]),4*s,0,TAU);ctx.fill();phAsDeco(true,()=>T(ctx,"last 14 days",x+pad,sy0-4*s,{w:500,size:13*s,color:DB.muted}));}
  ctx.fillStyle=DB.track;rr(ctx,x+pad,by,bw,12*s,6*s);ctx.fill();ctx.fillStyle=col;rr(ctx,x+pad,by,bw*Math.min(1,v/100),12*s,6*s);ctx.fill();
  if(v>100){ctx.fillStyle=DB.red;rr(ctx,x+pad+bw-4*s,by-6*s,8*s,24*s,3*s);ctx.fill();}
  ctx.strokeStyle=DB.text;ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(x+pad+bw,by-8*s);ctx.lineTo(x+pad+bw,by+20*s);ctx.stroke();
  T(ctx,o.foot||Math.round(v*1.2)+" of 120 places",x+pad,y+h-pad,{w:500,size:15*s,color:DB.muted});phAsDeco(true,()=>T(ctx,"capacity",x+pad+bw,y+h-pad,{w:500,size:13*s,align:"right",color:DB.muted}));};}
// the dashboard: its note wraps and makes the room it needs, its icon is as large as its words, and the chart's subtitle is texture
if(typeof dashboard==="function"&&typeof kpiCard==="function"&&typeof DB==="object"){const DS0=dashboard;dashboard=function(ctx,x,y,w,h,o){const m=phMin(ctx);if(!m)return DS0.apply(this,arguments);o=o||{};
  const num=o.num==null?94:parseFloat(o.num),g=o.ghost||0,gIn=sstep(0.45,1,g);
  glass(ctx,x-12,y-12,w+24,h+24,22,[170,205,255],{glow:18,ea:0.45,fill:"rgba(8,14,28,0.95)"});ctx.save();rr(ctx,x,y,w,h,12);ctx.clip();ctx.fillStyle=DB.canvas;ctx.fillRect(x,y,w,h);
  ctx.fillStyle=DB.card;ctx.fillRect(x,y,w,64);ctx.fillStyle=DB.line;ctx.fillRect(x,y+64,w,1.2);const lw=logo(ctx,"databricks",x+20,y+18,28);
  T(ctx,o.title||"Enrolments · census date tomorrow",x+34+lw,y+41,{w:700,size:21,color:DB.text});T(ctx,o.day||"Tuesday",x+w-22,y+40,{w:500,size:16,align:"right",color:DB.muted});
  let cy=y+84;const ix=m*1.25+44,lines=s=>phWrap(ctx,s,w-40-ix-16,m,600),bh=L=>24+L.length*m*1.15;
  const alert=(bg,line,col,icon,text,a)=>withA(ctx,a,()=>{const L=lines(text),H=bh(L);ctx.fillStyle=bg;rr(ctx,x+20,cy,w-40,H,6);ctx.fill();ctx.fillStyle=line;rr(ctx,x+20,cy,6,H,3);ctx.fill();
    ctx.fillStyle=col;ctx.font=font(800,m);ctx.fillText(icon,x+40,cy+12+m*0.86);L.forEach((l,i)=>T(ctx,l,x+ix,cy+12+m*0.86+i*m*1.15,{w:600,size:m,color:col}));});
  const room=ease(clamp((o.banner||0)+(o.ok||0),0,1)),bT="Last good data: yesterday, 23:02 · a test stopped today's refresh",oT=o.okText||"Up to date: today, 08:40";
  if(o.banner>0)alert(DB.warnBg,DB.warnLine,DB.warn,"⚠",bT,o.banner*(1-(o.ok||0))*sstep(0.3,1,room));
  if(o.ok>0)alert(DB.greenBg,DB.green,DB.green,"✓",oT,o.ok);
  cy+=(Math.max(bh(lines(o.ok>0.5?oT:bT)),52)+20)*room;const gh=y+h-cy-20,kw=w*0.46;
  kpiCard(ctx,x+20,cy,kw,gh,{value:num,delta:o.delta||("▲ "+(Math.round(num)-92)+" pts vs last week"),foot:o.foot,numA:1-sstep(0,0.5,g)});
  if(o.flash>0)withA(ctx,o.flash,()=>{ctx.strokeStyle=DB.blue;ctx.lineWidth=3;rr(ctx,x+20,cy,kw,gh,8);ctx.stroke();});
  if(g>0){withA(ctx,g,()=>{ctx.save();ctx.fillStyle="rgba(255,255,255,0.92)";rr(ctx,x+20,cy,kw,gh,8);ctx.fill();ctx.setLineDash([10,8]);ctx.strokeStyle=DB.red;ctx.lineWidth=3;rr(ctx,x+20,cy,kw,gh,8);ctx.stroke();ctx.restore();});
    withA(ctx,gIn,()=>kpiCard(ctx,x+20,cy,kw,gh,{value:108,ghost:1,delta:"incl. waitlist",deltaCol:DB.red,foot:"130 of 120 places",trend:[71,74,76,79,81,83,85,86,88,90,91,92,94,108]}));}
  const bx=x+40+kw,bwid=w-60-kw;dbCard(ctx,bx,cy,bwid,gh);T(ctx,"Places filled by unit",bx+20,cy+m*1.3,{w:700,size:19,color:DB.text});phAsDeco(true,()=>T(ctx,"first-year units · semester 2",bx+20,cy+m*1.3+22,{w:500,size:14,color:DB.muted}));
  const rows=[["Data Science 101",num],["Statistics 110",88],["Programming 100",76],["Data Ethics 120",64]],lx=bx+20,bw2=bwid-60-tw(ctx,"108%",m,700),r0=cy+m*1.3+40,rh=Math.min(m*2.1,(gh-(r0-cy)-16)/rows.length);
  const row=(n,v,i,c,vc)=>{const yy=r0+i*rh;T(ctx,n,lx,yy+m*0.8,{w:i?500:700,size:15,color:DB.text});const b0=yy+m*0.8+8;ctx.fillStyle=DB.track;rr(ctx,lx,b0,bw2,12,4);ctx.fill();
    ctx.fillStyle=c;rr(ctx,lx,b0,bw2*Math.min(1,v/100),12,4);ctx.fill();if(v>100){ctx.fillStyle=DB.red;rr(ctx,lx+bw2-3,b0-5,6,22,2);ctx.fill();}T(ctx,Math.round(v)+"%",lx+bw2+14,b0+12,{w:700,size:16,color:vc||DB.text});};
  rows.forEach(([n,v],i)=>row(n,v,i,i?"#8bcae7":DB.blue));
  if(gIn>0)withA(ctx,gIn,()=>{ctx.fillStyle=DB.card;ctx.fillRect(lx-4,r0-4,bwid-36,rh);row("Data Science 101",108,0,DB.red,DB.red);});
  ctx.strokeStyle=DB.muted;ctx.setLineDash([4,4]);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(lx+bw2,r0+4);ctx.lineTo(lx+bw2,r0+rows.length*rh);ctx.stroke();ctx.setLineDash([]);
  ctx.restore();};}
// the lineage: each step's box fits its name, and the steps are spaced by their widths (phLinPts gives where they are)
function phLinPts(ctx,x0,y,dx){if(typeof LIN==="undefined")return[];const m=phMin(ctx);if(!m)return LIN.map((_,i)=>[x0-i*dx,y]);const ws=LIN.map(([n,sub])=>Math.max(tw(ctx,n,Math.max(22,m),700,"mono"),tw(ctx,sub,Math.max(17,m),500))+44),gap=Math.max(24,dx-ws.reduce((a,b)=>a+b,0)/LIN.length);
  const P=[[x0,y]];for(let i=1;i<LIN.length;i++)P.push([P[i-1][0]-ws[i-1]/2-gap-ws[i]/2,y]);return P;}
if(typeof lineage==="function"&&typeof LIN!=="undefined"){const LN0=lineage;lineage=function(ctx,x0,y,dx,o){const m=phMin(ctx);if(!m)return LN0.apply(this,arguments);o=o||{};const pts=phLinPts(ctx,x0,y,dx);
  ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();
  if(o.k>0){const k=Math.min(o.k,pts.length-1),i=Math.floor(k),f=k-i,end=i<pts.length-1?[lerp(pts[i][0],pts[i+1][0],f),y]:pts[i];
    beam(ctx,[{x:pts[0][0],y},{x:end[0],y}],BAD,[[22,0.08],[9,0.22],[3,0.85],[1.5,1]]);glow(ctx,end[0],y,36,BAD,0.7);}
  pts.forEach((p,i)=>{const [n,sub]=LIN[i],bad=i===3&&o.bad,on=o.k>=i-0.05,c=bad?BAD:i===4?LAYER.bronze:i===0?GOLDC:[170,205,255],w=Math.max(tw(ctx,n,Math.max(22,m),700,"mono"),tw(ctx,sub,Math.max(17,m),500))+44;
    glass(ctx,p[0]-w/2,y-52,w,104,18,c,{glow:on?22:8,ea:on?0.95:0.45,fill:"rgba(8,14,28,0.92)"});T(ctx,n,p[0],y-8,{w:700,size:22,f:"mono",align:"center"});T(ctx,sub,p[0],y+30,{w:500,size:17,align:"center",color:rgba(SOFT,0.95)});
    if(i===3){const gc=bad?BAD:GOOD;ctx.strokeStyle=rgba(gc,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p[0],y-79);ctx.lineTo(p[0],y-52);ctx.stroke();gate(ctx,p[0],y-114,70,gc,"tests");
      T(ctx,bad?"test failed":"tests pass",p[0]+42,y-108,{w:700,size:18,color:rgba(gc,1)});}});return pts;};}
// the data contract: the statuses in the sans, so the new one fits on the same line
if(typeof contract==="function"&&typeof stampV==="function"){const CT0=contract;contract=function(ctx,x,y,w,h,o){const m=phMin(ctx);if(!m)return CT0.apply(this,arguments);o=o||{};
  const ver=o.ver||"1.0",dA=o.deferred||0,S=Math.max(22,m);glass(ctx,x,y,w,h,24,[236,243,255],{glow:24+10*(o.glow||0),ea:0.9,fill:"rgba(10,16,32,0.95)"});
  T(ctx,"Data contract · enrolments",x+36,y+60,{w:800,size:34});stampV(ctx,x+w-40,y+50,"v"+ver,o.verFlash||0);
  const key=(k,yy)=>T(ctx,k,x+36,yy,{w:700,size:21,color:rgba(SOFT,0.95)}),vx=x+36+tw(ctx,"Freshness",Math.max(21,m),700)+26,base="enrolled · withdrawn · waitlisted";
  const rows=[()=>{key("Fields",y+136);T(ctx,"student, offering, status, date",vx,y+136,{w:600,size:23});},
    ()=>{key("Statuses",y+192);T(ctx,base,vx,y+192,{w:700,size:S});if(dA>0)withA(ctx,dA,()=>T(ctx," · deferred",vx+tw(ctx,base,S,700),y+192,{w:700,size:S,color:rgba(mixc(INK,GOLDC,o.defHi||0),1)}));},
    ()=>{key("Meaning",y+248);T(ctx,"enrolled = holds a place on census date",vx,y+248,{w:600,size:22});T(ctx,"waitlisted = no place yet · withdrawn = left",vx,y+282,{w:600,size:22});
      if(dA>0)withA(ctx,dA,()=>T(ctx,"deferred = starts in a later term",vx,y+316,{w:600,size:22,color:rgba(mixc(INK,GOLDC,o.defHi||0),1)}));},
    ()=>{key("Freshness",y+364);T(ctx,"by 06:00 every day",vx,y+364,{w:600,size:23});}];
  rows.forEach((draw,i)=>withA(ctx,o.rows==null?1:clamp(o.rows*rows.length-i,0,1),draw));
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+26,y+398);ctx.lineTo(x+w-26,y+398);ctx.stroke();
  const cx1=x+w*0.44,cx2=x+w*0.7;key("Owners",y+432);T(ctx,"business",cx1,y+432,{w:700,size:18,color:rgba(BIZ,0.95)});T(ctx,"technical",cx2,y+432,{w:700,size:18,color:rgba(TECH,0.95)});
  T(ctx,"produce",vx,y+474,{w:600,size:19,color:rgba(SOFT,0.95)});T(ctx,"use",vx,y+516,{w:600,size:19,color:rgba(SOFT,0.95)});
  [["mei",cx1,y+474],["ben",cx2,y+474],["ana",cx1,y+516],["sam",cx2,y+516]].forEach(([id,cx,cy],i)=>{const P=PEOPLE[id],a=o.sign?clamp(o.sign*4-i,0,1):0,n=o.notice?o.notice:0;
    withA(ctx,0.35+0.65*Math.max(a,n),()=>{led(ctx,cx,cy-15,12,12,P.edge);T(ctx,P.name.split(" ")[0],cx+22,cy,{w:700,size:22,color:rgba(P.edge,0.95)});});});};}
// a video-call tile's name, and the clock chip's note, in labels as wide as their words
if(typeof callTile==="function"){const CL0=callTile;callTile=function(ctx,id,x,y,w,h,o){const m=phMin(ctx);if(!m)return CL0.apply(this,arguments);o=o||{};CL0(ctx,id,x,y,w,h,Object.assign({},o,{label:0}));
  const P=PEOPLE[id],n=P.name.replace("Prof. ",""),S=Math.max(18,m);withA(ctx,o.label==null?1:o.label,()=>{glass(ctx,x+12,y+h-S-32,tw(ctx,n,S,700)+30,S+20,12,P.edge,{glow:6,ea:0.5,fill:"rgba(6,10,20,0.85)"});T(ctx,n,x+27,y+h-22-S*0.16,{w:700,size:S});});};}
if(typeof clockChip==="function"){const CC0=clockChip;clockChip=function(ctx,S,s,sub,a){setScreen(ctx,S);const m=phMin(ctx);if(!m||!sub)return CC0.apply(this,arguments);withA(ctx,a==null?1:a,()=>{const ss=Math.max(20,m),w=28+tw(ctx,s,32,800,"mono")+18+tw(ctx,sub,ss,600)+28;
  glass(ctx,64,52,w,64,18,[170,205,255],{glow:10,ea:0.5,fill:"rgba(8,14,28,0.85)"});T(ctx,s,92,96,{w:800,size:32,f:"mono"});T(ctx,sub,92+tw(ctx,s,32,800,"mono")+18,95,{w:600,size:ss,color:rgba(SOFT,0.95)});});};}
// the platform in one row: its note about the last good data stays inside the frame
if(typeof platformRow==="function"){const PR0=platformRow;platformRow=function(ctx,t,o){const m=phMin(ctx);if(!m||!(o&&o.banner>0))return PR0.apply(this,arguments);PR0(ctx,t,Object.assign({},o,{banner:0}));
  const y=o.y||470,s="last good data · yesterday 23:02",w=tw(ctx,s,Math.max(16,m),700)+26;withA(ctx,o.banner,()=>tag(ctx,Math.min(1725,1900-w/2),y-150,s,AMBER,{align:"center",size:16}));};}

/* ---------- The Inner Life of Data's plaque (style2.js), at sizes that read ---------- */
// each row's label and value on lines far enough apart for the larger words, and the plaque as tall as they need
if(typeof plaque==="function"){const PQ0=plaque;plaque=function(ctx,x,y,w,rows,c){const m=phMin(ctx);if(!m)return PQ0.apply(this,arguments);const rh=Math.max(52,m*2.3),h=20+rows.length*rh;
  glass(ctx,x,y,w,h,14,c,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.9)"});
  rows.forEach((r,i)=>{const yy=y+16+i*rh;let tx=x+18;if(r[2]){const lw=logo(ctx,r[2],tx,yy+8,28);tx+=Math.max(lw,26)+10;}T(ctx,r[0],tx,yy+m*0.85,{size:15,w:700,color:rgba(SOFT,0.95)});T(ctx,r[1],tx,yy+m*1.95,{size:21,w:700});});return h;};}

/* ---------- A Sharper Sketch's calendar card (sketch3.js), at sizes that read ---------- */
// the coloured band grows to hold its title, and the card grows to hold the date and its label
if(typeof calCard==="function"){const CA0=calCard;calCard=function(ctx,x,y,title,date,col,a,hi){const m=phMin(ctx);if(!m)return CA0.apply(this,arguments);withA(ctx,a,()=>{const bh=m+16,h=bh+m*2.9+10;
  glass(ctx,x,y,300,h,14,col,{glow:12+14*(hi||0),ea:0.7,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.9);rr(ctx,x,y,300,bh,14);ctx.fill();ctx.fillStyle="rgba(7,12,24,0.94)";ctx.fillRect(x,y+bh-8,300,10);
  T(ctx,title,x+150,y+bh/2+m*0.3,{w:800,size:16,align:"center",color:"#0a1020"});T(ctx,date,x+150,y+bh+m*1.35,{w:800,size:28,align:"center",color:rgba(col,1)});T(ctx,"census date",x+150,y+bh+m*2.5,{w:600,size:14,align:"center",color:rgba(SOFT,1)});});};}
