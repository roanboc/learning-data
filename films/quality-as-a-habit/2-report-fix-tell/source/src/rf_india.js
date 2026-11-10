/* ===== Report, fix, tell: India, 1974 to 1975 =====
   The opening story's places, painted once in the module's matte look and lit from the right, as the bench is: a village lane at
   midday (rfLane), the same village from above as a plan (rfPlan), the front of a house where a health worker meets the family who
   report a case (rfDoor), and a station platform at dusk (rfPlatform). Nobody is shown ill, and no face shows the disease: on the plan
   it is a dark umber mark passing from house to house, never red, which means a check stops something. The houses a vaccinator has
   reached are ticked in ink; the ones missed stay grey, as the module draws what wasn't checked. The containment ring is brass, the
   requirement: everyone inside it vaccinated. People of 1974 are dressed for their time, drawn with the module's people (the agent
   films' rules: one three-quarter head, arms down, a hand only on the register or the reward). No style or sound is borrowed from
   India's own arts. Every name declared here starts with rf_ or RF_. */

const RF={earth:[196,166,126],earthDk:[168,136,100],mud:[206,172,132],mudDk:[170,134,98],thatch:[176,146,98],thatchDk:[128,102,66],
  wood:[112,80,54],woodDk:[74,52,36],leaf:[104,106,70],leafDk:[70,74,48],leafLt:[150,148,100],sky:[232,226,212],skyLow:[240,230,208],
  umber:[86,58,40],iron:[58,56,58]};

/* ---------------------------------------------------------------- a few strokes that make a surface: straw, plaster, earth */
// thin strokes of straw falling down a roof between x0 and x1, from the line top(x) to bot(x)
function rf_straw(c,x0,x1,top,bot,seed,col,a){const r=ag_rnd(seed);c.save();c.lineCap="round";for(let x=x0;x<x1;x+=3.2){const y0=top(x)+r()*10,y1=bot(x)-r()*14;
  c.strokeStyle=rgba(r()<0.5?ag_dk(col,0.18+r()*0.12):ag_lt(col,0.12+r()*0.14),a*(0.35+r()*0.4));c.lineWidth=1.2+r()*1.6;c.beginPath();c.moveTo(x,y0);c.quadraticCurveTo(x+(r()-0.5)*6,(y0+y1)/2,x+(r()-0.5)*10,y1);c.stroke();}c.restore();}
