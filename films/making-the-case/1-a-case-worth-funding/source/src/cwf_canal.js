/* ===== A case worth funding: New York State, 1816 to 1825 =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix cwf_). Nothing here is a likeness of a real person or a copy of an old picture: the map, the farm, the hall and the cutting
   are drawn plainly, from what is known of the place and the time, in this film's own style, with no ornament borrowed from it.
     cwfMap        New York State from above: the Great Lakes, the Hudson, the Mohawk's valley, hills, and the sea; drawn once, with no
                   word on it (the words and the routes are drawn live, so the legibility check reads them)
     cwf_mapLive   what is drawn over the map: the places' names, the wagon road east (amber: what it cost), the canal's route as a plan
                   (blue, dashed), dug (o.dug, 0 to 1, from the middle out) and open (green), the boat on it, and the Haudenosaunee
                   nations' names on their homelands, in ink
     cwfFarm       a farm at the forest's edge in the west, its wheat cut and stacked, a rough track running east into the trees
     cwfHall       the legislature's hall in Albany: a pale plaster wall between flat pilasters, the sun from tall windows on the right
     cwfCut        the canal being dug: a long cutting through the land, its banks, the spoil, felled trees; cwf_bank is the near bank,
                   drawn live over the diggers' waists
     cwf_freight   a ton moved from Lake Erie to New York, before and after: two bars on a sheet
     cwf_tolls     the tolls adding up, year by year, until they cover what the canal cost: the shape of a payback
     CWF_PEOPLE    a farmer, DeWitt Clinton and two diggers: dressed for their time (a homespun waistcoat; a dark coat and a white
                   neckcloth; linen shirts and braces), never likenesses
   Colour keeps the module's meaning: the canal's plan in blue, the canal open and what got better in green, the cost of the road in amber;
   the land, the water and the people wear none of the five. */

const CWF_K={sky0:[200,212,218],sky1:[242,234,214],land:[216,208,174],landDk:[196,186,150],hill:[170,160,124],water:[172,192,198],waterDk:[150,172,180],
  forest:[90,106,78],forestDk:[62,76,56],wheat:[214,184,112],wheatDk:[178,148,86],earth:[156,122,86],earthDk:[118,90,64],road:[178,152,112],
  stone:[230,224,210],timber:[150,112,78],town:[120,104,92]};

/* ---------------------------------------------------------------- the map */
// x from longitude and y from latitude: 230 px a degree each way, Buffalo at (300, 380); a little wider than true, as a drawn map may be
const cwf_ll=(lon,lat)=>[300+(lon+78.88)*230,380+(42.89-lat)*230];
const CWF_PL={buffalo:cwf_ll(-78.88,42.89),lockport:cwf_ll(-78.69,43.17),rochester:cwf_ll(-77.61,43.16),syracuse:cwf_ll(-76.15,43.05),
  rome:cwf_ll(-75.46,43.21),utica:cwf_ll(-75.23,43.10),schenectady:cwf_ll(-73.94,42.81),albany:cwf_ll(-73.75,42.65),nyc:cwf_ll(-74.00,40.71)};
// the canal's line, west to east, through the towns it made or met
const CWF_ROUTE=[CWF_PL.buffalo,CWF_PL.lockport,cwf_ll(-78.2,43.2),CWF_PL.rochester,cwf_ll(-77.0,43.08),cwf_ll(-76.7,43.02),CWF_PL.syracuse,
  cwf_ll(-75.75,43.12),CWF_PL.rome,CWF_PL.utica,cwf_ll(-74.86,43.04),cwf_ll(-74.19,42.94),CWF_PL.schenectady,CWF_PL.albany];
// the road the wagons took before it: east from Buffalo along the ridges, rougher and a little south
const CWF_ROAD=[CWF_PL.buffalo,cwf_ll(-78.4,42.95),cwf_ll(-77.9,42.98),cwf_ll(-77.3,42.9),cwf_ll(-76.7,42.92),cwf_ll(-76.15,42.98),cwf_ll(-75.6,43.0),
  cwf_ll(-75.23,43.05),cwf_ll(-74.6,42.92),cwf_ll(-74.1,42.8),CWF_PL.albany];
// the Hudson, from above Albany down to the harbour
const CWF_HUDSON=[cwf_ll(-73.62,43.35),cwf_ll(-73.69,42.95),cwf_ll(-73.72,42.75),CWF_PL.albany,cwf_ll(-73.80,42.35),cwf_ll(-73.95,41.95),
  cwf_ll(-73.93,41.70),cwf_ll(-73.96,41.39),cwf_ll(-73.92,41.08),cwf_ll(-73.95,40.88),CWF_PL.nyc];
// a polyline, measured: its points and the length along it, so part of it can be drawn
// the Finger Lakes, long and thin: x, top, bottom and half-width of each
const CWF_FINGER=[[668,382,430,7],[744,366,490,9],[801,366,488,9],[843,372,440,7]];
function cwf_poly(P){const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));return{P,L,len:L[L.length-1]};}
const CWF_RL=cwf_poly(CWF_ROUTE),CWF_WL=cwf_poly(CWF_ROAD);
function cwf_at(pl,d){d=clamp(d,0,pl.len);let i=1;while(i<pl.P.length-1&&pl.L[i]<d)i++;const a=pl.P[i-1],b=pl.P[i],u=(d-pl.L[i-1])/Math.max(1e-6,pl.L[i]-pl.L[i-1]);return[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];}
// the line from d0 to d1 along it
function cwf_part(ctx,pl,d0,d1){if(d1<=d0)return;ctx.beginPath();const p=cwf_at(pl,d0);ctx.moveTo(p[0],p[1]);for(let i=1;i<pl.P.length;i++){if(pl.L[i]<=d0)continue;if(pl.L[i]>=d1)break;ctx.lineTo(pl.P[i][0],pl.P[i][1]);}
  const q=cwf_at(pl,d1);ctx.lineTo(q[0],q[1]);ctx.stroke();}
