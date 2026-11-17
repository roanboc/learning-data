/* ===== The people kit: places =====
   Where the university's people work and meet, each painted once and kept as a picture (the agent films' AG_PLACES). A film lists
   the ones it uses, its opening place first: AG_PLACES.team=PK.place.team. A place paints only what is behind everyone; what people
   sit at or stand behind is drawn every frame with them, by the sets below, so a person's legs go under a desk and their hands on it.
   Each place has an eye line (PK.ROOMS.<place>.eye): a standing adult's eyes are on it wherever they stand, so PK.hAt(floor, eye)
   gives everyone's size, near and far. Never draw two people of one picture at sizes the eye line doesn't give: a large half-figure
   beside small whole people reads as two pictures pasted together. A camera closes in to about 1.3 at most on a kept picture; for
   faces, cut to a place painted closer, such as the corner.
     PK.place.team     the data team's room: a window on the campus, a whiteboard, shelves (PK.ROOMS.team: eye, board, clock, the
                       floor lines back, mid and front, win, and sill: a place on the window's sill for something small)
     PK.place.corner   the manager's corner: a round table by a window, close enough for faces (PK.ROOMS.corner: F the floor, H a
                       person's height there, hx and ix where two people sit, tx, ty, rx the table)
     PK.place.campus   the campus: the teaching building and its entrance, a lawn, two paths, trees (PK.ROOMS.campus: near, the near
                       path's floor; way(x), the floor along the path from the entrance, x from 1470 down to 900)
     PK.place.lecture  a teaching room: a door with the sensor that counts who comes in, windows, a board; its seats are drawn with
                       the people, so it can be full or empty (PK.ROOMS.lecture: door, sensor, board, rows)
   Sets, drawn every frame:
     PK.window(ctx, x, y, w, h, view, o), PK.windowFrame(...)   a window: draw the frame again over people who pass outside
     PK.atDesk(ctx, who, x, floor, h, o)       someone working at a desk, seen from the side
     PK.seated(ctx, who, x, floor, h, pose, o) someone on a chair
     PK.audience(ctx, t, n, o)                 the teaching room's seats, n of them taken
     PK.atBoard(ctx, who, t, lines, o)         someone writing on a wall board, line by line, stepping along as the words come */
(K=>{
const {TAU,lerp,clamp,pin,mix,dk,lt,css,rnd,hash,polar,capsule,pg,rrect,ell}=K.u,C=K.col;
Object.assign(K.PAL,{carpet:[156,170,176],carpetDk:[140,148,152],doorCool:[146,170,174],sensor:[248,246,240],lawnLt:[188,208,140],stoneBand:[236,226,208],hedge:[112,160,116]});
const grad=(ctx,x0,y0,x1,y1,a,b,aa,ab)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,css(a,aa));g.addColorStop(1,css(b,ab));return g;};
function wall(ctx,col,y1){ctx.fillStyle=K.S.shade?grad(ctx,0,0,0,y1,lt(col,0.25),dk(col,0.07)):css(col);ctx.fillRect(0,0,1920,1080);}
function floorAt(ctx,y0,col,planks){ctx.fillStyle=K.S.shade?grad(ctx,0,y0,0,1080,col,dk(col,0.14)):css(col);ctx.fillRect(0,y0,1920,1080-y0);
  ctx.save();ctx.strokeStyle=css(dk(col,0.2),0.5);ctx.lineWidth=2.5;ctx.lineCap="round";ctx.beginPath();
  for(let i=1;i<6;i++){const y=y0+i*i*9+i*14;ctx.moveTo(0,y);ctx.lineTo(1920,y);}
  if(planks)for(let i=0;i<14;i++){const x=i*150+((i*53)%60),r=(i%3)*3+1;ctx.moveTo(x,y0+r*23);ctx.lineTo(x-(960-x)*0.03,y0+(r+1)*23+12);}
  ctx.stroke();ctx.restore();}
