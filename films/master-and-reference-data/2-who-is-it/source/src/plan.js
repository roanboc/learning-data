/* ===== Who is it?: the places and the pictures =====
   The places are painted once and kept (post.js): Artigat in 1548, a courtroom in 1560, the campus today, the paper with a little
   sky and land for the chapters that explain (and a second one), and Mei's office. The pictures are the film's own things: the
   people of Artigat, walking and standing (the real Martin with a wooden leg and a crutch), what the village knew of Martin and the
   witnesses' record, the judges and their bench; the two shelves of master and reference data; the master record and its stamp;
   the university's systems, their records and the pairs a duplicate check proposes; records side by side, the score's gauge and
   the steward's decision cards; the AI helper's note; a balance of a false merge against a missed match; hospital wristbands; and
   the dbt and Databricks cards. Every name starts with m2_ (this film) or M2_. */

// the logos (dbt, Databricks) and the Vietnamese letters (fonts.js) load with everything else before the film starts: the series'
// prepAssets (post.js) doesn't load them
const m2_prep0=prepAssets;prepAssets=async function(){await Promise.all([m2_prep0(),loadLogos(),m2_fontsVi()]);};

/* ---------- the places ---------- */
// Artigat: the near ground, where Martin's house stands and the road runs; the rise the village stands on; the far hills
const M2_VG=x=>846+9*Math.sin(x/260+0.6)+4*Math.sin(x/90);
const M2_VH=x=>648+16*Math.sin(x/240+1.1)+6*Math.sin(x/97);
const M2_VF=x=>584+12*Math.sin(x/310)+5*Math.sin(x/120+2);
// the road from Martin's door, out of the village to the right: the way he leaves, and the way a man comes back
const M2_ROAD=wc_smooth([[600,882],[800,886],[1040,880],[1300,870],[1560,862],[1820,856],[2080,852]],8);
// a mountain range: peaks along a line, washed in blue-grey, with snow left as paper on the higher peaks
function m2_range(ctx,y0,amp,col,depth,seed,snow){const R=wc_rng(seed),pts=[[-60,y0+40]],peaks=[];let x=-60;
  while(x<W+60){const w=110+R()*180,h=amp*(0.45+R()*0.55);pts.push([x+w*0.5,y0-h]);peaks.push([x+w*0.5,y0-h,w,h]);pts.push([x+w,y0-h*0.3*R()]);x+=w;}
  pts.push([W+60,y0+40],[W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,{depth,kind:"range",line:false});
  if(snow)for(const [px,py,w,h] of peaks){if(h<amp*0.62)continue;const s=h*0.3;
    wc_wash(ctx,[[px,py],[px+w*0.14,py+s],[px+w*0.05,py+s*0.72],[px-w*0.03,py+s*1.0],[px-w*0.14,py+s*0.8]],[246,248,252],{depth:1,kind:"snow",line:false,flat:true,a:0.9});}}
// a poplar, as they grow along the rivers of the south: tall and narrow
function m2_poplar(ctx,x,y,h,depth){wc_wash(ctx,wc_rect(x-h*0.016,y-h*0.2,h*0.032,h*0.2),WCP.trunk,{depth,kind:"trunk",line:false});
  wc_wash(ctx,[wc_ell(x,y-h*0.56,h*0.085,h*0.42,28),wc_ell(x-h*0.035,y-h*0.48,h*0.065,h*0.28,22),wc_ell(x+h*0.035,y-h*0.64,h*0.06,h*0.28,22)],[124,166,98],{depth,kind:"tree"});}
// a stone house of the south, its long side to us: walls of rubble stone in ochre, a low roof of curved tiles, small windows, a door
function m2_house(ctx,x,y,w,h,k,depth,o){o=o||{};const wall=o.wall||[234,208,166],roof=o.roof||[198,108,76],rh=Math.max(14,w*0.15);
  wc_part(ctx,wc_rect(x,y-h,w,h),wall,depth);wc_part(ctx,[[x-10*k,y-h+3],[x+w+10*k,y-h+3],[x+w-16*k,y-h-rh],[x+16*k,y-h-rh]],roof,depth);
  if(depth>0.6){ctx.save();ctx.strokeStyle=rgba(wc_dim(roof,0.35),0.32);ctx.lineWidth=1.6;for(let i=x+10;i<x+w-6;i+=12*k){const t=(i-x)/w;ctx.beginPath();ctx.moveTo(i,y-h+2);ctx.lineTo(lerp(x+16*k,x+w-16*k,t),y-h-rh+3);ctx.stroke();}ctx.restore();}
  (o.wins||[[0.2,0.45]]).forEach(([fx,fy])=>{const ww=Math.max(8,w*0.09),wh=ww*1.25;wc_flat(ctx,wc_rect(x+w*fx-ww/2,y-h+h*fy-wh/2,ww,wh),wc_dim(wall,0.55),depth,"window");});
  if(o.door)wc_wash(ctx,wc_rect(x+w*o.door-w*0.07,y-h*0.56,w*0.14,h*0.56),[132,90,62],{depth,kind:"door",lw:1.5});}
// a village church of the south: a nave, and at its west end a bell wall, a flat gable pierced for two bells
function m2_church(ctx,x,y,k,depth){const st=[228,206,170],roof=[192,104,74];
  wc_part(ctx,wc_rect(x+96*k,y-104*k,220*k,104*k),st,depth);wc_part(ctx,[[x+88*k,y-102*k],[x+324*k,y-102*k],[x+306*k,y-132*k],[x+106*k,y-132*k]],roof,depth);
  wc_flat(ctx,wc_arched(x+170*k,y-82*k,16*k,40*k),wc_dim(st,0.5),depth,"window");wc_flat(ctx,wc_arched(x+250*k,y-82*k,16*k,40*k),wc_dim(st,0.5),depth,"window");
  wc_part(ctx,[[x,y],[x,y-196*k],[x+24*k,y-196*k],[x+24*k,y-214*k],[x+52*k,y-244*k],[x+80*k,y-214*k],[x+80*k,y-196*k],[x+104*k,y-196*k],[x+104*k,y]],st,depth);
  for(const bx of [14,58]){wc_flat(ctx,wc_arched(x+bx*k,y-186*k,32*k,46*k),wc_dim(st,0.6),depth,"opening");wc_flat(ctx,[[x+(bx+9)*k,y-152*k],[x+(bx+23)*k,y-152*k],[x+(bx+20)*k,y-166*k],[x+(bx+12)*k,y-166*k]],[150,110,60],depth,"bell");}
  wc_wash(ctx,wc_arched(x+36*k,y-58*k,32*k,58*k),[132,90,62],{depth,kind:"door",lw:1.4});}
// Artigat, 1548: the Pyrenees far off, fields and hills, the village on its rise with its bell wall, the river and its poplars, and in
// front, Martin's house and the road out of the village
function m2_village(ctx){const P=WCP;wc_sky(ctx,600,12,{sun:[1500,150],clouds:4,cx:240,cw:1460,cy:60,ch:150});
  m2_range(ctx,526,176,[150,164,198],0.06,7,true);m2_range(ctx,556,84,[140,162,170],0.14,9,false);
  wc_land(ctx,M2_VF,P.far,0.24);wc_fieldStrips(ctx,M2_VF,4,54,4,[P.far,P.field,[208,206,150]],0.26,5);
  wc_treeRow(ctx,x=>M2_VF(x)+2,40,620,54,30,0.26,13);wc_treeRow(ctx,x=>M2_VF(x)+2,1600,1900,50,28,0.26,15);
  wc_land(ctx,M2_VH,P.mid,0.45);
  // the village on its rise: houses with low tiled roofs round the church
  wc_contact(ctx,860,1760,M2_VH(1300)+6,0.45,0.18);
  for(const [x,w,h] of [[880,96,62],[1440,124,70],[1590,104,60]])m2_house(ctx,x,M2_VH(x+w/2)+6,w,h,0.7,0.42);
  m2_church(ctx,1090,M2_VH(1250)+6,0.86,0.44);
  for(const [x,w,h] of [[980,120,70],[1372,140,74],[1690,120,64]])m2_house(ctx,x,M2_VH(x+w/2)+12,w,h,0.74,0.46,{wins:[[0.25,0.45],[0.7,0.45]]});
  wc_roundTree(ctx,1830,M2_VH(1830)+10,120,0.46);wc_roundTree(ctx,860,M2_VH(860)+10,110,0.46,P.leaf2);
  // the river below the village, and its poplars
  const RIV=wc_smooth([[-60,736],[300,728],[640,744],[980,732],[1320,746],[1700,730],[1980,738]],8);wc_wash(ctx,wc_band(RIV,18,30),P.water,{depth:0.52,kind:"water",line:false});
  for(const [x,h] of [[700,190],[748,226],[796,176],[1180,200],[1226,168],[1520,186],[1568,214],[1880,180]])m2_poplar(ctx,x,744,h,0.54);
  // the near ground, the road, and Martin's house
  wc_land(ctx,M2_VG,P.near,0.82);wc_wash(ctx,wc_band(M2_ROAD,74,96),P.road,{depth:0.8,kind:"road",line:false});
  wc_contact(ctx,90,650,M2_VG(370)+6,0.86,0.3);
  m2_house(ctx,100,M2_VG(370)+8,540,272,1.4,0.86,{door:0.72,wins:[[0.2,0.42],[0.42,0.42]]});
  wc_wash(ctx,wc_rect(130,M2_VG(200)-40,120,26),[196,186,170],{depth:0.86,kind:"trim",lw:1.4});
  wc_tufts(ctx,M2_VG,0,1900,60,0.95,8);
  const R=wc_rng(5);for(let i=0;i<40;i++){const x=R()*1900,y=M2_VG(x)+96+R()*(H-M2_VG(x)-96),r=3+R()*3+(y-930)/60;if(x>560&&y<930)continue;
    wc_wash(ctx,wc_ell(x,y,r,r*0.9,12),[P.flowerA,P.flowerB,P.flowerC][i%3],{kind:"dab",flat:true});}}
// a courtroom, 1560: warm stone, two tall windows, a blue hanging behind the judges, their dais, a tiled floor (the bench is drawn over
// the judges, by m2_bench)
function m2_court(ctx){const stone=[230,210,176];ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,820),stone,{kind:"plaster",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(stone,0.3),0.22);ctx.lineWidth=2;for(let y=70;y<760;y+=62){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y+3);ctx.stroke();
    for(let x=((y/62)%2)*90;x<W;x+=180){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+62);ctx.stroke();}}ctx.restore();
  for(const wx of [150,1590]){wc_glowAt(ctx,wx+90,360,300,[255,240,200],0.3);wc_wash(ctx,wc_arched(wx-14,104,208,536),wc_dim(stone,0.12),{kind:"trim",lw:1.6});
    wc_wash(ctx,wc_arched(wx,118,180,510),[204,218,232],{kind:"window",lw:1.6});
    ctx.save();wc_tr(ctx,wc_arched(wx,118,180,510));ctx.clip();ctx.strokeStyle=rgba([110,110,120],0.35);ctx.lineWidth=1.6;
    for(let i=-12;i<12;i++){ctx.beginPath();ctx.moveTo(wx+i*30,118);ctx.lineTo(wx+i*30+300,628);ctx.moveTo(wx+i*30+180,118);ctx.lineTo(wx+i*30-120,628);ctx.stroke();}ctx.restore();}
  wc_wash(ctx,wc_rect(540,150,840,330),[70,88,150],{kind:"cloth",lw:1.6});
  ctx.save();ctx.fillStyle=rgba([226,190,90],0.7);for(let j=0;j<5;j++)for(let i=0;i<10;i++){const x=586+i*84+(j%2)*42,y=196+j*62;ctx.beginPath();ctx.arc(x,y,4.5,0,TAU);ctx.fill();}ctx.restore();
  wc_wash(ctx,wc_rect(440,592,1040,150),[128,92,66],{kind:"build",lw:1.6});wc_wash(ctx,wc_rect(430,582,1060,20),[110,78,56],{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(-40,738,W+80,400),[220,180,142],{kind:"ground",line:false});
  ctx.save();ctx.strokeStyle=rgba([150,110,84],0.35);ctx.lineWidth=2;for(let i=-16;i<=16;i++){ctx.beginPath();ctx.moveTo(960+i*70,742);ctx.lineTo(960+i*230,1090);ctx.stroke();}
  for(let j=0;j<7;j++){const y=742+j*j*7.5+j*12;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.restore();}
// the campus today, as film 1 paints it: the old building and its glass wing, a lawn, terraced houses across the street, a lamp
const M2_LAWN=x=>664+5*Math.sin(x/300);
function m2_campus(ctx){const P=WCP;wc_sky(ctx,716,2,{sun:[1560,170]});
  wc_skyline(ctx,624,P.city,0.1,5);wc_treeRow(ctx,()=>640,-40,1980,58,70,0.24,21,P.leaf2);wc_land(ctx,M2_LAWN,P.lawn,0.42);
  wc_contact(ctx,140,770,668,0.46,0.22);wc_quad(ctx,150,668,0.46,0.62);wc_glassWing(ctx,762,668,150,170,0.48);
  [[1210,P.plaster],[1410,P.brickHouse,P.blueDoor],[1610,P.blueHouse],[1810,P.plaster]].forEach(([x,c,d])=>wc_terrace(ctx,x,742,232,c,0.56,{k:0.86,door:d}));
  wc_wash(ctx,[[1180,742],[W+60,742],[W+60,770],[1170,770]],P.hedge,{depth:0.6,kind:"hedge",lw:1.5});
  wc_roundTree(ctx,70,700,250,0.5);wc_roundTree(ctx,990,690,226,0.5,P.leaf2);wc_roundTree(ctx,1120,706,196,0.52);
  wc_wash(ctx,[[-60,782],[W+60,770],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.72,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth([[540,668],[560,720],[620,800],[740,900],[880,1090]],8),30,240),wc_lit(P.paving,0.08),{depth:0.62,kind:"path",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.14),0.55);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=800+i*i*5;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-10);ctx.stroke();}
  for(let i=-10;i<24;i++){ctx.beginPath();ctx.moveTo(960+i*54,782);ctx.lineTo(960+i*190,1080);ctx.stroke();}ctx.restore();
  wc_lamp(ctx,1186,846,300,0.72);}