function cwf_smooth(c,P){c.beginPath();c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length-1;i++){const m=[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2];c.quadraticCurveTo(P[i][0],P[i][1],m[0],m[1]);}
  c.lineTo(P[P.length-1][0],P[P.length-1][1]);}
function cwf_blob(c,P){c.beginPath();const n=P.length;for(let i=0;i<=n;i++){const a=P[i%n],b=P[(i+1)%n],m=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(i===0)c.moveTo(m[0],m[1]);else c.quadraticCurveTo(a[0],a[1],m[0],m[1]);}c.closePath();}
AG_PLACES.cwfMap=c=>{const R=ag_rnd(1816),K=CWF_K;c.fillStyle=rgba(K.land,1);c.fillRect(0,0,W,H);
  // the land's light: a little warmer to the right, where the sun is, and soft patches of field and wood
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.1));g.addColorStop(1,rgba(LP.sun,0.1));c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let k=0;k<120;k++){const x=R()*W,y=R()*H,r=30+R()*90;c.fillStyle=rgba(R()<0.5?K.landDk:mix(K.land,K.forest,0.25),0.07);c.beginPath();c.ellipse(x,y,r,r*0.6,R()*3,0,TAU);c.fill();}
  // hills: the Adirondacks to the north-east and the Catskills west of the Hudson, each a soft rise with a few rounded humps on it,
  // shaded on the left and lit from the right, a thin line at each one's foot, as a hand-drawn map shows high ground
  const rise=(cx,cy,rx,ry)=>{c.save();c.translate(cx,cy);c.scale(rx,ry);const hg=c.createRadialGradient(0,0,0,0,0,1);hg.addColorStop(0,rgba(K.hill,0.3));
    hg.addColorStop(0.65,rgba(K.hill,0.14));hg.addColorStop(1,rgba(K.hill,0));c.fillStyle=hg;c.beginPath();c.arc(0,0,1,0,TAU);c.fill();c.restore();};
  const humps=(cx,cy,rx,ry,n,seed)=>{const r=ag_rnd(seed),pts=[];for(let k=0;k<600&&pts.length<n;k++){const an=r()*TAU,d=Math.sqrt(r()),s=20+r()*16,
      x=cx+Math.cos(an)*d*rx,y=cy+Math.sin(an)*d*ry;if(!pts.some(p=>Math.abs(p[0]-x)<(p[2]+s)*1.05&&Math.abs(p[1]-y)<(p[2]+s)*0.6))pts.push([x,y,s]);}
    pts.sort((p,q)=>p[1]-q[1]);for(const [x,y,s0] of pts){const s=s0,hh=0.72+((x*7+y*3)%23)/23*0.26;const hg=c.createLinearGradient(x-s,0,x+s,0);hg.addColorStop(0,rgba(ag_dk(K.hill,0.1),0.8));
      hg.addColorStop(0.55,rgba(K.hill,0.72));hg.addColorStop(1,rgba(ag_lt(K.hill,0.32),0.7));c.fillStyle=hg;c.beginPath();c.moveTo(x-s,y);
      c.bezierCurveTo(x-s*0.72,y-s*hh,x+s*0.72,y-s*hh,x+s,y);c.closePath();c.fill();c.strokeStyle=rgba(ag_dk(K.hill,0.22),0.3);c.lineWidth=2;
      c.beginPath();c.moveTo(x-s*1.08,y+1);c.lineTo(x+s*1.08,y+1);c.stroke();}};
  rise(1350,170,240,130);humps(1350,170,200,95,15,41);rise(1330,565,120,75);humps(1330,565,92,52,7,42);
  // the sea, south-east of the harbour, and Long Island along it
  c.fillStyle=rgba(K.water,1);c.beginPath();c.moveTo(1380,1080);c.bezierCurveTo(1400,960,1430,920,1460,905);c.bezierCurveTo(1600,880,1760,850,1920,830);c.lineTo(1920,1080);c.closePath();c.fill();
  c.fillStyle=rgba(K.land,1);cwf_blob(c,[[1470,896],[1560,872],[1700,846],[1860,824],[1920,822],[1920,846],[1800,860],[1650,884],[1520,908]]);c.fill();
  // the lakes: Erie to the west, Ontario to the north, Oneida, and the Finger Lakes, long and thin
  const lake=(P)=>{c.fillStyle=rgba(K.water,1);cwf_blob(c,P);c.fill();c.strokeStyle=rgba(K.waterDk,0.7);c.lineWidth=2;c.stroke();};
  lake([[-60,420],[60,400],[160,384],[250,372],[298,374],[304,388],[250,410],[170,452],[80,500],[0,548],[-60,560]]);
  lake([[120,212],[200,200],[330,185],[480,168],[640,150],[780,128],[880,98],[920,120],[900,200],[868,246],[790,262],[640,282],[480,292],[330,296],[240,292],[150,262]]);
  lake([[950,306],[985,298],[1030,300],[1036,312],[995,318],[955,316]]);
  for(const [x,y0,y1,w] of CWF_FINGER){c.fillStyle=rgba(K.water,1);c.beginPath();c.ellipse(x,(y0+y1)/2,w,(y1-y0)/2,0.05,0,TAU);c.fill();}
  // the rivers: the Niagara between the lakes, the Mohawk east to the Hudson, and the Hudson down to the harbour, widening as it goes
  c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba(K.water,1);
  c.lineWidth=6;cwf_smooth(c,[CWF_PL.buffalo,cwf_ll(-79.0,43.05),cwf_ll(-79.06,43.26)]);c.stroke();
  c.lineWidth=5;cwf_smooth(c,[CWF_PL.rome,CWF_PL.utica,cwf_ll(-74.86,43.04),cwf_ll(-74.19,42.94),CWF_PL.schenectady,cwf_ll(-73.70,42.77)]);c.stroke();
  for(let i=1;i<CWF_HUDSON.length;i++){c.lineWidth=lerp(7,20,i/CWF_HUDSON.length);c.beginPath();c.moveTo(CWF_HUDSON[i-1][0],CWF_HUDSON[i-1][1]);c.lineTo(CWF_HUDSON[i][0],CWF_HUDSON[i][1]);c.stroke();}
  c.fillStyle=rgba(K.water,1);c.beginPath();c.ellipse(CWF_PL.nyc[0]+16,CWF_PL.nyc[1]+18,40,22,0.3,0,TAU);c.fill();
  // the forest's shade over the west, the land the farms were cut from
  g=c.createRadialGradient(140,720,40,140,720,720);g.addColorStop(0,rgba(K.forest,0.15));g.addColorStop(1,rgba(K.forest,0));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W*0.5,H*0.45,H*0.4,W*0.5,H*0.45,W*0.75);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.22));c.fillStyle=g;c.fillRect(0,0,W,H);};

