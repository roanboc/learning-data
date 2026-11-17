/* ===== No two alike: the rope bridge, and the small people who cross it =====
   The series' first shared version (people-first/bridge/qb_bridge.js and the small figures of qb_people.js, 12 November 2026), copied
   here with this film's prefix (na_qb_, NA_QB_). Six cables, as the sources have them: four for the floor, each a braid of three
   ropes, and two handrails, each of two ropes twisted; the sides, cords that tie each handrail to the floor; rods across the floor
   cables and a mat on top. This film draws only the finished bridge, new, with three people crossing: nothing is built, worn or cut
   loose here.
     NA_QB_A, na_qb_anchor(id, side)   where each cable leaves each stone base
     na_qb_at(id, u, o), na_qb_deck(u, o)   the point on a cable, and where feet stand on the floor, u from 0 (left base) to 1
     na_qb_rope(ctx, P, w, o)          a grass rope along the points P, w px thick, its twist showing
     na_qb_bridge(ctx, o)              the bridge: o.age (0 new), o.mid(ctx) draws people on the floor between its far and near sides
     na_qb_fig(ctx, x, y, h, o)        a small whole person for the wide view, from the side: o.who (one of NA_QB_FOLK), o.pose
                                       ("stand", "walk", "sit", "carry"), o.t for the step, o.flip, o.shadow, o.a
   The people are dressed from the sources' photographs and words, in plain colours that mean nothing in these films; no pattern is
   invented and none is copied; nobody drawn is a likeness of a real person. */

const NA_QB_A={f0:[[504,442],[1416,446]],f3:[[512,434],[1408,438]],r0:[[504,410],[1416,414]],r1:[[512,402],[1408,406]]};
NA_QB_A.f1=[0,1].map(i=>[lerp(NA_QB_A.f0[i][0],NA_QB_A.f3[i][0],1/3),lerp(NA_QB_A.f0[i][1],NA_QB_A.f3[i][1],1/3)]);
NA_QB_A.f2=[0,1].map(i=>[lerp(NA_QB_A.f0[i][0],NA_QB_A.f3[i][0],2/3),lerp(NA_QB_A.f0[i][1],NA_QB_A.f3[i][1],2/3)]);
const NA_QB_CABLES=["f0","f1","f2","f3","r0","r1"];
const na_qb_anchor=(id,side)=>NA_QB_A[id][side];
const na_qb_sag=age=>52+46*(1-Math.exp(-3*Math.max(0,age||0)))+10*Math.max(0,(age||0)-1);
// new rope is the colour of straw; a year of sun and rain turns it grey-brown, though less than it loosens it
function na_qb_straw(age){age=age||0;return age<=1?mix(NA_QB_K.straw,NA_QB_K.strawOld,clamp(age,0,1)):mix(NA_QB_K.strawOld,NA_QB_K.strawDead,clamp(age-1,0,1));}
function na_qb_sagOf(id,o){o=o||{};const s=o.sag==null?na_qb_sag(o.age):typeof o.sag==="number"?o.sag:(o.sag[id]==null?na_qb_sag(o.age):o.sag[id]);return s+((o.extra&&o.extra[id])||0);}
function na_qb_at(id,u,o){const a=NA_QB_A[id][0],b=NA_QB_A[id][1];return[lerp(a[0],b[0],u),lerp(a[1],b[1],u)+4*na_qb_sagOf(id,o)*u*(1-u)];}
function na_qb_deck(u,o){const a=na_qb_at("f1",u,o),b=na_qb_at("f2",u,o);return[(a[0]+b[0])/2,(a[1]+b[1])/2];}
function na_qb_tilt(u,o){const a=na_qb_deck(Math.max(0,u-0.01),o),b=na_qb_deck(Math.min(1,u+0.01),o);return Math.atan2(b[1]-a[1],b[0]-a[0]);}
function na_qb_hang(a,b,sag,n){n=n||24;const P=[];for(let i=0;i<=n;i++){const u=i/n;P.push([lerp(a[0],b[0],u),lerp(a[1],b[1],u)+4*sag*u*(1-u)]);}return P;}
function na_qb_span(id,u0,u1,o,n){n=n||Math.max(4,Math.round(Math.abs(u1-u0)*48));const P=[];for(let i=0;i<=n;i++)P.push(na_qb_at(id,lerp(u0,u1,i/n),o));return P;}
const na_qb_hash=(i,k)=>{const v=Math.sin(i*127.1+(k||0)*311.7)*43758.5453;return v-Math.floor(v);};

