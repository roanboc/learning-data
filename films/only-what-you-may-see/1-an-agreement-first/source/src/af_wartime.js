/* ===== An agreement first: the past, Bletchley Park, 1939 to 1945 =====
   The opening story, painted in the module's light (Night glass): Bletchley Park at night in wartime, its house a dark outline and its
   huts blacked out but for a line of warm light; a hut's desk under a lamp, where a recruit signs the Official Secrets Act before she is
   told anything; a sea chart on frosted glass, where a convoy is steered round the submarines; a commander's desk, where an officer
   waits while a message is read, then takes it back. Nothing violent is shown: ships and submarines are shapes on a chart, and nothing
   sinks. The film's own pictures, prefixed af_; the kit (films/locks-before-the-data/shared/) is used as it is.
   Places, each painted once: afPark (the park at night), afHut (inside a hut), afSea (the chart), afDesk (the commander's room). */

/* ---------------------------------------------------------------- the people of the story, lit by a lamp at night
   A recruit of 1940 in a wool coat, her hair rolled; an officer of 1943 in the air force's blue-grey, bare-headed indoors; a commander
   of 1943 in khaki. Each is drawn as the agent films draw people, one three-quarter head, arms down, a hand only on what the story is
   about: the recruit's on the pen, the officer's and the commander's on the sheet. */
// a coat's two rows of buttons, below the opening (figure space, over the body)
function af_coat(btn){return c=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  for(const [x0,k] of [[300,0],[352,1]])for(let i=0;i<3;i++){const y=902+i*62,x=x0+(y-880)*0.03;c.fillStyle=rgba(btn,1);c.beginPath();c.arc(x,y,6.5,0,TAU);c.fill();
    c.fillStyle="rgba(255,255,255,0.28)";c.beginPath();c.arc(x+1.6,y-1.8,2.2,0,TAU);c.fill();}
  c.restore();};}
// a jacket's buttons, one row down the middle, and two breast pockets' flaps
function af_tunic(btn){return c=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  for(let i=0;i<3;i++){const y=918+i*64,x=330+(y-880)*0.02;c.fillStyle=rgba(btn,1);c.beginPath();c.arc(x,y,6,0,TAU);c.fill();
    c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();c.arc(x+1.5,y-1.6,2,0,TAU);c.fill();}
  c.strokeStyle="rgba(0,0,0,0.22)";c.lineWidth=3;for(const [x,w] of [[176,92],[372,40]]){c.beginPath();c.moveTo(x,742);c.lineTo(x+w,736);c.stroke();}
  c.restore();};}
const AF_P={
  recruit:{key:"af_recruit",name:"a recruit of 1940",skin:[236,204,178],hair:{style:"bob",c:[98,66,44]},
    top:{kind:"blazer",c:[110,84,70],inner:[226,216,200],paint:af_coat([158,128,96])},breath:0.31},
  officer:{key:"af_officer",name:"an officer of 1943",skin:[226,188,158],hair:{style:"side",c:[72,54,40]},
    top:{kind:"suit",c:[84,98,124],inner:[192,206,224],tie:[30,32,40],paint:af_tunic([200,172,104])},breath:0.27},
  commander:{key:"af_commander",name:"a commander of 1943",skin:[220,180,150],hair:{style:"cropped",c:[176,174,168]},
    top:{kind:"suit",c:[116,102,70],inner:[172,158,118],tie:[90,76,50],paint:af_tunic([190,162,96])},breath:0.23}
};

/* ---------------------------------------------------------------- shared bits of light */
// a warm glow, kept once and drawn where a lamp or a window's edge shines
function af_glowSprite(){return ag_kept("af_glow",128,128,(c,w,h)=>{const g=c.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,"rgba(255,214,150,0.9)");g.addColorStop(0.25,"rgba(255,190,110,0.42)");g.addColorStop(1,"rgba(255,170,90,0)");c.fillStyle=g;c.fillRect(0,0,w,h);});}
function af_glow(ctx,x,y,rx,ry,a){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.globalCompositeOperation="lighter";ctx.drawImage(af_glowSprite(),x-rx,y-ry,2*rx,2*ry);ctx.restore();}
const AF_WARM=[255,206,138];

/* ---------------------------------------------------------------- the park at night
   The house (a dark outline with a dome, gables and tall chimneys), trees, the lawn and its paths under a petrol sky with a low moon. The
   huts are drawn live (af_huts), row by row, so they can come up as the years pass; their windows' lines of light are drawn live too. */
const AF_HOUSE={y:652};
function af_houseShape(c){const b=AF_HOUSE.y;
  c.moveTo(540,b);c.lineTo(540,528);c.lineTo(566,528);c.lineTo(612,470);c.lineTo(658,528);c.lineTo(700,528);
  c.lineTo(700,466);c.lineTo(712,452);c.lineTo(712,440);c.bezierCurveTo(712,398,736,376,746,370);c.lineTo(746,350);c.lineTo(750,350);c.lineTo(750,370);
  c.bezierCurveTo(760,376,786,398,786,440);c.lineTo(786,452);c.lineTo(798,466);c.lineTo(798,500);
  c.lineTo(818,500);c.lineTo(818,446);c.lineTo(842,446);c.lineTo(842,500);c.lineTo(944,500);c.lineTo(944,436);c.lineTo(968,436);c.lineTo(968,500);c.lineTo(1006,500);
  c.lineTo(1006,522);c.lineTo(1044,456);c.lineTo(1082,522);c.lineTo(1100,522);c.lineTo(1138,468);c.lineTo(1176,522);
  c.lineTo(1176,430);c.lineTo(1198,430);c.lineTo(1198,560);c.lineTo(1320,560);c.lineTo(1320,b);c.closePath();}
// the porch, a little nearer than the house
function af_porchShape(c){const b=AF_HOUSE.y;c.moveTo(856,b);c.lineTo(856,580);c.bezierCurveTo(870,556,918,556,932,580);c.lineTo(932,b);c.closePath();}
// tree crowns along the horizon, behind the house: soft round tops [x, y, rx, ry]; their outline is the highest crown at each x
const AF_TREES=[[60,640,120,92],[190,628,110,96],[330,632,120,84],[460,640,96,70],[1300,640,90,66],[1430,624,120,96],[1580,636,110,82],[1720,626,120,96],[1860,640,110,84]];
function af_treeTop(x){let y=AF_HOUSE.y+4;for(const [cx,cy,rx,ry] of AF_TREES){const u=(x-cx)/rx;if(u>-1&&u<1)y=Math.min(y,cy-ry*Math.sqrt(1-u*u));}return y;}
function af_treeRow(c,top){const b=AF_HOUSE.y+4;c.moveTo(-10,b);for(let x=-10;x<=1930;x+=6)c.lineTo(x,af_treeTop(x));if(!top){c.lineTo(1930,b);c.closePath();}}
// a tall conifer, nearer us: tiers that droop, narrowing to the top, its right edges catching the moon (x, y its foot, h its height)
function af_conifer(c,x,y,h,col){const n=9,ice=DP.ice;for(let i=0;i<n;i++){const u=i/(n-1),ty=y-h+u*h*0.92,w=h*(0.05+0.2*u),d=h*0.11;
    c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(x,ty-d*0.6);c.bezierCurveTo(x+w*0.35,ty,x+w*0.8,ty+d*0.55,x+w,ty+d);c.bezierCurveTo(x+w*0.5,ty+d*0.82,x-w*0.5,ty+d*0.82,x-w,ty+d);
    c.bezierCurveTo(x-w*0.8,ty+d*0.55,x-w*0.35,ty,x,ty-d*0.6);c.closePath();c.fill();
    c.strokeStyle=rgba(ice,0.07+0.03*u);c.lineWidth=1.4;c.beginPath();c.moveTo(x+w*0.1,ty-d*0.3);c.bezierCurveTo(x+w*0.4,ty+d*0.05,x+w*0.8,ty+d*0.55,x+w,ty+d);c.stroke();}
  c.fillStyle=rgba(col,1);c.fillRect(x-h*0.012,y-h*0.1,h*0.024,h*0.1);}
