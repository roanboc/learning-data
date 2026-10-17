/* ===== The data governance series: the toy town =====
   The university is a model town on a table, drawn in 3D with Canvas 2D: a camera, painted boxes lit by one sun, rooms open at
   the front like dollhouses, people as painted figures on small bases, and a tilt-shift blur that makes it look small and close.
   Words wait in a queue and are drawn after the blur, so they stay sharp. The town's coordinates: x east, y up, z north, in
   metres of the model's own world (a person is about 1.7 tall). Buildings stand at an angle: mxSet turns their own coordinates
   (x across the front, z from the front to the back) into the town's. */

// ---- vectors ----
const v3=(x,y,z)=>({x,y,z}),vadd=(a,b)=>v3(a.x+b.x,a.y+b.y,a.z+b.z),vsub=(a,b)=>v3(a.x-b.x,a.y-b.y,a.z-b.z),vmul=(a,k)=>v3(a.x*k,a.y*k,a.z*k);
const vdot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z,vcross=(a,b)=>v3(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x),vlen=a=>Math.hypot(a.x,a.y,a.z),vnorm=a=>{const l=vlen(a)||1;return v3(a.x/l,a.y/l,a.z/l);};
const DEG=Math.PI/180;

// ---- a building's own coordinates: front centre at (x,z), turned so its depth runs towards the angle deg (0 north, 90 east) ----
let MX=null;
function mxSet(x,z,deg){const a=deg*DEG;MX={x,z,c:Math.cos(a),s:Math.sin(a),deg};}
function mxOff(){MX=null;}
const mxP=p=>MX?v3(MX.x+p.x*MX.c+p.z*MX.s,p.y,MX.z-p.x*MX.s+p.z*MX.c):p;
const mxN=n=>MX?v3(n.x*MX.c+n.z*MX.s,n.y,-n.x*MX.s+n.z*MX.c):n;
// and back: where a point of the town is, in the building's coordinates (where the camera stands, seen from a room)
const mxL=p=>{if(!MX)return p;const dx=p.x-MX.x,dz=p.z-MX.z;return v3(dx*MX.c-dz*MX.s,p.y,dx*MX.s+dz*MX.c);};

// ---- the camera: an eye, a target and a focal length in pixels ----
function cam3(eye,tgt,f,o){o=o||{};const fwd=vnorm(vsub(tgt,eye));let right=vcross(v3(0,1,0),fwd);if(vlen(right)<1e-4)right=v3(1,0,0);right=vnorm(right);
  if(o.roll){const c=Math.cos(o.roll),s=Math.sin(o.roll),up0=vcross(fwd,right);right=vnorm(vadd(vmul(right,c),vmul(up0,s)));}
  const up=vcross(fwd,right);return{eye,tgt,fwd,right,up,f,cx:o.cx==null?W/2:o.cx,cy:o.cy==null?H/2:o.cy,dist:vlen(vsub(tgt,eye))};}
// a point in the camera's space (x right, y up, z ahead)
function csp(C,p){let x=p.x,z=p.z;if(MX){x=MX.x+p.x*MX.c+p.z*MX.s;z=MX.z-p.x*MX.s+p.z*MX.c;}const dx=x-C.eye.x,dy=p.y-C.eye.y,dz=z-C.eye.z,F=C.fwd,R=C.right,U=C.up;
  return{x:dx*R.x+dy*R.y+dz*R.z,y:dx*U.x+dy*U.y+dz*U.z,z:dx*F.x+dy*F.y+dz*F.z};}
// a point on the screen, its depth, and how many pixels a metre is there
function pj(C,p){const q=csp(C,p),zz=Math.max(0.05,q.z);return{x:C.cx+C.f*q.x/zz,y:C.cy-C.f*q.y/zz,z:q.z,s:C.f/zz};}
const pjc=(C,q)=>{const zz=Math.max(0.05,q.z);return{x:C.cx+C.f*q.x/zz,y:C.cy-C.f*q.y/zz,z:q.z,s:C.f/zz};};
// camera moves: keys [t, eye, target, focal length], the eye and the target in cylindrical coordinates round a centre
// ([distance, angle in degrees with 0 north and 90 east, height]), so the camera swings round the town rather than cutting across it.
// Each move eases in and out like a sine; a key may hold a blur band too (ts: [top, bottom, amount]).
const cyl=(x,y,z,cx,cz)=>[Math.hypot(x-(cx||0),z-(cz||0)),Math.atan2(x-(cx||0),z-(cz||0))/DEG,y];
const fromCyl=(c,cx,cz)=>v3((cx||0)+c[0]*Math.sin(c[1]*DEG),c[2],(cz||0)+c[0]*Math.cos(c[1]*DEG));
function camK(keys,t,o){o=o||{};let a=keys[0],b=keys[0],u=0;
  if(t>=keys[keys.length-1][0])a=b=keys[keys.length-1];else for(let i=1;i<keys.length;i++)if(t<keys[i][0]){a=keys[i-1];b=keys[i];u=t<=a[0]?0:easeCam((t-a[0])/(b[0]-a[0]));break;}
  const L=(p,q)=>p.map((v,i)=>lerp(v,q[i],u)),e=fromCyl(L(a[1],b[1]),o.cx,o.cz),g=fromCyl(L(a[2],b[2]),o.cx,o.cz);
  // a slow, small drift, like a hand holding the camera still
  if(o.drift!==0){const d=o.drift||0.012;e.x+=Math.sin(t*0.37)*d;e.y+=Math.sin(t*0.29+1)*d*0.7;}
  const C=cam3(e,g,lerp(a[3],b[3],u),o);const ta=a[4]||o.ts,tb=b[4]||o.ts;if(ta&&tb)C.ts=L(ta,tb);return C;}

// ---- light: one sun from the upper left; inside a room, the light comes through the open front ----
const SUN=vnorm(v3(-0.55,0.8,-0.35));
function shadeCol(col,n){n=mxN(n);const d=Math.max(0,vdot(n,SUN)),sky=Math.max(0,n.y)*0.12,i=0.66+0.4*d+sky;return[clamp(col[0]*i,0,255),clamp(col[1]*i,0,255),clamp(col[2]*i,0,255)];}
const ILIT={F:1.0,U:0.98,L:0.9,R:0.86,D:0.84,B:0.72};
const ilit=(col,k)=>[clamp(col[0]*k,0,255),clamp(col[1]*k,0,255),clamp(col[2]*k,0,255)];
// the air: far things fade towards it; how far depends on how far the camera looks
const GV={hzA:0.8};let HAZE=[222,236,248];
function hz(col,z){const d0=GV.hz0||16,d1=GV.hz1||80,k=clamp((z-d0)/d1,0,0.7)*GV.hzA;return k>0?mix(col,HAZE,k):col;}
function hazeFor(C,k){GV.hz0=C.dist*(k||1.6);GV.hz1=Math.max(30,C.dist*5);}

// ---- painter's order: things are collected with their distance, then drawn far to near ----
let DL=[];
function dlAdd(z,fn){DL.push({z,fn});}
function dlDraw(ctx){const L=DL;DL=[];L.sort((a,b)=>b.z-a.z);for(const d of L)d.fn(ctx);}
// a point's distance from the eye, for sorting
const eyeD=(C,p)=>{const q=mxP(p);return Math.hypot(q.x-C.eye.x,q.y-C.eye.y,q.z-C.eye.z);};

