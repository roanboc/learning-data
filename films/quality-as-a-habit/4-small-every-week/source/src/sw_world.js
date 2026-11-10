/* ===== Small, every week: Mexico's wheat, 1945 to 1963 =====
   The opening's own places and pictures, painted in the module's light (from a window on the right, here the sun on the right) and
   in its matte language, all prefixed sw_ / SW_:
     places, painted once: the highlands near Mexico City in summer, a field of wheat under a high sky, a broad volcano far off on the
     right ("swField"); the same wheat close up, the field behind it soft ("swStems"); a map of Mexico on paper, its coast and its
     border from Natural Earth's outlines (public domain), its neighbours paler ("swMap"); a page of a field book, for the calendar of
     generations ("swSheet"); and the Yaqui Valley in winter, flat and irrigated to the hills, with a plain wooden table in front
     ("swValley");
     live pieces: the near wheat that stands in front of the people (healthy, ruined by the rust, or ripe), wheat stems close up with
     the rust's spots, a sprig, a seed envelope with its name, a sack of grain, the corner that names the place and the year.
   The rust's red-brown is the rust's own, never the module's red for a check that stops. No flag, no eagle, no sombrero, nothing
   that stands for Mexico: the corner names the place and the year. */

const SWC={sky0:[170,190,206],sky1:[236,228,210],haze:[214,212,204],far:[146,156,168],far2:[170,174,176],plain:[198,190,150],
  tree:[96,104,74],wheat:[188,176,104],wheatHi:[226,208,132],wheatDk:[112,112,62],green:[132,146,84],ripe:[214,180,100],ripeHi:[240,214,150],
  rust:[164,78,38],rustDk:[110,46,22],rustHi:[204,118,66],dead:[150,118,82],paper:[240,232,214],paperDk:[214,204,182],ink:[64,52,40],
  sea:[200,208,206],land:[240,229,204],landN:[220,216,204],coast:[120,104,84],wood:[150,108,70],woodDk:[96,66,42],woodHi:[196,152,104]};

/* ---------------------------------------------------------------- the corner: where and when, at the top left */
function sw_corner(ctx,text,a){if(a<=0.004)return;const s=String(text).toUpperCase(),w=dq_tw(ctx,s,{w:800,size:28,ls:4})+56;
  dq_card(ctx,72,58,w,62,{r:31,a});dq_T(ctx,s,100,100,{w:800,size:28,ls:4,col:DQ.soft,a});}

/* ---------------------------------------------------------------- the highlands near Mexico City, in summer */
const SW_HZ=452;   // the horizon
function sw_sky(c,top,bot,y0,y1,seed){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(top,1));g.addColorStop(1,rgba(bot,1));c.fillStyle=g;c.fillRect(0,y0,W,y1-y0);
  // a few long soft clouds, lit from the right
  const r=ag_rnd(seed||3);for(let i=0;i<7;i++){const x=r()*W,y=y0+40+r()*(y1-y0)*0.55,w=240+r()*420,h=16+r()*26,a=0.32+r()*0.2;sw_soft(c,x,y,w,h*1.6,[255,252,244],a);}}
// a soft blot of colour: an ellipse whose edge fades to nothing (cheap, unlike a blur)
function sw_soft(c,x,y,rx,ry,col,a){c.save();c.translate(x,y);c.scale(rx,ry);const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,rgba(col,a));g.addColorStop(0.55,rgba(col,a*0.6));g.addColorStop(1,rgba(col,0));
  c.fillStyle=g;c.beginPath();c.arc(0,0,1,0,TAU);c.fill();c.restore();}
// a far range: a closed outline [x, y, ...] filled in a haze tone, a little lighter on the side towards the sun
function sw_range(c,pts,col,hiA){c.beginPath();c.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.lineTo(W+20,SW_HZ+30);c.lineTo(-20,SW_HZ+30);c.closePath();
  const g=c.createLinearGradient(0,Math.min(...pts.filter((v,i)=>i%2))-10,0,SW_HZ+30);g.addColorStop(0,rgba(col,1));g.addColorStop(1,rgba(mix(col,SWC.haze,0.55),1));c.fillStyle=g;c.fill();
  if(hiA){c.save();c.clip();const h=c.createLinearGradient(0,0,W,0);h.addColorStop(0,"rgba(255,248,232,0)");h.addColorStop(1,"rgba(255,248,232,"+hiA+")");c.fillStyle=h;c.fillRect(0,0,W,H);c.restore();}}
