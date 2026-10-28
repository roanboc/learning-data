/* ===== Where each piece lives: what moves in the opening =====
   The court's officials and historians, the office and its printers at work, the books laid in their chests, the archives pinned on
   paper as small views (smoke over three of them, chests landing on the five, the gold lines from Jeonju's copy), the road in 1592,
   Jeonju's archive, the scholars and the keepers carrying the chests up the mountain, the cave by night, the books aired in the sun,
   the shelf and the reader today. What doesn't move is painted once (plan.js); what does is drawn here every frame, kept as a sprite
   when it's painted in watercolour, so a frame stays quick. Every name starts with oh_ or OH. */

// ---- sprites: a thing painted once, then drawn where it is ----
function oh_sprite(key,w,h,fn){return wc_kept("ohS:"+key,Math.round(w),Math.round(h),fn);}
// a chest, centred on x with its foot on y, at size s (oh_chest's); o.open (0 to 1) lifts its lid; o.dark, in a cave; o.seal, the paper
// seal across its lid
function oh_chestAt(ctx,x,y,s,o){o=o||{};const op=o.open||0,k=op<0.25?0:op<0.75?0.5:1,w=Math.round(220*s+40),h=Math.round(200*s+30),
    c=oh_sprite(["chest",s,k,o.dark?1:0,o.seal?1:0].join("|"),w,h,q=>{oh_chest(q,w/2,h-6,s,{open:k,dark:o.dark,seed:7});if(o.seal)oh_seal(q,w/2,h-6-120*s,s);});
  ctx.drawImage(c,x-w/2,y-h+6);}
// the seal: a strip of paper down over the lid's edge, its marks, and a red stamp across the join
function oh_seal(ctx,x,y,s){wc_part(ctx,wc_rect(x-16*s,y-10*s,32*s,62*s),OH.paper,1,{seed:91,lw:0.9});oh_marks(ctx,x-10*s,y-4*s,20*s,48*s,2,1,93);
  ctx.save();ctx.fillStyle=rgba([196,52,44],0.85);ctx.fillRect(x-12*s,y+14*s,24*s,22*s);ctx.restore();}
// a stack of bound books lying flat, seen from the front a little above: covers of yellow-brown paper, stitched at the spine
function oh_bookStack(ctx,x,y,w,n,o){o=o||{};const bh=Math.max(4,w*0.09),c=o.col||OH.cover;ctx.save();
  for(let i=0;i<n;i++){const yy=y-i*bh,dx=Math.sin(i*2.3)*w*0.02;ctx.fillStyle=rgba(i%2?c:wc_dim(c,0.06),1);ctx.fillRect(x-w/2+dx,yy-bh,w,bh-1);
    ctx.fillStyle=rgba(OH.paper,0.9);ctx.fillRect(x-w/2+dx+w*0.04,yy-bh*0.62,w*0.92,bh*0.3);ctx.fillStyle=rgba([150,60,50],0.7);for(const k of [0.2,0.45,0.7])ctx.fillRect(x-w/2+dx+w*k,yy-bh,2,bh-1);}
  ctx.fillStyle=rgba(wc_lit(c,0.12),1);ctx.fillRect(x-w/2,y-n*bh-w*0.18,w,w*0.18);ctx.strokeStyle=rgba(wc_dim(c,0.4),0.6);ctx.lineWidth=1.2;ctx.strokeRect(x-w/2,y-n*bh-w*0.18,w,w*0.18);ctx.restore();}

// ---- the court: the officials in two rows down the hall, the historians at their desks at the left ----
// o.write: how far the historians' sheets are written (0 to 1)
function oh_courtDesks(){return wc_kept("ohCourtDesks",W*2,H*2,q=>{q.scale(2,2);OH_HIST.forEach(([X,Z],i)=>{const Zd=Z-0.5,[dx,dy]=oh_ctP(X+0.1,0,Zd),k=OH_CT.f/Zd;
  oh_lowDesk(q,dx,dy,0.95*k,0.34*k,301+i);const [ix,iy]=oh_ctP(X+0.45,0.34,Zd+0.12);wc_part(q,wc_rect(ix-0.08*k,iy-0.03*k,0.16*k,0.05*k),[60,60,66],1,{seed:305+i,lw:0.8});});});}
