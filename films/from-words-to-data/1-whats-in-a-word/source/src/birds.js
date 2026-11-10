/* ===== What's in a word: the birds =====
   The pigeons that sorted photos, a honeybee, the eagle the vervets fear, and the birds of the category "bird": a robin, a sparrow, a penguin and an ostrich.
   They keep icon()'s look (a dark body lit from the upper left, a glowing rim in the colour that carries the meaning, fine inner details
   and a small bright eye), but their shapes come from their anatomy: smooth contours, tapering legs and toes, feathers that overlap,
   a darker far leg behind the body. options.a fades one; options.t (seconds) brings it to life: breath, blinks, a head that tilts and turns,
   a tail that flicks, wings that beat. Every pose is a function of t and the options, so any frame draws alone.
   A blur is the costliest thing a canvas draws, so a bird's soft glow is blurred once into a sprite (kept by what the bird is, its pose
   and how big it is on screen) and drawn under it: the eagle's for each heading it soars at, the pigeon's wings' for each moment of a wingbeat,
   two neighbours blended so the glow moves smoothly. */

/* ---------- the drawing kit ---------- */
const BD_INK=[20,26,40],BD_S={f:1,s:1},BD_LAY={c:null,x:null},BD_GL=new Map(),BD_GR=new Map();
// a smooth closed curve through points (Catmull-Rom, as beziers); a point [x,y,1] is a sharp corner (a bill tip, a feather tip)
function bd_loop(c,p){const n=p.length;c.moveTo(p[0][0],p[0][1]);
  for(let i=0;i<n;i++){const a=p[(i+n-1)%n],b=p[i],d=p[(i+1)%n],e=p[(i+2)%n],kb=b[2]?0:1/6,kd=d[2]?0:1/6;
    c.bezierCurveTo(b[0]+(d[0]-a[0])*kb,b[1]+(d[1]-a[1])*kb,d[0]-(e[0]-b[0])*kd,d[1]-(e[1]-b[1])*kd,d[0],d[1]);}c.closePath();}
// a stretch of the closed curve bd_loop draws through p: its segments from point i0 to point i1 (indices past the end wrap round), as an open path
function bd_seg(c,p,i0,i1){const n=p.length,P=i=>p[((i%n)+n)%n];c.moveTo(P(i0)[0],P(i0)[1]);
  for(let i=i0;i<i1;i++){const a=P(i-1),b=P(i),d=P(i+1),e=P(i+2),kb=b[2]?0:1/6,kd=d[2]?0:1/6;
    c.bezierCurveTo(b[0]+(d[0]-a[0])*kb,b[1]+(d[1]-a[1])*kb,d[0]-(e[0]-b[0])*kd,d[1]-(e[1]-b[1])*kd,d[0],d[1]);}}
// a smooth open curve through points; m===false carries on the current subpath
function bd_path(c,p,m){const n=p.length;if(m===false)c.lineTo(p[0][0],p[0][1]);else c.moveTo(p[0][0],p[0][1]);
  for(let i=0;i<n-1;i++){const a=p[i?i-1:0],b=p[i],d=p[i+1],e=p[i+2<n?i+2:n-1],kb=b[2]?0:1/6,kd=d[2]?0:1/6;
    c.bezierCurveTo(b[0]+(d[0]-a[0])*kb,b[1]+(d[1]-a[1])*kb,d[0]-(e[0]-b[0])*kd,d[1]-(e[1]-b[1])*kd,d[0],d[1]);}}
// a tube along points p with half-widths w, rounded at both ends: legs, toes, necks, feather lines
function bd_tube(c,p,w){const n=p.length,L=[],R=[];let a0=0,a1=0;for(let i=0;i<n;i++){const a=p[i?i-1:0],b=p[i<n-1?i+1:n-1];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
    const r=Math.max(0.02,w[i]);L.push([p[i][0]-dy*r,p[i][1]+dx*r]);R.push([p[i][0]+dy*r,p[i][1]-dx*r]);if(!i)a0=Math.atan2(dy,dx);if(i===n-1)a1=Math.atan2(dy,dx);}
  bd_path(c,L);c.arc(p[n-1][0],p[n-1][1],Math.max(0.02,w[n-1]),a1+Math.PI/2,a1-Math.PI/2,true);bd_path(c,R.reverse(),false);c.arc(p[0][0],p[0][1],Math.max(0.02,w[0]),a0-Math.PI/2,a0+Math.PI/2,true);c.closePath();}
function bd_taper(c,p,w0,w1){const n=p.length,w=[];for(let i=0;i<n;i++)w.push(lerp(w0,w1,n>1?i/(n-1):0));bd_tube(c,p,w);}
// points turned by a about (px,py), then moved by (dx,dy); corner flags kept
function bd_rot(p,px,py,a,dx,dy){const c=Math.cos(a),s=Math.sin(a);dx=dx||0;dy=dy||0;return p.map(q=>{const x=q[0]-px,y=q[1]-py,r=[px+x*c-y*s+dx,py+x*s+y*c+dy];if(q[2])r.push(q[2]);return r;});}
const bd_mv=(p,dx,dy)=>p.map(q=>q[2]?[q[0]+dx,q[1]+dy,q[2]]:[q[0]+dx,q[1]+dy]);
// a gradient made once and kept (its coordinates are in the bird's own units, so it serves every frame)
function bd_g(ctx,key,make){let g=BD_GR.get(key);if(!g){g=make(ctx);if(BD_GR.size>300)BD_GR.clear();BD_GR.set(key,g);}return g;}
function bd_lin(ctx,key,x0,y0,x1,y1,stops){return bd_g(ctx,key,c=>{const g=c.createLinearGradient(x0,y0,x1,y1);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g;});}
function bd_rad(ctx,key,x,y,r,stops){return bd_g(ctx,key,c=>{const g=c.createRadialGradient(x,y,0,x,y,r);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g;});}
// the dark fill of a bird, lit from the upper left of the screen whichever way it faces; k darkens it (a far leg, a far wing)
function bd_fill(ctx,col,k,b){k=k||0;return bd_g(ctx,"f"+col+"|"+k+"|"+b+"|"+BD_S.f,c=>{const g=c.createLinearGradient(b[0]*BD_S.f,b[1],b[2]*BD_S.f,b[3]);
  g.addColorStop(0,rgba(mix(mix(col,BD_INK,0.55),[6,9,16],k),0.97));g.addColorStop(1,rgba(mix([8,12,22],[3,5,10],k),0.97));return g;});}
// one form, from its outline (points of a closed smooth curve): its rim in col, thin where the light falls (upper left) and thicker in shadow,
// made as two fills, the outline in col and then its body inset from it (a wide stroke costs a canvas several times more)
function bd_formP(ctx,p,col,fill,lw,ra){const s=BD_S.s,n=p.length,w=(lw||2.2)/s,lx=0.6*BD_S.f,ins=[];ra=ra==null?1:ra;let A=0;
  for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n];A+=a[0]*b[1]-b[0]*a[1];}const sg=A>0?1:-1;
  for(let i=0;i<n;i++){const a=p[(i+n-1)%n],b=p[(i+1)%n];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1,nx=sg*dy/d,ny=-sg*dx/d,k=w*(0.3+0.75*Math.max(0,nx*lx+ny*0.8));
    const kk=p[i][3]==null?k:k*p[i][3],q=[p[i][0]-nx*kk,p[i][1]-ny*kk];if(p[i][2])q.push(1);ins.push(q);}
  if(ra>0.01){ctx.beginPath();bd_loop(ctx,p);ctx.fillStyle=rgba(col,ra);ctx.fill();}
  if(fill){ctx.beginPath();bd_loop(ctx,ra>0.01?ins:p);ctx.fillStyle=fill;ctx.fill();}}
// a bird's glow: its outlines (builds, in its own units, within box, or a function giving it) stroked once with a blur onto a sprite, kept by key and by its size on
// screen, and drawn under the bird (al: how much). Drawn with the bird's transform, it follows the bird wherever it goes.
function bd_glow(ctx,key,box,builds,col,lw,al,soft){const m=ctx.getTransform(),ds=Math.hypot(m.c,m.d);if(!(ds>0.02)||al<=0.01)return;
  const q=Math.max(0.02,Math.round(ds*24)/24),k=key+"|"+q+"|"+BD_S.s.toFixed(2)+"|"+col;let G=BD_GL.get(k);
  if(!G){if(typeof box==="function")box=box();const x0=box[0]-22/q,y0=box[1]-22/q,W=Math.max(2,Math.ceil((box[2]-box[0])*q+44)),Hh=Math.max(2,Math.ceil((box[3]-box[1])*q+44)),cv=mkCanvas(W,Hh),g=cv.getContext("2d");
    const off=soft?W+64:0;g.setTransform(q,0,0,q,-x0*q+0.5-off,-y0*q+0.7);g.lineJoin="round";g.beginPath();builds.forEach(b=>b(g));g.lineWidth=(lw||2.2)*1.3/BD_S.s;
    // (soft: only the blur, no line at its heart, for a bird whose pose strays from the sprite's: a halo that's a pixel or two off shows no seam)
    if(soft){g.shadowOffsetX=off;g.strokeStyle=rgba(col,1);g.shadowColor=rgba(col,0.5);g.shadowBlur=5;g.stroke();g.shadowColor=rgba(col,0.6);g.shadowBlur=13;g.stroke();}
    else{g.strokeStyle=rgba(col,0.5);g.shadowColor=rgba(col,0.85);g.shadowBlur=11;g.stroke();}G={cv,x0,y0,w:W/q,h:Hh/q};if(BD_GL.size>240)BD_GL.delete(BD_GL.keys().next().value);BD_GL.set(k,G);}
  // (sampled nearest while it lands pixel for pixel, upright and at its own size: a canvas resamples a sprite several times faster that way;
  // turned (a cocked tail, a tilted head, a pitched bird) or squeezed (a bird turning), smoothed, or its edges would step and crawl)
  const sm=Math.abs(m.b)>1e-4||Math.abs(m.c)>1e-4||Math.abs(Math.abs(m.a)/q-1)>0.04||Math.abs(Math.abs(m.d)/q-1)>0.04;
  ctx.save();if(al!=null&&al<1)ctx.globalAlpha*=al;ctx.imageSmoothingEnabled=sm;ctx.drawImage(G.cv,G.x0,G.y0,G.w,G.h);ctx.restore();}
// a glow made fresh each frame, for a bird whose whole shape keeps changing (the soaring eagle, a pigeon beating its wings or turning): its
// outlines blurred once, at a quarter of their size on screen (a blur costs by the pixel, and a glow is soft anyway), onto a small canvas kept
// for it, then drawn under the bird, smoothed
const BD_LG={c:null,x:null};
function bd_glowLive(ctx,box,builds,col,lw,al){const m=ctx.getTransform(),ds=Math.hypot(m.c,m.d);if(!(ds>0.02)||al<=0.01)return;
  const k=4,q=ds/k,pad=26/ds,x0=box[0]-pad,y0=box[1]-pad,W=Math.max(2,Math.ceil((box[2]-box[0]+2*pad)*q)),Hh=Math.max(2,Math.ceil((box[3]-box[1]+2*pad)*q));if(W*Hh>4e6)return;
  if(!BD_LG.c||BD_LG.c.width<W||BD_LG.c.height<Hh){BD_LG.c=mkCanvas(Math.max(W,BD_LG.c?BD_LG.c.width:0),Math.max(Hh,BD_LG.c?BD_LG.c.height:0));BD_LG.x=BD_LG.c.getContext("2d");}
  const g=BD_LG.x,off=W+32;g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W+3,Hh+3);g.setTransform(q,0,0,q,-x0*q-off,-y0*q);g.lineJoin="round";g.beginPath();builds.forEach(b=>b(g));
  g.lineWidth=(lw||2.2)*1.6/BD_S.s;g.strokeStyle=rgba(col,1);g.shadowOffsetX=off;g.shadowColor=rgba(col,0.7);g.shadowBlur=9/k;g.stroke();g.restore();
  ctx.save();if(al!=null&&al<1)ctx.globalAlpha*=al;ctx.imageSmoothingEnabled=true;ctx.drawImage(BD_LG.c,0,0,W,Hh,x0,y0,W/q,Hh/q);ctx.restore();}
// fine lines drawn as plain strokes (for the smallest details): w in screen pixels
function bd_strk(ctx,list,col,a,w){if(a<=0.01||!list.length)return;ctx.beginPath();for(const p of list)bd_path(ctx,p);ctx.lineWidth=w/BD_S.s;ctx.strokeStyle=rgba(col,a);ctx.stroke();}
// fine inner lines, tapering: each a list of points, from w0 to w1 screen pixels (half-widths)
function bd_lines(ctx,list,col,a,w0,w1){if(a<=0.01||!list.length)return;const s=BD_S.s;ctx.beginPath();for(const p of list)bd_taper(ctx,p,w0/s,w1/s);ctx.fillStyle=rgba(col,a);ctx.fill();}
// an eye: a bright bead (or a dark one with a glint and a fine ring, on a pale face); op 1 open, 0 shut
function bd_eye(ctx,x,y,r,col,op,dark){op=op==null?1:op;ctx.save();ctx.translate(x,y);ctx.scale(1,Math.max(0.1,op));
  if(dark){ctx.fillStyle="rgb(12,9,8)";ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.lineWidth=0.7/BD_S.s;ctx.strokeStyle=rgba(col,0.6);ctx.stroke();
    if(op>0.4){ctx.fillStyle=rgba(mix(col,[255,255,255],0.7),0.95);ctx.beginPath();ctx.arc(r*0.32*BD_S.f,-r*0.36,r*0.34,0,TAU);ctx.fill();}}
  else{ctx.fillStyle=rgba(col,0.35);ctx.beginPath();ctx.arc(0,0,r*1.7,0,TAU);ctx.fill();ctx.fillStyle=rgba(mix(col,[255,255,255],0.45),1);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();}
  ctx.restore();}
