/* ===== A reason to keep it: Oregon, 1986 =====
   The opening's world, drawn in the module's night light: a street of low brick buildings on a December evening in the rain, the
   public health clinic's door and window frosted and lit warm from inside; the clinic inside, by night and by day (one room, AG_ROOMS);
   the people of 1986, ordinary adults of the time and dressed for it, with no sign of illness (a counsellor, a young man, the people
   waiting); and what the story is about: the tubes and their labels, the index card of a name and a result, and the number. A result
   is never shown: only a card lying face down. The places are painted once (AG_PLACES); rain, people and cards are drawn live.
   Every top-level name here starts with rk_ or RK_. */

/* ---------------------------------------------------------------- the people of 1986, and the day's light
   Each is a spec in the agent films' form (people.js), lit by night.js: "lamp" (warm, at the clinic's door and inside by night) or
   RK_DAY (the clinic by day: soft light from the window, a fainter rim). Clothes keep clear of the colours that mean something. */
const RK_P={
  counsellor:{name:"Counsellor",role:"Counsellor",skin:[226,190,160],hair:{style:"bob",c:[104,74,52]},glasses:[64,54,48],top:{kind:"cardigan",c:[112,98,88],inner:[232,226,214]},breath:0.27},
  young:{name:"Daniel",role:"Comes to be tested",skin:[214,174,142],hair:{style:"side",c:[56,40,30]},top:{kind:"overshirt",c:[100,62,56],inner:[210,206,198]},breath:0.31},
  coat:{name:"Ruth",role:"Waiting",skin:[234,204,184],hair:{style:"bun",c:[172,166,162]},top:{kind:"blazer",c:[128,104,82],inner:[226,220,212]},breath:0.26},
  elder:{name:"Walter",role:"Waiting",skin:[170,124,94],hair:{style:"cropped",c:[196,196,194]},glasses:[50,46,44],top:{kind:"cardigan",c:[88,86,78],inner:[204,198,184]},breath:0.24},
  student:{name:"Denise",role:"Waiting",skin:[124,84,62],hair:{style:"coily",c:[34,26,24]},earrings:[220,200,160],top:{kind:"sweater",c:[150,132,112]},breath:0.32},
  friend:{name:"Mark",role:"Waiting",skin:[232,198,172],hair:{style:"side",c:[168,140,96]},top:{kind:"overshirt",c:[84,94,88],inner:[214,210,200]},breath:0.29}
};
const RK_DAY={key:[720,430],kr:900,kk:0.86,amb:0.5,kc:[1.04,1.02,0.98],shade:[0.82,0.88,0.95],rim:[196,226,232],rimA:0.32,rimW:4};
DP_PEOPLE.push([RK_P.counsellor,"lamp"],[RK_P.young,"lamp"],[RK_P.counsellor,RK_DAY],[RK_P.young,RK_DAY],[RK_P.coat,RK_DAY],[RK_P.elder,RK_DAY],
  [RK_P.student,RK_DAY],[RK_P.friend,RK_DAY]);

/* ---------------------------------------------------------------- painting helpers */
// a facade of brick: rows of soft bricks over their mortar, each a little lighter or darker
function rk_bricks(c,x0,y0,w,h,base,R){const bw=46,bh=17;c.save();c.beginPath();c.rect(x0,y0,w,h);c.clip();
  c.fillStyle=rgba(mix(base,[0,0,0],0.5),1);c.fillRect(x0,y0,w,h);
  for(let j=0;j*bh<h;j++){const y=y0+j*bh,off=(j%2)*bw/2;for(let i=-1;i*bw<w+bw;i++){const v=0.8+R()*0.34;c.fillStyle=rgba(base.map(q=>q*v),1);c.fillRect(x0+i*bw+off+1.5,y+1.5,bw-3,bh-3);}}
  c.restore();}
// light thrown on a place: a soft ellipse of colour, laid on (lighter) or over (normal)
function rk_glow(c,x,y,rx,ry,col,a,add){if(a<=0)return;c.save();if(add)c.globalCompositeOperation="lighter";const g=c.createRadialGradient(0,0,0,0,0,1);
  g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));c.translate(x,y);c.scale(rx,ry);c.fillStyle=g;c.fillRect(-1,-1,2,2);c.restore();}
// a window: its frame, and glass that shows a colour, darker at the foot (lit: the warm glass of a lit room)
function rk_window(c,x,y,w,h,glass,frame,o){o=o||{};c.fillStyle=rgba(frame,1);c.fillRect(x-8,y-8,w+16,h+16);
  const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(glass[0],1));g.addColorStop(1,rgba(glass[1],1));c.fillStyle=g;c.fillRect(x,y,w,h);
  if(o.sill){c.fillStyle=rgba(mix(frame,[255,255,255],0.12),1);c.fillRect(x-14,y+h+6,w+28,8);}
  c.fillStyle=rgba(frame,1);if(o.cross){c.fillRect(x+w/2-3,y,6,h);c.fillRect(x,y+h*0.48-3,w,6);}else if(o.mid)c.fillRect(x,y+h*0.5-3,w,6);}

