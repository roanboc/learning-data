/* ===== A person asks: London, 1676, and Westminster, 1679 =====
   The opening's places, painted once (AG_PLACES), in the module's night: the same petrol sky and dark as the hall, the stone and
   brick cool, and the warm light of windows, lanterns and candles, which lights the people too (night.js's "lamp"):
     apYard     Guildhall Yard at evening, June 1676: the Guildhall's front, its porch and tall pointed windows lit, between the
                timber and brick houses of the yard
     apGuild    inside the Guildhall: its tall windows dark, candles, the City's citizens as a soft crowd, and a rail in front
     apGate     the Gatehouse at Westminster at dusk: a stone gate tower, its pointed arch, one barred window lit (drawn as it stood:
                the Abbey's west towers, built in the 1740s, aren't there)
     apCell     a room inside the Gatehouse: stone walls, a barred window high up, the keeper's table and his lantern
     apDoor     a panelled passage, and the tall oak door of the Lord Chief Justice's chambers (the door is drawn live, so it opens)
     apTable    Westminster, 1679: a long table in a panelled room, candles, where the Act is unrolled
   And what is drawn live in them: the warrant, a parchment, the gate and the door that open, a purse, the Act's roll, the page of
   1787, the window's light moving across a wall. Parchment is written in dark ink, at least 28 px, as every word is. */
const AP_WARM=[255,198,122],AP_INK=[50,34,20],AP_PARCH=[232,218,186];
// a pointed (Gothic) arch window or doorway as a path: its foot at y + h, its point at y, w wide, centred on x
function ap_arch(c,x,y,w,h){const r=w*0.62,sy=y+w*0.55;c.moveTo(x-w/2,y+h);c.lineTo(x-w/2,sy);c.quadraticCurveTo(x-w/2,y+w*0.12,x,y);c.quadraticCurveTo(x+w/2,y+w*0.12,x+w/2,sy);c.lineTo(x+w/2,y+h);c.closePath();}
// a lit window: warm glass with mullions, a transom and a little tracery, and its glow on the wall
function ap_litWin(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||AP_WARM;dp_halo(c,x,y+h*0.55,Math.max(w,h)*0.9,col,0.10*a);
  c.save();c.beginPath();ap_arch(c,x,y,w,h);c.clip();const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(mix(col,[255,240,210],0.3),0.95*a));g.addColorStop(1,rgba(mix(col,[160,90,40],0.35),0.95*a));
  c.fillStyle=g;c.fillRect(x-w/2,y,w,h);c.strokeStyle="rgba(28,20,14,0.85)";c.lineWidth=Math.max(2,w*0.045);
  const n=o.lights||3;for(let i=1;i<n;i++){const xx=x-w/2+w*i/n;c.beginPath();c.moveTo(xx,y+h*0.18);c.lineTo(xx,y+h);c.stroke();}
  for(const f of [0.48,0.74]){c.beginPath();c.moveTo(x-w/2,y+h*f);c.lineTo(x+w/2,y+h*f);c.stroke();}
  c.beginPath();c.arc(x,y+w*0.42,w*0.2,0,TAU);c.stroke();c.restore();
  c.save();c.beginPath();ap_arch(c,x,y,w,h);c.strokeStyle="rgba(20,24,26,0.9)";c.lineWidth=Math.max(3,w*0.07);c.stroke();c.restore();}
// a dark window (glass at night) with its bars of lead
function ap_darkWin(c,x,y,w,h,o){o=o||{};c.save();c.beginPath();ap_arch(c,x,y,w,h);c.clip();const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgb(20,48,62)");g.addColorStop(1,"rgb(10,26,34)");
  c.fillStyle=g;c.fillRect(x-w/2,y,w,h);c.fillStyle="rgba(150,210,220,0.10)";c.fillRect(x-w/2,y,w*0.35,h);c.strokeStyle="rgba(8,10,12,0.9)";c.lineWidth=Math.max(2,w*0.04);
  for(let i=1;i<(o.lights||3);i++){const xx=x-w/2+w*i/(o.lights||3);c.beginPath();c.moveTo(xx,y+h*0.16);c.lineTo(xx,y+h);c.stroke();}
  for(let f=0.3;f<1;f+=0.17){c.beginPath();c.moveTo(x-w/2,y+h*f);c.lineTo(x+w/2,y+h*f);c.stroke();}c.restore();
  c.save();c.beginPath();ap_arch(c,x,y,w,h);c.strokeStyle="rgba(70,76,76,0.9)";c.lineWidth=Math.max(3,w*0.06);c.stroke();c.restore();}
// the night sky over London: the hall's petrol, a few stars
function ap_sky(c,hz,seed){const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(6,17,22)");g.addColorStop(0.7,"rgb(14,38,46)");g.addColorStop(1,"rgb(26,58,64)");c.fillStyle=g;c.fillRect(0,0,W,hz);
  const R=ag_rnd(seed||3);for(let i=0;i<70;i++){const x=R()*W,y=R()*hz*0.7,r=0.6+R()*1.4;c.fillStyle="rgba(200,236,236,"+(0.12+R()*0.3).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}}
