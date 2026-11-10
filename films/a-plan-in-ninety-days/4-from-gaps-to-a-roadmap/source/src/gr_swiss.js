/* ===== From gaps to a roadmap: Switzerland, from the 1970s =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix gr_, GR_). Nothing here copies a photograph, a railway's own clock, logo or livery, or anyone's likeness: a valley in soft layers,
   a station's platform under a plain canopy with a plain clock, and a schematic map of the main lines with six cities named.
     grValley      a valley of the 1970s seen from a hillside: far mountains, hills, a small town and its railway
     gr_train      a short train, plain and matte, running along the valley's line
     gr_motorway   the new motorway across the valley, drawing itself, and its cars
     grPlatform    a station's platform: the station's plastered wall under a canopy, a window; people stand in front of the wall
     gr_clock      a plain station clock hanging from the canopy, its hands moving
     grMap         the country from above, schematic: the Jura and the Alps in soft relief, its lakes, the border; drawn once
     GR_CITY, GR_LINE, gr_lines, gr_city, gr_hub   the six cities, the main lines and the hubs, drawn live over grMap
     gr_new        Rail 2000's four new lines, dashed, and the fast lines of the 1970s that were dropped
     gr_trains     trains meeting at the hubs just before the hour and leaving just after
     gr_bern       Bern's platforms at the half hour, as a plan on a sheet
     GR_FOLK       a student, a worker and an older woman on the platform, dressed plainly for their time
   Colour keeps the module's meaning: the timetable and the plans in blue, what was built and what got better in green, the gaps, the waits
   and the costs in amber, the share of travel in orange; the places and the people wear none of the five. */

const GR_K={sky0:[206,214,220],sky1:[246,236,216],far:[176,180,190],far2:[198,198,204],snow:[246,246,244],hill1:[170,168,142],hill2:[154,152,124],
  hill3:[142,138,110],field:[196,186,150],fieldDk:[172,162,128],tree:[116,120,94],treeDk:[88,92,74],house:[238,230,216],houseDk:[204,194,178],
  roof:[146,104,84],roofDk:[112,80,64],rail:[92,86,82],ballast:[176,170,160],road:[208,204,196],roadDk:[170,166,160],
  train:[122,116,114],trainDk:[80,78,82],trainLt:[176,170,164],glass:[62,68,76],
  plaster:[224,212,194],canopy:[74,66,62],fascia:[150,120,92],stone:[188,180,168],stoneDk:[156,148,138],
  land:[241,235,222],landDk:[224,214,194],abroad:[226,224,218],lake:[194,207,211],lakeDk:[166,184,192],line:[90,84,82]};

/* ---------------------------------------------------------------- the valley */
// a range of hills or mountains: its crest from fbm noise (ridged, for peaks; few octaves, so the far ones stay soft), filled down with a gradient
function gr_crest(x,base,amp,fq,sd,sharp,oc){const n=LP_NZ.fbm(x*fq+sd,sd*0.31,oc||5);return base-amp*(sharp?Math.pow(1-Math.abs(2*n-1),sharp):n);}
function gr_range(c,base,amp,fq,sd,sharp,col0,col1,top,oc){c.beginPath();c.moveTo(-10,H);for(let x=-10;x<=W+10;x+=6)c.lineTo(x,gr_crest(x,base,amp,fq,sd,sharp,oc));
  c.lineTo(W+10,H);c.closePath();const g=c.createLinearGradient(0,top,0,base+40);g.addColorStop(0,rgba(col0,1));g.addColorStop(1,rgba(col1,1));c.fillStyle=g;c.fill();}
function gr_tree(c,x,y,r,R){c.fillStyle=rgba(GR_K.treeDk,1);c.fillRect(x-1.5,y-r*0.6,3,r*0.7);
  for(let k=0;k<4;k++){const dx=(R()-0.5)*r*0.8,dy=-r*(0.8+R()*0.5),rr2=r*(0.45+R()*0.2),g=c.createRadialGradient(x+dx+rr2*0.4,y+dy-rr2*0.4,1,x+dx,y+dy,rr2);
    g.addColorStop(0,rgba(ag_lt(GR_K.tree,0.16),1));g.addColorStop(1,rgba(GR_K.treeDk,1));c.fillStyle=g;c.beginPath();c.arc(x+dx,y+dy,rr2,0,TAU);c.fill();}}
