/* ===== Decades in the making: the past =====
   The opening's places and things, in the module's matte style (no watercolour, no grain), lit from a window on the right as the lab
   is. Each place is painted once (AG_PLACES); what moves is drawn live over it.
     dmScribe   a writing room in the 1440s: plaster, a tall window on the right, a slanted desk
     dmShelf    a library's wall in 1424: stone, an oak press with two shelves
     dmDesk     a table from above, for pages and copies
     dmIron     a plain wooden bench from above, for an iron frame of clay pieces and a small fire under it
     dmCloth    a table with a cloth, for a book and pieces of metal
     dmMainz    a workshop in Mainz around 1450: timber and plaster, a wooden press, a case of letters, a bench
     dmMap      Europe, as a pale relief: the land, the sea, no borders
     dmPlaster  a plain plaster wall, for the printing timeline
   No script but our own Latin letters is drawn: the clay and metal pieces show their backs, and pages printed in China and Korea
   show soft grey rows, never characters. */

/* ---------------------------------------------------------------- shared painting helpers */
// a warm plaster wall, lighter towards the window on the right, with a soft mottle
function dm_plaster(c,x,y,w,h,col,seed){col=col||DM.plaster;const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(col,0.1),1));g.addColorStop(0.75,rgba(col,1));g.addColorStop(1,rgba(ag_lt(col,0.12),1));
  c.fillStyle=g;c.fillRect(x,y,w,h);const r=ag_rnd(seed||7);c.save();c.globalAlpha=0.05;for(let i=0;i<90;i++){const px=x+r()*w,py=y+r()*h,rad=40+r()*160;const rg=c.createRadialGradient(px,py,0,px,py,rad);
    const d=r()<0.5;rg.addColorStop(0,d?"rgba(120,100,80,1)":"rgba(255,250,240,1)");rg.addColorStop(1,d?"rgba(120,100,80,0)":"rgba(255,250,240,0)");c.fillStyle=rg;c.fillRect(px-rad,py-rad,rad*2,rad*2);}c.restore();
  // a soft darkening at the top and the corners
  const v=c.createLinearGradient(0,y,0,y+h);v.addColorStop(0,"rgba(60,46,32,0.16)");v.addColorStop(0.35,"rgba(60,46,32,0)");v.addColorStop(1,"rgba(60,46,32,0.06)");c.fillStyle=v;c.fillRect(x,y,w,h);}
// wooden boards: a floor or a table top, its boards running across (dir "x") or away from us (dir "y")
function dm_boards(c,x,y,w,h,col,o){o=o||{};const n=o.n||7,r=ag_rnd(o.seed||3);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  for(let i=0;i<n;i++){const by=y+i*h/n,bh=h/n,tone=0.94+r()*0.12,cc=[col[0]*tone,col[1]*tone,col[2]*tone].map(v=>Math.min(255,v));
    const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(cc,0.12),1));g.addColorStop(0.7,rgba(cc,1));g.addColorStop(1,rgba(ag_lt(cc,0.1),1));c.fillStyle=g;c.fillRect(x,by,w,bh+1);
    c.strokeStyle="rgba(50,32,18,0.28)";c.lineWidth=2;c.beginPath();c.moveTo(x,by);c.lineTo(x+w,by);c.stroke();
    c.strokeStyle="rgba(60,40,22,0.1)";c.lineWidth=1.2;for(let k=0;k<5;k++){const yy=by+bh*(0.15+r()*0.7);c.beginPath();c.moveTo(x,yy);c.bezierCurveTo(x+w*0.3,yy+(r()-0.5)*8,x+w*0.6,yy+(r()-0.5)*8,x+w,yy+(r()-0.5)*6);c.stroke();}}
  c.restore();}
// light from the window: a warm, soft shaft across a rectangle, brightest at (lx, ly)
function dm_glow(c,lx,ly,rad,a,col){const g=c.createRadialGradient(lx,ly,0,lx,ly,rad);g.addColorStop(0,rgba(col||[255,246,226],a));g.addColorStop(1,rgba(col||[255,246,226],0));c.fillStyle=g;c.fillRect(lx-rad,ly-rad,rad*2,rad*2);}
// a tall window with a round head, deep in a stone reveal, and small leaded panes; its light falls on the floor
function dm_window(c,x,y,w,h,o){o=o||{};const r=w/2;const arch=cc=>{cc.moveTo(x,y+h);cc.lineTo(x,y+r);cc.arc(x+r,y+r,r,Math.PI,0);cc.lineTo(x+w,y+h);cc.closePath();};
  // the reveal: stone, lit on its left side (the light comes in from the right, through it)
  c.save();const rv=cc=>{cc.moveTo(x-34,y+h+30);cc.lineTo(x-34,y+r);cc.arc(x+r,y+r,r+34,Math.PI,0);cc.lineTo(x+w+34,y+h+30);cc.closePath();};
  ag_soft(c,rv,DM.stone,[250,244,232],x,y+h*0.4,w,rgba([60,46,30],0.35),26);c.restore();
  // the glass: a pale sky, brightest low
  ag_shape(c,arch);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#F3F1EA");g.addColorStop(1,"#FFFDF6");c.fillStyle=g;c.fill();
  // the leading: a diamond lattice of thin graphite lines
  c.save();ag_shape(c,arch);c.clip();c.strokeStyle="rgba(70,66,64,0.42)";c.lineWidth=2;const s=o.pane||46;
  for(let k=-h;k<w+h;k+=s){c.beginPath();c.moveTo(x+k,y);c.lineTo(x+k+h,y+h);c.stroke();c.beginPath();c.moveTo(x+k,y+h);c.lineTo(x+k+h,y);c.stroke();}
  // the mullion and a transom of iron
  c.strokeStyle="rgba(58,56,58,0.75)";c.lineWidth=6;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h*0.55);c.lineTo(x+w,y+h*0.55);c.stroke();c.restore();
  // the sill
  ag_soft(c,cc=>ag_rect(cc,x-50,y+h,w+100,26,4),DM.stone,[255,250,240],x+w,y+h,w,rgba([60,46,30],0.4),10);}

/* ---------------------------------------------------------------- a point on a four-sided surface
   dm_L(Q, u, v): Q is [near left, near right, far right, far left]; u runs left to right, v from the near edge to the far one. */
function dm_L(Q,u,v){return[lerp(lerp(Q[0][0],Q[1][0],u),lerp(Q[3][0],Q[2][0],u),v),lerp(lerp(Q[0][1],Q[1][1],u),lerp(Q[3][1],Q[2][1],u),v)];}
const dm_quad=(Q)=>c=>{c.moveTo(Q[0][0],Q[0][1]);for(const q of Q.slice(1))c.lineTo(q[0],q[1]);c.closePath();};
// the part of Q between u0..u1 and v0..v1, as a quad
const dm_sub=(Q,u0,u1,v0,v1)=>[dm_L(Q,u0,v0),dm_L(Q,u1,v0),dm_L(Q,u1,v1),dm_L(Q,u0,v1)];

/* ---------------------------------------------------------------- handwriting, seen from a little way off
   A row of a book hand: words of short upright strokes (minims), some with a stroke above the line or below it, drawn on a page Q
   along v from u0 to u1. dm_hand(c, Q, rows, p, o): rows are written from the top (far) down; p (0..rows) says how far, in rows,
   the writing has got; returns where the pen is. o.seed gives each page its own words; o.h the strokes' height in v. */
