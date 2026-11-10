/* ===== When someone falls behind: the opening, Fremont, California, 1982 to 1986 =====
   The film's own pictures for its opening story (prefix fb_), drawn in the module's matte language and lit from the right like the
   team's rooms, so the light carries across into the university. Nothing is a likeness of the real plant, and no maker's mark or car
   is copied: a long works of the 1960s with a saw-tooth roof, its assembly hall, and generic car bodies of the early 1980s.
     fbPlant                    the works from outside on an overcast day: the saw-tooth roof, the long wall, the car park, the gate
     fb_gate(ctx, u)            the gate in the fence, closing (u 0 open, 1 shut), and its padlocked chain
     fbHall, fbHallLit          the assembly hall: its trusses and roof lights, the line along the floor, the cord above it and a lamp
                                over each station; in 1982 a flat grey light, from 1984 the same hall with the roof lights clean
     fb_car(ctx, x, y, s, o)    a car body on its carrier, matte, in one of the line's paints; o.miss (0 to 1): a door missing
     fb_line(ctx, t, o)         the cars moving along the line (o.speed px a second, 0 to stop), its stations, the cord and the lamps
     fb_cord(ctx, o)            the cord above the line, and o.pull (0 to 1) where a hand has pulled it at o.at; o.lamp lights its lamp
     fb_arc(ctx, u, o)          a dashed arc across the Pacific, from Fremont to Japan, drawing itself: the trip to learn
     FB_PEOPLE                  the workers of 1982 to 1984, dressed for their time (a work shirt, a bib apron), a team leader,
                                and a manager in a suit
   Colour keeps the module's meaning: amber the problem (the absences, the faults, the stopped line's call for help), green what got
   better (the results), blue the plan (the teams, the cord); the plant, the cars and the people wear none of them. Nothing Japanese is
   drawn for Toyota's plant in Japan: it is a sheet of words and an arc on the way there. */

const FB_K={sky0:[196,200,204],sky1:[226,222,214],hill:[170,172,164],hill2:[186,186,178],wall:[198,188,172],wallDk:[164,154,140],
  roof:[128,124,122],glaze:[150,162,170],asphalt:[128,124,120],line:[226,222,210],steel:[112,108,106],steelDk:[78,76,76],
  floor:[168,162,152],hallWall:[206,198,186],truss:[96,92,92],lamp:[92,90,88]};

