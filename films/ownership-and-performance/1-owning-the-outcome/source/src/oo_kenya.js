/* ===== Owning the outcome: the opening, Kenya's central highlands, the 1970s to 2004 =====
   The film's own places and pictures for its opening story (prefix oo_), in the module's matte, sunlit language, lit from the right as
   its rooms are, so the light carries across into the university. Nothing here is a likeness of a real place or person, and nothing is
   borrowed from a culture's own patterns or crafts: rolling hills of red soil, small farms, tea, a timber plantation, a dry stream bed;
   a tree nursery of seedlings in plastic sleeves under a shade of poles; people in plain clothes of the 1970s.
     ooHills, ooGreen      the hills of the 1970s, their forests cleared: fields to the ridges, tea, a plantation's straight rows, a few
                           old trees, stumps and gullies on the near slope, the stream bed dry; and the same hills years later, with trees
                           along the fields and on the slope, grass over the gullies, water in the stream (one room: AG_ROOMS)
     ooNursery             a group's tree nursery: a shade of poles and dry grass over packed earth, the hills behind
     oo_beds(ctx, t, o)    the nursery's two beds of seedlings in their sleeves, growing (o.g, 0 to 1)
     oo_seedling(ctx, x, y, s, o)   one seedling: o.g how far it has grown (0 to 1), o.dry how far it has died (0 to 1), o.sleeve in a
                           plastic sleeve, else in the ground with a ring of soil
     oo_tree(c, x, base, s, o)      a broad-leaved tree, its trunk tapering, its crown in clumps lit from the right
     oo_run(ctx, t, a)     rain water running down the near slope's gullies, carrying the red soil into the stream bed
     OO_ROW                where the women plant a row of seedlings on the near slope (and where, years later, trees stand)
     OO_PEOPLE             Wangari Maathai, a biologist, and three women of the hills, dressed for their time, never likenesses
   Colour keeps the module's meaning: amber the harm (the streams, the food, the firewood, the soil), green what got better (the trees
   counted alive, what they give), blue the plan (the movement); the hills, the trees and the people wear none of the five: the leaves
   are olive, never the green that marks a value. */

const OO_K={sky0:[164,190,212],sky1:[238,228,206],mount:[152,164,178],mountSh:[124,134,152],snow:[240,240,238],
  far0:[166,174,166],far1:[146,154,136],far2:[132,138,112],
  soil:[164,96,62],soilDk:[116,64,44],soilHi:[200,138,96],dust:[198,164,116],grass:[160,146,92],grassDk:[118,108,66],
  stub:[202,170,112],tan:[212,186,142],plough:[150,90,62],maize:[146,146,86],tea:[122,144,72],teaDk:[90,110,56],pine:[62,78,60],pineHi:[96,112,82],
  leaf:[88,108,62],leafDk:[56,72,46],leafHi:[146,160,98],turf:[124,132,76],turfDk:[92,102,58],bark:[104,84,68],barkDk:[66,52,44],
  stone:[198,190,176],stoneDk:[150,142,130],sand:[208,192,158],water:[118,148,158],waterHi:[200,216,216],
  sleeve:[44,42,46],sleeveHi:[110,108,114],thatch:[186,162,114],thatchDk:[136,114,78],pole:[122,98,74],poleDk:[84,66,50],earth:[176,138,104],earthDk:[138,102,76]};

/* ---------------------------------------------------------------- small things */
const oo_wob=(u,s)=>Math.sin(u*1.7+s*3.1)*0.6+Math.sin(u*3.9+s*1.3)*0.4;
// a soft blob of light or shade: a radial gradient, cheap to draw
function oo_blob(c,x,y,rx,ry,col,a){if(a<=0.004||rx<=0)return;c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);
  g.addColorStop(0,rgba(col,a));g.addColorStop(0.6,rgba(col,a*0.45));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-rx,-rx,2*rx,2*rx);c.restore();}
// a line through points, smoothed: quadratic curves through the midpoints
function oo_curve(c,P,move){if(move!==false)c.moveTo(P[0][0],P[0][1]);else c.lineTo(P[0][0],P[0][1]);
  for(let i=1;i<P.length-1;i++){const m=[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2];c.quadraticCurveTo(P[i][0],P[i][1],m[0],m[1]);}
  const L=P[P.length-1];c.lineTo(L[0],L[1]);}
// a ridge line: its height at x, from a few soft waves (the same seed, the same ridge)
const oo_ridge=(x,y0,amp,s)=>y0-amp*(0.5+0.32*Math.sin(x/330+s)+0.18*Math.sin(x/127+s*2.3));

/* ---------------------------------------------------------------- the hills: sky, the far mountain, far ridges */
function oo_sky(c,hz){let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(OO_K.sky0,1));g.addColorStop(0.7,rgba(mix(OO_K.sky0,OO_K.sky1,0.7),1));g.addColorStop(1,rgba(OO_K.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+60);
  // the sun's warmth from high on the right, and a few soft clouds over the far hills
  oo_blob(c,1780,30,1000,760,[255,236,196],0.45);
  for(const [x,y,r] of [[340,190,190],[520,168,130],[660,200,150],[1080,130,130],[1200,108,100],[1700,230,160]]){oo_blob(c,x,y,r,r*0.38,[255,252,246],0.45);oo_blob(c,x-r*0.2,y+r*0.15,r*0.8,r*0.2,[200,204,214],0.16);}}
