/* ===== Measure the work, not the people: the opening, Sweden, 1997 to 2024 =====
   The film's own pictures for its opening story (prefix mw_), drawn in the module's matte language and lit from the right like the
   team's rooms (shadows fall down and to the left), seen from above like a road planner's sheet, so nobody's face is the subject and no
   car is anyone's. Nothing is a likeness of a real road, a real town or a real car; no maker's mark is drawn.
     mwRoad                     a fast road with two lanes through fields and pine woods, from above, on a soft summer day: the land and
                                the road's surface only (its paint, its barrier and its traffic are drawn live, since they change)
     mw_roadPaint(ctx, o)       the road's paint: o.old (0 to 1: the two lanes of 1997, a dashed line down the middle), o.neu (0 to 1:
                                the lanes of a road with a barrier down the middle, two lanes one way and one the other, swapping sides)
     mw_barrier(ctx, u, o)      the barrier of steel cables on its posts, built from the left (u 0 to 1); o.bow (0 to 1) and o.at (x):
                                where a car leaning on it pushes it a little aside
     mw_car(ctx, x, y, o)       a car seen from above, matte, in one of five plain paints (o.paint), heading right (o.dir 1) or left
                                (-1), o.rot (radians: drifting), o.a
     mw_traffic(ctx, t, o)      the road's traffic, a few cars each way at an easy speed; o.lanes "old" or "new"; o.a; o.skip (indexes
                                not drawn, such as the cars a scene draws itself)
     mwStudy                    a pale planner's sheet of a road network, roads drawn as lines, the fast two-lane roads among them
     mw_crashes(ctx, u, o)      the fatal crashes, studied one by one: data's orange dots along the roads (u 0 to 1: they come in);
                                o.focus (0 to 1): those on the fast two-lane roads stay, the others fade back
     mwTown                     a small town's crossroads from above: houses, gardens, and the two streets
     mw_junction(ctx, u, o)     the crossroads' middle: its stop lines (u 0), or a roundabout (u 1); o.walk (0 to 1): a crossing for
                                people on foot painted on one street
     mw_deaths(ctx, x, y, o)    two bars on a sheet: Sweden's road deaths, 541 in 1997 and 213 in 2024 (o.u: they grow; o.a)
   Colour keeps the module's meaning: amber a harm or a risk (the drifting car, the deaths), orange data (the crashes studied, the deaths
   counted), green what got better, blue the plan (the barrier's line, the rules); the land, the road and the cars wear none of them. */

const MW_K={field:[204,194,156],field2:[192,186,148],meadow:[170,170,136],meadow2:[158,162,128],pine:[84,98,82],pine2:[66,80,68],
  verge:[180,174,158],asphalt:[120,118,116],asphalt2:[110,108,108],paint:[236,234,226],steel:[96,94,96],post:[70,68,70],water:[156,164,168],
  roof:[150,112,96],roof2:[128,124,122],house:[214,206,192],garden:[176,176,142],sheet:[236,230,218],sheetLine:[150,140,128]};
// the road's band from above: its surface from y 450 to 630; in 1997, two lanes either side of a dashed line at y 540
const MW_ROAD={y0:450,y1:630,mid:540,up:495,dn:585};
// with the barrier: on the left, one lane up top and two below; on the right, two up top and one below; the barrier swaps over between
const MW_SWAP={x0:1120,x1:1460,yl:503,yr:577},mw_barY=x=>x<=MW_SWAP.x0?MW_SWAP.yl:x>=MW_SWAP.x1?MW_SWAP.yr:lerp(MW_SWAP.yl,MW_SWAP.yr,ag_sine((x-MW_SWAP.x0)/(MW_SWAP.x1-MW_SWAP.x0)));
// the lanes the traffic keeps with the barrier: the outer lane each way runs straight through the swap
const MW_NEW={up:476,dn:604};