// paper, with a little sky and a strip of land, for the chapters that explain; a second, for the third pair and the hospital
function m2_plain(ctx){wc_sky(ctx,836,3,{clouds:3});wc_land(ctx,x=>826+16*Math.sin(x/320+1),WCP.far,0.35,{line:false});wc_land(ctx,x=>882+10*Math.sin(x/240),WCP.near,0.75,{line:false});}
function m2_plainB(ctx){wc_sky(ctx,846,7,{clouds:4,cx:120,cw:1680});wc_land(ctx,x=>842+20*Math.sin(x/380+2),WCP.far,0.35,{line:false});wc_land(ctx,x=>898+12*Math.sin(x/260+1),WCP.near,0.75,{line:false});}
// Mei's office: a warm wall, a tall window onto the campus, a floor
function m2_office(ctx){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,900),P.wallIn,{kind:"plaster",line:false});wc_wash(ctx,wc_rect(-40,858,W+80,260),P.floor,{kind:"ground",line:false});
  wc_wash(ctx,wc_rect(-40,846,W+80,18),wc_dim(P.wallIn,0.14),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.beginPath();ctx.rect(72,112,436,560);ctx.clip();wc_sky(ctx,560,4,{clouds:2,cx:80,cw:380,cy:150,ch:120});
  wc_land(ctx,x=>600+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_part(ctx,wc_rect(330,330,70,270),WCP.stone,0.4);wc_part(ctx,[[322,330],[408,330],[365,250]],WCP.slate,0.4);
  wc_roundTree(ctx,150,640,220,0.5);wc_roundTree(ctx,460,650,190,0.5,P.leaf2);ctx.restore();
  for(const r of [wc_rect(60,100,460,16),wc_rect(60,100,16,584),wc_rect(504,100,16,584),wc_rect(282,100,16,584),wc_rect(60,384,460,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(40,676,500,22),wc_dim(P.wallIn,0.1),{kind:"trim",lw:1.5});}
const WC_PLACES={village:m2_village,court:m2_court,campus:m2_campus,plain:m2_plain,plainB:m2_plainB,office:m2_office};
// a place, under the camera
function m2_place(ctx,key){ctx.drawImage(wc_place(key),0,0,W,H);}
// a veil of paper over the whole frame, so what's drawn after it stands out
function m2_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}

/* ---------- 1. the people of Artigat, 1548 to 1560 ---------- */
// who they are: their clothes, hair and beards. Martin, in 1548, and the man who came back as him in 1556, dress alike: that's the
// point. The real Martin comes back in 1560 a soldier, in a cloak, with a wooden leg and a crutch.
const M2_FOLK={
  martin:{coat:[172,98,62],hose:[100,78,64],cap:[60,54,62],hair:[46,34,30],beard:[52,40,34],skin:[226,184,148]},
  arnaud:{coat:[166,92,58],hose:[96,76,62],cap:[60,54,62],hair:[42,32,28],beard:[48,36,30],full:1,skin:[222,180,144]},
  real:{coat:[98,110,132],cloak:1,hose:[90,82,76],hat:[72,64,60],hair:[54,42,36],beard:[62,50,42],full:1,skin:[214,172,136],peg:1},
  bertrande:{woman:1,dress:[62,102,112],apron:[244,238,224],coif:[248,246,240],skin:[230,192,160],hair:[60,44,36]},
  uncle:{coat:[122,96,72],long:1,hose:[82,72,64],cap:[100,90,84],hair:[186,182,178],beard:[196,192,188],full:1,skin:[220,178,142]}};
// they're painted 440 px tall, in watercolour with a pencil line, and drawn at the size each shot needs; units are hundredths of a figure
const M2_FH=440,M2_FK=M2_FH/100,M2_SKIN_LINE=[120,84,70];
// a tapered limb along a few points, rounded at its far end
function m2_limb(pts,w0,w1){const p=pts.length>2?wc_smooth(pts,6):pts,L=[],R=[];for(let i=0;i<p.length;i++){const a=p[Math.max(0,i-1)],b=p[Math.min(p.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,w=lerp(w0,w1,i/(p.length-1))/2;
  L.push([p[i][0]-dy/l*w,p[i][1]+dx/l*w]);R.push([p[i][0]+dy/l*w,p[i][1]-dx/l*w]);}
  const e=p[p.length-1],q=p[p.length-2],an=Math.atan2(e[1]-q[1],e[0]-q[0]),cap=[];for(let k=1;k<6;k++){const a=an+Math.PI/2-k/6*Math.PI;cap.push([e[0]+Math.cos(a)*w1/2,e[1]+Math.sin(a)*w1/2]);}
  return L.concat(cap,R.reverse());}
// paint a part, given in units about the figure's feet; seeds are fixed per part, so a figure painted again looks the same
function m2_fp(q,pts,col,kind,seed,o){o=o||{};const k=M2_FK,ox=q.__ox,oy=q.__oy;wc_wash(q,pts.map(p=>[ox+p[0]*k,oy+p[1]*k]),col,Object.assign({kind,seed,depth:1,lw:1.5},o));}
const m2_fe=(cx,cy,rx,ry,n)=>wc_ell(cx,cy,rx,ry,n||22);
// a leg, from the hip, swung forward by a and bent at the knee by b; each segment is painted upright and turned into place, so its
// watercolour doesn't change from one step to the next
function m2_leg(q,f,hip,a,b,far,peg){const k=M2_FK,hose=far?wc_dim(f.hose,0.22):f.hose;q.save();q.translate(q.__ox+hip[0]*k,q.__oy+hip[1]*k);q.rotate(-a);
  wc_wash(q,m2_limb([[0,0],[0,23*k]],8*k,5.6*k),hose,{kind:"limb",seed:far?31:33,depth:1,lw:1.4});q.translate(0,23*k);q.rotate(b);
  if(peg){wc_wash(q,m2_limb([[0,-1*k],[0,22*k]],4.8*k,2.6*k),[156,116,80],{kind:"limb",seed:35,depth:1,lw:1.4});q.restore();return;}
  wc_wash(q,m2_limb([[0,-1*k],[0,21*k]],5.8*k,4.4*k),hose,{kind:"limb",seed:far?37:39,depth:1,lw:1.4});
  wc_wash(q,wc_ell(2.4*k,22*k,4.6*k,2.2*k,18),[54,46,44],{kind:"thing",seed:41,depth:1,lw:1.2});q.restore();}
// an arm, from the shoulder, swung by a and bent at the elbow by b, with a hand
function m2_arm(q,f,sh,a,b,far,col){const k=M2_FK,c=far?wc_dim(col,0.18):col;q.save();q.translate(q.__ox+sh[0]*k,q.__oy+sh[1]*k);q.rotate(-a);
  wc_wash(q,m2_limb([[0,0],[0,15*k]],6.6*k,5.2*k),c,{kind:"arm",seed:far?43:45,depth:1,lw:1.4});q.translate(0,15*k);q.rotate(-b);
  wc_wash(q,m2_limb([[0,-1*k],[0,12*k]],5.2*k,4.4*k),c,{kind:"arm",seed:far?47:49,depth:1,lw:1.4});
  wc_wash(q,wc_ell(0,13.6*k,2.5*k,3*k,16),f.skin,{kind:"head",seed:51,depth:1,lw:1.1,ink:M2_SKIN_LINE});q.restore();}
// eyes, brows and a mouth, in pencil, small
function m2_face(q,cx,cy,side,beard){const k=M2_FK,ox=q.__ox,oy=q.__oy,X=u=>ox+u*k,Y=v=>oy+v*k;q.save();q.fillStyle=rgba(WC_INK,0.9);q.strokeStyle=rgba(WC_INK,0.75);q.lineWidth=1.6;q.lineCap="round";
  const eyes=side?[[cx+3.4,cy-0.8]]:[[cx-2.6,cy-0.6],[cx+2.6,cy-0.6]];eyes.forEach(([x,y])=>{q.beginPath();q.arc(X(x),Y(y),0.7*k,0,TAU);q.fill();q.beginPath();q.moveTo(X(x-1.3),Y(y-2));q.lineTo(X(x+1.3),Y(y-2.3));q.stroke();});
  if(!side){q.beginPath();q.moveTo(X(cx),Y(cy));q.lineTo(X(cx+0.6),Y(cy+2.8));q.lineTo(X(cx-0.2),Y(cy+3));q.stroke();if(!beard){q.beginPath();q.moveTo(X(cx-1.8),Y(cy+5.2));q.quadraticCurveTo(X(cx),Y(cy+6.2),X(cx+1.8),Y(cy+5.2));q.stroke();}}
  q.restore();}
// a head, from the front or in profile (facing right), with hair, beard, and a beret, a hat or a coif
function m2_head(q,f,side,cx,cy){const s=side?1:0;
  m2_fp(q,[[cx-2.4,cy+4],[cx+2.6,cy+4],[cx+2.6,cy+10],[cx-2.4,cy+10]],wc_dim(f.skin,0.08),"head",53,{ink:M2_SKIN_LINE});
  if(f.woman){m2_fp(q,m2_fe(cx,cy-0.8,8.4,9.6),f.coif,"head",55);}
  m2_fp(q,m2_fe(cx+s*1.2,cy,side?6.3:6.8,8.2),f.skin,"head",57,{ink:M2_SKIN_LINE});
  if(side)m2_fp(q,[[cx+7,cy-1.2],[cx+8.8,cy+1.6],[cx+6.8,cy+2.6]],f.skin,"head",59,{line:false});
  if(f.woman){m2_fp(q,[[cx-7.4,cy-3],[cx-6,cy-8],[cx-2,cy-10.4],[cx+2,cy-10.4],[cx+6,cy-8],[cx+7.4,cy-3],[cx+5.6,cy-5.4],[cx,cy-6.6],[cx-5.6,cy-5.4]],f.coif,"head",61);}
  else if(side){m2_fp(q,[[cx-5.4,cy-2.4],[cx-3.4,cy-7.2],[cx+2,cy-8.4],[cx+6.2,cy-6.4],[cx+7,cy-3.6],[cx+3,cy-4.6],[cx-1,cy-3.4],[cx-3.6,cy+1.4],[cx-5.6,cy+5]],f.hair,"head",63);}
  else{m2_fp(q,[[cx-7,cy-1],[cx-6.6,cy-6],[cx-3,cy-8.8],[cx+3,cy-8.8],[cx+6.6,cy-6],[cx+7,cy-1],[cx+5.4,cy-4],[cx,cy-5.4],[cx-5.4,cy-4]],f.hair,"head",63);}
  if(f.beard){const fl=f.full?1.6:0;
    if(side)m2_fp(q,[[cx+0.6,cy+3],[cx+7.2,cy+2.8],[cx+7.2,cy+5.8+fl*0.6],[cx+4.4,cy+8.6+fl],[cx,cy+8.2+fl*0.6],[cx-2.6,cy+4.6]],f.beard,"head",65);
    else m2_fp(q,[[cx-6.4,cy+1.8],[cx-3,cy+3.6],[cx,cy+3.2],[cx+3,cy+3.6],[cx+6.4,cy+1.8],[cx+5.6,cy+6.4+fl*0.6],[cx+2.4,cy+9+fl],[cx-2.4,cy+9+fl],[cx-5.6,cy+6.4+fl*0.6]],f.beard,"head",65);}
  m2_face(q,cx+s*1.2,cy,side,!!f.beard);
  if(f.cap)m2_fp(q,[...m2_fe(cx+s*0.4,cy-7.6,side?7.8:8.6,3,20)],f.cap,"hat",67);
  if(f.cap)m2_fp(q,m2_fe(cx,cy-8.8,side?5.6:6.4,2.6,18),wc_lit(f.cap,0.08),"hat",69);
  if(f.hat){m2_fp(q,m2_fe(cx+s*0.8,cy-6.6,side?10.6:11.6,2.5,24),f.hat,"hat",71);m2_fp(q,[[cx-5.6,cy-6.8],[cx+6.2,cy-6.8],[cx+5,cy-13.4],[cx-4.4,cy-13.8]],f.hat,"hat",73);}}
// a person of Artigat, painted onto q with their feet at (ox,oy): from the front, standing, or in profile, walking (facing right) at
// phase ph of a stride
function m2_folkPaint(q,f,side,ph,ox,oy){q.__ox=ox;q.__oy=oy;
  if(side){const bob=-1.3*Math.abs(Math.cos(ph)),hip=[0,-47+bob],sh=[0.6,-77+bob],sw=a=>0.42*Math.sin(a),kn=a=>0.7*Math.pow(Math.max(0,Math.cos(a)),1.5)+0.05;
    const peg=f.peg,pA=ph,gA=ph+Math.PI;
    // the far side: the good leg (or the far leg), the far arm
    m2_leg(q,f,hip,sw(gA),kn(gA),true,false);
    if(!f.cloak)m2_arm(q,f,sh,0.35*Math.sin(pA),0.25,true,f.coat);
    // the body: a doublet, or a soldier's cloak
    if(f.cloak)m2_fp(q,[[-8,-81+bob],[6,-81+bob],[9.5,-62+bob],[8.5,-36+bob],[5,-25+bob],[-13,-25+bob],[-12,-48+bob],[-9.5,-70+bob]],f.coat,"coat",75);
    else m2_fp(q,[[-6.5,-80+bob],[6,-80+bob],[9,-70+bob],[8.5,-58+bob],[7.5,-52+bob],[10,-44+bob],[-9,-44+bob],[-7.5,-52+bob],[-7.6,-66+bob]],f.coat,"coat",75);
    // the near leg: a wooden one, stiff at the knee, for the real Martin
    m2_leg(q,f,hip,sw(pA)*(peg?0.8:1),peg?0.1*Math.max(0,Math.cos(pA)):kn(pA),false,peg);
    if(!f.cloak)m2_fp(q,[[-7.4,-53.6+bob],[7.8,-53.6+bob],[7.8,-50.6+bob],[-7.4,-50.6+bob]],[70,50,40],"trim",77,{flat:true});
    m2_head(q,f,true,0.6,-89+bob);
    // the near arm; the real Martin's holds his crutch, which swings with his wooden leg
    if(peg){const a=sw(pA)*0.8,tip=[hip[0]+Math.sin(a)*45+3,0],top=[sh[0]+1.4,sh[1]+2.4];q.save();q.strokeStyle=rgba([150,110,76],1);q.lineWidth=2.6*M2_FK;q.lineCap="round";
        q.beginPath();q.moveTo(ox+top[0]*M2_FK,oy+top[1]*M2_FK);q.lineTo(ox+tip[0]*M2_FK,oy+tip[1]*M2_FK);q.stroke();
        q.beginPath();q.moveTo(ox+(top[0]-3.6)*M2_FK,oy+top[1]*M2_FK);q.lineTo(ox+(top[0]+3.6)*M2_FK,oy+(top[1]-0.4)*M2_FK);q.stroke();q.restore();
      m2_arm(q,f,sh,Math.atan2(lerp(top[0],tip[0],0.36)-sh[0],lerp(top[1],tip[1],0.36)-sh[1])*1+0.2,0.35,false,f.coat);}
    else m2_arm(q,f,sh,-0.35*Math.sin(pA),0.25+0.15*Math.max(0,Math.sin(pA)),false,f.coat);
    return;}
  // from the front, standing
  if(f.woman){m2_fp(q,[[-10.5,-50],[10.5,-50],[15,-2],[8,0],[-8,0],[-15,-2]],f.dress,"coat",81);for(const s of [-1,1])m2_fp(q,m2_fe(s*4.6,-0.8,3.4,1.7),[54,46,44],"thing",83);
    m2_fp(q,[[-7.6,-50],[7.6,-50],[9,-8],[-9,-8]],f.apron,"paper",85);m2_fp(q,[[-10.2,-79],[10.2,-79],[9.4,-50],[-9.4,-50]],wc_dim(f.dress,0.08),"coat",87);
    m2_fp(q,[[-6,-79],[6,-79],[0,-70.5]],f.apron,"paper",89);m2_head(q,f,false,0,-89.6);
    for(const s of [-1,1]){const k=M2_FK;q.save();q.translate(ox+s*10*k,oy-77*k);q.rotate(s*0.2);wc_wash(q,m2_limb([[0,0],[0,15*k]],5.8*k,4.8*k),f.dress,{kind:"arm",seed:91+s,depth:1,lw:1.4});
      q.translate(0,15*k);q.rotate(s*1.15);wc_wash(q,m2_limb([[0,-1*k],[0,9*k]],4.8*k,4.2*k),f.dress,{kind:"arm",seed:93+s,depth:1,lw:1.4});
      wc_wash(q,wc_ell(0,10.4*k,2.4*k,2.8*k,16),f.skin,{kind:"head",seed:95,depth:1,lw:1.1,ink:M2_SKIN_LINE});q.restore();}
    return;}
  const hipY=-46;
  m2_leg(q,f,[-4.4,hipY],-0.05,0,false,false);m2_leg(q,f,[4.4,hipY],0.05,0,false,!!f.peg);
  if(f.cloak){m2_fp(q,[[-14.5,-80],[14.5,-80],[17.5,-25],[6,-23],[-6,-23],[-17.5,-25]],f.coat,"coat",101);m2_fp(q,[[-5,-78],[5,-78],[5.4,-46],[-5.4,-46]],wc_dim(f.hose,0.1),"coat",103);}
  else if(f.long){m2_fp(q,[[-13.5,-79],[13.5,-79],[16,-21],[-16,-21]],f.coat,"coat",101);m2_fp(q,[[-12.4,-55],[12.4,-55],[12.6,-52],[-12.6,-52]],[70,50,40],"trim",105,{flat:true});}
  else{m2_fp(q,[[-12.5,-79],[12.5,-79],[11.2,-53],[13.6,-44],[-13.6,-44],[-11.2,-53]],f.coat,"coat",101);m2_fp(q,[[-11.2,-54.4],[11.2,-54.4],[11.4,-51],[-11.4,-51]],[70,50,40],"trim",105,{flat:true});
    q.save();q.fillStyle=rgba(wc_dim(f.coat,0.45),0.9);for(let i=0;i<5;i++){q.beginPath();q.arc(ox,oy+(-75+i*4.6)*M2_FK,0.6*M2_FK,0,TAU);q.fill();}q.restore();}
  m2_head(q,f,false,0,-89.6);
  m2_arm(q,f,[-12,-77],0.14,-0.04,false,f.coat);
  if(f.peg){const k=M2_FK;q.save();q.strokeStyle=rgba([150,110,76],1);q.lineWidth=2.6*k;q.lineCap="round";q.beginPath();q.moveTo(ox+15.6*k,oy-73*k);q.lineTo(ox+19*k,oy);q.stroke();
      q.beginPath();q.moveTo(ox+11.6*k,oy-74.4*k);q.lineTo(ox+19.4*k,oy-73*k);q.stroke();q.restore();m2_arm(q,f,[12,-77],-0.2,0.05,false,f.coat);}
  else m2_arm(q,f,[12,-77],-0.14,0.04,false,f.coat);}
// a person of Artigat at (x,y), h px tall: o.side walks (o.phase, strides walked), o.flip faces left; painted once per pose and kept
function m2_folk(ctx,kind,x,y,h,o){o=o||{};const n=12,side=!!o.side,ph=side?(Math.round(((((o.phase||0)%1)+1)%1)*n)%n):0,
  c=wc_kept("folk:"+kind+":"+(side?"s"+ph:"f"),300,500,q=>m2_folkPaint(q,M2_FOLK[kind],side,ph/n*TAU,150,482)),s=h/M2_FH;
  wc_contact(ctx,x-34*s*M2_FK*0.45,x+34*s*M2_FK*0.45,y,0.9,0.3);
  ctx.save();ctx.translate(x,y);if(o.flip)ctx.scale(-1,1);ctx.scale(s,s);if(o.sway)ctx.rotate(o.sway);ctx.drawImage(c,-150,-482);ctx.restore();}
// how far a walker's stride has gone, for o.phase: one stride is about 0.73 of their height
const m2_stride=(dist,h)=>dist/(0.73*h);
// a judge behind the bench, from the waist up, in a black robe and a square cap; drawn leaning by lean (towards the left)
function m2_judgePaint(q,v,ox,oy){q.__ox=ox;q.__oy=oy;const f={skin:[[226,186,152],[210,170,136],[222,182,148]][v],hair:[[150,146,144],[60,48,40],[110,96,86]][v],beard:v===1?[64,52,44]:null,full:1};
  m2_fp(q,[[-15,-26],[15,-26],[18,10],[-18,10]],[46,42,54],"coat",111);m2_fp(q,[[-6,-26],[6,-26],[3.6,-20.6],[-3.6,-20.6]],[246,244,238],"paper",113);
  m2_head(q,f,false,0,-35);m2_fp(q,[[-7.8,-41.6],[7.8,-41.6],[8.8,-46.6],[0,-49.6],[-8.8,-46.6]],[40,36,46],"hat",115);}
function m2_judge(ctx,x,y,s,lean,v){const c=wc_kept("judge"+v,240,280,q=>m2_judgePaint(q,v,120,232));ctx.save();ctx.translate(x,y);ctx.rotate(-lean);ctx.scale(s,s);ctx.drawImage(c,-120,-232);ctx.restore();}
// the judges' bench, drawn over the judges
function m2_bench(ctx){ctx.drawImage(wc_kept("bench",W,H,q=>{const wood=[136,96,66];wc_wash(q,wc_rect(520,470,880,130),wood,{kind:"build",lw:1.8,seed:3});
  for(let i=0;i<6;i++)wc_wash(q,wc_rect(548+i*142,494,114,84),wc_lit(wood,0.1),{kind:"trim",lw:1.2,seed:10+i});
  wc_wash(q,wc_rect(506,458,908,22),wc_dim(wood,0.2),{kind:"trim",lw:1.4,seed:4});}),0,0);}
// what the village knew of Martin: a parchment slip, with a tick for each thing the man who came back knew (ticks, 0 to 1 each)
const M2_KNEW=["the house","the family","their stories"],M2_KW=560,M2_KH=300;
function m2_knew(ctx,x,y,ticks,o){o=o||{};const c=wc_kept("knew",M2_KW+40,M2_KH+40,q=>{q.translate(20,20);wc_wash(q,wc_rect(0,0,M2_KW,M2_KH),WCP.parchment,{kind:"page",lw:2,seed:5});});
  ctx.drawImage(c,x-20,y-20);wc_T(ctx,"Martin Guerre",x+34,y+62,{w:800,size:36,col:WCP.parchInk});wc_T(ctx,"what the village knew",x+34,y+102,{w:600,size:28,col:wc_lit(WCP.parchInk,0.2)});
  M2_KNEW.forEach((s,i)=>{const yy=y+160+i*46;wc_hand(ctx,s,x+44,yy,{size:30,col:WCP.parchInk});const p=ticks[i]||0;if(p>0)wc_tick(ctx,x+M2_KW-74,yy-10,30,WC_ROLEINK.alumna,p,4);
    if(o.glow>0.01)withA(ctx,o.glow,()=>wc_ring(ctx,x+M2_KW-72,yy-10,26,22,1,{seed:70+i,col:WC_ROLEINK.alumna,lw:2.6}));});}
// the court's record of the witnesses: those who said he was Martin, those who said he wasn't, those who couldn't say; p fills it
const M2_WIT=[["Martin",35],["not Martin",45],["can't say",60]];
function m2_witness(ctx,x,y,p){const w=600,h=330,c=wc_kept("wit",w+40,h+40,q=>{q.translate(20,20);wc_wash(q,wc_rect(0,0,w,h),WCP.parchment,{kind:"page",lw:2,seed:8});});
  ctx.drawImage(c,x-20,y-20);wc_T(ctx,"about 150 witnesses",x+34,y+60,{w:800,size:34,col:WCP.parchInk});
  M2_WIT.forEach(([s,n],j)=>{const cx=x+34+j*190;wc_hand(ctx,s,cx,y+112,{size:28,col:WCP.parchInk});m2_tally(ctx,cx+4,y+140,Math.round(n*clamp(p*1.2-j*0.1,0,1)));});}
function m2_tally(ctx,x,y,n){ctx.save();ctx.strokeStyle=rgba(WCP.parchInk,0.85);ctx.lineWidth=2.6;ctx.lineCap="round";
  for(let i=0;i<n;i++){const g=Math.floor(i/5),r=i%5,gx=x+(g%4)*40,gy=y+Math.floor(g/4)*44;ctx.beginPath();
    if(r<4){const xx=gx+r*7;ctx.moveTo(xx,gy);ctx.lineTo(xx+1.5,gy+30);}else{ctx.moveTo(gx-4,gy+24);ctx.lineTo(gx+27,gy+6);}ctx.stroke();}ctx.restore();}
// a name tag over someone, struck through in red ink as s goes 0 to 1
function m2_strike(ctx,x,y,w,s){if(s<=0)return;ctx.save();ctx.strokeStyle=rgba(WC_NO,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-w/2+12,y+2);ctx.lineTo(lerp(x-w/2+12,x+w/2-12,ease(s)),y-3);ctx.stroke();ctx.restore();}

/* ---------- 2. two words ---------- */
// Linh's roles, as bands on her white figure, in the same order as in film 1
const M2_BANDS=["student","tutor","researcher","alumna"];
const m2_bands=a=>M2_BANDS.map((r,i)=>({col:WC_ROLE[r],a:a[i]==null?1:a[i]}));
// a shelf: a plank on two brackets, w wide, drawn in from the left as p goes 0 to 1
function m2_shelf(ctx,x0,w,y,p){if(p<=0)return;const c=wc_kept("shelf"+w,w+40,70,q=>{q.translate(20,10);wc_wash(q,wc_rect(0,0,w,18),WCP.wood,{kind:"trim",lw:1.6});
    for(const x of [40,w-40])wc_wash(q,[[x-12,18],[x+12,18],[x,44]],wc_dim(WCP.wood,0.12),{kind:"trim",lw:1.2});});
  ctx.save();ctx.beginPath();ctx.rect(x0-20,y-12,(w+40)*ease(clamp(p,0,1)),80);ctx.clip();ctx.drawImage(c,x0-20,y-10);ctx.restore();}
// the things on the master shelf: an award (a rolled degree with its ribbon), a supplier's crate, a meter; each kept, base at (x,y)
function m2_scroll(ctx,x,y){ctx.drawImage(wc_kept("scroll",200,150,q=>{q.translate(100,140);wc_wash(q,[[-74,-22],[66,-48],[74,-28],[-66,0]],WCP.parchment,{kind:"paper",lw:1.6,seed:3});
  wc_wash(q,wc_ell(-70,-11,9,13,18),wc_dim(WCP.parchment,0.12),{kind:"paper",lw:1.4,seed:5});wc_wash(q,wc_ell(70,-38,9,13,18),wc_dim(WCP.parchment,0.12),{kind:"paper",lw:1.4,seed:7});
  wc_wash(q,[[-8,-36],[8,-40],[12,-8],[-4,-4]],[100,130,200],{kind:"ribbon",flat:true});wc_wash(q,[[-2,-8],[6,-8],[12,16],[4,10],[-6,18]],[100,130,200],{kind:"ribbon",flat:true});
  wc_wash(q,wc_ell(2,-22,13,13,20),[84,112,186],{kind:"thing",lw:1.4,seed:9});}),x-100,y-140);}
function m2_crate(ctx,x,y){ctx.drawImage(wc_kept("crate",200,170,q=>{q.translate(100,160);wc_wash(q,wc_rect(-70,-120,140,120),WCP.wood,{kind:"build",lw:1.6,seed:3});
  q.strokeStyle=rgba(wc_dim(WCP.wood,0.4),0.7);q.lineWidth=2.4;for(let i=1;i<4;i++){q.beginPath();q.moveTo(-70,-120+i*30);q.lineTo(70,-120+i*30);q.stroke();}
  q.beginPath();q.moveTo(-70,-120);q.lineTo(70,0);q.stroke();wc_wash(q,wc_rect(-34,-84,68,40),WC_CARD,{kind:"paper",lw:1.4,seed:5});
  q.fillStyle=rgba(WC_PENCIL,0.6);for(let i=0;i<3;i++)q.fillRect(-24,-74+i*10,48-i*14,3);}),x-100,y-160);}
function m2_meter(ctx,x,y){ctx.drawImage(wc_kept("meter",120,150,q=>{q.translate(20,10);wc_wash(q,wc_rrPts(0,0,80,110,10),[206,206,214],{kind:"build",lw:1.6});
    wc_wash(q,wc_ell(40,44,24,24,28),WC_PAPER,{kind:"clock",lw:1.5});q.strokeStyle=rgba(WC_INK,0.9);q.lineWidth=3;q.lineCap="round";q.beginPath();q.moveTo(40,44);q.lineTo(54,30);q.stroke();
    wc_wash(q,wc_rect(18,82,44,14),[90,96,110],{kind:"trim",flat:true});}),x-60,y-130);}
// a short list on a card: its name and its values; the value at lit is lit as la goes 0 to 1; returns its height
function m2_list(ctx,x,y,w,head,items,lit,litCol,la){const h=66+items.length*44;wc_panel(ctx,x,y,w,h,{kind:"card",seed:head.length});wc_T(ctx,head,x+24,y+46,{w:800,size:30,col:WC_DARK});
  items.forEach((it,i)=>{const yy=y+96+i*44;if(i===lit&&la>0.01)withA(ctx,la,()=>wc_panel(ctx,x+12,yy-31,w-24,42,{kind:"chip",role:litCol,seed:i+3}));
    wc_T(ctx,it,x+28,yy,{w:i===lit&&la>0.5?700:600,size:28,col:WC_INK});});return h;}
// tags that wrap into rows by their width, from (x,y), each arriving at its own moment; rows are 60 apart
function m2_tags(ctx,t,x,y,w,items){let cx=x,cy=y;items.forEach(([s,t0])=>{const tw0=Math.round(tw(ctx,s,28,600)+40);if(cx+tw0>x+w){cx=x;cy+=60;}const xx=cx,yy=cy;
  arrive(ctx,xx+tw0/2,yy,t,t0,()=>wc_tag(ctx,xx,yy,s,{size:28,w:600}),{dy:8});cx+=tw0+14;});}

/* ---------- 3. a golden record ---------- */
// a number stamped on at ts, centred at (cx,cy), k times the size of film 1's 1947 stamp: it lands a little large and settles
const M2_STAMP=[58,52,120];
function m2_stampOn(ctx,t,cx,cy,ts,s,k){const p=clamp((t-ts)/0.2,0,1);if(p<=0)return;const z=k*lerp(1.32,1,1-Math.pow(1-p,3));
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-0.035);ctx.scale(z,z);withA(ctx,p,()=>{ctx.drawImage(m2_stampRule(),-210,-60,420,120);
    wc_T(ctx,s,0,20,{f:"mono",w:500,size:56,col:M2_STAMP,a:0.88,align:"center"});});ctx.restore();}
function m2_stampRule(){return wc_kept("stampRule",840,240,q=>{q.scale(2,2);q.translate(4,4);
  wc_ink(q,wc_rrPts(0,0,412,112,10),true,3.6,M2_STAMP,0.9,41,0.6);wc_ink(q,wc_rrPts(9,9,394,94,6),true,1.8,M2_STAMP,0.85,43,0.6);
  q.globalCompositeOperation="destination-out";q.globalAlpha=0.5;q.drawImage(WC.blotch,-40,-30,520,300);});}
// Linh's five records, as each system holds them: her two student numbers, her alumna record (which holds the old number), HR's record
// of her as a tutor, and the research office's (which holds her staff number)
const M2_RECI={old:["student","Student","S-17142","bachelor's · 2019–22"],new:["student","Student","S-20436","master's · from 2025"],
  alumna:["alumna","Alumna","S-17142","graduated 2022"],tutor:["tutor","Casual tutor","E-4417","HR · since 2023"],researcher:["researcher","Researcher","R-3082","holds E-4417"]};
function m2_rec(ctx,k,x,y,w,o){o=o||{};const [r,title,id,note]=M2_RECI[k];wc_roleCard(ctx,x,y,w,116,r,title,id,null,{note:o.note||note});}
// a source's label: a chip in the source's colour, with its name; returns its width
function m2_src(ctx,x,y,label,col,o){o=o||{};const w=Math.round(tw(ctx,label,28,700)+36);const x0=o.right?x-w:x;wc_panel(ctx,x0,y,w,42,{kind:"chip",role:col,seed:label.length+2});
  wc_T(ctx,label,x0+18,y+31,{w:700,size:28,col:WC_DARK});return w;}
// the master record: the person, as white paper, an ID of her own, and the best value of each detail with its source
const M2_MR={x:610,y:110,w:700,h:680};
// (details only one place holds, so nothing here answers the next film's question, which value wins)
const M2_BEST=[["preferred name","Linh","Linh",WC_SIDE.none],["student email","linh.nguyen@student.uni.example","student system",WC_ROLE.student],["work email","linh.nguyen@uni.example","HR",WC_ROLE.tutor]];
function m2_master(ctx,t,o){const M=M2_MR;wc_panel(ctx,M.x,M.y,M.w,M.h,{kind:"sheet",seed:12});
  wc_white(ctx,"linh",M.x+110,M.y+330,0.34,m2_bands(o.bands||[1,1,1,1]),{a:o.fig==null?1:o.fig,shadow:false});
  wc_T(ctx,"master record",M.x+200,M.y+72,{w:800,size:36,col:WC_DARK});
  if(o.gold>0.01)withA(ctx,o.gold,()=>wc_badge(ctx,M.x+200,M.y+118,"golden record"));
  if(o.ts!=null)m2_stampOn(ctx,t,M.x+450,M.y+214,o.ts,"P-10482",0.62);
  M2_BEST.forEach(([lab,val,src,col],i)=>{const a=(o.rows||[])[i]||0,ca=(o.srcs||[])[i]||0,y0=M.y+364+i*100;if(a<=0.01)return;
    withA(ctx,a,()=>{wc_T(ctx,lab,M.x+40,y0+30,{w:600,size:28,col:WC_MUTED});wc_T(ctx,val,M.x+40,y0+72,{w:500,size:30,f:"mono",col:WC_DARK});});
    if(ca>0.01)withA(ctx,ca,()=>m2_src(ctx,M.x+M.w-30,y0+2,src,col,{right:true}));});}

/* ---------- 4. the duplicate check ---------- */
// the university's systems, each a column of records: where the column stands, its name, its colour
const M2_SYS=[["student system",260,WC_ROLE.student],["HR",610,WC_ROLE.tutor],["research office",960,WC_ROLE.researcher],["alumni office",1310,WC_ROLE.alumna],["learning platform",1660,[60,140,190]]];
const M2_DOTS=12,M2_DY0=280,M2_DDY=30;
const m2_dot=(s,i)=>[M2_SYS[s][1]+((i*37+s*11)%5-2)*9,M2_DY0+i*M2_DDY];
// every pair of every record, drawn once and kept: the billion comparisons nobody makes
function m2_web(){return wc_kept("web",W,H,q=>{q.strokeStyle=rgba(WC_PENCIL,0.07);q.lineWidth=1.2;const all=[];for(let s=0;s<5;s++)for(let i=0;i<M2_DOTS;i++)all.push(m2_dot(s,i));
  for(let a=0;a<all.length;a++)for(let b=a+1;b<all.length;b++){q.beginPath();q.moveTo(all[a][0],all[a][1]);q.lineTo(all[b][0],all[b][1]);q.stroke();}});}
// the pairs that share something: [system, record] and [system, record], and what they share (0 an email, 1 a number, 2 a birth
// year and a family name that sounds alike). Linh's records are student 3 and 9, HR 5, research 7, alumni 2; Aisha Karimi's is student
// 6, and the account typed with her number is the learning platform's 4
const M2_LINH=[[0,3],[0,9],[1,5],[2,7],[3,2]],M2_AISHA=[[0,6],[4,4]];
const M2_PAIRS=[[[0,3],[0,9],2],[[0,9],[1,5],2],[[3,2],[0,3],1],[[2,7],[1,5],1],[[4,4],[0,6],1],[[1,1],[4,8],0],[[0,11],[4,10],0],[[2,2],[1,9],2],[[3,8],[0,1],1],[[4,1],[0,4],0]];
const M2_KEYS=["same email","same number","same birth year, family name sounds alike"],M2_KDASH=[[2,9],[],[14,9]];
function m2_pairLine(ctx,a,b,kind,p,o){o=o||{};if(p<=0)return;const A=m2_dot(a[0],a[1]),B=m2_dot(b[0],b[1]);ctx.save();ctx.strokeStyle=rgba(o.col||WC_INK,o.a==null?0.85:o.a);ctx.lineWidth=o.lw||3;ctx.lineCap="round";
  ctx.setLineDash(M2_KDASH[kind]);const mx=(A[0]+B[0])/2,my=Math.min(A[1],B[1])-40-Math.abs(A[0]-B[0])*0.08,e=ease(clamp(p,0,1));ctx.beginPath();ctx.moveTo(A[0],A[1]);
  const n=24;for(let i=1;i<=Math.round(n*e);i++){const u=i/n,v=1-u;ctx.lineTo(v*v*A[0]+2*v*u*mx+u*u*B[0],v*v*A[1]+2*v*u*my+u*u*B[1]);}ctx.stroke();ctx.restore();}
// a key's chip: its line style drawn beside its name; returns its width
function m2_keyChip(ctx,x,y,i){const s=M2_KEYS[i],w=Math.round(tw(ctx,s,28,700)+110);wc_panel(ctx,x,y-26,w,52,{kind:"tag",seed:i+20});ctx.save();ctx.strokeStyle=rgba(WC_INK,0.85);
  ctx.lineWidth=3;ctx.setLineDash(M2_KDASH[i]);ctx.beginPath();ctx.moveTo(x+18,y);ctx.lineTo(x+68,y);ctx.stroke();ctx.restore();wc_T(ctx,s,x+86,y+10,{w:700,size:28,col:WC_DARK});return w;}
// the steward's queue: the pairs proposed, three of them this story's, and more beneath
const M2_QUEUE=[["S-17142","S-20436"],["S-20436","E-4417"],["u-88231","S-20417"]];
function m2_queue(ctx,x,y,o){o=o||{};const w=800,h=470;wc_panel(ctx,x,y,w,h,{kind:"sheet",seed:16});wc_T(ctx,"the person queue",x+36,y+64,{w:800,size:36,col:WC_DARK});
  wc_T(ctx,"pairs to decide",x+w-36,y+62,{w:600,size:28,col:WC_MUTED,align:"right"});
  M2_QUEUE.forEach(([a,b],i)=>{const yy=y+110+i*78,ra=(o.rows||[])[i];if(ra<=0.01)return;withA(ctx,ra,()=>{wc_panel(ctx,x+28,yy,w-56,62,{kind:"card",seed:i+30,wash:o.lift&&o.lift[i]>0.01?WC_BADGE:null,washA:0.3*((o.lift||[])[i]||0)});
    const na=(o.num||[])[i]||0;if(na>0.01)withA(ctx,na,()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x+72,yy+31,20,0,TAU);ctx.stroke();ctx.restore();
      wc_T(ctx,String(i+1),x+72,yy+41,{w:800,size:28,align:"center",col:WC_DARK});});
    wc_T(ctx,a+"  ·  "+b,x+116,yy+42,{w:500,size:30,f:"mono",col:WC_DARK});});});
  // more pairs, unread: texture
  for(let i=0;i<2;i++){const yy=y+110+(3+i)*78,ga=(o.ghost||0)*(1-i*0.4);if(ga<=0.01)continue;withA(ctx,ga*0.6,()=>{wc_panel(ctx,x+28,yy,w-56,62,{kind:"card",seed:i+40});ctx.fillStyle=rgba(WC_PENCIL,0.25);
    ctx.fillRect(x+116,yy+24,170,14);ctx.fillRect(x+320,yy+24,170,14);});}}
// a person's name card: the name, and what they do
function m2_nameCard(ctx,x,y,name,what){const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,what,28,600))+60);wc_panel(ctx,x,y,w,108,{kind:"card",seed:name.length});
  wc_T(ctx,name,x+28,y+46,{w:800,size:32,col:WC_DARK});wc_T(ctx,what,x+28,y+86,{w:600,size:28,col:WC_MUTED});return w;}