// soft mottling over a rectangle, for plaster and earth: broad clouds and fine grain, light where it rises and shade where it falls,
// painted at a lower resolution with its own alpha (the kit's dq_field paints opaque), then laid over what is there
function rf_mottle(c,x,y,w,h,seed,k,amt){const nz=dq_noise(seed),ww=Math.max(1,Math.ceil(w/k)),hh=Math.max(1,Math.ceil(h/k)),cv=mkCanvas(ww,hh),cx=cv.getContext("2d"),
    im=cx.createImageData(ww,hh),d=im.data;
  for(let j=0;j<hh;j++){const py=y+(j+0.5)*k;for(let i=0;i<ww;i++){const px=x+(i+0.5)*k,v=(nz(px/180,py/180,3)-0.5)*amt+(nz(px/26,py/26,2)-0.5)*amt*0.5,p=(j*ww+i)*4;
    d[p]=d[p+1]=d[p+2]=v>0?255:40;d[p+3]=Math.min(255,Math.abs(v)*510);}}
  cx.putImageData(im,0,0);c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";c.drawImage(cv,0,0,ww,hh,x,y,w,h);c.restore();}

// an irregular soft blob: an ellipse whose edge wanders (amp), for the crowns of trees; leaves its path for the caller to fill
const RF_NZ=dq_noise(97);
function rf_blobPath(c,cx,cy,rx,ry,seed,amp,n){n=n||44;c.beginPath();for(let i=0;i<n;i++){const a=i/n*TAU,k=1+amp*(RF_NZ(Math.cos(a)*1.6+seed*3.1+40,Math.sin(a)*1.6+seed*1.7+40,3)-0.5)*2,
  x=cx+Math.cos(a)*rx*k,y=cy+Math.sin(a)*ry*k;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();}
// a crown of leaves from masses [x, y, rx, ry]: all of them in shade first, then each one's lit top a little up and to the right (lighter the
// further right and higher it is), then a few small highlights on the sunlit side
function rf_crown(c,M,leaf,seed,o){o=o||{};const R=ag_rnd(seed),cy=M[0][1],sp=o.spread||300,shade=ag_dk(leaf,0.3),lit=ag_lt(leaf,0.3);
  const amp=o.amp||0.22;M.forEach((m,i)=>{rf_blobPath(c,m[0],m[1],m[2],m[3],seed+i*0.37,amp);c.fillStyle=rgba(shade,1);c.fill();});
  M.slice(1).forEach((m,i)=>{const k=clamp(0.5+(m[0]-M[0][0])/(sp*1.6)-(m[1]-cy)/(sp*0.8),0,1);rf_blobPath(c,m[0]+m[2]*0.12,m[1]-m[3]*0.16,m[2]*0.74,m[3]*0.66,seed+i*1.3,amp*1.3);
    c.fillStyle=rgba(mix(leaf,lit,k*0.7),1);c.fill();});
  for(let i=0;i<(o.flecks||14);i++){const a=R()*TAU,r=R();rf_blobPath(c,M[0][0]+Math.cos(a)*sp*0.5*r+sp*0.3,cy-sp*0.16+Math.sin(a)*sp*0.16*r,sp*(0.07+R()*0.05),sp*(0.04+R()*0.03),seed+i*2.1,0.3);
    c.fillStyle=rgba(mix(leaf,lit,0.9),0.45);c.fill();}}

/* ---------------------------------------------------------------- the lane: a village at midday, side on */
// the houses along the back of the lane: x, wall width, wall height, roof ("thatch", "flat" or "tile"), door's x within, door width
const RF_ROW=[[-40,300,210,"flat",150,80],[300,340,236,"thatch",110,86],[690,260,200,"tile",90,78],[990,380,244,"thatch",210,90],[1410,300,214,"flat",70,80]];
const RF_BASE=708;
function rf_house(c,h){const [x,w,ht,roof,dx,dw]=h,b=RF_BASE,top=b-ht;
  // the wall, lit from the right, a little darker at its foot
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(RF.mud,0.08),1));g.addColorStop(1,rgba(ag_lt(RF.mud,0.1),1));c.fillStyle=g;c.fillRect(x,top,w,ht);
  g=c.createLinearGradient(0,b-60,0,b);g.addColorStop(0,"rgba(90,60,36,0)");g.addColorStop(1,"rgba(90,60,36,0.22)");c.fillStyle=g;c.fillRect(x,b-60,w,60);
  // the plinth, a band of plaster smoothed by hand at the foot
  c.fillStyle=rgba(ag_dk(RF.mud,0.16),1);c.fillRect(x-4,b-26,w+8,26);c.fillStyle="rgba(255,240,214,0.25)";c.fillRect(x-4,b-26,w+8,2);
  // the door: a dark opening in a wooden frame, its leaf open against the wall
  const d0=x+dx,dh=Math.min(ht-36,150);c.fillStyle=rgba(RF.woodDk,1);c.fillRect(d0-8,b-26-dh-10,dw+16,dh+10);c.fillStyle="#2a1e16";c.fillRect(d0,b-26-dh,dw,dh);
  g=c.createLinearGradient(d0,0,d0+dw,0);g.addColorStop(0,"rgba(255,220,170,0)");g.addColorStop(1,"rgba(255,220,170,0.1)");c.fillStyle=g;c.fillRect(d0,b-26-dh,dw,dh);
  c.fillStyle=rgba(RF.wood,1);c.beginPath();c.moveTo(d0+dw,b-26-dh);c.lineTo(d0+dw+30,b-26-dh+8);c.lineTo(d0+dw+30,b-30);c.lineTo(d0+dw,b-26);c.closePath();c.fill();
  c.fillStyle="rgba(255,236,200,0.18)";c.fillRect(d0+dw+26,b-26-dh+8,4,dh-12);
  // a small window with wooden bars, away from the door
  const wx=dx>w/2?x+40:x+w-96;if(w>280){c.fillStyle=rgba(RF.woodDk,1);c.fillRect(wx-6,top+70,62,58);c.fillStyle="#2e221a";c.fillRect(wx,top+76,50,46);
    c.fillStyle=rgba(RF.wood,1);for(let k=1;k<4;k++)c.fillRect(wx+k*12.5-2,top+76,4,46);}
  // the roof
  if(roof==="thatch"){const o=34,rt=top-96,ridge=x+w/2;c.fillStyle=rgba(RF.thatch,1);c.beginPath();c.moveTo(x-o,top+18);c.quadraticCurveTo(x+w*0.1,rt+30,ridge,rt);c.quadraticCurveTo(x+w*0.9,rt+30,x+w+o,top+18);
      c.lineTo(x+w+o-6,top+30);c.lineTo(x-o+6,top+30);c.closePath();c.fill();
    const tp=px=>{const u=(px-(x-o))/(w+2*o);return lerp(top+18,rt,1-Math.pow(Math.abs(u-0.5)*2,1.6))+4;};
    rf_straw(c,x-o+4,x+w+o-4,tp,()=>top+30,x*7+3,RF.thatch,1);
    g=c.createLinearGradient(x-o,0,x+w+o,0);g.addColorStop(0,"rgba(60,40,20,0.18)");g.addColorStop(1,"rgba(255,236,190,0.16)");c.fillStyle=g;
    c.beginPath();c.moveTo(x-o,top+18);c.quadraticCurveTo(x+w*0.1,rt+30,ridge,rt);c.quadraticCurveTo(x+w*0.9,rt+30,x+w+o,top+18);c.lineTo(x+w+o-6,top+30);c.lineTo(x-o+6,top+30);c.closePath();c.fill();
    c.fillStyle="rgba(50,30,14,0.3)";c.fillRect(x,top+28,w,10);}
  else if(roof==="tile"){const o=26,rt=top-64;c.fillStyle=rgba([150,108,80],1);c.beginPath();c.moveTo(x-o,top+12);c.lineTo(x+w*0.2,rt);c.lineTo(x+w*0.8,rt);c.lineTo(x+w+o,top+12);c.closePath();c.fill();
    c.save();c.clip();for(let yy=rt+8;yy<top+12;yy+=12){c.fillStyle="rgba(70,40,24,0.28)";c.fillRect(x-o,yy,w+2*o,3);c.fillStyle="rgba(255,226,190,0.18)";c.fillRect(x-o,yy+3,w+2*o,2);}
    g=c.createLinearGradient(x-o,0,x+w+o,0);g.addColorStop(0,"rgba(40,24,14,0.2)");g.addColorStop(1,"rgba(255,236,200,0.14)");c.fillStyle=g;c.fillRect(x-o,rt,w+2*o,top+12-rt);c.restore();
    c.fillStyle="rgba(50,30,14,0.3)";c.fillRect(x,top+12,w,8);}
  else{c.fillStyle=rgba(ag_lt(RF.mud,0.06),1);c.fillRect(x-6,top-22,w+12,26);c.fillStyle="rgba(255,244,222,0.35)";c.fillRect(x-6,top-22,w+12,3);c.fillStyle="rgba(80,54,32,0.22)";c.fillRect(x-6,top+2,w+12,5);}
}
// a broad shade tree: a short trunk flaring at its roots, three limbs, and a wide crown of soft masses, lit from the right; s 1 is about
// 700 px tall and 860 wide, (x, y) the foot of the trunk
function rf_tree(c,x,y,s,seed){seed=seed||17;const R=ag_rnd(seed),bark=[96,78,62];c.save();c.translate(x,y);c.scale(s,s);
  ag_floorShadow(c,-120,10,380,46,0.32);
  c.fillStyle=rgba(bark,1);c.beginPath();c.moveTo(-62,6);c.quadraticCurveTo(-30,-6,-30,-70);c.lineTo(30,-70);c.quadraticCurveTo(32,-6,66,6);c.closePath();c.fill();
  ag_taper(c,[0,0],[4,-100],[-6,-190],[-10,-270],70,44,rgba(bark,1));
  ag_taper(c,[-8,-250],[-50,-310],[-120,-350],[-200,-390],34,12,rgba(bark,1));ag_taper(c,[-6,-258],[30,-330],[90,-370],[180,-410],32,12,rgba(bark,1));
  ag_taper(c,[-10,-260],[-10,-340],[0,-410],[-20,-470],26,10,rgba(bark,1));
  ag_taper(c,[14,-4],[16,-100],[6,-190],[2,-262],18,8,"rgba(255,236,206,0.16)");
  const cy=-500,M=[[0,cy+20,330,140]];for(let i=0;i<11;i++){const a=Math.PI*(1.04+0.92*i/10),rx=300,ry=150;M.push([Math.cos(a)*rx+(R()-0.5)*30,cy+Math.sin(a)*ry+40+(R()-0.5)*20,90+R()*40,70+R()*24]);}
  for(let i=0;i<7;i++){const a=R()*TAU,r=Math.sqrt(R())*0.6;M.push([Math.cos(a)*250*r,cy+30+Math.sin(a)*90*r,90+R()*50,60+R()*30]);}
  rf_crown(c,M,RF.leaf,seed,{spread:330,flecks:16,amp:0.12});
  c.restore();}
