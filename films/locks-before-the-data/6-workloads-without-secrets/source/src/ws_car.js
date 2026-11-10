/* ===== Workloads without secrets: the opening story's world =====
   The Netherlands in the middle of the 1990s, painted in the module's night light: a street of narrow brick houses with gables, their
   windows lit, trees, street lamps and a row of small cars of the time parked along a wet road (wsStreet); the same street at dawn,
   one car gone (wsDawn); and inside a car, its steering wheel and the ignition lock on the column (wsCabin). No car has a make or a
   badge, and no thief is drawn: only a wire. The owner who finds her car gone is an invented composite, a woman of about forty in a
   raincoat of the time. Each place paints in well under two seconds. */

// the cars along the road: x of each car's front, its colour; the third (k = 2) is the one taken in the night
const WS_CARS=[[-90,[52,60,74]],[300,[86,44,46]],[760,[38,66,84]],[1180,[70,74,62]],[1580,[58,52,70]]],WS_ROADY=812,WS_GAP=2;
const WS_LAMPS=[260,1040,1790];
// the houses: x, width, height, gable kind (0 stepped, 1 bell, 2 neck, 3 plain), brick colour
const WS_HOUSES=[[-40,190,420,0,[78,52,44]],[150,150,380,1,[70,58,52]],[300,170,450,2,[86,56,46]],[470,140,360,3,[64,58,56]],[610,180,430,0,[82,60,48]],
  [790,150,400,1,[74,52,46]],[940,170,460,2,[68,56,52]],[1110,150,380,3,[84,62,50]],[1260,190,440,0,[72,54,48]],[1450,150,400,1,[80,58,46]],
  [1600,170,450,2,[66,56,54]],[1770,190,410,3,[78,60,50]]];
const WS_STREETY=640;   // where the houses meet the pavement

