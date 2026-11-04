/* ===== Context engineering: Arezzo about 1025, and Rome a few years later =====
   The film's own places and pictures outside the lab, in the module's matte language, lit from the right as the room is (prefix ce_):
     ceSchool   the cathedral school at Arezzo, about 1025: a Romanesque room of pale stone, a round-arched window on the right, a
                wooden lectern with a great open book (a place, painted once)
     cePage     the open book close up: a page of parchment, its gutter on the left, the ruling for its words (a place)
     ceRome     a room in Rome, about 1028: plastered walls with a painted band, a column, a window on the right, a carved chair (a place)
     ce_chant   a chant's words and the signs above them: before Guido's lines, roughly up or down; after, each on its line or space
     ce_staff   the lines a quill draws across the page, two of them coloured, red for F and yellow for C, each with its letter
     ce_quill   a quill, its nib where it writes
     ce_boyBack a choirboy seen from behind, in a pale linen tunic; ce_sound the soft arcs of a voice, from a mouth to an ear
     ce_book    a chant book on a card, open on its chant, with its master's name
     ce_heldBook the open book a seated reader holds, its pages turning
     CE_PEOPLE  Guido, two masters, Pope John: dressed from pictures of their time, never likenesses
   Nobody's face is a likeness. The chant on the page is an Alleluia drawn for the film, its signs in the shapes of the time. */

const CE_P={stone:[214,204,186],stoneDk:[172,160,140],mortar:[184,172,152],flag:[194,182,162],flagDk:[160,148,128],
  sky:[236,240,234],light:[252,247,232],wood:[146,104,68],woodDk:[96,66,42],woodHi:[198,156,110],
  parch:[238,228,204],parchDk:[214,198,166],ink:[62,44,34],red:[168,46,44],yellow:[216,170,48],
  linen:[234,228,214],black:[50,46,48],plaster:[228,216,194],plasterDk:[192,176,150],ochre:[176,120,74],column:[226,222,212]};

/* ---------------------------------------------------------------- stone, plaster and a round-arched window */
// courses of pale stone between x0 and x1, y0 and y1: blocks of a few sizes, each a little lighter at its top, the mortar between
function ce_stones(c,x0,y0,x1,y1,o){o=o||{};const R=ag_rnd(o.seed||3),rh=o.rh||66,base=o.col||CE_P.stone;
  c.save();c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();c.fillStyle=rgba(CE_P.mortar,1);c.fillRect(x0,y0,x1-x0,y1-y0);
  for(let y=y0,row=0;y<y1;y+=rh,row++){let x=x0-40-R()*90;
    while(x<x1){const w=120+R()*150,tone=(R()-0.5)*16,warm=(R()-0.5)*6,col=[base[0]+tone+warm,base[1]+tone,base[2]+tone-warm];
      const g=c.createLinearGradient(0,y,0,y+rh);g.addColorStop(0,rgba(mix(col,[255,252,244],0.18),1));g.addColorStop(0.5,rgba(col,1));g.addColorStop(1,rgba(mix(col,[90,76,56],0.12),1));
      c.fillStyle=g;rr(c,x+3,y+3,w-6,rh-6,5);c.fill();
      // a chip or two, and the stone's soft mottling
      c.fillStyle=rgba(mix(col,[120,104,80],0.25),0.25);for(let k=0;k<3;k++){c.beginPath();c.ellipse(x+12+R()*(w-24),y+10+R()*(rh-20),6+R()*18,3+R()*7,R()*3,0,TAU);c.fill();}
      x+=w;}}
  ag_grain(c,x0,y0,x1-x0,y1-y0,2.4,o.seed||3);c.restore();}
// a round-arched window from (x, y), w wide and h tall: a splayed reveal in shade, the bright sky, a stone sill
function ce_window(c,x,y,w,h){const r=w/2,m=38;
  const rev=cc=>{cc.moveTo(x-m,y+h+16);cc.lineTo(x-m,y+r);cc.arc(x+r,y+r,r+m,Math.PI,0);cc.lineTo(x+w+m,y+h+16);cc.closePath();};
  ag_soft(c,rev,[176,164,144],[214,204,186],x+w,y+40,260,"rgba(60,48,30,0.4)",22);
  const op=cc=>{cc.moveTo(x,y+h);cc.lineTo(x,y+r);cc.arc(x+r,y+r,r,Math.PI,0);cc.lineTo(x+w,y+h);cc.closePath();};
  ag_shape(c,op);let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(CE_P.sky,1));g.addColorStop(1,rgba(CE_P.light,1));c.fillStyle=g;c.fill();
  // a faint green of hills far off, low in the opening, and the glow of the light
  c.save();ag_shape(c,op);c.clip();c.fillStyle="rgba(168,182,158,0.45)";c.beginPath();c.moveTo(x,y+h*0.82);
  for(let k=0;k<=12;k++){const u=k/12;c.lineTo(x+w*u,y+h*(0.78-0.05*Math.sin(u*5.2+1)));}c.lineTo(x+w,y+h);c.lineTo(x,y+h);c.closePath();c.fill();
  g=c.createRadialGradient(x+r,y+h*0.4,10,x+r,y+h*0.4,h*0.8);g.addColorStop(0,"rgba(255,253,244,0.8)");g.addColorStop(1,"rgba(255,253,244,0)");c.fillStyle=g;c.fillRect(x,y,w,h);c.restore();
  ag_soft(c,cc=>ag_rect(cc,x-m-10,y+h+8,w+2*m+20,26,6),[200,190,170],[236,228,212],x+w,y+h,200,"rgba(60,48,30,0.35)",8);}