/* ---------------------------------------------------------------- the works from outside, 1982, overcast */
function fb_paintPlant(c){let g=c.createLinearGradient(0,0,0,520);g.addColorStop(0,rgba(FB_K.sky0,1));g.addColorStop(1,rgba(FB_K.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the hills behind the town, two soft ridges
  for(const [col,y0,amp,seed] of [[FB_K.hill2,430,46,3],[FB_K.hill,476,34,7]]){const R=ag_rnd(seed);c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,H);c.lineTo(0,y0);
    for(let x=0;x<=W;x+=60){const y=y0-amp*(0.55+0.45*Math.sin(x/310+seed))-R()*10;c.lineTo(x,y);}c.lineTo(W,H);c.closePath();c.fill();}
  // the car park and the road
  c.fillStyle=rgba(FB_K.asphalt,1);c.fillRect(0,700,W,H-700);g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,"rgba(255,255,255,0.06)");g.addColorStop(1,"rgba(40,36,34,0.22)");c.fillStyle=g;c.fillRect(0,700,W,H-700);
  c.strokeStyle=rgba(FB_K.line,0.55);c.lineWidth=4;for(let i=0;i<22;i++){const x=40+i*90;c.beginPath();c.moveTo(x,860);c.lineTo(x-34,1040);c.stroke();}
  // the works: a long wall, high windows, loading doors, and the saw-tooth roof, its glazed faces turned away from the sun
  const x0=120,x1=1800,top=420,base=700;c.fillStyle=rgba(FB_K.wall,1);c.fillRect(x0,top,x1-x0,base-top);
  g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"rgba(52,44,52,0.18)");g.addColorStop(1,"rgba(255,246,230,0.10)");c.fillStyle=g;c.fillRect(x0,top,x1-x0,base-top);
  c.fillStyle=rgba(FB_K.wallDk,1);c.fillRect(x0,base-70,x1-x0,70);
  for(let x=x0+40;x<x1-60;x+=96){c.fillStyle=rgba(FB_K.glaze,1);c.fillRect(x,top+40,70,54);c.strokeStyle=rgba(FB_K.steelDk,0.6);c.lineWidth=3;c.strokeRect(x,top+40,70,54);c.beginPath();c.moveTo(x+35,top+40);c.lineTo(x+35,top+94);c.stroke();}
  for(const dx of [220,520,1300,1580]){c.fillStyle=rgba(mix(FB_K.wallDk,FB_K.steelDk,0.3),1);c.fillRect(x0+dx,base-190,170,190);c.strokeStyle=rgba(FB_K.steelDk,0.35);c.lineWidth=2;
    for(let y=base-182;y<base;y+=14){c.beginPath();c.moveTo(x0+dx+6,y);c.lineTo(x0+dx+164,y);c.stroke();}}
  // the entrance, and a plain board over it (no name: the works stands for any)
  c.fillStyle=rgba(mix(FB_K.wall,[255,255,255],0.2),1);c.fillRect(880,base-210,160,210);c.fillStyle=rgba(FB_K.steelDk,0.8);c.fillRect(905,base-160,110,160);
  c.fillStyle=rgba(mix(FB_K.wallDk,FB_K.steelDk,0.4),1);c.fillRect(800,base-270,320,44);
  for(let x=x0;x<x1;x+=120){c.fillStyle=rgba(FB_K.roof,1);c.beginPath();c.moveTo(x,top);c.lineTo(x+92,top-74);c.lineTo(x+120,top-74);c.lineTo(x+120,top);c.closePath();c.fill();
    c.fillStyle=rgba(FB_K.glaze,1);c.fillRect(x+96,top-70,20,70);c.fillStyle="rgba(255,255,255,0.18)";c.beginPath();c.moveTo(x,top);c.lineTo(x+92,top-74);c.lineTo(x+60,top-74);c.lineTo(x,top-26);c.closePath();c.fill();}
  c.fillStyle=rgba(FB_K.steelDk,1);c.fillRect(x0-6,top-6,x1-x0+12,8);
  // a chimney stack and a water tower, far right
  c.fillStyle=rgba(FB_K.steel,1);c.fillRect(1700,250,36,96);c.fillRect(1500,280,90,60);c.fillRect(1520,340,8,80);c.fillRect(1562,340,8,80);
  // the fence across the car park, either side of the gate
  c.strokeStyle=rgba(FB_K.steelDk,0.55);c.lineWidth=2;for(let x=0;x<W;x+=22){if(x>760&&x<1160)continue;c.beginPath();c.moveTo(x,780);c.lineTo(x+30,860);c.stroke();c.beginPath();c.moveTo(x+30,780);c.lineTo(x,860);c.stroke();}
  c.fillStyle=rgba(FB_K.steelDk,1);c.fillRect(0,776,760,6);c.fillRect(1160,776,W-1160,6);for(const x of [20,250,500,740,1170,1420,1660,1900])c.fillRect(x,770,10,96);
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.2));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.fbPlant=c=>fb_paintPlant(c);
// the gate's two leaves, sliding shut (u 0 open, 1 shut), and a chain when it's shut
function fb_gate(ctx,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;u=ag_sine(clamp(u,0,1));ctx.save();ctx.globalAlpha*=a;
  for(const [x0,dir] of [[760,1],[1160,-1]]){const w=lerp(30,200,u),x=dir>0?x0:x0-w;ctx.strokeStyle=rgba(FB_K.steelDk,0.75);ctx.lineWidth=2.5;
    for(let k=0;k<w;k+=20){ctx.beginPath();ctx.moveTo(x+k,780);ctx.lineTo(x+k+20,860);ctx.stroke();ctx.beginPath();ctx.moveTo(x+k+20,780);ctx.lineTo(x+k,860);ctx.stroke();}
    ctx.fillStyle=rgba(FB_K.steelDk,1);ctx.fillRect(x,774,w,8);ctx.fillRect(x,858,w,6);ctx.fillRect(dir>0?x+w-8:x,770,8,96);}
  if(u>0.95){ctx.strokeStyle=rgba([70,66,64],1);ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<6;i++){ctx.ellipse(944+i*7,818+(i%2)*6,7,5,0,0,TAU);}ctx.stroke();ctx.fillStyle=rgba([70,66,64],1);ctx.fillRect(950,824,22,22);}
  ctx.restore();}