// cobbles from y0 down, cool and wet, warm light caught in them under each lit window (glints: [x, y, r])
function ap_cobbles(c,y0,glints,seed){const g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,"rgb(30,40,42)");g.addColorStop(1,"rgb(10,18,20)");c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  const R=ag_rnd(seed||5);for(let row=0;row<34;row++){const f=row/34,y=y0+Math.pow(f,1.6)*(H-y0),s=6+f*30;for(let x=-s;x<W+s;x+=s*1.7){const xx=x+(row%2)*s*0.8+R()*s*0.3;
    c.fillStyle="rgba("+(R()<0.5?"60,74,76":"8,14,16")+","+(0.18+R()*0.2).toFixed(3)+")";c.beginPath();c.ellipse(xx,y,s*0.7,s*0.28,0,0,TAU);c.fill();}}
  for(const [x,y,r] of glints||[]){const lg=c.createRadialGradient(x,y,0,x,y,r);lg.addColorStop(0,rgba(AP_WARM,0.22));lg.addColorStop(1,rgba(AP_WARM,0));c.save();c.translate(x,y);c.scale(0.35,1.5);c.translate(-x,-y);c.fillStyle=lg;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}}
// a house of the rebuilt City: brick below, plaster and timber above, a gable, and windows, some lit
function ap_house(c,x,w,top,base,o){o=o||{};const R=ag_rnd(o.seed||9),brick=o.brick||[64,42,38],pl=o.plaster||[66,68,64];
  c.fillStyle=rgba(ag_dk(brick,0.2),1);c.fillRect(x,top+60,w,base-top-60);
  c.fillStyle=rgba(pl,1);c.fillRect(x,top+60,w,(base-top-60)*0.55);c.beginPath();c.moveTo(x-6,top+64);c.lineTo(x+w/2,top-10-(o.gable||40));c.lineTo(x+w+6,top+64);c.closePath();c.fillStyle=rgba(ag_dk(pl,0.12),1);c.fill();
  c.fillStyle="rgb(14,20,22)";c.beginPath();c.moveTo(x-14,top+66);c.lineTo(x+w/2,top-18-(o.gable||40));c.lineTo(x+w+14,top+66);c.lineTo(x+w+14,top+76);c.lineTo(x+w/2,top-6-(o.gable||40));c.lineTo(x-14,top+76);c.closePath();c.fill();
  c.strokeStyle="rgba(22,16,12,0.9)";c.lineWidth=5;for(let i=0;i<=4;i++){const xx=x+w*i/4;c.beginPath();c.moveTo(xx,top+64);c.lineTo(xx,top+60+(base-top-60)*0.55);c.stroke();}
  c.beginPath();c.moveTo(x,top+60+(base-top-60)*0.28);c.lineTo(x+w,top+60+(base-top-60)*0.28);c.stroke();
  const rows=o.rows||2;for(let r=0;r<rows+1;r++){const wy=top+90+r*((base-top-140)/(rows+1));for(let k=0;k<(o.cols||2);k++){const wx=x+w*(k+0.5)/(o.cols||2)-22,lit=R()<(o.lit==null?0.45:o.lit);
    c.fillStyle=lit?rgba(AP_WARM,0.85):"rgb(16,30,36)";c.fillRect(wx,wy,44,58);if(lit)dp_halo(c,wx+22,wy+29,70,AP_WARM,0.10);
    c.strokeStyle="rgba(20,14,10,0.9)";c.lineWidth=3;c.strokeRect(wx,wy,44,58);c.beginPath();c.moveTo(wx+22,wy);c.lineTo(wx+22,wy+58);c.moveTo(wx,wy+29);c.lineTo(wx+44,wy+29);c.stroke();}}
  c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(x+w-10,top+60,10,base-top-60);}
// a lantern hanging from a bracket: its frame and its warm light
function ap_lantern(c,x,y,a){dp_halo(c,x,y+20,190,AP_WARM,0.16*(a==null?1:a));c.strokeStyle="rgb(20,16,14)";c.lineWidth=4;c.beginPath();c.moveTo(x-40,y-30);c.lineTo(x,y-30);c.lineTo(x,y-6);c.stroke();
  c.fillStyle=rgba(mix(AP_WARM,[255,250,220],0.4),1);c.fillRect(x-12,y-6,24,38);c.strokeStyle="rgb(26,20,16)";c.lineWidth=3;c.strokeRect(x-12,y-6,24,38);c.beginPath();c.moveTo(x-16,y-8);c.lineTo(x,y-20);c.lineTo(x+16,y-8);c.closePath();c.fillStyle="rgb(26,20,16)";c.fill();}
