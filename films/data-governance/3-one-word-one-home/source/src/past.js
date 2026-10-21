/* ===== One word, one home: the past =====
   Qin, from 221 BC to about 220 BC, painted the series' way (master data's wash.js and people.js, the series' rooms.js and people.js):
   a road through the loess hills, two ox carts rolling in the same pair of ruts; the town gate, a stall with the standard measure and
   weight, and a courier bringing the court's orders; the court's slips, close; the county office at Qianling, scribes kneeling at low
   tables, the board of word rules at one scribe's elbow; and the board close, as it was and as it was found in 2002. Its people wear
   their own time, as the First Emperor's mausoleum museum describes its civil officials (pit K0006): a long robe crossed at the
   collar and belted, trousers, square-toed shoes; a long cap tied under the chin for an official, a headcloth for others; a writing
   knife and a whetstone at a scribe's belt; dark colours, black favoured. Nothing borrows a style from Chinese painting, and no
   characters are drawn: the ink is faint strokes too small to read, and the rules are given in English on cards. The places are
   painted once and kept (the series' finish.js); what moves is drawn every frame. Every name starts with ow_ or OW. */

/* ---------- colours ---------- */
const OW={loess:[226,194,134],loessDk:[196,158,100],loessLt:[240,218,170],field:[204,198,128],millet:[218,200,124],road:[222,196,148],rut:[150,116,78],
  rammed:[216,186,134],timber:[116,84,58],timberDk:[86,62,46],tile:[94,96,106],plaster:[234,216,178],floor:[204,176,130],mat:[224,200,142],
  wood:[204,168,118],woodDk:[150,112,74],black:[52,50,60],hemp:[204,190,158],brown:[124,94,66],slate:[80,88,106],cinnabar:[172,66,52],
  bronze:[184,138,70],bronzeDk:[118,84,42],ox:[150,108,76],slip:[232,212,166],ink:[60,48,42],board:[214,184,132],boardOld:[112,82,58],mount:[74,84,102]};
// the colours of the three meanings of award, as Who decides painted them: violet (the new words, with microcredentials), rose (the
// words before Monday), olive (degrees only); a wash for paper, an ink for words
const OW_MEAN=[[110,92,190],[214,96,140],[150,156,56]],OW_MEANINK=[[78,58,160],[168,50,98],[94,100,22]];

/* ---------- places in depth ---------- */
// the road and the gate are painted as the camera sees them: x across, y up, z away from us, in metres; F is the lens, hz the horizon on
// screen, ch the camera's height. The ruts, the carts and the walls all come from it, so two carts in the same ruts are the same width.
function ow_pj(C,X,Y,Z){const z=Math.max(0.3,Z);return[960+C.F*X/z,C.hz+C.F*(C.ch-Y)/z];}
const ow_ppm=(C,Z)=>C.F/Math.max(0.3,Z);
// a line on the ground (or at a height), from z0 to z1, spaced so it's even on screen
function ow_line(C,z0,z1,fx,fy,n){const o=[];n=n||48;for(let i=0;i<=n;i++){const z=z0*Math.pow(z1/z0,i/n);o.push(ow_pj(C,fx(z),fy?fy(z):0,z));}return o;}
const ow_band=(C,z0,z1,fa,fb,fy,n)=>ow_line(C,z0,z1,fa,fy,n).concat(ow_line(C,z0,z1,fb,fy,n).reverse());
// a loess hill, terraced: the yellow earth washed to its top line f, and the terraces as contour lines, following the top near it and
// flattening towards its foot (base); every other terrace a little greener with its crop, the edge of each a darker line
function ow_hill(ctx,f,base,col,depth,seed,o){o=o||{};const pts=wc_land(ctx,f,col,depth,{seed,line:false}),n=o.n||8,R=wc_rng(seed);ctx.save();wc_tr(ctx,pts);ctx.clip();
  const L=i=>{const u=Math.pow(i/n,o.p||1.35),q=[];for(let x=-60;x<=W+60;x+=12){const t=f(x);q.push([x,lerp(t,Math.max(base,t),u)+(i?2.4*Math.sin(x/(46+i*9)+i*1.3):0)]);}return q;};
  for(let i=0;i<n;i++)if(i%2===1||R()<0.25){const a=L(i),b=L(i+1).reverse();wc_wash(ctx,a.concat(b),i%4===1?mix(col,[160,170,92],0.42):wc_lit(col,0.1),{kind:"field",depth,seed:seed+i*7,a:0.55});}
  ctx.lineCap="round";for(let i=1;i<=n;i++){const l=L(i);ctx.strokeStyle=rgba(wc_dim(wc_haze(col,depth),0.28),0.22+0.3*depth);ctx.lineWidth=(o.lw||1.6)*(0.7+0.6*i/n);
    ctx.beginPath();l.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
  // the gullies the rain cuts down loess, from the top
  for(let g=0;g<(o.gullies||0);g++){const x0=lerp(o.gx0||0,o.gx1||W,R()),t=f(x0);if(t>=base-10)continue;const len=(base-t)*(0.4+R()*0.4);ctx.strokeStyle=rgba(wc_dim(wc_haze(col,depth),0.32),0.3);
    ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0,t+4);ctx.quadraticCurveTo(x0+(R()-0.5)*20,t+len*0.5,x0+(R()-0.5)*30,t+len);ctx.stroke();}
  ctx.restore();return pts;}
// a smooth bump for a hill's top: from its foot at the base, up to its top over x0, down again; the two sides can differ in width
const ow_bump=(x,x0,wl,wr,top,base)=>{const u=(x-x0)/(x<x0?wl:wr);return base-(base-top)*Math.pow(Math.max(0,1-u*u),1.4);};

/* ---------- the road through the loess hills ---------- */
// the camera on a rise by the road, looking along it to the town: the road winds over the plain, between two terraced hills, to the
// gate. Where it runs is set as an offset on screen at a few depths (k), smooth between them; the carts and the ruts follow it in depth
const OW_RD={F:2200,hz:360,ch:4.0,gauge:1.4,half:1.9,gate:190,k:[[12,-240],[20,60],[32,190],[56,40],[96,-60],[190,60]],road:z=>ow_rdX(OW_RD,z)};
function ow_rdX(C,z){const K=C.k,n=K.length,u=Math.log(clamp(z,K[0][0],K[n-1][0])),U=K.map(k=>Math.log(k[0])),Y=K.map(k=>k[1]);let i=0;while(i<n-2&&u>U[i+1])i++;
  const m=j=>j<=0?(Y[1]-Y[0])/(U[1]-U[0]):j>=n-1?(Y[n-1]-Y[n-2])/(U[n-1]-U[n-2]):(Y[j+1]-Y[j-1])/(U[j+1]-U[j-1]),h=U[i+1]-U[i],s=(u-U[i])/h;
  const sx=(2*s*s*s-3*s*s+1)*Y[i]+(s*s*s-2*s*s+s)*h*m(i)+(-2*s*s*s+3*s*s)*Y[i+1]+(s*s*s-s*s)*h*m(i+1);return sx*z/C.F;}
function ow_paintRoad(ctx){const C=OW_RD,P=WCP,gx=C.road(C.gate),fy=z=>ow_pj(C,0,0,z)[1];wc_sky(ctx,C.hz-10,21,{sun:[1580,130],cx:160,cw:1500,cy:40,ch:110});
  // the far ridges, paler with distance, terraced to their tops
  ow_hill(ctx,x=>226+26*Math.sin(x/310+0.6)+12*Math.sin(x/113+1),C.hz+70,[208,194,166],0.16,3,{n:9,lw:1.2});
  ow_hill(ctx,x=>282+20*Math.sin(x/230+2.2)+8*Math.sin(x/83),C.hz+70,[216,194,150],0.28,5,{n:9,lw:1.3});
  // the plain before the town, its foot
  wc_wash(ctx,[[-60,fy(C.gate)-4],[W+60,fy(C.gate)-4],[W+60,H+60],[-60,H+60]],OW.field,{kind:"ground",depth:0.45,seed:9,line:false});
  // the town: its wall of rammed earth, roofs beyond it, the gate and the timber tower over it; trees at the wall's foot
  ow_town(ctx,C,C.gate,gx,{w0:-30,w1:34,h:7,gate:4.4,gh:4.6,tower:[9,5]});
  for(const [X,Z,h,c] of [[-14,176,6,P.leaf2],[-7,172,5,P.leaf],[13,178,6.5,P.leaf],[19,170,5.5,P.leaf2]]){const [x,y]=ow_pj(C,X,0,Z);wc_roundTree(ctx,x,y+2,h*ow_ppm(C,Z),0.45,c);}
  // the near hills, either side of the town, terraced, with the rain's gullies
  ow_hill(ctx,x=>ow_bump(x,230,900,600,206,452)+6*Math.sin(x/61),452,[226,196,138],0.55,7,{n:11,gullies:5,gx0:120,gx1:700});
  ow_hill(ctx,x=>ow_bump(x,1690,560,700,232,448)+5*Math.sin(x/57+1),448,[222,190,132],0.5,11,{n:11,gullies:4,gx0:1300,gx1:1900});
  // the plain: fields in strips, millet and stubble and fallow, their edges running away to the town; trees along one
  const pf=x=>442+4*Math.sin(x/140),plain=[[-60,pf(-60)]].concat([...Array(42)].map((_,i)=>[i*48,pf(i*48)]),[[W+60,pf(W+60)],[W+60,H+60],[-60,H+60]]);
  ctx.fillStyle=rgba(WC_PAPER,1);wc_tr(ctx,plain);ctx.fill();wc_fieldStrips(ctx,pf,0,H-430,9,[[232,218,160],[218,214,150],[236,214,160],[214,212,148]],0.75,15);
  ctx.save();ctx.strokeStyle=rgba(wc_dim(OW.millet,0.3),0.3);ctx.lineWidth=2;for(const X of [-40,-24,-13,-6,9,17,28,44]){const L=ow_line(C,13,120,()=>X+0.02*X*X/10,null,30);
    ctx.beginPath();L.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}ctx.restore();
  for(const [X,Z,h,c] of [[16,62,7,P.leaf],[21,58,6,P.leaf2],[27,54,7.5,P.leaf],[34,50,6.5,P.leaf2],[-19,84,6.5,P.leaf2],[-26,80,7,P.leaf]]){const [x,y]=ow_pj(C,X,0,Z);wc_roundTree(ctx,x,y+2,h*ow_ppm(C,Z),Math.min(1,0.5+10/Z),c);}
  // the road, its ruts, the path the oxen wear between them, and its edges
  ow_rutRoad(ctx,C,12,C.gate-1);
  // two trees on the near field, on the left
  for(const [X,Z,h,c] of [[-14.5,40,6.5,P.leaf2],[-10.5,31,6,P.leaf]]){const [x,y]=ow_pj(C,X,0,Z);wc_roundTree(ctx,x,y+2,h*ow_ppm(C,Z),1,c);}}
