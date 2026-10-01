/* ===== Built in layers: the film's own pictures (prefixed bl_) =====
   The 1890s: the Savoy's kitchen, run as a brigade. Four stations (sauces, roasts, fish, vegetables), each with a cook in
   whites and a toque, copper pans, a coal range, bowls set out ahead, a plate that gains a part at each station, and the pass,
   where the chef turns the plate and checks it. People and materials are drawn with care (PLAYBOOK 4): tapering bezier
   outlines, overlapping forms, a light side and a shadow side, and breath.
   The present: the project's four layers as four columns (they carry from chapter to chapter, and fold into a strip when a
   chapter needs the room), the tests, the code cards (real lines from the project, each with its label), the marts' shapes,
   the CTE outline, the materials of views and tables, and the rule written once. */

const BL_RUN="runs on dbt Core · DuckDB",BL_MART=LAYER4[3][1],BL_VIO=LAYER4[1][1],BL_STG=LAYER4[0][1];
const BL_WHITE=[238,233,222],BL_COPPER=[196,112,64],BL_IRON=[34,32,34],BL_BRASS=[214,170,92],BL_WOOD=[120,78,46];

/* ---------- small helpers ---------- */
// text cut to fit a width, with an ellipsis
function bl_fit(ctx,s,size,maxW,w,f){if(tw(ctx,s,size,w||600,f)<=maxW)return s;let n=s.length;while(n>4&&tw(ctx,s.slice(0,n)+"…",size,w||600,f)>maxW)n--;return s.slice(0,n)+"…";}
const bl_sp=(t,t0,d)=>spring(clamp((t-t0)/(d||0.7),0,2));

/* =====================================================================
   THE PAST · the Savoy's kitchen, the 1890s
   ===================================================================== */
const BL_ST=[["sauces",250],["roasts",610],["fish",970],["vegetables",1330]],BL_PASS=1715,BL_TOP=660;
// the cooks: skin, hair, moustache (or not), a little build
const BL_COOKS=[{skin:[236,198,170],hair:[70,48,34],mous:1,seed:1},{skin:[214,170,136],hair:[30,26,26],mous:0,seed:2},{skin:[238,206,182],hair:[150,96,58],mous:1,seed:3},{skin:[200,150,112],hair:[44,34,30],mous:1,seed:4}];
const BL_CHEF={skin:[232,194,166],hair:[96,90,88],mous:2,seed:5};

// the room: glazed tiles in gaslight, a rail of copper pans, the coal range, a floor of quarry tiles
function bl_room(ctx,t,o){o=o||{};
  const g=ctx.createLinearGradient(0,0,0,700);g.addColorStop(0,"#3a2a1c");g.addColorStop(0.6,"#5a4430");g.addColorStop(1,"#2e2117");ctx.fillStyle=g;ctx.fillRect(0,0,W,700);
  // tiles: soft lines, and a sheen near each gas lamp
  ctx.strokeStyle="rgba(20,12,6,0.32)";ctx.lineWidth=1.2;for(let y=24;y<470;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  for(let r=0;r<13;r++)for(let x=(r%2)*36;x<W;x+=72){ctx.beginPath();ctx.moveTo(x,24+r*36);ctx.lineTo(x,60+r*36);ctx.stroke();}
  [430,790,1150,1510].forEach((lx,i)=>{const fl=0.85+0.15*Math.sin(t*3.1+i*1.7)*Math.sin(t*1.3+i);glow(ctx,lx,230,260,[255,190,110],0.16*fl);
    ctx.fillStyle="rgba(60,44,26,1)";ctx.fillRect(lx-3,236,6,40);ctx.fillStyle=rgba([255,226,170],0.9*fl);ctx.beginPath();ctx.ellipse(lx,226,7,11,0,0,TAU);ctx.fill();glow(ctx,lx,226,40,[255,210,140],0.5*fl);});
  // the range: black iron, a brass rail, oven doors, and the fire behind each grate
  const ry=470;ctx.fillStyle=rgba(BL_IRON,1);ctx.fillRect(0,ry,W,230);const rg=ctx.createLinearGradient(0,ry,0,ry+230);rg.addColorStop(0,"rgba(255,255,255,0.08)");rg.addColorStop(0.15,"rgba(255,255,255,0)");rg.addColorStop(1,"rgba(0,0,0,0.35)");ctx.fillStyle=rg;ctx.fillRect(0,ry,W,230);
  ctx.strokeStyle=rgba(BL_BRASS,0.85);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,ry+16);ctx.lineTo(W,ry+16);ctx.stroke();ctx.strokeStyle="rgba(255,240,200,0.35)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,ry+14);ctx.lineTo(W,ry+14);ctx.stroke();
  for(let i=0;i<9;i++){const dx=40+i*215;ctx.strokeStyle="rgba(90,86,84,0.7)";ctx.lineWidth=2;rr(ctx,dx,ry+40,150,110,6);ctx.stroke();ctx.fillStyle="rgba(150,140,130,0.5)";[[dx+10,ry+50],[dx+140,ry+50],[dx+10,ry+140],[dx+140,ry+140]].forEach(([a,b])=>{ctx.beginPath();ctx.arc(a,b,2.5,0,TAU);ctx.fill();});
    const fl=0.7+0.3*Math.sin(t*2.3+i*2.1)*Math.sin(t*0.9+i);ctx.fillStyle=rgba([255,120,40],0.55*fl);rr(ctx,dx+40,ry+168,70,14,4);ctx.fill();glow(ctx,dx+75,ry+176,70,[255,120,40],0.35*fl);}
  // copper pans on a rail, lit on their left
  ctx.strokeStyle=rgba(BL_BRASS,0.8);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,58);ctx.lineTo(W,58);ctx.stroke();
  [[430,46],[505,34],[790,52],[865,30],[1150,42],[1225,36],[1510,50]].forEach(([px,r],i)=>{const sw=Math.sin(t*0.7+i)*0.02;ctx.save();ctx.translate(px,58);ctx.rotate(sw);
    ctx.strokeStyle="rgba(80,50,30,1)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,18);ctx.stroke();
    ctx.fillStyle=rgba(darken(BL_COPPER,0.25),1);rr(ctx,-5,16,10,60,4);ctx.fill();
    const cg=ctx.createLinearGradient(-r,0,r,0);cg.addColorStop(0,rgba(lighten(BL_COPPER,0.35),1));cg.addColorStop(0.45,rgba(BL_COPPER,1));cg.addColorStop(1,rgba(darken(BL_COPPER,0.5),1));
    ctx.fillStyle=cg;ctx.beginPath();ctx.ellipse(0,76+r,r,r,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(darken(BL_COPPER,0.55),0.7);ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle="rgba(255,230,190,0.35)";ctx.beginPath();ctx.ellipse(-r*0.4,76+r*0.7,r*0.16,r*0.42,0.3,0,TAU);ctx.fill();ctx.restore();});
  // the floor
  const fg=ctx.createLinearGradient(0,700,0,H);fg.addColorStop(0,"#3a2216");fg.addColorStop(1,"#120a06");ctx.fillStyle=fg;ctx.fillRect(0,700,W,H-700);}

