/* ===== Network, storage and keys: Rome in the year 97 =====
   The opening story's places and people, painted in the module's night light (Night glass): Rome at dawn, under the same petrol sky,
   its stone cool and its windows warm, the water pale silver glass, never cyan (cyan is an identity). Three places, each painted once
   (AG_PLACES): the aqueduct crossing its valley, with the ground cut away to show a channel under a field (nwAqueduct); a distribution
   tank, its front cut away to show the basin and the bronze nozzles in its wall (nwTank); and a street of shops, with the paving cut
   away to show the pipe beneath, beside a public basin (nwStreet). What changes is drawn live: the water's shimmer, the holes in the
   channel (coral, denied), the pipes, the people. People are the agent films' (people.js), lit at dawn (NW_DAWN), arms down, a hand
   only on what the story is about: Frontinus's tablet, a jar, a workman's tablet.
   Sources: Frontinus, The Aqueducts of Rome, trans. C. E. Bennett, Loeb 1925 (I.1, I.4, I.36, II.64, 74, 75, 87, 88, 105, 106, 115,
   117), checked 5 November 2026; the script's rigour sheet says which line rests on which. Every name here starts with nw_ or NW_. */

/* ---------------------------------------------------------------- the light and the colours of Rome at dawn */
// people at dawn: a soft warm key from the east, in front of them, the shade cool, and the glass's cool rim behind
const NW_DAWN={key:[720,440],kr:820,kk:1.0,amb:0.34,kc:[1.10,0.99,0.88],shade:[0.66,0.82,0.99],rim:[150,206,228],rimA:0.62,rimW:5};
const NW_C={
  sky0:[7,20,26],sky1:[18,44,52],sky2:[58,74,74],dawn:[240,172,116],
  hillFar:[26,50,56],hillNear:[16,34,38],
  stone:[92,104,106],stoneHi:[168,162,146],stoneDk:[40,48,50],brick:[104,82,70],
  earth:[30,30,28],earthDk:[18,20,20],field:[34,52,44],
  water:[196,214,218],waterDk:[120,140,146],
  bronze:[176,128,70],bronzeHi:[236,190,120],lead:[104,112,118],leadHi:[170,178,184],
  wood:[78,58,44],warm:[255,200,130],plaster:[118,112,102]
};
// a smooth line of hills: y at x, from a few sines (seeded), between y0 and y0 - amp
function nw_ridge(x,seed,y0,amp){const R=ag_rnd(seed),a=[R(),R(),R(),R()],p=[R()*6,R()*6,R()*6,R()*6];
  return y0-amp*(0.42+0.28*Math.sin(x/410+p[0])*a[0]+0.18*Math.sin(x/190+p[1])*a[1]+0.08*Math.sin(x/77+p[2])*a[2]+0.04*Math.sin(x/31+p[3])*a[3]);}
function nw_fillRidge(c,seed,y0,amp,col,x0,x1,yb){c.beginPath();c.moveTo(x0,yb);for(let x=x0;x<=x1;x+=8)c.lineTo(x,nw_ridge(x,seed,y0,amp));c.lineTo(x1,yb);c.closePath();c.fillStyle=col;c.fill();}
// the sky: petrol night at the top, going to dawn low in the east (the right), and the last stars
function nw_sky(c,hz,o){o=o||{};let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(NW_C.sky0,1));g.addColorStop(0.62,rgba(NW_C.sky1,1));g.addColorStop(1,rgba(NW_C.sky2,1));c.fillStyle=g;c.fillRect(0,0,W,hz);
  const ex=o.east==null?1560:o.east,dg=c.createRadialGradient(ex,hz,0,ex,hz,1000);dg.addColorStop(0,rgba(NW_C.dawn,0.46));dg.addColorStop(0.35,"rgba(214,140,104,0.17)");dg.addColorStop(1,"rgba(200,130,100,0)");
  c.fillStyle=dg;c.fillRect(0,0,W,hz);const R=ag_rnd(o.seed||5);
  for(let i=0;i<60;i++){const x=R()*W*0.8,y=R()*hz*0.5,r=0.6+R()*1.5;c.fillStyle="rgba(205,235,238,"+(0.12+R()*0.3).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}}
// stone blocks: a face of courses, each block a little lighter or darker, lit from above-right at dawn
function nw_blocks(c,x,y,w,h,o){o=o||{};const R=ag_rnd(o.seed||11),bh=o.bh||26,bw=o.bw||64,base=o.col||NW_C.stone;c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.fillStyle=rgba(ag_dk(base,0.25),1);c.fillRect(x,y,w,h);
  for(let j=0,yy=y;yy<y+h;j++,yy+=bh){const off=(j%2)*bw/2;for(let xx=x-off;xx<x+w;xx+=bw){const k=0.82+R()*0.3;c.fillStyle=rgba(base.map(v=>clamp(v*k,0,255)),1);c.fillRect(xx+1.5,yy+1.5,bw-3,bh-3);}}
  const g=c.createLinearGradient(x,y,x+w*0.3,y+h);g.addColorStop(0,rgba(NW_C.dawn,o.lit==null?0.10:o.lit));g.addColorStop(1,"rgba(0,0,0,0.25)");c.fillStyle=g;c.fillRect(x,y,w,h);c.restore();}
// earth, cut away: soft strata and a few stones
function nw_earth(c,x,y,w,h,seed){const R=ag_rnd(seed||3);let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(NW_C.earth,1));g.addColorStop(1,rgba(NW_C.earthDk,1));c.fillStyle=g;c.fillRect(x,y,w,h);
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(let k=0;k<7;k++){const yy=y+12+k*h/7+R()*10;c.strokeStyle="rgba(70,66,58,"+(0.10+R()*0.12).toFixed(3)+")";c.lineWidth=2+R()*5;c.beginPath();
    for(let xx=x;xx<=x+w;xx+=24){const v=yy+Math.sin(xx/(140+k*30)+k)*6;xx===x?c.moveTo(xx,v):c.lineTo(xx,v);}c.stroke();}
  for(let i=0;i<w*h/9000;i++){const sx=x+R()*w,sy=y+R()*h,r=2+R()*7;c.fillStyle="rgba(84,80,72,"+(0.18+R()*0.25).toFixed(3)+")";c.beginPath();c.ellipse(sx,sy,r,r*0.7,R()*3,0,TAU);c.fill();}c.restore();}
