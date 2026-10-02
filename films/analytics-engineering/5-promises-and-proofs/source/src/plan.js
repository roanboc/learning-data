/* ===== Promises and proofs: the film's own pictures (prefixed pp_) =====
   London from 1300: a silversmith's cup on a bench, a scraper that takes a sliver from its foot, a small balance that weighs it,
   the punch that strikes the leopard's head, Goldsmiths' Hall, and a buyer's hand that takes the cup without a second look.
   The past is drawn like living things and real materials: tapering outlines, a light side and a shadow side, a little breath.
   Then the present, crisp on dark glass: the gap register and its three decisions, the contracts, the tests, the warn-or-stop
   light, and the hollow seal that waits beside the core until its tests pass. */

const PP_RUN="runs on dbt Core · DuckDB",PP_AMB=[255,190,80],PP_LMS=SRC3[1][1],PP_SC=SRC3[2][1],PP_SIS=SRC3[0][1],PP_MART=LAYER4[3][1],PP_INT=LAYER4[1][1];
const PP_SILVER=[214,220,228],PP_BRASS=[208,164,86],PP_INK="rgba(64,42,24,0.92)";
// the three decisions a gap can get, each in its own colour
const PP_DEC=[["fix at source",[255,160,110]],["rule in the model",[178,156,255]],["accept and document",[140,200,255]]];
const pp_sp=(t,t0,d)=>spring(clamp((t-t0)/(d||0.7),0,2));

/* ---------- the past ---------- */
// the workshop bench: a thick oak top, lit from above, with its grain; y is the top surface
function pp_bench(ctx,y,t){ctx.save();let g=ctx.createLinearGradient(0,y,0,y+34);g.addColorStop(0,"#a77748");g.addColorStop(0.4,"#8a5c34");g.addColorStop(1,"#4e3018");ctx.fillStyle=g;ctx.fillRect(0,y,W,34);
  g=ctx.createLinearGradient(0,y+34,0,H);g.addColorStop(0,"#3a2412");g.addColorStop(1,"#120a05");ctx.fillStyle=g;ctx.fillRect(0,y+34,W,H-y-34);
  ctx.strokeStyle="rgba(60,36,18,0.45)";ctx.lineWidth=1.2;for(let i=0;i<9;i++){const yy=y+4+i*3.4;ctx.beginPath();ctx.moveTo(0,yy);for(let x=0;x<=W;x+=60)ctx.lineTo(x,yy+Math.sin(x*0.004+i*1.7)*1.6+hash(i,x)*0.8);ctx.stroke();}
  ctx.fillStyle="rgba(255,226,180,0.18)";ctx.fillRect(0,y,W,2);
  // a few knots and the darker grain of the front edge
  [[300,y+16],[1180,y+12],[1660,y+20]].forEach(([kx,ky],i)=>{ctx.strokeStyle="rgba(50,28,12,0.5)";ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(kx,ky,18+i*4,4,0,0,TAU);ctx.stroke();});ctx.restore();}

// a silver beaker cup on a foot: tulip bowl, a knop on the stem, a round foot. (x,y) is the bottom of the foot.
// The metal mirrors the warm room: a dark side, a bright band where the window is, and a soft rim light.
// o.mark (0..1) the struck leopard's head; o.scrape (0..1) the bright scratch where the sliver was taken; o.rot a tilt
function pp_cup(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);
  const met=(x0,x1)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"#4a4c52");g.addColorStop(0.18,"#9a9ca2");g.addColorStop(0.3,"#f4f2ea");g.addColorStop(0.38,"#c9c8c2");g.addColorStop(0.62,"#7d7f86");g.addColorStop(0.82,"#b7a68a");g.addColorStop(1,"#3c3d42");return g;};
  // a soft shadow on the bench
  if(!o.lifted){const sg=ctx.createRadialGradient(10,2,4,10,2,110);sg.addColorStop(0,"rgba(0,0,0,0.45)");sg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sg;ctx.beginPath();ctx.ellipse(10,2,110,16,0,0,TAU);ctx.fill();}
  // foot: a low dome with a moulded edge
  ctx.beginPath();ctx.moveTo(-64,0);ctx.bezierCurveTo(-64,-10,-50,-14,-30,-20);ctx.bezierCurveTo(-18,-26,-12,-34,-11,-44);ctx.lineTo(11,-44);ctx.bezierCurveTo(12,-34,18,-26,30,-20);ctx.bezierCurveTo(50,-14,64,-10,64,0);ctx.closePath();ctx.fillStyle=met(-64,64);ctx.fill();
  ctx.strokeStyle="rgba(40,40,46,0.6)";ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle=met(-66,66);ctx.beginPath();ctx.ellipse(0,-1,65,5,0,0,TAU);ctx.fill();
  if(o.scrape>0){withA(ctx,o.scrape,()=>{ctx.strokeStyle="rgba(255,252,240,0.95)";ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(22,-9);ctx.lineTo(40,-6);ctx.stroke();});}
  // stem with a knop
  ctx.fillStyle=met(-12,12);ctx.beginPath();ctx.moveTo(-10,-44);ctx.bezierCurveTo(-7,-56,-7,-62,-8,-70);ctx.lineTo(8,-70);ctx.bezierCurveTo(7,-62,7,-56,10,-44);ctx.closePath();ctx.fill();
  ctx.fillStyle=met(-20,20);ctx.beginPath();ctx.ellipse(0,-74,19,10,0,0,TAU);ctx.fill();ctx.strokeStyle="rgba(40,40,46,0.5)";ctx.stroke();
  ctx.fillStyle=met(-10,10);ctx.fillRect(-8,-86,16,10);
  // the bowl: a tulip, narrow at the base, flaring to the lip
  const bowl=()=>{ctx.beginPath();ctx.moveTo(-14,-86);ctx.bezierCurveTo(-60,-96,-84,-140,-80,-196);ctx.bezierCurveTo(-78,-232,-82,-256,-90,-276);ctx.lineTo(90,-276);ctx.bezierCurveTo(82,-256,78,-232,80,-196);ctx.bezierCurveTo(84,-140,60,-96,14,-86);ctx.closePath();};
  bowl();ctx.fillStyle=met(-90,90);ctx.fill();
  ctx.save();bowl();ctx.clip();
  // the window's reflection, and the room's warmth on the shadow side
  let g=ctx.createLinearGradient(0,-276,0,-86);g.addColorStop(0,"rgba(255,240,210,0.0)");g.addColorStop(0.5,"rgba(255,240,210,0.12)");g.addColorStop(1,"rgba(40,30,20,0.35)");ctx.fillStyle=g;ctx.fillRect(-100,-280,200,200);
  ctx.fillStyle="rgba(255,255,250,0.55)";ctx.beginPath();ctx.moveTo(-46,-262);ctx.bezierCurveTo(-52,-210,-50,-150,-34,-108);ctx.lineTo(-26,-110);ctx.bezierCurveTo(-40,-152,-40,-210,-36,-262);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,214,160,0.18)";ctx.beginPath();ctx.ellipse(56,-170,14,70,0.05,0,TAU);ctx.fill();ctx.restore();
  bowl();ctx.strokeStyle="rgba(36,36,42,0.7)";ctx.lineWidth=1.4;ctx.stroke();
  // the lip, a thin rolled rim with the inside showing dark
  ctx.fillStyle="#2c2d33";ctx.beginPath();ctx.ellipse(0,-276,90,9,0,0,TAU);ctx.fill();ctx.strokeStyle="#e6e4dc";ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(0,-276,90,9,0,0,TAU);ctx.stroke();
  // a band of engraved lines below the lip
  ctx.strokeStyle="rgba(60,60,66,0.45)";ctx.lineWidth=1;[-250,-244].forEach(yy=>{ctx.beginPath();ctx.moveTo(-84,yy);ctx.quadraticCurveTo(0,yy+6,84,yy);ctx.stroke();});
  if(o.mark>0)pp_leopard(ctx,22,-160,17,null,o.mark,{struck:true});
  ctx.restore();});}

// the leopard's head, as a punched mark: a crowned leopard's face, front on, in a shaped shield. r is its half-height.
// struck: drawn sunk into silver (dark recess, lit lower edge); otherwise drawn in col, for the present
function pp_leopard(ctx,x,y,r,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);const k=r/40;ctx.scale(k,k);
  const st=!!o.struck,ink=st?"rgba(40,38,40,0.9)":rgba(col,1),hi=st?"rgba(255,252,240,0.85)":rgba(col,0.35),fl=st?"rgba(70,70,76,0.55)":rgba(col,0.12);
  const shield=()=>{ctx.beginPath();ctx.moveTo(-34,-40);ctx.lineTo(34,-40);ctx.bezierCurveTo(36,-4,30,22,0,42);ctx.bezierCurveTo(-30,22,-36,-4,-34,-40);ctx.closePath();};
  shield();ctx.fillStyle=fl;ctx.fill();ctx.lineWidth=st?3:3.2;ctx.strokeStyle=ink;ctx.stroke();
  if(st){ctx.save();ctx.translate(1.4,1.8);shield();ctx.strokeStyle=hi;ctx.lineWidth=1.2;ctx.stroke();ctx.restore();}
  ctx.lineWidth=2.4;ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=ink;ctx.fillStyle=ink;
  // crown: a band and three points
  ctx.beginPath();ctx.moveTo(-16,-24);ctx.lineTo(-18,-34);ctx.lineTo(-8,-28);ctx.lineTo(0,-36);ctx.lineTo(8,-28);ctx.lineTo(18,-34);ctx.lineTo(16,-24);ctx.closePath();ctx.stroke();
  // ears, the face, a broad nose, eyes and the mouth
  ctx.beginPath();ctx.moveTo(-18,-16);ctx.quadraticCurveTo(-26,-24,-22,-10);ctx.moveTo(18,-16);ctx.quadraticCurveTo(26,-24,22,-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-20,-18);ctx.bezierCurveTo(-26,0,-18,20,0,26);ctx.bezierCurveTo(18,20,26,0,20,-18);ctx.quadraticCurveTo(0,-24,-20,-18);ctx.stroke();
  ctx.beginPath();ctx.ellipse(-8,-6,3.4,2.2,0.3,0,TAU);ctx.ellipse(8,-6,3.4,2.2,-0.3,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(-5,4);ctx.lineTo(5,4);ctx.lineTo(0,10);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(0,14);ctx.moveTo(-7,16);ctx.quadraticCurveTo(0,20,7,16);ctx.stroke();
  [[-12,9],[-14,13],[12,9],[14,13]].forEach(([wx,wy])=>{ctx.beginPath();ctx.arc(wx,wy,1.2,0,TAU);ctx.fill();});
  ctx.restore();});}