// the counter: a marble top seen a little from above, and a wooden front
function bl_counter(ctx,x0,x1,o){o=o||{};const top=BL_TOP,f=720;ctx.save();
  ctx.fillStyle="rgba(0,0,0,0.35)";ctx.fillRect(x0,f,x1-x0,200);
  const mg=ctx.createLinearGradient(0,top,0,f);mg.addColorStop(0,"#cfc6b6");mg.addColorStop(1,"#efe8da");ctx.fillStyle=mg;ctx.beginPath();ctx.moveTo(x0+14,top);ctx.lineTo(x1-14,top);ctx.lineTo(x1,f);ctx.lineTo(x0,f);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(150,140,128,0.35)";ctx.lineWidth=1.2;for(let i=0;i<6;i++){const vx=x0+hash(i,o.seed||1)*(x1-x0);ctx.beginPath();ctx.moveTo(vx,top+4);ctx.bezierCurveTo(vx+30,top+20,vx-20,top+40,vx+40,f-4);ctx.stroke();}
  const wg=ctx.createLinearGradient(0,f,0,f+190);wg.addColorStop(0,rgba(lighten(BL_WOOD,0.12),1));wg.addColorStop(1,rgba(darken(BL_WOOD,0.45),1));ctx.fillStyle=wg;ctx.fillRect(x0,f,x1-x0,190);
  ctx.strokeStyle=rgba(darken(BL_WOOD,0.5),0.6);ctx.lineWidth=2;for(let x=x0+90;x<x1;x+=180){ctx.strokeRect(x-70,f+28,140,130);}
  ctx.fillStyle="rgba(255,240,210,0.25)";ctx.fillRect(x0,f,x1-x0,3);ctx.restore();}

// a hand, from the wrist (origin) along +y, turned by ang: "grip" holds a handle, "flat" rests, "point" shows
function bl_hand(ctx,x,y,s,ang,skin,kind){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  const fill=(x0,y0,x1,y1)=>{litFill(ctx,skin,x0,y0,x1,y1);seam(ctx,skin,0.35,1.1);};
  if(kind==="flat"){[[-8,40,-0.12],[-2.5,44,-0.03],[3,43,0.05],[8.5,37,0.14]].forEach(([fx,len,a])=>{ctx.save();ctx.translate(fx,18);ctx.rotate(a);ctx.beginPath();ctx.moveTo(-3.6,0);ctx.bezierCurveTo(-4,len*0.5,-3.4,len-14,-2.6,len-18);ctx.quadraticCurveTo(0,len-14,2.6,len-18);ctx.bezierCurveTo(3.4,len-14,4,len*0.5,3.6,0);ctx.closePath();fill(-4,0,4,len);ctx.restore();});}
  ctx.beginPath();ctx.moveTo(-10,-2);ctx.bezierCurveTo(-13,8,-14,18,-11,26);ctx.quadraticCurveTo(0,31,11,26);ctx.bezierCurveTo(14,18,13,8,10,-2);ctx.closePath();fill(-13,-2,13,30);
  if(kind!=="flat"){for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(-7.5+i*5,27+Math.abs(i-1.5)*0.8,3.2,4.4,0,0,TAU);fill(-10,20,10,32);}}
  if(kind==="point"){ctx.beginPath();ctx.moveTo(-9.5,24);ctx.bezierCurveTo(-11,36,-10,48,-8,54);ctx.quadraticCurveTo(-6,57,-4,54);ctx.bezierCurveTo(-3,46,-4,34,-4,25);ctx.closePath();fill(-11,24,-3,56);}
  // the thumb, wrapping round on the near side
  ctx.beginPath();ctx.moveTo(-11,4);ctx.bezierCurveTo(-18,12,-16,22,-9,28);ctx.quadraticCurveTo(-5,29,-5,25);ctx.bezierCurveTo(-8,20,-9,14,-6,8);ctx.closePath();fill(-18,4,-5,30);
  ctx.restore();}