function oh_court(x,tt,o){o=o||{};const C=OH_CT,P=oh_ctP,L=[];x.drawImage(oh_placeHi("court"),0,0,W,H);
  OH_ROWS.forEach(([X,Z],i)=>L.push([Z,()=>{const [px,py]=P(X,0,Z);person(x,"ohO"+(i+1),px,py,1.62*C.f/Z/560,{pose:"oh_tablet",t:tt+i*0.9,flip:X>0,carry:oh_heldTablet});}]));
  OH_HIST.forEach(([X,Z],i)=>L.push([Z,()=>{const [px,py]=P(X,0,Z),s=1.62*C.f/Z/560,up=Math.sin(tt*1.7+i*2)>0.6;
    oh_floorSit(x,"ohH"+(i+1),px,py,s,{pose:up?"oh_brushUp":"oh_brush",t:tt+i*1.3,flip:false,carry:oh_heldBrush});}]));
  L.sort((a,b)=>b[0]-a[0]).forEach(e=>e[1]());x.drawImage(oh_courtDesks(),0,0,W,H);
  // the sheets on the desks, written as the line goes on
  OH_HIST.forEach(([X,Z],i)=>{const Zd=Z-0.5,a=P(X-0.2,0.345,Zd+0.18),b=P(X+0.25,0.345,Zd+0.18),c=P(X+0.25,0.345,Zd-0.05),d=P(X-0.2,0.345,Zd-0.05);
    x.fillStyle=rgba(OH.paper,1);x.beginPath();[a,b,c,d].forEach(([px,py],j)=>j?x.lineTo(px,py):x.moveTo(px,py));x.closePath();x.fill();
    const w=b[0]-a[0],p=o.write==null?0.5:o.write;x.save();x.fillStyle=rgba(OH.ink,0.55);const n=6,m=Math.round(n*p);for(let k=0;k<m;k++){const cx=b[0]-w*(k+0.5)/n;x.fillRect(cx-1,c[1]-2,2,-(c[1]-a[1])*0.7);}x.restore();});}
// close, from above: a historian's sheet on the low desk, columns of marks written top to bottom and right to left as p goes from 0 to 1,
// the brush in a hand in a green sleeve, the inkstone beside it
const OH_WR={x:520,y:150,w:760,h:640,n:9};
function oh_paintDeskTop(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),OH.maru,{kind:"plaster",line:false,seed:331});
  ctx.save();ctx.strokeStyle=rgba(OH.maruDk,0.35);ctx.lineWidth=2;for(let i=0;i<14;i++){const y=40+i*80+Math.sin(i)*10;ctx.beginPath();ctx.moveTo(-20,y);ctx.bezierCurveTo(600,y+16,1200,y-12,W+20,y+6);ctx.stroke();}ctx.restore();
  const R=OH_WR;ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(70,46,26,0.3)";ctx.fillRect(R.x+16,R.y+20,R.w,R.h);ctx.restore();wc_part(ctx,wc_rect(R.x,R.y,R.w,R.h),OH.hanji,1,{seed:333,lw:1});
  // the inkstone, dark, with its well, and a water dropper; a rest for the brush
  wc_part(ctx,wc_rrPts(1420,320,300,420,30),[70,70,78],1,{seed:335,lw:1.2});wc_flat(ctx,wc_rrPts(1450,350,240,120,24),[24,24,30],1,"trim");wc_flat(ctx,wc_rrPts(1450,490,240,220,20),[48,48,56],1,"trim");
  wc_part(ctx,wc_ell(1560,860,70,56,24),[96,140,150],1,{seed:337,lw:1.1});wc_part(ctx,wc_rect(200,820,240,30),[120,80,56],1,{seed:339,lw:1});}
function oh_writeClose(x,tt,p,o){o=o||{};const R=OH_WR;x.drawImage(gv_place("deskTop"),0,0,W,H);const pp=clamp(p,0,1),done=pp>=1;
  const last=oh_marks(x,R.x+40,R.y+50,R.w-80,R.h-100,R.n,pp,o.seed||341)||[R.x+R.w-80,R.y+70];
  // the brush's point on the mark it's writing, moving a little; lifted off the page when it's done
  const tx=last[0]+(done?18:Math.sin(tt*9)*4),ty=last[1]+(done?30:Math.cos(tt*7)*4);
  oh_hand(x,tx,ty,o.sleeve||OH_GREEN,done);}
