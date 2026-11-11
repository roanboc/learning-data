/* ===== Borrowed from the brain: brains that guess ahead, and a loop that expects =====
   What the opening's sea squirt, A step ahead and A loop that expects draw, in the module's look (added 11 November 2026):
     bbShore     a rocky shore under the sea: light from the surface at the top right, a big rock on the right where adult sea
                 squirts already live, and the place on it where the young one settles (BB_LAND)
     bb_squirt   a sea squirt: the young one, a tadpole with an eye spot, a tail and a tiny brain, swimming; then, settled head first,
                 its tail and most of its brain taken apart as it grows into the adult, a soft vase with two openings (o.m, 0 to 1)
     bb_fish     a small fish, a forager, and the bigger one that hunts it (o.big), drawn with tapering curves
     bb_dragonfly, bb_midge   a dragonfly in flight over the meadow, and the midge it catches
     bb_escalator   an escalator in ink, from the side, its steps moving or stopped, and a shoe that steps onto it and stumbles
     bb_raster   Schultz's cell, one row of its record in ink: a tick for each time it fires, a light and a drop of juice above
     bb_script, bb_rows, bb_campus   the nightly script's card, Monday's rows against what was expected, and the three campuses
   Every name starts with bb_ or BB_. */

/* ---------------------------------------------------------------- a rocky shore under the sea */
const BB_ROCK=bb_smooth([[720,1090],[790,860],[900,720],[1040,628],[1190,590],[1360,596],[1540,640],[1720,720],[1860,790],[1960,820]],6);
// where the young sea squirt settles, head first, and the way its body grows from there (away from the rock, up and a little left)
const BB_LAND=[1092,612],BB_AWAY=-1.9;
AG_PLACES.bbShore=c=>{bb_water(c,[150,194,196],[74,132,146],[40,84,98],61);
  // the sea floor, far, under a haze
  const g=c.createLinearGradient(0,800,0,H);g.addColorStop(0,rgba([150,146,122],1));g.addColorStop(1,rgba([110,104,84],1));c.fillStyle=g;c.beginPath();c.moveTo(0,H);c.lineTo(0,850);
  for(let x=0;x<=W;x+=24)c.lineTo(x,846-30*AG_NZ.fbm(x*0.002,1.7,3));c.lineTo(W,H);c.closePath();c.fill();
  const hz=c.createLinearGradient(0,760,0,900);hz.addColorStop(0,"rgba(74,132,146,0.55)");hz.addColorStop(1,"rgba(74,132,146,0)");c.fillStyle=hz;c.fillRect(0,760,W,140);
  // weed on the floor, on the left
  const R=ag_rnd(71);for(let i=0;i<9;i++){const x=40+R()*620,y=900+R()*120,h=140+R()*220;for(let k=0;k<3;k++){const P=[];for(let j=0;j<=8;j++){const q=j/8;P.push([x+k*13+Math.sin(q*3+i+k)*24*q,y-h*q]);}
    bb_strand(c,bb_smooth(P,3),14,4,rgba(mix([84,110,72],[138,132,80],R()),0.7),1);}}
  // the rock, lit from the top right, with a soft lighter top where the light falls
  ag_soft(c,cc=>{bb_path(cc,BB_ROCK.concat([[1960,1090]]));},[96,98,96],[188,190,180],1420,560,620,"rgba(10,20,30,0.5)",18,0.55);
  c.save();c.beginPath();bb_path(c,BB_ROCK.concat([[1960,1090]]));c.clip();for(let i=0;i<70;i++){const x=760+R()*1200,y=600+R()*480;c.fillStyle=rgba(mix([70,74,76],[150,150,140],R()),0.35);c.beginPath();c.ellipse(x,y,8+R()*26,5+R()*12,R()*3,0,TAU);c.fill();}
    for(let i=0;i<30;i++){const x=800+R()*1100,y=650+R()*400;c.fillStyle=rgba(mix([176,120,104],[206,176,120],R()),0.55);for(let k=0;k<4;k++){c.beginPath();c.arc(x+(R()-0.5)*30,y+(R()-0.5)*14,3+R()*6,0,TAU);c.fill();}}c.restore();
  // adult sea squirts that live on the rock already
  for(const [u,s] of [[0.53,0.9],[0.61,1.05],[0.68,0.8],[0.76,0.95]]){const q=bb_along(BB_ROCK,u);bb_squirtAdult(c,q[0],q[1]+6,s,q[2]-Math.PI/2,0);}
  ag_grain(c,0,0,W,H,1.3,63);};

