/* ===== It feels like understanding: the film's own places, people of 1999 and things =====
   Film 3 of What an agent is. Everything here is this film's own, with the prefix fu_ (FU_ for constants); the series' look
   (kit.js, room.js, people.js, agent.js, cards.js) is used as it is, never changed. Sizes are in the 1920 x 1080 frame; every word is
   drawn live with ag_T, at least 28 px as seen, and nothing but the captions goes below y 890.
     plan.js    the places, the colours of this film's things, the people of 1999 and their desks, and the drawing in graphite on the
                wall: Earth, Mars, the paths, the two orbiters
     work.js    today's things: Jun's desk and the agent, Anil's desk and his screen, the advisers and their lists, students as plain
                shapes, the zip and its scale, the gauges, the calendar, the evidence folder, the record of what the agent's hands did,
                the team's log and the faculty's own list
     scenes.js  the seven chapters */

/* ---------------------------------------------------------------- colours of this film's own things (none means a check or data) */
const FU={graphite:[58,60,66],earth:[132,152,168],mars:[184,128,106],beige:[226,219,203],beigeDk:[182,172,150],phosphor:[206,222,212],
  paper:[247,245,240],rule:[196,190,180],dust:[150,146,138]};

/* ---------------------------------------------------------------- places, painted once: the series' lab, with its veins kept quiet where
   this film puts its drawings and words. The marble's own default zones (behind the middle, and the kicker at the top left) stay. */