AG_PLACES.afPark=c=>{const R=ag_rnd(1939),hz=AF_HOUSE.y,ice=DP.ice;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(4,13,18)");g.addColorStop(0.62,"rgb(9,28,34)");g.addColorStop(1,"rgb(18,48,54)");c.fillStyle=g;c.fillRect(0,0,W,hz+20);
  // the stars of a blacked-out night, and a low moon on the right, haloed
  for(let i=0;i<120;i++){const x=R()*W,y=R()*hz*0.8,r=0.5+R()*1.4;c.fillStyle="rgba(210,240,240,"+(0.08+R()*0.32).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  const mx=1580,my=176;g=c.createRadialGradient(mx,my,0,mx,my,320);g.addColorStop(0,"rgba(170,226,230,0.20)");g.addColorStop(1,"rgba(170,226,230,0)");c.fillStyle=g;c.fillRect(mx-320,my-320,640,640);
  const mc=mkCanvas(80,80),mk2=mc.getContext("2d");mk2.fillStyle="rgb(214,236,232)";mk2.beginPath();mk2.arc(40,40,30,0,TAU);mk2.fill();
  mk2.globalCompositeOperation="destination-out";mk2.beginPath();mk2.arc(28,35,28,0,TAU);mk2.fill();c.drawImage(mc,mx-40,my-40);
  // haze along the horizon
  g=c.createLinearGradient(0,hz-160,0,hz+20);g.addColorStop(0,"rgba(90,170,178,0)");g.addColorStop(1,"rgba(90,170,178,0.10)");c.fillStyle=g;c.fillRect(0,hz-160,W,180);
  // the lawn, its paths running up to the house, and its gloss under the moon
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(14,38,38)");g.addColorStop(1,"rgb(5,17,19)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.save();c.fillStyle="rgba(120,190,190,0.06)";c.beginPath();c.moveTo(860,hz+6);c.bezierCurveTo(880,760,780,880,640,H);c.lineTo(980,H);c.bezierCurveTo(1000,880,940,760,930,hz+6);c.closePath();c.fill();
  c.beginPath();c.moveTo(0,800);c.bezierCurveTo(500,770,700,742,880,724);c.lineTo(900,736);c.bezierCurveTo(700,760,480,800,0,846);c.closePath();c.fill();
  c.beginPath();c.moveTo(W,780);c.bezierCurveTo(1500,752,1200,736,930,722);c.lineTo(920,734);c.bezierCurveTo(1200,752,1480,790,W,830);c.closePath();c.fill();c.restore();
  g=c.createRadialGradient(1500,760,0,1500,760,700);g.addColorStop(0,"rgba(150,215,215,0.07)");g.addColorStop(1,"rgba(150,215,215,0)");c.save();c.translate(1500,760);c.scale(1,0.3);c.translate(-1500,-760);c.fillStyle=g;c.fillRect(800,60,1400,1400);c.restore();
  // trees behind the house, then the house: a dark outline, its edges catching the moon
  c.fillStyle="rgb(7,22,25)";c.beginPath();af_treeRow(c);c.fill();c.strokeStyle=rgba(ice,0.09);c.lineWidth=1.6;c.beginPath();af_treeRow(c,true);c.stroke();
  c.fillStyle="rgb(6,17,20)";c.beginPath();af_houseShape(c);c.fill();
  c.save();c.beginPath();af_houseShape(c);c.clip();
  // windows, blacked out: a little darker than the wall, their frames faint in the moonlight
  for(const [x0,x1,y0,n,rows] of [[556,690,560,3,2],[808,1000,530,4,3],[1012,1170,550,3,2],[1210,1310,586,2,1]])
    for(let r=0;r<rows;r++)for(let i=0;i<n;i++){const ww=(x1-x0)/n*0.42,x=x0+(i+0.5)*(x1-x0)/n-ww/2,y=y0+r*44;c.fillStyle="rgb(3,10,12)";c.fillRect(x,y,ww,28);c.strokeStyle=rgba(ice,0.06);c.lineWidth=1.2;c.strokeRect(x,y,ww,28);}
  const hg=c.createLinearGradient(1320,0,540,0);hg.addColorStop(0,"rgba(150,220,225,0.07)");hg.addColorStop(1,"rgba(150,220,225,0)");c.fillStyle=hg;c.fillRect(540,340,780,320);c.restore();
  c.strokeStyle=rgba(ice,0.26);c.lineWidth=1.6;c.beginPath();af_houseShape(c);c.stroke();
  // the dome's copper, a faint sheen on the side the moon lights
  c.save();c.beginPath();c.moveTo(712,440);c.bezierCurveTo(712,398,736,376,748,370);c.bezierCurveTo(760,376,786,398,786,440);c.closePath();c.clip();
  g=c.createRadialGradient(772,396,2,760,420,52);g.addColorStop(0,"rgba(120,190,170,0.34)");g.addColorStop(1,"rgba(120,190,170,0)");c.fillStyle=g;c.fillRect(700,360,100,90);c.restore();
  c.fillStyle="rgb(6,17,20)";c.beginPath();af_porchShape(c);c.fill();c.strokeStyle=rgba(ice,0.2);c.lineWidth=1.4;c.beginPath();af_porchShape(c);c.stroke();
  // two tall conifers at the edges, nearer us
  af_conifer(c,64,930,470,[5,15,17]);af_conifer(c,1864,920,440,[5,15,17]);
  // the dark of the near lawn
  g=c.createLinearGradient(0,880,0,H);g.addColorStop(0,"rgba(2,8,10,0)");g.addColorStop(1,"rgba(2,8,10,0.55)");c.fillStyle=g;c.fillRect(0,880,W,H-880);};

/* ---------------------------------------------------------------- the huts
   Low wooden huts with felt roofs, in rows that come up as the war goes on: AF_HUTS[row] = [[left x, foot y, size], ...]. Each row is
   painted once (af_hutRow) and drawn with its opacity and a little rise; the windows' lines of light are drawn live, each lit by
   lit(row, hut, window) (0 to 1). */
const AF_HUTS=[
  [[150,702,0.46],[330,700,0.48],[1340,700,0.48],[1520,702,0.46],[1696,700,0.46]],
  [[40,792,0.72],[300,786,0.7],[1250,786,0.72],[1520,792,0.7]],
  [[-60,930,1.02],[1290,920,1.0],[1640,932,1.02]]];
const AF_HUT={w:300,h:66,roof:24,win:6};
function af_hut(c,x,y,s){const w=AF_HUT.w*s,h=AF_HUT.h*s,rf=AF_HUT.roof*s,ov=9*s,ice=DP.ice;
  // the wall's boards, lit a little by the moon from the right
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgb(16,30,31)");g.addColorStop(1,"rgb(28,46,46)");c.fillStyle=g;c.fillRect(x,y-h,w,h);
  c.fillStyle="rgba(0,0,0,0.25)";for(let yy=y-h+7*s;yy<y;yy+=8*s)c.fillRect(x,yy,w,Math.max(1,0.9*s));
  // the windows, blacked out
  for(let i=0;i<AF_HUT.win;i++){const wx=x+(28+i*40)*s,wy=y-h+16*s;c.fillStyle="rgb(4,10,12)";c.fillRect(wx,wy,22*s,28*s);c.strokeStyle="rgba(150,210,210,0.10)";c.lineWidth=Math.max(1,1.2*s);c.strokeRect(wx,wy,22*s,28*s);}
  // the door at the right end
  c.fillStyle="rgb(10,20,22)";c.fillRect(x+w-36*s,y-h+10*s,22*s,h-10*s);
  // the roof: felt, its ridge catching the moon
  c.fillStyle="rgb(9,17,20)";c.beginPath();c.moveTo(x-ov,y-h);c.lineTo(x+w+ov,y-h);c.lineTo(x+w+ov-10*s,y-h-rf);c.lineTo(x-ov+10*s,y-h-rf);c.closePath();c.fill();
  c.fillStyle=rgba(ice,0.22);c.fillRect(x-ov+10*s,y-h-rf,w+2*ov-20*s,Math.max(1,1.6*s));
  c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(x,y-h,w,3*s);
  // its shadow on the lawn
  g=c.createLinearGradient(0,y,0,y+12*s);g.addColorStop(0,"rgba(0,0,0,0.4)");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(x-ov,y,w+2*ov,12*s);}
function af_hutRow(r){return ag_kept("af_huts"+r,W,H,c=>{for(const [x,y,s] of AF_HUTS[r])af_hut(c,x,y,s);});}
// where each window's line of light is: [x, y, w, size] for each hut of a row
function af_hutWins(r,k){const [x,y,s]=AF_HUTS[r][k],h=AF_HUT.h*s,out=[];for(let i=0;i<AF_HUT.win;i++)out.push([x+(28+i*40)*s,y-h+16*s+28*s,22*s,s]);return out;}
// the huts: o.rows (opacity of each row), o.rise (px each row has still to rise), o.lit(r, k, i) the windows' light, o.a
function af_huts(ctx,o){o=o||{};const A=o.rows||[1,1,1];
  for(let r=0;r<AF_HUTS.length;r++){const a=A[r];if(!(a>0.003))continue;const dy=(o.rise?o.rise[r]:0);
    ctx.save();ctx.globalAlpha*=a;if(dy){ctx.beginPath();ctx.rect(0,0,W,AF_HUTS[r][0][1]+14);ctx.clip();}ctx.drawImage(af_hutRow(r),0,dy);ctx.restore();
    for(let k=0;k<AF_HUTS[r].length;k++){af_hutWins(r,k).forEach(([x,y,w,s],i)=>{const L=a*(o.lit?o.lit(r,k,i):1);if(!(L>0.01))return;
      ctx.save();ctx.globalAlpha*=L;ctx.fillStyle=rgba(AF_WARM,1);ctx.fillRect(x+1*s,y+dy-2.6*s,w-2*s,2.2*s);ctx.restore();af_glow(ctx,x+w/2,y+dy-1.5*s,w*1.2,9*s,0.55*L);});}}}

/* ---------------------------------------------------------------- the people crossing the park, small and far off
   A few dark figures walking between the huts, on the paths: [x0, y0, x1, y1, size, phase]; one can be lit for a moment (lit, a
   colour) */
const AF_WALK=[[420,750,640,738,0.62,0],[1250,742,1080,734,0.6,0.4],[300,860,560,820,0.9,0.7],[1500,846,1230,800,0.86,0.2],[760,800,880,760,0.76,0.55],[1080,880,980,800,0.92,0.85]];
function af_walker(ctx,x,y,s,step,col,a,face){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(face<0?-1:1),s);
  const sw=Math.sin(step)*7;ctx.fillStyle=rgba(col,1);
  // legs, a coat to the knee, shoulders, a head
  ctx.beginPath();ctx.moveTo(-3,-22);ctx.lineTo(-4+sw,0);ctx.lineTo(-1+sw,0);ctx.lineTo(1,-20);ctx.lineTo(3-sw,0);ctx.lineTo(6-sw,0);ctx.lineTo(5,-22);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-8,-18);ctx.bezierCurveTo(-9,-34,-8,-48,-5,-52);ctx.bezierCurveTo(-2,-55,4,-55,7,-52);ctx.bezierCurveTo(10,-48,10,-34,9,-18);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.arc(1,-60,6,0,TAU);ctx.fill();ctx.restore();}
