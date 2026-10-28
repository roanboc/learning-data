/* ===== A capability, not a project: its own pictures =====
   Holland around 1300, painted the series' way (master data's wash.js and people.js, the series' rooms.js and people.js): the land
   behind a dike from a farm's mound, long narrow fields between ditches of still water, farmhouses of timber and reed on low mounds,
   cattle, a church tower across the river; the same land cut through at a ditch, so its sinking under the river's level shows; the
   dike seen along its crest, one stretch of it slumped; a farm in the flood; three small pictures of a dike that's never finished; a
   charter on a table; and the same kind of land today, in the storm of 1953, and the barrier that came after it. No windmills (they
   came later), and nothing in Dutch or Latin: the charter's writing is lines too small to read. Then the university's: the deputy
   vice-chancellor's office, a new place; Noor's map with its strategy and business bands drawn large; and the papers: the project's
   report, Budget 2027, the wall planner, one page of services. The places are painted once and kept (the series' finish.js); what
   moves is drawn every frame. Every name starts with cp_ or CP, because every file of the film shares one script. */

/* ---------- Holland's colours ---------- */
// grass and sedge, hay, the ditches' still water and the river's, the dike's clay and turf, the peat under the fields, reed thatch,
// timber and daub, the church's stone; the cattle's red-brown; wool undyed and dyed with weld, woad and madder, as people wore it
const CP={grass:[134,168,100],grass2:[156,184,110],grass3:[116,150,88],sedge:[172,180,112],hay:[214,196,124],ditch:[160,184,198],
  river:[124,150,166],riverLt:[186,204,214],riverDk:[86,108,124],clay:[166,138,102],clayDk:[124,98,72],clayLt:[200,180,144],
  peat:[92,70,54],peatLt:[128,102,78],peatDk:[66,50,40],turf:[102,122,74],deep:[150,154,150],reed:[202,178,120],reedDk:[156,130,84],
  timber:[112,86,62],timberDk:[78,60,46],daub:[198,178,144],stone:[200,190,174],stoneDk:[148,140,126],slate:[104,110,126],
  willow:[148,170,110],willowDk:[106,130,84],cow:[146,92,62],cowDk:[96,62,44],ox:[176,140,104],
  road:[204,198,186],brick:[168,84,64],brickDk:[128,62,50],tile:[150,72,58],asphalt:[120,122,128],night:[46,56,80],foam:[232,236,236]};

/* ---------- the land in depth ---------- */
// a camera over flat land: X across and Z away from it, Y up (metres); F its focal length in px, hz the horizon's line, eye its height,
// cx where it stands across, yaw how far it's turned (so lines running away don't all meet in the middle). Lines on the land stay lines
const cp_pj=(C,X,Y,Z)=>{const c=Math.cos(C.yaw||0),s=Math.sin(C.yaw||0),x=X*c-Z*s,z=X*s+Z*c;return[960+C.F*(x-(C.cx||0))/z,C.hz+C.F*(C.eye-Y)/z];};
const cp_pts=(C,L)=>L.map(p=>cp_pj(C,p[0],p[1],p[2]));
// pixels to a metre at depth Z; a point's depth once the camera's turned
const cp_k=(C,Z)=>C.F/Z;
const cp_z=(C,X,Z)=>X*Math.sin(C.yaw||0)+Z*Math.cos(C.yaw||0);
// a shape on the land (points [X, Y, Z]) to the frame: turned with the camera, cut where it comes nearer than zn metres, then projected,
// so a field that runs past the camera's feet is still one clean shape
function cp_proj(C,L,zn){zn=zn||1.5;const c=Math.cos(C.yaw||0),s=Math.sin(C.yaw||0),P=L.map(([X,Y,Z])=>[X*c-Z*s,Y,X*s+Z*c]),o=[];
  for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],ia=a[2]>=zn,ib=b[2]>=zn;if(ia)o.push(a);
    if(ia!==ib){const u=(zn-a[2])/(b[2]-a[2]);o.push([lerp(a[0],b[0],u),lerp(a[1],b[1],u),zn]);}}
  return o.map(([x,y,z])=>[960+C.F*(x-(C.cx||0))/z,C.hz+C.F*(C.eye-y)/z]);}

// a wide, pale sky over flat land: the series' wet wash of blue, greyed, with big clouds, white above and grey underneath, each a few
// soft rounds (gradients, not blurs: the place paints quickly); o.dark for evening or storm
function cp_sky(ctx,hz,seed,o){o=o||{};wc_sky(ctx,hz,seed,{clouds:o.lift==null?4:o.lift,cx:120,cw:1680,cy:30,ch:hz*0.45,sun:o.sun});
  ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(o.top||[208,216,226],0.7));g.addColorStop(1,rgba([244,242,236],0.25));
  ctx.fillStyle=g;ctx.fillRect(0,0,W,hz+6);ctx.restore();
  const R=wc_rng(seed*7+3);for(let i=0;i<(o.n==null?7:o.n);i++){const cx=-80+R()*(W+160),cy=40+Math.pow(R(),1.4)*(hz*0.62),w=(160+R()*260)*(1-0.45*cy/hz),h=w*(0.28+R()*0.12);
    cp_cloud(ctx,cx,cy,w,h,seed+i*11,o.dark);}}
function cp_cloud(ctx,x,y,w,h,seed,dark){const R=wc_rng(seed),blobs=[];for(let i=0;i<7;i++){const u=i/6;blobs.push([x+(u-0.5)*w*0.9+(R()-0.5)*w*0.12,y-Math.sin(u*Math.PI)*h*(0.5+R()*0.35),w*(0.16+R()*0.1)]);}
  ctx.save();ctx.globalCompositeOperation="multiply";for(const [bx,by,r] of blobs){const g=ctx.createRadialGradient(bx,by+r*0.5,r*0.1,bx,by+r*0.4,r*1.15);
    g.addColorStop(0,rgba(dark?[150,156,170]:[196,200,210],0.55));g.addColorStop(1,rgba([255,255,255],0));ctx.fillStyle=g;ctx.fillRect(bx-r*1.2,by-r*0.8,r*2.4,r*2.4);}
  ctx.globalCompositeOperation="screen";for(const [bx,by,r] of blobs){const g=ctx.createRadialGradient(bx-r*0.2,by-r*0.25,r*0.05,bx,by,r);g.addColorStop(0,rgba([255,255,255],dark?0.22:0.75));
    g.addColorStop(1,rgba([255,255,255],0));ctx.fillStyle=g;ctx.fillRect(bx-r,by-r,r*2,r*2);}ctx.restore();}
// short strokes of grass over a shape on the land, thicker and taller near (k is pixels a metre at its near edge); kept cheap: plain lines
function cp_grass(ctx,pts,col,n,seed,kNear,kFar,yNear,yFar,fine){ctx.save();wc_tr(ctx,pts);ctx.clip();const R=wc_rng(seed),b=wc_bbox(pts);ctx.lineCap="round";
  for(let i=0;i<n;i++){const y=lerp(b.y0,b.y1,Math.pow(R(),0.7)),u=clamp((y-yFar)/Math.max(1,yNear-yFar),0,1),k=lerp(kFar,kNear,u),x=b.x0+R()*b.w;
    ctx.strokeStyle=rgba(R()<0.5?wc_dim(col,0.2+R()*0.12):wc_lit(col,0.1),0.35+0.3*u);ctx.lineWidth=fine?0.5+k*0.009:0.6+k*0.025;ctx.beginPath();ctx.moveTo(x,y);
    if(fine){const lean=(R()-0.5)*k*0.08,h=k*(0.04+R()*0.08);ctx.quadraticCurveTo(x+lean*0.3,y-h*0.6,x+lean,y-h);}else ctx.lineTo(x+(R()-0.5)*k*0.06,y-k*(0.05+R()*0.09));ctx.stroke();}
  ctx.restore();}
// grass in the light: soft patches, a little darker or lighter, wide and flat as the land runs away (k px a metre, as cp_grass)
function cp_mottle(ctx,pts,n,seed,kNear,kFar,yNear,yFar,o){o=o||{};ctx.save();wc_tr(ctx,pts);ctx.clip();const R=wc_rng(seed),b=wc_bbox(pts);
  for(let i=0;i<n;i++){const y=lerp(b.y0,b.y1,Math.pow(R(),0.8)),u=clamp((y-yFar)/Math.max(1,yNear-yFar),0,1),k=lerp(kFar,kNear,u),x=b.x0+R()*b.w,rw=k*(0.6+R()*1.8)*(o.size||1),rh=rw*(0.18+0.3*u),dk=R()<0.55;
    ctx.globalCompositeOperation=dk?"multiply":"screen";const g=ctx.createRadialGradient(x,y,0,x,y,rw);g.addColorStop(0,dk?rgba(o.dark||[150,170,120],0.16+R()*0.1):rgba([255,252,230],0.1+R()*0.08));g.addColorStop(1,dk?"rgba(255,255,255,0)":"rgba(0,0,0,0)");
    ctx.fillStyle=g;ctx.save();ctx.translate(x,y);ctx.scale(1,rh/rw);ctx.translate(-x,-y);ctx.fillRect(x-rw,y-rw,rw*2,rw*2);ctx.restore();}
  ctx.restore();}