// a cut edge of light along the top of cut-away ground
function nw_cutEdge(c,x0,x1,y){c.save();c.strokeStyle="rgba(190,245,245,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();c.restore();}
// a warm window in a far wall
function nw_window(c,x,y,w,h,a){c.save();c.shadowColor=rgba(NW_C.warm,0.8);c.shadowBlur=14;c.fillStyle=rgba(NW_C.warm,a||0.7);c.fillRect(x,y,w,h);c.restore();}

/* ---------------------------------------------------------------- the aqueduct and the channel under the field */
// where the channel runs, under the field, in the frame (nwAqueduct): its stone sides, its inside, and the water's top
const NW_CH={y0:672,y1:806,inner0:704,inner1:790,water:748,x0:0,x1:W,surf:600,shaft:1690};
function nw_paintAqueduct(c){const hz=478;nw_sky(c,hz,{east:1560,seed:5});
  nw_fillRidge(c,21,hz-40,190,rgba(NW_C.hillFar,1),0,W,hz+30);
  // the city far off on the right: roofs and a temple's pediment, a few warm windows
  c.save();const R=ag_rnd(31);for(let i=0;i<26;i++){const x=1380+i*22+R()*14,w=30+R()*46,h=20+R()*58,y=hz-h+6;c.fillStyle=rgba(mix(NW_C.hillFar,[60,66,66],0.4+R()*0.3),1);c.fillRect(x,y,w,h+30);
    if(R()<0.5)nw_window(c,x+6+R()*(w-16),y+8+R()*(h-14),5,7,0.55+R()*0.3);}
  c.fillStyle=rgba(mix(NW_C.hillFar,[80,84,82],0.5),1);c.beginPath();c.moveTo(1640,hz-96);c.lineTo(1700,hz-126);c.lineTo(1760,hz-96);c.closePath();c.fill();c.fillRect(1648,hz-96,104,70);c.restore();
  nw_fillRidge(c,22,hz+16,120,rgba(NW_C.hillNear,1),0,1500,hz+60);
  // the arches: a long arcade crossing the valley, nearer and taller on the left, receding to the city; one wall of stone with its
  // openings left out (so the hills show through them), lit by the dawn on its east faces, hazier as it goes
  const A=u=>({x:lerp(56,1460,u),top:lerp(292,404,u),base:lerp(566,488,u)}),N=22;c.save();c.beginPath();
  for(let i=0;i<=N*4;i++){const q=A(i/(N*4));i?c.lineTo(q.x,q.top):c.moveTo(q.x,q.top);}for(let i=N*4;i>=0;i--){const q=A(i/(N*4));c.lineTo(q.x,q.base);}c.closePath();
  for(let i=0;i<N;i++){const u0=Math.pow(i/N,0.92),u1=Math.pow((i+1)/N,0.92),a=A(u0),b=A(u1),pw=(b.x-a.x)*0.26,x0=a.x+pw,x1=b.x,top=lerp(a.top,b.top,0.5)+(lerp(a.base,b.base,0.5)-lerp(a.top,b.top,0.5))*0.2,r=(x1-x0)/2,bot=lerp(a.base,b.base,0.5);
    c.moveTo(x0,bot);c.lineTo(x0,top+r);c.arc(x0+r,top+r,r,Math.PI,0);c.lineTo(x1,bot);c.closePath();}
  const ag=c.createLinearGradient(56,0,1460,0);ag.addColorStop(0,rgba([92,100,100],1));ag.addColorStop(1,rgba([58,70,72],1));c.fillStyle=ag;c.fill("evenodd");
  c.clip("evenodd");const R3=ag_rnd(33);for(let k=0;k<26;k++){const y=290+k*11;c.strokeStyle="rgba(20,28,30,"+(0.16+R3()*0.1).toFixed(3)+")";c.lineWidth=1.2;c.beginPath();c.moveTo(56,y);c.lineTo(1460,y+(k*1.5));c.stroke();}
  // each pier's east face catches the dawn
  for(let i=0;i<=N;i++){const u=Math.pow(i/N,0.92),a=A(u),pw=(i<N?A(Math.pow((i+1)/N,0.92)).x-a.x:20)*0.26;const lg=c.createLinearGradient(a.x,0,a.x+pw,0);lg.addColorStop(0,"rgba(240,172,116,0)");lg.addColorStop(1,"rgba(240,172,116,"+(0.20-0.1*u).toFixed(3)+")");c.fillStyle=lg;c.fillRect(a.x,a.top,pw,a.base-a.top);}
  const hz2=c.createLinearGradient(56,0,1460,0);hz2.addColorStop(0,"rgba(60,90,96,0)");hz2.addColorStop(1,"rgba(60,90,96,0.35)");c.fillStyle=hz2;c.fillRect(56,280,1410,300);c.restore();
  // the channel's covered top along the arcade, its edge lit
  c.save();c.strokeStyle=rgba(NW_C.dawn,0.55);c.lineWidth=2;c.beginPath();c.moveTo(56,A(0).top);c.lineTo(1460,A(1).top);c.stroke();
  c.fillStyle="rgba(20,28,30,0.5)";c.beginPath();c.moveTo(56,A(0).top+22);c.lineTo(1460,A(1).top+11);c.lineTo(1460,A(1).top+13);c.lineTo(56,A(0).top+25);c.closePath();c.fill();c.restore();
  // the valley floor, then the field in front, its far edge in the dawn's light
  let g=c.createLinearGradient(0,hz+20,0,NW_CH.surf);g.addColorStop(0,"rgb(26,44,42)");g.addColorStop(1,rgba(NW_C.field,1));c.fillStyle=g;c.fillRect(0,hz+20,W,NW_CH.surf-hz-20);
  nw_fillRidge(c,24,hz+70,40,"rgb(22,38,36)",0,W,NW_CH.surf+2);
  const R2=ag_rnd(41);for(let i=0;i<900;i++){const x=R2()*W,y=NW_CH.surf-4-R2()*70,h=4+R2()*9;c.strokeStyle="rgba("+(60+R2()*40|0)+","+(84+R2()*40|0)+","+(66+R2()*20|0)+","+(0.25+R2()*0.35).toFixed(2)+")";c.lineWidth=1.4;c.beginPath();c.moveTo(x,y);c.lineTo(x+R2()*4-2,y-h);c.stroke();}
  // the ground, cut away under the field; the channel in it, stone on both sides and a slab over it; the access shaft
  nw_earth(c,0,NW_CH.surf,W,H-NW_CH.surf,3);nw_cutEdge(c,0,W,NW_CH.surf);
  nw_blocks(c,0,NW_CH.y0,W,NW_CH.inner0-NW_CH.y0,{seed:12,bh:16,bw:70,lit:0.06});nw_blocks(c,0,NW_CH.inner1,W,NW_CH.y1-NW_CH.inner1,{seed:13,bh:16,bw:70,lit:0.03});
  g=c.createLinearGradient(0,NW_CH.inner0,0,NW_CH.inner1);g.addColorStop(0,"rgb(10,16,18)");g.addColorStop(1,"rgb(18,26,28)");c.fillStyle=g;c.fillRect(0,NW_CH.inner0,W,NW_CH.inner1-NW_CH.inner0);
  const sx=NW_CH.shaft;nw_blocks(c,sx-34,NW_CH.surf,14,NW_CH.inner0-NW_CH.surf,{seed:14,bh:18,bw:14});nw_blocks(c,sx+20,NW_CH.surf,14,NW_CH.inner0-NW_CH.surf,{seed:15,bh:18,bw:14});
  c.fillStyle="rgb(12,18,20)";c.fillRect(sx-20,NW_CH.surf,40,NW_CH.inner0-NW_CH.surf);
  nw_blocks(c,sx-50,NW_CH.surf-12,100,14,{seed:16,bh:14,bw:50,lit:0.2});}
AG_PLACES.nwAqueduct=nw_paintAqueduct;
// the water in the channel, pale silver glass, moving towards the city; o.low lowers it (0 to 1), o.a fades it
function nw_channelWater(ctx,t,o){o=o||{};const y=NW_CH.water+(o.low||0)*24,b=NW_CH.inner1,x0=o.x0||0,x1=o.x1||W;ctx.save();ctx.beginPath();ctx.rect(x0,y,x1-x0,b-y);ctx.clip();
  const g=ctx.createLinearGradient(0,y,0,b);g.addColorStop(0,rgba(NW_C.water,0.78));g.addColorStop(1,rgba(NW_C.waterDk,0.62));ctx.fillStyle=g;ctx.fillRect(x0,y,x1-x0,b-y);
  ctx.strokeStyle="rgba(240,250,250,0.55)";ctx.lineWidth=1.6;for(let k=0;k<3;k++){ctx.beginPath();for(let x=x0;x<=x1;x+=16){const v=y+4+k*9+Math.sin(x/58-t*2.2+k*1.7)*2.2;x===x0?ctx.moveTo(x,v):ctx.lineTo(x,v);}ctx.globalAlpha=0.55-k*0.15;ctx.stroke();}
  ctx.restore();ctx.save();ctx.fillStyle="rgba(240,252,252,0.8)";ctx.fillRect(x0,y-1,x1-x0,1.6);ctx.restore();}
// the ground over the channel, before the land is cut away (a = 1 covers it; 0 shows the channel)
function nw_groundCover(ctx,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.drawImage(nw_coverPic(),0,NW_CH.surf+2,W,NW_CH.y1-NW_CH.surf+30);ctx.restore();}
function nw_coverPic(){return ag_kept("nwCover",W,NW_CH.y1-NW_CH.surf+30,(c,w,h)=>{nw_earth(c,0,0,w,h,7);nw_cutEdge(c,0,w,0);});}
// a hole in the channel: a coral ring of light where it's cut (p draws it on), and a thin silver stream from it (s, 0 to 1) towards to
function nw_hole(ctx,x,y,p,o){o=o||{};if(p<=0)return;const c=dp_f("coral"),r=22*ag_eo(Math.min(1,p*1.4));ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;
  dp_halo(ctx,x,y,60,"coral",0.22*p);ctx.strokeStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=12;ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();
  ctx.fillStyle=rgba(mix(c,[20,10,10],0.5),0.8);ctx.beginPath();ctx.arc(x,y,r*0.55,0,TAU);ctx.fill();ctx.restore();
  if(o.to&&o.s>0){const [tx,ty]=o.to,u=ag_sine(o.s);ctx.save();ctx.globalAlpha*=(o.a==null?1:o.a)*0.9;ctx.strokeStyle=rgba(NW_C.water,0.85);ctx.lineWidth=o.lw||5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x,y);const mx=lerp(x,tx,0.5),my=Math.min(y,ty)-40;ctx.quadraticCurveTo(lerp(x,mx,u),lerp(y,my,u),lerp(x,tx,u),lerp(y,ty,u));ctx.stroke();ctx.restore();}}