function dm_hand(c,Q,rows,p,o){o=o||{};const u0=o.u0||0.1,u1=o.u1||0.9,top=o.top||0.86,pitch=o.pitch||0.074,h=o.h||0.024,r=ag_rnd(o.seed||5);
  let tip=null;c.save();c.strokeStyle=rgba(o.col||DM.ink,o.a==null?0.7:o.a);c.lineWidth=o.lw||1.8;c.lineCap="round";c.beginPath();
  for(let i=0;i<rows;i++){const v=top-i*pitch,f=clamp(p-i,0,1),uEnd=u0+(u1-u0)*f;let u=u0+(i===0&&o.indent?0.08:0);
    while(u<u1-0.01){const n=1+Math.floor(r()*6),wl=n*0.02;if(u+wl>u1)break;
      for(let k=0;k<n;k++){const m=1+(r()<0.45?1:0),asc=r()<0.14,desc=!asc&&r()<0.07;
        for(let j=0;j<m;j++){const uu=u+k*0.02+j*0.008;if(uu>uEnd)break;const a=dm_L(Q,uu,v+(asc?h*1.7:h)),b=dm_L(Q,uu-0.002,v-(desc?h*0.9:0));
          c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);const ft=dm_L(Q,uu+0.006,v-(desc?h*0.9:0)-0.004);c.lineTo(ft[0],ft[1]);}}
      u+=wl+0.022;}
    if(f>0&&f<1)tip=dm_L(Q,uEnd,v);if(f<1&&tip)break;}
  c.stroke();c.restore();if(!tip){const i=clamp(Math.floor(p),0,rows-1);tip=dm_L(Q,u0+(u1-u0)*clamp(p-i,0,1),top-i*pitch);}return tip;}

/* ---------------------------------------------------------------- the writing room, in the 1440s
   A scribe at a sloped writing desk by a window: the desk is part of the place, with the book open on it, its left page written;
   the right page is written live (dm_writing), and the scribe's near hand follows the pen (dm_scribe). */
const DM_SCRIBE={win:[1500,130,280,540],floor:760,
  // the desk's sloping board, [near left, near right, far right, far left]: a wide desk the scribe sits behind
  board:[[300,904],[1400,904],[1350,676],[340,676]],
  // the new book, open on the board (u0, u1, v0, v1 of the board), its pages; the book being copied stands on a rest at the right
  book:[0.17,0.55,0.12,0.9],rest:[1010,520,300,190],rows:11};
const dm_book=()=>{const b=DM_SCRIBE.book;return dm_sub(DM_SCRIBE.board,b[0],b[1],b[2],b[3]);};
const dm_page=side=>{const Q=dm_book();return side==="left"?dm_sub(Q,0.03,0.49,0.03,0.97):dm_sub(Q,0.51,0.97,0.03,0.97);};
// an open book on a quad Q: the cover's edge, two pages and the shadow of the spine; written: which pages are full
function dm_openBook(c,Q,o){o=o||{};ag_soft(c,dm_quad(Q),o.cover||[96,54,44],[150,96,70],Q[2][0],Q[2][1],400,"rgba(30,12,6,0.4)",8);
  const L=dm_sub(Q,0.03,0.49,0.03,0.97),R=dm_sub(Q,0.51,0.97,0.03,0.97);
  for(const P of [L,R])ag_soft(c,dm_quad(P),DM.parch,[255,252,240],P[2][0],P[2][1]+40,320,"rgba(90,66,30,0.26)",12);
  const s0=dm_L(Q,0.5,0.03),s1=dm_L(Q,0.5,0.97),w=Math.abs(Q[1][0]-Q[0][0])*0.05,g=c.createLinearGradient(s0[0]-w,0,s0[0]+w,0);
  g.addColorStop(0,"rgba(90,66,30,0)");g.addColorStop(0.5,"rgba(90,66,30,0.32)");g.addColorStop(1,"rgba(90,66,30,0)");
  c.fillStyle=g;c.beginPath();c.moveTo(s0[0]-w,s0[1]);c.lineTo(s0[0]+w,s0[1]);c.lineTo(s1[0]+w,s1[1]);c.lineTo(s1[0]-w,s1[1]);c.closePath();c.fill();
  return{L,R};}
AG_PLACES.dmScribe=c=>{const F=DM_SCRIBE.floor,[wx,wy,ww,wh]=DM_SCRIBE.win,B=DM_SCRIBE.board;dm_plaster(c,0,0,W,F,DM.plaster,11);
  // a timber beam along the top
  ag_soft(c,cc=>cc.rect(0,0,W,46),DM.woodDk,DM.woodLt,1500,20,700,"rgba(30,20,10,0.4)",12);
  dm_window(c,wx,wy,ww,wh,{});
  // a shelf on the left wall with three closed books and a jar
  ag_soft(c,cc=>ag_rect(cc,40,330,300,22,3),DM.wood,DM.woodLt,330,330,300,"rgba(30,20,10,0.35)",8);
  for(const [bx,bw,bh,col] of [[64,46,120,[110,60,48]],[114,38,104,[84,70,96]],[158,52,128,[120,98,62]]])ag_soft(c,cc=>ag_rect(cc,bx,330-bh,bw,bh,4),col,ag_lt(col,0.3),bx+bw,330-bh,120,"rgba(30,20,10,0.35)",8);
  ag_soft(c,cc=>{cc.moveTo(250,330);cc.bezierCurveTo(240,290,250,262,272,256);cc.lineTo(300,256);cc.bezierCurveTo(322,262,332,290,322,330);cc.closePath();},[176,150,120],[236,220,196],320,280,80,"rgba(40,26,14,0.35)",8);
  // the floor: boards, darker under the wall, lit where the window's light falls
  dm_boards(c,0,F,W,H-F,DM.woodLt,{n:6,seed:5});
  const sh=c.createLinearGradient(0,F,0,H);sh.addColorStop(0,"rgba(40,26,14,0.3)");sh.addColorStop(0.2,"rgba(40,26,14,0)");c.fillStyle=sh;c.fillRect(0,F,W,H-F);
  c.save();c.globalCompositeOperation="screen";dm_glow(c,1560,F+150,560,0.32);dm_glow(c,1640,420,640,0.22);c.restore();
  c.fillStyle="rgba(40,26,14,0.22)";c.fillRect(0,F-6,W,8);
  // the desk: a box of dark oak under the board, its panels, its shadow on the floor
  ag_floorShadow(c,860,1076,640,40,0.3);
  ag_soft(c,cc=>{cc.moveTo(320,904);cc.lineTo(1388,904);cc.lineTo(1380,1090);cc.lineTo(328,1090);cc.closePath();},DM.woodDk,DM.wood,1300,940,520,"rgba(20,12,6,0.45)",16);
  for(const px of [380,740,1080])ag_inner(c,cc=>ag_rect(cc,px,940,250,150,6),"rgba(20,12,6,0.5)",10,-3,3);
  // the board, and its thick near edge
  ag_soft(c,dm_quad(B),DM.wood,DM.woodLt,1300,700,700,"rgba(30,18,8,0.42)",14);
  ag_soft(c,cc=>ag_rect(cc,288,896,1124,26,5),DM.woodDk,DM.woodLt,1360,900,500,"rgba(20,12,6,0.4)",6);
  // the new book: the left page written, with a red initial at its head; the right page is written live
  const nb=dm_openBook(c,dm_book());c.fillStyle="rgba(168,52,40,0.85)";const i0=dm_L(nb.L,0.1,0.93),i1=dm_L(nb.L,0.2,0.8);c.fillRect(i0[0],i0[1],i1[0]-i0[0],i1[1]-i0[1]);
  dm_hand(c,nb.L,DM_SCRIBE.rows,DM_SCRIBE.rows,{seed:21,u0:0.1,u1:0.9,indent:true});
  // the book being copied, open on a rest at the right of the desk: a slanted board on two struts
  const [rx,ry,rw,rh]=DM_SCRIBE.rest,R=[[rx,ry+rh],[rx+rw,ry+rh],[rx+rw-26,ry],[rx+26,ry]];
  ag_soft(c,cc=>{cc.moveTo(rx+40,ry+rh);cc.lineTo(rx+60,ry+rh+70);cc.lineTo(rx+80,ry+rh+70);cc.lineTo(rx+66,ry+rh);cc.closePath();cc.moveTo(rx+rw-66,ry+rh);cc.lineTo(rx+rw-80,ry+rh+70);cc.lineTo(rx+rw-60,ry+rh+70);cc.lineTo(rx+rw-40,ry+rh);cc.closePath();},DM.woodDk,DM.wood,rx+rw,ry+rh+40,120,"rgba(20,12,6,0.4)",6);
  ag_floorShadow(c,rx+rw/2,ry+rh+74,rw*0.6,14,0.3);
  ag_soft(c,dm_quad(R),DM.wood,DM.woodLt,rx+rw,ry+20,300,"rgba(30,18,8,0.4)",10);
  const ex=dm_openBook(c,dm_sub(R,0.05,0.95,0.08,0.98),{cover:[70,58,84]});
  for(const [P,sd] of [[ex.L,41],[ex.R,42]])dm_hand(c,P,9,9,{seed:sd,u0:0.1,u1:0.9,pitch:0.09,top:0.84,h:0.03,lw:1.6,a:0.7});
  c.fillStyle="rgba(46,70,140,0.8)";const e0=dm_L(ex.L,0.1,0.92),e1=dm_L(ex.L,0.22,0.76);c.fillRect(e0[0],e0[1],e1[0]-e0[0],e1[1]-e0[1]);
  // an inkhorn in a hole at the board's far left
  ag_soft(c,cc=>{cc.moveTo(900,686);cc.lineTo(912,640);cc.lineTo(936,644);cc.lineTo(928,690);cc.closePath();},[60,46,40],[150,130,110],930,644,40,"rgba(0,0,0,0.4)",6);};