// still water in a ditch or a pool: the wash, a band of sky's light along it, and a darker edge on the near side
function cp_water(ctx,pts,col,depth,seed,o){o=o||{};wc_wash(ctx,pts,col||CP.ditch,{kind:"field",depth,seed,a:o.a==null?0.92:o.a});
  ctx.save();wc_tr(ctx,pts);ctx.clip();ctx.globalCompositeOperation="screen";const b=wc_bbox(pts),g=ctx.createLinearGradient(0,b.y0,0,b.y1);
  g.addColorStop(0,"rgba(255,255,255,0.32)");g.addColorStop(0.6,"rgba(255,255,255,0.05)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(b.x0,b.y0,b.w,b.h);ctx.restore();}

/* ---------- Holland's things: farmhouses, cattle, willows, a church ---------- */
// a farmhouse of timber and reed on its low mound, long side to us, its byre's big door to the right: low walls of timber posts and
// daub, a high reed roof hipped at both ends, smoke rising through it (no chimney yet). Kept at 300 px long; (x, y) the middle of its
// mound's foot, k its scale; o.flip turns it round
function cp_farmC(seed,modern){return wc_kept("cpFarm"+seed+(modern?"m":""),460,330,q=>{q.translate(230,290);const R=wc_rng(seed),wall=modern?CP.brick:CP.daub,roofC=modern?CP.tile:CP.reed,roofD=modern?CP.brickDk:CP.reedDk;
  // the mound, a low swell of grass
  wc_wash(q,[[-220,4],[-170,-18],[-60,-30],[80,-30],[180,-16],[224,4]],CP.grass3,{kind:"field",seed:seed+1,a:0.9});
  // the walls: daub panels between dark posts, and a sill beam
  wc_part(q,wc_rect(-150,-96,300,72),wall,1,{seed:seed+2,lw:1.2});q.save();q.strokeStyle=rgba(CP.timberDk,0.85);q.lineWidth=5;q.lineCap="round";
  if(!modern){for(let x=-146;x<=146;x+=36){q.beginPath();q.moveTo(x,-96);q.lineTo(x,-24);q.stroke();}q.lineWidth=6;q.beginPath();q.moveTo(-152,-26);q.lineTo(152,-26);q.stroke();
    q.lineWidth=3;q.strokeStyle=rgba(CP.timberDk,0.5);for(let x=-128;x<140;x+=72){q.beginPath();q.moveTo(x,-92);q.lineTo(x+30,-30);q.stroke();}}
  else{q.strokeStyle=rgba(CP.brickDk,0.35);q.lineWidth=1.2;for(let y=-90;y<-24;y+=8){q.beginPath();q.moveTo(-148,y);q.lineTo(148,y);q.stroke();}}q.restore();
  // a door, the byre's wide door, a shuttered window
  wc_wash(q,wc_rect(-60,-80,30,56),CP.timberDk,{kind:"door",lw:1.1,seed:seed+3});wc_wash(q,wc_rect(64,-88,58,64),CP.timber,{kind:"door",lw:1.1,seed:seed+4});
  q.save();q.strokeStyle=rgba(CP.timberDk,0.7);q.lineWidth=2;q.beginPath();q.moveTo(93,-88);q.lineTo(93,-24);q.stroke();q.restore();
  wc_flat(q,wc_rect(-112,-78,22,18),CP.timberDk,1,"shutter");
  // the roof: reed, hipped, high, down to just above the walls, its ridge capped with sods
  const roof=[[-176,-86],[176,-86],[118,-226],[-118,-226]];wc_wash(q,roof,roofC,{kind:"build",seed:seed+5,lw:1.3});
  q.save();wc_tr(q,roof);q.clip();q.lineCap="round";for(let i=0;i<150;i++){const x=-180+R()*360,y=-226+R()*140;q.strokeStyle=rgba(R()<0.5?roofD:wc_lit(roofC,0.25),0.4);q.lineWidth=1.2;
    q.beginPath();q.moveTo(x,y);q.lineTo(x+(x>0?3:-3)*(R()*0.6),y+10+R()*16);q.stroke();}
  const g=q.createLinearGradient(0,-226,0,-86);g.addColorStop(0,"rgba(80,60,40,0)");g.addColorStop(1,"rgba(80,60,40,0.22)");q.fillStyle=g;q.fillRect(-180,-226,360,140);q.restore();
  wc_flat(q,[[-122,-222],[122,-222],[116,-232],[-116,-232]],CP.turf,1,"ridge");
  // the eaves' shadow on the walls
  q.save();q.globalCompositeOperation="multiply";q.fillStyle="rgba(90,70,50,0.28)";q.fillRect(-150,-96,300,14);q.restore();});}
function cp_farm(ctx,x,y,k,o){o=o||{};const c=cp_farmC(o.seed||7,o.modern);ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-k:k,k);ctx.drawImage(c,-230,-290);ctx.restore();
  if(o.smoke!==false&&k>0.12){ctx.save();ctx.globalCompositeOperation="multiply";const sx=x+(o.flip?-30:30)*k,sy=y-232*k;for(let i=0;i<5;i++){const r=(14+i*9)*k,g=ctx.createRadialGradient(sx+i*10*k,sy-i*26*k,0,sx+i*10*k,sy-i*26*k,r);
    g.addColorStop(0,"rgba(190,190,196,0.28)");g.addColorStop(1,"rgba(190,190,196,0)");ctx.fillStyle=g;ctx.fillRect(sx+i*10*k-r,sy-i*26*k-r,r*2,r*2);}ctx.restore();}}
// a cow, side on, facing left, as the cattle of the old polders: red-brown or black, with a white face and white under the belly, short
// horns; v: 0 red, standing; 1 red, grazing; 2 black, standing; 3 black, grazing; 4 an ox, fawn, standing. Kept at 150 px long; (x, y) her feet, k her scale
const cp_sm=(pts,n)=>wc_smooth([...pts,pts[0],pts[1]],n||5).slice(0,-n||-5);
function cp_cowC(v){return wc_kept("cpCow"+v,200,130,q=>{q.translate(84,112);const ox=v===4,graze=!ox&&v%2===1,col=ox?CP.ox:v>1?[58,54,58]:CP.cow,dk=wc_dim(col,0.25),wh=[240,234,224];
  const leg=(x0,y0,x1,hx,c,sd)=>wc_wash(q,[[x0-6,y0],[x0+6,y0],[hx+5,-16],[x1+4,-3],[x1+4,0],[x1-5,0],[x1-4,-3],[hx-4,-16]],c,{kind:"limb",lw:1,seed:sd});
  // the far legs, in shade; the body, its back dipping a little to the hip bones, the belly hanging; the near legs
  leg(-38,-36,-37,-38,dk,v+11);leg(44,-38,41,47,dk,v+12);
  const body=cp_sm([[-48,-60],[-38,-73],[-6,-71],[28,-72],[44,-76],[58,-71],[62,-56],[58,-38],[50,-31],[36,-27],[10,-24],[-18,-25],[-38,-31],[-48,-44]]);
  wc_wash(q,body,col,{kind:"coat",lw:1.2,seed:v+3});
  q.save();wc_tr(q,body);q.clip();q.fillStyle=rgba(wh,0.9);q.beginPath();q.ellipse(4,-24,34,9,0,0,TAU);q.fill();
  // today's cattle are black and white: white patches over the body
  if(v===2||v===3)for(const [x,y,rx,ry,a] of [[-30,-58,14,11,0.4],[12,-62,18,12,-0.3],[46,-46,12,15,0.2],[-8,-36,16,8,0]]){q.beginPath();for(let i=0;i<14;i++){const an=i/14*TAU,r=1+0.18*Math.sin(an*3+x);q.lineTo(x+Math.cos(an+a)*rx*r,y+Math.sin(an+a)*ry*r);}q.closePath();q.fill();}
  const g=q.createLinearGradient(0,-76,0,-24);g.addColorStop(0,"rgba(255,255,255,0.18)");g.addColorStop(1,"rgba(0,0,0,0.12)");q.fillStyle=g;q.fillRect(-60,-80,130,60);q.restore();
  if(!ox)wc_flat(q,cp_sm([[34,-30],[46,-31],[47,-24],[40,-21],[34,-24]]),[232,180,170],1,"udder");
  leg(-28,-36,-28,-29,col,v+13);leg(52,-40,50,56,col,v+14);
  // the tail, with its tuft
  q.save();q.strokeStyle=rgba(dk,1);q.lineWidth=2.4;q.lineCap="round";q.beginPath();q.moveTo(58,-69);q.quadraticCurveTo(66,-44,63,-16);q.stroke();q.fillStyle=rgba(wc_dim(col,0.4),1);q.beginPath();q.ellipse(63,-13,3.5,6,0,0,TAU);q.fill();q.restore();
  // the neck and head: up, or down to the grass; white faced, the muzzle darker, short horns curving up, an ear, an eye
  const H=graze?{p:[-74,-38],m:[-84,-6],j:[-70,-6],t:[-60,-30]}:{p:[-70,-74],m:[-88,-50],j:[-74,-44],t:[-62,-64]};
  wc_wash(q,cp_sm([[-40,-72],[H.p[0]+8,H.p[1]-2],[H.t[0],H.t[1]],[-50,-44],[-46,-56]]),col,{kind:"coat",lw:1.1,seed:v+5});
  const head=cp_sm([[H.p[0],H.p[1]-4],[H.p[0]+8,H.p[1]+2],[H.j[0]+4,H.j[1]],[H.m[0]+2,H.m[1]+2],[H.m[0]-3,H.m[1]-4],[H.p[0]-8,H.p[1]+4]]);
  wc_wash(q,head,wh,{kind:"head",lw:1.1,seed:v+6});q.save();wc_tr(q,head);q.clip();q.fillStyle=rgba([196,150,140],0.8);q.beginPath();q.ellipse(H.m[0],H.m[1],8,6,graze?1.2:0.7,0,TAU);q.fill();q.restore();
  q.save();q.strokeStyle=rgba([226,216,190],1);q.lineWidth=3;q.lineCap="round";q.beginPath();q.moveTo(H.p[0]+2,H.p[1]-3);q.quadraticCurveTo(H.p[0]+8,H.p[1]-10,H.p[0]+5,H.p[1]-15);q.stroke();
  q.fillStyle=rgba(col,1);q.beginPath();q.ellipse(H.p[0]+10,H.p[1]+2,7,3.5,graze?0.9:0.3,0,TAU);q.fill();q.fillStyle=rgba([40,30,26],0.9);q.beginPath();
  q.arc(lerp(H.p[0],H.m[0],0.32)+2,lerp(H.p[1],H.m[1],0.32),1.8,0,TAU);q.fill();q.restore();});}
function cp_cow(ctx,x,y,k,v,flip){const c=cp_cowC(v||0);ctx.save();ctx.translate(x,y);ctx.scale(flip?-k:k,k);ctx.drawImage(c,-84,-112);ctx.restore();}
// a pollard willow: a short thick trunk, a round head of thin shoots; (x, y) its foot, h its height
function cp_willow(ctx,x,y,h,depth,seed){wc_wash(ctx,[[x-h*0.09,y],[x-h*0.1,y-h*0.42],[x-h*0.13,y-h*0.5],[x+h*0.12,y-h*0.5],[x+h*0.09,y-h*0.42],[x+h*0.08,y]],CP.timber,{depth,kind:"trunk",lw:1.1,seed});
  const R=wc_rng(seed),parts=[];for(let i=0;i<6;i++){const a=-Math.PI*(0.1+0.8*R());parts.push(wc_ell(x+Math.cos(a)*h*0.2,y-h*0.66+Math.sin(a)*h*0.16,h*(0.16+R()*0.08),h*(0.2+R()*0.07),18));}
  wc_wash(ctx,parts,R()<0.5?CP.willow:CP.willowDk,{depth,kind:"tree",seed:seed+1});}
// a stone church far off: a square tower with a low spire, its nave behind; (x, y) the tower's foot, k its scale (1 = 160 px tall)
function cp_church(ctx,x,y,k,depth){wc_part(ctx,wc_rect(x+14*k,y-62*k,110*k,62*k),CP.stone,depth);wc_part(ctx,[[x+10*k,y-62*k],[x+128*k,y-62*k],[x+116*k,y-92*k],[x+22*k,y-92*k]],CP.slate,depth);
  wc_part(ctx,wc_rect(x-22*k,y-120*k,40*k,120*k),wc_lit(CP.stone,0.05),depth);wc_part(ctx,[[x-26*k,y-120*k],[x+22*k,y-120*k],[x-2*k,y-166*k]],CP.slate,depth);
  wc_flat(ctx,wc_rect(x-8*k,y-96*k,10*k,16*k),CP.stoneDk,depth,"window");}
// a line of low trees and bushes along far land
function cp_hedge(ctx,f,x0,x1,h,depth,seed,col){const R=wc_rng(seed),parts=[];for(let x=x0;x<x1;x+=h*(0.5+R()*0.6)){const hh=h*(0.5+R()*0.7);parts.push(wc_ell(x,f(x)-hh*0.45,hh*(0.6+R()*0.3),hh*0.5,16));}
  wc_wash(ctx,parts,col||CP.willowDk,{depth,kind:"tree",line:false,seed});}

/* ---------- the polder, from a farm's mound ---------- */
// The land behind the dike, from a farm's mound, the eye 3.2 m up: long narrow fields between ditches of still water run away from us
// to the dike, a long green bank across the land, a track at its foot and farms on mounds beside it. The dike is higher than the eye,
// so the river behind it doesn't show: only a boat's sail gliding along above the dike (cp_sail), and the far bank's elms and a
// church's tower. Before there's a dike (o.stage "wet", then "dry"), the river runs at the land's own level, and the whole boat shows.
// CP_A: the camera; the dike's inner foot (Z), its crest (Z, height), the river's level behind it, the far bank (Z); the ditches (X);
// the farms by the track ([X, Z, seed, scale]); the farm in the fields; the willows; the cows ([X, Z, kind, flip]); where a farmer cuts
// a ditch's side near us; the breach, where the river comes through in the flood (X, half its width); the boat (X at the start, speed)
const CP_A={C:{F:1300,hz:470,eye:3.2,yaw:0.06},toe:78,crest:[84,4.4],water:2.6,far:300,
  ditch:[-236,-201,-167,-134,-102,-71,-41,-6,22,51,81,112,144,177,211,246],
  farms:[[-44,68,8,1],[58,69,11,1]],farm:[-26,52,13],willows:[[-60,70],[-31,71],[-26,64],[44,70],[71,71],[-38,55],[-13,57],[-30,47]],
  cows:[[12,40,0,0],[16,44,1,1],[34,30,0,1],[40,34,2,0],[-50,60,1,0],[26,58,2,1]],dig:[-4.4,12.5],breach:[22,6],sail:[0,2]};
// the dike's crest height at X: its full height, or lowered where the breach is cut (cut, 0 to 1)
const cp_aCrest=(X,cut)=>CP_A.crest[1]-(CP_A.crest[1]-0.9)*(cut||0)*Math.pow(clamp(1-Math.abs(X-CP_A.breach[0])/CP_A.breach[1],0,1),0.6);
// a point of the polder to the frame, a shape of them, and pixels to a metre at a point
const cp_a=(X,Y,Z)=>cp_pj(CP_A.C,X,Y,Z),cp_aP=L=>cp_proj(CP_A.C,L),cp_aK=(X,Z)=>CP_A.C.F/cp_z(CP_A.C,X,Z);
// the wash's depth for a point so far away: far things are paler and softer
const cp_dep=Z=>clamp(1.05-Z/160,0.3,1);
// open water lying on the land: paper first, so it's light, then the sky's grey-blue, lightest at its far edge, a dark line where its
// far bank meets it, a few glints
function cp_pool(ctx,pts,depth,seed){wc_wash(ctx,pts,mix(CP.ditch,CP.river,0.4),{kind:"ground",line:false,depth,seed,a:0.86});const b=wc_bbox(pts),R=wc_rng(seed);
  ctx.save();wc_tr(ctx,pts);ctx.clip();ctx.globalCompositeOperation="screen";const g=ctx.createLinearGradient(0,b.y0,0,b.y1);g.addColorStop(0,"rgba(240,244,248,0.42)");
  g.addColorStop(0.5,"rgba(240,244,248,0.1)");g.addColorStop(1,"rgba(240,244,248,0)");ctx.fillStyle=g;ctx.fillRect(b.x0,b.y0,b.w,b.h);
  // the far bank's shade: the outline dropped a little, so only its far side lands inside
  ctx.globalCompositeOperation="multiply";ctx.strokeStyle=rgba(wc_dim(CP.sedge,0.4),0.55);ctx.lineWidth=Math.max(1.2,b.h*0.14);ctx.save();ctx.translate(0,b.h*0.1);wc_tr(ctx,pts);ctx.stroke();ctx.restore();
  ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(255,255,255,0.35)";
  for(let i=0;i<2;i++)ctx.fillRect(b.x0+b.w*(0.15+R()*0.5),b.y0+b.h*(0.35+R()*0.4),b.w*(0.08+R()*0.16),Math.max(1,b.h*0.04));ctx.restore();}
// reeds and sedge: a clump of thin blades from a point; k px a metre there
function cp_reeds(ctx,x,y,k,R,n,col){ctx.save();ctx.lineCap="round";for(let j=0;j<(n||6);j++){const dx=(R()-0.5)*k*0.5,h=k*(0.6+R()*0.9);ctx.strokeStyle=rgba(col||(R()<0.5?CP.reedDk:wc_dim(CP.sedge,0.2)),0.75);
  ctx.lineWidth=Math.max(0.8,k*0.03);ctx.beginPath();ctx.moveTo(x+dx,y);ctx.quadraticCurveTo(x+dx*1.4,y-h*0.6,x+dx*2+(R()-0.5)*k*0.4,y-h);ctx.stroke();}ctx.restore();}
// o.stage: "wet" (before it's drained: pools and sedge, fewer ditches, no dike), "dry" (drained, no dike yet), "dike" (the default, the
// land sunk behind its dike), "breach" (the dike cut through); o.grey, the grey morning after the storm of 1953; o.aerial, seen from
// above (the camera CP_AERIAL), so the dike's top and the river behind it show
function cp_paintPolder(ctx,o){o=o||{};const A=CP_A,C=A.C,P=cp_aP,p=cp_a,R=wc_rng(81),st=o.stage||"dike",wet=st==="wet",dike=st==="dike"||st==="breach",T=A.toe,K=A.crest[0];
  cp_sky(ctx,C.hz+4,o.grey?33:31,{n:o.grey?5:8,top:o.grey?[184,188,198]:null});
  if(o.grey){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([196,198,202],0.78);ctx.fillRect(0,0,W,C.hz+6);ctx.globalCompositeOperation="screen";
    const g=ctx.createLinearGradient(0,C.hz*0.5,0,C.hz+6);g.addColorStop(0,"rgba(240,236,226,0)");g.addColorStop(1,"rgba(240,236,226,0.35)");ctx.fillStyle=g;ctx.fillRect(0,0,W,C.hz+6);ctx.restore();}
  // the far bank: the elms, a church's tower; pale with distance. Behind the dike, only what stands tall shows
  const fy=p(0,o.aerial?A.water:0,A.far)[1];wc_wash(ctx,[[-60,C.hz-2],[W+60,C.hz-2],[W+60,fy+4],[-60,fy+4]],[168,184,150],{kind:"ground",line:false,depth:0.3,seed:84});
  cp_hedge(ctx,()=>fy,-40,W+40,44,0.26,85,[156,172,140]);cp_church(ctx,520,fy,0.64,0.28);
  for(const [x,h] of [[300,58],[760,64],[1380,70],[1640,54]])cp_hedge(ctx,()=>fy,x-40,x+40,h,0.27,x,[146,164,130]);
  // the river: before the dike, at the land's level, wide and grey, its near bank reedy; with the dike, behind it, showing only where it's cut
  if(!dike){const rv=P([[-400,-0.3,T+2],[400,-0.3,T+2],[400,-0.3,A.far-6],[-400,-0.3,A.far-6]]);wc_wash(ctx,rv,CP.river,{kind:"ground",line:false,depth:0.5,seed:86});
    ctx.save();wc_tr(ctx,rv);ctx.clip();ctx.globalCompositeOperation="screen";for(let i=0;i<60;i++){const y=lerp(fy+2,p(0,0,T+2)[1],Math.pow(R(),0.8)),x=R()*W,w=30+R()*120;ctx.fillStyle=rgba([255,255,255],0.14+R()*0.16);ctx.fillRect(x,y,w,1.4);}ctx.restore();
    const R2=wc_rng(87);for(let X=-120;X<160;X+=1.2+R2()*2){const q=p(X,0,T+1),k=cp_aK(X,T+1);if(q[0]<-20||q[0]>W+20)continue;cp_reeds(ctx,q[0],q[1],k*1.4,R2,4);}}
  else if(st==="breach")wc_wash(ctx,P([[-300,A.water,K+5],[300,A.water,K+5],[300,A.water,A.far-20],[-300,A.water,A.far-20]]),CP.river,{kind:"ground",line:false,depth:0.5,seed:86});
  if(dike){
    // from above (o.aerial), the river shows behind the dike, out to its far bank, and the dike's flat top, a path worn along it
    if(o.aerial){const rv=P([[-700,A.water,K+6.6],[700,A.water,K+6.6],[700,A.water,A.far-4],[-700,A.water,A.far-4]]);wc_wash(ctx,rv,CP.river,{kind:"ground",line:false,depth:0.6,seed:86});
      ctx.save();wc_tr(ctx,rv);ctx.clip();ctx.globalCompositeOperation="screen";for(let i=0;i<90;i++){const Z=lerp(K+8,A.far-8,Math.pow(R(),1.3)),q=p((R()-0.5)*2.4*Z,A.water,Z),k=cp_aK(0,Z);
        ctx.fillStyle=rgba([255,255,255],0.12+R()*0.16);ctx.fillRect(q[0],q[1],(2+R()*8)*k,Math.max(1,0.08*k));}ctx.restore();
      wc_wash(ctx,P([[-700,A.water,K+6.6],[700,A.water,K+6.6],[700,A.crest[1],K+3],[-700,A.crest[1],K+3]]),wc_dim(CP.grass3,0.1),{kind:"ground",line:false,depth:0.7,seed:88});
      wc_wash(ctx,P([[-700,A.crest[1],K+3],[700,A.crest[1],K+3],[700,A.crest[1],K-0.05],[-700,A.crest[1],K-0.05]]),mix(CP.grass2,CP.sedge,0.2),{kind:"ground",line:false,depth:0.7,seed:87});
      wc_flat(ctx,P([[-700,A.crest[1]+0.01,K+1.2],[700,A.crest[1]+0.01,K+1.2],[700,A.crest[1]+0.01,K+1.8],[-700,A.crest[1]+0.01,K+1.8]]),wc_lit(CP.clay,0.25),0.7,"path");}
    // the dike: its slope towards us, up to the crest against the sky (above the eye, the crest's top doesn't show); lit at the top, a
    // shade deeper at the foot; a ramp climbs it slantwise; cut through, in the flood, at the breach
    const xs=[];for(let X=-700;X<=700;X+=X>A.breach[0]-14&&X<A.breach[0]+14?1:20)xs.push(X);
    const slope=P([...xs.map(X=>[X,0,T]),...xs.slice().reverse().map(X=>[X,cp_aCrest(X,st==="breach"?1:0),K])]);
    wc_wash(ctx,slope,mix(CP.grass2,CP.sedge,0.3),{kind:"ground",line:false,depth:0.7,seed:89});
    ctx.save();wc_tr(ctx,slope);ctx.clip();const sb=wc_bbox(slope),g=ctx.createLinearGradient(0,p(0,A.crest[1],K)[1],0,p(0,0,T)[1]);g.addColorStop(0,"rgba(255,250,226,0.34)");g.addColorStop(0.7,"rgba(255,250,226,0)");g.addColorStop(1,"rgba(60,80,40,0.22)");
    ctx.fillStyle=g;ctx.fillRect(sb.x0,sb.y0,sb.w,sb.h);ctx.restore();
    cp_grass(ctx,slope,CP.grass2,520,90,cp_aK(0,T)*0.9,cp_aK(0,K),p(0,0,T)[1],p(0,A.crest[1],K)[1]);
    wc_flat(ctx,P([[-58,0.02,T-0.2],[-53,0.02,T-0.2],[-17,A.crest[1]+0.02,K],[-22,A.crest[1]+0.02,K]]),wc_lit(CP.clay,0.3),0.7,"ramp");
    // the crest's edge against the sky, with tufts along it; the shade along the foot
    ctx.save();ctx.strokeStyle=rgba(wc_dim(CP.grass2,0.3),0.75);ctx.lineCap="round";ctx.lineWidth=1.3;for(let X=-400;X<400;X+=0.8){if(st==="breach"&&Math.abs(X-A.breach[0])<A.breach[1])continue;
      const q=p(X,A.crest[1],K);if(q[0]<-10||q[0]>W+10)continue;ctx.beginPath();ctx.moveTo(q[0],q[1]+1);ctx.lineTo(q[0]+(R()-0.5)*3,q[1]-1-R()*4);ctx.stroke();}
    ctx.strokeStyle=rgba(wc_dim(CP.grass3,0.35),0.35);ctx.lineWidth=3;ctx.beginPath();const f0=p(-200,0,T),f1=p(300,0,T);ctx.moveTo(f0[0],f0[1]-1);ctx.lineTo(f1[0],f1[1]-1);ctx.stroke();ctx.restore();
    // the track along the dike's foot, rutted, and the ditch on its near side
    const track=P([[-700,0,T-0.4],[700,0,T-0.4],[700,0,T-5],[-700,0,T-5]]);wc_wash(ctx,track,wc_lit(CP.clay,0.36),{kind:"ground",line:false,depth:0.72,seed:95,a:0.95});
    ctx.save();ctx.strokeStyle=rgba(CP.clayDk,0.35);ctx.lineWidth=1.4;for(const z of [T-1.6,T-3.4]){const a=p(-400,0,z),b=p(400,0,z);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
    cp_water(ctx,P([[-700,0,T-5.5],[700,0,T-5.5],[700,0,T-7.2],[-700,0,T-7.2]]),CP.ditch,0.72,97);}
  // the fields, from the track's ditch (or the river's bank) to our feet, between the ditches: each its own green, or the yellow-green of
  // hay; before it's drained, sedge and rough grass, and only every other ditch is dug
  const D=wet?A.ditch.filter((d,i)=>i%2===1):A.ditch,cols=[CP.grass2,CP.hay,CP.grass,CP.grass3,CP.grass2,CP.sedge,CP.grass,CP.hay],dw=1.0,zf=dike?T-7.6:T;
  for(let i=0;i<D.length-1;i++){const a=D[i]+dw,b=D[i+1]-dw,col=wet?(i%2?CP.sedge:mix(CP.grass3,CP.sedge,0.5)):cols[(i*3+1)%cols.length],pts=P([[a,0,zf],[b,0,zf],[b,0,0],[a,0,0]]);
    if(pts.length<3||Math.max(...pts.map(q=>q[0]))<-60||Math.min(...pts.map(q=>q[0]))>W+60)continue;
    wc_wash(ctx,pts,col,{kind:"field",depth:0.9,seed:100+i,a:0.92});
    // the field's grain, running away from us as it was drained; mown rows on the hay; long shadows of cloud across them
    ctx.save();wc_tr(ctx,pts);ctx.clip();ctx.lineCap="round";const hay=col===CP.hay,n=hay?12:6;for(let j=1;j<n;j++){const X=lerp(a,b,j/n),q0=p(X,0,zf),q1=p(X,0,4);
      ctx.strokeStyle=rgba(wc_dim(col,hay?0.2:0.14),hay?0.4:0.24);ctx.lineWidth=hay?2.4:1.6;ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.stroke();}ctx.restore();
    cp_grass(ctx,pts,col,260,104+i,cp_aK(0,6),cp_aK(0,zf),H,p(0,0,zf)[1]);}
  // the ditches: still water, the sky's light in them; brim-full before the land is drained
  for(let i=0;i<D.length;i++){const w=wet?1.5:dw,pts=P([[D[i]-w,0,zf+(dike?0.6:0)],[D[i]+w,0,zf+(dike?0.6:0)],[D[i]+w,0,0],[D[i]-w,0,0]]);
    if(pts.length<3||Math.max(...pts.map(q=>q[0]))<-60||Math.min(...pts.map(q=>q[0]))>W+60)continue;(wet?cp_pool:cp_water)(ctx,pts,CP.ditch,0.9,120+i);}
  // wet: pools of open water lying over the fields, and clumps of sedge and reed
  if(wet){const R2=wc_rng(141);for(let i=0;i<40;i++){const Z=7+Math.pow(R2(),1.2)*66,X=(R2()-0.5)*1.5*Z,r=(0.6+R2()*1.1)*(1+Z*0.04),L=[],f1=R2()*TAU,f2=R2()*TAU,f3=R2()*TAU;
      for(let k=0;k<24;k++){const a=k/24*TAU,rr=r*(1+0.2*Math.sin(2*a+f1)+0.1*Math.sin(3*a+f2)+0.05*Math.sin(5*a+f3));L.push([X+Math.cos(a)*rr*1.7,0.01,Z+Math.sin(a)*rr]);}if(X>-9&&X<4&&Z<22)continue;const pts=P(L);if(pts.length>2)cp_pool(ctx,pts,cp_dep(Z),160+i);}
    for(let i=0;i<240;i++){const Z=5+Math.pow(R2(),1.2)*66,X=(R2()-0.5)*1.6*Z,q=p(X,0,Z);if(q[0]<-20||q[0]>W+20||q[1]>H+40)continue;cp_reeds(ctx,q[0],q[1],cp_aK(X,Z),R2,5);}}
  // the willows, the farms, the haystack and the cattle; in the flood, they're drawn every frame, standing in the water (cp_polderThings)
  if(st!=="breach")cp_polderThings(ctx,{wet,aerial:o.aerial});
  // near: the field we stand in, its grass tall, tussocks, and buttercups once it's dry; reeds along the ditch at the left
  const ny=p(0,0,16)[1];cp_grass(ctx,[[-40,ny],[W+40,ny],[W+40,H+20],[-40,H+20]],wet?CP.sedge:CP.grass,300,149,200,110,H,ny);
  const R3=wc_rng(151);for(let i=0;i<34;i++){const Z=5+R3()*24,X=-4+R3()*(Z*0.9),q=p(X,0,Z),k=cp_aK(X,Z);if(q[0]<-30||q[0]>W+30)continue;cp_reeds(ctx,q[0],q[1],k*0.45,R3,7,wc_dim(wet?CP.sedge:CP.grass3,0.25));}
  if(!wet){ctx.save();for(let i=0;i<90;i++){const Z=5+Math.pow(R3(),0.8)*30,X=-4+R3()*(Z*1.1),q=p(X,0.25,Z),k=cp_aK(X,Z);if(q[0]<-10||q[0]>W+10)continue;
    ctx.fillStyle=rgba([238,206,72],0.85);ctx.beginPath();ctx.arc(q[0],q[1],Math.max(1.4,k*0.035),0,TAU);ctx.fill();}ctx.restore();}
  for(let i=0;i<70;i++){const Z=4+R3()*30,X=D.includes(-6)?(-6+(R3()<0.5?-1.3:1.3)+(R3()-0.5)*0.5):-6,q=p(X,0,Z),k=cp_aK(X,Z);if(q[0]<-40)continue;cp_reeds(ctx,q[0],q[1],k*0.9,R3,5);}}
// the willows, the farms on their mounds, the farm out in the fields and its haystack, the cows; far to near. o.wet: no hay, cattle or
// smoke yet; o.water(X, Z): how deep the flood is there, so each thing stands in it (a band of the flood's water over its foot, and a
// pale line where it meets it); o.cows, cattle that move ([X, Z, kind, flip] each), in place of the grazing ones
function cp_polderThings(ctx,o){o=o||{};const A=CP_A,p=cp_a,wet=o.wet,dp=o.water,things=[];
  const at=(X,Z,w,fn)=>dp?cp_inWater(ctx,X,Z,dp(X,Z),w,cp_a,cp_aK,fn):fn();
  A.willows.forEach(([X,Z])=>things.push([Z,()=>at(X,Z,1.4,()=>{const q=p(X,0,Z);cp_willow(ctx,q[0],q[1],cp_aK(X,Z)*6,cp_dep(Z),(X*3+Z*7+400)|0);})]));
  A.farms.forEach(([X,Z,seed,sc])=>things.push([Z,()=>at(X,Z,17*sc,()=>{const q=p(X,0,Z);cp_farm(ctx,q[0],q[1],cp_aK(X,Z)*0.045*sc,{seed,flip:seed%2===0,smoke:!wet&&!dp,modern:o.modern});})]));
  const F=A.farm;if(!o.aerial)things.push([F[1],()=>at(F[0],F[1],17,()=>{const q=p(F[0],0,F[1]);cp_farm(ctx,q[0],q[1],cp_aK(F[0],F[1])*0.045,{seed:F[2],smoke:!wet&&!dp,modern:o.modern});})]);
  if(!wet&&!o.modern&&!o.aerial)things.push([F[1]-3,()=>at(F[0]+11,F[1]-3,6,()=>{const q=p(F[0]+11,0,F[1]-3);cp_hayStack(ctx,q[0],q[1],cp_aK(F[0]+11,F[1]-3));})]);
  if(!wet)(o.cows||A.cows).forEach(([X,Z,v,fl])=>things.push([Z,()=>at(X,Z,2.4,()=>{const q=p(X,0,Z);cp_cow(ctx,q[0],q[1],cp_aK(X,Z)*0.016,v,fl);})]));
  things.sort((a,b)=>b[0]-a[0]).forEach(t=>t[1]());}
// a haystack under its roof (a hay barrack): four poles, the stack rounded on top, and a low roof of reed high on the poles; (x, y) its
// foot, k px a metre
function cp_hayStack(ctx,x,y,k){ctx.save();ctx.strokeStyle=rgba(CP.timberDk,0.85);ctx.lineWidth=Math.max(1,0.16*k);ctx.lineCap="round";
  for(const dx of [-2.7,-0.9,0.9,2.7]){ctx.beginPath();ctx.moveTo(x+dx*k,y);ctx.lineTo(x+dx*k,y-6.4*k);ctx.stroke();}ctx.restore();
  wc_part(ctx,[[x-2.5*k,y],[x+2.5*k,y],[x+2.6*k,y-2.2*k],[x+2.2*k,y-3.6*k],[x+1.2*k,y-4.3*k],[x-1.2*k,y-4.3*k],[x-2.2*k,y-3.6*k],[x-2.6*k,y-2.2*k]],CP.hay,0.8,{seed:153});
  wc_part(ctx,[[x-3.3*k,y-5.6*k],[x+3.3*k,y-5.6*k],[x+2.6*k,y-6.4*k],[x,y-7.6*k],[x-2.6*k,y-6.4*k]],CP.reed,0.8,{seed:155});}
// a boat on the river, gliding along: a cog's tarred hull, its mast, a square sail with a stripe of madder, a pennant. Behind the dike
// (o.dike), only what rises above the crest shows; before there's a dike, the whole boat, on water at the land's own level. X along the
// river, t the time (the sail breathes, the pennant flicks)
function cp_boat(ctx,X,t,o){o=o||{};const A=CP_A,Z=o.dike?A.crest[0]+30:150,wy=o.dike?A.water:-0.3,b=cp_a(X,wy,Z),k=cp_aK(X,Z),top=cp_a(X,wy+12,Z);ctx.save();
  if(o.dike){const cl=cp_a(X,A.crest[1],A.crest[0])[1];ctx.beginPath();ctx.rect(b[0]-10*k,0,20*k,cl-1);ctx.clip();}
  // the hull, low in the water, its stern and bow raised
  const hx=b[0],hy=b[1];ctx.fillStyle=rgba([84,66,52],0.95);ctx.beginPath();ctx.moveTo(hx-7.6*k,hy-2.4*k);ctx.quadraticCurveTo(hx-6.4*k,hy+0.1*k,hx-4*k,hy+0.2*k);ctx.lineTo(hx+4.6*k,hy+0.2*k);
  ctx.quadraticCurveTo(hx+7*k,hy,hx+8*k,hy-2.6*k);ctx.lineTo(hx+6.6*k,hy-1.8*k);ctx.lineTo(hx-6.4*k,hy-1.6*k);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba([140,110,80],0.7);ctx.lineWidth=Math.max(1,0.1*k);ctx.beginPath();ctx.moveTo(hx-6.6*k,hy-1.2*k);ctx.lineTo(hx+6.8*k,hy-1.3*k);ctx.stroke();
  ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(255,255,255,0.35)";ctx.fillRect(hx-6*k,hy+0.3*k,12*k,Math.max(1,0.12*k));ctx.globalCompositeOperation="source-over";
  // the mast, the yard, the sail, the pennant
  ctx.strokeStyle=rgba(CP.timberDk,0.9);ctx.lineWidth=Math.max(1.2,0.18*k);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(hx,hy-1.6*k);ctx.lineTo(top[0],top[1]);ctx.stroke();
  const sw=4.6*k,sh=6.8*k,sy=top[1]+0.9*k,bel=Math.sin(t*0.9)*0.3*k;ctx.fillStyle=rgba([238,230,210],0.96);ctx.beginPath();ctx.moveTo(top[0]-sw/2,sy);ctx.lineTo(top[0]+sw/2,sy);
  ctx.quadraticCurveTo(top[0]+sw/2+1.1*k+bel,sy+sh/2,top[0]+sw/2,sy+sh);ctx.lineTo(top[0]-sw/2,sy+sh);ctx.quadraticCurveTo(top[0]-sw/2+0.9*k+bel,sy+sh/2,top[0]-sw/2,sy);ctx.fill();
  ctx.strokeStyle=rgba([150,130,100],0.6);ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=rgba([170,80,60],0.5);ctx.fillRect(top[0]-sw/2,sy+sh*0.4,sw,sh*0.14);
  ctx.strokeStyle=rgba(CP.timberDk,0.85);ctx.lineWidth=Math.max(1,0.12*k);ctx.beginPath();ctx.moveTo(top[0]-sw/2-0.3*k,sy);ctx.lineTo(top[0]+sw/2+0.3*k,sy);ctx.stroke();
  ctx.fillStyle=rgba([170,70,56],0.9);ctx.beginPath();ctx.moveTo(top[0],top[1]);ctx.lineTo(top[0]-1.6*k,top[1]+0.3*k+Math.sin(t*3)*0.12*k);ctx.lineTo(top[0],top[1]+0.6*k);ctx.fill();ctx.restore();}

/* ---------- the land cut through: it sinks below the river ---------- */
// A cut through the land, as a drawing in a book would show it: a slice of it, its top seen a little from above: the field on the left
// with its peat under it, the bank in the middle with (once it's built) the dike on it, the river on the right, the old clay under them
// all; far behind, the land along the horizon. The field is drawn every frame (cp_secField), so its peat can shrink as it dries and its
// top sink, below the river's level; the dike too (cp_secDike), so it can be built up, layer by layer. CP_C: the far horizon; the
// slice's depth as seen (its back edge's offset); the field's top before and after it sinks; the river's level and bed; the top of the
// old clay; the bank's top and its edges; the dike's foot, crest and top
const CP_C={hz:350,off:[18,-48],top0:470,top1:590,water:490,bed:660,clay:760,bank:{y:470,x0:1050,x1:1400,in0:960},dike:{x0:1060,x1:1400,c0:1170,c1:1290,cy:380}};
// where the field's edge meets the bank's slope, at height y; the top of a stretch of the cut, seen going back to the slice's far side
const cp_cEdge=y=>{const B=CP_C.bank;return lerp(B.x0,B.in0,clamp((y-B.y)/(CP_C.top1-B.y),0,1));};
const cp_cBack=(a,b)=>{const o=CP_C.off;return[a,b,[b[0]+o[0],b[1]+o[1]],[a[0]+o[0],a[1]+o[1]]];};
function cp_paintSection(ctx){const S=CP_C,B=S.bank,R=wc_rng(141),o=S.off;cp_sky(ctx,S.hz+4,43,{n:6});
  // the far land along the horizon: fields, farms, willows, a church; pale with distance
  wc_wash(ctx,[[-60,S.hz-3],[W+60,S.hz-3],[W+60,S.top1+40],[-60,S.top1+40]],[176,190,156],{kind:"ground",line:false,depth:0.32,seed:143});
  ctx.save();ctx.fillStyle=rgba(mix(CP.ditch,[176,190,156],0.4),0.7);for(let i=0;i<9;i++){const y=S.hz+6+Math.pow(i/8,1.6)*(S.top1-S.hz);ctx.fillRect(-40,y,W+80,1+i*0.3);}ctx.restore();
  cp_hedge(ctx,()=>S.hz+2,-40,W+40,12,0.28,145,[156,174,134]);for(const [x,s] of [[260,0.11],[620,0.09],[1580,0.1]])cp_farm(ctx,x,S.hz+5,s,{seed:9,smoke:false});cp_church(ctx,1760,S.hz+3,0.3,0.3);
  // under everything, the old clay
  wc_wash(ctx,[[-60,S.clay],[W+60,S.clay],[W+60,H+60],[-60,H+60]],CP.deep,{kind:"ground",line:false,depth:1,seed:153});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(CP.deep,0.2),0.3);ctx.lineWidth=2;for(let y=S.clay+40;y<H;y+=46){ctx.beginPath();ctx.moveTo(-40,y);for(let x=-40;x<=W+40;x+=60)ctx.lineTo(x,y+Math.sin(x/140+y)*5);ctx.stroke();}ctx.restore();
  // the river beyond the bank: its surface, going back, the light on it; its water, cut, deepening in colour to its bed of silt
  const ex=B.x1+40,rs=cp_cBack([ex,S.water],[W+60,S.water]);wc_wash(ctx,rs,CP.river,{kind:"ground",line:false,depth:0.7,seed:149});
  ctx.save();wc_tr(ctx,rs);ctx.clip();ctx.globalCompositeOperation="screen";for(let i=0;i<24;i++){const u=R(),y=S.water+o[1]*u,x=ex+o[0]*u+R()*520,w=30+R()*90;ctx.fillStyle=rgba([255,255,255],0.18+R()*0.18);ctx.fillRect(x,y,w,1.6);}ctx.restore();
  const cutR=[[ex,S.water],[W+60,S.water],[W+60,S.bed],[B.x1+170,S.bed]];wc_wash(ctx,cutR,CP.riverDk,{kind:"ground",line:false,depth:0.95,seed:151,a:0.9});
  ctx.save();wc_tr(ctx,cutR);ctx.clip();const g=ctx.createLinearGradient(0,S.water,0,S.bed);g.addColorStop(0,"rgba(255,255,255,0.42)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.globalCompositeOperation="screen";ctx.fillStyle=g;ctx.fillRect(B.x1,S.water,W,S.bed-S.water);ctx.restore();
  wc_wash(ctx,[[B.x1+170,S.bed],[W+60,S.bed],[W+60,S.clay+4],[B.x1+60,S.clay+4]],mix(CP.clay,CP.deep,0.5),{kind:"ground",line:false,depth:1,seed:155});
  // the bank: its grassy top and its edge into the river, going back; peat, as under the field, from its top down to the clay
  const tp=cp_cBack([B.x0,B.y],[B.x1,B.y]),ed=cp_cBack([B.x1,B.y],[ex,S.water]);wc_wash(ctx,tp,mix(CP.grass,CP.sedge,0.3),{kind:"ground",line:false,depth:0.8,seed:159});
  wc_wash(ctx,ed,wc_dim(mix(CP.grass,CP.sedge,0.3),0.12),{kind:"ground",line:false,depth:0.8,seed:160});cp_grass(ctx,tp,CP.grass,60,161,14,10,B.y,B.y+o[1]);
  const bank=[[B.x0,B.y],[B.x1,B.y],[ex,S.water],[B.x1+170,S.bed],[B.x1+60,S.clay+4],[B.in0-180,S.clay+4],[B.in0,S.top1]];cp_peat(ctx,bank,157);
  wc_wash(ctx,wc_band([[B.x0-6,B.y],[B.x1,B.y],[ex,S.water+2]],5,5),CP.turf,{kind:"ground",line:false,depth:1,seed:163});
  // the water's edge against the bank, and reeds
  ctx.save();ctx.strokeStyle=rgba(CP.riverDk,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ex-4,S.water);ctx.lineTo(W+20,S.water);ctx.stroke();ctx.restore();
  for(let i=0;i<10;i++)cp_reeds(ctx,ex-26+R()*40,S.water+2-R()*12,34,R,4);}
// peat, cut: brown in uneven layers, with its fibres of old reed and moss, darker where it's wetter below
function cp_peat(ctx,pts,seed){const R=wc_rng(seed),b=wc_bbox(pts);wc_wash(ctx,pts,CP.peat,{kind:"ground",line:false,seed});ctx.save();wc_tr(ctx,pts);ctx.clip();
  for(let i=0;i<9;i++){const y=b.y0+30+i*(b.h/9)+R()*14;ctx.fillStyle=rgba(i%2?CP.peatLt:CP.peatDk,0.26);ctx.beginPath();ctx.moveTo(b.x0-10,y);for(let x=b.x0-10;x<=b.x1+10;x+=40)ctx.lineTo(x,y+Math.sin(x/90+i)*6);ctx.lineTo(b.x1+10,y+26);ctx.lineTo(b.x0-10,y+26);ctx.fill();}
  ctx.strokeStyle=rgba(CP.peatLt,0.45);ctx.lineWidth=1.4;ctx.lineCap="round";for(let i=0;i<b.w*b.h/900;i++){const x=b.x0+R()*b.w,y=b.y0+R()*b.h,l=6+R()*16,a=(R()-0.5)*0.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);ctx.stroke();}
  const g=ctx.createLinearGradient(0,b.y0,0,b.y1);g.addColorStop(0,"rgba(40,28,20,0)");g.addColorStop(1,"rgba(40,28,20,0.25)");ctx.globalCompositeOperation="multiply";ctx.fillStyle=g;ctx.fillRect(b.x0,b.y0,b.w,b.h);ctx.restore();}
// the field's peat, cut, kept tall: as it dries it shrinks, so less of it shows, from the top down; its turf on top
function cp_secFieldC(){return wc_kept("cpSecField",1180,420,q=>{q.translate(40,0);cp_peat(q,[[-40,20],[1140,20],[1140,420],[-40,420]],173);
  wc_wash(q,[[-40,14],[1140,14],[1140,32],[-40,32]],CP.turf,{kind:"ground",line:false,seed:175});});}
// the field's top, seen going back to the slice's far side: grass, a ditch running across it, the grain of the land
function cp_secTopC(){return wc_kept("cpSecTop",1300,60,q=>{const R=wc_rng(181);wc_wash(q,[[0,0],[1300,0],[1300,60],[0,60]],mix(CP.grass,CP.grass2,0.3),{kind:"ground",line:false,seed:183});
  q.fillStyle=rgba(CP.ditch,0.85);q.fillRect(0,22,1300,3);q.fillStyle=rgba(wc_dim(CP.grass,0.15),0.4);q.fillRect(0,19,1300,2);
  q.strokeStyle=rgba(wc_dim(CP.grass,0.25),0.35);q.lineCap="round";for(let i=0;i<260;i++){const y=R()*60,x=R()*1300,k=1+y/60*2;q.lineWidth=0.8+k*0.4;q.beginPath();q.moveTo(x,y);q.lineTo(x+(R()-0.5)*2,y-k*3);q.stroke();}});}
// the field at sink (0 to 1): its top, its edge sloping up to the bank, and its peat cut, down to the clay; a farm on its mound, and a
// cow, go down with it. Returns the field's top
function cp_secField(ctx,sink,o){o=o||{};const S=CP_C,B=S.bank,y=lerp(S.top0,S.top1,easeCam(clamp(sink,0,1))),xe=cp_cEdge(y),of=S.off;
  // the field's top, going back; the bank's slope beside it, grass, going back too
  const top=cp_cBack([-60,y],[xe,y]);ctx.save();wc_tr(ctx,top);ctx.clip();ctx.translate(-60,y);ctx.transform(1,0,of[0]/of[1],1,0,0);ctx.drawImage(cp_secTopC(),-20,of[1],xe+100,-of[1]);ctx.restore();
  if(y>B.y+1){const sl=cp_cBack([xe,y],[B.x0,B.y]);wc_flat(ctx,sl,mix(CP.grass3,CP.sedge,0.25),1,"slope");
    ctx.save();ctx.strokeStyle=rgba(CP.turf,0.9);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(xe,y);ctx.lineTo(B.x0,B.y);ctx.stroke();ctx.restore();}
  // the slice's far edge, a pencil line
  ctx.save();ctx.strokeStyle=rgba(wc_dim(CP.grass3,0.35),0.5);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-60+of[0],y+of[1]);ctx.lineTo(xe+of[0],y+of[1]);ctx.lineTo(B.x0+of[0],B.y+of[1]);ctx.stroke();ctx.restore();
  // the peat, cut: what's left of it, from the field's top down to the clay (shown from its top, so it shrinks from above)
  ctx.save();ctx.beginPath();ctx.moveTo(-40,y-8);ctx.lineTo(xe,y-8);ctx.lineTo(B.in0-180+(xe-B.in0)*0.2,S.clay+6);ctx.lineTo(-40,S.clay+6);ctx.closePath();ctx.clip();
  ctx.drawImage(cp_secFieldC(),-80,y-20);ctx.restore();
  // a farm on its mound, and a cow, on the field's top
  cp_farm(ctx,250,y-12,0.36,{seed:11,smoke:o.smoke!==false});cp_cow(ctx,700,y-20,0.6,0,true);return y;}