// a house: plastered walls lit on the right, a pitched roof, a few dark windows; (x, y) its foot's left corner
function gr_house(c,x,y,w,h,R){const side=w*0.36,rh=h*0.62;
  c.fillStyle=rgba(GR_K.house,1);c.fillRect(x,y-h,w,h);c.fillStyle=rgba(GR_K.houseDk,1);c.fillRect(x-side,y-h+2,side,h-2);
  c.fillStyle=rgba(GR_K.roof,1);c.beginPath();c.moveTo(x-side-4,y-h);c.lineTo(x-side*0.5+w*0.1,y-h-rh);c.lineTo(x+w*0.55,y-h-rh);c.lineTo(x+w+5,y-h);c.closePath();c.fill();
  c.fillStyle=rgba(GR_K.roofDk,1);c.beginPath();c.moveTo(x-side-4,y-h);c.lineTo(x-side*0.5+w*0.1,y-h-rh);c.lineTo(x-side*0.2,y-h);c.closePath();c.fill();
  c.fillStyle=rgba(GR_K.glass,0.75);const n=Math.max(1,Math.round(w/16));for(let i=0;i<n;i++){const wx=x+w*(i+0.5)/n-2.5;c.fillRect(wx,y-h*0.72,5,6);if(h>22)c.fillRect(wx,y-h*0.4,5,6);}}
// the railway along the valley, in front of the town, and the motorway nearer still; both above the caption band
const GR_RAIL=x=>792+12*Math.sin((x+200)/420)-x*0.012;
const GR_ROAD=x=>842+8*Math.sin((x-300)/520)-x*0.006;
AG_PLACES.grValley=c=>{const R=ag_rnd(1972);
  let g=c.createLinearGradient(0,0,0,640);g.addColorStop(0,rgba(GR_K.sky0,1));g.addColorStop(1,rgba(GR_K.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(1700,80,20,1700,80,1000);g.addColorStop(0,"rgba(255,242,214,0.7)");g.addColorStop(1,"rgba(255,242,214,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // far mountains, pale in the haze, broad and soft, snow on the highest; then a nearer range, then the hills
  c.save();gr_range(c,610,250,0.0017,3.7,1.25,[214,214,220],[200,202,208],330,3);c.clip();
  g=c.createLinearGradient(0,360,0,470);g.addColorStop(0,rgba(GR_K.snow,0.95));g.addColorStop(1,rgba(GR_K.snow,0));c.fillStyle=g;c.fillRect(0,0,W,480);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.06));g.addColorStop(1,rgba([255,240,214],0.10));c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
  gr_range(c,660,130,0.0026,9.1,1.4,mix([200,202,208],GR_K.hill1,0.4),mix([200,202,208],GR_K.hill1,0.62),520,4);
  gr_range(c,700,70,0.0040,17.3,0,GR_K.hill1,GR_K.hill2,620,4);
  // the valley floor: fields in soft strips, a few trees and hedges
  g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,rgba(GR_K.field,1));g.addColorStop(1,rgba(GR_K.fieldDk,1));c.fillStyle=g;
  c.beginPath();c.moveTo(-10,H);for(let x=-10;x<=W+10;x+=8)c.lineTo(x,716+10*Math.sin(x/300)+LP_NZ.fbm(x*0.006,4.4,3)*14);c.lineTo(W+10,H);c.closePath();c.fill();
  for(let k=0;k<9;k++){const y0=744+k*30,a=0.05+R()*0.05;c.fillStyle=rgba(k%2?GR_K.fieldDk:GR_K.hill1,a);c.beginPath();c.moveTo(-10,y0);
    for(let x=-10;x<=W+10;x+=40)c.lineTo(x,y0+8*Math.sin(x/260+k)+x*0.008);c.lineTo(W+10,H);c.lineTo(-10,H);c.closePath();c.fill();}
  for(let k=0;k<30;k++){const x=R()*W,y=700+R()*30;if(x>1060&&x<1620)continue;gr_tree(c,x,y,7+R()*7,R);}
  // the small town on the valley floor, round its station, behind the railway
  const H0=[[1180,752,30,22],[1222,746,36,26],[1268,756,28,20],[1306,744,42,28],[1356,752,30,22],[1398,740,38,30],[1446,750,34,24],[1490,738,30,22],
    [1250,722,26,18],[1292,718,30,20],[1340,724,24,16],[1384,714,30,20],[1430,720,26,18],[1474,712,24,16],[1530,730,30,20],[1110,760,26,18],[1580,746,28,20]];
  H0.sort((a,b)=>a[1]-b[1]);for(const [x,y,w,h] of H0)gr_house(c,x,y,w,h,R);
  // a small tower among the roofs, plain
  c.fillStyle=rgba(GR_K.house,1);c.fillRect(1336,664,16,60);c.fillStyle=rgba(GR_K.houseDk,1);c.fillRect(1330,664,6,60);c.fillStyle=rgba(GR_K.roofDk,1);
  c.beginPath();c.moveTo(1326,666);c.lineTo(1344,624);c.lineTo(1356,666);c.closePath();c.fill();
  // trees between the railway and the motorway, and a few in front, low
  // between the rail and the road: each crown clear of the rail, and small enough to stand above the road
  for(let k=0;k<12;k++){const x=R()*W;R();const r0=9+R()*6,rl=GR_RAIL(x),r=Math.min(r0,Math.max(5,(GR_ROAD(x)-22-rl)/2.1));gr_tree(c,x,rl+12+r*2,r,R);}
  for(let k=0;k<9;k++){const x=R()*W,y=900+R()*120;gr_tree(c,x,y,16+R()*10,R);}
  // the railway: ballast, sleepers and two rails, along the valley
  c.lineCap="round";c.strokeStyle=rgba(GR_K.ballast,1);c.lineWidth=12;c.beginPath();for(let x=-20;x<=W+20;x+=10){const y=GR_RAIL(x);x>-20?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  c.strokeStyle=rgba(GR_K.rail,0.35);c.lineWidth=1.5;for(let x=-20;x<=W+20;x+=9){const y=GR_RAIL(x);c.beginPath();c.moveTo(x,y-4);c.lineTo(x-1,y+4);c.stroke();}
  c.strokeStyle=rgba(GR_K.rail,1);c.lineWidth=1.6;for(const d of [-2.5,2.5]){c.beginPath();for(let x=-20;x<=W+20;x+=10){const y=GR_RAIL(x)+d;x>-20?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
  // the light: the side away from the sun a little cooler, the far right a little warm; a soft vignette
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.12));g.addColorStop(0.5,rgba(LP.shade,0.02));g.addColorStop(1,rgba([255,236,200],0.08));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.4,W*0.55,H*0.42,W*0.8);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.16));c.fillStyle=g;c.fillRect(0,0,W,H);};
// a short train of n cars, plain, its front at x along the valley's line, going right
function gr_train(ctx,x,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const cw=86,gap=4;
  for(let i=0;i<n;i++){const x1=x-i*(cw+gap),x0=x1-cw,y0=GR_RAIL(x0),y1=GR_RAIL(x1),an=Math.atan2(y1-y0,x1-x0);ctx.save();ctx.translate((x0+x1)/2,(y0+y1)/2-11);ctx.rotate(an);
    ctx.fillStyle=rgba(GR_K.trainDk,1);rr(ctx,-cw/2,-11,cw,22,i===0?9:4);ctx.fill();ctx.fillStyle=rgba(GR_K.train,1);rr(ctx,-cw/2,-11,cw,15,i===0?9:4);ctx.fill();
    ctx.fillStyle=rgba(GR_K.trainLt,1);ctx.fillRect(-cw/2+4,-11,cw-8,3);ctx.fillStyle=rgba(GR_K.glass,0.9);for(let k=0;k<5;k++)ctx.fillRect(-cw/2+8+k*16,-7,10,6);ctx.restore();}
  ctx.restore();}
