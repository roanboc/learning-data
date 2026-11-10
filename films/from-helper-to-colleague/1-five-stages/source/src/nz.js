/* ===== Five stages, not a switch: New Zealand in the 1980s =====
   The opening's world, prefixed fs_ / FS_ as all of this film's own pieces (shared/src is never changed for one film):
     the places, painted once: green hills under a soft sky, a two-lane road coming in from the left, then curving up and away over a
     crest (the place "fsHills"), and the same at night (the place "fsHillsNight", the same room, so the camera glides from day to
     night and only the light changes);
     what's drawn live on them: a small car of the time, seen from its right side (the driver's, in a right-hand-drive car), keeping to
     the left lane, its wheels turning, the people in it seen through its windows, its lamps at night; three road signs, one for each
     stage of the new licence; the switch the old licence was; and the two people of the story, a young driver and a parent, in the
     module's way (one three-quarter head, arms down, the young driver's near hand holding the licence).
   The window's light is the module's: from the right, so the hills and the car are lit from the upper right. */

// a value worked out once per chapter (the cue times its scene uses)
function fs_once(sc,k,fn){sc.__fs=sc.__fs||{};if(!(k in sc.__fs))sc.__fs[k]=fn();return sc.__fs[k];}

/* ---------------------------------------------------------------- the corner tag: where and when, at the top left */
function fs_corner(ctx,text,a){if(a<=0)return;const w=ag_tw(ctx,text.toUpperCase(),{w:700,size:30,ls:3})+56;
  ag_box(ctx,72,64,w,62,31,{a:a*0.92});ag_T(ctx,text.toUpperCase(),100,106,{w:700,size:30,ls:3,col:AG.kick,a});}

/* ---------------------------------------------------------------- the road
   Two cubics: the near stretch, from the left edge across the middle distance, and the bend up and away over the crest. Each point
   carries the road's width there, so it narrows as it goes. FS_LANE: how far the left lane's middle sits from the centre line, as a
   part of the width (towards the crest side: a car driving right keeps left, away from us). */
const FS_ROAD={a:[-80,846,430,836,900,800,1250,726],b:[1250,726,1420,690,1502,606,1556,552],wa:[210,124],wb:[124,12]};
const FS_LANE=-0.24;
// the point at u (0 to 2: 0 to 1 along the near stretch, 1 to 2 up the bend), its width and its slope
function fs_roadAt(u){const seg=u<=1?FS_ROAD.a:FS_ROAD.b,v=u<=1?clamp(u,0,1):clamp(u-1,0,1),wd=u<=1?FS_ROAD.wa:FS_ROAD.wb,
    p=ag_bz(seg,v),q=ag_bz(seg,Math.min(1,v+0.01)),r=ag_bz(seg,Math.max(0,v-0.01));
  return{x:p[0],y:p[1],w:lerp(wd[0],wd[1],v),ang:Math.atan2(q[1]-r[1],q[0]-r[0])};}
// where a car in the left lane sits at u: its point and its size (a car is 520 px long at s 1, about twice the road's depth there)
function fs_lane(u){const r=fs_roadAt(u);return{x:r.x+Math.sin(r.ang)*r.w*FS_LANE*-1,y:r.y+Math.cos(r.ang)*r.w*FS_LANE,ang:r.ang,s:r.w/240};}

/* ---------------------------------------------------------------- the hills, painted once */
const FSC={sky0:[150,186,214],sky1:[222,232,232],far:[132,160,160],mid:[112,150,108],near:[124,164,92],grass:[134,172,96],
  road:[92,96,100],roadHi:[128,132,134],line:[236,234,226],trunk:[86,70,56],leaf:[72,112,64],fence:[96,84,70]};
