/* ===== What's in a word: the beasts =====
   The vervet monkeys and their hunters (a leopard, a snake), the animals with names (a dolphin, an elephant, a marmoset), and the gavagai rabbit.
   Each takes (ctx, x, y, size, colour, options) (the rabbit takes t before its options); options.a fades it, options.t (seconds) brings it to
   life (breath, blinks, a turning head, a swaying tail), options.flip turns it to face left. They keep icon()'s look: a dark body lit from the
   upper left, a glowing rim in the colour that carries the meaning (thicker on the shadow side), fine inner details in that colour and a small
   bright eye; but their shapes come from their anatomy: smooth contours, tapering limbs, a darker far leg behind the body. Every pose and gait is
   a function of t and the options, so any frame draws alone. */

/* ---------- the drawing kit ---------- */
const BS_INK=[20,26,40],BS_ST={f:1,s:1,z:1},BS_LAY={},BS_CACHE={};
// while a beast fades (its own a, or the scene's alpha), draw it whole on a layer first, so its overlapping parts don't show through each other;
// b is its reach in its own units [left, top, right, bottom] (as it faces, before o.flip); o.bs_mask(c), drawn in the beast's own units, wipes part of it (a monkey half
// hidden in a bush). True when it's done (or there's nothing to draw).
function bs_layered(ctx,x,y,s,o,b,fn){const a=o.a==null?1:o.a,ga=ctx.globalAlpha*Math.min(1,a);if(a<=0.01||ga<=0.004||!(s>0))return true;if(o.bs_in||(ga>0.985&&!o.bs_mask))return false;
  const m=ctx.getTransform(),fl=o.flip?-1:1,X=[],Y=[];for(const u of [b[0]*fl,b[2]*fl])for(const v of [b[1],b[3]]){const px=x+s*u,py=y+s*v;X.push(m.a*px+m.c*py+m.e);Y.push(m.b*px+m.d*py+m.f);}
  const x0=Math.floor(Math.min(...X)-14),y0=Math.floor(Math.min(...Y)-14),w=Math.ceil(Math.max(...X)+14)-x0,h=Math.ceil(Math.max(...Y)+14)-y0;if(w<1||h<1||w*h>9e6)return false;
  // a few layers, taken in turn, so a layer is never redrawn while the frame still holds its last picture
  BS_LAY.i=((BS_LAY.i||0)+1)%6;let L=BS_LAY[BS_LAY.i];if(!L||L.c.width<w||L.c.height<h){const c=mkCanvas(Math.max(w,L?L.c.width:0),Math.max(h,L?L.c.height:0));L=BS_LAY[BS_LAY.i]={c,x:c.getContext("2d")};}
  const c=L.x;c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.clearRect(0,0,w,h);c.setTransform(m.a,m.b,m.c,m.d,m.e-x0,m.f-y0);fn(c,Object.assign({},o,{a:1,bs_in:1}));
  if(o.bs_mask){c.save();c.translate(x,y);c.scale(s,s);c.globalCompositeOperation="destination-out";o.bs_mask(c);c.restore();}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga;ctx.drawImage(L.c,0,0,w,h,x0,y0,w,h);ctx.restore();return true;}
// begin a beast: fade, place, scale, flip (fx narrows it while it turns round, never below 0.35); false if there's nothing to draw
function bs_begin(ctx,x,y,s,o,fx){const a=o.a==null?1:o.a;if(a<=0.01||!(s>0))return false;ctx.save();ctx.globalAlpha*=Math.min(1,a);ctx.translate(x,y);
  fx=fx==null?1:fx;fx=fx<0?Math.min(-0.35,fx):Math.max(0.35,fx);BS_ST.f=(o.flip?-1:1)*fx;BS_ST.s=s;ctx.scale(s*BS_ST.f,s);if(o.rot)ctx.rotate(o.rot);ctx.lineJoin="round";ctx.lineCap="round";return true;}
// a closed smooth curve through points (Catmull-Rom, as beziers); every loop winds the same way as the tubes, so the parts of a form fill as one
function bs_loop(c,p){const n=p.length;let A=0;for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n];A+=a[0]*b[1]-b[0]*a[1];}if(A>0)p=p.slice().reverse();c.moveTo(p[0][0],p[0][1]);
  for(let i=0;i<n;i++){const a=p[(i+n-1)%n],b=p[i],d=p[(i+1)%n],e=p[(i+2)%n];c.bezierCurveTo(b[0]+(d[0]-a[0])/6,b[1]+(d[1]-a[1])/6,d[0]-(e[0]-b[0])/6,d[1]-(e[1]-b[1])/6,d[0],d[1]);}c.closePath();}
// an open smooth curve through points; m===false carries on the current subpath
function bs_line(c,p,m){const n=p.length;if(m===false)c.lineTo(p[0][0],p[0][1]);else c.moveTo(p[0][0],p[0][1]);for(let i=0;i<n-1;i++){const a=p[i?i-1:0],b=p[i],d=p[i+1],e=p[i+2<n?i+2:n-1];
  c.bezierCurveTo(b[0]+(d[0]-a[0])/6,b[1]+(d[1]-a[1])/6,d[0]-(e[0]-b[0])/6,d[1]-(e[1]-b[1])/6,d[0],d[1]);}}
// a limb, tail, trunk or ear: a smooth tube along points p, w its half-width at each point, rounded at both ends
function bs_tube(c,p,w){const n=p.length,L=[],R=[];let a0=0,a1=0;for(let i=0;i<n;i++){const a=p[i?i-1:0],b=p[i<n-1?i+1:n-1];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
    const r=Math.max(0.05,w[i]);L.push([p[i][0]-dy*r,p[i][1]+dx*r]);R.push([p[i][0]+dy*r,p[i][1]-dx*r]);if(!i)a0=Math.atan2(dy,dx);if(i===n-1)a1=Math.atan2(dy,dx);}
  bs_line(c,L);c.arc(p[n-1][0],p[n-1][1],Math.max(0.05,w[n-1]),a1+Math.PI/2,a1-Math.PI/2,true);bs_line(c,R.reverse(),false);c.arc(p[0][0],p[0][1],Math.max(0.05,w[0]),a0-Math.PI/2,a0+Math.PI/2,true);c.closePath();}
// a tapering stroke, w0 to w1 (half-widths)
function bs_taper(c,p,w0,w1){const n=p.length,w=[];for(let i=0;i<n;i++)w.push(lerp(w0,w1,n>1?i/(n-1):0));bs_tube(c,p,w);}
// a body along a spine (rump to neck): dw, vw its depth on the back and on the belly side at each spine point, re and fe how far it rounds off at each end
function bs_torso(c,sp,dw,vw,re,fe){const n=sp.length,D=[],V=[],T=[];for(let i=0;i<n;i++){const a=sp[i?i-1:0],b=sp[i<n-1?i+1:n-1];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;T.push([dx,dy]);
    D.push([sp[i][0]+dy*dw[i],sp[i][1]-dx*dw[i]]);V.push([sp[i][0]-dy*vw[i],sp[i][1]+dx*vw[i]]);}
  bs_loop(c,[[sp[0][0]-T[0][0]*re,sp[0][1]-T[0][1]*re]].concat(D,[[sp[n-1][0]+T[n-1][0]*fe,sp[n-1][1]+T[n-1][1]*fe]],V.reverse()));}
// the dark fill of a form, lit from the upper left of the screen whichever way the beast faces; k darkens it (the far legs); b [x0,y0,x1,y1] its
// reach; lo (0..1) keeps a little of its colour in the shadow
function bs_fill(ctx,col,k,b,lo){const g=BS_ST.f<0?-1:1,G=ctx.createLinearGradient(b[0]*g,b[1],b[2]*g,b[3]),d=lo?mix(col,[8,12,22],lo):[8,12,22];
  G.addColorStop(0,rgba(mix(mix(col,BS_INK,0.55),[6,9,16],k),1));G.addColorStop(1,rgba(mix(d,[4,6,12],k),1));return G;}
// one form: build(p) adds its parts to a path. Its rim, in col, is heavier on the shadow side: the silhouette in the rim's colour nudged down and
// right (glowing, gl the blur in px, 0 for none) and, thinner, up and left (not for the dim far limbs), a fine line all round, and the dark body
// over them. Returns the path.
function bs_form(ctx,build,col,fill,ra,lw,gl){const s=BS_ST.s,f=BS_ST.f,P=new Path2D(),z=(lw||2.6)/2.6;ra=ra==null?1:ra;build(P);
  ctx.save();ctx.translate(1.05*z/(s*f),1.45*z/s);ctx.fillStyle=rgba(col,0.92*ra);if(gl){ctx.shadowColor=rgba(col,0.72*ra);ctx.shadowBlur=gl*BS_ST.z;}ctx.fill(P);ctx.restore();
  if(ra>0.5){ctx.save();ctx.translate(-0.6*z/(s*f),-0.6*z/s);ctx.fillStyle=rgba(col,0.85*ra);ctx.fill(P);ctx.restore();}
  ctx.lineWidth=1/s;ctx.strokeStyle=rgba(col,ra);ctx.stroke(P);ctx.fillStyle=fill;ctx.fill(P);return P;}
// a still part of a beast, drawn once at 2x into its own canvas (with room for its glow) and then placed: key names it, b [x0,y0,x1,y1] is its
// reach in the beast's own units and draw(c) draws it there (at the beast's scale and facing, which the key includes)
function bs_still(ctx,key,b,draw){const s=BS_ST.s,f=BS_ST.f;key+=":"+s.toFixed(3)+":"+f.toFixed(3);let S=BS_CACHE[key];
  if(!S){const Z=2*s,pad=16,W=Math.ceil((b[2]-b[0])*Z+2*pad),H=Math.ceil((b[3]-b[1])*Z+2*pad),c=mkCanvas(W,H),g=c.getContext("2d");
    g.translate(pad-b[0]*Z,pad-b[1]*Z);g.scale(Z,Z);g.lineJoin="round";g.lineCap="round";BS_ST.z=2;draw(g);BS_ST.z=1;BS_ST.s=s;BS_ST.f=f;
    S=BS_CACHE[key]={c,x:b[0]-pad/Z,y:b[1]-pad/Z,w:W/Z,h:H/Z};}
  ctx.drawImage(S.c,S.x,S.y,S.w,S.h);}
