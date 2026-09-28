/* ===== Both at once: the film's own pictures =====
   A brass cash register from 1879; the app's database and the lakehouse, with the night between them; a store of rows (horizontal
   stripes, blue: built to write) and a store of columns (vertical stripes, green: built to read); a change log whose entries carry
   the key of the row they change; data flowing back to the app (magenta). The labs and the scenarios draw with these too. */
const BO_W=[110,190,255],BO_R=[120,225,170],BO_M=[255,120,210],BO_ACC=[120,212,220],BO_BRASS=[226,184,104],BO_AMB=[255,190,90];
const BO_BR=[[250,220,150],[150,104,44]];
// each row's key has its own colour and teeth, so a change can be matched to the row it changes
const BO_KEYC={"A-1042":[255,209,102],"L-207":[190,160,255],"A-1041":[255,160,120],"A-0981":[140,220,255]};
const bo_kc=id=>BO_KEYC[id]||[200,215,235];

/* ---------- small shapes ---------- */
// a key: a round bow, a shaft and teeth cut to the key's id
function bo_key(ctx,x,y,s,id,a,hi){if(a!=null&&a<=0.01)return;const col=bo_kc(id);withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  if(hi)glow(ctx,0,0,30,col,0.6*hi);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=6;
  ctx.beginPath();ctx.arc(-9,0,6.5,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(-2.5,0);ctx.lineTo(14,0);ctx.stroke();
  let hsh=0;for(let i=0;i<id.length;i++)hsh+=id.charCodeAt(i)*(i+1);ctx.lineWidth=2.2;[0,1,2].forEach(k=>{const hh=2.5+((hsh>>(k*2))%3)*1.6;ctx.beginPath();ctx.moveTo(5+k*4,0);ctx.lineTo(5+k*4,hh);ctx.stroke();});
  ctx.restore();});}
// a crescent moon (cached), a sun, an hourglass
const BO_SPR={};
function bo_moon(ctx,x,y,r,a){if(a<=0.01)return;if(!BO_SPR.moon){const c=mkCanvas(128,128),m=c.getContext("2d");m.fillStyle="#e8eefc";m.beginPath();m.arc(64,64,54,0,TAU);m.fill();m.globalCompositeOperation="destination-out";m.beginPath();m.arc(92,50,50,0,TAU);m.fill();BO_SPR.moon=c;}
  withA(ctx,a,()=>{glow(ctx,x,y,r*2.6,[170,190,255],0.35);ctx.drawImage(BO_SPR.moon,x-r*1.18,y-r*1.18,r*2.36,r*2.36);});}
function bo_sun(ctx,x,y,r,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*3.2,[255,210,120],0.5);ctx.save();ctx.strokeStyle="rgba(255,214,130,0.9)";ctx.lineWidth=3;ctx.lineCap="round";
  for(let i=0;i<12;i++){const an=i/12*TAU+t*0.15;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*1.35,y+Math.sin(an)*r*1.35);ctx.lineTo(x+Math.cos(an)*r*1.75,y+Math.sin(an)*r*1.75);ctx.stroke();}
  const g=ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r);g.addColorStop(0,"#fff6dc");g.addColorStop(1,"#ffc45c");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();});}
function bo_hourglass(ctx,x,y,s,t,col,a){if(a<=0.01)return;const c=col||BO_AMB,u=(t%4)/4;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle=rgba(c,0.85);ctx.beginPath();ctx.moveTo(-14*(1-u),-22+22*u);ctx.lineTo(14*(1-u),-22+22*u);ctx.lineTo(0,-2);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-15,22);ctx.lineTo(15,22);ctx.lineTo(15*u*0.9,22-18*u);ctx.lineTo(-15*u*0.9,22-18*u);ctx.closePath();ctx.fill();ctx.fillRect(-1,-2,2,24);
  ctx.strokeStyle=rgba(c,1);ctx.lineWidth=2.4;ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(-18,-26);ctx.lineTo(18,-26);ctx.moveTo(-18,26);ctx.lineTo(18,26);
  ctx.moveTo(-15,-26);ctx.quadraticCurveTo(-15,-6,0,0);ctx.quadraticCurveTo(15,-6,15,-26);ctx.moveTo(-15,26);ctx.quadraticCurveTo(-15,6,0,0);ctx.quadraticCurveTo(15,6,15,26);ctx.stroke();ctx.restore();});}
// a flag on a pole
function bo_flag(ctx,x,y,s,col,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(INK,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,20);ctx.lineTo(0,-24);ctx.stroke();
  const w=Math.sin((t||0)*3)*2;ctx.fillStyle=rgba(col,0.95);ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(1,-24);ctx.quadraticCurveTo(12,-28+w,24,-22);ctx.lineTo(24,-6);ctx.quadraticCurveTo(12,-12+w,1,-8);ctx.closePath();ctx.fill();ctx.restore();}
// a padlock
function bo_lock(ctx,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=8;ctx.beginPath();ctx.arc(0,-8,9,Math.PI,0);ctx.lineTo(9,0);ctx.moveTo(-9,0);ctx.lineTo(-9,-8);ctx.stroke();
  rr(ctx,-14,0,28,22,4);ctx.fillStyle=rgba(col,0.25);ctx.fill();ctx.stroke();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(0,10,3,0,TAU);ctx.fill();ctx.restore();}
