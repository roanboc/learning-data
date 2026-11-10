/* ===== The team comes first: Johannesburg, the 1930s =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms
   are (prefix tf_). Nothing here is a likeness or a copy of a photograph of the time: the yard, its rooms and the clothes are drawn from
   what is known of the yards of rooms near the city in the 1930s (single rooms in long rows round a yard of beaten earth, walls of
   limewashed brick, roofs of corrugated iron, one tap for the whole yard, washing hung across it; the mine dumps and a mine's headgear
   on the skyline), in this film's own style, with no pattern or ornament borrowed from any culture.
     tfYard, tfYardDusk   the yard by day, and the same yard at dusk (one room: AG_ROOMS)
     tfMeet               inside one of its rooms, where a stokvel meets: a limewashed wall under a corrugated iron roof, the late sun
     tfBank               a bank in the city: stone columns, its doors shut
     tf_ring              the stokvel as a ring: its members round one pot, each paying in, one taking it all, in turn (the team's ring too)
     TF_WOMEN             the members of one stokvel, dressed for their time: a dress or a blouse and an apron, a cardigan, a head-tie;
                          never likenesses
   Colour keeps the module's meaning: what's paid in, and what it buys, in green; what's at risk in amber; the group's rules in blue; the
   yard and its people wear none of the five. */

const TF_K={sky0:[196,206,212],sky1:[240,230,208],haze:[228,222,208],dump:[226,208,160],dumpDk:[186,166,122],steel:[84,80,80],
  city:[184,178,170],cityDk:[150,144,138],iron:[150,150,148],ironDk:[104,104,106],ironHi:[206,204,198],rust:[136,102,86],
  lime:[230,222,202],limeDk:[192,182,162],brick:[164,112,90],door:[98,72,54],doorDk:[58,42,34],frame:[150,122,92],
  earth:[196,176,146],earthDk:[156,136,106],earthHi:[216,200,172],zinc:[172,176,178],zincDk:[118,122,126],
  stone:[214,200,176],stoneDk:[170,156,132],stoneHi:[238,228,208],coin:[198,198,194]};
const TF_G=760;   // the yard's ground line

/* ---------------------------------------------------------------- the yard, by day and at dusk */
function tf_sky(c,y1,o){o=o||{};let g=c.createLinearGradient(0,0,0,y1);g.addColorStop(0,rgba(o.top||TF_K.sky0,1));g.addColorStop(1,rgba(o.bot||TF_K.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,y1);
  for(const [x,y,rx,ry] of [[360,120,320,34],[1240,80,380,30],[1720,190,260,26]]){const q=c.createRadialGradient(x,y,0,x,y,rx);q.addColorStop(0,"rgba(255,252,246,0.5)");q.addColorStop(1,"rgba(255,252,246,0)");
    c.save();c.translate(x,y);c.scale(1,ry/rx);c.translate(-x,-y);c.fillStyle=q;c.fillRect(x-rx,y-rx,2*rx,2*rx);c.restore();}}
// a mine dump on the skyline: flat on top, its sides in terraces, the right side in the sun; hz: how far the haze takes it, 0 to 1
function tf_dump(c,x0,x1,base,top,hz){const ins=(base-top)*1.4,K=(a)=>rgba(mix(a,TF_K.haze,hz),1);
  let g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,K(TF_K.dumpDk));g.addColorStop(0.55,K(TF_K.dump));g.addColorStop(1,K(mix(TF_K.dump,[255,250,236],0.3)));
  c.fillStyle=g;c.beginPath();c.moveTo(x0,base);c.lineTo(x0+ins,top);c.lineTo(x1-ins*0.8,top);c.lineTo(x1,base);c.closePath();c.fill();
  c.strokeStyle=rgba(mix(TF_K.dumpDk,TF_K.haze,hz),0.55);c.lineWidth=2;for(let k=1;k<3;k++){const y=lerp(top,base,k/3),ix=ins*(1-k/3);c.beginPath();c.moveTo(x0+ix+8,y);c.lineTo(x1-ix*0.8-8,y);c.stroke();}
  c.fillStyle=rgba(mix([250,240,210],TF_K.haze,hz),0.85);c.fillRect(x0+ins,top,x1-x0-ins*1.8,3);}
// a mine's headgear: its legs, its back-stay, and the wheel at the top
function tf_headgear(c,x,base,h,col){c.save();c.strokeStyle=rgba(col,1);c.lineWidth=5;c.lineCap="round";
  c.beginPath();c.moveTo(x-h*0.16,base);c.lineTo(x,base-h);c.lineTo(x+h*0.16,base);c.moveTo(x,base-h+8);c.lineTo(x+h*0.46,base);c.stroke();
  c.lineWidth=2.5;for(let k=1;k<5;k++){const y=base-h*k/5,dx=h*0.16*(1-k/5);c.beginPath();c.moveTo(x-dx,y);c.lineTo(x+dx,y);c.stroke();}
  c.lineWidth=3;c.beginPath();c.arc(x,base-h-10,15,0,TAU);c.stroke();c.beginPath();c.moveTo(x-15,base-h-10);c.lineTo(x+15,base-h-10);c.stroke();c.restore();}
// the city in the haze: blocks of different heights, rows of windows, the side towards the sun lighter
function tf_city(c,x0,x1,base,o){o=o||{};const R=ag_rnd(o.seed||3);let x=x0;while(x<x1){const w=46+R()*80,h=50+R()*(o.tall||150),col=mix(TF_K.city,TF_K.haze,(o.hz==null?0.3:o.hz)+R()*0.15);
  c.fillStyle=rgba(col,1);c.fillRect(x,base-h,w,h);c.fillStyle=rgba(mix(col,[255,255,255],0.2),1);c.fillRect(x+w-8,base-h,8,h);
  c.fillStyle=rgba(mix(col,TF_K.cityDk,0.6),0.45);for(let y=base-h+10;y<base-8;y+=13)c.fillRect(x+6,y,w-20,3);
  x+=w+3+R()*16;}}