// the right page, written up to p (0..1 of its rows); returns where the pen is
function dm_writing(ctx,p){return dm_hand(ctx,dm_page("right"),DM_SCRIBE.rows,p*DM_SCRIBE.rows,{seed:34,u0:0.1,u1:0.9});}

// an arm that reaches a point: the angles (degrees from straight down, forward positive) of the upper arm and the forearm that put
// the wrist at T, from the shoulder J, in figure space, the elbow bending down and back
function dm_reach(J,T,hand){const f=AG_FIG.fore,L1=AG_FIG.L1,L2=AG_FIG.L2,dx=(T[0]-J[0])/f,dy=T[1]-J[1],d=clamp(Math.hypot(dx,dy),Math.abs(L1-L2)+1,L1+L2-1);
  const base=Math.atan2(dx,dy),k=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),a1=base-k,E=[Math.sin(a1)*L1,Math.cos(a1)*L1],a2=Math.atan2(dx-E[0],dy-E[1]);
  return[a1*180/Math.PI,a2*180/Math.PI,hand||"hold"];}
// the scribe at the desk: the near hand on the pen at tip (in the frame), the far hand resting on the new book's left page
function dm_scribe(ctx,t,tip,o){o=o||{};const x=o.x||640,y=o.y||470,s=o.s||1.0,A=AG_FIG.anchor,toFig=q=>[A[0]+(q[0]-x)/s,A[1]+(q[1]-y)/s];
  const T=toFig(tip),near=dm_reach(AG_FIG.shoulder.near,[T[0]-104,T[1]-30]),far=dm_reach(AG_FIG.shoulder.far,toFig(o.rest||dm_L(dm_page("left"),0.62,0.55)),"rest");
  // he looks from the book he copies (o.look) to his page and back
  const lk=o.look?1:0;return ag_person(ctx,DM_PEOPLE.scribe,x,y,s,{t,pose:{near,far},cut:DM_SCRIBE.board[3][1],nod:lk?0.03:0.18,gaze:lk?[6,1]:[4,6],smile:0.1,
    hold:(c,h)=>dm_quill(c,T[0],T[1],0.95,1/s*1.1)});}
