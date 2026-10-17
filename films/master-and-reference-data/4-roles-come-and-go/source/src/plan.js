/* ===== Roles come and go: the places and the pictures =====
   The places are painted once and kept (post.js): the Forum in 204 BC, the campus of One person, many roles, the paper with a little sky
   and land for the chapters that explain, the data architect's office, and a terraced house for the energy company. The pictures are
   the film's own things: Cato in his toga, the stone tablet of his offices and the ladder they make on a line of years, the census list;
   the calendar page and the two questions; the four systems and the platform's nightly copy; the form every role takes; Linh's timeline,
   with a row for each kind of role, the periods on it, the line of one date, and her white figure, whose bands answer it; HR's contracts;
   what each role relates to; the energy company's two people and the need that goes on; the role table, its tests and its query. Every
   name starts with m4_ (this film) or M4_. */

/* ---------- the people this film adds ---------- */
// Jun Park, the analytics engineer of In the weeds of data crafting, whose series' people aren't in this bundle
if(!PEOPLE.jun)PEOPLE.jun={name:"Jun Park",role:"Analytics engineer",side:"Technical",does:"produces",edge:TECH,seed:10,
  skin:[226,186,150],hair:{style:"side",c:[24,22,26]},glasses:[40,44,54],
  top:{kind:"sweater",c:[62,120,112]},bottom:{c:[48,52,62]},shoe:[232,232,236],build:{sh:72,hip:58,h:0.99}};
// Marcus Porcius Cato, censor in 184 BC: red hair (Plutarch), a toga of undyed wool over a tunic, a senator's dark leather shoes. He's
// on no side, so his edge is neutral, as Linh's is
PEOPLE.cato={name:"Marcus Porcius Cato",role:"Censor",side:"Person",does:"uses",edge:[236,232,226],seed:31,
  skin:[214,170,132],hair:{style:"cropped",c:[150,82,48]},
  top:{kind:"toga",c:[236,228,208],rolled:true},bottom:{kind:"skirt",c:[226,214,190]},legs:[214,170,132],shoe:[78,52,42],build:{sh:72,hip:60,h:0.98}};
// the togate stance: the free right arm at his side, the left forearm across the waist, holding the toga's folds; he looks at the tablet
POSE.togate={L:[0.12,-0.06],R:[0.18,-1.36],feet:20,shift:2,tilt:0.02,turn:0.12,gaze:[0.3,0],look:0};

// a toga, drawn the character sheet's way: the tunic where the toga leaves it, then the wool, over the left shoulder, round under the
// right arm and down to the calf, its rolled edge across the chest and its folds falling from the left shoulder
const M4_TOGA=[236,228,208],M4_TUNIC=[218,206,182];
function m4_togaPath(ctx,sw,hw,y0,br,sh){ctx.beginPath();ctx.moveTo(20,y0+1);ctx.bezierCurveTo(-8,y0+30,-34,-390+br,-sw+4,-372+br);
  ctx.quadraticCurveTo(-sw-6,-330,-hw-10,-262);ctx.quadraticCurveTo(-hw-20,-170,-hw-26,-80);ctx.quadraticCurveTo(-4,-60+sh*0.3,hw+30,-88);
  ctx.quadraticCurveTo(hw+22,-200,sw+8,-322);ctx.quadraticCurveTo(sw+9,y0+30,sw-12,y0+8);ctx.quadraticCurveTo(40,y0-2,20,y0+1);ctx.closePath();}
function m4_toga(ctx,P,br,sh){const sw=P.build.sh,hw=P.build.hip,y0=-448+br,c=M4_TOGA;
  torsoPath(ctx,P,br,sh);litFill(ctx,M4_TUNIC,-sw,y0,sw,-250);seam(ctx,M4_TUNIC,0.45);
  m4_togaPath(ctx,sw,hw,y0,br,sh);litFill(ctx,c,-sw,y0,sw,-80,0.8);seam(ctx,c,0.5);
  ctx.save();m4_togaPath(ctx,sw,hw,y0,br,sh);ctx.clip();ctx.lineCap="round";
  // the shade under the rolled edge
  ctx.beginPath();ctx.moveTo(24,y0+16);ctx.bezierCurveTo(-4,y0+46,-30,-372+br,-sw+2,-352+br);ctx.strokeStyle=rgba(darken(c,0.18),0.5);ctx.lineWidth=16;ctx.stroke();
  // folds from the left shoulder, sweeping down across the body; and the hanging folds of the skirt
  ctx.strokeStyle=rgba(darken(c,0.34),0.55);ctx.lineWidth=2.2;
  for(const [x1,y1,qx,qy] of [[-hw-10,-206,-6,-320],[-hw-14,-130,4,-282],[-34,-86,22,-250],[4,-72,40,-230],[38,-90,58,-220]]){ctx.beginPath();ctx.moveTo(sw-16,y0+26);ctx.quadraticCurveTo(qx,qy,x1,y1);ctx.stroke();}
  ctx.strokeStyle=rgba(darken(c,0.3),0.4);ctx.lineWidth=1.8;
  for(const [x0,x1] of [[-40,-52],[-14,-20],[16,20]]){ctx.beginPath();ctx.moveTo(x0,-210);ctx.quadraticCurveTo((x0+x1)/2-6,-150,x1,-78);ctx.stroke();}
  ctx.restore();
  // the rolled edge, across the chest from the left shoulder to under the right arm
  ctx.beginPath();ctx.moveTo(22,y0+2);ctx.bezierCurveTo(-6,y0+30,-32,-388+br,-sw+6,-371+br);ctx.lineCap="round";
  ctx.strokeStyle=rgba(darken(c,0.42),0.6);ctx.lineWidth=21;ctx.stroke();ctx.strokeStyle=rgba(lighten(c,0.12),1);ctx.lineWidth=17;ctx.stroke();
  ctx.strokeStyle=rgba(darken(c,0.25),0.5);ctx.lineWidth=1.6;ctx.stroke();}
// the toga's end, over the left shoulder and down the front, over the arm that holds it
function m4_togaEnd(ctx,P,br){const sw=P.build.sh,y0=-448+br,c=M4_TOGA;ctx.beginPath();ctx.moveTo(sw-36,y0+4);ctx.quadraticCurveTo(sw-48,-300,sw-40,-168);
  ctx.quadraticCurveTo(sw-28,-138,sw-10,-156);ctx.quadraticCurveTo(sw+4,-300,sw-2,y0+14);ctx.closePath();litFill(ctx,lighten(c,0.05),sw-48,y0,sw+4,-140,0.8);seam(ctx,c,0.5);
  ctx.beginPath();ctx.moveTo(sw-20,y0+16);ctx.quadraticCurveTo(sw-28,-280,sw-24,-162);ctx.strokeStyle=rgba(darken(c,0.3),0.45);ctx.lineWidth=1.8;ctx.stroke();}
// a person in a toga: as person() draws one, but the arms come after the toga, so the hands show over its folds
function m4_togate(ctx,id,x,y,s,o){o=o||{};const P=PEOPLE[id],po=blendPose(POSE[o.pose||"togate"],POSE[o.pose2],o.mix),E=EXPR[o.expr||"calm"],t=o.t||0,k=s*P.build.h,
    br=Math.sin(t*1.7+P.seed)*1.4;
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,100);g.addColorStop(0,rgba([90,80,96],0.2));g.addColorStop(1,rgba([90,80,96],0));
  ctx.fillStyle=g;ell(ctx,0,-4,100,16);ctx.fill();ctx.restore();
  outlined(ctx,cx=>{legs(cx,P,po);limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P.skin,0.12),[-20,-470,20,-440]);m4_toga(cx,P,br,po.shift);
    arm(cx,P,-1,po.L,br,po);arm(cx,P,1,po.R,br,po);m4_togaEnd(cx,P,br);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt);cx.translate(0,-50+po.look*2);head(cx,P,E,po,t);cx.restore();},x,y,k,P.edge,[-250,-650,250,10],o.glow);}
// a person facing the other way when o.flip, so a hand that points stays in the frame
function m4_person(ctx,id,x,y,s,o){o=o||{};if(!o.flip)return person(ctx,id,x,y,s,o);ctx.save();ctx.translate(x,0);ctx.scale(-1,1);person(ctx,id,0,y,s,o);ctx.restore();}

/* ---------- the places ---------- */
// Rome before its marble: stucco on tuff, terracotta roofs and ornament, cypresses and stone pines
const M4C={stucco:[244,236,220],cella:[222,206,184],tuff:[214,196,164],terra:[204,112,74],roof:[194,110,80],trav:[232,222,200],
  cypress:[70,112,88],pine:[96,136,96],pineTrunk:[150,110,86],curia:[234,206,174],pave:[230,220,200],door:[116,90,72],shade:[198,184,160]};
// a cypress, tall and narrow
function m4_cypress(ctx,x,y,h,depth){wc_wash(ctx,[[x-h*0.07,y],[x-h*0.115,y-h*0.36],[x-h*0.085,y-h*0.74],[x,y-h],[x+h*0.08,y-h*0.72],[x+h*0.12,y-h*0.34],[x+h*0.065,y]],M4C.cypress,{depth,kind:"tree"});}
// a stone pine: a leaning trunk and a flat crown
function m4_pine(ctx,x,y,h,depth){wc_wash(ctx,[[x-h*0.03,y],[x+h*0.05,y-h*0.5],[x+h*0.1,y-h*0.76],[x+h*0.135,y-h*0.76],[x+h*0.09,y-h*0.48],[x+h*0.03,y]],M4C.pineTrunk,{depth,kind:"trunk"});
  const R=wc_rng(Math.round(x*5+h)),parts=[wc_ell(x+h*0.12,y-h*0.86,h*0.44,h*0.12,30)];
  for(let i=0;i<6;i++){const dx=(R()-0.5)*h*0.7,dy=(R()-0.6)*h*0.1;parts.push(wc_ell(x+h*0.12+dx,y-h*0.86+dy,h*(0.16+R()*0.1),h*(0.07+R()*0.04),22));}
  wc_wash(ctx,parts,M4C.pine,{depth,kind:"tree"});}