// a strike through a thing that goes away
function bo_strike(ctx,x0,y0,x1,y1,p,col,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{ctx.strokeStyle=rgba(col||INK,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,clamp(p,0,1)),lerp(y0,y1,clamp(p,0,1)));ctx.stroke();});}
// a dimension line: two end ticks and a label, for a distance
function bo_span(ctx,x0,x1,y,col,label,a,p){if(a<=0.01)return;const q=p==null?1:p,xm=(x0+x1)/2,hw=(x1-x0)/2*q;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.6;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(xm-hw,y);ctx.lineTo(xm+hw,y);[xm-hw,xm+hw].forEach(x=>{ctx.moveTo(x,y-16);ctx.lineTo(x,y+16);});ctx.stroke();
  ctx.fillStyle=rgba(col,1);[[xm-hw,1],[xm+hw,-1]].forEach(([x,d])=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+d*16,y-8);ctx.lineTo(x+d*16,y+8);ctx.closePath();ctx.fill();});ctx.restore();
  if(label&&q>0.9)tag(ctx,xm,y,label,col,{align:"center",size:24});});}

/* ---------- 1879: the saloon and the register ---------- */
function bo_saloon(ctx,t){
  // a mirror and shelves behind the bar, bottles catching the lamp light
  ctx.save();const mg=ctx.createLinearGradient(0,120,0,560);mg.addColorStop(0,"rgba(60,44,30,0.55)");mg.addColorStop(1,"rgba(30,20,14,0.55)");ctx.fillStyle=mg;rr(ctx,800,110,760,470,16);ctx.fill();
  ctx.strokeStyle=metal(ctx,800,110,1560,580,MET.wood);ctx.lineWidth=14;rr(ctx,800,110,760,470,16);ctx.stroke();ctx.strokeStyle=rgba(BO_BRASS,0.45);ctx.lineWidth=2;rr(ctx,812,122,736,446,10);ctx.stroke();
  [[1600,1880,300],[1600,1880,470],[40,720,640]].forEach(([x0,x1,y],k)=>{if(k===2)return;ctx.fillStyle=metal(ctx,x0,y,x0,y+14,MET.wood);ctx.fillRect(x0,y,x1-x0,14);
    for(let i=0;i<7;i++){const bx=x0+22+i*38,bh=70+hash(i+k*9,3)*40,bc=[[120,170,110],[170,110,60],[200,160,90],[110,120,160]][(i+k)%4];
      ctx.fillStyle=rgba(bc,0.55);rr(ctx,bx-10,y-bh+22,20,bh-22,5);ctx.fill();ctx.fillRect(bx-4,y-bh,8,24);glow(ctx,bx-3,y-bh*0.55,16,[255,210,150],0.18+0.06*Math.sin(t*1.3+i));}});
  ctx.restore();
  // a hanging lamp
  ctx.save();ctx.strokeStyle="rgba(120,90,60,0.7)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1180,0);ctx.lineTo(1180,20);ctx.stroke();ctx.fillStyle=metal(ctx,1150,20,1210,54,BO_BR);ctx.beginPath();ctx.moveTo(1150,54);ctx.lineTo(1165,20);ctx.lineTo(1195,20);ctx.lineTo(1210,54);ctx.closePath();ctx.fill();glow(ctx,1180,62,120,[255,210,140],0.45+0.04*Math.sin(t*3.1));ctx.restore();}
function bo_counter(ctx){ctx.save();ctx.fillStyle=metal(ctx,0,700,0,730,[[176,120,74],[96,58,30]]);ctx.fillRect(0,700,W,30);ctx.fillStyle="rgba(255,230,190,0.35)";ctx.fillRect(0,700,W,3);
  const g=ctx.createLinearGradient(0,730,0,H);g.addColorStop(0,"#3a2414");g.addColorStop(1,"#1a0f08");ctx.fillStyle=g;ctx.fillRect(0,730,W,H-730);
  ctx.strokeStyle="rgba(120,80,46,0.6)";ctx.lineWidth=3;for(let x=40;x<W;x+=240){rr(ctx,x,770,200,260,10);ctx.stroke();}
  ctx.strokeStyle=metal(ctx,0,1010,0,1024,BO_BR);ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,1020);ctx.lineTo(W,1020);ctx.stroke();ctx.restore();}
// a wall clock: its hands at hour h (0..12, fractional)
function bo_clock(ctx,x,y,r,h){ctx.save();ctx.fillStyle=metal(ctx,x-r,y-r,x+r,y+r,MET.wood);ctx.beginPath();ctx.arc(x,y,r+10,0,TAU);ctx.fill();ctx.fillStyle="#efe4cc";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(60,40,24,0.9)";ctx.lineWidth=2;for(let i=0;i<12;i++){const an=i/12*TAU;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.8,y+Math.sin(an)*r*0.8);ctx.lineTo(x+Math.cos(an)*r*0.92,y+Math.sin(an)*r*0.92);ctx.stroke();}
  const ha=h/12*TAU-Math.PI/2,ma=(h%1)*TAU-Math.PI/2;ctx.lineCap="round";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ha)*r*0.5,y+Math.sin(ha)*r*0.5);ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ma)*r*0.78,y+Math.sin(ma)*r*0.78);ctx.stroke();
  ctx.fillStyle="rgba(60,40,24,1)";ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();ctx.restore();}
/* the cash register, drawn with its base centred at (x,y). o.press: [key index, 0..1]; o.tab: the amount shown in the window, o.pop 0..1;
   o.total: the day's total in cents, shown by the dial's hands and the counter below it; o.hi: a glow round the whole machine */
