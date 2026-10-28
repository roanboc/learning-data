/* ===== Change without surprises: the past =====
   Sweden in 1966 and 1967, painted the series' way (master data's wash.js and people.js, the series' rooms.js and people.js): a town
   crossroads with shops, at dawn on 3 September 1967, at night before it and in the morning after; a border post in the hills where
   the road beyond keeps right; a narrow country road at dusk, a car stuck behind a lorry, then a tow truck; the change commission's
   office; the sign pole at night, where a road worker swaps the covers; a post office counter, a grocer's counter, a police desk.
   Places of work and trade only, no homes. One language on screen: no Swedish words, so signs carry arrows, and the booklet and the
   milk cartons a plain letter H (not the change's own sign of 1967). Its people wear their own time: a police officer in a dark
   uniform, a peaked cap and white gloves; a road worker in overalls; the commission's staff in suits with narrow ties, a blouse and a
   skirt; a postman with a cap and a bag; a grocer in a white coat. The places are painted once and kept (the series' finish.js); what
   moves is drawn every frame. Every name starts with cw_ or CW. */

/* ---------- colours ---------- */
const CW={asphalt:[176,174,172],walk:[214,208,198],kerb:[190,186,180],line:[248,246,240],
  ochre:[228,190,128],cream:[240,228,200],terra:[214,144,106],sage:[190,198,168],rose:[226,182,162],yellow:[238,216,156],stone:[208,204,194],
  cornice:[246,240,226],glass:[118,136,162],frame:[248,246,238],blind:[230,220,196],fascia:[132,138,146],door:[122,88,66],
  navy:[42,50,72],iron:[66,68,78],sign:[38,92,174],black:[40,38,44],gold:[220,172,64],copper:[118,170,150],
  grass:[176,190,120],field:[214,204,140],forest:[90,124,98],spruce:[70,104,86],birch:[180,206,122],hill:[150,172,150]};
// the cars on Sweden's roads then, in their colours: pale blue, cream, red, dark green, beige, light grey; none of them a make
const CW_PAINT=[[150,180,208],[236,226,198],[188,74,62],[76,114,94],[214,194,152],[190,194,200]];

/* ---------- places in depth ---------- */
// a place painted as the camera sees it: x across, y up, z away from us, in metres; F is the lens, hz the horizon on screen, ch the
// camera's height, cx where it stands across. The road, the shops and the cars all come from it, so a car on the left and one on the
// right are the same size at the same distance.
function cw_pj(C,X,Y,Z){const z=Math.max(0.3,Z);return[960+C.F*(X-(C.cx||0))/z,C.hz+C.F*(C.ch-Y)/z];}
const cw_ppm=(C,Z)=>C.F/Math.max(0.3,Z);
// a line on the ground (or at a height), from z0 to z1, spaced so it's even on screen
function cw_line(C,z0,z1,fx,fy,n){const o=[];n=n||40;for(let i=0;i<=n;i++){const z=z0*Math.pow(z1/z0,i/n);o.push(cw_pj(C,fx(z),fy?fy(z):0,z));}return o;}
const cw_band=(C,z0,z1,fa,fb,fy,n)=>cw_line(C,z0,z1,fa,fy,n).concat(cw_line(C,z0,z1,fb,fy,n).reverse());
// four corners in metres, on screen
const cw_q=(C,pts)=>pts.map(p=>cw_pj(C,p[0],p[1],p[2]));
// a wall on the plane x = X (a shop front along the street), from z0 to z1 and from y0 to y1; a wall facing us, on the plane z = Z
const cw_sideQ=(C,X,z0,z1,y0,y1)=>cw_q(C,[[X,y0,z0],[X,y0,z1],[X,y1,z1],[X,y1,z0]]);
const cw_faceQ=(C,Z,x0,x1,y0,y1)=>cw_q(C,[[x0,y0,Z],[x1,y0,Z],[x1,y1,Z],[x0,y1,Z]]);
// the corners of a box (x0..x1, y0..y1, z0..z1) a camera sees, as quads to paint: the face towards us, the side towards the middle,
// and the top when it's below the camera
function cw_boxFaces(C,x0,x1,y0,y1,z0,z1){const f=[];f.push(["front",cw_faceQ(C,z0,x0,x1,y0,y1)]);const cx=C.cx||0;
  if(x1<cx)f.push(["side",cw_sideQ(C,x1,z0,z1,y0,y1)]);else if(x0>cx)f.push(["side",cw_sideQ(C,x0,z0,z1,y0,y1)]);
  if(y1<C.ch)f.push(["top",cw_q(C,[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]])]);return f;}
// the smallest shape round a set of points (a car's body, seen from wherever it is)
function cw_hull(P){const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);if(p.length<3)return p;const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[];for(const q of p){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q);}
  const up=[];for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q);}
  up.pop();lo.pop();return lo.concat(up);}
const cw_path=(q,pts)=>{q.beginPath();pts.forEach((v,i)=>i?q.lineTo(v[0],v[1]):q.moveTo(v[0],v[1]));q.closePath();};