const skirting=(ctx,y)=>K.S.fill(ctx,c=>rrect(c,-10,y,1940,24,0),C("skirting"),{});
function rug(ctx,x,y,rx,ry){const S=K.S;S.fill(ctx,c=>ell(c,x,y,rx,ry),C("rug"),{sa:0.16});S.fill(ctx,c=>ell(c,x,y,rx*0.875,ry*0.81),C("rug2"),{w:0.5,flat:true});S.fill(ctx,c=>ell(c,x,y,rx*0.73,ry*0.65),C("rug"),{w:0.5,flat:true});}
// a plank on a wall with books standing on it; o.free: px left clear at its end
function shelf(ctx,x,y,w,seed,o){o=o||{};const S=K.S,R=rnd(seed);S.fill(ctx,c=>{rrect(c,x+30,y+12,10,26,2);rrect(c,x+w-40,y+12,10,26,2);},dk(C("wood"),0.2),{w:0.6,flat:true});S.fill(ctx,c=>rrect(c,x,y,w,14,4),C("wood"),{});
  let bx=x+14;const end=x+w-(o.free||0)-34;while(bx<end){const bw=16+R()*18,bh=52+R()*30,ci=(R()*6)|0,tilt=R()<0.12;ctx.save();if(tilt){ctx.translate(bx+bw,y);ctx.rotate(0.22);ctx.translate(-(bx+bw),-y);}
    S.fill(ctx,c=>rrect(c,bx,y-bh,bw,bh,2),C("book",ci),{w:0.6,sa:0.16});ctx.restore();bx+=bw+(tilt?14:3);if(R()<0.1)bx+=30;}}
// what is outside a window: the campus, a building (o.bld: where across the window, 0 to 1) and trees
function campusView(ctx,x,y,w,h,o){o=o||{};const S=K.S,k=w/640;ctx.fillStyle=S.shade?grad(ctx,0,y,0,y+h,C("skyTop"),lt(C("skyLow"),0.2)):css(mix(C("skyTop"),C("skyLow"),0.35));ctx.fillRect(x,y,w,h);
  S.begin(ctx,{lw:2,far:0.6,sh:3});K.cloud(ctx,x+w*0.24,y+h*0.18,0.8*k);K.cloud(ctx,x+w*0.78,y+h*0.29,0.6*k);
  const bx=x+w*(o.bld==null?0.52:o.bld),by=y+h*0.47;
  S.fill(ctx,c=>rrect(c,bx,by,330*k,h,4),C("viewBld"),{flat:true});S.fill(ctx,c=>pg(c,[[bx-20*k,by+4*k],[bx+165*k,by-60*k],[bx+350*k,by+4*k]]),C("viewRoof"),{flat:true});
  for(let i=0;i<4;i++)for(let j=0;j<2;j++)S.fill(ctx,c=>rrect(c,bx+32*k+i*68*k,by+40*k+j*84*k,36*k,52*k,4),mix(C("glass"),C("viewBld"),0.3),{w:0.5,flat:true});
  for(const [fx,fy,r,i] of o.trees||[[0.14,0.73,96,0],[0.36,0.8,78,1],[0.94,0.83,70,0],[0.02,0.89,70,1]]){const tx=x+w*fx,ty=y+h*fy,rr=r*k;S.fill(ctx,c=>rrect(c,tx-7*k,ty,14*k,160*k,4),C("trunk"),{w:0.6,flat:true});
    S.fill(ctx,c=>{ell(c,tx,ty,rr,rr*0.82);ell(c,tx-rr*0.5,ty+rr*0.34,rr*0.6,rr*0.5);ell(c,tx+rr*0.52,ty+rr*0.3,rr*0.56,rr*0.48);},C(i?"viewTree2":"viewTree"),{sa:0.14});}
  S.fill(ctx,c=>rrect(c,x-10,y+h-60*k,w+20,80*k,0),C("lawn"),{flat:true,line:false});}
K.view={campus:campusView};
K.windowFrame=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S,fr=C("frame");S.begin(ctx,{lw:3,far:0.1,sh:5});
  S.fill(ctx,c=>{rrect(c,x-18,y-18,w+36,18,4);rrect(c,x-18,y+h,w+36,18,4);rrect(c,x-18,y-18,18,h+36,4);rrect(c,x+w,y-18,18,h+36,4);if(o.bar!==false)rrect(c,x+w/2-7,y,14,h,2);},fr,{});
  S.fill(ctx,c=>rrect(c,x-40,y+h+16,w+80,22,6),lt(fr,0.2),{});};