// the motorway: a pale band drawing itself from the left (u), its cars running both ways (t)
function gr_motorway(ctx,u,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||u<=0)return;const x1=lerp(-20,W+20,clamp(u,0,1));ctx.save();ctx.globalAlpha*=a;ctx.lineCap="butt";
  ctx.strokeStyle=rgba(GR_K.roadDk,1);ctx.lineWidth=20;ctx.beginPath();for(let x=-20;x<=x1;x+=10){const y=GR_ROAD(x);x>-20?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  ctx.strokeStyle=rgba(GR_K.road,1);ctx.lineWidth=16;ctx.stroke();ctx.setLineDash([14,14]);ctx.strokeStyle=rgba([255,255,255],0.7);ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);
  if(u>=1){const R=ag_rnd(77);for(let k=0;k<14;k++){const dir=k%2?1:-1,sp=60+R()*50,ph=R()*W,x=((ph+dir*t*sp)%(W+200)+W+200)%(W+200)-100,y=GR_ROAD(x)+dir*4;
      const cols=[[128,92,80],[96,98,104],[176,170,160],[84,80,78],[150,136,118]];ctx.fillStyle=rgba(cols[k%5],1);rr(ctx,x-8,y-3,16,6,2);ctx.fill();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the platform */
const GR_PLAT={floor:880,canopy:104,cols:[430,1190]};
AG_PLACES.grPlatform=c=>{const P=GR_PLAT;lp_plaster(c,P.floor,{base:GR_K.plaster,seed:5});
  // the station's wall: a plinth, and a tall window on the right with its frame
  c.fillStyle=rgba(mix(GR_K.plaster,LP.shade,0.16),1);c.fillRect(0,P.floor-70,W,70);c.fillStyle="rgba(255,250,240,0.4)";c.fillRect(0,P.floor-70,W,1.5);
  const wx=1560,wy=300,ww=250,wh=420;c.fillStyle=rgba(mix(GR_K.plaster,LP.shade,0.22),1);c.fillRect(wx-16,wy-16,ww+32,wh+32);
  let g=c.createLinearGradient(wx,wy,wx+ww,wy+wh);g.addColorStop(0,"rgb(70,76,84)");g.addColorStop(1,"rgb(96,102,108)");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.fillStyle=rgba(GR_K.fascia,1);c.fillRect(wx+ww/2-4,wy,8,wh);c.fillRect(wx,wy+wh*0.42,ww,8);c.fillStyle="rgba(255,255,255,0.08)";c.beginPath();c.moveTo(wx,wy);c.lineTo(wx+ww*0.4,wy);c.lineTo(wx,wy+wh*0.5);c.closePath();c.fill();
  // the canopy over the platform: its underside, its timber edge, and its soft shadow on the wall
  g=c.createLinearGradient(0,P.canopy,0,P.canopy+260);g.addColorStop(0,rgba(LP.shade,0.42));g.addColorStop(1,rgba(LP.shade,0));c.fillStyle=g;c.fillRect(0,P.canopy,W,260);
  c.fillStyle=rgba(GR_K.canopy,1);c.fillRect(0,0,W,P.canopy);c.fillStyle=rgba(GR_K.fascia,1);c.fillRect(0,P.canopy-22,W,22);c.fillStyle="rgba(255,236,206,0.35)";c.fillRect(0,P.canopy-22,W,3);
  // its columns, graphite, and their shadows down and to the left
  for(const x of P.cols){c.fillStyle=rgba(LP.shade,0.16);c.beginPath();c.moveTo(x-6,P.canopy);c.lineTo(x+14,P.canopy);c.lineTo(x-60,P.floor);c.lineTo(x-86,P.floor);c.closePath();c.fill();
    g=c.createLinearGradient(x-14,0,x+14,0);g.addColorStop(0,rgba(mix(LP.graphite,[0,0,0],0.2),1));g.addColorStop(1,rgba(mix(LP.graphite,[255,255,255],0.18),1));c.fillStyle=g;c.fillRect(x-13,P.canopy,26,P.floor-P.canopy);
    c.fillStyle=rgba(LP.graphite,1);c.beginPath();c.moveTo(x-13,P.canopy+70);c.lineTo(x-70,P.canopy);c.lineTo(x+70,P.canopy);c.lineTo(x+13,P.canopy+70);c.closePath();c.fill();}
  // the platform: stone slabs, its edge at the bottom
  g=c.createLinearGradient(0,P.floor,0,H);g.addColorStop(0,rgba(GR_K.stone,1));g.addColorStop(1,rgba(GR_K.stoneDk,1));c.fillStyle=g;c.fillRect(0,P.floor,W,H-P.floor);
  c.strokeStyle=rgba(GR_K.stoneDk,0.8);c.lineWidth=1.5;for(let x=-40;x<W+80;x+=150){c.beginPath();c.moveTo(x,P.floor);c.lineTo(x-90,H);c.stroke();}
  c.beginPath();c.moveTo(0,P.floor+70);c.lineTo(W,P.floor+70);c.stroke();c.fillStyle=rgba(LP.shade,0.3);c.fillRect(0,P.floor,W,3);
  // the light: shade on the left, the sun's warmth on the right; a soft vignette
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.26));g.addColorStop(0.45,rgba(LP.shade,0.07));g.addColorStop(1,rgba([255,226,180],0.1));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W*0.55,H*0.45,H*0.38,W*0.55,H*0.45,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.22));c.fillStyle=g;c.fillRect(0,0,W,H);};
// a plain station clock hanging from the canopy at (x, y), r its radius: min the minutes past the hour (fractional), o.hour; o.a, o.ring (0 to
// 1: a soft blue ring round its face, the timetable kept to the minute)
function gr_clock(ctx,x,y,r,hour,min,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(GR_K.canopy,1);ctx.fillRect(x-5,GR_PLAT.canopy-4,10,y-r-GR_PLAT.canopy);
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.32)";ctx.shadowBlur=18;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=10;ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.arc(x,y,r*1.1,0,TAU);ctx.fill();ctx.restore();
  let g=ctx.createRadialGradient(x+r*0.3,y-r*0.3,r*0.1,x,y,r);g.addColorStop(0,"#FDFCF8");g.addColorStop(1,"#ECE8DF");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.lineCap="butt";for(let i=0;i<60;i++){const an=i/60*TAU,big=i%5===0,r0=r*(big?0.72:0.86),r1=r*0.93;ctx.strokeStyle=rgba(LP.ink,1);ctx.lineWidth=big?r*0.075:r*0.025;
    ctx.beginPath();ctx.moveTo(x+Math.sin(an)*r0,y-Math.cos(an)*r0);ctx.lineTo(x+Math.sin(an)*r1,y-Math.cos(an)*r1);ctx.stroke();}
  const hand=(an,len,wd,back)=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.fillStyle=rgba(LP.ink,1);ctx.fillRect(-wd/2,-len,wd,len+back);ctx.restore();};
  hand(((hour%12)+min/60)/12*TAU,r*0.52,r*0.1,r*0.14);hand(min/60*TAU,r*0.8,r*0.07,r*0.18);
  ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(x,y,r*0.06,0,TAU);ctx.fill();
  if(o.ring>0.004){ctx.strokeStyle=rgba(LP.blue,o.ring);ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,r*1.1+10,0,TAU);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the people on the platform
   Dressed plainly for the 1970s, never likenesses, in clothes that wear none of the five colours: a student with long hair in a dusty red
   sweater, a worker in a brown overshirt, an older woman with grey hair in a bun, glasses and a beige cardigan. Each was looked at full size,
   facing both ways, before the film used them. */