/* ---------- something painted every frame, the way people are ---------- */
// drawn flat into a spare canvas, then given the paper's grain, an uneven dry and a pencil line round it; box is [x, y, w, h] on the
// place. Its sizes are rounded up, so the canvases it keeps stay few as a thing moves
function cw_paint(ctx,box,draw,o){o=o||{};const [bx,by,bw,bh]=box,pad=10,w=Math.max(32,Math.ceil((bw+pad*2)/32)*32),h=Math.max(32,Math.ceil((bh+pad*2)/32)*32);
  const [c,cx]=pcanvas("cw",w,h);cx.translate(pad-bx,pad-by);draw(cx);wc_prep();const [fc]=wc_wpaint(c,w,h),ox=bx-pad,oy=by-pad;
  if(o.line!==false){const [tc,tx]=wc_buf("cwT"+w+"x"+h,w,h);tx.drawImage(c,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(WC_PENCIL,1);tx.fillRect(0,0,w,h);
    ctx.save();ctx.globalAlpha*=0.7*(o.lineA==null?1:o.lineA);for(const [dx,dy] of [[1.2,0.3],[-1,0.9],[0.3,-1.1]])ctx.drawImage(tc,ox+dx,oy+dy);ctx.restore();}
  ctx.save();if(o.a!=null)ctx.globalAlpha*=o.a;ctx.drawImage(fc,ox,oy);ctx.restore();}
// a flat fill of a path, lit from the upper left, with a soft seam: the way people's clothes are coloured
function cw_fill(q,col,x0,y0,x1,y1,a){litFill(q,col,x0,y0,x1,y1);seam(q,col,a==null?0.4:a);}
// light on paper: added (screen) or laid over (multiply), as a soft round glow
function cw_light(ctx,x,y,r,col,a){if(a<=0.01||r<=0)return;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,r,col,a);ctx.restore();}
function cw_shade(ctx,pts,col,a,blur){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";if(blur)ctx.filter="blur("+Math.max(1,blur).toFixed(1)+"px)";ctx.fillStyle=rgba(col,a);wc_tr(ctx,pts);ctx.fill();ctx.restore();}

/* ---------- the town's crossroads ---------- */
// seen from a first floor's height over the street, looking along it. The main street's road runs from x -3.8 to 3.8, its pavements
// out to the shop fronts at ±6.4; the side street crosses it from z 19.6 to 25.4, a pavement either side. Each block along the street
// is [z0, z1, height, colour, shops]; the far corner blocks face the side street too. The officer stands in the middle of the
// crossroads; a street clock hangs on a bracket on the right, a pole with two signs stands on the right pavement, a newspaper kiosk on
// the left, and lamps hang on wires over the street.
const CW_ST={F:1400,hz:420,ch:3.2,cx:0,road:3.8,front:6.4,near:17.6,far:27.4,cross:[19.6,25.4],zebra:[15.3,17.3],stop:15.0,end:120,
  L:[[8.4,13.4,10.2,"ochre",1],[13.4,17.6,9.4,"cream",1],[27.4,35.5,11,"terra",1],[35.5,46,10,"sage",0],[46,58,12.2,"yellow",1],[58,73,10.6,"rose",0],[73,92,11.4,"cream",1],[92,120,10,"ochre",0]],
  R:[[8.4,12.1,10.8,"rose",1],[12.1,17.6,10,"yellow",1],[27.4,37,10.4,"cream",1],[37,49,12,"ochre",0],[49,62,10,"terra",1],[62,78,11,"sage",0],[78,96,10.2,"yellow",1],[96,120,11.6,"rose",0]],
  clock:[5.75,4.75,12.9],pole:[4.8,11.4],signs:[[4.38,2.18],[5.22,2.18]],sr:0.3,kiosk:[-6.05,-4.55,10.3,11.6,2.6],officer:[0.3,22.5],lamps:[33,64],pretzel:[-5.55,3.7,12.2]};
// how each kind of light paints the place: the sky's top and horizon, the sun (where, how warm), the light on the left fronts and the
// shade on the right, and whether the shops' blinds are down
const CW_LIGHT={dawn:{top:[150,162,212],hzc:[255,200,164],warm:0.16,shade:0.16,blinds:true},
  day:{top:[150,190,232],hzc:[236,236,226],warm:0.12,shade:0.12,blinds:false},
  night:{top:[196,206,228],hzc:[252,208,162],warm:0,shade:0.3,blinds:true}};
function cw_paintStreet(ctx,v){const C=CW_ST,Lt=CW_LIGHT[v],night=v==="night";
  wc_sky(ctx,C.hz+40,61,{clouds:v==="day"?4:2,cx:420,cw:1100,cy:40,ch:160});
  // the sky's light: blue overhead, warm low down where the sun is rising, at the street's end
  ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,0,0,C.hz+60);g.addColorStop(0,rgba(Lt.top,1));g.addColorStop(0.62,rgba(mix(Lt.top,Lt.hzc,0.6),1));
  g.addColorStop(1,rgba(Lt.hzc,1));ctx.fillStyle=g;ctx.fillRect(0,0,W,C.hz+60);ctx.restore();
  // the street's end: a small square, its trees, the town hall beyond with its copper roof and a little tower
  const E=C.end,th=[[-12,0,E+16],[12,0,E+16]];
  const [hx0,hy0]=cw_pj(C,-11,13,E+18),[hx1,hy1]=cw_pj(C,11,0,E+18);wc_part(ctx,wc_rect(hx0,hy0,hx1-hx0,hy1-hy0),CW.cream,0.55,{seed:611});
  wc_part(ctx,[[hx0-6,hy0],[hx1+6,hy0],[hx1-24,hy0-34],[hx0+24,hy0-34]],CW.copper,0.55,{seed:612});
  const [tx0,ty0]=cw_pj(C,-1.6,19,E+18),[tx1,ty1]=cw_pj(C,1.6,13,E+18);wc_part(ctx,wc_rect(tx0,ty0,tx1-tx0,ty1-ty0),CW.cream,0.55,{seed:613});
  wc_part(ctx,[[tx0-3,ty0],[tx1+3,ty0],[(tx0+tx1)/2,ty0-30]],CW.copper,0.55,{seed:614});
  ctx.save();ctx.fillStyle=rgba(CW.glass,0.5);for(let i=0;i<9;i++)for(let j=0;j<3;j++){const [wx,wy]=cw_pj(C,-9.6+i*2.3,2.6+j*3.4,E+18);ctx.fillRect(wx,wy-6,5,9);}ctx.restore();
  for(const [X,h,c] of [[-8,9,WCP.leaf],[-3.5,10,WCP.leaf2],[2.5,9.5,WCP.leaf],[7.5,10.5,WCP.leaf2]]){const [x,y]=cw_pj(C,X,0,E+8);wc_roundTree(ctx,x,y,h*cw_ppm(C,E+8),0.62,c);}
  // the roads and pavements: the main street's, the side street's across it, the kerbs
  const z0=6.4,ground=[[-60,cw_pj(C,0,0,E)[1]],[W+60,cw_pj(C,0,0,E)[1]],[W+60,H+60],[-60,H+60]];wc_wash(ctx,ground,CW.walk,{kind:"ground",line:false,seed:615});
  wc_wash(ctx,cw_band(C,z0,E,()=>-C.road,()=>C.road),CW.asphalt,{kind:"ground",line:false,seed:617});
  for(const s of [-1,1])wc_wash(ctx,cw_q(C,[[s*C.road,0,C.cross[0]],[s*60,0,C.cross[0]],[s*60,0,C.cross[1]],[s*C.road,0,C.cross[1]]]),CW.asphalt,{kind:"ground",line:false,seed:619+s});
  ctx.save();ctx.lineCap="round";const kl=(pts,a)=>{ctx.strokeStyle=rgba(wc_dim(CW.kerb,0.32),a);ctx.lineWidth=2.4;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();};
  for(const s of [-1,1]){kl(cw_line(C,z0,C.cross[0],()=>s*C.road),0.7);kl(cw_line(C,C.cross[1],E,()=>s*C.road),0.7);
    kl([cw_pj(C,s*C.road,0,C.cross[0]),cw_pj(C,s*40,0,C.cross[0])],0.6);kl([cw_pj(C,s*C.road,0,C.cross[1]),cw_pj(C,s*40,0,C.cross[1])],0.6);}
  // the paving slabs' joints on the pavements, in lines across
  ctx.strokeStyle=rgba(wc_dim(CW.walk,0.18),0.35);ctx.lineWidth=1.2;for(const s of [-1,1])for(let z=7;z<E;z+=z<30?1.2:2.4){if(z>C.cross[0]-2&&z<C.cross[1]+2)continue;
    const a=cw_pj(C,s*C.road,0,z),b=cw_pj(C,s*C.front,0,z);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  // the road's markings: the crossing's stripes, the stop line, the centre line's dashes
  for(let i=0;i<8;i++){const X=-C.road+0.25+i*0.95;cw_mark(ctx,cw_q(C,[[X,0,C.zebra[0]],[X+0.5,0,C.zebra[0]],[X+0.5,0,C.zebra[1]],[X,0,C.zebra[1]]]));}
  for(let z=7;z<E;z+=6){if(z+3>C.zebra[0]&&z<C.far+1)continue;cw_mark(ctx,cw_q(C,[[-0.07,0,z],[0.07,0,z],[0.07,0,z+3],[-0.07,0,z+3]]));}
  // a soft shadow from the right-hand fronts across the road, at dawn
  if(Lt.shade>0){ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=Lt.shade;wc_tr(ctx,cw_band(C,z0,E,()=>-C.road-0.2,()=>C.front));ctx.fillStyle=rgba([196,200,222],1);ctx.fill();ctx.restore();}
  // the blocks, far to near on each side; where a block is taller than the one nearer it, its end wall shows over that one's roof. The
  // side street's far corners, the fronts that face along it, come between the blocks beyond it and the blocks this side of it
  for(const s of [-1,1]){const Bs=(s<0?C.L:C.R).slice().reverse(),blk=(B,i)=>{const nb=Bs[i+1];if(nb&&nb[1]===B[0]&&nb[2]<B[2])cw_endWall(ctx,C,s,B[0],nb[2],B[2],CW[B[3]]);
      cw_front(ctx,C,s*C.front,B[0],B[1],B[2],CW[B[3]],{shops:B[4],v,lit:s<0});};
    Bs.forEach((B,i)=>{if(B[0]>=C.far)blk(B,i);});const B=(s<0?C.L:C.R)[2],X0=s*C.front,X1=s*34;cw_frontZ(ctx,C,C.far,Math.min(X0,X1),Math.max(X0,X1),B[2]-0.4,CW[B[3]],v,s);
    Bs.forEach((B,i)=>{if(B[0]<C.far)blk(B,i);});}
  // the lamps on their wires over the street
  C.lamps.forEach(z=>cw_wireLamp(ctx,C,z,0));
  // the kiosk, the baker's sign, the clock on its bracket, the pole with its two signs
  cw_kiosk(ctx,C,v);cw_pretzel(ctx,C);cw_clockBracket(ctx,C);cw_pole(ctx,C,night?0:1);
}
// white paint on the road: laid over the wash (not into it), with the paper's grain through it
function cw_mark(ctx,q){ctx.save();ctx.fillStyle="rgba(244,242,234,0.82)";wc_tr(ctx,q);ctx.fill();ctx.restore();wc_flat(ctx,q,[236,232,222],0.35,"mark");}
// a building's front along the street, on the plane x = X, from z0 to z1, h high: plaster in its colour, floors of windows with white
// frames, a cornice; on the ground floor, shop windows (their blinds down at dawn and night) and a door, a fascia over them
function cw_front(ctx,C,X,z0,z1,h,col,o){o=o||{};const s=Math.sign(X),Lt=CW_LIGHT[o.v||"day"],q=cw_sideQ(C,X,z0,z1,0,h),fl=3.4,far=z0>60;
  wc_wash(ctx,q,col,{kind:"build",seed:Math.round(z0*7+X),lw:far?1.2:1.6});
  // the light: warm on the upper floors of the left fronts, which face the rising sun; the right fronts in the morning's shade
  ctx.save();wc_tr(ctx,q);ctx.clip();if(o.lit&&Lt.warm>0){const [,ya]=cw_pj(C,X,h,z0),[,yb]=cw_pj(C,X,4,z0),gg=ctx.createLinearGradient(0,ya,0,yb);
      gg.addColorStop(0,rgba([255,214,160],Lt.warm));gg.addColorStop(1,rgba([255,214,160],0));ctx.globalCompositeOperation="screen";ctx.fillStyle=gg;ctx.fillRect(-W,-H,3*W,3*H);}
    if(!o.lit&&Lt.shade>0){ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([206,210,230],Lt.shade+0.2);ctx.fillRect(-W,-H,3*W,3*H);}ctx.restore();
  // the floors of windows: frames, then the glass
  const n=Math.max(1,Math.floor((z1-z0-0.6)/2.3)),sp=(z1-z0)/n;
  for(let Y=fl;Y+2.4<h;Y+=3.0)for(let i=0;i<n;i++){const za=z0+i*sp+(sp-1.05)/2,zb=za+1.05;
    wc_flat(ctx,cw_sideQ(C,X,za,zb,Y+0.7,Y+2.35),CW.frame,1,"frame");const gq=cw_sideQ(C,X,za+0.1,zb-0.1,Y+0.82,Y+2.24);wc_flat(ctx,gq,mix(CW.glass,Lt.top,0.35),1,"pane");
    if(!far){const [m0,m1]=[cw_pj(C,X,Y+1.62,za+0.1),cw_pj(C,X,Y+1.62,zb-0.1)];ctx.save();ctx.strokeStyle=rgba(CW.frame,0.9);ctx.lineWidth=Math.max(1,cw_ppm(C,za)*0.05);ctx.beginPath();ctx.moveTo(m0[0],m0[1]);ctx.lineTo(m1[0],m1[1]);ctx.stroke();ctx.restore();
      cw_shade(ctx,cw_sideQ(C,X,za+0.1,zb-0.1,Y+2.0,Y+2.24),[150,150,170],0.25);}}
  // the cornice, and its shadow under it
  wc_flat(ctx,cw_sideQ(C,X,z0,z1,h-0.5,h),CW.cornice,1,"cornice");cw_shade(ctx,cw_sideQ(C,X,z0,z1,h-0.75,h-0.5),[120,110,110],0.35);
  // the ground floor: shop windows and a door, or a stone base and an office's door
  const gq=cw_sideQ(C,X,z0,z1,0,3.15);
  if(o.shops){wc_flat(ctx,cw_sideQ(C,X,z0+0.15,z1-0.15,2.75,3.25),wc_dim(CW.fascia,0.05*(z0%3)),1,"fascia");
    const m=Math.max(1,Math.round((z1-z0)/4.2)),w2=(z1-z0)/m;for(let i=0;i<m;i++){const za=z0+i*w2+0.35,zd=za+1.0,zb=za+w2-0.7;
      wc_flat(ctx,cw_sideQ(C,X,za,zd,0,2.45),CW.door,1,"door");wc_flat(ctx,cw_sideQ(C,X,zd+0.2,zb,0.55,2.6),wc_dim(CW.glass,0.18),1,"shop");
      if(Lt.blinds){wc_flat(ctx,cw_sideQ(C,X,zd+0.22,zb-0.02,1.1,2.58),CW.blind,1,"blind");const hb=cw_sideQ(C,X,zd+0.22,zb-0.02,1.1,1.22);wc_flat(ctx,hb,wc_dim(CW.blind,0.25),1,"hem");}
      else{const sh=cw_sideQ(C,X,zd+0.3,zb-0.1,0.6,0.95);wc_flat(ctx,sh,[226,214,190],1,"shelf");for(let k=0;k<3;k++){const zz=lerp(zd+0.5,zb-0.4,k/2);wc_flat(ctx,cw_sideQ(C,X,zz,zz+0.35,0.95,1.35),[[200,90,70],[230,200,120],[110,140,180]][k],1,"goods");}}}}
  else{wc_flat(ctx,cw_sideQ(C,X,z0,z1,0,0.9),wc_dim(col,0.18),1,"base");const zm=(z0+z1)/2;wc_flat(ctx,cw_sideQ(C,X,zm-0.7,zm+0.7,0,2.7),CW.door,1,"door");
    wc_flat(ctx,cw_sideQ(C,X,zm-0.85,zm+0.85,2.7,2.95),CW.frame,1,"lintel");}
  ctx.save();ctx.strokeStyle=rgba(wc_dim(col,0.35),0.5);ctx.lineWidth=1.6;const [a,b]=[cw_pj(C,X,3.25,z0),cw_pj(C,X,3.25,z1)];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.restore();}
// a front facing us, on the plane z = Z, from x0 to x1: the far corners of the side street
function cw_frontZ(ctx,C,Z,x0,x1,h,col,v,s){const q=cw_faceQ(C,Z,x0,x1,0,h),Lt=CW_LIGHT[v];wc_wash(ctx,q,col,{kind:"build",seed:Math.round(Z*3+x0)});
  if(Lt.shade>0)cw_shade(ctx,q,[206,210,230],0.25);
  for(let Y=3.4;Y+2.4<h;Y+=3.0)for(let X=x0+1;X+1.2<x1;X+=2.4){wc_flat(ctx,cw_faceQ(C,Z,X,X+1.05,Y+0.7,Y+2.35),CW.frame,1,"frame");wc_flat(ctx,cw_faceQ(C,Z,X+0.1,X+0.95,Y+0.82,Y+2.24),mix(CW.glass,Lt.top,0.35),1,"pane");}
  wc_flat(ctx,cw_faceQ(C,Z,x0,x1,h-0.5,h),CW.cornice,1,"cornice");wc_flat(ctx,cw_faceQ(C,Z,x0,x1,2.75,3.25),CW.fascia,1,"fascia");
  for(let X=x0+0.6;X+3<x1;X+=4.2)wc_flat(ctx,cw_faceQ(C,Z,X,X+3,0.55,2.6),Lt.blinds?CW.blind:wc_dim(CW.glass,0.18),1,"shop");}
// the end wall of a block taller than the one nearer it, facing us above that one's roof
function cw_endWall(ctx,C,s,Z,y0,y1,col){const q=cw_faceQ(C,Z,s<0?-16:C.front,s<0?-C.front:16,y0,y1);wc_wash(ctx,q,wc_dim(col,0.08),{kind:"build",seed:Math.round(Z*5)});cw_shade(ctx,q,[200,204,224],0.3);}
// a lamp hanging on a wire across the street, between the fronts; lit a, 0 to 1
function cw_wireLamp(ctx,C,z,lit){const L=[];for(let i=0;i<=20;i++){const X=lerp(-C.front,C.front,i/20);L.push(cw_pj(C,X,7.6-0.35*(1-Math.pow(2*i/20-1,2)),z));}
  ctx.save();ctx.strokeStyle=rgba(CW.iron,0.7);ctx.lineWidth=Math.max(1,cw_ppm(C,z)*0.03);ctx.beginPath();L.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();
  const k=cw_ppm(C,z),[x,y]=cw_pj(C,0,7.25,z);wc_part(ctx,[[x-0.06*k,y],[x+0.06*k,y],[x+0.32*k,y+0.3*k],[x-0.32*k,y+0.3*k]],CW.iron,1,{kind:"thing",lw:1});
  wc_flat(ctx,wc_ell(x,y+0.33*k,0.14*k,0.06*k,14),[255,240,200],1,"bulb");if(lit>0){cw_light(ctx,x,y+0.4*k,1.8*k,[255,224,160],0.5*lit);cw_light(ctx,x,y+0.36*k,0.5*k,[255,246,220],0.8*lit);}}
// the newspaper kiosk on the left pavement: its front towards us, its side towards the street, a roof over both. At dawn its shutter is
// half up, so the booklets in its window show, each with its large H; at night it's shut; in the day it's open
function cw_kiosk(ctx,C,v){const [x0,x1,z0,z1,h]=C.kiosk,col=[96,128,112],k=cw_ppm(C,z0);wc_contact(ctx,cw_pj(C,x0,0,z0)[0]-6,cw_pj(C,x1,0,z0)[0]+12,cw_pj(C,0,0,z0)[1]+2,1,0.32);
  for(const [nm,q] of cw_boxFaces(C,x0,x1,0,h,z0,z1))wc_wash(ctx,q,nm==="top"?wc_lit(col,0.2):nm==="side"?wc_dim(col,0.12):col,{kind:"build",seed:nm.length*31+5});
  wc_wash(ctx,cw_q(C,[[x0-0.15,h,z0-0.2],[x1+0.2,h,z0-0.2],[x1+0.2,h,z1+0.1],[x0-0.15,h,z1+0.1]]),[150,62,52],{kind:"build",seed:623});
  wc_flat(ctx,cw_faceQ(C,z0-0.2,x0-0.15,x1+0.2,h-0.22,h),wc_dim([150,62,52],0.2),1,"eave");
  // the window, its counter, and the shutter: what shows through it
  const wq=cw_faceQ(C,z0,x0+0.18,x1-0.18,1.0,2.1);wc_flat(ctx,wq,v==="night"?[60,64,80]:[236,224,196],1,"inside");
  if(v!=="night"){for(let i=0;i<3;i++){const bx=x0+0.3+i*0.36;cw_bookletAt(ctx,C,bx,1.16,z0+0.02,0.24,(i-1)*0.06);}
    if(v==="dawn")cw_light(ctx,cw_pj(C,(x0+x1)/2,1.6,z0)[0],cw_pj(C,0,1.6,z0)[1],0.9*k,[255,226,170],0.3);}
  const sh=v==="night"?1:v==="dawn"?0.25:0;if(sh>0){wc_flat(ctx,cw_faceQ(C,z0-0.01,x0+0.16,x1-0.16,2.1-1.1*sh,2.12),[176,180,184],1,"shutter");
    ctx.save();ctx.strokeStyle=rgba([120,124,130],0.6);ctx.lineWidth=1.2;for(let Y=2.1-1.1*sh+0.08;Y<2.1;Y+=0.09){const a=cw_pj(C,x0+0.16,Y,z0),b=cw_pj(C,x1-0.16,Y,z0);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();}
  wc_flat(ctx,cw_faceQ(C,z0-0.08,x0+0.1,x1-0.1,0.92,1.02),wc_dim(col,0.3),1,"counter");}
// the booklet that reached every home: a plain cover with a large H, standing in a window or held (at x, its foot at y, w wide, on the
// plane z = Z, leaning a little, rot)
function cw_bookletAt(ctx,C,X,Y,Z,w,rot){const h=w*1.4,c=[X+w/2,Y+h/2],R=(a,b)=>[c[0]+(a-c[0])*Math.cos(rot)-(b-c[1])*Math.sin(rot),c[1]+(a-c[0])*Math.sin(rot)+(b-c[1])*Math.cos(rot)];
  const q=[R(X,Y),R(X+w,Y),R(X+w,Y+h),R(X,Y+h)].map(([a,b])=>cw_pj(C,a,b,Z));wc_flat(ctx,q,[250,248,240],1,"cover");
  const [cx,cy]=cw_pj(C,c[0],c[1],Z),k=cw_ppm(C,Z);cw_H(ctx,cx,cy,h*0.56*k,CW.navy,rot);}
// a plain letter H, drawn as three bars, centred at (x,y), s high
function cw_H(ctx,x,y,s,col,rot){ctx.save();ctx.translate(x,y);ctx.rotate(-(rot||0));ctx.fillStyle=rgba(col,0.95);const t=s*0.2,w=s*0.72;ctx.fillRect(-w/2,-s/2,t,s);ctx.fillRect(w/2-t,-s/2,t,s);ctx.fillRect(-w/2,-t/2,w,t);ctx.restore();}
// the baker's sign: a golden pretzel hanging from an iron bracket on the left front
function cw_pretzel(ctx,C){const [X,Y,Z]=C.pretzel,k=cw_ppm(C,Z),[bx,by]=cw_pj(C,-C.front,Y+0.7,Z),[px,py]=cw_pj(C,X,Y,Z);
  ctx.save();ctx.strokeStyle=rgba(CW.iron,0.9);ctx.lineWidth=Math.max(1.5,0.05*k);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(px+0.1*k,by);ctx.moveTo(px,by);ctx.lineTo(px,py-0.28*k);ctx.stroke();
  ctx.translate(px,py);const u=0.9*k;ctx.lineCap="round";ctx.lineJoin="round";
  // the belly: a loop open at the top, its two ends crossing low in the middle and reaching up to it, the way a pretzel is knotted
  const path=()=>{ctx.beginPath();ctx.moveTo(-0.07*u,-0.2*u);ctx.bezierCurveTo(-0.24*u,-0.34*u,-0.42*u,-0.16*u,-0.36*u,0.04*u);ctx.bezierCurveTo(-0.3*u,0.24*u,-0.1*u,0.3*u,0,0.3*u);
    ctx.bezierCurveTo(0.1*u,0.3*u,0.3*u,0.24*u,0.36*u,0.04*u);ctx.bezierCurveTo(0.42*u,-0.16*u,0.24*u,-0.34*u,0.07*u,-0.2*u);
    ctx.moveTo(-0.07*u,-0.2*u);ctx.bezierCurveTo(0.04*u,-0.06*u,0.12*u,0.06*u,0.2*u,0.22*u);ctx.moveTo(0.07*u,-0.2*u);ctx.bezierCurveTo(-0.04*u,-0.06*u,-0.12*u,0.06*u,-0.2*u,0.22*u);};
  path();ctx.strokeStyle=rgba(wc_dim(CW.gold,0.45),0.9);ctx.lineWidth=0.11*u;ctx.stroke();ctx.strokeStyle=rgba(CW.gold,1);ctx.lineWidth=0.08*u;ctx.stroke();
  ctx.strokeStyle=rgba([255,236,180],0.7);ctx.lineWidth=0.02*u;ctx.stroke();ctx.restore();}
// the street clock: a round face on a bracket from the right front, facing along the street; its hands are drawn every frame
// (cw_clockHands), at whatever minute it is
function cw_clockBracket(ctx,C){const [X,Y,Z]=C.clock,k=cw_ppm(C,Z),[bx,by]=cw_pj(C,C.front,Y+0.1,Z),[cx,cy]=cw_pj(C,X,Y,Z),r=0.4*k;
  ctx.save();ctx.strokeStyle=rgba(CW.iron,0.95);ctx.lineWidth=Math.max(2,0.07*k);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx,cy);ctx.lineTo(cx+r*1.05,cy);ctx.stroke();
  ctx.lineWidth=Math.max(1.5,0.04*k);ctx.beginPath();ctx.moveTo(bx,cy+0.32*k);ctx.lineTo(lerp(bx,cx+r*1.05,0.55),cy);ctx.stroke();ctx.restore();
  wc_wash(ctx,wc_ell(cx,cy,r*1.12,r*1.12,30),CW.iron,{kind:"clock",lw:1.2,seed:631});wc_flat(ctx,wc_ell(cx,cy,r,r,30),[250,246,232],1,"face");
  ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.8);ctx.lineCap="round";for(let i=0;i<12;i++){const a=i/12*TAU,l=i%3?0.1:0.18;ctx.lineWidth=i%3?Math.max(1,r*0.04):Math.max(1.6,r*0.07);
    ctx.beginPath();ctx.moveTo(cx+Math.sin(a)*r*0.86,cy-Math.cos(a)*r*0.86);ctx.lineTo(cx+Math.sin(a)*r*(0.86-l),cy-Math.cos(a)*r*(0.86-l));ctx.stroke();}ctx.restore();}