// ---- polygons: projected, cut at the camera's near plane, shaded by their normal and hazed by distance ----
const NEAR=0.12;
function clipNear(Q){const out=[];for(let i=0;i<Q.length;i++){const a=Q[i],b=Q[(i+1)%Q.length],ia=a.z>=NEAR,ib=b.z>=NEAR;if(ia)out.push(a);
  if(ia!==ib){const u=(NEAR-a.z)/(b.z-a.z);out.push({x:lerp(a.x,b.x,u),y:lerp(a.y,b.y,u),z:NEAR});}}return out;}
function poly3(ctx,C,pts,col,o){o=o||{};let Q=pts.map(p=>csp(C,p));let mn=1e9,mx=-1e9;for(const q of Q){mn=Math.min(mn,q.z);mx=Math.max(mx,q.z);}if(mx<NEAR)return null;if(mn<NEAR){Q=clipNear(Q);if(Q.length<3)return null;}
  const P_=Q.map(q=>pjc(C,q));ctx.beginPath();ctx.moveTo(P_[0].x,P_[0].y);for(let i=1;i<P_.length;i++)ctx.lineTo(P_[i].x,P_[i].y);ctx.closePath();
  let c=o.n?shadeCol(col,o.n):col;let zc=0;for(const q of P_)zc+=q.z;c=hz(c,zc/P_.length);
  if(o.grad){let y0=1e9,y1=-1e9;for(const q of P_){y0=Math.min(y0,q.y);y1=Math.max(y1,q.y);}if(y1-y0>0.5){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(mix(c,[255,255,255],o.grad[0]),o.a==null?1:o.a));g.addColorStop(1,rgba(mix(c,[0,0,0],o.grad[1]),o.a==null?1:o.a));ctx.fillStyle=g;}else ctx.fillStyle=rgba(c,o.a==null?1:o.a);}
  else ctx.fillStyle=rgba(c,o.a==null?1:o.a);
  ctx.fill();if(o.edge){ctx.lineJoin="round";ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),o.edge);ctx.lineWidth=o.lw||1.4;ctx.stroke();}return P_;}
const NRM={F:v3(0,0,-1),B:v3(0,0,1),L:v3(-1,0,0),R:v3(1,0,0),U:v3(0,1,0),D:v3(0,-1,0)};
// does a face with normal n at p face the camera?
const visible=(C,n,p)=>{const q=mxP(p),m=mxN(n);return m.x*(C.eye.x-q.x)+m.y*(C.eye.y-q.y)+m.z*(C.eye.z-q.z)>0;};
// a box: x,z the front-left corner, w along x, d along z (away from the front), h up from y0. Only the faces towards the camera.
function boxFaces(C,x,y0,z,w,h,d,col,o){o=o||{};const a=v3(x,y0,z),b=v3(x+w,y0,z),c=v3(x+w,y0,z+d),e=v3(x,y0,z+d),A=v3(x,y0+h,z),B=v3(x+w,y0+h,z),Cc=v3(x+w,y0+h,z+d),E=v3(x,y0+h,z+d);
  const F=[];const add=(pts,n,cl,k)=>{const cen=v3((pts[0].x+pts[2].x)/2,(pts[0].y+pts[2].y)/2,(pts[0].z+pts[2].z)/2);if(visible(C,n,cen))F.push({pts,n,col:cl||col,k});};
  if(!o.noFront)add([a,b,B,A],NRM.F,o.front,"F");add([b,c,Cc,B],NRM.R,o.side,"R");add([e,a,A,E],NRM.L,o.side,"L");if(!o.noTop)add([A,B,Cc,E],NRM.U,o.top,"U");if(!o.noBack)add([c,e,E,Cc],NRM.B,o.back,"B");if(o.bottom)add([a,e,c,b],NRM.D,o.bottom,"D");return F;}
function drawBox(ctx,C,x,y0,z,w,h,d,col,o){o=o||{};const F=boxFaces(C,x,y0,z,w,h,d,col,o);for(const f of F)poly3(ctx,C,f.pts,f.col,{n:f.n,grad:o.grad||[0.06,0.06],edge:o.edge==null?0.5:o.edge,lw:o.lw});return F;}
// furniture in a room: pastel faces lit through the open front, a fine light edge like painted wood
function ibox(ctx,C,x,y0,z,w,h,d,col,o){o=o||{};const F=boxFaces(C,x,y0,z,w,h,d,col,o);for(const f of F)poly3(ctx,C,f.pts,ilit(f.col,ILIT[f.k]||0.9),{grad:o.grad||[0.05,0.07],edge:o.edge==null?0.45:o.edge,lw:o.lw||1.3});return F;}
// quads on a plane of constant z (a back wall), constant x (a side wall) or constant y (a floor)
function wq3(ctx,C,x0,y0,x1,y1,z,col,o){return poly3(ctx,C,[v3(x0,y0,z),v3(x1,y0,z),v3(x1,y1,z),v3(x0,y1,z)],col,o||{});}
function sq3(ctx,C,x,z0,y0,z1,y1,col,o){return poly3(ctx,C,[v3(x,y0,z0),v3(x,y0,z1),v3(x,y1,z1),v3(x,y1,z0)],col,o||{});}
function fq3(ctx,C,x0,z0,x1,z1,y,col,o){return poly3(ctx,C,[v3(x0,y,z0),v3(x1,y,z0),v3(x1,y,z1),v3(x0,y,z1)],col,o||{});}
// a gabled roof over a box: the ridge along x, an overhang, a height
function gable(ctx,C,x,y0,z,w,d,rh,col,o){o=o||{};const ov=o.ov==null?0.35:o.ov,X0=x-ov,X1=x+w+ov,Z0=z-ov,Z1=z+d+ov,zm=z+d/2,yt=y0+rh;
  const fr=[v3(X0,y0,Z0),v3(X1,y0,Z0),v3(X1,yt,zm),v3(X0,yt,zm)],bk=[v3(X1,y0,Z1),v3(X0,y0,Z1),v3(X0,yt,zm),v3(X1,yt,zm)];
  const nF=vnorm(v3(0,d/2,-rh)),nB=vnorm(v3(0,d/2,rh)),gl=[v3(x,y0,z),v3(x,y0,z+d),v3(x,yt-0.02,zm)],gr=[v3(x+w,y0,z+d),v3(x+w,y0,z),v3(x+w,yt-0.02,zm)];
  for(const [pts,n,cl] of [[bk,nB,col],[gl,NRM.L,o.wall||col],[gr,NRM.R,o.wall||col],[fr,nF,col]]){const cen=vmul(pts.reduce((s,p)=>vadd(s,p),v3(0,0,0)),1/pts.length);if(visible(C,n,cen))poly3(ctx,C,pts,cl,{n,grad:[0.1,0.08],edge:0.6});}
  // the tiles: soft lines along the slope that faces us
  if(o.tiles!==false){const n=visible(C,nF,v3(x+w/2,y0+rh/2,z))?nF:visible(C,nB,v3(x+w/2,y0+rh/2,z+d))?nB:null;if(n){const front=n===nF,zA=front?Z0:Z1;ctx.save();ctx.strokeStyle=rgba(mix(col,[0,0,0],0.3),0.28);ctx.lineWidth=1.2;
    for(let i=1;i<6;i++){const u=i/6,a=pj(C,v3(X0,lerp(y0,yt,u),lerp(zA,zm,u))),b=pj(C,v3(X1,lerp(y0,yt,u),lerp(zA,zm,u)));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();}}}

// ---- shadows on the ground ----
function contactShadow(ctx,C,x,z,w,d,a,y){const P_=pj(C,v3(x+w/2,y||0,z+d/2));if(P_.z<NEAR)return;const r=Math.max(w,d)*P_.s*0.62;ctx.save();ctx.translate(P_.x,P_.y);ctx.scale(1,clamp(Math.abs(C.fwd.y)*0.9+0.12,0.2,1));
  const g=ctx.createRadialGradient(0,0,r*0.3,0,0,r);g.addColorStop(0,"rgba(40,50,70,"+(a||0.28)+")");g.addColorStop(1,"rgba(40,50,70,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}
function convexHull(P_){const p=P_.slice().sort((a,b)=>a.x-b.x||a.y-b.y),cr=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x),lo=[],up=[];for(const q of p){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q);}for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q);}up.pop();lo.pop();return lo.concat(up);}
// a box's shadow on the ground, along the sun: a soft polygon
function castShadow(ctx,C,x,z,w,d,h,a){const sd=mxN(v3(-SUN.x,0,-SUN.z)),k=h/SUN.y;const base=[[x,z],[x+w,z],[x+w,z+d],[x,z+d]].map(([px,pz])=>mxP(v3(px,0,pz)));
  const all=base.concat(base.map(p=>v3(p.x+(-SUN.x)*k,0,p.z+(-SUN.z)*k)));const M=MX;MX=null;const pr=all.map(p=>csp(C,v3(p.x,0.005,p.z)));if(pr.some(q=>q.z<NEAR)){MX=M;return;}
  // darkest at the foot of the building, fading towards the far end, so the edge is soft
  const hull=convexHull(pr.map(q=>pjc(C,q))),P0=pjc(C,pr.slice(0,4).reduce((s,q)=>({x:s.x+q.x/4,y:s.y+q.y/4,z:s.z+q.z/4}),{x:0,y:0,z:0})),P1=pjc(C,pr.slice(4).reduce((s,q)=>({x:s.x+q.x/4,y:s.y+q.y/4,z:s.z+q.z/4}),{x:0,y:0,z:0}));MX=M;
  const A=a||0.16,g=ctx.createLinearGradient(P0.x,P0.y,P1.x,P1.y);g.addColorStop(0,"rgba(46,56,84,"+A+")");g.addColorStop(0.55,"rgba(46,56,84,"+A*0.7+")");g.addColorStop(1,"rgba(46,56,84,"+A*0.12+")");
  ctx.save();ctx.fillStyle=g;ctx.beginPath();hull.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.fill();ctx.restore();}