// stone flags in perspective from hz to the foot of the frame, their joints running to a point above the middle
function ce_flags(c,hz,o){o=o||{};const R=ag_rnd(o.seed||9);let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(CE_P.flag,1));g.addColorStop(1,rgba(CE_P.flagDk,1));
  c.fillStyle=g;c.fillRect(0,hz,W,H-hz);c.save();c.beginPath();c.rect(0,hz,W,H-hz);c.clip();
  for(let k=1;k<9;k++){const y=hz+(H-hz)*Math.pow(k/9,1.5);c.strokeStyle="rgba(96,82,62,0.22)";c.lineWidth=1+k*0.25;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();
    c.strokeStyle="rgba(255,250,238,0.16)";c.beginPath();c.moveTo(0,y+2);c.lineTo(W,y+2);c.stroke();}
  for(let k=-8;k<=8;k++){const xb=960+k*260+(R()-0.5)*40;c.strokeStyle="rgba(96,82,62,0.18)";c.lineWidth=2;c.beginPath();c.moveTo(960+(xb-960)*0.18,hz);c.lineTo(xb,H);c.stroke();}
  ag_grain(c,0,hz,W,H-hz,2.6,o.seed||9);c.restore();}
// the room's light, over a whole place: warm from the window on the right, soft shade on the left and in the corners
function ce_light(c,wx,wy){let g=c.createRadialGradient(wx,wy,40,wx,wy,1500);g.addColorStop(0,"rgba(255,248,226,0.3)");g.addColorStop(0.5,"rgba(255,248,226,0.08)");g.addColorStop(1,"rgba(255,248,226,0)");
  c.fillStyle=g;c.fillRect(0,0,W,H);g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(46,36,24,0.3)");g.addColorStop(0.45,"rgba(46,36,24,0.06)");g.addColorStop(1,"rgba(46,36,24,0)");
  c.fillStyle=g;c.fillRect(0,0,W,H);g=c.createRadialGradient(960,540,500,960,540,1200);g.addColorStop(0,"rgba(30,24,16,0)");g.addColorStop(1,"rgba(30,24,16,0.24)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the window's light lying across the floor, towards the left
function ce_beam(c,x0,x1,hz,a){c.save();c.beginPath();c.rect(0,hz,W,H-hz);c.clip();const g=c.createLinearGradient(x1,hz,x0-300,H);g.addColorStop(0,"rgba(255,246,222,"+a+")");g.addColorStop(1,"rgba(255,246,222,0)");
  c.fillStyle=g;c.beginPath();c.moveTo(x0,hz);c.lineTo(x1,hz);c.lineTo(x1-520,H);c.lineTo(x0-760,H);c.closePath();c.fill();c.restore();}

/* ---------------------------------------------------------------- the school at Arezzo (painted once)
   The lectern's desk is at CE_SCHOOL.desk; the people stand where CE_SCHOOL puts them (x, y, s for ag_person, and the boys' backs). */
const CE_SCHOOL={hz:690,desk:[640,452],guido:[1250,640,0.96],master:[1250,640,0.96],boys:[[352,862,1.08,[70,50,36],0.2],[702,904,1.12,[44,34,30],-0.1],[1032,872,1.06,[112,78,50],0.12]]};
function ce_lectern(c,x,y){const P=CE_P;
  // the post, turned, and its three feet, mostly hidden by the boys
  ag_soft(c,cc=>ag_rect(cc,x-16,y+40,32,H-y-40,10),P.woodDk,P.woodHi,x+10,y+200,200,"rgba(30,18,8,0.4)",8);
  for(const k of [-1,1]){ag_soft(c,cc=>{cc.moveTo(x,y+380);cc.quadraticCurveTo(x+k*70,y+420,x+k*130,y+470);cc.lineTo(x+k*124,y+484);cc.quadraticCurveTo(x+k*60,y+440,x,y+404);cc.closePath();},P.woodDk,P.wood,x+40,y+420,120,null);}
  // the desk: a slanted board, seen a little from above, its front edge lower
  const desk=cc=>{cc.moveTo(x-230,y+40);cc.lineTo(x+230,y+40);cc.lineTo(x+196,y-36);cc.lineTo(x-196,y-36);cc.closePath();};
  ag_soft(c,desk,P.wood,P.woodHi,x+140,y-20,260,"rgba(30,18,8,0.35)",12);
  ag_soft(c,cc=>ag_rect(cc,x-236,y+38,472,22,6),P.woodDk,P.wood,x+120,y+44,200,null);
  // the book, open on it: two pages bowed up from the spine, a ribbon
  const L=cc=>{cc.moveTo(x-4,y+26);cc.bezierCurveTo(x-70,y+12,x-150,y+20,x-206,y+30);cc.lineTo(x-176,y-40);cc.bezierCurveTo(x-120,y-50,x-50,y-48,x-4,y-30);cc.closePath();},
    Rt=cc=>{cc.moveTo(x+4,y+26);cc.bezierCurveTo(x+70,y+12,x+150,y+20,x+206,y+30);cc.lineTo(x+176,y-40);cc.bezierCurveTo(x+120,y-50,x+50,y-48,x+4,y-30);cc.closePath();};
  ag_soft(c,L,P.parchDk,P.parch,x-60,y-30,160,"rgba(80,60,30,0.3)",10);ag_soft(c,Rt,P.parch,[250,244,226],x+120,y-30,180,"rgba(80,60,30,0.25)",10);
  // a few lines of the chant on each page, too small to read, in ink (Guido's coloured lines come later, drawn live: ce_bookLines)
  for(const s of [-1,1])for(let k=0;k<4;k++){const yy=y-30+k*14;c.strokeStyle=rgba(P.ink,0.3);c.lineWidth=1.4;
    c.beginPath();c.moveTo(x+s*24,yy+6);c.lineTo(x+s*178,yy+2);c.stroke();}
  c.strokeStyle=rgba([150,40,40],0.9);c.lineWidth=4;c.beginPath();c.moveTo(x,y-28);c.quadraticCurveTo(x+6,y+40,x-4,y+90);c.stroke();}
// the lectern's book once Guido's lines are in it: the red line and the yellow, on both pages, over the painted ink; a
function ce_bookLines(c,a){if(a<=0.01)return;const [x,y]=CE_SCHOOL.desk;c.save();c.lineWidth=1.8;
  for(const s of [-1,1])for(const [k,col,al] of [[1,CE_P.red,0.7],[3,CE_P.yellow,0.8]]){const yy=y-30+k*14;c.strokeStyle=rgba(col,al*a);c.beginPath();c.moveTo(x+s*24,yy+6);c.lineTo(x+s*178,yy+2);c.stroke();}
  c.restore();}
AG_PLACES.ceSchool=c=>{const S=CE_SCHOOL,hz=S.hz;
  ce_stones(c,0,0,W,hz,{seed:3});
  // a blind arch on the left wall, in shade, and the window on the right
  c.save();c.globalAlpha=0.55;ag_soft(c,cc=>{cc.moveTo(-40,hz);cc.lineTo(-40,230);cc.arc(150,230,190,Math.PI,0);cc.lineTo(340,hz);cc.closePath();},[170,158,138],[196,186,166],300,200,260,"rgba(50,40,26,0.45)",26);c.restore();
  ce_window(c,1470,120,250,440);
  ce_flags(c,hz,{seed:9});
  // where the wall meets the floor: a stone step, its contact shadow
  ag_soft(c,cc=>ag_rect(cc,-10,hz-18,W+20,24,4),[198,188,168],[226,218,200],1500,hz-10,600,null);
  let g=c.createLinearGradient(0,hz+6,0,hz+80);g.addColorStop(0,"rgba(50,40,26,0.22)");g.addColorStop(1,"rgba(50,40,26,0)");c.fillStyle=g;c.fillRect(0,hz+6,W,74);
  ce_beam(c,1300,1760,hz+6,0.28);
  ag_floorShadow(c,S.desk[0]-20,hz+300,240,40,0.25);ce_lectern(c,S.desk[0],S.desk[1]);
  ce_light(c,1600,300);};

/* ---------------------------------------------------------------- the book close up (painted once)
   One page fills the frame: its gutter on the left, the ruling for one line of words. ce_chant draws the chant on it live. */
const CE_PAGE={x0:150,x1:1790,y0:30,y1:1050,words:700,band:[372,572],line0:572,step:20,x:[300,1700]};
AG_PLACES.cePage=c=>{const P=CE_P,Q=CE_PAGE;
  // the lectern's wood round the page, and the page's soft shadow on it
  let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba(P.woodDk,1));g.addColorStop(1,rgba(P.wood,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.shadowColor="rgba(30,18,8,0.45)";c.shadowBlur=40;c.shadowOffsetX=-10;c.shadowOffsetY=16;c.fillStyle=rgba(P.parch,1);c.fillRect(Q.x0,Q.y0,Q.x1-Q.x0,Q.y1-Q.y0);c.restore();
  // parchment: warm, a little uneven, darker towards the gutter and the edges
  const R=ag_rnd(21);c.save();c.beginPath();c.rect(Q.x0,Q.y0,Q.x1-Q.x0,Q.y1-Q.y0);c.clip();
  for(let i=0;i<70;i++){const x=Q.x0+R()*(Q.x1-Q.x0),y=Q.y0+R()*(Q.y1-Q.y0),r=60+R()*220,cg=c.createRadialGradient(x,y,0,x,y,r);
    cg.addColorStop(0,rgba(R()<0.5?[226,212,182]:[246,238,218],0.35));cg.addColorStop(1,"rgba(240,230,206,0)");c.fillStyle=cg;c.fillRect(x-r,y-r,2*r,2*r);}
  g=c.createLinearGradient(Q.x0,0,Q.x0+260,0);g.addColorStop(0,"rgba(90,64,34,0.42)");g.addColorStop(1,"rgba(90,64,34,0)");c.fillStyle=g;c.fillRect(Q.x0,Q.y0,260,Q.y1-Q.y0);
  g=c.createLinearGradient(0,Q.y0,0,Q.y0+90);g.addColorStop(0,"rgba(120,90,50,0.18)");g.addColorStop(1,"rgba(120,90,50,0)");c.fillStyle=g;c.fillRect(Q.x0,Q.y0,Q.x1-Q.x0,90);
  // the scribe's ruling, scored faintly, and the pricking down the margin
  c.strokeStyle="rgba(150,120,80,0.2)";c.lineWidth=1.2;for(const y of [Q.words+12,Q.words-64,250,190,880,940]){c.beginPath();c.moveTo(Q.x0+170,y);c.lineTo(Q.x1-60,y);c.stroke();}
  c.fillStyle="rgba(120,90,60,0.3)";for(let y=150;y<1000;y+=62){c.beginPath();c.arc(Q.x1-28,y,2.2,0,TAU);c.fill();}
  // the chant before this one: a last few words and signs at the top, too far off to read, and the next below
  c.fillStyle=rgba(P.ink,0.5);for(const [y,n] of [[190,9],[944,7]])for(let k=0;k<n;k++){const x=Q.x0+190+k*150+R()*40,w=60+R()*60;rr(c,x,y-14,w,16,6);c.fill();
    for(let j=0;j<2;j++){c.beginPath();c.ellipse(x+10+R()*w,y-58-R()*30,6,4.5,-0.5,0,TAU);c.fill();}}
  ag_grain(c,Q.x0,Q.y0,Q.x1-Q.x0,Q.y1-Q.y0,2.2,21);c.restore();
  c.strokeStyle="rgba(120,90,50,0.35)";c.lineWidth=2;c.strokeRect(Q.x0,Q.y0,Q.x1-Q.x0,Q.y1-Q.y0);};

/* ---------------------------------------------------------------- the chant and its signs
   The Alleluia drawn for the film: its syllables, and over each the signs of its notes, given as steps of the staff (0 the bottom line,
   F; 1 the space above, G; 2 the next line, A; 4 the third line, C; 6 the top line, E). ce_chant(ctx, o): o.lines 0 to 1 settles every
   sign onto its line or space (o.settle, an array, one value per sign, overrides it); before that, each floats at a rough height, up or
   down from the one before but not how far; o.a; o.mark (0 to 1) rings one sign in amber, with two dotted guesses of where it goes. */
const CE_CHANT=[{syl:"Al",x:330,ps:[2]},{syl:"le",x:600,ps:[3,4]},{syl:"lu",x:860,ps:[4]},{syl:"ia",x:1100,ps:[5,4,3,4,2,3,2],melisma:600}];
// where each sign sits: rough (before the lines) and exact (on them)
function ce_signs(){const Q=CE_PAGE,out=[];let prev=null;const R=ag_rnd(5);
  for(const s of CE_CHANT){const n=s.ps.length;s.ps.forEach((p,i)=>{const x=s.melisma?s.x+i*s.melisma/(n-1):s.x+i*34,exact=Q.line0-p*Q.step;
      // before: up or down from the one before, by a rough amount, so the voice's way shows but not how far
      const rough=prev==null?Q.line0-60:prev.rough-(p-prev.p)*7-(R()-0.5)*10;out.push({x,p,exact,rough,first:i===0,syl:s});prev={p,rough};});}
  return out;}
const CE_SIGNS=ce_signs();
function ce_chant(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const Q=CE_PAGE,P=CE_P,set=o.lines||0;ctx.save();ctx.globalAlpha*=a;
  // the words, in brown ink, under their signs
  for(const s of CE_CHANT)ag_T(ctx,s.syl,s.x-14,Q.words,{w:700,size:72,col:P.ink,deco:1});
  ag_T(ctx,"Alleluia",Q.x1-330,Q.words+96,{w:600,size:30,col:mix(P.ink,P.parch,0.35),deco:1});
  // the signs, as a scribe's pen made them: a small lozenge for each note, never a modern note's head and stem; the notes of one
  // sign joined by a fine stroke of the pen
  const pos=CE_SIGNS.map((g,i)=>{const u=o.settle?clamp(o.settle[i]||0,0,1):set,k=u<=0?0:u>=1?1:ag_spr(u,0,0.42);return{x:g.x,y:lerp(g.rough,g.exact,k),g};});
  ctx.strokeStyle=rgba(P.ink,0.9);ctx.fillStyle=rgba(P.ink,1);ctx.lineCap="round";
  for(let i=0;i<pos.length;i++){const q=pos[i],nx=pos[i+1];
    if(nx&&!nx.g.first){ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(q.x+8,q.y);ctx.lineTo(nx.x-8,nx.y);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(q.x-12,q.y+1);ctx.quadraticCurveTo(q.x-4,q.y-9,q.x+1,q.y-10);ctx.lineTo(q.x+12,q.y-1);ctx.quadraticCurveTo(q.x+4,q.y+9,q.x-1,q.y+10);ctx.closePath();ctx.fill();}
  // one sign in question: two dotted guesses of how far it rises
  const m=o.mark||0;if(m>0.01){const g=pos[2],f=pos[1];ctx.save();ctx.globalAlpha*=m;ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(g.x,g.y,22,0,TAU);ctx.stroke();
    ctx.setLineDash([5,9]);for(const [dy,lab] of [[-20,"a step?"],[-100,"a leap?"]]){const ty=f.y+dy,u=clamp(m*1.4,0,1);ctx.beginPath();ctx.moveTo(f.x+10,f.y-6);ctx.quadraticCurveTo(f.x+50,ty-20,lerp(f.x+10,f.x+100,u),lerp(f.y,ty,u));ctx.stroke();
      ctx.save();ctx.setLineDash([]);ctx.beginPath();ctx.arc(f.x+100,ty,10,0,TAU);ctx.stroke();ctx.restore();
      ag_T(ctx,lab,f.x+122,ty+10,{w:700,size:30,col:AG.amber,a:ag_in(m,0.5,0.4)});}
    ctx.restore();}
  ctx.restore();}
// Guido's lines across the page: four, drawn left to right as o.draw[i] (0 to 1) goes; the bottom (F) red and the third (C) yellow, each
// with its letter at the start (o.letters 0 to 1, or [F, C] each 0 to 1); o.glow (0 to 1) lights the two coloured lines; o.five adds a fifth line above
function ce_staff(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const Q=CE_PAGE,P=CE_P,d=o.draw||[1,1,1,1],x0=Q.x[0]-80,x1=Q.x[1];ctx.save();ctx.globalAlpha*=a;
  const cols=[P.red,P.ink,P.yellow,P.ink];
  for(let i=0;i<4;i++){const u=clamp(d[i]||0,0,1);if(u<=0)continue;const y=Q.line0-i*2*Q.step,col=cols[i],gl=(i===0||i===2)?(o.glow||0):0;
    ctx.save();if(gl>0.01){ctx.shadowColor=rgba(col,0.8*gl);ctx.shadowBlur=16*gl;}ctx.strokeStyle=rgba(col,i%2?0.75:0.95);ctx.lineWidth=i%2?2.4:3.4;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,ag_sine(u)),y+Math.sin(u*9)*0.6);ctx.stroke();ctx.restore();}
  const la=Array.isArray(o.letters)?o.letters:[o.letters||0,o.letters||0];
  if(la[0]>0.01)ag_T(ctx,"F",x0-62,Q.line0+18,{w:800,size:56,col:P.red,a:la[0],deco:o.deco?1:0});if(la[1]>0.01)ag_T(ctx,"C",x0-62,Q.line0-4*Q.step+18,{w:800,size:56,col:P.yellow,a:la[1],deco:o.deco?1:0});
  if((o.five||0)>0.01){const y=Q.line0-8*Q.step;ctx.strokeStyle=rgba(P.ink,0.75);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,ag_sine(o.five)),y);ctx.stroke();}
  ctx.restore();}