// stone blocks, lit warm from (lx, ly)
function ap_stone(c,x,y,w,h,base,lx,ly,seed){const R=ag_rnd(seed||11);c.fillStyle=rgba(base,1);c.fillRect(x,y,w,h);
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(let yy=y,row=0;yy<y+h;yy+=46,row++)for(let xx=x-(row%2)*48;xx<x+w;xx+=96){const v=R()*0.16-0.08;c.fillStyle=rgba(mix(base,v>0?[150,140,120]:[0,0,0],Math.abs(v)),1);c.fillRect(xx+2,yy+2,92,42);}
  if(lx!=null){const g=c.createRadialGradient(lx,ly,0,lx,ly,900);g.addColorStop(0,rgba(AP_WARM,0.20));g.addColorStop(1,rgba(AP_WARM,0));c.fillStyle=g;c.fillRect(x,y,w,h);}
  const sg=c.createLinearGradient(0,y,0,y+h);sg.addColorStop(0,"rgba(0,8,12,0.35)");sg.addColorStop(1,"rgba(0,8,12,0)");c.fillStyle=sg;c.fillRect(x,y,w,h);c.restore();}
// oak panelling, lit warm from (lx, ly)
function ap_panels(c,x,y,w,h,lx,ly){c.fillStyle="rgb(40,28,22)";c.fillRect(x,y,w,h);const pw=150;for(let xx=x+14;xx<x+w;xx+=pw)for(let yy=y+20;yy<y+h-40;yy+=Math.min(300,h/2)){const ph=Math.min(280,h/2-30);
  c.fillStyle="rgb(50,36,28)";rr(c,xx,yy,pw-28,ph,4);c.fill();c.strokeStyle="rgba(10,6,4,0.7)";c.lineWidth=3;c.stroke();c.strokeStyle="rgba(120,88,60,0.25)";c.lineWidth=1.5;rr(c,xx+6,yy+6,pw-40,ph-12,3);c.stroke();}
  const g=c.createRadialGradient(lx,ly,0,lx,ly,1000);g.addColorStop(0,rgba(AP_WARM,0.22));g.addColorStop(1,rgba(AP_WARM,0));c.fillStyle=g;c.fillRect(x,y,w,h);}
// a candle on a sconce or in a holder, and its glow
function ap_candle(c,x,y,a){dp_halo(c,x,y-10,220,AP_WARM,0.18*(a==null?1:a));c.fillStyle="rgb(232,222,196)";c.fillRect(x-6,y,12,34);c.fillStyle="rgb(40,30,22)";c.fillRect(x-14,y+32,28,6);
  const g=c.createRadialGradient(x,y-10,0,x,y-10,14);g.addColorStop(0,"rgba(255,250,220,1)");g.addColorStop(1,"rgba(255,190,90,0)");c.fillStyle=g;c.beginPath();c.ellipse(x,y-9,7,13,0,0,TAU);c.fill();}

/* ---------------------------------------------------------------- the places */
// Guildhall Yard at evening: the Guildhall's front in the middle, the yard's houses either side, the cobbles wet
AG_PLACES.apYard=c=>{const hz=700;ap_sky(c,hz,4);
  c.fillStyle="rgb(10,24,28)";for(let x=-20;x<W;x+=90){const h=40+((x*37)%60);c.fillRect(x,hz-260-h,92,260+h);}
  // the Guildhall: a stone front, two tall windows of the great hall, the porch, and a window over it
  const gx=600,gw=720,top=220;ap_stone(c,gx,top,gw,hz-top,[50,58,60],960,560,7);
  c.fillStyle="rgb(36,44,46)";for(const px of [gx-30,gx+gw-30]){c.fillRect(px,top-80,60,hz-top+80);c.beginPath();c.moveTo(px-6,top-80);c.lineTo(px+30,top-160);c.lineTo(px+66,top-80);c.closePath();c.fill();}
  c.fillStyle="rgb(40,48,50)";for(let x=gx;x<gx+gw;x+=60)c.fillRect(x+6,top-34,34,36);c.fillRect(gx,top-6,gw,12);
  ap_litWin(c,750,300,120,300,{lights:3});ap_litWin(c,1170,300,120,300,{lights:3});ap_litWin(c,960,250,150,170,{lights:4});
  c.save();c.beginPath();ap_arch(c,960,460,200,hz-460);c.fillStyle="rgb(12,10,10)";c.fill();c.clip();dp_halo(c,960,640,220,AP_WARM,0.35);c.restore();
  c.save();c.beginPath();ap_arch(c,960,460,200,hz-460);c.strokeStyle="rgb(70,78,78)";c.lineWidth=10;c.stroke();c.beginPath();ap_arch(c,960,446,232,hz-446);c.strokeStyle="rgba(30,36,38,0.9)";c.lineWidth=6;c.stroke();c.restore();
  // the yard's houses, rebuilt after the fire in brick and timber
  ap_house(c,-30,240,330,hz+40,{seed:21,gable:60,lit:0.5});ap_house(c,200,230,380,hz+30,{seed:22,gable:30,lit:0.6});ap_house(c,400,210,420,hz+20,{seed:23,gable:40,lit:0.4,cols:2,rows:1});
  ap_house(c,1310,210,410,hz+20,{seed:24,gable:40,lit:0.5,rows:1});ap_house(c,1500,230,370,hz+30,{seed:25,gable:50,lit:0.55});ap_house(c,1710,240,320,hz+40,{seed:26,gable:60,lit:0.4});
  ap_cobbles(c,hz,[[750,780,170],[1170,780,170],[960,760,150],[560,800,100],[1400,800,110]],6);
  ap_lantern(c,580,560,1);ap_lantern(c,1340,560,1);
  const hg=c.createLinearGradient(0,hz-120,0,hz+60);hg.addColorStop(0,"rgba(80,150,160,0)");hg.addColorStop(0.7,"rgba(80,150,160,0.07)");hg.addColorStop(1,"rgba(80,150,160,0)");c.fillStyle=hg;c.fillRect(0,hz-120,W,180);};
