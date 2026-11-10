/* ===== Reports on demand: the places and people of its own =====
   Drawn in the module's look (films/data-that-moves/shared/: the intro's navy, glass cards, people lit for the dark), with a prefix of
   its own, rd_. London in 1936: a telephone exchange at night, its switchboard of jacks and lamps and its clock on the wall, an
   operator at the board; the speaking clock's machine, its glass discs and its clock; Jane Cain at a microphone; a telephone dial.
   Today: Finance's office at the university, Rohan's desk and its glass screen, painted once as the places are.
   The past wears its own warm lamplight on the navy, so it reads as another time; the university keeps the map's cool light. People
   of 1936 are dressed for their time: an operator's headset, a cardigan over a blouse, hair up or in waves. */

/* ---------------------------------------------------------------- 1936: the warm light of the past */
const RD={lamp:[255,196,120],brass:[214,168,96],wood:[66,44,36],woodHi:[118,82,60],ivory:[246,232,204],jack:[22,16,16]};

// the operator's receiver on its band: a thin steel band over the head from the near ear, a flat black receiver with a brass rim
// (in the head's picture)
function rd_headset(c,P){c.save();c.lineCap="round";c.strokeStyle="rgba(120,124,132,1)";c.lineWidth=5;
  c.beginPath();c.moveTo(250,416);c.bezierCurveTo(230,372,236,322,264,302);c.bezierCurveTo(292,284,330,284,362,300);c.stroke();
  c.strokeStyle="rgba(220,224,232,0.5)";c.lineWidth=1.6;c.beginPath();c.moveTo(244,404);c.bezierCurveTo(230,366,238,326,264,306);c.stroke();
  ag_soft(c,cc=>cc.ellipse(252,430,18,24,0.15,0,TAU),[24,22,24],[90,86,90],246,422,22,"rgba(0,0,0,0.5)",8);
  c.strokeStyle=rgba(RD.brass,0.9);c.lineWidth=2.5;c.beginPath();c.ellipse(252,430,18,24,0.15,0,TAU);c.stroke();
  c.fillStyle="rgba(10,10,12,1)";c.beginPath();c.ellipse(254,431,8,11,0.15,0,TAU);c.fill();c.restore();}
// 1930s finger waves: three broad soft crests over the hair, each a lighter band that catches the lamp (in the head's picture)
function rd_waves(c,P){const hc=P.hair.c;c.save();ag_shape(c,AG_HAIR[P.hair.style]||AG_HAIR.side);c.clip();c.lineCap="round";
  for(const [x0,y0,k] of [[214,318,1],[206,372,0.85],[204,430,0.7]]){
    const path=()=>{c.beginPath();c.moveTo(x0,y0+10);c.bezierCurveTo(x0+46,y0-22,x0+86,y0+26,x0+130,y0+2);c.bezierCurveTo(x0+158,y0-12,x0+176,y0-4,x0+196,y0-18);};
    c.strokeStyle=rgba(ag_lt(hc,0.35),0.16*k);c.lineWidth=16;path();c.stroke();
    c.strokeStyle=rgba(ag_lt(hc,0.6),0.22*k);c.lineWidth=3;c.save();c.translate(0,-4);path();c.stroke();c.restore();}
  c.restore();}
// hair worn up as the 1930s wore it: a soft roll low at the nape, behind the ear (in the head's picture)
function rd_roll(c,P){const hc=P.hair.c;c.save();
  ag_soft(c,cc=>cc.ellipse(222,468,40,30,-0.25,0,TAU),hc,ag_lt(hc,0.35),210,452,44,"rgba(0,0,0,0.35)",6);
  c.strokeStyle=rgba(ag_lt(hc,0.5),0.35);c.lineWidth=2.5;c.lineCap="round";
  for(const k of [-12,0,12]){c.beginPath();c.ellipse(222,468+k*0.4,30-Math.abs(k),18,-0.25,Math.PI*1.1,Math.PI*1.9);c.stroke();}c.restore();}
