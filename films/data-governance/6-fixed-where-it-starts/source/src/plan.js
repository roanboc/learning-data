/* ===== Fixed where it starts: the places and the pictures =====
   The places are painted once and kept (shared/src/finish.js). The past: the general hospital in Vienna in 1847 (its courtyard, the
   maternity corridor with the two clinics' doors and the autopsy room's, the basin by the first clinic's door and the hands at it, the
   register of deaths, the first clinic's ward), then Semmelweis's room in Pest, 1858 to 1862. Today, only the university's own places
   (the series' rooms.js): Yusuf's office, his screen and his board, binder 15's page, the data team's room and Jun's screen, the
   learning team's desk (Tom's, new in this film) and its screen, a learner's phone over the campus, the platform team's desk at night,
   and the stewards' meeting room, and Tom's desk from above. The pictures are the film's own things, all of them the university's own
   papers, in plain words: the scorecard, the issue log and the issue card, the data team's clean-up on its card, the two wallets, the
   pipe, the buckets, the mop and the leak sensor, the trail of cards, the sign-up form and the phone's keyboard, the badges, the usual
   shape of the badges, the rule card, the three cards. Every name starts with fw_ or FW_. */

/* ---------- colours ---------- */
// the past: the hospital's ochre and stone, its plaster and flagstones, dark oak doors, iron beds, grey blankets, white enamel; today:
// the leak's blue-grey and the bucket's tin (the learning team's soft apricot walls are the series', GV_ROOM.learn)
const FW={ochre:[238,214,166],stone:[218,208,188],plaster:[236,226,204],dado:[190,172,144],flag:[202,192,172],door:[120,86,58],
  iron:[70,72,82],sheet:[248,246,240],blanket:[150,152,162],enamel:[246,246,242],lime:[226,232,228],wood:[150,106,70],walnut:[110,74,50],
  leak:[106,140,172],tin:[170,178,190],cotton:[232,222,196],amber:[232,164,40],amberInk:[150,92,0]};
// the skin of the hands at the basin, and the same skin after weeks of chlorinated lime
const FW_SKIN=[234,196,166],FW_RAW=[226,150,130];

/* ---------- the people of 1847 ---------- */
// doctors in dark frock coats, waistcoats and cravats (white coats came decades later), a student in a lighter coat, a midwife in a
// dark dress, a white apron and a cap; all of them invented but Semmelweis, who wears what a young doctor wore
Object.assign(PEOPLE,{
  semmelweis:{name:"Ignaz Semmelweis",role:"first clinic",side:"",edge:GV_PAST,seed:61,skin:FW_SKIN,hair:{style:"side",c:[92,66,46]},
    top:{kind:"frock",c:[44,46,58],vest:[104,90,74],inner:[246,244,238],tie:[30,28,34]},bottom:{c:[58,58,66]},shoe:[24,22,24],build:{sh:74,hip:60,h:1.0}},
  doctor1:{name:"",role:"doctor",side:"",edge:GV_PAST,seed:62,skin:[226,188,160],hair:{style:"cropped",c:[176,170,166]},beard:[184,178,172],
    top:{kind:"frock",c:[60,50,46],vest:[82,72,64],inner:[244,242,236],tie:[28,26,30]},bottom:{c:[52,50,56]},shoe:[24,22,24],build:{sh:78,hip:64,h:1.01}},
  doctor2:{name:"",role:"doctor",side:"",edge:GV_PAST,seed:63,skin:[214,170,138],hair:{style:"side",c:[40,32,30]},beard:[46,36,32],
    top:{kind:"frock",c:[52,58,72],vest:[120,104,84],inner:[246,244,238],tie:[34,30,38]},bottom:{c:[60,62,70]},shoe:[24,22,24],build:{sh:76,hip:62,h:1.03}},
  student:{name:"",role:"student",side:"",edge:GV_PAST,seed:64,skin:[236,200,172],hair:{style:"cropped",c:[136,96,60]},
    top:{kind:"frock",c:[104,92,80],vest:[150,132,104],inner:[246,244,238],tie:[60,46,40]},bottom:{c:[90,84,80]},shoe:[40,32,28],build:{sh:72,hip:60,h:0.98}},
  midwife:{name:"",role:"midwife",side:"",edge:GV_PAST,seed:65,skin:[230,190,162],hair:{style:"cropped",c:[86,60,44]},hat:"coif",hatC:[246,244,238],
    top:{kind:"gown",c:[72,62,76],inner:[240,236,228],apron:[246,244,236]},bottom:{c:[60,54,62]},shoe:[40,32,30],build:{sh:66,hip:62,h:0.95}}
});
// a hand cupped at the basin, both hands rubbed together, and writing fast at a desk
Object.assign(POSE,{fw_wash:{L:[0.3,-0.8],R:[0.3,-0.8],feet:22,shift:0,tilt:0.1,turn:0,gaze:[0,1],look:1},
  fw_rub:{L:[0.3,-2.0],R:[0.3,-2.0],feet:24,shift:0,tilt:0.04,turn:0.05,gaze:[0.1,0.8],look:1}});

/* ---------- 1847: the hospital's courtyard ---------- */
// a long building of two storeys round a courtyard of lime trees: rows of tall windows, an arched gateway under a pediment, a lamp,
// a cart by the wall, a few people crossing
const FW_CT={fy:668,top:250,ridge:176};
function fw_window(ctx,x,y,w,h,depth){wc_part(ctx,wc_rect(x-8,y-8,w+16,h+16),wc_lit(FW.stone,0.25),depth,{lw:1.1});wc_flat(ctx,wc_rect(x,y,w,h),[104,118,140],depth,"pane");
  ctx.save();ctx.strokeStyle=rgba([246,242,232],0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h);ctx.moveTo(x,y+h*0.42);ctx.lineTo(x+w,y+h*0.42);ctx.stroke();ctx.restore();
  wc_flat(ctx,wc_rect(x-12,y+h+6,w+24,10),wc_dim(FW.stone,0.08),depth,"sill");}
function fw_paintCourt(ctx){const P=WCP,{fy,top,ridge}=FW_CT;wc_sky(ctx,fy-80,21,{sun:[1660,140],clouds:3,cx:200,cw:1400,cy:50,ch:110});
  // the roof, with chimneys, and the building's front
  for(const cx of [210,640,1290,1720])wc_part(ctx,wc_rect(cx,ridge-38,34,52),[176,150,130],0.55);
  wc_part(ctx,[[-60,top+4],[W+60,top+4],[W+60,ridge],[-60,ridge]],P.slate,0.55);
  wc_part(ctx,wc_rect(-60,top,W+120,fy-top+6),FW.ochre,0.62,{seed:12});wc_flat(ctx,wc_rect(-60,top-4,W+120,18),wc_lit(FW.stone,0.1),0.62,"cornice");
  wc_flat(ctx,wc_rect(-60,452,W+120,12),FW.stone,0.62,"string");wc_flat(ctx,wc_rect(-60,fy-34,W+120,40),wc_dim(FW.stone,0.06),0.62,"plinth");
  for(let i=0;i<15;i++){const x=40+i*128;if(x>820&&x<1080)continue;fw_window(ctx,x,296,56,118,0.62);fw_window(ctx,x,494,56,118,0.62);}
  // the gateway in the middle: an arch under a pediment, the courtyard beyond it in shadow
  wc_part(ctx,[[860,300],[1060,300],[960,232]],wc_lit(FW.stone,0.12),0.62,{lw:1.2});fw_window(ctx,932,320,56,104,0.62);
  wc_part(ctx,wc_rect(880,470,160,fy-470),wc_lit(FW.stone,0.18),0.62);wc_wash(ctx,wc_arched(906,500,108,fy-500),[84,74,70],{depth:0.62,kind:"door",lw:1.3});
  // the courtyard: packed gravel, paler where people walk; lime trees, a lamp, a cart against the wall, people crossing
  wc_wash(ctx,wc_rect(-60,fy,W+120,H-fy+60),[224,210,180],{depth:0.8,kind:"ground",line:false,seed:14});
  wc_wash(ctx,wc_band(wc_smooth([[960,fy+4],[930,820],[880,1100]],8),150,560),[234,222,196],{depth:0.8,kind:"path",line:false});
  wc_contact(ctx,140,420,fy+40,0.7,0.2);wc_contact(ctx,1500,1860,fy+44,0.7,0.2);
  wc_roundTree(ctx,190,fy+46,330,0.66,P.leaf2);wc_roundTree(ctx,560,fy+34,290,0.62);wc_roundTree(ctx,1390,fy+36,300,0.62,P.leaf2);wc_roundTree(ctx,1760,fy+52,340,0.66);
  wc_lamp(ctx,1150,fy+96,250,0.75);
  // the cart: a box of planks on two wheels, its shafts resting on the ground
  wc_part(ctx,wc_rect(286,fy-6,190,64),[156,116,80],0.7);wc_part(ctx,[[476,fy+40],[610,fy+86],[604,fy+96],[470,fy+52]],[132,96,66],0.7);
  for(const wx of [320,440]){ctx.save();ctx.strokeStyle=rgba([92,70,52],0.85);ctx.lineWidth=7;ctx.beginPath();ctx.arc(wx,fy+70,34,0,TAU);ctx.stroke();ctx.lineWidth=3;
    for(let k=0;k<6;k++){const a=k*Math.PI/3;ctx.beginPath();ctx.moveTo(wx,fy+70);ctx.lineTo(wx+Math.cos(a)*32,fy+70+Math.sin(a)*32);ctx.stroke();}ctx.restore();}
  wc_walker(ctx,760,fy+84,92,[52,52,62],0.72);wc_walker(ctx,1236,fy+64,78,[86,68,58],0.66);wc_walker(ctx,1290,fy+60,74,[70,64,80],0.64);
  wc_tufts(ctx,()=>fy+12,0,W,40,0.8,7);}

/* ---------- 1847: the maternity corridor ---------- */
// a long wall facing us: at its left end the autopsy room's door, narrower and darker; then the basin and the first clinic's door, then
// the second clinic's; a plate over each door, two lamps on brackets, a bench, flagstones. So the doctors' way from the autopsy room to
// the first clinic is short, and passes the basin, and the midwives come from the other end. People walk in front of it, at FW_CR.walk.
const FW_CR={fy:812,dh:430,doors:[[200,190],[760,230],[1300,230]],walk:906,s:0.62,basin:640};
function fw_paintCorridor(ctx){const C=FW_CR,fy=C.fy;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,fy-150),FW.plaster,{kind:"plaster",line:false,seed:31});wc_wash(ctx,wc_rect(-40,fy-190,W+80,190),FW.dado,{kind:"plaster",line:false,seed:32});
  wc_flat(ctx,wc_rect(-40,fy-196,W+80,12),wc_dim(FW.dado,0.12),1,"rail");wc_wash(ctx,wc_rect(-40,-40,W+80,110),wc_dim(FW.plaster,0.05),{kind:"plaster",line:false,seed:33});
  wc_flat(ctx,wc_rect(-40,66,W+80,16),wc_lit(FW.stone,0.2),1,"cornice");
  // the light from the windows behind us, falling across the wall
  ctx.save();ctx.globalCompositeOperation="screen";for(const lx of [120,700,1260]){const g=ctx.createLinearGradient(lx,0,lx+340,0);g.addColorStop(0,"rgba(255,246,220,0)");g.addColorStop(0.5,"rgba(255,246,220,0.32)");
    g.addColorStop(1,"rgba(255,246,220,0)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(lx,90);ctx.lineTo(lx+340,90);ctx.lineTo(lx+250,fy);ctx.lineTo(lx-90,fy);ctx.closePath();ctx.fill();}ctx.restore();
  // the doors: a stone surround, two panels each, a brass handle; a plate over each
  C.doors.forEach(([x,w],i)=>{const top=fy-C.dh,dark=i===0;wc_part(ctx,wc_rect(x-22,top-22,w+44,C.dh+22),wc_lit(FW.stone,0.1),1,{lw:1.3});
    wc_wash(ctx,wc_rect(x,top,w,C.dh),dark?[92,70,56]:FW.door,{kind:"door",lw:1.5,seed:40+i});
    for(const [py,ph] of [[top+30,C.dh*0.42],[top+60+C.dh*0.42,C.dh*0.42]])wc_flat(ctx,wc_rect(x+26,py,w-52,ph),wc_dim(dark?[92,70,56]:FW.door,0.12),1,"panel");
    wc_wash(ctx,wc_ell(x+w-34,top+C.dh*0.52,9,9,14),[214,176,92],{kind:"thing",lw:1});
    wc_part(ctx,wc_rect(x+w/2-80,top-82,160,44),dark?[96,90,88]:[226,216,192],1,{lw:1.2});});
  // a bench at the far end, past the second clinic, and two lamps on brackets
  wc_contact(ctx,1590,1890,fy+6,1,0.3);wc_part(ctx,wc_rect(1590,fy-118,300,22),FW.wood,1);for(const bx of [1610,1850])wc_part(ctx,wc_rect(bx,fy-98,20,98),wc_dim(FW.wood,0.15),1);
  wc_part(ctx,wc_rect(1590,fy-230,300,18),wc_dim(FW.wood,0.05),1);
  for(const lx of [470,1130]){ctx.save();ctx.strokeStyle=rgba([70,62,58],0.85);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(lx,300);ctx.lineTo(lx,252);ctx.lineTo(lx+30,252);ctx.stroke();ctx.restore();
    wc_wash(ctx,[[lx+14,252],[lx+46,252],[lx+40,212],[lx+20,212]],[246,232,190],{kind:"thing",lw:1.2});wc_flat(ctx,wc_rect(lx+18,206,24,8),[70,62,58],1,"cap");
    ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+30,236,90,[255,230,170],0.32);ctx.restore();}
  // flagstones, their joints running away from us
  wc_wash(ctx,wc_rect(-40,fy,W+80,H-fy+40),FW.flag,{kind:"ground",line:false,seed:35});ctx.save();ctx.strokeStyle=rgba(wc_dim(FW.flag,0.2),0.35);ctx.lineWidth=2;
  for(let i=0;i<6;i++){const y=fy+8+i*i*9+i*14;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y);ctx.stroke();}
  for(let i=-14;i<=14;i++){ctx.beginPath();ctx.moveTo(960+i*110,fy);ctx.lineTo(960+i*300,H+40);ctx.stroke();}ctx.restore();
  wc_flat(ctx,wc_rect(-40,fy-8,W+80,10),wc_dim(FW.dado,0.25),1,"skirting");}
// a door opening (u, 0 to 1): the room behind it (dark for the autopsy room, col for a ward's light), then the door's edge
function fw_doorOpen(ctx,i,u,col){if(u<=0.01)return;const C=FW_CR,[x,w]=C.doors[i],top=C.fy-C.dh,k=easeCam(clamp(u,0,1));
  ctx.save();ctx.fillStyle=rgba(col||[40,34,32],0.94);ctx.fillRect(x,top,w,C.dh);ctx.restore();
  wc_wash(ctx,[[x,top],[x+w*(1-k*0.82),top+12*k],[x+w*(1-k*0.82),C.fy-6*k],[x,C.fy]],i===0?[92,70,56]:FW.door,{kind:"door",lw:1.4,seed:47+i});}