// inside the Guildhall: the far wall's tall windows, dark now; candles; the citizens; the rail in front of Jenkes
AG_PLACES.apGuild=c=>{c.fillStyle="rgb(14,20,22)";c.fillRect(0,0,W,H);ap_stone(c,0,0,W,760,[44,48,48],1100,520,13);
  for(const x of [380,800,1220,1640])ap_darkWin(c,x,110,170,430,{lights:3});
  c.fillStyle="rgba(8,10,10,0.85)";c.fillRect(0,0,W,70);for(let x=170;x<W;x+=420){c.fillStyle="rgb(18,14,12)";c.fillRect(x-14,0,28,120);}
  for(const [x,y] of [[600,240],[1020,220],[1440,240]]){c.strokeStyle="rgb(26,20,16)";c.lineWidth=3;c.beginPath();c.moveTo(x,0);c.lineTo(x,y);c.stroke();c.beginPath();c.ellipse(x,y,90,16,0,0,TAU);c.stroke();
    for(let k=0;k<7;k++){const a=k/7*TAU,cx=x+Math.cos(a)*90,cy=y+Math.sin(a)*16;ap_candle(c,cx,cy-30,0.5);}}
  // the floor, and the City's citizens as a soft crowd, row behind row, rimmed by the candles
  const fg=c.createLinearGradient(0,700,0,H);fg.addColorStop(0,"rgb(30,28,26)");fg.addColorStop(1,"rgb(12,12,12)");c.fillStyle=fg;c.fillRect(0,700,W,H-700);
  const R=ag_rnd(17);for(let row=0;row<4;row++){const s=0.55+row*0.16,y=640+row*70;for(let x=760+R()*40;x<W+60;x+=(110+R()*40)*s){const dark=mix([16,18,20],[30,26,22],R()*0.5);
    c.fillStyle=rgba(dark,1);c.beginPath();c.ellipse(x,y+170*s,92*s,150*s,0,Math.PI,0);c.fill();c.beginPath();c.ellipse(x,y+40*s,30*s,38*s,0,0,TAU);c.fill();
    c.strokeStyle=rgba(AP_WARM,0.22);c.lineWidth=2.5;c.beginPath();c.arc(x,y+40*s,32*s,-2.6,-0.9);c.stroke();}}
  const hz=c.createLinearGradient(0,600,0,900);hz.addColorStop(0,"rgba(255,200,130,0)");hz.addColorStop(0.6,"rgba(255,200,130,0.05)");hz.addColorStop(1,"rgba(255,200,130,0)");c.fillStyle=hz;c.fillRect(0,600,W,300);
  // the rail Jenkes stands behind
  const ry=AP_RAIL;c.fillStyle="rgb(46,30,20)";c.fillRect(0,ry,880,30);c.fillStyle="rgba(255,200,130,0.25)";c.fillRect(0,ry,880,4);c.fillStyle="rgb(34,22,16)";for(let x=20;x<880;x+=64){c.fillRect(x,ry+30,22,H-ry-30);}
  c.fillStyle="rgb(40,26,18)";c.fillRect(0,ry+30,880,16);c.fillRect(870,ry,22,H-ry);};