// the people of 1936: an operator at the exchange, and Jane Cain, the operator whose voice the speaking clock spoke with
const RD_OP={key:"rd_op",name:"An operator",skin:[234,200,172],hair:{style:"side",c:[150,110,70]},earrings:[226,214,190],top:{kind:"cardigan",c:[50,56,72],inner:[234,226,212]},hat:{paint:(c,P)=>{rd_roll(c,P);rd_waves(c,P);rd_headset(c,P);}},breath:0.3};
const RD_CAIN={key:"rd_cain",name:"Jane Cain",skin:[238,206,180],hair:{style:"bob",c:[58,42,34]},earrings:[226,214,190],top:{kind:"suit",c:[92,68,76],inner:[238,232,222]},hat:{paint:rd_waves},breath:0.29};
// how the past is lit: a warm lamp in front of the face, the map's rim behind, a little warmer than today's
const RD_PAST={key:[560,360],reach:820,shade:0.55,ground:0.42,warm:0.24,rim:[150,190,240],rimA:0.45,rimW:6};

/* ---------------------------------------------------------------- the exchange, at night
   The board fills the right of the frame: rows of jacks, each with its lamp, under a brass rail, over the shelf of plugs and cords.
   The clock hangs on the wall above it. RD_BOARD says where; lamps are lit live (rd_lamps). */
