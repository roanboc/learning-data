/* ===== Tools are hands, and every hand is a permission: the opening's close views =====
   Things of the story seen close, each drawn whole in the frame (1920 x 1080) in the room's matte way: a page being copied by hand,
   a chain hanging empty, Bodley's letter, the rule's painted board, a chained book open on its desk (a notebook beside it, a candle
   that may not be lit, the chain that stops it leaving the desk), a shelf of chained books close, the declaration a reader signs
   today, and the room in London where Bodley writes. Words are at least 28 px; the handwriting is decoration, too small to read. */

// an oak surface filling the frame: warm planks with a soft grain, lit from the right
function th_oakBoard(c,x,y,w,h,o){o=o||{};const col=o.col||TH.oak,R=ag_rnd(o.seed||3),pw=o.pw||150;
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(th_dim(col,0.16),1));g.addColorStop(1,rgba(th_lit(col,0.12),1));c.fillStyle=g;c.fillRect(x,y,w,h);
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.lineCap="round";
  for(let px=x;px<x+w;px+=pw){c.strokeStyle="rgba(40,26,14,0.28)";c.lineWidth=2;c.beginPath();c.moveTo(px,y);c.lineTo(px,y+h);c.stroke();
    for(let k=0;k<9;k++){const gx=px+10+R()*(pw-20),amp=4+R()*10;c.strokeStyle="rgba(60,40,22,"+(0.06+R()*0.08)+")";c.lineWidth=1.4+R()*1.6;c.beginPath();
      for(let yy=y;yy<=y+h;yy+=24){const xx=gx+Math.sin(yy*0.006+k)*amp;yy===y?c.moveTo(xx,yy):c.lineTo(xx,yy);}c.stroke();}}
  c.restore();}

/* ---------------------------------------------------------------- a page copied by hand
   a page of a manuscript, close: two columns of writing in brown ink, ruled, with a coloured first letter; p (0 to 1) how much is
   written, as the scribe goes; blank (0 to 1) fades the writing away to bare parchment */