// a hill's crest: y at x, from a base line and a few slow waves
function fs_crest(x,y0,w){let y=y0;for(const [a,f,p] of w)y+=a*Math.sin(x*f+p);return y;}
function fs_hill(c,y0,waves,col,hiA,shadeA){c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=16)c.lineTo(x,fs_crest(x,y0,waves));c.lineTo(W,H);c.closePath();
  let g=c.createLinearGradient(0,y0-60,0,y0+260);g.addColorStop(0,rgba(mix(col,[255,250,236],0.18),1));g.addColorStop(1,rgba(mix(col,[30,40,24],0.12),1));c.fillStyle=g;c.fill();
  // the light from the upper right on the hill's crest, and its shadow side to the left
  c.save();c.clip();g=c.createRadialGradient(1700,y0-200,40,1500,y0,1300);g.addColorStop(0,"rgba(255,250,232,"+hiA+")");g.addColorStop(1,"rgba(255,250,232,0)");
  c.fillStyle=g;c.fillRect(0,0,W,H);g=c.createLinearGradient(0,0,W*0.6,0);g.addColorStop(0,"rgba(30,40,30,"+shadeA+")");g.addColorStop(1,"rgba(30,40,30,0)");c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();}
// a tree on a hill: a trunk that tapers, and a crown of soft rounded masses, lit from the right
function fs_tree(c,x,y,s,R){R=R||ag_rnd(Math.round(x*7+y));c.save();
  ag_taper(c,[x,y],[x+2*s,y-30*s],[x-3*s,y-60*s],[x+1*s,y-92*s],13*s,5*s,rgba(FSC.trunk,1));
  const blobs=[[0,-120,58],[-40,-100,44],[38,-104,46],[-14,-154,40],[24,-146,38]];
  for(const [dx,dy,r] of blobs){const bx=x+dx*s,by=y+dy*s,rr_=r*s*(0.92+0.16*R());const g=c.createRadialGradient(bx+rr_*0.35,by-rr_*0.4,rr_*0.1,bx,by,rr_*1.05);
    g.addColorStop(0,rgba(mix(FSC.leaf,[200,220,150],0.32),1));g.addColorStop(0.7,rgba(FSC.leaf,1));g.addColorStop(1,rgba(mix(FSC.leaf,[20,36,20],0.35),1));
    c.fillStyle=g;c.beginPath();c.arc(bx,by,rr_,0,TAU);c.fill();}
  c.restore();}
// a shelter belt: a long, low row of trees along a hill, one soft mass
function fs_belt(c,x0,x1,y,h){const g=c.createLinearGradient(0,y-h,0,y);g.addColorStop(0,rgba(mix(FSC.leaf,[180,200,140],0.2),1));g.addColorStop(1,rgba(mix(FSC.leaf,[20,30,20],0.3),1));
  c.fillStyle=g;c.beginPath();c.moveTo(x0,y);for(let x=x0;x<=x1;x+=10){const u=(x-x0)/(x1-x0);c.lineTo(x,y-h*(0.82+0.18*Math.sin(x*0.07)+0.08*Math.sin(x*0.19))*Math.min(1,u*8,(1-u)*8));}
  c.lineTo(x1,y);c.closePath();c.fill();}
// sheep far off: small soft ovals, each with a dark head
function fs_sheep(c,list){for(const [x,y,s] of list){c.fillStyle="rgba(250,248,240,0.95)";c.beginPath();c.ellipse(x,y,9*s,5.6*s,0,0,TAU);c.fill();
  c.fillStyle="rgba(60,56,52,0.9)";c.beginPath();c.ellipse(x+9*s,y-1*s,3*s,2.6*s,0,0,TAU);c.fill();}}
// the road as one shape for each stretch: asphalt, its edges, the dashed centre line
function fs_paintRoad(c,night){const segs=[[FS_ROAD.a,FS_ROAD.wa],[FS_ROAD.b,FS_ROAD.wb]];
  // both verges first, then both roads: the far road's round end would otherwise paint its verge across the near road
  for(const [pass,dw] of [[0,[16,3]],[1,[0,0]]])for(const [seg,wd] of segs){const p=i=>[seg[i*2],seg[i*2+1]];
    ag_taper(c,p(0),p(1),p(2),p(3),wd[0]+dw[0],wd[1]+dw[1],pass?rgba(FSC.road,1):rgba(mix(FSC.grass,[90,80,60],0.35),1));}
  // the edge lines and the centre line, dashed, narrowing with the road
  c.save();c.lineCap="butt";for(let i=0;i<=200;i++){const u=i/100,r=fs_roadAt(u),r2=fs_roadAt(Math.min(2,u+0.004)),nx=-Math.sin(r.ang),ny=Math.cos(r.ang),lw=Math.max(0.8,r.w*0.03);
    c.strokeStyle=rgba(FSC.line,night?0.5:0.85);c.lineWidth=lw;
    for(const side of [-0.46,0.46]){c.beginPath();c.moveTo(r.x+nx*r.w*side,r.y+ny*r.w*side);c.lineTo(r2.x+nx*r2.w*side,r2.y+ny*r2.w*side);c.stroke();}
    if(i%4<2){c.beginPath();c.moveTo(r.x,r.y);c.lineTo(r2.x,r2.y);c.stroke();}}
  c.restore();}