const GR_FOLK={
  student:{key:"grStudent",name:"",skin:[226,190,160],hair:{style:"long",c:[92,62,40]},top:{kind:"sweater",c:[132,74,72]},breath:0.31},
  worker:{key:"grWorker",name:"",skin:[204,160,126],hair:{style:"cropped",c:[44,34,30]},beard:[56,42,34],top:{kind:"overshirt",c:[112,86,64],inner:[222,214,198]},breath:0.26},
  older:{key:"grOlder",name:"",skin:[232,200,178],hair:{style:"bun",c:[204,200,196]},glasses:[70,60,54],earrings:[214,200,170],top:{kind:"cardigan",c:[178,162,140],inner:[238,234,226]},breath:0.29}};

/* ---------------------------------------------------------------- the map
   The country from above, schematic: longitude and latitude to the frame, the Swiss Plateau across the middle, the Jura to the north-west,
   the Alps to the south, the main lakes, and the border, outside it a little greyer. Six cities named: Lausanne, Bern, Basel, Olten,
   Zürich and Lucerne; the lines between them drawn as the railway runs, simply, never surveyed. */
const GR_P=(lon,lat)=>[960+(lon-7.585)*430,440-(lat-47.04)*630];
const GR_CITY={basel:{n:"Basel",p:GR_P(7.59,47.56),lab:[-22,10,"right"]},zurich:{n:"Zürich",p:GR_P(8.54,47.38),lab:[22,-14,"left"]},
  olten:{n:"Olten",p:GR_P(7.90,47.35),lab:[-6,48,"center"]},bern:{n:"Bern",p:GR_P(7.45,46.95),lab:[-26,12,"right"]},
  lucerne:{n:"Lucerne",p:GR_P(8.31,47.05),lab:[26,44,"left"]},lausanne:{n:"Lausanne",p:GR_P(6.63,46.52),lab:[-24,12,"right"]}};
