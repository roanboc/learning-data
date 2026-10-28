/* ===== Where each piece lives: the opening's places =====
   Korea under the Joseon kings, painted the series' way (master data's wash.js and people.js, the series' rooms.js and people.js): a
   hall of the court in the morning, seen from beside the king's seat; the office that makes a reign's annals from the historians'
   notes; the printers' room; the books laid in their chests; a road through the hills; Jeonju's archive, a raised hall inside its
   walls; a mountain path among pines; a cave's mouth at night, in summer and in snow; an archive high in the mountains, its books
   aired in the sun; and today, a long shelf of the books and a reader in a library. The archives are also small views, pinned on paper
   like a map (oh_view). Nothing on screen is in Korean or Chinese: writing is columns of marks too small to read, and the corner names
   the place. The places are painted once and kept (the series' finish.js); what moves is drawn every frame. Every name starts with oh_
   or OH, because every file of the film shares one script. */

/* ---------- the opening's colours ---------- */
// columns and beams of red-brown wood, white plaster, grey tiles, the soft green-grey under the eaves; stone, wooden floors, paper
// doors; the hills' pines and their red bark, far ridges in blue-grey; night and a fire; the chests, their brass, the books' covers
const OH={wood:[150,76,58],woodDk:[104,54,42],woodLt:[186,116,88],plaster:[238,230,212],tile:[94,98,108],tileDk:[62,64,74],tileLt:[138,142,152],
  eave:[124,142,130],stone:[200,192,176],stoneDk:[150,142,128],maru:[204,166,120],maruDk:[152,114,80],brick:[178,172,160],hanji:[248,243,228],
  lattice:[134,98,70],pine:[66,98,74],pineDk:[44,70,54],pineLt:[112,140,96],bark:[156,92,64],far:[160,176,190],mid:[124,150,136],near:[100,128,94],
  earth:[200,174,136],earthDk:[162,134,98],night:[34,40,64],fire:[255,176,84],snow:[246,248,252],chest:[116,74,50],chestDk:[80,52,36],
  brass:[204,168,96],cover:[216,182,114],coverDk:[176,140,80],cloth:[204,152,82],paper:[250,246,234],ink:[54,48,46],smoke:[118,112,112],
  panel:[176,140,106],rock:[150,146,138],trunk:[120,102,88],leaf:[96,130,82],maple:[[204,84,52],[222,128,58],[188,64,48],[214,156,64]]};
// a place painted at twice the frame's size, for the shots that move in close (its painter draws in frame coordinates)
function oh_hi(key,paint){return wc_kept("ohHi:"+key,W*2,H*2,q=>{q.scale(2,2);paint(q);});}
const oh_placeHi=key=>oh_hi(key,WC_PLACES[key]);

/* ---------- hills, pines and buildings ---------- */
// a ridge of hills, f(x) its line, and mist rising from its foot: a band of paper over the lower part, so the next ridge stands clear
function oh_ridge(ctx,f,col,depth,seed,mist){wc_land(ctx,f,col,depth,{seed,line:false});if(!mist)return;let lo=1e9;for(let x=0;x<=W;x+=40)lo=Math.min(lo,f(x));
  const y0=lo+mist[0],y1=lo+mist[1],g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(WC_PAPER,0));g.addColorStop(1,rgba(WC_PAPER,mist[2]==null?0.85:mist[2]));
  ctx.fillStyle=g;ctx.fillRect(-60,y0,W+120,y1-y0+2+(mist[3]||0));}
// a hill's line: a few sines, their peaks sharpened, between y and y+h
function oh_hillF(y,h,seed,o){o=o||{};const R=wc_rng(seed),k=[R()*6,R()*6,R()*6],s=o.s||1;
  return x=>{const u=x/W;let v=0.5+0.28*Math.sin(u*TAU*0.9*s+k[0])+0.16*Math.sin(u*TAU*2.3*s+k[1])+0.07*Math.sin(u*TAU*6.1*s+k[2]);v=Math.pow(clamp(v,0,1.4),o.sharp||1.25);return y+h*(1-v);};}
// a pine of the hills: a trunk that leans and bends, red-brown and scaly, branches near the top, and flat, layered crowns, darker
// underneath and lit along the top. x, y: its foot; h: its height; o.lean, o.seed, o.depth (haze), o.col (the crowns')
function oh_pine(ctx,x,y,h,o){o=o||{};const R=wc_rng(o.seed||7),d=o.depth==null?1:o.depth,lean=(o.lean==null?R()-0.5:o.lean)*0.32,tw0=Math.max(1.4,h*0.034),col=o.col||OH.pine;
  const C=[];for(let i=0;i<=12;i++){const u=i/12;C.push([x+lean*h*u+Math.sin(u*4.2+R()*0.6)*h*0.035*u,y-h*0.8*u]);}
  const L=[],Rr=[];C.forEach(([px,py],i)=>{const w=lerp(tw0,tw0*0.38,i/12);L.push([px-w,py]);Rr.unshift([px+w,py]);});
  wc_wash(ctx,L.concat(Rr),OH.bark,{depth:d,kind:"trunk",line:d>0.7,lw:1.1,seed:(o.seed||7)+3});
  const n=3+Math.floor(R()*3),pads=[];
  for(let k=0;k<n;k++){const u=0.5+0.5*k/(n-1),p=C[Math.round(u*12)],side=k===n-1?(R()-0.5)*0.6:(k%2?1:-1),len=h*(0.12+R()*0.16)*(k===n-1?0.4:1),
      cx=p[0]+side*len,cy=p[1]-h*(0.02+R()*0.04),rw=h*(0.13+R()*0.09)*(k===n-1?1.2:1),rh=h*(0.045+R()*0.025);
    if(Math.abs(side)>0.3){ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.bark,d),0.9);ctx.lineWidth=Math.max(1,tw0*0.7);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p[0],p[1]);
      ctx.quadraticCurveTo((p[0]+cx)/2,p[1]-h*0.01,cx,cy+rh*0.4);ctx.stroke();ctx.restore();}
    pads.push([cx,cy,rw,rh]);}
  pads.sort((a,b)=>b[1]-a[1]).forEach(([cx,cy,rw,rh],i)=>{const pts=[];for(let j=0;j<22;j++){const a=j/22*TAU,r=1+0.16*Math.sin(a*5+i*1.7)+0.1*Math.sin(a*9+i);
      pts.push([cx+Math.cos(a)*rw*r,cy+Math.sin(a)*rh*r*(Math.sin(a)<0?0.75:1.15)]);}
    wc_wash(ctx,pts,mix(col,OH.pineDk,0.25),{depth:d,kind:"tree",line:false,seed:(o.seed||7)+11*i});
    if(d>0.4||o.snow){ctx.save();wc_tr(ctx,pts);ctx.clip();const g=ctx.createLinearGradient(0,cy-rh,0,cy+rh);g.addColorStop(0,rgba(wc_haze(OH.pineLt,d),0.55));g.addColorStop(0.5,rgba(OH.pineLt,0));
      ctx.fillStyle=g;ctx.fillRect(cx-rw*1.3,cy-rh*1.4,rw*2.6,rh*2.8);
      // snow lies along the top of each crown
      if(o.snow){ctx.fillStyle="rgba(238,242,250,0.92)";ctx.beginPath();ctx.ellipse(cx,cy-rh*0.75,rw*0.98,rh*0.55,0,0,TAU);ctx.fill();}ctx.restore();}});}
// a row of pines along a line f, between x0 and x1 (o.snow, o.col, as for one pine)
function oh_pines(ctx,f,x0,x1,step,h,depth,seed,o){const R=wc_rng(seed);for(let x=x0;x<x1;x+=step*(0.55+R()*0.9))oh_pine(ctx,x,f(x)+4,h*(0.7+R()*0.55),Object.assign({depth,seed:seed+Math.round(x),lean:(R()-0.5)*1.4},o||{}));}
// a mountain range's line: a few peaks, each rising up to h above y, steep near the top, with a little roughness along it
function oh_peaksF(y,h,seed,n){const R=wc_rng(seed),P=[];for(let i=0;i<(n||4);i++)P.push([R()*W*1.2-W*0.1,(0.45+R()*0.55)*h,240+R()*380]);
  return x=>{let v=0;for(const [px,ph,pw] of P){const u=Math.abs(x-px)/pw;if(u<1)v=Math.max(v,ph*Math.pow(1-u,1.35));}return y-v+7*Math.sin(x/53+seed)+4*Math.sin(x/23+seed*2);};}
