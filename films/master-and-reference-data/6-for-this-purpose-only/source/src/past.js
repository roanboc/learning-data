/* ===== For this purpose only: the past =====
   India, about two thousand years ago, in the series' pencil and wash: a teacher's thatched shelter under a banyan on a hot plain, its
   brick fire altar, and a village street of plastered walls and thatched roofs. The people are dressed after Indian sculpture of the
   period: an unstitched lower garment and an upper cloth, bare feet, hair tied up; the woman next door in a long wrap with a cloth over
   her head. No jewellery, and no marks of any community, place or caste. The book is a palm-leaf manuscript bound with a cord between
   two boards; its writing is drawn as lines, not as the letters of any script. Every name starts with m6_ or M6_. */

const M6P={hills:[170,178,200],dry:[230,212,150],dry2:[216,202,134],green:[164,188,110],earth:[226,192,140],road:[240,218,172],
  leaf:[92,138,92],leaf2:[124,164,100],bark:[160,136,112],thatch:[210,174,108],thatchDark:[166,128,78],plaster:[244,234,212],
  ochre:[232,198,146],lime:[238,212,190],wood:[156,108,70],woodDark:[106,72,50],brick:[200,116,86],palm:[112,148,92],
  palmTrunk:[164,136,104],stone:[200,190,174],inside:[118,82,58]};
const M6_GLOW=[255,206,120];

/* ---------- painting helpers ---------- */
// a soft blob with a leafy edge: an ellipse whose radius ripples
function m6_blob(cx,cy,rx,ry,seed,n){n=n||48;const R=wc_rng(seed),k1=3+Math.floor(R()*3),k2=7+Math.floor(R()*4),p1=R()*TAU,p2=R()*TAU,o=[];
  for(let i=0;i<n;i++){const a=i/n*TAU,r=1+0.07*Math.sin(k1*a+p1)+0.05*Math.sin(k2*a+p2);o.push([cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r]);}return o;}
// the warm haze of a hot day, low in the sky
function m6_haze(ctx,hz){ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,hz-300,0,hz+30);
  g.addColorStop(0,"rgba(255,240,214,0)");g.addColorStop(1,"rgba(255,224,176,0.55)");ctx.fillStyle=g;ctx.fillRect(0,hz-300,W,330);ctx.restore();}
// straw on a thatched roof: short strokes down its slope, inside pts
function m6_straw(ctx,pts,col,seed,n,len){const b=wc_bbox(pts),R=wc_rng(seed);ctx.save();wc_tr(ctx,pts);ctx.clip();ctx.lineCap="round";
  for(let i=0;i<n;i++){const x=b.x0+R()*b.w,y=b.y0+R()*b.h,l=len*(0.6+R()*0.8);ctx.strokeStyle=rgba(col,0.18+R()*0.25);ctx.lineWidth=1+R()*1.4;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(R()-0.5)*4,y+l);ctx.stroke();}ctx.restore();}
// a thatched roof: the thatch, its thick eave and its straw; front: [x0,x1] at the eave's y, back: [x0,x1] at the ridge's y
function m6_roof(ctx,x0,x1,ye,r0,r1,yr,depth,seed){const P=M6P,pts=[[x0,ye],[x1,ye],[r1,yr],[r0,yr]];
  wc_wash(ctx,pts,P.thatch,{depth,kind:"build",lw:1.5,seed});m6_straw(ctx,pts,P.thatchDark,seed,Math.round((x1-x0)*(ye-yr)/260),(ye-yr)*0.18);
  wc_wash(ctx,[[x0-6,ye-4],[x1+6,ye-4],[x1+2,ye+16],[x0-2,ye+16]],wc_dim(P.thatch,0.12),{depth,kind:"trim",lw:1.3,seed:seed+3});
  m6_straw(ctx,[[x0-6,ye-4],[x1+6,ye-4],[x1+2,ye+16],[x0-2,ye+16]],P.thatchDark,seed+5,Math.round((x1-x0)/3),14);}
// a palm: a slender trunk leaning a little, ringed, and a crown of fronds
function m6_palm(ctx,x,y,h,depth,lean,seed){const P=M6P,R=wc_rng(seed||3),top=[x+lean*h,y-h],mid=[x+lean*h*0.35,y-h*0.5],line=wc_smooth([[x,y],mid,top],8);
  wc_wash(ctx,wc_band(line,h*0.05,h*0.032),P.palmTrunk,{depth,kind:"trunk",lw:1.2,seed});
  if(depth>0.4){ctx.save();ctx.strokeStyle=rgba(wc_dim(P.palmTrunk,0.3),0.35*depth);ctx.lineWidth=1.2;for(let i=1;i<14;i++){const q=wc_along(line,i/14),w=h*0.04;ctx.beginPath();ctx.moveTo(q[0]-w,q[1]);ctx.lineTo(q[0]+w,q[1]+2);ctx.stroke();}ctx.restore();}
  for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*0.36+(R()-0.5)*0.2,L=h*(0.34+R()*0.1),droop=0.55+R()*0.3,pts=[],side=[];
    for(let k=0;k<=8;k++){const u=k/8,ang=a+Math.sign(Math.cos(a)||1)*droop*u*u*1.6*(Math.abs(Math.cos(a))+0.3),px=top[0]+Math.cos(a)*L*u+Math.cos(ang)*0,py=top[1]+Math.sin(a)*L*u+droop*u*u*L*0.55;
      const wd=h*0.026*Math.sin(Math.PI*Math.min(1,u*1.15));pts.push([px,py-wd]);side.unshift([px,py+wd]);}
    wc_wash(ctx,pts.concat(side),i%2?P.palm:wc_lit(P.palm,0.1),{depth,kind:"tree",lw:1,seed:seed*7+i});}}
// a banyan: a wide, low crown, a fluted trunk, and roots hanging from its branches, some grown down into pillars
function m6_banyan(ctx,x,y,s,depth){const P=M6P,cy=y-330*s;
  for(let i=0;i<14;i++){const R=wc_rng(80+i),rx=x+(i-6.5)*48*s+(R()-0.5)*30*s,top=cy+60*s+R()*40*s,thick=i%4===1;
    wc_wash(ctx,wc_band(wc_smooth([[rx,top],[rx+(R()-0.5)*14*s,(top+y)/2],[rx+(R()-0.5)*10*s,thick?y:top+(y-top)*(0.45+R()*0.4)]],6),thick?9*s:3*s,thick?11*s:2*s),wc_dim(P.bark,0.06),{depth,kind:"trunk",lw:1,seed:60+i});}
  wc_wash(ctx,[[x-62*s,y],[x-40*s,y-120*s],[x-34*s,cy+70*s],[x+30*s,cy+70*s],[x+40*s,y-130*s],[x+70*s,y]],P.bark,{depth,kind:"trunk",lw:1.6,seed:51});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.bark,0.35),0.4);ctx.lineWidth=1.6;for(const dx of [-24,-6,12,28]){ctx.beginPath();ctx.moveTo(x+dx*s,y-6);ctx.quadraticCurveTo(x+dx*0.6*s,y-140*s,x+dx*0.5*s,cy+80*s);ctx.stroke();}ctx.restore();
  // the crown's underside in shadow, then its masses, darker behind, lit in front
  wc_wash(ctx,m6_blob(x,cy+60*s,400*s,70*s,7),wc_dim(P.leaf,0.18),{depth,kind:"tree",lw:1.2,seed:71});
  [[-250,-10,190,120,P.leaf],[230,0,200,120,P.leaf],[0,-60,260,140,P.leaf],[-120,30,200,100,P.leaf2],[140,40,210,100,P.leaf2],[-310,50,120,80,P.leaf2],[320,54,120,80,P.leaf2],[20,10,170,110,wc_lit(P.leaf2,0.08)]]
    .forEach(([dx,dy,rx,ry,c],i)=>wc_wash(ctx,m6_blob(x+dx*s,cy+dy*s,rx*s,ry*s,20+i),c,{depth,kind:"tree",lw:1.2,seed:90+i}));}