// a small hatchback of the 1990s, in profile, facing left: its front at x, its wheels on y; col its paint; o.lit how much the lamps
// light it (night 1, dawn 0.5), o.dawn a cooler, paler light, o.a
function ws_car(c,x,y,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  const body=cc=>{cc.beginPath();cc.moveTo(x+4,y-38);cc.bezierCurveTo(x+2,y-62,x+8,y-74,x+26,y-80);cc.lineTo(x+98,y-90);cc.bezierCurveTo(x+118,y-112,x+136,y-128,x+156,y-132);
    cc.lineTo(x+268,y-132);cc.bezierCurveTo(x+286,y-130,x+296,y-120,x+304,y-100);cc.lineTo(x+318,y-74);cc.bezierCurveTo(x+326,y-60,x+328,y-48,x+326,y-36);
    cc.lineTo(x+300,y-30);cc.bezierCurveTo(x+298,y-60,x+238,y-62,x+232,y-30);cc.lineTo(x+98,y-30);cc.bezierCurveTo(x+94,y-62,x+34,y-62,x+30,y-30);cc.closePath();};
  // its shadow on the road, the body, a soft light along its top from the lamps, its windows
  const sg=c.createRadialGradient(x+165,y+2,0,x+165,y+2,190);sg.addColorStop(0,"rgba(0,6,8,0.55)");sg.addColorStop(1,"rgba(0,6,8,0)");c.save();c.translate(x+165,y+2);c.scale(1,0.16);c.translate(-x-165,-y-2);c.fillStyle=sg;c.fillRect(x-30,y-190,390,380);c.restore();
  const lit=o.lit==null?1:o.lit,base=o.dawn?mix(col,[150,166,180],0.22):col;
  body(c);let g=c.createLinearGradient(0,y-132,0,y-30);g.addColorStop(0,rgba(mix(base,[255,236,200],0.22*lit),1));g.addColorStop(0.5,rgba(base,1));g.addColorStop(1,rgba(mix(base,[0,0,0],0.45),1));c.fillStyle=g;c.fill();
  c.save();body(c);c.clip();const hg=c.createLinearGradient(0,y-92,0,y-80);hg.addColorStop(0,"rgba(255,240,210,"+(0.18*lit+0.06).toFixed(3)+")");hg.addColorStop(1,"rgba(255,240,210,0)");c.fillStyle=hg;c.fillRect(x,y-92,330,14);
  c.fillStyle="rgba(0,0,0,0.22)";c.fillRect(x,y-52,330,3);c.restore();
  // windows: dark glass, a sheen of the sky
  c.beginPath();c.moveTo(x+108,y-92);c.bezierCurveTo(x+124,y-110,x+138,y-122,x+158,y-124);c.lineTo(x+212,y-124);c.lineTo(x+212,y-92);c.closePath();
  c.moveTo(x+222,y-124);c.lineTo(x+266,y-124);c.bezierCurveTo(x+280,y-122,x+288,y-112,x+294,y-96);c.lineTo(x+296,y-92);c.lineTo(x+222,y-92);c.closePath();
  g=c.createLinearGradient(x+100,y-124,x+300,y-92);g.addColorStop(0,o.dawn?"rgba(150,176,196,0.9)":"rgba(28,52,62,0.95)");g.addColorStop(0.6,o.dawn?"rgba(90,110,130,0.95)":"rgba(10,22,28,0.95)");g.addColorStop(1,o.dawn?"rgba(120,140,160,0.9)":"rgba(22,40,48,0.95)");c.fillStyle=g;c.fill();
  // lights: a pale headlamp at the front, a dark red lamp at the back; a door's line and its handle
  c.fillStyle=o.dawn?"rgba(220,226,230,0.8)":"rgba(220,230,232,0.55)";rr(c,x+6,y-66,16,14,4);c.fill();c.fillStyle="rgba(120,24,24,0.85)";rr(c,x+314,y-74,10,18,3);c.fill();
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=1.6;c.beginPath();c.moveTo(x+214,y-90);c.lineTo(x+216,y-36);c.stroke();c.fillStyle="rgba(200,210,214,0.4)";c.fillRect(x+190,y-78,16,4);
  // wheels: tyres and dull hubs
  for(const wx of [x+64,x+266]){c.fillStyle="rgb(10,12,14)";c.beginPath();c.arc(wx,y-28,28,0,TAU);c.fill();
    const wg=c.createRadialGradient(wx-4,y-32,2,wx,y-28,16);wg.addColorStop(0,o.dawn?"rgb(150,156,160)":"rgb(96,104,108)");wg.addColorStop(1,"rgb(40,44,48)");c.fillStyle=wg;c.beginPath();c.arc(wx,y-28,15,0,TAU);c.fill();}
  c.restore();}