// a cook of the 1890s, from the waist up behind the counter: double-breasted whites, a neckerchief, an apron, a pleated toque.
// (x,y): the waist, at the back edge of the counter. o.arms: [[elbowL, wristL, angL, kindL], [elbowR, wristR, angR, kindR]] in local
// coordinates; o.t for breath and blinks; o.look (0..1) eyes down to the work; o.lit (0..1) a warm light on the station
function bl_cook(ctx,x,y,s,C,o){o=o||{};const t=o.t||0,br=Math.sin(t*1.5+C.seed)*2.2,wh=BL_WHITE;
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const lit=(c,x0,y0,x1,y1,k)=>litFill(ctx,c,x0,y0,x1,y1,k);
  // torso: shoulders round into the arms, the jacket full at the chest
  const y0=-262+br;ctx.beginPath();ctx.moveTo(-18,y0);ctx.bezierCurveTo(-40,y0+2,-76,y0+12,-84,y0+36);ctx.bezierCurveTo(-90,y0+70,-82,-120,-74,-40);ctx.lineTo(-72,8);ctx.lineTo(72,8);ctx.lineTo(74,-40);ctx.bezierCurveTo(82,-120,90,y0+70,84,y0+36);ctx.bezierCurveTo(76,y0+12,40,y0+2,18,y0);ctx.closePath();
  lit(wh,-84,y0,84,0,1.4);seam(ctx,wh,0.35,1.4);
  // the double-breasted front: the flap's edge, two rows of cloth buttons, and a few soft folds
  ctx.strokeStyle=rgba(darken(wh,0.32),0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,y0+16);ctx.bezierCurveTo(10,y0+50,30,y0+70,34,-170);ctx.lineTo(32,0);ctx.stroke();
  for(let i=0;i<4;i++){[-16,46].forEach(bx=>{ctx.fillStyle=rgba(darken(wh,0.12),1);ctx.beginPath();ctx.arc(bx,-208+br*0.7+i*42,4.2,0,TAU);ctx.fill();ctx.strokeStyle=rgba(darken(wh,0.4),0.6);ctx.lineWidth=1;ctx.stroke();});}
  ctx.strokeStyle=rgba(darken(wh,0.25),0.35);ctx.lineWidth=1.6;[[-60,-170,-52,-60],[64,-150,58,-50],[-34,-120,-40,-20]].forEach(([a,b,c,d])=>{ctx.beginPath();ctx.moveTo(a,b);ctx.quadraticCurveTo((a+c)/2+6,(b+d)/2,c,d);ctx.stroke();});
  // the apron, tied high, and its strings
  ctx.beginPath();ctx.moveTo(-70,-112);ctx.lineTo(70,-112);ctx.lineTo(72,8);ctx.lineTo(-72,8);ctx.closePath();lit(mix(wh,[255,255,250],0.4),-70,-112,70,8,1.1);seam(ctx,wh,0.3,1.2);
  ctx.fillStyle=rgba(darken(wh,0.15),1);ctx.fillRect(-72,-118,144,9);ctx.strokeStyle=rgba(darken(wh,0.3),0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-30,-112);ctx.bezierCurveTo(-34,-96,-40,-84,-36,-70);ctx.moveTo(-26,-112);ctx.bezierCurveTo(-20,-98,-24,-86,-18,-76);ctx.stroke();
  // collar and neckerchief
  ctx.beginPath();ctx.moveTo(-22,y0-4);ctx.quadraticCurveTo(0,y0+10,22,y0-4);ctx.lineTo(20,y0-20);ctx.quadraticCurveTo(0,y0-10,-20,y0-20);ctx.closePath();lit(wh,-22,y0-20,22,y0+10);seam(ctx,wh,0.4,1.2);
  ctx.beginPath();ctx.moveTo(-12,y0+2);ctx.lineTo(12,y0+2);ctx.lineTo(2,y0+30);ctx.closePath();lit([150,170,196],-12,y0,12,y0+30);
  // the neck and head (the face of When things go wrong's people, under a toque)
  ctx.beginPath();ctx.moveTo(-15,y0-8);ctx.lineTo(-13,y0-40);ctx.lineTo(13,y0-40);ctx.lineTo(15,y0-8);ctx.closePath();lit(darken(C.skin,0.12),-15,y0-40,15,y0);
  ctx.save();ctx.translate(o.turn?o.turn*6:0,y0-84);ctx.scale(0.98,0.98);
  for(const sd of [-1,1]){ell(ctx,sd*42,0,7,11);lit(C.skin,-50,-12,50,12);seam(ctx,C.skin,0.25,1.2);}
  headPath(ctx);lit(C.skin,-42,-56,42,51);seam(ctx,C.skin,0.3,1.4);
  // short hair at the temples, under the toque
  ctx.fillStyle=rgba(C.hair,0.95);for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*44,-30);ctx.quadraticCurveTo(sd*46,-6,sd*40,6);ctx.lineTo(sd*36,-22);ctx.closePath();ctx.fill();}
  const P={skin:C.skin,hair:{c:C.hair},seed:C.seed},look=o.look==null?0.8:o.look;
  face(ctx,P,{bi:-1,bo:1,arch:-2,eye:lerp(1,0.7,look),smile:0.15,open:0,mw:15},{turn:o.turn||0,look:look,gaze:[0,look]},t);
  if(C.mous){ctx.fillStyle=rgba(darken(C.hair,0.1),0.95);for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(sd*1,18);ctx.bezierCurveTo(sd*10,15,sd*20,16,sd*(C.mous>1?30:24),C.mous>1?14:20);ctx.bezierCurveTo(sd*18,24,sd*8,23,sd*1,22);ctx.closePath();ctx.fill();}}
  // the toque: a band, then tall soft pleats that puff out at the top
  const th=146,tf=Math.sin(t*0.9+C.seed)*1.2;ctx.beginPath();ctx.moveTo(-44,-40);ctx.bezierCurveTo(-48,-70,-52,-110,-54+tf,-th+16);ctx.bezierCurveTo(-66,-th-10,-30,-th-26,0,-th-20);ctx.bezierCurveTo(30,-th-26,66,-th-10,54+tf,-th+16);ctx.bezierCurveTo(52,-110,48,-70,44,-40);ctx.closePath();
  lit(wh,-56,-th-26,56,-40,1.3);seam(ctx,wh,0.35,1.3);
  ctx.save();ctx.clip();ctx.strokeStyle=rgba(darken(wh,0.28),0.45);ctx.lineWidth=1.4;for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(i*10.5,-52);ctx.bezierCurveTo(i*11,-90,i*12.5,-120,i*13,-th-6);ctx.stroke();}
  ctx.fillStyle="rgba(0,0,0,0.12)";ctx.beginPath();ctx.ellipse(30,-90,26,60,0,0,TAU);ctx.fill();ctx.restore();
  ctx.beginPath();ctx.moveTo(-46,-36);ctx.quadraticCurveTo(0,-26,46,-36);ctx.lineTo(45,-56);ctx.quadraticCurveTo(0,-46,-45,-56);ctx.closePath();lit(darken(wh,0.05),-46,-56,46,-26);seam(ctx,wh,0.4,1.2);
  ctx.restore();
  // the arms: white sleeves to a turned-back cuff, then the hands
  (o.arms||[]).forEach(([el,wr,ang,kind],i)=>{const sd=i?1:-1,sh=[sd*72,-228+br];
    limb(ctx,[sh,el,wr],34,26,wh,[-110,-240,110,0]);
    const dx=wr[0]-el[0],dy=wr[1]-el[1],L=Math.hypot(dx,dy)||1;ctx.save();ctx.lineCap="butt";ctx.strokeStyle=rgba(darken(wh,0.2),1);ctx.lineWidth=29;ctx.beginPath();ctx.moveTo(wr[0]-dx/L*14,wr[1]-dy/L*14);ctx.lineTo(wr[0]-dx/L*4,wr[1]-dy/L*4);ctx.stroke();ctx.restore();
    bl_hand(ctx,wr[0],wr[1],1.15,ang,C.skin,kind);});
  ctx.restore();}

// things on the counter, drawn in their materials
function bl_bowl(ctx,x,y,r,fill,o){o=o||{};ctx.save();ctx.translate(x,y);
  ctx.fillStyle="rgba(0,0,0,0.25)";ctx.beginPath();ctx.ellipse(2,4,r*1.05,r*0.3,0,0,TAU);ctx.fill();
  const g=ctx.createLinearGradient(-r,0,r,0);g.addColorStop(0,"#fbf7ef");g.addColorStop(0.6,"#e4ddd0");g.addColorStop(1,"#a89e90");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-r,-r*0.2);ctx.bezierCurveTo(-r,r*0.6,r,r*0.6,r,-r*0.2);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(fill,1);ctx.beginPath();ctx.ellipse(0,-r*0.2,r*0.92,r*0.26,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(lighten(fill,0.3),0.8);for(let i=0;i<5;i++){ctx.beginPath();ctx.arc((hash(i,o.seed||3)-0.5)*r*1.3,-r*0.2+(hash(i,7)-0.5)*r*0.3,r*0.12,0,TAU);ctx.fill();}
  ctx.strokeStyle="rgba(120,110,96,0.7)";ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,-r*0.2,r,r*0.28,0,0,TAU);ctx.stroke();ctx.restore();}