// the road's surface, its ruts and the path the oxen wear between them, and a darker line where it meets the field
function ow_rutRoad(ctx,C,z0,z1,r0){wc_wash(ctx,ow_band(C,z0,z1,z=>C.road(z)-C.half,z=>C.road(z)+C.half,null,64),OW.road,{kind:"ground",seed:19,line:false});
  wc_wash(ctx,ow_band(C,z0,z1,z=>C.road(z)-0.42,z=>C.road(z)+0.42,null,64),wc_lit(OW.road,0.12),{kind:"field",seed:23,a:0.7});
  for(const s of [-1,1]){const g=s*C.gauge/2,q0=r0||z0;wc_wash(ctx,ow_band(C,q0,z1,z=>C.road(z)+g-0.1,z=>C.road(z)+g+0.1,null,64),OW.rut,{kind:"field",seed:29+s,a:0.5});
    ctx.save();ctx.strokeStyle=rgba(wc_dim(OW.rut,0.3),0.4);ctx.lineWidth=2;let L=ow_line(C,q0,z1,z=>C.road(z)+g-0.1*s,null,64);ctx.beginPath();L.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.strokeStyle=rgba(wc_dim(OW.road,0.35),0.5);ctx.lineWidth=2.4;L=ow_line(C,z0,z1,z=>C.road(z)+s*C.half,null,64);ctx.beginPath();L.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();}}
// a town's wall at depth z, its gate at x gx: rammed earth in layers, a gate passage framed in timber, the tower over it, roofs beyond
function ow_town(ctx,C,z,gx,o){const pj=(X,Y)=>ow_pj(C,X,Y,z),k=ow_ppm(C,z);
  // roofs inside the walls, a little further off
  const R=wc_rng(31);for(let i=0;i<9;i++){const X=o.w0+8+R()*(o.w1-o.w0-16);if(Math.abs(X-gx)<7)continue;const [x,y]=ow_pj(C,X,o.h-0.6,z+6+R()*10),w=(5+R()*5)*ow_ppm(C,z+10),h=w*0.34;
    wc_part(ctx,[[x-w/2,y],[x+w/2,y],[x+w*0.38,y-h],[x-w*0.38,y-h]],OW.tile,0.5);}
  const [ax,ay]=pj(o.w0,o.h),[bx,by]=pj(o.w1,0);wc_part(ctx,wc_rect(ax,ay,bx-ax,by-ay),OW.rammed,0.62,{seed:33});
  ctx.save();ctx.beginPath();ctx.rect(ax,ay,bx-ax,by-ay);ctx.clip();ctx.strokeStyle=rgba(wc_dim(OW.rammed,0.2),0.3);ctx.lineWidth=Math.max(1,0.05*k);
  for(let Y=0.25;Y<o.h;Y+=0.25){const yy=pj(0,Y)[1];ctx.beginPath();ctx.moveTo(ax,yy);ctx.lineTo(bx,yy+0.5);ctx.stroke();}ctx.restore();
  // the gate passage: dark inside, a lintel and posts of timber
  const g=o.gate/2,[px0,py0]=pj(gx-g,o.gh),[px1,py1]=pj(gx+g,0);wc_part(ctx,wc_rect(px0,py0,px1-px0,py1-py0),[92,74,60],0.66,{kind:"door"});
  wc_part(ctx,wc_rect(px0-0.4*k,py0-0.5*k,px1-px0+0.8*k,0.5*k),OW.timber,0.66);for(const X of [gx-g,gx+g-0.3]){const [x,y]=pj(X,o.gh);wc_part(ctx,wc_rect(x,y,0.3*k,o.gh*k),OW.timber,0.66);}
  // the tower: a timber hall on the wall, posts and a railing, a tiled roof with its eaves reaching out
  const [tw,th]=o.tower,[tx0,ty0]=pj(gx-tw/2,o.h+th*0.62),[tx1,ty1]=pj(gx+tw/2,o.h);wc_part(ctx,wc_rect(tx0,ty0,tx1-tx0,ty1-ty0),[176,140,100],0.66);
  for(let i=0;i<=4;i++){const x=lerp(tx0,tx1,i/4);wc_flat(ctx,wc_rect(x-0.12*k,ty0,0.24*k,ty1-ty0),OW.timberDk,0.66,"post");}
  wc_flat(ctx,wc_rect(tx0,ty1-0.9*k,tx1-tx0,0.16*k),OW.timberDk,0.66,"rail");
  const [rx0,ry0]=pj(gx-tw/2-1.4,o.h+th*0.6),[rx1]=pj(gx+tw/2+1.4,0),[,ry1]=pj(0,o.h+th);
  wc_part(ctx,[[rx0,ry0],[rx1,ry0],[rx1-(rx1-rx0)*0.18,ry1],[rx0+(rx1-rx0)*0.18,ry1]],OW.tile,0.68,{kind:"build"});
  wc_flat(ctx,wc_rect(rx0+(rx1-rx0)*0.16,ry1-0.25*k,(rx1-rx0)*0.68,0.3*k),wc_dim(OW.tile,0.2),0.68,"ridge");
  // a black banner on the tower: Qin favoured black
  const [fx,fy]=pj(gx+tw/2-0.6,o.h+th+2.4);ctx.save();ctx.strokeStyle=rgba(OW.timberDk,0.8);ctx.lineWidth=Math.max(1.2,0.08*k);ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx,pj(0,o.h+th*0.6)[1]);ctx.stroke();ctx.restore();
  wc_wash(ctx,[[fx,fy],[fx+1.6*k,fy+0.3*k],[fx+1.4*k,fy+1.1*k],[fx,fy+1.0*k]],OW.black,{kind:"thing",depth:0.7,lw:1});}