function sw_paintField(c){c.fillStyle=rgba(SWC.sky1,1);c.fillRect(0,0,W,H);sw_sky(c,SWC.sky0,SWC.sky1,0,SW_HZ,5);
  // the sun's warmth on the right of the sky
  dq_pool(c,1820,120,900,[255,236,200],0.22,0.7);
  // a broad volcano far off on the right, its top flat and worn, and a low range on the left
  sw_range(c,[880,SW_HZ-6,1010,SW_HZ-46,1130,SW_HZ-104,1236,SW_HZ-172,1300,SW_HZ-206,1352,SW_HZ-214,1410,SW_HZ-210,1470,SW_HZ-190,1560,SW_HZ-142,1680,SW_HZ-92,1800,SW_HZ-60,1940,SW_HZ-40],SWC.far,0.14);
  sw_range(c,[-20,SW_HZ-70,120,SW_HZ-96,260,SW_HZ-84,380,SW_HZ-60,520,SW_HZ-52,660,SW_HZ-30,820,SW_HZ-14,940,SW_HZ-4],SWC.far2,0.08);
  // the plain: bands of fields to the horizon, a line of trees, then the field in front
  const nz=dq_noise(71);
  dq_field(c,0,SW_HZ-4,W,H-SW_HZ+4,2,(px,py,out)=>{const u=(py-SW_HZ)/(H-SW_HZ),band=nz(px/900,u*14,2),m=nz(px/260,py/60,3),
      base=u<0.22?mix(SWC.plain,u%0.05<0.025?[178,170,120]:[206,192,148],0.5+0.5*(band-0.5)):mix(SWC.wheat,SWC.wheatDk,0.25+0.35*u),k=0.92+0.12*m+0.05*sstep(0,W,px);
    out[0]=base[0]*k;out[1]=base[1]*k;out[2]=base[2]*k;});
  // a haze over the far plain
  let g=c.createLinearGradient(0,SW_HZ-8,0,SW_HZ+90);g.addColorStop(0,"rgba(232,228,214,0.75)");g.addColorStop(1,"rgba(232,228,214,0)");c.fillStyle=g;c.fillRect(0,SW_HZ-8,W,98);
  // a line of trees along a far ditch
  const r=ag_rnd(17);for(let k=0;k<11;k++){const cx=80+k*170+r()*90,n=2+Math.floor(r()*4);for(let i=0;i<n;i++){const x=cx+i*(9+r()*12),y=SW_HZ+20+r()*6,rx=7+r()*9,ry=7+r()*8;
    ag_soft(c,cc=>cc.ellipse(x,y-ry*0.4,rx,ry,0,0,TAU),mix(SWC.tree,SWC.haze,0.42),mix(SWC.tree,[230,226,200],0.55),x+rx*0.4,y-ry,rx*1.4,null);}}
  // the field: far wheat as fine strokes, nearer and taller as it comes down
  sw_strokes(c,SW_HZ+40,H,{seed:23,n:9000,col:SWC.wheat,hi:SWC.wheatHi,dk:SWC.wheatDk});}
// rows of wheat seen across a field, from y0 to y1: strokes that grow taller and further apart as they come nearer
function sw_strokes(c,y0,y1,o){const r=ag_rnd(o.seed||9),n=o.n||6000;c.save();c.lineCap="round";
  for(let i=0;i<n;i++){const u=Math.pow(r(),0.75),y=lerp(y0,y1,u),h=lerp(4,46,u)*(0.7+r()*0.5),x=r()*W,lean=(r()-0.5)*h*0.25,k=r();
    const col=k<0.55?o.col:k<0.8?o.hi:o.dk;c.strokeStyle=rgba(col,0.5+0.35*u);c.lineWidth=lerp(0.7,2.4,u);c.beginPath();c.moveTo(x,y);c.lineTo(x+lean,y-h);c.stroke();
    if(u>0.35&&r()<0.5){c.fillStyle=rgba(mix(col,o.hi,0.4),0.75);c.beginPath();c.ellipse(x+lean,y-h,lerp(1,3.2,u),lerp(2.2,8,u),Math.atan2(lean,h),0,TAU);c.fill();}}
  c.restore();}
AG_PLACES.swField=c=>sw_paintField(c);

