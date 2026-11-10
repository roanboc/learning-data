/* ===== A platform that watches itself: Apollo 11, drawn in the module's night =====
   The film's own pictures of 20 July 1969 (prefix pw_), drawn in the module's look: the black sky and the grey Moon sit in the map's
   own dark, so the cut to the platform carries the dark across. Nothing here copies a photograph: the lunar module is drawn anew and
   simply, with no flag, insignia or agency mark; Mission Control's people are composites dressed as photographs of the time show
   them (white shirts, thin dark ties, headsets), and no real person's face is drawn. The computer's display and keyboard are drawn as
   they were laid out, its words in capitals at 28 px or more; the only light that comes on is PROG, in amber, a person's turn.
     places    pwSpace (the Moon below, the Earth in the sky), pwPanel (the lunar module's panel round the display and keyboard),
               pwHouston (Mission Control from the back of the room), pwConsole (the guidance console, near)
     pw_lm     the lunar module at (x, y), s its size; o.tilt, o.fire (the engine's glow, 0 to 1)
     pw_lmAt   where the module is at u (0 to 1) along its descent, and its tilt
     pw_dust   the dust it lifts as it lands
     pw_dsky   the display and keyboard's live parts: the PROG light, COMP ACTY, the numbers and the code
     pw_ctrl   the guidance officer, a composite of 1969 (a spec for md_person)
     pw_work   the computer's work in a cycle of its time: bars, the ones that overflow, and the restart that keeps the first two */