// the basin on its washstand, by the first clinic's door: a small table, a white enamel bowl of chlorinated lime, a towel over its rail;
// kept, drawn with its feet at (x,y) and s times its size
function fw_basinC(){return wc_kept("fwBasin",230,250,q=>{q.translate(14,10);const col=wc_dim(FW.wood,0.05);
  wc_contact(q,10,190,232,1,0.35);for(const lx of [24,170])wc_part(q,[[lx,70],[lx+12,70],[lx+16,232],[lx+4,232]],wc_dim(col,0.15),1);
  wc_part(q,wc_rect(14,150,180,10),col,1);wc_part(q,wc_rect(4,62,200,18),col,1);
  wc_wash(q,[[30,62],[178,62],[164,30],[44,30]],FW.enamel,{kind:"thing",lw:1.4,seed:3});wc_wash(q,wc_ell(104,30,74,12,28),FW.lime,{kind:"thing",lw:1.2,seed:4});
  wc_wash(q,[[176,74],[200,74],[204,172],[182,166]],[244,240,228],{kind:"cover",lw:1.1,seed:5});
  wc_wash(q,[[150,30],[164,-4],[176,0],[170,32]],FW.enamel,{kind:"thing",lw:1.1,seed:6});});}
function fw_basin(ctx,x,y,s,a){if(a!=null&&a<=0.01)return;withA(ctx,a==null?1:a,()=>ctx.drawImage(fw_basinC(),x-118*s,y-242*s,230*s,250*s));}

/* ---------- 1847: hands at the basin, close ---------- */
// the basin from above, as someone standing at it sees it: the wall behind, the washstand's top, the bowl's white rim and the milky
// water in it; the hands and the ripples are drawn every frame
const FW_HD={cx:960,cy:560,rx:600,ry:266,wx:560,wy:236,water:572};
function fw_paintHands(ctx){const D=FW_HD;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,260),FW.plaster,{kind:"plaster",line:false,seed:51});wc_wash(ctx,wc_rect(-40,200,W+80,H),FW.wood,{kind:"plaster",line:false,seed:52});
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.strokeStyle=rgba(wc_dim(FW.wood,0.25),0.35);ctx.lineWidth=2.5;for(let i=0;i<14;i++){const y=230+i*64;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+5*Math.sin(x/260+i)+2*Math.sin(x/70+i*3));ctx.stroke();}ctx.restore();
  ctx.save();ctx.filter="blur(18px)";ctx.fillStyle="rgba(60,40,24,0.36)";ctx.beginPath();ctx.ellipse(D.cx+20,D.cy+30,D.rx,D.ry,0,0,TAU);ctx.fill();ctx.restore();
  wc_wash(ctx,wc_ell(D.cx,D.cy,D.rx,D.ry,90),FW.enamel,{kind:"thing",lw:1.8,seed:53});
  wc_wash(ctx,wc_ell(D.cx,D.cy+12,D.wx,D.wy,90),FW.lime,{kind:"thing",lw:1.4,seed:54});
  // the bowl's inside, darker at the far side, and the light on the water
  ctx.save();wc_tr(ctx,wc_ell(D.cx,D.cy+12,D.wx,D.wy,90));ctx.clip();const g=ctx.createLinearGradient(0,D.cy-D.wy,0,D.cy+D.wy);g.addColorStop(0,"rgba(120,130,130,0.22)");
  g.addColorStop(0.6,"rgba(120,130,130,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation="screen";wc_glowAt(ctx,D.cx-180,D.cy-80,260,[255,255,250],0.4);ctx.restore();}
// a hand, palm down, its fingers towards ang (0 points up the frame), the thumb on the side towards the other hand (side -1: a left
// hand, its thumb on its right); the wrist at (x,y), s its size; skin its colour
function fw_hand(ctx,x,y,ang,side,s,skin,seed){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);const th=-side;
  // the thumb, from the side of the palm forwards and out
  wc_wash(ctx,wc_smooth([[th*30,-14],[th*58,-46],[th*74,-86],[th*70,-104],[th*56,-102],[th*44,-72],[th*20,-46]],5),wc_dim(skin,0.03),{kind:"limb",lw:1.3,seed:seed+1});
  // the back of the hand and the four fingers, together, the middle one longest
  // left to right, for a thumb on the right: the little finger, the ring finger, the middle one, the index; mirrored for a thumb on the left
  const base=[[-30,-150],[-11,-174],[9,-184],[27,-170]],tips=th>0?base:base.map(([a,b])=>[-a,b]).reverse(),pts=[[-36,0],[-40,-60],[-40,-96]];
  for(const [fx,fy] of tips)pts.push([fx-9,fy+18],[fx,fy],[fx+9,fy+18]);
  pts.push([40,-96],[38,-60],[34,0]);wc_wash(ctx,wc_smooth(pts,4),skin,{kind:"limb",lw:1.4,seed});
  ctx.strokeStyle=rgba(wc_dim(skin,0.32),0.5);ctx.lineWidth=2.2;ctx.lineCap="round";for(const fx of [-20,0,19]){ctx.beginPath();ctx.moveTo(fx,-100);ctx.lineTo(fx*1.05,-150);ctx.stroke();}
  // the knuckles, faintly
  ctx.strokeStyle=rgba(wc_dim(skin,0.22),0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-30,-92);ctx.quadraticCurveTo(0,-100,30,-92);ctx.stroke();ctx.restore();}
// a forearm in a dark sleeve with a white cuff, from below the frame to the wrist at (wx,wy)
function fw_forearm(ctx,wx,wy,bx,col,seed){const d=Math.atan2(H+120-wy,bx-wx),nx=-Math.sin(d),ny=Math.cos(d),w0=50,w1=104,c=[Math.cos(d),Math.sin(d)];
  wc_wash(ctx,[[wx+nx*w0+c[0]*30,wy+ny*w0+c[1]*30],[bx+nx*w1,H+120],[bx-nx*w1,H+120],[wx-nx*w0+c[0]*30,wy-ny*w0+c[1]*30]],col,{kind:"coat",lw:1.4,seed});
  wc_wash(ctx,[[wx+nx*44,wy+ny*44],[wx+nx*52+c[0]*40,wy+ny*52+c[1]*40],[wx-nx*52+c[0]*40,wy-ny*52+c[1]*40],[wx-nx*44,wy-ny*44]],[246,244,238],{kind:"coat",lw:1.2,seed:seed+1});}
// both hands at the basin: they come in (inn, 0 to 1), dip (dip), and rub, palms down, side by side; the water closes over them and
// rings spread from each. skin: the hands' colour; sleeve: the coat's
function fw_hands(ctx,t,inn,dip,o){o=o||{};const D=FW_HD,e=easeCam(clamp(inn,0,1)),dp=clamp(dip,0,1),skin=o.skin||FW_SKIN,sleeve=o.sleeve||[44,46,58],
    rub=(o.rub||0)*Math.sin(t*5.2),y0=lerp(1240,640,e)+40*dp,hands=[[-1,820+rub*14,y0+rub*6,0.22],[1,1100-rub*14,y0-rub*6,-0.2]];
  for(const [s,x,y,a] of hands){fw_forearm(ctx,x-Math.sin(a)*20,y+40,x+s*260,sleeve,70+s*5);fw_hand(ctx,x,y,a,s,1.25,skin,80+s*7);}
  // the water over the hands: milky, paler where it's deep; then rings
  if(dp>0.01){ctx.save();wc_tr(ctx,wc_ell(D.cx,D.cy+12,D.wx,D.wy,90));ctx.clip();ctx.beginPath();ctx.rect(0,0,W,y0+10);ctx.clip();
    ctx.fillStyle=rgba(FW.lime,0.62*dp);ctx.fillRect(0,0,W,H);ctx.restore();
    for(const [s,x,y] of hands)for(let k=0;k<3;k++){const u=((t*0.55+k/3+(s>0?0.17:0))%1),r=70+190*u;ctx.save();wc_tr(ctx,wc_ell(D.cx,D.cy+12,D.wx,D.wy,90));ctx.clip();
      ctx.strokeStyle=rgba([255,255,255],0.5*(1-u)*dp);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-120,r,r*0.42,0,0,TAU);ctx.stroke();ctx.restore();}}}

/* ---------- 1847: the register ---------- */
// a page of the clinic's register, close: ruled lines, a red margin, the fold into the spine; the months and their deaths are written in
// as the film reaches them (fw_register)
function fw_paintRegister(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[246,238,214],{kind:"paper",line:false,seed:61});
  ctx.save();ctx.strokeStyle="rgba(120,140,170,0.28)";ctx.lineWidth=2;for(let y=226;y<H;y+=90){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.strokeStyle="rgba(190,70,60,0.4)";for(const x of [300,308]){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}ctx.restore();
  const g=ctx.createLinearGradient(0,0,170,0);g.addColorStop(0,"rgba(90,70,50,0.34)");g.addColorStop(0.45,"rgba(90,70,50,0.1)");g.addColorStop(1,"rgba(90,70,50,0)");ctx.fillStyle=g;ctx.fillRect(0,0,170,H);}
// the months, a mark for the washing, and a bar for each month's deaths; the second clinic's level, dashed (row(k) and line, 0 to 1)
const FW_REG=[["April","18.3%",18.3],["mid-May","chlorinated lime",0],["June","2.2%",2.2],["July","1.2%",1.2],["August","1.9%",1.9]],FW_RG={x:360,y0:316,dy:90,bx:880,k:33};
function fw_register(ctx,row,line,head){const R=FW_RG;wc_hand(ctx,"First clinic · deaths of mothers · 1847",R.x,186,{size:48,w:700,col:WCP.parchInk,p:head==null?1:head});
  FW_REG.forEach(([m,v,pc],k)=>{const p=row(k);if(p<=0)return;const y=R.y0+k*R.dy,note=pc===0;
    wc_hand(ctx,m,R.x,y,{size:44,w:600,col:note?WC_MUTED:WCP.parchInk,p:clamp(p*2,0,1)});wc_hand(ctx,v,R.x+250,y,{size:44,w:700,col:note?WC_MUTED:WCP.parchInk,p:clamp(p*2-0.5,0,1)});
    if(!note){const L=pc*R.k*easeCam(clamp(p*1.6-0.6,0,1));ctx.save();ctx.fillStyle=rgba(WCP.parchInk,0.55);ctx.fillRect(R.bx,y-26,L,22);ctx.restore();}});
  if(line>0){const x=R.bx+3.3*R.k;ctx.save();ctx.strokeStyle=rgba([180,60,50],0.75*clamp(line*2,0,1));ctx.lineWidth=3;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(x,R.y0-70);
    ctx.lineTo(x,lerp(R.y0-70,R.y0+4*R.dy+20,easeCam(clamp(line,0,1))));ctx.stroke();ctx.restore();
    wc_hand(ctx,"second clinic: about 1 in 30",x+18,R.y0-80,{size:34,w:600,col:[176,60,50],p:clamp(line*1.4-0.3,0,1)});}}

/* ---------- 1847: the first clinic's ward ---------- */
// a long room, whitewashed, under tall arched windows: iron beds, their heads to the wall, a mother resting in each under a grey
// blanket; the door from the corridor at the right, the basin beside it (drawn every frame)
const FW_WD={fy:760,beds:[170,450,730,1010,1290],door:[1630,210,430],basin:[1520,780],win:[310,590,870,1150]};
function fw_bed(ctx,x,fy,hair,skin,seed){const R=wc_rng(seed),hw=96,fw=118,head=fy-128,foot=fy+64;
  // the head rail against the wall, the mattress running towards us, the sheet turned down, the pillow, the mother's head
  ctx.save();ctx.strokeStyle=rgba(FW.iron,0.9);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-hw,fy-40);ctx.lineTo(x-hw,head-70);ctx.moveTo(x+hw,fy-40);ctx.lineTo(x+hw,head-70);
  ctx.moveTo(x-hw,head-62);ctx.lineTo(x+hw,head-62);ctx.stroke();ctx.lineWidth=4;for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(x-hw+i*hw/3,head-62);ctx.lineTo(x-hw+i*hw/3,head);ctx.stroke();}ctx.restore();
  wc_part(ctx,[[x-hw,head],[x+hw,head],[x+fw,foot],[x-fw,foot]],FW.sheet,1,{seed});wc_part(ctx,[[x-fw,foot],[x+fw,foot],[x+fw,foot+40],[x-fw,foot+40]],wc_dim(FW.sheet,0.08),1,{seed:seed+1});
  wc_wash(ctx,wc_rrPts(x-70,head-6,140,46,20),[252,252,248],{kind:"thing",lw:1.2,seed:seed+2});
  wc_wash(ctx,wc_ell(x+(R()-0.5)*10,head+12,30,26,24),hair,{kind:"head",lw:1.1,seed:seed+3});wc_wash(ctx,wc_ell(x+(R()-0.5)*8,head+26,22,20,24),skin,{kind:"head",lw:1.1,seed:seed+4});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(skin,0.45),0.7);ctx.lineWidth=2;for(const s of [-1,1]){ctx.beginPath();ctx.arc(x+s*8,head+26,5,0.2,Math.PI-0.2);ctx.stroke();}ctx.restore();
  wc_part(ctx,[[x-hw-6,head+40],[x+hw+6,head+40],[x+fw+10,foot+8],[x-fw-10,foot+8]],FW.blanket,1,{seed:seed+5});
  wc_flat(ctx,[[x-hw-4,head+40],[x+hw+4,head+40],[x+hw+6,head+58],[x-hw-6,head+58]],FW.sheet,1,"fold");
  // the foot rail, nearest us
  ctx.save();ctx.strokeStyle=rgba(FW.iron,0.95);ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-fw-6,foot+90);ctx.lineTo(x-fw-6,foot-26);ctx.lineTo(x+fw+6,foot-26);ctx.lineTo(x+fw+6,foot+90);ctx.stroke();
  ctx.lineWidth=4;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(x-fw-6+i*(fw*2+12)/5,foot-26);ctx.lineTo(x-fw-6+i*(fw*2+12)/5,foot+40);ctx.stroke();}ctx.restore();}