// the writer's right hand from above, the arm coming in from below, as if we look over the writer's shoulder: the brush held upright, its
// point at (tx, ty); the robe's wide sleeve, its white cuff
function oh_hand(x,tx,ty,sc,lifted){x.save();x.translate(tx,ty);x.rotate(-0.42);
  if(lifted){x.save();x.filter="blur(6px)";x.fillStyle="rgba(40,30,20,0.18)";x.beginPath();x.ellipse(-10,6,10,6,0,0,TAU);x.fill();x.restore();x.translate(14,-26);}
  // the sleeve, wide and soft, out past the frame's edge
  const sl=[[-62,168],[-90,320],[-150,620],[-210,1000],[300,1000],[220,620],[150,320],[84,170]];wc_wash(x,sl,sc,{kind:"robe",line:true,lw:1.2,seed:351});
  x.save();wc_tr(x,sl);x.clip();x.strokeStyle=rgba(darken(sc,0.3),0.45);x.lineWidth=5;x.lineCap="round";
  for(const [a0,a1] of [[-20,-60],[40,30],[96,130]]){x.beginPath();x.moveTo(a0,200);x.quadraticCurveTo((a0+a1)/2+16,480,a1,900);x.stroke();}
  const g=x.createLinearGradient(-200,0,300,0);g.addColorStop(0,rgba(wc_lit(sc,0.25),0.35));g.addColorStop(0.5,rgba(sc,0));g.addColorStop(1,rgba(darken(sc,0.35),0.35));x.fillStyle=g;x.fillRect(-260,150,620,900);x.restore();
  // the white cuff of the inner robe
  x.fillStyle=rgba([246,242,232],1);x.beginPath();x.moveTo(-58,150);x.quadraticCurveTo(12,136,80,152);x.lineTo(86,178);x.quadraticCurveTo(12,164,-64,176);x.closePath();x.fill();
  x.strokeStyle=rgba([150,140,124],0.6);x.lineWidth=1.5;x.stroke();
  // the brush: wet black point, bamboo shaft
  x.fillStyle=rgba([22,20,22],1);x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(-9,22,-7,46);x.lineTo(7,46);x.quadraticCurveTo(9,22,0,0);x.fill();
  x.fillStyle=rgba([196,170,112],1);x.fillRect(-7,44,14,10);x.fillStyle=rgba([150,112,66],1);x.fillRect(-6,54,12,128);x.fillStyle=rgba([120,86,50],0.8);x.fillRect(-6,118,12,3);
  // the hand: the back of it, the knuckles round the shaft, the thumb on the near side
  const sk=OH_SKIN[3];x.beginPath();x.ellipse(10,126,46,50,0.15,0,TAU);litFill(x,sk,-36,76,56,176);x.strokeStyle=rgba(darken(sk,0.35),0.5);x.lineWidth=1.6;x.stroke();
  x.beginPath();x.ellipse(-34,104,15,24,-0.5,0,TAU);litFill(x,sk,-50,80,-18,128);x.stroke();
  for(const [fx,fy,r] of [[22,86,15],[38,102,14],[46,122,13]]){x.beginPath();x.ellipse(fx,fy,r,r*0.8,0.4,0,TAU);litFill(x,sk,fx-r,fy-r,fx+r,fy+r);x.stroke();}
  x.strokeStyle=rgba(darken(sk,0.3),0.4);x.lineWidth=2;for(const [fx,fy] of [[4,104],[16,118],[22,138]]){x.beginPath();x.moveTo(fx-10,fy+6);x.quadraticCurveTo(fx,fy,fx+10,fy+8);x.stroke();}
  x.restore();}

// ---- the office that makes the annals: four members behind the long table, with the historians' notes ----
const OH_OFS=[["ohS1",520,"oh_lift",oh_heldSheet],["ohS2",820,"oh_brush",oh_heldBrush],["ohS3",1110,"oh_watch",null],["ohS4",1400,"oh_lay",null]];
function oh_office(x,tt,o){o=o||{};x.drawImage(gv_place("annalsOffice"),0,0,W,H);
  OH_OFS.forEach(([id,px,pose,carry],i)=>oh_floorSit(x,id,px,690,0.9,{pose:o.pose&&o.pose(i)||pose,t:tt+i,flip:i>=2,carry}));x.drawImage(oh_officeTable(),0,0,W,H);}

// ---- the printers: the block inked, a sheet laid on it and rubbed, lifted to the pile ----
// o.pile: how many printed sheets are on the pile; o.source (0 to 1): Jeonju's copy, open on a stand at the left, glowing gold
function oh_print(x,tt,o){o=o||{};x.drawImage(gv_place("print"),0,0,W,H);const B=OH_PR.bench,ph=((tt*0.42)%1+1)%1,
    p1=ph<0.35?"oh_ink":ph<0.6?"oh_lay":"oh_reach",p2=ph<0.55?"oh_watch":"oh_lift";
  // they sit on the floor at the low bench, as printers did
  x.save();x.beginPath();x.rect(-W,-H,3*W,B[2]+H);x.clip();oh_floorSit(x,"ohPr1",900,760,0.95,{pose:p1,t:tt,flip:false});
  oh_floorSit(x,"ohPr2",1240,760,0.95,{pose:p2,t:tt+1,flip:true,carry:p2==="oh_lift"?oh_heldSheet:null});x.restore();x.drawImage(oh_printBench(),0,0,W,H);
  // a sheet on the block while it's printed; the pile
  if(ph>0.4&&ph<0.72){const [r0,r1,ry]=OH_PR.tray;x.fillStyle=rgba(OH.paper,0.96);x.fillRect(r0+8,ry-2,r1-r0-16,22);}
  const [q0,q1]=OH_PR.pile,n=Math.round(o.pile==null?6:o.pile);for(let i=0;i<n;i++){x.fillStyle=rgba(i%2?OH.paper:wc_dim(OH.paper,0.05),1);x.fillRect(q0+(i%3),B[2]+10-i*3,q1-q0,3);}
  if(n){x.save();x.fillStyle=rgba(OH.ink,0.35);for(let k=0;k<6;k++)x.fillRect(q0+16+k*24,B[2]+12-n*3-14,10,10);x.restore();}
  const sa=clamp(o.source||0,0,1);if(sa>0.01){withA(x,sa,()=>{x.save();x.globalCompositeOperation="screen";wc_glowAt(x,330,560,260,[255,214,120],0.6);x.restore();
    x.fillStyle=rgba(OH.woodDk,1);x.fillRect(250,600,160,14);x.fillRect(318,614,24,150);
    for(const s of [-1,1]){x.fillStyle=rgba(OH.paper,1);x.beginPath();x.moveTo(330,596);x.lineTo(330+s*110,586);x.lineTo(330+s*110,500);x.lineTo(330,508);x.closePath();x.fill();
      x.strokeStyle=rgba(OH.coverDk,0.8);x.lineWidth=2;x.stroke();oh_marks(x,s>0?342:228,516,88,64,5,1,351+s);}});}}

