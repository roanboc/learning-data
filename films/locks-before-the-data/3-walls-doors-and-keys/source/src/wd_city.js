/* ===== Walls, doors and keys: Ragusa, 1377 =====
   The opening story's places, painted once in the module's night light (Night glass): the same petrol sky as the hall, the stone of
   the walls cool, the windows warm, the sea dark and slow. Only the shapes of walls, gates, ships and roofs: nothing is borrowed from
   the city's own arts or crafts, no motifs and no lettering. Every name here starts with wd_ or WD_ (the film's own).
     wdRagusa, wdRagusaNight, wdRagusaDawn   the walled city from the sea, at dusk, at night and at dawn (one room)
     wdGate, wdGateNight                     a gate in the walls, from the quay outside (one room)
     wdStreet, wdStreetNight                 the street up from the gate to the rector's palace (one room)
     wdCouncil                               the Great Council's hall
     wdTable                                 the table where the law is written, from just above
     wdCoast                                 the coast as a frosted map: the city, the open sea, Mrkan and Cavtat
   What moves is drawn live over them: ships, the gates' light and their doors, small people far off (wd_walker), lanterns, the haze
   of the sickness (coral, the module's colour for what must be kept out), windows going dark, the moon, the council's parchment. */

/* ---------------------------------------------------------------- the night's colours, and a few painting helpers */
const WD={
  sky:{dusk:[[6,17,22],[13,35,43],[40,66,74],[124,98,90]],night:[[4,12,17],[8,24,31],[18,40,48],[30,48,56]],dawn:[[12,30,40],[40,72,84],[118,136,138],[232,164,124]]},
  stone:[104,120,124],stoneLit:[150,166,168],stoneDark:[52,66,70],roof:[104,70,62],roofLit:[140,96,80],
  warm:[255,198,122],lamp:[255,214,150],sea:[[6,20,26],[4,14,19]],rock:[30,44,48],
  haze:[255,106,90],ice:[190,245,245]
};
// the light of each time of day on what is painted: f scales the stone and roofs, w the windows' warmth, rim the sky's light on top edges
const WD_TOD={dusk:{f:1,w:1,rim:0.32,stars:0.5},night:{f:0.62,w:1.1,rim:0.2,stars:1},dawn:{f:1.18,w:0.45,rim:0.42,stars:0.1}};
const wd_sc=(c,k)=>c.map(v=>clamp(Math.round(v*k),0,255));
function wd_glow(c,x,y,r,col,a){if(!(a>0))return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
function wd_sky(c,tod,h){const S=WD.sky[tod],g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,rgba(S[0],1));g.addColorStop(0.45,rgba(S[1],1));g.addColorStop(0.85,rgba(S[2],1));g.addColorStop(1,rgba(mix(S[2],S[3],0.5),1));
  c.fillStyle=g;c.fillRect(0,0,W,h);
  // a low glow where the sun went down (or comes up), behind the hills
  const gx=tod==="dawn"?1560:340,gy=h*0.62;c.save();c.translate(gx,gy);c.scale(1.9,0.55);const gl=c.createRadialGradient(0,0,0,0,0,700);
  gl.addColorStop(0,rgba(S[3],tod==="night"?0.10:tod==="dawn"?0.62:0.46));gl.addColorStop(0.5,rgba(S[3],tod==="night"?0.04:0.16));gl.addColorStop(1,rgba(S[3],0));c.fillStyle=gl;c.fillRect(-700,-700,1400,1400);c.restore();
  const R=ag_rnd(41),st=WD_TOD[tod].stars;for(let i=0;i<120;i++){const x=R()*W,y=R()*h*0.62,r=0.6+R()*1.5,a=(0.05+R()*0.3)*st*(1-y/(h*0.7));if(a>0.01){c.fillStyle=rgba([210,240,240],a);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}}}
// a ridge of hills: points [[x, y], ...] joined smoothly, filled to the foot, with the sky's light along its top
function wd_ridge(c,pts,foot,col,rimA){c.beginPath();c.moveTo(pts[0][0],foot);c.lineTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}
  const L=pts[pts.length-1];c.lineTo(L[0],L[1]);c.lineTo(L[0],foot);c.closePath();c.fillStyle=rgba(col,1);c.fill();
  if(rimA>0){c.save();c.strokeStyle=rgba(WD.ice,rimA);c.lineWidth=1.6;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}c.stroke();c.restore();}}
// a wall of stone: a box with courses of ashlar, lit from the sky on its top, darker to its foot; o.k the time's light
function wd_stoneBox(c,x,y,w,h,k,o){o=o||{};const base=wd_sc(o.col||WD.stone,k),g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(mix(base,WD.stoneLit,0.35),1));g.addColorStop(1,rgba(mix(base,WD.stoneDark,0.55),1));
  c.fillStyle=g;c.fillRect(x,y,w,h);if(o.courses!==false){const ch=o.course||10,R=ag_rnd(Math.round(x*7+y*3));c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
    c.strokeStyle=rgba(wd_sc(WD.stoneDark,k),0.22);c.lineWidth=1;for(let yy=y+ch;yy<y+h;yy+=ch){c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke();
      const off=R()*ch*2;for(let xx=x+off;xx<x+w;xx+=ch*(1.6+R()*1.4)){c.beginPath();c.moveTo(xx,yy-ch);c.lineTo(xx,yy);c.stroke();}}c.restore();}
  c.fillStyle=rgba(WD.ice,o.rim==null?0.25:o.rim);c.fillRect(x,y,w,1.5);}
// battlements along a wall's top: merlons every step px
function wd_merlons(c,x,y,w,k,step,mh){step=step||14;mh=mh||7;c.fillStyle=rgba(mix(wd_sc(WD.stone,k),WD.stoneLit,0.3),1);for(let xx=x;xx<x+w-step*0.4;xx+=step){c.fillRect(xx,y-mh,step*0.55,mh);}
  c.fillStyle=rgba(WD.ice,0.16);for(let xx=x;xx<x+w-step*0.4;xx+=step)c.fillRect(xx,y-mh,step*0.55,1.2);}
// a warm window: a small lit opening, with its glow; lit 0 to 1
function wd_window(c,x,y,w,h,lit,k){if(lit<=0){c.fillStyle=rgba(wd_sc([24,30,34],k),1);c.fillRect(x,y,w,h);return;}
  c.fillStyle=rgba(mix([40,36,34],WD.warm,lit),1);c.fillRect(x,y,w,h);wd_glow(c,x+w/2,y+h/2,Math.max(w,h)*2.2,WD.warm,0.16*lit);}
// a round arch: the path of an opening w wide, h high to its crown, from its foot at (x, y)
function wd_archPath(c,x,y,w,h){const r=w/2;c.moveTo(x,y);c.lineTo(x,y-h+r);c.arc(x+r,y-h+r,r,Math.PI,0);c.lineTo(x+w,y);c.closePath();}

/* ---------------------------------------------------------------- the city from the sea
   The city on its rocks, from the sea a little way out: the hill behind it, the landward walls along the top with a great round
   tower, the roofs rising between, the sea walls along the shore, the harbour on the right with its mole, and three gates, the only
   ways in (WD_GATES: the land gate on the west, the harbour gate, the land gate on the east), whose light and doors are drawn live. */
const WD_GATES=[[318,682,40,52],[1386,712,42,54],[1716,676,38,48]];   // each gate: x of its left side, y of its foot, w, h
const WD_HARBOUR={x0:1300,x1:1690,y:752};                             // the basin, where ships lie
// rocks along a shore: a jagged band from x0 to x1, its top near y0, its foot at y1, faceted and lit along their tops
function wd_rocks(c,x0,x1,y0,y1,k,seed){const R=ag_rnd(seed),pts=[];for(let x=x0;x<=x1;x+=14+R()*22)pts.push([x,y0+R()*16-4]);
  c.fillStyle=rgba(wd_sc(WD.rock,k),1);c.beginPath();c.moveTo(x0,y1);pts.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(x1,y1);c.closePath();c.fill();
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],m=[(a[0]+b[0])/2,(a[1]+b[1])/2+10+R()*12];
    c.fillStyle=rgba(mix(wd_sc(WD.rock,k),[60,80,84],0.25+R()*0.3),1);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(m[0],m[1]);c.closePath();c.fill();
    c.strokeStyle=rgba(WD.ice,0.10+R()*0.08);c.lineWidth=1.2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}}