// draw a bird fn(c) at (x,y), size s, facing o.face (1 right, -1 left; in between it squeezes as it turns) or o.flip; box its reach in its units.
// While it's see-through (a fade), it's drawn whole on a layer first, so its overlapping parts don't show through each other.
function bd_draw(ctx,x,y,s,o,box,fn){const a=o.a==null?1:o.a,ga=ctx.globalAlpha*Math.min(1,a);if(a<=0.01||ga<=0.004||!(s>0))return;
  let fx=(o.flip?-1:1)*(o.face==null?1:o.face);fx=(fx<0?-1:1)*Math.max(0.2,Math.abs(fx));BD_S.f=fx<0?-1:1;BD_S.s=s;
  const put=c=>{c.translate(x,y);c.scale(s*fx,s);if(o.rot)c.rotate(o.rot);c.lineJoin="round";c.lineCap="round";};
  if(o.rot){const r=Math.hypot(Math.max(-box[0],box[2]),Math.max(-box[1],box[3]));box=[-r,-r,r,r];}
  if(ga<0.985){const m=ctx.getTransform(),X=[],Y=[];
    for(const u of [box[0]*fx,box[2]*fx])for(const v of [box[1],box[3]]){const px=x+s*u,py=y+s*v;X.push(m.a*px+m.c*py+m.e);Y.push(m.b*px+m.d*py+m.f);}
    const x0=Math.floor(Math.min(...X)-24),y0=Math.floor(Math.min(...Y)-24),w=Math.ceil(Math.max(...X)+24)-x0,h=Math.ceil(Math.max(...Y)+24)-y0;
    if(w>=1&&h>=1&&w*h<9e6){if(!BD_LAY.c||BD_LAY.c.width<w||BD_LAY.c.height<h){BD_LAY.c=mkCanvas(Math.max(w,BD_LAY.c?BD_LAY.c.width:0),Math.max(h,BD_LAY.c?BD_LAY.c.height:0));BD_LAY.x=BD_LAY.c.getContext("2d");}
      const c=BD_LAY.x;c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.clearRect(0,0,w,h);c.setTransform(m.a,m.b,m.c,m.d,m.e-x0,m.f-y0);put(c);fn(c);c.restore();
      ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga;ctx.imageSmoothingEnabled=false;ctx.drawImage(BD_LAY.c,0,0,w,h,x0,y0,w,h);ctx.restore();return;}}
  ctx.save();put(ctx);fn(ctx);ctx.restore();}
// a joint between a and b (bones l1, l2); bend 1 or -1 picks the side it bends to
function bd_ik(a,b,l1,l2,bend){const dx=b[0]-a[0],dy=b[1]-a[1],d0=Math.hypot(dx,dy)||1e-6,d=clamp(d0,Math.abs(l1-l2)+0.01,l1+l2-0.01),x=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-x*x)),ux=dx/d0,uy=dy/d0;
  return [a[0]+ux*x-uy*h*bend,a[1]+uy*x+ux*h*bend];}

/* ---------- life: every value a smooth function of t (null t: a still pose) ---------- */
// a value in -1..1 that holds, then moves quickly (over dur seconds) to the next, about every per seconds: a bird's head
function bd_hold(t,k,per,dur){if(t==null)return 0;const u=t/per+hash(k,5)*13,i=Math.floor(u),si=i+0.7*hash(i,k),v=j=>hash(j,k+0.37)*2-1;
  return u>=si?lerp(v(i-1),v(i),ease(clamp((u-si)*per/dur,0,1))):v(i-1);}
// a flick now and then (0 → 1 → 0): up in rise seconds, back in fall; about every per seconds
// (the rise starts at once and slows to a stop: a Hermite curve whose speed never tops 4/3 of the average, so no frame jumps)
function bd_pulse(t,k,per,rise,fall){if(t==null)return 0;const u=t/per+hash(k,6)*11,i=Math.floor(u);let m=0;
  for(let j=i-1;j<=i;j++){const d=(u-j-0.15-0.7*hash(j,k+0.71))*per;if(d>0){const v=clamp(d/rise,0,1);m=Math.max(m,d<rise?v*(1-v)*(1-v)+v*v*(3-2*v):1-sstep(0,1,(d-rise)/fall));}}return m;}
// a blink now and then: 1 open, 0 shut
function bd_blink(t,k){if(t==null)return 1;const P=2.9+hash(k,7)*2.2,u=((t+hash(k,8)*P)%P+P)%P;return u<0.16?1-0.95*Math.sin(Math.PI*u/0.16):1;}

/* ---------- a small songbird, perched: one contour for the head and body, a tail and a folded wing that overlap it, slender legs whose toes
   curl over a branch. G holds its shape (head points turn with the head about G.pv), paint(c,H,Bm,dip) its plumage inside the contour
   (H(p) places head points, Bm(p) body points). L is its life: br breath, ha head tilt, hx head reach, fl a flick of tail and wings, bl blink ---------- */
function bd_perchGeo(G,L){const dip=(L.dp==null?L.fl:L.dp)*1.1,ha=L.ha-L.fl*0.05,pv=G.pv,H=p=>bd_rot(p,pv[0],pv[1],ha,L.hx,dip),Bm=p=>bd_mv(p,0,dip);
  const B=Bm(G.body),hd=H(G.head);B[0][0]+=L.br*0.45;B[1][0]+=L.br*0.65;B[2][1]+=L.br*0.35;
  const ta=G.ta+L.fl*0.36,tb=[G.tb[0],G.tb[1]+dip],tl=G.tail[4][0],bw=(G.tbow||0.9)*(1-L.fl*0.6);
  const T=p=>bd_rot(p.map(q=>{const u=q[0]/tl,r=[q[0],q[1]+bw*u*(1-u)*4];if(q[2])r.push(1);return r;}),0,0,ta,tb[0],tb[1]);
  return{dip,H,Bm,sil:hd.slice(0,G.nf).concat(B,hd.slice(G.nf)),T};}
const BD_L0={br:0.5,ha:0.03,hx:0,fl:0,bl:1},BD_LH={br:0.5,ha:0,hx:0,fl:0,bl:1};
function bd_perch(c,col,G,L,paint,key){const{dip,H,Bm,sil,T}=bd_perchGeo(G,L),bx=G.box,fill=bd_fill(c,col,0,bx);
  // the glow, blurred once: the body's, the head's apart (it follows the head as it tilts and reaches), and the tail's (it turns with the tail as it's cocked)
  // (each an open stretch of the resting outline, so the two meet at the throat and the nape without a seam)
  const nb=G.body.length,rs=()=>bd_perchGeo(G,BD_LH).sil;
  c.save();c.translate(0,dip);bd_glow(c,key,[bx[0]-6,bx[1]-4,bx[2]+2,bx[3]+2],[q=>bd_seg(q,rs(),G.nf,G.nf+nb-1)],col,2.3);c.restore();
  c.save();c.translate(G.pv[0]+L.hx,G.pv[1]+dip);c.rotate(L.ha-L.fl*0.05);c.translate(-G.pv[0],-G.pv[1]);
  bd_glow(c,key+"h",()=>{const X=G.head.map(q=>q[0]),Y=G.head.map(q=>q[1]);return[Math.min(...X)-4,Math.min(...Y)-4,Math.max(...X)+4,Math.max(...Y)+4];},
    [q=>{const S=rs();bd_seg(q,S,G.nf+nb-1,S.length+G.nf);}],col,2.3);c.restore();
  c.save();c.translate(G.tb[0],G.tb[1]+dip);c.rotate(L.fl*0.36);c.translate(-G.tb[0],-G.tb[1]);
  bd_glow(c,key+"t",()=>{const P=bd_perchGeo(G,BD_L0).T(G.tail),X=P.map(q=>q[0]),Y=P.map(q=>q[1]);return[Math.min(...X)-3,Math.min(...Y)-3,Math.max(...X)+3,Math.max(...Y)+3];},
    [q=>bd_loop(q,bd_perchGeo(G,BD_L0).T(G.tail))],col,2.3);c.restore();
  // the legs, behind the belly: the far one darker; three toes forward, one back
  const legc=G.leg||mix(col,[190,140,120],0.55),lg=G.legs;
  const legs=(dx,dy,dim)=>{const kn=[lg[0][0]+dx,lg[0][1]+dip+dy],md=[lg[1][0]+dx,lg[1][1]+dip*0.5+dy],ft=[lg[2][0]+dx,lg[2][1]+dy];c.beginPath();bd_tube(c,[kn,md,ft],[0.95,0.6,0.52]);
    const tt=(q,w)=>bd_taper(c,[ft].concat(q.map(v=>[v[0]+dx,v[1]+dy])),w,0.2);tt(G.toes[0],0.48);tt(G.toes[1],0.44);tt(G.toes[2],0.48);
    c.fillStyle=rgba(mix(legc,[10,12,20],dim),0.96);c.fill();};
  legs(-3.2,-0.35,0.55);legs(0,0,0);
  // the tail, behind the body, flicked up now and then
  bd_formP(c,T(G.tail),col,fill,1.8,0.9);
  bd_strk(c,G.tlines.map(T),col,0.28,0.55);
  // head and body: one contour; then the plumage inside it
  bd_formP(c,sil,col,fill,2.3,1);
  c.save();c.beginPath();bd_loop(c,sil);c.clip();paint(c,H,Bm,dip);c.restore();
  // the folded wing: coverts, then the flight feathers to a tip over the tail; a flick lifts it a little
  const wd=L.fl*0.5,Wg=p=>bd_rot(Bm(p),G.wp[0],G.wp[1],-wd*0.08,0,wd);
  bd_formP(c,Wg(G.wing),col,bd_fill(c,col,0.18,bx),1.5,0.85);
  if(G.wpaint)G.wpaint(c,Wg);
  bd_lines(c,G.wlines.map(Wg),col,0.42,0.4,0.1);
  // the bill and the eye
  bd_formP(c,H(G.bill),col,G.billc||"rgb(24,19,17)",1,0.6);
  if(G.gape)bd_strk(c,[H(G.gape)],[10,8,8],0.8,0.5);
  const e=H([G.eye])[0];bd_eye(c,e[0],e[1],G.er,col,L.bl,G.darkEye);}
// a songbird's life: slow breath, a head that tilts and reaches in quick moves, a flick of tail and wings now and then, a blink
function bd_perchLife(t,k){return{br:t==null?0.5:0.5+0.5*Math.sin(t*TAU*0.5+k),ha:0.13*bd_hold(t,11+k,2.4,0.2)+0.03,hx:0.5*bd_hold(t,13+k,3.1,0.4),
  fl:bd_pulse(t,21+k,4.6,0.18,0.9),dp:bd_pulse(t==null?t:t+0.04,21+k,4.6,0.18,0.9),bl:bd_blink(t,31+k)};}

/* ---------- a European robin (Erithacus rubecula), perched: plump and round-headed, an orange-red face and breast edged with blue-grey,
   olive-brown above, a pale belly, a thin dark bill, a big dark eye, slender legs; its toes at y 22.5 (a branch's top).
   Options: t, col (its rim), breast (false: no orange), american (true: the American robin instead), seed ---------- */
const BD_RB={pv:[5,-15],nf:7,box:[-24,-32,20,24],darkEye:true,er:1.75,eye:[11.9,-24.6],ta:2.26,tb:[-8.4,5.4],wp:[3,-14],
  head:[[1.5,-29.8],[7.5,-30.6],[13.6,-28.2],[16.9,-25.1],[18,-22.9,1],[17.8,-20.3,1],[16.3,-17.3],[-3.6,-25.2]],
  body:[[17.2,-11.6],[17.2,-3.2],[11.8,6.4],[3.2,11.6],[-6.4,10.2],[-11.4,2.6],[-9.6,-8.8],[-6.6,-17.8]],
  wing:[[3.4,-16.2],[-3,-15.4],[-9.6,-8.4],[-15.2,-0.6],[-18.8,6.2,1],[-13.4,4.2],[-5.2,2.4],[1.8,-2],[5.4,-9.2]],
  wlines:[[[3.6,-9.4],[-1.6,-6.8],[-7,-4.6],[-10.6,-3]],[[-9.6,-3.4],[-13.2,0.6],[-16.6,4.8]],[[-7,-2.6],[-10.6,1.4],[-14.2,4.6]],[[-3.4,-1.6],[-6.8,1.4],[-10.6,3.6]]],
  bill:[[17.6,-23.2],[20.6,-22.5],[23.6,-21.35,1],[20.4,-20.75],[17.5,-20.5]],gape:[[18.4,-21.3],[20.4,-21.3],[22.2,-21.2]],
  tail:[[0,-1.6],[6,-2.4],[12.6,-3.1],[18,-3.7],[20.3,-3.3],[21.3,-2.1],[21.4,-0.8],[21.1,0.1],[21.4,1],[21.2,2.4],[20.1,3.4],[17.6,3.6],[12.2,2.9],[5.6,2.1],[0,1.6]],
  tlines:[[[3,0.1],[11,0.05],[19.6,0.1]],[[4,-1.1],[12,-2],[19.6,-2.7]],[[4,1.1],[12,1.9],[19.4,2.6]]],
  legs:[[4.4,8],[3.9,15],[3.1,21.8]],toes:[[[5.8,22],[8,22.8],[9,24.2]],[[5.4,22.5],[6.8,24.1]],[[0.6,22.2],[-1.2,23.2],[-1.8,24.4]]]};