// far away to the north-east, low in the haze: a broad mountain, its summit a cluster of rock peaks with a little snow
function oo_mountain(c){const pk=[[980,472],[1120,446],[1240,414],[1320,384],[1372,360],[1404,344],[1426,326],[1438,330],[1450,306],[1462,318],[1472,296],[1484,312],[1494,302],[1506,322],[1522,330],[1546,344],[1590,360],[1660,384],[1760,414],[1880,446],[1990,470]];
  const shape=cc=>{cc.moveTo(960,490);for(const p of pk)cc.lineTo(p[0],p[1]);cc.lineTo(1990,490);cc.closePath();};
  c.save();c.globalAlpha=0.55;ag_shape(c,shape);c.fillStyle=rgba(OO_K.mount,1);c.fill();
  c.save();ag_shape(c,shape);c.clip();c.fillStyle=rgba(OO_K.mountSh,0.5);c.beginPath();c.moveTo(960,490);for(const p of pk.slice(0,11))c.lineTo(p[0],p[1]);c.lineTo(1468,310);c.lineTo(1440,390);c.lineTo(1380,470);c.lineTo(1320,490);c.closePath();c.fill();
  // a few ridges down its sunlit side
  c.strokeStyle="rgba(255,250,240,0.35)";c.lineWidth=2;for(const [x0,y0,x1,y1] of [[1486,312,1560,420],[1506,324,1650,440],[1474,300,1506,410]]){c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+x1)/2+10,(y0+y1)/2-6,x1,y1);c.stroke();}c.restore();
  c.globalAlpha=0.8;c.fillStyle=rgba(OO_K.snow,1);for(const P of [[[1438,330],[1450,306],[1458,320],[1450,330]],[[1466,304],[1472,296],[1482,312],[1474,318]],[[1490,306],[1494,302],[1504,320],[1496,324]]]){c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();}
  c.restore();}