function wd_paintRagusa(c,tod){const T=WD_TOD[tod],k=T.f,R=ag_rnd(1377),stone=wd_sc(WD.stone,k);
  wd_sky(c,tod,650);
  // thin clouds low over the hills, catching what light is left
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<7;i++){const x=R()*W,y=110+R()*200,w=300+R()*500;c.save();c.translate(x,y);c.scale(1,0.08);wd_glow(c,0,0,w,mix(WD.sky[tod][3],WD.ice,0.4),0.05);c.restore();}c.restore();
  // the hill behind the city, and a nearer slope, with the scrub on it as soft dark patches
  wd_ridge(c,[[0,430],[180,400],[420,330],[640,268],[860,236],[1060,250],[1260,300],[1500,360],[1720,392],[1920,420]],660,wd_sc([22,42,48],k*0.9),0.12);
  wd_ridge(c,[[0,500],[200,470],[420,440],[700,404],[980,392],[1240,420],[1500,452],[1760,470],[1920,486]],660,wd_sc([15,31,37],k*0.9),0.14);
  for(let i=0;i<900;i++){const x=R()*W,y=270+R()*380,r=1+R()*2.6;c.fillStyle=rgba([4,12,16],0.10+R()*0.16);c.beginPath();c.ellipse(x,y,r*1.5,r,0,0,TAU);c.fill();}
  // the sea
  let g=c.createLinearGradient(0,620,0,H);g.addColorStop(0,rgba(mix(WD.sea[0],WD.sky[tod][2],0.5),1));g.addColorStop(0.3,rgba(WD.sea[0],1));g.addColorStop(1,rgba(WD.sea[1],1));c.fillStyle=g;c.fillRect(0,620,W,H-620);
  // the slope the city climbs, inside the walls
  c.fillStyle=rgba(wd_sc([28,42,46],k),1);c.beginPath();c.moveTo(250,700);c.lineTo(300,470);c.lineTo(1500,486);c.lineTo(1660,700);c.closePath();c.fill();
  // houses, back to front, rising up the slope: each a wall of plastered stone, a tiled roof, and its windows, most of them lit;
  // the farther rows a little darker and cooler, as the air between dims them
  for(let row=0;row<9;row++){const y=482+row*23,x0=316,x1=1490,dk=0.72+0.28*row/8,cool=0.35*(1-row/8);
    for(let x=x0+R()*20;x<x1;){const w=30+R()*44,h=24+R()*18,top=y+R()*8,face=mix(mix([132,124,114],WD.stone,0.4),[70,92,102],cool);
      const fg=c.createLinearGradient(0,top,0,top+h+18);fg.addColorStop(0,rgba(wd_sc(face,k*dk*1.02),1));fg.addColorStop(1,rgba(wd_sc(face,k*dk*0.62),1));c.fillStyle=fg;c.fillRect(x,top,w,h+18);
      c.fillStyle=rgba(wd_sc([20,26,30],1),0.35);c.fillRect(x+w-3,top,3,h+18);
      const rc=mix(mix(WD.roof,WD.roofLit,R()*0.6),[60,70,80],cool);c.fillStyle=rgba(wd_sc(rc,k*dk),1);c.beginPath();c.moveTo(x-3,top+2);c.lineTo(x+w*0.5,top-9-R()*6);c.lineTo(x+w+3,top+2);c.closePath();c.fill();
      c.fillStyle=rgba(wd_sc(rc,k*dk*0.7),1);c.beginPath();c.moveTo(x+w*0.5,top-9);c.lineTo(x+w+3,top+2);c.lineTo(x+w*0.5,top+2);c.closePath();c.fill();
      c.fillStyle=rgba(WD.ice,0.05+0.05*T.rim);c.fillRect(x+w*0.15,top-4,w*0.32,1);
      const wl=()=>R()<0.66?T.w*(0.7+0.3*R()):0;
      if(R()<0.8)wd_window(c,x+w*0.28,top+9,4,6,wl(),k);if(R()<0.55)wd_window(c,x+w*0.64,top+10,4,6,wl(),k);if(R()<0.3)wd_window(c,x+w*0.46,top+h-2,4,6,wl(),k);
      x+=w+1+R()*5;}}
  // the bell tower by the harbour gate, and a church's long roof
  wd_stoneBox(c,1196,384,42,232,k*0.92,{course:12,rim:0.3});c.fillStyle=rgba(wd_sc(WD.roof,k),1);c.beginPath();c.moveTo(1190,386);c.lineTo(1217,322);c.lineTo(1244,386);c.closePath();c.fill();
  c.fillStyle=rgba(wd_sc(WD.roof,k*0.7),1);c.beginPath();c.moveTo(1217,322);c.lineTo(1244,386);c.lineTo(1217,386);c.closePath();c.fill();
  for(const yy of [404,466])wd_window(c,1209,yy,16,28,0,k);
  wd_stoneBox(c,820,470,150,88,k*0.86,{course:12,rim:0.2});c.fillStyle=rgba(wd_sc(WD.roof,k),1);c.beginPath();c.moveTo(812,472);c.lineTo(895,430);c.lineTo(978,472);c.closePath();c.fill();
  c.fillStyle=rgba(wd_sc(WD.roof,k*0.72),1);c.beginPath();c.moveTo(895,430);c.lineTo(978,472);c.lineTo(895,472);c.closePath();c.fill();wd_window(c,880,500,12,24,T.w*0.8,k);
  // the landward walls along the top, and their towers; the great round tower on the north-west corner
  wd_stoneBox(c,300,458,1200,28,k*0.86,{course:9});wd_merlons(c,300,458,1200,k*0.86,14,7);
  for(const tx of [700,980,1262,1460]){wd_stoneBox(c,tx-22,428,44,62,k*0.9,{course:10});wd_merlons(c,tx-22,428,44,k*0.9,11,6);}
  g=c.createLinearGradient(430,0,610,0);g.addColorStop(0,rgba(wd_sc(stone,0.62),1));g.addColorStop(0.32,rgba(mix(stone,WD.stoneLit,0.3),1));g.addColorStop(1,rgba(wd_sc(stone,0.5),1));
  const tower=cc=>{cc.beginPath();cc.moveTo(430,502);cc.lineTo(440,382);cc.quadraticCurveTo(520,364,600,382);cc.lineTo(610,502);cc.closePath();};
  tower(c);c.fillStyle=g;c.fill();c.save();tower(c);c.clip();c.strokeStyle=rgba(wd_sc(WD.stoneDark,k),0.28);c.lineWidth=1;
  for(let yy=392;yy<502;yy+=11){c.beginPath();c.moveTo(428,yy);c.quadraticCurveTo(520,yy+7,612,yy);c.stroke();}
  const sg=c.createLinearGradient(0,382,0,502);sg.addColorStop(0,"rgba(0,0,0,0)");sg.addColorStop(1,"rgba(0,0,0,0.3)");c.fillStyle=sg;c.fillRect(420,370,200,140);c.restore();
  wd_merlons(c,444,384,152,k*0.95,13,8);c.fillStyle=rgba(WD.ice,0.24);c.fillRect(444,382,152,1.4);
  // the walls down each side to the sea
  c.fillStyle=rgba(wd_sc(stone,0.66),1);c.beginPath();c.moveTo(284,706);c.lineTo(300,458);c.lineTo(328,458);c.lineTo(320,706);c.closePath();c.fill();
  c.fillStyle=rgba(WD.ice,0.16);c.fillRect(300,458,28,1.3);
  c.fillStyle=rgba(wd_sc(stone,0.62),1);c.beginPath();c.moveTo(1470,458);c.lineTo(1500,458);c.lineTo(1652,694);c.lineTo(1610,694);c.closePath();c.fill();
  c.strokeStyle=rgba(WD.ice,0.16);c.lineWidth=1.3;c.beginPath();c.moveTo(1500,458);c.lineTo(1652,694);c.stroke();
  // the land west and east, under the walls, and cypresses on it
  c.fillStyle=rgba(wd_sc([18,34,38],k),1);c.beginPath();c.moveTo(0,636);c.lineTo(220,636);c.lineTo(290,712);c.lineTo(170,780);c.lineTo(0,792);c.closePath();c.fill();
  c.beginPath();c.moveTo(1650,694);c.lineTo(1920,652);c.lineTo(1920,766);c.lineTo(1850,762);c.lineTo(1650,736);c.closePath();c.fill();
  for(const [x,y,h] of [[110,640,96],[150,648,72],[206,638,112],[1812,662,84],[1866,664,66]]){c.fillStyle=rgba(wd_sc([12,26,24],k),1);c.beginPath();c.moveTo(x,y-h);
    c.bezierCurveTo(x+12,y-h*0.6,x+14,y-h*0.2,x+8,y);c.lineTo(x-8,y);c.bezierCurveTo(x-14,y-h*0.2,x-12,y-h*0.6,x,y-h);c.fill();
    c.strokeStyle=rgba(WD.ice,0.10);c.lineWidth=1.2;c.beginPath();c.moveTo(x,y-h);c.bezierCurveTo(x-12,y-h*0.6,x-14,y-h*0.2,x-8,y);c.stroke();}
  // the rocks the city stands on, then the sea walls along the shore, a little sloped at their foot, with their towers
  wd_rocks(c,150,1320,714,754,k,77);
  const sea=(x,y,w,h)=>{wd_stoneBox(c,x,y,w,h,k*0.95,{course:10});const bg=c.createLinearGradient(0,y+h-22,0,y+h);bg.addColorStop(0,"rgba(0,0,0,0)");bg.addColorStop(1,"rgba(4,12,16,0.45)");c.fillStyle=bg;c.fillRect(x,y+h-22,w,22);};
  sea(290,646,1030,74);wd_merlons(c,290,646,1030,k*0.95,14,7);
  for(const [tx,th] of [[380,118],[640,104],[900,112],[1140,100]]){sea(tx-26,720-th,52,th);wd_merlons(c,tx-26,720-th,52,k*0.95,13,7);c.fillStyle=rgba([14,20,24],0.8);c.fillRect(tx-3,720-th+26,6,12);}
  // the harbour: its walls round the basin, a fortress at its mouth, the mole, and the quay
  sea(1310,670,240,64);wd_merlons(c,1310,670,240,k*0.95,14,6);
  sea(1540,646,120,90);wd_merlons(c,1540,646,120,k*0.95,13,7);
  sea(1650,662,110,74);wd_merlons(c,1650,662,110,k*0.95,13,6);
  c.fillStyle=rgba(wd_sc([66,80,84],k),1);c.fillRect(1300,734,300,12);c.fillStyle=rgba(WD.ice,0.14);c.fillRect(1300,734,300,1.2);
  c.fillStyle=rgba(wd_sc([74,88,92],k),1);c.beginPath();c.moveTo(1592,746);c.lineTo(1860,746);c.lineTo(1880,762);c.lineTo(1600,762);c.closePath();c.fill();c.fillStyle=rgba(WD.ice,0.16);c.fillRect(1592,746,268,1.3);
  // the gates: dark openings in the walls, a stone frame round each, and a bridge to the west one
  for(const [x,y,w,h] of WD_GATES){c.fillStyle=rgba(wd_sc([14,20,24],k),1);c.beginPath();wd_archPath(c,x,y,w,h);c.fill();
    c.strokeStyle=rgba(mix(wd_sc(WD.stoneLit,k),WD.ice,0.2),0.45);c.lineWidth=2.4;c.beginPath();c.moveTo(x-3,y);c.lineTo(x-3,y-h+w/2);c.arc(x+w/2,y-h+w/2,w/2+3,Math.PI,0);c.lineTo(x+w+3,y);c.stroke();}
  c.fillStyle=rgba(wd_sc([70,84,88],k),1);c.fillRect(222,682,98,10);c.fillStyle=rgba(WD.ice,0.12);c.fillRect(222,682,98,1.2);
  for(const x of [236,262,288])c.fillRect(x,692,6,22);
  // a few lanterns on the walls
  for(const [x,y] of [[338,630],[1408,656],[1734,622],[905,600]]){wd_glow(c,x,y,26,WD.lamp,0.32*T.w);c.fillStyle=rgba(WD.lamp,0.95*Math.min(1,T.w));c.beginPath();c.arc(x,y,2.6,0,TAU);c.fill();}
  // the sea: the city mirrored, blurred and broken by slow ripples; light lying on the swell
  const [ref,rx]=ag_buf("wdref",W,320);rx.save();rx.translate(0,750);rx.scale(1,-1);rx.drawImage(c.canvas,0,0,W,H,0,0,W,H);rx.restore();
  const [rb,rbx]=ag_buf("wdrefb",W,320);dp_blurDraw(rbx,ref,0,0,W,320,0,0,W,320,3);
  for(let y=0;y<320;y+=2){const off=Math.sin(y*0.23)*4+Math.sin(y*0.061+1)*7;c.globalAlpha=0.36*Math.pow(1-y/320,1.3);c.drawImage(rb,0,y,W,2,off,750+y,W,2);}c.globalAlpha=1;
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<260;i++){const x=R()*W,y=764+Math.pow(R(),1.5)*316,w=16+R()*80;c.fillStyle=rgba(WD.ice,0.015+R()*0.04*(1-(y-764)/330));c.fillRect(x,y,w,1.2);}c.restore();
  c.fillStyle="rgba(0,0,0,0.22)";c.fillRect(0,748,W,4);}
