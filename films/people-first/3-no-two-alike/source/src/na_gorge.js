/* ===== No two alike: the gorge of Q'eswachaka, for the film's first lines =====
   The other films of People first follow the rope bridge; this one shows it for two lines, says it leaves it, and goes to Lu. The
   gorge is the series' first shared version (made by the thread of People before roles on 12 November 2026, in the module's working
   folder, people-first/bridge/qb_place.js), copied here as each film copies it, every name with this film's prefix (na_qb_, NA_QB_;
   the place naGorge). Only the wide view by a dry June sun is kept: no grey sky, no bank at people's height. It is a drawing, not a
   likeness: the gorge is narrower and shallower than the real one. Nothing is borrowed from the communities' own patterns or
   crafts, and nothing sacred is drawn.
     AG_PLACES.naGorge      the gorge with no bridge at all: both banks, a stone base on each, the river low in the frame
   See na_bridge.js for the bridge and the small people who cross it. */

const NA_QB_K={sky0:[112,152,198],sky1:[220,228,226],cloud:[252,252,248],peak:[156,168,186],peakSh:[130,142,164],snow:[242,244,244],
  hill:[206,182,124],hillSh:[166,142,100],hillFar:[200,190,158],ichu:[230,208,146],ichuMid:[198,170,108],ichuDk:[136,112,72],
  earth:[186,160,126],earthDk:[144,118,90],path:[212,192,158],
  rock:[112,106,106],rockLit:[164,154,144],rockSh:[72,70,80],rockDeep:[36,36,46],rose:[162,124,106],lichen:[150,150,124],
  river:[60,96,98],riverFar:[112,142,142],riverDk:[34,60,68],foam:[232,238,234],
  stone:[184,174,158],stoneLit:[212,202,184],stoneSh:[120,112,106],joint:[66,58,56],
  straw:[226,200,128],strawOld:[158,144,122],strawDead:[124,116,106],stick:[122,98,72],
  steel:[126,134,142],shade:[32,38,62]};
// the place's light: the sky, how warm the sun is, how dark the shadow the right bank throws into the gorge, a veil of grey over all
const NA_QB_LIGHT={sun:{sky0:NA_QB_K.sky0,sky1:NA_QB_K.sky1,glow:0.42,cast:0.46,warm:1,veil:0},
                grey:{sky0:[158,166,176],sky1:[208,212,214],glow:0,cast:0.14,warm:0,veil:0.2}};

/* ---------------------------------------------------------------- the gorge's lines
   One vanishing point; s is how near a thing is (1 at the bridge, larger towards us, NA_QB_G.s0 at the bend). The rim of each bank and
   the foot of each wall run towards it; side is -1 for the left bank, 1 for the right. Each wall is a row of ribs of rock: at each
   step along it (V) the rock stands out towards the river a little more or less (B), and its rim sits a little higher or lower (T).
   Near the bridge the rim keeps still, so the stone bases stand where the ropes start. */
const NA_QB_G={vp:[960,150],rim:296,foot:700,half:460,halfFoot:318,s0:0.56,s1:2.8};
const na_qb_wob=(v,k)=>Math.sin(v*9.1+k*2.3)*0.55+Math.sin(v*23.7+k*5.1)*0.3+Math.sin(v*51+k)*0.15;
const na_qb_calm=s=>1-Math.exp(-Math.pow((s-1)/0.1,2));
const na_qb_meander=s=>52*Math.sin(s*3.6+0.9)*clamp((s-0.5)*1.4,0,1);
const NA_QB_WALLS={};
function na_qb_wall(side){if(NA_QB_WALLS[side])return NA_QB_WALLS[side];const G=NA_QB_G,R=ag_rnd(side<0?377:811),V=[G.s0];let s=G.s0;
  while(s<G.s1){s*=1.03+0.07*R();if(Math.abs(s-1)<0.035)s=1;V.push(Math.min(s,G.s1));}
  const B=[],T=[],rim=[],foot=[];let b=20;
  V.forEach((v,i)=>{b=b*0.55+(R()-0.5)*44;if(R()<0.34)b+=(R()<0.5?-1:1)*(28+R()*44);const k=na_qb_calm(v),bend=clamp(1-(v-G.s0)/0.2,0,1);B.push(clamp(b,-64,84)*k+(side<0?10-70*bend:-6+150*bend*bend));T.push((R()-0.5)*20*k);
    rim.push([G.vp[0]+side*(G.half-B[i]*0.4*k)*v,G.vp[1]+(G.rim+T[i])*v]);foot.push([G.vp[0]+side*(G.halfFoot-B[i])*v+na_qb_meander(v)*v,G.vp[1]+G.foot*v]);});
  return NA_QB_WALLS[side]={V,B,T,rim,foot};}
