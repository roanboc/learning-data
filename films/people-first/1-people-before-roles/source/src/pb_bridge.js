/* ===== The rope bridge itself, drawn live over the gorge (pb_place.js), so it can be built, wear, sag and fall =====
   Six cables, as the sources have them: four for the floor, each a braid of three ropes, and two handrails, each of two ropes twisted;
   the sides, cords that tie each handrail to the floor; rods laid across the floor cables and a mat unrolled on top. Each part is
   drawn on its own, by how far it has come (0 to 1).
     PB_A, pb_anchor(id, side)     where each cable leaves each stone base: id "f0" to "f3" (the floor, f0 nearest us) or "r0", "r1" (the
                                   handrails, r0 nearest us); side 0 the left bank, 1 the right
     pb_sag(age)                   how far the bridge hangs at its middle, in px: about 52 new, about 94 a year on
     pb_at(id, u, o)               the point on a cable, u from 0 (left base) to 1 (right base); o.age, o.sag (px, or {id: px}), o.extra
                                   ({id: px} more, so one handrail can hang lower than the other)
     pb_deck(u, o), pb_tilt(u, o)  where feet stand on the floor at u, and the floor's slope there (radians)
     pb_hang(a, b, sag, n)         the points of any rope hanging between two points
     pb_rope(ctx, P, w, o)         a grass rope along the points P, w px thick, its twist showing: o.age (0 new, straw; 1 a year on,
                                   grey-brown; more, past its year), o.braid (a braid's chevrons, for a cable), o.col, o.a.
                                   The same look at every size: a cord (w 2 to 4 in the wide view, 9 or so held in a hand), a rope, a cable
     pb_cable(ctx, id, o)          one cable: o.p how far it has been carried across (0 to 1), o.from the bank it starts on (0 or 1),
                                   o.end where its free end is now (else it lies along its own curve) with o.slack its sag on the way,
                                   o.age, o.sag, o.tied false to leave off the turns round the stone
     pb_bridge(ctx, o)             the bridge: o.f [four] and o.r [two] how far each cable has come (or one number for all), o.from,
                                   o.ties [from the left, from the right] how far the sides are tied on from each bank (the two meet
                                   when they add up to 1), o.floor the same for the rods and o.mat for the mat, o.age, o.sag, o.extra,
                                   o.wear (0 to 1: rods gone from the floor, the mat in holes), o.a; o.part "back" or "front" to draw
                                   what is behind or in front of someone on the floor, or o.mid(ctx) to draw them in between
     pb_fallen(ctx, o)             last year's bridge, cut loose, lying in the river below
     pb_steel(ctx, o)              the steel bridge upstream, small and far, for the film that needs it */

const PB_A={f0:[[504,442],[1416,446]],f3:[[512,434],[1408,438]],r0:[[504,410],[1416,414]],r1:[[512,402],[1408,406]]};
PB_A.f1=[0,1].map(i=>[lerp(PB_A.f0[i][0],PB_A.f3[i][0],1/3),lerp(PB_A.f0[i][1],PB_A.f3[i][1],1/3)]);
PB_A.f2=[0,1].map(i=>[lerp(PB_A.f0[i][0],PB_A.f3[i][0],2/3),lerp(PB_A.f0[i][1],PB_A.f3[i][1],2/3)]);
const PB_CABLES=["f0","f1","f2","f3","r0","r1"];
const pb_anchor=(id,side)=>PB_A[id][side];
const pb_sag=age=>52+46*(1-Math.exp(-3*Math.max(0,age||0)))+10*Math.max(0,(age||0)-1);
// new rope is the colour of straw; a year of sun and rain turns it grey-brown, though less than it loosens it
function pb_straw(age){age=age||0;return age<=1?mix(PB_K.straw,PB_K.strawOld,clamp(age,0,1)):mix(PB_K.strawOld,PB_K.strawDead,clamp(age-1,0,1));}
function pb_sagOf(id,o){o=o||{};const s=o.sag==null?pb_sag(o.age):typeof o.sag==="number"?o.sag:(o.sag[id]==null?pb_sag(o.age):o.sag[id]);return s+((o.extra&&o.extra[id])||0);}
function pb_at(id,u,o){const a=PB_A[id][0],b=PB_A[id][1];return[lerp(a[0],b[0],u),lerp(a[1],b[1],u)+4*pb_sagOf(id,o)*u*(1-u)];}
function pb_deck(u,o){const a=pb_at("f1",u,o),b=pb_at("f2",u,o);return[(a[0]+b[0])/2,(a[1]+b[1])/2];}
function pb_tilt(u,o){const a=pb_deck(Math.max(0,u-0.01),o),b=pb_deck(Math.min(1,u+0.01),o);return Math.atan2(b[1]-a[1],b[0]-a[0]);}
function pb_hang(a,b,sag,n){n=n||24;const P=[];for(let i=0;i<=n;i++){const u=i/n;P.push([lerp(a[0],b[0],u),lerp(a[1],b[1],u)+4*sag*u*(1-u)]);}return P;}
function pb_span(id,u0,u1,o,n){n=n||Math.max(4,Math.round(Math.abs(u1-u0)*48));const P=[];for(let i=0;i<=n;i++)P.push(pb_at(id,lerp(u0,u1,i/n),o));return P;}
const pb_hash=(i,k)=>{const v=Math.sin(i*127.1+(k||0)*311.7)*43758.5453;return v-Math.floor(v);};