function fw_paintWard(ctx){const D=FW_WD,fy=D.fy;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,fy+40),[242,236,222],{kind:"plaster",line:false,seed:71});wc_wash(ctx,wc_rect(-40,fy-150,W+80,150),[220,210,188],{kind:"plaster",line:false,seed:72});
  for(const wx of D.win){ctx.save();wc_tr(ctx,wc_arched(wx-60,90,120,300));ctx.clip();wc_sky(ctx,420,wx,{clouds:1,cx:wx-60,cw:60,cy:120,ch:60});ctx.restore();
    wc_ink(ctx,wc_arched(wx-60,90,120,300),true,3,WC_INK,0.5,wx);ctx.save();ctx.strokeStyle=rgba([246,242,232],0.95);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(wx,90);ctx.lineTo(wx,390);ctx.moveTo(wx-60,250);ctx.lineTo(wx+60,250);ctx.stroke();ctx.restore();
    wc_flat(ctx,wc_rect(wx-74,392,148,12),wc_dim([242,236,222],0.12),1,"sill");}
  wc_wash(ctx,wc_rect(-40,fy,W+80,H-fy+40),[200,174,136],{kind:"ground",line:false,seed:73});ctx.save();ctx.strokeStyle=rgba([150,120,86],0.35);ctx.lineWidth=2;
  for(let i=-14;i<=14;i++){ctx.beginPath();ctx.moveTo(960+i*70,fy);ctx.lineTo(960+i*200,H+40);ctx.stroke();}ctx.restore();
  // the door from the corridor, open a little onto its light
  const [dx,dw,dh]=D.door;wc_part(ctx,wc_rect(dx-20,fy-dh-20,dw+40,dh+20),wc_lit(FW.stone,0.1),1,{lw:1.3});ctx.fillStyle=rgba([236,224,196],1);ctx.fillRect(dx,fy-dh,dw,dh);
  wc_wash(ctx,[[dx,fy-dh],[dx+dw*0.36,fy-dh+14],[dx+dw*0.36,fy-8],[dx,fy]],FW.door,{kind:"door",lw:1.4,seed:74});
  const hair=[[70,48,36],[120,80,50],[34,28,28],[176,140,92],[92,60,40]],skin=[[232,196,170],[220,178,146],[204,158,124],[236,204,180],[226,186,156]];
  D.beds.forEach((x,i)=>fw_bed(ctx,x,fy,hair[i],skin[i],80+i*9));}

/* ---------- Pest, 1858 to 1862: Semmelweis's room ---------- */
// his desk from above, for the paper and the book: dark walnut, an inkwell and a pen, a candlestick; and his room from the front, for
// the letters: a wall, a window, shelves of books, the desk over him (its front layer)
function fw_paintPestTop(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),FW.walnut,{kind:"plaster",line:false,seed:81});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(8);for(let i=0;i<60;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(FW.walnut,0.25+R()*0.12),0.2+R()*0.14);ctx.lineWidth=1+R()*2.4;
    ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+6*Math.sin(x/300+i)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_ell(1640,180,70,70,40),[60,56,60],{kind:"thing",lw:1.5,seed:82});wc_wash(ctx,wc_ell(1640,180,40,40,30),[24,22,30],{kind:"thing",line:false,seed:83});
  ctx.save();ctx.translate(1700,320);ctx.rotate(-0.7);wc_wash(ctx,[[-6,-170],[6,-170],[3,40],[-3,40]],[226,214,186],{kind:"thing",lw:1.1,seed:84});ctx.restore();
  wc_wash(ctx,wc_ell(250,180,96,96,40),[196,160,80],{kind:"thing",lw:1.5,seed:85});wc_wash(ctx,wc_ell(250,180,30,30,24),[246,238,214],{kind:"thing",lw:1.2,seed:86});}
// the journal of 1858, open, and the book of 1861, closed (a, b: 0 to 1, each laid on the desk). Their titles are bars without letters,
// as a title seen from afar (the film shows no words in another language, and the tags say what they are); each one's year is drawn
function fw_title(ctx,cx,y,ws,h,step,col){ctx.save();ctx.fillStyle=col;ws.forEach((w,i)=>{rr(ctx,cx-w/2,y+i*step,w,h,h/2);ctx.fill();});ctx.restore();}
function fw_pestPapers(ctx,a,b){if(a>0.01){const k=lerp(1.1,1,easeCam(clamp(a,0,1)));ctx.save();ctx.translate(820,560);ctx.scale(k,k);ctx.rotate(-0.04);withA(ctx,clamp(a*2.5,0,1),()=>{
    gv_sheet(ctx,-520,-380,520,760,{col:[244,236,214]});gv_sheet(ctx,0,-380,520,760,{col:[246,238,216]});
    fw_title(ctx,-260,-330,[330,210],16,30,rgba(WCP.parchInk,0.62));wc_T(ctx,"1858",-260,-244,{w:700,size:30,align:"center",col:WC_MUTED});
    for(const cx of [-480,-250,40,270])gv_lines(ctx,cx,-200+(cx>0?-80:0),200,cx>0?18:15,30,0.9);});ctx.restore();}
  if(b>0.01){const k=lerp(1.12,1,easeCam(clamp(b,0,1)));ctx.save();ctx.translate(1230,600);ctx.scale(k,k);ctx.rotate(0.05);withA(ctx,clamp(b*2.5,0,1),()=>{
    ctx.drawImage(wc_kept("fwBook",540,700,q=>{q.translate(20,20);q.save();q.filter="blur(12px)";q.fillStyle="rgba(30,20,10,0.4)";q.fillRect(14,20,500,660);q.restore();
      wc_flat(q,wc_rect(14,652,486,22),[236,226,200],1,"pages");wc_wash(q,wc_rrPts(0,0,500,660,10),[96,52,40],{kind:"cover",lw:1.6,seed:87});wc_flat(q,wc_rect(0,6,36,648),[72,38,30],1,"spine");
      for(const ry of [120,520])wc_flat(q,wc_rect(70,ry,380,5),[214,186,120],0.9,"rule");}),-270,-350);
    fw_title(ctx,0,-172,[270,330,290,310],16,42,rgba([232,214,170],0.85));
    wc_T(ctx,"1861",0,120,{w:700,size:36,align:"center",col:[232,214,170]});});ctx.restore();}}
const FW_PS={top:780,seat:[1080,1.55]};
function fw_paintPest(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[224,206,174],{kind:"plaster",line:false,seed:88});
  wc_wash(ctx,wc_rect(-40,560,W+80,H),[150,112,78],{kind:"plaster",line:false,seed:89});wc_flat(ctx,wc_rect(-40,552,W+80,14),[124,90,62],1,"rail");
  // a window with heavy curtains, a shelf of books, a portrait in a frame
  ctx.save();ctx.beginPath();ctx.rect(120,90,330,420);ctx.clip();wc_sky(ctx,420,17,{clouds:1,cx:130,cw:200,cy:120,ch:80});wc_land(ctx,x=>380+4*Math.sin(x/40),[190,190,170],0.4,{line:false});
  for(const [rx,rw,rh] of [[140,70,90],[220,90,120],[320,110,70]])wc_part(ctx,wc_rect(rx,380-rh,rw,rh),[200,186,160],0.4);ctx.restore();
  for(const r of [wc_rect(108,78,354,14),wc_rect(108,78,14,444),wc_rect(448,78,14,444),wc_rect(278,90,10,420),wc_rect(120,294,330,10)])wc_wash(ctx,r,[226,214,190],{kind:"trim",lw:1.2});
  for(const [cx,s] of [[70,1],[500,-1]])wc_wash(ctx,[[cx-40,50],[cx+40,50],[cx+40+s*12,560],[cx-40+s*12,560]],[120,40,44],{kind:"cover",lw:1.3,seed:cx});
  gv_bookcase(ctx,1380,FW_PS.top+40,520,FW_PS.top-40,[260,460],{col:[92,62,44]});const R=wc_rng(19);for(const sy of [260,460]){let bx=1410;while(bx<1880){const bw=22+R()*20,bh=110+R()*60;
    wc_part(ctx,wc_rect(bx,sy-bh,bw,bh),[[120,56,44],[60,70,96],[96,84,56],[150,120,80],[70,50,40]][Math.floor(R()*5)],1,{lw:1.1});bx+=bw+3;}}
  gv_frame(ctx,760,120,220,270);wc_flat(ctx,wc_rect(780,140,180,230),[150,126,98],1,"portrait");wc_wash(ctx,wc_ell(870,230,46,58,30),[200,170,140],{kind:"head",lw:1.1,seed:90});
  wc_wash(ctx,[[800,370],[940,370],[920,300],[820,300]],[60,52,56],{kind:"coat",lw:1.1,seed:91});}
function fw_paintPestDesk(ctx){const top=FW_PS.top;gv_deskFront(ctx,top,[120,80,54],[[120,360],[1480,360]]);
  wc_part(ctx,wc_rect(1380,top-30,160,30),[60,56,60],1);wc_wash(ctx,wc_ell(1460,top-34,40,10,20),[24,22,30],{kind:"thing",line:false,seed:92});
  for(let i=0;i<4;i++)wc_flat(ctx,wc_rect(560+i*4,top-8-i*7,420,9),i%2?[240,230,206]:[246,238,214],1,"paper");
  wc_part(ctx,wc_rect(300,top-26,90,26),[196,160,80],1);wc_part(ctx,wc_rect(334,top-150,22,124),[244,236,214],1);wc_wash(ctx,[[345,top-178],[352,top-152],[338,top-152]],[255,206,110],{kind:"thing",line:false,seed:93});}
// his open letters, flying from the desk as he finishes each (k, 0 to 1 along its flight); the heading is a bolder stroke of his hand,
// without words (the tag beside them says what they are)
function fw_letter(ctx,x,y,rot,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);gv_sheet(ctx,-150,-200,300,400,{col:[246,238,214]});
  ctx.save();ctx.strokeStyle=rgba(WCP.parchInk,0.8);ctx.lineWidth=6;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-120,-146);for(let k=1;k<=7;k++)ctx.lineTo(-120+k*27,-146-k*1.4+Math.sin(k*2.3)*3.2);ctx.stroke();ctx.restore();ctx.save();ctx.strokeStyle=rgba(WCP.parchInk,0.5);ctx.lineWidth=2.4;ctx.lineCap="round";
  for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(-120,-90+i*30);for(let k=0;k<=8;k++)ctx.lineTo(-120+k*30*(i===8?0.5:1),-90+i*30+Math.sin(k*1.9+i)*2.5);ctx.stroke();}ctx.restore();ctx.restore();}

/* ---------- today: Yusuf's office ---------- */
// the shelf's 34 binders, as Off the shelf stands them, numbered 1 to 34 along each row. The earlier films have taken binders 2, 12, 6
// and 9 to the work, so their places are gaps (the series' facts); binder 15 slides forward (out, 0 to 1), then is in his hands (gone)
const FW_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]]},FW_OUT=[1,11,5,8];
const fw_bindCol=i=>FW_BIND.cols[Math.floor(hash(i,17)*FW_BIND.cols.length)],FW_B15=fw_bindCol(14);
function fw_binders(ctx,gone,out){const B=FW_BIND;for(let i=0;i<34;i++){if(FW_OUT.includes(i)||(gone&&i===14))continue;const row=i<17?0:1,x=B.x+(i%17)*B.gap,y=GV_OFF.shelf.rows[1+row],u=i===14?out||0:0;
  ctx.save();ctx.translate(0,-10*u);gv_binder(ctx,x-u*3,y-B.h,B.w+u*6,B.h,fw_bindCol(i));ctx.restore();}}
// binder 15 in both hands (in the figure's units, like the series' heldBinder): its label is the film's title, as the series labels
// each film's binder, and as Off the shelf's "Who decides" is
function fw_heldBinder(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2,col=FW_B15,w=168,h=214;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+12,-h/2+22,w-24,124,10);cx.fill();
  ["Fixed","where it","starts"].forEach((s,i)=>wc_T(cx,s,0,-h/2+58+i*35,{w:800,size:28,align:"center",col:mix(col,[0,0,0],0.5)}));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);}
// his screen on the desk: a monitor turned a little towards him, the scorecard on it, too small to read
function fw_officeScreen(ctx){ctx.drawImage(wc_kept("fwOffScreen",260,240,q=>{q.translate(30,20);gv_monitor(q,0,0,200,128);q.fillStyle=rgba(GV.screen,1);q.fillRect(0,0,200,128);
    q.fillStyle=rgba([70,96,140],1);q.fillRect(0,0,200,16);for(let r=0;r<6;r++)for(let c=0;c<5;c++){q.fillStyle=rgba(r===3&&c===2?FW.amber:[150,200,160],0.8);q.fillRect(14+c*36,26+r*15,30,11);}}),730,GV_OFF.desk[1]-214);}

// his office's wall as Off the shelf left it, painted with the place: the maturity score in its frame, the chart of who's responsible
// pinned to the board and the four answers under it (decoration: too small to read, as they are there)
function fw_paintOfficeWall(ctx){const [x,y,w]=GV_OFF.score,cx=x+w/2;
  wc_T(ctx,"maturity",cx,y+40,{w:600,size:24,align:"center",col:WC_MUTED,deco:1});wc_T(ctx,"2.1 / 5",cx,y+88,{w:800,size:42,align:"center",col:WC_DARK,deco:1});
  for(let i=0;i<5;i++){const bx=x+24+i*26;ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(bx,y+104,22,12);const f=clamp(2.1-i,0,1);if(f>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(bx,y+104,22*f,12);}}
  const [bx,by]=GV_OFF.board,sx=bx+40,sy=by+50,sw=330,sh=190;gv_sheet(ctx,sx,sy,sw,sh);gv_pin(ctx,sx+16,sy+10,GV.red,0.8);gv_pin(ctx,sx+sw-16,sy+10,GV.red,0.8);
  gv_lines(ctx,sx+18,sy+28,170,1,0);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.5;for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(sx+14,sy+56+i*30);ctx.lineTo(sx+sw-14,sy+56+i*30);ctx.stroke();}ctx.restore();
  for(let i=0;i<4;i++){gv_lines(ctx,sx+20,sy+68+i*30,70,1,0,0.8);for(let j=0;j<4;j++)gv_lines(ctx,sx+128+j*48,sy+68+i*30,32,1,0,0.8);}
  for(let k=0;k<4;k++){const ax=bx+28+k*92,ay=by+290;ctx.save();ctx.translate(ax+40,ay+42);ctx.rotate([-0.04,0.03,-0.02,0.05][k]);
    wc_panel(ctx,-40,-42,80,84,{kind:"card",seed:80+k});gv_lines(ctx,-26,-6,52,3,14,0.9);gv_pin(ctx,0,-34,GV.red,0.6);ctx.restore();}}
// the data team's board, in the room: a few cards pinned up, as the team leaves them (decoration), painted with the place
function fw_paintDataBoard(ctx){const [bx,by]=GV_DT.board;[[bx+24,by+40,150,112,-0.03],[bx+196,by+52,96,96,0.04],[bx+310,by+36,100,118,-0.02],[bx+60,by+196,124,104,0.02],
    [bx+230,by+200,170,110,-0.03]].forEach(([x,y,w,h,r],i)=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(r);wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:i===4?GV_LOOPC:null,washA:0.16,seed:320+i});
    gv_lines(ctx,-w/2+16,-h/2+30,w-32,3,20,0.85);gv_pin(ctx,0,-h/2+10,GV.red,0.8);ctx.restore();});}