const GR_HUBS=["basel","zurich","bern","lucerne"];
const GR_LINE={
  lb:["lausanne",GR_P(6.89,46.62),GR_P(7.15,46.80),"bern"],
  bo:["bern",GR_P(7.62,47.06),GR_P(7.80,47.21),"olten"],
  oz:["olten",GR_P(8.05,47.39),GR_P(8.30,47.42),"zurich"],
  bao:["basel",GR_P(7.73,47.48),GR_P(7.84,47.42),"olten"],
  ol:["olten",GR_P(8.00,47.25),GR_P(8.11,47.17),"lucerne"],
  zl:["zurich",GR_P(8.52,47.24),GR_P(8.52,47.17),"lucerne"],
  bl:["bern",GR_P(7.75,46.92),GR_P(8.05,46.98),"lucerne"],
  lg:["lausanne",GR_P(6.35,46.40),GR_P(6.10,46.26)],
  zs:["zurich",GR_P(8.73,47.50),GR_P(9.37,47.42),GR_P(9.80,47.40)],
  zc:["zurich",GR_P(8.80,47.25),GR_P(9.20,47.12),GR_P(9.70,46.90)],
  lgot:["lucerne",GR_P(8.50,46.95),GR_P(8.62,46.80),GR_P(8.66,46.62)],
  bt:["bern",GR_P(7.55,46.80),GR_P(7.66,46.70)]};
