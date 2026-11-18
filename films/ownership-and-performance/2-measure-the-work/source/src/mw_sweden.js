/* ===== Measure the work, not the people: Sweden, from 1997 =====
   The opening's places and people, drawn with the people kit (films/people-first/shared/): a two-lane country road through fields
   and pines, seen from its verge, by day and at dusk, with and without the barrier of steel cables down its middle; a family's
   kitchen at night; the road engineers' office, with its wall map; and a small town's roundabout, with a crossing. People wear
   plain clothes of the late 1990s. Nothing Swedish is drawn but the roads themselves: no flag, no sign, no landmark, no maker's
   mark on a car. No crash is shown, and the cars make no sound. Everyone outdoors is sized by one eye line (MW_E), so near and far
   people, and the cars, belong to one picture. */
const MW_E=430,MW_R={far:600,mid:640,near:680,edge:692};
const mw_h=fl=>PK.hAt(fl,MW_E);
// how many px a metre is at a depth whose ground is at y, on the outdoor eye line
const mw_m=y=>Math.max(1,(y-MW_E)/(0.93*1.7));
const MW_CAST={
  officer:{key:"officer",name:"",skin:[238,206,180],hair:{style:"short",c:[196,164,112]},top:{kind:"jacket",c:[58,68,98],inner:[206,218,232]},bottom:{kind:"trousers",c:[50,56,78]},shoe:[40,36,40]},
  driver:{key:"driver",name:"",skin:[226,186,156],hair:{style:"bob",c:[112,78,52]},top:{kind:"jacket",c:[176,128,138],inner:[240,236,230]},bottom:{kind:"trousers",c:[92,108,140]},shoe:[70,60,60]},
  mum:{key:"mum",name:"",skin:[242,212,190],hair:{style:"long",c:[208,178,124]},top:{kind:"sweater",c:[206,190,162]},bottom:{kind:"trousers",c:[96,92,110]},shoe:[86,70,64]},
  boy:{key:"boy",kid:true,name:"",skin:[244,214,192],hair:{style:"crop",c:[214,188,136]},top:{kind:"sweater",c:[118,146,150]},bottom:{kind:"trousers",c:[86,100,130]},shoe:[96,84,80]},
  eng:{key:"eng",name:"",skin:[240,206,182],hair:{style:"bob",c:[178,160,132]},glasses:[70,58,60],top:{kind:"jacket",c:[146,136,158],inner:[236,230,222]},bottom:{kind:"trousers",c:[104,100,112]},shoe:[70,58,58]},
  inv:{key:"inv",name:"",skin:[206,160,126],hair:{style:"short",c:[52,40,34]},beard:[64,50,42],top:{kind:"jacket",c:[120,124,104],inner:[230,226,214]},bottom:{kind:"trousers",c:[80,78,86]},shoe:[58,48,44]},
  wk1:{key:"wk1",name:"",skin:[236,198,170],hair:{style:"short",c:[150,110,72]},top:{kind:"jacket",c:[92,102,114],inner:[196,198,194]},bottom:{kind:"trousers",c:[84,92,102]},shoe:[46,42,44]},
  wk2:{key:"wk2",name:"",skin:[132,90,66],hair:{style:"coily",c:[34,26,26]},top:{kind:"jacket",c:[104,100,96],inner:[196,198,194]},bottom:{kind:"trousers",c:[90,90,96]},shoe:[46,42,44]},
  walker:{key:"walker",name:"",skin:[198,150,116],hair:{style:"bun",c:[52,38,32]},top:{kind:"jacket",c:[184,160,124],inner:[240,236,228]},bottom:{kind:"skirt",c:[88,84,104]},shoe:[70,56,52]},
  child:{key:"child",kid:true,name:"",skin:[200,154,120],hair:{style:"coily",c:[40,30,28]},top:{kind:"sweater",c:[168,150,186]},bottom:{kind:"trousers",c:[90,96,122]},shoe:[98,80,80]},
  old:{key:"old",name:"",skin:[236,204,182],hair:{style:"short",c:[200,198,196]},glasses:[60,52,52],top:{kind:"jacket",c:[132,110,90],inner:[230,226,214]},bottom:{kind:"trousers",c:[92,88,84]},shoe:[58,46,42]},
  driver2:{key:"driver2",name:"",skin:[220,176,144],hair:{style:"long",c:[44,34,34]},top:{kind:"jacket",c:[138,86,98],inner:[232,226,220]},bottom:{kind:"trousers",c:[74,74,92]},shoe:[54,44,46]}
};
const MW_PAL={pine:[66,104,86],pine2:[92,128,104],pine3:[124,150,124],field:[[188,198,132],[214,204,148],[164,186,120],[200,190,140]],grass:[150,178,108],grassDk:[118,150,92],
  lake:[150,190,206],farm:[226,214,188],roof:[118,96,92],road:[132,132,138],roadDk:[108,108,116],line:[244,242,234],post:[150,154,160],cable:[110,114,124],
  flower:[[240,236,226],[214,190,212],[236,214,140]],stone:[196,190,180],
  car:[[150,72,70],[118,132,150],[214,206,190],[96,104,96],[176,170,160],[70,78,100],[188,160,120]],tyre:[48,46,50],hub:[176,178,182],glass:[176,198,210],glassDk:[66,78,98],lamp:[252,240,196],tail:[176,58,60]};
const mw_c=(n,i)=>PK.S.tone(i==null?MW_PAL[n]:MW_PAL[n][i]);
// dusk: everything the light no longer reaches, darker and bluer
const mw_dusk=(c,k)=>PK.u.mix(c,[56,60,92],0.5*(k==null?1:k));