// a house of the village: a plastered wall on a raised plinth, a thatched roof, a door and a small barred window
function m6_house(ctx,x,y,w,h,col,depth,o){o=o||{};const P=M6P,ry=y-h,k=w/300;
  wc_wash(ctx,wc_rect(x-6,y-6,w+12,14),wc_dim(P.earth,0.08),{depth,kind:"trim",lw:1.2});
  wc_wash(ctx,wc_rect(x,ry,w,h),col,{depth,kind:"wall",lw:1.4,seed:o.seed||5});
  wc_wash(ctx,wc_rect(x,y-h*0.14,w,h*0.14),wc_dim(P.earth,0.04),{depth,kind:"wall",line:false,a:0.6,seed:(o.seed||5)+2});
  if(o.door!==false){const dw=w*0.2,dx=x+w*(o.dx==null?0.3:o.dx),dh=h*0.66;wc_wash(ctx,wc_rect(dx,y-dh,dw,dh),P.inside,{depth,kind:"door",lw:1.2});
    wc_wash(ctx,wc_rect(dx-4*k,y-dh-8*k,dw+8*k,8*k),P.woodDark,{depth,kind:"trim",lw:1});}
  if(o.win!==false){const wx=x+w*0.68,wy=ry+h*0.3,ww=w*0.14,wh=h*0.22;wc_wash(ctx,wc_rect(wx,wy,ww,wh),P.inside,{depth,kind:"door",lw:1});
    ctx.save();ctx.strokeStyle=rgba(wc_haze(P.woodDark,depth),0.9);ctx.lineWidth=Math.max(1.5,3*k);for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(wx+ww*i/4,wy);ctx.lineTo(wx+ww*i/4,wy+wh);ctx.stroke();}ctx.restore();}
  m6_roof(ctx,x-w*0.1,x+w*1.1,ry+6,x+w*0.12,x+w*0.88,ry-h*0.62,depth,(o.seed||5)+11);}
// land and field strips across the frame, each with a seed of its own, so the blotches where they dried fall where the stills were reviewed
const m6_land=(ctx,f,col,depth,o)=>wc_land(ctx,f,col,depth,Object.assign({seed:71},o||{}));
function m6_fieldStrips(ctx,f,y0,y1,n,cols,depth,seed){const R=wc_rng(seed||3);let prev=x=>f(x)+y0;for(let i=1;i<=n;i++){const t=i/n,off=lerp(y0,y1,t*t),skew=(R()-0.5)*0.05,cur=x=>f(x)+off+(x-960)*skew;
  const pts=[];for(let x=-60;x<=W+60;x+=16)pts.push([x,prev(x)]);for(let x=W+60;x>=-60;x-=16)pts.push([x,cur(x)]);wc_wash(ctx,pts,cols[i%cols.length],{depth,kind:"field",line:false,seed:71+i*29+(seed||3)});prev=cur;}}
// dry grass at the foot of something
function m6_grass(ctx,x0,x1,f,n,seed,col){const R=wc_rng(seed);ctx.save();ctx.lineCap="round";for(let i=0;i<n;i++){const x=lerp(x0,x1,R()),y=f(x)+R()*6,h=8+R()*16;
  ctx.strokeStyle=rgba(col||[150,150,92],0.5+R()*0.3);ctx.lineWidth=1.4+R();ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+(R()-0.5)*6,y-h*0.6,x+(R()-0.5)*10,y-h);ctx.stroke();}ctx.restore();}

/* ---------- the places ---------- */
// the plain: far hills in the heat, dry fields, palms, a village far off on the right; at left, a banyan, and under it a teacher's thatched
// shelter with a brick fire altar before it; a dusty road from the shelter to the village
const M6_HILL=x=>520-30*Math.exp(-Math.pow((x-280)/240,2))-40*Math.exp(-Math.pow((x-1560)/360,2))+5*Math.sin(x/90);
const M6_F1=x=>560+7*Math.sin(x/260+0.5),M6_F2=x=>650+12*Math.sin(x/340+1.2)-8*Math.exp(-Math.pow((x-1300)/300,2)),M6_F3=x=>848+14*Math.sin(x/420+0.3)+5*Math.sin(x/130);
const M6_ROAD=wc_smooth([[700,846],[860,800],[1040,742],[1220,688],[1360,644],[1470,612]],8);
// a footpath along a line, w0 wide at its near end and w1 at its far end
function m6_path(line,w0,w1){const L=[],R=[];line.forEach((q,i)=>{const a=line[Math.max(0,i-1)],b=line[Math.min(line.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,hw=lerp(w0,w1,i/(line.length-1))/2;
  L.push([q[0]-dy/d*hw,q[1]+dx/d*hw]);R.unshift([q[0]+dy/d*hw,q[1]-dx/d*hw]);});return L.concat(R);}
const M6_ALTAR=[560,792],M6_TEACH=[438,812],M6_STUD=[690,812];
function m6_ashram(ctx){const P=M6P;wc_sky(ctx,580,5,{sun:[1480,140],clouds:2,cx:260,cw:1300,cy:70,ch:150});m6_haze(ctx,580);
  m6_land(ctx,M6_HILL,P.hills,0.12,{line:false});m6_land(ctx,M6_F1,P.dry,0.22,{line:false});m6_fieldStrips(ctx,M6_F1,4,70,4,[P.dry,P.green],0.24,5);
  // the village far off, among its palms
  [[1380,598,64],[1470,602,80],[1580,596,70],[1680,600,86],[1790,604,64]].forEach(([x,y,w],i)=>m6_house(ctx,x,y,w,w*0.5,i%2?P.ochre:P.plaster,0.26,{seed:40+i,win:false,dx:0.4}));
  [[1350,600,150,0.04],[1530,598,180,-0.05],[1640,600,140,0.06],[1850,606,170,-0.03],[1180,620,210,0.05]].forEach(([x,y,h,l],i)=>m6_palm(ctx,x,y,h,0.3,l,i+2));
  m6_land(ctx,M6_F2,P.dry2,0.5);m6_fieldStrips(ctx,M6_F2,6,90,3,[P.dry2,P.green],0.52,8);
  [[930,M6_F2(930)+30,300,0.06],[1010,M6_F2(1010)+40,250,-0.04],[1110,M6_F2(1110)+26,330,0.03]].forEach(([x,y,h,l],i)=>m6_palm(ctx,x,y,h,0.56,l,i+11));
  wc_wash(ctx,m6_path(M6_ROAD,120,12),P.road,{depth:0.66,kind:"wall",line:false,seed:6});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.road,0.2),0.35);ctx.lineCap="round";for(const k of [-0.22,0.22]){ctx.lineWidth=3;ctx.beginPath();M6_ROAD.forEach((q,i)=>{const u=i/(M6_ROAD.length-1),hw=lerp(120,12,u)*k;i?ctx.lineTo(q[0],q[1]+hw):ctx.moveTo(q[0],q[1]+hw);});ctx.stroke();}ctx.restore();
  m6_grass(ctx,760,1440,x=>{let b=M6_ROAD[0],u=0;M6_ROAD.forEach((q,i)=>{if(Math.abs(q[0]-x)<Math.abs(b[0]-x)){b=q;u=i/(M6_ROAD.length-1);}});return b[1]+lerp(60,6,u);},30,15);
  // the banyan, and the shelter under it: four posts, a raised floor of beaten earth, a thatched roof
  m6_banyan(ctx,330,760,1,0.6);
  wc_wash(ctx,[[350,716],[780,716],[792,742],[338,742]],wc_dim(P.earth,0.1),{depth:0.66,kind:"trim",lw:1.3});
  wc_wash(ctx,[[362,700],[770,700],[780,716],[350,716]],P.earth,{depth:0.66,kind:"build",lw:1.3});
  for(const [px,top] of [[436,470],[690,470]])wc_wash(ctx,wc_rect(px-7,top,14,232),P.wood,{depth:0.66,kind:"trunk",lw:1.2,seed:px});
  for(const [px,top] of [[372,520],[756,520]])wc_wash(ctx,wc_rect(px-9,top,18,196),P.wood,{depth:0.7,kind:"trunk",lw:1.3,seed:px});
  m6_roof(ctx,330,800,528,404,726,446,0.7,17);
  m6_land(ctx,M6_F3,P.dry,0.86);m6_grass(ctx,-20,1940,M6_F3,140,4);
  const R=wc_rng(9);for(let i=0;i<26;i++){const x=R()*1920,y=M6_F3(x)+40+R()*(H-M6_F3(x)-40),r=4+R()*7;wc_wash(ctx,wc_ell(x,y,r*1.4,r,10),P.stone,{kind:"dab",flat:true});}}