// fine inner lines: each a list of points, a tapering stroke of w0 → w1 screen pixels (half-widths), drawn as one light polygon per line
function bs_lines(ctx,list,col,a,w0,w1){if(a<=0.01||!list.length)return;const s=BS_ST.s;ctx.beginPath();
  for(const p of list){const n=p.length,L=[],R=[];for(let i=0;i<n;i++){const q=p[i?i-1:0],r=p[i<n-1?i+1:n-1];let dx=r[0]-q[0],dy=r[1]-q[1];const d=Math.hypot(dx,dy)||1,w=lerp(w0,w1,n>1?i/(n-1):0)/s;
      L.push(p[i][0]-dy/d*w,p[i][1]+dx/d*w);R.push(p[i][0]+dy/d*w,p[i][1]-dx/d*w);}
    const e=p[n-1],b=p[0],d0=Math.hypot(p[1][0]-b[0],p[1][1]-b[1])||1,d1=Math.hypot(e[0]-p[n-2][0],e[1]-p[n-2][1])||1,k0=w0/s/d0,k1=w1/s/d1;
    ctx.moveTo(b[0]-(p[1][0]-b[0])*k0,b[1]-(p[1][1]-b[1])*k0);for(let i=0;i<n;i++)ctx.lineTo(L[2*i],L[2*i+1]);ctx.lineTo(e[0]+(e[0]-p[n-2][0])*k1,e[1]+(e[1]-p[n-2][1])*k1);
    for(let i=n-1;i>=0;i--)ctx.lineTo(R[2*i],R[2*i+1]);ctx.closePath();}
  ctx.fillStyle=rgba(col,a);ctx.fill();}
// a bright eye with a soft glow round it; op 1 open, 0 shut
function bs_eye(ctx,x,y,r,col,op,a){if(a!=null&&a<=0.02)return;const k=a==null?1:a;glow(ctx,x,y,r*2.4,col,0.24*k);ctx.save();ctx.globalAlpha*=k;ctx.translate(x,y);ctx.scale(1,Math.max(0.12,op==null?1:op));
  ctx.fillStyle=rgba(mix(col,[255,255,255],0.45),1);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}
// a joint between a and b (bones l1, l2); bend 1 or -1 picks the side it bends to
function bs_ik(a,b,l1,l2,bend){const dx=b[0]-a[0],dy=b[1]-a[1],d0=Math.hypot(dx,dy)||1e-6,d=clamp(d0,Math.abs(l1-l2)+0.01,l1+l2-0.01),x=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-x*x)),ux=dx/d0,uy=dy/d0;
  return [a[0]+ux*x-uy*h*bend,a[1]+uy*x+ux*h*bend];}
const bs_mid=(a,b,k)=>[a[0]+(b[0]-a[0])*(k==null?0.5:k),a[1]+(b[1]-a[1])*(k==null?0.5:k)];
// a side of a limb: the points of p pushed out by w on one side (1 or -1)
function bs_side(p,w,sd){const o=[];for(let i=0;i<p.length;i++){const a=p[i?i-1:0],b=p[i<p.length-1?i+1:p.length-1];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;o.push([p[i][0]-dy/d*w[i]*sd,p[i][1]+dx/d*w[i]*sd]);}return o;}
// two poses blended (numbers, points and lists of points)
function bs_blend(A,B,k){if(k<=0)return A;if(k>=1)return B;const o={};for(const q in A){const a=A[q],b=B[q];
  o[q]=typeof a==="number"?a+(b-a)*k:a.map((v,i)=>typeof v==="number"?v+(b[i]-v)*k:[v[0]+(b[i][0]-v[0])*k,v[1]+(b[i][1]-v[1])*k]);}return o;}
// four poses through a smooth (Catmull-Rom) curve, at u between the middle two
function bs_cr(A,B,C,D,u){const u2=u*u,u3=u2*u,wa=-0.5*u3+u2-0.5*u,wb=1.5*u3-2.5*u2+1,wc=-1.5*u3+2*u2+0.5*u,wd=0.5*u3-0.5*u2,f=(a,b,c,d)=>wa*a+wb*b+wc*c+wd*d,o={};
  for(const q in A){const a=A[q];o[q]=typeof a==="number"?f(a,B[q],C[q],D[q]):a.map((v,i)=>typeof v==="number"?f(v,B[q][i],C[q][i],D[q][i]):[f(v[0],B[q][i][0],C[q][i][0],D[q][i][0]),f(v[1],B[q][i][1],C[q][i][1],D[q][i][1])]);}return o;}
// a looping gait: keys [[phase, pose], ...] sorted, phase in 0..1
function bs_gait(keys,ph){ph-=Math.floor(ph);const n=keys.length;let k=n-1;for(let i=0;i<n;i++)if(keys[i][0]<=ph)k=i;const k1=(k+1)%n,p0=keys[k][0],p1=k1?keys[k1][0]:1,u=(ph-p0)/((p1-p0)||1);
  return bs_cr(keys[(k+n-1)%n][1],keys[k][1],keys[k1][1],keys[(k+2)%n][1],clamp(u,0,1));}
// a smooth value through keys [[u, v], ...] (a Hermite curve whose slopes follow the neighbouring keys)
function bs_curve(K,u){let k=0;while(k<K.length-2&&K[k+1][0]<u)k++;const a=K[Math.max(0,k-1)],b=K[k],c=K[k+1],d=K[Math.min(K.length-1,k+2)],h=(c[0]-b[0])||1,f=clamp((u-b[0])/h,0,1);
  const m1=(c[1]-a[1])/((c[0]-a[0])||1)*h,m2=(d[1]-b[1])/((d[0]-b[0])||1)*h,f2=f*f,f3=f2*f;return(2*f3-3*f2+1)*b[1]+(f3-2*f2+f)*m1+(3*f2-2*f3)*c[1]+(f3-f2)*m2;}
// a blink now and then (1 open, 0 shut), and a slow wandering value in -1..1 that rests, then eases to the next
function bs_blink(t,k){if(t==null)return 1;const P=3.3+hash(k,7)*2.6,u=((t+hash(k,8)*P)%P+P)%P;return u<0.2?1-0.92*Math.sin(Math.PI*u/0.2):1;}
function bs_drift(t,k,per){if(t==null)return 0;const u=t/per+hash(k,9)*7,i=Math.floor(u);return lerp(hash(i,k)*2-1,hash(i+1,k)*2-1,sstep(0.55,1,u-i));}
// a chain of points bent a little along its length (a tail swaying, a trunk curling): amp radians, ph the wave's phase
function bs_bend(p,amp,ph,sp){const o=[p[0]];let ang=0;for(let k=1;k<p.length;k++){const dx=p[k][0]-p[k-1][0],dy=p[k][1]-p[k-1][1];ang+=amp*Math.sin(ph-k*(sp||0.9))*k/p.length;
  const c=Math.cos(ang),s=Math.sin(ang),q=o[k-1];o.push([q[0]+dx*c-dy*s,q[1]+dx*s+dy*c]);}return o;}
// points turned by a and moved to o: the frame of a head, a paw
const bs_rot=(o,a,sc)=>{const c=Math.cos(a)*(sc||1),s=Math.sin(a)*(sc||1);return p=>[o[0]+p[0]*c-p[1]*s,o[1]+p[0]*s+p[1]*c];};


/* ---------- vervet monkey (Chlorocebus): slender, grizzled grey-olive, a black face with a short muzzle, framed by a thin white brow band and
   white cheek whiskers, small dark ears; a long tail with a dark tip; sitting on its haunches. Options: t, i (which monkey: each sits its own
   way, and is a little bigger or smaller), tree / bush / tall (0..1: perched in a tree, crouched in a bush looking up, standing tall), look (0..1,
   head up); dir (-1 while its next move is to the left: it turns and leaps that way). In the calls scene, calls [leopard, eagle, snake cue] and
   path [home, tree spot, bush spot] let each monkey keep the troop's moves a moment early or late, and turn round before it leaps ---------- */
const BS_MK={
  sit:{P:[-6,35],M:[-9,16],S:[3,-2],N:[8,-7],H:[13,-15],hp:0.1,K:[16,22],A:[10,44],T:[22,47.5],K2:[19,24],A2:[14,45],T2:[26,48],E:[8,22],Hn:[19,45.5],E2:[13,21],Hn2:[24,46.5],
    tl:[[-12,40],[-20,46.5],[-28,47.5],[-35,46.5],[-39,43],[-40,38.5]],dw:[12,10,8,5],vw:[10,10,9,5]},
  perch:{P:[-6,35],M:[-9,16],S:[3,-2],N:[8,-7],H:[13,-15],hp:0.18,K:[16,24],A:[12,43],T:[19,50],K2:[19,26],A2:[16,44],T2:[22,50.5],E:[8,22],Hn:[18,46],E2:[13,21],Hn2:[23,47],
    tl:[[-12,40],[-15,53],[-16,66],[-15,79],[-16,91],[-19,101]],dw:[12,10,8,5],vw:[10,10,9,5]},
  crouch:{P:[-8,38],M:[-7,22],S:[7,11],N:[12,6],H:[18,-1],hp:-0.62,K:[12,30],A:[6,45],T:[17,47.5],K2:[15,32],A2:[10,46],T2:[21,48],E:[15,28],Hn:[23,46.5],E2:[19,28],Hn2:[28,47],
    tl:[[-14,42],[-23,47],[-32,47.5],[-39,45.5],[-42,41],[-42,36]],dw:[11,9,8,5],vw:[10,10,9,5]},
  tall:{P:[0,11],M:[-4,-7],S:[2,-27],N:[6,-33],H:[10,-41],hp:0.5,K:[7,29],A:[1,45],T:[13,47.5],K2:[4,30],A2:[-3,46],T2:[9,48],E:[5,-9],Hn:[11,7],E2:[1,-8],Hn2:[8,9],
    tl:[[-7,15],[-13,27],[-16,38],[-22,46.5],[-31,47.5],[-37,44]],dw:[10,8,8,5],vw:[9,7.5,8,5]},
  leap:{P:[-16,16],M:[0,5],S:[16,11],N:[22,9],H:[30,3],hp:0.05,K:[-6,28],A:[-24,31],T:[-35,35],K2:[-10,30],A2:[-28,35],T2:[-39,39],E:[24,25],Hn:[36,35],E2:[20,27],Hn2:[30,39],
    tl:[[-22,13],[-34,11],[-47,13],[-58,17],[-67,24],[-72,32]],dw:[10,9,8,5],vw:[9,9,8,5]}};
// each monkey's own way of sitting: its size, and a change to the sitting pose (one upright with its tail curled round its feet, a youngster hunched
// over, grooming, one with its face turned toward us); d staggers its moves (s); pr: in the tree it reaches up to hold a branch above
const BS_MKI=[{sc:1.03,d:0.04,fa:1},
  {sc:1.07,d:0.16,fa:1,tf:1,pr:1,P:[-5,35],M:[-7,15],S:[5,-5],N:[9,-10],H:[13,-18],hp:0.06,E:[10,17],Hn:[16,25],E2:[15,16],Hn2:[21,26],
    tl:[[-10,42],[-8,47.5],[2,49],[14,49.5],[26,48.5],[31,44.5]]},
  {sc:0.85,d:0.09,fa:1,gr:1,S:[5,1],M:[-8,18],N:[10,-2],H:[16,-8],hp:0.62,E:[13,24],Hn:[15,17],tl:[[-12,40],[-20,46.5],[-27,47.5],[-33,45.5],[-35,41],[-34,36.5]]},
  {sc:0.97,d:0.22,fa:0.4,pr:1,H:[12,-15],hp:0.04}];