/* ---------------------------------------------------------------- the Moon and the sky */
const PW_HORIZON=x=>520+0.000034*(x-960)*(x-960);
function pw_paintSpace(c){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#02040b");g.addColorStop(0.45,"#050916");g.addColorStop(1,"#03050c");c.fillStyle=g;c.fillRect(0,0,W,H);
  // a few faint stars, never a field of them
  const r=ag_rnd(1969);for(let i=0;i<70;i++){const x=r()*W,y=r()*500,b=r();c.fillStyle="rgba(210,224,255,"+(0.12+0.35*b*b)+")";c.beginPath();c.arc(x,y,0.6+1.1*b*b,0,TAU);c.fill();}
  // the Earth, small and high in the black sky: lit from the left, as the Moon is
  const ex=1560,ey=172,er=44;let q=c.createRadialGradient(ex,ey,er*0.6,ex,ey,er*3.2);q.addColorStop(0,"rgba(120,190,255,0.16)");q.addColorStop(1,"rgba(120,190,255,0)");c.fillStyle=q;c.fillRect(ex-er*3.4,ey-er*3.4,er*6.8,er*6.8);
  c.save();c.beginPath();c.arc(ex,ey,er,0,TAU);c.clip();c.fillStyle="#0a1428";c.fillRect(ex-er,ey-er,er*2,er*2);
  q=c.createRadialGradient(ex-er*0.45,ey-er*0.2,er*0.1,ex-er*0.2,ey,er*1.25);q.addColorStop(0,"#d9ecff");q.addColorStop(0.35,"#6fb2ee");q.addColorStop(0.7,"#24508c");q.addColorStop(1,"rgba(10,20,40,0)");c.fillStyle=q;c.fillRect(ex-er,ey-er,er*2,er*2);
  // its clouds, soft streaks on the lit side
  for(const [dx,dy,rx,ry] of [[-20,-20,16,6],[-28,4,12,7],[-10,14,18,6],[-24,26,10,4],[2,-6,9,5]]){const cq=c.createRadialGradient(ex+dx,ey+dy,0,ex+dx,ey+dy,rx);cq.addColorStop(0,"rgba(245,250,255,0.55)");cq.addColorStop(1,"rgba(245,250,255,0)");
    c.save();c.translate(ex+dx,ey+dy);c.scale(1,ry/rx);c.translate(-ex-dx,-ey-dy);c.fillStyle=cq;c.fillRect(ex+dx-rx,ey+dy-rx,rx*2,rx*2);c.restore();}
  c.globalAlpha=1;q=c.createLinearGradient(ex-er,0,ex+er,0);q.addColorStop(0,"rgba(2,4,11,0)");q.addColorStop(0.62,"rgba(2,4,11,0.15)");q.addColorStop(0.86,"rgba(2,4,11,0.9)");q.addColorStop(1,"rgba(2,4,11,1)");c.fillStyle=q;c.fillRect(ex-er,ey-er,er*2,er*2);c.restore();
  // the Moon's ground, from the horizon to the foot of the frame: light far off, darker near, so the captions sit on dark; the low
  // sun on the left lights that side a little more
  c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=24)c.lineTo(x,PW_HORIZON(x));c.lineTo(W,H);c.closePath();
  q=c.createLinearGradient(0,500,0,H);q.addColorStop(0,"#7a7f8c");q.addColorStop(0.16,"#5b606d");q.addColorStop(0.5,"#353945");q.addColorStop(1,"#14161d");c.fillStyle=q;c.fill();
  c.save();c.clip();q=c.createLinearGradient(0,0,W,0);q.addColorStop(0,"rgba(255,250,240,0.07)");q.addColorStop(0.6,"rgba(0,0,0,0)");q.addColorStop(1,"rgba(0,0,0,0.25)");c.fillStyle=q;c.fillRect(0,500,W,H-500);
  // its soft swells, darker hollows and lighter rises, long and low
  const rc=ag_rnd(711);for(let i=0;i<16;i++){const y=lerp(560,1040,rc()),d=(y-500)/580,x=rc()*W,rx=lerp(160,620,d)*(0.6+0.6*rc()),ry=rx*lerp(0.05,0.12,d);
    q=c.createRadialGradient(x,y,0,x,y,rx);const lite=rc()<0.45;q.addColorStop(0,lite?"rgba(220,226,240,0.06)":"rgba(6,8,14,0.16)");q.addColorStop(1,"rgba(0,0,0,0)");c.save();c.translate(x,y);c.scale(1,ry/rx);c.translate(-x,-y);c.fillStyle=q;c.fillRect(x-rx,y-rx,rx*2,rx*2);c.restore();}
  // craters seen flat: the sun is low on the left, so each one's left inner wall is in shade and its right inner wall lit, and the
  // ground just past its left rim catches the light
  const craters=[];for(let i=0;i<40;i++){const y=lerp(545,1050,Math.pow(rc(),1.5)),d=(y-500)/580,x=rc()*W,rx=lerp(10,120,d)*(0.45+0.8*rc());craters.push([x,y,rx,rx*lerp(0.2,0.32,d)]);}
  craters.sort((a,b)=>a[1]-b[1]);
  for(const [x,y,rx,ry] of craters){c.save();c.translate(x,y);c.scale(1,ry/rx);
    c.beginPath();c.arc(0,0,rx,0,TAU);q=c.createLinearGradient(-rx,0,rx,0);q.addColorStop(0,"rgba(8,10,16,0.62)");q.addColorStop(0.45,"rgba(14,16,24,0.32)");q.addColorStop(0.8,"rgba(150,156,170,0.06)");q.addColorStop(1,"rgba(210,216,228,0.22)");c.fillStyle=q;c.fill();
    q=c.createRadialGradient(-rx*1.02,0,rx*0.7,-rx*1.02,0,rx*1.3);q.addColorStop(0,"rgba(220,226,238,0)");q.addColorStop(0.5,"rgba(220,226,238,0.1)");q.addColorStop(1,"rgba(220,226,238,0)");
    c.save();c.beginPath();c.arc(0,0,rx*1.25,0,TAU);c.arc(0,0,rx,0,TAU,true);c.clip();c.fillStyle=q;c.fillRect(-rx*2.4,-rx*1.4,rx*2.4,rx*2.8);c.restore();
    // its shadow spills a little past the rim on the right, away from the sun
    c.fillStyle="rgba(6,8,14,0.18)";c.beginPath();c.ellipse(rx*0.9,0,rx*0.35,rx*0.9,0,-Math.PI/2,Math.PI/2);c.fill();c.restore();}
  // small stones, each with its long shadow to the right
  for(let i=0;i<110;i++){const y=lerp(560,1070,Math.pow(rc(),1.2)),d=(y-500)/580,x=rc()*W,s=lerp(1,6,d)*(0.5+rc());
    c.fillStyle="rgba(6,8,14,0.5)";c.beginPath();c.ellipse(x+s*2.8,y+s*0.3,s*2.6,s*0.42,0,0,TAU);c.fill();
    q=c.createLinearGradient(x-s,0,x+s,0);q.addColorStop(0,"rgba(200,206,220,0.75)");q.addColorStop(1,"rgba(70,74,86,0.75)");c.fillStyle=q;c.beginPath();c.ellipse(x,y,s,s*0.62,0,0,TAU);c.fill();}
  c.restore();
  // the horizon's soft edge against the black
  c.strokeStyle="rgba(180,190,210,0.28)";c.lineWidth=2;c.beginPath();for(let x=0;x<=W;x+=24){const y=PW_HORIZON(x);x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  const v=c.createRadialGradient(W/2,H/2,H*0.35,W/2,H/2,W*0.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.pwSpace=pw_paintSpace;

/* ---------------------------------------------------------------- the lunar module
   Drawn once into a picture of its own, 600 x 560, its middle at the top of the descent stage, and laid on the frame turned and
   sized; the engine's glow and its shadow are drawn live. Light falls from the left, as the Moon's sun does, and a cool rim of the
   map's light runs down its right edge. */
const PW_LM={w:600,h:560,ox:300,oy:300,res:2.4};
function pw_paintLM(c){const ox=PW_LM.ox,oy=PW_LM.oy;c.scale(PW_LM.res,PW_LM.res);c.translate(ox,oy);c.lineJoin="round";c.lineCap="round";
  const foil=[166,124,58],foilD=[86,62,28],foilL=[232,196,128],dark=[34,38,48];
  const strut=(a,b,w,col,hi)=>{c.strokeStyle=rgba(col,1);c.lineWidth=w;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();if(hi){c.strokeStyle=rgba(hi,0.6);c.lineWidth=w*0.3;c.beginPath();c.moveTo(a[0]-w*0.25,a[1]);c.lineTo(b[0]-w*0.25,b[1]);c.stroke();}};
  const pad=(x,y,r)=>{let g=c.createLinearGradient(x-r,0,x+r,0);g.addColorStop(0,"#c4c8d2");g.addColorStop(1,"#5c6270");c.fillStyle=g;c.beginPath();c.ellipse(x,y,r,r*0.3,0,0,TAU);c.fill();
    c.fillStyle="rgba(30,34,44,0.6)";c.beginPath();c.ellipse(x,y+r*0.12,r*0.9,r*0.16,0,0,Math.PI);c.fill();};
  // the two side legs, behind the stage: a long strut out and down, a shorter one under it, a round footpad
  for(const s of [-1,1]){const sh=s>0?mix(foilD,dark,0.35):foilD;strut([s*84,22],[s*156,168],10,sh,s<0?foilL:null);strut([s*64,64],[s*140,136],6,mix(sh,dark,0.2));strut([s*104,40],[s*150,150],4,mix(sh,dark,0.3));pad(s*158,174,30);}
  // the descent stage: three faces of its octagon, wrapped in foil, lit from the left
  const face=(pts,c0,c1)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();const g=c.createLinearGradient(pts[0][0],0,pts[2][0],0);g.addColorStop(0,rgba(c0,1));g.addColorStop(1,rgba(c1,1));c.fillStyle=g;c.fill();};
  const oct=[[-112,6],[-72,-2],[72,-2],[112,6],[112,66],[72,76],[-72,76],[-112,66]];
  face([[-112,6],[-72,-2],[-72,76],[-112,66]],foilL,mix(foil,foilL,0.4));face([[-72,-2],[72,-2],[72,76],[-72,76]],mix(foil,foilL,0.3),foil);face([[72,-2],[112,6],[112,66],[72,76]],foilD,mix(foilD,dark,0.4));
  c.save();c.beginPath();oct.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();
  // the foil's sheen: broad soft bands of light down each face, and a few creases catching it
  for(const [x,w,al] of [[-96,26,0.28],[-44,40,0.2],[8,22,0.12],[54,18,0.08],[94,12,0.06]]){const g2=c.createLinearGradient(x-w,0,x+w,0);g2.addColorStop(0,"rgba(255,240,200,0)");g2.addColorStop(0.5,"rgba(255,240,200,"+al+")");g2.addColorStop(1,"rgba(255,240,200,0)");c.fillStyle=g2;c.fillRect(x-w,-4,w*2,84);}
  const r=ag_rnd(11);for(let i=0;i<26;i++){const x=-108+r()*216,y=4+r()*68,l=5+r()*12,a=r()*1.4-0.7;c.strokeStyle=r()<0.6?"rgba(255,236,190,"+(0.12+0.18*r())+")":"rgba(40,26,8,"+(0.12+0.16*r())+")";c.lineWidth=0.8+r();
    c.beginPath();c.moveTo(x,y);c.lineTo(x+l,y+a*6);c.stroke();}
  // the stage's top and bottom edges, and the quadrant bays
  c.fillStyle="rgba(20,16,10,0.35)";c.fillRect(-114,66,228,12);c.fillStyle="rgba(255,240,210,0.18)";c.fillRect(-114,-2,228,6);
  c.strokeStyle="rgba(40,28,12,0.35)";c.lineWidth=1.4;for(const x of [-36,36]){c.beginPath();c.moveTo(x,0);c.lineTo(x,76);c.stroke();}c.restore();
  c.strokeStyle="rgba(30,22,10,0.55)";c.lineWidth=1.6;c.beginPath();oct.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();
  // the engine's bell under it
  let g=c.createLinearGradient(-30,0,30,0);g.addColorStop(0,"#4a505c");g.addColorStop(1,"#1a1d24");c.fillStyle=g;c.beginPath();c.moveTo(-18,76);c.lineTo(18,76);c.lineTo(30,106);c.lineTo(-30,106);c.closePath();c.fill();
  // the front leg, nearer us, with its ladder
  strut([0,74],[0,180],10,mix(foil,foilD,0.3),foilL);c.strokeStyle=rgba(mix(foilL,foil,0.3),0.85);c.lineWidth=2.2;for(let y=94;y<172;y+=13){c.beginPath();c.moveTo(-13,y);c.lineTo(13,y);c.stroke();}
  c.strokeStyle=rgba(mix(foil,foilD,0.2),1);c.lineWidth=3;c.beginPath();c.moveTo(-13,84);c.lineTo(-13,176);c.moveTo(13,84);c.lineTo(13,176);c.stroke();pad(0,190,32);
  // the ascent stage, where the crew stand: a faceted cabin, pale on the sunlit side, its skin in dark panels
  const asc=[[-80,-2],[-92,-50],[-74,-96],[-30,-120],[30,-122],[70,-100],[94,-58],[82,-2]];
  c.beginPath();asc.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();g=c.createLinearGradient(-92,0,94,0);g.addColorStop(0,"#d6dae2");g.addColorStop(0.5,"#9aa1ae");g.addColorStop(1,"#4c5361");c.fillStyle=g;c.fill();
  // its facets: the front face in black panels, the sides in pale ones, a seam round its middle
  const poly2=(pts,fill)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=fill;c.fill();};
  poly2([[-46,-2],[-50,-74],[-18,-104],[24,-104],[54,-76],[52,-2]],"rgba(30,34,44,0.92)");
  poly2([[-92,-50],[-50,-74],[-46,-2],[-80,-2]],"rgba(232,236,242,0.35)");poly2([[94,-58],[54,-76],[52,-2],[82,-2]],"rgba(10,12,18,0.35)");
  c.strokeStyle="rgba(150,160,180,0.35)";c.lineWidth=1.2;for(const [a,b] of [[[-50,-74],[-18,-104]],[[24,-104],[54,-76]],[[-46,-40],[52,-40]],[[-18,-104],[-30,-120]],[[24,-104],[30,-122]]]){c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  // the two windows, small, canted inward and set high in the black front, catching a sliver of light
  for(const s of [-1,1]){c.save();c.translate(s*20,-86);c.rotate(s*0.35);c.beginPath();c.moveTo(-12,-8);c.lineTo(12,-8);c.lineTo(s<0?10:-10,8);c.closePath();c.fillStyle="#060912";c.fill();
    c.strokeStyle="rgba(140,170,210,0.4)";c.lineWidth=1.2;c.stroke();c.fillStyle="rgba(150,190,255,0.22)";c.fillRect(-9,-6,6,2);c.restore();}
  // the hatch, low in the front face, no brighter than the panels round it
  c.fillStyle="rgba(46,52,64,0.95)";rr(c,-15,-50,30,30,3);c.fill();c.strokeStyle="rgba(120,130,150,0.35)";c.lineWidth=1;rr(c,-15,-50,30,30,3);c.stroke();
  // the thrusters at its corners: small crosses of nozzles
  for(const [x,y] of [[-96,-68],[98,-74]]){c.fillStyle="#2a2e38";rr(c,x-8,y-8,16,16,3);c.fill();c.fillStyle="#8a92a2";for(const [dx,dy] of [[0,-13],[0,13],[-13,0],[13,0]]){rr(c,x+dx-3.5,y+dy-3.5,7,7,1.5);c.fill();}}
  // the docking tunnel on top, the radar's dish at the front, and the steerable antenna on its boom at the right
  c.fillStyle="#7c8494";rr(c,-20,-136,40,18,4);c.fill();c.fillStyle="#b8bec8";rr(c,-20,-136,14,18,4);c.fill();
  c.fillStyle="#cfd4dc";c.beginPath();c.ellipse(-56,-112,12,8,-0.4,0,TAU);c.fill();c.fillStyle="#6c7484";c.beginPath();c.ellipse(-54,-110,7,4,-0.4,0,TAU);c.fill();
  c.strokeStyle="#8c94a4";c.lineWidth=3;c.beginPath();c.moveTo(62,-104);c.lineTo(94,-140);c.stroke();
  c.save();c.translate(100,-146);c.rotate(-0.7);g=c.createLinearGradient(-20,0,20,0);g.addColorStop(0,"#e2e6ee");g.addColorStop(1,"#7c8494");c.fillStyle=g;c.beginPath();c.ellipse(0,0,20,7,0,0,TAU);c.fill();c.restore();
  // the cool rim of the night along its right edge, and its sunlit left edge
  c.strokeStyle="rgba(120,200,255,0.5)";c.lineWidth=2.2;c.beginPath();c.moveTo(94,-58);c.lineTo(82,-2);c.moveTo(112,8);c.lineTo(112,64);c.moveTo(30,-122);c.lineTo(70,-100);c.stroke();
  c.strokeStyle="rgba(255,248,236,0.5)";c.lineWidth=2;c.beginPath();c.moveTo(-92,-50);c.lineTo(-74,-96);c.lineTo(-30,-120);c.moveTo(-112,8);c.lineTo(-112,64);c.stroke();}
function pw_lm(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const img=ag_kept("pwLM",PW_LM.w*PW_LM.res,PW_LM.h*PW_LM.res,pw_paintLM);ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.tilt||0);ctx.scale(s,s);
  // the engine's glow: soft, warm, under the bell (in a vacuum the flame barely shows: a glow is enough)
  const f=o.fire==null?0:o.fire;if(f>0){const fl=0.85+0.15*Math.sin((o.t||0)*31)*Math.sin((o.t||0)*17);glow(ctx,0,128,70*f*fl,[255,190,120],0.55*f);glow(ctx,0,118,30*f,[255,236,200],0.8*f);}
  ctx.drawImage(img,-PW_LM.ox,-PW_LM.oy,PW_LM.w,PW_LM.h);ctx.restore();}