function af_walkers(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;
  AF_WALK.forEach(([x0,y0,x1,y1,s,ph],i)=>{const u=((t*0.035+ph)%1),x=lerp(x0,x1,u),y=lerp(y0,y1,u),fa=Math.min(1,u*8,(1-u)*8),lit=o.lit&&o.lit(i)||0;
    af_walker(ctx,x,y,s*1.15,t*5.2+i,mix([4,12,14],DP.F.coral,lit),a*fa,x1<x0?-1:1);if(lit>0.01)dp_halo(ctx,x,y-36*s,60*s,"coral",0.35*lit*a*fa);});}

/* ---------------------------------------------------------------- inside a hut, at night
   A hut's room: boarded walls, a blacked-out window, a door behind the desk, and a desk under a shaded lamp. The recruit sits at the
   desk (AF_DESK.recruit), the desk hiding her below its back edge (cut); the form lies in front of her hand. */
const AF_DESK={back:770,front:868,x0:250,x1:1700,recruit:[560,480,1],form:[600,776,206,60],lamp:[1470,800],door:[120,170,250,600]};
// where the near wrist is, in the place, for a person at x, y, s (flip to face left) in a pose [upper arm, forearm, hand]: the same
// sums as people.js's ag_joints, so a thing put down where the hand will be is where the hand arrives
function af_wrist(x,y,s,flip,spec){const f=AG_FIG.fore,J=AG_FIG.shoulder.near,a1=spec[0]*Math.PI/180,a2=spec[1]*Math.PI/180,
  E=[J[0]+Math.sin(a1)*AG_FIG.L1*f,J[1]+Math.cos(a1)*AG_FIG.L1],Wr=[E[0]+Math.sin(a2)*AG_FIG.L2*f,E[1]+Math.cos(a2)*AG_FIG.L2],A=AG_FIG.anchor;
  return[x+(flip?-1:1)*(Wr[0]-A[0])*s,y+(Wr[1]-A[1])*s];}
const AF_WRITE=[5,95,"hold"];
AG_PLACES.afHut=c=>{const D=AF_DESK,[lx,ly]=D.lamp,R=ag_rnd(1940);
  // the boarded wall, dark green-grey, warmed where the lamp reaches
  let g=c.createLinearGradient(0,0,0,D.back);g.addColorStop(0,"rgb(10,22,24)");g.addColorStop(1,"rgb(18,34,34)");c.fillStyle=g;c.fillRect(0,0,W,D.back);
  for(let x=0;x<W;x+=44){c.fillStyle="rgba(0,0,0,0.22)";c.fillRect(x,0,2,D.back);c.fillStyle="rgba(170,220,215,0.035)";c.fillRect(x+2,0,1.5,D.back);}
  c.fillStyle="rgba(0,0,0,0.3)";c.fillRect(0,D.back-40,W,40);c.fillStyle="rgba(170,220,215,0.05)";c.fillRect(0,D.back-41,W,2);
  // the window, its blackout blind drawn down
  const wx=1180,wy=150,ww=330,wh=330;c.fillStyle="rgb(26,34,34)";c.fillRect(wx-16,wy-16,ww+32,wh+32);c.fillStyle="rgb(6,10,14)";c.fillRect(wx,wy,ww,wh);
  c.fillStyle="rgba(255,255,255,0.03)";for(let y=wy+30;y<wy+wh;y+=34)c.fillRect(wx,y,ww,2);c.fillStyle="rgb(30,40,40)";c.fillRect(wx-24,wy+wh+12,ww+48,12);
  // the door behind the desk, shut; its frame
  const [dx,dy,dw,dh]=D.door;c.fillStyle="rgb(12,20,22)";c.fillRect(dx-14,dy-14,dw+28,dh+14);c.fillStyle="rgb(24,36,36)";c.fillRect(dx,dy,dw,dh);
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=3;c.strokeRect(dx+28,dy+30,dw-56,dh*0.36);c.strokeRect(dx+28,dy+dh*0.46,dw-56,dh*0.44);
  c.fillStyle="rgb(150,128,84)";c.beginPath();c.arc(dx+dw-26,dy+dh*0.48,6,0,TAU);c.fill();
  // the lamp's warm light on the wall, and the room's dark at its edges
  g=c.createRadialGradient(lx,ly-260,0,lx,ly-260,820);g.addColorStop(0,"rgba(255,196,120,0.26)");g.addColorStop(0.5,"rgba(255,170,96,0.07)");g.addColorStop(1,"rgba(255,170,96,0)");
  c.fillStyle=g;c.fillRect(0,0,W,D.back);
  // the floor beyond the desk, at its ends
  c.fillStyle="rgb(9,15,16)";c.fillRect(0,D.back,W,H-D.back);
  // the desk: its top, lit by the lamp, and its front, in the dark
  g=c.createLinearGradient(0,D.back,0,D.front);g.addColorStop(0,"rgb(58,42,30)");g.addColorStop(1,"rgb(78,56,38)");c.fillStyle=g;
  c.beginPath();c.moveTo(D.x0+20,D.back);c.lineTo(D.x1-20,D.back);c.lineTo(D.x1+20,D.front);c.lineTo(D.x0-20,D.front);c.closePath();c.fill();
  c.save();c.clip();g=c.createRadialGradient(lx,D.back+40,0,lx,D.back+40,760);g.addColorStop(0,"rgba(255,200,130,0.45)");g.addColorStop(1,"rgba(255,200,130,0)");c.save();c.translate(lx,D.back+40);c.scale(1,0.22);c.translate(-lx,-D.back-40);
  c.fillStyle=g;c.fillRect(lx-800,D.back+40-800,1600,1600);c.restore();
  c.strokeStyle="rgba(0,0,0,0.16)";c.lineWidth=1.5;for(let i=0;i<14;i++){const y=D.back+6+i*7+R()*3;c.beginPath();c.moveTo(D.x0,y);c.bezierCurveTo(700,y+R()*4-2,1200,y+R()*4-2,D.x1,y);c.stroke();}c.restore();
  c.fillStyle="rgba(255,226,180,0.18)";c.fillRect(D.x0+20,D.back,D.x1-D.x0-40,2);
  g=c.createLinearGradient(0,D.front,0,H);g.addColorStop(0,"rgb(40,28,20)");g.addColorStop(1,"rgb(14,10,8)");c.fillStyle=g;c.fillRect(D.x0-20,D.front,D.x1-D.x0+40,H-D.front);
  c.fillStyle="rgba(255,226,180,0.12)";c.fillRect(D.x0-20,D.front,D.x1-D.x0+40,2);
  // on the desk: a stack of forms, an inkwell, and the lamp, its shade dark, its light falling on the desk
  c.fillStyle="rgb(196,184,160)";for(let i=0;i<5;i++){c.fillStyle=i%2?"rgb(188,176,152)":"rgb(206,194,170)";c.beginPath();c.moveTo(300,806-i*3);c.lineTo(450,806-i*3);c.lineTo(462,838-i*3);c.lineTo(290,838-i*3);c.closePath();c.fill();}
  c.fillStyle="rgb(16,20,24)";c.beginPath();c.ellipse(1010,812,22,8,0,0,TAU);c.fill();c.fillRect(988,790,44,22);c.fillStyle="rgb(36,44,52)";c.beginPath();c.ellipse(1010,790,22,7,0,0,TAU);c.fill();
  c.fillStyle="rgb(30,26,22)";c.beginPath();c.ellipse(lx,ly+6,70,14,0,0,TAU);c.fill();c.fillRect(lx-6,ly-250,12,250);
  c.save();c.translate(lx,ly-250);c.fillStyle="rgb(24,30,28)";c.beginPath();c.moveTo(-30,0);c.lineTo(30,0);c.lineTo(96,96);c.lineTo(-96,96);c.closePath();c.fill();
  c.fillStyle="rgba(255,230,190,0.95)";c.beginPath();c.ellipse(0,96,96,12,0,0,TAU);c.fill();c.restore();
  g=c.createRadialGradient(lx,ly-150,0,lx,ly-150,240);g.addColorStop(0,"rgba(255,214,150,0.36)");g.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=g;c.fillRect(lx-240,ly-390,480,480);};