/* ---------------------------------------------------------------- the road, from its verge
   The road runs across the picture: its far edge at MW_R.far, the middle line at MW_R.mid, its near edge at MW_R.near. People stand
   on the near verge (MW_R.edge and below), cars drive on it, their wheels on the lane's line. o.dusk: the light at dusk;
   o.barrier: the barrier of steel cables down the middle, all of it (a shot that builds it draws its posts itself, mw_barrier). */
function mw_sky(ctx,dusk){const U=PK.u,g=ctx.createLinearGradient(0,0,0,MW_E+20);
  g.addColorStop(0,U.css(dusk?[70,84,128]:PK.col("skyTop")));g.addColorStop(1,U.css(dusk?[236,200,170]:PK.col("skyLow")));ctx.fillStyle=g;ctx.fillRect(0,0,1920,1080);
  PK.S.begin(ctx,{lw:1.5,far:0.8,sh:3});if(!dusk){PK.cloud(ctx,420,150,1.1);PK.cloud(ctx,1300,96,0.8);PK.cloud(ctx,1720,210,0.7);}}
// a row of pines on the horizon: tops of n teeth, each a narrow cone
function mw_pines(ctx,y,h,seed,col,x0,x1){const U=PK.u,R=U.rnd(seed),pts=[[x0,y+40,1]];let x=x0;
  while(x<x1){const w=18+R()*16,hh=h*(0.7+R()*0.5);pts.push([x+w*0.15,y-hh*0.2],[x+w*0.5,y-hh,1],[x+w*0.85,y-hh*0.25]);x+=w*(0.8+R()*0.3);}
  pts.push([x1,y+40,1]);PK.S.poly(ctx,pts,col,{flat:true,exact:true,ten:0.2});}
function mw_far(ctx,dusk){const S=PK.S,U=PK.u,d=c=>dusk?mw_dusk(c,0.8):c;
  // the far woods on the horizon, two rows, and a lake between fields on the left
  S.begin(ctx,{lw:1.4,far:0.75,sh:3});mw_pines(ctx,MW_E+8,46,3,d(U.mix(mw_c("pine3"),PK.col("skyLow"),0.35)),-40,1980);
  S.begin(ctx,{lw:1.6,far:0.6,sh:3});mw_pines(ctx,MW_E+22,62,7,d(mw_c("pine2")),-40,760);mw_pines(ctx,MW_E+22,58,11,d(mw_c("pine2")),1240,1980);
  // the fields, strips that run to the woods
  S.begin(ctx,{lw:1.6,far:0.5,sh:3});const top=MW_E+20;
  S.poly(ctx,[[-40,top,1],[1960,top,1],[1960,MW_R.far+4,1],[-40,MW_R.far+4,1]],d(mw_c("field",0)),{flat:true,exact:true});
  const R=U.rnd(21);let x=-60;while(x<1980){const w=170+R()*260,ci=(R()*4)|0,sl=40+R()*40;
    S.poly(ctx,[[x,top+6,1],[x+w,top+6,1],[x+w+sl,MW_R.far,1],[x+sl,MW_R.far,1]],d(U.mix(mw_c("field",ci),mw_c("grass"),0.15)),{w:0.5,flat:true,exact:true});x+=w+4;}
  S.begin(ctx,{lw:1.4,far:0.5,sh:3});S.fill(ctx,c=>U.ell(c,330,top+20,250,11),d(mw_c("lake")),{w:0.5,flat:true});
  // a farm far off: a house and a barn, plain
  S.begin(ctx,{lw:1.5,far:0.5,sh:3});const fx=1470,fy=top+10;S.fill(ctx,c=>U.rrect(c,fx,fy-46,92,48,2),d(mw_c("farm")),{flat:true});S.poly(ctx,[[fx-8,fy-44,1],[fx+46,fy-74,1],[fx+100,fy-44,1]],d(mw_c("roof")),{flat:true,exact:true});
  S.fill(ctx,c=>U.rrect(c,fx+120,fy-38,120,40,2),d(U.mix(mw_c("farm"),[150,140,130],0.4)),{flat:true});S.poly(ctx,[[fx+112,fy-36,1],[fx+180,fy-62,1],[fx+248,fy-36,1]],d(U.dk(mw_c("roof"),0.1)),{flat:true,exact:true});
  // birches along the far side of the road
  S.begin(ctx,{lw:1.8,far:0.35,sh:3});for(const [bx,k] of [[150,1],[236,0.8],[1660,1.1],[1760,0.9],[1840,1.05]]){const by=MW_R.far-4;
    S.fill(ctx,c=>U.rrect(c,bx-4*k,by-120*k,8*k,120*k,2),d([232,228,220]),{w:0.6,flat:true});
    S.fill(ctx,c=>{U.ell(c,bx,by-140*k,40*k,56*k);U.ell(c,bx-24*k,by-112*k,26*k,30*k);U.ell(c,bx+24*k,by-116*k,26*k,30*k);},d(mw_c("pine3")),{sa:0.1});}}