// the row of rooms across the yard: limewashed brick, worn in places, a door and a small window to each room, under one long roof of
// corrugated iron with its stove pipes; o.open: which rooms' doors stand open
function tf_rooms(c,x0,x1,top,base,o){o=o||{};const R=ag_rnd(o.seed||12),roofH=40;
  let g=c.createLinearGradient(0,top,0,base);g.addColorStop(0,rgba(TF_K.lime,1));g.addColorStop(0.7,rgba(mix(TF_K.lime,TF_K.limeDk,0.45),1));g.addColorStop(1,rgba(TF_K.limeDk,1));
  c.fillStyle=g;c.fillRect(x0,top,x1-x0,base-top);
  for(let k=0;k<22;k++){const x=x0+R()*(x1-x0),y=top+30+R()*(base-top-50),w=30+R()*80,h=12+R()*30;c.fillStyle=rgba(mix(TF_K.brick,TF_K.lime,0.5),0.3);c.beginPath();c.ellipse(x,y,w/2,h/2,0,0,TAU);c.fill();}
  // the foot of the wall, splashed with the yard's earth
  g=c.createLinearGradient(0,base-50,0,base);g.addColorStop(0,"rgba(150,128,100,0)");g.addColorStop(1,"rgba(150,128,100,0.45)");c.fillStyle=g;c.fillRect(x0,base-50,x1-x0,50);
  const rw=o.roomW||250;let n=0;for(let x=x0+60;x<x1-80;x+=rw,n++){const dx=x+R()*24,open=(o.open||[]).includes(n);
    c.fillStyle=rgba(TF_K.limeDk,0.55);c.fillRect(x-44,top,3,base-top);
    c.fillStyle=rgba(mix(TF_K.frame,TF_K.doorDk,0.3),1);c.fillRect(dx-5,base-166,88,166);c.fillStyle="rgb(46,38,36)";c.fillRect(dx,base-160,78,160);
    if(!open){g=c.createLinearGradient(dx,0,dx+78,0);g.addColorStop(0,rgba(mix(TF_K.door,TF_K.doorDk,0.45),1));g.addColorStop(1,rgba(TF_K.door,1));c.fillStyle=g;c.fillRect(dx+2,base-158,74,158);
      c.strokeStyle=rgba(TF_K.doorDk,0.55);c.lineWidth=2;for(const yy of [0.34,0.68]){c.beginPath();c.moveTo(dx+2,base-158+158*yy);c.lineTo(dx+76,base-158+158*yy);c.stroke();}
      c.fillStyle=rgba(TF_K.steel,1);c.beginPath();c.arc(dx+64,base-80,4,0,TAU);c.fill();}
    else{c.fillStyle=rgba(mix(TF_K.door,TF_K.doorDk,0.25),1);c.fillRect(dx+2,base-158,16,158);}
    const wx=dx+124;c.fillStyle=rgba(TF_K.frame,1);c.fillRect(wx-5,base-140,72,62);c.fillStyle="rgb(60,54,56)";c.fillRect(wx,base-135,62,52);
    c.fillStyle="rgba(206,212,214,0.32)";c.fillRect(wx+33,base-133,27,22);c.fillStyle=rgba(TF_K.frame,1);c.fillRect(wx+29,base-135,4,52);c.fillRect(wx,base-111,62,4);
    c.fillStyle=rgba(TF_K.earthDk,1);c.fillRect(dx-8,base-3,94,7);}
  g=c.createLinearGradient(0,top-roofH,0,top);g.addColorStop(0,rgba(TF_K.ironHi,1));g.addColorStop(1,rgba(TF_K.iron,1));c.fillStyle=g;c.fillRect(x0-10,top-roofH,x1-x0+20,roofH);
  c.lineWidth=2;for(let x=x0-10;x<x1+10;x+=9){c.strokeStyle="rgba(70,70,74,0.3)";c.beginPath();c.moveTo(x,top-roofH);c.lineTo(x,top);c.stroke();c.strokeStyle="rgba(255,255,255,0.18)";c.beginPath();c.moveTo(x+3,top-roofH);c.lineTo(x+3,top);c.stroke();}
  for(let k=0;k<8;k++){const x=x0+R()*(x1-x0),w=40+R()*100;c.fillStyle=rgba(TF_K.rust,0.32);c.fillRect(x,top-roofH+R()*12,w,roofH*0.55);}
  c.fillStyle=rgba(TF_K.ironDk,1);c.fillRect(x0-10,top-2,x1-x0+20,5);
  g=c.createLinearGradient(0,top+3,0,top+28);g.addColorStop(0,"rgba(40,32,30,0.34)");g.addColorStop(1,"rgba(40,32,30,0)");c.fillStyle=g;c.fillRect(x0,top+3,x1-x0,25);
  for(let k=0;k<5;k++){const x=x0+150+k*(x1-x0-300)/4+R()*40;c.fillStyle=rgba(TF_K.ironDk,1);c.fillRect(x,top-roofH-58,10,60);c.fillRect(x-4,top-roofH-62,18,6);}}
// cloth hanging on the line: a sheet, or a shirt or dress, pegged at its top; the side towards the sun lighter
function tf_cloth(c,x,y,w,h,col){let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(col,0.14),1));g.addColorStop(0.65,rgba(col,1));g.addColorStop(1,rgba(ag_lt(col,0.22),1));
  c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.bezierCurveTo(x+w+3,y+h*0.5,x+w-2,y+h*0.8,x+w,y+h);c.bezierCurveTo(x+w*0.66,y+h+6,x+w*0.33,y+h-4,x,y+h+2);c.bezierCurveTo(x-2,y+h*0.6,x+2,y+h*0.3,x,y);c.closePath();c.fill();
  c.strokeStyle=rgba(ag_dk(col,0.3),0.35);c.lineWidth=2;for(const u of [0.3,0.62]){c.beginPath();c.moveTo(x+w*u,y+6);c.quadraticCurveTo(x+w*u+4,y+h*0.5,x+w*u-2,y+h-6);c.stroke();}
  c.fillStyle=rgba(TF_K.door,1);for(const px of [x+8,x+w-12])c.fillRect(px,y-6,5,14);}