// the door behind her opening, open 0 to 1: a warm room beyond, the door's leaf swinging in, light on the floor
function af_hutDoor(ctx,open){if(!(open>0.002))return;const [dx,dy,dw,dh]=AF_DESK.door,u=ag_sine(open);
  ctx.save();ctx.beginPath();ctx.rect(dx,dy,dw,dh);ctx.clip();const g=ctx.createLinearGradient(dx,dy,dx+dw,dy+dh);g.addColorStop(0,"rgb(255,214,156)");g.addColorStop(1,"rgb(224,160,96)");
  ctx.globalAlpha*=Math.min(1,u*3);ctx.fillStyle=g;ctx.fillRect(dx,dy,dw,dh);ctx.restore();
  const lw=dw*(1-0.82*u);ctx.fillStyle="rgb(20,30,30)";ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+lw,dy+u*18);ctx.lineTo(dx+lw,dy+dh-u*10);ctx.lineTo(dx,dy+dh);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(AF_WARM,0.35*u);ctx.fillRect(dx+lw-2,dy+u*18,2,dh-u*28);
  af_glow(ctx,dx+dw/2,dy+dh*0.6,dw*1.6,dh*0.9,0.5*u);}
// the declaration on the desk, in perspective: a printed heading, lines of small print (no word of it can be read), a line to sign
// on; sign (0 to 1) writes her name along it, in a loose hand
function af_form(ctx,sign,o){o=o||{};const [x,y,w,h]=AF_DESK.form,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  const sk=14;ctx.fillStyle="rgb(224,214,192)";ctx.beginPath();ctx.moveTo(x+sk,y);ctx.lineTo(x+w-sk,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(x,y+h,w,3);
  ctx.fillStyle="rgb(60,52,44)";ctx.fillRect(x+w*0.22,y+7,w*0.56,5);
  ctx.fillStyle="rgba(80,70,60,0.5)";for(let i=0;i<5;i++){const yy=y+20+i*7,inset=sk*(1-(yy-y)/h);ctx.fillRect(x+inset+16,yy,w-2*inset-32-(i===4?60:0),2);}
  ctx.fillStyle="rgba(60,52,44,0.8)";ctx.fillRect(x+w*0.5,y+h-12,w*0.42,1.6);
  const u=clamp(sign,0,1);if(u>0){ctx.save();ctx.beginPath();ctx.rect(x+w*0.5,y+h-34,w*0.42*u,30);ctx.clip();ctx.strokeStyle="rgb(24,34,72)";ctx.lineWidth=2.2;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();const x0=x+w*0.5+4,y0=y+h-16;ctx.moveTo(x0,y0);for(let i=0;i<=40;i++){const v=i/40,xx=x0+v*w*0.4,yy=y0-6*Math.sin(v*TAU*3.4)-4*Math.sin(v*TAU*1.3)+(v>0.6?2:0);ctx.lineTo(xx,yy);}ctx.stroke();ctx.restore();}
  ctx.restore();}
// a fountain pen, in the place (lying on the desk) or in her hand (in figure space: along the hand, its nib at the fingertips)
function af_pen(ctx,x,y,ang,k){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(k||1,k||1);ctx.fillStyle="rgb(18,20,26)";rr(ctx,-6,-5,104,10,5);ctx.fill();
  ctx.fillStyle="rgb(196,168,96)";ctx.fillRect(56,-5.5,5,11);ctx.fillStyle="rgb(210,190,140)";ctx.beginPath();ctx.moveTo(98,-4);ctx.lineTo(116,0);ctx.lineTo(98,4);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(0,-3.5,90,1.6);ctx.restore();}
// the arm that reaches a wrist (figure space) with the elbow down: [upper arm, forearm] in degrees, as people.js measures them (from
// straight down, towards the way the person faces). Its reach across the frame is drawn shorter (AG_FIG.fore), so the sum is done
// with x divided by it, where the arm's two lengths are true
function af_reach(wx,wy){const f=AG_FIG.fore,J=AG_FIG.shoulder.near,L1=AG_FIG.L1,L2=AG_FIG.L2,tx=(wx-J[0])/f,ty=wy-J[1],d=Math.min(L1+L2-1,Math.hypot(tx,ty)),
  th=Math.atan2(tx,ty),b=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),a1=th-b,ex=Math.sin(a1)*L1,ey=Math.cos(a1)*L1;
  return[a1*180/Math.PI,Math.atan2(tx-ex,ty-ey)*180/Math.PI];}
// her hand as she signs: the pen's nib where the signature has reached (sign 0 to 1), the arm found from it; the nib is about 102 px
// past the wrist, along her fingers
const AF_NIB=[102,7];
function af_nibAt(sign){const [fx,fy,fw,fh]=AF_DESK.form,u=clamp(sign,0,1);return[fx+fw*0.5+4+u*fw*0.4,fy+fh-14-2.5*Math.sin(u*TAU*3.4)];}
function af_signPose(sign){const [x,y,s]=AF_DESK.recruit,[nx,ny]=af_nibAt(sign),A=AG_FIG.anchor,[a1,a2]=af_reach((nx-x)/s+A[0]-AF_NIB[0],(ny-y)/s+A[1]-AF_NIB[1]);
  return{near:[a1,a2,"hold"]};}
// the pen in her hand, in figure space: across her fingertips, its nib on the paper
function af_penHeld(c,h){const E=h.nearElbow,Wr=h.near,dx=Wr[0]-E[0],dy=Wr[1]-E[1],L=Math.hypot(dx,dy)||1,fx=Wr[0]+dx/L*94,fy=Wr[1]+dy/L*94;
  af_penAt(c,[fx-34,fy-60],[fx+8,fy+16]);}
function af_penAt(c,top,nib){const a=Math.atan2(nib[1]-top[1],nib[0]-top[0]),L=Math.hypot(nib[0]-top[0],nib[1]-top[1]);af_pen(c,top[0],top[1],a,L/116);}

/* ---------------------------------------------------------------- the sea chart
   The North Atlantic on a pane of frosted glass in a dark room, drawn in light: its coasts, a grid, nothing written. A convoy (small pale
   hulls) crosses from Newfoundland towards the North Channel; the submarines are dark shapes in its way. Steered by what was read,
   its route (a dotted green line) bends round them; if the codes changed, the route would go dark, and the convoy would hold its course
   towards them. Nothing more is shown: nothing sinks. */
