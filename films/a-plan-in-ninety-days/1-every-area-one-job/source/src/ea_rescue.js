/* ===== Every area, one job: the San José mine, 2010 =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix ea_). Nothing here is a likeness of a real person or a copy of a photograph: the desert, the mine and the camp are drawn plainly,
   from what the sources say of the place and the time (bare hills under a pale sky, a mine's road down in switchbacks, a small shelter
   deep in the rock, tents by the gate), in this film's own style, with no flag, pattern or ornament borrowed from the place. Helmets are
   white or grey, and nobody wears the five colours that mean something.
     eaDesert     the Atacama by day: bare hills, the mine's entrance in a hillside, its road and two sheds
     eaSection    the mountain cut open like the module's section of the teaching building: the sky, the hills' line, and the rock
                  in layers below it; the mine is drawn live on it (ea_mine)
     ea_mine      the mine in section: its ramp down in switchbacks (o.ramp), the block that closes it (o.fall), the shelter about 700 m
                  down and the 33 lamps in it (o.lamps), the narrow drill that finds them (o.probe, o.back), the tubes sent down it
                  (o.doves), the three big drills (o.drills) and their rigs, the one that breaks through (o.through), and the capsule
                  (o.capsule)
     eaShelter    inside the shelter: rough rock, a bench, a lamp's warm light from the right
     eaGate       the mine's gate in the desert: a fence, the hills, the road; eaCamp the families' tents beside it; eaDusk at dusk
     EA_PEOPLE    a miner's foreman, three miners, the engineer in charge and four of the families: dressed for 2010, never likenesses
   Colour keeps the module's meaning: the rescue's plans in blue (its three drills, its parts), a man found alive and everyone up in green,
   time running out and the block in amber; the place and the people wear none of the five. */

const EA_K={sky0:[184,202,220],sky1:[242,228,206],far:[218,196,166],farDk:[200,176,146],hill:[200,162,120],hillDk:[164,128,94],
  plain:[214,188,150],plainDk:[184,156,120],road:[226,210,182],rock:[154,126,102],rock2:[140,114,94],rock3:[124,100,84],rockDk:[100,82,70],
  tunnel:[56,46,44],lit:[240,214,176],steel:[118,114,112],steelDk:[78,76,76],shed:[204,198,188],shedDk:[160,152,142],tent:[222,212,194],
  tentDk:[182,170,152],cut:[78,64,58],dusk0:[96,96,128],dusk1:[232,170,128]};

/* ---------------------------------------------------------------- the desert */
function ea_sky(c,hz,o){o=o||{};let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(o.top||EA_K.sky0,1));g.addColorStop(1,rgba(o.low||EA_K.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+60);
  // the sun's haze, high on the right, where the window is in the module's rooms
  g=c.createRadialGradient(1640,80,10,1640,80,940);g.addColorStop(0,o.haze||"rgba(255,244,220,0.55)");g.addColorStop(1,"rgba(255,244,220,0)");c.fillStyle=g;c.fillRect(0,0,W,hz);}
// a ridge of bare hills: a soft line made of a few slow waves, filled down to the bottom, lit from the right and shaded on the left of
// each rise
function ea_ridgeY(x,y0,amp,ph){return y0-amp*(0.55+0.28*Math.sin(x/260+ph)+0.17*Math.sin(x/97+ph*2.3));}
function ea_ridge(c,y0,amp,ph,col,dk,bottom){c.beginPath();c.moveTo(0,bottom);for(let x=0;x<=W;x+=12)c.lineTo(x,ea_ridgeY(x,y0,amp,ph));c.lineTo(W,bottom);c.closePath();
  let g=c.createLinearGradient(0,y0-amp,0,bottom);g.addColorStop(0,rgba(col,1));g.addColorStop(1,rgba(dk,1));c.fillStyle=g;c.fill();
  // the slopes that face the sun are lighter
  c.save();c.clip();for(let x=0;x<W;x+=12){const d=ea_ridgeY(x+12,y0,amp,ph)-ea_ridgeY(x,y0,amp,ph);if(d<0){c.fillStyle=rgba([255,246,228],clamp(-d/40,0,0.22));c.fillRect(x,ea_ridgeY(x,y0,amp,ph),12,bottom);}
    else{c.fillStyle=rgba(LP.shade,clamp(d/40,0,0.16));c.fillRect(x,ea_ridgeY(x,y0,amp,ph),12,bottom);}}c.restore();}