function na_qb_along(side,s,key){const Wl=na_qb_wall(side),V=Wl.V;let i=1;while(i<V.length-1&&s>V[i])i++;const u=clamp((s-V[i-1])/((V[i]-V[i-1])||1),0,1),a=Wl[key][i-1],b=Wl[key][i];return[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];}
const na_qb_rimPt=(side,s)=>na_qb_along(side,s,"rim"),na_qb_footPt=(side,s)=>na_qb_along(side,s,"foot");
function na_qb_wallPt(side,s,f){const a=na_qb_rimPt(side,s),b=na_qb_footPt(side,s);return[lerp(a[0],b[0],f),lerp(a[1],b[1],f)];}
function na_qb_farPt(u,f){const G=NA_QB_G,a=na_qb_rimPt(-1,G.s0),b=na_qb_rimPt(1,G.s0),c=na_qb_footPt(-1,G.s0),d=na_qb_footPt(1,G.s0);
  const far=Math.sin(Math.PI*clamp(u,0,1));
  return[lerp(lerp(a[0],b[0],u),lerp(c[0],d[0],u),f)+7*na_qb_wob(u*1.3+f,5)*f*(1-f)*4,lerp(lerp(a[1],b[1],u)+6*na_qb_wob(u*0.9,3)-16*far,lerp(c[1],d[1],u)+4*Math.sin(u*7)-34*far,f)];}
// the skyline: the left hill, the land beyond the bend, the right hill; and a nearer shoulder of each hill, behind each end of the bridge
const NA_QB_SKYLINE=[[0,112],[150,100],[320,126],[480,170],[640,208],[780,232],[900,244],[1040,242],[1180,226],[1340,198],[1500,160],[1680,120],[1800,104],[1920,92]];
function na_qb_line(P,x){let i=1;while(i<P.length-1&&x>P[i][0])i++;const a=P[i-1],b=P[i],u=clamp((x-a[0])/(b[0]-a[0]),0,1);return lerp(a[1],b[1],u*u*(3-2*u));}
const na_qb_skyline=x=>na_qb_line(NA_QB_SKYLINE,x)+3*Math.sin(x/37)+2*Math.sin(x/71+1);
// flat ground beside each stone base, along the line of the bridge: where a line of people stands (their feet at y, from x0 to x1)
const NA_QB_BANK={L:{y:457,x0:40,x1:400},R:{y:461,x0:1520,x1:1880}};
// how big a thing on the land is drawn, by how far down the frame it stands (1 at the bridge)
const na_qb_near=y=>y>446?(y-150)/296:lerp(1,0.42,clamp((446-y)/330,0,1));

/* ---------------------------------------------------------------- small things */
function na_qb_blob(c,x,y,rx,ry,col,a){if(a<=0.004||rx<=0)return;c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);
  g.addColorStop(0,rgba(col,a));g.addColorStop(0.6,rgba(col,a*0.45));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-rx,-rx,2*rx,2*rx);c.restore();}
function na_qb_poly(c,P){c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}
// a tussock of ichu, the tough grass of the puna: a few blades fanning up from a dark foot, the ones towards the sun lighter
function na_qb_tuft(c,x,y,s,R,o){o=o||{};const n=o.n||4,h=(o.h||9)*s;c.fillStyle=rgba(NA_QB_K.ichuDk,0.3);c.beginPath();c.ellipse(x,y+0.6*s,3.6*s,1.3*s,0,0,TAU);c.fill();
  c.lineCap="round";for(let b=0;b<n;b++){const an=-Math.PI/2+(b-(n-1)/2)*0.34+(R()-0.5)*0.3,l=h*(0.7+R()*0.5),ex=x+Math.cos(an)*l+(o.droop?0:0),ey=y+Math.sin(an)*l;
    c.strokeStyle=rgba(b>=n/2?(R()<0.6?NA_QB_K.ichu:NA_QB_K.ichuMid):(R()<0.5?NA_QB_K.ichuMid:NA_QB_K.ichuDk),o.a==null?0.9:o.a);c.lineWidth=Math.max(0.8,1.3*s);
    c.beginPath();c.moveTo(x+(b-(n-1)/2)*1.1*s,y);c.quadraticCurveTo(x+Math.cos(an)*l*0.5,y+Math.sin(an)*l*0.7,ex+(o.droop?Math.sign(Math.cos(an))*l*0.25:0),ey+(o.droop?l*0.35:0));c.stroke();}}
// a boulder: a rounded mass, lit from the right, its shadow to the left
function na_qb_boulder(c,x,y,r,R,o){o=o||{};const col=o.col||NA_QB_K.rock,k=[];for(let i=0;i<9;i++){const an=i/9*TAU,d=r*(0.78+R()*0.34);k.push([x+Math.cos(an)*d*1.25,y+Math.sin(an)*d*0.74]);}
  c.fillStyle=rgba(NA_QB_K.rockDeep,0.28);c.beginPath();c.ellipse(x-r*0.5,y+r*0.62,r*1.3,r*0.26,0,0,TAU);c.fill();
  const shape=cc=>{cc.moveTo((k[0][0]+k[8][0])/2,(k[0][1]+k[8][1])/2);for(let i=0;i<9;i++){const a=k[i],b=k[(i+1)%9];cc.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}cc.closePath();};
  ag_shape(c,shape);c.fillStyle=rgba(mix(col,NA_QB_K.rockSh,0.35),1);c.fill();c.save();ag_shape(c,shape);c.clip();
  na_qb_blob(c,x+r*0.4,y-r*0.36,r*1.1,r*0.8,o.lit||NA_QB_K.rockLit,o.litA==null?0.85:o.litA);c.restore();}