const AF_SEA={x0:150,y0:96,x1:1770,y1:860};
// the land: Natural Earth's coasts (public domain, 1:50m, via the world-atlas package), drawn once on a Mercator chart from 66 W to 4 E
// and from about 48 N to 65.5 N, simplified to a pixel and a half; each ring "x,y x,y ...", the rings split by ";"
const AF_LAND="247,813 237,814 218,809 206,803 201,795 186,787 185,785 193,783 223,792 247,807 250,812;263,921 269,920 265,923 266,925 264,928 264,929 272,928 278,921 272,921 276,917 277,913 282,909 284,913 292,914 290,919 293,921 280,931 273,933 259,934 255,929 254,921 256,914 269,893 276,886 279,886 281,895 277,910 276,914;201,904 204,901 216,905 239,903 242,905 230,913 230,919 232,919 230,920 224,920 222,917 219,917 222,915 218,912 220,909 213,913 216,913 214,914 205,912 201,907 202,906 194,905 193,899 187,898 188,894 196,884 197,889 194,893 199,898 198,902;1605,442 1605,447 1603,451 1585,467 1584,471 1588,473 1582,483 1599,477 1607,479 1629,478 1634,482 1636,488 1631,497 1625,514 1617,526 1601,535 1611,533 1616,537 1616,539 1613,541 1608,542 1600,549 1590,546 1594,549 1607,552 1612,549 1617,549 1628,554 1639,568 1649,603 1662,611 1675,626 1673,630 1680,646 1671,641 1662,641 1671,643 1684,656 1686,663 1678,673 1684,677 1690,671 1702,671 1709,674 1716,679 1718,690 1714,703 1710,708 1706,709 1707,713 1705,715 1700,715 1695,718 1698,719 1698,723 1687,727 1690,727 1693,730 1698,731 1710,731 1710,738 1702,743 1700,747 1695,747 1682,753 1673,751 1659,753 1645,748 1647,751 1642,754 1630,755 1632,758 1630,759 1623,758 1621,759 1613,755 1608,755 1599,758 1592,772 1590,773 1580,767 1568,771 1561,775 1559,780 1556,780 1552,777 1547,779 1546,776 1554,772 1564,762 1571,753 1573,746 1578,744 1580,738 1588,736 1605,737 1621,717 1601,730 1595,729 1587,723 1579,724 1583,720 1576,717 1571,717 1564,721 1558,717 1556,712 1557,709 1580,697 1585,687 1583,684 1582,673 1569,677 1579,664 1589,658 1598,656 1606,659 1604,654 1606,653 1610,658 1614,657 1610,656 1606,650 1610,641 1607,639 1607,634 1610,632 1612,625 1611,624 1604,626 1595,612 1594,608 1597,600 1602,594 1607,593 1595,593 1586,600 1582,600 1579,597 1573,600 1566,597 1564,603 1561,600 1558,591 1560,591 1569,570 1564,562 1565,555 1566,552 1571,552 1565,548 1566,543 1563,549 1556,555 1557,547 1560,542 1552,550 1553,557 1549,575 1547,577 1545,577 1546,565 1550,558 1547,558 1548,548 1553,528 1557,518 1547,528 1542,526 1539,521 1536,520 1545,514 1542,512 1548,504 1549,498 1543,489 1548,484 1546,483 1544,479 1548,470 1558,470 1552,462 1554,454 1561,453 1560,448 1561,440 1566,440 1568,442 1573,440 1575,442 1602,436 1607,437;1511,588 1515,587 1517,583 1528,581 1536,582 1545,598 1541,605 1548,604 1551,611 1550,613 1546,609 1546,615 1549,616 1548,620 1543,621 1538,629 1534,627 1535,630 1531,631 1535,647 1538,672 1534,687 1528,694 1531,698 1526,700 1521,700 1518,701 1516,698 1515,701 1503,704 1501,708 1491,714 1483,712 1484,717 1473,723 1462,726 1458,725 1450,727 1457,719 1443,722 1455,712 1444,716 1438,715 1437,712 1448,703 1437,702 1438,700 1443,697 1451,698 1448,692 1455,687 1474,682 1469,679 1465,683 1456,683 1448,686 1457,678 1460,673 1458,671 1462,666 1471,661 1466,660 1457,660 1455,657 1449,656 1451,654 1444,654 1443,648 1452,646 1448,644 1448,641 1456,638 1456,635 1448,636 1449,627 1448,628 1447,623 1444,624 1444,622 1446,620 1456,618 1462,619 1466,622 1469,619 1480,621 1478,617 1487,610 1489,605 1482,606 1475,603 1484,595 1483,590 1486,585 1498,583 1498,581 1500,580 1503,586 1500,592 1504,589 1503,581 1508,579 1507,576 1508,576 1516,581 1511,585;57,-51 57,120 1863,121 1863,985 1646,985 1649,967 1652,963 1651,960 1649,963 1652,935 1658,940 1661,949 1665,952 1659,937 1650,929 1649,927 1654,928 1651,909 1645,908 1636,902 1629,890 1631,885 1627,880 1629,877 1637,878 1632,875 1619,875 1619,873 1621,870 1618,868 1613,868 1613,864 1606,865 1604,862 1598,862 1587,857 1578,858 1575,853 1569,850 1577,846 1571,842 1579,841 1576,839 1568,839 1567,836 1568,833 1573,830 1583,827 1591,827 1597,823 1603,822 1608,824 1615,833 1621,829 1629,829 1631,831 1633,827 1635,830 1646,829 1641,824 1641,810 1635,799 1634,792 1648,793 1651,803 1674,806 1687,801 1680,799 1682,792 1692,786 1706,781 1710,778 1714,772 1714,754 1718,747 1734,742 1757,730 1767,732 1775,730 1770,728 1766,730 1760,728 1757,725 1764,723 1773,728 1776,727 1770,723 1774,722 1769,715 1781,696 1788,672 1791,673 1795,671 1801,666 1805,659 1818,654 1835,652 1839,657 1844,659 1841,655 1844,644 1863,643 1863,459 1850,464 1840,464 1837,458 1835,458 1833,462 1829,459 1832,455 1832,453 1825,453 1818,448 1807,437 1805,433 1807,420 1819,426 1825,420 1819,423 1814,416 1815,407 1826,395 1806,407 1802,413 1797,413 1796,410 1800,391 1804,388 1811,391 1813,387 1821,383 1812,384 1810,381 1818,371 1820,364 1828,356 1830,358 1828,368 1833,355 1839,351 1824,355 1820,359 1813,372 1809,374 1805,383 1797,392 1796,383 1798,371 1805,372 1809,369 1800,365 1796,354 1808,343 1799,348 1794,342 1793,335 1793,326 1795,324 1805,325 1816,322 1826,324 1834,321 1839,325 1840,330 1840,324 1853,318 1849,317 1847,313 1850,307 1847,310 1846,319 1838,320 1832,318 1830,314 1828,320 1825,321 1818,320 1801,323 1794,316 1793,310 1793,307 1801,305 1793,297 1791,289 1793,284 1804,285 1817,290 1827,289 1833,286 1819,287 1804,282 1799,283 1795,278 1796,271 1799,270 1801,272 1806,264 1814,259 1818,262 1830,259 1832,256 1819,259 1819,257 1824,249 1839,248 1853,252 1855,250 1852,249 1852,246 1863,243 1863,241 1849,244 1845,242 1833,243 1840,231 1848,228 1853,224 1863,224 1863,-51;1318,55 1325,53 1334,46 1340,46 1332,52 1328,61 1330,64 1333,66 1335,64 1337,67 1337,74 1334,81 1344,80 1346,86 1342,92 1350,88 1355,89 1358,94 1361,93 1362,95 1361,102 1358,104 1361,108 1362,111 1359,113 1363,116 1363,120 1361,123 1357,124 1357,131 1352,138 1350,139 1345,138 1345,141 1343,143 1343,149 1339,155 1330,162 1324,162 1311,168 1292,185 1265,192 1262,202 1259,204 1255,202 1256,205 1246,208 1210,201 1203,194 1204,191 1206,190 1205,188 1199,191 1198,188 1188,183 1189,181 1188,180 1181,185 1153,186 1151,176 1152,173 1157,178 1167,174 1176,159 1181,157 1176,156 1167,161 1171,157 1168,155 1169,150 1178,144 1176,143 1170,147 1165,149 1161,144 1163,138 1158,135 1137,133 1126,138 1121,131 1124,128 1137,126 1141,124 1143,126 1150,121 1171,121 1173,113 1167,117 1157,113 1172,99 1168,96 1161,97 1159,94 1153,92 1150,93 1147,92 1124,101 1111,95 1116,90 1125,94 1122,89 1120,81 1124,81 1131,86 1139,82 1129,80 1126,76 1128,74 1133,75 1127,67 1128,64 1135,66 1131,62 1135,58 1144,63 1145,69 1149,69 1152,66 1153,66 1154,75 1158,73 1158,64 1146,56 1148,53 1157,53 1152,48 1142,48 1146,43 1158,43 1182,66 1179,70 1184,74 1183,82 1181,85 1176,83 1181,88 1181,91 1183,92 1181,97 1186,100 1188,109 1193,92 1196,88 1199,87 1204,92 1206,84 1206,66 1210,62 1214,65 1223,79 1226,81 1229,63 1241,57 1254,74 1258,83 1259,77 1254,62 1254,59 1263,60 1271,70 1280,56 1288,61 1296,57 1297,52 1295,42 1301,38 1307,38 1314,47 1314,51;1575,623 1571,628 1567,628 1569,622 1575,614 1577,620;1544,536 1531,538 1534,535 1535,529 1531,527 1532,524 1536,523 1540,528 1544,529;1536,553 1537,562 1532,566 1532,559 1527,562 1528,558;1647,350 1648,353 1649,352 1651,355 1653,354 1647,381 1646,379 1648,368 1647,366 1643,367 1639,362 1646,359 1644,353 1641,352 1646,346 1647,347;1580,657 1584,658 1583,659 1576,664 1572,659 1572,655 1578,653;1607,419 1612,421 1613,425 1603,424 1602,420 1600,422 1600,418 1602,414 1607,416;1524,268 1523,275 1519,273 1522,282 1515,275 1511,265 1516,264;1534,449 1531,457 1526,461 1529,462 1529,464 1515,475 1514,473 1519,468 1514,465 1516,463 1513,461 1513,457 1515,455 1518,457 1522,457 1521,452 1533,443;1535,486 1535,494 1546,497 1540,506 1538,506 1538,499 1531,499 1528,494 1523,492 1521,489 1525,486 1524,484 1530,482 1530,479 1533,480;607,338 604,344 595,338 608,331;57,-51 143,-51 138,-42 141,-40 147,-51 151,-51 151,-48 153,-46 157,-50 160,-50 162,-47 161,-36 164,-31 164,-43 170,-51 176,-51 173,-44 173,-38 177,-37 182,-41 193,-28 196,-30 200,-24 194,-20 196,-11 180,-11 188,-8 188,-6 200,-6 200,-9 206,-13 212,-10 219,-4 216,-1 213,8 203,20 220,13 225,14 226,12 234,15 240,7 243,9 259,30 259,33 254,36 245,29 240,31 251,39 252,44 253,46 246,50 239,48 234,44 230,45 233,50 230,55 243,66 237,68 229,66 234,77 228,83 227,88 220,89 216,87 209,76 210,84 204,87 212,89 211,111 205,128 199,118 195,117 193,120 188,114 190,102 183,117 181,114 171,98 164,81 169,71 177,67 186,50 181,51 173,63 164,68 154,68 153,67 153,63 158,56 151,61 149,60 139,52 132,36 127,32 128,36 125,38 120,35 122,43 122,50 120,50 110,42 107,40 106,41 111,52 123,66 119,72 114,72 108,70 93,54 86,56 93,58 99,63 98,71 99,75 107,81 105,92 114,88 118,91 120,97 124,99 119,104 125,110 128,119 131,120 134,134 135,124 145,132 143,136 145,139 151,130 155,132 161,140 163,139 167,144 161,150 169,150 171,154 168,161 160,162 165,165 170,173 169,176 181,176 180,180 178,182 183,183 187,193 183,194 184,216 181,217 175,198 169,190 173,212 172,217 181,233 176,235 169,233 172,244 171,248 160,236 156,233 154,234 145,224 145,230 140,228 135,216 135,225 133,225 126,213 123,214 121,212 106,191 109,208 92,192 84,190 83,193 85,199 100,220 111,224 110,229 118,234 127,244 135,249 143,264 150,269 147,274 149,284 144,286 117,272 91,267 78,258 67,241 57,241;57,985 57,335 64,332 68,325 71,334 66,343 63,352 66,369 62,374 57,374 57,377 62,377 66,383 67,390 65,398 65,405 71,405 72,408 70,412 71,417 68,426 66,429 62,423 60,427 57,429 57,432 62,434 74,426 88,425 94,430 98,443 96,455 93,461 82,466 80,469 94,463 100,447 103,443 106,452 102,459 109,447 111,465 114,455 126,446 133,443 142,430 144,431 148,436 150,446 152,440 149,429 153,427 152,424 154,422 157,422 156,419 161,420 164,418 158,415 157,411 159,411 161,405 164,406 162,399 165,399 172,403 164,396 162,391 163,385 166,383 172,385 169,383 169,379 177,360 185,362 187,367 178,374 190,372 192,376 191,387 195,383 202,397 197,402 198,403 201,405 201,408 205,405 207,406 210,412 204,417 197,418 201,419 214,417 212,419 214,424 213,426 218,426 222,435 210,445 207,450 215,444 216,447 229,443 224,456 213,464 224,459 231,458 236,466 244,469 245,471 243,475 243,482 235,487 231,487 244,490 246,492 243,497 246,500 251,500 258,507 257,521 253,522 241,521 234,518 236,515 231,516 249,528 242,531 244,532 256,535 249,538 249,540 257,541 259,548 255,550 261,552 264,555 266,556 270,552 272,552 276,561 278,558 281,559 279,564 284,571 275,588 284,581 294,578 296,583 302,584 293,598 306,583 312,585 317,597 326,600 330,598 331,596 336,596 339,602 349,607 342,615 332,617 325,622 321,629 314,629 301,637 293,637 288,641 286,646 280,644 287,651 282,654 283,656 281,659 285,658 293,650 305,645 320,631 337,627 328,626 328,623 331,622 349,624 355,639 346,646 349,647 351,651 362,641 369,640 373,645 379,647 382,651 386,661 384,669 386,683 374,687 387,690 388,691 387,694 381,693 389,700 381,710 359,728 348,727 341,729 335,733 323,734 308,753 293,766 292,770 287,772 270,772 249,777 244,773 226,770 216,770 214,772 200,770 192,771 167,769 155,772 151,770 147,774 139,773 128,781 118,804 97,810 99,811 91,815 82,823 68,843 63,845 57,842 57,844 63,848 57,861 57,869 70,853 81,842 98,830 114,822 146,809 161,807 177,810 183,813 191,821 191,823 184,822 191,828 188,837 182,839 177,845 167,851 162,851 152,845 148,848 140,847 134,851 142,850 153,855 159,863 173,857 172,859 176,859 180,861 177,866 175,873 166,882 169,884 177,884 175,890 177,896 179,897 181,908 184,911 198,914 200,916 195,919 203,924 208,924 213,928 226,928 225,931 231,932 244,924 248,931 254,930 258,934 259,938 255,940 263,941 265,943 212,964 205,963 207,967 205,969 200,968 196,964 194,969 192,966 190,967 188,971 190,974 180,985 146,985 148,973 153,967 147,970 152,965 161,961 156,962 158,960 175,949 186,944 186,941 189,942 188,948 193,952 192,948 194,945 211,941 182,939 179,942 176,941 177,937 189,925 185,926 182,921 183,926 178,931 153,945 147,942 149,939 146,942 148,944 140,949 138,948 130,950 129,948 124,947 124,956 127,958 122,963 118,962 114,964 113,966 107,966 106,970 102,973 100,969 95,971 93,969 91,977 85,974 87,971 85,970 86,966 81,971 79,982 76,985;177,252 186,253 187,255 185,259 181,260 175,259 174,257 177,255;98,364 95,363 95,360 102,347 106,350 108,354 105,359;177,310 164,301 163,297 170,295 178,296 181,299 180,305;394,725 391,730 381,732 381,737 386,739 386,743 365,779 362,789 362,795 377,777 379,779 378,783 383,780 387,782 393,782 391,785 378,795 384,793 384,796 379,801 386,798 389,801 396,799 397,803 399,799 400,802 396,814 400,808 404,806 405,807 416,798 417,805 420,802 429,801 436,805 438,812 431,819 424,824 431,823 428,827 434,829 432,833 425,838 436,834 438,835 441,832 450,829 448,838 437,844 438,849 431,851 436,851 431,859 432,863 435,864 444,852 453,847 454,848 447,861 447,868 448,870 452,867 456,860 458,860 459,867 453,882 452,892 448,897 443,895 437,898 437,881 427,891 425,892 424,890 431,871 428,860 423,856 416,872 415,873 417,867 413,872 408,873 397,889 386,890 383,888 383,885 393,880 400,871 408,866 410,863 406,865 396,863 395,869 391,870 385,868 379,869 385,866 385,858 381,860 379,859 375,863 364,867 327,863 327,861 321,864 309,866 305,861 304,855 306,852 328,833 308,833 308,832 316,826 314,829 319,831 326,814 335,817 333,814 336,809 331,808 330,803 335,797 340,799 337,792 348,763 351,759 354,759 351,756 357,750 357,744 362,740 366,732 381,724 389,727 389,723 393,723;933,-51 928,-44 910,-28 906,-17 902,-13 901,-6 888,26 884,32 881,32 876,43 863,54 858,53 847,43 853,60 835,77 835,70 832,67 829,80 823,80 820,75 816,80 814,80 812,87 804,91 799,89 798,84 803,76 803,69 815,50 802,46 794,46 804,53 799,60 795,73 786,67 788,72 793,77 793,84 783,89 748,93 747,95 762,105 753,116 746,121 736,118 731,119 727,118 729,131 737,128 748,152 741,159 736,160 736,163 734,166 715,162 728,171 733,169 737,170 737,181 739,192 734,197 734,202 727,203 727,208 725,211 726,215 720,226 709,226 701,219 703,223 714,231 714,234 708,243 704,245 684,243 695,250 702,251 698,272 702,279 703,286 700,291 693,291 692,293 698,295 697,298 691,325 689,339 681,351 674,351 664,347 661,348 675,354 679,359 679,372 675,378 668,378 660,374 667,381 661,383 656,383 658,378 650,380 649,374 654,367 654,362 645,374 627,365 627,358 637,354 642,344 634,351 627,354 612,346 610,339 616,323 616,317 613,323 599,330 593,337 585,338 579,335 571,336 573,341 571,341 562,339 562,335 572,328 558,328 557,319 553,316 545,315 542,303 537,299 539,295 536,292 535,285 543,277 547,275 541,274 535,279 529,279 528,272 531,268 522,263 513,256 514,251 513,243 525,227 518,230 511,238 509,232 503,227 497,216 485,190 487,182 484,177 504,169 512,168 514,166 509,166 510,161 495,169 484,172 481,167 488,153 492,147 501,148 501,143 509,140 512,141 517,151 520,154 517,140 513,136 508,136 498,113 504,135 502,137 492,144 494,135 491,137 478,165 476,166 473,159 472,141 468,115 464,112 462,106 470,99 483,84 495,82 495,81 488,80 480,83 466,98 461,98 456,91 451,92 446,91 445,81 448,69 445,69 442,65 443,64 473,39 476,32 485,26 492,17 488,18 478,28 450,56 438,60 437,59 436,44 441,30 448,24 450,20 463,19 465,17 461,15 441,14 435,11 430,2 432,-15 452,-32 462,-36 476,-30 482,-29 487,-30 493,-28 504,-21 506,-22 493,-32 493,-34 500,-37 498,-39 479,-35 466,-41 451,-36 441,-25 437,-22 434,-23 437,-41 443,-51";
let AF_RINGS=null;function af_rings(){return AF_RINGS||(AF_RINGS=AF_LAND.split(";").map(r=>r.split(" ").map(q=>q.split(",").map(Number))));}
AG_PLACES.afSea=c=>{const S=AF_SEA,ice=DP.ice;
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(6,17,21)");g.addColorStop(1,"rgb(10,28,32)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the pane: frosted glass, its sea a little lighter, its edges catching the light
  c.save();c.shadowColor="rgba(92,226,245,0.18)";c.shadowBlur=60;c.fillStyle="rgb(12,34,40)";c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);c.restore();
  c.save();c.beginPath();c.rect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);c.clip();
  g=c.createRadialGradient(960,420,40,960,480,1000);g.addColorStop(0,"rgba(110,190,200,0.16)");g.addColorStop(1,"rgba(110,190,200,0.03)");c.fillStyle=g;c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);
  // the grid, every 10 degrees of longitude and every 5 of latitude
  c.strokeStyle="rgba(170,230,235,0.08)";c.lineWidth=1.2;const k=(S.x1-S.x0)/(70*Math.PI/180),merc=la=>Math.log(Math.tan(Math.PI/4+la*Math.PI/360)),yt=merc(65.5);
  for(let lo=-60;lo<=0;lo+=10){const x=S.x0+(lo+66)*Math.PI/180*k;c.beginPath();c.moveTo(x,S.y0);c.lineTo(x,S.y1);c.stroke();}
  for(let la=50;la<=60;la+=5){const y=S.y0+(yt-merc(la))*k;c.beginPath();c.moveTo(S.x0,y);c.lineTo(S.x1,y);c.stroke();}
  // the land, a little paler than the sea, its coast in a fine line of light
  c.beginPath();for(const r of af_rings()){c.moveTo(r[0][0],r[0][1]);for(let i=1;i<r.length;i++)c.lineTo(r[i][0],r[i][1]);c.closePath();}
  c.fillStyle="rgba(150,210,214,0.13)";c.fill("evenodd");c.strokeStyle=rgba(ice,0.55);c.lineWidth=1.6;c.lineJoin="round";c.stroke();
  // the glass's sheen
  g=c.createLinearGradient(S.x0,S.y0,S.x1,S.y1);g.addColorStop(0,"rgba(230,250,250,0.07)");g.addColorStop(0.4,"rgba(230,250,250,0)");g.addColorStop(0.55,"rgba(230,250,250,0.03)");g.addColorStop(1,"rgba(230,250,250,0)");
  c.fillStyle=g;c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);c.restore();
  c.strokeStyle=rgba(ice,0.55);c.lineWidth=2;c.strokeRect(S.x0+1,S.y0+1,S.x1-S.x0-2,S.y1-S.y0-2);
  c.fillStyle=rgba(ice,0.5);c.fillRect(S.x0,S.y0,S.x1-S.x0,2);};
