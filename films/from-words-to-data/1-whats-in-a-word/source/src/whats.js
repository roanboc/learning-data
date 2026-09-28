/* ===== What's in a word: the film's own pictures =====
   Animals, a baby's pointing hand, a brain's concept cell, a rabbit and a cloud of birds, drawn as luminous icons in the films'
   design language: a dark fill, a soft light from the upper left, and a glowing outline in the colour that carries the meaning.
   The labs and the scenarios draw with these too. */
const WA_INK=[255,190,110],LEO=[255,176,64],EAG=[120,190,255],SNK=[120,230,140],NAMEC=[190,150,255];

// an icon: a path in its own units (about 100 tall), drawn at (x,y) and size s, filled dark and outlined in light
function icon(ctx,x,y,s,path,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.flip?-1:1),s);if(o.rot)ctx.rotate(o.rot);
  ctx.beginPath();path(ctx);const g=ctx.createLinearGradient(-50,-60,50,60);g.addColorStop(0,rgba(mix(col,[20,26,40],0.55),0.95));g.addColorStop(1,"rgba(8,12,22,0.95)");ctx.fillStyle=o.fill||g;ctx.fill(o.rule||"nonzero");
  ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=(o.glow||12);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=(o.lw||2.4)/s;ctx.lineJoin="round";ctx.lineCap="round";ctx.stroke();ctx.shadowBlur=0;
  if(o.detail){ctx.beginPath();o.detail(ctx);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=(o.dlw||1.8)/s;ctx.stroke();}
  if(o.eye){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(o.eye[0],o.eye[1],o.eye[2]||2.6,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------- animals ---------- */
const P_PIGEON=c=>{c.ellipse(0,6,34,22,-0.15,0,TAU);c.moveTo(38,-22);c.arc(28,-22,12,0,TAU);c.moveTo(-30,4);c.lineTo(-58,-2);c.lineTo(-54,16);c.lineTo(-28,14);};
const D_PIGEON=c=>{c.moveTo(38,-24);c.lineTo(48,-20);c.lineTo(38,-17);c.moveTo(-6,-4);c.quadraticCurveTo(10,10,-14,18);c.moveTo(0,26);c.lineTo(-2,42);c.moveTo(10,26);c.lineTo(12,42);};
const pigeon=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_PIGEON,col||[200,215,240],Object.assign({detail:D_PIGEON,eye:[31,-24,2.4]},o));
const P_BEE=c=>{c.ellipse(0,0,26,15,0,0,TAU);c.moveTo(38,0);c.arc(30,0,9,0,TAU);};
const D_BEE=c=>{[-10,0,10].forEach(x=>{c.moveTo(x,-14);c.lineTo(x,14);});c.moveTo(34,-7);c.quadraticCurveTo(40,-20,46,-22);c.moveTo(36,-6);c.quadraticCurveTo(46,-14,52,-12);};
function bee(ctx,x,y,s,t,o){o=o||{};const col=o.col||[255,214,90];withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.translate(x,y);const fl=Math.sin(t*60)*0.35;ctx.fillStyle="rgba(200,230,255,0.28)";ctx.strokeStyle="rgba(200,230,255,0.7)";ctx.lineWidth=1.4;
  [[-6,-18],[6,-20]].forEach(([wx,wy],i)=>{ctx.save();ctx.translate(wx*s,wy*s);ctx.rotate(-0.5+fl*(i?1:-1)*0.5);ctx.beginPath();ctx.ellipse(0,-6*s,9*s,16*s,0,0,TAU);ctx.fill();ctx.stroke();ctx.restore();});ctx.restore();
  icon(ctx,x,y,s,P_BEE,col,{detail:D_BEE,eye:[33,-2,2]});});}
