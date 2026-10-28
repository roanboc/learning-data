/* ===== Where each piece lives: the people of the opening =====
   Korea under the Joseon kings, and a reader today, drawn as the series draws people (its people.js), a warm umber wash behind each
   person of the past. At court, officials in long robes with round collars, red, blue or green by rank, a stiff belt worn loose, and
   the black hat of an official with its two flat wings; each holds a tablet at the chest. The historians, in green, sit on the floor at
   low desks and write with brushes. The office's members, the printers in short jackets with a band round the forehead, the archive's
   keepers; two scholars from the town in white robes with a cord at the waist and the wide black hat of a gentleman; a historian sent
   to air the books, in a travelling robe. Their robes have wide sleeves. Nothing they hold is written in a language: the marks are too
   small to read. Every name starts with oh or oh_. */

// ---- clothes of the Joseon court and town: the series' engine stays as it is; these wrap its torso, arms and head for their own kinds only
const oh_torso0=torso,oh_arm0=arm,oh_head0=head;
// a long robe to the ankles (kind "robe"): o.collar "round" (an official's, with a white collar inside) or "cross" (a gentleman's, the
// left side over the right, a white band along its edge); o.belt "stiff" (an official's, worn loose and low, with plates) or a cord
// (o.cord, its colour, tied with two ends hanging). A short jacket (kind "jacket"), to the hips, crossed and tied, over trousers.
torso=function(ctx,P,br,sh){const T_=P.top;if(T_.kind!=="robe"&&T_.kind!=="jacket")return oh_torso0(ctx,P,br,sh);
  const c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br,robe=T_.kind==="robe",hem=robe?-34:-276,fl=robe?46:10;
  const path=()=>{ctx.beginPath();ctx.moveTo(-16,y0);ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-2,y0+28,-sw-2,y0+50);
    ctx.bezierCurveTo(-sw-2,y0+84,-hw-4,-352,-hw,-322);ctx.quadraticCurveTo(-hw-fl*0.5+sh*0.4,-230,-hw-fl+sh*0.5,hem);
    ctx.quadraticCurveTo(sh*0.5,hem+10,hw+fl+sh*0.5,hem);ctx.quadraticCurveTo(hw+fl*0.5+sh*0.4,-230,hw,-322);
    ctx.bezierCurveTo(hw+4,-352,sw+2,y0+84,sw+2,y0+50);ctx.quadraticCurveTo(sw+2,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,16,y0);ctx.closePath();};
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);ctx.save();path();ctx.clip();
  // the folds of the cloth, falling from the chest
  ctx.strokeStyle=rgba(darken(c,0.36),0.3);ctx.lineWidth=2.4;ctx.lineCap="round";
  for(const k of [-0.66,-0.24,0.2,0.62]){ctx.beginPath();ctx.moveTo(k*hw*0.7+sh*0.3,-370);ctx.quadraticCurveTo(k*hw*1.05+sh*0.4,-240,k*(hw+fl)*0.95+sh*0.5,hem+6);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(c,0.22),0.22);ctx.lineWidth=5;for(const k of [-0.42,0.44]){ctx.beginPath();ctx.moveTo(k*hw*0.7+sh*0.3,-360);ctx.quadraticCurveTo(k*hw+sh*0.4,-240,k*(hw+fl)*0.9+sh*0.5,hem+6);ctx.stroke();}
  const inner=T_.inner||[248,246,240];
  if(T_.collar==="round"){// a round collar standing a little off the neck, a white collar inside it, and the front's overlap running down the right side
    ctx.fillStyle=rgba(inner,1);ctx.beginPath();ctx.moveTo(-19,y0-2);ctx.quadraticCurveTo(0,y0+26,19,y0-2);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(darken(c,0.3),0.9);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-24,y0);ctx.quadraticCurveTo(0,y0+34,24,y0);ctx.stroke();
    ctx.strokeStyle=rgba(darken(c,0.4),0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,y0+18);ctx.quadraticCurveTo(sw*0.62,y0+70,sw*0.66+sh*0.3,-330);ctx.stroke();}
  else{// a crossed collar: the left side over the right, the white band along its edge, the tie at the chest
    ctx.fillStyle=rgba(inner,1);ctx.beginPath();ctx.moveTo(-18,y0-2);ctx.lineTo(18,y0-2);ctx.lineTo(sh*0.2,y0+40);ctx.closePath();ctx.fill();
    const band=T_.band||[250,248,244];ctx.strokeStyle=rgba(band,1);ctx.lineWidth=9;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(-17,y0-1);ctx.lineTo(sh*0.2+6,y0+42);ctx.lineTo(sw*0.55+sh*0.3,y0+86);ctx.stroke();
    ctx.strokeStyle=rgba(darken(c,0.3),0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,y0-6);ctx.lineTo(sh*0.2+8,y0+36);ctx.moveTo(sh*0.2-2,y0+48);ctx.lineTo(sw*0.55+sh*0.3,y0+94);ctx.stroke();
    ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(19,y0-1);ctx.lineTo(sh*0.2+8,y0+38);ctx.stroke();
    if(!robe||T_.tie){const tc=T_.tie||darken(c,0.15);ctx.strokeStyle=rgba(tc,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sw*0.32+sh*0.3,y0+70);ctx.quadraticCurveTo(sw*0.4,y0+110,sw*0.28+sh*0.3,y0+150);
      ctx.moveTo(sw*0.32+sh*0.3,y0+70);ctx.quadraticCurveTo(sw*0.5,y0+100,sw*0.5+sh*0.3,y0+130);ctx.stroke();}}
  if(T_.belt==="stiff"){// an official's belt: stiff, worn loose and a little low, dark with pale plates
    const bc=T_.beltC||[40,36,40];ctx.fillStyle=rgba(bc,1);ctx.beginPath();ctx.moveTo(-hw-14,-318);ctx.quadraticCurveTo(sh*0.4,-292,hw+14,-318);ctx.lineTo(hw+14,-302);ctx.quadraticCurveTo(sh*0.4,-276,-hw-14,-302);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(T_.plate||[214,198,160],0.95);for(const k of [-0.62,-0.2,0.22,0.64]){const bx=k*hw+sh*0.4,by=-306+Math.abs(k)*-10+12;ctx.fillRect(bx-7,by-5,14,10);}}
  if(T_.cord){ctx.strokeStyle=rgba(T_.cord,1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-hw-2,-318);ctx.quadraticCurveTo(sh*0.4,-310,hw+2,-318);ctx.stroke();
    ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(hw*0.3+sh*0.4,-314);ctx.quadraticCurveTo(hw*0.34+sh*0.45,-260,hw*0.26+sh*0.5,-206);ctx.moveTo(hw*0.36+sh*0.4,-314);ctx.quadraticCurveTo(hw*0.46+sh*0.45,-262,hw*0.44+sh*0.5,-214);ctx.stroke();
    ctx.fillStyle=rgba(T_.cord,1);for(const [x,y] of [[hw*0.26+sh*0.5,-206],[hw*0.44+sh*0.5,-214]]){ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.lineTo(x+7,y+22);ctx.lineTo(x-7,y+22);ctx.closePath();ctx.fill();}}
  if(T_.apron){ctx.fillStyle=rgba(T_.apron,0.95);ctx.beginPath();ctx.moveTo(-hw+4,-318);ctx.lineTo(hw-4,-318);ctx.lineTo(hw+6+sh*0.5,-150);ctx.quadraticCurveTo(sh*0.5,-142,-hw-6+sh*0.5,-150);ctx.closePath();ctx.fill();seam(ctx,T_.apron,0.3);}
  ctx.restore();};