/* ---------------------------------------------------------------- the assembly hall */
const FB_LINE={y:600,cordY:300,lampY:250,st:[150,450,750,1050,1350,1650,1950],gap:300};
function fb_paintHall(c,lit){c.fillStyle=rgba(FB_K.hallWall,1);c.fillRect(0,0,W,H);
  // the roof: trusses in a long row, and roof lights between them, clean from 1984
  c.fillStyle=rgba(mix(FB_K.hallWall,FB_K.truss,0.35),1);c.fillRect(0,0,W,190);
  for(let x=-60;x<W+60;x+=240){c.fillStyle=lit?"rgba(250,246,234,0.95)":"rgba(196,198,196,0.9)";c.beginPath();c.moveTo(x+30,0);c.lineTo(x+170,0);c.lineTo(x+150,64);c.lineTo(x+50,64);c.closePath();c.fill();}
  c.strokeStyle=rgba(FB_K.truss,1);c.lineWidth=7;c.beginPath();c.moveTo(0,190);c.lineTo(W,190);c.stroke();c.lineWidth=4;
  for(let x=0;x<W;x+=120){c.beginPath();c.moveTo(x,190);c.lineTo(x+60,90);c.lineTo(x+120,190);c.stroke();}c.lineWidth=7;c.beginPath();c.moveTo(0,90);c.lineTo(W,90);c.stroke();
  // the columns, and the long wall behind the line
  for(let x=120;x<W;x+=480){c.fillStyle=rgba(FB_K.steel,1);c.fillRect(x-14,190,28,470);c.fillStyle="rgba(255,255,255,0.18)";c.fillRect(x+4,190,6,470);}
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,lit?0.16:0.28));g.addColorStop(1,rgba(LP.shade,lit?0.02:0.1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the light from the roof falling into the hall, from the right
  if(lit){c.save();c.globalCompositeOperation="screen";for(let x=-60;x<W+60;x+=240){g=c.createLinearGradient(x+100,64,x-60,660);g.addColorStop(0,"rgba(255,236,200,0.22)");g.addColorStop(1,"rgba(255,236,200,0)");c.fillStyle=g;
    c.beginPath();c.moveTo(x+50,64);c.lineTo(x+150,64);c.lineTo(x+20,660);c.lineTo(x-130,660);c.closePath();c.fill();}c.restore();}
  // the floor, a walkway line along it, and the line's track
  c.fillStyle=rgba(FB_K.floor,1);c.fillRect(0,660,W,H-660);g=c.createLinearGradient(0,660,0,H);g.addColorStop(0,"rgba(40,36,34,0.18)");g.addColorStop(1,"rgba(40,36,34,0.3)");c.fillStyle=g;c.fillRect(0,660,W,H-660);
  c.fillStyle=rgba(FB_K.line,0.7);c.fillRect(0,720,W,6);
  c.fillStyle=rgba(FB_K.steelDk,1);c.fillRect(0,FB_LINE.y+18,W,16);c.fillStyle=rgba(FB_K.steel,1);c.fillRect(0,FB_LINE.y+34,W,40);c.fillStyle="rgba(255,255,255,0.12)";c.fillRect(0,FB_LINE.y+34,W,4);
  if(!lit){c.fillStyle="rgba(60,60,66,0.08)";c.fillRect(0,0,W,H);}
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.24));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.fbHall=c=>fb_paintHall(c,false);
AG_PLACES.fbHallLit=c=>fb_paintHall(c,true);
AG_ROOMS.fbHallLit="fbHall";

