/* ===== Many agents, and what emerges: markets, and is it alive? =====
   The same matte style as places.js. The places: maTrading (a trading room, 6 May 2010, the day's index on the wall), maCell (a cell,
   drawn as a biology book would), maBristol (a floor near Bristol about 1950, with a robot tortoise's hutch) and maScope (a microscope's
   view). Live:
     ma_index(ctx, u, a)              the day's index drawn up to u (0..1 of the trading day), with the fall and the rebound
     ma_programs(ctx, t, o)           trading programs on the desks: a big seller, and fast programs passing contracts back and forth
     ma_cellLive(ctx, t, o)           the cell at work: parts made inside, worn parts of its skin replaced, food coming in
     ma_tortoise(ctx, x, y, ang, o)   the tortoise, a clear shell over its works, a light sensor on top; ma_tortoisePath its trip home
     ma_xeno(ctx, x, y, r, ang, o)    a tiny body of frog cells (o.c: C-shaped); ma_scopeLive the view at work */

/* ---------------------------------------------------------------- a trading room, 6 May 2010: the wall's big screen shows the day */
const MA_TR={chart:{x:560,y:70,w:1180,h:400},lo:-10,hi:1,desk:740};
AG_PLACES.maTrading=c=>{const C=MA_TR.chart;let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([150,156,166],1));g.addColorStop(1,rgba([126,130,140],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,2,71);
  // the wall's panels, and the big screen on it
  c.strokeStyle="rgba(40,44,54,0.18)";c.lineWidth=3;for(let x=0;x<W;x+=320){c.beginPath();c.moveTo(x,0);c.lineTo(x,MA_TR.desk);c.stroke();}
  ma_shadowOf(c,k=>k.rect(C.x-24,C.y-24,C.w+48,C.h+48),"rgba(20,24,34,0.45)",36,AG.sdx*2,14);c.fillStyle=rgba([46,50,58],1);c.fillRect(C.x-24,C.y-24,C.w+48,C.h+48);
  c.fillStyle=rgba([236,236,232],1);c.fillRect(C.x,C.y,C.w,C.h);c.strokeStyle="rgba(110,120,134,0.2)";c.lineWidth=1.4;
  for(let v=MA_TR.lo;v<=MA_TR.hi;v++){const y=ma_indexY(v);c.beginPath();c.moveTo(C.x,y);c.lineTo(C.x+C.w,y);c.stroke();}
  for(let k=1;k<13;k++){const x=C.x+C.w*k/13;c.beginPath();c.moveTo(x,C.y);c.lineTo(x,C.y+C.h);c.stroke();}
  c.strokeStyle="rgba(60,66,78,0.55)";c.lineWidth=2;c.setLineDash([8,8]);c.beginPath();c.moveTo(C.x,ma_indexY(0));c.lineTo(C.x+C.w,ma_indexY(0));c.stroke();c.setLineDash([]);
  g=c.createLinearGradient(0,C.y,0,C.y+C.h);g.addColorStop(0,"rgba(255,255,255,0.22)");g.addColorStop(0.35,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(C.x,C.y,C.w,C.h);
  // the desks in front: a long row of monitors seen from behind, their stands, the desk's edge
  const D=MA_TR.desk;g=c.createLinearGradient(0,D,0,H);g.addColorStop(0,rgba([96,92,90],1));g.addColorStop(1,rgba([70,68,68],1));c.fillStyle=g;c.fillRect(0,D+150,W,H-D-150);
  c.fillStyle=rgba([150,144,136],1);c.fillRect(0,D+136,W,24);c.fillStyle="rgba(255,250,240,0.25)";c.fillRect(0,D+136,W,3);
  for(let k=0;k<8;k++){const x=40+k*240,w=200,h=130;c.fillStyle=rgba([58,60,66],1);rr(c,x,D,w,h,8);c.fill();c.fillStyle="rgba(255,255,255,0.08)";c.fillRect(x+w-14,D+6,8,h-12);
    c.fillStyle=rgba([70,72,78],1);c.fillRect(x+w/2-12,D+h,24,10);c.fillRect(x+w/2-40,D+h+6,80,6);}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,30,40,0.12)");g.addColorStop(1,"rgba(255,248,236,0.06)");c.fillStyle=g;c.fillRect(0,0,W,H);};
function ma_indexY(v){const C=MA_TR.chart;return C.y+C.h*(MA_TR.hi-v)/(MA_TR.hi-MA_TR.lo);}
// the day's index against the day before's close, in percent, at x (0: the opening bell, 1: the close): a slide, a fall of another
// five to six percent in minutes, a rebound almost as fast
function ma_indexV(x){const n=Math.sin(x*61)*0.18+Math.sin(x*23+1)*0.25,base=-4.2*sstep(0,0.8,x)*(0.55+0.45*x)+n*(1-sstep(0.78,0.8,x));
  if(x<0.8)return base;if(x<0.815)return lerp(base,-9.4,sstep(0.8,0.815,x));if(x<0.86)return lerp(-9.4,-5.2,sstep(0.815,0.86,x));return lerp(-5.2,-3.3,sstep(0.86,1,x))+Math.sin(x*80)*0.15;}
function ma_index(ctx,u,a){a=a==null?1:a;if(a<=0||u<=0)return;const C=MA_TR.chart,n=Math.floor(clamp(u,0,1)*400);ctx.save();ctx.globalAlpha*=a;ctx.lineJoin="round";ctx.lineCap="round";
  ctx.strokeStyle="#2F3238";ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<=n;i++){const x=i/400;ctx.lineTo(C.x+C.w*x,ma_indexY(ma_indexV(x)));}ctx.stroke();
  const x=n/400,px=C.x+C.w*x,py=ma_indexY(ma_indexV(x));ctx.fillStyle="#2F3238";ctx.beginPath();ctx.arc(px,py,7,0,TAU);ctx.fill();ctx.restore();return [px,py];}