// the village street, close: the house the healer goes into, its door and its window; next door, a second house, its door open; the
// street of packed earth in front, palms and a tree behind the roofs
const M6_HA={x:250,y:812,w:760,h:390},M6_HB={x:1090,y:812,w:740,h:350};
const M6_DA={x:560,y:812,w:150,h:290},M6_DB={x:1300,y:812,w:136,h:262},M6_WA={x:812,y:540,w:110,h:96};
const M6_STREET=x=>846+6*Math.sin(x/300);
function m6_village(ctx){const P=M6P;wc_sky(ctx,560,8,{sun:[1700,110],clouds:3,cx:200,cw:1500,cy:60,ch:170});m6_haze(ctx,520);
  [[160,420,330,0.05],[1040,430,360,-0.06],[1700,420,320,0.04],[1880,440,280,-0.05]].forEach(([x,y,h,l],i)=>m6_palm(ctx,x,y,h,0.36,l,i+21));
  wc_wash(ctx,m6_blob(1060,360,150,100,5),P.leaf2,{depth:0.4,kind:"tree",lw:1.1,seed:3});wc_wash(ctx,wc_rect(1052,380,16,100),P.bark,{depth:0.4,kind:"trunk",lw:1});
  m6_land(ctx,x=>470+8*Math.sin(x/200),P.dry2,0.38,{line:false});
  // the healer's house: a lime-washed wall, a wooden door frame and lintel, its barred window
  const A=M6_HA,B=M6_HB;
  wc_wash(ctx,wc_rect(A.x-20,A.y-8,A.w+40,40),wc_dim(P.earth,0.12),{depth:0.8,kind:"trim",lw:1.4,seed:2});
  wc_wash(ctx,wc_rect(A.x,A.y-A.h,A.w,A.h),P.plaster,{depth:0.8,kind:"wall",lw:1.6,seed:21});
  wc_wash(ctx,wc_rect(A.x,A.y-64,A.w,64),wc_dim(P.earth,0.02),{depth:0.8,kind:"wall",line:false,a:0.7,seed:23});
  const D=M6_DA;wc_wash(ctx,wc_rect(D.x,D.y-D.h,D.w,D.h),P.inside,{depth:0.8,kind:"door",lw:1.4});
  for(const r of [wc_rect(D.x-16,D.y-D.h-22,D.w+32,22),wc_rect(D.x-16,D.y-D.h,16,D.h),wc_rect(D.x+D.w,D.y-D.h,16,D.h)])wc_wash(ctx,r,P.wood,{depth:0.8,kind:"trim",lw:1.3,seed:r[0][0]});
  const Wn=M6_WA;wc_wash(ctx,wc_rect(Wn.x,Wn.y,Wn.w,Wn.h),P.inside,{depth:0.8,kind:"door",lw:1.3});
  ctx.save();ctx.strokeStyle=rgba(P.woodDark,0.95);ctx.lineWidth=7;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(Wn.x+Wn.w*i/4,Wn.y);ctx.lineTo(Wn.x+Wn.w*i/4,Wn.y+Wn.h);ctx.stroke();}ctx.restore();
  m6_roof(ctx,A.x-60,A.x+A.w+60,A.y-A.h+10,A.x+70,A.x+A.w-70,A.y-A.h-190,0.8,31);
  // next door: an ochre wall, its door standing open
  wc_wash(ctx,wc_rect(B.x-20,B.y-8,B.w+40,40),wc_dim(P.earth,0.12),{depth:0.8,kind:"trim",lw:1.4,seed:4});
  wc_wash(ctx,wc_rect(B.x,B.y-B.h,B.w,B.h),P.ochre,{depth:0.8,kind:"wall",lw:1.6,seed:41});
  wc_wash(ctx,wc_rect(B.x,B.y-60,B.w,60),wc_dim(P.earth,0.04),{depth:0.8,kind:"wall",line:false,a:0.7,seed:43});
  const E=M6_DB;wc_wash(ctx,wc_rect(E.x,E.y-E.h,E.w,E.h),wc_dim(P.inside,0.08),{depth:0.8,kind:"door",lw:1.4});
  wc_wash(ctx,[[E.x+4,E.y-E.h+6],[E.x+30,E.y-E.h+16],[E.x+30,E.y-12],[E.x+4,E.y-2]],P.wood,{depth:0.8,kind:"door",lw:1.2});
  for(const r of [wc_rect(E.x-14,E.y-E.h-20,E.w+28,20),wc_rect(E.x-14,E.y-E.h,14,E.h),wc_rect(E.x+E.w,E.y-E.h,14,E.h)])wc_wash(ctx,r,P.wood,{depth:0.8,kind:"trim",lw:1.3,seed:r[0][0]});
  wc_wash(ctx,wc_rect(1580,560,104,88),P.inside,{depth:0.8,kind:"door",lw:1.3});ctx.save();ctx.strokeStyle=rgba(P.woodDark,0.9);ctx.lineWidth=5;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(1580+26*i,560);ctx.lineTo(1580+26*i,648);ctx.stroke();}ctx.restore();
  m6_roof(ctx,B.x-50,B.x+B.w+60,B.y-B.h+10,B.x+80,B.x+B.w-60,B.y-B.h-170,0.8,37);
  // the street
  m6_land(ctx,M6_STREET,P.earth,0.9);wc_wash(ctx,wc_band(wc_smooth([[-40,960],[700,930],[1400,948],[1980,936]],6),70,70),wc_lit(P.road,0.04),{depth:0.9,kind:"road",line:false,seed:130});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.earth,0.3),0.25);ctx.lineWidth=3;for(const y of [906,1000]){ctx.beginPath();ctx.moveTo(-20,y);ctx.bezierCurveTo(600,y-14,1300,y+10,1940,y-6);ctx.stroke();}ctx.restore();
  m6_grass(ctx,A.x-30,A.x+A.w+30,()=>A.y+30,60,7);m6_grass(ctx,B.x-30,B.x+B.w+30,()=>B.y+30,50,8);
  const R=wc_rng(12);for(let i=0;i<22;i++){const x=R()*1920,y=880+R()*190,r=4+R()*8;wc_wash(ctx,wc_ell(x,y,r*1.5,r,10),P.stone,{kind:"dab",flat:true});}}