// the clock's hands at m minutes past four (50 is ten to five, 60 is five)
function cw_clockHands(ctx,C,m){const [X,Y,Z]=C.clock,[cx,cy]=cw_pj(C,X,Y,Z),r=0.4*cw_ppm(C,Z),hr=(4+m/60)/12*TAU,mn=m/60*TAU;
  ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.92);ctx.lineCap="round";ctx.lineWidth=Math.max(2,r*0.1);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(hr)*r*0.48,cy-Math.cos(hr)*r*0.48);ctx.stroke();
  ctx.lineWidth=Math.max(1.5,r*0.06);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(mn)*r*0.76,cy-Math.cos(mn)*r*0.76);ctx.stroke();ctx.fillStyle=rgba(WC_DARK,1);ctx.beginPath();ctx.arc(cx,cy,Math.max(2,r*0.07),0,TAU);ctx.fill();ctx.restore();}
const cw_clockAt=C=>cw_pj(C,C.clock[0],C.clock[1],C.clock[2]);
// the pole on the right pavement and its crossbar; its two signs (cw_signs): which one is wrapped in black, nw (0: the new one, on
// the right; 1: the old one, on the left, as after that night)
function cw_pole(ctx,C,nw){const [X,Z]=C.pole,k=cw_ppm(C,Z),[px,py]=cw_pj(C,X,0,Z),[,pt]=cw_pj(C,X,2.75,Z);wc_contact(ctx,px-0.3*k,px+0.3*k,py+1,1,0.3);
  wc_wash(ctx,wc_rect(px-0.04*k,pt,0.08*k,py-pt),CW.iron,{kind:"iron",lw:1.2,seed:641});const [b0]=cw_pj(C,C.signs[0][0]-0.1,0,Z),[b1]=cw_pj(C,C.signs[1][0]+0.1,0,Z),[,by]=cw_pj(C,0,2.6,Z);
  wc_wash(ctx,wc_rect(b0,by-0.03*k,b1-b0,0.06*k),CW.iron,{kind:"iron",lw:1,seed:643});cw_signs(ctx,C,nw);}