const FU_KICK=[480,90,420,46,0.3];
AG_PLACES.fuWall=c=>ag_paintLab(c,{quiet:[[980,250,880,190,0.8],[1124,476,250,210,0.4],FU_KICK]});            // 1999: the drawing of space across the upper wall
AG_PLACES.fuWallDim=c=>{ag_paintLab(c,{quiet:[[980,250,880,190,0.8],[1124,476,250,210,0.4],FU_KICK]});            // the same wall, the light lower: the night of the loss
  c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(214,212,214)";c.fillRect(0,0,W,H);c.restore();};
AG_PLACES.fuData=c=>ag_paintLab(c,{seed:2,quiet:[[1180,300,520,250,0.7],[600,330,420,200,0.5],FU_KICK]});          // the data team: the agent, its tools and its cards
AG_PLACES.fuFaculty=c=>ag_paintLab(c,{seed:4,quiet:[[620,330,600,230,0.7],[1300,260,360,160,0.5],FU_KICK]});      // the Faculty of Health: the advisers along the wall
AG_PLACES.fuQuiet=c=>ag_paintLab(c,{seed:6,quiet:[[960,360,860,260,0.8],FU_KICK]});                               // the zip, the study cards, the word in the middle

/* ---------------------------------------------------------------- words in the corner: when and where, on a small card so they read over
   anything drawn behind them; the time in violet, the place in grey capitals */
function fu_when(ctx,when,where,a){if(a<=0.01)return;const x=72,y=52,h=62,w1=ag_tw(ctx,when,{w:800,size:30}),cap=where?String(where).toUpperCase():"",
    w2=cap?ag_tw(ctx,cap,{w:700,size:28,ls:3.5}):0,w=56+w1+(cap?44+w2:0);
  ag_box(ctx,x,y,w,h,h/2,{a});withA(ctx,a,()=>{ag_T(ctx,when,x+28,y+42,{w:800,size:30,col:AG.violet});
    if(cap){ctx.fillStyle=rgba(AG.mut,0.55);ctx.beginPath();ctx.arc(x+28+w1+22,y+h/2,3.2,0,TAU);ctx.fill();ag_T(ctx,cap,x+28+w1+44,y+41,{w:700,size:28,ls:3.5,col:AG.kick});}});}
// a desk's sign on the wall above it: the place, and who works there
function fu_sign(ctx,x,y,place,who,a,k){if(a<=0.01)return;const w1=ag_tw(ctx,place,{w:700,size:30}),w2=ag_tw(ctx,who,{w:500,size:30}),w=w1+w2+92,h=60;
  ctx.save();if(k!=null)ag_about(ctx,x,y,lerp(0.6,1,k));ag_box(ctx,x-w/2,y-h/2,w,h,h/2,{a});
  withA(ctx,a,()=>{ag_T(ctx,place,x-w/2+30,y+11,{w:700,size:30});ctx.fillStyle=rgba(AG.mut,0.55);ctx.beginPath();ctx.arc(x-w/2+30+w1+16,y,3.2,0,TAU);ctx.fill();
    ag_T(ctx,who,x-w/2+30+w1+32,y+11,{w:500,size:30,col:AG.mut});});ctx.restore();}
// a name card under a person: the name, and a line under it
function fu_nameCard(ctx,x,y,name,line,a){if(a<=0.01)return;const w=Math.max(ag_tw(ctx,name,{w:700,size:32}),ag_tw(ctx,line,{w:500,size:28}))+56;
  ag_box(ctx,x,y,w,96,16,{a});withA(ctx,a,()=>{ag_T(ctx,name,x+28,y+42,{w:700,size:32});ag_T(ctx,line,x+28,y+78,{w:500,size:28,col:AG.mut});});}
// a source card: who, and when
function fu_source(ctx,x,y,who,when,a,o){o=o||{};if(a<=0.01)return;const w=ag_tw(ctx,who,{w:700,size:30})+ag_tw(ctx,when,{w:500,size:30})+92;
  ag_box(ctx,x,y,w,64,32,{a});withA(ctx,a,()=>{ag_T(ctx,who,x+30,y+42,{w:700,size:30});ag_T(ctx,when,x+w-30,y+42,{w:500,size:30,col:AG.mut,align:"right"});
    ctx.fillStyle=rgba(AG.mut,0.5);ctx.beginPath();ctx.arc(x+w-46-ag_tw(ctx,when,{w:500,size:30}),y+32,3,0,TAU);ctx.fill();});return w;}

/* ---------------------------------------------------------------- the people of 1999: composites, never the mission's real people, nobody
   named; dressed for their year, with the series' proportions. At the builders' desk, in Colorado: a cardigan, and a fleece vest over a
   checked shirt; at the navigators' desk, in California: a shirt and tie, and a polo shirt. */
function fu_checks(c,P){c.save();ag_shape(c,AG_F.torso);c.clip();c.strokeStyle=rgba(ag_dk(P.top.c,0.3),0.28);c.lineWidth=5;
  for(let x=60;x<460;x+=34){c.beginPath();c.moveTo(x,560);c.lineTo(x+12,1100);c.stroke();}for(let y=600;y<1100;y+=34){c.beginPath();c.moveTo(60,y);c.lineTo(460,y+8);c.stroke();}c.restore();}
function fu_vest(c,P){const v=P.top.vest;c.save();ag_shape(c,AG_F.torso);c.clip();
  const sh=cc=>{cc.moveTo(60,560);cc.lineTo(236,566);cc.bezierCurveTo(262,640,290,760,312,900);cc.lineTo(330,1100);cc.lineTo(60,1100);cc.closePath();
    cc.moveTo(358,604);cc.bezierCurveTo(350,700,334,800,322,900);cc.lineTo(336,1100);cc.lineTo(470,1100);cc.lineTo(470,600);cc.closePath();};
  ag_soft(c,sh,v,ag_lt(v,0.3),380,700,320,rgba(ag_dk(v,0.7),0.4),24);
  // the zip, and the fleece's soft nap
  c.strokeStyle=rgba(ag_dk(v,0.5),0.7);c.lineWidth=3;c.beginPath();c.moveTo(314,900);c.lineTo(330,1100);c.stroke();
  const R=ag_rnd(9);c.fillStyle=rgba(ag_lt(v,0.25),0.18);for(let i=0;i<400;i++){c.beginPath();c.arc(70+R()*400,600+R()*500,1.6+R()*1.6,0,TAU);c.fill();}c.restore();}
function fu_tie(c,P){ag_soft(c,cc=>{cc.moveTo(300,612);cc.lineTo(322,610);cc.lineTo(330,640);cc.lineTo(338,820);cc.lineTo(318,856);cc.lineTo(300,820);cc.lineTo(306,642);cc.closePath();},
  P.top.tie,ag_lt(P.top.tie,0.3),326,680,90,rgba(ag_dk(P.top.tie,0.7),0.4),8);
  c.fillStyle=rgba(ag_dk(P.top.tie,0.35),0.5);for(let y=660;y<840;y+=26){c.beginPath();c.moveTo(304,y);c.lineTo(336,y-10);c.lineTo(336,y-4);c.lineTo(304,y+6);c.closePath();c.fill();}}
function fu_polo(c,P){c.save();ag_shape(c,AG_F.torso);c.clip();c.strokeStyle=rgba(ag_dk(P.top.c,0.3),0.55);c.lineWidth=2.4;c.beginPath();c.moveTo(304,612);c.lineTo(310,720);c.lineTo(330,720);c.lineTo(326,612);c.stroke();
  for(const y of [650,690]){c.fillStyle=rgba(ag_lt(P.top.c,0.5),1);c.beginPath();c.arc(318,y,4.5,0,TAU);c.fill();}c.restore();}
const FU_PEOPLE={
  builderA:{name:"Builder in a cardigan",key:"fu_bA",skin:[232,196,168],hair:{style:"bob",c:[104,72,50]},earrings:[214,200,170],top:{kind:"cardigan",c:[168,150,124],inner:[236,232,224]},breath:0.3},
  builderB:{name:"Builder in a fleece vest",key:"fu_bB",skin:[226,184,152],hair:{style:"side",c:[128,96,66]},beard:[120,90,64],top:{kind:"shirt",c:[184,170,150],vest:[98,104,108],paint:(c,P)=>{fu_checks(c,P);fu_vest(c,P);}},breath:0.26},
  navA:{name:"Navigator in a shirt and tie",key:"fu_nA",skin:[196,150,116],hair:{style:"cropped",c:[42,34,30]},glasses:[60,56,52],top:{kind:"shirt",c:[230,230,224],tie:[118,70,64],paint:fu_tie},breath:0.27},
  navB:{name:"Navigator in a polo shirt",key:"fu_nB",skin:[130,88,64],hair:{style:"bun",c:[30,24,22]},earrings:[220,206,176],top:{kind:"sweater",c:[176,146,140],paint:fu_polo},breath:0.31}
};

/* ---------------------------------------------------------------- 1999's desks: a beige monitor, a desk phone, ring binders, printed plots */
// a beige monitor standing on a desk, its foot's middle at (x, y), w wide; o.draw(ctx, x, y, w, h) draws its glass; o.on lights it; o.a
function fu_crt(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*0.82,bx=x-w/2,by=y-h-26,d=w*0.22,sw=w*0.78,sh=sw*0.74,sx=x-sw/2-4,sy=by+(h-sh)*0.38;
  ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+AG.sdx*2,y+2,w*0.55,12,0.24);
  // the deep back, seen past the right edge, and the foot
  ctx.fillStyle=rgba(ag_dk(FU.beige,0.2),1);ctx.beginPath();ctx.moveTo(bx+w,by+8);ctx.lineTo(bx+w+d,by+h*0.2);ctx.lineTo(bx+w+d,by+h*0.82);ctx.lineTo(bx+w,by+h-4);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(ag_dk(FU.beige,0.12),1);rr(ctx,x-w*0.26,y-30,w*0.52,30,8);ctx.fill();ctx.fillStyle=rgba(FU.beige,1);rr(ctx,x-w*0.18,by+h-6,w*0.36,14,4);ctx.fill();
  ag_soft(ctx,cc=>ag_rect(cc,bx,by,w,h,14),FU.beige,[255,252,244],bx+w*0.75,by+h*0.2,w*0.9,"rgba(80,70,50,0.3)",14);
  // the glass: a dark rim, the screen bulging a little, a soft sheen
  ctx.fillStyle="#3B3D40";rr(ctx,sx-8,sy-8,sw+16,sh+16,16);ctx.fill();
  ctx.save();rr(ctx,sx,sy,sw,sh,14);ctx.clip();const on=o.on==null?1:o.on;ctx.fillStyle=rgba(mix([60,66,64],FU.phosphor,on),1);ctx.fillRect(sx,sy,sw,sh);
  if(o.draw&&on>0)withA(ctx,on,()=>o.draw(ctx,sx,sy,sw,sh));
  let g=ctx.createRadialGradient(sx+sw*0.3,sy+sh*0.25,4,sx+sw*0.5,sy+sh*0.5,sw*0.8);g.addColorStop(0,"rgba(255,255,255,0.22)");g.addColorStop(1,"rgba(0,0,0,0.12)");ctx.fillStyle=g;ctx.fillRect(sx,sy,sw,sh);ctx.restore();
  // a power light and two small knobs under the glass
  ctx.fillStyle=rgba(ag_dk(FU.beige,0.25),1);for(const k of [0.62,0.7]){ctx.beginPath();ctx.arc(bx+w*k,by+h-18,4,0,TAU);ctx.fill();}
  ctx.fillStyle=o.on===0?"#7d8a80":"#8fd0a0";ctx.beginPath();ctx.arc(bx+w*0.84,by+h-18,4,0,TAU);ctx.fill();
  ctx.restore();return{x:sx,y:sy,w:sw,h:sh};}