// a plate: o.parts (0..4) the sauce, the roast, the fish, the vegetables; o.rot turns it; o.card puts a credential card on it
function bl_plate(ctx,x,y,s,o){o=o||{};const n=o.parts||0;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgba(0,0,0,0.28)";ctx.beginPath();ctx.ellipse(4,8,62,18,0,0,TAU);ctx.fill();
  const g=ctx.createRadialGradient(-20,-6,4,0,0,62);g.addColorStop(0,"#ffffff");g.addColorStop(1,"#d8d0c2");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,60,17,0,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(150,120,70,0.7)";ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(0,0,50,13,0,0,TAU);ctx.stroke();
  ctx.save();ctx.scale(1,0.3);ctx.rotate(o.rot||0);
  const q=k=>clamp(n-k,0,1);
  if(q(0)>0)withA(ctx,q(0),()=>{ctx.fillStyle="rgba(150,82,40,0.95)";ctx.beginPath();ctx.ellipse(-6,4,34,26,0.4,0,TAU);ctx.fill();ctx.fillStyle="rgba(210,140,80,0.5)";ctx.beginPath();ctx.ellipse(-14,-2,12,7,0.4,0,TAU);ctx.fill();});
  if(q(1)>0)withA(ctx,q(1),()=>{for(let i=0;i<3;i++){ctx.fillStyle=rgba(mix([150,70,60],[200,120,100],i*0.3),1);ctx.beginPath();ctx.ellipse(-18+i*13,-6+i*4,14,22,0.5,0,TAU);ctx.fill();ctx.strokeStyle="rgba(90,40,30,0.8)";ctx.lineWidth=2;ctx.stroke();}});
  if(q(2)>0)withA(ctx,q(2),()=>{ctx.fillStyle="#f2ead8";ctx.beginPath();ctx.ellipse(24,-14,22,12,-0.3,0,TAU);ctx.fill();ctx.strokeStyle="rgba(180,160,120,0.8)";ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle="rgba(240,200,80,0.9)";ctx.beginPath();ctx.ellipse(28,-18,6,3,0,0,TAU);ctx.fill();});
  if(q(3)>0)withA(ctx,q(3),()=>{[[22,22,[235,140,50]],[32,14,[235,140,50]],[12,30,[110,160,70]],[36,28,[110,160,70]],[2,36,[235,140,50]]].forEach(([a,b,c])=>{ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.ellipse(a,b,8,6,0.6,0,TAU);ctx.fill();});});
  ctx.restore();
  if(o.card>0)withA(ctx,o.card,()=>{ctx.save();ctx.translate(0,-30*(1-o.card));glass(ctx,-30,-34,60,38,6,TRUST,{glow:12,ea:0.9,fill:"rgba(26,20,8,0.95)"});ctx.fillStyle=rgba(TRUST,0.9);ctx.fillRect(-20,-24,26,4);ctx.fillRect(-20,-16,38,3);ctx.fillRect(-20,-10,30,3);ctx.restore();});
  ctx.restore();}
// a copper pan, a roasting tin, a board with fish or vegetables, a knife, a spoon
function bl_copper(ctx,x,y,r,a){ctx.save();ctx.translate(x,y);ctx.rotate(a||0);
  ctx.fillStyle=rgba(darken(BL_COPPER,0.3),1);rr(ctx,r*0.9,-6,r*1.5,10,4);ctx.fill();
  const g=ctx.createLinearGradient(-r,0,r,0);g.addColorStop(0,rgba(lighten(BL_COPPER,0.35),1));g.addColorStop(0.5,rgba(BL_COPPER,1));g.addColorStop(1,rgba(darken(BL_COPPER,0.45),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-r,-6);ctx.lineTo(-r*0.92,r*0.55);ctx.quadraticCurveTo(0,r*0.72,r*0.92,r*0.55);ctx.lineTo(r,-6);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(130,70,30,1)";ctx.beginPath();ctx.ellipse(0,-6,r,r*0.25,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(170,96,50,1)";ctx.beginPath();ctx.ellipse(0,-5,r*0.86,r*0.19,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(255,230,190,0.35)";ctx.fillRect(-r*0.75,0,5,r*0.4);ctx.restore();}
function bl_board(ctx,x,y,w,h){ctx.save();const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"#c99a64");g.addColorStop(1,"#8c6238");ctx.fillStyle=g;rr(ctx,x,y,w,h,6);ctx.fill();ctx.strokeStyle="rgba(90,58,30,0.6)";ctx.lineWidth=1.2;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+6,y+i*h/4);ctx.lineTo(x+w-6,y+i*h/4+2);ctx.stroke();}ctx.restore();}
function bl_knife(ctx,x,y,a){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle="#3c2618";rr(ctx,-6,-4,40,9,3);ctx.fill();
  const g=ctx.createLinearGradient(0,-8,0,6);g.addColorStop(0,"#f2f4f6");g.addColorStop(1,"#8c9096");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(34,-4);ctx.lineTo(118,-3);ctx.quadraticCurveTo(124,2,116,7);ctx.lineTo(34,6);ctx.closePath();ctx.fill();ctx.restore();}
function bl_fish(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const g=ctx.createLinearGradient(0,-14,0,14);g.addColorStop(0,"#b8b2a4");g.addColorStop(1,"#f0ece2");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-60,0);ctx.bezierCurveTo(-40,-18,30,-20,52,-4);ctx.lineTo(74,-16);ctx.lineTo(70,0);ctx.lineTo(74,16);ctx.lineTo(52,4);ctx.bezierCurveTo(30,20,-40,18,-60,0);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(110,100,86,0.7)";ctx.lineWidth=1.4;ctx.stroke();
  ctx.fillStyle="#222";ctx.beginPath();ctx.arc(-44,-3,2.4,0,TAU);ctx.fill();ctx.strokeStyle="rgba(120,110,96,0.5)";for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-20+i*12,-10);ctx.quadraticCurveTo(-16+i*12,0,-20+i*12,10);ctx.stroke();}ctx.restore();}