// the dike on the bank, built up (h, 0 to 1) in layers of clay, grassed once it's done (grass, 0 to 1): its cut, banded where each layer
// was laid, and its top and slopes going back
function cp_secDikeC(){const S=CP_C,D=S.dike,B=S.bank;return wc_kept("cpSecDike",D.x1-D.x0+40,B.y-D.cy+40,q=>{q.translate(20-D.x0,20-D.cy);const R=wc_rng(191),dk=[[D.x0,B.y+2],[D.c0,D.cy],[D.c1,D.cy],[D.x1,B.y+2]];
  wc_wash(q,dk,CP.clay,{kind:"ground",line:false,seed:193});q.save();wc_tr(q,dk);q.clip();q.strokeStyle=rgba(CP.clayDk,0.4);q.lineWidth=2;
  for(let y=D.cy+16;y<B.y;y+=16){q.beginPath();q.moveTo(D.x0,y+R()*3);q.bezierCurveTo(D.x0+120,y-2,D.x1-120,y+3,D.x1,y);q.stroke();}
  q.fillStyle=rgba(CP.clayDk,0.25);for(let i=0;i<160;i++)q.fillRect(D.x0+R()*(D.x1-D.x0),D.cy+R()*(B.y-D.cy),2+R()*3,1.5);q.restore();});}
