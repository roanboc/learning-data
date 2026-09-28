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
// the moon: lit on one side, shadowed towards its inner curve, with faint seas (cached); its halo breathes
function bo_moon(ctx,x,y,r,a,t){if(a<=0.01)return;if(!BO_SPR.moon){const c=mkCanvas(160,160),m=c.getContext("2d"),g=m.createRadialGradient(46,58,6,72,80,70);g.addColorStop(0,"#fbfdff");g.addColorStop(0.55,"#dfe6f6");g.addColorStop(1,"#9aa6c4");
    m.fillStyle=g;m.beginPath();m.arc(80,80,66,0,TAU);m.fill();m.fillStyle="rgba(150,160,190,0.28)";[[46,70,10],[60,108,8],[38,98,6],[70,46,7]].forEach(([cx,cy,cr])=>{m.beginPath();m.ellipse(cx,cy,cr,cr*0.8,0.4,0,TAU);m.fill();});
    m.globalCompositeOperation="destination-out";const h=m.createRadialGradient(114,62,50,114,62,62);h.addColorStop(0,"rgba(0,0,0,1)");h.addColorStop(1,"rgba(0,0,0,0)");m.fillStyle=h;m.beginPath();m.arc(114,62,62,0,TAU);m.fill();BO_SPR.moon=c;}
  withA(ctx,a,()=>{glow(ctx,x,y,r*(2.6+0.15*Math.sin((t||0)*1.1)),[170,190,255],0.35);ctx.drawImage(BO_SPR.moon,x-r*1.21,y-r*1.21,r*2.42,r*2.42);});}
// the sun: a warm core and soft, tapered rays that turn and breathe
function bo_sun(ctx,x,y,r,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*(3.1+0.2*Math.sin(t*1.3)),[255,210,120],0.5);ctx.save();ctx.translate(x,y);ctx.rotate(t*0.08);
  for(let i=0;i<12;i++){const an=i/12*TAU,L=r*(1.75+0.18*Math.sin(t*1.6+i*1.7)),w=r*0.16;ctx.save();ctx.rotate(an);const g=ctx.createLinearGradient(r*1.1,0,L,0);g.addColorStop(0,"rgba(255,214,130,0.95)");g.addColorStop(1,"rgba(255,190,90,0)");ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(r*1.12,-w);ctx.bezierCurveTo(r*1.4,-w*0.9,L*0.85,-w*0.25,L,0);ctx.bezierCurveTo(L*0.85,w*0.25,r*1.4,w*0.9,r*1.12,w);ctx.quadraticCurveTo(r*1.05,0,r*1.12,-w);ctx.fill();ctx.restore();}
  const g=ctx.createRadialGradient(-r*0.35,-r*0.35,r*0.08,0,0,r);g.addColorStop(0,"#fffaea");g.addColorStop(0.55,"#ffd98a");g.addColorStop(1,"#f5a948");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();});}
/* an hourglass: turned wooden caps and posts, two curved glass bulbs, and sand falling in a thin stream.
   u: how much of the sand has fallen (0..1); t moves the grains */
function bo_hourglass(ctx,x,y,s,u,col,a,t){if(a<=0.01)return;const c=col||BO_AMB;u=clamp(u,0.02,0.98);withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const bulb=(sg)=>{ctx.beginPath();ctx.moveTo(-14,sg*-22);ctx.bezierCurveTo(-15,sg*-10,-4,sg*-4,-2,0);ctx.lineTo(2,0);ctx.bezierCurveTo(4,sg*-4,15,sg*-10,14,sg*-22);ctx.closePath();};
  [1,-1].forEach(sg=>{bulb(sg);const g=ctx.createLinearGradient(-14,0,14,0);g.addColorStop(0,"rgba(200,225,255,0.22)");g.addColorStop(0.35,"rgba(230,244,255,0.10)");g.addColorStop(1,"rgba(160,190,230,0.2)");ctx.fillStyle=g;ctx.fill();});
  const sandG=ctx.createLinearGradient(0,-22,0,22);sandG.addColorStop(0,rgba(mix(c,[255,255,255],0.25),1));sandG.addColorStop(1,rgba(mix(c,[0,0,0],0.2),1));ctx.fillStyle=sandG;
  ctx.save();bulb(1);ctx.clip();const top=-22+20*u;ctx.beginPath();ctx.moveTo(-16,top+3);ctx.quadraticCurveTo(0,top+7*(1-u),16,top+3);ctx.lineTo(16,2);ctx.lineTo(-16,2);ctx.closePath();ctx.fill();ctx.restore();
  ctx.save();bulb(-1);ctx.clip();const hgt=18*u;ctx.beginPath();ctx.moveTo(-16,22);ctx.lineTo(-16,22-hgt*0.35);ctx.quadraticCurveTo(0,22-hgt*1.35,16,22-hgt*0.35);ctx.lineTo(16,22);ctx.closePath();ctx.fill();ctx.restore();
  if(u<0.97){ctx.strokeStyle=rgba(c,0.9);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,22-hgt*0.9);ctx.stroke();for(let k=0;k<4;k++){const f=((t||0)*1.6+k/4)%1;ctx.fillStyle=rgba(c,0.9);ctx.beginPath();ctx.arc(k%2?0.8:-0.8,f*(22-hgt*0.9),0.9,0,TAU);ctx.fill();}}
  ctx.strokeStyle="rgba(210,230,255,0.75)";ctx.lineWidth=1.4;[1,-1].forEach(sg=>{bulb(sg);ctx.stroke();});ctx.strokeStyle="rgba(255,255,255,0.55)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-10,-18);ctx.quadraticCurveTo(-10,-10,-5,-6);ctx.stroke();
  const wood=ctx.createLinearGradient(0,-30,0,-22);wood.addColorStop(0,"#b07a48");wood.addColorStop(1,"#5c361c");
  [-1,1].forEach(sg=>{ctx.fillStyle=wood;ctx.beginPath();ctx.moveTo(-20,sg*24);ctx.quadraticCurveTo(-22,sg*29,-18,sg*31);ctx.lineTo(18,sg*31);ctx.quadraticCurveTo(22,sg*29,20,sg*24);ctx.closePath();ctx.fill();ctx.fillStyle="rgba(255,225,190,0.35)";ctx.fillRect(-17,sg>0?24:-25.2,34,1.2);});
  [-17,17].forEach(px=>{const pg=ctx.createLinearGradient(px-2,0,px+2,0);pg.addColorStop(0,"#c18a55");pg.addColorStop(1,"#5c361c");ctx.fillStyle=pg;ctx.beginPath();ctx.moveTo(px-1.4,-24);ctx.bezierCurveTo(px-3,-12,px-3,12,px-1.4,24);ctx.lineTo(px+1.4,24);ctx.bezierCurveTo(px+3,12,px+3,-12,px+1.4,-24);ctx.closePath();ctx.fill();});
  ctx.restore();});}
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

/* ---------- 1879: the saloon, the register and the hand that rings it up ----------
   Organic things are drawn soft: curved outlines, a light side and a shadow side, wood grain, brass sheen, lamplight that flickers. */