function mw_roadBand(ctx,dusk){const S=PK.S,U=PK.u,d=c=>dusk?mw_dusk(c,0.7):c,{far,mid,near,edge}=MW_R;
  S.begin(ctx,{lw:2.2,far:0.2,sh:4});
  // the near verge, grass to the bottom of the picture, a little lower towards the front
  S.poly(ctx,[[-40,edge,1],[1960,edge,1],[1960,1100,1],[-40,1100,1]],d(mw_c("grass")),{exact:true,grad:[0,edge,0,1080,0.12]});
  // the asphalt, its shoulders, and its lines: solid at the edges, broken down the middle
  S.poly(ctx,[[-40,far-6,1],[1960,far-6,1],[1960,near+8,1],[-40,near+8,1]],d(mw_c("road")),{exact:true,grad:[0,far,0,near,0.1]});
  ctx.fillStyle=U.css(d(mw_c("line")));ctx.fillRect(-40,far-1,2000,3);ctx.fillRect(-40,near-3,2000,4);
  for(let x=-20;x<1960;x+=150)ctx.fillRect(x,mid-2,80,4);
  // grass tufts and a few flowers on the verge
  const R=U.rnd(33);for(let i=0;i<80;i++){const x=R()*1960,y=edge+16+R()*(1080-edge-16),k=0.5+(y-edge)/380;ctx.fillStyle=U.css(d(U.mix(mw_c("grassDk"),mw_c("grass"),R()*0.6)));
    ctx.beginPath();for(let j=0;j<4;j++){const a=-0.6+j*0.4,l=(10+R()*10)*k;ctx.moveTo(x-2*k,y);ctx.quadraticCurveTo(x+Math.sin(a)*l*0.5,y-l*0.6,x+Math.sin(a)*l,y-Math.cos(a)*l);ctx.quadraticCurveTo(x+Math.sin(a)*l*0.4+2*k,y-l*0.5,x+2*k,y);}ctx.fill();}
  for(let i=0;i<26;i++){const x=R()*1960,y=edge+40+R()*360,k=0.6+(y-edge)/420;ctx.fillStyle=U.css(d(mw_c("flower",i%3)));ctx.beginPath();ctx.arc(x,y,3.4*k,0,U.TAU);ctx.fill();}}
function mw_roadPlace(ctx,o){o=o||{};mw_sky(ctx,o.dusk);mw_far(ctx,o.dusk);mw_roadBand(ctx,o.dusk);}
/* the barrier: posts down the middle line, about every 2.5 m, and three steel cables along them, drawn from x0 as far as x1 (the
   posts not yet set aren't there); bent: [x, k] a stretch the cables lean on (k 0 to 1), as where they hold a car */