const P_MONKEY=c=>{c.ellipse(0,20,20,28,0,0,TAU);c.moveTo(16,-18);c.arc(0,-18,16,0,TAU);c.moveTo(-16,40);c.bezierCurveTo(-46,52,-58,20,-40,6);};
const D_MONKEY=c=>{c.ellipse(0,-15,9,8,0,0,TAU);c.moveTo(-16,-22);c.arc(-17,-22,4,0,TAU);c.moveTo(20,-22);c.arc(17,-22,4,0,TAU);};
const monkey=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_MONKEY,col||[220,200,170],Object.assign({detail:D_MONKEY,eye:[4,-18,2.2]},o));
const P_LEOPARD=c=>{c.moveTo(-50,-4);c.bezierCurveTo(-30,-20,20,-22,42,-12);c.lineTo(52,-22);c.bezierCurveTo(60,-30,76,-28,80,-18);c.bezierCurveTo(84,-10,76,-4,68,-4);c.lineTo(56,0);c.lineTo(50,10);c.lineTo(52,42);c.lineTo(44,42);c.lineTo(40,14);c.lineTo(36,14);c.lineTo(34,42);c.lineTo(27,42);c.lineTo(26,12);c.bezierCurveTo(0,16,-20,16,-34,12);c.lineTo(-36,42);c.lineTo(-44,42);c.lineTo(-46,10);c.bezierCurveTo(-60,6,-70,-10,-90,-20);c.bezierCurveTo(-72,-4,-60,-2,-50,-4);};
const D_SPOTS=c=>{for(let i=0;i<12;i++){const x=-40+(i%6)*14+(i>5?6:0),y=-10+(i>5?10:0);c.moveTo(x+3,y);c.arc(x,y,3,0,TAU);}};
const leopard=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_LEOPARD,col||LEO,Object.assign({detail:D_SPOTS,eye:[72,-18,2]},o));
const P_EAGLE=c=>{c.moveTo(0,-8);c.bezierCurveTo(-20,-30,-60,-34,-86,-20);c.lineTo(-70,-12);c.lineTo(-80,-2);c.lineTo(-60,0);c.lineTo(-66,10);c.bezierCurveTo(-40,4,-14,6,-6,14);c.lineTo(-8,34);c.lineTo(0,28);c.lineTo(8,34);c.lineTo(6,14);c.bezierCurveTo(14,6,40,4,66,10);c.lineTo(60,0);c.lineTo(80,-2);c.lineTo(70,-12);c.lineTo(86,-20);c.bezierCurveTo(60,-34,20,-30,0,-8);};
const eagle=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_EAGLE,col||EAG,Object.assign({detail:c=>{c.moveTo(0,-8);c.arc(0,-14,6,0,TAU);}},o));
const P_SNAKE=c=>{c.moveTo(-70,10);c.bezierCurveTo(-50,-20,-30,30,-10,0);c.bezierCurveTo(10,-30,30,20,50,-4);c.bezierCurveTo(58,-12,70,-12,74,-4);c.bezierCurveTo(70,4,60,6,52,4);c.bezierCurveTo(32,30,10,-18,-6,10);c.bezierCurveTo(-26,40,-48,-6,-66,16);c.closePath();};
const snake=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_SNAKE,col||SNK,Object.assign({eye:[64,-6,2]},o));
const P_DOLPHIN=c=>{c.moveTo(-70,8);c.bezierCurveTo(-40,-26,20,-30,54,-8);c.lineTo(80,-2);c.lineTo(56,4);c.bezierCurveTo(30,18,-10,16,-40,10);c.lineTo(-62,24);c.lineTo(-58,10);c.lineTo(-80,0);c.closePath();c.moveTo(-6,-22);c.lineTo(-18,-44);c.lineTo(8,-24);};
const dolphin=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_DOLPHIN,col||[120,210,255],Object.assign({eye:[46,-8,2.2]},o));
const P_ELEPHANT=c=>{c.moveTo(-60,-20);c.bezierCurveTo(-60,-50,20,-54,30,-28);c.bezierCurveTo(44,-44,70,-36,68,-10);c.bezierCurveTo(68,8,70,26,78,34);c.lineTo(70,36);c.bezierCurveTo(60,24,56,10,54,0);c.lineTo(40,4);c.lineTo(40,40);c.lineTo(26,40);c.lineTo(24,10);c.lineTo(-30,10);c.lineTo(-32,40);c.lineTo(-46,40);c.lineTo(-48,8);c.bezierCurveTo(-62,4,-64,-8,-60,-20);};
const elephant=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_ELEPHANT,col||[190,200,220],Object.assign({detail:c=>{c.moveTo(34,-28);c.bezierCurveTo(24,-10,34,6,46,0);},eye:[52,-20,2]},o));
const marmoset=(ctx,x,y,s,col,o)=>icon(ctx,x,y,s,P_MONKEY,col||[230,210,180],Object.assign({detail:c=>{D_MONKEY(c);c.moveTo(-14,-30);c.lineTo(-24,-42);c.moveTo(14,-30);c.lineTo(24,-42);},eye:[4,-18,2]},o));
const P_RABBIT=c=>{c.ellipse(0,8,34,20,-0.1,0,TAU);c.moveTo(44,-10);c.arc(34,-12,13,0,TAU);c.moveTo(30,-22);c.ellipse(24,-44,6,20,-0.45,0,TAU);c.moveTo(40,-22);c.ellipse(36,-46,6,20,-0.2,0,TAU);c.moveTo(-30,4);c.arc(-36,4,7,0,TAU);};
function rabbit(ctx,x,y,s,col,t,o){o=o||{};const h=Math.abs(Math.sin(t*6))*18*(o.run==null?1:o.run);icon(ctx,x,y-h*s,s,P_RABBIT,col||[230,220,200],Object.assign({eye:[38,-14,2.2],detail:c=>{c.moveTo(-14,22);c.lineTo(-30,34+(h>8?-6:4));c.moveTo(18,22);c.lineTo(30,34+(h>8?4:-6));}},o));}
const P_ROBIN=c=>{c.ellipse(0,4,26,22,0,0,TAU);c.moveTo(30,-16);c.arc(22,-16,11,0,TAU);c.moveTo(-22,0);c.lineTo(-44,-8);c.lineTo(-40,8);};
function robin(ctx,x,y,s,o){o=o||{};icon(ctx,x,y,s,P_ROBIN,o.col||[255,160,110],Object.assign({eye:[25,-18,2],detail:c=>{c.moveTo(33,-17);c.lineTo(40,-15);c.lineTo(33,-13);}},o));
  if(o.breast!==false)withA(ctx,o.a==null?1:o.a,()=>{ctx.fillStyle="rgba(255,120,70,0.75)";ctx.beginPath();ctx.ellipse(x+14*s,y+2*s,11*s,13*s,0,0,TAU);ctx.fill();});}