// binder 15's page, close: the paper filling the frame, the holes for the rings down the left
function fw_paintPolicy(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.paper,{kind:"paper",line:false,seed:93});
  for(const y of [170,540,910])wc_wash(ctx,wc_ell(96,y,24,24,24),wc_dim(GV.oak,0.08),{kind:"thing",lw:1.3,seed:y});
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(255,250,236,0)");g.addColorStop(1,"rgba(150,130,100,0.1)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
// what the page says; at the end a green highlighter runs along the line (hi, 0 to 1) and Yusuf writes beside it (note)
const FW_PG={x:300,y:430,size:46,line:"Root causes of data quality issues are addressed."};
function fw_hiStroke(ctx,x,y,w,col,p,seed,h){if(p<=0)return;h=h||66;const c=wc_kept("fwHi|"+col+"|"+seed,1400,74,q=>wc_wash(q,wc_resample(wc_rect(8,10,1380,50),12),col,{kind:"swatch",line:false,a:0.5,seed}));
  const top=y-14-h/2;ctx.save();ctx.beginPath();ctx.rect(x-14,top-6,(w+28)*clamp(p,0,1),h+12);ctx.clip();ctx.globalCompositeOperation="multiply";ctx.drawImage(c,x-14,top,w+28,h);ctx.restore();}
function fw_marker(ctx,x,y,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(wc_kept("fwMarker|"+col,300,100,q=>{
    q.save();q.filter="blur(5px)";q.fillStyle="rgba(70,50,30,0.26)";q.fillRect(30,46,236,30);q.restore();wc_wash(q,wc_rrPts(26,30,196,42,14),mix(col,[255,255,255],0.6),{kind:"thing",lw:1.3,seed:col[0]});
    wc_wash(q,wc_rrPts(204,27,70,48,12),col,{kind:"thing",lw:1.3,seed:col[1]});wc_wash(q,[[28,40],[8,46],[8,56],[28,62]],wc_dim(col,0.1),{kind:"thing",lw:1.1,seed:col[2]});}),-12,-52);ctx.restore();}
function fw_policy15(ctx,hi,note){const P=FW_PG;wc_T(ctx,"Data policies",P.x,150,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"Policy 15",P.x,250,{w:800,size:70,col:WC_DARK});
  wc_T(ctx,"Data quality issues",P.x,310,{w:600,size:38,col:WC_MUTED});const lw=tw(ctx,P.line,P.size,700);
  fw_hiStroke(ctx,P.x,P.y,lw,GV.green,hi||0,61);wc_T(ctx,P.line,P.x,P.y,{w:700,size:P.size,col:WC_DARK});
  gv_lines(ctx,P.x,P.y+110,1180,6,48,0.7);if(note>0)wc_hand(ctx,"at the form, then a check",P.x+30,P.y+80,{size:40,w:700,col:GV.greenInk,p:note});
  if(hi>0&&hi<1.05)fw_marker(ctx,P.x-14+(lw+28)*clamp(hi,0,1),P.y+6,-0.12,GV.green);}

/* ---------- today: the scorecard ---------- */
// the data quality scorecard on a screen, in plain words, as Rules that run draws it too: "last night's checks", the areas down the
// side and the five dimensions across, and in each cell how many checks passed, of how many, on its wash: green, passed; amber, with
// warnings; red, with a failure; grey and hatched, not checked; bare paper, no check of that kind. The words always say it too. Under
// it, what didn't pass and whose it is, in sections ("Failed", "Warnings", "Not checked"), each only when it has lines. Each column is
// as wide as its words; when they don't all fit across the page, a cell breaks after its count. The camera shows it in turns: the
// whole page (too small to read, on purpose; the washes carry it), then close on a row and the lines under it.
// A cell is "passed/total", then w (warnings), f (failed) or n (not checked), each with how many: "7/7w2", "6/7f1w2", "1/3n2"; ""
// is no check of that kind. FW_SKA is the night before Yusuf opens binder 15 (the example project's checks of Tuesday 20 October 2026,
// put in plain words): the two email checks warn on every row. FW_SKF is a night after the form's fix.
const FW_SKD=["Completeness","Uniqueness","Validity","Consistency","Accuracy","All"];
const FW_SKA=[["Alumni","3/3","1/1","","1/1","","5/5"],["Course","","1/1","1/1","1/1","","3/3"],["Finance","1/1","4/4","2/2","1/1","1/1","9/9"],["HR","4/4","2/2","2/2","1/1","","9/9"],
  ["Learning","7/7","5/5","7/7w2","3/3","","22/22w2"],["Planning","","3/3","1/1","1/1","1/1","6/6"],["Registrar","9/9","4/4","5/5","2/2","","20/20"],
  ["Research","8/8","3/3","1/1","5/5","","17/17"],["Shared","1/1","1/1","","","","2/2"],["Student","21/21","16/16","8/8","18/18","","63/63"],["Wallet","","2/2","1/1","1/1","","4/4"],
  ["All","54/54","42/42","28/28w2","34/34","2/2","160/160w2"]];
const FW_SKF=FW_SKA.map(r=>r.map(c=>c.replace(/w\d+/,"")));
// a section under the table: its title, its state's colour, its lines (each check in plain words, its owner, its rows), and its
// headings (heads: [heading, where it starts along the table], or false for none)
const FW_SKW=[{title:"Warnings",state:"warn",rows:[["Short-course enrolments: emails as typed","Learning team","6"],["Short-course learners: emails as typed","Learning team","3"]]}];
// where the table is on the screen (GV_SC): its left, its width, its headings' line, a row's height and a second line's, the words'
// size, the room each side of a cell's words; each state's wash, how pale it is, and its ink
const FW_SK={x:380,w:1160,y:200,rh:31,lh:24,sz:19,pad:12,heads:[["Check",0],["Owner",0.62],["Rows",0.9]]};
const FW_SKST={pass:[GV.green,0.62,WC_INK],warn:[FW.amber,0.3,FW.amberInk],fail:[GV.red,0.36,GV.redInk],skip:[GV.grey,0.55,GV.greyInk]};
function fw_skCell(s){const m=s?/^(\d+)\/(\d+)(.*)$/.exec(s):null;if(!m)return null;const n={};(m[3].match(/[wfn]\d+/g)||[]).forEach(k=>n[k[0]]=+k.slice(1));
  const notes=[];if(n.f)notes.push(n.f+" failed");if(n.w)notes.push(n.w+(n.w>1?" warnings":" warning"));if(n.n)notes.push(n.n+" not checked");
  return{main:m[1]+" of "+m[2],notes,state:n.f?"fail":n.n?"skip":n.w?"warn":"pass"};}
// where everything goes, for the nights drawn (one, or two when one turns into the next): each column's left and width, each row's
// top, height and words' line, the table's foot. Kept for each set of nights, as it's measured once
const FW_SKL=new Map();
function fw_skLay(ctx,nights){const key=JSON.stringify(nights);if(FW_SKL.has(key))return FW_SKL.get(key);const K=FW_SK,cells=nights.map(rows=>rows.map(r=>r.slice(1).map(fw_skCell))),
    last=nights[0].length-1,wt=i=>i===last?800:600,one=c=>c?[[c.main,...c.notes].join(" · ")]:[],two=c=>c?[c.main,c.notes.join(" · ")]:[],
    widths=f=>[Math.max(tw(ctx,"Area",K.sz,700),...nights[0].map((r,i)=>tw(ctx,r[0],K.sz,wt(i)))),
      ...FW_SKD.map((d,j)=>Math.max(tw(ctx,d,K.sz,700),...cells.flatMap(rows=>rows.map((r,i)=>Math.max(0,...f(r[j]).map(s=>tw(ctx,s,K.sz,wt(i))))))))].map(v=>v+2*K.pad);
  let cw=widths(one),wrap=false;if(cw.reduce((a,b)=>a+b,0)>K.w){cw=widths(two);wrap=true;}
  const spare=Math.max(0,K.w-cw.reduce((a,b)=>a+b,0))/cw.length,cx=[K.x];cw=cw.map(v=>v+spare);cw.forEach((v,i)=>cx.push(cx[i]+v));
  let top=K.y+K.rh*0.28;const rows=nights[0].map((_,i)=>{const h=K.rh+(wrap&&cells.some(r=>r[i].some(c=>c&&c.notes.length))?K.lh:0),r={top,h,base:top+K.rh*0.72};top+=h;return r;});
  const L={cx,cw,rows,wrap,bottom:top};FW_SKL.set(key,L);return L;}
// grey hatching over a cell that wasn't checked
function fw_hatch(ctx,x,y,w,h,a){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.strokeStyle=rgba(GV.greyInk,0.34*a);ctx.lineWidth=2;ctx.beginPath();
  for(let k=-h;k<w;k+=10){ctx.moveTo(x+k,y+h);ctx.lineTo(x+k+h,y);}ctx.stroke();ctx.restore();}
// the scorecard: o.rows the night (FW_SKA by default), o.date beside "last night's checks"; o.after, the next night, which it turns
// into as o.mx goes 0 to 1 (the washes change all the way; the old words go in the first half and the new come in the second); o.p (0 to 1) fills it in, the headings first, then a wash in each cell as its count arrives; o.hi, a row lit
// gold as o.hiA goes 0 to 1; o.sections under it (and o.afterSections, the next night's), and o.clear, said when there are none
// ("Every check passed."). Returns where everything is (fw_skLay's, and L.sec: each section's title and lines, and its columns), so a
// scene can light a cell or an owner
function fw_scorecard(ctx,cam,o){o=o||{};const [x,y,w,h]=GV_SC,K=FW_SK,z=cam&&cam.z?cam.z:1,dz=s=>z*s<27?1:0,deco=dz(K.sz),rows=o.rows||FW_SKA,after=o.after,
    e=after?easeCam(clamp(o.mx||0,0,1)):0,eo=1-clamp(e*2,0,1),en=clamp(e*2-1,0,1),p=o.p==null?1:clamp(o.p,0,1),secA=o.sections||[],
    secB=after?(o.afterSections||[]):secA;let L;
  gv_screen(ctx,x,y,w,h,"Data quality scorecard",q=>{L=fw_skLay(q,after?[rows,after]:[rows]);const nd=FW_SKD.length,N=rows.length*nd,hd=clamp(p*8,0,1);
    withA(q,hd,()=>wc_T(q,"last night's checks"+(o.date?" · "+o.date:""),K.x+K.pad,K.y-46,{w:600,size:K.sz+3,col:WC_MUTED,deco:dz(K.sz+3)}));
    if(o.hi!=null&&o.hiA>0.01){const r=L.rows[o.hi];gv_tint(q,K.x,r.top,K.w,r.h,GV.gold,0.55*o.hiA);}
    withA(q,hd,()=>["Area",...FW_SKD].forEach((s,j)=>wc_T(q,s,j?L.cx[j]+L.cw[j]/2:K.x+K.pad,K.y,{w:700,size:K.sz,align:j?"center":"left",col:WC_MUTED,deco})));
    // a cell's words, on one line or broken after its count
    const words=(c,j,r,wt,a,col)=>{if(!c||a<=0.01)return;(L.wrap&&c.notes.length?[c.main,c.notes.join(" · ")]:[[c.main,...c.notes].join(" · ")]).forEach((s,k)=>
      wc_T(q,s,L.cx[j]+L.cw[j]/2,r.base+k*K.lh,{w:wt,size:K.sz,align:"center",col,a,deco}));};
    rows.forEach((row,i)=>{const r=L.rows[i],wt=i===rows.length-1?800:600;withA(q,hd,()=>wc_T(q,row[0],K.x+K.pad,r.base,{w:wt,size:K.sz,col:WC_DARK,deco}));
      for(let j=1;j<=nd;j++){const A=fw_skCell(row[j]),B=after?fw_skCell(after[i][j]):A,u=clamp((p-0.12)/0.88*N-(i*nd+j-1),0,1);if(u<=0||(!A&&!B))continue;
        const SA=A&&FW_SKST[A.state],SB=B&&FW_SKST[B.state],col=SA&&SB?mix(SA[0],SB[0],e):(SA||SB)[0],pale=SA&&SB?lerp(SA[1],SB[1],e):(SA||SB)[1],
          wa=u*(SA&&SB?1:SA?1-e:e),bx=L.cx[j]+6,by=r.top+2,bw=L.cw[j]-12,bh=r.h-5;
        withA(q,wa,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(col,pale),1);q.fillRect(bx,by,bw,bh);q.restore();});
        const ha=u*((A&&A.state==="skip"?1-e:0)+(B&&B.state==="skip"?e:0));if(ha>0.01)fw_hatch(q,bx,by,bw,bh,ha);
        if(!after||row[j]===after[i][j])words(A,j,r,wt,u,SA[2]);else{words(A,j,r,wt,u*eo,SA&&SA[2]);words(B,j,r,wt,u*en,SB&&SB[2]);}}});
    // under the table: each section, its title and headings, and a line for each check with a swatch of its colour
    const sections=(S,a)=>{const out=[];let ty=L.bottom+32;S.forEach(s=>{const st=FW_SKST[s.state],heads=s.heads===false?null:s.heads||K.heads,
        hx=(heads||[[null,0]]).map(([,f],k)=>k?K.x+f*K.w:K.x+K.pad+32);let ry=ty;
      withA(q,a,()=>{wc_T(q,s.title,K.x+K.pad,ty,{w:800,size:K.sz+3,col:WC_DARK,deco:dz(K.sz+3)});if(heads){ry+=30;heads.forEach(([hs],k)=>wc_T(q,hs,hx[k],ry,{w:700,size:K.sz,col:WC_MUTED,deco}));}});
      const ys=s.rows.map((cells,k)=>{const yy=ry+K.rh*(k+1);withA(q,a,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(st[0],st[1]),1);
          q.fillRect(K.x+K.pad,yy-K.sz*0.8,20,20);q.restore();cells.forEach((c,m)=>wc_T(q,c,hx[m]==null?hx[0]:hx[m],yy,{w:600,size:K.sz,col:m?WC_INK:WC_DARK,deco}));});return yy;});
      out.push({title:ty,rows:ys,cols:hx});ty=(ys.length?ys[ys.length-1]:ry)+50;});return out;};
    const same=secA===secB;L.sec=sections(secA,same?1:eo);L.secB=same?null:sections(secB,en);
    const clr=same?(secA.length?0:1):(secA.length?0:eo)+(secB.length?0:en);
    if(clr>0.01)wc_T(q,o.clear||"Every check passed.",K.x+K.pad,L.bottom+46,{w:700,size:K.sz+3,col:GV.greenInk,a:clr,deco:dz(K.sz+3)});},{titleSize:32,barH:54});
  return L;}
// where the camera looks for each turn: the whole page; then the learning row, near the top of the frame, with the lines under it,
// above the captions
const FW_SKV={all:[960,415,1.02],row:[960,FW_SK.y+5*FW_SK.rh+156,1.55]};

