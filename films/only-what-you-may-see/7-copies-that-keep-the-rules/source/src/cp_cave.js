/* ===== Copies that keep the rules: the opening's places, Lascaux by night =====
   The film's own pictures, prefixed cp_, in the module's Night glass light (the kit is used as it is: films/locks-before-the-data/shared/).
   Three places, each painted once (kit.js: AG_PLACES), in well under 2 s:
     cpHill   the hill at night, cut away like a drawing in a guidebook, so we see inside it: the cave on the left, down a passage from
              its entrance; Lascaux II's place on the right of the same hill. What changes (the light inside, the door, the visitors'
              lamps, Lascaux II's concrete shell) is drawn live over it.
     cpWall   the cave's painted wall, close, lit from below by the lamps: a bull, a horse and a stag
     cpWall2  Lascaux II's wall, the same rock in concrete: the painters draw the same animals on it, stroke by stroke (drawn live)
   The animals are the film's own simple outlines, in the way the cave's painters worked (a dark line that tapers, a wash of ochre), never
   traced from photographs of the panels. The algae are a dull olive, never the module's green of allowed; the crystals a chalky white.
   No person is drawn in the opening: the visitors are their lamps, and André Malraux a name on a card. */

/* ---------------------------------------------------------------- the animals: strokes [x0,y0, x1,y1, x2,y2, x3,y3, w0,w1] */
// a bull, facing left: a long head held low, its horns curving forward, a notch at the throat; the hump of its shoulders high over
// the forelegs, a back that falls to the rump, a deep chest, and short strong legs, painted solid as the cave's painters painted them
const CP_BULL={w:520,h:340,ink:[24,18,16],wash:[100,42,28],washA:0.36,
  fill:"M24,176 C16,166 14,152 20,144 C36,122 64,98 96,86 C130,60 168,30 212,28 C280,30 330,50 400,58 C440,62 470,70 488,88 C506,110 504,160 486,192 C440,204 400,212 360,214 C300,218 230,232 178,228 C150,224 128,200 108,168 C100,156 96,150 92,146 C70,158 46,174 24,176 Z",
  dark:"M24,176 C16,166 14,152 20,144 C36,122 64,98 96,86 C130,60 168,30 212,28 C218,90 208,170 186,228 C150,224 128,200 108,168 C100,156 96,150 92,146 C70,158 46,174 24,176 Z",
  s:[[24,176, 16,166, 14,152, 20,144, 9,10],[20,144, 36,122, 64,98, 96,86, 10,11],[96,86, 130,60, 168,30, 212,28, 11,14],[212,28, 280,30, 330,50, 400,58, 14,11],
     [400,58, 440,62, 470,70, 488,88, 11,10],[488,88, 506,110, 504,160, 486,192, 10,9],[486,192, 440,204, 400,212, 360,214, 9,10],[360,214, 300,218, 230,232, 178,228, 10,12],
     [178,228, 150,224, 128,200, 108,168, 12,9],[108,168, 100,156, 96,150, 92,146, 8,7],[92,146, 70,158, 46,174, 24,176, 7,6],
     [94,88, 104,56, 88,24, 54,14, 14,3],[110,80, 128,48, 118,14, 88,0, 11,2],
     [176,230, 178,266, 166,298, 170,330, 18,8],[214,234, 218,266, 212,294, 218,322, 15,7],[462,202, 482,244, 458,286, 470,330, 18,8],[430,214, 444,248, 426,288, 436,322, 15,7],
     [494,104, 512,140, 516,200, 506,252, 6,2],[212,32, 218,90, 208,170, 186,226, 6,2]],
  eye:[72,114]};