/* ---------- the people of the past ---------- */
// drawn in the character sheet's units (feet at 0, about 600 tall at s=1) and finished in the series' pencil and wash (outlined); arms
// are given as [upper arm, forearm] angles from hanging straight down, positive towards the right of the frame
const M6_OLD={
  teacher:{seed:31,skin:[166,110,76],hair:{style:"knot",c:[228,226,220]},beard:[234,232,226],longBeard:true,build:{sh:68,hip:56,h:1.0},
    lower:{c:[244,238,224],hem:-92},upper:{c:[230,222,200],kind:"wrap"}},
  student:{seed:32,skin:[188,130,90],hair:{style:"knot",c:[36,30,32]},build:{sh:66,hip:54,h:0.97},lower:{c:[236,222,188],hem:-150},upper:{c:[176,192,220],kind:"band"}},
  healer:{seed:32,skin:[188,130,90],hair:{style:"knot",c:[36,30,32]},build:{sh:66,hip:54,h:0.97},lower:{c:[236,222,188],hem:-150},upper:{c:[176,192,220],kind:"band"},bag:[206,184,140]},
  neighbour:{seed:33,skin:[176,118,84],hair:{style:"covered",c:[34,28,30]},build:{sh:60,hip:58,h:0.94},lower:{c:[182,92,78],hem:-26},upper:{c:[230,218,190],kind:"veil"}}};
const M6_OPOSE={stand:{AL:[-0.12,-0.06],AR:[0.12,0.06],feet:22,turn:0},
  listen:{AL:[-0.08,0.62],AR:[0.08,-0.62],feet:20,turn:-1.2},
  give:{AL:[-0.1,-0.04],AR:[0.55,2.0],hand:"open",feet:24,turn:1.2},
  ask:{AL:[-0.42,-1.95],AR:[0.1,0.1],hand:"open",feet:20,turn:-1.4}};
// a bare arm from the shoulder (x0,y0), with its hand: open (palm towards us) or relaxed
function m6_arm(ctx,P,x0,y0,a,open,dark){const L1=104,L2=96,e=[x0+Math.sin(a[0])*L1,y0+Math.cos(a[0])*L1],w=[e[0]+Math.sin(a[1])*L2,e[1]+Math.cos(a[1])*L2],d=[Math.sin(a[1]),Math.cos(a[1])],
  sk=dark?darken(P.skin,0.12):P.skin,box=[x0-120,y0,x0+120,y0+200];limb(ctx,[[x0,y0],e,w],27,21,sk,box);
  ctx.save();ctx.translate(w[0]+d[0]*12,w[1]+d[1]*12);ctx.rotate(Math.atan2(d[1],d[0])-Math.PI/2);
  if(open){for(let i=0;i<4;i++){ctx.save();ctx.rotate((i-1.5)*0.17);ell(ctx,0,14,4.2,10.5);litFill(ctx,sk,-8,0,8,24);ctx.restore();}ell(ctx,0,2,12,13);litFill(ctx,sk,-13,-12,13,13);}
  else{ell(ctx,0,2,11,14);litFill(ctx,sk,-11,-12,11,16);seam(ctx,sk,0.3,1.2);}
  ctx.restore();}
// a bare leg, hip to ankle through the knee, and a bare foot pointing dir (0: towards us)
function m6_leg(ctx,P,hip,knee,ank,dir){limb(ctx,[hip,knee,ank],34,22,P.skin,[hip[0]-60,hip[1],hip[0]+60,0]);
  ell(ctx,ank[0]+dir*12,ank[1]+14,dir?22:17,9,0);litFill(ctx,darken(P.skin,0.05),ank[0]-24,ank[1],ank[0]+24,ank[1]+24);seam(ctx,P.skin,0.35,1.2);}
// the lower garment: from the waist to its hem, wide enough to cover the knees, with a pleated panel hanging in front and a sash
function m6_lower(ctx,P,hx0,hx1,hem){const c=P.lower.c,hw=P.build.hip;ctx.beginPath();ctx.moveTo(-hw+2,-316);ctx.lineTo(hw-2,-316);
  ctx.quadraticCurveTo(hw+8,-270,hx1,hem);ctx.quadraticCurveTo((hx0+hx1)/2,hem+10,hx0,hem);ctx.quadraticCurveTo(-hw-8,-270,-hw+2,-316);ctx.closePath();litFill(ctx,c,-hw,-316,hw,hem);seam(ctx,c,0.4);
  ctx.save();ctx.clip();ctx.strokeStyle=rgba(darken(c,0.3),0.35);ctx.lineWidth=2;for(const f of [-0.55,-0.2,0.25,0.6]){ctx.beginPath();ctx.moveTo(f*hw,-300);ctx.quadraticCurveTo(f*hw*1.1,(hem-300)/2,lerp(hx0,hx1,(f+1)/2),hem);ctx.stroke();}ctx.restore();
  const pm=(hx0+hx1)/2;ctx.beginPath();ctx.moveTo(-12,-304);ctx.lineTo(10,-304);ctx.lineTo(pm+14,hem+22);ctx.lineTo(pm-16,hem+24);ctx.closePath();litFill(ctx,lighten(c,0.04),-16,-304,16,hem);seam(ctx,c,0.45);
  ctx.strokeStyle=rgba(darken(c,0.35),0.4);ctx.lineWidth=1.6;for(let i=1;i<6;i++){const y=lerp(-290,hem+16,i/6),x=lerp(0,pm,i/6);ctx.beginPath();ctx.moveTo(x-10,y);ctx.lineTo(x+10,y+5);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-hw,-326);ctx.quadraticCurveTo(0,-316,hw,-326);ctx.lineTo(hw,-306);ctx.quadraticCurveTo(0,-296,-hw,-306);ctx.closePath();litFill(ctx,darken(c,0.08),-hw,-326,hw,-300);seam(ctx,c,0.5);
  ell(ctx,6,-308,11,9);litFill(ctx,darken(c,0.1),-6,-318,18,-298);seam(ctx,c,0.5);}
// the upper cloth: a band over one shoulder and across the chest (its end hanging down the back), a wider wrap, or a veil over the head
function m6_upper(ctx,P,br){const U=P.upper,c=U.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br;
  if(U.kind==="band"||U.kind==="wrap"){const wide=U.kind==="wrap"?1:0;ctx.beginPath();ctx.moveTo(sw-26,y0-4);ctx.quadraticCurveTo(sw+4,y0+2,sw+6,y0+30);
    ctx.lineTo(sw-6-wide*10,y0+50);ctx.quadraticCurveTo(-hw*0.2,-330+wide*10,-hw-6,-306);ctx.lineTo(-hw-4,-330-wide*70);ctx.quadraticCurveTo(-10-wide*30,-372-wide*40,sw-50-wide*60,y0+2);ctx.closePath();
    litFill(ctx,c,-sw,y0,sw,-300);seam(ctx,c,0.45);ctx.save();ctx.clip();ctx.strokeStyle=rgba(darken(c,0.3),0.35);ctx.lineWidth=2;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(sw-14-i*12,y0+8+i*6);ctx.quadraticCurveTo(-10,-360+i*16,-hw-4,-318+i*6);ctx.stroke();}ctx.restore();
    ctx.beginPath();ctx.moveTo(sw-4,y0+20);ctx.quadraticCurveTo(sw+18,-330,sw+10,-236);ctx.lineTo(sw-14,-240);ctx.quadraticCurveTo(sw-8,-330,sw-24,y0+30);ctx.closePath();litFill(ctx,darken(c,0.04),sw-24,y0,sw+18,-236);seam(ctx,c,0.45);}
  else if(U.kind==="veil"){ctx.beginPath();ctx.moveTo(-sw-6,y0+30);ctx.quadraticCurveTo(-sw+6,y0-6,-40,y0-10);ctx.lineTo(40,y0-10);ctx.quadraticCurveTo(sw-6,y0-6,sw+6,y0+30);
    ctx.quadraticCurveTo(sw+14,-330,hw+8,-290);ctx.quadraticCurveTo(0,-276,-hw-8,-290);ctx.quadraticCurveTo(-sw-14,-330,-sw-6,y0+30);ctx.closePath();litFill(ctx,c,-sw,y0,sw,-280);seam(ctx,c,0.45);
    ctx.save();ctx.clip();ctx.strokeStyle=rgba(darken(c,0.3),0.33);ctx.lineWidth=2;for(const f of [-0.6,-0.2,0.25,0.65]){ctx.beginPath();ctx.moveTo(f*sw,y0+4);ctx.quadraticCurveTo(f*sw*1.15,-360,f*hw*1.1,-284);ctx.stroke();}ctx.restore();}}