// a house on the Palatine: a block of stucco and a terracotta roof
function m4_house(ctx,x,y,w,depth){wc_part(ctx,wc_rect(x-w/2,y-w*0.55,w,w*0.55),M4C.stucco,depth);wc_part(ctx,[[x-w/2-6,y-w*0.55],[x+w/2+6,y-w*0.55],[x+w*0.3,y-w*0.78],[x-w*0.3,y-w*0.78]],M4C.roof,depth);
  wc_flat(ctx,wc_rect(x-w*0.12,y-w*0.3,w*0.16,w*0.3),M4C.door,depth);}
// a temple in the Etruscan way: a high podium, wide-spaced columns of stuccoed tuff, deep eaves, a low pediment and terracotta on the roof
function m4_temple(ctx,cx,base,k,depth,o){o=o||{};const C=M4C,w=(o.w||340)*k,ph=(o.ph||34)*k,ch=(o.ch||92)*k,n=o.n||6,top=base-ph-ch;
  wc_part(ctx,wc_rect(cx-w/2,base-ph,w,ph),C.tuff,depth);
  for(let i=0;i<4;i++)wc_flat(ctx,wc_rect(cx-w*0.16,base-ph+i*ph/4,w*0.32,2.4*k),wc_dim(C.tuff,0.18),depth);
  wc_part(ctx,wc_rect(cx-w/2+16*k,top,w-32*k,ch),C.cella,depth,{line:false});
  for(let i=0;i<n;i++){const x=cx-w/2+26*k+i*(w-52*k)/(n-1),cw=20*k;wc_part(ctx,wc_rect(x-cw/2,top+8*k,cw,ch-8*k),C.stucco,depth);wc_flat(ctx,wc_rect(x-cw/2-4*k,top+2*k,cw+8*k,8*k),C.stucco,depth);}
  wc_part(ctx,wc_rect(cx-w/2-14*k,top-20*k,w+28*k,22*k),C.stucco,depth);wc_flat(ctx,wc_rect(cx-w/2-12*k,top-12*k,w+24*k,7*k),C.terra,depth);
  const ap=top-20*k-46*k;wc_part(ctx,[[cx-w/2-26*k,top-20*k],[cx+w/2+26*k,top-20*k],[cx,ap]],C.roof,depth);
  wc_part(ctx,[[cx-w/2+16*k,top-26*k],[cx+w/2-16*k,top-26*k],[cx,ap+10*k]],C.shade,depth,{line:false});
  // terracotta figures on the roof: one on the ridge, one at each end
  for(const [x,y,s] of [[cx,ap,1],[cx-w/2-22*k,top-20*k,0.7],[cx+w/2+22*k,top-20*k,0.7]])wc_part(ctx,[[x-8*k*s,y],[x+8*k*s,y],[x+5*k*s,y-24*k*s],[x,y-30*k*s],[x-5*k*s,y-24*k*s]],C.terra,depth);}
// the senate house: a tall hall of stucco under a gabled roof
function m4_curia(ctx,x,base,depth){const C=M4C,w=220,h=150;wc_part(ctx,wc_rect(x,base-h,w,h),C.curia,depth);wc_part(ctx,[[x-10,base-h],[x+w+10,base-h],[x+w/2,base-h-54]],C.roof,depth);
  wc_flat(ctx,wc_rect(x+w/2-24,base-76,48,76),C.door,depth);for(const wx of [x+30,x+w-62])wc_flat(ctx,wc_rect(wx,base-h+30,32,40),wc_dim(C.curia,0.3),depth);}
// a long portico of the Forum, low behind the tablet
function m4_portico(ctx,x0,x1,base,depth){const C=M4C;wc_part(ctx,wc_rect(x0,base-96,x1-x0,96),C.cella,depth,{line:false});
  for(let x=x0+20;x<x1-10;x+=58)wc_part(ctx,wc_rect(x,base-90,14,90),C.stucco,depth);wc_part(ctx,[[x0-8,base-92],[x1+8,base-92],[x1-6,base-118],[x0+6,base-118]],C.roof,depth);}
const M4_CAP=x=>640-226*Math.exp(-Math.pow((x-660)/400,6))+5*Math.sin(x/90),M4_PAL=x=>604-74*Math.exp(-Math.pow((x-1660)/420,4))+5*Math.sin(x/130+1),M4_FL=706;
// 204 BC: the Capitoline with Jupiter's temple, the Palatine with its houses and pines, the Forum's portico, senate house and the temple
// of Castor, and its paving
function m4_forum(ctx){const P=WCP,C=M4C;wc_sky(ctx,640,9,{sun:[1590,150],clouds:4,cx:240,cw:1500,cy:70,ch:170});
  wc_land(ctx,x=>580+16*Math.sin(x/260+0.5)+8*Math.sin(x/90),[156,176,184],0.14,{line:false});
  wc_land(ctx,M4_PAL,P.mid2,0.4);
  for(const [x,w] of [[1360,64],[1450,86],[1560,60],[1690,92],[1830,76]])m4_house(ctx,x,M4_PAL(x)+16,w,0.44);
  for(const [x,h] of [[1500,140],[1620,166],[1760,132],[1890,154]])m4_pine(ctx,x,M4_PAL(x)+14,h,0.46);
  wc_land(ctx,M4_CAP,P.mid,0.5);
  wc_wash(ctx,[[920,M4_CAP(920)+2],[1040,M4_CAP(1040)+4],[1100,M4_FL],[960,M4_FL]],C.tuff,{depth:0.52,kind:"build"});
  m4_temple(ctx,650,M4_CAP(650)+6,1,0.56);
  m4_pine(ctx,240,M4_CAP(240)+10,150,0.56);m4_cypress(ctx,1000,M4_CAP(1000)+8,150,0.56);m4_cypress(ctx,420,M4_CAP(420)+8,120,0.56);
  m4_portico(ctx,260,1100,M4_FL,0.6);m4_curia(ctx,1130,M4_FL,0.62);
  m4_temple(ctx,1580,M4_FL,0.92,0.64,{w:300,ph:62,ch:116});
  m4_cypress(ctx,1392,M4_FL+4,230,0.66);m4_cypress(ctx,1792,M4_FL+4,250,0.66);m4_cypress(ctx,1850,M4_FL+6,200,0.66);
  wc_wash(ctx,[[-60,M4_FL],[W+60,M4_FL],[W+60,H+60],[-60,H+60]],C.pave,{depth:0.76,kind:"ground",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(C.pave,0.18),0.5);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=M4_FL+14+i*i*6;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-6);ctx.stroke();}
  for(let i=-12;i<26;i++){ctx.beginPath();ctx.moveTo(960+i*60,M4_FL);ctx.lineTo(960+i*200,1080);ctx.stroke();}ctx.restore();}
// today: the university's old building and its glass wing, a lawn, terraced houses across the street, a lamp (as One person, many roles)
const M4_LAWN=x=>664+5*Math.sin(x/300);
function m4_campus(ctx){const P=WCP;wc_sky(ctx,716,2,{sun:[1560,170]});
  wc_skyline(ctx,624,P.city,0.1,5);wc_treeRow(ctx,()=>640,-40,1980,58,70,0.24,21,P.leaf2);wc_land(ctx,M4_LAWN,P.lawn,0.42);
  wc_contact(ctx,140,770,668,0.46,0.22);wc_quad(ctx,150,668,0.46,0.62);wc_glassWing(ctx,762,668,150,170,0.48);
  [[1210,P.plaster],[1410,P.brickHouse,P.blueDoor],[1610,P.blueHouse],[1810,P.plaster]].forEach(([x,c,d])=>wc_terrace(ctx,x,742,232,c,0.56,{k:0.86,door:d}));
  wc_wash(ctx,[[1180,742],[W+60,742],[W+60,770],[1170,770]],P.hedge,{depth:0.6,kind:"hedge",lw:1.5});
  wc_roundTree(ctx,70,700,250,0.5);wc_roundTree(ctx,990,690,226,0.5,P.leaf2);wc_roundTree(ctx,1120,706,196,0.52);
  wc_wash(ctx,[[-60,782],[W+60,770],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.72,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth([[540,668],[560,720],[620,800],[740,900],[880,1090]],8),30,240),wc_lit(P.paving,0.08),{depth:0.62,kind:"path",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.14),0.55);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=800+i*i*5;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-10);ctx.stroke();}
  for(let i=-10;i<24;i++){ctx.beginPath();ctx.moveTo(960+i*54,782);ctx.lineTo(960+i*190,1080);ctx.stroke();}ctx.restore();
  wc_lamp(ctx,1186,846,300,0.72);}