// a hand from life, holding something in a closed grip: (x,y) is the middle of the grip, the arm runs off to +x.
// Tapering fingers, each its own roll, a thumb over the top, the back of the hand, a linen cuff and a wool sleeve.
// o.skin, o.sleeve; o.flip mirrors it (an arm from the left); o.tool "scraper" puts a scraper in the grip.
function pp_hand(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);if(o.flip)ctx.scale(-1,1);ctx.rotate((o.rot||0)+0.012*Math.sin(t*1.3+(o.seed||0)));ctx.scale(s,s);
  const skin=o.skin||[226,182,146],lit=rgba(mix(skin,[255,246,232],0.32),1),mid=rgba(skin,1),dk=rgba(mix(skin,[90,48,28],0.45),1),edge="rgba(110,64,40,0.55)";
  const sg=(y0,y1)=>{const q=ctx.createLinearGradient(0,y0,0,y1);q.addColorStop(0,lit);q.addColorStop(0.55,mid);q.addColorStop(1,dk);return q;};
  // the tool behind the fingers: a wooden handle above, a steel blade below
  if(o.tool==="scraper"){let g=ctx.createLinearGradient(-10,0,10,0);g.addColorStop(0,"#5a3a20");g.addColorStop(0.45,"#a2744a");g.addColorStop(1,"#4a2e16");ctx.fillStyle=g;rr(ctx,-9,-96,18,120,8);ctx.fill();
    g=ctx.createLinearGradient(-6,0,6,0);g.addColorStop(0,"#6c6e74");g.addColorStop(0.4,"#eceae4");g.addColorStop(1,"#55575c");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-5,22);ctx.lineTo(5,22);ctx.lineTo(4,92);ctx.lineTo(-2,104);ctx.lineTo(-5,92);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(40,40,46,0.6)";ctx.lineWidth=1;ctx.stroke();}
  // the sleeve, wool: it widens from the cuff to the elbow, shaded across its round, with soft folds; o.len ends it
  // short (it fades into the shadow there) so a forearm never runs into the caption area
  const sl=o.sleeve||[86,64,48],L=o.len||1200,fd=o.len?Math.min(220,L*0.4):0,wy=x_=>{const q=clamp((x_-150)/Math.max(1,L-150),0,1);return [-52-18*Math.sqrt(q),62+20*Math.sqrt(q)];};
  const slv=()=>{ctx.beginPath();ctx.moveTo(150,-52);for(let i=1;i<=16;i++){const x_=150+(L-150)*i/16;ctx.lineTo(x_,wy(x_)[0]);}for(let i=16;i>=1;i--){const x_=150+(L-150)*i/16;ctx.lineTo(x_,wy(x_)[1]);}ctx.lineTo(150,62);ctx.bezierCurveTo(140,22,140,-18,150,-52);ctx.closePath();};
  let g=ctx.createLinearGradient(0,-90,0,100);g.addColorStop(0,rgba(mix(sl,[255,240,220],0.22),1));g.addColorStop(0.3,rgba(mix(sl,[255,240,220],0.06),1));g.addColorStop(0.62,rgba(sl,1));g.addColorStop(1,rgba(mix(sl,[0,0,0],0.6),1));
  const N=fd?10:1;for(let i=0;i<N;i++){const x0=fd?L-fd+fd*i/N:140,x1=fd?L-fd+fd*(i+1)/N:L+2;ctx.save();ctx.beginPath();ctx.rect(fd&&i===0?140:x0,-200,x1-(fd&&i===0?140:x0),400);ctx.clip();ctx.globalAlpha*=fd?1-i/N:1;slv();ctx.fillStyle=g;ctx.fill();
    // a lit upper edge, and folds where the wool bunches at the wrist and the elbow
    ctx.strokeStyle=rgba(mix(sl,[255,236,210],0.45),0.45);ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<=16;k++){const x_=152+(L-154)*k/16;ctx.lineTo(x_,wy(x_)[0]+3);}ctx.stroke();
    ctx.strokeStyle=rgba(mix(sl,[0,0,0],0.5),0.5);ctx.lineWidth=2;[0.06,0.13,0.22,0.45,0.62].forEach((f,j)=>{const x_=150+(L-150)*f,[a0,a1]=wy(x_),d=j%2?14:-10;ctx.beginPath();ctx.moveTo(x_,a0+4);ctx.bezierCurveTo(x_+22+d,a0+30,x_+d,a1-30,x_+20,a1-4);ctx.stroke();});
    ctx.strokeStyle=rgba(mix(sl,[255,230,200],0.3),0.3);ctx.lineWidth=1.6;[0.09,0.17,0.5].forEach(f=>{const x_=150+(L-150)*f+8,[a0,a1]=wy(x_);ctx.beginPath();ctx.moveTo(x_,a0+8);ctx.bezierCurveTo(x_+20,a0+34,x_-4,a1-34,x_+16,a1-8);ctx.stroke();});
    ctx.restore();}
  // the cuff: linen, gathered
  g=ctx.createLinearGradient(0,-50,0,60);g.addColorStop(0,"#f6efe0");g.addColorStop(0.6,"#d8ccb4");g.addColorStop(1,"#9c8e76");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(116,-44);ctx.bezierCurveTo(132,-50,146,-52,156,-50);ctx.bezierCurveTo(148,-14,148,26,156,58);ctx.bezierCurveTo(144,60,128,58,116,52);ctx.bezierCurveTo(108,20,108,-12,116,-44);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(110,98,80,0.55)";ctx.lineWidth=1.2;ctx.stroke();
  // the back of the hand, from the knuckles to the wrist
  ctx.beginPath();ctx.moveTo(18,-38);ctx.bezierCurveTo(50,-50,94,-48,122,-40);ctx.bezierCurveTo(128,-10,128,22,122,46);ctx.bezierCurveTo(90,54,52,52,26,40);ctx.bezierCurveTo(10,30,4,-20,18,-38);ctx.closePath();ctx.fillStyle=sg(-50,54);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.stroke();
  ctx.strokeStyle="rgba(150,92,62,0.3)";ctx.lineWidth=1.3;[[52,-36,92,-32],[56,-24,100,-20]].forEach(([x0,y0,x1,y1])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,y0-4,x1,y1);ctx.stroke();});
  // four fingers curled round the grip, in front of it: each a roll, darker as it turns under, with a knuckle crease
  [[-4,-24,24,12,0.15],[-8,-2,25,12,0.06],[-6,19,24,11.5,-0.05],[0,38,20,10,-0.15]].forEach(([fx,fy,rx,ry,rt],i)=>{ctx.beginPath();ctx.ellipse(fx,fy,rx,ry,rt,0,TAU);ctx.fillStyle=sg(fy-ry,fy+ry);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.3;ctx.stroke();
    ctx.strokeStyle="rgba(150,92,62,0.4)";ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(fx+rx*0.35,fy-ry*0.7);ctx.quadraticCurveTo(fx+rx*0.25,fy,fx+rx*0.35,fy+ry*0.7);ctx.stroke();
    ctx.fillStyle="rgba(255,232,220,0.55)";ctx.beginPath();ctx.ellipse(fx-rx*0.72,fy+1,3.4,5.2,0,0,TAU);ctx.fill();});
  // the thumb, over the top of the grip
  ctx.beginPath();ctx.moveTo(70,-40);ctx.bezierCurveTo(48,-62,14,-60,-10,-50);ctx.bezierCurveTo(-22,-45,-20,-36,-8,-35);ctx.bezierCurveTo(16,-34,44,-32,74,-26);ctx.closePath();ctx.fillStyle=sg(-62,-26);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.4;ctx.stroke();
  ctx.fillStyle="rgba(255,236,224,0.6)";ctx.beginPath();ctx.ellipse(-8,-46,7,3.4,-0.25,0,TAU);ctx.fill();
  ctx.restore();});}

// the assay balance: a brass pillar, a beam and two pans on cords. tilt in radians; o.sliver, o.weight on the pans
function pp_balance(ctx,x,y,s,tilt,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const br=(x0,x1)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"#6a4c22");g.addColorStop(0.35,"#f0cf86");g.addColorStop(0.6,"#b88a42");g.addColorStop(1,"#5a3e18");return g;};
  // a soft shadow, a wooden base and the pillar
  const sh=ctx.createRadialGradient(0,2,4,0,2,120);sh.addColorStop(0,"rgba(0,0,0,0.4)");sh.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sh;ctx.beginPath();ctx.ellipse(0,2,120,12,0,0,TAU);ctx.fill();
  let g=ctx.createLinearGradient(0,-24,0,0);g.addColorStop(0,"#8a5a32");g.addColorStop(1,"#3e2412");ctx.fillStyle=g;rr(ctx,-90,-24,180,24,5);ctx.fill();
  ctx.fillStyle=br(-7,7);ctx.fillRect(-6,-210,12,188);ctx.beginPath();ctx.ellipse(0,-24,22,6,0,0,TAU);ctx.fill();
  // the beam and its pointer, pivoting at the top
  ctx.save();ctx.translate(0,-212);ctx.rotate(tilt);ctx.fillStyle=br(-4,4);ctx.beginPath();ctx.moveTo(-130,-3);ctx.lineTo(130,-3);ctx.lineTo(130,3);ctx.lineTo(-130,3);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(0,-44);ctx.lineTo(3,0);ctx.closePath();ctx.fill();ctx.fillStyle="#f6dc9c";ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();ctx.restore();
  // the pans hang straight down from the beam's ends
  [-1,1].forEach(sd=>{const ex=sd*130*Math.cos(tilt),ey=-212+sd*130*Math.sin(tilt),py=ey+110;ctx.strokeStyle="rgba(200,170,110,0.75)";ctx.lineWidth=1.2;
    [-34,0,34].forEach(dx=>{ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+dx,py);ctx.stroke();});
    ctx.fillStyle=br(ex-40,ex+40);ctx.beginPath();ctx.moveTo(ex-40,py);ctx.quadraticCurveTo(ex,py+26,ex+40,py);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(80,56,20,0.6)";ctx.stroke();
    if(sd<0&&o.sliver>0)withA(ctx,o.sliver,()=>{ctx.fillStyle="#efeee8";ctx.beginPath();ctx.moveTo(ex-10,py+2);ctx.quadraticCurveTo(ex,py-6,ex+12,py+1);ctx.quadraticCurveTo(ex,py+3,ex-10,py+2);ctx.fill();});
    if(sd>0&&o.weight>0)withA(ctx,o.weight,()=>{ctx.fillStyle=br(ex-8,ex+8);rr(ctx,ex-8,py-12,16,13,2);ctx.fill();ctx.beginPath();ctx.arc(ex,py-14,4,0,TAU);ctx.fill();});});
  ctx.restore();});}