// the descent: a long curve from high on the left down to the landing place, the module turning upright as it comes down
// it comes nearer as it comes down, so it grows a little (s)
const PW_PATH=bez(P(430,250),P(900,236),P(1130,400),P(1180,604),120),PW_PM=mk(PW_PATH);
function pw_lmAt(u){u=clamp(u,0,1);const q=at(PW_PM,u);return{x:q.x,y:q.y,s:lerp(0.62,1,ag_sine(u)),tilt:lerp(-0.55,0,ag_sine(Math.min(1,u/0.72)))};}
// the dust it lifts at touchdown, blown out flat and low, then settling
function pw_dust(ctx,x,y,t,t0){const u=t-t0;if(u<-1.4||u>6)return;const r=ag_rnd(5);
  for(let i=0;i<26;i++){const side=i%2?1:-1,sp=0.6+r(),d=Math.max(0,u+1.2)*sp,life=clamp(1-(u+1.2)/(4+2*r()),0,1);if(life<=0)continue;
    const px=x+side*(30+d*(70+60*r())),py=y-6-Math.min(d,1.2)*(10+16*r())+Math.max(0,d-1.2)*6,rad=14+d*(18+14*r());
    ctx.fillStyle="rgba(150,154,166,"+(0.12*life*Math.min(1,(u+1.4)*1.2))+")";ctx.beginPath();ctx.ellipse(px,py,rad*1.6,rad*0.55,0,0,TAU);ctx.fill();}}