/* ---------------------------------------------------------------- the sky and the far land */
function na_qb_paintSky(c,L){const g=c.createLinearGradient(0,0,0,300);g.addColorStop(0,rgba(L.sky0,1));g.addColorStop(0.75,rgba(mix(L.sky0,L.sky1,0.85),1));g.addColorStop(1,rgba(L.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,360);
  if(L.glow>0)na_qb_blob(c,1500,-40,900,420,[255,238,200],L.glow);
  // thin clouds over the far range; a low lid of them under a grey sky
  const cl=L.warm?[[720,120,120],[840,96,90],[1160,70,110],[1290,92,80]]:[[300,60,360],[700,90,420],[1100,60,440],[1500,40,400],[900,150,360]];
  for(const [x,y,r] of cl){na_qb_blob(c,x,y,r,r*0.3,NA_QB_K.cloud,L.warm?0.55:0.4);if(L.warm)na_qb_blob(c,x-r*0.2,y+r*0.12,r*0.8,r*0.16,[190,200,214],0.14);}
  // the far range: rock and a little snow, pale in the thin air
  const pk=[[540,250],[660,206],[760,180],[830,190],[900,158],[968,132],[1010,146],[1052,128],[1100,156],[1170,170],[1240,152],[1320,180],[1420,204],[1540,236]];
  const shape=cc=>{cc.moveTo(500,270);for(const p of pk)cc.lineTo(p[0],p[1]);cc.lineTo(1580,270);cc.closePath();};
  c.save();c.globalAlpha=L.warm?0.72:0.5;ag_shape(c,shape);c.fillStyle=rgba(NA_QB_K.peak,1);c.fill();ag_shape(c,shape);c.clip();
  c.fillStyle=rgba(NA_QB_K.peakSh,0.28);for(let i=0;i<pk.length-1;i+=2){c.beginPath();c.moveTo(pk[i][0],pk[i][1]+90);c.lineTo(pk[i+1][0],pk[i+1][1]);c.lineTo(pk[i+1][0]-56,pk[i+1][1]+110);c.closePath();c.fill();}
  c.fillStyle=rgba(NA_QB_K.snow,0.85);for(const [x,y,w] of [[968,132,20],[1052,128,24],[900,158,12]]){c.beginPath();c.moveTo(x,y-1);c.lineTo(x+w,y+w*0.72);c.lineTo(x+w*0.3,y+w*0.5);c.lineTo(x-w*0.2,y+w*0.8);c.lineTo(x-w*0.8,y+w*0.6);c.closePath();c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- the land: the hills above the gorge and the top of each bank */
function na_qb_landPath(c){c.moveTo(-40,na_qb_skyline(0));for(let x=0;x<=W;x+=16)c.lineTo(x,na_qb_skyline(x));c.lineTo(W+40,na_qb_skyline(W));
  const A=na_qb_wall(-1).rim,B=na_qb_wall(1).rim;c.lineTo(W+40,B[B.length-1][1]);for(let i=B.length-1;i>=0;i--)c.lineTo(B[i][0],B[i][1]);
  for(let u=1;u>=-1e-6;u-=0.04){const p=na_qb_farPt(u,0);c.lineTo(p[0],p[1]);}A.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(-40,A[A.length-1][1]);c.closePath();}
function na_qb_paintLand(c,L){const R=ag_rnd(4127),K=NA_QB_K;
  let g=c.createLinearGradient(0,90,0,780);g.addColorStop(0,rgba(mix(K.hillFar,K.hill,0.2),1));g.addColorStop(0.45,rgba(K.hill,1));g.addColorStop(1,rgba(mix(K.hill,K.earth,0.45),1));
  ag_shape(c,na_qb_landPath);c.fillStyle=g;c.fill();c.save();ag_shape(c,na_qb_landPath);c.clip();
  // the light: the left hill faces the sun, the right hill's slope turns from it a little
  if(L.warm){g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(255,240,196,0.16)");g.addColorStop(0.5,"rgba(255,240,196,0.04)");g.addColorStop(0.62,"rgba(64,54,70,0.08)");g.addColorStop(1,"rgba(64,54,70,0.22)");c.fillStyle=g;c.fillRect(0,0,W,H);}
  // the lie of the hills: broad soft shade in their hollows, light on their shoulders
  for(const [x,y,rx,ry,dark] of [[150,300,260,120,1],[420,250,200,90,0],[560,330,220,80,1],[90,180,200,70,0],[300,400,300,50,1],[760,290,200,46,1],[1160,286,200,44,0],[1380,330,240,80,1],[1560,250,220,90,0],[1760,330,280,120,1],[1840,170,200,70,0],[1620,410,300,50,1]]){
    if(dark)na_qb_blob(c,x,y,rx,ry,K.hillSh,0.34);else if(L.warm)na_qb_blob(c,x,y,rx,ry,[255,244,206],0.3);}
  // a nearer shoulder of each hill, behind each end of the bridge
  for(const [P,lx] of [[[[-40,330],[120,318],[260,340],[380,378],[470,412],[540,436],[540,470],[-40,470]],300],[[[1960,318],[1800,306],[1650,330],[1520,372],[1440,410],[1385,438],[1385,474],[1960,474]],1700]]){
    c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]+(i<6?3*Math.sin(p[0]/23):0)):c.moveTo(p[0],p[1]));c.closePath();g=c.createLinearGradient(0,300,0,470);g.addColorStop(0,rgba(mix(K.hill,K.ichu,0.35),1));g.addColorStop(1,rgba(mix(K.hill,K.earth,0.3),1));c.fillStyle=g;c.fill();
    c.strokeStyle=rgba(K.hillSh,0.3);c.lineWidth=2;c.beginPath();P.slice(0,6).forEach((p,i)=>i?c.lineTo(p[0],p[1]+3*Math.sin(p[0]/23)+2):c.moveTo(p[0],p[1]+2));c.stroke();}
  // the far land beyond the bend, paler
  na_qb_blob(c,960,270,330,60,K.hillFar,0.5);
  // ichu: a fine speckle far away, tussocks where the land is near enough to see them
  for(let k=0;k<2600;k++){const x=R()*W,y=lerp(na_qb_skyline(x)+3,400,R());c.fillStyle=rgba(R()<0.5?K.ichuDk:K.ichu,0.22+R()*0.2);c.fillRect(x,y,1.6,1.2+R()*1.8);}
  for(let k=0;k<3600;k++){const x=R()*W,y=lerp(330,800,Math.pow(R(),0.9)),s=na_qb_near(y);if(R()>clamp((y-300)/120,0.1,1))continue;if(Math.sin(x/61+y/37)+Math.sin(x/139-y/53)<-0.9)continue;na_qb_tuft(c,x,y,s*0.92,R,{n:s>0.9?4:3,h:8,a:lerp(0.5,0.92,clamp(s,0,1))});}
  // paths worn pale in the grass: one down each hill to its end of the bridge
  c.lineCap="round";c.lineJoin="round";
  for(const P of [[[200,330],[236,356],[214,384],[262,410],[250,432],[300,448]],[[1716,318],[1680,346],[1704,374],[1650,402],[1664,430],[1610,452]]]){
    for(const [col,w,a] of [[K.earthDk,5,0.22],[K.path,3,0.7]]){c.strokeStyle=rgba(col,a);c.lineWidth=w*0.8;c.beginPath();c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length-1;i++)c.quadraticCurveTo(P[i][0],P[i][1],(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2);c.lineTo(P[P.length-1][0],P[P.length-1][1]);c.stroke();}}
  // the flat ground beside each stone base, along the line of the bridge: packed earth, swept by many feet
  for(const [x0,x1,y] of [[-20,436,451],[1484,W+20,455]]){g=c.createLinearGradient(0,y-12,0,y+14);g.addColorStop(0,rgba(K.path,0));g.addColorStop(0.3,rgba(K.path,0.92));g.addColorStop(0.75,rgba(mix(K.path,K.earth,0.5),0.92));g.addColorStop(1,rgba(K.earth,0));
    c.fillStyle=g;c.fillRect(x0,y-12,x1-x0,26);c.fillStyle=rgba(K.earthDk,0.14);c.fillRect(x0,y-10,x1-x0,2);
    for(let k=0;k<70;k++){const x=lerp(x0,x1,R()),yy=y-8+R()*18;c.fillStyle=rgba(R()<0.5?K.earthDk:K.stoneLit,0.4);c.beginPath();c.ellipse(x,yy,1+R()*1.6,0.7+R(),0,0,TAU);c.fill();}
    for(let k=0;k<26;k++){const x=lerp(x0,x1,R());na_qb_tuft(c,x,y+15+R()*3,1.05,R,{n:4,h:9});na_qb_tuft(c,lerp(x0,x1,R()),y-10-R()*2,0.96,R,{n:3,h:7});}}
  // a few boulders in the grass
  for(let k=0;k<22;k++){const x=R()*W,y=lerp(na_qb_skyline(x)+20,740,R()),s=na_qb_near(y);if(Math.abs(y-453)<22)continue;na_qb_boulder(c,x,y,(5+R()*8)*s,R);na_qb_tuft(c,x-8*s,y+5*s,s,R);}
  c.restore();}

/* ---------------------------------------------------------------- the walls of the gorge and the river */
function na_qb_wallPath(c,side){const Wl=na_qb_wall(side);Wl.rim.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));for(let i=Wl.foot.length-1;i>=0;i--)c.lineTo(Wl.foot[i][0],Wl.foot[i][1]);c.closePath();}
function na_qb_farPath(c){for(let u=0;u<=1+1e-6;u+=0.04){const p=na_qb_farPt(u,0);u?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}for(let u=1;u>=-1e-6;u-=0.04){const p=na_qb_farPt(u,1);c.lineTo(p[0],p[1]);}c.closePath();}
function na_qb_riverPath(c){const A=na_qb_wall(-1).foot,B=na_qb_wall(1).foot;c.moveTo(A[0][0]-60,A[0][1]-50);A.forEach(p=>c.lineTo(p[0]-60,p[1]));for(let i=B.length-1;i>=0;i--)c.lineTo(B[i][0]+60,B[i][1]);c.lineTo(B[0][0]+60,B[0][1]-50);
  for(let u=1;u>=-1e-6;u-=0.05){const p=na_qb_farPt(u,1);c.lineTo(p[0],p[1]-6);}c.closePath();}