// a broad-leaved tree, old and round (o.col: its leaves; o.autumn, a maple's reds and golds): a trunk that forks, and a crown of soft
// clumps, darker underneath and lit along the top, without an outline. x, y: its foot; h: its height
function oh_tree(ctx,x,y,h,o){o=o||{};const R=wc_rng(o.seed||11),d=o.depth==null?1:o.depth,tw=Math.max(2,h*0.035),cy=y-h*0.64,rx=h*0.36,ry=h*0.28;
  const pal=o.autumn?OH.maple:[o.col||OH.leaf],pick=()=>{const c=pal[Math.floor(R()*pal.length)];return o.autumn?mix(c,pal[Math.floor(R()*pal.length)],R()*0.4):mix(c,wc_lit(c,0.22),R()*0.7);};
  wc_wash(ctx,[[x-tw,y],[x-tw*0.7,y-h*0.42],[x-tw*2.2,y-h*0.66],[x-tw*1.2,y-h*0.68],[x,y-h*0.5],[x+tw*1.2,y-h*0.7],[x+tw*2.4,y-h*0.64],[x+tw*0.7,y-h*0.42],[x+tw,y]],OH.trunk,{depth:d,kind:"trunk",line:d>0.7,lw:1,seed:(o.seed||11)+1});
  const blob=(bx,by,r,sd)=>{const k=[R()*6,R()*6,R()*6],P=[];for(let i=0;i<28;i++){const a=i/28*TAU,q=1+0.12*Math.sin(a*5+k[0])+0.08*Math.sin(a*9+k[1])+0.05*Math.sin(a*13+k[2]);
    P.push([bx+Math.cos(a)*r*q,by+Math.sin(a)*r*q*(Math.sin(a)>0?0.72:0.9)]);}return P;};
  // small and far: one wash. Near: lobes of leaves round branches, each its own colour, lit from above, with a few bright dabs
  if(h<120){const crown=blob(x,cy,rx,0);wc_wash(ctx,crown,pick(),{depth:d,kind:"tree",line:false,seed:(o.seed||11)+3});ctx.save();wc_tr(ctx,crown);ctx.clip();
    const g=ctx.createLinearGradient(0,cy-ry,0,cy+ry);g.addColorStop(0,rgba(wc_haze(wc_lit(pal[0],0.4),d),0.45));g.addColorStop(1,rgba(wc_haze(wc_dim(pal[0],0.4),d),0.35));ctx.fillStyle=g;ctx.fillRect(x-rx*1.3,cy-ry*1.3,rx*2.6,ry*2.6);ctx.restore();return;}
  ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.trunk,d),0.95);ctx.lineCap="round";
  for(const [bx,by,lw] of [[-0.62,-0.2,tw*1.1],[0.58,-0.32,tw],[0.08,-0.8,tw*0.9],[-0.3,-0.6,tw*0.7]]){ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x,y-h*0.42);ctx.quadraticCurveTo(x+bx*rx*0.3,cy+ry*0.3,x+bx*rx,cy+by*ry);ctx.stroke();}ctx.restore();
  const n=6+Math.floor(R()*2),L=[];for(let i=0;i<n;i++){const a=(i/n)*TAU+R()*0.6;L.push([x+Math.cos(a)*rx*0.52,cy+Math.sin(a)*ry*0.5-ry*0.08,rx*(0.4+R()*0.14)]);}
  L.push([x+(R()-0.5)*rx*0.2,cy-ry*0.25,rx*0.46]);
  L.forEach(([bx,by,r],i)=>{const c=pick(),P=blob(bx,by,r);wc_wash(ctx,P,c,{depth:d,kind:"tree",line:false,seed:(o.seed||11)+5+i});ctx.save();wc_tr(ctx,P);ctx.clip();
    const g=ctx.createLinearGradient(bx-r*0.6,by-r,bx+r*0.4,by+r);g.addColorStop(0,rgba(wc_haze(wc_lit(c,0.42),d),0.55));g.addColorStop(0.5,rgba(c,0));g.addColorStop(1,rgba(wc_haze(wc_dim(c,0.45),d),0.5));
    ctx.fillStyle=g;ctx.fillRect(bx-r*1.3,by-r*1.3,r*2.6,r*2.6);
    for(let k=0;k<7;k++){const a=-Math.PI*0.5+(R()-0.5)*2.4,q=r*(0.45+R()*0.45);ctx.fillStyle=rgba(wc_haze(wc_lit(c,0.3+R()*0.2),d),0.45);ctx.beginPath();ctx.ellipse(bx+Math.cos(a)*q,by+Math.sin(a)*q*0.8,r*0.16,r*0.11,a,0,TAU);ctx.fill();}
    if(o.snow&&by<cy){ctx.fillStyle="rgba(240,244,250,0.9)";ctx.beginPath();ctx.ellipse(bx,by-r*0.75,r*0.8,r*0.32,0,0,TAU);ctx.fill();}ctx.restore();});}
// a rock: a lumpy top, flat where it sits, lit along the top and darker at its foot; o.snow puts a cap of snow on it
function oh_rock(ctx,x,y,r,o){o=o||{};const R=wc_rng(o.seed||17),d=o.depth==null?1:o.depth,col=o.col||OH.rock,pts=[];
  for(let i=0;i<=12;i++){const a=Math.PI+i/12*Math.PI,k=0.82+R()*0.3;pts.push([x+Math.cos(a)*r*1.15*k,y+Math.sin(a)*r*0.8*k*(0.75+0.25*Math.sin(i/12*Math.PI))]);}
  pts.push([x+r*1.1,y],[x-r*1.1,y]);wc_contact(ctx,x-r*1.2,x+r*1.2,y+2,d,0.3);wc_wash(ctx,pts,col,{depth:d,kind:"build",lw:1.1,seed:o.seed||17});
  ctx.save();wc_tr(ctx,pts);ctx.clip();const g=ctx.createLinearGradient(0,y-r*0.8,0,y);g.addColorStop(0,rgba(wc_haze(wc_lit(col,0.35),d),0.55));g.addColorStop(0.5,rgba(col,0));g.addColorStop(1,rgba(wc_haze(wc_dim(col,0.4),d),0.45));
  ctx.fillStyle=g;ctx.fillRect(x-r*1.3,y-r,r*2.6,r*1.1);ctx.strokeStyle=rgba(wc_haze(wc_dim(col,0.45),d),0.5);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x-r*0.2,y-r*0.6);ctx.lineTo(x+r*0.05,y-r*0.3);ctx.lineTo(x-r*0.1,y);ctx.stroke();
  if(o.snow){ctx.fillStyle="rgba(242,245,250,0.95)";ctx.beginPath();ctx.ellipse(x,y-r*0.78,r*0.95,r*0.22,0,0,TAU);ctx.fill();}ctx.restore();}
// a tiled roof from the front, hipped and gabled: its eave curves and lifts at the corners, the hips run up to a short ridge whose ends
// turn up; rows of tiles, the eave's round end tiles, and the shadow under the eave with the rafters' ends. x0..x1 the eave, ye its line
// at the middle, yr the ridge's
function oh_roof(ctx,x0,x1,ye,yr,o){o=o||{};const w=x1-x0,d=o.depth==null?1:o.depth,lift=o.lift==null?w*0.045:o.lift,ov=w*0.02,ri=o.ri==null?0.24:o.ri,
    r0=x0+w*ri,r1=x1-w*ri,col=o.col||OH.tile,eaveY=u=>ye-lift*Math.pow(Math.abs(u-0.5)*2,2.6);
  const eave=[];for(let i=0;i<=36;i++){const u=i/36;eave.push([lerp(x0-ov,x1+ov,u),eaveY(u)]);}
  const hipL=[],hipR=[];for(let i=1;i<=10;i++){const u=i/10,c=Math.sin(u*Math.PI)*w*0.025;hipL.push([lerp(x0-ov,r0,u)+c,lerp(eaveY(0),yr,u)+c*0.4]);hipR.push([lerp(x1+ov,r1,u)-c,lerp(eaveY(1),yr,u)+c*0.4]);}
  // the shadow under the eave, and the rafters' ends in it
  const ud=Math.max(6,(ye-yr)*0.16),und=eave.concat(eave.slice().reverse().map(([x,y])=>[x+(x<(x0+x1)/2?w*0.012:-w*0.012),y+ud]));
  wc_wash(ctx,und,o.under||OH.eave,{depth:d,kind:"build",line:false,seed:(o.seed||5)+1});
  if(d>0.5){ctx.save();ctx.fillStyle=rgba(wc_haze(wc_lit(OH.eave,0.35),d),0.8);const n=Math.round(w/16);for(let i=1;i<n;i++){const u=i/n,x=lerp(x0,x1,u),y=eaveY(u)+ud*0.45;
      ctx.beginPath();ctx.arc(x,y,Math.max(1.4,w*0.0035),0,TAU);ctx.fill();}ctx.restore();}
  const roof=[[x0-ov,eaveY(0)],...hipL,[r1,yr],...hipR.slice().reverse()].concat(eave.slice().reverse().slice(1));
  wc_wash(ctx,roof,col,{depth:d,kind:"build",lw:1.4,seed:(o.seed||5)+2});
  // the rows of tiles, down the roof, bending with it
  ctx.save();wc_tr(ctx,roof);ctx.clip();ctx.strokeStyle=rgba(wc_haze(wc_dim(col,0.35),d),0.55);ctx.lineWidth=Math.max(1,w*0.0026);const n=Math.round(w/(o.tileW||13));
  for(let i=1;i<n;i++){const u=i/n,xe=lerp(x0-ov,x1+ov,u),xr=lerp(r0-w*0.04,r1+w*0.04,u);ctx.beginPath();ctx.moveTo(xr,yr);ctx.quadraticCurveTo(lerp(xr,xe,0.6),lerp(yr,eaveY(u),0.62),xe,eaveY(u));ctx.stroke();}
  const g=ctx.createLinearGradient(0,yr,0,ye);g.addColorStop(0,rgba(wc_lit(col,0.25),0.35));g.addColorStop(1,rgba(wc_dim(col,0.3),0.25));ctx.fillStyle=g;ctx.fillRect(x0-ov,yr-4,w+2*ov,ye-yr+8);ctx.restore();
  // the eave's end tiles, a dark band
  ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.tileDk,d),0.85);ctx.lineWidth=Math.max(2,(ye-yr)*0.05);ctx.beginPath();eave.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();
  // the ridge, its ends turned up
  const rh=Math.max(4,(ye-yr)*0.1),ext=w*0.03;wc_wash(ctx,[[r0-ext,yr-rh*1.6],[r0,yr-rh*0.7],[r1,yr-rh*0.7],[r1+ext,yr-rh*1.6],[r1+ext*0.9,yr+rh*0.2],[r0-ext*0.9,yr+rh*0.2]],OH.tileDk,{depth:d,kind:"build",lw:1.2,seed:(o.seed||5)+3});}