/* ---------- today: Tom's desk, from above ---------- */
// the learning team's desk from above, for the papers on it: pale beech with its grain, Tom's blue mug, a pencil, the edge of his
// keyboard and a fan of this term's leaflets
const FW_TT={wood:[214,178,138],log:[310,176,1300],card:[460,150,1000]};
function fw_paintTomTop(ctx){const col=FW_TT.wood;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),col,{kind:"plaster",line:false,seed:111});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(12);for(let i=0;i<60;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(col,0.18+R()*0.1),0.16+R()*0.12);ctx.lineWidth=1+R()*2.2;
    ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+5*Math.sin(x/320+i)+3*Math.sin(x/95+i*2));ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,300,-120,1400,[255,250,236],0.3);ctx.restore();
  // the keyboard's edge, top right; the mug, top left; a pencil; the leaflets, bottom right
  wc_part(ctx,wc_rect(1540,-40,420,110),[226,228,234],1);for(let i=0;i<8;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(1556+i*48,-26+j*44,40,36),[244,245,248],1,"key");
  wc_wash(ctx,wc_ell(130,150,80,80,40),[96,160,176],{kind:"thing",lw:1.6,seed:112});wc_wash(ctx,wc_ell(130,150,60,60,40),[150,104,70],{kind:"thing",line:false,seed:113});
  wc_part(ctx,[[60,980],[330,900],[336,912],[66,994]],[244,196,80],1);wc_flat(ctx,[[330,900],[360,892],[336,912]],[60,54,58],1,"tip");
  [[1690,900,-0.18,[236,170,34]],[1720,930,-0.05,[96,160,176]],[1745,960,0.1,[200,110,90]]].forEach(([lx,ly,r,c],i)=>{ctx.save();ctx.translate(lx,ly);ctx.rotate(r);
    gv_sheet(ctx,-120,-150,240,300,{col:[251,250,245]});wc_flat(ctx,wc_rect(-104,-134,208,90),c,0.7,"leaflet");ctx.restore();});}
// a pen lying on the desk or writing, its tip at (x,y)
function fw_pen(ctx,x,y,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?-0.75:rot);ctx.fillStyle="rgba(40,30,20,0.22)";ctx.fillRect(14,12,220,12);
  wc_part(ctx,[[0,0],[26,-8],[26,8]],[200,200,206],1,{lw:1});wc_part(ctx,wc_rrPts(26,-9,210,18,8),[34,44,92],1,{kind:"thing",lw:1.1,seed:115});ctx.restore();}

/* ---------- today: the issues ---------- */
// the data quality issue log, as Rules that run keeps it: the series' register page, open in its blue boards on Tom's desk, the
// learning team's. Its line for the emails, from the Monday's warnings, is lit gold (hiA), then stamped as the old answer closes it
// (stamp, 0 to 1), under the line, so the stamp and the line both read
const FW_IL={kicker:"Issue log",title:"Data quality",h:440,cols:[["Opened",0.13],["Issue",0.48],["Owner",0.25],["Due",0.14]],
  rows:[["19 Oct","Short-course emails as typed","Learning team","26 Oct"]]};
function fw_issueBook(ctx){const [x,y,w]=FW_TT.log,h=FW_IL.h*w/1000;ctx.drawImage(wc_kept("fwIssueBook",w+160,h+120,q=>{q.translate(70,40);
    q.save();q.filter="blur(10px)";q.fillStyle="rgba(50,40,30,0.3)";q.fillRect(-40,-8,w+70,h+44);q.restore();
    wc_wash(q,wc_rrPts(-46,-22,w+72,h+44,10),[58,82,118],{kind:"cover",lw:1.4,seed:116});wc_flat(q,wc_rect(-46,-22,34,h+44),[40,58,88],1,"spine");
    for(let i=3;i>0;i--)wc_flat(q,wc_rect(i*3,i*3,w,h),[240-i*8,236-i*8,226-i*8],1,"pages");}),x-70,y-40);}
function fw_issueLog(ctx,hiA,stamp){const [x,y,w]=FW_TT.log;fw_issueBook(ctx);const r=gv_register(ctx,x,y,w,Object.assign({hi:0,hiA},FW_IL));
  if(stamp>0)gv_stamp(ctx,x+w/2,r.rows[0]+128*w/1000,"CLOSED: cleaned downstream",stamp,{size:40,rot:-0.04});return r;}
// the issue that closes it for good: the next Monday's, on Yusuf's board, with an owner, a cause, a date and the check that proves it's
// closed (line(k)); stamped closed (closed, 0 to 1) once the check passes
const FW_IS=[["Owner:","Learning team"],["Cause:","the form keeps each email as typed"],["Due:","2 November"],["Closed when:","the check passes with no clean-up"]];
function fw_issueGold(ctx,u,line,closed){if(u<=0)return;const e=easeCam(clamp(u,0,1)),k=lerp(1.1,1,e),x=520,y=230,w=1080,h=540;ctx.save();ctx.translate(0,-16*(1-e));
  withA(ctx,clamp(u*2.5,0,1),()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.scale(k,k);ctx.translate(-x-w/2,-y-h/2);
    wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.gold,washA:0.42,seed:131});gv_pin(ctx,x+w/2,y+16,GV.red,1.4);
    wc_T(ctx,"Issue · short-course emails as typed",x+56,y+92,{w:800,size:40,col:WC_DARK});
    FW_IS.forEach(([a,b],i)=>{const p=line(i);if(p<=0)return;const yy=y+176+i*70;withA(ctx,clamp(p*2,0,1),()=>{if(a)wc_T(ctx,a,x+56,yy,{w:800,size:36,col:GV.goldInk});
      wc_T(ctx,b,x+(i>=3?330:250),yy,{w:600,size:36,col:WC_DARK});});});
    if(closed>0)gv_stamp(ctx,x+w-250,y+h-84,"CLOSED: the check passes",closed,{size:32,col:GV.greenInk,rot:-0.05});ctx.restore();});ctx.restore();}

/* ---------- today: the data team's clean-up ---------- */
// an email in the normal type, each space shown as a small grey bar where it was left (a little wider than a space, so it shows); returns
// where each letter starts and where the email ends, for a ring or a caret
function fw_email(ctx,s,x,y,o){o=o||{};const sz=o.size||28,wt=o.w||600,a=o.a==null?1:o.a,sp=Math.max(tw(ctx," ",sz,wt),sz*0.5),xs=[];let cx=x,rx=x,run="";
  const flush=()=>{if(run&&a>0.01)wc_T(ctx,run,rx,y,{w:wt,size:sz,col:o.col||WC_INK,a,deco:o.deco});run="";};
  for(const ch of s){xs.push(cx);if(ch===" "){flush();if(a>0.01){ctx.fillStyle=rgba(WC_MUTED,0.65*a);ctx.fillRect(cx+2,y+4,sp-4,Math.max(5,sz*0.2));}cx+=sp;rx=cx;}
    else{if(!run)rx=cx;run+=ch;cx=rx+tw(ctx,run,sz,wt);}}
  flush();xs.push(cx);return xs;}
// a red ring round letter i of an email drawn at size sz (xs from fw_email), or round a space
function fw_ringAt(ctx,xs,i,y,sz,p,col){if(p<=0)return;const x0=xs[i],x1=xs[i+1],cx=(x0+x1)/2;wc_ring(ctx,cx,y-sz*0.34,Math.max(sz*0.36,(x1-x0)*0.6),sz*0.58,p,{col:col||GV.red,lw:Math.max(3,sz*0.12)});}
// the clean-up, on a card pinned to the data team's board: what it does every night, an email as typed and after; the capitals and the
// space it takes away ringed red as "trimmed" (trim) and "lower case" (low) light; after shows what it writes; retired (0 to 1)
// stamps it once the form does the work
const FW_CU={x:330,y:190,w:1260,h:600,em:"DanielKim.Work@mail.example "};
function fw_cleanCard(ctx,o){const C=FW_CU,{x,y,w,h}=C;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(-0.012);ctx.translate(-x-w/2,-y-h/2);
  wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.grey,washA:0.12,seed:141});gv_pin(ctx,x+60,y+24,GV.red,1.2);gv_pin(ctx,x+w-60,y+24,GV.red,1.2);
  wc_T(ctx,"The data team's clean-up",x+70,y+108,{w:800,size:48,col:WC_DARK});wc_T(ctx,"every night",x+w-70,y+108,{w:600,size:34,align:"right",col:WC_MUTED});
  ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(x+70,y+140,w-140,2);
  const ex=x+330,sz=44,t=o.trim||0,l=o.low||0;wc_T(ctx,"as typed",x+70,y+246,{w:700,size:32,col:WC_MUTED});
  const xs=fw_email(ctx,C.em,ex,y+246,{size:sz,col:WC_DARK});
  fw_ringAt(ctx,xs,0,y+246,sz,l);fw_ringAt(ctx,xs,C.em.indexOf("W"),y+246,sz,l);
  if(t>0){const i=C.em.length-1;wc_ring(ctx,(xs[i]+xs[i+1])/2,y+252,(xs[i+1]-xs[i])*0.8+8,sz*0.32,t,{col:GV.red,lw:5});}
  // what it does, between: two chips, lighting as they're said
  [["trimmed",t],["lower case",l]].forEach(([s,u],i)=>{const tx=ex+(i?250:0),k=lerp(0.92,1,spring(clamp(u,0,1)));ctx.save();ctx.translate(tx,y+346);ctx.scale(k,k);
    withA(ctx,0.3+0.7*clamp(u*1.5,0,1),()=>wc_tag(ctx,0,0,s,{size:32,wash:GV.gold,washA:0.15+0.3*u}));ctx.restore();});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+200,y+300);ctx.lineTo(x+200,y+402);ctx.moveTo(x+188,y+390);ctx.lineTo(x+200,y+404);
  ctx.lineTo(x+212,y+390);ctx.stroke();ctx.restore();
  wc_T(ctx,"after",x+70,y+466,{w:700,size:32,col:WC_MUTED});fw_email(ctx,C.em.trim().toLowerCase(),ex,y+466,{size:sz,col:GV.greenInk,a:o.after==null?1:o.after});
  if(o.retired>0)gv_stamp(ctx,x+w-250,y+h-74,"RETIRED",o.retired,{size:44,col:GV.greenInk,rot:-0.06});ctx.restore();}
// the wallet, close: two of them for one learner, one for each way his email was typed, and a question mark between
function fw_wallets(ctx,u,q){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Wallet",c=>{[["DanielKim.Work@mail.example",x+70],["danielkim.work@mail.example",x+w-70-500]].forEach(([em,cx],i)=>{
    const p=fin(u,i*0.25,0.4);if(p<=0)return;withA(c,p,()=>{wc_panel(c,cx,y+150,500,330,{kind:"card",wash:GV_LOOPC,washA:0.18,seed:150+i});
      wc_T(c,"Daniel Kim",cx+40,y+230,{w:800,size:44,col:WC_DARK});wc_T(c,em,cx+40,y+290,{w:600,size:30,col:WC_INK});
      for(let b=0;b<3;b++)wc_wash(c,wc_ell(cx+76+b*96,y+394,34,34,24),[[236,170,34],[96,160,176],[150,120,190]][b],{kind:"thing",lw:1.2,seed:160+b+i*3});});});
  gv_qmark(c,x+w/2,y+380,110,q);},{titleSize:30,barH:54});}

/* ---------- today: the leak in the data team's room ---------- */
// the metaphor, said once: a pipe along the top of the wall, leaking at three joints; under each a bucket, the first by Jun's desk
// ("data team"), with a mop leaning beside it ("the clean-up"); the others ("finance", "mailing list") further along. When the cause is
// fixed, the leaks stop, the buckets and the mop go, and a small leak sensor stays where the first bucket stood.
const FW_LK={y:58,joints:[1356,862,318],floor:870};
function fw_pipe(ctx,fixed){ctx.drawImage(wc_kept("fwPipe",W,140,q=>{wc_wash(q,wc_rect(-40,FW_LK.y-14,W+80,30),[150,160,176],{kind:"iron",lw:1.4,seed:5});
    q.save();q.strokeStyle="rgba(255,255,255,0.45)";q.lineWidth=4;q.beginPath();q.moveTo(-20,FW_LK.y-5);q.lineTo(W+20,FW_LK.y-5);q.stroke();q.restore();
    for(const jx of FW_LK.joints)wc_wash(q,wc_rect(jx-22,FW_LK.y-22,44,46),[132,142,158],{kind:"iron",lw:1.3,seed:jx});
    for(const bx of [120,620,1120,1620])wc_flat(q,wc_rect(bx,0,12,FW_LK.y-14),[120,128,140],1,"bracket");}),0,0);
  // the repair: a fresh clamp round each joint
  if(fixed>0)withA(ctx,fixed,()=>{for(const jx of FW_LK.joints){wc_flat(ctx,wc_rect(jx-28,FW_LK.y-26,56,54),[96,176,130],1,"clamp");ctx.save();ctx.strokeStyle="rgba(40,80,60,0.6)";ctx.lineWidth=3;
    for(const k of [-12,12]){ctx.beginPath();ctx.moveTo(jx+k,FW_LK.y-26);ctx.lineTo(jx+k,FW_LK.y+28);ctx.stroke();}ctx.restore();}});}
// a drop's fall from a joint to y1, one every per seconds (rate 0 to 1 thins them out); a ring where each lands
function fw_drip(ctx,t,jx,y1,rate,ph){if(rate<=0.01)return;const per=0.95/Math.max(0.3,rate),T0=Math.sqrt(2*(y1-FW_LK.y-20)/2400),tt=t+(ph||0);
  for(let i=Math.floor(tt/per)-2;i<=Math.floor(tt/per);i++){const u=tt-i*per;if(hash(i,jx)>rate*1.15)continue;if(u<T0){const yy=FW_LK.y+22+1200*u*u;ctx.save();ctx.fillStyle=rgba(FW.leak,0.85);
      ctx.beginPath();ctx.moveTo(jx,yy-12);ctx.quadraticCurveTo(jx+7,yy,jx,yy+6);ctx.quadraticCurveTo(jx-7,yy,jx,yy-12);ctx.fill();ctx.restore();}
    else if(u<T0+0.5){const v=(u-T0)/0.5;ctx.save();ctx.strokeStyle=rgba(FW.leak,0.6*(1-v));ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(jx,y1,10+30*v,4+8*v,0,0,TAU);ctx.stroke();ctx.restore();}}}
// a tin bucket, its feet at (x,y), and the water in it
function fw_bucket(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>ctx.drawImage(wc_kept("fwBucket",170,170,q=>{q.translate(10,20);wc_contact(q,10,140,136,1,0.3);
    wc_wash(q,[[18,30],[132,30],[118,134],[32,134]],FW.tin,{kind:"thing",lw:1.4,seed:7});for(const yy of [56,108])wc_flat(q,[[22+(yy-30)*0.13,yy],[128-(yy-30)*0.13,yy],[128-(yy-30)*0.13,yy+5],[22+(yy-30)*0.13,yy+5]],wc_dim(FW.tin,0.15),1,"band");
    wc_wash(q,wc_ell(75,30,58,12,26),wc_dim(FW.tin,0.1),{kind:"thing",lw:1.2,seed:8});wc_wash(q,wc_ell(75,32,48,8,24),[150,176,198],{kind:"thing",line:false,seed:9});
    q.save();q.strokeStyle=rgba(wc_dim(FW.tin,0.35),0.9);q.lineWidth=4;q.beginPath();q.moveTo(20,32);q.quadraticCurveTo(75,-24,130,32);q.stroke();q.restore();}),x-85*s,y-150*s,170*s,170*s));}