// a face of rock in ribs. N[i][j] is the point at step i along it and layer j down it; tone[i] how much light rib i takes (0 to 1);
// k[i] how big things are there. Dark volcanic rock: each rib a facet, lighter where it turns to the sun; broken ledges, each with a
// lit lip and a dark underside; shallow hollows under the overhangs; cracks; pale lichen and a rose-brown stain; ichu on the ledges
function na_qb_ribs(c,N,tone,k,seed,o){const R=ag_rnd(seed),K=NA_QB_K,ni=N.length,nj=N[0].length,lit=o.lit,dark=o.dark,hi=o.hi;c.lineCap="round";c.lineJoin="round";
  for(let i=0;i<ni-1;i++){const t=tone[i],kk=k[i];
    for(let j=0;j<nj-1;j++){const f=j/(nj-1),col=mix(mix(dark,lit,clamp(t*(1-f*0.45)+(R()-0.5)*0.16,0,1)),K.rockDeep,f*0.16);
      na_qb_poly(c,[N[i][j],N[i+1][j],N[i+1][j+1],N[i][j+1]]);c.fillStyle=rgba(col,1);c.fill();c.strokeStyle=rgba(col,1);c.lineWidth=1;c.stroke();}}
  for(let i=0;i<ni-1;i++){const kk=k[i];
    // the edge between two ribs: dark where the nearer one stands out
    if(i>0){const d=tone[i]-tone[i-1],a=clamp(Math.abs(d)*1.5,0.08,0.6);if(R()<0.85)for(let j=0;j<nj-1;j++){if(R()<0.25)continue;const p=N[i][j],q=N[i][j+1];c.strokeStyle=rgba(K.rockDeep,a*(0.5+R()*0.5));c.lineWidth=(0.8+R()*2)*kk;
        c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo((p[0]+q[0])/2+(R()-0.5)*7*kk,(p[1]+q[1])/2,q[0],q[1]);c.stroke();
        if(hi>0){c.strokeStyle=rgba(K.rockLit,hi*0.5);c.lineWidth=Math.max(0.8,1.1*kk);c.beginPath();c.moveTo(p[0]+(d>0?1.8:-1.8)*kk,p[1]);c.lineTo(q[0]+(d>0?1.8:-1.8)*kk,q[1]);c.stroke();}}}
    // ledges, broken: never one line right along the wall
    for(let j=1;j<nj-1;j++){if(R()<0.42)continue;const p=N[i][j],q=N[i+1][j],w=(1.2+R()*2.6)*kk,u0=R()*0.3,u1=1-R()*0.3,a=[lerp(p[0],q[0],u0),lerp(p[1],q[1],u0)],b=[lerp(p[0],q[0],u1),lerp(p[1],q[1],u1)];
      c.strokeStyle=rgba(K.rockDeep,0.5);c.lineWidth=w;c.beginPath();c.moveTo(a[0],a[1]+w*0.7);c.lineTo(b[0],b[1]+w*0.7);c.stroke();
      c.strokeStyle=rgba(K.rockLit,hi);c.lineWidth=Math.max(0.8,1.1*kk);c.beginPath();c.moveTo(a[0],a[1]-0.6*kk);c.lineTo(b[0],b[1]-0.6*kk);c.stroke();
      if(R()<0.4)na_qb_tuft(c,lerp(a[0],b[0],R()),lerp(a[1],b[1],R())-kk,kk*0.8,R,{n:3,h:7,droop:true,a:0.8});}
    // fine cracks inside a rib
    for(let n=0;n<2;n++){if(R()<0.4)continue;const j=(R()*(nj-1))|0,u=0.2+R()*0.6,p=[lerp(N[i][j][0],N[i+1][j][0],u),lerp(N[i][j][1],N[i+1][j][1],u)],q=[lerp(N[i][j+1][0],N[i+1][j+1][0],u),lerp(N[i][j+1][1],N[i+1][j+1][1],u)];
      c.strokeStyle=rgba(K.rockDeep,0.22);c.lineWidth=Math.max(0.7,kk);c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(lerp(p[0],q[0],0.5)+(R()-0.5)*6*kk,lerp(p[1],q[1],0.5));c.lineTo(q[0],q[1]);c.stroke();}}
  // stains and lichen, soft and low in contrast, and the rock's own unevenness
  for(let n=0;n<26;n++){const i=(R()*(ni-1))|0,j=(R()*(nj-1))|0,p=N[i][j],r=(16+R()*34)*k[i],col=n%3===0?K.rose:n%3===1?K.lichen:(R()<0.5?K.rockDeep:K.rockLit);
    for(let q=0;q<4;q++)na_qb_blob(c,p[0]+(R()-0.5)*r*2,p[1]+R()*r*1.4,r*(0.5+R()*0.6),r*(0.4+R()*0.5),col,n%3===2?0.16:0.2);}}