function monkey(ctx,x,y,s,col,o){o=o||{};col=col||[220,200,170];const t=o.t,live=t!=null,i=o.i||0,V=BS_MKI[((i%4)+4)%4];
  // the troop's moves, a moment early or late for each monkey; its size; the way it faces
  let tr=o.tree||0,bu=o.bush||0,ta=o.tall||0,F=null,dx=0,dy=0;const sc=V.sc,sv=s*sc;
  if(o.calls&&o.path&&live&&!o.bs_in){const [cL,cE,cS]=o.calls,d=V.d,m=o.path[0],T=o.path[1],B=o.path[2],trI=fin(t,cL+1+d,1.2)*(1-fin(t,cE+0.3+d*0.7,0.8)),buI=fin(t,cE+1.4+d*0.35,1.1)*(1-fin(t,cS+0.3+d*0.45,0.8));
    dx=(T[0]-m[0])*(trI-tr)+(B[0]-m[0])*(buI-bu);dy=(T[1]-m[1])*(trI-tr)+(B[1]-m[1])*(buI-bu);tr=trI;bu=buI;ta=fin(t,cS+0.8+d*1.2,0.8);
    const L1=fin(t,cL+0.35+d*1.4,0.55),R1=fin(t,cL+2.15+d*1.5,0.6),L2=fin(t,cS-0.2+d*0.8,0.45),R2=fin(t,cS+1.05+d*1.2,0.6);F=1-2*(L1*(1-R1)+L2*(1-R2));}
  if(F==null){const turn=w=>sstep(0,0.14,w)*(1-sstep(0.86,1,w));F=(o.dir||1)<0?1-2*Math.max(turn(tr),turn(bu)):1;}
  if(o.face!=null)F=o.face;
  x+=dx;y+=dy+47.5*s*(1-sc);
  const oo=Object.assign({},o,{face:F,tree:tr,bush:bu,tall:ta,calls:null,dir:1});
  // in the bush: its legs among the leaves
  const hid=bu>0.9&&!o.bs_in&&o.bs_mask==null?sstep(0.9,1,bu)*(1-sstep(0.9,1,ta)):0;
  if(hid>0.01)oo.bs_mask=c=>{const g=c.createLinearGradient(0,6,0,34);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,"+(0.62*hid)+")");c.fillStyle=g;c.fillRect(-60,6,120,80);};
  // turning round: a narrower body, the two facings blended through the middle of the turn
  if(!o.bs_in&&Math.abs(F)<0.55){const k=(0.55-F)/1.1,a=o.a==null?1:o.a;
    bs_mkDraw(ctx,x,y,sv,col,Object.assign({},oo,{face:0.55,turning:1,a:a*(1-k)}),t,i,V);bs_mkDraw(ctx,x,y,sv,col,Object.assign({},oo,{face:-0.55,turning:1,a:a*k}),t,i,V);return;}
  bs_mkDraw(ctx,x,y,sv,col,oo,t,i,V);}
function bs_mkDraw(ctx,x,y,s,col,o,t,i,V){const tr=o.tree||0,bu=o.bush||0,ta=o.tall||0,F=o.face==null?1:o.face,hop=w=>w>0&&w<1?Math.sin(Math.PI*w):0,lp=clamp(1.7*Math.max(hop(tr),hop(bu)),0,1);
  const bx=[-54-34*lp,-42-16*ta-24*lp,46+8*lp,58+50*sstep(0.3,1,tr)];
  if(bs_layered(ctx,x,y,s,o,F<0?[-bx[2],bx[1],-bx[0],bx[3]]:bx,(c,oo)=>bs_mkDraw(c,x,y,s,col,oo,t,i,V)))return;
  const live=t!=null;
  let sit=BS_MK.sit;if(V.P||V.tl||V.H)sit=Object.assign({},sit,V);
  let q=bs_blend(sit,V.pr?Object.assign({},BS_MK.perch,{E:[12,-9],Hn:[15,-25]}):BS_MK.perch,sstep(0.75,1,tr));q=bs_blend(q,BS_MK.crouch,Math.max(sstep(0.65,1,bu),o.look||0));q=bs_blend(q,BS_MK.tall,ta);q=bs_blend(q,BS_MK.leap,lp);
  // while it turns round, it lifts a little and its face comes round toward us
  const tu=o.turning?1:clamp((1-Math.abs(F))/0.45,0,1);
  if(!bs_begin(ctx,x,y-(16*Math.max(hop(tr),hop(bu))+2.5*tu)*s,s,o,F))return;
  const rot=0.35*(F<0?-1:1)*clamp(1.7*hop(tr),0,1);if(rot){ctx.translate(0,20);ctx.rotate(rot);ctx.translate(0,-20);}
  // life: breath, a head that turns and tilts (now and then toward the leopard's side, or toward us), blinks, a grooming hand, the tail
  const idle=(1-lp)*(1-ta*0.5),br=live?1+0.035*Math.sin(TAU*t/(3.1+0.4*i)+i*1.9):1,bl=bs_blink(t,5+i);
  const yd=live?bs_drift(t,21+i,1.9+0.37*i):0,fa0=V.fa,yaw=lerp(clamp(fa0+(fa0<0.8?0.3*yd:0.5*Math.min(0,yd)+0.12*Math.max(0,yd))*idle,0.12,1),0.15,tu);
  const pt=live?0.2*bs_drift(t,41+i,2.5+0.3*i)*idle:0,gr=V.gr&&live?(1-sstep(0,0.3,tr+bu+ta))*Math.max(0,Math.sin(TAU*t/2.3)):0;
  if(gr>0)q=Object.assign({},q,{Hn:[q.Hn[0]-1.5*gr,q.Hn[1]+2.5*gr*Math.sin(TAU*t*1.6)]});
  const hang=sstep(0.75,1,tr)*(1-lp),tl=live?bs_bend(q.tl,(V.tf?0.07:0.14)+0.1*hang,TAU*t/(3.1+0.4*i)+i*2,0.8):q.tl;
  const box=[-30,-40,40,60],cf=mix(col,[130,140,105],0.4),dw=q.dw.map(v=>v*br),vw=q.vw.map(v=>v*br);
  const arm=[[q.S[0]-1,q.S[1]+2],bs_mid(q.S,q.E,0.55),q.E,bs_mid(q.E,q.Hn,0.5),q.Hn],aw=[5.9,5,4.4,3.3,2.9],leg=[q.P,q.K,q.A,q.T],lw=[9.5,5.4,3.1,2.6];
  const arm2=[q.S,q.E2,q.Hn2],leg2=[q.P,q.K2,q.A2,q.T2];
  // the head's frame: yaw 1 in profile, less as it turns toward us (the muzzle shortens, the face comes round, the far eye and cheek show)
  const hp=bs_rot(q.H,q.hp+pt,0.88),m=0.25+0.75*yaw,fx=-(1-yaw)*6;
  const skull=[[-8.5,6],[-10,0],[-8.8,-6],[-3.5,-9.8],[2.5,-10.3],[7,-8.6],[9.8+0.8*m,-6.4],[10.2+1.6*m,-4.7],[11+3.2*m,-3.7],[11.4+4.4*m,-1.4],[11.2+4.2*m,1.2],[9.8+3.2*m,2.8],[8.8+2.4*m,5],[6,7.4],[1,8.8],[-4,8.6]].map(hp);
  const nape=[bs_mid(q.S,q.N,0.2),q.N,hp([-6.8,-1.5])];
  // the far arm and leg (and a tail curled round the feet), behind
  bs_form(ctx,c=>{bs_tube(c,arm2,[4.6,3.4,2.8]);bs_tube(c,leg2,[8,5,2.8,2.4]);if(V.tf)bs_tube(c,tl,[3.2,2.9,2.6,2.2,1.9,1.5]);},col,bs_fill(ctx,cf,0.6,box),0.42,2.2,0);
  // body, head and nape, near leg, near arm and the tail, as one form
  bs_form(ctx,c=>{bs_torso(c,[q.P,q.M,q.S,q.N],dw,vw,7,3);bs_tube(c,nape,[7,6.6,6.2]);bs_loop(c,skull);bs_tube(c,leg,lw);bs_tube(c,arm,aw);
    bs_loop(c,[bs_mid(q.Hn,q.E,0.12),[q.Hn[0]+2.4,q.Hn[1]-1.2],[q.Hn[0]+3.4,q.Hn[1]+1.2],[q.Hn[0]+0.6,q.Hn[1]+2.2]]);if(!V.tf)bs_tube(c,tl,[3.4,3,2.6,2.2,1.8,1.4]);},col,bs_fill(ctx,cf,0,box),1,2.5,8);
  // the tail's dark tip; the grizzled back; the arm against the body; the thigh
  ctx.beginPath();bs_tube(ctx,[bs_mid(tl[4],tl[5],0.05),tl[5]],V.tf?[1.6,1.2]:[1.7,1.35]);ctx.fillStyle="rgba(3,4,8,0.9)";ctx.fill();
  const back=bs_side([q.P,q.M,q.S],[dw[0]*0.7,dw[1]*0.7,dw[2]*0.7],1),fl=[];for(let k=0;k<7;k++){const u=0.12+k*0.12,p=bs_mid(back[u<0.5?0:1],back[u<0.5?1:2],u<0.5?u*2:u*2-1),a=0.9+0.5*hash(k+i*7,3);fl.push([p,[p[0]-2.2*Math.cos(a),p[1]+2.2*Math.sin(a)]]);}
  bs_lines(ctx,fl,mix(col,[255,255,255],0.2),0.28,0.35,0.15);
  const armB=bs_side(arm,aw,1),legT=bs_side(leg,lw,-1);bs_lines(ctx,[[bs_mid(armB[1],armB[2],0.2),armB[2],bs_mid(armB[2],armB[3],0.6)],[bs_mid(legT[0],legT[1],0.45),legT[1],bs_mid(legT[1],legT[2],0.3)]],col,0.38,0.2,0.6);
  // the face: black skin round the eyes and over the short muzzle, a thin white brow band above it, white whiskers down the cheek, and a small
  // dark ear half hidden behind them
  const wh=mix(col,[255,255,255],0.62),fe=fx*0.8;
  const ear=[[-3.8+fx*0.4,-3.2],[-1.6+fx*0.4,-4],[-0.3+fx*0.4,-1.6],[-1+fx*0.4,1.4],[-3.2+fx*0.4,1]].map(hp);ctx.beginPath();bs_loop(ctx,ear);ctx.fillStyle="rgba(10,12,16,0.9)";ctx.fill();bs_lines(ctx,[[ear[4],ear[0],ear[1],ear[2]]],col,0.45,0.35,0.2);
  ctx.beginPath();bs_loop(ctx,[[4.4+fe,-5.4],[7.6+fx*0.4,-6.5],[9.7+0.8*m,-6.1],[10+1.6*m,-4.6],[10.8+3.2*m,-3.6],[11.2+4.4*m,-1.4],[11+4.2*m,1.2],[9.7+3.2*m,2.8],[8.6+2.4*m,4.9],[6.2+fx*0.5,5.2],[4.4+fe,3],[3.8+fe,-1.2]].map(hp));ctx.fillStyle="rgba(3,4,7,0.82)";ctx.fill();bs_lines(ctx,[[hp([10.6+4.2*m,-1.2]),hp([9.8+3.8*m,0.2])]],col,0.35,0.35,0.2);ctx.beginPath();bs_loop(ctx,[[5.6+fx*0.5,5.8],[8.6+2.2*m,5.2],[6.8,7.4],[3.6,8.4],[2.8,6.8]].map(hp));ctx.fillStyle=rgba(wh,0.42);ctx.fill();
  ctx.beginPath();bs_loop(ctx,[[3.6+fe,-5.4],[2.4+fe,-2],[2+fe,2],[3.3+fe,5.6],[5.6+fx*0.5,7.2],[6+fx*0.5,6.2],[4.2+fe,4],[3.6+fe,0],[4+fe,-4.4]].map(hp));ctx.fillStyle=rgba(wh,0.72);ctx.fill();
  const fr=[];for(let k=0;k<5;k++){const u=k/4,p=[lerp(2.8,2.2,u)+fe-0.6*Math.sin(Math.PI*u),lerp(-4.2,6.4,u)],a=Math.PI*0.95-0.9*u;fr.push([hp(p),hp([p[0]+2.2*Math.cos(a),p[1]+2.2*Math.sin(a)])]);}
  bs_lines(ctx,fr,wh,0.5,0.35,0.1);
  bs_lines(ctx,[[hp([3.4+fe,-5.9]),hp([6+fx*0.5,-6.9]),hp([9.2+fx*0.3,-6.2])]],wh,0.85,0.55,0.25);
  if(yaw<0.75){const k=clamp((0.75-yaw)*3,0,1);ctx.beginPath();bs_loop(ctx,[[10.2+m,-4.6],[11.4+2.6*m,-2.4],[12+3.2*m,1.2],[11+2.4*m,4.6],[10.4+2*m,3.4],[10.8+2.4*m,0]].map(hp));ctx.fillStyle=rgba(wh,0.6*k);ctx.fill();}
  bs_lines(ctx,[[hp([10+3.2*m,2.6]),hp([8.2+2.2*m,3.4])]],col,0.3,0.4,0.25);
  const e1=hp([6.4+fx*0.85,-3.4]),e2=hp([9.8+fx*0.25+m*0.6,-3.2]);bs_eye(ctx,e1[0],e1[1],1.2,col,bl);bs_eye(ctx,e2[0],e2[1],1,col,bl,clamp((0.9-yaw)*3.5,0,1));
  ctx.restore();}