function mw_barrier(ctx,x0,x1,dusk,bent){const S=PK.S,U=PK.u,d=c=>dusk?mw_dusk(c,0.6):c,y=MW_R.mid+2,m=mw_m(y),ph=0.78*m,gap=2.5*m,pc=d(mw_c("post")),cc=d(mw_c("cable"));
  if(x1<=x0)return;S.begin(ctx,{lw:1.6,far:0.15,sh:3});const lean=x=>bent?bent[1]*U.sine(Math.max(0,1-Math.abs(x-bent[0])/(1.7*gap))):0;
  for(let x=Math.ceil((x0+40)/gap)*gap-40;x<=x1;x+=gap){const l=lean(x)*36;S.fill(ctx,c=>{c.moveTo(x-3,y);c.lineTo(x+3,y);c.lineTo(x+3+l,y-ph);c.lineTo(x-3+l,y-ph);c.closePath();},pc,{w:0.5});}
  ctx.save();ctx.lineCap="round";for(const [f,w] of [[0.55,2.6],[0.72,2.6],[0.9,2.6]]){ctx.strokeStyle=U.css(cc);ctx.lineWidth=w;ctx.beginPath();
    for(let x=x0;x<=x1;x+=12){const yy=y-ph*f+lean(x)*20*f;x===x0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}ctx.restore();}
// the barrier isn't painted into a place: it stands between the lanes, so the film draws it after the far lane's cars and before
// the near lane's (mw_traffic)
AG_PLACES.mwRoad=c=>mw_roadPlace(c,{});
AG_PLACES.mwDusk=c=>mw_roadPlace(c,{dusk:true});

/* ---------------------------------------------------------------- a car, from the side
   x: its middle; y: where its wheels stand (a lane's line); o.flip: it faces left; o.col; o.dusk; o.lights (0 to 1): its lamps
   lit, with the light they throw ahead on the road; o.tilt (radians): leaning, as where the barrier holds it; o.who: someone at
   the wheel, seen through the side window as a shape (they are inside the car, so they aren't drawn as a person). A car of the
   late 1990s, an estate or a saloon, with no maker's mark. */
function mw_car(ctx,x,y,o){o=o||{};const S=PK.S,U=PK.u,m=mw_m(y),col0=o.col||mw_c("car",0),dk=c=>o.dusk?mw_dusk(c,0.55):c,col=dk(col0),est=o.estate!==false;
  ctx.save();ctx.translate(x,y);if(o.flip)ctx.scale(-1,1);if(o.tilt)ctx.rotate(o.tilt);ctx.scale(m,-m);
  // a car is solid: the people kit's check (people.py) holds any two apart, and what is further away behind what is nearer
  if(PK.watch)PK.watch({solid:"car",at:[-2.24,0,2.24,1.38],ground:0,ctx});
  const lw=U.clamp(m*0.012,1.0,3.2);S.begin(ctx,{lw:lw/m*1.0,far:o.far||0,sh:3});
  if(o.lights>0.01){ctx.save();ctx.globalAlpha*=0.32*o.lights;ctx.fillStyle=U.css(mw_c("lamp"));ctx.beginPath();ctx.moveTo(2.15,0.62);ctx.lineTo(9,0.05);ctx.lineTo(9,-0.25);ctx.lineTo(2.1,0.5);ctx.closePath();ctx.fill();ctx.restore();}
  // the shadow under it
  ctx.fillStyle="rgba(40,34,40,0.22)";ctx.beginPath();ctx.ellipse(0,0.02,2.3,0.09,0,0,U.TAU);ctx.fill();
  const body=est?[[-2.18,0.3,1],[-2.22,0.84],[-2.08,1.34,1],[0.42,1.38,1],[1.22,0.92,1],[2.14,0.82],[2.24,0.52],[2.16,0.3,1]]:[[-2.2,0.3,1],[-2.24,0.86],[-1.62,0.92,1],[-1.15,1.36,1],[0.4,1.38,1],[1.18,0.92,1],[2.14,0.82],[2.24,0.52],[2.16,0.3,1]];
  S.poly(ctx,body,col,{exact:true,ten:0.5});
  // the wheel wells, dark, round each wheel
  ctx.save();ctx.beginPath();PK.u.spline(ctx,body,true,0.5);ctx.clip();ctx.fillStyle=U.css(U.dk(col,0.55));for(const wx of [-1.32,1.38]){ctx.beginPath();ctx.ellipse(wx,0.32,0.42,0.42,0,0,U.TAU);ctx.fill();}ctx.restore();
  // the windows, with their pillars, and someone at the wheel
  const win=est?[[-1.98,0.95,1],[-1.94,1.27,1],[0.34,1.29,1],[1.04,0.95,1]]:[[-1.52,0.95,1],[-1.1,1.27,1],[0.34,1.29,1],[1.02,0.95,1]];
  S.poly(ctx,win,dk(o.dusk?mw_c("glassDk"):mw_c("glass")),{exact:true,ten:0,w:0.6});
  if(o.who){const hc=o.who.c||[60,50,52];ctx.fillStyle=U.css(dk(hc),0.85);ctx.beginPath();ctx.ellipse(0.42,1.16+(o.who.nod||0)*-0.06,0.15,0.17,o.who.nod||0,0,U.TAU);ctx.fill();ctx.fillRect(0.2,0.95,0.46,0.12);}
  ctx.fillStyle=U.css(col);for(const px of est?[-0.42,-1.32]:[-0.42])ctx.fillRect(px,0.95,0.1,0.38);
  // doors, a handle, the lamps, the bumpers
  ctx.strokeStyle=U.css(U.dk(col,0.35));ctx.lineWidth=0.025;ctx.beginPath();ctx.moveTo(-0.38,0.34);ctx.lineTo(-0.38,0.95);ctx.moveTo(0.98,0.36);ctx.lineTo(1.02,0.92);ctx.moveTo(-1.95,0.36);ctx.lineTo(-1.95,0.92);ctx.stroke();
  ctx.fillStyle=U.css(U.dk(col,0.3));ctx.fillRect(0.6,0.74,0.22,0.05);ctx.fillRect(-0.92,0.74,0.22,0.05);
  ctx.fillStyle=U.css(o.lights>0.01?U.mix(mw_c("lamp"),[255,255,255],0.3):dk([232,228,214]));ctx.fillRect(2.05,0.6,0.16,0.14);
  ctx.fillStyle=U.css(dk(mw_c("tail")));ctx.fillRect(-2.24,0.58,0.1,0.2);
  // o.hazard (0 to 1): its hazard lamps, front and back, as they blink; the film passes how far into each blink they are
  if(o.hazard>0.01){ctx.save();ctx.globalAlpha*=o.hazard;ctx.fillStyle="rgba(255,176,40,1)";ctx.fillRect(2.0,0.48,0.16,0.1);ctx.fillRect(-2.26,0.46,0.12,0.1);
    ctx.globalAlpha*=0.35;ctx.beginPath();ctx.ellipse(2.1,0.53,0.32,0.22,0,0,U.TAU);ctx.ellipse(-2.2,0.51,0.3,0.2,0,0,U.TAU);ctx.fill();ctx.restore();}
  ctx.fillStyle=U.css(dk([84,84,90]));ctx.fillRect(-2.3,0.36,0.34,0.1);ctx.fillRect(1.98,0.36,0.32,0.1);
  // the wheels
  for(const wx of [-1.32,1.38]){S.fill(ctx,c=>U.ell(c,wx,0.32,0.32,0.32),dk(mw_c("tyre")),{});S.fill(ctx,c=>U.ell(c,wx,0.32,0.15,0.15),dk(mw_c("hub")),{w:0.6});}
  ctx.restore();}
/* traffic: cars that pass, each [lane ("near": to the right; "far": to the left), when it enters, how long it takes to cross the
   picture, colour index, estate]; t the shot's time. What is further away is drawn first: the far lane's cars, then the barrier
   down the middle where the road has one (o.barrier), then the near lane's. Drawn in the order they were listed, a far car lay
   over a near one, and over the barrier, as if they drove through each other (the author, 18 November 2026) */
function mw_traffic(ctx,tt,cars,o){o=o||{};const on=[];for(const [lane,t0,dur,ci,est] of cars){const u=(tt-t0)/dur;if(u<0||u>1)continue;const near=lane==="near";
    on.push({near,x:near?PK.u.lerp(-420,2340,u):PK.u.lerp(2340,-420,u),y:near?MW_R.near-12:MW_R.mid-14,ci,est});}
  const car=c=>mw_car(ctx,c.x,c.y,{flip:!c.near,col:mw_c("car",c.ci%7),estate:c.est,dusk:o.dusk,lights:o.dusk?1:0});
  on.filter(c=>!c.near).forEach(car);if(o.barrier)mw_barrier(ctx,-60,1980,o.dusk);on.filter(c=>c.near).forEach(car);}
/* ---------------------------------------------------------------- a family's kitchen, at night
   The window looks out on the dark; the lamp over the table is lit; the clock on the wall says how late it is. The table and the
   chairs are drawn with the people (mw_kitTable), so a seated person's legs go under it. */
const MW_KE=360,MW_KT={x0:700,x1:1230,top:640,floor:884},mw_hK=fl=>PK.hAt(fl,MW_KE);
function mw_nightView(ctx,x,y,w,h){const U=PK.u,g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,U.css([34,44,78]));g.addColorStop(1,U.css([74,84,118]));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ctx.fillStyle=U.css([236,232,214],0.8);for(const [sx,sy] of [[0.18,0.12],[0.42,0.22],[0.7,0.1],[0.86,0.3],[0.3,0.36]]){ctx.beginPath();ctx.arc(x+w*sx,y+h*sy,2.2,0,U.TAU);ctx.fill();}
  PK.S.begin(ctx,{lw:1.4,far:0.6,sh:3});mw_pines(ctx,y+h*0.74,70,5,[38,52,62],x-20,x+w+20);
  PK.S.fill(ctx,c=>U.rrect(c,x+w*0.6,y+h*0.6,90,70,2),[58,64,80],{flat:true});ctx.fillStyle=U.css([240,214,150]);ctx.fillRect(x+w*0.6+18,y+h*0.6+20,22,24);ctx.fillRect(x+w*0.6+52,y+h*0.6+20,22,24);}