/* ---------------------------------------------------------------- the near wheat, in front of the people
   A band of wheat W wide and 520 tall, its heads along the top: painted once for each state ("healthy", "rust": the rust's red-brown,
   stems bent and the heads thin, "ripe": gold), and laid over the people standing in it (o.covered) at sw_near(ctx, state, y, t, a),
   swaying a little in the wind. */
function sw_band(state){return ag_kept("swBand:"+state,W+80,520,(c,w,h)=>{const r=ag_rnd(state==="rust"?41:state==="ripe"?43:37),
    col=state==="rust"?SWC.dead:state==="ripe"?SWC.ripe:SWC.wheat,hi=state==="rust"?SWC.rustHi:state==="ripe"?SWC.ripeHi:SWC.wheatHi,dk=state==="rust"?SWC.rustDk:SWC.wheatDk;
  // the body of the field: dense below, so nothing shows through
  let g=c.createLinearGradient(0,90,0,h);g.addColorStop(0,rgba(mix(col,dk,0.3),0));g.addColorStop(0.18,rgba(mix(col,dk,0.35),1));g.addColorStop(1,rgba(mix(col,dk,0.6),1));c.fillStyle=g;c.fillRect(0,90,w,h-90);
  c.lineCap="round";const bent=state==="rust";
  for(let i=0;i<1500;i++){const x=r()*w,base=h,top=60+r()*120+(bent?r()*120:0),lean=(r()-0.5)*40+(bent?(r()<0.5?-1:1)*r()*90:0),k=r(),cc=k<0.5?col:k<0.78?hi:dk;
    c.strokeStyle=rgba(cc,0.92);c.lineWidth=1.6+r()*1.6;c.beginPath();c.moveTo(x,base);c.quadraticCurveTo(x+lean*0.3,(base+top)/2,x+lean,top);c.stroke();
    // the head: plump, or thin and dark where the rust has been
    const hl=bent?9+r()*8:15+r()*10,hw=bent?2.4:4.2,an=Math.atan2(lean,base-top)*0.8;c.save();c.translate(x+lean,top);c.rotate(an);
    c.fillStyle=rgba(bent?mix(SWC.rustDk,SWC.dead,0.5):mix(cc,hi,0.35),1);c.beginPath();c.ellipse(0,-hl/2,hw,hl/2,0,0,TAU);c.fill();
    if(!bent){c.strokeStyle=rgba(mix(cc,[255,250,230],0.4),0.7);c.lineWidth=0.9;c.beginPath();c.moveTo(0,-hl);c.lineTo(0,-hl-12-r()*8);c.stroke();}
    // the rust's spots on a ruined stem
    if(bent&&r()<0.7){c.restore();c.fillStyle=rgba(SWC.rust,0.9);for(let q=0;q<3;q++){const v=0.3+r()*0.6;c.beginPath();c.ellipse(lerp(x,x+lean,v),lerp(base,top,v),1.6,4,an,0,TAU);c.fill();}continue;}
    c.restore();}
  // light from the right along the tops
  c.globalCompositeOperation="source-atop";g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,"rgba(255,246,224,0)");g.addColorStop(1,"rgba(255,246,224,0.16)");c.fillStyle=g;c.fillRect(0,0,w,h);c.globalCompositeOperation="source-over";});}
function sw_near(ctx,state,y,t,a){if(a<=0.004)return;const b=sw_band(state),sway=Math.sin(t*0.9)*6+Math.sin(t*2.3)*2;ctx.save();ctx.globalAlpha*=a;ctx.drawImage(b,-40+sway,y,W+80,520);ctx.restore();}

/* ---------------------------------------------------------------- stems close up
   The field behind, soft, as the place; the stems drawn live in front: sw_stem(ctx, x, y, h, o) from the ground at (x, y), h tall,
   with its head and two leaves; o.rust (0 to 1: the spots come out along it, a few at a time), o.weak (0 to 1: it bends), o.shrivel
   (0 to 1: the head thins and darkens), o.lean (radians), o.ripe (0 to 1: gold), o.a, o.s (thickness). */