function tf_shirt(c,x,y,w,h,col,dress){const sl=w*0.3,bw=w*0.62,L=dress?h*1.5:h;let g=c.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,rgba(ag_dk(col,0.14),1));g.addColorStop(0.65,rgba(col,1));g.addColorStop(1,rgba(ag_lt(col,0.2),1));
  c.fillStyle=g;c.beginPath();c.moveTo(x-w/2,y+4);c.lineTo(x-bw/2-sl,y+h*0.34);c.lineTo(x-bw/2,y+h*0.4);c.lineTo(x-bw/2-(dress?w*0.12:0),y+L);c.lineTo(x+bw/2+(dress?w*0.12:0),y+L);c.lineTo(x+bw/2,y+h*0.4);
  c.lineTo(x+bw/2+sl,y+h*0.34);c.lineTo(x+w/2,y+4);c.lineTo(x+w*0.12,y);c.quadraticCurveTo(x,y+12,x-w*0.12,y);c.closePath();c.fill();
  c.strokeStyle=rgba(ag_dk(col,0.3),0.35);c.lineWidth=2;c.beginPath();c.moveTo(x,y+10);c.lineTo(x,y+L-6);c.stroke();
  c.fillStyle=rgba(TF_K.door,1);for(const px of [x-w/2+4,x+w/2-9])c.fillRect(px,y-6,5,14);}
// a washing line between two posts, sagging, hung with the yard's washing
function tf_washing(c,x0,y0,x1,y1,sag,seed){const R=ag_rnd(seed||8),at=u=>[lerp(x0,x1,u),lerp(y0,y1,u)+sag*4*u*(1-u)];
  c.fillStyle=rgba(mix(TF_K.door,TF_K.earth,0.25),1);for(const [x,y] of [[x0,y0],[x1,y1]]){c.fillRect(x-6,y-14,12,TF_G-y+40);c.fillStyle=rgba(mix(TF_K.door,TF_K.earth,0.25),1);}
  c.strokeStyle="rgba(70,62,58,0.85)";c.lineWidth=2.2;c.beginPath();for(let k=0;k<=40;k++){const [x,y]=at(k/40);k?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  const cloths=[[238,234,224],[218,210,194],[180,166,152],[136,128,122],[202,192,172],[154,140,126],[228,222,212]];
  let u=0.035;while(u<0.95){const k=R(),col=cloths[Math.floor(R()*cloths.length)],w=k<0.4?100+R()*50:62+R()*18,[x,y]=at(u+w/2/(x1-x0));
    if(k<0.4)tf_cloth(c,x-w/2,y,w,104+R()*36,col);else tf_shirt(c,x,y,w,78,col,k>0.78);u+=(w+18+R()*40)/(x1-x0);}}
// the yard's one tap, on its pipe, and the wet earth under it
function tf_tap(c,x,base){c.fillStyle="rgba(110,100,86,0.45)";c.beginPath();c.ellipse(x+24,base+16,80,13,0,0,TAU);c.fill();c.fillStyle="rgba(226,230,228,0.3)";c.beginPath();c.ellipse(x+44,base+14,34,4,0,0,TAU);c.fill();
  c.fillStyle=rgba(TF_K.zincDk,1);c.fillRect(x-6,base-112,12,124);c.fillRect(x-6,base-112,36,10);c.fillRect(x+22,base-112,9,22);c.fillRect(x+16,base-120,20,6);
  c.fillStyle=rgba(TF_K.zinc,1);c.fillRect(x+2,base-110,3,120);}
// a zinc washtub on the ground, washing in it
function tf_tub(c,x,y,w){const h=w*0.4;c.fillStyle="rgba(60,48,40,0.26)";c.beginPath();c.ellipse(x-14,y+6,w*0.56,w*0.1,0,0,TAU);c.fill();
  let g=c.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,rgba(TF_K.zincDk,1));g.addColorStop(0.72,rgba(TF_K.zinc,1));g.addColorStop(1,rgba(ag_lt(TF_K.zinc,0.3),1));
  c.fillStyle=g;c.beginPath();c.moveTo(x-w/2,y-h);c.lineTo(x-w*0.42,y);c.lineTo(x+w*0.42,y);c.lineTo(x+w/2,y-h);c.closePath();c.fill();
  c.fillStyle=rgba(mix(TF_K.zincDk,[40,40,44],0.35),1);c.beginPath();c.ellipse(x,y-h,w/2,w*0.1,0,0,TAU);c.fill();
  c.fillStyle="rgba(238,234,224,0.92)";c.beginPath();c.ellipse(x-6,y-h+3,w*0.38,w*0.06,0,0,TAU);c.fill();
  c.strokeStyle=rgba(ag_lt(TF_K.zinc,0.45),1);c.lineWidth=3;c.beginPath();c.ellipse(x,y-h,w/2,w*0.1,0,0,TAU);c.stroke();
  c.strokeStyle="rgba(80,84,88,0.32)";c.lineWidth=2;for(const r of [0.36,0.7]){c.beginPath();c.moveTo(x-w/2+w*0.08*r,y-h+h*r);c.lineTo(x+w/2-w*0.08*r,y-h+h*r);c.stroke();}}