// a horse, facing right: a round belly on short legs, a thick neck with an upright mane, a small head reaching forward, a long tail
const CP_HORSE={w:420,h:260,ink:[28,20,16],wash:[204,146,60],washA:0.62,
  fill:"M60,70 C110,80 170,78 230,64 C258,48 284,30 318,18 C346,30 376,52 392,74 C400,86 396,98 380,100 C362,98 344,90 330,80 C310,104 292,124 280,140 C274,152 268,160 262,168 C210,206 120,204 80,174 C52,150 44,96 60,70 Z",
  dark:"M230,64 C258,48 284,30 318,18 C346,30 376,52 392,74 C400,86 396,98 380,100 C362,98 344,90 330,80 C310,104 292,124 280,140 C270,110 254,84 230,64 Z",
  s:[[56,74, 30,90, 18,150, 24,206, 12,3],[60,70, 110,80, 170,78, 230,64, 11,10],[230,64, 258,48, 284,30, 318,18, 11,9],[318,18, 346,30, 376,52, 392,74, 9,8],
     [392,74, 402,86, 396,100, 380,100, 8,6],[380,100, 362,98, 344,90, 330,80, 6,7],[330,80, 310,104, 292,124, 280,140, 8,9],[280,140, 274,152, 268,160, 262,168, 9,9],
     [262,168, 210,206, 120,204, 80,174, 11,10],[80,174, 52,150, 44,96, 60,70, 10,10],
     [84,176, 92,208, 78,228, 82,252, 14,6],[110,190, 114,214, 104,230, 108,248, 12,5],[256,172, 262,202, 254,226, 260,252, 14,6],[236,184, 240,208, 234,228, 238,248, 12,5],
     [312,22, 312,6, 318,-6, 330,6, 6,3],[300,26, 298,14, 300,6, 304,-2, 6,2],[284,34, 282,22, 284,14, 288,6, 6,2],[268,44, 266,32, 268,24, 272,16, 6,2],
     [252,52, 250,40, 252,32, 256,24, 6,2],[238,60, 236,50, 238,42, 242,36, 6,2]],
  eye:[352,48]};
// a stag, facing right: a slender body on long legs, a raised neck, a small head and wide antlers
const CP_STAG={w:350,h:320,ink:[26,18,16],wash:[166,74,44],washA:0.5,
  fill:"M60,150 C120,140 190,140 230,138 C250,120 270,98 286,84 C304,90 322,104 334,118 C332,128 322,130 312,126 C300,122 290,116 282,108 C270,130 258,152 246,172 C200,196 130,198 88,186 C66,188 54,176 52,156 C54,152 58,150 60,150 Z",
  dark:"M286,84 C304,90 322,104 334,118 C332,128 322,130 312,126 C300,122 290,116 282,108 Z",
  s:[[60,150, 120,140, 190,140, 230,138, 9,8],[230,138, 250,120, 270,98, 286,84, 8,7],[286,84, 304,90, 322,104, 334,118, 6,5],[334,118, 334,128, 322,131, 312,126, 5,5],
     [312,126, 300,122, 290,116, 282,108, 5,6],[282,108, 270,130, 258,152, 246,172, 8,8],[246,176, 200,196, 130,198, 88,186, 9,8],[60,150, 48,152, 44,160, 48,172, 6,3],
     [52,156, 54,176, 66,188, 80,192, 8,7],[70,190, 76,228, 70,262, 74,300, 6,3],[92,192, 98,228, 93,262, 96,296, 5,3],[244,176, 248,220, 244,262, 248,300, 6,3],
     [226,184, 230,222, 226,262, 229,296, 5,3],[290,84, 276,50, 256,22, 232,0, 7,2],[283,66, 296,50, 304,38, 314,24, 5,1.5],[272,44, 282,26, 288,14, 292,-2, 5,1.5],
     [260,28, 254,10, 252,-2, 256,-14, 4,1.5],[296,86, 304,52, 296,24, 282,0, 6,2],[300,62, 314,50, 324,42, 334,32, 4,1.5],[290,86, 276,74, 266,74, 278,92, 5,3]],
  eye:[306,98]};
// where each animal stands on the wall (the bull large across the vault, the horse lower left, the stag to the right), as [x, y, scale]
const CP_FRIEZE=[[CP_BULL,600,200,1.34],[CP_HORSE,150,450,1.0],[CP_STAG,1380,300,1.12]];