function na_qb_paintFar(c,L){const G=NA_QB_G,K=NA_QB_K,R=ag_rnd(53),U=[0];let u=0;while(u<1){u+=0.05+R()*0.07;U.push(Math.min(1,u));}
  const F=[0,0.1,0.24,0.4,0.57,0.76,1],N=U.map((u,i)=>F.map((f,j)=>{const p=na_qb_farPt(u,f);return[p[0]+(j>0&&j<6?(R()-0.5)*8:0),p[1]+(j>0&&j<6?(R()-0.5)*6:0)];}));
  // the far wall turns away to the right, where the gorge bends: lit on the left, dark towards the cleft
  const tone=U.map((u,i)=>clamp(0.78-u*0.9+(R()-0.5)*0.34,0,1));
  c.save();ag_shape(c,na_qb_farPath);c.clip();na_qb_ribs(c,N,tone,U.map(()=>G.s0),53,{lit:mix(K.rock,K.rockLit,0.5),dark:mix(K.rockSh,K.rockDeep,0.2),hi:0.3});
  const a=na_qb_farPt(0.62,0),b=na_qb_farPt(1,0),g=c.createLinearGradient(a[0],0,b[0],0);g.addColorStop(0,rgba(K.rockDeep,0));g.addColorStop(1,rgba(K.rockDeep,0.7));c.fillStyle=g;c.fillRect(a[0],0,b[0]-a[0]+60,H);c.restore();}