const AP_RAIL=846;
// the Gatehouse at Westminster at dusk: a gate tower, its arch, one barred window lit, a lantern; the gate is drawn live
const AP_GATE={x:960,y:470,w:270,foot:780};
AG_PLACES.apGate=c=>{const hz=AP_GATE.foot;ap_sky(c,hz,8);
  c.fillStyle="rgb(12,26,30)";c.fillRect(0,hz-300,W,300);c.fillStyle="rgb(16,32,36)";for(let x=-40;x<W;x+=180){const h=120+((x*53)%140);c.fillRect(x,hz-h-160,170,h+160);}
  ap_stone(c,640,190,640,hz-190,[54,58,58],960,500,19);
  for(const tx of [560,1280]){ap_stone(c,tx,120,140,hz-120,[48,52,52],960,500,23+tx);c.fillStyle="rgb(46,50,50)";for(let k=0;k<3;k++)c.fillRect(tx+k*50,90,36,32);
    c.fillStyle="rgb(14,22,26)";c.fillRect(tx+60,260,18,70);c.fillRect(tx+60,470,18,70);}
  c.fillStyle="rgb(50,54,54)";for(let x=640;x<1280;x+=64)c.fillRect(x+8,160,40,32);
  // the one lit window, barred
  const wx=960,wy=290;dp_halo(c,wx,wy+50,260,AP_WARM,0.16);c.fillStyle=rgba(AP_WARM,0.9);c.fillRect(wx-50,wy,100,110);c.fillStyle="rgb(20,16,14)";for(let k=0;k<5;k++)c.fillRect(wx-48+k*24,wy,6,110);c.fillRect(wx-50,wy+52,100,6);
  c.strokeStyle="rgb(36,40,40)";c.lineWidth=8;c.strokeRect(wx-54,wy-4,108,118);
  // the arch's voussoirs; its dark passage (the gate is drawn live)
  const g=AP_GATE;c.save();c.beginPath();ap_arch(c,g.x,g.y,g.w+60,hz-g.y+30);c.fillStyle="rgb(40,44,44)";c.fill();c.restore();
  c.save();c.beginPath();ap_arch(c,g.x,g.y,g.w,hz-g.y);c.fillStyle="rgb(8,10,12)";c.fill();c.restore();
  ap_lantern(c,1190,540,1);ap_cobbles(c,hz,[[1190,850,160],[960,840,120]],9);
  const hg=c.createLinearGradient(0,hz-140,0,hz+40);hg.addColorStop(0,"rgba(80,150,160,0)");hg.addColorStop(0.7,"rgba(80,150,160,0.08)");hg.addColorStop(1,"rgba(80,150,160,0)");c.fillStyle=hg;c.fillRect(0,hz-140,W,180);};
// a room in the Gatehouse: stone walls, a barred window high on the right, the keeper's table and lantern
const AP_WIN={x:1440,y:150,w:240,h:200};
AG_PLACES.apCell=c=>{ap_stone(c,0,0,W,H,[50,50,48],960,760,29);
  const w=AP_WIN;c.fillStyle="rgb(24,26,26)";c.fillRect(w.x-20,w.y-20,w.w+40,w.h+40);const sg=c.createLinearGradient(0,w.y,0,w.y+w.h);sg.addColorStop(0,"rgb(12,34,44)");sg.addColorStop(1,"rgb(26,58,66)");
  c.fillStyle=sg;c.fillRect(w.x,w.y,w.w,w.h);c.fillStyle="rgb(18,18,18)";for(let k=0;k<6;k++)c.fillRect(w.x+18+k*40,w.y,9,w.h);c.fillRect(w.x,w.y+w.h/2-4,w.w,9);
  c.fillStyle="rgba(150,210,220,0.10)";c.fillRect(w.x+w.w,w.y+w.h,60,6);
  // the floor and the table
  const fg=c.createLinearGradient(0,880,0,H);fg.addColorStop(0,"rgb(34,30,26)");fg.addColorStop(1,"rgb(16,14,12)");c.fillStyle=fg;c.fillRect(0,880,W,H-880);
  c.fillStyle="rgb(60,40,26)";c.beginPath();c.moveTo(700,880);c.lineTo(1220,880);c.lineTo(1250,920);c.lineTo(670,920);c.closePath();c.fill();c.fillStyle="rgba(255,200,130,0.18)";c.fillRect(700,880,520,4);
  c.fillStyle="rgb(40,26,18)";c.fillRect(670,920,580,40);c.fillRect(690,960,34,120);c.fillRect(1196,960,34,120);
  ap_lantern(c,1000,846,1);c.fillStyle="rgb(28,22,18)";c.fillRect(980,876,40,6);};
// a panelled passage at Westminster Hall: candles on the wall, and the frame of a tall door (the door is drawn live)
const AP_DOOR={x:1110,y:220,w:330,h:640};
AG_PLACES.apDoor=c=>{ap_panels(c,0,0,W,880,1270,420);const d=AP_DOOR;
  c.fillStyle="rgb(26,18,14)";c.fillRect(d.x-34,d.y-40,d.w+68,d.h+40);c.fillStyle="rgb(58,40,28)";c.fillRect(d.x-34,d.y-40,d.w+68,14);
  c.fillStyle="rgb(6,4,4)";c.fillRect(d.x,d.y,d.w,d.h);
  const fg=c.createLinearGradient(0,860,0,H);fg.addColorStop(0,"rgb(44,32,24)");fg.addColorStop(1,"rgb(16,12,10)");c.fillStyle=fg;c.fillRect(0,860,W,H-860);
  c.strokeStyle="rgba(10,6,4,0.6)";c.lineWidth=2;for(let x=-400;x<W+400;x+=120){c.beginPath();c.moveTo(960+(x-960)*0.4,860);c.lineTo(x,H);c.stroke();}
  for(const x of [760,1700])ap_candle(c,x,430,1);};
