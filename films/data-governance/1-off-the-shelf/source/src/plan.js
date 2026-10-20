/* ===== Off the shelf: the places and the pictures =====
   The places are painted once and kept (shared/src/finish.js). The past: the market by the town wall in 1215, the market hall in 1497,
   a corn exchange in 1871 and a grocer's shop in the 1880s, places of trade and of the people who checked it. Today, only the
   university's own places (the series' rooms.js): the campus, Yusuf's office, the floor of offices, Planning, the registrar's office,
   the data team's room, and his desk from above. The pictures are the film's own things: the charter and the jugs, the king's
   standards, the bushels, the scale, the inspector's case and the Act; the shelf of binders, the score, the chart, the minutes, the two
   reports, the glossary's term, the government's manual, binder 12 and the highlighters, DAMA's book and its wheel, the loop of ten
   steps and the cards. Every name starts with os_ or OS_. */

/* ---------- 1215: the market by the town wall ---------- */
// the ground, the market cross (its steps' top is where the crier stands), the two stalls' tables
const OS_MK={fy:640,cross:840,shaft:770,step:662,crier:896,wine:[70,540,722],corn:[1190,1700,730]};
const OS_EARTH=[218,194,154],OS_STONE=[204,194,172],OS_TIMBER=[150,112,78],OS_REDSTRIPE=[196,70,58],OS_BLUESTRIPE=[78,110,170],OS_CLOTH=[244,234,212];
// a stall's awning: cloth in stripes between two poles, sloping towards us
function os_awning(ctx,x0,x1,y,col,seed){const n=Math.round((x1-x0)/56),pts=k=>{const a=x0+(x1-x0)*k/n,b=x0+(x1-x0)*(k+1)/n;return[[a,y],[b,y],[b+(b-(x0+x1)/2)*0.08,y+86],[a+(a-(x0+x1)/2)*0.08,y+86]];};
  for(let k=0;k<n;k++)wc_wash(ctx,pts(k),k%2?OS_CLOTH:col,{kind:"build",lw:1.2,seed:seed+k});
  for(let k=0;k<n;k++){const p=pts(k);wc_wash(ctx,[p[3],p[2],[p[2][0],p[2][1]+16],[(p[2][0]+p[3][0])/2,p[2][1]+30],[p[3][0],p[3][1]+16]],k%2?OS_CLOTH:col,{kind:"build",lw:1.2,seed:seed+40+k});}}
// a trestle table: a plank top at y, two trestles to the ground at fy
function os_trestle(ctx,x0,x1,y,fy){for(const x of [x0+50,x1-70])wc_part(ctx,[[x,y+10],[x+20,y+10],[x+44,fy],[x+24,fy],[x+10,y+60],[x-4,fy],[x-24,fy]],wc_dim(OS_TIMBER,0.1),1);
  wc_part(ctx,wc_rect(x0,y,x1-x0,22),OS_TIMBER,1);}
// a barrel, standing
function os_barrel(ctx,x,y,h){const w=h*0.72;wc_part(ctx,[[x-w*0.42,y],[x-w*0.5,y-h*0.5],[x-w*0.42,y-h],[x+w*0.42,y-h],[x+w*0.5,y-h*0.5],[x+w*0.42,y]],[172,128,88],1);
  for(const k of [0.18,0.82])wc_flat(ctx,wc_rect(x-w*0.47,y-h*k-5,w*0.94,10),[92,84,84],1,"hoop");}
// a sack of corn: a full body, the cloth gathered into a neck and tied with a cord, a tuft of cloth above the cord
function os_sack(ctx,x,y,h,seed){const w=h*0.8,R=wc_rng(seed),j=v=>v*(0.94+0.12*R()),nk=y-h*0.8;
  const body=wc_smooth([[x-w*0.46,y],[x-j(w*0.54),y-h*0.36],[x-j(w*0.42),y-h*0.66],[x-w*0.14,nk+4],[x+w*0.12,nk+4],[x+j(w*0.44),y-h*0.64],[x+j(w*0.54),y-h*0.34],[x+w*0.46,y],[x,y+4],[x-w*0.46,y]],6);
  wc_wash(ctx,body,[226,206,156],{kind:"build",lw:1.4,seed});
  wc_wash(ctx,wc_smooth([[x-w*0.12,nk+6],[x-w*0.2,nk-h*0.14],[x-w*0.04,nk-h*0.2],[x+w*0.1,nk-h*0.17],[x+w*0.2,nk-h*0.1],[x+w*0.12,nk+6],[x-w*0.12,nk+6]],5),[220,198,146],{kind:"build",lw:1.2,seed:seed+3});
  wc_flat(ctx,wc_rect(x-w*0.17,nk-4,w*0.34,9),[150,110,70],1,"tie");
  ctx.save();ctx.strokeStyle=rgba([170,146,100],0.45);ctx.lineWidth=2;ctx.lineCap="round";for(const k of [-0.22,0.02,0.24]){ctx.beginPath();ctx.moveTo(x+k*w*0.6,nk+12);ctx.quadraticCurveTo(x+k*w*1.1,y-h*0.4,x+k*w*0.9,y-6);ctx.stroke();}ctx.restore();}
function os_paintMarket(ctx){const P=WCP;wc_sky(ctx,560,3,{sun:[1580,150],cx:120,cw:1500,cy:70,ch:180});
  wc_land(ctx,x=>486+18*Math.sin(x/260+1)+7*Math.sin(x/90),P.far,0.2);wc_treeRow(ctx,x=>500+8*Math.sin(x/200),-40,1980,70,58,0.2,13,P.leaf2);
  // the town wall, with merlons along its top, and the gatehouse behind the cross: two towers and an arched gate
  const top=452,base=OS_MK.fy,wall=[[-60,base],[-60,top]];for(let x=-60;x<W+60;x+=56)wall.push([x,top],[x+30,top],[x+30,top+18],[x+56,top+18]);wall.push([W+60,top+18],[W+60,base]);
  wc_part(ctx,wall,OS_STONE,0.55);ctx.save();ctx.strokeStyle=rgba(wc_dim(OS_STONE,0.25),0.28);ctx.lineWidth=1.6;for(let y=top+40;y<base;y+=26){const o=(y/26)%2?0:28;for(let x=-60+o;x<W+60;x+=56){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+50,y);ctx.stroke();}}ctx.restore();
  const cx=OS_MK.cross;for(const tx of [cx-210,cx+90]){const tw_=120,tt=330;const tp=[[tx,base],[tx,tt]];for(let x=tx;x<tx+tw_;x+=30)tp.push([x,tt],[x+16,tt],[x+16,tt+16],[x+30,tt+16]);tp.push([tx+tw_,tt+16],[tx+tw_,base]);
    wc_part(ctx,tp,wc_lit(OS_STONE,0.05),0.6);for(const sy of [400,480])wc_flat(ctx,wc_rect(tx+tw_/2-6,sy,12,34),[70,62,60],0.6,"slit");}
  wc_part(ctx,wc_rect(cx-90,372,180,base-372),OS_STONE,0.6);wc_wash(ctx,wc_arched(cx-62,430,124,base-430),[96,86,80],{depth:0.6,kind:"door",lw:1.4});
  // the market place: beaten earth, worn paler where people walk
  wc_land(ctx,x=>base+4*Math.sin(x/140),OS_EARTH,0.8);wc_wash(ctx,wc_band(wc_smooth([[cx,base+10],[cx-20,800],[cx+40,1100]],8),120,520),wc_lit(OS_EARTH,0.12),{depth:0.8,kind:"path",line:false});
  // the market cross: three steps, a shaft and its head
  for(const [w,y] of [[300,OS_MK.step+44],[250,OS_MK.step+22],[200,OS_MK.step]])wc_part(ctx,wc_rect(cx-w/2,y,w,22),wc_lit(OS_STONE,0.06),1);
  const sx=OS_MK.shaft;wc_part(ctx,wc_rect(sx-24,OS_MK.step-26,48,26),OS_STONE,1);wc_part(ctx,wc_rect(sx-11,300,22,OS_MK.step-326),OS_STONE,1);
  wc_part(ctx,[[sx-34,322],[sx+34,322],[sx+34,340],[sx+11,340],[sx+11,346],[sx-11,346],[sx-11,340],[sx-34,340]],OS_STONE,1);wc_part(ctx,wc_rect(sx-11,276,22,30),OS_STONE,1);
  // the wine stall: barrels, the table, the striped awning on its poles
  const [w0,w1,wy]=OS_MK.wine;os_barrel(ctx,w0+30,base+90,110);os_barrel(ctx,w1-20,base+100,120);for(const x of [w0+14,w1-14])wc_part(ctx,wc_rect(x-7,452,14,wy-452+150),OS_TIMBER,1);
  os_trestle(ctx,w0+40,w1-30,wy,wy+150);os_awning(ctx,w0-20,w1+20,440,OS_REDSTRIPE,11);
  // the corn stall: sacks, the table, its awning
  const [c0,c1,cy]=OS_MK.corn;for(const x of [c0+14,c1-14])wc_part(ctx,wc_rect(x-7,452,14,cy-452+150),OS_TIMBER,1);os_sack(ctx,c1-60,cy+150,120,5);os_sack(ctx,c1-150,cy+150,100,7);
  os_trestle(ctx,c0+40,c1-30,cy,cy+150);[[c0+110,96],[c0+230,110],[c0+360,90]].forEach(([x,h],i)=>os_sack(ctx,x,cy+4,h,20+i));os_awning(ctx,c0-20,c1+20,440,OS_BLUESTRIPE,31);
  const R=wc_rng(8);for(let i=0;i<40;i++){const x=R()*W,y=base+40+R()*(H-base-40);wc_wash(ctx,[[x,y],[x+16+R()*20,y-3],[x+20,y+2]],[220,196,120],{kind:"dab",flat:true});}}
// an earthenware jug, kept once, and drawn at any height and width
function os_jugAt(ctx,x,y,w,h){const c=wc_kept("jug",140,180,q=>{q.translate(20,10);wc_wash(q,[[30,0],[70,0],[74,10],[96,50],[100,110],[86,150],[50,160],[14,150],[0,110],[4,50],[26,10]],[188,124,86],{kind:"thing",lw:1.6,seed:3});
    q.strokeStyle=rgba([150,94,60],1);q.lineWidth=9;q.beginPath();q.arc(96,64,24,-1.3,1.25);q.stroke();wc_flat(q,wc_rect(28,0,44,10),[120,74,48],1,"lip");});ctx.drawImage(c,x-w*70/100,y-h*170/160,w*140/100,h*180/160);}