// a fence along the near side of the road: posts and two wires
function fs_fence(c){const pts=[];for(let i=0;i<=26;i++){const u=i/26*1.12,r=fs_roadAt(u),nx=-Math.sin(r.ang),ny=Math.cos(r.ang);
    pts.push([r.x+nx*(r.w*0.5+46*r.w/210),r.y+ny*(r.w*0.5+46*r.w/210),r.w/210]);}
  c.strokeStyle="rgba(70,62,52,0.55)";c.lineWidth=1.4;for(const k of [0.55,0.9]){c.beginPath();pts.forEach((p,i)=>{const y=p[1]-52*p[2]*k;i?c.lineTo(p[0],y):c.moveTo(p[0],y);});c.stroke();}
  for(const p of pts){c.fillStyle=rgba(FSC.fence,1);c.fillRect(p[0]-3*p[2],p[1]-60*p[2],6*p[2],60*p[2]);c.fillStyle="rgba(255,240,220,0.35)";c.fillRect(p[0]+1*p[2],p[1]-60*p[2],1.6*p[2],58*p[2]);}}
function fs_paintHills(c,o){o=o||{};
  // the sky, soft, with two long clouds
  let g=c.createLinearGradient(0,0,0,600);g.addColorStop(0,rgba(FSC.sky0,1));g.addColorStop(1,rgba(FSC.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(1640,40,30,1600,80,1100);g.addColorStop(0,"rgba(255,252,236,0.55)");g.addColorStop(1,"rgba(255,252,236,0)");c.fillStyle=g;c.fillRect(0,0,W,700);
  for(const [x,y,rx,ry,a] of [[520,170,380,40,0.5],[760,150,260,30,0.4],[1260,250,420,36,0.42],[1460,232,240,26,0.35],[260,300,300,24,0.3]]){
    c.save();c.translate(x,y);c.scale(1,ry/rx);g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,"rgba(255,255,255,"+a+")");g.addColorStop(1,"rgba(255,255,255,0)");
    c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,TAU);c.fill();c.restore();}
  // three ranges of hills, far to near, and a crest the road goes over
  fs_hill(c,452,[[22,0.0031,0.4],[12,0.0083,1.7],[5,0.021,0.2]],FSC.far,0.18,0.06);
  fs_hill(c,512,[[30,0.0024,2.2],[14,0.0061,0.6],[6,0.017,1.1]],FSC.mid,0.2,0.1);
  fs_belt(c,180,620,fs_crest(400,512,[[30,0.0024,2.2],[14,0.0061,0.6],[6,0.017,1.1]])+8,26);
  fs_sheep(c,[[1660,560,1],[1700,572,0.95],[1742,564,1.05],[1630,584,0.9],[300,600,0.9],[336,606,1]]);
  fs_hill(c,590,[[34,0.0019,0.9],[16,0.0047,2.4],[7,0.013,0.3]],FSC.near,0.24,0.12);
  // the grass in front: a little lighter where the light falls
  g=c.createLinearGradient(0,620,0,H);g.addColorStop(0,"rgba(255,250,230,0)");g.addColorStop(1,"rgba(40,60,30,0.18)");c.fillStyle=g;c.fillRect(0,600,W,H-600);
  fs_tree(c,170,700,1.25);fs_tree(c,1790,690,1.1);fs_tree(c,1612,612,0.62);fs_tree(c,1000,606,0.5);
  fs_paintRoad(c,!!o.night);fs_fence(c);
  if(o.night){c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(58,70,108)";c.fillRect(0,0,W,H);c.restore();
    // the night sky: deep blue, stars, a half moon at the upper right, a cool light on the crests
    c.save();c.globalCompositeOperation="screen";g=c.createLinearGradient(0,0,0,640);g.addColorStop(0,"rgba(30,40,80,0.5)");g.addColorStop(0.75,"rgba(60,70,110,0.12)");g.addColorStop(1,"rgba(60,70,110,0)");
    c.fillStyle=g;c.fillRect(0,0,W,640);const R=ag_rnd(77);for(let i=0;i<160;i++){const x=R()*W,y=R()*420,s=R();c.fillStyle="rgba(230,236,255,"+(0.25+0.6*s*s)+")";c.beginPath();c.arc(x,y,0.6+1.2*s*s,0,TAU);c.fill();}
    g=c.createRadialGradient(1500,190,10,1500,190,260);g.addColorStop(0,"rgba(200,210,240,0.35)");g.addColorStop(1,"rgba(200,210,240,0)");c.fillStyle=g;c.fillRect(1100,0,820,560);c.restore();
    c.fillStyle="rgb(236,236,224)";c.beginPath();c.arc(1500,190,30,0,TAU);c.fill();c.fillStyle="rgba(40,48,80,0.92)";c.beginPath();c.arc(1516,182,28,0,TAU);c.fill();}}