// a person facing the other way when o.flip, so a hand that points stays in the frame
function m2_person(ctx,id,x,y,s,o){if(!o.flip)return person(ctx,id,x,y,s,o);ctx.save();ctx.translate(x,0);ctx.scale(-1,1);person(ctx,id,0,y,s,o);ctx.restore();}

/* ---------- 5 to 8. the pairs ---------- */
// a record, as one system holds it, for comparing: its role's brushstroke and title, its key, and its details, one per row
function m2_card(ctx,x,y,w,role,title,id,rows,o){o=o||{};const col=WC_ROLE[role]||role,h=70+rows.length*46,tW=tw(ctx,title,30,800);
  wc_panel(ctx,x,y,w,h,{kind:"card",role:col,sw:tW+36,seed:o.seed||title.length});wc_T(ctx,title,x+30,y+48,{w:800,size:30,col:WC_DARK});
  if(id)wc_T(ctx,id,x+w-24,y+48,{w:500,size:28,f:"mono",align:"right"});
  rows.forEach((r,i)=>{const a=o.ra?o.ra[i]:1;if(a<=0.01)return;withA(ctx,a,()=>wc_T(ctx,r,x+30,y+100+i*46,{w:500,size:28,f:o.sans&&o.sans[i]?"sans":"mono",col:WC_INK}));});return h;}