// the street, night or dawn: o.dawn; o.gap the car that isn't there
function ws_paintStreet(c,o){o=o||{};const dawn=!!o.dawn,w=W,h=H,R=ag_rnd(dawn?23:17);
  // sky: the hall's petrol at night; at dawn a pale cold blue with warmth low down
  let g=c.createLinearGradient(0,0,0,WS_STREETY);if(dawn){g.addColorStop(0,"rgb(46,70,92)");g.addColorStop(0.62,"rgb(112,134,152)");g.addColorStop(1,"rgb(186,170,160)");}
  else{g.addColorStop(0,rgba(DP.hall.bg0,1));g.addColorStop(1,"rgb(20,46,54)");}c.fillStyle=g;c.fillRect(0,0,w,WS_STREETY);
  if(!dawn)for(let i=0;i<60;i++){c.fillStyle="rgba(190,235,235,"+(0.04+R()*0.1).toFixed(3)+")";c.beginPath();c.arc(R()*w,R()*300,0.8+R()*1.4,0,TAU);c.fill();}
  // the houses: brick, a gable each, windows in rows, some lit
  for(const [x,hw,hh,kind,br] of WS_HOUSES){const top=WS_STREETY-hh,col=dawn?mix(br,[120,128,140],0.35):mix(br,[10,30,36],0.55);
    c.beginPath();c.moveTo(x,WS_STREETY);c.lineTo(x,top+60);
    if(kind===0){const st=hw/6;c.lineTo(x+st*0.4,top+60);c.lineTo(x+st*0.4,top+40);c.lineTo(x+st*1.4,top+40);c.lineTo(x+st*1.4,top+20);c.lineTo(x+st*2.3,top+20);c.lineTo(x+st*2.3,top);c.lineTo(x+hw-st*2.3,top);c.lineTo(x+hw-st*2.3,top+20);c.lineTo(x+hw-st*1.4,top+20);c.lineTo(x+hw-st*1.4,top+40);c.lineTo(x+hw-st*0.4,top+40);c.lineTo(x+hw-st*0.4,top+60);}
    else if(kind===1){c.bezierCurveTo(x+hw*0.12,top+58,x+hw*0.2,top+30,x+hw*0.3,top+22);c.bezierCurveTo(x+hw*0.36,top+4,x+hw*0.64,top+4,x+hw*0.7,top+22);c.bezierCurveTo(x+hw*0.8,top+30,x+hw*0.88,top+58,x+hw,top+60);}
    else if(kind===2){c.lineTo(x+hw*0.22,top+60);c.bezierCurveTo(x+hw*0.28,top+50,x+hw*0.3,top+30,x+hw*0.32,top+14);c.lineTo(x+hw*0.68,top+14);c.bezierCurveTo(x+hw*0.7,top+30,x+hw*0.72,top+50,x+hw*0.78,top+60);}
    else{c.lineTo(x+hw/2,top+8);}
    c.lineTo(x+hw,top+60);c.lineTo(x+hw,WS_STREETY);c.closePath();const hg=c.createLinearGradient(0,top,0,WS_STREETY);hg.addColorStop(0,rgba(mix(col,[255,255,255],dawn?0.1:0.04),1));hg.addColorStop(1,rgba(mix(col,[0,0,0],0.3),1));c.fillStyle=hg;c.fill();
    c.strokeStyle=dawn?"rgba(230,236,240,0.18)":"rgba(120,200,205,0.12)";c.lineWidth=1.4;c.stroke();
    // windows: two or three across, in rows up the front; at night some are warm
    const nx=hw>165?3:2,ww=hw/(nx*2+1),rows=Math.floor((hh-110)/78);
    for(let r=0;r<rows;r++)for(let k=0;k<nx;k++){const wx=x+ww*(1+k*2),wy=WS_STREETY-96-r*78,on=!dawn&&R()<0.38,sky=dawn?R()<0.2:false;
      c.fillStyle=on?"rgba(255,206,140,0.72)":sky?"rgba(255,214,170,0.45)":dawn?"rgba(70,86,100,0.9)":"rgba(10,24,30,0.9)";c.fillRect(wx,wy,ww,50);
      if(on){const lg=c.createRadialGradient(wx+ww/2,wy+25,0,wx+ww/2,wy+25,70);lg.addColorStop(0,"rgba(255,200,130,0.16)");lg.addColorStop(1,"rgba(255,200,130,0)");c.fillStyle=lg;c.fillRect(wx-60,wy-45,ww+120,140);}
      c.fillStyle=dawn?"rgba(30,36,44,0.5)":"rgba(0,0,0,0.4)";c.fillRect(wx+ww/2-1,wy,2,50);}
    // a door at the foot
    c.fillStyle=dawn?"rgba(40,46,56,0.95)":"rgba(6,16,20,0.95)";rr(c,x+hw*0.36,WS_STREETY-74,hw*0.28,74,6);c.fill();}
  // the pavement and the kerb, then the road, wet
  g=c.createLinearGradient(0,WS_STREETY,0,WS_ROADY-110);g.addColorStop(0,dawn?"rgb(98,104,112)":"rgb(22,38,42)");g.addColorStop(1,dawn?"rgb(84,90,98)":"rgb(16,30,34)");c.fillStyle=g;c.fillRect(0,WS_STREETY,w,WS_ROADY-110-WS_STREETY);
  c.fillStyle=dawn?"rgba(200,206,212,0.4)":"rgba(140,200,205,0.18)";c.fillRect(0,WS_ROADY-112,w,3);
  g=c.createLinearGradient(0,WS_ROADY-110,0,h);g.addColorStop(0,dawn?"rgb(70,78,90)":"rgb(12,26,30)");g.addColorStop(1,dawn?"rgb(44,52,62)":"rgb(6,16,20)");c.fillStyle=g;c.fillRect(0,WS_ROADY-110,w,h-WS_ROADY+110);
  // trees between the houses and the road: tapering trunks, soft crowns
  for(const tx of [120,700,1350]){c.save();ag_taper(c,[tx,WS_ROADY-120],[tx+4,WS_ROADY-200],[tx-6,WS_ROADY-280],[tx+2,WS_ROADY-340],18,7,dawn?"rgb(46,44,46)":"rgb(10,20,22)");c.restore();
    for(let k=0;k<7;k++){const cx=tx+(R()-0.5)*150,cy=WS_ROADY-380-R()*120,r=60+R()*50,cg=c.createRadialGradient(cx,cy,0,cx,cy,r);
      cg.addColorStop(0,dawn?"rgba(56,70,66,0.75)":"rgba(14,32,34,0.85)");cg.addColorStop(1,dawn?"rgba(56,70,66,0)":"rgba(14,32,34,0)");c.fillStyle=cg;c.fillRect(cx-r,cy-r,2*r,2*r);}}
  // street lamps: posts and, at night, warm lamps and their pools of light and streaks in the wet road
  for(const lx of WS_LAMPS){c.fillStyle=dawn?"rgb(40,44,50)":"rgb(14,24,28)";c.fillRect(lx-4,WS_ROADY-420,8,312);c.fillRect(lx-4,WS_ROADY-420,40,6);
    c.fillStyle=dawn?"rgba(200,190,170,0.6)":"rgba(255,214,150,0.95)";rr(c,lx+24,WS_ROADY-416,26,12,4);c.fill();
    if(!dawn){const lg=c.createRadialGradient(lx+37,WS_ROADY-404,0,lx+37,WS_ROADY-404,260);lg.addColorStop(0,"rgba(255,206,140,0.30)");lg.addColorStop(1,"rgba(255,206,140,0)");c.fillStyle=lg;c.fillRect(lx-230,WS_ROADY-670,540,540);
      // its light in the wet road: a soft, long glow under the lamp, brightest near the kerb
      c.save();c.translate(lx+37,WS_ROADY-40);c.scale(0.2,1);const sg=c.createRadialGradient(0,0,0,0,0,300);sg.addColorStop(0,"rgba(255,206,140,0.13)");sg.addColorStop(0.5,"rgba(255,206,140,0.05)");sg.addColorStop(1,"rgba(255,206,140,0)");
      c.fillStyle=sg;c.fillRect(-300,-40,600,340);c.restore();}}
  // the cars, but the one taken in the night at dawn
  WS_CARS.forEach(([x,col],k)=>{if(dawn&&k===(o.gap==null?WS_GAP:o.gap))return;ws_car(c,x,WS_ROADY,col,{lit:dawn?0.5:1,dawn});});
  // at dawn, the empty space: the dry patch where the car stood
  if(dawn){const gx=WS_CARS[WS_GAP][0];const dg=c.createRadialGradient(gx+165,WS_ROADY-8,0,gx+165,WS_ROADY-8,170);dg.addColorStop(0,"rgba(110,116,124,0.55)");dg.addColorStop(1,"rgba(110,116,124,0)");
    c.save();c.translate(gx+165,WS_ROADY-8);c.scale(1,0.14);c.translate(-gx-165,-WS_ROADY+8);c.fillStyle=dg;c.fillRect(gx-20,WS_ROADY-200,370,400);c.restore();}
  // haze low over the road
  g=c.createLinearGradient(0,WS_STREETY-100,0,WS_ROADY);g.addColorStop(0,dawn?"rgba(200,206,214,0)":"rgba(80,160,170,0)");g.addColorStop(0.7,dawn?"rgba(200,206,214,0.12)":"rgba(80,160,170,0.07)");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(0,WS_STREETY-100,w,WS_ROADY-WS_STREETY+100);}