AG_PLACES.fsHills=c=>fs_paintHills(c,{});
AG_PLACES.fsHillsNight=c=>fs_paintHills(c,{night:true});
AG_ROOMS.fsHillsNight="fsHills";                     // the hills by night are the hills: from day to night the camera glides on

/* ---------------------------------------------------------------- the car
   fs_car(ctx, x, y, s, o): a small car of the 1980s, seen from its right side, facing right, (x, y) the middle of its wheelbase on
   the road, s its size (520 px long at 1), tilted by o.ang to the road. o.rot turns its wheels (radians); o.night lights its lamps and
   darkens its windows; o.people, who sits in it, each {seat: "driver" | "front" | "back" | "back2", skin, hair, top}: the driver
   nearest us (a right-hand-drive car), the one beside them just beyond; o.a. */
const FS_CAR={body:[220,210,186],trim:[70,72,76],glass:[176,196,206]};
function fs_carPath(c){c.moveTo(-262,-34);c.lineTo(-266,-112);c.quadraticCurveTo(-262,-128,-240,-130);c.lineTo(-176,-134);c.lineTo(-150,-206);
  c.quadraticCurveTo(-144,-214,-130,-214);c.lineTo(70,-214);c.quadraticCurveTo(84,-214,92,-204);c.lineTo(150,-136);c.lineTo(236,-126);
  c.quadraticCurveTo(262,-122,264,-96);c.lineTo(264,-40);c.quadraticCurveTo(262,-30,250,-30);c.lineTo(-250,-30);c.quadraticCurveTo(-262,-30,-262,-34);c.closePath();}
const FS_WIN={back:c=>{c.moveTo(-160,-140);c.lineTo(-138,-200);c.lineTo(-30,-200);c.lineTo(-30,-140);c.closePath();},
  front:c=>{c.moveTo(-18,-140);c.lineTo(-18,-200);c.lineTo(64,-200);c.quadraticCurveTo(74,-200,80,-194);c.lineTo(128,-140);c.closePath();}};
// where each seat's head is, along the car, and its size: the far-side seats a little smaller and a little ahead, so both heads show
const FS_SEAT={driver:[34,-1],front:[74,-0.86],back:[-92,-1],back2:[-58,-0.86]};
function fs_occupant(c,p,night){const [x,k]=FS_SEAT[p.seat],y=-146,sk=night?mix(p.skin,[40,44,70],0.62):p.skin,hr=night?mix(p.hair,[20,22,40],0.5):p.hair,tp=night?mix(p.top,[30,34,60],0.6):p.top;
  c.save();c.translate(x,y);c.scale(Math.abs(k),Math.abs(k));
  // the shoulders, then the neck, the head, its hair over the back of the head and a small ear
  c.fillStyle=rgba(tp,1);c.beginPath();c.moveTo(-30,24);c.quadraticCurveTo(-26,4,-8,0);c.lineTo(10,0);c.quadraticCurveTo(28,4,32,24);c.closePath();c.fill();
  c.fillStyle=rgba(mix(sk,[60,30,20],0.2),1);c.fillRect(-6,-10,13,14);
  c.fillStyle=rgba(sk,1);c.beginPath();c.ellipse(2,-26,15,19,0,0,TAU);c.fill();
  c.fillStyle=rgba(hr,1);c.beginPath();c.moveTo(-14,-16);c.quadraticCurveTo(-18,-44,4,-46);c.quadraticCurveTo(18,-46,18,-34);c.quadraticCurveTo(6,-36,-2,-30);c.quadraticCurveTo(-8,-22,-10,-12);c.closePath();c.fill();
  c.fillStyle=rgba(mix(sk,[80,30,20],0.25),1);c.beginPath();c.ellipse(-3,-24,3.5,5,0,0,TAU);c.fill();c.restore();}