// a soft dark band where a wall meets a floor or another wall
function aoStrip(ctx,C,a,b,dir,len,k){const Q=[a,b,vadd(b,vmul(dir,len)),vadd(a,vmul(dir,len))].map(p=>pj(C,p));if(Q.some(q=>q.z<NEAR))return;
  const g=ctx.createLinearGradient((Q[0].x+Q[1].x)/2,(Q[0].y+Q[1].y)/2,(Q[2].x+Q[3].x)/2,(Q[2].y+Q[3].y)/2);g.addColorStop(0,"rgba(50,40,40,"+(k||0.22)+")");g.addColorStop(1,"rgba(50,40,40,0)");
  ctx.fillStyle=g;ctx.beginPath();Q.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.fill();}

// ---- words: a queue drawn after the blur, and words painted on a surface ----
let LBQ=[];
function lbAdd(fn){LBQ.push(fn);}
function lbDraw(ctx,S){const L=LBQ;LBQ=[];for(const f of L){ctx.save();setScreen(ctx,S);f(ctx);ctx.restore();}}
// the screen transform of a small patch of surface at o, with ux to the right and uy up (in metres); 1 unit is a centimetre
// (a surface whose corner is far outside the frame is left out: the flat mapping is only right near its corner, and would
// smear the far side of a big surface, seen at a slant from close by, across the picture)
function surfM(C,o,ux,uy){const A=pj(C,o),B=pj(C,vadd(o,vmul(ux,0.01))),D=pj(C,vsub(o,vmul(uy,0.01)));if(A.z<NEAR||B.z<NEAR||D.z<NEAR)return null;
  if(A.x<-0.75*W||A.x>1.75*W||A.y<-0.75*H||A.y>1.75*H)return null;
  const n=vcross(uy,ux);if(!visible(C,n,o))return null;return[B.x-A.x,B.y-A.y,D.x-A.x,D.y-A.y,A.x,A.y];}
// text painted on a surface: size in centimetres. o.lb queues it after the blur (for words that must stay sharp)
function surfT(ctx,C,o3,ux,uy,s,o){o=o||{};const M=surfM(C,o3,ux,uy);if(!M)return;const draw=c=>{const m=c.getTransform();c.save();c.transform(M[0],M[1],M[2],M[3],M[4],M[5]);
    if(o.a!=null)c.globalAlpha*=o.a;T(c,s,0,0,{w:o.w||700,size:o.size||12,align:o.align||"center",color:o.color||rgba(PAL.ink,1),f:o.f,deco:o.deco});c.restore();};
  if(o.lb)lbAdd(draw);else draw(ctx);}
// a frame of drawing on a surface: fn draws in centimetres, with (0,0) at o3, x right, y down
function surfDraw(ctx,C,o3,ux,uy,fn,o){o=o||{};const M=surfM(C,o3,ux,uy);if(!M)return false;const draw=c=>{c.save();c.transform(M[0],M[1],M[2],M[3],M[4],M[5]);fn(c);c.restore();};if(o.lb)lbAdd(draw);else draw(ctx);return true;}
// the same at a point x centimetres along ux and y down uy from o3, with the slant the surface has there: a big surface seen
// close and at an angle changes scale across it, so each word on it is placed with its own transform
function surfAt(ctx,C,o3,ux,uy,x,y,fn,o){return surfDraw(ctx,C,vadd(o3,vadd(vmul(ux,x/100),vmul(uy,-y/100))),ux,uy,fn,o);}
// a painted sign, on a post or a wall: words big enough to read on a phone
function signBoard(ctx,x,y,text,o){o=o||{};const sz=o.size||30,a=o.a==null?1:o.a;if(a<=0.01)return null;ctx.save();ctx.globalAlpha*=a;ctx.font=font(o.w||800,sz);
  const lines=Array.isArray(text)?text:[text],tw_=Math.max(...lines.map(l=>ctx.measureText(l).width)),lh=sz*1.22,pw=tw_+sz*1.3+(o.dot?sz*0.55:0),ph=sz*0.75+lh*lines.length,X=o.align==="left"?x:o.align==="right"?x-pw:x-pw/2,Y=y-ph;
  const bg=o.bg||[255,251,240],ink=o.ink||PAL.ink,rim=o.rim||[214,170,90];
  if(o.post){ctx.fillStyle=rgba(mix(rim,[0,0,0],0.3),1);ctx.fillRect(x-3,Y+ph-2,6,o.post);}
  ctx.save();ctx.shadowColor="rgba(40,50,80,0.28)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;rr(ctx,X,Y,pw,ph,Math.min(16,ph*0.22));ctx.fillStyle=rgba(rim,1);ctx.fill();ctx.restore();
  rr(ctx,X,Y-3,pw,ph,Math.min(16,ph*0.22));const g=ctx.createLinearGradient(0,Y,0,Y+ph);g.addColorStop(0,rgba(mix(bg,[255,255,255],0.4),1));g.addColorStop(1,rgba(bg,1));ctx.fillStyle=g;ctx.fill();
  if(o.dot){ctx.fillStyle=rgba(o.dot,1);ctx.beginPath();ctx.arc(X+sz*0.62,Y-3+ph/2,sz*0.2,0,TAU);ctx.fill();}
  lines.forEach((l,i)=>T(ctx,l,X+pw/2+(o.dot?sz*0.27:0),Y-3+sz*0.38+lh*(i+0.78),{w:o.w||800,size:sz,align:"center",color:rgba(ink,1),deco:o.deco}));ctx.restore();return{X,Y,w:pw,h:ph};}