/* the programs on the desks, live: the big seller on the left, selling whatever the price; six fast programs passing contracts back
   and forth like a hot potato (heat 0..1: how fast). o.seller, o.fast: 0..1 how much each shows */
function ma_programs(ctx,t,o){o=o||{};const D=MA_TR.desk,y=D-150,sa=o.seller||0,fa=o.fast||0,heat=o.heat||0;
  const box=(x,w,label,a,glow)=>{if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(20,24,34,0.35)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=8;
    ctx.fillStyle="rgba(236,236,232,0.97)";rr(ctx,x,y,w,88,14);ctx.fill();ctx.restore();ctx.strokeStyle=rgba([86,92,104],0.5+0.5*glow);ctx.lineWidth=2+glow*2;rr(ctx,x,y,w,88,14);ctx.stroke();
    ag_T(ctx,label,x+w/2,y+57,{w:700,size:30,align:"center",col:AG.ink});ctx.restore();};
  box(56,388,"sell, whatever the price",sa,0.4+0.4*Math.sin(t*6));
  const X=[480,700,920,1140,1360,1580];X.forEach((x,i)=>box(x,180,"program",fa*ag_in(fa,i*0.08,0.3),heat*0.5*(1+Math.sin(t*9+i))));
  if(fa>0.6&&heat>0){const n=Math.floor(4+heat*10);for(let k=0;k<n;k++){const sp=0.9+heat*2.6,ph=(t*sp+k*0.37)%1,i=(k*3+Math.floor(t*sp+k*0.37))%5,a=X[i]+90,b=X[i+1]+90,
      x=lerp(a,b,ph),yy=y-22-Math.sin(Math.PI*ph)*44;ctx.fillStyle=rgba([226,222,214],1);ctx.strokeStyle=rgba([70,76,88],0.9);ctx.lineWidth=2;rr(ctx,x-22,yy-14,44,28,6);ctx.fill();ctx.stroke();
      ctx.fillStyle=rgba([70,76,88],0.8);ctx.fillRect(x-12,yy-4,24,3);ctx.fillRect(x-12,yy+3,16,3);}}
  if(sa>0.5){const n=3;for(let k=0;k<n;k++){const ph=(t*0.7+k/n)%1,x=lerp(410,560,ph),yy=y-16-Math.sin(Math.PI*ph)*54;ctx.save();ctx.globalAlpha*=sa*(1-ph*0.3);ctx.fillStyle=rgba([226,222,214],1);ctx.strokeStyle=rgba([70,76,88],0.9);
    ctx.lineWidth=2;rr(ctx,x-22,yy-14,44,28,6);ctx.fill();ctx.stroke();ctx.restore();}}}