// a mop leaning against the wall, its head on the floor at (x,y); or held in both hands, in the figure's units, its head on the floor
// out to our left, swinging (sw, -1 to 1)
function fw_mopC(){return wc_kept("fwMop",200,520,q=>{q.translate(20,10);wc_wash(q,[[120,0],[132,4],[66,430],[54,426]],[200,168,120],{kind:"thing",lw:1.2,seed:3});
  wc_wash(q,wc_smooth([[20,420],[110,416],[140,470],[120,494],[10,494],[0,470]],4),FW.cotton,{kind:"cover",lw:1.2,seed:4});
  q.save();q.strokeStyle=rgba(wc_dim(FW.cotton,0.28),0.6);q.lineWidth=2;for(let i=0;i<9;i++){q.beginPath();q.moveTo(28+i*11,430);q.lineTo(16+i*13,490);q.stroke();}q.restore();});}
function fw_mop(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>ctx.drawImage(fw_mopC(),x-80*s,y-500*s,200*s,520*s));}
function fw_heldMop(sw){return(cx,P_,hands)=>{const [l,r]=hands,g=[(l[0]+r[0])/2,(l[1]+r[1])/2],head=[g[0]-170+sw*60,-12],dx=head[0]-g[0],dy=head[1]-g[1],L=Math.hypot(dx,dy),
    u=[dx/L,dy/L],top=[g[0]-u[0]*80,g[1]-u[1]*80];cx.save();
  cx.strokeStyle=rgba([200,168,120],1);cx.lineWidth=12;cx.lineCap="round";cx.beginPath();cx.moveTo(top[0],top[1]);cx.lineTo(head[0]-u[0]*26,head[1]-u[1]*26);cx.stroke();
  cx.fillStyle=rgba(FW.cotton,1);cx.beginPath();cx.ellipse(head[0],head[1]-12,74,28,0,0,TAU);cx.fill();cx.strokeStyle=rgba(wc_dim(FW.cotton,0.3),0.7);cx.lineWidth=2.4;
  for(let i=0;i<8;i++){cx.beginPath();cx.moveTo(head[0]-56+i*16,head[1]-26);cx.lineTo(head[0]-64+i*18,head[1]+12);cx.stroke();}cx.restore();
  fingers(cx,P_,[[g[0]-u[0]*14-6,g[1]-u[1]*14],[g[0]+u[0]*16+6,g[1]+u[1]*16]]);};}
// the leak sensor: a grey puck on the floor, its light green; it tells its owner
function fw_sensor(ctx,x,y,s,a,lit){if(a<=0.01)return;withA(ctx,a,()=>{ctx.drawImage(wc_kept("fwSensor",130,70,q=>{wc_contact(q,8,122,52,1,0.3);wc_wash(q,wc_ell(65,40,52,16,30),[196,200,208],{kind:"thing",lw:1.3,seed:3});
    wc_wash(q,[[13,40],[117,40],[112,26],[18,26]],[214,218,226],{kind:"thing",lw:1.2,seed:4});wc_wash(q,wc_ell(65,26,47,12,30),[226,230,236],{kind:"thing",lw:1.2,seed:5});}),x-65*s,y-60*s,130*s,70*s);
  const g=lit==null?1:lit;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y-34*s,40*s,[120,230,160],0.7*g);ctx.restore();ctx.fillStyle=rgba([40,170,100],0.95);ctx.beginPath();ctx.arc(x,y-34*s,5.5*s,0,TAU);ctx.fill();});}

// the room's leak as a scene draws it: the pipe (clamped once fixed, 0 to 1), each joint's bucket (buckets[i], 0 to 1) and its drip, the
// mop leaning by the first bucket (mop), and the sensor where the first bucket stood (sensor); the buckets stand at FW_BK
const FW_BK={y:900,s:0.9,top:812,mop:1470};
function fw_leak(ctx,t,o){const fx=o.fixed||0;fw_pipe(ctx,fx);if(o.sensor)fw_sensor(ctx,FW_LK.joints[0],FW_BK.y+4,1,o.sensor,1);
  FW_LK.joints.forEach((jx,i)=>{const a=o.buckets[i]||0;fw_bucket(ctx,jx,FW_BK.y,FW_BK.s,a);fw_drip(ctx,t,jx,FW_BK.top,a*(1-fx),i*0.37);});
  if(o.mop)fw_mop(ctx,FW_BK.mop,FW_BK.y-4,0.9,o.mop);}

/* ---------- today: following it back ---------- */
// on the data team's board: a card for each place the email passes, pinned right to left as they're named (lit(k), k 0 the wallet), each
// with a small picture of the place as the film drew it, so it reads before its words; a red thread runs over them from pin to pin as
// each one goes up; "seen here" under the wallet, "made here" under the form
const FW_TR=[["wallet"],["the data team's","clean-up"],["short-course","platform"],["sign-up form"]],FW_TRX=[1524,1148,772,396],FW_TRC={y:300,w:320,h:280};
// the pictures, kept at twice the frame's resolution like the cards: the wallet's card with its badges; the data team's bucket and the
// mop; the platform's list on a screen; the form on a phone, its email box lit gold
function fw_trailIcon(ctx,k,x,y){ctx.drawImage(wc_kept("fwTrail"+k,220*WC_SC,130*WC_SC,q=>{q.scale(WC_SC,WC_SC);q.translate(110,65);const grey=[150,154,162],frame=[70,76,88];
    if(k===0){wc_panel(q,-64,-42,128,84,{kind:"card",wash:GV_LOOPC,washA:0.18,seed:191});wc_flat(q,wc_rect(-48,-27,66,10),[70,74,84],1,"name");wc_flat(q,wc_rect(-48,-11,90,6),grey,1,"mail");
      for(let b=0;b<3;b++)wc_wash(q,wc_ell(-34+b*34,18,12,12,18),[[236,170,34],[96,160,176],[150,120,190]][b],{kind:"thing",lw:1,seed:192+b});}
    else if(k===1){fw_bucket(q,-20,58,0.6,1);fw_mop(q,44,60,0.22,1);}
    else if(k===2){wc_wash(q,wc_rrPts(-62,-52,124,84,8),frame,{kind:"thing",lw:1.2,seed:195});wc_flat(q,wc_rect(-54,-44,108,68),[242,243,246],1,"glass");
      wc_flat(q,wc_rect(-54,-44,108,13),[96,160,176],1,"bar");for(let i=0;i<3;i++)wc_flat(q,wc_rect(-46,-22+i*14,i===1?52:74,6),grey,1,"line"+i);
      wc_wash(q,[[-9,32],[9,32],[14,48],[-14,48]],frame,{kind:"thing",lw:1,seed:196});wc_wash(q,wc_rect(-32,47,64,8),frame,{kind:"thing",lw:1,seed:197});}
    else{wc_wash(q,wc_rrPts(-32,-60,64,120,12),[44,46,54],{kind:"thing",lw:1.2,seed:198});wc_flat(q,wc_rrPts(-26,-52,52,104,7),[244,244,240],1,"glass");
      [[-30,0],[0,1]].forEach(([yy,lit])=>{wc_flat(q,wc_rect(-20,yy-13,22,4),grey,1,"label"+lit);q.save();q.strokeStyle=rgba(lit?[204,150,24]:[120,124,132],1);q.lineWidth=lit?2.6:1.6;
        q.strokeRect(-20,yy-5,40,14);q.restore();});wc_flat(q,wc_rrPts(-20,28,40,13,4),[96,160,176],1,"button");}}),x-110,y-65,220,130);}
function fw_trail(ctx,lit){const C=FW_TRC,pin=k=>[FW_TRX[k],C.y+16];
  for(let k=0;k<4;k++){const u=clamp(lit(k),0,1);if(u<=0)continue;const cx=FW_TRX[k],e=easeCam(clamp(u*1.6,0,1)),s=lerp(1.12,1,e),gold=k===3;
    ctx.save();ctx.translate(cx,C.y+C.h/2-12*(1-e));ctx.rotate([0.02,-0.015,0.012,-0.02][k]);ctx.scale(s,s);withA(ctx,clamp(u*2.5,0,1),()=>{
      wc_panel(ctx,-C.w/2,-C.h/2,C.w,C.h,{kind:"card",wash:gold?GV.gold:GV_LOOPC,washA:gold?0.4:0.2,seed:170+k});fw_trailIcon(ctx,k,0,-C.h/2+92);
      FW_TR[k].forEach((s2,i,a)=>wc_T(ctx,s2,0,C.h/2-54+(i-(a.length-1)/2)*44,{w:800,size:38,align:"center",col:WC_DARK}));});ctx.restore();}
  // the thread, over the cards: from each card's pin to the next one's, drawn as the next one goes up; then the pins over it
  for(let k=1;k<4;k++){const u=easeCam(clamp(lit(k)*1.4,0,1));if(u<=0)continue;const [ax,ay]=pin(k-1),[bx,by]=pin(k),mx=lerp(ax,bx,u),my=lerp(ay,by,u);
    const path=(dx,dy)=>{ctx.beginPath();ctx.moveTo(ax+dx,ay+dy);ctx.quadraticCurveTo((ax+mx)/2+dx,(ay+my)/2+26*u+dy,mx+dx,my+dy);};ctx.save();ctx.lineCap="round";
    path(2,4);ctx.strokeStyle="rgba(60,40,30,0.18)";ctx.lineWidth=5;ctx.stroke();path(0,0);ctx.strokeStyle=rgba([176,48,40],0.9);ctx.lineWidth=3;ctx.stroke();ctx.restore();}
  for(let k=0;k<4;k++)if(lit(k)>0)gv_pin(ctx,...pin(k),GV.red,1.3);
  // where it's seen and where it's made
  fw_trailTag(ctx,0,lit(0),"seen here");fw_trailTag(ctx,3,lit(3),"made here");}
function fw_trailTag(ctx,k,u,s){const a=clamp(u*2-0.6,0,1);if(a<=0)return;withA(ctx,a,()=>wc_tag(ctx,FW_TRX[k],FW_TRC.y+FW_TRC.h+62,s,{align:"center",size:32,
  wash:k===3?GV.gold:null,washA:0.3}));}

/* ---------- today: the learning team's desk, Tom's ---------- */
// the learning team's office, close, the camera at the height of someone sitting: apricot walls, a window onto the campus, a poster of
// this term's short courses, a shelf of brochures; the desk (its front layer) with a screen, a keyboard, a mug, a stack of leaflets
const FW_TX={top:800,seat:[1450,1.7],screen:[430,286,660,388],win:[70,60,300,440],poster:[1180,64,520,300]};
function fw_paintTom(ctx){const X=FW_TX,wall=GV_ROOM.learn;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:101});
  gv_lightGlow(ctx,900,-60,760);const [wx,wy,ww,wh]=X.win;gv_window(ctx,wx,wy,ww,wh,{wall,seed:30,tx:0.55});
  // the poster: this term's short courses, a tile each (the words on the tiles are decoration)
  const [px,py,pw,ph]=X.poster;wc_wash(ctx,wc_rect(px,py,pw,ph),[251,250,245],{kind:"paper",lw:1.4,seed:102});for(const gx of [px+26,px+pw-26])gv_pin(ctx,gx,py+22,GV.red,1);
  for(let i=0;i<6;i++){const tx=px+30+(i%3)*160,ty=py+110+Math.floor(i/3)*90;wc_flat(ctx,wc_rect(tx,ty,140,72),[[236,170,34],[96,160,176],[150,120,190],[200,110,90],[120,170,110],[110,140,200]][i],0.6,"tile");}
  // shelves of brochures at the right edge
  gv_bookcase(ctx,1760,X.top+40,280,X.top-60,[300,520],{col:[176,140,104]});for(const sy of [300,520])for(let i=0;i<4;i++)wc_part(ctx,wc_rect(1790+i*38,sy-120,30,120),[[236,170,34],[96,160,176],[200,110,90],[150,120,190]][i],1,{lw:1});}
function fw_paintTomDesk(ctx){const X=FW_TX,top=X.top;gv_deskFront(ctx,top,[214,178,138],[[60,330],[1560,330]]);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+80,top,sw-160,sx+sw+40);
  for(let i=0;i<5;i++)wc_flat(ctx,wc_rect(1200+i*3,top-8-i*8,220,10),[[236,170,34],[250,250,246],[96,160,176],[250,250,246],[200,110,90]][i],1,"leaflet");gv_mug(ctx,250,top+10,[96,160,176]);}
// the poster's heading, drawn every frame so it reads
function fw_tomPoster(ctx){const [px,py,pw]=FW_TX.poster;wc_T(ctx,"Short courses",px+30,py+74,{w:800,size:40,col:WC_DARK});wc_T(ctx,"this term",px+pw-30,py+74,{w:600,size:30,align:"right",col:WC_MUTED});}
// what Tom's screen shows, small (in the desk's view): the sign-up form, its setting, an alert. (x,y,w,h) is the screen.
function fw_tomScreen(ctx,mode,o){o=o||{};const [x,y,w,h]=FW_TX.screen;if(mode==="form")gv_screen(ctx,x,y,w,h,"Sign-up form · preview",q=>{
    wc_T(q,"Sign up for a short course",x+40,y+90,{w:800,size:32,col:WC_DARK});
    [["Name","Daniel Kim"],["Email",""]].forEach(([l,v],i)=>{const yy=y+134+i*96;wc_T(q,l,x+40,yy,{w:600,size:28,col:WC_MUTED});q.fillStyle="#fff";q.fillRect(x+40,yy+10,w-80,48);
      if(i===1&&o.lit>0)gv_halo(q,x+30,yy,w-60,68,GV.gold,o.lit);
      q.strokeStyle=rgba(i===1?GV.goldInk:WC_PENCIL,i===1?0.9:0.4);q.lineWidth=i===1?3:2;q.strokeRect(x+40,yy+10,w-80,48);if(v)wc_T(q,v,x+56,yy+44,{w:600,size:28,col:WC_INK});});
    // what the email box is, on a tag under it: "a plain text box", springing in as o.tag goes 0 to 1, then "an email box", ticked, as
    // o.fix goes 0 to 1
    if(o.tag>0){const u=clamp(o.fix||0,0,1),k=0.9+0.1*spring(clamp(o.tag,0,1));q.save();q.translate(x+w/2,y+h-58);q.scale(k,k);
      withA(q,clamp(o.tag*2,0,1)*(1-u),()=>wc_tag(q,0,0,"a plain text box",{align:"center",size:30,wash:FW.amber,washA:0.3}));
      withA(q,u,()=>{const tw2=wc_tag(q,0,0,"an email box",{align:"center",size:30,wash:GV.green,washA:0.3});wc_tick(q,tw2/2+30,-6,34,GV.green,clamp(u*1.5-0.4,0,1),5);});q.restore();}},{titleSize:28,barH:46});
  // the notice, landing with the owner on record
  if(mode==="alert")gv_screen(ctx,x,y,w,h,"Notice · the learning platform's badges",q=>{const u=o.u==null?1:o.u;withA(q,u,()=>{wc_panel(q,x+36,y+80,w-72,h-120,{kind:"card",wash:FW.amber,washA:0.3,seed:181});
    wc_T(q,"to: Learning team, the owner",x+66,y+140,{w:700,size:28,col:WC_MUTED});wc_T(q,"Badges with no credit:",x+66,y+200,{w:800,size:34,col:WC_DARK});
    wc_T(q,"1 in 2 last night",x+66,y+250,{w:800,size:34,col:FW.amberInk});wc_T(q,"(usually 1 in 12)",x+66,y+298,{w:600,size:30,col:WC_INK});});},{titleSize:28,barH:46});}