AG_PLACES.wdRagusa=c=>wd_paintRagusa(c,"dusk");
AG_PLACES.wdRagusaNight=c=>wd_paintRagusa(c,"night");
AG_PLACES.wdRagusaDawn=c=>wd_paintRagusa(c,"dawn");
AG_ROOMS.wdRagusaNight="wdRagusa";AG_ROOMS.wdRagusaDawn="wdRagusa";

/* ---------------------------------------------------------------- a gate in the walls, from the quay outside
   The walls fill the frame above the quay; the gate's arch in the middle, its passage, and at its far end the street inside, lit
   warm; a tower to the left; the harbour and its water to the right, where a ship can lie at the quay (wd_ship, drawn live); a lantern
   on a bracket by the gate. The gate's doors (wd_gateDoors) and the light in its passage are drawn live: open, shut, or swinging. */
const WD_GATE={x:780,y:780,w:330,h:430};                        // the arch: its left side, its foot, its width, its height to the crown
function wd_paintGate(c,tod){const T=WD_TOD[tod],k=T.f*0.95,R=ag_rnd(1348),G=WD_GATE,stone=wd_sc(WD.stone,k);
  wd_sky(c,tod,700);
  // the far shore across the harbour, low, and the water
  wd_ridge(c,[[1380,560],[1520,520],[1700,540],[1920,500]],700,wd_sc([18,36,42],k),0.12);
  let g=c.createLinearGradient(0,640,0,H);g.addColorStop(0,rgba(mix(WD.sea[0],WD.sky[tod][2],0.4),1));g.addColorStop(1,rgba(WD.sea[1],1));c.fillStyle=g;c.fillRect(1380,640,540,H-640);
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<90;i++){const x=1390+R()*530,y=660+R()*420,w=14+R()*60;c.fillStyle=rgba(WD.ice,0.02+R()*0.05);c.fillRect(x,y,w,1.2);}c.restore();
  // the wall: big courses of dressed stone, lit from above, darker towards the quay
  const wall=cc=>{cc.beginPath();cc.moveTo(0,0);cc.lineTo(1440,0);cc.lineTo(1440,640);cc.lineTo(1400,800);cc.lineTo(0,800);cc.closePath();};
  wall(c);g=c.createLinearGradient(0,0,0,800);g.addColorStop(0,rgba(wd_sc(stone,0.78),1));g.addColorStop(0.55,rgba(stone,1));g.addColorStop(1,rgba(wd_sc(stone,0.62),1));c.fillStyle=g;c.fill();
  c.save();wall(c);c.clip();for(let y=0;y<800;){const ch=34+R()*14;let x=-R()*90;while(x<1440){const w=60+R()*110;c.fillStyle=rgba(mix(stone,R()<0.5?WD.stoneLit:WD.stoneDark,0.06+R()*0.2),0.55);c.fillRect(x+2,y+2,w-4,ch-4);
      c.fillStyle=rgba(wd_sc(WD.stoneDark,k*0.8),0.5);c.fillRect(x,y,w,2);c.fillRect(x,y,2,ch);c.fillStyle=rgba(WD.ice,0.045);c.fillRect(x+3,y+2,w-6,1.2);x+=w;}y+=ch;}
  // weathering: soft darker streaks down from the top, and the dusk's shade over the whole wall
  for(let i=0;i<26;i++){const x=R()*1440,w=10+R()*50,h=100+R()*500;const sg=c.createLinearGradient(0,0,0,h);sg.addColorStop(0,"rgba(10,20,24,0.08)");sg.addColorStop(1,"rgba(10,20,24,0)");c.fillStyle=sg;c.fillRect(x,0,w,h);}
  c.fillStyle=rgba([6,16,20],0.3);c.fillRect(0,0,1440,800);c.restore();
  // the tower to the left, standing out from the wall, its own shadow on the wall beside it
  g=c.createLinearGradient(160,0,560,0);g.addColorStop(0,rgba(wd_sc(stone,0.55),1));g.addColorStop(0.4,rgba(mix(stone,WD.stoneLit,0.25),1));g.addColorStop(1,rgba(wd_sc(stone,0.7),1));
  c.fillStyle=g;c.fillRect(160,0,400,800);c.save();c.beginPath();c.rect(160,0,400,800);c.clip();for(let y=0;y<800;y+=40){c.fillStyle=rgba(wd_sc(WD.stoneDark,k),0.4);c.fillRect(160,y,400,2);
    for(let x=160+((y/40)%2)*60;x<560;x+=120)c.fillRect(x,y,2,40);}c.restore();
  const ts=c.createLinearGradient(560,0,640,0);ts.addColorStop(0,"rgba(4,12,16,0.5)");ts.addColorStop(1,"rgba(4,12,16,0)");c.fillStyle=ts;c.fillRect(560,0,80,800);
  c.fillStyle=rgba([10,16,20],0.9);rr(c,330,240,22,70,8);c.fill();rr(c,330,470,22,70,8);c.fill();
  // the arch: its stones round the opening, the passage going in, and the street beyond (its light drawn live)
  c.save();c.beginPath();wd_archPath(c,G.x,G.y,G.w,G.h);c.clip();
  g=c.createLinearGradient(0,G.y-G.h,0,G.y);g.addColorStop(0,"rgb(14,18,20)");g.addColorStop(1,"rgb(22,24,24)");c.fillStyle=g;c.fillRect(G.x,G.y-G.h,G.w,G.h);
  // the passage's inner arch, smaller, and the street through it: house fronts, warm windows, paving
  const ix=G.x+70,iw=G.w-140,ih=G.h-120;c.fillStyle="rgb(30,34,34)";c.beginPath();wd_archPath(c,ix,G.y-30,iw,ih);c.fill();
  c.save();c.beginPath();wd_archPath(c,ix+8,G.y-30,iw-16,ih-12);c.clip();g=c.createLinearGradient(0,G.y-30-ih,0,G.y-30);g.addColorStop(0,"rgb(26,36,40)");g.addColorStop(1,"rgb(60,50,40)");c.fillStyle=g;c.fillRect(ix,G.y-30-ih,iw,ih);
  for(let i=0;i<4;i++){const hx=ix+8+i*(iw/4),hy=G.y-30-ih*0.66;c.fillStyle=rgba([84,74,64],1);c.fillRect(hx,hy,iw/4-4,ih*0.66);wd_window(c,hx+10,hy+20,10,16,0.9,1);wd_window(c,hx+10,hy+70,10,16,0.8,1);}
  c.fillStyle="rgb(70,58,46)";c.fillRect(ix,G.y-40,iw,12);c.restore();
  c.restore();
  // voussoirs: the wedge stones of the arch, lit along their faces
  const cx=G.x+G.w/2,cy=G.y-G.h+G.w/2,r0=G.w/2,r1=G.w/2+44;for(let i=0;i<13;i++){const a0=Math.PI+i*Math.PI/13,a1=a0+Math.PI/13;c.beginPath();c.arc(cx,cy,r1,a0+0.01,a1-0.01);c.arc(cx,cy,r0,a1-0.01,a0+0.01,true);c.closePath();
    c.fillStyle=rgba(wd_sc(mix(stone,i%2?WD.stoneLit:WD.stone,0.3),0.86),1);c.fill();c.strokeStyle=rgba(wd_sc(WD.stoneDark,k),0.6);c.lineWidth=1.5;c.stroke();}
  for(const side of [G.x-44,G.x+G.w]){c.fillStyle=rgba(mix(stone,WD.stoneLit,0.2),1);c.fillRect(side,cy,44,G.y-cy);for(let y=cy;y<G.y;y+=46){c.fillStyle=rgba(wd_sc(WD.stoneDark,k),0.6);c.fillRect(side,y,44,1.6);}}
  c.fillStyle=rgba(WD.ice,0.18);c.beginPath();c.arc(cx,cy,r1,Math.PI,TAU);c.lineWidth=1.4;c.strokeStyle=rgba(WD.ice,0.2);c.stroke();
  // the lantern's bracket by the gate (its flame drawn live)
  c.strokeStyle="rgb(30,30,32)";c.lineWidth=5;c.beginPath();c.moveTo(G.x+G.w+60,480);c.lineTo(G.x+G.w+110,480);c.lineTo(G.x+G.w+110,500);c.stroke();
  // the quay: big slabs going away from us, wet and catching the light
  g=c.createLinearGradient(0,780,0,H);g.addColorStop(0,rgba(wd_sc([66,74,74],k),1));g.addColorStop(1,rgba(wd_sc([36,44,46],k),1));c.fillStyle=g;c.beginPath();c.moveTo(0,780);c.lineTo(1400,780);c.lineTo(1520,H);c.lineTo(0,H);c.closePath();c.fill();
  c.save();c.beginPath();c.moveTo(0,780);c.lineTo(1400,780);c.lineTo(1520,H);c.lineTo(0,H);c.closePath();c.clip();c.strokeStyle=rgba([10,16,18],0.4);c.lineWidth=1.5;
  for(let j=1;j<9;j++){const y=780+Math.pow(j/9,1.6)*300;c.beginPath();c.moveTo(0,y);c.lineTo(1520,y);c.stroke();}
  for(let i=-10;i<16;i++){c.beginPath();c.moveTo(G.x+G.w/2+i*90,780);c.lineTo(G.x+G.w/2+i*190,H);c.stroke();}
  c.restore();
  // the quay's edge over the water, and a few bollards and bales waiting
  c.fillStyle=rgba(wd_sc([90,100,100],k),1);c.beginPath();c.moveTo(1400,780);c.lineTo(1440,780);c.lineTo(1560,H);c.lineTo(1520,H);c.closePath();c.fill();
  for(const [x,y,s] of [[1330,820,1],[1420,930,1.5]]){c.fillStyle="rgb(20,24,26)";rr(c,x-10*s,y-30*s,20*s,30*s,6*s);c.fill();c.fillStyle=rgba(WD.ice,0.15);c.fillRect(x-8*s,y-30*s,16*s,1.5);}
  c.fillStyle="rgba(0,0,0,0.28)";c.fillRect(0,776,1400,6);}