function oo_far(c){for(const [col,y0,amp,s] of [[OO_K.far0,470,34,1.2],[OO_K.far1,492,28,4.1],[OO_K.far2,512,22,2.6]]){c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,H);
    for(let x=0;x<=W;x+=24)c.lineTo(x,oo_ridge(x,y0,amp,s));c.lineTo(W,H);c.closePath();c.fill();
    const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(52,44,52,0.07)");g.addColorStop(1,"rgba(255,236,200,0.08)");c.fillStyle=g;c.fillRect(0,y0-amp,W,amp*2+40);}}

/* ---------------------------------------------------------------- the middle hills, cut into small farms */
// back to front: the hill on the right, then the one on the left; each crest a curve, the hill's plots in bands that follow it down
// the slope, wider as they come nearer; haze (0 to 1) how far the air pales it
const OO_HILLS=[{x0:640,x1:2000,crest:x=>540+Math.pow((x-1560)/620,2)*70+12*Math.sin(x/170),base:700,seed:57,haze:0.22,bands:5,tea:null,pine:[0.56,0.74]},
                {x0:-60,x1:1320,crest:x=>522+Math.pow((x-430)/640,2)*88+10*Math.sin(x/150+1),base:760,seed:31,haze:0.08,bands:5,tea:[0.6,0.86],pine:null}];
// a band's edge, k of n bands down the slope at x (with a little wander of its own)
const oo_band=(h,x,k)=>k<=0?h.crest(x):lerp(h.crest(x),h.base,Math.pow(k/h.bands,1.45))+(k<h.bands?6*oo_wob(x/140,k+h.seed):0);
// the hill's plots, worked out once: [{xs, k, kind, u}], each between band k and k+1, from xs[0] to xs[1]
function oo_plots(h){if(h.plots)return h.plots;const R=ag_rnd(h.seed),out=[];
  for(let k=0;k<h.bands;k++){let x=h.x0-20*R();while(x<h.x1){const w=lerp(110,280,R())*lerp(0.8,1.25,k/h.bands),xa=x,xb=Math.min(h.x1+40,x+w),uu=((xa+xb)/2-h.x0)/(h.x1-h.x0);
      let kind=["stub","tan","plough","maize","pasture","stub","maize","tan","pasture"][(R()*9)|0];
      if(h.tea&&uu>h.tea[0]&&uu<h.tea[1]&&k>=1&&k<4)kind="tea";if(h.pine&&uu>h.pine[0]&&uu<h.pine[1]&&k<2)kind="pine";
      out.push({xs:[xa,xb],k,kind,u:uu,lean:(R()-0.5)*30});x=xb;}}
  return h.plots=out;}
// a plot's outline: along its top band edge, down its far side, back along its lower edge
function oo_plotPath(c,h,p){const [xa,xb]=p.xs,k=p.k,n=6;c.beginPath();for(let i=0;i<=n;i++){const x=lerp(xa,xb,i/n);i?c.lineTo(x,oo_band(h,x,k)):c.moveTo(x,oo_band(h,x,k));}
  for(let i=n;i>=0;i--){const x=lerp(xa,xb,i/n)+p.lean*(i===0||i===n?1:0)*0;c.lineTo(x+(i===n?p.lean:i===0?p.lean:p.lean),oo_band(h,x+p.lean,k+1));}c.closePath();}
const OO_FIELD={stub:[206,178,122],tan:[214,194,152],plough:[164,106,74],maize:[152,150,94],pasture:[178,164,108],tea:[126,146,82],pine:[74,90,68]};
function oo_paintHill(c,h,green){const R=ag_rnd(h.seed+7),plots=oo_plots(h),haze=mix(OO_K.sky1,OO_K.far0,0.3);
  const body=cc=>{cc.moveTo(h.x0,H);for(let x=h.x0;x<=h.x1;x+=20)cc.lineTo(x,h.crest(x));cc.lineTo(h.x1,h.crest(h.x1));cc.lineTo(h.x1,H);cc.closePath();};
  ag_shape(c,body);c.fillStyle=rgba(mix(OO_FIELD.pasture,haze,h.haze),1);c.fill();c.save();ag_shape(c,body);c.clip();
  for(const p of plots){const col=mix(green&&p.kind==="pasture"?mix(OO_FIELD.pasture,OO_K.turf,0.5):OO_FIELD[p.kind],haze,h.haze);c.fillStyle=rgba(col,1);oo_plotPath(c,h,p);c.fill();
    c.save();oo_plotPath(c,h,p);c.clip();const [xa,xb]=p.xs;
    // rows along the slope: tea's close hedges, maize's lines, a ploughed field's furrows; a plantation's trees in their straight rows
    if(p.kind==="tea"||p.kind==="maize"||p.kind==="plough"){const n=p.kind==="tea"?7:p.kind==="maize"?5:4,col2=p.kind==="tea"?mix([96,116,62],haze,h.haze):rgba(ag_dk(col,0.3),1);
      for(let r=1;r<n;r++){const f=p.k+r/n;c.strokeStyle=p.kind==="tea"?rgba(col2,0.8):rgba(ag_dk(col,0.3),0.3);c.lineWidth=p.kind==="tea"?2.6:1.4;c.beginPath();
        for(let i=0;i<=8;i++){const x=lerp(xa-10,xb+40,i/8),y=lerp(oo_band(h,x,Math.floor(f)),oo_band(h,x,Math.floor(f)+1),f-Math.floor(f));i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}}
    else if(p.kind==="pine"){for(let r=0;r<6;r++)for(let q=0;q<14;q++){const x=lerp(xa,xb,(q+0.5)/14),y=lerp(oo_band(h,x,p.k),oo_band(h,x,p.k+1),(r+0.8)/6);
        c.fillStyle=rgba(mix(ag_lt(OO_FIELD.pine,0.2),haze,h.haze),1);c.beginPath();c.moveTo(x,y-9);c.lineTo(x+3.4,y);c.lineTo(x-3.4,y);c.closePath();c.fill();}}
    c.restore();
    // the plot's lower edge: a soft line of shade, a hedge in the later years
    c.strokeStyle="rgba(70,52,40,0.2)";c.lineWidth=1.4;c.beginPath();for(let i=0;i<=6;i++){const x=lerp(xa,xb,i/6)+p.lean;i?c.lineTo(x,oo_band(h,x,p.k+1)):c.moveTo(x,oo_band(h,x,p.k+1));}c.stroke();}
  // the light: the slope towards the sun warmer, the far side in shade, the crest lit
  let g=c.createLinearGradient(h.x0,0,h.x1,0);g.addColorStop(0,"rgba(52,44,52,0.18)");g.addColorStop(0.5,"rgba(52,44,52,0.02)");g.addColorStop(1,"rgba(255,232,190,0.12)");c.fillStyle=g;c.fillRect(h.x0,0,h.x1-h.x0,H);
  g=c.createLinearGradient(0,h.crest((h.x0+h.x1)/2)-30,0,h.base);g.addColorStop(0,"rgba(255,246,226,0.16)");g.addColorStop(0.4,"rgba(255,246,226,0)");g.addColorStop(1,"rgba(52,44,52,0.1)");c.fillStyle=g;c.fillRect(h.x0,0,h.x1-h.x0,H);
  // trees: a few old ones left standing in the 1970s; years later, lines of them along the fields' edges, and small woods
  if(green){for(const p of plots){if(p.kind==="pine"||p.kind==="tea")continue;const [xa,xb]=p.xs,n=Math.round((xb-xa)/34);if(R()<0.4)continue;
      for(let i=0;i<n;i++){if(R()<0.45)continue;const x=lerp(xa,xb,(i+R())/n)+p.lean,y=oo_band(h,x,p.k+1)+1,s=lerp(0.07,0.14,(y-500)/300)*(0.8+R()*0.4);oo_tree(c,x,y,s,{seed:(x*7+y)|0,far:1,haze:h.haze});}
      if(R()<0.07){const cx=(xa+xb)/2,cy=lerp(oo_band(h,cx,p.k),oo_band(h,cx,p.k+1),0.7);for(let i=0;i<14;i++)oo_tree(c,cx+(R()-0.5)*(xb-xa)*0.7,cy+(R()-0.5)*20,lerp(0.08,0.14,(cy-500)/300),{seed:i*31+p.k,far:1,haze:h.haze});}}}
  else for(let i=0;i<9;i++){const p=plots[(R()*plots.length)|0];if(p.kind==="pine")continue;const x=lerp(p.xs[0],p.xs[1],R()),y=oo_band(h,x,p.k+1)+1;oo_tree(c,x,y,lerp(0.08,0.15,(y-500)/300),{seed:i*17+h.seed,far:1,haze:h.haze});}
  c.restore();}

/* ---------------------------------------------------------------- the near slope */
// its top edge; the gullies the rain has cut (each a smooth curve, narrow at the top); the stumps of the trees that were cut; and the
// stream bed in the valley beyond, seen between the hills
const OO_NEAR={top:x=>748+16*Math.sin(x/260+0.8)+9*Math.sin(x/97+2)-(x-960)*0.012,
  gullies:[[[560,772],[500,830],[470,930],[300,1090],5,70],[[1150,756],[1190,840],[1120,950],[1180,1090],4,56],[[1640,748],[1700,820],[1690,930],[1820,1090],4,64]],
  stumps:[[250,858,30],[790,812,22],[1340,826,26],[1800,884,34]],
  stream:[[1300,636],[1318,650],[1306,668],[1334,686],[1378,700],[1394,716],[1450,734]]};
// where the women plant their row of seedlings, along the slope, and which ones are still alive months later
const OO_ROW={pts:[[560,826],[700,820],[840,814],[980,810],[1120,810],[1260,814],[1400,820],[1540,828]],alive:[1,1,0,1,1,0,1,0]};
function oo_stream(c,green){const S=OO_NEAR.stream;c.save();c.lineCap="round";c.lineJoin="round";
  const path=()=>{c.beginPath();oo_curve(c,S);};
  path();c.strokeStyle=rgba(green?[96,108,66]:[150,126,92],0.9);c.lineWidth=20;c.stroke();
  path();c.strokeStyle=rgba(green?OO_K.water:[198,180,146],1);c.lineWidth=11;c.stroke();
  if(green){path();c.strokeStyle=rgba(OO_K.waterHi,0.6);c.lineWidth=3;c.stroke();
    // trees along its banks
    for(let i=0;i<S.length;i++){const [x,y]=S[i];for(const d of [-18,18])oo_tree(c,x+d+((i*13)%7),y+4,0.09+i*0.008,{seed:i*11+d,far:1});}}
  else{const R=ag_rnd(4);for(let k=0;k<40;k++){const i=1+((R()*(S.length-1))|0),f=R(),x=lerp(S[i-1][0],S[i][0],f)+(R()-0.5)*6,y=lerp(S[i-1][1],S[i][1],f)+(R()-0.5)*5;
      c.fillStyle=rgba(R()<0.5?OO_K.stone:OO_K.stoneDk,0.9);c.beginPath();c.ellipse(x,y,2+R()*2.5,1.4+R()*1.6,0,0,TAU);c.fill();}}
  c.restore();}
// a gully: a channel that wanders down the slope, narrow where it starts and wider and deeper below, with small rills joining it. The
// sun is on the right, so the channel's left wall, which faces it, is lit, and its right wall is in shade. Grassed over, years later
function oo_gully(c,G,green,seed){const [p0,p1,p2,p3,w0,w1]=G,R=ag_rnd(60+seed),n=40,Lft=[],Rgt=[],mid=[],bz=[p0[0],p0[1],p1[0],p1[1],p2[0],p2[1],p3[0],p3[1]];
  for(let i=0;i<=n;i++){const u=i/n,[x,y]=ag_bz(bz,u),[x2,y2]=ag_bz(bz,Math.min(1,u+0.01)),[x1,y1]=ag_bz(bz,Math.max(0,u-0.01)),d=Math.hypot(x2-x1,y2-y1)||1,nx=-(y2-y1)/d,ny=(x2-x1)/d,
    w=lerp(w0,w1,Math.pow(u,0.8))*(1+0.28*Math.sin(u*17+seed)+0.12*Math.sin(u*41+seed*2)),mx=x+Math.sin(u*9+seed)*w*0.25;mid.push([mx,y,nx,ny,w]);
    Lft.push([mx-nx*w/2,y-ny*w/2]);Rgt.push([mx+nx*w/2,y+ny*w/2]);}
  const poly=(A,B)=>{c.beginPath();A.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));for(let i=B.length-1;i>=0;i--)c.lineTo(B[i][0],B[i][1]);c.closePath();};
  if(green){poly(Lft,Rgt);c.fillStyle=rgba(ag_dk(OO_K.turf,0.14),0.16);c.fill();return;}
  // the rills that feed it: faint lines in the soil, joining from either side
  for(let k=0;k<4;k++){const i=8+((R()*(n-14))|0),[mx,y,nx,ny,w]=mid[i],sd=k%2?-1:1,l=40+R()*70;
    ag_taper(c,[mx+sd*(w/2+l),y-l*0.5],[mx+sd*(w/2+l*0.6),y-l*0.3],[mx+sd*w*0.7,y-l*0.1],[mx+sd*w*0.35,y],1.5,Math.max(2.5,w*0.12),rgba(ag_dk(OO_K.soil,0.2),0.45));}
  // the channel's rim, the lit left wall, the floor in shade
  poly(Lft.map(q=>[q[0]-3,q[1]]),Rgt.map(q=>[q[0]+3,q[1]]));c.fillStyle=rgba(ag_dk(OO_K.soil,0.12),0.6);c.fill();
  poly(Lft,Rgt);c.fillStyle=rgba(mix(OO_K.soilHi,OO_K.soil,0.3),0.95);c.fill();
  poly(mid.map(([mx,y,nx,ny,w])=>[mx-nx*w*0.1,y-ny*w*0.1]),Rgt);c.fillStyle=rgba(OO_K.soilDk,0.85);c.fill();
  poly(mid.map(([mx,y,nx,ny,w])=>[mx+nx*w*0.18,y+ny*w*0.18]),Rgt);c.fillStyle=rgba(ag_dk(OO_K.soilDk,0.3),0.6);c.fill();
  // stones washed into its floor
  for(let k=0;k<14;k++){const [mx,y,nx,ny,w]=mid[4+((R()*(n-4))|0)];c.fillStyle=rgba(R()<0.5?OO_K.stone:OO_K.stoneDk,0.85);c.beginPath();c.ellipse(mx+nx*w*0.1+(R()-0.5)*w*0.2,y,1.5+w*0.06*R(),1+w*0.04*R(),0,0,TAU);c.fill();}}
