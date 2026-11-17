/* ===== The people kit: things =====
   What people sit at, hold and work with, drawn by the look in use. Sizes in the frame's px; k scales a thing.
     PK.PAL                          the kit's colours for places and things (PK.col(name, i) is one of them, toned by the look)
     PK.chair(ctx, x, floor, h, flip, o)   a chair for someone h tall whose hips are at x; flip: they face left, or a number from 0
                                     to 1: the chair turns round with them, through the front. o.col; o.swivel: an office chair
                                     on a column and a star of castors, which is the chair that turns
     PK.table(ctx, x, y, rx, floor)  a round table: its top at y, its foot on the floor
     PK.desk(ctx, x, y, w, floor, o) a desk seen from its long side: its top at y, w wide. o.col, o.panel (a modesty panel)
     PK.laptop(ctx, x, y, o)         a laptop on a top at y, seen from the side, open towards o.flip ? left : right; o.k
     PK.monitor(ctx, x, y, w, h, o)  a screen on a stand, facing us; o.draw(ctx, x, y, w, h) draws what it shows
     PK.board(ctx, x, y, w, h, o)    a whiteboard on a wall; o.pin: a pinboard instead
     PK.sheet(ctx, x, y, w, h, o)    a sheet of paper or a note; o.rot, o.col, o.pin
     PK.mug(ctx, x, y, k, col, t, steam), PK.pot(ctx, x, y, w, h), PK.plant(ctx, x, y, k, seed, t)
     PK.clock(ctx, x, y, r, hours)   a wall clock showing a time, such as 7.0 or 8.17 (null: its face, without hands)
     PK.door(ctx, x, y, w, h, o)     a door in a wall, its foot at y; o.open 0 to 1, o.col, o.glass
     PK.seedling(ctx, x, y, k, g)    a seedling in the ground, grown to g (0 to 1); PK.potted(ctx, x, y, k, g) in a small pot
     PK.tree(ctx, x, y, k, seed, o)  a tree with a round crown, its foot at (x, y); o.col, o.far
     PK.cloud(ctx, x, y, k)
     PK.tick(ctx, x, y, r, a, col)   a round mark with a tick: something done, or still alive */