// hair tied up: the knot behind the crown, and the hair drawn back over the head; a white beard grown long; the woman's veil over her head
function m6_knot(ctx,P){const c=P.hair.c;ell(ctx,4,-66,24,17,-0.1);litFill(ctx,c,-20,-84,28,-50);seam(ctx,c,0.4);}
function m6_cap(ctx,P){const c=P.hair.c;ctx.beginPath();ctx.moveTo(-44,-6);ctx.bezierCurveTo(-48,-74,48,-74,44,-6);ctx.quadraticCurveTo(38,-30,10,-36);ctx.quadraticCurveTo(0,-34,-10,-36);ctx.quadraticCurveTo(-38,-30,-44,-6);ctx.closePath();
  litFill(ctx,c,-46,-62,46,-6);ctx.save();ctx.clip();ctx.strokeStyle=rgba(lighten(c,0.25),0.45);ctx.lineWidth=1.4;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*12,-36);ctx.quadraticCurveTo(i*8,-56,i*2,-66);ctx.stroke();}ctx.restore();}
function m6_longBeard(ctx,P){const c=P.beard;ctx.beginPath();ctx.moveTo(-30,36);ctx.bezierCurveTo(-34,70,-18,104,0,116);ctx.bezierCurveTo(18,104,34,70,30,36);ctx.quadraticCurveTo(0,52,-30,36);ctx.closePath();
  ctx.fillStyle=rgba(c,0.95);ctx.fill();ctx.strokeStyle=rgba(darken(c,0.3),0.4);ctx.lineWidth=1.4;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*8,48);ctx.quadraticCurveTo(i*9,80,i*4,106);ctx.stroke();}}
function m6_veilHead(ctx,P){const c=P.upper.c;ctx.beginPath();ctx.moveTo(-58,60);ctx.bezierCurveTo(-64,-40,-46,-84,0,-86);ctx.bezierCurveTo(46,-84,64,-40,58,60);ctx.lineTo(44,60);
  ctx.bezierCurveTo(46,10,40,-30,30,-40);ctx.quadraticCurveTo(0,-56,-30,-40);ctx.bezierCurveTo(-40,-30,-46,10,-44,60);ctx.closePath();litFill(ctx,c,-60,-86,60,60);seam(ctx,c,0.45);
  ctx.save();ctx.clip();ctx.strokeStyle=rgba(darken(c,0.3),0.3);ctx.lineWidth=1.6;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*20,-80);ctx.quadraticCurveTo(s*56,-30,s*52,56);ctx.stroke();}ctx.restore();}
// a cloth bag on a strap over the shoulder, at the hip
function m6_bag(ctx,P,br,swing){const c=P.bag,sw=P.build.sh,hw=P.build.hip,bx=-hw-34+swing*6,by=-286;ctx.strokeStyle=rgba(darken(c,0.35),0.9);ctx.lineWidth=7;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(sw-22,-444+br);ctx.quadraticCurveTo(0,-370,bx+30,by-34);ctx.stroke();ctx.beginPath();rr(ctx,bx-2,by-40,74,84,14);litFill(ctx,c,bx,by-40,bx+72,by+44);seam(ctx,c,0.5);
  ctx.fillStyle=rgba(darken(c,0.3),0.5);ctx.fillRect(bx+4,by+16,64,6);ctx.beginPath();ctx.moveTo(bx,by-30);ctx.quadraticCurveTo(bx+36,by-14,bx+72,by-30);ctx.strokeStyle=rgba(darken(c,0.4),0.5);ctx.lineWidth=2;ctx.stroke();}
// the body: standing, or walking at phase po.walk towards po.dir; turned by po.turn (negative: towards the left of the frame)
function m6_oldBody(ctx,P,po,E,t){const sw=P.build.sh,hw=P.build.hip,br=Math.sin(t*1.6+P.seed)*1.4,walk=po.walk!=null,dir=po.dir||1,turn=po.turn||0,k=1-Math.min(0.22,Math.abs(turn)*0.12);
  const ph=walk?po.walk:0,bob=walk?-6*Math.abs(Math.cos(ph)):0;ctx.translate(0,bob);
  let L,Rg,hem=P.lower.hem;
  // the legs: hips, knees, ankles
  if(walk){const leg=i=>{const q=ph+i*Math.PI,th=0.32*Math.sin(q),bend=0.55*Math.max(0,Math.sin(q+Math.PI/2)),hip=[dir*(i?-6:6)*k,-300],
      knee=[hip[0]+dir*Math.sin(th)*150,hip[1]+Math.cos(th)*150],ank=[knee[0]+dir*Math.sin(th-bend)*150,knee[1]+Math.cos(th-bend)*150-bob*0];return[hip,knee,ank];};L=leg(0);Rg=leg(1);}
  else{const f=po.feet||22;L=[[-20,-300],[-f*0.8,-150],[-f,-26]];Rg=[[20,-300],[f*0.8,-150],[f,-26]];}
  const back=walk&&(L[2][0]-Rg[2][0])*dir<0?0:1;
  // the arm on the far side, behind the body
  const sxL=(-(sw-12))*k+turn*6,sxR=(sw-12)*k+turn*6,sy=-416+br,AL=walk?[dir*0.36*Math.sin(ph+Math.PI),dir*0.5*Math.sin(ph+Math.PI)+dir*0.15]:po.AL,AR=walk?[dir*0.36*Math.sin(ph),dir*0.5*Math.sin(ph)+dir*0.15]:po.AR;
  const farR=turn<0||walk&&dir<0;if(walk||turn){if(farR)m6_arm(ctx,P,sxR,sy,AR,false,true);else m6_arm(ctx,P,sxL,sy,AL,false,true);}
  // legs: the one behind first
  const legs=walk?(back?[Rg,L]:[L,Rg]):[L,Rg];legs.forEach(g=>m6_leg(ctx,P,g[0],g[1],g[2],walk?dir:0));
  // the lower garment, its hem following the knees when walking
  const kx=walk?[Math.min(L[1][0],Rg[1][0])-38,Math.max(L[1][0],Rg[1][0])+38]:[-hw-12-(hem>-120?14:0),hw+12+(hem>-120?14:0)];m6_lower(ctx,P,kx[0],kx[1],walk?Math.max(L[1][1],Rg[1][1])-4:hem);
  // the torso, bare, then the upper cloth
  ctx.save();ctx.translate(turn*4,0);ctx.scale(k,1);if(P.upper.kind!=="veil"){limb(ctx,[[0,-470+br],[0,-440+br]],30,30,darken(P.skin,0.12),[-20,-470,20,-440]);torsoPath(ctx,P,br,0);litFill(ctx,P.skin,-sw,-448,sw,-250);seam(ctx,P.skin,0.35);
    ctx.strokeStyle=rgba(darken(P.skin,0.3),0.3);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-30,-392);ctx.quadraticCurveTo(-14,-380,0,-386);ctx.quadraticCurveTo(14,-380,30,-392);ctx.stroke();ell(ctx,2,-322,2.4,3.4);ctx.fillStyle=rgba(darken(P.skin,0.35),0.5);ctx.fill();}
  else{limb(ctx,[[0,-470+br],[0,-440+br]],28,28,darken(P.skin,0.12),[-20,-470,20,-440]);}
  m6_upper(ctx,P,br);if(P.bag)m6_bag(ctx,P,br,walk?Math.sin(ph):0);ctx.restore();
  // the head
  ctx.save();ctx.translate(turn*7,-452+br);ctx.rotate((po.tilt||0)+(walk?0.02*dir:0));ctx.translate(0,-50);
  const hpo={turn:turn,look:0,gaze:[turn*0.5,0]};if(P.hair.style==="knot")m6_knot(ctx,P);if(P.upper.kind==="veil"){ctx.save();ctx.scale(1.02,1);ctx.restore();}
  head(ctx,Object.assign({},P,{beard:P.beard,hair:{style:P.hair.style,c:P.hair.c}}),E,hpo,t);
  if(P.hair.style==="knot")m6_cap(ctx,P);if(P.longBeard)m6_longBeard(ctx,P);if(P.upper.kind==="veil")m6_veilHead(ctx,P);ctx.restore();
  // the near arm, in front
  if(walk||turn){if(farR)m6_arm(ctx,P,sxL,sy,AL,po.hand==="open"&&turn<0);else m6_arm(ctx,P,sxR,sy,AR,po.hand==="open"&&turn>0);}
  else{m6_arm(ctx,P,sxL,sy,AL,false);m6_arm(ctx,P,sxR,sy,AR,false);}}