// paper, with a little sky and a strip of land, for the chapters that explain
function m4_plain(ctx){wc_sky(ctx,836,3,{clouds:3});wc_land(ctx,x=>826+16*Math.sin(x/320+1),WCP.far,0.35,{line:false});wc_land(ctx,x=>882+10*Math.sin(x/240),WCP.near,0.75,{line:false});}
// the data architect's office: a warm wall, a tall window onto the campus, a floor
function m4_office(ctx){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,900),P.wallIn,{kind:"plaster",line:false});wc_wash(ctx,wc_rect(-40,858,W+80,260),P.floor,{kind:"ground",line:false});
  wc_wash(ctx,wc_rect(-40,846,W+80,18),wc_dim(P.wallIn,0.14),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.beginPath();ctx.rect(72,112,436,560);ctx.clip();wc_sky(ctx,560,4,{clouds:2,cx:80,cw:380,cy:150,ch:120});
  wc_land(ctx,x=>600+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_part(ctx,wc_rect(330,330,70,270),WCP.stone,0.4);wc_part(ctx,[[322,330],[408,330],[365,250]],WCP.slate,0.4);
  wc_roundTree(ctx,150,640,220,0.5);wc_roundTree(ctx,460,650,190,0.5,P.leaf2);ctx.restore();
  for(const r of [wc_rect(60,100,460,16),wc_rect(60,100,16,584),wc_rect(504,100,16,584),wc_rect(282,100,16,584),wc_rect(60,384,460,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(40,676,500,22),wc_dim(P.wallIn,0.1),{kind:"trim",lw:1.5});}
// a terraced house up close, for the energy company: its brick front, a window, the blue door, the meter beside it; the next house's
// front at either side, the pavement
const M4_DOOR=[1250,316,214,392];
function m4_street(ctx){const P=WCP;wc_sky(ctx,620,13,{sun:[1700,120],clouds:2,cx:900,cw:900,cy:40,ch:80});
  wc_part(ctx,wc_rect(-40,40,330,700),P.blueHouse,0.7);wc_part(ctx,wc_rect(1640,40,320,700),P.plaster,0.7);
  wc_part(ctx,wc_rect(290,30,1350,710),P.brickHouse,0.74);
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.brickHouse,0.28),0.32);ctx.lineWidth=2;for(let y=60;y<740;y+=26){ctx.beginPath();ctx.moveTo(296,y);ctx.lineTo(1634,y);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(270,22,1390,26),P.tile,0.74);
  // the window, the door and its fanlight, the step
  wc_flat(ctx,wc_rect(452,214,452,382),P.trim,0.76);wc_wash(ctx,wc_rect(474,236,408,338),P.pane,{depth:0.76,kind:"window",line:false});wc_bars(ctx,474,236,408,338,P.trim,6,0.76);
  wc_flat(ctx,wc_rect(436,588,484,24),wc_lit(P.stone,0.2),0.76);
  const [dx,dy,dw,dh]=M4_DOOR;wc_flat(ctx,wc_rect(dx-16,dy-80,dw+32,dh+80),P.trim,0.76);wc_wash(ctx,wc_arched(dx,dy-66,dw,90),P.pane,{depth:0.76,kind:"window",line:false});
  wc_wash(ctx,wc_rect(dx,dy,dw,dh),P.blueDoor,{depth:0.78,kind:"door",lw:2});wc_flat(ctx,wc_rect(dx+dw-46,dy+dh*0.5,10,26),[226,190,90],0.8);
  wc_flat(ctx,wc_rect(dx-30,dy+dh-6,dw+60,22),wc_lit(P.stone,0.15),0.8);
  m4_meterBox(ctx,1530,452);
  wc_wash(ctx,[[-60,740],[W+60,740],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.8,kind:"ground",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.16),0.5);ctx.lineWidth=2;for(let x=-40;x<W+60;x+=120){ctx.beginPath();ctx.moveTo(x,742);ctx.lineTo(x-60,H);ctx.stroke();}
  for(let i=0;i<4;i++){const y=790+i*i*28;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y);ctx.stroke();}ctx.restore();}
// the meter, on the wall by the door
function m4_meterBox(ctx,x,y){wc_wash(ctx,wc_rrPts(x,y,96,128,10),[206,206,214],{kind:"build",lw:1.6});wc_wash(ctx,wc_ell(x+48,y+52,28,28,28),WC_PAPER,{kind:"clock",lw:1.5});
  ctx.save();ctx.strokeStyle=rgba(WC_INK,0.9);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+48,y+52);ctx.lineTo(x+64,y+36);ctx.stroke();ctx.restore();
  wc_wash(ctx,wc_rect(x+22,y+96,52,16),[90,96,110],{kind:"trim",flat:true});}
const WC_PLACES={forum:m4_forum,campus:m4_campus,plain:m4_plain,office:m4_office,street:m4_street};
function m4_place(ctx,key){ctx.drawImage(wc_place(key),0,0,W,H);}
// a veil of paper over the whole frame, so what's drawn after it stands out
function m4_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}

/* ---------- 1. a ladder of offices ---------- */
// the offices are one kind of thing, so they share one colour, a terracotta wash, and wear no role's
const M4_TERRA=[206,112,70],M4_TERRAINK=[146,64,34];
// his offices, as the tablet has them: the year it began (BC), how long it lasted, its name
const M4_OFF=[[204,1,"quaestor"],[199,1,"aedile"],[198,1,"praetor"],[195,1,"consul"],[184,1.5,"censor"]];
// the stone tablet: a slab of travertine with a handle at each side, on a pedestal; its panel (x is its middle)
const M4_TB={x:760,y:496,w:480,h:300};
function m4_tabletPaper(){const B=M4_TB;return wc_kept("tablet",B.w+260,B.h+560,q=>{q.translate(130,40);const C=M4C,w=B.w,h=B.h;
  wc_part(q,wc_rect(40,h+196,w-80,22),wc_dim(C.trav,0.04),0.9);wc_part(q,wc_rect(70,h+18,w-140,180),C.trav,0.9);wc_part(q,wc_rect(50,h,w-100,20),wc_dim(C.trav,0.04),0.9);
  wc_part(q,[[0,h*0.3],[-64,h*0.14],[-64,h*0.86],[0,h*0.7]],wc_dim(C.trav,0.03),0.9);wc_part(q,[[w,h*0.3],[w+64,h*0.14],[w+64,h*0.86],[w,h*0.7]],wc_dim(C.trav,0.03),0.9);
  wc_part(q,wc_rect(0,0,w,h),C.trav,0.9);wc_ink(q,wc_rect(18,18,w-36,h-36),true,1.6,[120,108,92],0.7,5,0.8);wc_ink(q,wc_rect(26,26,w-52,h-52),true,1,[150,138,120],0.5,7,0.8);
  const R=wc_rng(77);q.strokeStyle=rgba([176,160,132],0.5);q.lineWidth=1.4;for(let i=0;i<90;i++){const x=R()*(w-20)+10,y=R()*(h+190)+(R()<0.6?0:h-10);if(y>h&&(x<80||x>w-80))continue;q.beginPath();q.moveTo(x,y);q.lineTo(x+3+R()*6,y+R()*1.2);q.stroke();}});}
function m4_tablet(ctx){const B=M4_TB;ctx.drawImage(m4_tabletPaper(),B.x-B.w/2-130,B.y-40);}
// text cut into the stone as p goes 0 to 1, with a little dust where the chisel is
function m4_carve(ctx,s,x,y,size,wt,p){if(p<=0)return;const w=tw(ctx,s,size,wt),x0=x-w/2,q=clamp(p,0,1);ctx.save();ctx.beginPath();ctx.rect(x0-4,y-size*1.1,w*q+8,size*1.5);ctx.clip();
  wc_T(ctx,s,x0+1.3,y+1.5,{w:wt,size,col:[255,250,238],a:0.7});wc_T(ctx,s,x0,y,{w:wt,size,col:[90,76,64],a:0.94});ctx.restore();
  if(q<1){const cx=x0+w*q;ctx.save();ctx.fillStyle=rgba([246,238,220],0.9);for(let i=0;i<5;i++){const u=(q*9+i*0.37)%1;ctx.beginPath();ctx.arc(cx+(hash(i,3)-0.5)*16+u*6,y-size*0.4+u*34,1.6+hash(i,5)*1.6,0,TAU);ctx.fill();}ctx.restore();}}
// the tablet's lines: his name, and each office with its year
const M4_TLY=[618,664,710,756],M4_TNY=560;
const m4_offLine=i=>M4_OFF[i][0]+" BC · "+M4_OFF[i][2];
// the ladder: his offices as terracotta bands on a line of years, one rung each, on a sheet (x is a year BC)
const M4_ST={x:1060,y:160,w:820,h:600},M4_STY=[620,556,492,428,364],M4_STAX=676;
const m4_bc=y=>1120+(205-y)*31;
function m4_ladderSheet(ctx){const S=M4_ST;wc_panel(ctx,S.x,S.y,S.w,S.h,{kind:"sheet",seed:12});}
// the years under the ladder: a line, and every fifth year
function m4_bcAxis(ctx,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(m4_bc(205.6),M4_STAX);ctx.lineTo(m4_bc(181.8),M4_STAX);ctx.stroke();
  for(const y of [205,200,195,190,185]){ctx.beginPath();ctx.moveTo(m4_bc(y),M4_STAX-8);ctx.lineTo(m4_bc(y),M4_STAX+8);ctx.stroke();}ctx.restore();
  for(const y of [205,200,195,190,185])wc_T(ctx,y+" BC",m4_bc(y),M4_STAX+44,{w:600,size:28,align:"center",col:WC_MUTED});});}
// a terracotta band: kept once per size, drawn at (x,y) its top-left
function m4_terraBand(ctx,x,y,w,h,a){const c=wc_kept("terra"+Math.round(w)+"x"+Math.round(h),Math.round(w)+20,Math.round(h)+20,q=>wc_wash(q,wc_resample(wc_rect(10,10,w,h),6),M4_TERRA,{kind:"swatch",line:false,a:0.9,seed:Math.round(w)}));
  withA(ctx,a==null?1:a,()=>{ctx.drawImage(c,x-10,y-10);wc_ink(ctx,wc_rect(x,y,w,h),true,1.6,wc_dim(M4_TERRA,0.45),0.7,Math.round(x),0.6);});}
// an office on the ladder, its band and its name (the censor's name is to the left of its band, at the frame's edge)
function m4_rung(ctx,i,a,na){const [y0,d,name]=M4_OFF[i],x=m4_bc(y0),w=d*31,yc=M4_STY[i];m4_terraBand(ctx,x,yc-20,w,40,a);
  if(na>0.01)withA(ctx,na,()=>wc_T(ctx,name,i===4?x-14:x+w+14,yc+10,{w:800,size:30,align:i===4?"right":"left",col:M4_TERRAINK}));}
// a start and an end: a small pencil mark at each edge of a band
function m4_ends(ctx,i,p){if(p<=0)return;const [y0,d]=M4_OFF[i],x=m4_bc(y0),w=d*31,yc=M4_STY[i];ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.6;ctx.lineCap="round";
  [[x,0],[x+w,0.5]].forEach(([xx,o])=>{const q=clamp((p-o)/0.5,0,1);if(q<=0)return;ctx.beginPath();ctx.moveTo(xx,yc-30);ctx.lineTo(xx,yc-30+60*ease(q));ctx.stroke();});ctx.restore();}