/* ---------------------------------------------------------------- a cell, as a biology book draws it: a skin of small parts round
   a soft inside, where more parts are made */
const MA_CELL={cx:960,cy:560,r:370,n:76};
AG_PLACES.maCell=c=>{let g=c.createRadialGradient(1300,260,80,960,540,1200);g.addColorStop(0,rgba([238,234,226],1));g.addColorStop(1,rgba([214,210,204],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,1.8,23);
  const R=ag_rnd(72);for(let i=0;i<40;i++){const x=R()*W,y=R()*H;if(Math.hypot(x-MA_CELL.cx,y-MA_CELL.cy)<MA_CELL.r+60)continue;c.fillStyle="rgba(150,140,128,0.25)";c.beginPath();c.arc(x,y,3+R()*4,0,TAU);c.fill();}
  const C=MA_CELL;ma_shadowOf(c,k=>k.arc(C.cx,C.cy,C.r+16,0,TAU),"rgba(90,76,64,0.3)",40,AG.sdx*2,16);
  g=c.createRadialGradient(C.cx+90,C.cy-90,20,C.cx,C.cy,C.r+10);g.addColorStop(0,rgba([248,244,236],1));g.addColorStop(1,rgba([230,222,210],1));c.fillStyle=g;c.beginPath();c.arc(C.cx,C.cy,C.r,0,TAU);c.fill();
  // inside: a soft centre where parts are made, and threads of the cell's machinery
  ag_soft(c,k=>{const B=ma_blobPts(C.cx-30,C.cy+20,96,80,4,0.16,40);k.moveTo(B[0][0],B[0][1]);for(const p of B)k.lineTo(p[0],p[1]);k.closePath();},[216,204,190],[236,228,216],C.cx,C.cy-20,90,"rgba(110,90,70,0.25)",12,0.6);
  for(let i=0;i<6;i++){const a=i*1.05+0.3,r0=200+(i%2)*50,x=C.cx+Math.cos(a)*r0,y=C.cy+Math.sin(a)*r0;ag_soft(c,k=>k.ellipse(x,y,40,22,a,0,TAU),[220,206,190],[240,232,220],x+8,y-8,40,"rgba(110,90,70,0.25)",8,0.6);
    c.strokeStyle="rgba(160,136,112,0.35)";c.lineWidth=2;for(let j=-1;j<=1;j++){c.beginPath();c.ellipse(x,y,30,12+j*4,a,0.3,Math.PI-0.3);c.stroke();}}
  c.strokeStyle="rgba(170,150,130,0.3)";c.lineWidth=3;for(let i=0;i<9;i++){const a=R()*TAU,r0=120+R()*60;c.beginPath();c.moveTo(C.cx+Math.cos(a)*r0,C.cy+Math.sin(a)*r0);
    c.quadraticCurveTo(C.cx+Math.cos(a+0.4)*(r0+40),C.cy+Math.sin(a+0.4)*(r0+40),C.cx+Math.cos(a+0.8)*(r0-10),C.cy+Math.sin(a+0.8)*(r0-10));c.stroke();}};
// a part of the cell's skin at angle a: a small rounded bead, lit from the upper right
function ma_bead(ctx,x,y,r,a,k){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=rgba(mix([188,156,128],[236,226,212],k||0),1);ctx.beginPath();ctx.ellipse(0,0,r*0.9,r*1.25,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(255,250,240,0.4)";ctx.beginPath();ctx.ellipse(-r*0.25,-r*0.3,r*0.35,r*0.5,0,0,TAU);ctx.fill();ctx.restore();}
/* the cell at work, live: food comes in through the skin; inside, parts are made; now and then a part of the skin wears and fades,
   and a new one, made inside, travels out and takes its place. a 0..1; work 0..1 how busy */
function ma_cellLive(ctx,t,o){o=o||{};const C=MA_CELL,a=o.a==null?1:o.a,work=o.work==null?1:o.work;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const per=3.2,cyc=Math.floor(t/per),ph=(t%per)/per,slot=(cyc*29)%C.n;
  for(let i=0;i<C.n;i++){const an=i/C.n*TAU,x=C.cx+Math.cos(an)*C.r,y=C.cy+Math.sin(an)*C.r;let k=0,s=1;
    if(i===slot&&work>0){if(ph<0.4){k=sstep(0,0.4,ph);s=1-0.35*sstep(0.2,0.4,ph);}else if(ph<0.5){s=0;}else continue;}ma_bead(ctx,x,y,19*s,an,k);}
  if(work>0){const an=slot/C.n*TAU,tx=C.cx+Math.cos(an)*C.r,ty=C.cy+Math.sin(an)*C.r;if(ph>=0.4){const u=sstep(0.4,1,ph),x=lerp(C.cx-30,tx,u),y=lerp(C.cy+20,ty,u);ma_bead(ctx,x,y,19,an*u,0);}}
  const R=ag_rnd(11);for(let i=0;i<26;i++){const a0=R()*TAU,sp=0.2+R()*0.4,r0=40+R()*200,an=a0+t*sp*(i%2?1:-1),x=C.cx+Math.cos(an)*r0,y=C.cy+Math.sin(an)*r0*0.9;ctx.fillStyle="rgba(150,128,106,0.6)";ctx.beginPath();ctx.arc(x,y,4+(i%3)*1.5,0,TAU);ctx.fill();}
  for(let i=0;i<5;i++){const an=i*1.3+0.4,ph2=((t*0.25+i*0.21)%1),r=lerp(C.r+150,C.r-60,ph2),x=C.cx+Math.cos(an)*r,y=C.cy+Math.sin(an)*r;ctx.fillStyle="rgba(130,120,108,"+(0.7*(1-sstep(0.85,1,ph2)))+")";ctx.beginPath();ctx.arc(x,y,5,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- near Bristol, about 1950: a parquet floor, seen from above at a
   slant, and at the right the tortoise's hutch, a lamp glowing inside it */
const MA_BR={hutch:[1560,520]};
AG_PLACES.maBristol=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([150,116,84],1));g.addColorStop(1,rgba([176,138,102],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // parquet: herringbone blocks in a few tones
  const R=ag_rnd(1950);for(let y=-40;y<H+40;y+=30)for(let x=-60;x<W+60;x+=60){const o=(Math.floor(y/30)%2)*30,tone=mix([162,126,92],[176,140,102],R());c.fillStyle=rgba(tone,1);c.save();c.translate(x+o,y);c.rotate(0.785*((Math.floor(x/60)+Math.floor(y/30))%2?1:-1));c.fillRect(-30,-7.5,60,15);
    c.fillStyle="rgba(60,40,24,0.12)";c.fillRect(-30,6,60,1.5);c.restore();}
  ma_grain(c,0,0,W,H,2.4,52);g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,26,16,0.25)");g.addColorStop(1,"rgba(255,240,214,0.05)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the hutch: a wooden box, open in front, a lamp inside lighting the floor before it
  const [hx,hy]=MA_BR.hutch;g=c.createRadialGradient(hx-120,hy+90,10,hx-120,hy+90,520);g.addColorStop(0,"rgba(255,236,190,0.55)");g.addColorStop(1,"rgba(255,236,190,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  ma_shadowOf(c,k=>k.rect(hx-110,hy-140,330,260),"rgba(40,26,16,0.5)",30,-20,16);
  c.fillStyle=rgba([126,96,70],1);c.beginPath();c.moveTo(hx-110,hy-140);c.lineTo(hx+220,hy-140);c.lineTo(hx+220,hy+120);c.lineTo(hx-110,hy+120);c.closePath();c.fill();
  c.fillStyle=rgba([104,78,58],1);c.beginPath();c.moveTo(hx-110,hy-140);c.lineTo(hx-150,hy-110);c.lineTo(hx-150,hy+150);c.lineTo(hx-110,hy+120);c.closePath();c.fill();
  c.fillStyle=rgba([140,108,80],1);c.beginPath();c.moveTo(hx-150,hy-110);c.lineTo(hx+180,hy-110);c.lineTo(hx+220,hy-140);c.lineTo(hx-110,hy-140);c.closePath();c.fill();
  c.fillStyle=rgba([60,44,34],1);c.fillRect(hx-110,hy-60,230,180);
  g=c.createRadialGradient(hx+10,hy+10,6,hx+10,hy+10,140);g.addColorStop(0,"rgba(255,244,214,1)");g.addColorStop(0.2,"rgba(255,228,170,0.8)");g.addColorStop(1,"rgba(255,228,170,0)");c.fillStyle=g;c.fillRect(hx-110,hy-60,230,180);
  c.fillStyle=rgba([180,170,150],1);c.fillRect(hx-60,hy+96,130,10);c.fillStyle="rgba(255,250,236,0.5)";c.fillRect(hx-60,hy+96,130,3);};
/* the tortoise at (x, y), heading ang (0: right), from above at a slant: a clear shell over its works (two cells of battery, a motor),
   three wheels, and on top a light sensor in a small tube that turns as it looks about. o.t, o.look, o.charge 0..1 (a glow) */
function ma_tortoise(ctx,x,y,ang,o){o=o||{};const t=o.t||0,s=o.s||1.35;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ag_floorShadow(ctx,-16,40,150,44,0.4);
  const fx=Math.cos(ang),fy=Math.sin(ang)*0.5;
  ctx.fillStyle=rgba([40,40,44],1);for(const [wx,wy] of [[fx*90,fy*90+34],[-fy*110-fx*60,fx*50-fy*30+34],[fy*110-fx*60,-fx*50-fy*30+34]]){ctx.beginPath();ctx.ellipse(wx,wy,18,12,0,0,TAU);ctx.fill();}
  ctx.fillStyle=rgba([150,150,146],1);ctx.beginPath();ctx.ellipse(0,26,128,58,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.2)";ctx.beginPath();ctx.ellipse(10,18,120,48,0,Math.PI*1.1,TAU*0.98);ctx.fill();
  // the works under the shell
  ctx.fillStyle=rgba([84,76,70],1);rr(ctx,-62+fx*8,-10+fy*8,48,40,8);ctx.fill();rr(ctx,-6+fx*8,-10+fy*8,48,40,8);ctx.fill();ctx.fillStyle="rgba(255,240,214,0.25)";ctx.fillRect(-54+fx*8,-6+fy*8,8,32);ctx.fillRect(2+fx*8,-6+fy*8,8,32);
  ctx.fillStyle=rgba([120,104,86],1);ctx.beginPath();ctx.arc(60+fx*10,8+fy*10,20,0,TAU);ctx.fill();ctx.strokeStyle=rgba([196,150,96],0.8);ctx.lineWidth=2;for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(60+fx*10,8+fy*10,8+k*3,0,TAU);ctx.stroke();}
  // the clear shell: a dome with a bright rim of light along its top and a soft reflection
  const dome=k=>{k.moveTo(-120,18);k.bezierCurveTo(-122,-78,122,-78,120,18);k.ellipse(0,18,120,52,0,0,Math.PI);k.closePath();};ctx.beginPath();dome(ctx);ctx.fillStyle="rgba(214,226,234,0.32)";ctx.fill();
  const dg=ctx.createLinearGradient(-120,-60,120,30);dg.addColorStop(0,"rgba(255,255,255,0.05)");dg.addColorStop(0.7,"rgba(255,255,255,0.18)");dg.addColorStop(1,"rgba(255,255,255,0.35)");ctx.fillStyle=dg;ctx.fill();
  ctx.strokeStyle="rgba(150,160,170,0.55)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-120,18);ctx.bezierCurveTo(-122,-78,122,-78,120,18);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-104,-6);ctx.bezierCurveTo(-90,-52,40,-62,96,-24);ctx.stroke();ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(30,-44);ctx.quadraticCurveTo(70,-40,92,-18);ctx.stroke();
  ctx.strokeStyle="rgba(120,130,140,0.4)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,18,120,52,0,0,TAU);ctx.stroke();
  // the light sensor: a tube on a post, turning to look about
  const lk=o.look==null?Math.sin(t*2.2)*1.2:o.look;ctx.fillStyle=rgba([70,70,74],1);ctx.fillRect(-5,-86,10,40);ctx.save();ctx.translate(0,-92);ctx.rotate(lk);ctx.fillStyle=rgba([96,96,100],1);rr(ctx,-10,-12,40,24,6);ctx.fill();
  ctx.fillStyle=rgba([236,226,190],0.9);ctx.beginPath();ctx.ellipse(30,0,5,10,0,0,TAU);ctx.fill();ctx.restore();
  if(o.charge>0){const g=ctx.createRadialGradient(-10,10,4,-10,10,120);g.addColorStop(0,"rgba(255,236,190,"+(0.5*o.charge)+")");g.addColorStop(1,"rgba(255,236,190,0)");ctx.fillStyle=g;ctx.fillRect(-130,-110,260,240);}
  ctx.restore();}
// its trip, at time k (0..1): wandering on the floor, then, battery low, it turns to the hutch's light and goes in; returns [x, y, ang]
const MA_TRIP=[[260,820],[520,700],[700,820],[920,640],[860,460],[1060,380],[1280,470],[1420,560]];
function ma_tortoisePath(k){const S=ma_smooth(MA_TRIP,16),p=ma_along(S,clamp(k,0,1));return [p[0],p[1],p[2]];}

/* ---------------------------------------------------------------- a microscope's view: a bright round field in the dark eyepiece */
const MA_SC={cx:960,cy:540,r:470};
AG_PLACES.maScope=c=>{c.fillStyle=rgba([34,34,38],1);c.fillRect(0,0,W,H);const S=MA_SC;
  let g=c.createRadialGradient(S.cx+60,S.cy-60,20,S.cx,S.cy,S.r);g.addColorStop(0,rgba([246,242,232],1));g.addColorStop(0.8,rgba([232,226,212],1));g.addColorStop(1,rgba([206,198,184],1));c.fillStyle=g;c.beginPath();c.arc(S.cx,S.cy,S.r,0,TAU);c.fill();
  c.save();c.beginPath();c.arc(S.cx,S.cy,S.r,0,TAU);c.clip();ma_grain(c,S.cx-S.r,S.cy-S.r,S.r*2,S.r*2,2,88);const R=ag_rnd(21);for(let i=0;i<30;i++){const x=S.cx+(R()-0.5)*2*S.r,y=S.cy+(R()-0.5)*2*S.r;c.fillStyle="rgba(170,160,146,0.25)";c.beginPath();c.arc(x,y,2+R()*5,0,TAU);c.fill();}
  g=c.createRadialGradient(S.cx,S.cy,S.r*0.7,S.cx,S.cy,S.r);g.addColorStop(0,"rgba(30,30,34,0)");g.addColorStop(1,"rgba(30,30,34,0.45)");c.fillStyle=g;c.fillRect(S.cx-S.r,S.cy-S.r,S.r*2,S.r*2);c.restore();
  c.strokeStyle="rgba(20,20,24,0.9)";c.lineWidth=16;c.beginPath();c.arc(S.cx,S.cy,S.r+6,0,TAU);c.stroke();};
/* a xenobot: a tiny body of frog skin and heart cells, a soft rounded lump, lit from the upper right, its cells showing as small
   bumps; o.c: C-shaped, open on its front, as the ones that gathered cells; o.cut 0..1 a notch, healing as it falls to 0 */
function ma_xeno(ctx,x,y,r,ang,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(ang);const sh=k=>{if(o.c){k.moveTo(r*0.9,-r*0.34);k.bezierCurveTo(r*0.4,-r*1.1,-r*1.1,-r*0.9,-r*1.0,0);
      k.bezierCurveTo(-r*1.1,r*0.9,r*0.4,r*1.1,r*0.9,r*0.34);k.bezierCurveTo(r*0.2,r*0.4,r*0.2,-r*0.4,r*0.9,-r*0.34);k.closePath();}
    else{const cut=o.cut||0;k.moveTo(r,0);for(let a=0.1;a<=TAU+0.01;a+=0.1){const notch=cut*Math.exp(-Math.pow((a-1.0)/0.25,2))*r*0.5,rr0=r*(1+0.08*Math.sin(a*3+1))-notch;k.lineTo(Math.cos(a)*rr0,Math.sin(a)*rr0*0.86);}k.closePath();}};
  ag_soft(ctx,sh,[214,176,156],[238,214,198],r*0.3,-r*0.4,r*1.1,"rgba(120,80,60,0.35)",r*0.25,0.7);
  ctx.save();ctx.beginPath();sh(ctx);ctx.clip();ctx.fillStyle="rgba(150,104,86,0.18)";const R=ag_rnd(5);for(let i=0;i<26;i++){ctx.beginPath();ctx.arc((R()-0.5)*2*r,(R()-0.5)*2*r,r*0.12+R()*r*0.06,0,TAU);ctx.fill();}ctx.restore();
  ctx.strokeStyle="rgba(170,130,110,0.5)";ctx.lineWidth=1.4;for(let a=0;a<TAU;a+=0.3){const ex=Math.cos(a)*r*1.02,ey=Math.sin(a)*r*0.88,w=Math.sin((o.t||0)*20+a*5)*4;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+Math.cos(a)*6+w,ey+Math.sin(a)*6);ctx.stroke();}
  ctx.restore();}
// a loose cell: a small pale sphere
function ma_looseCell(ctx,x,y,r){ctx.fillStyle=rgba([222,194,176],1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,248,240,0.5)";ctx.beginPath();ctx.arc(x+r*0.3,y-r*0.3,r*0.4,0,TAU);ctx.fill();}
/* the view at work, live. mode 0: bodies swimming, one cut that heals (heal 0..1); mode 1: C-shaped bodies sweeping loose cells into
   piles, one pile rounding into a new body (grow 0..1) */
function ma_scopeLive(ctx,t,o){o=o||{};const S=MA_SC;ctx.save();ctx.beginPath();ctx.arc(S.cx,S.cy,S.r-4,0,TAU);ctx.clip();
  if(!o.mode){const B=[[0,0.06,150],[2.1,0.05,110],[4.2,0.07,96]];B.forEach(([a0,sp,r],i)=>{const a=a0+t*sp,x=S.cx+Math.cos(a)*(170+i*40),y=S.cy+Math.sin(a*1.3)*(130+i*30),dir=a+Math.PI/2;
      ma_xeno(ctx,x,y,r,dir,{t,cut:i===0?1-(o.heal||0):0});});}
  else{const R=ag_rnd(4);for(let i=0;i<90;i++){const x=S.cx+(R()-0.5)*820,y=S.cy+(R()-0.5)*820,swept=R()<0.5&&o.grow>0;if(Math.hypot(x-S.cx,y-S.cy)>S.r-20)continue;
      const tx=S.cx+150+(R()-0.5)*60,ty=S.cy+60+(R()-0.5)*60,k=swept?sstep(0,0.7,o.grow):0;ma_looseCell(ctx,lerp(x,tx,k),lerp(y,ty,k),8);}
    ma_xeno(ctx,S.cx-120+Math.cos(t*0.3)*60,S.cy-80+Math.sin(t*0.4)*40,110,0.4+t*0.08,{t,c:true});ma_xeno(ctx,S.cx+260-Math.sin(t*0.25)*50,S.cy-200,90,2.6-t*0.06,{t,c:true});
    if(o.grow>0.6)ma_xeno(ctx,S.cx+150,S.cy+60,44*sstep(0.6,1,o.grow)+8,0,{t});}
  ctx.restore();}