const BO_KEYS=["5¢","10¢","15¢","25¢","50¢","$1"];
function bo_register(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  if(o.hi)glow(ctx,0,-250,360,BO_BRASS,0.25*o.hi);
  // the drawer
  ctx.fillStyle=metal(ctx,0,-100,0,0,MET.wood);rr(ctx,-190,-100,380,100,8);ctx.fill();ctx.fillStyle=metal(ctx,0,-108,0,-96,BO_BR);ctx.fillRect(-196,-108,392,12);
  ctx.strokeStyle="rgba(40,22,10,0.8)";ctx.lineWidth=2;rr(ctx,-160,-82,320,64,6);ctx.stroke();ctx.fillStyle=metal(ctx,-20,-60,20,-40,BO_BR);ctx.beginPath();ctx.arc(0,-50,12,0,TAU);ctx.fill();ctx.fillStyle="#2a1a0c";ctx.fillRect(-2,-56,4,10);
  // the body
  ctx.fillStyle=metal(ctx,-170,-360,170,-108,BO_BR);ctx.beginPath();ctx.moveTo(-172,-108);ctx.lineTo(-150,-360);ctx.lineTo(150,-360);ctx.lineTo(172,-108);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(110,70,24,0.55)";ctx.lineWidth=2.4;[[-1],[1]].forEach(([d])=>{ctx.beginPath();ctx.moveTo(d*120,-340);ctx.bezierCurveTo(d*150,-300,d*96,-280,d*130,-230);ctx.bezierCurveTo(d*150,-200,d*110,-180,d*140,-150);ctx.stroke();});
  ctx.strokeStyle="rgba(255,240,200,0.35)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-148,-352);ctx.lineTo(148,-352);ctx.stroke();
  // the dial: a clock face for the total, cents on the long hand, dollars on the short one
  const tot=o.total||0,cx=0,cy=-272,R=54;ctx.fillStyle="#f3ead4";ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();ctx.strokeStyle=metal(ctx,-R,cy-R,R,cy+R,BO_BR);ctx.lineWidth=7;ctx.stroke();
  ctx.strokeStyle="rgba(60,40,20,0.85)";ctx.lineWidth=1.6;for(let i=0;i<20;i++){const an=i/20*TAU-Math.PI/2,r0=i%5?R*0.8:R*0.68;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);ctx.lineTo(cx+Math.cos(an)*R*0.9,cy+Math.sin(an)*R*0.9);ctx.stroke();}
  const ca=(tot%100)/100*TAU-Math.PI/2,da=(tot/100)/50*TAU-Math.PI/2;ctx.lineCap="round";ctx.strokeStyle="rgba(40,26,14,0.95)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(da)*R*0.46,cy+Math.sin(da)*R*0.46);ctx.stroke();
  ctx.strokeStyle="rgba(170,40,30,0.95)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ca)*R*0.8,cy+Math.sin(ca)*R*0.8);ctx.stroke();ctx.fillStyle=metal(ctx,-6,cy-6,6,cy+6,BO_BR);ctx.beginPath();ctx.arc(cx,cy,6,0,TAU);ctx.fill();
  if(o.dialHi)glow(ctx,cx,cy,90,BO_R,0.35*o.dialHi);
  // the counter under the dial: the day's total so far
  rr(ctx,-74,-206,148,34,6);ctx.fillStyle="#1c120a";ctx.fill();ctx.strokeStyle=metal(ctx,-74,-206,74,-172,BO_BR);ctx.lineWidth=3;ctx.stroke();
  T(ctx,"$"+(tot/100).toFixed(2),0,-180,{f:"mono",w:500,size:24,align:"center",color:o.totHi?"rgba(160,255,200,1)":"rgba(255,226,170,0.95)"});
  // the keys
  BO_KEYS.forEach((k,i)=>{const kx=-125+i*50,pr=o.press&&o.press[0]===i?o.press[1]:0,ky=-138+8*pr;ctx.strokeStyle="rgba(90,60,24,0.9)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(kx,ky);ctx.lineTo(kx,-112);ctx.stroke();
    if(pr>0)glow(ctx,kx,ky,40,BO_W,0.6*pr);ctx.fillStyle="#f2ead8";ctx.beginPath();ctx.arc(kx,ky,19,0,TAU);ctx.fill();ctx.strokeStyle=metal(ctx,kx-19,ky-19,kx+19,ky+19,BO_BR);ctx.lineWidth=4;ctx.stroke();
    T(ctx,k,kx,ky+5,{w:800,size:k.length>2?13:15,align:"center",color:"rgba(40,26,14,0.95)"});});
  if(o.keysHi)glow(ctx,0,-138,170,BO_W,0.3*o.keysHi);
  // the window on top, where each sale pops up
  ctx.fillStyle=metal(ctx,-112,-446,112,-360,BO_BR);rr(ctx,-112,-446,224,90,10);ctx.fill();rr(ctx,-96,-434,192,68,6);ctx.fillStyle="#140c06";ctx.fill();
  if(o.tab){ctx.save();rr(ctx,-96,-434,192,68,6);ctx.clip();const ty=lerp(-360,-428,ease(clamp(o.pop==null?1:o.pop,0,1)));ctx.fillStyle="#fbf5e6";rr(ctx,-58,ty,116,56,4);ctx.fill();ctx.fillStyle="rgba(170,40,30,0.9)";ctx.fillRect(-58,ty,116,6);
    T(ctx,o.tab,0,ty+42,{w:800,size:30,align:"center",color:"rgba(30,20,12,0.95)"});ctx.restore();}
  if(o.tabHi)glow(ctx,0,-400,130,BO_W,0.35*o.tabHi);
  // the crown
  ctx.fillStyle=metal(ctx,-120,-520,120,-446,BO_BR);ctx.beginPath();ctx.moveTo(-124,-446);ctx.bezierCurveTo(-110,-490,-50,-500,0,-522);ctx.bezierCurveTo(50,-500,110,-490,124,-446);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(110,70,24,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-80,-458);ctx.bezierCurveTo(-60,-486,-20,-490,0,-504);ctx.bezierCurveTo(20,-490,60,-486,80,-458);ctx.stroke();
  T(ctx,"CASH",0,-462,{w:800,size:18,align:"center",color:"rgba(90,56,18,0.95)"});ctx.restore();}