// a quill: a feather from (x, y) the nib, leaning back up and left
function dm_quill(ctx,x,y,ang,s){s=s||1;ctx.save();ctx.translate(x,y);ctx.rotate(ang==null?0.95:ang);ctx.scale(s,s);
  ctx.strokeStyle="rgba(40,36,40,0.9)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-12,-1);ctx.stroke();
  const f=cc=>{cc.moveTo(-10,-1);cc.bezierCurveTo(-60,-24,-150,-30,-220,-16);cc.bezierCurveTo(-166,4,-74,10,-10,2);cc.closePath();};
  ag_soft(ctx,f,[236,230,218],[255,255,255],-60,-14,120,"rgba(80,70,60,0.35)",6);
  ctx.strokeStyle="rgba(120,110,96,0.7)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-10,0);ctx.quadraticCurveTo(-100,-12,-222,-16);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- kept sprites: small things drawn many times */
const dm_sprite=(key,w,h,paint)=>ag_kept("dm:"+key,w,h,paint);
// a book lying on a sloping lectern, seen from the front: its cover, its pages' edge, a chain at its foot (col: the leather)
const DM_LEATHER=[[112,58,46],[92,70,52],[70,78,64],[120,92,60],[84,60,74],[134,84,56],[98,52,50]];
function dm_bookSprite(i){const col=DM_LEATHER[i%DM_LEATHER.length];return dm_sprite("book"+i,44,64,c=>{
  ag_soft(c,cc=>ag_rect(cc,4,4,34,50,4),col,ag_lt(col,0.35),34,10,40,rgba(ag_dk(col,0.7),0.5),8);
  c.fillStyle=rgba(DM.parch,1);c.fillRect(8,52,28,5);c.fillStyle="rgba(120,96,60,0.4)";c.fillRect(8,55,28,2);
  c.strokeStyle=rgba(ag_lt(col,0.3),0.6);c.lineWidth=1.4;for(const y of [16,40])c.strokeRect(9,y,24,1);
  c.fillStyle="rgba(200,180,140,0.9)";c.beginPath();c.arc(21,58,2.6,0,TAU);c.fill();});}

/* ---------------------------------------------------------------- Cambridge's library, in 1424
   Four oak lecterns against a stone wall, the books lying on their slopes and on a shelf below, each chained to a rod: as libraries
   kept their books then. dm_library(ctx, n) shows the first n of the 122. */
const DM_LIB={lect:[[150,0],[570,0],[990,0],[1410,0]],w:380,top:520,shelf:740,per:[[16,15],[16,15],[15,15],[15,15]]};
function dm_ashlar(c,x,y,w,h,seed){const r=ag_rnd(seed||3),bh=86;c.fillStyle=rgba(DM.stone,1);c.fillRect(x,y,w,h);
  for(let row=0;row*bh<h;row++){const yy=y+row*bh;let xx=x-(row%2?70:0);while(xx<x+w){const bw=150+r()*110,tone=0.94+r()*0.1;
      c.fillStyle=rgba(DM.stone.map(v=>Math.min(255,v*tone)),1);c.fillRect(xx+3,yy+3,bw-6,bh-6);xx+=bw;}}
  c.strokeStyle="rgba(120,108,92,0.35)";c.lineWidth=3;for(let row=0;row*bh<h;row++){c.beginPath();c.moveTo(x,y+row*bh);c.lineTo(x+w,y+row*bh);c.stroke();}
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(60,48,34,0.18)");g.addColorStop(0.7,"rgba(60,48,34,0)");g.addColorStop(1,"rgba(255,248,230,0.12)");c.fillStyle=g;c.fillRect(x,y,w,h);}
// a tall pointed window in a stone wall, its leaded panes, its light falling down and left
function dm_lancet(c,x,y,w,h){const r=w*0.62,cx=x+w/2,p=cc=>{cc.moveTo(x,y+h);cc.lineTo(x,y+r);cc.quadraticCurveTo(x,y+r*0.2,cx,y);cc.quadraticCurveTo(x+w,y+r*0.2,x+w,y+r);cc.lineTo(x+w,y+h);cc.closePath();};
  ag_inner(c,cc=>{cc.moveTo(x-26,y+h+20);cc.lineTo(x-26,y+r);cc.quadraticCurveTo(x-26,y+r*0.1,cx,y-30);cc.quadraticCurveTo(x+w+26,y+r*0.1,x+w+26,y+r);cc.lineTo(x+w+26,y+h+20);cc.closePath();},"rgba(40,30,20,0.5)",18,-6,4);
  ag_shape(c,p);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#F2F0EA");g.addColorStop(1,"#FFFDF6");c.fillStyle=g;c.fill();
  c.save();ag_shape(c,p);c.clip();c.strokeStyle="rgba(70,66,64,0.42)";c.lineWidth=2;for(let k=-h;k<w+h;k+=40){c.beginPath();c.moveTo(x+k,y);c.lineTo(x+k+h,y+h);c.stroke();c.beginPath();c.moveTo(x+k,y+h);c.lineTo(x+k+h,y);c.stroke();}
  c.strokeStyle="rgba(58,56,58,0.7)";c.lineWidth=5;c.beginPath();c.moveTo(cx,y);c.lineTo(cx,y+h);c.stroke();c.restore();}
AG_PLACES.dmLibrary=c=>{const F=870;dm_ashlar(c,0,0,W,F,9);
  // two pointed windows high in the wall, their light on the floor
  dm_lancet(c,560,70,150,330);dm_lancet(c,1240,70,150,330);
  c.save();c.globalCompositeOperation="screen";dm_glow(c,1300,330,520,0.28);dm_glow(c,640,330,420,0.18);c.restore();
  // the floor: stone flags
  c.fillStyle=rgba(ag_dk(DM.stone,0.12),1);c.fillRect(0,F,W,H-F);c.strokeStyle="rgba(90,78,62,0.35)";c.lineWidth=2;
  for(let x=-200;x<W+200;x+=220){c.beginPath();c.moveTo(x,F);c.lineTo(x-(x-960)*0.5,H);c.stroke();}for(const y of [920,1000]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  const sh=c.createLinearGradient(0,F,0,H);sh.addColorStop(0,"rgba(40,30,20,0.35)");sh.addColorStop(0.3,"rgba(40,30,20,0)");c.fillStyle=sh;c.fillRect(0,F,W,H-F);
  // the lecterns: a sloping top, a rod under its lower edge, a shelf, two posts and a foot
  for(const [lx] of DM_LIB.lect){const w=DM_LIB.w,T=DM_LIB.top,S=DM_LIB.shelf;
    ag_floorShadow(c,lx+w/2-10,F+30,w*0.6,30,0.35);
    for(const px of [lx+40,lx+w-64])ag_soft(c,cc=>ag_rect(cc,px,T+40,24,F+24-T-40,4),DM.woodDk,DM.wood,px+20,T+200,160,"rgba(20,12,6,0.45)",8);
    ag_soft(c,cc=>ag_rect(cc,lx+10,F+8,w-20,22,6),DM.woodDk,DM.wood,lx+w,F+10,200,"rgba(20,12,6,0.45)",6);
    ag_soft(c,cc=>{cc.moveTo(lx-10,T+78);cc.lineTo(lx+w+10,T+78);cc.lineTo(lx+w-6,T-6);cc.lineTo(lx+6,T-6);cc.closePath();},DM.wood,DM.woodLt,lx+w,T,300,"rgba(30,18,8,0.45)",10);
    ag_soft(c,cc=>ag_rect(cc,lx-14,T+74,w+28,16,4),DM.woodDk,DM.woodLt,lx+w,T+76,240,"rgba(20,12,6,0.4)",4);
    ag_soft(c,cc=>ag_rect(cc,lx,S+60,w,18,4),DM.woodDk,DM.woodLt,lx+w,S+62,240,"rgba(20,12,6,0.4)",4);
    // the iron rods the chains run on
    c.strokeStyle=rgba(DM.iron,0.9);c.lineWidth=5;c.beginPath();c.moveTo(lx-4,T+100);c.lineTo(lx+w+4,T+100);c.moveTo(lx-4,S+88);c.lineTo(lx+w+4,S+88);c.stroke();}};
// where the k-th book sits: [x, y, which row], filling each lectern's slope and then its shelf
function dm_libSlots(){if(dm_libSlots.S)return dm_libSlots.S;const S=[];DM_LIB.lect.forEach(([lx],i)=>{const [a,b]=DM_LIB.per[i];
    for(let k=0;k<a;k++)S.push([lx+4+k*(DM_LIB.w-8)/a,DM_LIB.top-2,0]);for(let k=0;k<b;k++)S.push([lx+6+k*(DM_LIB.w-12)/b,DM_LIB.shelf,1]);});return dm_libSlots.S=S;}
// the books, the first n of them, each landing with a small settle; t and the time each one came (t0 + k * dt)
function dm_library(ctx,n,t,t0,dt){const S=dm_libSlots();for(let k=0;k<Math.min(n,S.length);k++){const [x,y,row]=S[k],u=t==null?1:clamp((t-(t0+k*dt))/0.35,0,1),dy=(1-ag_eo(u))*-18;
    const img=dm_bookSprite(k*5+row);ctx.save();ctx.globalAlpha*=ag_eo(u);ctx.drawImage(img,x,y+dy,22,32+(row?6:0));
    // the chain, from the book's foot to the rod
    ctx.strokeStyle=rgba(DM.iron,0.7);ctx.lineWidth=1.4;ctx.setLineDash([3,2]);ctx.beginPath();ctx.moveTo(x+11,y+dy+30);ctx.quadraticCurveTo(x+14,y+(row?DM_LIB.shelf+80-y:100)*0.7,x+12,row?DM_LIB.shelf+88:DM_LIB.top+100);ctx.stroke();ctx.setLineDash([]);ctx.restore();}}

/* ---------------------------------------------------------------- three copies of one line
   A table from above; three sheets, each copied from the one before: "Two drops each morning" becomes "Ten drops each morning",
   then "Ten drops each evening". The changed word is marked in amber when o.mark is on. */
AG_PLACES.dmTable=c=>{dm_boards(c,0,0,W,H,[150,112,78],{n:9,seed:12});
  const v=c.createRadialGradient(1200,420,100,1100,540,1300);v.addColorStop(0,"rgba(255,244,220,0.18)");v.addColorStop(1,"rgba(30,18,8,0.32)");c.fillStyle=v;c.fillRect(0,0,W,H);};
const DM_COPIES=[{kick:"The book",words:["Two","drops","each","morning"],bad:[]},{kick:"A copy",words:["Ten","drops","each","morning"],bad:[0]},
  {kick:"A copy of the copy",words:["Ten","drops","each","evening"],bad:[0,3]}];
// one sheet: its middle at x, y, turned rot; a: how far it has appeared; mark: the amber marks on its changed words (0..1)
function dm_sheet(ctx,i,x,y,rot,a,mark){if(a<=0)return;const C=DM_COPIES[i],w=560,h=250;ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.translate(x,y+(1-ag_eo(a))*30);ctx.rotate(rot);
  ctx.save();ctx.shadowColor="rgba(30,18,8,0.35)";ctx.shadowBlur=26;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(DM.parch,1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ag_soft(ctx,cc=>cc.rect(-w/2,-h/2,w,h),DM.parch,[255,252,240],w*0.3,-h*0.3,w*0.7,"rgba(120,90,40,0.22)",16);
  ag_T(ctx,C.kick.toUpperCase(),-w/2+40,-h/2+62,{w:700,size:28,ls:4,col:AG.kick});
  // the line, word by word, so a changed word can be marked
  let xx=-w/2+40;const yy=34;for(let k=0;k<C.words.length;k++){const wd=C.words[k],ww=ag_tw(ctx,wd,{w:700,size:44}),bad=C.bad.includes(k);
    if(bad&&mark>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.9*mark);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(xx-4,yy+16);ctx.lineTo(xx-4+(ww+8)*ag_sine(mark),yy+16);ctx.stroke();ctx.restore();}
    ag_T(ctx,wd,xx,yy,{w:700,size:44,col:bad&&mark>0?mix(DM.ink,AG.amber,mark):DM.ink});xx+=ww+ag_tw(ctx," ",{w:700,size:44});}
  ctx.restore();}

/* ---------------------------------------------------------------- the printing timeline, on a plaster wall */
AG_PLACES.dmWall=c=>{dm_plaster(c,0,0,W,H,DM.plaster,23);c.save();c.globalCompositeOperation="screen";dm_glow(c,1700,300,900,0.2);c.restore();
  const sk=c.createLinearGradient(0,880,0,H);sk.addColorStop(0,"rgba(60,46,32,0)");sk.addColorStop(1,"rgba(60,46,32,0.14)");c.fillStyle=sk;c.fillRect(0,880,W,200);};

/* ---------------------------------------------------------------- Bi Sheng's bench, in the 1040s, from above
   A tray of clay pieces at the left, an iron plate with an iron frame in the middle, warm from a fire under it, paper at the right.
   No character is drawn: the pieces show their tops, plain when clean and dark when inked; the printed page shows soft grey marks in
   columns, read from the right. */
const DM_IRON={tray:[150,250,430,540],plate:[720,230,560,600],frame:[780,290,440,480],paper:[1400,250,400,560],cols:10,rows:10,cell:44};
function dm_pieceSprite(kind){return dm_sprite("piece-"+kind,48,48,c=>{const col=kind==="bronze"?DM.bronze:DM.clay,hi=kind==="bronze"?DM.bronzeLt:DM.clayLt;
  ag_soft(c,cc=>ag_rect(cc,4,4,38,38,6),col,hi,34,10,40,rgba(ag_dk(col,0.6),0.55),8);
  if(kind==="inked")ag_soft(c,cc=>ag_rect(cc,9,9,28,28,4),[52,46,46],[110,104,104],30,14,24,"rgba(0,0,0,0.4)",4);
  else{c.strokeStyle=rgba(ag_dk(col,0.35),0.5);c.lineWidth=1.5;c.strokeRect(10,10,26,26);}});}
AG_PLACES.dmBench=c=>{dm_boards(c,0,0,W,H,[132,98,66],{n:8,seed:31});
  const v=c.createRadialGradient(1100,420,100,960,540,1300);v.addColorStop(0,"rgba(255,240,214,0.16)");v.addColorStop(1,"rgba(30,18,8,0.34)");c.fillStyle=v;c.fillRect(0,0,W,H);
  const [tx,ty,tw,th]=DM_IRON.tray,[px,py,pw,ph]=DM_IRON.plate,[fx,fy,fw,fh]=DM_IRON.frame,[qx,qy,qw,qh]=DM_IRON.paper,n=DM_IRON.cell;
  // the tray: a shallow wooden box with compartments
  ag_floorShadow(c,tx+tw/2-12,ty+th+10,tw*0.6,30,0.35);
  ag_soft(c,cc=>ag_rect(cc,tx,ty,tw,th,10),[110,78,50],[170,130,90],tx+tw,ty,300,"rgba(20,12,6,0.5)",10);
  ag_inner(c,cc=>ag_rect(cc,tx+16,ty+16,tw-32,th-32,6),"rgba(20,12,6,0.6)",14,-4,4);
  c.strokeStyle="rgba(70,48,28,0.8)";c.lineWidth=3;for(let i=1;i<9;i++){c.beginPath();c.moveTo(tx+16+i*(tw-32)/9,ty+16);c.lineTo(tx+16+i*(tw-32)/9,ty+th-16);c.stroke();}
  for(let j=1;j<11;j++){c.beginPath();c.moveTo(tx+16,ty+16+j*(th-32)/11);c.lineTo(tx+tw-16,ty+16+j*(th-32)/11);c.stroke();}
  // the iron plate, warm at its edges from the fire under it, and the iron frame on it
  ag_floorShadow(c,px+pw/2-14,py+ph+14,pw*0.62,36,0.4);
  c.save();c.globalCompositeOperation="screen";dm_glow(c,px+pw/2,py+ph/2,pw*0.75,0.22,[255,150,70]);c.restore();
  ag_soft(c,cc=>ag_rect(cc,px,py,pw,ph,12),DM.iron,DM.ironLt,px+pw,py,520,"rgba(0,0,0,0.5)",16);
  ag_soft(c,cc=>{ag_rect(cc,fx-16,fy-16,fw+32,fh+32,6);ag_rect(cc,fx,fy,fw,fh,2);},[88,90,96],[160,162,168],fx+fw,fy,400,"rgba(0,0,0,0.5)",8);
  c.save();ag_shape(c,cc=>{ag_rect(cc,fx-16,fy-16,fw+32,fh+32,6);});c.clip();c.fillStyle="rgba(0,0,0,0)";c.restore();
  // a dark paste on the plate inside the frame: resin, wax and paper ash, to hold the pieces
  c.fillStyle="rgba(46,40,36,0.85)";c.fillRect(fx,fy,fw,fh);
  // paper at the right, a few sheets
  for(let k=2;k>=0;k--)ag_soft(c,cc=>ag_rect(cc,qx+k*8,qy+k*8,qw,qh,3),DM.paper,[255,255,250],qx+qw,qy,420,"rgba(80,66,40,0.22)",12);};
// where piece k sits: in the tray (its compartment) and in the frame (column by column from the right, top to bottom)
function dm_ironSlot(k){const [tx,ty,tw,th]=DM_IRON.tray,[fx,fy]=DM_IRON.frame,n=DM_IRON.cell,c=Math.floor(k/DM_IRON.rows),r=k%DM_IRON.rows;
  const ti=k%9,tj=Math.floor(k/9)%11,tray=[tx+16+(ti+0.5)*(tw-32)/9,ty+16+(tj+0.5)*(th-32)/11];
  return{tray,frame:[fx+(DM_IRON.cols-1-c+0.5)*n,fy+(r+0.5)*(48)]};}
// the pieces: made (0..1, appearing in the tray), set (0..1, flying into the frame), inked (0..1), back (0..1, flying home)
function dm_ironPieces(ctx,made,set,inked,back){const N=DM_IRON.cols*DM_IRON.rows;for(let k=0;k<N;k++){const s=dm_ironSlot(k),f=k/N;
    const m=clamp((made-f*0.92)/0.08,0,1);if(m<=0)continue;const u=ag_sine(clamp(set*1.6-f*0.6,0,1)),b=ag_sine(clamp(back*1.6-(1-f)*0.6,0,1)),g=u*(1-b);
    let x=lerp(s.tray[0],s.frame[0],g),y=lerp(s.tray[1],s.frame[1],g);const lift=Math.sin(Math.PI*(u<1?u:b))*30*(u>0&&u<1||b>0&&b<1?1:0);
    const img=dm_pieceSprite(inked>0&&g>0.98?"inked":"clay"),z=1+lift/120;ctx.save();ctx.globalAlpha*=ag_eo(m);
    if(lift>0){ctx.fillStyle="rgba(20,12,6,0.18)";ctx.fillRect(x-17+lift*0.2,y-15+lift*0.4,34,34);}
    ctx.drawImage(img,x-22*z,y-22*z-lift*0.3,44*z,44*z);if(inked>0&&inked<1&&g>0.98){ctx.globalAlpha*=inked;ctx.drawImage(dm_pieceSprite("inked"),x-22,y-22,44,44);}ctx.restore();}}
// a printed sheet: soft grey marks in columns, from the right, inside a ruled border; p (0..1) how much has come through
function dm_printed(ctx,x,y,w,h,p,o){o=o||{};if(p<=0)return;const cols=o.cols||10,rows=o.rows||10,seed=o.seed||8,key="printed:"+[Math.round(w),Math.round(h),cols,rows,seed].join(":");
  // the page's marks are painted once, softly, and kept: grey shapes in columns read from the right, never characters
  const img=ag_kept(key,Math.ceil(w)+8,Math.ceil(h)+8,c=>{const r=ag_rnd(seed),cw=w/cols,ch=h/rows;c.translate(4,4);
    c.strokeStyle="rgba(60,56,56,0.45)";c.lineWidth=2;c.strokeRect(0,0,w,h);
    for(let k=0;k<cols;k++){const cx=w-(k+0.5)*cw;if(k>0){c.strokeStyle="rgba(60,56,56,0.2)";c.lineWidth=1;c.beginPath();c.moveTo(w-k*cw,0);c.lineTo(w-k*cw,h);c.stroke();}
      c.save();c.filter="blur("+Math.max(0.8,cw*0.06)+"px)";for(let j=0;j<rows;j++){if(r()<0.07)continue;const v=r(),sz=cw*(0.44+r()*0.08);c.fillStyle=rgba([48,44,46],0.42+v*0.3);
        rr(c,cx-sz/2,(j+0.5)*ch-sz/2,sz,sz*(0.86+r()*0.16),sz*0.22);c.fill();}c.restore();}});
  ctx.save();ctx.globalAlpha*=clamp(p,0,1);ctx.drawImage(img,x-4,y-4);ctx.restore();}

/* ---------------------------------------------------------------- Korea, 1377: a book printed with metal pieces, on a cloth */
AG_PLACES.dmCloth=c=>{c.fillStyle="#D9CFBD";c.fillRect(0,0,W,H);const r=ag_rnd(51);
  // the weave: fine crossing threads, lighter where the light falls
  c.strokeStyle="rgba(120,104,80,0.08)";c.lineWidth=1;for(let x=0;x<W;x+=5){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<H;y+=5){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  for(let i=0;i<14;i++){const y=r()*H;c.strokeStyle="rgba(120,104,80,0.1)";c.lineWidth=2+r()*3;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(600,y+(r()-0.5)*60,1300,y+(r()-0.5)*60,W,y+(r()-0.5)*40);c.stroke();}
  const v=c.createRadialGradient(1150,420,100,960,540,1250);v.addColorStop(0,"rgba(255,248,232,0.26)");v.addColorStop(1,"rgba(40,30,18,0.34)");c.fillStyle=v;c.fillRect(0,0,W,H);};
// a book bound with thread through five holes on its right edge, closed (open 0) or open on two pages (open 1); its middle at x, y
function dm_threadBook(ctx,x,y,open,o){o=o||{};const w=420,h=600,cov=[176,148,104];ctx.save();
  ag_floorShadow(ctx,x-20,y+h/2+6,w*(0.7+0.6*open),30,0.35);
  if(open<1){const k=1-ag_sine(open);ctx.save();ctx.globalAlpha*=k;ag_soft(ctx,cc=>ag_rect(cc,x-w/2,y-h/2,w,h,6),cov,ag_lt(cov,0.3),x+w/2,y-h/2,500,"rgba(60,40,20,0.4)",14);
    // the title slip, plain, and the five stitches on the right
    ag_soft(ctx,cc=>ag_rect(cc,x-w/2+40,y-h/2+40,70,300,3),[236,228,210],[255,252,244],x,y-h/2,200,"rgba(80,60,30,0.2)",6);
    ctx.strokeStyle="rgba(250,246,236,0.9)";ctx.lineWidth=4;for(let i=0;i<5;i++){const sy=y-h/2+60+i*(h-120)/4;ctx.beginPath();ctx.moveTo(x+w/2-34,sy);ctx.lineTo(x+w/2,sy);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(x+w/2-34,y-h/2+60);ctx.lineTo(x+w/2-34,y+h/2-60);ctx.stroke();ctx.restore();}
  if(open>0){const k=ag_sine(open);ctx.save();ctx.globalAlpha*=k;for(const sd of [-1,1]){const px=sd<0?x-w:x;
      ag_soft(ctx,cc=>ag_rect(cc,px,y-h/2,w,h,4),[244,236,216],[255,252,244],px+w,y-h/2,500,"rgba(90,70,40,0.25)",14);
      dm_printed(ctx,px+46,y-h/2+60,w-92,h-120,1,{cols:8,rows:12,seed:sd<0?61:62});}
    const g=ctx.createLinearGradient(x-30,0,x+30,0);g.addColorStop(0,"rgba(90,70,40,0)");g.addColorStop(0.5,"rgba(90,70,40,0.28)");g.addColorStop(1,"rgba(90,70,40,0)");ctx.fillStyle=g;ctx.fillRect(x-30,y-h/2,60,h);ctx.restore();}
  ctx.restore();}
// metal pieces in a small tray, seen from above, bronze, catching the light
function dm_bronzeTray(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+150,y+250,190,24,0.35);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,300,240,10),[96,70,44],[150,112,72],x+300,y,260,"rgba(20,12,6,0.5)",10);ag_inner(ctx,cc=>ag_rect(cc,x+14,y+14,272,212,6),"rgba(20,12,6,0.6)",12,-3,3);
  for(let i=0;i<6;i++)for(let j=0;j<5;j++){if((i*7+j*3)%11===4)continue;ctx.drawImage(dm_pieceSprite("bronze"),x+22+i*44,y+22+j*40,40,40);}ctx.restore();}

/* ---------------------------------------------------------------- Mainz, around 1450: the workshop
   A timber-framed room: a wooden screw press in the middle, sheets drying on a line under the beams, a case of letters at the left,
   paper on a bench. Gutenberg stands at the press; Johann Fust comes in from the right. */
const DM_PRESS={x:760,w:420,head:150,bed:600};
function dm_timber(c,x,y,w,h,col){ag_soft(c,cc=>cc.rect(x,y,w,h),col||DM.woodDk,DM.wood,x+w,y,Math.max(w,h),"rgba(20,12,6,0.45)",8);}
AG_PLACES.dmMainz=c=>{const F=800;dm_plaster(c,0,0,W,F,[226,214,192],37);
  // the timber frame: posts, a rail, braces
  dm_timber(c,0,0,W,40);dm_timber(c,0,330,W,30);for(const x of [0,420,860,1500,1880])dm_timber(c,x,0,40,F);
  for(const [x0,y0,x1,y1] of [[460,360,860,780],[1540,360,1880,760]]){ag_soft(c,cc=>{cc.moveTo(x0,y0);cc.lineTo(x0+44,y0);cc.lineTo(x1,y1);cc.lineTo(x1-44,y1);cc.closePath();},DM.woodDk,DM.wood,x1,y0,400,"rgba(20,12,6,0.45)",8);}
  // a small leaded window high on the right, its light
  c.save();dm_window(c,1610,120,190,180,{pane:30});c.restore();c.save();c.globalCompositeOperation="screen";dm_glow(c,1600,520,700,0.26);c.restore();
  // the floor
  dm_boards(c,0,F,W,H-F,[150,116,82],{n:6,seed:8});const sh=c.createLinearGradient(0,F,0,H);sh.addColorStop(0,"rgba(40,26,14,0.35)");sh.addColorStop(0.25,"rgba(40,26,14,0)");c.fillStyle=sh;c.fillRect(0,F,W,H-F);
  // printed sheets drying on a line under the beams
  c.strokeStyle="rgba(70,60,50,0.6)";c.lineWidth=2;c.beginPath();c.moveTo(40,92);c.quadraticCurveTo(960,128,1880,92);c.stroke();
  for(let i=0;i<9;i++){const x=120+i*190,y=96+Math.sin((x/1920)*Math.PI)*28;ag_soft(c,cc=>{cc.moveTo(x,y);cc.lineTo(x+120,y);cc.lineTo(x+118,y+150);cc.lineTo(x+2,y+150);cc.closePath();},DM.paper,[255,255,250],x+120,y,200,"rgba(90,70,40,0.25)",10);
    c.fillStyle="rgba(60,56,56,0.35)";for(const cx of [x+14,x+64])for(let r=0;r<14;r++)c.fillRect(cx,y+16+r*9,44,3);
    c.fillStyle="rgba(150,54,40,0.7)";c.fillRect(x+14,y+16,10,10);}
  // the case of letters at the left: a slanted tray of small boxes on a stand
  ag_soft(c,cc=>ag_rect(cc,110,560,24,F+20-560,4),DM.woodDk,DM.wood,130,620,100,"rgba(20,12,6,0.45)",6);ag_soft(c,cc=>ag_rect(cc,370,560,24,F+20-560,4),DM.woodDk,DM.wood,390,620,100,"rgba(20,12,6,0.45)",6);
  ag_soft(c,cc=>{cc.moveTo(80,580);cc.lineTo(420,580);cc.lineTo(400,430);cc.lineTo(100,430);cc.closePath();},DM.wood,DM.woodLt,400,440,300,"rgba(20,12,6,0.45)",10);
  c.strokeStyle="rgba(50,34,20,0.7)";c.lineWidth=2;for(let i=0;i<=8;i++){const u=i/8;c.beginPath();c.moveTo(lerp(100,400,u),436);c.lineTo(lerp(84,416,u),576);c.stroke();}
  for(let j=1;j<5;j++){const v=j/5,y=lerp(436,576,v);c.beginPath();c.moveTo(lerp(100,84,v),y);c.lineTo(lerp(400,416,v),y);c.stroke();}
  // a bench with paper at the right
  ag_soft(c,cc=>ag_rect(cc,1560,640,300,26,4),DM.woodDk,DM.woodLt,1860,640,300,"rgba(20,12,6,0.45)",6);for(const x of [1580,1820])ag_soft(c,cc=>ag_rect(cc,x,666,20,F+20-666,3),DM.woodDk,DM.wood,x+20,700,80,"rgba(20,12,6,0.4)",4);
  for(let k=0;k<6;k++)ag_soft(c,cc=>ag_rect(cc,1590+k*2,626-k*5,240,8,1),DM.paper,[255,255,250],1830,600,200,"rgba(90,70,40,0.2)",3);
  // the press: two cheeks, a head, the screw, the platen, the bed on its rails
  const {x,w,head,bed}=DM_PRESS;ag_floorShadow(c,x+w/2-20,F+50,w*0.9,40,0.4);
  for(const px of [x,x+w-70])ag_soft(c,cc=>ag_rect(cc,px,head-40,70,F+40-head+40,6),DM.woodDk,DM.wood,px+70,head+120,300,"rgba(20,12,6,0.5)",12);
  ag_soft(c,cc=>ag_rect(cc,x-30,head-10,w+60,80,8),DM.woodDk,DM.woodLt,x+w,head,400,"rgba(20,12,6,0.5)",12);
  ag_soft(c,cc=>ag_rect(cc,x+50,head+250,w-100,40,6),DM.woodDk,DM.woodLt,x+w,head+250,300,"rgba(20,12,6,0.5)",8);
  // the screw: a thick wooden spindle with its thread
  const sx=x+w/2;ag_soft(c,cc=>ag_rect(cc,sx-30,head+70,60,180,8),DM.wood,DM.woodLt,sx+30,head+80,120,"rgba(20,12,6,0.5)",8);
  c.strokeStyle="rgba(40,26,14,0.55)";c.lineWidth=4;for(let k=0;k<7;k++){const y=head+84+k*24;c.beginPath();c.moveTo(sx-30,y+10);c.quadraticCurveTo(sx,y-4,sx+30,y-10);c.stroke();}
  // the platen, and the bed under it, running out to the front on its rails
  ag_soft(c,cc=>ag_rect(cc,sx-120,head+300,240,40,4),DM.woodDk,DM.woodLt,sx+120,head+300,200,"rgba(20,12,6,0.5)",6);
  ag_soft(c,cc=>ag_rect(cc,x-120,bed,w+240,34,6),DM.woodDk,DM.woodLt,x+w+120,bed,400,"rgba(20,12,6,0.5)",8);
  ag_soft(c,cc=>ag_rect(cc,x-110,bed-14,w+60,16,3),[80,82,88],[150,150,156],x+w,bed-14,300,"rgba(0,0,0,0.4)",4);
  for(const px of [x-100,x+w+80])ag_soft(c,cc=>ag_rect(cc,px,bed+34,24,F+30-bed-34,4),DM.woodDk,DM.wood,px+24,bed+60,80,"rgba(20,12,6,0.45)",4);};
// the bar Gutenberg pulls: from the screw out to the left, swinging a little as it turns (pull 0..1)
function dm_pressBar(ctx,pull){const {x,w,head}=DM_PRESS,sx=x+w/2,y=head+170,len=lerp(250,190,ag_sine(pull));
  ag_soft(ctx,cc=>{cc.moveTo(sx,y-10);cc.lineTo(sx-len,y-14+pull*6);cc.lineTo(sx-len,y+2+pull*6);cc.lineTo(sx,y+12);cc.closePath();},[60,62,66],[150,150,156],sx-len,y-14,200,"rgba(0,0,0,0.4)",4);
  ag_soft(ctx,cc=>ag_rect(cc,sx-len-46,y-18+pull*6,56,26,12),DM.wood,DM.woodLt,sx-len,y-18,60,"rgba(20,12,6,0.4)",4);return[sx-len-24,y-4+pull*6];}
// a printed page of the 1450s: two columns of even lines, a red mark at the head; at x, y, w wide; a: how far it has come
function dm_page42(ctx,x,y,w,a,o){o=o||{};if(a<=0)return;const h=w*1.42;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(30,18,8,0.3)";ctx.shadowBlur=18;ctx.shadowOffsetX=-6;ctx.shadowOffsetY=8;ctx.fillStyle=rgba(DM.paper,1);ctx.fillRect(x,y,w,h);ctx.restore();
  const cw=w*0.36,g=w*0.06,lx=x+w*0.1,n=o.lines||28,lh=h*0.78/n;ctx.fillStyle="rgba(40,36,38,0.7)";
  for(const cx of [lx,lx+cw+g])for(let i=0;i<n;i++){const ww=i===n-1?cw*0.6:cw;ctx.fillRect(cx,y+h*0.1+i*lh,ww,Math.max(1.4,lh*0.42));}
  ctx.fillStyle="rgba(168,52,40,0.85)";ctx.fillRect(lx,y+h*0.1,cw*0.16,lh*3.2);ctx.restore();}
// the pieces Gutenberg brought together, as cards: icon, title, sub; k springs it in
function dm_piece(ctx,x,y,w,icon,title,sub,a,k){if(a<=0)return;const h=232;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,k==null?1:k));
  ag_box(ctx,x,y,w,h,20,{});ctx.save();ctx.translate(x+w/2,y+70);dm_icon(ctx,icon);ctx.restore();
  ag_T(ctx,title,x+w/2,y+156,{w:700,size:32,align:"center"});if(sub)ag_T(ctx,sub,x+w/2,y+196,{w:500,size:28,align:"center",col:AG.mut});ctx.restore();}