// the village well: a round parapet of plastered brick, two posts and a beam with a pulley, a rope and a bucket
function rf_well(c,x,y){ag_floorShadow(c,x-40,y+64,170,30,0.3);
  let g=c.createLinearGradient(x-120,0,x+120,0);g.addColorStop(0,rgba(ag_dk(RF.mud,0.16),1));g.addColorStop(0.7,rgba(ag_lt(RF.mud,0.12),1));g.addColorStop(1,rgba(RF.mud,1));
  c.fillStyle=g;c.beginPath();c.moveTo(x-120,y-60);c.lineTo(x-120,y+40);c.ellipse(x,y+40,120,26,0,Math.PI,0,true);c.lineTo(x+120,y-60);c.closePath();c.fill();
  c.fillStyle=rgba(ag_lt(RF.mud,0.2),1);c.beginPath();c.ellipse(x,y-60,124,28,0,0,TAU);c.fill();c.fillStyle="#2a1e16";c.beginPath();c.ellipse(x,y-60,100,20,0,0,TAU);c.fill();
  for(const px of [x-100,x+100]){c.fillStyle=rgba(RF.wood,1);c.fillRect(px-7,y-250,14,196);c.fillStyle="rgba(255,236,200,0.2)";c.fillRect(px+3,y-250,3,196);}
  c.fillStyle=rgba(RF.woodDk,1);c.fillRect(x-118,y-262,236,16);c.fillStyle=rgba(RF.iron,1);c.beginPath();c.arc(x,y-238,16,0,TAU);c.fill();
  c.strokeStyle="rgba(70,56,40,0.8)";c.lineWidth=2;c.beginPath();c.moveTo(x+14,y-236);c.lineTo(x+14,y-128);c.stroke();
  c.fillStyle=rgba([84,80,76],1);c.beginPath();c.moveTo(x-6,y-130);c.lineTo(x+34,y-130);c.lineTo(x+30,y-92);c.lineTo(x-2,y-92);c.closePath();c.fill();}
// a bicycle leaning on a wall, side on: two wheels with spokes, a black frame, its saddle and handlebar; (x, y) the rear wheel's foot
function rf_bicycle(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);ag_floorShadow(c,110,0,170,12,0.3);const r=62,rx=0,fx=214,cy=-r,ink="rgb(44,40,40)";
  for(const wx of [rx,fx]){c.strokeStyle=ink;c.lineWidth=7;c.beginPath();c.arc(wx,cy,r,0,TAU);c.stroke();c.strokeStyle="rgba(44,40,40,0.5)";c.lineWidth=1.4;
    for(let k=0;k<12;k++){const a=k/12*TAU;c.beginPath();c.moveTo(wx,cy);c.lineTo(wx+Math.cos(a)*r,cy+Math.sin(a)*r);c.stroke();}c.fillStyle=ink;c.beginPath();c.arc(wx,cy,6,0,TAU);c.fill();}
  const bb=[96,cy],seat=[74,cy-110],head=[188,cy-104];c.strokeStyle=ink;c.lineWidth=8;c.lineCap="round";c.lineJoin="round";c.beginPath();
  c.moveTo(rx,cy);c.lineTo(bb[0],bb[1]);c.lineTo(head[0],head[1]);c.lineTo(seat[0]+6,seat[1]+12);c.lineTo(rx,cy);c.moveTo(seat[0]+6,seat[1]+12);c.lineTo(bb[0],bb[1]);
  c.moveTo(head[0],head[1]);c.lineTo(fx,cy);c.moveTo(head[0],head[1]);c.lineTo(head[0]-8,head[1]-26);c.lineTo(head[0]-34,head[1]-30);c.stroke();
  c.fillStyle=rgba([70,52,40],1);c.beginPath();c.ellipse(seat[0],seat[1],24,8,0,0,TAU);c.fill();
  c.strokeStyle="rgba(255,236,200,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(bb[0]+2,bb[1]-4);c.lineTo(head[0]+2,head[1]-4);c.stroke();c.restore();}
// round clay pots by a door
function rf_pots(c,x,y,n){for(let i=0;i<n;i++){const px=x+i*52,py=y-(i%2)*4,r=26-i*3;ag_floorShadow(c,px-8,py+r*0.9,r*1.3,8,0.3);
  const g=c.createRadialGradient(px+r*0.4,py-r*0.4,2,px,py,r);g.addColorStop(0,"#b98a62");g.addColorStop(1,"#7a5236");c.fillStyle=g;c.beginPath();c.arc(px,py,r,0,TAU);c.fill();
  c.fillStyle="#6a4630";c.fillRect(px-r*0.42,py-r-8,r*0.84,10);}}