const gr_pt=p=>typeof p==="string"?GR_CITY[p].p:p;
const gr_pts=k=>GR_LINE[k].map(gr_pt);
// a point along a polyline, s from 0 to 1 of its length, with the direction there
function gr_along(pts,s){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let r=clamp(s,0,1)*L;for(let i=0;i<seg.length;i++){if(r<=seg[i]||i===seg.length-1){const u=seg[i]?r/seg[i]:0,a=pts[i],b=pts[i+1];return{x:lerp(a[0],b[0],u),y:lerp(a[1],b[1],u),an:Math.atan2(b[1]-a[1],b[0]-a[0]),L};}r-=seg[i];}}
function gr_path(ctx,pts,u0,u1){u0=u0==null?0:u0;u1=u1==null?1:u1;const n=40;ctx.beginPath();for(let k=0;k<=n;k++){const q=gr_along(pts,lerp(u0,u1,k/n));k?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}}
// the border, simplified, in longitude and latitude
const GR_BORDER=[[5.96,46.13],[6.12,46.58],[6.45,46.78],[6.70,47.05],[6.98,47.25],[6.96,47.45],[7.20,47.50],[7.46,47.46],[7.59,47.60],[7.95,47.56],[8.22,47.62],
  [8.45,47.58],[8.60,47.80],[8.88,47.66],[9.20,47.66],[9.56,47.52],[9.62,47.06],[9.90,46.95],[10.47,46.86]];
// the south of the border, east to west, so the country closes (only the shore of Lake Geneva shows in the frame)
const GR_BORDER_S=[[10.47,46.55],[10.08,46.23],[9.70,46.30],[9.42,46.48],[9.28,46.30],[9.02,45.82],[8.80,46.10],[8.45,46.25],[8.08,46.27],[7.86,45.92],
  [7.04,45.93],[6.80,46.13],[6.80,46.39],[6.52,46.45],[6.24,46.31],[6.10,46.15]];
// the lakes, each along its middle line and its widest, in km on the map's scale (about 5.7 px a km), so each keeps its shape
const GR_LAKES=[[[6.15,46.21],[6.30,46.33],[6.50,46.42],[6.63,46.46],[6.80,46.43],[6.92,46.39]],[[6.64,46.79],[6.80,46.88],[6.92,46.95],[7.04,47.01]],[[7.11,47.08],[7.24,47.14]],
  [[8.54,47.35],[8.70,47.25],[8.85,47.21],[8.98,47.19]],[[8.31,47.05],[8.42,47.01],[8.52,46.99],[8.60,46.95],[8.61,46.89]],[[8.41,46.99],[8.32,46.96]],
  [[7.63,46.73],[7.75,46.68],[7.84,46.67]],[[7.90,46.71],[8.05,46.76]],[[8.48,47.20],[8.49,47.12]],[[9.04,47.77],[9.25,47.65],[9.45,47.57],[9.66,47.51]]];
const GR_LAKEW=[70,40,22,16,18,12,20,16,24,70];
// a lake: a soft shape along its middle line, widest in the middle and narrowing to each end, pale with a darker shore
function gr_lake(c,L,wd){let P=L.map(q=>GR_P(q[0],q[1]));
  for(let it=0;it<2;it++){const Q=[P[0]];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];Q.push([a[0]*0.75+b[0]*0.25,a[1]*0.75+b[1]*0.25],[a[0]*0.25+b[0]*0.75,a[1]*0.25+b[1]*0.75]);}Q.push(P[P.length-1]);P=Q;}
  const N=48,A=[],B=[];for(let i=0;i<=N;i++){const s=i/N,q=gr_along(P,s),hw=wd/2*(0.18+0.82*Math.pow(Math.sin(Math.PI*s),0.6));
    A.push([q.x-Math.sin(q.an)*hw,q.y+Math.cos(q.an)*hw]);B.push([q.x+Math.sin(q.an)*hw,q.y-Math.cos(q.an)*hw]);}
  c.beginPath();A.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));for(let i=B.length-1;i>=0;i--)c.lineTo(B[i][0],B[i][1]);c.closePath();
  c.fillStyle=rgba(GR_K.lake,1);c.fill();c.strokeStyle=rgba(GR_K.lakeDk,0.9);c.lineWidth=2.5;c.stroke();}