function cp_secDike(ctx,h,grass){const S=CP_C,D=S.dike,B=S.bank;if(h<=0.005)return;const top=lerp(B.y,D.cy,h),u=(top-B.y)/(D.cy-B.y),xl=lerp(D.x0,D.c0,u),xr=lerp(D.x1,D.c1,u),
    gr=mix(CP.grass2,CP.sedge,0.3),col=mix(CP.clay,gr,clamp(grass||0,0,1));
  // its top and slopes, going back: bare clay as it's built, then grass; the slope towards the light paler, the far one darker
  for(const [a,b,k] of [[[xr,top],[D.x1,B.y],-0.16],[[xl,top],[xr,top],0],[[D.x0,B.y],[xl,top],0.14]]){const f=cp_cBack(a,b);ctx.fillStyle=rgba(k>0?wc_lit(col,k):wc_dim(col,-k),1);wc_tr(ctx,f);ctx.fill();}
  ctx.save();ctx.strokeStyle=rgba(wc_dim(gr,0.4),0.45);ctx.lineWidth=1.6;ctx.beginPath();const of=S.off;[[D.x0,B.y],[xl,top],[xr,top],[D.x1,B.y]].forEach((p,i)=>i?ctx.lineTo(p[0]+of[0],p[1]+of[1]):ctx.moveTo(p[0]+of[0],p[1]+of[1]));ctx.stroke();ctx.restore();
  // its cut, shown from the bottom up, as it's laid; its skin of turf once it's grassed
  ctx.save();ctx.beginPath();ctx.rect(D.x0-20,top-1,D.x1-D.x0+40,B.y-top+4);ctx.clip();ctx.drawImage(cp_secDikeC(),D.x0-20,D.cy-20);ctx.restore();
  if(grass>0.01){ctx.save();ctx.globalAlpha=clamp(grass,0,1);ctx.strokeStyle=rgba(CP.turf,0.95);ctx.lineWidth=8;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(D.x0,B.y);ctx.lineTo(xl,top);ctx.lineTo(xr,top);ctx.lineTo(D.x1,B.y);ctx.stroke();ctx.restore();}}