/* ---------- leopard (Panthera pardus): a slow stalking walk (a lateral-sequence walk, the diagonal legs nearly together), head low, shoulder
   blades rolling, the long tail low with its tip curled up. Options: t, walk (px walked, negative until the spot where it stops: the feet keep
   time with the ground and it stops with all four planted), flip ---------- */
const BS_LEO={S:74,D:0.78,off:[0,0.3,0.5,0.8],stand:0.54};
function bs_leoFoot(ph,lift){const S=BS_LEO.S,D=BS_LEO.D;ph-=Math.floor(ph);if(ph<D)return[S*D*(0.5-ph/D),0,0];const u=(ph-D)/(1-D),e=u*u*(3-2*u);return[S*D*(e-0.5),-lift*Math.sin(Math.PI*u)*(1-0.25*u),u];}
// the coat, drawn once at 2x for each size and colour, in the body's own units: rosettes (open, broken rings of three or four blotches round a
// tawny centre; large on the flank, smaller and closer toward the spine and the shoulder), small solid spots along the spine and low on the belly
const BS_LEO_TOP=[[-54,-4],[-46,-9.5],[-30,-9.5],[-12,-7.5],[6,-8],[22,-11.4],[31,-12],[42,-8],[52,-4]],BS_LEO_BOT=[[-57,2],[-48,10],[-34,14],[-22,12.5],[-10,14.5],[6,18],[24,22],[38,21],[48,14],[60,11]];
function bs_leoEdge(E,x){for(let k=0;k<E.length-1;k++)if(x<=E[k+1][0])return lerp(E[k][1],E[k+1][1],clamp((x-E[k][0])/(E[k+1][0]-E[k][0]),0,1));return E[E.length-1][1];}
function bs_leoCoat(col,s){const key="leo"+s.toFixed(3)+col.join();if(BS_CACHE[key])return BS_CACHE[key];
  const X0=-56,Y0=-14,W=110,H=38,Z=2*s,c=mkCanvas(Math.ceil(W*Z),Math.ceil(H*Z)),g=c.getContext("2d");g.scale(Z,Z);g.translate(-X0,-Y0);g.lineCap="round";
  const cen=[],arcs=[],spots=[];let n=0;
  for(let j=0;j<6;j++)for(let i=0;i<14;i++){n++;const x=-50+i*7.3+(j%2)*3.65+(hash(n,1)-0.5)*3.2,top=bs_leoEdge(BS_LEO_TOP,x),bot=bs_leoEdge(BS_LEO_BOT,x),y=top+2.2+j*4.7+(hash(n,2)-0.5)*2.6,d=(y-top)/(bot-top);
    if(x<-51||x>45)continue;const sz=(x>24?0.7:x<-42?0.8:1)*(0.8+0.4*hash(n,3));
    if(d<0.13){if(hash(n,4)<0.8)spots.push([x,y+0.6,(0.55+0.35*hash(n,5))*sz]);continue;}
    if(d>0.8){if(d<0.94&&hash(n,4)<0.75)spots.push([x,y,(0.6+0.45*hash(n,5))*sz]);continue;}
    const r=(1.3+2*sstep(0.1,0.5,d))*sz;if(y-r*1.2<top+1.3)continue;
    cen.push([x,y,r*0.62]);const k=hash(n,6)>0.4?4:3,a0=hash(n,7)*TAU;
    for(let q=0;q<k;q++){if(k===4&&hash(n,20+q)<0.15)continue;const rr=r*(0.8+0.42*hash(n,8+q)),a=a0+q*TAU/k+(hash(n,12+q)-0.5)*0.5,sp=TAU/k*(0.5+0.25*hash(n,16+q));arcs.push([x,y,rr,a,a+sp,0.22*r+0.28]);}}
  g.fillStyle=rgba(col,0.12);g.beginPath();for(const [x,y,r] of cen){g.moveTo(x+r,y);g.arc(x,y,r,0,TAU);}g.fill();
  g.strokeStyle=rgba(col,0.66);for(const [x,y,r,a0,a1,w] of arcs){g.beginPath();g.arc(x,y,r,a0,a1);g.lineWidth=w;g.stroke();}
  g.fillStyle=rgba(col,0.62);g.beginPath();for(const [x,y,r] of spots){g.moveTo(x+r,y);g.arc(x,y,r,0,TAU);}g.fill();
  return BS_CACHE[key]={c,X0,Y0,W,H};}
function leopard(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,[-128,-30,96,50],(c,oo)=>leopard(c,x,y,s,col,oo)))return;
  col=col||LEO;const t=o.t,live=t!=null,walk=o.walk==null?0:o.walk;if(!bs_begin(ctx,x,y,s,o))return;
  const ph=BS_LEO.stand+walk/(BS_LEO.S*s),mov=clamp(Math.abs(walk)/(0.4*BS_LEO.S*s),0,1),br=live?Math.sin(TAU*t/3.6):0,bl=bs_blink(t,3);
  const feet=BS_LEO.off.map((d,k)=>bs_leoFoot(ph-d,k%2?6:7)),sc=k=>{const f=((ph-BS_LEO.off[k])%1+1)%1;return f<BS_LEO.D?Math.sin(Math.PI*f/BS_LEO.D):0;};
  const bob=0.9*Math.cos(TAU*2*ph)*mov,sb=1.4+2.2*Math.max(sc(1),sc(3)*0.8),hb=bob*0.3+(live?0.5*bs_drift(t,5,3.2):0);
  const Sj=[34,2+bob*0.6],Hj=[-38,0+bob],box=[-100,-36,80,50],fill=bs_fill(ctx,col,0,box,0.84);
  const fore=(f,dx,gy)=>{const P=[Sj[0]+2+dx+f[0],42+gy+f[1]],sw=Math.sin(Math.PI*f[2]),W=[P[0]-1-4*sw,P[1]-6.5+1.5*sw],E=bs_ik(Sj,W,17,20,1);return{P,W,E,toe:[P[0]+5-3*sw,P[1]+1.4*sw]};};
  const hind=(f,dx,gy)=>{const P=[Hj[0]+4+dx+f[0],42+gy+f[1]],al=f[2]?lerp(0.65,0.2,f[2])+0.35*Math.sin(Math.PI*f[2]):0.2+0.45*clamp(0.5-f[0]/(BS_LEO.S*BS_LEO.D),0,1),
    J=[P[0]-14*Math.sin(al),P[1]-14*Math.cos(al)],K=bs_ik(Hj,J,20,21,-1);return{P,J,K,toe:[P[0]+4.5,P[1]]};};
  const LF=fore(feet[1],0,0),RF=fore(feet[3],3,-1.5),LH=hind(feet[0],0,0),RH=hind(feet[2],3,-1.5);
  const foreT=L=>[[Sj[0]-3,Sj[1]-7],Sj,L.E,L.W,L.P,L.toe],foreW=[8,8.8,6.2,4.4,4.6,4.1],hindT=L=>[[Hj[0]+2,Hj[1]-1],Hj,bs_mid(Hj,L.K,0.5),L.K,L.J,L.P,L.toe],hindW=[10,10.5,9.5,5.8,3.6,4.3,3.9];
  const tw=live?0.12+0.1*(1-mov):0.1,tlp=live?TAU*t/4.2+ph*TAU*0.5:1.2,tail=bs_bend([[-54,-3],[-62,6],[-70,15],[-82,21],[-96,22],[-108,18],[-116,10],[-118,1]],tw,tlp,0.7);
  const hd=[68,4.5+hb],ha=0.08+(live?0.06*bs_drift(t,9,3.8):0),hs=1.08,hp=p=>[hd[0]+hs*(p[0]*Math.cos(ha)-p[1]*Math.sin(ha)),hd[1]+hs*(p[0]*Math.sin(ha)+p[1]*Math.cos(ha))],ef=live?0.4*Math.max(0,bs_drift(t,17,1.7)):0;
  // the far legs, darker, behind the body
  bs_form(ctx,c=>{bs_tube(c,foreT(RF),foreW);bs_tube(c,hindT(RH),hindW);},col,bs_fill(ctx,col,0.6,box,0.85),0.4,2.2,0);
  // body (a deep chest, a tucked flank), near legs, tail and head as one form
  const ey=br*0.5,top=[[-54,-4],[-46,-9.5],[-30,-9.5+bob*0.4],[-12,-7.5+bob*0.6-ey],[6,-8+bob*0.6-ey],[22,-10-sb+bob*0.6],[31,-11-sb*0.8+bob*0.6],[42,-8+bob*0.5],[52,-4+hb*0.6]];
  const bot=[[60,11+hb],[48,14+bob*0.5],[38,21+bob*0.6+ey],[24,22+bob*0.6+ey],[6,18+bob*0.6+ey],[-10,14.5+bob*0.7],[-22,12.5+bob*0.8],[-34,14+bob],[-48,10+bob],[-57,2+bob]];
  const head=[[-11,-2],[-6,-8.5],[3,-9.2],[10,-6.6],[15.5,-3.6],[18.6,-0.3],[18.4,3],[16.6,5.2],[14.6,8.2],[8,10.6],[0,11],[-7,9]].map(hp),ear=[[-8,-7],[-7.6-ef,-11.6],[-5-ef,-13.6],[-2.4,-12.2],[-1.8,-8.4]].map(hp);
  bs_form(ctx,c=>{bs_loop(c,top.concat(bot));bs_tube(c,foreT(LF),foreW);bs_tube(c,hindT(LH),hindW);bs_tube(c,tail,[5,4.4,3.9,3.6,3.4,3.3,3.2,3.1]);bs_loop(c,head);bs_loop(c,ear);},col,fill,1,2.8,8);
  // rosettes on the body (each a broken ring round a tawny centre), solid spots on the legs, belly and head, rings toward the tail's tip
  const coat=bs_leoCoat(col,s);ctx.drawImage(coat.c,coat.X0,coat.Y0+bob*0.6,coat.W,coat.H);
  const dots=[],dot=(p,r)=>{dots.push(p,r);};
  [[0.25,0.3],[0.5,0.55],[0.75,0.45]].forEach(([u,v])=>{dot(bs_mid(Sj,LF.E,u),0.9);dot(bs_mid(LF.E,LF.W,v),0.75);dot(bs_mid(Hj,LH.K,u*0.9),1);dot(bs_mid(LH.K,LH.J,v),0.75);});
  [[-2,-6],[2,-7],[5.5,-6],[-4,-3],[1,-4.5],[4,3],[7,2],[13,3.8],[14.8,2.8],[12.2,5.2]].forEach(p=>dot(hp(p),0.5));
  ctx.beginPath();for(let k=0;k<dots.length;k+=2){const p=dots[k],r=dots[k+1];ctx.moveTo(p[0]+r,p[1]);ctx.arc(p[0],p[1],r,0,TAU);}ctx.fillStyle=rgba(col,0.66);ctx.fill();
  const rings=[];for(let k=2;k<7;k++){const a=tail[k],b=tail[k+1],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,m=bs_mid(a,b,0.5),w=3.2;
    if(k<4)rings.push([[m[0]+nx*w*0.6,m[1]+ny*w*0.6],[m[0]+nx*w*0.1+dx/d*1.2,m[1]+ny*w*0.1+dy/d*1.2]]);else rings.push([[m[0]+nx*w*0.95,m[1]+ny*w*0.95],[m[0]+dx/d*1.1,m[1]+dy/d*1.1],[m[0]-nx*w*0.95,m[1]-ny*w*0.95]]);}
  bs_lines(ctx,rings,col,0.66,0.9,0.5);
  // the shoulder blade and the thigh rolling under the skin; mouth, chin, cheek and nose
  bs_lines(ctx,[[[Sj[0]-6,Sj[1]-11-sb*0.5],[Sj[0]-6.5,Sj[1]-4],[Sj[0]-3,Sj[1]+5]],[[Hj[0]+10,Hj[1]+13],[Hj[0]+12.5,Hj[1]+3],[Hj[0]+9,Hj[1]-7]]],col,0.4,0.2,0.7);
  bs_lines(ctx,[[hp([16.6,5]),hp([13.8,5.9]),hp([11,5.4])],[hp([14.3,8]),hp([11.5,7.3])],[hp([8,10.4]),hp([2,7.4]),hp([-3,3])]],col,0.5,0.55,0.25);
  const ns=[hp([18.8,-0.6]),hp([16.8,-0.8]),hp([17.8,1.4])];ctx.beginPath();ctx.moveTo(ns[0][0],ns[0][1]);ctx.lineTo(ns[1][0],ns[1][1]);ctx.lineTo(ns[2][0],ns[2][1]);ctx.closePath();ctx.fillStyle=rgba(col,0.75);ctx.fill();
  const ep=hp([8.2,-3.4]);bs_eye(ctx,ep[0],ep[1],1.65,col,bl);
  ctx.restore();}