// Westminster, 1679: a long table in a panelled room, candles; the Act is unrolled on it
AG_PLACES.apTable=c=>{ap_panels(c,0,0,W,560,960,300);for(const x of [340,960,1580])ap_candle(c,x,250,1);
  const g=c.createLinearGradient(0,520,0,H);g.addColorStop(0,"rgb(34,50,42)");g.addColorStop(1,"rgb(14,24,20)");c.fillStyle=g;c.beginPath();c.moveTo(330,520);c.lineTo(1590,520);c.lineTo(2100,H);c.lineTo(-180,H);c.closePath();c.fill();
  c.fillStyle="rgba(255,200,130,0.16)";c.beginPath();c.moveTo(330,520);c.lineTo(1590,520);c.lineTo(1600,528);c.lineTo(320,528);c.closePath();c.fill();
  const lg=c.createRadialGradient(960,640,0,960,640,700);lg.addColorStop(0,"rgba(255,200,130,0.12)");lg.addColorStop(1,"rgba(255,200,130,0)");c.fillStyle=lg;c.fillRect(0,520,W,H-520);
  c.fillStyle="rgb(18,14,12)";c.fillRect(0,520,330,H-520);c.fillRect(1590,520,W-1590,H-520);};

/* ---------------------------------------------------------------- what is drawn live */
// a sheet of parchment: its edges darker, a few fibres; o.seal [x, y] a red wax seal on it, o.ribbon a green ribbon down to it
function ap_parch(c,x,y,w,h,o){o=o||{};c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=26;c.shadowOffsetY=8;c.fillStyle=rgba(AP_PARCH,1);c.fillRect(x,y,w,h);c.restore();
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();const g=c.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*0.3,x+w/2,y+h/2,Math.max(w,h)*0.75);g.addColorStop(0,"rgba(255,248,226,0.25)");g.addColorStop(1,"rgba(150,110,60,0.35)");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.strokeStyle="rgba(150,120,80,0.12)";c.lineWidth=1;for(let i=0;i<14;i++){const yy=y+h*((i*0.137+0.05)%1);c.beginPath();c.moveTo(x,yy);c.bezierCurveTo(x+w*0.3,yy+6,x+w*0.6,yy-6,x+w,yy+3);c.stroke();}c.restore();
  if(o.ribbon){const [sx,sy]=o.ribbon;c.fillStyle="rgb(40,110,70)";c.beginPath();c.moveTo(sx-10,y);c.lineTo(sx+10,y);c.lineTo(sx+14,sy);c.lineTo(sx-14,sy);c.closePath();c.fill();}
  if(o.seal)ap_seal(c,o.seal[0],o.seal[1],o.sealR||30,o.sealP==null?1:o.sealP);}
// a wax seal, pressed: p from 0 (a drop) to 1 (pressed flat, with its rim)
function ap_seal(c,x,y,r,p){if(p<=0)return;const k=lerp(0.5,1,ag_eo(p));c.save();c.shadowColor="rgba(0,0,0,0.45)";c.shadowBlur=8;c.shadowOffsetY=3;c.fillStyle="rgb(150,32,28)";c.beginPath();
  for(let i=0;i<=24;i++){const a=i/24*TAU,rr2=r*k*(1+0.08*Math.sin(i*2.7));i?c.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2):c.moveTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2);}c.closePath();c.fill();c.restore();
  if(p>0.5){c.strokeStyle="rgba(90,14,12,0.8)";c.lineWidth=3;c.beginPath();c.arc(x,y,r*0.62,0,TAU);c.stroke();c.fillStyle="rgba(230,120,100,0.35)";c.beginPath();c.arc(x-r*0.3,y-r*0.3,r*0.22,0,TAU);c.fill();}}
// words in ink on parchment
function ap_ink(c,s,x,y,o){o=o||{};dp_T(c,s,x,y,Object.assign({w:o.w||600,size:o.size||30,col:AP_INK},o));}
// the warrant of the King's Council, 28 June 1676: sealed; a, k (springs in)
function ap_warrant(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||640,h=o.h||330;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.7,1,o.k));
  c.save();c.translate(x+w/2,y+h/2);c.rotate(-0.02);c.translate(-x-w/2,-y-h/2);ap_parch(c,x,y,w,h,{seal:[x+w-80,y+h-70],sealR:34,sealP:o.seal});
  ap_ink(c,"By the King's Council",x+44,y+66,{w:700,size:30});ap_ink(c,"Keep him until delivered",x+44,y+136,{w:600,size:34});ap_ink(c,"by due course of law",x+44,y+186,{w:600,size:34});
  ap_ink(c,"28 June 1676",x+44,y+268,{w:600,size:28});c.restore();c.restore();}