K.window=(ctx,x,y,w,h,view,o)=>{o=o||{};ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();(view||campusView)(ctx,x,y,w,h,o);ctx.restore();K.windowFrame(ctx,x,y,w,h,o);
  if(K.S.shade&&o.light!==false){const fy=o.floor||800;ctx.fillStyle=grad(ctx,x,y+h,x-200,fy+200,[255,246,214],[255,246,214],0.5,0);ctx.beginPath();pg(ctx,[[x,y+h+38],[x+w,y+h+38],[x+w-120,fy],[x-260,fy]]);ctx.fill();}};

K.ROOMS={
  team:{eye:360,wall:790,win:[150,152,470,450],board:{x:726,y:170,w:470,h:330},clock:[1700,182,42],sill:[352,618],back:838,mid:884,front:930},
  corner:{eye:198,F:944,H:820,hx:628,ix:1292,tx:960,rx:282,ty:638,win:[640,120,640,450]},
  campus:{eye:430,near:930,door:[1470,600],way:x=>lerp(600,884,clamp((1470-x)/570,0,1))},
  lecture:{eye:400,wall:800,door:{x:260,y:290,w:220,h:510},sensor:[260,238],board:{x:1340,y:250,w:460,h:300},rows:[[826,468],[868,514],[912,562]]}
};
K.place={};
/* the data team's room */
K.place.team=ctx=>{const S=K.S,R=K.ROOMS.team,[wx,wy,ww,wh]=R.win;wall(ctx,C("wall"),800);
  K.window(ctx,wx,wy,ww,wh,campusView,{bld:0.44});
  S.begin(ctx,{lw:3,far:0.1,sh:5});K.board(ctx,R.board.x,R.board.y,R.board.w,R.board.h);
  // the wall behind where people stand is left plain, from their shoulders up: a head reads best against nothing. The shelf is in
  // the corner, over a desk, where nobody stands
  shelf(ctx,1730,330,170,41,{free:76});K.pot(ctx,1846,330,60,46);K.plant(ctx,1846,284,0.46,5,0);
  floorAt(ctx,800,C("floor"),true);skirting(ctx,780);rug(ctx,900,952,600,92);
  S.begin(ctx,{lw:3,far:0.1,sh:5});K.pot(ctx,672,802,92,80);K.plant(ctx,672,722,1.0,8,0);};
/* the manager's corner: a round table by the window */
K.place.corner=ctx=>{const S=K.S,R=K.ROOMS.corner,[wx,wy,ww,wh]=R.win;wall(ctx,C("wall"),800);K.window(ctx,wx,wy,ww,wh,campusView,{});
  S.begin(ctx,{lw:3,far:0.1,sh:5});const bx=150,by=200,bw=380,bh=270;K.board(ctx,bx,by,bw,bh,{pin:true});
  [[40,34,0],[112,44,1],[44,112,2],[250,34,3],[312,48,1],[254,116,2],[320,128,0],[150,170,3],[212,96,0]].forEach(([x,y,i],j)=>{ctx.save();ctx.translate(bx+x+26,by+y+26);ctx.rotate((hash(j,5)-0.5)*0.14);S.fill(ctx,c=>rrect(c,-26,-26,52,52,3),C("note",i),{w:0.6,sa:0.2});ctx.restore();});
  // books, a lamp and a picture on the right
  const sx=1440,sy=470,sw=380,sh=330;S.fill(ctx,c=>rrect(c,sx,sy,sw,sh,8),C("wood"),S.shade?{grad:[sx,0,sx+sw,0,0.1]}:{});
  for(let r=0;r<3;r++){const y0=sy+16+r*104;S.fill(ctx,c=>rrect(c,sx+14,y0,sw-28,88,4),dk(C("woodDk"),0.12),{w:0.6,flat:true});
    const Rn=rnd(40+r);let x=sx+22;while(x<sx+sw-70){const w=16+Rn()*18,h=52+Rn()*30,ci=(Rn()*6)|0,tilt=Rn()<0.12;ctx.save();if(tilt){ctx.translate(x+w,y0+88);ctx.rotate(0.22);ctx.translate(-(x+w),-(y0+88));}S.fill(ctx,c=>rrect(c,x,y0+88-h,w,h,2),C("book",ci),{w:0.6,sa:0.16});ctx.restore();x+=w+(tilt?14:3);if(Rn()<0.1)x+=30;}}
  K.pot(ctx,sx+70,sy,70,56);K.plant(ctx,sx+70,sy-56,0.62,3,0);
  S.fill(ctx,c=>{rrect(c,sx+288,sy-14,60,14,4);rrect(c,sx+312,sy-110,12,100,3);},dk(C("lamp"),0.3),{});S.poly(ctx,[[sx+270,sy-96,1],[sx+366,sy-96,1],[sx+346,sy-166,1],[sx+290,sy-166,1]],C("lamp"),{exact:true});
  S.fill(ctx,c=>rrect(c,1444,166,250,180,6),C("frame"),{});ctx.save();ctx.beginPath();ctx.rect(1460,182,218,148);ctx.clip();ctx.fillStyle=css(C("skyTop"));ctx.fillRect(1460,182,218,148);
  S.begin(ctx,{lw:1.4,far:0.5,sh:2});S.poly(ctx,[[1444,276],[1514,246],[1594,268],[1684,238],[1704,356,1],[1444,356,1]],C("lawn"),{flat:true,exact:true});S.poly(ctx,[[1444,306],[1534,288],[1624,310],[1704,294],[1704,356,1],[1444,356,1]],C("viewTree2"),{flat:true,exact:true});ctx.restore();
  S.begin(ctx,{lw:3,far:0.1,sh:5});floorAt(ctx,800,C("floor"),true);skirting(ctx,780);rug(ctx,960,946,640,96);
  K.pot(ctx,360,800,110,96);K.plant(ctx,360,704,1.25,8,0);};