/* ---------- snake: a heavy python-like snake in the grass, the front of its body raised, its head broader than its neck, tasting the air with a
   forked tongue (snakes have no eyelids: the eye stays open); its body lies along its own winding track and tapers to a fine tail. Options: t, crawl (seconds it has been gliding forward along that track), flip ---------- */
function bs_snkPath(){if(BS_CACHE.snk)return BS_CACHE.snk;const P=[];let x=0,y=0;for(let k=0;k<=400;k++){const th=1.05*Math.sin(k*2*TAU/74+0.6);P.push([x,y]);x+=2*Math.cos(th);y+=2*Math.sin(th)*0.62;}return BS_CACHE.snk=P;}
function snake(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,[-100,-40,150,32],(c,oo)=>snake(c,x,y,s,col,oo)))return;
  col=col||SNK;const t=o.t,live=t!=null;if(!bs_begin(ctx,x,y,s,o))return;
  const P=bs_snkPath(),L=150,h0=420+clamp(o.crawl||0,-4,40)*4.5,at=g=>{const k=clamp(g/2,0,P.length-1.001),i=Math.floor(k),f=k-i;return[P[i][0]+(P[i+1][0]-P[i][0])*f,P[i][1]+(P[i+1][1]-P[i][1])*f];};
  const H=at(420),N=36,sp=[],w=[],br=live?1+0.03*Math.sin(TAU*t/3.4):1,wob=live?0.9*Math.sin(TAU*t/5.2):0,nod=live?1.5*bs_drift(t,31,2.2):0;
  const k9=Math.round(N*0.86),p9=at(h0-0.86*L),p8=at(h0-0.84*L),g9=[p9[0]-p8[0],p9[1]-p8[1]];
  for(let k=0;k<=N;k++){const u=k/N,e=sstep(0.86,1,u);let p=at(h0-u*L);if(e>0){const q=[p9[0]+g9[0]*(u-0.86)/0.02,p9[1]+g9[1]*(u-0.86)/0.02*0.4];p=bs_mid(p,q,e);}
    const lift=u<0.24?Math.pow(1-u/0.24,2)*(12+nod):0;sp.push([p[0]-H[0]+66,p[1]-H[1]+4-lift+wob*Math.sin(u*9)*u*(1-e)]);
    w.push(Math.max(0.3,(u<0.08?3.3+u*18.75:u<0.4?4.8+(u-0.08)*8.4:u<0.7?7.5-(u-0.4)*3:0.3+6.3*Math.pow(1-(u-0.7)/0.3,1.25))*br));}
  const hd=sp[0],nk=sp[2],ang=Math.atan2(hd[1]-nk[1],hd[0]-nk[0])*0.5+(live?0.06*bs_drift(t,33,1.9):0),hp=p=>[hd[0]+p[0]*Math.cos(ang)-p[1]*Math.sin(ang),hd[1]+p[0]*Math.sin(ang)+p[1]*Math.cos(ang)];
  const head=[[-7.5,-3.6],[-2.5,-5.4],[3.5,-5.6],[9.5,-4.2],[14,-1.6],[14.8,0.9],[13,3.2],[6.5,4.9],[-1.5,5.6],[-7.5,3.8]].map(hp),box=[-40,-30,40,30];
  bs_form(ctx,c=>{bs_tube(c,sp.slice(1),w.slice(1));bs_loop(c,head);},col,bs_fill(ctx,col,0,box),1,2.5,9);
  // the pattern: irregular dark saddles across the back, each with a fine pale edge, smaller blotches low on the flank, the edge of the belly scales
  const sad=new Path2D();for(let k=4;k<N-4;k+=3){const j=k+Math.round(hash(k,44)-0.5),a=sp[j-1],b=sp[j+1],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,tx=dx/d,ty=dy/d,nx=-ty,ny=tx,ww=w[j],m=sp[j];
    const ln=ww*(0.45+0.25*hash(k,41)),dp=ww*(0.52+0.22*hash(k,42)),q=[];for(let i=0;i<7;i++){const a2=i/7*TAU,r=0.75+0.4*hash(k*7+i,43);q.push([m[0]+nx*ww*0.3+(tx*Math.cos(a2)*ln+nx*Math.sin(a2)*dp)*r,m[1]+ny*ww*0.3+(ty*Math.cos(a2)*ln+ny*Math.sin(a2)*dp)*r]);}
    bs_loop(sad,q);if(k+5<N-4&&hash(k,45)>0.3){const c=bs_mid(sp[j+1],sp[j+2]),r=ww*(0.2+0.12*hash(k,46)),q2=[];for(let i=0;i<5;i++){const a2=i/5*TAU;q2.push([c[0]-nx*ww*0.5+Math.cos(a2)*r*1.5*(0.8+0.4*hash(i,k)),c[1]-ny*ww*0.5+Math.sin(a2)*r]);}bs_loop(sad,q2);}}
  ctx.fillStyle=rgba(mix(col,[0,0,0],0.72),0.45);ctx.fill(sad);ctx.lineWidth=1/s;ctx.strokeStyle=rgba(col,0.34);ctx.stroke(sad);
  bs_lines(ctx,[bs_side(sp.slice(4,N-2),w.slice(4,N-2).map(v=>v*0.62),-1)],col,0.3,0.5,0.3);
  // brow ridge, mouth, eye
  bs_lines(ctx,[[hp([5,-3.9]),hp([8,-4.1]),hp([10.8,-3.2])],[hp([13.6,2.2]),hp([9,2.9]),hp([4.5,2.6])]],col,0.5,0.5,0.25);
  // the forked tongue, flicking now and then
  if(live){const P2=2.3,u=((t+0.7)%P2+P2)%P2;if(u<0.55){const e=Math.sin(Math.PI*u/0.55),f=Math.sin(u*TAU*5)*0.9,b=hp([14.4,1.2]),m=hp([14.4+6*e,1.2+f*0.6]),f1=hp([14.4+9.5*e,-0.5+f]),f2=hp([14.4+9.5*e,2.9+f]);
    bs_lines(ctx,[[b,m,f1],[m,f2]],mix(col,[255,120,140],0.55),0.95,0.7,0.3);}}
  const ep=hp([7.8,-2.2]);bs_eye(ctx,ep[0],ep[1],1.35,col,1);
  ctx.restore();}

/* ---------- bottlenose dolphin (Tursiops): a short thick rostrum, a rounded melon, a tall curved dorsal fin, long swept-back flippers, a
   narrow tail stock and horizontal flukes, seen almost edge-on, that beat up and down; a darker cape. Options: t (a slow swimming stroke, the
   body bobbing and bending with it) ---------- */