// the proclamation nailed to the stall's post: parchment, written lines and a red seal; flip (0 to 1) turns it over for the next year
function os_proclaim(ctx,x,y,flip,seal){const c=wc_kept("proclaim",170,200,q=>{q.translate(14,10);wc_wash(q,[[0,4],[140,0],[144,150],[4,156]],WCP.parchment,{kind:"paper",lw:1.4});
    q.strokeStyle=rgba(WCP.parchInk,0.55);q.lineWidth=2.2;for(let i=0;i<7;i++){q.beginPath();q.moveTo(16,24+i*16);q.lineTo(124-(i===6?50:0),22+i*16);q.stroke();}});
  const k=Math.abs(Math.cos(flip*Math.PI));ctx.save();ctx.translate(x,y);ctx.scale(Math.max(0.04,k),1);ctx.drawImage(c,-85,-10);ctx.restore();
  if(seal>0){const s=spring(seal);ctx.save();ctx.translate(x+40,y+122);ctx.scale(s,s);ctx.fillStyle=rgba([184,40,36],0.95);ctx.beginPath();ctx.arc(0,0,15,0,TAU);ctx.fill();ctx.strokeStyle=rgba([120,20,20],0.8);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
  wc_flat(ctx,wc_rect(x-4,y-4,8,8),[70,64,70],1,"nail");}

/* ---------- 1497: the market hall ---------- */
// the cupboard where the king's standards are kept, and the arch onto the square
const OS_HL={fy:870,cup:[230,240,520,570],arch:[1120,250,560,620]};
function os_paintHall(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);const F=OS_HL.fy,[ax,ay,aw]=OS_HL.arch;
  // through the arch: the square in daylight, the town wall across it, the market cross on its steps, a stall under its awning
  ctx.save();wc_tr(ctx,wc_arched(ax,ay,aw,F-ay));ctx.clip();wc_sky(ctx,640,5,{clouds:2,cx:ax,cw:aw-100,cy:ay+70,ch:110});
  const wt=520,wb=652,wl=[[ax-60,wb],[ax-60,wt+14]];for(let x=ax-60;x<ax+aw+60;x+=40)wl.push([x,wt+14],[x,wt],[x+22,wt],[x+22,wt+14]);wl.push([ax+aw+60,wt+14],[ax+aw+60,wb]);wc_part(ctx,wl,OS_STONE,0.42);
  wc_land(ctx,x=>wb+3*Math.sin(x/90),OS_EARTH,0.55);
  const qx=ax+aw*0.3;for(const [w,y] of [[150,704],[120,692],[94,680]])wc_part(ctx,wc_rect(qx-w/2,y,w,12),wc_lit(OS_STONE,0.06),0.55);
  wc_part(ctx,wc_rect(qx-7,486,14,194),OS_STONE,0.55);wc_part(ctx,wc_rect(qx-22,504,44,11),OS_STONE,0.55);
  const s0=ax+aw*0.58,s1=ax+aw+30;for(const x of [s0+8,s1-8])wc_part(ctx,wc_rect(x-5,566,10,180),OS_TIMBER,0.6);os_trestle(ctx,s0+16,s1-16,700,746);
  os_sack(ctx,s0+80,700,56,77);os_sack(ctx,s0+150,700,48,78);os_awning(ctx,s0-14,s1+14,556,OS_BLUESTRIPE,51);ctx.restore();
  // the walls: stone in courses, the arch's frame, oak beams overhead, a flagged floor
  const wall=[[-40,-40],[W+40,-40],[W+40,F],[ax+aw,F]].concat(wc_arched(ax,ay,aw,F-ay).slice().reverse()).concat([[ax,F],[-40,F]]);
  wc_wash(ctx,wall,[222,210,186],{kind:"build",lw:1.4,seed:5});ctx.save();wc_tr(ctx,wall);ctx.clip();ctx.strokeStyle=rgba([150,136,112],0.25);ctx.lineWidth=1.6;
  for(let y=40;y<F;y+=48){const o=(y/48)%2?0:60;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();for(let x=o;x<W;x+=120){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+48);ctx.stroke();}}ctx.restore();
  wc_ink(ctx,wc_arched(ax-14,ay-14,aw+28,F-ay+14).slice(1,-1),false,3,WC_INK,0.5,7);
  for(const by of [0,96])wc_part(ctx,wc_rect(-40,by,W+80,40),[124,90,62],1);
  wc_wash(ctx,wc_rect(-40,F,W+80,H-F+40),[200,188,166],{kind:"ground",line:false,seed:8});ctx.save();ctx.strokeStyle=rgba([150,138,116],0.4);ctx.lineWidth=2;
  for(let i=0;i<5;i++){const y=F+i*i*12+10;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y);ctx.stroke();}for(let i=-12;i<=12;i++){ctx.beginPath();ctx.moveTo(960+i*90,F);ctx.lineTo(960+i*260,H+20);ctx.stroke();}ctx.restore();
  // the cupboard: an oak frame, two shelves, its doors open to the sides
  const [x,y,w,h]=OS_HL.cup;wc_contact(ctx,x-30,x+w+30,y+h+4,1,0.3);wc_part(ctx,wc_rect(x,y,w,h),[110,78,52],1);wc_part(ctx,wc_rect(x+24,y+24,w-48,h-48),[70,50,36],1);
  for(const sy of [y+250,y+h-24])wc_part(ctx,wc_rect(x+24,sy-12,w-48,16),[150,110,76],1);
  wc_part(ctx,[[x-90,y+10],[x,y],[x,y+h],[x-90,y+h-10]],[136,98,66],1);wc_part(ctx,[[x+w,y],[x+w+90,y+10],[x+w+90,y+h-10],[x+w,y+h]],[136,98,66],1);
  wc_part(ctx,wc_rect(x-14,y-26,w+28,30),[136,98,66],1);}
// the king's standards on the cupboard's shelves: a bushel, a gallon (until the clerk takes it), a quart, the yard, a pile of weights,
// all of bronze; then the grille in front of them. glow lights them.
const OS_BRONZE=[210,150,62];
function os_vessel(ctx,x,y,w,h){wc_wash(ctx,[[x-w/2,y-h],[x+w/2,y-h],[x+w/2-3,y],[x-w/2+3,y]],OS_BRONZE,{kind:"thing",lw:1.6,seed:x|0});wc_wash(ctx,wc_ell(x,y-h,w/2,w*0.12,24),wc_dim(OS_BRONZE,0.3),{kind:"thing",lw:1.2,seed:(x|0)+3});
  for(const k of [0.25,0.72])wc_flat(ctx,wc_rect(x-w/2+2,y-h*k-3,w-4,6),wc_dim(OS_BRONZE,0.2),1,"band");
  // the shine of polished bronze: a pale stripe down one side
  ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(255,236,190,0.42)";ctx.fillRect(x-w*0.3,y-h+w*0.1,w*0.09,h-w*0.14);ctx.restore();}
function os_standards(ctx,taken,glow){const [x,y,w,h]=OS_HL.cup;ctx.drawImage(wc_kept("standards",W,H,q=>{os_vessel(q,x+130,y+238,170,130);os_vessel(q,x+380,y+238,84,104);
    q.save();wc_part(q,wc_rect(x+60,y+h-140,w-120,14),OS_BRONZE,1);for(let i=0;i<4;i++)wc_wash(q,wc_rect(x+90+i*16-i*i*2,y+h-36-i*20,150-i*34,20),OS_BRONZE,{kind:"thing",lw:1.2,seed:60+i});q.restore();
    os_vessel(q,x+380,y+h-36,50,62);}),0,0);
  if(!taken)ctx.drawImage(os_gallonC(),x+215,y+120);gv_halo(ctx,x+40,y+40,w-80,h-80,[255,214,120],glow*0.7);
  ctx.drawImage(wc_kept("grille",W,H,q=>{for(let gx=x+40;gx<x+w-30;gx+=36)wc_wash(q,wc_rect(gx,y+28,7,h-56),[70,66,72],{kind:"iron",lw:1});wc_wash(q,wc_rect(x+30,y+h/2-5,w-60,10),[70,66,72],{kind:"iron",lw:1});}),0,0);}
// the gallon the clerk carries, kept
function os_gallonC(){return wc_kept("gallon",120,140,q=>os_vessel(q,60,128,70,96));}

/* ---------- 1871: a corn exchange ---------- */
const OS_EX={fy:880,table:[150,1770,716]};
function os_paintExchange(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);const F=OS_EX.fy;
  // the hall: a warm wall with three tall arched windows, iron columns, a glass roof's ribs above
  wc_wash(ctx,wc_rect(-40,-40,W+80,F+40),[232,214,186],{kind:"plaster",line:false,seed:9});
  for(const wx of [210,850,1490]){ctx.save();wc_tr(ctx,wc_arched(wx,150,220,470));ctx.clip();wc_sky(ctx,560,wx,{clouds:1,cx:wx,cw:120,cy:200,ch:80});ctx.restore();
    wc_ink(ctx,wc_arched(wx,150,220,470),true,3,WC_INK,0.6,wx);ctx.save();ctx.strokeStyle=rgba([240,236,226],0.95);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(wx+110,150);ctx.lineTo(wx+110,620);ctx.moveTo(wx,400);ctx.lineTo(wx+220,400);ctx.stroke();ctx.restore();
    wc_wash(ctx,wc_rect(wx-24,616,268,22),[214,196,166],{kind:"trim",lw:1.4});}
  // the glass roof: panes of pale sky between iron ribs, on a beam the columns hold up
  wc_wash(ctx,wc_rect(-40,-40,W+80,104),[206,222,234],{kind:"glass",line:false,seed:13});ctx.save();ctx.strokeStyle=rgba([84,86,98],0.75);ctx.lineWidth=5;
  for(let x=-20;x<W+40;x+=96){ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x,64);ctx.stroke();}ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-40,24);ctx.lineTo(W+40,24);ctx.stroke();ctx.restore();
  wc_part(ctx,wc_rect(-40,54,W+80,22),[96,98,112],1,{kind:"iron"});
  for(const cx of [120,700,1340,1800]){wc_part(ctx,wc_rect(cx-14,60,28,F-60),[96,98,112],1,{kind:"iron"});wc_part(ctx,wc_rect(cx-26,F-40,52,40),[96,98,112],1,{kind:"iron"});wc_part(ctx,[[cx-30,60],[cx+30,60],[cx+14,90],[cx-14,90]],[96,98,112],1,{kind:"iron"});}
  wc_wash(ctx,wc_rect(-40,F,W+80,H-F+40),[206,186,152],{kind:"ground",line:false,seed:4});ctx.save();ctx.strokeStyle=rgba([150,128,96],0.35);ctx.lineWidth=2;for(let i=-14;i<=14;i++){ctx.beginPath();ctx.moveTo(960+i*70,F);ctx.lineTo(960+i*210,H+20);ctx.stroke();}ctx.restore();
  // sacks of corn behind the merchant's table
  [[260,120],[380,104],[1520,116],[1640,98],[1440,90]].forEach(([x,h],i)=>os_sack(ctx,x,OS_EX.table[2]-6,h,70+i));}
// the merchant's table, drawn after the merchant behind it
function os_exTable(ctx){const [x0,x1,y]=OS_EX.table;ctx.drawImage(wc_kept("exTable",W,H,q=>{wc_contact(q,x0,x1,OS_EX.fy+4,1,0.3);wc_part(q,wc_rect(x0+20,y+24,x1-x0-40,OS_EX.fy-y-24),[150,106,70],1);
    for(let i=0;i<8;i++)wc_flat(q,wc_rect(x0+60+i*(x1-x0-120)/8,y+50,(x1-x0-120)/8-20,OS_EX.fy-y-80),[166,120,82],1,"panel");wc_part(q,wc_rect(x0,y,x1-x0,26),[176,128,88],1);}),0,0);}
// a wooden measure, a bushel of one size or another: staves and two iron hoops, kept once and drawn at any size
function os_measureAt(ctx,x,y,w,h){const c=wc_kept("measure",200,170,q=>{q.translate(10,20);wc_wash(q,[[0,22],[180,22],[176,140],[4,140]],[198,150,98],{kind:"thing",lw:1.6,seed:9});
    q.strokeStyle=rgba([140,98,62],0.5);q.lineWidth=2;for(let i=1;i<9;i++){q.beginPath();q.moveTo(i*20,24);q.lineTo(i*20-1,138);q.stroke();}
    wc_wash(q,wc_ell(90,22,90,20,32),[120,84,54],{kind:"thing",lw:1.4,seed:4});for(const k of [46,118])wc_flat(q,wc_rect(2,k,176,8),[84,80,84],1,"hoop");});
  ctx.drawImage(c,x-w/2-w*10/180,y-h*160/118,w*200/180,h*170/118);}