// where row i of a card sits: its baseline
const m2_rowY=(y,i)=>y+100+i*46;
// the score's gauge, 0 to 100: keep apart below 60, a person decides from 60 to 90, link from 90; the needle at score, its number below
const M2_BANDCOL=[[204,200,214],WC_BADGE,[150,178,214]];
function m2_gauge(ctx,x,y,w,score,o){o=o||{};const bands=[[0,60,"keep apart"],[60,90,"a person decides"],[90,100,"link"]];
  bands.forEach(([a,b,s],i)=>{const x0=x+w*a/100,x1=x+w*b/100;wc_panel(ctx,x0,y,x1-x0,36,{kind:"chip",role:M2_BANDCOL[i],seed:60+i});
    wc_T(ctx,s,(x0+x1)/2,y-18,{w:i===1?800:700,size:28,align:"center",col:WC_DARK,a:o.la==null?1:o.la});});
  [60,90].forEach(v=>{const xx=x+w*v/100;wc_T(ctx,String(v),xx,y+72,{w:500,size:28,f:"mono",align:"center",col:WC_MUTED});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.4;
    ctx.beginPath();ctx.moveTo(xx,y-4);ctx.lineTo(xx,y+44);ctx.stroke();ctx.restore();});
  if(score==null)return;const nx=x+w*clamp(score,0,100)/100;ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.95);ctx.fillStyle=rgba(WC_DARK,0.95);ctx.lineWidth=4.5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(nx,y-14);ctx.lineTo(nx,y+50);ctx.stroke();ctx.beginPath();ctx.moveTo(nx,y+50);ctx.lineTo(nx-9,y+64);ctx.lineTo(nx+9,y+64);ctx.closePath();ctx.fill();ctx.restore();
  if(o.num!==false)wc_T(ctx,String(Math.round(score)),nx,y+(o.numY||116),{w:800,size:44,align:"center",col:WC_DARK});}