function bl_carrots(ctx,x,y,n,chop){for(let i=0;i<n;i++){ctx.save();ctx.translate(x+i*16,y+(i%2)*4);ctx.rotate(-0.2+hash(i,5)*0.4);ctx.fillStyle="#e2883a";ctx.beginPath();ctx.moveTo(-18,-5);ctx.lineTo(16,-2);ctx.quadraticCurveTo(20,0,16,2);ctx.lineTo(-18,5);ctx.closePath();ctx.fill();ctx.restore();}
  for(let i=0;i<chop;i++){ctx.fillStyle="#f09a48";ctx.beginPath();ctx.ellipse(x+80+i*11,y+2+(i%2)*3,5,4,0,0,TAU);ctx.fill();}}
function bl_roast(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="#2c2c30";rr(ctx,-80,-8,160,34,8);ctx.fill();ctx.fillStyle="#4a4a50";ctx.fillRect(-80,-8,160,6);
  const g=ctx.createRadialGradient(-16,-26,6,0,-14,64);g.addColorStop(0,"#d08a4a");g.addColorStop(0.6,"#8a4424");g.addColorStop(1,"#4a2010");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,-16,60,30,0,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(240,220,190,0.6)";ctx.lineWidth=2;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*20,-42);ctx.quadraticCurveTo(i*22,-16,i*20,10);ctx.stroke();}ctx.restore();}

// one station: its cook at work. k: which station; ev: the moment its work happens (seconds); t: now
function bl_station(ctx,k,t,ev,o){o=o||{};const x=BL_ST[k][1],C=BL_COOKS[k],y=BL_TOP,u=fin(t,ev-0.3,0.5),dn=fin(t,ev,0.18)*(1-fin(t,ev+0.25,0.6));
  let arms,after=()=>{};
  if(k===0){// sauces: the left hand steadies a copper pan, the right stirs with a wooden spoon
    const a=t*(0.9+1.6*u),sx=x+26+Math.cos(a)*14,sy=y+20+Math.sin(a)*4;
    bl_copper(ctx,x+20,y+30,38,0);
    arms=[[[-104,-110],[-62,-4],-0.3,"grip"],[[96,-100],[sx-x+6,sy-y-40],0.25,"grip"]];
    after=()=>{ctx.save();ctx.strokeStyle="#9a6a3a";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx+12,sy-62);ctx.lineTo(sx,sy+6);ctx.stroke();ctx.restore();
      for(let i=0;i<3;i++){const ph=(t*0.4+i/3)%1;withA(ctx,(1-ph)*0.35*(0.4+u),()=>{ctx.strokeStyle="rgba(255,250,240,1)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+10+i*14,y+12-ph*90);ctx.quadraticCurveTo(x+20+i*14+Math.sin(t+i)*8,y-20-ph*90,x+8+i*14,y-40-ph*90);ctx.stroke();});}};}
  else if(k===1){// roasts: both hands, in a cloth, set the roasting tin down
    const lift=(1-ease(fin(t,ev-0.7,0.7)))*-46;after=()=>bl_roast(ctx,x,y+28+lift,1);
    arms=[[[-104,-100],[-70,-6+lift],-0.9,"grip"],[[104,-100],[70,-6+lift],0.9,"grip"]];}
  else{// fish and vegetables: a board, and a knife that comes down once
    bl_board(ctx,x-90,y+10,180,44);if(k===2)bl_fish(ctx,x-14,y+30,0.8);else bl_carrots(ctx,x-70,y+30,4,Math.round(u*4));
    const kh=-34*(1-dn)*(u>0?1:0.4);arms=[[[-100,-104],[-44,-8],-0.2,"flat"],[[100,-104],[44,-26+kh],0.15,"grip"]];
    after=()=>bl_knife(ctx,x+52,y+8+kh,k===2?2.9:3.0);}
  bl_cook(ctx,x,y,0.95,C,{t,arms,look:0.9});after();}

// the chef at the pass: he turns the plate with one hand and looks it over; o.reach (0..1)
function bl_chef(ctx,t,reach){const x=BL_PASS,y=BL_TOP,r=ease(reach);
  bl_cook(ctx,x,y,0.98,BL_CHEF,{t,look:0.6+0.4*r,turn:-0.1,arms:[[[-100,-110],[-70,-10],-0.2,"flat"],[[lerp(100,70,r),lerp(-100,-80,r)],[lerp(64,26,r),lerp(-10,8,r)],lerp(0.3,-0.4,r),"flat"]]});}

// the whole kitchen at time t. o: {st:[4 station moments], lab:[4 label alphas], bowls, tint (0..1), plate:{x,parts,rot,card}, reach, pass}
function bl_kitchen(ctx,t,o){o=o||{};bl_room(ctx,t);
  // a warm light on each station when it works, or its layer's colour on the bridge
  BL_ST.forEach(([,x],k)=>{const on=o.on?o.on[k]:0;if(on>0)glow(ctx,x,420,300,[255,190,120],0.22*on);});
  // the counters first: the cooks stand behind them, and their hands and pans rest on the marble
  bl_counter(ctx,40,1450,{seed:2});bl_counter(ctx,1540,1890,{seed:5});
  BL_ST.forEach(([,x],k)=>bl_station(ctx,k,t,o.st?o.st[k]:1e9));
  bl_chef(ctx,t,o.reach||0);
  // the pass: a brass rail along the chef's counter
  ctx.save();ctx.strokeStyle=rgba(BL_BRASS,0.95);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(1540,712);ctx.lineTo(1890,712);ctx.stroke();ctx.restore();
  // bowls set out ahead: three at each station, at the back of the counter
  const BW=[[[150,80,40],[230,200,120],[110,150,80]],[[190,120,70],[120,90,60],[230,220,200]],[[240,236,224],[120,170,90],[230,200,80]],[[235,140,50],[110,160,70],[230,220,200]]];
  BL_ST.forEach(([,x],k)=>{const b=o.bowls==null?1:o.bowls;BW[k].forEach((c,j)=>{const bx=x-150+j*26+(j>1?250:0),by=BL_TOP+16;bl_bowl(ctx,bx+(j===2?0:0),by,13,c,{seed:k*3+j});});
    if(o.ahead>0)withA(ctx,o.ahead,()=>{glow(ctx,x-138,BL_TOP+14,50,[255,220,160],0.4);});});
  // the plate
  if(o.plate)bl_plate(ctx,o.plate.x,o.plate.y||BL_TOP+44,1,o.plate);
  // the bridge: each station takes its layer's colour, left to right
  if(o.tint>0)BL_ST.forEach(([,x],k)=>{const a=clamp(o.tint*4-k,0,1);if(a<=0)return;const c=LAYER4[k][1];withA(ctx,a,()=>{ctx.save();ctx.globalCompositeOperation="soft-light";ctx.fillStyle=rgba(c,0.7);ctx.fillRect(x-175,100,350,800);ctx.restore();
    ctx.strokeStyle=rgba(c,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-160,906);ctx.lineTo(x+160,906);ctx.stroke();glow(ctx,x,906,120,c,0.25);});});}

/* =====================================================================
   THE PRESENT
   ===================================================================== */
// a code card: the file's path on its tab, the label beneath it ("runs on dbt Core · DuckDB" unless o.label says otherwise),
// then real lines of the project. o: p (typed), lit {i: a}, litCol, fold (0..1 closes it to its tab), sec (a section name),
// strike {i: [text, a]} (a word drawn beside line i and struck through), size, lh, edge, a. Returns its height.
function bl_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=o.lh||29,sz=o.size||18,col=o.edge||[170,205,255],fold=ease(o.fold||0),full=84+lines.length*lh+16,h=lerp(full,78,fold);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.7,fill:"rgba(6,10,20,0.96)"});
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+18,y+18,11,11,3);ctx.fill();T(ctx,bl_fit(ctx,name,18,w-60,500,"mono"),x+38,y+30,{f:"mono",w:500,size:18,color:rgba(col,1)});
    const lab=o.label===undefined?BL_RUN:o.label;if(lab)T(ctx,lab,x+38,y+58,{w:600,size:18,color:rgba(o.labelCol||SOFT,1)});
    if(o.sec)tag(ctx,x+w-18-tw(ctx,o.sec,18,700)-26,y+54,o.sec,col,{size:18});
    if(fold<1){ctx.save();ctx.beginPath();ctx.rect(x,y+72,w,h-72);ctx.clip();withA(ctx,1-fold,()=>{ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+72,w-28,1.2);
      const n=o.p==null?lines.length:lines.length*o.p;lines.forEach((l,i)=>{if(i>=n)return;const yy=y+84+lh*(i+0.78),q=clamp(n-i,0,1),cm=/^\s*(--|#|<!--|\{#)/.test(l),on=o.lit?o.lit[i]||0:0,dm=o.dim?o.dim[i]||0:0;
        if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.17);rr(ctx,x+12,yy-lh*0.72,w-24,lh*0.98,6);ctx.fill();});
        T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:sz,color:rgba(cm?SOFT:mix([205,225,255],o.litCol||TRUST,on*0.6),(cm?0.85:0.96)*(1-0.6*dm))});
        if(o.strike&&o.strike[i]){const[s,sa]=o.strike[i];withA(ctx,sa,()=>{const sx=x+w-40-tw(ctx,s,sz,500,"mono");T(ctx,s,sx,yy,{f:"mono",w:500,size:sz,color:rgba(BAD,1)});ctx.strokeStyle=rgba(BAD,1);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(sx-6,yy-6);ctx.lineTo(sx+tw(ctx,s,sz,500,"mono")+6,yy-6);ctx.stroke();});}});});ctx.restore();}});
  return h;}