function cw_signs(ctx,C,nw,o){o=o||{};const Z=C.pole[1],k=cw_ppm(C,Z),r=C.sr*k;C.signs.forEach(([X,Y],i)=>{const [x,y]=cw_pj(C,X,Y,Z),old=i===0;
  ctx.save();ctx.strokeStyle=rgba(CW.iron,0.9);ctx.lineWidth=Math.max(1.2,0.02*k);ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x,cw_pj(C,0,2.6,Z)[1]);ctx.stroke();ctx.restore();
  cw_sign(ctx,x,y,r,old?-1:1);const cov=o.cover?o.cover[i]:(old?nw:1-nw);if(cov>0.01)cw_cover(ctx,x,y,r,cov);});}
// a round blue sign with a white rim and a white arrow, pointing down to the left (d -1, keep left) or to the right (d 1, keep right)
function cw_sign(ctx,x,y,r,d){wc_flat(ctx,wc_ell(x,y,r,r,28),[250,250,250],1,"rim");wc_flat(ctx,wc_ell(x,y,r*0.86,r*0.86,28),CW.sign,1,"sign");
  ctx.save();ctx.translate(x,y);ctx.rotate(-d*Math.PI*0.25);ctx.fillStyle="rgba(250,250,250,0.96)";ctx.beginPath();ctx.moveTo(-r*0.12,-r*0.55);ctx.lineTo(r*0.12,-r*0.55);ctx.lineTo(r*0.12,r*0.14);
  ctx.lineTo(r*0.3,r*0.14);ctx.lineTo(0,r*0.58);ctx.lineTo(-r*0.3,r*0.14);ctx.lineTo(-r*0.12,r*0.14);ctx.closePath();ctx.fill();ctx.restore();}
// the black cover over a sign, tied at the top: p is how much of it is on (it slides down over the sign, or up off it)
function cw_cover(ctx,x,y,r,p){const e=easeCam(clamp(p,0,1)),top=y-r*1.25,bot=lerp(top+r*0.2,y+r*1.12,e);ctx.save();
  ctx.fillStyle=rgba(CW.black,0.96);ctx.beginPath();ctx.moveTo(x-r*0.18,top);ctx.quadraticCurveTo(x-r*1.18,top+r*0.4,x-r*1.12,bot-r*0.15);ctx.quadraticCurveTo(x,bot+r*0.12,x+r*1.12,bot-r*0.15);
  ctx.quadraticCurveTo(x+r*1.18,top+r*0.4,x+r*0.18,top);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba([90,88,96],0.6);ctx.lineWidth=Math.max(1,r*0.05);
  for(const s of [-0.5,0.1,0.55]){ctx.beginPath();ctx.moveTo(x+s*r*0.4,top+r*0.15);ctx.quadraticCurveTo(x+s*r*1.1,(top+bot)/2,x+s*r*0.9,bot-r*0.1);ctx.stroke();}
  ctx.fillStyle=rgba([70,66,60],1);ctx.fillRect(x-r*0.24,top-r*0.02,r*0.48,r*0.1);ctx.restore();}
// The light of a moment, laid over a whole shot each frame, the place and everything moving in it alike: a colour multiplied over it
// all, then what gives light, added over it (the sun low at the street's end, lamps, lit windows) and last the lights of the cars, kept
// back while they're drawn (cw_glow) so the dusk or the night doesn't dim them
let CW_LIT=null;
const cw_glow=fn=>{if(CW_LIT)CW_LIT.push(fn);else fn();};
function cw_grade(ctx,mul){if(!mul)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mul,1);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
function cw_lights(){const L=CW_LIT||[];CW_LIT=null;L.forEach(f=>f());}
// the crossroads': dawn's cool blue, with a warm sky low down and the sun's glow beyond the town hall, the lamps still on and a few
// windows lit; night's deep blue, its lamps and their pools on the road, more windows lit; the day as it is
const CW_GRADE={dawn:{mul:[198,200,230],sun:[1000,396],lamps:0.8,pool:0.25,lit:0.14},night:{mul:[92,100,148],lamps:1,pool:0.55,lit:0.18},day:{}};
function cw_streetLight(ctx,v){const C=CW_ST,G=CW_GRADE[v];cw_grade(ctx,G.mul);
  if(G.sun){const [sx,sy]=G.sun;cw_light(ctx,sx,sy,440,[255,200,150],0.26);cw_light(ctx,sx,sy,150,[255,226,186],0.5);}
  if(G.lamps)C.lamps.forEach(z=>{const k=cw_ppm(C,z),[x,y]=cw_pj(C,0,7.25,z);cw_light(ctx,x,y+0.4*k,3.4*k,[255,214,140],0.5*G.lamps);cw_light(ctx,x,y+0.36*k,0.6*k,[255,240,210],0.9*G.lamps);
    const [gx,gy]=cw_pj(C,0,0,z);ctx.save();ctx.globalCompositeOperation="screen";const g=ctx.createRadialGradient(gx,gy/0.4,0,gx,gy/0.4,4.2*k);g.addColorStop(0,rgba([150,124,80],G.pool));g.addColorStop(1,"rgba(150,124,80,0)");
    ctx.fillStyle=g;ctx.scale(1,0.4);ctx.fillRect(gx-4.2*k,gy/0.4-4.2*k,8.4*k,8.4*k);ctx.restore();});
  if(G.lit){const R=wc_rng(651);ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(200,140,60,0.9)";for(const s of [-1,1])(s<0?C.L:C.R).forEach(B=>{for(let Y=3.4;Y+2.4<B[2];Y+=3.0){if(R()>G.lit)continue;
    const n=Math.max(1,Math.floor((B[1]-B[0]-0.6)/2.3)),sp=(B[1]-B[0])/n,za=B[0]+Math.floor(R()*n)*sp+(sp-1.05)/2;wc_tr(ctx,cw_sideQ(C,s*C.front,za+0.1,za+0.95,Y+0.82,Y+2.24));ctx.fill();}});ctx.restore();}
  cw_lights();}

/* ---------- the cars of 1967 ---------- */
// a vehicle on a place's ground: its middle at (x, z), heading h (0 drives away from us, along the road; PI comes towards us), L long.
// In its own frame, a runs from its rear (0) to its front (L), b to its right, y up; lift(a) raises a part of it (a car towed by its
// rear). V.p(a,b,y) is where a point of it is on screen; V.ac, V.bc and V.yc are where the camera is in its frame, so it knows which of
// its faces we see
function cw_frame(C,x,z,h,L,lift){const D=[Math.sin(h),Math.cos(h)],N=[Math.cos(h),-Math.sin(h)],rx=(C.cx||0)-x,rz=-z;
  return{C,x,z,h,L,D,N,ac:rx*D[0]+rz*D[1]+L/2,bc:rx*N[0]+rz*N[1],yc:C.ch,
    p:(a,b,y)=>{const u=a-L/2;return cw_pj(C,x+D[0]*u+N[0]*b,y+(lift?lift(a):0),z+D[1]*u+N[1]*b);}};}