// the score for a pair's total weight: the weights are log-odds (base 2) that the two are one person, against a prior of one in 52
const m2_score=wsum=>100/(1+Math.pow(2,-(wsum-5.69)));
// Linh's application, in the student system: what she applied for, and what it says about studying here before (ring, 0 to 1)
function m2_app(ctx,x,y,o){o=o||{};const w=680,h=226,tW=tw(ctx,"Application",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_ROLE.applicant,sw:tW+36,seed:6});
  wc_T(ctx,"Application",x+30,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,"S-20436",x+w-24,y+48,{w:500,size:28,f:"mono",align:"right"});
  wc_T(ctx,"master's · health informatics",x+30,y+96,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"studied here before?",x+30,y+150,{w:700,size:28,col:WC_DARK});
  wc_T(ctx,"yes · bachelor's, 2019–22",x+30,y+194,{w:700,size:28,col:WC_ROLEINK.student});
  if(o.ring>0)wc_ring(ctx,x+30+tw(ctx,"yes · bachelor's, 2019–22",28,700)/2,y+184,tw(ctx,"yes · bachelor's, 2019–22",28,700)/2+24,30,o.ring,{seed:13});}
// a steward's decision, on a card washed in her gold: its number, the verdict, the pair, the reason, who and when; typed in as p goes
// 0 to 1. Its height grows with the reason's lines
function m2_decision(ctx,x,y,w,d,p){const L=[[d.verdict,800,34,WC_DARK,"sans"],[d.pair,500,30,WC_DARK,"mono"]].concat(d.why.map(s=>[s,600,28,WC_INK,"sans"])).concat([[d.who,600,28,WC_MUTED,"sans"]]);
  const h=96+L.length*44+12;wc_panel(ctx,x,y,w,h,{kind:"card",wash:WC_BADGE,washA:0.42,seed:d.id.length+7});wc_badge(ctx,x+28,y+44,d.id);
  let n=Math.round(L.reduce((a,l)=>a+l[0].length,0)*clamp(p,0,1));L.forEach(([s,wt,sz,col,f],i)=>{if(n<=0)return;wc_T(ctx,s.slice(0,n),x+30,y+112+i*44+(i?4:0),{w:wt,size:sz,f,col});n-=s.length;});return h;}