// Tom's screen, close: the learners the form has saved, as they're typed (fixed, 0 to 1, lowers them one by one); the courses on the
// learning platform and their credit points (set(k)), then "badges sent again"
const FW_LR=[" Aisha.K@Mail.example ","aisha.r@mail.example","DanielKim.Work@mail.example "," Nguyen.Family@mail.example","tom.becker@mail.example","omar.haddad@mail.example",
  "grace.okafor@mail.example","peter.novak@mail.example"],FW_LRX=[0,2,3];
function fw_learners(ctx,lit,fixed,tag){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Short-course learners",q=>{FW_LR.forEach((s,i)=>{const yy=y+120+i*62,bad=FW_LRX.indexOf(i),
    f=bad<0?1:clamp(fixed*3-bad,0,1),v=bad<0||f<0.5?s:s.trim().toLowerCase();if(bad>=0&&lit>0&&f<1)gv_tint(q,x+40,yy-36,700,50,FW.amber,0.65*lit*(1-f));
    fw_email(q,v,x+60,yy,{size:30,col:bad>=0&&f<0.5?WC_DARK:WC_INK});if(bad>=0&&f>=0.5)wc_tick(q,x+790,yy-10,32,GV.green,clamp(f*2-1,0,1),5);});
  if(tag>0)withA(q,tag,()=>wc_badge(q,x+w-330,y+180,"3 of 8 as typed",{size:32,role:FW.amber}));},{titleSize:30,barH:54});}
// the platform's ten microcredentials, as the example project's badges name them, in two columns; the update set three to 0
const FW_CS=[["Data Visualisation",0],["Designing Digital Learning",5],["Finance for Managers",5],["Health Data Essentials",5],["Leading Teams",0],
  ["Machine Learning Basics",5],["Python Foundations",0],["Security Fundamentals",5],["SQL for Analysis",5],["Statistics Refresher",5]];
function fw_courses(ctx,set,send,fly){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Learning platform · microcredentials",q=>{
  for(const cx of [x+50,x+650])wc_T(q,"credit points",cx+500,y+110,{w:700,size:28,align:"center",col:WC_MUTED});
  let k=0;FW_CS.forEach(([s,c],i)=>{const cx=i<5?x+50:x+650,yy=y+176+(i%5)*64,fix=c===0?clamp(set(k++),0,1):1,v=c===0&&fix<0.5?0:5;
    if(c===0&&fix<1)gv_tint(q,cx-10,yy-40,580,54,FW.amber,0.55*(1-fix));
    wc_T(q,s,cx+14,yy,{w:600,size:32,col:WC_INK});wc_T(q,String(v),cx+500,yy,{w:800,size:34,align:"center",col:v?WC_DARK:FW.amberInk});});
  const bx=x+w-420,by=y+h-104,u=clamp(send,0,1);if(u>0)withA(q,clamp(u*2,0,1),()=>{wc_T(q,"badges sent again",bx+20,by+44,{w:800,size:32,col:GV.greenInk});
    wc_tick(q,bx+20+tw(q,"badges sent again",32,800)+34,by+32,34,GV.green,clamp(u*1.6-0.3,0,1),5);});
  if(fly>0)for(let i=0;i<6;i++){const v=clamp(fly*1.6-i*0.12,0,1);if(v<=0||v>=1)continue;const ex=bx+180+v*560,ey=by+33-Math.sin(v*Math.PI)*160;
    wc_wash(q,wc_ell(ex,ey,22,22,18),[[236,170,34],[96,160,176],[150,120,190]][i%3],{kind:"thing",lw:1.1,seed:190+i});}},{titleSize:30,barH:54});}

/* ---------- today: a learner's phone ---------- */
// a phone in a learner's hand, over the campus, out of focus: the sign-up form on its screen, scrolled so the email box sits just above
// the bar of suggestions and the keyboard, as a phone does while you type; laid out close, so the keys the thumb presses stay above
// the captions in the phone's view (FW_PHV). What's typed, the keys and the thumb are drawn every frame.
const FW_PH={x:700,y:24,w:520,r:56,sx:724,sw:472,name:[748,210,424,54],box:[748,328,424,70],btn:[748,424,424,56],sug:[724,420,472,60],keys:488,sz:24};
function fw_paintPhone(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);const L=mkCanvas(W,H),q=L.getContext("2d");gv_paintCampus(q);
  ctx.save();ctx.filter="blur(14px)";ctx.drawImage(L,-30,-30,W+60,H+60);ctx.restore();ctx.fillStyle="rgba(250,246,236,0.18)";ctx.fillRect(0,0,W,H);
  const P=FW_PH;ctx.save();ctx.filter="blur(22px)";ctx.fillStyle="rgba(30,30,40,0.35)";rr(ctx,P.x+26,P.y+40,P.w,1200,P.r);ctx.fill();ctx.restore();
  wc_wash(ctx,wc_rrPts(P.x,P.y,P.w,1200,P.r),[44,46,56],{kind:"thing",lw:1.6,seed:5});ctx.fillStyle=rgba([250,250,252],1);rr(ctx,P.sx,P.y+26,P.sw,1200,P.r-18);ctx.fill();
  ctx.fillStyle=rgba([30,30,36],1);rr(ctx,P.x+P.w/2-70,P.y+40,140,34,17);ctx.fill();}
// the keyboard, its top at y0: three rows of letters, the shift key (lit when the phone will start with a capital, and the letters in
// capitals), and the bottom row, with "@" and "." on an email keyboard; the keys' letters are decoration. Returns where each key is.
function fw_keyboard(ctx,y0,shift,email,press){const P=FW_PH,kw=P.sw/10,rows=["qwertyuiop","asdfghjkl","zxcvbnm"],pos={};ctx.fillStyle=rgba([214,218,226],1);ctx.fillRect(P.sx,y0,P.sw,520);
  rows.forEach((r,i)=>{const off=i===1?kw/2:i===2?kw*1.5:0;[...r].forEach((ch,j)=>{const kx=P.sx+off+j*kw+3,ky=y0+14+i*96,on=press===ch;pos[ch]=[kx+kw/2-3,ky+38];
    ctx.fillStyle=on?"#cfd4de":"#fff";rr(ctx,kx,ky,kw-6,80,8);ctx.fill();wc_T(ctx,shift>0.5?ch.toUpperCase():ch,kx+kw/2-3,ky+52,{w:600,size:30,align:"center",col:WC_DARK,deco:1});});});
  // shift, and delete
  const sy=y0+14+2*96,sk=[P.sx+3,sy,kw*1.4-6,80];ctx.fillStyle=shift>0.02?rgba(mix([180,186,198],[255,255,255],shift),1):"#b8bec9";rr(ctx,...sk,8);ctx.fill();
  ctx.save();ctx.translate(sk[0]+sk[2]/2,sy+40);ctx.fillStyle=shift>0.5?rgba(WC_DARK,1):"#fff";ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(16,0);ctx.lineTo(7,0);ctx.lineTo(7,16);ctx.lineTo(-7,16);ctx.lineTo(-7,0);ctx.lineTo(-16,0);ctx.closePath();ctx.fill();ctx.restore();
  pos.shift=[sk[0]+sk[2]/2,sy+40];ctx.fillStyle="#b8bec9";rr(ctx,P.sx+P.sw-kw*1.4+3,sy,kw*1.4-6,80,8);ctx.fill();
  // the bottom row
  const by=y0+14+3*96,cells=email?[["123",1.3],["@",1],["space",4.4],[".",1],["return",2.3]]:[["123",1.3],["space",6.4],["return",2.3]];let bx=P.sx+3;
  cells.forEach(([s,u])=>{const bw=kw*u-6;ctx.fillStyle=s.length===1?"#fff":"#b8bec9";rr(ctx,bx,by,bw,80,8);ctx.fill();if(s!=="space")wc_T(ctx,s,bx+bw/2,by+52,{w:700,size:s.length===1?34:28,align:"center",col:WC_DARK,deco:1});
    pos[s]=[bx+bw/2,by+40];bx+=bw+6;});return pos;}
// the screen: the form; the email box with what's typed (val, cross-fading from prev as mixv goes 0 to 1 when the form rewrites it), its
// first letter ringed (ring, at ringAt, in ringCol: red for a capital the phone added), its spaces marked and ringed (spc), a caret, a
// tick once it checks (ok), the phone's "Paste" over the box (paste); the bar of suggestions (sug, 0 to 1, showing sugVal) and the
// keyboard (kb: 1 up, 0 put away, which shows the button, pressed as btn goes 0 to 1). Returns where the keys are, and where the
// suggestion, the box, "Paste" and the button are (pos.sug, pos.box, pos.paste, pos.btn), for the thumb.
function fw_phone(ctx,o){const P=FW_PH,[bx,by,bw,bh]=P.box,[nx,ny,nw,nh]=P.name,kb=o.kb==null?1:o.kb;
  wc_T(ctx,"Sign up for a short course",P.sx+28,P.y+114,{w:800,size:32,col:WC_DARK});
  wc_T(ctx,"Name",P.sx+28,ny-16,{w:600,size:28,col:WC_MUTED});ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=2;ctx.strokeRect(nx,ny,nw,nh);
  wc_T(ctx,o.name||"Daniel Kim",nx+16,ny+38,{w:600,size:30,col:WC_INK});
  wc_T(ctx,"Email",P.sx+28,by-16,{w:600,size:28,col:WC_MUTED});ctx.fillStyle="#fff";ctx.fillRect(bx,by,bw,bh);ctx.strokeStyle=rgba(o.ok>0?GV.green:GV.goldInk,0.9);ctx.lineWidth=3;ctx.strokeRect(bx,by,bw,bh);
  const sz=P.sz,tx=bx+14,ty=by+bh/2+sz*0.36,val=o.val||"",m=o.prev==null?1:clamp(o.mixv==null?1:o.mixv,0,1);
  // what's typed, in the normal type: a space shows as a small grey bar where the phone left it (fw_email), ringed red as spc goes 0 to 1
  const show=(v,a)=>{if(!v)return null;const xs=fw_email(ctx,v,tx,ty,{size:sz,col:WC_DARK,a});
    if(a>0.01&&o.spc>0)for(let i=0;i<v.length;i++)if(v[i]===" ")withA(ctx,a,()=>wc_ring(ctx,(xs[i]+xs[i+1])/2,ty-sz*0.3,(xs[i+1]-xs[i])*0.9+6,sz*0.95,o.spc,{col:GV.red,lw:4}));return xs;};
  if(o.prev!=null)show(o.prev,1-m);const xs=show(val,m)||[tx];
  if(o.ring>0&&xs.length>1){const i=o.ringAt||0;wc_ring(ctx,(xs[i]+xs[i+1])/2,ty-sz*0.34,Math.max(sz*0.5,(xs[i+1]-xs[i])*0.8),sz*0.95,o.ring,{col:o.ringCol||GV.red,lw:4});}
  if(o.paste>0)withA(ctx,o.paste,()=>{ctx.fillStyle=rgba([40,40,48],0.94);rr(ctx,bx+120,by-70,140,58,12);ctx.fill();ctx.beginPath();ctx.moveTo(bx+178,by-12);ctx.lineTo(bx+190,by);
    ctx.lineTo(bx+202,by-12);ctx.closePath();ctx.fill();wc_T(ctx,"Paste",bx+190,by-31,{w:700,size:28,align:"center",col:[255,255,255]});});
  if(o.caret&&Math.floor((o.t||0)*2)%2===0){ctx.fillStyle=rgba(GV.cyanInk,0.9);ctx.fillRect(xs[xs.length-1]+2,by+16,3,bh-32);}
  if(o.ok>0)wc_tick(ctx,bx+bw-26,by-28,34,GV.green,o.ok,5);
  // the button, under the keyboard until it's put away
  const [ux,uy,uw,uh]=P.btn,pr=clamp(o.btn||0,0,1);if(kb<0.99){ctx.fillStyle=rgba(mix([70,96,140],[40,64,104],pr),1);rr(ctx,ux,uy+3*pr,uw,uh,12);ctx.fill();
    wc_T(ctx,"Sign up",ux+uw/2,uy+3*pr+38,{w:800,size:30,align:"center",col:[255,255,255]});}
  const dy=(1-easeCam(clamp(kb,0,1)))*640;ctx.save();ctx.translate(0,dy);
  const [gx,gy,gw,gh]=P.sug;ctx.fillStyle=rgba([226,229,235],1);ctx.fillRect(gx,gy,gw,gh);
  if(o.sug>0)withA(ctx,o.sug,()=>wc_T(ctx,o.sugVal||"DanielKim.Work@mail.example",gx+gw/2,gy+gh/2+sz*0.36,{w:600,size:sz,align:"center",col:WC_DARK}));
  const pos=fw_keyboard(ctx,P.keys,o.shift||0,o.email,o.press);ctx.restore();for(const k in pos)pos[k]=[pos[k][0],pos[k][1]+dy];pos.sug=[gx+gw/2,gy+gh/2+dy];
  pos.box=[bx+bw*0.6,by+bh/2];pos.paste=[bx+190,by-41];pos.btn=[ux+uw/2,uy+uh/2];return pos;}