// a low shed: a box with a flat roof, lit from the right
function ea_shed(c,x,base,w,h){c.fillStyle=rgba(EA_K.shed,1);c.fillRect(x,base-h,w,h);c.fillStyle=rgba(EA_K.shedDk,1);c.fillRect(x,base-h,w*0.28,h);
  c.fillStyle=rgba(EA_K.steelDk,1);c.fillRect(x-6,base-h-8,w+12,9);c.fillStyle=rgba(LP.shade,0.18);c.fillRect(x+w*0.5,base-h*0.55,w*0.18,h*0.55);}
AG_PLACES.eaDesert=c=>{const hz=620;ea_sky(c,hz);
  ea_ridge(c,560,120,0.6,EA_K.far,EA_K.farDk,H);ea_ridge(c,640,150,2.1,EA_K.hill,EA_K.hillDk,H);
  // the plain in front, dusty, lighter towards the sun
  let g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,rgba(EA_K.plain,1));g.addColorStop(1,rgba(EA_K.plainDk,1));c.fillStyle=g;c.beginPath();c.moveTo(0,H);
  for(let x=0;x<=W;x+=12)c.lineTo(x,700+26*Math.sin(x/410+0.4));c.lineTo(W,H);c.closePath();c.fill();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.12));g.addColorStop(1,rgba([255,240,214],0.12));c.fillStyle=g;c.fillRect(0,640,W,H-640);
  // the hill the mine goes into, on the right, and its entrance: a dark mouth in a concrete frame
  c.fillStyle=rgba(EA_K.hill,1);c.beginPath();c.moveTo(860,H);c.bezierCurveTo(1000,700,1180,520,1420,500);c.bezierCurveTo(1640,484,1800,540,W,560);c.lineTo(W,H);c.closePath();c.fill();
  g=c.createLinearGradient(900,0,W,0);g.addColorStop(0,rgba(LP.shade,0.2));g.addColorStop(0.6,rgba(LP.shade,0));g.addColorStop(1,rgba([255,244,224],0.12));c.fillStyle=g;c.fill();
  c.fillStyle=rgba(EA_K.shedDk,1);c.beginPath();c.moveTo(1238,742);c.lineTo(1238,672);c.quadraticCurveTo(1290,622,1342,672);c.lineTo(1342,742);c.closePath();c.fill();
  c.fillStyle=rgba(EA_K.tunnel,1);c.beginPath();c.moveTo(1254,742);c.lineTo(1254,678);c.quadraticCurveTo(1290,642,1326,678);c.lineTo(1326,742);c.closePath();c.fill();
  // the road down to it, in a pale band that winds across the plain
  c.strokeStyle=rgba(EA_K.road,1);c.lineCap="round";c.lineWidth=34;c.beginPath();c.moveTo(-40,1040);c.bezierCurveTo(500,930,700,820,1000,790);c.bezierCurveTo(1150,776,1220,760,1290,746);c.stroke();
  c.strokeStyle=rgba(LP.shade,0.08);c.lineWidth=4;c.beginPath();c.moveTo(-40,1058);c.bezierCurveTo(500,948,700,836,1000,806);c.stroke();
  ea_shed(c,1440,740,190,86);ea_shed(c,1660,736,130,70);
  // a few low shrubs, the desert's only plants, small and far apart
  const R=ag_rnd(2010);for(let i=0;i<26;i++){const x=R()*W,y=760+R()*300;if(Math.abs(y-(1040-(x+40)*0.24))<60)continue;c.fillStyle=rgba(mix(EA_K.hillDk,[110,104,80],0.5),0.55);
    c.beginPath();c.ellipse(x,y,8+R()*10,4+R()*4,0,0,TAU);c.fill();}
  lp_grain(c,0,0,W,H,10,71);};