/* ---------------------------------------------------------------- a rope of twisted grass */
function na_qb_rope(ctx,P,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||P.length<2||w<=0)return;const col=o.col||na_qb_straw(o.age),dk=ag_dk(col,0.42),lt=ag_lt(col,0.42),
    m=ctx.getTransform(),k=Math.hypot(m.a,m.b)||1,px=w*k;
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap=o.cap||"round";ctx.lineJoin="round";
  const path=(dx,dy)=>{ctx.beginPath();ctx.moveTo(P[0][0]+dx,P[0][1]+dy);for(let i=1;i<P.length;i++)ctx.lineTo(P[i][0]+dx,P[i][1]+dy);};
  if(px>=9){// seen close: the strands themselves, each a lobe of twisted grass lying over the last (two rows of them in a braid)
    path(0,0);ctx.strokeStyle=rgba(dk,1);ctx.lineWidth=w*0.8;ctx.stroke();
    const sp=w*(o.braid?0.4:0.56),stray=[];let acc=0,n=0;
    for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],dx=P[i][0]-ax,dy=P[i][1]-ay,d=Math.hypot(dx,dy)||1,tx=dx/d,ty=dy/d,nx=-ty,ny=tx,an=Math.atan2(dy,dx);
      while(acc<=d){const sd=o.braid?(n%2?1:-1):0,x=ax+tx*acc+nx*sd*w*0.17,y=ay+ty*acc+ny*sd*w*0.17,rot=an+(o.braid?sd*-0.62:0.95),rx=w*(o.braid?0.5:0.56),ry=w*(o.braid?0.27:0.27);
        ctx.fillStyle=rgba(dk,0.9);ctx.beginPath();ctx.ellipse(x+w*0.03,y+w*0.05,rx,ry,rot,0,TAU);ctx.fill();
        ctx.fillStyle=rgba(mix(col,dk,na_qb_hash(n,2)*0.18),1);ctx.beginPath();ctx.ellipse(x,y,rx*0.94,ry*0.84,rot,0,TAU);ctx.fill();
        ctx.fillStyle=rgba(lt,0.5);ctx.beginPath();ctx.ellipse(x+w*0.04,y-w*0.07,rx*0.6,ry*0.3,rot,0,TAU);ctx.fill();
        // the grass's own lines along the strand, and a loose end now and then
        ctx.strokeStyle=rgba(dk,0.3);ctx.lineWidth=Math.max(0.7/k,w*0.022);ctx.beginPath();ctx.moveTo(x-Math.cos(rot)*rx*0.7,y-Math.sin(rot)*rx*0.7);ctx.lineTo(x+Math.cos(rot)*rx*0.7,y+Math.sin(rot)*rx*0.7);ctx.stroke();
        if(na_qb_hash(n,3)<0.3){const s2=na_qb_hash(n,5)<0.5?-1:1,l=w*(0.2+na_qb_hash(n,7)*0.3);stray.push([x+nx*w*0.42*s2,y+ny*w*0.42*s2,x+nx*(w*0.42+l*0.7)*s2+tx*l,y+ny*(w*0.42+l*0.7)*s2+ty*l]);}
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
const na_qb_bp=(side,x,y)=>side?[W-x,y+4]:[x,y];
function na_qb_tie(ctx,id,side,o,w){const A=NA_QB_A[id][side],rail=id[0]==="r",dir=side?1:-1,q={age:o.age,a:o.a};
  if(rail){// turns round its pillar, and the end made fast
    const far=id==="r1",x0=far?500:474,x1=far?508:500;for(let n=0;n<3;n++){const y=(far?398:404)+n*5.2;na_qb_rope(ctx,[na_qb_bp(side,x0,y+0.6),na_qb_bp(side,x1,y),na_qb_bp(side,x1+8,y-8)],w*0.86,q);}}
  else{// across the top of the platform to the stone beam it is tied round
    const k=+id[1],ex=A[0]+dir*(62+k*4),ey=A[1]+2.5;na_qb_rope(ctx,[A,[A[0]+dir*30,A[1]+1],[ex,ey]],w,Object.assign({braid:true},q));
    for(let n=0;n<3;n++)na_qb_rope(ctx,[[ex+dir*n*3.6,ey-4.6],[ex+dir*n*3.6+dir,ey+4.4]],w*0.8,q);}}
function na_qb_cable(ctx,id,o){o=o||{};const p=o.p==null?1:clamp(o.p,0,1);if(p<=0.002)return null;const from=o.from?1:0,rail=id[0]==="r",w=o.w||(rail?4.6:5.6);let P;
  if(o.end)P=na_qb_hang(NA_QB_A[id][from],o.end,o.slack==null?30:o.slack,28);else P=from?na_qb_span(id,1,1-p,o):na_qb_span(id,0,p,o);
  na_qb_rope(ctx,P,w,{age:o.age,a:o.a,braid:!rail});
  if(o.tied!==false){na_qb_tie(ctx,id,from,o,w);if(p>=0.999&&!o.end)na_qb_tie(ctx,id,1-from,o,w);}
  return P[P.length-1];}

/* ---------------------------------------------------------------- the sides, the floor */
// what is covered when work has come a from the left bank and b from the right: [[u0, u1], ...]
function na_qb_cover(ab){const a=clamp(ab[0],0,1),b=clamp(ab[1],0,1);if(a+b>=1)return[[0,1]];const out=[];if(a>0)out.push([0,a]);if(b>0)out.push([1-b,1]);return out;}
const na_qb_in=(cv,u)=>cv.some(r=>u>=r[0]-1e-6&&u<=r[1]+1e-6);
function na_qb_ties(ctx,rail,fl,ties,o){const cv=na_qb_cover(ties);if(!cv.length)return;const N=66,col=na_qb_straw(o.age),near=rail==="r0";ctx.save();ctx.lineCap="round";
  for(const [c2,lw,dx] of [[ag_dk(col,0.4),1.7,0],[near?ag_lt(col,0.1):ag_dk(col,0.12),0.9,0.4]]){ctx.strokeStyle=rgba(c2,near?1:0.85);ctx.lineWidth=lw;ctx.beginPath();
    for(let i=1;i<N;i++){const u=i/N;if(!na_qb_in(cv,u))continue;const a=na_qb_at(rail,u,o),b=na_qb_at(fl,u,o);ctx.moveTo(a[0]+dx,a[1]);ctx.lineTo(b[0]+dx,b[1]);
      // every other cord crosses to the next: the sides are a net, not a fence
      if(i%2&&na_qb_in(cv,(i+1)/N)){const b2=na_qb_at(fl,(i+1)/N,o);ctx.moveTo(a[0]+dx,a[1]);ctx.lineTo(b2[0]+dx,b2[1]);}}
    ctx.stroke();}
  ctx.restore();}
function na_qb_floor(ctx,o){const col=na_qb_straw(o.age),wear=clamp(o.wear||0,0,1),N=38,rods=na_qb_cover(o.floor==null?[1,1]:o.floor),mat=na_qb_cover(o.mat==null?(o.floor==null?[1,1]:o.floor):o.mat);ctx.save();ctx.lineCap="round";
  // rods of wood across the four cables, their ends standing out a little at each side
  ctx.strokeStyle=rgba(mix(NA_QB_K.stick,NA_QB_K.strawDead,clamp((o.age||0)*0.4,0,0.6)),1);ctx.lineWidth=1.7;ctx.beginPath();
  for(let i=1;i<N;i++){const u=i/N;if(!na_qb_in(rods,u)||na_qb_hash(i,11)<wear)continue;const a=na_qb_at("f0",u,o),b=na_qb_at("f3",u,o);ctx.moveTo(a[0]-2.4,a[1]+2.4);ctx.lineTo(b[0]+2.4,b[1]-2.4);}ctx.stroke();
  // the mat on top, in lengths; where it has worn through, the cables show
  const mc=mix(mix(col,[168,150,98],0.4),NA_QB_K.strawDead,clamp((o.age||0)-0.6,0,0.6));
  for(let i=0;i<N;i++){const u0=i/N,u1=(i+1)/N;if(!na_qb_in(mat,u0)||!na_qb_in(mat,u1)||na_qb_hash(i,17)<wear*0.85)continue;const P=[na_qb_at("f0",u0,o),na_qb_at("f0",u1,o),na_qb_at("f3",u1,o),na_qb_at("f3",u0,o)];
    ctx.fillStyle=rgba(i%2?mc:ag_lt(mc,0.07),1);ctx.beginPath();ctx.moveTo(P[0][0]+1,P[0][1]-0.6);ctx.lineTo(P[1][0]+1.6,P[1][1]-0.6);ctx.lineTo(P[2][0]-0.4,P[2][1]+0.6);ctx.lineTo(P[3][0]-1,P[3][1]+0.6);ctx.closePath();ctx.fill();}
  ctx.restore();}
// the cords' loose ends, hanging under the near side of the floor
function na_qb_fringe(ctx,ties,o){const cv=na_qb_cover(ties);if(!cv.length)return;const N=132,col=na_qb_straw(o.age);ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(ag_dk(col,0.2),0.9);ctx.lineWidth=1;ctx.beginPath();
  for(let i=1;i<N;i++){const u=i/N;if(!na_qb_in(cv,u)||na_qb_hash(i,23)<0.25)continue;const a=na_qb_at("f0",u,o),l=3+na_qb_hash(i,29)*8;ctx.moveTo(a[0],a[1]+2);ctx.lineTo(a[0]+(na_qb_hash(i,31)-0.5)*3,a[1]+2+l);}ctx.stroke();ctx.restore();}
function na_qb_bridge(ctx,o){o=o||{};const part=o.part||"all",a=o.a==null?1:o.a;if(a<=0.004)return;const fP=k=>o.f==null?1:typeof o.f==="number"?o.f:o.f[k],rP=k=>o.r==null?1:typeof o.r==="number"?o.r:o.r[k],
    ties=o.ties==null?[1,1]:o.ties,C=(id,p)=>na_qb_cable(ctx,id,Object.assign({},o,{p,end:null,a:1,w:null}));
  ctx.save();ctx.globalAlpha*=a;
  if(part!=="front"){C("r1",rP(1));na_qb_ties(ctx,"r1","f3",ties,o);C("f3",fP(3));C("f2",fP(2));C("f1",fP(1));na_qb_floor(ctx,o);}
  if(part==="all"&&o.mid)o.mid(ctx);
  if(part!=="back"){C("f0",fP(0));na_qb_fringe(ctx,ties,o);na_qb_ties(ctx,"r0","f0",ties,o);C("r0",rP(0));}
  ctx.restore();}

/* ---------------------------------------------------------------- the small people of the wide view */
const NA_QB_FOLK=[
  {k:"man",hat:"felt",hatC:[226,212,184],band:[112,84,66],top:[228,218,196],legs:[62,58,62],skin:[172,120,88]},
  {k:"woman",hat:"felt",hatC:[212,196,166],band:[96,62,54],top:[156,64,56],skirt:[96,74,84],legs:[70,58,54],skin:[178,126,94]},
  {k:"man",hat:"cap",hatC:[150,66,56],top:[128,100,78],legs:[70,66,70],skin:[160,110,80]},
  {k:"woman",hat:"felt",hatC:[136,104,80],band:[226,214,190],top:[72,68,74],skirt:[142,60,54],legs:[70,58,54],skin:[168,116,86]},
  {k:"man",hat:"felt",hatC:[146,116,90],band:[70,56,50],top:[196,184,164],legs:[86,74,64],skin:[182,130,96]},
  {k:"woman",hat:"felt",hatC:[228,216,190],band:[146,62,56],top:[226,214,190],skirt:[104,70,76],legs:[70,58,54],skin:[174,122,90]},
  {k:"man",hat:"cap",hatC:[112,70,62],top:[226,216,196],legs:[58,56,62],skin:[166,114,84]},
  {k:"woman",hat:"felt",hatC:[196,176,146],band:[70,58,54],top:[128,82,72],skirt:[112,88,76],legs:[70,58,54],skin:[184,132,98]}];
// a limb: from a to b, w0 wide at a and w1 at b, its ends round
function na_qb_limb(c,a,b,w0,w1,col){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,an=Math.atan2(dy,dx);
  c.fillStyle=col;c.beginPath();c.moveTo(a[0]+nx*w0/2,a[1]+ny*w0/2);c.lineTo(b[0]+nx*w1/2,b[1]+ny*w1/2);c.arc(b[0],b[1],w1/2,an+Math.PI/2,an-Math.PI/2,true);
  c.lineTo(a[0]-nx*w0/2,a[1]-ny*w0/2);c.arc(a[0],a[1],w0/2,an-Math.PI/2,an-Math.PI*1.5,true);c.closePath();c.fill();}
// the poses, as angles in degrees from straight down, towards the way they face: lean (the body), near and far leg [thigh, shin],
// near and far arm [upper, fore]; hip where the hips are above the feet (or the seat)
function na_qb_pose(name,t,woman){const s=Math.sin(t*5.4),c=Math.cos(t*5.4);
  if(name==="walk"||name==="carry")return{lean:4,hip:48-1.2*Math.abs(c),near:[24*s,24*s-13*Math.max(0,c)-6],far:[-24*s,-24*s-13*Math.max(0,-c)-6],
    armN:name==="carry"?[24,158]:[-18*s,-18*s+12],armF:[18*s,18*s+12]};
  if(name==="haul")return{lean:-17,hip:44,near:[34,20],far:[-6,-34],armN:[58,84],armF:[50,80]};
  if(name==="sit")return woman?{lean:5,hip:8,seat:true,near:null,far:null,armN:[30,84],armF:[24,80]}:{lean:8,hip:5,near:[112,50],far:[104,44],armN:[36,88],armF:[28,84]};
  if(name==="astride")return{lean:14,hip:1,near:[12,-4],far:null,armN:[44,74],armF:[36,70]};
  if(name==="bend")return{lean:52,hip:40,near:[30,-22],far:[14,-34],armN:[20,26],armF:[8,18]};
  return{lean:0,hip:49.5,near:[3,2],far:[-4,-2],armN:[3,8],armF:[-3,5]};}
function na_qb_fig(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;
  const F=typeof o.who==="object"&&o.who?o.who:NA_QB_FOLK[((((o.who||0)%NA_QB_FOLK.length)+NA_QB_FOLK.length)%NA_QB_FOLK.length)],woman=F.k==="woman",u=h/100,fl=o.flip?-1:1,
    P=na_qb_pose(o.pose||"stand",o.t||0,woman),rad=d=>d*Math.PI/180,dir=d=>[Math.sin(rad(d)),Math.cos(rad(d))],up=[Math.sin(rad(P.lean)),-Math.cos(rad(P.lean))],
    hip=[0,-P.hip],sh=[hip[0]+up[0]*29,hip[1]+up[1]*29],hd=[sh[0]+up[0]*9.6+1.2,sh[1]+up[1]*9.6],sun=fl,
    leg=A=>{if(!A)return null;const k=[hip[0]+dir(A[0])[0]*24,hip[1]+dir(A[0])[1]*24];return[k,[k[0]+dir(A[1])[0]*24,k[1]+dir(A[1])[1]*24]];},
    arm=A=>{const e=[sh[0]+dir(A[0])[0]*15,sh[1]+2+dir(A[0])[1]*15];return[e,[e[0]+dir(A[1])[0]*14,e[1]+dir(A[1])[1]*14]];},
    LN=leg(P.near),LF=leg(P.far),AN=arm(P.armN),AF=arm(P.armF),topC=F.top,topD=ag_dk(topC,0.22),lg=F.legs,lgD=ag_dk(lg,0.25),skin=F.skin;
  ctx.save();ctx.globalAlpha*=a;
  if(o.shadow!==0)ag_floorShadow(ctx,x-h*0.16,y+(P.seat||o.pose==="sit"?0:1),h*(o.pose==="sit"?0.34:0.26),h*0.05,o.shadow==null?0.3:o.shadow);
  ctx.translate(x,y);ctx.scale(fl*u,u);
  const shoe=q=>{ctx.fillStyle=rgba([52,44,40],1);ctx.beginPath();ctx.ellipse(q[0]+2,q[1]+1.2,4.4,2.1,0,0,TAU);ctx.fill();};
  // the far arm and the far leg
  na_qb_limb(ctx,[sh[0],sh[1]+2],AF[0],5.4,4.6,rgba(topD,1));na_qb_limb(ctx,AF[0],AF[1],4.6,3.8,rgba(topD,1));ctx.fillStyle=rgba(ag_dk(skin,0.12),1);ctx.beginPath();ctx.arc(AF[1][0]+dir(P.armF[1])[0]*1.6,AF[1][1]+dir(P.armF[1])[1]*1.6,2.3,0,TAU);ctx.fill();
  if(LF){na_qb_limb(ctx,hip,LF[0],7.6,6,rgba(lgD,1));na_qb_limb(ctx,LF[0],LF[1],6,4.4,rgba(lgD,1));shoe(LF[1]);}
  if(LN){na_qb_limb(ctx,hip,LN[0],8,6.2,rgba(lg,1));na_qb_limb(ctx,LN[0],LN[1],6.2,4.6,rgba(lg,1));shoe(LN[1]);}
  // a woman's full skirt, to below the knee; sitting, it spreads on the ground round her
  if(woman){const sk=F.skirt,skL=ag_lt(sk,0.16);
    if(P.seat){ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.moveTo(-17,0);ctx.bezierCurveTo(-17,-15,-6,-19,4,-18);ctx.bezierCurveTo(16,-17,29,-10,31,0);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(skL,0.6);ctx.beginPath();ctx.moveTo(6,-17);ctx.bezierCurveTo(16,-16,27,-9,29,0);ctx.lineTo(14,0);ctx.bezierCurveTo(13,-7,10,-13,6,-17);ctx.fill();}
    else if(LN){const sw=o.pose==="walk"||o.pose==="carry"?3*Math.sin((o.t||0)*5.4):0,hy=-19,wx=[hip[0]-7,hip[0]+7],lean=up[0]*-8;
      ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.moveTo(wx[0],hip[1]-4);ctx.bezierCurveTo(wx[0]-5,hip[1]+10,-15+lean+sw,hy-10,-16+lean+sw,hy);ctx.quadraticCurveTo(lean+sw,hy+3.4,16+lean+sw,hy);
      ctx.bezierCurveTo(15+lean+sw,hy-10,wx[1]+5,hip[1]+10,wx[1],hip[1]-4);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(skL,0.55);ctx.beginPath();ctx.moveTo(wx[1]-2,hip[1]-3);ctx.bezierCurveTo(wx[1]+4,hip[1]+10,14+lean+sw,hy-10,15+lean+sw,hy);ctx.lineTo(6+lean+sw,hy+1.6);ctx.bezierCurveTo(6+lean,hy-12,wx[1]-1,hip[1]+8,wx[1]-2,hip[1]-3);ctx.fill();}}
  // the body, lighter on the side towards the sun
  na_qb_limb(ctx,[hip[0],hip[1]+1],sh,13,15,rgba(topC,1));na_qb_limb(ctx,[hip[0]+2.4*sun*fl,hip[1]],[sh[0]+2.6*sun*fl,sh[1]+1],6,7,rgba(ag_lt(topC,0.22),0.7));
  // the neck and the head
  na_qb_limb(ctx,sh,[hd[0]-0.6,hd[1]+2],4.6,4.2,rgba(ag_dk(skin,0.1),1));
  ctx.fillStyle=rgba([34,26,24],1);ctx.beginPath();ctx.ellipse(hd[0]-1.3,hd[1]-0.4,5.9,6.7,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(hd[0]+1.5,hd[1]+0.7,4.7,5.9,0,0,TAU);ctx.fill();
  // a woman's braids, down her back
  if(woman){const b0=[hd[0]-5.4,hd[1]+3],b1=[sh[0]-8.4-up[0]*9,sh[1]+17];for(const dx of [0,1.9]){ctx.strokeStyle=rgba([30,24,22],1);ctx.lineWidth=1.7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(b0[0]+dx,b0[1]);ctx.quadraticCurveTo(sh[0]-9.4+dx,sh[1]+3,b1[0]+dx,b1[1]+dx*0.6);ctx.stroke();}}
  // the hat: felt with a brim and a plain band, or a knitted cap with ear flaps and a point
  if(F.hat==="cap"){const hc=F.hatC;ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.moveTo(hd[0]-6.6,hd[1]-0.6);ctx.bezierCurveTo(hd[0]-7,hd[1]-8.6,hd[0]-2,hd[1]-10.4,hd[0]+0.4,hd[1]-13);ctx.bezierCurveTo(hd[0]+3,hd[1]-10,hd[0]+6.8,hd[1]-8,hd[0]+6.6,hd[1]-2.2);
    ctx.quadraticCurveTo(hd[0]+1,hd[1]-3.4,hd[0]-2.2,hd[1]-1.4);ctx.lineTo(hd[0]-3,hd[1]+6.4);ctx.quadraticCurveTo(hd[0]-6.4,hd[1]+4.4,hd[0]-6.6,hd[1]-0.6);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(ag_lt(hc,0.22),0.6);ctx.beginPath();ctx.ellipse(hd[0]+2.4*sun*fl,hd[1]-6.4,2.6,3.4,0,0,TAU);ctx.fill();}
  else{const hc=F.hatC,by=hd[1]-4.6;ctx.fillStyle=rgba(ag_dk(hc,0.16),1);ctx.beginPath();ctx.ellipse(hd[0]+0.5,by,10.2,2.4,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.moveTo(hd[0]-5.6,by-0.4);ctx.bezierCurveTo(hd[0]-5.8,by-7.6,hd[0]-3,by-8.6,hd[0]+0.4,by-8.6);ctx.bezierCurveTo(hd[0]+4,by-8.6,hd[0]+6.6,by-7.4,hd[0]+6.4,by-0.4);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(ag_lt(hc,0.25),0.7);ctx.beginPath();ctx.ellipse(hd[0]+0.5+2.6*sun*fl,by-0.5,5,1.2,0,0,TAU);ctx.fill();
    if(F.band){ctx.strokeStyle=rgba(F.band,1);ctx.lineWidth=1.5;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(hd[0]-5.6,by-1.5);ctx.lineTo(hd[0]+6.4,by-1.5);ctx.stroke();}}
  // the near arm, over the body
  na_qb_limb(ctx,[sh[0],sh[1]+2],AN[0],5.8,4.8,rgba(ag_dk(topC,0.08),1));na_qb_limb(ctx,AN[0],AN[1],4.8,4,rgba(ag_dk(topC,0.08),1));
  const hN=[AN[1][0]+dir(P.armN[1])[0]*1.8,AN[1][1]+dir(P.armN[1])[1]*1.8],hF=[AF[1][0]+dir(P.armF[1])[0]*1.6,AF[1][1]+dir(P.armF[1])[1]*1.6];
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.arc(hN[0],hN[1],2.4,0,TAU);ctx.fill();
  ctx.restore();
  const out=q=>[x+fl*u*q[0],y+u*q[1]];return{hand:out(hN),hand2:out(hF),head:out(hd),sh:out(sh),top:y+u*(hd[1]-14)};}