// someone of the past, at (x,y), s the size; o.pose (M6_OPOSE), blended towards o.pose2 by o.mix; o.turn; o.walk (a phase) and o.dir
function m6_old(ctx,id,x,y,s,o){o=o||{};if(o.a!=null&&o.a<=0.01)return;const P=M6_OLD[id],E=EXPR[o.expr||"calm"],t=o.t||0,k=s*P.build.h;
  let po=Object.assign({},M6_OPOSE[o.pose||"stand"]);if(o.pose2&&o.mix>0)po=blendPose(po,M6_OPOSE[o.pose2],o.mix);if(o.turn!=null)po.turn=o.turn;if(o.tilt!=null)po.tilt=o.tilt;
  if(o.walk!=null)Object.assign(po,{walk:o.walk,dir:o.dir||1,turn:(o.dir||1)*1.2});
  withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,110);g.addColorStop(0,rgba([90,80,96],0.2));g.addColorStop(1,rgba([90,80,96],0));
    ctx.fillStyle=g;ell(ctx,0,-4,110,16);ctx.fill();ctx.restore();
    outlined(ctx,cx=>m6_oldBody(cx,P,po,E,t),x,y,k,[236,232,226],[-280,-720,280,40]);});}

/* ---------- the book ---------- */
// a palm leaf of the book: long and narrow, golden, darker at its edges, two holes for the cord, and lines of writing drawn as lines
const M6_BW=1000,M6_BH=150,M6_CORD=[150,64,48];
function m6_leaf(w,h,seed,lines,holes){holes=holes||[w/3,w*2/3];return wc_kept("leaf"+w+"x"+h+"|"+seed+"|"+lines+"|"+holes.join(","),(w+40)*2,(h+40)*2,q=>{q.scale(2,2);q.translate(20,20);const c=[236,214,158];
  wc_wash(q,wc_rrPts(0,0,w,h,h*0.2),c,{kind:"paper",lw:1.6,seed});q.save();wc_tr(q,wc_rrPts(0,0,w,h,h*0.2));q.clip();const g=q.createLinearGradient(0,0,0,h);
  g.addColorStop(0,"rgba(150,104,52,0.22)");g.addColorStop(0.15,"rgba(150,104,52,0)");g.addColorStop(0.85,"rgba(150,104,52,0)");g.addColorStop(1,"rgba(150,104,52,0.25)");q.fillStyle=g;q.fillRect(0,0,w,h);q.restore();
  holes.forEach(x=>{q.fillStyle=rgba([90,62,40],0.85);q.beginPath();q.arc(x,h/2,7,0,TAU);q.fill();});
  if(!lines)return;const R=wc_rng(seed*3+1),ink=[70,46,36];q.lineCap="round";q.lineJoin="round";
  for(let r=0;r<lines;r++){const y=h*(0.2+0.6*(r+0.5)/lines);let x=34;while(x<w-40){let len=30+R()*70;if(holes.some(hx=>x<hx+26&&x+len>hx-26)){x=holes.find(hx=>x<hx+26&&x+len>hx-26)+30;continue;}
      len=Math.min(len,w-40-x);q.strokeStyle=rgba(ink,0.75+R()*0.2);q.lineWidth=1.8;q.beginPath();q.moveTo(x,y);
      for(let u=0;u<=len;u+=2){const yy=y-3.2*Math.abs(Math.sin(u*0.42+R()*0.4))-(Math.sin(u*0.11)>0.85?4:0);q.lineTo(x+u,yy);}q.stroke();x+=len+10+R()*12;}}});}
// a board of the book: wood, its grain, and a painted border, kept
function m6_board(){const w=M6_BW,h=M6_BH,P=M6P;return wc_kept("board",(w+60)*2,(h+50)*2,q=>{q.scale(2,2);q.translate(20,15);wc_wash(q,wc_rrPts(0,0,w+20,h+20,18),P.wood,{kind:"cover",lw:2,seed:5});
  q.strokeStyle=rgba(wc_dim(P.wood,0.3),0.35);q.lineWidth=1.4;for(let i=1;i<6;i++){q.beginPath();q.moveTo(20,(h+20)*i/6);q.bezierCurveTo(w*0.3,(h+20)*i/6+4,w*0.7,(h+20)*i/6-4,w,(h+20)*i/6+2);q.stroke();}
  q.strokeStyle=rgba([188,96,64],0.55);q.lineWidth=5;q.beginPath();rr(q,14,14,w-8,h-8,10);q.stroke();q.strokeStyle=rgba([226,190,112],0.5);q.lineWidth=2;q.beginPath();rr(q,24,24,w-28,h-28,6);q.stroke();});}
// the cloth the book lies on, close up, filling the frame: indigo cotton with a woven border, soft folds and its weave; the earth floor above it
function m6_cloth(){return wc_kept("m6cloth",W,H,q=>{const C=[84,100,142];q.fillStyle=rgba(WC_PAPER,1);q.fillRect(0,0,W,H);
  wc_wash(q,[[-60,-60],[W+60,-60],[W+60,150],[-60,170]],[214,186,140],{kind:"land",line:false,seed:64});
  const edge=x=>132+x*0.012+4*Math.sin(x/170),cl=[[-60,edge(-60)]];for(let x=0;x<=W+60;x+=40)cl.push([x,edge(x)]);cl.push([W+60,H+60],[-60,H+60]);
  wc_wash(q,cl,C,{kind:"cover",lw:1.8,seed:68});
  // the folds: long soft shadows and lights across it
  q.save();wc_tr(q,cl);q.clip();q.filter="blur(28px)";[[[-100,560],[2100,240],70,0.2,0],[[-100,980],[2100,700],60,0.16,0],[[200,1200],[1300,140],40,0.1,1],[[-100,760],[2100,440],34,0.12,1]].forEach(([a,b,wd,al,lt])=>{
    q.strokeStyle=rgba(lt?wc_lit(C,0.35):wc_dim(C,0.4),al);q.lineWidth=wd;q.beginPath();q.moveTo(a[0],a[1]);q.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2+60,b[0],b[1]);q.stroke();});q.filter="none";
    // its weave, fine threads both ways
    q.globalAlpha=0.06;q.strokeStyle=rgba(wc_lit(C,0.5),1);q.lineWidth=1;for(let y=140;y<H;y+=7){q.beginPath();q.moveTo(0,y);q.lineTo(W,y+W*0.012);q.stroke();}
    q.strokeStyle=rgba(wc_dim(C,0.5),1);for(let x=0;x<W;x+=7){q.beginPath();q.moveTo(x,120);q.lineTo(x-12,H);q.stroke();}q.globalAlpha=1;
    // the woven border along its edge: a madder stripe between two pale ones
    [[16,8,[232,214,180]],[30,12,[170,80,66]],[48,6,[232,214,180]]].forEach(([dy,wd,c])=>{q.strokeStyle=rgba(c,0.7);q.lineWidth=wd;q.beginPath();for(let x=-60;x<=W+60;x+=20){const yy=edge(x)+dy;x>-60?q.lineTo(x,yy):q.moveTo(x,yy);}q.stroke();});
  q.restore();});}