// the punch and hammer: a steel punch stood upright, its face at (x,y), and a hammer held by a hand from above. down (0..1)
// brings the hammer from raised to the blow on the punch's head; it falls faster as it goes, like a real swing
function pp_punch(ctx,x,y,s,down,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  let g=ctx.createLinearGradient(-13,0,13,0);g.addColorStop(0,"#45474c");g.addColorStop(0.35,"#dcdcd6");g.addColorStop(0.6,"#8a8c90");g.addColorStop(1,"#3a3b40");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-7,0);ctx.lineTo(7,0);ctx.lineTo(12,-28);ctx.lineTo(12,-150);ctx.lineTo(-12,-150);ctx.lineTo(-12,-28);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(30,30,34,0.6)";ctx.lineWidth=1.2;ctx.stroke();
  ctx.fillStyle="#b4b4b0";ctx.beginPath();ctx.ellipse(0,-150,13,4,0,0,TAU);ctx.fill();
  // the hammer turns about the smith's wrist, to the right of the punch: raised, then down onto the punch's head
  const d=clamp(down,0,1),an=0.75*(1-d*d);ctx.save();ctx.translate(196,-188);ctx.rotate(an);
  g=ctx.createLinearGradient(0,-11,0,11);g.addColorStop(0,"#a87a4c");g.addColorStop(0.5,"#7a5230");g.addColorStop(1,"#3e2614");ctx.fillStyle=g;rr(ctx,-196,-10,226,20,9);ctx.fill();
  // the head: dark forged iron, wider than the punch, with a bright striking face at its foot
  g=ctx.createLinearGradient(-224,0,-168,0);g.addColorStop(0,"#1e1f22");g.addColorStop(0.4,"#5c5e62");g.addColorStop(1,"#26272a");ctx.fillStyle=g;rr(ctx,-224,-36,56,74,7);ctx.fill();ctx.strokeStyle="rgba(10,10,12,0.8)";ctx.lineWidth=1.4;ctx.stroke();
  ctx.fillStyle="rgba(255,255,250,0.22)";ctx.fillRect(-218,-32,5,66);ctx.fillStyle="#b8b8b2";ctx.fillRect(-222,32,52,6);
  // the hand round the handle's end, its forearm up and out of the frame
  pp_hand(ctx,6,0,0.62/s,t,{rot:-Math.PI/2,sleeve:o.sleeve||[92,70,52],skin:o.skin||[214,170,132],seed:3,len:o.len});
  ctx.restore();ctx.restore();});}

// Goldsmiths' Hall: a stone front with columns, windows, a cornice and steps, lit from the left
function pp_hall(ctx,x,y,w,h,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();const st=(x0,x1)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"#d8c8a8");g.addColorStop(1,"#8c7a5e");return g;};
  ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=24;ctx.fillStyle=st(x,x+w);ctx.fillRect(x,y+h*0.12,w,h*0.8);ctx.shadowBlur=0;
  // cornice and attic
  ctx.fillStyle="#e6d8bc";ctx.fillRect(x-14,y+h*0.1,w+28,h*0.05);ctx.fillStyle="#b6a482";ctx.fillRect(x-6,y,w+12,h*0.1);ctx.fillStyle="rgba(60,44,28,0.35)";ctx.fillRect(x-14,y+h*0.15,w+28,4);
  // windows between the columns, warm inside
  const n=5,cw=w/(n+1);for(let i=0;i<n+1;i++){const wx=x+cw*i+cw*0.28,wy=y+h*0.24;ctx.fillStyle="rgba(46,30,18,0.9)";rr(ctx,wx,wy,cw*0.44,h*0.26,cw*0.2);ctx.fill();ctx.fillStyle="rgba(255,200,120,"+(0.18+0.08*Math.sin(t*0.7+i))+")";rr(ctx,wx+3,wy+3,cw*0.44-6,h*0.26-6,cw*0.18);ctx.fill();
    ctx.fillStyle="rgba(46,30,18,0.9)";ctx.fillRect(wx,y+h*0.58,cw*0.44,h*0.16);}
  // columns with capitals and bases: a lit edge on the left, shade on the right
  for(let i=1;i<=n;i++){const cx=x+cw*i,c0=cx-cw*0.12,c1=cx+cw*0.12,g=ctx.createLinearGradient(c0,0,c1,0);g.addColorStop(0,"#fbf2de");g.addColorStop(0.4,"#e2d2b2");g.addColorStop(1,"#9a8664");ctx.fillStyle=g;ctx.fillRect(c0,y+h*0.19,c1-c0,h*0.66);
    ctx.fillStyle="#efe2c6";ctx.fillRect(c0-6,y+h*0.16,c1-c0+12,h*0.035);ctx.fillRect(c0-5,y+h*0.84,c1-c0+10,h*0.03);
    ctx.strokeStyle="rgba(120,100,70,0.35)";ctx.lineWidth=1;for(let f=1;f<4;f++){ctx.beginPath();ctx.moveTo(lerp(c0,c1,f/4),y+h*0.2);ctx.lineTo(lerp(c0,c1,f/4),y+h*0.84);ctx.stroke();}}
  // steps
  for(let k=0;k<3;k++){ctx.fillStyle=k%2?"#bcaa88":"#cdbd9c";ctx.fillRect(x-8-k*10,y+h*0.92+k*h*0.027,w+16+k*20,h*0.027);}
  ctx.restore();});}

// a written standard on parchment, unrolling from the left as u goes 0..1, its roll at the right edge
function pp_scroll(ctx,x,y,w,h,u,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||u<=0)return;withA(ctx,a,()=>{const ww=Math.max(24,w*ease(u));
  ctx.save();ctx.beginPath();ctx.rect(x-10,y-20,ww+10,h+40);ctx.clip();kt_paper(ctx,x,y,w,h,t,{col:[236,222,190],seed:7,curl:0.2,age:0.3});
  T(ctx,"sterling",x+w/2,y+h*0.52,{w:800,size:62,align:"center",color:PP_INK});
  T(ctx,"925 parts silver in 1000",x+w/2,y+h*0.52+48,{w:600,size:22,align:"center",color:"rgba(80,56,34,0.9)"});
  T(ctx,"the standard",x+w/2,y+44,{w:700,size:20,align:"center",color:"rgba(110,74,44,0.85)"});ctx.restore();
  // the roll
  const rx=x+ww;let g=ctx.createLinearGradient(rx-14,0,rx+14,0);g.addColorStop(0,"#8c7650");g.addColorStop(0.45,"#f2e6c8");g.addColorStop(1,"#7a6440");ctx.fillStyle=g;rr(ctx,rx-12,y-10,26,h+20,12);ctx.fill();});}

// a woven basket on the bench: (x,y) is its bottom centre
// part: "back" (its shadow and dark inside, drawn before what goes in it) or "front" (its woven side, drawn after)
function pp_basket(ctx,x,y,s,a,part){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  if(part==="back"){const sh=ctx.createRadialGradient(0,0,4,0,0,150);sh.addColorStop(0,"rgba(0,0,0,0.45)");sh.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sh;ctx.beginPath();ctx.ellipse(0,0,150,14,0,0,TAU);ctx.fill();
    ctx.fillStyle="#2a1a0c";ctx.beginPath();ctx.ellipse(0,-110,130,16,0,0,TAU);ctx.fill();ctx.strokeStyle="#a87c48";ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,-110,130,16,0,Math.PI,TAU);ctx.stroke();ctx.restore();return;}
  const body=()=>{ctx.beginPath();ctx.moveTo(-130,-110);ctx.bezierCurveTo(-126,-40,-110,-6,-90,0);ctx.lineTo(90,0);ctx.bezierCurveTo(110,-6,126,-40,130,-110);ctx.closePath();};
  let g=ctx.createLinearGradient(-130,0,130,0);g.addColorStop(0,"#5a3a1c");g.addColorStop(0.35,"#b8874c");g.addColorStop(1,"#4a2e14");body();ctx.fillStyle=g;ctx.fill();
  ctx.save();body();ctx.clip();ctx.strokeStyle="rgba(50,30,12,0.5)";ctx.lineWidth=2;for(let r=0;r<7;r++){ctx.beginPath();for(let xx=-140;xx<=140;xx+=20){const yy=-104+r*16+((xx/20+r)%2?4:-4);xx===-140?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.stroke();}
  for(let xx=-120;xx<=120;xx+=24){ctx.beginPath();ctx.moveTo(xx,-112);ctx.lineTo(xx*0.72,0);ctx.stroke();}ctx.restore();
  ctx.strokeStyle="#c89a5c";ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,-110,130,16,0,0,Math.PI);ctx.stroke();ctx.restore();});}

/* ---------- the present ---------- */
// the hollow seal: where the mark will be struck once the core's tests pass. struck (0..1) fills it; until then it's a dashed ring
function pp_seal(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*1.8,TRUST,0.12+0.05*Math.sin(t*1.2));
  ctx.fillStyle="rgba(10,12,20,0.9)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,TRUST,0.8,2.2,[6,7]);pp_leopard(ctx,x,y+2,r*0.62,TRUST,0.38);
  if(o.label!==false)T(ctx,o.label||"not yet struck",x,y+r+30,{w:700,size:18,align:"center",color:rgba(TRUST,0.9)});});}

// a code card with the label that says where it runs (18 px), code at o.size (18 to 20 px). Lines type out as o.p goes 0..1.
// o.lit {i:0..1} highlights a line; o.lineCol {i:colour}; o.swap {i:[text, 0..1]} cross-fades a line to new text; o.label "" for none
function pp_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||19,lh=o.lh||Math.round(sz*1.5),col=o.edge||[170,205,255];
  const lab=o.label===undefined?PP_RUN:o.label,nw=tw(ctx,name,18,500,"mono"),lw=lab?tw(ctx,lab,18,700)+28:0,two=!!lab&&nw+lw+64>w,hh=two?88:56,h=o.h||(hh+18+lines.length*lh);
  if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.96)"});
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+18,y+22,10,10,3);ctx.fill();T(ctx,name,x+38,y+34,{f:"mono",w:500,size:18,color:rgba(col,1)});
    if(lab){const lx=two?x+38:x+w-16-lw,ly=two?y+68:y+28;ctx.fillStyle="rgba(8,14,24,0.95)";rr(ctx,lx,ly-15,lw,30,15);ctx.fill();ctx.strokeStyle=rgba(WEED,0.8);ctx.lineWidth=1.5;rr(ctx,lx,ly-15,lw,30,15);ctx.stroke();T(ctx,lab,lx+14,ly+6,{w:700,size:18,color:rgba(WEED,1)});}
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+hh-6,w-28,1.2);
    const n=o.p==null?lines.length:lines.length*o.p;lines.forEach((l,i)=>{if(i>=n)return;const yy=y+hh+12+lh*0.72+i*lh,q=clamp(n-i,0,1),cm=/^\s*(--|#|\{#)/.test(l),on=o.lit?o.lit[i]||0:0,lc=o.lineCol&&o.lineCol[i];
      const lcol=(o.litCols&&o.litCols[i])||o.litCol||TRUST;if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(lcol,0.17);rr(ctx,x+10,yy-lh*0.74,w-20,lh*0.98,6);ctx.fill();});
      const c=lc?rgba(lc,1):cm?rgba(SOFT,0.88):rgba(mix([205,225,255],lcol,on*0.55),0.97),sw=o.swap&&o.swap[i];
      if(sw&&sw[1]>0){withA(ctx,1-sw[1],()=>T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:sz,color:c}));withA(ctx,sw[1],()=>T(ctx,sw[0],x+22,yy,{f:"mono",w:500,size:sz,color:rgba(sw[2]||BAD,1)}));}
      else T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:sz,color:c});});});
  return h;}