(K=>{
const {TAU,rad,lerp,clamp,mix,dk,lt,css,rnd,hash,polar,pg,spline,capsule,rrect,ell}=K.u;
K.PAL={skyTop:[168,204,226],skyLow:[250,238,212],cloud:[255,251,242],
  wall:[240,226,206],wallCool:[226,228,222],floor:[184,132,98],floorDk:[158,108,80],skirting:[250,244,232],
  wood:[212,166,118],woodDk:[172,128,88],frame:[250,244,232],glass:[200,228,236],
  viewTree:[132,176,132],viewTree2:[108,154,120],viewBld:[230,206,180],viewRoof:[196,118,92],lawn:[170,196,128],path:[236,220,190],trunk:[134,100,78],
  rug:[208,126,100],rug2:[236,200,154],plant:[98,152,112],plant2:[128,180,132],pot:[200,114,84],board:[251,247,238],cork:[214,178,134],
  note:[[246,208,114],[152,198,192],[238,154,124],[192,206,144]],book:[[194,94,84],[74,114,144],[222,184,104],[114,154,124],[154,104,134],[232,222,202]],
  mug:[234,124,92],mug2:[112,162,172],laptop:[126,134,146],lamp:[242,204,124],chair:[86,120,128],chair2:[176,120,104],screen:[58,62,76],screenLit:[244,246,240],
  leaf:[104,160,92],soilDk:[164,74,48],brick:[204,132,104],stone:[226,214,196]};
K.col=(n,i)=>K.S.tone(i==null?K.PAL[n]:K.PAL[n][i]);
const C=K.col;

/* A chair, seen from the side. Turned (flip between 0 and 1), it goes round through the front as the person on it does: c is the
   cosine of the turn (1: facing right, 0: facing us, -1: facing left) and k how far it is still seen from the side. The seat keeps
   its width; the back, behind the sitter, crosses from one side to the other and is seen wide from the front; a plain chair's four
   legs go round with it, an office chair's column and star stay where they are. */
K.chair=(ctx,x,floor,h,flip,o)=>{o=o||{};const S=K.S,u=h/1000,seat=K.seatOf(h),y=floor-seat,col=S.tone(o.col||K.PAL.chair),fl=flip===true?1:(flip||0),c=Math.cos(Math.PI*fl),k=Math.abs(c)>0.999?1:Math.abs(c),
    s=Math.sqrt(Math.max(0,1-c*c)),X=v=>x+v*u*c,dkc=dk(col,0.25);
  if(o.swivel){const bw=lerp(112,19,k)*u,st=lerp(60,7,k)*u;
    // the star and its castors, the column, then the back on its stem, then the seat
    S.fill(ctx,c2=>{for(const q of [-118,0,118])ell(c2,x+q*u,floor-15*u,15*u,15*u);},[70,72,84],{w:0.8});
    S.fill(ctx,c2=>rrect(c2,x-132*u,floor-52*u,264*u,22*u,11*u),dkc,{});S.fill(ctx,c2=>rrect(c2,x-15*u,y+24*u,30*u,seat-24*u-44*u,6*u),[92,96,108],{w:0.8});
    S.fill(ctx,c2=>pg(c2,[[X(-128)-st,y+12*u],[X(-128)+st,y+12*u],[X(-142)+st,y-116*u],[X(-142)-st,y-116*u]]),dkc,{w:0.8});
    S.poly(ctx,[[X(-140)-bw,y-104*u],[X(-141)-bw*1.04,y-220*u],[X(-150)-bw*1.02,y-316*u],[X(-152),y-336*u],[X(-150)+bw*1.02,y-316*u],[X(-141)+bw*1.04,y-220*u],[X(-140)+bw,y-104*u],[X(-140),y-96*u]],col,S.shade?{grad:[x+100*u,0,x-170*u,0,0.14],exact:true}:{exact:true});
    S.fill(ctx,c2=>rrect(c2,X(-9)-lerp(132,141,k)*u,y-4*u,2*lerp(132,141,k)*u,34*u,15*u),lt(col,0.06),{});return;}
  if(k>=1){ctx.save();if(c<0){ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);}
    S.fill(ctx,c2=>{rrect(c2,x-128*u,y+6*u,22*u,seat-6*u,8*u);rrect(c2,x+92*u,y+6*u,22*u,seat-6*u,8*u);},dkc,{});
    S.fill(ctx,c2=>{c2.moveTo(x-140*u,y-330*u);c2.quadraticCurveTo(x-166*u,y-336*u,x-170*u,y-300*u);c2.lineTo(x-140*u,y+8*u);c2.lineTo(x-104*u,y+8*u);c2.lineTo(x-122*u,y-310*u);c2.quadraticCurveTo(x-124*u,y-330*u,x-140*u,y-330*u);c2.closePath();},col,S.shade?{grad:[x-100*u,0,x-170*u,0,0.14]}:{});
    S.fill(ctx,c2=>rrect(c2,x-150*u,y-4*u,282*u,34*u,15*u),lt(col,0.06),{});ctx.restore();return;}
  // turning: the four legs, the far pair first; the back, wide as it faces us; the seat
  const legs=[[-117,-1],[103,-1],[-117,1],[103,1]].map(([d,e])=>x+d*u*c+e*104*u*s),bb=lerp(118,18,k)*u,bt=lerp(124,24,k)*u,sw=lerp(128,141,k)*u;
  S.fill(ctx,c2=>{for(const q of legs)rrect(c2,q-11*u,y+6*u,22*u,seat-6*u,8*u);},dkc,{});
  S.poly(ctx,[[X(-122)-bb,y+8*u,1],[X(-140)-bt,y-300*u],[X(-146)-bt*0.86,y-328*u],[X(-146)+bt*0.86,y-328*u],[X(-140)+bt,y-300*u],[X(-122)+bb,y+8*u,1]],col,S.shade?{grad:[x+100*u,0,x-170*u,0,0.14],exact:true}:{exact:true});
  S.fill(ctx,c2=>rrect(c2,X(-9)-sw,y-4*u,2*sw,34*u,15*u),lt(col,0.06),{});};
K.table=(ctx,x,y,rx,floor)=>{const S=K.S,col=C("wood");S.fill(ctx,c=>ell(c,x,floor-24,150,22),dk(col,0.2),{});S.fill(ctx,c=>rrect(c,x-22,y+10,44,floor-y-34,8),dk(col,0.14),S.shade?{grad:[x+22,0,x-22,0,0.14]}:{});
  S.fill(ctx,c=>{ell(c,x,y+16,rx,34);rrect(c,x-rx,y,rx*2,16,0);},dk(col,0.1),{});S.fill(ctx,c=>ell(c,x,y,rx,34),col,S.shade?{grad:[x-rx,y-20,x+rx,y+30,0.08]}:{flat:true});};
K.desk=(ctx,x,y,w,floor,o)=>{o=o||{};const S=K.S,col=S.tone(o.col||K.PAL.wood),k=o.k||1,th=18*k,lg=20*k;
  if(o.panel)S.fill(ctx,c=>rrect(c,x-w/2+34*k,y+th,w-68*k,(floor-y)*0.5,4*k),dk(col,0.2),{flat:true});
  S.fill(ctx,c=>{rrect(c,x-w/2+16*k,y+th-2,lg,floor-y-th+2,5*k);rrect(c,x+w/2-16*k-lg,y+th-2,lg,floor-y-th+2,5*k);},dk(col,0.16),S.shade?{grad:[x+w/2,0,x-w/2,0,0.1]}:{});
  S.fill(ctx,c=>rrect(c,x-w/2,y,w,th,7*k),col,S.shade?{grad:[0,y,0,y+th,0.1]}:{});};
K.laptop=(ctx,x,y,o)=>{o=o||{};const S=K.S,k=o.k||1,c0=C("laptop"),f=o.flip?-1:1;
  S.fill(ctx,c=>pg(c,[[x-70*k*f,y],[x+62*k*f,y],[x+62*k*f,y-9*k],[x-70*k*f,y-9*k]]),c0,{});
  S.fill(ctx,c=>pg(c,[[x+56*k*f,y-8*k],[x+66*k*f,y-8*k],[x+104*k*f,y-98*k],[x+94*k*f,y-98*k]]),lt(c0,0.2),{});
  if(o.glow)S.fill(ctx,c=>pg(c,[[x+52*k*f,y-12*k],[x+56*k*f,y-10*k],[x+92*k*f,y-94*k],[x+88*k*f,y-96*k]]),C("screenLit"),{line:false,flat:true});};
K.monitor=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S,c0=C("screen");S.fill(ctx,c=>{rrect(c,x-w*0.16,y-10,w*0.32,10,4);rrect(c,x-9,y-h*0.34,18,h*0.34,3);},dk(c0,0.1),{});
  S.fill(ctx,c=>rrect(c,x-w/2,y-h-h*0.2,w,h,10),c0,{});S.fill(ctx,c=>rrect(c,x-w/2+9,y-h-h*0.2+9,w-18,h-18,5),o.lit===false?lt(c0,0.12):C("screenLit"),{line:false,flat:true});
  if(o.draw){ctx.save();ctx.beginPath();ctx.rect(x-w/2+9,y-h-h*0.2+9,w-18,h-18);ctx.clip();o.draw(ctx,x-w/2+9,y-h-h*0.2+9,w-18,h-18);ctx.restore();}};