// a hall from the front on its stone platform: bays between red-brown columns, paper doors with a grid of lattice in each (o.open: the
// bays standing open, dark inside), a band of brackets under the eaves, and the roof. x, w: its extent; base: the platform's top; hc:
// the columns' height. o.two: two storeys, the lower one plastered with small vents, as the archives were built, off the damp ground
function oh_hall(ctx,x,w,base,hc,o){o=o||{};const d=o.depth==null?1:o.depth,n=o.bays||3,ph=o.ph==null?hc*0.22:o.ph,cw=Math.max(3,w*0.018),bay=w/n,seed=o.seed||9;
  // the platform, and steps up to the middle bay
  wc_part(ctx,wc_rect(x-w*0.05,base,w*1.1,ph),OH.stone,d,{seed,lw:1.2});
  if(d>0.5){ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.stoneDk,d),0.5);ctx.lineWidth=1.2;for(let i=1;i<3;i++){ctx.beginPath();ctx.moveTo(x-w*0.05,base+ph*i/3);ctx.lineTo(x+w*1.05,base+ph*i/3);ctx.stroke();}ctx.restore();}
  if(o.steps!==false)for(let i=0;i<3;i++)wc_flat(ctx,wc_rect(x+w/2-bay*0.32+i*bay*0.03,base+ph*(i+1)/3-ph*0.33,bay*0.64-i*bay*0.06,ph*0.33),wc_lit(OH.stone,0.15),d,"trim");
  const top=base-hc;
  // walls in each bay: o.two, plaster below and doors above a ledge; else doors to the floor
  for(let i=0;i<n;i++){const bx=x+i*bay+cw,bw=bay-2*cw,open=o.open&&o.open.includes(i);
    if(o.two){const mid=base-hc*0.42;wc_part(ctx,wc_rect(bx,mid,bw,base-mid),OH.plaster,d,{seed:seed+i,lw:1});
      if(d>0.5)for(let v=0;v<2;v++)wc_flat(ctx,wc_rect(bx+bw*(0.22+v*0.4),mid+(base-mid)*0.4,bw*0.16,(base-mid)*0.22),OH.lattice,d,"trim");
      wc_flat(ctx,wc_rect(bx-cw,mid-hc*0.04,bw+2*cw,hc*0.04),OH.woodDk,d,"trim");oh_doors(ctx,bx,top+hc*0.1,bw,mid-hc*0.04-top-hc*0.1,d,open,seed+i);}
    else oh_doors(ctx,bx,top+hc*0.12,bw,hc*0.88,d,open,seed+i);}
  // the columns and the beam over them
  for(let i=0;i<=n;i++){const cx=x+i*bay;wc_part(ctx,wc_rect(cx-cw,top,2*cw,hc),OH.wood,d,{seed:seed+20+i,lw:1});}
  wc_part(ctx,wc_rect(x-cw*1.5,top,w+cw*3,hc*0.1),OH.woodDk,d,{seed:seed+31,lw:1});
  // the band of brackets under the eaves: blocks over each column and between, on the green-grey
  const bk=hc*0.16;wc_wash(ctx,wc_rect(x-w*0.04,top-bk,w*1.08,bk),OH.eave,{depth:d,kind:"build",seed:seed+33,lw:1});
  if(d>0.45){const m=n*3;for(let i=0;i<=m;i++){const cx=x+w*i/m;wc_flat(ctx,wc_rect(cx-bk*0.32,top-bk*0.85,bk*0.64,bk*0.7),wc_dim(OH.eave,0.25),d,"trim");}}
  oh_roof(ctx,x-w*(o.ov||0.16),x+w*(1+(o.ov||0.16)),top-bk,top-bk-(o.rh||hc*0.62),{depth:d,seed:seed+40,lift:o.lift});}
// doors of paper in a frame: lattice in a grid over the paper, a wooden panel below; open, the bay is dark inside
function oh_doors(ctx,x,y,w,h,d,open,seed){wc_part(ctx,wc_rect(x,y,w,h),open?[70,52,44]:OH.hanji,d,{seed,lw:1});if(open||d<0.45)return;const n=Math.max(2,Math.round(w/(h*0.42)));
  ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.lattice,d),0.7);ctx.lineWidth=Math.max(1,w*0.012);for(let i=1;i<n;i++){ctx.beginPath();ctx.moveTo(x+w*i/n,y);ctx.lineTo(x+w*i/n,y+h);ctx.stroke();}
  ctx.lineWidth=Math.max(0.8,w*0.006);const cols=n*3,rows=Math.round(h*0.82/(w/cols));for(let i=1;i<cols;i++){if(i%3===0)continue;ctx.beginPath();ctx.moveTo(x+w*i/cols,y);ctx.lineTo(x+w*i/cols,y+h*0.8);ctx.stroke();}
  for(let j=1;j<rows;j++){ctx.beginPath();ctx.moveTo(x,y+h*0.8*j/rows);ctx.lineTo(x+w,y+h*0.8*j/rows);ctx.stroke();}ctx.restore();
  wc_flat(ctx,wc_rect(x,y+h*0.8,w,h*0.2),OH.panel,d,"trim");}
// a compound's wall: stone at its foot, plaster above, a tiled cap; x0..x1 at y (its foot), h high; o.gate: [x, w], a roofed gate in it
function oh_wall(ctx,x0,x1,y,h,o){o=o||{};const d=o.depth==null?1:o.depth,seed=o.seed||13;wc_part(ctx,wc_rect(x0,y-h,x1-x0,h),OH.plaster,d,{seed,lw:1});
  wc_flat(ctx,wc_rect(x0,y-h*0.35,x1-x0,h*0.35),OH.stoneDk,d,"trim");
  if(d>0.5){ctx.save();ctx.strokeStyle=rgba(wc_haze(wc_dim(OH.stoneDk,0.3),d),0.45);ctx.lineWidth=1;const R=wc_rng(seed);for(let xx=x0;xx<x1;xx+=h*0.3+R()*h*0.2){ctx.beginPath();ctx.moveTo(xx,y-h*0.35);ctx.lineTo(xx+R()*4,y);ctx.stroke();}ctx.restore();}
  wc_wash(ctx,[[x0-h*0.25,y-h],[x0+h*0.15,y-h*1.32],[x1-h*0.15,y-h*1.32],[x1+h*0.25,y-h],[x1+h*0.2,y-h*0.94],[x0-h*0.2,y-h*0.94]],OH.tile,{depth:d,kind:"build",lw:1,seed:seed+1});
  if(o.gate){const [gx,gw]=o.gate;wc_part(ctx,wc_rect(gx-gw/2,y-h*1.5,gw,h*1.5),OH.wood,d,{seed:seed+2,lw:1});wc_part(ctx,wc_rect(gx-gw/2+gw*0.1,y-h*1.3,gw*0.8,h*1.3),[86,62,50],d,{seed:seed+3,lw:1});
    oh_roof(ctx,gx-gw*0.85,gx+gw*0.85,y-h*1.5,y-h*1.5-gw*0.42,{depth:d,seed:seed+4,ri:0.3});}}
// a hall inside its walls: the wall in front hides the hall's foot, so only the platform's top shows over it
function oh_compound(ctx,cx,base,w,o){o=o||{};const d=o.depth==null?1:o.depth,hc=o.hc||w*0.3;
  oh_hall(ctx,cx-w/2,w,base,hc,Object.assign({depth:d,seed:o.seed},o.hall||{}));
  oh_wall(ctx,cx-w*0.95,cx+w*0.95,base+hc*(o.wallDy||0.5),hc*(o.wallH||0.42),{depth:d,seed:(o.seed||1)+50,gate:o.gate===false?null:[cx,w*0.16]});}