// a person's face in a round frame, outlined in their side's colour; o.name and o.role under it (or to the side with o.side)
function pp_face(ctx,id,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const P=PEOPLE[id],k=r/100;withA(ctx,a,()=>{glow(ctx,x,y,r*1.8,P.edge,0.2+0.25*(o.hi||0));
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle="rgba(12,18,30,0.97)";ctx.fill();ctx.clip();person(ctx,id,x,y-0.1*r+505*k,k/P.build.h,{t,expr:o.expr||"calm",glow:0.2});ctx.restore();
  ring(ctx,x,y,r,P.edge,1,2.6);const nm=o.name||P.name.split(" ")[0],rl=o.role===undefined?P.role:o.role;
  if(o.side){const sx=x+(r+16)*o.side,al=o.side>0?"left":"right";T(ctx,nm,sx,y-2,{w:800,size:24,align:al});if(rl)T(ctx,rl,sx,y+26,{w:600,size:18,align:al,color:rgba(SOFT,1)});}
  else{T(ctx,nm,x,y+r+30,{w:800,size:22,align:"center"});if(rl)T(ctx,rl,x,y+r+54,{w:600,size:18,align:"center",color:rgba(SOFT,1)});}});}

// a consumer's badge: Planning's dashboard (bars) or the wallet's app (a card in a wallet)
function pp_consumer(ctx,x,y,r,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2,PP_MART,0.18+0.3*(o.hi||0));
  ctx.fillStyle="rgba(7,14,18,0.96)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,PP_MART,1,2.6);ring(ctx,x,y,r-6,PP_MART,0.35,1.2);
  ctx.save();ctx.translate(x,y);ctx.scale(r/40,r/40);ctx.strokeStyle=rgba(PP_MART,1);ctx.fillStyle=rgba(PP_MART,0.9);ctx.lineWidth=2.6;ctx.lineJoin="round";
  if(kind==="planning"){[[-14,6,8],[-2,-2,16],[10,-10,24]].forEach(([bx,by,bh])=>{rr(ctx,bx-4,by-bh/2+8,9,bh,2);ctx.fill();});ctx.beginPath();ctx.moveTo(-20,20);ctx.lineTo(22,20);ctx.stroke();}
  else{rr(ctx,-20,-13,40,28,5);ctx.stroke();ctx.beginPath();ctx.moveTo(-20,-5);ctx.lineTo(20,-5);ctx.stroke();rr(ctx,6,1,16,10,3);ctx.fill();}
  ctx.restore();});}

// a decision tag, in its colour: k is 0 fix at source, 1 rule in the model, 2 accept and document
function pp_dtag(ctx,x,y,k,a,o){o=o||{};if(a<=0.01)return 0;const[s,c]=PP_DEC[k],sz=o.size||20,w=tw(ctx,s,sz,700)+(o.dot===false?28:46),h=sz+18,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  withA(ctx,a,()=>{if(o.hi)glow(ctx,X+w/2,y,w*0.6,c,0.35*o.hi);glass(ctx,X,y-h/2,w,h,h/2,c,{glow:10,ea:0.9,fill:"rgba(8,12,22,0.95)"});if(o.dot!==false){ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(X+18,y,6,0,TAU);ctx.fill();}
    T(ctx,s,X+(o.dot===false?14:32),y+sz*0.35,{w:700,size:sz,color:rgba(mix(INK,c,0.25),1)});});return w;}

// a credential as the wallet shows it: a glass card in the source's colour. o.fade (0..1) the platform deleting it;
// o.back (0..1) the model bringing it back, stamped revoked
function pp_cred(ctx,x,y,w,h,key,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||PP_LMS,f=o.fade||0,bk=o.back||0;
  withA(ctx,a,()=>{
    withA(ctx,1-fin(f,0,0.5)*(1-bk),()=>{const cc=bk>0?mix(col,BAD,bk*0.6):col;glass(ctx,x,y,w,h,16,cc,{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});
      ctx.fillStyle=rgba(cc,0.9);ctx.beginPath();ctx.arc(x+34,y+38,14,0,TAU);ctx.fill();ctx.fillStyle="rgba(7,12,24,1)";ctx.beginPath();ctx.arc(x+34,y+38,6,0,TAU);ctx.fill();
      T(ctx,o.kind||"microcredential",x+58,y+44,{w:600,size:18,color:rgba(SOFT,1)});T(ctx,name,x+22,y+88,{w:800,size:22});T(ctx,key,x+22,y+124,{f:"mono",w:500,size:18,color:rgba(cc,1)});});
    if(f>0&&bk<=0){withA(ctx,fin(f,0.5,0.5),()=>{ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(SOFT,0.5);ctx.lineWidth=2;rr(ctx,x,y,w,h,16);ctx.stroke();ctx.restore();T(ctx,"deleted",x+w/2,y+h/2+8,{w:700,size:20,align:"center",color:rgba(SOFT,0.8)});});}
    if(bk>0)kt_rstamp(ctx,x+w/2,y+h-24,"revoked · 12 Aug 2026",BAD,1,clamp((bk-0.3)/0.7,0,1),{size:18,rot:-0.06});});}

// a box for a model that isn't built yet: a dashed outline, its name, and its layer's colour
function pp_outline(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{if(o.hi)glow(ctx,x+w/2,y+h/2,w*0.6,col,0.3*o.hi);
  ctx.fillStyle="rgba(7,12,24,"+(o.fill==null?0.6:o.fill)+")";rr(ctx,x,y,w,h,10);ctx.fill();ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=1.8;rr(ctx,x,y,w,h,10);ctx.stroke();ctx.restore();
  if(name)T(ctx,name,x+w/2,y+h/2+6,{f:"mono",w:500,size:o.size||18,align:"center",color:rgba(mix(SOFT,col,0.5),1)});});}

// a small glyph for each kind of test: unique (one key), not null (a filled box), relationships (an arrow), accepted values (a list), no overlap (bars end to end)
function pp_tglyph(ctx,k,x,y,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineCap="round";
  if(k===0){ctx.beginPath();ctx.arc(-6,0,7,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(14,0);ctx.moveTo(10,0);ctx.lineTo(10,6);ctx.stroke();}
  else if(k===1){rr(ctx,-12,-10,24,20,4);ctx.stroke();rr(ctx,-7,-5,14,10,2);ctx.fill();}
  else if(k===2){ctx.beginPath();ctx.arc(-11,0,4,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(12,0);ctx.moveTo(6,-6);ctx.lineTo(12,0);ctx.lineTo(6,6);ctx.stroke();}
  else if(k===3){for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-10,-8+i*8,2,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-5,-8+i*8);ctx.lineTo(12,-8+i*8);ctx.stroke();}}
  else{ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-14,-4);ctx.lineTo(-2,-4);ctx.stroke();ctx.beginPath();ctx.moveTo(1,4);ctx.lineTo(14,4);ctx.stroke();}
  ctx.restore();});}

// a traffic light: lit is 0 green, 1 amber, 2 red (fractional values cross-fade)
function pp_light(ctx,x,y,s,lit,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);glass(ctx,-50,-150,100,300,26,[150,170,200],{glow:8,ea:0.6,fill:"rgba(8,10,16,0.97)"});
  [GOOD,PP_AMB,BAD].forEach((c,i)=>{const on=clamp(1-Math.abs(lit-i),0,1),cy=-88+i*88;ctx.fillStyle=rgba(mix([30,32,40],c,0.18+0.82*on),1);ctx.beginPath();ctx.arc(0,cy,32,0,TAU);ctx.fill();if(on>0)glow(ctx,0,cy,70,c,0.55*on);});ctx.restore();});}

// a clock face, small, for a source's freshness: the hand goes round as u goes 0..1
function pp_clock(ctx,x,y,r,u,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(8,12,22,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,1,2.4);
  for(let i=0;i<12;i++){const an=i/12*TAU;ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.78,y+Math.sin(an)*r*0.78);ctx.lineTo(x+Math.cos(an)*r*0.9,y+Math.sin(an)*r*0.9);ctx.stroke();}
  const an=-Math.PI/2+u*TAU;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(an)*r*0.7,y+Math.sin(an)*r*0.7);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-r*0.45);ctx.stroke();});}

// a small table of cells (header row first), with each row lighting as o.lit[i] goes 0..1
function pp_table(ctx,x,y,cols,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||20,rh=o.rh||44,col=o.col||[170,205,255],w=cols.reduce((s,c)=>s+c,0),h=rh*rows.length;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,12,col,{glow:10,ea:0.6,fill:"rgba(6,10,20,0.96)"});
    rows.forEach((r,i)=>{const yy=y+i*rh,on=o.lit?o.lit[i]||0:0;if(i===0){ctx.fillStyle=rgba(col,0.12);rr(ctx,x+2,yy+2,w-4,rh-4,10);ctx.fill();}
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.18);ctx.fillRect(x+4,yy+3,w-8,rh-6);});
      if(i>0){ctx.fillStyle="rgba(170,200,245,0.12)";ctx.fillRect(x+10,yy,w-20,1);}
      let cx=x;r.forEach((c,j)=>{const al=o.align&&o.align[j]||"left",tx=al==="right"?cx+cols[j]-14:cx+14;T(ctx,String(c),tx,yy+rh/2+sz*0.36,{f:o.mono&&o.mono[j]?"mono":undefined,w:i===0?800:600,size:i===0?sz-2:sz,align:al,color:i===0?rgba(SOFT,1):(o.colCol&&o.colCol[j])?rgba(o.colCol[j],1):rgba(INK,0.95)});cx+=cols[j];});});});
  return h;}