// along the body from the beak's tip (0) to the flukes' root (1): the depth above and below the midline
const BS_DOL=[[0,1.3,1.3],[0.03,2.7,2.6],[0.062,3.6,3.8],[0.09,8,5.6],[0.125,13.5,8.7],[0.17,17.5,12],[0.24,20.5,15.6],[0.34,22,18.2],[0.44,21.2,17.9],[0.52,19.4,16.4],
  [0.6,16.2,13.6],[0.68,12.2,10.4],[0.76,8.4,7.2],[0.84,5.4,4.6],[0.92,3.6,3],[1,2.7,2.3]];
function dolphin(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,o.flip?[-90,-48,104,50]:[-104,-48,90,50],(c,oo)=>dolphin(c,x,y,s,col,oo)))return;
  col=col||[120,210,255];const t=o.t,live=t!=null;if(!bs_begin(ctx,x,y,s,o))return;
  const ph=live?t*TAU/2.8:0.9,bob=live?1.6*Math.sin(ph+1.1):0,X=u=>80-158*u,C=u=>-4*Math.sin(Math.PI*u)+0.8+bob+(0.6+5.5*Math.pow(u,2.4))*Math.sin(ph-2.3*u);
  const top=BS_DOL.map(([u,a])=>[X(u),C(u)-a]),bot=BS_DOL.map(([u,a,b])=>[X(u),C(u)+b]).reverse(),R=[X(1)+0.5,C(1)],box=[-96,-32,82,34],fill=bs_fill(ctx,col,0,box,0.88);
  // the flukes: a thin blade behind the tail stock, tilting with the stroke; as it tilts we see a little more of it, and of the far fluke under it
  const st=Math.sin(ph-2.3),fa=-0.42*Math.cos(ph-2.3)-0.05,th=0.55+0.6*Math.abs(Math.cos(ph-2.3)),fp=p=>[R[0]+p[0]*Math.cos(fa)-p[1]*th*Math.sin(fa),R[1]+p[0]*Math.sin(fa)+p[1]*th*Math.cos(fa)];
  const flk=[[1,-2.4],[-5,-3.4],[-11.5,-4.6],[-17.5,-5],[-22,-3.8],[-20.4,-1.2],[-16.2,0.4],[-12.6,1],[-7,1.9],[1,2.2]].map(fp),flk2=[[-6,1.4],[-12,2.8],[-17.5,4.2],[-20,4.4],[-17.2,2.6],[-12,1.6]].map(fp);
  const tp=u=>{let k=0;while(k<BS_DOL.length-2&&BS_DOL[k+1][0]<u)k++;const a=BS_DOL[k],b=BS_DOL[k+1],f=(u-a[0])/(b[0]-a[0]);return[lerp(a[1],b[1],f),lerp(a[2],b[2],f)];},T=u=>C(u)-tp(u)[0];
  const dorsal=[[X(0.39),T(0.39)+1.5],[X(0.44),T(0.44)-6],[X(0.49),T(0.5)-13],[X(0.555),T(0.56)-17.5],[X(0.585),T(0.58)-16],[X(0.575),T(0.58)-9],[X(0.58),T(0.6)-3],[X(0.6),T(0.6)+1.5]];
  // the flippers: long, swept back about 35 degrees, hanging well below the belly; the stroke sways them a little
  const y0=C(0.23)+tp(0.23)[1]*0.35,sw=0.08*st,fl=(r,ln,wd)=>{const a=0.61+sw,d=[-Math.sin(a),Math.cos(a)],n=[Math.cos(a),Math.sin(a)],P=(u,v)=>[r[0]+d[0]*u+n[0]*v,r[1]+d[1]*u+n[1]*v];
    return[P(-2,wd),P(ln*0.42,wd*0.9),P(ln*0.8,wd*0.5),P(ln,-0.05*wd),P(ln*0.8,-0.62*wd),P(ln*0.4,-0.9*wd),P(-2,-wd)];};
  // the far flipper and the far fluke, behind
  bs_form(ctx,c=>{bs_loop(c,fl([X(0.25),y0+1.2],19,3.4));bs_loop(c,flk2);},col,bs_fill(ctx,col,0.6,box,0.9),0.4,2,0);
  // body, dorsal fin and flukes as one form; the near flipper lies over the flank
  bs_form(ctx,c=>{bs_loop(c,top.concat(flk.slice(1,9),bot));bs_loop(c,dorsal);},col,fill,1,2.6,9);
  const f0=fl([X(0.215),y0-1.5],25,4.2);bs_form(ctx,c=>bs_loop(c,f0),col,fill,0.9,2.3,0);
  // mouth line, melon crease, blowhole, the cape of the back, the flipper against the flank, the fluke's leading edge
  bs_lines(ctx,[[[X(0.012),C(0.012)+0.3],[X(0.05),C(0.05)+0.9],[X(0.085),C(0.085)+1.6],[X(0.105),C(0.105)+0.6]]],col,0.75,0.75,0.35);
  bs_lines(ctx,[[[X(0.066),C(0.066)-3.4],[X(0.075),C(0.075)-1.6]],[[X(0.165),T(0.165)+1.2],[X(0.178),T(0.178)+1]]],col,0.5,0.5,0.3);
  bs_lines(ctx,[[[X(0.13),C(0.13)-7],[X(0.2),C(0.2)-4.3],[X(0.32),C(0.32)-1.6],[X(0.46),C(0.46)+1.6],[X(0.62),C(0.62)+0.8],[X(0.76),C(0.76)-0.8],[X(0.88),C(0.88)-0.3]]],col,0.42,0.25,0.6);
  bs_lines(ctx,[[bs_mid(f0[0],f0[6],0.5),bs_mid(f0[1],f0[5],0.5),bs_mid(f0[2],f0[4],0.5)],[flk[1],flk[3],flk[4]]],col,0.45,0.2,0.5);
  bs_eye(ctx,X(0.118),C(0.118)-1.2,1.5,col,bs_blink(t,4));
  ctx.restore();}

/* ---------- African elephant (Loxodonta africana): great ears shaped like the continent, a high shoulder and a dipping back, pillar legs on broad
   flat soles with toenails, a long wrinkled trunk, tusks; options: t (the ear fans, the trunk sways and curls, the tail swishes, it blinks). With t,
   the body and legs, which don't move, are drawn once and kept ---------- */
function elephant(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,o.flip?[-82,-62,76,46]:[-76,-62,82,46],(c,oo)=>elephant(c,x,y,s,col,oo)))return;
  col=col||[190,200,220];const t=o.t,live=t!=null;if(!bs_begin(ctx,x,y,s,o))return;
  const ef=live?0.5-0.5*Math.cos(TAU*t/4.6):0.3,bl=bs_blink(t,6),box=[-64,-56,64,42],fill=bs_fill(ctx,col,0,box,0.9);
  const trunk=bs_bend([[57,-26],[61.5,-12],[63,3],[62,17],[63,28],[66.5,35],[71,34]],live?0.16:0.1,live?TAU*t/5.3:1,0.7),tw=[7.4,6.1,5.1,4.3,3.7,3.2,2.7];
  const tail=bs_bend([[-60,-25],[-65,-12],[-66.5,1],[-66,9]],live?0.28:0.15,live?TAU*t/3.1:1,0.9);
  // the tail and the trunk, under the body and head (their roots hide there)
  bs_form(ctx,c=>{bs_tube(c,tail,[1.8,1.4,1.15,1]);bs_loop(c,[[tail[3][0]-1.6,tail[3][1]-1],[tail[3][0]+1.8,tail[3][1]-0.6],[tail[3][0]+1.3,tail[3][1]+4.6],[tail[3][0]-0.9,tail[3][1]+5.4]]);bs_tube(c,trunk,tw);},col,fill,1,2.6,6);
  const wr=[];for(let k=2;k<trunk.length-1;k++)for(const f of [0.15,0.45,0.75]){const a=bs_mid(trunk[k-1],trunk[k],f),b=trunk[k],dx=b[0]-trunk[k-1][0],dy=b[1]-trunk[k-1][1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,ww=lerp(tw[k-1],tw[k],f)*0.82;
    wr.push([[a[0]+nx*ww,a[1]+ny*ww],[a[0]+dx/d*0.9,a[1]+dy/d*0.9],[a[0]-nx*ww*0.55,a[1]-ny*ww*0.55]]);}
  bs_lines(ctx,wr,col,0.38,0.5,0.2);
  // body, legs, head and tusk: still, so drawn once
  const draw=live&&!o.bs_nostill?(c,fn)=>bs_still(c,"ele"+col.join(),[-72,-58,76,43],fn):(c,fn)=>fn(c);
  draw(ctx,g=>bs_eleBody(g,col,box));
  // the ear, fanning out from the side of the head, and its veins
  ctx.save();ctx.translate(35,0);ctx.scale(1-0.16*ef,1);ctx.rotate(-0.03*ef);ctx.translate(-35,0);
  bs_form(ctx,c=>bs_loop(c,[[35,-51],[24,-57.5],[9,-55.5],[-1,-47],[-3.5,-32],[0.5,-18],[6.5,-6],[12.5,7.5],[18.5,1.5],[25,-9],[31,-20],[35,-36]]),col,bs_fill(ctx,col,0,[-10,-58,40,8],0.9),1,2.6,7);
  bs_lines(ctx,[[[31,-46],[22,-44],[12,-40],[6,-30]],[[30,-34],[20,-28],[12,-16],[13,-2]],[[22,-44],[17,-34],[10,-26]],[[24,-50],[14,-51],[5,-46]]],col,0.34,0.5,0.2);
  bs_lines(ctx,[[[34,-48],[33,-34],[30,-22],[24,-9]]],col,0.5,0.8,0.3);
  ctx.restore();
  // eye, with its fold, and the mouth under the trunk
  bs_eye(ctx,50.5,-34,1.45,col,bl);bs_lines(ctx,[[[46.5,-37.5],[50.5,-38.8],[54,-37]],[[56,-14],[52,-13],[48,-14]]],col,0.5,0.5,0.25);
  ctx.restore();}