// a desk phone of its time, its middle at (x, y), s its size
function fu_phone(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ag_floorShadow(ctx,-4,10,74,12,0.22);
  ag_soft(ctx,cc=>{cc.moveTo(-58,8);cc.lineTo(-44,-26);cc.lineTo(44,-26);cc.lineTo(58,8);cc.closePath();},FU.beige,[255,252,244],20,-20,80,"rgba(80,70,50,0.3)",8);
  // the handset, lifted a little when it rings (o.ring)
  const r=o.ring||0;ctx.save();ctx.translate(0,-30-6*r);ctx.rotate(Math.sin(r*40)*0.04*r);ag_soft(ctx,cc=>{cc.moveTo(-60,-6);cc.quadraticCurveTo(-62,-18,-48,-18);cc.lineTo(48,-18);cc.quadraticCurveTo(62,-18,60,-6);cc.lineTo(46,4);cc.lineTo(-46,4);cc.closePath();},
    ag_dk(FU.beige,0.06),[255,252,244],20,-14,70,"rgba(80,70,50,0.3)",6);ctx.restore();
  ctx.fillStyle=rgba(ag_dk(FU.beige,0.3),0.8);for(let i=0;i<3;i++)for(let j=0;j<3;j++){ctx.beginPath();ctx.arc(-14+j*14,-14+i*7,2.6,0,TAU);ctx.fill();}ctx.restore();}