const M2_DEC={
  d5:{id:"D-005",verdict:"same person",pair:"S-17142 = S-20436",why:["her application: studied here 2019–22"],who:"Mei Tanaka · 8 Oct 2026"},
  d6:{id:"D-006",verdict:"same person",pair:"S-20436 = E-4417",why:["HR checked her contract:","birth date typed wrong"],who:"Mei Tanaka · 9 Oct 2026"},
  d3:{id:"D-003",verdict:"not the same",pair:"u-88231 ≠ S-20417",why:["Aisha Rahman's account carries","Aisha Karimi's number, typed by mistake"],who:"Mei Tanaka · 7 Oct 2026"}};
// the AI helper's mark: a four-pointed spark, in pencil
function m2_spark(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU-Math.PI/2,r=i%2?s*0.3:s;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();
  ctx.fillStyle=rgba([150,170,200],0.6);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
// the AI helper's note for Mei, the names hidden: each line typed in as its moment comes (o.lines, 0 to 1 each)
function m2_note(ctx,x,y,o){const w=700,h=400;wc_panel(ctx,x,y,w,h,{kind:"card",seed:18});m2_spark(ctx,x+46,y+46,18);wc_T(ctx,"AI helper · a draft for Mei",x+80,y+56,{w:600,size:28,col:WC_MUTED});
  const L=o.lines||[];const line=(i,fn)=>{const a=L[i]||0;if(a>0.01)fn(a);};
  line(0,a=>{wc_T(ctx,typeOn("pair 2 · names hidden",a),x+36,y+118,{w:800,size:30,col:WC_DARK});});
  line(1,a=>withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.5);[[36,64],[108,104],[260,64],[332,104]].forEach(([dx,bw])=>{ctx.beginPath();rr(ctx,x+dx,y+146,bw,26,6);ctx.fill();});ctx.restore();
    wc_T(ctx,"and",x+218,y+168,{w:600,size:28,col:WC_MUTED});}));
  line(2,a=>wc_T(ctx,typeOn("· birth dates one digit apart",a),x+36,y+232,{w:600,size:28,col:WC_INK}));
  line(3,a=>wc_T(ctx,typeOn("· HR email on the university's domain",a),x+36,y+280,{w:600,size:28,col:WC_INK}));
  line(4,a=>wc_T(ctx,typeOn("suggestion: ask HR to check",a),x+36,y+350,{w:800,size:30,col:WC_DARK}));}