function oo_paintNear(c,green){const R=ag_rnd(91),T=OO_NEAR.top;
  const top=[];for(let x=-20;x<=W+20;x+=20)top.push([x,T(x)]);
  const body=cc=>{cc.moveTo(-20,H);for(const p of top)cc.lineTo(p[0],p[1]);cc.lineTo(W+20,H);cc.closePath();};
  const soil=green?mix(OO_K.turf,[150,150,92],0.4):OO_K.soil,soilDk=green?mix(OO_K.turfDk,OO_K.soilDk,0.2):OO_K.soilDk;
  let g=c.createLinearGradient(0,730,0,H);g.addColorStop(0,rgba(mix(soil,OO_K.dust,0.3),1));g.addColorStop(0.4,rgba(soil,1));g.addColorStop(1,rgba(soilDk,1));
  ag_shape(c,body);c.fillStyle=g;c.fill();
  c.save();ag_shape(c,body);c.clip();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(52,44,52,0.2)");g.addColorStop(0.5,"rgba(52,44,52,0.03)");g.addColorStop(1,"rgba(255,226,180,0.12)");c.fillStyle=g;c.fillRect(0,600,W,H);
  // the slope's lie: soft bands across it; grit and small stones
  for(let k=0;k<8;k++){const y0=790+k*38+R()*10;c.strokeStyle=rgba(k%2?OO_K.soilHi:OO_K.soilDk,green?0.06:0.12);c.lineWidth=4+R()*6;c.beginPath();c.moveTo(-20,y0);for(let x=0;x<=W;x+=80)c.lineTo(x,y0+oo_wob(x/240,k)*7-(x-960)*0.012);c.stroke();}
  if(!green)for(let k=0;k<700;k++){const x=R()*W,y=T(x)+8+R()*(H-T(x));c.fillStyle=rgba(R()<0.5?OO_K.soilHi:ag_dk(OO_K.soilDk,0.2),0.3+R()*0.3);c.beginPath();c.ellipse(x,y,1+R()*2.4,0.8+R()*1.4,R()*3,0,TAU);c.fill();}
  // the gullies: a channel in shade, its sunlit wall on the right, narrow where it starts and deeper as it runs down; years later,
  // grassed over, only a soft dip
  for(const [gi,G] of OO_NEAR.gullies.entries())oo_gully(c,G,green,gi);
  // tufts: a little dry grass in patches on the bare soil; thick turf years later
  const tufts=green?900:520;for(let k=0;k<tufts;k++){let x=R()*W,y=T(x)+6+R()*(H-T(x));if(!green){const cx=[160,640,980,1460,1760][k%5],cy=[800,860,960,840,980][k%5];x=cx+(R()-0.5)*R()*700;y=Math.max(T(x)+6,cy+(R()-0.5)*R()*260);}
    const s=lerp(0.6,1.7,(y-730)/350),col=green?(R()<0.5?OO_K.turfDk:OO_K.leafHi):(R()<0.6?OO_K.grass:OO_K.dust);
    c.strokeStyle=rgba(col,green?0.45:0.8);c.lineWidth=1.5*s;for(let b=0;b<3;b++){const an=-Math.PI/2+(b-1)*0.42+(R()-0.5)*0.3,l=(6+R()*8)*s;c.beginPath();c.moveTo(x+b*2*s,y);c.quadraticCurveTo(x+b*2*s+Math.cos(an)*l*0.4,y+Math.sin(an)*l*0.6,x+b*2*s+Math.cos(an)*l,y+Math.sin(an)*l);c.stroke();}}
  // the stumps of the trees that were cut, the cut face pale with rings
  if(!green)for(const [x,y,r] of OO_NEAR.stumps){ag_floorShadow(c,x-r*0.9,y+4,r*1.6,r*0.34,0.45);
    ag_soft(c,cc=>{cc.moveTo(x-r,y);cc.bezierCurveTo(x-r*0.96,y-r*0.4,x-r*0.94,y-r*0.7,x-r*0.9,y-r*0.9);cc.lineTo(x+r*0.9,y-r*0.9);cc.bezierCurveTo(x+r*0.94,y-r*0.7,x+r*0.98,y-r*0.4,x+r*1.06,y);cc.quadraticCurveTo(x,y+r*0.26,x-r,y);cc.closePath();},
      OO_K.bark,ag_lt(OO_K.bark,0.25),x+r*0.6,y-r*0.6,r*1.4,"rgba(30,20,16,0.5)",8);
    c.fillStyle=rgba(OO_K.stub,1);c.beginPath();c.ellipse(x,y-r*0.9,r*0.92,r*0.3,0,0,TAU);c.fill();c.strokeStyle=rgba(ag_dk(OO_K.stub,0.3),0.55);c.lineWidth=1.2;
    for(const f of [0.3,0.55,0.8]){c.beginPath();c.ellipse(x+r*0.04,y-r*0.9,r*0.92*f,r*0.3*f,0,0,TAU);c.stroke();}}
  // its crest against the hills beyond: a lighter rim where the sun catches it
  c.strokeStyle=rgba(green?OO_K.leafHi:OO_K.soilHi,0.45);c.lineWidth=3;c.beginPath();top.forEach((p,i)=>i?c.lineTo(p[0],p[1]+2):c.moveTo(p[0],p[1]+2));c.stroke();
  c.restore();
  // years later: the row the women planted, grown into trees, and others along the slope
  if(green){for(const [x,y,s] of [[150,800,0.66],[1760,812,0.7]])oo_tree(c,x,y,s,{seed:x});OO_ROW.pts.forEach(([x,y],i)=>{if(OO_ROW.alive[i])oo_tree(c,x,y,0.5+((i*37)%5)*0.03,{seed:200+i});});}}