// the faces of a box in a vehicle's frame (a0..a1, b0..b1, y0..y1) that the camera sees: [name, corners on screen]
function cw_vfaces(V,a0,a1,b0,b1,y0,y1){const f=[],P=V.p;if(V.yc>y1)f.push(["top",[P(a0,b0,y1),P(a1,b0,y1),P(a1,b1,y1),P(a0,b1,y1)]]);
  if(V.bc>b1)f.push(["side",[P(a0,b1,y0),P(a1,b1,y0),P(a1,b1,y1),P(a0,b1,y1)]]);else if(V.bc<b0)f.push(["side",[P(a0,b0,y0),P(a1,b0,y0),P(a1,b0,y1),P(a0,b0,y1)]]);
  if(V.ac<a0)f.push(["rear",[P(a0,b0,y0),P(a0,b1,y0),P(a0,b1,y1),P(a0,b0,y1)]]);else if(V.ac>a1)f.push(["front",[P(a1,b0,y0),P(a1,b1,y0),P(a1,b1,y1),P(a1,b0,y1)]]);
  return f;}
const cw_bbox=pts=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [x,y] of pts){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return[x0,y0,x1-x0,y1-y0];};
const CW_TONE={day:c=>c};
// a quad filled flat (things drawn every frame are painted in one go, then given the paper's grain by cw_paint)
function cw_poly(q,pts,col,a){cw_path(q,pts);q.fillStyle=rgba(col,a==null?1:a);q.fill();}
// a ring of a body across its length: a rounded rectangle at a, from y0 to y1, w either side, with corners r
function cw_ring(V,a,y0,y1,w,r){const o=[];for(const [cb,cy,t0] of [[w-r,y1-r,0],[-(w-r),y1-r,Math.PI/2],[-(w-r),y0+r,Math.PI],[w-r,y0+r,Math.PI*1.5]])
  for(let i=0;i<=3;i++){const t=t0+i/3*Math.PI/2;o.push(V.p(a,cb+Math.cos(t)*r,cy+Math.sin(t)*r));}return o;}
// a wheel's disc, upright, at (a, b), radius r
const cw_disc=(V,a,b,r,y,n)=>{const o=[];n=n||18;for(let i=0;i<n;i++){const t=i/n*TAU;o.push(V.p(a+Math.cos(t)*r,b,(y==null?r:y)+Math.sin(t)*r));}return o;};

// A family car of the time, rounded, about 4.3 m long, its wheel on the left: the body's rings from the boot to the bonnet ([a, y0, y1,
// half width, corner]), the cabin over it, and four wheels. o: x, z, h, its colour, tail (rear lights, 0 to 1), head (headlights), the
// driver (seen through the rear window; o.lean moves his head), crumpled (its front pushed in), lift, and the place's tone
const CW_CARB=[[0,0.33,0.8,0.78,0.1],[0.17,0.27,0.9,0.81,0.13],[1.1,0.26,0.95,0.82,0.14],[3.1,0.26,0.95,0.82,0.14],[4.1,0.27,0.88,0.81,0.13],[4.3,0.31,0.76,0.77,0.1]],
  CW_CARX=[[0,0.33,0.8,0.78,0.1],[0.17,0.27,0.9,0.81,0.13],[1.1,0.26,0.95,0.82,0.14],[3.0,0.26,0.97,0.82,0.14],[3.55,0.27,1.04,0.83,0.14],[3.86,0.33,0.8,0.74,0.1]];
function cw_car(ctx,C,o){const crushed=!!o.crumpled,B=crushed?CW_CARX:CW_CARB,L=B[B.length-1][0],V=cw_frame(C,o.x,o.z,o.h||0,L,o.lift),tn=o.tone||CW_TONE.day,col=tn(o.col),
    k=cw_ppm(C,o.z),ends=V.ac<0?"rear":V.ac>L?"front":null,side=V.bc>0.8?1:V.bc<-0.8?-1:0,P=V.p,dark=tn([34,32,38]),chrome=tn([214,216,222]),glass=tn(o.glass||[112,128,156]);
  const rings=B.map(([a,y0,y1,w,r])=>cw_ring(V,a,y0,y1,w,r)),cab=[[1.2,0.95,0.79],[3.15,0.95,0.79],[2.7,1.43,0.64],[1.76,1.43,0.64]],
    cabP=[];for(const [a,y,w] of cab)for(const s of [-1,1])cabP.push(P(a,s*w,y));
  const all=cw_hull(rings.flat().concat(cabP)),box=cw_bbox(all.concat(cw_disc(V,0.78,0,0.32),cw_disc(V,L-0.75,0,0.32)));
  // its shadow on the road, soft at the edge
  const fp=e=>[P(-e,-0.84-e,0),P(L+e,-0.84-e,0),P(L+e,0.84+e,0),P(-e,0.84+e,0)];cw_shade(ctx,fp(0.1),[100,96,118],0.26,0.16*k);
  cw_paint(ctx,[box[0]-4,box[1]-4,box[2]+8,box[3]+8],q=>{
    // the tyres, under the body, then the body
    for(const a of [0.78,L-0.75])for(const s of [-1,1])cw_poly(q,cw_disc(V,a,s*0.72,0.32),dark);
    cw_poly(q,cw_hull(rings.flat()),col);
    // its top, lit by the sky; the side we see, in its own shade; the end we see
    const tops=B.map(([a,,y1,w,r])=>[a,y1,w-r*0.5]),top=tops.map(([a,y,w])=>P(a,-w,y)).concat(tops.slice().reverse().map(([a,y,w])=>P(a,w,y)));cw_poly(q,top,wc_lit(col,0.2));
    if(side){const sp=B.map(([a,,y1,w,r])=>P(a,side*w,y1-r*0.6)).concat(B.slice().reverse().map(([a,y0,,w,r])=>P(a,side*w,y0+r*0.6)));cw_poly(q,sp,wc_dim(col,0.1));
      // a chrome strip along the side
      cw_poly(q,[P(0.3,side*0.83,0.62),P(L-0.3,side*0.83,0.62),P(L-0.3,side*0.83,0.66),P(0.3,side*0.83,0.66)],chrome,0.8);}
    if(ends)cw_poly(q,rings[ends==="rear"?0:rings.length-1],wc_dim(col,ends==="rear"?0.16:0.08));
    // the cabin: its roof, the pillars in the body's colour, the windows
    cw_poly(q,cw_hull(cabP),col);cw_poly(q,[P(1.76,-0.64,1.43),P(2.7,-0.64,1.43),P(2.7,0.64,1.43),P(1.76,0.64,1.43)],wc_lit(col,0.26));
    const win=(pts,a)=>{cw_poly(q,pts,glass,a==null?1:a);};
    if(V.ac<1.6){const rw=[P(1.26,-0.7,0.99),P(1.26,0.7,0.99),P(1.72,0.58,1.39),P(1.72,-0.58,1.39)];win(rw);
      // the driver, on the left, seen from behind: his head and shoulders through the glass
      if(o.driver){q.save();cw_path(q,rw);q.clip();const lb=-0.38+(o.lean||0),hc=P(2.1,lb,1.16),hk=cw_ppm(C,o.z+(o.h&&Math.abs(o.h)>1.6?-0.1:0.1));
        q.fillStyle=rgba(tn(o.driver[1]||[60,48,40]),0.92);q.beginPath();q.ellipse(hc[0],hc[1],0.1*hk,0.12*hk,0,0,TAU);q.fill();
        const sh=P(2.15,lb,0.98);q.fillStyle=rgba(tn(o.driver[2]||[70,74,90]),0.9);q.beginPath();q.ellipse(sh[0],sh[1],0.24*hk,0.1*hk,0,0,TAU);q.fill();q.restore();}
      // the sky's light along the glass
      q.save();cw_path(q,rw);q.clip();q.strokeStyle=rgba([255,255,255],0.22);q.lineWidth=Math.max(1,0.06*k);q.beginPath();const s0=P(1.3,0.2,1.02),s1=P(1.68,0.5,1.36);q.moveTo(s0[0],s0[1]);q.lineTo(s1[0],s1[1]);q.stroke();q.restore();}
    if(V.ac>2.6)win([P(3.09,-0.7,0.99),P(3.09,0.7,0.99),P(2.74,0.58,1.39),P(2.74,-0.58,1.39)]);
    if(side){const yb=y=>side*lerp(0.79,0.64,(y-0.95)/0.48);win([P(1.36,yb(1.0),1.0),P(2.16,yb(1.0),1.0),P(2.16,yb(1.37),1.37),P(1.8,yb(1.37),1.37)]);
      win([P(2.26,yb(1.0),1.0),P(3.04,yb(1.0),1.0),P(2.66,yb(1.37),1.37),P(2.26,yb(1.37),1.37)]);}
    // the end we see: bumper, lights and a blank plate
    if(ends==="rear"){cw_poly(q,[P(0.01,-0.8,0.35),P(0.01,0.8,0.35),P(0.01,0.8,0.43),P(0.01,-0.8,0.43)],chrome);
      for(const s of [-1,1])cw_poly(q,[P(0.02,s*0.56,0.6),P(0.02,s*0.74,0.6),P(0.02,s*0.74,0.76),P(0.02,s*0.56,0.76)],tn([190,46,40]));
      cw_poly(q,[P(0.015,-0.25,0.45),P(0.015,0.25,0.45),P(0.015,0.25,0.56),P(0.015,-0.25,0.56)],tn([240,238,230]));}
    if(ends==="front"){const fa=L-0.01;cw_poly(q,[P(fa,-0.8,0.33),P(fa,0.8,0.33),P(fa,crushed?0.6:0.8,crushed?0.36:0.41),P(fa,-0.8,0.41)],chrome);
      cw_poly(q,[P(fa,-0.36,0.47),P(fa,0.36,0.47),P(fa,0.36,0.62),P(fa,-0.36,0.62)],tn([150,152,158]));
      for(const s of [-1,1]){if(crushed&&s>0)continue;const hc=P(fa,s*0.58,0.64),rr_=0.1*cw_ppm(C,o.z);q.fillStyle=rgba(chrome,1);q.beginPath();q.arc(hc[0],hc[1],rr_,0,TAU);q.fill();
        q.fillStyle=rgba(o.head?[255,250,232]:tn([226,224,210]),1);q.beginPath();q.arc(hc[0],hc[1],rr_*0.74,0,TAU);q.fill();}
      if(crushed){// the bonnet's crease, and a dent where a headlight was
        q.strokeStyle=rgba(wc_dim(col,0.4),0.8);q.lineWidth=Math.max(1,0.03*k);q.beginPath();const c0=P(3.2,-0.6,0.98),c1=P(3.5,0.05,1.06),c2=P(3.3,0.6,0.99);q.moveTo(c0[0],c0[1]);q.lineTo(c1[0],c1[1]);q.lineTo(c2[0],c2[1]);q.stroke();
        const dc=P(fa,0.58,0.62);q.fillStyle=rgba(wc_dim(col,0.45),1);q.beginPath();q.ellipse(dc[0],dc[1],0.12*k,0.08*k,0.3,0,TAU);q.fill();}}
    // the wheels on the side we see: the arch, the tyre, the hubcap
    if(side)for(const a of [0.78,L-0.75]){const ar=[];for(let i=0;i<=12;i++){const t=Math.PI*i/12;ar.push(P(a+Math.cos(t)*0.4,side*0.82,0.3+Math.sin(t)*0.42));}cw_poly(q,ar,wc_dim(col,0.55));
      cw_poly(q,cw_disc(V,a,side*0.8,0.32),dark);cw_poly(q,cw_disc(V,a,side*0.81,0.16,0.32,14),chrome);}},{lineA:0.8});
  // lights that are on
  cw_glow(()=>{if(o.tail>0&&ends==="rear")for(const s of [-1,1]){const [lx,ly]=P(0.02,s*0.65,0.68);cw_light(ctx,lx,ly,0.42*k,[255,80,60],0.45*o.tail);cw_light(ctx,lx,ly,0.12*k,[255,170,150],0.7*o.tail);}
  if(o.head>0){for(const s of [-1,1]){if(crushed&&s>0)continue;const [lx,ly]=P(L,s*0.58,0.64);if(ends==="front"){cw_light(ctx,lx,ly,1.1*k,[255,236,190],0.5*o.head);cw_light(ctx,lx,ly,0.22*k,[255,252,236],0.95*o.head);}}
    // their light on the road ahead of it
    const g0=P(L+0.6,0,0),g1=P(L+9,0,0);cw_beam(ctx,[P(L+0.2,-0.9,0),P(L+0.2,0.9,0),P(L+10,2.6,0),P(L+10,-2.6,0)],g0,g1,0.18*o.head);}});
  return V;}