// the routes, from off Newfoundland to the North Channel, on the chart: the steered one bends north of the submarines; the straight
// one runs through them. The submarines, where they wait
const AF_SUBS=[[867,574],[923,638],[983,583],[891,685],[1029,646]];
const AF_ROUTE={steer:[[520,831],[659,685],[821,482],[1029,402],[1261,438],[1423,516],[1525,566]],straight:[[520,831],[729,722],[937,631],[1168,566],[1377,554],[1525,566]]};
function af_routePath(k){const R=AF_ROUTE[k],pts=[P(R[0][0],R[0][1])];for(let i=1;i<R.length;i++)for(let j=1;j<=12;j++)pts.push(P(lerp(R[i-1][0],R[i][0],j/12),lerp(R[i-1][1],R[i][1],j/12)));return mk(pts);}
let AF_RT=null;function af_routes(){return AF_RT||(AF_RT={straight:af_smooth(af_routePath("straight")),steer:af_smooth(af_routePath("steer"))});}
// a path's corners rounded: each point averaged with its neighbours, a few times
function af_smooth(p){let pts=p.pts;for(let k=0;k<8;k++)pts=pts.map((q,i)=>i===0||i===pts.length-1?q:P((pts[i-1].x+q.x*2+pts[i+1].x)/4,(pts[i-1].y+q.y*2+pts[i+1].y)/4));return mk(pts);}
// a dotted route, drawn on to u (0 to 1), in its colour, at opacity a
function af_route(ctx,path,u,col,a){if(!(a>0.003)||u<=0)return;const c=dp_f(col);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;
  for(let d=0;d<=path.total*u;d+=22){const q=at(path,d/path.total);ctx.beginPath();ctx.arc(q.x,q.y,4.2,0,TAU);ctx.fill();}ctx.restore();}