// ---- the books laid in four chests, each set the same ----
// o.fill(i): how full chest i is (0 to 1); the keepers lay the books in, one chest after another
const OH_CH=[330,750,1170,1590];
function oh_chestOpen(ctx,x,y,s,fill,seed){const w=200*s,h=110*s,d=h*0.5,c=OH.chest;
  // the lid, standing open behind; the opening, dark, the books' top cover rising in it; then the front
  ctx.fillStyle=rgba(wc_dim(c,0.1),1);ctx.fillRect(x-w/2,y-h-d-h*0.7,w,h*0.7);ctx.fillStyle=rgba(OH.brass,1);ctx.fillRect(x-w/2,y-h-d-h*0.7,16*s,16*s);ctx.fillRect(x+w/2-16*s,y-h-d-h*0.7,16*s,16*s);
  ctx.fillStyle=rgba([36,26,20],1);ctx.beginPath();ctx.moveTo(x-w/2,y-h);ctx.lineTo(x+w/2,y-h);ctx.lineTo(x+w/2-8*s,y-h-d);ctx.lineTo(x-w/2+8*s,y-h-d);ctx.closePath();ctx.fill();
  const f=clamp(fill,0,1);if(f>0.01){const rise=lerp(d*0.2,d*0.9,f);ctx.save();ctx.beginPath();ctx.moveTo(x-w/2,y-h);ctx.lineTo(x+w/2,y-h);ctx.lineTo(x+w/2-8*s,y-h-d);ctx.lineTo(x-w/2+8*s,y-h-d);ctx.closePath();ctx.clip();
    ctx.fillStyle=rgba(OH.cover,1);ctx.fillRect(x-w/2+10*s,y-h-rise,w-20*s,rise-4*s);ctx.fillStyle=rgba(wc_dim(OH.cover,0.25),0.8);for(let i=1;i<4;i++)ctx.fillRect(x-w/2+10*s,y-h-rise+i*(rise/4),w-20*s,1.5);
    ctx.fillStyle=rgba([150,60,50],0.7);for(const k of [0.25,0.5,0.75])ctx.fillRect(x-w/2+w*k,y-h-rise,2,rise-4*s);ctx.restore();}
  ctx.drawImage(oh_sprite("chestFront"+s,w+20,h+20,q=>{wc_part(q,wc_rect(10,10,w,h),c,1,{seed,lw:1.1});wc_flat(q,wc_rect(10,10,w,h*0.18),wc_dim(c,0.2),1,"trim");
    for(const [cx,cy] of [[10,10],[10+w-18*s,10],[10,10+h-20*s],[10+w-18*s,10+h-20*s]])wc_flat(q,wc_rect(cx,cy,18*s,20*s),OH.brass,1,"trim");wc_flat(q,wc_rect(10+w/2-14*s,10+h*0.22,28*s,30*s),OH.brass,1,"trim");}),x-w/2-10,y-h-10);}
function oh_chests(x,tt,o){o=o||{};x.drawImage(gv_place("chestRoom"),0,0,W,H);const fill=o.fill||(()=>1);
  // the keepers between the chests, books in their arms
  [["ohK1",540],["ohK2",1380]].forEach(([id,px],k)=>person(x,id,px,800,0.82,{pose:"oh_lay",t:tt+k,flip:k===1,carry:oh_heldStack}));
  OH_CH.forEach((cx,i)=>oh_chestOpen(x,cx,880,1.25,fill(i),361+i));}

