/* ===== Who does what, end to end: the opening's places =====
   Madrid in 1892, painted the series' way (master data's wash.js and people.js, the series' rooms.js and people.js): a meeting room of the
   academy at night, a long table under oil lamps, bookcases to the ceiling, seen from the side, so a slip passed up the table travels
   along it; the same room by day, where the steps happen today. Lima: a schoolroom, a pupil's desk close; three small pictures of people
   who use the words; the academy's tall door far down a corridor; Palma's desk in the National Library in 1909. Mexico City in 1951: a
   congress's table. Today: two members' desks in two cities, and a bus stop. Nothing on screen is in Spanish: the writing on slips, in the
   notebook and in the dictionary is lines too small to read, and the corner names the place. The places are painted once and kept (the
   series' finish.js); what moves is drawn every frame. Every name starts with ee_ or EE, because every file of the film shares one script. */

/* ---------- the opening's colours ---------- */
// panelled walls and dark wood, the table's green baize, brass and opal glass for the lamps, leather bindings; whitewash and slate in
// Lima; the congress's cloth in 1951; a city's stone and glass today
const EE={wall:[136,98,80],wallDay:[188,156,128],wood:[100,68,46],woodDk:[66,44,32],woodLt:[140,102,70],baize:[62,98,74],baizeDk:[40,66,52],
  brass:[200,164,88],brassDk:[136,104,52],opal:[248,242,226],floor:[112,80,58],velvet:[132,46,50],night:[38,44,68],glassN:[56,70,98],
  lime:[238,232,214],slate:[64,72,72],oak:[176,136,92],oakDk:[128,96,64],cloth:[244,242,236],stone:[214,206,190],sky:[176,206,232]};
const EE_BOOKS=[[122,52,46],[88,62,46],[62,80,64],[136,106,72],[72,58,76],[152,122,82],[98,42,42],[110,96,70],[60,62,80],[140,80,54]];
// a place painted at twice the frame's size, for the shots that move in close (its painter draws in frame coordinates)
function ee_hi(key,paint){return wc_kept("eeHi:"+key,W*2,H*2,q=>{q.scale(2,2);paint(q);});}
const ee_placeHi=key=>ee_hi(key,WC_PLACES[key]);

/* ---------- Madrid, 1892: the academy's meeting room ---------- */
// The room from the side of its long table: the back wall all bookcases, four bays of them under a cornice, a tall window at the left;
// three oil lamps hanging over the table, brass with opal shades; high-backed chairs along the table's far side. The table is drawn
// over the people sitting at it (ee_acadTable), its green baize to the floor. By night (1892) the lamps are lit and the corners dark; by day
// (o.day, 1956 and today) the window lights the room. EE_AC: the cornice, the bookcases' top and foot, the bays ([x, w]), the window, the
// lamps (x), where they hang, the table (its back and front edges, its ends, the skirt's foot), the chairs (x), and the scale people sit at
const EE_AC={cor:96,bTop:126,bBot:776,bays:[[372,380],[792,380],[1212,380],[1632,250]],win:[96,150,236,560],lamps:[540,980,1420],lampY:318,
  tb:{bk:650,fr:784,x0:196,x1:1724,fx0:96,fx1:1824,ft:906},seats:[300,520,740,960,1180,1400,1612],s:0.62};
function ee_books(ctx,x,y,w,seed,o){o=o||{};const R=wc_rng(seed);let bx=x;ctx.save();
  while(bx<x+w-8){const bw=13+R()*17,bh=(o.h||82)*(0.78+R()*0.22),col=EE_BOOKS[Math.floor(R()*EE_BOOKS.length)],lean=R()<0.06&&bx<x+w-60;
    if(bx+bw>x+w)break;ctx.save();ctx.translate(bx+bw/2,y);if(lean)ctx.rotate(-0.16);const g=ctx.createLinearGradient(-bw/2,0,bw/2,0);g.addColorStop(0,rgba(wc_lit(col,0.12),1));g.addColorStop(0.6,rgba(col,1));g.addColorStop(1,rgba(wc_dim(col,0.3),1));
    ctx.fillStyle=g;ctx.fillRect(-bw/2,-bh,bw,bh);ctx.fillStyle=rgba([226,190,110],0.55);for(const k of [0.14,0.2,0.78])ctx.fillRect(-bw/2+2,-bh*(1-k),bw-4,Math.max(1.2,bh*0.02));
    ctx.fillStyle=rgba(wc_dim(col,0.4),0.5);ctx.fillRect(-bw/2,-bh,1.4,bh);ctx.restore();bx+=bw+(lean?8:1+R()*1.5);}
  ctx.restore();}
function ee_bookcaseBay(ctx,x,w,day){const A=EE_AC,top=A.bTop,bot=A.bBot,n=6,sh=(bot-top-40)/n,wd=EE.wood;
  wc_part(ctx,wc_rect(x,top,w,bot-top),wc_dim(wd,0.42),1,{lw:1.2,seed:x});
  for(let k=0;k<n;k++){const sy=top+24+(k+1)*sh;ee_books(ctx,x+20,sy-6,w-40,Math.round(x)+k*13,{h:sh-22});
    ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,sy-sh+12,0,sy-sh+44);g.addColorStop(0,"rgba(40,26,18,0.5)");g.addColorStop(1,"rgba(40,26,18,0)");ctx.fillStyle=g;ctx.fillRect(x+16,sy-sh+12,w-32,32);ctx.restore();
    wc_part(ctx,wc_rect(x+12,sy-6,w-24,14),wc_lit(wd,0.05),1,{lw:1,seed:x+k});}
  // the bay's frame: sides, cornice, plinth
  wc_part(ctx,wc_rect(x-6,top,24,bot-top),wd,1,{seed:x+3});wc_part(ctx,wc_rect(x+w-18,top,24,bot-top),wd,1,{seed:x+5});
  wc_part(ctx,wc_rect(x-14,top-18,w+28,26),wc_lit(wd,0.1),1,{seed:x+7});wc_part(ctx,wc_rect(x-8,bot-30,w+16,30),wc_dim(wd,0.08),1,{seed:x+9});}
// an oil lamp hanging on its chain: a brass font, a glass chimney, an opal shade; lit by night (its glow is painted with it)
function ee_lamp(ctx,x,y,lit){ctx.save();ctx.strokeStyle=rgba(EE.brassDk,0.9);ctx.lineWidth=3;for(let yy=0;yy<y-78;yy+=14){ctx.beginPath();ctx.ellipse(x,yy+7,3.5,7,0,0,TAU);ctx.stroke();}ctx.restore();
  // the smoke bell and the glass chimney above the shade, the shade (opal glass, a dome open below), and the brass font under its rim
  wc_part(ctx,wc_ell(x,y-78,16,8,16),EE.brassDk,1,{seed:Math.round(x)});
  wc_wash(ctx,[[x-9,y-70],[x+9,y-70],[x+12,y-28],[x-12,y-28]],[236,240,236],{kind:"thing",lw:1.1,a:0.7,seed:Math.round(x)+1});
  wc_part(ctx,[[x-82,y+18],[x-70,y-6],[x-44,y-26],[x-16,y-34],[x+16,y-34],[x+44,y-26],[x+70,y-6],[x+82,y+18],[x+62,y+24],[x-62,y+24]],lit?[255,250,236]:EE.opal,1,{lw:1.2,seed:Math.round(x)+2});
  wc_part(ctx,[[x-34,y+22],[x+34,y+22],[x+26,y+42],[x-26,y+42]],EE.brass,1,{lw:1.1,seed:Math.round(x)+3});wc_part(ctx,[[x-8,y+42],[x+8,y+42],[x+4,y+58],[x-4,y+58]],EE.brassDk,1,{seed:Math.round(x)+4});
  if(lit){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,300,[255,210,140],0.36);wc_glowAt(ctx,x,y-4,110,[255,240,200],0.5);
    // the light falling from under the shade, onto the table
    const g=ctx.createLinearGradient(0,y+20,0,EE_AC.tb.fr);g.addColorStop(0,"rgba(255,214,150,0.22)");g.addColorStop(1,"rgba(255,214,150,0)");ctx.fillStyle=g;ctx.beginPath();
    ctx.moveTo(x-70,y+22);ctx.lineTo(x+70,y+22);ctx.lineTo(x+300,EE_AC.tb.fr);ctx.lineTo(x-300,EE_AC.tb.fr);ctx.closePath();ctx.fill();ctx.restore();}}