/* ---------------------------------------------------------------- the distribution tank */
// the tank's layout in the frame (nwTank): its basin, the row of nozzles at one level, and the three pipes' ends with their uses
const NW_TK={x0:640,x1:1460,top:200,floor:700,basin0:430,basin1:600,water:462,noz:[704,800,896,992,1088,1184,1280],nozY:560,
  ends:[[760,772],[1060,772],[1360,772]],shelf:[680,268]};
function nw_paintTank(c){const hz=560;nw_sky(c,hz,{east:1700,seed:8});
  // the city behind: walls and roofs in the dawn, warm windows
  const R=ag_rnd(51);for(let i=0;i<30;i++){const x=i*68+R()*30-20,w=70+R()*60,h=120+R()*180,y=hz-h;c.fillStyle=rgba(mix([30,46,50],[64,70,70],R()*0.5),1);c.fillRect(x,y,w,h+60);
    for(let k=0;k<3;k++)if(R()<0.45)nw_window(c,x+10+R()*(w-24),y+16+R()*(h-50),8,12,0.5+R()*0.35);}
  let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(36,42,42)");g.addColorStop(1,"rgb(20,24,24)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  // the tank: its walls of stone, its front cut away; inside, the back wall in shade, the basin, the floor
  const T=NW_TK;nw_blocks(c,T.x0-40,T.top,40,T.floor-T.top,{seed:52,bh:28,bw:40,lit:0.16});nw_blocks(c,T.x1,T.top,40,T.floor-T.top,{seed:53,bh:28,bw:40,lit:0.05});
  nw_blocks(c,T.x0-60,T.top-34,T.x1-T.x0+120,36,{seed:54,bh:18,bw:60,lit:0.3});
  nw_blocks(c,T.x0,T.top+2,T.x1-T.x0,T.floor-T.top,{seed:55,bh:30,bw:72,col:ag_dk(NW_C.stone,0.25),lit:0.04});
  g=c.createLinearGradient(0,T.top,0,T.floor);g.addColorStop(0,"rgba(4,12,14,0.55)");g.addColorStop(1,"rgba(4,12,14,0.25)");c.fillStyle=g;c.fillRect(T.x0,T.top,T.x1-T.x0,T.floor-T.top);
  // the inflow from the aqueduct: an arched mouth in the right wall, over the basin (its water drawn live, nw_inflow)
  c.save();c.beginPath();c.moveTo(T.x1-46,404);c.lineTo(T.x1-46,356);c.arc(T.x1-18,356,28,Math.PI,0);c.lineTo(T.x1+10,404);c.closePath();c.fillStyle="rgb(10,16,18)";c.fill();
  c.strokeStyle=rgba(NW_C.stoneHi,0.55);c.lineWidth=5;c.beginPath();c.moveTo(T.x1-46,404);c.lineTo(T.x1-46,356);c.arc(T.x1-18,356,28,Math.PI,0);c.lineTo(T.x1+10,404);c.stroke();c.restore();
  // the basin: a stone tank inside, its lip lit
  nw_blocks(c,T.x0+20,T.basin1,T.x1-T.x0-40,T.floor-T.basin1,{seed:56,bh:24,bw:80,lit:0.12});
  c.fillStyle="rgb(14,22,24)";c.fillRect(T.x0+20,T.basin0,T.x1-T.x0-40,T.basin1-T.basin0);
  c.fillStyle=rgba(NW_C.stoneHi,0.6);c.fillRect(T.x0+20,T.basin1-2,T.x1-T.x0-40,4);
  // the shelf of records on the left wall, its tablets drawn live
  c.fillStyle=rgba(NW_C.wood,1);c.fillRect(T.shelf[0]-10,T.shelf[1]+70,250,12);
  // the floor in front, flagstones in perspective
  for(let j=0;j<6;j++){const y=T.floor+j*30;c.strokeStyle="rgba(120,130,128,0.10)";c.lineWidth=1.4;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}}