function rf_paintLane(c){const b=RF_BASE;
  // the sky: a pale midday haze, warmer low down, the sun high on the right
  let g=c.createLinearGradient(0,0,0,b);g.addColorStop(0,"rgb(222,220,210)");g.addColorStop(0.7,"rgb(238,230,210)");g.addColorStop(1,"rgb(240,228,204)");c.fillStyle=g;c.fillRect(0,0,W,b);
  dq_pool(c,1760,40,700,[255,246,226],0.35);
  // far trees, pale with distance
  rf_treeLine(c,b-150,150,40,[214,210,190],5,1);rf_treeLine(c,b-150,90,30,[196,194,168],7,1);c.fillStyle="rgb(206,200,176)";c.fillRect(0,b-150,W,150);
  for(const h of RF_ROW)rf_house(c,h);
  // the lane: packed earth, lit from the right, with soft ruts and the odd stone
  g=c.createLinearGradient(0,b,0,H);g.addColorStop(0,rgba(ag_lt(RF.earth,0.06),1));g.addColorStop(1,rgba(ag_dk(RF.earth,0.08),1));c.fillStyle=g;c.fillRect(0,b,W,H-b);
  for(const h of RF_ROW){const [x,w]=h;c.fillStyle="rgba(70,46,26,0.2)";c.beginPath();c.moveTo(x-30,b);c.lineTo(x+w-40,b);c.lineTo(x+w-80,b+34);c.lineTo(x-70,b+34);c.closePath();c.fill();}
  for(const [y,a] of [[812,0.05],[884,0.04],[968,0.05]]){g=c.createLinearGradient(0,y-10,0,y+14);g.addColorStop(0,"rgba(80,54,30,0)");g.addColorStop(0.5,"rgba(80,54,30,"+a+")");g.addColorStop(1,"rgba(80,54,30,0)");c.fillStyle=g;c.fillRect(0,y-10,W,24);}
  rf_mottle(c,0,b,W,H-b,41,3,0.07);
  dq_specks(c,0,b+20,W,H-b-20,{seed:43,density:0.0012,a:0.5,kinds:[[0.6,[120,92,64],1.2,3],[0.4,[232,214,184],1,2.4]]});
  rf_mottle(c,0,0,W,b,47,4,0.05);
  rf_pots(c,520,b-6,3);rf_bicycle(c,700,b+2,0.9);
  rf_well(c,300,836);
  rf_tree(c,1730,880,0.92,17);
  // the window's warmth from the right, as on the bench
  g=c.createLinearGradient(W,0,W*0.4,0);g.addColorStop(0,"rgba(255,240,210,0.12)");g.addColorStop(1,"rgba(255,240,210,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.rfLane=c=>rf_paintLane(c);
AG_PLACES.rfLaneDusk=c=>{rf_paintLane(c);const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(60,48,70,0.42)");g.addColorStop(0.6,"rgba(120,70,50,0.3)");g.addColorStop(1,"rgba(40,26,20,0.45)");c.fillStyle=g;c.fillRect(0,0,W,H);
  dq_pool(c,1820,560,620,[255,190,120],0.18);};

/* ---------------------------------------------------------------- the plan: the same village, from above
   Houses as small blocks with their roofs (thatch, plaster, tile), along two lanes that cross by the well, trees as round canopies, and
   fields at the edges. RF_HOUSES holds each house [x, y, w, h, roof]; the film's chain, ticks, guards and ring are drawn live over them. */
const RF_HOUSES=[[300,250,120,90,"t"],[470,210,100,110,"f"],[620,250,130,86,"t"],[800,220,110,100,"r"],[960,236,124,92,"t"],[1150,210,110,112,"f"],[1310,250,130,88,"t"],[1490,220,116,100,"r"],
  [330,610,126,92,"f"],[500,640,110,96,"t"],[660,600,120,104,"r"],[840,640,116,90,"t"],[1000,610,130,100,"f"],[1180,640,112,92,"t"],[1340,604,124,104,"r"],[1520,640,110,92,"t"],
  [420,820,120,90,"t"],[620,840,110,86,"f"],[1120,830,120,88,"t"],[1330,820,112,96,"f"]];
const rf_houseC=i=>{const h=RF_HOUSES[i];return[h[0]+h[2]/2,h[1]+h[3]/2];};
function rf_paintPlan(c){
  let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,"rgb(196,170,128)");g.addColorStop(1,"rgb(206,180,138)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // fields at the edges, in strips, and the lanes: one along the village, one across it past the well
  const r=ag_rnd(9);for(let i=0;i<14;i++){c.fillStyle=rgba(i%2?[178,170,120]:[190,178,128],0.55);c.fillRect(i*140,0,140,120);c.fillRect(i*140+40,980,140,100);}
  c.fillStyle="rgb(222,200,160)";c.fillRect(0,420,W,120);c.fillRect(880,0,110,H);
  rf_mottle(c,0,0,W,H,61,4,0.12);
  c.fillStyle="rgba(255,244,222,0.25)";c.fillRect(0,420,W,3);c.fillRect(880,0,3,H);
  // the well, where the lanes cross
  c.fillStyle="rgba(70,46,26,0.25)";c.beginPath();c.arc(930,484,40,0,TAU);c.fill();c.fillStyle="rgb(214,190,150)";c.beginPath();c.arc(936,480,36,0,TAU);c.fill();c.fillStyle="#3a2a1e";c.beginPath();c.arc(936,480,22,0,TAU);c.fill();
  // trees, with their shadows
  [[200,470,70],[1700,480,90],[760,980,60],[1600,860,70],[120,880,80],[1760,160,70]].forEach(([x,y,rad],k)=>{const R=ag_rnd(130+k),M=[[x,y,rad,rad]];
    for(let i=0;i<7;i++){const a=R()*TAU,r=R()*0.55;M.push([x+Math.cos(a)*rad*r,y+Math.sin(a)*rad*r,rad*(0.4+R()*0.2),rad*(0.4+R()*0.2)]);}
    c.fillStyle="rgba(60,40,20,0.25)";rf_blobPath(c,x-18,y+16,rad*1.02,rad*1.02,k+3,0.2);c.fill();rf_crown(c,M,RF.leaf,140+k,{spread:rad*1.4,flecks:6});});
  // the houses, roofs seen from above, each casting its shadow down and to the left
  for(const [x,y,w,h,k] of RF_HOUSES){c.fillStyle="rgba(60,40,20,0.3)";c.fillRect(x-12,y+10,w,h);
    const base=k==="t"?RF.thatch:k==="r"?[150,108,80]:ag_lt(RF.mud,0.12);g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(ag_dk(base,0.1),1));g.addColorStop(1,rgba(ag_lt(base,0.12),1));c.fillStyle=g;c.fillRect(x,y,w,h);
    if(k==="t"){rf_straw(c,x+2,x+w-2,()=>y+2,()=>y+h-2,x+y,RF.thatch,0.7);c.fillStyle="rgba(60,40,20,0.16)";c.fillRect(x,y,w/2,h);c.fillStyle="rgba(255,240,206,0.14)";c.fillRect(x+w/2,y,w/2,h);
      c.fillStyle="rgba(80,56,30,0.4)";c.fillRect(x+w/2-2,y,4,h);}
    else if(k==="r"){for(let yy=y+6;yy<y+h;yy+=10){c.fillStyle="rgba(70,40,24,0.3)";c.fillRect(x,yy,w,2.5);}c.fillStyle="rgba(255,230,200,0.2)";c.fillRect(x+w/2-1,y,3,h);}
    else{c.strokeStyle="rgba(120,90,60,0.4)";c.lineWidth=4;c.strokeRect(x+5,y+5,w-10,h-10);}}}
AG_PLACES.rfPlan=c=>rf_paintPlan(c);
// on the plan, live: a house's tick (ink: a vaccinator has been), a house left grey (missed), and the chain, a dark umber mark that
// passes from house to house along a path of house indices; at u it has reached part of the way along
function rf_tick(c,i,a,col){if(a<=0.01)return;const [x,y]=rf_houseC(i);c.save();c.globalAlpha*=a;c.fillStyle="rgba(250,246,236,0.92)";c.beginPath();c.arc(x,y,24,0,TAU);c.fill();
  dq_icon(c,"tick",x,y,30,col||DQ.ink);c.restore();}
function rf_grey(c,i,a){if(a<=0.01)return;const h=RF_HOUSES[i];c.save();c.globalAlpha*=a*0.55;c.fillStyle=rgba(DQ.none,1);c.fillRect(h[0],h[1],h[2],h[3]);c.restore();
  c.save();c.globalAlpha*=a;c.setLineDash([8,7]);c.strokeStyle=rgba(DQ_TONE.none.word,0.9);c.lineWidth=3;c.strokeRect(h[0]+3,h[1]+3,h[2]-6,h[3]-6);c.restore();}
function rf_chain(c,path,u,a,t){if(a<=0.01||u<=0)return;c.save();c.globalAlpha*=a;const n=path.length-1,k=Math.min(n,u*n);
  c.strokeStyle=rgba(RF.umber,0.55);c.lineWidth=7;c.lineCap="round";c.setLineDash([2,14]);c.beginPath();
  for(let i=0;i<=Math.floor(k);i++){const [x,y]=rf_houseC(path[i]);i?c.lineTo(x,y):c.moveTo(x,y);}
  if(k<n){const f=k-Math.floor(k),[x0,y0]=rf_houseC(path[Math.floor(k)]),[x1,y1]=rf_houseC(path[Math.floor(k)+1]);c.lineTo(lerp(x0,x1,f),lerp(y0,y1,f));}c.stroke();c.setLineDash([]);
  for(let i=0;i<=Math.floor(k);i++){const [x,y]=rf_houseC(path[i]),p=0.85+0.15*Math.sin((t||0)*3+i);c.fillStyle=rgba(RF.umber,0.82*p);c.beginPath();c.arc(x,y,17,0,TAU);c.fill();}
  c.restore();}
// the containment ring round a house: a brass circle that draws itself (u), and the guards at the door: two by day under a small sun,
// then two by night under a crescent moon
function rf_ring(c,x,y,rad,u,a){if(a<=0.01||u<=0)return;c.save();c.globalAlpha*=a;c.strokeStyle=rgba(DQ.brass,0.95);c.lineWidth=7;c.lineCap="round";
  c.beginPath();c.arc(x,y,rad,-Math.PI/2,-Math.PI/2+TAU*clamp(u,0,1));c.stroke();c.strokeStyle=rgba(DQ.brass,0.25);c.lineWidth=20;c.stroke();c.restore();}
function rf_sun(c,x,y,r,a){if(a<=0.01)return;c.save();c.globalAlpha*=a;c.fillStyle=rgba(DQ.ink,0.9);c.beginPath();c.arc(x,y,r*0.45,0,TAU);c.fill();c.strokeStyle=rgba(DQ.ink,0.9);c.lineWidth=r*0.12;c.lineCap="round";
  for(let i=0;i<8;i++){const an=i/8*TAU;c.beginPath();c.moveTo(x+Math.cos(an)*r*0.66,y+Math.sin(an)*r*0.66);c.lineTo(x+Math.cos(an)*r*0.95,y+Math.sin(an)*r*0.95);c.stroke();}c.restore();}
function rf_moon(c,x,y,r,a){if(a<=0.01)return;c.save();c.globalAlpha*=a;c.fillStyle=rgba(DQ.ink,0.9);c.beginPath();c.arc(x,y,r*0.7,0,TAU);c.arc(x+r*0.34,y-r*0.2,r*0.6,0,TAU,true);c.fill("evenodd");c.restore();}
// a guard on the plan: the module's person icon on a cream disc
function rf_guard(c,x,y,a){if(a<=0.01)return;c.save();c.globalAlpha*=a;c.fillStyle="rgba(250,246,236,0.95)";c.beginPath();c.arc(x,y,24,0,TAU);c.fill();dq_icon(c,"person",x,y,32,DQ.ink);c.restore();}

/* ---------------------------------------------------------------- a house's front: where a report is made
   The wall of a house in the lane, close: mud plaster lit from the right, a wooden door frame with the doorway dark behind it, and a
   plinth along the bottom. The health worker stands on the left, the woman who reports at her own door on the right. */
const RF_DOOR={x:1210,w:330,top:150};
function rf_paintDoor(c){
  // the wall fills the frame
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(ag_dk(RF.mud,0.1),1));g.addColorStop(0.75,rgba(ag_lt(RF.mud,0.06),1));g.addColorStop(1,rgba(ag_lt(RF.mud,0.14),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  rf_mottle(c,0,0,W,930,71,4,0.06);
  const r=ag_rnd(73);c.save();c.lineCap="round";for(let i=0;i<46;i++){const x=r()*W,y=r()*900,l=120+r()*220,up=r()<0.5?1:-1;c.strokeStyle=rgba(up>0?[255,242,218]:[120,90,60],0.03+r()*0.025);
    c.lineWidth=26+r()*30;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+l/2,y-up*(18+r()*16),x+l,y);c.stroke();}c.restore();
  g=c.createLinearGradient(0,720,0,930);g.addColorStop(0,"rgba(110,78,48,0)");g.addColorStop(1,"rgba(110,78,48,0.2)");c.fillStyle=g;c.fillRect(0,720,W,210);
  dq_specks(c,0,0,W,930,{seed:75,density:0.0012,a:0.3,kinds:[[0.6,[150,116,84],1,2.2],[0.4,[246,232,206],1,2]]});
  // the plinth
  c.fillStyle=rgba(ag_dk(RF.mud,0.2),1);c.fillRect(0,930,W,150);c.fillStyle="rgba(255,240,214,0.25)";c.fillRect(0,930,W,3);
  // the doorway: its frame of dark wood, a lintel, and the room behind, dim, a little light on its floor
  const D=RF_DOOR;c.fillStyle="#22180f";c.fillRect(D.x,D.top,D.w,930-D.top);
  g=c.createLinearGradient(0,D.top,0,930);g.addColorStop(0,"rgba(120,90,60,0.05)");g.addColorStop(1,"rgba(150,110,70,0.2)");c.fillStyle=g;c.fillRect(D.x,D.top,D.w,930-D.top);
  for(const [x,w] of [[D.x-46,46],[D.x+D.w,46]]){g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(RF.woodDk,1));g.addColorStop(1,rgba(RF.wood,1));c.fillStyle=g;c.fillRect(x,D.top-40,w,930-D.top+40);
    c.fillStyle="rgba(255,230,190,0.16)";c.fillRect(x+w-6,D.top-40,4,930-D.top+40);}
  g=c.createLinearGradient(0,D.top-86,0,D.top-30);g.addColorStop(0,rgba(RF.wood,1));g.addColorStop(1,rgba(RF.woodDk,1));c.fillStyle=g;c.fillRect(D.x-70,D.top-86,D.w+140,56);
  c.fillStyle="rgba(255,230,190,0.2)";c.fillRect(D.x-70,D.top-86,D.w+140,3);
  c.fillStyle="rgba(60,36,20,0.3)";c.fillRect(D.x-70,D.top-30,D.w+140,8);
  // the door's leaf, open against the inside wall
  c.fillStyle=rgba(ag_dk(RF.wood,0.2),1);c.beginPath();c.moveTo(D.x+D.w-8,D.top+6);c.lineTo(D.x+D.w-110,D.top+30);c.lineTo(D.x+D.w-110,906);c.lineTo(D.x+D.w-8,926);c.closePath();c.fill();
  c.fillStyle="rgba(255,226,180,0.08)";c.fillRect(D.x+D.w-110,D.top+30,6,876-D.top);
  // a step in front of the door
  c.fillStyle=rgba(ag_dk(RF.mud,0.28),1);c.fillRect(D.x-90,930,D.w+180,30);c.fillStyle="rgba(255,240,214,0.3)";c.fillRect(D.x-90,930,D.w+180,3);
  // a niche in the wall, arched: its inside in shade, lit on its left side by the sun from the right, a sill, and a small clay lamp in it,
  // unlit at midday
  const nx=900,nb=420,nw=120,nh=150;const niche=()=>{c.beginPath();c.moveTo(nx-nw/2,nb);c.lineTo(nx-nw/2,nb-nh+nw/2);c.arc(nx,nb-nh+nw/2,nw/2,Math.PI,0);c.lineTo(nx+nw/2,nb);c.closePath();};
  niche();g=c.createLinearGradient(nx-nw/2,0,nx+nw/2,0);g.addColorStop(0,"rgb(150,112,78)");g.addColorStop(0.35,"rgb(112,80,54)");g.addColorStop(1,"rgb(84,58,40)");c.fillStyle=g;c.fill();
  c.save();niche();c.clip();g=c.createLinearGradient(0,nb-nh,0,nb);g.addColorStop(0,"rgba(40,26,16,0.45)");g.addColorStop(0.5,"rgba(40,26,16,0)");c.fillStyle=g;c.fillRect(nx-nw/2,nb-nh,nw,nh);c.restore();
  c.strokeStyle="rgba(255,240,214,0.35)";c.lineWidth=3;c.beginPath();c.moveTo(nx+nw/2+2,nb);c.lineTo(nx+nw/2+2,nb-nh+nw/2);c.arc(nx,nb-nh+nw/2,nw/2+2,0,-Math.PI*0.5,true);c.stroke();
  c.fillStyle=rgba(ag_lt(RF.mud,0.08),1);c.fillRect(nx-nw/2-10,nb,nw+20,12);c.fillStyle="rgba(70,48,30,0.3)";c.fillRect(nx-nw/2-10,nb+12,nw+20,5);
  const lg=c.createRadialGradient(nx+8,nb-14,2,nx,nb-8,26);lg.addColorStop(0,"#a87a54");lg.addColorStop(1,"#6e4a32");c.fillStyle=lg;c.beginPath();c.moveTo(nx-26,nb-14);
  c.quadraticCurveTo(nx,nb+4,nx+26,nb-14);c.quadraticCurveTo(nx+34,nb-18,nx+40,nb-20);c.quadraticCurveTo(nx+30,nb-10,nx+24,nb-8);c.quadraticCurveTo(nx,nb+2,nx-24,nb-8);c.closePath();c.fill();
  c.fillStyle="rgba(40,26,16,0.5)";c.beginPath();c.ellipse(nx,nb-14,26,5,0,0,TAU);c.fill();}