// a high-backed chair, seen from the front behind the table: its back's frame and its velvet
function ee_chairBack(ctx,x,top,col){wc_part(ctx,[[x-62,EE_AC.tb.bk+10],[x-58,top+30],[x-40,top],[x+40,top],[x+58,top+30],[x+62,EE_AC.tb.bk+10]],EE.woodDk,1,{seed:Math.round(x)});
  wc_part(ctx,[[x-46,EE_AC.tb.bk+10],[x-44,top+38],[x-30,top+16],[x+30,top+16],[x+44,top+38],[x+46,EE_AC.tb.bk+10]],col||EE.velvet,1,{seed:Math.round(x)+1,lw:1});}
function ee_paintAcad(ctx,o){o=o||{};const A=EE_AC,day=!!o.day,wall=day?EE.wallDay:EE.wall;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,A.tb.ft+40),wall,{kind:"plaster",line:false,seed:301});
  // the ceiling's beams and the cornice
  wc_wash(ctx,wc_rect(-40,-40,W+80,A.cor+30),wc_dim(EE.wood,0.2),{kind:"build",line:false,seed:303});for(let x=60;x<W;x+=240)wc_part(ctx,wc_rect(x,-10,40,A.cor+4),wc_dim(EE.wood,0.38),1,{seed:x});
  wc_part(ctx,wc_rect(-20,A.cor,W+40,22),wc_lit(EE.wood,0.15),1,{seed:305});
  // the window, at the left: by night, its glass dark blue with the street's lamps far below; by day, the sky
  const [wx,wy,ww,wh]=A.win;wc_part(ctx,wc_rect(wx-22,wy-22,ww+44,wh+44),EE.wood,1,{seed:307});
  if(day){const g=ctx.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,rgba(EE.sky,1));g.addColorStop(1,rgba([226,234,236],1));ctx.fillStyle=g;ctx.fillRect(wx,wy,ww,wh);
    wc_wash(ctx,[[wx,wy+wh*0.72],[wx+ww*0.4,wy+wh*0.66],[wx+ww,wy+wh*0.7],[wx+ww,wy+wh],[wx,wy+wh]],[196,190,178],{kind:"build",line:false,seed:309,a:0.8});}
  else{const g=ctx.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,rgba(EE.night,1));g.addColorStop(1,rgba(EE.glassN,1));ctx.fillStyle=g;ctx.fillRect(wx,wy,ww,wh);
    ctx.save();ctx.globalCompositeOperation="screen";for(const [px,py] of [[wx+50,wy+wh*0.8],[wx+170,wy+wh*0.86]])wc_glowAt(ctx,px,py,26,[255,200,120],0.6);ctx.restore();}
  for(const r of [wc_rect(wx+ww/2-6,wy,12,wh),wc_rect(wx,wy+wh*0.36,ww,10),wc_rect(wx,wy+wh*0.68,ww,10)])wc_part(ctx,r,EE.wood,1,{seed:311});
  // curtains, heavy, drawn back
  for(const [cx,s] of [[wx-30,-1],[wx+ww+30,1]])wc_wash(ctx,[[cx-s*10,wy-40],[cx+s*70,wy-40],[cx+s*40,wy+wh*0.5],[cx+s*64,wy+wh+40],[cx-s*14,wy+wh+40]],EE.velvet,{kind:"cloth",seed:313+s,lw:1.2});
  A.bays.forEach(([x,w])=>ee_bookcaseBay(ctx,x,w,day));
  // a portrait between the window and the bookcases is left out: nothing on the walls names anyone
  // the chairs' backs along the far side of the table
  A.seats.forEach((x,i)=>ee_chairBack(ctx,x,A.tb.bk-196,i%2?wc_dim(EE.velvet,0.08):EE.velvet));
  // the floor, dark boards, in front of the table
  wc_wash(ctx,wc_rect(-40,A.tb.ft-30,W+80,H-A.tb.ft+70),EE.floor,{kind:"ground",line:false,seed:315});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(EE.floor,0.3),0.4);ctx.lineWidth=2;for(let i=-10;i<=10;i++){ctx.beginPath();ctx.moveTo(960+i*120,A.tb.ft);ctx.lineTo(960+i*260,H+40);ctx.stroke();}ctx.restore();
  // the lamps, and by night the dark of the room's corners and its ceiling
  A.lamps.forEach(x=>ee_lamp(ctx,x,A.lampY,!day));
  if(day){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh*0.6,700,[255,250,236],0.32);ctx.restore();}}
// the night's veil: dark warm brown at the room's edges and its ceiling, clear in the lamps' pools; drawn over the room, and over the people
// in it each frame, so they stand in the same light
function ee_nightVeil(){return wc_kept("eeNightVeil",W,H,q=>{q.fillStyle="rgb(255,255,255)";q.fillRect(0,0,W,H);const g=q.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"rgba(92,66,58,0.85)");g.addColorStop(0.3,"rgba(150,120,104,0.45)");g.addColorStop(0.62,"rgba(200,182,170,0.2)");g.addColorStop(1,"rgba(120,96,86,0.55)");q.fillStyle=g;q.fillRect(0,0,W,H);
  const s=q.createRadialGradient(960,560,300,960,560,1200);s.addColorStop(0,"rgba(255,255,255,0)");s.addColorStop(1,"rgba(90,66,56,0.7)");q.fillStyle=s;q.fillRect(0,0,W,H);
  q.globalCompositeOperation="lighter";for(const x of EE_AC.lamps){const r=q.createRadialGradient(x,EE_AC.lampY+60,40,x,EE_AC.lampY+200,560);r.addColorStop(0,"rgba(120,96,70,0.5)");r.addColorStop(1,"rgba(120,96,70,0)");q.fillStyle=r;q.fillRect(x-600,0,1200,H);}});}