AG_PLACES.nwTank=nw_paintTank;
// the water in the basin, rising to its level (fill 0 to 1)
function nw_basinWater(ctx,t,fill){const T=NW_TK,y=lerp(T.basin1-6,T.water,fill),x0=T.x0+24,x1=T.x1-24;if(y>=T.basin1-6)return;ctx.save();ctx.beginPath();ctx.rect(x0,y,x1-x0,T.basin1-2-y);ctx.clip();
  const g=ctx.createLinearGradient(0,y,0,T.basin1);g.addColorStop(0,rgba(NW_C.water,0.72));g.addColorStop(1,rgba(NW_C.waterDk,0.6));ctx.fillStyle=g;ctx.fillRect(x0,y,x1-x0,T.basin1-y);
  ctx.strokeStyle="rgba(240,250,250,0.5)";ctx.lineWidth=1.4;ctx.beginPath();for(let x=x0;x<=x1;x+=14){const v=y+6+Math.sin(x/40-t*1.6)*2;x===x0?ctx.moveTo(x,v):ctx.lineTo(x,v);}ctx.stroke();ctx.restore();
  ctx.fillStyle="rgba(240,252,252,0.8)";ctx.fillRect(x0,y-1,x1-x0,1.6);}
// the water coming in from the aqueduct, falling from its mouth into the basin (a: its opacity)
function nw_inflow(ctx,t,a){if(!(a>0))return;const T=NW_TK,x=T.x1-18;ctx.save();ctx.globalAlpha*=a;const g=ctx.createLinearGradient(0,396,0,T.water+8);g.addColorStop(0,rgba(NW_C.water,0.85));g.addColorStop(1,rgba(NW_C.water,0.45));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-22,398);ctx.quadraticCurveTo(x-30,430,x-40,T.water+6);ctx.lineTo(x-8,T.water+6);ctx.quadraticCurveTo(x-4,430,x+6,398);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(240,252,252,0.5)";ctx.lineWidth=1.6;for(let k=0;k<3;k++){const o=((t*1.4+k/3)%1);ctx.beginPath();ctx.moveTo(x-18+k*7,400+o*40);ctx.lineTo(x-22+k*7,412+o*40);ctx.stroke();}ctx.restore();}
// a bronze nozzle (a calix) set in the wall, seen end on: a short bronze tube, its stamp a small mark on its rim
function nw_nozzle(ctx,x,y,s,o){o=o||{};s=s||1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const g=ctx.createLinearGradient(-16,-16,16,16);g.addColorStop(0,rgba(NW_C.bronzeHi,1));g.addColorStop(0.5,rgba(NW_C.bronze,1));g.addColorStop(1,rgba(ag_dk(NW_C.bronze,0.4),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,17,0,TAU);ctx.fill();ctx.fillStyle="rgb(16,18,18)";ctx.beginPath();ctx.arc(0,0,9,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(NW_C.bronzeHi,0.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,17,0,TAU);ctx.stroke();
  if(o.stamp){ctx.fillStyle=rgba(ag_dk(NW_C.bronze,0.6),0.9);ctx.fillRect(-6,-16,12,4);}
  if(o.flow>0){ctx.strokeStyle=rgba(NW_C.water,0.8*o.flow);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,10);ctx.stroke();}ctx.restore();}
// the nozzle close up, on a card of glass: a bronze tube, its stamp, and the lead pipe of the same size behind it (k springs it in)
function nw_nozzleClose(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+220,y+150,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,440,300,{col:"grey",r:20,glowA:0.6});
  // the lead pipe behind, then the bronze nozzle, its rim stamped
  let g=ctx.createLinearGradient(0,y+124,0,y+176);g.addColorStop(0,rgba(NW_C.leadHi,1));g.addColorStop(1,rgba(ag_dk(NW_C.lead,0.3),1));ctx.fillStyle=g;rr(ctx,x+230,y+124,180,52,12);ctx.fill();
  g=ctx.createLinearGradient(0,y+110,0,y+190);g.addColorStop(0,rgba(NW_C.bronzeHi,1));g.addColorStop(0.5,rgba(NW_C.bronze,1));g.addColorStop(1,rgba(ag_dk(NW_C.bronze,0.45),1));ctx.fillStyle=g;rr(ctx,x+60,y+112,190,76,14);ctx.fill();
  ctx.fillStyle="rgb(16,18,18)";ctx.beginPath();ctx.ellipse(x+64,y+150,12,30,0,0,TAU);ctx.fill();
  // the stamp: a small panel pressed into the bronze, its marks (decoration; the card says what it is)
  ctx.fillStyle=rgba(ag_dk(NW_C.bronze,0.55),0.9);rr(ctx,x+118,y+128,96,44,6);ctx.fill();ctx.strokeStyle=rgba(NW_C.bronzeHi,0.8);ctx.lineWidth=1.4;ctx.stroke();
  ctx.fillStyle=rgba(NW_C.bronzeHi,0.85);for(let i=0;i<5;i++)ctx.fillRect(x+128+i*16,y+140,8,20);
  dp_T(ctx,"Stamped: the size granted",x+28,y+262,{w:700,size:30});ctx.restore();}