// a wood texture (cached): a warm gradient with flowing grain and a knot or two; dir "v" runs the grain up and down
function bo_woodTex(w,h,seed,dir){const k="wood"+w+"x"+h+"_"+seed+(dir||"h");if(BO_SPR[k])return BO_SPR[k];const c=mkCanvas(w,h),m=c.getContext("2d"),v=dir==="v";
  const g=m.createLinearGradient(0,0,v?w:0,v?0:h);g.addColorStop(0,"#9a6438");g.addColorStop(0.5,"#7c4a26");g.addColorStop(1,"#5a3218");m.fillStyle=g;m.fillRect(0,0,w,h);
  const span=v?w:h,L=v?h:w,n=Math.max(6,Math.round(span/7));for(let i=0;i<n;i++){const off=(i+hash(i,seed))*span/n,amp=2+hash(i,seed+1)*6,ph=hash(i,seed+2)*TAU,fr=1+hash(i,seed+6);
    m.strokeStyle="rgba("+(hash(i,seed+4)>0.5?"50,26,10,":"190,130,80,")+(0.18+0.25*hash(i,seed+5))+")";m.lineWidth=0.6+hash(i,seed+3)*1.8;m.beginPath();
    for(let s=0;s<=24;s++){const q=s/24*L,o=off+Math.sin(s/24*TAU*fr+ph)*amp;if(v){s?m.lineTo(o,q):m.moveTo(o,q);}else{s?m.lineTo(q,o):m.moveTo(q,o);}}m.stroke();}
  for(let q=0;q<2;q++){const kx=hash(q,seed+9)*w,ky=hash(q,seed+10)*h;for(let r=1;r<5;r++){m.strokeStyle="rgba(50,26,10,"+(0.35-r*0.06)+")";m.lineWidth=1;m.beginPath();m.ellipse(kx,ky,r*(v?2.5:7),r*(v?7:2.5),0,0,TAU);m.stroke();}}
  const sh=m.createLinearGradient(0,0,0,h);sh.addColorStop(0,"rgba(255,230,190,0.08)");sh.addColorStop(1,"rgba(0,0,0,0.15)");m.fillStyle=sh;m.fillRect(0,0,w,h);BO_SPR[k]=c;return c;}
// a bottle: shoulders curving into the neck, coloured glass with a highlight that catches the lamp, a label and a cork
function bo_bottle(ctx,x,y,s,col,t,i){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const path=()=>{ctx.beginPath();ctx.moveTo(-13,0);ctx.bezierCurveTo(-14,-20,-14,-44,-13,-52);ctx.bezierCurveTo(-12,-64,-4,-66,-4,-78);ctx.lineTo(-4,-96);ctx.lineTo(4,-96);ctx.lineTo(4,-78);ctx.bezierCurveTo(4,-66,12,-64,13,-52);ctx.bezierCurveTo(14,-44,14,-20,13,0);ctx.quadraticCurveTo(0,3,-13,0);ctx.closePath();};
  const g=ctx.createLinearGradient(-14,0,14,0);g.addColorStop(0,rgba(mix(col,[0,0,0],0.55),0.9));g.addColorStop(0.35,rgba(col,0.85));g.addColorStop(1,rgba(mix(col,[0,0,0],0.65),0.9));ctx.fillStyle=g;path();ctx.fill();
  ctx.fillStyle="rgba(236,222,190,0.75)";ctx.beginPath();ctx.moveTo(-12,-40);ctx.quadraticCurveTo(0,-37,12,-40);ctx.lineTo(12,-22);ctx.quadraticCurveTo(0,-19,-12,-22);ctx.closePath();ctx.fill();
  ctx.fillStyle="#8a5a32";rr(ctx,-4.5,-104,9,10,2);ctx.fill();ctx.strokeStyle="rgba(255,240,210,"+(0.3+0.15*Math.sin(t*1.3+i))+")";ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-8,-10);ctx.quadraticCurveTo(-10,-30,-8,-48);ctx.stroke();ctx.restore();}
const bo_flicker=t=>0.5+0.35*Math.sin(t*3.1)*Math.sin(t*1.7+1)+0.15*Math.sin(t*7.3);
function bo_saloon(ctx,t){const fl=bo_flicker(t);
  // a mirror behind the bar, in a wooden frame
  ctx.save();const mg=ctx.createLinearGradient(880,120,1480,560);mg.addColorStop(0,"rgba(70,54,40,0.6)");mg.addColorStop(0.5,"rgba(40,30,24,0.55)");mg.addColorStop(1,"rgba(26,18,14,0.6)");ctx.fillStyle=mg;rr(ctx,880,120,600,450,26);ctx.fill();
  ctx.drawImage(bo_woodTex(640,24,3),860,100,640,24);ctx.drawImage(bo_woodTex(640,24,4),860,566,640,24);ctx.drawImage(bo_woodTex(24,490,5,"v"),860,100,24,490);ctx.drawImage(bo_woodTex(24,490,6,"v"),1476,100,24,490);
  ctx.strokeStyle="rgba(40,20,8,0.6)";ctx.lineWidth=2;rr(ctx,884,124,592,442,20);ctx.stroke();ctx.strokeStyle="rgba(255,220,170,"+(0.05+0.04*fl)+")";ctx.lineWidth=18;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(960,540);ctx.quadraticCurveTo(1000,300,1120,150);ctx.stroke();ctx.restore();
  // a shelf of bottles on the left wall
  ctx.drawImage(bo_woodTex(700,16,7),50,384,700,16);ctx.fillStyle="rgba(0,0,0,0.3)";ctx.fillRect(50,400,700,8);
  const bc=[[110,160,100],[170,100,50],[200,160,90],[100,110,160],[150,60,50],[120,170,130]];for(let i=0;i<9;i++)bo_bottle(ctx,90+i*72,384,0.9+0.25*hash(i,3),bc[i%6],t,i);
  // the lamp over the register: a brass shade, its light flickering
  ctx.save();ctx.strokeStyle="rgba(120,90,60,0.8)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1180,0);ctx.lineTo(1180,18);ctx.stroke();const lg=ctx.createLinearGradient(1140,0,1220,0);lg.addColorStop(0,"#7a5424");lg.addColorStop(0.4,"#f0cc88");lg.addColorStop(1,"#6a4418");
  ctx.fillStyle=lg;ctx.beginPath();ctx.moveTo(1170,18);ctx.bezierCurveTo(1150,22,1146,40,1138,56);ctx.quadraticCurveTo(1180,64,1222,56);ctx.bezierCurveTo(1214,40,1210,22,1190,18);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,244,210,"+(0.75+0.25*fl)+")";ctx.beginPath();ctx.ellipse(1180,58,22,5,0,0,TAU);ctx.fill();glow(ctx,1180,70,130+14*fl,[255,210,140],0.36+0.16*fl);ctx.restore();}
