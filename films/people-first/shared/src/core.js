/* ===== The people kit: Leading data people's own look =====
   The films of Leading data people are about people, so they draw people first: whole, in a place where they act, meet or move,
   with faces that react and hands that rest on things, in flat colour with one even ink line (the author asked for "a more cartoon
   or soft style", easy to design people in and quick to draw, and chose the ink line among four looks, 17 November 2026). Everything is drawn with the plain canvas, in the
   1920 x 1080 frame: nothing is painted per pixel, blurred or filtered, so a frame takes about a fifth of what the module's first
   look took, and a place is painted once and kept as a picture (the agent films' kit, AG_PLACES).
   The kit's files, bundled in this order after The Inner Life of Data's engine and helpers (core.js, style2.js, ui3.js),
   A Sharper Sketch's scene() (sketch3.js) and the agent films' camera and shots (kit.js):
     core.js    the helpers, and the looks: how a shape, a line of detail and a shadow are painted
     people.js  the cast, the poses, the faces, the rig, and a person drawn whole; a walk, a turn, a reach
     things.js  what people sit at, hold and work with: chairs, tables, desks, screens, mugs, plants, a seedling, a tree
     words.js   words on the frame: a card, a tag, a name, something said, the kicker, the title and end cards
     places.js  the university's places, painted once: the team's room, Helena's corner, the campus, a teaching room
   Each file is closed in a function of its own, so the only name the kit adds to a film is PK; a film's own helpers go in its own
   source with a prefix of its own. Never change these files for one film.
   The look is one word: PK.use("line") (ink line, the default and the module's look), "tint" (soft line), "soft" (soft shapes) or
   "paper" (cut paper). Every film is staged once, for any of them. */
const PK=(()=>{
const TAU=Math.PI*2,rad=d=>d*Math.PI/180;
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const sine=t=>0.5-0.5*Math.cos(Math.PI*clamp(t,0,1));
const pin=(t,t0,d)=>sine((t-t0)/(d||0.5));                       // 0 before t0, 1 after t0 + d, eased
const pio=(t,t0,t1,d)=>pin(t,t0,d)*(1-pin(t,t1,d));              // in at t0, out at t1
const spring=(t,t0,d)=>{const x=(t-t0)/(d||0.6);if(x<=0)return 0;if(x>=1.6)return 1;return 1-Math.exp(-5.2*x)*Math.cos(7.5*x);};
const mix=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const dk=(c,k)=>mix(c,[38,26,30],k),lt=(c,k)=>mix(c,[255,250,240],k);
const css=(c,a)=>a==null||a>=0.999?"rgb("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+")":"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+a+")";
function rnd(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
const hash=(a,b)=>{let h=(a*374761393+(b||0)*668265263)>>>0;h=((h^(h>>>13))*1274126177)>>>0;return((h^(h>>>16))>>>0)/4294967296;};
// deg is from straight down, positive the way the person faces
const polar=(p,deg,len)=>[p[0]+Math.sin(rad(deg))*len,p[1]+Math.cos(rad(deg))*len];

/* a smooth closed (or open) curve through points; a point's third value is how sharp a corner it is: 1 a corner, 0 or none a curve */
const area=pts=>{let a=0;for(let i=0;i<pts.length;i++){const q=pts[(i+1)%pts.length];a+=pts[i][0]*q[1]-q[0]*pts[i][1];}return a/2;};
const cw=pts=>area(pts)<0?pts.slice().reverse():pts;      // every closed shape runs the same way round, so shapes in one path join
function pg(ctx,pts){pts=cw(pts);ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();}
function spline(ctx,pts,closed,ten){const n=pts.length;if(n<2)return;closed=closed!==false;ten=ten==null?1:ten;if(closed)pts=cw(pts);
  const P=i=>pts[closed?(i%n+n)%n:clamp(i,0,n-1)];ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=0,m=closed?n:n-1;i<m;i++){const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2),t1=ten/6*(1-(p1[2]||0)),t2=ten/6*(1-(p2[2]||0));
    ctx.bezierCurveTo(p1[0]+(p2[0]-p0[0])*t1,p1[1]+(p2[1]-p0[1])*t1,p2[0]-(p3[0]-p1[0])*t2,p2[1]-(p3[1]-p1[1])*t2,p2[0],p2[1]);}
  if(closed)ctx.closePath();}