function robin(ctx,x,y,s,o){o=o||{};if(o.american)return bd_amRobin(ctx,x,y,s,o);const col=o.col||[255,160,110],L=bd_perchLife(o.t,o.seed||1);
  bd_draw(ctx,x,y,s,o,[-30,-36,30,28],c=>bd_perch(c,col,BD_RB,L,(c,H,Bm,dip)=>{if(o.breast===false)return;
    // a pale belly, the blue-grey border, then the orange-red face and breast
    c.save();c.translate(0,dip);c.fillStyle=bd_rad(c,"rb-belly",6.4,6.4,11.5,[[0,"rgba(238,234,224,0.6)"],[0.55,"rgba(236,230,218,0.44)"],[1,"rgba(236,230,218,0)"]]);c.fillRect(-7,-6,28,24);c.restore();
    c.beginPath();bd_tube(c,H([[17.5,-29.6],[14.6,-29.2],[10.6,-29.4],[6.4,-27],[3.7,-22],[3.8,-15.6]]).concat(Bm([[5.6,-7.5],[8.4,-0.6],[12.2,3.3]])),[0.4,1,1.25,1.35,1.35,1.3,1.05,0.7,0.25]);
    c.fillStyle="rgba(146,166,194,0.6)";c.fill();c.beginPath();
    bd_loop(c,H([[17.6,-28.4],[14.8,-28.2],[10.9,-28.1],[7.1,-25.8],[4.9,-21.5]]).concat(Bm([[5,-15.2],[6.8,-7.2],[9.6,-0.4],[14,3.6],[24,6],[26,-14]]),H([[24,-33]])));
    c.fillStyle=bd_lin(c,"rb-breast",8,-26,16,6,[[0,"rgba(255,130,72,0.88)"],[1,"rgba(230,94,46,0.82)"]]);c.fill();},"rb"));}
/* the American robin (Turdus migratorius), for robin(..., {american: true}): the other bird English calls a robin, a thrush half as long again:
   slimmer and longer-tailed, a blackish head with broken white eye-rings, a yellow bill, a white-streaked throat, a brick-orange breast
   and a white vent, grey-brown above */
const BD_AR=(()=>{const X=(p,k)=>p.map(q=>{const r=[q[0]*k,q[1]];if(q[2])r.push(1);return r;}),R=BD_RB;
  return Object.assign({},R,{body:X(R.body,1.12),head:X(R.head,1.05),wing:X(R.wing,1.14),wlines:R.wlines.map(p=>X(p,1.14)),ta:2.36,tb:[-9.6,5],eye:[12.4,-24.6],er:1.6,
    tail:R.tail.map(q=>{const r=[q[0]*1.3,q[1]*1.05];if(q[2])r.push(1);return r;}),tlines:R.tlines.map(p=>p.map(q=>[q[0]*1.3,q[1]])),
    bill:[[18.4,-23.3],[21.8,-22.7],[25.4,-21.5,1],[21.6,-20.7],[18.3,-20.4]],billc:"rgb(222,178,56)",gape:null,box:[-26,-32,22,24],leg:[120,96,84]});})();
function bd_amRobin(ctx,x,y,s,o){const col=o.col||[200,150,120],L=bd_perchLife(o.t,(o.seed||1)+9);
  bd_draw(ctx,x,y,s,o,[-34,-36,32,28],c=>bd_perch(c,col,BD_AR,L,(c,H,Bm,dip)=>{
    // brick-orange from throat to belly, a white vent, a blackish head
    c.beginPath();bd_loop(c,H([[17.4,-17.6],[11.6,-18.6]]).concat(Bm([[6.4,-15],[5.6,-6],[8.6,2.6],[14,7.4],[24,8],[26,-14]]),H([[24,-20]])));
    c.fillStyle=bd_lin(c,"ar-breast",8,-18,16,8,[[0,"rgba(214,104,52,0.86)"],[1,"rgba(186,80,40,0.82)"]]);c.fill();
    c.save();c.translate(0,dip);c.fillStyle=bd_rad(c,"ar-vent",2,11,8,[[0,"rgba(240,236,228,0.6)"],[1,"rgba(240,236,228,0)"]]);c.fillRect(-8,2,20,14);c.restore();
    c.beginPath();bd_loop(c,H([[19,-19.4],[15.4,-17.6],[11,-18.8],[6.6,-20.4],[2.4,-22.6],[-2,-24],[-6,-33],[20,-33]]));c.fillStyle="rgba(14,14,18,0.8)";c.fill();
    // white arcs above and below the eye, white streaks on the throat
    const e=H([BD_AR.eye])[0];c.save();c.translate(e[0],e[1]);c.lineWidth=0.75;c.strokeStyle="rgba(244,242,236,0.95)";c.beginPath();c.arc(0,0,2.5,-2.7,-0.5);c.stroke();c.beginPath();c.arc(0,0,2.5,0.5,2.6);c.stroke();c.restore();
    bd_strk(c,[H([[16.4,-18.4],[15.6,-16]]),H([[14.6,-18.6],[13.8,-16.2]]),H([[12.8,-18.8],[12.2,-16.6]])],[244,242,236],0.75,0.6);},"ar"));}

/* ---------- a house sparrow (Passer domesticus), a male: chunky and big-headed, a grey crown, a chestnut band from the eye round the nape,
   pale cheeks, a black bib and lores, a stout conical bill, a streaked brown back, a white wing bar, pale grey below, short legs.
   Options: t, col (its rim), female (plain: no bib, a buff stripe over the eye), seed ---------- */
const BD_SP={pv:[4,-14],nf:7,box:[-26,-30,20,24],er:1.45,eye:[10.4,-21.9],darkEye:true,tbow:-0.5,ta:2.72,tb:[-10.6,3.6],wp:[2,-12],
  head:[[0.4,-26.6],[6.6,-28],[12.6,-26.3],[15.2,-23.8],[16.4,-22.4,1],[16.2,-17.6,1],[14.6,-15],[-4.6,-22.4]],
  body:[[16.2,-9.4],[16.4,-1.8],[11.6,6.6],[2.6,10.8],[-7.4,8.6],[-13.6,0.8],[-11.6,-9],[-7.2,-16.6]],
  wing:[[2.8,-14.2],[-4,-14.2],[-11,-7.8],[-16.4,-1.6],[-20.4,3.6,1],[-14,4.4],[-6,3.6],[1,-0.6],[4.6,-7.6]],
  wlines:[[[-9.4,-3.6],[-13.8,0.2],[-18,3.2]],[[-7.2,-2.6],[-11.2,1.2],[-15.2,3.9]],[[-4.6,-1.8],[-8.2,1.6],[-12,3.8]]],
  bill:[[16.3,-22.7],[19.4,-21.7],[22.4,-19.9,1],[19.4,-18.6],[16.2,-17.7]],gape:[[16.8,-19.9],[19,-19.8],[21.2,-19.8]],
  tail:[[0,-1.8],[5.5,-2.4],[11,-3],[15.2,-3.5],[17.3,-3.1],[18.1,-1.9],[17.9,-0.7],[17.45,0.1],[17.9,0.9],[18.1,2],[17.2,3.2],[15.2,3.5],[11,3],[5.5,2.3],[0,1.8]],
  tlines:[[[3,0.1],[10,0.05],[16.4,0.1]],[[4,-1.2],[10,-2],[16.6,-2.6]],[[4,1.2],[10,2],[16.4,2.6]]],
  legs:[[3.6,8],[3.3,12.6],[2.8,18.2]],toes:[[[5.2,18.4],[7.3,19.1],[8.2,20.4]],[[4.9,18.9],[6.1,20.3]],[[0.4,18.6],[-1.4,19.5],[-2,20.7]]],
  leg:[196,150,128],
  // the wing: chestnut coverts, a white bar, dark centres to the tertials edged buff, the scapulars streaked black and buff
  wpaint:(c,W)=>{c.save();c.beginPath();bd_loop(c,W(BD_SP.wing));c.clip();
    c.fillStyle=bd_lin(c,"sp-cov",-6,-14,2,2,[[0,"rgba(150,86,46,0.55)"],[1,"rgba(120,70,38,0.35)"]]);c.beginPath();bd_loop(c,W([[3,-15],[-5,-15],[-8,-9],[-6,-7.2],[-2,-8.4],[2,-9.4],[5,-10]]));c.fill();
    c.beginPath();bd_loop(c,W([[-6.4,-5.8],[-9.6,-3],[-13,1],[-15,3.6],[-10,3.4],[-6,1.8],[-3.2,-1.8],[-2.6,-5]]));c.fillStyle="rgba(10,8,8,0.55)";c.fill();c.restore();
    c.beginPath();bd_tube(c,W([[3.2,-9.6],[0.4,-8.6],[-3.2,-7.6],[-6.6,-6.6]]),[0.45,0.8,0.8,0.35]);c.fillStyle="rgba(244,240,230,0.9)";c.fill();
    bd_lines(c,[W([[-2.4,-6],[-5.6,-1.4],[-9.4,2.4]]),W([[-5.2,-6.4],[-8.6,-2.4],[-12.4,1.4]])],[222,190,140],0.7,0.35,0.15);
    bd_lines(c,[W([[-1,-13.4],[-5.2,-11.4],[-9.4,-8]]),W([[-3.4,-12.2],[-7.6,-9.4]])],[10,8,8],0.85,0.55,0.2);bd_lines(c,[W([[-0.6,-12.2],[-4.6,-10.2],[-8.6,-7.2]])],[230,196,146],0.75,0.4,0.15);}};
function sparrow(ctx,x,y,s,o){o=o||{};const col=o.col||[210,170,120],L=bd_perchLife(o.t,(o.seed||2)+3),fem=!!o.female;
  bd_draw(ctx,x,y,s,o,[-30,-32,26,28],c=>bd_perch(c,col,BD_SP,L,(c,H,Bm,dip)=>{
    // pale grey below, the mantle streaked
    c.save();c.translate(0,dip);c.fillStyle=bd_rad(c,"sp-belly",9,2,14,[[0,"rgba(214,210,200,0.34)"],[1,"rgba(214,210,200,0)"]]);c.fillRect(-6,-14,30,34);c.restore();
    bd_lines(c,[Bm([[-6.2,-15.6],[-8.6,-12.4],[-10.4,-9.2]]),Bm([[-3.6,-15.8],[-6.2,-12.2],[-8.2,-9.8]])],[12,9,8],0.8,0.55,0.2);
    bd_lines(c,[Bm([[-4.8,-16.2],[-7.4,-12.6],[-9.4,-9.6]])],[226,190,140],0.7,0.4,0.15);
    if(fem){c.beginPath();bd_loop(c,H([[16,-24.6],[12,-25.6],[6,-25],[0,-24],[-6,-22],[-6,-32],[18,-32]]));c.fillStyle="rgba(120,96,70,0.5)";c.fill();
      c.beginPath();bd_tube(c,H([[12.2,-23.4],[8.6,-23.6],[4.4,-23.2],[0.6,-22]]),[0.3,0.75,0.75,0.3]);c.fillStyle="rgba(226,204,160,0.7)";c.fill();return;}
    // grey crown, chestnut band behind the eye, pale cheek
    c.beginPath();bd_loop(c,H([[16.6,-24.4],[12.6,-24.6],[8.4,-24.2],[3.4,-23.6],[-1.2,-23.8],[-6.4,-22.6],[-8,-32],[18,-32]]));c.fillStyle="rgba(146,154,168,0.62)";c.fill();
    c.beginPath();bd_loop(c,H([[11.6,-23.3],[6.2,-24.2],[1,-23.6],[-3.4,-21.6],[-5.2,-17.8],[-4.4,-14.8],[-1.4,-16.8],[2.8,-19.6],[7.4,-21.2]]));c.fillStyle="rgba(150,82,42,0.9)";c.fill();
    c.beginPath();bd_loop(c,H([[11.4,-20.4],[7.4,-20.6],[3.6,-19.2],[2.2,-15.6],[5.4,-13],[10.4,-13.8],[13.2,-17]]));c.fillStyle="rgba(216,212,204,0.6)";c.fill();
    // the black bib and lores, a white spot behind the eye
    c.beginPath();bd_loop(c,H([[16.2,-18],[13.6,-17.2]]).concat(Bm([[11.8,-12.4],[10.4,-7.4],[10.8,-3],[13.6,-1.6],[16.6,-3.4],[20,-8]]),H([[20,-18.6]])));
    bd_tube(c,H([[16.2,-21],[13.8,-21.3],[11.6,-21.7]]),[0.95,0.9,0.6]);c.fillStyle="rgba(5,5,7,0.95)";c.fill();
    const sp=H([[8,-23.4]])[0];c.beginPath();c.ellipse(sp[0],sp[1],0.9,0.6,-0.3,0,TAU);c.fillStyle="rgba(240,238,232,0.85)";c.fill();},"sp"+(fem?"f":"")));}

/* ---------- a rock dove (Columba livia), the pigeon of the photo experiments: plump, a small head, a short dark bill with a pale cere,
   an orange eye, a green and purple sheen on the neck, pale grey wings with two black bars, a dark band at the tail's tip, short coral-pink legs.
   It stands, walks (its head holding still while its body walks past, then darting forward), pecks, and flies short hops: its wing unfolds
   from its side into a beating wing (a small 3D model, seen a little from above). It turns as a round bird: each part is foreshortened by its
   own depth, so face on its body and head stay round, its bill points at us, both eyes and both legs show. Options: a, t, face (1 right,
   -1 left, between: turning, by way of facing us), and the pose, usually from bd_route(): walk (0..1) and step (its gait, in strides),
   fly (0..1) and flap (wingbeats), peck (0..1), pitch. Its origin is the middle of its body; its toes rest at y 36 ---------- */