K.board=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S;S.fill(ctx,c=>rrect(c,x-10,y-10,w+20,h+20,8),o.pin?dk(C("wood"),0.05):C("frame"),{});
  S.fill(ctx,c=>rrect(c,x,y,w,h,3),o.pin?C("cork"):C("board"),{line:false,flat:true});if(!o.pin)S.fill(ctx,c=>rrect(c,x+w*0.3,y+h+6,w*0.4,12,4),dk(C("frame"),0.12),{w:0.6});};
K.sheet=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);S.fill(ctx,c=>rrect(c,-w/2,-h/2,w,h,o.r==null?3:o.r),o.col||C("board"),{w:0.6,sa:0.2});
  if(o.pin){ctx.fillStyle=css(o.pin);ctx.beginPath();ctx.arc(0,-h/2+10,5,0,TAU);ctx.fill();}ctx.restore();};
K.mug=(ctx,x,y,k,col,t,steam)=>{const S=K.S;S.fill(ctx,c=>{c.moveTo(x+26*k,y-40*k);c.arc(x+30*k,y-28*k,16*k,-1.3,1.3);c.arc(x+30*k,y-28*k,8*k,1.3,-1.3,true);c.closePath();},col,{w:0.7});
  S.fill(ctx,c=>rrect(c,x-26*k,y-56*k,54*k,56*k,9*k),col,S.shade?{grad:[x+28*k,0,x-26*k,0,0.16]}:{});
  if(steam){ctx.save();ctx.strokeStyle="rgba(255,255,255,0.75)";ctx.lineWidth=4*k;ctx.lineCap="round";for(let i=0;i<2;i++){const ph=((t||0)*0.45+i*0.5)%1,xx=x+(i-0.5)*16*k,yy=y-62*k-ph*54*k;ctx.globalAlpha=Math.sin(ph*Math.PI)*0.8;ctx.beginPath();ctx.moveTo(xx,yy);ctx.bezierCurveTo(xx+9*k,yy-10*k,xx-9*k,yy-20*k,xx+2*k,yy-32*k);ctx.stroke();}ctx.restore();}};