// the census list: a scroll that unrolls over the tablet as u goes 0 to 1; its rows, written in as the narration names them
const M4_SCR={x:360,y:150,w:680,h:470};
const M4_CENS=[["Gaius Annius","34","a farm, two oxen"],["Quintus Ovinius","51","a house, a vineyard"],["Lucius Pinarius","27","a workshop"],["Titus Vettius","45","a horse, a field"]];
function m4_roll(ctx,x,y,w){const c=wc_kept("roll"+w,w+60,60,q=>{wc_wash(q,wc_rrPts(30,14,w,32,16),[226,206,166],{kind:"build",lw:1.5});
    for(const hx of [8,w+30])wc_wash(q,wc_rrPts(hx,6,22,48,9),[150,104,72],{kind:"build",lw:1.3});});ctx.drawImage(c,x-30,y-30);}
function m4_scroll(ctx,t,u,o){const S=M4_SCR,h=Math.max(40,S.h*ease(clamp(u,0,1)));if(u<=0)return;
  const c=wc_kept("scroll",S.w+20,S.h+20,q=>wc_wash(q,wc_rect(10,10,S.w-20,S.h),WCP.parchment,{kind:"page",lw:2,seed:9}));
  ctx.save();ctx.beginPath();ctx.rect(S.x,S.y,S.w,h);ctx.clip();ctx.drawImage(c,S.x,S.y);
  const L=S.x+40,cA=S.x+330,cP=S.x+386,hy=S.y+76;
  withA(ctx,fin(t,o.head,0.5),()=>{[["citizen",L],["age",cA],["property",cP]].forEach(([s,x],k)=>wc_T(ctx,s,x,hy,{w:700,size:28,col:WCP.parchInk,align:k===1?"right":"left",a:0.75}));
    ctx.strokeStyle=rgba(WCP.parchInk,0.35);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(L,hy+16);ctx.lineTo(S.x+S.w-40,hy+16);ctx.stroke();});
  M4_CENS.forEach(([n,a,pr],i)=>{const y=hy+70+i*64;wc_hand(ctx,n,L,y,{p:clamp((t-o.names-i*0.22)/0.5,0,1),size:30,col:WCP.parchInk});
    wc_hand(ctx,a,cA-tw(ctx,a,30,600),y,{p:clamp((t-o.ages-i*0.1)/0.25,0,1),size:30,col:WCP.parchInk});
    wc_hand(ctx,pr,cP,y,{p:clamp((t-o.props-i*0.18)/0.5,0,1),size:28,col:WCP.parchInk});});
  ctx.restore();m4_roll(ctx,S.x+10,S.y-2,S.w-20);m4_roll(ctx,S.x+10,S.y+h,S.w-20);}

/* ---------- 2. census date ---------- */
// a calendar page, pinned up: the month, the day, and "census date" written under it (the word "census" lands as o.land goes 0 to 1)
const M4_CAL={x:96,y:150,w:330,h:400},M4_SLATE=[96,112,146];
function m4_calendar(ctx,t,o){const C=M4_CAL;wc_panel(ctx,C.x,C.y,C.w,C.h,{kind:"card",seed:14});
  const hc=wc_kept("calHead",C.w,80,q=>wc_wash(q,wc_resample(wc_rect(10,10,C.w-20,60),8),M4_SLATE,{kind:"swatch",line:false,a:0.85,seed:5}));ctx.drawImage(hc,C.x,C.y);
  wc_T(ctx,"March 2026",C.x+C.w/2,C.y+54,{w:800,size:30,align:"center",col:[252,250,244]});
  wc_T(ctx,"31",C.x+C.w/2,C.y+232,{w:800,size:132,align:"center",col:WC_DARK});
  if(o.date>0)wc_hand(ctx,"date",C.x+C.w/2+16,C.y+336,{p:o.date,size:40,col:WC_PENCIL});
  ctx.save();ctx.fillStyle=rgba([196,72,60],1);ctx.beginPath();ctx.arc(C.x+C.w/2,C.y-4,9,0,TAU);ctx.fill();ctx.fillStyle=rgba([255,255,255],0.6);ctx.beginPath();ctx.arc(C.x+C.w/2-3,C.y-7,3,0,TAU);ctx.fill();ctx.restore();}
// a question someone asks: a card with the asker's colour behind their name, and the question typed in as q goes 0 to 1
function m4_ask(ctx,x,y,w,h,col,who,q,qa,o){o=o||{};const tW=tw(ctx,who,30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:col,sw:tW+36,seed:o.seed||who.length});
  wc_T(ctx,who,x+32,y+48,{w:800,size:30,col:WC_DARK});if(qa>0)(o.lines||[q]).forEach((l,i)=>wc_T(ctx,typeOn(l,clamp(qa*(o.lines?o.lines.length:1)-i,0,1)),x+32,y+(o.qy||104)+i*42,{w:700,size:30,col:WC_DARK}));}
// the ghost of One person, many roles' email: come back for a master's
function m4_ghost(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{wc_panel(ctx,x,y,520,64,{kind:"card",dashed:true,role:WC_ROLE.alumna,seed:3});wc_envelope(ctx,x+50,y+32,0.42,-0.05);
  wc_T(ctx,"Come back for a master's",x+92,y+42,{w:700,size:28,col:WC_INK});});}

/* ---------- 3. true for a day ---------- */
// a status, rubbed out and written again each night: how far it's written (p) and how far it's rubbed out (rub), at time t; first is when
// it's first written, n the nights, d this row's delay
function m4_night(t,first,n,d){let p=clamp((t-first)/0.5,0,1),rub=0;for(let j=1;j<n.length;j++){const u=t-n[j]-d;if(u>=0&&u<0.9){rub=u<0.35?u/0.35:0;p=u<0.35?1:clamp((u-0.35)/0.45,0,1);}}return{p,rub};}
// the rubber's smudge over a word w wide
function m4_rubOut(ctx,x,y,w,rub){if(rub<=0)return;ctx.save();ctx.strokeStyle=rgba([206,198,190],0.85*Math.sin(rub*Math.PI));ctx.lineWidth=14;ctx.lineCap="round";ctx.beginPath();
  for(let s=0;s<6;s++)ctx.lineTo(x-6+s*(w+12)/6,y-(s%2?2:20));ctx.stroke();ctx.restore();}
// the four systems, each with its role's colour, Linh's name and how it sees her today (o.night: its status, written and rubbed out)
const M4_SYS=[["student","student system","enrolled","from 21 Jul 2025"],["tutor","HR","casual staff","23 Feb – 27 Jun 2026"],["researcher","research office","project member","2 Mar – 19 Dec 2026"],
  ["alumna","alumni office","graduate","since 15 Dec 2022"]];
const M4_SX=[70,520,970,1420],M4_SY=96,M4_SW=430,M4_SH=228;
function m4_sys(ctx,t,i,o){o=o||{};const [r,name,st,dates]=M4_SYS[i],x=M4_SX[i],y=M4_SY,tW=tw(ctx,name,30,800);
  wc_panel(ctx,x,y,M4_SW,M4_SH,{kind:"card",role:WC_ROLE[r],sw:tW+36,seed:20+i});wc_T(ctx,name,x+32,y+48,{w:800,size:30,col:WC_DARK});
  wc_T(ctx,"Linh Nguyen",x+32,y+96,{w:600,size:28,col:WC_MUTED});
  const nt=o.night||{p:o.st||0,rub:0};if(nt.p>0)wc_hand(ctx,st,x+32,y+150,{p:nt.p,size:32,col:WC_ROLEINK[r],a:1-nt.rub*0.9});m4_rubOut(ctx,x+32,y+150,tw(ctx,st,32,600),nt.rub);
  if(o.dates>0)wc_hand(ctx,dates,x+32,y+200,{p:o.dates,size:30,col:WC_DARK});}
// the platform's copy: one row per system, rubbed out and written again each night, under the date of the night's copy
const M4_BX=560,M4_BY=470,M4_BW=700,M4_BH=300;
function m4_copy(ctx,t,o){wc_panel(ctx,M4_BX,M4_BY,M4_BW,M4_BH,{kind:"card",wash:WC_SIDE.tech,washA:0.16,seed:31});
  wc_T(ctx,"the platform's copy",M4_BX+32,M4_BY+50,{w:800,size:30,col:WC_DARK});
  // the night's date turns over: each night's date slides up and out as the next one comes in
  const dts=["30 Mar","31 Mar","1 Apr"],n=o.nights,dx=M4_BX+M4_BW-30;let k=0;for(let i=0;i<n.length;i++)if(t>=n[i])k=i;
  const turn=clamp((t-n[k])/0.4,0,1);ctx.save();ctx.beginPath();ctx.rect(dx-170,M4_BY+14,170,52);ctx.clip();
  if(k>0&&turn<1)wc_T(ctx,dts[k-1],dx,M4_BY+50-24*ease(turn),{w:500,size:28,f:"mono",align:"right",a:1-turn});
  wc_T(ctx,dts[k],dx,M4_BY+50+(k>0?24*(1-ease(turn)):0),{w:500,size:28,f:"mono",align:"right",a:k>0?ease(turn):1});ctx.restore();
  if(o.ring>0)wc_ring(ctx,dx-50,M4_BY+40,72,28,o.ring,{seed:13});
  M4_SYS.forEach(([r,name,st],i)=>{const y=M4_BY+118+i*46,on=o.rows[i];if(on<=0)return;withA(ctx,clamp(on*3,0,1),()=>{ctx.fillStyle=rgba(WC_ROLE[r],1);ctx.beginPath();ctx.arc(M4_BX+44,y-9,8,0,TAU);ctx.fill();
    wc_T(ctx,name,M4_BX+64,y,{w:600,size:28,col:WC_MUTED});});
    // each night: rubbed out, then written again
    const {p,rub}=m4_night(t,o.first[i],n,i*0.08),vx=M4_BX+340;if(p>0)wc_hand(ctx,st,vx,y,{p,size:30,col:WC_ROLEINK[r],a:1-rub*0.9});m4_rubOut(ctx,vx,y,tw(ctx,st,30,600),rub);});}