// the long table, drawn over the people sitting at it: its top in green baize, seen a little from above, a brass-studded edge, and the cloth
// hanging to the floor in folds; the things that stay on it (an inkstand, papers, two books, a bell)
function ee_acadTable(day){return wc_kept("eeAcadTable"+(day?"D":"N"),W,H,q=>{const T_=EE_AC.tb,top=[[T_.x0,T_.bk],[T_.x1,T_.bk],[T_.fx1,T_.fr],[T_.fx0,T_.fr]];
  wc_wash(q,top,EE.baize,{kind:"cloth",seed:321,lw:1.3});
  q.save();wc_tr(q,top);q.clip();const g=q.createLinearGradient(0,T_.bk,0,T_.fr);g.addColorStop(0,"rgba(255,255,255,0.08)");g.addColorStop(1,"rgba(0,0,0,0.12)");q.fillStyle=g;q.fillRect(0,T_.bk,W,T_.fr-T_.bk);
  if(!day){q.globalCompositeOperation="screen";for(const x of EE_AC.lamps)wc_glowAt(q,x,T_.bk+30,300,[255,220,150],0.22);}q.restore();
  // the skirt: the baize hanging down the front, with folds
  const sk=[[T_.fx0,T_.fr],[T_.fx1,T_.fr],[T_.fx1+6,T_.ft],[T_.fx0-6,T_.ft]];wc_wash(q,sk,wc_dim(EE.baize,0.12),{kind:"cloth",seed:323,lw:1.3});
  q.save();wc_tr(q,sk);q.clip();const R=wc_rng(325);for(let x=T_.fx0+30;x<T_.fx1;x+=46+R()*40){const g2=q.createLinearGradient(x-18,0,x+18,0);g2.addColorStop(0,"rgba(0,0,0,0)");g2.addColorStop(0.5,"rgba(20,40,28,0.22)");g2.addColorStop(1,"rgba(0,0,0,0)");
    q.fillStyle=g2;q.fillRect(x-18,T_.fr,36,T_.ft-T_.fr);}const g3=q.createLinearGradient(0,T_.fr,0,T_.ft);g3.addColorStop(0,"rgba(0,0,0,0)");g3.addColorStop(1,"rgba(10,20,14,0.3)");q.fillStyle=g3;q.fillRect(T_.fx0-10,T_.fr,T_.fx1-T_.fx0+20,T_.ft-T_.fr);q.restore();
  q.save();q.strokeStyle=rgba(EE.brass,0.85);q.lineWidth=3;q.beginPath();q.moveTo(T_.fx0,T_.fr+3);q.lineTo(T_.fx1,T_.fr+3);q.stroke();q.restore();
  wc_contact(q,T_.fx0-40,T_.fx1+40,T_.ft+4,1,0.4);
  // what stays on the table: an inkstand and its pens, papers, a bell, two books, between the places
  for(const x of [630,1290]){wc_part(q,wc_rect(x-40,T_.bk+14,80,22),EE.brassDk,1,{seed:x});wc_part(q,wc_ell(x-16,T_.bk+12,10,8,16),[40,36,40],1,{seed:x+1});wc_part(q,wc_ell(x+16,T_.bk+12,10,8,16),[40,36,40],1,{seed:x+2});
    q.save();q.strokeStyle=rgba([60,50,40],0.9);q.lineWidth=2.4;q.beginPath();q.moveTo(x-14,T_.bk+6);q.lineTo(x-2,T_.bk-26);q.stroke();q.restore();}
  for(const [x,y,r] of [[860,T_.bk+34,0.06],[1060,T_.bk+28,-0.04],[1500,T_.bk+36,0.08]]){q.save();q.translate(x,y);q.rotate(r);q.fillStyle="rgba(30,30,20,0.25)";q.fillRect(-48,-14,100,34);
    wc_flat(q,wc_rect(-52,-18,100,34),[240,234,216],1,"page");q.restore();}
  wc_part(q,wc_rect(1100,T_.bk+8,70,18),[96,40,40],1,{seed:327});wc_part(q,wc_rect(1104,T_.bk-6,62,16),[70,74,60],1,{seed:328});
  wc_part(q,wc_ell(820,T_.bk+18,14,8,16),EE.brass,1,{seed:329});wc_part(q,[[814,T_.bk+12],[826,T_.bk+12],[823,T_.bk-6],[817,T_.bk-6]],EE.brassDk,1,{seed:330});});}
// the director's dictionary at the head of the table: a thick book open on a stand, its pages lines too small to read
function ee_dictStand(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);wc_part(ctx,[[-60,10],[60,10],[50,22],[-50,22]],EE.woodDk,1,{seed:331});
  wc_part(ctx,[[-74,0],[0,-8],[74,0],[70,12],[0,6],[-70,12]],[110,44,40],1,{seed:333});
  wc_flat(ctx,[[-68,-4],[-2,-12],[-2,4],[-64,8]],[244,236,214],1,"page");wc_flat(ctx,[[2,-12],[68,-4],[64,8],[2,4]],[246,240,220],1,"page");
  ctx.strokeStyle=rgba([90,80,70],0.5);ctx.lineWidth=1.2;for(let i=0;i<4;i++){for(const s2 of [-1,1]){ctx.beginPath();ctx.moveTo(s2*10,-8+i*3.6);ctx.lineTo(s2*58,-2+i*3.4);ctx.stroke();}}ctx.restore();}
// a hand, laid flat on something on the table, from a dark cuff: drawn over the table, where the arm reaching it goes under its top
function ee_handOn(ctx,x,y,s,skin,cuff,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);ctx.fillStyle=rgba(cuff,1);ctx.beginPath();ctx.moveTo(-30,-30);ctx.lineTo(-6,-36);ctx.lineTo(4,-12);ctx.lineTo(-20,-4);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([246,244,238],1);ctx.beginPath();ctx.moveTo(-8,-34);ctx.lineTo(0,-36);ctx.lineTo(8,-14);ctx.lineTo(2,-12);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.moveTo(4,-26);ctx.bezierCurveTo(24,-30,40,-22,44,-12);ctx.bezierCurveTo(46,-6,40,-2,30,-4);ctx.lineTo(10,-4);ctx.quadraticCurveTo(2,-8,4,-26);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(darken(skin,0.35),0.6);ctx.lineWidth=1.4;ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(22+i*6,-26+i*2);ctx.lineTo(36+i*3,-10+i);ctx.stroke();}ctx.restore();}
// the people at the table: each at their seat, sitting behind it (o.pose(id), o.stand(id) 0 to 1, how far they've stood up, o.x(id));
// o.T: another table (EE_MX), with its own seats and scale
function ee_seated(x,tt,cast,o){o=o||{};const A=o.T||EE_AC;cast.forEach(([id,seat],i)=>{const X=(o.x&&o.x(id))!=null?o.x(id):A.seats[seat],st=o.stand?clamp(o.stand(id),0,1):0,s=o.s||A.s;
  x.save();x.beginPath();x.rect(-W,-H,3*W,A.tb.bk+H);x.clip();person(x,id,X,A.tb.bk+lerp(GV_SIT,GV_STAND,easeCam(st))*s,s,Object.assign({pose:"listen",t:tt,flip:X>960},o.pose?o.pose(id)||{}:{}));x.restore();});}

/* ---------- Lima: a schoolroom ---------- */
// Whitewashed walls over a painted dado, a blackboard with chalk lines on it, a window of daylight at the right; the pupil's desk close,
// its top seen a little from above, drawn over the pupil sitting behind it (ee_schoolDesk). EE_SC: the floor's line, the blackboard, the
// window, the desk (its back and front edges, its ends, the panel's foot), where the pupil sits, and the scale
const EE_SC={fy:790,board:[300,150,820,300],win:[1460,120,300,470],dk:{bk:690,fr:796,x0:400,x1:1124,fx0:356,fx1:1168,ft:990},pupil:[700,1.16],note:[574,716,300,70],dict:[912,706]};
function ee_paintSchool(ctx){const S_=EE_SC;gv_wallFloor(ctx,EE.lime,S_.fy,{seed:341,vx:900,floor:[160,124,92]});
  wc_wash(ctx,wc_rect(-40,S_.fy-250,W+80,250),[150,172,162],{kind:"plaster",line:false,seed:343,a:0.8});wc_part(ctx,wc_rect(-20,S_.fy-258,W+40,14),EE.oakDk,1,{seed:345});
  const [bx,by,bw,bh]=S_.board;wc_part(ctx,wc_rect(bx-18,by-18,bw+36,bh+36),EE.oakDk,1,{seed:347});wc_wash(ctx,wc_rect(bx,by,bw,bh),EE.slate,{kind:"build",seed:349,lw:1});
  ctx.save();ctx.strokeStyle="rgba(240,240,232,0.45)";ctx.lineCap="round";const R=wc_rng(351);for(let r=0;r<5;r++){let x=bx+50;const y=by+60+r*50;while(x<bx+bw-80){const w=40+R()*110;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y+R()*4);ctx.lineTo(x+w,y+R()*4);ctx.stroke();x+=w+22+R()*20;}}ctx.restore();
  wc_part(ctx,wc_rect(bx,by+bh+18,bw,12),EE.oak,1,{seed:353});
  const [wx,wy,ww,wh]=S_.win;gv_window(ctx,wx,wy,ww,wh,{seed:355,tower:false,wall:EE.lime});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh*0.6,640,[255,248,226],0.35);ctx.restore();
  // a cupboard of books at the left, a clock on the wall
  gv_bookcase(ctx,40,S_.fy,200,430,[S_.fy-320,S_.fy-210,S_.fy-100],{col:EE.oak});for(const sy of [S_.fy-322,S_.fy-212,S_.fy-102])ee_books(ctx,60,sy,160,sy,{h:86});
  wc_part(ctx,wc_ell(1290,300,58,58,32),EE.oakDk,1,{seed:357});wc_wash(ctx,wc_ell(1290,300,46,46,32),[248,244,232],{kind:"clock",lw:1,seed:358});
  ctx.save();ctx.strokeStyle=rgba([40,36,34],0.85);ctx.lineCap="round";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(1290,300);ctx.lineTo(1290,272);ctx.stroke();ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(1290,300);ctx.lineTo(1314,312);ctx.stroke();
  for(let i=0;i<12;i++){const a=i*TAU/12;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1290+Math.cos(a)*38,300+Math.sin(a)*38);ctx.lineTo(1290+Math.cos(a)*43,300+Math.sin(a)*43);ctx.stroke();}ctx.restore();}