// wide sleeves, for a robe: the upper arm in its sleeve, then the sleeve widening from the elbow to the cuff and hanging below the
// forearm; a jacket's sleeves are only a little wider than the arm
arm=function(ctx,P,s,a,br,po){const T_=P.top;if(T_.kind!=="robe"&&T_.kind!=="jacket")return oh_arm0(ctx,P,s,a,br,po);
  const sw=P.build.sh,sx=s*(sw-12),sy=-416+br,L1=108,L2=100,e=[sx+s*Math.sin(a[0])*L1,sy+Math.cos(a[0])*L1],d=[s*Math.sin(a[1]),Math.cos(a[1])],w=[e[0]+d[0]*L2,e[1]+d[1]*L2];
  const robe=T_.kind==="robe",c=T_.c,wu=robe?22:16,wc=robe?34:18,box=[Math.min(sx,w[0])-60,sy-40,Math.max(sx,w[0])+60,w[1]+60];
  // the side the sleeve hangs from: the forearm's underside (outwards, for an arm that hangs straight)
  let nn=[-d[1],d[0]];if(nn[1]<-0.2||(Math.abs(nn[1])<=0.2&&nn[0]*s<0))nn=[d[1],-d[0]];const u=[-nn[0],-nn[1]],drop=robe?30*(0.35+0.65*Math.abs(d[0])):0;
  limb(ctx,[[sx,sy],e],wu*2,wu*2.1,c,box);
  const p0=[e[0]+u[0]*wu,e[1]+u[1]*wu],p1=[w[0]+u[0]*wc,w[1]+u[1]*wc],p2=[w[0]+nn[0]*wc,w[1]+nn[1]*wc],p3=[e[0]+nn[0]*wu,e[1]+nn[1]*wu],
    mid=[(e[0]+w[0])/2+nn[0]*(wc+drop),(e[1]+w[1])/2+nn[1]*(wc+drop)+drop*0.7];
  const sl=()=>{ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);ctx.quadraticCurveTo(mid[0],mid[1],p3[0],p3[1]);ctx.arc(e[0],e[1],wu,Math.atan2(nn[1],nn[0]),Math.atan2(u[1],u[0]),s<0);ctx.closePath();};
  sl();litFill(ctx,c,box[0],box[1],box[2],box[3]);seam(ctx,c,0.45);
  ctx.save();sl();ctx.clip();ctx.strokeStyle=rgba(darken(c,0.35),0.28);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(e[0]+nn[0]*wu*0.4,e[1]+nn[1]*wu*0.4);ctx.quadraticCurveTo((mid[0]+e[0])/2,(mid[1]+e[1])/2,w[0]+nn[0]*wc*0.55,w[1]+nn[1]*wc*0.55);ctx.stroke();ctx.restore();
  // the cuff, a white edge where the inner sleeve shows
  ctx.strokeStyle=rgba(T_.inner||[244,240,232],robe?0.95:0.6);ctx.lineWidth=robe?5:3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p1[0]-d[0]*3,p1[1]-d[1]*3);ctx.lineTo(p2[0]-d[0]*3,p2[1]-d[1]*3);ctx.stroke();
  const h=[w[0]+d[0]*13,w[1]+d[1]*13],ang=Math.atan2(d[1],d[0])-Math.PI/2;ctx.save();ctx.translate(h[0],h[1]);ctx.rotate(ang);
  ell(ctx,0,2,12,15);litFill(ctx,P.skin,-12,-13,12,17);seam(ctx,P.skin,0.3,1.2);ell(ctx,-s*9,-4,4.5,8,s*0.35);litFill(ctx,P.skin,-14,-12,-4,4);ctx.restore();};