// the moon, each night
function m4_moon(ctx,x,y,a,glow){if(a<=0.01)return;withA(ctx,a,()=>{if(glow>0.01){const g=ctx.createRadialGradient(x,y,4,x,y,90);g.addColorStop(0,rgba([255,236,170],0.5*glow));g.addColorStop(1,rgba([255,236,170],0));ctx.fillStyle=g;ctx.fillRect(x-90,y-90,180,180);}
  const c=wc_kept("moon",120,120,q=>{q.translate(60,60);wc_wash(q,[...Array(28)].map((_,i)=>{const an=-Math.PI/2+i/27*Math.PI*2;return[Math.cos(an)*40,Math.sin(an)*40];}),[244,214,120],{kind:"build",lw:1.4,seed:4});
    q.globalCompositeOperation="destination-out";q.beginPath();q.arc(20,-10,36,0,TAU);q.fill();});ctx.drawImage(c,x-60,y-60);});}
// Planning's card, asking about last year's census date, and its answer
function m4_planAsk(ctx,t,x,y,o){const w=560,h=300,tW=tw(ctx,"Planning",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:M4_SLATE,sw:tW+36,seed:41});
  wc_T(ctx,"Planning",x+32,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,typeOn("students who also work here",o.q),x+32,y+98,{w:600,size:28,col:WC_INK});
  if(o.asat>0)withA(ctx,o.asat,()=>wc_badge(ctx,x+32,y+150,"as at 31 Mar 2025"));
  if(o.ans>0){wc_tick(ctx,x+50,y+214,30,WC_ROLEINK.student,clamp(o.ans/0.4,0,1),4);withA(ctx,clamp((o.ans-0.3)/0.4,0,1),()=>{wc_T(ctx,"Linh Nguyen",x+82,y+226,{w:700,size:28,col:WC_DARK});
    wc_T(ctx,"student",x+82+tw(ctx,"Linh Nguyen  ",28,700),y+226,{w:700,size:28,col:WC_ROLEINK.student});wc_T(ctx,"works here",x+82,y+268,{w:600,size:28,col:WC_MUTED});});}}

/* ---------- 4 to 7, and 10. Linh's timeline ---------- */
// dates as years with a fraction, so they sit on a line: "2026-03-31" is 2026.246
function m4_d(s){const [y,m,d]=s.split("-").map(Number),t0=Date.UTC(y,0,1),t1=Date.UTC(y+1,0,1);return y+(Date.UTC(y,m-1,d)-t0)/(t1-t0);}
// the rows, in One person, many roles' order of her bands, with applicant last; who owns each kind of role
const M4_ROWS=["student","tutor","researcher","alumna","applicant"];
const M4_OWN={student:"registrar's office",tutor:"HR",researcher:"research office",alumna:"alumni office",applicant:"admissions"};
// her roles, dated: from is inclusive, to exclusive, and an open role has no end. The tutor's one band is One person, many roles' picture;
// HR's contracts, one each semester, replace it in chapter 5
const M4_PER=[{k:"app1",r:"applicant",a:"2018-08-13",b:"2019-02-25"},{k:"stu1",r:"student",a:"2019-02-25",b:"2022-12-15"},{k:"alu",r:"alumna",a:"2022-12-15",b:null},
  {k:"tut",r:"tutor",a:"2023-02-20",b:null},{k:"app2",r:"applicant",a:"2025-06-02",b:"2025-07-21"},{k:"stu2",r:"student",a:"2025-07-21",b:null},{k:"res",r:"researcher",a:"2026-03-02",b:"2026-12-19"}];
const M4_TERMS=[["S1","2023-02-20","2023-06-30"],["S2","2023-07-17","2023-11-24"],["S1","2024-02-19","2024-06-28"],["S2","2024-07-15","2024-11-22"],["S1","2025-02-24","2025-06-27"],
  ["S2","2025-07-21","2025-11-21"],["S1","2026-02-23","2026-06-27"]];
M4_PER.forEach(p=>{p.A=m4_d(p.a);p.B=p.b?m4_d(p.b):null;});
const M4_TUT=M4_TERMS.map(([s,a,b],i)=>({k:"t"+i,r:"tutor",s,a,b,A:m4_d(a),B:m4_d(b)}));
// the story's today: after the census report was published, in April 2026; census date, and the same day a year before
const M4_NOW=m4_d("2026-04-20"),M4_CEN=m4_d("2026-03-31"),M4_CEN0=m4_d("2025-03-31");
// her white figure at the left: each band on her sits at the height of its row
const M4_FX=200,M4_FY=872,M4_FS=1.25,M4_LX=330,M4_X0=760,M4_X1=1880,M4_AXY=732;
const m4_rowY=i=>wc_bandY("linh",M4_FS,M4_FY,i),M4_ROWH=44;
// the years in view, set by each scene: the line of years can close in on a few months, so the figure and the rows stay where they are
let M4_R=[2018.5,2027];
const m4_x=y=>M4_X0+(y-M4_R[0])/(M4_R[1]-M4_R[0])*(M4_X1-M4_X0),m4_pxy=()=>(M4_X1-M4_X0)/(M4_R[1]-M4_R[0]);
// keys are [time, from year, to year], each change eased over d seconds, as the camera moves
function m4_range(t,keys,d){d=d||1.6;let a=keys[0][1],b=keys[0][2];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
  // ease the span's logarithm, so closing in feels even
  const s0=Math.log(b-a),s1=Math.log(keys[i][2]-keys[i][1]),m0=(a+b)/2,m1=(keys[i][1]+keys[i][2])/2,s=Math.exp(lerp(s0,s1,u)),m=lerp(m0,m1,u);a=m-s/2;b=m+s/2;}
  M4_R=[a,b];return M4_R;}
// her figure, banded in a[i] of each row's colour
function m4_fig(ctx,a,o){wc_white(ctx,"linh",M4_FX,M4_FY,M4_FS,M4_ROWS.map((r,i)=>({col:WC_ROLE[r],a:a[i]||0,i})),o);}
// which of her rows have a role open on date d (soft at the edges, so bands never blink); split: the tutor as HR's contracts
function m4_periods(split){return split?M4_PER.filter(p=>p.k!=="tut").concat(M4_TUT):M4_PER;}
function m4_openAt(d,split){const a=[0,0,0,0,0];for(const p of m4_periods(split)){const B=p.B==null?1e9:p.B;if(d>=p.A&&d<B){const e=Math.min(d-p.A,B-d);const i=M4_ROWS.indexOf(p.r);a[i]=Math.max(a[i],clamp(e/0.01,0,1));}}return a;}
// a row's lane: a pale wash of its colour from the figure to the right edge, kept
function m4_lane(ctx,i,a){if(a<=0.01)return;const r=M4_ROWS[i],c=wc_kept("lane"+i,M4_X1-M4_FX+40,70,q=>wc_wash(q,wc_resample(wc_rect(20,13,M4_X1-M4_FX,44),10),WC_ROLE[r],{kind:"chipwash",line:false,a:0.16,seed:50+i*7}));
  withA(ctx,a,()=>ctx.drawImage(c,M4_FX-20,m4_rowY(i)-35));}
// a row's name, and its owner beside it
let M4_OX=0;
function m4_label(ctx,i,a,oa){const r=M4_ROWS[i],y=m4_rowY(i)+10;if(!M4_OX)M4_OX=M4_LX+Math.max(...M4_ROWS.map(s=>tw(ctx,s,30,800)))+22;
  if(a>0.01)withA(ctx,a,()=>wc_T(ctx,r,M4_LX,y,{w:800,size:30,col:WC_ROLEINK[r]}));if(oa>0.01)withA(ctx,oa,()=>wc_T(ctx,M4_OWN[r],M4_OX,y,{w:600,size:28,col:WC_MUTED}));}
// a period: a strip of its role's wash, painted once and kept, of which each period shows a slice, so it can grow and shrink with the
// years in view without stretching its paint; a pencil edge; open at the right if it hasn't ended, and faint and dashed where it's ahead
const M4_STW=1900;
function m4_strip(r){return wc_kept("strip:"+r,M4_STW,64,q=>wc_wash(q,wc_resample(wc_rect(0,10,M4_STW,M4_ROWH),10),mix(WC_ROLE[r],[255,255,255],0.12),{kind:"swatch",line:false,a:0.86,seed:7+r.length*13}));}
function m4_slice(ctx,r,x0,x1,yc,a,seed){if(x1-x0<0.5||a<=0.004)return;const c=m4_strip(r);let sx=(seed*211)%(M4_STW-600),x=x0;ctx.save();ctx.globalAlpha*=a;
  while(x<x1-0.5){const w=Math.min(x1-x,M4_STW-sx);ctx.drawImage(c,sx,0,w,64,x,yc-32,w,64);x+=w;sx=0;}ctx.restore();}
// a slice whose opacity changes along it: drawn in short pieces where it fades
function m4_ramp(ctx,r,x0,x1,yc,seed,af){const n=Math.max(1,Math.ceil((x1-x0)/10));if(typeof af!=="function"){m4_slice(ctx,r,x0,x1,yc,af.flat,seed);return;}
  for(let i=0;i<n;i++){const a=x0+(x1-x0)*i/n,b=x0+(x1-x0)*(i+1)/n;m4_slice(ctx,r,a,b+0.6,yc,af((a+b)/2),seed);}}