// the pupil's desk, drawn over the pupil: its top in oak, an inkwell let into it, its front panel
function ee_schoolDesk(){return wc_kept("eeSchoolDesk",W,H,q=>{const D=EE_SC.dk,top=[[D.x0,D.bk],[D.x1,D.bk],[D.fx1,D.fr],[D.fx0,D.fr]];
  wc_contact(q,D.fx0-30,D.fx1+30,D.ft+4,1,0.35);wc_part(q,[[D.fx0+20,D.fr],[D.fx1-20,D.fr],[D.fx1-24,D.ft],[D.fx0+24,D.ft]],wc_dim(EE.oak,0.16),1,{seed:361});
  for(const lx of [D.fx0+30,D.fx1-60])wc_part(q,wc_rect(lx,D.fr,30,D.ft-D.fr),wc_dim(EE.oak,0.3),1,{seed:lx});
  wc_part(q,top,EE.oak,1,{seed:363,lw:1.3});q.save();wc_tr(q,top);q.clip();q.strokeStyle=rgba(EE.oakDk,0.3);q.lineWidth=2;for(let i=0;i<9;i++){const y=lerp(D.bk,D.fr,i/9);q.beginPath();q.moveTo(0,y+4);q.lineTo(W,y);q.stroke();}q.restore();
  wc_part(q,wc_rect(D.fx0-6,D.fr-2,D.fx1-D.fx0+12,16),wc_lit(EE.oak,0.1),1,{seed:365});
  wc_part(q,wc_ell(1060,D.bk+16,16,8,16),[40,40,48],1,{seed:367});});}
// the notebook, open on the desk: two pages of lines too small to read; o.strike (0 to 1), a word struck through in red ink
function ee_notebook(ctx,o){o=o||{};const [x,y,w,h]=EE_SC.note;ctx.save();ctx.fillStyle="rgba(60,40,24,0.2)";ctx.fillRect(x+4,y+6,w,h);
  wc_flat(ctx,[[x,y],[x+w/2,y+2],[x+w/2,y+h+2],[x,y+h]],[248,246,236],1,"page");wc_flat(ctx,[[x+w/2,y+2],[x+w,y],[x+w,y+h],[x+w/2,y+h+2]],[246,244,232],1,"page");
  ctx.strokeStyle="rgba(120,140,170,0.35)";ctx.lineWidth=1;for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(x+6,y+i*h/6);ctx.lineTo(x+w-6,y+i*h/6);ctx.stroke();}
  ctx.strokeStyle=rgba([50,46,60],0.65);ctx.lineWidth=1.6;ctx.lineCap="round";const R=wc_rng(371);for(let i=1;i<6;i++)for(const s of [0,1]){let xx=x+12+s*w/2;while(xx<x+(s+1)*w/2-24){const l=10+R()*26;ctx.beginPath();ctx.moveTo(xx,y+i*h/6-3);ctx.lineTo(xx+l,y+i*h/6-3);ctx.stroke();xx+=l+6;}}
  const st=clamp(o.strike||0,0,1);if(st>0.01){const sx=x+w/2+22,sy=y+3*h/6-3;ctx.strokeStyle=rgba([196,36,40],0.95);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx-4,sy+1);ctx.lineTo(sx-4+64*st,sy-1);ctx.stroke();
    if(st>0.7){ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(sx+70,sy-12);ctx.lineTo(sx+70+16*clamp((st-0.7)/0.3,0,1),sy-24);ctx.stroke();}}ctx.restore();}