/* what is drawn over the map, live. o:
     names    0 to 1: the lakes', the river's and the three towns' names
     farms    0 to 1: farms and towns in the west, as small marks coming in
     road     0 to 1: the wagon road east, drawn from Buffalo, in amber
     roadA    0 to 1: how strongly the road shows (1, unless it gives way to the canal)
     plan     0 to 1: the canal's route as a plan, dashed, in blue, drawn from Albany west
     dug      0 to 1: the canal dug, from the middle out (work began at Rome), solid
     open     0 to 1: the canal open, its line turning green
     boat     0 to 1: a boat along it, from Buffalo to Albany, then down the Hudson
     nations  0 to 1: the Haudenosaunee nations' names, each on its homeland along the route
     port     0 to 1: the harbour ringed in green */
// each name on its people's homeland, where there's room: the Tuscarora near Lockport, between the canal and the old road; the Seneca in
// the Genesee's valley; the Cayuga below their lake; the Onondaga south of Syracuse; the Oneida south of Utica; the Mohawk along their river
const CWF_NATIONS=[["Tuscarora",445,352],["Seneca",590,465],["Cayuga",800,524],["Onondaga",965,428],["Oneida",1180,410],["Mohawk",1300,300]];
// the farms out west, placed once: in clearings east of Buffalo, off the lakes, the two routes and the nations' names; they come in from
// the east, spreading west
const CWF_FARMS=(()=>{const R=ag_rnd(1812),out=[],near=(P,x,y)=>{let d=1e9;for(let i=1;i<P.length;i++){const [ax,ay]=P[i-1],[bx,by]=P[i],dx=bx-ax,dy=by-ay,
    u=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);d=Math.min(d,Math.hypot(ax+u*dx-x,ay+u*dy-y));}return d;};
  for(let k=0;k<600&&out.length<26;k++){const x=330+R()*640,y=390+R()*210;if(near(CWF_ROUTE,x,y)<26||near(CWF_ROAD,x,y)<22)continue;
    if(CWF_FINGER.some(([lx,y0,y1,lw])=>Math.abs(x-lx)<lw+24&&y>y0-16&&y<y1+16))continue;
    if(CWF_NATIONS.some(([nm,nx,ny])=>Math.abs(x-nx)<nm.length*11.5+26&&y>ny-42&&y<ny+16))continue;
    if((x>306&&x<436&&y>392&&y<444)||(x>856&&y>452))continue;
    if(out.some(([fx,fy])=>Math.hypot(fx-x,fy-y)<44))continue;out.push([x,y]);}
  return out.sort((p,q)=>q[0]-p[0]);})();