/* ---------------------------------------------------------------- the road through the fields, from above */
function mw_pine(c,x,y,r,R){// one pine's crown from above: a dark star of soft lobes, its shadow down and to the left
  c.fillStyle="rgba(40,34,30,0.22)";c.beginPath();c.ellipse(x-r*0.5,y+r*0.45,r*1.05,r*0.95,0,0,TAU);c.fill();
  c.fillStyle=rgba(mix(MW_K.pine2,MW_K.pine,R()),1);c.beginPath();const n=9;for(let i=0;i<=n*2;i++){const a=i/(n*2)*TAU,rr=r*(i%2?0.72:1)*(0.92+0.1*R());c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();
  c.fillStyle="rgba(255,244,214,0.14)";c.beginPath();c.ellipse(x+r*0.28,y-r*0.22,r*0.45,r*0.4,0,0,TAU);c.fill();}
function mw_paintRoad(c){const R=ag_rnd(1997);c.fillStyle=rgba(MW_K.meadow,1);c.fillRect(0,0,W,H);
  // fields in long strips, straw and meadow, a little uneven at their edges
  const strips=[[0,0,W,200,MW_K.field],[0,200,W,170,MW_K.meadow2],[0,660,W,150,MW_K.field2],[0,810,W,270,MW_K.meadow]];
  for(const [x,y,w,h,col] of strips){c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(x,y);for(let k=0;k<=24;k++){c.lineTo(x+w*k/24,y+(R()-0.5)*8);}
    for(let k=24;k>=0;k--){c.lineTo(x+w*k/24,y+h+(R()-0.5)*8);}c.closePath();c.fill();
    c.strokeStyle="rgba(120,104,80,0.10)";c.lineWidth=2;for(let yy=y+14;yy<y+h-6;yy+=16){c.beginPath();c.moveTo(0,yy);c.lineTo(W,yy+(R()-0.5)*6);c.stroke();}}
  // a lake's edge at the top right, grey under the sky
  c.fillStyle=rgba(MW_K.water,1);c.beginPath();c.moveTo(1500,0);c.bezierCurveTo(1540,90,1660,150,1780,130);c.bezierCurveTo(1860,120,1900,70,W,60);c.lineTo(W,0);c.closePath();c.fill();
  c.strokeStyle="rgba(255,255,255,0.25)";c.lineWidth=3;c.beginPath();c.moveTo(1520,20);c.bezierCurveTo(1560,90,1660,135,1770,118);c.stroke();
  // the verges and the road's surface, slightly worn along the wheels' tracks
  c.fillStyle=rgba(MW_K.verge,1);c.fillRect(0,MW_ROAD.y0-18,W,MW_ROAD.y1-MW_ROAD.y0+36);
  let g=c.createLinearGradient(0,MW_ROAD.y0,0,MW_ROAD.y1);g.addColorStop(0,rgba(MW_K.asphalt2,1));g.addColorStop(0.5,rgba(MW_K.asphalt,1));g.addColorStop(1,rgba(MW_K.asphalt2,1));
  c.fillStyle=g;c.fillRect(0,MW_ROAD.y0,W,MW_ROAD.y1-MW_ROAD.y0);
  c.fillStyle="rgba(255,255,255,0.035)";for(const y of [470,520,560,610])c.fillRect(0,y,W,10);
  // the ditches beside the verges, and fence posts along the fields
  c.strokeStyle="rgba(90,84,70,0.22)";c.lineWidth=5;for(const y of [MW_ROAD.y0-24,MW_ROAD.y1+24]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  c.fillStyle="rgba(70,62,52,0.45)";for(let x=10;x<W;x+=64){c.fillRect(x,MW_ROAD.y0-44,5,5);c.fillRect(x+30,MW_ROAD.y1+40,5,5);}
  // the pine woods: a dark wood at the top left, a belt along the bottom, single pines in the fields
  for(let i=0;i<120;i++){const x=R()*720-20,y=R()*330-20;mw_pine(c,x,y,22+R()*16,R);}
  for(let i=0;i<150;i++){const x=R()*W,y=850+R()*240;mw_pine(c,x,y,22+R()*18,R);}
  for(const [x,y] of [[960,120],[1180,300],[1330,250],[820,720],[1660,740],[300,760]])mw_pine(c,x,y,26,R);
  // a farm track meeting the road from below, and a red-roofed barn by it
  c.fillStyle=rgba(MW_K.verge,1);c.beginPath();c.moveTo(1235,MW_ROAD.y1);c.lineTo(1275,MW_ROAD.y1);c.lineTo(1330,860);c.lineTo(1290,860);c.closePath();c.fill();
  c.fillStyle="rgba(40,34,30,0.2)";c.fillRect(1356,688,180,96);c.fillStyle=rgba(MW_K.roof,1);c.fillRect(1366,676,180,96);c.fillStyle="rgba(255,240,220,0.18)";c.fillRect(1456,676,90,96);
  c.strokeStyle="rgba(60,40,34,0.35)";c.lineWidth=3;c.beginPath();c.moveTo(1456,676);c.lineTo(1456,772);c.stroke();
  // the day's soft light: warm from the right, the room's shade at the left edge
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.12));g.addColorStop(0.6,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.sun,0.10));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W*0.55,H*0.45,H*0.4,W*0.55,H*0.45,W*0.8);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.18));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mwRoad=c=>mw_paintRoad(c);