// the convoy: a cluster of small pale hulls, around a point on a route, heading along it
const AF_SHIPS=[[0,0],[-34,-16],[-34,16],[-68,0],[-68,-32],[-68,32],[-102,-16],[-102,16],[-136,0],[30,-24],[30,24]];
function af_hull(ctx,x,y,a,len,col){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(len/2,0);ctx.quadraticCurveTo(len*0.28,-len*0.16,-len/2,-len*0.13);
  ctx.lineTo(-len/2,len*0.13);ctx.quadraticCurveTo(len*0.28,len*0.16,len/2,0);ctx.closePath();ctx.fill();ctx.restore();}
function af_convoy(ctx,path,u,a,t){af_convoyAt(ctx,at(path,u),a);}
// the convoy at a point q {x, y, a}: between two routes, a blend of where each would have it (af_between)
function af_convoyAt(ctx,q,a){if(!(a>0.003))return;const ca=Math.cos(q.a),sa=Math.sin(q.a);ctx.save();ctx.globalAlpha*=a;
  for(const [dx,dy] of AF_SHIPS){const x=q.x+dx*ca-dy*sa,y=q.y+dx*sa+dy*ca;ctx.save();ctx.globalAlpha*=0.5;af_hull(ctx,x-3*ca,y-3*sa,q.a,30,"rgba(170,230,235,0.25)");ctx.restore();
    af_hull(ctx,x,y,q.a,22,"rgb(226,242,240)");}
  ctx.restore();}