// the bar: a polished top with a rounded edge, a panelled front, and a brass foot rail with a slow gleam
function bo_counter(ctx,t){ctx.save();ctx.drawImage(bo_woodTex(W,48,11),0,690,W,48);const e=ctx.createLinearGradient(0,690,0,738);e.addColorStop(0,"rgba(255,226,180,0.35)");e.addColorStop(0.12,"rgba(255,226,180,0.05)");e.addColorStop(0.7,"rgba(0,0,0,0)");e.addColorStop(1,"rgba(0,0,0,0.45)");ctx.fillStyle=e;ctx.fillRect(0,690,W,48);
  ctx.drawImage(bo_woodTex(W,H-738,12),0,738,W,H-738);ctx.fillStyle="rgba(0,0,0,0.35)";ctx.fillRect(0,738,W,H-738);const sh=ctx.createLinearGradient(0,738,0,770);sh.addColorStop(0,"rgba(0,0,0,0.55)");sh.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sh;ctx.fillRect(0,738,W,32);
  for(let x=40;x<W;x+=240){ctx.save();rr(ctx,x,780,200,250,14);ctx.clip();ctx.drawImage(bo_woodTex(200,250,20+(x/240|0)%5,"v"),x,780);ctx.restore();ctx.lineWidth=3;ctx.strokeStyle="rgba(255,220,170,0.16)";ctx.beginPath();ctx.moveTo(x+4,1026);ctx.lineTo(x+4,794);ctx.quadraticCurveTo(x+4,784,x+14,784);ctx.lineTo(x+196,784);ctx.stroke();
    ctx.strokeStyle="rgba(0,0,0,0.45)";ctx.beginPath();ctx.moveTo(x+196,786);ctx.lineTo(x+196,1026);ctx.stroke();}
  const rg=ctx.createLinearGradient(0,1008,0,1030);rg.addColorStop(0,"#f6dca0");rg.addColorStop(0.45,"#c49040");rg.addColorStop(1,"#5c3c14");ctx.fillStyle=rg;rr(ctx,0,1008,W,20,10);ctx.fill();
  const sx=((t||0)*60)%(W+400)-200,sg=ctx.createLinearGradient(sx-120,0,sx+120,0);sg.addColorStop(0,"rgba(255,250,230,0)");sg.addColorStop(0.5,"rgba(255,250,230,0.35)");sg.addColorStop(1,"rgba(255,250,230,0)");ctx.fillStyle=sg;ctx.fillRect(sx-120,1010,240,8);ctx.restore();}
// a wall clock in a round wooden case; its hands taper; h: the hour (0..12, fractional)
function bo_clock(ctx,x,y,r,h){ctx.save();const cg=ctx.createRadialGradient(x-r*0.4,y-r*0.4,r*0.2,x,y,r+14);cg.addColorStop(0,"#b27a48");cg.addColorStop(1,"#4a2a12");ctx.fillStyle=cg;ctx.beginPath();ctx.arc(x,y,r+12,0,TAU);ctx.fill();
  const fg=ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r);fg.addColorStop(0,"#fbf4e2");fg.addColorStop(1,"#d9c9a6");ctx.fillStyle=fg;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(60,40,24,0.85)";for(let i=0;i<12;i++){const an=i/12*TAU;ctx.beginPath();ctx.arc(x+Math.cos(an)*r*0.84,y+Math.sin(an)*r*0.84,i%3?1.8:3.2,0,TAU);ctx.fill();}
  const hand=(an,L,w)=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.fillStyle="rgba(40,26,14,0.95)";ctx.beginPath();ctx.moveTo(-w,-L*0.15);ctx.quadraticCurveTo(-w*1.2,L*0.4,0,L);ctx.quadraticCurveTo(w*1.2,L*0.4,w,-L*0.15);ctx.closePath();ctx.fill();ctx.restore();};
  hand(h/12*TAU+Math.PI,r*0.52,4.2);hand((h%1)*TAU+Math.PI,r*0.78,3);ctx.fillStyle="#8a6a3a";ctx.beginPath();ctx.arc(x,y,4.5,0,TAU);ctx.fill();ctx.restore();}
/* the cash register, drawn with its base centred at (x,y). o.press: [key index, 0..1]; o.tab: the amount shown in the window, o.pop 0..1;
   o.total: the day's total in cents, shown by the dial's hands and the counter below it; o.hi: a glow round the whole machine; o.t: the brass's sheen */