// a car body of the early 1980s on its carrier: a three-box saloon, matte, its paint one of the line's (none of the colours that mean
// something); o.miss (0 to 1) leaves its front door out, as an outline; o.a
const FB_PAINT=[[178,170,158],[120,62,58],[92,94,98],[214,206,188],[66,64,66]];
function fb_car(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=FB_PAINT[(o.paint||0)%FB_PAINT.length];ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  // the carrier under it
  ctx.fillStyle=rgba(FB_K.steelDk,1);ctx.fillRect(-150,8,300,12);ctx.fillRect(-120,-6,16,16);ctx.fillRect(104,-6,16,16);
  // the body: sill, wings, cabin
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(-180,-20);ctx.lineTo(-176,-62);ctx.lineTo(-120,-74);ctx.lineTo(-74,-76);ctx.lineTo(-44,-122);ctx.lineTo(56,-124);ctx.lineTo(96,-78);ctx.lineTo(170,-72);ctx.lineTo(182,-48);ctx.lineTo(180,-20);ctx.closePath();ctx.fill();
  let g=ctx.createLinearGradient(0,-124,0,-20);g.addColorStop(0,"rgba(255,255,255,0.22)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(30,26,24,0.22)");ctx.fillStyle=g;ctx.fill();
  // the glass, unfitted: dark openings
  ctx.fillStyle="rgba(40,40,46,0.82)";ctx.beginPath();ctx.moveTo(-36,-114);ctx.lineTo(4,-114);ctx.lineTo(4,-80);ctx.lineTo(-62,-80);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(14,-114);ctx.lineTo(52,-114);ctx.lineTo(82,-80);ctx.lineTo(14,-80);ctx.closePath();ctx.fill();
  // the doors' seams, and the wheel arches, empty
  ctx.strokeStyle="rgba(30,26,24,0.45)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-64,-78);ctx.lineTo(-66,-22);ctx.moveTo(9,-80);ctx.lineTo(9,-22);ctx.moveTo(84,-78);ctx.lineTo(80,-22);ctx.stroke();
  ctx.fillStyle="rgba(36,34,34,0.9)";for(const wx of [-112,112]){ctx.beginPath();ctx.arc(wx,-20,34,Math.PI,TAU);ctx.closePath();ctx.fill();}
  // a door left out: the opening, dark, and its outline dashed
  if(o.miss>0){ctx.save();ctx.globalAlpha*=clamp(o.miss,0,1);ctx.fillStyle="rgba(46,44,46,0.92)";ctx.beginPath();ctx.moveTo(-62,-80);ctx.lineTo(8,-80);ctx.lineTo(8,-24);ctx.lineTo(-64,-24);ctx.closePath();ctx.fill();
    ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;ctx.stroke();ctx.restore();}
  ctx.restore();}

// the line: its cars moving along (o.speed px a second; the line's clock o.clock, so a stopped line stays where it stopped), the station
// lamps and the cord over them; o.miss: an array of car indexes left without a door; o.amiss (0 to 1) how much that shows
function fb_line(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const off=o.clock||0,gap=FB_LINE.gap;
  const n0=Math.floor((off-300)/gap);for(let k=n0;k<n0+10;k++){const x=k*gap-off+FB_LINE.st[0]+gap*0.5;if(x<-240||x>W+240)continue;
    fb_car(ctx,x,FB_LINE.y,0.92,{paint:((k%5)+5)%5,miss:(o.miss||[]).indexOf(((k%7)+7)%7)>=0?(o.amiss||0):0});}
  ctx.restore();fb_cord(ctx,o);}