// headlights' light on the road: a soft wash of warm light over a quad, strong near the car and fading away from it
function cw_beam(ctx,pts,g0,g1,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="screen";const g=ctx.createLinearGradient(g0[0],g0[1],g1[0],g1[1]);g.addColorStop(0,rgba([255,226,170],a));g.addColorStop(1,rgba([255,226,170],0));
  ctx.fillStyle=g;cw_path(ctx,pts);ctx.fill();ctx.restore();}

// Boxy vehicles, built from boxes in their own frame: a lorry with a load under a canvas cover, a bus, and a tow truck with its crane.
// Each part is [a0, a1, b0, b1, y0, y1, colour]; nearer parts are listed later
function cw_boxes(ctx,V,parts,tn,o){const pts=[];parts.forEach(([a0,a1,b0,b1,y0,y1])=>{for(const a of [a0,a1])for(const b of [b0,b1])for(const y of [y0,y1])pts.push(V.p(a,b,y));});
  (o.wheels||[]).forEach(([a,r])=>{for(const s of [-1,1])pts.push(...cw_disc(V,a,s*(o.track||1.0),r,r,10));});
  const box=cw_bbox(pts),k=cw_ppm(V.C,V.z),dark=tn([34,32,38]);
  const fp=e=>[V.p(-e,-1.2-e,0),V.p(V.L+e,-1.2-e,0),V.p(V.L+e,1.2+e,0),V.p(-e,1.2+e,0)];cw_shade(ctx,fp(0.1),[100,96,118],0.28,0.18*k);
  cw_paint(ctx,[box[0]-4,box[1]-4,box[2]+8,box[3]+8],q=>{(o.wheels||[]).forEach(([a,r])=>{for(const s of [-1,1])cw_poly(q,cw_disc(V,a,s*(o.track||1.0),r,r),dark);});
    parts.forEach(([a0,a1,b0,b1,y0,y1,c,kind])=>{const col=tn(c);cw_vfaces(V,a0,a1,b0,b1,y0,y1).forEach(([nm,f])=>cw_poly(q,f,nm==="top"?wc_lit(col,0.16):nm==="side"?wc_dim(col,0.08):wc_dim(col,0.16)));
      if(o.detail)o.detail(q,V,kind,[a0,a1,b0,b1,y0,y1],col);});
    // the wheels on the side we see
    const side=V.bc>1.2?1:V.bc<-1.2?-1:0;if(side)(o.wheels||[]).forEach(([a,r])=>{cw_poly(q,cw_disc(V,a,side*((o.track||1.0)+0.12),r,r),dark);cw_poly(q,cw_disc(V,a,side*((o.track||1.0)+0.13),r*0.5,r,12),tn([170,172,178]));});
    if(o.after)o.after(q,V,tn,k);},{lineA:0.8});
  cw_glow(()=>{if(o.tail>0&&V.ac<0)(o.lights||[[0.02,-1.0,0.7],[0.02,1.0,0.7]]).forEach(([a,b,y])=>{const [lx,ly]=V.p(a,b,y);cw_light(ctx,lx,ly,0.45*k,[255,80,60],0.45*o.tail);cw_light(ctx,lx,ly,0.13*k,[255,170,150],0.7*o.tail);});
  if(o.head>0&&V.ac>V.L)for(const s of [-1,1]){const [lx,ly]=V.p(V.L,s*0.8,0.9);cw_light(ctx,lx,ly,1.2*k,[255,236,190],0.5*o.head);cw_light(ctx,lx,ly,0.24*k,[255,252,236],0.95*o.head);}});
  return V;}
// a lorry: its load under a canvas cover, the cab behind it with its windows, a bonnet; o.tail lights its rear lamps
function cw_lorry(ctx,C,o){const V=cw_frame(C,o.x,o.z,o.h||0,8.2),tn=o.tone||CW_TONE.day,cab=o.col||[60,84,120],tarp=[150,146,106];
  return cw_boxes(ctx,V,[[0,5.4,-1.2,1.2,0.62,0.98,[60,58,62],"bed"],[0.05,5.35,-1.15,1.15,0.98,3.05,tarp,"tarp"],[5.6,7.2,-1.1,1.1,0.7,2.55,cab,"cab"],[7.2,8.2,-0.85,0.85,0.7,1.75,cab,"bonnet"]],tn,
    {wheels:[[1.1,0.5],[2.2,0.5],[6.7,0.5]],track:1.0,tail:o.tail,head:o.head,lights:[[0.01,-1.0,0.78],[0.01,1.0,0.78]],detail:(q,V,kind,b,col)=>{const [a0,a1,b0,b1,y0,y1]=b;
      // the cover's ropes and folds on the face we see; the cab's windows
      if(kind==="tarp"){q.strokeStyle=rgba(wc_dim(col,0.35),0.7);q.lineWidth=Math.max(1,0.03*cw_ppm(V.C,V.z));
        if(V.ac<a0)for(let i=1;i<4;i++){const bb=lerp(b0,b1,i/4),t0=V.p(a0,bb,y1),t1=V.p(a0,bb,y0);q.beginPath();q.moveTo(t0[0],t0[1]);q.lineTo(t1[0],t1[1]);q.stroke();}
        const side=V.bc>b1?b1:V.bc<b0?b0:null;if(side!=null)for(let i=1;i<6;i++){const aa=lerp(a0,a1,i/6),t0=V.p(aa,side,y1),t1=V.p(aa,side,y0);q.beginPath();q.moveTo(t0[0],t0[1]);q.lineTo(t1[0],t1[1]);q.stroke();}}
      if(kind==="cab"){const side=V.bc>b1?b1:V.bc<b0?b0:null;if(side!=null)cw_poly(q,[V.p(5.9,side,1.6),V.p(6.9,side,1.6),V.p(6.9,side,2.35),V.p(5.9,side,2.35)],o.glass||[112,128,156]);
        if(V.ac>a1)cw_poly(q,[V.p(a1,b0+0.15,1.7),V.p(a1,b1-0.15,1.7),V.p(a1,b1-0.15,2.4),V.p(a1,b0+0.15,2.4)],o.glass||[112,128,156]);}}});}
// a town bus of the time: long, its windows in a band, a lighter roof; the bus's own doors are on the side we don't see
function cw_bus(ctx,C,o){const V=cw_frame(C,o.x,o.z,o.h||0,10.8),tn=o.tone||CW_TONE.day,col=o.col||[188,64,56],cream=[238,226,198];
  return cw_boxes(ctx,V,[[0,10.8,-1.25,1.25,0.35,1.35,col,"low"],[0,10.8,-1.25,1.25,1.35,2.45,cream,"win"],[0.05,10.75,-1.2,1.2,2.45,2.95,cream,"roof"]],tn,
    {wheels:[[2.2,0.5],[8.4,0.5]],track:1.05,tail:o.tail,head:o.head,lights:[[0.01,-1.05,0.7],[0.01,1.05,0.7]],detail:(q,V,kind,b,col)=>{const [a0,a1,b0,b1,y0,y1]=b,gl=tn([118,134,160]);if(kind!=="win")return;
      const side=V.bc>b1?b1:V.bc<b0?b0:null;if(side!=null)for(let i=0;i<7;i++){const aa=0.5+i*1.42;cw_poly(q,[V.p(aa,side,1.5),V.p(aa+1.2,side,1.5),V.p(aa+1.2,side,2.35),V.p(aa,side,2.35)],gl);}
      if(V.ac<a0)cw_poly(q,[V.p(a0,-1.0,1.55),V.p(a0,1.0,1.55),V.p(a0,1.0,2.35),V.p(a0,-1.0,2.35)],gl);if(V.ac>a1)cw_poly(q,[V.p(a1,-1.15,1.4),V.p(a1,1.15,1.4),V.p(a1,1.15,2.42),V.p(a1,-1.15,2.42)],gl);}});}