/* ---------- something painted every frame, the way people are ---------- */
// drawn flat into a spare canvas, then given the paper's grain, an uneven dry and a pencil line round it; box is [x, y, w, h] on the place
function ow_paint(ctx,box,draw,o){o=o||{};const [bx,by,bw,bh]=box,pad=10,w=Math.max(4,Math.ceil(bw+pad*2)),h=Math.max(4,Math.ceil(bh+pad*2));const [c,cx]=pcanvas("ow",w,h);
  cx.translate(pad-bx,pad-by);draw(cx);wc_prep();const [fc]=wc_wpaint(c,w,h),ox=bx-pad,oy=by-pad;
  if(o.line!==false){const [tc,tx]=wc_buf("owT"+w+"x"+h,w,h);tx.drawImage(c,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(WC_PENCIL,1);tx.fillRect(0,0,w,h);
    ctx.save();ctx.globalAlpha*=0.7*(o.lineA==null?1:o.lineA);for(const [dx,dy] of [[1.2,0.3],[-1,0.9],[0.3,-1.1]])ctx.drawImage(tc,ox+dx,oy+dy);ctx.restore();}
  ctx.save();if(o.a!=null)ctx.globalAlpha*=o.a;ctx.drawImage(fc,ox,oy);ctx.restore();}
// a flat fill of a path, lit from the upper left, with a soft seam: the way people's clothes are coloured
function ow_fill(q,col,x0,y0,x1,y1,a){litFill(q,col,x0,y0,x1,y1);seam(q,col,a==null?0.4:a);}

/* ---------- an ox cart, seen from behind ---------- */
// its axle across the road at depth z, the wheels in the ruts; d is how far it has come (the wheels turn and the ox steps by it). The ox
// walks between two shafts, a yoke on its neck; from behind and a little above we see its back and hump over the load, its head low,
// its horns. Everything is placed in the cart's own frame (a ahead, b to the right, y up) and painted far to near: the ox's legs, its
// body, head and horns, the yoke and shafts; the far wheel, the bed, the sacks in it, the near side, the tailboard, the near wheel.
function ow_cart(ctx,C,z,d,o){o=o||{};const xc=C.road(z),dir=(C.road(z+0.05)-xc)/0.05,L=Math.hypot(dir,1),D=[dir/L,1/L],N=[1/L,-dir/L],g=C.gauge/2,r=0.66;
  const p=(a,b,y)=>ow_pj(C,xc+D[0]*a+N[0]*b,y,z+D[1]*a+N[1]*b),k=ow_ppm(C,z),step=d*2.2+(o.ph||0);
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const a of [-1.15,5.1])for(const b of [-0.95,0.95])for(const y of [0,1.95]){const [u,v]=p(a,b,y);x0=Math.min(x0,u);x1=Math.max(x1,u);y0=Math.min(y0,v);y1=Math.max(y1,v);}
  const box=[x0,y0,x1-x0,y1-y0],bb=[x0,y0,x1,y1];
  // a solid of cross-sections along a: each an ellipse across (half-width w) and up (half-height h) round centre height c, all filled as one
  const solid=(q,a0,a1,n,f,col,lit)=>{q.beginPath();for(let i=0;i<=n;i++){const a=lerp(a0,a1,i/n),[w,h,c,bo]=f(a);for(let j=0;j<=20;j++){const u=j/20*TAU,[sx,sy]=p(a,(bo||0)+w*Math.cos(u),c+h*Math.sin(u));
      if(j===0)q.moveTo(sx,sy);else q.lineTo(sx,sy);}q.closePath();}litFill(q,col,x0,y0,x1,y1,lit||1);};
  const line=(q,pts,col,lw)=>{q.strokeStyle=rgba(col[0]!=null&&col.length===4?col.slice(0,3):col,col.length===4?col[3]:1);q.lineWidth=lw;q.lineCap="round";q.lineJoin="round";q.beginPath();pts.forEach((v,i)=>i?q.lineTo(v[0],v[1]):q.moveTo(v[0],v[1]));q.stroke();};
  const P3=pts=>pts.map(v=>p(v[0],v[1],v[2]));
  ow_paint(ctx,box,q=>{const ox=o.ox||OW.ox,oxD=wc_dim(ox,0.22),sw=Math.sin(step*0.5)*0.08;
    // the ox's legs: the front pair, then the hind pair stepping
    for(const [a,ph] of [[3.85,0],[2.45,Math.PI/2]])for(const sd of [-1,1]){const lift=Math.max(0,Math.sin(step+ph+(sd>0?Math.PI:0)))*0.14;
      limb(q,P3([[a,sd*0.2,0.85],[a+0.04,sd*0.19,0.42+lift],[a+0.06,sd*0.18,lift*0.5]]),0.15*k,0.09*k,oxD,bb);}
    // its body, a barrel from the rump to the shoulders, the hump over them; the spine down its back; the tail
    solid(q,2.2,4.15,14,a=>{const u=(a-2.2)/1.95,w=0.34*Math.sqrt(Math.max(0.12,1-Math.pow(2*u-1,6)*0.9))+0.02*Math.sin(u*Math.PI),hump=Math.max(0,1-Math.abs(a-3.75)/0.45);
      return[w,0.42+0.08*hump,1.0+0.06*hump];},ox);
    line(q,P3([[2.22,0,1.38],[2.9,0,1.42],[3.5,0,1.46],[3.75,0,1.56],[4.05,0,1.48]]),[...wc_dim(ox,0.35),0.6],Math.max(1,0.03*k));
    line(q,P3([[2.2,0,1.32],[2.12,sw*0.6,0.95],[2.1,sw,0.62]]),wc_dim(ox,0.3),Math.max(1.4,0.04*k));
    solid(q,2.08,2.12,1,()=>[0.05,0.08,0.58,sw],wc_dim(ox,0.45));
    // the neck, falling to the head, held low; the ears; the horns, dark at the root, pale at the tip, curving out and up
    solid(q,4.1,4.6,6,a=>{const u=(a-4.1)/0.5;return[0.26-0.08*u,0.26-0.06*u,1.24-0.06*u];},wc_lit(ox,0.04));
    solid(q,4.55,4.9,4,a=>[0.15,0.16,1.18],wc_lit(ox,0.06));
    for(const sd of [-1,1]){const e=P3([[4.62,sd*0.17,1.24],[4.6,sd*0.33,1.18],[4.66,sd*0.31,1.12],[4.68,sd*0.16,1.16]]);q.beginPath();e.forEach((v,i)=>i?q.lineTo(v[0],v[1]):q.moveTo(v[0],v[1]));q.closePath();litFill(q,wc_dim(ox,0.08),x0,y0,x1,y1);
      const hn=[[4.66,sd*0.1,1.3],[4.69,sd*0.24,1.36],[4.74,sd*0.33,1.48],[4.8,sd*0.34,1.62]],hp=P3(hn);
      for(let i=0;i<3;i++)line(q,[hp[i],hp[i+1]],mix([88,78,68],[216,204,178],i/2.4),Math.max(1.2,(0.07-i*0.018)*k));}
    // the yoke over its neck, and the two shafts back to the cart
    line(q,P3([[4.18,-0.55,1.28],[4.18,-0.28,1.4],[4.18,0.28,1.4],[4.18,0.55,1.28]]),OW.timberDk,Math.max(2,0.08*k));
    for(const sd of [-1,1])line(q,P3([[1.2,sd*0.5,0.98],[4.18,sd*0.5,1.26]]),OW.timberDk,Math.max(2,0.06*k));
    // the wheels: a rim, spokes that turn as it goes, in the ruts
    const wheel=sd=>{const rim=[],inn=[];for(let i=0;i<=40;i++){const u=i/40*TAU;rim.push(p(r*Math.cos(u),sd*g,r+r*Math.sin(u)));inn.push(p(0.86*r*Math.cos(u),sd*g,r+0.86*r*Math.sin(u)));}
      q.beginPath();rim.forEach((v,i)=>i?q.lineTo(v[0],v[1]):q.moveTo(v[0],v[1]));q.closePath();inn.slice().reverse().forEach((v,i)=>i?q.lineTo(v[0],v[1]):q.moveTo(v[0],v[1]));q.closePath();
      q.fillStyle=rgba(OW.timber,1);q.fill("evenodd");q.strokeStyle=rgba(wc_dim(OW.timber,0.5),0.7);q.lineWidth=1.2;q.stroke();
      for(let j=0;j<16;j++){const u=j/16*TAU+d/r;line(q,[p(0.1*Math.cos(u),sd*g,r+0.1*Math.sin(u)),p(0.86*r*Math.cos(u),sd*g,r+0.86*r*Math.sin(u))],wc_dim(OW.timber,0.15),Math.max(1,0.03*k));}};
    const hub=sd=>{const X=xc+N[0]*sd*g,Z=z+N[1]*sd*g;return X*X+Z*Z;},far=hub(1)>hub(-1)?1:-1;wheel(far);
    // the bed: its floor, the far side, the sacks lying in it, the near side and the front, the tailboard and its battens
    const bw=0.55,f0=-1.0,f1=1.25,yb=0.78,yt=1.14,quad=(pts,col)=>{q.beginPath();P3(pts).forEach((v,i)=>i?q.lineTo(v[0],v[1]):q.moveTo(v[0],v[1]));q.closePath();ow_fill(q,col,x0,y0,x1,y1);};
    quad([[f0,-bw,yb],[f1,-bw,yb],[f1,bw,yb],[f0,bw,yb]],wc_dim(OW.wood,0.3));
    quad([[f0,far*bw,yb],[f1,far*bw,yb],[f1,far*bw,yt],[f0,far*bw,yt]],OW.woodDk);quad([[f1,-bw,yb],[f1,bw,yb],[f1,bw,yt],[f1,-bw,yt]],wc_dim(OW.wood,0.15));
    for(const [bo,c] of [[0.24*far,[200,180,138]],[-0.24*far,[214,196,156]]])solid(q,-0.78,1.0,10,a=>{const u=(a+0.78)/1.78;return[0.2*Math.sqrt(Math.max(0.15,1-Math.pow(2*u-1,4))),0.22,yb+0.24,bo];},c);
    quad([[f0,-far*bw,yb],[f1,-far*bw,yb],[f1,-far*bw,yt],[f0,-far*bw,yt]],OW.wood);
    quad([[f0,-bw,0.7],[f0,bw,0.7],[f0,bw,yt+0.03],[f0,-bw,yt+0.03]],wc_lit(OW.wood,0.05));
    for(const y of [0.84,0.96,1.07])line(q,[p(f0,-bw,y),p(f0,bw,y)],[...wc_dim(OW.wood,0.4),0.5],Math.max(1,0.03*k));
    // the near wheel, and the axle's ends through both hubs
    wheel(-far);for(const sd of [-1,1]){const [hx,hy]=p(0,sd*(g+0.1),r);q.beginPath();q.ellipse(hx,hy,0.08*k,0.1*k,0,0,TAU);ow_fill(q,OW.timberDk,hx-5,hy-5,hx+5,hy+5);}},{lineA:0.8});}

/* ---------- people of Qin ---------- */
Object.assign(PEOPLE,{
  // on the road and at the gate
  ow_carter:{name:"",role:"carter",side:"",edge:GV_PAST,seed:41,skin:[212,170,130],hair:{style:"cropped",c:[30,26,24]},hat:"ow_cloth",hatC:[50,48,56],
    top:{kind:"ow_robe",c:[168,146,110],inner:[226,214,190],edge:[112,90,64],belt:[80,60,44]},bottom:{c:[96,84,70]},shoe:[60,46,36],build:{sh:74,hip:62,h:1.0}},
  ow_courier:{name:"",role:"courier",side:"",edge:GV_PAST,seed:42,skin:[204,160,120],hair:{style:"cropped",c:[28,24,24]},hat:"ow_cloth",hatC:[44,42,50],beard:[40,34,32],
    top:{kind:"ow_robe",c:[110,96,82],inner:[224,214,194],edge:[70,58,48],belt:[62,48,38]},bottom:{c:[70,64,60]},shoe:[50,40,34],build:{sh:72,hip:60,h:1.0}},
  ow_official:{name:"",role:"official at the gate",side:"",edge:GV_PAST,seed:43,skin:[222,182,146],hair:{style:"side",c:[30,26,26]},hat:"ow_cap",hatC:[38,36,42],beard:[44,38,34],
    top:{kind:"ow_robe",c:OW.black,inner:[236,230,216],edge:[150,64,52],belt:[70,52,40]},bottom:{c:[62,60,66]},shoe:[40,34,32],build:{sh:74,hip:62,h:1.02}},
  ow_merchant:{name:"",role:"grain seller",side:"",edge:GV_PAST,seed:44,skin:[214,168,126],hair:{style:"cropped",c:[34,28,26]},hat:"ow_cloth",hatC:[58,54,60],
    top:{kind:"ow_robe",c:[186,166,124],inner:[232,224,206],edge:[130,104,70],belt:[98,72,48],hem:-150},bottom:{c:[104,90,72]},shoe:[66,50,38],build:{sh:76,hip:64,h:0.98}},
  ow_buyer:{name:"",role:"townswoman",side:"",edge:GV_PAST,seed:45,skin:[228,188,152],hair:{style:"none",c:[30,26,26]},hat:"ow_hair",
    top:{kind:"ow_robe",c:[100,92,108],inner:[234,228,218],edge:[156,72,62],belt:[120,90,62],hem:-40,long:true},bottom:{c:[80,74,82]},shoe:[60,46,40],build:{sh:64,hip:60,h:0.94}},
  // the county's scribes, with a knife and a whetstone at the belt
  ow_scribeA:{name:"",role:"scribe",side:"",edge:GV_PAST,seed:46,skin:[220,178,140],hair:{style:"cropped",c:[30,26,26]},hat:"ow_cloth",hatC:[42,40,48],beard:[46,38,34],
    top:{kind:"ow_robe",c:OW.black,inner:[236,230,216],edge:[96,92,104],belt:[72,54,40],knife:true},bottom:{c:[60,58,64]},shoe:[40,34,32],build:{sh:74,hip:62,h:1.0}},
  ow_scribeB:{name:"",role:"scribe",side:"",edge:GV_PAST,seed:47,skin:[206,162,124],hair:{style:"cropped",c:[26,22,22]},hat:"ow_cloth",hatC:[46,44,52],
    top:{kind:"ow_robe",c:[84,70,62],inner:[230,222,204],edge:[52,46,46],belt:[60,46,36],knife:true},bottom:{c:[70,62,58]},shoe:[44,36,32],build:{sh:72,hip:60,h:0.98}},
  ow_scribeC:{name:"",role:"scribe",side:"",edge:GV_PAST,seed:48,skin:[230,190,154],hair:{style:"cropped",c:[34,28,28]},hat:"ow_cloth",hatC:[40,38,46],beard:[52,42,36],
    top:{kind:"ow_robe",c:[66,72,88],inner:[234,228,214],edge:[44,46,56],belt:[66,50,38],knife:true},bottom:{c:[60,60,66]},shoe:[42,36,34],build:{sh:76,hip:62,h:1.02}}
});