// a grant: a small bronze tablet tied to a pipe, or on the shelf of records (on: 0 to 1, how far it's come in)
function nw_tablet(ctx,x,y,s,o){o=o||{};s=s||1;const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const g=ctx.createLinearGradient(-30,-40,30,40);g.addColorStop(0,rgba(NW_C.bronzeHi,1));g.addColorStop(1,rgba(ag_dk(NW_C.bronze,0.3),1));ctx.fillStyle=g;rr(ctx,-30,-40,60,80,6);ctx.fill();
  ctx.strokeStyle=rgba(ag_dk(NW_C.bronze,0.6),0.8);ctx.lineWidth=1.4;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-20,-26+i*12);ctx.lineTo(16-(i%2)*10,-26+i*12);ctx.stroke();}ctx.restore();}
// the lead pipes from the nozzles, out of the tank to the three uses (p draws each on), and the water in them
function nw_pipesOut(ctx,t,p,o){o=o||{};const T=NW_TK;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  T.noz.forEach((nx,i)=>{const e=T.ends[i<3?0:i<5?1:2],k=i<3?i-1:i<5?i-3.5:i-5.5,u=clamp(p*1.4-i*0.06,0,1);if(u<=0)return;
    const y2=T.floor+18+Math.abs(k)*4,pts=[[nx,T.nozY],[nx,y2],[e[0]+k*16,y2],[e[0]+k*16,e[1]-34]];
    ctx.beginPath();ctx.moveTo(...pts[0]);for(let q=1;q<=3;q++){const v=clamp(u*3-(q-1),0,1);if(v<=0)break;ctx.lineTo(lerp(pts[q-1][0],pts[q][0],v),lerp(pts[q-1][1],pts[q][1],v));}
    ctx.strokeStyle=rgba(NW_C.lead,1);ctx.lineWidth=10;ctx.stroke();ctx.strokeStyle=rgba(NW_C.leadHi,0.5);ctx.lineWidth=3;ctx.stroke();});ctx.restore();
  T.noz.forEach(nx=>nw_nozzle(ctx,nx,T.nozY,1,{stamp:true,flow:o.flow==null?1:o.flow}));}
// the three uses the pipes lead to, each a tag under its pipes (a: each one's opacity)
const NW_USES=["Public basins and fountains","Baths","Houses with a grant"];
function nw_uses(ctx,a){NW_USES.forEach((s,i)=>{const e=NW_TK.ends[i],w=dp_tw(ctx,s,{w:700,size:30})+44;dp_tag(ctx,e[0]-w/2,e[1]-34,s,"grey",{a:a[i]});});}