/* ---------------------------------------------------------------- the mountain, cut open */
// the hills' line across the section: the mine's hill rises on the right
const ea_surf=x=>292-74*Math.exp(-Math.pow((x-1480)/430,2))-14*Math.sin(x/170+0.5);
const EA_M={portal:[1470,ea_surf(1470)],
  // the ramp, in eight legs from the entrance down to the shelter, about 700 m below
  legs:[[1470,ea_surf(1470)+10],[620,322],[1500,388],[620,454],[1500,520],[620,586],[1500,652],[620,718],[1440,790]],
  shelter:[1380,772,150,40],   // x, y, w, h: the shelter, its floor at about 700 m
  block:[[930,402],[1010,356],[1150,350],[1236,392],[1250,470],[1180,528],[1040,538],[950,498]],
  probe:[[1330,ea_surf(1330)],[1440,772]],
  // the three drills: each from its rig on the hills' line to the rock near the shelter
  drills:[{x:760,to:[1386,790],name:"Plan C"},{x:1000,to:[1400,784],name:"Plan A"},{x:1240,to:[1418,778],name:"Plan B"}],
  depth:[[120,ea_surf(120)],[120,790]]};
AG_PLACES.eaSection=c=>{ea_sky(c,330);
  // far hills behind the cut, hazy
  c.fillStyle=rgba(mix(EA_K.far,EA_K.sky1,0.35),1);c.beginPath();c.moveTo(0,330);for(let x=0;x<=W;x+=12)c.lineTo(x,ea_surf(x)-40-40*Math.sin(x/300+1.2));c.lineTo(W,330);c.closePath();c.fill();
  // the rock below the hills' line, in layers that follow it, darker as it goes down
  c.save();c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=8)c.lineTo(x,ea_surf(x));c.lineTo(W,H);c.closePath();c.clip();
  let g=c.createLinearGradient(0,240,0,H);g.addColorStop(0,rgba(EA_K.rock,1));g.addColorStop(0.55,rgba(EA_K.rock2,1));g.addColorStop(1,rgba(EA_K.rock3,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  const R=ag_rnd(33);for(let k=0;k<14;k++){const y0=300+k*56+R()*18,a=0.05+R()*0.07,ph=R()*6;c.fillStyle=rgba(k%2?EA_K.rockDk:[190,160,130],a);c.beginPath();
    c.moveTo(0,y0);for(let x=0;x<=W;x+=16)c.lineTo(x,y0+12*Math.sin(x/230+ph)+6*Math.sin(x/71+ph));for(let x=W;x>=0;x-=16)c.lineTo(x,y0+20+12*Math.sin(x/240+ph+0.6));c.closePath();c.fill();}
  for(let i=0;i<260;i++){const x=R()*W,y=300+R()*780;c.fillStyle=rgba(R()<0.5?EA_K.rockDk:[196,170,140],0.12+R()*0.1);c.beginPath();c.ellipse(x,y,3+R()*9,2+R()*4,R()*3,0,TAU);c.fill();}
  // the light from the right, the shade on the left
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.22));g.addColorStop(0.5,rgba(LP.shade,0.05));g.addColorStop(1,rgba([255,236,206],0.08));c.fillStyle=g;c.fillRect(0,0,W,H);
  lp_grain(c,0,0,W,H,12,72);c.restore();
  // the section's cut: a firm line along the hills, as an architect draws one
  c.strokeStyle=rgba(EA_K.cut,1);c.lineWidth=6;c.lineJoin="round";c.beginPath();for(let x=0;x<=W;x+=8){const y=ea_surf(x);if(x)c.lineTo(x,y);else c.moveTo(x,y);}c.stroke();
  // the depth, marked down the left: a tick every hundred metres
  c.strokeStyle=rgba(LP.paper,0.55);c.lineWidth=3;c.beginPath();c.moveTo(120,ea_surf(120)+8);c.lineTo(120,790);for(let k=0;k<=7;k++){const y=lerp(ea_surf(120)+8,790,k/7);c.moveTo(108,y);c.lineTo(132,y);}c.stroke();};