// ---- the archives, pinned on paper as small views ----
// The sheet is the place "board"; each view hangs on it at [x, y] (its middle), at scale k, with its name on a tag under it. o.views: the
// keys shown; o.a(k): each view's strength (0 to 1); o.smoke(k), o.dim(k): smoke over a view, and how dark it's gone; o.lit(k): a warm
// glow round a view; o.chest(k): a chest landing on it (0 to 1); o.gold (0 to 1): the gold lines from Jeonju's copy, in the middle, to
// each of the five, round it (o.ring); t, for the smoke
const OH_VIEWS={capital:[700,270,0.82,"the capital"],chungju:[1220,300,0.82,"Chungju"],seongju:[1250,640,0.82,"Seongju"],jeonju:[660,650,0.82,"Jeonju"]};
const OH_VIEWS5={capital:[430,470,1.0,"the capital"],odae:[1060,250,0.78,"Mount Odae"],taebaek:[1500,250,0.78,"Mount Taebaek"],myohyang:[1060,650,0.78,"Mount Myohyang"],mani:[1500,650,0.78,"Mount Mani"]};
const OH_VIEWS5R={capital:[400,290,0.66,"the capital"],myohyang:[960,180,0.62,"Mount Myohyang"],odae:[1520,290,0.66,"Mount Odae"],mani:[430,700,0.66,"Mount Mani"],taebaek:[1490,700,0.66,"Mount Taebaek"]};
function oh_viewAt(ctx,k,V,a,o){o=o||{};if(a<=0.01)return;const [cx,cy,s,name]=V[k],w=OH_VW*s,h=OH_VH*s,u=spring(clamp(a,0,1)),kk=0.9+0.1*u;
  ctx.save();ctx.translate(cx,cy);ctx.scale(kk,kk);withA(ctx,clamp(a*2,0,1),()=>{const lit=clamp(o.lit||0,0,1);if(lit>0.01){ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createRadialGradient(0,0,w*0.3,0,0,w*0.85);
      g.addColorStop(0,rgba(wc_lit(GV.gold,0.3),0.9*lit));g.addColorStop(1,rgba(wc_lit(GV.gold,0.3),0));ctx.fillStyle=g;ctx.fillRect(-w,-h,2*w,2*h);ctx.restore();}
    ctx.fillStyle="rgba(60,44,30,0.2)";ctx.fillRect(-w/2+8,-h/2+10,w,h);ctx.drawImage(oh_view(k),-w/2,-h/2,w,h);
    const dm=clamp(o.dim||0,0,1);if(dm>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([120,96,84],0.75*dm);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();}
    gv_pin(ctx,0,-h/2+12,GV.red,1.1);wc_tag(ctx,0,h/2+40,name,{align:"center",size:30});});ctx.restore();}
function oh_board(x,tt,o){o=o||{};x.drawImage(gv_place("board"),0,0,W,H);const V=o.ring?OH_VIEWS5R:o.five?OH_VIEWS5:OH_VIEWS,f=(fn,k)=>fn==null?0:typeof fn==="function"?fn(k):fn;
  // the gold lines from Jeonju's copy, under the views
  const gd=clamp(o.gold||0,0,1);if(gd>0.01){Object.keys(V).forEach((k,i)=>{const [vx,vy]=V[k],u=clamp(gd*1.6-i*0.15,0,1);if(u<=0.01)return;x.save();x.strokeStyle=rgba(GV.gold,0.9);x.lineWidth=7;x.lineCap="round";
    x.beginPath();x.moveTo(960,540);x.lineTo(lerp(960,vx,easeCam(u)),lerp(540,vy,easeCam(u)));x.stroke();x.restore();});}
  Object.keys(V).forEach(k=>{oh_viewAt(x,k,V,o.a?o.a(k):1,{dim:f(o.dim,k),lit:f(o.lit,k)});const sm=f(o.smoke,k);if(sm>0.01){const [vx,vy,s]=V[k];oh_smoke(x,vx,vy+OH_VH*s*0.2,260*s,tt,sm,{seed:k.length*7});}
    const ch=f(o.chest,k);if(ch>0.01){const [vx,vy,s]=V[k],drop=(1-easeCam(clamp(ch*1.4,0,1)))*-120;withA(x,clamp(ch*3,0,1),()=>oh_chestAt(x,vx+OH_VW*s*0.32,vy+OH_VH*s*0.42+drop,0.42));}});
  if(gd>0.01||o.copy){const a=Math.max(gd>0.01?1:0,clamp(o.copy||0,0,1));withA(x,a,()=>{x.save();x.globalCompositeOperation="screen";wc_glowAt(x,960,540,200,[255,214,120],0.7*a);x.restore();
    oh_bookStack(x,960,600,200,6);wc_tag(x,960,680,"Jeonju's copy",Object.assign({align:"center",size:30},OH_GOLDTAG));});}}
// smoke rising from a place: soft puffs that billow up and drift, dark near the fire, paler as they rise; x, y its foot, h how high it goes
function oh_smoke(ctx,x,y,h,t,a,o){o=o||{};const R=wc_rng(o.seed||5),n=14;ctx.save();
  ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,h*0.35,[255,150,70],0.45*a);ctx.globalCompositeOperation="source-over";
  for(let i=0;i<n;i++){const ph=((t*0.12+i/n+R()*0.05)%1+1)%1,yy=y-ph*h,xx=x+Math.sin(ph*3+i)*h*0.08+ph*h*0.25,r=h*(0.08+ph*0.22),al=a*(1-ph)*0.55;
    const g=ctx.createRadialGradient(xx,yy,0,xx,yy,r);g.addColorStop(0,rgba(mix([70,64,64],[150,146,146],ph),al));g.addColorStop(1,rgba([150,146,146],0));ctx.fillStyle=g;ctx.fillRect(xx-r,yy-r,2*r,2*r);}ctx.restore();}