const sparrow=(ctx,x,y,s,o)=>icon(ctx,x,y,s,P_ROBIN,[210,170,120],Object.assign({eye:[25,-18,2],detail:c=>{c.moveTo(33,-17);c.lineTo(40,-15);c.lineTo(33,-13);c.moveTo(-10,-6);c.lineTo(4,4);c.moveTo(-14,4);c.lineTo(0,12);}},o));
const P_PENGUIN=c=>{c.ellipse(0,6,22,36,0,0,TAU);c.moveTo(14,-36);c.arc(0,-36,14,0,TAU);c.moveTo(-20,0);c.lineTo(-30,18);c.lineTo(-20,14);c.moveTo(20,0);c.lineTo(30,18);c.lineTo(20,14);};
const penguin=(ctx,x,y,s,o)=>icon(ctx,x,y,s,P_PENGUIN,[200,220,245],Object.assign({eye:[5,-38,2],detail:c=>{c.ellipse(0,10,12,26,0,0,TAU);c.moveTo(12,-36);c.lineTo(20,-33);c.lineTo(12,-30);}},o));
const P_OSTRICH=c=>{c.ellipse(-6,0,30,20,0,0,TAU);c.moveTo(16,-8);c.bezierCurveTo(24,-30,20,-50,24,-62);c.arc(28,-64,6,Math.PI,TAU+1);c.lineTo(38,-62);c.moveTo(-10,18);c.lineTo(-14,54);c.moveTo(4,18);c.lineTo(8,54);};
const ostrich=(ctx,x,y,s,o)=>icon(ctx,x,y,s,P_OSTRICH,[220,200,180],Object.assign({eye:[28,-65,1.8]},o));