// a tow truck: its cab and bonnet at the front, a flat bed with a crane at its rear, and the crane's cable down to what it tows
function cw_tow(ctx,C,o){const V=cw_frame(C,o.x,o.z,o.h||0,6.2),tn=o.tone||CW_TONE.day,col=o.col||[214,166,58],dk=[70,66,62];
  return cw_boxes(ctx,V,[[0,3.1,-1.1,1.1,0.6,0.95,dk,"bed"],[3.2,4.8,-1.05,1.05,0.65,2.35,col,"cab"],[4.8,6.2,-0.85,0.85,0.65,1.6,col,"bonnet"]],tn,
    {wheels:[[1.2,0.46],[5.3,0.46]],track:0.95,tail:o.tail,lights:[[0.01,-0.95,0.8],[0.01,0.95,0.8]],detail:(q,V,kind,b)=>{if(kind!=="cab")return;const [a0,a1,b0,b1]=b,side=V.bc>b1?b1:V.bc<b0?b0:null;
      if(side!=null)cw_poly(q,[V.p(3.5,side,1.5),V.p(4.5,side,1.5),V.p(4.5,side,2.15),V.p(3.5,side,2.15)],tn([112,128,156]));
      if(V.ac<a0)cw_poly(q,[V.p(a0,-0.8,1.55),V.p(a0,0.8,1.55),V.p(a0,0.8,2.1),V.p(a0,-0.8,2.1)],tn([112,128,156]));},
     after:(q,V,tn,k)=>{// the crane: two beams from the bed rising over the rear, and its cable
      q.strokeStyle=rgba(tn(col),1);q.lineCap="round";q.lineWidth=Math.max(2,0.16*k);for(const s of [-0.5,0.5]){const a=V.p(1.4,s,0.95),b=V.p(-0.5,s*0.3,2.5);q.beginPath();q.moveTo(a[0],a[1]);q.lineTo(b[0],b[1]);q.stroke();}
      q.strokeStyle=rgba(tn([60,58,60]),1);q.lineWidth=Math.max(1,0.04*k);const t=V.p(-0.5,0,2.5),e=o.hook||V.p(-0.9,0,0.9);q.beginPath();q.moveTo(t[0],t[1]);q.lineTo(e[0],e[1]);q.stroke();}});}

/* ---------- the people of 1967 ---------- */
// Invented people of a Swedish town, in the clothes of their time and their work, with the series' warm umber wash behind them: a
// police officer in a dark uniform and a peaked cap, with white gloves for directing traffic; a road worker in overalls and a flat cap;
// the change commission's staff, in suits with narrow ties, and a blouse and a cardigan; a postman with his cap and bag, no insignia; a
// grocer in a white coat; and people in the street in coats, one in a hat
Object.assign(PEOPLE,{
  cw_officer:{name:"",role:"police officer",side:"",edge:GV_PAST,seed:41,skin:[236,200,176],hair:{style:"cropped",c:[150,112,72]},hat:"cw_peak",hatC:[40,46,68],
    top:{kind:"suit",c:CW.navy,inner:[228,234,242],cw_tie:[30,30,38],cw_police:true},bottom:{c:[36,42,60]},shoe:[26,24,28],cw_glove:[250,250,246],build:{sh:76,hip:62,h:1.02}},
  cw_worker:{name:"",role:"road worker",side:"",edge:GV_PAST,seed:42,skin:[226,180,148],hair:{style:"cropped",c:[96,70,48]},hat:"cw_flat",hatC:[104,96,86],
    top:{kind:"shirt",c:[196,188,166],rolled:true,cw_bib:[78,100,128]},bottom:{c:[78,100,128]},shoe:[52,40,32],build:{sh:76,hip:64,h:1.0}},
  cw_planA:{name:"",role:"planner",side:"",edge:GV_PAST,seed:43,skin:[232,196,170],hair:{style:"side",c:[120,92,64]},glasses:[40,36,36],
    top:{kind:"suit",c:[120,124,130],inner:[240,240,236],cw_tie:[60,52,90]},bottom:{c:[96,100,108]},shoe:[40,32,28],build:{sh:74,hip:60,h:1.0}},
  cw_planB:{name:"",role:"planner",side:"",edge:GV_PAST,seed:44,skin:[240,206,182],hair:{style:"bob",c:[196,150,96],streak:[226,190,140]},earrings:[236,220,190],
    top:{kind:"cardigan",c:[170,96,90],inner:[244,240,230]},bottom:{kind:"skirt",c:[86,90,110]},legs:[224,190,168],shoe:[60,40,36],build:{sh:66,hip:62,h:0.95}},
  cw_planC:{name:"",role:"planner",side:"",edge:GV_PAST,seed:45,skin:[222,184,150],hair:{style:"cropped",c:[70,56,46]},
    top:{kind:"suit",c:[112,92,72],inner:[236,232,220],cw_tie:[150,64,50]},bottom:{c:[88,74,62]},shoe:[46,34,28],build:{sh:76,hip:62,h:1.02}},
  cw_postman:{name:"",role:"postman",side:"",edge:GV_PAST,seed:46,skin:[230,190,160],hair:{style:"side",c:[160,124,80]},hat:"cw_post",hatC:[72,86,112],
    top:{kind:"suit",c:[78,94,122],inner:[230,234,238],cw_tie:[44,44,54],cw_strap:[118,78,48]},bottom:{c:[66,78,102]},shoe:[36,30,28],build:{sh:74,hip:62,h:0.99}},
  cw_grocer:{name:"",role:"grocer",side:"",edge:GV_PAST,seed:47,skin:[236,198,172],hair:{style:"side",c:[110,96,86]},glasses:[60,52,44],
    top:{kind:"cw_coat",c:[248,246,240],inner:[214,222,232],cw_tie:[120,52,46]},bottom:{c:[80,78,86]},shoe:[40,32,28],build:{sh:76,hip:64,h:0.98}},
  cw_walkA:{name:"",role:"",side:"",edge:GV_PAST,seed:48,skin:[236,200,174],hair:{style:"side",c:[80,62,48]},hat:"cw_trilby",hatC:[96,88,80],
    top:{kind:"cw_coat",c:[118,112,98],inner:[232,230,224],cw_tie:[90,40,40]},bottom:{c:[70,70,78]},shoe:[36,30,28],build:{sh:74,hip:62,h:1.0}},
  cw_walkB:{name:"",role:"",side:"",edge:GV_PAST,seed:49,skin:[240,208,186],hair:{style:"bob",c:[150,96,60],streak:[190,140,96]},
    top:{kind:"cw_coat",c:[176,122,96],inner:[236,230,220]},bottom:{kind:"skirt",c:[90,80,90]},legs:[226,194,172],shoe:[70,40,38],build:{sh:64,hip:60,h:0.94}}
});
// the officer's signals: a raised white glove, palm out, that stops the traffic; an arm out to the side that sends it on
Object.assign(POSE,{cw_halt:{L:[0.12,-0.06],R:[2.75,3.05],hand:"open",feet:30,shift:4,tilt:-0.02,turn:0.1,gaze:[0.3,-0.2],look:0},
  cw_on:{L:[0.12,-0.06],R:[1.52,1.62],hand:"open",feet:30,shift:4,tilt:-0.02,turn:0.28,gaze:[0.7,0],look:0},
  // on a ladder: both hands up at the signs
  cw_up:{L:[2.5,3.0],R:[2.6,2.9],hand:"open",feet:20,shift:0,tilt:0.0,turn:0.05,gaze:[0.2,-1],look:0}});

// their clothes: the engine's people stay as they are; these wrap the torso, the head and the arms for their own kinds only
const _cwTorso=torso,_cwHead=head,_cwArm=arm;
torso=function(ctx,P,br,sh){const T_=P.top;if(T_.kind==="cw_coat")return cw_longCoat(ctx,P,br,sh);_cwTorso(ctx,P,br,sh);if(T_.cw_tie||T_.cw_police||T_.cw_bib||T_.cw_strap)cw_dress(ctx,P,br,sh);};
// a narrow tie; an officer's buttons, belt, pockets and shoulder straps; the bib and straps of overalls; a postman's bag on its strap
function cw_dress(ctx,P,br,sh){const T_=P.top,sw=P.build.sh,hw=P.build.hip,y0=-448+br,x=sh*0.3;
  if(T_.cw_tie){ctx.fillStyle=rgba(T_.cw_tie,1);ctx.beginPath();ctx.moveTo(x-6,y0+3);ctx.lineTo(x+6,y0+3);ctx.lineTo(x+4,y0+13);ctx.lineTo(x-4,y0+13);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(x-4,y0+13);ctx.lineTo(x+4,y0+13);ctx.lineTo(x+5.5,y0+54);ctx.lineTo(x,y0+60);ctx.lineTo(x-5.5,y0+54);ctx.closePath();ctx.fill();}
  if(T_.cw_police){ctx.save();torsoPath(ctx,P,br,sh);ctx.clip();const c=T_.c;
    // breast pockets with their flaps, the belt and its buckle, brass buttons down the front
    for(const s of [-1,1]){ctx.fillStyle=rgba(darken(c,0.25),0.9);ctx.beginPath();rr(ctx,x+s*40-15,-404,30,28,3);ctx.fill();ctx.fillStyle=rgba(lighten(c,0.08),1);ctx.beginPath();rr(ctx,x+s*40-16,-408,32,11,3);ctx.fill();
      ctx.fillStyle="rgba(214,176,92,1)";ctx.beginPath();ctx.arc(x+s*40,-401,2.6,0,TAU);ctx.fill();}
    ctx.fillStyle=rgba([22,20,24],1);ctx.fillRect(-hw-10,-296,hw*2+20,15);ctx.fillStyle="rgba(214,178,96,1)";ctx.fillRect(x-9,-299,18,21);ctx.fillStyle=rgba([22,20,24],1);ctx.fillRect(x-5,-294,10,11);
    ctx.fillStyle="rgba(222,186,104,1)";for(const yy of [-346,-322,-268])ell(ctx,x+4,yy,3.6,3.6),ctx.fill();ctx.restore();
    for(const s of [-1,1]){ctx.fillStyle=rgba(darken(T_.c,0.2),1);ctx.beginPath();rr(ctx,s*(sw-30)-12,y0+17,24,9,4);ctx.fill();ctx.fillStyle="rgba(214,178,96,1)";ctx.beginPath();ctx.arc(s*(sw-30)-s*8,y0+21.5,2.4,0,TAU);ctx.fill();}}
  if(T_.cw_bib){const b=T_.cw_bib;ctx.save();torsoPath(ctx,P,br,sh);ctx.clip();ctx.beginPath();ctx.moveTo(-34,-404);ctx.lineTo(34+x*0.3,-404);ctx.lineTo(hw+4,-300);ctx.lineTo(hw+8,-240);ctx.lineTo(-hw-8,-240);ctx.lineTo(-hw-4,-300);ctx.closePath();
    litFill(ctx,b,-hw,-404,hw,-240);seam(ctx,b,0.45);ctx.fillStyle=rgba(darken(b,0.2),1);ctx.beginPath();rr(ctx,-20+x*0.3,-388,40,34,4);ctx.fill();
    ctx.strokeStyle=rgba(b,1);ctx.lineWidth=10;ctx.lineCap="round";for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*28+x*0.2,-400);ctx.quadraticCurveTo(s*34,y0+30,s*(sw-28),y0+8);ctx.stroke();}
    ctx.fillStyle="rgba(200,190,170,1)";for(const s of [-1,1]){ctx.beginPath();ctx.arc(s*28+x*0.2,-398,4,0,TAU);ctx.fill();}ctx.restore();}
  if(T_.cw_strap){const s_=T_.cw_strap;ctx.strokeStyle=rgba(s_,1);ctx.lineWidth=11;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(sw-16,y0+12);ctx.lineTo(-hw+4,-276);ctx.stroke();
    ctx.strokeStyle=rgba(lighten(s_,0.2),0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sw-18,y0+10);ctx.lineTo(-hw+2,-279);ctx.stroke();
    // the bag, at the left hip
    ctx.beginPath();rr(ctx,-hw-34,-292,74,70,8);litFill(ctx,s_,-hw-34,-292,-hw+40,-222);seam(ctx,s_,0.5);ctx.fillStyle=rgba(darken(s_,0.18),1);ctx.beginPath();rr(ctx,-hw-34,-292,74,26,8);ctx.fill();
    ctx.fillStyle="rgba(214,182,110,1)";ctx.fillRect(-hw+0,-272,8,10);}}