// the thick dictionary, open on the desk (or on a table), its pages lines too small to read; (x, y) the spine's foot, s its scale
function ee_bigDict(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.save();ctx.translate(6,12);ctx.scale(1,0.13);const g=ctx.createRadialGradient(0,0,20,0,0,124);
  g.addColorStop(0,"rgba(50,34,22,0.32)");g.addColorStop(0.7,"rgba(50,34,22,0.16)");g.addColorStop(1,"rgba(50,34,22,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,124,0,TAU);ctx.fill();ctx.restore();
  wc_part(ctx,[[-104,-6],[0,-14],[104,-6],[100,14],[0,8],[-100,14]],[104,42,38],1,{seed:373});
  for(let k=0;k<5;k++){const d=k*2.2;wc_flat(ctx,[[-98+d*0.2,-14+d],[-2,-24+d],[-2,6],[-94,8]],k<4?[232,222,198]:[246,240,222],1,"page");wc_flat(ctx,[[2,-24+d],[98-d*0.2,-14+d],[94,8],[2,6]],k<4?[232,222,198]:[248,242,226],1,"page");}
  ctx.strokeStyle=rgba([90,80,70],0.55);ctx.lineWidth=1.3;for(let i=0;i<6;i++)for(const s2 of [-1,1]){ctx.beginPath();ctx.moveTo(s2*12,-12+i*3.4);ctx.lineTo(s2*86,-4+i*3);ctx.stroke();}ctx.restore();}
// a hand holding a pen, from the right, its nib at (x, y), its sleeve running out of the frame: the teacher's, over the notebook
function ee_penHand(ctx,x,y,s,skin,cuff){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const g=ctx.createLinearGradient(170,-110,210,-40);g.addColorStop(0,rgba(wc_lit(cuff,0.18),1));g.addColorStop(1,rgba(wc_dim(cuff,0.25),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(120,-70);ctx.lineTo(196,-104);ctx.quadraticCurveTo(420,-250,700,-372);ctx.lineTo(728,-306);ctx.quadraticCurveTo(450,-190,226,-62);ctx.lineTo(150,-20);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(darken(cuff,0.4),0.6);ctx.lineWidth=2.4;ctx.stroke();ctx.strokeStyle=rgba(wc_lit(cuff,0.3),0.4);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(240,-112);ctx.quadraticCurveTo(420,-224,660,-336);ctx.stroke();
  ctx.fillStyle=rgba([246,244,238],1);ctx.beginPath();ctx.moveTo(110,-62);ctx.lineTo(126,-72);ctx.lineTo(152,-22);ctx.lineTo(136,-14);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.moveTo(116,-60);ctx.bezierCurveTo(90,-62,60,-50,48,-34);ctx.bezierCurveTo(40,-24,50,-14,66,-18);ctx.lineTo(108,-24);ctx.quadraticCurveTo(132,-26,136,-40);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(darken(skin,0.35),0.6);ctx.lineWidth=1.6;ctx.stroke();ctx.strokeStyle=rgba([36,30,30],1);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(4,-4);ctx.lineTo(96,-64);ctx.stroke();
  ctx.fillStyle=rgba([176,40,40],1);ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(10,-12);ctx.lineTo(14,-4);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------- small pictures: who uses the words, and who proposes them today ---------- */
// Each painted on a sheet 600 x 400, its person drawn into it every frame (ee_vign): a shopkeeper doing his accounts by his door; a clerk at
// a high desk; a market seller and her customer; today, a member at her desk by a window over a city, and another in another city
const EE_VW=600,EE_VH=400;
const EE_VIGN={shop:{id:"eeShop",x:360,cut:262,s:0.42,pose:"write",carry:heldNotebook},clerk:{id:"eeClerk",x:280,cut:236,s:0.44,pose:"write",carry:heldNotebook,stand:true},
  market:{id:"eeSeller",x:390,cut:270,s:0.42,pose:"ee_talk",flip:true,other:{id:"eeBuyer",x:150,y:392,s:0.44,pose:"ee_talk"}},
  deskA:{id:"eeTodayA",x:250,cut:270,s:0.44,pose:"write",carry:ee_heldCard},deskB:{id:"eeTodayB",x:360,cut:270,s:0.44,pose:"write",carry:ee_heldCard,flip:true}};
function ee_vignBack(k){return wc_kept("eeVign:"+k,EE_VW,EE_VH,q=>{const w=EE_VW,h=EE_VH,R=wc_rng(381+k.length*7);q.fillStyle=rgba(WC_PAPER,1);q.fillRect(0,0,w,h);
  if(k==="shop"){wc_wash(q,wc_rect(-10,-10,w+20,h+20),[214,190,156],{kind:"plaster",line:false,seed:383});
    // the door, open onto a bright street; shelves of jars and boxes; the counter
    wc_part(q,wc_rect(30,40,150,250),EE.woodDk,1,{seed:385});const g=q.createLinearGradient(0,50,0,290);g.addColorStop(0,"rgb(250,244,226)");g.addColorStop(1,"rgb(232,220,196)");q.fillStyle=g;q.fillRect(44,52,122,238);
    wc_wash(q,wc_rect(44,200,122,90),[200,190,170],{kind:"build",line:false,seed:387,a:0.7});
    for(let r=0;r<3;r++){const y=80+r*62;wc_part(q,wc_rect(230,y,340,8),EE.wood,1,{seed:389+r});for(let i=0;i<8;i++){const x=240+i*40+R()*6,c=[[150,110,70],[200,180,130],[120,140,110],[170,90,70]][Math.floor(R()*4)];
      if(R()<0.5)wc_part(q,wc_rect(x,y-34,28,34),c,1,{seed:x+y});else wc_part(q,[[x,y],[x+28,y],[x+26,y-30],[x+20,y-36],[x+8,y-36],[x+2,y-30]],wc_lit(c,0.2),1,{seed:x+y});}}
    wc_part(q,wc_rect(-10,262,w+20,26),EE.woodLt,1,{seed:393});wc_part(q,wc_rect(-10,286,w+20,130),EE.wood,1,{seed:395});
    q.save();q.globalCompositeOperation="screen";wc_glowAt(q,105,170,240,[255,246,220],0.4);q.restore();}
  else if(k==="clerk"){wc_wash(q,wc_rect(-10,-10,w+20,h+20),[206,198,176],{kind:"plaster",line:false,seed:401});
    wc_part(q,wc_rect(420,30,140,250),EE.woodDk,1,{seed:403});const g=q.createLinearGradient(0,40,0,270);g.addColorStop(0,"rgb(214,228,236)");g.addColorStop(1,"rgb(240,240,232)");q.fillStyle=g;q.fillRect(432,42,116,226);
    wc_part(q,wc_rect(486,42,8,226),EE.woodDk,1,{seed:405});wc_part(q,wc_rect(432,150,116,8),EE.woodDk,1,{seed:406});
    // ledgers on a shelf; the high desk, its top slanted, on tall legs; the floor
    wc_part(q,wc_rect(40,70,300,8),EE.wood,1,{seed:407});ee_books(q,50,70,280,409,{h:50});
    wc_wash(q,wc_rect(-10,330,w+20,80),[150,120,90],{kind:"ground",line:false,seed:411});
    wc_part(q,[[150,236],[420,226],[424,250],[150,258]],EE.woodLt,1,{seed:413});for(const lx of [168,400])wc_part(q,wc_rect(lx,252,14,110),EE.woodDk,1,{seed:lx});
    q.save();q.globalCompositeOperation="screen";wc_glowAt(q,490,150,260,[255,250,236],0.4);q.restore();}
  else if(k==="market"){const sky=q.createLinearGradient(0,0,0,200);sky.addColorStop(0,"rgb(196,214,230)");sky.addColorStop(1,"rgb(236,232,220)");q.fillStyle=sky;q.fillRect(0,0,w,h);
    wc_wash(q,[[0,90],[200,70],[420,80],[600,60],[600,250],[0,250]],[214,196,164],{kind:"build",seed:415});for(let i=0;i<4;i++)wc_part(q,wc_rect(40+i*150,120,50,80),[150,128,104],1,{seed:417+i});
    wc_wash(q,wc_rect(-10,240,w+20,170),[196,176,146],{kind:"ground",line:false,seed:419});
    // the awning, plain canvas on poles; the stall's table and its baskets of fruit and vegetables
    wc_part(q,[[250,110],[590,110],[600,150],[240,150]],[226,214,186],1,{seed:421});for(const px of [258,580])wc_part(q,wc_rect(px,148,8,140),EE.woodDk,1,{seed:px});
    wc_part(q,wc_rect(240,270,360,20),EE.woodLt,1,{seed:423});wc_part(q,wc_rect(250,290,340,110),EE.wood,1,{seed:425});
    for(const [bx,c] of [[300,[214,120,60]],[380,[196,170,90]],[460,[150,60,70]],[540,[226,196,110]]]){wc_part(q,[[bx-34,270],[bx+34,270],[bx+28,246],[bx-28,246]],[176,140,92],1,{seed:bx});
      for(let i=0;i<6;i++)wc_part(q,wc_ell(bx-20+i*8+R()*4,244-(i%2)*8,9,8,12),c,1,{seed:bx+i});}}
  else{// today: a desk by a window; deskA over a city of towers in sun, deskB over a city under mountains
    const A_=k==="deskA";wc_wash(q,wc_rect(-10,-10,w+20,h+20),A_?[232,226,214]:[214,222,226],{kind:"plaster",line:false,seed:A_?431:433});
    const wx=A_?300:40,ww=260;const g=q.createLinearGradient(0,30,0,230);g.addColorStop(0,A_?"rgb(170,206,236)":"rgb(196,214,230)");g.addColorStop(1,"rgb(236,240,236)");q.fillStyle=g;q.fillRect(wx,30,ww,200);
    if(A_){for(let i=0;i<7;i++){const bx=wx+10+i*36,bh=60+R()*100;wc_part(q,wc_rect(bx,230-bh,28,bh),[150+R()*40,160+R()*30,170],1,{seed:437+i});}}
    else{wc_wash(q,[[wx,180],[wx+60,90],[wx+120,140],[wx+180,70],[wx+ww,150],[wx+ww,230],[wx,230]],[150,170,170],{kind:"build",seed:439,a:0.8});for(let i=0;i<8;i++)wc_part(q,wc_rect(wx+8+i*31,196-R()*20,24,40),[200,190,176],1,{seed:441+i});}
    wc_part(q,wc_rect(wx-10,22,ww+20,12),[240,240,236],1,{seed:443});wc_part(q,wc_rect(wx-10,228,ww+20,12),[240,240,236],1,{seed:444});
    wc_part(q,wc_rect(-10,270,w+20,20),A_?[196,170,130]:[170,150,120],1,{seed:445});wc_part(q,wc_rect(-10,290,w+20,120),A_?[160,132,96]:[136,116,92],1,{seed:446});
    gv_plant(q,A_?560:540,270,0.4);wc_part(q,wc_rect(A_?80:180,248,90,22),[70,74,84],1,{seed:447});}});}
// a small picture at (cx, cy), s its scale, u how far in (0 to 1), a its opacity; its person drawn every frame; o.say (0 to 1), a speech
// bubble shaped like a slip, with a word on it too small to read; o.rot, tipped a little, like a photograph laid down
function ee_vign(ctx,k,cx,cy,s,t,u,a,o){o=o||{};if(a<=0.01)return;const V=EE_VIGN[k],w=EE_VW*s,h=EE_VH*s,x0=cx-w/2,y0=cy-h/2,kk=0.94+0.06*spring(clamp(u,0,1));
  ctx.save();ctx.translate(cx,cy);ctx.scale(kk,kk);ctx.rotate(o.rot||0);ctx.translate(-cx,-cy);withA(ctx,a,()=>{ctx.fillStyle="rgba(60,44,30,0.25)";ctx.fillRect(x0+8,y0+10,w,h);ctx.drawImage(ee_vignBack(k),x0,y0,w,h);
    ctx.save();ctx.beginPath();ctx.rect(x0,y0,w,h);ctx.clip();ctx.translate(x0,y0);ctx.scale(s,s);
    if(V.other)person(ctx,V.other.id,V.other.x,V.other.y,V.other.s,{t,pose:V.other.pose});
    ctx.save();ctx.beginPath();ctx.rect(-10,-10,EE_VW+20,V.cut+10);ctx.clip();person(ctx,V.id,V.x,V.cut+(V.stand?GV_STAND:GV_SIT)*V.s,V.s,{t,pose:V.pose,carry:V.carry,flip:V.flip});ctx.restore();
    if(k==="clerk"){wc_part(ctx,[[150,236],[420,226],[424,250],[150,258]],EE.woodLt,1,{seed:413});ctx.fillStyle=rgba([244,240,226],1);ctx.save();ctx.translate(290,238);ctx.rotate(-0.04);ctx.fillRect(-60,-12,120,18);ctx.restore();}
    if(k==="shop"){ctx.save();ctx.translate(330,268);ctx.fillStyle=rgba([236,228,206],1);ctx.fillRect(-70,-10,140,16);ctx.strokeStyle=rgba([120,60,50],0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(0,6);ctx.stroke();ctx.restore();}
    if(k==="deskA"||k==="deskB"){const cxx=k==="deskA"?250:360;ctx.fillStyle="rgba(40,30,20,0.2)";ctx.fillRect(cxx-36,266,80,30);ctx.fillStyle=rgba([255,253,246],1);ctx.fillRect(cxx-40,262,80,30);
      ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=1.5;ctx.strokeRect(cxx-40,262,80,30);const p=clamp(o.write||0,0,1);ctx.strokeStyle=rgba([40,50,90],0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cxx-28,276);ctx.lineTo(cxx-28+50*p,276);ctx.stroke();}
    ctx.restore();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.strokeRect(x0,y0,w,h);});
  ctx.restore();
  const sy=clamp(o.say||0,0,1);if(sy>0.01){const bx=x0+(V.x+(o.sayDx||40))*s,by=y0+(V.cut-150)*s,k2=0.85+0.15*spring(sy);ctx.save();ctx.translate(bx,by);ctx.scale(k2*s/0.8,k2*s/0.8);withA(ctx,clamp(sy*2,0,1)*a,()=>{
    ctx.fillStyle="rgba(50,36,24,0.22)";ctx.fillRect(-58,-26,124,56);ctx.fillStyle=rgba(EE_SLIP,1);ctx.beginPath();ctx.moveTo(-62,-30);ctx.lineTo(62,-30);ctx.lineTo(62,24);ctx.lineTo(-6,24);ctx.lineTo(-22,46);ctx.lineTo(-20,24);ctx.lineTo(-62,24);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle=rgba([60,50,46],0.7);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-34,-4);ctx.lineTo(30,-4);ctx.stroke();});ctx.restore();}}

/* ---------- the academy's door, far down a corridor ---------- */
// A long corridor, its floor of stone flags, its walls panelled, running away to a tall double door at its end; the room beyond lit. The
// door closes (ee_door(ctx, u), 0 open to 1 shut), and the light it let into the corridor goes with it. EE_DR: the vanishing point, the
// doorway
const EE_DR={vx:960,vy:430,door:[884,250,152,330]};
function ee_paintHall(ctx){const D=EE_DR,[dx,dy,dw,dh]=D.door;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const far=[[dx-120,dy-90],[dx+dw+120,dy-90],[dx+dw+120,dy+dh+40],[dx-120,dy+dh+40]];
  wc_wash(ctx,[[-40,-40],[W+40,-40],[far[1][0],far[1][1]],[far[0][0],far[0][1]]],[120,96,80],{kind:"build",line:false,seed:451});
  wc_wash(ctx,[[-40,-40],[far[0][0],far[0][1]],[far[3][0],far[3][1]],[-40,H+40]],[150,118,94],{kind:"plaster",line:false,seed:453});
  wc_wash(ctx,[[W+40,-40],[far[1][0],far[1][1]],[far[2][0],far[2][1]],[W+40,H+40]],[142,112,90],{kind:"plaster",line:false,seed:455});
  wc_wash(ctx,[[-40,H+40],[far[3][0],far[3][1]],[far[2][0],far[2][1]],[W+40,H+40]],[176,166,150],{kind:"ground",line:false,seed:457});
  wc_wash(ctx,far,[132,104,86],{kind:"build",line:false,seed:459});
  // the floor's flags and the walls' pilasters, running to the far end
  ctx.save();ctx.strokeStyle=rgba([110,100,90],0.4);ctx.lineWidth=2;for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(D.vx+i*(dw/12+12),far[3][1]);ctx.lineTo(D.vx+i*360,H+40);ctx.stroke();}
  for(const f of [0.08,0.2,0.38,0.62]){const y=lerp(far[3][1],H+40,f*f*1.6);ctx.beginPath();ctx.moveTo(lerp(far[3][0],-40,(y-far[3][1])/(H+40-far[3][1])),y);ctx.lineTo(lerp(far[2][0],W+40,(y-far[2][1])/(H+40-far[2][1])),y);ctx.stroke();}ctx.restore();
  for(const f of [0.12,0.3,0.55,0.85])for(const s of [-1,1]){const xA=s<0?lerp(far[0][0],-40,f):lerp(far[1][0],W+40,f),yt=lerp(far[0][1],-40,f),yb=lerp(far[3][1],H+40,f),pw=24+70*f;
    wc_part(ctx,[[xA,yt],[xA+s*pw,yt-s*0],[xA+s*pw,yb],[xA,yb]],[112,86,68],1,{seed:461+Math.round(f*100)+s});}
  // the doorway's frame
  wc_part(ctx,wc_rect(dx-20,dy-24,dw+40,dh+24),EE.woodDk,1,{seed:463});wc_part(ctx,wc_rect(dx-30,dy-40,dw+60,22),EE.wood,1,{seed:465});
  ctx.save();ctx.globalCompositeOperation="multiply";const v=ctx.createRadialGradient(D.vx,D.vy+60,120,D.vx,D.vy,1100);v.addColorStop(0,"rgba(255,255,255,0)");v.addColorStop(1,"rgba(70,50,40,0.6)");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);ctx.restore();}
function ee_door(ctx,u){const [dx,dy,dw,dh]=EE_DR.door,e=easeCam(clamp(u,0,1)),gap=dw*(1-e);
  // the lit room beyond, and its light on the corridor's floor, narrowing as the door shuts
  if(gap>0.5){ctx.fillStyle=rgba([255,226,170],1);ctx.fillRect(dx+dw/2-gap/2,dy,gap,dh);ctx.save();ctx.globalCompositeOperation="screen";const g=ctx.createLinearGradient(0,dy+dh,0,H);
    g.addColorStop(0,"rgba(255,214,150,0.5)");g.addColorStop(1,"rgba(255,214,150,0)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(dx+dw/2-gap/2,dy+dh);ctx.lineTo(dx+dw/2+gap/2,dy+dh);
    ctx.lineTo(dx+dw/2+gap*3.2,H);ctx.lineTo(dx+dw/2-gap*3.2,H);ctx.closePath();ctx.fill();wc_glowAt(ctx,dx+dw/2,dy+dh*0.6,120+260*(1-e),[255,214,150],0.4*(1-e));ctx.restore();}
  // the two leaves, swinging shut: each foreshortened while it's open
  for(const s of [-1,1]){const hx=s<0?dx:dx+dw,ow=dw/2*(0.25+0.75*e),x1=hx-s*ow,sk=(1-e)*26;
    wc_part(ctx,[[hx,dy],[x1,dy-s*0+sk*0.4],[x1,dy+dh-sk*0.4],[hx,dy+dh]],[92,58,40],1,{seed:471+s,lw:1.2});
    ctx.save();ctx.strokeStyle=rgba([60,38,26],0.6);ctx.lineWidth=2;const m=(hx+x1)/2;ctx.strokeRect(Math.min(hx,x1)+ow*0.18,dy+30,ow*0.64,dh*0.36);ctx.strokeRect(Math.min(hx,x1)+ow*0.18,dy+dh*0.5,ow*0.64,dh*0.4);ctx.restore();}}

/* ---------- Lima, 1909: Palma's desk in the National Library ---------- */
// A reading room: tall shelves of books, a high arched window of daylight at the left, a gallery's rail above; Palma's desk close, piled
// with books and papers, drawn over him (ee_libDesk). EE_LB: the floor's line, the window, the desk (back and front edges, ends), where he
// sits, his scale, where his letter lies
const EE_LB={fy:820,win:[120,90,300,560],dk:{bk:770,fr:850,x0:470,x1:1450,fx0:400,fx1:1520,ft:1090},seat:[960,1.25]};
function ee_paintLib(ctx){const L=EE_LB;gv_wallFloor(ctx,[200,170,132],L.fy,{seed:481,vx:960,floor:[138,104,74]});
  const [wx,wy,ww,wh]=L.win;wc_part(ctx,[[wx-24,wy+wh+24],[wx-24,wy+ww/2],[wx+ww/2,wy-24],[wx+ww+24,wy+ww/2],[wx+ww+24,wy+wh+24]],EE.woodDk,1,{seed:483});
  const g=ctx.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgb(214,230,240)");g.addColorStop(1,"rgb(244,240,226)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(wx,wy+wh);ctx.lineTo(wx,wy+ww/2);ctx.arc(wx+ww/2,wy+ww/2,ww/2,Math.PI,0);ctx.lineTo(wx+ww,wy+wh);ctx.closePath();ctx.fill();
  for(const r of [wc_rect(wx+ww/2-5,wy,10,wh),wc_rect(wx,wy+wh*0.45,ww,9),wc_rect(wx,wy+wh*0.75,ww,9)])wc_part(ctx,r,EE.woodDk,1,{seed:485});
  // the shelves, floor to gallery, and the gallery's rail
  for(const [x,w] of [[500,420],[960,420],[1420,420]]){gv_bookcase(ctx,x,L.fy,w,L.fy-150,[290,410,530,650],{col:EE.wood});for(const sy of [288,408,528,648,L.fy-30])ee_books(ctx,x+24,sy,w-48,x+sy,{h:96});}
  wc_part(ctx,wc_rect(-20,118,W+40,18),EE.woodDk,1,{seed:487});for(let x=470;x<W;x+=46)wc_part(ctx,wc_rect(x,70,8,48),EE.woodDk,1,{seed:x});wc_part(ctx,wc_rect(450,60,W,12),EE.wood,1,{seed:489});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh*0.6,760,[255,248,228],0.4);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="multiply";const v=ctx.createLinearGradient(W,0,0,0);v.addColorStop(0,"rgba(120,96,80,0.4)");v.addColorStop(0.6,"rgba(255,255,255,0)");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);ctx.restore();}
function ee_libDesk(){return wc_kept("eeLibDesk",W,H,q=>{const D=EE_LB.dk,top=[[D.x0,D.bk],[D.x1,D.bk],[D.fx1,D.fr],[D.fx0,D.fr]],R=wc_rng(491);
  wc_contact(q,D.fx0-40,D.fx1+40,D.ft+4,1,0.35);wc_part(q,[[D.fx0+10,D.fr],[D.fx1-10,D.fr],[D.fx1-14,D.ft],[D.fx0+14,D.ft]],wc_dim(EE.wood,0.12),1,{seed:493});
  for(const px of [D.fx0+40,D.fx1-280])wc_part(q,wc_rect(px,D.fr+30,240,D.ft-D.fr-40),EE.wood,1,{seed:px});
  wc_part(q,top,EE.woodLt,1,{seed:495,lw:1.3});wc_part(q,[[D.x0+60,D.bk+10],[D.x1-60,D.bk+10],[D.fx1-90,D.fr-10],[D.fx0+90,D.fr-10]],[70,96,76],1,{seed:497});
  wc_part(q,wc_rect(D.fx0-6,D.fr-4,D.fx1-D.fx0+12,16),EE.wood,1,{seed:499});
  // stacks of books on both sides, an inkstand, a lamp with a green shade
  for(const [x0,n] of [[490,4],[1310,3]]){let y=D.bk+40;for(let i=0;i<n;i++){const w=120+R()*30,h=20+R()*8,c=EE_BOOKS[Math.floor(R()*EE_BOOKS.length)];wc_part(q,wc_rect(x0+(R()-0.5)*14,y-h,w,h),c,1,{seed:x0+i});
    q.fillStyle=rgba([238,226,196],0.9);q.fillRect(x0+w-8+(R()-0.5)*4,y-h+3,6,h-6);y-=h+1;}}
  wc_part(q,wc_rect(1150,D.bk+34,90,22),EE.brassDk,1,{seed:501});wc_part(q,wc_ell(1176,D.bk+32,11,8,16),[40,36,40],1,{seed:502});
  wc_part(q,wc_rect(712,D.bk-40,14,72),EE.brassDk,1,{seed:503});wc_part(q,[[664,D.bk-40],[774,D.bk-40],[750,D.bk-78],[688,D.bk-78]],[70,120,90],1,{seed:504});});}

/* ---------- Mexico City, 1951: the academies meet ---------- */
// A hall: panelled walls, tall windows behind sheer curtains, a long table under a white cloth, microphones and glasses along it. The
// delegates sit behind it (ee_seated, on this table's line), and stand to shake hands. EE_MX: the table (back and front edges, ends, the
// cloth's foot), where each delegate sits, the scale
const EE_MX={tb:{bk:656,fr:770,x0:150,x1:1770,fx0:90,fx1:1830,ft:930},seats:[300,560,820,1100,1360,1620],s:0.66};
function ee_paintMex(ctx){const M=EE_MX;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,M.tb.ft+40),[214,200,176],{kind:"plaster",line:false,seed:511});
  wc_wash(ctx,wc_rect(-40,M.tb.bk-200,W+80,240),[150,112,80],{kind:"build",line:false,seed:513});for(let x=0;x<W;x+=160)wc_part(ctx,wc_rect(x+20,M.tb.bk-180,120,170),[160,122,90],1,{seed:x});
  for(const x of [140,620,1100,1580]){const g=ctx.createLinearGradient(0,60,0,420);g.addColorStop(0,"rgb(220,232,240)");g.addColorStop(1,"rgb(244,242,232)");ctx.fillStyle=g;ctx.fillRect(x,60,200,360);
    wc_part(ctx,wc_rect(x-12,48,224,14),[150,112,80],1,{seed:x+1});ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle="rgba(230,226,214,0.55)";for(let i=0;i<8;i++)ctx.fillRect(x+i*25,60,14,360);ctx.restore();
    ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+100,240,320,[255,252,240],0.3);ctx.restore();}
  wc_wash(ctx,wc_rect(-40,M.tb.ft-30,W+80,H-M.tb.ft+70),[150,120,96],{kind:"ground",line:false,seed:515});
  M.seats.forEach(x=>wc_part(ctx,[[x-52,M.tb.bk+10],[x-50,M.tb.bk-150],[x+50,M.tb.bk-150],[x+52,M.tb.bk+10]],[110,70,56],1,{seed:x+3}));}