/* ---------- the court: a hall of the palace in the morning ---------- */
// Seen from beside the king's seat, down the hall to its doors: a floor of square stone tiles, two rows of red-brown columns under
// dark beams, the paper doors at the far end bright with the morning; the seat is behind us. The officials stand in two rows down the hall and the two historians sit at the left with their low desks, drawn
// every frame. OH_CT: the eye (f, the horizon, its height), and oh_ctP(X, Y, Z), a point of the hall, in metres, on the frame
const OH_CT={f:820,hz:430,eye:1.6,far:26,hw:9.5,top:5.6,cols:[7,11,15,19,23]};
const oh_ctP=(X,Y,Z)=>[960+X*OH_CT.f/Z,OH_CT.hz-(Y-OH_CT.eye)*OH_CT.f/Z];
function oh_paintCourt(ctx){const C=OH_CT,P=oh_ctP,R=wc_rng(501),F=C.far;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const [fl,ft]=P(-C.hw,C.top,F),[fr,fb]=P(C.hw,0,F);
  // the ceiling, dark wood, its beams running to the doors
  wc_wash(ctx,[P(-C.hw,C.top,F),P(C.hw,C.top,F),P(C.hw,C.top,1.2),[W+60,-60],[-60,-60],P(-C.hw,C.top,1.2)],[96,66,52],{kind:"build",line:false,seed:503});
  ctx.save();ctx.strokeStyle=rgba([60,40,32],0.55);ctx.lineCap="round";for(const X of [-6.4,-4.2,-2,0,2,4.2,6.4]){const a=P(X,C.top,F),b=P(X,C.top,2.2);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  // the side walls: plaster between wooden posts, a rail along them at the height of a door
  for(const s of [-1,1]){const wall=[P(s*C.hw,0,F),P(s*C.hw,C.top,F),P(s*C.hw,C.top,1.2),P(s*C.hw,0,1.2)];wc_wash(ctx,wall,[216,202,180],{kind:"build",line:false,seed:507+s});
    for(const Z of [9,13,17,21,25]){const a=P(s*C.hw,0,Z),b=P(s*C.hw,C.top,Z),r=0.22*C.f/Z;wc_part(ctx,[[a[0]-r,a[1]],[b[0]-r,b[1]],[b[0]+r,b[1]],[a[0]+r,a[1]]],OH.woodDk,1,{seed:509+Z,lw:1});}
    const r0=P(s*C.hw,2.6,F),r1=P(s*C.hw,2.6,1.2),r2=P(s*C.hw,2.4,1.2),r3=P(s*C.hw,2.4,F);wc_wash(ctx,[r0,r1,r2,r3],OH.woodDk,{kind:"build",line:false,seed:511+s});}
  // the far wall: five bays of paper doors, bright with the morning outside
  const bays=5;for(let i=0;i<bays;i++){const x0=lerp(fl,fr,i/bays),x1=lerp(fl,fr,(i+1)/bays);wc_part(ctx,wc_rect(x0,ft,x1-x0,fb-ft),OH.wood,1,{seed:511+i,lw:1});
    oh_doors(ctx,x0+5,ft+(fb-ft)*0.18,x1-x0-10,(fb-ft)*0.82,1,false,513+i);}
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,(ft+fb)/2+20,520,[255,236,196],0.55);ctx.restore();
  // the floor of square stone tiles, in rows to the doors, lighter where the morning falls on it
  const floor=[[fl,fb],[fr,fb],P(C.hw,0,1.2),P(-C.hw,0,1.2)];wc_wash(ctx,floor,OH.brick,{kind:"ground",line:false,seed:515});
  ctx.save();wc_tr(ctx,floor);ctx.clip();ctx.strokeStyle=rgba(wc_dim(OH.brick,0.35),0.42);ctx.lineWidth=1.3;
  for(let X=-12;X<=12;X+=0.9){const a=P(X,0,F),b=P(X,0,1.2);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  for(let Z=F;Z>1.4;Z-=Z*0.075){const y=P(0,0,Z)[1];ctx.beginPath();ctx.moveTo(-60,y);ctx.lineTo(W+60,y);ctx.stroke();}
  const lg=ctx.createRadialGradient(960,fb+60,20,960,fb+120,620);lg.addColorStop(0,"rgba(255,244,214,0.5)");lg.addColorStop(1,"rgba(255,244,214,0)");ctx.globalCompositeOperation="screen";ctx.fillStyle=lg;ctx.fillRect(0,fb,W,H-fb);
  // light from the doors, lying along the floor towards us
  for(const X of [-3.2,-0.6,1.9]){const q=[P(X,0,F),P(X+1.1,0,F),P(X*2.4+2.4,0,4.5),P(X*2.4-0.2,0,4.5)];ctx.fillStyle="rgba(255,240,204,0.13)";wc_tr(ctx,q);ctx.fill();}ctx.restore();
  // the columns, far ones first, each on its stone base, and the beams across them
  for(const Z of C.cols.slice().reverse()){for(const X of [-8.4,-4.2,4.2,8.4]){const [x,yb]=P(X,0,Z),[,yt]=P(X,C.top,Z),r=0.34*C.f/Z;
      wc_part(ctx,wc_rect(x-r*1.35,yb-r*0.55,r*2.7,r*0.7),OH.stone,1,{seed:517+Z+X,lw:1});
      wc_part(ctx,wc_rect(x-r,yt,2*r,yb-r*0.5-yt),OH.wood,1,{seed:521+Z*3+X,lw:1.2});
      ctx.save();const g=ctx.createLinearGradient(x-r,0,x+r,0);g.addColorStop(0,"rgba(255,226,190,0.22)");g.addColorStop(0.4,"rgba(255,226,190,0)");g.addColorStop(1,"rgba(40,20,16,0.22)");
      ctx.fillStyle=g;ctx.fillRect(x-r,yt,2*r,yb-r*0.5-yt);ctx.restore();}
    const a=P(-C.hw,C.top,Z),b=P(C.hw,C.top-0.5,Z);wc_part(ctx,wc_rect(a[0],a[1],b[0]-a[0],b[1]-a[1]),OH.woodDk,1,{seed:531+Z,lw:1});}
}
// where the officials stand: two rows down the hall, facing the seat ([X, Z])
const OH_ROWS=[[-1.7,5.6],[1.7,5.6],[-1.7,7.4],[1.7,7.4],[-1.7,9.2],[1.7,9.2],[-1.7,11],[1.7,11]];
// where the two historians sit at the left, near the seat, with their low desks
const OH_HIST=[[-3.3,3.4],[-2.0,4.6]];

/* ---------- the office that makes the annals, and its printers ---------- */
// a room's back wall of paper doors between posts, bright with the day, a beam over them, and a floor of boards running away from us;
// o.solid: the sections between posts that are plaster, without doors
function oh_room(ctx,fy,o){o=o||{};ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);const posts=o.posts||[110,600,1320,1810];
  wc_wash(ctx,wc_rect(-40,-40,W+80,fy+40),o.wall||[222,208,186],{kind:"plaster",line:false,seed:(o.seed||1)+1});
  for(let i=0;i<posts.length-1;i++){if(o.solid&&o.solid.includes(i))continue;const x0=posts[i]+26,x1=posts[i+1]-26,n=Math.max(2,Math.round((x1-x0)/260));for(let k=0;k<n;k++){const dx=(x1-x0)/n;
      oh_doors(ctx,x0+k*dx+4,o.doorY||170,dx-8,fy-(o.doorY||170)-8,1,false,(o.seed||1)+10+i*5+k);}}
  ctx.save();ctx.globalCompositeOperation="screen";for(let i=0;i<posts.length-1;i++)if(!(o.solid&&o.solid.includes(i)))wc_glowAt(ctx,(posts[i]+posts[i+1])/2,(fy+(o.doorY||170))/2,420,[255,240,206],0.35);ctx.restore();
  posts.forEach((x,i)=>wc_part(ctx,wc_rect(x-24,-40,48,fy+48),OH.wood,1,{seed:(o.seed||1)+30+i,lw:1.2}));
  wc_part(ctx,wc_rect(-40,(o.doorY||170)-58,W+80,46),OH.woodDk,1,{seed:(o.seed||1)+40,lw:1.2});
  const vx=960,vy=o.vy||220;wc_wash(ctx,wc_rect(-40,fy,W+80,H-fy+40),OH.maru,{kind:"ground",line:false,seed:(o.seed||1)+50});
  ctx.save();ctx.strokeStyle=rgba(OH.maruDk,0.45);ctx.lineWidth=1.6;for(let i=-14;i<=14;i++){const x=vx+i*140;ctx.beginPath();ctx.moveTo(lerp(vx,x,(fy-vy)/(H-vy)),fy);ctx.lineTo(x,H+10);ctx.stroke();}
  const g=ctx.createLinearGradient(0,fy,0,H);g.addColorStop(0,"rgba(255,244,220,0.28)");g.addColorStop(1,"rgba(255,244,220,0)");ctx.globalCompositeOperation="screen";ctx.fillStyle=g;ctx.fillRect(0,fy,W,H-fy);ctx.restore();
  wc_flat(ctx,wc_rect(-40,fy-6,W+80,10),OH.woodDk,1,"trim");}
// the office: its back wall and floor; the long low table is its front layer (oh_officeTable), drawn over the members sitting behind it
const OH_OF={fy:600,tb:[300,1620,676,712,800]};
function oh_paintOffice(ctx){oh_room(ctx,OH_OF.fy,{seed:601,vy:260,solid:[0]});
  // shelves on the plaster at the left, with bundles of notes tied with cord
  wc_part(ctx,wc_rect(140,404,330,14),OH.woodDk,1,{seed:611,lw:1});wc_part(ctx,wc_rect(140,520,330,14),OH.woodDk,1,{seed:612,lw:1});
  for(let i=0;i<5;i++){oh_bundle(ctx,170+i*60,404,48,40,613+i);oh_bundle(ctx,176+i*58,520,46,46,623+i);}}
function oh_officeTable(){return wc_kept("ohOfficeTable",W,H,c=>{const [x0,x1,t0,t1,ft]=OH_OF.tb;
  wc_part(c,[[x0,t0],[x1,t0],[x1+24,t1],[x0-24,t1]],OH.maru,1,{seed:631,lw:1.4});wc_part(c,wc_rect(x0-24,t1,x1-x0+48,22),OH.maruDk,1,{seed:633,lw:1.2});
  for(const lx of [x0+20,x1-20,(x0+x1)/2])wc_part(c,wc_rect(lx-12,t1+22,24,ft-t1-22),OH.maruDk,1,{seed:635+lx,lw:1});
  // on it: bundles of the historians' notes, an inkstone, brushes on a rest
  for(const [bx,bw,bh] of [[420,96,40],[560,110,52],[1240,100,44],[1380,96,36]])oh_bundle(c,bx,t0+18,bw,bh,641+bx);
  wc_part(c,[[880,t0+4],[1000,t0+4],[1006,t0+22],[874,t0+22]],[70,70,76],1,{seed:651,lw:1});wc_flat(c,[[892,t0+8],[930,t0+8],[930,t0+18],[892,t0+18]],[30,30,36],1,"trim");
  for(let i=0;i<3;i++){c.save();c.strokeStyle=rgba([150,110,70],1);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(1040+i*16,t0+6);c.lineTo(1100+i*16,t0-4);c.stroke();c.restore();}});}