// ring binders standing on a desk, from (x, y) at their foot, n of them
function fu_binders(ctx,x,y,n,s,cols){s=s||1;cols=cols||[[120,112,104],[164,150,128],[96,100,106],[150,128,118]];for(let i=0;i<n;i++){const bx=x+i*30*s,c=cols[i%cols.length],h=(150+(i%2)*8)*s;
  ag_soft(ctx,cc=>ag_rect(cc,bx,y-h,28*s,h,4*s),c,ag_lt(c,0.3),bx+20*s,y-h+20*s,60*s,rgba(ag_dk(c,0.7),0.35),6);
  ctx.fillStyle=rgba(ag_lt(c,0.55),0.9);ctx.fillRect(bx+5*s,y-h+26*s,18*s,30*s);ctx.fillStyle=rgba(ag_dk(c,0.4),0.8);ctx.beginPath();ctx.arc(bx+14*s,y-26*s,5*s,0,TAU);ctx.fill();}}
// a sheet of paper lying on a desk, seen a little from above: corners [x, y] of its four edges, and what it shows (o.draw, in its own flat frame w by h)
function fu_sheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.2)";ctx.shadowBlur=12;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(FU.paper,1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  if(o.draw)o.draw(ctx,-w/2,-h/2,w,h);ctx.restore();}
// a printed plot: axes and a curve, as navigators print them
function fu_plotDraw(ctx,x,y,w,h,p,col){ctx.strokeStyle="rgba(60,62,68,0.45)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+w*0.1,y+h*0.12);ctx.lineTo(x+w*0.1,y+h*0.86);ctx.lineTo(x+w*0.92,y+h*0.86);ctx.stroke();
  ctx.strokeStyle="rgba(60,62,68,0.14)";for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(x+w*0.1,y+h*(0.86-i*0.15));ctx.lineTo(x+w*0.92,y+h*(0.86-i*0.15));ctx.stroke();}
  if(p>0){ctx.strokeStyle=col||"rgba(58,60,66,0.85)";ctx.lineWidth=2.4;ctx.beginPath();for(let k=0;k<=40*p;k++){const u=k/40,xx=x+w*(0.1+0.82*u),yy=y+h*(0.8-0.55*Math.sin(u*2.6)*u);k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}}