function ee_mexTable(){return wc_kept("eeMexTable",W,H,q=>{const T_=EE_MX.tb,top=[[T_.x0,T_.bk],[T_.x1,T_.bk],[T_.fx1,T_.fr],[T_.fx0,T_.fr]];
  wc_wash(q,top,EE.cloth,{kind:"cloth",seed:521,lw:1.3});const sk=[[T_.fx0,T_.fr],[T_.fx1,T_.fr],[T_.fx1+6,T_.ft],[T_.fx0-6,T_.ft]];wc_wash(q,sk,wc_dim(EE.cloth,0.06),{kind:"cloth",seed:523,lw:1.3});
  q.save();wc_tr(q,sk);q.clip();const R=wc_rng(525);for(let x=T_.fx0+30;x<T_.fx1;x+=50+R()*40){const g2=q.createLinearGradient(x-16,0,x+16,0);g2.addColorStop(0,"rgba(0,0,0,0)");g2.addColorStop(0.5,"rgba(90,90,100,0.14)");g2.addColorStop(1,"rgba(0,0,0,0)");q.fillStyle=g2;q.fillRect(x-16,T_.fr,32,T_.ft-T_.fr);}q.restore();
  wc_contact(q,T_.fx0-40,T_.fx1+40,T_.ft+4,1,0.4);
  // a microphone and a glass of water at each place
  EE_MX.seats.forEach((x,i)=>{const mx=x+(i%2?-70:70);wc_part(q,wc_ell(mx,T_.bk+40,22,8,16),[60,60,66],1,{seed:x});wc_part(q,wc_rect(mx-3,T_.bk-40,6,80),[90,90,96],1,{seed:x+1});
    wc_part(q,[[mx-12,T_.bk-70],[mx+12,T_.bk-70],[mx+14,T_.bk-40],[mx-14,T_.bk-40]],[120,124,132],1,{seed:x+2});
    const gx=x+(i%2?60:-60);wc_wash(q,[[gx-12,T_.bk+56],[gx+12,T_.bk+56],[gx+10,T_.bk+20],[gx-10,T_.bk+20]],[214,228,236],{kind:"thing",a:0.6,seed:x+4,lw:1});});});}