// the book, close up on its cloth: closed, its cord wound round it; as p goes 0 to 1 the cord is unwound (to 0.3), and the top board is lifted
// off and laid down above the leaves (0.25 to 1), showing the top leaf and its writing
function m6_book(ctx,cx,cy,p){const w=M6_BW,h=M6_BH,x=cx-w/2,y=cy-h/2,board=m6_board(),hx=x+w/3;
  ctx.save();ctx.shadowColor="rgba(24,28,48,0.42)";ctx.shadowBlur=16;ctx.shadowOffsetY=10;ctx.drawImage(board,x-30,y-5,w+60,h+50);ctx.restore();
  for(let i=3;i>=1;i--)ctx.drawImage(m6_leaf(w,h,20+i,0),x-20+i*1.5,y-20+i*4,w+40,h+40);
  ctx.drawImage(m6_leaf(w,h,9,5),x-20,y-20,w+40,h+40);
  // the cord: through the left hole, over the leaf's edge and out across the cloth, loose
  const uw=ease(clamp(p/0.3,0,1));ctx.save();ctx.strokeStyle=rgba(M6_CORD,0.92);ctx.lineWidth=4.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(hx,cy);
  ctx.bezierCurveTo(hx-90,cy+14,x+40,cy+26,x-30,cy+60+30*uw);ctx.bezierCurveTo(x-90,cy+90+40*uw,x-60-60*uw,cy+150+20*uw,x-150-60*uw,cy+150+40*uw);ctx.stroke();
  ctx.strokeStyle=rgba(wc_lit(M6_CORD,0.3),0.5);ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
  // the top board: shut over the leaves, then lifted, turned a little and set down above them; its shadow grows as it rises
  const lf=clamp((p-0.25)/0.75,0,1),e=ease(lf),ht=Math.sin(lf*Math.PI),bx=30*e,by=-200*e,sc=1+0.05*ht;
  ctx.save();ctx.translate(cx+bx,cy+5+by);ctx.rotate(-0.03*e);ctx.scale(sc,sc);ctx.shadowColor="rgba(24,28,48,"+(0.42-0.12*ht).toFixed(3)+")";ctx.shadowBlur=14+26*ht;ctx.shadowOffsetY=8+30*ht;ctx.shadowOffsetX=6*ht;
  ctx.drawImage(board,-w/2-30,-h/2-20,w+60,h+50);ctx.restore();
  // the cord wound round the shut book, unwound first
  if(uw<1)withA(ctx,1-uw,()=>{ctx.save();ctx.strokeStyle=rgba(M6_CORD,0.92);ctx.lineWidth=5;ctx.lineCap="round";for(const d of [-12,0,12]){ctx.beginPath();ctx.moveTo(hx+d-4,y-12);ctx.quadraticCurveTo(hx+d+4,cy,hx+d+2,y+h+22);ctx.stroke();}ctx.restore();});}
// the line of the oath, on a leaf of its own, in English, written in as p goes 0 to 1; the holes for its cord are near its ends
function m6_oath(ctx,cx,cy,p,la){const w=1460,h=200,x=cx-w/2,y=cy-h/2;ctx.drawImage(m6_leaf(w,h,13,0,[70,w-70]),x-20,y-20,w+40,h+40);
  const L1="the peculiar customs of the patient's household",L2="shall not be made public",n=L1.length+L2.length,k=clamp(p,0,1)*n,x0=cx-tw(ctx,L1,42,600)/2+10;
  wc_hand(ctx,L1,x0,y+86,{p:clamp(k/L1.length,0,1),size:42,w:600,col:[70,46,36]});
  if(k>L1.length)wc_hand(ctx,L2,x0,y+148,{p:clamp((k-L1.length)/L2.length,0,1),size:42,w:600,col:[70,46,36]});
  if(la>0.01)withA(ctx,la,()=>wc_tag(ctx,cx+w/2-40,y+h+38,"from the oath, in translation",{align:"right",size:28,w:600}));}

/* ---------- the fire, the door, the light ---------- */
// the fire on the altar: flames that never repeat, and a little smoke
function m6_fire(ctx,x,y,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();const g=ctx.createRadialGradient(x,y-30,4,x,y-30,150);g.addColorStop(0,"rgba(255,206,120,0.35)");g.addColorStop(1,"rgba(255,206,120,0)");
  ctx.fillStyle=g;ctx.fillRect(x-150,y-180,300,300);
  [[[214,84,50],1,0],[[240,140,60],0.78,1.3],[[255,204,96],0.5,2.6]].forEach(([c,s,ph])=>{for(let i=-2;i<=2;i++){const fl=Math.sin(t*7.3+i*1.7+ph)*0.5+Math.sin(t*11.1+i*2.9)*0.5,hgt=(62-Math.abs(i)*12)*s*(1+0.18*fl),wd=(16-Math.abs(i)*2)*s,fx=x+i*14*s+Math.sin(t*5+i)*3;
    ctx.beginPath();ctx.moveTo(fx-wd,y);ctx.bezierCurveTo(fx-wd*1.1,y-hgt*0.45,fx-wd*0.2+fl*4,y-hgt*0.7,fx+fl*6,y-hgt);ctx.bezierCurveTo(fx+wd*0.4+fl*3,y-hgt*0.66,fx+wd*1.1,y-hgt*0.4,fx+wd,y);ctx.closePath();
    ctx.fillStyle=rgba(c,0.85);ctx.fill();}});
  ctx.strokeStyle="rgba(120,116,120,0.16)";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();for(let k=0;k<=20;k++){const u=k/20,yy=y-80-u*150,xx=x+Math.sin(u*5+t*0.9)*14*u+u*30;k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();ctx.restore();});}
// the brick altar the fire burns on
function m6_altar(ctx,x,y){ctx.drawImage(wc_kept("altar",300,140,q=>{q.translate(150,96);const P=M6P;wc_wash(q,[[-70,-22],[70,-22],[60,-36],[-60,-36]],wc_dim(P.brick,0.2),{kind:"build",lw:1.4,seed:3});
  wc_wash(q,wc_rect(-70,-22,140,40),P.brick,{kind:"build",lw:1.5,seed:5});q.strokeStyle=rgba(wc_dim(P.brick,0.4),0.5);q.lineWidth=1.4;for(let r=0;r<3;r++){q.beginPath();q.moveTo(-70,-22+r*13+13);q.lineTo(70,-22+r*13+13);q.stroke();
    for(let i=-3;i<4;i++){const bx=i*22+(r%2?11:0);q.beginPath();q.moveTo(bx,-22+r*13);q.lineTo(bx,-9+r*13);q.stroke();}}
  wc_wash(q,wc_ell(0,-30,52,8,20),[110,96,90],{kind:"dab",flat:true,a:0.7});}),x-150,y-96);}