/* ---------------------------------------------------------------- the file of numbers handed over, "Small forces": a column of numbers, and a
   tag at its top where the unit goes, blank until Odyssey's team writes both units in it (o.unit 0 to 1); o.rows 0 to 1 fills the column */
const FU_FORCES=["0.0158","0.0161","0.0154","0.0163","0.0159"];
function fu_fileCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=300,h=330;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);if(o.k!=null)ag_about(ctx,w/2,h/2,lerp(0.6,1,o.k));
  ag_box(ctx,0,0,w,h,16,{});ag_T(ctx,"Small forces",26,52,{w:700,size:32});
  // the unit's tag: dashed and empty, then the two units
  const u=o.unit||0,tw2=ag_tw(ctx,"N·s · lbf·s",{w:700,size:28})+40,tx=w-26-tw2,ty=82;ctx.save();ctx.setLineDash(u>0.5?[]:[7,6]);ctx.strokeStyle=u>0.5?rgba(AG.blue,0.9):"rgba(86,92,100,0.55)";ctx.lineWidth=2.2;rr(ctx,tx,ty,tw2,46,10);ctx.stroke();ctx.restore();
  if(u>0)withA(ctx,ag_in(u,0.5,0.5),()=>ag_T(ctx,"N·s · lbf·s",tx+20,ty+33,{w:700,size:28,col:AG.blue}));
  else ag_T(ctx,"unit?",tx+tw2/2,ty+33,{w:500,size:28,col:AG.mut,align:"center",a:0.6*(o.ask||0)});
  const n=FU_FORCES.length,r=o.rows==null?1:o.rows;for(let i=0;i<n;i++){const v=clamp(r*n-i,0,1);if(v<=0)break;ag_T(ctx,FU_FORCES[i],w/2,170+i*38,{w:500,size:28,f:"mono",align:"center",a:v});}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a thought bubble: a card with three small rounds trailing down to (px, py);
   o.k springs it in, o.edge a colour, o.blank shows only a turned-away tag (the meaning unseen); returns its box */
function fu_bubble(ctx,cx,cy,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||32,w=o.w||(ag_tw(ctx,text,{w:700,size})+64),h=size+44,x=cx-w/2,y=cy-h/2;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,o.px==null?cx:o.px,o.py==null?cy:o.py,lerp(0.4,1,o.k));
  if(o.px!=null){const n=3;for(let i=0;i<n;i++){const u=(i+1)/(n+1),bx=lerp(cx,o.px,0.35+u*0.65),by=lerp(cy+h/2,o.py,0.35+u*0.65),r=lerp(13,6,u);
    ag_card(ctx,c=>c.arc(bx,by,r,0,TAU),{x:bx-r,y:by-r,w:2*r,h:2*r},{edge:o.edge,edgeA:0.5});}}
  ag_box(ctx,x,y,w,h,h/2,{edge:o.edge,edgeA:o.edge?0.85:null});
  if(o.blank){ctx.save();ctx.translate(cx,cy);ctx.scale(o.turn==null?0.12:o.turn,1);ctx.fillStyle="rgba(86,92,100,0.28)";rr(ctx,-w*0.32,-14,w*0.64,28,10);ctx.fill();ctx.restore();}
  else if(o.draw)o.draw(ctx,cx,cy);
  else ag_T(ctx,text,cx,cy+size*0.36,{w:700,size,align:"center",col:o.col||AG.ink});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- an envelope, its question mark amber: a doubt sent by email, never answered */