AG_PLACES.rfDoor=c=>rf_paintDoor(c);
AG_PLACES.rfDoorDusk=c=>{rf_paintDoor(c);const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(56,44,66,0.4)");g.addColorStop(1,"rgba(50,30,20,0.42)");c.fillStyle=g;c.fillRect(0,0,W,H);
  dq_pool(c,1800,300,700,[255,190,120],0.14);};
// the reward's poster, pasted on a wall, a little askew: paper, worn at its foot, a house, the amount in large numerals (drawn live, so they
// are measured), and a few lines of print drawn as rules (no words in any script but the film's)
function rf_poster(c,x,y,w,amount,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*1.3,s=w/300;c.save();c.globalAlpha*=a;c.translate(x+w/2,y+h/2);c.rotate(o.angle==null?-0.02:o.angle);c.translate(-w/2,-h/2);
  dq_shadow(c,"wall",0.7);c.fillStyle="rgb(240,232,212)";c.fillRect(0,0,w,h);c.shadowColor="transparent";
  const g=c.createLinearGradient(0,h*0.7,0,h);g.addColorStop(0,"rgba(150,120,80,0)");g.addColorStop(1,"rgba(150,120,80,0.16)");c.fillStyle=g;c.fillRect(0,h*0.7,w,h*0.3);
  c.strokeStyle="rgba(120,96,64,0.4)";c.lineWidth=2*s;c.strokeRect(12*s,12*s,w-24*s,h-24*s);
  const hx=w/2,hy=h*0.3;c.fillStyle=rgba(DQ.ink,0.86);c.beginPath();c.moveTo(hx-62*s,hy);c.lineTo(hx,hy-54*s);c.lineTo(hx+62*s,hy);c.closePath();c.fill();c.fillRect(hx-48*s,hy,96*s,62*s);
  c.fillStyle="rgb(240,232,212)";c.fillRect(hx-12*s,hy+22*s,24*s,40*s);
  c.fillStyle=rgba(DQ.ink,0.3);for(const [yy,ww] of [[0.52,0.62],[0.57,0.48]])c.fillRect(hx-w*ww/2,h*yy,w*ww,5*s);
  dq_T(c,amount,w/2,h*0.8,{w:800,size:Math.round(64*s),align:"center",col:DQ.ink});c.restore();}