// the river's level, a dashed line of blue across the cut, drawn on from the river (p, 0 to 1)
function cp_secLevel(ctx,p,a){if(p<=0||a<=0.01)return;const S=CP_C,x1=S.bank.x1+40,x0=lerp(x1,-40,ease(clamp(p,0,1)));ctx.save();ctx.globalAlpha=a;ctx.setLineDash([22,12]);ctx.lineCap="round";
  ctx.strokeStyle=rgba(wc_dim(CP.river,0.25),0.95);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x1,S.water);ctx.lineTo(x0,S.water);ctx.stroke();ctx.restore();}

/* ---------- the dike, along its crest ---------- */
// Standing above the dike's inner slope, looking along it: the river on the left, higher than the land, the crest running away from
// us, its slope down to a ditch, and the polder on the right with its fields, a farm, cattle. One stretch is slumped (dip): its crest
// sags, its turf worn to bare clay, and on the water's side a scar where the slope has slid. v: "1300" (the slumped stretch), "kept"
// (all of it kept), "today" (a road on top, a canal held higher than the fields, a pumping station), "night" (the storm of 1953).
// CP_D: the camera; the crest's height and the water's; the slumped stretch (Z), its low point; the dike's inner and outer foot (X)
const CP_D={C:{F:1100,hz:330,eye:6.2,cx:0.3},crest:4.4,water:2.6,dip:[22,38],low:3.0,in:11,out:-6.5,far:-190};
// the crest's height at Z, lowered by dip (0 to 1) along the slumped stretch, and lower still where a breach is cut (cut, 0 to 1)
function cp_crestY(Z,dip,cut){const D=CP_D,u=clamp((Z-D.dip[0])/(D.dip[1]-D.dip[0]),0,1),s=Math.pow(Math.sin(Math.PI*u),2),m=(D.dip[0]+D.dip[1])/2;
  return D.crest-(D.crest-D.low)*(dip||0)*s-2.6*(cut||0)*Math.pow(Math.sin(Math.PI*clamp((Z-m+3.5)/7,0,1)),2);}