function th_page(c,t,o){o=o||{};const p=clamp(o.p==null?1:o.p,0,1),bl=clamp(o.blank||0,0,1);
  th_oakBoard(c,0,0,W,H,{seed:8,col:th_dim(TH.oak,0.12)});
  // the page, a little turned, its soft shadow on the desk
  c.save();c.translate(960,540);c.rotate(-0.025);
  c.save();c.shadowColor="rgba(30,20,10,0.45)";c.shadowBlur=40;c.shadowOffsetX=-14;c.shadowOffsetY=18;c.fillStyle=rgba(TH.parch,1);c.fillRect(-520,-470,1040,940);c.restore();
  const g=c.createRadialGradient(240,-200,80,0,0,820);g.addColorStop(0,"rgba(255,250,236,0.5)");g.addColorStop(1,"rgba(170,140,96,0.32)");c.fillStyle=g;c.fillRect(-520,-470,1040,940);
  // its ruling, faint, and the writing, column by column, row by row
  c.strokeStyle="rgba(160,120,90,0.16)";c.lineWidth=1.2;c.beginPath();for(let r=0;r<24;r++){const y=-360+r*34;c.moveTo(-440,y);c.lineTo(-40,y);c.moveTo(40,y);c.lineTo(440,y);}c.stroke();
  const ink=1-bl;if(ink>0){c.save();c.globalAlpha*=ink;
    // the first letter: a red square with a pale letter cut into it and blue penwork round it
    const ia=clamp(p*6,0,1);if(ia>0){c.save();c.globalAlpha*=ia;c.fillStyle="rgba(150,48,40,0.92)";c.fillRect(-440,-392,104,104);c.fillStyle=rgba(TH.parch,1);
      c.beginPath();c.moveTo(-406,-372);c.lineTo(-370,-372);c.lineTo(-376,-362);c.lineTo(-380,-318);c.lineTo(-370,-308);c.lineTo(-406,-308);c.lineTo(-396,-318);c.lineTo(-392,-362);c.closePath();c.fill();
      c.strokeStyle="rgba(52,74,130,0.75)";c.lineWidth=2.4;c.beginPath();for(let k=0;k<6;k++){c.moveTo(-444,-380+k*20);c.quadraticCurveTo(-462,-372+k*20,-450,-364+k*20);}c.stroke();c.restore();}
    const col1=clamp(p*2,0,1)*22,col2=clamp(p*2-1,0,1)*22;
    th_hand(c,-320,-360,280,4,34,Math.min(4,col1)/4,{seed:31,col:TH.ink,lw:2.4});
    th_hand(c,-440,-224,400,18,34,Math.max(0,col1-4)/18,{seed:37,col:TH.ink,lw:2.4});
    th_hand(c,40,-360,400,22,34,col2/22,{seed:41,col:TH.ink,lw:2.4});
    // where the pen is: a small wet gleam at the end of the line being written
    if(p>0.005&&p<0.995){let x,y;if(p<=0.5){if(col1<4){const r=Math.floor(col1);x=-320+280*(col1-r)*0.92;y=-360+r*34;}else{const n=col1-4,r=Math.floor(n);x=-440+400*(n-r)*0.92;y=-224+r*34;}}
      else{const r=Math.floor(col2);x=40+400*(col2-r)*0.92;y=-360+r*34;}c.fillStyle="rgba(60,40,26,0.9)";c.beginPath();c.arc(x,y,3.4,0,TAU);c.fill();}
    c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- an empty chain, close
   hanging from the rod under a lectern's desk, against its dark oak, swinging slowly (o.sw its swing, radians) */
function th_chainClose(c,t,o){o=o||{};th_oakBoard(c,0,0,W,H,{seed:12,col:th_dim(TH.oak,0.42),pw:220});
  // the desk's lip across the top, lit on its edge, and the iron rod under it
  c.fillStyle=rgba(th_dim(TH.oak,0.1),1);c.fillRect(0,0,W,190);c.fillStyle=rgba(th_lit(TH.oak,0.25),1);c.fillRect(0,182,W,12);
  c.fillStyle=rgba(TH.iron,1);c.fillRect(0,228,W,26);c.fillStyle="rgba(230,226,220,0.32)";c.fillRect(0,232,W,6);
  // a staple round the rod, and the chain hanging from it, its last link open where the book was cut away
  const top=[980,262],L=560,sw=o.sw==null?Math.sin(t*1.1)*0.09:o.sw,end=[top[0]+Math.sin(sw)*L,top[1]+Math.cos(sw)*L];
  c.lineCap="round";c.strokeStyle=rgba(TH.iron,1);c.lineWidth=13;c.beginPath();c.moveTo(980+26,241);c.ellipse(980,241,26,34,0,0,TAU);c.stroke();
  c.strokeStyle="rgba(230,226,220,0.34)";c.lineWidth=4;c.beginPath();c.ellipse(980,241,22,30,0,-1.3,0.2);c.stroke();
  c.save();c.shadowColor="rgba(12,8,4,0.55)";c.shadowBlur=24;c.shadowOffsetX=-30;c.shadowOffsetY=14;th_links(c,[top,end],56,14);c.restore();
  c.save();c.translate(end[0],end[1]+34);c.rotate(-sw);c.strokeStyle=rgba(TH.iron,1);c.lineWidth=12;c.beginPath();c.ellipse(0,0,18,34,0,-1.1,TAU-2.1);c.stroke();
  c.strokeStyle="rgba(236,230,220,0.36)";c.lineWidth=4;c.beginPath();c.ellipse(0,0,14,30,0,-1.0,-0.2);c.stroke();c.restore();}

/* ---------------------------------------------------------------- Bodley's letter
   close, on a table: rows of his hand, too small to read, round the words of his offer, which come as they're said (o.on [3], 0 to 1,
   for seats, shelves and desks) */
const TH_LETTER=["with seates,","and shelfes,","and Deskes"];
function th_letter(c,t,o){o=o||{};th_oakBoard(c,0,0,W,H,{seed:21,col:th_dim(TH.oak,0.2),pw:260});
  c.save();c.translate(960,540);c.rotate(0.02);
  c.save();c.shadowColor="rgba(30,20,10,0.42)";c.shadowBlur=36;c.shadowOffsetX=-12;c.shadowOffsetY=16;c.fillStyle="rgb(240,232,212)";c.fillRect(-640,-560,1280,1120);c.restore();
  const g=c.createRadialGradient(300,-260,100,0,0,900);g.addColorStop(0,"rgba(255,252,240,0.45)");g.addColorStop(1,"rgba(180,150,104,0.28)");c.fillStyle=g;c.fillRect(-640,-560,1280,1120);
  // the folds it was sent in
  c.strokeStyle="rgba(150,120,80,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(-640,-186);c.lineTo(640,-186);c.moveTo(-640,188);c.lineTo(640,188);c.stroke();
  th_hand(c,-540,-440,1080,7,40,1,{seed:51,col:[70,52,40],lw:2.3,a:0.7});
  th_hand(c,-540,130,1080,7,40,1,{seed:57,col:[70,52,40],lw:2.3,a:0.7});
  // the words of the offer, in ink, larger than the rest, each as it's said
  const ws=TH_LETTER,on=o.on||[1,1,1],sz=58;let x=-540;const y=8;
  c.save();const tw=ws.map(w_=>ag_tw(c,w_,{w:600,size:sz})+26);
  // the lines either side of them, in his hand
  th_hand(c,-540,-80,1080,2,40,1,{seed:61,col:[70,52,40],lw:2.3,a:0.7});
  ws.forEach((w_,i)=>{const a=clamp(on[i],0,1);ag_T(c,w_,x,y+sz*0.34,{w:600,size:sz,col:[66,46,32],a:0.18+0.82*a});
    if(a>0){c.save();c.globalAlpha*=a*0.5;c.strokeStyle="rgba(150,104,40,0.55)";c.lineWidth=4;c.lineCap="round";c.beginPath();c.moveTo(x,y+34);c.lineTo(x+tw[i]-30,y+34);c.stroke();c.restore();}
    x+=tw[i];});
  c.restore();c.restore();}

/* ---------------------------------------------------------------- the rule's painted board
   dark painted wood in an oak frame, on the room's stone, its four lines in a pale cream; on[i] (0 to 1) how lit each line is */
const TH_RULE=["Read here.","Take no book away.","Mark none.","Bring no flame."];
function th_board(c,t,o){o=o||{};
  // the wall: limestone courses in the window's light
  const g0=c.createLinearGradient(0,0,W,0);g0.addColorStop(0,rgba(th_dim(TH.stone,0.12),1));g0.addColorStop(1,rgba(th_lit(TH.stone,0.18),1));c.fillStyle=g0;c.fillRect(0,0,W,H);
  c.strokeStyle="rgba(110,84,54,0.16)";c.lineWidth=2;c.beginPath();for(let y=40,r=0;y<H;y+=150,r++){c.moveTo(0,y);c.lineTo(W,y);for(let x=(r%2)*130;x<W;x+=260){c.moveTo(x,y);c.lineTo(x,y+150);}}c.stroke();
  th_boardOn(c,420,150,1080,640,TH_RULE,o.on||[1,1,1,1],{size:64});}
// the board alone, on any wall: an oak frame with a moulding that catches the light from the right, a panel painted a warm cream over
// the oak, a little worn, a painted border in red-brown, and lines in dark letters (on[i], 0 to 1, each lit as it's said; faint before)
function th_boardOn(c,bx,by,bw,bh,lines,on,o){o=o||{};const fw=46,size=o.size||64,gap=Math.min(128,(bh-140)/Math.max(1,lines.length-1)),top=by+bh/2-gap*(lines.length-1)/2+size*0.36;
  c.save();c.shadowColor="rgba(30,20,10,0.42)";c.shadowBlur=40;c.shadowOffsetX=-14;c.shadowOffsetY=18;c.fillStyle=rgba(TH.oakDk,1);c.fillRect(bx-fw,by-fw,bw+2*fw,bh+2*fw);c.restore();
  ag_soft(c,cc=>cc.rect(bx-fw,by-fw,bw+2*fw,bh+2*fw),th_dim(TH.oak,0.1),th_lit(TH.oak,0.34),bx+bw,by,700,"rgba(0,0,0,0.35)",10);
  c.strokeStyle="rgba(250,226,180,0.34)";c.lineWidth=3;c.beginPath();c.moveTo(bx-fw+6,by-fw+6);c.lineTo(bx+bw+fw-6,by-fw+6);c.lineTo(bx+bw+fw-6,by+bh+fw-6);c.stroke();
  c.strokeStyle="rgba(30,18,8,0.5)";c.lineWidth=4;c.strokeRect(bx-3,by-3,bw+6,bh+6);
  const g=c.createLinearGradient(bx,by+bh,bx+bw,by);g.addColorStop(0,rgba(TH.parchDk,1));g.addColorStop(1,rgba(TH.parch,1));c.fillStyle=g;c.fillRect(bx,by,bw,bh);
  c.save();c.beginPath();c.rect(bx,by,bw,bh);c.clip();const R=ag_rnd(17);c.lineCap="round";
  for(let k=0;k<26;k++){const gy=by+10+R()*(bh-20),amp=3+R()*6;c.strokeStyle="rgba(150,118,80,"+(0.05+R()*0.07)+")";c.lineWidth=1.2+R()*1.6;c.beginPath();
    for(let x=bx;x<=bx+bw;x+=24){const y=gy+Math.sin(x*0.005+k)*amp;x===bx?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();}
  c.restore();
  ag_inner(c,cc=>cc.rect(bx,by,bw,bh),"rgba(60,40,20,0.5)",16,-5,5);
  c.strokeStyle="rgba(140,60,44,0.62)";c.lineWidth=4;c.strokeRect(bx+34,by+34,bw-68,bh-68);c.lineWidth=1.6;c.strokeRect(bx+46,by+46,bw-92,bh-92);
  lines.forEach((l,i)=>{const a=clamp(on[i]||0,0,1);ag_T(c,l,bx+bw/2,top+i*gap,{w:760,size,align:"center",ls:size>56?2:1,col:[52,36,26],a:0.14+0.86*a});});}

/* ---------------------------------------------------------------- the desk, close
   a chained book open on a sloping oak desk, its chain lying from the book's edge to the rod at the desk's front. o.slide (0 to 1)
   pulls the book towards us, as a reader might carry it off, until the chain draws taut and stops it; o.notes (0 to 1) a small
   notebook of the reader's own beside it, filling with writing; o.candle (0 to 1) a candle at the side, o.cross (0 to 1) crossed out
   in amber */
function th_desk(c,t,o){o=o||{};th_oakBoard(c,0,0,W,H,{seed:5,col:th_lit(TH.oak,0.06),pw:300});
  // the desk's front edge and its rod, along the bottom
  c.fillStyle=rgba(th_dim(TH.oak,0.25),1);c.fillRect(0,960,W,120);c.fillStyle=rgba(th_lit(TH.oak,0.3),1);c.fillRect(0,956,W,8);
  c.fillStyle=rgba(TH.iron,1);c.fillRect(0,1000,W,14);c.fillStyle="rgba(230,226,220,0.3)";c.fillRect(0,1002,W,3);
  const pull=clamp(o.slide||0,0,1),dy=ag_eo(Math.min(1,pull*1.2))*70-(pull>0.83?ag_sine((pull-0.83)/0.17)*8:0);
  // the open book: two leaves of writing over its boards, with its bosses
  const bx=560,by=180+dy,bw=780,bh=560;
  c.save();c.shadowColor="rgba(30,20,10,0.45)";c.shadowBlur=30;c.shadowOffsetX=-12;c.shadowOffsetY=16;c.fillStyle="rgb(96,62,44)";rr(c,bx-24,by-18,bw+48,bh+36,10);c.fill();c.restore();
  for(const sd of [0,1]){const x0=bx+sd*bw/2;const g=c.createLinearGradient(x0,0,x0+bw/2,0);
    g.addColorStop(sd?0:1,"rgb(206,188,150)");g.addColorStop(sd?0.1:0.9,"rgb(234,222,192)");g.addColorStop(sd?1:0,"rgb(240,230,204)");c.fillStyle=g;c.fillRect(x0,by,bw/2,bh);
    th_hand(c,x0+48,by+64,bw/2-96,12,36,1,{seed:70+sd,col:TH.ink,lw:2.2,a:0.75});}
  c.strokeStyle="rgba(120,90,60,0.4)";c.lineWidth=2;c.beginPath();c.moveTo(bx+bw/2,by);c.lineTo(bx+bw/2,by+bh);c.stroke();
  // the chain: from a staple at the book's lower edge to the rod, slack at first and taut once the book is pulled
  const A=[bx+180,by+bh+14],B=[bx+150,1007],len=Math.hypot(A[0]-B[0],(180+560+14+70)-1007)+2,d=Math.hypot(B[0]-A[0],B[1]-A[1]),sag=Math.sqrt(Math.max(0,len*len-d*d))*0.5;
  c.fillStyle=rgba(TH.iron,1);c.fillRect(A[0]-14,A[1]-22,28,16);
  const bow=sag*1.6,pts=[];for(let k=0;k<=16;k++){const u=k/16;pts.push([lerp(A[0],B[0],u)-Math.sin(Math.PI*u)*bow,lerp(A[1],B[1],u)]);}
  th_links(c,pts,24,6);
  // a notebook of the reader's own, beside it
  const na=clamp(o.notesA==null?(o.notes!=null?1:0):o.notesA,0,1);if(na>0){c.save();c.globalAlpha*=na;c.translate(1500,420);c.rotate(0.08);
    c.save();c.shadowColor="rgba(30,20,10,0.4)";c.shadowBlur=22;c.shadowOffsetX=-8;c.shadowOffsetY=10;c.fillStyle="rgb(236,228,206)";c.fillRect(-150,-190,300,380);c.restore();
    c.fillStyle="rgb(110,70,48)";c.fillRect(-150,-190,14,380);th_hand(c,-110,-140,240,9,36,clamp(o.notes||0,0,1),{seed:88,col:[60,46,40],lw:2.2,a:0.85});c.restore();}
  // a candle in its holder, and the amber cross over it
  const ca=clamp(o.candle||0,0,1);if(ca>0){c.save();c.globalAlpha*=ca;const cx=300,cy=560;
    ag_soft(c,cc=>{cc.ellipse(cx,cy+170,110,30,0,0,TAU);},[150,120,60],[230,200,120],cx+40,cy+160,120,"rgba(0,0,0,0.3)",8);
    ag_soft(c,cc=>{cc.rect(cx-30,cy-150,60,320);},[236,228,206],[255,252,240],cx+20,cy-100,200,"rgba(80,60,40,0.3)",8);
    const fl=0.6+0.4*Math.sin(t*9)*Math.sin(t*5.3);c.fillStyle="rgba(255,206,120,0.9)";c.beginPath();c.moveTo(cx,cy-232);c.quadraticCurveTo(cx+22,cy-180,cx,cy-160);c.quadraticCurveTo(cx-22,cy-180,cx,cy-232);c.fill();
    th_light(c,cx,cy-190,90,90,0.25*fl,[255,220,150]);
    const cr=clamp(o.cross||0,0,1);if(cr>0){c.strokeStyle=rgba(AG.amber,0.95);c.lineWidth=14;c.lineCap="round";c.beginPath();c.arc(cx,cy-30,200,-Math.PI/2,-Math.PI/2+TAU*cr);c.stroke();
      if(cr>0.5){const u=(cr-0.5)*2;c.beginPath();c.moveTo(cx-141,cy-171);c.lineTo(cx-141+282*u,cy-171+282*u);c.stroke();}}
    c.restore();}}

/* ---------------------------------------------------------------- a shelf of chained books, close
   one of Bodley's cases square on, a little of it: o.px (px a metre), o.at [x, y] where the case's aisle end and its lowest shelf
   are in the frame; o.glow (0 to 1) lights one book (o.book [shelf, index]) softly, the one someone asks for. The chains are drawn link
   by link */
function th_shelves(c,t,o){o=o||{};const px=o.px||1000,at=o.at||[120,980],i=o.i==null?2:o.i,sd=1,xa=0,xv=(W-at[0])/px+0.1;
  c.fillStyle=rgba(th_dim(TH.oak,0.5),1);c.fillRect(0,0,W,H);
  c.save();c.translate(at[0],at[1]+TH_CASE.shelves[0]*px);c.scale(px,-px);const ch=th_caseFront(c,px,i,sd,xa,xv,{chains:false});c.restore();
  const S=(p)=>[at[0]+p[0]*px,at[1]+TH_CASE.shelves[0]*px-p[1]*px];
  const gb=o.book||[1,6],gl=clamp(o.glow||0,0,1);
  ch.forEach((q,j)=>{const a=S(q.a),b=S(q.b);if(b[0]<-40||a[0]>W+40)return;
    if(gl>0&&q.r===gb[0]&&ch.filter(z=>z.r===q.r).indexOf(q)===gb[1]){const L=S([q.a[0]-q.w,q.yb+q.h]),R2=S([q.a[0],q.yb]);
      c.save();c.globalCompositeOperation="screen";th_light(c,(L[0]+R2[0])/2,(L[1]+R2[1])/2,160,220,0.5*gl,[255,236,190]);c.restore();}
    th_chain(c,a,b,0,{n:Math.max(3,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/16)),lw:Math.max(2,px*0.0035)});});
  // the light from the window, falling across them
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,20,10,0.25)");g.addColorStop(1,"rgba(255,240,210,0.12)");c.fillStyle=g;c.fillRect(0,0,W,H);}

/* ---------------------------------------------------------------- the declaration, today
   a card with the first words of the promise every new reader makes; (x, y) its top left */
const TH_DECL="I hereby undertake not to remove from the Library, or to mark, deface, or injure in any way, any volume…";
function th_decl(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;return ag_textCard(c,x,y,w,{kick:"The reader's declaration",title:TH_DECL},{a,k:o.k});}
// a small card in a hand, for the reader who holds it (figure space, at the near hand)
function th_heldCard(c,h,o){o=o||{};const [x,y]=h.near;c.save();c.translate(x+20,y-70);c.rotate(-0.14);
  c.save();c.shadowColor="rgba(40,30,20,0.3)";c.shadowBlur=14;c.shadowOffsetX=-5;c.shadowOffsetY=8;c.fillStyle="rgb(246,242,232)";c.fillRect(-30,-120,170,124);c.restore();
  c.fillStyle="rgba(110,48,40,0.8)";c.fillRect(-14,-104,40,8);th_hand(c,-14,-80,138,4,20,1,{seed:93,col:[60,56,60],lw:1.8,a:0.6});c.restore();}
// Bodley's letter in his hand, folded once (figure space)
function th_heldLetter(c,h){const [x,y]=h.near;c.save();c.translate(x+16,y-50);c.rotate(-0.1);
  c.save();c.shadowColor="rgba(40,30,20,0.3)";c.shadowBlur=14;c.shadowOffsetX=-5;c.shadowOffsetY=8;c.fillStyle="rgb(240,232,212)";c.fillRect(-20,-150,180,160);c.restore();
  c.strokeStyle="rgba(150,120,80,0.3)";c.lineWidth=2;c.beginPath();c.moveTo(-20,-70);c.lineTo(160,-70);c.stroke();th_hand(c,-4,-130,150,6,20,1,{seed:96,col:[70,52,40],lw:1.8,a:0.65});c.restore();}
// the library's book of statutes in the librarian's hand: closed, or open (o.open 0 to 1) towards the one he shows it to (figure space)
function th_heldStatutes(c,h,open){const [x,y]=h.near,u=clamp(open||0,0,1);c.save();c.translate(x+40,y-70);c.rotate(-0.06);
  const sh=()=>{c.shadowColor="rgba(40,30,20,0.35)";c.shadowBlur=14;c.shadowOffsetX=-5;c.shadowOffsetY=8;};
  if(u<0.5){const k=1-ag_sine(u*2)*0.9;c.save();c.scale(k,1);c.save();sh();c.fillStyle="rgb(86,50,38)";c.fillRect(-10,-150,150,180);c.restore();
    c.strokeStyle="rgba(200,170,110,0.6)";c.lineWidth=2;c.strokeRect(2,-138,126,156);c.restore();}
  else{const k=0.1+ag_sine((u-0.5)*2)*0.9;c.save();c.scale(k,1);c.save();sh();c.fillStyle="rgb(86,50,38)";c.fillRect(-10,-156,300,192);c.restore();
    for(const sd of [0,1]){c.fillStyle=sd?"rgb(238,228,200)":"rgb(226,214,184)";c.fillRect(-2+sd*142,-148,142,176);}
    c.strokeStyle="rgba(120,90,60,0.4)";c.lineWidth=2;c.beginPath();c.moveTo(140,-148);c.lineTo(140,28);c.stroke();
    th_hand(c,12,-122,116,6,24,1,{seed:99,col:TH.ink,lw:1.8,a:0.7});th_hand(c,154,-122,116,6,24,1,{seed:98,col:TH.ink,lw:1.8,a:0.7});c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- a room in London, 1598
   oak panelling, a leaded window on the right letting in the light, a table with papers; for Bodley with his letter */
AG_PLACES.thLondon=c=>{th_oakBoard(c,0,0,W,H,{seed:44,col:th_dim(TH.oak,0.08),pw:240});
  // the panels: framed squares in rows, each with its soft bevel
  for(let r=0;r<4;r++)for(let k=0;k<8;k++){const x=40+k*240,y=60+r*250;if(x>1180&&r<3)continue;ag_soft(c,cc=>cc.rect(x+20,y+20,200,210),th_dim(TH.oak,0.2),th_lit(TH.oak,0.2),x+200,y+30,220,"rgba(0,0,0,0.35)",12);}
  // the window: stone jambs, diamond panes, the daylight
  const wx=1260,wy=90,ww=560,wh=640;c.fillStyle=rgba(th_lit(TH.stone,0.1),1);c.fillRect(wx-30,wy-30,ww+60,wh+60);
  const g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,rgba(TH.glassLt,1));g.addColorStop(1,rgba(TH.glass,1));c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.save();c.beginPath();c.rect(wx,wy,ww,wh);c.clip();c.strokeStyle=rgba(TH.lead,0.4);c.lineWidth=2;c.beginPath();for(let s=-wh;s<ww+wh;s+=44){c.moveTo(wx+s,wy);c.lineTo(wx+s+wh*0.7,wy+wh);c.moveTo(wx+s,wy);c.lineTo(wx+s-wh*0.7,wy+wh);}c.stroke();c.restore();
  c.fillStyle=rgba(th_lit(TH.stone,0.15),1);c.fillRect(wx+ww/2-12,wy,24,wh);c.fillRect(wx,wy+wh*0.42,ww,20);
  th_light(c,wx+ww/2,wy+wh/2,700,700,0.35,[255,246,224]);
  // the table, low across the front, its papers and an inkwell
  c.fillStyle=rgba(th_dim(TH.oak,0.3),1);c.fillRect(0,880,W,200);c.fillStyle=rgba(th_lit(TH.oak,0.2),1);c.fillRect(0,872,W,14);
  ag_grain(c,0,0,W,H,0.05,29);
  const v=c.createRadialGradient(1100,500,300,960,540,1200);v.addColorStop(0,"rgba(30,20,12,0)");v.addColorStop(1,"rgba(30,20,12,0.32)");c.fillStyle=v;c.fillRect(0,0,W,H);};