/* ---------- the 1880s: a grocer's shop ---------- */
// the counter's top, where the scale stands, and where the inspector stands in front of it
const OS_SH={fy:880,counter:[330,1560,646],scale:990};
function os_paintShop(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);const F=OS_SH.fy;
  wc_wash(ctx,wc_rect(-40,-40,W+80,F+40),[228,214,184],{kind:"plaster",line:false,seed:12});
  // shelves of goods behind the counter: jars, tins, packets
  const sx0=360,sx1=1720;wc_part(ctx,wc_rect(sx0,120,sx1-sx0,470),[136,96,66],1);const R=wc_rng(14);
  for(const sy of [240,360,480,590]){wc_part(ctx,wc_rect(sx0-10,sy,sx1-sx0+20,16),[160,116,80],1);let x=sx0+24;while(x<sx1-60){const k=Math.floor(R()*4),w=k===0?44:k===1?52:k===2?36:60,h=k===0?70:k===1?84:k===2?96:56;
      const col=[[226,232,236],[176,64,52],[214,180,96],[92,126,150]][k];if(k===0){wc_wash(ctx,wc_rect(x,sy-h,w,h),col,{kind:"thing",lw:1.2,seed:x|0});wc_flat(ctx,wc_rect(x+4,sy-h-8,w-8,10),[150,110,70],1,"lid");}
      else wc_part(ctx,wc_rect(x,sy-h,w,h),col,1,{lw:1.2});x+=w+8+R()*10;}}
  // the shop's window, onto the market square in daylight: the town wall across it, a stall under its awning, the market cross
  ctx.save();ctx.beginPath();ctx.rect(30,170,250,520);ctx.clip();wc_sky(ctx,560,9,{clouds:1,cx:40,cw:150,cy:220,ch:80});
  const wt=452,wb=540,wl=[[0,wb],[0,wt+12]];for(let x=0;x<320;x+=34)wl.push([x,wt+12],[x,wt],[x+18,wt],[x+18,wt+12]);wl.push([320,wt+12],[320,wb]);wc_part(ctx,wl,OS_STONE,0.42);
  wc_land(ctx,x=>wb+2*Math.sin(x/40),OS_EARTH,0.55,{line:false});
  const qx=222;for(const [w,y] of [[92,622],[72,610],[54,598]])wc_part(ctx,wc_rect(qx-w/2,y,w,12),wc_lit(OS_STONE,0.06),0.55);
  wc_part(ctx,wc_rect(qx-6,452,12,148),OS_STONE,0.55);wc_part(ctx,wc_rect(qx-18,470,36,9),OS_STONE,0.55);
  for(const x of [40,128])wc_part(ctx,wc_rect(x-4,500,8,124),OS_TIMBER,0.6);wc_part(ctx,wc_rect(36,580,100,10),OS_TIMBER,0.6);
  for(const [x,h] of [[62,34],[98,28]])wc_wash(ctx,wc_rect(x-14,580-h,28,h),[226,206,156],{depth:0.6,kind:"build",lw:1,seed:x});
  ctx.save();ctx.translate(30,490);ctx.scale(0.42,0.42);os_awning(ctx,0,250,0,OS_REDSTRIPE,61);ctx.restore();ctx.restore();
  for(const r of [wc_rect(18,158,274,14),wc_rect(18,158,14,544),wc_rect(278,158,14,544),wc_rect(150,170,10,520),wc_rect(30,420,250,10)])wc_wash(ctx,r,[118,84,58],{kind:"trim",lw:1.2});
  wc_wash(ctx,wc_rect(-40,F,W+80,H-F+40),[196,164,124],{kind:"ground",line:false,seed:6});ctx.save();ctx.strokeStyle=rgba([140,108,74],0.4);ctx.lineWidth=2;for(let i=-14;i<=14;i++){ctx.beginPath();ctx.moveTo(960+i*70,F);ctx.lineTo(960+i*220,H+20);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,F-18,W+80,20),[150,116,84],{kind:"trim",line:false,flat:true});}
// the counter, drawn after the grocer behind it
function os_counter(ctx){const [x0,x1,y]=OS_SH.counter;ctx.drawImage(wc_kept("counter",W,H,q=>{wc_contact(q,x0-10,x1+10,OS_SH.fy+4,1,0.3);wc_part(q,wc_rect(x0+10,y+26,x1-x0-20,OS_SH.fy-y-26),[132,72,52],1);
    for(let i=0;i<6;i++)wc_flat(q,wc_rect(x0+44+i*(x1-x0-60)/6,y+60,(x1-x0-60)/6-30,OS_SH.fy-y-100),[150,86,62],1,"panel");wc_part(q,wc_rect(x0-10,y,x1-x0+20,28),[164,98,70],1);}),0,0);}
// the beam scale on the counter: its pillar, the beam tilting by tilt (radians), two brass pans hanging level; what's in each pan
function os_scaleAt(ctx,x,y,tilt,left,right){const L=150;ctx.drawImage(wc_kept("scaleStand",140,260,q=>{wc_part(q,wc_rect(54,40,22,200),[160,120,62],1);wc_part(q,wc_rect(20,236,90,16),[120,90,60],1);
    wc_wash(q,wc_ell(65,40,14,14,16),[200,160,80],{kind:"thing",lw:1.2});}),x-65,y-252);
  const py=y-212,c=Math.cos(tilt),s=Math.sin(tilt),ends=[[x-L*c,py-L*s],[x+L*c,py+L*s]];ctx.save();ctx.strokeStyle=rgba([140,104,48],1);ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ends[0][0],ends[0][1]);ctx.lineTo(ends[1][0],ends[1][1]);ctx.stroke();ctx.restore();
  ends.forEach(([ex,ey],i)=>{ctx.save();ctx.strokeStyle=rgba([110,92,70],0.8);ctx.lineWidth=2;for(const d of [-40,40]){ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+d,ey+110);ctx.stroke();}ctx.restore();
    ctx.drawImage(wc_kept("pan",120,40,q=>wc_wash(q,[[6,6],[114,6],[96,30],[24,30]],[214,170,84],{kind:"thing",lw:1.4})),ex-60,ey+104);const what=i?right:left;if(what)what(ctx,ex,ey+110);});
  return ends;}
// a brass weight, an iron one, and the crown stamped on it (c, 0 to 1)
function os_brass(ctx,x,y,s){s=s||1;ctx.drawImage(wc_kept("brass",80,80,q=>{wc_wash(q,[[12,70],[68,70],[60,26],[20,26]],[226,180,90],{kind:"thing",lw:1.4});wc_wash(q,wc_ell(40,20,12,9,14),[226,180,90],{kind:"thing",lw:1.2});}),x-40*s,y-74*s,80*s,80*s);}
function os_iron(ctx,x,y,crown,s){s=s||1;ctx.drawImage(wc_kept("iron|"+s,Math.ceil(90*s),Math.ceil(80*s),q=>{q.scale(s,s);wc_wash(q,[[10,72],[80,72],[72,30],[18,30]],[96,96,104],{kind:"thing",lw:1.4/s});wc_wash(q,wc_ell(45,24,16,10,14),[96,96,104],{kind:"thing",lw:1.2/s});}),x-45*s,y-76*s);
  if(crown>0){const k=s*lerp(1.4,1,ease(clamp(crown,0,1)));ctx.save();ctx.translate(x,y-30*s);ctx.scale(k,k);ctx.globalAlpha*=clamp(crown*2,0,1);ctx.fillStyle=rgba([244,224,170],0.95);ctx.beginPath();
    ctx.moveTo(-14,8);ctx.lineTo(-16,-8);ctx.lineTo(-8,-1);ctx.lineTo(0,-12);ctx.lineTo(8,-1);ctx.lineTo(16,-8);ctx.lineTo(14,8);ctx.closePath();ctx.fill();ctx.restore();}}
// the inspector's case: a wooden box, open, its lid up, brass weights in their velvet holes; and the Act, a printed book, on the counter
function os_case(ctx,x,y,open){ctx.drawImage(wc_kept("caseBox",340,140,q=>{q.translate(10,10);wc_part(q,wc_rect(0,40,320,80),[120,80,52],1);wc_wash(q,wc_rect(14,44,292,46),[110,40,52],{kind:"thing",line:false});
    [[50,26],[110,22],[166,18],[214,15],[254,12],[286,10]].forEach(([cx,r])=>{wc_wash(q,wc_ell(cx,64,r,r*0.5,16),[80,26,34],{kind:"thing",line:false,flat:true});wc_wash(q,[[cx-r*0.8,70],[cx+r*0.8,70],[cx+r*0.6,70-r*1.1],[cx-r*0.6,70-r*1.1]],[226,180,90],{kind:"thing",lw:1});});}),x-170,y-130);
  if(open<1){const k=1-open;ctx.save();ctx.translate(x,y-80);ctx.scale(1,k);ctx.drawImage(wc_kept("caseLid",340,120,q=>{q.translate(10,10);wc_part(q,wc_rect(0,0,320,90),[120,80,52],1);wc_flat(q,wc_rect(140,40,40,12),[200,160,80],1,"clasp");}),-170,-10);ctx.restore();}
  else{ctx.drawImage(wc_kept("caseLidUp",340,100,q=>{q.translate(10,6);wc_part(q,[[0,80],[320,80],[300,0],[20,0]],[120,80,52],1);wc_wash(q,[[16,72],[304,72],[290,10],[30,10]],[110,40,52],{kind:"thing",line:false});}),x-170,y-168);}}
function os_act(ctx,x,y,s){s=s||1;ctx.drawImage(wc_kept("act|"+s,Math.ceil(300*s),Math.ceil(120*s),q=>{q.scale(s,s);q.translate(10,10);wc_part(q,[[0,90],[280,90],[262,0],[18,0]],[90,60,50],1);wc_wash(q,[[14,82],[136,82],[126,8],[26,8]],WCP.parchment,{kind:"page",lw:1});wc_wash(q,[[144,82],[266,82],[254,8],[154,8]],WCP.parchment,{kind:"page",lw:1});
    q.strokeStyle=rgba(WCP.parchInk,0.45);q.lineWidth=1.6;for(let i=0;i<5;i++){q.beginPath();q.moveTo(36,24+i*12);q.lineTo(118,24+i*12);q.moveTo(162,24+i*12);q.lineTo(244,24+i*12);q.stroke();}
    q.fillStyle=rgba(WCP.parchInk,0.7);q.beginPath();q.arc(80,14,6,0,TAU);q.fill();}),x-150*s,y-110*s);}

/* ---------- the 1880s, close: the inspector's mark on the counter ---------- */
// three iron weights in a row on the counter, and the Act open at the back of it; the punch, the mallet and his hands are drawn every
// frame
const OS_ST={top:540,base:812,s:3.2,weights:[540,900,1260],act:[1500,604,1.25]};
function os_paintStamp(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  // behind: the shop's shelves, close and out of focus, in shadow: painted sharp on a layer, then blurred once (a blur on each stroke stalled the page for seconds)
  const L=mkCanvas(W+80,OS_ST.top+80),q=L.getContext("2d");q.translate(40,40);wc_wash(q,wc_rect(-40,-40,W+80,OS_ST.top+40),[118,84,60],{kind:"plaster",line:false,seed:81});const R=wc_rng(31);
  for(const sy of [150,400]){let x=-30;while(x<W+20){const k=Math.floor(R()*4),w=[96,110,80,128][k],h=[150,176,196,116][k];
      wc_part(q,wc_rect(x,sy-h,w,h),mix([[226,232,236],[176,64,52],[214,180,96],[92,126,150]][k],[118,84,60],0.35),1,{lw:1});x+=w+20+R()*28;}
    wc_part(q,wc_rect(-40,sy,W+80,30),[150,108,74],1);}ctx.save();ctx.filter="blur(7px)";ctx.drawImage(L,-40,-40);ctx.restore();
  // the counter's top, its grain running away from us, and its back edge
  wc_wash(ctx,wc_rect(-40,OS_ST.top,W+80,H-OS_ST.top+40),[186,118,84],{kind:"plaster",line:false,seed:82});
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.strokeStyle=rgba([150,90,60],0.2);ctx.lineWidth=2.4;
  for(let i=-14;i<=14;i++){ctx.beginPath();ctx.moveTo(960+i*80,OS_ST.top);ctx.quadraticCurveTo(960+i*130,OS_ST.top+300,960+i*190,H+40);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,OS_ST.top-8,W+80,14),[206,140,100],{kind:"trim",line:false,flat:true});
  const [ax,ay,as]=OS_ST.act;wc_contact(ctx,ax-200*as,ax+200*as,ay+2,1,0.3);os_act(ctx,ax,ay,as);
  for(const x of OS_ST.weights){wc_contact(ctx,x-150,x+150,OS_ST.base+2,1,0.45);os_iron(ctx,x,OS_ST.base,0,OS_ST.s);}}