const CP_DZ=(()=>{const o=[];for(let z=1.2;z<900;z*=1.035)o.push(z);return o;})();
function cp_paintCrest(ctx,v){const D=CP_D,C=D.C,hz=C.hz,pj=(X,Y,Z)=>cp_pj(C,X,Y,Z),R=wc_rng(v==="night"?201:v==="today"?203:205),Z=CP_DZ,dip=v==="1300"?1:0,
    night=v==="night",today=v==="today";
  if(night)cp_sky(ctx,hz+4,61,{n:9,dark:true,top:[150,158,176],lift:1});
  else cp_sky(ctx,hz+4,today?53:51,{n:7});
  // the far bank, left: land, trees and, today, a row of houses; right: the polder going back to the horizon
  wc_wash(ctx,[[-60,hz-3],[W+60,hz-3],[W+60,hz+14],[-60,hz+14]],night?[70,80,96]:[170,186,146],{kind:"ground",depth:0.3,seed:207,line:false});
  cp_hedge(ctx,()=>hz+5,-40,700,13,0.3,209,night?[60,70,84]:[146,168,124]);if(!night)cp_church(ctx,240,hz+6,0.38,0.3);
  if(today){for(let i=0;i<9;i++)wc_part(ctx,wc_rect(330+i*34,hz-14+6*(i%2),28,20),i%3?CP.brick:wc_lit(CP.brick,0.2),0.3);}
  // the water: the river (today, a canal), wide, up to the dike's far slope; the light on it in long strokes
  const wl=Z.map(z=>pj(D.out,D.water,z)),wfar=pj(D.far,D.water,900),water=[[-60,hz+10],[wfar[0],hz+10],...wl.slice().reverse(),[-60,H+60]];
  wc_wash(ctx,water,night?[54,68,92]:today?[118,146,160]:CP.river,{kind:"ground",line:false,depth:0.8,seed:211});
  ctx.save();wc_tr(ctx,water);ctx.clip();ctx.globalCompositeOperation="screen";
  for(let i=0;i<120;i++){const y=lerp(hz+14,H,Math.pow(R(),1.6)),k=(y-hz)/(H-hz),x=R()*940,w=(20+R()*140)*(0.3+k);ctx.fillStyle=rgba([255,255,255],(night?0.06:0.1)+R()*0.14);ctx.fillRect(x,y,w,1+k*2.4);}ctx.restore();
  // the polder, right of the dike's inner foot: the ground, its ditches running across, the fields between them
  const toe=Z.map(z=>pj(D.in,0,z)),gnd=[...toe.slice().reverse(),[W+60,H+60],[W+60,hz+10]];
  wc_wash(ctx,gnd,night?[52,64,70]:CP.grass,{kind:"ground",line:false,depth:0.9,seed:213});
  const dz=[16,27,41,60,86,122,170,240,340,480],cols=today?[CP.grass2,CP.grass,CP.grass2,CP.grass3,CP.grass]:[CP.grass,CP.hay,CP.grass2,CP.sedge,CP.grass3];
  for(let i=0;i<dz.length-1;i++){const a=dz[i]+1,b=dz[i+1]-1,f=[pj(D.in+3.5,0,a),pj(300,0,a),pj(300,0,b),pj(D.in+3.5,0,b)];
    wc_wash(ctx,f,night?wc_dim(cols[i%5],0.6):cols[i%cols.length],{kind:"field",depth:0.9,seed:215+i,a:0.85});cp_grass(ctx,f,cols[i%5],70,217+i,cp_k(C,a),cp_k(C,b),f[0][1],f[2][1]);}
  for(const z of dz){const w=[pj(D.in+3.5,0,z-1),pj(300,0,z-1),pj(300,0,z+1),pj(D.in+3.5,0,z+1)];cp_water(ctx,w,night?[70,84,104]:CP.ditch,0.9,(z|0)+219);}
  // the ditch at the dike's foot, all along it
  const df=Z.map(z=>pj(D.in+1.2,0,z)),df2=Z.map(z=>pj(D.in+3.2,0,z));cp_water(ctx,[...df,...df2.slice().reverse()],night?[70,84,104]:CP.ditch,0.9,221);
  // the dike: its far slope into the water, the crest (sagging where it slumped), the slope down to us; far to near
  const cr=Z.map(z=>[z,cp_crestY(z,dip)]),oL=cr.map(([z,y])=>pj(-1.6,y,z)),iL=cr.map(([z,y])=>pj(1.6,y,z));
  wc_wash(ctx,[...wl,...oL.slice().reverse()],night?[60,70,64]:wc_dim(CP.grass3,0.15),{kind:"ground",line:false,depth:0.85,seed:223});
  wc_wash(ctx,[...oL,...iL.slice().reverse()],night?[78,88,80]:today?CP.asphalt:CP.grass2,{kind:"ground",line:false,depth:0.9,seed:225});
  wc_wash(ctx,[...iL,...toe.slice().reverse()],night?[66,80,70]:CP.grass,{kind:"ground",line:false,depth:0.9,seed:227});
  // the slopes and the crest in the light: soft patches of darker and lighter grass, the slope towards us lit along its top
  const inS=[...iL,...toe.slice().reverse()],outS=[...wl,...oL.slice().reverse()],top=[...oL,...iL.slice().reverse()];
  if(!night){cp_mottle(ctx,inS,900,232,cp_k(C,3),cp_k(C,80),1080,hz+20);cp_mottle(ctx,outS,500,233,cp_k(C,3),cp_k(C,80),1080,hz+20,{dark:[120,146,110]});
    if(!today)cp_mottle(ctx,top,500,234,cp_k(C,3),cp_k(C,80),1080,hz+20);}
  if(today){// the road's edges, worn, and its surface: a darker band where the wheels run, specks of grit
    ctx.save();wc_tr(ctx,top);ctx.clip();const R2=wc_rng(236);for(let i=0;i<1800;i++){const z=Z[Math.floor(Math.pow(R2(),2.2)*Z.length*0.7)],X=-1.6+R2()*3.2,q=pj(X,cp_crestY(z,0),z),k=cp_k(C,z);
      ctx.fillStyle=R2()<0.5?"rgba(70,72,78,0.25)":"rgba(220,220,214,0.25)";ctx.fillRect(q[0],q[1],Math.max(1,k*0.012),Math.max(1,k*0.006));}
    for(const X of [-0.75,0.75]){const L=cr.map(([z,y])=>pj(X-0.3,y+0.01,z)),L2=cr.map(([z,y])=>pj(X+0.3,y+0.01,z));ctx.fillStyle="rgba(80,82,90,0.16)";wc_tr(ctx,[...L,...L2.slice().reverse()]);ctx.fill();}ctx.restore();
    ctx.save();ctx.strokeStyle=rgba([244,244,240],0.8);ctx.lineCap="round";for(const X of [-1.25,1.25]){ctx.lineWidth=2;ctx.beginPath();cr.forEach(([z,y],i)=>{const p=pj(X,y+0.01,z);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.stroke();}ctx.restore();}
  else{// the path worn along the crest: narrow, wandering a little, grass growing into its edges
    const wob=z=>0.06*Math.sin(z*0.7)+0.04*Math.sin(z*1.9+1),p1=cr.map(([z,y])=>pj(-0.24+wob(z)-0.03*Math.sin(z*2.7),y+0.01,z)),p2=cr.map(([z,y])=>pj(0.24+wob(z)+0.03*Math.sin(z*3.1),y+0.01,z)),path=[...p1,...p2.slice().reverse()];
    wc_wash(ctx,path,night?[90,90,84]:wc_lit(CP.clay,0.2),{kind:"ground",line:false,depth:0.85,seed:237,a:0.9});
    // trodden earth: soft darker and lighter patches, a few small stones
    if(!night){cp_mottle(ctx,path,900,238,cp_k(C,3),cp_k(C,60),1080,hz+30,{dark:[178,152,122],size:0.14});
      ctx.save();wc_tr(ctx,path);ctx.clip();const R2=wc_rng(240);for(let i=0;i<160;i++){const z=Z[Math.floor(Math.pow(R2(),2)*Z.length*0.6)],X=wob(z)+(R2()-0.5)*0.44,q=pj(X,cp_crestY(z,dip),z),k=cp_k(C,z),r=Math.max(0.5,k*(0.006+R2()*0.008));
        ctx.fillStyle=rgba(R2()<0.5?[150,136,118]:[226,214,192],0.5+R2()*0.3);ctx.beginPath();ctx.ellipse(q[0],q[1],r,r*0.6,0,0,TAU);ctx.fill();}ctx.restore();
      cp_grass(ctx,path,CP.grass2,260,239,cp_k(C,3),cp_k(C,60),1080,hz+30,true);}}
  // the grass on the slope towards us, and on the crest
  cp_grass(ctx,inS,CP.grass,night?700:9000,229,cp_k(C,4),cp_k(C,60),1080,hz+30,!night);
  if(!today)cp_grass(ctx,top,CP.grass2,night?260:4000,230,cp_k(C,4),cp_k(C,60),1080,hz+30,!night);
  if(!night)cp_grass(ctx,outS,wc_dim(CP.grass3,0.1),3000,240,cp_k(C,4),cp_k(C,60),1080,hz+30,true);
  if(dip){// the slumped stretch: patches of bare clay along the sagging crest, cracked; on the water's side, a scar where the slope has
    // slid, and the earth that slid, slumped at the water's edge
    const z0=D.dip[0],z1=D.dip[1],m=(z0+z1)/2;
    const scar=[];for(let z=m-6;z<=m+6;z+=0.5)scar.push(pj(-1.5,cp_crestY(z,1)-0.04,z));for(let z=m+6;z>=m-6;z-=0.5){const u=(z-m)/6;scar.push(pj(lerp(-1.5,-4.6,1-u*u),lerp(cp_crestY(z,1),D.water+0.5,0.8*(1-u*u)),z));}
    wc_wash(ctx,scar,CP.clay,{kind:"ground",line:false,depth:0.9,seed:231});
    const lump=[];for(let z=m-5;z<=m+5;z+=0.5){const u=(z-m)/5;lump.push(pj(-4.4-1.4*(1-u*u),D.water+0.25,z));}for(let z=m+5;z>=m-5;z-=0.5)lump.push(pj(-4.2,D.water+0.7*(1-Math.pow((z-m)/5,2)),z));
    wc_wash(ctx,lump,wc_dim(CP.clay,0.12),{kind:"ground",line:false,depth:0.9,seed:233});
    for(let i=0;i<9;i++){const zc=lerp(z0+3,z1-3,R()),zr=0.8+R()*2.4,X=-1.2+R()*2.6,pts=[];for(let k=0;k<12;k++){const a=k/12*TAU,rr=(0.7+R()*0.5);pts.push(pj(X+Math.cos(a)*rr*0.8,cp_crestY(zc+Math.sin(a)*zr*rr,1)+0.02,zc+Math.sin(a)*zr*rr));}
      wc_wash(ctx,pts,CP.clayLt,{kind:"ground",line:false,depth:0.9,seed:235+i,a:0.9});}
    ctx.save();ctx.strokeStyle=rgba(CP.clayDk,0.65);ctx.lineWidth=1.6;ctx.lineCap="round";for(let i=0;i<30;i++){const z=lerp(z0+4,z1-4,R()),X=-1.5+R()*3,p=pj(X,cp_crestY(z,1),z);
      ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(R()-0.5)*16,p[1]+(R()-0.3)*6);ctx.lineTo(p[0]+(R()-0.5)*24,p[1]+R()*9);ctx.stroke();}ctx.restore();}
  // the farm, its willows, the cattle; today, a farm with a grey barn, and the pumping station at the dike's foot
  if(today){const b=pj(34,0,140);cp_barn(ctx,b[0],b[1],cp_k(C,140));const p=pj(D.in+6,0,74),k=cp_k(C,74);cp_pump(ctx,p[0],p[1],k);}
  else{const f=pj(40,0,96);cp_farm(ctx,f[0],f[1],cp_k(C,96)*0.045,{seed:15,smoke:!night});for(const [X,z] of [[24,70],[30,128],[56,150]]){const q=pj(X,0,z);cp_willow(ctx,q[0],q[1],cp_k(C,z)*5,0.85,(X*7+z)|0);}}
  if(!night)for(const [X,z,vv,fl] of [[20,30,today?3:0,0],[26,36,today?2:1,1],[34,52,today?3:0,0],[18,48,today?2:1,1]]){const q=pj(X,0,z);cp_cow(ctx,q[0],q[1],cp_k(C,z)*0.016,vv,fl);}
  if(night){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([120,130,160],1);ctx.fillRect(0,0,W,H);ctx.restore();}}
// the pumping station of brick, square, a hipped roof of tile, tall arched windows, its outfall to the canal; (x, y) its foot, k px a metre
function cp_pump(ctx,x,y,k){const w=9*k,h=7*k;wc_part(ctx,wc_rect(x-w/2,y-h,w,h),CP.brick,0.9,{seed:241});wc_part(ctx,[[x-w/2-0.6*k,y-h],[x+w/2+0.6*k,y-h],[x+w*0.22,y-h-4.2*k],[x-w*0.22,y-h-4.2*k]],CP.tile,0.9,{seed:243});
  for(const dx of [-0.28,0,0.28])wc_flat(ctx,wc_arched(x+dx*w-0.8*k,y-h*0.82,1.6*k,h*0.56),[96,112,128],0.9,"window");wc_flat(ctx,wc_rect(x-w/2,y-1*k,w,1*k),CP.brickDk,0.9,"plinth");
  wc_part(ctx,wc_rect(x-w/2-4*k,y-3.2*k,4*k,1.2*k),[120,124,130],0.9,{seed:245});}
// a farm of today: a long barn, its walls clad in grey-green boards, a big door, a dark roof; beside it the farmhouse of brick, its roof
// of red tile, windows; a tree; (x, y) the barn's foot at its left end, k px a metre
function cp_barn(ctx,x,y,k){const b=[168,176,172];wc_part(ctx,wc_rect(x,y-5*k,28*k,5*k),b,0.8,{seed:247});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(b,0.25),0.5);ctx.lineWidth=1;for(let i=1;i<56;i++){ctx.beginPath();ctx.moveTo(x+i*0.5*k,y-5*k);ctx.lineTo(x+i*0.5*k,y);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(x+16*k,y-4.2*k,5.5*k,4.2*k),[120,128,126],0.8,{seed:248});
  wc_part(ctx,[[x-0.8*k,y-5*k],[x+28.8*k,y-5*k],[x+26*k,y-10*k],[x+2*k,y-10*k]],[84,88,96],0.8,{seed:249});
  const hx=x+30*k;wc_part(ctx,wc_rect(hx,y-4.6*k,10*k,4.6*k),CP.brick,0.8,{seed:250});wc_part(ctx,[[hx-0.6*k,y-4.6*k],[hx+10.6*k,y-4.6*k],[hx+5*k,y-9.4*k]],CP.tile,0.8,{seed:251});
  for(const dx of [1.6,4.2,7.2])wc_flat(ctx,wc_rect(hx+dx*k,y-3.4*k,1.3*k,1.8*k),[226,226,220],0.8,"window");
  cp_willow(ctx,hx+13*k,y,k*7,0.8,253);}
