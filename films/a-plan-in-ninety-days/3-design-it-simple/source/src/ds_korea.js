/* ===== Design it simple: Korea, the 1440s =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms
   are (prefix ds_, DS_). Nothing here is a likeness of a real person or a copy of a painting: the palace, the yard, the study and the
   clothes are drawn plainly from what is known of the time (a hall on a stone platform under a grey tiled roof with gently curved
   eaves, its columns a dark red-brown; a king in a red, round-collared robe with a plain gold roundel and a black cap whose back rises
   in a second crown; an official in a round-collared robe and a black cap with oval wings; a clerk in a plain robe and cap; a farmer in
   white hemp, his hair in a topknot under a dark headband), in this film's own style, with no pattern or ornament borrowed from the
   place. The letters are drawn as letters, stroke by stroke, in a plain even line, never in a brush's or any other borrowed style.
   Chinese characters are shown as small grey signs, one for each word, never as made-up characters.
     dsSky         the morning sky over the palace; ds_palace draws the mountains, the hall and its court over it, so the sun
                   (ds_sun) can rise behind the roof
     dsYard        a yard of packed earth before an office under its eave: the farmer, and the court
     dsStudy       a study: a plaster wall framed in timber, in the light of a lattice window on the right: the king, the scholar
     dsDesk        a sheet of paper on a timber desk, seen from above: the letters draw themselves on it
     ds_signs      a page of signs in columns, one for each word; one can turn amber (the wrong one)
     ds_letter     one letter, drawn stroke by stroke from DS_LET (ds_letterBox in a box of any shape); ds_block a syllable
     ds_mouth      a head in profile, cut through: the tongue, the teeth, the lips and the throat
     ds_book       the book of 1446, closed
     ds_dots       100 dots in a square, the first n lit green
     ds_desk       a low writing desk with a solid front, for the king and the clerk; returns where to cut a person behind it
     DS_PEOPLE     the king, the scholar, a clerk and a farmer: dressed for their time, never likenesses
   Colour keeps the module's meaning: the king's design in blue, what got better in green, harm and the objection in amber; the
   places and the people wear none of the five. */

const DS_K={sky0:[196,208,216],sky1:[246,234,210],far:[176,184,184],farDk:[150,160,162],near:[128,138,134],nearDk:[100,110,106],
  tile:[92,96,104],tileDk:[58,60,68],tileHi:[156,160,166],col:[120,60,50],colHi:[164,94,76],plaster:[236,228,212],plasterDk:[202,190,170],
  stone:[204,196,182],stoneDk:[162,152,138],court:[216,208,192],courtDk:[186,176,160],timber:[150,112,78],timberDk:[100,74,50],
  earth:[198,178,144],earthDk:[160,140,108],paper:[247,241,228],paperDk:[226,216,196],ink:[40,34,32],sign:[112,104,98],wood:[136,98,66],woodDk:[96,68,44]};