// the warm inside of a house, lamplit: a lamp in a niche, pots on a shelf and, in the lamp's light, drawn as shapes, the patient lying on a mat,
// a woman sitting at their feet and a child; the healer, once in (heal, 0 to 1), kneeling beside them
function m6_inside(ctx,x,y,w,h,t,lit,heal){ctx.save();ctx.beginPath();ctx.rect(x,y-h,w,h);ctx.clip();ctx.fillStyle=rgba(M6P.inside,1);ctx.fillRect(x,y-h,w,h);
  if(lit>0.01){const lx=x+w*0.86,ly=y-h*0.6,fl=1+0.05*Math.sin(t*9)+0.04*Math.sin(t*13.7),g=ctx.createRadialGradient(lx,ly,4,lx,ly,w*1.2*fl);
    g.addColorStop(0,rgba([255,226,150],0.95*lit));g.addColorStop(0.35,rgba([236,170,96],0.7*lit));g.addColorStop(1,rgba([140,90,58],0.22*lit));ctx.fillStyle=g;ctx.fillRect(x,y-h,w,h);
    withA(ctx,lit,()=>{const S=[86,54,40],f=a=>rgba(S,a);
      // the shelf and its pots
      ctx.fillStyle=f(0.5);ctx.fillRect(x+w*0.3,y-h*0.7,w*0.42,5);[[0.38,16,20],[0.5,12,15],[0.62,14,18]].forEach(([u,r,hh])=>{ctx.beginPath();ctx.ellipse(x+w*u,y-h*0.7-hh*0.55,r*0.62,hh*0.55,0,0,TAU);ctx.fill();});
      // the mat, and the patient lying on it, head to the right
      ctx.fillStyle=f(0.35);ctx.fillRect(x+w*0.18,y-h*0.08,w*0.8,7);ctx.fillStyle=f(0.62);ctx.beginPath();ctx.ellipse(x+w*0.56,y-h*0.105,w*0.3,h*0.03,0,0,TAU);ctx.fill();
      ctx.beginPath();ctx.arc(x+w*0.9,y-h*0.125,w*0.055,0,TAU);ctx.fill();
      // the woman sitting at the patient's feet, and a child beside her
      ctx.beginPath();ctx.ellipse(x+w*0.3,y-h*0.14,w*0.13,h*0.11,0,Math.PI,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(x+w*0.3,y-h*0.26,w*0.09,h*0.09,0,0,TAU);ctx.fill();
      ctx.beginPath();ctx.ellipse(x+w*0.3,y-h*0.36,w*0.058,w*0.064,0,0,TAU);ctx.fill();
      ctx.beginPath();ctx.ellipse(x+w*0.47,y-h*0.13,w*0.07,h*0.06,0,Math.PI,TAU);ctx.fill();ctx.beginPath();ctx.arc(x+w*0.47,y-h*0.22,w*0.045,0,TAU);ctx.fill();
      // the healer, kneeling at the patient's head, a hand over them
      if(heal>0.01)withA(ctx,heal,()=>{ctx.fillStyle=f(0.72);ctx.beginPath();ctx.ellipse(x+w*0.72,y-h*0.2,w*0.1,h*0.11,0,Math.PI,TAU);ctx.fill();
        ctx.beginPath();ctx.ellipse(x+w*0.72,y-h*0.31,w*0.075,h*0.08,0,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(x+w*0.71,y-h*0.42,w*0.055,0,TAU);ctx.fill();
        ctx.beginPath();ctx.arc(x+w*0.69,y-h*0.465,w*0.03,0,TAU);ctx.fill();ctx.lineWidth=6;ctx.lineCap="round";ctx.strokeStyle=f(0.72);ctx.beginPath();ctx.moveTo(x+w*0.76,y-h*0.32);ctx.quadraticCurveTo(x+w*0.84,y-h*0.25,x+w*0.86,y-h*0.17);ctx.stroke();});
      // the lamp in its niche
      ctx.fillStyle=rgba([150,92,60],0.9);ctx.beginPath();ctx.ellipse(lx,ly+8,14,6,0,0,Math.PI);ctx.fill();ctx.fillStyle=rgba([255,214,120],1);ctx.beginPath();ctx.ellipse(lx+2,ly-2+Math.sin(t*9)*0.6,4,8,0,0,TAU);ctx.fill();});}
  ctx.restore();}
// the door of the house: wooden planks and two battens, hinged on the left; it swings inwards as p goes 0 to 1, its far edge drawn back in
// perspective; shut, the lamplight shows in the gap round it (lit, 0 to 1)
function m6_houseDoor(ctx,D,p,lit,t){const leaf=wc_kept("doorA",(D.w+20)*2,(D.h+20)*2,q=>{q.scale(2,2);q.translate(10,10);const c=M6P.wood;wc_wash(q,wc_rect(0,0,D.w,D.h),c,{kind:"door",lw:1.6,seed:7});
    q.strokeStyle=rgba(wc_dim(c,0.35),0.55);q.lineWidth=1.6;for(let i=1;i<5;i++){q.beginPath();q.moveTo(D.w*i/5,4);q.lineTo(D.w*i/5,D.h-4);q.stroke();}
    for(const yy of [D.h*0.2,D.h*0.75])wc_wash(q,wc_rect(6,yy,D.w-12,16),wc_dim(c,0.12),{kind:"trim",lw:1.2,seed:yy|0});
    wc_wash(q,wc_ell(D.w-24,D.h*0.5,7,7,14),M6P.woodDark,{kind:"thing",lw:1});});
  const q=ease(clamp(p,0,1));if(lit>0.01&&q<0.05){ctx.save();ctx.strokeStyle=rgba([255,200,110],0.8*lit);ctx.lineWidth=3;ctx.strokeRect(D.x+1.5,D.y-D.h+1.5,D.w-3,D.h-3);ctx.restore();}
  const n=14,cw=Math.cos(q*1.35),vis=D.w*cw;if(vis<1)return;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,sx0=D.x+vis*u0,sw=vis/n+0.6,sh=1-q*0.16*(u0+u1)/2;
    ctx.drawImage(leaf,(10+D.w*u0)*2,0,(D.w/n)*2,(D.h+20)*2,sx0,D.y-D.h*sh-10*sh+(1-sh)*D.h*0.5*0,sw,(D.h+20)*sh);}
  if(q>0.01)withA(ctx,q*0.35,()=>{ctx.fillStyle=rgba([40,26,20],1);ctx.fillRect(D.x,D.y-D.h,vis,D.h);});}
// the window's light, from the lamp inside
function m6_windowGlow(ctx,Wn,lit,t){if(lit<=0.01)return;ctx.save();ctx.globalCompositeOperation="screen";const fl=1+0.06*Math.sin(t*8.3)+0.04*Math.sin(t*12.9),cx=Wn.x+Wn.w/2,cy=Wn.y+Wn.h/2,g=ctx.createRadialGradient(cx,cy,6,cx,cy,Wn.w*0.9*fl);
  g.addColorStop(0,rgba([255,190,100],0.75*lit));g.addColorStop(1,rgba([255,190,100],0));ctx.fillStyle=g;ctx.fillRect(Wn.x-20,Wn.y-20,Wn.w+40,Wn.h+40);ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(M6P.woodDark,0.95);ctx.lineWidth=7;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(Wn.x+Wn.w*i/4,Wn.y);ctx.lineTo(Wn.x+Wn.w*i/4,Wn.y+Wn.h);ctx.stroke();}ctx.restore();}