function fs_car(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const night=!!o.night,body=night?mix(FS_CAR.body,[44,50,80],0.62):FS_CAR.body;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.ang||0);ctx.scale(s,s);
  ag_floorShadow(ctx,-8,2,300,22,night?0.5:0.32);
  // the lamps' light on the road ahead, at night
  if(night&&o.lights!==0){const la=o.lights==null?1:o.lights;const g=ctx.createLinearGradient(260,-70,900,-20);g.addColorStop(0,"rgba(255,244,210,"+(0.5*la)+")");g.addColorStop(1,"rgba(255,244,210,0)");
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(258,-78);ctx.lineTo(900,-130);ctx.lineTo(980,20);ctx.lineTo(258,-50);ctx.closePath();ctx.fill();}
  // the body: a matte fill, lit from the upper right, its shade below the belt line
  ag_soft(ctx,fs_carPath,body,mix(body,[255,252,240],0.5),180,-190,300,"rgba(30,26,20,0.3)",18,night?0.15:0.6);
  // the windows: what's in them first, then the glass over it
  for(const k of ["back","front"]){ctx.save();ag_shape(ctx,FS_WIN[k]);ctx.clip();ctx.fillStyle=night?"rgb(30,34,52)":"rgb(92,100,106)";ctx.fillRect(-200,-230,360,110);
    // the far side's heads first, the near side's over them
    const ps=(o.people||[]).filter(p=>(k==="front")===(p.seat==="driver"||p.seat==="front")).sort((p,q)=>Math.abs(FS_SEAT[p.seat][1])-Math.abs(FS_SEAT[q.seat][1])),
      stay=ps.filter(p=>p.a==null||p.a>=1);
    stay.forEach(p=>fs_occupant(ctx,p,night));
    // someone leaving (p.a below 1) fades as one picture: the window, drawn again with them in it, laid over the window without them
    for(const p of ps)if(p.a!=null&&p.a>0&&p.a<1){ctx.save();ctx.globalAlpha*=p.a;ctx.fillStyle=night?"rgb(30,34,52)":"rgb(92,100,106)";ctx.fillRect(-200,-230,360,110);
      ps.filter(q=>q===p||stay.includes(q)).forEach(q=>fs_occupant(ctx,q,night));ctx.restore();}
    const g=ctx.createLinearGradient(-160,-210,120,-130);g.addColorStop(0,"rgba("+FS_CAR.glass.join(",")+","+(night?0.12:0.38)+")");g.addColorStop(0.5,"rgba(255,255,255,"+(night?0.04:0.16)+")");
    g.addColorStop(1,"rgba("+FS_CAR.glass.join(",")+","+(night?0.1:0.3)+")");ctx.fillStyle=g;ctx.fillRect(-200,-230,360,110);ctx.restore();
    ctx.strokeStyle=rgba(FS_CAR.trim,0.9);ctx.lineWidth=3.2;ag_shape(ctx,FS_WIN[k]);ctx.stroke();}
  // the door's line, its handle, the bumpers, the lamps
  ctx.strokeStyle="rgba(40,36,30,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-24,-136);ctx.lineTo(-24,-36);ctx.moveTo(140,-128);ctx.lineTo(140,-36);ctx.stroke();
  ctx.fillStyle=rgba(FS_CAR.trim,0.9);rr(ctx,96,-118,22,6,3);ctx.fill();rr(ctx,-74,-118,22,6,3);ctx.fill();
  rr(ctx,236,-62,32,16,6);ctx.fill();rr(ctx,-270,-62,30,16,6);ctx.fill();
  ctx.fillStyle=night?"rgba(255,248,220,1)":"rgba(244,236,214,1)";rr(ctx,248,-104,16,22,4);ctx.fill();
  ctx.fillStyle=night?"rgba(214,70,60,1)":"rgba(170,70,62,0.9)";rr(ctx,-268,-108,12,24,3);ctx.fill();
  if(night){ctx.save();ctx.globalCompositeOperation="lighter";let g=ctx.createRadialGradient(-262,-96,1,-262,-96,46);g.addColorStop(0,"rgba(220,60,50,0.5)");g.addColorStop(1,"rgba(220,60,50,0)");
    ctx.fillStyle=g;ctx.fillRect(-310,-140,96,90);g=ctx.createRadialGradient(258,-93,1,258,-93,40);g.addColorStop(0,"rgba(255,248,220,0.6)");g.addColorStop(1,"rgba(255,248,220,0)");ctx.fillStyle=g;ctx.fillRect(220,-130,80,80);ctx.restore();}
  // the wheels: tyre, hubcap, four spokes that turn
  for(const wx of [-168,170]){ctx.fillStyle="#26272B";ctx.beginPath();ctx.arc(wx,-30,44,0,TAU);ctx.fill();ctx.fillStyle="rgba(40,36,30,0.5)";ctx.beginPath();ctx.arc(wx,-36,50,Math.PI*1.05,Math.PI*1.95);ctx.lineTo(wx,-36);ctx.fill();
    ctx.fillStyle=night?"#5A5E68":"#B8B6B0";ctx.beginPath();ctx.arc(wx,-30,24,0,TAU);ctx.fill();ctx.strokeStyle=night?"#40434C":"#8E8C86";ctx.lineWidth=3;
    for(let i=0;i<4;i++){const an=(o.rot||0)+i*Math.PI/2;ctx.beginPath();ctx.moveTo(wx+Math.cos(an)*6,-30+Math.sin(an)*6);ctx.lineTo(wx+Math.cos(an)*20,-30+Math.sin(an)*20);ctx.stroke();}}
  ctx.restore();}