// ---- not even a king: the sealed chest, close, and a hand in a red sleeve that reaches for it and stops ----
function oh_paintSealRoom(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,560),[214,198,170],{kind:"plaster",line:false,seed:371});
  wc_wash(ctx,wc_rect(-40,520,W+80,H),OH.maru,{kind:"ground",line:false,seed:373});ctx.save();ctx.strokeStyle=rgba(OH.maruDk,0.4);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=540+i*i*9+i*14;ctx.beginPath();ctx.moveTo(-40,y);ctx.lineTo(W+40,y);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(120,-40,60,580),OH.wood,1,{seed:375,lw:1.2});wc_part(ctx,wc_rect(1740,-40,60,580),OH.wood,1,{seed:376,lw:1.2});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,700,200,900,[255,240,206],0.3);ctx.restore();
  oh_chest(ctx,960,900,3.4,{seed:377});oh_seal(ctx,960,900-120*3.4,3.4);}
// reach: 0 to 1, the hand comes in and stops short of the seal; back: 0 to 1, it draws away
function oh_kingHand(x,reach,back){const r=easeCam(clamp(reach,0,1))*(1-easeCam(clamp(back,0,1))),hx=lerp(2200,1140,r),hy=lerp(260,380,r),c=[176,42,40];if(r<=0.01)return;
  x.save();x.beginPath();x.moveTo(hx+40,hy-50);x.lineTo(hx+900,hy-260);x.lineTo(hx+960,hy+80);x.lineTo(hx+60,hy+60);x.closePath();litFill(x,c,hx,hy-200,hx+700,hy+80);x.strokeStyle=rgba(darken(c,0.5),0.5);x.lineWidth=2;x.stroke();
  x.strokeStyle=rgba([226,184,90],0.95);x.lineWidth=12;x.beginPath();x.moveTo(hx+46,hy-46);x.lineTo(hx+64,hy+58);x.stroke();
  // the hand, open, fingers out towards the seal; they curl a little as it stops
  const curl=clamp((reach-0.85)/0.15,0,1)*0.5;x.translate(hx,hy);x.beginPath();x.ellipse(0,0,46,36,0.1,0,TAU);litFill(x,OH_SKIN[1],-46,-36,46,36);seam(x,OH_SKIN[1],0.3,1.4);
  for(let i=0;i<4;i++){const a=Math.PI+0.25-i*0.17+curl;x.beginPath();x.ellipse(Math.cos(a)*60,Math.sin(a)*40+i*6-10,30,10,a,0,TAU);litFill(x,OH_SKIN[1],-90,-50,0,40);seam(x,OH_SKIN[1],0.3,1.2);}
  x.restore();}

// ---- 1592: men marching up the road from the pass, and smoke beyond the hills ----
// u0: where the column's head is along the road (1, the pass; 0, the foot of the frame); they come on as t goes
function oh_march(x,tt,u0,a){if(a<=0.01)return;withA(x,a,()=>{const n=26;for(let i=n-1;i>=0;i--){const u=1-(u0+0)+i*0.022;if(u<0.32||u>1)continue;
  const [px,py,w]=oh_roadAt(u),s=w/240,ph=tt*5+i*1.3,sw=Math.sin(ph),lane=(i%3-1)*w*0.22,cx=px+lane,col=[64,58,58];
  x.save();x.translate(cx,py);x.scale(s,s);x.fillStyle=rgba(col,0.92);x.strokeStyle=rgba(col,0.92);x.lineCap="round";
  x.lineWidth=16;x.beginPath();x.moveTo(-8,-90);x.lineTo(-8+sw*14,-4);x.moveTo(8,-90);x.lineTo(8-sw*14,-4);x.stroke();
  x.beginPath();x.moveTo(-22,-180);x.lineTo(22,-180);x.lineTo(26,-86);x.lineTo(-26,-86);x.closePath();x.fill();x.beginPath();x.arc(0,-204,20,0,TAU);x.fill();
  x.lineWidth=4;x.beginPath();x.moveTo(30,-60);x.lineTo(30,-300);x.stroke();x.beginPath();x.moveTo(30,-316);x.lineTo(24,-298);x.lineTo(36,-298);x.closePath();x.fill();x.restore();}});}

// ---- Jeonju's archive: the chests in its open bay ----
function oh_jeonju(x,tt,o){o=o||{};x.drawImage(oh_placeHi("archive"),0,0,W,H);const [bx,by,bw,bh]=oh_archiveBay();
  x.save();x.globalCompositeOperation="screen";wc_glowAt(x,bx+bw/2,by+bh*0.7,bw*0.7,[255,214,150],0.35);x.restore();
  for(const [dx,dy,s] of [[0.3,0.94,0.3],[0.7,0.94,0.3],[0.5,0.62,0.28]])oh_chestAt(x,bx+bw*dx,by+bh*dy,s);
  if(o.cast)o.cast(x);}