// a patent, on paper, with a line drawing of the machine
function bo_patent(ctx,x,y,w,h,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||-0.03);ctx.translate(-w/2,-h/2);
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=26;ctx.fillStyle="#efe4c8";ctx.fillRect(0,0,w,h);ctx.shadowBlur=0;ctx.strokeStyle="rgba(120,90,50,0.5)";ctx.lineWidth=2;ctx.strokeRect(10,10,w-20,h-20);
  T(ctx,"PATENT · 1879",w/2,54,{w:800,size:26,align:"center",color:"rgba(60,40,24,0.95)"});T(ctx,"a machine to record each sale",w/2,88,{w:600,size:21,align:"center",color:"rgba(90,66,40,0.95)"});
  ctx.save();ctx.translate(w/2,h-40);ctx.scale(0.44,0.44);ctx.strokeStyle="rgba(60,44,30,0.8)";ctx.lineWidth=3;ctx.strokeRect(-190,-100,380,100);ctx.beginPath();ctx.moveTo(-172,-108);ctx.lineTo(-150,-360);ctx.lineTo(150,-360);ctx.lineTo(172,-108);ctx.closePath();ctx.stroke();
  ctx.beginPath();ctx.arc(0,-272,54,0,TAU);ctx.stroke();for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(-125+i*50,-138,19,0,TAU);ctx.stroke();}ctx.strokeRect(-112,-446,224,86);
  ctx.beginPath();ctx.moveTo(-230,-300);ctx.lineTo(-160,-272);ctx.moveTo(230,-400);ctx.lineTo(112,-400);ctx.stroke();T(ctx,"A",-250,-300,{w:700,size:30,align:"center",color:"rgba(60,44,30,0.9)"});T(ctx,"B",256,-392,{w:700,size:30,align:"center",color:"rgba(60,44,30,0.9)"});ctx.restore();
  ctx.restore();});}

/* ---------- the present: stores, the app, the lakehouse ---------- */
/* a store of data: kind "rows" draws horizontal stripes (built to write), "cols" vertical stripes (built to read).
   o: col, title, sub, a, hi, n (stripes), p (how many are filled, 0..1), t (for a gentle shimmer), lab (a label per stripe) */
function bo_store(ctx,x,y,w,h,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||(kind==="rows"?BO_W:BO_R),hi=o.hi||0,t=o.t||0;
  withA(ctx,a,()=>{if(hi)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.75,col,0.22*hi);glass(ctx,x,y,w,h,18,col,{glow:16+14*hi,ea:0.75+0.25*hi,fill:"rgba(7,12,24,0.93)"});
    let top=y+22;if(o.title){T(ctx,o.title,x+22,y+42,{w:800,size:o.ts||26,color:rgba(col,1)});top=y+60;}if(o.sub){T(ctx,o.sub,x+22,y+44+(o.ss||18)*1.4,{w:600,size:o.ss||18,color:rgba(SOFT,1)});top=y+60+(o.ss||18)*1.5;}
    const pad=18,n=o.n||(kind==="rows"?6:6),p=o.p==null?1:o.p;
    if(kind==="rows"){const gap=8,sh=Math.min(34,(y+h-pad-top-(n-1)*gap)/n);for(let i=0;i<n;i++){const yy=top+i*(sh+gap),f=clamp(p*n-i,0,1);if(f<=0){ctx.strokeStyle=rgba(col,0.14);ctx.lineWidth=1;rr(ctx,x+pad,yy,w-2*pad,sh,6);ctx.stroke();continue;}
        withA(ctx,f,()=>{ctx.fillStyle=rgba(col,0.16+0.06*Math.sin(t*1.5+i));rr(ctx,x+pad,yy,w-2*pad,sh,6);ctx.fill();const cells=4,cw=(w-2*pad-16)/cells;for(let k=0;k<cells;k++){ctx.fillStyle=rgba(col,0.45+0.4*hash(i*7+k,kind.length));rr(ctx,x+pad+8+k*cw,yy+sh*0.3,cw-10,sh*0.4,3);ctx.fill();}});}}
    else{const gap=10,sw=Math.min(40,(w-2*pad-(n-1)*gap)/n),span=n*sw+(n-1)*gap,x0=x+(w-span)/2;for(let i=0;i<n;i++){const xx=x0+i*(sw+gap),f=clamp(p*n-i,0,1);if(f<=0){ctx.strokeStyle=rgba(col,0.14);ctx.lineWidth=1;rr(ctx,xx,top,sw,y+h-pad-top,6);ctx.stroke();continue;}
        withA(ctx,f,()=>{ctx.fillStyle=rgba(col,0.16+0.06*Math.sin(t*1.5+i));rr(ctx,xx,top,sw,y+h-pad-top,6);ctx.fill();const cells=Math.max(3,Math.floor((y+h-pad-top)/30)),ch=(y+h-pad-top-12)/cells;for(let k=0;k<cells;k++){ctx.fillStyle=rgba(col,0.45+0.4*hash(i*7+k,kind.length+3));rr(ctx,xx+sw*0.28,top+8+k*ch,sw*0.44,ch-8,3);ctx.fill();}});}}});}