/* ---------------------------------------------------------------- the street, its pipe under the paving, and a public basin */
const NW_ST={street:612,pave1:690,pipe:770,shops:[[120,470],[520,470],[920,470]],basin:[1300,520,1640,640],spout:[1470,452]};
function nw_paintStreet(c){const hz=500;nw_sky(c,hz,{east:1400,seed:9});
  // the far side of the street, behind the shops: walls and roofs in the dawn's shade, a few warm windows, down to the paving
  {const R0=ag_rnd(69);for(let i=0;i<30;i++){const x=i*68+R0()*30-24,w=78+R0()*60,h=70+R0()*130,y=hz-h+60;c.fillStyle=rgba(mix([28,44,48],[58,66,66],R0()*0.5),1);c.fillRect(x,y,w,NW_ST.street-y);
    if(R0()<0.5)nw_window(c,x+10+R0()*(w-24),y+16+R0()*Math.max(6,h-50),8,12,0.45+R0()*0.3);}}
  // the shops: a row of two-storey fronts, each with a wide opening and a wooden shutter, the floor above with small warm windows
  const S=NW_ST,R=ag_rnd(61);for(let i=0;i<3;i++){const x=40+i*400,w=380;nw_blocks(c,x,190,w,S.street-190,{seed:62+i,bh:30,bw:54,col:mix(NW_C.plaster,NW_C.brick,0.35+R()*0.3),lit:0.12});
    c.fillStyle="rgb(14,18,20)";c.fillRect(x+60,330,w-120,S.street-330);c.fillStyle=rgba(NW_C.wood,1);c.fillRect(x+60,330,22,S.street-330);c.fillRect(x+w-82,330,22,S.street-330);
    c.fillStyle=rgba(ag_dk(NW_C.wood,0.2),1);c.fillRect(x+40,312,w-80,18);nw_window(c,x+90,230,26,36,0.6);nw_window(c,x+w-116,230,26,36,0.5);
    const lg=c.createRadialGradient(x+w/2,S.street-60,0,x+w/2,S.street-60,160);lg.addColorStop(0,"rgba(255,196,128,0.16)");lg.addColorStop(1,"rgba(255,196,128,0)");c.fillStyle=lg;c.fillRect(x+60,330,w-120,S.street-330);}
  // the public basin's wall behind, and its fountain head on a pillar
  nw_blocks(c,1270,250,400,S.street-250,{seed:66,bh:30,bw:60,col:ag_dk(NW_C.stone,0.1),lit:0.2});c.fillStyle="rgba(4,12,14,0.3)";c.fillRect(1270,250,400,S.street-250);
  // the street: paving stones of grey lava, in perspective, and a kerb
  let g=c.createLinearGradient(0,S.street,0,S.pave1);g.addColorStop(0,"rgb(46,52,54)");g.addColorStop(1,"rgb(30,34,36)");c.fillStyle=g;c.fillRect(0,S.street,W,S.pave1-S.street);
  for(let j=0;j<3;j++){const y0=S.street+j*26,h=26;for(let x=-(j*37%90);x<W;x+=90-j*8){c.strokeStyle="rgba(150,160,160,0.16)";c.lineWidth=1.6;c.beginPath();c.moveTo(x,y0);c.lineTo(x+10,y0+h);c.stroke();}
    c.strokeStyle="rgba(150,160,160,0.14)";c.beginPath();c.moveTo(0,y0+h);c.lineTo(W,y0+h);c.stroke();}
  c.fillStyle=rgba(NW_C.stoneHi,0.35);c.fillRect(0,S.street-2,W,3);
  // the ground cut away under the paving, and the lead pipe in it
  nw_earth(c,0,S.pave1,W,H-S.pave1,4);nw_cutEdge(c,0,W,S.pave1);
  g=c.createLinearGradient(0,S.pipe-14,0,S.pipe+14);g.addColorStop(0,rgba(NW_C.leadHi,1));g.addColorStop(1,rgba(ag_dk(NW_C.lead,0.35),1));c.fillStyle=g;c.fillRect(0,S.pipe-14,W,28);
  c.fillStyle="rgba(230,240,240,0.25)";c.fillRect(0,S.pipe-12,W,2);}
AG_PLACES.nwStreet=nw_paintStreet;
// the public basin: a stone trough, its water (fill 0 to 1), the fountain head and its spout running (run 0 to 1)
function nw_basin(ctx,t,fill,run){const [x0,y0,x1,y1]=NW_ST.basin,[sx,sy]=NW_ST.spout;
  // the spout's stream, then the water, then the trough's front
  if(run>0.01){ctx.save();ctx.strokeStyle=rgba(NW_C.water,0.85*run);ctx.lineWidth=7*run+1;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx-26,sy-2);ctx.quadraticCurveTo(sx-46,sy+20,sx-52,y0+40);ctx.stroke();ctx.restore();}
  const wy=lerp(y1-24,y0+18,fill);ctx.save();ctx.beginPath();ctx.rect(x0+16,wy,x1-x0-32,y1-14-wy);ctx.clip();const g=ctx.createLinearGradient(0,wy,0,y1);g.addColorStop(0,rgba(NW_C.water,0.75));g.addColorStop(1,rgba(NW_C.waterDk,0.6));
  ctx.fillStyle=g;ctx.fillRect(x0,wy,x1-x0,y1-wy);ctx.strokeStyle="rgba(240,250,250,0.55)";ctx.lineWidth=1.4;ctx.beginPath();for(let x=x0+16;x<=x1-16;x+=14){const v=wy+5+Math.sin(x/36-t*1.8)*1.8;x===x0+16?ctx.moveTo(x,v):ctx.lineTo(x,v);}ctx.stroke();ctx.restore();
  ctx.drawImage(nw_troughPic(),x0-10,y0-10);
  // the fountain head: a stone face's mouth on a pillar
  ctx.drawImage(nw_headPic(),sx-40,sy-60);}
function nw_troughPic(){const [x0,y0,x1,y1]=NW_ST.basin;return ag_kept("nwTrough",x1-x0+20,y1-y0+20,(c,w,h)=>{
  c.save();c.beginPath();c.rect(0,0,w,h);c.rect(26,26,w-52,h-46);c.clip("evenodd");nw_blocks(c,0,0,w,h,{seed:67,bh:22,bw:90,col:ag_lt(NW_C.stone,0.08),lit:0.3});c.restore();
  c.fillStyle=rgba(NW_C.stoneHi,0.7);c.fillRect(0,6,w,4);});}
function nw_headPic(){return ag_kept("nwFountainHead",80,120,(c)=>{nw_blocks(c,14,0,52,120,{seed:68,bh:24,bw:52,col:NW_C.stone,lit:0.3});
  let g=c.createRadialGradient(46,34,4,40,40,26);g.addColorStop(0,rgba(ag_lt(NW_C.stone,0.45),1));g.addColorStop(1,rgba(ag_dk(NW_C.stone,0.1),1));c.fillStyle=g;c.beginPath();c.arc(40,40,24,0,TAU);c.fill();
  c.strokeStyle=rgba(ag_dk(NW_C.stone,0.5),0.7);c.lineWidth=2;c.beginPath();c.arc(40,40,24,0,TAU);c.stroke();c.beginPath();c.arc(40,42,13,0.2,Math.PI-0.2);c.stroke();
  c.fillStyle=rgba(NW_C.bronze,1);c.fillRect(14,50,22,8);c.fillStyle=rgba(NW_C.bronzeHi,0.8);c.fillRect(14,50,22,2);});}