// ---- the clothes of Qin: the series' engine and its wraps stay as they are; these wrap the torso and head once more, for their kinds only ----
const _owTorso=torso,_owHead=head;
// a long robe, crossed at the collar and belted. Seen from the front its collar reads as a y: the outer lapel's border runs from the
// wearer's left shoulder down across to their right side, over the under-lapel's short edge, with the inner robe's white collar at the
// neck. A figure facing the other way is drawn mirrored (o.flip), so the collar is mirrored back: it crosses the same way on the person.
torso=function(ctx,P,br,sh){const T_=P.top;if(T_.kind!=="ow_robe")return _owTorso(ctx,P,br,sh);
  const c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br,hem=T_.hem||-118,fl=T_.long?40:26,m=ctx.getTransform().a<0?-1:1,X=v=>v*m,ec=T_.edge||darken(c,0.3);
  const path=()=>{ctx.beginPath();ctx.moveTo(-16,y0);ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-2,y0+28,-sw-2,y0+50);
    ctx.bezierCurveTo(-sw-2,y0+84,-hw-2,-352,-hw+2,-322);ctx.quadraticCurveTo(-hw-fl*0.5+sh*0.4,-230,-hw-fl+sh*0.5,hem);
    ctx.quadraticCurveTo(sh*0.5,hem+10,hw+fl+sh*0.5,hem);ctx.quadraticCurveTo(hw+fl*0.5+sh*0.4,-230,hw-2,-322);
    ctx.bezierCurveTo(hw+2,-352,sw+2,y0+84,sw+2,y0+50);ctx.quadraticCurveTo(sw+2,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,16,y0);ctx.closePath();};
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);
  ctx.save();path();ctx.clip();ctx.lineCap="round";
  // folds of the cloth, falling from the belt; the hem's border
  ctx.strokeStyle=rgba(darken(c,0.4),0.3);ctx.lineWidth=2.4;for(const q of [-0.6,-0.18,0.26,0.66]){ctx.beginPath();ctx.moveTo(q*hw*0.8+sh*0.3,-312);ctx.quadraticCurveTo(q*hw*1.05+sh*0.4,-220,q*(hw+fl)*0.95+sh*0.5,hem+4);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(c,0.22),0.2);ctx.lineWidth=5;for(const q of [-0.4,0.45]){ctx.beginPath();ctx.moveTo(q*hw*0.8+sh*0.3,-306);ctx.quadraticCurveTo(q*hw+sh*0.4,-220,q*(hw+fl)*0.9+sh*0.5,hem+4);ctx.stroke();}
  ctx.strokeStyle=rgba(ec,0.92);ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-hw-fl-12+sh*0.5,hem-5);ctx.quadraticCurveTo(sh*0.5,hem+5,hw+fl+12+sh*0.5,hem-5);ctx.stroke();
  // the collar
  const M=[X(4),y0+50],F=[X(-sw*0.6),-336];
  ctx.fillStyle=rgba(T_.inner,1);ctx.beginPath();ctx.moveTo(X(-19),y0-2);ctx.lineTo(X(19),y0-2);ctx.lineTo(M[0],M[1]+6);ctx.closePath();ctx.fill();
  ctx.lineCap="butt";ctx.strokeStyle=rgba(darken(ec,0.06),1);ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(X(-21),y0-4);ctx.lineTo(X(1),y0+46);ctx.stroke();
  ctx.strokeStyle=rgba(T_.inner,0.95);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(X(14),y0-1);ctx.lineTo(F[0]+X(10),F[1]+4);ctx.stroke();
  ctx.strokeStyle=rgba(ec,1);ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(X(23),y0-4);ctx.quadraticCurveTo(X(10),y0+40,F[0],F[1]);ctx.stroke();
  ctx.strokeStyle=rgba(lighten(ec,0.25),0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X(29),y0-2);ctx.quadraticCurveTo(X(16),y0+44,F[0]+X(4),F[1]+6);ctx.stroke();
  // the belt, and its bronze hook
  const bc=T_.belt||[70,52,40];ctx.fillStyle=rgba(bc,1);ctx.beginPath();ctx.moveTo(-hw-6,-340);ctx.lineTo(hw+6,-340);ctx.lineTo(hw+6,-322);ctx.lineTo(-hw-6,-322);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([196,150,74],1);ell(ctx,sh*0.3+X(6),-331,10,6,0);ctx.fill();ctx.strokeStyle=rgba([120,86,40],0.8);ctx.lineWidth=1.4;ctx.stroke();
  ctx.restore();
  // a scribe's writing knife in its sheath, and a whetstone, hanging from the belt at one side
  if(T_.knife){const kx=-hw+6;ctx.strokeStyle=rgba(darken(bc,0.2),0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(kx,-326);ctx.lineTo(kx-2,-300);ctx.moveTo(kx+16,-326);ctx.lineTo(kx+18,-306);ctx.stroke();
    ctx.beginPath();ctx.moveTo(kx-8,-302);ctx.lineTo(kx+3,-302);ctx.lineTo(kx+1,-236);ctx.quadraticCurveTo(kx-3,-226,kx-6,-236);ctx.closePath();litFill(ctx,[70,58,50],kx-8,-302,kx+3,-226);seam(ctx,[70,58,50],0.5);
    ctx.beginPath();ctx.rect(kx+11,-306,15,34);litFill(ctx,[150,152,150],kx+11,-306,kx+26,-272);seam(ctx,[150,152,150],0.5);}};
// headwear of Qin: a headcloth over the knot of hair for most; a long cap for an official, standing on the knot and tied under the
// chin; a woman's hair, parted and drawn back smooth to a knot at the neck
head=function(ctx,P,E,po,t){const h=P.hat;_owHead(ctx,P,E,po,t);if(h==="ow_cloth")ow_cloth(ctx,P);if(h==="ow_cap")ow_capLong(ctx,P);if(h==="ow_hair")ow_hairParted(ctx,P);};
function ow_cloth(ctx,P){const c=P.hatC||[48,46,54];
  ell(ctx,4,-84,21,16,0.1);litFill(ctx,c,-17,-100,25,-68);seam(ctx,c,0.4);
  ctx.beginPath();ctx.moveTo(-45,-10);ctx.bezierCurveTo(-50,-64,-30,-82,0,-82);ctx.bezierCurveTo(30,-82,50,-64,45,-10);
  ctx.quadraticCurveTo(40,-30,26,-36);ctx.quadraticCurveTo(0,-42,-26,-36);ctx.quadraticCurveTo(-40,-30,-45,-10);ctx.closePath();litFill(ctx,c,-50,-82,50,-10);seam(ctx,c,0.4);
  ctx.strokeStyle=rgba(lighten(c,0.28),0.42);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-32,-62);ctx.quadraticCurveTo(0,-74,32,-62);ctx.stroke();
  ctx.strokeStyle=rgba(darken(c,0.3),0.6);ctx.beginPath();ctx.moveTo(-24,-76);ctx.quadraticCurveTo(4,-88,24,-76);ctx.stroke();}
function ow_capLong(ctx,P){const c=P.hatC||[40,38,44];
  ell(ctx,0,-64,18,13);litFill(ctx,P.hair.c,-18,-77,18,-51);
  ctx.beginPath();ctx.moveTo(-17,-62);ctx.lineTo(17,-62);ctx.lineTo(25,-132);ctx.quadraticCurveTo(0,-138,-25,-132);ctx.closePath();litFill(ctx,c,-25,-138,25,-62);seam(ctx,c,0.5);
  ctx.strokeStyle=rgba(lighten(c,0.32),0.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-11,-72);ctx.lineTo(-16,-126);ctx.stroke();
  ctx.fillStyle=rgba(darken(c,0.25),1);ctx.fillRect(-20,-68,40,9);
  ctx.strokeStyle=rgba(darken(c,0.05),0.9);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(-19,-62);ctx.quadraticCurveTo(-46,-20,-31,34);ctx.quadraticCurveTo(-14,55,0,57);
  ctx.moveTo(19,-62);ctx.quadraticCurveTo(46,-20,31,34);ctx.quadraticCurveTo(14,55,0,57);ctx.stroke();}