/* ---------------------------------------------------------------- the palace, in the morning */
AG_PLACES.dsSky=c=>{let g=c.createLinearGradient(0,0,0,800);g.addColorStop(0,rgba(DS_K.sky0,1));g.addColorStop(1,rgba(DS_K.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the morning's haze, low on the right where the sun comes up
  g=c.createRadialGradient(1560,560,30,1560,560,1100);g.addColorStop(0,"rgba(255,236,206,0.55)");g.addColorStop(1,"rgba(255,236,206,0)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// a ridge of mountains: a soft, wandering line from left to right, filled down to the ground, lit a little from the right
function ds_ridge(c,R,top,amp,col,dk,seed){const pts=[];for(let x=-40;x<=W+40;x+=40){const u=x/W;pts.push([x,top-amp*(0.55*Math.sin(u*3.1+seed)+0.3*Math.sin(u*7.3+seed*2)+0.15*Math.sin(u*13+seed*3))]);}
  c.beginPath();c.moveTo(-40,800);for(const p of pts)c.lineTo(p[0],p[1]);c.lineTo(W+40,800);c.closePath();
  const g=c.createLinearGradient(0,top-amp,W,top);g.addColorStop(0,rgba(dk,1));g.addColorStop(1,rgba(col,1));c.fillStyle=g;c.fill();}
// the hall stands right of the middle, so the words of the opening have the sky and the mountains on the left
const DS_HALL={x0:760,x1:1580,eave:470,ridge:270,plat:690,ground:772,cols:[818,970,1094,1246,1370,1522],cx:1170};
function ds_palacePaint(c){const R=ag_rnd(1443),Hh=DS_HALL;
  ds_ridge(c,R,520,120,DS_K.far,DS_K.farDk,0.4);ds_ridge(c,R,640,70,DS_K.near,DS_K.nearDk,2.2);
  // the court: pale paving to the front, its joints running towards us
  let g=c.createLinearGradient(0,Hh.ground-60,0,H);g.addColorStop(0,rgba(DS_K.court,1));g.addColorStop(1,rgba(DS_K.courtDk,1));c.fillStyle=g;c.fillRect(0,Hh.ground-60,W,H);
  c.strokeStyle=rgba(DS_K.courtDk,0.55);c.lineWidth=2;for(let k=-12;k<=12;k++){c.beginPath();c.moveTo(Hh.cx+k*60,Hh.ground-60);c.lineTo(Hh.cx+k*190,H);c.stroke();}
  for(const y of [800,840,890,950,1020]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the stone platform, its steps in the middle
  g=c.createLinearGradient(0,Hh.plat,0,Hh.ground);g.addColorStop(0,rgba(DS_K.stone,1));g.addColorStop(1,rgba(DS_K.stoneDk,1));c.fillStyle=g;c.fillRect(Hh.x0-70,Hh.plat,Hh.x1-Hh.x0+140,Hh.ground-Hh.plat);
  c.fillStyle=rgba(ag_lt(DS_K.stone,0.35),1);c.fillRect(Hh.x0-70,Hh.plat-8,Hh.x1-Hh.x0+140,10);
  for(let i=0;i<4;i++){const y=Hh.plat+i*21,w=260+i*30;c.fillStyle=rgba(mix(DS_K.stone,DS_K.stoneDk,i*0.18),1);c.fillRect(Hh.cx-w/2,y,w,21);c.fillStyle=rgba(ag_lt(DS_K.stone,0.3),0.8);c.fillRect(Hh.cx-w/2,y,w,3);}
  // the wall between the columns: paper-covered doors in a plain timber grid, in the eave's shade
  g=c.createLinearGradient(0,Hh.eave,0,Hh.plat);g.addColorStop(0,rgba(ag_dk(DS_K.plaster,0.3),1));g.addColorStop(1,rgba(DS_K.plasterDk,1));c.fillStyle=g;c.fillRect(Hh.x0,Hh.eave,Hh.x1-Hh.x0,Hh.plat-Hh.eave);
  c.strokeStyle=rgba(DS_K.timberDk,0.75);c.lineWidth=3;for(let i=0;i<Hh.cols.length-1;i++){const a=Hh.cols[i]+22,b=Hh.cols[i+1]-22;
    for(let k=1;k<4;k++){const x=lerp(a,b,k/4);c.beginPath();c.moveTo(x,Hh.eave+60);c.lineTo(x,Hh.plat-10);c.stroke();}
    for(let y=Hh.eave+60;y<Hh.plat-10;y+=34){c.beginPath();c.moveTo(a,y);c.lineTo(b,y);c.stroke();}
    c.strokeRect(a,Hh.eave+60,b-a,Hh.plat-Hh.eave-70);}
  // the columns, dark red-brown, lit on the right
  for(const x of Hh.cols){g=c.createLinearGradient(x-20,0,x+20,0);g.addColorStop(0,rgba(ag_dk(DS_K.col,0.25),1));g.addColorStop(0.7,rgba(DS_K.colHi,1));g.addColorStop(1,rgba(DS_K.col,1));
    c.fillStyle=g;c.fillRect(x-20,Hh.eave,40,Hh.plat-Hh.eave);c.fillStyle=rgba(DS_K.stoneDk,1);c.fillRect(x-28,Hh.plat-14,56,14);}
  // the eave's deep shade, and the brackets under it: plain timber blocks
  g=c.createLinearGradient(0,Hh.eave-6,0,Hh.eave+70);g.addColorStop(0,"rgba(30,26,28,0.62)");g.addColorStop(1,"rgba(30,26,28,0)");c.fillStyle=g;c.fillRect(Hh.x0,Hh.eave-6,Hh.x1-Hh.x0,76);
  c.fillStyle=rgba(DS_K.timberDk,1);c.fillRect(Hh.x0-12,Hh.eave+2,Hh.x1-Hh.x0+24,16);
  for(let x=Hh.x0;x<=Hh.x1;x+=54){c.fillStyle=rgba(DS_K.timber,1);c.fillRect(x-12,Hh.eave+18,24,22);c.fillStyle=rgba(DS_K.timberDk,0.6);c.fillRect(x-12,Hh.eave+34,24,6);}
  // the roof: a broad hip under a short gable, its eaves sweeping up at the corners, grey tiles in rows from ridge to eave
  const L=Hh.x0-150,Rr=Hh.x1+150,e=Hh.eave,lift=44,rg=Hh.ridge,rl=Hh.x0+120,rr2=Hh.x1-120;
  const roof=cc=>{cc.moveTo(L,e-lift);cc.quadraticCurveTo(L+150,e+6,L+290,e+4);cc.lineTo(Rr-290,e+4);cc.quadraticCurveTo(Rr-150,e+6,Rr,e-lift);
    cc.quadraticCurveTo(Rr-130,e-56,rr2,rg+40);cc.lineTo(rl,rg+40);cc.quadraticCurveTo(L+130,e-56,L,e-lift);cc.closePath();};
  ag_shape(c,roof);g=c.createLinearGradient(0,rg,0,e);g.addColorStop(0,rgba(DS_K.tileDk,1));g.addColorStop(1,rgba(DS_K.tile,1));c.fillStyle=g;c.fill();
  c.save();ag_shape(c,roof);c.clip();
  // rows of tiles: fine lines running down the slope, closer at the hips
  c.strokeStyle=rgba(DS_K.tileDk,0.7);c.lineWidth=3;for(let x=L;x<=Rr;x+=17){const u=(x-L)/(Rr-L),top=rg+40+Math.abs(u-0.5)*60;c.beginPath();c.moveTo(lerp(rl,rr2,u),top);c.lineTo(x,e+10);c.stroke();}
  c.strokeStyle=rgba(DS_K.tileHi,0.35);c.lineWidth=2;for(let x=L+8;x<=Rr;x+=17){const u=(x-L)/(Rr-L),top=rg+40+Math.abs(u-0.5)*60;c.beginPath();c.moveTo(lerp(rl,rr2,u)+3,top);c.lineTo(x+3,e+10);c.stroke();}
  // the morning light on the right of the roof, the shade on the left
  g=c.createLinearGradient(L,0,Rr,0);g.addColorStop(0,"rgba(20,18,24,0.22)");g.addColorStop(0.55,"rgba(20,18,24,0)");g.addColorStop(1,"rgba(255,226,186,0.24)");c.fillStyle=g;c.fillRect(L,rg,Rr-L,e-rg+20);c.restore();
  // the eave's edge, a pale line of tile ends; the gable, the ridge along its top with its ends turned up, and the hips down to the corners
  c.strokeStyle=rgba(DS_K.tileHi,0.9);c.lineWidth=5;c.beginPath();c.moveTo(L,e-lift);c.quadraticCurveTo(L+150,e+6,L+290,e+4);c.lineTo(Rr-290,e+4);c.quadraticCurveTo(Rr-150,e+6,Rr,e-lift);c.stroke();
  c.fillStyle=rgba(ag_dk(DS_K.plaster,0.12),1);c.beginPath();c.moveTo(rl+20,rg+40);c.lineTo(rl+90,rg-10);c.lineTo(rr2-90,rg-10);c.lineTo(rr2-20,rg+40);c.closePath();c.fill();
  c.strokeStyle=rgba(DS_K.tileDk,1);c.lineCap="round";c.lineWidth=11;c.beginPath();c.moveTo(rl+24,rg+42);c.quadraticCurveTo(L+130,e-58,L+18,e-lift+2);c.moveTo(rr2-24,rg+42);c.quadraticCurveTo(Rr-130,e-58,Rr-18,e-lift+2);c.stroke();
  c.lineWidth=16;c.beginPath();c.moveTo(rl+86,rg-12);c.quadraticCurveTo(Hh.cx,rg-2,rr2-86,rg-12);c.stroke();
  c.lineWidth=13;c.beginPath();c.moveTo(rl+86,rg-12);c.lineTo(rl+70,rg-32);c.moveTo(rr2-86,rg-12);c.lineTo(rr2-70,rg-32);c.stroke();
  // the platform's soft shadow on the court
  c.fillStyle="rgba(40,34,30,0.14)";c.fillRect(Hh.x0-90,Hh.ground,Hh.x1-Hh.x0+160,10);}
function ds_palace(ctx){ctx.drawImage(ag_kept("dsPalace",W,H,ds_palacePaint),0,0,W,H);}
// the sun rising: a pale disc with its glow, at (x, y), r across; a 0 to 1
function ds_sun(ctx,x,y,r,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;let g=ctx.createRadialGradient(x,y,0,x,y,r*5);g.addColorStop(0,"rgba(255,232,190,0.85)");g.addColorStop(0.3,"rgba(255,226,180,0.35)");g.addColorStop(1,"rgba(255,226,180,0)");
  ctx.fillStyle=g;ctx.fillRect(x-r*5,y-r*5,r*10,r*10);ctx.fillStyle="rgb(255,244,222)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the yard, the study and the desk */
AG_PLACES.dsYard=c=>{const R=ag_rnd(1444);let g=c.createLinearGradient(0,0,0,700);g.addColorStop(0,rgba(DS_K.plaster,1));g.addColorStop(1,rgba(DS_K.plasterDk,1));c.fillStyle=g;c.fillRect(0,0,W,700);
  // the office's wall: plaster between timber posts, under the eave's shade
  for(const x of [140,700,1260,1820]){g=c.createLinearGradient(x-18,0,x+18,0);g.addColorStop(0,rgba(DS_K.timberDk,1));g.addColorStop(1,rgba(DS_K.timber,1));c.fillStyle=g;c.fillRect(x-18,0,36,700);}
  c.fillStyle=rgba(DS_K.timberDk,1);c.fillRect(0,236,W,18);
  g=c.createLinearGradient(0,0,0,170);g.addColorStop(0,rgba(DS_K.tileDk,1));g.addColorStop(1,rgba(DS_K.tile,1));c.fillStyle=g;c.fillRect(0,0,W,96);
  c.strokeStyle=rgba(DS_K.tileHi,0.8);c.lineWidth=5;c.beginPath();c.moveTo(0,96);c.lineTo(W,96);c.stroke();
  g=c.createLinearGradient(0,96,0,230);g.addColorStop(0,"rgba(30,26,28,0.45)");g.addColorStop(1,"rgba(30,26,28,0)");c.fillStyle=g;c.fillRect(0,96,W,134);
  // the raised timber floor of its veranda, on the right, where the clerk sits
  g=c.createLinearGradient(0,620,0,700);g.addColorStop(0,rgba(ag_lt(DS_K.timber,0.18),1));g.addColorStop(1,rgba(DS_K.timber,1));c.fillStyle=g;c.fillRect(980,620,W-980,80);
  c.fillStyle=rgba(DS_K.timberDk,1);c.fillRect(980,700,W-980,26);for(const x of [1000,1440,1880]){c.fillRect(x-14,700,28,110);}
  // the yard: packed earth, a little rough, lit from the right
  g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,rgba(DS_K.earth,1));g.addColorStop(1,rgba(DS_K.earthDk,1));c.fillStyle=g;c.fillRect(0,700,W,H-700);
  for(let k=0;k<160;k++){const x=R()*W,y=720+R()*360,r=1+R()*3;c.fillStyle=rgba(R()<0.5?DS_K.earthDk:ag_lt(DS_K.earth,0.25),0.5);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,40,0.16)");g.addColorStop(1,"rgba(255,226,186,0.12)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle="rgba(40,34,30,0.16)";c.fillRect(980,726,W-980,14);};
AG_PLACES.dsStudy=c=>{lp_paintRoom(c,{light:"morning",seed:14,base:[232,222,202]});
  // timber posts at either side, and a beam along the top: a room of the time, plain
  for(const x of [70,1850]){const g=c.createLinearGradient(x-26,0,x+26,0);g.addColorStop(0,rgba(DS_K.timberDk,1));g.addColorStop(1,rgba(DS_K.timber,1));c.fillStyle=g;c.fillRect(x-26,0,52,936);}
  const g=c.createLinearGradient(0,30,0,74);g.addColorStop(0,rgba(DS_K.timber,1));g.addColorStop(1,rgba(DS_K.timberDk,1));c.fillStyle=g;c.fillRect(0,30,W,44);
  c.fillStyle="rgba(40,30,26,0.18)";c.fillRect(0,74,W,10);};
const DS_SHEET={x:150,y:56,w:1620,h:820};
AG_PLACES.dsDesk=c=>{const R=ag_rnd(1446);let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba(DS_K.woodDk,1));g.addColorStop(1,rgba(DS_K.wood,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the desk's grain, long and soft
  for(let k=0;k<70;k++){const y=R()*H,a=0.05+R()*0.08;c.strokeStyle=rgba(R()<0.5?DS_K.woodDk:ag_lt(DS_K.wood,0.2),a);c.lineWidth=1+R()*3;c.beginPath();c.moveTo(0,y);
    c.bezierCurveTo(W*0.3,y+(R()-0.5)*30,W*0.7,y+(R()-0.5)*30,W,y+(R()-0.5)*20);c.stroke();}
  // the sheet, its shadow down and to the left, its fibres faint
  const S=DS_SHEET;c.save();c.shadowColor="rgba(30,20,14,0.4)";c.shadowBlur=30;c.shadowOffsetX=-10;c.shadowOffsetY=14;c.fillStyle=rgba(DS_K.paper,1);c.fillRect(S.x,S.y,S.w,S.h);c.restore();
  g=c.createLinearGradient(S.x,S.y,S.x+S.w,S.y+S.h);g.addColorStop(0,"rgba(120,96,70,0.08)");g.addColorStop(0.6,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(255,236,200,0.18)");c.fillStyle=g;c.fillRect(S.x,S.y,S.w,S.h);
  for(let k=0;k<260;k++){const x=S.x+R()*S.w,y=S.y+R()*S.h,l=6+R()*18,an=R()*TAU;c.strokeStyle=rgba(DS_K.paperDk,0.35);c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);c.stroke();}};

/* ---------------------------------------------------------------- signs, one for each word */
// a page of signs: columns of small grey marks read from the top, right to left as such writing was; o.n how many show (0 to 1),
// o.wrong [column, row] of the sign that turns amber, o.amb (0 to 1), o.cols, o.rows, o.size; o.a. Returns the wrong sign's centre
function ds_signs(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,cols=o.cols||8,rows=o.rows||9,sz=o.size||Math.min(w/cols,h/rows)*0.62,R=ag_rnd(o.seed||1440);
  let at=null;if(a<=0.004)return at;ctx.save();ctx.globalAlpha*=a;const n=(o.n==null?1:o.n)*cols*rows;let k=0;
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const cx=x+w-(i+0.5)*w/cols,cy=y+(j+0.5)*h/rows,v=R(),f=clamp(n-k,0,1);k++;
    const wr=o.wrong&&o.wrong[0]===i&&o.wrong[1]===j;if(wr)at=[cx,cy];if(f<=0)continue;
    // each sign a few strokes inside its square: a frame of ink, light and even, its inner strokes kept faint so no real or made-up
    // character is spelled out
    const col=wr?mix(DS_K.sign,LP.amber,o.amb||0):DS_K.sign,s=sz*(0.86+0.14*v);ctx.globalAlpha=a*f;
    ctx.fillStyle=rgba(col,wr?1:0.22);rr(ctx,cx-s/2,cy-s/2,s,s,s*0.16);ctx.fill();ctx.strokeStyle=rgba(col,wr?1:0.7);ctx.lineWidth=Math.max(2,s*0.07);rr(ctx,cx-s/2,cy-s/2,s,s,s*0.16);ctx.stroke();}
  ctx.restore();return at;}

/* ---------------------------------------------------------------- the letters
   Each letter is a list of strokes in a square from 0 to 1: a line through points, or a circle [cx, cy, r], or a dot [cx, cy, r, 1].
   They are drawn in that order, each stroke from its start, as a hand writes them; added marks a stroke drawn in another colour (the
   stroke added for a stronger sound). */
const DS_LET={
  g:[[[0.18,0.2],[0.82,0.2],[0.82,0.86]]],
  n:[[[0.2,0.14],[0.2,0.8],[0.84,0.8]]],
  m:[[[0.18,0.2],[0.18,0.82]],[[0.18,0.2],[0.82,0.2],[0.82,0.82]],[[0.18,0.82],[0.82,0.82]]],
  s:[[[0.52,0.14],[0.16,0.86]],[[0.46,0.42],[0.84,0.86]]],
  ng:[{c:[0.5,0.5,0.32]}],
  k:[[[0.18,0.2],[0.82,0.2],[0.82,0.86]],{add:1,p:[[0.22,0.52],[0.8,0.52]]}],
  d:[{add:1,p:[[0.2,0.2],[0.84,0.2]]},[[0.2,0.2],[0.2,0.8],[0.84,0.8]]],
  b:[[[0.2,0.14],[0.2,0.84]],[[0.8,0.14],[0.8,0.84]],{add:1,p:[[0.2,0.5],[0.8,0.5]]},[[0.2,0.84],[0.8,0.84]]],
  j:[{add:1,p:[[0.2,0.2],[0.8,0.2]]},[[0.5,0.2],[0.16,0.86]],[[0.47,0.46],[0.84,0.86]]],
  h:[{add:1,p:[[0.5,0.06],[0.5,0.2]]},{add:1,p:[[0.2,0.3],[0.8,0.3]]},{c:[0.5,0.64,0.24]}],
  r:[[[0.18,0.16],[0.82,0.16],[0.82,0.5],[0.18,0.5],[0.18,0.84],[0.84,0.84]]],
  dot:[{d:[0.5,0.5,0.11]}],eu:[[[0.08,0.5],[0.92,0.5]]],i:[[[0.5,0.08],[0.5,0.92]]],
  a:[[[0.42,0.08],[0.42,0.92]],[[0.42,0.5],[0.74,0.5]]],eo:[[[0.28,0.5],[0.58,0.5]],[[0.58,0.08],[0.58,0.92]]],
  o:[[[0.5,0.3],[0.5,0.6]],[[0.08,0.6],[0.92,0.6]]],u:[[[0.08,0.4],[0.92,0.4]],[[0.5,0.4],[0.5,0.7]]]};
// one letter in the box (x, y, w by h): o.p (0 to 1, how much is drawn), o.col, o.add (the colour of added strokes, or null for the same),
// o.lw (the line's width, the same whatever the box's shape), o.a. A circle in a box that isn't square is drawn as an ellipse
function ds_letterBox(ctx,key,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,L=DS_LET[key];if(a<=0.004||!L)return;const p=clamp(o.p==null?1:o.p,0,1);if(p<=0)return;
  const m=Math.min(w,h),len=st=>{if(st.c)return TAU*Math.sqrt(((st.c[2]*w)**2+(st.c[2]*h)**2)/2);if(st.d)return 0.2*m;const P=st.p||st;let l=0;for(let i=1;i<P.length;i++)l+=Math.hypot((P[i][0]-P[i-1][0])*w,(P[i][1]-P[i-1][1])*h);return l;};
  const tot=L.reduce((t,st)=>t+len(st),0);let left=p*tot;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=o.lw||m*0.1;
  for(const st of L){if(left<=0)break;const sl0=len(st),u=clamp(left/sl0,0,1);left-=sl0;const col=st.add&&o.add?o.add:(o.col||DS_K.ink);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);
    if(st.c){const [cx,cy,r]=st.c;ctx.beginPath();ctx.ellipse(x+cx*w,y+cy*h,r*w,r*h,0,-Math.PI/2,-Math.PI/2+TAU*u);ctx.stroke();continue;}
    if(st.d){const [cx,cy,r]=st.d;ctx.beginPath();ctx.arc(x+cx*w,y+cy*h,r*m*ag_sine(u),0,TAU);ctx.fill();continue;}
    const P=st.p||st;let need=u*sl0;ctx.beginPath();ctx.moveTo(x+P[0][0]*w,y+P[0][1]*h);
    for(let i=1;i<P.length&&need>0;i++){const sl=Math.hypot((P[i][0]-P[i-1][0])*w,(P[i][1]-P[i-1][1])*h),f=clamp(need/sl,0,1);need-=sl;
      ctx.lineTo(x+lerp(P[i-1][0],P[i][0],f)*w,y+lerp(P[i-1][1],P[i][1],f)*h);}ctx.stroke();}
  ctx.restore();}
// one letter in a square box (x, y, s by s); o as ds_letterBox, with o.wd the line's width as a part of s (0.1)
function ds_letter(ctx,key,x,y,s,o){o=o||{};ds_letterBox(ctx,key,x,y,s,s,Object.assign({},o,{lw:s*(o.wd||0.1)}));}
// a syllable: its letters in their places in the box (x, y, s by s), each stretched to its place with the same line; parts [[key, bx, by,
// bw, bh], ...] in the box's units; o.u [0 to 1 for each part], o.col, o.a
const DS_BLOCK={han:[["h",0.02,0.04,0.5,0.52],["a",0.5,0.0,0.48,0.6],["n",0.12,0.58,0.78,0.4]],geul:[["g",0.16,0.0,0.68,0.38],["eu",0.04,0.36,0.92,0.16],["r",0.16,0.54,0.68,0.44]]};
function ds_block(ctx,key,x,y,s,o){o=o||{};DS_BLOCK[key].forEach((pt,i)=>{const [k,bx,by,bw,bh]=pt;
  ds_letterBox(ctx,k,x+bx*s,y+by*s,bw*s,bh*s,{p:o.u?o.u[i]:1,col:o.col,a:o.a,lw:s*0.06});});}

/* ---------------------------------------------------------------- the mouth and the throat */
// a head in profile, facing right, cut through so the inside shows: the palate, the tongue, the teeth, the lips and the throat, drawn
// in a soft line. (x, y) is the top of the head, s its size (1: 640 px from the crown to the base of the neck). o.hl: which part is
// picked out ("root", "tip", "lips", "teeth", "throat"), o.a. Returns where each part is, for the letters beside it
const DS_MOUTH={root:[300,330],tip:[420,322],lips:[488,360],teeth:[452,334],throat:[262,450]};
function ds_mouth(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a,at={};for(const k in DS_MOUTH)at[k]=[x+DS_MOUTH[k][0]*s,y+DS_MOUTH[k][1]*s];if(a<=0.004)return at;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap="round";ctx.lineJoin="round";
  const skin=[238,214,196],line=[120,94,84],pink=[214,150,142],pinkDk=[178,112,108];
  // the head's outline: the skull, the brow, the nose, the lips and the chin, then the neck
  const head=c=>{c.moveTo(250,0);c.bezierCurveTo(360,-6,440,50,452,150);c.bezierCurveTo(456,190,452,212,474,232);c.lineTo(500,282);c.bezierCurveTo(504,292,498,298,488,300);
    c.bezierCurveTo(492,318,494,330,492,340);c.bezierCurveTo(502,346,506,356,500,366);c.bezierCurveTo(504,378,500,392,490,398);c.bezierCurveTo(488,420,478,446,450,460);
    c.bezierCurveTo(420,472,388,470,360,476);c.bezierCurveTo(340,520,336,580,340,640);c.lineTo(170,640);c.bezierCurveTo(180,560,170,480,120,420);c.bezierCurveTo(60,350,50,240,80,150);c.bezierCurveTo(110,60,170,4,250,0);c.closePath();};
  ag_shape(ctx,head);ctx.fillStyle=rgba(skin,1);ctx.fill();
  // the inside: the nose's passage and the mouth, a soft pink, then the throat going down
  const inside=c=>{c.moveTo(470,300);c.bezierCurveTo(430,300,380,286,330,292);c.bezierCurveTo(290,298,262,330,256,380);c.bezierCurveTo(252,440,256,540,260,640);
    c.lineTo(300,640);c.bezierCurveTo(300,560,296,480,300,430);c.bezierCurveTo(320,410,380,404,430,400);c.bezierCurveTo(460,398,480,384,488,368);c.lineTo(484,340);c.closePath();};
  ag_shape(ctx,inside);ctx.fillStyle=rgba(pink,0.55);ctx.fill();
  // the palate: hard at the front, soft behind, curving down to the throat
  ctx.strokeStyle=rgba(line,1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(452,318);ctx.bezierCurveTo(420,300,370,298,330,306);ctx.bezierCurveTo(300,312,282,330,276,356);ctx.stroke();
  // the tongue: from its tip behind the teeth, over its back and down its root into the throat
  const tongue=c=>{c.moveTo(440,346);c.bezierCurveTo(420,330,380,326,340,334);c.bezierCurveTo(306,342,290,370,292,410);c.bezierCurveTo(294,440,300,460,306,470);
    c.lineTo(340,462);c.bezierCurveTo(360,420,400,398,440,386);c.bezierCurveTo(456,380,456,358,440,346);c.closePath();};
  ag_soft(ctx,tongue,pinkDk,ag_lt(pink,0.3),380,340,90,null);
  // the teeth, upper and lower, and the lips
  ctx.fillStyle="rgb(250,248,240)";ctx.strokeStyle=rgba(line,0.8);ctx.lineWidth=3;rr(ctx,452,316,20,26,6);ctx.fill();ctx.stroke();rr(ctx,450,350,18,22,6);ctx.fill();ctx.stroke();
  ctx.fillStyle=rgba(pinkDk,1);ctx.beginPath();ctx.ellipse(486,332,12,14,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(484,368,12,14,0,0,TAU);ctx.fill();
  // the head's outline over everything, and the ear
  ag_shape(ctx,head);ctx.strokeStyle=rgba(line,1);ctx.lineWidth=5;ctx.stroke();
  ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(196,250,24,40,0.1,0,TAU);ctx.stroke();
  // the part picked out: a soft ring of the design's blue round it
  if(o.hl&&DS_MOUTH[o.hl]){const [hx,hy]=DS_MOUTH[o.hl];ctx.strokeStyle=rgba(LP.blue,0.9*(o.hlA==null?1:o.hlA));ctx.lineWidth=6;ctx.beginPath();ctx.arc(hx,hy,34,0,TAU);ctx.stroke();}
  ctx.restore();return at;}

/* ---------------------------------------------------------------- the book, the dots, a low desk */
// the book of 1446, closed, its cover bound with thread down the left: (x, y) its top left, w wide; o.a, o.k
function ds_book(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*1.42;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  ctx.save();ctx.shadowColor="rgba(40,28,20,0.4)";ctx.shadowBlur=22;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle="rgb(196,176,138)";ctx.fillRect(x,y,w,h);ctx.restore();
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.18)");g.addColorStop(1,"rgba(80,60,40,0.12)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  // the thread through its five holes, and the label down the cover, plain
  ctx.strokeStyle="rgb(110,88,64)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+w*0.08,y);ctx.lineTo(x+w*0.08,y+h);ctx.stroke();
  for(let i=0;i<5;i++){const yy=y+h*(0.1+i*0.2);ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w*0.08,yy);ctx.stroke();}
  ctx.fillStyle="rgb(240,232,214)";ctx.fillRect(x+w*0.62,y+h*0.06,w*0.24,h*0.5);ctx.strokeStyle="rgb(150,130,104)";ctx.lineWidth=2;ctx.strokeRect(x+w*0.62,y+h*0.06,w*0.24,h*0.5);
  ctx.restore();}
// 100 dots in a square of ten by ten from (x, y), gap apart; the first n lit green (n may be fractional, as they light); o.a
function ds_dots(ctx,x,y,gap,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(let k=0;k<100;k++){const i=k%10,j=(k/10)|0,f=clamp(n-k,0,1),cx=x+i*gap,cy=y+j*gap;ctx.fillStyle=rgba(mix([206,198,186],LP.green,f),1);ctx.beginPath();ctx.arc(cx,cy,gap*0.34,0,TAU);ctx.fill();}
  ctx.restore();}
// a low writing desk of dark timber, its top's front edge at (x, y), w wide, and a solid front down to the floor (o.h, 120 px) that hides
// whoever sits behind it below the top; o.paper (a sheet on it), o.a. Returns the height to cut a person behind it at: draw them first,
// cut there, then the desk
function ds_desk(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,d=40;if(a<=0)return y-d*0.6;ctx.save();ctx.globalAlpha*=a;const top=[132,96,64],h=o.h||120;
  // its shadow on the floor, down and to the left
  ctx.fillStyle="rgba(40,30,24,0.22)";ctx.beginPath();ctx.ellipse(x+w/2-14,y+h+6,w*0.54,14,0,0,TAU);ctx.fill();
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,rgba(ag_lt(top,0.18),1));g.addColorStop(1,rgba(top,1));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+d*0.5,y-d);ctx.lineTo(x+w-d*0.5,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(30,24,28,0.14)");g.addColorStop(1,"rgba(255,226,186,0.14)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+d*0.5,y-d);ctx.lineTo(x+w-d*0.5,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  // the front: a panel framed in a lighter edge, two drawers with small pulls, and short feet
  g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(top,0.36),1));g.addColorStop(1,rgba(ag_dk(top,0.18),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h-12);
  ctx.fillStyle=rgba(ag_lt(top,0.12),0.9);ctx.fillRect(x,y,w,5);ctx.strokeStyle=rgba(ag_dk(top,0.5),0.8);ctx.lineWidth=3;
  for(const k of [0,1]){const dx=x+w*(0.08+k*0.46),dw=w*0.38;ctx.strokeRect(dx,y+18,dw,h-50);ctx.fillStyle=rgba([196,170,120],1);ctx.beginPath();ctx.arc(dx+dw/2,y+18+(h-50)/2,6,0,TAU);ctx.fill();}
  ctx.fillStyle=rgba(ag_dk(top,0.42),1);ctx.fillRect(x+6,y+h-12,26,12);ctx.fillRect(x+w-32,y+h-12,26,12);
  if(o.paper){ctx.fillStyle=rgba(DS_K.paper,1);ctx.beginPath();ctx.moveTo(x+w*0.3,y-d*0.75);ctx.lineTo(x+w*0.66,y-d*0.75);ctx.lineTo(x+w*0.7,y-d*0.15);ctx.lineTo(x+w*0.27,y-d*0.15);ctx.closePath();ctx.fill();}
  ctx.restore();return y-d*0.6;}

/* ---------------------------------------------------------------- the people of the story, for lp_person
   The king in a red, round-collared robe with a plain gold roundel on the chest, and a black cap whose back rises in a second, higher
   crown; the scholar, an official, in a round-collared robe of a quiet olive and a black cap with an oval wing at each side; a clerk in
   a plain robe and a low black cap; a farmer in white hemp, his hair tied up on the crown under a dark band. The king and the scholar
   wear the thin beard of the time. No pattern, no ornament, no likeness. Their hands hold nothing; what they make or read is drawn
   beside them. Everything stays inside the head's picture (x 160 to 440, y 250 to 560). */
// the round collar's inner edge, a thin band of the white robe under it at the neck, and the robe's front edge to where it fastens
function ds_roundCollar(c,P){c.strokeStyle="rgba(240,234,222,0.92)";c.lineWidth=5;c.beginPath();c.moveTo(234,566);c.bezierCurveTo(262,598,314,608,358,598);c.stroke();
  c.strokeStyle=rgba(ag_dk(P.top.c,0.45),0.6);c.lineWidth=3;c.beginPath();c.moveTo(252,606);c.bezierCurveTo(224,630,192,652,162,666);c.stroke();
  c.strokeStyle=rgba(ag_lt(P.top.c,0.25),0.35);c.lineWidth=2;c.beginPath();c.moveTo(254,612);c.bezierCurveTo(226,636,194,658,164,672);c.stroke();}
// the king's robe: the round collar, and one plain gold roundel on the chest
function ds_kingRobe(c,P){ds_roundCollar(c,P);const gold=[204,174,112];
  ag_soft(c,cc=>cc.arc(300,738,58,0,TAU),gold,ag_lt(gold,0.4),320,716,70,null);
  c.strokeStyle=rgba(ag_dk(gold,0.3),0.9);c.lineWidth=4;c.beginPath();c.arc(300,738,58,0,TAU);c.stroke();c.lineWidth=2;c.beginPath();c.arc(300,738,44,0,TAU);c.stroke();}
// a thin beard of the time: a moustache from under the nose, drooping at its ends, and one short tuft under the lower lip and off the
// chin, drawn whole in one shape
function ds_beard(col){return(c,P)=>{const hi=mix(col,[200,200,206],0.35);
  const mo=cc=>{cc.moveTo(368,468);cc.bezierCurveTo(360,470,350,474,342,484);cc.bezierCurveTo(352,480,362,478,370,476);cc.bezierCurveTo(378,478,386,480,392,484);cc.bezierCurveTo(388,474,378,468,368,468);cc.closePath();};
  c.save();ag_shape(c,AG_F.head);c.clip();ag_soft(c,mo,col,hi,372,470,30,null);c.restore();
  const tu=cc=>{cc.moveTo(354,500);cc.bezierCurveTo(350,514,350,530,356,542);cc.quadraticCurveTo(360,548,364,542);cc.bezierCurveTo(370,532,376,518,380,504);cc.bezierCurveTo(372,498,362,497,354,500);cc.closePath();};
  ag_soft(c,tu,col,hi,368,506,40,null);};}
const DS_CAP=[42,38,44],DS_CAPHI=[104,100,110];
// a low black cap, close over the head down to the brow, its back rising in a rounded crown (a clerk's, and under an official's wings)
function ds_cap(c,P){const cap=cc=>{cc.moveTo(210,384);cc.bezierCurveTo(200,334,212,296,238,276);cc.bezierCurveTo(258,262,300,258,322,270);cc.bezierCurveTo(340,282,346,298,348,314);
    cc.bezierCurveTo(372,318,390,336,392,364);cc.bezierCurveTo(358,354,318,352,288,356);cc.bezierCurveTo(254,360,228,372,210,384);cc.closePath();};
  ag_soft(c,cap,DS_CAP,DS_CAPHI,324,282,120,"rgba(0,0,0,0.5)",12);
  c.strokeStyle="rgba(150,146,156,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(244,288);c.quadraticCurveTo(282,268,318,278);c.stroke();
  c.strokeStyle="rgba(18,16,18,0.8)";c.lineWidth=5;c.beginPath();c.moveTo(212,380);c.bezierCurveTo(250,364,320,352,390,362);c.stroke();}
// an official's cap: the low cap, with a stiff oval wing at each side of its back crown, the far one close behind it
function ds_officialCap(c,P){const k=[30,28,32];ag_soft(c,cc=>cc.ellipse(366,292,30,12,-0.1,0,TAU),k,DS_CAPHI,366,286,30,null);ds_cap(c,P);
  ag_soft(c,cc=>cc.ellipse(192,318,30,12,0.1,0,TAU),k,DS_CAPHI,194,312,30,"rgba(0,0,0,0.4)",6);}
// the king's cap: low at the brow, its back rising in a second, higher crown
function ds_kingCap(c,P){const cap=cc=>{cc.moveTo(210,384);cc.bezierCurveTo(198,330,206,282,226,264);cc.bezierCurveTo(244,250,282,250,298,262);cc.bezierCurveTo(306,270,310,282,312,292);
    cc.bezierCurveTo(340,294,352,306,356,320);cc.bezierCurveTo(376,326,390,342,392,364);cc.bezierCurveTo(358,354,318,352,288,356);cc.bezierCurveTo(254,360,228,372,210,384);cc.closePath();};
  ag_soft(c,cap,DS_CAP,DS_CAPHI,300,272,120,"rgba(0,0,0,0.5)",12);
  c.strokeStyle="rgba(150,146,156,0.4)";c.lineWidth=2;c.beginPath();c.moveTo(232,272);c.quadraticCurveTo(262,254,292,266);c.stroke();
  c.strokeStyle="rgba(18,16,18,0.7)";c.lineWidth=3;c.beginPath();c.moveTo(214,306);c.bezierCurveTo(250,296,290,292,312,294);c.stroke();
  c.strokeStyle="rgba(18,16,18,0.8)";c.lineWidth=5;c.beginPath();c.moveTo(212,380);c.bezierCurveTo(250,364,320,352,390,362);c.stroke();}
// a farmer's hair: tied up in a knot on the crown, with a pin through it, held by a dark band round the head at the brow
function ds_topknot(c,P){ag_soft(c,cc=>cc.ellipse(292,284,22,19,-0.1,0,TAU),[34,30,30],[110,104,104],300,276,26,"rgba(0,0,0,0.4)",6);
  c.strokeStyle="rgba(200,190,170,0.9)";c.lineWidth=3;c.beginPath();c.moveTo(270,288);c.lineTo(314,278);c.stroke();
  const band=cc=>{cc.moveTo(214,370);cc.bezierCurveTo(250,350,320,336,388,346);cc.lineTo(390,362);cc.bezierCurveTo(322,354,252,366,218,388);cc.closePath();};
  ag_soft(c,band,[30,28,30],[92,88,92],330,350,60,null);}
const ds_both=(...f)=>(c,P)=>f.forEach(g=>g(c,P));
const DS_PEOPLE={
  king:{name:"King Sejong",key:"ds-king",skin:[222,184,150],hair:{style:"cropped",c:[28,26,28]},top:{kind:"tunic",c:[156,46,48],paint:ds_kingRobe},hat:{paint:ds_both(ds_beard([40,36,36]),ds_kingCap)},breath:0.24},
  scholar:{name:"Choe Manri",key:"ds-scholar",skin:[214,176,142],hair:{style:"cropped",c:[60,56,56]},top:{kind:"tunic",c:[108,96,76],paint:ds_roundCollar},hat:{paint:ds_both(ds_beard([110,104,100]),ds_officialCap)},breath:0.26},
  clerk:{name:"A clerk",key:"ds-clerk",skin:[226,190,156],hair:{style:"cropped",c:[30,28,30]},top:{kind:"robe",c:[170,160,142]},hat:{paint:ds_cap},breath:0.29},
  farmer:{name:"A farmer",key:"ds-farmer",skin:[200,158,122],hair:{style:"cropped",c:[30,28,28]},top:{kind:"robe",c:[230,224,206]},hat:{paint:ds_topknot},breath:0.3}
};
