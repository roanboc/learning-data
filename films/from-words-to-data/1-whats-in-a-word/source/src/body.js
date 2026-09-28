/* ===== What's in a word: bodies and minds =====
   A baby who points before she can talk, a grown-up's arm (pointing, or handing over a letter), a hand pressing a reed stylus into clay,
   and a brain with one concept cell that lights up. */
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
// a reed stylus held to the clay, its tip at (x,y)
function stylus(ctx,x,y,t,a){withA(ctx,a==null?1:a,()=>{ctx.strokeStyle="rgba(200,170,120,0.95)";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+112,y-174);ctx.stroke();});}