/* ---------------------------------------------------------------- a rope of twisted grass */
function pb_rope(ctx,P,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||P.length<2||w<=0)return;const col=o.col||pb_straw(o.age),dk=ag_dk(col,0.42),lt=ag_lt(col,0.42),
    m=ctx.getTransform(),k=Math.hypot(m.a,m.b)||1,px=w*k;
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap=o.cap||"round";ctx.lineJoin="round";
  const path=(dx,dy)=>{ctx.beginPath();ctx.moveTo(P[0][0]+dx,P[0][1]+dy);for(let i=1;i<P.length;i++)ctx.lineTo(P[i][0]+dx,P[i][1]+dy);};
  if(px>=9){// seen close: the strands themselves, each a lobe of twisted grass lying over the last (two rows of them in a braid)
    path(0,0);ctx.strokeStyle=rgba(dk,1);ctx.lineWidth=w*0.8;ctx.stroke();
    const sp=w*(o.braid?0.4:0.56),stray=[];let acc=0,n=0;
    for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],dx=P[i][0]-ax,dy=P[i][1]-ay,d=Math.hypot(dx,dy)||1,tx=dx/d,ty=dy/d,nx=-ty,ny=tx,an=Math.atan2(dy,dx);
      while(acc<=d){const sd=o.braid?(n%2?1:-1):0,x=ax+tx*acc+nx*sd*w*0.17,y=ay+ty*acc+ny*sd*w*0.17,rot=an+(o.braid?sd*-0.62:0.95),rx=w*(o.braid?0.5:0.56),ry=w*(o.braid?0.27:0.27);
        ctx.fillStyle=rgba(dk,0.9);ctx.beginPath();ctx.ellipse(x+w*0.03,y+w*0.05,rx,ry,rot,0,TAU);ctx.fill();
        ctx.fillStyle=rgba(mix(col,dk,pb_hash(n,2)*0.18),1);ctx.beginPath();ctx.ellipse(x,y,rx*0.94,ry*0.84,rot,0,TAU);ctx.fill();
        ctx.fillStyle=rgba(lt,0.5);ctx.beginPath();ctx.ellipse(x+w*0.04,y-w*0.07,rx*0.6,ry*0.3,rot,0,TAU);ctx.fill();
        // the grass's own lines along the strand, and a loose end now and then
        ctx.strokeStyle=rgba(dk,0.3);ctx.lineWidth=Math.max(0.7/k,w*0.022);ctx.beginPath();ctx.moveTo(x-Math.cos(rot)*rx*0.7,y-Math.sin(rot)*rx*0.7);ctx.lineTo(x+Math.cos(rot)*rx*0.7,y+Math.sin(rot)*rx*0.7);ctx.stroke();
        if(pb_hash(n,3)<0.3){const s2=pb_hash(n,5)<0.5?-1:1,l=w*(0.2+pb_hash(n,7)*0.3);stray.push([x+nx*w*0.42*s2,y+ny*w*0.42*s2,x+nx*(w*0.42+l*0.7)*s2+tx*l,y+ny*(w*0.42+l*0.7)*s2+ty*l]);}
        acc+=sp;n++;}
      acc-=d;}
    ctx.strokeStyle=rgba(lt,0.85);ctx.lineWidth=Math.max(1/k,w*0.045);ctx.beginPath();for(const q of stray){ctx.moveTo(q[0],q[1]);ctx.lineTo(q[2],q[3]);}ctx.stroke();ctx.restore();return;}
  // its shaded side, its body, the light along its top
  path(0,0);ctx.strokeStyle=rgba(dk,1);ctx.lineWidth=w;ctx.stroke();
  path(w*0.05,-w*0.11);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=w*0.74;ctx.stroke();
  if(px>=2.2){path(w*0.1,-w*0.25);ctx.strokeStyle=rgba(lt,0.75);ctx.lineWidth=w*0.2;ctx.stroke();}
  // the twist: slanted grooves across it (a braid's chevrons for a cable)
  if(px>=3){const sp=Math.max(w*(o.braid?0.92:0.78),3/k),h=w*0.42,sl=w*0.34;let acc=sp*0.5;ctx.strokeStyle=rgba(dk,o.braid?0.62:0.55);ctx.lineWidth=Math.max(0.8/k,w*0.1);ctx.beginPath();
    for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],dx=P[i][0]-ax,dy=P[i][1]-ay,d=Math.hypot(dx,dy)||1,tx=dx/d,ty=dy/d,nx=-ty,ny=tx;
      while(acc<=d){const x=ax+tx*acc,y=ay+ty*acc;
        if(o.braid){ctx.moveTo(x-tx*sl+nx*h,y-ty*sl+ny*h);ctx.lineTo(x+tx*sl,y+ty*sl);ctx.lineTo(x-tx*sl-nx*h,y-ty*sl-ny*h);}
        else{ctx.moveTo(x-tx*sl+nx*h,y-ty*sl+ny*h);ctx.lineTo(x+tx*sl-nx*h,y+ty*sl-ny*h);}
        acc+=sp;}
      acc-=d;}
    ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the cables, tied off behind the stone bases */