// hats: an official's black hat with its two flat wings; a gentleman's wide hat of fine black horsehair, its brim see-through, tied
// under the chin; a band round the forehead, and the knot of hair on top, for those who work bareheaded
head=function(ctx,P,E,po,t){const h=P.hat;
  if(h==="samo"){// the wings stand out from the back of the hat: drawn first, behind the head
    for(const s of [-1,1]){ctx.save();ctx.translate(s*30,-94);ctx.rotate(-s*0.1);ell(ctx,s*30,0,32,13);litFill(ctx,[38,36,42],-70,-14,70,14);ctx.strokeStyle="rgba(10,10,14,0.6)";ctx.lineWidth=1.4;ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.12)";ell(ctx,s*28,-4,20,3);ctx.fill();ctx.restore();}}
  oh_head0(ctx,P,E,po,t);
  if(h==="band"||h==="gat"){const hc=P.bandC||[44,40,44];ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.moveTo(-45,-30);ctx.quadraticCurveTo(0,-44,45,-30);ctx.lineTo(44,-20);ctx.quadraticCurveTo(0,-34,-44,-20);ctx.closePath();ctx.fill();}
  if(h==="samo"){const k=[34,32,38];ctx.beginPath();ctx.moveTo(-46,-24);ctx.bezierCurveTo(-50,-64,-34,-80,0,-80);ctx.bezierCurveTo(34,-80,50,-64,46,-24);ctx.quadraticCurveTo(0,-36,-46,-24);ctx.closePath();litFill(ctx,k,-50,-82,50,-24);
    ctx.strokeStyle="rgba(10,10,14,0.6)";ctx.lineWidth=1.6;ctx.stroke();
    // the taller back of the hat, rising behind the front
    ctx.beginPath();ctx.moveTo(-30,-76);ctx.bezierCurveTo(-34,-112,34,-112,30,-76);ctx.closePath();litFill(ctx,k,-34,-112,34,-76);ctx.stroke();
    ctx.fillStyle="rgba(255,255,255,0.14)";ctx.beginPath();ctx.ellipse(-16,-62,12,5,-0.3,0,TAU);ctx.fill();}
  if(h==="gat"){const k=P.hatC||[30,28,32];
    // the crown, a little narrower at its flat top, and the brim, wide and see-through, with the light catching its edge
    ctx.beginPath();ctx.moveTo(-34,-44);ctx.lineTo(-30,-128);ctx.quadraticCurveTo(0,-134,30,-128);ctx.lineTo(34,-44);ctx.quadraticCurveTo(0,-38,-34,-44);ctx.closePath();ctx.fillStyle=rgba(k,0.86);ctx.fill();
    ctx.strokeStyle="rgba(10,10,14,0.7)";ctx.lineWidth=1.4;ctx.stroke();ctx.fillStyle=rgba(k,0.9);ctx.beginPath();ctx.ellipse(0,-129,30,6,0,0,TAU);ctx.fill();
    ctx.beginPath();ctx.ellipse(0,-44,112,19,0,0,TAU);ctx.fillStyle=rgba(k,0.55);ctx.fill();ctx.strokeStyle=rgba(k,0.95);ctx.lineWidth=2.2;ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,-45,104,15,0,Math.PI*1.05,Math.PI*1.95);ctx.stroke();
    ctx.strokeStyle=rgba(P.stringC||[40,36,40],0.85);ctx.lineWidth=1.6;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*30,-40);ctx.quadraticCurveTo(s*40,10,s*14,58);ctx.stroke();}}
  if(h==="band")oh_knot(ctx,P);};