// the app, on a phone: o.screen "issue" (issuing an award), "wallet" (progress towards a certificate), "suggest" (the next microcredential)
function bo_phone(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  glass(ctx,-62,-120,124,240,22,o.edge||[170,205,255],{fill:"rgba(10,18,36,0.95)",glow:18,ea:0.75});rr(ctx,-52,-102,104,200,12);ctx.fillStyle="rgba(40,70,130,0.3)";ctx.fill();ctx.beginPath();ctx.arc(0,-110,3.5,0,TAU);ctx.fillStyle="rgba(200,220,255,0.8)";ctx.fill();
  const scr=o.screen||"issue";
  if(scr==="issue"){T(ctx,"Awards",0,-74,{w:800,size:15,align:"center"});ctx.fillStyle="rgba(160,190,240,0.22)";for(let i=0;i<3;i++){rr(ctx,-40,-54+i*20,80,12,4);ctx.fill();}
    rr(ctx,-40,30,80,30,15);ctx.fillStyle=o.press?rgba(mix(BO_W,[255,255,255],0.4),1):rgba(BO_W,0.9);ctx.fill();T(ctx,"Issue",0,50,{w:800,size:14,align:"center",color:"#0a1020"});}
  else if(scr==="wallet"){T(ctx,"My wallet",0,-76,{w:800,size:14,align:"center"});T(ctx,"Graduate certificate",0,-52,{w:600,size:10.5,align:"center",color:rgba(SOFT,1)});
    for(let i=0;i<4;i++){const on=i<(o.n==null?2:o.n);ctx.fillStyle=on?rgba(TRUST,0.9):"rgba(160,190,240,0.12)";rr(ctx,-42+i*22,-36,18,26,4);ctx.fill();if(!on){ctx.strokeStyle="rgba(160,190,240,0.4)";ctx.lineWidth=1;rr(ctx,-42+i*22,-36,18,26,4);ctx.stroke();}}
    T(ctx,(o.n==null?2:o.n)+" of 4",0,16,{w:800,size:20,align:"center",color:rgba(TRUST,1)});T(ctx,"microcredentials",0,34,{w:600,size:10.5,align:"center",color:rgba(SOFT,1)});}
  else if(scr==="suggest"){T(ctx,"Next for you",0,-76,{w:800,size:13,align:"center",color:rgba(SOFT,1)});const sa=o.sa==null?1:o.sa;
    withA(ctx,sa,()=>{glass(ctx,-46,-60,92,96,10,BO_M,{glow:10+8*(o.hi||0),ea:0.9,fill:"rgba(30,10,30,0.9)"});T(ctx,"Data",0,-30,{w:800,size:16,align:"center"});T(ctx,"Ethics",0,-12,{w:800,size:16,align:"center"});T(ctx,"micro-",0,10,{w:600,size:10.5,align:"center",color:rgba(BO_M,1)});T(ctx,"credential",0,24,{w:600,size:10.5,align:"center",color:rgba(BO_M,1)});});
    rr(ctx,-40,52,80,28,14);ctx.fillStyle=rgba(BO_M,0.85*sa);ctx.fill();T(ctx,"Enrol",0,71,{w:800,size:13,align:"center",color:"#1a0a18"});}
  ctx.restore();});}
// the lakehouse: bronze, silver and gold vaults in one frame. o.a, o.lit (0..1 each, how refined the data has become), o.frame (label)
function bo_lake(ctx,x,y,vw,vh,gap,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lit=o.lit||[1,1,1],K=["bronze","silver","gold"],N=["Bronze","Silver","Gold"],S=["as it arrived","cleaned, joined","ready to read"];
  withA(ctx,a,()=>{const fw=3*vw+2*gap+40;if(o.frame!==false){ctx.save();ctx.strokeStyle="rgba(170,200,245,0.28)";ctx.lineWidth=1.6;ctx.setLineDash([10,8]);rr(ctx,x-20,y-44,fw,vh+64,24);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      tag(ctx,x+fw/2-20,y-44,o.frame||"the lakehouse",[214,228,255],{align:"center",size:20});}
    K.forEach((k,i)=>{const vx=x+i*(vw+gap),l=clamp(lit[i],0,1),col=LAYER[k];withA(ctx,0.35+0.65*l,()=>{vault(ctx,vx,y,vw,vh,col,(r,c)=>l*((r*7+c)%5)<0.5?null:(hash(r*9+c,i+2)<0.4+0.5*l?col:null),null);
      chip(ctx,vx+vw/2,y+62,null,N[i],o.subs===false?null:S[i],{align:"center",edge:col});});});});}