function m4_edge(ctx,pts,a,dash){if(a<=0.01)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";if(dash)ctx.setLineDash(dash);
  for(const [k,aa,lw] of [[0,0.72,1.9],[1,0.3,1.1]]){ctx.beginPath();pts.forEach(([x,y],j)=>{const xx=x+k*0.8,yy=y-k*0.7;j?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);});ctx.strokeStyle=rgba(WC_PENCIL,aa*a);ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
function m4_per(ctx,p,yc,o){o=o||{};const pr=o.p==null?1:o.p,A=o.a==null?1:o.a;if(pr<=0||A<=0.004)return;const open=p.B==null,xs=m4_x(p.A),xeFull=open?M4_X1+60:m4_x(p.B),
    xe=lerp(xs,xeFull,ease(clamp(pr,0,1))),L=Math.max(xs,M4_X0-6),R=Math.min(xe,M4_X1);if(R-L<0.5)return;const xn=o.noFuture?1e9:m4_x(M4_NOW),seed=o.seed||p.k.length*7+Math.round(p.A*3);
  // its opacity along it: fading in from the left edge of the years in view, fading out where an open role runs off the right, and
  // faint where it's ahead of today
  const fadeL=xs<M4_X0-6,fadeR=open&&xe>M4_X1-90;
  const af=x=>A*(fadeL?clamp((x-M4_X0+6)/50,0,1):1)*(fadeR?clamp((M4_X1-x)/90,0,1):1)*(x>xn?0.4:1);
  if(!fadeL&&!fadeR&&(R<=xn||L>=xn))m4_ramp(ctx,p.r,L,R,yc,seed,{flat:af((L+R)/2)});else m4_ramp(ctx,p.r,L,R,yc,seed,af);
  // the pencil: top and bottom; the start if it's in view; the end if it has one, dashed if it's ahead
  const t=yc-M4_ROWH/2,b=yc+M4_ROWH/2,ea=A*(fadeL?0.5:1);
  const pc=Math.min(R,xn),fadeEdge=fadeR?Math.min(R,M4_X1-90):R;
  if(pc>L){m4_edge(ctx,[[Math.max(L,fadeL?M4_X0+30:L),t],[Math.min(pc,fadeEdge),t]],ea);m4_edge(ctx,[[Math.max(L,fadeL?M4_X0+30:L),b],[Math.min(pc,fadeEdge),b]],ea);}
  if(R>xn&&fadeEdge>Math.max(L,xn)){m4_edge(ctx,[[Math.max(L,xn),t],[fadeEdge,t]],ea*0.8,[8,8]);m4_edge(ctx,[[Math.max(L,xn),b],[fadeEdge,b]],ea*0.8,[8,8]);}
  if(!fadeL&&xs>=M4_X0-6)m4_edge(ctx,[[xs,t],[xs,b]],ea);
  if(!open&&pr>=0.98&&xeFull<=M4_X1)m4_edge(ctx,[[xeFull,t],[xeFull,b]],ea,xeFull>xn?[8,8]:null);}
// the line of years: a pencil line with a tick at each new year, each year's name in the middle of what's in view of it; when it closes
// in on months, the quarters are named too, and the years move to a second line
function m4_axis(ctx,a){if(a<=0.01)return;const [ya,yb]=M4_R,q=sstep(300,460,m4_pxy());withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.75);ctx.lineWidth=2.4;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(M4_X0,M4_AXY);ctx.lineTo(M4_X1,M4_AXY);ctx.stroke();
    for(let y=Math.ceil(ya);y<=yb;y++){const x=m4_x(y);if(x<M4_X0||x>M4_X1)continue;ctx.beginPath();ctx.moveTo(x,M4_AXY-10);ctx.lineTo(x,M4_AXY+10);ctx.stroke();}
    if(q>0.01){ctx.lineWidth=1.8;for(let m=Math.ceil(ya*12);m<=yb*12;m++){if(m%12===0)continue;const x=m4_x(m/12);if(x<M4_X0||x>M4_X1)continue;ctx.strokeStyle=rgba(WC_PENCIL,0.5*q);ctx.beginPath();ctx.moveTo(x,M4_AXY-5);ctx.lineTo(x,M4_AXY+5);ctx.stroke();}}ctx.restore();
    const MO=["Jan","Apr","Jul","Oct"];
    if(q>0.01)withA(ctx,q,()=>{for(let k=Math.ceil(ya*4);k<=yb*4;k++){const x=m4_x(k/4);if(x<M4_X0+20||x>M4_X1-20)continue;wc_T(ctx,MO[((k%4)+4)%4],x,M4_AXY+40,{w:500,size:28,f:"mono",align:"center",col:WC_MUTED});}});
    for(let y=Math.floor(ya);y<=yb;y++){const x0=Math.max(m4_x(y),M4_X0),x1=Math.min(m4_x(y+1),M4_X1);if(x1-x0<74)continue;
      wc_T(ctx,String(y),(x0+x1)/2,M4_AXY+40+q*38,{w:q>0.5?700:500,size:28,f:"mono",align:"center",col:q>0.5?WC_INK:WC_MUTED});}});}
// a pencil line, straight down at x from y0 to y1, drawn on as p goes 0 to 1
function m4_rule(ctx,x,y0,y1,p,o){o=o||{};if(p<=0)return;const ye=lerp(y0,y1,ease(clamp(p,0,1)));ctx.save();ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  for(const [k,aa,lw] of [[0,0.92,o.lw||3.2],[1,0.38,(o.lw||3.2)*0.55]]){ctx.beginPath();ctx.moveTo(x+k*1.1,y0);ctx.lineTo(x+k*1.1-k*0.6,ye);ctx.strokeStyle=rgba(o.col||WC_PENCIL,aa*(o.a==null?1:o.a));ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
// a tag that stays in the frame: centred on x when it can be, otherwise against the frame's edge
function m4_tagAt(ctx,x,y,s,o){o=Object.assign({},o||{});const w=tw(ctx,s,o.size||30,o.w||700,o.f)+40,lo=o.lo==null?M4_X0:o.lo,hi=o.hi==null?M4_X1+20:o.hi;
  const cx=clamp(x,lo+w/2,hi-w/2);return wc_tag(ctx,cx,y,s,Object.assign(o,{align:"center"}));}
// a dot where a date's line crosses an open role
function m4_dot(ctx,x,y,r,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.beginPath();ctx.arc(x,y,13,0,TAU);ctx.fillStyle=rgba(WC_CARD,1);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=rgba(WC_ROLEINK[r],1);ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fillStyle=rgba(WC_ROLEINK[r],1);ctx.fill();ctx.restore();});}
// a pencil arrow, drawn on as p goes 0 to 1
function m4_arrow(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const q=ease(clamp(p,0,1)),ex=lerp(x0,x1,q),ey=lerp(y0,y1,q),an=Math.atan2(y1-y0,x1-x0);ctx.save();
  ctx.strokeStyle=rgba(o.col||WC_PENCIL,0.9);ctx.fillStyle=rgba(o.col||WC_PENCIL,0.9);ctx.lineWidth=o.lw||3;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  if(p>=0.98){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-15*Math.cos(an-0.45),y1-15*Math.sin(an-0.45));ctx.lineTo(x1-15*Math.cos(an+0.45),y1-15*Math.sin(an+0.45));ctx.closePath();ctx.fill();}ctx.restore();}
// a soft bracket: a pencil loop round a box, drawn on as p goes 0 to 1 (its path is fixed, so it's kept)
function m4_loop(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const cx=(x0+x1)/2,cy=(y0+y1)/2;wc_ring(ctx,cx,cy,(x1-x0)/2,(y1-y0)/2,p,{seed:o.seed||17,a:o.a,col:o.col});}

// the tutor row: one band (film 1's picture), or HR's contracts, one a semester; split (0 to 1) breaks the band into them, each piece closing
// in from the middle of its gaps onto its own dates, and names each piece's semester once it's wide enough to read
function m4_tutor(ctx,pr,split,a){if(pr<=0||a<=0.01)return;const y=m4_rowY(1),T=M4_TUT,n=T.length;
  if(split<=0){m4_per(ctx,M4_PER[3],y,{p:pr,a});return;}
  const u=ease(clamp(split,0,1));
  T.forEach((c,i)=>{const c0=i===0?c.A:(T[i-1].B+c.A)/2,last=i===n-1,A=lerp(c0,c.A,u),seed=40+i*13;let B;
    if(last){const v=clamp(u*2,0,1);B=lerp(M4_R[1]+0.5,c.B,u);if(v<1)m4_per(ctx,{k:c.k,r:"tutor",A,B:null},y,{a:a*(1-v),seed});if(v>0)m4_per(ctx,{k:c.k,r:"tutor",A,B},y,{a:a*v,seed});}
    else{B=lerp((c.B+T[i+1].A)/2,c.B,u);m4_per(ctx,{k:c.k,r:"tutor",A,B},y,{a,seed});}
    const xa=Math.max(m4_x(A),M4_X0),xb=Math.min(m4_x(B),M4_X1),wd=xb-xa,la=a*clamp((u-0.3)/0.4,0,1)*clamp((wd-56)/24,0,1)*(m4_x((A+B)/2)>m4_x(M4_NOW)?0.7:1);
    if(la>0.01)withA(ctx,la,()=>wc_T(ctx,c.s,(xa+xb)/2,y+10,{w:800,size:28,align:"center",col:WC_DARK}));});}
// a soft light behind a figure: the person, staying
function m4_glow(ctx,x,y,a,r){if(a<=0.01)return;r=r||330;ctx.save();const g=ctx.createRadialGradient(x,y,10,x,y,r);g.addColorStop(0,rgba([255,250,232],0.9*a));g.addColorStop(0.6,rgba([255,246,220],0.45*a));
  g.addColorStop(1,rgba([255,246,220],0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();}
// today, on the line of years: a small pencil mark under it, and the word
function m4_today(ctx,a){const x=m4_x(M4_NOW);if(a<=0.01||x<M4_X0||x>M4_X1)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.85);ctx.beginPath();ctx.moveTo(x,M4_AXY+6);
  ctx.lineTo(x-9,M4_AXY+22);ctx.lineTo(x+9,M4_AXY+22);ctx.closePath();ctx.fill();ctx.restore();wc_T(ctx,"today",x,M4_AXY+80,{w:700,size:28,align:"center",col:WC_INK});});}