AG_PLACES.wsStreet=c=>ws_paintStreet(c,{});
AG_PLACES.wsDawn=c=>ws_paintStreet(c,{dawn:true});

/* ---------------------------------------------------------------- inside the car, at night
   The steering wheel at the left (its hub at 470, 820), the dashboard over it with two dim dials, the windscreen at the top with the
   street's lights soft beyond it, and on the column, to the right of the wheel, the ignition lock (WS_LOCK). */
const WS_LOCK={x:1130,y:600,r:70};
// the lock: a ring of bright metal round a dark face, the key's slot
function ws_lockFace(c){const L=WS_LOCK;let rg=c.createRadialGradient(L.x-20,L.y-24,4,L.x,L.y,L.r+6);rg.addColorStop(0,"rgb(196,214,216)");rg.addColorStop(0.6,"rgb(98,116,122)");rg.addColorStop(1,"rgb(40,52,58)");c.fillStyle=rg;c.beginPath();c.arc(L.x,L.y,L.r,0,TAU);c.fill();
  rg=c.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r*0.8);rg.addColorStop(0,"rgb(30,40,44)");rg.addColorStop(1,"rgb(14,20,24)");c.fillStyle=rg;c.beginPath();c.arc(L.x,L.y,L.r*0.78,0,TAU);c.fill();
  c.fillStyle="rgb(4,8,10)";rr(c,L.x-6,L.y-34,12,68,4);c.fill();}