function oo_paintHills(c,green){oo_sky(c,540);oo_mountain(c);oo_far(c);
  oo_paintHill(c,OO_HILLS[0],green);oo_stream(c,green);oo_paintHill(c,OO_HILLS[1],green);oo_paintNear(c,green);
  const g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.2));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.ooHills=c=>oo_paintHills(c,false);
AG_PLACES.ooGreen=c=>oo_paintHills(c,true);
AG_ROOMS.ooGreen="ooHills";

/* ---------------------------------------------------------------- a tree */
// a broad-leaved tree of the highlands, its crown spreading wider than it is tall: a trunk that forks into limbs, tapering, and clumps of
// leaves at the limbs' ends, dark below and on the left, lit from the right; its shadow on the ground to the left. h = 300 s px tall.
// o.seed; o.far: a small tree far away (a few clumps, no shadow); o.haze: how far the air pales it
function oo_tree(c,x,base,s,o){o=o||{};const R=ag_rnd(o.seed||1),h=300*s,far=!!o.far,hz=o.haze||0,sky=mix(OO_K.sky1,OO_K.far0,0.3),
    L=col=>rgba(mix(col,sky,hz),1);
  if(far){// a far tree: a short trunk and a few soft clumps
    if(h>44){c.fillStyle=L(OO_K.barkDk);c.fillRect(x-h*0.02,base-h*0.36,Math.max(1.4,h*0.04),h*0.36);}
    const cy=base-h*(h>44?0.6:0.36),rw=h*0.36,n=3+((R()*2)|0),cl=[];for(let i=0;i<n;i++)cl.push([x+(i/(n-1)-0.5)*rw*1.1+(R()-0.5)*rw*0.3,cy+(R()-0.5)*h*0.12,h*(0.22+R()*0.08)]);
    for(const [px,py,r] of cl){c.fillStyle=L(OO_K.leafDk);c.beginPath();c.ellipse(px,py+r*0.1,r,r*0.82,0,0,TAU);c.fill();}
    for(const [px,py,r] of cl){c.fillStyle=L(OO_K.leaf);c.beginPath();c.ellipse(px+r*0.18,py-r*0.1,r*0.72,r*0.56,0,0,TAU);c.fill();}
    for(const [px,py,r] of cl){c.fillStyle=L(OO_K.leafHi);c.beginPath();c.ellipse(px+r*0.36,py-r*0.26,r*0.34,r*0.26,0,0,TAU);c.fill();}
    return;}
  ag_floorShadow(c,x-h*0.4,base+3,h*0.5,h*0.07,0.42);
  // the crown's masses: one high in the middle, two lower at the sides, one behind; each a cluster of rounded clumps
  const lean=(R()-0.5)*0.1,fx=x+lean*h*0.3,fy=base-h*0.38,tw=h*0.085,
    M=[[-0.2,0.56,0.17],[0.03,0.74,0.2],[0.22,0.6,0.16],[-0.04,0.6,0.15]].map(([dx,dy,r])=>[fx+(dx+(R()-0.5)*0.04)*h,base-(dy+(R()-0.5)*0.03)*h,r*h*(0.9+R()*0.2)]);
  // the trunk, flaring a little at the root, forking at under half its height; a limb up into each mass, so they show between them
  ag_taper(c,[x,base],[x+lean*h*0.1,base-h*0.14],[fx-lean*h*0.1,fy+h*0.1],[fx,fy],tw,tw*0.66,rgba(OO_K.bark,1));
  c.fillStyle=rgba(OO_K.bark,1);c.beginPath();c.moveTo(x-tw*0.9,base+1);c.quadraticCurveTo(x-tw*0.4,base-tw*0.3,x-tw*0.36,base-tw*1.4);c.lineTo(x+tw*0.36,base-tw*1.4);c.quadraticCurveTo(x+tw*0.45,base-tw*0.3,x+tw*0.95,base+1);c.closePath();c.fill();
  for(const [mx,my,r] of M.slice(0,3)){const ex=mx,ey=my+r*0.3;ag_taper(c,[fx,fy],[lerp(fx,ex,0.2),lerp(fy,ey,0.45)],[lerp(fx,ex,0.7),lerp(fy,ey,0.8)],[ex,ey],tw*0.6,tw*0.22,rgba(OO_K.bark,1));}
  c.fillStyle=rgba(OO_K.barkDk,0.55);c.beginPath();c.moveTo(x-tw*0.5,base);c.bezierCurveTo(x-tw*0.46,base-h*0.14,fx-tw*0.42,fy+h*0.1,fx-tw*0.32,fy);c.lineTo(fx-tw*0.06,fy);c.bezierCurveTo(fx-tw*0.1,fy+h*0.1,x-tw*0.12,base-h*0.14,x-tw*0.1,base);c.closePath();c.fill();
  // each mass: its clumps' dark undersides, then their bodies, lighter towards the sun, then the light on their tops
  const order=[3,0,2,1];for(const mi of order){const [mx,my,r]=M[mi],cl=[];for(let i=0;i<8;i++){const an=i/8*TAU+R()*0.5,d=r*(0.45+R()*0.25);cl.push([mx+Math.cos(an)*d*1.15,my+Math.sin(an)*d*0.75,r*(0.42+R()*0.16)]);}
    cl.push([mx,my,r*0.62]);const back=mi===3?0.18:0;
    c.fillStyle=rgba(mix(OO_K.leafDk,[40,52,36],back),1);c.beginPath();for(const [px,py,rr] of cl){c.moveTo(px+rr*1.06,py+rr*0.12);c.ellipse(px,py+rr*0.12,rr*1.06,rr*0.9,0,0,TAU);}c.fill();
    for(const [px,py,rr] of cl){const lit=clamp(0.45+(px-mx)/r*0.4-(py-my)/r*0.45-back*2,0,1);c.fillStyle=rgba(mix(OO_K.leafDk,OO_K.leaf,0.3+lit*0.7),1);c.beginPath();c.ellipse(px+rr*0.08,py-rr*0.06,rr*0.88,rr*0.68,0,0,TAU);c.fill();}
    for(const [px,py,rr] of cl){const lit=(px-mx)/r*0.7-(py-my)/r*0.8-back*3;if(lit<0.1)continue;c.fillStyle=rgba(OO_K.leafHi,clamp(lit*0.9,0,0.8));c.beginPath();c.ellipse(px+rr*0.26,py-rr*0.28,rr*0.44,rr*0.28,0,0,TAU);c.fill();}}}