// the column of tests, each a hollow dot: written, reviewed, not yet run
function pp_dots(ctx,x,y,n,col,p,o){o=o||{};const per=o.per||36,gap=o.gap||12,r=o.r||4.2;for(let i=0;i<n;i++){const q=clamp(p*n-i,0,1);if(q<=0)return;const dx=x+(i%per)*gap,dy=y+Math.floor(i/per)*gap;ctx.strokeStyle=rgba(col,0.9*q);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(dx,dy,r*(0.5+0.5*q),0,TAU);ctx.stroke();}}

// the loop of ten steps, small, in a corner: ten stations on a dashed ring, each with its number; on[i] (0..1) lights station i.
// s scales it (1: about 300 x 190 px). The numbers stay at 18 px.
function pp_loop(ctx,x,y,s,t,on,a){if(a<=0.01)return;const rx=128*s,ry=74*s,r=17;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(WEED,0.28);ctx.lineWidth=2;ctx.setLineDash([4,8]);ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.stroke();ctx.restore();
  for(let i=0;i<10;i++){const an=-Math.PI/2+i/10*TAU,px=x+Math.cos(an)*rx,py=y+Math.sin(an)*ry,q=on?on[i]||0:0;if(q>0.3)glow(ctx,px,py,r*2.6,WEED,0.3*q);
    ctx.fillStyle="rgba(7,12,24,0.97)";ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();ring(ctx,px,py,r,mix(SOFT,WEED,q),0.35+0.65*q,2);
    T(ctx,String(i+1),px,py+6.5,{f:"mono",w:500,size:18,align:"center",color:rgba(mix(SOFT,WEED,q),0.45+0.55*q)});}});}

// the four layers of the project, as bands: the core lit, with a latch on its contract
function pp_layers(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=4,gap=10,bh=(h-gap*(n-1))/n;withA(ctx,a,()=>{
  LAYER4.slice().reverse().forEach(([nm,c],j)=>{const i=3-j,yy=y+j*(bh+gap),on=i===2?(o.core||0):0,dim=o.dim||0;withA(ctx,1-0.55*dim*(1-on),()=>{if(on>0)glow(ctx,x+w/2,yy+bh/2,w*0.55,c,0.25*on);
    glass(ctx,x,yy,w,bh,10,c,{glow:6+12*on,ea:0.5+0.4*on,fill:"rgba(7,12,24,0.92)"});T(ctx,nm,x+20,yy+bh/2+7,{w:800,size:20,color:rgba(c,1)});});});
  if(o.latch!=null){const yy=y+(bh+gap)+bh/2;withA(ctx,o.latchA==null?1:o.latchA,()=>{kt_lock(ctx,x+w-40,yy+6,0.42,TRUST,1,1-o.latch);});}});}

/* ---------- the gap register (docs/gaps.md), in short labels: what the business expects, what the sources hold, and the decisions ---------- */
const PP_GAPS=[["a revoked credential is known as revoked","the platform deletes it",[1,0]],["every account names its student","some have no student ID",[1,0]],["one email, one learner","families share an email",[1]],
  ["an email is written one way","case and spaces vary",[1]],["every enrolment has an email","walk-ins can have none",[2]],["a change is dated when it happens","some are recorded late",[1,2]],
  ["the conferral of an award is recorded","no conferral record",[1,0]],["a status means one thing","three code sets",[1]],["a certificate is a credential","two kinds in one table",[1]],["a credential can expire","no source records an expiry",[2]]];
const PP_REG={x:140,y:150,w:1400,rh:56,cols:[60,420,380,540]};
// the register: rows type in as o.p goes 0..10; o.tags (0..1) shows the decisions; o.ink (0..1) turns the agent's teal draft to approved ink;
// o.hiRow {i:0..1} glows a row; o.ticks {i:0..1} gold ticks at the row's end
function pp_register(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const R=PP_REG,hh=118,h=hh+R.rh*10+14,p=o.p==null?10:o.p;
  withA(ctx,a,()=>{glass(ctx,R.x,R.y,R.w,h,16,[170,205,255],{glow:12,ea:0.6,fill:"rgba(6,10,20,0.96)"});
    ctx.fillStyle="rgba(170,205,255,0.9)";rr(ctx,R.x+18,R.y+22,10,10,3);ctx.fill();T(ctx,"docs/gaps.md",R.x+38,R.y+34,{f:"mono",w:500,size:18,color:"rgba(170,205,255,1)"});
    const lw=tw(ctx,PP_RUN,18,700)+28,lx=R.x+R.w-16-lw;ctx.fillStyle="rgba(8,14,24,0.95)";rr(ctx,lx,R.y+13,lw,30,15);ctx.fill();ctx.strokeStyle=rgba(WEED,0.8);ctx.lineWidth=1.5;rr(ctx,lx,R.y+13,lw,30,15);ctx.stroke();T(ctx,PP_RUN,lx+14,R.y+34,{w:700,size:18,color:rgba(WEED,1)});
    let cx=R.x;["#","expects","holds","decision"].forEach((s,j)=>{withA(ctx,j===3?(o.tags||0):1,()=>T(ctx,s,cx+16,R.y+96,{w:800,size:20,color:rgba(j===1?TRUST:j===2?EDGE_:SOFT,1)}));cx+=R.cols[j];});
    ctx.fillStyle="rgba(170,200,245,0.16)";ctx.fillRect(R.x+14,R.y+hh-8,R.w-28,1.2);
    PP_GAPS.forEach(([ex,ho,dec],i)=>{const q=clamp(p-i,0,1);if(q<=0)return;const yy=R.y+hh+i*R.rh,hi=o.hiRow?o.hiRow[i]||0:0,col=mix(KT_AI,INK,o.ink||0);
      if(hi>0)withA(ctx,hi,()=>{ctx.fillStyle=rgba(o.hiCol||PP_DEC[2][1],0.16);rr(ctx,R.x+8,yy+4,R.w-16,R.rh-8,8);ctx.fill();});
      T(ctx,String(i+1),R.x+16,yy+R.rh/2+7,{f:"mono",w:500,size:20,color:rgba(SOFT,q)});
      T(ctx,typeOn(ex,q),R.x+R.cols[0]+16,yy+R.rh/2+7,{w:600,size:20,color:rgba(col,1)});T(ctx,typeOn(ho,q),R.x+R.cols[0]+R.cols[1]+16,yy+R.rh/2+7,{w:600,size:20,color:rgba(mix(col,EDGE_,0.35),1)});
      let tx=R.x+R.cols[0]+R.cols[1]+R.cols[2]+12;dec.forEach((k,j)=>{const ta=clamp((o.tags||0)*12-i*0.9-j*0.4,0,1);if(ta>0)tx+=pp_dtag(ctx,tx,yy+R.rh/2,k,ta,{size:18})+8;});
      if(o.ticks&&o.ticks[i]>0)kt_gtick(ctx,R.x+R.w-30,yy+R.rh/2,13,o.ticks[i]);});});}

// gap 1 as docs/gaps.md has it, rendered as a table (line 8; the decision trimmed with …). o.lit {exp, real, dec}: 0..1
function pp_gap1(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const C=[60,300,450,540,300],w=C.reduce((s,c)=>s+c,0),h=262,lit=o.lit||{};
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,[170,205,255],{glow:12,ea:0.6,fill:"rgba(6,10,20,0.96)"});
    ctx.fillStyle="rgba(170,205,255,0.9)";rr(ctx,x+18,y+22,10,10,3);ctx.fill();T(ctx,"docs/gaps.md · line 8",x+38,y+34,{f:"mono",w:500,size:18,color:"rgba(170,205,255,1)"});
    const lw=tw(ctx,PP_RUN,18,700)+28,lx=x+w-16-lw;ctx.fillStyle="rgba(8,14,24,0.95)";rr(ctx,lx,y+13,lw,30,15);ctx.fill();ctx.strokeStyle=rgba(WEED,0.8);ctx.lineWidth=1.5;rr(ctx,lx,y+13,lw,30,15);ctx.stroke();T(ctx,PP_RUN,lx+14,y+34,{w:700,size:18,color:rgba(WEED,1)});
    let cx=x;["#","Expectation","Reality","Decision","Where"].forEach((s,j)=>{T(ctx,s,cx+16,y+92,{w:800,size:20,color:rgba(SOFT,1)});cx+=C[j];});
    ctx.fillStyle="rgba(170,200,245,0.16)";ctx.fillRect(x+14,y+108,w-28,1.2);
    const cell=(j,k,col)=>{let xx=x;for(let i=0;i<j;i++)xx+=C[i];const on=lit[k]||0;if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(col,0.15);rr(ctx,xx+6,y+116,C[j]-12,136,8);ctx.fill();});return xx+16;};
    const L=(s,xx,yy,col,f)=>T(ctx,s,xx,yy,{f,w:600,size:20,color:col||rgba(INK,0.95)});
    L("1",x+16,y+146,rgba(SOFT,1),"mono");
    let xx=cell(1,"exp",TRUST);L("A revoked credential is",xx,y+146);L("known as revoked.",xx,y+174);
    xx=cell(2,"real",EDGE_);L("The learning platform has no",xx,y+146);L("revocation flag: it deletes a",xx,y+174);L("revoked badge.",xx,y+202);
    xx=cell(3,"dec",PP_INT);const r1="Rule in the model:",f1="Fix at source";T(ctx,r1,xx,y+146,{w:800,size:20,color:rgba(PP_DEC[1][1],1)});L(" a badge that disappears",xx+tw(ctx,r1,20,800),y+146);
    L("is revoked from the day the platform",xx,y+174);L("stopped showing it.",xx,y+202);T(ctx,f1,xx+tw(ctx,"stopped showing it. ",20,600),y+202,{w:800,size:20,color:rgba(PP_DEC[0][1],1)});L(", requested: …",xx+tw(ctx,"stopped showing it. ",20,600)+tw(ctx,f1,20,800),y+202);
    xx=cell(4,"where",PP_INT);L("int_credentials_",xx,y+146,rgba(PP_INT,1),"mono");L("unioned",xx,y+174,rgba(PP_INT,1),"mono");});
  return{w,h,dec:[x+C[0]+C[1]+C[2],y+h]};}