// the scene's place and time, top left (deco: while it turns over, its words aren't there to be read)
function marker(ctx,text,a,deco){signBoard(ctx,64,116,text,{size:30,align:"left",dot:PAL.band,w:700,a:a==null?1:a,deco});}
// a speech bubble with its tail towards (tx,ty)
function tSpeech(ctx,x,y,w,lines,tx,ty,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||32,lh=sz*1.3,h=lines.length*lh+sz*0.9,r=sz*0.8,k=o.k==null?1:o.k;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(tx,ty);ctx.scale(k,k);ctx.translate(-tx,-ty);
  ctx.save();ctx.shadowColor="rgba(40,50,80,0.25)";ctx.shadowBlur=18;ctx.shadowOffsetY=8;ctx.fillStyle=rgba(o.bg||[255,255,255],1);
  rr(ctx,x,y,w,h,r);ctx.fill();const bx=clamp(tx,x+r+10,x+w-r-10),by=ty<y?y:y+h;ctx.beginPath();ctx.moveTo(bx-18,by);ctx.lineTo(tx,ty);ctx.lineTo(bx+18,by);ctx.closePath();ctx.fill();ctx.restore();
  lines.forEach((l,i)=>T(ctx,l,x+sz*0.75,y+sz*0.5+lh*(i+0.74),{w:o.w||700,size:sz,color:rgba(o.ink||[40,46,66],1)}));ctx.restore();}
// how wide a bubble needs to be for its lines
const speechW=(ctx,lines,sz,w)=>Math.max(...lines.map(l=>tw(ctx,l,sz||32,w||700)))+(sz||32)*1.5;

// ---- the palette: bright pastels, like painted wood ----
const PAL={lawn:[126,198,112],path:[240,222,186],sky0:[120,188,246],sky1:[216,236,250],cream:[250,240,216],band:[238,186,74],roof:[228,120,98],
  paper:[253,241,206],stripe:[244,222,170],dado:[164,204,178],rail:[255,252,244],side:[250,216,186],ceil:[248,240,226],floor:[226,180,124],
  rug:[84,166,166],rugB:[246,232,200],walnut:[156,104,66],oak:[210,164,110],navy:[58,82,132],coral:[226,112,96],teal:[64,160,156],mustard:[232,178,64],
  lilac:[150,130,206],sage:[118,170,128],peach:[248,186,150],ink:[44,52,74],gold:[240,184,60],green:[96,178,112],grey:[160,166,178],red:[214,84,72],wood:[196,150,100],table:[186,138,96]};
// what the colours mean: gold is governance's decisions, and the business side; blue the technical side; walnut people of the past
const RIM={biz:[232,178,64],tech:[86,164,222],past:[176,140,104]};

// ---- the sky and the table ----
function tSky(ctx,o){o=o||{};const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(o.top||PAL.sky0,1));g.addColorStop(1,rgba(o.bottom||PAL.sky1,1));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const sg=ctx.createRadialGradient(260,60,10,260,60,760);sg.addColorStop(0,"rgba(255,248,220,0.6)");sg.addColorStop(1,"rgba(255,248,220,0)");ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);}
// the ground far away: a band from the horizon down, under everything else
function tHorizon(ctx,C,col){const hp=pj(C,vadd(C.eye,v3(C.fwd.x*4000,-C.eye.y,C.fwd.z*4000)));const hy=clamp(hp.y,-50,H+50);if(hy>=H)return;
  const g=ctx.createLinearGradient(0,hy,0,H);g.addColorStop(0,rgba(mix(col,HAZE,0.75),1));g.addColorStop(0.25,rgba(mix(col,HAZE,0.35),1));g.addColorStop(1,rgba(col,1));ctx.fillStyle=g;ctx.fillRect(0,hy,W,H-hy+2);}
// a flat disc or ring on the ground, as a polygon
function discPts(cx,cz,r,n,y,a0,a1){const pts=[],A0=a0==null?0:a0,A1=a1==null?360:a1;for(let i=0;i<=n;i++){const a=lerp(A0,A1,i/n)*DEG;pts.push(v3(cx+r*Math.sin(a),y||0,cz+r*Math.cos(a)));}if(A1-A0>=360)pts.pop();return pts;}
// grass flock, like a model's lawn mat: dots fixed to the ground, only where the camera sees them
function tFlock(ctx,C,cx,cz,R,o){o=o||{};const step=o.step||0.55,col=o.col||[40,80,40],lite=o.lite||[255,255,220];const g=C.tgt,rr_=Math.min(R,Math.max(8,C.dist*2.6));
  const x0=Math.floor((g.x-rr_)/step),x1=Math.ceil((g.x+rr_)/step),z0=Math.floor((g.z-rr_)/step),z1=Math.ceil((g.z+rr_)/step);ctx.save();
  for(let i=x0;i<=x1;i++)for(let j=z0;j<=z1;j++){const x=(i+hash(i*7+j,61))*step,z=(j+hash(i*3+j*11,62))*step;if((x-cx)**2+(z-cz)**2>R*R)continue;if(o.skip&&o.skip(x,z))continue;
    const p=pj(C,v3(x,0.003,z));if(p.z<NEAR||p.x<-4||p.x>W+4||p.y<-4||p.y>H+4)continue;const s=0.028*p.s;if(s<0.6)continue;const a=clamp((s-0.6)*0.6,0,1)*(o.a||0.2);
    ctx.globalAlpha=a;ctx.fillStyle=hash(i,j)>0.5?rgba(lite,1):rgba(col,1);ctx.fillRect(p.x,p.y,s*1.4,s*0.7);}ctx.restore();}