// a point along a polyline, part u of its length; and the polyline up to that point
function ea_along(pts,u){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(l);L+=l;}
  let d=clamp(u,0,1)*L,out=[pts[0]];for(let i=1;i<pts.length;i++){if(d>=seg[i-1]){out.push(pts[i]);d-=seg[i-1];continue;}const k=d/seg[i-1];out.push([lerp(pts[i-1][0],pts[i][0],k),lerp(pts[i-1][1],pts[i][1],k)]);break;}
  return out;}
function ea_poly(ctx,pts){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));}
// a drill's rig on the hills' line: a slim mast and its base, in steel grey
function ea_rig(ctx,x,s,a){if(a<=0.004)return;const y=ea_surf(x);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(EA_K.steelDk,1);ctx.fillRect(x-26*s,y-16*s,52*s,16*s);
  ctx.strokeStyle=rgba(EA_K.steel,1);ctx.lineWidth=5*s;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-18*s,y-16*s);ctx.lineTo(x-3*s,y-96*s);ctx.lineTo(x+3*s,y-96*s);ctx.lineTo(x+18*s,y-16*s);
  ctx.moveTo(x-12*s,y-46*s);ctx.lineTo(x+12*s,y-46*s);ctx.moveTo(x-7*s,y-72*s);ctx.lineTo(x+7*s,y-72*s);ctx.stroke();ctx.restore();}