// a secret branch: a pipe bored up from the main pipe into a shop (p draws it on, lift 0 to 1 takes it out, up through the paving)
function nw_branch(ctx,x,p,o){o=o||{};if(p<=0)return;const S=NW_ST,top=S.street-30,lift=o.lift||0,a=(o.a==null?1:o.a)*(1-ag_in(lift,0.7,0.3));if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(0,-lift*120);
  const y1=lerp(S.pipe,top,ag_sine(p));ctx.strokeStyle=rgba(NW_C.lead,1);ctx.lineWidth=10;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,S.pipe);ctx.lineTo(x,y1);ctx.stroke();
  ctx.strokeStyle=rgba(NW_C.leadHi,0.45);ctx.lineWidth=3;ctx.stroke();ctx.restore();if(lift<0.05)nw_hole(ctx,x,S.pipe,p,{a:o.a});}
// lead, stacked: the pipes taken out, piling up (n bars)
function nw_leadStack(ctx,x,y,n){for(let i=0;i<Math.floor(n);i++){const row=Math.floor(i/4),k=i%4,bx=x+k*54+row*26,by=y-row*20;const g=ctx.createLinearGradient(0,by-14,0,by+4);g.addColorStop(0,rgba(NW_C.leadHi,1));g.addColorStop(1,rgba(ag_dk(NW_C.lead,0.3),1));
  ctx.fillStyle=g;rr(ctx,bx,by-14,50,18,5);ctx.fill();}}

/* ---------------------------------------------------------------- the people of the opening, and what they hold */
// a toga's folds over the robe's band: the sinus falling across the chest, in figure space (the robe's band is the toga over the far shoulder)
function nw_togaFolds(c,P){c.save();ag_shape(c,AG_F.torso);c.clip();c.lineCap="round";
  for(const [a,b,d] of [[[352,640],[280,760],[150,850]],[[372,700],[300,820],[170,930]],[[392,780],[330,880],[220,1000]]]){c.strokeStyle=rgba(ag_dk(P.top.c,0.35),0.45);c.lineWidth=5;c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(b[0],b[1],d[0],d[1]);c.stroke();
    c.strokeStyle=rgba(ag_lt(P.top.c,0.5),0.5);c.lineWidth=2;c.beginPath();c.moveTo(a[0]+4,a[1]-8);c.quadraticCurveTo(b[0]+4,b[1]-8,d[0]+4,d[1]-8);c.stroke();}c.restore();}
// a few soft lines of age on a face, in figure space (k 0 to 1)
function nw_age(c,P,k){c.save();ag_shape(c,AG_F.head);c.clip();c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.5),0.3*k);c.lineWidth=2.2;c.lineCap="round";
  c.beginPath();c.moveTo(322,432);c.quadraticCurveTo(334,438,346,433);c.stroke();c.beginPath();c.moveTo(364,466);c.quadraticCurveTo(352,474,346,490);c.stroke();
  c.beginPath();c.moveTo(300,382);c.quadraticCurveTo(330,376,356,380);c.stroke();c.restore();}
// a palla, the shawl a Roman woman wore over her head and shoulders: the head's part frames the face, the body's falls over the far
// shoulder; the two meet at figure y 560 (the agent films' shawl, as Skills and workflows draws it)
function nw_pallaHead(cc){cc.moveTo(398,330);cc.bezierCurveTo(398,282,352,256,300,258);cc.bezierCurveTo(230,260,184,296,174,364);cc.bezierCurveTo(166,430,164,500,166,560);cc.lineTo(432,560);
  cc.bezierCurveTo(426,500,416,440,412,392);cc.bezierCurveTo(408,364,404,344,398,330);cc.closePath();
  cc.moveTo(276,356);cc.bezierCurveTo(310,342,356,338,386,348);cc.bezierCurveTo(389,368,390,384,390,396);cc.bezierCurveTo(390,404,387,410,386,415);cc.bezierCurveTo(386,424,390,432,391,440);
  cc.bezierCurveTo(394,446,397,451,397,455);cc.bezierCurveTo(397,460,393,463,388,464);cc.bezierCurveTo(386,470,386,478,385,486);cc.bezierCurveTo(384,498,381,508,377,516);
  cc.bezierCurveTo(373,524,368,530,364,536);cc.lineTo(366,560);cc.lineTo(240,560);cc.bezierCurveTo(246,530,256,508,262,488);cc.bezierCurveTo(260,450,262,410,268,384);cc.bezierCurveTo(270,370,272,362,276,356);cc.closePath();}
function nw_pallaBody(cc){cc.moveTo(166,556);cc.lineTo(240,556);cc.bezierCurveTo(238,580,234,600,226,612);cc.bezierCurveTo(196,622,160,630,126,646);cc.bezierCurveTo(140,612,156,580,166,556);cc.closePath();
  cc.moveTo(364,556);cc.lineTo(434,556);cc.bezierCurveTo(462,600,486,660,488,740);cc.bezierCurveTo(490,800,484,850,476,890);cc.bezierCurveTo(450,904,410,900,384,884);
  cc.bezierCurveTo(388,820,386,760,380,700);cc.bezierCurveTo(376,640,372,600,364,556);cc.closePath();}