K.pot=(ctx,x,y,w,h,col)=>{const S=K.S,c0=col||C("pot");S.poly(ctx,[[x-w/2,y-h,1],[x+w/2,y-h,1],[x+w*0.36,y,1],[x-w*0.36,y,1]],c0,S.shade?{grad:[x+w/2,0,x-w/2,0,0.18],exact:true}:{exact:true});
  S.fill(ctx,c=>rrect(c,x-w*0.56,y-h-w*0.11,w*1.12,w*0.2,w*0.06),lt(c0,0.1),{});};
K.plant=(ctx,x,y,k,seed,t)=>{const S=K.S,R=rnd(seed),sw=Math.sin((t||0)*0.9+seed)*0.02;
  for(let i=0;i<9;i++){const a=-1.25+i*0.31+(R()-0.5)*0.16+sw*(i-4),l=(120+R()*90)*k,bx=x+(i-4)*3*k,ex=bx+Math.sin(a)*l,ey=y-Math.cos(a)*l*(0.9+0.2*R()),w=(15+R()*9)*k,nx=Math.cos(a)*w,ny=Math.sin(a)*w;
    S.fill(ctx,c=>{c.moveTo(bx,y);c.quadraticCurveTo((bx+ex)/2-nx,(y+ey)/2-ny,ex,ey);c.quadraticCurveTo((bx+ex)/2+nx,(y+ey)/2+ny,bx,y);c.closePath();},i%2?C("plant"):C("plant2"),{w:0.6,sa:0.16});
    S.line(ctx,c=>{c.moveTo(bx,y);c.quadraticCurveTo((bx+ex)/2,(y+ey)/2,ex,ey);},null,0.35);}};
K.clock=(ctx,x,y,r,hours)=>{const S=K.S;S.fill(ctx,c=>ell(c,x,y,r,r),C("frame"),{});S.fill(ctx,c=>ell(c,x,y,r*0.84,r*0.84),lt(C("board"),0.3),{line:false,flat:true});
  ctx.save();ctx.strokeStyle=css(dk(C("frame"),0.45));ctx.lineCap="round";ctx.lineWidth=Math.max(1.5,r*0.05);ctx.beginPath();for(let i=0;i<12;i++){const a=i*TAU/12;ctx.moveTo(x+Math.sin(a)*r*0.7,y-Math.cos(a)*r*0.7);ctx.lineTo(x+Math.sin(a)*r*0.78,y-Math.cos(a)*r*0.78);}ctx.stroke();
  if(hours==null||hours!==hours){ctx.restore();return;}
  const hh=hours%12,ah=hh/12*TAU,am=(hours%1)*TAU;ctx.strokeStyle=css(K.C.ink);ctx.lineWidth=Math.max(2,r*0.09);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(ah)*r*0.42,y-Math.cos(ah)*r*0.42);ctx.stroke();
  ctx.lineWidth=Math.max(1.6,r*0.06);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(am)*r*0.64,y-Math.cos(am)*r*0.64);ctx.stroke();ctx.restore();};
K.door=(ctx,x,y,w,h,o)=>{o=o||{};const S=K.S,col=S.tone(o.col||K.PAL.wood),op=clamp(o.open||0,0,1);
  S.fill(ctx,c=>rrect(c,x-w/2-12,y-h-12,w+24,h+12,4),C("frame"),{});
  S.fill(ctx,c=>rrect(c,x-w/2,y-h,w,h,2),o.beyond||dk(C("wall"),0.3),{line:false,flat:true});
  const dw=w*(1-0.72*op);S.fill(ctx,c=>pg(c,[[x-w/2,y-h],[x-w/2+dw,y-h+op*16],[x-w/2+dw,y-op*10],[x-w/2,y]]),col,S.shade?{grad:[x-w/2,0,x-w/2+dw,0,0.1]}:{});
  if(o.glass)S.fill(ctx,c=>pg(c,[[x-w/2+dw*0.2,y-h*0.86],[x-w/2+dw*0.8,y-h*0.86+op*10],[x-w/2+dw*0.8,y-h*0.5+op*4],[x-w/2+dw*0.2,y-h*0.5]]),C("glass"),{w:0.6,flat:true});
  ctx.fillStyle=css(dk(col,0.5));ctx.beginPath();ctx.arc(x-w/2+dw*0.86,y-h*0.46,Math.max(3,w*0.035),0,TAU);ctx.fill();};