const BD_PI={head:[[17.6,-31.8],[22.6,-34.8],[28.6,-33.4],[32,-29.9,1],[31.8,-27.5,1],[29.4,-25.8],[25.6,-23.4]],pv:[22,-26],
  body:[[30.4,-7.4],[29,3.6],[22,12.4],[10,18.4],[-4,19.2],[-14,16.4],[-21,11],[-24.6,3.4],[-21,-4.6],[-10.6,-12.6],[2,-19.4]],
  bill:[[31.6,-30.2],[34.6,-29.6],[37.6,-28.6],[38.6,-27.6,1],[36.6,-27.4],[34,-27.3],[31.6,-27.4]],
  wingF:[[15,-7],[12,-1],[5,5],[-5,8.6],[-17,8.6],[-29,6.4],[-37,4.4],[-42.4,2.4,1],[-33,-1.2],[-21,-5.8],[-8,-11],[4,-14.6],[13,-13]],
  wingE:[[12,0],[13.6,14],[13.2,29],[10,43],[4,57],[-4,70.5],[-11,81.5],[-16.6,89.5,1],[-20.2,80.5],[-20.8,67],[-22.6,53],[-22,36],[-16.6,6]],
  barF:[[[-4,-10.6],[-9.6,-8.6],[-15.2,-6.2],[-20.6,-3.6]],[[-6.4,-5.2],[-12,-3.2],[-17.6,-0.8],[-22.8,1.8]]],
  barE:[[[-3.6,6],[-5.6,16],[-6.6,26],[-6.2,36]],[[-9.6,6],[-11.8,16],[-12.8,26],[-12.4,36]]]};
function pigeon(ctx,x,y,s,col,o){o=o||{};col=col||[200,215,240];const t=o.t,k=o.seed||6,fc=(o.flip?-1:1)*(o.face==null?1:o.face);
  const L={t,br:t==null?0.5:0.5+0.5*Math.sin(t*TAU*0.45+k),ha:0.1*bd_hold(t,71+k,2.2,0.22),bl:bd_blink(t,77+k),walk:o.walk||0,step:o.step||0,fly:o.fly||0,flap:o.flap||0,
    peck:o.peck||0,pitch:o.pitch||0,sheen:t==null?0:Math.sin(t*0.8+k),cz:Math.min(1,Math.abs(fc))};
  bd_draw(ctx,x,y,s,Object.assign({},o,{flip:false,face:fc<0?-1:1,rot:(o.rot||0)-L.pitch}),[-60,-80,50,46],c=>bd_pigeon(c,col,L));}
// its tail, in its own frame (x from its base along it): the feathers fanned by f (0 folded, 1 spread in flight) from a narrow base under the
// coverts, the outer ones a little shorter so the tip is rounded, a shallow notch between the feathers' ends
function bd_piFe(f,u,r){const A=0.04+0.58*f,th=u*A,l=r*(1-0.035*u*u);return[l*Math.cos(th),(3*u+l*Math.sin(th))*(1-0.25*f)];}
function bd_piTailPts(f){const vs=1-0.25*f,b=3,len=30,nd=0.3+0.8*f,fe=(u,r)=>bd_piFe(f,u,r);
  return[[0,-b*vs],fe(-1,len*0.5),fe(-1,len*0.86)].concat([-1,-0.5,0,0.5,1].map((u,i)=>fe(u,i%2?len-nd:len)),[fe(1,len*0.86),fe(1,len*0.5),[0,b*vs]]);}
function bd_pigeon(c,col,L){const G=BD_PI,fly=clamp(L.fly,0,1),wk=clamp(L.walk,0,1),el=0.42*fly;
  // turning (cz: how much of its side we see), each part keeps its girth: seen end on, a part of length l and girth g shows sqrt(cz²l² + (1-cz²)g²)
  const cz=L.cz==null?1:clamp(L.cz,0,1),tn=cz<0.999,sn=Math.sqrt(Math.max(0,1-cz*cz)),K=r=>Math.sqrt(cz*cz+r*r*sn*sn);
  // the gait: each leg planted for 60% of a stride, then swung forward; the head holds still (moving back against the body) then darts ahead
  const sl=11,ph=L.step,hb=(()=>{const q=((ph*2)%1+1)%1;return q<0.6?1-2*q/0.6:-1+2*ease((q-0.6)/0.4);})()*wk*5.2;
  const bob=wk*0.7*Math.abs(Math.sin(ph*TAU)),pk=L.peck,hx=hb+pk*8.6,hy=-pk*13.6+bob*0.4,ha=L.ha*(1-pk)-pk*0.34+fly*0.08;
  const H=p=>bd_rot(p,G.pv[0],G.pv[1],ha,hx,hy+bob),Bm=p=>bd_mv(p,0,bob);
  // each part's own foreshortening, about its middle (x0 goes to x0·cz, the rest squeezed by k): body, head, bill, tail
  const hc=H([[24.8,-29]])[0][0],bc=3,tb=[-21,3.4+bob],kB=K(0.62),kH=K(0.85),kT=K(0.3),mB=x=>bc*cz+(x-bc)*kB,mH=x=>hc*cz+(x-hc)*kH,mT=x=>tb[0]*cz+(x-tb[0])*kT,
    MP=(p,m)=>tn?p.map(q=>{const r=[m(q[0]),q[1]];if(q[2])r.push(1);return r;}):p,mN=(q,w)=>tn?[lerp(mB(q[0]),mH(q[0]),w),q[1]]:q,
    at=(x0,k,fn)=>{if(!tn)return fn();c.save();c.translate(x0*cz,0);c.scale(k,1);c.translate(-x0,0);fn();c.restore();};
  const B=Bm(G.body);B[0][0]+=L.br*0.6;B[1][0]+=L.br*0.8;if(tn){B[2][1]+=1.2*sn;B[3][1]+=2*sn;B[4][1]+=2*sn;B[5][1]+=1.4*sn;}
  const nf=[lerp(27.4,27.4+hx,0.55)+L.br*0.3,lerp(-17,-17+hy,0.5)+bob],nb=[lerp(12,12+hx,0.45),lerp(-25,-25+hy,0.6)+bob];
  const sil=MP(H(G.head),mH).concat([mN(nf,0.6)],MP(B,mB),[mN(nb,0.45)]),fill=bd_fill(c,col,0.25,[-40,-40,36,30]);
  const Tp=bd_rot(bd_piTailPts(fly),0,0,2.92+0.1*fly-L.br*0.01,tb[0],tb[1]);
  // the wings: folded against its side, or spread and beating (down fast, up flexed); the far one behind the body
  const qf=((L.flap%1)+1)%1,th=fly>0.01?(qf<0.5?lerp(1.2,-0.55,ease(qf/0.5)):lerp(-0.55,1.2,ease((qf-0.5)/0.5))):0,fx=fly>0.01&&qf>=0.5?Math.sin(Math.PI*(qf-0.5)/0.5):0;
  const zb=8.4,y0=-11.4,se=Math.sin(el),wc=-14,kW=lerp(K(0.2),cz,fly);
  const wpt=(F,E,side)=>{const sp=E[1]*(1-0.3*fx),ex=E[0]-fx*sp*0.16,ey=y0-sp*Math.sin(th),ez=zb+sp*Math.cos(th),fz=zb+1;
    let X=lerp(F[0],ex,fly);const Y=lerp(F[1]+bob,ey+bob,fly),Z=lerp(fz,ez,fly)*side;if(tn)X=wc*cz+(X-wc)*kW-Z*sn;
    const r=[X,Y+Z*se];if(F[2]&&E[2])r.push(1);return r;};
  const wing=side=>G.wingF.map((F,i)=>wpt(F,G.wingE[i],side)),bars=side=>G.barF.map((bf,j)=>bf.map((F,i)=>wpt(F,G.barE[j][i],side)));
  const Wn=wing(1),Wf=fly>0.01?wing(-1):null,gf=sstep(0,0.3,fly),gs=tn?sstep(0.9,0.999,cz):1;
  // the glow, blurred once into sprites while it stands side on: the body, the folded tail and, apart, the head, which moves on its own;
  // turning, and in flight for the beating wings and the fanned tail, it glows as it is, drawn fresh each frame (the two cross-fade)
  if(gs>0.01){c.save();c.translate(0,bob);bd_glow(c,"pi-b",[-30,-30,34,24],[q=>bd_loop(q,[[27.4,-17]].concat(G.body,[[12,-25]]))],col,2.3,gs);
    if(gf<0.99)bd_glow(c,"pi-t",[-54,-4,-17,16],[q=>bd_loop(q,bd_rot(bd_piTailPts(0),0,0,2.915,-21,3.4))],col,2.3,(1-gf)*gs);c.restore();
    c.save();c.translate(G.pv[0]+hx,G.pv[1]+hy+bob);c.rotate(ha);c.translate(-G.pv[0],-G.pv[1]);bd_glow(c,"pi-h",[14,-38,36,-20],[q=>bd_loop(q,G.head)],col,2.3,gs);c.restore();}
  const gl=Math.max(gf,1-gs);if(gl>0.01){const TpM=MP(Tp,mT),P=[].concat(gs<0.99?sil:[],gf>0.01?Wn:[],Wf||[],TpM),X=P.map(q=>q[0]),Y=P.map(q=>q[1]);
    bd_glowLive(c,[Math.min(...X),Math.min(...Y),Math.max(...X),Math.max(...Y)],[q=>{if(gs<0.99)bd_loop(q,sil);if(gf>0.01)bd_loop(q,Wn);if(Wf)bd_loop(q,Wf);bd_loop(q,TpM);}],col,gs<0.99?2.3:1.9,gl);}
  // legs: a knee hidden in the belly, the heel bending back, the foot planted, stepping or tucked in flight; set apart across its body
  // (seen face on, both show, side by side)
  const leg=(j,dim)=>{const q=((ph+j*0.5)%1+1)%1,d=sl*0.6*wk,hip=[5-3*j,15+bob],z=j?-5.2:5.2,M=(p,dz)=>tn?[p[0]*cz-(z+(dz||0)*Math.sign(z))*sn,p[1]]:p;let fx,fy,lift=0;
    if(q<0.6){fx=d-2*d*q/0.6;fy=0;}else{const v=(q-0.6)/0.4;fx=-d+2*d*ease(v);lift=Math.sin(Math.PI*v)*wk;fy=-3.4*lift;}
    const ft=[hip[0]+fx-1-fly*12,36+fy-fly*15],kn=bd_ik(hip,ft,11.8,11.4,1),cl=lift*0.8+fly;
    c.beginPath();bd_tube(c,[hip,kn,ft].map(M),[1.6,1.05,0.95]);
    const Tt=(dx,dy,w,dz)=>{const tx=ft[0]+dx*(1-cl*0.7),ty=ft[1]+dy+cl*3.2*Math.sign(dx);bd_taper(c,[M(ft),M([lerp(ft[0],tx,0.55),lerp(ft[1],ty,0.5)-0.4],dz*0.55),M([tx,ty],dz)],w,0.3);};
    Tt(8.6,0.4,0.85,0.4);Tt(6.4,1.2,0.75,3.4);Tt(6.2,1,0.7,-2.6);Tt(-4.4,0.3,0.7,0);c.fillStyle=rgba(mix([236,120,120],[12,10,16],dim),0.96);c.fill();};
  const wtop=mix(mix(mix(col,BD_INK,0.55),[6,9,16],0.1),[190,202,222],0.26),wbot=mix(mix([8,12,22],[3,5,10],0.1),[190,202,222],0.26);
  const drawWing=(W,side,far)=>{const d=far?0.3:0;
    bd_formP(c,W,col,bd_lin(c,"pi-w"+col+far+BD_S.f,-40*BD_S.f,-40,36*BD_S.f,30,[[0,rgba(mix(wtop,[4,6,10],d),0.97)],[1,rgba(mix(wbot,[4,6,10],d),0.97)]]),1.6,far?0.62:0.9);
    const tg=c.createLinearGradient(W[2][0],W[2][1],W[7][0],W[7][1]);tg.addColorStop(0.55,"rgba(8,10,18,0)");tg.addColorStop(1,"rgba(8,10,18,"+(far?0.55:0.72)+")");
    c.fillStyle=tg;c.fill();if(far)return;bd_lines(c,bars(side),[4,5,8],0.9,1.25*BD_S.s,0.95*BD_S.s);
    bd_strk(c,[[W[7],W[9]],[W[6],W[10]],[W[5],W[11]]].map(([a,b])=>[a,[lerp(a[0],b[0],0.34),lerp(a[1],b[1],0.34)]]),mix(col,[255,255,255],0.2),0.3,0.6);};
  if(Wf)drawWing(Wf,-1,1);
  leg(1,0.5*cz);
  // the tail: grey, darkening softly to a band at its tip; fanned in flight, its feathers' shafts showing
  at(-21,kT,()=>{bd_formP(c,Tp,col,fill,1.8,0.95);c.save();c.beginPath();bd_loop(c,Tp);c.clip();
    const g=c.createRadialGradient(tb[0],tb[1],0,tb[0],tb[1],30);g.addColorStop(0.62,"rgba(6,8,14,0)");g.addColorStop(0.8,"rgba(6,8,14,0.58)");g.addColorStop(1,"rgba(6,8,14,0.74)");
    c.fillStyle=g;c.fillRect(tb[0]-34,tb[1]-34,68,68);c.restore();
    if(fly>0.05)bd_strk(c,[-0.6,-0.2,0.2,0.6].map(u=>bd_rot([bd_piFe(fly,u,3),bd_piFe(fly,u,15),bd_piFe(fly,u,26)],0,0,2.92+0.1*fly-L.br*0.01,tb[0],tb[1])),mix(col,[255,255,255],0.2),0.3*fly,0.55);});
  leg(0,0);
  // body and head: one contour; the head darker; the neck's sheen, green above and purple below, shifting as it moves; a paler breast
  bd_formP(c,sil,col,fill,2.3,1);
  c.save();c.beginPath();bd_loop(c,sil);c.clip();
  at(hc,kH,()=>{c.save();c.translate(hx,hy+bob);c.fillStyle=bd_lin(c,"pi-hd",16,-34,24,-20,[[0,"rgba(120,134,160,0.28)"],[1,"rgba(120,134,160,0)"]]);c.fillRect(8,-42,30,26);c.restore();});
  const sh=L.sheen*0.5+0.5,g0=mN([18,-26+hy*0.5],0.6),g1=mN([24,-6],0),ng=c.createLinearGradient(g0[0],g0[1],g1[0],g1[1]);ng.addColorStop(0,"rgba(70,200,150,0)");ng.addColorStop(0.25,"rgba(80,206,160,"+(0.34+0.2*sh)+")");
  ng.addColorStop(0.62,"rgba(170,96,210,"+(0.46-0.18*sh)+")");ng.addColorStop(1,"rgba(170,96,210,0)");c.beginPath();
  bd_loop(c,[mN([lerp(13,13+hx,0.6),lerp(-25,-25+hy,0.6)+bob],0.6),mN([lerp(22,22+hx,0.8),lerp(-22,-22+hy,0.8)+bob],0.8),mN([nf[0]+2,nf[1]],0.55),mN([31,-6+bob],0),mN([22,-3+bob],0),mN([10,-10+bob],0.1),mN([7,-17+bob],0.3)]);c.fillStyle=ng;c.fill();
  at(bc,kB,()=>{c.translate(0,bob);c.fillStyle=bd_rad(c,"pi-br",24,2,13,[[0,"rgba(190,196,214,0.2)"],[1,"rgba(190,196,214,0)"]]);c.fillRect(8,-12,30,30);});c.restore();
  // the folded wing over its side (turning to face us, it goes edge on at the flank, and fades there)
  if(fly<=0.01){const wv=tn?sstep(0.05,0.45,cz):1;if(wv>0.01){c.save();c.globalAlpha*=wv;drawWing(Wn,1,0);c.restore();}}
  // the bill with its pale cere (face on, a stub pointing at us), the orange eyes (face on, one each side of the head)
  const bcx=H([[35,-28.6]])[0][0],kBl=K(0.4),mBl=x=>bcx*cz+(x-bcx)*kBl;
  bd_formP(c,MP(H(G.bill),mBl),col,"rgb(30,32,40)",1,0.6);
  const ce=H([[33.2,-29.9]])[0];c.beginPath();c.ellipse(tn?mBl(ce[0]):ce[0],ce[1],1.7*Math.max(0.55,kBl),0.95,-0.12+ha,0,TAU);c.fillStyle="rgba(236,236,230,0.92)";c.fill();
  const e=H([[27.4,-30.6]])[0],ek=tn?Math.sqrt(cz*cz+0.3*sn*sn):1,eye=(ex,al)=>{c.save();c.globalAlpha*=al;c.translate(ex,e[1]);c.scale(ek,Math.max(0.1,L.bl));
    c.fillStyle="rgba(255,150,60,0.35)";c.beginPath();c.arc(0,0,2.8,0,TAU);c.fill();c.fillStyle="rgb(255,138,40)";c.beginPath();c.arc(0,0,1.9,0,TAU);c.fill();
    c.fillStyle="rgb(14,10,8)";c.beginPath();c.arc(0.1,0,1,0,TAU);c.fill();c.fillStyle="rgba(255,250,240,0.9)";c.beginPath();c.arc(0.55*BD_S.f,-0.55,0.38,0,TAU);c.fill();c.restore();};
  eye(tn?e[0]*cz-4.2*sn:e[0],1);if(tn&&cz<0.5)eye(e[0]*cz+4.2*sn,1-sstep(0,0.5,cz));
  if(fly>0.01)drawWing(Wn,1,0);}