// the hand holding the phone: three fingertips round its left edge, and the thumb, from the phone's lower right corner to (tx,ty),
// pressing (down)
const FW_HSKIN=[206,156,120];
function fw_thumb(ctx,tx,ty,down){const P=FW_PH;for(const [fy,k] of [[640,1],[770,1.04],[900,1.02]])wc_wash(ctx,wc_smooth([[P.x+20,fy-30],[P.x-26*k,fy-26],[P.x-34*k,fy+8],[P.x-20*k,fy+34],[P.x+20,fy+30]],4),FW_HSKIN,{kind:"limb",lw:1.2,seed:fy});
  const bx=1260,by=1140,d=down||0,tip=[tx+8,ty+26+d*6],ang=Math.atan2(tip[1]-by,tip[0]-bx),nx=-Math.sin(ang),ny=Math.cos(ang),wb=96,r=44,c=[Math.cos(ang),Math.sin(ang)];
  // its outline: from the hand along one side, round the tip in a half circle, and back along the other side
  const o=[tip[0]-c[0]*30,tip[1]-c[1]*30],pts=[[bx+nx*wb,by+ny*wb]];
  for(let i=0;i<=12;i++){const a=Math.PI/2-i/12*Math.PI,ca=Math.cos(a),sa=Math.sin(a);pts.push([o[0]+r*(ca*c[0]+sa*nx),o[1]+r*(ca*c[1]+sa*ny)]);}
  pts.push([bx-nx*wb,by-ny*wb]);
  ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(30,30,40,0.22)";ctx.beginPath();ctx.ellipse(tip[0]+16,tip[1]+30,40,26,ang,0,TAU);ctx.fill();ctx.restore();
  wc_wash(ctx,pts,FW_HSKIN,{kind:"limb",lw:1.4,seed:31});
  // the nail, near the tip, on the side facing us; a crease at the joint
  ctx.save();ctx.translate(tip[0]-c[0]*34,tip[1]-c[1]*34);ctx.rotate(ang);ctx.fillStyle=rgba(wc_lit(FW_HSKIN,0.42),0.9);ctx.beginPath();ctx.ellipse(0,0,24,17,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(wc_dim(FW_HSKIN,0.3),0.5);ctx.lineWidth=2;ctx.stroke();ctx.restore();ctx.save();ctx.strokeStyle=rgba(wc_dim(FW_HSKIN,0.3),0.4);ctx.lineWidth=2.4;
  ctx.beginPath();ctx.moveTo(tip[0]-c[0]*90+nx*30,tip[1]-c[1]*90+ny*30);ctx.quadraticCurveTo(tip[0]-c[0]*100,tip[1]-c[1]*100,tip[0]-c[0]*90-nx*30,tip[1]-c[1]*90-ny*30);ctx.stroke();ctx.restore();}

/* ---------- today: the platform team's desk, at night and in the morning ---------- */
// a screen as the series draws it (gv_screen), with its title marked as decoration too while the camera is too far away to read it
function fw_screen(ctx,x,y,w,h,title,fn,o){o=o||{};gv_screen(ctx,x,y,w,h,null,q=>{wc_T(q,title,x+18,y+(o.barH||40)*0.72,{w:700,size:o.titleSize||28,col:[255,255,255],deco:o.deco});if(fn)fn(q);},o);}
// Sam's desk at night: the room dark blue, only the screens lit; in the morning, the room as it is
function fw_night(ctx,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[52,62,104],a),1);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";for(const [sx,sy,sw,sh] of GV_PX.screens){wc_glowAt(ctx,sx+sw/2,sy+sh/2,sw*0.75,[150,180,230],0.5*a);}ctx.restore();}
// the badges the platform sent last night, on the left screen: arriving one by one (n, how many), half with no credit (glow lights them);
// each with its name, its kind (a microcredential, or a plain badge, as the welcome badge is) and its credit
const FW_BG=[["SQL for Analysis","microcredential",5],["Python Foundations","microcredential",0],["Welcome to Online Learning","badge",0],["Data Visualisation","microcredential",0],
  ["Statistics Refresher","microcredential",5],["Leading Teams","microcredential",0],["Health Data Essentials","microcredential",5],["Security Fundamentals","microcredential",5]];
function fw_badges(ctx,n,glow,deco){const [x,y,w,h]=GV_PX.screens[0];fw_screen(ctx,x,y,w,h,"Badges · last night",q=>{
  [["badge",x+18,"left"],["kind",x+276,"left"],["credit",x+w-40,"center"]].forEach(([s,hx,al])=>wc_T(q,s,hx,y+64,{w:700,size:18,align:al,col:WC_MUTED,deco}));
  FW_BG.forEach(([s,kd,c],i)=>{const u=clamp(n-i,0,1);if(u<=0)return;const yy=y+94+i*28;withA(q,u,()=>{if(c===0&&glow>0)gv_tint(q,x+12,yy-20,w-24,26,FW.amber,0.6*glow);
    wc_T(q,s,x+18,yy,{w:600,size:18,col:WC_INK,deco});wc_T(q,kd,x+276,yy,{w:600,size:18,col:WC_MUTED,deco});wc_T(q,String(c),x+w-40,yy,{w:800,size:20,align:"center",col:c?WC_DARK:FW.amberInk,deco});});});
},{titleSize:20,barH:30,deco});}
// what was checked, on the right screen: the credit is there, and it's a number (p, 0 to 1, ticks them)
function fw_checks(ctx,p,deco){const [x,y,w,h]=GV_PX.screens[1];fw_screen(ctx,x,y,w,h,"Checks · last night",q=>{wc_T(q,"credit",x+30,y+84,{w:700,size:20,col:WC_MUTED,deco});
  [["filled in",0],["a number",1]].forEach(([s,i])=>{const yy=y+150+i*70;wc_panel(q,x+30,yy-44,w-60,58,{kind:"card",wash:GV.green,washA:0.2,seed:201+i});
    wc_T(q,s,x+56,yy-6,{w:700,size:24,col:WC_DARK,deco});wc_tick(q,x+w-80,yy-15,26,GV.green,clamp(p*2-i*0.6,0,1),4);});},{titleSize:20,barH:30,deco});}
// the wallet's card for one of them, on the right screen: a microcredential shown as a plain badge
function fw_walletBadge(ctx,u,deco){const [x,y,w,h]=GV_PX.screens[1];fw_screen(ctx,x,y,w,h,"Wallet",q=>{withA(q,u,()=>{wc_panel(q,x+40,y+64,w-80,h-100,{kind:"card",wash:GV_LOOPC,washA:0.15,seed:205});
  wc_wash(q,wc_ell(x+110,y+150,40,40,24),[200,204,212],{kind:"thing",lw:1.2,seed:206});wc_T(q,"Python Foundations",x+170,y+138,{w:800,size:24,col:WC_DARK,deco});
  wc_T(q,"badge",x+170,y+172,{w:600,size:22,col:WC_MUTED,deco});wc_T(q,"no credit",x+80,y+244,{w:800,size:24,col:FW.amberInk,deco});});},{titleSize:20,barH:30,deco});}
// monitoring's panels, on the right screen: when the table arrives, how many rows, how many empty, and how the values spread: the
// share of badges with no credit, night by night (k: how many panels are lit; last: last night's bar rising)
function fw_monitor(ctx,k,last,deco){const [x,y,w,h]=GV_PX.screens[1];fw_screen(ctx,x,y,w,h,"Badges · usual shape",q=>{const pw=148,ph=96;
  [["arrived","02:00"],["rows","as usual"],["empty","0%"]].forEach(([a,b],i)=>{const u=clamp(k-i,0,1);if(u<=0)return;const px=x+14+i*(pw+11),py=y+42;withA(q,u,()=>{wc_panel(q,px,py,pw,ph,{kind:"card",wash:GV.green,washA:0.18,seed:210+i});
    wc_T(q,a,px+14,py+36,{w:700,size:20,col:WC_MUTED,deco});wc_T(q,b,px+14,py+72,{w:800,size:22,col:WC_DARK,deco});wc_tick(q,px+pw-26,py+62,20,GV.green,1,3.4);});});
  const u=clamp(k-3,0,1);if(u>0)withA(q,u,()=>{const px=x+14,py=y+150,pw2=w-28,ph2=h-162;wc_panel(q,px,py,pw2,ph2,{kind:"card",wash:last>0.5?FW.amber:GV.green,washA:0.18,seed:214});
    wc_T(q,"no credit, night by night",px+14,py+30,{w:700,size:20,col:WC_MUTED,deco});
    // the bars on the left, what they say on the right
    for(let i=0;i<11;i++){const v=i===10?lerp(1/12,0.5,easeCam(clamp(last,0,1))):1/12*(0.85+0.3*hash(i,5)),bh=v*190,bx=px+20+i*22;q.fillStyle=rgba(i===10&&last>0.3?FW.amber:[150,186,222],1);q.fillRect(bx,py+ph2-14-bh,14,bh);}
    wc_T(q,"usually 1 in 12",px+pw2-16,py+76,{w:700,size:22,align:"right",col:WC_INK,deco});if(last>0.3)withA(q,clamp(last*2-0.6,0,1),()=>wc_T(q,"last night 1 in 2",px+pw2-16,py+110,{w:800,size:22,align:"right",col:FW.amberInk,deco}));});},{titleSize:20,barH:30,deco});}
// over the screen: whose the badges are, the owner on record, lighting (u)
function fw_ownerCard(ctx,u){if(u<=0)return;const [x,y,w]=GV_PX.screens[1];withA(ctx,clamp(u*2,0,1),()=>{const tw2=Math.round(tw(ctx,"owner on record: Learning team",28,700)+40);
  gv_halo(ctx,x+w-10-tw2,y-92,tw2,64,GV.gold,0.8*u);wc_tag(ctx,x+w-10,y-60,"owner on record: Learning team",{align:"right",size:28,wash:GV.gold,washA:0.5});});}

// the alert, flying from monitoring's screen towards its owner (u, 0 to 1 along its way): an amber card, too quick to read
function fw_flyAlert(ctx,u){if(u<=0||u>=1)return;const e=easeCam(u),x=lerp(1050,2160,e),y=lerp(500,-160,e)-120*Math.sin(Math.PI*e),k=lerp(1,0.6,e);
  ctx.save();ctx.translate(x,y);ctx.rotate(lerp(0,0.3,e));ctx.scale(k,k);wc_panel(ctx,-130,-60,260,120,{kind:"card",wash:FW.amber,washA:0.4,seed:241});gv_lines(ctx,-100,-24,200,3,22,1);ctx.restore();}

/* ---------- today: the rule, and the three cards ---------- */
// the rule, on Tom's desk: the series' sign-off sheet as a quality rule card, its lines coming in one by one (p), Tom's signature
// written in as a pen moves along it (sign), and the green stamp (stamp)
const FW_RL={kicker:"Quality rule",title:"A microcredential carries credit",
  rows:[["Owner","Learning team"],["Dimension","validity"],["Level","stop on any"],["Why","the wallet shows it as a plain badge"]]};
function fw_rule(ctx,p,sign,stamp){const [x,y,w]=FW_TT.card,r=gv_signoff(ctx,x,y,w,Object.assign({p,signer:"Tom Whitfield",signP:sign,stamp:"signed",stampP:stamp},FW_RL));
  // the pen, at the end of what's written, then laid down beside the card
  if(sign>0){const k=w/1000,n=Math.ceil(13*clamp(sign,0,1)),sx=r.x+(12+tw(ctx,"Tom Whitfield".slice(0,n),38,600))*k,sy=r.rows[r.rows.length-1]+105*k,
      dn=clamp((stamp||0)*3,0,1);fw_pen(ctx,lerp(sx,x+w+110,dn),lerp(sy,y+r.h*0.62,dn),lerp(-0.75,-1.25,dn));}
  return r;}
// on Yusuf's board: prevent, check, watch, a card each, with a small picture of what it is (the email box, the sensor, the bars); and
// the small card that moves from watch to check (mv, 0 to 1)
const FW_3=[["prevent","where it starts"],["check","what you know"],["watch","what you don't"]],FW_3X=[520,960,1400];
function fw_three(ctx,k,u,mv){if(u<=0)return;const e=easeCam(clamp(u,0,1)),x=FW_3X[k],y=470,w=400,h=330;ctx.save();ctx.translate(x,y-14*(1-e));ctx.rotate([-0.014,0.01,-0.008][k]);
  withA(ctx,clamp(u*2.5,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:[GV.green,GV.gold,GV_LOOPC][k],washA:0.25,seed:220+k});gv_pin(ctx,0,-h/2+18,GV.red,1.2);
    wc_T(ctx,FW_3[k][0],-w/2+34,-h/2+92,{w:800,size:48,col:WC_DARK});wc_T(ctx,FW_3[k][1],-w/2+34,-h/2+142,{w:600,size:32,col:WC_INK});
    const py=40;if(k===0){ctx.fillStyle="#fff";ctx.fillRect(-150,py,300,56);ctx.strokeStyle=rgba(GV.green,0.9);ctx.lineWidth=3;ctx.strokeRect(-150,py,300,56);wc_T(ctx,"@",-120,py+40,{w:600,size:30,col:WC_MUTED});wc_tick(ctx,120,py+28,34,GV.green,1,5);}
    if(k===1)fw_sensor(ctx,0,py+90,1.3,1,1);
    if(k===2)for(let i=0;i<8;i++){const bh=i===7?70:18+10*hash(i,3);ctx.fillStyle=rgba(i===7?FW.amber:[150,186,222],1);ctx.fillRect(-140+i*36,py+100-bh,24,bh);}});ctx.restore();
  if(k===2&&mv>0){const v=easeCam(clamp(mv,0,1)),cx=lerp(FW_3X[2],FW_3X[1],v),cy=y+250-120*Math.sin(v*Math.PI);ctx.save();ctx.translate(cx,cy);ctx.rotate(lerp(0.03,-0.02,v));
    wc_panel(ctx,-170,-46,340,92,{kind:"card",wash:GV.gold,washA:0.45,seed:230});wc_T(ctx,"a microcredential",-150,-6,{w:700,size:28,col:WC_DARK});wc_T(ctx,"carries credit",-150,30,{w:600,size:28,col:WC_INK});ctx.restore();}}

/* ---------- today: the stewards' meeting room ---------- */
// what's on the room's screen: the evidence, plainly
function fw_evidence(ctx,u){const [sx,sy,sw,sh]=GV_MT.screen;if(u<=0)return;withA(ctx,u,()=>gv_screen(ctx,sx,sy,sw,sh,"Short-course emails",q=>{
  wc_T(q,"as typed: 3 of 8",sx+36,sy+120,{w:800,size:40,col:WC_DARK});wc_T(q,"cause: the form's",sx+36,sy+190,{w:600,size:34,col:WC_INK});wc_T(q,"email box",sx+36,sy+236,{w:600,size:34,col:WC_INK});},{titleSize:28,barH:46}));}

const WC_PLACES={court:fw_paintCourt,corridor:fw_paintCorridor,hands:fw_paintHands,register:fw_paintRegister,ward:fw_paintWard,pestTop:fw_paintPestTop,pest:fw_paintPest,
  pestDesk:fw_paintPestDesk,office:c=>{gv_paintOffice(c);fw_paintOfficeWall(c);},policy:fw_paintPolicy,screenGov:c=>gv_paintScreenDesk(c,GV_ROOM.gov),boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),
  data:c=>{gv_paintData(c);fw_paintDataBoard(c);},screenData:c=>gv_paintScreenDesk(c,GV_ROOM.data),boardData:c=>gv_paintBoardClose(c,GV_ROOM.data),tomTop:fw_paintTomTop,tom:fw_paintTom,tomDesk:fw_paintTomDesk,screenLearn:c=>gv_paintScreenDesk(c,GV_ROOM.learn),phone:fw_paintPhone,
  platform:gv_paintPlatformClose,platformDesk:gv_paintPlatformDesk,meeting:gv_paintMeeting,meetingTable:gv_paintMeetingTable};