// a bundle of sheets, tied with cord: x, y its foot's left and line, w, h its size
function oh_bundle(ctx,x,y,w,h,seed){wc_part(ctx,[[x,y],[x+w,y],[x+w-2,y-h],[x+2,y-h]],OH.paper,1,{seed,lw:1});ctx.save();ctx.strokeStyle=rgba(OH.ink,0.18);ctx.lineWidth=1;
  for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(x+2,y-h*i/6);ctx.lineTo(x+w-2,y-h*i/6);ctx.stroke();}ctx.strokeStyle=rgba([150,60,50],0.9);ctx.lineWidth=2.4;
  ctx.beginPath();ctx.moveTo(x+w*0.5,y);ctx.lineTo(x+w*0.5,y-h);ctx.moveTo(x,y-h*0.5);ctx.lineTo(x+w,y-h*0.5);ctx.stroke();ctx.restore();}
// the printers' room: plaster between posts, a small high window, sheets hung on strings to dry; the bench is its front layer
// (oh_printBench): blank paper, the tray of type, an ink bowl and brush, and a pad to rub with
const OH_PR={fy:640,bench:[520,1400,700,736,812],tray:[860,1060,694],stack:[600,760],pile:[1160,1330]};
function oh_paintPrint(ctx){const R=wc_rng(701);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,OH_PR.fy+40),[214,198,172],{kind:"plaster",line:false,seed:703});
  for(const x of [80,700,1240,1850])wc_part(ctx,wc_rect(x-26,-40,52,OH_PR.fy+48),OH.woodDk,1,{seed:705+x,lw:1.2});
  wc_part(ctx,wc_rect(-40,90,W+80,40),OH.woodDk,1,{seed:707,lw:1.2});
  // the window, high on the right, its lattice bright
  wc_part(ctx,wc_rect(1420,170,300,190),OH.wood,1,{seed:709,lw:1});oh_doors(ctx,1432,182,276,166,1,false,711);
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1570,270,420,[255,240,204],0.5);ctx.restore();
  // strings across the room, sheets hung over them to dry, each with its columns of marks
  for(const [y,x0,x1,n] of [[200,140,640,5],[300,760,1210,4],[420,140,640,4]]){ctx.save();ctx.strokeStyle="rgba(90,70,50,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0-40,y-6);ctx.quadraticCurveTo((x0+x1)/2,y+14,x1+40,y-6);ctx.stroke();ctx.restore();
    for(let i=0;i<n;i++){const sx=lerp(x0,x1,(i+0.5)/n)-36,sy=y+4+Math.sin((i+0.5)/n*Math.PI)*10;wc_part(ctx,wc_rect(sx,sy,72,96),OH.paper,1,{seed:713+Math.round(sx+y),lw:0.9});oh_marks(ctx,sx+8,sy+10,56,78,6,1,717+Math.round(sx));}}
  wc_wash(ctx,wc_rect(-40,OH_PR.fy,W+80,H-OH_PR.fy+40),[176,150,118],{kind:"ground",line:false,seed:721});
  for(let i=0;i<40;i++){ctx.fillStyle=rgba([120,96,70],0.18);ctx.fillRect(R()*W,OH_PR.fy+R()*(H-OH_PR.fy),20+R()*40,2);}}
function oh_printBench(){return wc_kept("ohPrintBench",W,H,c=>{const [x0,x1,t0,t1,ft]=OH_PR.bench;
  wc_part(c,[[x0,t0],[x1,t0],[x1+20,t1],[x0-20,t1]],OH.maru,1,{seed:731,lw:1.4});wc_part(c,wc_rect(x0-20,t1,x1-x0+40,24),OH.maruDk,1,{seed:733,lw:1.2});
  for(const lx of [x0+24,x1-24])wc_part(c,wc_rect(lx-14,t1+24,28,ft-t1),OH.maruDk,1,{seed:735+lx,lw:1});
  // the blank paper, a stack at the left; the tray of type in the middle, dark, its little blocks in rows; the ink bowl at the right front
  const [s0,s1]=OH_PR.stack;for(let i=0;i<6;i++)wc_flat(c,[[s0+i,t0+14-i*3],[s1-i,t0+14-i*3],[s1-i-4,t0+4-i*3],[s0+i+4,t0+4-i*3]],i%2?OH.paper:wc_dim(OH.paper,0.04),1,"page");
  const [r0,r1,ry]=OH_PR.tray;wc_part(c,[[r0,ry],[r1,ry],[r1+10,ry+26],[r0-10,ry+26]],OH.woodDk,1,{seed:741,lw:1.2});
  c.save();c.fillStyle="rgba(40,36,40,0.85)";for(let i=0;i<16;i++)for(let j=0;j<3;j++){const u=(i+0.5)/16,v=(j+0.5)/3,x=lerp(r0+12,r1-12,u)+(v-0.5)*10*(u-0.5),y=lerp(ry+5,ry+21,v);c.fillRect(x-4,y-2.5,8,5);}c.restore();
  wc_part(c,wc_ell(1350,t0+18,30,12,20),[70,66,70],1,{seed:745,lw:1});wc_flat(c,wc_ell(1350,t0+16,22,7,16),[24,22,26],1,"trim");});}
// the floor where the books are laid in their chests: boards from above, a plaster wall at the back with a paper door, light from the left
function oh_paintChests(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,380),[220,206,182],{kind:"plaster",line:false,seed:801});
  for(const x of [150,1000,1800])wc_part(ctx,wc_rect(x-22,-40,44,370),OH.wood,1,{seed:803+x,lw:1.2});oh_doors(ctx,190,40,780,280,1,false,805);oh_doors(ctx,1040,40,730,280,1,false,806);
  wc_wash(ctx,wc_rect(-40,322,W+80,H),OH.maru,{kind:"ground",line:false,seed:807});ctx.save();ctx.strokeStyle=rgba(OH.maruDk,0.42);ctx.lineWidth=1.8;
  for(let i=0;i<12;i++){const y=330+i*i*5.4+i*12;ctx.beginPath();ctx.moveTo(-40,y);ctx.lineTo(W+40,y);ctx.stroke();}ctx.restore();wc_flat(ctx,wc_rect(-40,318,W+80,10),OH.woodDk,1,"trim");
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,200,500,900,[255,242,212],0.32);ctx.restore();}

/* ---------- the land: a road through the hills, Jeonju's archive, a mountain path, a cave by night, an archive in the mountains ---------- */
// layered hills to a horizon: far ridges blue-grey in mist, then nearer ones greener; seed varies them
function oh_hills(ctx,hz,seed,o){o=o||{};const n=o.n||3,cols=o.cols||[OH.far,mix(OH.far,OH.mid,0.5),OH.mid];
  for(let i=0;i<n;i++){const y=hz-(n-i)*(o.step||55)-20,f=oh_hillF(y,(o.h||170)*(1-i*0.18),seed+i*7,{s:1+i*0.35});oh_ridge(ctx,f,cols[i],0.3+i*0.22,seed+i*11,[40,(o.mist||150),0.75]);
    if(o.pines&&i===n-1)oh_pines(ctx,f,-40,W+40,26,22,0.4,seed+i*13);}}
// a road through the hills, coming up from the foot of the frame and over a pass; OH_RD: its line, near to far, and its width there
const OH_RD={pts:[[760,1110],[930,930],[880,800],[1010,700],[1160,632],[1290,588]],w:[260,180,120,80,52,30],hz:640};
function oh_roadAt(u){const P=OH_RD.pts,k=clamp(u,0,0.9999)*(P.length-1),i=Math.floor(k),f=k-i;return[lerp(P[i][0],P[i+1][0],f),lerp(P[i][1],P[i+1][1],f),lerp(OH_RD.w[i],OH_RD.w[i+1],f)];}
function oh_paintRoad(ctx){const R=wc_rng(901);wc_sky(ctx,600,903,{clouds:4,cy:80,ch:180});oh_hills(ctx,640,905,{n:3,h:190});
  const near=x=>600+50*Math.sin(x/260+1)+24*Math.sin(x/90);wc_land(ctx,near,OH.near,0.85,{seed:907});
  const L=[],Rr=[];for(let i=0;i<=60;i++){const [x,y,w]=oh_roadAt(i/60);L.push([x-w/2,y]);Rr.unshift([x+w/2,y]);}
  wc_wash(ctx,L.concat(Rr),OH.earth,{kind:"ground",line:false,seed:909});ctx.save();ctx.strokeStyle=rgba(OH.earthDk,0.5);ctx.lineWidth=2;ctx.beginPath();L.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
  ctx.beginPath();Rr.slice().reverse().forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();
  for(let i=0;i<60;i++){const u=R(),[x,y,w]=oh_roadAt(u);ctx.fillStyle=rgba(OH.earthDk,0.25);ctx.fillRect(x+(R()-0.5)*w*0.8,y,6+R()*10*w/100,2);}
  // pines and rocks along it, larger near us
  for(const [x,y,h,sd] of [[300,700,260,1],[470,640,170,2],[1500,660,230,3],[1680,720,320,4],[1300,600,110,5],[620,600,90,6],[160,830,420,7],[1850,880,380,8]])oh_pine(ctx,x,y,h,{seed:921+sd});
  for(const [x,y,r] of [[640,980,60],[1180,860,40],[1360,1000,80]])oh_rock(ctx,x,y,r,{seed:931+x});}