// a long coat to the knee: a grocer's white shop coat, or a street coat, buttoned, with lapels and a pocket
function cw_longCoat(ctx,P,br,sh){const T_=P.top,c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br,hem=-150;
  const path=()=>{ctx.beginPath();ctx.moveTo(-15,y0);ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-2,y0+28,-sw-2,y0+50);
    ctx.bezierCurveTo(-sw-2,y0+84,-hw-4,-352,-hw-1,-326);ctx.quadraticCurveTo(-hw-10+sh*0.4,-240,-hw-14+sh*0.5,hem);ctx.lineTo(hw+14+sh*0.5,hem);ctx.quadraticCurveTo(hw+10+sh*0.4,-240,hw+1,-326);
    ctx.bezierCurveTo(hw+4,-352,sw+2,y0+84,sw+2,y0+50);ctx.quadraticCurveTo(sw+2,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,15,y0);ctx.closePath();};
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);ctx.save();path();ctx.clip();
  ctx.fillStyle=rgba(T_.inner,1);ctx.beginPath();ctx.moveTo(-15,y0-2);ctx.lineTo(15,y0-2);ctx.lineTo(sh*0.25,y0+50);ctx.closePath();ctx.fill();
  if(T_.cw_tie){ctx.fillStyle=rgba(T_.cw_tie,1);ctx.beginPath();ctx.moveTo(-5,y0+4);ctx.lineTo(5,y0+4);ctx.lineTo(4+sh*0.2,y0+38);ctx.lineTo(sh*0.2,y0+44);ctx.lineTo(-4+sh*0.2,y0+38);ctx.closePath();ctx.fill();}
  for(const s of [-1,1]){ctx.fillStyle=rgba(darken(c,0.08),1);ctx.beginPath();ctx.moveTo(s*14,y0-4);ctx.lineTo(s*32,y0+4);ctx.lineTo(s*36,y0+34);ctx.lineTo(s*22,y0+44);ctx.lineTo(s*6+sh*0.3,-350);ctx.lineTo(s*20,y0+26);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(darken(c,0.3),0.4);ctx.lineWidth=1.4;ctx.stroke();}
  ctx.strokeStyle=rgba(darken(c,0.35),0.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sh*0.3,-350);ctx.lineTo(sh*0.5+2,hem);ctx.stroke();
  ctx.fillStyle=rgba(darken(c,0.4),0.8);for(const yy of [-336,-296,-256,-216])ell(ctx,sh*0.35-8,yy,3.2,3.2),ctx.fill();
  // a breast pocket, a pencil in a grocer's
  ctx.strokeStyle=rgba(darken(c,0.3),0.5);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-50,-398);ctx.lineTo(-24,-398);ctx.stroke();
  if(c[0]>240){ctx.fillStyle="rgba(214,170,60,1)";ctx.fillRect(-42,-416,5,20);ctx.fillStyle="rgba(60,60,70,1)";ctx.fillRect(-34,-412,4,16);}
  ctx.restore();}
// hats: a police officer's peaked cap with its badge, a postman's without one, a road worker's flat cap, a man's hat with a brim
head=function(ctx,P,E,po,t){_cwHead(ctx,P,E,po,t);const h=P.hat;if(!h||h.slice(0,3)!=="cw_")return;const c=P.hatC||[60,60,70];
  if(h==="cw_peak"||h==="cw_post"){const top=h==="cw_peak"?-94:-84;ctx.beginPath();ctx.moveTo(-45,-44);ctx.bezierCurveTo(-54,-60,-62,top+12,-56,top+2);ctx.quadraticCurveTo(0,top-10,56,top+2);
      ctx.bezierCurveTo(62,top+12,54,-60,45,-44);ctx.closePath();litFill(ctx,c,-60,top-8,60,-44);seam(ctx,c,0.5);
    ctx.fillStyle=rgba(h==="cw_peak"?[24,24,30]:darken(c,0.35),1);ctx.beginPath();ctx.moveTo(-46,-52);ctx.quadraticCurveTo(0,-46,46,-52);ctx.lineTo(45,-40);ctx.quadraticCurveTo(0,-34,-45,-40);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba([22,22,28],1);ctx.beginPath();ctx.moveTo(-42,-41);ctx.quadraticCurveTo(0,-34,42,-41);ctx.quadraticCurveTo(36,-26,0,-24);ctx.quadraticCurveTo(-36,-26,-42,-41);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.3)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-26,-33);ctx.quadraticCurveTo(0,-29,22,-33);ctx.stroke();
    if(h==="cw_peak"){ctx.fillStyle="rgba(222,186,104,1)";ell(ctx,0,-64,8,10);ctx.fill();ctx.fillStyle="rgba(150,116,50,1)";ell(ctx,0,-64,3.5,5);ctx.fill();}}
  if(h==="cw_flat"){ctx.beginPath();ctx.moveTo(-47,-34);ctx.bezierCurveTo(-54,-70,-30,-84,4,-84);ctx.bezierCurveTo(40,-84,56,-66,50,-38);ctx.quadraticCurveTo(0,-42,-47,-34);ctx.closePath();litFill(ctx,c,-54,-84,56,-34);seam(ctx,c,0.45);
    ctx.fillStyle=rgba(darken(c,0.3),1);ctx.beginPath();ctx.moveTo(-44,-38);ctx.quadraticCurveTo(0,-46,48,-40);ctx.quadraticCurveTo(40,-26,0,-26);ctx.quadraticCurveTo(-38,-28,-44,-38);ctx.closePath();ctx.fill();}
  if(h==="cw_trilby"){ctx.beginPath();ctx.ellipse(0,-46,72,13,0,0,TAU);litFill(ctx,c,-72,-59,72,-33);seam(ctx,c,0.45);
    ctx.beginPath();ctx.moveTo(-42,-48);ctx.bezierCurveTo(-46,-92,-16,-104,0,-94);ctx.bezierCurveTo(16,-104,46,-92,42,-48);ctx.quadraticCurveTo(0,-40,-42,-48);ctx.closePath();litFill(ctx,c,-46,-104,46,-44);seam(ctx,c,0.45);
    ctx.fillStyle=rgba(darken(c,0.4),1);ctx.beginPath();ctx.moveTo(-42,-58);ctx.quadraticCurveTo(0,-50,42,-58);ctx.lineTo(42,-49);ctx.quadraticCurveTo(0,-41,-42,-49);ctx.closePath();ctx.fill();}};
// white gloves: the hands drawn in the glove's colour, and a gauntlet's flared cuff over the sleeve's end
arm=function(ctx,P,s,a,br,po){if(!P.cw_glove)return _cwArm(ctx,P,s,a,br,po);const sk=P.skin;P.skin=P.cw_glove;try{_cwArm(ctx,P,s,a,br,po);}finally{P.skin=sk;}
  const sw=P.build.sh,sx=s*(sw-12),sy=-416+br,e=[sx+s*Math.sin(a[0])*108,sy+Math.cos(a[0])*108],d=[s*Math.sin(a[1]),Math.cos(a[1])],w=[e[0]+d[0]*100,e[1]+d[1]*100],n=[-d[1],d[0]],
    p0=[w[0]-d[0]*30,w[1]-d[1]*30],p1=[w[0]+d[0]*4,w[1]+d[1]*4];
  ctx.beginPath();ctx.moveTo(p0[0]+n[0]*14,p0[1]+n[1]*14);ctx.lineTo(p1[0]+n[0]*19,p1[1]+n[1]*19);ctx.lineTo(p1[0]-n[0]*19,p1[1]-n[1]*19);ctx.lineTo(p0[0]-n[0]*14,p0[1]-n[1]*14);ctx.closePath();
  litFill(ctx,P.cw_glove,Math.min(p0[0],p1[0])-20,Math.min(p0[1],p1[1])-20,Math.max(p0[0],p1[0])+20,Math.max(p0[1],p1[1])+20);seam(ctx,[200,200,196],0.4);};