// a point of the left base, or its mirror on the right bank
const pb_bp=(side,x,y)=>side?[W-x,y+4]:[x,y];
function pb_tie(ctx,id,side,o,w){const A=PB_A[id][side],rail=id[0]==="r",dir=side?1:-1,q={age:o.age,a:o.a};
  if(rail){// turns round its pillar, and the end made fast
    const far=id==="r1",x0=far?500:474,x1=far?508:500;for(let n=0;n<3;n++){const y=(far?398:404)+n*5.2;pb_rope(ctx,[pb_bp(side,x0,y+0.6),pb_bp(side,x1,y),pb_bp(side,x1+8,y-8)],w*0.86,q);}}
  else{// across the top of the platform to the stone beam it is tied round
    const k=+id[1],ex=A[0]+dir*(62+k*4),ey=A[1]+2.5;pb_rope(ctx,[A,[A[0]+dir*30,A[1]+1],[ex,ey]],w,Object.assign({braid:true},q));
    for(let n=0;n<3;n++)pb_rope(ctx,[[ex+dir*n*3.6,ey-4.6],[ex+dir*n*3.6+dir,ey+4.4]],w*0.8,q);}}
function pb_cable(ctx,id,o){o=o||{};const p=o.p==null?1:clamp(o.p,0,1);if(p<=0.002)return null;const from=o.from?1:0,rail=id[0]==="r",w=o.w||(rail?4.6:5.6);let P;
  if(o.end)P=pb_hang(PB_A[id][from],o.end,o.slack==null?30:o.slack,28);else P=from?pb_span(id,1,1-p,o):pb_span(id,0,p,o);
  pb_rope(ctx,P,w,{age:o.age,a:o.a,braid:!rail});
  if(o.tied!==false){pb_tie(ctx,id,from,o,w);if(p>=0.999&&!o.end)pb_tie(ctx,id,1-from,o,w);}
  return P[P.length-1];}