/* a flight through timed points, for a scene: keys [[time, x, y, face], ...]; a smooth curve through them (Catmull-Rom), hovering with a
   little wander where it's slow. Returns {x, y, vx, vy, face} (vx, vy in px a second) */
function bd_flight(t,keys){const n=keys.length,K=i=>keys[clamp(i,0,n-1)],R={x:keys[0][1],y:keys[0][2],vx:0,vy:0,face:keys[0][3]==null?1:keys[0][3]};if(t==null)return R;
  let k=0;while(k<n-2&&t>keys[k+1][0])k++;const a=K(k-1),b=K(k),c=K(k+1),d=K(k+2),T0=b[0],T1=c[0],dt=(T1-T0)||1,u=clamp((t-T0)/dt,0,1);
  const cr=(p0,p1,p2,p3)=>0.5*(2*p1+(-p0+p2)*u+(2*p0-5*p1+4*p2-p3)*u*u+(-p0+3*p1-3*p2+p3)*u*u*u),dcr=(p0,p1,p2,p3)=>0.5*((-p0+p2)+2*(2*p0-5*p1+4*p2-p3)*u+3*(-p0+3*p1-3*p2+p3)*u*u);
  if(t<=keys[0][0]||t>=keys[n-1][0]){const e=t<=keys[0][0]?keys[0]:keys[n-1];R.x=e[1];R.y=e[2];R.face=e[3]==null?1:e[3];}
  else{R.x=cr(a[1],b[1],c[1],d[1]);R.y=cr(a[2],b[2],c[2],d[2]);R.vx=dcr(a[1],b[1],c[1],d[1])/dt;R.vy=dcr(a[2],b[2],c[2],d[2])/dt;
    R.face=lerp(b[3]==null?1:b[3],c[3]==null?1:c[3],sstep(0,1,u));}
  const w=1-clamp(Math.hypot(R.vx,R.vy)/220,0,1);R.x+=w*(4*Math.sin(t*2.3)+2*Math.sin(t*5.1+1));R.y+=w*(5*Math.sin(t*3.1+1)+2*Math.sin(t*6.7));
  R.vx+=w*(9.2*Math.cos(t*2.3));R.vy+=w*(15.5*Math.cos(t*3.1+1));return R;}
/* a bird's errands, for a scene: keys [[time, x, y, peck], ...], the times it arrives. Between two keys it walks (short, level moves, at a
   pigeon's pace: about three steps a second) or flies a hop (long or steep ones: a second or more, low), in the last moments before it's due;
   if it must turn to go, it turns first, on the ground, by way of facing us; it pecks on arriving if peck. s is its size (for its stride).
   Returns its place and pose, for pigeon(): {x, y, face, walk, step, fly, flap, peck, pitch} */
function bd_route(t,keys,s){s=s||1;const n=keys.length,R={x:keys[0][1],y:keys[0][2],face:1,walk:0,step:0,fly:0,flap:0,peck:0,pitch:0};if(t==null||n<2)return R;
  const seg=[];let face=1;{const d0=keys[1][1]-keys[0][1];if(Math.abs(d0)>24&&d0<0)face=-1;}
  for(let k=1;k<n;k++){const A=keys[k-1],B=keys[k],dx=B[1]-A[1],dy=B[2]-A[2],dist=Math.hypot(dx,dy),fl=dist>150||Math.abs(dy)>40,f0=face;
    if(Math.abs(dx)>24)face=dx<0?-1:1;const tu=f0!==face?0.45:0,room=B[0]-A[0]-(A[3]?0.38:0.05)-tu;
    const D=Math.max(0.05,Math.min(fl?clamp(0.75+dist/800,1,1.4):Math.max(0.4,dist/(s*33)),room));seg.push({A,B,dx,dy,dist,fl,T0:B[0]-D,T1:B[0],f0,f1:face,tu});}
  let j=0;while(j<seg.length-1&&t>=seg[j+1].T0-seg[j+1].tu-0.02)j++;const S=seg[j];
  R.face=S.tu?lerp(S.f0,S.f1,sstep(S.T0-S.tu,S.T0-0.05,t)):S.f1;
  // pecking just after arriving somewhere it meant to peck: a quick jab, the bill striking about 0.13 s in, and back
  keys.forEach(K=>{if(K[3]){const d=t-K[0];if(d>-0.02&&d<0.38)R.peck=Math.max(R.peck,d<0.13?sstep(-0.02,0.13,d):1-sstep(0.15,0.38,d));}});
  if(t<=S.T0){R.x=S.A[1];R.y=S.A[2];return R;}
  if(t>=S.T1){R.x=S.B[1];R.y=S.B[2];return R;}
  const u=(t-S.T0)/(S.T1-S.T0);
  if(S.fl){const e=ease(u),arc=0.1*S.dist;R.x=lerp(S.A[1],S.B[1],e);R.y=lerp(S.A[2],S.B[2],e)-Math.sin(Math.PI*u)*arc;
    R.fly=sstep(0,0.2,u)*(1-sstep(0.8,1,u));R.flap=(t-S.T0)*4.6;R.pitch=0.2*sstep(0,0.12,u)*(1-sstep(0.12,0.45,u))-0.16*sstep(0.7,0.9,u)*(1-sstep(0.9,1,u));}
  else{const e=u-Math.sin(TAU*u)/TAU;R.x=lerp(S.A[1],S.B[1],e);R.y=lerp(S.A[2],S.B[2],e);R.walk=sstep(0,0.12,u)*(1-sstep(0.88,1,u));R.step=S.dist*e/(22*s);}
  return R;}

/* ---------- a honeybee (Apis mellifera), a forager in flight: head with a big compound eye and elbowed antennae, a round furry thorax,
   a narrow waist, a banded abdomen tapering to its tip, legs hanging (the hind ones carry pollen), and two pairs of wings beating too fast
   to see: a blur, with the wing caught now here, now there. Options: a, col (its rim), face (1 right, -1 left, between: turning),
   pitch (radians, nose up), vx and vy (its speed, px a second: it leans into its flight) ---------- */
const BD_BEE={thx:[[-6.4,-2.4],[-4.4,-6.2],[0.4,-7.4],[4.8,-5.6],[6.8,-1],[5.8,3.8],[1.2,6.2],[-4.2,4.8]],
  head:[[7.2,-1.8],[8.8,-4],[11,-4.2],[13,-2],[13.8,1.4],[12.8,4.6],[10.2,5.6],[8,3.6]],
  eye:[[8.6,-2.8],[10,-3.6],[11.2,-2.4],[11.2,0.6],[10.6,3.2],[9.4,3.4],[8.8,0.6]],
  abd:[[-6.2,-1.6],[-10.2,-5.4],[-16.4,-6.8],[-22.2,-5.4],[-26.4,-1.8],[-28.8,3.2,1],[-25.2,6.4],[-19,8],[-12.6,7.4],[-8,4]],
  fw:[[0,0],[5,-1.9],[11,-2.7],[16.6,-2.2],[20.2,-0.4],[20.4,1.4],[17,2.6],[10,2.7],[4,2]],hw:[[0,0],[4,-1.2],[9,-1.6],[12.6,-0.8],[13,0.8],[9,1.8],[3,1.4]],
  fuzz:[[-5.4,-4],[-3.6,-6.6],[-0.8,-7.8],[2,-7.6],[4.4,-6.2],[6.2,-3.6],[-6.8,0.8],[6.6,1.6],[3.8,5.6]].map(([px,py],i)=>{const a=Math.atan2(py+0.5,px),r=0.9+0.5*hash(i,3);
    return[[px,py],[px+Math.cos(a+0.3)*r,py+Math.sin(a+0.3)*r]];})};
function bee(ctx,x,y,s,t,o){o=o||{};const col=o.col||[255,214,90];t=t||0;
  const vx=o.vx||0,vy=o.vy||0,fc=o.face==null?(vx<0?-1:1):o.face,sp=Math.hypot(vx,vy);
  // it hovers nose up, abdomen low; flying fast it levels out and leans into the climb or the dive
  const pitch=o.pitch!=null?o.pitch:0.34*(1-clamp(sp/260,0,1))+clamp(-vy/420,-0.3,0.3)+0.04*Math.sin(t*2.3);
  // turning (face between -1 and 1), it's foreshortened part by part, so its round head and thorax stay round as it faces us
  bd_draw(ctx,x,y,s,Object.assign({},o,{face:fc<0?-1:1,rot:-pitch}),[-32,-26,28,24],c=>bd_bee(c,col,t,Math.min(1,Math.abs(fc))));}