/* ---------------------------------------------------------------- the display and keyboard (DSKY), on the module's panel
   The panel is painted once with the display and keyboard's case, its unlit lights and its keys; pw_dsky draws what lights up:
   COMP ACTY when the computer works, the numbers, the code 1202 in the first register, and the PROG light, amber. */
const PW_DK={x:290,y:96,w:980,h:760,lx:326,ly:132,lw:404,dx:772,dy:132,dw:462,dh:404,ky:564};
const PW_LIGHTS=[["UPLINK ACTY","TEMP"],["NO ATT","GIMBAL LOCK"],["STBY","PROG"],["KEY REL","RESTART"],["OPR ERR","TRACKER"],["","ALT"],["","VEL"]];
function pw_paintPanel(c){const D=PW_DK;let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#1a1e27");g.addColorStop(1,"#0c0e14");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the panel's grey metal round it, with a few switches and screws
  c.fillStyle="#232833";c.fillRect(0,0,W,H);const r=ag_rnd(4);c.strokeStyle="rgba(255,255,255,0.04)";for(let i=0;i<220;i++){const y=r()*H;c.beginPath();c.moveTo(0,y);c.lineTo(W,y+r()*4-2);c.stroke();}
  for(const [x,y] of [[140,180],[140,420],[140,660],[1680,180],[1680,700]]){c.fillStyle="#141821";rr(c,x-90,y-70,180,140,12);c.fill();c.strokeStyle="rgba(200,210,230,0.12)";c.lineWidth=1.5;rr(c,x-90,y-70,180,140,12);c.stroke();
    for(const dx of [-40,0,40]){c.fillStyle="#3a404c";c.beginPath();c.arc(x+dx,y,13,0,TAU);c.fill();c.strokeStyle="#9aa2b4";c.lineWidth=4;c.lineCap="round";c.beginPath();c.moveTo(x+dx,y);c.lineTo(x+dx+3,y-26);c.stroke();}}
  // the case of the display and keyboard
  c.save();c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=40;c.shadowOffsetY=10;c.fillStyle="#2c313c";rr(c,D.x,D.y,D.w,D.h,18);c.fill();c.restore();
  g=c.createLinearGradient(0,D.y,0,D.y+D.h);g.addColorStop(0,"#3a404c");g.addColorStop(1,"#262a33");c.fillStyle=g;rr(c,D.x,D.y,D.w,D.h,18);c.fill();c.strokeStyle="rgba(220,228,240,0.18)";c.lineWidth=2;rr(c,D.x,D.y,D.w,D.h,18);c.stroke();
  for(const [x,y] of [[D.x+18,D.y+18],[D.x+D.w-18,D.y+18],[D.x+18,D.y+D.h-18],[D.x+D.w-18,D.y+D.h-18]]){c.fillStyle="#7a8292";c.beginPath();c.arc(x,y,5,0,TAU);c.fill();}
  // the caution lights, unlit: pale glass with its word in grey
  PW_LIGHTS.forEach((row,i)=>row.forEach((s,j)=>{const x=D.lx+j*210,y=D.ly+i*58;c.fillStyle=s?"#c9ccd2":"#4a505c";rr(c,x,y,196,50,6);c.fill();c.strokeStyle="rgba(0,0,0,0.5)";c.lineWidth=1.5;rr(c,x,y,196,50,6);c.stroke();}));
  // the display's black window
  c.fillStyle="#07090c";rr(c,D.dx,D.dy,D.dw,D.dh,8);c.fill();c.strokeStyle="rgba(0,0,0,0.8)";c.lineWidth=3;rr(c,D.dx,D.dy,D.dw,D.dh,8);c.stroke();
  // the keys
  for(const k of PW_KEYS){const [x,y,w,h]=pw_keyBox(k);g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#5a606c");g.addColorStop(1,"#3a3f49");c.fillStyle=g;rr(c,x,y,w,h,8);c.fill();
    c.strokeStyle="rgba(0,0,0,0.6)";c.lineWidth=2;rr(c,x,y,w,h,8);c.stroke();c.strokeStyle="rgba(255,255,255,0.12)";c.lineWidth=1;c.beginPath();c.moveTo(x+8,y+2);c.lineTo(x+w-8,y+2);c.stroke();}
  const v=c.createRadialGradient(W/2,H/2,H*0.4,W/2,H/2,W*0.7);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.55)");c.fillStyle=v;c.fillRect(0,0,W,H);}