// the yard's beaten earth: lighter where it's trodden, small stones, darker towards us
function tf_ground(c,y0){let g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,rgba(TF_K.earthHi,1));g.addColorStop(0.35,rgba(TF_K.earth,1));g.addColorStop(1,rgba(TF_K.earthDk,1));c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  const R=ag_rnd(77);for(let k=0;k<280;k++){const x=R()*W,v=Math.pow(R(),1.3),y=y0+v*(H-y0),r=1+R()*2.5*(1+v*1.5);c.fillStyle=rgba(R()<0.5?TF_K.earthDk:TF_K.earthHi,0.5);c.beginPath();c.ellipse(x,y,r*1.7,r,0,0,TAU);c.fill();}
  for(const [x,w] of [[560,260],[1180,320]]){const q=c.createRadialGradient(x,y0+120,0,x,y0+120,w);q.addColorStop(0,"rgba(232,220,196,0.4)");q.addColorStop(1,"rgba(232,220,196,0)");
    c.save();c.translate(x,y0+120);c.scale(1,0.24);c.translate(-x,-y0-120);c.fillStyle=q;c.fillRect(x-w,y0+120-w,2*w,2*w);c.restore();}}
function tf_paintYard(c){tf_sky(c,600);
  tf_dump(c,-60,560,560,452,0.45);tf_dump(c,1460,1990,566,470,0.5);tf_headgear(c,690,560,150,mix(TF_K.steel,TF_K.haze,0.45));
  tf_city(c,960,1480,566,{seed:7,tall:170,hz:0.32});
  // the far side of the yard: the row of rooms
  tf_rooms(c,-20,1940,520,TF_G,{seed:12,open:[2,5]});
  tf_ground(c,TF_G);
  // a soft shadow along the foot of the rooms, then the washing, the tap and a tub
  let g=c.createLinearGradient(0,TF_G,0,TF_G+30);g.addColorStop(0,"rgba(60,48,40,0.3)");g.addColorStop(1,"rgba(60,48,40,0)");c.fillStyle=g;c.fillRect(0,TF_G,W,30);
  tf_washing(c,120,392,1800,404,70,8);
  tf_tap(c,1660,TF_G+40);tf_tub(c,250,TF_G+120,150);
  // the sun from the right: the left of the frame in a little shade
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(60,48,56,0.18)");g.addColorStop(0.5,"rgba(60,48,56,0)");g.addColorStop(1,"rgba(255,226,170,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.tfYard=c=>tf_paintYard(c);
// the yard at dusk: the day's picture with the light gone low and warm, the sky deepening
AG_PLACES.tfYardDusk=c=>{tf_paintYard(c);c.save();c.globalCompositeOperation="multiply";let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(150,140,168)");g.addColorStop(0.6,"rgb(176,150,150)");g.addColorStop(1,"rgb(140,120,124)");
  c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();c.save();c.globalCompositeOperation="screen";g=c.createRadialGradient(1900,470,40,1900,470,1100);g.addColorStop(0,"rgba(255,190,140,0.42)");g.addColorStop(1,"rgba(255,190,140,0)");c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();};
AG_ROOMS.tfYardDusk="tfYard";

/* ---------------------------------------------------------------- a room in the yard, where the stokvel meets */
AG_PLACES.tfMeet=c=>{lp_paintRoom(c,{light:"late",seed:31,base:[220,206,184]});
  // the underside of the corrugated iron roof, and the timber beam it rests on
  let g=c.createLinearGradient(0,0,0,46);g.addColorStop(0,"rgb(92,90,92)");g.addColorStop(1,"rgb(128,126,124)");c.fillStyle=g;c.fillRect(0,0,W,46);
  c.lineWidth=2;for(let x=0;x<W;x+=11){c.strokeStyle="rgba(40,40,44,0.32)";c.beginPath();c.moveTo(x,0);c.lineTo(x,46);c.stroke();c.strokeStyle="rgba(255,255,255,0.12)";c.beginPath();c.moveTo(x+4,0);c.lineTo(x+4,46);c.stroke();}
  g=c.createLinearGradient(0,46,0,72);g.addColorStop(0,rgba(mix(LP.timber,LP.shade,0.35),1));g.addColorStop(1,rgba(mix(LP.timber,LP.shade,0.55),1));c.fillStyle=g;c.fillRect(0,46,W,24);
  g=c.createLinearGradient(0,70,0,110);g.addColorStop(0,"rgba(40,32,30,0.3)");g.addColorStop(1,"rgba(40,32,30,0)");c.fillStyle=g;c.fillRect(0,70,W,40);};

/* ---------------------------------------------------------------- a bank in the city */
AG_PLACES.tfBank=c=>{tf_sky(c,760,{top:[200,208,212],bot:[236,228,210]});tf_city(c,-40,470,760,{seed:21,tall:420,hz:0.18});tf_city(c,1450,1980,760,{seed:22,tall:380,hz:0.18});
  const x0=420,x1=1500,K=TF_K,cols=[560,800,1120,1360],ct=330,cb=752;
  // the stone front, its joints, and the shade between the columns
  let g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(K.stoneDk,1));g.addColorStop(0.6,rgba(K.stone,1));g.addColorStop(1,rgba(K.stoneHi,1));c.fillStyle=g;c.fillRect(x0,170,x1-x0,cb-170);
  c.fillStyle="rgba(70,58,46,0.16)";c.fillRect(x0,ct,x1-x0,cb-ct);c.strokeStyle="rgba(90,76,60,0.25)";c.lineWidth=1.6;for(let y=ct+40;y<cb;y+=40){c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();}
  // two tall windows, barred, and the doors between the middle columns, shut
  for(const wx of [650,1214]){c.fillStyle="rgb(58,54,56)";c.fillRect(wx,420,96,240);c.fillStyle="rgba(200,208,212,0.22)";c.fillRect(wx+50,424,42,90);c.strokeStyle="rgba(30,28,30,0.9)";c.lineWidth=4;for(let bx=wx+16;bx<wx+96;bx+=20){c.beginPath();c.moveTo(bx,420);c.lineTo(bx,660);c.stroke();}
    c.fillStyle=rgba(K.stoneHi,1);c.fillRect(wx-10,660,116,12);c.fillRect(wx-10,408,116,12);}
  c.fillStyle="rgb(40,32,30)";c.fillRect(870,452,180,300);for(const [dx,dw] of [[874,84],[962,84]]){g=c.createLinearGradient(dx,0,dx+dw,0);g.addColorStop(0,"rgb(76,56,44)");g.addColorStop(1,"rgb(108,80,60)");c.fillStyle=g;c.fillRect(dx,456,dw,296);
    c.strokeStyle="rgba(40,28,22,0.7)";c.lineWidth=3;c.strokeRect(dx+12,476,dw-24,110);c.strokeRect(dx+12,610,dw-24,120);}
  c.fillStyle=rgba(K.steel,1);c.fillRect(950,590,6,40);c.fillRect(964,590,6,40);c.fillStyle=rgba(K.stoneHi,1);c.fillRect(856,440,208,14);
  // the columns: round, fluted, lit from the right, on bases, under capitals
  for(const x of cols){const w=74;g=c.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,rgba(K.stoneDk,1));g.addColorStop(0.62,rgba(K.stoneHi,1));g.addColorStop(1,rgba(K.stone,1));c.fillStyle=g;c.fillRect(x-w/2,ct,w,cb-ct);
    c.strokeStyle="rgba(90,76,60,0.22)";c.lineWidth=2;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(x+k*12,ct+10);c.lineTo(x+k*12,cb-14);c.stroke();}
    c.fillStyle=rgba(K.stoneHi,1);c.fillRect(x-48,ct-22,96,22);c.fillRect(x-46,cb-16,92,16);c.fillStyle="rgba(70,58,46,0.22)";c.fillRect(x-48,ct-4,96,4);}
  // the entablature, its name carved in it, the cornice and the attic over it
  g=c.createLinearGradient(0,240,0,308);g.addColorStop(0,rgba(K.stoneHi,1));g.addColorStop(1,rgba(K.stone,1));c.fillStyle=g;c.fillRect(x0-30,240,x1-x0+60,68);
  c.fillStyle=rgba(K.stoneHi,1);c.fillRect(x0-50,214,x1-x0+100,26);c.fillStyle="rgba(70,58,46,0.3)";c.fillRect(x0-50,240,x1-x0+100,6);c.fillRect(x0-30,304,x1-x0+60,6);
  g=c.createLinearGradient(0,150,0,214);g.addColorStop(0,rgba(K.stone,1));g.addColorStop(1,rgba(K.stoneDk,1));c.fillStyle=g;c.fillRect(x0+40,150,x1-x0-80,64);
  lp_T(c,"BANK",960,294,{w:800,size:52,ls:22,align:"center",col:mix(K.stoneDk,[60,48,40],0.5)});
  // the pavement, from the foot of the city to the front of the frame, then the steps up to the bank over it
  g=c.createLinearGradient(0,756,0,H);g.addColorStop(0,"rgb(190,184,174)");g.addColorStop(0.3,"rgb(176,170,160)");g.addColorStop(1,"rgb(138,132,124)");c.fillStyle=g;c.fillRect(0,756,W,H-756);
  c.fillStyle="rgba(90,84,78,0.22)";c.fillRect(0,756,W,3);
  c.strokeStyle="rgba(90,84,78,0.3)";c.lineWidth=2;for(let x=-200;x<W+200;x+=150){c.beginPath();c.moveTo(x,cb+88);c.lineTo(x+(x-960)*0.35,H);c.stroke();}
  for(let k=0;k<4;k++){const y=cb+k*22;g=c.createLinearGradient(0,y,0,y+22);g.addColorStop(0,rgba(K.stoneHi,1));g.addColorStop(1,rgba(K.stoneDk,1));c.fillStyle=g;c.fillRect(x0-30-k*26,y,x1-x0+60+k*52,22);}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(60,48,56,0.18)");g.addColorStop(0.5,"rgba(60,48,56,0)");g.addColorStop(1,"rgba(255,226,170,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- the members of one stokvel, for lp_person
   Women of the yards in the 1930s, in a dress and an apron, or a cardigan over a blouse, with earrings, and a head-tie over all the
   hair, knotted at the nape, all of it inside the head's picture; plain cloth in quiet colours that mean nothing here. Never likenesses, and never
   named: each name is only there to give her her own moment to blink. */
function tf_doek(col){const dk=ag_dk(col,0.42),hi=ag_lt(col,0.32);return(c,P)=>{
  // the cloth: over the forehead, round above the ear, close round the back of the skull to the nape, and full over the crown
  const f=cc=>{cc.moveTo(394,360);cc.bezierCurveTo(362,346,318,344,290,354);cc.bezierCurveTo(278,362,272,378,270,394);
    cc.bezierCurveTo(258,388,246,390,236,398);cc.bezierCurveTo(230,412,222,426,214,436);cc.bezierCurveTo(200,424,194,404,194,380);
    cc.bezierCurveTo(192,326,214,282,262,264);cc.bezierCurveTo(304,250,356,256,384,284);cc.bezierCurveTo(400,302,402,334,394,360);cc.closePath();};
  ag_soft(c,f,col,hi,350,300,150,rgba(ag_dk(col,0.72),0.45),14);
  c.save();ag_shape(c,f);c.clip();
  // the shade where it wraps round the back, and the folds, drawn from the forehead and the crown to the knot
  let g=c.createLinearGradient(330,0,196,0);g.addColorStop(0,rgba(dk,0));g.addColorStop(1,rgba(dk,0.3));c.fillStyle=g;c.fillRect(190,250,150,200);
  c.strokeStyle=rgba(dk,0.45);c.lineWidth=2.4;c.lineCap="round";
  for(const L of [[[392,334],[300,318],[212,402]],[[380,292],[290,284],[208,396]],[[322,262],[250,280],[204,388]],[[292,356],[256,370],[220,410]]]){
    c.beginPath();c.moveTo(L[0][0],L[0][1]);c.quadraticCurveTo(L[1][0],L[1][1],L[2][0],L[2][1]);c.stroke();}
  c.strokeStyle=rgba(hi,0.55);c.lineWidth=2;c.beginPath();c.moveTo(386,350);c.quadraticCurveTo(330,338,292,346);c.stroke();c.restore();
  // the knot at the nape, and its two ends hanging from it, inside the head's picture
  ag_soft(c,cc=>{cc.moveTo(206,420);cc.bezierCurveTo(196,444,188,470,184,500);cc.bezierCurveTo(194,496,204,490,210,482);cc.bezierCurveTo(212,462,214,444,216,426);cc.closePath();},ag_dk(col,0.12),hi,200,450,40,rgba(ag_dk(col,0.7),0.3),5);
  ag_soft(c,cc=>{cc.moveTo(214,424);cc.bezierCurveTo(218,446,224,464,232,482);cc.bezierCurveTo(238,476,240,468,238,458);cc.bezierCurveTo(232,446,228,436,222,422);cc.closePath();},ag_dk(col,0.06),hi,226,450,30,rgba(ag_dk(col,0.7),0.3),5);
  ag_soft(c,cc=>cc.ellipse(210,418,17,14,-0.5,0,TAU),col,hi,216,410,24,rgba(ag_dk(col,0.7),0.42),6);
  c.strokeStyle=rgba(dk,0.5);c.lineWidth=2;c.beginPath();c.moveTo(200,414);c.quadraticCurveTo(210,422,222,418);c.stroke();};}
const TF_WOMEN=[
  {name:"A member of the stokvel",key:"tfW1",skin:[104,68,50],hair:{style:"shaved",c:[28,22,20]},earrings:[206,182,128],top:{kind:"apron",c:[112,92,96],apron:[214,206,190]},hat:{paint:tf_doek([156,144,126])},breath:0.29},
  {name:"One of the members",key:"tfW2",skin:[86,56,42],hair:{style:"shaved",c:[26,22,20]},earrings:[206,200,186],top:{kind:"cardigan",c:[98,102,108],inner:[226,220,206]},hat:{paint:tf_doek([214,206,188])},breath:0.31},
  {name:"A stokvel member",key:"tfW3",skin:[124,84,60],hair:{style:"shaved",c:[30,24,22]},earrings:[206,182,128],top:{kind:"cardigan",c:[142,122,102],inner:[232,226,212]},hat:{paint:tf_doek([150,108,100])},breath:0.27},
  {name:"Another member",key:"tfW4",skin:[76,50,38],hair:{style:"shaved",c:[24,20,18]},earrings:[206,200,186],top:{kind:"apron",c:[86,86,94],apron:[198,186,162]},hat:{paint:tf_doek([196,180,150])},breath:0.3},
  {name:"A member",key:"tfW5",skin:[136,94,68],hair:{style:"shaved",c:[32,26,24]},earrings:[206,182,128],top:{kind:"cardigan",c:[122,100,84],inner:[222,214,198]},hat:{paint:tf_doek([118,106,124])},breath:0.26},
  {name:"Member",key:"tfW6",skin:[96,62,46],hair:{style:"shaved",c:[26,22,20]},earrings:[206,200,186],top:{kind:"apron",c:[108,102,112],apron:[210,200,184]},hat:{paint:tf_doek([170,152,134])},breath:0.32}];
// what their hands hold, in figure space at the near hand's grip, behind the fingers (holdBack): washing to take back, folded and tied;
// a garment being sewn; a basket of things to sell, under a cloth
const tf_grip=h=>{const [x,y]=h.near,e=h.nearElbow,L=Math.hypot(x-e[0],y-e[1])||1;return[x+(x-e[0])/L*58,y+(y-e[1])/L*58];};
function tf_bundle(c,h){const [x,y]=tf_grip(h),col=[236,232,222];
  ag_soft(c,cc=>{cc.moveTo(x-70,y-40);cc.bezierCurveTo(x-30,y-70,x+70,y-66,x+96,y-34);cc.bezierCurveTo(x+118,y,x+100,y+58,x+60,y+64);cc.bezierCurveTo(x+10,y+72,x-60,y+66,x-82,y+30);cc.bezierCurveTo(x-96,y,x-90,y-24,x-70,y-40);cc.closePath();},
    col,[255,255,255],x+50,y-40,120,"rgba(60,50,40,0.35)",14);
  c.strokeStyle="rgba(120,108,96,0.5)";c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(x-60,y-20);c.quadraticCurveTo(x+10,y-2,x+84,y-26);c.stroke();c.beginPath();c.moveTo(x-40,y+30);c.quadraticCurveTo(x+20,y+44,x+80,y+28);c.stroke();}
function tf_garment(c,h){const [x,y]=tf_grip(h),col=[176,164,150];
  ag_soft(c,cc=>ag_rect(cc,x-40,y-56,150,104,8),col,ag_lt(col,0.35),x+60,y-40,120,"rgba(60,50,40,0.35)",10);
  c.strokeStyle=rgba(ag_dk(col,0.35),0.6);c.lineWidth=2;c.setLineDash([7,6]);c.beginPath();c.moveTo(x-28,y-20);c.lineTo(x+98,y-20);c.stroke();c.setLineDash([]);
  c.strokeStyle="rgba(60,56,60,0.9)";c.lineWidth=2;c.beginPath();c.moveTo(x+70,y-40);c.lineTo(x+104,y-74);c.stroke();c.strokeStyle="rgba(236,232,222,0.9)";c.beginPath();c.moveTo(x+104,y-74);c.quadraticCurveTo(x+120,y-50,x+96,y-24);c.stroke();}
function tf_basket(c,h){const [x,y]=tf_grip(h),wv=[176,146,104];
  ag_soft(c,cc=>{cc.moveTo(x-96,y-30);cc.lineTo(x+126,y-30);cc.bezierCurveTo(x+122,y+20,x+90,y+48,x+15,y+50);cc.bezierCurveTo(x-60,y+48,x-92,y+20,x-96,y-30);cc.closePath();},wv,ag_lt(wv,0.3),x+70,y-10,140,"rgba(60,46,30,0.4)",12);
  c.strokeStyle=rgba(ag_dk(wv,0.3),0.5);c.lineWidth=2;for(let k=0;k<3;k++){const yy=y-14+k*18;c.beginPath();c.moveTo(x-88+k*6,yy);c.lineTo(x+118-k*8,yy);c.stroke();}
  ag_soft(c,cc=>{cc.moveTo(x-104,y-30);cc.bezierCurveTo(x-60,y-74,x+80,y-78,x+134,y-30);cc.closePath();},[232,226,214],[255,255,255],x+60,y-60,120,"rgba(60,50,40,0.3)",10);}

/* ---------------------------------------------------------------- the stokvel as a ring
   tf_ring(ctx, cx, cy, r, o): o.n members round a ring of radius r, each a small person on a disc of paper; the ring that joins them
   draws itself from the top, clockwise (o.ring, 0 to 1); the pot in the middle (o.pot, 0 to 1), filling as the coins come in (o.fill);
   each member's coin going in (o.pay[i], 0 to 1, a green coin on its way to the pot); the pot going to one member, all of it (o.take
   {i, u}); a green ring round each who has had her turn (o.had[i], 0 to 1); lines from every member to every other (o.web, 0 to 1);
   one member in hard times (o.hard {i, u}: an amber ring round her, sunk a little out of the ring) and carried by all the others
   (o.carry {i, u}: green lines from each of them to her, and she comes back up into the ring); one stepping away (o.away {i, u}: she
   goes out of the ring, and the others close up round it, the ring still whole); every line to one member (o.lean {i, u}: amber lines
   from each of the others to her, and none from her); o.names, a name under each (o.nameA); o.dim, members drawn faint (0 to 1, by i);
   o.show, each member coming in (0 to 1, by i); o.mark {i, a}, an amber ring round one member, nothing else changing; the team's work in the middle instead of the pot (o.work, 0 to 1), and every member
   holding it (o.hold, 0 to 1: a green line from each); o.a. Colours: coins and the support that carries someone in green; what's at
   risk in amber; people and the ring in ink. */
// the team's work: three sheets of paper in a stack, each with a few lines on it
function tf_work(ctx,x,y,s,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;for(let k=2;k>=0;k--){const ox=x-34*s+k*7*s,oy=y-40*s-k*7*s;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.26)";ctx.shadowBlur=10*s;ctx.shadowOffsetX=LP.sdx*0.4*s;ctx.shadowOffsetY=4*s;ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(ox,oy,68*s,84*s);ctx.restore();
  if(k===0){ctx.fillStyle=rgba(LP.mut,0.55);for(let l=0;l<4;l++)ctx.fillRect(ox+12*s,oy+18*s+l*15*s,(l===3?28:44)*s,4*s);}}ctx.restore();}