AG_PLACES.wdGate=c=>wd_paintGate(c,"dusk");
AG_PLACES.wdGateNight=c=>wd_paintGate(c,"night");
AG_ROOMS.wdGateNight="wdGate";
// the light in the gate's passage and the street beyond (0 dark, 1 lit), and the haze drifting in (coral, 0 to 1, u how far in)
function wd_gateLight(ctx,a){if(a<=0)return;const G=WD_GATE;ctx.save();ctx.globalCompositeOperation="lighter";ctx.beginPath();wd_archPath(ctx,G.x,G.y,G.w,G.h);ctx.clip();
  wd_glow(ctx,G.x+G.w/2,G.y-120,320,WD.lamp,0.16*a);ctx.restore();}
// the gate's two doors of oak planks with iron bands: open 1 (folded back into the passage), shut 0; a lock in the middle when shut
function wd_gateDoors(ctx,open,o){o=o||{};const G=WD_GATE,u=clamp(open,0,1);if(u>=0.999)return;const cx=G.x+G.w/2,top=G.y-G.h;ctx.save();ctx.beginPath();wd_archPath(ctx,G.x,G.y,G.w,G.h);ctx.clip();
  for(const side of [-1,1]){const w=G.w/2*(1-u*0.86),x0=side<0?G.x:cx+(G.w/2-w)*0;ctx.save();
    // a door seen turning on its hinge: it narrows as it opens, darker as it turns away
    const x=side<0?G.x:G.x+G.w-w;const g=ctx.createLinearGradient(x,0,x+w,0),base=mix([58,44,34],[30,24,20],u*0.8);g.addColorStop(0,rgba(base,1));g.addColorStop(1,rgba(mix(base,[0,0,0],0.25),1));
    ctx.fillStyle=g;ctx.fillRect(x,top,w,G.h);ctx.strokeStyle="rgba(12,8,6,0.6)";ctx.lineWidth=1.5;for(let i=1;i<6;i++){const px=x+w*i/6;ctx.beginPath();ctx.moveTo(px,top);ctx.lineTo(px,G.y);ctx.stroke();}
    ctx.fillStyle="rgb(26,26,28)";for(const by of [G.y-80,G.y-220,G.y-340])ctx.fillRect(x,by,w,9);
    ctx.fillStyle="rgba(200,220,220,0.18)";for(const by of [G.y-80,G.y-220,G.y-340])ctx.fillRect(x,by,w,1.2);ctx.restore();}
  if(u<0.05&&o.lock!==false){ctx.fillStyle="rgb(30,28,28)";rr(ctx,cx-16,G.y-200,32,46,5);ctx.fill();ctx.fillStyle="rgba(220,200,160,0.35)";ctx.fillRect(cx-14,G.y-198,28,1.4);ctx.fillStyle="rgb(8,8,8)";ctx.beginPath();ctx.arc(cx,G.y-184,4,0,TAU);ctx.fill();ctx.fillRect(cx-1.5,G.y-182,3,10);}
  ctx.restore();}
