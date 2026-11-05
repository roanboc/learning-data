/* ===== Borrowed rights: the opening's own pieces =====
   Britain before 1840, drawn in the module's matte style (prefix br_), lit from the right as the lab is:
     BR_OLD       the colours of the time: laid paper, iron-gall ink, red sealing wax, mahogany, a stone-coloured paint, the post
                  office's red ink
     places       "brDesk" (a member's writing table, close up: mahogany, a leather top, the inkstand and its quill, the wax),
                  "brStudy" (his study: painted panels, a sash window, a writing table in front) and "brOffice" (the letter office:
                  its pigeonholes, an arched window, the counter), each painted once
     br_script    a line of handwriting: a pen moving on, its loops rising for the tall letters and falling for the low ones,
                  thick going down and thin going up; drawn once into a kept picture, and written on from left to right
     br_cover     a letter's cover, its back (the flaps and the wax seal) or its front (the address, the charge the receiver pays,
                  the frank: "Free" and the member's name, the town and the date of 1784's rule, the red PAID of 1840), each part
                  written on when its word is said; a cover turns over between its back and its front
     BR_P         the people of the time, dressed for it: a member of parliament (a claret coat over a cream waistcoat, a white
                  neckcloth, his grey hair tied at the nape), his sister (a white cap and a kerchief), a clerk of the letter office
                  (a dark coat, spectacles), and a woman who posts a letter in 1840 (her hair parted and drawn low, a shawl)
     br_pamphlet  Rowland Hill's pamphlet of 1837; br_notice the post office's notice of 1840; br_coin a penny; br_pile letters
                  in a pile, and br_stacks the two years' counts
   Words that matter are drawn live with ag_T, at least 28 px, above y 890; the handwriting is decoration, and each part of a cover
   that the story needs has a card or a pill of its own. */

const BR_OLD={paper:[238,229,208],paperDk:[214,200,172],paperEdge:[172,154,124],ink:[56,40,32],ink2:[88,62,44],wax:[146,40,36],waxHi:[200,98,84],
  wood:[104,58,40],woodDk:[58,30,20],woodHi:[156,98,66],leather:[92,54,42],gilt:[198,166,106],paint:[206,198,178],paintDk:[164,154,132],
  brass:[184,150,90],red:[172,46,40],plaster:[224,216,198],pine:[150,112,74]};

/* ---------------------------------------------------------------- wood, painted once into a place
   br_wood: boards of mahogany (or any wood) running across, their grain and figure from the room's own noise, computed at half
   size and scaled up (the grain is soft anyway); o.base, o.dk, o.hi, o.board (each board's height), o.seed */
function br_wood(c,x,y,w,h,o){o=o||{};const k=0.5,cw=Math.ceil(w*k),ch=Math.ceil(h*k),cv=mkCanvas(cw,ch),cx=cv.getContext("2d"),img=cx.createImageData(cw,ch),d=img.data,
    base=o.base||BR_OLD.wood,dk=o.dk||BR_OLD.woodDk,hi=o.hi||BR_OLD.woodHi,bh=(o.board||150)*k,sd=(o.seed||0)*53.1,R=ag_rnd(17+(o.seed||0)),tone=[];
  for(let i=0;i<40;i++)tone.push((R()-0.5)*0.16);
  for(let j=0;j<ch;j++){const b=Math.floor(j/bh),lb=j-b*bh;for(let i=0;i<cw;i++){const X=i/k,Y=j/k;
    const g=AG_NZ.fbm(X*0.0026+b*7.3+sd,Y*0.05+b*3.1,4),fig=AG_NZ.fbm(X*0.0009+b*2.9,Y*0.012+sd,3),streak=Math.pow(Math.abs(Math.sin((Y*0.21+g*9+fig*6))),6);
    let v=0.5+(g-0.5)*0.9+(fig-0.5)*0.7-streak*0.18+tone[b%40];if(lb<1.2)v-=0.45;else if(lb<2.5)v+=0.08;v=clamp(v,0,1);
    const col=v<0.5?mix(dk,base,v*2):mix(base,hi,(v-0.5)*2),p=(j*cw+i)*4;d[p]=col[0];d[p+1]=col[1];d[p+2]=col[2];d[p+3]=255;}}
  cx.putImageData(img,0,0);c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";c.drawImage(cv,x,y,w,h);c.restore();}
// a faint varnish sheen and the window's warmth over a rectangle of wood
function br_sheen(c,x,y,w,h,lx,ly,r,a){const g=c.createRadialGradient(lx,ly,0,lx,ly,r);g.addColorStop(0,"rgba(255,236,206,"+a+")");g.addColorStop(1,"rgba(255,236,206,0)");
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.fillStyle=g;c.fillRect(x,y,w,h);c.restore();}
// a mottled flat colour (paint, plaster, leather), computed small and scaled up
function br_mottle(c,x,y,w,h,base,amp,seed,fr){const k=0.25,cw=Math.ceil(w*k),ch=Math.ceil(h*k),cv=mkCanvas(cw,ch),cx=cv.getContext("2d"),img=cx.createImageData(cw,ch),d=img.data;fr=fr||0.006;
  for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){const v=(AG_NZ.fbm(i/k*fr+seed,j/k*fr+seed*0.7,4)-0.5)*amp,p=(j*cw+i)*4;d[p]=base[0]+v;d[p+1]=base[1]+v;d[p+2]=base[2]+v*0.9;d[p+3]=255;}
  cx.putImageData(img,0,0);c.save();c.imageSmoothingEnabled=true;c.drawImage(cv,x,y,w,h);c.restore();}

/* ---------------------------------------------------------------- the writing table, close up (the place "brDesk")
   Seen from above, a little tilted: mahogany boards, a leather writing top with a gilt line round it, the inkstand at the top
   left with its quill, a stick of red wax and a brass seal at the top right. The covers, the coins and the pamphlet are drawn
   live on the leather. */