const BO_KEYS=["5¢","10¢","15¢","25¢","50¢","$1"];
function bo_brass(ctx,x0,y0,x1,y1,t){const g=ctx.createLinearGradient(x0,y0,x1,y1),p=0.42+0.2*Math.sin((t||0)*0.5);g.addColorStop(0,"#fbe2a4");g.addColorStop(p-0.2,"#d9a856");g.addColorStop(p,"#fff0c4");g.addColorStop(p+0.18,"#c08a3c");g.addColorStop(1,"#6e4818");return g;}
function bo_register(ctx,x,y,s,o){o=o||{};const t=o.t||0;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  if(o.hi)glow(ctx,0,-250,360,BO_BRASS,0.25*o.hi);
  const sh=ctx.createRadialGradient(0,0,20,0,0,240);sh.addColorStop(0,"rgba(0,0,0,0.45)");sh.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sh;ctx.beginPath();ctx.ellipse(0,0,240,24,0,0,TAU);ctx.fill();
  // the drawer, in wood with a brass trim and a keyhole
  ctx.save();rr(ctx,-190,-100,380,100,12);ctx.clip();ctx.drawImage(bo_woodTex(380,100,31),-190,-100);ctx.restore();ctx.strokeStyle="rgba(255,220,170,0.25)";ctx.lineWidth=2;rr(ctx,-160,-82,320,64,10);ctx.stroke();ctx.strokeStyle="rgba(0,0,0,0.45)";ctx.beginPath();ctx.moveTo(-156,-18);ctx.lineTo(156,-18);ctx.stroke();
  ctx.fillStyle=bo_brass(ctx,-196,-112,196,-98,t);rr(ctx,-198,-112,396,14,7);ctx.fill();const kg=ctx.createRadialGradient(-4,-54,2,0,-50,13);kg.addColorStop(0,"#fff0c4");kg.addColorStop(1,"#8a5c20");ctx.fillStyle=kg;ctx.beginPath();ctx.arc(0,-50,12,0,TAU);ctx.fill();ctx.fillStyle="#2a1a0c";ctx.beginPath();ctx.arc(0,-53,2.4,0,TAU);ctx.fill();ctx.fillRect(-1.2,-53,2.4,8);
  // the body: curved, cabinet-like sides in brass, a light side and a shadow side, embossed scrolls
  const body=()=>{ctx.beginPath();ctx.moveTo(-176,-110);ctx.bezierCurveTo(-190,-170,-146,-220,-152,-270);ctx.bezierCurveTo(-158,-318,-176,-336,-150,-362);ctx.quadraticCurveTo(0,-372,150,-362);ctx.bezierCurveTo(176,-336,158,-318,152,-270);ctx.bezierCurveTo(146,-220,190,-170,176,-110);ctx.closePath();};
  body();ctx.fillStyle=bo_brass(ctx,-180,-370,180,-110,t);ctx.fill();body();const shade=ctx.createLinearGradient(-180,0,180,0);shade.addColorStop(0,"rgba(255,250,230,0.18)");shade.addColorStop(0.5,"rgba(0,0,0,0)");shade.addColorStop(1,"rgba(60,30,0,0.35)");ctx.fillStyle=shade;ctx.fill();
  body();ctx.strokeStyle="rgba(90,56,18,0.7)";ctx.lineWidth=2.4;ctx.stroke();
  const scroll=(d,o_)=>{ctx.beginPath();ctx.moveTo(d*120+o_,-340+o_);ctx.bezierCurveTo(d*150+o_,-300+o_,d*96+o_,-282+o_,d*128+o_,-236+o_);ctx.bezierCurveTo(d*148+o_,-206+o_,d*112+o_,-184+o_,d*132+o_,-156+o_);ctx.quadraticCurveTo(d*140+o_,-140+o_,d*124+o_,-142+o_);ctx.quadraticCurveTo(d*116+o_,-150+o_,d*124+o_,-154+o_);};
  ctx.lineCap="round";[-1,1].forEach(d=>{ctx.strokeStyle="rgba(255,244,210,0.55)";ctx.lineWidth=2;scroll(d,-1.2);ctx.stroke();ctx.strokeStyle="rgba(100,62,20,0.6)";ctx.lineWidth=3;scroll(d,1.2);ctx.stroke();});
  // the dial: a clock face for the total, cents on the long hand, dollars on the short one
  const tot=o.total||0,cx=0,cy=-272,R=54,fg=ctx.createRadialGradient(cx-18,cy-18,4,cx,cy,R);fg.addColorStop(0,"#fffaf0");fg.addColorStop(1,"#dccba6");ctx.fillStyle=fg;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
  ctx.strokeStyle=bo_brass(ctx,-R,cy-R,R,cy+R,t);ctx.lineWidth=8;ctx.stroke();ctx.fillStyle="rgba(60,40,20,0.85)";for(let i=0;i<20;i++){const an=i/20*TAU-Math.PI/2;ctx.beginPath();ctx.arc(cx+Math.cos(an)*R*0.8,cy+Math.sin(an)*R*0.8,i%5?1.6:3,0,TAU);ctx.fill();}
  const hand=(an,L,w,col)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(an);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-w,-L*0.12);ctx.quadraticCurveTo(-w*1.1,L*0.45,0,L);ctx.quadraticCurveTo(w*1.1,L*0.45,w,-L*0.12);ctx.closePath();ctx.fill();ctx.restore();};
  hand((tot/100)/50*TAU+Math.PI,R*0.48,4,"rgba(40,26,14,0.95)");hand((tot%100)/100*TAU+Math.PI,R*0.8,2.6,"rgba(170,40,30,0.95)");const pg=ctx.createRadialGradient(cx-2,cy-2,1,cx,cy,6);pg.addColorStop(0,"#fff0c4");pg.addColorStop(1,"#8a5c20");ctx.fillStyle=pg;ctx.beginPath();ctx.arc(cx,cy,6,0,TAU);ctx.fill();
  if(o.dialHi)glow(ctx,cx,cy,90,BO_R,0.35*o.dialHi);
  // the counter under the dial: the day's total so far, on four cream number wheels behind a brass window, dollars and cents
  if(o.totHi)glow(ctx,0,-190,120,BO_R,0.32*Math.min(1,o.totHi));
  ctx.fillStyle=bo_brass(ctx,-78,-210,78,-170,t);rr(ctx,-78,-210,156,40,9);ctx.fill();ctx.strokeStyle="rgba(90,56,18,0.7)";ctx.lineWidth=1.6;ctx.stroke();
  rr(ctx,-52,-206,128,32,5);ctx.fillStyle="#2a1a0c";ctx.fill();T(ctx,"$",-63,-181,{w:700,size:22,f:"serif",align:"center",color:"rgba(70,42,14,0.95)"});
  const dol=Math.floor(tot/100)%100,cen=tot%100,dg=[Math.floor(dol/10),dol%10,Math.floor(cen/10),cen%10];
  dg.forEach((d,i)=>{const wx=-49+i*28+(i>1?10:0),wg=ctx.createLinearGradient(0,-204,0,-176);wg.addColorStop(0,"#8a7a5a");wg.addColorStop(0.28,"#f1e7cc");wg.addColorStop(0.5,"#fffaf0");wg.addColorStop(0.72,"#f1e7cc");wg.addColorStop(1,"#8a7a5a");
    ctx.fillStyle=wg;ctx.fillRect(wx,-204,24,28);T(ctx,String(d),wx+12,-182,{w:700,size:22,f:"serif",align:"center",color:"rgba(40,26,14,0.95)"});});
  ctx.fillStyle="rgba(255,236,190,0.9)";ctx.beginPath();ctx.arc(10,-179,2.2,0,TAU);ctx.fill();
  // the keys: ivory caps on brass stems
  BO_KEYS.forEach((k,i)=>{const kx=-125+i*50,pr=o.press&&o.press[0]===i?o.press[1]:0,ky=-138+8*pr;ctx.strokeStyle="rgba(96,62,22,0.95)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(kx,ky);ctx.quadraticCurveTo(kx+2,-124,kx,-112);ctx.stroke();
    if(pr>0)glow(ctx,kx,ky,40,BO_W,0.6*pr);const ig=ctx.createRadialGradient(kx-6,ky-7,2,kx,ky,20);ig.addColorStop(0,"#fffdf4");ig.addColorStop(1,"#d8ccb0");ctx.fillStyle=ig;ctx.beginPath();ctx.arc(kx,ky,19,0,TAU);ctx.fill();
    ctx.strokeStyle=bo_brass(ctx,kx-19,ky-19,kx+19,ky+19,t);ctx.lineWidth=4;ctx.stroke();T(ctx,k,kx,ky+5,{w:800,size:k.length>2?13:15,align:"center",color:"rgba(40,26,14,0.95)"});});
  if(o.keysHi)glow(ctx,0,-138,170,BO_W,0.3*o.keysHi);
  // the window on top, where each sale pops up
  ctx.fillStyle=bo_brass(ctx,-114,-448,114,-356,t);rr(ctx,-114,-448,228,92,14);ctx.fill();rr(ctx,-96,-434,192,68,8);ctx.fillStyle="#140c06";ctx.fill();
  if(o.tab){ctx.save();rr(ctx,-96,-434,192,68,8);ctx.clip();const ty=lerp(-360,-428,ease(clamp(o.pop==null?1:o.pop,0,1))),tg=ctx.createLinearGradient(0,ty,0,ty+56);tg.addColorStop(0,"#fffdf4");tg.addColorStop(1,"#e8dcc0");ctx.fillStyle=tg;rr(ctx,-58,ty,116,56,6);ctx.fill();ctx.fillStyle="rgba(170,40,30,0.9)";ctx.fillRect(-58,ty,116,6);
    T(ctx,o.tab,0,ty+42,{w:800,size:30,align:"center",color:"rgba(30,20,12,0.95)"});ctx.restore();}
  const gl=ctx.createLinearGradient(-96,-434,96,-366);gl.addColorStop(0,"rgba(255,255,255,0.12)");gl.addColorStop(0.4,"rgba(255,255,255,0)");ctx.fillStyle=gl;rr(ctx,-96,-434,192,68,8);ctx.fill();
  if(o.tabHi)glow(ctx,0,-400,130,BO_W,0.35*o.tabHi);
  // the crown
  ctx.fillStyle=bo_brass(ctx,-120,-524,120,-446,t);ctx.beginPath();ctx.moveTo(-126,-446);ctx.bezierCurveTo(-112,-492,-52,-500,0,-524);ctx.bezierCurveTo(52,-500,112,-492,126,-446);ctx.quadraticCurveTo(0,-452,-126,-446);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(90,56,18,0.7)";ctx.lineWidth=2;ctx.stroke();
  ctx.strokeStyle="rgba(255,244,210,0.5)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-82,-460);ctx.bezierCurveTo(-60,-488,-20,-492,0,-506);ctx.bezierCurveTo(20,-492,60,-488,82,-460);ctx.stroke();
  T(ctx,"CASH",0,-462,{w:800,size:18,align:"center",color:"rgba(90,56,18,0.95)"});ctx.restore();}