function cwf_mapLive(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  const nm=clamp(o.names||0,0,1);
  // farms and towns in the west: small timber marks in clearings
  const fm=clamp(o.farms||0,0,1);if(fm>0){const n=CWF_FARMS.length;for(let k=0;k<n;k++){const [x,y]=CWF_FARMS[k],u=clamp(fm*n-k,0,1);if(u<=0)continue;
    ctx.save();ctx.globalAlpha*=u;ctx.fillStyle=rgba(mix(CWF_K.wheat,CWF_K.land,0.2),0.9);ctx.beginPath();ctx.ellipse(x,y,16,10,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(CWF_K.town,1);ctx.fillRect(x-5,y-6,10,8);ctx.fillStyle=rgba(ag_lt(CWF_K.town,0.35),1);ctx.fillRect(x,y-6,5,8);ctx.restore();}}
  // the wagon road: a rough, dashed amber line from Buffalo to Albany, then the river down to the city
  const rd=clamp(o.road||0,0,1),ra=o.roadA==null?1:clamp(o.roadA,0,1);if(rd>0&&ra>0.004){ctx.save();ctx.globalAlpha*=ra;ctx.strokeStyle=rgba(LP.amber,0.95);ctx.lineWidth=7;ctx.setLineDash([16,12]);cwf_part(ctx,CWF_WL,0,CWF_WL.len*clamp(rd*1.4,0,1));ctx.restore();
    if(rd>0.7){const hl=cwf_poly(CWF_HUDSON.slice(3));ctx.save();ctx.globalAlpha*=ra;ctx.strokeStyle=rgba(LP.amber,0.95);ctx.lineWidth=7;ctx.setLineDash([16,12]);cwf_part(ctx,hl,0,hl.len*clamp((rd-0.7)/0.3,0,1));ctx.restore();}}
  // the canal as a plan: dashed blue, from Albany west
  const pl=clamp(o.plan||0,0,1),dg=clamp(o.dug||0,0,1),op=clamp(o.open||0,0,1);
  if(pl>0&&dg<1){ctx.save();ctx.strokeStyle=rgba(LP.blue,0.9);ctx.lineWidth=6;ctx.setLineDash([12,10]);cwf_part(ctx,CWF_RL,CWF_RL.len*(1-pl),CWF_RL.len);ctx.restore();}
  // dug, from Rome outward both ways, solid; once open, green
  if(dg>0){const mid=CWF_RL.L[8],h=dg*Math.max(mid,CWF_RL.len-mid);ctx.strokeStyle=rgba(mix(LP.blue,LP.green,op),1);ctx.lineWidth=9;cwf_part(ctx,CWF_RL,Math.max(0,mid-h),Math.min(CWF_RL.len,mid+h));
    ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=2.5;cwf_part(ctx,CWF_RL,Math.max(0,mid-h),Math.min(CWF_RL.len,mid+h));}
  // the boat: a small hull with its cargo, along the canal and on down the river
  const bt=clamp(o.boat||0,0,1);if(bt>0&&bt<1){const hl=cwf_poly(CWF_HUDSON.slice(3)),tot=CWF_RL.len+hl.len,d=bt*tot,p=d<CWF_RL.len?cwf_at(CWF_RL,d):cwf_at(hl,d-CWF_RL.len);
    ctx.save();ctx.globalAlpha*=Math.min(1,bt*12)*Math.min(1,(1-bt)*12);ctx.translate(p[0],p[1]);ctx.fillStyle="rgba(52,44,52,0.25)";rr(ctx,-16,-3,36,14,6);ctx.fill();
    ctx.fillStyle=rgba(CWF_K.timber,1);rr(ctx,-18,-8,36,14,6);ctx.fill();ctx.fillStyle=rgba(CWF_K.wheat,1);ctx.fillRect(-10,-14,20,7);ctx.restore();}
  // the harbour, ringed in green: the busiest port in the country
  const pt=clamp(o.port||0,0,1);if(pt>0){ctx.save();ctx.globalAlpha*=pt;ctx.strokeStyle=rgba(LP.green,1);ctx.lineWidth=6;ctx.beginPath();ctx.arc(CWF_PL.nyc[0]+8,CWF_PL.nyc[1]+6,38+8*(1-pt),0,TAU);ctx.stroke();ctx.restore();}
  // the nations' names, on their homelands along the route, in ink, quietly
  const na=clamp(o.nations||0,0,1);if(na>0)CWF_NATIONS.forEach(([s,x,y],i)=>{const u=clamp(na*CWF_NATIONS.length*0.8-i*0.8+0.8,0,1);if(u>0)lp_label(ctx,x,y,s,{align:"center",col:LP.ink,a:u});});
  // the towns: Buffalo, Albany and the city, a dot each
  if(nm>0){ctx.save();ctx.globalAlpha*=nm;for(const k of ["buffalo","albany","nyc"]){const p=CWF_PL[k];ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(p[0],p[1],9,0,TAU);ctx.fill();
      ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.arc(p[0],p[1],4,0,TAU);ctx.fill();}ctx.restore();
    lp_T(ctx,"Buffalo",CWF_PL.buffalo[0]+20,CWF_PL.buffalo[1]+44,{w:700,size:30,a:nm});
    lp_T(ctx,"Albany",CWF_PL.albany[0]+24,CWF_PL.albany[1]+42,{w:700,size:30,a:nm});
    lp_T(ctx,"New York City",CWF_PL.nyc[0]-26,CWF_PL.nyc[1]-14,{w:700,size:30,align:"right",a:nm});
    lp_label(ctx,60,505,"Lake Erie",{col:mix(LP.mut,CWF_K.waterDk,0.3),a:nm});
    lp_label(ctx,480,232,"Lake Ontario",{align:"center",col:mix(LP.mut,CWF_K.waterDk,0.3),a:nm});
    lp_label(ctx,1462,700,"Hudson",{col:mix(LP.mut,CWF_K.waterDk,0.3),a:nm});}
  ctx.restore();}

/* ---------------------------------------------------------------- the farm, the hall and the cutting */
// a tree in a far wood: a dark crown of soft blobs, lit from the right, over a short trunk
function cwf_tree(c,x,base,h,R,col){col=col||CWF_K.forest;const r=h*0.34;c.fillStyle=rgba(CWF_K.forestDk,1);c.fillRect(x-5,base-h*0.4,10,h*0.4);
  for(let k=0;k<9;k++){const an=k/9*TAU,dx=Math.cos(an)*r*0.55,dy=Math.sin(an)*r*0.5-h*0.1,rr2=r*(0.52+R()*0.25);
    const g=c.createRadialGradient(x+dx+rr2*0.35,base-h*0.58+dy-rr2*0.35,2,x+dx,base-h*0.58+dy,rr2);g.addColorStop(0,rgba(ag_lt(col,0.18),1));g.addColorStop(1,rgba(CWF_K.forestDk,1));
    c.fillStyle=g;c.beginPath();c.arc(x+dx,base-h*0.58+dy,rr2,0,TAU);c.fill();}}
// the wood's edge: its trees close together, and a row of undergrowth along the foot that hides their trunks
function cwf_wood(c,hz,seed,step,hmin,hvar,tilt){const R=ag_rnd(seed);for(let x=-40;x<W+60;x+=step+R()*step*0.6)cwf_tree(c,x,hz+14,hmin+R()*hvar-(x/W)*tilt,R);
  for(let x=-30;x<W+40;x+=26+R()*20){const r=22+R()*20,g=c.createRadialGradient(x+r*0.3,hz-r*0.3,2,x,hz,r*1.2);g.addColorStop(0,rgba(mix(CWF_K.forest,CWF_K.wheat,0.12),1));g.addColorStop(1,rgba(CWF_K.forestDk,1));
    c.fillStyle=g;c.beginPath();c.ellipse(x,hz+4,r*1.2,r,0,0,TAU);c.fill();}}
function cwf_sky(c,hz){let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(CWF_K.sky0,1));g.addColorStop(1,rgba(CWF_K.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,hz);
  g=c.createRadialGradient(1640,110,20,1640,110,900);g.addColorStop(0,"rgba(255,242,214,0.6)");g.addColorStop(1,"rgba(255,242,214,0)");c.fillStyle=g;c.fillRect(0,0,W,hz);}
AG_PLACES.cwfFarm=c=>{const R=ag_rnd(1816),hz=600;cwf_sky(c,hz);
  // the forest behind, a dark line of crowns, nearer and taller to the left
  cwf_wood(c,hz,1817,40,180,120,50);
  // the cleared field: cut wheat, its stubble in rows, warm in the sun
  let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(CWF_K.wheat,1));g.addColorStop(1,rgba(CWF_K.wheatDk,1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.strokeStyle=rgba(CWF_K.wheatDk,0.5);for(let k=0;k<26;k++){const y=hz+12+k*k*0.9;c.lineWidth=1+k*0.12;c.beginPath();c.moveTo(0,y);c.lineTo(W,y+4);c.stroke();}
  // stumps where trees were felled to clear it
  for(const [x,y,s] of [[260,690,1],[700,650,0.7],[1580,700,1.1],[1180,660,0.75]]){c.fillStyle=rgba(CWF_K.earthDk,1);rr(c,x-18*s,y-26*s,36*s,30*s,6);c.fill();c.fillStyle=rgba(ag_lt(CWF_K.timber,0.3),1);c.beginPath();c.ellipse(x,y-26*s,18*s,6*s,0,0,TAU);c.fill();}
  // the track east: two ruts of mud running from the near right into the trees
  c.fillStyle=rgba(CWF_K.road,1);c.beginPath();c.moveTo(1500,H);c.bezierCurveTo(1560,840,1700,700,1840,hz+6);c.lineTo(1900,hz+6);c.bezierCurveTo(1820,720,1760,860,1760,H);c.closePath();c.fill();
  c.strokeStyle=rgba(CWF_K.earthDk,0.6);c.lineWidth=5;for(const dx of [40,140]){c.beginPath();c.moveTo(1500+dx,H);c.bezierCurveTo(1570+dx*0.7,840,1720+dx*0.3,700,1850+dx*0.12,hz+8);c.stroke();}
  // sheaves of the cut wheat, stood up to dry
  for(const [x,y,s] of [[180,760,1.1],[420,720,0.9],[980,700,0.8],[1250,740,1.0]]){const sg=c.createLinearGradient(x-30*s,0,x+30*s,0);sg.addColorStop(0,rgba(CWF_K.wheatDk,1));sg.addColorStop(1,rgba(ag_lt(CWF_K.wheat,0.25),1));
    c.fillStyle=sg;c.beginPath();c.moveTo(x-34*s,y);c.lineTo(x-12*s,y-120*s);c.lineTo(x+12*s,y-120*s);c.lineTo(x+34*s,y);c.closePath();c.fill();c.fillStyle=rgba(CWF_K.earthDk,0.6);c.fillRect(x-16*s,y-70*s,32*s,6*s);}
  c.fillStyle=rgba(LP.shade,0.1);c.fillRect(0,hz,W,5);
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.4,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.22));c.fillStyle=g;c.fillRect(0,0,W,H);};
AG_PLACES.cwfHall=c=>{lp_paintRoom(c,{light:"morning",seed:17,base:CWF_K.stone});
  // flat pilasters, a cornice along the top and a rail at waist height: a public hall of the time, plainly
  for(const x of [150,760,1370]){const g=c.createLinearGradient(x,0,x+90,0);g.addColorStop(0,rgba(mix(CWF_K.stone,LP.shade,0.12),1));g.addColorStop(1,rgba(ag_lt(CWF_K.stone,0.4),1));
    c.fillStyle=g;c.fillRect(x,110,90,826);c.fillStyle=rgba(mix(CWF_K.stone,LP.shade,0.18),1);c.fillRect(x-12,110,114,22);c.fillRect(x-10,900,110,36);
    c.fillStyle=rgba(LP.shade,0.12);c.fillRect(x-10,132,6,768);}
  c.fillStyle=rgba(mix(CWF_K.stone,LP.shade,0.16),1);c.fillRect(0,88,W,24);c.fillStyle="rgba(255,250,240,0.4)";c.fillRect(0,112,W,2);
  c.fillStyle=rgba(mix(CWF_K.timber,LP.shade,0.1),1);c.fillRect(0,690,W,14);c.fillStyle="rgba(255,250,240,0.35)";c.fillRect(0,690,W,2);};