function oh_knot(ctx,P){const c=P.hair.c;ell(ctx,0,-70,15,13);litFill(ctx,c,-15,-83,15,-57);seam(ctx,c,0.4);}

// ---- poses: holding a tablet at the chest, writing with a brush at a low desk, carrying on the back, asleep sitting up ----
Object.assign(POSE,{
  oh_tablet:{L:[0.24,-2.0],R:[0.24,-2.0],feet:22,shift:0,tilt:0.0,turn:0,gaze:[0,0.4],look:0},
  oh_brush:{L:[0.3,-1.55],R:[0.42,-1.2],feet:24,shift:0,tilt:0.06,turn:0.05,gaze:[0.1,1],look:1},
  oh_brushUp:{L:[0.3,-1.55],R:[0.5,-1.62],feet:24,shift:0,tilt:0.03,turn:0.05,gaze:[0.1,1],look:1},
  oh_carry:{L:[0.5,-2.8],R:[0.5,-2.8],feet:22,shift:0,tilt:0.04,turn:0,gaze:[0,0.3],look:0},
  oh_ink:{L:[0.3,-1.5],R:[0.5,-1.0],feet:24,shift:0,tilt:0.1,turn:0.06,gaze:[0.2,1],look:1},
  oh_lay:{L:[0.55,-1.25],R:[0.55,-1.25],feet:24,shift:0,tilt:0.12,turn:0,gaze:[0,1],look:1},
  oh_lift:{L:[0.5,-2.2],R:[0.5,-2.2],feet:24,shift:0,tilt:0.0,turn:0,gaze:[0,0.6],look:1},
  oh_reach:{L:[0.2,-0.1],R:[0.8,-1.0],feet:24,shift:2,tilt:0.08,turn:0.1,gaze:[0.3,0.8],look:1},
  oh_sleep:{L:[0.3,-1.3],R:[0.3,-1.3],feet:24,shift:0,tilt:0.22,turn:0,gaze:[0,1],look:1},
  oh_watch:{L:[0.3,-1.4],R:[0.3,-1.4],feet:24,shift:0,tilt:0.0,turn:0.1,gaze:[0.3,0],look:0}
});
EXPR.oh_asleep={bi:-1,bo:0,arch:-2,eye:0.08,smile:0.1,open:0,mw:14};