function br_paintDesk(c){br_wood(c,0,0,W,H,{board:170,seed:1});
  // the leather writing top
  const L={x:170,y:96,w:1580,h:930};
  ag_soft(c,cc=>ag_rect(cc,L.x,L.y,L.w,L.h,10),BR_OLD.leather,mix(BR_OLD.leather,[200,150,120],0.35),1500,200,900,"rgba(20,8,4,0.45)",30,0.5);
  c.save();c.beginPath();ag_rect(c,L.x,L.y,L.w,L.h,10);c.clip();c.globalAlpha=0.5;br_mottle(c,L.x,L.y,L.w,L.h,BR_OLD.leather,26,4.2,0.012);c.globalAlpha=1;
  const lg=c.createRadialGradient(1500,200,40,1300,420,1300);lg.addColorStop(0,"rgba(255,226,190,0.2)");lg.addColorStop(1,"rgba(255,226,190,0)");c.fillStyle=lg;c.fillRect(L.x,L.y,L.w,L.h);c.restore();
  // the gilt tooled line, and a second one inside it, worn
  c.strokeStyle=rgba(BR_OLD.gilt,0.55);c.lineWidth=2.4;c.beginPath();ag_rect(c,L.x+24,L.y+24,L.w-48,L.h-48,6);c.stroke();
  c.strokeStyle=rgba(BR_OLD.gilt,0.3);c.lineWidth=1.4;c.beginPath();ag_rect(c,L.x+34,L.y+34,L.w-68,L.h-68,4);c.stroke();
  // the leather's edge, a little proud of the wood
  c.strokeStyle="rgba(255,220,190,0.18)";c.lineWidth=2;c.beginPath();c.moveTo(L.x+10,L.y+1);c.lineTo(L.x+L.w-10,L.y+1);c.stroke();
  // the inkstand: a brass tray, a glass inkwell, a sand pot, and a quill leaning out of the frame
  br_inkstand(c,40,24);
  // the wax and the seal, top right
  ag_floorShadow(c,1772,128,96,16,0.35);
  ag_soft(c,cc=>{cc.moveTo(1690,104);cc.lineTo(1860,86);cc.lineTo(1864,112);cc.lineTo(1694,130);cc.closePath();},BR_OLD.wax,BR_OLD.waxHi,1800,94,90,"rgba(40,0,0,0.4)",8);
  ag_floorShadow(c,1820,232,42,12,0.4);
  ag_soft(c,cc=>{cc.ellipse(1820,220,30,12,0,0,TAU);},BR_OLD.brass,[255,236,180],1832,212,30,"rgba(60,40,0,0.4)",6);
  ag_soft(c,cc=>{cc.moveTo(1804,220);cc.bezierCurveTo(1800,190,1808,160,1820,150);cc.bezierCurveTo(1832,160,1840,190,1836,220);cc.closePath();},[60,46,34],[150,120,90],1828,170,30,null);
  // the window's light from the right, and the corners in shade
  let g=c.createRadialGradient(1700,80,60,1500,300,1500);g.addColorStop(0,"rgba(255,240,214,0.22)");g.addColorStop(1,"rgba(255,240,214,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(960,560,500,960,560,1200);g.addColorStop(0,"rgba(20,10,6,0)");g.addColorStop(1,"rgba(20,10,6,0.34)");c.fillStyle=g;c.fillRect(0,0,W,H);}
function br_inkstand(c,x,y){ag_floorShadow(c,x+170,y+196,190,30,0.4);
  ag_soft(c,cc=>ag_rect(cc,x,y+40,330,150,40),BR_OLD.brass,[255,236,184],x+260,y+60,200,"rgba(60,40,0,0.45)",16);
  c.strokeStyle="rgba(90,62,20,0.5)";c.lineWidth=2;c.beginPath();ag_rect(c,x+14,y+54,302,122,30);c.stroke();
  // the inkwell: glass round a black pool
  ag_soft(c,cc=>cc.arc(x+110,y+112,50,0,TAU),[70,74,78],[220,226,230],x+128,y+92,50,"rgba(0,0,0,0.5)",10);
  c.fillStyle="#141012";c.beginPath();c.arc(x+110,y+112,26,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.5)";c.beginPath();c.ellipse(x+124,y+98,8,4,-0.6,0,TAU);c.fill();
  // the sand pot
  ag_soft(c,cc=>cc.arc(x+240,y+112,40,0,TAU),[150,112,60],[250,220,160],x+254,y+96,40,"rgba(60,30,0,0.45)",8);
  c.fillStyle="rgba(60,40,10,0.55)";for(let i=0;i<9;i++){const a=i/9*TAU;c.beginPath();c.arc(x+240+Math.cos(a)*16,y+112+Math.sin(a)*16,3,0,TAU);c.fill();}
  // the quill: a white feather from the inkwell, out past the frame's top left
  const q0=[x+110,y+112],q1=[x-30,y-90];ag_taper(c,q0,[x+80,y+70],[x+30,y-10],q1,4,2,"rgba(200,190,170,1)");
  c.save();c.translate(x+60,y+20);c.rotate(-2.2);ag_soft(c,cc=>{cc.moveTo(0,0);cc.bezierCurveTo(30,-26,120,-36,190,-16);cc.bezierCurveTo(120,6,40,14,0,0);cc.closePath();},[236,232,222],[255,255,255],120,-20,120,"rgba(80,70,60,0.3)",8);
  c.strokeStyle="rgba(150,140,124,0.6)";c.lineWidth=2;c.beginPath();c.moveTo(4,0);c.quadraticCurveTo(100,-14,186,-14);c.stroke();c.restore();}
AG_PLACES.brDesk=c=>br_paintDesk(c);

/* ---------------------------------------------------------------- the member's study (the place "brStudy")
   Painted panels in a warm stone colour with a dado rail, a sash window on the right throwing its light across, a framed landscape,
   dark floorboards, and a writing table across the front: people stand behind it and are cut at its back edge (BR_STUDY.cut). */
const BR_STUDY={cut:842,table:{x:-40,y:900,w:2000,depth:58}};
function br_panel(c,x,y,w,h){c.fillStyle=rgba(mix(BR_OLD.paint,[255,250,236],0.06),1);c.fillRect(x,y,w,h);
  // the raised panel's bevels: lit on the top and right, in shade on the bottom and left (the window is up and to the right)
  const b=16;c.fillStyle="rgba(255,250,236,0.34)";c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.lineTo(x+w-b,y+b);c.lineTo(x+b,y+b);c.closePath();c.fill();
  c.beginPath();c.moveTo(x+w,y);c.lineTo(x+w,y+h);c.lineTo(x+w-b,y+h-b);c.lineTo(x+w-b,y+b);c.closePath();c.fill();
  c.fillStyle="rgba(60,48,30,0.16)";c.beginPath();c.moveTo(x,y+h);c.lineTo(x+w,y+h);c.lineTo(x+w-b,y+h-b);c.lineTo(x+b,y+h-b);c.closePath();c.fill();
  c.beginPath();c.moveTo(x,y);c.lineTo(x,y+h);c.lineTo(x+b,y+h-b);c.lineTo(x+b,y+b);c.closePath();c.fill();
  c.strokeStyle="rgba(60,48,30,0.22)";c.lineWidth=2;c.strokeRect(x-3,y-3,w+6,h+6);}
function br_paintStudy(c){const hz=760;
  br_mottle(c,0,0,W,hz,BR_OLD.paint,10,2.1);
  // the cornice, the panels above the dado, the rail, the panels below it, the skirting
  c.fillStyle=rgba(mix(BR_OLD.paint,[255,252,240],0.2),1);c.fillRect(0,0,W,46);c.fillStyle="rgba(60,48,30,0.2)";c.fillRect(0,46,W,4);c.fillStyle="rgba(255,252,240,0.5)";c.fillRect(0,40,W,2);
  for(const [x,w] of [[60,300],[420,540],[1020,320]])br_panel(c,x,110,w,420);
  c.fillStyle=rgba(mix(BR_OLD.paint,[255,252,240],0.18),1);c.fillRect(0,566,W,22);c.fillStyle="rgba(60,48,30,0.24)";c.fillRect(0,588,W,4);c.fillStyle="rgba(255,252,240,0.55)";c.fillRect(0,566,W,2);
  for(const [x,w] of [[60,300],[420,540],[1020,320]])br_panel(c,x,612,w,110);
  c.fillStyle=rgba(mix(BR_OLD.paint,[40,30,20],0.25),1);c.fillRect(0,hz-26,W,26);
  // a framed landscape over the middle panel: dark varnish, soft hills and a sky gone amber with age, in a gilt frame
  const P={x:540,y:170,w:300,h:220};ag_floorShadow(c,P.x+P.w/2-10,P.y+P.h+18,P.w*0.5,10,0.2);
  c.save();c.shadowColor="rgba(40,26,10,0.4)";c.shadowBlur=22;c.shadowOffsetX=-8;c.shadowOffsetY=12;c.fillStyle=rgba(BR_OLD.gilt,1);c.fillRect(P.x-22,P.y-22,P.w+44,P.h+44);c.restore();
  let g=c.createLinearGradient(P.x-22,P.y-22,P.x+P.w+22,P.y+P.h+22);g.addColorStop(0,"rgba(255,236,190,0.6)");g.addColorStop(1,"rgba(90,60,20,0.5)");c.fillStyle=g;c.fillRect(P.x-22,P.y-22,P.w+44,P.h+44);
  g=c.createLinearGradient(0,P.y,0,P.y+P.h);g.addColorStop(0,"#9C8C68");g.addColorStop(0.55,"#6E6A50");g.addColorStop(1,"#3E3A2C");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,P.h);
  c.fillStyle="rgba(46,52,40,0.85)";c.beginPath();c.moveTo(P.x,P.y+150);c.bezierCurveTo(P.x+80,P.y+110,P.x+150,P.y+140,P.x+220,P.y+120);c.bezierCurveTo(P.x+260,P.y+112,P.x+290,P.y+130,P.x+P.w,P.y+126);c.lineTo(P.x+P.w,P.y+P.h);c.lineTo(P.x,P.y+P.h);c.closePath();c.fill();
  c.fillStyle="rgba(30,30,24,0.9)";c.beginPath();c.moveTo(P.x+40,P.y+170);c.bezierCurveTo(P.x+50,P.y+110,P.x+70,P.y+90,P.x+90,P.y+120);c.bezierCurveTo(P.x+100,P.y+140,P.x+96,P.y+170,P.x+92,P.y+190);c.closePath();c.fill();
  // the sash window: its deep reveal, the sky, the glazing bars, a curtain drawn back
  br_window(c,1440,64,380,580,{arch:false});
  // the floor: dark boards in perspective
  ag_floor(c,ag_oakTex(),hz,600,300);c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(150,112,86)";c.fillRect(0,hz,W,H-hz);c.restore();
  g=c.createLinearGradient(0,hz,0,hz+70);g.addColorStop(0,"rgba(30,20,10,0.35)");g.addColorStop(1,"rgba(30,20,10,0)");c.fillStyle=g;c.fillRect(0,hz,W,70);
  // the window's light: a warm fall across the wall and a pool on the floor
  g=c.createRadialGradient(1520,300,40,1400,380,1300);g.addColorStop(0,"rgba(255,246,222,0.32)");g.addColorStop(1,"rgba(255,246,222,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,20,0.22)");g.addColorStop(0.5,"rgba(40,30,20,0.04)");g.addColorStop(1,"rgba(40,30,20,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the writing table across the front
  br_table(c,BR_STUDY.table.x,BR_STUDY.table.y,BR_STUDY.table.w,BR_STUDY.table.depth);}
// a window in the wall: the reveal, the sky, the bars, and the glow round it; o.arch for an arched top
function br_window(c,x,y,w,h,o){o=o||{};const r=o.arch?w/2:0,shape=cc=>{if(o.arch){cc.moveTo(x,y+r);cc.arc(x+w/2,y+r,w/2,Math.PI,0);cc.lineTo(x+w,y+h);cc.lineTo(x,y+h);cc.closePath();}else cc.rect(x,y,w,h);};
  c.save();c.shadowColor="rgba(255,248,230,0.7)";c.shadowBlur=60;c.fillStyle="#F4F0E4";c.beginPath();shape(c);c.fill();c.restore();
  // the sky: pale, warmer near the bottom
  c.save();c.beginPath();shape(c);c.clip();let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#E6ECEE");g.addColorStop(0.7,"#F2F1EA");g.addColorStop(1,"#F6EEDC");c.fillStyle=g;c.fillRect(x,y,w,h);
  // far roofs and a chimney, soft
  c.fillStyle="rgba(160,150,140,0.35)";c.beginPath();c.moveTo(x,y+h*0.78);c.lineTo(x+w*0.3,y+h*0.74);c.lineTo(x+w*0.34,y+h*0.66);c.lineTo(x+w*0.4,y+h*0.66);c.lineTo(x+w*0.42,y+h*0.73);c.lineTo(x+w,y+h*0.7);c.lineTo(x+w,y+h);c.lineTo(x,y+h);c.closePath();c.fill();
  // the reveal on the left, in shade, and on the bottom, the sill
  c.fillStyle="rgba(120,104,80,0.45)";c.fillRect(x,y,26,h);c.fillStyle="rgba(255,250,236,0.6)";c.fillRect(x+w-14,y,14,h);
  // the glazing bars
  c.strokeStyle="rgba(232,226,212,1)";c.lineWidth=10;const cols=3,rows=o.arch?4:4;for(let i=1;i<cols;i++){c.beginPath();c.moveTo(x+w*i/cols,y);c.lineTo(x+w*i/cols,y+h);c.stroke();}
  for(let j=1;j<rows;j++){c.beginPath();c.moveTo(x,y+h*j/rows);c.lineTo(x+w,y+h*j/rows);c.stroke();}
  c.strokeStyle="rgba(120,110,96,0.35)";c.lineWidth=2;for(let i=1;i<cols;i++){c.beginPath();c.moveTo(x+w*i/cols-5,y);c.lineTo(x+w*i/cols-5,y+h);c.stroke();}
  c.restore();
  c.strokeStyle="rgba(236,230,216,1)";c.lineWidth=18;c.beginPath();shape(c);c.stroke();c.strokeStyle="rgba(90,76,60,0.3)";c.lineWidth=2;c.beginPath();shape(c);c.stroke();
  c.fillStyle="rgba(236,230,216,1)";c.fillRect(x-30,y+h,w+60,22);c.fillStyle="rgba(60,48,30,0.25)";c.fillRect(x-30,y+h+22,w+60,6);
  // a heavy curtain drawn back to the left of it, in a dull rose
  const cx0=x-150;ag_soft(c,cc=>{cc.moveTo(cx0,y-30);cc.lineTo(x+20,y-30);cc.bezierCurveTo(x-20,y+h*0.3,x-60,y+h*0.6,x-40,y+h+60);cc.lineTo(cx0+10,y+h+60);cc.bezierCurveTo(cx0-10,y+h*0.6,cx0+10,y+h*0.3,cx0,y-30);cc.closePath();},
    [140,98,90],[220,180,170],x-40,y+100,260,"rgba(40,10,6,0.45)",22);
  ag_folds(c,cc=>{cc.rect(cx0-20,y-30,w,h+100);},[[[cx0+40,y],[cx0+30,y+h*0.5],[cx0+50,y+h+50]],[[cx0+90,y],[cx0+80,y+h*0.5],[cx0+96,y+h+50]]],"rgba(60,20,16,0.3)","rgba(255,220,210,0.18)");}
// a mahogany table seen from the front: its top receding depth px, its front edge at y
function br_table(c,x,y,w,d){ag_floorShadow(c,x+w/2,y+120,w*0.5,60,0.3);
  c.save();c.beginPath();c.moveTo(x+d*0.4,y-d);c.lineTo(x+w-d*0.4,y-d);c.lineTo(x+w,y);c.lineTo(x,y);c.closePath();c.clip();br_wood(c,x,y-d,w,d,{board:400,seed:3});
  br_sheen(c,x,y-d,w,d,1500,y-d,900,0.22);c.restore();
  c.strokeStyle="rgba(255,220,190,0.3)";c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.stroke();
  c.save();c.beginPath();c.rect(x,y,w,H-y);c.clip();br_wood(c,x,y,w,H-y,{board:600,seed:5,base:mix(BR_OLD.wood,[0,0,0],0.2),hi:mix(BR_OLD.woodHi,[0,0,0],0.25)});
  const g=c.createLinearGradient(0,y,0,y+40);g.addColorStop(0,"rgba(20,10,6,0.45)");g.addColorStop(1,"rgba(20,10,6,0)");c.fillStyle=g;c.fillRect(x,y,w,40);c.restore();}
AG_PLACES.brStudy=c=>br_paintStudy(c);

/* ---------------------------------------------------------------- the letter office (the place "brOffice")
   Plastered walls, a tall rack of pigeonholes behind the counter with letters in some of them, an arched window on the right, a
   bare stretch of wall between them where the notice of 1840 is put up (drawn live), and the counter across the front: the clerk
   stands behind it, cut at its back edge (BR_OFFICE.cut). */
const BR_OFFICE={cut:826,counter:{x:-40,y:880,w:2000,depth:54},notice:{x:1210,y:118,w:330,h:430},rack:{x:80,y:96,w:1060,h:640}};
function br_paintOffice(c){const hz=780,Rk=BR_OFFICE.rack;
  br_mottle(c,0,0,W,hz,BR_OLD.plaster,12,6.3);
  c.fillStyle="rgba(60,48,30,0.16)";c.fillRect(0,hz-30,W,30);
  // the rack: stained pine, a grid of pigeonholes, dark inside, with a few letters standing in them
  ag_floorShadow(c,Rk.x+Rk.w/2,Rk.y+Rk.h+14,Rk.w*0.52,18,0.3);
  c.save();c.shadowColor="rgba(40,26,10,0.35)";c.shadowBlur=26;c.shadowOffsetX=-10;c.shadowOffsetY=14;c.fillStyle=rgba(BR_OLD.pine,1);c.fillRect(Rk.x,Rk.y,Rk.w,Rk.h);c.restore();
  c.save();c.beginPath();c.rect(Rk.x,Rk.y,Rk.w,Rk.h);c.clip();br_wood(c,Rk.x,Rk.y,Rk.w,Rk.h,{board:80,seed:7,base:BR_OLD.pine,dk:[110,78,48],hi:[190,150,104]});c.restore();
  const cols=11,rows=7,cw=(Rk.w-28)/cols,ch=(Rk.h-28)/rows,R=ag_rnd(91);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x=Rk.x+14+i*cw+6,y=Rk.y+14+j*ch+6,w=cw-12,h=ch-12;
    const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#2E2218");g.addColorStop(1,"#4A3828");c.fillStyle=g;c.fillRect(x,y,w,h);
    c.fillStyle="rgba(255,236,200,0.16)";c.fillRect(x+w-3,y,3,h);
    // letters standing in it, leaning
    const n=R()<0.55?1+Math.floor(R()*3):0;for(let k=0;k<n;k++){const lw=w*(0.5+R()*0.3),lh=h*(0.55+R()*0.3),lx=x+4+R()*(w-lw-8),ly=y+h-lh,rot=(R()-0.5)*0.12;
      c.save();c.translate(lx+lw/2,ly+lh);c.rotate(rot);c.fillStyle=rgba(mix(BR_OLD.paper,BR_OLD.paperDk,R()*0.6),1);c.fillRect(-lw/2,-lh,lw,lh);
      c.fillStyle="rgba(60,40,20,0.18)";c.fillRect(-lw/2,-lh,lw,3);if(R()<0.4){c.fillStyle=rgba(BR_OLD.wax,0.9);c.beginPath();c.arc(0,-lh*0.5,4,0,TAU);c.fill();}c.restore();}}
  c.strokeStyle="rgba(60,40,20,0.45)";c.lineWidth=3;c.strokeRect(Rk.x+2,Rk.y+2,Rk.w-4,Rk.h-4);
  // the arched window
  br_window(c,1600,70,270,600,{arch:true});
  // the floor, and the light
  ag_floor(c,ag_oakTex(),hz,600,300);c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(170,136,104)";c.fillRect(0,hz,W,H-hz);c.restore();
  let g=c.createRadialGradient(1700,300,40,1500,400,1400);g.addColorStop(0,"rgba(255,246,222,0.3)");g.addColorStop(1,"rgba(255,246,222,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,20,0.2)");g.addColorStop(0.5,"rgba(40,30,20,0.03)");g.addColorStop(1,"rgba(40,30,20,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the counter
  const K=BR_OFFICE.counter;br_table(c,K.x,K.y,K.w,K.depth);}
AG_PLACES.brOffice=c=>br_paintOffice(c);

/* ---------------------------------------------------------------- handwriting
   br_script(c, x, y, w, h, seed, o) writes one line of a running hand into c, its baseline at y, h its small letters' height. The pen
   moves on at an even pace while it rises and falls, so each letter is a stroke that loops a little back on itself: the small ones
   (n, e, o, i) within h, the tall ones (l, t) rising to about 2.2 h with a loop, the low one (g) falling below the line; thick going down,
   thin going up, slanted as a running hand is, with a gap between words. o.cap starts with a capital's stem; o.flourish ends with a
   stroke back under the line; o.ink, o.slant, o.words (how many), o.thick. It's decoration: what a line says, the film says in a card. */
const BR_HAND={n:[1,0.12,0.26],e:[0.85,0.36,0.2],o:[1,0.5,0.12],i:[0.9,0.02,0.12],l:[2.25,0.34,0.13],t:[1.8,0.03,0.07],g:[-1.25,0.34,0.1]};  // rise, loop, how often
// a capital's stem, in units of h from where it starts on the line: thin up, over a small hook at the top, thick down, a curl into the next letter
const BR_CAP=[[[0.1,0],[0.4,-0.9],[0.7,-1.9],[0.95,-2.5]],[[0.95,-2.5],[1.1,-2.85],[1.45,-2.6],[1.2,-2.3]],[[1.2,-2.3],[0.9,-1.6],[0.6,-0.6],[0.55,0]],[[0.55,0],[0.5,0.25],[0.9,0.15],[1.1,-0.25]]];
function br_script(c,x,y,w,h,seed,o){o=o||{};const R=ag_rnd(seed),tn=Math.tan(o.slant==null?0.34:o.slant),ink=o.ink||BR_OLD.ink,
    thick=o.thick||Math.max(2,h*0.13),thin=Math.max(0.9,h*0.045),keys=Object.keys(BR_HAND),cum=[];let acc=0;
  for(const k of keys){acc+=BR_HAND[k][2];cum.push(acc);}
  const pick=()=>{const r=R()*acc;for(let i=0;i<keys.length;i++)if(r<=cum[i])return keys[i];return "n";};
  const nw=o.words||Math.max(1,Math.round(w/(h*4))),words=[];let total=0;
  for(let i=0;i<nw;i++){const n=3+Math.floor(R()*5),L=[];for(let k=0;k<n;k++)L.push(pick());words.push(L);total+=n;}
  const capW=o.cap?h*1.3:0,gap=h*0.95,adv=(w-capW-gap*(nw-1))/total;
  c.save();c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba(ink,0.9);
  const P=(px,py)=>[px+(y-py)*tn,py];
  let prev=null;const to=(px,py)=>{const q=P(px,py);if(prev){const dy=q[1]-prev[1],dl=Math.hypot(q[0]-prev[0],dy)||1;
      c.lineWidth=lerp(thin,thick,clamp(dy/dl*1.3,0,1));c.beginPath();c.moveTo(prev[0],prev[1]);c.lineTo(q[0],q[1]);c.stroke();}prev=q;};
  let X=x;
  if(o.cap){for(const b of BR_CAP)for(let i=prev?1:0;i<=14;i++){const u=i/14,m=1-u,
      dx=m*m*m*b[0][0]+3*m*m*u*b[1][0]+3*m*u*u*b[2][0]+u*u*u*b[3][0],dy=m*m*m*b[0][1]+3*m*m*u*b[1][1]+3*m*u*u*b[2][1]+u*u*u*b[3][1];to(X+dx*h,y+dy*h);}
    X+=capW;}
  words.forEach((L,wi)=>{if(wi>0){prev=null;X+=gap;}
    L.forEach(k=>{const [amp,loop]=BR_HAND[k],steps=k==="l"||k==="g"?26:18;
      for(let s=0;s<=steps;s++){const u=s/steps,ph=u*TAU,ex=(1-Math.cos(ph))/2*amp;to(X+adv*u-adv*loop*Math.sin(ph),y-h*ex);}
      // the i's dot and the t's bar
      if(k==="i"){const q=P(X+adv*0.5,y-h*1.7);c.fillStyle=rgba(ink,0.9);c.beginPath();c.arc(q[0],q[1],thick*0.55,0,TAU);c.fill();}
      if(k==="t"){const a=P(X-adv*0.1,y-h*1.15),b=P(X+adv*0.75,y-h*1.2);c.lineWidth=thin*1.4;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
      X+=adv;});
    if(wi===nw-1&&o.flourish){const x1=prev?prev[0]:X,span=Math.min(X-x,h*9);for(let s=1;s<=40;s++){const u=s/40,
        q=[x1+Math.sin(u*Math.PI)*h*0.7-u*span,y+h*0.35+Math.sin(u*Math.PI)*h*0.4];
        if(prev){c.lineWidth=lerp(thick*0.9,thin,u);c.beginPath();c.moveTo(prev[0],prev[1]);c.lineTo(q[0],q[1]);c.stroke();}prev=q;}}});
  c.restore();}
// a numeral 6, as the charge is written in the corner: a stroke curving down into a loop on the line
function br_numeral(c,x,y,h,ink){c.save();c.lineCap="round";c.strokeStyle=rgba(ink,0.9);c.lineWidth=h*0.16;
  c.beginPath();c.moveTo(x+h*0.95,y-h*2);c.quadraticCurveTo(x+h*0.1,y-h*1.5,x+h*0.12,y-h*0.5);c.stroke();
  c.lineWidth=h*0.09;c.beginPath();c.ellipse(x+h*0.52,y-h*0.48,h*0.42,h*0.46,0.2,Math.PI*0.95,Math.PI*0.95+TAU);c.stroke();c.restore();}

/* ---------------------------------------------------------------- a letter's cover
   Its size in its own frame: BR_CV.w by BR_CV.h. Each line of its writing is a kept picture of its own (BR_CVPARTS), written on from
   left to right as its part's p goes from 0 to 1, a line at a time: addr (the address, three lines, the post town last), charge (what
   the receiver pays, in the top right corner), frank ("Free" and the member's name, at the bottom left), date (1784's town and date,
   above the frank), copy (the same frank in another hand), paid (1840's red PAID, top right). The back shows the folded sheet's outer
   flap and the wax seal across its edge. */
const BR_CV={w:880,h:560,res:1.25};
const BR_CVPARTS={
  addr:{lines:[[300,226,430,24,11,{cap:true,words:4}],[350,298,380,24,12,{cap:true,words:3}],[470,372,250,26,13,{cap:true,words:1,flourish:true}]]},
  charge:{lines:[[748,138,60,30,21,{numeral:true}]]},
  frank:{lines:[[70,470,110,26,31,{cap:true,words:1}],[70,524,300,28,32,{cap:true,words:2,flourish:true}]]},
  date:{lines:[[70,416,300,20,41,{cap:true,words:4}]]},
  copy:{lines:[[70,470,110,26,33,{cap:true,words:1,ink:BR_OLD.ink2,slant:0.44}],[70,524,300,28,34,{cap:true,words:2,flourish:true,ink:BR_OLD.ink2,slant:0.44}]]}
};
// a line's kept picture and the stretch of the cover it covers [x0, y0, x1, y1]
function br_line(key,i){const L=BR_CVPARTS[key].lines[i],[x,y,w,h,seed,o]=L,b=[x-h*2.2,y-h*3.2,x+w+h*2.2,y+h*2],R=BR_CV.res;
  return{b,img:ag_kept("brcv:"+key+":"+i,Math.ceil((b[2]-b[0])*R),Math.ceil((b[3]-b[1])*R),c=>{c.scale(R,R);c.translate(-b[0],-b[1]);
    if(o.numeral)br_numeral(c,x,y,h,o.ink||BR_OLD.ink);else br_script(c,x,y,w,h,seed,Object.assign({},o));})};}
// the paper of a cover's front or back, kept: faint laid and chain lines, a little age at the edges; on the back, the outer flap's edge
function br_paper(side){return ag_kept("brpaper:"+side,Math.ceil(BR_CV.w*BR_CV.res),Math.ceil(BR_CV.h*BR_CV.res),(c)=>{c.scale(BR_CV.res,BR_CV.res);const w=BR_CV.w,h=BR_CV.h;
  ag_soft(c,cc=>ag_rect(cc,0,0,w,h,6),BR_OLD.paper,[252,248,236],w*0.8,h*0.2,w*0.9,"rgba(120,96,60,0.35)",34,0.6);
  c.save();c.beginPath();ag_rect(c,0,0,w,h,6);c.clip();c.strokeStyle="rgba(150,130,96,0.045)";c.lineWidth=1;for(let y=8;y<h;y+=7){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
  c.strokeStyle="rgba(150,130,96,0.08)";for(let x=40;x<w;x+=110){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}
  const g=c.createRadialGradient(w/2,h/2,h*0.3,w/2,h/2,w*0.7);g.addColorStop(0,"rgba(180,150,100,0)");g.addColorStop(1,"rgba(180,150,100,0.24)");c.fillStyle=g;c.fillRect(0,0,w,h);
  if(side==="back"){// the sheet folded in from both sides: the outer flap's edge, a little uneven, its soft shade on the flap under it
    const ex=w*0.57,edge=cc=>{cc.moveTo(ex-4,0);cc.bezierCurveTo(ex+3,h*0.3,ex-5,h*0.7,ex+2,h);};
    c.save();c.filter="blur(6px)";c.strokeStyle="rgba(110,86,50,0.28)";c.lineWidth=14;c.beginPath();c.moveTo(ex+6,0);c.bezierCurveTo(ex+13,h*0.3,ex+5,h*0.7,ex+12,h);c.stroke();c.restore();
    c.fillStyle=rgba(BR_OLD.paper,1);c.beginPath();c.moveTo(0,0);c.lineTo(ex-4,0);c.bezierCurveTo(ex+3,h*0.3,ex-5,h*0.7,ex+2,h);c.lineTo(0,h);c.closePath();c.fill();
    c.fillStyle="rgba(255,252,240,0.25)";c.fillRect(0,0,ex-6,h);
    c.strokeStyle="rgba(110,86,50,0.5)";c.lineWidth=2;c.beginPath();edge(c);c.stroke();
    c.strokeStyle="rgba(120,96,60,0.16)";c.lineWidth=1.6;c.beginPath();c.moveTo(0,h*0.5);c.lineTo(ex-10,h*0.5);c.stroke();}
  else{c.strokeStyle="rgba(120,96,60,0.16)";c.lineWidth=1.6;c.beginPath();c.moveTo(6,h*0.06);c.lineTo(w-6,h*0.06);c.stroke();}
  c.restore();});}
// the wax seal on the back: a red blob pressed with a ring and a small device, at (x, y), r across, k 0 to 1 as it presses
function br_seal(ctx,x,y,r,k){if(k<=0)return;const s=lerp(0.6,1,ag_eo(k));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ag_soft(ctx,cc=>{for(let i=0;i<=24;i++){const a=i/24*TAU,rr2=r*(1+0.07*Math.sin(a*5+1)+0.04*Math.sin(a*9));i?cc.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2):cc.moveTo(Math.cos(a)*rr2,Math.sin(a)*rr2);}cc.closePath();},
    BR_OLD.wax,BR_OLD.waxHi,r*0.3,-r*0.4,r*1.1,"rgba(40,0,0,0.5)",8);
  ctx.strokeStyle="rgba(90,10,10,0.55)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*0.62,0,TAU);ctx.stroke();ctx.strokeStyle="rgba(255,170,150,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(1,-1,r*0.62,Math.PI*1.1,Math.PI*1.9);ctx.stroke();
  ctx.fillStyle="rgba(90,10,10,0.5)";ctx.beginPath();ctx.moveTo(-r*0.22,r*0.2);ctx.lineTo(0,-r*0.3);ctx.lineTo(r*0.22,r*0.2);ctx.closePath();ctx.fill();ctx.restore();}
// a part written on to p: each of its lines in turn, left to right
function br_write(ctx,key,p){if(p<=0)return;const n=BR_CVPARTS[key].lines.length;
  for(let i=0;i<n;i++){const u=clamp(p*n-i,0,1);if(u<=0)break;const {b,img}=br_line(key,i);
    ctx.save();ctx.beginPath();ctx.rect(b[0],b[1],(b[2]-b[0])*u,b[3]-b[1]);ctx.clip();ctx.drawImage(img,b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.restore();}}
// the red PAID of 1840: a double ring, the word inside, a little uneven, as a handstamp leaves it
function br_paid(ctx,x,y,r,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(-0.12);ctx.strokeStyle=rgba(BR_OLD.red,0.86);ctx.lineWidth=4;
  ctx.beginPath();ctx.ellipse(0,0,r*1.25,r,0,0,TAU);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,r*1.25-9,r-9,0,0,TAU);ctx.stroke();
  ag_T(ctx,"PAID",0,13,{w:800,size:38,align:"center",col:BR_OLD.red,a:0.9,ls:2});ctx.restore();}
/* the cover at (x, y), w wide (its height follows), turned by o.rot; o.flip 0 shows its back, 1 its front, and between it turns over;
   o.p {addr, charge, frank, date, paid, seal}; o.blank: a cover with only the frank on it, no address; o.copied: its frank in another
   hand; o.dim greys it; o.a, o.k (springs from its middle); o.edge a colour round it (amber for a copied name), o.edgeA */
function br_cover(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const sc=w/BR_CV.w,h=BR_CV.h*sc,p=o.p||{},fl=o.flip==null?1:o.flip;
  const b={x,y,w,h};ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);if(o.rot)ctx.rotate(o.rot);if(o.k!=null){const k=lerp(0.6,1,o.k);ctx.scale(k,k);}
  // turning over: the cover narrows to its edge, then widens showing its other side
  const turn=Math.cos(fl*Math.PI),sx=Math.max(0.02,Math.abs(turn)),front=turn<=0;
  ctx.save();ctx.shadowColor="rgba(30,16,6,0.4)";ctx.shadowBlur=26*sc+6;ctx.shadowOffsetX=-8*sc;ctx.shadowOffsetY=12*sc;ctx.fillStyle="rgba(0,0,0,0.01)";ctx.fillRect(-w/2*sx,-h/2,w*sx,h);ctx.restore();
  ctx.scale(sx*sc,sc);ctx.translate(-BR_CV.w/2,-BR_CV.h/2);
  ctx.drawImage(br_paper(front?"front":"back"),0,0,BR_CV.w,BR_CV.h);
  if(front){if(!o.blank){br_write(ctx,"addr",p.addr==null?1:p.addr);br_write(ctx,"charge",p.charge||0);}
    br_write(ctx,"date",p.date||0);br_write(ctx,o.copied?"copy":"frank",p.frank||0);
    if(p.paid)br_paid(ctx,720,130,58,p.paid);}
  else br_seal(ctx,BR_CV.w*0.57,BR_CV.h*0.5,46,p.seal==null?1:p.seal);
  // a little shade as it turns, darker on its far half
  if(sx<0.98){ctx.fillStyle="rgba(60,40,20,"+(0.25*(1-sx))+")";ctx.fillRect(0,0,BR_CV.w,BR_CV.h);}
  if(o.dim){ctx.fillStyle="rgba(140,136,128,"+(0.55*o.dim)+")";ctx.fillRect(0,0,BR_CV.w,BR_CV.h);}
  if(o.edge){ctx.strokeStyle=rgba(o.edge,0.9*(o.edgeA==null?1:o.edgeA));ctx.lineWidth=5/sc;ctx.beginPath();ag_rect(ctx,-4,-4,BR_CV.w+8,BR_CV.h+8,10);ctx.stroke();}
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the people of the time
   ag_person specs, each painted once (their own key), dressed for their time:
     the member (the 1780s): a claret coat over a buff waistcoat and its buttons, a white neckcloth wound high round the neck with the
       shirt's frill falling below it, his grey hair tied at the nape with a black ribbon
     his sister: a white linen cap, puffed over the crown, its frill round her face and over her ears, a ribbon round it; a white
       kerchief over her shoulders, crossed on her chest
     a clerk of the letter office (the 1830s): a dark coat, a buff waistcoat, a black stock high round the neck with the shirt's white
       edge above it, spectacles
     a woman who posts a letter (1840): a straw bonnet over hair parted and drawn smooth over the ears, its ribbon tied under her chin;
       a shawl over her shoulders with a darker border, a small white collar
   A hat or a cap is painted with the head (who.hat.paint, inside the head's picture, x 160 to 440, y 250 to 560). What closes over the
   neck or falls over the shoulders (a neckcloth, a stock, a kerchief, a shawl) is a picture of its own (who.over, inside who.overBox),
   laid over the person and breathing with the body, as How it goes wrong lays its mantle: painted with the body, it would sit under
   the neck, which the body's picture paints last. br_person draws a person with it, and draws a person who fades whole first. */
function br_person(ctx,who,x,y,s,o){o=o||{};const a=ctx.globalAlpha;if(a<0.004)return null;
  if(!who.over)return ag_person(ctx,who,x,y,s,o);
  if(a<0.995){const [bc,bx]=ag_buf("brPerson",ctx.canvas.width,ctx.canvas.height);bx.setTransform(ctx.getTransform());const hd=br_person(bx,who,x,y,s,o);
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(bc,0,0);ctx.restore();return hd;}
  const hands=ag_person(ctx,who,x,y,s,o),F=ag_fig(who),L=F.over||(F.over=ag_layer(c=>who.over(c,who),who.overBox)),
    A=AG_FIG.anchor,br=Math.sin((o.t||0)*TAU*who.breath)*2.2;
  ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.translate(-A[0],-A[1]+br);
  if(o.cut!=null){ctx.beginPath();ctx.rect(-4000,-4000,9000,4000+A[1]+(o.cut-y)/s-br);ctx.clip();}
  ag_drawLayer(ctx,L);ctx.restore();return hands;}
// the neck wound round from the collar to just under the jaw, in figure space
const BR_STOCK=cc=>{cc.moveTo(238,488);cc.bezierCurveTo(256,498,274,510,292,518);cc.bezierCurveTo(308,526,324,534,341,538);
  cc.bezierCurveTo(347,560,353,584,361,606);cc.bezierCurveTo(330,620,282,616,248,596);cc.bezierCurveTo(238,588,233,578,232,566);
  cc.bezierCurveTo(232,540,235,512,238,488);cc.closePath();};
// a neckcloth, wound round the neck lower than a stock, the neck showing under the jaw, its cloth puffed a little at the front
const BR_CRAVAT=cc=>{cc.moveTo(236,516);cc.bezierCurveTo(262,528,300,544,342,552);cc.bezierCurveTo(360,564,368,588,362,606);
  cc.bezierCurveTo(330,620,282,616,248,596);cc.bezierCurveTo(238,588,233,578,232,566);cc.bezierCurveTo(232,548,234,530,236,516);cc.closePath();};
// a neckcloth (o.low) or a stock: o.cloth its colour; o.frill the shirt's frill below it; o.shirt the shirt's edge and collar point above a dark stock; o.btn
// the waistcoat's buttons down the coat's opening
function br_neckwear(o){return(c,P)=>{const cl=o.cloth,lt=ag_lt(cl,0.5),dk=ag_dk(cl,0.45);
  if(o.btn)for(const [x,y] of [[313,742],[316,776],[319,808],[321,838]]){c.fillStyle=rgba(ag_dk(o.btn,0.4),0.55);c.beginPath();c.arc(x+1,y+1.5,5.6,0,TAU);c.fill();
    c.fillStyle=rgba(o.btn,1);c.beginPath();c.arc(x,y,5.2,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.5)";c.beginPath();c.arc(x+1.6,y-1.6,1.8,0,TAU);c.fill();}
  if(o.frill){const f=cc=>{cc.moveTo(318,604);cc.bezierCurveTo(340,604,354,612,355,626);cc.bezierCurveTo(353,652,346,684,336,712);
      cc.bezierCurveTo(328,724,314,724,308,712);cc.bezierCurveTo(302,680,303,646,309,620);cc.bezierCurveTo(311,610,314,605,318,604);cc.closePath();};
    ag_soft(c,f,o.frill,ag_lt(o.frill,0.6),340,630,80,rgba(ag_dk(o.frill,0.4),0.35),6);
    c.save();ag_shape(c,f);c.clip();c.strokeStyle=rgba(ag_dk(o.frill,0.3),0.55);c.lineWidth=1.8;c.lineCap="round";
    for(const y of [628,652,676,700]){c.beginPath();c.moveTo(300,y-6);c.quadraticCurveTo(318,y+6,330,y-2);c.quadraticCurveTo(342,y+8,358,y);c.stroke();}c.restore();}
  const sh=o.low?BR_CRAVAT:BR_STOCK;ag_soft(c,sh,cl,lt,340,556,90,rgba(dk,0.45),12);
  c.save();ag_shape(c,sh);c.clip();c.lineCap="round";
  const g=c.createLinearGradient(236,0,360,0);g.addColorStop(0,rgba(dk,0.3));g.addColorStop(0.55,rgba(dk,0));c.fillStyle=g;c.fillRect(226,480,140,140);
  c.strokeStyle=rgba(dk,0.3);c.lineWidth=2.4;c.beginPath();
  if(o.low){c.moveTo(312,562);c.quadraticCurveTo(334,566,352,578);c.moveTo(318,588);c.quadraticCurveTo(338,590,356,600);}
  else{c.moveTo(236,530);c.bezierCurveTo(268,540,300,560,348,560);c.moveTo(240,566);c.bezierCurveTo(276,580,320,594,358,594);}c.stroke();
  c.strokeStyle=rgba(lt,0.45);c.lineWidth=2;c.beginPath();if(o.low){c.moveTo(300,552);c.quadraticCurveTo(326,560,350,568);}else{c.moveTo(250,526);c.bezierCurveTo(284,540,312,552,344,552);}c.stroke();c.restore();
  if(o.shirt){c.strokeStyle=rgba(o.shirt,1);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(240,490);c.bezierCurveTo(258,500,276,512,293,520);c.bezierCurveTo(309,528,325,535,340,539);c.stroke();
    // the near collar point, standing up against the cheek
    ag_soft(c,cc=>{cc.moveTo(298,524);cc.lineTo(316,508);cc.lineTo(338,540);cc.closePath();},o.shirt,[255,255,255],318,514,30,rgba(ag_dk(o.shirt,0.4),0.35),4);}};}
// hair tied back at the nape with a black ribbon bow
function br_queue(col){return(c,P)=>{const hc=P.hair.c;
  ag_soft(c,cc=>{cc.moveTo(226,446);cc.bezierCurveTo(206,466,198,500,202,530);cc.bezierCurveTo(206,548,216,550,220,534);cc.bezierCurveTo(218,502,224,476,240,458);cc.closePath();},hc,ag_lt(hc,0.3),214,470,40,null);
  c.fillStyle=rgba(col,1);c.beginPath();c.ellipse(222,460,15,9,0.5,0,TAU);c.fill();
  c.beginPath();c.moveTo(222,460);c.bezierCurveTo(204,450,196,462,202,472);c.closePath();c.fill();c.beginPath();c.moveTo(222,460);c.bezierCurveTo(236,476,232,488,222,486);c.closePath();c.fill();};}
// a white linen cap: its crown puffed over the head and down behind the ear, a frill of small scallops round the face, a ribbon round it
function br_mobcap(col,band){return(c,P)=>{const dk=ag_dk(col,0.2);
  const cap=cc=>{cc.moveTo(394,316);cc.bezierCurveTo(392,282,340,260,286,260);cc.bezierCurveTo(232,260,190,288,180,332);cc.bezierCurveTo(170,380,178,430,204,466);
    cc.bezierCurveTo(216,482,230,492,240,494);cc.lineTo(258,490);cc.bezierCurveTo(266,482,270,476,272,468);cc.bezierCurveTo(274,452,272,436,271,424);
    cc.bezierCurveTo(268,404,268,384,270,364);cc.bezierCurveTo(274,350,280,342,288,336);cc.bezierCurveTo(300,326,316,320,334,318);cc.bezierCurveTo(354,318,374,324,392,338);cc.closePath();};
  ag_soft(c,cap,col,[255,255,255],320,280,160,rgba(ag_dk(col,0.5),0.35),16);
  // the crown gathered into the ribbon: soft folds running out from it, and small puckers along the back edge
  ag_folds(c,cap,[[[214,320],[226,360],[222,410]],[[260,286],[276,300],[286,318]],[[196,380],[206,420],[224,456]],[[320,272],[340,284],[356,300]],[[236,290],[246,312],[250,336]],[[186,346],[200,362],[214,380]]],rgba(dk,0.6),"rgba(255,255,255,0.5)");
  c.save();ag_shape(c,cap);c.clip();c.strokeStyle=rgba(dk,0.5);c.lineWidth=1.6;c.lineCap="round";
  for(let i=0;i<9;i++){const u=i/8,x=lerp(186,226,u)-Math.sin(u*Math.PI)*8,y=lerp(330,476,u);c.beginPath();c.moveTo(x-6,y-4);c.quadraticCurveTo(x+4,y+2,x+12,y-2);c.stroke();}c.restore();
  c.strokeStyle=rgba(band,0.95);c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(374,302);c.bezierCurveTo(330,290,270,302,242,340);c.bezierCurveTo(224,370,224,420,236,458);c.stroke();
  const F=[[392,338],[374,324],[354,318],[334,318],[316,320],[300,326],[288,336],[280,344],[274,352],[270,364],[268,384],[268,404],[271,424],[272,446],[272,468],[266,480],[258,490]];
  c.strokeStyle=rgba(dk,0.6);c.lineWidth=1.4;
  for(const [off,bulge,tone] of [[-9,9,0.25],[0,10,0.45]])for(let i=0;i<F.length-1;i++){const a=F[i],b=F[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=dy/l,ny=-dx/l,
      A=[a[0]-nx*off,a[1]-ny*off],B=[b[0]-nx*off,b[1]-ny*off],mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;
    c.fillStyle=rgba(ag_lt(col,tone),1);c.beginPath();c.moveTo(A[0],A[1]);c.quadraticCurveTo(mx+nx*bulge,my+ny*bulge,B[0],B[1]);c.closePath();c.fill();c.stroke();}};}
// a white kerchief over the shoulders, the far end crossed over the near one on the chest
const BR_FICHU=cc=>{cc.moveTo(84,692);cc.bezierCurveTo(94,642,150,600,232,562);cc.bezierCurveTo(262,600,318,618,360,604);
  cc.bezierCurveTo(396,612,428,636,446,672);cc.bezierCurveTo(436,730,404,790,356,850);cc.bezierCurveTo(330,842,302,814,282,782);
  cc.bezierCurveTo(240,762,170,742,110,732);cc.bezierCurveTo(96,724,86,710,84,692);cc.closePath();};
function br_kerchief(col){return(c,P)=>{const lt=ag_lt(col,0.6),dk=ag_dk(col,0.32);
  ag_soft(c,BR_FICHU,col,lt,380,640,260,rgba(dk,0.45),16);
  c.save();ag_shape(c,BR_FICHU);c.clip();c.strokeStyle=rgba(dk,0.3);c.lineWidth=12;c.filter="blur(5px)";c.beginPath();c.moveTo(346,612);c.bezierCurveTo(326,680,296,740,272,786);c.stroke();c.filter="none";
  c.strokeStyle=rgba(dk,0.7);c.lineWidth=2.2;c.beginPath();c.moveTo(352,608);c.bezierCurveTo(332,680,302,740,280,784);c.stroke();c.restore();
  ag_folds(c,BR_FICHU,[[[150,640],[200,660],[250,700]],[[398,640],[392,700],[370,780]],[[110,700],[180,712],[260,742]],[[300,640],[296,690],[288,740]]],rgba(dk,0.4),"rgba(255,255,255,0.5)");};}
// a straw bonnet: its crown round the back of the head with a short curtain over the nape, a deep brim framing the face (the straw
// outside, the lining seen past the far cheek), its ribbon from the brim's edge tied in a bow under the chin
function br_bonnet(straw,lining,ribbon){return(c,P)=>{const dk=ag_dk(straw,0.42),lt=ag_lt(straw,0.4);
  const crown=cc=>{cc.moveTo(296,290);cc.bezierCurveTo(246,284,202,312,190,358);cc.bezierCurveTo(180,398,186,440,206,470);cc.bezierCurveTo(222,492,244,498,258,490);cc.lineTo(266,330);cc.closePath();};
  ag_soft(c,crown,straw,lt,270,300,150,rgba(dk,0.5),14);
  const curtain=cc=>{cc.moveTo(194,436);cc.bezierCurveTo(196,470,212,500,240,512);cc.bezierCurveTo(250,516,258,512,262,504);cc.lineTo(258,486);cc.bezierCurveTo(236,488,212,470,200,440);cc.closePath();};
  ag_soft(c,curtain,ribbon,ag_lt(ribbon,0.3),240,490,60,rgba(ag_dk(ribbon,0.5),0.4),6);
  const brim=cc=>{cc.moveTo(254,502);cc.bezierCurveTo(226,452,218,372,236,320);cc.bezierCurveTo(254,274,312,258,362,264);cc.bezierCurveTo(400,270,424,298,430,342);
    cc.bezierCurveTo(434,392,430,440,418,488);cc.lineTo(406,482);cc.bezierCurveTo(412,440,412,392,404,354);cc.bezierCurveTo(396,324,370,308,336,308);
    cc.bezierCurveTo(302,308,280,326,274,356);cc.bezierCurveTo(268,396,270,444,278,494);cc.closePath();};
  ag_soft(c,brim,straw,lt,380,290,170,rgba(dk,0.5),12);
  const lin=cc=>{cc.moveTo(406,482);cc.bezierCurveTo(412,440,412,392,404,354);cc.bezierCurveTo(396,324,370,308,336,308);cc.bezierCurveTo(352,300,380,300,402,318);
    cc.bezierCurveTo(418,340,424,390,422,440);cc.bezierCurveTo(420,460,416,474,412,486);cc.closePath();};
  ag_soft(c,lin,lining,ag_lt(lining,0.5),400,360,80,rgba(ag_dk(lining,0.4),0.35),8);
  c.save();ag_shape(c,brim);c.clip();c.strokeStyle=rgba(dk,0.22);c.lineWidth=1.4;
  for(let k=1;k<5;k++){const f=k/5;c.beginPath();c.moveTo(lerp(254,278,f),lerp(502,494,f));c.bezierCurveTo(lerp(226,270,f),lerp(452,444,f),lerp(218,268,f),lerp(372,396,f),lerp(236,274,f),lerp(320,356,f));
    c.bezierCurveTo(lerp(254,280,f),lerp(274,326,f),lerp(312,302,f),lerp(258,308,f),lerp(362,336,f),lerp(264,308,f));c.stroke();}c.restore();
  c.strokeStyle=rgba(ribbon,1);c.lineWidth=9;c.lineCap="round";c.beginPath();c.moveTo(266,496);c.bezierCurveTo(280,526,300,544,322,548);c.stroke();
  const bow=cc=>{cc.moveTo(322,548);cc.bezierCurveTo(306,534,290,540,296,552);cc.bezierCurveTo(300,558,314,556,322,548);cc.closePath();cc.moveTo(322,548);cc.bezierCurveTo(338,532,354,538,350,550);cc.bezierCurveTo(346,557,332,556,322,548);cc.closePath();};
  ag_soft(c,bow,ribbon,ag_lt(ribbon,0.35),330,540,24,rgba(ag_dk(ribbon,0.5),0.4),4);
  c.fillStyle=rgba(ag_dk(ribbon,0.2),1);c.beginPath();c.arc(322,549,4.5,0,TAU);c.fill();};}
// a shawl over both shoulders, each side hanging down in front with a darker woven border along its edge; under it, the gown's small white collar
const BR_SHAWL={near:cc=>{cc.moveTo(232,564);cc.bezierCurveTo(250,590,268,604,290,612);cc.bezierCurveTo(286,700,276,800,264,900);cc.bezierCurveTo(258,960,254,1030,252,1100);
    cc.lineTo(96,1100);cc.bezierCurveTo(70,1000,58,880,58,780);cc.bezierCurveTo(58,700,90,640,134,606);cc.bezierCurveTo(164,586,200,572,232,564);cc.closePath();},
  far:cc=>{cc.moveTo(350,606);cc.bezierCurveTo(390,610,428,628,452,660);cc.bezierCurveTo(470,690,474,740,472,800);cc.bezierCurveTo(470,900,462,1000,458,1100);
    cc.lineTo(336,1100);cc.bezierCurveTo(338,960,340,820,344,700);cc.bezierCurveTo(346,660,348,630,350,606);cc.closePath();}};
function br_shawl(col,border,collar){return(c,P)=>{const lt=ag_lt(col,0.35),dk=ag_dk(col,0.5);
  ag_soft(c,cc=>{cc.moveTo(236,570);cc.bezierCurveTo(262,604,316,620,358,606);cc.lineTo(360,622);cc.bezierCurveTo(312,640,256,622,232,588);cc.closePath();},collar,ag_lt(collar,0.6),330,610,60,rgba(ag_dk(collar,0.4),0.3),4);
  for(const k of ["far","near"]){const f=BR_SHAWL[k];ag_soft(c,f,col,lt,k==="far"?470:200,660,260,rgba(dk,0.45),18);
    ag_folds(c,f,k==="near"?[[[120,660],[110,780],[120,900]],[[200,640],[214,760],[220,900]]]:[[[420,660],[440,780],[440,920]],[[380,640],[392,760],[396,900]]],rgba(dk,0.45),rgba(lt,0.3));
    c.save();ag_shape(c,f);c.clip();c.strokeStyle=rgba(border,1);c.lineWidth=26;c.beginPath();
    if(k==="near"){c.moveTo(290,612);c.bezierCurveTo(286,700,276,800,264,900);c.bezierCurveTo(258,960,254,1030,252,1100);}
    else{c.moveTo(350,606);c.bezierCurveTo(348,630,346,660,344,700);c.bezierCurveTo(340,820,338,960,336,1100);}c.stroke();
    // two fine light lines woven along the border
    c.strokeStyle=rgba(ag_lt(border,0.4),0.7);c.lineWidth=1.6;for(const d of [3,8]){const s2=k==="near"?-d:d;c.beginPath();
      if(k==="near"){c.moveTo(290+s2,612);c.bezierCurveTo(286+s2,700,276+s2,800,264+s2,900);c.bezierCurveTo(258+s2,960,254+s2,1030,252+s2,1100);}
      else{c.moveTo(350+s2,606);c.bezierCurveTo(348+s2,630,346+s2,660,344+s2,700);c.bezierCurveTo(340+s2,820,338+s2,960,336+s2,1100);}c.stroke();}c.restore();}};}
const BR_P={
  member:{key:"br_member",name:"a member of parliament",skin:[228,192,162],hair:{style:"side",c:[204,200,194]},top:{kind:"suit",c:[104,56,56],inner:[204,178,128]},
    hat:{paint:br_queue([30,28,30])},over:br_neckwear({cloth:[244,240,232],frill:[246,242,234],btn:[214,186,120],low:true}),overBox:[226,480,372,852],breath:0.24},
  sister:{key:"br_sister",name:"his sister",skin:[238,206,182],hair:{style:"side",c:[104,74,54]},top:{kind:"tunic",c:[150,114,112]},
    hat:{paint:br_mobcap([244,242,236],[176,150,140])},over:br_kerchief([242,238,230]),overBox:[70,550,462,866],breath:0.3},
  clerk:{key:"br_clerk",name:"a clerk of the letter office",skin:[214,176,144],hair:{style:"side",c:[74,56,44]},glasses:[70,62,52],top:{kind:"suit",c:[58,58,60],inner:[150,128,92]},
    over:br_neckwear({cloth:[34,32,36],shirt:[240,236,228],btn:[96,84,64]}),overBox:[226,480,372,852],breath:0.27},
  sender:{key:"br_sender",name:"a woman who posts a letter",skin:[226,190,158],hair:{style:"bob",c:[78,54,40]},top:{kind:"tunic",c:[62,58,70]},
    hat:{paint:br_bonnet([214,192,146],[234,224,204],[128,78,80])},over:br_shawl([176,154,120],[118,74,62],[240,236,228]),overBox:[50,555,478,1108],breath:0.29}
};

/* ---------------------------------------------------------------- things of 1837 and 1840 */
// Rowland Hill's pamphlet: a printed title page, at (x, y), w wide
function br_pamphlet(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*1.36;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||-0.03);
  if(o.k!=null){const k=lerp(0.6,1,o.k);ctx.scale(k,k);}ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(30,16,6,0.45)";ctx.shadowBlur=30;ctx.shadowOffsetX=-10;ctx.shadowOffsetY=14;ctx.fillStyle=rgba(mix(BR_OLD.paper,[255,255,255],0.2),1);ctx.fillRect(0,0,w,h);ctx.restore();
  const g=ctx.createRadialGradient(w/2,h/2,h*0.3,w/2,h/2,h*0.8);g.addColorStop(0,"rgba(180,150,100,0)");g.addColorStop(1,"rgba(180,150,100,0.22)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(60,44,30,0.6)";ctx.lineWidth=2;ctx.strokeRect(24,24,w-48,h-48);ctx.strokeRect(30,30,w-60,h-60);
  const ink=[44,34,28];ag_T(ctx,"POST OFFICE",w/2,h*0.25,{w:800,size:44,align:"center",col:ink,ls:3});ag_T(ctx,"REFORM",w/2,h*0.25+58,{w:800,size:52,align:"center",col:ink,ls:5});
  ctx.fillStyle=rgba(ink,0.7);ctx.fillRect(w*0.3,h*0.25+92,w*0.4,2);
  ag_T(ctx,"its importance and",w/2,h*0.25+150,{w:600,size:30,align:"center",col:ink});ag_T(ctx,"practicability",w/2,h*0.25+192,{w:600,size:30,align:"center",col:ink});
  ag_T(ctx,"by Rowland Hill",w/2,h*0.68,{w:700,size:32,align:"center",col:ink});ag_T(ctx,"1837",w/2,h*0.84,{w:700,size:32,align:"center",col:ink,ls:3});ctx.restore();}
// the post office's notice of 1840, on the wall at (x, y): its lines come in one by one (o.p 0 to 1)
function br_notice(ctx,o){o=o||{};const N=BR_OFFICE.notice,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(30,16,6,0.35)";ctx.shadowBlur=20;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=10;ctx.fillStyle=rgba(mix(BR_OLD.paper,[255,255,255],0.25),1);ctx.fillRect(N.x,N.y,N.w,N.h);ctx.restore();
  ctx.strokeStyle="rgba(60,44,30,0.55)";ctx.lineWidth=2;ctx.strokeRect(N.x+14,N.y+14,N.w-28,N.h-28);const ink=[44,34,28],cx=N.x+N.w/2,p=o.p==null?1:o.p,L=(i)=>clamp(p*5-i,0,1);
  ag_T(ctx,"UNIFORM",cx,N.y+72,{w:800,size:34,align:"center",col:ink,ls:3,a:L(0)});ag_T(ctx,"PENNY POST",cx,N.y+116,{w:800,size:34,align:"center",col:ink,ls:3,a:L(0)});
  ag_T(ctx,"from 10 January 1840",cx,N.y+176,{w:600,size:28,align:"center",col:ink,a:L(1)});
  ag_T(ctx,"One penny",cx,N.y+250,{w:800,size:40,align:"center",col:BR_OLD.red,a:L(2)});ag_T(ctx,"a letter, anywhere",cx,N.y+292,{w:600,size:28,align:"center",col:ink,a:L(3)});
  ag_T(ctx,"paid by the sender",cx,N.y+364,{w:700,size:30,align:"center",col:ink,a:L(4)});ctx.restore();}
// a penny: a dark copper coin, seen from above
function br_coin(ctx,x,y,r,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x-4,y+6,r*1.1,r*0.5,0.4);
  ag_soft(ctx,cc=>cc.arc(x,y,r,0,TAU),[134,82,52],[230,170,120],x+r*0.3,y-r*0.4,r*1.2,"rgba(40,10,0,0.5)",6);
  ctx.strokeStyle="rgba(70,36,16,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r*0.8,0,TAU);ctx.stroke();
  ctx.fillStyle="rgba(70,36,16,0.45)";ctx.beginPath();ctx.ellipse(x-2,y,r*0.32,r*0.42,0,0,TAU);ctx.fill();ctx.restore();}
// letters in a pile, seen from the front, at (x, y) its bottom middle, w wide, n (0 to 1 of max) high; o.free: franked (a dark name on each)
function br_pile(ctx,x,y,w,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||n<=0)return;const R=ag_rnd(o.seed||5),m=Math.round((o.max||22)*n),lh=o.lh||14;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x-6,y+6,w*0.56,18,0.35);
  for(let i=0;i<m;i++){const dx=(R()-0.5)*w*0.12,rot=(R()-0.5)*0.05,yy=y-i*lh;ctx.save();ctx.translate(x+dx,yy);ctx.rotate(rot);
    ctx.fillStyle=rgba(mix(BR_OLD.paper,BR_OLD.paperDk,R()*0.7),1);ctx.fillRect(-w/2,-lh+1,w,lh-1);ctx.fillStyle="rgba(90,70,40,0.35)";ctx.fillRect(-w/2,-1,w,1.5);
    if(o.free){ctx.fillStyle=rgba(BR_OLD.ink,0.55);ctx.fillRect(-w/2+14,-lh+4,w*0.28,2.4);}ctx.restore();}ctx.restore();}