/* ---------------------------------------------------------------- sea squirts */
const BB_TUNIC=[236,214,176],BB_TUNICDK=[182,146,112],BB_TUNICHI=[255,246,226];
// the adult: a soft vase from its base on the rock, with two openings at the top, one to take water in and one to let it out;
// ang: the way it grows (from its base), s its size, sw a gentle sway
function bb_squirtAdult(ctx,x,y,s,ang,sw){ctx.save();ctx.translate(x,y);ctx.rotate(ang+Math.PI/2+(sw||0));ctx.scale(s,s);
  ag_soft(ctx,c=>{c.moveTo(-20,0);c.bezierCurveTo(-58,-30,-56,-112,-30,-146);c.lineTo(-14,-146);c.bezierCurveTo(-8,-128,8,-126,16,-136);c.lineTo(30,-132);c.bezierCurveTo(58,-100,54,-30,20,0);c.closePath();},
    BB_TUNIC,BB_TUNICHI,22,-110,120,"rgba(80,50,30,0.4)",12,0.6);
  for(const [px,py,a] of [[-22,-150,-0.25],[23,-138,0.3]]){ctx.save();ctx.translate(px,py);ctx.rotate(a);ag_soft(ctx,c=>c.ellipse(0,0,14,7,0,0,TAU),mix(BB_TUNIC,[214,140,96],0.4),BB_TUNICHI,4,-3,14,null);
    ctx.fillStyle="rgba(70,40,30,0.75)";ctx.beginPath();ctx.ellipse(0,1,8,3.5,0,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();}
// the young one and what it becomes, in its own frame: its head at (x, y) and pointing at ang (the way it swims, or the rock it has
// settled on); the body lies behind the head. o.swim (0..1) how hard its tail beats; o.m (0..1) its change: the tail goes first, the
// eye spot and the brain's lights go out, and the body grows into the adult, its two openings opening; o.brain (0..1) lights the brain
function bb_squirt(ctx,x,y,s,ang,t,o){o=o||{};const m=clamp(o.m||0,0,1),sw=o.swim==null?1:o.swim;ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  // the tail: a tapering strand that beats side to side, shorter as it's taken apart
  const tl=180*(1-ag_sine(clamp(m*1.7,0,1)));if(tl>2){const P=[];for(let i=0;i<=14;i++){const q=i/14,d=60+tl*q,w=Math.sin(t*11-q*5.2)*q*(10+18*q)*sw;P.push([-d,w]);}
    bb_strand(ctx,P,26,3,rgba(mix(BB_TUNIC,BB_TUNICDK,0.25),0.92),1);ctx.save();ctx.translate(1,-2);ctx.globalAlpha*=0.5;bb_strand(ctx,P,10,1,rgba(BB_TUNICHI,0.8),1);ctx.restore();
    // its fin, a thin pale edge round the tail
    ctx.save();ctx.globalAlpha*=0.35;bb_strand(ctx,P,40,6,rgba(BB_TUNICHI,0.7),1);ctx.restore();}
  // the body: the larva's trunk, an egg, growing into the adult's vase along the same axis
  const rx=lerp(36,82,ag_sine(clamp((m-0.35)/0.65,0,1))),ry=lerp(26,46,ag_sine(clamp((m-0.35)/0.65,0,1))),cx=-rx;
  ag_soft(ctx,c=>c.ellipse(cx,0,rx,ry,0,0,TAU),BB_TUNIC,BB_TUNICHI,cx+rx*0.2,-ry*0.6,rx*1.3,"rgba(80,50,30,0.42)",10,0.65);
  // the two openings, at the far end, as it becomes the adult
  const op=ag_in(m,0.7,0.3);if(op>0)for(const sd of [-1,1]){ctx.save();ctx.translate(cx-rx*0.86,sd*ry*0.5);ctx.rotate(Math.PI+sd*0.45);ctx.scale(op,op);
    ag_soft(ctx,c=>c.ellipse(0,0,8,14,0,0,TAU),mix(BB_TUNIC,[214,140,96],0.4),BB_TUNICHI,2,-6,14,null);ctx.fillStyle="rgba(70,40,30,0.75)";ctx.beginPath();ctx.ellipse(0,0,3.5,8,0,0,TAU);ctx.fill();ctx.restore();}
  // the head's three small sticky points, at the front
  const pa=1-ag_in(m,0.4,0.4);if(pa>0){ctx.fillStyle=rgba(mix(BB_TUNIC,BB_TUNICDK,0.5),pa);for(const [px,py] of [[2,-10],[4,0],[2,10]]){ctx.beginPath();ctx.arc(px,py,4,0,TAU);ctx.fill();}}
  // inside: the brain, a few lights, and the eye spot, a dark dot
  const ea=1-ag_in(m,0.15,0.4);if(ea>0){ctx.fillStyle=rgba([40,28,24],0.85*ea);ctx.beginPath();ctx.arc(-30,-7,5.5,0,TAU);ctx.fill();ctx.fillStyle=rgba([60,44,36],0.6*ea);ctx.beginPath();ctx.arc(-40,4,3.5,0,TAU);ctx.fill();}
  const ba=(o.brain||0)*(1-ag_in(m,0.1,0.5));if(ba>0){const R=ag_rnd(180);for(let i=0;i<9;i++){const px=-22-R()*28,py=(R()-0.5)*22,fl=0.6+0.4*Math.sin(t*3+i*1.7);bb_spark(ctx,px,py,7,ba*fl);}}
  ctx.restore();}

/* ---------------------------------------------------------------- fish */
// a fish, facing ang, s its size (1: about 130 px long); o.big the darker one that hunts; t beats its tail
function bb_fish(ctx,x,y,s,ang,t,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(ang);if(Math.cos(ang)<0){ctx.scale(1,-1);}ctx.scale(s,s);
  const col=o.big?[70,84,92]:[214,170,96],hi=o.big?[140,156,160]:[250,226,160],dk=mix(col,[20,20,30],0.45),wag=Math.sin(t*(o.big?4:9))*0.28;
  // the tail fin
  ctx.save();ctx.translate(-56,0);ctx.rotate(wag);ag_soft(ctx,c=>{c.moveTo(4,0);c.bezierCurveTo(-14,-10,-28,-28,-40,-30);c.bezierCurveTo(-30,-10,-30,10,-40,30);c.bezierCurveTo(-28,28,-14,10,4,0);c.closePath();},mix(col,dk,0.25),hi,-20,-16,30,null);ctx.restore();
  // the body: a long teardrop, lighter on top
  ag_soft(ctx,c=>{c.moveTo(70,0);c.bezierCurveTo(60,-30,0,-34,-36,-16);c.bezierCurveTo(-56,-8,-60,8,-36,16);c.bezierCurveTo(0,34,60,30,70,0);c.closePath();},col,hi,30,-24,70,"rgba(20,20,30,0.4)",8,0.6);
  // a fin on its back, one on its side, and its eye
  ctx.fillStyle=rgba(mix(col,dk,0.3),0.85);ctx.beginPath();ctx.moveTo(20,-28);ctx.quadraticCurveTo(0,-50,-16,-26);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(18,8);ctx.quadraticCurveTo(4,26,-6,12);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(250,248,240,0.9)";ctx.beginPath();ctx.arc(46,-6,7,0,TAU);ctx.fill();ctx.fillStyle="rgba(20,18,20,0.95)";ctx.beginPath();ctx.arc(48,-6,4,0,TAU);ctx.fill();
  ctx.restore();}
// drifting food: a few pale specks that bob in the water
const BB_SPECKS=[[640,330],[700,300],[760,360],[1460,280],[540,520]];
function bb_specks(ctx,t,eaten,a){if(a<=0)return;BB_SPECKS.forEach(([x,y],i)=>{const e=eaten?eaten(i):0;if(e>=1)return;const px=x+Math.sin(t*0.5+i)*14,py=y+Math.sin(t*0.7+i*2)*10;
  ctx.fillStyle=rgba([244,236,206],(0.8-0.8*e)*a);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();ctx.fillStyle=rgba([244,236,206],(0.3-0.3*e)*a);ctx.beginPath();ctx.arc(px,py,10,0,TAU);ctx.fill();});}
const bb_speckAt=(i,t)=>{const [x,y]=BB_SPECKS[i];return[x+Math.sin(t*0.5+i)*14,y+Math.sin(t*0.7+i*2)*10];};

/* ---------------------------------------------------------------- the dragonfly and the midge */
// a dragonfly from above and a little to the side, facing ang: big eyes, a thorax, a long thin abdomen in segments, four long wings,
// a blur while it flies (o.fly); s its size (1: about 300 px from head to tail)
function bb_dragonfly(ctx,x,y,s,ang,t,o){o=o||{};const fly=o.fly==null?1:o.fly;ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  const body=[54,96,120],hi=[150,196,210],dk=[20,40,54];
  // wings: two pairs, pale and veined; flying, they beat and blur
  for(const [ox,len,wd,base] of [[18,150,30,1.32],[-4,140,34,1.72]])for(const sd of [-1,1]){const beat=Math.sin(t*60+(ox>0?0:1.2))*0.32*fly;ctx.save();ctx.translate(ox,0);ctx.rotate(sd*(base+beat));
    ctx.globalAlpha*=lerp(0.62,0.4,fly);ctx.fillStyle="rgba(232,240,244,0.85)";ctx.beginPath();ctx.ellipse(len/2,0,len/2,wd/2,0,0,TAU);ctx.fill();
    ctx.strokeStyle="rgba(70,80,86,0.55)";ctx.lineWidth=1.4;ctx.stroke();ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(len*0.95,-2);ctx.moveTo(len*0.2,wd*0.25);ctx.lineTo(len*0.8,wd*0.15);ctx.stroke();
    ctx.fillStyle="rgba(60,50,40,0.7)";ctx.beginPath();ctx.ellipse(len*0.86,-wd*0.18,7,3,0,0,TAU);ctx.fill();ctx.restore();}
  // the abdomen: a long tapering strand, banded
  const P=bb_smooth([[-14,0],[-80,2],[-150,-3+Math.sin(t*2)*2],[-210,0]],5);bb_strand(ctx,P,20,8,rgba(body,1),1);
  ctx.save();ctx.translate(1,-3);ctx.globalAlpha*=0.5;bb_strand(ctx,P,8,3,rgba(hi,0.8),1);ctx.restore();
  for(let k=1;k<9;k++){const q=bb_along(P,k/9),w=lerp(10,4,k/9);ctx.strokeStyle=rgba(dk,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(q[0]-Math.sin(q[2])*w,q[1]+Math.cos(q[2])*w);ctx.lineTo(q[0]+Math.sin(q[2])*w,q[1]-Math.cos(q[2])*w);ctx.stroke();}
  // the thorax and the head, with its two big eyes
  ag_soft(ctx,c=>c.ellipse(4,0,26,18,0,0,TAU),body,hi,14,-10,30,"rgba(10,20,30,0.45)",6,0.6);
  for(const sd of [-1,1])ag_soft(ctx,c=>c.ellipse(36,sd*10,13,12,0,0,TAU),[70,120,90],[180,220,190],40,sd*10-6,14,"rgba(10,20,20,0.4)",4,0.7);
  ctx.restore();}
function bb_midge(ctx,x,y,s,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgba(232,236,240,0.6)";for(const sd of [-1,1]){ctx.save();ctx.rotate(sd*(0.9+Math.sin(t*70)*0.4));ctx.beginPath();ctx.ellipse(10,0,10,4,0,0,TAU);ctx.fill();ctx.restore();}
  ctx.fillStyle="rgba(40,36,34,0.95)";ctx.beginPath();ctx.ellipse(0,0,7,4,0.2,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(7,-1,3.2,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- an escalator, in ink */
// from the side, rising left to right, on Cajal's paper: its steps, the handrail, and a shoe stepping on at the bottom; o.run (0..1)
// how much the steps are moving (their ink arrows run), o.step (0..1) the shoe coming down, o.trip (0..1) its stumble, o.u draws it on
const BB_ESC={x0:560,y0:760,x1:1260,y1:330};
function bb_escalator(ctx,t,o){o=o||{};const u=o.u==null?1:o.u,a=o.a==null?1:o.a;if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;const E=BB_ESC,dx=E.x1-E.x0,dy=E.y1-E.y0;
  // the truss and the handrail
  bb_ink(ctx,[[E.x0-120,E.y0+50],[E.x0,E.y0+50],[E.x1,E.y1+50],[E.x1+140,E.y1+50]],u,5,0.9);
  bb_ink(ctx,bb_smooth([[E.x0-110,E.y0-90],[E.x0+20,E.y0-120],[E.x1+20,E.y1-120],[E.x1+130,E.y1-150]],5),u,4,0.75);
  bb_ink(ctx,[[E.x0-120,E.y0+50],[E.x0-120,E.y0+110],[E.x1+140,E.y1+110],[E.x1+140,E.y1+50]],u,3,0.4);
  // the steps: a zigzag along the slope, which slides when the escalator moves
  const n=10,ph=((o.ph||0)%1+1)%1;ctx.strokeStyle=rgba(BB.ink,0.9);ctx.lineWidth=3.4;ctx.lineJoin="round";ctx.beginPath();
  for(let i=-1;i<=n;i++){const k=(i+ph)/n;if(k<0||k>1||k>u)continue;const x=E.x0+dx*k,y=E.y0+dy*k,sx=dx/n,sy=dy/n;ctx.moveTo(x,y);ctx.lineTo(x,y+sy);ctx.lineTo(x+sx,y+sy);}ctx.stroke();
  // ink arrows up the slope while it moves
  const ra=o.run||0;if(ra>0)for(let i=0;i<3;i++){const k=((t*0.35+i/3)%1),x=E.x0+dx*(0.15+0.7*k),y=E.y0+dy*(0.15+0.7*k)-70,ang=Math.atan2(dy,dx);ctx.save();ctx.globalAlpha*=ra*Math.sin(Math.PI*k);
    bb_ink(ctx,[[x-34*Math.cos(ang),y-34*Math.sin(ang)],[x+34*Math.cos(ang),y+34*Math.sin(ang)]],1,4,0.8);ag_arrowHead(ctx,x+40*Math.cos(ang),y+40*Math.sin(ang),ang,12,rgba(BB.ink,0.8));ctx.restore();}
  // the shoe: in from the left, down onto the first step, then pitched forward as the step doesn't move
  const st=o.step||0;if(st>0){const tr=o.trip||0,sx=lerp(E.x0-260,E.x0+40,ag_sine(st))+tr*26,sy=lerp(E.y0-150,E.y0-8,ag_sine(st))-Math.sin(Math.PI*st)*30-tr*10;
    ctx.save();ctx.translate(sx,sy);ctx.rotate(-0.1+0.42*Math.sin(Math.PI*Math.min(1,tr*1.4))*(tr<1?1:0.5));ctx.fillStyle=rgba(BB.ink,0.9);ctx.beginPath();ctx.moveTo(-60,0);ctx.bezierCurveTo(-64,-34,-40,-44,-20,-40);
    ctx.lineTo(-16,-84);ctx.lineTo(10,-84);ctx.lineTo(14,-34);ctx.bezierCurveTo(40,-30,74,-20,78,0);ctx.closePath();ctx.fill();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- Schultz's cell, in ink */
// one row of the record, drawn on to u: a baseline of ticks, the times it fires, at width w from x; kind 0 juice with no light, 1 the
// light then juice, 2 the light and no juice. The light is drawn above at BB_RAS.l, the juice at BB_RAS.j; returns the row's height
const BB_RAS={x:560,w:940,l:0.34,j:0.7};
function bb_rasterTicks(kind){const R=ag_rnd(1997+kind),out=[];for(let i=0;i<46;i++){const x=R();out.push(x);}
  const burst=c=>{for(let i=0;i<12;i++)out.push(c+0.004+R()*0.05);};
  if(kind===0)burst(BB_RAS.j);if(kind>0)burst(BB_RAS.l);
  // silence just when the juice was due: no ticks there
  return out.filter(x=>!(kind===2&&x>BB_RAS.j-0.01&&x<BB_RAS.j+0.09)).sort((a,b)=>a-b);}
const BB_TICKS=[0,1,2].map(bb_rasterTicks);
function bb_lamp(ctx,x,y,on,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(on>0){const g=ctx.createRadialGradient(x,y,0,x,y,34);g.addColorStop(0,rgba(BB.gold,0.7*on));g.addColorStop(1,rgba(BB.gold,0));ctx.fillStyle=g;ctx.fillRect(x-34,y-34,68,68);}
  ctx.strokeStyle=rgba(BB.ink,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,13,0,TAU);ctx.stroke();for(let k=0;k<8;k++){const an=k*Math.PI/4;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*19,y+Math.sin(an)*19);ctx.lineTo(x+Math.cos(an)*26,y+Math.sin(an)*26);ctx.stroke();}ctx.restore();}
function bb_drop(ctx,x,y,a,dash){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.beginPath();ctx.moveTo(x,y-22);ctx.bezierCurveTo(x+6,y-10,x+15,y-2,x+15,y+7);ctx.arc(x,y+7,15,0,Math.PI);ctx.bezierCurveTo(x-15,y-2,x-6,y-10,x,y-22);ctx.closePath();
  if(dash){ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(BB.inkSoft,0.8);ctx.lineWidth=2.6;ctx.stroke();}else{ctx.fillStyle=rgba(BB.goldDk,0.95);ctx.fill();}ctx.restore();}
function bb_raster(ctx,y,kind,u,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const R=BB_RAS,x=R.x,w=R.w;
  ag_T(ctx,label,x-32,y+12,{w:700,size:30,align:"right",col:BB.ink});
  ctx.strokeStyle=rgba(BB.inkSoft,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+30);ctx.lineTo(x+w*u,y+30);ctx.stroke();
  for(const k of BB_TICKS[kind]){if(k>u)break;ctx.strokeStyle=rgba(BB.ink,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+k*w,y-18);ctx.lineTo(x+k*w,y+22);ctx.stroke();}
  // the light, the juice: drawn above the row as the record passes them; juice that doesn't come is a dashed drop
  if(kind>0)bb_lamp(ctx,x+R.l*w,y-56,clamp((u-R.l)/0.05,0,1)*(1-clamp((u-R.l-0.12)/0.1,0,1)),clamp((u-R.l+0.02)/0.04,0,1));
  bb_drop(ctx,x+R.j*w,y-56,clamp((u-R.j+0.02)/0.04,0,1),kind===2);
  // the silence, marked
  if(kind===2){const sa=clamp((u-R.j-0.1)/0.06,0,1)*(o.mark==null?1:o.mark);if(sa>0){ctx.save();ctx.globalAlpha*=sa;ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;ctx.beginPath();
    ctx.moveTo(x+(R.j-0.01)*w,y+40);ctx.lineTo(x+(R.j-0.01)*w,y+50);ctx.lineTo(x+(R.j+0.09)*w,y+50);ctx.lineTo(x+(R.j+0.09)*w,y+40);ctx.stroke();ctx.restore();}}
  ctx.restore();}

/* ---------------------------------------------------------------- a nightly script, Monday's rows, the campuses */
// the plain script: a card, its three steps, each lit in turn; lit[i] (0..1) how lit step i is, ok (0..1) the check's tick
const BB_STEPS=["Load the rows","Check: not empty","Stop"];
function bb_script(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+260,y+240,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,520,480,22,{});ag_T(ctx,"A PLAIN SCRIPT",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"Every night at 2:00",x+28,y+100,{w:700,size:36});
  BB_STEPS.forEach((s,i)=>{const sy=y+194+i*104,l=(o.lit||[])[i]||0;if(i>0){ctx.strokeStyle=rgba(AG.mut,0.5);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+260,sy-78);ctx.lineTo(x+260,sy-30);ctx.stroke();ag_arrowHead(ctx,x+260,sy-28,Math.PI/2,9,rgba(AG.mut,0.6));}
    ag_step(ctx,x+260,sy,s,{on:l>0.5?AG.blue:null});
    if(i===1&&(o.ok||0)>0){ctx.save();ctx.globalAlpha*=o.ok;ag_tick(ctx,x+470,sy,28,rgba(AG.green,1),5);ctx.restore();}});
  ctx.restore();}
// the rows that came: a bar against what was expected (a dashed outline), the number that came, and the gap between them
function bb_rows(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+310,y+150,lerp(0.6,1,clamp(o.k,0,1.2)));
  const w=620,h=o.h||300,bx=x+28,bw=w-56,by=y+150;ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,"MONDAY'S ROWS",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  const fill=bw*0.495*(o.fill==null?1:o.fill),ex=o.exp||0;
  if(ex>0){ctx.save();ctx.globalAlpha*=ex;ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.violet,0.85);ctx.lineWidth=3;rr(ctx,bx,by,bw,46,10);ctx.stroke();ctx.restore();
    ag_T(ctx,"Expected: about 4,100",bx+bw,by-18,{w:700,size:28,align:"right",col:AG.violet,a:ex});}
  ctx.fillStyle=rgba(AG.orange,0.9);rr(ctx,bx,by,Math.max(10,fill),46,10);ctx.fill();
  ag_T(ctx,"2,030 came",bx,by+90,{w:700,size:32,col:AG.orange,a:o.num==null?1:o.num});
  // the gap: an amber bracket from the end of what came to the end of what was expected
  const g=o.gap||0;if(g>0){ctx.save();ctx.globalAlpha*=g;ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=4;ctx.lineCap="round";const x0=bx+fill+8,x1=lerp(x0,bx+bw-4,ag_sine(g));
    ctx.beginPath();ctx.moveTo(x0,by+60);ctx.lineTo(x0,by+70);ctx.lineTo(x1,by+70);ctx.lineTo(x1,by+60);ctx.stroke();ctx.restore();}
  ctx.restore();}
// one campus and its count: a chip, green when it sent its rows, amber when it sent none
function bb_campus(ctx,x,y,name,n,ok,a,k){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+100,y+50,lerp(0.6,1,clamp(k==null?1:k,0,1.2)));
  ag_box(ctx,x,y,200,104,18,{edge:ok?AG.green:AG.amber,edgeA:0.7});ag_T(ctx,name.toUpperCase(),x+22,y+40,{w:700,size:28,ls:3,col:AG.kick});
  ag_T(ctx,n,x+22,y+84,{w:700,size:32,col:ok?AG.ink:AG.amber});if(ok)ag_tick(ctx,x+168,y+70,22,rgba(AG.green,1),4);else ag_warn(ctx,x+168,y+70,28,rgba(AG.amber,1));ctx.restore();}
// a card of two lines, a kicker and two rows of words in mono: what it assumed, and what it found
function bb_assumed(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+340,y+130,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,680,260,22,{edge:o.f>0.5?AG.amber:null,edgeA:0.7});ag_T(ctx,"AN ASSUMPTION FAILS",x+28,y+50,{w:700,size:28,ls:4,col:o.f>0.5?AG.amber:AG.kick});
  ag_T(ctx,"Expected",x+28,y+118,{w:700,size:32,col:AG.mut});ag_T(ctx,"course_id",x+250,y+118,{w:500,size:32,f:"mono",col:AG.ink,a:lerp(1,0.45,o.f||0)});
  if((o.f||0)>0){const k=ag_sine(clamp(o.f*1.5,0,1));ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+246,y+108);ctx.lineTo(x+246+lerp(0,196,k),y+108);ctx.stroke();}
  ag_T(ctx,"Found",x+28,y+196,{w:700,size:32,col:AG.mut,a:o.f||0});ag_T(ctx,"course_code",x+250,y+196,{w:500,size:32,f:"mono",col:AG.orange,a:o.f||0});
  ctx.restore();}