// a quill, its nib at (x, y): a long pale feather, its barbs, the shaft, a dark nib; o.a
function ce_quill(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(-0.9);
  ag_floorShadow(ctx,30,40,140,16,0.18);
  const vane=c=>{c.moveTo(60,-3);c.bezierCurveTo(140,-34,300,-40,420,-12);c.bezierCurveTo(330,10,170,16,60,6);c.closePath();};
  ag_soft(ctx,vane,[232,226,214],[255,253,246],300,-30,200,"rgba(90,80,60,0.35)",10);
  ctx.strokeStyle="rgba(150,140,124,0.5)";ctx.lineWidth=1.4;for(let k=0;k<14;k++){const u=k/14,px=lerp(90,400,u);ctx.beginPath();ctx.moveTo(px,-2);ctx.lineTo(px+30,-16-12*Math.sin(u*3));ctx.stroke();}
  ctx.strokeStyle="rgba(214,204,186,1)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(440,-14);ctx.stroke();
  ctx.fillStyle="rgba(52,40,32,1)";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(26,-4);ctx.lineTo(26,4);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- people of Arezzo and Rome, for ag_person
   Benedictine monks in the black habit, with its cowl folded round the neck and the tonsure; the Pope in a white robe under the red
   mantle, with a low white cap, as the popes of the time were shown. */
// the cowl: the habit's hood, folded round the neck and over the shoulders
function ce_cowl(c,P){const col=P.top.c,k=ag_dk(col,0.15);
  ag_soft(c,cc=>{cc.moveTo(196,566);cc.bezierCurveTo(186,526,214,490,252,482);cc.bezierCurveTo(300,474,350,494,378,532);cc.bezierCurveTo(400,562,404,600,392,628);
    cc.bezierCurveTo(338,662,250,654,210,606);cc.closePath();},k,ag_lt(col,0.24),346,520,150,rgba(ag_dk(col,0.85),0.5),14);
  c.strokeStyle=rgba(ag_lt(col,0.18),0.5);c.lineWidth=2.6;c.beginPath();c.moveTo(214,600);c.bezierCurveTo(260,640,330,646,386,624);c.stroke();}
// the tonsure: the crown shaved, a ring of short hair round it
function ce_tonsure(c,P){c.save();ag_shape(c,AG_F.head);c.clip();const sk=P.skin;
  ag_soft(c,cc=>cc.ellipse(306,306,80,34,-0.1,0,TAU),mix(sk,[255,236,220],0.12),[255,246,236],334,296,70,rgba(mix(sk,[80,30,20],0.6),0.3),8);c.restore();}
// the Pope's white cap (the camelaucum of the time), rising to a soft point, with a band at the brow; it stays inside the
// figure's kept picture (AG_FIG.box starts at y 262), so it can't be taller
function ce_cap(c,P){const col=[244,240,230];
  ag_soft(c,cc=>{cc.moveTo(212,354);cc.bezierCurveTo(214,306,254,274,301,267);cc.bezierCurveTo(348,274,388,306,392,354);cc.bezierCurveTo(330,364,270,364,212,354);cc.closePath();},col,[255,255,255],352,262,150,"rgba(80,70,50,0.3)",14);
  ag_soft(c,cc=>{cc.moveTo(210,346);cc.bezierCurveTo(272,358,332,358,394,346);cc.lineTo(396,368);cc.bezierCurveTo(332,380,272,380,208,368);cc.closePath();},[206,184,132],[244,228,184],330,352,90,null);}
// the Pope's mantle: red, over both shoulders, open down the front over the white robe, fastened with a gold clasp
function ce_mantle(c,P){const red=[146,42,40];
  ag_soft(c,cc=>{cc.moveTo(232,558);cc.bezierCurveTo(196,568,150,582,122,600);cc.bezierCurveTo(90,622,80,662,84,712);cc.lineTo(104,1100);cc.lineTo(282,1100);
    cc.bezierCurveTo(288,900,286,742,276,652);cc.bezierCurveTo(266,612,250,584,232,558);cc.closePath();},red,ag_lt(red,0.3),196,640,240,rgba(ag_dk(red,0.7),0.45),24);
  ag_soft(c,cc=>{cc.moveTo(356,600);cc.bezierCurveTo(392,610,422,628,442,650);cc.bezierCurveTo(470,684,478,740,478,800);cc.lineTo(472,1100);cc.lineTo(342,1100);
    cc.bezierCurveTo(340,900,342,742,346,662);cc.bezierCurveTo(348,630,352,612,356,600);cc.closePath();},ag_dk(red,0.1),ag_lt(red,0.25),430,680,200,rgba(ag_dk(red,0.7),0.45),20);
  ag_soft(c,cc=>cc.arc(310,652,14,0,TAU),[206,170,96],[252,228,160],306,646,14,null);}
const CE_PEOPLE={
  guido:{name:"Guido",key:"ce-guido",skin:[226,190,160],hair:{style:"cropped",c:[74,58,46]},top:{kind:"tunic",c:[52,48,50],paint:ce_cowl},hat:{paint:ce_tonsure},breath:0.27},
  master:{name:"A master",key:"ce-master",skin:[214,176,146],hair:{style:"cropped",c:[156,150,144]},top:{kind:"tunic",c:[56,52,54],paint:ce_cowl},hat:{paint:ce_tonsure},breath:0.24},
  albert:{name:"Another master",key:"ce-albert",skin:[200,158,124],hair:{style:"cropped",c:[60,46,40]},beard:[70,56,48],top:{kind:"tunic",c:[60,56,58],paint:ce_cowl},hat:{paint:ce_tonsure},breath:0.3},
  pope:{name:"Pope John",key:"ce-pope",skin:[228,196,170],hair:{style:"cropped",c:[176,172,166]},top:{kind:"tunic",c:[240,236,226],paint:ce_mantle},hat:{paint:ce_cap},breath:0.25}
};

/* ---------------------------------------------------------------- a choirboy, from behind
   ce_boyBack(ctx, x, y, s, o): (x, y) the top of his neck at the back, s his size (1: a head 176 px tall); his head, the backs of his
   ears, the nape, his shoulders in a pale linen tunic down past the frame's foot. o.hair (a colour), o.turn (-1 to 1) turns his head a
   little, o.up (0 to 1) lifts his chin as he sings, o.a. */
function ce_boyBack(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const hc=o.hair||[70,50,36],sk=o.skin||[226,190,160],tun=o.tunic||CE_P.linen,turn=o.turn||0,up=o.up||0;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const back=c=>{c.moveTo(-40,-4);c.bezierCurveTo(-80,2,-118,14,-138,40);c.bezierCurveTo(-154,62,-160,110,-162,190);c.lineTo(-168,560);c.lineTo(168,560);c.lineTo(162,190);
    c.bezierCurveTo(160,110,154,62,138,40);c.bezierCurveTo(118,14,80,2,40,-4);c.closePath();};
  ag_soft(ctx,back,mix(tun,[0,0,0],0.07),[255,252,244],130,40,280,"rgba(80,70,50,0.35)",24);
  ag_folds(ctx,back,[[[-92,120],[-80,260],[-86,420]],[[22,90],[30,260],[18,440]],[[112,140],[106,300],[118,460]]],"rgba(120,108,86,0.22)","rgba(255,255,255,0.2)");
  const neck=c=>{c.moveTo(-36,-72);c.bezierCurveTo(-38,-34,-40,-12,-44,4);c.bezierCurveTo(-14,14,14,14,44,4);c.bezierCurveTo(40,-12,38,-34,36,-72);c.closePath();};
  ag_soft(ctx,neck,mix(sk,[0,0,0],0.2),sk,20,-40,60,rgba(mix(sk,[60,20,10],0.6),0.4),10);
  ag_soft(ctx,c=>{c.moveTo(-50,-2);c.bezierCurveTo(-16,12,16,12,50,-2);c.lineTo(54,12);c.bezierCurveTo(16,28,-16,28,-54,12);c.closePath();},mix(tun,[0,0,0],0.04),[255,252,244],20,0,60,null);
  ctx.save();ctx.translate(0,-42);ctx.rotate(turn*0.14);ctx.translate(0,-up*8);
  for(const sx of [-1,1]){const ex=sx*84+turn*8;ag_soft(ctx,c=>c.ellipse(ex,-78,14,24,sx*0.18,0,TAU),mix(sk,[0,0,0],0.14),sk,ex+6,-86,24,rgba(mix(sk,[60,20,10],0.6),0.35),6);}
  const head=c=>{c.ellipse(turn*6,-92,82,96,0,0,TAU);};
  ag_soft(ctx,head,mix(sk,[0,0,0],0.16),sk,30,-120,110,null);
  const hair=c=>{c.moveTo(-84,-60);c.bezierCurveTo(-96,-140,-50,-192,6,-190);c.bezierCurveTo(62,-190,100,-140,86,-60);c.bezierCurveTo(74,-22,40,-8,4,-6);c.bezierCurveTo(-36,-8,-72,-22,-84,-60);c.closePath();};
  ag_soft(ctx,hair,hc,mix(hc,[180,170,160],0.4),40,-150,130,"rgba(0,0,0,0.45)",16);
  ctx.save();ag_shape(ctx,hair);ctx.clip();ctx.strokeStyle=rgba(ag_lt(hc,0.5),0.12);ctx.lineWidth=2;
  for(let k=0;k<9;k++){const xx=-70+k*18;ctx.beginPath();ctx.moveTo(xx*0.4,-182);ctx.quadraticCurveTo(xx*1.05,-120,xx,-30);ctx.stroke();}ctx.restore();
  ctx.restore();ctx.restore();}
// a voice's soft arcs travelling from a mouth (fx, fy) to an ear (tx, ty): o.t, o.a
function ce_sound(ctx,fx,fy,tx,ty,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const ang=Math.atan2(ty-fy,tx-fx),L=Math.hypot(tx-fx,ty-fy),t=o.t||0;
  ctx.save();ctx.translate(fx,fy);ctx.rotate(ang);ctx.lineCap="round";
  for(let k=0;k<4;k++){const u=((t*0.55+k/4)%1),r=lerp(14,L-10,u),al=a*Math.sin(Math.PI*u)*0.7;ctx.strokeStyle="rgba(255,252,240,"+al+")";ctx.lineWidth=5;
    ctx.beginPath();ctx.arc(0,0,r,-0.32,0.32);ctx.stroke();ctx.strokeStyle="rgba(120,100,70,"+(al*0.4)+")";ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,r+3,-0.3,0.3);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- a chant book with its master's name, and a book in a reader's hands
   ce_book(ctx, x, y, w, name, o): an open chant book on a card, its middle at (x, y), w wide; the same Alleluia's signs at heights of
   that master's own (o.seed), and his name on a tag under it; o.a, o.k (springs in). */
function ce_book(ctx,x,y,w,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const P=CE_P,h=w*0.6;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.5,1,o.k));
  ag_floorShadow(ctx,x-10,y+h/2+16,w*0.55,20,0.3);
  ag_soft(ctx,cc=>ag_rect(cc,x-w/2-12,y-h/2-8,w+24,h+22,10),[110,60,44],[160,100,70],x+w/3,y-h/2,w*0.6,"rgba(30,10,6,0.4)",10);
  for(const s of [-1,1]){const pg=cc=>{cc.moveTo(x,y-h/2+6);cc.bezierCurveTo(x+s*w*0.2,y-h/2-6,x+s*w*0.4,y-h/2,x+s*w*0.48,y-h/2+4);cc.lineTo(x+s*w*0.48,y+h/2-4);
      cc.bezierCurveTo(x+s*w*0.4,y+h/2-8,x+s*w*0.2,y+h/2-4,x,y+h/2+4);cc.closePath();};
    ag_soft(ctx,pg,s<0?P.parchDk:P.parch,[252,246,230],x+s*w*0.3,y-h*0.3,w*0.4,"rgba(80,60,30,0.25)",8);}
  const R=ag_rnd(o.seed||1);ctx.fillStyle=rgba(P.ink,0.85);ctx.strokeStyle=rgba(P.ink,0.85);ctx.lineWidth=2;
  for(const s of [-1,1]){let yy=y+(R()-0.5)*20;for(let k=0;k<6;k++){const px=x+s*(w*0.06+k*w*0.07),py=y-h*0.08+(R()-0.5)*h*0.36;
      ctx.save();ctx.translate(px,py);ctx.rotate(-0.45);ctx.beginPath();ctx.ellipse(0,0,6,4.4,0,0,TAU);ctx.fill();ctx.restore();yy=py;}
    for(let k=0;k<3;k++){rr(ctx,x+s*w*0.06+(s<0?-w*0.38:0)+k*w*0.12,y+h*0.26,w*0.08,8,4);ctx.fill();}}
  ctx.restore();
  if(name)ag_pill(ctx,x,y+h/2+58,name,{a,size:30});}