// the inspector's hands at a weight standing at (x,y), s times its usual size: from below the frame, the left holds a steel punch to
// the weight's face, where the mark goes; the right brings a mallet down on the punch's head as u goes from 0 (raised) to 1 (struck).
// lift raises both while they move to the next weight.
const OS_CUFF=[246,244,238],OS_SLEEVE=[48,52,66];
function os_fist(ctx,x,y,a,seed){const P=PEOPLE.inspector,dk=rgba(wc_dim(P.skin,0.35),0.6);ctx.save();ctx.translate(x,y);ctx.rotate(a);
  wc_wash(ctx,wc_smooth([[-56,-40],[-20,-58],[30,-56],[58,-30],[60,26],[40,54],[-20,58],[-58,30],[-56,-40]],5),P.skin,{kind:"limb",lw:1.4,seed});
  // the knuckles, the fingers curled round, and the thumb across them
  ctx.strokeStyle=dk;ctx.lineWidth=3;ctx.lineCap="round";for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(18,-26+i*26);ctx.quadraticCurveTo(40,-20+i*26,52,-28+i*26);ctx.stroke();}
  wc_wash(ctx,wc_smooth([[-44,-30],[-6,-44],[30,-40],[34,-28],[-4,-22],[-40,-12],[-44,-30]],4),wc_dim(P.skin,0.06),{kind:"limb",lw:1.2,seed:seed+2});ctx.restore();}
// a forearm in its sleeve, coming up from below the frame to the wrist at (wx,wy), widening as it nears us; then the white cuff
function os_forearm(ctx,wx,wy,bx,seed){const d=Math.atan2(H+80-wy,bx-wx),nx=-Math.sin(d),ny=Math.cos(d),w0=56,w1=110;
  wc_wash(ctx,[[wx+nx*w0,wy+ny*w0],[bx+nx*w1,H+80],[bx-nx*w1,H+80],[wx-nx*w0,wy-ny*w0]],OS_SLEEVE,{kind:"coat",lw:1.4,seed});
  const c=[Math.cos(d),Math.sin(d)];wc_wash(ctx,[[wx+nx*58,wy+ny*58],[wx+nx*60+c[0]*44,wy+ny*60+c[1]*44],[wx-nx*60+c[0]*44,wy-ny*60+c[1]*44],[wx-nx*58,wy-ny*58]],OS_CUFF,{kind:"coat",lw:1.2,seed:seed+1});}
function os_markTools(ctx,x,y,s,u,lift){lift=lift||0;const tip=[x,y-30*s-lift],a=-0.42,L=250,dir=[Math.sin(a),-Math.cos(a)],top=[tip[0]+dir[0]*L,tip[1]+dir[1]*L],
    grip=[tip[0]+dir[0]*L*0.5,tip[1]+dir[1]*L*0.5];
  // the left forearm and the punch it holds
  os_forearm(ctx,grip[0]-56,grip[1]+66,grip[0]-300,5);
  ctx.save();ctx.translate(tip[0],tip[1]);ctx.rotate(a);wc_wash(ctx,[[-10,0],[10,0],[13,-L+30],[-13,-L+30]],[160,166,176],{kind:"thing",lw:1.4,seed:9});
  wc_wash(ctx,wc_rect(-18,-L,36,32),[128,134,146],{kind:"thing",lw:1.4,seed:10});ctx.restore();os_fist(ctx,grip[0],grip[1],a,11);
  // the mallet turns about the right hand, from raised to its head on the punch's head; the right forearm below it
  const hand=[top[0]+250,top[1]+130],hl=260,h1=Math.atan2(top[1]-44-hand[1],top[0]-hand[0]),th=lerp(h1+1.15,h1,u);
  ctx.save();ctx.translate(hand[0],hand[1]);ctx.rotate(th);wc_wash(ctx,[[0,-9],[hl-34,-8],[hl-34,8],[0,9]],[156,112,72],{kind:"thing",lw:1.2,seed:12});
  wc_wash(ctx,wc_rrPts(hl-40,-50,84,100,14),[120,84,56],{kind:"thing",lw:1.4,seed:13});ctx.restore();
  os_forearm(ctx,hand[0]+44,hand[1]+62,hand[0]+300,14);os_fist(ctx,hand[0],hand[1],th+Math.PI/2,16);return{tip,top};}

/* ---------- today: Yusuf's first day, and what he inherits ---------- */
// a cardboard box of his things, the first day, a plant and a mug in it; kept, about 280 x 250, the box's middle at (140,170)
function os_boxC(){return wc_kept("box",280,250,q=>{
  for(const [a,l,c] of [[-0.5,92,[96,150,84]],[-0.15,104,[120,168,96]],[0.25,96,[104,156,88]],[-0.85,70,[132,176,104]],[0.6,74,[96,150,84]]]){q.save();q.translate(92,112);q.rotate(a);
    wc_wash(q,[[0,0],[-15,-l*0.45],[0,-l],[15,-l*0.45]],c,{kind:"thing",lw:1.1,seed:Math.round(l)});q.restore();}
  wc_wash(q,wc_rect(168,70,52,52),[226,232,238],{kind:"thing",lw:1.3,seed:5});wc_wash(q,wc_ell(222,94,11,15,14),[226,232,238],{kind:"thing",lw:1.3,seed:6});
  wc_wash(q,[[24,104],[256,104],[250,240],[30,240]],[204,168,118],{kind:"cover",lw:1.5,seed:7});
  wc_flat(q,[[30,104],[250,104],[248,124],[32,124]],[176,140,94],1,"flap");wc_flat(q,wc_rect(124,124,32,114),[226,206,160],1,"tape");
  wc_wash(q,wc_rrPts(110,150,60,16,8),[120,92,60],{kind:"thing",line:false,flat:true});});}
// held in both hands, in the figure's units, the hands at its sides
function os_heldBox(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.drawImage(os_boxC(),mx-140,my-130);fingers(cx,P_,[[mx-112,my+40],[mx+112,my+40]]);}

// the shelf's 34 binders, standing on its two middle shelves, numbered 1 to 34 along each row from the left; missing() leaves one
// out (binder 12 is in Yusuf's hands), out(i) slides one forward (0 to 1), glow(i) lights one: its label gold, a warm light round it
const OS_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]]};
const os_bindCol=i=>OS_BIND.cols[Math.floor(hash(i,17)*OS_BIND.cols.length)];
function os_bindPos(i){const B=OS_BIND,row=i<17?0:1;return[B.x+(i%17)*B.gap,GV_OFF.shelf.rows[1+row]];}
function os_binders(ctx,o){o=o||{};const B=OS_BIND;for(let i=0;i<34;i++){if(o.missing&&o.missing(i))continue;const [x,y]=os_bindPos(i),u=o.out?o.out(i):0,g=o.glow?o.glow(i):0,bw=B.w+u*6;
  ctx.save();ctx.translate(0,-10*u);gv_binder(ctx,x-u*3,y-B.h,bw,B.h,os_bindCol(i));
  if(g>0.01){ctx.fillStyle=rgba(GV.gold,0.95*g);ctx.fillRect(x-u*3+bw*0.18,y-B.h*0.9,bw*0.64,B.h*0.26);
    ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+B.w/2,y-B.h*0.55,70,[255,206,110],0.5*g);}
  ctx.restore();}}

// the framed score on the office wall: the maturity assessment's result, 2.1 of 5, as a bar of five
function os_score(ctx,a){const [x,y,w,h]=GV_OFF.score,cx=x+w/2;
  wc_T(ctx,"maturity",cx,y+40,{w:600,size:24,align:"center",col:WC_MUTED,deco:1});wc_T(ctx,"2.1 / 5",cx,y+88,{w:800,size:42,align:"center",col:WC_DARK,deco:1});
  for(let i=0;i<5;i++){const bx=x+24+i*26;ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(bx,y+104,22,12);const f=clamp(2.1-i,0,1);if(f>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(bx,y+104,22*f,12);}}}

// the chart of who's responsible for what, pinned to the board: four things, and for each, the one responsible, the one
// accountable, who's consulted and who's informed; half the names are "TBC", written in by hand (tbc(k), 0 to 1, for the k-th)
const OS_RACI={things:["census report","award term","government submission","data access"],cols:["responsible","accountable","consulted","informed"],
  names:[["Clara",0,"Jun",0],["Mei",0,0,"Jun"],[0,0,"Clara","Mei"],["Sam",0,0,"Jun"]]};
// the cells with no name, in the order they're filled in
const OS_TBC=[];OS_RACI.names.forEach((r,i)=>r.forEach((n,j)=>{if(!n)OS_TBC.push([i,j]);}));
const OS_CH={x:300,y:96,w:1320,h:700,c0:420,cw:205,head:212,row:116};
function os_cellAt(i,j){const C=OS_CH;return[C.x+40+C.c0+j*C.cw+C.cw/2,C.y+C.head+56+i*C.row];}
function os_chart(ctx,tbc,o){o=o||{};const C=OS_CH;gv_sheet(ctx,C.x,C.y,C.w,C.h);[[C.x+40,C.y+22],[C.x+C.w-40,C.y+22]].forEach(([px,py])=>gv_pin(ctx,px,py,GV.red,1.4));
  wc_T(ctx,"Who's responsible for what",C.x+40,C.y+96,{w:800,size:44,col:WC_DARK});
  const gx=C.x+40,gw=C.c0+4*C.cw;ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2;
  for(let i=0;i<=4;i++){const y=C.y+C.head+i*C.row;ctx.beginPath();ctx.moveTo(gx,y);ctx.lineTo(gx+gw,y);ctx.stroke();}
  for(let j=0;j<4;j++){const x=gx+C.c0+j*C.cw;ctx.beginPath();ctx.moveTo(x,C.y+C.head-60);ctx.lineTo(x,C.y+C.head+4*C.row);ctx.stroke();}ctx.restore();
  if(o.light!=null)gv_tint(ctx,gx,C.y+C.head+o.light*C.row,gw,C.row,GV.gold,o.lightA||0);
  OS_RACI.cols.forEach((s,j)=>wc_T(ctx,s,gx+C.c0+j*C.cw+C.cw/2,C.y+C.head-20,{w:700,size:28,align:"center",col:WC_MUTED}));
  OS_RACI.things.forEach((s,i)=>wc_T(ctx,s,gx+8,C.y+C.head+i*C.row+68,{w:700,size:30,col:WC_DARK}));
  OS_RACI.names.forEach((r,i)=>r.forEach((n,j)=>{if(n){const [cx,cy]=os_cellAt(i,j);wc_T(ctx,n,cx,cy+12,{w:600,size:32,align:"center",col:WC_INK});}}));
  OS_TBC.forEach(([i,j],k)=>{const p=tbc(k);if(p<=0||(o.hide&&o.hide[0]===i&&o.hide[1]===j))return;const [cx,cy]=os_cellAt(i,j);wc_hand(ctx,"TBC",cx-42,cy+14,{size:40,col:GV.redInk,p});});}
// the same chart, small on the office's board: lines for the words, a red mark for each TBC once they're there
function os_chartSmall(ctx,tbc){const [bx,by]=GV_OFF.board,x=bx+40,y=by+50,w=330,h=190;gv_sheet(ctx,x,y,w,h);gv_pin(ctx,x+16,y+10,GV.red,0.8);gv_pin(ctx,x+w-16,y+10,GV.red,0.8);
  gv_lines(ctx,x+18,y+28,170,1,0);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.5;for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(x+14,y+56+i*30);ctx.lineTo(x+w-14,y+56+i*30);ctx.stroke();}ctx.restore();
  for(let i=0;i<4;i++){gv_lines(ctx,x+20,y+68+i*30,70,1,0,0.8);OS_RACI.names[i].forEach((n,j)=>{const cx=x+128+j*48;if(n)gv_lines(ctx,cx,y+68+i*30,32,1,0,0.8);else if(tbc>0){ctx.fillStyle=rgba(GV.redInk,0.8*tbc);ctx.fillRect(cx,y+64+i*30,30,9);}});}}