/* ---------- places ---------- */
function tree(ctx,x,y,s,a){withA(ctx,a==null?1:a,()=>{ctx.fillStyle="rgba(60,44,30,0.95)";ctx.fillRect(x-10*s,y-150*s,20*s,150*s);[[0,-190,80],[-60,-160,56],[60,-160,56],[-30,-230,52],[36,-226,50]].forEach(([dx,dy,r])=>{const g=ctx.createRadialGradient(x+dx*s-r*s*0.3,y+dy*s-r*s*0.3,4,x+dx*s,y+dy*s,r*s);g.addColorStop(0,"rgba(90,150,90,0.95)");g.addColorStop(1,"rgba(30,60,40,0.95)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);ctx.fill();});});}
function bush(ctx,x,y,s,a){withA(ctx,a==null?1:a,()=>{[[-40,-20,36],[0,-34,44],[40,-22,34]].forEach(([dx,dy,r])=>{const g=ctx.createRadialGradient(x+dx*s,y+dy*s-r*s*0.4,4,x+dx*s,y+dy*s,r*s);g.addColorStop(0,"rgba(80,140,80,0.95)");g.addColorStop(1,"rgba(26,54,36,0.95)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);ctx.fill();});});}
function grass(ctx,x0,x1,y,t,a){withA(ctx,a==null?1:a,()=>{ctx.strokeStyle="rgba(110,180,110,0.55)";ctx.lineWidth=2;for(let x=x0;x<x1;x+=9){const h=14+hash(x,2)*20,sw=Math.sin(t*1.3+x*0.05)*4;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+sw*0.5,y-h*0.6,x+sw,y-h);ctx.stroke();}});}
// a photo in a pigeon experiment: a landscape, with or without a person in it
function photoTile(ctx,x,y,w,h,k,person_,a,mark){withA(ctx,a,()=>{ctx.save();rr(ctx,x,y,w,h,8);ctx.clip();const sky=[[92,130,190],[200,150,110],[110,160,170],[150,140,200]][k%4],gr=[[70,110,70],[120,96,70],[80,120,110],[96,110,70]][k%4];
  let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rgba(sky,1));g.addColorStop(0.62,rgba(mix(sky,[255,255,255],0.3),1));g.addColorStop(0.62,rgba(gr,1));g.addColorStop(1,rgba(mix(gr,[0,0,0],0.4),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  if(hash(k,3)>0.4){ctx.fillStyle="rgba(40,60,40,0.8)";ctx.beginPath();ctx.arc(x+w*(0.2+0.6*hash(k,4)),y+h*0.58,w*0.14,0,TAU);ctx.fill();}
  if(person_){const px=x+w*(0.3+0.4*hash(k,5)),py=y+h*0.6,ps=h/140;ctx.fillStyle="rgba(30,24,30,0.95)";ctx.beginPath();ctx.arc(px,py-38*ps,9*ps,0,TAU);ctx.fill();rr(ctx,px-10*ps,py-28*ps,20*ps,34*ps,8*ps);ctx.fill();ctx.fillRect(px-8*ps,py+4*ps,6*ps,18*ps);ctx.fillRect(px+2*ps,py+4*ps,6*ps,18*ps);}
  ctx.restore();ctx.strokeStyle="rgba(230,240,255,0.5)";ctx.lineWidth=1.5;rr(ctx,x,y,w,h,8);ctx.stroke();
  if(mark)withA(ctx,mark,()=>{ctx.strokeStyle=rgba(GOOD,1);ctx.lineWidth=4;ctx.shadowColor=rgba(GOOD,0.9);ctx.shadowBlur=12;rr(ctx,x-4,y-4,w+8,h+8,10);ctx.stroke();ctx.shadowBlur=0;});});}
// a card a bee chooses from: a colour or a pattern of stripes
function beeCard(ctx,x,y,s,kind,a,hi){withA(ctx,a,()=>{glass(ctx,x-s/2,y-s/2,s,s,12,hi?GOOD:[170,200,245],{glow:hi?16:0,ea:hi?0.9:0.4,fill:"rgba(10,16,30,0.9)"});ctx.save();rr(ctx,x-s/2+10,y-s/2+10,s-20,s-20,8);ctx.clip();
  if(kind==="blue"||kind==="yellow"){ctx.fillStyle=kind==="blue"?"rgb(90,140,255)":"rgb(255,210,70)";ctx.fillRect(x-s/2,y-s/2,s,s);}
  else{ctx.fillStyle="rgb(20,24,36)";ctx.fillRect(x-s/2,y-s/2,s,s);ctx.fillStyle="rgb(230,236,250)";for(let i=-6;i<6;i++){if(kind==="hstripes")ctx.fillRect(x-s/2,y+i*16,s,8);else ctx.fillRect(x+i*16,y-s/2,8,s);}}
  ctx.restore();});}
// a signature: a whistle's shape, the same every time, like a name
function nameWave(ctx,x,y,w,h,seed,col,a,p){if(a<=0.01)return;withA(ctx,a,()=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=10;ctx.beginPath();const n=60,q=p==null?1:p;
  for(let i=0;i<=n*q;i++){const u=i/n,v=Math.sin(u*Math.PI*(2+seed))*Math.sin(u*Math.PI)*0.8+0.2*Math.sin(u*Math.PI*9*(1+seed*0.3));const px=x+u*w,py=y-v*h/2;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();ctx.shadowBlur=0;});}

/* ---------- people and minds ---------- */
// a baby, sitting, pointing: the root of reference. pt (0..1) raises the pointing arm
function baby(ctx,x,y,s,a,pt){withA(ctx,a==null?1:a,()=>{const col=[255,214,170],skin=[240,196,160],r=ease(clamp(pt==null?1:pt,0,1));
  const limb_=(pts,w)=>{ctx.save();ctx.strokeStyle=rgba(skin,1);ctx.lineWidth=w*s;ctx.lineCap="round";ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(x+q[0]*s,y+q[1]*s):ctx.moveTo(x+q[0]*s,y+q[1]*s));ctx.stroke();ctx.restore();};
  // legs, stretched out in front
  limb_([[-6,36],[26,52],[44,50]],15);limb_([[-14,40],[14,60],[34,62]],15);
  icon(ctx,x,y,s,c=>{c.moveTo(20,10);c.bezierCurveTo(22,40,10,52,-8,52);c.bezierCurveTo(-30,52,-36,34,-32,12);c.bezierCurveTo(-28,-6,16,-8,20,10);c.moveTo(22,-34);c.arc(-2,-34,26,0,TAU);},[200,220,250],{fill:"rgba(120,150,200,0.9)",eye:[8,-36,2.6],detail:c=>{c.moveTo(-6,-24);c.quadraticCurveTo(2,-18,10,-24);c.moveTo(-8,-58);c.quadraticCurveTo(-2,-66,6,-60);}});
  // the face and hair, over the head
  ctx.save();ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.arc(x-2*s,y-34*s,23*s,0,TAU);ctx.fill();ctx.fillStyle="rgba(40,30,30,0.95)";ctx.beginPath();ctx.arc(x+8*s,y-38*s,2.6*s,0,TAU);ctx.arc(x-8*s,y-38*s,2.6*s,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(120,60,50,0.9)";ctx.lineWidth=2*s;ctx.beginPath();ctx.arc(x,y-28*s,6*s,0.2,Math.PI-0.2);ctx.stroke();ctx.strokeStyle="rgba(90,60,40,0.95)";ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(x-8*s,y-56*s);ctx.quadraticCurveTo(x-2*s,y-66*s,x+6*s,y-58*s);ctx.stroke();ctx.restore();
  // the other arm resting, and the pointing arm, rising to the thing it shares
  limb_([[-24,10],[-30,30],[-22,40]],11);
  const ex=18+lerp(10,46,r),ey=lerp(26,-18,r);limb_([[14,8],[ex,ey]],11);
  ctx.save();ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.arc(x+ex*s,y+ey*s,7*s,0,TAU);ctx.fill();ctx.strokeStyle=rgba(skin,1);ctx.lineWidth=4.5*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+ex*s,y+ey*s);ctx.lineTo(x+(ex+16*r+4)*s,y+(ey-12*r)*s);ctx.stroke();ctx.restore();});}
// a grown-up's arm, pointing: a sleeve, a hand and one finger, from (x0,y0) towards (x1,y1)
function pointArm(ctx,x0,y0,x1,y1,s,a){withA(ctx,a==null?1:a,()=>{const an=Math.atan2(y1-y0,x1-x0),L=Math.hypot(x1-x0,y1-y0);ctx.save();ctx.translate(x0,y0);ctx.rotate(an);
  const g=ctx.createLinearGradient(0,-20*s,0,20*s);g.addColorStop(0,"#5a6f96");g.addColorStop(1,"#2c3a58");ctx.fillStyle=g;ctx.shadowColor="rgba(120,160,230,0.6)";ctx.shadowBlur=12;rr(ctx,-40*s,-22*s,L+40*s,44*s,20*s);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle="#d9e2f0";ctx.fillRect(L-8*s,-22*s,12*s,44*s);ctx.fillStyle="#d8a884";ctx.beginPath();ctx.ellipse(L+26*s,2*s,26*s,18*s,0,0,TAU);ctx.fill();
  ctx.strokeStyle="#d8a884";ctx.lineWidth=11*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(L+36*s,-6*s);ctx.lineTo(L+80*s,-10*s);ctx.stroke();ctx.lineWidth=9*s;ctx.beginPath();ctx.moveTo(L+30*s,-12*s);ctx.lineTo(L+46*s,-22*s);ctx.stroke();ctx.restore();});}
// a side-view brain, with one concept cell that lights up
const P_BRAIN=c=>{c.moveTo(-100,20);c.bezierCurveTo(-120,-20,-100,-70,-50,-80);c.bezierCurveTo(-20,-110,40,-104,70,-80);c.bezierCurveTo(110,-70,124,-30,110,0);c.bezierCurveTo(120,30,96,56,60,54);c.bezierCurveTo(50,70,20,74,4,62);c.lineTo(10,96);c.lineTo(-8,96);c.lineTo(-12,58);c.bezierCurveTo(-50,62,-90,50,-100,20);c.closePath();};
const D_BRAIN=c=>{c.moveTo(-70,-40);c.bezierCurveTo(-50,-60,-20,-40,0,-60);c.moveTo(10,-40);c.bezierCurveTo(30,-60,60,-40,80,-50);c.moveTo(-80,0);c.bezierCurveTo(-50,-10,-30,20,0,0);c.moveTo(20,10);c.bezierCurveTo(40,-10,70,20,96,0);c.moveTo(-40,40);c.bezierCurveTo(-20,30,0,50,30,36);};
function brain(ctx,x,y,s,t,act,a){withA(ctx,a==null?1:a,()=>{icon(ctx,x,y,s,P_BRAIN,[200,170,255],{detail:D_BRAIN,glow:10});const cx=x+14*s,cy=y+26*s,k=act||0;
  glow(ctx,cx,cy,(40+60*k)*s,[255,236,160],0.25+0.6*k);ctx.save();ctx.strokeStyle="rgba(255,236,160,"+(0.4+0.6*k)+")";ctx.lineWidth=1.6;for(let i=0;i<7;i++){const an=i/7*TAU+0.3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx+Math.cos(an+0.4)*14*s,cy+Math.sin(an+0.4)*14*s,cx+Math.cos(an)*26*s,cy+Math.sin(an)*26*s);ctx.stroke();}
  ctx.fillStyle="rgba(255,244,200,"+(0.6+0.4*k)+")";ctx.beginPath();ctx.arc(cx,cy,5*s+3*k,0,TAU);ctx.fill();ctx.restore();});}
// three forms of one person: a photo, a drawing, a written name
const PORTRAIT={};
function portraitBmp(kind){if(PORTRAIT[kind])return PORTRAIT[kind];const c=mkCanvas(240,280),x=c.getContext("2d");
  if(kind==="name"){x.fillStyle="#f3ecdc";x.fillRect(0,0,240,280);x.fillStyle="#2a2420";x.font=font(700,34);x.textAlign="center";x.fillText("Mei",120,130);x.fillText("Tanaka",120,172);}
  else{const g=x.createLinearGradient(0,0,0,280);g.addColorStop(0,kind==="photo"?"#6f86ad":"#f3ecdc");g.addColorStop(1,kind==="photo"?"#2d3a52":"#e6dcc8");x.fillStyle=g;x.fillRect(0,0,240,280);
    if(typeof person==="function"){x.save();if(kind==="drawing")x.filter="grayscale(1) contrast(1.6) brightness(1.35)";person(x,"mei",120,860,1.45,{t:0.4,expr:"calm"});x.restore();}}
  PORTRAIT[kind]=c;return c;}
function portrait(ctx,x,y,kind,a,hi){withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=18;ctx.drawImage(portraitBmp(kind),x,y,200,234);ctx.restore();ctx.strokeStyle=hi?rgba([255,236,160],1):"rgba(230,236,250,0.6)";ctx.lineWidth=hi?4:2;ctx.strokeRect(x,y,200,234);
  if(hi)glow(ctx,x+100,y+117,150,[255,236,160],0.2*hi);});}

/* ---------- things for the end ---------- */
// a clay tablet, with rows of wedge marks pressed in as p goes from 0 to 1
function tablet(ctx,x,y,w,h,p,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=30;ctx.fillStyle="#9a7650";rr(ctx,x,y,w,h,28);ctx.fill();ctx.shadowBlur=0;
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,230,190,0.25)");g.addColorStop(1,"rgba(40,20,10,0.35)");ctx.fillStyle=g;rr(ctx,x,y,w,h,28);ctx.fill();
  ctx.strokeStyle="rgba(70,44,24,0.5)";ctx.lineWidth=2;for(let r=1;r<5;r++){ctx.beginPath();ctx.moveTo(x+24,y+r*h/5);ctx.lineTo(x+w-24,y+r*h/5);ctx.stroke();}
  const n=48,shown=Math.floor(n*clamp(p,0,1));for(let i=0;i<shown;i++){const row=Math.floor(i/12),col_=i%12,px=x+40+col_*(w-80)/12+hash(i,2)*6,py=y+row*h/5+h/10+8,k=hash(i,3);
    ctx.fillStyle="rgba(60,36,18,0.85)";ctx.beginPath();if(k<0.5){ctx.moveTo(px,py-10);ctx.lineTo(px+16,py-6);ctx.lineTo(px,py-2);}else{ctx.moveTo(px,py-12);ctx.lineTo(px+5,py+8);ctx.lineTo(px+10,py-12);}ctx.closePath();ctx.fill();
    if(hash(i,5)>0.7){ctx.beginPath();ctx.arc(px+8,py+10,4,0,TAU);ctx.fill();}}
  ctx.restore();});}
// a scroll with names on it: to enrol was to write a name on the roll
function roll(ctx,x,y,w,h,names,p,a){withA(ctx,a,()=>{ctx.fillStyle="#e8dcc0";ctx.fillRect(x,y,w,h);[y,y+h].forEach(yy=>{const g=ctx.createLinearGradient(x,yy-10,x,yy+10);g.addColorStop(0,"#b89a6a");g.addColorStop(0.5,"#f0e2c4");g.addColorStop(1,"#8a6c44");ctx.fillStyle=g;rr(ctx,x-12,yy-12,w+24,24,12);ctx.fill();});
  names.forEach((nm,i)=>withA(ctx,clamp(p*names.length-i,0,1),()=>T(ctx,nm,x+28,y+44+i*34,{w:600,size:22,color:"rgba(60,44,30,0.92)"})));});}

/* ---------- pictures for the labs and the scenarios (site/assets/whats-in-a-word/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW); any text it draws comes from FW.vis,
   so the Spanish pages show Spanish. Lab pictures are shown at about half size: text is 22 px or more. */
const WA_NUM=(n,L)=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,L.lang==="es"?".":",");
const WA_HEX=h=>h.match(/\w\w/g).map(q=>parseInt(q,16));
const LV={
  // Count the credentials: what's ticked, as one bar, with each office's answer marked under it
  count:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.kind==="count"),it=lab.w.items,max=it.reduce((a,x)=>a+x.n,0),x0=30,x1=w-30,y=110,bh=86,sc=v=>x0+(x1-x0)*v/max;let acc=0;
    T(c,lab.w.unit+": "+WA_NUM(st.total,L),x0,70,{w:800,size:44,color:rgba(TRUST,1)});
    it.forEach((x,i)=>{const on=st.on.has(x.k),a=sc(acc),b=sc(acc+x.n),col=[TRUST,OFFICE.short.c,OFFICE.careers.c,[150,120,200],OFFICE.lms.c][i];c.fillStyle=rgba(col,on?0.85:0.14);rr(c,a+1,y,b-a-2,bh,10);c.fill();c.strokeStyle=rgba(col,0.8);c.lineWidth=2;rr(c,a+1,y,b-a-2,bh,10);c.stroke();
      if(b-a>90)T(c,WA_NUM(x.n,L),(a+b)/2,y+bh/2+9,{w:800,size:24,align:"center",color:on?"#0a1020":rgba(SOFT,0.9)});acc+=x.n;});
    lab.w.targets.forEach((tg,i)=>{const v=it.filter(x=>tg.set.includes(x.k)).reduce((a,x)=>a+x.n,0),xx=sc(v),col=WA_HEX(tg.c),yy=y+bh+46+i*44,right=xx>w*0.6;
      c.strokeStyle=rgba(col,0.9);c.lineWidth=3;c.setLineDash([6,6]);c.beginPath();c.moveTo(xx,y-6);c.lineTo(xx,yy-10);c.stroke();c.setLineDash([]);T(c,tg.name,xx+(right?-10:10),yy,{w:800,size:24,align:right?"right":"left",color:rgba(col,1)});});},
  // Same word, same thing? One word, two ideas, two birds
  trio:(c,w,h,st,L)=>{const V=L.vis,wx=w/2,wy=h-40;
    [[200,V.ideaUK,[140,200,255],200],[w-200,V.ideaUS,[255,170,120],w-200]].forEach(([ix,lab,col,bx],i)=>{c.strokeStyle=rgba(col,0.9);c.lineWidth=3;c.beginPath();c.moveTo(wx,wy-30);c.lineTo(ix,90);c.stroke();
      glow(c,ix,90,70,col,0.5);c.fillStyle=rgba(mix(col,[255,255,255],0.5),1);c.beginPath();c.arc(ix,90,16,0,TAU);c.fill();T(c,lab,ix,48,{w:800,size:26,align:"center",color:rgba(col,1)});
      c.beginPath();c.moveTo(ix,106);c.lineTo(bx+(i?-150:150),h-110);c.stroke();robin(c,bx+(i?-150:150),h-90,i?1.5:1.2,{col:i?[200,150,120]:undefined});});
    const ww=tw(c,V.word,34,800)+50;glass(c,wx-ww/2,wy-30,ww,56,14,KIND,{glow:12,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,V.word,wx,wy+9,{w:800,size:34,align:"center"});},
  // What counts as one? Three rabbits, and what one row stands for
  grain:(c,w,h,st,L)=>{const g=c.createLinearGradient(0,h*0.62,0,h);g.addColorStop(0,"rgba(40,56,34,0.9)");g.addColorStop(1,"rgba(8,12,8,0.9)");c.fillStyle=g;c.fillRect(0,h*0.62,w,h*0.38);grass(c,0,w,h*0.62+4,1,0.8);
    [[w*0.2,h*0.6],[w*0.5,h*0.62],[w*0.8,h*0.58]].forEach(([x,y],i)=>{rabbit(c,x,y,1.3,[235,225,205],0.2+i*0.3,{run:0.4});
      if(st.pick==="rabbit")ring(c,x,y-12,86,KIND,0.9,4);
      if(st.pick==="ear"){ring(c,x+32,y-72,22,KIND,0.9,4);ring(c,x+48,y-76,22,KIND,0.9,4);}
      if(st.pick==="second"){for(let k=0;k<12;k++){c.fillStyle=rgba(KIND,0.8);c.fillRect(x-90+k*15,y+50,10,18);}}});
    T(c,(L.vis.grain||{})[st.pick]||"",30,56,{w:800,size:34,color:rgba(TRUST,1)});},
  // scenarios (600 × 320)
  two:(c,w,h,st,L)=>{const V=L.vis.two;officeCard(c,20,40,270,"lms","9,800".replace(",",L.lang==="es"?".":","),{name:V[0],big:56,h:210,meaning:V[1]});officeCard(c,310,40,270,"reg","9,350".replace(",",L.lang==="es"?".":","),{name:V[2],big:56,h:210,meaning:V[3]});T(c,V[4],300,296,{w:800,size:22,align:"center",color:rgba(TRUST,1)});},
  learner:(c,w,h,st,L)=>{const V=L.vis.learner;fuzzyRing(c,300,170,140,KIND,0.5,30);ring(c,300,170,140,KIND,0.9,3);ring(c,300,200,68,TRUST,0.9,3);T(c,V[0],300,58,{w:800,size:26,align:"center",color:rgba(KIND,1)});T(c,V[1],300,208,{w:800,size:24,align:"center",color:rgba(TRUST,1)});T(c,V[2],440,140,{w:700,size:18,align:"center",color:rgba(SOFT,1)});},
  rows:(c,w,h,st,L)=>{const V=L.vis.rows;table(c,40,16,V[0],[V[1],V[2]],[["Aisha K.","DS101"],["Aisha K.","STAT110"],["Aisha K.","WRIT100"],["Ben O.","DS101"],["Ben O.","MATH120"]],{col:KIND});T(c,V[3],360,290,{w:800,size:22,color:rgba(EDGE_,1)});},
  gloss:(c,w,h,st,L)=>{const V=L.vis.gloss;glass(c,30,30,540,260,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,V[0],60,88,{w:800,size:32,color:rgba(TRUST,1)});wrapT(c,V[1],60,140,480,{w:600,size:24});T(c,V[2],60,260,{w:800,size:24,color:rgba(EDGE_,1)});},
  badges:(c,w,h,st,L)=>{const V=L.vis.badges;credCard(c,20,40,270,{era:"badge",title:V[0],holder:"Aisha K.",claim:V[1],evidence:V[2],h:230,col:OFFICE.careers.c,rh:40});credCard(c,310,40,270,{era:"badge",title:V[3],holder:"Aisha K.",claim:V[4],evidence:V[5],h:230,col:[150,140,170],rh:40});},
  owner:(c,w,h,st,L)=>{const V=L.vis.owner;person(c,"mei",120,320,0.44,{t:1,pose:"explain"});glass(c,230,60,340,160,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,V[0],260,118,{w:800,size:34,color:rgba(TRUST,1)});T(c,V[1],260,164,{w:700,size:22});stamp(c,570,262,V[2],TRUST,1);},
  drift:(c,w,h,st,L)=>{const V=L.vis.drift;c.strokeStyle=rgba(CLAY,0.7);c.lineWidth=4;c.beginPath();c.moveTo(80,200);c.lineTo(520,200);c.stroke();[[80,"2015",V[1]],[520,"2026",V[2]]].forEach(([x,y_,m])=>{c.fillStyle=rgba(CLAY,1);c.beginPath();c.arc(x,200,9,0,TAU);c.fill();T(c,y_,x,246,{f:"mono",w:500,size:22,align:"center",color:rgba(CLAY,1)});wrapT(c,m,x-110,130,220,{w:700,size:20,align:"left"});});tag(c,300,64,V[0],KIND,{align:"center",size:28});},
  paper:(c,w,h,st,L)=>{sheet(c,60,16,480,290,{rot:-0.02});L.vis.paper.forEach((s,i)=>pencilText(c,(i+1)+". "+s,96,66+i*50,{size:21}));}
};