AG_PLACES.cwfCut=c=>{const R=ag_rnd(1817),hz=520;cwf_sky(c,hz);
  cwf_wood(c,hz,1818,44,150,90,0);
  // the land, and the cutting across it: its far bank in sun, its floor of wet clay, felled trunks along the top
  let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(mix(CWF_K.land,CWF_K.forest,0.2),1));g.addColorStop(1,rgba(CWF_K.landDk,1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  g=c.createLinearGradient(0,600,0,700);g.addColorStop(0,rgba(ag_lt(CWF_K.earth,0.2),1));g.addColorStop(1,rgba(CWF_K.earth,1));c.fillStyle=g;
  c.beginPath();c.moveTo(0,600);c.bezierCurveTo(500,590,1300,610,W,596);c.lineTo(W,700);c.lineTo(0,706);c.closePath();c.fill();
  c.fillStyle=rgba(CWF_K.earthDk,1);c.fillRect(0,700,W,H-700);
  for(let k=0;k<40;k++){c.fillStyle=rgba(ag_dk(CWF_K.earth,0.2),0.25);c.fillRect(R()*W,612+R()*80,30+R()*60,3);}
  // spoil heaps on the far side, and felled trunks
  for(const [x,w,h] of [[220,260,60],[860,320,70],[1500,280,64]]){c.fillStyle=rgba(CWF_K.earth,1);c.beginPath();c.moveTo(x,598);c.quadraticCurveTo(x+w/2,598-h*2,x+w,598);c.closePath();c.fill();
    c.fillStyle=rgba(LP.sun,0.18);c.beginPath();c.moveTo(x+w/2,598-h);c.quadraticCurveTo(x+w*0.75,598-h*0.8,x+w,598);c.lineTo(x+w/2,598);c.closePath();c.fill();}
  for(const [x,y,l,an] of [[560,590,240,0.04],[1220,586,300,-0.03]]){c.save();c.translate(x,y);c.rotate(an);c.fillStyle=rgba(CWF_K.timber,1);rr(c,0,-14,l,28,12);c.fill();
    c.fillStyle=rgba(ag_lt(CWF_K.timber,0.35),1);c.beginPath();c.ellipse(l,0,8,14,0,0,TAU);c.fill();c.restore();}
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.4,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.22));c.fillStyle=g;c.fillRect(0,0,W,H);};
// the near bank of the cutting, over the diggers' waists: damp clay, darker at its top edge
function cwf_bank(ctx){const g=ctx.createLinearGradient(0,800,0,H);g.addColorStop(0,rgba(ag_lt(CWF_K.earth,0.12),1));g.addColorStop(1,rgba(CWF_K.earthDk,1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(0,830);ctx.bezierCurveTo(500,812,1300,840,W,818);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(ag_lt(CWF_K.earth,0.35),0.8);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,830);ctx.bezierCurveTo(500,812,1300,840,W,818);ctx.stroke();}

/* ---------------------------------------------------------------- the case, and what got better: freight, and the tolls */
// the canal's case to the legislature, as the film shows it in the hall in 1817 and again on the team's wall at the end
const CWF_CASE={kick:"The case for the canal",title:"To New York's legislature",lines:["Where: from the Hudson to Lake Erie","Cost: about $7 million","Repaid by: taxes and tolls"]};
// a ton from Lake Erie to New York, before and after, on a sheet: o.u (the first bar grows), o.after (0 to 1: the second), o.light (null on
// the map: no wall, no sun), o.pin, o.a, o.k
function cwf_freight(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=340;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light===undefined?null:o.light,pin:o.pin});lp_label(ctx,x+44,y+72,"A ton, Lake Erie to New York");
  const u=clamp(o.u==null?1:o.u,0,1),af=clamp(o.after||0,0,1),bx=x+44,full=(w-88)*0.72,top=y+124;
  const row=(ry,v,col,label,val,k)=>{if(k<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(clamp(k*3,0,1));lp_T(ctx,label,bx,ry,{w:600,size:28,col:LP.mut});
    const l=Math.max(12,full*v*ag_eo(k));ctx.fillStyle=rgba(col,1);rr(ctx,bx,ry+14,l,50,8);ctx.fill();lp_T(ctx,val,bx+l+18,ry+52,{w:800,size:34,col});ctx.restore();};
  row(top,1,LP.amber,"1816, by wagon: weeks","$100",u);
  row(top+120,0.09,LP.green,"1825, by canal: days","Under $9",af);
  ctx.restore();}