/* the bartender's hand, pointing down to press a key: a loose shirt sleeve with a garter that runs out of the frame on the left,
   bending a little at the elbow and draping in folds, the cuff, the back of the hand, curled fingers, a thumb along them and one
   extended index finger, its tip at (x,y). It comes in from the left and breathes gently. */
function bo_hand(ctx,x,y,s,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(-0.06+0.02*Math.sin(t*1.3));
  const sleeve=()=>{ctx.beginPath();ctx.moveTo(-104,-106);ctx.bezierCurveTo(-200,-118,-330,-130,-460,-138);ctx.bezierCurveTo(-540,-143,-600,-152,-700,-156);ctx.bezierCurveTo(-900,-162,-1200,-162,-1560,-160);
    ctx.lineTo(-1560,-30);ctx.bezierCurveTo(-1200,-30,-900,-28,-700,-26);ctx.bezierCurveTo(-600,-26,-540,-20,-470,-32);ctx.bezierCurveTo(-330,-42,-200,-42,-104,-46);ctx.bezierCurveTo(-98,-62,-98,-90,-104,-106);ctx.closePath();};
  const sl=ctx.createLinearGradient(0,-160,0,-24);sl.addColorStop(0,"#f4efe4");sl.addColorStop(0.55,"#d8d0c0");sl.addColorStop(1,"#a09684");ctx.fillStyle=sl;sleeve();ctx.fill();
  // the cloth falls into shadow away from the lamp, towards the frame's edge
  const dk=ctx.createLinearGradient(-120,0,-1400,0);dk.addColorStop(0,"rgba(40,26,14,0)");dk.addColorStop(0.35,"rgba(40,26,14,0.12)");dk.addColorStop(1,"rgba(30,18,8,0.6)");ctx.fillStyle=dk;sleeve();ctx.fill();
  ctx.strokeStyle="rgba(255,252,240,0.35)";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-140,-100);ctx.bezierCurveTo(-300,-114,-420,-124,-500,-128);ctx.stroke();
  // folds: a few along the forearm, a cluster where the elbow bends, and long soft drapes on the upper arm
  ctx.strokeStyle="rgba(120,108,90,0.5)";ctx.lineWidth=2;[[-150,-110,-172,-62],[-214,-118,-236,-70],[-300,-128,-316,-80],[-380,-138,-392,-88]].forEach(([x0,y0,x1,y1])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2+12,(y0+y1)/2,x1,y1);ctx.stroke();});
  ctx.strokeStyle="rgba(110,96,78,0.55)";ctx.lineWidth=2.2;[[-500,-140,-560,-50,-530],[-540,-144,-610,-34,-590],[-580,-148,-640,-70,-625]].forEach(([x0,y0,x1,y1,cx])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx-24,(y0+y1)/2,x1,y1);ctx.stroke();});
  ctx.strokeStyle="rgba(110,96,78,0.4)";ctx.lineWidth=2.4;[[-760,-140,-980,-118],[-820,-56,-1100,-44],[-1050,-150,-1350,-130]].forEach(([x0,y0,x1,y1])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo(x0-70,y0+18,x1+70,y1-18,x1,y1);ctx.stroke();});
  ctx.fillStyle="#7a2a26";ctx.beginPath();ctx.moveTo(-262,-128);ctx.quadraticCurveTo(-256,-84,-262,-40);ctx.lineTo(-246,-40);ctx.quadraticCurveTo(-240,-84,-246,-126);ctx.closePath();ctx.fill();
  const cf=ctx.createLinearGradient(0,-110,0,-42);cf.addColorStop(0,"#fffdf8");cf.addColorStop(1,"#c9c0b0");ctx.fillStyle=cf;ctx.beginPath();ctx.moveTo(-100,-110);ctx.bezierCurveTo(-92,-86,-92,-66,-100,-42);ctx.lineTo(-134,-42);ctx.bezierCurveTo(-126,-66,-126,-88,-134,-112);ctx.closePath();ctx.fill();
  ctx.fillStyle="#caa24c";ctx.beginPath();ctx.arc(-117,-76,3.2,0,TAU);ctx.fill();
  const skin=ctx.createLinearGradient(0,-104,0,0);skin.addColorStop(0,"#f1c9a6");skin.addColorStop(0.55,"#dca47e");skin.addColorStop(1,"#b27a58");
  const handPath=()=>{ctx.beginPath();ctx.moveTo(0,2);ctx.quadraticCurveTo(8,1,8,-10);ctx.bezierCurveTo(9,-30,8,-48,6,-60);ctx.bezierCurveTo(4,-76,-12,-94,-38,-99);ctx.bezierCurveTo(-60,-103,-82,-100,-100,-98);
    ctx.bezierCurveTo(-104,-80,-104,-62,-100,-48);ctx.bezierCurveTo(-84,-44,-66,-40,-54,-38);ctx.bezierCurveTo(-44,-37,-38,-31,-34,-26);ctx.bezierCurveTo(-30,-21,-22,-22,-20,-29);ctx.bezierCurveTo(-18,-36,-16,-44,-14,-50);
    ctx.bezierCurveTo(-13,-36,-11,-18,-8,-6);ctx.quadraticCurveTo(-6,2,0,2);ctx.closePath();};
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;handPath();ctx.fillStyle=skin;ctx.fill();ctx.restore();
  handPath();const side=ctx.createLinearGradient(-100,0,10,0);side.addColorStop(0,"rgba(120,70,40,0.25)");side.addColorStop(0.6,"rgba(255,230,210,0.08)");side.addColorStop(1,"rgba(120,70,40,0.2)");ctx.fillStyle=side;ctx.fill();
  handPath();ctx.strokeStyle="rgba(120,70,44,0.3)";ctx.lineWidth=4;ctx.stroke();handPath();ctx.strokeStyle="rgba(96,54,32,0.75)";ctx.lineWidth=1.4;ctx.stroke();
  ctx.strokeStyle="rgba(120,70,44,0.6)";ctx.lineCap="round";ctx.lineWidth=1.6;[[-24,-46,-30,-32],[-36,-50,-44,-38],[-48,-54,-56,-42]].forEach(([x0,y0,x1,y1])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(x0-2,(y0+y1)/2+4,x1,y1);ctx.stroke();});
  ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-8,-32);ctx.quadraticCurveTo(-1,-30,5,-33);ctx.moveTo(-10,-50);ctx.quadraticCurveTo(-2,-47,5,-50);ctx.stroke();
  ctx.fillStyle="rgba(250,220,205,0.9)";ctx.beginPath();ctx.moveTo(2,-6);ctx.quadraticCurveTo(7,-9,6,-17);ctx.quadraticCurveTo(2,-19,0,-14);ctx.quadraticCurveTo(-1,-8,2,-6);ctx.fill();
  const th=ctx.createLinearGradient(0,-66,0,-40);th.addColorStop(0,"#e8b690");th.addColorStop(1,"#b27a58");ctx.fillStyle=th;ctx.beginPath();ctx.moveTo(-88,-66);ctx.bezierCurveTo(-68,-66,-48,-61,-36,-53);ctx.quadraticCurveTo(-27,-47,-33,-42);ctx.bezierCurveTo(-48,-44,-68,-48,-88,-50);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(96,54,32,0.6)";ctx.lineWidth=1.3;ctx.stroke();ctx.fillStyle="rgba(255,236,220,0.6)";ctx.beginPath();ctx.ellipse(-37,-48,3.5,2.4,0.3,0,TAU);ctx.fill();
  ctx.restore();});}