// her contract, as HR files it: a sheet with her date of birth in a clerk's hand
function m2_contract(ctx,x,y){const c=wc_kept("contract",340,280,q=>{q.translate(20,20);wc_wash(q,wc_rect(0,0,300,240),[252,250,244],{kind:"page",lw:1.8,seed:6});
  q.fillStyle=rgba(WC_PENCIL,0.28);for(let i=0;i<3;i++)q.fillRect(28,30+i*20,200-i*40,7);for(let i=0;i<2;i++)q.fillRect(28,190+i*18,240-i*90,6);});ctx.drawImage(c,x-20,y-20);
  wc_T(ctx,"contract",x+28,y+112,{w:700,size:28,col:WC_MUTED});wc_hand(ctx,"born 14 March 2001",x+30,y+158,{size:28,col:WC_INK});}
// a balance: a false merge on the left, heavy, against a missed match on the right; tilt in radians, positive sinks the left
function m2_scale(ctx,cx,cy,tilt){const arm=250;ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy+250);ctx.moveTo(cx-70,cy+250);ctx.lineTo(cx+70,cy+250);ctx.stroke();
  const L=[cx-Math.cos(tilt)*arm,cy+Math.sin(tilt)*arm],R=[cx+Math.cos(tilt)*arm,cy-Math.sin(tilt)*arm];ctx.beginPath();ctx.moveTo(L[0],L[1]);ctx.lineTo(R[0],R[1]);ctx.stroke();
  ctx.fillStyle=rgba(WC_PENCIL,0.9);ctx.beginPath();ctx.arc(cx,cy,9,0,TAU);ctx.fill();ctx.restore();
  [[L,"a false merge",1],[R,"a missed match",0]].forEach(([p,s,heavy],i)=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.75);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]-70,p[1]+110);
    ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+70,p[1]+110);ctx.stroke();ctx.restore();
    ctx.drawImage(wc_kept("pan",220,60,q=>wc_wash(q,[[10,8],[210,8],[176,44],[44,44]],[214,200,170],{kind:"build",lw:1.6,seed:5})),p[0]-110,p[1]+102);
    if(heavy)ctx.drawImage(wc_kept("weight",150,110,q=>wc_wash(q,[[22,96],[128,96],[112,20],[38,20]],[120,112,124],{kind:"build",lw:1.6,seed:9})),p[0]-75,p[1]+6);
    else ctx.drawImage(wc_kept("feather",90,60,q=>wc_wash(q,[[12,48],[78,40],[70,30],[20,40]],[200,196,206],{kind:"build",lw:1.4,seed:11})),p[0]-45,p[1]+66);
    wc_T(ctx,s,p[0],p[1]+192,{w:800,size:32,align:"center",col:WC_DARK});});}