/* ---------------------------------------------------------------- a seedling */
// at (x, y), where it meets the soil; s its size (1: about 120 px tall, grown). o.g how far it has grown (0 to 1); o.dry how far it
// has died (0 to 1: the leaves brown, drooping, falling); o.sleeve in a plastic sleeve of soil, as in a nursery; o.a
function oo_seedling(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const g=clamp(o.g==null?1:o.g,0,1),dry=clamp(o.dry||0,0,1),R=ag_rnd(o.seed||7);
  ctx.save();ctx.globalAlpha*=a;
  if(o.sleeve){const sw=22*s,sh=34*s;ctx.fillStyle=rgba(OO_K.sleeve,1);ctx.beginPath();ctx.moveTo(x-sw/2,y);ctx.lineTo(x-sw/2+1*s,y+sh);ctx.quadraticCurveTo(x,y+sh+4*s,x+sw/2-1*s,y+sh);ctx.lineTo(x+sw/2,y);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(OO_K.sleeveHi,0.5);ctx.fillRect(x+sw*0.18,y+3*s,2.4*s,sh-6*s);ctx.fillStyle=rgba(OO_K.soilDk,1);ctx.beginPath();ctx.ellipse(x,y,sw/2,4*s,0,0,TAU);ctx.fill();}
  else{ctx.fillStyle=rgba(ag_dk(OO_K.soil,0.12),1);ctx.beginPath();ctx.ellipse(x,y+2*s,22*s,6*s,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(OO_K.soilHi,0.6);ctx.beginPath();ctx.ellipse(x+4*s,y,14*s,3.4*s,0,0,TAU);ctx.fill();}
  if(g<=0.01){ctx.restore();return;}
  const h=(30+90*g)*s,lean=(R()-0.5)*0.12+dry*0.35,tip=[x+lean*h,y-h*(1-dry*0.3)],stem=mix([96,104,62],[132,104,70],dry),lf=mix(OO_K.leaf,[150,116,76],dry),lh=mix(OO_K.leafHi,[184,150,100],dry);
  ag_taper(ctx,[x,y],[x,y-h*0.4],[x+lean*h*0.5,y-h*0.7],tip,Math.max(1.6,3.4*s*(0.6+g*0.6)),1.2*s,rgba(stem,1));
  // leaves in pairs up the stem, the top ones small; drooping and falling as it dies
  const n=o.lite?1+Math.round(g*2):2+Math.round(g*4);for(let i=0;i<n;i++){const f=0.3+0.7*(i+1)/n,px=lerp(x,tip[0],f),py=lerp(y,tip[1],f),l=(14+16*(1-f*0.5))*s*(0.6+g*0.5);
    for(const sd of [-1,1]){if(dry>0.6&&(i+sd+2)%3===0)continue;const an=-Math.PI/2+sd*(0.9+dry*1.3)+(R()-0.5)*0.3,ex=px+Math.cos(an)*l,ey=py+Math.sin(an)*l,nx=-Math.sin(an),ny=Math.cos(an),w=l*0.32;
      ctx.fillStyle=rgba(sd>0?lh:lf,1);ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo((px+ex)/2+nx*w,(py+ey)/2+ny*w,ex,ey);ctx.quadraticCurveTo((px+ex)/2-nx*w*0.6,(py+ey)/2-ny*w*0.6,px,py);ctx.fill();
      ctx.strokeStyle=rgba(ag_dk(lf,0.3),0.5);ctx.lineWidth=0.9*s;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo((px+ex*1.6)/2.6,(py+ey*1.6)/2.6);ctx.stroke();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the near slope in the rain */
// water running down the gullies, red with the soil it carries, and spreading into the stream bed; a: how much (0 to 1)
function oo_run(ctx,t,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  for(const G of OO_NEAR.gullies){for(let i=1;i<G.length;i++){const w=lerp(3,22,i/G.length);ctx.strokeStyle=rgba([150,90,62],0.7);ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(G[i-1][0],G[i-1][1]);ctx.lineTo(G[i][0],G[i][1]);ctx.stroke();}
    // the flow: light streaks moving down, the water's surface
    ctx.strokeStyle=rgba([222,176,140],0.55);ctx.setLineDash([18,26]);ctx.lineDashOffset=-t*90;ctx.lineWidth=3;ctx.beginPath();oo_curve(ctx,G);ctx.stroke();ctx.setLineDash([]);}
  const S=OO_NEAR.stream;ctx.strokeStyle=rgba([152,96,66],0.55*a);for(let i=1;i<S.length;i++){ctx.lineWidth=lerp(6,30,i/S.length);ctx.beginPath();ctx.moveTo(S[i-1][0],S[i-1][1]);ctx.lineTo(S[i][0],S[i][1]);ctx.stroke();}
  // the rain itself: fine slanted lines, falling from the right, few and soft
  const Rr=ag_rnd(5);ctx.strokeStyle="rgba(230,232,236,0.32)";ctx.lineWidth=1.6;for(let k=0;k<90;k++){const x0=Rr()*2200,y0=((Rr()*H+t*900)%(H+200))-100;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0-14,y0+36);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the nursery */
function oo_paintNursery(c){const R=ag_rnd(77);oo_sky(c,560);oo_far(c);
  // the hill behind, with its farms (the left hill again, set lower)
  c.save();c.translate(240,60);oo_paintHill(c,OO_HILLS[1],false);c.restore();
  // the nursery's ground: packed earth, swept
  let g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,rgba(OO_K.earth,1));g.addColorStop(1,rgba(OO_K.earthDk,1));c.fillStyle=g;c.fillRect(0,700,W,H-700);
  c.fillStyle="rgba(60,44,34,0.18)";c.fillRect(0,700,W,6);
  for(let k=0;k<600;k++){const x=R()*W,y=706+R()*(H-706);c.fillStyle=rgba(R()<0.5?ag_lt(OO_K.earth,0.2):OO_K.earthDk,0.4);c.beginPath();c.ellipse(x,y,1+R()*2.4,0.8+R()*1.2,0,0,TAU);c.fill();}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(52,44,52,0.16)");g.addColorStop(1,"rgba(255,230,190,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the shade over the beds: four poles of rough timber, a beam, and a roof of dry grass laid in bundles; under it, the ground cooler
  g=c.createLinearGradient(0,700,0,900);g.addColorStop(0,"rgba(60,44,34,0.16)");g.addColorStop(1,"rgba(60,44,34,0)");c.fillStyle=g;c.fillRect(80,700,1780,200);
  for(let k=0;k<26;k++)oo_blob(c,120+R()*1700,760+R()*110,30+R()*50,8+R()*8,[255,236,200],0.1);
  for(const x of [150,720,1240,1790]){const w=13+R()*4;ag_soft(c,cc=>{cc.moveTo(x-w,792);cc.bezierCurveTo(x-w+3,600,x-w-2,420,x-w+4,236);cc.lineTo(x+w-3,236);cc.bezierCurveTo(x+w+2,420,x+w-2,600,x+w+1,792);cc.closePath();},OO_K.pole,ag_lt(OO_K.pole,0.32),x+w,400,240,"rgba(40,28,20,0.45)",8);
    ag_floorShadow(c,x-30,794,34,8,0.42);}
  ag_soft(c,cc=>{cc.moveTo(96,226);cc.lineTo(1846,222);cc.lineTo(1846,246);cc.lineTo(96,250);cc.closePath();},OO_K.poleDk,ag_lt(OO_K.pole,0.2),1500,226,600,null);
  // the roof: dry grass laid over thin poles in rows of bundles, its ends hanging a little over the beam; lit along the top, darker below
  const roof=cc=>{cc.moveTo(30,252);for(let x=30;x<=1910;x+=30)cc.lineTo(x,256+oo_wob(x/60,5)*7);cc.lineTo(1910,176);for(let x=1910;x>=30;x-=50)cc.lineTo(x,168+oo_wob(x/160,3)*8);cc.closePath();};
  ag_soft(c,roof,OO_K.thatchDk,OO_K.thatch,1500,176,1000,"rgba(60,40,24,0.35)",12);
  c.save();ag_shape(c,roof);c.clip();
  for(let row=0;row<4;row++){const y0=164+row*22;for(let k=0;k<420;k++){const x=20+R()*1890,y=y0+R()*14,l=22+R()*26,an=Math.PI/2+0.35+(R()-0.5)*0.3;
      c.strokeStyle=rgba(R()<0.45?ag_lt(OO_K.thatch,0.12):R()<0.6?OO_K.thatchDk:OO_K.thatch,0.7);c.lineWidth=1.4+R()*1.4;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);c.stroke();}
    c.fillStyle="rgba(60,40,24,0.12)";c.fillRect(0,y0+16,W,4);}
  c.restore();
  // the grass's ends hanging below its edge
  for(let k=0;k<520;k++){const x=30+R()*1880,y=250+oo_wob(x/60,5)*6,l=6+R()*16,an=Math.PI/2+0.3+(R()-0.5)*0.4;c.strokeStyle=rgba(R()<0.5?OO_K.thatchDk:OO_K.thatch,0.8);c.lineWidth=1.3+R();
    c.beginPath();c.moveTo(x,y-4);c.lineTo(x+Math.cos(an)*l,y-4+Math.sin(an)*l);c.stroke();}
  
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.22));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.ooNursery=c=>oo_paintNursery(c);
// the two beds: low walls of earth with rows of seedlings in their sleeves; o.g (0 to 1) how far they've grown, o.a; o.cut: where people
// stand behind them (the beds' back edge, for lp_person's cut)
const OO_BEDS=[{x0:110,x1:900,y:796},{x0:1020,x1:1810,y:796}];
function oo_beds(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(const [bi,B] of OO_BEDS.entries()){const R=ag_rnd(300+bi);
    ag_floorShadow(ctx,(B.x0+B.x1)/2-30,B.y+76,(B.x1-B.x0)*0.56,18,0.4);
    // the bed: a shallow trench edged with a low ridge of earth, the sleeves packed in it, row after row
    ag_soft(ctx,cc=>ag_rect(cc,B.x0-10,B.y-6,B.x1-B.x0+20,78,12),OO_K.earthDk,ag_lt(OO_K.earth,0.1),B.x1-80,B.y,420,"rgba(40,28,20,0.35)",12);
    for(let r=0;r<5;r++){const y=B.y+4+r*13,s=0.62+r*0.04,step=19*s,n=Math.floor((B.x1-B.x0-24)/step),full=r>=3;
      for(let i=0;i<n;i++){const x=B.x0+14+i*step+(r%2)*step/2,g=clamp((o.g==null?1:o.g)*(0.82+R()*0.3),0,1);oo_seedling(ctx,x,y,s,{g,sleeve:r===4,seed:bi*97+r*31+i,lite:!full});}}
    // the ridge along the bed's front
    ag_soft(ctx,cc=>{cc.moveTo(B.x0-14,B.y+60);cc.quadraticCurveTo((B.x0+B.x1)/2,B.y+52,B.x1+14,B.y+60);cc.lineTo(B.x1+14,B.y+76);cc.quadraticCurveTo((B.x0+B.x1)/2,B.y+84,B.x0-14,B.y+76);cc.closePath();},OO_K.earth,ag_lt(OO_K.earth,0.2),B.x1-100,B.y+58,300,"rgba(40,28,20,0.3)",8);}
  ctx.restore();}

/* ---------------------------------------------------------------- the people of the hills, for lp_person
   Wangari Maathai, a biologist at the university in Nairobi in the 1970s, in a plain cardigan, her hair short; three women who farm
   the hills, in a cardigan or a sweater against the highlands' cool mornings, the hair under a plain headscarf tied at the nape. The
   scarves and clothes are plain cloth, in colours that mean nothing in these films; no pattern is drawn from any culture's cloth. */
// a headscarf over the hair, from the brow back over the crown, tied at the nape, the knot's short ends hanging behind the neck: inside
// the head's picture (figure x 160 to 440, y 250 to 560)
function oo_scarf(col){return(c,P)=>{const f=cc=>{cc.moveTo(392,354);cc.bezierCurveTo(396,312,370,276,312,268);cc.bezierCurveTo(258,262,206,290,194,348);
    cc.bezierCurveTo(186,392,196,434,216,458);cc.bezierCurveTo(236,440,248,410,268,394);cc.bezierCurveTo(300,374,348,360,392,354);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.3),344,290,140,rgba(ag_dk(col,0.7),0.5),14);
  // the folds, drawn from the knot over the crown, and the hem along the brow
  c.save();ag_shape(c,f);c.clip();c.strokeStyle=rgba(ag_dk(col,0.45),0.4);c.lineWidth=2.6;c.lineCap="round";
  for(const [x1,y1] of [[290,280],[340,294],[372,322],[384,346]]){c.beginPath();c.moveTo(208,446);c.quadraticCurveTo((208+x1)/2-16,(446+y1)/2-36,x1,y1);c.stroke();}
  c.strokeStyle=rgba(ag_lt(col,0.35),0.38);c.lineWidth=2;c.beginPath();c.moveTo(246,292);c.quadraticCurveTo(300,272,352,290);c.stroke();c.restore();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.65);c.lineWidth=3;c.beginPath();c.moveTo(390,356);c.bezierCurveTo(346,362,300,376,268,396);c.stroke();
  // the knot at the nape, and its two short ends behind the neck
  ag_soft(c,cc=>{cc.moveTo(206,456);cc.bezierCurveTo(200,476,192,494,182,508);cc.lineTo(196,512);cc.bezierCurveTo(206,498,216,480,220,460);cc.closePath();},ag_dk(col,0.14),ag_lt(col,0.2),206,476,36,null);
  ag_soft(c,cc=>{cc.moveTo(214,458);cc.bezierCurveTo(216,478,218,494,216,512);cc.lineTo(230,510);cc.bezierCurveTo(230,492,226,476,222,460);cc.closePath();},col,ag_lt(col,0.25),224,484,36,null);
  ag_soft(c,cc=>cc.ellipse(210,454,17,13,-0.5,0,TAU),col,ag_lt(col,0.3),216,448,22,rgba(ag_dk(col,0.7),0.4),6);}}
const OO_PEOPLE={
  maathai:{name:"Wangari Maathai",role:"A biologist",key:"oo-maathai",skin:[112,72,52],hair:{style:"coily",c:[28,22,20]},earrings:[214,196,160],top:{kind:"cardigan",c:[128,104,86],inner:[232,226,214]},breath:0.27},
  wan:{name:"A farmer",key:"oo-woman1",skin:[100,64,46],hair:{style:"cropped",c:[26,22,20]},top:{kind:"sweater",c:[98,88,80]},hat:{paint:oo_scarf([178,128,118])},breath:0.3},
  nya:{name:"A farmer",key:"oo-woman2",skin:[124,82,58],hair:{style:"cropped",c:[28,24,22]},top:{kind:"cardigan",c:[118,66,60],inner:[218,206,186]},hat:{paint:oo_scarf([222,210,190])},breath:0.32},
  mum:{name:"A farmer",key:"oo-woman3",skin:[90,58,42],hair:{style:"cropped",c:[60,56,54]},top:{kind:"cardigan",c:[132,120,100],inner:[206,196,180]},hat:{paint:oo_scarf([88,74,66])},breath:0.25}
};
const OO_WOMEN=[OO_PEOPLE.wan,OO_PEOPLE.nya,OO_PEOPLE.mum];