// a patent, on paper, with a line drawing of the machine and a curling corner
function bo_patent(ctx,x,y,w,h,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||-0.03);ctx.translate(-w/2,-h/2);
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=26;const pg=ctx.createLinearGradient(0,0,w,h);pg.addColorStop(0,"#f4ead0");pg.addColorStop(1,"#dccaa4");ctx.fillStyle=pg;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w,0);ctx.lineTo(w,h-22);ctx.quadraticCurveTo(w-4,h-4,w-26,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle="rgba(170,140,90,0.45)";ctx.beginPath();ctx.moveTo(w,h-22);ctx.quadraticCurveTo(w-12,h-14,w-26,h);ctx.quadraticCurveTo(w-20,h-18,w,h-22);ctx.fill();ctx.strokeStyle="rgba(120,90,50,0.5)";ctx.lineWidth=2;ctx.strokeRect(10,10,w-20,h-34);
  // the patent's own title; the drawing sits below it, clear of its letters
  T(ctx,"PATENT · 1879",w/2,54,{w:800,size:26,align:"center",color:"rgba(60,40,24,0.95)"});T(ctx,"Cash Register and Indicator",w/2,88,{w:600,size:22,f:"serif",align:"center",color:"rgba(90,66,40,0.95)"});
  ctx.save();ctx.translate(w/2,h-30);ctx.scale(0.32,0.32);ctx.strokeStyle="rgba(60,44,30,0.8)";ctx.lineWidth=3.6;ctx.strokeRect(-190,-100,380,100);ctx.beginPath();ctx.moveTo(-176,-110);ctx.bezierCurveTo(-190,-170,-146,-220,-152,-270);ctx.bezierCurveTo(-158,-318,-176,-336,-150,-362);ctx.quadraticCurveTo(0,-372,150,-362);ctx.bezierCurveTo(176,-336,158,-318,152,-270);ctx.bezierCurveTo(146,-220,190,-170,176,-110);ctx.stroke();
  ctx.beginPath();ctx.arc(0,-272,54,0,TAU);ctx.stroke();for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(-125+i*50,-138,19,0,TAU);ctx.stroke();}ctx.strokeRect(-112,-446,224,86);
  ctx.beginPath();ctx.moveTo(-250,-300);ctx.lineTo(-160,-272);ctx.moveTo(250,-400);ctx.lineTo(112,-400);ctx.stroke();T(ctx,"A",-270,-300,{w:700,size:30,align:"center",color:"rgba(60,44,30,0.9)"});T(ctx,"B",276,-392,{w:700,size:30,align:"center",color:"rgba(60,44,30,0.9)"});ctx.restore();
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
  T(ctx,text||"A-1042 · issued",x+w/2,y+h/2+(sub?-2:8),{w:800,size:23,align:"center",color:rgba([255,200,200],1)});if(sub)T(ctx,sub,x+w/2,y+h/2+28,{w:600,size:19,align:"center",color:rgba(BAD,1)});ctx.restore();});}
// a calendar card: a title band, a date, and what the date is
function bo_cal(ctx,x,y,title,date,sub,col,a,hi){withA(ctx,a==null?1:a,()=>{glass(ctx,x,y,300,122,14,col,{glow:12+14*(hi||0),ea:0.7,fill:"rgba(7,12,24,0.94)"});
  ctx.save();rr(ctx,x,y,300,122,14);ctx.clip();ctx.fillStyle=rgba(col,0.9);ctx.fillRect(x,y,300,34);ctx.restore();
  T(ctx,title,x+150,y+24,{w:800,size:19,align:"center",color:"#0a1020"});T(ctx,date,x+150,y+78,{w:800,size:30,align:"center",color:rgba(col,1)});if(sub)T(ctx,sub,x+150,y+108,{w:600,size:20,align:"center",color:rgba(SOFT,1)});});}
// a card with a question on it, numbered
function bo_qcard(ctx,x,y,w,n,text,col,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{const lines=wrapT(ctx,text,0,0,w-90,{size:24,w:700,measure:true}),h=Math.max(78,lines.length*31+34);
  if(hi)glow(ctx,x+w/2,y+h/2,w*0.6,col,0.22*hi);glass(ctx,x,y,w,h,16,col,{glow:10+12*(hi||0),ea:0.45+0.5*(hi||0),fill:"rgba(7,12,24,0.93)"});
  ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.arc(x+36,y+h/2,18,0,TAU);ctx.fill();T(ctx,String(n),x+36,y+h/2+7,{w:800,size:20,align:"center",color:"#0a1020"});
  lines.forEach((l,i)=>T(ctx,l,x+68,y+h/2-(lines.length-1)*15.5+8+i*31,{w:700,size:24,color:rgba(INK,0.6+0.4*(hi||0))}));});}