// the council's minutes on the desk: this month's on top, the months before under it; the action that is carried forward each time
const OS_MIN={x:620,y:248,w:680,h:840};
function os_minutes(ctx,stamp){const M=OS_MIN;
  [["July",-0.07,-46,-150],["August",-0.035,-22,-76]].forEach(([m,r,dx,dy],k)=>{gv_sheet(ctx,M.x+dx,M.y+dy,M.w,M.h,{rot:r});ctx.save();ctx.translate(M.x+dx+M.w/2,M.y+dy+M.h/2);ctx.rotate(r);
    wc_T(ctx,"Minutes · "+m,-M.w/2+44,-M.h/2+52,{w:700,size:30,col:WC_INK});ctx.restore();});
  gv_sheet(ctx,M.x,M.y,M.w,M.h,{rot:0.01});
  wc_T(ctx,"Data council",M.x+44,M.y+70,{w:800,size:40,col:WC_DARK});wc_T(ctx,"Minutes · September",M.x+44,M.y+118,{w:600,size:30,col:WC_MUTED});
  gv_lines(ctx,M.x+44,M.y+170,M.w-110,4,30);
  wc_panel(ctx,M.x+30,M.y+302,M.w-60,104,{kind:"card",wash:GV.gold,washA:0.25,seed:5});wc_T(ctx,"Action: name the data owners",M.x+56,M.y+366,{w:800,size:34,col:WC_DARK});
  gv_stamp(ctx,M.x+M.w/2,M.y+500,"CARRIED FORWARD",stamp,{size:40,rot:-0.07});gv_lines(ctx,M.x+44,M.y+590,M.w-110,3,30,0.8);}

/* ---------- today: the two reports ---------- */
const OS_NUM=[40,96,150];
// a number that springs in, n from 0 to 1
function os_numIn(ctx,s,x,y,size,n,col){if(n<=0)return;const k=0.7+0.3*spring(n);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(n*2,0,1),()=>wc_T(ctx,s,0,0,{w:800,size,align:"center",col:col||OS_NUM}));ctx.restore();}
// Planning's census report on its wall screen: this year's awards, by month, and the total, n
function os_census(ctx,n){const [x,y,w,h]=GV_PL.screen;gv_screen(ctx,x,y,w,h,"Census report",q=>{wc_T(q,"awards conferred this year",x+34,y+100,{w:600,size:30,col:WC_MUTED});
  for(let i=0;i<6;i++){const bh=50+150*hash(i,41);q.fillStyle=rgba(i===5?GV.gold:[150,186,222],1);q.fillRect(x+44+i*50,y+h-34-bh,36,bh);}
  os_numIn(q,"4,812",x+w*0.74,y+h*0.7,104,n);},{titleSize:30,barH:46});}
// the registrar's draft submission, held in both hands at her chest (in the figure's units), the total n
const os_draft=n=>(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+46);cx.rotate(-0.04);
  cx.fillStyle="rgba(60,50,40,0.22)";cx.fillRect(-94,-118,200,250);cx.fillStyle="#fffdf6";cx.fillRect(-100,-125,200,250);cx.fillStyle=rgba([84,120,170],1);cx.fillRect(-100,-125,200,92);
  wc_T(cx,"Draft",0,-88,{w:800,size:34,align:"center",col:[255,255,255]});wc_T(cx,"submission",0,-48,{w:800,size:31,align:"center",col:[255,255,255]});
  os_numIn(cx,"4,867",0,40,70,n);wc_T(cx,"awards",0,100,{w:700,size:34,align:"center",col:WC_MUTED});cx.restore();
  fingers(cx,P_,[[mx-98,my+62],[mx+98,my+56]]);};

/* ---------- today: who decides? ---------- */
// the two reports' cards on the data team's board, close: what each is, when it ran, its number; a green tick once it's found right.
// Monday's card, gold, goes between them.
const OS_RC={census:[290,330,470,300],draft:[1160,330,470,300],monday:[830,372,260,226]};
function os_reportCard(ctx,[x,y,w,h],name,ran,num,tick){wc_panel(ctx,x,y,w,h,{kind:"card",seed:x|0});gv_pin(ctx,x+w/2,y+14,GV.red,1.3);
  wc_T(ctx,name,x+w/2,y+80,{w:800,size:38,align:"center",col:WC_DARK});wc_T(ctx,ran,x+w/2,y+130,{w:600,size:30,align:"center",col:WC_MUTED});
  wc_T(ctx,num,x+w/2,y+238,{w:800,size:76,align:"center",col:OS_NUM});wc_tick(ctx,x+w-60,y+176,74,GV.green,tick,9);}
function os_mondayCard(ctx){const [x,y,w,h]=OS_RC.monday;wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.gold,washA:0.35,seed:9});gv_pin(ctx,x+w/2,y+14,GV.red,1.3);
  wc_T(ctx,"Monday",x+w/2,y+84,{w:800,size:40,align:"center",col:WC_DARK});wc_T(ctx,"award",x+w/2,y+140,{w:700,size:34,align:"center",col:GV.goldInk});
  wc_T(ctx,"changed",x+w/2,y+188,{w:600,size:32,align:"center",col:WC_INK});}
// the glossary's term on Jun's screen, close: what counts as an award; the row added on Monday lights (row), with a gold chip (chip)
function os_glossary(ctx,row,chip){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Glossary",q=>{
  wc_T(q,"award",x+56,y+146,{w:800,size:64,col:WC_DARK});wc_T(q,"what counts:",x+56,y+222,{w:600,size:34,col:WC_MUTED});
  ["graduate certificates","masters and doctorates"].forEach((s,i)=>wc_T(q,"·  "+s,x+76,y+300+i*66,{w:600,size:38,col:WC_INK}));
  if(row>0){gv_tint(q,x+40,y+392,w-80,72,GV.gold,0.75*row);withA(q,row,()=>wc_T(q,"·  microcredentials, 6 credit points or more",x+76,y+442,{w:700,size:38,col:WC_DARK}));}
  if(chip>0){q.save();q.translate(x+w-250,y+130);const k=0.85+0.15*spring(chip);q.scale(k,k);withA(q,clamp(chip*2,0,1),()=>wc_badge(q,-110,0,"changed Monday",{size:32}));q.restore();}},
  {titleSize:32,barH:54});}
// on the registrar's desk: the government's reporting manual, standing, and the university's own term on a tent card
const OS_RD={manual:[770,416,180,248],tent:[1100,548,240,116]};
function os_manual(ctx){const [x,y,w,h]=OS_RD.manual;ctx.drawImage(wc_kept("manual",w+40,h+40,q=>{q.translate(20,20);wc_wash(q,wc_rect(0,0,w,h),[70,92,140],{kind:"cover",lw:1.6,seed:3});
    wc_flat(q,wc_rect(0,h*0.55,w,18),[214,186,110],1,"band");wc_wash(q,wc_ell(w/2,h*0.78,22,22,24),[214,186,110],{kind:"thing",lw:1.2,seed:4});}),x-20,y-20);
  wc_T(ctx,"Reporting",x+w/2,y+58,{w:800,size:28,align:"center",col:[255,255,255]});wc_T(ctx,"manual",x+w/2,y+92,{w:800,size:28,align:"center",col:[255,255,255]});
  wc_T(ctx,"awards",x+w/2,y+124,{w:600,size:26,align:"center",col:[226,232,244]});}
function os_tent(ctx){const [x,y,w,h]=OS_RD.tent;ctx.drawImage(wc_kept("tent",w+40,h+40,q=>{q.translate(20,20);wc_wash(q,[[10,0],[w-10,0],[w,h],[0,h]],WC_CARD,{kind:"paper",lw:1.4,seed:5});}),x-20,y-20);
  wc_T(ctx,"award",x+w/2,y+52,{w:800,size:34,align:"center",col:WC_DARK});wc_T(ctx,"our term",x+w/2,y+92,{w:600,size:28,align:"center",col:WC_MUTED});}
// a gold arc drawn from one thing to another (p, 0 to 1), with a head at its end
function os_arc(ctx,x0,y0,x1,y1,lift,p){if(p<=0)return;const cx=(x0+x1)/2,cy=Math.min(y0,y1)-lift,n=40,m=Math.max(2,Math.round(n*clamp(p,0,1))),pt=u=>[(1-u)*(1-u)*x0+2*(1-u)*u*cx+u*u*x1,(1-u)*(1-u)*y0+2*(1-u)*u*cy+u*u*y1];
  ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.85);ctx.lineWidth=6;ctx.lineCap="round";ctx.setLineDash([14,12]);ctx.beginPath();for(let i=0;i<=m;i++){const [a,b]=pt(i/n);i?ctx.lineTo(a,b):ctx.moveTo(a,b);}ctx.stroke();ctx.restore();
  return pt(0.5);}

/* ---------- today: what governance is for ---------- */
// binder 12, open on the desk, from above: the cover open flat round the pages, the rings down the middle, the back of the page before
// on the left, policy 12 on the right
const OS_OPEN={x:230,y:110,w:1460,h:830,mid:960,pw:660,rings:[280,525,770]};
function os_open12(ctx,o){const B=OS_OPEN,top=B.y+26,ph=B.h-52,L=B.mid-46-B.pw,R=B.mid+46;ctx.drawImage(wc_kept("open12",W,H,q=>{const col=os_bindCol(11);
    q.save();q.filter="blur(16px)";q.fillStyle="rgba(70,50,30,0.32)";q.fillRect(B.x+16,B.y+24,B.w,B.h);q.restore();
    wc_wash(q,wc_rrPts(B.x,B.y,B.w,B.h,18),col,{kind:"cover",lw:1.6,seed:12});wc_flat(q,wc_rect(B.mid-40,B.y+8,80,B.h-16),wc_dim(col,0.22),1,"spine");
    // each side: the pages under the top one, their edges showing; the top page, and the holes the rings go through
    for(const px of [L,R]){const s=px<B.mid?-1:1;for(let k=3;k>=1;k--)wc_flat(q,wc_rect(px+s*k*3,top+k*3,B.pw,ph),wc_dim(GV.paper,0.05*k),1,"pages");
      wc_wash(q,wc_rect(px,top,B.pw,ph),GV.paper,{kind:"page",lw:1.3,seed:px|0});
      for(const ry of B.rings)wc_wash(q,wc_ell(B.mid+s*80,ry,11,11,16),wc_dim(col,0.1),{kind:"thing",line:false,flat:true});}
    // the back of the page before, its lines showing through faintly
    gv_lines(q,L+70,top+110,B.pw-170,13,50,0.3);
    // the rings' mechanism down the middle, and the three rings through the pages
    wc_wash(q,wc_rrPts(B.mid-26,B.rings[0]-60,52,B.rings[2]-B.rings[0]+120,14),GV.metal,{kind:"thing",lw:1.4,seed:13});
    for(const ry of B.rings){q.save();q.strokeStyle=rgba(wc_dim(GV.metal,0.28),1);q.lineWidth=10;q.beginPath();q.ellipse(B.mid,ry,80,17,0,0,TAU);q.stroke();
      q.strokeStyle="rgba(255,255,255,0.65)";q.lineWidth=3;q.beginPath();q.ellipse(B.mid,ry-3,76,13,0,Math.PI*1.15,Math.PI*1.85);q.stroke();q.restore();}}),0,0);
  // policy 12, on the right-hand page; o.text fades it while the cover still lies over it
  const x=R+64;withA(ctx,o&&o.text!=null?o.text:1,()=>{wc_T(ctx,"Data policies",x,top+80,{w:600,size:28,col:WC_MUTED,deco:1});wc_T(ctx,"Policy 12",x,top+184,{w:800,size:66,col:WC_DARK});
  wc_T(ctx,"Data definitions",x,top+244,{w:600,size:36,col:WC_MUTED});
  ["Business terms are","defined consistently","across the organisation."].forEach((s,i)=>wc_T(ctx,s,x,top+350+i*58,{w:600,size:42,col:WC_INK}));
  gv_lines(ctx,x,top+560,B.pw-150,4,40);});}