/* ---------------------------------------------------------------- drawing strokes, whole or in part */
// the first part (0 to u) of a cubic, as eight numbers
function cp_part(p,u){const L=(a,b)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)],P0=[p[0],p[1]],P1=[p[2],p[3]],P2=[p[4],p[5]],P3=[p[6],p[7]];
  const a=L(P0,P1),b=L(P1,P2),c=L(P2,P3),d=L(a,b),e=L(b,c),f=L(d,e);return[P0[0],P0[1],a[0],a[1],d[0],d[1],f[0],f[1]];}
// one animal, its strokes drawn up to p (0 to 1: stroke by stroke, the stroke being drawn in part); wash (0 to 1) the colour laid after
function cp_animal(c,A,x,y,k,o){o=o||{};const p=o.p==null?1:o.p,wash=o.wash==null?1:o.wash,ink=o.ink||A.ink,n=A.s.length;c.save();c.translate(x,y);c.scale(k,k);
  if(wash>0){c.save();const f=new Path2D(A.fill);c.globalAlpha*=A.washA*wash;c.fillStyle=rgba(A.wash,1);c.fill(f);if(A.dark){c.globalAlpha=c.globalAlpha*0.9;c.fillStyle=rgba(mix(A.wash,ink,0.55),1);c.fill(new Path2D(A.dark));}c.restore();}
  const m=p*n;for(let i=0;i<n;i++){const u=clamp(m-i,0,1);if(u<=0)break;const s=A.s[i],q=u>=1?s.slice(0,8):cp_part(s,u);
    ag_taper(c,[q[0],q[1]],[q[2],q[3]],[q[4],q[5]],[q[6],q[7]],s[8],lerp(s[8],s[9],u),rgba(ink,o.inkA==null?0.9:o.inkA));}
  if(p>=1&&A.eye){c.fillStyle=rgba(ink,0.9);c.beginPath();c.arc(A.eye[0],A.eye[1],4.2,0,TAU);c.fill();}
  c.restore();}
// the frieze, every animal; p runs across them one after another (the painters' order: the bull, the horse, the stag)
function cp_frieze(c,o){o=o||{};const p=o.p==null?1:o.p,N=CP_FRIEZE.length;CP_FRIEZE.forEach(([A,x,y,k],i)=>{const u=clamp(p*N-i,0,1);if(u<=0)return;
  cp_animal(c,A,x+(o.dx||0),y+(o.dy||0),k*(o.k||1),{p:u,wash:o.wash==null?(u>=1?1:0):o.wash*(u>=1?1:0),inkA:o.inkA});});}

/* ---------------------------------------------------------------- the rock: soft noise, painted small and drawn up */
function cp_noise(seed,w,h,n){const R=ag_rnd(seed),c=mkCanvas(w,h),x=c.getContext("2d");const img=x.createImageData(w,h),d=img.data;
  for(let i=0;i<w*h;i++){const v=R();d[i*4]=d[i*4+1]=d[i*4+2]=Math.round(v*255);d[i*4+3]=255;}x.putImageData(img,0,0);return c;}