// the tolls adding up year by year until they cover the canal's cost: bars over a dashed line at what it cost. An illustration of the shape
// (the cost covered within ten years), not the yearly sums. o.u (the bars come in), o.light, o.pin, o.a, o.k
function cwf_tolls(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=340;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.green,light:o.light===undefined?null:o.light,pin:o.pin});lp_label(ctx,x+44,y+72,"The tolls, added up",{col:LP.green});
  const bars=[];for(let i=0;i<10;i++)bars.push({v:(i+1)*9+(i+1)*(i+1)*0.2,hi:true});
  lp_bars(ctx,x+60,y+96,w-120,h-110,bars,{col:LP.green,max:120,u:o.u,line:{v:100,label:"$7 million: what it cost"}});
  lp_T(ctx,"Year 1",x+60,y+h-30,{w:600,size:28,col:LP.mut});lp_T(ctx,"Year 10",x+w-60,y+h-30,{w:600,size:28,col:LP.mut,align:"right"});
  ctx.restore();}

/* ---------------------------------------------------------------- the people of the story */
// a homespun waistcoat over the shirt: the body's front in its own colour, open in a V at the neck, three buttons; the arms stay in shirt
function cwf_waistcoat(col){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  const f=cc=>{cc.moveTo(60,560);cc.lineTo(250,566);cc.bezierCurveTo(268,640,292,720,318,790);cc.bezierCurveTo(332,720,348,650,360,606);cc.lineTo(560,600);cc.lineTo(560,1120);cc.lineTo(60,1120);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.25),400,700,300,rgba(ag_dk(col,0.7),0.4),24);
  for(const y of [840,920,1000]){c.fillStyle=rgba(ag_dk(col,0.45),1);c.beginPath();c.arc(326,y,6,0,TAU);c.fill();}
  c.restore();};}