// ---- trees and shrubs: a trunk and soft clay canopies ----
function tTree(ctx,C,x,z,h,col,o){o=o||{};const B=pj(C,v3(x,o.y||0,z)),Tp=pj(C,v3(x,(o.y||0)+h*0.55,z)),r=h*0.34*B.s;if(B.z<NEAR+0.5||B.x<-r*2||B.x>W+r*2||Tp.y-r*2>H||B.y<-r*3)return;const c=hz(col,B.z),tc=hz([150,112,82],B.z);
  ctx.save();ctx.translate(B.x,B.y);ctx.scale(1,clamp(Math.abs(C.fwd.y)+0.2,0.3,1));const sg=ctx.createRadialGradient(r*0.3,0,1,r*0.3,0,r*1.2);sg.addColorStop(0,"rgba(40,56,70,0.3)");sg.addColorStop(1,"rgba(40,56,70,0)");ctx.fillStyle=sg;ctx.beginPath();ctx.arc(r*0.3,0,r*1.2,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(tc,1);ctx.lineCap="round";ctx.lineWidth=Math.max(2,h*0.07*B.s);ctx.beginPath();ctx.moveTo(B.x,B.y);ctx.lineTo(Tp.x,Tp.y);ctx.stroke();
  const cy=Tp.y-r*0.6,blob=(dx,dy,rr_,k)=>{const g=ctx.createRadialGradient(Tp.x+dx-rr_*0.35,cy+dy-rr_*0.4,rr_*0.1,Tp.x+dx,cy+dy,rr_);g.addColorStop(0,rgba(mix(c,[255,250,220],0.32*k),1));g.addColorStop(0.6,rgba(c,1));g.addColorStop(1,rgba(mix(c,[20,40,40],0.22),1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(Tp.x+dx,cy+dy,rr_,0,TAU);ctx.fill();};
  if(o.round)blob(0,0,r,1);else{blob(-r*0.38,r*0.12,r*0.72,0.8);blob(r*0.4,r*0.1,r*0.7,0.9);blob(0,-r*0.32,r*0.8,1);}
  ctx.fillStyle="rgba(255,255,255,0.3)";ctx.beginPath();ctx.ellipse(Tp.x-r*0.3,cy-r*0.55,r*0.18,r*0.1,-0.5,0,TAU);ctx.fill();}
function tShrub(ctx,C,x,z,r,col,o){o=o||{};const P_=pj(C,v3(x,(o.y||0)+r*0.6,z)),R=r*P_.s;if(P_.z<NEAR+0.3||P_.x<-R*2||P_.x>W+R*2)return;const c=hz(col,P_.z);
  for(let i=0;i<3;i++){const dx=(i-1)*R*0.7,g=ctx.createRadialGradient(P_.x+dx-R*0.3,P_.y-R*0.4,R*0.1,P_.x+dx,P_.y,R);g.addColorStop(0,rgba(mix(c,[255,250,220],0.3),1));g.addColorStop(1,rgba(mix(c,[20,40,40],0.2),1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(P_.x+dx,P_.y-(i===1?R*0.25:0),R*(i===1?1:0.8),0,TAU);ctx.fill();}}

// ---- rooms: the inner faces of a building open at the front, seen only from where the camera is ----
// R: {X0,X1,Z0,Z1,FY,HY} in the building's coordinates, the front at Z0. o.win: a window in the back wall [x0,y0,x1,y1].
// o.paper, o.stripe, o.dado, o.side, o.floor: the room's colours
function tRoom(ctx,C,R,o){o=o||{};const t=0.2,xl=R.X0+t,xr=R.X1-t,bz=R.Z1-t,FY=R.FY,HY=R.HY,Z0=R.Z0,DH=FY+(o.dh||0.92),E=mxL(C.eye);
  const paper=o.paper||PAL.paper,stripe=o.stripe||PAL.stripe,dado=o.dado||PAL.dado,side=o.side||PAL.side,floor=o.floor||PAL.floor;
  const quad=(pts)=>{const q=pts.map(p=>pj(C,p));ctx.moveTo(q[0].x,q[0].y);for(let i=1;i<q.length;i++)ctx.lineTo(q[i].x,q[i].y);ctx.closePath();};
  if(E.z<bz){ctx.save();ctx.beginPath();quad([v3(xl,FY,bz),v3(xr,FY,bz),v3(xr,HY,bz),v3(xl,HY,bz)]);if(o.win){const [a,b,c,d]=o.win;quad([v3(a,b,bz),v3(a,d,bz),v3(c,d,bz),v3(c,b,bz)]);}
    ctx.fillStyle=rgba(ilit(paper,ILIT.F),1);ctx.fill("evenodd");ctx.clip("evenodd");
    // wallpaper: soft stripes and a tiny sprig between them
    if(o.plain!==true&&!o.lod){for(let x=xl+0.06;x<xr;x+=0.26)wq3(ctx,C,x,DH,x+0.09,HY,bz-0.002,ilit(stripe,ILIT.F),{a:0.55});
      const sp=o.sprig||[226,150,120];ctx.fillStyle=rgba(ilit(sp,ILIT.F),0.55);for(let x=xl+0.19;x<xr;x+=0.26)for(let y=DH+0.18;y<HY-0.05;y+=0.32){const p=pj(C,v3(x,y,bz-0.003));ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.2,0.022*p.s),0,TAU);ctx.fill();}}
    // the dado and its rail
    wq3(ctx,C,xl,FY,xr,DH,bz-0.004,ilit(dado,ILIT.F),{grad:[0.04,0.08]});
    for(let x=xl+0.18;x<xr-0.1;x+=0.36)wq3(ctx,C,x,FY+0.16,x+0.26,DH-0.14,bz-0.005,ilit(mix(dado,[255,255,255],0.12),ILIT.F),{edge:0.35});
    wq3(ctx,C,xl,DH-0.02,xr,DH+0.05,bz-0.006,ilit(PAL.rail,ILIT.F),{edge:0.4});ctx.restore();
    if(o.win){const [a,b,c,d]=o.win,fr=ilit([255,253,246],ILIT.F);
      wq3(ctx,C,a-0.06,b-0.06,c+0.06,b,bz-0.01,fr);wq3(ctx,C,a-0.06,d,c+0.06,d+0.06,bz-0.01,fr);wq3(ctx,C,a-0.06,b,a,d,bz-0.01,fr);wq3(ctx,C,c,b,c+0.06,d,bz-0.01,fr);
      wq3(ctx,C,(a+c)/2-0.025,b,(a+c)/2+0.025,d,bz-0.01,fr);wq3(ctx,C,a,(b+d)/2+0.12,c,(b+d)/2+0.16,bz-0.01,fr);
      ibox(ctx,C,a-0.12,b-0.12,bz-0.16,c-a+0.24,0.07,0.16,[255,252,244],{edge:0.5});}}
  // the ceiling, the side walls with the dado carried round, the floor: each only from the side it can be seen
  if(E.y<HY)poly3(ctx,C,[v3(xl,HY,Z0),v3(xr,HY,Z0),v3(xr,HY,bz),v3(xl,HY,bz)],ilit(PAL.ceil,ILIT.D),{grad:[0,0.1]});
  for(const [x,k,s] of [[xl,ILIT.L,1],[xr,ILIT.R,-1]]){if((E.x-x)*s<=0)continue;sq3(ctx,C,x,Z0,FY,bz,HY,ilit(side,k),{grad:[0.03,0.08]});sq3(ctx,C,x,Z0,FY,bz,DH,ilit(dado,k),{grad:[0.02,0.06]});sq3(ctx,C,x,Z0,DH-0.02,bz,DH+0.05,ilit(PAL.rail,k));}
  if(E.y>FY){fq3(ctx,C,xl,Z0,xr,bz,FY,ilit(floor,ILIT.U),{grad:[0.02,0.1]});
    // o.flags: a floor of stone flags instead of boards
    if(o.flags&&!o.lod){ctx.save();ctx.strokeStyle="rgba(90,80,70,0.22)";ctx.lineWidth=1.5;for(let z=Z0+0.45;z<bz;z+=0.45){const a=pj(C,v3(xl,FY,z)),b=pj(C,v3(xr,FY,z));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
      let r=0;for(let z=Z0;z<bz-0.01;z+=0.45,r++)for(let x=xl+(r%2?0.3:0.6);x<xr;x+=0.6){const a=pj(C,v3(x,FY,z)),b=pj(C,v3(x,FY,Math.min(bz,z+0.45)));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();}
    else if(!o.lod){ctx.save();ctx.strokeStyle="rgba(120,74,40,0.2)";ctx.lineWidth=1.5;for(let x=xl+0.32;x<xr;x+=0.32){const a=pj(C,v3(x,FY,Z0)),b=pj(C,v3(x,FY,bz));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    for(let i=0;i<40;i++){const x=xl+0.32*Math.floor(hash(i,7)*(xr-xl)/0.32),z=lerp(Z0,bz,hash(i,8)),a=pj(C,v3(x,FY,z)),b=pj(C,v3(Math.min(xr,x+0.32),FY,z));if(a.z<NEAR||b.z<NEAR)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();}
    // skirting, and soft shadow where the walls meet
    if(E.z<bz)wq3(ctx,C,xl,FY,xr,FY+0.09,bz-0.02,ilit([255,252,244],ILIT.F),{edge:0.3});if(E.x>xl)sq3(ctx,C,xl+0.01,Z0,FY,bz,FY+0.09,ilit([255,252,244],ILIT.L));if(E.x<xr)sq3(ctx,C,xr-0.01,Z0,FY,bz,FY+0.09,ilit([255,252,244],ILIT.R));
    aoStrip(ctx,C,v3(xl,FY+0.001,bz),v3(xr,FY+0.001,bz),v3(0,0,-1),0.55,0.16);aoStrip(ctx,C,v3(xl,FY+0.001,Z0),v3(xl,FY+0.001,bz),v3(1,0,0),0.45,0.13);aoStrip(ctx,C,v3(xr,FY+0.001,Z0),v3(xr,FY+0.001,bz),v3(-1,0,0),0.45,0.13);}
  if(E.z<bz){aoStrip(ctx,C,v3(xl,FY,bz-0.002),v3(xl,HY,bz-0.002),v3(1,0,0),0.3,0.1);aoStrip(ctx,C,v3(xr,FY,bz-0.002),v3(xr,HY,bz-0.002),v3(-1,0,0),0.3,0.1);aoStrip(ctx,C,v3(xl,HY,bz-0.002),v3(xr,HY,bz-0.002),v3(0,-1,0),0.28,0.1);}
  return{xl,xr,bz,FY,HY,Z0,E};}
// the open front's cut edges (white, like card), the outer walls the camera can see, a coloured band and the roof
function tShell(ctx,C,R,o){o=o||{};const t=0.2,cut=[255,253,248],w=R.X1-R.X0,d=R.Z1-R.Z0,HY=R.HY,wc=o.wall||PAL.cream,E=mxL(C.eye);
  if(E.x<R.X0)poly3(ctx,C,[v3(R.X0,0,R.Z1),v3(R.X0,0,R.Z0),v3(R.X0,HY+0.18,R.Z0),v3(R.X0,HY+0.18,R.Z1)],wc,{n:NRM.L,grad:[0.05,0.08],edge:0.4});
  if(E.x>R.X1)poly3(ctx,C,[v3(R.X1,0,R.Z0),v3(R.X1,0,R.Z1),v3(R.X1,HY+0.18,R.Z1),v3(R.X1,HY+0.18,R.Z0)],wc,{n:NRM.R,grad:[0.05,0.08],edge:0.4});
  if(E.x<R.X0||E.x>R.X1)sideWins(ctx,C,R,E.x<R.X0?R.X0-0.01:R.X1+0.01,E.x<R.X0?NRM.L:NRM.R,o);
  if(E.z<R.Z0){wq3(ctx,C,R.X0,0,R.X0+t,HY+0.18,R.Z0,cut,{edge:0.5});wq3(ctx,C,R.X1-t,0,R.X1,HY+0.18,R.Z0,cut,{edge:0.5});wq3(ctx,C,R.X0,HY,R.X1,HY+0.18,R.Z0,cut,{edge:0.5});
    wq3(ctx,C,R.X0,0,R.X1,R.FY,R.Z0-0.001,o.plinth||[244,234,212],{edge:0.4});wq3(ctx,C,R.X0,R.FY-0.05,R.X1,R.FY,R.Z0-0.002,cut);}
  drawBox(ctx,C,R.X0-0.06,HY+0.18,R.Z0-0.06,w+0.12,0.2,d+0.12,o.band||PAL.band,{grad:[0.12,0.08],edge:0.6});
  if(o.flat)drawBox(ctx,C,R.X0-0.16,HY+0.38,R.Z0-0.16,w+0.32,0.22,d+0.32,o.roof||[214,208,198],{grad:[0.05,0.06],edge:0.5});
  else gable(ctx,C,R.X0,HY+0.38,R.Z0,w,d,o.rh||1.5,o.roof||PAL.roof,{wall:o.gableWall||wc,ov:0.26});}
// the same building seen from behind or from far away: closed, with windows
function tClosed(ctx,C,R,o){o=o||{};const w=R.X1-R.X0,d=R.Z1-R.Z0,HY=R.HY,wc=o.wall||PAL.cream;
  drawBox(ctx,C,R.X0,0,R.Z0,w,HY+0.18,d,wc,{grad:[0.05,0.08],edge:0.4,noTop:true,front:o.front||wc});
  const E=mxL(C.eye);if(E.z>R.Z1)backWins(ctx,C,R,o);if(E.x<R.X0||E.x>R.X1)sideWins(ctx,C,R,E.x<R.X0?R.X0-0.01:R.X1+0.01,E.x<R.X0?NRM.L:NRM.R,o);if(E.z<R.Z0&&o.frontWins)o.frontWins(ctx,C,R);
  drawBox(ctx,C,R.X0-0.06,HY+0.18,R.Z0-0.06,w+0.12,0.2,d+0.12,o.band||PAL.band,{grad:[0.12,0.08],edge:0.6});
  if(o.flat)drawBox(ctx,C,R.X0-0.16,HY+0.38,R.Z0-0.16,w+0.32,0.22,d+0.32,o.roof||[214,208,198],{grad:[0.05,0.06],edge:0.5});
  else gable(ctx,C,R.X0,HY+0.38,R.Z0,w,d,o.rh||1.5,o.roof||PAL.roof,{wall:o.gableWall||wc,ov:0.26});}
// windows: glass with a white frame, on the outer side and back walls
function winQ(ctx,C,pts,n,o){poly3(ctx,C,pts,[255,253,246],{n,edge:0.4});const c=pts.reduce((s,p)=>vadd(s,p),v3(0,0,0));const m=vmul(c,0.25);const k=0.8,inn=pts.map(p=>vadd(m,vmul(vsub(p,m),k)));
  poly3(ctx,C,inn,o.glass||[170,210,240],{n,grad:[0.35,0.1]});}
function sideWins(ctx,C,R,x,n,o){const d=R.Z1-R.Z0,cols=Math.max(1,Math.round(d/1.4)),y0=R.FY+0.75,y1=R.FY+1.95;for(let i=0;i<cols;i++){const zc=R.Z0+(i+0.5)*d/cols;winQ(ctx,C,[v3(x,y0,zc-0.35),v3(x,y0,zc+0.35),v3(x,y1,zc+0.35),v3(x,y1,zc-0.35)],n,o);}}
function backWins(ctx,C,R,o){const w=R.X1-R.X0,cols=Math.max(2,Math.round(w/1.5)),y0=R.FY+0.75,y1=R.FY+1.95,z=R.Z1+0.01;for(let i=0;i<cols;i++){const xc=R.X0+(i+0.5)*w/cols;winQ(ctx,C,[v3(xc+0.35,y0,z),v3(xc-0.35,y0,z),v3(xc-0.35,y1,z),v3(xc+0.35,y1,z)],NRM.B,o);}}

// ---- furniture: drawn flat at a point and scaled with distance, or built of boxes ----
function tShelf(ctx,C,x0,z0,w,h,d,o){o=o||{};const FY=o.FY||0,cols=o.cols||[PAL.navy,PAL.coral,PAL.teal,PAL.mustard,PAL.lilac,PAL.sage,[96,120,170],[200,96,86]];let n=0;
  ibox(ctx,C,x0,FY,z0,w,h,d,PAL.walnut,{grad:[0.08,0.1],edge:0.35});wq3(ctx,C,x0+0.05,FY+0.05,x0+w-0.05,FY+h-0.05,z0-0.002,ilit(mix(PAL.walnut,[40,24,14],0.42),1));
  const rows=o.rows||4,rh=(h-0.1)/rows,out=o.out||(()=>0),skip=o.skip||(()=>false);
  for(let r=0;r<rows;r++){const yy=FY+0.05+r*rh;ibox(ctx,C,x0+0.05,yy,z0-0.01,w-0.1,0.045,d-0.04,mix(PAL.walnut,[255,230,190],0.18),{edge:0.3});if(r===0&&!o.bottomRow)continue;
    let bx=x0+0.09;for(let j=0;j<20;j++){const bw=0.12+0.03*hash(r*31+j,3),bh=Math.min(rh-0.1,0.4+0.05*hash(r*17+j,5));if(bx+bw>x0+w-0.08)break;
      if(skip(r,j)){bx+=bw+0.012;continue;}const c=cols[(r*5+j*3)%cols.length],dz=-out(r,j);
      ibox(ctx,C,bx,yy+0.045,z0-0.005+dz,bw,bh,0.28,c,{grad:[0.14,0.12],edge:0.3,lw:1});wq3(ctx,C,bx+bw*0.2,yy+0.045+bh*0.55,bx+bw*0.8,yy+0.045+bh*0.82,z0-0.007+dz,[250,246,234]);
      const hp=pj(C,v3(bx+bw/2,yy+0.045+bh*0.3,z0-0.007+dz));ctx.fillStyle=rgba(mix(c,[0,0,0],0.45),0.8);ctx.beginPath();ctx.arc(hp.x,hp.y,Math.max(1.5,0.018*hp.s),0,TAU);ctx.fill();
      bx+=bw+0.012;n++;}}
  return n;}
function tPlant(ctx,C,x,y,z,h){const B=pj(C,v3(x,y,z)),k=B.s*h;if(B.z<NEAR)return;const pot=[214,122,86];
  ctx.save();ctx.translate(B.x,B.y);ctx.fillStyle="rgba(60,40,30,0.22)";ctx.beginPath();ctx.ellipse(0,0,k*0.26,k*0.06,0,0,TAU);ctx.fill();
  const lv=[[-0.62,0.9],[-0.35,1.0],[-0.1,1.05],[0.15,1.0],[0.42,0.94],[0.66,0.8],[-0.8,0.7],[0.85,0.62]];
  lv.forEach(([a,l],i)=>{ctx.save();ctx.translate(0,-k*0.28);ctx.rotate(a*0.9);const g=ctx.createLinearGradient(-k*0.08,0,k*0.08,0);const c=i%2?[92,164,104]:[70,142,92];g.addColorStop(0,rgba(mix(c,[255,255,220],0.25),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-k*0.11,-k*0.25*l,-k*0.06,-k*0.55*l,0,-k*0.66*l);ctx.bezierCurveTo(k*0.07,-k*0.55*l,k*0.1,-k*0.25*l,0,0);ctx.fill();
    ctx.strokeStyle="rgba(255,255,230,0.35)";ctx.lineWidth=Math.max(1,k*0.006);ctx.beginPath();ctx.moveTo(0,-k*0.04);ctx.lineTo(0,-k*0.6*l);ctx.stroke();ctx.restore();});
  ctx.beginPath();ctx.moveTo(-k*0.17,-k*0.3);ctx.lineTo(k*0.17,-k*0.3);ctx.lineTo(k*0.13,0);ctx.lineTo(-k*0.13,0);ctx.closePath();const g=ctx.createLinearGradient(-k*0.17,0,k*0.17,0);g.addColorStop(0,rgba(mix(pot,[255,240,220],0.25),1));g.addColorStop(1,rgba(mix(pot,[0,0,0],0.18),1));ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle=rgba(mix(pot,[255,240,220],0.35),1);rr(ctx,-k*0.19,-k*0.33,k*0.38,k*0.06,k*0.02);ctx.fill();ctx.restore();}
function tDeskLamp(ctx,C,x,y,z,h,on){const B=pj(C,v3(x,y,z)),k=B.s*h,c=[64,92,140];if(B.z<NEAR)return;ctx.save();ctx.translate(B.x,B.y);
  if(on){const g=ctx.createRadialGradient(k*0.3,-k*0.62,1,k*0.3,-k*0.5,k*1.2);g.addColorStop(0,"rgba(255,236,180,"+(0.5*on)+")");g.addColorStop(1,"rgba(255,236,180,0)");ctx.fillStyle=g;ctx.fillRect(-k*1.2,-k*1.8,k*2.8,k*2.4);}
  ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.ellipse(0,0,k*0.2,k*0.06,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=Math.max(2,k*0.04);ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(0,-k*0.03);ctx.lineTo(-k*0.12,-k*0.58);ctx.lineTo(k*0.22,-k*0.86);ctx.stroke();
  ctx.save();ctx.translate(k*0.25,-k*0.86);ctx.rotate(0.5);ctx.beginPath();ctx.moveTo(-k*0.1,-k*0.05);ctx.lineTo(k*0.1,-k*0.05);ctx.lineTo(k*0.2,k*0.18);ctx.lineTo(-k*0.2,k*0.18);ctx.closePath();
  const g=ctx.createLinearGradient(-k*0.2,0,k*0.2,0);g.addColorStop(0,rgba(mix(c,[255,255,255],0.3),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.fill();
  if(on){ctx.fillStyle="rgba(255,244,210,0.95)";ctx.beginPath();ctx.ellipse(0,k*0.18,k*0.19,k*0.04,0,0,TAU);ctx.fill();}ctx.restore();ctx.restore();}
function tClock(ctx,C,x,y,z,r,hh,mm){const P_=pj(C,v3(x,y,z)),R=r*P_.s;if(P_.z<NEAR)return;ctx.save();ctx.translate(P_.x,P_.y);ctx.fillStyle="rgba(60,40,30,0.18)";ctx.beginPath();ctx.arc(R*0.08,R*0.1,R*1.05,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(PAL.navy,1);ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();ctx.fillStyle="#fffaf0";ctx.beginPath();ctx.arc(0,0,R*0.84,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(PAL.ink,1);ctx.lineCap="round";for(let i=0;i<12;i++){const a=i*TAU/12;ctx.lineWidth=Math.max(1,R*0.05);ctx.beginPath();ctx.moveTo(Math.sin(a)*R*0.68,-Math.cos(a)*R*0.68);ctx.lineTo(Math.sin(a)*R*0.76,-Math.cos(a)*R*0.76);ctx.stroke();}
  const ha=(hh%12+mm/60)*TAU/12,ma=mm*TAU/60;ctx.lineWidth=Math.max(1.5,R*0.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.sin(ha)*R*0.42,-Math.cos(ha)*R*0.42);ctx.stroke();ctx.lineWidth=Math.max(1,R*0.06);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.sin(ma)*R*0.62,-Math.cos(ma)*R*0.62);ctx.stroke();ctx.restore();}
// a desk with drawers on two sides; returns the height of its top
function tDesk(ctx,C,x,z,w,d,FY,col){col=col||PAL.oak;const h=0.7,pw=0.46;ibox(ctx,C,x,FY,z,pw,h,d-0.04,col,{grad:[0.08,0.12]});ibox(ctx,C,x+w-pw,FY,z,pw,h,d-0.04,col,{grad:[0.08,0.12]});
  for(const xx of [x,x+w-pw])for(let i=0;i<3;i++){wq3(ctx,C,xx+0.05,FY+0.06+i*0.22,xx+pw-0.05,FY+0.24+i*0.22,z-0.005,ilit(mix(col,[255,255,255],0.1),ILIT.F),{edge:0.4});const p=pj(C,v3(xx+pw/2,FY+0.15+i*0.22,z-0.01));if(p.z>NEAR){ctx.fillStyle="rgba(90,60,40,0.7)";ctx.fillRect(p.x-0.06*p.s,p.y-0.012*p.s,0.12*p.s,0.024*p.s);}}
  ibox(ctx,C,x-0.05,FY+h,z-0.05,w+0.1,0.06,d+0.06,mix(col,[255,240,210],0.15),{edge:0.6});return FY+h+0.06;}
// a painted wooden chair, its back to the wall: four legs, a seat, two posts and a rail
function tChair(ctx,C,x,z,FY,col){col=col||[78,128,170];const lg=mix(col,[40,30,30],0.35);
  for(const [lx,lz] of [[0.03,0.39],[0.39,0.39],[0.03,0.03],[0.39,0.03]])ibox(ctx,C,x+lx,FY,z+lz,0.04,0.42,0.04,lg,{edge:0.2});
  ibox(ctx,C,x,FY+0.42,z,0.46,0.05,0.46,col);for(const lx of [0.03,0.39])ibox(ctx,C,x+lx,FY+0.47,z+0.39,0.04,0.46,0.04,lg,{edge:0.2});
  ibox(ctx,C,x-0.01,FY+0.72,z+0.38,0.48,0.2,0.05,col);}
// a monitor on a stand, facing the front: fn(c) draws the screen in centimetres (w x h)
function tMonitor(ctx,C,x,y,z,w,h,fn,o){o=o||{};ibox(ctx,C,x+w/2-0.04,y,z+0.06,0.08,0.18,0.06,[70,74,88]);ibox(ctx,C,x+w/2-0.16,y,z,0.32,0.02,0.2,[70,74,88]);
  ibox(ctx,C,x-0.03,y+0.16,z-0.02,w+0.06,h+0.06,0.05,[56,62,78],{edge:0.5});const sc=wq3(ctx,C,x,y+0.19,x+w,y+0.19+h,z-0.025,o.bg||[236,244,250]);
  if(fn)surfDraw(ctx,C,v3(x,y+0.19+h,z-0.027),v3(1,0,0),v3(0,1,0),fn,{lb:o.lb});return sc;}
// a pinboard on a back wall (z) with cards on it; o.cards: [[u,v,du,dv,colour]] in the board's fractions
function tPinboard(ctx,C,x0,y0,x1,y1,z,o){o=o||{};wq3(ctx,C,x0-0.04,y0-0.04,x1+0.04,y1+0.04,z,ilit(PAL.walnut,1),{edge:0.4});wq3(ctx,C,x0,y0,x1,y1,z-0.004,ilit([222,176,124],1),{grad:[0.04,0.06]});
  for(const [u,v,du,dv,c] of (o.cards||[])){const xx=lerp(x0,x1,u),yy=lerp(y0,y1,v),dx=(x1-x0)*du,dy=(y1-y0)*dv;wq3(ctx,C,xx,yy,xx+dx,yy+dy,z-0.008,ilit(c,1),{edge:0.3});
    for(let i=1;i<4;i++)wq3(ctx,C,xx+dx*0.12,yy+dy*(i/4.5),xx+dx*0.85,yy+dy*(i/4.5)+0.012,z-0.01,[150,150,170],{a:0.6});const p=pj(C,v3(xx+dx/2,yy+dy*0.9,z-0.012));if(p.z>NEAR){ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.5,0.02*p.s),0,TAU);ctx.fill();}}}
// a rug on the floor, with stripes
function tRug(ctx,C,x0,z0,x1,z1,y,col,o){o=o||{};fq3(ctx,C,x0-0.13,z0-0.11,x1+0.13,z1+0.11,y+0.006,ilit(o.border||PAL.rugB,ILIT.U));fq3(ctx,C,x0,z0,x1,z1,y+0.008,ilit(col,ILIT.U),{grad:[0.04,0.06]});
  for(let z=z0+0.2;z<z1-0.1;z+=0.42)fq3(ctx,C,x0+0.12,z,x1-0.12,z+0.04,y+0.009,ilit(mix(col,[255,255,255],0.25),ILIT.U));}

// ---- the finishing touches: a tilt-shift blur, fast (blurred at a quarter of the size), and a soft vignette ----
const PC2={};function pcanvas2(k,w,h){const c=PC2[k]||(PC2[k]=document.createElement("canvas"));if(c.width!==w||c.height!==h){c.width=w;c.height=h;}return c;}
function tiltShift(ctx,y0,y1,amt,soft){if(!(amt>0.2))return;const cv=ctx.canvas,w=cv.width,h=cv.height,q=4,bw=Math.max(2,Math.round(w/q)),bh=Math.max(2,Math.round(h/q)),sc=w/W;soft=soft||220;
  const b=pcanvas2("ts",bw,bh),bx=b.getContext("2d");bx.setTransform(1,0,0,1,0,0);bx.globalCompositeOperation="copy";bx.imageSmoothingQuality="high";bx.filter="blur("+(amt*sc/q).toFixed(2)+"px)";bx.drawImage(cv,0,0,bw,bh);bx.filter="none";
  bx.globalCompositeOperation="destination-in";const g=bx.createLinearGradient(0,0,0,bh),f=v=>clamp(v/H,0,1);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(f(y0-soft),"rgba(0,0,0,1)");g.addColorStop(f(y0),"rgba(0,0,0,0)");g.addColorStop(f(y1),"rgba(0,0,0,0)");g.addColorStop(f(y1+soft),"rgba(0,0,0,1)");g.addColorStop(1,"rgba(0,0,0,1)");
  bx.fillStyle=g;bx.fillRect(0,0,bw,bh);bx.globalCompositeOperation="source-over";ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingQuality="high";ctx.drawImage(b,0,0,w,h);ctx.restore();}
function vignetteSoft(ctx,col,a){ctx.save();ctx.setTransform(1,0,0,1,0,0);const cv=ctx.canvas,g=ctx.createRadialGradient(cv.width/2,cv.height*0.45,cv.height*0.42,cv.width/2,cv.height*0.5,cv.height*1.05);g.addColorStop(0,rgba(col,0));g.addColorStop(1,rgba(col,a));ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
// blur the whole picture behind a card
function blurAll(ctx,amt,dim){const cv=ctx.canvas,w=cv.width,h=cv.height,q=4,bw=Math.max(2,Math.round(w/q)),bh=Math.max(2,Math.round(h/q)),sc=w/W;const b=pcanvas2("ba",bw,bh),bx=b.getContext("2d");
  bx.setTransform(1,0,0,1,0,0);bx.globalCompositeOperation="copy";bx.filter="blur("+(amt*sc/q).toFixed(2)+"px)";bx.drawImage(cv,0,0,bw,bh);bx.filter="none";bx.globalCompositeOperation="source-over";
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(b,0,0,w,h);if(dim){ctx.fillStyle=rgba(dim[0],dim[1]);ctx.fillRect(0,0,w,h);}ctx.restore();}

// ---- timing: when a word of a line is spoken (an estimate, by its place in the spoken words) ----
function wAt(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}
// a value that springs in at t0 (0 to 1, overshooting a little), and one that rises smoothly
const pop=(t,t0,d)=>spring((t-t0)/(d||0.7));
const rise=(t,t0,d)=>sstep(t0,t0+(d||0.6),t);