function na_qb_paintRiver(c,L){const G=NA_QB_G,K=NA_QB_K,R=ag_rnd(977),mid=s=>G.vp[0]+na_qb_meander(s)*s,at=(m,s)=>[mid(s)+m*G.halfFoot*s,G.vp[1]+G.foot*s];
  // pale and far at the bend, dark and green near us
  ag_shape(c,na_qb_riverPath);let g=c.createLinearGradient(0,150+G.foot*G.s0-40,0,1080);g.addColorStop(0,rgba(K.riverFar,1));g.addColorStop(0.22,rgba(K.river,1));g.addColorStop(1,rgba(K.riverDk,1));c.fillStyle=g;c.fill();
  c.save();ag_shape(c,na_qb_riverPath);c.clip();c.lineCap="round";
  // deep water under the right wall, where its shadow lies; a paler shallow along the left
  for(let s=G.s0;s<1.6;s+=0.05){const p=at(0.7,s),q=at(-0.6,s);na_qb_blob(c,p[0],p[1],150*s,26*s,K.riverDk,0.4);na_qb_blob(c,q[0],q[1],120*s,18*s,K.riverFar,0.2);}
  // the flow: short soft streaks that follow the stream
  for(let n=0;n<70;n++){const m=(R()-0.5)*1.7,s0=lerp(G.s0,1.5,R()),s1=s0*(1.03+R()*0.07);c.strokeStyle=rgba(R()<0.7?K.riverFar:K.foam,0.1+R()*0.16);c.lineWidth=(1+R()*1.6)*s0;
    c.beginPath();for(let i=0;i<=4;i++){const p=at(m*(1+0.03*i),lerp(s0,s1,i/4));i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();}
  // rapids: the water white where it drops over a sill of rock, and round the boulders
  for(const [sr,m0,m1] of [[0.69,-0.5,0.3],[0.86,-0.1,0.72],[1.07,-0.7,0.1],[1.3,0.0,0.8]])for(let n=0;n<34;n++){const m=lerp(m0,m1,R()),p=at(m,sr*(1+R()*0.07));c.fillStyle=rgba(K.foam,0.25+R()*0.5);
      c.beginPath();c.ellipse(p[0],p[1],(4+R()*12)*sr,(1+R()*1.5)*sr,0,0,TAU);c.fill();}
  for(const [m,s,r] of [[-0.42,0.67,7],[0.3,0.84,9],[-0.12,0.88,8],[0.52,0.93,11],[-0.6,1.05,12],[0.1,1.1,9],[0.64,1.28,13],[-0.3,1.31,12],[0.36,1.4,14]]){const p=at(m,s);
    for(let q=0;q<6;q++){c.fillStyle=rgba(K.foam,0.36+R()*0.3);c.beginPath();c.ellipse(p[0]+(R()-0.5)*r*3.2*s,p[1]+r*s*(0.4+R()*1.4),(5+R()*9)*s,(1.2+R()*1.5)*s,0,0,TAU);c.fill();}
    na_qb_boulder(c,p[0],p[1],r*s,R,{litA:0.35});}
  c.restore();}
function na_qb_paintWalls(c,L){const G=NA_QB_G,K=NA_QB_K,F=[0,0.07,0.17,0.3,0.44,0.59,0.75,0.9,1];
  for(const side of [-1,1]){const R=ag_rnd(side<0?19:71),Wl=na_qb_wall(side),V=Wl.V;
    const N=V.map((v,i)=>F.map((f,j)=>{const a=Wl.rim[i],b=Wl.foot[i],in0=j>0&&j<F.length-1,ff=f+(in0?(R()-0.5)*0.05:0);
      // the wall leans out a little half-way down, more on some ribs than others
      return[lerp(a[0],b[0],ff)-side*(in0?Math.sin(Math.PI*f)*(8+R()*22)*v:0),lerp(a[1],b[1],ff)];}));
    // a rib is lit when it turns towards us and the sun: the left wall takes the sun, the right wall only the sky's light
    const tone=V.map((v,i)=>i<V.length-1?clamp((side<0?0.62:0.3)+(Wl.B[i]-Wl.B[i+1])/(side<0?70:150)+(R()-0.5)*0.2,0,1):0.5);
    c.save();ag_shape(c,cc=>na_qb_wallPath(cc,side));c.clip();
    na_qb_ribs(c,N,tone,V,side<0?19:71,side<0?{lit:mix(K.rockLit,[196,180,160],L.warm*0.3),dark:mix(K.rock,K.rockSh,0.4),hi:0.5}:{lit:mix(K.rock,K.rockLit,0.25),dark:mix(K.rockSh,K.rockDeep,0.25),hi:0.2});
    c.restore();
    // fans of fallen rock against the wall's foot
    for(const [s0,w,h] of side<0?[[0.78,0.1,0.2],[1.12,0.16,0.26],[1.56,0.2,0.22]]:[[0.72,0.08,0.16],[0.96,0.12,0.24],[1.34,0.2,0.3]]){const top=na_qb_wallPt(side,s0+w*0.45,1-h),a=na_qb_footPt(side,s0),b=na_qb_footPt(side,s0+w),col=side<0?mix(K.rockLit,K.rose,0.25):mix(K.rock,K.rockSh,0.5);
      c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(top[0],top[1]);c.quadraticCurveTo(lerp(top[0],a[0],0.6)+side*8*s0,lerp(top[1],a[1],0.5),a[0]-side*24*s0,a[1]+6*s0);c.lineTo(b[0]-side*30*s0,b[1]+8*s0);c.quadraticCurveTo(lerp(top[0],b[0],0.5),lerp(top[1],b[1],0.45),top[0],top[1]);c.fill();
      for(let n=0;n<46;n++){const u=R(),v2=Math.pow(R(),0.6),x=lerp(top[0],lerp(a[0],b[0],u)-side*20*s0,v2),y=lerp(top[1],lerp(a[1],b[1],u)+4*s0,v2);c.fillStyle=rgba(R()<0.5?K.rockDeep:K.rockLit,0.2+R()*0.25);c.beginPath();c.ellipse(x,y,(1.5+R()*3.5)*s0,(1+R()*2)*s0,0,0,TAU);c.fill();}}
    // broken rock at the wall's foot, in the water's edge
    for(let n=0;n<90;n++){const s=lerp(G.s0,1.7,R()),p=na_qb_footPt(side,s);na_qb_boulder(c,p[0]-side*(R()*30-6)*s,p[1]+(R()-0.3)*16*s,(3+R()*8)*s,R,{litA:side<0?0.5:0.25});}
    // ichu along the rim, some of it hanging over the edge
    for(let n=0;n<170;n++){const s=lerp(G.s0,G.s1,Math.pow(R(),0.8));if(Math.abs(s-1)<0.06)continue;const p=na_qb_rimPt(side,s);na_qb_tuft(c,p[0]+side*R()*8*s,p[1]+2*s,s*0.95,R,{n:4,h:9,droop:R()<0.5});}}}
// the shadow the right bank throws into the gorge: the right wall, the river, the far wall's lower part and the left wall below the line
// the sun reaches; then a little haze at the bend, so the far wall sits back
function na_qb_paintCast(c,L){const G=NA_QB_G,K=NA_QB_K;if(L.cast>0)for(const [df,a] of [[0,0.62],[0.03,0.38]]){c.beginPath();let i=0;
    for(let s=G.s1;s>=G.s0-1e-6;s-=0.02,i++){const p=na_qb_wallPt(-1,s,clamp(0.34+df+0.07*na_qb_wob(s*1.4,3)+0.12*(s-1),0.1,0.9));i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}
    for(let u=0;u<=1+1e-6;u+=0.05){const p=na_qb_farPt(u,0.42+df+0.05*Math.sin(u*9));c.lineTo(p[0],p[1]);}
    const Rm=na_qb_wall(1).rim;Rm.forEach(p=>c.lineTo(p[0],p[1]+1));c.lineTo(W+60,H+60);c.lineTo(-60,H+60);c.closePath();c.fillStyle=rgba(K.shade,L.cast*a);c.fill();}
  c.save();c.beginPath();na_qb_farPath(c);na_qb_riverPath(c);na_qb_wallPath(c,-1);na_qb_wallPath(c,1);c.clip();const p=na_qb_farPt(0.5,0.6);na_qb_blob(c,p[0],p[1],430,300,[190,204,218],L.warm?0.32:0.38);c.restore();}

/* ---------------------------------------------------------------- the stone bases, one on each bank
   Old dry stone: a platform at the rim with its wall running down the rock, and two short pillars at its edge. The four floor cables
   leave the platform between the pillars; each handrail leaves from a pillar; all are tied off behind (na_qb_bridge.js draws the ropes).
   Drawn for the left bank and mirrored for the right, whose face to the gorge is in shade. */
function na_qb_stones(c,P,col,R,rows,o){o=o||{};na_qb_poly(c,P);c.fillStyle=rgba(col,1);c.fill();c.save();na_qb_poly(c,P);c.clip();
  const x0=Math.min(...P.map(p=>p[0])),x1=Math.max(...P.map(p=>p[0])),y0=Math.min(...P.map(p=>p[1])),y1=Math.max(...P.map(p=>p[1])),rh=(y1-y0)/rows,sk=o.skew||0;
  for(let r=0;r<rows;r++){let x=x0-R()*10;while(x<x1){const w=9+R()*12,yy=y0+r*rh+sk*(x-x0);c.fillStyle=rgba(R()<0.5?NA_QB_K.stoneLit:NA_QB_K.stoneSh,0.1+R()*0.2);c.fillRect(x,yy-1,w,rh+2);
      c.fillStyle=rgba(NA_QB_K.joint,0.34);c.fillRect(x+w-0.6,yy,1.2,rh);x+=w;}
    c.strokeStyle=rgba(NA_QB_K.joint,0.38);c.lineWidth=1.1;c.beginPath();c.moveTo(x0,y0+(r+1)*rh);c.lineTo(x1,y0+(r+1)*rh+sk*(x1-x0));c.stroke();}
  c.restore();}
// the left base's shapes: a platform [top, front, the wall down the rock], and its two pillars [front, side, top]
const NA_QB_BASE={top:[[404,446],[500,446],[516,430],[428,430]],front:[[404,446],[500,446],[500,466],[404,466]],down:[[500,446],[516,430],[516,506],[500,530]],
  near:[[[474,396],[500,396],[500,446],[474,446]],[[500,396],[508,388],[508,438],[500,446]],[[474,396],[500,396],[508,388],[482,388]]],
  far:[[[484,386],[508,386],[508,432],[484,432]],[[508,386],[516,378],[516,424],[508,432]],[[484,386],[508,386],[516,378],[492,378]]]};
function na_qb_paintBase(c,side,L){const K=NA_QB_K,R=ag_rnd(side<0?61:67),lit=side<0&&L.warm,face=lit?K.stoneLit:mix(K.stoneSh,K.stone,L.warm?0.12:0.5),front=mix(K.stone,K.stoneSh,L.warm?0.22:0.2),B=NA_QB_BASE;
  c.save();if(side>0){c.translate(W,4);c.scale(-1,1);}
  // its shadow on the ground, away from the sun
  na_qb_blob(c,side<0?410:500,468,70,9,K.rockDeep,0.3);
  const pillar=P=>{na_qb_stones(c,P[0],front,R,6);na_qb_stones(c,P[1],face,R,6);na_qb_poly(c,P[2]);c.fillStyle=rgba(K.stoneLit,1);c.fill();};
  pillar(B.far);
  na_qb_stones(c,B.down,face,R,9);na_qb_poly(c,B.top);c.fillStyle=rgba(mix(K.stoneLit,K.path,0.3),1);c.fill();na_qb_stones(c,B.front,front,R,3);
  c.strokeStyle=rgba(K.joint,0.3);c.lineWidth=1;c.beginPath();c.moveTo(404,446);c.lineTo(500,446);c.lineTo(516,430);c.stroke();
  pillar(B.near);
  c.restore();}

/* ---------------------------------------------------------------- the whole place */
function na_qb_paintGorge(c,o){o=o||{};const L=NA_QB_LIGHT[o.light||"sun"];
  na_qb_paintSky(c,L);na_qb_paintLand(c,L);na_qb_paintRiver(c,L);na_qb_paintFar(c,L);na_qb_paintWalls(c,L);na_qb_paintCast(c,L);na_qb_paintBase(c,-1,L);na_qb_paintBase(c,1,L);
  if(L.veil>0){c.fillStyle=rgba([150,156,168],L.veil);c.fillRect(0,0,W,H);c.fillStyle=rgba([52,56,70],0.1);c.fillRect(0,0,W,H);}
  const g=c.createRadialGradient(W*0.5,H*0.44,H*0.42,W*0.5,H*0.44,W*0.8);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.24));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.naGorge=c=>na_qb_paintGorge(c,{light:"sun"});