// a scale in the present: crisp lines; the left pan holds a trusted number, the right an empty slot. tilt in radians
function pp_scale(ctx,x,y,s,tilt,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);const c=o.col||TRUST;ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=3;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(-70,0);ctx.lineTo(70,0);ctx.moveTo(0,0);ctx.lineTo(0,-200);ctx.stroke();ctx.save();ctx.translate(0,-200);ctx.rotate(tilt);ctx.beginPath();ctx.moveTo(-170,0);ctx.lineTo(170,0);ctx.stroke();ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(0,0,7,0,TAU);ctx.fill();ctx.restore();
  [-1,1].forEach(sd=>{const ex=sd*170*Math.cos(tilt),ey=-200+sd*170*Math.sin(tilt),py=ey+92;ctx.strokeStyle=rgba(c,0.6);ctx.lineWidth=1.6;[-50,50].forEach(dx=>{ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+dx,py);ctx.stroke();});
    ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ex-64,py);ctx.quadraticCurveTo(ex,py+28,ex+64,py);ctx.stroke();
    const lab=sd<0?o.leftLab:o.rightLab,full=sd<0;if(lab){if(full){glass(ctx,ex-58,py-56,116,50,10,c,{glow:10,ea:0.9,fill:"rgba(8,12,22,0.96)"});T(ctx,o.left,ex,py-21,{w:800,size:30,align:"center",color:rgba(c,1)});}
      else{ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=1.8;rr(ctx,ex-58,py-56,116,50,10);ctx.stroke();ctx.restore();T(ctx,"?",ex,py-21,{w:800,size:30,align:"center",color:rgba(SOFT,0.9)});}
      T(ctx,lab,ex,py+56,{w:700,size:20,align:"center",color:rgba(full?INK:SOFT,1)});}});
  ctx.restore();});}

// the core, as a band the marts stand on: its four models as chips. Returns each chip's centre. o.pulse {name:0..1}
const PP_CORE=["core_learner","core_award","core_credential","core_credit_towards_award"];
function pp_core(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,P={};const n=PP_CORE.length,L=250,cw=(w-L)/n,ca=o.chips==null?1:o.chips;PP_CORE.forEach((m,i)=>P[m]=[x+L+cw*(i+0.5),y+h/2]);if(a<=0.01)return P;
  withA(ctx,a,()=>{glow(ctx,x+w/2,y+h/2,w*0.5,TRUST,0.12);glass(ctx,x,y,w,h,14,TRUST,{glow:16,ea:0.85,fill:"rgba(16,13,6,0.94)"});T(ctx,"core",x+20,y+h/2-4,{w:800,size:22,color:rgba(TRUST,1)});T(ctx,"public · enforced",x+20,y+h/2+20,{w:700,size:18,color:rgba(SOFT,1)});
    if(ca>0.01)withA(ctx,ca,()=>PP_CORE.forEach(m=>{const[cx,cy]=P[m],pu=o.pulse?o.pulse[m]||0:0,ww=tw(ctx,m,18,500,"mono")+28;if(pu>0)glow(ctx,cx,cy,ww*0.7,TRUST,0.5*pu);ctx.fillStyle=rgba(mix([30,26,12],TRUST,0.12+0.3*pu),1);rr(ctx,cx-ww/2,cy-15,ww,30,8);ctx.fill();
      ctx.strokeStyle=rgba(TRUST,0.5+0.5*pu);ctx.lineWidth=1.4;rr(ctx,cx-ww/2,cy-15,ww,30,8);ctx.stroke();T(ctx,m,cx,cy+6,{f:"mono",w:500,size:18,align:"center",color:rgba(mix(INK,TRUST,0.4),1)});}));});return P;}

// a consumer's mart: its badge, its name, and the grain it declared typing in as o.g goes 0..1
function pp_mart(ctx,x,y,w,h,kind,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const pl=kind==="planning",nm=pl?"Planning":"the wallet app",mdl=pl?"mart_planning__near_award":"mart_wallet__learners",gr=pl?"One row per learner per award, as at census date":"One row per learner, as it is now";
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,PP_MART,{glow:12+12*(o.hi||0),ea:0.8,fill:"rgba(6,14,12,0.95)"});pp_consumer(ctx,x+62,y+64,38,kind,{hi:o.hi||0});
    T(ctx,nm,x+118,y+56,{w:800,size:26});T(ctx,mdl,x+118,y+88,{f:"mono",w:500,size:18,color:rgba(PP_MART,1)});
    if(o.g>0){T(ctx,"grain",x+24,y+146,{w:700,size:18,color:rgba(SOFT,1)});T(ctx,typeOn(gr,o.g),x+86,y+146,{w:700,size:21,color:rgba(TRUST,1)});}
    if(o.chips>0)withA(ctx,o.chips,()=>{tag(ctx,x+24,y+h-30,"contract: enforced",TRUST,{size:18});});});}

// a short flow of boxes joined by arrows, centred on cx: items [[text, colour, dashed]], q[i] (0..1) brings box i in
function pp_flow(ctx,cx,y,items,q,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||22,h=sz+40,gap=o.gap||84,ws=items.map(([s])=>tw(ctx,s,sz,700)+48),tot=ws.reduce((s_,w_)=>s_+w_,0)+gap*(items.length-1);
  withA(ctx,a,()=>{let x=cx-tot/2;items.forEach(([s,col,dash],i)=>{const qi=q[i]||0,w_=ws[i];if(qi>0.01)withA(ctx,qi,()=>{const yy=y-(1-spring(qi*1.6))*14;
      if(dash){ctx.fillStyle="rgba(7,12,24,0.9)";rr(ctx,x,yy-h/2,w_,h,14);ctx.fill();ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=1.8;rr(ctx,x,yy-h/2,w_,h,14);ctx.stroke();ctx.restore();}
      else glass(ctx,x,yy-h/2,w_,h,14,col,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});
      T(ctx,s,x+w_/2,yy+sz*0.36,{w:700,size:sz,align:"center",color:rgba(dash?mix(SOFT,col,0.4):mix(INK,col,0.3),1)});
      if(i>0)arrowTo(ctx,x-gap+12,y,x-12,y,col,0.85,{p:clamp(qi*1.5,0,1),head:12});});x+=w_+gap;});});}

/* ---------- the labs' and scenarios' pictures ----------
   Added to the film bundle's LV registry (Keeping it true's true.js defines it; these keys are prefixed pp_ so they never clash).
   Each draws with the film's own components, and takes its words from vis in site/assets/promises-and-proofs/learn.*.js.
   Labs draw on 960 x 440, scenarios on 600 x 320. */
function pp_lfit(c,w,h,bw,bh){const k=Math.min(w/bw,h/bh);c.translate((w-bw*k)/2,(h-bh*k)/2);c.scale(k,k);}
// text that shrinks (down to min) until it fits maxW
function pp_fitT(c,s,x,y,maxW,o){o=o||{};let sz=o.size||20;const mn=o.min||15;while(sz>mn&&tw(c,s,sz,o.w||600,o.f)>maxW)sz-=1;T(c,s,x,y,Object.assign({},o,{size:sz}));return sz;}
// the "runs on" chip, right-aligned at (xr, y)
function pp_runChip(c,xr,y,s,sz){sz=sz||18;const lw=tw(c,s,sz,700)+28,lx=xr-lw;c.fillStyle="rgba(8,14,24,0.95)";rr(c,lx,y-15,lw,30,15);c.fill();c.strokeStyle=rgba(WEED,0.8);c.lineWidth=1.5;rr(c,lx,y-15,lw,30,15);c.stroke();T(c,s,lx+14,y+6,{w:700,size:sz,color:rgba(WEED,1)});return lw;}
// a card's head: the file's dot and name, and the "runs on" chip
function pp_cardHead(c,x,y,w,name,run,col){c.fillStyle=rgba(col,0.9);rr(c,x+18,y+22,10,10,3);c.fill();T(c,name,x+38,y+34,{f:"mono",w:500,size:18,color:rgba(col,1)});if(run)pp_runChip(c,x+w-14,y+28,run);}
// a chip whose width is returned; align "left" | "center" | "right"
function pp_chip(c,x,y,s,col,o){o=o||{};const sz=o.size||18,w=tw(c,s,sz,700,o.f)+26,h=sz+14,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  glass(c,X,y-h/2,w,h,h/2,col,{fill:"rgba(7,12,24,0.92)",glow:8,ea:0.85});T(c,s,X+13,y+sz*0.36,{f:o.f,w:700,size:sz,color:rgba(col,1)});return w;}
// a credential as the wallet shows it, in the labs: a glass card with a kind, a name and a key
function pp_lcred(c,x,y,w,h,kind,name,key,col){glass(c,x,y,w,h,16,col,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});c.fillStyle=rgba(col,0.9);c.beginPath();c.arc(x+30,y+34,12,0,TAU);c.fill();c.fillStyle="rgba(7,12,24,1)";c.beginPath();c.arc(x+30,y+34,5,0,TAU);c.fill();
  pp_fitT(c,kind,x+52,y+40,w-64,{w:600,size:18,color:rgba(SOFT,1)});pp_fitT(c,name,x+20,y+80,w-36,{w:800,size:21});T(c,key,x+20,y+114,{f:"mono",w:500,size:18,color:rgba(col,1)});}
// core_credential's contract, column by column: what each choice in the "write the contract" lab declares. null: left out
const PP_LC=[{n:"credential_key",q:"VARCHAR",o:[["string",1,"unique"],["string",0,"unique"],["int",1,"unique"]]},{n:"learner_key",q:"VARCHAR",o:[["string",1,"relationships"],["string",0,"relationships"],["string",1,""]]},
  {n:"credit_points",q:"INTEGER",o:[["int",0,""],["string",0,""],["bigint",0,""]]},{n:"issued_on",q:"DATE",o:[["date",1,""],null,["timestamp",1,""]]}];