// the pieces' small pictures, about 120 x 90, centred on the origin
function dm_icon(ctx,kind){if(typeof DM_ICONS!=="undefined"&&DM_ICONS[kind])return DM_ICONS[kind](ctx);
  if(kind==="sorts"){for(const dx of [-44,0,44]){ag_soft(ctx,cc=>ag_rect(cc,dx-16,-40,32,76,3),[120,118,112],[200,198,190],dx+16,-40,60,"rgba(0,0,0,0.4)",4);
      ag_soft(ctx,cc=>ag_rect(cc,dx-14,-44,28,12,2),[96,94,90],[170,168,160],dx+14,-44,30,null);ctx.save();ctx.translate(dx,-26);ctx.scale(-1,1);ag_T(ctx,"a",0,8,{w:800,size:28,align:"center",col:[40,38,40],deco:1});ctx.restore();}}
  else if(kind==="ink"){ag_soft(ctx,cc=>ag_rect(cc,-8,-46,16,46,4),DM.wood,DM.woodLt,8,-46,40,"rgba(20,12,6,0.4)",3);
    ag_soft(ctx,cc=>{cc.ellipse(0,10,52,30,0,0,TAU);},[120,84,56],[190,150,110],20,0,60,"rgba(20,12,6,0.45)",8);
    ag_soft(ctx,cc=>{cc.ellipse(0,30,46,12,0,0,TAU);},[34,30,32],[110,104,110],14,26,40,null);}
  else if(kind==="press"){for(const px of [-50,34])ag_soft(ctx,cc=>ag_rect(cc,px,-46,16,92,3),DM.woodDk,DM.wood,px+16,-40,40,"rgba(20,12,6,0.4)",3);
    ag_soft(ctx,cc=>ag_rect(cc,-60,-50,120,16,3),DM.woodDk,DM.woodLt,60,-50,80,"rgba(20,12,6,0.4)",3);ag_soft(ctx,cc=>ag_rect(cc,-8,-34,16,34,3),DM.wood,DM.woodLt,8,-34,30,null);
    ag_soft(ctx,cc=>ag_rect(cc,-30,0,60,10,2),DM.woodDk,DM.woodLt,30,0,40,null);ag_soft(ctx,cc=>ag_rect(cc,-62,22,124,10,2),DM.woodDk,DM.woodLt,62,22,60,null);
    ctx.strokeStyle="rgba(60,62,66,0.9)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(-64,-14);ctx.stroke();}
  else if(kind==="paper"){for(let k=3;k>=0;k--)ag_soft(ctx,cc=>ag_rect(cc,-46+k*6,-44+k*5,80,96,2),DM.paper,[255,255,250],40,-44,120,"rgba(90,70,40,0.25)",6);}
  else if(kind==="purse"){ag_soft(ctx,cc=>{cc.moveTo(-30,-30);cc.bezierCurveTo(-60,-6,-56,40,0,44);cc.bezierCurveTo(56,40,60,-6,30,-30);cc.closePath();},[118,74,48],[190,140,100],30,-20,70,"rgba(30,16,8,0.5)",8);
    ctx.strokeStyle="rgba(70,40,24,0.9)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-32,-28);ctx.quadraticCurveTo(0,-20,32,-28);ctx.stroke();
    for(const [cx,cy] of [[46,30],[62,20],[54,40]]){ag_soft(ctx,cc=>{cc.ellipse(cx,cy,14,9,0,0,TAU);},[196,160,70],[250,226,150],cx+6,cy-4,16,"rgba(80,60,10,0.4)",3);}}}

/* ---------------------------------------------------------------- the printing timeline on the plaster wall
   The film's oak rail, here for printing: China in the 1040s, Korea in 1377, Mainz around 1450, four hundred years apart. Under each
   tab, what it brought; a bracket under them all says how long it took. */
const DM_PRINT={y:360,ppy:2.6,focus:1245,years:[[1040,"1040s","China","clay pieces"],[1377,"1377","Korea","metal pieces"],[1450,"1450","Mainz","the press"]]};
// lit: per tab (0..1); a: how far each tab's words have come; span: the bracket (0..1)
function dm_printRail(ctx,o){o=o||{};const R=DM_PRINT,lit=o.lit||[1,1,1],a=o.a||[1,1,1];
  const X=dm_rail(ctx,{y:R.y,ppy:R.ppy,focus:o.focus||R.focus,draw:o.draw,a:o.railA,years:R.years.map((v,i)=>({y:v[0],label:v[1],lit:lit[i],a:a[i]}))});
  R.years.forEach((v,i)=>{if(a[i]<=0)return;const x=X(v[0]);ag_T(ctx,v[2],x,R.y+150,{w:700,size:34,align:"center",a:a[i]});ag_T(ctx,v[3],x,R.y+192,{w:500,size:28,align:"center",col:AG.mut,a:a[i]});});
  if(o.span>0){const x0=X(1040),x1=X(1450),y=R.y+260,u=ag_sine(o.span),xm=(x0+x1)/2;ctx.save();ctx.strokeStyle=rgba(AG.ink,0.55);ctx.lineWidth=3;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(xm-(xm-x0)*u,y-14);ctx.lineTo(xm-(xm-x0)*u,y);ctx.lineTo(xm+(x1-xm)*u,y);ctx.lineTo(xm+(x1-xm)*u,y-14);ctx.stroke();ctx.restore();
    ag_pill(ctx,xm,y+4,o.spanText||"About 400 years",{a:clamp(o.span*2-1,0,1)});}
  return X;}