// a name card standing on a table, folded like a tent: its country's name, at (x, y) its foot's middle, u its spring in (0 to 1)
function ee_tent(ctx,x,y,s,u,o){o=o||{};if(u<=0.01)return;const w=Math.round(tw(ctx,s,30,800)+44),h=50,k=0.8+0.2*spring(clamp(u,0,1)),dy=o.drop?-(1-easeCam(clamp(u,0,1)))*60:0;
  ctx.save();ctx.translate(x,y+dy);ctx.scale(k,k);withA(ctx,clamp(u*2.5,0,1),()=>{ctx.fillStyle="rgba(40,30,20,0.22)";ctx.fillRect(-w/2+4,-h+6,w,h);
    wc_panel(ctx,-w/2,-h,w,h,{kind:"card",seed:Math.round(x),wash:o.wash,washA:o.washA||0.3});wc_T(ctx,s,0,-14,{w:800,size:30,align:"center",col:WC_DARK});});ctx.restore();}

/* ---------- today: a bus stop ---------- */
// A city street in the morning: buildings old and new across the road, a tree, the road, the pavement, and a bus stop's shelter of glass
// with a bench; someone in it reads a word's entry on a phone. EE_BS: the pavement's line, the shelter (left, top, width, height)
const EE_BS={kerb:820,road:[640,800],shelter:[640,330,640,500]};
function ee_paintBus(ctx){const B=EE_BS,R=wc_rng(531);wc_sky(ctx,560,531,{clouds:3,cx:100,cw:1700,cy:40,ch:200});
  // across the road: a row of buildings, a church's dome far off, a tree; the road; the near pavement
  wc_part(ctx,[[1500,560],[1500,300],[1560,250],[1620,300],[1620,560]],[214,206,190],0.45,{seed:533});
  let x=-40;while(x<W+40){const w=180+R()*160,h=200+R()*220,c=[[226,214,194],[206,190,168],[190,200,206],[222,200,186],[200,186,166]][Math.floor(R()*5)];
    wc_part(ctx,wc_rect(x,B.road[0]-h,w-6,h),c,0.6,{seed:Math.round(x)});for(let r=0;r<Math.floor(h/70);r++)for(let i=0;i<Math.floor(w/60);i++)wc_flat(ctx,wc_rect(x+18+i*60,B.road[0]-h+24+r*70,30,38),[150,170,190],0.6,"window");x+=w;}
  wc_wash(ctx,wc_rect(-40,B.road[0],W+80,B.road[1]-B.road[0]),[150,150,154],{kind:"ground",line:false,seed:535});
  ctx.save();ctx.strokeStyle="rgba(250,250,240,0.7)";ctx.lineWidth=6;for(let x2=0;x2<W;x2+=180){ctx.beginPath();ctx.moveTo(x2,(B.road[0]+B.road[1])/2);ctx.lineTo(x2+90,(B.road[0]+B.road[1])/2);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,B.road[1],W+80,24),[196,192,184],{kind:"build",line:false,seed:537});wc_wash(ctx,wc_rect(-40,B.road[1]+24,W+80,H-B.road[1]),[210,204,194],{kind:"ground",line:false,seed:539});
  wc_roundTree(ctx,300,B.road[1]+30,420,0.9);wc_part(ctx,wc_rect(286,B.road[1]-170,28,200),[110,90,70],1,{seed:541});
  // the shelter: its roof, two glass sides and back, a bench; a route board drawn as lines
  const [sx,sy,sw,sh]=B.shelter;wc_part(ctx,wc_rect(sx-30,sy-24,sw+60,30),[90,96,104],1,{seed:543});
  for(const px of [sx,sx+sw-14])wc_part(ctx,wc_rect(px,sy,14,sh),[110,116,124],1,{seed:px});
  ctx.save();ctx.globalAlpha=0.35;ctx.fillStyle="rgb(214,232,240)";ctx.fillRect(sx+14,sy+10,sw-28,sh-150);ctx.restore();
  wc_part(ctx,wc_rect(sx+sw-180,sy+40,140,200),[244,242,236],1,{seed:545});ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.5);ctx.lineWidth=3;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(sx+sw-160,sy+70+i*26);ctx.lineTo(sx+sw-160+60+((i*37)%50),sy+70+i*26);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(sx+60,sy+sh-130,300,18),[150,110,80],1,{seed:547});for(const lx of [sx+80,sx+330])wc_part(ctx,wc_rect(lx,sy+sh-112,10,112),[90,96,104],1,{seed:lx});}