/* ---------------------------------------------------------------- the station platform, at dusk
   Assam, May 1975: an iron canopy on its columns, a bench, a lamp just lit, the platform's edge, and the track below. Nobody is on it:
   the last case was found here, and the film doesn't show her. */
function rf_paintPlatform(c){
  let g=c.createLinearGradient(0,0,0,700);g.addColorStop(0,"rgb(126,118,134)");g.addColorStop(0.55,"rgb(196,160,140)");g.addColorStop(1,"rgb(232,190,150)");c.fillStyle=g;c.fillRect(0,0,W,760);
  dq_pool(c,1500,640,700,[255,206,150],0.3);
  // trees beyond the line, dark against the sky
  rf_treeLine(c,610,120,40,[112,98,104],81);rf_treeLine(c,640,60,24,[74,66,68],83,1);c.fillStyle="rgb(74,66,66)";c.fillRect(0,630,W,70);
  // the platform: its surface, lit low from the right, and its edge
  g=c.createLinearGradient(0,690,0,860);g.addColorStop(0,"rgb(150,136,124)");g.addColorStop(1,"rgb(118,106,98)");c.fillStyle=g;c.fillRect(0,690,W,170);
  rf_mottle(c,0,690,W,170,83,3,0.14);
  c.fillStyle="rgb(196,184,168)";c.fillRect(0,850,W,14);c.fillStyle="rgb(70,62,58)";c.fillRect(0,864,W,60);
  // the track: ballast, sleepers and two rails
  g=c.createLinearGradient(0,924,0,H);g.addColorStop(0,"rgb(66,60,58)");g.addColorStop(1,"rgb(46,42,42)");c.fillStyle=g;c.fillRect(0,924,W,H-924);
  dq_specks(c,0,924,W,H-924,{seed:85,density:0.01,a:0.5,kinds:[[0.6,[110,100,94],1,3],[0.4,[30,28,28],1,3]]});
  for(let x=-20;x<W;x+=120){c.fillStyle="rgb(58,46,38)";c.fillRect(x,976,70,90);}
  for(const y of [990,1050]){c.fillStyle="rgb(120,116,114)";c.fillRect(0,y,W,8);c.fillStyle="rgba(255,220,180,0.4)";c.fillRect(0,y,W,2);}
  // the canopy: a deep iron fascia with a valance of boards along its edge, and its columns down to the platform
  c.fillStyle="rgb(56,52,54)";c.fillRect(0,0,W,120);g=c.createLinearGradient(0,120,0,200);g.addColorStop(0,"rgb(80,74,72)");g.addColorStop(1,"rgb(62,58,58)");c.fillStyle=g;c.fillRect(0,120,W,80);
  for(let x=0;x<W;x+=26){c.fillStyle="rgb(70,64,62)";c.beginPath();c.moveTo(x,200);c.lineTo(x+26,200);c.lineTo(x+13,226);c.closePath();c.fill();}
  for(const x of [180,760,1340,1880]){g=c.createLinearGradient(x-14,0,x+14,0);g.addColorStop(0,"rgb(44,42,44)");g.addColorStop(1,"rgb(90,84,84)");c.fillStyle=g;c.fillRect(x-14,200,28,520);
    c.fillStyle="rgb(50,48,50)";c.fillRect(x-24,704,48,20);c.beginPath();c.moveTo(x-14,200);c.lineTo(x-64,200);c.lineTo(x-14,262);c.closePath();c.fill();c.beginPath();c.moveTo(x+14,200);c.lineTo(x+64,200);c.lineTo(x+14,262);c.closePath();c.fill();
    ag_floorShadow(c,x-30,724,90,12,0.35);}
  // a bench, empty, between two columns
  c.fillStyle="rgb(50,40,32)";for(const x of [962,1206])c.fillRect(x,540,12,174);
  for(const [y,hh] of [[548,14],[574,14],[604,18]]){c.fillStyle="rgb(92,68,48)";c.fillRect(936,y,308,hh);c.fillStyle="rgba(255,214,170,0.22)";c.fillRect(936,y,308,2);}
  ag_floorShadow(c,1070,716,190,14,0.35);
  // a lamp just lit on its bracket
  c.fillStyle="rgb(44,42,44)";c.fillRect(1324,300,60,8);glow(c,1394,330,90,[255,214,160],0.55);c.fillStyle="rgb(255,226,180)";c.beginPath();c.arc(1394,330,14,0,TAU);c.fill();
  g=c.createLinearGradient(W,0,W*0.4,0);g.addColorStop(0,"rgba(255,200,150,0.1)");g.addColorStop(1,"rgba(255,200,150,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.rfPlatform=c=>rf_paintPlatform(c);
// a line of trees beyond the track, one colour, its top uneven
function rf_treeLine(c,y,top,amp,col,seed,crowns){const nz=dq_noise(seed),R=ag_rnd(seed);c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,y);
  if(crowns){let x=-30;while(x<W+60){const r=26+R()*34,h=top+amp*(nz(x/220,0.5,2)-0.5)*2;c.lineTo(x,y-h+r*0.5);c.arc(x+r,y-h+r*0.5,r,Math.PI,0);x+=r*1.6;}}
  else for(let x=0;x<=W;x+=8)c.lineTo(x,y-top-amp*(nz(x/150,0.5,3)-0.5)*2-amp*0.5*(nz(x/36,3.3,2)-0.5));c.lineTo(W,y);c.closePath();c.fill();}

/* ---------------------------------------------------------------- the people of 1974
   A health worker of the search, in a plain shirt, a cloth bag on a strap across him, holding his register (the cards held drawn in
   figure space by the film); and the woman at her door who reports, in a cotton sari, its end over her far shoulder. Their clothes wear
   none of the module's six colours. */
function rf_strap(c,P){c.save();ag_shape(c,AG_F.torso);c.clip();c.lineCap="round";c.strokeStyle="rgb(118,100,74)";c.lineWidth=22;c.beginPath();c.moveTo(392,612);c.bezierCurveTo(330,760,240,920,150,1080);c.stroke();
  c.strokeStyle="rgba(255,240,210,0.25)";c.lineWidth=4;c.beginPath();c.moveTo(400,616);c.bezierCurveTo(338,764,248,924,158,1084);c.stroke();c.restore();}
function rf_pallu(col,edge){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  ag_soft(c,cc=>{cc.moveTo(120,1100);cc.bezierCurveTo(200,960,300,760,372,604);cc.lineTo(436,640);cc.bezierCurveTo(400,800,330,960,268,1100);cc.closePath();},col,ag_lt(col,0.3),380,700,220,rgba(ag_dk(col,0.6),0.4),12);
  c.strokeStyle=rgba(edge,0.9);c.lineWidth=12;c.beginPath();c.moveTo(130,1100);c.bezierCurveTo(208,962,306,764,376,608);c.stroke();
  c.strokeStyle=rgba(ag_dk(col,0.35),0.5);c.lineWidth=3;for(const k of [0.35,0.62]){c.beginPath();c.moveTo(lerp(120,268,k),1100);c.bezierCurveTo(lerp(200,330,k),lerp(960,960,k),lerp(300,400,k),lerp(760,800,k),lerp(372,436,k),lerp(604,640,k));c.stroke();}
  c.restore();};}