AG_PLACES.grMap=c=>{const k=0.25,w=W*k,h=H*k,img=c.createImageData(w,h),d=img.data,B=GR_K.land;
  // the relief: the Alps rise south of a line from Lake Geneva to Lake Walen; the Jura's folds run north-east in the north-west
  const hgt=(X,Y)=>{const [x,y]=[X,Y],alp=sstep(560,760,y+(x-960)*-0.16),jura=Math.max(0,1-Math.abs((y-(560-(x-300)*0.95))/150))*sstep(120,420,x)*(1-sstep(900,1080,x));
    const n=LP_NZ.fbm(x*0.006,y*0.006,4),r=1-Math.abs(2*LP_NZ.fbm(x*0.004+3,y*0.004+7,4)-1),fold=0.5+0.5*Math.sin((x*0.70+y*0.72)*0.05+LP_NZ.fbm(x*0.003,y*0.003,2)*3);
    return alp*(0.6*r+0.4*n)*1.0+jura*fold*0.35+n*0.06;};
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=i/k,Y=j/k,e=2/k,dz=hgt(X+e,Y)-hgt(X-e,Y)+(hgt(X,Y+e)-hgt(X,Y-e))*0.5,hh=hgt(X,Y);
    const L=-dz*160+hh*-10,q=(j*w+i)*4;d[q]=B[0]+L;d[q+1]=B[1]+L*0.97;d[q+2]=B[2]+L*0.92-hh*6;d[q+3]=255;}
  const cv=mkCanvas(w,h);cv.getContext("2d").putImageData(img,0,0);c.save();c.imageSmoothingQuality="high";c.drawImage(cv,0,0,w,h,0,0,W,H);c.restore();
  // outside the border, a little greyer: the frame less the country
  const BP=GR_BORDER.concat(GR_BORDER_S).map(q=>GR_P(q[0],q[1]));c.save();c.beginPath();c.rect(-50,-50,W+100,H+100);BP.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();
  c.fillStyle=rgba(GR_K.abroad,0.62);c.fill("evenodd");c.restore();
  c.save();c.setLineDash([3,9]);c.lineCap="round";c.strokeStyle=rgba(LP.mut,0.55);c.lineWidth=3;c.beginPath();BP.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();c.restore();
  // the lakes, soft and pale
  GR_LAKES.forEach((L,i)=>gr_lake(c,L,GR_LAKEW[i]));
  lp_grain(c,0,0,W,H,1.6,43);
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.08));g.addColorStop(1,rgba([255,236,200],0.06));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W*0.5,H*0.45,H*0.4,W*0.5,H*0.45,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.16));c.fillStyle=g;c.fillRect(0,0,W,H);};
// the main lines, graphite; o.a, o.only (a list of keys), o.lw
function gr_lines(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  for(const k of Object.keys(GR_LINE)){if(o.only&&!o.only.includes(k))continue;const thin=["bl","bt","lg","zs","zc","lgot"].includes(k);
    ctx.strokeStyle="rgba(250,247,240,0.8)";ctx.lineWidth=(thin?4:6)+5;gr_path(ctx,gr_pts(k));ctx.stroke();
    ctx.strokeStyle=rgba(GR_K.line,thin?0.6:0.9);ctx.lineWidth=thin?4:6;gr_path(ctx,gr_pts(k));ctx.stroke();}
  ctx.restore();}
// a line or part of one in colour, drawn to u: o.dash, o.lw, o.off (px to one side, for a new line beside the old)
function gr_mark(ctx,pts,u,col,o){o=o||{};u=clamp(u,0,1);if(u<=0.004)return;ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.lineCap="round";ctx.lineJoin="round";
  let P=pts;if(o.off){P=pts.map((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],an=Math.atan2(b[1]-a[1],b[0]-a[0]);return[p[0]-Math.sin(an)*o.off,p[1]+Math.cos(an)*o.off];});}
  if(o.dash)ctx.setLineDash(o.dash);ctx.strokeStyle="rgba(250,247,240,0.85)";ctx.lineWidth=(o.lw||9)+5;gr_path(ctx,P,0,u);ctx.stroke();
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||9;gr_path(ctx,P,0,u);ctx.stroke();ctx.restore();}
// a city: a dot, and its name on a pale halo; a hub, a ring round it (o.hub 0 to 1, o.hubCol)
function gr_city(ctx,id,o){o=o||{};const C=GR_CITY[id],a=o.a==null?1:o.a;if(a<=0.004)return;const [x,y]=C.p;ctx.save();ctx.globalAlpha*=a;
  if(o.hub>0.004){const r=24*ag_spr(o.hub,0,0.5);ctx.fillStyle="rgba(250,247,240,0.9)";ctx.beginPath();ctx.arc(x,y,r+4,0,TAU);ctx.fill();ctx.strokeStyle=rgba(o.hubCol||LP.blue,1);ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();}
  ctx.fillStyle="rgba(250,247,240,1)";ctx.beginPath();ctx.arc(x,y,12,0,TAU);ctx.fill();ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();
  if(o.label!==false){const [dx,dy,al]=C.lab,tw=lp_tw(ctx,C.n,{w:800,size:32}),lx=al==="right"?x+dx-tw:al==="center"?x+dx-tw/2:x+dx,ly=y+dy;
    ctx.fillStyle="rgba(250,247,240,0.82)";rr(ctx,lx-10,ly-30,tw+20,40,8);ctx.fill();lp_T(ctx,C.n,x+dx,ly,{w:800,size:32,align:al});}
  ctx.restore();}