// the lantern by the gate: its flame and its light on the wall and the quay
function wd_gateLantern(ctx,t,a){if(a<=0)return;const G=WD_GATE,x=G.x+G.w+110,y=528,f=1+0.05*Math.sin(t*7.3)+0.03*Math.sin(t*13.1);ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,x,y,240*f,WD.lamp,0.22);wd_glow(ctx,x,y+300,260,WD.lamp,0.06);ctx.restore();
  ctx.fillStyle="rgb(26,24,22)";ctx.beginPath();ctx.moveTo(x-16,y-26);ctx.lineTo(x+16,y-26);ctx.lineTo(x+20,y+22);ctx.lineTo(x-20,y+22);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(WD.lamp,0.95);ctx.fillRect(x-12,y-20,24,38);ctx.fillStyle="rgb(255,244,214)";ctx.beginPath();ctx.ellipse(x,y+2,4,9*f,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(26,24,22)";ctx.fillRect(x-1.5,y-20,3,38);ctx.fillRect(x-18,y-30,36,6);ctx.restore();}

/* ---------------------------------------------------------------- people far off, ships, haze
   wd_walker(ctx, x, y, s, o): a person seen far off, as a lit silhouette (no face at this size): a cloak or a tunic to the knee, a
   hood or a cap, walking (o.ph, the step's phase; o.walk 0 to 1) or standing; facing right, or left with o.flip; o.back seen from
   behind. What they carry: o.carry "bale" (on the near shoulder), "barrel" (rolled before them), "lantern" (held low, lit), "keys"
   (a ring of great iron keys held before them). (x, y) is between the feet; s 1 is 180 px from the feet to the crown. o.light: the
   warm side's strength (from a lantern or a lit door), o.col the cloak's colour. */
function wd_walker(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const ph=o.ph||0,wk=o.walk==null?1:o.walk,bob=-Math.abs(Math.sin(ph))*1.8*wk,sw=Math.sin(ph)*0.34*wk,
    col=o.col||[52,58,62],lit=o.light==null?0.5:o.light,dir=o.flip?-1:1;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(dir*s*1.74,s*1.74);ctx.translate(0,bob);
  const dark=mix(col,[6,12,16],0.5),warm=mix(col,[255,200,140],0.32*lit),hose=mix(dark,[0,0,0],0.25),ice=[180,235,235];
  // legs under the hem, stepping, feet a little apart when standing (the far one darker)
  const leg=(ang,dx,c0)=>{ctx.save();ctx.translate(dx,-29);ctx.rotate(ang);ctx.fillStyle=rgba(c0,1);ctx.beginPath();ctx.moveTo(-3.1,0);ctx.bezierCurveTo(-3.4,10,-2.8,20,-2.2,27);ctx.lineTo(2.4,27);ctx.bezierCurveTo(3,20,3.4,10,3.1,0);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgb(16,14,14)";ctx.beginPath();ctx.moveTo(-2.6,26);ctx.bezierCurveTo(-3,29.5,4,30.5,6.4,29);ctx.lineTo(2.6,26);ctx.closePath();ctx.fill();ctx.restore();};
  leg(-sw,-2.6*(1-wk*0.6),mix(hose,[0,0,0],0.3));leg(sw,2.6*(1-wk*0.6),hose);
  // the barrel, on its side, rolled before them: its end towards us, its hoops, a mark that turns as it rolls
  if(o.carry==="barrel"){ctx.save();ctx.translate(19,-14);ctx.fillStyle="rgb(86,62,42)";ctx.beginPath();ctx.ellipse(0,0,13,14,0,0,TAU);ctx.fill();ctx.strokeStyle="rgb(40,32,28)";ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(0,0,13,14,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,9,10,0,0,TAU);ctx.stroke();ctx.rotate(ph*0.7);ctx.strokeStyle="rgba(30,24,20,0.7)";ctx.lineWidth=1.2;
    for(let i=0;i<4;i++){ctx.rotate(Math.PI/4);ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.stroke();}ctx.restore();
    ctx.fillStyle="rgba(200,235,235,0.25)";ctx.beginPath();ctx.arc(19,-14,13.5,-2.6,-1.6);ctx.lineTo(19,-14);ctx.fill();}
  // the cloak, from the shoulders to mid-calf, falling in an A from them, its hem a soft curve; folds down it; lit on the side facing
  // the light, a cool rim along its back
  const cloak=cc=>{cc.beginPath();cc.moveTo(-4,-87);cc.bezierCurveTo(-9.5,-86,-11,-81,-11.4,-74);cc.bezierCurveTo(-12,-60,-13.4,-44,-14.4,-28);cc.quadraticCurveTo(0,-24.5,14,-28.4);
    cc.bezierCurveTo(13,-44,11.6,-60,10.8,-74);cc.bezierCurveTo(10.4,-81,8.6,-86,4,-87);cc.closePath();};
  cloak(ctx);let g=ctx.createLinearGradient(-14,0,14,0);g.addColorStop(0,rgba(dark,1));g.addColorStop(0.55,rgba(col,1));g.addColorStop(1,rgba(warm,1));ctx.fillStyle=g;ctx.fill();
  ctx.save();cloak(ctx);ctx.clip();
  for(const [x0,x1,d] of [[-5,-8,0.35],[3,4,0.3],[8,10,0.22]]){ctx.strokeStyle=rgba(mix(dark,[0,0,0],0.5),d);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0*0.6,-74);ctx.quadraticCurveTo(x0,-50,x1,-27);ctx.stroke();
    ctx.strokeStyle=rgba(mix(col,[255,255,255],0.2),d*0.4);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0*0.6+1.4,-74);ctx.quadraticCurveTo(x0+1.4,-50,x1+1.4,-27);ctx.stroke();}
  // the near arm, hanging under the cloak, a little darker at its edge
  if(o.carry!=="barrel"){ctx.strokeStyle=rgba(mix(dark,[0,0,0],0.3),0.45);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(8.8,-80);ctx.quadraticCurveTo(10.6,-64,9.6,-50);ctx.stroke();}
  const sg=ctx.createLinearGradient(0,-90,0,-26);sg.addColorStop(0,"rgba(255,255,255,0.05)");sg.addColorStop(1,"rgba(0,0,0,0.18)");ctx.fillStyle=sg;ctx.fillRect(-16,-90,32,66);ctx.restore();
  ctx.strokeStyle=rgba(ice,0.4);ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-10.6,-80);ctx.bezierCurveTo(-11.6,-66,-13,-46,-14,-30);ctx.stroke();
  // the head: a hood framing the face, or a cap; seen from behind, only the hood
  const skin=mix([152,112,88],[40,40,46],0.3);
  if(o.hood!==false){const hood=cc=>{cc.beginPath();cc.moveTo(-8.4,-83);cc.bezierCurveTo(-11.4,-90,-10.4,-102,-1.6,-104.6);cc.bezierCurveTo(5.6,-105.6,10.6,-100,10.2,-91);cc.bezierCurveTo(9.6,-86,7.6,-83,4.8,-82);cc.quadraticCurveTo(-2,-80.6,-8.4,-83);cc.closePath();};
    hood(ctx);const hg=ctx.createLinearGradient(-10,0,10,0);hg.addColorStop(0,rgba(mix(dark,[0,0,0],0.1),1));hg.addColorStop(1,rgba(mix(col,warm,0.5),1));ctx.fillStyle=hg;ctx.fill();
    if(!o.back){ctx.fillStyle="rgba(10,8,8,0.55)";ctx.beginPath();ctx.ellipse(3.6,-92,4.6,6.6,0.08,0,TAU);ctx.fill();ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(4.4,-91.6,3.4,5.4,0.08,0,TAU);ctx.fill();}
    else{ctx.strokeStyle=rgba(mix(dark,[0,0,0],0.4),0.5);ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(0.6,-103);ctx.quadraticCurveTo(-0.6,-94,0.4,-84);ctx.stroke();}
    ctx.strokeStyle=rgba(ice,0.45);ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-8.6,-84);ctx.bezierCurveTo(-11.2,-90,-10.2,-101,-2,-104);ctx.stroke();}
  else{ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.moveTo(-1,-86);ctx.lineTo(3.4,-86);ctx.lineTo(3,-83);ctx.lineTo(-1.4,-83);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.ellipse(1.6,-93.4,5,6.4,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(mix(skin,[0,0,0],0.3),1);ctx.beginPath();ctx.ellipse(-1.6,-93,1.4,2.2,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(mix(col,[10,10,10],0.55),1);ctx.beginPath();ctx.ellipse(0.8,-98.6,6.2,3.6,0,Math.PI,TAU);ctx.fill();ctx.fillRect(-5.6,-99.2,13.2,2.2);
    ctx.strokeStyle=rgba(ice,0.35);ctx.lineWidth=1;ctx.beginPath();ctx.arc(1.6,-93.4,5.4,2.2,3.9);ctx.stroke();}
  // what the near hand holds
  const hand=(hx,hy)=>{ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(hx,hy,2.5,2.2,0,0,TAU);ctx.fill();};
  if(o.carry==="bale"){ctx.fillStyle="rgb(146,124,94)";rr(ctx,-1,-104,22,19,4);ctx.fill();ctx.strokeStyle="rgb(86,68,50)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-1,-95);ctx.lineTo(21,-95);ctx.moveTo(10,-104);ctx.lineTo(10,-85);ctx.stroke();
    ctx.fillStyle="rgba(10,8,6,0.3)";ctx.fillRect(-1,-88,22,3);hand(10.5,-84);}
  else if(o.carry==="barrel")hand(10.4,-44);
  else if(o.carry==="lantern"){const lx=11.6,ly=-46;ctx.strokeStyle="rgb(24,22,20)";ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(lx,ly-10);ctx.lineTo(lx,ly-4.5);ctx.stroke();
    ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,lx,ly+3,50,WD.lamp,0.32);ctx.restore();ctx.fillStyle="rgb(24,22,20)";ctx.fillRect(lx-4.5,ly-4.5,9,14);ctx.fillStyle=rgba(WD.lamp,1);ctx.fillRect(lx-3,ly-2.5,6,9.5);hand(lx,ly-11);}
  else if(o.carry==="keys"){const kx=10,ky=-50;ctx.strokeStyle="rgb(160,140,104)";ctx.lineWidth=1.7;ctx.beginPath();ctx.arc(kx,ky,5.4,0,TAU);ctx.stroke();
    for(const [dx,ang] of [[-2,0.5],[1,0.15],[3,-0.2],[5,-0.5]]){ctx.save();ctx.translate(kx+dx*0.6,ky+4.4);ctx.rotate(ang+Math.sin(ph)*0.08);ctx.strokeStyle="rgb(126,108,82)";ctx.lineWidth=1.9;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,17);ctx.stroke();
      ctx.fillStyle="rgb(126,108,82)";ctx.fillRect(0,13,4,2.6);ctx.fillRect(0,16,3,2);ctx.restore();}
    ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,kx,ky+6,14,[255,214,150],0.18);ctx.restore();hand(kx,ky-6.4);}
  ctx.restore();}