// the keyboard as it was laid out: VERB and NOUN on the left, then + - 0, the numbers, CLR PRO KEY REL, and ENTR and RSET on the right
const PW_KEYS=[["VERB",0,0,1.5],["NOUN",0,1.5,1.5],["+",1,0,1],["−",1,1,1],["0",1,2,1],["7",2,0,1],["4",2,1,1],["1",2,2,1],["8",3,0,1],["5",3,1,1],["2",3,2,1],
  ["9",4,0,1],["6",4,1,1],["3",4,2,1],["CLR",5,0,1],["PRO",5,1,1],["KEY REL",5,2,1],["ENTR",6,0,1.5],["RSET",6,1.5,1.5]];
function pw_keyBox(k){const D=PW_DK,kw=118,kh=80,gx=14,gy=12,x0=D.x+(D.w-(7*kw+6*gx))/2;return[x0+k[1]*(kw+gx),D.ky+k[2]*(kh+gy),kw,k[3]*kh+(k[3]-1)*gy];}
AG_PLACES.pwPanel=pw_paintPanel;
// a digit of the display, in seven green segments; ch is "0" to "9", "+", or " " (unlit)
const PW_SEG={"0":"abcdef","1":"bc","2":"abged","3":"abgcd","4":"fgbc","5":"afgcd","6":"afgedc","7":"abc","8":"abcdefg","9":"abcdfg"," ":""};
function pw_digit(ctx,ch,x,y,h,col,a){const w=h*0.56,t=h*0.13,on=PW_SEG[ch]||"",seg={a:[0,0,1,0],b:[1,0,1,0.5],c:[1,0.5,1,1],d:[0,1,1,1],e:[0,0.5,0,1],f:[0,0,0,0.5],g:[0,0.5,1,0.5]};
  ctx.save();ctx.lineCap="round";ctx.lineWidth=t;for(const [k,s] of Object.entries(seg)){const lit=on.includes(k);ctx.strokeStyle=lit?rgba(col,a):"rgba(60,90,70,0.16)";ctx.beginPath();
    const sk=0.08*h;ctx.moveTo(x+s[0]*w+t*0.6*(s[0]===s[2]?0:1)-sk*s[1],y+s[1]*h+t*0.6*(s[1]===s[3]?0:1));ctx.lineTo(x+s[2]*w-t*0.6*(s[0]===s[2]?0:1)-sk*s[3],y+s[3]*h-t*0.6*(s[1]===s[3]?0:1));ctx.stroke();}
  ctx.restore();}
function pw_digits(ctx,s,x,y,h,col,a){for(let i=0;i<s.length;i++)pw_digit(ctx,s[i],x+i*h*0.78,y,h,col,a);}
// a register's sign: its own light, a plus or a minus, and nothing when blank (no unlit segments)
function pw_sign(ctx,ch,x,y,h,col,a){if(ch!=="+"&&ch!=="-")return;const w=h*0.56;ctx.save();ctx.lineCap="round";ctx.lineWidth=h*0.13;ctx.strokeStyle=rgba(col,a);ctx.beginPath();
  ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2);if(ch==="+"){ctx.moveTo(x+w/2,y+h*0.25);ctx.lineTo(x+w/2,y+h*0.75);}ctx.stroke();ctx.restore();}