function gr_cities(ctx,o){o=o||{};for(const id of Object.keys(GR_CITY))gr_city(ctx,id,{a:o.a,hub:o.hub&&GR_HUBS.includes(id)?o.hub:0,hubCol:o.hubCol&&o.hubCol[id]});}
// Rail 2000's four new lines, as planned, schematic and dashed blue beside the old ones: Bern to Olten (Mattstetten to Rothrist, the one
// the first stage kept), Basel to Olten, Lausanne to Fribourg, Zürich's airport to Winterthur
const GR_NEW={bo:[GR_P(7.52,47.03),GR_P(7.70,47.15),GR_P(7.88,47.30)],bao:[GR_P(7.64,47.53),GR_P(7.80,47.44),GR_P(7.88,47.36)],
  lb:[GR_P(6.89,46.62),GR_P(7.02,46.72),GR_P(7.13,46.79)],zw:[GR_P(8.56,47.45),GR_P(8.65,47.49),GR_P(8.73,47.50)]};
// the fast lines of the 1970s across the country, as one plan: west to east, and north to south
const GR_FAST=[[GR_P(6.10,46.26),GR_P(6.63,46.52),GR_P(7.45,46.95),GR_P(8.54,47.38),GR_P(9.40,47.43)],[GR_P(7.59,47.56),GR_P(7.90,47.35),GR_P(8.31,47.05),GR_P(8.62,46.70)]];
// trains meeting at the hubs: on every line into a hub, a train runs in over the first part of p (0 to 1), waits at the hub through the
// hour (0.42 to 0.58), and leaves along the line again
function gr_trains(ctx,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(const k of Object.keys(GR_LINE)){const L=GR_LINE[k],P=gr_pts(k);for(const end of [0,1]){const id=end?L[L.length-1]:L[0];if(typeof id!=="string"||!GR_HUBS.includes(id))continue;
    const d=p<0.42?ag_sine(1-p/0.42)*0.5:p<0.58?0:ag_sine((p-0.58)/0.42)*0.5,q=gr_along(P,end?1-d-0.035:d+0.035);
    ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.an);ctx.fillStyle="rgba(250,247,240,0.95)";rr(ctx,-25,-11,50,22,11);ctx.fill();ctx.fillStyle=rgba(o.col||LP.blue,1);rr(ctx,-21,-7,42,14,7);ctx.fill();ctx.restore();}}
  ctx.restore();}
// Bern's platforms at the half hour, as a plan on a sheet: six tracks, trains running in from both sides until every track holds one
// (u 0 to 1), then people crossing between them (v 0 to 1). (x, y) the sheet's top left, w wide; o.a, o.k
function gr_bern(ctx,x,y,w,u,v,o){o=o||{};const h=w*0.62,a=o.a==null?1:o.a;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:null,pin:false,col:LP.green});lp_T(ctx,"BERN, EVERY HALF HOUR",x+36,y+66,{w:800,size:28,ls:3,col:LP.green});
  const x0=x+50,x1=x+w-50,t0=y+110,gap=(h-150)/6;
  for(let i=0;i<6;i++){const ty=t0+i*gap+gap/2;ctx.strokeStyle=rgba(GR_K.line,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,ty);ctx.lineTo(x1,ty);ctx.stroke();
    if(i%2===0){ctx.fillStyle=rgba(GR_K.stone,0.55);ctx.fillRect(x0+40,ty+gap*0.18,x1-x0-80,gap*0.64);}
    const from=i%2?1:-1,f=ag_sine(clamp(u*1.6-i*0.12,0,1)),len=(x1-x0)*0.62,cx=lerp(from>0?x1+len*0.6:x0-len*0.6,(x0+x1)/2,f);
    ctx.save();ctx.beginPath();ctx.rect(x0-6,y,x1-x0+12,h);ctx.clip();ctx.fillStyle=rgba(LP.blue,f>0.98?1:0.85);rr(ctx,cx-len/2,ty-9,len,18,9);ctx.fill();ctx.restore();}
  // people crossing: small dots from one platform to another
  if(v>0.004){const R=ag_rnd(30);for(let k=0;k<18;k++){const i0=(R()*3|0)*2,i1=((i0/2+1+(R()*2|0))%3)*2,px=lerp(x0+70,x1-70,R()),ph=clamp(v*1.4-R()*0.4,0,1);
      const ya=t0+i0*gap+gap/2+gap*0.5,yb=t0+i1*gap+gap/2+gap*0.5,py=lerp(ya,yb,ag_sine(ph));ctx.fillStyle=rgba(LP.ink,0.8*clamp(ph*4,0,1)*clamp((1-ph)*4+0.4,0,1));ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();}}
  ctx.restore();return{x,y,w,h};}