// o: ramp, lamps, fall, block (amber outline), shelter, probe, back, note, doves (time, or null), drills [c, a, b], through, capsule,
// lit (the parts lit: an object of drills, doves), a
function ea_mine(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const M=EA_M;
  // the ramp: a dark road through the rock, drawn as far as o.ramp
  const rp=o.ramp==null?1:o.ramp;if(rp>0){const pts=ea_along(M.legs,rp);ctx.lineCap="round";ctx.lineJoin="round";
    ctx.strokeStyle=rgba(mix(EA_K.rock,[255,240,220],0.25),0.6);ctx.lineWidth=22;ea_poly(ctx,pts);ctx.stroke();
    ctx.strokeStyle=rgba(EA_K.tunnel,1);ctx.lineWidth=15;ea_poly(ctx,pts);ctx.stroke();}
  // the shelter: a small room at the bottom, lit when the men are in it
  const [sx,sy,sw,sh]=M.shelter,sl=o.shelter==null?1:o.shelter;
  ctx.fillStyle=rgba(EA_K.tunnel,1);rr(ctx,sx,sy,sw,sh,8);ctx.fill();
  if(sl>0){ctx.save();ctx.globalAlpha*=sl;const g=ctx.createLinearGradient(sx,sy,sx,sy+sh);g.addColorStop(0,rgba(EA_K.lit,0.95));g.addColorStop(1,rgba(mix(EA_K.lit,EA_K.tunnel,0.4),0.95));
    ctx.fillStyle=g;rr(ctx,sx+4,sy+4,sw-8,sh-8,6);ctx.fill();ctx.restore();}
  // the 33: a lamp each, small, in two rows
  const lm=o.lamps||0;if(lm>0)for(let i=0;i<33;i++){const k=clamp(lm*33-i,0,1);if(k<=0)break;const r=i<17?0:1,n=r?16:17,j=r?i-17:i,x=sx+14+j*(sw-28)/(n-1),y=sy+(r?27:15);
    ctx.fillStyle=rgba([255,250,232],k);ctx.beginPath();ctx.arc(x,y,3.2,0,TAU);ctx.fill();}
  // the block that closes the ramp: it falls into place, and stays
  const fl=o.fall||0;if(fl>0){const dy=-70*(1-ag_eo(fl));ctx.save();ctx.globalAlpha*=clamp(fl*3,0,1);ctx.translate(0,dy);
    ctx.fillStyle=rgba(mix(EA_K.rockDk,EA_K.tunnel,0.25),1);ea_poly(ctx,M.block);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(mix(EA_K.rockDk,[255,240,220],0.18),0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(990,380);ctx.lineTo(1060,450);ctx.lineTo(1040,520);ctx.moveTo(1150,370);ctx.lineTo(1120,440);ctx.lineTo(1190,500);ctx.stroke();
    if(o.block>0){ctx.strokeStyle=rgba(LP.amber,o.block);ctx.lineWidth=6;ea_poly(ctx,M.block);ctx.closePath();ctx.stroke();}ctx.restore();}
  // the narrow drill that finds them: down to the shelter's roof, and back up
  const pr=o.probe||0;if(pr>0){const [p0,p1]=M.probe,dn=clamp(pr,0,1),y1=lerp(p0[1],p1[1],dn),x1=lerp(p0[0],p1[0],dn);
    ctx.strokeStyle=rgba(mix(EA_K.tunnel,EA_K.rock,0.15),1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(x1,y1);ctx.stroke();
    // the drill's head, going down, then coming back up with the note
    const bk=o.back||0,hu=pr<1?dn:1-bk;if(pr<1||(bk>0&&bk<1)){const hx=lerp(p0[0],p1[0],hu),hy=lerp(p0[1],p1[1],hu);ctx.fillStyle=rgba(EA_K.steel,1);ctx.beginPath();ctx.arc(hx,hy,7,0,TAU);ctx.fill();
      if(bk>0){ctx.fillStyle=rgba([250,247,240],1);ctx.fillRect(hx+6,hy-6,12,9);}}}
  ctx.lineCap="round";
  // the three big drills: each hole drawn as far as it has gone; the one that breaks through turns green
  const dr=o.drills||[0,0,0];M.drills.forEach((d,i)=>{const r0=ea_surf(d.x);ea_rig(ctx,d.x,1,clamp(dr[i]*8,0,1)*(o.rigs==null?1:o.rigs));if(dr[i]<=0)return;
    const u=clamp(dr[i],0,1),x1=lerp(d.x,d.to[0],u),y1=lerp(r0,d.to[1],u),win=i===2&&(o.through||0)>0;
    ctx.strokeStyle=rgba(mix(EA_K.tunnel,EA_K.rock,0.1),1);ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(d.x,r0);ctx.lineTo(x1,y1);ctx.stroke();
    ctx.strokeStyle=rgba(win?mix(LP.blue,LP.green,o.through):LP.blue,0.95);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(d.x,r0);ctx.lineTo(x1,y1);ctx.stroke();});
  // the tubes sent down the narrow hole, one after another: food, water, medicine, letters
  if(o.doves!=null&&pr>=1){const [p0,p1]=M.probe;for(let k=0;k<4;k++){const u=((o.doves-k*1.15)/4.6);if(u<0||u>1)continue;const x=lerp(p0[0],p1[0],u),y=lerp(p0[1],p1[1],u),an=Math.atan2(p1[1]-p0[1],p1[0]-p0[0]);
    ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.globalAlpha*=clamp(u*12,0,1)*clamp((1-u)*12,0,1);ctx.fillStyle=rgba([236,232,224],1);rr(ctx,-15,-6,30,12,6);ctx.fill();
    ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=2.5;rr(ctx,-15,-6,30,12,6);ctx.stroke();ctx.restore();}}
  // the capsule, up the hole that broke through
  const cp=o.capsule;if(cp!=null&&cp>0&&cp<1){const d=M.drills[2],r0=ea_surf(d.x),x=lerp(d.to[0],d.x,cp),y=lerp(d.to[1],r0,cp),an=Math.atan2(r0-d.to[1],d.x-d.to[0]);
    ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.fillStyle=rgba([238,234,228],1);rr(ctx,-20,-8,40,16,8);ctx.fill();ctx.strokeStyle=rgba(LP.green,1);ctx.lineWidth=3;rr(ctx,-20,-8,40,16,8);ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- inside the shelter */
AG_PLACES.eaShelter=c=>{const R=ag_rnd(688);
  // rough rock all round, warm where the lamp on the right reaches it, dark on the left
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba([58,48,46],1));g.addColorStop(0.55,rgba([104,84,70],1));g.addColorStop(1,rgba([150,120,96],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){const x=R()*W,y=R()*900,rx=60+R()*170,ry=30+R()*80;const lt=x/W;c.fillStyle=rgba(R()<0.5?[40,32,30]:mix([150,124,100],[210,180,146],lt),0.1+R()*0.12);
    c.beginPath();c.ellipse(x,y,rx,ry,R()*3,0,TAU);c.fill();}
  // the low roof's edge and the floor
  c.fillStyle=rgba([46,38,36],0.55);c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(W,70);for(let x=W;x>=0;x-=40)c.lineTo(x,80+26*Math.sin(x/120)+R()*14);c.closePath();c.fill();
  g=c.createLinearGradient(0,900,0,H);g.addColorStop(0,rgba([92,76,64],1));g.addColorStop(1,rgba([60,50,44],1));c.fillStyle=g;c.fillRect(0,900,W,H-900);
  // the lamp's warm pool, from the right
  c.save();c.globalCompositeOperation="screen";g=c.createRadialGradient(1700,240,20,1600,420,1100);g.addColorStop(0,"rgba(255,214,160,0.55)");g.addColorStop(0.4,"rgba(255,196,140,0.2)");g.addColorStop(1,"rgba(255,196,140,0)");
  c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
  // the lamp itself: a small caged light on the rock, high on the right
  c.fillStyle=rgba([70,64,60],1);c.fillRect(1760,170,46,30);c.fillStyle="rgba(255,240,206,0.95)";c.beginPath();c.ellipse(1783,206,18,10,0,0,TAU);c.fill();
  g=c.createRadialGradient(0,0,H*0.3,0,0,W);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(20,14,14,0.4)");c.fillStyle=g;c.fillRect(0,0,W,H);
  lp_grain(c,0,0,W,H,12,73);};

/* ---------------------------------------------------------------- the gate, the camp, and the camp at dusk */
// a fence along the road: posts and wire mesh, light grey; a gate of two leaves in it at gx
function ea_fence(c,y,gx){c.strokeStyle="rgba(120,116,112,0.55)";c.lineWidth=2;for(let x=0;x<W;x+=26){c.beginPath();c.moveTo(x,y-150);c.lineTo(x+26,y);c.moveTo(x+26,y-150);c.lineTo(x,y);c.stroke();}
  c.fillStyle=rgba(EA_K.steelDk,1);for(let x=10;x<W;x+=210){if(Math.abs(x-gx)<150)continue;c.fillRect(x,y-170,9,170);}c.fillRect(0,y-158,W,5);
  c.fillStyle=rgba(EA_K.steel,1);c.fillRect(gx-140,y-176,12,176);c.fillRect(gx+128,y-176,12,176);
  c.strokeStyle=rgba(EA_K.steelDk,1);c.lineWidth=6;c.strokeRect(gx-124,y-150,118,140);c.strokeRect(gx+6,y-150,118,140);}
function ea_tent(c,x,base,w,h,col,dk){c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(x-w/2,base);c.quadraticCurveTo(x-w*0.3,base-h*0.9,x,base-h);c.quadraticCurveTo(x+w*0.3,base-h*0.9,x+w/2,base);c.closePath();c.fill();
  c.fillStyle=rgba(dk,1);c.beginPath();c.moveTo(x-w/2,base);c.quadraticCurveTo(x-w*0.3,base-h*0.9,x,base-h);c.lineTo(x-w*0.1,base);c.closePath();c.fill();
  c.fillStyle=rgba(mix(dk,[30,24,24],0.5),1);c.beginPath();c.moveTo(x-w*0.08,base);c.lineTo(x+w*0.06,base-h*0.55);c.lineTo(x+w*0.18,base);c.closePath();c.fill();}
function ea_ground(c,hz){const g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(EA_K.plain,1));g.addColorStop(1,rgba(EA_K.plainDk,1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);}
AG_PLACES.eaGate=c=>{const hz=640;ea_sky(c,hz);ea_ridge(c,560,140,1.3,EA_K.far,EA_K.farDk,H);ea_ridge(c,640,90,3.0,EA_K.hill,EA_K.hillDk,H);ea_ground(c,690);
  c.fillStyle=rgba(EA_K.road,1);c.beginPath();c.moveTo(860,690);c.lineTo(1060,690);c.lineTo(1260,H);c.lineTo(660,H);c.closePath();c.fill();
  ea_fence(c,700,960);lp_grain(c,0,0,W,H,10,74);};
AG_PLACES.eaCamp=c=>{const hz=640;ea_sky(c,hz);ea_ridge(c,560,140,1.3,EA_K.far,EA_K.farDk,H);ea_ridge(c,640,90,3.0,EA_K.hill,EA_K.hillDk,H);ea_ground(c,690);
  const R=ag_rnd(3000);for(let r=0;r<3;r++)for(let i=0;i<9;i++){const x=80+i*215+R()*60+(r%2)*90,base=700+r*26,s=0.55+r*0.12;if(x>1900)continue;
    ea_tent(c,x,base,170*s,110*s,mix(EA_K.tent,[200,196,190],R()*0.6),mix(EA_K.tentDk,[150,146,140],R()*0.5));}
  // a drill's mast far off on the hill
  c.strokeStyle=rgba(EA_K.steel,0.8);c.lineWidth=5;c.beginPath();c.moveTo(1580,560);c.lineTo(1600,430);c.lineTo(1606,430);c.lineTo(1626,560);c.moveTo(1588,500);c.lineTo(1618,500);c.stroke();
  lp_grain(c,0,0,W,H,10,75);};
AG_PLACES.eaDusk=c=>{const hz=640;ea_sky(c,hz,{top:EA_K.dusk0,low:EA_K.dusk1,haze:"rgba(255,206,160,0.35)"});
  ea_ridge(c,560,140,1.3,mix(EA_K.far,EA_K.dusk0,0.45),mix(EA_K.farDk,EA_K.dusk0,0.5),H);ea_ridge(c,640,90,3.0,mix(EA_K.hill,EA_K.dusk0,0.5),mix(EA_K.hillDk,EA_K.dusk0,0.55),H);
  let g=c.createLinearGradient(0,690,0,H);g.addColorStop(0,rgba(mix(EA_K.plain,EA_K.dusk0,0.5),1));g.addColorStop(1,rgba(mix(EA_K.plainDk,EA_K.dusk0,0.6),1));c.fillStyle=g;c.fillRect(0,690,W,H-690);
  const R=ag_rnd(3000);for(let r=0;r<3;r++)for(let i=0;i<9;i++){const x=80+i*215+R()*60+(r%2)*90,base=700+r*26,s=0.55+r*0.12;if(x>1900)continue;
    ea_tent(c,x,base,170*s,110*s,mix(EA_K.tent,EA_K.dusk0,0.45),mix(EA_K.tentDk,EA_K.dusk0,0.55));
    // a lamp inside, its glow through the cloth
    const gl=c.createRadialGradient(x,base-28*s,2,x,base-28*s,70*s);gl.addColorStop(0,"rgba(255,214,150,0.55)");gl.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=gl;c.fillRect(x-80*s,base-100*s,160*s,110*s);}
  lp_grain(c,0,0,W,H,10,76);};

/* ---------------------------------------------------------------- the people of the story
   A miner's helmet, painted in figure space inside the head's picture (x 160 to 440, y 250 to 560): a dome over the skull with a short
   brim, a ridge along its top, and a small lamp at the front. White or pale grey. */
function ea_helmet(col){return(c,P)=>{const dome=cc=>{cc.moveTo(204,394);cc.bezierCurveTo(192,330,226,274,292,264);cc.bezierCurveTo(354,256,400,296,402,350);
    cc.lineTo(424,362);cc.quadraticCurveTo(428,372,416,374);cc.bezierCurveTo(350,372,262,378,204,394);cc.closePath();};
  ag_soft(c,dome,col,ag_lt(col,0.4),340,286,150,rgba(ag_dk(col,0.55),0.5),12);
  c.strokeStyle=rgba(ag_dk(col,0.22),0.8);c.lineWidth=3;c.beginPath();c.moveTo(236,302);c.quadraticCurveTo(302,262,374,302);c.stroke();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.85);c.lineWidth=2.5;c.beginPath();c.moveTo(208,388);c.bezierCurveTo(262,374,350,368,416,372);c.stroke();
  c.fillStyle=rgba([72,68,66],1);c.beginPath();c.ellipse(382,322,15,13,0,0,TAU);c.fill();c.fillStyle="rgba(255,244,214,0.95)";c.beginPath();c.ellipse(385,322,9,8,0,0,TAU);c.fill();};}
// an engineer's hard hat: the same shape, with a wider brim all round and no lamp
function ea_hardHat(col){return(c,P)=>{const dome=cc=>{cc.moveTo(200,392);cc.bezierCurveTo(190,328,226,272,294,264);cc.bezierCurveTo(356,258,402,298,404,352);
    cc.lineTo(428,364);cc.quadraticCurveTo(432,374,418,376);cc.bezierCurveTo(352,374,262,380,190,398);cc.quadraticCurveTo(184,392,200,392);cc.closePath();};
  ag_soft(c,dome,col,ag_lt(col,0.4),340,286,150,rgba(ag_dk(col,0.55),0.5),12);
  c.strokeStyle=rgba(ag_dk(col,0.22),0.8);c.lineWidth=3;c.beginPath();c.moveTo(240,300);c.quadraticCurveTo(302,262,372,300);c.stroke();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.85);c.lineWidth=2.5;c.beginPath();c.moveTo(194,394);c.bezierCurveTo(262,376,350,370,418,374);c.stroke();};}
const EA_PEOPLE={
  urzua:{name:"Luis Urzúa",role:"Shift foreman",key:"ea-urzua",skin:[198,152,118],hair:{style:"cropped",c:[70,62,58]},beard:[84,72,64],top:{kind:"overshirt",c:[92,88,86],inner:[196,190,180]},hat:{paint:ea_helmet([238,236,230])},breath:0.25},
  m1:{name:"A miner",key:"ea-m1",skin:[176,128,96],hair:{style:"cropped",c:[30,26,24]},top:{kind:"overshirt",c:[118,108,96],inner:[210,204,194]},hat:{paint:ea_helmet([226,224,218])},breath:0.3},
  m2:{name:"A miner",key:"ea-m2",skin:[214,170,136],hair:{style:"cropped",c:[46,38,34]},top:{kind:"sweater",c:[88,90,96]},hat:{paint:ea_helmet([206,206,204])},breath:0.28},
  m3:{name:"A miner",key:"ea-m3",skin:[160,114,84],hair:{style:"cropped",c:[24,22,22]},beard:[36,30,28],top:{kind:"overshirt",c:[134,120,104],inner:[220,214,204]},hat:{paint:ea_helmet([238,236,230])},breath:0.27},
  engineer:{name:"André Sougarret",role:"Mining engineer",key:"ea-engineer",skin:[220,182,152],hair:{style:"cropped",c:[48,40,36]},glasses:[50,46,44],top:{kind:"blazer",c:[84,84,90],inner:[226,224,220]},hat:{paint:ea_hardHat([240,238,232])},breath:0.25},
  // two of the miners again, up and home, their helmets off
  m2up:{name:"A miner",key:"ea-m2up",skin:[214,170,136],hair:{style:"cropped",c:[46,38,34]},top:{kind:"sweater",c:[88,90,96]},breath:0.28},
  m3up:{name:"A miner",key:"ea-m3up",skin:[160,114,84],hair:{style:"cropped",c:[24,22,22]},beard:[36,30,28],top:{kind:"overshirt",c:[134,120,104],inner:[220,214,204]},breath:0.27},
  f1:{name:"",key:"ea-f1",skin:[192,146,112],hair:{style:"long",c:[34,28,26]},earrings:[214,200,170],top:{kind:"cardigan",c:[150,132,122],inner:[232,226,218]},breath:0.3},
  f2:{name:"",key:"ea-f2",skin:[204,160,126],hair:{style:"cropped",c:[168,164,160]},top:{kind:"overshirt",c:[110,102,96],inner:[220,216,208]},breath:0.24},
  f3:{name:"",key:"ea-f3",skin:[180,132,98],hair:{style:"bun",c:[40,32,28]},top:{kind:"sweater",c:[136,124,132]},breath:0.29},
  f4:{name:"",key:"ea-f4",skin:[214,172,140],hair:{style:"side",c:[52,40,34]},top:{kind:"sweater",c:[96,98,104]},breath:0.32}
};