function fu_envelope(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);
  ag_box(ctx,-60,-38,120,76,6,{});ctx.strokeStyle="rgba(86,92,100,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-58,-34);ctx.lineTo(0,6);ctx.lineTo(58,-34);ctx.stroke();
  ctx.fillStyle=rgba(AG.amber,1);ctx.beginPath();ctx.arc(40,22,15,0,TAU);ctx.fill();ag_T(ctx,"?",40,32,{w:800,size:28,align:"center",col:[255,255,255]});
  if(o.label)ag_T(ctx,o.label,0,-52,{w:700,size:28,align:"center",col:AG.mut});ctx.restore();}

/* ---------------------------------------------------------------- the drawing in graphite on the wall: Earth, Mars, and the paths between,
   as navigators draw them; o.p draws each part on (0 to 1) */
const FU_SPACE={earth:[700,204,50],mars:[1240,190,42],
  path:[700,204,830,30,1060,24,1154,190],          // the way to Mars, as planned: it meets the planned orbit at its near end
  real:[700,204,834,38,1080,48,1182,190],          // the way it went: a little lower each push, into the lower orbit
  plan:[86,30],low:[58,20],tilt:-0.16};            // the orbits round Mars, planned and real, as ellipses (radii), tilted a little
// a point on an orbit round Mars at angle th (0 at the near end, on the left, going over the far side as th grows): [x, y, behind]
function fu_orbitAt(o,th){const M=FU_SPACE.mars,c=Math.cos(FU_SPACE.tilt),s=Math.sin(FU_SPACE.tilt),ex=-o[0]*Math.cos(th),ey=-o[1]*Math.sin(th);
  return[M[0]+ex*c-ey*s,M[1]+ex*s+ey*c,Math.sin(th)>0];}
// an orbit round Mars, its back half drawn first (behind the planet) or its front half (in front): which "back" or "front"
function fu_orbit(ctx,o,which,a,col,dash){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=2.6;ctx.lineCap="round";if(dash)ctx.setLineDash(dash);
  ctx.beginPath();const k0=which==="back"?0:Math.PI,k1=k0+Math.PI;for(let i=0;i<=48;i++){const q=fu_orbitAt(o,lerp(k0,k1,i/48));i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();ctx.restore();}
// where each desk, person, monitor and sign stands in 1999: the builders' desk on the left, the navigators' on the right
const FU99={deskL:[10,842,580],deskR:[1330,842,580],crtL:[488,800,184],crtR:[1432,800,184],
  bA:[330,566,0.64],bB:[148,548,0.6],nA:[1590,566,0.64],nB:[1772,548,0.6],pillL:[300,262],pillR:[1620,262],bubL:[300,330],bubR:[1620,330]};
// a blue card: one of Odyssey's changes, and later Jun's team's; o.k springs it in, o.size
function fu_blueCard(ctx,cx,cy,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||30,w=ag_tw(ctx,text,{w:700,size})+64,h=size+34;if(a<=0)return{x:cx-w/2,y:cy-h/2,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,cx,cy,lerp(0.5,1,o.k));ag_box(ctx,cx-w/2,cy-h/2,w,h,14,{edge:o.col||AG.blue,edgeA:0.85});
  ag_T(ctx,text,cx,cy+size*0.36,{w:700,size,align:"center",col:o.textCol||AG.ink});ctx.restore();return{x:cx-w/2,y:cy-h/2,w,h};}
// a pencil circle drawn on from the top, with a second, fainter pass a hair off, and a soft fill of its colour hatched in graphite
function fu_pencilDisc(ctx,x,y,r,p,col,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a;ctx.save();ctx.globalAlpha*=a;
  const f=ag_in(p,0.55,0.45);if(f>0){ctx.save();ctx.globalAlpha*=f;const g=ctx.createRadialGradient(x+r*0.35,y-r*0.35,r*0.1,x,y,r);g.addColorStop(0,rgba(ag_lt(col,0.35),0.95));g.addColorStop(1,rgba(col,0.95));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    // graphite hatching on the side away from the window
    ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.strokeStyle="rgba(58,60,66,0.22)";ctx.lineWidth=1.6;for(let k=-r*2;k<r*2;k+=7){ctx.beginPath();ctx.moveTo(x+k-r,y+r);ctx.lineTo(x+k+r*0.2,y-r*1.2);ctx.stroke();}
    const sh=ctx.createRadialGradient(x+r*0.5,y-r*0.5,r*0.5,x+r*0.2,y-r*0.2,r*1.6);sh.addColorStop(0,"rgba(255,255,255,0.35)");sh.addColorStop(1,"rgba(255,255,255,0)");ctx.globalCompositeOperation="destination-out";
    ctx.fillStyle=sh;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();
    if(o.swirl){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.strokeStyle="rgba(250,236,220,"+(0.55*o.swirl)+")";ctx.lineWidth=3;ctx.lineCap="round";
      for(let i=0;i<4;i++){const yy=y-r*0.5+i*r*0.32,ph=(o.t||0)*0.25+i*1.7;ctx.beginPath();for(let k=0;k<=20;k++){const u=k/20,xx=x-r+u*2*r;ctx.lineTo(xx+Math.sin(ph)*8,yy+Math.sin(u*6+ph*2)*4);}ctx.stroke();}ctx.restore();}
    ctx.restore();}
  ctx.lineCap="round";const a0=-Math.PI/2,u=ag_sine(clamp(p/0.6,0,1));ctx.strokeStyle=rgba(FU.graphite,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r,a0,a0+u*TAU);ctx.stroke();
  ctx.strokeStyle=rgba(FU.graphite,0.3);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x+1.5,y-1,r+2.5,a0+0.3,a0+0.3+u*TAU*0.96);ctx.stroke();ctx.restore();}