// where line i of a card sits (for lines drawn to it)
const bl_lineY=(y,i,lh)=>y+84+(lh||29)*(i+0.78)-6;

/* ---------- the four layers, as four columns ---------- */
// what each column holds: staging's seven views (source colour), intermediate's eight steps, the core's four, the marts' three
const BL_CHIPS=[[["learners",0],["awards",0],["results",0],["users",1],["badges",1],["learners",2],["enrolments",2]],
  [["keys",1],["key candidates",1],["keys matched",1],["learners",1],["timeline",1],["credentials",1],["credit items",1],["credit towards",1]],
  [["learner",2],["award",2],["credential",2],["credit towards award",2]],
  [["near award",3],["wallet learners",3],["wallet credentials",3]]];
const BL_COUNT=["7 views","8 views","4 tables · 1 incremental","3 tables"];
// a column's rectangle: full (o.g: x0, cw, gap, y0, h) or folded into the strip at the top (k = 1)
function bl_colRect(i,k,g){g=g||{};const x0=g.x0==null?60:g.x0,cw=g.cw||210,gap=g.gap==null?14:g.gap,y0=g.y0||140,h=g.h||620,e=ease(k||0);
  return[lerp(x0+i*(cw+gap),60+i*452,e),lerp(y0,92,e),lerp(cw,436,e),lerp(h,72,e)];}
function bl_chipRect(i,j,g){const[x,y,w,h]=bl_colRect(i,0,g),n=BL_CHIPS[i].length,sp=(h-104)/n,ch=Math.min(i===2?84:50,sp-8);return[x+12,y+62+j*sp+(sp-8-ch)/2,w-24,ch];}
// o: k (fold into the strip), lit[i], chips[i] (how many have arrived, 0..n, fractional), hi[i][j], mat (0..1: views become glass, tables stone),
// a[i], g (geometry), count[i] (alpha of the count), say[i][j] (a label drawn instead of the chip's own), rows (core_credential's rows, in stone)
function bl_cols(ctx,t,o){o=o||{};const k=o.k||0,lit=o.lit||[1,1,1,1];
  LAYER4.forEach(([nm,c],i)=>{const a=o.a?o.a[i]:1;if(a<=0.01)return;const[x,y,w,h]=bl_colRect(i,k,o.g),L=lit[i],mat=o.mat||0;
    withA(ctx,a,()=>{
      if(L>0)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.6,c,0.12*L);
      glass(ctx,x,y,w,h,16,mix(SOFT,c,0.3+0.7*L),{glow:6+10*L,ea:0.35+0.55*L,fill:"rgba(7,12,24,"+(0.86+0.08*L)+")"});
      if(mat>0)withA(ctx,mat,()=>bl_material(ctx,i,x,y,w,h,t,o));
      if(i===2&&o.bp>0)bpPaper(ctx,x+8,y+58,w-16,h-66,o.bp,{});
      const hy=lerp(y+40,y+44,k);T(ctx,nm,k>0.5?x+24:x+w/2,hy,{w:800,size:22,align:k>0.5?"left":"center",color:rgba(mix(SOFT,c,0.4+0.6*L),1)});
      const cA=o.count?o.count[i]||0:k;if(cA>0)withA(ctx,cA,()=>{if(k>0.5)T(ctx,BL_COUNT[i],x+w-20,hy,{w:600,size:19,align:"right",color:rgba(SOFT,1)});else T(ctx,BL_COUNT[i].split(" · ")[0],x+w/2,y+h-16,{w:600,size:18,align:"center",color:rgba(SOFT,1)});});
      const chA=1-fin(k,0,0.35);if(chA>0&&o.chips)withA(ctx,chA,()=>BL_CHIPS[i].forEach(([lab,src],j)=>{const q=clamp(o.chips[i]-j,0,1);if(q<=0)return;const[cx,cy,cw,chh]=bl_chipRect(i,j,o.g),hi=o.hi&&o.hi[i]?o.hi[i][j]||0:0;
        const ccol=i===0?SRC3[src][1]:c;
        arrive(ctx,cx+cw/2,cy+chh/2,q*1.6,0,()=>{if(hi>0)glow(ctx,cx+cw/2,cy+chh/2,cw*0.7,ccol,0.35*hi);
          if(i===2){glass(ctx,cx,cy,cw,chh,12,TRUST,{glow:10+12*hi,ea:0.85,fill:"rgba(26,20,8,0.94)"});const ls=lab==="credit towards award"?["credit towards","an award"]:[lab];ls.forEach((s,m)=>T(ctx,s,cx+cw/2,cy+chh/2+8+(m-(ls.length-1)/2)*26,{w:800,size:20,align:"center",color:rgba(mix(INK,TRUST,0.3),1)}));}
          else{glass(ctx,cx,cy,cw,chh,10,ccol,{glow:6+10*hi,ea:0.5+0.4*hi,fill:"rgba(8,14,28,0.95)"});ctx.fillStyle=rgba(ccol,0.95);rr(ctx,cx+10,cy+chh/2-11,6,22,3);ctx.fill();
            const say=o.say&&o.say[i]?o.say[i][j]:null;if(say&&say[1]>0){withA(ctx,1-say[1],()=>T(ctx,lab,cx+26,cy+chh/2+7,{w:700,size:18,color:rgba(INK,0.95)}));withA(ctx,say[1],()=>tag(ctx,cx+24,cy+chh/2,say[0],say[2]||ccol,{size:18}));}
            else T(ctx,bl_fit(ctx,lab,18,cw-34,700),cx+26,cy+chh/2+7,{w:700,size:18,color:rgba(INK,0.95)});}},{d:1});}));});});}