function pw_reg(ctx,s,x,y,h,col,a){s=(s||"").padStart(6," ").slice(0,6);pw_sign(ctx,s[0],x,y,h,col,a);pw_digits(ctx,s.slice(1),x+h*0.78,y,h,col,a);}
// o.prog: the PROG light, 0 to 1; o.comp: COMP ACTY; o.r: the three registers (strings of a sign and five digits, " " unlit);
// o.verb, o.noun, o.prg: two digits each; o.code: 0 to 1, the code 1202 in the first register, glowing
function pw_dsky(ctx,t,o){o=o||{};const D=PW_DK,G=[150,255,170];
  // the words on the caution lights, lit or not
  PW_LIGHTS.forEach((row,i)=>row.forEach((s,j)=>{if(!s)return;const x=D.lx+j*210,y=D.ly+i*58,lit=s==="PROG"?(o.prog||0):0;
    if(lit>0){withA(ctx,lit,()=>{glow(ctx,x+98,y+25,130,MD.wait,0.55);ctx.fillStyle=rgba(mix(MD.wait,[255,236,190],0.25),1);rr(ctx,x,y,196,50,6);ctx.fill();});}
    md_T(ctx,s,x+98,y+35,{w:700,size:28,align:"center",col:lit>0.5?MD.navy:[70,74,84]});}));
  // the display: COMP ACTY, PROG, VERB and NOUN on green plates, and three registers
  const plate=(x,y,w,txt,on)=>{ctx.fillStyle=on?"rgba(110,230,140,0.95)":"rgba(70,140,90,0.35)";rr(ctx,x,y,w,40,4);ctx.fill();md_T(ctx,txt,x+w/2,y+31,{w:800,size:28,align:"center",col:MD.navy});};
  const comp=o.comp||0;ctx.fillStyle=comp>0.5?"rgba(110,230,140,0.95)":"rgba(70,140,90,0.3)";rr(ctx,D.dx+18,D.dy+18,124,92,6);ctx.fill();
  md_T(ctx,"COMP",D.dx+80,D.dy+58,{w:800,size:28,align:"center",col:MD.navy});md_T(ctx,"ACTY",D.dx+80,D.dy+94,{w:800,size:28,align:"center",col:MD.navy});
  plate(D.dx+300,D.dy+18,140,"PROG",true);pw_digits(ctx,o.prg||"63",D.dx+318,D.dy+68,46,G,1);
  plate(D.dx+18,D.dy+128,140,"VERB",true);plate(D.dx+300,D.dy+128,140,"NOUN",true);pw_digits(ctx,o.verb||"06",D.dx+36,D.dy+178,46,G,1);pw_digits(ctx,o.noun||"63",D.dx+318,D.dy+178,46,G,1);
  const R=o.r||["+02350","-00740","+33500"],rx=D.dx+D.dw-30-6*0.78*50;
  for(let i=0;i<3;i++){const y=D.dy+232+i*56;ctx.strokeStyle="rgba(110,230,140,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(D.dx+18,y-6);ctx.lineTo(D.dx+D.dw-18,y-6);ctx.stroke();
    pw_reg(ctx,R[i],rx,y+2,46,G,1-(o.code||0));}
  // the code: verb 05, noun 09 shows the alarm codes, the first in the first register, a second in the next (none yet), the last in
  // the third; in octal, so 1202 shows as 01202
  if(o.code>0){withA(ctx,o.code,()=>{glow(ctx,rx+150,D.dy+258,150,G,0.3);[" 01202"," 00000"," 01202"].forEach((s,i)=>pw_reg(ctx,s,rx,D.dy+234+i*56,46,G,1));});}
  // the keys' words
  for(const k of PW_KEYS){const [x,y,w,h]=pw_keyBox(k),two=k[0]==="KEY REL";if(two){md_T(ctx,"KEY",x+w/2,y+h/2-4,{w:800,size:28,align:"center",col:[226,230,238]});md_T(ctx,"REL",x+w/2,y+h/2+26,{w:800,size:28,align:"center",col:[226,230,238]});}
    else md_T(ctx,k[0],x+w/2,y+h/2+11,{w:800,size:k[0].length>2?28:34,align:"center",col:[226,230,238]});}}

/* ---------------------------------------------------------------- Mission Control, Houston
   From the back of the room: the big screens on the front wall, and tiers of consoles, each lit by its small screens, with
   controllers seen from behind, as simple shapes against the glow. Nothing on the screens is words: plots and columns of light. */
function pw_back(c,x,y,s,col){c.fillStyle=col;c.beginPath();c.moveTo(x-66*s,y+60*s);c.bezierCurveTo(x-64*s,y+10*s,x-46*s,y-4*s,x-20*s,y-8*s);c.lineTo(x-14*s,y-26*s);
  c.bezierCurveTo(x-34*s,y-34*s,x-36*s,y-86*s,x,y-90*s);c.bezierCurveTo(x+36*s,y-86*s,x+34*s,y-34*s,x+14*s,y-26*s);c.lineTo(x+20*s,y-8*s);c.bezierCurveTo(x+46*s,y-4*s,x+64*s,y+10*s,x+66*s,y+60*s);c.closePath();c.fill();}