// Jeonju's archive in its walled compound in the town: the archive's hall, raised on its lower storey, its upper doors open on the chests;
// roofs of the town and hills behind; old trees inside the walls. OH_AR: the hall, and its open bay
const OH_AR={x:650,w:620,base:800,hc:400,bay:1};
function oh_paintArchive(ctx){const A=OH_AR;wc_sky(ctx,560,951,{clouds:3,cy:60,ch:160});oh_hills(ctx,560,953,{n:2,h:150});
  // the town's roofs behind the walls
  const R=wc_rng(955);for(let i=0;i<14;i++){const x=R()*W,w=110+R()*140,y=640+R()*50;if(x>520&&x<1400)continue;wc_part(ctx,wc_rect(x-w/2,y,w,60),OH.plaster,0.6,{seed:957+i,lw:1});oh_roof(ctx,x-w*0.6,x+w*0.6,y,y-w*0.32,{depth:0.6,seed:961+i,ri:0.3});}
  // the old trees, then the hall, then the wall and its gate in front
  oh_tree(ctx,1760,900,360,{seed:962,col:[96,130,82]});oh_tree(ctx,170,890,320,{seed:964,col:[106,138,88]});
  oh_pine(ctx,420,900,560,{seed:963,lean:0.3});oh_pine(ctx,1520,900,600,{seed:965,lean:-0.4});
  oh_hall(ctx,A.x,A.w,A.base,A.hc,{two:true,bays:3,open:[A.bay],seed:967,rh:190});
  oh_wall(ctx,40,1880,1000,150,{seed:971,gate:[960,200]});
  wc_wash(ctx,wc_rect(-40,1000,W+80,120),OH.earth,{kind:"ground",line:false,seed:973});}
// where the open bay's inside is, on the frame: the chests are drawn in it every frame
function oh_archiveBay(){const A=OH_AR,bay=A.w/3,cw=Math.max(3,A.w*0.018),top=A.base-A.hc,mid=A.base-A.hc*0.42;return[A.x+A.bay*bay+cw,top+A.hc*0.1,bay-2*cw,mid-A.hc*0.04-top-A.hc*0.1];}
// a mountain path, seen from high on it: the slope falls away below us to its brow, the valley's mist and the ranges beyond; the path
// comes up over the brow and climbs towards us in turns, with steps where it's steep; pines at the sides, and the tops of the trees
// below the brow. o.autumn: years later, with red and gold maples among the pines
const OH_PT=[[700,636],[612,690],[770,752],[640,836],[900,920],[1110,1004],[1250,1110]];
function oh_pathAt(u){const P=OH_PT,k=clamp(u,0,0.9999)*(P.length-1),i=Math.floor(k),f=k-i,e=f*f*(3-2*f);return[lerp(P[i][0],P[i+1][0],e),lerp(P[i][1],P[i+1][1],e)];}
function oh_pathW(u){return lerp(30,300,Math.pow(clamp(u,0,1),1.5));}
function oh_paintPath(ctx,o){o=o||{};const R=wc_rng(o.autumn?1011:1001),aut=!!o.autumn;wc_sky(ctx,420,1003,{clouds:3,cy:30,ch:120});
  // the ranges, far to near, each in its mist
  for(let i=0;i<4;i++){const f=oh_peaksF(330+i*62,250-i*40,1005+i*7,5);oh_ridge(ctx,f,mix(OH.far,OH.mid,i/3.5),0.3+i*0.16,1005+i*11,[30,150,0.82,H]);}
  // the tops of the trees far below the brow, small in the valley's mist, then the slope we stand on: it rises to a knoll at the right
  const brow=x=>640+14*Math.sin(x/240+0.6)+8*Math.sin(x/97)-150*Math.exp(-Math.pow((x-1560)/300,2))-40*Math.exp(-Math.pow((x-260)/220,2));
  for(let x=-30;x<W+40;x+=26+R()*30){const h=60+R()*50;if(aut&&R()<0.35)oh_tree(ctx,x,brow(x)+h*0.55,h,{autumn:true,seed:1041+Math.round(x),depth:0.5});else oh_pine(ctx,x,brow(x)+h*0.6,h,{seed:1043+Math.round(x),depth:0.5,lean:(R()-0.5)*0.8});}
  ctx.save();const mg=ctx.createLinearGradient(0,540,0,700);mg.addColorStop(0,rgba(WC_PAPER,0));mg.addColorStop(1,rgba(WC_PAPER,0.55));ctx.fillStyle=mg;ctx.fillRect(0,540,W,160);ctx.restore();
  oh_pines(ctx,brow,1380,1760,46,150,0.8,1045,aut?{}:{});
  wc_land(ctx,brow,aut?mix(OH.near,[176,148,84],0.32):OH.near,0.9,{seed:1007});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(OH.near,0.3),0.35);ctx.lineWidth=1.4;for(let i=0;i<140;i++){const x=R()*W,y=brow(x)+20+Math.pow(R(),0.7)*(H-brow(x)),s=4+(y-600)/40;
    ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(x-s*0.3,y-s*1.2);ctx.moveTo(x,y);ctx.lineTo(x+s*0.2,y-s*1.5);ctx.moveTo(x+s,y);ctx.lineTo(x+s*0.6,y-s);ctx.stroke();}ctx.restore();
  // the path: beaten earth, its edges, and steps where it turns
  const pts=[];for(let i=0;i<=120;i++)pts.push(oh_pathAt(i/120));const L=[],Rr=[];pts.forEach(([x,y],i)=>{const w=oh_pathW(i/120);L.push([x-w/2,y]);Rr.unshift([x+w/2,y]);});
  wc_wash(ctx,L.concat(Rr),OH.earth,{kind:"ground",line:false,seed:1017});ctx.save();ctx.strokeStyle=rgba(OH.earthDk,0.55);ctx.lineWidth=2;
  for(const side of [L,Rr.slice().reverse()]){ctx.beginPath();side.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
  // little stones along its edges
  for(let i=8;i<120;i+=3){const [x,y]=pts[i],w=oh_pathW(i/120),sd=R()<0.5?-1:1;ctx.fillStyle=rgba([130,124,114],0.55);ctx.beginPath();ctx.ellipse(x+sd*w*(0.5+R()*0.08),y,w*0.03+1,w*0.018+1,0,0,TAU);ctx.fill();}ctx.restore();
  // rocks by the path, and the nearest pines, large at the edges
  for(const [x,y,r] of [[470,1000,64],[1500,1040,80],[1010,780,26],[420,760,30],[1420,880,40]])oh_rock(ctx,x,y,r,{seed:1021+x});
  if(aut){oh_tree(ctx,300,960,420,{autumn:true,seed:1051});oh_tree(ctx,1640,900,360,{autumn:true,seed:1053});}
  oh_pine(ctx,80,1110,820,{seed:1031,lean:0.5});oh_pine(ctx,1840,1120,880,{seed:1033,lean:-0.6});oh_pine(ctx,1560,760,300,{seed:1035,lean:-0.3});}
// a cave's mouth at night, in a cliff high on the mountain: the rock in ledges, its dark opening with the chests inside, a little ground
// before it, pines in the dark; o.snow, in winter. The fire, its light and the two who keep watch are drawn every frame. OH_CV: the
// mouth's arch (its foot's middle, half its width, its height), the fire, where the two sit, the chests
const OH_CV={arch:[1100,800,330,430],fire:[960,900],seats:[[700,890],[1250,880]],chests:[[930,792],[1050,786],[1170,790],[1290,796]]};
function oh_caveMouth(){const [cx,fy,rx,ry]=OH_CV.arch,R=wc_rng(1119),P=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI,k=1+0.06*Math.sin(a*7+1)+0.04*Math.sin(a*13);
  P.push([cx-Math.cos(a)*rx*k*(1+0.06*Math.sin(a)),fy-Math.pow(Math.sin(a),0.7)*ry*k]);}return P;}
// the ledges across the cliff: each an open line, left to right, that the snow lies on
const OH_LEDGE=[[[600,560],[760,520],[980,330],[1200,300],[1420,340],[1600,300],[1980,280]],[[700,330],[880,220],[1180,190],[1500,200],[1760,150],[1980,140]],
  [[560,760],[700,720],[760,700]],[[1450,700],[1600,650],[1800,640],[1980,600]],[[1440,520],[1640,470],[1980,450]]];