// views as glass panes (light streaks, nothing stored), tables as blocks of stone (with the rows they hold)
function bl_material(ctx,i,x,y,w,h,t,o){const c=LAYER4[i][1];ctx.save();rr(ctx,x+3,y+3,w-6,h-6,14);ctx.clip();
  if(i<2){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(c,0.16));g.addColorStop(1,rgba(c,0.04));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
    ctx.strokeStyle="rgba(255,255,255,0.22)";ctx.lineWidth=10;for(let k=0;k<2;k++){const sx=x-60+((t*30+k*170)%(w+160));ctx.beginPath();ctx.moveTo(sx,y+h);ctx.lineTo(sx+120,y);ctx.stroke();}
    ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=24;ctx.beginPath();ctx.moveTo(x+w*0.2,y+h);ctx.lineTo(x+w*0.7,y);ctx.stroke();}
  else{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(mix(c,[120,120,120],0.55),0.95));g.addColorStop(1,rgba(mix(c,[30,30,30],0.6),0.95));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
    ctx.fillStyle="rgba(0,0,0,0.12)";for(let k=0;k<40;k++){ctx.beginPath();ctx.arc(x+hash(k,i+30)*w,y+hash(k,i+31)*h,1+hash(k,i+32)*3,0,TAU);ctx.fill();}
    ctx.strokeStyle="rgba(0,0,0,0.25)";ctx.lineWidth=2;for(let yy=y+90;yy<y+h;yy+=90){ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy+(hash(yy,i)-0.5)*6);ctx.stroke();}}
  ctx.restore();}

/* ---------- the tests ---------- */
const BL_TESTS=["unique_core_credential_v2_credential_key","relationships_mart_planning__near_award_learner_key__learner_key__ref_core_learner_","unique_combination_mart_planning__near_award_learner_key__award_key",
  "unique_combination_core_learner_v1_learner_key__valid_from","relationships_core_credit_towards_award_v1_award_key__award_key__ref_core_award_","unique_mart_wallet__learners_learner_key","reconcile_planning_with_census_report"];
// o.red[i], o.green[i] (0..1 each), o.p (how many have appeared)
function bl_tests(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lh=46,h=96+BL_TESTS.length*lh;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,[150,170,200],{glow:10,ea:0.55,fill:"rgba(6,10,20,0.95)"});T(ctx,"the tests · written first",x+24,y+40,{w:800,size:22});
    T(ctx,"names from the build",x+w-24,y+40,{w:600,size:18,align:"right",color:rgba(SOFT,1)});
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+62,w-28,1.2);
    BL_TESTS.forEach((s,i)=>{const q=o.p==null?1:clamp(o.p*BL_TESTS.length-i,0,1);if(q<=0)return;const yy=y+96+i*lh,r=o.red?o.red[i]||0:0,gr=o.green?o.green[i]||0:0,col=mix(mix([120,130,150],BAD,r),GOOD,gr);
      withA(ctx,q,()=>{if(r*(1-gr)>0.05||gr>0.05)glow(ctx,x+36,yy,30,col,0.5*Math.max(r,gr));ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x+36,yy,9,0,TAU);ctx.fill();
        T(ctx,bl_fit(ctx,s,18,w-80,500,"mono"),x+58,yy+6,{f:"mono",w:500,size:18,color:rgba(mix([170,180,196],mix(INK,col,0.35),Math.max(r,gr)),1)});});});});}

/* ---------- people of the present, and the consumers ---------- */
// a consumer's badge (film 1's consumers): a round seal with a small dashboard, and the consumer's name
function bl_badge(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;const c=o.col||BL_MART;withA(ctx,a,()=>{glow(ctx,x,y,60,c,0.25);ctx.fillStyle="rgba(7,14,12,0.96)";ctx.beginPath();ctx.arc(x,y,28,0,TAU);ctx.fill();ring(ctx,x,y,28,c,1,2.6);
  ctx.fillStyle=rgba(c,0.95);[[-12,8,6,10],[-3,8,6,16],[6,8,6,7]].forEach(([bx,by,bw,bh])=>ctx.fillRect(x+bx,y+by-bh,bw,bh));ctx.strokeStyle=rgba(c,0.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-15,y+10);ctx.lineTo(x+15,y+10);ctx.stroke();
  if(name)T(ctx,name,x+42,y+8,{w:800,size:24,color:rgba(c,1)});});}