// a ship of the time, a cog: a round hull, a castle at the stern, one mast with its sail furled (sail 0) or set (sail 1); lantern at the stern;
// facing right (flip: left); (x, y) is where its hull meets the water; s 1 is about 300 px long. o.rim: a coral rim (the sickness aboard)
function wd_ship(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=o.k||1,sail=o.sail==null?0:o.sail,rock=Math.sin((o.t||0)*0.9+(o.seed||0))*0.012;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(rock);ctx.scale(o.flip?-s:s,s);
  const hull=cc=>{cc.beginPath();cc.moveTo(-150,-62);cc.bezierCurveTo(-140,-10,-90,14,0,16);cc.bezierCurveTo(90,14,140,-6,156,-70);cc.lineTo(140,-62);cc.bezierCurveTo(90,-44,-60,-44,-130,-56);cc.closePath();};
  hull(ctx);let g=ctx.createLinearGradient(0,-70,0,16);g.addColorStop(0,rgba(wd_sc([88,66,48],k),1));g.addColorStop(1,rgba(wd_sc([30,24,20],k),1));ctx.fillStyle=g;ctx.fill();
  ctx.save();hull(ctx);ctx.clip();ctx.strokeStyle="rgba(10,8,6,0.5)";ctx.lineWidth=1.6;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-160,-50+i*12);ctx.bezierCurveTo(-90,-26+i*10,90,-26+i*10,160,-56+i*12);ctx.stroke();}ctx.restore();
  // the stern castle, and a small one at the bow
  ctx.fillStyle=rgba(wd_sc([70,54,40],k),1);ctx.fillRect(-150,-104,62,46);ctx.fillRect(112,-96,40,30);ctx.fillStyle="rgba(200,235,235,0.18)";ctx.fillRect(-150,-104,62,1.6);ctx.fillRect(112,-96,40,1.4);
  ctx.fillStyle="rgb(20,16,14)";for(let i=0;i<5;i++)ctx.fillRect(-146+i*12,-112,6,8);
  // the mast, its yard, and the sail
  ctx.fillStyle=rgba(wd_sc([60,46,34],k),1);ctx.fillRect(-4,-330,8,290);
  const yy=-300,sw=sail;if(sw>0.02){ctx.fillStyle=rgba(wd_sc([170,156,130],k),1);ctx.beginPath();ctx.moveTo(-96,yy);ctx.lineTo(96,yy);ctx.quadraticCurveTo(110,yy+110*sw,90,yy+200*sw);ctx.lineTo(-90,yy+200*sw);ctx.quadraticCurveTo(-80,yy+100*sw,-96,yy);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(10,12,14,0.18)";ctx.fillRect(-90,yy+200*sw-20,180,20);}
  ctx.fillStyle=rgba(wd_sc([74,58,44],k),1);ctx.fillRect(-100,yy-6,200,8);ctx.fillStyle=rgba(wd_sc([150,138,116],k),1);if(sw<=0.02)rr(ctx,-92,yy-2,184,12,6),ctx.fill();
  ctx.strokeStyle="rgba(30,28,26,0.8)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,-330);ctx.lineTo(-150,-104);ctx.moveTo(0,-330);ctx.lineTo(152,-96);ctx.moveTo(-100,yy);ctx.lineTo(-140,-60);ctx.moveTo(100,yy);ctx.lineTo(140,-62);ctx.stroke();
  // the stern lantern
  if(o.lamp!==false){ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,-150,-118,40,WD.lamp,0.4);ctx.restore();ctx.fillStyle=rgba(WD.lamp,1);ctx.fillRect(-154,-126,8,10);}
  // the sickness aboard: a faint coral rim along the hull and the castle
  if(o.rim>0){ctx.save();ctx.strokeStyle=rgba(WD.haze,0.9*o.rim);ctx.shadowColor=rgba(WD.haze,1);ctx.shadowBlur=14;ctx.lineWidth=3;hull(ctx);ctx.stroke();ctx.strokeRect(-150,-104,62,46);ctx.restore();}
  ctx.restore();}
// the haze of the sickness, coral, soft: blobs drifting along a path pts [[x, y], ...] up to how far u (0 to 1), at strength a
function wd_haze(ctx,pts,u,a,t,o){if(!(a>0)||u<=0)return;o=o||{};const R=ag_rnd(o.seed||5),n=o.n||22,r0=o.r||70;ctx.save();ctx.globalCompositeOperation="lighter";
  const L=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
  const at=v=>{let d=v*tot;for(let i=0;i<L.length;i++){if(d<=L[i]||i===L.length-1){const f=L[i]?d/L[i]:0;return[lerp(pts[i][0],pts[i+1][0],f),lerp(pts[i][1],pts[i+1][1],f)];}d-=L[i];}return pts[0];};
  for(let i=0;i<n;i++){const v=(i/n)*u,p=at(v),dx=Math.sin((t||0)*0.4+i*1.7)*r0*0.4,dy=Math.cos((t||0)*0.33+i*2.3)*r0*0.25,r=r0*(0.6+R()*0.8);wd_glow(ctx,p[0]+dx,p[1]+dy,r,WD.haze,0.05*a);}
  ctx.restore();}

/* ---------------------------------------------------------------- the street up to the rector's palace
   One straight street from just inside a gate up to the rector's palace, in one-point perspective: house fronts on both sides, three
   floors of windows (their light drawn live, wd_streetWindows), the paving between, and the palace across the far end, its arcade lit
   and its door (drawn live) in the middle. Depth z runs from 1 (here) to 4 (the palace); wd_st gives a point on it. */
const WD_ST={vx:960,hz:470,g:610,top:1600,half:700};
// a point of the street: side -1 the left fronts, 1 the right, 0 the middle of the paving; h the height (0 the ground, 1 the roofs)
function wd_st(side,h,z,dx){const S=WD_ST;return[S.vx+(side*S.half+(dx||0))/z,S.hz+(S.g-h*S.top)/z];}
// the windows: small openings, irregular, three floors on each house; each knows its house's depth and floor
const WD_SWIN=(()=>{const L=[],R=ag_rnd(9);for(const side of [-1,1])for(const z of [0.9,1.08,1.3,1.56,1.86,2.2,2.6,3.04])for(const h of [0.36,0.56,0.76]){if(R()<0.12)continue;
  const wz=0.032*z*z;L.push({side,z:z+R()*0.04*z,h:h+(R()-0.5)*0.03,wz,hh:0.07});}return L;})();