// ---- what would be gone: a page of the annals, open, close ----
function oh_paintBook(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[96,70,52],{kind:"plaster",line:false,seed:381});
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(30,20,10,0.45)";ctx.fillRect(250,130,1440,800);ctx.restore();
  wc_part(ctx,wc_rect(230,110,1460,800),OH.cover,1,{seed:383,lw:1.4});
  for(const s of [-1,1]){const x0=s<0?260:968,w=692;wc_part(ctx,wc_rect(x0,130,w,760),OH.hanji,1,{seed:385+s,lw:1});
    ctx.save();ctx.strokeStyle=rgba([170,70,60],0.55);ctx.lineWidth=2;ctx.strokeRect(x0+40,170,w-80,680);for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(x0+40+(w-80)*i/10,170);ctx.lineTo(x0+40+(w-80)*i/10,850);ctx.stroke();}ctx.restore();
    oh_marks(ctx,x0+44,180,w-88,660,10,1,387+s);}
  ctx.save();const g=ctx.createLinearGradient(900,0,1020,0);g.addColorStop(0,"rgba(60,40,20,0)");g.addColorStop(0.5,"rgba(60,40,20,0.3)");g.addColorStop(1,"rgba(60,40,20,0)");ctx.fillStyle=g;ctx.fillRect(900,130,120,760);ctx.restore();}

// ---- into the mountains: the two scholars lead, the keepers carry the chests on frames on their backs, up the path towards us ----
// each walker: [id, where along the path at t0 (0, the brow; 1, the foot of the frame), a chest on the back?]
function oh_walkers(x,tt,list,v,o){o=o||{};list.map(([id,u0,load],i)=>[id,clamp(u0+v*tt,0,1.05),load,i]).sort((a,b)=>a[1]-b[1]).forEach(([id,u,load,i])=>{if(u<0.02||u>1.04)return;
  const [px,py]=oh_pathAt(Math.min(u,1)),s=oh_pathW(Math.min(u,1))/420,sw=Math.sin(tt*5.2+i*1.7),bob=Math.abs(sw)*6*s,yy=py+(u>1?(u-1)*600:0);
  if(load){// the frame's two poles, and the chest on it, behind the bearer, showing over the shoulders
    x.save();x.strokeStyle=rgba(OH.woodDk,1);x.lineWidth=Math.max(2,11*s);x.lineCap="round";for(const k of [-1,1]){x.beginPath();x.moveTo(px+k*70*s,yy-600*s-bob);x.lineTo(px+k*58*s,yy-170*s-bob);x.stroke();}x.restore();
    oh_chestAt(x,px,yy-430*s-bob,0.95*s*1.6);}
  person(x,id,px,yy-bob,s,{pose:load?"oh_carry":"stand",pose2:sw>0?"walkA":"walkB",mix:Math.abs(sw)*(load?0.5:0.8),t:tt+i,flip:i%2===1});
  if(load){x.save();x.strokeStyle=rgba([120,96,70],1);x.lineWidth=Math.max(1.5,7*s);for(const k of [-1,1]){x.beginPath();x.moveTo(px+k*40*s,yy-470*s-bob);x.quadraticCurveTo(px+k*58*s,yy-420*s-bob,px+k*50*s,yy-330*s-bob);x.stroke();}x.restore();}});}

// ---- the cave by night: the fire, one keeps watch while the other sleeps, in turns ----
// o.swap (0 to 1): they change over; o.snow: winter, snow falling
function oh_fire(x,tt,cx,cy,s){x.save();x.globalCompositeOperation="screen";wc_glowAt(x,cx,cy-40*s,700*s,[255,150,60],0.55);wc_glowAt(x,cx,cy-30*s,260*s,[255,196,110],0.7);x.restore();
  x.fillStyle=rgba([70,50,40],1);for(const k of [-1,1]){x.save();x.translate(cx,cy);x.rotate(k*0.3);x.fillRect(-90*s,-8*s,180*s,16*s);x.restore();}
  for(let i=0;i<7;i++){const ph=tt*3.1+i*1.9,h=(90+30*Math.sin(ph))*s*(1-Math.abs(i-3)/5),w=(26-Math.abs(i-3)*3)*s,fx=cx+(i-3)*16*s+Math.sin(ph*1.3)*6*s;
    x.fillStyle=rgba(i%2?[255,170,70]:[255,214,120],0.9);x.beginPath();x.moveTo(fx-w,cy-6*s);x.quadraticCurveTo(fx-w*0.6,cy-h*0.6,fx+Math.sin(ph)*8*s,cy-h);x.quadraticCurveTo(fx+w*0.6,cy-h*0.6,fx+w,cy-6*s);x.closePath();x.fill();}
  for(let i=0;i<5;i++){const ph=((tt*0.6+i*0.21)%1),sx=cx+Math.sin(i*3+tt)*30*s,sy=cy-60*s-ph*260*s;x.fillStyle=rgba([255,200,120],(1-ph)*0.8);x.fillRect(sx,sy,3*s,3*s);}}