// the open book a seated reader holds, in figure space, under the near hand (hands.near): o.turn (0 to 1) turns a page from right to left
function ce_heldBook(c,hands,o){o=o||{};const P=CE_P,[hx,hy]=hands.near,x=hx+40,y=hy-30,w=330,h=150;
  ag_soft(c,cc=>{cc.moveTo(x-w/2-10,y+10);cc.lineTo(x+w/2+10,y+10);cc.lineTo(x+w/2-6,y-h);cc.lineTo(x-w/2+6,y-h);cc.closePath();},[110,60,44],[160,100,70],x+80,y-h,200,"rgba(30,10,6,0.4)",8);
  for(const s of [-1,1]){ag_soft(c,cc=>{cc.moveTo(x,y);cc.bezierCurveTo(x+s*60,y-12,x+s*120,y-8,x+s*156,y-2);cc.lineTo(x+s*146,y-h+6);cc.bezierCurveTo(x+s*110,y-h-6,x+s*50,y-h-4,x,y-h+8);cc.closePath();},
    s<0?P.parchDk:P.parch,[252,246,230],x+s*80,y-h*0.7,120,"rgba(80,60,30,0.25)",8);
    for(let k=0;k<4;k++){const yy=y-h+30+k*28;c.strokeStyle=k===0?rgba(P.red,0.7):k===2?rgba(P.yellow,0.75):rgba(P.ink,0.35);c.lineWidth=1.6;c.beginPath();c.moveTo(x+s*16,yy);c.lineTo(x+s*140,yy+2);c.stroke();}}
  const u=o.turn||0;if(u>0.01&&u<0.99){const k=Math.cos(Math.PI*u),px=x+k*150;c.fillStyle=rgba(mix(P.parch,[255,255,255],0.3),1);c.strokeStyle="rgba(80,60,30,0.3)";c.lineWidth=1.4;
    c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+k*80,y-30-Math.sin(Math.PI*u)*40,px,y-6);c.lineTo(px-k*6,y-h+8);c.quadraticCurveTo(x+k*80,y-h-30-Math.sin(Math.PI*u)*40,x,y-h+8);c.closePath();c.fill();c.stroke();}}