function ow_hairParted(ctx,P){const c=P.hair.c;ctx.beginPath();ctx.moveTo(-44,-2);ctx.bezierCurveTo(-50,-80,50,-80,44,-2);ctx.quadraticCurveTo(41,-30,22,-41);
  ctx.quadraticCurveTo(4,-47,0,-51);ctx.quadraticCurveTo(-4,-47,-22,-41);ctx.quadraticCurveTo(-41,-30,-44,-2);ctx.closePath();litFill(ctx,c,-50,-80,50,-2);seam(ctx,c,0.4);
  ctx.strokeStyle=rgba(lighten(c,0.32),0.45);ctx.lineWidth=1.6;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*2,-62);ctx.quadraticCurveTo(s*30,-58,s*42,-12);ctx.stroke();}}

// a person of Qin seen from behind, walking away (ph is the step's phase): the legs and shoes, the robe's back with its seam and belt,
// the arms swinging, the back of the head under the cloth (o.carry draws what they carry on their back, in the figure's units)
function ow_back(ctx,id,x,y,s,o){o=o||{};const P_=PEOPLE[id],k=s*P_.build.h,ph=o.ph||0,sw=P_.build.sh,hw=P_.build.hip,T_=P_.top,c=T_.c,hem=T_.hem||-118,fl=T_.long?40:26;
  if(!WC_RAW&&o.shadow!==false){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,100);g.addColorStop(0,rgba([90,80,96],0.22));g.addColorStop(1,rgba([90,80,96],0));
    ctx.fillStyle=g;ell(ctx,0,-4,100,16);ctx.fill();ctx.restore();}
  outlined(ctx,cx=>{const st=Math.sin(ph),up=[Math.max(0,st)*16,Math.max(0,-st)*16];
    for(const [i,sd] of [[0,-1],[1,1]]){limb(cx,[[sd*20,-282],[sd*22,-146-up[i]*0.6],[sd*23,-26-up[i]]],46,36,P_.bottom.c,[-80,-300,80,0]);ell(cx,sd*24,-12-up[i],21,11);litFill(cx,P_.shoe,-40,-24,40,0);}
    for(const sd of [-1,1])arm(cx,P_,sd,[0.12,-0.06+0.22*sd*st],0,{});
    cx.beginPath();cx.moveTo(-16,-448);cx.bezierCurveTo(-30,-444,-sw+26,-438,-sw+12,-428);cx.quadraticCurveTo(-sw-2,-420,-sw-2,-398);cx.bezierCurveTo(-sw-2,-364,-hw-2,-352,-hw+2,-322);
    cx.quadraticCurveTo(-hw-fl*0.5,-230,-hw-fl,hem);cx.quadraticCurveTo(0,hem+10,hw+fl,hem);cx.quadraticCurveTo(hw+fl*0.5,-230,hw-2,-322);cx.bezierCurveTo(hw+2,-352,sw+2,-364,sw+2,-398);
    cx.quadraticCurveTo(sw+2,-420,sw-12,-428);cx.bezierCurveTo(sw-26,-438,30,-444,16,-448);cx.closePath();litFill(cx,darken(c,0.06),-sw,-448,sw,hem);seam(cx,c,0.5);
    cx.strokeStyle=rgba(darken(c,0.4),0.5);cx.lineWidth=2;cx.beginPath();cx.moveTo(0,-446);cx.lineTo(0,hem+6);cx.stroke();
    cx.fillStyle=rgba(T_.belt||[70,52,40],1);cx.fillRect(-hw-6,-340,hw*2+12,18);
    cx.strokeStyle=rgba(T_.edge||darken(c,0.3),1);cx.lineWidth=12;cx.beginPath();cx.moveTo(-24,-450);cx.quadraticCurveTo(0,-438,24,-450);cx.stroke();
    if(o.carry)o.carry(cx,P_);
    limb(cx,[[0,-476],[0,-446]],28,28,darken(P_.skin,0.2),[-20,-476,20,-446]);
    cx.save();cx.translate(0,-502);for(const sd of [-1,1]){ell(cx,sd*41,2,7,11);litFill(cx,darken(P_.skin,0.1),-50,-12,50,12);}
    headPath(cx);litFill(cx,P_.hair.c,-42,-56,42,51);
    const hc=P_.hatC||[48,46,54];if(P_.hat==="ow_cloth"){cx.beginPath();cx.moveTo(-46,0);cx.bezierCurveTo(-52,-70,52,-70,46,0);cx.quadraticCurveTo(0,14,-46,0);cx.closePath();litFill(cx,hc,-50,-70,50,10);seam(cx,hc,0.4);
      ell(cx,4,-82,21,16,0.1);litFill(cx,hc,-17,-98,25,-66);seam(cx,hc,0.4);}
    cx.restore();},x,y,k,P_.edge,[-250,-660,250,10]);}

/* ---------- the town gate ---------- */
// nearer the town, seen across the road: the wall runs away to the left, the road comes up from the lower left into its gate, a grain
// stall stands by the road in front of us and a notice board on the far side. The wall is a plane through the gate (gx, gz) turned by
// th; a point on it is u along it from the gate (towards us), Y up, d into the wall.
const OW_GT={F:1100,hz:470,ch:1.6,gx:1.2,gz:34,th:-0.22,gauge:1.4,half:1.9,k:[[3.5,-150],[6,-200],[10,-250],[16,-170],[24,-60],[34,39]],road:z=>ow_rdX(OW_GT,z),
  wall:{u0:-46,u1:34,h:7,T:7},gate:[4.4,4.6],tower:[9,3.6],board:[-6.8,11],stall:{x0:1.9,x1:3.7,z0:5.0,z1:5.5,top:0.42,seller:[3.05,5.95]}};