function wd_quad(c,side,h0,h1,z0,z1){const a=wd_st(side,h1,z0),b=wd_st(side,h1,z1),d=wd_st(side,h0,z1),e=wd_st(side,h0,z0);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
function wd_paintStreet(c,tod){const T=WD_TOD[tod],k=T.f*0.86,R=ag_rnd(1417);
  wd_sky(c,tod,600);
  // the fronts: plastered stone, each house its own shade and height, a cornice under the roofs, a door at the foot of some
  for(const side of [-1,1]){const zs=[0.7,0.98,1.2,1.43,1.7,2.03,2.4,2.82,3.3,4];for(let i=0;i<zs.length-1;i++){const z0=zs[i],z1=zs[i+1],base=mix([120,112,100],[90,102,108],R()*0.7),top=0.94+R()*0.06;
      wd_quad(c,side,0,top,z0,z1);const p0=wd_st(side,0,z0),p1=wd_st(side,0,z1),g=c.createLinearGradient(p0[0],0,p1[0],0);g.addColorStop(0,rgba(wd_sc(base,k*0.8),1));g.addColorStop(1,rgba(wd_sc(base,k*0.5),1));c.fillStyle=g;c.fill();
      // stone courses on the lower floor
      c.save();wd_quad(c,side,0,0.26,z0,z1);c.clip();c.strokeStyle="rgba(10,14,16,0.22)";c.lineWidth=1;for(let h=0.03;h<0.26;h+=0.045){const a=wd_st(side,h,z0),b=wd_st(side,h,z1);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}c.restore();
      wd_quad(c,side,0,top,z0,z1);c.strokeStyle="rgba(8,14,16,0.55)";c.lineWidth=2;c.stroke();
      wd_quad(c,side,top-0.04,top,z0,z1);c.fillStyle=rgba(wd_sc(base,k*0.4),1);c.fill();
      if(R()<0.6){const dz0=z0+(z1-z0)*0.3,dz1=dz0+(z1-z0)*0.3;wd_quad(c,side,0,0.17,dz0,dz1);c.fillStyle="rgb(30,24,20)";c.fill();}
      wd_quad(c,side,0,0.04,z0,z1);c.fillStyle="rgba(10,14,16,0.35)";c.fill();}}
  // the windows' frames and shutters, dark; the light in them is drawn live
  for(const w of WD_SWIN){wd_quad(c,w.side,w.h-0.012,w.h+w.hh+0.012,w.z-0.012*w.z,w.z+w.wz+0.012*w.z);c.fillStyle=rgba(wd_sc([88,90,86],k),1);c.fill();
    wd_quad(c,w.side,w.h,w.h+w.hh,w.z,w.z+w.wz);c.fillStyle="rgb(16,20,24)";c.fill();
    wd_quad(c,w.side,w.h-0.004,w.h+w.hh+0.004,w.z+w.wz+0.002*w.z,w.z+w.wz*1.45);c.fillStyle=rgba(wd_sc([52,60,56],k),1);c.fill();}
  // the paving, polished by feet, catching the sky's light down its middle
  const f0=wd_st(-1,0,0.7),f1=wd_st(-1,0,4),f2=wd_st(1,0,4),f3=wd_st(1,0,0.7);c.beginPath();c.moveTo(f0[0],f0[1]);c.lineTo(f1[0],f1[1]);c.lineTo(f2[0],f2[1]);c.lineTo(f3[0],f3[1]);c.closePath();
  let g=c.createLinearGradient(0,f1[1],0,H);g.addColorStop(0,rgba(wd_sc([86,88,84],k),1));g.addColorStop(1,rgba(wd_sc([44,50,52],k),1));c.fillStyle=g;c.fill();
  c.save();c.clip();c.strokeStyle="rgba(10,14,16,0.35)";c.lineWidth=1.4;for(let z=0.7;z<4;z*=1.09){const a=wd_st(-1,0,z),b=wd_st(1,0,z);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  for(let i=-6;i<=6;i++){const a=wd_st(0,0,0.7,i*120),b=wd_st(0,0,4,i*120);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  c.globalCompositeOperation="lighter";const sh=c.createLinearGradient(700,0,1220,0);sh.addColorStop(0,"rgba(150,200,205,0)");sh.addColorStop(0.5,"rgba(150,200,205,0.08)");sh.addColorStop(1,"rgba(150,200,205,0)");c.fillStyle=sh;c.fillRect(0,600,W,480);c.restore();
  // the rector's palace across the far end of the street: an arcade of five round arches on columns, a row of paired
  // windows over it, a cornice and the roof
  const pl=[wd_st(-1,0,4)[0],wd_st(-1,0,4)[1]],pr=[wd_st(1,0,4)[0],0],pt=wd_st(-1,1.02,4)[1],ar=wd_st(-1,0.36,4)[1],pw=pr[0]-pl[0];
  g=c.createLinearGradient(0,pt,0,pl[1]);g.addColorStop(0,rgba(wd_sc([140,134,120],k*0.8),1));g.addColorStop(1,rgba(wd_sc([110,104,94],k*0.8),1));c.fillStyle=g;c.fillRect(pl[0],pt,pw,pl[1]-pt);
  c.fillStyle=rgba(wd_sc([96,66,56],k*0.8),1);c.fillRect(pl[0]-10,pt-16,pw+20,18);c.fillStyle=rgba(WD.ice,0.14);c.fillRect(pl[0]-10,pt-16,pw+20,1.2);
  c.fillStyle=rgba(wd_sc([120,114,102],k*0.75),1);c.fillRect(pl[0],ar-12,pw,10);
  for(let i=0;i<5;i++){const aw=pw/5,ax=pl[0]+i*aw+aw*0.14,w=aw*0.72;c.fillStyle="rgb(24,22,20)";c.beginPath();wd_archPath(c,ax,pl[1],w,pl[1]-ar);c.fill();}
  for(let i=0;i<=5;i++){const cx=pl[0]+i*pw/5;c.fillStyle=rgba(wd_sc([158,152,138],k*0.8),1);c.fillRect(cx-5,ar,10,pl[1]-ar);c.fillRect(cx-8,ar,16,6);}
  for(let i=0;i<5;i++){const wx=pl[0]+pw*(i+0.5)/5;for(const dx of [-11,4]){c.fillStyle="rgb(20,22,26)";c.beginPath();wd_archPath(c,wx+dx,pt+70,9,34);c.fill();}}
  c.fillStyle="rgba(0,0,0,0.3)";c.fillRect(pl[0],pl[1]-3,pw,4);}
AG_PLACES.wdStreet=c=>wd_paintStreet(c,"dusk");
AG_PLACES.wdStreetNight=c=>wd_paintStreet(c,"night");
AG_ROOMS.wdStreetNight="wdStreet";
// the street's windows, lit by lit(i, w) (0 dark to 1 lit), each with its glow
function wd_streetWindows(ctx,lit){ctx.save();WD_SWIN.forEach((w,i)=>{const a=lit(i,w);if(a<=0)return;wd_quad(ctx,w.side,w.h,w.h+w.hh,w.z,w.z+w.wz);ctx.fillStyle=rgba(mix([30,28,26],mix(WD.warm,[230,160,90],0.3),a*0.92),1);ctx.fill();
  const m=wd_st(w.side,w.h+w.hh/2,w.z+w.wz/2);ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,m[0],m[1],110/w.z,WD.warm,0.12*a);ctx.restore();});ctx.restore();}
// the palace's arcade lit from within (a), its door in the middle arch (open 1, shut 0), and one window lit over it (w)
function wd_palace(ctx,a,open,w){const pl=[wd_st(-1,0,4)[0],wd_st(-1,0,4)[1]],pr=[wd_st(1,0,4)[0],0],pt=wd_st(-1,1.02,4)[1],ar=wd_st(-1,0.36,4)[1],pw=pr[0]-pl[0];
  for(let i=0;i<5;i++){const aw=pw/5,ax=pl[0]+i*aw+aw*0.14,wd=aw*0.72;ctx.save();ctx.beginPath();wd_archPath(ctx,ax,pl[1],wd,pl[1]-ar);ctx.clip();
    if(a>0){const g=ctx.createLinearGradient(0,ar,0,pl[1]);g.addColorStop(0,rgba(mix([24,22,20],[110,82,56],a),1));g.addColorStop(1,rgba(mix([24,22,20],[150,112,74],a),1));ctx.fillStyle=g;ctx.fillRect(ax,ar,wd,pl[1]-ar);}
    if(i===2){const dw=wd*0.62,dx=ax+wd*0.19,dh=(pl[1]-ar)*0.66,u=clamp(open,0,1);ctx.fillStyle="rgb(20,16,14)";ctx.fillRect(dx,pl[1]-dh,dw,dh);
      if(u<0.999){ctx.fillStyle="rgb(58,42,30)";ctx.fillRect(dx,pl[1]-dh,dw/2*(1-u),dh);ctx.fillRect(dx+dw-dw/2*(1-u),pl[1]-dh,dw/2*(1-u),dh);ctx.fillStyle="rgba(0,0,0,0.4)";ctx.fillRect(dx+dw/2*(1-u)-1,pl[1]-dh,2,dh);}}
    ctx.restore();}
  if(w>0){const wx=pl[0]+pw*2.5/5;for(const dx of [-11,4]){ctx.fillStyle=rgba(mix([20,22,26],WD.warm,w),1);ctx.beginPath();wd_archPath(ctx,wx+dx,pt+70,9,34);ctx.fill();}
    ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,wx,pt+54,70,WD.warm,0.24*w);ctx.restore();}}

/* ---------------------------------------------------------------- the Great Council's hall
   A long vaulted hall at evening: stone walls, the vault's ribs going back, two tall windows at the far end with the evening's cool
   light, the nobles of the council on benches along both walls as dark shapes against it (no faces at this distance), and a table
   here, where the law is written (wd_parchment, drawn live, with its candle). */
function wd_seated(c,x,y,s,flip,col){c.save();c.translate(x,y);c.scale(flip?-s:s,s);const cc=col||[34,38,44];
  c.fillStyle=rgba(cc,1);c.beginPath();c.moveTo(-12,0);c.bezierCurveTo(-14,-20,-12,-40,-9,-52);c.bezierCurveTo(-6,-60,6,-60,9,-52);c.bezierCurveTo(12,-40,16,-20,20,0);c.closePath();c.fill();
  c.beginPath();c.ellipse(1,-63,6.4,7.6,0,0,TAU);c.fill();c.beginPath();c.ellipse(1,-70,7.4,3.6,0,0,TAU);c.fill();
  c.strokeStyle="rgba(150,200,210,0.22)";c.lineWidth=1.2;c.beginPath();c.moveTo(-9,-52);c.bezierCurveTo(-12,-40,-14,-20,-12,0);c.stroke();c.beginPath();c.arc(1,-63,7,2.4,4.2);c.stroke();c.restore();}
function wd_paintCouncil(c){const R=ag_rnd(1377),vx=960,vy=430;
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(10,18,22)");g.addColorStop(1,"rgb(16,24,26)");c.fillStyle=g;c.fillRect(0,0,W,H);
  for(const side of [-1,1]){c.fillStyle=side<0?"rgb(26,34,38)":"rgb(22,30,34)";c.beginPath();c.moveTo(vx+side*960,0);c.lineTo(vx+side*260,250);c.lineTo(vx+side*260,650);c.lineTo(vx+side*960,H);c.closePath();c.fill();}
  c.fillStyle="rgb(18,26,30)";c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(vx+260,250);c.lineTo(vx-260,250);c.closePath();c.fill();
  // the vault: ribs from the walls up over the hall, going back (the far wall is drawn over their far ends)
  for(let i=0;i<7;i++){const z=1+i*0.55,hw=960/z,top=430-520/z,wy=430+40/z;c.strokeStyle=rgba([90,120,126],0.3-i*0.03);c.lineWidth=Math.max(1.5,10/z);
    c.beginPath();c.moveTo(vx-hw,wy);c.bezierCurveTo(vx-hw,top-120/z,vx+hw,top-120/z,vx+hw,wy);c.stroke();}
  // the far wall and its two windows, the evening light through them
  g=c.createLinearGradient(0,250,0,650);g.addColorStop(0,"rgb(24,32,36)");g.addColorStop(1,"rgb(36,46,50)");c.fillStyle=g;c.fillRect(700,250,520,400);
  for(const wx of [800,1060]){c.fillStyle="rgb(70,104,118)";c.beginPath();wd_archPath(c,wx,560,62,250);c.fill();
    c.save();c.beginPath();wd_archPath(c,wx,560,62,250);c.clip();const wg=c.createLinearGradient(0,310,0,560);wg.addColorStop(0,"rgb(120,160,170)");wg.addColorStop(1,"rgb(60,90,104)");c.fillStyle=wg;c.fillRect(wx,300,62,260);
      c.strokeStyle="rgba(20,30,34,0.8)";c.lineWidth=3;c.beginPath();c.moveTo(wx+31,300);c.lineTo(wx+31,560);c.moveTo(wx,440);c.lineTo(wx+62,440);c.stroke();c.restore();}
  c.save();c.globalCompositeOperation="lighter";wd_glow(c,960,430,520,[110,160,175],0.12);
  // the light falling from the windows across the floor
  for(const wx of [831,1091]){c.fillStyle="rgba(120,170,185,0.05)";c.beginPath();c.moveTo(wx-28,560);c.lineTo(wx+28,560);c.lineTo(wx+180,1080);c.lineTo(wx-120,1080);c.closePath();c.fill();}c.restore();
  // the side walls and the vault: ribs from the walls up over the hall, going back
  // the floor
  g=c.createLinearGradient(0,650,0,H);g.addColorStop(0,"rgb(34,40,40)");g.addColorStop(1,"rgb(20,24,26)");c.fillStyle=g;c.beginPath();c.moveTo(vx-260,650);c.lineTo(vx+260,650);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  // the benches along both walls, and the council on them, far ones smaller
  for(const side of [-1,1])for(let i=6;i>=0;i--){const z=1.25+i*0.42,x=vx+side*(820/z),y=430+560/z,s=2.3/z;
    c.fillStyle="rgb(40,32,26)";c.fillRect(Math.min(x,x+side*-60*s)-20*s,y-6*s,120*s,10*s);
    for(let j=0;j<2;j++)wd_seated(c,x+side*(-30-j*40)*s,y,s,side>0,mix([30,34,40],[44,40,46],R()));}
  // the table here, at the foot of the frame
  c.fillStyle="rgb(46,36,28)";c.beginPath();c.moveTo(380,880);c.lineTo(1540,880);c.lineTo(1660,H);c.lineTo(260,H);c.closePath();c.fill();
  c.fillStyle="rgba(200,230,230,0.12)";c.fillRect(380,880,1160,2);}
AG_PLACES.wdCouncil=c=>wd_paintCouncil(c);
// the table where the law is written, from just above: dark oak boards, warm in a candle's light (the parchment and the candle are
// drawn live, wd_parchment)
function wd_paintTable(c){const R=ag_rnd(27);let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(34,24,18)");g.addColorStop(1,"rgb(22,16,12)");c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let y=-40;y<H;y+=118){const k=0.85+R()*0.3;c.fillStyle=rgba(wd_sc([58,40,28],k),1);c.fillRect(0,y+2,W,114);
    c.strokeStyle="rgba(20,12,8,0.35)";c.lineWidth=1.2;for(let i=0;i<9;i++){const yy=y+10+R()*96,ph=R()*6;c.beginPath();c.moveTo(0,yy);for(let x=0;x<=W;x+=60)c.lineTo(x,yy+Math.sin(x*0.004+ph)*4+R()*1.5);c.stroke();}
    c.fillStyle="rgba(8,5,3,0.7)";c.fillRect(0,y,W,3);c.fillStyle="rgba(255,220,180,0.05)";c.fillRect(0,y+3,W,1.2);}
  c.save();c.globalCompositeOperation="lighter";wd_glow(c,1450,250,900,[255,190,120],0.15);wd_glow(c,1000,480,760,[255,190,120],0.06);c.restore();
  const v=c.createRadialGradient(1000,480,300,960,540,1200);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.62)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.wdTable=c=>wd_paintTable(c);