// an answer, for someone who reads: a small chart on a card
function bo_answer(ctx,x,y,w,h,title,sub,col,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.93)"});T(ctx,title,x+22,y+40,{w:800,size:24,color:rgba(col,1)});if(sub)T(ctx,sub,x+22,y+68,{w:600,size:18,color:rgba(SOFT,1)});
  bars(ctx,x+24,y+84,w-48,h-104,t,col,6);});}
// a change in the log: its place in the order, what it does, and the key of the row it changes
function bo_change(ctx,x,y,w,n,text,id,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[214,228,255],hi=o.hi||0;
  withA(ctx,a,()=>{if(hi)glow(ctx,x+w/2,y+28,w*0.6,col,0.3*hi);glass(ctx,x,y,w,56,14,o.bad?BAD:col,{glow:10+12*hi,ea:0.6+0.4*hi,fill:"rgba(7,12,24,0.94)",lw:o.dash?1.2:1.6});
    ctx.fillStyle=rgba(o.bad?BAD:col,0.9);ctx.beginPath();ctx.arc(x+30,y+28,17,0,TAU);ctx.fill();T(ctx,String(n),x+30,y+36,{w:800,size:21,align:"center",color:"#0a1020"});
    T(ctx,text,x+58,y+37,{w:700,size:o.fs||25,color:rgba(o.bad?BAD:INK,1)});if(id)bo_key(ctx,x+w-36,y+28,1.3,id,1,o.keyHi||0);});}
// a table row, as the app stores it: a key and its values, drawn as one horizontal stripe
function bo_row(ctx,x,y,w,id,vals,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||BO_W,fs=o.fs||21,h=o.h||44;withA(ctx,a,()=>{if(o.hi)glow(ctx,x+w/2,y+h/2,Math.min(w*0.4,150),o.hiCol||col,0.22*Math.min(1,o.hi));
  ctx.fillStyle=rgba(o.bad?BAD:col,0.14+0.1*(o.hi||0));rr(ctx,x,y,w,h,8);ctx.fill();ctx.strokeStyle=rgba(o.bad?BAD:col,0.35+0.5*(o.hi||0));ctx.lineWidth=1.4;rr(ctx,x,y,w,h,8);ctx.stroke();
  const ty=y+h/2+fs*0.36;bo_key(ctx,x+24,y+h/2,1.15,id,1,o.keyHi||0);T(ctx,id,x+48,ty,{f:"mono",w:500,size:fs,color:rgba(bo_kc(id),1)});let cx=x+48+tw(ctx,id,fs,500,"mono")+20;
  vals.forEach((v,i)=>{const vc=o.vc&&o.vc[i];T(ctx,v,cx,ty,{f:"mono",w:500,size:fs,color:vc?rgba(vc,1):rgba(INK,0.9)});cx+=tw(ctx,v,fs,500,"mono")+20;});});}
// a column, as the reading side stores it: a name and its values, stacked in one vertical stripe
function bo_colStripe(ctx,x,y,w,h,name,vals,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||BO_R,fs=o.fs||19,gap=o.gap||52;withA(ctx,a,()=>{ctx.fillStyle=rgba(col,0.12);rr(ctx,x,y,w,h,8);ctx.fill();ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.4;rr(ctx,x,y,w,h,8);ctx.stroke();
  T(ctx,name,x+w/2,y+30,{w:700,size:20,align:"center",color:rgba(col,1)});vals.forEach((v,i)=>{if(!v)return;const vy=y+54+i*gap,va=v.a==null?1:v.a;if(va<=0.01)return;withA(ctx,va,()=>{if(v.hi)glow(ctx,x+w/2,vy+14,w*0.7,v.hc||col,0.35*v.hi);
    if(v.key){bo_key(ctx,x+20,vy+14,1.1,v.key,1,v.keyHi||0);T(ctx,v.key,x+40,vy+21,{f:"mono",w:500,size:fs-1,color:rgba(bo_kc(v.key),1)});}else T(ctx,v.t,x+w/2,vy+21,{f:"mono",w:500,size:fs,align:"center",color:v.c?rgba(v.c,1):rgba(INK,0.92)});});});});}
// a ghost: an award that should be gone, back to life
function bo_ghost(ctx,x,y,w,h,t,a,text,sub){if(a<=0.01)return;withA(ctx,a,()=>{const wob=Math.sin(t*5)*3;glow(ctx,x+w/2,y+h/2,w*0.8,BAD,0.35+0.1*Math.sin(t*4));ctx.save();ctx.translate(0,wob);
  ctx.fillStyle="rgba(60,10,16,0.75)";ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+20);ctx.quadraticCurveTo(x,y,x+20,y);ctx.lineTo(x+w-20,y);ctx.quadraticCurveTo(x+w,y,x+w,y+20);ctx.lineTo(x+w,y+h);
  for(let i=0;i<5;i++){const xx=x+w-(i+0.5)*w/5;ctx.quadraticCurveTo(xx+w/20,y+h-14,xx,y+h+(i%2?0:-8));}ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(BAD,0.95);ctx.lineWidth=2.4;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);
  T(ctx,text||"A-1042 · issued",x+w/2,y+h/2,{w:800,size:22,align:"center",color:rgba([255,200,200],1)});if(sub)T(ctx,sub,x+w/2,y+h/2+28,{w:600,size:17,align:"center",color:rgba(BAD,1)});ctx.restore();});}