function af_between(p1,p2,u,m){const a=at(p1,u),b=at(p2,u);let d=b.a-a.a;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return{x:lerp(a.x,b.x,m),y:lerp(a.y,b.y,m),a:a.a+d*m};}
// the submarines: dark low shapes with a small tower, waiting; their wake a faint line
function af_subs(ctx,a,t){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;AF_SUBS.forEach(([x,y],i)=>{const dx=Math.sin(t*0.3+i)*4,ang=0.3+i*0.5;
  ctx.save();ctx.translate(x+dx,y);ctx.rotate(ang);ctx.fillStyle="rgb(4,10,12)";ctx.strokeStyle="rgba(170,230,235,0.35)";ctx.lineWidth=1.4;
  ctx.beginPath();ctx.ellipse(0,0,26,6,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillRect(-4,-9,9,6);ctx.restore();});ctx.restore();}

/* ---------------------------------------------------------------- a commander's desk, 1943
   A panelled room at night, a chart on the wall under glass, a desk with a lamp. The officer stands at the desk's near end; the
   commander sits behind it (cut at its back edge). The sheet, "Most secret", is in one place at a time: in the officer's hand, on the
   desk under the commander's hand, back in the officer's hand, then gone. */
const AF_OFFICE={back:792,front:880,x0:930,x1:1830,officer:[820,590,1],commander:[1340,520,0.96],sheet:[1092,836],lamp:[1730,808]};
AG_PLACES.afDesk=c=>{const D=AF_OFFICE,[lx,ly]=D.lamp;
  // the panelled wall, dark wood, warmed near the lamp
  let g=c.createLinearGradient(0,0,0,D.back);g.addColorStop(0,"rgb(14,20,22)");g.addColorStop(1,"rgb(26,28,28)");c.fillStyle=g;c.fillRect(0,0,W,D.back);
  for(let x=-40;x<W;x+=240){c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(x,0,6,D.back);c.strokeStyle="rgba(255,220,170,0.05)";c.lineWidth=2;c.strokeRect(x+34,120,172,300);c.strokeRect(x+34,470,172,250);}
  // a chart on the wall, under glass, too far to read
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=20;c.fillStyle="rgb(20,40,44)";c.fillRect(980,120,560,330);c.restore();
  c.save();c.beginPath();c.rect(980,120,560,330);c.clip();c.strokeStyle="rgba(170,230,235,0.10)";c.lineWidth=1;for(let x=1000;x<1540;x+=60){c.beginPath();c.moveTo(x,120);c.lineTo(x,450);c.stroke();}
  for(let y=140;y<450;y+=55){c.beginPath();c.moveTo(980,y);c.lineTo(1540,y);c.stroke();}
  c.save();c.translate(980,120);c.scale(560/1620,330/764);c.translate(-150,-96);c.beginPath();for(const r of af_rings()){c.moveTo(r[0][0],r[0][1]);for(let i=1;i<r.length;i++)c.lineTo(r[i][0],r[i][1]);c.closePath();}
  c.restore();c.fillStyle="rgba(150,210,214,0.14)";c.fill("evenodd");c.strokeStyle="rgba(190,245,245,0.32)";c.lineWidth=1.2;c.stroke();
  g=c.createLinearGradient(980,120,1540,450);g.addColorStop(0,"rgba(230,250,250,0.08)");g.addColorStop(0.5,"rgba(230,250,250,0)");c.fillStyle=g;c.fillRect(980,120,560,330);c.restore();
  c.strokeStyle="rgba(150,120,80,0.6)";c.lineWidth=6;c.strokeRect(977,117,566,336);
  // the lamp's warmth on the wall and the room's dark edges
  g=c.createRadialGradient(lx,ly-300,0,lx,ly-300,900);g.addColorStop(0,"rgba(255,196,120,0.22)");g.addColorStop(0.55,"rgba(255,170,96,0.05)");g.addColorStop(1,"rgba(255,170,96,0)");c.fillStyle=g;c.fillRect(0,0,W,D.back);
  g=c.createRadialGradient(700,300,0,700,300,700);g.addColorStop(0,"rgba(255,206,150,0.07)");g.addColorStop(1,"rgba(255,206,150,0)");c.fillStyle=g;c.fillRect(0,0,W,D.back);
  c.fillStyle="rgb(10,13,14)";c.fillRect(0,D.back,W,H-D.back);
  // the desk: its top, lit by the lamp, and its front
  g=c.createLinearGradient(0,D.back,0,D.front);g.addColorStop(0,"rgb(52,36,26)");g.addColorStop(1,"rgb(70,48,32)");c.fillStyle=g;
  c.beginPath();c.moveTo(D.x0+20,D.back);c.lineTo(D.x1-10,D.back);c.lineTo(D.x1+20,D.front);c.lineTo(D.x0-20,D.front);c.closePath();c.fill();
  c.save();c.clip();g=c.createRadialGradient(lx,D.back+40,0,lx,D.back+40,760);g.addColorStop(0,"rgba(255,200,130,0.42)");g.addColorStop(1,"rgba(255,200,130,0)");c.save();c.translate(lx,D.back+40);c.scale(1,0.22);c.translate(-lx,-D.back-40);
  c.fillStyle=g;c.fillRect(lx-800,D.back+40-800,1600,1600);c.restore();c.restore();
  c.fillStyle="rgba(255,226,180,0.16)";c.fillRect(D.x0+20,D.back,D.x1-D.x0-30,2);
  g=c.createLinearGradient(0,D.front,0,H);g.addColorStop(0,"rgb(36,25,18)");g.addColorStop(1,"rgb(12,9,7)");c.fillStyle=g;c.fillRect(D.x0-20,D.front,D.x1-D.x0+40,H-D.front);
  c.fillStyle="rgba(255,226,180,0.10)";c.fillRect(D.x0-20,D.front,D.x1-D.x0+40,2);
  // the lamp: its dark shade, its light on the desk
  c.fillStyle="rgb(28,24,20)";c.beginPath();c.ellipse(lx,ly+6,62,12,0,0,TAU);c.fill();c.fillRect(lx-6,ly-230,12,230);
  c.save();c.translate(lx,ly-230);c.fillStyle="rgb(24,30,28)";c.beginPath();c.moveTo(-28,0);c.lineTo(28,0);c.lineTo(88,88);c.lineTo(-88,88);c.closePath();c.fill();
  c.fillStyle="rgba(255,230,190,0.95)";c.beginPath();c.ellipse(0,88,88,11,0,0,TAU);c.fill();c.restore();
  g=c.createRadialGradient(lx,ly-140,0,lx,ly-140,230);g.addColorStop(0,"rgba(255,214,150,0.34)");g.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=g;c.fillRect(lx-230,ly-370,460,460);};
// the sheet, "Most secret", held up facing us (figure space: its middle at cx, cy), or lying on the desk in the place (af_sheetDown)
function af_sheet(ctx,cx,cy,o){o=o||{};const w=228,h=300,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.translate(cx,cy);ctx.rotate(o.rot||-0.06);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;ctx.fillStyle="rgb(232,224,204)";ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ctx.fillStyle="rgba(120,90,60,0.12)";ctx.fillRect(-w/2,-h/2,w,h);
  dp_T(ctx,"MOST SECRET",0,-h/2+46,{w:800,size:30,align:"center",col:[150,34,30],ls:1,deco:o.deco?1:0});
  ctx.fillStyle="rgba(60,52,44,0.42)";for(let i=0;i<8;i++)ctx.fillRect(-w/2+26,-h/2+82+i*22,w-52-(i===7?70:i%3*18),3);
  if(o.burn>0)af_burn(ctx,0,h/2-20,w,o.burn);
  ctx.restore();}
// a small coral glow where the sheet is destroyed (u 0 to 1), at its foot
function af_burn(ctx,x,y,w,u){const c=DP.F.coral;ctx.save();ctx.globalCompositeOperation="lighter";const r=w*0.7*ag_eo(u),g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(c,0.7*(1-u*0.5)));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}
function af_sheetDown(ctx,a){if(!(a>0.003))return;const [x,y]=AF_OFFICE.sheet;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgb(222,214,194)";
  ctx.beginPath();ctx.moveTo(x-58,y-22);ctx.lineTo(x+58,y-22);ctx.lineTo(x+72,y+24);ctx.lineTo(x-72,y+24);ctx.closePath();ctx.fill();ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(x-72,y+24,144,3);
  ctx.fillStyle="rgba(150,34,30,0.8)";ctx.fillRect(x-30,y-16,60,4);ctx.fillStyle="rgba(60,52,44,0.4)";for(let i=0;i<4;i++)ctx.fillRect(x-50+i*2,y-6+i*7,100-i*4,1.6);ctx.restore();}
// the pose that reaches a point of the place with the near hand (its middle about 90 px past the wrist), for a person at x, y, s
function af_reachTo(P,px,py,hand){const [x,y,s,flip]=P,A=AG_FIG.anchor,fx=A[0]+(flip?-1:1)*(px-x)/s-90,fy=A[1]+(py-y)/s-8,[a1,a2]=af_reach(fx,fy);return{near:[a1,a2,hand||"rest"]};}
// the sheet as the officer holds it (holdBack: under his hand, in figure space), from held up before him (u 0) to lying flat on the
// desk where AF_OFFICE.sheet is (u 1): the same picture, at the same place, as af_sheetFlat draws on the desk, so when he lets go of
// it the sheet doesn't move. Laid flat, its words are too small to read and are drawn as decoration
function af_heldSheet(c,h,u){const e=ag_sine(clamp(u,0,1)),O=AF_OFFICE,[ox,oy,os]=O.officer,A=AG_FIG.anchor,dx=A[0]+(O.sheet[0]-ox)/os,dy=A[1]+(O.sheet[1]-oy)/os;
  const x=lerp(h.near[0]+50,dx,e),y=lerp(h.near[1]-60,dy,e);c.save();c.translate(x,y);c.scale(lerp(1,0.62,e),lerp(1,0.17,e));af_sheet(c,0,0,{rot:lerp(-0.06,0,e),deco:e>0.01});c.restore();}
function af_sheetFlat(ctx,o){o=o||{};const [x,y]=AF_OFFICE.sheet;ctx.save();ctx.translate(x,y);ctx.scale(0.62,0.17);af_sheet(ctx,0,0,{rot:0,deco:true,a:o.a});ctx.restore();}
// the sheet held up before the officer, destroyed (burn 0 to 1): a small coral glow at its foot, and it's gone
function af_burnSheet(c,h,burn){const x=h.near[0]+50,y=h.near[1]-60;c.save();c.translate(x,y);af_sheet(c,0,0,{rot:-0.06,a:1-ag_in(burn,0.35,0.55)});af_burn(c,0,130,228,burn);c.restore();}
// the gaps between neighbouring huts in a row (not across the path down the middle): [x, top, bottom] for a thin line in each
function af_hutGaps(){const out=[];AF_HUTS.forEach(row=>{for(let k=0;k+1<row.length;k++){const [x0,y0,s0]=row[k],[x1,y1,s1]=row[k+1],e=x0+AF_HUT.w*s0;
  if(x1-e>260)continue;out.push([(e+x1)/2,Math.min(y0,y1)-(AF_HUT.h+AF_HUT.roof+16)*Math.max(s0,s1),Math.max(y0,y1)+6]);}});return out;}