K.seedling=(ctx,x,y,k,g,o)=>{o=o||{};g=g==null?1:g;const S=K.S,lf=o.col||C("leaf");
  S.fill(ctx,c=>{pg(c,[[x-3*k,y],[x+3*k,y],[x+2*k,y-46*k*g],[x-1*k,y-46*k*g]]);},dk(lf,0.2),{w:0.5,flat:true});
  for(const [dy,a,l] of [[-14,-1,22],[-22,1,24],[-32,-1,20],[-40,1,18],[-46,0,16]]){const bx=x+0.5*k,by=y+dy*k*g,ex=bx+a*l*k*g,ey=by-(a?10:18)*k*g;
    S.fill(ctx,c=>{c.moveTo(bx,by);c.quadraticCurveTo((bx+ex)/2+a*2*k,by-12*k*g,ex,ey);c.quadraticCurveTo((bx+ex)/2-a*2*k,by+3*k*g,bx,by);c.closePath();},a>0?lf:lt(lf,0.12),{w:0.5,flat:true});}
  if(!o.bare)S.fill(ctx,c=>ell(c,x,y+2*k,16*k,5*k),o.soil||C("soilDk"),{w:0.5,flat:true});};
K.potted=(ctx,x,y,k,g,col)=>{K.seedling(ctx,x,y-30*k,k*0.9,g,{bare:true});K.pot(ctx,x,y,40*k,30*k,col);};
/* a tree: a trunk and a crown of a few rounds; g (0 to 1) is how grown it is */
K.tree=(ctx,x,y,k,seed,o)=>{o=o||{};const S=K.S,R=rnd(seed||1),g=o.g==null?1:o.g,col=o.col||C(R()<0.5?"viewTree":"viewTree2"),th=(150+R()*50)*k*g,r=(84+R()*26)*k*g,tw=Math.max(2,13*k*Math.sqrt(g));
  S.fill(ctx,c=>pg(c,[[x-tw*0.75,y],[x+tw*0.75,y],[x+tw*0.45,y-th],[x-tw*0.45,y-th]]),o.trunk||C("trunk"),{w:0.7,flat:true});
  const cy=y-th-r*0.42;S.fill(ctx,c=>{ell(c,x,cy,r,r*0.84);ell(c,x-r*0.56,cy+r*0.3,r*0.62,r*0.5);ell(c,x+r*0.58,cy+r*0.26,r*0.58,r*0.48);ell(c,x+r*0.1,cy-r*0.46,r*0.6,r*0.46);},col,S.shade?{grad:[x+r,cy-r,x-r,cy+r,0.16],sa:0.14}:{sa:0.14});
  if(!o.far)S.line(ctx,c=>{c.moveTo(x-r*0.5,cy+r*0.1);c.quadraticCurveTo(x-r*0.3,cy+r*0.34,x-r*0.04,cy+r*0.22);c.moveTo(x+r*0.2,cy-r*0.2);c.quadraticCurveTo(x+r*0.42,cy+r*0.02,x+r*0.66,cy-r*0.08);},dk(col,0.3),0.5);};
K.cloud=(ctx,x,y,k)=>{K.S.fill(ctx,c=>{ell(c,x,y,70*k,26*k);ell(c,x+52*k,y+6*k,54*k,20*k);ell(c,x-56*k,y+8*k,48*k,17*k);ell(c,x+6*k,y-16*k,40*k,22*k);},C("cloud"),{sa:0.12});};
K.tick=(ctx,x,y,r,a,col)=>{if(a<=0.004)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.fillStyle=css(col||K.C.green);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle="#fff";ctx.lineWidth=r*0.26;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-r*0.44,y+r*0.02);ctx.lineTo(x-r*0.12,y+r*0.36);ctx.lineTo(x+r*0.46,y-r*0.32);ctx.stroke();ctx.restore();};
})(PK);