const RD_BOARD={x:780,y:330,w:1080,h:520,cols:14,rows:6,clock:[1120,176,100]};
function rd_lampAt(i,j){const B=RD_BOARD,dx=(B.w-120)/(B.cols-1),dy=(B.h-150)/(B.rows-1);return[B.x+60+i*dx,B.y+80+j*dy];}
function rd_paintExchange(c){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0d1220");g.addColorStop(0.6,"#0a0d18");g.addColorStop(1,"#05070c");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the wall: tall panels in the dark, and the warm pools of the hanging lamps
  c.strokeStyle="rgba(150,140,130,0.06)";c.lineWidth=2;for(let x=60;x<W;x+=240){c.beginPath();c.moveTo(x,0);c.lineTo(x,300);c.stroke();}
  c.fillStyle="rgba(120,100,80,0.07)";c.fillRect(0,296,W,6);
  for(const [x,y,r,a] of [[520,120,620,0.10],[1180,90,700,0.12],[1700,140,520,0.07]]){const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(RD.lamp,a));q.addColorStop(1,rgba(RD.lamp,0));c.fillStyle=q;c.fillRect(0,0,W,H);}
  // the hanging lamps' shades
  for(const x of [520,1180,1700]){c.fillStyle="rgba(30,26,26,1)";c.beginPath();c.moveTo(x-46,58);c.lineTo(x+46,58);c.lineTo(x+22,24);c.lineTo(x-22,24);c.closePath();c.fill();
    c.strokeStyle="rgba(60,52,48,1)";c.lineWidth=3;c.beginPath();c.moveTo(x,24);c.lineTo(x,0);c.stroke();const q=c.createRadialGradient(x,64,0,x,64,60);q.addColorStop(0,rgba(RD.lamp,0.55));q.addColorStop(1,rgba(RD.lamp,0));c.fillStyle=q;c.fillRect(x-70,40,140,80);}
  // the board's cabinet: dark wood with a lit edge, its face of jacks and lamps
  const B=RD_BOARD;c.save();c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=40;c.fillStyle=rgba(RD.wood,1);rr(c,B.x-24,B.y-30,B.w+48,B.h+200,14);c.fill();c.restore();
  let wg=c.createLinearGradient(0,B.y-30,0,B.y+B.h+170);wg.addColorStop(0,rgba(RD.woodHi,0.5));wg.addColorStop(0.3,rgba(RD.wood,0));wg.addColorStop(1,"rgba(0,0,0,0.35)");c.fillStyle=wg;rr(c,B.x-24,B.y-30,B.w+48,B.h+200,14);c.fill();
  c.fillStyle="rgba(18,13,12,1)";rr(c,B.x,B.y,B.w,B.h,8);c.fill();c.strokeStyle=rgba(RD.brass,0.55);c.lineWidth=3;rr(c,B.x,B.y,B.w,B.h,8);c.stroke();
  // each place on the board: a lamp's cap above, a jack below, with a brass ring
  for(let j=0;j<B.rows;j++)for(let i=0;i<B.cols;i++){const [x,y]=rd_lampAt(i,j);
    c.fillStyle="rgba(54,40,30,1)";c.beginPath();c.arc(x,y,10,0,TAU);c.fill();c.strokeStyle="rgba(120,96,70,0.6)";c.lineWidth=1.6;c.stroke();
    c.fillStyle="rgba(8,6,6,1)";c.beginPath();c.arc(x,y+30,8,0,TAU);c.fill();c.strokeStyle=rgba(RD.brass,0.65);c.lineWidth=2.4;c.beginPath();c.arc(x,y+30,10,0,TAU);c.stroke();}
  // the shelf in front, its keys, and the plugs standing in pairs, their cords hanging below
  const sy=B.y+B.h+24;c.fillStyle=rgba(mix(RD.wood,[0,0,0],0.2),1);rr(c,B.x-24,sy,B.w+48,62,8);c.fill();c.fillStyle=rgba(RD.woodHi,0.45);c.fillRect(B.x-24,sy,B.w+48,4);
  for(let i=0;i<16;i++){const x=B.x+40+i*(B.w-80)/15;for(const [dx,h] of [[-9,30],[9,26]]){c.fillStyle="rgba(14,10,10,1)";rr(c,x+dx-5,sy-h,10,h,4);c.fill();c.fillStyle=rgba(RD.brass,0.8);rr(c,x+dx-3,sy-h-10,6,12,3);c.fill();}
    c.fillStyle="rgba(200,190,170,0.5)";c.beginPath();c.arc(x,sy+34,5,0,TAU);c.fill();}
  // the clock's place on the wall: its dark rim; the face and hands are drawn live
  const [cx,cy,cr]=B.clock;c.save();c.shadowColor="rgba(0,0,0,0.7)";c.shadowBlur=30;c.fillStyle="rgba(30,22,18,1)";c.beginPath();c.arc(cx,cy,cr+14,0,TAU);c.fill();c.restore();
  c.strokeStyle=rgba(RD.brass,0.7);c.lineWidth=4;c.beginPath();c.arc(cx,cy,cr+8,0,TAU);c.stroke();
  const v=c.createRadialGradient(W/2,H/2,H*0.35,W/2,H/2,W*0.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.rdExchange=rd_paintExchange;
// the board's lamps, lit live: lit [[i, j, a], ...]; a call is a lamp lit amber
function rd_lamps(c,lit,col){for(const [i,j,a] of lit){if(a<=0.004)continue;const [x,y]=rd_lampAt(i,j);glow(c,x,y,30,col||RD.lamp,0.75*a);c.fillStyle=rgba(mix(col||RD.lamp,[255,255,255],0.45),a);c.beginPath();c.arc(x,y,8,0,TAU);c.fill();}}
// the exchange clock's face: ivory, lit by the lamps, its hands at h:m:s (s moves on in whole seconds, as the clock's own hand does)
function rd_clockFace(c,x,y,r,h,m,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  const g=c.createRadialGradient(x-r*0.25,y-r*0.3,0,x,y,r);g.addColorStop(0,rgba(RD.ivory,1));g.addColorStop(1,rgba(mix(RD.ivory,[150,120,90],0.35),1));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  c.strokeStyle="rgba(40,30,26,0.9)";c.lineCap="round";for(let i=0;i<60;i++){const an=i/60*TAU,l=i%5?r*0.05:r*0.12;c.lineWidth=i%5?1.6:4;c.beginPath();c.moveTo(x+Math.sin(an)*(r*0.92),y-Math.cos(an)*(r*0.92));c.lineTo(x+Math.sin(an)*(r*0.92-l),y-Math.cos(an)*(r*0.92-l));c.stroke();}
  const hand=(an,len,w,col)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x-Math.sin(an)*len*0.16,y+Math.cos(an)*len*0.16);c.lineTo(x+Math.sin(an)*len,y-Math.cos(an)*len);c.stroke();};
  hand(((h%12)+m/60)/12*TAU,r*0.5,r*0.07,"rgba(30,24,22,1)");hand((m+s/60)/60*TAU,r*0.76,r*0.05,"rgba(30,24,22,1)");hand(Math.floor(s)/60*TAU,r*0.84,Math.max(1.6,r*0.018),o.secCol||"rgba(170,40,30,1)");
  c.fillStyle="rgba(30,24,22,1)";c.beginPath();c.arc(x,y,r*0.06,0,TAU);c.fill();
  const sh=c.createRadialGradient(x,y,r*0.7,x,y,r);sh.addColorStop(0,"rgba(0,0,0,0)");sh.addColorStop(1,"rgba(60,40,20,0.35)");c.fillStyle=sh;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();}