// ---- who they are ----
const OH_SKIN=[[232,196,160],[226,188,152],[218,178,142],[236,202,168],[212,172,136],[228,192,158]];
const OH_RED=[166,58,52],OH_BLUE=[62,84,138],OH_GREEN=[70,120,94],OH_WHITE=[240,236,226],OH_HEMP=[222,210,184];
const oh_off=(seed,skin,c,o)=>Object.assign({name:"",role:"official",side:"",edge:GV_PAST,seed,skin,hair:{style:"bun",c:[34,30,30]},hat:"samo",
  top:{kind:"robe",collar:"round",c,belt:"stiff",inner:[246,244,236]},bottom:{c:[60,56,60]},shoe:[30,28,30],build:{sh:76,hip:66,h:1.0}},o||{});
Object.assign(PEOPLE,{
  // the officials at court, two rows of four, in the colours of their ranks; some bearded
  ohO1:oh_off(201,OH_SKIN[0],OH_RED,{beard:[200,198,194]}),ohO2:oh_off(202,OH_SKIN[1],OH_RED,{beard:[60,52,48]}),
  ohO3:oh_off(203,OH_SKIN[2],OH_BLUE),ohO4:oh_off(204,OH_SKIN[3],OH_BLUE,{beard:[150,146,142]}),
  ohO5:oh_off(205,OH_SKIN[4],OH_BLUE,{beard:[44,38,36]}),ohO6:oh_off(206,OH_SKIN[5],OH_GREEN),
  ohO7:oh_off(207,OH_SKIN[1],OH_GREEN,{beard:[70,62,58]}),ohO8:oh_off(208,OH_SKIN[3],OH_GREEN),
  // the two historians, young, in green
  ohH1:oh_off(211,OH_SKIN[3],OH_GREEN,{role:"historian",build:{sh:72,hip:64,h:0.98}}),ohH2:oh_off(212,OH_SKIN[0],mix(OH_GREEN,[90,130,110],0.4),{role:"historian",build:{sh:72,hip:64,h:0.99}}),
  // the office that makes the annals: four members round its table
  ohS1:oh_off(221,OH_SKIN[2],OH_RED,{role:"member of the office",beard:[214,212,208]}),ohS2:oh_off(222,OH_SKIN[0],OH_BLUE,{role:"member of the office",beard:[80,70,64]}),
  ohS3:oh_off(223,OH_SKIN[4],OH_BLUE,{role:"member of the office"}),ohS4:oh_off(224,OH_SKIN[5],OH_GREEN,{role:"member of the office"}),
  // the printers, in short jackets of hemp, sleeves a little wide, a band round the forehead
  ohPr1:{name:"",role:"printer",side:"",edge:GV_PAST,seed:231,skin:[214,170,132],hair:{style:"bun",c:[30,28,28]},hat:"band",bandC:[236,232,220],
    top:{kind:"jacket",c:OH_HEMP,tie:[196,180,150],inner:[236,228,210]},bottom:{c:[208,198,174]},shoe:[150,130,100],build:{sh:74,hip:62,h:0.98}},
  ohPr2:{name:"",role:"printer",side:"",edge:GV_PAST,seed:232,skin:[222,180,142],hair:{style:"bun",c:[40,36,34]},hat:"band",bandC:[60,56,60],beard:[50,44,42],
    top:{kind:"jacket",c:[198,186,160],tie:[170,150,120],inner:[236,228,210]},bottom:{c:[196,186,164]},shoe:[150,130,100],build:{sh:76,hip:64,h:1.0}},
  // the archive's keepers
  ohK1:{name:"",role:"keeper of the archive",side:"",edge:GV_PAST,seed:241,skin:[210,166,128],hair:{style:"bun",c:[34,30,30]},hat:"band",bandC:[70,64,66],
    top:{kind:"jacket",c:[176,160,132],tie:[140,120,96],inner:[230,222,204]},bottom:{c:[186,172,146]},shoe:[130,110,84],build:{sh:76,hip:64,h:1.0}},
  ohK2:{name:"",role:"keeper of the archive",side:"",edge:GV_PAST,seed:242,skin:[220,176,138],hair:{style:"bun",c:[60,54,52]},hat:"band",bandC:[230,226,214],beard:[90,82,76],
    top:{kind:"jacket",c:[206,194,166],tie:[160,140,110],inner:[236,228,210]},bottom:{c:[190,178,152]},shoe:[130,110,84],build:{sh:74,hip:62,h:0.98}},
  // the two scholars of the town who saved Jeonju's copy, An Ui and Son Hong-rok, older men, in white, with the wide black hat
  ohAn:{name:"An Ui",role:"scholar",side:"",edge:GV_PAST,seed:251,skin:[222,184,150],hair:{style:"bun",c:[150,146,142]},beard:[206,204,200],hat:"gat",
    top:{kind:"robe",collar:"cross",c:OH_WHITE,cord:[70,90,140],band:[255,255,252],inner:[250,248,244]},bottom:{c:[226,222,212]},shoe:[60,54,50],build:{sh:72,hip:64,h:0.97}},
  ohSon:{name:"Son Hong-rok",role:"scholar",side:"",edge:GV_PAST,seed:252,skin:[214,174,140],hair:{style:"bun",c:[80,74,70]},beard:[110,104,98],hat:"gat",
    top:{kind:"robe",collar:"cross",c:[232,228,216],cord:[150,70,60],band:[255,255,252],inner:[250,248,244]},bottom:{c:[220,216,206]},shoe:[60,54,50],build:{sh:74,hip:64,h:0.99}},
  // a historian sent to air the books, in a travelling robe and the wide hat
  ohAir:{name:"",role:"historian",side:"",edge:GV_PAST,seed:261,skin:[228,190,156],hair:{style:"bun",c:[36,32,32]},hat:"gat",
    top:{kind:"robe",collar:"cross",c:[96,110,136],cord:[60,50,48],band:[240,238,232],inner:[244,240,232]},bottom:{c:[90,96,108]},shoe:[50,44,40],build:{sh:74,hip:64,h:1.0}},
  // today: a reader in a library
  ohReader:{name:"",role:"reader",side:"",edge:[236,232,226],seed:271,skin:[236,204,174],hair:{style:"long",c:[30,26,28]},glasses:[60,56,62],
    top:{kind:"cardigan",c:[150,170,150],inner:[244,240,232]},bottom:{c:[60,64,80]},shoe:[50,44,44],build:{sh:64,hip:58,h:0.94}}
});