// paper lifted back on the right of the timeline, so someone can stand there: a soft-edged mask, kept
function m4_clear(ctx,x0,a){if(a<=0.01)return;const w=W-x0+40,h=640,c=wc_kept("clear"+x0,w,h,q=>{const g=q.createLinearGradient(0,0,150,0);g.addColorStop(0,rgba(WC_PAPER,0));
    g.addColorStop(1,rgba(WC_PAPER,0.95));q.fillStyle=g;q.fillRect(0,0,w,h);q.globalCompositeOperation="destination-in";const v=q.createLinearGradient(0,0,0,h);v.addColorStop(0,"rgba(0,0,0,0)");
    v.addColorStop(0.12,"rgba(0,0,0,1)");v.addColorStop(0.88,"rgba(0,0,0,1)");v.addColorStop(1,"rgba(0,0,0,0)");q.fillStyle=v;q.fillRect(0,0,w,h);});
  withA(ctx,a,()=>ctx.drawImage(c,x0,300));}
// Linh's timeline, all of it: the rows' lanes, her figure, the rows' names and owners, the periods, the line of years. o.row dims a row
// (0 to 1); o.lane, o.lab and o.own bring each row's lane, name and owner in; o.per: how far each period is painted, by key (o.all: every
// period); o.over: a period's dates changed, by key; o.split: the tutor band broken into contracts; o.fig: her bands, by row; o.axis: the
// line of years, drawn on from the left; o.glow: the light behind her
function m4_tl(ctx,t,o){const row=i=>o.row?o.row[i]:1,P=o.per||{},pv=k=>P[k]==null?(o.all?1:0):P[k];
  for(let i=0;i<5;i++)m4_lane(ctx,i,(o.lane?o.lane[i]:1)*row(i));
  m4_glow(ctx,M4_FX,M4_FY-360,o.glow||0);
  m4_fig(ctx,(o.fig||[0,0,0,0,0]).map((v,i)=>v*row(i)),{a:o.figA==null?1:o.figA});
  for(let i=0;i<5;i++)if(row(i)>0.01)withA(ctx,row(i),()=>m4_label(ctx,i,o.lab?o.lab[i]:1,o.own?o.own[i]:(o.lab?o.lab[i]:1)));
  for(const p of M4_PER){if(p.k==="tut")continue;const v=pv(p.k);if(v<=0)continue;const i=M4_ROWS.indexOf(p.r),q=o.over&&o.over[p.k]?Object.assign({},p,o.over[p.k]):p;
    m4_per(ctx,q,m4_rowY(i),{p:v,a:row(i)*(q.a==null?1:q.a),seed:p.k.length*7+Math.round(p.A*3)});}
  m4_tutor(ctx,pv("tut"),o.split||0,row(1));
  const ax=o.axis==null?1:o.axis;if(ax>0){ctx.save();ctx.beginPath();ctx.rect(0,0,lerp(M4_X0-10,M4_X1+40,ease(clamp(ax,0,1))),H);ctx.clip();m4_axis(ctx,1);ctx.restore();}}

/* ---------- 4. the shape every role takes ---------- */
// the form: a role's five things, typed in as they're named; f[i] 0 to 1
const M4_FIELDS=["person","role type","owner","starts","ends"];
function m4_form(ctx,x,y,f){const w=680,h=560;wc_panel(ctx,x,y,w,h,{kind:"card",seed:61});wc_T(ctx,"every role",x+40,y+66,{w:800,size:36,col:WC_DARK});
  M4_FIELDS.forEach((s,i)=>{const yy=y+150+i*88,p=f[i]||0;if(p<=0)return;withA(ctx,clamp(p*2,0,1),()=>{wc_T(ctx,typeOn(s,p),x+40,yy,{w:700,size:30,col:WC_INK});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+260,yy+6);ctx.lineTo(x+260+(w-300)*ease(p),yy+6);ctx.stroke();ctx.restore();});});}
// the same five things, small, at the top of the frame once the timeline's drawn
function m4_formStrip(ctx,cx,y,a){if(a<=0.01)return;withA(ctx,a,()=>{const ws=M4_FIELDS.map(s=>tw(ctx,s,28,700)+40),lead="every role:",lw=tw(ctx,lead,28,800),tot=lw+24+ws.reduce((s,v)=>s+v,0)+16*4;
  let x=cx-tot/2;wc_T(ctx,lead,x,y+10,{w:800,size:28,col:WC_DARK});x+=lw+24;M4_FIELDS.forEach((s,i)=>{wc_tag(ctx,x,y,s,{size:28,w:700});x+=ws[i]+16;});});}

/* ---------- 5. a contract each term ---------- */
// HR's card: what it offers, typed in line by line
function m4_hrCard(ctx,x,y,l){const w=560,h=236,tW=tw(ctx,"HR",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_ROLE.tutor,sw:tW+36,seed:71});
  wc_T(ctx,"HR",x+32,y+48,{w:800,size:30,col:WC_DARK});["an offer of work","each teaching period","one unit"].forEach((s,i)=>{if(l[i]>0)wc_T(ctx,typeOn(s,l[i]),x+32,y+104+i*46,{w:600,size:30,col:WC_INK});});}
// a pin on a date: a dashed pencil line from the date's tag down to a row, and a pin's head on the row
function m4_pin(ctx,x,y0,y1,p){if(p<=0)return;m4_rule(ctx,x,y0,y1,p,{lw:2.6,dash:[6,7]});if(p>=0.9){ctx.save();ctx.beginPath();ctx.arc(x,y1,10,0,TAU);ctx.fillStyle=rgba([196,72,60],0.95*clamp((p-0.9)*10,0,1));ctx.fill();ctx.restore();}}

/* ---------- 6. one line, one date ---------- */
// Planning's card as it counts: the rows its three lists give it, which fold into one person (fold 0 to 1); then, a year back, its answer
// for last year (back), kept as it was (kept)
function m4_planCount(ctx,t,x,y,o){const w=640,h=280,tW=tw(ctx,"Planning",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:M4_SLATE,sw:tW+36,seed:43});
  wc_T(ctx,"Planning",x+32,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,"students who also work here",x+32,y+96,{w:600,size:28,col:WC_MUTED});
  const bk=o.back||0,now=1-bk;
  if(now>0.01)withA(ctx,now,()=>{const f=ease(clamp(o.fold||0,0,1));["student","tutor","researcher"].forEach((r,i)=>{const a=clamp(o.rows*3-i,0,1);if(a<=0)return;const yy=lerp(y+160+i*46,y+206,f);
      withA(ctx,a*(i===1?1-clamp(f*1.6-0.6,0,1):1-clamp(f*1.6,0,1)),()=>{ctx.fillStyle=rgba(WC_ROLE[r],1);ctx.beginPath();ctx.arc(x+46,yy-9,8,0,TAU);ctx.fill();
        wc_T(ctx,r+" · Linh",x+66,yy,{w:700,size:28,col:WC_DARK});});});
    const g=clamp(f*1.6-0.6,0,1);if(g>0.01)withA(ctx,g,()=>{wc_tick(ctx,x+48,y+196,30,WC_ROLEINK.student,clamp((o.tick||0)/0.4,0,1),4);
      wc_T(ctx,"1 person",x+82,y+206,{w:800,size:30,col:WC_DARK});wc_T(ctx,"a student who works here",x+82,y+248,{w:600,size:28,col:WC_INK});});});
  if(bk>0.01)withA(ctx,bk,()=>{wc_badge(ctx,x+32,y+160,"as at 31 Mar 2025");wc_T(ctx,"Linh: a tutor and an alumna",x+32,y+214,{w:700,size:28,col:WC_DARK});
    wc_T(ctx,"not a student",x+32,y+256,{w:700,size:28,col:WC_MUTED});if(o.kept>0)withA(ctx,o.kept,()=>wc_badge(ctx,x+w-32-tw(ctx,"as it was",28,700)-28,y+246,"as it was"));});}
// the alumni office's question, as a filter, and who it finds
function m4_alumFilter(ctx,t,x,y,o){const w=640,h=280,tW=tw(ctx,"Alumni office",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_ROLE.alumna,sw:tW+36,seed:47});
  wc_T(ctx,"Alumni office",x+32,y+48,{w:800,size:30,col:WC_DARK});
  if(o.q>0){wc_T(ctx,typeOn("alumni with an open",o.q),x+32,y+104,{w:700,size:30,col:WC_DARK});wc_T(ctx,typeOn("student role",clamp(o.q*2-1,0,1)),x+32,y+146,{w:700,size:30,col:WC_DARK});}
  if(o.found>0){wc_tick(ctx,x+50,y+210,30,WC_ROLEINK.alumna,clamp(o.found/0.4,0,1),4);withA(ctx,clamp((o.found-0.3)/0.4,0,1),()=>wc_T(ctx,"Linh · back since Jul 2025",x+82,y+222,{w:700,size:28,col:WC_DARK}));}}

/* ---------- 7. what a role is for ---------- */
// a "relates to" tag: a dot in its role's colour and what the role is for
function m4_rel(ctx,x,y,r,s,a){if(a<=0.01)return 0;let w=0;withA(ctx,a,()=>{w=tw(ctx,s,28,700)+64;wc_panel(ctx,x,y-26,w,52,{kind:"tag",seed:s.length});
  ctx.fillStyle=rgba(WC_ROLE[r],1);ctx.beginPath();ctx.arc(x+24,y,8,0,TAU);ctx.fill();wc_T(ctx,s,x+44,y+10,{w:700,size:28,col:WC_DARK});});return w;}