// a padlock, in pencil: a decision that holds
function m2_lock(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(WC_PENCIL,0.95);ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,-18,18,Math.PI,0);ctx.lineTo(18,0);ctx.moveTo(-18,0);ctx.lineTo(-18,-18);ctx.stroke();
  ctx.restore();ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.drawImage(wc_kept("lockbody",80,64,q=>wc_wash(q,wc_rrPts(6,6,68,50,8),[226,186,80],{kind:"build",lw:1.6,seed:3})),-40,-8);ctx.restore();}
// a result, as a slip: what she completed
function m2_result(ctx,x,y,o){o=o||{};wc_panel(ctx,x,y,560,104,{kind:"card",seed:22,wash:WC_ROLE.student,washA:0.18});wc_T(ctx,"result",x+28,y+42,{w:600,size:28,col:WC_MUTED});
  wc_T(ctx,"Graduate Certificate, Data Analytics",x+28,y+84,{w:700,size:28,col:WC_DARK});}

// the two Aishas, two students: like Linh, neither has a side, so their edge is neutral
PEOPLE.aishar={name:"Aisha Rahman",role:"Student",side:"Person",does:"uses",edge:[236,232,226],seed:31,skin:[176,124,92],hair:{style:"long",c:[36,26,24]},earrings:[226,230,240],
  top:{kind:"sweater",c:[196,120,96]},bottom:{c:[60,66,84]},shoe:[238,238,242],build:{sh:64,hip:58,h:0.92}};
PEOPLE.aishak={name:"Aisha Karimi",role:"Student",side:"Person",does:"uses",edge:[236,232,226],seed:32,skin:[214,170,132],hair:{style:"curly",c:[52,36,30]},
  top:{kind:"overshirt",c:[96,140,120],inner:[240,236,228]},bottom:{c:[48,52,66]},shoe:[60,52,50],build:{sh:66,hip:60,h:0.95}};
// a record with a label on each row: the label in muted type, the value in mono from o.vx; o.ra fades rows in; returns its height
function m2_fieldCard(ctx,x,y,w,role,title,id,rows,o){o=o||{};const col=WC_ROLE[role]||role,h=70+rows.length*46,tW=tw(ctx,title,30,800);
  wc_panel(ctx,x,y,w,h,{kind:"card",role:col,sw:tW+36,seed:o.seed||title.length+5});wc_T(ctx,title,x+30,y+48,{w:800,size:30,col:WC_DARK});
  if(id)wc_T(ctx,id,x+w-24,y+48,{w:500,size:28,f:"mono",align:"right"});
  rows.forEach(([l,v],i)=>{const a=o.ra?o.ra[i]:1;if(a<=0.01)return;withA(ctx,a,()=>{wc_T(ctx,l,x+30,m2_rowY(y,i),{w:600,size:28,col:WC_MUTED});
    wc_T(ctx,v,x+(o.vx||240),m2_rowY(y,i),{w:500,size:28,f:"mono",col:WC_INK});});});return h;}

/* ---------- 10. elsewhere ---------- */
// a patient's wristband: a band with a name, a number and a barcode
// a lab's result, as a slip, for a patient
function m2_labSlip(ctx,x,y){wc_panel(ctx,x,y,360,96,{kind:"card",seed:27,wash:WC_IND.health,washA:0.2});wc_T(ctx,"test result",x+26,y+40,{w:600,size:28,col:WC_MUTED});
  wc_T(ctx,"Jo Lee",x+26,y+80,{w:800,size:30,col:WC_DARK});}
function m2_band(ctx,x,y,name,mrn){wc_panel(ctx,x,y,560,92,{kind:"card",seed:mrn.length+name.length,wash:WC_IND.health,washA:0.14});
  ctx.save();ctx.fillStyle=rgba(WC_INK,0.6);for(let i=0;i<14;i++)ctx.fillRect(x+440+i*7,y+24,(i%3?2:4),44);ctx.restore();
  wc_T(ctx,name,x+28,y+40,{w:800,size:30,col:WC_DARK});wc_T(ctx,mrn,x+28,y+78,{w:500,size:28,f:"mono",col:WC_INK});}

/* ---------- 11. decided once ---------- */
// a card with a tool's logo, its name, and lines of code or rows, in mono; returns its height
function m2_tool(ctx,x,y,w,logoK,name,file,lines,o){o=o||{};const h=o.h||(150+lines.length*46);wc_panel(ctx,x,y,w,h,{kind:"sheet",seed:name.length+3});
  const lw=logo(ctx,logoK,x+30,y+28,46);wc_T(ctx,name,x+44+Math.max(lw,46),y+66,{w:800,size:36,col:WC_DARK});
  if(file)wc_T(ctx,file,x+w-30,y+64,{w:500,size:28,f:"mono",align:"right",col:WC_MUTED});
  lines.forEach((l,i)=>{const a=o.la?o.la[i]:1;if(a<=0.01)return;const s=typeof l==="string"?l:l[0],col=typeof l==="string"?(s.startsWith("--")?WC_MUTED:WC_INK):l[1];
    withA(ctx,a,()=>wc_T(ctx,s,x+36,y+140+i*46,{w:500,size:28,f:"mono",col}));});return h;}