// the Gatehouse's gate: two oak leaves, shut (u 0) or open (u 1) on warm light
function ap_gate(c,u,o){o=o||{};const g=AP_GATE,h=g.foot-g.y;c.save();c.beginPath();ap_arch(c,g.x,g.y,g.w,h);c.clip();
  if(u>0){const lg=c.createLinearGradient(0,g.y,0,g.foot);lg.addColorStop(0,rgba([255,226,170],0.9*u));lg.addColorStop(1,rgba([255,190,110],0.7*u));c.fillStyle=lg;c.fillRect(g.x-g.w/2,g.y,g.w,h);}
  const lw=g.w/2*(1-0.82*ag_sine(u));for(const s of [-1,1]){const x0=s<0?g.x-g.w/2:g.x+g.w/2-lw;c.fillStyle="rgb(52,36,24)";c.fillRect(x0,g.y,lw,h);
    c.strokeStyle="rgba(16,10,6,0.85)";c.lineWidth=3;for(let k=1;k<5;k++){const xx=x0+lw*k/5;c.beginPath();c.moveTo(xx,g.y);c.lineTo(xx,g.foot);c.stroke();}
    c.fillStyle="rgb(26,22,20)";for(const yy of [g.y+90,g.y+200]){c.fillRect(x0,yy,lw,12);for(let k=0;k<4;k++){c.beginPath();c.arc(x0+lw*(k+0.5)/4,yy+6,4,0,TAU);c.fillStyle="rgb(70,64,58)";c.fill();c.fillStyle="rgb(26,22,20)";}}}
  c.restore();if(u>0)dp_halo(c,g.x,g.foot-60,360,[255,210,140],0.25*u);}
// the tall oak door of the Lord Chief Justice's chambers, shut (u 0) or open (u 1) on warm light; its brass plate
function ap_door(c,u,o){o=o||{};const d=AP_DOOR;c.save();c.beginPath();c.rect(d.x,d.y,d.w,d.h);c.clip();
  if(u>0){const lg=c.createLinearGradient(d.x,0,d.x+d.w,0);lg.addColorStop(0,rgba([255,214,150],0.85*u));lg.addColorStop(1,rgba([255,190,110],0.55*u));c.fillStyle=lg;c.fillRect(d.x,d.y,d.w,d.h);}c.restore();
  const k=1-0.78*ag_sine(u),dw=d.w*k,sk=40*ag_sine(u);c.save();c.fillStyle="rgb(70,46,30)";c.beginPath();c.moveTo(d.x,d.y);c.lineTo(d.x+dw,d.y+sk);c.lineTo(d.x+dw,d.y+d.h-sk*0.4);c.lineTo(d.x,d.y+d.h);c.closePath();c.fill();
  c.clip();const sh=c.createLinearGradient(d.x,0,d.x+d.w,0);sh.addColorStop(0,"rgba(255,200,130,0.10)");sh.addColorStop(1,"rgba(0,0,0,0.25)");c.fillStyle=sh;c.fillRect(d.x,d.y,d.w,d.h);
  c.strokeStyle="rgba(20,12,8,0.8)";c.lineWidth=4;for(const [py,ph] of [[40,190],[260,150],[440,170]])for(const px of [0.08,0.54]){c.strokeRect(d.x+dw*px,d.y+py,dw*0.38,ph);}
  c.restore();if(u<0.5){c.save();c.globalAlpha*=1-ag_in(u,0.1,0.3);ap_plate(c,d.x+d.w/2,d.y+250);c.restore();c.fillStyle="rgb(196,160,92)";c.beginPath();c.arc(d.x+d.w-46,d.y+d.h/2+60,9,0,TAU);c.fill();}}
function ap_plate(c,x,y){const w=300,h=56;c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=6;c.shadowOffsetY=2;const g=c.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,"rgb(222,190,118)");g.addColorStop(1,"rgb(176,138,70)");
  c.fillStyle=g;rr(c,x-w/2,y-h/2,w,h,6);c.fill();c.restore();dp_T(c,"Lord Chief Justice",x,y+10,{w:700,size:28,align:"center",col:[44,28,8]});}
// a folded paper (the friends' plea for the writ) that slides under the door and comes back: u 0 to 1 to 2
function ap_plea(c,u){if(u<=0||u>=2)return;const d=AP_DOOR,go=u<1?ag_sine(u):ag_sine(2-u),x=lerp(d.x-380,d.x-40,go),y=d.y+d.h-34;c.save();c.beginPath();c.rect(0,0,d.x+4,H);c.clip();
  c.translate(x,y);c.transform(1,0,-0.6,0.35,0,0);c.fillStyle=rgba(AP_PARCH,1);c.shadowColor="rgba(0,0,0,0.4)";c.shadowBlur=10;c.fillRect(-90,-60,180,120);c.shadowBlur=0;c.strokeStyle="rgba(120,90,50,0.6)";c.lineWidth=2;c.beginPath();c.moveTo(0,-60);c.lineTo(0,60);c.stroke();c.restore();}