/* ---------- the marts' shapes ---------- */
// Planning's: tall and narrow, 73 rows, 17 columns; sort (0..1) gathers the rows by faculty (38, 15, 15, 5)
const BL_FAC=[["Engineering and IT",38,[110,170,255]],["Business",15,[255,176,96]],["Health",15,[126,224,180]],["Arts and Education",5,[214,150,255]]];
function bl_planTable(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=73,rh=h/n,p=o.p==null?1:o.p,s=ease(o.sort||0);
  const fac=[];BL_FAC.forEach(([,m],f)=>{for(let i=0;i<m;i++)fac.push(f);});const order=fac.map((f,i)=>i).sort((i,j)=>hash(i,77)-hash(j,77));
  withA(ctx,a,()=>{glass(ctx,x-10,y-14,w+20,h+28,10,BL_MART,{glow:12,ea:0.7,fill:"rgba(6,12,10,0.95)"});
    for(let r=0;r<n;r++){if(r>=n*p)break;const from=order.indexOf(r),yy=y+lerp(from,r,s)*rh,f=fac[r],col=mix([150,170,160],BL_FAC[f][2],s);ctx.fillStyle=rgba(col,0.35+0.35*s);ctx.fillRect(x,yy+1,w,Math.max(1.5,rh-2.2));}
    ctx.strokeStyle="rgba(6,12,10,0.9)";ctx.lineWidth=2;for(let c=1;c<17;c++){ctx.beginPath();ctx.moveTo(x+c*w/17,y);ctx.lineTo(x+c*w/17,y+h*p);ctx.stroke();}
    if(o.labels>0){let acc=0;BL_FAC.forEach(([nm,m,col])=>{const yy=y+(acc+m/2)*rh;acc+=m;withA(ctx,o.labels,()=>{ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w+14,yy);ctx.lineTo(x+w+30,yy);ctx.stroke();T(ctx,nm+" · "+m,x+w+38,yy+7,{w:700,size:20,color:rgba(col,1)});});});}});}
// the wallet's: one wide row, its fourteen columns named above it (rotated); o.p reveals the cells left to right; o.tap (0..1)
const BL_WCOLS=["learner_key","full_name","email","status","enrolled_award_name","enrolled_award_type","credit_points_required","credit_points_earned","credit_points_remaining","credentials_held","awards_held","microcredentials_held","badges_held","credentials_revoked"];
function bl_wideRow(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=BL_WCOLS.length,cw=w/n,p=o.p==null?1:o.p;
  withA(ctx,a,()=>{BL_WCOLS.forEach((nm,i)=>{const q=clamp(p*n-i,0,1);if(q<=0)return;withA(ctx,q,()=>{const cx=x+i*cw;
      ctx.fillStyle=rgba(mix([20,40,32],BL_MART,0.25+0.25*(o.tap||0)),0.95);rr(ctx,cx+2,y,cw-4,52,6);ctx.fill();ctx.strokeStyle=rgba(BL_MART,0.8);ctx.lineWidth=1.6;rr(ctx,cx+2,y,cw-4,52,6);ctx.stroke();
      ctx.fillStyle=rgba(BL_MART,0.5);ctx.fillRect(cx+12,y+22,cw-24,8);
      ctx.save();ctx.translate(cx+cw/2+6,y-14);ctx.rotate(-Math.PI/2);T(ctx,nm,0,0,{f:"mono",w:500,size:18,color:rgba(mix(SOFT,INK,0.5),1)});ctx.restore();});});
    if(o.tap>0)glow(ctx,x+w/2,y+26,w*0.4,BL_MART,0.25*o.tap);});}

/* ---------- the CTE outline of Planning's mart ---------- */
const BL_OUT=[["import",["learners","awards","credit"]],["logical",["learners_at_census","awards_at_census","credit_at_census","learner_awards","joined","measured"]],["final",["final select"]]];
// positions of each name; o.on[g] lights a group; o.trace {name: a}; o.cols {name: [column, a]}
function bl_outlinePos(x,y){const P={};let yy=y;BL_OUT.forEach(([g,ns])=>{yy+=58;ns.forEach(n=>{P[n]=[x,yy];yy+=44;});yy+=8;});return P;}
function bl_outline(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const P=bl_outlinePos(x,y),HN={import:"import CTEs",logical:"logical CTEs",final:"final select"};
  withA(ctx,a,()=>{let yy=y;BL_OUT.forEach(([g,ns],gi)=>{const on=o.on?o.on[gi]||0:1;withA(ctx,0.3+0.7*on,()=>{T(ctx,HN[g],x-14,yy+22,{w:800,size:20,color:rgba(mix(SOFT,BL_MART,on),1)});});yy+=58;
      ns.forEach((n,i)=>{const[px,py]=P[n],tr=o.trace?o.trace[n]||0:0;withA(ctx,0.3+0.7*on,()=>{if(tr>0)glow(ctx,px+90,py-6,120,TRUST,0.25*tr);ctx.fillStyle=rgba(mix(BL_MART,TRUST,tr),1);ctx.beginPath();ctx.arc(px+6,py-6,5,0,TAU);ctx.fill();
        T(ctx,n,px+22,py,{f:"mono",w:500,size:20,color:rgba(mix(INK,TRUST,tr*0.7),1)});
        const cc=o.cols?o.cols[n]:null;if(cc&&cc[1]>0)withA(ctx,cc[1],()=>T(ctx,cc[0],px+270,py,{f:"mono",w:500,size:18,color:rgba(TRUST,1)}));});yy+=44;});yy+=8;});});
  return P;}

/* ---------- a balance: twelve and twelve ---------- */
function bl_balance(ctx,x,y,a,tilt,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const c=o.col||GOOD,r=tilt||0;ctx.save();ctx.strokeStyle=rgba(BL_BRASS,1);ctx.fillStyle=rgba(BL_BRASS,1);ctx.lineWidth=5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x,y+150);ctx.lineTo(x,y);ctx.stroke();ctx.fillRect(x-50,y+146,100,10);
  const dx=Math.cos(r)*170,dy=Math.sin(r)*170;ctx.beginPath();ctx.moveTo(x-dx,y-dy);ctx.lineTo(x+dx,y+dy);ctx.stroke();ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();
  [[-1,o.l||"12"],[1,o.r||"12"]].forEach(([sd,s])=>{const px=x+sd*dx,py=y+sd*dy;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-44,py+70);ctx.moveTo(px,py);ctx.lineTo(px+44,py+70);ctx.stroke();
    ctx.beginPath();ctx.moveTo(px-60,py+70);ctx.quadraticCurveTo(px,py+100,px+60,py+70);ctx.closePath();ctx.fill();T(ctx,s,px,py+56,{w:800,size:40,align:"center",color:rgba(c,1)});});ctx.restore();});}

/* ---------- a project frame, empty, waiting for its models ---------- */
function bl_frame(ctx,x,y,w,h,a,lab){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(BL_MART,0.8);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,18);ctx.stroke();ctx.restore();
  if(lab)T(ctx,lab,x+w/2,y+h+40,{w:700,size:22,align:"center",color:rgba(BL_MART,1)});});}