function bd_bee(c,col,t,cz){const G=BD_BEE,fill=bd_fill(c,col,0.45,[-26,-10,16,10]);cz=cz==null?1:clamp(cz,0,1);
  // (the wing caught by the eye: somewhere new each frame of the film, as a strobe would catch a beat of 230 a second)
  const wb=[-0.4,-7],fr=Math.floor(t*30+1e-6),A0=-2.45,A1=-0.5,wa=lerp(A0+0.12,A1-0.12,hash(fr,9)),wf=lerp(A0+0.12,A1-0.12,hash(fr,13));
  // turned from us by the angle whose cosine is cz, each part keeps its girth: seen end on, a part of length l and girth g shows sqrt(cz²l² + (1-cz²)g²)
  // and its paired limbs, set out at an angle b to either side, swing apart: the near one's reach is cos(ph+b), the far one's cos(ph-b) (sg 1, -1),
  // so face on its wings, legs and antennae spread to both sides
  // (a limb pointing back, a hind leg or a wing at the back of its beat, swings the other way from one pointing forward: sg flips for it)
  const sn=1-cz*cz,K=r=>Math.max(0.04,Math.sqrt(cz*cz+r*r*sn)),kH=K(1.3),kT=K(0.92),kA=K(0.58),ph=Math.acos(cz),
    sk=(b,sg)=>{const k=Math.cos(ph+sg*b)/Math.cos(b);return(k<0?-1:1)*Math.max(0.04,Math.abs(k));};
  const at=(x0,x1,k,fn)=>{if(cz>0.999)return fn();c.save();c.translate(x1,0);c.scale(k,1);c.translate(-x0,0);fn();c.restore();};
  const HD=f=>at(10.5,10.5*cz,kH,f),TX=f=>at(0.2,0.2*cz,kT,f),AB=f=>at(-17.5,-17.5*cz,kA,f),
    WG=(sg,an,f)=>at(wb[0],0.2*cz+(wb[0]-0.2)*kT,sk(0.7,Math.cos(an)>=0?sg:-sg),f),LG=(sg,f)=>at(0.2,0.2*cz,sk(0.6,sg),f),AN=(sg,f)=>at(11.8,10.5*cz+1.3*kH,sk(0.5,sg),f);
  // the beat, too fast to see: a faint fan where the wings sweep, the wing at the end of its beat, and caught once between
  const fan=(sg,dim)=>[[A0-0.1,-Math.PI/2],[-Math.PI/2,A1+0.1]].forEach(([a0,a1])=>WG(sg,(a0+a1)/2,()=>{c.save();c.translate(wb[0],wb[1]);c.globalAlpha*=dim;c.fillStyle=bd_g(c,"bee-fan",q=>{const g=q.createRadialGradient(0,0,3,0,0,20.5);g.addColorStop(0,"rgba(210,232,255,0)");
      g.addColorStop(0.55,"rgba(210,232,255,0.035)");g.addColorStop(1,"rgba(210,232,255,0.075)");return g;});c.beginPath();c.moveTo(0,0);c.arc(0,0,20.5,a0,a1);c.closePath();c.fill();c.restore();}));
  const wing=(sg,pts,an,a)=>WG(sg,an,()=>{c.save();c.translate(wb[0],wb[1]);c.rotate(an);c.beginPath();bd_loop(c,pts);c.fillStyle="rgba(214,236,255,"+0.14*a+")";c.fill();
    c.lineWidth=0.8/BD_S.s;c.strokeStyle="rgba(222,240,255,"+0.7*a+")";c.stroke();c.beginPath();bd_path(c,[[1.6,-0.4],[8,-1.3],[14,-1]]);bd_path(c,[[2.4,0.7],[8,0.7],[12.4,1.6]]);
    c.lineWidth=0.45/BD_S.s;c.strokeStyle="rgba(222,240,255,"+0.45*a+")";c.stroke();c.restore();});
  fan(-1,0.35);wing(-1,G.fw,wf,0.3);
  // the legs, slender and hanging: the far ones darker; the hind leg's broad shin carries a ball of pollen
  // (the fore and middle legs reach forward, the hind leg back: face on, each side's legs spread to its own side)
  const legs=(sg,dx,dy,dim)=>{const fs=rgba(mix(mix(col,[70,50,24],0.55),[6,8,12],dim),0.96);
    LG(sg,()=>{c.beginPath();bd_tube(c,[[3.2+dx,4.6+dy],[5.4+dx,7.6+dy],[8+dx,8+dy],[9.6+dx,9.6+dy]],[0.5,0.42,0.32,0.22]);
      bd_tube(c,[[0.8+dx,5.4+dy],[1.6+dx,9.4+dy],[0.2+dx,12.6+dy],[0.8+dx,15.4+dy]],[0.5,0.42,0.32,0.22]);c.fillStyle=fs;c.fill();});
    LG(-sg,()=>{c.beginPath();bd_tube(c,[[-2.4+dx,4.6+dy],[-4.8+dx,9+dy],[-7.4+dx,13.6+dy],[-8.8+dx,17.2+dy],[-9.4+dx,19.6+dy]],[0.55,0.5,0.95,0.4,0.22]);c.fillStyle=fs;c.fill();});};
  // (both hind legs carry a load of pollen, a lump that stays round however the leg turns: the far one's darker)
  const pol=(sg,x,y,fs)=>{const k=cz>0.999?1:sk(0.6,-sg);c.beginPath();c.ellipse(0.2*cz+(x-0.2)*k,y,1.5*Math.max(0.75,Math.abs(k)),2.1,0.5*Math.sign(k),0,TAU);c.fillStyle=fs;c.fill();};
  legs(-1,-1.8,-0.4,0.6);pol(-1,-8.8,13,"rgba(128,86,34,0.95)");
  AB(()=>bd_glow(c,"bee-a",[-30,-9,-5,9],[q=>bd_loop(q,G.abd)],col,1.8));TX(()=>bd_glow(c,"bee-t",[-8,-9,8,8],[q=>bd_loop(q,G.thx)],col,1.8));
  HD(()=>bd_glow(c,"bee-h",[6,-6,15,7],[q=>bd_loop(q,G.head)],col,1.8));
  // the abdomen: each band amber in front, dark behind, a line of pale hair at its front edge
  AB(()=>{bd_formP(c,G.abd,col,fill,1.8,1);
    c.save();c.beginPath();bd_loop(c,G.abd);c.clip();c.beginPath();
    [[-9.4,1],[-13.2,0.85],[-17,0.55],[-20.8,0.3],[-24.4,0.14]].forEach(([bx,k])=>{c.beginPath();bd_tube(c,[[bx+0.4,-8],[bx-0.6,-3],[bx-0.9,1.6],[bx-0.4,6],[bx+0.4,9]],[1,1.05,1.1,1.05,1]);
      c.fillStyle="rgba(226,150,58,"+0.7*k+")";c.fill();});
    bd_strk(c,[[[-8,-7],[-9.2,-2],[-9.5,2.4],[-8.8,7]],[[-11.8,-7],[-13,-2],[-13.3,2.4],[-12.6,7]],[[-15.6,-7],[-16.8,-2],[-17.1,2.4],[-16.4,7]]],[255,232,180],0.3,0.55);
    c.fillStyle=bd_lin(c,"bee-hl",-18,-7,-18,8,[[0,"rgba(255,240,200,0.16)"],[0.45,"rgba(255,240,200,0)"]]);c.fillRect(-30,-8,26,18);c.restore();});
  // the thorax: round and furry, lit ginger at the top; the near legs, the pollen
  TX(()=>{bd_formP(c,G.thx,col,fill,1.8,1);
    c.beginPath();bd_loop(c,G.thx);c.fillStyle=bd_rad(c,"bee-thx",-1,-5,9,[[0,"rgba(214,160,86,0.72)"],[1,"rgba(214,160,86,0)"]]);c.fill();
    bd_strk(c,G.fuzz,[240,200,130],0.6,0.4);});
  legs(1,0,0,0);pol(1,-7,13.4,"rgb(246,182,70)");c.beginPath();const pk=cz>0.999?1:sk(0.6,-1);c.ellipse(0.2*cz+(-7.4-0.2)*pk,12.7,0.6,0.8,0.5,0,TAU);c.fillStyle="rgba(255,236,150,0.85)";c.fill();
  // the head: a big compound eye, elbowed antennae (the far one darker), mouthparts folded under
  const aw=0.12*Math.sin(t*1.9)+0.06*Math.sin(t*3.7),ant=(dx,dy,ph,cl)=>{c.beginPath();bd_tube(c,[[11.8+dx,-2.4+dy],[13+dx,-5+dy],[14+dx,-7.2+dy]],[0.36,0.32,0.3]);
    bd_tube(c,bd_rot([[14+dx,-7.2+dy],[16.6+dx,-7.4+dy],[19+dx,-6+dy],[20.4+dx,-3.8+dy]],14+dx,-7.2+dy,aw+ph),[0.32,0.3,0.28,0.26]);c.fillStyle=cl;c.fill();};
  AN(-1,()=>ant(-1.2,0.2,0.25,rgba(mix(col,[20,16,10],0.6),1)));
  const Hq=cz>0.999?G.head:G.head.map(q=>[10.5+(q[0]-10.5)*(1-0.34*(1-cz)*clamp((q[1]+1)/6.5,0,1)),q[1]]),Sn=Math.sqrt(sn),ek=Math.sqrt(cz*cz+0.3*sn),
    eye=(ex,al)=>{if(al<=0.01)return;c.save();c.globalAlpha*=al;c.translate(ex,0);c.scale(ek,1);c.translate(-10,0);c.beginPath();bd_loop(c,G.eye);
      c.fillStyle=bd_lin(c,"bee-eye",9,-4,13,4,[[0,"rgba(92,80,64,0.95)"],[1,"rgba(26,22,20,0.95)"]]);c.fill();c.fillStyle="rgba(255,244,210,0.5)";c.beginPath();c.ellipse(9.9,-2,0.6,0.4,-0.5,0,TAU);c.fill();c.restore();};
  HD(()=>{bd_formP(c,Hq,col,fill,1.7,1);bd_strk(c,[[[11.8,-2.6],[12.9,-3.2]],[[12.6,-0.4],[13.8,-0.6]],[[12.4,2.4],[13.4,2.8]]],[240,200,130],0.55,0.35);
    // (face on, the hairy face between the eyes)
    if(cz<0.6){c.save();c.globalAlpha*=1-sstep(0.05,0.6,cz);c.beginPath();bd_loop(c,Hq);c.clip();c.fillStyle=bd_rad(c,"bee-face",10.8,0.4,4.4,[[0,"rgba(214,160,86,0.5)"],[1,"rgba(214,160,86,0)"]]);c.fillRect(5,-6,12,13);c.restore();}});
  eye(10*cz-3.1*Sn,1);if(cz<0.6)eye(10*cz+3.1*Sn,1-sstep(0.05,0.6,cz));
  AN(1,()=>ant(0,0,0,rgba(mix(col,[40,30,16],0.3),1)));
  HD(()=>bd_lines(c,[[[11.6,5.2],[12.2,7],[11.4,8.4]]],mix(col,[40,30,16],0.45),0.9,0.4,0.2));
  // the near wings over the body: at the back of the beat, and caught
  fan(1,0.45);wing(1,G.fw,A0,0.24);wing(1,G.fw,lerp(A0,A1,0.5),0.16);wing(1,G.fw,A1,0.22);wing(1,G.hw,wa+0.2,0.35);wing(1,G.fw,wa,0.55);}

/* ---------- a martial eagle (Polemaetus bellicosus), soaring, seen from below as the vervets see it: long broad wings with six slotted
   "fingers" at each tip curling up, a short broad tail, a big head with a hooked bill; a dark head and bib, a white belly with dark spots,
   a dark underwing (coverts darkest) with barred flight feathers. It's a small 3D model (x forward, y to its right wing, z up), turned and
   banked, projected for a viewer looking up; the wings flex, the tail twists to steer, the head turns. Options: a, t, yaw (its heading:
   0 toward us, negative to our left), bank (radians, right wing down), elev (how steeply we look up), seed ---------- */
// a wing, in its own frame (x forward, y out along it): long and broad, the leading edge nearly straight out to a broad hand, the trailing edge
// held back, bulging a little at the secondaries and pinched at the body; six slotted primaries ("fingers") spread across the hand's whole
// width, the middle ones longest, fanned by sp
function bd_eagleWing(sp){const o=[[7,6.2],[10.4,16],[12,27],[12.4,38],[11.8,48],[10.8,56],[9.4,62]],F=[],n=6;
  // the six emarginated primaries (P10, the outermost, first), their roots across the hand
  for(let i=0;i<n;i++){const u=i/(n-1),rx=lerp(7.4,-19.6,u),ry=lerp(63.4,66.2,u)+2.4*u*(1-u),an=(-0.34+u*0.98)*sp,l=[13.4,18.6,21,20.4,17.2,12.6][i],
    w0=[2.45,2.85,3.05,3.05,2.95,2.85][i],dx=-Math.sin(an),dy=Math.cos(an),nx=dy,ny=-dx,q=(k,v)=>{const b=-0.1*l*k*k;return[rx+dx*l*k+nx*(v+b),ry+dy*l*k+ny*(v+b),k*k*l];};
    F.push({f:[q(0.02,w0),q(0.45,w0*0.93),q(0.8,w0*0.72)],tip:[q(0.95,w0*0.4),q(1,-w0*0.06),q(0.94,-w0*0.52)],b:[q(0.5,-w0*0.9),q(0.1,-w0)],axis:[q(0.1,0),q(0.55,0),q(0.9,0)],dk:[q(0.62,0),q(0.8,0),q(0.96,0)],
      tp:q(1.02,-w0*0.1),l});}
  const tr=[[-22.2,66],[-23.2,58],[-24,48],[-24.4,37],[-23.4,25],[-19.8,14],[-14.4,6.4]];return{lead:o,F,tr};}
const BD_EG={body:[[30.8,0,1],[29,3.4],[25,6],[19.8,7.6],[12.6,9.8],[3,11.2],[-7,10.6],[-14.4,8.4],[-19.2,6.6],[-19.2,-6.6],[-14.4,-8.4],[-7,-10.6],[3,-11.2],[12.6,-9.8],[19.8,-7.6],[25,-6],[29,-3.4]],
  tail:[[-16.6,6.6],[-26,8.2],[-34.6,9],[-39,7.2],[-40.8,3.4],[-41.2,0],[-40.8,-3.4],[-39,-7.2],[-34.6,-9],[-26,-8.2],[-16.6,-6.6]],
  spots:[[-3,3.4],[-6,-4],[-9.6,1.2],[-12.6,4.6],[-12,-3],[-2,-2],[-15.2,-0.8],[-7.6,6.4],[-5,-7],[0.6,5.8]],
  cov:[[6.6,7],[9.8,17],[11.2,28],[11.6,39],[11,49],[9.8,57],[7.2,62],[-1.4,60.4],[-7.6,47],[-9,28],[-6.8,8]],W1:bd_eagleWing(1),
  belly:[[7,-9.4],[1.6,-5.4],[0.4,0],[1.6,5.4],[7,9.4],[3,10.4],[-7,9.9],[-14,7.9],[-18.4,6],[-18.4,-6],[-14,-7.9],[-7,-9.9],[3,-10.4]]};