/* ---------------------------------------------------------------- the speaking clock
   rd_disc: one glass disc, seen face on, its rings of recorded words lit from behind; u how far it has turned, lit 0 to 1 while read.
   rd_machine: the machine as the Post Office built it, drawn for the film: a tall dark cabinet, a clock dial in its top panel, and
   behind its glass four discs on one shaft, each read by its own beam of light, warm valves glowing below. o.turn (seconds of turning),
   o.read (0 to 1, the beams), o.time [h, m, s] for its dial, o.lit, o.a. */
function rd_disc(c,x,y,r,u,lit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  const g=c.createRadialGradient(x-r*0.3,y-r*0.3,0,x,y,r);g.addColorStop(0,"rgba(190,220,255,0.30)");g.addColorStop(1,"rgba(120,160,220,0.10)");c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  c.strokeStyle="rgba(200,225,255,0.55)";c.lineWidth=2;c.stroke();
  // the rings: the recorded words, as tracks of light; a few brighter where a word is
  for(let k=0;k<7;k++){const rr_=r*(0.32+k*0.09);c.strokeStyle="rgba(170,205,250,"+(0.16+0.06*(k%2))+")";c.lineWidth=2.2;c.beginPath();c.arc(x,y,rr_,0,TAU);c.stroke();
    const s0=u*(0.9+k*0.07)+k*1.7;c.strokeStyle=rgba(RD.lamp,0.25+0.5*lit);c.lineWidth=3;c.beginPath();c.arc(x,y,rr_,s0,s0+0.5+0.2*(k%3));c.stroke();}
  c.fillStyle="rgba(40,46,60,1)";c.beginPath();c.arc(x,y,r*0.14,0,TAU);c.fill();c.strokeStyle=rgba(RD.brass,0.8);c.lineWidth=3;c.stroke();
  if(lit>0)glow(c,x,y,r*1.1,[170,205,250],0.18*lit);c.restore();}