// braces over a linen shirt: two dark straps from the shoulders down the front
function cwf_braces(col){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();c.strokeStyle=rgba(col,1);c.lineWidth=14;c.lineCap="butt";
  c.beginPath();c.moveTo(232,580);c.bezierCurveTo(242,720,250,900,256,1110);c.moveTo(372,612);c.bezierCurveTo(374,760,376,920,380,1110);c.stroke();
  c.strokeStyle=rgba(ag_lt(col,0.3),0.5);c.lineWidth=2;c.beginPath();c.moveTo(238,600);c.bezierCurveTo(248,720,255,900,261,1110);c.stroke();c.restore();};}
// a shovel held upright: the near hand on its shaft, the blade far below, out of the picture
function cwf_shovel(ctx,h){const p=h.near;ctx.save();ctx.strokeStyle=rgba(CWF_K.timber,1);ctx.lineWidth=12;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(p[0]+4,p[1]-150);ctx.lineTo(p[0]+14,p[1]+520);ctx.stroke();ctx.strokeStyle=rgba(ag_lt(CWF_K.timber,0.35),0.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p[0]+8,p[1]-146);ctx.lineTo(p[0]+18,p[1]+520);ctx.stroke();
  ctx.fillStyle=rgba(ag_dk(CWF_K.timber,0.2),1);rr(ctx,p[0]-22,p[1]-170,52,20,8);ctx.fill();ctx.restore();}
// a linen cap over the crown and the back of the head, gathered, with a soft frill along the hairline, inside the head's picture
const CWF_CAPEDGE=[[388,320],[366,327],[344,333],[320,338],[298,346],[282,357],[271,374],[264,395],[261,420],[262,448]];
function cwf_cap(col){return(c,P)=>{c.save();const E=CWF_CAPEDGE;
  // the crown: gathered cloth from the back of the head over the top to the front edge, its outline in soft bumps
  c.beginPath();const N=18;for(let i=0;i<=N;i++){const an=lerp(3.62,0.36,i/N),r=104+Math.sin(i*1.9)*4,x=296+Math.cos(an)*r,y=376-Math.sin(an)*r;if(i===0)c.moveTo(x,y);else c.lineTo(x,y);}
  for(const [x,y] of E)c.lineTo(x,y);c.closePath();
  const g=c.createRadialGradient(340,300,10,300,360,150);g.addColorStop(0,rgba([255,255,255],1));g.addColorStop(1,rgba(ag_dk(col,0.1),1));c.fillStyle=g;c.fill();
  c.save();c.clip();c.strokeStyle=rgba(ag_dk(col,0.22),0.4);c.lineWidth=2;for(const [x0,y0,x1,y1] of [[214,340,300,296],[208,384,286,330],[214,424,272,372],[256,288,350,300]]){c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+x1)/2-8,(y0+y1)/2-10,x1,y1);c.stroke();}c.restore();
  // the frill: a band of finer cloth along the front edge, its outer edge waved
  const n=E.length,at=u=>{const f=u*(n-1),i=Math.min(n-2,Math.floor(f)),k=f-i;return[lerp(E[i][0],E[i+1][0],k),lerp(E[i][1],E[i+1][1],k)];};
  c.beginPath();for(let i=0;i<=40;i++){const u=i/40,[x,y]=at(u),o2=11+Math.sin(u*TAU*8)*3.2;if(i===0)c.moveTo(x+o2*0.55,y+o2*0.85);else c.lineTo(x+o2*0.55,y+o2*0.85);}
  for(let i=40;i>=0;i--){const [x,y]=at(i/40);c.lineTo(x-2,y-2);}c.closePath();c.fillStyle=rgba(ag_lt(col,0.4),1);c.fill();c.strokeStyle=rgba(ag_dk(col,0.24),0.7);c.lineWidth=2;c.stroke();
  c.restore();};}