// a dotted pencil line along a curve (eight numbers, as ag_bz), from u0 to u1, its dots spaced gap apart; col, lw
function fu_dots(ctx,p,u0,u1,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u1<=u0)return;const n=Math.max(2,Math.round((u1-u0)*(o.n||90)));ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=o.color||rgba(FU.graphite,0.75);
  for(let k=0;k<=n;k++){const q=ag_bz(p,lerp(u0,u1,k/n));ctx.beginPath();ctx.arc(q[0],q[1],o.r||2.8,0,TAU);ctx.fill();}ctx.restore();}
// a solid pencil line along a curve
function fu_line(ctx,p,u0,u1,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u1<=u0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=o.color||rgba(FU.graphite,0.85);ctx.lineWidth=o.lw||3;ctx.lineCap="round";
  if(o.dash)ctx.setLineDash(o.dash);ag_bzPath(ctx,p,u0,u1,60);ctx.stroke();ctx.restore();}
// a word in pencil on the wall
function fu_pencil(ctx,s,x,y,o){o=o||{};ag_T(ctx,s,x,y,Object.assign({w:600,size:30,col:FU.graphite},o));}
// Earth, Mars and the path between, each drawn on at its own moment (o.earth, o.mars, o.path, o.labels: 0 to 1)
function fu_space(ctx,o){o=o||{};const S=FU_SPACE,E=S.earth,M=S.mars;
  fu_pencilDisc(ctx,E[0],E[1],E[2],o.earth==null?1:o.earth,FU.earth,{a:o.a});
  fu_pencilDisc(ctx,M[0],M[1],M[2],o.mars==null?1:o.mars,FU.mars,{a:o.a,swirl:o.swirl,t:o.t});
  fu_dots(ctx,S.path,0.05,lerp(0.05,0.95,o.path==null?1:o.path),{a:o.a});
  const la=(o.labels==null?1:o.labels)*(o.a==null?1:o.a);if(la>0){fu_pencil(ctx,"Earth",E[0],E[1]+E[2]+46,{align:"center",a:la});fu_pencil(ctx,"Mars",M[0],M[1]+M[2]+46,{align:"center",a:la});}}