// a member: a small person on a disc of paper, with rings round it (o.rings: [{col, a}], drawn in order)
function tf_member(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.28)";ctx.shadowBlur=10*s;ctx.shadowOffsetX=LP.sdx*0.4*s;ctx.shadowOffsetY=4*s;ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.arc(x,y,34*s,0,TAU);ctx.fill();ctx.restore();
  for(const rg of (o.rings||[]))if(rg.a>0.004){ctx.strokeStyle=rgba(rg.col,rg.a);ctx.lineWidth=6*s;ctx.beginPath();ctx.arc(x,y,34*s,0,TAU);ctx.stroke();}
  ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(x,y-9*s,10.5*s,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(x-19*s,y+21*s);ctx.bezierCurveTo(x-19*s,y+6*s,x-10*s,y+3*s,x,y+3*s);ctx.bezierCurveTo(x+10*s,y+3*s,x+19*s,y+6*s,x+19*s,y+21*s);ctx.closePath();ctx.fill();
  ctx.restore();}
function tf_coin(ctx,x,y,r,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.55)";ctx.lineWidth=Math.max(1.5,r*0.18);ctx.beginPath();ctx.arc(x,y,r*0.62,0,TAU);ctx.stroke();ctx.restore();}
// the pot: a tin with its lid off, coins showing in it as it fills (fill, 0 to 1)
function tf_pot(ctx,x,y,s,fill,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const w=74*s,h=56*s;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=12*s;ctx.shadowOffsetX=LP.sdx*0.5*s;ctx.shadowOffsetY=5*s;
  const g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,"rgb(120,120,122)");g.addColorStop(0.7,"rgb(196,196,194)");g.addColorStop(1,"rgb(170,170,170)");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x-w/2,y-h/2);ctx.lineTo(x-w/2,y+h/2);ctx.ellipse(x,y+h/2,w/2,10*s,0,Math.PI,0,true);ctx.lineTo(x+w/2,y-h/2);ctx.closePath();ctx.fill();ctx.restore();
  ctx.fillStyle="rgb(70,70,74)";ctx.beginPath();ctx.ellipse(x,y-h/2,w/2,10*s,0,0,TAU);ctx.fill();
  const f=clamp(fill||0,0,1);if(f>0){ctx.save();ctx.beginPath();ctx.ellipse(x,y-h/2,w/2-3*s,8*s,0,0,TAU);ctx.clip();const n=Math.round(f*9);
    for(let k=0;k<n;k++)tf_coin(ctx,x-24*s+(k%5)*12*s,y-h/2+(k<5?-1:3)*s,7*s,1);ctx.restore();}
  ctx.strokeStyle="rgba(240,240,236,0.8)";ctx.lineWidth=2*s;ctx.beginPath();ctx.ellipse(x,y-h/2,w/2,10*s,0,0,TAU);ctx.stroke();ctx.restore();}