function pw_paintHouston(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#070b16");g.addColorStop(1,"#03050a");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the front wall's screens: a plot of the descent in the middle, columns of light either side
  const scr=(x,y,w,h,draw)=>{c.save();c.shadowColor="rgba(90,200,190,0.35)";c.shadowBlur=60;c.fillStyle="#0c2a30";c.fillRect(x,y,w,h);c.restore();
    g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"#123a40");g.addColorStop(1,"#0a2228");c.fillStyle=g;c.fillRect(x,y,w,h);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();draw(x,y,w,h);c.restore();
    c.strokeStyle="rgba(150,220,210,0.25)";c.lineWidth=2;c.strokeRect(x,y,w,h);};
  scr(620,70,680,300,(x,y,w,h)=>{c.strokeStyle="rgba(120,220,200,0.14)";c.lineWidth=1;for(let i=1;i<10;i++){c.beginPath();c.moveTo(x+i*w/10,y);c.lineTo(x+i*w/10,y+h);c.stroke();}for(let i=1;i<6;i++){c.beginPath();c.moveTo(x,y+i*h/6);c.lineTo(x+w,y+i*h/6);c.stroke();}
    c.strokeStyle="rgba(170,255,220,0.75)";c.lineWidth=3;c.beginPath();for(let i=0;i<=60;i++){const u=i/60;c.lineTo(x+40+u*(w-80),y+40+(h-80)*Math.pow(u,1.6));}c.stroke();});
  for(const [x,w] of [[150,400],[1370,400]])scr(x,96,w,250,(x0,y0,w0,h0)=>{const r=ag_rnd(x);c.fillStyle="rgba(170,255,220,0.45)";for(let i=0;i<9;i++)for(let j=0;j<3;j++){const ww=40+r()*60;c.fillRect(x0+24+j*(w0-48)/3,y0+22+i*24,ww,6);}});
  // the tiers of consoles, the far ones first: each a long desk, its small screens glowing, controllers in front of them
  const rows=[[420,0.62,7],[540,0.78,6],[680,0.95,5],[840,1.15,4]];const r=ag_rnd(42);
  rows.forEach(([y,s,n],ri)=>{
    // the desk's top and its screens, which face the controllers (we see them over their shoulders)
    const x0=60,x1=W-60;c.fillStyle="#0e1320";c.fillRect(x0,y-40*s,x1-x0,140*s);
    for(let i=0;i<n*2;i++){const x=x0+40*s+i*(x1-x0-80*s)/(n*2),w=(x1-x0)/(n*2)-26*s;g=c.createLinearGradient(0,y-34*s,0,y+10*s);g.addColorStop(0,"rgba(120,220,190,0.55)");g.addColorStop(1,"rgba(60,140,130,0.3)");
      c.fillStyle=g;rr(c,x,y-36*s,w,42*s,4*s);c.fill();c.fillStyle="rgba(180,255,220,0.35)";for(let k=0;k<3;k++)c.fillRect(x+10*s,y-28*s+k*11*s,w*(0.3+0.5*r()),3*s);}
    c.fillStyle="#141a28";c.fillRect(x0,y+6*s,x1-x0,24*s);c.fillStyle="rgba(200,230,255,0.06)";c.fillRect(x0,y+6*s,x1-x0,2);
    // the controllers, from behind, between us and their screens
    for(let i=0;i<n;i++){const x=x0+(i+0.5+0.25*(r()-0.5))*(x1-x0)/n;pw_back(c,x,y+66*s,s*0.92,"#070a12");
      c.strokeStyle="rgba(120,220,190,0.22)";c.lineWidth=2;c.beginPath();c.arc(x,y+66*s-56*s*0.92,30*s*0.92,-2.6,-0.5);c.stroke();}
    c.fillStyle="rgba(3,5,10,0.55)";c.fillRect(0,y+66*s+60*s*0.92,W,H);});
  const v=c.createRadialGradient(W/2,H*0.4,H*0.3,W/2,H/2,W*0.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.6)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.pwHouston=pw_paintHouston;