// the still part: far legs; body (high shoulder, dipping back, rounded rump, the belly sagging a little), near legs on broad flat soles, the head;
// the tusk; wrinkles at the knees and ankles, folds on the shoulder, behind the elbow and on the belly; toenails
function bs_eleBody(ctx,col,box){
  const leg=(c,p,w,fx)=>{bs_tube(c,p,w);bs_loop(c,[[fx-8.8,31.5],[fx+8.8,31.5],[fx+10.6,37.2],[fx+9.8,40],[fx-9.8,40],[fx-10.6,37.2]]);};
  const legs=[[[18,-12],[20,8],[21,20],[21.3,30.5]],[[-44,-14],[-42,8],[-43.5,20],[-43,30.5]]],lw=[[12,9.4,8.6,9.6],[13,9.8,8.6,9.6]];
  bs_form(ctx,c=>{leg(c,[[8,-10],[9,10],[10,21],[9.8,30]],[10,8.2,7.6,8.6],9.8);leg(c,[[-52,-12],[-51,10],[-53,21],[-52.2,30]],[11,8.4,7.6,8.6],-52.2);},col,bs_fill(ctx,col,0.6,box,0.95),0.4,2.2,0);
  const body=[[-62,-12],[-60,-28],[-50,-41],[-32,-44],[-14,-41],[2,-45],[16,-50],[28,-49],[37,-43],[40,-12],[32,3],[20,8.5],[4,11.5],[-12,11.5],[-32,7],[-50,2],[-60,-4]];
  const head=[[30,-50],[40,-54],[50,-51],[56.5,-42],[59.5,-32],[60,-22],[55,-13],[45,-12],[37,-17],[32,-32]];
  bs_form(ctx,c=>{bs_loop(c,body);legs.forEach((p,k)=>leg(c,p,lw[k],p[3][0]));bs_loop(c,head);},col,bs_fill(ctx,col,0,box,0.9),1,2.6,10);
  ctx.beginPath();bs_tube(ctx,[[55,-16],[59.5,-9],[65.5,-5],[71,-6.5]],[2.3,2.1,1.6,0.5]);glow(ctx,64,-7,7,col,0.25);ctx.fillStyle=rgba(mix(col,[255,248,230],0.7),0.95);ctx.fill();
  const wr=[];legs.forEach(p=>{const a=bs_mid(p[1],p[2],0.7),b=bs_mid(p[2],p[3],0.55);wr.push([[a[0]-6.5,a[1]+0.5],[a[0],a[1]+1.3],[a[0]+6,a[1]+0.3]],[[a[0]-5.5,a[1]+3.2],[a[0],a[1]+3.8],[a[0]+5,a[1]+3]],[[b[0]-6.5,b[1]],[b[0],b[1]+0.8],[b[0]+6,b[1]+0.2]]);});
  wr.push([[-4,-34],[-2,-22],[-5,-10]],[[-18,8.5],[-8,7],[4,8]],[[34,-40],[35,-30],[33,-20]],[[28,-3],[25,2.5],[24.5,8]],[[-36,-2],[-38,4]]);
  bs_lines(ctx,wr,col,0.38,0.55,0.2);
  ctx.beginPath();legs.forEach(p=>{const f=p[3][0];for(let k=0;k<3;k++){const nx=f+0.5+k*3.6,r=1.5+0.2*k;ctx.moveTo(nx+r,39);ctx.arc(nx,39,r,0,Math.PI,true);}});ctx.lineWidth=0.9/BS_ST.s;ctx.strokeStyle=rgba(col,0.45);ctx.stroke();}

/* ---------- common marmoset (Callithrix jacchus): a small monkey hunched on a branch, its head (a little wider than tall, sunk into the
   shoulders) turned toward us: a dark brown face with paler rings round the eyes, a white blaze on the forehead, fans of white fur round the ears;
   a grizzled, barred back; a long tail ringed pale and dark; claws gripping the branch. Options: t (breath, a head that tilts and turns, blinks,
   the ear tufts stirring, the tail swaying) ---------- */
function marmoset(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,[-80,-50,80,62],(c,oo)=>marmoset(c,x,y,s,col,oo)))return;
  col=col||[230,210,180];const t=o.t,live=t!=null;if(!bs_begin(ctx,x,y,s,o))return;
  const Z=1.16;ctx.translate(0,40);ctx.scale(Z,Z);ctx.translate(0,-40);BS_ST.s=s*Z;
  const br=live?1+0.04*Math.sin(TAU*t/2.6):1,tilt=live?0.16*bs_drift(t,51,1.9):0.06,turn=live?0.5+0.5*bs_drift(t,53,2.6):0.5,bl=bs_blink(t,9),box=[-40,-40,40,50],fill=bs_fill(ctx,col,0,box,0.85);
  // the branch, with a twig: still
  const brn=c=>bs_form(c,g=>{bs_tube(g,[[-66,45],[-36,41.5],[-6,40.5],[26,42],[62,39.5]],[2.6,3.6,4,3.6,2.8]);bs_tube(g,[[34,41.5],[44,34],[50,31]],[2,1.4,0.9]);},col,bs_fill(c,col,0.5,box),0.4,2,0);
  if(live&&!o.bs_in)bs_still(ctx,"mbr"+col.join(),[-70,28,66,50],brn);else brn(ctx);
  const tl=bs_bend([[-11,32],[-17,40.5],[-25,46.5],[-35,50],[-45.5,50.5],[-54.5,47.5],[-59.5,41.5],[-58,35.5]],live?0.08:0.04,live?TAU*t/3.7:0.5,0.8),tw=[3.4,3.3,3.2,3.1,3,2.8,2.5,2.1];
  const P=[-6,31],M=[-11,16],S=[-2,1],N=[3,-3],leg=[P,[10,23],[4.5,35.5],[11.5,38.5]],arm=[[S[0]+1,S[1]+2],[5,16],[11.5,32.5],[15.5,37.5]],aw=[4.4,3.3,2.3,2.2];
  const H=[8.5,-12],hp=bs_rot(H,tilt),fx=(turn-0.5)*2.4;
  const skull=[[-10.8,1.5],[-10,-4.6],[-6.2,-8.3],[0,-9],[6.2,-8.3],[10,-4.6],[10.8,1.5],[8.6,5.8],[4.4,8.4],[1.4+fx*0.3,10.2],[-1.4+fx*0.3,10.2],[-4.4,8.4],[-8.6,5.8]].map(hp);
  // the white fans of fur round the ears, behind the head, stirring a little
  const tu=live?0.07*Math.sin(TAU*t/2.2):0,wh=mix(col,[255,255,255],0.72),fan=sd=>{const q=[[7.6,-6.8],[11.6,-12.2],[14+tu*16,-14.6],[16.2,-12.8],[18.6,-12.4+tu*10],[19.4,-9.4],[21,-7],[20.4,-4.2+tu*6],[21,-1.2],[18.8,1.2],[17.6,3.6],[14.2,3],[10,3.4]].map(p=>hp([sd*(p[0]+(sd>0?fx:-fx)*0.3),p[1]]));return q;};
  for(const sd of [-1,1]){const q=fan(sd);ctx.beginPath();bs_loop(ctx,q);ctx.fillStyle=rgba(wh,0.7);ctx.fill();
    const c0=hp([sd*9,-2]),L=[];for(let k=0;k<4;k++){const a=-1.1+k*0.62,r=8.5+2*Math.sin(k*1.7);L.push([c0,[c0[0]+sd*Math.cos(a)*r*0.55,c0[1]+Math.sin(a)*r*0.55],[c0[0]+sd*Math.cos(a)*r,c0[1]+Math.sin(a)*r]]);}bs_lines(ctx,L,wh,0.9,0.35,0.12);}
  // the far arm and leg, behind
  bs_form(ctx,c=>{bs_tube(c,[[S[0]+3,S[1]+3],[12,17],[18,34],[21,38.5]],[4,2.9,2.1,2]);bs_tube(c,[P,[12.5,26],[8,36.5],[15,39.5]],[7,4,2.3,2]);},col,bs_fill(ctx,col,0.6,box),0.4,2,0);
  // body, head, near limbs and the tail, as one form
  bs_form(ctx,c=>{bs_torso(c,[P,M,S,N],[10*br,8.5*br,7,5.5],[9*br,9*br,8,6],6,3);bs_loop(c,skull);bs_tube(c,leg,[7.5,4.4,2.6,2.1]);bs_tube(c,arm,aw);bs_tube(c,tl,tw);},col,fill,1,2.4,8);
  // pale rings round the dark tail, bars across the back, the arm and thigh against the body, claws over the branch
  const bands=[];for(let k=0;k<tl.length-1;k++)for(const f of [0.2,0.7]){const a=bs_mid(tl[k],tl[k+1],f),dx=tl[k+1][0]-tl[k][0],dy=tl[k+1][1]-tl[k][1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,ww=lerp(tw[k],tw[k+1],f)*0.88;
    bands.push([[a[0]+nx*ww,a[1]+ny*ww],[a[0]+dx/d*0.7,a[1]+dy/d*0.7],[a[0]-nx*ww,a[1]-ny*ww]]);}
  bs_lines(ctx,bands,wh,0.62,1.05,0.8);
  const bars=[];for(let k=0;k<5;k++){const a=bs_mid(P,M,0.12+k*0.2),dx=M[0]-P[0],dy=M[1]-P[1],d=Math.hypot(dx,dy),nx=dy/d,ny=-dx/d;bars.push([[a[0]+nx*9,a[1]+ny*9],[a[0]+nx*5+dx/d,a[1]+ny*5+dy/d],[a[0]+nx*1.5,a[1]+ny*1.5]]);}
  bs_lines(ctx,bars,mix(col,[255,255,255],0.25),0.42,0.6,0.2);
  const lt=bs_side(leg,[7.5,4.4,2.6,2.1],-1),ab=bs_side(arm,aw,1);bs_lines(ctx,[[bs_mid(lt[0],lt[1],0.4),lt[1]],[bs_mid(ab[0],ab[1],0.35),ab[1],bs_mid(ab[1],ab[2],0.5)],
    [[16.5,37.8],[18,39.6],[17.4,41.6]],[[12.6,38.9],[13.8,40.8],[13,42.4]]],col,0.5,0.3,0.25);
  // the face: dark brown, paler round the eyes, a white blaze above, a small dark muzzle with its nostrils
  ctx.beginPath();bs_loop(ctx,[[-7.4+fx,-2.6],[-3.6+fx,-5.2],[0+fx,-4.4],[3.6+fx,-5.2],[7.4+fx,-2.6],[7.8+fx,2.2],[4.6+fx,6.8],[0+fx,8.6],[-4.6+fx,6.8],[-7.8+fx,2.2]].map(hp));ctx.fillStyle="rgba(24,16,12,0.8)";ctx.fill();
  ctx.beginPath();for(const sd of [-1,1]){const e=hp([sd*3.5+fx,-1.2]);ctx.moveTo(e[0]+2.5,e[1]);ctx.arc(e[0],e[1],2.5,0,TAU);}ctx.fillStyle=rgba(mix(col,[120,90,60],0.4),0.26);ctx.fill();
  ctx.beginPath();bs_loop(ctx,[[0+fx*0.8,-8.6],[1.4+fx*0.8,-6.4],[0.9+fx*0.9,-3.6],[0+fx,-2.8],[-0.9+fx*0.9,-3.6],[-1.4+fx*0.8,-6.4]].map(hp));ctx.fillStyle=rgba(wh,0.92);ctx.fill();
  ctx.beginPath();bs_loop(ctx,[[-2.2+fx,3.2],[2.2+fx,3.2],[1.6+fx,5.6],[-1.6+fx,5.6]].map(hp));ctx.fillStyle="rgba(8,6,6,0.75)";ctx.fill();
  ctx.beginPath();for(const sd of [-1,1]){const n=hp([sd*0.8+fx,3.9]);ctx.moveTo(n[0]+0.45,n[1]);ctx.arc(n[0],n[1],0.45,0,TAU);}ctx.fillStyle=rgba(col,0.55);ctx.fill();
  for(const sd of [-1,1]){const e=hp([sd*3.5+fx,-1.2]);bs_eye(ctx,e[0],e[1],1.1,col,bl);}
  ctx.restore();}