function eagle(ctx,x,y,s,col,o){o=o||{};col=col||EAG;const t=o.t,k=o.seed||5,tt=t==null?0:t,b0=o.bank==null?0.12:o.bank;
  const L={yaw:(o.yaw==null?-0.62:o.yaw)*(o.flip?-1:1)+(t==null?0:0.07*Math.sin(tt*0.31+k)),bank:b0+(t==null?0:0.05*Math.sin(tt*0.47+k)),b0,
    elev:o.elev==null?1.2:o.elev,pitch:0.08,dih:0.11+(t==null?0:0.022*Math.sin(tt*0.74+k)),curl:0.018+(t==null?0:0.0045*Math.sin(tt*0.74+k+0.9)),
    sp:1+(t==null?0:0.05*Math.sin(tt*0.93+k)),flex:t==null?0:0.035*Math.sin(tt*0.61+k),tw:t==null?0:0.14*Math.sin(tt*0.57+k*2),hd:t==null?0.1:0.34*bd_hold(t,61+k,2.8,0.5)};
  // (its pose first, so it's drawn within its actual reach: a fading eagle is drawn whole on a layer, and a smaller layer costs less)
  const E=bd_eagleGeo(L),P=[].concat(...E.wings.map(w=>w.Q),E.tl,E.bb),X=P.map(q=>q[0]),Y=P.map(q=>q[1]);
  bd_draw(ctx,x,y,s,Object.assign({},o,{flip:false,face:1}),[Math.min(...X)-6,Math.min(...Y)-6,Math.max(...X)+6,Math.max(...Y)+6],c=>bd_eagle(c,col,L,E));}
// the eagle in 3D, for a pose L: its projection P, its wings (outline, feather lines), tail and body (with the turned head), each on screen
function bd_eagleGeo(L){
  // the frame: heading, pitch, bank; then a viewer looking up at elev
  const cy=Math.cos(L.yaw),sy=Math.sin(L.yaw),f0=[sy,0,cy],r0=[-cy,0,sy],u0=[0,1,0],cp=Math.cos(L.pitch),spp=Math.sin(L.pitch);
  const f1=[f0[0]*cp+u0[0]*spp,f0[1]*cp+u0[1]*spp,f0[2]*cp+u0[2]*spp],u1=[u0[0]*cp-f0[0]*spp,u0[1]*cp-f0[1]*spp,u0[2]*cp-f0[2]*spp];
  const cb=Math.cos(L.bank),sb=Math.sin(L.bank),r2=[r0[0]*cb-u1[0]*sb,r0[1]*cb-u1[1]*sb,r0[2]*cb-u1[2]*sb],u2=[u1[0]*cb+r0[0]*sb,u1[1]*cb+r0[1]*sb,u1[2]*cb+r0[2]*sb];
  const ce=Math.cos(L.elev),se=Math.sin(L.elev);
  const P=(x,y,z)=>{const X=x*f1[0]+y*r2[0]+z*u2[0],Y=x*f1[1]+y*r2[1]+z*u2[1],Z=x*f1[2]+y*r2[2]+z*u2[2];return[X,-(Y*ce+Z*se),Y*se-Z*ce];};
  const PP=(pts,z,side)=>pts.map(q=>{const r=P(q[0],q[1]*(side||1),(q[2]||0)+(z||0));const o=[r[0],r[1]];if(q[3])o.push(1);return o;});
  // a wing: its outline in 3D, lifted in a shallow V (dih) and curling up toward the tips; side 1 right, -1 left
  const W=Math.abs(L.sp-1)<1e-6?BD_EG.W1:bd_eagleWing(L.sp),wz=y=>L.dih*y+L.curl*Math.max(0,y-44)*Math.max(0,y-44)*0.5,fx=(x,y)=>x-L.flex*Math.max(0,y-30);
  const lift=q=>[fx(q[0],q[1]),q[1],wz(q[1])+(q[2]||0)*L.curl*14],on=(q,sd)=>{const r=P(q[0],q[1]*sd,q[2]);return[r[0],r[1]];};
  const wing=side=>{const pts=[],bars=[];
    W.lead.forEach(q=>pts.push(lift([q[0],q[1]])));
    W.F.forEach(F=>{F.f.forEach(q=>{const v=lift(q);v.push(0.5,0);pts.push(v);});F.tip.forEach((q,j)=>{const v=lift(q);v.push(0.45,j===1?1:0);pts.push(v);});F.b.forEach(q=>{const v=lift(q);v.push(0.5,0);pts.push(v);});bars.push(F.axis.map(lift));});
    W.tr.forEach(q=>pts.push(lift([q[0],q[1]])));
    const hull=[].concat(W.lead,W.F.map(F=>F.tp),W.tr).map(q=>on(lift(q),side));
    return{Q:pts.map(q=>{const o=on(q,side);if(q[4]||q[3])o.push(q[4]?1:0,q[3]||1);return o;}),hull,bars:bars.map(b=>b.map(q=>on(q,side))),dk:W.F.map(F=>F.dk.map(q=>on(lift(q),side))),
      cov:PP(BD_EG.cov.map(lift),-0.2,side),bl:[0.35,0.62,0.88].map(v=>PP([[lerp(-9,-13.6,v),9],[lerp(-9,-22.2,v),24],[lerp(-9,-23.2,v),40],[lerp(-8.4,-22.6,v),54],[lerp(-6,-21,v),64]].map(lift),0,side)),
      side,depth:P(-4,40*side,wz(40))[2]};};
  const hr=L.hd,c2=Math.cos(hr),s2=Math.sin(hr),R=q=>{const x0=q[0]-13,r=[13+x0*c2-q[1]*s2,x0*s2+q[1]*c2];if(q[2])r.push(0,1);return r;};
  return{P,PP,wings:[wing(1),wing(-1)].sort((a,b)=>b.depth-a.depth),tl:PP(BD_EG.tail.map(q=>[q[0],q[1]*(1+0.08*Math.abs(L.tw)),L.tw*4*q[1]/9]),-1.2),
    bb:PP(BD_EG.body.map(q=>q[0]<13?q:R(q)),-3.2),bodyDepth:P(0,0,-3.2)[2],c2,s2};}
function bd_eagle(c,col,L,E){E=E||bd_eagleGeo(L);const{P,PP,wings,tl,bb,bodyDepth,c2,s2}=E;
  const fill=bd_fill(c,col,0.3,[-60,-60,60,60]),dk=rgba(mix(mix(col,BD_INK,0.55),[6,9,16],0.72),0.95),
    wf=bd_lin(c,"eg-w"+col,-60,-60,60,60,[[0,rgba(mix(mix(mix(col,BD_INK,0.55),[6,9,16],0.3),[180,198,222],0.2),0.97)],[1,rgba(mix([8,12,22],[180,198,222],0.2),0.97)]]),
    tf=bd_lin(c,"eg-t"+col,-60,-60,60,60,[[0,rgba(mix(mix(mix(col,BD_INK,0.55),[6,9,16],0.3),[200,218,240],0.26),0.97)],[1,rgba(mix([8,12,22],[200,218,240],0.26),0.97)]]);
  // its glow, made fresh from its pose each frame (it flexes, banks and turns its head, so no kept sprite would fit it)
  {const P=[].concat(...wings.map(w=>w.Q),tl,bb),X=P.map(q=>q[0]),Y=P.map(q=>q[1]);
    bd_glowLive(c,[Math.min(...X),Math.min(...Y),Math.max(...X),Math.max(...Y)],[q=>{wings.forEach(w=>bd_loop(q,w.hull));bd_loop(q,tl);bd_loop(q,bb);}],col,2.1,1);}
  // a wing: coverts darkest, the flight feathers barred, a dark band near the trailing edge; the fingers darken to their tips
  const drawWings=ws=>{if(!ws.length)return;ws.forEach(w=>{bd_formP(c,w.Q,col,wf,2.1,1);c.beginPath();bd_loop(c,w.cov);c.fillStyle=dk;c.fill();});
    bd_strk(c,[].concat(...ws.map(w=>w.bl.slice(0,2).concat(w.bars))),[20,30,48],0.45,0.8);bd_lines(c,[].concat(...ws.map(w=>[w.bl[2]].concat(w.dk))),[10,16,28],0.66,1.1,0.8);};
  drawWings(wings.filter(w=>w.depth>=bodyDepth-2));
  // the tail, barred, twisting as it steers
  bd_formP(c,tl,col,tf,1.9,1);
  bd_strk(c,[[-24,7.4],[-30,8],[-36,7.6]].map(([xx,h])=>PP([[xx,-h],[xx-0.6,0],[xx,h]].map(q=>[q[0],q[1],L.tw*4*q[1]/9]),-1.2)),[20,30,48],0.55,0.9);
  // the body and head: a dark hood and bib, a white belly with dark spots; the head turns
  bd_formP(c,bb,col,fill,2.1,1);
  c.beginPath();bd_loop(c,PP(BD_EG.belly,-3.2));c.fillStyle="rgba(214,228,246,0.5)";c.fill();
  c.beginPath();BD_EG.spots.forEach(q=>{const p=P(q[0],q[1],-3.4);c.moveTo(p[0]+0.9,p[1]);c.ellipse(p[0],p[1],0.9,0.75,0,0,TAU);});c.fillStyle="rgba(12,18,30,0.8)";c.fill();
  drawWings(wings.filter(w=>w.depth<bodyDepth-2));
  // the hooked bill; the eye on the side it shows
  const R=q=>{const x0=q[0]-13;return[13+x0*c2-q[1]*s2,x0*s2+q[1]*c2,q[2]];};
  const B=PP([[26.6,1.8,0],[30.2,1.1,-0.4],[32.2,0,-1.7],[30.2,-1.1,-0.4],[26.6,-1.8,0]].map(R),-3.2);c.beginPath();bd_loop(c,B);c.fillStyle="rgba(24,28,36,0.95)";c.fill();
  c.lineWidth=0.9/BD_S.s;c.strokeStyle=rgba(col,0.8);c.stroke();
  const Ey=[1,-1].map(sd=>{const x0=23.6-13,yy=4.8*sd;return P(13+x0*c2-yy*s2,x0*s2+yy*c2,-1.4);}).sort((a,b)=>a[2]-b[2])[0];bd_eye(c,Ey[0],Ey[1],0.95,col,1);}

/* ---------- an emperor penguin (Aptenodytes forsteri), standing: upright and heavy-bellied, black head and back, a white front washed yellow on
   the upper breast, a bright orange-yellow patch at the side of the neck, a long slender down-curved bill with an orange-pink plate below,
   narrow flippers, a short stiff tail propping it, short black feet. It sways on its feet, turns its head, stirs a flipper.
   Options: t, col (its rim), seed ---------- */
const BD_PG={head:[[-6,-50.4],[0,-53.2],[6,-52.2],[10.4,-49.6],[12.6,-47.3,1],[12.2,-44.1,1],[10,-41.4],[-8.8,-44.8]],
  body:[[9.2,-37],[12.4,-28.6],[16,-15],[19.8,0.6],[21.6,17.2],[18.4,32.4],[11.8,40.8],[1,42.8],[-8.8,41.4],[-16.6,31],[-19,12.6],[-16.6,-10],[-12.2,-27.4],[-9.6,-39]],
  flip:[[-2.6,-27.4],[0.6,-22],[3.4,-12.6],[5.4,-2],[6.8,7.6],[7.2,13.6,1],[4.6,9.4],[0.8,1],[-2.6,-8.4],[-4.8,-17.8],[-5,-24.6]],
  bill:[[12,-47.9],[16.8,-47.5],[21.8,-46.1],[26.6,-43.4,1],[21.8,-44.1],[16.8,-44.3],[12,-44.4]],
  tail:[[-8.6,36.6],[-13.4,41.2],[-18.2,45.2,1],[-14.2,44.6],[-9.4,42.6]],
  foot:[[0,40],[6,41.4],[11,43],[14.2,44.8,1],[10,45.4],[4,45.6],[-1,44.8]]};
function penguin(ctx,x,y,s,o){o=o||{};const col=o.col||[200,220,245],t=o.t,k=o.seed||3;
  const L={br:t==null?0.5:0.5+0.5*Math.sin(t*TAU*0.3+k),sw:t==null?0:0.022*Math.sin(t*0.9+k)+0.008*Math.sin(t*2.1),ha:0.1*bd_hold(t,41+k,3.2,0.45),hy:bd_hold(t,43+k,4.1,0.6),
    fl:t==null?0:0.06*Math.sin(t*1.3+k)+0.1*bd_pulse(t,45+k,5.5,0.3,1.2),bl:bd_blink(t,47+k)};
  bd_draw(ctx,x,y,s,o,[-22,-58,30,50],c=>bd_penguin(c,col,L));}