// a sticky note, pale red, pressed on at an angle as land goes from 0 to 1; then its words written in red pencil as write does
const OS_STICK=[250,214,208];
function os_sticky(ctx,cx,cy,w,h,rot,lines,size,land,write){if(land<=0)return;const k=lerp(1.2,1,easeCam(clamp(land,0,1)));
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(k,k);withA(ctx,clamp(land*2.5,0,1),()=>{
    ctx.drawImage(wc_kept("sticky|"+w+"x"+h,w+60,h+60,q=>{q.translate(30,30);q.save();q.filter="blur(8px)";q.fillStyle="rgba(70,50,30,0.26)";q.fillRect(8,14,w,h);q.restore();
      wc_wash(q,wc_rect(0,0,w,h),OS_STICK,{kind:"page",lw:1.2,seed:w});wc_flat(q,wc_rect(0,0,w,h*0.15),wc_dim(OS_STICK,0.07),1,"glue");}),-w/2-30,-h/2-30);
    // the words in the middle of the space under the glue strip, written one letter after another, line by line
    const n=lines.join("").length,y0=-h/2+h*0.15+(h*0.85-lines.length*size*1.2)/2+size*0.92;let before=0;
    lines.forEach((s,i)=>{const p=clamp((write*n-before)/s.length,0,1);before+=s.length;wc_hand(ctx,s,-w/2+40,y0+i*size*1.2,{size,w:700,col:GV.redInk,p});});});
  ctx.restore();}
/* ---------- today: governance at the centre ---------- */
// binder 12 closed on the desk, from above: its cover and label, the pages' edge, Yusuf's two notes sticking out as flags
function os_closed12(ctx){ctx.drawImage(wc_kept("closed12",W,H,q=>{const col=os_bindCol(11),x=300,y=170,w=560,h=740;
    q.save();q.filter="blur(14px)";q.fillStyle="rgba(70,50,30,0.3)";q.fillRect(x+14,y+20,w,h);q.restore();
    for(const [fy,r] of [[330,-0.06],[520,0.05]]){q.save();q.translate(x+w+20,fy);q.rotate(r);wc_wash(q,wc_rect(-70,-28,110,56),OS_STICK,{kind:"page",lw:1.1,seed:fy});q.restore();}
    wc_flat(q,wc_rect(x+16,y+h-6,w-20,16),wc_dim(GV.paper,0.08),1,"pages");wc_flat(q,wc_rect(x+w-6,y+16,16,h-20),wc_dim(GV.paper,0.08),1,"pages");
    wc_wash(q,wc_rrPts(x,y,w,h,16),col,{kind:"cover",lw:1.6,seed:21});wc_flat(q,wc_rect(x,y+8,54,h-16),wc_dim(col,0.2),1,"spine");
    wc_wash(q,wc_rect(x+150,y+170,300,190),WC_CARD,{kind:"page",lw:1.3,seed:22});}),0,0);
  wc_T(ctx,"12",600,435,{w:800,size:84,align:"center",col:WC_DARK});wc_T(ctx,"Data definitions",600,500,{w:600,size:30,align:"center",col:WC_MUTED});}
// DAMA's book, closed, from above: a plain cloth cover, its title, the pages' edge; kept, drawn round its middle at (x,y)
function os_dmbok(ctx,x,y){const w=620,h=820;ctx.drawImage(wc_kept("dmbok",w+80,h+80,q=>{q.translate(40,40);q.save();q.filter="blur(14px)";q.fillStyle="rgba(70,50,30,0.32)";q.fillRect(14,20,w,h);q.restore();
    wc_flat(q,wc_rect(16,h-8,w-20,20),wc_dim(GV.paper,0.08),1,"pages");wc_flat(q,wc_rect(w-8,16,20,h-20),wc_dim(GV.paper,0.08),1,"pages");
    wc_wash(q,wc_rrPts(0,0,w,h,10),[44,92,108],{kind:"cover",lw:1.6,seed:23});wc_flat(q,wc_rect(0,6,40,h-12),[34,74,88],1,"spine");
    for(const ry of [196,540])wc_flat(q,wc_rect(90,ry,w-150,5),[226,214,180],0.9,"rule");}),x-w/2-40,y-h/2-40);
  const cx=x+16;wc_T(ctx,"DAMA-DMBOK",cx,y-120,{w:800,size:58,align:"center",col:[246,238,214]});
  wc_T(ctx,"Data Management",cx,y+10,{w:600,size:38,align:"center",col:[226,232,226]});wc_T(ctx,"Body of Knowledge",cx,y+62,{w:600,size:38,align:"center",col:[226,232,226]});}
// a page of the book, close: the paper filling the frame, the fold into the spine on the left, the next pages' edges on the right
function os_paintPage(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[250,247,238],{kind:"paper",line:false,seed:91});
  const g=ctx.createLinearGradient(0,0,170,0);g.addColorStop(0,"rgba(90,70,50,0.34)");g.addColorStop(0.45,"rgba(90,70,50,0.1)");g.addColorStop(1,"rgba(90,70,50,0)");ctx.fillStyle=g;ctx.fillRect(0,0,170,H);
  ctx.save();ctx.strokeStyle="rgba(150,136,112,0.35)";ctx.lineWidth=1.5;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(W-14+i*2.6,0);ctx.lineTo(W-14+i*2.6,H);ctx.stroke();}ctx.restore();}
// the wheel the book draws: ten areas of data management round data governance, the centre, where they meet; each area's name outside it
const OS_WH={x:960,y:448,r0:122,r1:290,rl:342},OS_WHC=[[188,202,230],[204,196,230]];
const OS_AREAS=[["data","architecture"],["data modelling","& design"],["data storage","& operations"],["data security"],["data integration","& interoperability"],["documents","& content"],
  ["reference","& master data"],["data warehousing","& BI"],["metadata"],["data quality"]];
const os_whAng=k=>-Math.PI/2+k*TAU/10;
// an area's shape, a ring's slice, about the wheel's middle at (cx,cy)
function os_wedgePts(k,cx,cy){const R=OS_WH,a0=os_whAng(k)-TAU/20+0.014,a1=os_whAng(k)+TAU/20-0.014,p=[];
  for(let i=0;i<=12;i++){const a=lerp(a0,a1,i/12);p.push([cx+Math.cos(a)*R.r1,cy+Math.sin(a)*R.r1]);}for(let i=12;i>=0;i--){const a=lerp(a0,a1,i/12);p.push([cx+Math.cos(a)*(R.r0+8),cy+Math.sin(a)*(R.r0+8)]);}return p;}
function os_wedgeC(k){const s=OS_WH.r1+30;return wc_kept("wedge"+k,2*s,2*s,q=>wc_wash(q,os_wedgePts(k,s,s),OS_WHC[k%2],{kind:"thing",lw:1.4,seed:30+k}));}
// o: area(k) brings each area in (0 to 1); centre lights data governance; joins draws the gold where the areas meet it; ring goes round
// the whole wheel; dim pales every area but hi; outline draws round area hi (a number) or the centre ("centre"); labels and fade take
// the names and the areas away again
function os_wheel(ctx,o){const R=OS_WH,s=R.r1+30,lab=o.labels==null?1:o.labels,fd=o.fade==null?1:o.fade;
  OS_AREAS.forEach((lines,k)=>{const u=o.area(k);if(u<=0)return;const sp=0.6+0.4*spring(u),a=clamp(u*2.5,0,1)*(1-(o.dim||0)*(k===o.hi?0:0.55))*fd;
    ctx.save();ctx.translate(R.x,R.y);ctx.scale(sp,sp);withA(ctx,a,()=>ctx.drawImage(os_wedgeC(k),-s,-s));ctx.restore();
    const an=os_whAng(k),c=Math.cos(an),sn=Math.sin(an),ax=R.x+c*R.rl,ay=R.y+sn*R.rl,al=Math.abs(c)<0.3?"center":c>0?"left":"right",n=lines.length,
      y0=al!=="center"?ay-(n-1)*18+10:sn<0?ay-(n-1)*38-6:ay+32;
    if(lab>0.01)withA(ctx,clamp(u*2,0,1)*lab,()=>lines.forEach((l,i)=>wc_T(ctx,l,ax,y0+i*38,{w:i?600:700,size:30,align:al,col:WC_INK})));});
  if(o.joins>0&&fd>0.01){const e=easeCam(clamp(o.joins,0,1)),r=lerp(R.r1,R.r0,e);ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.85*fd);ctx.lineWidth=6;ctx.lineCap="round";
    for(let k=0;k<10;k++){const b=os_whAng(k)-TAU/20;ctx.beginPath();ctx.moveTo(R.x+Math.cos(b)*R.r1,R.y+Math.sin(b)*R.r1);ctx.lineTo(R.x+Math.cos(b)*r,R.y+Math.sin(b)*r);ctx.stroke();}ctx.restore();}
  if(o.centre>0){const k=0.7+0.3*spring(o.centre);ctx.save();ctx.translate(R.x,R.y);ctx.scale(k,k);withA(ctx,clamp(o.centre*2,0,1),()=>{wc_glowAt(ctx,0,0,R.r0*1.6,[255,226,140],0.45);
    ctx.drawImage(wc_kept("whCentre",2*R.r0+40,2*R.r0+40,q=>wc_wash(q,wc_ell(R.r0+20,R.r0+20,R.r0-2,R.r0-2,40),wc_lit(GV.gold,0.2),{kind:"thing",lw:1.6,seed:44})),-R.r0-20,-R.r0-20);
    wc_T(ctx,"data",0,-6,{w:800,size:34,align:"center",col:GV.goldInk});wc_T(ctx,"governance",0,36,{w:800,size:34,align:"center",col:GV.goldInk});});ctx.restore();}
  if(o.ring>0){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=4;ctx.setLineDash([16,12]);ctx.lineCap="round";ctx.beginPath();
    ctx.arc(R.x,R.y,R.r1+16,-Math.PI/2,-Math.PI/2+TAU*easeCam(clamp(o.ring,0,1)));ctx.stroke();ctx.restore();}
  if(o.outline>0){ctx.save();ctx.globalAlpha*=clamp(o.outline,0,1);ctx.strokeStyle=rgba(WC_DARK,0.85);ctx.lineWidth=5;ctx.lineJoin="round";ctx.beginPath();
    if(o.hi==="centre")ctx.arc(R.x,R.y,R.r0+4,0,TAU);else os_wedgePts(o.hi,R.x,R.y).forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();ctx.stroke();ctx.restore();}}

// a decision, on a small gold card: a pin, typed lines; and a green tick once someone has checked it's kept (tick, 0 to 1)
function os_decision(ctx,x,y,k,tick){ctx.save();ctx.translate(x,y);ctx.scale(k,k);wc_panel(ctx,-76,-56,152,112,{kind:"card",wash:GV.gold,washA:0.5,seed:7});
  gv_lines(ctx,-50,-14,100,3,22,0.9);gv_pin(ctx,0,-42,GV.red,0.9);ctx.restore();if(tick>0)wc_tick(ctx,x+58,y+30,62,GV.green,tick,9);}

/* ---------- today: listen first ---------- */
// a fresh page for a thirty-fifth policy, on the desk from above: its heading and nothing else; th (0 to π) turns it over, unwritten,
// lifting it a little as it goes
const OS_P35={x:960,y:500,w:620,h:800};
function os_page35(ctx,th){const P=OS_P35,c=Math.cos(th),lift=Math.sin(clamp(th,0,Math.PI)),k=1+0.05*lift;
  ctx.save();ctx.translate(P.x+30*lift,P.y-20*lift);ctx.scale(Math.max(0.03,Math.abs(c))*k,k);
  gv_sheet(ctx,-P.w/2,-P.h/2,P.w,P.h,c<0?{col:wc_dim(GV.paper,0.035)}:{});
  if(c>0){const x=-P.w/2+60,y=-P.h/2;wc_T(ctx,"Data policies",x,y+92,{w:600,size:28,col:WC_MUTED,deco:1});wc_T(ctx,"Policy 35",x,y+190,{w:800,size:66,col:WC_DARK});}
  ctx.restore();}