function ow_gw(u,Y,d){const C=OW_GT,c=Math.cos(C.th),s=Math.sin(C.th);d=d||0;return ow_pj(C,C.gx+u*c-d*s,Y,C.gz+u*s+d*c);}
const ow_q=(ctx,pts,col,depth,o)=>wc_wash(ctx,pts,col,Object.assign({kind:"build",depth:depth==null?1:depth},o||{}));
function ow_paintGate(ctx){const C=OW_GT,L=C.wall,[gw,gh]=C.gate,g=gw/2;wc_sky(ctx,C.hz-60,27,{sun:[260,120],cx:300,cw:1300,cy:30,ch:110});
  // terraced hills beyond the wall, and the plain at its foot
  ow_hill(ctx,x=>250+28*Math.sin(x/280+0.9)+10*Math.sin(x/97),C.hz+40,[216,196,152],0.3,41,{n:8,lw:1.2});
  ow_hill(ctx,x=>ow_bump(x,330,700,520,262,C.hz+36)+5*Math.sin(x/53),C.hz+36,[224,196,140],0.45,43,{n:9,gullies:3,gx0:100,gx1:600});
  wc_wash(ctx,[[-60,C.hz+14],[W+60,C.hz+14],[W+60,H+60],[-60,H+60]],OW.field,{kind:"ground",depth:0.55,seed:45,line:false});
  // the wall's face of rammed earth, in its layers; the shadow at its foot
  const face=[ow_gw(L.u0,0),ow_gw(L.u1,0),ow_gw(L.u1,L.h),ow_gw(L.u0,L.h)];ow_q(ctx,face,OW.rammed,1,{seed:33});
  ctx.save();wc_tr(ctx,face);ctx.clip();ctx.lineCap="round";for(let Y=0.28;Y<L.h;Y+=0.28){const a=ow_gw(L.u0,Y),b=ow_gw(L.u1,Y);ctx.strokeStyle=rgba(wc_dim(OW.rammed,0.22),0.26+(Y%1.12<0.2?0.12:0));
    ctx.lineWidth=Y%1.12<0.2?2:1.2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  // the marks of the boards the earth was rammed between, and the rain's streaks
  const R=wc_rng(35);for(let i=0;i<46;i++){const u=lerp(L.u0,L.u1,R()),Y=1+R()*5.5,a=ow_gw(u,Y),b=ow_gw(u+0.1,Y-0.8-R()*1.6);ctx.strokeStyle=rgba(wc_dim(OW.rammed,0.25),0.18);ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  const sh=ctx.createLinearGradient(0,ow_gw(0,1.2)[1],0,ow_gw(0,0)[1]);sh.addColorStop(0,"rgba(120,90,60,0)");sh.addColorStop(1,"rgba(120,90,60,0.22)");ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);ctx.restore();
  // the gate passage: dark, the light of the street beyond it, the side we can see, the timber frame
  const op=[ow_gw(-g,0),ow_gw(g,0),ow_gw(g,gh),ow_gw(-g,gh)];ctx.save();wc_tr(ctx,op);ctx.clip();ctx.fillStyle=rgba([70,56,46],1);ctx.fillRect(0,0,W,H);
  ctx.fillStyle=rgba([236,214,170],1);wc_tr(ctx,[ow_gw(-g,0,L.T),ow_gw(g,0,L.T),ow_gw(g,gh,L.T),ow_gw(-g,gh,L.T)]);ctx.fill();
  wc_wash(ctx,[ow_gw(-g,0),ow_gw(-g,0,L.T),ow_gw(-g,gh,L.T),ow_gw(-g,gh)],[150,118,84],{kind:"field",seed:37});
  ctx.fillStyle=rgba([56,44,38],0.85);wc_tr(ctx,[ow_gw(-g,gh),ow_gw(g,gh),ow_gw(g,gh,L.T),ow_gw(-g,gh,L.T)]);ctx.fill();ctx.restore();
  ow_q(ctx,[ow_gw(-g-0.5,gh),ow_gw(g+0.5,gh),ow_gw(g+0.5,gh+0.5),ow_gw(-g-0.5,gh+0.5)],OW.timber,1,{seed:38});
  for(const u of [-g-0.3,g])ow_q(ctx,[ow_gw(u,0),ow_gw(u+0.3,0),ow_gw(u+0.3,gh),ow_gw(u,gh)],OW.timber,1,{seed:39});
  // the tower over the gate: a timber hall set back on the wall, its posts and railing, the front slope and near end of its tiled roof
  const [tw,th]=C.tower,t=tw/2,Y0=L.h,Y1=L.h+th,d0=1.4;ow_q(ctx,[ow_gw(-t,Y0,d0),ow_gw(t,Y0,d0),ow_gw(t,Y1,d0),ow_gw(-t,Y1,d0)],[184,148,104],1,{seed:40});
  for(let i=0;i<=4;i++){const u=lerp(-t,t,i/4);wc_flat(ctx,[ow_gw(u-0.13,Y0,d0),ow_gw(u+0.13,Y0,d0),ow_gw(u+0.13,Y1,d0),ow_gw(u-0.13,Y1,d0)],OW.timberDk,1,"post");}
  wc_flat(ctx,[ow_gw(-t,Y0+0.9,d0),ow_gw(t,Y0+0.9,d0),ow_gw(t,Y0+1.06,d0),ow_gw(-t,Y0+1.06,d0)],OW.timberDk,1,"rail");
  const ey=Y1-0.2,ry=Y1+1.7,e0=d0-1.1,e1=d0+5.6,rd=d0+2.2;
  ow_q(ctx,[ow_gw(-t-1.3,ey,e0),ow_gw(t+1.3,ey,e0),ow_gw(t-1.6,ry,rd),ow_gw(-t+1.6,ry,rd)],OW.tile,1,{seed:41});
  ow_q(ctx,[ow_gw(t+1.3,ey,e0),ow_gw(t+1.3,ey,e1),ow_gw(t-1.6,ry,rd)],wc_dim(OW.tile,0.12),1,{seed:42});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(OW.tile,0.3),0.5);ctx.lineWidth=1.4;for(let i=1;i<12;i++){const u=lerp(-t-1.3,t+1.3,i/12),v=lerp(-t+1.6,t-1.6,i/12),a=ow_gw(u,ey,e0),b=ow_gw(v,ry,rd);
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  wc_flat(ctx,[ow_gw(-t+1.4,ry-0.05,rd),ow_gw(t-1.4,ry-0.05,rd),ow_gw(t-1.4,ry+0.3,rd),ow_gw(-t+1.4,ry+0.3,rd)],wc_dim(OW.tile,0.25),1,"ridge");
  // a black banner on the tower: Qin favoured black
  const [fx,fy]=ow_gw(t+0.4,ry+1.9,e0+0.4),[,fb]=ow_gw(t+0.4,Y1,e0+0.4),k=ow_ppm(C,C.gz);ctx.save();ctx.strokeStyle=rgba(OW.timberDk,0.85);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx,fb);ctx.stroke();ctx.restore();
  wc_wash(ctx,[[fx,fy],[fx+1.7*k,fy+0.35*k],[fx+1.5*k,fy+1.15*k],[fx,fy+1.05*k]],OW.black,{kind:"thing",lw:1});
  // the road up to the gate, its ruts; the trodden ground either side
  const gf=[ow_gw(L.u0,0),ow_gw(L.u1,0),[W+60,H+60],[-60,H+60]];wc_wash(ctx,gf,[226,206,158],{kind:"ground",depth:0.9,seed:46,line:false});
  ow_rutRoad(ctx,C,2.5,C.gz-0.1);
  // the notice board on its posts, across the road: the edict in columns of strokes
  const [bX,bZ]=C.board,bp=(X,Y)=>ow_pj(C,X,Y,bZ),q=ow_ppm(C,bZ);for(const X of [bX-0.7,bX+0.62])ow_q(ctx,[bp(X,0),bp(X+0.1,0),bp(X+0.1,2.35),bp(X,2.35)],OW.timber,1,{seed:51});
  const [b0x,b0y]=bp(bX-0.85,2.2),[b1x,b1y]=bp(bX+0.85,1.15);ow_q(ctx,wc_rect(b0x,b0y,b1x-b0x,b1y-b0y),[222,198,152],1,{kind:"thing",seed:52});
  wc_flat(ctx,wc_rect(b0x-0.08*q,b0y-0.12*q,b1x-b0x+0.16*q,0.12*q),OW.timberDk,1,"cap");ow_strokes(ctx,b0x+0.08*q,b0y+0.08*q,b1x-b0x-0.16*q,b1y-b0y-0.16*q,13,5,0.62,53);
  wc_contact(ctx,b0x,b1x,bp(0,0)[1]+2,1,0.25);
  // the stall: its mat, the awning on four poles, baskets of millet and a sack by the seller
  const S=C.stall,sp=(X,Y,Z)=>ow_pj(C,X,Y,Z);ow_q(ctx,[sp(S.x0-0.5,0,S.z0-0.35),sp(S.x1+0.9,0,S.z0-0.35),sp(S.x1+0.9,0,S.z1+1.3),sp(S.x0-0.5,0,S.z1+1.3)],OW.mat,1,{kind:"thing",lw:1.2,seed:55});
  for(const [X,Z] of [[S.x0-0.35,S.z1+1.2],[S.x1+0.8,S.z1+1.2]])ow_q(ctx,[sp(X,0,Z),sp(X+0.07,0,Z),sp(X+0.07,2.32,Z),sp(X,2.32,Z)],OW.timber,1,{seed:56});
  for(const [X,Z,w,f] of [[S.x1+0.45,S.z1+0.75,0.34,0.9],[S.x1+0.62,S.z1+0.15,0.3,0.8]]){const [x,y]=sp(X,0,Z),k2=ow_ppm(C,Z),hw=w*k2,h=0.36*k2*f;
    ow_q(ctx,[[x-hw,y],[x+hw,y],[x+hw*1.12,y-h],[x-hw*1.12,y-h]],[176,140,92],1,{kind:"thing",seed:57+X});wc_wash(ctx,wc_ell(x,y-h,hw*1.12,h*0.22,20),[226,196,108],{kind:"thing",lw:1});}}
// the parts of the stall nearer than its seller, drawn after him: the front poles and the awning's edge, and the low table with the
// standard measure and the weight on it (lit: a glow round them)
function ow_stallFront(ctx,lit){const C=OW_GT,S=C.stall,sp=(X,Y,Z)=>ow_pj(C,X,Y,Z),T=S.top;
  for(const X of [S.x0-0.35,S.x1+0.8])ow_q(ctx,[sp(X,0,S.z0-0.2),sp(X+0.07,0,S.z0-0.2),sp(X+0.07,2.2,S.z0-0.2),sp(X,2.2,S.z0-0.2)],OW.timber,1,{seed:58});
  const aw=[sp(S.x0-0.55,2.42,S.z1+1.3),sp(S.x1+1.0,2.42,S.z1+1.3),sp(S.x1+1.0,2.18,S.z0-0.3)];for(let i=0;i<=12;i++){const X=lerp(S.x1+1.0,S.x0-0.55,i/12);aw.push(sp(X,2.12-0.05*Math.sin(i/12*Math.PI*4)**2,S.z0-0.3));}
  ow_q(ctx,aw,[214,196,160],1,{seed:59,lw:1.2});
  wc_contact(ctx,sp(S.x0,0,S.z0)[0],sp(S.x1,0,S.z0)[0],sp(0,0,S.z0+0.2)[1],1,0.3);
  for(const [X,Z] of [[S.x0+0.06,S.z0+0.02],[S.x1-0.12,S.z0+0.02]])ow_q(ctx,[sp(X,0,Z),sp(X+0.07,0,Z),sp(X+0.07,T,Z),sp(X,T,Z)],OW.woodDk,1,{seed:61});
  ow_q(ctx,[sp(S.x0,T,S.z0),sp(S.x1,T,S.z0),sp(S.x1,T,S.z1),sp(S.x0,T,S.z1)],wc_lit(OW.wood,0.1),1,{seed:62});
  ow_q(ctx,[sp(S.x0,T,S.z0),sp(S.x1,T,S.z0),sp(S.x1,T-0.06,S.z0),sp(S.x0,T-0.06,S.z0)],OW.woodDk,1,{seed:63});
  const [mx,my]=sp(2.3,T,5.22),[wx,wy]=sp(2.72,T,5.18),k=ow_ppm(C,5.2);ow_measure(ctx,mx,my,0.24*k);ow_weight(ctx,wx,wy,0.18*k);
  if(lit>0)gv_halo(ctx,mx-0.24*k,my-0.34*k,wx-mx+0.42*k,0.4*k,GV.gold,0.7*lit);}
// where the stall's measure is on screen, for its tag
const ow_stallAt=()=>ow_pj(OW_GT,2.5,0,OW_GT.stall.z0);
// an ox cart's axle: where its two wheels meet the ground, on screen
function ow_axle(C,z){const xc=C.road(z),dir=(C.road(z+0.05)-xc)/0.05,L=Math.hypot(dir,1),N=[1/L,-dir/L],g=C.gauge/2;
  return[-1,1].map(s=>ow_pj(C,xc+N[0]*s*g,0,z+N[1]*s*g));}
// the standard measure for grain: a round pottery measure with a handle, its edict stamped on its side (strokes, not characters)
function ow_measure(ctx,x,y,w){const h=w*0.8;wc_wash(ctx,[[x-w/2,y],[x+w/2,y],[x+w/2+w*0.04,y-h],[x-w/2-w*0.04,y-h]],[178,128,92],{kind:"thing",lw:1.2,seed:63});
  wc_wash(ctx,wc_ell(x,y-h,w/2+w*0.04,w*0.12,20),[226,196,108],{kind:"thing",lw:1,seed:65});wc_flat(ctx,wc_rect(x+w/2,y-h*0.7,w*0.3,w*0.1),[160,112,80],1,"handle");
  ow_strokes(ctx,x-w*0.3,y-h*0.7,w*0.6,h*0.42,4,3,0.5,67);}