// a car driving along the left lane from u0 to u1 over [t0, t1] (eased in and out, or o.lin at a steady speed); returns where it is
function fs_drive(ctx,tt,t0,t1,u0,u1,o){const v=clamp((tt-t0)/Math.max(0.1,t1-t0),0,1),k=o&&o.lin?v:ag_sine(v),u=lerp(u0,u1,k),L=fs_lane(u),s=(o&&o.s||1)*L.s;
  fs_car(ctx,L.x,L.y,s,Object.assign({ang:L.ang,rot:u*90},o||{}));return{u,x:L.x,y:L.y,s};}

/* ---------------------------------------------------------------- road signs, the switch, the licence */
// a road sign on a post: its foot at (x, y) on the verge, its board's words {kick, title}, o.a, o.k (springs up from its foot), o.lit
// (0 to 1: a blue edge), o.dim (0 to 1: passed, quieter); the board is at least 28 px as seen at zoom 1
function fs_sign(ctx,x,y,words,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const kw=ag_tw(ctx,String(words.kick).toUpperCase(),{w:700,size:28,ls:4}),
    tw=ag_tw(ctx,words.title,{w:800,size:40}),w=Math.max(kw,tw)+56,h=112,post=o.post||150,bx=x-w/2,by=y-post-h;
  ctx.save();ctx.globalAlpha*=a*(1-0.35*(o.dim||0));if(o.k!=null)ag_about(ctx,x,y,lerp(0.5,1,o.k));
  ag_floorShadow(ctx,x+AG.sdx,y+2,30,7,0.3);
  ctx.fillStyle="#5C5E64";ctx.fillRect(x-5,by+h-6,10,post+6);ctx.fillStyle="rgba(255,255,255,0.3)";ctx.fillRect(x+1,by+h,2,post-4);
  ag_box(ctx,bx,by,w,h,12,{edge:o.lit>0.05?AG.blue:[90,92,98],edgeA:o.lit>0.05?0.5+0.45*o.lit:0.5,glow:o.lit>0.05?AG.blue:null,glowA:o.lit||0});
  ag_T(ctx,String(words.kick).toUpperCase(),x,by+42,{w:700,size:28,ls:4,align:"center",col:AG.blue});ag_T(ctx,words.title,x,by+90,{w:800,size:40,align:"center"});
  ctx.restore();return{x:bx,y:by,w,h};}