/* a tapering capsule from A (radius ra) to B (radius rb): a limb's segment */
function capsule(ctx,A,B,ra,rb){const g=Math.atan2(B[1]-A[1],B[0]-A[0]),h=Math.PI/2;
  ctx.moveTo(A[0]+Math.cos(g+h)*ra,A[1]+Math.sin(g+h)*ra);ctx.arc(A[0],A[1],ra,g+h,g+3*h);
  ctx.lineTo(B[0]+Math.cos(g-h)*rb,B[1]+Math.sin(g-h)*rb);ctx.arc(B[0],B[1],rb,g-h,g+h);ctx.closePath();}
function rrect(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
const ell=(ctx,x,y,rx,ry,r)=>{ctx.moveTo(x+rx*Math.cos(r||0),y+rx*Math.sin(r||0));ctx.ellipse(x,y,rx,ry,r||0,0,TAU);ctx.closePath();};

/* ---------------------------------------------------------------- the looks
   A look paints a shape (S.fill), a line of detail (S.line) and a flat shadow, and holds how a person is proportioned. A shape is
   a function that adds its outline to the path; the look decides what an outline is.
     line   ink line (the default): one even dark line round every form, flat colour
     tint   soft line: each form lined in a darker tone of its own colour, a soft shade on big forms, a blush
     soft   soft shapes: rounded flat shapes, no outlines, one soft shade, a blush
     paper  cut paper: every piece casts a small hard shadow on the piece below, its edges a little uneven */
const INK=[52,40,44];
const SKINS={
  tint:{id:"line",key:"tint",name:"Soft line",ink:[112,76,80],self:0.4,lw:1,shade:true,blush:0.3,
    prop:{head:184,neck:20,torso:300,thigh:218,shin:210,ankle:40,uarm:150,farm:138,hand:48,shW:94,hipW:43,arm:[58,50,40],leg:[84,66,49],tor:[230,188,208],foot:127},
    tone:c=>c},
  soft:{id:"soft",key:"soft",name:"Soft shapes",ink:[70,56,62],lw:0,shade:true,blush:0.34,
    prop:{head:190,neck:18,torso:300,thigh:212,shin:204,ankle:40,uarm:148,farm:136,hand:50,shW:96,hipW:44,arm:[60,52,42],leg:[88,70,52],tor:[236,196,214],foot:128},
    tone:c=>c},
  line:{id:"line",key:"line",name:"Ink line",ink:INK,lw:1,blush:0,
    prop:{head:172,neck:24,torso:304,thigh:226,shin:218,ankle:40,uarm:152,farm:140,hand:46,shW:92,hipW:42,arm:[54,46,36],leg:[80,62,46],tor:[222,180,200],foot:126},
    tone:c=>c},
  paper:{id:"paper",key:"paper",name:"Cut paper",ink:[84,64,60],lw:0,blush:0.62,
    prop:{head:204,neck:14,torso:292,thigh:204,shin:196,ankle:38,uarm:144,farm:130,hand:52,shW:98,hipW:46,arm:[64,56,46],leg:[92,76,58],tor:[244,208,226],foot:132},
    tone:c=>mix(c,[214,196,176],0.13)}
};
// a person's parts as shares of their height: head + neck + torso + thigh + shin + ankle is 1000
const norm=p=>{const t=p.head+p.neck+p.torso+p.thigh+p.shin+p.ankle,f=1000/t,o={};for(const j in p)o[j]=Array.isArray(p[j])?p[j].map(v=>v*f):p[j]*f;return o;};
for(const k in SKINS)SKINS[k].prop=norm(SKINS[k].prop);

/* S.begin(ctx, o): start drawing a thing. o.lw: the line's width here, o.sh: how far a piece's shadow falls (paper), in frame px;
   both follow the thing's size. o.far (0 to 1): how far off it is: its line fades towards its own colour. The paper shadow always
   falls down and to the right of the frame, however the thing is turned or mirrored. */
function skinBegin(S,ctx,o){o=o||{};S._lw=o.lw==null?3:o.lw;S._far=o.far||0;
  if(S.id==="paper"){const m=ctx.getTransform(),det=m.a*m.d-m.b*m.c,k=o.sh==null?4:o.sh,z=Math.sqrt(Math.abs(det))||1,sx=k*0.55*z,sy=k*z;
    S._sx=(m.d*sx-m.c*sy)/det;S._sy=(-m.b*sx+m.a*sy)/det;S._k=k;}}
/* S.fill(ctx, fn, col, o): a closed shape. o.line false: no outline; o.grad [x0, y0, x1, y1, k]: a soft shade towards (x1, y1);
   o.flat: no shadow (paper); o.w: the outline's width, as a share of the thing's line; o.ink: the outline's own colour */
function skinFill(S,ctx,fn,col,o){o=o||{};const c=css(col);ctx.beginPath();fn(ctx);
  if(S.id==="line"){if(o.line!==false&&S._lw>0){const ink=o.ink||(S.self?dk(col,S.self):S.ink);ctx.lineJoin="round";ctx.lineCap="round";ctx.lineWidth=2*S._lw*(o.w||1);ctx.strokeStyle=css(S._far?mix(ink,col,S._far):ink);ctx.stroke();}
    if(S.shade&&o.grad){const g=ctx.createLinearGradient(o.grad[0],o.grad[1],o.grad[2],o.grad[3]);g.addColorStop(0,c);g.addColorStop(1,css(dk(col,o.grad[4]==null?0.16:o.grad[4])));ctx.fillStyle=g;}else ctx.fillStyle=c;
    ctx.fill();return;}
  if(S.id==="paper"){if(!o.flat&&S._k>0){ctx.save();ctx.translate(S._sx,S._sy);ctx.beginPath();fn(ctx);ctx.fillStyle="rgba(58,36,30,"+(o.sa||0.3)+")";ctx.fill();ctx.restore();ctx.beginPath();fn(ctx);}
    ctx.fillStyle=c;ctx.fill();return;}
  if(o.grad){const g=ctx.createLinearGradient(o.grad[0],o.grad[1],o.grad[2],o.grad[3]);g.addColorStop(0,c);g.addColorStop(1,css(dk(col,o.grad[4]==null?0.16:o.grad[4])));ctx.fillStyle=g;}
  else ctx.fillStyle=c;
  ctx.fill();}
/* S.line(ctx, fn, col, w, o): a line of detail, drawn only by the looks named in o.on ("line" by default: detail is the line's job) */
function skinLine(S,ctx,fn,col,w,o){o=o||{};if((o.on||"line").indexOf(S.id)<0)return;ctx.beginPath();fn(ctx);ctx.lineCap="round";ctx.lineJoin="round";
  ctx.lineWidth=S.id==="line"?S._lw*(w||0.7):(w||1)*(o.px||2);ctx.strokeStyle=css(col||(S.id==="line"?(S._far?mix(S.ink,o.over||[200,190,170],S._far):S.ink):S.ink),o.a==null?1:o.a);ctx.stroke();}
/* paper: scissors don't follow a curve exactly: nudge each point a little, the same way every time */
function cut(pts,seed,k){let d=0;for(let i=0;i<pts.length;i++){const q=pts[(i+1)%pts.length];d+=Math.hypot(q[0]-pts[i][0],q[1]-pts[i][1]);}
  const j=Math.min(3.2,d/pts.length*0.035)*k;return pts.map((p,i)=>p[2]?p:[p[0]+(hash(seed,i*2)-0.5)*2*j,p[1]+(hash(seed,i*2+1)-0.5)*2*j]);}
for(const k in SKINS){const S=SKINS[k];S.begin=(ctx,o)=>skinBegin(S,ctx,o);S.fill=(ctx,fn,col,o)=>skinFill(S,ctx,fn,col,o);S.line=(ctx,fn,col,w,o)=>skinLine(S,ctx,fn,col,w,o);
  S.poly=(ctx,pts,col,o)=>skinFill(S,ctx,c=>spline(c,S.id==="paper"&&!(o&&o.exact)?cut(pts,(o&&o.seed)||pts.length,(o&&o.cut)||1):pts,true,(o&&o.ten)!=null?o.ten:(S.id==="paper"?0.82:1)),col,o);}

/* ---------------------------------------------------------------- the kit
   K.S is the look in use; K.use(key) changes it (and forgets the places painted in the look before). K.u holds the helpers the
   kit's other files and a film's own pictures draw with. */
const K={SKINS,S:SKINS.line,norm,
  u:{TAU,rad,lerp,clamp,sine,pin,pio,spring,mix,dk,lt,css,rnd,hash,polar,area,cw,pg,spline,capsule,rrect,ell},
  use(key){if(!SKINS[key])throw new Error("PK.use: no look "+key);if(K.S!==SKINS[key]&&typeof AG_KEPT!=="undefined")for(const q of Object.keys(AG_KEPT))if(q.indexOf("place:")===0||q.indexOf("pk:")===0)delete AG_KEPT[q];
    K.S=SKINS[key];return K.S;}};
/* the colours that mean something in every film of the module, as in its first look: blue is plans and rules, green something done
   or of value, amber a risk or a cost, orange data, violet only an agent. They are for words and marks. People's clothes are soft,
   muted colours and never one of the five at this strength. */
K.C={ink:[52,40,44],mut:[122,106,104],card:[253,249,240],blue:[46,104,162],green:[52,132,92],amber:[186,118,26],orange:[204,104,56],violet:[110,92,196],white:[255,255,255]};
return K;})();