/* ---------------------------------------------------------------- the sides, the floor */
// what is covered when work has come a from the left bank and b from the right: [[u0, u1], ...]
function pb_cover(ab){const a=clamp(ab[0],0,1),b=clamp(ab[1],0,1);if(a+b>=1)return[[0,1]];const out=[];if(a>0)out.push([0,a]);if(b>0)out.push([1-b,1]);return out;}
const pb_in=(cv,u)=>cv.some(r=>u>=r[0]-1e-6&&u<=r[1]+1e-6);
function pb_ties(ctx,rail,fl,ties,o){const cv=pb_cover(ties);if(!cv.length)return;const N=66,col=pb_straw(o.age),near=rail==="r0";ctx.save();ctx.lineCap="round";
  for(const [c2,lw,dx] of [[ag_dk(col,0.4),1.7,0],[near?ag_lt(col,0.1):ag_dk(col,0.12),0.9,0.4]]){ctx.strokeStyle=rgba(c2,near?1:0.85);ctx.lineWidth=lw;ctx.beginPath();
    for(let i=1;i<N;i++){const u=i/N;if(!pb_in(cv,u))continue;const a=pb_at(rail,u,o),b=pb_at(fl,u,o);ctx.moveTo(a[0]+dx,a[1]);ctx.lineTo(b[0]+dx,b[1]);
      // every other cord crosses to the next: the sides are a net, not a fence
      if(i%2&&pb_in(cv,(i+1)/N)){const b2=pb_at(fl,(i+1)/N,o);ctx.moveTo(a[0]+dx,a[1]);ctx.lineTo(b2[0]+dx,b2[1]);}}
    ctx.stroke();}
  ctx.restore();}
function pb_floor(ctx,o){const col=pb_straw(o.age),wear=clamp(o.wear||0,0,1),N=38,rods=pb_cover(o.floor==null?[1,1]:o.floor),mat=pb_cover(o.mat==null?(o.floor==null?[1,1]:o.floor):o.mat);ctx.save();ctx.lineCap="round";
  // rods of wood across the four cables, their ends standing out a little at each side
  ctx.strokeStyle=rgba(mix(PB_K.stick,PB_K.strawDead,clamp((o.age||0)*0.4,0,0.6)),1);ctx.lineWidth=1.7;ctx.beginPath();
  for(let i=1;i<N;i++){const u=i/N;if(!pb_in(rods,u)||pb_hash(i,11)<wear)continue;const a=pb_at("f0",u,o),b=pb_at("f3",u,o);ctx.moveTo(a[0]-2.4,a[1]+2.4);ctx.lineTo(b[0]+2.4,b[1]-2.4);}ctx.stroke();
  // the mat on top, in lengths; where it has worn through, the cables show
  const mc=mix(mix(col,[168,150,98],0.4),PB_K.strawDead,clamp((o.age||0)-0.6,0,0.6));
  for(let i=0;i<N;i++){const u0=i/N,u1=(i+1)/N;if(!pb_in(mat,u0)||!pb_in(mat,u1)||pb_hash(i,17)<wear*0.85)continue;const P=[pb_at("f0",u0,o),pb_at("f0",u1,o),pb_at("f3",u1,o),pb_at("f3",u0,o)];
    ctx.fillStyle=rgba(i%2?mc:ag_lt(mc,0.07),1);ctx.beginPath();ctx.moveTo(P[0][0]+1,P[0][1]-0.6);ctx.lineTo(P[1][0]+1.6,P[1][1]-0.6);ctx.lineTo(P[2][0]-0.4,P[2][1]+0.6);ctx.lineTo(P[3][0]-1,P[3][1]+0.6);ctx.closePath();ctx.fill();}
  ctx.restore();}