// the switch the old licence was: a matte plate with a toggle, off below and on above (u 0 to 1), its two words beside it
function fs_switch(ctx,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=ag_sine(u);ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+90,y+150,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,180,300,26,{});ag_box(ctx,x+58,y+50,64,200,20,{edge:[120,116,108],edgeA:0.4});
  const ty=lerp(y+178,y+122,k);ctx.save();ctx.shadowColor="rgba(46,38,28,0.35)";ctx.shadowBlur=14;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;
  const g=ctx.createLinearGradient(0,ty-36,0,ty+36);g.addColorStop(0,"#F6F4EF");g.addColorStop(1,"#D8D4CC");ctx.fillStyle=g;rr(ctx,x+64,ty-36,52,72,14);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(60,50,40,0.25)";ctx.lineWidth=1.5;rr(ctx,x+64,ty-36,52,72,14);ctx.stroke();
  ag_T(ctx,"Full licence",x+214,y+92,{w:800,size:40,col:k>0.5?AG.ink:AG.mut,a:0.45+0.55*k});ag_T(ctx,"On",x+214,y+52,{w:700,size:28,ls:4,col:AG.kick,a:0.45+0.55*k});
  ag_T(ctx,"No licence",x+214,y+268,{w:800,size:40,col:k<0.5?AG.ink:AG.mut,a:1-0.55*k});ag_T(ctx,"Off",x+214,y+228,{w:700,size:28,ls:4,col:AG.kick,a:1-0.55*k});
  ctx.restore();}
// the licence card a hand holds, in figure space at the wrist: a small pale card, a photo, lines (decoration, no words)
function fs_licence(c,h){const [x,y]=h.near;c.save();c.translate(x+60,y-26);c.rotate(-0.16);c.shadowColor="rgba(46,38,28,0.3)";c.shadowBlur=10;c.shadowOffsetX=-4;c.shadowOffsetY=5;
  c.fillStyle="#F2EEE4";rr(c,-74,-48,148,96,10);c.fill();c.shadowColor="transparent";c.fillStyle="rgba(120,140,150,0.55)";rr(c,-62,-36,44,56,5);c.fill();
  c.fillStyle="rgba(90,96,104,0.55)";for(const [ly,lw] of [[-28,96],[-12,74],[4,86],[20,60]])c.fillRect(-8,ly,lw*0.7,6);c.fillStyle="rgba(38,102,132,0.7)";c.fillRect(-74,30,148,10);c.restore();}

/* ---------------------------------------------------------------- the people of the story, dressed for their time */
const FS_P={
  teen:{key:"fs_teen",name:"A young driver",skin:[196,148,114],hair:{style:"side",c:[38,30,26]},top:{kind:"sweater",c:[132,78,84]},breath:0.31},
  parent:{key:"fs_parent",name:"A parent",skin:[226,190,160],hair:{style:"bob",c:[112,84,60]},earrings:[214,200,170],top:{kind:"cardigan",c:[112,108,92],inner:[230,224,210]},breath:0.26}
};
// the people in the car, each a seat and colours (the young driver and the parent; friends at night)
const FS_RIDE={teen:{skin:FS_P.teen.skin,hair:FS_P.teen.hair.c,top:FS_P.teen.top.c},parent:{skin:FS_P.parent.skin,hair:FS_P.parent.hair.c,top:FS_P.parent.top.c},
  f1:{skin:[234,200,170],hair:[150,110,70],top:[96,110,120]},f2:{skin:[140,96,70],hair:[30,24,22],top:[150,140,120]},f3:{skin:[212,170,136],hair:[60,44,34],top:[118,96,110]}};
const fs_seat=(who,seat)=>Object.assign({seat},FS_RIDE[who]);