// a freshness scale: seconds, minutes, overnight, a date; o.marks: [[position 0..3, label, colour, row]]
const BO_FRESH=["seconds","minutes","overnight","a date"];
function bo_fresh(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(BO_M,0.9));g.addColorStop(0.5,rgba(BO_ACC,0.8));g.addColorStop(1,rgba(BO_R,0.9));
  ctx.fillStyle=g;rr(ctx,x,y-5,w,10,5);ctx.fill();(o.labels||BO_FRESH).forEach((s,i,arr)=>{const xx=x+w*i/(arr.length-1);ctx.fillStyle=rgba(INK,0.9);ctx.beginPath();ctx.arc(xx,y,8,0,TAU);ctx.fill();T(ctx,s,xx,y+44,{w:700,size:o.ls||22,align:"center",color:rgba(SOFT,1)});});
  const N=(o.labels||BO_FRESH).length,sp=o.sp||50,pos=m=>[x+w*m[0]/(N-1),y-46-(m[3]||0)*sp];
  (o.marks||[]).forEach(m=>{const[xx,yy]=pos(m);ctx.strokeStyle=rgba(m[2],0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xx,y-10);ctx.lineTo(xx,yy+14);ctx.stroke();ctx.fillStyle=rgba(m[2],1);ctx.beginPath();ctx.arc(xx,y,12,0,TAU);ctx.fill();});
  (o.marks||[]).forEach(m=>{const[xx,yy]=pos(m);tag(ctx,xx,yy,m[1],m[2],{align:"center",size:o.ms||20});});});}
// one database with a store of rows and a store of columns inside it, small: the kind of hybrid the name HTAP was coined for
function bo_capsule(ctx,x,y,s,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  glass(ctx,0,0,440,300,28,BO_ACC,{glow:20,ea:0.85,fill:"rgba(8,16,30,0.9)"});dbGlyph(ctx,36,46,BO_ACC,0.9);T(ctx,"one database",76,58,{w:800,size:36,color:rgba(BO_ACC,1)});
  bo_store(ctx,24,88,186,190,"rows",{n:5,t});bo_store(ctx,230,88,186,190,"cols",{n:5,t});arrowTo(ctx,206,183,234,183,BO_ACC,1,{head:10,lw:3});ctx.restore();});}
/* a data contract for the awards, drawn like Silent change's card: what's in it, what it means, how fresh each direction must be,
   and who owns each direction (w × h is 760 × 560; draw it scaled) */
function bo_contract(ctx,x,y,w,h){glass(ctx,x,y,w,h,24,[236,243,255],{glow:24,ea:0.9,fill:"rgba(10,16,32,0.95)"});
  T(ctx,"Data contract · awards",x+36,y+60,{w:800,size:34});stampV(ctx,x+w-40,y+50,"v1.0",0);
  const key=(k,yy)=>T(ctx,k,x+36,yy,{w:700,size:21,color:rgba(SOFT,0.95)}),vx=x+196;
  key("Fields",y+136);T(ctx,"award, learner, status, date",vx,y+136,{w:600,size:23});
  key("Statuses",y+192);T(ctx,"issued · revoked",vx,y+192,{w:600,size:22,f:"mono"});
  key("Meaning",y+248);T(ctx,"revoked = no longer valid;",vx,y+248,{w:600,size:22});T(ctx,"the row stays, with its date",vx,y+280,{w:600,size:22});
  key("Freshness",y+336);T(ctx,"to gold: within 5 minutes",vx,y+336,{w:600,size:23,color:rgba(BO_W,1)});T(ctx,"back to the app: within 15 minutes",vx,y+370,{w:600,size:23,color:rgba(BO_M,1)});
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+26,y+404);ctx.lineTo(x+w-26,y+404);ctx.stroke();
  key("Owners",y+450);[["what the app writes","registrar's team",BO_W,450],["what gold serves back","data team",BO_M,500]].forEach(([k,own,col,yy])=>{T(ctx,k,vx,y+yy,{w:600,size:20,color:rgba(SOFT,0.95)});T(ctx,own,vx+250,y+yy,{w:700,size:22,color:rgba(col,1)});});}

/* ---------- pictures for the labs and the scenarios (site/assets/both-at-once/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW). Every word they show comes from FW.vis,
   so the Spanish pages show Spanish; IDs, numbers and dates stay as they are. Lab pictures use text of 22 px or more, scenario pictures 18 px or more. */
// a small card: a title, and optional lines under it
function bo_lvCard(c,x,y,w,h,col,title,lines,o){o=o||{};glass(c,x,y,w,h,16,col,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});if(title)T(c,title,x+18,y+(o.ty||34),{w:800,size:o.ts||22,color:rgba(col,1)});
  (lines||[]).forEach((l,i)=>T(c,l[0],x+18,y+(o.ly||70)+i*(o.lh||32),{w:l[2]||600,size:l[1]||20,color:l[3]||rgba(INK,0.92),f:l[4]}));}