// a kerchief of pale linen over the shoulders, crossed at the breast, inside the body's picture
function cwf_kerchief(col){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  const f=cc=>{cc.moveTo(226,560);cc.bezierCurveTo(196,570,160,584,140,600);cc.bezierCurveTo(170,660,236,730,300,790);cc.bezierCurveTo(332,730,370,672,410,628);cc.bezierCurveTo(392,616,378,608,362,603);
    cc.bezierCurveTo(330,640,300,680,292,700);cc.bezierCurveTo(272,660,248,610,226,560);cc.closePath();};
  ag_soft(c,f,col,[255,255,255],330,620,240,rgba(ag_dk(col,0.5),0.4),14);
  c.strokeStyle=rgba(ag_dk(col,0.25),0.55);c.lineWidth=2.4;c.beginPath();c.moveTo(186,640);c.quadraticCurveTo(236,690,280,736);c.moveTo(392,650);c.quadraticCurveTo(350,700,318,746);c.stroke();
  c.restore();};}
// a white neckcloth wrapped high round the throat and tied in front, its short ends in the coat's opening: drawn over the neck (o.front)
function cwf_cravat(ctx){const w=[246,244,238];
  ag_soft(ctx,cc=>{cc.moveTo(238,522);cc.bezierCurveTo(268,536,306,546,346,548);cc.bezierCurveTo(352,566,356,584,360,604);cc.bezierCurveTo(328,618,282,610,244,580);cc.bezierCurveTo(238,562,236,540,238,522);cc.closePath();},
    w,[255,255,255],330,556,90,rgba(ag_dk(w,0.55),0.32),8);
  ctx.strokeStyle=rgba(ag_dk(w,0.2),0.55);ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(250,548);ctx.quadraticCurveTo(300,566,350,572);ctx.moveTo(262,574);ctx.quadraticCurveTo(300,588,338,594);ctx.stroke();
  // the knot, and its two short ends
  ag_soft(ctx,cc=>{cc.moveTo(322,594);cc.bezierCurveTo(332,588,346,590,350,600);cc.bezierCurveTo(348,612,334,616,324,610);cc.closePath();},w,[255,255,255],340,598,26,rgba(ag_dk(w,0.5),0.4),5);
  ag_soft(ctx,cc=>{cc.moveTo(326,608);cc.lineTo(318,644);cc.lineTo(332,646);cc.lineTo(336,612);cc.closePath();cc.moveTo(340,610);cc.lineTo(348,642);cc.lineTo(360,638);cc.lineTo(348,606);cc.closePath();},
    w,[255,255,255],340,630,50,rgba(ag_dk(w,0.5),0.32),5);}
// the case for the canal, a few sheets rolled and held in the near hand
function cwf_roll(ctx,h){const p=h.near,pa=[244,236,214];ctx.save();ctx.translate(p[0]+6,p[1]-8);ctx.rotate(-1.05);
  ag_soft(ctx,cc=>ag_rect(cc,-18,-120,36,220,16),pa,[255,252,240],10,-40,110,rgba(ag_dk(pa,0.5),0.35),8);
  ctx.strokeStyle=rgba(ag_dk(pa,0.3),0.6);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-120,18,6,0,0,TAU);ctx.stroke();
  ctx.strokeStyle=rgba([150,60,50],0.8);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-18,40);ctx.lineTo(18,40);ctx.stroke();ctx.restore();}
const CWF_PEOPLE={
  farmer:{name:"A farmer",key:"cwf-farmer",skin:[222,184,152],hair:{style:"cropped",c:[92,70,52]},top:{kind:"tunic",c:[226,216,194],paint:cwf_waistcoat([118,92,66])},breath:0.29},
  farmwife:{name:"A farmer",key:"cwf-farmwife",skin:[230,190,160],hair:{style:"bob",c:[110,76,56]},top:{kind:"tunic",c:[150,112,92],paint:cwf_kerchief([238,232,216])},hat:{paint:cwf_cap([244,240,230])},breath:0.3},
  clinton:{name:"DeWitt Clinton",key:"cwf-clinton",skin:[232,198,174],hair:{style:"side",c:[120,90,66]},top:{kind:"blazer",c:[42,46,60],inner:[226,214,186]},breath:0.24},
  digger:{name:"A digger",key:"cwf-digger",skin:[234,196,170],hair:{style:"cropped",c:[60,44,36]},top:{kind:"shirt",c:[222,214,196],paint:cwf_braces([74,60,52])},breath:0.32},
  digger2:{name:"A digger",key:"cwf-digger2",skin:[226,184,156],hair:{style:"side",c:[150,104,70]},top:{kind:"shirt",c:[206,198,180],paint:cwf_braces([92,70,56])},breath:0.3}
};