function oh_cave(x,tt,o){o=o||{};x.drawImage(gv_place(o.snow?"caveSnow":"cave"),0,0,W,H);const [fx,fy]=OH_CV.fire,sw=clamp(o.swap||0,0,1),m=easeCam(clamp((sw-0.3)/0.4,0,1));
  [["ohAn",0],["ohSon",1]].forEach(([id,i])=>{const [sx,sy]=OH_CV.seats[i],asleep=i===0?1-m:m;
    oh_floorSit(x,id,sx,sy,0.88,{pose:"oh_watch",pose2:"oh_sleep",mix:asleep,expr:asleep>0.5?"oh_asleep":"calm",t:tt+i,flip:i===1});});
  oh_fire(x,tt,fx,fy,1);
  // the fire lights them warm on its side
  x.save();x.globalCompositeOperation="screen";for(const [sx,sy] of OH_CV.seats)wc_glowAt(x,lerp(sx,fx,0.35),sy-220,260,[255,170,90],0.22);x.restore();
  if(o.snow){x.save();x.fillStyle="rgba(240,244,252,0.85)";for(let i=0;i<120;i++){const R=(i*9301+49297)%233280/233280,sx=((R*W+tt*24*(0.5+R))%W+W)%W,sy=((i*97+tt*(60+R*50))%H+H)%H;x.beginPath();x.arc(sx,sy,1.4+R*2.2,0,TAU);x.fill();}x.restore();}}

// ---- the books aired in the sun, and the historian writing down what he finds ----
// o.books (0 to 1): how many are laid open on the racks; o.list: how far his list is written
function oh_openBook(ctx,x,y,w){const h=w*0.42;ctx.fillStyle="rgba(60,44,30,0.18)";ctx.fillRect(x-w/2+4,y-h+6,w,h);for(const s of [-1,1]){ctx.fillStyle=rgba(OH.paper,1);ctx.beginPath();ctx.moveTo(x,y-h+2);ctx.lineTo(x+s*w/2,y-h);
  ctx.lineTo(x+s*w/2,y);ctx.lineTo(x,y+2);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(OH.coverDk,0.7);ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle=rgba(OH.ink,0.35);
  for(let k=1;k<4;k++)ctx.fillRect(x+s*w*k/8-1,y-h*0.8,2,h*0.6);}}
function oh_airing(x,tt,o){o=o||{};x.drawImage(gv_place("airing"),0,0,W,H);const nb=clamp(o.books==null?1:o.books,0,1),tot=OH_AI.racks.length*6;let k=0;
  OH_AI.racks.forEach(([rx,ry,rw])=>{for(let j=0;j<6;j++){if(k++>=Math.round(nb*tot))return;oh_openBook(x,rx-rw/2+rw*(j+0.5)/6,ry-12,rw/7.2);}});
  // a keeper bringing out more books, the historian at his mat with a low desk, writing
  const kx=lerp(700,880,(Math.sin(tt*0.5)+1)/2);person(x,"ohK1",kx,700,0.7,{pose:"oh_carry",t:tt,flip:false});oh_bookStack(x,kx,700-380*0.7,60,4);
  const [mx,my]=OH_AI.mat;oh_floorSit(x,"ohAir",mx,my-20,0.82,{pose:Math.sin(tt*1.6)>0.5?"oh_brushUp":"oh_brush",t:tt,carry:oh_heldBrush});
  x.drawImage(oh_sprite("airDesk",300,140,q=>oh_lowDesk(q,150,130,260,100,391)),mx-150,my+40-130);
  x.fillStyle=rgba(OH.paper,1);x.fillRect(mx-70,my-66,140,14);}

// ---- today: the reader at the library's screen, a page of the annals on it ----
function oh_reading(x,tt,o){o=o||{};x.drawImage(gv_place("library"),0,0,W,H);const [sx,sy,sw,sh]=OH_LB.screen;
  gv_behind(x,"ohReader",OH_LB.seat[0],OH_LB.desk[2],OH_LB.seat[1],{pose:"listen",t:tt,flip:false});x.drawImage(oh_libraryDesk(),0,0,W,H);
  gv_screen(x,sx,sy,sw,sh,null,q=>{q.fillStyle=rgba([238,240,244],1);q.fillRect(sx,sy,sw,40);q.fillStyle=rgba([255,255,255],1);rr(q,sx+70,sy+10,sw-140,20,10);q.fill();
    const k=clamp(o.page==null?1:o.page,0,1);withA(q,k,()=>{q.fillStyle=rgba(OH.hanji,1);q.fillRect(sx+40,sy+60,sw-80,sh-80);q.strokeStyle=rgba([170,70,60],0.5);q.lineWidth=1.5;q.strokeRect(sx+56,sy+74,sw-112,sh-108);
      oh_marks(q,sx+60,sy+80,sw-120,sh-118,12,1,401);});},{bar:[238,240,244],barH:40});}