// a calendar card: a title band, a date, and what the date is
function bo_cal(ctx,x,y,title,date,sub,col,a,hi){withA(ctx,a==null?1:a,()=>{glass(ctx,x,y,300,112,14,col,{glow:12+14*(hi||0),ea:0.7,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.9);rr(ctx,x,y,300,30,14);ctx.fill();ctx.fillStyle="rgba(7,12,24,0.94)";ctx.fillRect(x,y+22,300,10);
  T(ctx,title,x+150,y+22,{w:800,size:16,align:"center",color:"#0a1020"});T(ctx,date,x+150,y+76,{w:800,size:30,align:"center",color:rgba(col,1)});if(sub)T(ctx,sub,x+150,y+102,{w:600,size:15,align:"center",color:rgba(SOFT,1)});});}
// a card with a question on it, numbered
function bo_qcard(ctx,x,y,w,n,text,col,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{const lines=wrapT(ctx,text,0,0,w-90,{size:22,w:700,measure:true}),h=Math.max(76,lines.length*29+34);
  if(hi)glow(ctx,x+w/2,y+h/2,w*0.6,col,0.22*hi);glass(ctx,x,y,w,h,16,col,{glow:10+12*(hi||0),ea:0.45+0.5*(hi||0),fill:"rgba(7,12,24,0.93)"});
  ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.arc(x+36,y+h/2,18,0,TAU);ctx.fill();T(ctx,String(n),x+36,y+h/2+7,{w:800,size:20,align:"center",color:"#0a1020"});
  lines.forEach((l,i)=>T(ctx,l,x+68,y+h/2-(lines.length-1)*14.5+8+i*29,{w:700,size:22,color:rgba(INK,0.6+0.4*(hi||0))}));});}
// a freshness scale: seconds, minutes, overnight, a date; o.marks: [[position 0..3, label, colour, row]]
const BO_FRESH=["seconds","minutes","overnight","a date"];
function bo_fresh(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(BO_M,0.9));g.addColorStop(0.5,rgba(BO_ACC,0.8));g.addColorStop(1,rgba(BO_R,0.9));
  ctx.fillStyle=g;rr(ctx,x,y-5,w,10,5);ctx.fill();(o.labels||BO_FRESH).forEach((s,i,arr)=>{const xx=x+w*i/(arr.length-1);ctx.fillStyle=rgba(INK,0.9);ctx.beginPath();ctx.arc(xx,y,8,0,TAU);ctx.fill();T(ctx,s,xx,y+44,{w:700,size:o.ls||22,align:"center",color:rgba(SOFT,1)});});
  (o.marks||[]).forEach(([p,label,col,row])=>{const xx=x+w*p/((o.labels||BO_FRESH).length-1),yy=y-46-(row||0)*50;ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xx,y-10);ctx.lineTo(xx,yy+14);ctx.stroke();
    ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(xx,y,12,0,TAU);ctx.fill();tag(ctx,xx,yy,label,col,{align:"center",size:o.ms||20});});});}