// ---- things they hold, in the figure's own units ----
// an official's tablet, held upright at the chest
function oh_heldTablet(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+6);
  cx.fillStyle=rgba([238,226,196],1);rr(cx,-9,-66,18,96,7);cx.fill();cx.strokeStyle="rgba(120,100,70,0.6)";cx.lineWidth=1.4;cx.stroke();cx.restore();fingers(cx,P_,[l,r]);}
// a brush in the right hand, its tip dark with ink (wet: how much ink is on it)
function oh_heldBrush(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0],r[1]);cx.rotate(0.2);cx.fillStyle=rgba([170,130,80],1);cx.fillRect(-3,-70,6,76);
  cx.fillStyle=rgba([40,36,36],1);cx.beginPath();cx.moveTo(-5,6);cx.lineTo(5,6);cx.lineTo(0,26);cx.closePath();cx.fill();cx.restore();fingers(cx,P_,[r]);}
// a sheet, held up in both hands, its columns of marks
function oh_heldSheet(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+50);cx.fillStyle=rgba(OH.paper,1);cx.fillRect(-80,-56,160,120);
  cx.strokeStyle="rgba(120,110,90,0.5)";cx.lineWidth=1.2;cx.strokeRect(-80,-56,160,120);oh_marks(cx,-66,-44,132,96,9,0.75,271);cx.restore();fingers(cx,P_,[l,r]);}