// the cords' loose ends, hanging under the near side of the floor
function pb_fringe(ctx,ties,o){const cv=pb_cover(ties);if(!cv.length)return;const N=132,col=pb_straw(o.age);ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(ag_dk(col,0.2),0.9);ctx.lineWidth=1;ctx.beginPath();
  for(let i=1;i<N;i++){const u=i/N;if(!pb_in(cv,u)||pb_hash(i,23)<0.25)continue;const a=pb_at("f0",u,o),l=3+pb_hash(i,29)*8;ctx.moveTo(a[0],a[1]+2);ctx.lineTo(a[0]+(pb_hash(i,31)-0.5)*3,a[1]+2+l);}ctx.stroke();ctx.restore();}
function pb_bridge(ctx,o){o=o||{};const part=o.part||"all",a=o.a==null?1:o.a;if(a<=0.004)return;const fP=k=>o.f==null?1:typeof o.f==="number"?o.f:o.f[k],rP=k=>o.r==null?1:typeof o.r==="number"?o.r:o.r[k],
    ties=o.ties==null?[1,1]:o.ties,C=(id,p)=>pb_cable(ctx,id,Object.assign({},o,{p,end:null,a:1,w:null}));
  ctx.save();ctx.globalAlpha*=a;
  if(part!=="front"){C("r1",rP(1));pb_ties(ctx,"r1","f3",ties,o);C("f3",fP(3));C("f2",fP(2));C("f1",fP(1));pb_floor(ctx,o);}
  if(part==="all"&&o.mid)o.mid(ctx);
  if(part!=="back"){C("f0",fP(0));pb_fringe(ctx,ties,o);pb_ties(ctx,"r0","f0",ties,o);C("r0",rP(0));}
  ctx.restore();}

/* ---------------------------------------------------------------- last year's bridge in the river; the steel bridge upstream */
// cut loose once the new cables are tied, the old bridge falls and the river takes it: o.age its colour, o.k how far it has gone under
// and downstream (0 just fallen, 1 gone), o.a
function pb_fallen(ctx,o){o=o||{};const a=(o.a==null?1:o.a)*(1-clamp(o.k||0,0,1));if(a<=0.004)return;const age=o.age==null?1:o.age,k=clamp(o.k||0,0,1),dy=k*70,q={age,a:1};
  ctx.save();ctx.globalAlpha*=a;
  const A=[[668,806+dy],[760,842+dy],[880,826+dy],[1000,858+dy],[1120,836+dy],[1236,862+dy]];
  for(const [off,w,br] of [[0,5.4,true],[5,5,true],[-5,4.4,false],[9,4,false]]){const P=[];for(let i=0;i<A.length-1;i++)for(let j=0;j<8;j++){const u=j/8;P.push([lerp(A[i][0],A[i+1][0],u),lerp(A[i][1],A[i+1][1],u)+off+3*Math.sin((i*8+j)*0.9+off)]);}pb_rope(ctx,P,w,Object.assign({braid:br},q));}
  // the water breaking white over it
  for(let n=0;n<26;n++){ctx.fillStyle=rgba(PB_K.foam,0.3+pb_hash(n,41)*0.4);ctx.beginPath();ctx.ellipse(lerp(690,1220,pb_hash(n,43)),836+dy+pb_hash(n,47)*34,6+pb_hash(n,53)*12,1.6+pb_hash(n,59)*1.6,0,0,TAU);ctx.fill();}
  ctx.restore();}
// a plain truss of steel, far up the gorge at the bend: o.a
function pb_steel(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const x0=742,x1=1150,y=338,h=17;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="butt";
  ctx.strokeStyle=rgba(mix(PB_K.steel,[190,204,218],0.25),1);ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x0+12,y-h);ctx.lineTo(x1-12,y-h);ctx.stroke();
  ctx.lineWidth=1.6;ctx.beginPath();const n=12,dx=(x1-x0)/n;for(let i=0;i<n;i++){const xa=x0+i*dx,xb=xa+dx;ctx.moveTo(xa,y);ctx.lineTo(xa+dx/2,y-h);ctx.lineTo(xb,y);}ctx.stroke();
  ctx.fillStyle=rgba(mix(PB_K.stoneSh,[190,204,218],0.25),1);ctx.fillRect(x0-10,y,16,20);ctx.fillRect(x1-6,y,16,20);ctx.restore();}