const RD_MACH={x:600,y:120,w:720,h:760};
function rd_machine(c,tt,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const M=RD_MACH,read=o.read||0;c.save();c.globalAlpha*=a;
  // the cabinet
  c.save();c.shadowColor="rgba(0,0,0,0.7)";c.shadowBlur=50;c.fillStyle="rgba(28,30,36,1)";rr(c,M.x,M.y,M.w,M.h,16);c.fill();c.restore();
  let g=c.createLinearGradient(M.x,0,M.x+M.w,0);g.addColorStop(0,"rgba(255,255,255,0.05)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,0.25)");c.fillStyle=g;rr(c,M.x,M.y,M.w,M.h,16);c.fill();
  c.strokeStyle="rgba(120,130,150,0.5)";c.lineWidth=2;rr(c,M.x,M.y,M.w,M.h,16);c.stroke();
  // its top panel and dial
  const dx=M.x+M.w/2,dy=M.y+120;c.fillStyle="rgba(18,20,26,1)";rr(c,M.x+30,M.y+26,M.w-60,190,10);c.fill();
  const tm=o.time||[10,47,22];rd_clockFace(c,dx,dy,78,tm[0],tm[1],tm[2]);c.strokeStyle=rgba(RD.brass,0.7);c.lineWidth=4;c.beginPath();c.arc(dx,dy,86,0,TAU);c.stroke();
  // the glass window and its four discs on one shaft
  const wy=M.y+250,wh=330;c.fillStyle="rgba(8,12,22,1)";rr(c,M.x+30,wy,M.w-60,wh,10);c.fill();
  c.strokeStyle="rgba(90,100,120,0.9)";c.lineWidth=5;c.beginPath();c.moveTo(M.x+50,wy+wh/2);c.lineTo(M.x+M.w-50,wy+wh/2);c.stroke();
  const turn=o.turn==null?tt:o.turn;for(let i=0;i<4;i++){const x=M.x+120+i*160,y=wy+wh/2;rd_disc(c,x,y,70,turn*(0.6+i*0.25),read);
    // its beam of light, from a lamp above to a cell below
    if(read>0){c.save();c.globalCompositeOperation="lighter";const bg=c.createLinearGradient(0,wy+20,0,wy+wh-20);bg.addColorStop(0,rgba(RD.lamp,0));bg.addColorStop(0.5,rgba(RD.lamp,0.55*read));bg.addColorStop(1,rgba(RD.lamp,0));
      c.fillStyle=bg;c.fillRect(x+36,wy+20,6,wh-40);c.restore();}
    c.fillStyle="rgba(60,62,70,1)";rr(c,x+28,wy+8,22,16,4);c.fill();rr(c,x+28,wy+wh-24,22,16,4);c.fill();}
  c.strokeStyle="rgba(170,200,240,0.18)";c.lineWidth=2;rr(c,M.x+30,wy,M.w-60,wh,10);c.stroke();
  // the valves below, glowing warm
  for(let i=0;i<6;i++){const x=M.x+90+i*108,y=M.y+M.h-110;c.fillStyle="rgba(40,36,34,1)";rr(c,x-20,y+40,40,22,4);c.fill();
    const vg=c.createRadialGradient(x,y,0,x,y,34);vg.addColorStop(0,rgba(RD.lamp,0.55));vg.addColorStop(1,rgba(RD.lamp,0));c.fillStyle=vg;c.beginPath();c.arc(x,y,34,0,TAU);c.fill();
    c.strokeStyle="rgba(220,200,170,0.4)";c.lineWidth=2;c.beginPath();c.moveTo(x-14,y+40);c.lineTo(x-14,y-10);c.arc(x,y-10,14,Math.PI,0);c.lineTo(x+14,y+40);c.stroke();}
  if(o.lit)glow(c,dx,M.y+M.h/2,M.w*0.7,RD.lamp,0.12*o.lit);c.restore();}
// a microphone of the 1930s on its stand: an oval ribbon head in a ring (x, y the head's middle)
function rd_mic(c,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);
  c.fillStyle="rgba(30,30,34,1)";c.fillRect(-5,60,10,400);rr(c,-60,452,120,18,6);c.fill();
  c.strokeStyle=rgba(RD.brass,0.85);c.lineWidth=6;c.beginPath();c.ellipse(0,0,46,62,0,0,TAU);c.stroke();
  ag_soft(c,cc=>cc.ellipse(0,0,36,52,0,0,TAU),[48,48,54],[120,120,130],-8,-14,50,"rgba(0,0,0,0.4)",8);
  c.strokeStyle="rgba(150,150,160,0.35)";c.lineWidth=1.6;for(let k=-40;k<=40;k+=8){c.beginPath();c.moveTo(-30,k);c.lineTo(30,k);c.stroke();}
  c.strokeStyle=rgba(RD.brass,0.85);c.lineWidth=5;c.beginPath();c.moveTo(-46,0);c.lineTo(-56,0);c.lineTo(-56,62);c.lineTo(0,62);c.lineTo(56,62);c.lineTo(56,0);c.lineTo(46,0);c.stroke();c.restore();}