/* the campus: the teaching building on the right, the library far off, a lawn, a path from the entrance and one across the front */
K.place.campus=ctx=>{const S=K.S;ctx.fillStyle=S.shade?grad(ctx,0,0,0,480,C("skyTop"),C("skyLow")):css(mix(C("skyTop"),C("skyLow"),0.3));ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:1.5,far:0.8,sh:3});K.cloud(ctx,330,150,1.2);K.cloud(ctx,860,86,0.8);
  // far trees, the library
  S.begin(ctx,{lw:1.6,far:0.7,sh:3});const Rn=rnd(12),far=mix(C("viewTree2"),C("skyLow"),0.34);
  S.fill(ctx,c=>{for(let x=-40;x<1180;x+=58+Rn()*30)ell(c,x,470+Rn()*16,52+Rn()*26,40+Rn()*22);c.rect(-40,480,1260,60);},far,{sa:0.1});
  S.begin(ctx,{lw:2,far:0.5,sh:3});const lb=mix(C("viewBld"),C("skyLow"),0.2);
  S.fill(ctx,c=>rrect(c,170,318,400,200,3),lb,S.shade?{grad:[170,0,570,0,0.08]}:{});S.fill(ctx,c=>rrect(c,156,300,428,24,4),mix(C("viewRoof"),C("skyLow"),0.2),{});
  for(let i=0;i<5;i++)for(let j=0;j<2;j++)S.fill(ctx,c=>rrect(c,200+i*72,346+j*78,40,50,3),mix(C("glass"),lb,0.3),{w:0.5,flat:true});
  S.fill(ctx,c=>rrect(c,344,446,52,72,3),dk(lb,0.3),{w:0.6,flat:true});
  // the lawn, mown in stripes, and trees across it
  S.begin(ctx,{lw:2.4,far:0.3,sh:4});const lawn=[[-40,512],[400,506],[900,514],[1300,508],[1960,520],[1960,1100,1],[-40,1100,1]];
  S.poly(ctx,lawn,C("lawn"),S.shade?{grad:[0,500,0,1080,0.12],exact:true}:{flat:true,exact:true});
  ctx.save();ctx.beginPath();K.u.spline(ctx,lawn);ctx.clip();ctx.fillStyle=css(C("lawnLt"),0.5);for(let i=-9;i<12;i+=2){ctx.beginPath();pg(ctx,[[960,410],[960+i*330,1100],[960+(i+1)*330,1100]]);ctx.fill();}ctx.restore();
  S.begin(ctx,{lw:2.2,far:0.35,sh:4});K.tree(ctx,84,532,1.05,3,{far:1});K.tree(ctx,650,526,0.95,7,{far:1});K.tree(ctx,872,534,1.1,11,{far:1});
  // the paths: one from the entrance, one across the front
  S.begin(ctx,{lw:2.4,far:0.2,sh:4});const pth=C("path");
  S.poly(ctx,[[1404,600,1],[1548,600,1],[1270,884,1],[742,884,1]],pth,{exact:true,flat:true});
  S.poly(ctx,[[-40,872,1],[1960,872,1],[1960,1004,1],[-40,1004,1]],pth,S.shade?{grad:[0,872,0,1004,0.07],exact:true}:{exact:true,flat:true});
  // the teaching building: its ground floor and the floor above, the entrance under a canopy
  S.begin(ctx,{lw:3,far:0.12,sh:5});const bk=C("brick"),sb=C("stoneBand"),gl=mix(C("glass"),[150,190,206],0.3);
  S.fill(ctx,c=>rrect(c,1040,-30,940,600,0),bk,S.shade?{grad:[1040,0,1960,0,0.1]}:{});
  S.fill(ctx,c=>{rrect(c,1028,262,960,22,3);rrect(c,1028,538,960,34,3);},sb,{});
  const win=(x,y,w,h)=>{S.fill(ctx,c=>rrect(c,x-9,y-9,w+18,h+18,5),sb,{w:0.8});S.fill(ctx,c=>rrect(c,x,y,w,h,2),gl,S.shade?{grad:[x,y,x+w,y+h,0.16],line:false}:{line:false,flat:true});
    S.line(ctx,c=>{c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h*0.4);c.lineTo(x+w,y+h*0.4);},dk(sb,0.3),0.7,{on:"line soft paper",px:3});};
  for(const x of [1090,1236,1656,1802]){win(x,326,96,176);win(x,44,96,176);}win(1422,44,96,176);
  S.fill(ctx,c=>{rrect(c,1362,360,16,212,3);rrect(c,1562,360,16,212,3);},dk(sb,0.14),{});S.fill(ctx,c=>rrect(c,1334,330,272,30,6),sb,{});
  S.fill(ctx,c=>rrect(c,1392,384,156,188,3),dk(bk,0.42),{});S.fill(ctx,c=>{rrect(c,1400,392,66,180,2);rrect(c,1474,392,66,180,2);},gl,S.shade?{grad:[1400,392,1540,572,0.2],w:0.6}:{w:0.6,flat:true});
  S.fill(ctx,c=>{rrect(c,1372,572,196,14,2);rrect(c,1360,586,220,14,2);},lt(sb,0.1),{});
  S.begin(ctx,{lw:2.4,far:0.2,sh:4});S.fill(ctx,c=>{for(let x=1052;x<1350;x+=44)ell(c,x+22,566,30,20);},C("hedge"),{sa:0.14});S.fill(ctx,c=>{for(let x=1600;x<1960;x+=44)ell(c,x+22,566,30,20);},C("hedge"),{sa:0.14});
};
/* a teaching room: the door and its sensor on the left, windows, the board on the right; its seats come with the people */
K.place.lecture=ctx=>{const S=K.S,R=K.ROOMS.lecture,d=R.door;wall(ctx,C("wallCool"),800);
  K.window(ctx,560,170,300,400,campusView,{bld:0.3,light:false});K.window(ctx,960,170,300,400,campusView,{bld:-0.3,light:false,trees:[[0.3,0.74,90,0],[0.72,0.8,78,1]]});
  S.begin(ctx,{lw:3,far:0.1,sh:5});K.board(ctx,R.board.x,R.board.y,R.board.w,R.board.h);
  floorAt(ctx,800,C("carpet"),false);skirting(ctx,780);
  K.door(ctx,d.x,800,d.w,d.h,{col:C("doorCool"),glass:true});K.sensor(ctx,R.sensor[0],R.sensor[1],0);};