/* ---------- 8. elsewhere ---------- */
const M4_EN=WC_IND.energy,M4_ENINK=[132,96,0];
// the energy company's sheet: its two people's roles on a line of months, and the life support flag kept on one of them
const M4_ES={x:96,y:500,w:1130,h:372},M4_EX0=460,M4_EX1=1180,M4_ERY=[700,800],M4_EAX=640;
const m4_em=d=>M4_EX0+(d-2026)/1*(M4_EX1-M4_EX0),M4_MOVE=m4_d("2026-06-14");
function m4_energySheet(ctx,o){const S=M4_ES;wc_panel(ctx,S.x,S.y,S.w,S.h,{kind:"sheet",seed:81});
  const hc=wc_kept("enHead",420,72,q=>wc_wash(q,wc_resample(wc_rect(10,10,400,52),8),M4_EN,{kind:"swatch",line:false,a:0.7,seed:6}));ctx.drawImage(hc,S.x+14,S.y+14);
  wc_T(ctx,"an energy company",S.x+38,S.y+56,{w:800,size:30,col:WC_DARK});
  [["account holder",0],["occupant",1]].forEach(([s,i])=>{const a=o.rowA[i];if(a<=0.01)return;withA(ctx,a,()=>wc_T(ctx,s,S.x+38,M4_ERY[i]+10,{w:800,size:30,col:M4_ENINK}));});
  // the months of 2026, along the top
  if(o.axis>0.01)withA(ctx,o.axis,()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(M4_EX0,M4_EAX);ctx.lineTo(M4_EX1,M4_EAX);ctx.stroke();
    for(let m=0;m<=12;m++){const x=m4_em(2026+m/12);ctx.beginPath();ctx.moveTo(x,M4_EAX-6);ctx.lineTo(x,M4_EAX+6);ctx.stroke();}ctx.restore();
    wc_T(ctx,"2026",M4_EX0-24,M4_EAX-16,{w:500,size:28,f:"mono",align:"right",col:WC_MUTED});
    ["Jan","Apr","Jul","Oct"].forEach((s,k)=>wc_T(ctx,s,m4_em(2026+(k*3+0.5)/12),M4_EAX-16,{w:500,size:28,f:"mono",align:"center",col:WC_MUTED}));});}
// an energy-yellow band on the sheet, from x0 to x1, faded in at the left (it started before this year) and, if open, out at the right
function m4_eband(ctx,x0,x1,y,a,o){if(a<=0.01||x1-x0<1)return;m4_eslice(ctx,x0,x1,y,a,o||{});}
function m4_estrip(){return wc_kept("strip:energy",M4_STW,64,q=>wc_wash(q,wc_resample(wc_rect(0,10,M4_STW,40),10),M4_EN,{kind:"swatch",line:false,a:0.78,seed:91}));}
function m4_eslice(ctx,x0,x1,y,a,o){const c=m4_estrip(),n=Math.max(1,Math.ceil((x1-x0)/10));for(let i=0;i<n;i++){const xa=x0+(x1-x0)*i/n,xb=x0+(x1-x0)*(i+1)/n,xm=(xa+xb)/2;
    const f=a*clamp((xm-M4_EX0+4)/60,0,1)*(o.open?clamp((M4_EX1+10-xm)/80,0,1):1);if(f<=0.004)continue;ctx.save();ctx.globalAlpha*=f;ctx.drawImage(c,200+(xa-x0),0,xb-xa+0.6,64,xa,y-32,xb-xa+0.6,64);ctx.restore();}
  if(!o.open&&x1<M4_EX1)m4_edge(ctx,[[x1,y-20],[x1,y+20]],a);}
// the heart: life support at home
const M4_HEART=[238,96,78];
function m4_heart(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.beginPath();ctx.moveTo(0,8);ctx.bezierCurveTo(-20,-6,-12,-22,0,-12);ctx.bezierCurveTo(12,-22,20,-6,0,8);
  ctx.fillStyle=rgba(M4_HEART,0.95);ctx.fill();ctx.strokeStyle=rgba(wc_dim(M4_HEART,0.35),0.9);ctx.lineWidth=1.6/s;ctx.stroke();ctx.restore();});}

/* ---------- 9. one table, any date ---------- */
// the role table, as Jun builds it: a row for each role, the tutor's earlier contracts folded into one line, and the day each row was
// recorded, which comes in last
const M4_TB2={x:460,y:84,w:1410,h:540};
const M4_TC=[["person_key",32],["role_type",210],["owner",388],["relates_to",630],["valid_from",850],["valid_to",1036],["recorded_at",1222]];
const M4_TROWS=[["applicant","admissions","bachelor's","2018-08-13","2019-02-25","2018-08-13"],["student","registrar's office","bachelor's","2019-02-25","2022-12-15","2019-02-25"],
  ["alumna","alumni office","bachelor's","2022-12-15",null,"2022-12-16"],["tutor","HR",null],["applicant","admissions","master's","2025-06-02","2025-07-21","2025-06-02"],
  ["student","registrar's office","master's","2025-07-21",null,"2025-07-21"],["tutor","HR","unit · S1 2026","2026-02-23","2026-06-27","2026-04-06"],
  ["researcher","research office","project","2026-03-02","2026-12-19","2026-03-02"]];
const M4_TRY=i=>M4_TB2.y+186+i*46;
// o.rows: rows in (0 to 1); o.col[k]: column k lit; o.rec: the recorded_at column in; o.hiRow: the late contract's row lit
function m4_table(ctx,t,o){const T=M4_TB2,X=k=>T.x+M4_TC[k][1];wc_panel(ctx,T.x,T.y,T.w,T.h,{kind:"sheet",seed:93});
  wc_T(ctx,"core_person_role",T.x+32,T.y+58,{w:500,size:32,f:"mono",col:WC_DARK});
  const ra=o.rec||0;
  M4_TC.forEach(([s,x],k)=>{if(k===6&&ra<=0.01)return;const lit=(o.col&&o.col[k])||0;withA(ctx,k===6?ra:1,()=>{
    if(lit>0.01)withA(ctx,lit,()=>wc_panel(ctx,T.x+x-12,T.y+102,tw(ctx,s,28,500,"mono")+24,44,{kind:"chip",role:WC_BADGE,seed:k}));
    wc_T(ctx,s,T.x+x,T.y+132,{w:500,size:28,f:"mono",col:lit>0.5?WC_DARK:WC_INK});});});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(T.x+24,T.y+152);ctx.lineTo(T.x+T.w-24,T.y+152);ctx.stroke();ctx.restore();
  M4_TROWS.forEach((row,i)=>{const a=clamp((o.rows||0)*M4_TROWS.length-i,0,1);if(a<=0)return;const y=M4_TRY(i),[r,own,rel,vf,vt,rec]=row;withA(ctx,a,()=>{
    if(o.hiRow&&i===6&&o.hiRow>0.01)withA(ctx,o.hiRow,()=>wc_panel(ctx,T.x+16,y-32,T.w-32,44,{kind:"chip",role:WC_ROLE.tutor,seed:5}));
    wc_panel(ctx,X(0)-6,y-30,84,40,{kind:"tag",seed:i});wc_T(ctx,"Linh",X(0)+10,y,{w:700,size:28,col:WC_DARK});
    ctx.fillStyle=rgba(WC_ROLE[r],1);ctx.beginPath();ctx.arc(X(1)+2,y-9,8,0,TAU);ctx.fill();
    wc_T(ctx,r==="alumna"?"alumni":r,X(1)+18,y,{w:700,size:28,col:WC_DARK});wc_T(ctx,own,X(2),y,{w:600,size:28,col:WC_INK});
    if(rel==null){wc_T(ctx,"one per semester since 2023 · six rows",X(3),y,{w:600,size:28,col:WC_MUTED});return;}
    wc_T(ctx,rel,X(3),y,{w:600,size:28,col:WC_INK});wc_T(ctx,vf,X(4),y,{w:500,size:28,f:"mono",col:WC_INK});
    wc_T(ctx,vt||"null",X(5),y,{w:500,size:28,f:"mono",col:vt?WC_INK:WC_MUTED,a:vt?1:0.75});
    if(ra>0.01)withA(ctx,ra,()=>wc_T(ctx,rec,X(6),y,{w:500,size:28,f:"mono",col:i===6?WC_ROLEINK.tutor:WC_INK}));});});}
// the model's tests, each with its plain words and a tick (o.t1, o.t2: 0 to 1)
function m4_yaml(ctx,x,y,o){const w=690,h=236;wc_panel(ctx,x,y,w,h,{kind:"card",wash:WC_SIDE.tech,washA:0.14,seed:95});
  [["versions_do_not_overlap","ends after it starts",o.t1],["relationships: core_person","belongs to a person",o.t2]].forEach(([c,p,k],i)=>{const yy=y+52+i*104;if(k<=0)return;
    withA(ctx,clamp(k*2.5,0,1),()=>wc_T(ctx,c,x+32,yy,{w:500,size:28,f:"mono",col:WC_DARK}));wc_tick(ctx,x+50,yy+36,30,WC_ROLEINK.alumna,clamp((k-0.4)/0.35,0,1),4);
    withA(ctx,clamp((k-0.55)/0.3,0,1),()=>wc_T(ctx,p,x+82,yy+48,{w:600,size:28,col:WC_INK}));});}
// the query, and the dates it can take, pinned along its edge (o.pins[k]: 0 to 1; o.on: which is lit)
function m4_query(ctx,x,y,o){const w=690,h=236;wc_panel(ctx,x,y,w,h,{kind:"card",wash:WC_SIDE.tech,washA:0.14,seed:97});
  wc_T(ctx,"where {{ valid_at(census_date()) }}",x+32,y+60,{w:500,size:28,f:"mono",col:WC_DARK});
  let xx=x+32;["31 Mar 2026","31 Mar 2025","today"].forEach((s,k)=>{const p=o.pins[k]||0,tw0=tw(ctx,s,28,500,"mono")+40;if(p>0)arrive(ctx,xx+tw0/2,y+150,o.t,o.t0[k],()=>{
    wc_tag(ctx,xx,y+150,s,{size:28,w:500,f:"mono",wash:o.on===k?WC_BADGE:null,washA:0.6});ctx.save();ctx.fillStyle=rgba([196,72,60],1);ctx.beginPath();ctx.arc(xx+tw0/2,y+122,7,0,TAU);ctx.fill();ctx.restore();},{dy:-14});xx+=tw0+18;});}