// rock from three sizes of noise, light from (lx, ly): base colours lo (in the dark) to hi (in the light)
function cp_rock(c,o){const R=ag_rnd(o.seed||3);c.fillStyle=rgba(o.lo,1);c.fillRect(0,0,W,H);
  const lg=c.createRadialGradient(o.lx,o.ly,40,o.lx,o.ly,o.lr);lg.addColorStop(0,rgba(o.hi,1));lg.addColorStop(0.55,rgba(mix(o.hi,o.lo,0.45),1));lg.addColorStop(1,rgba(o.lo,1));
  c.fillStyle=lg;c.fillRect(0,0,W,H);
  c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";
  for(const [sz,a] of [[[24,14],0.20],[[64,36],0.14],[[192,108],0.10]]){const nz=cp_noise((o.seed||3)*7+sz[0],sz[0],sz[1]);c.globalAlpha=a;c.globalCompositeOperation="overlay";c.drawImage(nz,0,0,W,H);}
  c.restore();
  // bumps of the rock: soft lit tops and shaded undersides
  for(let i=0;i<70;i++){const x=R()*W,y=R()*H*0.9,r=30+R()*110;c.save();c.globalAlpha=0.10+R()*0.08;
    const g=c.createRadialGradient(x-r*0.2,y-r*0.3,0,x,y,r);g.addColorStop(0,"rgba(255,236,206,0.55)");g.addColorStop(0.6,"rgba(255,236,206,0)");g.addColorStop(0.85,"rgba(20,12,8,0.15)");g.addColorStop(1,"rgba(20,12,8,0)");
    c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
  // cracks: fine dark lines, a lighter edge beside each
  c.save();c.lineCap="round";for(let i=0;i<9;i++){const x=R()*W,y=R()*H*0.85,dx=(R()-0.5)*420,dy=(R()-0.2)*160;c.beginPath();c.moveTo(x,y);
    c.bezierCurveTo(x+dx*0.3+(R()-0.5)*80,y+dy*0.3+(R()-0.5)*60,x+dx*0.7+(R()-0.5)*80,y+dy*0.7+(R()-0.5)*60,x+dx,y+dy);c.strokeStyle="rgba(30,18,12,0.22)";c.lineWidth=1.2+R()*1.4;c.stroke();
    c.translate(0,2);c.strokeStyle="rgba(255,236,206,0.07)";c.stroke();c.translate(0,-2);}c.restore();}
// the dark round a lit wall: the vault falling into shadow at the top, the floor at the foot, and the corners (where the kicker's words go)
function cp_vault(c,o){o=o||{};let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(6,8,10,0.92)");g.addColorStop(0.16,"rgba(6,8,10,0.45)");g.addColorStop(0.34,"rgba(6,8,10,0)");
  g.addColorStop(0.74,"rgba(6,8,10,0)");g.addColorStop(0.9,"rgba(6,8,10,0.6)");g.addColorStop(1,"rgba(6,8,10,0.92)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(140,90,0,140,90,760);g.addColorStop(0,"rgba(5,8,10,0.94)");g.addColorStop(0.45,"rgba(5,8,10,0.78)");g.addColorStop(1,"rgba(5,8,10,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const v=c.createRadialGradient(W/2,H*0.5,H*0.42,W/2,H*0.5,W*0.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.6)");c.fillStyle=v;c.fillRect(0,0,W,H);}

/* ---------------------------------------------------------------- the places */
// the cave's wall: pale limestone in the lamps' warm light, the frieze painted on it
AG_PLACES.cpWall=c=>{cp_rock(c,{seed:5,lo:[40,30,24],hi:[214,186,146],lx:980,ly:620,lr:1050});cp_frieze(c,{});cp_vault(c);};
// what a card's glass shows of the lit wall: the wall, dimmed, so the words on a card over it stand out 4.5 to 1 (behind:"cpWallDim")
AG_PLACES.cpWallDim=c=>{c.drawImage(dp_place0("cpWall"),0,0);c.fillStyle="rgba(5,12,14,0.4)";c.fillRect(0,0,W,H);};
// Lascaux II's wall: the same rock, cast in concrete, a cooler grey, with the joins of its shells; the animals are drawn on it live
AG_PLACES.cpWall2=c=>{cp_rock(c,{seed:5,lo:[34,32,30],hi:[192,180,160],lx:980,ly:620,lr:1050});
  c.save();c.strokeStyle="rgba(30,26,24,0.35)";c.lineWidth=2;for(const x of [470,1180,1700]){c.beginPath();c.moveTo(x,0);c.bezierCurveTo(x+30,300,x-20,640,x+12,H);c.stroke();}
  c.strokeStyle="rgba(255,240,220,0.10)";c.lineWidth=1.4;for(const x of [473,1183,1703]){c.beginPath();c.moveTo(x,0);c.bezierCurveTo(x+30,300,x-20,640,x+12,H);c.stroke();}c.restore();cp_vault(c);};

// the hill, cut away: sky, a line of trees, the hill's earth in layers, the cave inside it on the left and the passage to its entrance
const CP_CAVE="M300,612 C318,560 380,520 470,516 C560,500 640,512 700,530 C740,540 770,560 800,566 C850,572 900,586 930,610 C944,630 936,650 914,656 C870,664 820,664 780,668 C740,690 700,720 640,728 C560,740 470,736 400,722 C340,712 300,690 292,660 C288,640 292,626 300,612 Z";
const CP_PASS="M168,484 C206,516 250,556 300,598 L300,640 C250,596 206,556 160,516 Z";
// Lascaux II: the same hall and gallery, moved right along the hill, with a passage of its own up from the gallery's end
const CP_COPY={dx:830,dy:6},CP_PASS2="M1742,636 C1772,596 1798,556 1822,502 L1852,514 C1828,568 1800,612 1764,660 Z";
const CP_HILL_TOP=[[-40,520],[120,500],[200,470],[330,412],[560,372],[860,352],[1140,358],[1420,380],[1640,420],[1760,470],[1860,520],[1960,560]];
function cp_hillPath(c){c.beginPath();c.moveTo(-40,H+40);c.lineTo(CP_HILL_TOP[0][0],CP_HILL_TOP[0][1]);for(let i=1;i<CP_HILL_TOP.length;i++){const a=CP_HILL_TOP[i-1],b=CP_HILL_TOP[i];
  c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}const L=CP_HILL_TOP[CP_HILL_TOP.length-1];c.lineTo(L[0],L[1]);c.lineTo(W+40,H+40);c.closePath();}
AG_PLACES.cpHill=c=>{const R=ag_rnd(11);let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(5,12,18)");g.addColorStop(0.55,"rgb(14,34,42)");g.addColorStop(1,"rgb(10,24,30)");c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<140;i++){const x=R()*W,y=R()*560,r=0.6+R()*1.6;c.fillStyle="rgba(200,236,240,"+(0.18+R()*0.5).toFixed(2)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  const mg=c.createRadialGradient(1640,150,0,1640,150,420);mg.addColorStop(0,"rgba(150,210,220,0.16)");mg.addColorStop(1,"rgba(150,210,220,0)");c.fillStyle=mg;c.fillRect(1200,0,720,600);
  // far hills, then the trees on the hill's top
  c.fillStyle="rgb(11,26,32)";c.beginPath();c.moveTo(0,520);c.bezierCurveTo(300,430,700,470,960,440);c.bezierCurveTo(1300,410,1600,470,1920,430);c.lineTo(1920,700);c.lineTo(0,700);c.fill();
  c.save();for(let i=0;i<44;i++){const x=-20+i*46+R()*20,t=CP_HILL_TOP,yb=(()=>{for(let j=1;j<t.length;j++)if(x<=t[j][0]){const u=(x-t[j-1][0])/(t[j][0]-t[j-1][0]);return lerp(t[j-1][1],t[j][1],u);}return 560;})(),h=40+R()*70,w=h*(0.5+R()*0.3);
    c.fillStyle="rgb(9,20,24)";c.beginPath();c.moveTo(x-w/2,yb+6);c.bezierCurveTo(x-w*0.6,yb-h*0.6,x-w*0.2,yb-h,x,yb-h);c.bezierCurveTo(x+w*0.2,yb-h,x+w*0.6,yb-h*0.6,x+w/2,yb+6);c.fill();}c.restore();
  // the hill: earth in layers, darker as it goes down, its top edge in the moon's cool light
  c.save();cp_hillPath(c);c.clip();g=c.createLinearGradient(0,340,0,H);g.addColorStop(0,"rgb(40,44,40)");g.addColorStop(0.3,"rgb(34,32,28)");g.addColorStop(1,"rgb(16,16,16)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.strokeStyle="rgba(120,110,90,0.10)";c.lineWidth=2;for(let j=0;j<9;j++){const y=430+j*62;c.beginPath();c.moveTo(-20,y+R()*20);for(let x=0;x<=W+40;x+=120)c.lineTo(x,y+Math.sin(x/260+j)*14+R()*8);c.stroke();}
  for(let i=0;i<160;i++){const x=R()*W,y=400+R()*700,r=2+R()*7;c.fillStyle="rgba(70,64,54,"+(0.15+R()*0.2).toFixed(2)+")";c.beginPath();c.ellipse(x,y,r*1.6,r,R()*3,0,TAU);c.fill();}
  // the cave and its passage: a hollow in the rock, dark until the lamps light it
  for(const P of [CP_CAVE,CP_PASS]){const p=new Path2D(P);c.fillStyle="rgb(8,8,9)";c.fill(p);c.strokeStyle="rgba(150,136,110,0.35)";c.lineWidth=3;c.stroke(p);}
  c.restore();
  c.save();cp_hillPath(c);c.strokeStyle="rgba(170,220,224,0.45)";c.lineWidth=2.4;c.shadowColor="rgba(170,220,224,0.6)";c.shadowBlur=10;c.stroke();c.restore();
  // a cut edge where the drawing opens the hill: a fine line along the section
  c.save();c.setLineDash([2,10]);c.strokeStyle="rgba(170,220,224,0.18)";c.lineWidth=1.5;c.beginPath();c.moveTo(0,1000);c.lineTo(W,1000);c.stroke();c.restore();};

/* ---------------------------------------------------------------- what is drawn live on the hill */
// the light inside the cave (or Lascaux II, with o.copy): warm, a glow through the hollow; a (0 to 1) how lit it is
function cp_caveLight(c,a,o){o=o||{};if(a<=0.001)return;const dx=o.copy?CP_COPY.dx:0,dy=o.copy?CP_COPY.dy:0;c.save();c.translate(dx,dy);const p=new Path2D(CP_CAVE);
  c.save();c.clip(p);c.globalAlpha=a;let g=c.createRadialGradient(580,700,20,580,660,420);g.addColorStop(0,"rgba(255,206,140,0.95)");g.addColorStop(0.5,"rgba(200,140,80,0.7)");g.addColorStop(1,"rgba(80,50,30,0.6)");
  c.fillStyle=g;c.fillRect(260,500,640,280);
  // the frieze inside, small, on the hollow's upper wall
  c.globalAlpha=a*0.85;cp_animal(c,CP_BULL,450,548,0.34,{});cp_animal(c,CP_HORSE,340,606,0.26,{});cp_animal(c,CP_STAG,700,566,0.28,{});c.restore();
  c.save();c.globalCompositeOperation="lighter";c.globalAlpha=a*0.5;g=c.createRadialGradient(580,640,40,580,640,380);g.addColorStop(0,"rgba(255,190,120,0.35)");g.addColorStop(1,"rgba(255,190,120,0)");
  c.fillStyle=g;c.fillRect(200,300,760,640);c.restore();c.restore();}
// Lascaux II's shell, cast in concrete in the hill: drawn on (b 0 to 1, its outline and the shells' ribs), then the hollow
function cp_copyShell(c,b,o){o=o||{};if(b<=0.001)return;
  c.save();c.globalAlpha=ag_in(b,0.3,0.5);const pp=new Path2D(CP_PASS2);c.fillStyle="rgb(9,10,11)";c.fill(pp);c.strokeStyle="rgba(196,200,204,0.6)";c.lineWidth=2.4;c.stroke(pp);c.restore();
  c.save();c.translate(CP_COPY.dx,CP_COPY.dy);const p=new Path2D(CP_CAVE);
  c.save();c.globalAlpha=ag_in(b,0.3,0.5);c.fillStyle="rgb(9,10,11)";c.fill(p);c.restore();
  c.save();c.setLineDash([2000,2000]);c.lineDashOffset=2000*(1-ag_sine(b));c.strokeStyle="rgba(196,200,204,0.85)";c.lineWidth=4;c.shadowColor="rgba(196,200,204,0.5)";c.shadowBlur=8;c.stroke(p);c.restore();
  c.save();c.clip(p);c.globalAlpha=0.5*ag_in(b,0.4,0.5);c.strokeStyle="rgba(196,200,204,0.6)";c.lineWidth=1.4;for(let x=320;x<880;x+=44){c.beginPath();c.moveTo(x,500);c.lineTo(x+20,780);c.stroke();}
  for(let y=540;y<760;y+=40){c.beginPath();c.moveTo(280,y);c.lineTo(900,y+8);c.stroke();}c.restore();c.restore();}
// the cave's door, across its passage's mouth: open (0) to shut (1); shut, it glows the coral of closed, with a lock over it
function cp_door(c,u,o){o=o||{};u=clamp(u,0,1);c.save();const a0=[150,492],a1=[186,462],L=Math.hypot(a1[0]-a0[0],a1[1]-a0[1]),ang=Math.atan2(a1[1]-a0[1],a1[0]-a0[0]);
  c.translate(a0[0],a0[1]);c.rotate(ang+(1-ag_sine(u))*1.25);c.fillStyle="rgb(64,64,66)";c.shadowColor=rgba(DP.F.coral,0.9*ag_in(u,0.75,0.25));c.shadowBlur=16;
  c.fillRect(0,-5,L,10);c.strokeStyle=rgba(DP.F.coral,ag_in(u,0.75,0.25));c.lineWidth=2.4;c.strokeRect(0,-5,L,10);c.restore();
  if(o.lock!==false&&u>0.8)withA(c,ag_in(u,0.8,0.2),()=>dp_lock(c,168,418,40,"coral",0));}
// the visitors' lamps, walking up the hill to an entrance and in: n of them at once, flow (0 to 1) how many come, to (0 the cave, 1 the copy)
const CP_PATHS=[[[-40,524],[40,512],[110,500],[164,488],[214,520],[262,560],[300,620],[400,680],[560,700]],[[1960,566],[1900,540],[1860,522],[1838,508],[1810,560],[1780,610],[1748,650],[1640,660],[1480,680]]];
function cp_along(P,u){const n=P.length-1,f=clamp(u,0,1)*n,i=Math.min(n-1,Math.floor(f)),v=f-i;return[lerp(P[i][0],P[i+1][0],v),lerp(P[i][1],P[i+1][1],v)];}
function cp_lamps(c,t,flow,to,o){o=o||{};if(flow<=0.001)return;const P=CP_PATHS[to?1:0],n=o.n||11;c.save();c.globalCompositeOperation="lighter";
  for(let i=0;i<n;i++){const u=((t*0.06+i/n)%1),pt=cp_along(P,u),inside=u>0.4,a=flow*(inside?1-ag_in(u,0.7,0.28):ag_in(u,0,0.08));if(a<=0.01)continue;
    const g=c.createRadialGradient(pt[0],pt[1]-6,0,pt[0],pt[1]-6,18);g.addColorStop(0,"rgba(255,206,140,"+(0.55*a).toFixed(3)+")");g.addColorStop(1,"rgba(255,180,100,0)");c.fillStyle=g;c.fillRect(pt[0]-18,pt[1]-24,36,36);
    c.fillStyle="rgba(255,236,190,"+(0.95*a).toFixed(3)+")";c.beginPath();c.arc(pt[0],pt[1]-6,3.2,0,TAU);c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- what is drawn live on the wall */
// the lamps' warm light, swaying a little as the visitors move: a (0 to 1)
function cp_wallLight(c,t,a){if(a<=0.001)return;c.save();c.globalCompositeOperation="lighter";
  for(const [x,y,r,ph] of [[520,980,560,0],[1420,990,620,1.7],[960,1040,700,3.1]]){const s=0.85+0.15*Math.sin(t*0.9+ph),g=c.createRadialGradient(x,y,0,x,y,r*s);
    g.addColorStop(0,"rgba(255,180,100,"+(0.20*a).toFixed(3)+")");g.addColorStop(1,"rgba(255,180,100,0)");c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}c.restore();}
// the visitors' breath, rising in soft wisps and spreading under the vault: a (0 to 1)
function cp_breath(c,t,a){if(a<=0.001)return;const R=ag_rnd(77);c.save();for(let i=0;i<26;i++){const x0=200+R()*1520,sp=0.04+R()*0.05,ph=R(),u=(t*sp+ph)%1,y=lerp(1000,260,u),x=x0+Math.sin(u*5+i)*60,
    r=lerp(30,140,u),al=a*0.16*Math.sin(Math.PI*u);if(al<=0.005)continue;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(236,240,240,"+al.toFixed(3)+")");g.addColorStop(1,"rgba(236,240,240,0)");
    c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}c.restore();}
// the algae (a dull olive, spreading in three waves, g 0 to 1) and the crystals' white crust (w 0 to 1), each painted once and laid over the wall
function cp_algaeLayer(k){return ag_kept("cpAlgae"+k,W,H,(c)=>{const R=ag_rnd(31+k*13),y0=[640,420,200][k],y1=[1000,820,640][k];c.save();
  for(let i=0;i<34;i++){let x=R()*W,y=y0+R()*(y1-y0);const col=[80+R()*26,98+R()*22,54+R()*18],n=26+Math.floor(R()*30);
    for(let j=0;j<n;j++){x+=(R()-0.5)*46;y+=(R()-0.5)*30;const r=8+R()*30,g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,0.34));g.addColorStop(0.6,rgba(col,0.18));g.addColorStop(1,rgba(col,0));
      c.fillStyle=g;c.beginPath();c.ellipse(x,y,r*1.3,r,R()*3,0,TAU);c.fill();
      if(R()<0.35){c.fillStyle=rgba(mix(col,[34,44,24],0.4),0.30);c.beginPath();c.arc(x+(R()-0.5)*r,y+(R()-0.5)*r,2+R()*5,0,TAU);c.fill();}}}c.restore();});}
function cp_crystals(){return ag_kept("cpCrystals",W,H,(c)=>{const R=ag_rnd(97);for(let i=0;i<30;i++){const x=R()*W,y=180+R()*640,r=70+R()*150;
    c.save();c.translate(x,y);c.scale(1.5,0.8);const g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,"rgba(232,230,218,0.34)");g.addColorStop(0.7,"rgba(232,230,218,0.12)");g.addColorStop(1,"rgba(232,230,218,0)");
    c.fillStyle=g;c.fillRect(-r,-r,2*r,2*r);c.restore();
    for(let j=0;j<16;j++){const a=R()*TAU,d=Math.sqrt(R())*r*0.8,s=0.8+R()*1.6;c.fillStyle="rgba(246,244,234,"+(0.28+R()*0.3).toFixed(2)+")";c.beginPath();c.arc(x+Math.cos(a)*d*1.5,y+Math.sin(a)*d*0.8,s,0,TAU);c.fill();}}});}
function cp_harm(c,g,w){for(let k=0;k<3;k++){const a=clamp(g*3-k,0,1);if(a>0){c.save();c.globalAlpha=ag_sine(a);c.drawImage(cp_algaeLayer(k),0,0);c.restore();}}
  if(w>0){c.save();c.globalAlpha=ag_sine(w);c.drawImage(cp_crystals(),0,0);c.restore();}}
// the paintings fading under the harm: a dark veil over the frieze (d 0 to 1)
function cp_dim(c,d){if(d<=0.001)return;c.save();c.globalAlpha=d*0.55;const g=c.createRadialGradient(960,440,100,960,440,900);g.addColorStop(0,"rgb(40,44,30)");g.addColorStop(1,"rgba(20,22,16,0.6)");
  c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();}