function oh_paintCave(ctx,o){o=o||{};const R=wc_rng(1101),snow=!!o.snow;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(22,28,54)");g.addColorStop(1,"rgb(48,54,80)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle="rgba(255,255,240,0.8)";for(let i=0;i<80;i++){const x=R()*620,y=R()*420,r=R()*1.6+0.4;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
  // the far ranges, dark; then the mountain's flank rising to the right, and the cliff in it
  wc_land(ctx,oh_peaksF(470,220,1103,4),[40,48,72],1,{seed:1105,line:false});wc_land(ctx,x=>560-x*0.32+20*Math.sin(x/120),[44,50,58],1,{seed:1107,line:false});
  const cliff=[[520,1140],[540,760],[600,560],[700,330],[880,220],[1180,190],[1500,200],[1760,150],[W+60,130],[W+60,1140]];wc_wash(ctx,cliff,[92,88,90],{kind:"build",line:false,seed:1111});
  ctx.save();wc_tr(ctx,cliff);ctx.clip();
  // the rock in ledges: each ledge's lit top, and its shadow under it; cracks down the faces
  for(const L of OH_LEDGE){const sm=oh_smoothPts(L);ctx.strokeStyle="rgba(30,28,32,0.55)";ctx.lineWidth=3;ctx.beginPath();sm.forEach(([x,y],i)=>i?ctx.lineTo(x,y+6):ctx.moveTo(x,y+6));ctx.stroke();
    ctx.strokeStyle="rgba(170,166,166,0.35)";ctx.lineWidth=2;ctx.beginPath();sm.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
  ctx.strokeStyle="rgba(30,28,32,0.4)";ctx.lineWidth=1.8;for(let i=0;i<34;i++){const x=600+R()*1360,y=180+R()*560;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(R()-0.5)*30,y+30+R()*70);ctx.lineTo(x+(R()-0.5)*40,y+60+R()*90);ctx.stroke();}
  const sh=ctx.createLinearGradient(520,0,W,0);sh.addColorStop(0,"rgba(20,18,24,0.35)");sh.addColorStop(0.4,"rgba(20,18,24,0)");ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);ctx.restore();
  // the mouth: its dark, deeper further in, and the rock's lip around it
  const M=oh_caveMouth();wc_wash(ctx,M,[46,40,40],{kind:"build",line:false,seed:1113});ctx.save();wc_tr(ctx,M);ctx.clip();
  const [cx,fy,rx,ry]=OH_CV.arch,ig=ctx.createRadialGradient(cx,fy-ry*0.3,20,cx,fy-ry*0.35,rx*1.1);ig.addColorStop(0,"rgb(12,10,12)");ig.addColorStop(1,"rgba(40,34,34,1)");ctx.fillStyle=ig;ctx.fillRect(cx-rx*1.2,fy-ry*1.2,rx*2.4,ry*1.3);
  ctx.fillStyle="rgba(58,50,46,1)";ctx.beginPath();ctx.ellipse(cx,fy+6,rx*0.98,46,0,Math.PI,TAU);ctx.fill();ctx.restore();
  wc_ink(ctx,M.concat([[cx+rx,fy]]),false,2.2,[24,22,26],0.7,1121,1.4);
  // the chests inside, in the dark
  for(const [x,y] of OH_CV.chests)oh_chest(ctx,x,y,0.56,{dark:true,seed:x});
  // the ground before the mouth, and its stones
  const ground=[[-60,850],[300,820],[700,800],[1100,806],[1500,820],[W+60,800],[W+60,H+60],[-60,H+60]];wc_wash(ctx,ground,snow?[206,214,232]:[72,64,58],{kind:"ground",line:false,seed:1115});
  for(const [x,y,r] of [[380,960,50],[1560,1000,70],[1760,900,40]])oh_rock(ctx,x,y,r,{seed:1125+x,col:snow?[120,120,130]:[96,90,88],snow});
  // pines in the dark at the left, on the flank
  for(const [x,y,h] of [[110,880,560],[300,800,380],[440,740,240]])oh_pine(ctx,x,y,h,{seed:1117+x,col:[34,48,44],depth:1,snow});
  if(snow){// snow along the ledges, thick on their tops, and drifts on the ground
    ctx.save();wc_tr(ctx,cliff);ctx.clip();for(const L of OH_LEDGE){const sm=oh_smoothPts(L);const top=sm.map(([x,y],i)=>[x,y-6-5*Math.sin(i*0.9)-4]);
      wc_tr(ctx,sm.concat(top.slice().reverse()));ctx.fillStyle="rgba(236,240,248,0.92)";ctx.fill();}ctx.restore();
    ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(248,250,255,0.4)";for(let i=0;i<9;i++){ctx.beginPath();ctx.ellipse(R()*W,860+R()*200,120+R()*160,8+R()*6,0,0,TAU);ctx.fill();}ctx.restore();}
  // the night over everything: a cool veil, which the fire's light lifts (drawn every frame)
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=snow?"rgba(128,138,178,0.55)":"rgba(112,118,162,0.6)";ctx.fillRect(0,0,W,H);ctx.restore();}
// a smooth line through a few points
function oh_smoothPts(P){const o=[];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],a0=P[i-1]||a,b1=P[i+2]||b;for(let k=0;k<8;k++){const t=k/8,t2=t*t,t3=t2*t;
  o.push([0.5*((2*a[0])+(-a0[0]+b[0])*t+(2*a0[0]-5*a[0]+4*b[0]-b1[0])*t2+(-a0[0]+3*a[0]-3*b[0]+b1[0])*t3),0.5*((2*a[1])+(-a0[1]+b[1])*t+(2*a0[1]-5*a[1]+4*b[1]-b1[1])*t2+(-a0[1]+3*a[1]-3*b[1]+b1[1])*t3)]);}}
  o.push(P[P.length-1]);return o;}
// a chest for the books: dark wood, brass at its corners and lock; x, y: the middle of its foot; s its scale; o.open (0 to 1) lifts its
// lid; o.dark, in the dark of a cave
function oh_chest(ctx,x,y,s,o){o=o||{};const w=200*s,h=120*s,c=o.dark?[56,44,38]:OH.chest,b=o.dark?[110,96,70]:OH.brass,op=clamp(o.open||0,0,1);
  wc_part(ctx,wc_rect(x-w/2,y-h,w,h),c,1,{seed:(o.seed||1)+Math.round(x),lw:1.1});wc_flat(ctx,wc_rect(x-w/2,y-h,w,h*0.22),wc_dim(c,0.2),1,"trim");
  for(const [cx,cy] of [[x-w/2,y-h],[x+w/2-18*s,y-h],[x-w/2,y-20*s],[x+w/2-18*s,y-20*s]])wc_flat(ctx,wc_rect(cx,cy,18*s,20*s),b,1,"trim");
  wc_flat(ctx,wc_rect(x-14*s,y-h*0.78,28*s,30*s),b,1,"trim");
  if(op>0.01){const lh=h*0.22,ly=y-h-lh*op*2.2;wc_part(ctx,[[x-w/2,y-h],[x+w/2,y-h],[x+w/2+6*s,ly],[x-w/2-6*s,ly]],wc_lit(c,0.1),1,{seed:(o.seed||1)+7,lw:1});}}
// an archive high in the mountains: its hall raised on its lower storey, among pines, a yard of beaten earth in front where the books
// are aired on racks in the sun (drawn every frame), mist in the valley below. OH_AI: the hall, the yard, the racks, the historian's mat
const OH_AI={x:130,w:600,base:640,hc:350,yard:612,racks:[[960,712,380],[1400,712,380],[940,860,420],[1420,860,420]],mat:[1600,940]};
function oh_paintAiring(ctx){const R=wc_rng(1201);wc_sky(ctx,360,1203,{clouds:4,cy:40,ch:120});oh_hills(ctx,380,1205,{n:3,h:200,step:60});
  const back=x=>300+80*Math.sin(x/300+2)+30*Math.sin(x/110);wc_land(ctx,back,OH.mid,0.75,{seed:1207});oh_pines(ctx,back,-40,W+40,60,150,0.75,1209);
  // the yard's wall behind the racks, the yard, the hall standing in it, and the pines at its sides
  oh_wall(ctx,800,W+60,618,86,{seed:1213,gate:false});
  wc_wash(ctx,wc_rect(-40,OH_AI.yard,W+80,H-OH_AI.yard+40),[206,184,146],{kind:"ground",line:false,seed:1215});
  oh_hall(ctx,OH_AI.x,OH_AI.w,OH_AI.base,OH_AI.hc,{two:true,bays:3,open:[0,1,2],seed:1211,rh:170});
  ctx.save();ctx.globalCompositeOperation="screen";const g=ctx.createLinearGradient(0,OH_AI.yard,0,H);g.addColorStop(0,"rgba(255,246,214,0.4)");g.addColorStop(1,"rgba(255,246,214,0)");ctx.fillStyle=g;ctx.fillRect(0,OH_AI.yard,W,H);ctx.restore();
  for(const [x,y,w] of OH_AI.racks){for(const s of [-1,1])wc_part(ctx,wc_rect(x+s*w*0.46-6,y-6,12,70),OH.woodDk,1,{seed:1217+x+y+s,lw:1});
    wc_part(ctx,[[x-w/2,y-14],[x+w/2,y-14],[x+w/2+10,y+6],[x-w/2-10,y+6]],OH.maru,1,{seed:1219+x+y,lw:1.2});}
  wc_part(ctx,[[OH_AI.mat[0]-200,OH_AI.mat[1]-40],[OH_AI.mat[0]+260,OH_AI.mat[1]-40],[OH_AI.mat[0]+300,OH_AI.mat[1]+60],[OH_AI.mat[0]-240,OH_AI.mat[1]+60]],[214,192,140],1,{seed:1221,lw:1});
  oh_pine(ctx,1880,900,700,{seed:1223,lean:-0.5});}

/* ---------- the archives as small views, pinned on paper like a map ---------- */
// Each painted on a sheet OH_VW x OH_VH, its edges soft, as if painted straight onto the paper: the capital, a city in its walls under a
// rocky peak, with its great gate; three towns, each with its archive's tall hall inside a walled compound (Chungju by its river,
// Seongju among hills and fields, Jeonju on its plain among old trees); and four mountains, each with its archive high on a slope among
// pines (Mani above the sea)
const OH_VW=440,OH_VH=300;
// the sheet they're pinned on: paper over the whole frame, a soft wash, its fibres
function oh_paintBoard(ctx){const R=wc_rng(1291);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),OH.hanji,{kind:"plaster",line:false,seed:1293});
  ctx.save();ctx.strokeStyle="rgba(150,130,100,0.12)";ctx.lineWidth=1;for(let i=0;i<260;i++){const x=R()*W,y=R()*H,a=R()*TAU,l=10+R()*30;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(a)*l*0.5+4,y+Math.sin(a)*l*0.5,x+Math.cos(a)*l,y+Math.sin(a)*l);ctx.stroke();}ctx.restore();}