function mw_kitchenPlace(ctx){const S=PK.S,U=PK.u;PK.paint.wall(ctx,[228,214,192],800);
  PK.window(ctx,170,170,360,350,mw_nightView,{light:false});
  // the counter and the cupboards on the right, a kettle and a radio on it; the door to the hall beyond
  S.begin(ctx,{lw:3,far:0.1,sh:5});const cab=[214,200,176],cx0=1290,cx1=1580;
  S.fill(ctx,c=>U.rrect(c,cx0,220,cx1-cx0,170,4),cab,{});S.line(ctx,c=>{c.moveTo((cx0+cx1)/2,224);c.lineTo((cx0+cx1)/2,386);},null,0.6);
  S.fill(ctx,c=>U.rrect(c,cx0,600,cx1-cx0,200,4),cab,{});S.line(ctx,c=>{c.moveTo((cx0+cx1)/2,612);c.lineTo((cx0+cx1)/2,796);},null,0.6);
  S.fill(ctx,c=>U.rrect(c,cx0-14,586,cx1-cx0+28,22,4),[176,160,140],{});
  S.fill(ctx,c=>{U.rrect(c,1330,520,70,66,14);U.rrect(c,1398,540,18,10,3);},[196,200,204],{});S.fill(ctx,c=>U.rrect(c,1460,536,96,50,8),[116,104,96],{});
  S.fill(ctx,c=>U.ell(c,1530,560,13,13),[200,196,186],{w:0.6});
  PK.door(ctx,1690,800,210,520,{col:[196,170,140]});
  PK.clock(ctx,1160,236,44,23.15);
  PK.paint.floorAt(ctx,800,[200,188,168],false);PK.paint.skirting(ctx,780);
  // the lamp over the table, on its cord
  S.begin(ctx,{lw:2.4,far:0.05,sh:4});ctx.strokeStyle=U.css([70,62,66]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(965,0);ctx.lineTo(965,300);ctx.stroke();
  S.poly(ctx,[[905,362,1],[1025,362,1],[992,300,1],[938,300,1]],[226,200,150],{exact:true});
  ctx.fillStyle=U.css([255,244,206],0.32);ctx.beginPath();ctx.moveTo(910,364);ctx.lineTo(1020,364);ctx.lineTo(1230,640);ctx.lineTo(700,640);ctx.closePath();ctx.fill();}
AG_PLACES.mwKitchen=mw_kitchenPlace;
// the table, seen from its long side, and what is on it: o.plate an empty place laid (a plate and a glass, at the right end)
function mw_kitTable(ctx,o){o=o||{};const S=PK.S,U=PK.u,T=MW_KT;S.begin(ctx,{lw:2.8,sh:4});
  S.fill(ctx,c=>{U.rrect(c,T.x0+30,T.top+18,22,T.floor-T.top-18,4);U.rrect(c,T.x1-52,T.top+18,22,T.floor-T.top-18,4);},[150,112,82],{});
  S.fill(ctx,c=>U.rrect(c,T.x0,T.top,T.x1-T.x0,24,6),[182,140,104],{});
  if(o.plate){S.fill(ctx,c=>U.ell(c,T.x1-110,T.top-4,58,9),[244,242,236],{w:0.6});S.fill(ctx,c=>U.rrect(c,T.x1-40,T.top-56,26,52,5),[214,230,234],{w:0.6});}
  if(o.mug)PK.mug(ctx,T.x0+150,T.top+2,0.8,PK.col("mug2"),o.t||0,false);}
// a kitchen chair, from the side, for someone h tall whose hips are at x; flip: they face left
const mw_kitChair=(ctx,x,floor,h,flip)=>PK.chair(ctx,x,floor,h,flip,{col:[150,112,82],swivel:false});

/* ---------------------------------------------------------------- the road engineers' office, 1997
   A wall map of the region's roads: the fast roads with two lanes drawn heavier, the lakes and the coast. Where each fatal crash
   happened goes on it as an orange dot (mw_mapDots), and the roads that got a barrier are marked over in green (mw_mapGreen),
   both drawn with the people. A window on the town, a desk with a screen of the time, binders on a shelf. */
const MW_OE=360,mw_hO=fl=>PK.hAt(fl,MW_OE),MW_MAP={x:620,y:150,w:700,h:420};
// the map's roads, in its own 0 to 1 space: [points, kind] (2: a fast road with two lanes; 1: a smaller road; 3: a motorway)
const MW_ROADS=[[[[0.02,0.62],[0.2,0.58],[0.38,0.5],[0.55,0.46],[0.72,0.38],[0.9,0.3],[0.99,0.26]],3],
  [[[0.08,0.15],[0.2,0.3],[0.3,0.44],[0.38,0.5],[0.44,0.66],[0.5,0.82],[0.56,0.98]],2],
  [[[0.55,0.46],[0.6,0.6],[0.7,0.7],[0.84,0.78],[0.98,0.84]],2],
  [[[0.2,0.58],[0.18,0.72],[0.12,0.86],[0.06,0.98]],2],
  [[[0.72,0.38],[0.7,0.24],[0.74,0.1],[0.8,0.02]],2],
  [[[0.3,0.44],[0.42,0.34],[0.55,0.3],[0.62,0.18]],1],[[[0.44,0.66],[0.3,0.72],[0.26,0.86]],1],[[[0.6,0.6],[0.72,0.56],[0.86,0.5]],1],[[[0.84,0.78],[0.8,0.92]],1]];
const mw_mp=(q)=>[MW_MAP.x+30+q[0]*(MW_MAP.w-60),MW_MAP.y+30+q[1]*(MW_MAP.h-60)];
// a point part of the way along a road of the map
const mw_along=(r,u)=>{const P=MW_ROADS[r][0],n=P.length-1,f=PK.u.clamp(u,0,1)*n,i=Math.min(n-1,f|0),k=f-i;return mw_mp([PK.u.lerp(P[i][0],P[i+1][0],k),PK.u.lerp(P[i][1],P[i+1][1],k)]);};
function mw_officePlace(ctx){const S=PK.S,U=PK.u,M=MW_MAP;PK.paint.wall(ctx,[222,224,212],800);
  PK.window(ctx,120,170,360,330,PK.view.campus,{bld:0.2,light:false});
  // the map, pinned in a frame
  S.begin(ctx,{lw:3,far:0.08,sh:5});S.fill(ctx,c=>U.rrect(c,M.x-14,M.y-14,M.w+28,M.h+28,6),[150,124,98],{});S.fill(ctx,c=>U.rrect(c,M.x,M.y,M.w,M.h,2),[244,238,218],{});
  ctx.save();ctx.beginPath();ctx.rect(M.x,M.y,M.w,M.h);ctx.clip();S.begin(ctx,{lw:1.4,sh:2});
  S.poly(ctx,[[M.x+M.w*0.8,M.y-10],[M.x+M.w*0.86,M.y+M.h*0.3],[M.x+M.w*0.93,M.y+M.h*0.55],[M.x+M.w*0.9,M.y+M.h*0.8],[M.x+M.w+20,M.y+M.h+20,1],[M.x+M.w+20,M.y-10,1]],[176,206,218],{flat:true,exact:true});
  for(const [lx,ly,rx,ry] of [[0.16,0.3,46,20],[0.34,0.78,60,24],[0.62,0.12,34,16],[0.48,0.56,26,12]])S.fill(ctx,c=>U.ell(c,M.x+M.w*lx,M.y+M.h*ly,rx,ry),[176,206,218],{w:0.6,flat:true});
  ctx.lineCap="round";ctx.lineJoin="round";for(const [P,kind] of MW_ROADS){ctx.strokeStyle=U.css(kind===1?[170,160,150]:kind===2?[120,96,90]:[96,84,96]);ctx.lineWidth=kind===1?3:kind===2?6:9;
    ctx.beginPath();P.forEach((q,i)=>{const p=mw_mp(q);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.stroke();
    if(kind===3){ctx.strokeStyle=U.css([244,238,218]);ctx.lineWidth=2.5;ctx.stroke();}}
  ctx.fillStyle=U.css([90,80,84]);for(const q of [[0.38,0.5],[0.55,0.46],[0.2,0.58],[0.72,0.38],[0.44,0.66]]){const p=mw_mp(q);ctx.beginPath();ctx.arc(p[0],p[1],6,0,U.TAU);ctx.fill();}
  ctx.restore();
  // binders on a shelf, a cabinet, the desk with its screen
  S.begin(ctx,{lw:3,far:0.1,sh:5});S.fill(ctx,c=>U.rrect(c,1440,330,420,14,3),[176,150,120],{});
  const bc=[[98,112,140],[150,96,92],[110,130,112],[196,176,120],[120,112,140]];for(let i=0;i<9;i++)S.fill(ctx,c=>U.rrect(c,1460+i*42,224,34,106,3),bc[i%5],{w:0.6});
  S.fill(ctx,c=>U.rrect(c,1460,520,170,280,6),[196,198,196],{});for(let i=0;i<3;i++){S.line(ctx,c=>{c.moveTo(1470,600+i*80);c.lineTo(1620,600+i*80);},null,0.6);S.fill(ctx,c=>U.rrect(c,1520,560+i*80,50,10,4),[150,152,150],{w:0.5});}
  S.fill(ctx,c=>U.rrect(c,1660,600,240,22,5),[176,150,120],{});S.fill(ctx,c=>{U.rrect(c,1676,622,18,178,3);U.rrect(c,1868,622,18,178,3);},[150,124,98],{});
  S.fill(ctx,c=>U.rrect(c,1700,470,150,126,10),[214,206,186],{});S.fill(ctx,c=>U.rrect(c,1718,486,114,90,6),[70,84,92],{w:0.6});S.fill(ctx,c=>U.rrect(c,1744,596,62,8,2),[196,188,170],{w:0.6});
  PK.paint.floorAt(ctx,800,[156,160,152],false);PK.paint.skirting(ctx,780);
  S.begin(ctx,{lw:3,far:0.1,sh:5});PK.pot(ctx,560,802,84,74);PK.plant(ctx,560,728,0.9,4,0);}
AG_PLACES.mwOffice=mw_officePlace;
// where each fatal crash happened, as orange dots: most on the fast roads with two lanes; n how many are there (they come in one
// by one); lit (0 to 1): those roads lit in amber under them
const MW_DOTS=(()=>{const R=PK.u.rnd(77),out=[];for(let i=0;i<34;i++){const r=R()<0.82?1+((R()*4)|0):(R()<0.5?0:5+((R()*4)|0));out.push(mw_along(r,0.05+R()*0.9).map(v=>v+(R()-0.5)*8));}return out;})();
function mw_mapDots(ctx,n,lit){const U=PK.u;if(lit>0.004){ctx.save();ctx.globalAlpha*=lit*0.55;ctx.strokeStyle=U.css(PK.C.amber);ctx.lineWidth=16;ctx.lineCap="round";ctx.lineJoin="round";
    for(const [P,kind] of MW_ROADS){if(kind!==2)continue;ctx.beginPath();P.forEach((q,i)=>{const p=mw_mp(q);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.stroke();}ctx.restore();}
  for(let i=0;i<Math.min(n,MW_DOTS.length);i++){const k=U.clamp(n-i,0,1),p=MW_DOTS[i];ctx.fillStyle=U.css(PK.C.orange);ctx.strokeStyle=U.css([120,52,30]);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(p[0],p[1],7*k,0,U.TAU);ctx.fill();ctx.stroke();}}
// the roads with a barrier, marked over in green, each as far as p (0 to 1)
function mw_mapGreen(ctx,ps){const U=PK.u;ctx.save();ctx.strokeStyle=U.css(PK.C.green,0.8);ctx.lineWidth=11;ctx.lineCap="round";ctx.lineJoin="round";
  [1,2,3,4].forEach((r,j)=>{const p=U.clamp(ps[j]||0,0,1);if(p<=0)return;ctx.beginPath();for(let u=0;u<=p+1e-6;u+=0.02){const q=mw_along(r,Math.min(u,p));u?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();});ctx.restore();}

/* ---------------------------------------------------------------- a small town's roundabout, with a crossing in front
   The roundabout, its island grassed with a young tree, where the road through the town meets the street that comes towards us; a
   crossing striped across that street, where people walk. Plain houses, and trees. */
const MW_TX=1000;
function mw_townPlace(ctx){const S=PK.S,U=PK.u;mw_sky(ctx,false);
  S.begin(ctx,{lw:1.5,far:0.6,sh:3});S.fill(ctx,c=>{const R=U.rnd(14);for(let x=-40;x<1980;x+=70+R()*40)U.ell(c,x,MW_E+10,60+R()*30,46+R()*20);c.rect(-40,MW_E+10,2000,40);},U.mix(mw_c("pine3"),PK.col("skyLow"),0.25),{sa:0.1});
  // the houses beyond the road
  const H=[[60,250,[226,214,180],[118,96,92]],[350,230,[214,222,224],[96,90,96]],[640,200,[236,226,206],[128,104,94]],[1350,240,[222,212,196],[110,92,90]],[1640,250,[208,214,200],[96,92,98]]];
  S.begin(ctx,{lw:2,far:0.35,sh:4});for(const [hx,hw,wc,rc] of H){const by=572,hy=by-150;S.fill(ctx,c=>U.rrect(c,hx,hy,hw,150,2),wc,{});S.poly(ctx,[[hx-14,hy+2,1],[hx+hw/2,hy-70,1],[hx+hw+14,hy+2,1]],rc,{exact:true});
    for(let i=0;i<3;i++)for(let j=0;j<2;j++)S.fill(ctx,c=>U.rrect(c,hx+24+i*(hw-48)/2.6,hy+24+j*62,38,40,2),U.mix(mw_c("glass"),wc,0.3),{w:0.5});}
  // the road through the town, the roundabout's ring and island, the street coming towards us, its pavements
  S.begin(ctx,{lw:2.2,far:0.25,sh:4});S.poly(ctx,[[-40,560,1],[1960,560,1],[1960,1100,1],[-40,1100,1]],[198,196,190],{exact:true});
  S.poly(ctx,[[-40,572,1],[1960,572,1],[1960,628,1],[-40,628,1]],mw_c("road"),{exact:true});
  S.fill(ctx,c=>U.ell(c,MW_TX,604,330,52),mw_c("road"),{w:0.6});
  S.poly(ctx,[[MW_TX-150,630,1],[MW_TX+150,630,1],[MW_TX+520,1100,1],[MW_TX-520,1100,1]],mw_c("road"),{exact:true});
  S.fill(ctx,c=>U.ell(c,MW_TX,600,190,28),[214,210,200],{});S.fill(ctx,c=>U.ell(c,MW_TX,596,176,23),mw_c("grass"),{w:0.6});
  S.begin(ctx,{lw:2,far:0.2,sh:3});PK.tree(ctx,MW_TX,600,0.55,6,{});
  // the crossing: stripes across the street, wider as they come nearer
  ctx.fillStyle=U.css(mw_c("line"));const cy0=800,cy1=872;for(let i=0;i<8;i++){const f0=(i+0.15)/8,f1=(i+0.75)/8,at=(y,f)=>{const hw=150+(y-630)/(470)*370;return MW_TX-hw+2*hw*f;};
    ctx.beginPath();ctx.moveTo(at(cy0,f0),cy0);ctx.lineTo(at(cy0,f1),cy0);ctx.lineTo(at(cy1,f1),cy1);ctx.lineTo(at(cy1,f0),cy1);ctx.closePath();ctx.fill();}
  ctx.fillStyle=U.css(mw_c("line"));for(let x=-20;x<1960;x+=140)if(Math.abs(x-MW_TX)>360)ctx.fillRect(x,599,70,3);}
AG_PLACES.mwTown=mw_townPlace;

/* ---------------------------------------------------------------- what people hold (PK.person's hold) */
// a pad of fines and a pen; the slip torn off it, which passes from one hand to the other (a: how far it is there)
const mw_pad=(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u;S.begin(c,{lw:2.2,sh:3});S.fill(c,cc=>U.rrect(cc,h[0]-10*u,h[1]-96*u,74*u,100*u,5*u),[236,234,226],{});
  S.fill(c,cc=>U.rrect(cc,h[0]-10*u,h[1]-96*u,74*u,16*u,4*u),[110,120,150],{w:0.6});S.line(c,cc=>{for(let i=0;i<4;i++){cc.moveTo(h[0]+2*u,h[1]-(62-i*16)*u);cc.lineTo(h[0]+52*u,h[1]-(62-i*16)*u);}},PK.C.mut,0.5);};
const mw_slip=a=>(c,h,deg,J)=>{if(!(a>0.004))return;const S=PK.S,U=PK.u,u=J.u;c.save();c.globalAlpha*=Math.min(1,a);S.begin(c,{lw:2,sh:3});S.fill(c,cc=>U.rrect(cc,h[0]-8*u,h[1]-70*u,60*u,76*u,4*u),[240,238,230],{});
  S.line(c,cc=>{for(let i=0;i<3;i++){cc.moveTo(h[0]+2*u,h[1]-(50-i*16)*u);cc.lineTo(h[0]+40*u,h[1]-(50-i*16)*u);}},PK.C.mut,0.5);c.restore();};
// a sheet of paper in a hand: a page of the year's figures, or the decision
const mw_sheet=(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u;S.begin(c,{lw:2.2,sh:3});S.poly(c,[[h[0]-12*u,h[1]-118*u,1],[h[0]+78*u,h[1]-124*u,1],[h[0]+84*u,h[1]-4*u,1],[h[0]-6*u,h[1]+2*u,1]],[250,248,240],{exact:true});
  S.line(c,cc=>{for(let i=0;i<5;i++){cc.moveTo(h[0]+4*u,h[1]-(100-i*18)*u);cc.lineTo(h[0]+(i===0?48:66)*u,h[1]-(103-i*18)*u);}},PK.C.mut,0.5);};
// a clipboard with a sheet on it
const mw_clip=(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u;S.begin(c,{lw:2.2,sh:3});S.fill(c,cc=>U.rrect(cc,h[0]-20*u,h[1]-130*u,96*u,130*u,6*u),[176,140,104],{});
  S.fill(c,cc=>U.rrect(cc,h[0]-12*u,h[1]-118*u,80*u,110*u,3*u),[250,248,240],{w:0.6});S.fill(c,cc=>U.rrect(cc,h[0]+12*u,h[1]-136*u,32*u,14*u,3*u),[150,152,156],{w:0.6});
  S.line(c,cc=>{for(let i=0;i<4;i++){cc.moveTo(h[0]-2*u,h[1]-(92-i*18)*u);cc.lineTo(h[0]+56*u,h[1]-(92-i*18)*u);}},PK.C.mut,0.5);};
// a measuring tape's case, its tape run out to a point on the ground (to: [x, y], in the frame)
const mw_tape=to=>(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u;c.save();c.strokeStyle=U.css([236,228,200]);c.lineWidth=6*u;c.lineCap="butt";c.beginPath();c.moveTo(h[0]+6*u,h[1]);c.lineTo(to[0],to[1]);c.stroke();c.restore();
  S.begin(c,{lw:2,sh:3});S.fill(c,cc=>U.rrect(cc,h[0]-22*u,h[1]-22*u,44*u,44*u,10*u),[196,92,80],{});S.fill(c,cc=>U.ell(cc,h[0],h[1],9*u,9*u),[90,84,86],{w:0.5});};
// a post of the barrier, carried in both hands
const mw_postHeld=(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u;S.begin(c,{lw:2,sh:3});S.fill(c,cc=>{cc.moveTo(h[0]-150*u,h[1]-12*u);cc.lineTo(h[0]+130*u,h[1]-30*u);cc.lineTo(h[0]+131*u,h[1]-18*u);cc.lineTo(h[0]-149*u,h[1]);cc.closePath();},mw_c("post"),{});};