function nw_palla(col,hair){const hi=ag_lt(col,0.42),dk=rgba(ag_dk(col,0.6),0.45);return{
  head:(c,P)=>{c.save();ag_shape(c,AG_F.head);c.clip();c.fillStyle=rgba(hair,1);c.beginPath();c.moveTo(268,392);c.bezierCurveTo(270,376,272,362,276,356);c.bezierCurveTo(310,342,356,338,386,348);
      c.lineTo(388,358);c.bezierCurveTo(356,352,316,354,290,366);c.bezierCurveTo(280,372,274,382,272,396);c.closePath();c.fill();c.restore();
    c.save();c.beginPath();nw_pallaHead(c);c.fillStyle=rgba(col,1);c.fill("evenodd");c.restore();
    c.save();c.beginPath();nw_pallaHead(c);c.clip("evenodd");let g=c.createRadialGradient(360,300,10,330,330,220);g.addColorStop(0,rgba(hi,0.8));g.addColorStop(1,rgba(hi,0));c.fillStyle=g;c.fillRect(160,250,280,310);
      g=c.createLinearGradient(170,0,300,0);g.addColorStop(0,dk);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(160,250,140,310);
      c.strokeStyle=rgba(ag_dk(col,0.5),0.35);c.lineWidth=3;c.lineCap="round";for(const f of [[[210,330],[200,430],[214,540]],[[236,300],[226,420],[232,540]],[[404,380],[412,460],[410,550]],[[300,268],[250,290],[218,330]]]){c.beginPath();c.moveTo(f[0][0],f[0][1]);c.quadraticCurveTo(f[1][0],f[1][1],f[2][0],f[2][1]);c.stroke();}
      c.restore();
    c.strokeStyle=rgba(ag_dk(col,0.3),0.8);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(268,384);c.bezierCurveTo(270,370,272,362,276,356);c.bezierCurveTo(310,342,356,338,386,348);c.stroke();
    c.strokeStyle=rgba(hi,0.7);c.lineWidth=2;c.beginPath();c.moveTo(278,350);c.bezierCurveTo(312,336,356,332,386,342);c.stroke();},
  body:(c,P)=>{ag_soft(c,nw_pallaBody,col,hi,440,620,240,dk,16);ag_folds(c,nw_pallaBody,[[[410,610],[440,760],[436,930]],[[394,660],[404,800],[410,940]],[[430,600],[460,700],[456,820]]],rgba(ag_dk(col,0.5),0.3),rgba(hi,0.25));
    c.save();c.beginPath();nw_pallaBody(c);c.clip();c.strokeStyle=rgba(ag_dk(col,0.35),0.6);c.lineWidth=6;c.beginPath();c.moveTo(384,884);c.bezierCurveTo(410,900,450,904,476,890);c.stroke();c.restore();}};}
const NW_PALLA=nw_palla([112,92,86],[44,34,30]);
// Rome's people: Sextus Julius Frontinus, about 57, clean-shaven as Roman men of his day were, short grey hair, a toga of white wool
// over his tunic; a water-man and two of the gangs who keep the channels, in short work tunics; a woman at the public basin, in a
// long tunic and a palla; a shopkeeper with an apron over his tunic
const NW_FOLK={
  frontinus:{key:"nw-frontinus",name:"Sextus Julius Frontinus",skin:[206,164,128],hair:{style:"cropped",c:[156,152,146]},
    top:{kind:"robe",c:[226,220,204],band:[204,196,178],inner:[234,230,218],paint:nw_togaFolds},hat:{paint:(c,P)=>nw_age(c,P,1)},breath:0.24},
  waterman:{key:"nw-waterman",name:"A water-man",skin:[188,140,104],hair:{style:"cropped",c:[40,32,28]},beard:[48,38,32],top:{kind:"tunic",c:[124,104,82],belt:[70,52,40]},breath:0.29},
  gang1:{key:"nw-gang1",name:"A gang's foreman",skin:[176,128,94],hair:{style:"cropped",c:[60,50,44]},top:{kind:"tunic",c:[110,100,84],belt:[64,48,38]},hat:{paint:(c,P)=>nw_age(c,P,0.6)},breath:0.26},
  gang2:{key:"nw-gang2",name:"A workman",skin:[196,150,112],hair:{style:"side",c:[34,28,24]},beard:[40,32,28],top:{kind:"tunic",c:[132,112,90],belt:[74,56,42]},breath:0.31},
  woman:{key:"nw-woman",name:"A woman at the basin",skin:[204,160,124],hair:{style:"shaved",c:[44,34,30]},top:{kind:"tunic",c:[150,120,104],paint:NW_PALLA.body},hat:{paint:NW_PALLA.head},breath:0.3},
  shopkeeper:{key:"nw-shopkeeper",name:"A shopkeeper",skin:[194,146,108],hair:{style:"cropped",c:[52,42,36]},top:{kind:"apron",c:[128,116,96],apron:[150,124,92]},breath:0.28}
};
DP_PEOPLE.push([NW_FOLK.frontinus,NW_DAWN],[NW_FOLK.waterman,NW_DAWN],[NW_FOLK.gang1,NW_DAWN],[NW_FOLK.gang2,NW_DAWN],[NW_FOLK.woman,NW_DAWN],[NW_FOLK.shopkeeper,NW_DAWN]);
// o.a fades them, whole (people.js lays a person on at the context's opacity, as one picture)
function nw_folk(ctx,who,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.004))return null;ctx.save();ctx.globalAlpha*=a;const h=dp_person(ctx,NW_FOLK[who],x,y,s,Object.assign({light:NW_DAWN},o));ctx.restore();return h;}
// what they hold, in figure space at the near hand: a wax tablet (Frontinus, the foreman), a clay jar (the water-man, the woman)
function nw_heldTablet(c,h,o){o=o||{};const [x,y]=h.near;c.save();c.translate(x+30,y-64);c.rotate(-0.12);
  c.save();c.shadowColor="rgba(0,0,0,0.35)";c.shadowBlur=12;c.shadowOffsetY=6;c.fillStyle=rgba(ag_dk(NW_C.wood,0.05),1);c.fillRect(-26,-112,150,118);c.restore();
  c.fillStyle="rgb(58,50,40)";c.fillRect(-14,-100,126,94);c.strokeStyle="rgba(200,184,150,0.55)";c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-4,-84+i*16);c.lineTo(96-(i%2)*24,-84+i*16);c.stroke();}c.restore();}
function nw_heldJar(c,h,o){o=o||{};const [x,y]=h.near,full=o.full==null?0.5:o.full;c.save();c.translate(x+40,y-40);
  const body=cc=>{cc.moveTo(-26,-120);cc.lineTo(26,-120);cc.bezierCurveTo(30,-100,66,-80,68,-30);cc.bezierCurveTo(70,20,40,52,0,54);cc.bezierCurveTo(-40,52,-70,20,-68,-30);cc.bezierCurveTo(-66,-80,-30,-100,-26,-120);cc.closePath();};
  ag_soft(c,body,[118,74,54],[170,116,84],30,-60,90,"rgba(30,12,6,0.5)",14);
  c.fillStyle="rgba(60,30,18,0.5)";c.fillRect(-30,-124,60,8);
  if(full>0){c.save();c.beginPath();body(c);c.clip();c.fillStyle=rgba(NW_C.water,0.25);c.fillRect(-70,lerp(40,-100,full),140,8);c.restore();}c.restore();}