function oh_view(k){return wc_kept("ohView:"+k,OH_VW,OH_VH,q=>{const w=OH_VW,h=OH_VH,R=wc_rng(1301+k.length*13+k.charCodeAt(0)),c=mkCanvas(w,h);
  const v=c.getContext("2d");v.fillStyle=rgba(WC_PAPER,1);v.fillRect(0,0,w,h);const sky=v.createLinearGradient(0,0,0,h*0.6);sky.addColorStop(0,"rgba(176,204,228,0.9)");sky.addColorStop(1,"rgba(236,236,226,0.4)");
  v.fillStyle=sky;v.fillRect(0,0,w,h);const sc=h/H;v.save();v.translate((w-W*sc)/2,0);v.scale(sc,sc);// paint in frame units: a frame's worth, shrunk to the sheet's height
  const town=k==="capital"||k==="chungju"||k==="seongju"||k==="jeonju";
  if(town){// a town on its plain: hills behind, the land, houses, the compound in the middle; Chungju's river and Seongju's fields in front
    oh_hills(v,560,1311+k.length,{n:2,h:200,step:60,mist:120});const g0=720;
    if(k==="capital"){const peak=oh_peaksF(600,400,1321,3);oh_ridge(v,peak,[156,154,146],0.85,1323,[60,240,0.6,H]);}
    wc_wash(v,[[-60,g0],[W+60,g0-30],[W+60,1140],[-60,1140]],k==="seongju"?[196,200,132]:[184,194,128],{kind:"land",line:false,seed:1371});
    if(k==="chungju")wc_wash(v,[[-60,930],[700,900],[1300,920],[W+60,890],[W+60,1140],[-60,1140]],WCP.water,{kind:"water",line:false,seed:1341});
    if(k==="seongju")for(let i=0;i<5;i++)wc_wash(v,[[-60,880+i*44],[W+60,850+i*44],[W+60,884+i*44],[-60,914+i*44]],i%2?[206,196,120]:[176,192,112],{kind:"field",line:false,seed:1351+i});
    for(let i=0;i<10;i++){const x=R()*W,ww=120+R()*120,y=g0+20+R()*60;if(Math.abs(x-960)<330)continue;wc_part(v,wc_rect(x-ww/2,y-50,ww,50),OH.plaster,0.9,{seed:1373+i,lw:1.2});oh_roof(v,x-ww*0.6,x+ww*0.6,y-50,y-50-ww*0.34,{depth:0.9,seed:1377+i,ri:0.3});}
    if(k==="jeonju"){oh_tree(v,560,g0+150,380,{seed:1395});oh_tree(v,1380,g0+160,420,{seed:1397,col:[106,138,88]});}
    if(k==="capital"){oh_roof(v,960-300,960+300,g0-60,g0-200,{seed:1383,ri:0.26});wc_part(v,wc_rect(960-200,g0-60,400,90),OH.wood,1,{seed:1385,lw:1.2});oh_wall(v,-60,W+60,g0+150,110,{seed:1381,gate:[960,300]});}
    else oh_compound(v,960,g0+40,560,{hc:300,seed:1391+k.length,hall:{two:true,bays:3,rh:140}});}
  else{// a mountain, its own shape, the archive small and high on its slope among pines; Mani's above the sea
    const sh={odae:[1.7,1.25],taebaek:[0.95,0.8],myohyang:[1.2,1],mani:[1.15,1]}[k],cx=k==="mani"?1060:880,pk=k==="myohyang"?oh_peaksF(700,560,1337,6):null;
    oh_hills(v,520,1311+k.length,{n:2,h:200,step:80,mist:120});
    const g=x=>{const c=120+Math.pow(Math.abs(x-cx)/(900*sh[1]),sh[0])*640+10*Math.sin(x/61+k.length);return pk?Math.min(c,pk(x)):c;};
    wc_land(v,g,OH.mid,0.95,{seed:1331+k.length});oh_pines(v,g,0,W,40,120,0.85,1333+k.length);
    if(k==="mani")wc_wash(v,[[-60,860],[W+60,840],[W+60,1140],[-60,1140]],WCP.water,{kind:"water",line:false,seed:1361});
    // the archive on a terrace on the slope, the peak behind it
    const ax=cx+(k==="mani"?-230:210),gy=k==="mani"?720:660;wc_wash(v,wc_ell(ax,gy+40,300,60,24),mix(OH.mid,OH.earth,0.4),{kind:"land",line:false,seed:1387});
    for(let i=0;i<5;i++)oh_pine(v,ax-280+i*140,gy-120+(i%2)*30,170,{seed:1388+i,depth:0.9});
    oh_compound(v,ax,gy,300,{hc:160,seed:1391+k.length,hall:{two:true,bays:3,rh:90},wallH:0.36});
    for(let i=0;i<9;i++){const x=R()*W;if(Math.abs(x-ax)<240)continue;oh_pine(v,x,gy+120+R()*260,220+R()*160,{seed:1399+i});}}
  v.restore();
  // soft edges: the paint fades into the paper
  v.globalCompositeOperation="destination-in";const m=v.createRadialGradient(w/2,h/2,Math.min(w,h)*0.32,w/2,h/2,Math.max(w,h)*0.58);m.addColorStop(0,"rgba(0,0,0,1)");m.addColorStop(0.7,"rgba(0,0,0,0.9)");m.addColorStop(1,"rgba(0,0,0,0)");
  v.fillStyle=m;v.fillRect(0,0,w,h);q.fillStyle=rgba(WC_PAPER,1);q.fillRect(0,0,w,h);q.drawImage(c,0,0);});}

/* ---------- today: a long shelf of the books, and a reader in a library ---------- */
// a quiet room of the archive: a long case with glass doors across the frame, the books lying flat in its shelves, a cool light
function oh_paintShelf(ctx){const R=wc_rng(1401);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,860),[226,226,220],{kind:"plaster",line:false,seed:1403});
  wc_wash(ctx,wc_rect(-40,850,W+80,300),[188,182,172],{kind:"ground",line:false,seed:1405});gv_lightGlow(ctx,960,-60,900);
  wc_part(ctx,wc_rect(60,190,1800,690),[150,112,80],1,{seed:1407,lw:1.4});
  for(let r=0;r<4;r++){const y=228+r*160;wc_flat(ctx,wc_rect(84,y,1752,130),[96,70,52],1,"trim");
    for(let x=100;x<1820;){const n=3+Math.floor(R()*4),bw=96+R()*20;for(let j=0;j<n;j++){const by=y+126-j*13;wc_flat(ctx,[[x,by],[x+bw,by],[x+bw-2,by-12],[x+2,by-12]],j%2?OH.cover:wc_dim(OH.cover,0.08),1,"page");}
      x+=bw+8+R()*10;}}
  ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(220,236,246,0.16)";ctx.fillRect(84,228,1752,640);ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=3;
  for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(140+i*320,240);ctx.lineTo(60+i*320,860);ctx.stroke();}ctx.restore();
  for(let i=1;i<6;i++)wc_flat(ctx,wc_rect(60+i*300-5,196,10,684),[150,112,80],1,"trim");}
// a reading room: tall windows, shelves on the right; the desk is its front layer (oh_libraryDesk), with a screen on it at the right
const OH_LB={fy:800,desk:[200,1500,756],seat:[600,0.95],screen:[960,380,520,330]};
function oh_paintLibrary(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,OH_LB.fy+40),[236,230,218],{kind:"plaster",line:false,seed:1501});
  for(const x of [80,520])gv_window(ctx,x,90,340,560,{seed:1503+x});gv_lightGlow(ctx,500,300,700);
  wc_wash(ctx,wc_rect(-40,OH_LB.fy,W+80,H-OH_LB.fy+40),[176,160,140],{kind:"ground",line:false,seed:1505});
  const sh=[250,400,550,700],R=wc_rng(1507);gv_bookcase(ctx,1520,OH_LB.fy,360,680,sh);
  for(const y of sh)for(let x=1540;x<1860;){const w=14+R()*14,h=86+R()*44;if(x+w>1862)break;wc_flat(ctx,wc_rect(x,y-h,w,h),[[150,70,58],[70,96,130],[96,120,80],[196,160,96],[120,100,130]][Math.floor(R()*5)],1,"page");x+=w+2+(R()<0.1?20:0);}}
function oh_libraryDesk(){return wc_kept("ohLibDesk",W,H,c=>{const [x0,x1,top]=OH_LB.desk;gv_deskScreen(c,OH_LB.screen[0],OH_LB.screen[1],OH_LB.screen[2],OH_LB.screen[3],top);
  wc_part(c,[[x0,top],[x1,top],[x1+30,top+40],[x0-30,top+40]],[196,160,118],1,{seed:1511,lw:1.4});wc_part(c,wc_rect(x0-30,top+40,x1-x0+60,22),[150,116,84],1,{seed:1513,lw:1.2});
  for(const lx of [x0,x1])wc_part(c,wc_rect(lx-12,top+62,24,H),[150,116,84],1,{seed:1515+lx,lw:1});});}