function bd_penguin(c,col,L){const G=BD_PG;
  // it sways on its feet (the whole bird turns about them); its head turns toward us (hy>0) or away, the bill shortening as it does
  c.translate(2,44);c.rotate(L.sw);c.translate(-2,-44);
  const yw=L.hy*0.35,Hf=p=>bd_rot(p.map(q=>{const r=[q[0]>4?4+(q[0]-4)*(1-Math.abs(yw)*0.35):q[0],q[1]];if(q[2])r.push(1);return r;}),2,-40,L.ha,yw*1.5,0);
  const B=G.body.map((q,i)=>i>=1&&i<=4?[q[0]+L.br*0.6*(i===3?1:0.6),q[1]]:q),hd=Hf(G.head),sil=hd.slice(0,7).concat(B,hd.slice(7));
  const fill=bd_fill(c,col,0.35,[-20,-50,20,40]),inkF=bd_fill(c,col,0.6,[-20,-50,20,40]),Fp=p=>bd_rot(p,-3.6,-25.4,-L.fl,0,0);
  bd_glow(c,"pg",[-20,-56,24,47],[q=>{bd_loop(q,G.tail);bd_loop(q,G.head.slice(0,7).concat(G.body,G.head.slice(7)));}],col,2.3);
  // the far foot, the tail, the near foot
  const ft=(dx,dim)=>{c.beginPath();bd_loop(c,bd_mv(G.foot,dx,0));c.fillStyle=rgba(mix([40,44,56],[6,8,12],dim),1);c.fill();
    c.lineWidth=0.9/BD_S.s;c.strokeStyle=rgba(col,0.55*(1-dim));c.stroke();};
  ft(-5,0.6);bd_formP(c,G.tail,col,inkF,1.4,0.7);
  bd_formP(c,sil,col,fill,2.3,1);ft(1,0);
  c.save();c.beginPath();bd_loop(c,sil);c.clip();
  // the white front, lit from the upper left, shadowed toward the lower right
  c.beginPath();bd_loop(c,Hf([[9,-39.4],[4.4,-38.6]]).concat([[1.4,-30],[0.6,-18],[2.4,-2],[3.2,14],[1.6,30],[-1.6,40],[4,48],[30,48],[30,-38]]));
  c.fillStyle=bd_lin(c,"pg-front",0,-30,24,40,[[0,"rgba(244,247,252,0.95)"],[0.55,"rgba(214,224,238,0.92)"],[1,"rgba(150,166,190,0.9)"]]);c.fill();
  // a wash of pale yellow on the upper breast, and the ear patch, yellow-orange behind the eye, paling as it runs down into it
  c.fillStyle=bd_rad(c,"pg-yel",11,-29,13,[[0,"rgba(255,222,140,0.72)"],[0.6,"rgba(255,226,150,0.3)"],[1,"rgba(255,226,150,0)"]]);c.fillRect(-10,-46,36,36);
  c.beginPath();bd_loop(c,Hf([[-1.8,-46.6],[2,-47.6],[4.8,-44.4],[7.2,-40.4]]).concat([[10,-35.4],[11.8,-30.6],[8.6,-32],[4.6,-35.6]],Hf([[0.8,-40.2],[-1.4,-43.2]])));
  c.fillStyle=bd_lin(c,"pg-ear",0,-46,10,-31,[[0,"rgba(255,190,84,0.92)"],[0.55,"rgba(255,212,120,0.78)"],[1,"rgba(255,228,160,0.2)"]]);c.fill();
  // a dark line down the flank, where the black back meets the white
  bd_lines(c,[[[0.8,-26],[0.2,-12],[1.8,4],[2.2,20],[0.6,34]]],[4,6,10],0.8,0.9,0.4);c.restore();
  // the near flipper, hanging a little away from the body
  bd_formP(c,Fp(G.flip),col,inkF,1.6,0.9);
  bd_lines(c,[Fp([[-3.8,-20],[-1.4,-9],[1.8,0.6],[4.8,8.4],[6.8,12.6]])],[226,234,248],0.55,0.45,0.2);
  // the bill (an orange-pink plate along the lower mandible) and the eye
  const bl=Hf(G.bill);bd_formP(c,bl,col,"rgb(14,14,18)",1,0.6);
  c.beginPath();bd_taper(c,Hf([[13.6,-44.9],[17.2,-44.8],[20.6,-44.7]]),0.75,0.3);c.fillStyle="rgba(255,140,104,0.95)";c.fill();
  const e=Hf([[5.6,-46.8]])[0];bd_eye(c,e[0],e[1],0.95,mix(col,[120,130,150],0.4),L.bl,true);}

/* ---------- an ostrich (Struthio camelus), a male, standing: a big body of loose, shaggy black plumage, white plumes at the wings and the tail,
   a long bare neck, a small flat head with a big lashed eye and a broad flat bill, long bare legs: thick thighs, the heel high, scaled shanks,
   two toes (a big one with a stout claw, a small one outside). Its neck sways, its head turns, its plumes stir. Options: t, col (its rim), seed ---------- */
const BD_OS={body:(()=>{const yb=x=>x>-6?16.5-6.5*((x+6)/24)**2:16.5-11*((x+6)/27)**2,P=[[14.6,-14.2],[19.6,-9],[22.4,-2.4],[21.2,4.8],[18.6,9.6]];
    // lobes hanging from the plumage's lower edge, each its own length and width, their tips drooping back
    let x=16.4;for(let i=0;x>-29;i++){const w=5+2.6*hash(i,41),d=1.3+2.2*hash(i,43)+(i===2||i===4?1.4:0);
      P.push([x-w*0.08,yb(x-w*0.08)-0.2]);P.push([x-w*0.42,yb(x-w*0.42)+d*0.8]);P.push([x-w*0.7,yb(x-w*0.7)+d]);x-=w;}
    return P.concat([[-31.4,5.6],[-33.8,0.4],[-36.2,-4.4],[-34,-9.6],[-28.6,-13.8],[-19.4,-17],[-8.6,-18.8],[1.6,-18.4],[9.4,-16.8]]);})()};
function ostrich(ctx,x,y,s,o){o=o||{};const col=o.col||[220,200,180],t=o.t,k=o.seed||4;
  const L={br:t==null?0.5:0.5+0.5*Math.sin(t*TAU*0.22+k),nk:t==null?0:Math.sin(t*0.55+k)*0.7+0.3*Math.sin(t*1.3+k*2),ha:0.1*bd_hold(t,51+k,3,0.5),
    hy:bd_hold(t,53+k,3.7,0.5),bl:bd_blink(t,57+k),pl:t==null?0:Math.sin(t*1.1+k)};
  bd_draw(ctx,x,y,s,o,[-48,-78,42,60],c=>bd_ostrich(c,col,L));}
function bd_ostrich(c,col,L){const G=BD_OS,nk=L.nk,pl=L.pl,skin=[206,170,160],fill=bd_fill(c,col,0.5,[-40,-30,30,20]);
  const br=L.br*0.6,nb=G.body.length,body=G.body.map((q,i)=>i>=nb-4&&i<=nb-2?[q[0],q[1]-br]:q);
  bd_glow(c,"os",[-40,-24,26,22],[q=>bd_loop(q,G.body)],col,2.2);
  // legs: the far one first, darker; thigh, heel, shank, two toes
  const leg=(dx,dy,dim)=>{const hip=[4+dx,8+dy],heel=[-3.2+dx,28.4+dy],ft=[2.6+dx,52.6+dy],sk=rgba(mix(skin,[12,12,18],dim),0.97),ln=rgba(mix(col,[10,12,20],dim),0.5*(1-dim));
    c.beginPath();bd_tube(c,[hip,[1.8+dx,16.4+dy],[-1.2+dx,23.4+dy],heel],[7.5,6,3.8,2.4]);bd_tube(c,[heel,[-1.4+dx,34+dy],[0.9+dx,43+dy],ft],[2.3,1.8,1.55,1.6]);c.fillStyle=sk;c.fill();c.lineWidth=0.9/BD_S.s;c.strokeStyle=ln;c.stroke();
    c.beginPath();bd_taper(c,[[ft[0]-1,ft[1]],[ft[0]+4,ft[1]+0.4],[ft[0]+9.4,ft[1]+1]],1.7,0.8);bd_taper(c,[[ft[0],ft[1]-0.6],[ft[0]+3,ft[1]-0.5],[ft[0]+5.2,ft[1]-0.1]],1.1,0.6);c.fillStyle=sk;c.fill();
    c.beginPath();bd_taper(c,[[ft[0]+9,ft[1]+0.6],[ft[0]+11,ft[1]+1.2]],0.8,0.3);c.fillStyle=rgba(mix([50,40,36],[8,8,10],dim),1);c.fill();
    if(dim<0.5)bd_strk(c,[0,1,2,3,4,5].map(i=>{const u=0.14+i*0.14,px=lerp(heel[0],ft[0],u)+0.2,py=lerp(heel[1],ft[1],u);return[[px+0.5,py],[px+1.8,py+0.3]];}),col,0.45,0.45);};
  leg(-7,-1.5,0.6);
  // the neck: bare, S-curved, swaying gently; the head turns and tilts at its top
  const N=[[12.6,-6],[19.4,-19],[22,-32],[20.4+nk*0.8,-45],[21+nk*1.5,-56],[24.2+nk*2,-64.4]],hp=N[5],yw=L.hy*0.4;
  c.beginPath();bd_tube(c,N,[6.6,4.6,3.6,3.2,3,3.1]);c.fillStyle=bd_lin(c,"os-neck",12,-60,26,-10,[[0,rgba(mix(skin,[240,220,215],0.2),0.97)],[1,rgba(mix(skin,[40,30,34],0.5),0.97)]]);
  c.fill();c.lineWidth=1/BD_S.s;c.strokeStyle=rgba(col,0.85);c.stroke();
  bd_lines(c,[[[16.2,-15],[19.6,-25]],[[19.6,-30],[19.4,-40]],[[18.6,-45],[19+nk*1.2,-53]]],[250,240,236],0.35,0.35,0.12);
  const Hd=p=>bd_rot(p.map(q=>{const r=[q[0]>hp[0]?hp[0]+(q[0]-hp[0])*(1-Math.abs(yw)*0.3):q[0],q[1]];if(q[2])r.push(1);return r;}),hp[0],hp[1],L.ha,hp[0]-24.6+yw*1.2,hp[1]+64.6);
  const head=Hd([[21.4,-66.4],[23.2,-69.4],[27,-70.6],[30.4,-69.2],[32,-67.4],[31.4,-64.6],[27,-63],[23,-63.2]]),bill=Hd([[30.6,-67.6],[34.8,-67],[37.8,-66.1],[38.4,-64.9],[37,-64],[33,-63.6],[30.2,-63.8]]);
  bd_formP(c,head,col,rgba(mix(skin,[60,50,56],0.35),0.97),1.4,0.9);bd_formP(c,bill,col,"rgba(222,196,176,0.95)",1,0.7);
  bd_strk(c,[Hd([[31,-65.3],[34.4,-65.2],[37.6,-65]])],[70,50,48],0.7,0.5);
  const e=Hd([[27.2,-67.4]])[0];bd_eye(c,e[0],e[1],1.55,col,L.bl,true);if(L.bl>0.5)bd_strk(c,[Hd([[25.6,-68.9],[27.2,-69.5],[28.9,-69]])],[20,14,14],0.9,0.45);
  // a plume: soft white feathers, each a drooping tapered wisp from a common base, swaying a little
  const plume=(x0,y0,ang,len,n,spread,a)=>{c.beginPath();const tips=[];for(let i=0;i<n;i++){const u=n>1?i/(n-1):0.5,an=ang+(u-0.5)*spread+pl*0.05*(1+u),l=len*(0.8+0.3*Math.sin(i*2.3+1)),dr=0.28+0.1*u;
      const p=[[x0,y0]];for(let j=1;j<=4;j++){const v=j/4,aa=an+dr*v*v;p.push([x0+Math.cos(aa)*l*v,y0+Math.sin(aa)*l*v]);}bd_tube(c,p,[1.6,2.6,2.8,2.2,0.6]);tips.push(p.slice(0,4));}
    c.fillStyle=bd_lin(c,"os-pl"+a,x0,y0,x0-len,y0+len*0.5,[[0,"rgba(236,232,224,"+a*0.9+")"],[1,"rgba(250,248,242,"+a+")"]]);c.fill();c.lineWidth=0.7/BD_S.s;c.strokeStyle=rgba(col,0.5*a);c.stroke();
    bd_strk(c,tips,[150,144,136],0.45*a,0.3);};
  plume(-31,-8,2.72,15,5,0.9,0.92);
  // the near leg, its bare drumstick coming out from under the plumage
  leg(0,0,0);
  // the body: loose black plumage, its lower edge hanging in soft, shaggy lobes
  bd_formP(c,body,col,fill,2.2,1);
  c.save();c.beginPath();bd_loop(c,body);c.clip();
  bd_strk(c,[[[4,-16],[-2,-12.6],[-9,-11]],[[-4,-6],[-11,-3],[-18,-1.4]],[[8,2],[1,6],[-6,8.4]],[[-14,6],[-20,8.4],[-25,6.2]],[[12,-8],[6,-5],[0,-4.4]]],col,0.26,0.6);
  c.restore();
  {const sw=pl*0.5;c.beginPath();[[8.6,10,3.2,9.5,2.6],[3.2,12.2,2.4,7.5,2.2],[-20,9.4,2.6,8,2.2]].forEach(([x0,y0,dx,l,w])=>bd_taper(c,[[x0,y0],[x0-dx*0.3+sw*0.3,y0+l*0.55],[x0-dx+sw,y0+l]],w,0.35));
    c.fillStyle=fill;c.fill();c.lineWidth=0.6/BD_S.s;c.strokeStyle=rgba(col,0.3);c.stroke();}
  plume(-15,1,2.62,17,6,0.7,0.95);}