// a leather purse, its coins showing
function ap_purse(c,x,y,s,a){if(a<=0)return;c.save();c.globalAlpha*=a==null?1:a;c.translate(x,y);c.scale(s,s);c.shadowColor="rgba(0,0,0,0.45)";c.shadowBlur=12;c.shadowOffsetY=4;
  c.fillStyle="rgb(96,64,38)";c.beginPath();c.moveTo(-50,-18);c.bezierCurveTo(-74,10,-60,52,0,54);c.bezierCurveTo(60,52,74,10,50,-18);c.closePath();c.fill();c.shadowBlur=0;
  c.fillStyle="rgb(70,46,28)";c.beginPath();c.ellipse(0,-20,52,12,0,0,TAU);c.fill();c.strokeStyle="rgb(40,26,16)";c.lineWidth=4;c.beginPath();c.moveTo(-40,-14);c.bezierCurveTo(-20,-4,20,-4,40,-14);c.stroke();
  for(const [cx,cy] of [[-14,-28],[10,-32],[28,-24]]){c.fillStyle="rgb(196,196,188)";c.beginPath();c.ellipse(cx,cy,14,6,0,0,TAU);c.fill();c.strokeStyle="rgba(90,90,86,0.8)";c.lineWidth=1.5;c.stroke();}
  c.fillStyle="rgba(255,220,170,0.18)";c.beginPath();c.ellipse(-22,10,14,22,0.3,0,TAU);c.fill();c.restore();}
// the Act's roll, unrolling down the table: u 0 (rolled) to 1; its title and its seal
function ap_roll(c,x,y,w,hmax,u,o){o=o||{};if(u<=0)return;const h=Math.max(40,hmax*ag_sine(u));c.save();
  ap_parch(c,x,y,w,h,{ribbon:[x+w-120,y+h*0.25],seal:h>hmax*0.5?[x+w-120,y+Math.min(h-60,hmax*0.4)]:null,sealR:36});
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();const ta=ag_in(u,0.35,0.3);if(ta>0){c.globalAlpha*=ta;ap_ink(c,"An Act for the better securing",x+48,y+80,{w:700,size:34});ap_ink(c,"the Liberty of the Subject",x+48,y+128,{w:700,size:34});
    ap_ink(c,"Westminster, 1679",x+48,y+186,{w:600,size:28});for(let i=0;i<5;i++){c.fillStyle="rgba(50,34,20,0.30)";c.fillRect(x+48,y+232+i*34,(w-260)*(0.7+0.3*((i*7)%5)/5),5);}}c.restore();
  const ry=y+h;c.fillStyle="rgb(214,196,160)";rr(c,x-6,ry-18,w+12,36,18);c.fill();c.strokeStyle="rgba(120,90,50,0.6)";c.lineWidth=2;c.stroke();c.restore();}
// a page of the United States Constitution, 1787: Article I, Section 9
function ap_page1787(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=760,h=360;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.8,1,o.k));
  ap_parch(c,x,y,w,h);ap_ink(c,"United States Constitution · 1787",x+44,y+70,{w:800,size:34});c.fillStyle="rgba(50,34,20,0.45)";c.fillRect(x+44,y+92,w-88,2);
  ap_ink(c,"“The privilege of the writ of",x+44,y+160,{w:600,size:32});ap_ink(c,"habeas corpus shall not be",x+44,y+206,{w:600,size:32});ap_ink(c,"suspended…”",x+44,y+252,{w:600,size:32});
  ap_ink(c,"Article I, Section 9",x+44,y+316,{w:600,size:28});c.restore();}
// the days going by: the cell's window lit and dark again, its light falling through the bars to the floor, the sun moving along (d the day)
function ap_dayLight(c,d,a){if(a<=0)return;const f=d%1,b=a*Math.sin(Math.PI*clamp(f,0,1));if(b<=0.002)return;const w=AP_WIN;c.save();c.globalCompositeOperation="lighter";c.globalAlpha*=b;
  const pane=k=>[k?18+(k-1)*40+9:0,k<6?18+k*40:w.w];
  c.fillStyle="rgba(255,236,196,0.5)";for(let k=0;k<7;k++){const [u0,u1]=pane(k);c.fillRect(w.x+u0,w.y,u1-u0,w.h);}
  const sx=lerp(1180,720,f),top=w.y+w.h,bw=380;c.beginPath();
  for(let k=0;k<7;k++){const [u0,u1]=pane(k);c.moveTo(w.x+u0,top);c.lineTo(w.x+u1,top);c.lineTo(sx-bw/2+u1/w.w*bw,H);c.lineTo(sx-bw/2+u0/w.w*bw,H);c.closePath();}
  const g=c.createLinearGradient(0,top,0,H);g.addColorStop(0,"rgba(255,226,170,0.24)");g.addColorStop(1,"rgba(255,226,170,0.04)");c.fillStyle=g;c.fill();
  c.restore();}