// what Yusuf heard, on index cards in his hand, pinned over the chart in the board's close-up: his question on top, then who said
// what slows them down (u, 0 to 1, pins each one)
const OS_ANS=[["Jun",["rules arrive","after the build"]],["Mei",["never sees where","the words go"]],["Sam",["no one says","which column"]],
  ["Planning",["which number","to trust?"]]];
const OS_ANSC={w:330,h:262,x:[440,790,1140,1490],y:570,rot:[-0.03,0.02,-0.012,0.028]};
function os_asked(ctx){ctx.save();ctx.translate(960,254);ctx.rotate(-0.012);wc_panel(ctx,-330,-66,660,132,{kind:"card",seed:61});gv_pin(ctx,0,-52,GV.red,1.2);
  wc_hand(ctx,"What slows you down?",0,22,{size:50,w:700,align:"center",col:WC_INK});ctx.restore();}
function os_ansCard(ctx,k,u){if(u<=0)return;const A=OS_ANSC,[name,lines]=OS_ANS[k],s=lerp(1.12,1,easeCam(clamp(u,0,1)));
  ctx.save();ctx.translate(A.x[k],A.y-14*(1-easeCam(clamp(u,0,1))));ctx.rotate(A.rot[k]);ctx.scale(s,s);withA(ctx,clamp(u*2.5,0,1),()=>{
    wc_panel(ctx,-A.w/2,-A.h/2,A.w,A.h,{kind:"card",seed:70+k});gv_pin(ctx,0,-A.h/2+18,GV.red,1.1);
    wc_hand(ctx,name,-A.w/2+30,-A.h/2+92,{size:42,w:800,col:WC_DARK});lines.forEach((l,i)=>wc_hand(ctx,l,-A.w/2+30,-A.h/2+156+i*48,{size:34,w:600,col:WC_INK}));});
  ctx.restore();}
// the same cards, small, on the office's board below the chart: paper and a line or two each
function os_ansSmall(ctx){const [bx,by]=GV_OFF.board;for(let k=0;k<4;k++){const x=bx+28+k*92,y=by+290;ctx.save();ctx.translate(x+40,y+42);ctx.rotate(OS_ANSC.rot[k]);
  wc_panel(ctx,-40,-42,80,84,{kind:"card",seed:80+k});gv_lines(ctx,-26,-6,52,3,14,0.9);gv_pin(ctx,0,-34,GV.red,0.6);ctx.restore();}
  ctx.save();ctx.translate(bx+205,by+266);ctx.rotate(-0.012);wc_panel(ctx,-90,-18,180,36,{kind:"card",seed:79});gv_lines(ctx,-70,-2,140,1,0,0.9);ctx.restore();}
// the data team's board, in the room: the two reports' cards and Monday's between them, small, as they were left
function os_dataBoard(ctx){const [bx,by]=GV_DT.board;[[bx+8,by+42,160,124,0],[bx+178,by+66,80,92,1],[bx+268,by+42,160,124,0]].forEach(([x,y,w,h,mon],k)=>{
  wc_panel(ctx,x,y,w,h,{kind:"card",wash:mon?GV.gold:null,washA:0.35,seed:90+k});gv_pin(ctx,x+w/2,y+10,GV.red,0.7);
  if(mon)gv_lines(ctx,x+16,y+36,w-32,3,16,0.9);else{gv_lines(ctx,x+18,y+34,w-60,2,14,0.9);ctx.fillStyle=rgba(OS_NUM,0.75);ctx.fillRect(x+34,y+82,w-68,14);wc_tick(ctx,x+w-26,y+64,30,GV.green,1,4);}});}
// Jun's screen, close: the data team's tests on award. The first is the rule Mei and Jun agreed on Monday: it runs (run, 0 to 1), then
// passes (pass), and the agreement behind it lights gold (gold); the second has no test, as there's no agreed rule to test (row2).
function os_tests(ctx,run,pass,gold,row2){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Tests · award",q=>{const r1=y+262,r2=y+486,cx=x+96;
  if(gold>0)gv_tint(q,x+28,r1-86,w-56,160,GV.gold,0.7*gold);
  // the first test: a ring while it runs, a green tick once it passes
  if(pass>0)wc_tick(q,cx,r1-20,58,GV.green,pass,9);
  else{q.save();q.lineWidth=6;q.lineCap="round";q.strokeStyle=rgba(WC_MUTED,0.35);q.beginPath();q.arc(cx,r1-20,24,0,TAU);q.stroke();
    if(run>0){const a=run*TAU*1.6;q.strokeStyle=rgba(GV.cyanInk,0.9);q.beginPath();q.arc(cx,r1-20,24,a-1.8,a);q.stroke();}q.restore();}
  wc_T(q,"award counts microcredentials",x+160,r1-30,{w:700,size:38,col:WC_DARK});wc_T(q,"of 6 credit points or more",x+160,r1+22,{w:600,size:38,col:WC_INK});
  if(pass>0)withA(q,clamp(pass*2,0,1),()=>wc_badge(q,x+w-196,r1-22,"passed",{size:30,role:GV.green}));
  // the second: no test yet, only the question, dashed
  if(row2>0)withA(q,row2,()=>{q.save();q.lineWidth=5;q.setLineDash([9,9]);q.strokeStyle=rgba(WC_MUTED,0.7);q.beginPath();q.arc(cx,r2-20,24,0,TAU);q.stroke();q.restore();
    wc_T(q,"award mapped to the",x+160,r2-30,{w:700,size:38,col:WC_MUTED});wc_T(q,"government's definition",x+160,r2+22,{w:600,size:38,col:WC_MUTED});
    wc_badge(q,x+w-330,r2-22,"no agreed rule yet",{size:30,role:GV.red});});},{titleSize:32,barH:54});}

/* ---------- today: where does it run? ---------- */
// binder 12 opening on the desk, from above (u, 0 to 1): its cover lies over the right-hand page, then swings over the rings to the left
function os_cover12(ctx){const B=OS_OPEN;ctx.drawImage(wc_kept("cover12",W,H,q=>{const col=os_bindCol(11),x=B.mid-40,w=B.x+B.w-x;
    wc_wash(q,wc_rrPts(x,B.y,w,B.h,18),col,{kind:"cover",lw:1.6,seed:24});wc_flat(q,wc_rect(x,B.y+8,54,B.h-16),wc_dim(col,0.2),1,"spine");
    wc_wash(q,wc_rect(x+w/2-130,B.y+250,300,190),WC_CARD,{kind:"page",lw:1.3,seed:25});}),0,0);
  const cx=B.mid-40+(B.x+B.w-B.mid+40)/2+20;wc_T(ctx,"12",cx,B.y+352,{w:800,size:84,align:"center",col:WC_DARK});
  wc_T(ctx,"Data definitions",cx,B.y+414,{w:600,size:30,align:"center",col:WC_MUTED});}
function os_opening12(ctx,u){const B=OS_OPEN;if(u>=1)return os_open12(ctx);
  const c=Math.cos(Math.PI*clamp(u,0,1));ctx.save();ctx.beginPath();ctx.rect(B.mid-46,0,W,H);ctx.clip();os_open12(ctx,{text:c>0?clamp((0.82-c)/0.67,0,1):1});ctx.restore();
  ctx.save();ctx.translate(B.mid,0);ctx.scale(Math.max(0.02,Math.abs(c)),1);ctx.translate(-B.mid,0);
  if(c>0)os_cover12(ctx);else{ctx.beginPath();ctx.rect(0,0,B.mid-46,H);ctx.clip();os_open12(ctx,{text:0});}ctx.restore();}
// a highlighter lying on the desk, from above: a pale body, the cap and the felt tip in its colour; kept per colour
function os_marker(ctx,x,y,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(wc_kept("marker|"+col,300,100,q=>{
    q.save();q.filter="blur(5px)";q.fillStyle="rgba(70,50,30,0.26)";q.fillRect(30,46,236,30);q.restore();
    wc_wash(q,wc_rrPts(26,30,196,42,14),mix(col,[255,255,255],0.6),{kind:"thing",lw:1.3,seed:col[0]});
    wc_wash(q,wc_rrPts(204,27,70,48,12),col,{kind:"thing",lw:1.3,seed:col[1]});wc_wash(q,[[28,40],[8,46],[8,56],[28,62]],wc_dim(col,0.1),{kind:"thing",lw:1.1,seed:col[2]});}),-150,-50);
  ctx.restore();}
// policy 12's page, close, as he goes through it line by line: the paper filling the frame, the holes for the rings down the left
function os_paintPolicy(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.paper,{kind:"paper",line:false,seed:93});
  for(const y of [170,540,910])wc_wash(ctx,wc_ell(96,y,24,24,24),wc_dim(GV.oak,0.08),{kind:"thing",lw:1.3,seed:y});
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(255,250,236,0)");g.addColorStop(1,"rgba(150,130,100,0.1)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
// what policy 12 says, line by line; where each line runs (0: in the work, green; 1: a decision someone owns, gold; 2: it can go, grey),
// and what Yusuf writes beside it
const OS_LINES=[["12.1","Each term has a named owner."],["12.2","Each term used in a report is in the glossary."],["12.3","Terms about people are marked as personal data."],
  ["12.4","Reports count by the glossary's definitions."],["12.5","Each term's owner decides its definition,","and how it maps to the government's."],
  ["12.6","Each decision is written down with the term."],["12.7","Staff take care to use terms correctly."]];
const OS_WHERE=[0,0,0,0,1,1,2],OS_NOTES=["a required field","a check","a tag","a test","award: Mei decides","in the glossary",null];
const OS_HIC=[GV.green,GV.gold,GV.grey],OS_HINK=[GV.greenInk,GV.goldInk,GV.greyInk],OS_KEY=["runs in the work","a decision someone owns","can go"];
const OS_PG={x:300,tx:384,y0:290,dy:78,lh:44,size:34,note:1350};
// a highlighter's stroke behind a line of text, as long as the text, drawn from the left as p goes from 0 to 1; kept per colour.
// h: how tall it is (a line of the page, or a swatch in his key)
function os_hiStroke(ctx,x,y,w,col,p,seed,h=64){if(p<=0)return;const c=wc_kept("hiStroke|"+col+"|"+seed,1200,70,q=>wc_wash(q,wc_resample(wc_rect(8,10,1180,48),12),col,{kind:"swatch",line:false,a:0.5,seed}));
  const top=y-12-h/2;ctx.save();ctx.beginPath();ctx.rect(x-12,top-6,(w+24)*clamp(p,0,1),h+12);ctx.clip();ctx.globalCompositeOperation="multiply";ctx.drawImage(c,x-12,top,w+24,h);ctx.restore();}