/* ---------- the places, painted once ---------- */
const WC_PLACES={polderWet:c=>cp_paintPolder(c,{stage:"wet"}),polderDry:c=>cp_paintPolder(c,{stage:"dry"}),polder:cp_paintPolder,polderBreach:c=>cp_paintPolder(c,{stage:"breach"}),section:cp_paintSection,crest:c=>cp_paintCrest(c,"1300"),crestKept:c=>cp_paintCrest(c,"kept"),today:c=>cp_paintCrest(c,"today"),storm:c=>cp_paintCrest(c,"night"),
  farm:c=>cp_paintFarm(c,"dry"),farmFlood:c=>cp_paintFarm(c,"flood"),breach:cp_paintBreach,breachSky:c=>cp_paintBreach(c,{sky:true}),polder53:c=>cp_paintPolder(c,{stage:"breach",grey:true}),
  charter:cp_paintCharter,aerial:cp_paintAerial,bank:c=>cp_withB(CP_BANK,()=>cp_paintBreach(c,{kept:true})),bankWalk:c=>cp_withB(CP_BWALK,()=>cp_paintBreach(c,{slump:0.45,fine:true})),
  floor:gv_paintFloor,office:gv_paintOffice,boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),noor:gv_paintNoor,mapClose:gv_paintMapClose,meeting:gv_paintMeeting,meetingTable:gv_paintMeetingTable,
  desk:gv_paintDesk,faculty:gv_paintFaculty,dvc:cp_paintDvc,band:cp_paintBand,services:cp_paintServices,barrier:cp_paintBarrier,planning:gv_paintPlanning,facultyDesk:gv_paintFacultyDesk};