// the sensor over a door, which counts who comes in; on (0 to 1): it has just seen someone
K.sensor=(ctx,x,y,on)=>{const S=K.S;S.begin(ctx,{lw:2.4,far:0,sh:3});S.fill(ctx,c=>rrect(c,x-40,y-20,80,40,12),C("sensor"),{});
  ctx.fillStyle=css([60,66,78]);ctx.beginPath();ctx.arc(x-14,y,10,0,TAU);ctx.fill();ctx.fillStyle=css(mix([150,156,164],K.C.orange,clamp(on||0,0,1)));ctx.beginPath();ctx.arc(x+18,y,6+2*clamp(on||0,0,1),0,TAU);ctx.fill();};

/* ---------------------------------------------------------------- sets: people with what they sit at
   PK.atDesk: someone at a desk, seen from the side: the chair, their legs, the desk and what is on it, then the rest of them, their
   hands on the keys. o.flip: they face left. o.w: the desk's length along the frame (0.62 h by default). o.work (0 to 1, 1 by
   default): how far their hands are on the keys; o.pose: their pose when they aren't ("sit"), o.workPose when they are; o.reachN,
   o.reachF: what their hands rest on instead of the keys. o.turn (0 to 1): turned round on the chair, away from the desk. o.screen: "laptop" (the default), "monitor" (it faces us: o.show(ctx, x, y, w, h) draws what it shows;
   o.sx where it stands, o.sw and o.sh its size) or null. o.on(ctx, D) draws what else is on the desk. The rest as PK.person's.
   Returns the person's joints, with J.desk = D: {x0, x1 (its near and far end), cx, top, floor, dir, w, k}. who null: the desk
   and its chair stand empty. */