// the law on its parchment, on the table: a few lines of writing as texture (no words to read), the seal pressed at p (0 to 1), and
// a candle; at (x, y) its top left, w wide
function wd_parchment(ctx,x,y,w,a,seal,t){if(a<=0)return;const h=w*0.62;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=18;ctx.fillStyle="rgb(196,182,150)";ctx.beginPath();ctx.moveTo(x,y+6);ctx.lineTo(x+w,y);ctx.lineTo(x+w+6,y+h);ctx.lineTo(x+4,y+h+6);ctx.closePath();ctx.fill();ctx.restore();
  ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,x+w+90,y+20,260,WD.lamp,0.16);ctx.restore();
  const R=ag_rnd(77);ctx.strokeStyle="rgba(70,52,36,0.55)";ctx.lineWidth=2.2;ctx.lineCap="round";for(let i=0;i<9;i++){const ly=y+30+i*(h-80)/8;let lx=x+30;ctx.beginPath();while(lx<x+w-40){const sw=10+R()*34;ctx.moveTo(lx,ly);ctx.lineTo(lx+sw,ly+(R()-0.5)*1.5);lx+=sw+6+R()*6;}ctx.stroke();}
  if(seal>0){const sx=x+w*0.78,sy=y+h-34,k=ag_spr(seal,0,0.4);ctx.save();ctx.translate(sx,sy);ctx.scale(lerp(1.4,1,clamp(k,0,1)),lerp(1.4,1,clamp(k,0,1)));ctx.fillStyle="rgb(150,46,40)";ctx.beginPath();
    for(let i=0;i<14;i++){const an=i/14*TAU,r=24+(i%2)*3;ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(90,20,18,0.8)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,14,0,TAU);ctx.stroke();ctx.restore();}
  // the candle
  const cx=x+w+90,cy=y+40,f=1+0.06*Math.sin((t||0)*8.1);ctx.fillStyle="rgb(214,204,180)";ctx.fillRect(cx-9,cy,18,70);ctx.fillStyle="rgb(255,236,190)";ctx.beginPath();ctx.ellipse(cx,cy-10,5,12*f,0,0,TAU);ctx.fill();
  ctx.restore();}

/* ---------------------------------------------------------------- the coast, as a frosted map
   The coast south-east of the city, drawn in light on dark frosted glass: the land above, the open sea below, the city on the coast to
   the left, the town of Cavtat on its small headland to the right, and the islet of Mrkan off it. Their names, the ship, the lines and
   the moon are drawn live. WD_MAP holds where each is. */
const WD_MAP={city:[430,402],cavtat:[1424,612],mrkan:[1290,744],sea:[760,830],gate:[452,388]};
function wd_paintCoast(c){const R=ag_rnd(1377);let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(8,22,28)");g.addColorStop(1,"rgb(4,14,19)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the sea's faint swell lines, and a fine grid, as on a chart
  c.strokeStyle="rgba(120,200,210,0.05)";c.lineWidth=1;for(let x=0;x<W;x+=120){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<H;y+=120){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the land: the coast from the north-west to the south-east, with the city's small headland and Cavtat's
  const land=cc=>{cc.beginPath();cc.moveTo(0,0);cc.lineTo(W,0);cc.lineTo(W,560);cc.bezierCurveTo(1820,560,1700,590,1600,600);cc.bezierCurveTo(1540,604,1500,640,1470,650);
    cc.bezierCurveTo(1430,664,1380,660,1384,630);cc.bezierCurveTo(1390,600,1420,590,1430,560);cc.bezierCurveTo(1440,520,1360,500,1250,500);cc.bezierCurveTo(1080,500,900,470,760,450);
    cc.bezierCurveTo(640,432,560,450,500,440);cc.bezierCurveTo(450,434,410,440,396,420);cc.bezierCurveTo(384,400,420,380,400,360);cc.bezierCurveTo(360,330,200,330,0,300);cc.closePath();};
  land(c);g=c.createLinearGradient(0,0,0,660);g.addColorStop(0,"rgb(22,40,46)");g.addColorStop(1,"rgb(30,52,58)");c.fillStyle=g;c.fill();
  c.save();land(c);c.clip();for(let i=0;i<16;i++){c.strokeStyle=rgba([120,200,210],0.035);c.lineWidth=1.2;c.beginPath();c.moveTo(0,250-i*18);c.bezierCurveTo(600,420-i*22,1200,470-i*22,W,520-i*24);c.stroke();}c.restore();
  // the islet of Mrkan, low, off Cavtat
  const islet=cc=>{cc.beginPath();cc.moveTo(1246,742);cc.bezierCurveTo(1256,724,1300,722,1322,734);cc.bezierCurveTo(1340,744,1322,760,1290,762);cc.bezierCurveTo(1262,762,1240,756,1246,742);cc.closePath();};
  islet(c);c.fillStyle="rgb(30,52,58)";c.fill();
  // the coastline in light, ice, as a frosted pane's edge catches it
  c.save();c.strokeStyle=rgba(WD.ice,0.75);c.lineWidth=2.4;c.shadowColor=rgba(WD.ice,0.6);c.shadowBlur=10;land(c);c.stroke();islet(c);c.stroke();c.restore();
  // contour lines inland, following the coast, fainter as they climb
  c.save();land(c);c.clip();for(let i=1;i<6;i++){c.save();c.translate(0,-i*34);c.strokeStyle=rgba(WD.ice,0.10-i*0.014);c.lineWidth=1.2;land(c);c.stroke();c.restore();}c.restore();
  // swell lines in the sea along the coast
  c.save();c.globalAlpha=0.5;for(let i=1;i<4;i++){c.save();c.translate(0,i*26);c.strokeStyle=rgba(WD.ice,0.07-i*0.015);c.lineWidth=1;land(c);c.stroke();c.restore();}c.restore();
  // the city: its ring of walls and towers on its headland, small; Cavtat: a few houses on theirs
  c.save();c.strokeStyle=rgba(WD.ice,0.9);c.fillStyle=rgba([40,64,70],1);c.lineWidth=2.2;c.beginPath();c.moveTo(404,414);c.lineTo(404,386);c.lineTo(436,378);c.lineTo(462,388);c.lineTo(462,416);c.closePath();c.fill();c.stroke();
  for(const [x,y] of [[404,386],[436,378],[462,388],[462,416],[404,414]]){c.fillStyle=rgba(WD.ice,0.9);c.fillRect(x-4,y-4,8,8);}c.restore();
  for(const [x,y] of [[1404,604],[1418,598],[1428,610],[1412,616],[1440,600]]){c.fillStyle=rgba(WD.ice,0.7);c.fillRect(x-4,y-4,8,7);}}
AG_PLACES.wdCoast=c=>wd_paintCoast(c);