// a stack of books, carried in both hands
function oh_heldStack(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;oh_bookStack(cx,mx,my+30,150,6);fingers(cx,P_,[l,r]);}
// a book, held open in both hands
function oh_heldBook(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-20);
  for(const s of [-1,1]){cx.fillStyle=rgba(OH.paper,1);cx.beginPath();cx.moveTo(0,-50);cx.lineTo(s*96,-56);cx.lineTo(s*96,30);cx.lineTo(0,36);cx.closePath();cx.fill();cx.strokeStyle="rgba(120,110,90,0.5)";cx.lineWidth=1.2;cx.stroke();
    oh_marks(cx,s>0?10:-86,-44,76,68,6,0.7,281+s);}cx.restore();fingers(cx,P_,[l,r]);}

// ---- sitting on the floor ----
// someone sitting on the floor, their robe spread round them: the figure cut at the hips, which sit fy above the floor's line at the
// person's place, and the robe's skirt over the cut (its colour the robe's); o: the person's options
function oh_floorSit(ctx,id,x,fy,s,o){o=o||{};const P_=PEOPLE[id],k=s*P_.build.h,hip=fy-64*k,c=P_.top.c;
  ctx.save();ctx.beginPath();ctx.rect(-W,-H*2,3*W,hip+16*k+H*2);ctx.clip();person(ctx,id,x,hip+322*k,s,Object.assign({shadow:false},o));ctx.restore();
  const hw=P_.build.hip*k,L=[];for(let i=0;i<=20;i++){const a=Math.PI+i/20*Math.PI,r=1+0.06*Math.sin(i*1.7);L.push([x+Math.cos(a)*hw*2.1*r,fy-6*k+Math.sin(a)*58*k*(0.75+0.25*Math.abs(Math.cos(a)))]);}
  L.push([x+hw*2.25,fy+4*k],[x-hw*2.25,fy+4*k]);
  ctx.save();ctx.fillStyle="rgba(80,70,60,0.18)";ctx.beginPath();ctx.ellipse(x,fy+6*k,hw*2.4,16*k,0,0,TAU);ctx.fill();ctx.restore();
  ctx.save();wc_tr(ctx,L);ctx.fillStyle=rgba(c,1);ctx.fill();const g=ctx.createLinearGradient(0,fy-60*k,0,fy);g.addColorStop(0,rgba(lighten(c,0.12),0.6));g.addColorStop(1,rgba(darken(c,0.25),0.5));ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle=rgba(darken(c,0.5),0.5);ctx.lineWidth=1.6;ctx.stroke();ctx.strokeStyle=rgba(darken(c,0.35),0.3);ctx.lineWidth=2;for(const u of [-0.5,0.1,0.6]){ctx.beginPath();ctx.moveTo(x+u*hw,fy-50*k);ctx.quadraticCurveTo(x+u*hw*1.4,fy-24*k,x+u*hw*1.8,fy);ctx.stroke();}ctx.restore();}