function sw_paintStems(c){const nz=dq_noise(83);
  dq_field(c,0,0,W,H,4,(px,py,out)=>{const u=py/H,m=nz(px/380,py/380,3),f=nz(px/90,py/140,2),sky=mix([214,218,206],[236,226,196],sstep(0,600,px)),
      wheat=mix(SWC.wheatHi,SWC.wheatDk,0.25+0.5*f),base=mix(sky,wheat,sstep(0.22,0.5,u+0.08*(m-0.5))),k=0.9+0.16*m;
    out[0]=base[0]*k;out[1]=base[1]*k;out[2]=base[2]*k;});
  // soft heads of wheat further back, out of focus
  const r=ag_rnd(29);for(let i=0;i<90;i++){const x=r()*W,y=240+r()*520,z=10+r()*20;sw_soft(c,x,y,z*0.7,z*2.2,mix(SWC.wheatHi,SWC.wheat,r()),0.45);}
  dq_pool(c,1700,200,800,[255,236,200],0.2,0.8);}
AG_PLACES.swStems=c=>sw_paintStems(c);
function sw_stem(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const s=o.s||1,rust=clamp(o.rust||0,0,1),weak=clamp(o.weak||0,0,1),shr=clamp(o.shrivel||0,0,1),ripe=clamp(o.ripe||0,0,1),
    lean=(o.lean||0)+weak*0.18,seed=o.seed||7;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);
  // the stem: a cubic from the ground, bending over as it weakens
  const tip=[Math.sin(lean)*h+weak*h*0.16,-Math.cos(lean)*h*(1-0.2*weak)],c1=[0,-h*0.42],c2=[Math.sin(lean)*h*0.7,-h*(0.86-0.1*weak)];
  const P=u=>{const v=1-u;return[3*v*v*u*c1[0]+3*v*u*u*c2[0]+u*u*u*tip[0],3*v*v*u*c1[1]+3*v*u*u*c2[1]+u*u*u*tip[1]];};
  const green=mix(mix(SWC.green,SWC.ripe,ripe),SWC.dead,weak*0.6+shr*0.3),lw=9*s;
  // two leaves, low on the stem
  for(const [u,sd] of [[0.22,-1],[0.4,1]]){const p=P(u),d=sd*(60+40*u)*s;ctx.fillStyle=rgba(mix(green,[90,96,52],0.25),1);ctx.beginPath();ctx.moveTo(p[0],p[1]);
    ctx.quadraticCurveTo(p[0]+d*0.6,p[1]-30*s,p[0]+d,p[1]+(10+weak*40)*s);ctx.quadraticCurveTo(p[0]+d*0.5,p[1]-8*s,p[0],p[1]+10*s);ctx.closePath();ctx.fill();}
  ctx.strokeStyle=rgba(green,1);ctx.lineCap="round";ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(c1[0],c1[1],c2[0],c2[1],tip[0],tip[1]);ctx.stroke();
  // a lighter edge on the side towards the sun
  ctx.strokeStyle=rgba(mix(green,[255,250,226],0.4),0.7);ctx.lineWidth=lw*0.3;ctx.beginPath();ctx.moveTo(lw*0.25,0);ctx.bezierCurveTo(c1[0]+lw*0.25,c1[1],c2[0]+lw*0.25,c2[1],tip[0]+lw*0.25,tip[1]);ctx.stroke();
  // the rust's spots: long, narrow, brick-red pustules along the stem, a few at a time, then many, in streaks
  if(rust>0){const r=ag_rnd(seed);for(let i=0;i<34;i++){const u=0.1+r()*0.8,show=clamp(rust*1.7-i/34*0.7,0,1);if(show<=0)continue;const p=P(u),side=(r()-0.5)*lw*0.7,an=lean*u*0.8+(r()-0.5)*0.12;
    ctx.fillStyle=rgba(SWC.rustDk,0.5*show);ctx.beginPath();ctx.ellipse(p[0]+side,p[1]+1.5*s,2.6*s,10*s,an,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(SWC.rust,show);ctx.beginPath();ctx.ellipse(p[0]+side,p[1],2*s,8.4*s,an,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(SWC.rustHi,0.7*show);ctx.beginPath();ctx.ellipse(p[0]+side+0.6*s,p[1]-2*s,0.7*s,3.6*s,an,0,TAU);ctx.fill();}}
  // the head: spikelets alternating along it, tapering to the tip, each with its whisker; thin and dark as it shrivels
  ctx.translate(tip[0],tip[1]);ctx.rotate(lean+weak*1.9);const n=12,hl=118*s*(1-0.2*shr),gw=13*s*(1-0.45*shr),
    head=mix(mix(mix(SWC.wheatHi,SWC.ripe,ripe),SWC.wheat,0.25),SWC.rustDk,shr*0.75);
  ctx.strokeStyle=rgba(mix(head,green,0.4),1);ctx.lineWidth=2.4*s;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-hl);ctx.stroke();
  for(let i=0;i<n;i++){const u=i/(n-1),sd=i%2?-1:1,yy=-6*s-u*hl*0.92,tw=gw*(1-0.42*u*u),ry=hl/n*0.95;
    if(shr<0.6){ctx.strokeStyle=rgba(mix(head,[255,250,230],0.5),0.75*(1-shr/0.6));ctx.lineWidth=1.1*s;ctx.beginPath();ctx.moveTo(sd*tw*0.9,yy-ry*0.6);ctx.lineTo(sd*(tw*0.9+16*s),yy-ry*0.6-40*s);ctx.stroke();}
    ctx.fillStyle=rgba(mix(head,[120,100,50],0.18),1);ctx.beginPath();ctx.ellipse(sd*tw*0.42,yy+1.5*s,tw*0.62,ry,sd*0.42,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(head,1);ctx.beginPath();ctx.ellipse(sd*tw*0.4,yy,tw*0.56,ry*0.9,sd*0.42,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(mix(head,[255,250,232],0.4),0.7);ctx.beginPath();ctx.ellipse(sd*tw*0.4+tw*0.16,yy-ry*0.3,tw*0.16,ry*0.45,sd*0.42,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- the map of Mexico
   Natural Earth's outlines (1:110m, public domain), projected once into the frame (equirectangular, its scale true at 23° N, 40 px a
   degree of latitude): Mexico, and its neighbours paler. SW_MAP_AT(lon, lat) is a point on it. */
// a point on the map, from longitude and latitude
const SW_MAP_AT=(lon,lat)=>[960+(lon+101.5)*40*Math.cos(23/180*Math.PI),540-(lat-21.95)*40];
function sw_path(c,pts){c.beginPath();c.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.closePath();}
function sw_paintMap(c){const nz=dq_noise(97);
  // the sea: paper a little darker, with fine level lines, the old way of drawing water
  dq_field(c,0,0,W,H,3,(px,py,out)=>{const m=nz(px/500,py/500,3),k=0.95+0.07*m+0.04*sstep(0,W,px);out[0]=SWC.sea[0]*k;out[1]=SWC.sea[1]*k;out[2]=SWC.sea[2]*k;});
  c.strokeStyle="rgba(120,110,92,0.12)";c.lineWidth=1.2;for(let y=12;y<H;y+=12){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the neighbours: pale land, no names
  for(const p of SW_LAND){sw_path(c,p);c.fillStyle=rgba(SWC.landN,1);c.fill();}
  // Mexico: warm paper, a soft shadow inside its coast, its coast a fine ink line
  c.save();c.shadowColor="rgba(80,64,44,0.28)";c.shadowBlur=18;c.shadowOffsetX=-5;c.shadowOffsetY=7;sw_path(c,SW_MEX);c.fillStyle=rgba(SWC.land,1);c.fill();c.restore();
  c.save();sw_path(c,SW_MEX);c.clip();dq_field(c,380,100,1130,750,3,(px,py,out)=>{const m=nz(px/300,py/300,3),k=0.96+0.06*m;out[0]=SWC.land[0]*k;out[1]=SWC.land[1]*k;out[2]=SWC.land[2]*k;});c.restore();
  // the neighbours' coasts and the borders, quieter
  c.lineJoin="round";for(const p of SW_LAND){sw_path(c,p);c.strokeStyle="rgba(120,104,84,0.42)";c.lineWidth=1.4;c.stroke();}
  sw_path(c,SW_MEX);c.strokeStyle=rgba(SWC.coast,0.9);c.lineWidth=2.2;c.stroke();
  // light from the right over the whole sheet
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(60,48,32,0.06)");g.addColorStop(1,"rgba(255,248,232,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.swMap=c=>sw_paintMap(c);

/* ---------------------------------------------------------------- a page of a field book, for the calendar of generations */
function sw_paintSheet(c){const nz=dq_noise(101);
  dq_field(c,0,0,W,H,2,(px,py,out)=>{const m=nz(px/420,py/420,3),f=nz(px/60,py/60,2),k=0.95+0.06*m+0.025*(f-0.5)+0.04*sstep(0,W,px)-0.04*sstep(700,1080,py);
    out[0]=SWC.paper[0]*k;out[1]=SWC.paper[1]*k;out[2]=SWC.paper[2]*k;});
  c.strokeStyle="rgba(120,104,84,0.1)";c.lineWidth=1.2;for(let x=48;x<W;x+=48){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=36;y<H;y+=48){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  dq_pool(c,1760,140,900,[255,240,210],0.14,0.8);}
AG_PLACES.swSheet=c=>sw_paintSheet(c);

/* ---------------------------------------------------------------- the Yaqui Valley in winter, with a plain wooden table
   Flat land to low hills, an irrigation canal running straight away from us, fields in parcels; the low winter sun on the right; and a
   table of plain boards along the bottom of the frame, where people stand behind it, cut at its back edge (SW_TABLE.back). */
const SW_TABLE={back:806,front:880},SW_VALLEY={k:12200,f:1000};   // the ground: a point py px below the horizon is k/py metres away
function sw_paintValley(c){c.fillStyle=rgba(SWC.sky1,1);c.fillRect(0,0,W,H);const hz=470;
  sw_sky(c,[184,198,206],[240,230,212],0,hz,9);dq_pool(c,1880,260,800,[255,226,180],0.22,0.6);
  // low hills far off, a Sierra in the haze
  c.save();const hill=[[-20,hz-34],[200,hz-60],[420,hz-48],[640,hz-70],[900,hz-52],[1100,hz-80],[1320,hz-64],[1560,hz-96],[1760,hz-72],[1940,hz-84]];
  c.beginPath();c.moveTo(-20,hz+10);for(const p of hill)c.lineTo(p[0],p[1]);c.lineTo(1940,hz+10);c.closePath();const g=c.createLinearGradient(0,hz-100,0,hz+10);g.addColorStop(0,"rgba(158,160,170,1)");g.addColorStop(1,"rgba(206,204,198,1)");c.fillStyle=g;c.fill();c.restore();
  // the flat valley, seen from a person's height: parcels of young wheat, wheat in rows, ploughed and fallow earth, each a rectangle on
  // the ground, so they narrow and crowd towards the horizon; field roads between them; rows within them where they're near enough to see
  const nz=dq_noise(113),Z=py=>SW_VALLEY.k/Math.max(0.5,py-hz),crops=[[132,146,82],[156,158,94],[170,148,112],[184,170,128],[124,140,80],[160,150,100]];
  dq_field(c,0,hz,W,SW_TABLE.back+6-hz,1,(px,py,out)=>{const z=Z(py),X=(px-960)*z/SW_VALLEY.f,i=Math.floor(X/120+500),j=Math.floor(z/170),hsh=((i*73856093)^(j*19349663))>>>0,
      cr=crops[hsh%crops.length],fx=((X/120+500)%1+1)%1,fz=(z/170)%1,lane=Math.min(fx,1-fx)*120<3.2||Math.min(fz,1-fz)*170<4,
      rows=Math.sin(X/1.6*TAU)*0.05*clamp(1-z/150,0,1),m=nz(px/300,py/60,3),far=sstep(200,2400,z),
      base=lane?[196,182,148]:cr,k=(0.9+0.12*m+rows)*(1+0.05*sstep(0,W,px));
    const b=mix(base,[206,202,190],far*0.75);out[0]=b[0]*k;out[1]=b[1]*k;out[2]=b[2]*k;});
  let h=c.createLinearGradient(0,hz-6,0,hz+120);h.addColorStop(0,"rgba(236,230,216,0.8)");h.addColorStop(1,"rgba(236,230,216,0)");c.fillStyle=h;c.fillRect(0,hz-6,W,126);
  // the canal: a straight line of still water on the ground, X from 12 to 18 m, running to the horizon, the sky's light in it, its banks raised
  const at=(X,py)=>960+X*SW_VALLEY.f/Z(py),y1=SW_TABLE.back+4;
  c.beginPath();c.moveTo(at(10.6,hz+1.5),hz+1.5);c.lineTo(at(19.4,hz+1.5),hz+1.5);c.lineTo(at(19.4,y1),y1);c.lineTo(at(10.6,y1),y1);c.closePath();c.fillStyle="rgba(176,160,120,1)";c.fill();
  c.beginPath();c.moveTo(at(12,hz+1.5),hz+1.5);c.lineTo(at(18,hz+1.5),hz+1.5);c.lineTo(at(18,y1),y1);c.lineTo(at(12,y1),y1);c.closePath();
  const wg=c.createLinearGradient(0,hz,0,y1);wg.addColorStop(0,"rgba(222,228,226,1)");wg.addColorStop(1,"rgba(176,190,192,1)");c.fillStyle=wg;c.fill();
  c.strokeStyle="rgba(96,90,70,0.45)";c.lineWidth=1.6;c.beginPath();c.moveTo(at(12,hz+1.5),hz+1.5);c.lineTo(at(12,y1),y1);c.moveTo(at(18,hz+1.5),hz+1.5);c.lineTo(at(18,y1),y1);c.stroke();
  // a few small trees along the canal's far reaches
  const r=ag_rnd(131);for(let k=0;k<9;k++){const z=260+k*k*120+r()*60,py=hz+SW_VALLEY.k/z,x=at(21+r()*4,py),s=clamp(1400/z,1.2,14);
    ag_soft(c,cc=>cc.ellipse(x,py-s*1.6,s*1.1,s*1.6,0,0,TAU),mix(SWC.tree,SWC.haze,0.3+0.4*sstep(300,3000,z)),mix(SWC.tree,[230,226,200],0.55),x+s*0.4,py-s*2.4,s*2,null);}
  // the table: plain boards, its top seen a little from above; its front edge; under it, the trestles and the ground in shade
  const T=SW_TABLE;c.fillStyle="rgba(96,78,56,1)";c.fillRect(0,T.front,W,H-T.front);let tg=c.createLinearGradient(0,T.front,0,H);tg.addColorStop(0,"rgba(40,28,16,0.55)");tg.addColorStop(1,"rgba(40,28,16,0.25)");c.fillStyle=tg;c.fillRect(0,T.front,W,H-T.front);
  for(const lx of [150,1730]){c.fillStyle=rgba(SWC.woodDk,1);c.fillRect(lx,T.front+20,40,H-T.front-20);c.fillStyle="rgba(255,236,206,0.12)";c.fillRect(lx+30,T.front+20,6,H-T.front-20);}
  tg=c.createLinearGradient(0,T.back,0,T.front);tg.addColorStop(0,rgba(SWC.woodHi,1));tg.addColorStop(1,rgba(SWC.wood,1));c.fillStyle=tg;c.fillRect(0,T.back,W,T.front-T.back);
  c.strokeStyle="rgba(80,54,32,0.35)";c.lineWidth=2;for(const y of [T.back+24,T.back+50]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  c.strokeStyle="rgba(110,76,46,0.25)";c.lineWidth=1.2;for(let i=0;i<60;i++){const y=T.back+4+r()*(T.front-T.back-8),x=r()*W;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+80,y-2,x+160,y+2,x+240+r()*200,y);c.stroke();}
  c.fillStyle="rgba(255,240,214,0.35)";c.fillRect(0,T.back,W,2);
  tg=c.createLinearGradient(0,T.front,0,T.front+30);tg.addColorStop(0,rgba(SWC.wood,1));tg.addColorStop(1,rgba(SWC.woodDk,1));c.fillStyle=tg;c.fillRect(0,T.front,W,30);c.fillStyle="rgba(255,236,206,0.3)";c.fillRect(0,T.front,W,1.5);}
AG_PLACES.swValley=c=>sw_paintValley(c);

/* ---------------------------------------------------------------- small things: a sprig, a seed envelope, a sack of grain
   sw_sprig(ctx, x, y, h, o): a small wheat plant standing at (x, y), h tall (o.rust 0 to 1, o.ripe, o.a, o.k: it grows up from the
   ground); sw_envelope(ctx, x, y, w, name, o): a seed envelope, its name typed on it (o.a, o.k, o.angle, o.sub, its second line);
   sw_sack(ctx, x, y, s, o): a sack of grain, tied at the neck. */
function sw_sprig(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a,k=o.k==null?1:o.k;if(a<=0.004||k<=0.01)return;const rust=o.rust||0,ripe=o.ripe||0,col=mix(mix(SWC.green,SWC.ripe,ripe),SWC.dead,rust*0.7);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(k,k);ctx.lineCap="round";
  for(const [dx,lean,hh] of [[-6,-0.22,0.82],[0,0.02,1],[6,0.26,0.86]]){const tx=Math.sin(lean)*h*hh,ty=-Math.cos(lean)*h*hh;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(dx*0.4,0);ctx.quadraticCurveTo(dx,ty*0.5,tx+dx,ty);ctx.stroke();
    const hc=mix(mix(SWC.wheatHi,SWC.ripeHi,ripe),SWC.rustDk,rust*0.6);ctx.save();ctx.translate(tx+dx,ty);ctx.rotate(lean);ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.ellipse(0,-h*0.09,h*0.045,h*0.11,0,0,TAU);ctx.fill();
    if(rust>0){ctx.fillStyle=rgba(SWC.rust,rust);for(let q=0;q<3;q++){ctx.beginPath();ctx.ellipse(-1,h*0.18+q*h*0.12,2.2,4.4,0,0,TAU);ctx.fill();}}ctx.restore();}
  ctx.restore();}
function sw_envelope(ctx,x,y,w,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*1.32;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);if(o.angle)ctx.rotate(o.angle);
  if(o.k!=null){const s=lerp(0.6,1,ag_spr(o.k,0,0.5));ctx.scale(s,s);}ctx.translate(-w/2,-h/2);
  dq_card(ctx,0,0,w,h,{r:5,fill:"rgb(232,216,180)",on:o.on});ctx.strokeStyle="rgba(120,96,60,0.4)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,h*0.18);ctx.lineTo(w/2,h*0.3);ctx.lineTo(w,h*0.18);ctx.stroke();
  sw_sprig(ctx,w*0.5,h*0.86,h*0.36,{ripe:1});
  if(name)dq_T(ctx,name,w/2,h*0.5,{w:700,size:o.size||28,f:"mono",align:"center"});if(o.sub)dq_T(ctx,o.sub,w/2,h*0.5+34,{w:500,size:28,align:"center",col:DQ.soft});ctx.restore();}
// a sack of grain, standing, its base at (x, y): plump and slumped at the bottom, gathered at the neck and tied with a cord, the cloth
// above the tie fanning out; jute's weave in faint rows
function sw_sack(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const jute=[200,172,124],body=cc=>{cc.moveTo(-16,-92);cc.bezierCurveTo(-30,-80,-50,-56,-52,-26);cc.bezierCurveTo(-54,-8,-50,-2,-42,0);cc.bezierCurveTo(-14,6,14,6,42,0);
      cc.bezierCurveTo(50,-2,54,-8,52,-26);cc.bezierCurveTo(50,-56,30,-80,16,-92);cc.closePath();},
    top=cc=>{cc.moveTo(-12,-92);cc.bezierCurveTo(-22,-100,-28,-110,-24,-118);cc.lineTo(-14,-112);cc.lineTo(-6,-120);cc.lineTo(2,-112);cc.lineTo(10,-121);cc.lineTo(17,-112);cc.lineTo(26,-117);
      cc.bezierCurveTo(28,-108,22,-99,12,-92);cc.closePath();};
  ctx.save();ctx.shadowColor="rgba(60,44,28,0.32)";ctx.shadowBlur=12;ctx.shadowOffsetX=-5;ctx.shadowOffsetY=4;ag_shape(ctx,body);ctx.fillStyle=rgba(jute,1);ctx.fill();ctx.restore();
  ag_soft(ctx,body,jute,ag_lt(jute,0.3),24,-60,70,rgba(ag_dk(jute,0.6),0.4),10);
  ctx.save();ag_shape(ctx,body);ctx.clip();ctx.strokeStyle=rgba(ag_dk(jute,0.35),0.22);ctx.lineWidth=1.2;for(let yy=-84;yy<4;yy+=7){ctx.beginPath();ctx.moveTo(-56,yy);ctx.bezierCurveTo(-20,yy+3,20,yy+3,56,yy);ctx.stroke();}
    ctx.strokeStyle=rgba(ag_dk(jute,0.4),0.28);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-10,-86);ctx.bezierCurveTo(-18,-60,-14,-30,-22,-6);ctx.stroke();ctx.restore();
  ag_soft(ctx,top,ag_dk(jute,0.05),ag_lt(jute,0.25),10,-112,30,rgba(ag_dk(jute,0.6),0.4),6);
  ctx.strokeStyle="rgba(96,70,40,0.95)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-16,-92);ctx.bezierCurveTo(-6,-89,6,-89,16,-92);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(12,-90);ctx.bezierCurveTo(20,-80,18,-70,24,-62);ctx.stroke();ctx.restore();}