function ws_paintCabin(c){const w=W,h=H,R=ag_rnd(31);
  let g=c.createLinearGradient(0,0,0,300);g.addColorStop(0,"rgb(16,34,40)");g.addColorStop(1,"rgb(10,22,26)");c.fillStyle=g;c.fillRect(0,0,w,300);
  // the street's lights through the windscreen, soft
  for(let i=0;i<26;i++){const x=R()*w,y=40+R()*200,r=14+R()*46,u=R(),col=u<0.6?[255,206,140]:u<0.85?[120,210,220]:[255,120,110],a=0.12+R()*0.22,lg=c.createRadialGradient(x,y,0,x,y,r);
    lg.addColorStop(0,rgba(col,a));lg.addColorStop(0.6,rgba(col,a*0.5));lg.addColorStop(1,rgba(col,0));c.fillStyle=lg;c.fillRect(x-r,y-r,2*r,2*r);}
  // the dashboard: a dark curve over the frame, with the dials
  c.beginPath();c.moveTo(0,250);c.bezierCurveTo(400,200,1300,190,1920,260);c.lineTo(1920,1080);c.lineTo(0,1080);c.closePath();g=c.createLinearGradient(0,200,0,1080);g.addColorStop(0,"rgb(30,44,50)");g.addColorStop(0.3,"rgb(18,28,32)");g.addColorStop(1,"rgb(8,14,16)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(150,220,225,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(0,252);c.bezierCurveTo(400,202,1300,192,1920,262);c.stroke();
  for(const [dx,dy] of [[330,380],[610,370]]){const dg=c.createRadialGradient(dx,dy,0,dx,dy,110);dg.addColorStop(0,"rgba(16,40,46,1)");dg.addColorStop(1,"rgba(6,16,20,1)");c.fillStyle=dg;c.beginPath();c.arc(dx,dy,100,0,TAU);c.fill();
    c.strokeStyle="rgba(120,210,220,0.35)";c.lineWidth=2;c.stroke();for(let k=0;k<11;k++){const a=Math.PI*0.8+k*Math.PI*1.4/10;c.beginPath();c.moveTo(dx+Math.cos(a)*84,dy+Math.sin(a)*84);c.lineTo(dx+Math.cos(a)*96,dy+Math.sin(a)*96);c.stroke();}}
  // the column, from under the wheel to the right, and its shroud round the lock
  c.beginPath();c.moveTo(560,700);c.bezierCurveTo(800,600,1000,520,1220,500);c.bezierCurveTo(1290,500,1320,560,1300,640);c.bezierCurveTo(1270,740,1000,860,700,960);c.closePath();
  g=c.createLinearGradient(700,500,1100,900);g.addColorStop(0,"rgb(38,52,58)");g.addColorStop(1,"rgb(12,20,24)");c.fillStyle=g;c.fill();c.strokeStyle="rgba(150,220,225,0.16)";c.lineWidth=2;c.stroke();
  // the wires under it, in their sleeves, running down out of sight
  for(let k=0;k<5;k++){c.strokeStyle=["rgb(20,26,30)","rgb(40,30,24)","rgb(24,34,30)","rgb(30,30,40)","rgb(22,22,24)"][k];c.lineWidth=12;c.lineCap="round";c.beginPath();c.moveTo(1050+k*14,760);c.bezierCurveTo(1060+k*16,860,1020+k*20,960,1000+k*26,1100);c.stroke();}
  ws_lockFace(c);
  // the wheel, over the column: a whole rim, low in the frame under the dials, a soft highlight along its top, two spokes and the hub
  const WX=440,WY=990,WR=420;c.save();c.lineCap="round";c.strokeStyle="rgb(14,22,26)";c.lineWidth=58;c.beginPath();c.arc(WX,WY,WR,0,TAU);c.stroke();
  c.strokeStyle="rgba(150,220,225,0.16)";c.lineWidth=5;c.beginPath();c.arc(WX,WY,WR+22,-2.7,-0.45);c.stroke();
  c.strokeStyle="rgb(18,28,32)";c.lineWidth=74;for(const a of [-0.18,Math.PI+0.18]){c.beginPath();c.moveTo(WX,WY);c.lineTo(WX+Math.cos(a)*WR,WY+Math.sin(a)*WR);c.stroke();}c.restore();
  let rg=c.createRadialGradient(WX-30,WY-30,10,WX,WY,170);rg.addColorStop(0,"rgb(40,56,62)");rg.addColorStop(1,"rgb(12,20,24)");c.fillStyle=rg;c.beginPath();c.arc(WX,WY,150,0,TAU);c.fill();
  c.strokeStyle="rgba(150,220,225,0.12)";c.lineWidth=2;c.beginPath();c.arc(WX,WY,150,-2.6,-0.6);c.stroke();}
AG_PLACES.wsCabin=ws_paintCabin;

/* ---------------------------------------------------------------- the key, the chip, the wire and the car's question
   ws_key(ctx, o): the key in the lock, its head of dark glass turned by o.turn (0 off, 1 on: 50 degrees), its blade in the slot;
   o.chip (0 to 1) shows the chip in its head, gold; o.copy draws a copy cut to the same shape, with no chip, in grey; o.out (0 to 1)
   slides it out of the lock, up and right; o.a */
function ws_key(ctx,o){o=o||{};const out=clamp(o.out||0,0,1),a=(o.a==null?1:o.a)*(1-ag_sine(out));if(a<=0.002)return;const L=WS_LOCK,ang=-0.12+0.87*ag_sine(o.turn||0);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(L.x,L.y);ctx.rotate(ang);const k=1+0.08*ag_sine(out);ctx.scale(k,k);
  // the shoulder of the blade, metal, from the slot up to the head
  const mg=ctx.createLinearGradient(-10,0,10,0);mg.addColorStop(0,"rgb(120,136,140)");mg.addColorStop(0.5,"rgb(200,214,216)");mg.addColorStop(1,"rgb(96,110,116)");
  ctx.fillStyle=mg;rr(ctx,-11,-58,22,60,4);ctx.fill();
  // the head: wider at the top, rounded; black plastic, or, for a copy, plain metal cut to the same shape
  const head=cc=>{cc.beginPath();cc.moveTo(-36,-54);cc.lineTo(36,-54);cc.bezierCurveTo(50,-54,60,-64,62,-82);cc.lineTo(66,-150);cc.bezierCurveTo(68,-178,48,-194,22,-194);
    cc.lineTo(-22,-194);cc.bezierCurveTo(-48,-194,-68,-178,-66,-150);cc.lineTo(-62,-82);cc.bezierCurveTo(-60,-64,-50,-54,-36,-54);cc.closePath();};
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.shadowOffsetY=10;head(ctx);
  const g=ctx.createLinearGradient(-60,-194,60,-54);if(o.copy){g.addColorStop(0,"rgb(184,196,198)");g.addColorStop(0.5,"rgb(146,158,162)");g.addColorStop(1,"rgb(98,110,114)");}
  else{g.addColorStop(0,"rgb(52,62,66)");g.addColorStop(0.45,"rgb(24,30,34)");g.addColorStop(1,"rgb(8,12,14)");}
  ctx.fillStyle=g;ctx.fill();ctx.restore();
  head(ctx);ctx.strokeStyle=o.copy?"rgba(236,244,244,0.75)":"rgba(150,225,230,0.55)";ctx.lineWidth=2;ctx.stroke();
  // a sheen along its top edge, and the hole for the ring
  ctx.strokeStyle=o.copy?"rgba(255,255,255,0.45)":"rgba(210,240,240,0.22)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-44,-184);ctx.bezierCurveTo(-20,-190,20,-190,44,-184);ctx.stroke();
  ctx.fillStyle=o.copy?"rgb(40,50,54)":"rgb(4,8,10)";ctx.beginPath();ctx.arc(0,-168,12,0,TAU);ctx.fill();
  // the chip inside, gold, as a card's chip is: it says the key is genuine
  if(!o.copy&&o.chip>0){ctx.save();ctx.globalAlpha*=clamp(o.chip,0,1);ctx.translate(-29,-130);ctx.scale(0.8,0.8);dp_chip(ctx,0,0);ctx.restore();}
  ctx.restore();}
// the car's question: rings of the identity's cyan from the coil round the lock out to the key's head (u 0 to 1, over and over while
// asking); answer (0 to 1): a gold ring back from the chip
function ws_ask(ctx,t,ask,answer,turn){const L=WS_LOCK;if(ask>0){ctx.save();ctx.globalAlpha*=clamp(ask,0,1);
    // the coil: a ring of light round the lock
    ctx.strokeStyle=rgba(DP.F.cyan,0.9);ctx.lineWidth=3;ctx.shadowColor=rgba(DP.F.cyan,0.9);ctx.shadowBlur=14;ctx.beginPath();ctx.arc(L.x,L.y,L.r+16,0,TAU);ctx.stroke();ctx.shadowBlur=0;
    for(let k=0;k<3;k++){const u=((t*0.9+k/3)%1),r=L.r+16+u*170;ctx.strokeStyle=rgba(DP.F.cyan,0.7*(1-u));ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(L.x,L.y,r,-2.4,-0.7);ctx.stroke();}
    ctx.restore();}
  if(answer>0){const ang=-0.12+0.87*ag_sine(turn||0),hx=L.x+Math.sin(ang)*108,hy=L.y-Math.cos(ang)*108;ctx.save();ctx.globalAlpha*=clamp(answer,0,1);
    for(let k=0;k<2;k++){const u=((t*0.9+k/2)%1),r=20+u*120;ctx.strokeStyle="rgba(255,212,110,"+(0.75*(1-u)).toFixed(3)+")";ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(hx,hy,r,0,TAU);ctx.stroke();}
    dp_halo(ctx,hx,hy,90,[255,204,92],0.22);ctx.restore();}}
// the circuit the key closes: a line of light from the lock down the column to the engine, drawn on by p, in a meaning's colour
function ws_circuit(ctx,p,col){if(!(p>0))return;const L=WS_LOCK;dp_link(ctx,[L.x+30,L.y+50],[L.x+150,L.y+200],col,Math.min(1,p*2),{lw:4,dot:false});
  if(p>0.5)dp_link(ctx,[L.x+150,L.y+200],[L.x+150,1080],col,(p-0.5)*2,{lw:4,dot:false});}
// a wire behind the wheel: two bare ends that touch (touch 0 to 1), a small spark where they meet
function ws_wire(ctx,t,touch,a){if(a<=0)return;const c=dp_f("coral"),u=ag_sine(touch||0);ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  const ex=1250+u*24,ey=860-u*6;
  ctx.strokeStyle=rgba(mix(c,[60,20,16],0.35),1);ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(1000,1090);ctx.bezierCurveTo(1060,980,1180,930,ex-40,ey);ctx.stroke();
  ctx.beginPath();ctx.moveTo(1460,1090);ctx.bezierCurveTo(1420,980,1360,930,1330-u*24+40,ey);ctx.stroke();
  ctx.strokeStyle="rgb(214,150,96)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(ex-40,ey);ctx.lineTo(ex,ey);ctx.moveTo(1330-u*24+40,ey);ctx.lineTo(1330-u*24,ey);ctx.stroke();
  if(u>0.95){const s=0.6+0.4*Math.sin(t*40);dp_halo(ctx,1290,ey,70*s,"coral",0.5);ctx.fillStyle="rgba(255,236,210,0.95)";ctx.beginPath();ctx.arc(1290,ey,6*s,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- the owner, at dawn
   An invented composite: a woman of about forty, short dark-blonde hair, a raincoat of the 1990s over a pale jumper. */
const WS_OWNER={key:"wsOwner",name:"The owner",role:"",skin:[232,198,176],hair:{style:"bob",c:[150,118,80]},top:{kind:"blazer",c:[150,132,100],inner:[214,210,200]},breath:0.3};
// the light of the street at dawn, from the pale sky in front of her
const WS_DAWN={key:[640,420],kr:860,kk:0.9,amb:0.4,kc:[1.0,1.0,1.04],shade:[0.66,0.74,0.88],rim:[200,214,236],rimA:0.55,rimW:5};

/* ---------------------------------------------------------------- the opening's numbers
   ws_bars(ctx, x, y, o): new cars with an immobiliser in the Netherlands, 1994 and 1998, two bars of glass drawn up by o.p1 and o.p2 */
function ws_bars(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=640,h=430;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind});dp_T(ctx,"New cars with an immobiliser",x+30,y+56,{w:700,size:34});dp_T(ctx,"The Netherlands",x+30,y+98,{w:600,size:28,col:"mut"});
  const base=y+h-62,top=y+150,bw=150;[[x+120,0.2,o.p1||0,"1994","About 1 in 5"],[x+380,1.0,o.p2||0,"1998","All of them"]].forEach(([bx,v,p,yr,lab])=>{
    const bh=(base-top)*v*ag_sine(p);if(p>0){ctx.save();ctx.shadowColor=rgba(DP.F.cyan,0.6);ctx.shadowBlur=16;rr(ctx,bx,base-bh,bw,Math.max(2,bh),10);const g=ctx.createLinearGradient(0,base-bh,0,base);
      g.addColorStop(0,rgba(mix(DP.F.cyan,[255,255,255],0.2),1));g.addColorStop(1,rgba(DP.F.cyan,0.7));ctx.fillStyle=g;ctx.fill();ctx.restore();
      dp_T(ctx,lab,bx+bw/2,base-bh-18,{w:700,size:28,align:"center",a:ag_in(p,0.7,0.3)});}
    dp_T(ctx,yr,bx+bw/2,base+40,{w:700,size:30,align:"center",col:"mut"});});
  ctx.fillStyle=rgba(DP.T.mut,0.4);ctx.fillRect(x+60,base,w-120,1.6);ctx.restore();}

/* ws_keyInset(ctx, cx, cy, r, o): the car's lock and a key in a round window of glass, r its radius, to look back at the opening story
   from the hall: o.copy draws the copy, o.chip the chip, o.turn turns it, o.ask and o.answer the car's question and the chip's answer,
   o.circuit (0 to 1) the circuit it closes in o.cc (coral for a copy, green for the right answer); o.col the window's rim */
function ws_keyInset(ctx,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const c=dp_f(o.col||"cyan"),L=WS_LOCK,k=r/250;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(c,0.55);ctx.shadowBlur=26;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fillStyle="rgba(8,18,22,0.94)";ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.clip();ctx.translate(cx,cy+r*0.3);ctx.scale(k,k);ctx.translate(-L.x,-L.y);
  ws_lockFace(ctx);if(o.circuit>0)ws_circuit(ctx,o.circuit,o.cc||"coral");
  if(o.ask>0||o.answer>0)ws_ask(ctx,o.t||0,o.ask||0,o.answer||0,o.turn||0);
  ws_key(ctx,{copy:o.copy,chip:o.chip,turn:o.turn});ctx.restore();
  ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),0.9);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();}