// a low desk for writing, on the floor: its top at fy-th, legs to the floor; centred on x, w wide (all in frame units)
function oh_lowDesk(ctx,x,fy,w,th,seed){const t=th*0.16;wc_part(ctx,[[x-w/2,fy-th],[x+w/2,fy-th],[x+w/2-6,fy-th+t],[x-w/2+6,fy-th+t]],OH.maru,1,{seed,lw:1.2});
  for(const s of [-1,1]){wc_part(ctx,[[x+s*w*0.44-6,fy-th+t],[x+s*w*0.44+6,fy-th+t],[x+s*w*0.44+8,fy],[x+s*w*0.44-8,fy]],OH.maruDk,1,{seed:seed+s,lw:1});}
  wc_flat(ctx,wc_rect(x-w*0.44,fy-th+t,w*0.88,t*0.6),OH.maruDk,1,"trim");}
// columns of marks, too small to read, written top to bottom and right to left: in [x, y, w, h], n columns; p, how many are written
// columns of writing, right to left, too small to read: p of the n columns written, the last one part way down; each column its own
// random marks, so a column never changes as the next is written. Returns where the brush last wrote, [x, y]
function oh_marks(ctx,x,y,w,h,n,p,seed){const cw=w/n,pp=clamp(p==null?1:p,0,1),full=Math.floor(pp*n+1e-6),f=pp*n-full;let last=null;
  ctx.save();ctx.fillStyle=ctx.strokeStyle=rgba(OH.ink,0.82);ctx.lineCap=ctx.lineJoin="round";
  for(let i=0;i<Math.min(n,full+1);i++){if(i===full&&f<=0.001)break;const R=wc_rng((seed||3)*131+i*7919),cx=x+w-cw*(i+0.5);let yy=y+R()*cw*0.3;
    const end=y+h*(0.86+R()*0.14),stop=i<full?end:yy+(end-yy)*f;
    while(yy<stop){const s=cw*(0.5+R()*0.2);if(s<7)ctx.fillRect(cx-s/2,yy,s,s*(0.5+R()*0.5));
      // big enough to see: a loose brush line and a dot, as handwriting looks from a step away; no letter of any script
      else{const th=Math.max(1,s*0.13),k=2+Math.floor(R()*2),N=k*6;let px=cx-s*0.45+R()*s*0.5,py=yy+R()*s*0.25,lx=px,ly=py,q=0;
        // the brush presses at the start and lifts off: each piece of the line a little thinner
        for(let j=0;j<k;j++){const bx=cx-s*0.5+R()*s,by=yy+R()*s*0.9,ex=cx-s*0.45+R()*s*0.9,ey=yy+s*(j+1)/k*(0.75+R()*0.25);
          for(let u=1;u<=6;u++){const v=u/6,a=(1-v)*(1-v),b=2*(1-v)*v,c=v*v,nx=a*px+b*bx+c*ex,ny=a*py+b*by+c*ey;
            ctx.lineWidth=Math.max(0.8,th*(1.35-0.95*q/N));ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(nx,ny);ctx.stroke();lx=nx;ly=ny;q++;}
          px=ex;py=ey;}
        if(R()<0.4){ell(ctx,cx-s*0.3+R()*s*0.6,yy+R()*s*0.8,s*0.09,s*0.065,R()*3);ctx.fill();}}
      last=[cx,yy+s*0.8];yy+=s*1.25;}}
  ctx.restore();return last;}