/* ---------- European rabbit (Oryctolagus cuniculus): options.run 0 sits alert, 1 runs a half-bound (the hind feet land together ahead of the
   front feet's prints, the back rounds and stretches, the ears lie back, the white scut shows); in between it lollops. options.dist, the px it
   has travelled, keeps its feet in step with the ground (it gets up from sitting over its first stride); without it the gait keeps time with t ---------- */
const BS_RB={S:96,hd:0.36,fd:0.3,fo:0.44,hl:4,fl:34,f0:1.44};
// hip and shoulder joints, the back's arch, the neck (the head's centre from the shoulder), the head's tilt, the ears (tilt back; the far one's
// spread forward), the tail cocked
const BS_RB_SIT={H:[-10,6],S:[14,-4],ar:8,nk:[15,-17],ha:0.3,ea:0.16,es:0.42,tu:0};
const BS_RB_RUN=[ // phase 0: the hind feet land
  [0,   {H:[-6,-1], S:[16,-6], ar:7, nk:[15,-15],ha:0.42,ea:0.72,es:0.3,tu:1}],
  [0.18,{H:[-8,-8], S:[21,-10],ar:3, nk:[15,-15],ha:0.38,ea:0.78,es:0.3,tu:1}],
  [0.36,{H:[-9,-14],S:[25,-13],ar:-1,nk:[14,-14],ha:0.32,ea:0.84,es:0.3,tu:1}],
  [0.43,{H:[-10,-16],S:[25,-12],ar:-1,nk:[14,-14],ha:0.36,ea:0.82,es:0.3,tu:1}],
  [0.52,{H:[-10,-13],S:[23,-8], ar:1, nk:[15,-15],ha:0.44,ea:0.78,es:0.3,tu:1}],
  [0.66,{H:[-8,-8], S:[20,-6], ar:4, nk:[15,-16],ha:0.48,ea:0.74,es:0.3,tu:1}],
  [0.78,{H:[-6,-7], S:[18,-8], ar:6, nk:[15,-16],ha:0.46,ea:0.72,es:0.3,tu:1}],
  [0.89,{H:[-6,-8], S:[17,-10],ar:8, nk:[15,-16],ha:0.44,ea:0.72,es:0.3,tu:1}]];
// a foot through one cycle (ph from its touchdown): planted for d of it and sliding back at the ground's speed, then a swing that trails, swings
// through, reaches and settles back; returns [x, y, stance progress (0..1) or swing progress (-1..0)]
function bs_rbFoot(ph,d,land,h){ph-=Math.floor(ph);const S=BS_RB.S;if(ph<d)return[land-S*ph,24,ph/d];const u=(ph-d)/(1-d),lift=land-S*d,B=S*(1-d)/Math.PI,sn=Math.sin(Math.PI*u);
  return[lift+(land-lift)*u*u*(3-2*u)-B*sn*(1-u)*(1-u)+B*sn*u*u,24-h*sn,-Math.max(1e-4,u)];}
const BS_RB_HA=[[0,2.05],[0.25,2.45],[0.45,2],[0.65,0.9],[0.85,0.3],[1,0.1]],BS_RB_FA=[[0,1.9],[0.2,2.3],[0.5,1.75],[0.8,0.55],[1,0.2]];
function rabbit(ctx,x,y,s,col,t,o){o=o||{};if(bs_layered(ctx,x,y,s,o,[-56,-80,62,32],(c,oo)=>rabbit(c,x,y,s,col,t,oo)))return;
  col=col||[230,220,200];const R=BS_RB,tt=t||0,live=t!=null,hasD=o.dist!=null;let run=clamp(o.run==null?1:o.run,0,1);if(hasD)run*=sstep(0,0.4*R.S*s,o.dist);
  if(!bs_begin(ctx,x,y,s,o))return;
  const ph=hasD?o.dist/(R.S*s):tt*R.f0+0.05,q=run>0?bs_blend(BS_RB_SIT,bs_gait(BS_RB_RUN,ph),run):BS_RB_SIT;
  const sniff=live?(1-run)*Math.max(0,Math.sin(TAU*tt*2.4))*Math.max(0,bs_drift(tt,63,1.3)):0,ew=live?0.07*bs_drift(tt,61,1.6)*(1-run)+0.05*Math.sin(TAU*(ph-0.15))*run:0,bl=bs_blink(live?tt:null,14);
  const br=live?(1-run)*0.6*Math.sin(TAU*tt/1.7):0;
  const H=q.H,S=q.S,th=Math.atan2(S[1]-H[1],S[0]-H[0]),L=Math.hypot(S[0]-H[0],S[1]-H[1]),lp=bs_rot(H,th),ar=q.ar;
  // the body: a round haunch behind, a deep chest in front, the back rounded (more when it bunches)
  const torso=[[-3,15+br*0.3],[-13,8],[-15.5,-2],[-10,-10.5-br*0.3],[L*0.36,-12.5-ar-br],[L*0.72,-12-ar*0.5-br*0.6],[L+2,-9.5],[L+7.5,-3],[L+8,5],[L+2,11],[L*0.55,12.5-ar*0.2+br*0.5],[L*0.18,15.5]].map(lp);
  // the head: a blunt muzzle, a rounded brow, the cheek full; the neck is part of the body
  const Hd=[S[0]+q.nk[0],S[1]+q.nk[1]],hp=bs_rot(Hd,q.ha),head=[[-10.5,0],[-8,-6.5],[-1.5,-9],[5,-8],[10.5,-5.2],[13.8,-1.6],[14.3,1.4],[12.6,3.8],[8.5,6.6],[1,8.4],[-6,7]].map(hp);
  const neck=[lp([L-4,-4]),bs_mid(lp([L-2,-6]),hp([-5,3]),0.5),hp([-4,3])];
  // the ears, from the top of the head: long (a little longer than the head), rounded at the tips; they tilt back as it runs
  const ear=(b,e,ln)=>{const B=hp(b),dx=-Math.sin(e),dy=-Math.cos(e),bw=0.2;return[B,[B[0]+dx*ln*0.3-dy*bw,B[1]+dy*ln*0.3+dx*bw],[B[0]+dx*ln*0.68-dy*1.2,B[1]+dy*ln*0.68+dx*1.2],[B[0]+dx*ln,B[1]+dy*ln]];},ewd=[2.8,4.7,4.6,2.8];
  const eN=ear([-3,-7.8],q.ea+ew,30),eF=ear([0.5,-8.5],q.ea-q.es-ew*0.6,29);
  // legs: the sitting pose's and the gait's, blended
  const hSit=dx=>[[1+dx,24],0.04],fSit=dx=>[[S[0]+8+dx,24],0.12];
  const hRun=k=>{const f=bs_rbFoot(ph-k*0.035,R.hd,R.hl+k*2,9);return[[f[0],f[1]],f[2]>=0?lerp(0.1,2.05,sstep(0.3,1,f[2])):bs_curve(BS_RB_HA,-f[2])];};
  const fRun=k=>{const f=bs_rbFoot(ph-R.fo-k*0.05,R.fd,R.fl+k*2.5,9);return[[f[0],f[1]],f[2]>=0?lerp(0.2,1.9,sstep(0.35,1,f[2])):bs_curve(BS_RB_FA,-f[2])];};
  const mixL=(a,b)=>run<=0?a:run>=1?b:[bs_mid(a[0],b[0],run),lerp(a[1],b[1],run)];
  const hindLeg=(root,f)=>{const T=f[0],J=[T[0]-15*Math.cos(f[1]),T[1]-15*Math.sin(f[1])],K=bs_ik(root,J,15,18,-1);return[root,K,J,T];};
  const foreLeg=(root,f)=>{const P=f[0],W=[P[0]-6*Math.cos(f[1]),P[1]-6*Math.sin(f[1])],E=bs_ik(root,W,11,13,1);return[root,E,W,P];};
  const hN=hindLeg(lp([0,3]),mixL(hSit(0),hRun(0))),hF=hindLeg(lp([2,2]),mixL(hSit(4),hRun(1))),fN=foreLeg(lp([L-3,7]),mixL(fSit(0),fRun(0))),fF=foreLeg(lp([L-1,6]),mixL(fSit(4),fRun(1)));
  const hw=[12.5,6.4,3,2.5],fw=[5.4,3.4,2.5,2.4],box=[-40,-40,40,30];
  // the far legs and far ear, darker, behind
  bs_form(ctx,c=>{bs_tube(c,hF,[9,5.4,2.6,2.2]);bs_tube(c,fF,[4.6,3,2.2,2.2]);bs_tube(c,eF,ewd);},col,bs_fill(ctx,col,0.6,box),0.4,2.2,0);
  // body, neck, head, near ear and near legs, as one form
  bs_form(ctx,c=>{bs_loop(c,torso);bs_tube(c,neck,[8.5,8,7]);bs_loop(c,head);bs_tube(c,eN,ewd);bs_tube(c,hN,hw);bs_tube(c,fN,fw);},col,bs_fill(ctx,col,0,box),1,2.6,9);
  // the white scut: a soft puff over the rump
  const sc=lp([-13.5,-2-3.5*q.tu]),sr=2.8+1.4*q.tu,puff=[];for(let k=0;k<7;k++){const a=k/7*TAU+0.3,r=sr*(0.82+0.3*hash(k,71));puff.push([sc[0]+r*Math.cos(a),sc[1]+r*Math.sin(a)]);}
  glow(ctx,sc[0],sc[1],sr*2.2,col,0.18*q.tu);ctx.beginPath();bs_loop(ctx,puff);ctx.fillStyle=rgba(mix(col,[255,255,255],0.3+0.3*q.tu),0.8+0.15*q.tu);ctx.fill();
  // the haunch and the near foreleg against the body, the ear's inner edge, the cheek
  const th2=bs_side(hN,hw,-1),fr=bs_side(fN,fw,1);
  bs_lines(ctx,[[bs_mid(th2[0],th2[1],0.25),bs_mid(th2[0],th2[1],0.7),th2[1]],[bs_mid(fr[0],fr[1],0.35),fr[1],bs_mid(fr[1],fr[2],0.5)],[bs_mid(eN[0],eN[1],0.7),eN[1],eN[2],bs_mid(eN[2],eN[3],0.55)],
    [hp([-3.5,6.6]),hp([-6,2.2]),hp([-4.8,-2.4])]],col,0.45,0.25,0.7);
  // nose, mouth, whiskers, eye
  const n0=hp([14,0.4+sniff*0.5]);bs_lines(ctx,[[hp([13.4,-0.8]),n0,hp([12.6,2.4])],[hp([12.8,2.6]),hp([10.4,4.4]),hp([8,4.6])]],col,0.6,0.5,0.3);
  bs_lines(ctx,[[hp([11.5,1.6]),hp([16.5,0.4+sniff]),hp([21,0+sniff])],[hp([11.5,2.2]),hp([16.5,3]),hp([20.5,4.4])]],col,0.22,0.3,0.12);
  const ep=hp([2,-2.6]);bs_eye(ctx,ep[0],ep[1],1.6,col,bl);
  ctx.restore();}