K.atDesk=(ctx,who,x,floor,h,o)=>{o=Object.assign({},o||{});const S=K.S,dir=o.flip?-1:1,w=o.w||0.62*h,top=floor-0.43*h,x0=x+dir*0.1*h,x1=x0+dir*w,k=h/660,
    D={x0,x1,cx:(x0+x1)/2,top,floor,dir,w,k},turn=clamp(o.turn||0,0,1),work=(o.work==null?1:o.work)*(1-pin(turn,0,0.3)),pose=K.poseMix(o.pose||"sit",o.workPose||"sitWork",work),
    fl=dir<0?1-turn:turn,lw={lw:clamp(h*0.0056,1.4,6.5),sh:clamp(h*0.0078,1.5,8.5)},po=Object.assign({},o,{flip:fl});
  S.begin(ctx,lw);K.chair(ctx,x-Math.cos(Math.PI*fl)*0.012*h,floor,h,fl,{col:o.chair,swivel:o.swivel!==false});
  if(who)K.person(ctx,who,x,floor,h,pose,Object.assign({},po,{part:"lower",busy:work>=0.5}));
  S.begin(ctx,lw);K.desk(ctx,D.cx,top,w,floor,{col:o.deskCol,k:h/600});
  if(o.screen==="monitor"){K.monitor(ctx,o.sx==null?x0+dir*w*0.6:o.sx,top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    S.begin(ctx,lw);S.fill(ctx,c=>rrect(c,Math.min(x0+dir*0.1*h,x0+dir*0.27*h),top-0.012*h,0.17*h,0.012*h,3),lt(C("laptop"),0.25),{w:0.7});}
  else if(o.screen!==null)K.laptop(ctx,x0+dir*0.21*h,top,{k,flip:dir<0,glow:o.glow});
  if(o.on)o.on(ctx,D);
  if(!who)return{desk:D};
  // hands on the keys tap in bursts and rest between them (given the time, o.t; o.life 0: they lie still)
  const ty=o.t==null||o.life===0?{n:[0,0],f:[0,0]}:K.typing(o.t,typeof who==="string"?K.CAST[who]:who);
  const J=K.person(ctx,who,x,floor,h,pose,Object.assign({},po,{part:"upper",busy:work>=0.5},o.reachN?{}:{reachN:[x+dir*(0.25+ty.n[0])*h,top-(0.012+ty.n[1])*h],reachNk:work},
    o.reachF?{}:{reachF:[x+dir*(0.31+ty.f[0])*h,top-(0.018+ty.f[1])*h],reachFk:work}));J.desk=D;return J;};
// someone on a chair
K.seated=(ctx,who,x,floor,h,pose,o)=>{o=o||{};const fl=o.flip===true?1:(o.flip||0);K.S.begin(ctx,{lw:clamp(h*0.0056,1.4,6.5),sh:clamp(h*0.0078,1.5,8.5)});
  K.chair(ctx,x-Math.cos(Math.PI*fl)*0.012*h,floor,h,fl,{col:o.chair,swivel:o.swivel});return K.person(ctx,who,x,floor,h,pose||"sit",o);};
/* the teaching room's seats, in three rows that face the board: n of the eleven are taken, by people nobody names (PK.extra), in
   the order o.order gives (seats 0 to 3 are the back row, 4 to 7 the middle, 8 to 10 the front); the others stand empty.
   o.a (0 to 1) fades the people, so the empty chairs show through; o.who(i) another person for seat i; o.look where they look
   (0: at their notes, 1: up at the board); o.between(ctx, row) draws what comes after a row, such as someone walking to a seat.
   PK.seats() gives the seats: {r (the row), x, fl, h}. */
K.seats=o=>{o=o||{};const R=K.ROOMS.lecture,x0=o.x0==null?470:o.x0,x1=o.x1==null?1180:o.x1,seats=[];
  R.rows.forEach(([fl,h],r)=>{const m=r===2?3:4;for(let i=0;i<m;i++)seats.push({r,x:lerp(x0,x1,(i+(r%2?0.5:0.12)+(r===2?0.3:0))/m)+r*14,fl,h});});return seats;};
K.audience=(ctx,t,n,o)=>{o=o||{};const seats=K.seats(o),order=o.order||[5,1,9,6,2,8,0,10,4,7,3],taken={};order.slice(0,clamp(Math.round(n),0,11)).forEach((s,i)=>taken[s]=i);
  seats.forEach((s,i)=>{const P=taken[i]!=null?(o.who&&o.who(i))||K.extra(i+3):null,ch=K.PAL[i%2?"chair2":"chair"];
    if(!P||(o.a!=null&&o.a<1)){K.S.begin(ctx,{lw:clamp(s.h*0.0056,1.4,6.5),sh:4});K.chair(ctx,s.x-0.012*s.h,s.fl,s.h,false,{col:ch});}
    if(P)K.seated(ctx,P,s.x,s.fl,s.h,K.poseMix("sit","sitBack",hash(i,2)),{t:t+i*1.7,chair:ch,a:o.a,expr:"listen",gaze:[1,-(o.look==null?0.4:o.look)],nod:Math.sin(t*0.7+i)*0.02,shade:0});
    if(o.between&&(i===3||i===7))o.between(ctx,s.r);});
  return seats;};
/* PK.atBoard: someone writes on a wall board, standing at it, seen from the side, facing right. lines: [{s, t0, t1, col}]: each
   line's words and when they are written (from t0 to t1), one under the other from (o.x, o.y: the first baseline), o.lh apart, in
   o.size px. An arm is only so long, so the writer stands o.back px behind the pen and steps along as the words come; when the
   next line comes more than o.aside seconds later, and after the last, they step back to o.rest (an x clear of the words), so
   the words show: keep o.rest within a stride of the lines' ends, so that it is one step back, still facing the board, and
   a head's width clear of the words' start. o.stand: how they stand when they aren't writing ("ease"). o.floor, o.h: where they stand and how tall; o.a fades the words (not the writer); o.expr, o.gaze as PK.person's.
   o.down: when they put the marker down on the board's tray, at o.tray [x, y] (within an arm of o.rest): it lies there from then
   on. who null: only the words, and the marker on the tray: the writer has left. Returns the joints, with J.writing (0 to 1). */
K.atBoard=(ctx,who,t,lines,o)=>{o=Object.assign({size:30,weight:700,lh:56,back:74,aside:2.2,a:1},o||{});const u=o.h/1000,down=o.down==null||!o.tray?1e9:o.down;
  const W=lines.map(l=>ag_tw(ctx,l.s,{w:o.weight,size:o.size})),pOf=(i,tt)=>clamp((tt-lines[i].t0)/(lines[i].t1-lines[i].t0),0,1),pen=(i,p)=>[o.x+W[i]*p,o.y+i*o.lh-o.size*0.32];
  // the words, as far as they are written
  lines.forEach((l,i)=>{const p=pOf(i,t);if(p<=0||o.a<=0.004)return;ctx.save();ctx.globalAlpha*=clamp(o.a,0,1);ctx.beginPath();ctx.rect(o.x-4,o.y+i*o.lh-o.size-6,(W[i]+10)*p,o.size+24);ctx.clip();
    ag_T(ctx,l.s,o.x,o.y+i*o.lh,{w:o.weight,size:o.size,color:css(l.col||K.C.ink)});ctx.restore();});
  const P=typeof who==="string"?K.CAST[who]:who,inkOf=l=>(l&&l.col)||K.C.ink,lw={lw:clamp(o.h*0.0056,1.4,6.5),sh:clamp(o.h*0.0078,1.5,8.5)};
  const marker=(c,a,b,col)=>{const S=K.S;S.fill(c,cc=>capsule(cc,a,b,9*u,8*u),[70,74,90],{w:0.6});S.fill(c,cc=>capsule(cc,[lerp(a[0],b[0],0.82),lerp(a[1],b[1],0.82)],b,8*u,6*u),col,{w:0.6,flat:true});};
  // the marker on the tray: from the hand that puts it there, it comes to lie flat
  if(t>=down){const J0=K.rig(P||{},o.rest,o.floor,o.h,"stand",{reachN:[o.tray[0],o.tray[1]-10*u]}),h0=J0.hdN,d0=J0.aN[1],e=pin(t,down,0.3),
      a=[lerp(polar(h0,d0,-6*u)[0],o.tray[0]-34*u,e),lerp(polar(h0,d0,-6*u)[1],o.tray[1]-9*u,e)],b=[lerp(polar(h0,d0,62*u)[0],o.tray[0]+34*u,e),lerp(polar(h0,d0,62*u)[1],o.tray[1]-9*u,e)];
    K.S.begin(ctx,lw);marker(ctx,a,b,inkOf(lines[lines.length-1]));}
  if(!P)return null;
  const amp=K.ampOf(P),stride=K.strideOf(o.h,amp);
  // where the writer stands: moves [t0, t1, x0, x1, eased], held between them
  const mv=[];let px=o.rest,pt=-1e9;const move=(t1,x1)=>{const d=clamp(Math.abs(x1-px)/340,0.45,1.6),t0=Math.max(pt,t1-d);if(Math.abs(x1-px)>0.5)mv.push([t0,Math.max(t1,t0+0.3),px,x1,1]);px=x1;pt=Math.max(t1,t0+0.3);};
  lines.forEach((l,i)=>{const sx=o.x-o.back,ex=sx+W[i];move(l.t0-0.1,sx);mv.push([l.t0,l.t1,sx,ex,0]);px=ex;pt=l.t1+0.25;
    if(i===lines.length-1||lines[i+1].t0-l.t1>o.aside)move(pt+clamp(Math.abs(o.rest-ex)/340,0.5,1.6),o.rest);});
  const xAt=tt=>{let x=o.rest;for(const [t0,t1,x0,x1,e] of mv){if(tt<=t0)break;const k=clamp((tt-t0)/(t1-t0),0,1);x=lerp(x0,x1,e?K.u.sine(k):k);}return x;};
  // a step or so back from the words is taken as people take it, still facing the board; only to walk back a long way do they turn
  // round, and face the board's free side again when they stop
  let turn=0;for(const [t0,t1,x0,x1,e] of mv)if(e&&x0-x1>stride*0.9)turn=Math.max(turn,pin(t,t0-0.1,0.3)*(1-pin(t,t1-0.25,0.3)));
  let wi=0,wk=0;lines.forEach((l,i)=>{const k=pin(t,l.t0-0.3,0.3)*(1-pin(t,l.t1+0.1,0.3));if(k>wk){wk=k;wi=i;}});
  const x=xAt(t),v=Math.abs(xAt(t+0.04)-xAt(t-0.04))/0.08,walk=K.poseMix(o.stand||"ease",K.poseWalk(Math.abs(x-o.rest)/stride,1,amp),clamp(v/180,0,1)*0.85),q=pen(wi,pOf(wi,t)),held=t<down;
  // the hand: on the pen's place while a line is written; to the tray and back as the marker is put down
  const tr=down<1e8?pin(t,down-0.45,0.4)*(1-pin(t,down+0.15,0.45)):0,rk=tr>0?tr:wk*(1-turn),tg=tr>0?[o.tray[0],o.tray[1]-10*u]:[q[0]+2,q[1]+Math.sin(t*23)*2.5*wk];
  const pose=Object.assign({},walk,{aN:[walk.aN[0],walk.aN[1],held?"grip":"rest"]}),mk=held?(c,h,deg,J)=>marker(c,polar(h,deg,-6*J.u),polar(h,deg,62*J.u),inkOf(lines[wi])):null;
  const J=K.person(ctx,who,x,o.floor,o.h,pose,{t:o.t==null?t:o.t,flip:turn,expr:o.expr,gaze:o.gaze||[1,-0.3*wk],nod:o.nod,reachN:tg,reachNk:rk,hold:mk});J.writing=wk;return J;};
})(PK);