// the road's paint: the old two lanes and their dashed middle line, and the new lanes either side of the barrier
function mw_roadPaint(ctx,o){o=o||{};const old=clamp(o.old==null?1:o.old,0,1),neu=clamp(o.neu||0,0,1);ctx.save();
  ctx.fillStyle=rgba(MW_K.paint,0.9);for(const y of [MW_ROAD.y0+6,MW_ROAD.y1-12])ctx.fillRect(0,y,W,6);
  if(old>0.004){ctx.globalAlpha=old;for(let x=-20;x<W;x+=120)ctx.fillRect(x,MW_ROAD.mid-3,64,6);ctx.globalAlpha=1;}
  if(neu>0.004){ctx.globalAlpha=neu;
    // the line between the two lanes on the side that has two: below the barrier on the left, above it on the right
    for(let x=-20;x<MW_SWAP.x0-60;x+=90)ctx.fillRect(x,MW_SWAP.yl+60,48,5);
    for(let x=MW_SWAP.x1+40;x<W;x+=90)ctx.fillRect(x,MW_SWAP.yr-66,48,5);
    // the barrier's strip: a band of paint either side of where the posts stand
    ctx.fillStyle=rgba(MW_K.paint,0.7);ctx.beginPath();for(let x=0;x<=W;x+=20)ctx.lineTo(x,mw_barY(x)-10);for(let x=W;x>=0;x-=20)ctx.lineTo(x,mw_barY(x)-6);ctx.closePath();ctx.fill();
    ctx.beginPath();for(let x=0;x<=W;x+=20)ctx.lineTo(x,mw_barY(x)+6);for(let x=W;x>=0;x-=20)ctx.lineTo(x,mw_barY(x)+10);ctx.closePath();ctx.fill();ctx.globalAlpha=1;}
  ctx.restore();}