const LV={
  // Where does it live? Three places an idea's source of truth can be; each item sits where it was put
  where:(c,w,h,st,L)=>{const V=L.vis,lab=L.labs.find(x=>x.id==="where"),items=lab.w.items,zw=296;
    [["write",BO_W,V.zWrite],["read",BO_R,V.zRead],["gold",BO_M,V.zGold]].forEach(([k,col,name],i)=>{const x=16+i*(zw+16);
      glass(c,x,14,zw,h-28,18,col,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.9)"});
      if(k==="write")for(let r=0;r<3;r++){c.fillStyle=rgba(col,0.4);rr(c,x+18,26+r*12,60,7,3);c.fill();}
      if(k==="read")for(let r=0;r<5;r++){c.fillStyle=rgba(col,0.45);rr(c,x+18+r*12,24,7,36,3);c.fill();}
      if(k==="gold"){c.fillStyle=rgba(LAYER.gold,0.9);rr(c,x+18,26,28,32,5);c.fill();arrowTo(c,x+52,42,x+84,42,col,1,{head:10,lw:2.5});}
      T(c,name,x+96,50,{w:800,size:22,color:rgba(col,1)});
      items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]===k).forEach(([it,j],n)=>{const yy=80+n*50,ok=st.checked?it.b===k:null,ec=ok===null?col:ok?GOOD:BAD;
        glass(c,x+12,yy,zw-24,42,12,ec,{glow:8,ea:0.95,fill:"rgba(7,12,24,0.96)"});T(c,it.s,x+26,yy+29,{w:700,size:22});if(ok===true)tick_(c,x+zw-34,yy+21,24,GOOD,1);if(ok===false)cross_(c,x+zw-34,yy+21,20,BAD,1);});});},
  // Apply the changes in order: the log on the left, the reading side's two rows on the right
  log:(c,w,h,st,L)=>{const V=L.vis,s=st.step||0,wrong=s>=4,E=[[1,V.c1,"A-1042"],[2,V.c2,"L-207"],[3,V.c3,"A-1042"]];
    T(c,wrong?V.wrong:V.log,30,44,{w:800,size:26,color:rgba(wrong?BAD:BO_ACC,1)});
    (wrong?[2,0,1]:[0,1,2]).forEach((k,i)=>{const e=E[k],done=wrong||i<s,bad=wrong&&k===2;bo_change(c,30,70+i*72,400,e[0],e[1],e[2],{hi:!wrong&&i===s-1?1:0,bad,col:done?BO_ACC:[150,165,190],fs:24});
      if(done&&!bad)tick_(c,456,98+i*72,28,GOOD,1);if(bad)cross_(c,456,98+i*72,24,BAD,1);});
    glass(c,500,24,436,h-48,20,BO_R,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.93)"});T(c,V.reading,524,64,{w:800,size:26,color:rgba(BO_R,1)});
    const stT=wrong?V.issued:s>=3?V.revoked:s>=1?V.issued:V.none,stC=wrong?BAD:s>=3?BAD:s>=1?INK:SOFT;
    bo_key(c,540,122,1.3,"A-1042",1,s===1||s===3?1:0);T(c,"A-1042",566,130,{f:"mono",w:500,size:24,color:rgba(bo_kc("A-1042"),1)});T(c,V.status,720,130,{w:600,size:22,color:rgba(SOFT,1)});T(c,stT,720,166,{w:800,size:28,color:rgba(stC,1)});
    if(s===3)tick_(c,896,156,30,GOOD,1);
    bo_key(c,540,236,1.3,"L-207",1,s===2?1:0);T(c,"L-207",566,244,{f:"mono",w:500,size:24,color:rgba(bo_kc("L-207"),1)});T(c,V.email,720,244,{w:600,size:22,color:rgba(SOFT,1)});T(c,s>=2||wrong?"aisha@work":"aisha@mail",720,280,{f:"mono",w:500,size:24,color:rgba(s===2?GOOD:INK,1)});
    if(wrong)bo_ghost(c,560,300,320,64,1.2,1,V.back,null);},
  // How fresh? The scale, with each use where it was put
  fresh:(c,w,h,st,L)=>{const V=L.vis,lab=L.labs.find(x=>x.id==="fresh"),W_=lab.w,keys=W_.buckets.map(b=>b[0]),cnt={};
    const marks=W_.items.map((it,j)=>{const k=st.pick[j];if(!k)return null;const i=keys.indexOf(k),row=cnt[k]=(cnt[k]||0)+1,ok=st.checked?it.b===k:null;return[i,it.s,ok===null?BO_ACC:ok?GOOD:BAD,row-1];}).filter(Boolean);
    const maxRow=Math.max(1,...Object.values(cnt));bo_fresh(c,130,h-70,700,{labels:[V.fSec,V.fMin,V.fNight,V.fDate],ls:22,ms:22,sp:Math.min(48,(h-110)/maxRow),marks});},
  // scenarios
  census:(c,w,h,st,L)=>{const V=L.vis;bo_store(c,24,30,240,260,"rows",{title:V.enrolments,sub:V.live,ts:24,ss:19,n:4,p:1});
    bo_lvCard(c,300,36,276,112,BAD,V.today,[[V.dToday,34,800,rgba(BAD,1)]],{ly:92});bo_lvCard(c,300,172,276,112,GOOD,V.census,[[V.dCensus,34,800,rgba(GOOD,1)]],{ly:92});tick_(c,544,236,30,GOOD,1);},
  ghost:(c,w,h,st,L)=>{const V=L.vis;bo_change(c,16,40,300,3,V.sRevoke,"A-1042",{bad:true,fs:22});bo_change(c,16,112,300,1,V.sIssue,"A-1042",{fs:22});
    bo_ghost(c,340,60,244,100,1,1,V.sGhost,V.back);T(c,V.outOfOrder,300,262,{w:700,size:22,align:"center",color:rgba(BAD,1)});},
  delete:(c,w,h,st,L)=>{const V=L.vis;bo_store(c,20,24,270,220,"rows",{title:V.rows,ts:24,n:3,p:0.67});bo_store(c,310,24,270,220,"cols",{title:V.cols,ts:24,n:5,p:1});
    T(c,V.delHere,155,284,{w:700,size:20,align:"center",color:rgba(BO_W,1)});T(c,V.stillHere,445,284,{w:700,size:20,align:"center",color:rgba(BAD,1)});},
  owners:(c,w,h,st,L)=>{const V=L.vis;bo_store(c,20,40,210,210,"rows",{title:V.awards,ts:24,n:4});bo_store(c,370,40,210,210,"cols",{title:V.awards,ts:24,n:4});
    arrowTo(c,240,120,360,120,BO_W,1,{head:14,lw:3});arrowTo(c,360,190,240,190,BO_M,1,{head:14,lw:3});T(c,"?",300,172,{w:800,size:40,align:"center",color:rgba(BAD,1)});T(c,V.twoTeams,300,294,{w:700,size:22,align:"center",color:rgba(SOFT,1)});},
  wallet:(c,w,h,st,L)=>{const V=L.vis;glass(c,24,50,330,200,20,TRUST,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(c,V.wallet,48,94,{w:800,size:24});
    for(let i=0;i<4;i++){const on=i<3;c.fillStyle=on?rgba(TRUST,0.9):"rgba(160,190,240,0.1)";rr(c,48+i*56,120,44,54,8);c.fill();if(!on){c.strokeStyle="rgba(160,190,240,0.5)";c.lineWidth=1.5;rr(c,48+i*56,120,44,54,8);c.stroke();}}
    T(c,V.of4,48,222,{w:800,size:26,color:rgba(TRUST,1)});bo_moon(c,470,96,40,1,0);bo_hourglass(c,470,196,1.6,0.35,BO_AMB,1,0);T(c,V.fedNight,470,286,{w:700,size:22,align:"center",color:rgba(BO_AMB,1)});},
  twodefs:(c,w,h,st,L)=>{const V=L.vis;[[V.app,18,BO_W,24],[V.report,15,BO_R,336]].forEach(([n,v,col,x])=>{glass(c,x,40,240,240,18,col,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(c,n,x+20,80,{w:800,size:24,color:rgba(col,1)});
      wrapT(c,V.credits,x+20,116,200,{w:600,size:19,lh:24,color:rgba(SOFT,1)});T(c,String(v),x+20,256,{w:800,size:60,color:rgba(col,1)});});T(c,"≠",300,176,{w:800,size:48,align:"center",color:rgba(BAD,1)});},
  tagline:(c,w,h,st,L)=>{const V=L.vis;T(c,V.t1,300,112,{w:800,size:36,align:"center"});const w2=tw(c,V.t2,36,800);T(c,V.t2,300,172,{w:800,size:36,align:"center",color:rgba(SOFT,0.7)});bo_strike(c,300-w2/2-4,160,300+w2/2+4,160,1,SOFT,0.8);T(c,V.t3,300,232,{w:800,size:36,align:"center",color:rgba(BO_ACC,1)});},
  serve:(c,w,h,st,L)=>{const V=L.vis;vault(c,380,24,196,272,LAYER.gold,(r,cc)=>hash(r*5+cc,4)<0.6?LAYER.gold:null,null);chip(c,478,86,null,V.gold,null,{align:"center",edge:LAYER.gold,ts:22});
    glass(c,16,70,256,190,18,BO_M,{glow:14,ea:0.9,fill:"rgba(24,8,24,0.92)"});bo_flag(c,48,128,1.3,BO_M,0);T(c,"L-311",96,128,{f:"mono",w:500,size:22,color:rgba(BO_M,1)});wrapT(c,V.flag,36,194,220,{w:700,size:20,lh:26});
    for(let i=0;i<3;i++)arrowTo(c,372,110+i*50,262,110+i*50,BO_M,0.9,{head:12,lw:2.5});}
};