const PP_DT={string:"VARCHAR",int:"INTEGER",bigint:"BIGINT",date:"DATE",timestamp:"TIMESTAMP"};
// the last level's line, moved: the levels lab's tenth step
const PP_LT="not_null_stg_short_courses__enrolments_customer_bk";
Object.assign(LV,{
  // write the contract: the YAML card filling in from the choices, and what the build says
  pp_l_contract:(c,w,h,st,L)=>{const V=L.vis,pk=st.pick||[];c.save();pp_lfit(c,w,h,960,440);const X=20,Y=14,CW=920,RH=40;
    glass(c,X,Y,CW,264,14,TRUST,{glow:10,ea:0.7,fill:"rgba(6,10,20,0.96)"});pp_cardHead(c,X,Y,CW,"models/core/_core__models.yml",V.run,TRUST);
    const CX=[X+24,X+330,X+530,X+690];V.cols.forEach((s,j)=>T(c,s,CX[j],Y+84,{w:800,size:18,color:rgba(SOFT,1)}));c.fillStyle="rgba(170,200,245,0.16)";c.fillRect(X+14,Y+96,CW-28,1.2);
    const mm=[],gets=[];
    PP_LC.forEach((col,i)=>{const y=Y+126+i*RH,p=pk[i],on=p!=null,v=on?col.o[p]:undefined;
      if(on&&v===null){T(c,col.n,CX[0],y,{f:"mono",w:500,size:19,color:rgba(SOFT,0.6)});c.fillStyle=rgba(BAD,0.8);c.fillRect(CX[0]-4,y-7,tw(c,col.n,19,500,"mono")+8,2);T(c,V.leftOut,CX[1],y,{w:700,size:18,color:rgba(BAD,1)});mm.push([col.n,col.q,"",V.missing]);return;}
      T(c,col.n,CX[0],y,{f:"mono",w:500,size:19,color:rgba(on?INK:SOFT,on?0.97:0.7)});
      if(!on){T(c,"…",CX[1],y,{w:700,size:20,color:rgba(SOFT,0.8)});return;}
      const bad=PP_DT[v[0]]!==col.q;T(c,v[0],CX[1],y,{f:"mono",w:500,size:19,color:rgba(bad?BAD:TRUST,1)});
      if(v[1])tick_(c,CX[2]+14,y-6,22,GOOD,1);else T(c,"—",CX[2]+4,y,{w:700,size:19,color:rgba(SOFT,0.8)});
      T(c,v[2]||"—",CX[3],y,{f:v[2]?"mono":undefined,w:500,size:19,color:rgba(v[2]?GOOD:SOFT,v[2]?1:0.8)});
      if(bad)mm.push([col.n,col.q,PP_DT[v[0]],V.mismatch]);
      if(i===0&&p===1)gets.push(V.getsIn[0]);if(i===1&&p===1)gets.push(V.getsIn[1]);if(i===1&&p===2)gets.push(V.getsIn[2]);});
    const RY=290,done=PP_LC.every((_,i)=>pk[i]!=null);
    if(mm.length){glass(c,X,RY,CW,40,12,BAD,{glow:12,ea:0.9,fill:"rgba(30,8,8,0.95)"});cross_(c,X+26,RY+20,22,BAD,1);T(c,V.stopped,X+50,RY+27,{w:800,size:20,color:rgba(BAD,1)});
      const MW=[230,190,170,320];let mx=X+10;V.mm.forEach((s,j)=>{T(c,s,mx+10,RY+62,{f:"mono",w:500,size:17,color:rgba(SOFT,1)});mx+=MW[j];});
      mm.slice(0,3).forEach((r,k)=>{let x=X+10;r.forEach((s,j)=>{T(c,s,x+10,RY+86+k*23,{f:"mono",w:500,size:17,color:rgba(j===3?BAD:INK,0.95)});x+=MW[j];});});}
    else if(!done)T(c,V.choose,480,RY+64,{w:700,size:21,align:"center",color:rgba(SOFT,1)});
    else if(gets.length){glass(c,X,RY,CW,40,12,PP_AMB,{glow:12,ea:0.9,fill:"rgba(28,20,6,0.95)"});T(c,V.passes,X+24,RY+27,{w:800,size:20,color:rgba(PP_AMB,1)});
      gets.forEach((s,k)=>T(c,"· "+s,X+40,RY+74+k*30,{w:700,size:20,color:rgba(INK,0.95)}));}
    else{glass(c,X,RY,CW,40,12,GOOD,{glow:12,ea:0.9,fill:"rgba(6,24,14,0.95)"});tick_(c,X+26,RY+18,22,GOOD,1);T(c,V.ok,X+50,RY+27,{w:800,size:20,color:rgba(GOOD,1)});
      pp_seal(c,880,RY+90,30,0,{label:false});}
    c.restore();},
  // which test catches it: six broken rows; the chosen test stops one, the rest get through to the wallet and Planning
  pp_l_catch:(c,w,h,st,L)=>{const V=L.vis,Lb=L.labs.find(l=>l.vis==="pp_l_catch"),r=Lb.w.res[st.pick]||[],nm=(Lb.w.opts.find(o=>o[0]===st.pick)||["",""])[1],gi={unique:0,notnull:1,rel:2,acc:3,over:4}[st.pick];
    c.save();pp_lfit(c,w,h,960,440);T(c,V.pickTest,24,34,{w:700,size:19,color:rgba(SOFT,1)});const tw0=tw(c,V.pickTest,19,700);
    const cw=pp_chip(c,24+tw0+14,28,nm,GOOD,{size:19,f:gi==null?undefined:"mono"});if(gi!=null)pp_tglyph(c,gi,24+tw0+14+cw+26,28,GOOD,1);
    const DEST=[0,0,1,1,1,0],B=[[880,150],[880,330]];
    B.forEach(([bx,by],k)=>{pp_consumer(c,bx,by,34,k?"planning":"wallet",{});T(c,k?V.planning:V.wallet,bx,by+62,{w:700,size:18,align:"center",color:rgba(PP_MART,1)});});
    V.broken.forEach((s,i)=>{const y=64+i*60,v=r[i]||0,col=v===1?BAD:v===0.5?PP_AMB:[150,170,200];
      if(v>0)glow(c,290,y+24,300,col,0.12);glass(c,20,y,560,48,12,col,{glow:v>0?14:6,ea:v>0?0.9:0.5,fill:"rgba(7,12,24,0.95)"});
      pp_fitT(c,s,36,y+31,530,{w:600,size:19,min:15,color:rgba(INK,v>0?1:0.85)});
      if(v===1){cross_(c,606,y+24,22,BAD,1);T(c,V.stop,624,y+31,{w:800,size:18,color:rgba(BAD,1)});}
      else if(v===0.5){T(c,"!",606,y+32,{w:800,size:22,align:"center",color:rgba(PP_AMB,1)});T(c,V.warns,624,y+31,{w:800,size:18,color:rgba(PP_AMB,1)});}
      else{const[bx,by]=B[DEST[i]];arrowTo(c,588,y+24,bx-44,by,SOFT,0.45,{head:10});}});
    T(c,V.through,700,420,{w:700,size:18,align:"center",color:rgba(SOFT,1)});c.restore();},
  // decide the gap: the register, each line taking the decision chosen; Jordan's badge on the right
  pp_l_decide:(c,w,h,st,L)=>{const V=L.vis,Lb=L.labs.find(l=>l.vis==="pp_l_decide"),pk=st.pick||{},K={both:[1,0],rule:[1],ruleacc:[1,2],accept:[2]};c.save();pp_lfit(c,w,h,960,440);
    glass(c,14,10,692,420,14,[170,205,255],{glow:10,ea:0.6,fill:"rgba(6,10,20,0.96)"});pp_cardHead(c,14,8,692,"docs/gaps.md",V.run,[170,205,255]);
    V.gaps.forEach((s,i)=>{const y=82+i*34.6,b=pk[i],ok=st.checked&&b===Lb.w.items[i].b,no=st.checked&&b!==Lb.w.items[i].b;
      if(i===0)withA(c,0.8,()=>{c.fillStyle=rgba(PP_LMS,0.1);rr(c,22,y-24,676,34,8);c.fill();});
      T(c,String(i+1),36,y,{f:"mono",w:500,size:18,align:"center",color:rgba(SOFT,1)});let x=st.checked?650:688;const tags=[];
      if(b){K[b].slice().reverse().forEach(k=>{const ww=tw(c,V.dec[k],17,700)+26;x-=ww;tags.push([x,k]);x-=6;});}
      let gs=s;const mw=(b?x-8:688)-60;if(tw(c,gs,15,600)>mw){while(gs.length>4&&tw(c,gs+"…",15,600)>mw)gs=gs.slice(0,-1);gs=gs.trimEnd()+"…";}
      pp_fitT(c,gs,60,y,mw,{w:600,size:18,min:15,color:rgba(INK,0.95)});
      tags.forEach(([tx,k])=>pp_chip(c,tx,y-6,V.dec[k],PP_DEC[k][1],{size:17}));
      if(ok)tick_(c,680,y-6,20,GOOD,1);if(no)cross_(c,680,y-6,20,BAD,1);});
    const b0=pk[0];pp_fitT(c,V.jordan,836,96,236,{w:700,size:18,align:"center",color:rgba(SOFT,1)});pp_lcred(c,718,112,236,140,V.micro,V.jordanName,"LMS|B-5028",PP_LMS);
    if(!b0)T(c,V.undecided,836,300,{w:700,size:18,align:"center",color:rgba(SOFT,1)});
    else if(b0==="accept"){pp_chip(c,836,296,V.showsValid,EDGE_,{size:18,align:"center"});cross_(c,836,346,26,BAD,1);}
    else pp_chip(c,836,296,V.revoked,BAD,{size:18,align:"center"});
    c.restore();},
  // warn or stop: the light, the count, the level line, and the models built after the test
  pp_l_levels:(c,w,h,st,L)=>{const V=L.vis,s=st.step||0,moved=s===9,n=moved?6:s,lit=n===0?0:n<=5?1:2,col=[GOOD,PP_AMB,BAD][lit];c.save();pp_lfit(c,w,h,960,440);
    pp_light(c,70,170,0.5,lit,1);T(c,String(n),150,118,{w:800,size:64,color:rgba(col,1)});T(c,V.noEmail,150,152,{w:700,size:20,color:rgba(SOFT,1)});
    const st_=lit===0?V.pass:(lit===1?V.warn:V.fail)+" "+n;pp_chip(c,150,206,st_,col,{size:22,f:"mono"});T(c,PP_LT,150,250,{f:"mono",w:500,size:17,color:rgba(SOFT,1)});
    for(let i=0;i<=8;i++){const x=520+i*44,zc=i===0?GOOD:i<=5?PP_AMB:BAD,on=i===n;c.fillStyle=rgba(zc,on?0.85:0.2);rr(c,x+2,40,40,36,6);c.fill();T(c,String(i),x+22,65,{f:"mono",w:500,size:18,align:"center",color:on?"rgba(8,10,16,1)":rgba(zc,1)});}
    T(c,"warn_if: \">0\"",566,104,{f:"mono",w:500,size:17,color:rgba(PP_AMB,1)});
    if(moved){const ew=tw(c,"error_if: \">8\"",17,500,"mono");T(c,"error_if: \">8\"",786,104,{f:"mono",w:500,size:17,color:rgba(SOFT,1)});c.fillStyle=rgba(BAD,0.85);c.fillRect(782,98,ew+8,2);T(c,"?",786+ew+14,104,{w:800,size:20,color:rgba(BIZ,1)});
      pp_face(c,"tom",740,196,40,0,{role:false});pp_chip(c,740,302,V.ask,BIZ,{size:18,align:"center"});}
    else T(c,"error_if: \">5\"",786,104,{f:"mono",w:500,size:17,color:rgba(BAD,1)});
    T(c,V.after,30,330,{w:700,size:18,color:rgba(SOFT,1)});
    const M=[["int_credentials_unioned",PP_INT],["core_credential",TRUST],["mart_wallet__credentials",PP_MART]],sk=lit===2;let x=30;
    M.forEach(([m,mc],i)=>{const bw=tw(c,m,17,500,"mono")+30;if(sk){c.fillStyle="rgba(7,12,24,0.8)";rr(c,x,352,bw,44,10);c.fill();c.save();c.setLineDash([7,6]);c.strokeStyle=rgba(SOFT,0.6);c.lineWidth=1.8;rr(c,x,352,bw,44,10);c.stroke();c.restore();}
      else glass(c,x,352,bw,44,10,mc,{glow:10,ea:0.85,fill:"rgba(7,12,24,0.95)"});
      T(c,m,x+15,380,{f:"mono",w:500,size:17,color:rgba(sk?SOFT:mix(INK,mc,0.3),sk?0.7:1)});if(sk)T(c,V.skipped,x+bw/2,422,{w:700,size:18,align:"center",color:rgba(BAD,1)});
      if(i<M.length-1)arrowTo(c,x+bw+6,374,x+bw+40,374,sk?SOFT:mc,sk?0.4:0.8,{head:9});x+=bw+46;});
    c.restore();},
  // the scenarios
  pp_q_badge:(c,w,h,st,L)=>{const V=L.vis,Q=V.q;c.save();pp_lfit(c,w,h,600,320);glass(c,16,30,300,250,14,[170,205,255],{glow:10,ea:0.6,fill:"rgba(6,10,20,0.96)"});
    pp_cardHead(c,16,30,300,Q.register,"",[170,205,255]);pp_runChip(c,302,104,V.run,16);wrapT(c,Q.expects,36,160,264,{w:700,size:20,color:rgba(TRUST,1)});wrapT(c,Q.holds,36,226,264,{w:700,size:20,color:rgba(EDGE_,1)});
    pp_fitT(c,V.jordan,462,30,244,{w:700,size:18,align:"center",color:rgba(SOFT,1)});pp_lcred(c,340,44,244,140,V.micro,V.jordanName,"LMS|B-5028",PP_LMS);T(c,Q.shows,462,222,{w:700,size:20,align:"center",color:rgba(SOFT,1)});pp_chip(c,462,262,Q.valid+" ?",GOOD,{size:20,align:"center"});c.restore();},
  pp_q_drop:(c,w,h,st,L)=>{const V=L.vis,Q=V.q;c.save();pp_lfit(c,w,h,600,320);glass(c,16,20,330,280,14,TRUST,{glow:10,ea:0.7,fill:"rgba(6,10,20,0.96)"});
    pp_cardHead(c,16,20,330,"core_credential","",TRUST);pp_runChip(c,332,92,V.run,16);T(c,Q.public,36,138,{w:700,size:18,color:rgba(TRUST,1)});
    ["credential_key","credential_code","credential_name","credit_points"].forEach((s,i)=>{const y=172+i*28,x_=i===1;T(c,"- name: "+s,36,y,{f:"mono",w:500,size:17,color:rgba(x_?BAD:INK,0.95)});if(x_){c.fillStyle=rgba(BAD,0.9);c.fillRect(34,y-6,tw(c,"- name: "+s,17,500,"mono")+4,2);}});
    T(c,Q.dropped,180,284,{w:700,size:17,align:"center",color:rgba(BAD,1)});
    [[474,50,"wallet",V.wallet],[474,146,"planning",V.planning]].forEach(([x,y,k,s])=>{arrowTo(c,348,190,x-36,y,PP_MART,0.6,{head:9});pp_consumer(c,x,y,28,k,{});pp_fitT(c,s,x,y+50,236,{w:700,size:17,min:14,align:"center",color:rgba(PP_MART,1)});});
    c.save();c.setLineDash([6,6]);c.strokeStyle=rgba(SOFT,0.8);c.lineWidth=2;c.beginPath();c.arc(474,242,28,0,TAU);c.stroke();c.restore();T(c,"?",474,251,{w:800,size:24,align:"center",color:rgba(SOFT,1)});arrowTo(c,348,200,438,242,SOFT,0.5,{head:9});pp_fitT(c,Q.another,474,292,236,{w:700,size:17,min:14,align:"center",color:rgba(SOFT,1)});c.restore();},
  pp_q_night:(c,w,h,st,L)=>{const V=L.vis,Q=V.q;c.save();pp_lfit(c,w,h,600,320);pp_clock(c,120,140,74,2/12,[170,205,255],1);T(c,Q.night,120,262,{w:800,size:22,align:"center"});
    pp_light(c,290,150,0.42,2,1);T(c,"1",360,130,{w:800,size:56,color:rgba(BAD,1)});wrapT(c,Q.one,360,170,220,{w:700,size:19,color:rgba(SOFT,1)});pp_chip(c,360,262,Q.level,PP_AMB,{size:20});c.restore();},
  pp_q_pk:(c,w,h,st,L)=>{const V=L.vis,Q=V.q;c.save();pp_lfit(c,w,h,600,320);glass(c,16,24,350,132,14,[150,176,214],{glow:10,ea:0.7,fill:"rgba(6,10,20,0.96)"});T(c,"Databricks",36,60,{w:800,size:20,color:rgba(SOFT,1)});
    T(c,Q.pk,36,98,{f:"mono",w:500,size:17,color:rgba(INK,0.95)});T(c,Q.recorded,36,134,{w:700,size:18,color:rgba(PP_AMB,1)});
    [0,1].forEach(i=>{const y=196+i*54;glass(c,16,y,230,42,10,PP_LMS,{glow:8,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,"LMS|B-5028",34,y+28,{f:"mono",w:500,size:18,color:rgba(PP_LMS,1)});});
    T(c,Q.dup,130,316,{w:700,size:17,align:"center",color:rgba(EDGE_,1)});arrowTo(c,256,242,410,242,SOFT,0.6,{head:10});
    glass(c,420,196,164,92,14,GOOD,{glow:12,ea:0.9,fill:"rgba(6,20,12,0.95)"});pp_tglyph(c,0,502,224,GOOD,1);T(c,Q.unique,502,266,{w:700,size:18,align:"center",color:rgba(GOOD,1)});cross_(c,410,150,30,BAD,1);c.restore();},
  pp_q_first:(c,w,h,st,L)=>{const V=L.vis,Q=V.q;c.save();pp_lfit(c,w,h,600,320);
    ["unique","not_null","relationships","accepted_values","versions_do_not_overlap"].forEach((s,i)=>{const y=60+i*40;c.strokeStyle=rgba(WEED,0.9);c.lineWidth=1.8;c.beginPath();c.arc(30,y-6,7,0,TAU);c.stroke();T(c,s,48,y,{f:"mono",w:500,size:17,color:rgba(INK,0.95)});});
    T(c,Q.written,20,292,{w:700,size:18,color:rgba(WEED,1)});arrowTo(c,300,150,380,150,SOFT,0.7,{head:10});pp_fitT(c,Q.then,488,80,200,{w:700,size:17,align:"center",color:rgba(SOFT,1)});
    pp_outline(c,392,96,192,110,"core_credential",TRUST,{size:17});wrapT(c,Q.notYet,488,246,196,{w:700,size:18,align:"center",color:rgba(SOFT,1)});c.restore();},
  pp_q_expiry:(c,w,h,st,L)=>{const V=L.vis,Q=V.q;c.save();pp_lfit(c,w,h,600,320);pp_fitT(c,V.jordan,24,32,270,{w:700,size:18,color:rgba(SOFT,1)});pp_lcred(c,24,48,270,140,V.micro,V.jordanName,"LMS|B-5028",PP_LMS);
    T(c,Q.expiry+":",24,226,{w:700,size:20,color:rgba(SOFT,1)});T(c,"?",24+tw(c,Q.expiry+":",20,700)+12,228,{w:800,size:26,color:rgba(EDGE_,1)});
    T(c,"docs/gaps.md · 10",340,70,{f:"mono",w:500,size:17,color:"rgba(170,205,255,1)"});wrapT(c,Q.none,340,110,240,{w:700,size:20});pp_chip(c,340,210,V.dec[2],PP_DEC[2][1],{size:19});c.restore();},
  pp_q_fresh:(c,w,h,st,L)=>{const V=L.vis,Q=V.q;c.save();pp_lfit(c,w,h,600,320);pp_clock(c,60,64,34,0.66,PP_SIS,1);T(c,"student_system",110,72,{f:"mono",w:500,size:18,color:rgba(PP_SIS,1)});
    const X0=60,X1=540,dx=(X1-X0)/3,Y=170;[[0,1,GOOD],[1,3,PP_AMB]].forEach(([a,b,zc])=>{c.fillStyle=rgba(zc,0.3);rr(c,X0+a*dx,Y-10,(b-a)*dx,20,6);c.fill();});c.fillStyle=rgba(BAD,0.4);rr(c,X1,Y-10,40,20,6);c.fill();
    Q.days.forEach((s,i)=>{const x=X0+i*dx;c.fillStyle=rgba(SOFT,0.9);c.fillRect(x-1,Y-18,2,36);T(c,s,x,Y+46,{w:700,size:18,align:"center",color:rgba(SOFT,1)});});
    T(c,Q.fwarn,X0+dx,Y-34,{w:700,size:18,align:"center",color:rgba(PP_AMB,1)});T(c,Q.ferr,Math.min(X1,592-tw(c,Q.ferr,18,700)/2),Y-34,{w:700,size:18,align:"center",color:rgba(BAD,1)});
    const xn=X0+2*dx;c.fillStyle=rgba(INK,1);c.beginPath();c.moveTo(xn,Y+70);c.lineTo(xn-10,Y+86);c.lineTo(xn+10,Y+86);c.closePath();c.fill();T(c,Q.now,xn,Y+110,{w:800,size:20,align:"center"});c.restore();},
  pp_q_census:(c,w,h,st,L)=>{const V=L.vis,Q=V.q;c.save();pp_lfit(c,w,h,600,320);T(c,Q.faculty,300,40,{w:800,size:22,align:"center"});
    [[150,"5",Q.report,TRUST],[450,"4",Q.mart,PP_MART]].forEach(([x,n,s,col])=>{glass(c,x-70,64,140,100,16,col,{glow:12,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,n,x,134,{w:800,size:56,align:"center",color:rgba(col,1)});T(c,s,x,196,{w:700,size:19,align:"center",color:rgba(SOFT,1)});});
    T(c,"≠",300,132,{w:800,size:48,align:"center",color:rgba(BAD,1)});
    const uw=tw(c,Q.unitPass,19,700),u0=Math.max(12,300-(4*36+14+uw)/2);for(let i=0;i<4;i++)tick_(c,u0+12+i*36,256,24,GOOD,1);T(c,Q.unitPass,u0+4*36+14,264,{w:700,size:19,color:rgba(GOOD,1)});c.restore();}
});