// the guidance console, near: the room behind falls away into the dark, its screens soft; the console's own screen at the right
function pw_paintConsole(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#060a14");g.addColorStop(1,"#020309");c.fillStyle=g;c.fillRect(0,0,W,H);
  const r=ag_rnd(7);for(let i=0;i<26;i++){const x=r()*W,y=120+r()*420,rad=30+r()*70;const q=c.createRadialGradient(x,y,0,x,y,rad);q.addColorStop(0,"rgba(110,210,190,"+(0.05+0.08*r())+")");q.addColorStop(1,"rgba(110,210,190,0)");c.fillStyle=q;c.fillRect(x-rad,y-rad,rad*2,rad*2);}
  // the front wall's big screen, far and soft, at the top right
  let q=c.createRadialGradient(1500,200,40,1500,200,520);q.addColorStop(0,"rgba(90,200,180,0.22)");q.addColorStop(1,"rgba(90,200,180,0)");c.fillStyle=q;c.fillRect(900,0,1020,700);
  c.fillStyle="rgba(18,52,58,0.85)";c.fillRect(1220,90,600,260);c.strokeStyle="rgba(150,220,210,0.2)";c.lineWidth=2;c.strokeRect(1220,90,600,260);
  c.strokeStyle="rgba(170,255,220,0.35)";c.lineWidth=3;c.beginPath();for(let i=0;i<=40;i++){const u=i/40;c.lineTo(1250+u*540,120+200*Math.pow(u,1.6));}c.stroke();
  // the console's top, across the foot of the frame: its slanted panel and its small screen, facing the guidance officer
  g=c.createLinearGradient(0,800,0,H);g.addColorStop(0,"#1c2230");g.addColorStop(1,"#0a0d14");c.fillStyle=g;c.beginPath();c.moveTo(0,820);c.lineTo(W,800);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  c.strokeStyle="rgba(200,220,255,0.12)";c.lineWidth=2;c.beginPath();c.moveTo(0,820);c.lineTo(W,800);c.stroke();
  c.save();c.translate(1290,560);c.transform(1,-0.06,0,1,0,0);c.fillStyle="#0e151e";rr(c,-170,-150,360,300,14);c.fill();
  q=c.createLinearGradient(0,-130,0,130);q.addColorStop(0,"#1a4a48");q.addColorStop(1,"#0d2a2c");c.fillStyle=q;rr(c,-146,-126,312,252,8);c.fill();
  c.fillStyle="rgba(180,255,220,0.5)";const rr2=ag_rnd(3);for(let i=0;i<8;i++)c.fillRect(-120,-104+i*28,80+rr2()*140,7);c.restore();
  const v=c.createRadialGradient(W/2,H/2,H*0.35,W/2,H/2,W*0.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.55)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.pwConsole=pw_paintConsole;

/* ---------------------------------------------------------------- the guidance officer, a composite of 1969
   A white shirt, a thin dark tie, a jacket and a headset, short hair: as photographs of Mission Control in 1969 show controllers. The headset
   is worn on the head, its earpiece on the near ear and its small microphone by the mouth, inside the head's own picture. */
function pw_headset(c,P){c.save();c.lineCap="round";
  c.strokeStyle="rgb(36,38,44)";c.lineWidth=8;c.beginPath();c.moveTo(338,298);c.bezierCurveTo(300,282,262,300,250,350);c.lineTo(250,404);c.stroke();
  c.strokeStyle="rgba(150,156,166,0.55)";c.lineWidth=2.5;c.beginPath();c.moveTo(332,293);c.bezierCurveTo(298,281,262,299,252,346);c.stroke();
  c.strokeStyle="rgb(44,46,52)";c.lineWidth=5;c.beginPath();c.moveTo(262,452);c.bezierCurveTo(286,486,316,496,338,494);c.stroke();
  ag_soft(c,cc=>cc.ellipse(342,494,9,7,0,0,TAU),[54,56,60],[120,124,130],344,490,8,null);
  ag_soft(c,cc=>cc.ellipse(252,430,22,30,0.08,0,TAU),[46,48,54],[120,126,134],258,416,26,"rgba(0,0,0,0.4)",6);c.restore();}
// in a dark jacket over a white shirt and a thin dark tie (the people kit's suit, whose tie sits over the shirt's buttons)
const PW_CTRL={key:"pw_ctrl",name:"Guidance officer",role:"Houston, 1969",skin:[226,190,158],hair:{style:"side",c:[58,44,34]},top:{kind:"suit",c:[64,68,80],inner:[238,238,232],tie:[30,34,46]},hat:{paint:pw_headset},breath:0.27};

/* ---------------------------------------------------------------- the computer's work, in a cycle of its time
   A frame of dashes is the time the computer has; the bars are its work, steering first, then the display, then smaller work. When
   the bars run past the frame, the computer has more work than time: what overflows is amber. On a restart (o.restart 0 to 1) the
   smaller work falls away and the first two stay, green: it kept what mattered. o.over (0 to 1) shows the overflow; o.a. */
function pw_work(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const fw=1040,bh=86,rs=clamp(o.restart||0,0,1),ov=o.over==null?1:o.over;
  md_card(ctx,x,y,fw+120,330,{r:22});md_T(ctx,"THE COMPUTER'S WORK",x+40,y+62,{w:800,size:28,ls:4,col:MD.soft});
  const fx=x+60,fy=y+112;ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle="rgba(200,215,240,0.55)";ctx.lineWidth=2.4;rr(ctx,fx-8,fy-10,fw+16,bh+20,14);ctx.stroke();ctx.restore();
  md_T(ctx,"its time",fx+fw-4,fy+bh+50,{w:600,size:28,align:"right",col:MD.soft});
  const keep=[["steering",430],["display",250]],small=[150,140,130],grow=lerp(0.35,1,ov);let xx=fx;
  keep.forEach(([s,w],i)=>{const col=mix([150,170,205],MD.pass,ag_sine((rs-0.35)/0.5));ctx.fillStyle=rgba(mix(col,MD.navy,0.55),0.95);rr(ctx,xx,fy,w-10,bh,10);ctx.fill();
    ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;rr(ctx,xx,fy,w-10,bh,10);ctx.stroke();md_T(ctx,s,xx+22,fy+bh/2+10,{w:800,size:30});xx+=w;});
  // the smaller work: it runs past the end of the time, and on the restart it falls away
  const fall=ag_sine(rs/0.6);small.forEach((w0,i)=>{const w=w0*grow,yy=fy+fall*(140+30*i),al=1-fall;if(al<=0.01){xx+=w;return;}
    const over=Math.max(0,xx+w-10-(fx+fw)),inside=w-10-over;ctx.save();ctx.globalAlpha*=al;
    ctx.fillStyle="rgba(40,52,74,0.9)";rr(ctx,xx,yy,w-10,bh,10);ctx.fill();ctx.strokeStyle="rgba(150,170,205,0.7)";ctx.lineWidth=2;rr(ctx,xx,yy,w-10,bh,10);ctx.stroke();
    if(over>0){ctx.save();ctx.beginPath();ctx.rect(fx+fw,yy-4,over+10,bh+8);ctx.clip();glow(ctx,fx+fw+over/2,yy+bh/2,90,MD.wait,0.35);ctx.fillStyle=rgba(mix(MD.wait,MD.navy,0.35),0.95);rr(ctx,xx,yy,w-10,bh,10);ctx.fill();
      ctx.strokeStyle=rgba(MD.wait,1);ctx.lineWidth=2.6;rr(ctx,xx,yy,w-10,bh,10);ctx.stroke();ctx.restore();}
    ctx.restore();xx+=w;});
  md_T(ctx,"the rest",fx+690,fy+bh+50,{w:600,size:28,col:MD.soft,a:1-fall});
  ctx.restore();}