// the cord above the line and the lamps over the stations: o.pull (0 to 1) at station o.at, its lamp lit amber with o.lamp (0 to 1)
function fb_cord(ctx,o){o=o||{};const a=o.a==null?1:o.a,cy=FB_LINE.cordY,at=o.at==null?3:o.at,px=FB_LINE.st[at],pl=o.pull||0;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a*(o.cordA==null?1:o.cordA);
  for(const sx of FB_LINE.st){ctx.fillStyle=rgba(FB_K.lamp,1);ctx.fillRect(sx-30,FB_LINE.lampY-18,60,34);ctx.fillStyle=rgba(FB_K.steelDk,1);ctx.fillRect(sx-4,FB_LINE.lampY-80,8,62);
    const lit=sx===px?clamp(o.lamp||0,0,1):0;ctx.fillStyle=rgba(mix([196,190,180],LP.amber,lit),1);ctx.fillRect(sx-24,FB_LINE.lampY-12,48,22);
    if(lit>0.02){ctx.save();ctx.globalCompositeOperation="screen";const g=ctx.createRadialGradient(sx,FB_LINE.lampY,4,sx,FB_LINE.lampY,110);g.addColorStop(0,rgba([255,190,90],0.5*lit));g.addColorStop(1,"rgba(255,190,90,0)");ctx.fillStyle=g;ctx.fillRect(sx-120,FB_LINE.lampY-120,240,240);ctx.restore();}}
  // the cord: a line slung between hooks, and where it's pulled, a dip
  ctx.strokeStyle=rgba([228,222,208],1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,cy);
  for(let x=0;x<=W;x+=20){const d=pl*70*Math.exp(-Math.pow((x-px)/90,2));ctx.lineTo(x,cy+d+4*Math.sin(x/150));}ctx.stroke();
  ctx.strokeStyle=rgba(FB_K.steelDk,0.6);ctx.lineWidth=2;ctx.stroke();
  for(let x=0;x<W;x+=150){ctx.fillStyle=rgba(FB_K.steelDk,1);ctx.fillRect(x-3,cy-16,6,16);}
  ctx.restore();}

// a dashed arc from Fremont to Japan, across the Pacific, drawing itself (u 0 to 1); the ends named
function fb_arc(ctx,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const x0=o.x0||1500,x1=o.x1||420,y=o.y||560,h=o.h||260;ctx.save();ctx.globalAlpha*=a;
  const pt=v=>[lerp(x0,x1,v),y-h*Math.sin(Math.PI*v)];ctx.setLineDash([16,14]);ctx.strokeStyle=rgba(LP.ink,0.7);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<=60;i++){const v=i/60*clamp(u,0,1),[px,py]=pt(v);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.stroke();ctx.setLineDash([]);
  for(const [v,col] of [[0,LP.ink],[1,LP.ink]]){if(v===1&&u<0.98)continue;const [px,py]=pt(v);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(px,py,12,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- the people of the works, dressed for their time */
const FB_PEOPLE={
  ray:{name:"A worker",key:"fb-ray",skin:[214,170,136],hair:{style:"cropped",c:[52,40,32]},beard:[60,46,38],top:{kind:"apron",c:[206,198,184],apron:[86,84,88]},breath:0.28},
  lena:{name:"A worker",key:"fb-lena",skin:[176,124,92],hair:{style:"bun",c:[28,22,22]},earrings:[200,190,170],top:{kind:"apron",c:[214,206,194],apron:[110,90,74]},breath:0.31},
  earl:{name:"A worker",key:"fb-earl",skin:[112,72,50],hair:{style:"coily",c:[30,24,22]},top:{kind:"apron",c:[222,216,204],apron:[118,62,58]},breath:0.26},
  walt:{name:"A worker",key:"fb-walt",skin:[232,194,164],hair:{style:"side",c:[150,120,96]},top:{kind:"apron",c:[196,188,176],apron:[92,80,70]},breath:0.25},
  rosa:{name:"A worker",key:"fb-rosa",skin:[204,160,124],hair:{style:"long",c:[48,34,28]},earrings:[200,190,170],top:{kind:"apron",c:[220,212,200],apron:[76,74,80]},breath:0.32},
  dee:{name:"A team leader",key:"fb-dee",skin:[226,186,150],hair:{style:"bob",c:[120,82,56]},top:{kind:"apron",c:[200,192,178],apron:[70,68,72]},breath:0.3},
  boss:{name:"A manager",key:"fb-boss",skin:[232,196,168],hair:{style:"side",c:[150,142,136]},glasses:[60,54,50],top:{kind:"suit",c:[96,90,84],inner:[236,232,222],tie:[110,62,56]},breath:0.24}
};