// the barrier: posts every 60 px and three steel cables between them, drawn in from the left; where a car leans on it, it gives a little
function mw_barrier(ctx,u,o){o=o||{};u=clamp(u,0,1);if(u<=0)return;const a=o.a==null?1:o.a;ctx.save();ctx.globalAlpha*=a;const xe=lerp(-40,W+40,u),bow=o.bow||0,at=o.at||960;
  const dy=x=>bow*18*Math.exp(-Math.pow((x-at)/150,2));
  for(let x=10;x<xe;x+=60){const y=mw_barY(x)+dy(x),s=clamp((xe-x)/80,0,1);ctx.fillStyle="rgba(30,26,24,0.28)";ctx.fillRect(x-8,y-1,8,9);ctx.fillStyle=rgba(MW_K.post,1);ctx.fillRect(x-3,y-4*s,7,8*s);}
  ctx.strokeStyle=rgba(MW_K.steel,1);ctx.lineWidth=2.4;for(const k of [-2.5,0,2.5]){ctx.beginPath();for(let x=0;x<=xe;x+=10){const y=mw_barY(x)+dy(x)+k;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
  ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=1;ctx.beginPath();for(let x=0;x<=xe;x+=10){const y=mw_barY(x)+dy(x)-3.5;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- a car from above */
const MW_PAINT=[[224,222,214],[146,148,152],[86,88,94],[122,74,70],[198,186,162]];
function mw_car(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=MW_PAINT[(o.paint||0)%MW_PAINT.length],L=78,Wd=38;ctx.save();ctx.globalAlpha*=a;
  ctx.translate(x,y);ctx.rotate((o.dir===-1?Math.PI:0)+(o.rot||0));
  // the shadow on the road, down and to the left (it stays there whichever way the car points)
  ctx.save();ctx.rotate(-((o.dir===-1?Math.PI:0)+(o.rot||0)));ctx.fillStyle="rgba(24,20,18,0.30)";ctx.beginPath();ctx.roundRect(-L/2-6,-Wd/2+6,L+4,Wd+2,12);ctx.fill();ctx.restore();
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.roundRect(-L/2,-Wd/2,L,Wd,13);ctx.fill();
  ctx.fillStyle=rgba(mix(col,[30,30,34],0.55),1);ctx.beginPath();ctx.roundRect(6,-Wd/2+5,14,Wd-10,4);ctx.fill();          // the windscreen
  ctx.beginPath();ctx.roundRect(-26,-Wd/2+6,9,Wd-12,3);ctx.fill();                                                         // the rear window
  ctx.fillStyle=rgba(mix(col,[255,255,255],0.2),1);ctx.beginPath();ctx.roundRect(-16,-Wd/2+5,22,Wd-10,5);ctx.fill();      // the roof, in the light
  ctx.fillStyle="rgba(255,250,236,0.7)";ctx.fillRect(L/2-4,-Wd/2+4,3,7);ctx.fillRect(L/2-4,Wd/2-11,3,7);                   // the lamps
  ctx.restore();}
// the road's traffic: cars spaced along each lane, moving at an easy speed (the clock tt in seconds); in the new lanes the outer lane
// each way, which runs straight through the swap
const MW_FLOW=[{dir:1,x0:-120,paint:0},{dir:1,x0:620,paint:3},{dir:1,x0:1360,paint:1},{dir:-1,x0:98,paint:2},{dir:-1,x0:1578,paint:4},{dir:-1,x0:838,paint:1}];
function mw_flowX(i,tt){const f=MW_FLOW[i],span=W+300,v=f.dir*120;return ((f.x0+v*tt)%span+span)%span-150;}
function mw_traffic(ctx,tt,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const neu=o.lanes==="new",skip=o.skip||[];
  MW_FLOW.forEach((f,i)=>{if(skip.includes(i))return;const y=neu?(f.dir>0?MW_NEW.dn:MW_NEW.up):(f.dir>0?MW_ROAD.dn:MW_ROAD.up);mw_car(ctx,mw_flowX(i,tt),y,{dir:f.dir,paint:f.paint,a});});}

/* ---------------------------------------------------------------- the crashes studied: a planner's sheet of roads */
// the roads: [points], fast (a fast road with two lanes), each a polyline across the sheet
const MW_NET=[{p:[[60,300],[420,330],[760,280],[1100,350],[1480,300],[1860,340]],fast:1},{p:[[120,760],[520,700],[900,760],[1300,690],[1820,740]],fast:1},
  {p:[[640,60],[700,300],[660,520],[740,760],[700,1020]],fast:1},{p:[[1260,80],[1200,340],[1300,560],[1240,700],[1320,1000]],fast:0},
  {p:[[60,520],[400,560],[660,520],[980,560],[1300,560],[1600,520],[1880,560]],fast:0},{p:[[1480,300],[1560,520],[1500,740]],fast:0},{p:[[300,330],[260,560],[320,760]],fast:0}];
function mw_netPt(r,u){const p=r.p;let L=0;const seg=[];for(let i=1;i<p.length;i++){const l=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);seg.push(l);L+=l;}
  let d=u*L;for(let i=1;i<p.length;i++){if(d<=seg[i-1])return[lerp(p[i-1][0],p[i][0],d/seg[i-1]),lerp(p[i-1][1],p[i][1],d/seg[i-1])];d-=seg[i-1];}return p[p.length-1];}
function mw_paintStudy(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(MW_K.sheet,1));g.addColorStop(1,rgba(mix(MW_K.sheet,[200,190,176],0.4),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // a faint planner's grid, and the land's edges as soft tints
  c.strokeStyle="rgba(120,108,96,0.10)";c.lineWidth=2;for(let x=0;x<W;x+=96){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<H;y+=96){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  c.fillStyle="rgba(150,160,164,0.22)";c.beginPath();c.moveTo(1640,0);c.bezierCurveTo(1600,200,1760,320,1700,520);c.bezierCurveTo(1660,700,1800,860,1760,1080);c.lineTo(W,1080);c.lineTo(W,0);c.closePath();c.fill();
  // the roads: the fast two-lane roads as a broad double line, the others thinner
  for(const r of MW_NET){c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba(r.fast?mix(MW_K.sheetLine,[60,52,48],0.35):MW_K.sheetLine,r.fast?0.95:0.5);c.lineWidth=r.fast?18:7;c.beginPath();r.p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();
    if(r.fast){c.strokeStyle=rgba(MW_K.sheet,1);c.lineWidth=4;c.beginPath();r.p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}}
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.16));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mwStudy=c=>mw_paintStudy(c);
// the crashes: 34 dots along the roads, most of them on the fast two-lane roads, as the studies found
// each crash a dot on a road, clear of the sheet at the top left and of the captions' band
const MW_CRASH=(()=>{const R=ag_rnd(541),out=[];for(let i=0;i<34;i++){const fast=i%5!==4,cand=MW_NET.filter(r=>!!r.fast===fast);let x=0,y=0,n=0;
  do{const r=cand[(R()*cand.length)|0],u=0.06+R()*0.88;[x,y]=mw_netPt(r,u);n++;}while(n<40&&(y>850||(x<870&&y<380)));out.push({x,y,fast,at:R()});}return out.sort((a,b)=>a.at-b.at);})();
function mw_crashes(ctx,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const f=clamp(o.focus||0,0,1);ctx.save();ctx.globalAlpha*=a;
  MW_CRASH.forEach((d,i)=>{const k=clamp(u*MW_CRASH.length-i,0,1);if(k<=0)return;const s=lerp(0.4,1,ag_spr(k,0,0.4)),dim=d.fast?1:1-0.75*f;ctx.save();ctx.globalAlpha*=ag_sine(k)*dim;
    ctx.fillStyle=rgba(LP.orange,1);ctx.beginPath();ctx.arc(d.x,d.y,12*s,0,TAU);ctx.fill();ctx.strokeStyle=rgba(LP.paper,1);ctx.lineWidth=3;ctx.stroke();ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- a small town's crossroads, from above */
function mw_house(c,x,y,w,h,col){c.fillStyle="rgba(40,34,30,0.22)";c.fillRect(x-12,y+10,w,h);c.fillStyle=rgba(col,1);c.fillRect(x,y,w,h);
  c.fillStyle="rgba(255,240,220,0.16)";c.fillRect(x+w/2,y,w/2,h);c.strokeStyle="rgba(60,40,34,0.3)";c.lineWidth=3;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.stroke();}
function mw_paintTown(c){const R=ag_rnd(30);c.fillStyle=rgba(MW_K.garden,1);c.fillRect(0,0,W,H);
  // gardens and hedges, then the two streets crossing, and their pavements
  for(let i=0;i<40;i++){c.fillStyle=rgba(mix(MW_K.garden,MW_K.meadow2,R()),1);c.fillRect(R()*W,R()*H,120+R()*120,90+R()*90);}
  c.fillStyle=rgba(MW_K.verge,1);c.fillRect(0,440,W,200);c.fillRect(860,0,200,H);
  c.fillStyle=rgba(MW_K.asphalt,1);c.fillRect(0,460,W,160);c.fillRect(880,0,160,H);
  c.fillStyle="rgba(255,255,255,0.03)";for(const y of [480,580])c.fillRect(0,y,W,10);
  // the houses either side of the streets: red and grey roofs
  const lots=[[140,170,190,150],[420,140,210,170],[1180,150,200,160],[1460,190,220,150],[1720,130,160,170],[150,720,210,150],[470,760,190,160],[1180,730,210,150],[1480,700,180,170],[1740,760,160,140]];
  lots.forEach(([x,y,w,h],i)=>mw_house(c,x,y,w,h,i%3===1?MW_K.roof2:MW_K.roof));
  for(let i=0;i<30;i++){const x=R()*W,y=R()<0.5?R()*380:700+R()*380;if(Math.abs(x-960)<160)continue;mw_pine(c,x,y,18+R()*10,R);}
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.12));g.addColorStop(0.6,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.sun,0.10));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W*0.55,H*0.45,H*0.4,W*0.55,H*0.45,W*0.8);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.18));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mwTown=c=>mw_paintTown(c);
// the middle of the crossroads: four stop lines (u 0), or a roundabout's island and its ring (u 1); a crossing for people on foot (walk)
function mw_junction(ctx,u,o){o=o||{};u=ag_sine(clamp(u,0,1));const cx=960,cy=540;ctx.save();
  ctx.fillStyle=rgba(MW_K.paint,0.9*(1-u));ctx.fillRect(848,460,8,160);ctx.fillRect(1064,460,8,160);ctx.fillRect(880,428,160,8);ctx.fillRect(880,644,160,8);
  for(let x=0;x<840;x+=110)ctx.fillRect(x,537,60,6);for(let x=1080;x<W;x+=110)ctx.fillRect(x,537,60,6);
  for(let y=0;y<420;y+=110)ctx.fillRect(957,y,6,60);for(let y=660;y<H;y+=110)ctx.fillRect(957,y,6,60);
  if(u>0.004){const r=lerp(20,150,u);ctx.globalAlpha=u;ctx.fillStyle=rgba(MW_K.asphalt,1);ctx.beginPath();ctx.arc(cx,cy,r+50,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(30,26,24,0.2)";ctx.beginPath();ctx.arc(cx-8,cy+8,r*0.62,0,TAU);ctx.fill();ctx.fillStyle=rgba(MW_K.meadow,1);ctx.beginPath();ctx.arc(cx,cy,r*0.62,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(MW_K.paint,0.9);ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx,cy,r*0.62+6,0,TAU);ctx.stroke();ctx.setLineDash([22,18]);ctx.beginPath();ctx.arc(cx,cy,r+50,0,TAU);ctx.stroke();ctx.setLineDash([]);
    mw_pine(ctx,cx+10,cy-6,24*u,ag_rnd(5));}
  const wk=clamp(o.walk||0,0,1);if(wk>0.004){ctx.globalAlpha=ag_sine(wk);ctx.fillStyle=rgba(MW_K.paint,0.95);for(let k=0;k<6;k++)ctx.fillRect(1290+k*0,470+k*26,90,14);}
  ctx.restore();}

/* ---------------------------------------------------------------- the deaths counted: two bars */
function mw_deaths(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+300,y+250,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,600,500,{col:LP.orange,light:null,pin:false});lp_T(ctx,"ROAD DEATHS IN SWEDEN",x+40,y+64,{w:800,size:28,ls:3,col:LP.orange});
  const base=y+420,top=y+130,hOf=v=>(base-top)*v/560,u=ag_sine(clamp(o.u==null?1:o.u,0,1)),u2=ag_sine(clamp(o.u2==null?u:o.u2,0,1));
  for(const [v,yr,bx,uu] of [[541,"1997",x+110,u],[213,"2024",x+350,u2]]){if(uu<=0.004)continue;const h=hOf(v)*uu;ctx.fillStyle=rgba(LP.orange,1);ctx.fillRect(bx,base-h,140,h);
    lp_T(ctx,String(v),bx+70,base-h-16,{w:800,size:36,col:LP.orange,align:"center",a:clamp(uu*2-1,0,1)});lp_T(ctx,yr,bx+70,base+48,{w:700,size:28,col:LP.mut,align:"center"});}
  ctx.strokeStyle=rgba(LP.mut,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+70,base+1);ctx.lineTo(x+530,base+1);ctx.stroke();ctx.restore();}
