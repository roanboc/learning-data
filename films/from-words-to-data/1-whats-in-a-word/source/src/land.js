/* ===== What's in a word: the land =====
   The ground of the grassland, its grass, trees and bushes, a branch for a bird, layers of rock with fossils in them, and a clay tablet.
   Scenes place these; each draws in the frame's own units (1920 × 1080), and moves with t where the world would move. */
// the ground of a scene, from y down to the bottom of the frame: a grassland at dusk
function ground(ctx,y,t,a){withA(ctx,a==null?1:a,()=>{const g=ctx.createLinearGradient(0,y,0,1080);g.addColorStop(0,"rgba(40,56,34,0.9)");g.addColorStop(1,"rgba(10,14,10,0.9)");ctx.fillStyle=g;ctx.fillRect(0,y,1920,1080-y);});}
function tree(ctx,x,y,s,a){withA(ctx,a==null?1:a,()=>{ctx.fillStyle="rgba(60,44,30,0.95)";ctx.fillRect(x-10*s,y-150*s,20*s,150*s);[[0,-190,80],[-60,-160,56],[60,-160,56],[-30,-230,52],[36,-226,50]].forEach(([dx,dy,r])=>{const g=ctx.createRadialGradient(x+dx*s-r*s*0.3,y+dy*s-r*s*0.3,4,x+dx*s,y+dy*s,r*s);g.addColorStop(0,"rgba(90,150,90,0.95)");g.addColorStop(1,"rgba(30,60,40,0.95)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);ctx.fill();});});}
function bush(ctx,x,y,s,a){withA(ctx,a==null?1:a,()=>{[[-40,-20,36],[0,-34,44],[40,-22,34]].forEach(([dx,dy,r])=>{const g=ctx.createRadialGradient(x+dx*s,y+dy*s-r*s*0.4,4,x+dx*s,y+dy*s,r*s);g.addColorStop(0,"rgba(80,140,80,0.95)");g.addColorStop(1,"rgba(26,54,36,0.95)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);ctx.fill();});});}
function grass(ctx,x0,x1,y,t,a){withA(ctx,a==null?1:a,()=>{ctx.strokeStyle="rgba(110,180,110,0.55)";ctx.lineWidth=2;for(let x=x0;x<x1;x+=9){const h=14+hash(x,2)*20,sw=Math.sin(t*1.3+x*0.05)*4;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+sw*0.5,y-h*0.6,x+sw,y-h);ctx.stroke();}});}
// a branch for a bird to sit on: centred on x, its top at y, w long
function perch(ctx,x,y,w,t,a){withA(ctx,a==null?1:a,()=>{ctx.fillStyle="rgba(80,60,40,0.9)";ctx.fillRect(x-w/2,y,w,10);});}
// layers of rock filling the frame, with shells and bones in them, but no words
function strata(ctx,t){const cols=["#3b2a1c","#4a3422","#5a4130","#3f2e22","#2e2118"];cols.forEach((cl,i)=>{ctx.fillStyle=cl;ctx.beginPath();ctx.moveTo(0,300+i*110);for(let x=0;x<=1920;x+=60)ctx.lineTo(x,300+i*110+Math.sin(x*0.004+i)*16);ctx.lineTo(1920,1080);ctx.lineTo(0,1080);ctx.fill();});
    [[380,430],[1480,560],[860,690]].forEach(([x,y],i)=>{ctx.strokeStyle="rgba(240,226,200,0.55)";ctx.lineWidth=3;ctx.beginPath();for(let k=0;k<5;k++)ctx.arc(x,y,8+k*8,Math.PI*(0.1+k*0.3),Math.PI*(0.9+k*0.3));ctx.stroke();});
    ctx.strokeStyle="rgba(240,226,200,0.45)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(1100,420);ctx.lineTo(1260,440);ctx.moveTo(1120,440);ctx.lineTo(1240,420);ctx.stroke();}
// a clay tablet, with rows of wedge marks pressed in as p goes from 0 to 1
function tablet(ctx,x,y,w,h,p,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=30;ctx.fillStyle="#9a7650";rr(ctx,x,y,w,h,28);ctx.fill();ctx.shadowBlur=0;
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,230,190,0.25)");g.addColorStop(1,"rgba(40,20,10,0.35)");ctx.fillStyle=g;rr(ctx,x,y,w,h,28);ctx.fill();
  ctx.strokeStyle="rgba(70,44,24,0.5)";ctx.lineWidth=2;for(let r=1;r<5;r++){ctx.beginPath();ctx.moveTo(x+24,y+r*h/5);ctx.lineTo(x+w-24,y+r*h/5);ctx.stroke();}
  const n=48,shown=Math.floor(n*clamp(p,0,1));for(let i=0;i<shown;i++){const row=Math.floor(i/12),col_=i%12,px=x+40+col_*(w-80)/12+hash(i,2)*6,py=y+row*h/5+h/10+8,k=hash(i,3);
    ctx.fillStyle="rgba(60,36,18,0.85)";ctx.beginPath();if(k<0.5){ctx.moveTo(px,py-10);ctx.lineTo(px+16,py-6);ctx.lineTo(px,py-2);}else{ctx.moveTo(px,py-12);ctx.lineTo(px+5,py+8);ctx.lineTo(px+10,py-12);}ctx.closePath();ctx.fill();
    if(hash(i,5)>0.7){ctx.beginPath();ctx.arc(px+8,py+10,4,0,TAU);ctx.fill();}}
  ctx.restore();});}