// a pocket watch, its hands at h:m:s (o.out, seconds it is out by, drawn as a red sliver on its dial)
function rd_watch(c,x,y,r,h,m,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  ag_soft(c,cc=>cc.arc(x,y,r+16,0,TAU),RD.brass,[255,236,190],x-r*0.4,y-r*0.4,r*1.4,"rgba(0,0,0,0.45)",10);ag_soft(c,cc=>ag_rect(cc,x-14,y-r-44,28,30,8),RD.brass,[255,236,190],x,y-r-40,20,null);
  c.strokeStyle=rgba(RD.brass,1);c.lineWidth=6;c.beginPath();c.arc(x,y-r-58,16,0,TAU);c.stroke();
  rd_clockFace(c,x,y,r,h,m,s,{secCol:"rgba(40,30,26,1)"});
  if(o.out){c.fillStyle=rgba(MD.fail,0.45*o.out);c.beginPath();c.moveTo(x,y);c.arc(x,y,r*0.88,(Math.floor(s)/60)*TAU-Math.PI/2,((Math.floor(s)+4)/60)*TAU-Math.PI/2);c.closePath();c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- the dial
   The Post Office's dial of the time: ten finger holes, each over its number and its letters (2 ABC, 3 DEF, 4 GHI, 5 JKL, 6 MN,
   7 PRS, 8 TUV, 9 WXY, 0 O), 1 at two o'clock and on round to 0 at five, the finger stop at four, as a real dial has them.
   o.lit {8: a, 4: a, 6: a} lights a hole and its letters. Numbers and letters are 28 px or more, so they read. */
const RD_DIAL=[["1",""],["2","ABC"],["3","DEF"],["4","GHI"],["5","JKL"],["6","MN"],["7","PRS"],["8","TUV"],["9","WXY"],["0","O"]];
function rd_holeAt(i,x,y,R){const an=(30+i*30)*Math.PI/180;return[x+Math.cos(an)*R*0.72,y-Math.sin(an)*R*0.72];}
function rd_dial(c,x,y,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const lit=o.lit||{};c.save();c.globalAlpha*=a;
  // the body of the telephone under the dial: black, with the map's rim of light
  c.save();c.shadowColor="rgba(0,0,0,0.8)";c.shadowBlur=60;c.fillStyle="rgba(16,16,20,1)";c.beginPath();c.arc(x,y,R*1.18,0,TAU);c.fill();c.restore();
  c.strokeStyle=rgba(MD.flow,0.35);c.lineWidth=3;c.beginPath();c.arc(x,y,R*1.18,0,TAU);c.stroke();
  // the ring of numbers and letters under the finger plate
  c.fillStyle="rgba(236,230,214,1)";c.beginPath();c.arc(x,y,R,0,TAU);c.arc(x,y,R*0.44,0,TAU,true);c.fill();
  for(let i=0;i<10;i++){const [hx,hy]=rd_holeAt(i,x,y,R),[n,l]=RD_DIAL[i],L=lit[n]||0;
    if(L>0){c.save();c.globalAlpha*=L;c.fillStyle=rgba(RD.lamp,0.9);c.beginPath();c.arc(hx,hy,R*0.17,0,TAU);c.fill();c.restore();}
    md_T(c,n,hx,hy+(l?-2:10),{w:800,size:34,align:"center",col:[30,26,24]});if(l)md_T(c,l,hx,hy+30,{w:800,size:28,align:"center",col:[30,26,24]});}
  // the finger plate: chrome, with its ten holes
  c.save();c.beginPath();c.arc(x,y,R*0.98,0,TAU);for(let i=0;i<10;i++){const [hx,hy]=rd_holeAt(i,x,y,R);c.moveTo(hx+R*0.15,hy);c.arc(hx,hy,R*0.15,0,TAU,true);}
  c.moveTo(x+R*0.4,y);c.arc(x,y,R*0.4,0,TAU,true);const pg=c.createLinearGradient(x-R,y-R,x+R,y+R);pg.addColorStop(0,"rgba(220,226,236,0.95)");pg.addColorStop(0.5,"rgba(150,158,172,0.95)");pg.addColorStop(1,"rgba(90,96,110,0.95)");
  c.fillStyle=pg;c.fill("evenodd");c.restore();
  // the label in the middle, and the finger stop
  c.fillStyle="rgba(236,230,214,1)";c.beginPath();c.arc(x,y,R*0.36,0,TAU);c.fill();c.strokeStyle="rgba(40,36,34,0.5)";c.lineWidth=2;c.stroke();
  const fs=-30*Math.PI/180;c.strokeStyle="rgba(200,206,216,1)";c.lineWidth=10;c.lineCap="round";c.beginPath();c.moveTo(x+Math.cos(fs)*R*0.86,y-Math.sin(fs)*R*0.86);c.lineTo(x+Math.cos(fs)*R*1.08,y-Math.sin(fs)*R*1.08);c.stroke();
  c.restore();}