const RF_PEOPLE={
  worker:{key:"rf_worker",name:"A health worker",skin:[150,104,80],hair:{style:"side",c:[26,22,22]},top:{kind:"shirt",c:[230,226,212],paint:rf_strap},breath:0.27},
  mother:{key:"rf_mother",name:"A woman at her door",skin:[166,116,88],hair:{style:"bun",c:[24,20,22]},top:{kind:"tunic",c:[96,70,96],paint:rf_pallu([112,82,108],[214,196,160])},breath:0.3}
};
// the register the health worker carries, open in his hand, and the reward's note
function rf_register(c,hands,o){o=o||{};const [hx,hy]=hands.near,x=hx+30,y=hy-20,w=230,h=150;
  ag_soft(c,cc=>{cc.moveTo(x-w/2,y);cc.lineTo(x+w/2,y);cc.lineTo(x+w/2-8,y-h);cc.lineTo(x-w/2+8,y-h);cc.closePath();},[104,66,52],[148,104,82],x+60,y-h,200,"rgba(30,20,10,0.4)",8);
  ag_soft(c,cc=>{cc.moveTo(x-w/2+10,y-10);cc.lineTo(x+w/2-10,y-10);cc.lineTo(x+w/2-16,y-h+8);cc.lineTo(x-w/2+16,y-h+8);cc.closePath();},[238,230,210],[255,252,240],x+40,y-h,180,"rgba(80,60,30,0.2)",6);
  c.strokeStyle="rgba(80,60,40,0.35)";c.lineWidth=1.6;for(let k=0;k<4;k++){const yy=y-h+34+k*26;c.beginPath();c.moveTo(x-w/2+30,yy);c.lineTo(x+w/2-30,yy);c.stroke();}
  c.strokeStyle="rgba(80,60,40,0.5)";c.beginPath();c.moveTo(x,y-10);c.lineTo(x,y-h+8);c.stroke();
  if(o.write){const u=o.write;c.strokeStyle=rgba(DQ.ink,0.75);c.lineWidth=2.2;c.beginPath();c.moveTo(x+12,y-h+60);c.lineTo(x+12+70*u,y-h+60+Math.sin(u*20)*3);c.stroke();}}
function rf_note(c,hands){const [hx,hy]=hands.near,x=hx+40,y=hy-34;c.save();c.translate(x,y);c.rotate(-0.08);
  ag_soft(c,cc=>{cc.moveTo(-70,-34);cc.lineTo(70,-34);cc.lineTo(70,34);cc.lineTo(-70,34);cc.closePath();},[214,206,186],[246,240,226],30,-30,120,"rgba(80,60,30,0.25)",6);
  c.strokeStyle="rgba(90,80,70,0.55)";c.lineWidth=2;c.strokeRect(-58,-24,116,48);c.fillStyle="rgba(90,80,70,0.5)";c.beginPath();c.arc(-30,0,12,0,TAU);c.fill();c.restore();}