/* ---------------------------------------------------------------- the street, a December evening in the rain
   The clinic in the middle: a one-storey brick building, its door's glass and its window frosted and lit warm from inside, the
   words on the window drawn live (rk_street). An older two-storey block on the left with a street lamp before it, a taller one on
   the right with one lit window, the pavement and the wet street catching every light. */
const RK_ST={door:[1012,540,156,250],win:[1200,540,222,230],lamp:[742,296],ground:790,kerb:850};
AG_PLACES.rkStreet=c=>{const R=ag_rnd(1986),G=RK_ST.ground;
  let g=c.createLinearGradient(0,0,0,460);g.addColorStop(0,"rgb(5,13,19)");g.addColorStop(1,"rgb(17,33,41)");c.fillStyle=g;c.fillRect(0,0,W,460);
  for(let i=0;i<12;i++){const x=R()*W,y=50+R()*230,r=180+R()*240;rk_glow(c,x,y,r*1.8,r*0.45,[78,110,120],0.08+R()*0.05);}
  // far roofs, and the hills beyond them
  c.fillStyle="rgb(11,22,28)";c.beginPath();c.moveTo(0,330);for(let x=0;x<=W;x+=120)c.lineTo(x,300+R()*50);c.lineTo(W,460);c.lineTo(0,460);c.fill();
  // the left block: two storeys of dark red brick, a cornice, three upper windows, a closed shop below
  rk_bricks(c,-10,214,740,G-214,[74,40,34],R);c.fillStyle="rgb(36,26,24)";c.fillRect(-10,200,740,22);c.fillStyle="rgba(150,190,196,0.10)";c.fillRect(-10,200,740,3);
  for(const x of [80,320,560])rk_window(c,x,300,128,168,[[22,34,40],[12,20,24]],[44,34,30],{sill:true,cross:true});
  rk_window(c,50,560,470,212,[[20,30,34],[14,22,26]],[38,30,28],{mid:true});c.fillStyle="rgb(28,22,22)";c.fillRect(560,566,96,G-566);
  // the clinic: one storey, a parapet, a plain sign band, the door and the window lit warm
  rk_bricks(c,720,400,742,G-400,[80,46,38],R);c.fillStyle="rgb(40,30,28)";c.fillRect(712,374,758,30);c.fillStyle="rgba(150,190,196,0.12)";c.fillRect(712,374,758,3);
  c.fillStyle="rgb(30,36,38)";c.fillRect(770,424,652,58);c.fillStyle="rgba(150,190,196,0.10)";c.fillRect(770,424,652,2);
  // two small lamps over the sign, and the light they cast on it
  for(const lx of [900,1292]){c.fillStyle="rgb(24,28,30)";c.fillRect(lx-2,404,4,14);c.fillRect(lx-12,414,24,6);rk_glow(c,lx,436,120,30,[255,226,180],0.16,true);}
  const [dx,dy,dw,dh]=RK_ST.door,[wx,wy,ww,wh]=RK_ST.win;
  rk_glow(c,1210,640,520,300,[255,196,128],0.20);
  c.fillStyle="rgb(46,34,28)";c.fillRect(dx-10,dy-10,dw+20,dh+10);
  g=c.createLinearGradient(0,dy+14,0,dy+214);g.addColorStop(0,"rgb(246,214,164)");g.addColorStop(1,"rgb(214,166,110)");c.fillStyle=g;c.fillRect(dx+14,dy+14,dw-28,200);
  c.fillStyle="rgb(58,42,32)";c.fillRect(dx+14,dy+218,dw-28,dh-232);c.fillStyle="rgb(196,170,120)";c.fillRect(dx+dw-34,dy+150,8,26);
  c.fillStyle="rgb(46,34,28)";c.fillRect(wx-10,wy-10,ww+20,wh+20);
  g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgb(248,220,172)");g.addColorStop(1,"rgb(220,172,116)");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  // soft shapes behind the frosted glass: a lamp's glow, a cabinet, a chair back
  rk_glow(c,wx+150,wy+40,90,60,[255,240,210],0.5);c.fillStyle="rgba(120,84,56,0.16)";c.fillRect(wx+20,wy+110,70,120);c.fillRect(dx+40,dy+120,60,80);
  c.fillStyle="rgb(46,34,28)";c.fillRect(wx+ww/2-3,wy,6,wh);c.fillStyle="rgb(62,48,40)";c.fillRect(dx-16,G-6,dw+32,8);
  // the right block: three storeys, one window lit, its curtains half drawn
  rk_bricks(c,1462,150,470,G-150,[66,40,36],R);c.fillStyle="rgb(34,26,24)";c.fillRect(1456,138,480,18);
  for(const [x,y,lit] of [[1540,220,1],[1730,220,0],[1540,430,0],[1730,430,0]]){
    if(lit){rk_window(c,x,y,124,160,[[255,214,160],[226,170,112]],[44,34,30],{sill:true,mid:true});c.fillStyle="rgba(120,60,48,0.55)";c.fillRect(x,y,30,160);c.fillRect(x+94,y,30,160);rk_glow(c,x+62,y+80,180,140,[255,200,140],0.10);}
    else rk_window(c,x,y,124,160,[[22,34,40],[12,20,24]],[44,34,30],{sill:true,mid:true});}
  c.fillStyle="rgb(26,20,20)";c.fillRect(1480,600,120,G-600);rk_window(c,1640,600,250,172,[[20,30,34],[14,22,26]],[38,30,28],{});
  // the pavement, the kerb, and the wet street
  g=c.createLinearGradient(0,G,0,RK_ST.kerb);g.addColorStop(0,"rgb(34,44,48)");g.addColorStop(1,"rgb(26,34,38)");c.fillStyle=g;c.fillRect(0,G,W,RK_ST.kerb-G);
  c.fillStyle="rgb(46,56,60)";c.fillRect(0,RK_ST.kerb,W,10);
  g=c.createLinearGradient(0,RK_ST.kerb+10,0,H);g.addColorStop(0,"rgb(14,24,30)");g.addColorStop(1,"rgb(8,16,22)");c.fillStyle=g;c.fillRect(0,RK_ST.kerb+10,W,H-RK_ST.kerb-10);
  // reflections in the wet ground: the warm door and window, the lamp, the lit window above
  for(const [x,w,a] of [[dx+dw/2,dw*0.8,0.30],[wx+ww/2,ww*0.8,0.26],[RK_ST.lamp[0],70,0.22],[1602,90,0.10]]){
    rk_glow(c,x,G+(H-G)*0.34,w*0.62,(H-G)*0.62,[255,200,140],a*0.32,true);
    c.save();c.globalCompositeOperation="lighter";
    for(let k=0;k<22;k++){const f=k/22,y=G+6+f*f*(H-G-10),rw=w*(0.35+R()*0.6)*(1-f*0.35),xx=x-rw/2+(R()-0.5)*w*0.25,al=a*(1-f)*(0.5+R()*0.5);
      c.fillStyle=rgba([255,204,146],al);rr(c,xx,y,rw,2+R()*3,1.5);c.fill();}
    c.restore();}
  rk_glow(c,dx+dw/2,G+12,260,30,[255,200,140],0.26,true);
  // puddles: a few long thin ellipses of the sky's light
  for(let i=0;i<7;i++){const x=R()*W,y=RK_ST.kerb+40+R()*170,rx=60+R()*160;rk_glow(c,x,y,rx,6+R()*6,[110,150,160],0.10);}
  // the street lamp: its post, its head, and the light it throws on the brick and the pavement
  const [lx,ly]=RK_ST.lamp;c.fillStyle="rgb(24,28,30)";c.fillRect(lx-6,ly,12,RK_ST.kerb-ly);c.fillRect(lx-14,RK_ST.kerb-24,28,24);
  c.beginPath();c.moveTo(lx-30,ly+4);c.lineTo(lx+30,ly+4);c.lineTo(lx+18,ly-18);c.lineTo(lx-18,ly-18);c.closePath();c.fill();
  rk_glow(c,lx,ly+10,24,12,[255,236,200],0.95,true);rk_glow(c,lx,ly+60,300,260,[255,220,170],0.14,true);rk_glow(c,lx,G+20,240,40,[255,220,170],0.18,true);
  // the evening's haze over everything
  g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(30,60,70,0.10)");g.addColorStop(1,"rgba(10,20,26,0.18)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// the clinic's name, in plain painted letters on its sign band, drawn live so the checks read them
function rk_clinicWords(ctx,a){dp_T(ctx,"PUBLIC HEALTH CLINIC",1096,466,{w:700,size:30,ls:4,align:"center",col:[238,218,178],a});}

/* ---------------------------------------------------------------- rain
   Soft streaks falling a little to the left, each at its own place and pace, so nothing flickers: where a streak is depends only
   on the time. o: n streaks, the area [x, y, w, h], seed, a (strength), len (their length), v (speed). */
function rk_rain(ctx,t,o){o=o||{};const n=o.n||150,[x0,y0,w,h]=o.area||[0,0,W,H],R=ag_rnd(o.seed||7),v=o.v||820,len=o.len||34,a=o.a==null?1:o.a;if(a<=0)return;
  ctx.save();ctx.beginPath();ctx.rect(x0,y0,w,h);ctx.clip();ctx.lineCap="round";
  for(let i=0;i<n;i++){const sx=R(),sy=R(),sp=0.75+R()*0.5,al=(0.08+R()*0.14)*a,ln=len*(0.7+R()*0.6),span=h+ln*2;
    const y=y0-ln+((sy*span+t*v*sp)%span),x=x0+((sx*w-(y-y0)*0.18)%w+w)%w;ctx.strokeStyle="rgba(196,226,232,"+al.toFixed(3)+")";ctx.lineWidth=1.3;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-ln*0.18,y+ln);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the clinic inside: one room, by night and by day
   The back wall with a window on the left that looks across the street (a house there, its kitchen window lit, two people at the
   table); a row of four waiting chairs under it; a wooden cabinet whose upper doors are frosted glass; and the counter, with a small
   rack of capped tubes and an in-tray. The counsellor stands behind the counter (cut at its back edge); visitors stand before it. */
const RK_CL={top:690,front:712,rack:[1000,690],tray:[1196,690],cab:[702,292,232,400],cabGlass:[716,310,204,236],win:[118,126,490,344],chairs:[132,292,452,612],seat:772};
AG_ROOMS.rkClinicDay="rkClinic";
function rk_paintClinic(c,day){const R=ag_rnd(day?61:62),T=RK_CL.top;
  // the back wall, the light of a ceiling lamp on it by night, of the window by day
  const wall=day?[74,94,92]:[30,46,48];let g=c.createLinearGradient(0,0,0,T);g.addColorStop(0,rgba(mix(wall,[0,0,0],0.25),1));g.addColorStop(1,rgba(wall,1));c.fillStyle=g;c.fillRect(0,0,W,T+10);
  if(day)rk_glow(c,360,420,900,520,[230,240,236],0.12);else{rk_glow(c,1290,160,820,560,[255,204,150],0.16);rk_glow(c,360,300,520,360,[120,170,180],0.06);}
  c.fillStyle=rgba(mix(wall,[0,0,0],0.4),1);c.fillRect(0,T-6,W,16);
  // the floor: linoleum tiles, glossy, the lamp's or the window's light in it
  const fl=day?[54,64,64]:[22,30,32];g=c.createLinearGradient(0,T,0,H);g.addColorStop(0,rgba(fl,1));g.addColorStop(1,rgba(mix(fl,[0,0,0],0.3),1));c.fillStyle=g;c.fillRect(0,T+10,W,H-T);
  c.strokeStyle=rgba(mix(fl,[255,255,255],0.06),1);c.lineWidth=1.2;for(let j=0;j<6;j++){const y=T+14+Math.pow(j/6,1.6)*(H-T);c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  for(let i=-8;i<=8;i++){c.beginPath();c.moveTo(900+i*60,T+12);c.lineTo(900+i*260,H);c.stroke();}
  rk_glow(c,day?380:1250,T+120,day?420:520,90,day?[200,220,220]:[255,204,150],day?0.10:0.12);
  // the window across the street: the house there, its kitchen window lit by night, and two people at the table
  const [wx,wy,ww,wh]=RK_CL.win;c.fillStyle=day?"rgb(112,112,104)":"rgb(52,50,46)";c.fillRect(wx-16,wy-16,ww+32,wh+32);
  g=c.createLinearGradient(0,wy,0,wy+wh);if(day){g.addColorStop(0,"rgb(168,186,190)");g.addColorStop(1,"rgb(134,150,152)");}else{g.addColorStop(0,"rgb(10,20,26)");g.addColorStop(1,"rgb(16,28,34)");}
  c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.save();c.beginPath();c.rect(wx,wy,ww,wh);c.clip();
  c.fillStyle=day?"rgb(118,104,96)":"rgb(26,24,26)";c.beginPath();c.moveTo(wx+60,wy+wh);c.lineTo(wx+60,wy+120);c.lineTo(wx+250,wy+40);c.lineTo(wx+440,wy+120);c.lineTo(wx+440,wy+wh);c.fill();
  if(day){c.fillStyle="rgb(90,102,106)";c.fillRect(wx+270,wy+170,140,100);c.fillStyle="rgba(220,232,236,0.4)";c.fillRect(wx+276,wy+176,60,30);}
  else rk_kitchen(c,wx+270,wy+170);
  c.fillStyle=day?"rgb(70,64,60)":"rgb(20,20,22)";c.fillRect(wx,wy+wh-50,ww,50);
  c.restore();
  c.fillStyle=day?"rgb(112,112,104)":"rgb(52,50,46)";c.fillRect(wx+ww/2-4,wy,8,wh);c.fillRect(wx,wy+wh*0.46-4,ww,8);
  c.fillStyle=day?"rgb(132,132,124)":"rgb(62,60,56)";c.fillRect(wx-26,wy+wh+16,ww+52,12);
  // the waiting chairs: moulded seats and backs on thin legs (their fronts are drawn again over anyone sitting: rk_seats)
  for(const x of RK_CL.chairs)rk_chair(c,x,day,true);rk_table(c,day);
  // the cabinet: dark wood, two upper doors of frosted glass, two drawers
  const [cx,cy,cw,ch]=RK_CL.cab,[gx,gy,gw,gh]=RK_CL.cabGlass,wood=day?[118,88,64]:[86,62,46];
  c.fillStyle=rgba(wood,1);c.fillRect(cx,cy,cw,ch);c.fillStyle=rgba(mix(wood,[0,0,0],0.35),1);c.fillRect(cx,cy,cw,8);c.fillRect(cx+cw-8,cy,8,ch);
  g=c.createLinearGradient(gx,gy,gx+gw,gy+gh);g.addColorStop(0,day?"rgb(190,204,204)":"rgb(118,140,140)");g.addColorStop(1,day?"rgb(150,166,166)":"rgb(76,96,98)");c.fillStyle=g;c.fillRect(gx,gy,gw,gh);
  c.fillStyle="rgba(255,255,255,0.10)";for(let i=0;i<5;i++)c.fillRect(gx+16+i*36,gy+30+((i*37)%60),20,gh-80);
  c.fillStyle=rgba(wood,1);c.fillRect(gx+gw/2-4,gy,8,gh);c.fillStyle=rgba(mix(wood,[0,0,0],0.3),1);
  for(const y of [cy+270,cy+334]){c.fillRect(cx+14,y,cw-28,54);c.fillStyle=rgba(mix(wood,[255,230,200],0.25),1);c.fillRect(cx+cw/2-18,y+24,36,6);c.fillStyle=rgba(mix(wood,[0,0,0],0.3),1);}
  // the counter: a laminate top catching the light, a panelled front
  const top=day?[156,128,100]:[122,96,74],front=day?[96,76,60]:[66,52,42];
  c.fillStyle=rgba(top,1);c.fillRect(940,T,W-940,RK_CL.front-T);c.fillStyle=rgba(mix(top,[255,240,220],0.3),1);c.fillRect(940,T,W-940,3);
  g=c.createLinearGradient(0,RK_CL.front,0,H);g.addColorStop(0,rgba(front,1));g.addColorStop(1,rgba(mix(front,[0,0,0],0.4),1));c.fillStyle=g;c.fillRect(940,RK_CL.front,W-940,H-RK_CL.front);
  c.fillStyle=rgba(mix(front,[0,0,0],0.3),1);for(let x=1060;x<W;x+=240)c.fillRect(x,RK_CL.front+30,4,H);c.fillRect(940,RK_CL.front,W-940,6);
  // on the counter: the rack of tubes and the in-tray
  rk_rack(c,RK_CL.rack[0],T,day);
  const [tx]=RK_CL.tray;c.fillStyle=day?"rgb(70,76,78)":"rgb(40,44,46)";c.fillRect(tx,T-30,150,30);c.fillStyle=day?"rgb(226,222,210)":"rgb(170,166,156)";
  for(let i=0;i<3;i++){c.save();c.translate(tx+12+i*3,T-34-i*5);c.rotate(-0.02*i);c.fillRect(0,0,126,6);c.restore();}
  // a ceiling lamp by night; a clock and a plain notice board on the wall
  if(!day){c.fillStyle="rgb(20,24,26)";c.fillRect(1288,0,4,90);c.beginPath();c.moveTo(1230,128);c.lineTo(1350,128);c.lineTo(1314,88);c.lineTo(1266,88);c.closePath();c.fill();rk_glow(c,1290,132,70,22,[255,232,190],0.9,true);}
  c.fillStyle=day?"rgb(214,212,200)":"rgb(120,118,108)";c.beginPath();c.arc(1532,196,34,0,TAU);c.fill();c.strokeStyle="rgb(40,40,40)";c.lineWidth=3;c.beginPath();c.moveTo(1532,196);c.lineTo(1532,172);c.moveTo(1532,196);c.lineTo(1550,204);c.stroke();
  c.fillStyle=day?"rgb(132,104,78)":"rgb(70,56,44)";c.fillRect(1660,150,220,260);c.fillStyle=day?"rgba(236,232,220,0.85)":"rgba(170,166,156,0.7)";
  for(const [x,y,w,h] of [[1680,170,84,104],[1780,176,82,70],[1690,290,70,96],[1774,262,90,120]])c.fillRect(x,y,w,h);
  if(day){g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(220,236,236,0.10)");g.addColorStop(0.5,"rgba(220,236,236,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
  else{g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(8,18,22,0.10)");g.addColorStop(1,"rgba(8,18,22,0.22)");c.fillStyle=g;c.fillRect(0,0,W,H);}}
AG_PLACES.rkClinic=c=>rk_paintClinic(c,false);
/* the kitchen window across the street by night (x, y its top left, 140 by 100): warm light from a lamp over the table, curtains half
   drawn, and two people at the table seen from outside, leaning toward each other, a mug between them; dark shapes against the light,
   each their own shape: her hair falls to her shoulders, he is broader, his head a little bowed */
function rk_kitchen(c,x,y){const g=c.createLinearGradient(0,y,0,y+100);g.addColorStop(0,"rgb(255,222,170)");g.addColorStop(1,"rgb(226,164,104)");c.fillStyle=g;c.fillRect(x,y,140,100);
  rk_glow(c,x+70,y+30,70,46,[255,244,214],0.55,true);
  c.fillStyle="rgba(160,92,58,0.30)";c.fillRect(x+12,y+8,22,4);c.fillRect(x+16,y+4,6,6);c.fillRect(x+26,y+2,5,8);
  c.fillStyle="rgb(58,40,30)";c.fillRect(x+69,y,2,14);c.beginPath();c.moveTo(x+60,y+14);c.lineTo(x+80,y+14);c.lineTo(x+87,y+24);c.lineTo(x+53,y+24);c.closePath();c.fill();
  const ink="rgb(44,30,24)";c.fillStyle=ink;
  // her: a woman on the left, facing right, leaning in, her forearm on the table
  c.beginPath();c.ellipse(x+40,y+50,10.5,12.5,0.18,0,TAU);c.fill();
  c.beginPath();c.moveTo(x+30,y+44);c.bezierCurveTo(x+28,y+36,x+40,y+32,x+47,y+38);c.bezierCurveTo(x+44,y+42,x+40,y+46,x+38,y+52);c.bezierCurveTo(x+36,y+60,x+32,y+66,x+26,y+68);c.bezierCurveTo(x+25,y+60,x+27,y+50,x+30,y+44);c.fill();
  c.beginPath();c.moveTo(x+10,y+100);c.bezierCurveTo(x+10,y+84,x+14,y+70,x+28,y+64);c.lineTo(x+40,y+60);c.bezierCurveTo(x+48,y+62,x+55,y+68,x+58,y+76);
  c.bezierCurveTo(x+64,y+76,x+70,y+77,x+72,y+80);c.lineTo(x+58,y+84);c.bezierCurveTo(x+58,y+92,x+59,y+96,x+60,y+100);c.closePath();c.fill();
  // him: a man on the right, facing left, broader, his head a little bowed toward her
  c.beginPath();c.ellipse(x+102,y+47,11,13,-0.22,0,TAU);c.fill();c.beginPath();c.ellipse(x+104,y+38,11.5,7,-0.3,0,TAU);c.fill();
  c.beginPath();c.moveTo(x+134,y+100);c.bezierCurveTo(x+134,y+82,x+130,y+68,x+116,y+62);c.lineTo(x+100,y+58);c.bezierCurveTo(x+92,y+60,x+86,y+66,x+84,y+74);
  c.bezierCurveTo(x+80,y+76,x+76,y+77,x+76,y+80);c.lineTo(x+86,y+84);c.bezierCurveTo(x+86,y+92,x+85,y+96,x+84,y+100);c.closePath();c.fill();
  // the table's edge, lit along its top, and a mug between their hands
  c.fillStyle="rgb(70,46,32)";c.fillRect(x,y+82,140,18);c.fillStyle="rgba(255,226,180,0.55)";c.fillRect(x,y+82,140,2);
  c.fillStyle=ink;c.fillRect(x+64,y+70,9,11);c.strokeStyle=ink;c.lineWidth=2;c.beginPath();c.arc(x+74,y+75,3.5,-1.2,1.2);c.stroke();
  // the curtains, half drawn, and the window's frame
  c.fillStyle="rgba(150,82,56,0.55)";c.fillRect(x,y,14,100);c.fillRect(x+126,y,14,100);c.fillStyle="rgba(120,60,40,0.4)";c.fillRect(x+10,y,4,100);c.fillRect(x+126,y,4,100);
  c.strokeStyle="rgb(30,26,26)";c.lineWidth=4;c.strokeRect(x-2,y-2,144,104);
  rk_glow(c,x+70,y+50,150,110,[255,200,140],0.16,true);}
AG_PLACES.rkClinicDay=c=>rk_paintClinic(c,true);
// a waiting chair: back and seat (back:true), or only the seat's front edge and the legs, drawn over a person sitting in it
function rk_chair(c,x,day,back){const S=RK_CL.seat,col=day?[96,116,128]:[60,74,82],lg=day?"rgb(150,154,156)":"rgb(80,84,86)";
  if(back){c.fillStyle=rgba(mix(col,[0,0,0],0.15),1);rr(c,x-58,S-126,116,104,22);c.fill();c.fillStyle=rgba(mix(col,[255,255,255],0.12),1);rr(c,x-52,S-120,104,10,5);c.fill();}
  c.fillStyle=lg;c.fillRect(x-50,S+20,5,H-S);c.fillRect(x+45,S+20,5,H-S);
  c.fillStyle=rgba(col,1);rr(c,x-66,S-8,132,34,12);c.fill();c.fillStyle=rgba(mix(col,[255,255,255],0.18),1);rr(c,x-62,S-6,124,7,4);c.fill();}
function rk_seats(ctx,day){for(const x of RK_CL.chairs)rk_chair(ctx,x,day,false);rk_table(ctx,day);}
// the low table before the chairs, magazines on it: it hides the laps of the people waiting (drawn again over them)
function rk_table(c,day){const y=784,top=day?[150,118,88]:[92,72,56],ap=day?[118,90,66]:[66,52,40];
  c.fillStyle=rgba(mix(ap,[0,0,0],0.3),1);for(const x of [92,666])c.fillRect(x,840,12,H-840);
  c.save();c.shadowColor="rgba(0,0,0,0.35)";c.shadowBlur=18;c.shadowOffsetY=8;c.fillStyle=rgba(ap,1);c.fillRect(70,y+14,624,44);c.restore();
  c.fillStyle=rgba(top,1);c.fillRect(64,y,636,16);c.fillStyle=rgba(mix(top,[255,240,220],0.35),1);c.fillRect(64,y,636,3);
  c.fillStyle=rgba(mix(ap,[0,0,0],0.25),1);c.fillRect(70,y+52,624,6);
  // magazines: a small stack, and one lying open
  for(const [x,w,col,dy] of [[176,120,day?[196,104,84]:[120,66,54],0],[180,112,day?[80,118,140]:[52,76,90],-5],[470,150,day?[214,198,150]:[130,120,92],0]]){
    c.fillStyle=rgba(col,1);c.fillRect(x,y-4+dy,w,5);}
  c.fillStyle=day?"rgba(240,236,226,0.9)":"rgba(160,156,148,0.8)";c.fillRect(470,y-6,74,3);}
// the rack of capped tubes on the counter, each with a blank paper label (a number on one is a card of the film's: rk_labelCard)
function rk_rack(c,x,T,day){c.fillStyle=day?"rgb(150,152,150)":"rgb(86,88,86)";c.fillRect(x,T-22,150,8);c.fillRect(x,T-6,150,6);c.fillRect(x+4,T-22,4,22);c.fillRect(x+142,T-22,4,22);
  for(let i=0;i<6;i++){const tx=x+14+i*22;c.fillStyle=day?"rgba(220,232,236,0.75)":"rgba(150,170,176,0.6)";rr(c,tx,T-74,14,66,7);c.fill();
    c.fillStyle=day?"rgb(234,232,226)":"rgb(168,166,160)";c.fillRect(tx+1,T-58,12,22);c.fillStyle=day?"rgb(112,118,124)":"rgb(70,74,78)";rr(c,tx-1,T-84,16,14,4);c.fill();}}
// where a tube on the rack is (k from 0), for a line of light to it
const rk_tubeAt=k=>[RK_CL.rack[0]+21+k*22,RK_CL.top-47];

/* ---------------------------------------------------------------- the story's cards
   rk_index: the clinic's index card of one person, a name and a result, both under violet frost (what may not be read); u springs
   it in, k its size. rk_names: the cards of everyone tested, filed, their tabs reading "Name" once the frost thins (thin 0 to 1),
   one card sliding out to the right, over the rest, with a coral rim (out 0 to 1). rk_count: a count of the opening, two bars, before and after, in grey (a count
   holds no names: it needs no protection). */
function rk_frostLine(ctx,x,y,w,o){dp_frost(ctx,x,y,w,30,c=>{c.fillStyle="rgba(240,236,255,0.9)";c.fillRect(x+12,y+9,w*0.6,12);},Object.assign({r:8},o||{}));}
function rk_index(ctx,x,y,o){o=o||{};const w=360,h=176,k=o.k==null?1:o.k,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+w/2,y+h/2,k);
  dp_panel(ctx,x,y,w,h,{col:"violet",r:16,glowR:30,behind:o.behind});
  dp_T(ctx,"Name",x+28,y+54,{w:700,size:30});rk_frostLine(ctx,x+150,y+30,180,{behind:o.behind});
  dp_T(ctx,"Result",x+28,y+128,{w:700,size:30});rk_frostLine(ctx,x+150,y+104,180,{behind:o.behind});ctx.restore();}
function rk_names(ctx,x,y,o){o=o||{};const w=440,a=o.a==null?1:o.a,thin=clamp(o.thin||0,0,1),out=clamp(o.out||0,0,1),n=5;if(a<=0)return;
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,96+n*64+20,{col:"violet",r:20,behind:o.behind});
  dp_T(ctx,"KEPT PRIVATE",x+30,y+58,{w:800,size:28,ls:4,col:"violet"});
  const card=(i,dx,dy,coral)=>{const cx=x+24+dx,cy=y+96+i*64+dy;dp_panel(ctx,cx,cy,w-48,58,{col:coral>0.5?"coral":"violet",r:12,glowA:0.5+coral,glowR:18+coral*20,behind:o.behind});
    withA(ctx,coral>0?Math.max(0.25+0.75*thin,coral):0.25+0.75*thin,()=>dp_T(ctx,"Name",cx+24,cy+40,{w:700,size:28}));rk_frostLine(ctx,cx+136,cy+14,w-210,{behind:o.behind});};
  for(let i=0;i<n;i++)if(i!==2||out<=0)card(i,0,0,0);
  // the frost of the cabinet's door over all of them, thinning
  if(thin<1)dp_frost(ctx,x+12,y+80,w-24,n*64+28,null,{col:"violet",a:1-thin,r:14,behind:o.behind});
  if(out>0){const e=ag_sine(out);card(2,e*330,-e*16,out);}
  ctx.restore();}
function rk_count(ctx,x,y,title,before,after,o){o=o||{};const w=o.w||600,a=o.a==null?1:o.a,u=clamp(o.u==null?1:o.u,0,1),v=clamp(o.v==null?1:o.v,0,1),max=o.max||after;if(a<=0)return;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+120,lerp(0.6,1,o.k));const lines=ag_wrap(ctx,title,w-60,{w:700,size:30}),h=70+lines.length*40+2*70;dp_panel(ctx,x,y,w,h,{col:"grey",r:20,behind:o.behind});
  // a darker film inside, so its words read over the bright day clinic
  rr(ctx,x+2,y+2,w-4,h-4,18);ctx.fillStyle="rgba(6,20,26,0.35)";ctx.fill();
  lines.forEach((l,i)=>dp_T(ctx,l,x+30,y+58+i*40,{w:700,size:30}));const by=y+70+lines.length*40,bw=w-240;
  for(const [k,lab,n,p] of [[0,o.lab0||"before",before,u],[1,o.lab1||"after",after,v]]){const yy=by+k*70,len=bw*n/max*ag_eo(p);if(p<=0)continue;
    withA(ctx,ag_in(p,0,0.3),()=>{dp_T(ctx,lab,x+30,yy+36,{w:600,size:28});
      ctx.save();ctx.shadowColor=rgba(DP.F.grey,0.6);ctx.shadowBlur=12;rr(ctx,x+150,yy+12,Math.max(8,len),30,8);ctx.fillStyle=rgba(k?mix(DP.F.grey,[255,255,255],0.25):DP.F.grey,1);ctx.fill();ctx.restore();
      dp_T(ctx,String(Math.round(n*clamp(p*1.4,0,1))),x+150+Math.max(8,len)+16,yy+38,{w:800,size:34});});}
  ctx.restore();return{x,y,w,h};}
// the number card: "Number" and the number in the identity's cyan; held, it's drawn in the hand's space by rk_held
function rk_numberCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+130,y+80,lerp(0.5,1,o.k));
  dp_panel(ctx,x,y,260,160,{col:"cyan",r:18,behind:o.behind});dp_T(ctx,"Number",x+28,y+52,{w:700,size:30,col:"mut"});
  dp_T(ctx,"4127",x+28,y+124,{w:800,size:58,col:"cyan",ls:3,glow:"cyan"});ctx.restore();}
function rk_nameCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+130,y+80,lerp(0.5,1,o.k));
  dp_panel(ctx,x,y,260,160,{col:"violet",r:18,behind:o.behind});dp_T(ctx,"Name",x+28,y+52,{w:700,size:30,col:"mut"});
  dp_frost(ctx,x+28,y+78,204,52,c=>{c.fillStyle="rgba(240,236,255,0.9)";c.fillRect(x+40,y+92,150,22);},{r:10,behind:o.behind});ctx.restore();}