// a bronze weight of the standard, bell-shaped, a loop at its top
function ow_weight(ctx,x,y,h){const w=h*0.9;wc_wash(ctx,[[x-w/2,y],[x+w/2,y],[x+w*0.3,y-h*0.72],[x+w*0.12,y-h*0.84],[x-w*0.12,y-h*0.84],[x-w*0.3,y-h*0.72]],OW.bronze,{kind:"thing",lw:1.2,seed:69});
  ctx.save();ctx.strokeStyle=rgba(OW.bronzeDk,0.9);ctx.lineWidth=Math.max(1.5,h*0.07);ctx.beginPath();ctx.arc(x,y-h*0.92,h*0.11,Math.PI,0);ctx.stroke();ctx.restore();}
// faint strokes in columns, read right to left, too small to read: the way the film draws writing on wood, never as characters
function ow_strokes(ctx,x,y,w,h,cols,rows,a,seed,col){const R=wc_rng(seed||3),cw=w/cols,rh=h/rows;ctx.save();ctx.strokeStyle=rgba(col||OW.ink,a==null?0.6:a);ctx.lineCap="round";
  ctx.lineWidth=Math.max(0.8,cw*0.12);for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){if(R()<0.08)continue;const cx=x+w-(i+0.5)*cw,cy=y+(j+0.5)*rh,s=Math.min(cw,rh)*0.36;
    for(let n=0;n<2+Math.floor(R()*2);n++){const a0=R()*TAU,l=s*(0.5+R()*0.6);ctx.beginPath();ctx.moveTo(cx+(R()-0.5)*s,cy+(R()-0.5)*s);ctx.lineTo(cx+(R()-0.5)*s+Math.cos(a0)*l*0.5,cy+(R()-0.5)*s+Math.sin(a0)*l*0.5);ctx.stroke();}}
  ctx.restore();}
// a bundle of wooden slips, bound with cords, carried on the courier's back (in the figure's units)
function ow_bundleBack(cx,P_){cx.save();cx.translate(0,-400);cx.rotate(-0.08);for(let i=0;i<9;i++){cx.fillStyle=rgba(i%2?OW.slip:wc_dim(OW.slip,0.06),1);cx.fillRect(-58+i*13,-70,12,150);}
  cx.strokeStyle=rgba(wc_dim(OW.slip,0.4),0.8);cx.lineWidth=1.4;cx.strokeRect(-58,-70,117,150);cx.strokeStyle=rgba([120,84,52],1);cx.lineWidth=5;for(const y of [-36,40]){cx.beginPath();cx.moveTo(-62,y);cx.lineTo(62,y+2);cx.stroke();}
  cx.restore();cx.strokeStyle=rgba([110,78,50],1);cx.lineWidth=5;cx.beginPath();cx.moveTo(-50,-448);cx.lineTo(48,-330);cx.stroke();}

/* ---------- the court's slips, close ---------- */
// a reed mat, seen from above, where the bundle is opened: the slips laid side by side, their cords, the clay seal that closed them
const OW_SL={x:330,y:150,n:15,w:46,h:640};
function ow_paintSlips(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),OW.mat,{kind:"plaster",line:false,seed:71});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(5);for(let y=-10;y<H+20;y+=18){ctx.strokeStyle=rgba(wc_dim(OW.mat,0.14+R()*0.05),0.2);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=60)ctx.lineTo(x,y+2*Math.sin(x/90+y));ctx.stroke();}for(let x=0;x<W+40;x+=110){ctx.strokeStyle=rgba(wc_dim(OW.mat,0.25),0.18);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,-20);ctx.lineTo(x+6,H+20);ctx.stroke();}ctx.restore();
  const S=OW_SL;ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(70,50,30,0.22)";ctx.fillRect(S.x+10,S.y+16,S.n*S.w,S.h);ctx.restore();
  for(let i=0;i<S.n;i++){const x=S.x+i*S.w;wc_wash(ctx,wc_rect(x,S.y+(i%3)*4,S.w-4,S.h),i%2?OW.slip:wc_dim(OW.slip,0.04),{kind:"page",lw:1.1,seed:80+i});
    ow_strokes(ctx,x+8,S.y+40+(i%3)*4,S.w-20,S.h-80,1,22,0.62,90+i);}
  ctx.save();ctx.strokeStyle=rgba([126,88,56],0.95);ctx.lineWidth=7;ctx.lineCap="round";for(const y of [S.y+110,S.y+S.h-110]){ctx.beginPath();ctx.moveTo(S.x-60,y+10);ctx.lineTo(S.x+S.n*S.w+30,y);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_ell(S.x-80,S.y+120,34,30,22),[150,110,80],{kind:"thing",lw:1.3,seed:95});ow_strokes(ctx,S.x-100,S.y+104,40,30,2,2,0.4,96);}

/* ---------- the county office at Qianling ---------- */
// timber posts and a beam, walls of plastered earth, a window of upright bars and its light, shelves of baskets of slips, reed mats on
// the earth floor; three scribes kneel at low tables. The tables are the place's front layer (drawn over the scribes), and the board
// stands on the middle one, at its scribe's elbow.
const OW_OF={fy:690,top:772,s:0.86,seats:[470,960,1450],tbl:{w:300,h:112},board:[1086,0.28],win:[200,170,300,320]};
function ow_paintOffice(ctx){const O=OW_OF;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,O.fy+40),OW.plaster,{kind:"plaster",line:false,seed:101});
  wc_wash(ctx,wc_rect(-40,O.fy,W+80,H-O.fy+40),OW.floor,{kind:"ground",line:false,seed:103});
  wc_flat(ctx,wc_rect(-40,O.fy-16,W+80,18),wc_dim(OW.plaster,0.18),1,"skirting");
  // the window: the light through it, its bars, the beam of sun on the floor
  const [wx,wy,ww,wh]=O.win;wc_flat(ctx,wc_rect(wx,wy,ww,wh),[250,238,206],1,"light");for(let i=1;i<6;i++)wc_part(ctx,wc_rect(wx+i*ww/6-7,wy,14,wh),OW.timber,1);
  wc_part(ctx,wc_rect(wx-20,wy-20,ww+40,22),OW.timber,1);wc_part(ctx,wc_rect(wx-20,wy+wh,ww+40,22),OW.timber,1);
  ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(255,236,190,0.16)";ctx.beginPath();ctx.moveTo(wx,wy+wh);ctx.lineTo(wx+ww,wy+wh);ctx.lineTo(wx+ww+300,H);ctx.lineTo(wx+160,H);ctx.closePath();ctx.fill();ctx.restore();
  // shelves of baskets of slips, along the back wall
  for(const [x0,x1] of [[640,1280],[1380,1800]]){for(const sy of [330,500]){wc_part(ctx,wc_rect(x0,sy,x1-x0,16),OW.woodDk,1);const R=wc_rng(x0+sy);let bx=x0+12;
      while(bx<x1-90){const w=70+R()*40,h=60+R()*24;wc_part(ctx,[[bx,sy],[bx+w,sy],[bx+w-6,sy-h],[bx+6,sy-h]],[[190,160,110],[176,146,98],[204,176,124]][Math.floor(R()*3)],1,{kind:"thing",lw:1.1});
        ctx.save();ctx.strokeStyle=rgba([140,110,72],0.4);ctx.lineWidth=1.4;for(let yy=sy-h+10;yy<sy;yy+=10){ctx.beginPath();ctx.moveTo(bx+6,yy);ctx.lineTo(bx+w-6,yy);ctx.stroke();}ctx.restore();bx+=w+10;}}
    for(const lx of [x0+4,x1-14])wc_part(ctx,wc_rect(lx,170,12,O.fy-170),OW.woodDk,1);}
  // the timber frame: posts, a beam
  for(const x of [100,580,1330,1860])wc_part(ctx,wc_rect(x-26,-20,52,O.fy+20),OW.timber,1,{seed:x});
  wc_part(ctx,wc_rect(-40,40,W+80,48),OW.timber,1,{seed:107});
  // the mats on the floor, one for each scribe
  O.seats.forEach((x,i)=>{const y=O.top+O.tbl.h*O.s;wc_wash(ctx,[[x-230,y+50],[x+230,y+50],[x+200,y-60],[x-200,y-60]],OW.mat,{kind:"thing",lw:1.2,seed:110+i});
    ctx.save();ctx.strokeStyle=rgba(wc_dim(OW.mat,0.2),0.4);ctx.lineWidth=2;for(let k=-8;k<=8;k++){ctx.beginPath();ctx.moveTo(x+k*25,y+50);ctx.lineTo(x+k*22,y-60);ctx.stroke();}ctx.restore();});}
// the low tables, over the scribes: a plank, two short legs at each end; what lies on them (slips, a brush rest, the ink stone), and the
// board on the middle one
function ow_paintOfficeTables(ctx){const O=OW_OF,s=O.s,tw=O.tbl.w*s,th=O.tbl.h*s,top=O.top;
  O.seats.forEach((x,i)=>{wc_contact(ctx,x-tw*0.6,x+tw*0.6,top+th+4,0.9,0.3);for(const lx of [x-tw/2+10,x+tw/2-30])wc_part(ctx,wc_rect(lx,top+12,20,th-12),OW.woodDk,1,{seed:120+i});
    wc_part(ctx,wc_rect(x-tw/2,top,tw,16),wc_lit(OW.woodDk,0.15),1,{seed:124+i});
    for(let j=0;j<5;j++)wc_flat(ctx,wc_rect(x-tw/2+22+j*12,top-6-j%2*2,10,6),OW.slip,1,"slip");
    wc_part(ctx,wc_rect(x+tw/2-80,top-12,46,12),[70,70,74],1);});
  // the board, leaning on a little stand at the middle scribe's elbow
  const [bx,bw]=O.board,w=bw*330*s*1.0,h=w*12.5/27.4;wc_part(ctx,[[bx,top],[bx+w,top],[bx+w+6,top-h],[bx+6,top-h]],OW.board,1,{kind:"thing",lw:1.2,seed:130});
  ow_strokes(ctx,bx+10,top-h+6,w-14,h*0.42,14,3,0.55,131);ow_strokes(ctx,bx+10,top-h*0.5+2,w-14,h*0.42,14,3,0.55,132);wc_part(ctx,wc_rect(bx+w*0.3,top-4,w*0.4,6),OW.woodDk,1);}