/* ---------------------------------------------------------------- Rome, a few years later (painted once) */
const CE_ROME={hz:760,chair:[720,640],pope:[720,652,0.96],guido:[1420,650,0.94]};
AG_PLACES.ceRome=c=>{const P=CE_P,R=CE_ROME,hz=R.hz;
  // plaster, warm, with a painted band at the foot and a thin red line above it
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(mix(P.plaster,[255,250,236],0.2),1));g.addColorStop(1,rgba(P.plaster,1));c.fillStyle=g;c.fillRect(0,0,W,hz);
  const Rn=ag_rnd(31);for(let i=0;i<40;i++){const x=Rn()*W,y=Rn()*hz,r=80+Rn()*240,cg=c.createRadialGradient(x,y,0,x,y,r);cg.addColorStop(0,rgba(Rn()<0.5?P.plasterDk:[246,238,220],0.22));cg.addColorStop(1,"rgba(230,216,194,0)");c.fillStyle=cg;c.fillRect(x-r,y-r,2*r,2*r);}
  ag_grain(c,0,0,W,hz,2.2,31);
  ag_soft(c,cc=>ag_rect(cc,-10,hz-190,W+20,190,0),[196,140,96],[220,170,124],1500,hz-150,700,"rgba(70,40,20,0.3)",20);
  c.fillStyle="rgba(150,50,40,0.75)";c.fillRect(0,hz-196,W,6);c.fillStyle="rgba(255,250,236,0.4)";c.fillRect(0,hz-190,W,2);
  for(let x=60;x<W;x+=180){c.strokeStyle="rgba(120,70,40,0.35)";c.lineWidth=3;c.beginPath();c.ellipse(x,hz-96,46,46,0,0,TAU);c.stroke();}
  ce_window(c,1560,110,230,430);
  // a column of pale marble on the left, its capital and base
  ag_soft(c,cc=>ag_rect(cc,150,70,120,hz-60,10),P.column,[255,254,250],250,200,300,"rgba(70,60,40,0.4)",18);
  ag_soft(c,cc=>ag_rect(cc,120,40,180,54,8),[214,208,196],[250,248,240],270,50,140,"rgba(70,60,40,0.35)",10);
  ag_soft(c,cc=>ag_rect(cc,124,hz-40,172,50,8),[206,200,188],[246,244,236],270,hz-30,140,"rgba(70,60,40,0.35)",10);
  c.strokeStyle="rgba(150,140,124,0.25)";c.lineWidth=2;for(const x of [176,206,236]){c.beginPath();c.moveTo(x,100);c.lineTo(x,hz-50);c.stroke();}
  ce_flags(c,hz,{seed:17});ce_beam(c,1420,1820,hz,0.24);
  // the chair: a high back of carved wood, rounded at the top, behind where the Pope sits
  const [cx,cy]=R.chair,back=cc=>{cc.moveTo(cx-190,cy+460);cc.lineTo(cx-190,cy-250);cc.bezierCurveTo(cx-190,cy-390,cx+190,cy-390,cx+190,cy-250);cc.lineTo(cx+190,cy+460);cc.closePath();};
  ag_floorShadow(c,cx-30,hz+120,300,50,0.3);
  ag_soft(c,back,P.wood,P.woodHi,cx+120,cy-280,320,"rgba(30,18,8,0.45)",22);
  c.save();ag_shape(c,back);c.clip();c.strokeStyle="rgba(60,36,20,0.4)";c.lineWidth=4;c.beginPath();c.moveTo(cx-150,cy+460);c.lineTo(cx-150,cy-240);c.bezierCurveTo(cx-150,cy-344,cx+150,cy-344,cx+150,cy-240);c.lineTo(cx+150,cy+460);c.stroke();
  c.strokeStyle="rgba(240,210,160,0.25)";c.lineWidth=2;c.beginPath();c.moveTo(cx-146,cy+460);c.lineTo(cx-146,cy-240);c.bezierCurveTo(cx-146,cy-338,cx+146,cy-338,cx+146,cy-240);c.stroke();c.restore();
  for(const s of [-1,1])ag_soft(c,cc=>cc.arc(cx+s*190,cy-250,22,0,TAU),P.woodDk,P.woodHi,cx+s*190+6,cy-258,24,null);
  ce_light(c,1660,300);};