// the page: its heading, the lines, a stroke behind each as it's sorted (hi(k), 0 to 1), Yusuf's note beside it (note(k)), his key at the
// top (key(j)), and the line that can go struck through (strike)
function os_policy(ctx,hi,note,key,strike){const P=OS_PG;wc_T(ctx,"Policy 12 · Data definitions",P.x,128,{w:800,size:50,col:WC_DARK});
  wc_T(ctx,"Business terms are defined consistently across the organisation.",P.x,188,{w:600,size:30,col:WC_MUTED});
  let y=P.y0;OS_LINES.forEach((L,k)=>{const rows=L.slice(1),c=OS_WHERE[k],u=hi(k),n=rows.length;
    rows.forEach((s,i)=>os_hiStroke(ctx,P.tx,y+i*P.lh,tw(ctx,s,P.size,600),OS_HIC[c],clamp(u*n-i,0,1),40+k*3+i));
    wc_T(ctx,L[0],P.x,y,{w:700,size:P.size,col:WC_MUTED});rows.forEach((s,i)=>wc_T(ctx,s,P.tx,y+i*P.lh,{w:600,size:P.size,col:c===2&&strike>0.5?WC_MUTED:WC_INK}));
    if(c===2&&strike>0){const w=tw(ctx,rows[0],P.size,600)*easeCam(clamp(strike,0,1));ctx.save();ctx.strokeStyle=rgba(GV.greyInk,0.9);ctx.lineWidth=4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(P.tx-8,y-11);ctx.quadraticCurveTo(P.tx+w/2,y-15,P.tx-8+w+16,y-10);ctx.stroke();ctx.restore();}
    if(OS_NOTES[k])wc_hand(ctx,OS_NOTES[k],P.note,y+(n-1)*P.lh/2,{size:36,w:700,col:OS_HINK[c],p:note(k)});y+=P.dy+(n-1)*P.lh;});
  // the key: a stroke of each colour, and what it means, in his hand
  OS_KEY.forEach((s,j)=>{const u=key(j);if(u<=0)return;const ky=84+j*44;os_hiStroke(ctx,P.note,ky,44,OS_HIC[j],clamp(u*2,0,1),70+j,34);
    wc_hand(ctx,s,P.note+70,ky,{size:30,w:700,col:OS_HINK[j],p:clamp(u*2-0.6,0,1)});});}

/* ---------- today: where decisions enter ---------- */
// a warm light coming up on something (a, 0 to 1), as on the shelf when he listened
function os_warm(ctx,cx,cy,r,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="soft-light";wc_glowAt(ctx,cx,cy+50,r*1.1,[255,190,90],0.9*a);
  ctx.globalCompositeOperation="screen";wc_glowAt(ctx,cx,cy,r,[255,222,160],0.42*a);ctx.restore();}
// the steps of the data team's loop where a decision enters: the step, the words that name it, and what Yusuf writes there
const OS_PINS=[[0,"a term",["a term"]],[1,"a classification",["a classification"]],[3,"an owner",["an owner","a contract"]],[4,"a rule",["a rule"]],
  [7,"an approval",["an approval"]],[9,"a version",["a version"]]];
// the loop going round on the poster (x,y,w,h), from the first step (u 0) past the last (u 0.9) and back to the first (u 1): a firmer
// line along it, and each step darkening, with a little lift, as the line reaches it
function os_loopRun(ctx,x,y,w,h,u){if(u<=0)return;const k=w/1260,cx=x+w/2,cy=y+h*450/810,a0=-Math.PI/2,gap=0.13;
  ctx.save();ctx.strokeStyle=rgba(wc_dim(GV_LOOPC,0.15),0.8);ctx.lineWidth=6*k;ctx.lineCap="round";
  for(let i=0;i<10;i++){const s=a0+i/10*TAU+gap,e=Math.min(a0+(i+1)/10*TAU-gap,a0+u*TAU);if(e<=s)break;ctx.beginPath();ctx.ellipse(cx,cy,330*k,270*k,0,s,e);ctx.stroke();}
  ctx.restore();
  for(let i=0;i<10;i++){const v=clamp((u-i/10)*12,0,1);if(v<=0)break;const [sx,sy]=gv_loopPos(i,x,y,w,h),r=30*k*(1+0.14*Math.sin(Math.PI*clamp(v*1.4,0,1)));
    ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV_LOOPC,0.25),0.6*v);ctx.beginPath();ctx.arc(sx,sy,r,0,TAU);ctx.fill();ctx.restore();}}
// at step i of the poster (x,y,w,h): a gold pin pushed in at its edge (u), a gold ring drawn round it (ring), and what Yusuf writes
// there, a line at a time (lab(j), 0 to 1): under the step's name or, for the first step, inside the loop
function os_goldPin(ctx,i,x,y,w,h,u,ring,lines,lab){const k=w/1260,[sx,sy]=gv_loopPos(i,x,y,w,h),c=Math.cos(-Math.PI/2+i/10*TAU);
  if(ring>0){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=Math.max(2,5*k);ctx.lineCap="round";ctx.beginPath();
    ctx.arc(sx,sy,38*k,-Math.PI/2,-Math.PI/2+TAU*easeCam(clamp(ring,0,1)));ctx.stroke();ctx.restore();}
  if(u>0){const d=easeCam(clamp(u,0,1));withA(ctx,clamp(u*3,0,1),()=>gv_pin(ctx,sx+26*k,sy-30*k-(1-d)*40*k,GV.gold,lerp(2.4,1.6,d)*k));}
  if(!lab)return;const top=i===0,al=top?"center":c>0?"left":"right",nx=top?sx:sx+(c>0?1:-1)*(i===1||i===9?100:46)*k,ny=top?sy+80*k:sy+56*k;
  lines.forEach((s,j)=>{const p=lab(j);if(p>0)wc_hand(ctx,s,nx,ny+j*38*k,{size:32*k,w:700,align:al,col:GV.goldInk,p});});}

/* ---------- today: the films to come ---------- */
// which of the shelf's binders stand for the nine films on what governance needs; he takes the first
const OS_NINE=[1,5,8,14,18,21,25,28,31];
// a binder held in both hands, its label saying what it's about (in the figure's units, like the series' heldBinder)
function os_heldTitled(lines,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  const w=168,h=214;cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+16,-h/2+26,w-32,112,10);cx.fill();
  cx.fillStyle=rgba(mix(col,[0,0,0],0.5),1);cx.textAlign="center";cx.font=font(800,32);lines.forEach((s,i)=>cx.fillText(s,0,-h/2+74+i*38-(lines.length-1)*6));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);};}
// the films on the tools, on the data team's board: a card each, with its number, the tools' logos and its title
const OS_TOOLS=[["Governed in dbt",["dbt"]],["Governed in Unity Catalog",["databricks"]],["Meaning on the platform",["databricks"]],
  ["Quality on the platform",["dbt","databricks"]],["Products in open formats",["databricks"]],["The marketplace",["databricks"]]];
const OS_TC={w:410,h:236,x:[505,960,1415],y:[440,712],rot:[-0.018,0.012,-0.008,0.016,-0.012,0.008]};
function os_toolsHead(ctx,u){if(u<=0)return;ctx.save();ctx.translate(960,192);ctx.rotate(0.01);withA(ctx,clamp(u*2.5,0,1),()=>{wc_panel(ctx,-250,-60,500,120,{kind:"card",seed:63});
  gv_pin(ctx,0,-46,GV.red,1.2);wc_hand(ctx,"With the tools",0,20,{size:52,w:700,align:"center",col:WC_INK,p:clamp(u*1.6-0.3,0,1)});});ctx.restore();}
// a title in up to two lines no wider than mw, the break at the last space that fits
function os_wrap(ctx,s,size,mw){if(tw(ctx,s,size,800)<=mw)return[s];const ws=s.split(" ");for(let i=ws.length-1;i>0;i--){const a=ws.slice(0,i).join(" ");
  if(tw(ctx,a,size,800)<=mw)return[a,ws.slice(i).join(" ")];}return[s];}
function os_toolCard(ctx,k,u){if(u<=0)return;const T=OS_TC,[s,tools]=OS_TOOLS[k],e=easeCam(clamp(u,0,1)),sc=lerp(1.12,1,e),w=T.w,h=T.h;
  ctx.save();ctx.translate(T.x[k%3],T.y[Math.floor(k/3)]-14*(1-e));ctx.rotate(T.rot[k]);ctx.scale(sc,sc);withA(ctx,clamp(u*2.5,0,1),()=>{
    wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:110+k});gv_pin(ctx,0,-h/2+18,GV.red,1.1);
    wc_wash(ctx,wc_ell(-w/2+56,-h/2+72,28,28,24),wc_lit(GV.cyanInk,0.25),{kind:"thing",lw:1.2,seed:120+k});
    wc_T(ctx,String(k+14),-w/2+56,-h/2+83,{w:800,size:28,align:"center",col:[255,255,255]});
    let lx=-w/2+104;tools.forEach(id=>{lx+=logo(ctx,id,lx,-h/2+48,48)+18;});
    os_wrap(ctx,s,36,w-64).forEach((l,i,a)=>wc_T(ctx,l,-w/2+32,-h/2+(a.length>1?160:178)+i*46,{w:800,size:36,col:WC_DARK}));});ctx.restore();}
// the films on governance as a capability, on Yusuf's board: a card each, with its number, a pencil sign where the tools' cards
// have logos, and its title in two lines
const OS_CAP=[["A capability,","not a project"],["Who does what,","end to end"],["Where each","piece lives"]];
const OS_CC={y:600,rot:[0.014,-0.012,0.01]};
function os_capHead(ctx,u){if(u<=0)return;ctx.save();ctx.translate(960,326);ctx.rotate(-0.008);withA(ctx,clamp(u*2.5,0,1),()=>{wc_panel(ctx,-380,-60,760,120,{kind:"card",seed:66});
  gv_pin(ctx,0,-46,GV.red,1.2);wc_hand(ctx,"Governance as a capability",0,20,{size:52,w:700,align:"center",col:WC_INK,p:clamp(u*1.6-0.3,0,1)});});ctx.restore();}
// the signs: a capability above the three it holds; three steps, end to end; a home, and its copy made one way
function os_capSign(ctx,k,x,y){ctx.save();ctx.translate(x,y);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.lineCap="round";
  const ink=rgba(WC_PENCIL,0.85),fill=rgba(wc_lit(GV.gold,0.55),1);
  const box=(bx,by,bw,bh,copy)=>{rr(ctx,bx,by,bw,bh,4);ctx.fillStyle=copy?rgba(WC_CARD,1):fill;ctx.fill();ctx.setLineDash(copy?[6,5]:[]);ctx.strokeStyle=ink;ctx.stroke();ctx.setLineDash([]);};
  const arrow=(x0,x1,yy)=>{ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x1,yy);ctx.moveTo(x1-8,yy-6);ctx.lineTo(x1,yy);ctx.lineTo(x1-8,yy+6);ctx.strokeStyle=ink;ctx.stroke();};
  if(k===0){box(0,0,112,18);for(let i=0;i<3;i++)box(i*39,26,34,22);}
  else if(k===1){for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(12+i*48,24,11,0,TAU);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=ink;ctx.stroke();if(i<2)arrow(28+i*48,44+i*48,24);}}
  else{box(0,4,44,40);arrow(52,82,24);box(90,4,44,40,true);}
  ctx.restore();}
function os_capCard(ctx,k,u){if(u<=0)return;const T=OS_TC,lines=OS_CAP[k],e=easeCam(clamp(u,0,1)),sc=lerp(1.12,1,e),w=T.w,h=T.h;
  ctx.save();ctx.translate(T.x[k],OS_CC.y-14*(1-e));ctx.rotate(OS_CC.rot[k]);ctx.scale(sc,sc);withA(ctx,clamp(u*2.5,0,1),()=>{
    wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:130+k});gv_pin(ctx,0,-h/2+18,GV.red,1.1);
    wc_wash(ctx,wc_ell(-w/2+56,-h/2+72,28,28,24),wc_lit(GV.goldInk,0.1),{kind:"thing",lw:1.2,seed:140+k});
    wc_T(ctx,String(k+11),-w/2+56,-h/2+83,{w:800,size:28,align:"center",col:[255,255,255]});
    os_capSign(ctx,k,-w/2+104,-h/2+48);
    lines.forEach((l,i)=>wc_T(ctx,l,-w/2+32,-h/2+160+i*46,{w:800,size:36,col:WC_DARK}));});ctx.restore();}

const WC_PLACES={market:os_paintMarket,hall:os_paintHall,exchange:os_paintExchange,shop:os_paintShop,stamp:os_paintStamp,campus:gv_paintCampus,office:gv_paintOffice,
  boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),desk:gv_paintDesk,floor:gv_paintFloor,planning:gv_paintPlanning,registrar:gv_paintRegistrar,data:gv_paintData,
  boardData:c=>gv_paintBoardClose(c,GV_ROOM.data),screen:c=>gv_paintScreenDesk(c,GV_ROOM.data),platform:gv_paintPlatform,poster:gv_paintPosterClose,page:os_paintPage,
  policy:os_paintPolicy};