// a scribe kneeling at a low table, as Qin's scribes wrote, holding the slip in one hand and the brush in the other: the robe spread over
// the folded legs on the mat, the body above the table (the tables, drawn after, hide where the two meet)
function ow_kneel(ctx,id,x,top,s,o){o=o||{};const P_=PEOPLE[id],k=s*P_.build.h,c=P_.top.c,fy=o.fy||top+OW_OF.tbl.h*s;
  ow_paint(ctx,[x-130*k,top-40*k,260*k,fy-top+52*k],q=>{q.beginPath();q.moveTo(x-104*k,fy);q.bezierCurveTo(x-112*k,top+6*k,x-74*k,top-30*k,x,top-34*k);q.bezierCurveTo(x+74*k,top-30*k,x+112*k,top+6*k,x+104*k,fy);
    q.quadraticCurveTo(x,fy+14*k,x-104*k,fy);q.closePath();ow_fill(q,c,x-110*k,top-30*k,x+110*k,fy);
    for(const sd of [-1,1]){q.beginPath();q.ellipse(x+sd*70*k,fy-6*k,26*k,10*k,0,0,TAU);ow_fill(q,P_.shoe,x-100*k,fy-16*k,x+100*k,fy+4*k);}},{lineA:0.7});
  ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,top+H+2);ctx.clip();person(ctx,id,x,top+300*k,s,Object.assign({shadow:false},o));ctx.restore();}
// a slip in the left hand and a brush in the right, its tip to the slip
function ow_heldSlip(cx,P_,hands){const [l,r]=hands;cx.save();cx.translate(l[0]+10,l[1]-36);cx.rotate(0.1);cx.fillStyle=rgba(OW.slip,1);cx.fillRect(-8,-74,16,140);
  cx.strokeStyle=rgba(wc_dim(OW.slip,0.4),0.8);cx.lineWidth=1.6;cx.strokeRect(-8,-74,16,140);cx.fillStyle=rgba(OW.ink,0.55);for(let i=0;i<6;i++)cx.fillRect(-3.5,-62+i*17,7,7);cx.restore();
  cx.save();cx.translate(r[0],r[1]);cx.rotate(-0.8);cx.fillStyle=rgba([156,116,74],1);cx.fillRect(-3.5,-80,7,82);cx.fillStyle=rgba([40,34,32],1);cx.beginPath();cx.moveTo(-3.5,2);cx.lineTo(3.5,2);cx.lineTo(0,18);cx.closePath();cx.fill();cx.restore();
  fingers(cx,P_,[l,r]);}
// looking aside, to the board at the elbow, the hands still at the slip
POSE.ow_check=Object.assign({},POSE.write,{turn:-0.4,gaze:[-0.9,0.7],tilt:-0.06,look:1});

/* ---------- the board, close ---------- */
// 27.4 by 12.5 centimetres, landscape; two registers of entries, each a short column read right to left; 54 entries in all. Drawn
// fresh, on the scribe's table in about 220 BC, and as it was found in 2002: dark with the well's water, pieced together from six
// fragments, its top right corner gone.
const OW_BD={x:150,y:136,w:1080,h:Math.round(1080*12.5/27.4)};
function ow_boardArt(ctx,found){const B=OW_BD,{x,y,w,h}=B,col=found?OW.boardOld:OW.board,ink=found?[34,24,20]:OW.ink;
  // the outline: whole, or with the top right corner broken away
  const out=found?[[x,y],[x+w*0.7,y],[x+w*0.72,y+h*0.06],[x+w*0.78,y+h*0.04],[x+w*0.81,y+h*0.13],[x+w*0.88,y+h*0.16],[x+w*0.92,y+h*0.3],[x+w,y+h*0.34],[x+w,y+h],[x,y+h]]:wc_rect(x,y,w,h);
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(40,30,20,0.32)";wc_tr(ctx,out.map(([a,b])=>[a+10,b+16]));ctx.fill();ctx.restore();
  wc_wash(ctx,out,col,{kind:"page",lw:1.6,seed:found?141:140});
  ctx.save();wc_tr(ctx,out);ctx.clip();ctx.globalCompositeOperation="multiply";const R=wc_rng(found?143:142);
  for(let i=0;i<40;i++){const yy=y+R()*h;ctx.strokeStyle=rgba(wc_dim(col,0.2+R()*0.1),0.2);ctx.lineWidth=1+R()*2;ctx.beginPath();ctx.moveTo(x-10,yy);for(let xx=x;xx<=x+w+20;xx+=60)ctx.lineTo(xx,yy+3*Math.sin(xx/140+i));ctx.stroke();}
  ctx.globalCompositeOperation="source-over";
  // the entries: two registers, a rule between them
  for(const [ry,rh] of [[y+h*0.07,h*0.4],[y+h*0.53,h*0.4]])ow_strokes(ctx,x+w*0.03,ry,w*0.94,rh,27,7,found?0.5:0.78,found?150+ry:146+ry,ink);
  ctx.strokeStyle=rgba(wc_dim(col,0.35),0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w*0.02,y+h*0.5);ctx.lineTo(x+w*0.98,y+h*0.5);ctx.stroke();
  if(found){// the cracks between the six fragments it was pieced from, and stains
    ctx.strokeStyle=rgba([30,20,16],0.7);ctx.lineWidth=2.6;for(const L of [[[x+w*0.33,y],[x+w*0.31,y+h*0.4],[x+w*0.35,y+h]],[[x+w*0.62,y],[x+w*0.64,y+h*0.55],[x+w*0.6,y+h]],[[x,y+h*0.52],[x+w*0.33,y+h*0.5]],[[x+w*0.64,y+h*0.6],[x+w,y+h*0.62]]]){
      ctx.beginPath();L.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
    ctx.globalAlpha=0.35;ctx.drawImage(wc_tint(WC.blotch,[40,28,20]),x-200,y-90,w+400,h+180);}
  ctx.restore();}
// the board's two places: on the table in the county office, about 220 BC; and on the mount it rests on since it was found
function ow_paintBoardThen(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),OW.wood,{kind:"plaster",line:false,seed:151});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(7);for(let i=0;i<60;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(OW.wood,0.2+R()*0.12),0.16+R()*0.12);ctx.lineWidth=1+R()*2.4;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+5*Math.sin(x/280+i)+3*Math.sin(x/80+i*2));ctx.stroke();}ctx.restore();
  ow_boardArt(ctx,false);
  // slips beside it, and the ink stone with its grinder
  for(let i=0;i<6;i++){const x=1330+i*40;wc_wash(ctx,wc_rect(x,120+(i%2)*8,32,560),OW.slip,{kind:"page",lw:1,seed:160+i});ow_strokes(ctx,x+6,150,20,500,1,18,0.55,170+i);}
  wc_wash(ctx,wc_rect(1640,760,220,130),[70,70,76],{kind:"thing",lw:1.4,seed:181});wc_flat(ctx,wc_ell(1720,820,52,30,24),[34,32,36],1,"ink");wc_wash(ctx,wc_ell(1810,800,24,24,18),[96,96,102],{kind:"thing",lw:1.2});}
function ow_paintBoardFound(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),OW.mount,{kind:"plaster",line:false,seed:191});
  gv_lightGlow(ctx,700,-120,900);ow_boardArt(ctx,true);}
// the rules, in English, on a card under the board: two of its 54 entries
function ow_ruleCard(ctx,a){if(a<=0.01)return;const x=150,y=662,w=1080,h=196;withA(ctx,a,()=>{ctx.save();ctx.translate(0,14*(1-a));wc_panel(ctx,x,y,w,h,{kind:"card",seed:201});
  wc_T(ctx,"for “by royal command”, write “by imperial edict”",x+44,y+78,{w:700,size:36,col:WC_DARK});wc_T(ctx,"the king’s hunt is now the emperor’s hunt",x+44,y+142,{w:700,size:36,col:WC_DARK});ctx.restore();});}
// the county's records, counted: the new word for the people against the old one, as tally cards
function ow_tally(ctx,t,t0,t1,t2){const u0=fin(t,t0,0.4);if(u0<=0.01)return;const x=1300,w=500;
  withA(ctx,u0,()=>wc_T(ctx,"in the county’s records",x+w/2,140,{w:700,size:32,align:"center",col:WC_INK}));
  [[t1,"the new word for “the people”","34 times",34,250],[t2,"the old one","once",1,560]].forEach(([tt,a,b,n,y],i)=>{const u=fin(t,tt,0.45);if(u<=0.01)return;const k=0.92+0.08*spring(u);
    ctx.save();ctx.translate(x+w/2,y+130);ctx.scale(k,k);withA(ctx,clamp(u*2,0,1),()=>{wc_panel(ctx,-w/2,-130,w,260,{kind:"card",seed:211+i});gv_pin(ctx,0,-116,GV.red,1.2);
      wc_T(ctx,a,-w/2+30,-62,{w:700,size:30,col:WC_INK});wc_T(ctx,b,-w/2+30,4,{w:800,size:52,col:WC_DARK});
      // the tally itself: a pencil stroke for each, struck through in fives, drawn on as it's counted
      const m=Math.round(n*clamp((t-tt-0.15)/(n>1?1.6:0.3),0,1));ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=3;ctx.lineCap="round";
      for(let j=0;j<m;j++){const g=Math.floor(j/5),r=j%5,gx=-w/2+34+g*66,gy=48;if(r<4){ctx.beginPath();ctx.moveTo(gx+r*12,gy);ctx.lineTo(gx+r*12+2,gy+50);ctx.stroke();}
        else{ctx.beginPath();ctx.moveTo(gx-6,gy+40);ctx.lineTo(gx+46,gy+8);ctx.stroke();}}});ctx.restore();});}