/* ---------- pictures for the labs and the scenarios (site/assets/both-at-once/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW). */
const BO_ZONES=[["write",BO_W],["read",BO_R],["gold",BO_M]];
const LV={
  // Where does it live? Three places an idea's source of truth can be; each item sits where it was put
  where:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.id==="where"),W_=lab.w,zw=(w-80)/3;
    BO_ZONES.forEach(([k,col],i)=>{const x=30+i*(zw+10),b=W_.buckets.find(q=>q[0]===k);
      if(k==="rows"||k==="write")bo_store(c,x,20,zw,h-40,"rows",{col,n:5,p:1,a:0.5});else if(k==="read")bo_store(c,x,20,zw,h-40,"cols",{col,n:5,p:1,a:0.5});
      else{vault(c,x,20,zw,h-40,LAYER.gold,(r,cc)=>hash(r*5+cc,3)<0.6?LAYER.gold:null,null);}
      glass(c,x+10,30,zw-20,56,12,col,{glow:8,ea:0.8,fill:"rgba(7,12,24,0.95)"});wrapT(c,b?b[1]:k,x+22,52,zw-44,{w:700,size:15,lh:18,color:rgba(col,1)});
      const mine=W_.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]===k);
      mine.forEach(([it,j],n)=>{const yy=110+n*44,ok=st.checked?(it.b===k):null,ec=ok===null?col:ok?GOOD:BAD;glass(c,x+10,yy,zw-20,36,10,ec,{glow:6,ea:0.9,fill:"rgba(7,12,24,0.95)"});
        const s=it.s||it.t;T(c,s.length>30?s.slice(0,29)+"…":s,x+22,yy+24,{w:600,size:14,color:rgba(INK,0.95)});});});},
  // Apply the changes in order: the log on the left, the reading side's row for A-1042 on the right
  log:(c,w,h,st)=>{const s=st.step||0,wrong=s>=4,ent_=[[1,"issue A-1042","A-1042"],[2,"update email","L-207"],[3,"revoke A-1042","A-1042"]];
    T(c,wrong?"the wrong order":"the change log, in order",40,44,{w:800,size:22,color:rgba(wrong?BAD:BO_ACC,1)});
    const order=wrong?[2,0,1]:[0,1,2];order.forEach((k,i)=>{const e=ent_[k],done=wrong?true:i<s;bo_change(c,40,70+i*66,380,e[0],e[1],e[2],{a:1,hi:(!wrong&&i===s-1)?1:0,bad:wrong&&k===2,col:done?BO_ACC:[150,165,190]});
      if(done)tick_(c,445,96+i*66,26,wrong&&k===2?BAD:GOOD,wrong&&k===2?0:1);if(wrong&&k===2)cross_(c,445,96+i*66,24,BAD,1);});
    const st_=wrong?"issued":s>=3?"revoked":s>=1?"issued":"—",em=s>=2&&!wrong?"aisha@work":"aisha@mail",x=520;
    bo_store(c,x,40,w-x-30,h-80,"cols",{col:BO_R,title:"the reading side",n:1,p:0,a:1});
    bo_colStripe(c,x+24,110,120,h-170,"award",[{key:"A-1042",a:s>=1?1:0},{t:"A-1042",a:s>=1?1:0}]);
    bo_colStripe(c,x+156,110,120,h-170,"status",[{t:"",a:0},{t:st_,c:wrong?BAD:s>=3?GOOD:INK,hi:(s===3||wrong)?1:0,hc:wrong?BAD:GOOD}]);
    bo_colStripe(c,x+288,110,w-x-30-312,h-170,"email",[{key:"L-207",a:1},{t:em,hi:s===2?1:0}]);
    if(wrong)bo_ghost(c,x+60,h-110,300,70,1.2,1,"A-1042 · issued","back to life");},
  // How fresh? The scale, with each use where it was put
  fresh:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.id==="fresh"),W_=lab.w,keys=W_.buckets.map(b=>b[0]);
    bo_fresh(c,70,h-90,w-140,{labels:W_.buckets.map(b=>b[1]),ls:18,ms:15,marks:W_.items.map((it,j)=>{const k=st.pick[j];if(!k)return null;const i=keys.indexOf(k),same=W_.items.slice(0,j).filter((q,jj)=>st.pick[jj]===k).length,ok=st.checked?(it.b===k):null;
      return[i,it.s||it.t,ok===null?BO_ACC:ok?GOOD:BAD,same];}).filter(Boolean)});},
  // scenarios
  census:(c,w,h)=>{bo_store(c,30,30,250,260,"rows",{title:"enrolments",sub:"the app, live",n:5,p:1});bo_cal(c,300,40,"counted","28 Sep","today",BAD,1,0);bo_cal(c,300,176,"counted","31 Mar","census date",GOOD,1,1);},
  ghost:(c,w,h)=>{bo_change(c,20,40,280,3,"revoke A-2210","A-1042",{bad:true});bo_change(c,20,110,280,1,"issue A-2210","A-1042",{});bo_ghost(c,330,70,250,90,1,1,"A-2210 · issued","back to life");T(c,"replayed out of order",300,280,{w:700,size:20,align:"center",color:rgba(BAD,1)});},
  delete:(c,w,h)=>{bo_store(c,20,30,270,250,"rows",{title:"rows",n:4,p:0.75});bo_store(c,310,30,270,250,"cols",{title:"columns",n:5,p:1});T(c,"deleted here…",155,300,{w:700,size:18,align:"center",color:rgba(BO_W,1)});T(c,"…still counted here",445,300,{w:700,size:18,align:"center",color:rgba(BAD,1)});},
  owners:(c,w,h)=>{bo_store(c,20,50,220,220,"rows",{title:"awards",n:4});bo_store(c,360,50,220,220,"cols",{title:"awards",n:4});arrowTo(c,250,130,350,130,BO_W,1,{});arrowTo(c,350,200,250,200,BO_M,1,{});T(c,"?",300,176,{w:800,size:34,align:"center",color:rgba(BAD,1)});T(c,"two teams, one table",300,300,{w:700,size:20,align:"center",color:rgba(SOFT,1)});},
  wallet:(c,w,h)=>{bo_phone(c,150,160,1.1,{screen:"wallet",n:2});bo_moon(c,420,100,40,1);bo_hourglass(c,420,220,1.4,1,BO_AMB,1);T(c,"fed overnight",420,290,{w:700,size:20,align:"center",color:rgba(BO_AMB,1)});},
  twodefs:(c,w,h)=>{[["the app",18,BO_W,40],["the report",15,BO_R,320]].forEach(([n,v,col,x])=>{glass(c,x,50,240,200,18,col,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,n,x+24,92,{w:800,size:22,color:rgba(col,1)});T(c,"credits towards",x+24,128,{w:600,size:17,color:rgba(SOFT,1)});T(c,"the certificate",x+24,150,{w:600,size:17,color:rgba(SOFT,1)});T(c,String(v),x+24,220,{w:800,size:54,color:rgba(col,1)});});T(c,"≠",300,176,{w:800,size:44,align:"center",color:rgba(BAD,1)});},
  tagline:(c,w,h)=>{T(c,"Hybrid removes",300,120,{w:800,size:34,align:"center"});T(c,"the copy,",300,172,{w:800,size:34,align:"center",color:rgba(SOFT,0.7)});bo_strike(c,225,160,375,160,1,SOFT,0.8);T(c,"not the model.",300,224,{w:800,size:34,align:"center",color:rgba(BO_ACC,1)});},
  serve:(c,w,h)=>{vault(c,390,30,190,250,LAYER.gold,(r,cc)=>hash(r*5+cc,4)<0.6?LAYER.gold:null,null);chip(c,485,92,null,"Gold",null,{align:"center",edge:LAYER.gold});bo_phone(c,110,160,1.05,{screen:"suggest",edge:BO_M});
    for(let i=0;i<3;i++)arrowTo(c,380,120+i*50,200,120+i*50,BO_M,0.9,{head:12});}
};