// the number card in the young man's hand, in figure space (he faces right, so it reads the right way): held up by its lower corner,
// his fingers over the corner, the number clear above them
function rk_held(c,hands){const [hx,hy]=hands.near;c.save();c.translate(hx-112,hy-198);c.rotate(-0.05);
  c.save();c.shadowColor="rgba(0,0,0,0.35)";c.shadowBlur=14;rr(c,0,0,184,114,12);c.fillStyle="rgb(232,236,234)";c.fill();c.restore();
  c.fillStyle="rgba(72,222,244,0.18)";rr(c,0,0,184,114,12);c.fill();c.strokeStyle=rgba(DP.F.cyan,0.9);c.lineWidth=2.5;rr(c,1,1,182,112,11);c.stroke();
  dp_T(c,"4127",86,74,{w:800,size:52,col:[6,70,86],ls:2,align:"center"});c.restore();}
// the result card on the counter, face down (its back plain): it slides across from the counsellor; never turned up
function rk_resultCard(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.transform(1,0,-0.55,1,0,0);
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.fillRect(4,4,150,24);ctx.fillStyle="rgb(214,210,198)";ctx.fillRect(0,0,150,24);ctx.fillStyle="rgb(190,186,174)";ctx.fillRect(0,20,150,4);ctx.restore();}
