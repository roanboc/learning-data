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
  const lw=Math.max(...rowsF.map(r=>tw(ctx,r[0],ls,500,"mono")),0),h=o.h||Math.max(Math.round(w*0.68),(o.title?84:56)+rowsF.length*rh);
  // the card itself, from words.js, with no rows; then the rows, in the same place and turn
  f(ctx,x,y,w,Object.assign({},o,{h,issuer:null,holder:null,claim:null,evidence:null,date:null,signed:false}));
  const era=o.era||"digital",dk=era==="digital"||era==="badge",hl=o.hl||{},ink=dk?rgba(INK,0.95):(era==="tablet"?"rgba(60,36,20,0.9)":"rgba(52,40,30,0.92)"),lab=dk?rgba(SOFT,1):(era==="tablet"?"rgba(70,44,26,0.7)":"rgba(110,86,54,0.9)");
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);const yy=o.title?44+rh:Math.max(42,16+vs);
    // a digital card's "signed", beside its seal rather than under it, where the larger word fits
    if(era==="digital"&&o.signed!==false)T(ctx,o.signed||"signed",w-78,h-30,{f:"mono",w:500,size:Math.max(12,m),align:"right",color:rgba(SOFT,1)});
    rowsF.forEach(([k,v],i)=>{const on=hl[k]||0,ry=yy+i*rh;if(on>0){ctx.fillStyle=dk?rgba(o.col||TRUST,0.16*on):"rgba(200,140,40,"+(0.22*on)+")";rr(ctx,12,ry-vs*0.95,w-24,rh,8);ctx.fill();}
      T(ctx,k,22,ry,{f:"mono",w:500,size:ls,color:lab});T(ctx,v,34+lw,ry,{w:700,size:vs,color:ink});});ctx.restore();});return h;})(credCard);

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
// its title and its line under it at least the smallest size that reads, the card grown about its middle to fit them
if(typeof sysCard==="function"){const SC0=sysCard;sysCard=function(ctx,x,y,w,h,title,sub,c,icon){const m=phMin(ctx);if(!m)return SC0.apply(this,arguments);
  const ts=Math.max(22,m),ss=Math.max(16,m),H=sub?Math.max(h,ts+ss*1.2+26):Math.max(h,ts+26),Y=y+(h-H)/2;
  glass(ctx,x,Y,w,H,16,c,{glow:16,ea:0.6});led(ctx,x+12,Y+16,5,H-32,c);
  if(sub){T(ctx,title,x+32,Y+H/2-ss*0.2,{w:700,size:ts});T(ctx,sub,x+32,Y+H/2+ss*0.95,{w:500,size:ss,color:rgba(SOFT,0.95)});}else T(ctx,title,x+32,Y+H/2+ts*0.36,{w:700,size:ts});
  if(icon)icon(ctx,x+w-44,Y+H/2);};}