// where member i stands: on the ring; out of it as she steps away, while the others close up to even spaces round the whole ring,
// keeping their order (the k-th after her, clockwise, from (k + 1)/n of the way round from her to (k + 0.5)/(n - 1)); a little out of
// it in hard times, until the others carry her back
function tf_ringPos(n,i,cx,cy,r,o){const a0=-Math.PI/2,aw=o.away;let an=a0+i*TAU/n,rr=r;
  if(aw&&aw.u>0){const u=ag_sine(aw.u),ai=a0+aw.i*TAU/n;if(i===aw.i)rr=lerp(r,r*1.62,u);
    else{const k=(i-aw.i-1+n)%n;an=ai+lerp((k+1)*TAU/n,(k+0.5)*TAU/(n-1),u);}}
  const hd=o.hard&&o.hard.i===i?ag_sine(o.hard.u)*(1-ag_sine(o.carry&&o.carry.i===i?o.carry.u:0)):0;rr+=hd*r*0.28;
  return[cx+Math.cos(an)*rr,cy+Math.sin(an)*rr];}
function tf_ring(ctx,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=o.n||8,s=o.s||1;ctx.save();ctx.globalAlpha*=a;
  const P=[];for(let i=0;i<n;i++)P.push(tf_ringPos(n,i,cx,cy,r,o));
  // lines from every member to every other: trust, every member answering to the others
  if(o.web>0){ctx.strokeStyle=rgba(LP.ink,0.22*o.web);ctx.lineWidth=2;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){ctx.beginPath();ctx.moveTo(P[i][0],P[i][1]);ctx.lineTo(P[j][0],P[j][1]);ctx.stroke();}}
  // the ring
  const rg=o.ring==null?1:ag_sine(o.ring);if(rg>0){ctx.strokeStyle=rgba(LP.ink,1);ctx.lineWidth=5*s;ctx.lineCap="round";ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*rg);ctx.stroke();}
  // support, or the load: lines from the others to one member
  const toward=(i,u,col,w)=>{for(let j=0;j<n;j++){if(j===i)continue;const v=clamp(u*1.4-j/n*0.4,0,1);if(v<=0)continue;const A=P[j],B=P[i],e=ag_sine(v),ex=lerp(A[0],B[0],e),ey=lerp(A[1],B[1],e);
    ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=w*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(ex,ey);ctx.stroke();}};
  if(o.lean&&o.lean.u>0)toward(o.lean.i,o.lean.u,LP.amber,5);
  if(o.carry&&o.carry.u>0)toward(o.carry.i,o.carry.u,LP.green,6);
  // everyone holding the team's work: a green line from each member towards it (fading from one who steps away)
  if(o.hold>0)for(let j=0;j<n;j++){const v=clamp(o.hold*1.4-j/n*0.4,0,1);if(v<=0)continue;const A=P[j],e=ag_sine(v),fa=o.away&&o.away.i===j?1-ag_sine(o.away.u):1;if(fa<=0.004)continue;
    ctx.strokeStyle=rgba(LP.green,0.9*fa);ctx.lineWidth=6*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],cx,e*0.7),lerp(A[1],cy,e*0.7));ctx.stroke();}
  // the pot, or the team's work, and the coins going in and out
  if(o.pot>0)tf_pot(ctx,cx,cy,s,o.fill,ag_in(o.pot,0,1));
  if(o.work>0)tf_work(ctx,cx,cy,s,o.work);
  if(o.pay)for(let i=0;i<n;i++){const u=o.pay[i]||0;if(u<=0||u>=1)continue;const e=ag_sine(u),x=lerp(P[i][0],cx,e),y=lerp(P[i][1],cy-30*s,e)-Math.sin(Math.PI*e)*30*s;tf_coin(ctx,x,y,13*s,ag_in(u,0,0.15));}
  if(o.take&&o.take.u>0&&o.take.u<1){const e=ag_sine(o.take.u),B=P[o.take.i];for(let k=0;k<n;k++){const d=clamp(e*1.2-k*0.025,0,1),x=lerp(cx,B[0],d)+(k-n/2)*3*s,y=lerp(cy-30*s,B[1],d)-Math.sin(Math.PI*d)*40*s-k*4*s;tf_coin(ctx,x,y,13*s,1);}}
  // the members
  for(let i=0;i<n;i++){const had=o.had?o.had[i]||0:0,hd=o.hard&&o.hard.i===i?ag_in(o.hard.u,0,0.4):0,ld=o.lean&&o.lean.i===i?ag_in(o.lean.u,0.3,0.6):0,cr=o.carry&&o.carry.i===i?ag_in(o.carry.u,0.6,0.6):0;
    const mk=o.mark&&o.mark.i===i?clamp(o.mark.a,0,1):0,dm=o.dim?o.dim[i]||0:0,sh=o.show?clamp(o.show[i]||0,0,1):1;if(sh<=0.004)continue;
    ctx.save();if(sh<1)ag_about(ctx,P[i][0],P[i][1],lerp(0.7,1,ag_sine(sh)));
    tf_member(ctx,P[i][0],P[i][1],s,{rings:[{col:LP.green,a:had},{col:LP.amber,a:Math.max(hd,ld,mk)*(1-cr)},{col:LP.green,a:cr}],a:(1-dm*0.6)*ag_sine(sh)});ctx.restore();
    if(o.names&&o.names[i]&&(o.nameA==null||o.nameA>0)){const below=P[i][1]>=cy-r*0.2;lp_T(ctx,o.names[i],P[i][0],P[i][1]+(below?78:-52)*s,{w:700,size:28,align:"center",a:o.nameA==null?1:o.nameA});}}
  ctx.restore();}