/* ---------------------------------------------------------------- the two orbiters, small matte models, plain shapes, no logo
   fu_orbiter: the Mars Climate Orbiter, a box with its dish and its one solar wing on one side (the reason its thrusters fired so
   often); fu_odyssey: Mars Odyssey, a box with a wing of three panels and a dish on a boom. (x, y) its middle, s its size, ang its
   heading; o.puff 0 to 1 a thruster's puff, o.burn 0 to 1 its engine's glow, o.a */
function fu_craftBody(ctx,s){ag_soft(ctx,cc=>ag_rect(cc,-22,-18,44,36,6),[214,206,186],[255,250,236],8,-14,40,"rgba(70,60,40,0.35)",8);
  ctx.strokeStyle="rgba(120,104,76,0.45)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-22,-2);ctx.lineTo(22,-2);ctx.stroke();}
function fu_panel(ctx,x,y,w,h){ctx.fillStyle="#4E5662";ctx.fillRect(x,y,w,h);ctx.strokeStyle="rgba(200,214,226,0.45)";ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+w*i/4,y);ctx.lineTo(x+w*i/4,y+h);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2);ctx.stroke();ctx.strokeStyle="rgba(30,34,40,0.6)";ctx.lineWidth=1.4;ctx.strokeRect(x,y,w,h);}
function fu_orbiter(ctx,x,y,s,ang,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang||0);ctx.scale(s,s);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=AG.sdx*0.5;ctx.shadowOffsetY=6;
  // the one wing, on a short boom, off one side only
  ctx.strokeStyle="#6B6F76";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-6,18);ctx.lineTo(-6,30);ctx.stroke();fu_panel(ctx,-40,30,70,26);
  fu_craftBody(ctx,s);ctx.restore();
  // its dish, and the engine's nozzle behind
  ctx.fillStyle="#E8E2D4";ctx.beginPath();ctx.ellipse(-8,-24,16,6,0,0,TAU);ctx.fill();ctx.strokeStyle="rgba(100,90,70,0.6)";ctx.lineWidth=1.2;ctx.stroke();
  ctx.fillStyle="#5C5F66";ctx.beginPath();ctx.moveTo(-22,-7);ctx.lineTo(-32,-12);ctx.lineTo(-32,8);ctx.lineTo(-22,3);ctx.closePath();ctx.fill();
  const b=o.burn||0;if(b>0){const g=ctx.createRadialGradient(-40,-2,1,-40,-2,30);g.addColorStop(0,"rgba(255,236,200,"+(0.95*b)+")");g.addColorStop(0.4,"rgba(255,190,120,"+(0.6*b)+")");g.addColorStop(1,"rgba(255,170,100,0)");
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(-48,-2,30*(0.8+0.2*Math.sin((o.t||0)*30)),12,0,0,TAU);ctx.fill();}
  const pf=o.puff||0;if(pf>0&&pf<1){const u=ag_eo(pf),al=(1-pf)*0.8;for(let i=0;i<4;i++){ctx.fillStyle="rgba(250,250,248,"+al+")";ctx.beginPath();ctx.arc(10+i*3,-20-u*(14+i*8),4+u*(4+i*2),0,TAU);ctx.fill();}}
  ctx.restore();}
function fu_odyssey(ctx,x,y,s,ang,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang||0);ctx.scale(s,s);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=AG.sdx*0.5;ctx.shadowOffsetY=6;
  ctx.strokeStyle="#6B6F76";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(34,0);ctx.stroke();fu_panel(ctx,34,-22,30,44);fu_panel(ctx,64,-22,30,44);fu_panel(ctx,94,-22,30,44);
  ctx.beginPath();ctx.moveTo(-10,-18);ctx.lineTo(-30,-44);ctx.stroke();
  ag_soft(ctx,cc=>ag_rect(cc,-22,-18,44,36,6),[206,200,188],[255,250,236],8,-14,40,"rgba(70,60,40,0.35)",8);ctx.restore();
  ctx.fillStyle="#E8E2D4";ctx.beginPath();ctx.ellipse(-32,-48,14,6,-0.6,0,TAU);ctx.fill();ctx.strokeStyle="rgba(100,90,70,0.6)";ctx.lineWidth=1.2;ctx.stroke();
  ctx.restore();}
