/* ===== What's in a word: bodies and minds =====
   A baby who points before she can talk, and the grandmother who looks where she looks; a hand that points (or hands over a letter);
   a scribe's hand pressing a reed into clay; and a brain with one concept cell that lights up.
   People follow the series' character style (people.js: litFill, seam, outlined); the brain is an icon, like the film's creatures.
   Everything moves with t alone, and static detail is drawn once into offscreen canvases. */

/* ---------- shapes: smooth outlines, tapering tubes ---------- */
// a smooth curve through points (Catmull-Rom, as beziers); closed or open
function by_curve(ctx,pts,closed){const n=pts.length;if(n<2)return;const Q=i=>closed?pts[(i+n)%n]:pts[Math.max(0,Math.min(n-1,i))];
  ctx.moveTo(pts[0][0],pts[0][1]);const m=closed?n:n-1;
  for(let i=0;i<m;i++){const p0=Q(i-1),p1=Q(i),p2=Q(i+1),p3=Q(i+2);
    ctx.bezierCurveTo(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6,p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6,p2[0],p2[1]);}
  if(closed)ctx.closePath();}
// samples of a smooth centreline, with widths eased between the given ones: [[x,y,w],...]
function by_samples(pts,ws,k){const n=pts.length,out=[],Q=i=>pts[Math.max(0,Math.min(n-1,i))];k=k||6;
  for(let i=0;i<n-1;i++){const p0=Q(i-1),p1=Q(i),p2=Q(i+1),p3=Q(i+2);
    for(let j=0;j<k;j++){const u=j/k,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(c-a)*u+(2*a-5*b+4*c-d)*u2+(3*b-a-3*c+d)*u3),e=0.5-0.5*Math.cos(Math.PI*u);
      out.push([f(p0[0],p1[0],p2[0],p3[0]),f(p0[1],p1[1],p2[1],p3[1]),Math.max(0.01,lerp(ws[i],ws[i+1],e))]);}}
  out.push([pts[n-1][0],pts[n-1][1],Math.max(0.01,ws[n-1])]);return out;}
// a limb, a finger or a tail: the outline around a centreline with half-widths ws, and round ends
function by_tube(ctx,pts,ws,k){const S=by_samples(pts,ws,k),n=S.length,L=[],R=[];
  for(let i=0;i<n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
    L.push([S[i][0]-dy*S[i][2],S[i][1]+dx*S[i][2]]);R.push([S[i][0]+dy*S[i][2],S[i][1]-dx*S[i][2]]);}
  const e=S[n-1],e0=S[n-2],ae=Math.atan2(e[1]-e0[1],e[0]-e0[0]),s0=S[0],s1=S[1],a0=Math.atan2(s1[1]-s0[1],s1[0]-s0[0]);
  ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)ctx.lineTo(L[i][0],L[i][1]);
  ctx.arc(e[0],e[1],e[2],ae+Math.PI/2,ae-Math.PI/2,true);
  for(let i=n-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);
  ctx.arc(s0[0],s0[1],s0[2],a0-Math.PI/2,a0+Math.PI/2,true);ctx.closePath();}
// a stroke that swells in the middle and tapers to fine points: a crease, a fold, a sulcus
function by_taper(ctx,pts,w,k){const S=by_samples(pts,pts.map(()=>1),k||5),n=S.length,L=[],R=[];
  for(let i=0;i<n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1,q=w*Math.pow(Math.sin(Math.PI*(0.04+0.92*i/(n-1))),0.6);
    L.push([S[i][0]-dy/d*q,S[i][1]+dx/d*q]);R.push([S[i][0]+dy/d*q,S[i][1]-dx/d*q]);}
  ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)ctx.lineTo(L[i][0],L[i][1]);for(let i=n-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);ctx.closePath();}
// fill the current path lit from the upper left, like the series' people, with a soft darker seam

/* ---------- sprites: drawn once, then placed pixel for pixel ---------- */
// Static detail is drawn once into an offscreen canvas, already turned and scaled to the pixels it lands on, so a frame only copies pictures
// (a copy that lands on whole pixels is many times cheaper than one that is turned or scaled). Slow movements stay smooth: a sprite is kept
// for each quarter-pixel offset. A part can carry the luminous edge of the series' people: a figure puts down all its parts' edges first,
// then all their fills, so the edge shows only round the whole silhouette, as outlined() does.
// The cache is bounded by the pixels it holds (about 48 MB of canvases): the least recently used pictures are dropped first, and their memory
// is given back at once (width 0), which matters on phones, where the browser caps the memory of all canvases together.
const BY_CACHE=new Map(),BY_TMP=new Map(),BY_BUDGET=12e6;let BY_PX=0,BY_SCR=null;
function by_evict(keep){for(const [k,sp] of BY_CACHE){if(BY_PX<=BY_BUDGET)break;if(k===keep)continue;BY_CACHE.delete(k);BY_PX-=sp.px;sp.cv.width=sp.cv.height=0;if(sp.rim)sp.rim.width=sp.rim.height=0;}}
// one scratch canvas, reused for every tinting pass (it only grows)
function by_scratch(W,H){if(!BY_SCR||BY_SCR.width<W||BY_SCR.height<H)BY_SCR=mkCanvas(Math.max(W,BY_SCR?BY_SCR.width:0),Math.max(H,BY_SCR?BY_SCR.height:0));
  const c=BY_SCR.getContext("2d");c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.clearRect(0,0,W,H);return c;}
// draw(c,D) in local units (D: device pixels per unit) inside box, anchored at (x,y) of the context's units and turned by rot.
// o: rim {col,glow,ring,blur} (sizes in units), edge (put down the edge, not the fill: simply drawn over, a blend mode costs three times as much), op (a compositing mode), rq (the turning step), sub:false (whole pixels only),
// live (one picture, drawn unturned, then placed and turned as it is copied: for parts that keep moving, so the cache doesn't fill with near-copies;
// a turned copy costs about 0.1 ms for a small part, 0.4 ms for a long limb), merge and rimCut (below)
function by_blit(ctx,key,x,y,rot,box,draw,o){o=o||{};const m=ctx.getTransform(),d=Math.hypot(m.a,m.b)||1,base=Math.atan2(m.b,m.a),D=Math.round(d*32)/32,live=!!o.live;
  const px=m.a*x+m.c*y+m.e,py=m.b*x+m.d*y+m.f;let R=0,fx=0,fy=0,ix=0,iy=0,k;
  if(live)k=key+"|"+D+"|L";
  else{const rq=o.rq||0.004;R=Math.round((rot+base)/rq)*rq;ix=Math.floor(px);iy=Math.floor(py);if(o.sub!==false){fx=Math.round((px-ix)*4)/4;fy=Math.round((py-iy)*4)/4;}k=key+"|"+D+"|"+R.toFixed(4)+"|"+fx+"|"+fy;}
  let sp=BY_CACHE.get(k);
  if(sp&&sp.cv.width){BY_CACHE.delete(k);BY_CACHE.set(k,sp);}
  else{const rim=o.rim,g=rim?rim.blur*1.05+rim.ring+1:1,cs=Math.cos(R)*D,sn=Math.sin(R)*D;
    const C=[[box[0]-g,box[1]-g],[box[2]+g,box[1]-g],[box[0]-g,box[3]+g],[box[2]+g,box[3]+g]].map(([u,v])=>[u*cs-v*sn+fx,u*sn+v*cs+fy]);
    const X0=Math.floor(Math.min(...C.map(q=>q[0]))),Y0=Math.floor(Math.min(...C.map(q=>q[1]))),W=Math.max(1,Math.ceil(Math.max(...C.map(q=>q[0])))-X0),H=Math.max(1,Math.ceil(Math.max(...C.map(q=>q[1])))-Y0);
    const cv=mkCanvas(W,H),c=cv.getContext("2d");c.setTransform(cs,sn,-sn,cs,fx-X0,fy-Y0);c.lineJoin="round";c.lineCap="round";draw(c,D);sp={cv,X0,Y0,px:W*H};
    if(rim){const tx=by_scratch(W,H);tx.drawImage(cv,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(rim.col,1);tx.fillRect(0,0,W,H);
      const rc=mkCanvas(W,H),rx=rc.getContext("2d");rx.save();rx.shadowColor=rgba(rim.col,rim.glow);rx.shadowBlur=rim.blur*D;rx.globalAlpha=0.65;rx.drawImage(BY_SCR,0,0,W,H,0,0,W,H);rx.restore();
      rx.globalAlpha=0.85;const r=Math.max(0.6,rim.ring*D);for(let i=0;i<8;i++){const a=i/8*TAU;rx.drawImage(BY_SCR,0,0,W,H,Math.cos(a)*r,Math.sin(a)*r,W,H);}
      // only outside the part itself: its fill covers the rest anyway, and while fading nothing tinted shows through it
      rx.globalAlpha=1;rx.globalCompositeOperation="destination-out";rx.drawImage(cv,0,0);
      // o.rimCut: where the part joins another, its edge is taken away (in the part's units)
      if(o.rimCut){rx.save();rx.setTransform(cs,sn,-sn,cs,fx-X0,fy-Y0);rx.fillStyle="#000";o.rimCut(rx);rx.restore();}
      // o.merge: the edge and the fill in one picture, copied once (for a part drawn over the others)
      if(o.merge){rx.globalCompositeOperation="source-over";rx.drawImage(cv,0,0);cv.width=cv.height=0;sp.cv=rc;}else{sp.rim=rc;sp.px*=2;}}
    BY_CACHE.set(k,sp);BY_PX+=sp.px;by_evict(k);}
  if(o.edge&&o.merge)return;const img=o.edge?sp.rim:sp.cv;if(!img||!img.width)return;ctx.save();
  if(live){ctx.setTransform(1,0,0,1,px,py);ctx.rotate(rot+base);}else ctx.setTransform(1,0,0,1,ix,iy);
  if(o.op)ctx.globalCompositeOperation=o.op;ctx.drawImage(img,sp.X0,sp.Y0);ctx.restore();}
// the luminous edge of a part drawn live (a path, not a picture): a soft glow and a fine line in the edge's colour, outside the silhouette once
// the fills go on. The glow is a wide, faint stroke rather than a blur: a blur of a long limb costs about 0.4 ms, a stroke a fifth of that
function by_liveRim(c,path,rim){c.save();c.beginPath();path(c);c.lineJoin="round";const b=rim.blur,k=rim.glow/0.4;
  c.strokeStyle=rgba(rim.col,0.12*k);c.lineWidth=b*1.2;c.stroke();
  c.strokeStyle=rgba(rim.col,0.85);c.lineWidth=2*rim.ring;c.stroke();c.restore();}
// a figure of parts: draw(c,edge) is called for the edges, then for the fills. While it is see-through (fading), it is composed apart first,
// so its parts don't show through each other (unless direct: for figures whose parts barely overlap). box: its extent, in the context's current units.
function by_figure(ctx,box,draw,direct){const a=ctx.globalAlpha;if(a<=0.002)return;if(a>0.985||direct){draw(ctx,true);draw(ctx,false);return;}
  const m=ctx.getTransform(),P=[[box[0],box[1]],[box[2],box[1]],[box[0],box[3]],[box[2],box[3]]].map(([u,v])=>[m.a*u+m.c*v+m.e,m.b*u+m.d*v+m.f]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  const X0=Math.max(0,Math.floor(Math.min(...P.map(p=>p[0])))),Y0=Math.max(0,Math.floor(Math.min(...P.map(p=>p[1])))),X1=Math.min(cw,Math.ceil(Math.max(...P.map(p=>p[0])))),Y1=Math.min(ch,Math.ceil(Math.max(...P.map(p=>p[1]))));
  // a spare canvas close to the figure's size: copying a canvas costs by its whole area, so each size keeps its own
  if(X1<=X0||Y1<=Y0)return;const w=X1-X0,h=Y1-Y0,tk=Math.ceil(w/48)*48+"x"+Math.ceil(h/48)*48;let T=BY_TMP.get(tk);
  if(T){BY_TMP.delete(tk);BY_TMP.set(tk,T);}else{T=mkCanvas(Math.ceil(w/48)*48,Math.ceil(h/48)*48);BY_TMP.set(tk,T);if(BY_TMP.size>3){const [k0,T0]=BY_TMP.entries().next().value;BY_TMP.delete(k0);T0.width=T0.height=0;}}
  const c=T.getContext("2d");c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.clearRect(0,0,w,h);c.setTransform(m.a,m.b,m.c,m.d,m.e-X0,m.f-Y0);
  draw(c,true);draw(c,false);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(T,0,0,w,h,X0,Y0,w,h);ctx.restore();}
// lit from the upper left of the picture, like the series' people (mir = -1 when the drawing is mirrored)
function by_L(mir,kd){return(c,col,cx,cy,rad,k)=>{const g=c.createLinearGradient(cx-rad*0.8*mir,cy-rad,cx+rad*0.8*mir,cy+rad);g.addColorStop(0,rgba(lighten(col,0.17*(k||1)),1));g.addColorStop(0.55,rgba(col,1));g.addColorStop(1,rgba(darken(col,(kd||0.3)*(k||1)),1));c.fillStyle=g;c.fill();};}

/* ---------- hands ---------- */
// a hand in its own units: the wrist at (0,0), the fingers towards +x, the thumb side towards -y; about 100 from the wrist to the middle fingertip.
// We see its back. pose: "point" (the index out, the others curled under the thumb), "grip" (holding a sheet: the fingers behind it, the thumb on its face),
// "open" (reaching to take something), "rest" (relaxed). o.L: the direction of the light in these units ([-0.7,-0.7] when the hand is upright);
// o.chub: a baby's hand; o.part: "back" (all but the thumb), "thumb" (the thumb alone), or everything
const BY_HANDS={
  point:{palm:[[0,-14],[16,-15],[32,-16],[44,-16],[52,-14],[56,-8],[57,0],[55,8],[51,15],[44,19.5],[30,20.2],[16,18.8],[5,16],[0,13.5]],
    fingers:[{p:[[40,13],[50,15],[55,18]],w:[4.4,4.2,4]},{p:[[43,6],[55,7],[61,10]],w:[4.8,4.7,4.4]},{p:[[45,-2],[58,-2],[65,1]],w:[5.2,5,4.7]},
      {p:[[42,-10],[56,-11],[72,-11],[84,-10.4],[95,-9.2]],w:[5.8,5.4,4.9,4.5,4.1],nail:true,joints:[72,84]}],
    thumb:{p:[[11,-7],[21,-13.5],[31,-17],[42,-17.5],[51,-14.8],[56,-10.5]],w:[5.6,5.3,5,4.7,4.4,4.1],nail:true}},
  grip:{palm:[[0,-14],[16,-15],[32,-16],[44,-16],[53,-14],[57,-8],[58,0],[56,8],[52,15],[45,19.5],[30,20.2],[16,18.8],[5,16],[0,13.5]],
    fingers:[{p:[[41,14],[56,17],[68,19],[76,20]],w:[4.2,3.9,3.6,3.3]},{p:[[44,7],[62,9],[78,11],[88,12]],w:[4.8,4.4,4,3.7]},{p:[[46,-1],[66,0],[84,2],[96,3]],w:[5.2,4.9,4.4,4]},
      {p:[[44,-10],[62,-10],[80,-8],[92,-6]],w:[5.6,5.1,4.6,4.2]}],
    thumb:{p:[[11,-7],[22,-13.5],[35,-16.5],[49,-16],[60,-12],[68,-7]],w:[5.6,5.3,5,4.8,4.6,4.3],nail:true}},
  open:{palm:[[0,-14],[16,-15],[32,-16],[44,-16],[53,-14],[57,-8],[58,0],[56,8],[52,15],[45,19.5],[30,20.2],[16,18.8],[5,16],[0,13.5]],
    fingers:[{p:[[41,14],[56,19],[68,23],[76,26]],w:[4.2,3.9,3.6,3.3]},{p:[[44,7],[62,10],[78,14],[88,16]],w:[4.8,4.4,4,3.7]},{p:[[46,-1],[66,0],[84,1],[96,2]],w:[5.2,4.9,4.4,4]},
      {p:[[44,-10],[62,-12],[80,-12],[92,-11]],w:[5.6,5.1,4.6,4.2]}],
    thumb:{p:[[11,-7],[20,-15],[29,-22],[40,-26.5],[50,-28],[58,-27]],w:[5.6,5.3,5,4.8,4.6,4.3],nail:true}},
  rest:{palm:[[0,-14],[16,-15],[32,-16],[44,-16],[52,-14],[56,-8],[57,0],[55,8],[51,15],[44,19.5],[30,20.2],[16,18.8],[5,16],[0,13.5]],
    fingers:[{p:[[40,14],[54,18],[63,24],[67,30]],w:[4.2,3.9,3.6,3.3]},{p:[[43,7],[59,10],[70,16],[76,23]],w:[4.8,4.4,4,3.7]},{p:[[45,-1],[63,1],[76,7],[84,14]],w:[5.2,4.9,4.4,4]},
      {p:[[43,-10],[61,-10],[76,-6],[86,1]],w:[5.6,5.1,4.6,4.2],nail:true,joints:[61,76]}],
    thumb:{p:[[11,-7],[21,-13],[31,-16.5],[42,-16.5],[51,-13.5],[56,-9]],w:[5.6,5.3,5,4.7,4.4,4.1],nail:true}}};
// a loose fist: the pointing hand with its index curled too (a baby's hand at rest, before it points: only the index moves between the two)
BY_HANDS.fist=Object.assign({},BY_HANDS.point,{fingers:BY_HANDS.point.fingers.slice(0,3).concat([{p:[[42,-10],[50,-10.8],[56,-10.4],[59.5,-8.4],[60,-5.2]],w:[5.8,5.6,5.3,5,4.7]}])});
// a scribe's grip: the reed between the thumb and the curled index, resting on the middle finger; BY_PEN is the reed's line in the hand's units
BY_HANDS.pen={palm:BY_HANDS.point.palm,
  fingers:[{p:[[40,13],[50,15.5],[55,19]],w:[4.4,4.2,4]},{p:[[43,6],[55,8],[61,12]],w:[4.8,4.7,4.4]},{p:[[45,-2],[60,0],[70,5],[75,10]],w:[5.2,5,4.7,4.4]},
    {p:[[42,-10],[58,-11],[71,-7],[79,0],[82,5]],w:[5.8,5.4,4.9,4.5,4.1],nail:true,joints:[71]}],
  thumb:{p:[[11,-7],[22,-13],[35,-15],[48,-12],[59,-6],[66,0]],w:[5.6,5.3,5,4.7,4.4,4.1],nail:true}};
const BY_PEN={pinch:[74,3],dir:[0.84,0.54]};
// a pose between two poses of the same shape (k from 0 to 1)
function by_handMix(a,b,k){if(!b||k<=0)return a;if(k>=1)return b;const P2=(p,q)=>p.map((v,i)=>[lerp(v[0],q[i][0],k),lerp(v[1],q[i][1],k)]),F=(f,g)=>Object.assign({},k>0.5?g:f,{p:P2(f.p,g.p),w:f.w.map((w,i)=>lerp(w,g.w[i],k))});
  return{palm:P2(a.palm,b.palm),fingers:a.fingers.map((f,i)=>F(f,b.fingers[i])),thumb:F(a.thumb,b.thumb)};}
function by_hand(ctx,pose,skin,o){o=o||{};const H=typeof pose==="object"?pose:(BY_HANDS[pose]||BY_HANDS.point),L=o.L||[-0.7,-0.7],ch=o.chub?1:0,part=o.part||"all";
  const shape=pts=>ch?pts.map(([x,y])=>[x<40?x:40+(x-40)*0.78,y*1.08]):pts,wide=ws=>ch?ws.map(w=>w*1.22):ws;
  const lit=(cx,cy,r,c,k)=>{const g=ctx.createLinearGradient(cx+L[0]*r,cy+L[1]*r,cx-L[0]*r,cy-L[1]*r);g.addColorStop(0,rgba(lighten(c,0.18*(k||1)),1));g.addColorStop(0.5,rgba(c,1));g.addColorStop(1,rgba(darken(c,0.3*(k||1)),1));ctx.fillStyle=g;ctx.fill();};
  const line=rgba(darken(skin,0.5),0.5),crease=rgba(darken(skin,0.45),0.45);
  const finger=(f,dim)=>{const p=shape(f.p),w=wide(f.w),c=dim?darken(skin,dim):skin;ctx.beginPath();by_tube(ctx,p,w,4);
    const m=p[Math.floor(p.length/2)];lit(m[0],m[1],9,c);ctx.strokeStyle=line;ctx.lineWidth=1.1;ctx.stroke();
    if(f.nail){const e=p[p.length-1],e0=p[p.length-2],an=Math.atan2(e[1]-e0[1],e[0]-e0[0]),wn=w[w.length-1];ctx.save();ctx.translate(e[0],e[1]);ctx.rotate(an);
      ctx.beginPath();ctx.ellipse(-wn*0.7,-wn*0.12,wn*1.05,wn*0.62,0,0,TAU);ctx.fillStyle=rgba(mix(skin,[255,226,214],0.45),0.9);ctx.fill();ctx.strokeStyle=rgba(darken(skin,0.35),0.5);ctx.lineWidth=0.8;ctx.stroke();ctx.restore();}
    if(f.joints)f.joints.forEach(jx=>{const q=p.reduce((b,v)=>Math.abs(v[0]-jx)<Math.abs(b[0]-jx)?v:b,p[0]);ctx.beginPath();ctx.moveTo(q[0]-1.5,q[1]-w[0]*0.5);ctx.quadraticCurveTo(q[0]+1,q[1],q[0]-1.5,q[1]+w[0]*0.45);ctx.strokeStyle=crease;ctx.lineWidth=0.9;ctx.stroke();});};
  if(part!=="thumb"){
    // the curled or trailing fingers first, a touch darker, then the back of the hand, then the index
    const F=H.fingers;for(let i=0;i<F.length-1;i++)finger(F[i],0.05*(F.length-1-i));
    ctx.beginPath();by_curve(ctx,shape(H.palm),false);ctx.closePath();lit(28,0,26,skin,1);ctx.strokeStyle=line;ctx.lineWidth=1.1;ctx.stroke();
    // tendons and knuckles on the back of the hand, very faint
    ctx.lineWidth=1.3;[-10,-2,6,13].forEach((y1,i)=>{ctx.beginPath();ctx.moveTo(8,y1*0.25);ctx.quadraticCurveTo(28,y1*0.6,46-i*2,y1);ctx.strokeStyle=rgba(lighten(skin,0.3),0.13);ctx.stroke();});
    ctx.fillStyle=rgba(lighten(skin,0.35),0.09);[[50,-11],[52,-2],[50,7],[46,15]].forEach(([x,y])=>{ctx.beginPath();ctx.ellipse(x,y,3.2,2.4,0,0,TAU);ctx.fill();});
    if(o.mid)o.mid(ctx);
    if(!o.thumbUnder)finger(F[F.length-1],0);}
  if(part!=="back")finger(H.thumb,0);
  if(o.thumbUnder&&part!=="thumb")finger(H.fingers[H.fingers.length-1],0);}

/* ---------- arms ---------- */
const BY_SKIN={stranger:[134,90,62],envoy:[228,186,152],host:[146,98,70],scribe:[170,118,80]};
const BY_HOFF=[-4,-2],BY_WEAVE=[192,160,116],BY_CORD=[176,88,58],BY_WARMRIM=[255,214,170];
// pointArm(ctx,x0,y0,x1,y1,s,a[,o]): an arm from (x0,y0), off the picture's edge, to the wrist at (x1,y1); s = 1 for a hand about 90 px long.
// The arm has an elbow: a forearm of about 1.3 hands, then the upper arm, bent a little (o.bend, in radians) so that the elbow hangs below the
// line from (x0,y0) to the wrist. o.pose: "point" | "give" | "take" (a hand holding out a sheet, or closing on it); o.dress: "bare" (the edge of
// a coarse woven sleeve, a cord at the wrist) or "coat" (a dark sleeve and a shirt cuff). o.at: a point the index aims at (the wrist bends
// towards it); o.k: how far a "take" hand has closed (0 to 1); o.card: [x,y,w,h,rot] of the sheet it holds, so the fingers pass behind it; o.t: seconds.
// A hand coming from the right is mirrored, so its thumb stays on top.
function pointArm(ctx,x0,y0,x1,y1,s,a,o){o=o||{};withA(ctx,a==null?1:a,()=>by_arm(ctx,x0,y0,x1,y1,s,o));}
// a path round a centreline (pts, half-widths ws), cut straight at its far end and at its near end, the near cut slanted by sl
function by_band(c,pts,ws,sl){const S=by_samples(pts,ws,6),n=S.length,L=[],R=[];
  for(let i=0;i<n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;L.push([S[i][0]-dy*S[i][2],S[i][1]+dx*S[i][2]]);R.push([S[i][0]+dy*S[i][2],S[i][1]-dx*S[i][2]]);}
  const e=S[n-1],e0=S[n-2],tx=(e[0]-e0[0]),ty=(e[1]-e0[1]),td=Math.hypot(tx,ty)||1;
  c.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)c.lineTo(L[i][0]-(i===n-1?tx/td*sl:0),L[i][1]-(i===n-1?ty/td*sl:0));
  c.lineTo(R[n-1][0]+tx/td*sl,R[n-1][1]+ty/td*sl);for(let i=n-2;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();}
// the arm, in units with the wrist at (0,0), the forearm along -x to the elbow at (-Fa,0), and the upper arm leaving the elbow towards angle dir, Ua long
function by_armShape(c,Fa,Ua,dir,coat,skin,cloth,La,o){const E=[-Fa,0],U=a=>[E[0]+Math.cos(dir)*a,E[1]+Math.sin(dir)*a],inn=Math.sin(dir)<0?-1:1;
  const lit=(c,col,k,w)=>{const g=c.createLinearGradient(La[0]*w,La[1]*w,-La[0]*w,-La[1]*w);g.addColorStop(0,rgba(lighten(col,0.16*(k||1)),1));g.addColorStop(0.55,rgba(col,1));g.addColorStop(1,rgba(darken(col,0.34*(k||1)),1));c.fillStyle=g;c.fill();};
  const tap=(q,w,col,a)=>{c.beginPath();by_taper(c,q,w);c.fillStyle=col;c.globalAlpha=a;c.fill();c.globalAlpha=1;};
  if(coat){// the coat's sleeve: the forearm, the elbow with its folds on the inside of the bend, the upper arm; its hem cut straight, a little slanted
    const pts=[U(Ua),U(Ua*0.5),E,[-Fa*0.45,0],[-4,0]],ws=[29,28.6,27.4,25,23.2];
    c.beginPath();by_band(c,pts,ws,2.6);lit(c,cloth,1.3,28);seam(c,cloth,0.55,1.4);
    c.save();c.beginPath();by_band(c,pts,ws,2.6);c.clip();
    // folds: fanning from the inside of the elbow, a soft one along the forearm, a sheen along the lit edge
    const ie=[E[0]+6,E[1]+inn*22];[[0,-1],[18,-0.4],[-16,0.5]].forEach(([dx_,k],i)=>{const a0=[ie[0]+dx_*0.3,ie[1]],a1=[ie[0]+dx_+26*(i===0?1:0.8),ie[1]-inn*(10+4*i)],a2=[ie[0]+dx_*1.6+40,ie[1]-inn*(14+6*i)];
      tap([a0,a1,a2],2.4-0.4*i,rgba(darken(cloth,0.55),1),0.5);c.save();c.translate(-0.8,-1.2);tap([a0,a1,a2],1.1,rgba(lighten(cloth,0.28),1),0.32);c.restore();});
    [U(18),U(40)].forEach((p,i)=>{const q=[[p[0]+6,p[1]+inn*18],[p[0]-4,p[1]+inn*6],[p[0]-10,p[1]-inn*4]];tap(q,1.6,rgba(darken(cloth,0.5),1),0.35);});
    tap([[-Fa*0.9,-inn*14],[-Fa*0.5,-inn*16],[-18,-inn*14]],3,rgba(lighten(cloth,0.22),1),0.18);
    // the lining's shadow just inside the hem
    c.beginPath();c.moveTo(-6.5,-22);c.lineTo(-1.5,22);c.strokeStyle=rgba(darken(cloth,0.6),0.55);c.lineWidth=1.6;c.stroke();c.restore();
return;}
  // a bare arm: the forearm swelling below the elbow and slim at the wrist, the elbow, the upper arm going out of the picture
  const pts=[U(Ua),U(Ua*0.6),U(22),E,[-Fa*0.72,0],[-Fa*0.35,0],[0,0]],ws=[21,20.2,17.6,16.4,18.6,15.4,12.8];
  c.beginPath();by_tube(c,pts,ws,6);lit(c,skin,1.1,20);seam(c,skin,0.4,1.3);
  c.save();c.beginPath();by_tube(c,pts,ws,6);c.clip();
  tap([[-Fa*0.82,-13],[-Fa*0.5,-11],[-18,-8]],3.2,rgba(lighten(skin,0.3),1),0.28);
  tap([[E[0]+4,E[1]+inn*8],[E[0]+10,E[1]+inn*12],[E[0]+18,E[1]+inn*13]],1.3,rgba(darken(skin,0.5),1),0.4);
  c.beginPath();c.ellipse(E[0]-2,E[1]-inn*10,5,3.6,0,0,TAU);c.fillStyle=rgba(lighten(skin,0.2),0.18);c.fill();c.restore();
  // the sleeve: a coarse, undyed cloth woven by hand, its threads uneven, a few thick slubs, loose threads at its edge
  if(o.sleeve!==false){const h0=18,a=dir;c.save();c.translate(E[0],E[1]);c.rotate(a);const X1=Ua+40,wv=BY_WEAVE,edge=[];
    for(let i=0;i<=16;i++){const v=i/16;edge.push([h0+Math.sin(v*9+1)*1.8+(hash(i,7)-0.5)*4.4,-26+v*52]);}
    c.beginPath();c.moveTo(X1,-27);c.lineTo(edge[0][0],-26);edge.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(X1,27);c.closePath();
    const g=c.createLinearGradient(0,-26*inn,0,26*inn);g.addColorStop(0,rgba(lighten(wv,0.14),1));g.addColorStop(0.55,rgba(wv,1));g.addColorStop(1,rgba(darken(wv,0.36),1));c.fillStyle=g;c.fill();seam(c,wv,0.5,1.3);
    c.save();c.clip();let x=h0-2;for(let i=0;x<X1;i++){x+=2.2+hash(i,11)*2.2;const k=hash(i,12);c.beginPath();c.moveTo(x+hash(i,13)*1.5,-28);c.quadraticCurveTo(x+1.2*(hash(i,14)-0.5)*2,0,x+hash(i,15)*1.5,28);
      c.strokeStyle=k<0.5?rgba(darken(wv,0.38),0.34):rgba(lighten(wv,0.28),0.3);c.lineWidth=0.7+k*0.6;c.stroke();}
    let y=-27;for(let i=0;y<27;i++){y+=3+hash(i,21)*3.4;c.beginPath();c.moveTo(h0,y);c.lineTo(X1,y+(hash(i,22)-0.5)*1.4);c.strokeStyle=rgba(darken(wv,0.3),0.14);c.lineWidth=0.6;c.stroke();}
    for(let i=0;i<5;i++){const sx=h0+8+hash(i,31)*(X1-h0-20),sy=-20+hash(i,32)*40;c.beginPath();by_taper(c,[[sx,sy-4],[sx+0.6,sy],[sx,sy+4]],1.1);c.fillStyle=rgba(lighten(wv,0.25),0.5);c.fill();}c.restore();
    // loose threads hanging from the edge, pale against the arm
    c.lineWidth=0.9;edge.forEach((p,i)=>{if(i===0||i===16)return;const l=3+hash(i,41)*5,an=(hash(i,42)-0.5)*0.9;c.strokeStyle=rgba(lighten(wv,0.1+0.2*hash(i,44)),0.85);c.beginPath();c.moveTo(p[0]+1.5,p[1]);c.quadraticCurveTo(p[0]-l*0.5,p[1]+an*2,p[0]-l*Math.cos(an),p[1]+l*Math.sin(an)+1.5);c.stroke();
      if(hash(i,43)>0.55){c.beginPath();c.moveTo(p[0]+1.5,p[1]+1.6);c.lineTo(p[0]-l*0.55,p[1]+2.6+an*3);c.stroke();}});c.restore();}
  // a plain twisted cord at the wrist
  if(o.cord!==false){c.save();c.translate(-11,0);c.beginPath();c.moveTo(-3,-14.4);c.quadraticCurveTo(1,0,-3,14.4);c.lineTo(2.4,14);c.quadraticCurveTo(6.4,0,2.4,-14);c.closePath();lit(c,BY_CORD,1.2,6);seam(c,BY_CORD,0.6,1);
    c.strokeStyle=rgba(darken(BY_CORD,0.45),0.6);c.lineWidth=0.8;for(let i=0;i<7;i++){const yy=-12+i*4;c.beginPath();c.moveTo(-2.2+Math.abs(yy)*0.05,yy);c.lineTo(3+Math.abs(yy)*0.05,yy+2.6);c.stroke();}c.restore();}}
// the shirt's cuff, showing below the coat's sleeve and over the wrist, with a cufflink: in units with the wrist at (0,0), the hand towards +x
function by_cuff(c,silver){c.beginPath();c.moveTo(-4,-17.5);c.quadraticCurveTo(-2,0,-1,17.5);c.lineTo(9.5,16.6);c.quadraticCurveTo(12,0,10.8,-16.8);c.closePath();
  const g=c.createLinearGradient(0,-17,0,17);g.addColorStop(0,"rgba(246,248,252,1)");g.addColorStop(1,"rgba(190,196,210,1)");c.fillStyle=g;c.fill();seam(c,[200,206,216],0.6,1);
  c.beginPath();c.moveTo(4.2,-16.8);c.quadraticCurveTo(6.2,0,6.6,16.8);c.strokeStyle="rgba(150,158,176,0.4)";c.lineWidth=0.8;c.stroke();
  c.beginPath();c.ellipse(4.5,-9,2.3,2.3,0,0,TAU);c.fillStyle=silver?"rgba(214,214,222,1)":"rgba(222,190,110,1)";c.fill();c.strokeStyle="rgba(90,80,60,0.5)";c.lineWidth=0.6;c.stroke();}
// the arm itself, from (x0,y0) to the wrist at (x1,y1)
function by_arm(ctx,x0,y0,x1,y1,s,o){
  const pose=o.pose||"point",coat=(o.dress||(pose==="point"||pose==="pen"?"bare":"coat"))==="coat",t=o.t||0,fl=x1<x0?-1:1;o=Object.assign({silver:fl<0},o);
  const skin=o.skin||(coat?(fl<0?BY_SKIN.host:BY_SKIN.envoy):BY_SKIN.stranger),cloth=o.cloth||(fl<0?[62,62,70]:[42,54,84]);
  // the elbow: the forearm Fa units long, bent by beta at the elbow, which hangs below the line from the shoulder's side to the wrist
  const Fa=coat?132:120,beta=o.bend!=null?o.bend:(coat?0.24:0.08),D=Math.hypot(x1-x0,y1-y0),th=Math.atan2(y1-y0,x1-x0),aS=Math.asin(clamp(Fa*s*Math.sin(beta)/D,-1,1)),aW=beta-aS;
  const an=th-fl*aW,E=[x1-Math.cos(an)*Fa*s,y1-Math.sin(an)*Fa*s],thu=Math.atan2(y0-E[1],x0-E[0]);let rel=thu-an;rel=Math.atan2(Math.sin(rel),Math.cos(rel));
  const dir=fl<0?-rel:rel,Ua=Math.hypot(x0-E[0],y0-E[1])/s+60;
  // the light comes from the upper left of the picture: the same direction, in the arm's own turned (and perhaps mirrored) units
  const rot=(v,r)=>[v[0]*Math.cos(r)-v[1]*Math.sin(r),v[0]*Math.sin(r)+v[1]*Math.cos(r)],La=rot([-0.7,-0.7],-an);La[1]*=fl;
  const calm=o.still||o.card;let bend=0;
  if(o.at){const d=Math.atan2(o.at[1]-y1,o.at[0]-x1)-an;bend=clamp(Math.atan2(Math.sin(d),Math.cos(d))*fl,-0.5,0.5);}
  if(!calm)bend+=Math.sin(t*0.7+x0)*0.012;
  // a hand closing on a sheet: 16 steps, each faded into the next (smooth, and the cache holds only 17 pictures of it)
  const kk=pose==="take"?clamp(o.k==null?1:o.k,0,1)*16:16,k0=Math.floor(kk),kf=kk-k0,HK=q=>BY_HANDS[pose]||(pose==="give"?BY_HANDS.grip:by_handMix(BY_HANDS.open,BY_HANDS.grip,ease(q)));
  const hs=0.9,off=BY_HOFF[coat?1:0],rim={col:o.edge||BY_WARMRIM,glow:0.35,ring:1.2/s,blur:10/s};
  const id=[coat?"coat":"bare",skin.join(","),cloth.join(","),o.sleeve!==false,o.cord!==false,o.silver,fl].join("|"),gid=[Fa,Math.round(Ua),dir.toFixed(3),an.toFixed(3)].join("|");
  const lq=Math.round(bend/0.25),Lh=rot(La,-lq*0.25),hk0="hand|"+pose+"|"+id+"|"+an.toFixed(3)+"|"+lq,hb0=[-8,-44,116,36],hb=(fl<0?[hb0[0],-hb0[3],hb0[2],-hb0[1]]:hb0).map(v=>v*hs);hb[0]=Math.min(hb[0],-8);
  const hx=x1+Math.cos(an)*off*s,hy=y1+Math.sin(an)*off*s;
  // the arm is one picture (its shape does not change), placed on whole pixels; the hand is turned into place when it follows something
  const armPut=(c,e)=>{c.save();c.translate(Math.round(x1),Math.round(y1));c.scale(s,s);by_blit(c,"arm|"+id+"|"+gid,0,0,an,[-Fa-Ua-40,-34,12,34].map((v,i)=>i%2?v:v),cc=>{if(fl<0)cc.scale(1,-1);by_armShape(cc,Fa,Ua,dir,coat,skin,cloth,La,o);},{rim,edge:e,sub:false});c.restore();};
  const handPut=(c,e,part)=>{for(const [kq,al] of [[k0/16,1],[Math.min(16,k0+1)/16,kf]]){if(al<0.01)continue;const H=HK(kq);c.save();c.globalAlpha*=al;c.translate(calm?Math.round(hx):hx,calm?Math.round(hy):hy);c.scale(s,s);by_blit(c,hk0+"|"+kq+"|"+part,0,0,an+fl*bend,hb,(cc,D)=>{
    if(part==="thumb"){cc.shadowColor="rgba(40,24,10,0.35)";cc.shadowBlur=3*hs*D;cc.shadowOffsetY=1.6*hs*D;}cc.save();cc.scale(hs,hs*fl);by_hand(cc,H,skin,{L:Lh,part,thumbUnder:false});cc.restore();if(coat&&part!=="thumb"){cc.scale(1,fl);by_cuff(cc,o.silver);}},
    {rim:part==="thumb"?null:rim,edge:e,sub:false,live:!calm,merge:!calm,rimCut:q=>q.fillRect(-60,-60,64,120)});c.restore();}};
  const mg=48*s,X=[x0,E[0],x1+Math.cos(an)*110*s],Y=[y0,E[1],y1+Math.sin(an)*110*s];
  // fingers behind the sheet: the hand is cut away where the sheet is (the clip spans only the hand's reach), and the thumb lies on its face
  const hr=120*s,near=o.card&&Math.abs(hx-(o.card[0]+o.card[2]/2))<o.card[2]/2+hr&&Math.abs(hy-(o.card[1]+o.card[3]/2))<o.card[3]/2+hr;
  by_figure(ctx,[Math.min(...X)-mg,Math.min(...Y)-mg,Math.max(...X)+mg,Math.max(...Y)+mg],(c,e)=>{armPut(c,e);c.save();
    if(near){const [cx_,cy_,cw,ch,cr]=o.card;c.beginPath();c.rect(hx-hr,hy-hr,2*hr,2*hr);c.save();c.translate(cx_+cw/2,cy_+ch/2);c.rotate(cr||0);c.rect(-cw/2,-ch/2,cw,ch);c.restore();c.clip("evenodd");}
    handPut(c,e,o.card?"back":"all");c.restore();
    if(!e&&o.card)handPut(c,false,"thumb");},true);}

/* ---------- the brain: a side view, facing left, with one concept cell ---------- */
const BY_VIOLET=[200,170,255],BY_WARM=[255,236,160];
// outlines in brain units (the brain is about 240 wide and 200 tall; s scales it): the cortex, the cerebellum tucked under its back, the brainstem
const BY_CORTEX=[[-114,-8],[-111,-30],[-104,-50],[-90,-70],[-72,-84],[-52,-94],[-32,-100],[-12,-102],[10,-102],[21,-100.5],[32,-99],[52,-93],[70,-84],[87,-72],[101,-58],[112,-43],[119,-27],[123,-10],[124,6],[116,26],[102,34],[88,40],[74,45],[60,50],[44,56],[28,60],[10,62],[-6,63],[-22,62],[-36,58],[-48,53],[-58,45],[-65,34],[-62,23],[-70,22],[-80,24],[-92,21],[-104,13]];
const BY_CEREB=[[34,48],[52,39],[76,33],[100,33],[117,41],[123,55],[120,72],[104,86],[80,91],[58,88],[42,76]];
const BY_STEM=[[16,46],[44,46],[49,58],[47,74],[42,88],[38,102],[37,124],[25,124],[25,104],[22,92],[12,86],[7,74],[9,60]];
// the sulci: [weight, points]. The lateral (Sylvian) and central sulci are deepest; then the frontal, parietal and temporal sulci; then small folds
const BY_SULCI=[
  [3.1,[[-62,23],[-44,15],[-26,11],[-8,8],[10,5],[26,1],[42,-5],[52,-13],[58,-23],[60,-33]]],[1.6,[[-44,15],[-45,6],[-49,-2]]],[1.6,[[-48,16],[-58,10],[-66,9]]],
  [2.8,[[21,-100],[16,-90],[15,-80],[18,-72],[12,-64],[8,-54],[4,-44],[0,-34],[-4,-24],[-8,-15],[-10,-7]]],
  [2.1,[[-5,-100],[-9,-90],[-12,-80],[-15,-70],[-16,-62]]],[2.1,[[-20,-58],[-24,-48],[-28,-38],[-30,-26],[-33,-15],[-34,-7]]],
  [2.1,[[44,-95],[40,-84],[39,-74],[35,-64],[33,-52],[30,-40],[27,-29],[25,-18]]],
  [2,[[-17,-80],[-30,-81],[-44,-77],[-58,-74],[-72,-66],[-84,-58],[-96,-46]]],[2,[[-24,-46],[-38,-50],[-52,-46],[-66,-42],[-80,-35],[-94,-26],[-104,-16]]],
  [2.1,[[33,-54],[46,-58],[58,-56],[72,-54],[86,-48],[98,-40],[110,-32]]],
  // the superior temporal sulcus runs below the concept cell, which sits in the superior temporal gyrus; the inferior one lower, broken in pieces
  [2.4,[[-54,41],[-40,38.5],[-26,41],[-12,39],[2,41.5],[16,40],[30,37.5],[44,31],[56,24],[64,15],[70,5],[75,-5],[78,-18]]],
  [1.7,[[-46,53],[-34,51.5],[-22,53.5],[-14,52]]],[1.6,[[-6,57],[6,55.5],[16,57]]],[1.8,[[26,52],[38,49.5],[50,46],[60,40],[70,35],[82,30]]],[1.1,[[38,49.5],[42,43],[40,37]]],[1.1,[[-34,51.5],[-30,46]]],
  [1.7,[[103,-12],[108,-2],[110,8],[106,20]]],[1.4,[[93,-70],[97,-62],[98,-54]]],[1.5,[[86,-6],[94,-12],[100,-24],[104,-38]]],
  // small folds and dimples, giving each gyrus its wander
  [1.2,[[-34,-92],[-46,-90],[-60,-86]]],[1.2,[[-68,-80],[-78,-74],[-88,-66]]],[1.2,[[-40,-64],[-50,-62],[-58,-58],[-68,-52]]],[1.2,[[-80,-48],[-90,-42],[-100,-34]]],[1.1,[[-6,-70],[-2,-62]]],
  [1.2,[[-56,-26],[-64,-22],[-74,-18]]],[1.2,[[-82,-12],[-90,-6],[-100,-2]]],[1.2,[[-78,10],[-88,12],[-98,8]]],[1.1,[[-50,-30],[-48,-20],[-46,-12]]],[1.1,[[-60,-6],[-68,2]]],
  [1.2,[[46,-32],[52,-40],[60,-44],[68,-38]]],[1.2,[[80,-22],[88,-30],[94,-24]]],[1.2,[[56,-82],[66,-78],[78,-72]]],[1.1,[[50,-72],[60,-68],[66,-66]]],[1.1,[[80,-62],[88,-58]]],
  [1.1,[[112,-44],[116,-36],[118,-26]]],[1.1,[[94,14],[102,20],[110,24]]],[1.1,[[84,6],[92,4],[98,-2]]],[1.1,[[70,14],[80,12]]],
  [1.1,[[-40,47],[-30,46.5],[-22,47.5]]],[1.1,[[34,20],[42,17],[48,12]]],[1.1,[[54,36],[62,32]]],[1.1,[[-36,22],[-26,21]]],[1.1,[[-16,48],[-6,47]]]];
(function(){for(const q of BY_SULCI){if(q[0]<1.9||q[0]>2.7)continue;const P=q[1],out=[P[0]];for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,m=(hash(i,77+P.length)-0.5)*Math.min(6,d*0.3);
  out.push([(a[0]+b[0])/2-dy/d*m,(a[1]+b[1])/2+dx/d*m],b);}q[1]=out;}})();
const BY_BMP={};
function by_brainBmp(q){const s=q/2,key="brain"+q;if(BY_BMP[key])return BY_BMP[key];
  const X0=-140,Y0=-126,X1=146,Y1=134,Wc=Math.ceil((X1-X0)*q),Hc=Math.ceil((Y1-Y0)*q),cv=mkCanvas(Wc,Hc),c=cv.getContext("2d"),col=BY_VIOLET;
  const tf=cx=>{cx.setTransform(q,0,0,q,-X0*q,-Y0*q);cx.lineJoin="round";cx.lineCap="round";};tf(c);
  const layer=()=>{const l=mkCanvas(Wc,Hc).getContext("2d");tf(l);return l;},put=(l,op,a,dx,dy)=>{c.save();c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation=op||"source-over";c.globalAlpha=a==null?1:a;c.drawImage(l.canvas,(dx||0)*q,(dy||0)*q);c.restore();};
  const body=(x,pts,g0,g1,x0,y0,x1,y1)=>{x.beginPath();by_curve(x,pts,true);const g=x.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,g0);g.addColorStop(1,g1);x.fillStyle=g;x.fill();};
  const rim=(pts,a,lw)=>{c.save();c.beginPath();by_curve(c,pts,true);c.shadowColor=rgba(col,0.9);c.shadowBlur=10*s;c.strokeStyle=rgba(col,a);c.lineWidth=lw;c.stroke();c.restore();};
  // the shadow side of an outline: a crescent inside the edge, away from the light, so the rim is heavier at the lower right
  const crescent=(pts,d,a)=>{const l=layer();l.beginPath();by_curve(l,pts,true);l.fillStyle=rgba(col,a);l.fill();
    l.globalCompositeOperation="destination-out";l.translate(-d,-d*0.9);l.beginPath();by_curve(l,pts,true);l.fill();put(l);};
  const dark=a=>rgba(mix(col,[20,26,40],a),0.96);
  // the brainstem: the pons swelling in front, the medulla narrowing, fading as it leaves the picture
  let l=layer();body(l,BY_STEM,dark(0.74),"rgba(8,12,22,0.96)",0,46,50,110);
  l.save();l.beginPath();by_curve(l,BY_STEM,true);l.clip();l.strokeStyle=rgba(col,0.2);l.lineWidth=0.6;
  for(let i=0;i<6;i++){l.beginPath();l.moveTo(4,58+i*5);l.quadraticCurveTo(24,63+i*5.2,52,57+i*4.4);l.stroke();}
  l.strokeStyle=rgba(col,0.4);l.lineWidth=0.9;l.beginPath();l.moveTo(22,88);l.bezierCurveTo(28,94,31,104,31,124);l.stroke();l.restore();
  l.save();l.beginPath();by_curve(l,BY_STEM,true);l.shadowColor=rgba(col,0.9);l.shadowBlur=10*s;l.strokeStyle=rgba(col,0.85);l.lineWidth=1;l.stroke();l.restore();
  let g=l.createLinearGradient(0,92,0,122);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,1)");l.globalCompositeOperation="destination-out";l.fillStyle=g;l.fillRect(-10,90,80,50);put(l);
  // the cerebellum, with its fine folia and the deep horizontal fissure
  body(c,BY_CEREB,dark(0.72),"rgba(8,12,22,0.97)",40,30,110,95);
  c.save();c.beginPath();by_curve(c,BY_CEREB,true);c.clip();
  for(let k=0;k<15;k++){const r=k/14,deep=k===7;c.strokeStyle=rgba(col,deep?0.75:0.3+0.1*hash(k,3));c.lineWidth=deep?1.2:0.55;c.beginPath();
    for(let i=0;i<=30;i++){const u=i/30,an=lerp(0.02,1.0,u)*Math.PI,x=84+Math.cos(an)*(16+r*42),y=28+Math.sin(an)*(9+r*60)+Math.sin(u*11+k*1.7)*0.7;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
  c.restore();crescent(BY_CEREB,1.6,0.55);rim(BY_CEREB,0.9,1.1);
  // the cortex: lit from the upper left
  body(c,BY_CORTEX,dark(0.74),"rgba(9,11,24,0.97)",-90,-100,100,70);
  c.save();c.beginPath();by_curve(c,BY_CORTEX,true);c.clip();
  g=c.createRadialGradient(-56,-66,4,-40,-44,130);g.addColorStop(0,rgba(mix(col,[255,255,255],0.2),0.18));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-130,-120,260,200);
  // the folds, in relief: each groove is shadowed on its upper-left wall and lit on its lower-right one, so the gyri between them round out
  const grooves=layer();BY_SULCI.forEach(([w,pts])=>{grooves.beginPath();by_taper(grooves,pts,w*1.5);grooves.fillStyle="#000";grooves.fill();});
  const soft=layer();soft.setTransform(1,0,0,1,0,0);soft.filter="blur("+(4.2*q).toFixed(1)+"px)";soft.drawImage(grooves.canvas,0,0);soft.filter="none";
  const tint=(src,cc)=>{const t_=layer();t_.setTransform(1,0,0,1,0,0);t_.drawImage(src.canvas,0,0);t_.globalCompositeOperation="source-in";t_.fillStyle=cc;t_.fillRect(0,0,Wc,Hc);return t_;};
  c.restore();
  const clipTo=(lay)=>{lay.globalCompositeOperation="destination-in";lay.setTransform(q,0,0,q,-X0*q,-Y0*q);lay.beginPath();by_curve(lay,BY_CORTEX,true);lay.fill();return lay;};
  const sh=tint(soft,"rgb(2,3,10)"),hi=tint(soft,rgba(mix(col,[255,255,255],0.35),1));
  const shL=layer();shL.setTransform(1,0,0,1,0,0);shL.drawImage(sh.canvas,-2*q,-2*q);put(clipTo(shL),"source-over",1);put(clipTo(shL),"source-over",0.5);
  const hiL=layer();hiL.setTransform(1,0,0,1,0,0);hiL.drawImage(hi.canvas,2.2*q,2.2*q);put(clipTo(hiL),"source-over",0.24);
  c.save();c.beginPath();by_curve(c,BY_CORTEX,true);c.clip();
  BY_SULCI.forEach(([w,pts])=>{c.beginPath();by_taper(c,pts,w*0.95);c.fillStyle="rgba(4,6,14,0.7)";c.fill();});
  BY_SULCI.forEach(([w,pts])=>{c.beginPath();by_taper(c,pts,w*0.4);c.fillStyle=rgba(col,w>2?0.95:0.72);c.fill();});
  c.restore();
  crescent(BY_CORTEX,2,0.6);rim(BY_CORTEX,1,1.05);
  // round the concept cell the folds recede, so that the cell reads first
  c.save();c.beginPath();by_curve(c,BY_CORTEX,true);c.clip();g=c.createRadialGradient(14,24,0,14,24,32);g.addColorStop(0,"rgba(6,8,18,0.42)");g.addColorStop(0.6,"rgba(6,8,18,0.26)");g.addColorStop(1,"rgba(6,8,18,0)");c.fillStyle=g;c.fillRect(-20,-10,70,70);c.restore();
  return BY_BMP[key]={cv,X0,Y0,q};}
// the concept cell: a pyramidal neuron, its apical dendrite rising, basal dendrites spreading, an axon leaving below
function by_neuronPaths(){if(BY_BMP.npaths)return BY_BMP.npaths;const out=[];
  // each path keeps its route from the soma (base + its points), so that a spark can run along it all the way in, or out
  const grow=(x,y,a,len,w,depth,seed,wig,kind,base)=>{const n=5,pts=[[x,y]];let an=a;for(let i=1;i<=n;i++){an+=(hash(seed,i)-0.5)*(wig||0.5);const p=pts[i-1];pts.push([p[0]+Math.cos(an)*len/n,p[1]+Math.sin(an)*len/n]);}
    const route=base.concat(pts.slice(1));out.push({pts,w0:w,w1:Math.max(0.18,w*0.55),d:depth,kind,route});if(depth>0){const e=pts[n],sp=0.32+0.3*hash(seed,9),lean=(hash(seed,11)-0.5)*0.3;
      grow(e[0],e[1],an-sp+lean,len*(0.62+0.12*hash(seed,12)),w*0.62,depth-1,seed*3+1,wig,kind,route);grow(e[0],e[1],an+sp+lean,len*(0.58+0.12*hash(seed,13)),w*0.6,depth-1,seed*3+2,wig,kind,route);}};
  // the apical dendrite, with oblique branches and a tuft
  const ap=[[0,-5]];for(let i=1;i<=6;i++)ap.push([Math.sin(i*0.9)*1.2,-5-i*4.4]);out.push({pts:ap,w0:1.25,w1:0.6,d:3,kind:"apical",route:ap});
  [[2,-0.5,7,5],[3,Math.PI+0.6,6,6],[4,-0.35,6,7],[5,Math.PI+0.4,5,8]].forEach(([i,a,l,sd])=>grow(ap[i][0],ap[i][1],a-Math.PI*0.08,l,0.5,1,sd,0.5,"apical",ap.slice(0,i+1)));
  [-0.6,-0.1,0.45].forEach((d,i)=>grow(ap[6][0],ap[6][1],-Math.PI/2+d,6,0.5,1,20+i,0.5,"apical",ap));
  // basal dendrites
  [[-3.4,2.6,Math.PI*0.86,11],[-2.4,3.6,Math.PI*0.66,12],[2.6,3.6,Math.PI*0.33,13],[3.4,2.4,Math.PI*0.1,14],[0.6,4,Math.PI*0.52,15]].forEach(([x,y,a,sd])=>grow(x,y,a,8+hash(sd,1)*3,0.8,2,sd,0.5,"basal",[[0,0]]));
  // the axon, thin and long, with a collateral
  const ax=[[0.4,4.4]];for(let i=1;i<=7;i++)ax.push([0.4+Math.sin(i*0.7)*1.6,4.4+i*3.4]);out.push({pts:ax,w0:0.5,w1:0.3,d:0,kind:"axon",route:ax});grow(ax[4][0],ax[4][1],Math.PI*0.2,7,0.3,0,31,0.3,"axon",ax.slice(0,5));
  // the routes the sparks take while the cell fires: in along two apical and two basal dendrites, from their far tips, and out along the axon
  const tipOf=k=>out.filter(b=>b.kind===k&&b.d===0),A=tipOf("apical"),B=tipOf("basal");
  out.sparks=[[A[A.length-2].route,-1],[A[1].route,-1],[B[1].route,-1],[B[B.length-3].route,-1],[ax,1]];
  return BY_BMP.npaths=out;}
function by_neuronBmp(q){const s=q/2,key="cell"+q;if(BY_BMP[key])return BY_BMP[key];const R=36,cv=mkCanvas(Math.ceil(2*R*q),Math.ceil(2*R*q)),c=cv.getContext("2d");
  c.setTransform(q,0,0,q,R*q,R*q);c.lineJoin="round";c.lineCap="round";c.shadowColor=rgba(BY_WARM,0.9);c.shadowBlur=4*s;c.fillStyle=rgba(BY_WARM,1);
  by_neuronPaths().forEach(b=>{c.beginPath();by_tube(c,b.pts,b.pts.map((_,i)=>lerp(b.w0,b.w1,i/(b.pts.length-1))),3);c.fill();});
  // the soma: a rounded pyramid
  c.beginPath();by_curve(c,[[0,-8],[3.4,-1],[4.6,3.6],[0,5],[-4.6,3.6],[-3.4,-1]],true);c.fill();
  return BY_BMP[key]={cv,R,q};}
function brain(ctx,x,y,s,t,act,a){withA(ctx,a==null?1:a,()=>{const k=clamp(act||0,0,1);t=t||0;
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);by_blit(ctx,"brain",0,0,0,[-140,-126,146,134],(c,D)=>{const B=by_brainBmp(D);c.drawImage(B.cv,B.X0,B.Y0,B.cv.width/D,B.cv.height/D);});
  // the concept cell at (x+14s, y+26s): a warm halo, the neuron, and while it fires, sparks running in along its dendrites and out along its axon
  const cx=14,cy=26,halo=(0.16+0.04*Math.sin(t*1.2))*(1-k)+0.75*k;
  if(halo>0.01)withA(ctx,halo,()=>by_blit(ctx,"cellhalo",cx,cy,0,[-72,-72,72,72],c=>{const g=c.createRadialGradient(0,0,0,0,0,72);g.addColorStop(0,rgba(BY_WARM,0.55));g.addColorStop(0.25,rgba(BY_WARM,0.22));g.addColorStop(0.6,rgba(BY_WARM,0.06));g.addColorStop(1,rgba(BY_WARM,0));c.fillStyle=g;c.fillRect(-72,-72,144,144);},{op:"lighter"}));
  withA(ctx,0.42+0.58*k,()=>by_blit(ctx,"cell",cx,cy,0,[-36,-36,36,36],(c,D)=>{const N=by_neuronBmp(D);c.drawImage(N.cv,-N.R,-N.R,N.cv.width/D,N.cv.height/D);}));
  ctx.restore();
  const gx=x+cx*s,gy=y+cy*s;
  if(k>0.02){const R=by_neuronPaths().sparks;R.forEach(([r,dirn],j)=>{const u=((t*0.8+j*0.37+hash(j,5)*0.2)%1),f=dirn>0?u:1-u,n=r.length-1,i=Math.min(n-1,Math.floor(f*n)),q=f*n-i,pa=r[i],pb=r[i+1];
      glow(ctx,gx+lerp(pa[0],pb[0],q)*s,gy+lerp(pa[1],pb[1],q)*s,5*s,BY_WARM,k*0.85*Math.sin(Math.PI*u));});}
  glow(ctx,gx,gy-s,(9+5*k)*s,[255,250,225],0.35+0.6*k);});}

/* ---------- a baby ---------- */
// a baby of about a year, sitting on the ground in a cloth wrap, pointing: the root of reference. pt (0 to 1) raises the pointing arm.
// t: seconds (a breath, a blink, the head turning up to what she points at); o.at: the point she points at (default: up and to the right; to the left, she is mirrored).
// At s = 2, sitting at (520,720), her fingertip reaches about (680,640) when pt = 1.
const BY_BABY={skin:[176,122,88],hair:[44,30,26],wrap:[226,208,176],edge:[255,214,170]},BY_LEAN=0.07;
const by_line=(c,col,al,w)=>seam(c,col,al==null?0.4:al,w||1.1);
// her parts, each in her own units, facing right (mirrored by the caller)
function by_babyFar(c,skin,L){const line=by_line;
    // the far leg, behind: thigh, knee, a chubby calf, the foot with its toes up
    c.beginPath();by_tube(c,[[8,60],[26,55],[40,54],[54,58],[63,59]],[12,9.5,8.2,7.4,5.2],5);L(c,darken(skin,0.14),36,56,14);line(c,skin);
    c.beginPath();by_curve(c,[[58,62],[66,65],[74,60],[78,50],[76,43],[71,42],[66,50],[60,55]],true);L(c,darken(skin,0.12),68,54,10);line(c,skin);
}
function by_babyTorso(c,skin,B,L){const line=by_line;c.translate(4,76);c.rotate(BY_LEAN);c.translate(-4,-76);
    // the body: round belly, rounded back, sitting firmly (leaning a little towards what she points at)
    c.beginPath();by_curve(c,[[6,0],[22,4],[30,18],[34,38],[32,56],[22,70],[4,78],[-12,76],[-21,64],[-23,44],[-18,22],[-9,6]],true);L(c,skin,4,36,40);line(c,skin);
    // the wrap: a cloth round the body and over one shoulder, knotted there
    c.save();c.beginPath();by_curve(c,[[-14,6],[-6,2],[2,6],[10,12],[20,16],[30,22],[35,42],[32,60],[22,72],[4,80],[-14,78],[-24,64],[-25,42],[-21,20]],true);L(c,B.wrap,0,40,42,1.2);line(c,B.wrap,0.5);
    c.clip();[[[-20,40],[2,33],[27,36]],[[-22,57],[4,50],[31,53]],[[-8,12],[8,20],[26,26]],[[-16,26],[4,24],[24,30]]].forEach(q=>{c.beginPath();by_taper(c,q,0.9);c.fillStyle=rgba(darken(B.wrap,0.35),0.45);c.fill();});
    c.strokeStyle=rgba(darken(B.wrap,0.15),0.16);c.lineWidth=0.5;for(let i=-4;i<10;i++){c.beginPath();c.moveTo(-30,8+i*7);c.lineTo(40,4+i*7);c.stroke();}c.restore();
    c.beginPath();c.ellipse(-9,7,4.4,3.4,0.4,0,TAU);L(c,darken(B.wrap,0.06),-9,7,4,1.2);line(c,B.wrap,0.6);
    c.beginPath();by_taper(c,[[-11,9],[-14,15],[-13,21]],1.3);c.fillStyle=rgba(darken(B.wrap,0.1),0.95);c.fill();
}
function by_babyNear(c,skin,L){const line=by_line;
    // the near leg, stretched out in front: a fat thigh with its crease, the knee, the calf, the foot
    c.beginPath();by_tube(c,[[-4,70],[16,70],[32,72],[46,75],[58,78],[64,78]],[13,12,9.6,9,7.8,5.6],5);L(c,skin,30,72,16);line(c,skin);
    c.beginPath();by_taper(c,[[14,61],[17,70],[15,80]],1);c.fillStyle=rgba(darken(skin,0.45),0.45);c.fill();
    c.beginPath();by_taper(c,[[58,71],[60,78],[58,85]],0.8);c.fillStyle=rgba(darken(skin,0.45),0.4);c.fill();
    c.beginPath();by_curve(c,[[60,72],[68,72],[78,70],[84,62],[84,54],[79,52],[74,59],[66,64],[60,64]],true);L(c,skin,72,64,12);line(c,skin);
    c.fillStyle=rgba(lighten(skin,0.25),0.9);[[84,55,2.4],[83,59.5,2],[81,63.4,1.8],[78,66.6,1.6]].forEach(([tx,ty,tr])=>{c.beginPath();c.ellipse(tx,ty,tr*0.8,tr,0.3,0,TAU);c.fill();});
}
function by_babyArm(c,skin,L,mir){const line=by_line;c.translate(4,76);c.rotate(BY_LEAN);c.translate(-4,-76);
    // the near arm, resting on her leg
    const NS=[-8,12],NE=[-10,32],NW=[6,46];c.beginPath();by_tube(c,[NS,[-10,22],NE,[-2,41],NW],[7.8,7.4,6.2,6.2,4.8],5);L(c,skin,-6,30,14);line(c,skin);
    c.beginPath();by_taper(c,[[-15,32],[-10,34],[-5,32]],0.7);c.fillStyle=rgba(darken(skin,0.45),0.4);c.fill();
    c.save();c.translate(NW[0],NW[1]);c.rotate(0.5);c.scale(0.27,0.27);by_hand(c,"rest",skin,{chub:1,L:[-0.7*mir*Math.cos(0.5)-0.7*Math.sin(0.5),0.7*mir*Math.sin(0.5)-0.7*Math.cos(0.5)]});c.restore();
}
function by_babyHead(c,skin,B,L){const line=by_line;
    // the head: a big round skull, the face small and low, full cheeks
    const HP=[[-2,-24],[10,-21],[18,-13],[21,-4],[22,4],[22.5,9],[19,15],[12,19],[4,20],[-6,18],[-15,12],[-21,2],[-22,-8],[-17,-18]];
    c.beginPath();by_curve(c,HP,true);L(c,skin,2,-4,24);line(c,skin,0.35);
    c.beginPath();by_curve(c,[[-22,-8],[-2,-24],[18,-13],[21,-4],[15,-12],[4,-15],[-6,-12],[-14,-6],[-16,4],[-20,4]],true);c.fillStyle=rgba(B.hair,0.28);c.fill();
    // a little soft, curly hair, above the ear
    c.save();c.beginPath();by_curve(c,HP,true);c.clip();c.beginPath();bumpy(c,-1,-7,21.5,19,Math.PI*0.97,Math.PI*1.93,24,0.09,3);c.quadraticCurveTo(10,-15,0,-14);c.quadraticCurveTo(-11,-12,-15,-6);c.quadraticCurveTo(-19,-4,-22,-5);c.closePath();
    const hg=c.createLinearGradient(-14,-24,8,-6);hg.addColorStop(0,rgba(lighten(B.hair,0.12),0.8));hg.addColorStop(1,rgba(B.hair,0.62));c.fillStyle=hg;c.fill();
    c.fillStyle=rgba(lighten(B.hair,0.3),0.28);for(let i=0;i<34;i++){const ha_=Math.PI*(1.02+0.86*hash(i,4)),hr_=11+hash(i,5)*10;c.beginPath();c.arc(-1+Math.cos(ha_)*hr_,-7+Math.sin(ha_)*hr_*0.95,0.75,0,TAU);c.fill();}c.restore();
    // the near ear, on the side of the head
    c.beginPath();by_curve(c,[[-9,-6],[-4,-7.5],[-2.5,-1],[-4,5],[-8.5,5.5],[-10.5,0]],true);L(c,skin,-6,-1,6);line(c,skin,0.45);c.beginPath();c.arc(-6,-0.5,2.4,-1.3,1.7);c.strokeStyle=rgba(darken(skin,0.4),0.5);c.lineWidth=0.9;c.stroke();
    // cheeks, nose, mouth
    c.fillStyle="rgba(214,110,96,0.16)";c.beginPath();c.ellipse(13,8,5,3.6,0,0,TAU);c.fill();
    c.beginPath();c.moveTo(21.5,1);c.quadraticCurveTo(25,4,21.6,6.2);c.strokeStyle=rgba(darken(skin,0.45),0.7);c.lineWidth=1.2;c.stroke();
}
// where her arm and hand are: the shoulder S, elbow E, wrist W (her units, facing right) and the angles of the upper arm, forearm and hand
function by_babyArm2(dx,dy,r,br,t){const lean=BY_LEAN,rotP=(p_)=>{const c_=Math.cos(lean),s_=Math.sin(lean),X=p_[0]-4,Y=p_[1]-76;return[4+X*c_-Y*s_,76+X*s_+Y*c_];};
  const S=rotP([24,6+br*0.3]),aim=Math.atan2(dy-S[1],dx-S[0])+Math.sin(t*1.3)*0.015,ua=lerp(1.25,aim-0.14,r),fa=lerp(0.2,aim+0.04,r),ha=lerp(0.05,aim,r);
  const E=[S[0]+Math.cos(ua)*23.5,S[1]+Math.sin(ua)*23.5],W=[E[0]+Math.cos(fa)*20.5,E[1]+Math.sin(fa)*20.5];return{S,E,W,ua,fa,ha,rotP};}
// the tip of her index finger, in the picture (for placing her): the same arguments as baby()
function by_babyTip(x,y,s,pt,t,o){o=o||{};t=t||0;const r=clamp(pt==null?1:pt,0,1),at=o.at||[x+260*s,y-190*s],mir=at[0]<x?-1:1,A=by_babyArm2((at[0]-x)*mir/s,(at[1]-y)/s,r,Math.sin(t*2.1)*0.6,t);
  const tip=[24.05,-2.88],c=Math.cos(A.ha),sn=Math.sin(A.ha),X=A.W[0]+tip[0]*c-tip[1]*sn,Y=A.W[1]+tip[0]*sn+tip[1]*c;return[x+X*s*mir,y+Y*s];}
function baby(ctx,x,y,s,a,pt,t,o){o=o||{};withA(ctx,a==null?1:a,()=>{t=t||0;const B=BY_BABY,skin=o.skin||B.skin,r=clamp(pt==null?1:pt,0,1);
  const at=o.at||[x+260*s,y-190*s],mir=at[0]<x?-1:1,dx=(at[0]-x)*mir/s,dy=(at[1]-y)/s,L=by_L(mir),line=by_line;
  const br=Math.sin(t*2.1)*0.6,bl=(t+0.8)%3.7,blink=bl<0.18?Math.abs(bl-0.09)/0.09:1;
  // the pointing arm, from the far shoulder, aimed at the target as it rises
  const A=by_babyArm2(dx,dy,r,br,t),S=A.S,E=A.E,Wr=A.W,ha=A.ha,lean=BY_LEAN;
  // the head turns up towards the target as the arm rises
  const look=clamp(Math.atan2(dy+22,dx-8)*0.5,-0.45,0.1),tilt=lerp(0.02,look,r)+Math.sin(t*0.9)*0.02,NP=A.rotP([8,-4+br*0.4]);
  // her edge is as fine as the grown-ups': about a pixel, with a soft glow of 10
  const key="baby|"+mir+"|"+skin.join(","),rim={col:o.edge||B.edge,glow:0.45,ring:1.2/s,blur:10/s},mb=b=>mir<0?[-b[2],b[1],-b[0],b[3]]:b;
  const part=(c,e,name,box,fn)=>{c.save();c.translate(x,y);c.scale(s,s);by_blit(c,key+"|"+name,0,0,0,mb(box),cc=>{cc.scale(mir,1);fn(cc);},{rim,edge:e});c.restore();};
  // the hand opens from a loose fist to a point as the arm rises: only the index moves
  const kq=Math.round(clamp((r-0.2)/0.3,0,1)*16)/16,lq=Math.round(ha/0.3),Lh=(()=>{const q=lq*0.3;return[-0.7*mir*Math.cos(-q)+0.7*Math.sin(-q),-0.7*mir*Math.sin(-q)-0.7*Math.cos(-q)];})();
  const armPath=cc=>by_tube(cc,[S,[(S[0]+E[0])/2,(S[1]+E[1])/2],E,[(E[0]+Wr[0])/2,(E[1]+Wr[1])/2],Wr],[8.8,8.4,7.2,7.2,5.6],4);
  by_figure(ctx,[x-(mir<0?110:50)*s,y-72*s,x+(mir<0?50:110)*s,y+100*s],(c,e)=>{
    part(c,e,"far",[4,38,84,72],cc=>by_babyFar(cc,skin,L));
    // the pointing arm is drawn as it is (it keeps moving), its hand is a picture turned into place
    c.save();c.translate(x,y);c.scale(s*mir,s);
    if(e)by_liveRim(c,armPath,rim);
    else{c.beginPath();armPath(c);L(c,skin,E[0],E[1],16);line(c,skin);
      const d=Math.atan2(Wr[1]-E[1],Wr[0]-E[0]);c.beginPath();c.arc(Wr[0]-Math.cos(d)*2.4,Wr[1]-Math.sin(d)*2.4,5.8,d+1.2,d-1.2,true);c.strokeStyle=rgba(darken(skin,0.45),0.35);c.lineWidth=0.9;c.stroke();}
    c.restore();
    c.save();c.translate(x+Wr[0]*s*mir,y+Wr[1]*s);c.scale(s,s);by_blit(c,key+"|hand|"+kq+"|"+lq,0,0,mir*ha,mir<0?[-30,-16,10,16]:[-10,-16,30,16],cc=>{cc.scale(mir,1);cc.scale(0.29,0.29);by_hand(cc,by_handMix(BY_HANDS.fist,BY_HANDS.point,kq),skin,{chub:1,L:Lh});},{rim,edge:e,live:true,merge:true,rimCut:q=>q.fillRect(mir<0?-3:-40,-40,43,80)});c.restore();
    part(c,e,"front",[-30,-4,90,92],cc=>{cc.save();by_babyTorso(cc,skin,B,L);cc.restore();by_babyNear(cc,skin,L);cc.save();by_babyArm(cc,skin,L,mir);cc.restore();});
    // the head, tilted up to what she sees; her eyes and mouth are drawn live
    const R=mir*(lean+tilt);c.save();c.translate(x+NP[0]*s*mir,y+NP[1]*s);c.scale(s,s);by_blit(c,key+"|head",0,0,R,[-27,-46,27,6],cc=>{cc.scale(mir,1);cc.translate(0,-18);by_babyHead(cc,skin,B,L);},{rim,edge:e,live:true});
    if(!e){c.rotate(R);c.scale(mir,1);c.translate(0,-18);
      c.beginPath();c.ellipse(17,11.6,2.1,1.5+0.3*r,0.2,0,TAU);c.fillStyle="rgba(110,44,46,0.85)";c.fill();
      // the eyes: big and dark, the iris filling most of the opening, looking where the finger points; a lid of skin comes down as she blinks
      const gz=[lerp(0.15,0.42,r),lerp(-0.05,-0.3,r)],lid=rgba(darken(skin,0.04),1);
      [[7.5,-1,3.3],[17.5,-1.5,2.4]].forEach(([ex,ey,er])=>{c.save();c.beginPath();c.ellipse(ex,ey,er*1.1,er*0.96,0,0,TAU);c.fillStyle="rgba(236,226,218,0.95)";c.fill();c.clip();
        const ix=ex+gz[0]*er*0.55,iy=ey+gz[1]*er*0.5;c.beginPath();c.arc(ix,iy,er*0.86,0,TAU);c.fillStyle="rgba(40,24,18,1)";c.fill();
        if(blink>0.5){c.beginPath();c.arc(ix+er*0.28,iy-er*0.32,er*0.28,0,TAU);c.fillStyle="rgba(255,255,255,0.92)";c.fill();}
        if(blink<1){c.fillStyle=lid;c.fillRect(ex-er*1.3,ey-er*1.1,er*2.6,er*2.12*(1-blink));}c.restore();
        // the lashes: along the top of the open eye, or along the closed lid
        const ly=ey-er*0.96+er*1.92*(1-blink);c.beginPath();c.moveTo(ex-er*1.15,ey-er*0.1+(1-blink)*er*0.2);c.quadraticCurveTo(ex,blink<1?ly+er*0.35:ey-er*1.3,ex+er*1.15,ey-er*0.2+(1-blink)*er*0.2);
        c.strokeStyle=rgba(darken(skin,0.6),blink<1?0.85:0.6);c.lineWidth=blink<1?1:0.8;c.stroke();
        c.beginPath();c.moveTo(ex-er*1.1,ey-er*1.5);c.quadraticCurveTo(ex,ey-er*2.2,ex+er*1.1,ey-er*1.6);c.strokeStyle=rgba(darken(skin,0.4),0.5);c.lineWidth=0.9;c.stroke();});
    }
    c.restore();});});}

/* ---------- an elder of the first speakers ---------- */
// A grandmother, one of the first people who spoke: a modern human of long ago, resting at the child's level, sitting back on one heel with
// the other knee raised and her forearm across it, in a wrap of soft hide over one shoulder, a cord belt, a string of shell beads; bare arms
// and feet, short grey coiled hair. She turns her head up to look at o.look. Drawn like the series' people (s = 1 would be about 560 px
// standing); her foot, knee and shin rest on y; her eye is about 340*s above it, near x. t: seconds, for her breath, blinks and a slow sway of the head.
const BY_ELDER={skin:[140,94,66],hide:[182,142,98],hair:[196,192,188],cord:[184,150,98],beads:[240,230,212],edge:[255,206,150]};
function by_elderBody(c,skin,E){const hide=E.hide,L=by_L(1,0.32),line=(c,col,al,w)=>seam(c,col,al==null?0.45:al,w||1.3),
    crease=(c,q,w,al,col)=>{c.beginPath();by_taper(c,q,w);c.fillStyle=rgba(darken(col||skin,0.45),al||0.4);c.fill();},
    shine=(c,q,w,al,col)=>{c.beginPath();by_taper(c,q,w);c.fillStyle=rgba(lighten(col||skin,0.3),al||0.3);c.fill();},dk=darken(skin,0.16);
  // the kneeling leg, furthest: the knee on the ground, the shin rising a little to the ankle, the foot upright under her with the toes bent on the ground
  c.beginPath();by_curve(c,[[-94,-6],[-86,-26],[-56,-38],[-14,-46],[24,-54],[42,-60],[54,-60],[60,-46],[61,-26],[64,-10],[74,-4],[86,-2],[84,1],[60,1],[48,-6],[34,-20],[10,-16],[-30,-8],[-70,-1],[-90,1]],true);L(c,dk,0,-30,50);line(c,dk);
  shine(c,[[-80,-28],[-50,-38],[-14,-44]],1.4,0.22,dk);c.strokeStyle=rgba(darken(skin,0.5),0.4);c.lineWidth=1;[[74,-2.5],[80,-2]].forEach(([a,b])=>{c.beginPath();c.moveTo(a,b);c.lineTo(a-2,b-4.5);c.stroke();});
  // the raised leg: the shin standing, the calf round at the back, the ankle, the foot flat on the ground with its arch and toes
  c.beginPath();by_curve(c,[[-116,-168],[-119,-120],[-117,-70],[-113,-36],[-118,-18],[-134,-10],[-156,-6],[-170,-3],[-167,1],[-128,1],[-96,1],[-86,-3],[-88,-14],[-92,-30],[-90,-62],[-80,-104],[-76,-136],[-84,-164]],true);
  L(c,skin,-100,-90,70);line(c,skin);
  shine(c,[[-113,-156],[-115,-110],[-113,-62]],1.6,0.3);crease(c,[[-86,-30],[-90,-18],[-88,-8]],0.9,0.35);
  c.strokeStyle=rgba(darken(skin,0.5),0.4);c.lineWidth=1.1;[[-164,-2],[-157,-4],[-150,-5.5]].forEach(([a,b])=>{c.beginPath();c.moveTo(a,b);c.lineTo(a+1,b-5);c.stroke();});
  // the neck, stretched a little as she looks up: the throat in front, the nape and the slope of the shoulders behind
  const NK=[[-14,-262],[-10,-282],[-4,-300],[10,-315],[28,-311],[38,-296],[48,-278],[46,-262],[20,-256]];
  c.beginPath();by_curve(c,NK,true);L(c,darken(skin,0.05),16,-286,34);line(c,skin);
  c.save();c.beginPath();by_curve(c,NK,true);c.clip();shine(c,[[22,-306],[8,-290],[-6,-272]],2.2,0.24);crease(c,[[-4,-296],[-8,-284],[-10,-270]],1,0.3);crease(c,[[36,-300],[42,-284],[46,-270]],1.2,0.3);c.restore();
  // the body under the wrap: a back rounded with the years, the waist, the hips resting on the heel; the chest and the collarbone
  c.beginPath();by_curve(c,[[12,-292],[36,-280],[54,-258],[58,-228],[52,-196],[48,-182],[54,-150],[62,-112],[65,-76],[60,-50],[40,-40],[-10,-86],[-38,-132],[-44,-170],[-46,-200],[-42,-228],[-30,-250],[-12,-266],[2,-280]],true);L(c,skin,6,-200,80);line(c,skin);
  shine(c,[[-24,-260],[-10,-268],[4,-270]],1.2,0.28);
  // the raised thigh, from the hip to the knee
  c.beginPath();by_tube(c,[[26,-88],[-30,-124],[-72,-150],[-100,-164]],[27,25,22,19.5],5);L(c,skin,-40,-130,50);line(c,skin);
  c.beginPath();c.ellipse(-106,-166,12,10,-0.5,0,TAU);c.fillStyle=rgba(lighten(skin,0.22),0.25);c.fill();
  // the wrap of soft hide: over the far shoulder, across the breast under the near arm, round the hips and over the thigh. It follows the round
  // of the back, is drawn in at the waist by the belt and bunches there, lies over the thigh and breaks towards the knee, and hangs in soft points
  // below the thigh and behind her, where she sits on it
  const W=[[20,-292],[40,-286],[56,-266],[63,-236],[57,-202],[50,-184],[57,-160],[64,-126],[70,-94],[72,-64],[69,-42],[62,-28],[50,-31],[38,-25],[22,-40],[6,-56],[-12,-72],[-28,-86],[-42,-98],[-54,-104],[-60,-118],[-61,-138],[-55,-156],[-48,-168],[-48,-184],[-50,-204],[-48,-224],[-40,-240],[-26,-252],[-10,-264],[6,-282]];
  c.beginPath();by_curve(c,W,true);L(c,hide,4,-160,120,1.1);line(c,hide,0.55,1.4);
  c.save();c.beginPath();by_curve(c,W,true);c.clip();
  // the round of the thigh under the hide, lit along its top
  c.beginPath();by_taper(c,[[10,-104],[-26,-136],[-56,-154]],5);c.fillStyle=rgba(lighten(hide,0.25),0.22);c.fill();
  // folds: from the far shoulder across the breast and down the back; from the belt's knot over the thigh, down its side, round the hips; where she sits
  const folds=[[2.2,[[24,-286],[8,-272],[-8,-258],[-24,-248]]],[1.8,[[32,-282],[22,-264],[10,-244],[-4,-228]]],[1.5,[[44,-278],[50,-258],[52,-232]]],[1.2,[[18,-268],[20,-246],[18,-222]]],
    [1.8,[[-30,-176],[-42,-166],[-54,-160]]],[1.9,[[-24,-174],[-32,-150],[-42,-128],[-50,-112]]],[1.5,[[-16,-174],[-14,-148],[-16,-118],[-22,-94]]],[1.7,[[-8,-176],[6,-150],[16,-124],[20,-98]]],
    [1.6,[[2,-178],[22,-162],[40,-140],[52,-114]]],[1.4,[[34,-172],[50,-150],[60,-120],[63,-90]]],[1.4,[[58,-66],[48,-50],[32,-42]]],[1.2,[[-36,-104],[-42,-98],[-48,-96]]],
    [1.5,[[-50,-152],[-57,-140],[-58,-124]]],[1.1,[[-4,-84],[-10,-72],[-16,-66]]],[1.1,[[40,-92],[36,-64],[40,-42]]]];
  folds.forEach(([w,q])=>{c.beginPath();by_taper(c,q,w);c.fillStyle=rgba(darken(hide,0.45),0.42);c.fill();c.save();c.translate(-2,-1.4);c.beginPath();by_taper(c,q,w*0.55);c.fillStyle=rgba(lighten(hide,0.3),0.28);c.fill();c.restore();});
  // the hide bunched above and below the belt
  [[-42,-188],[-28,-191],[-10,-192],[8,-191],[26,-189],[42,-186]].forEach(([px,py],i)=>{crease(c,[[px-4,py-8],[px,py-2],[px+3,py+2]],0.9,0.35,hide);crease(c,[[px+2,py+10],[px+4+hash(i,7)*3,py+17],[px+3,py+24]],0.9,0.3,hide);});
  // the grain and the marks of the skin
  c.fillStyle=rgba(darken(hide,0.3),0.1);for(let i=0;i<26;i++){c.beginPath();c.ellipse(-60+hash(i,21)*130,-280+hash(i,22)*240,3+hash(i,23)*6,2+hash(i,24)*3,hash(i,25)*3,0,TAU);c.fill();}
  c.restore();
  // stitches of sinew where two skins were sewn, and a thin edge of fur along the hem
  c.fillStyle=rgba(lighten(hide,0.45),0.7);for(let i=0;i<9;i++){const u=i/8,px=lerp(6,-36,u),py=lerp(-274,-242,u);c.beginPath();c.ellipse(px+1,py+6,1.3,1,0.6,0,TAU);c.fill();}
  const hm=by_samples(W.slice(10,23),W.slice(10,23).map(()=>1),5);c.strokeStyle=rgba(mix(hide,[236,222,196],0.35),0.5);c.lineWidth=1;
  for(let i=1;i<hm.length-1;i++){const A=hm[i-1],B=hm[i+1],nx=-(B[1]-A[1]),ny=B[0]-A[0],d=Math.hypot(nx,ny)||1,l=1.2+1.4*hash(i,52);for(let k=0;k<2;k++){const px=lerp(hm[i][0],B[0],k*0.5),py=lerp(hm[i][1],B[1],k*0.5);
    c.beginPath();c.moveTo(px-nx/d*1.2,py-ny/d*1.2);c.lineTo(px+nx/d*l+(hash(i,53+k)-0.5)*1.2,py+ny/d*l);c.stroke();}}
  // the belt: a cord of twisted plant fibre round the waist, knotted, its ends hanging
  c.beginPath();by_tube(c,[[52,-182],[24,-188],[-10,-190],[-48,-186]],[3.4,3.6,3.6,3.2],4);L(c,E.cord,0,-188,10,1.2);line(c,E.cord,0.6,1);
  c.strokeStyle=rgba(darken(E.cord,0.45),0.55);c.lineWidth=0.8;for(let i=0;i<18;i++){const px=50-i*5.6,py=-183-5*Math.sin(Math.PI*(i/17));c.beginPath();c.moveTo(px,py-3);c.lineTo(px-2.4,py+3);c.stroke();}
  c.beginPath();by_tube(c,[[-30,-186],[-35,-170],[-32,-154]],[2.6,2.3,2],3);L(c,E.cord,-33,-170,8);line(c,E.cord,0.6,1);
  c.beginPath();by_tube(c,[[-24,-186],[-21,-172],[-24,-161]],[2.6,2.3,2],3);L(c,E.cord,-22,-172,8);line(c,E.cord,0.6,1);
  c.beginPath();c.ellipse(-27,-188,6,5,0,0,TAU);L(c,E.cord,-27,-188,6,1.2);line(c,E.cord,0.6,1);
  // shell beads on a string, round the neck
  c.strokeStyle=rgba(darken(E.cord,0.3),0.8);c.lineWidth=1;c.beginPath();c.moveTo(24,-284);c.quadraticCurveTo(4,-250,-26,-258);c.stroke();
  for(let i=0;i<9;i++){const u=(i+0.5)/9,bx=(1-u)*(1-u)*24+2*u*(1-u)*4+u*u*-26,by=(1-u)*(1-u)*(-284)+2*u*(1-u)*(-250)+u*u*(-258);c.beginPath();c.ellipse(bx,by+1,2.6,3.2,0.2,0,TAU);L(c,E.beads,bx,by,3,1.2);line(c,E.beads,0.5,0.8);}
  // the near arm, bare: the round of the shoulder, the upper arm dropping to the elbow over the thigh (its point showing), the forearm across the knee,
  // bent at about 110 degrees, the hand hanging over it
  c.beginPath();by_tube(c,[[-50,-186],[-78,-191],[-106,-195],[-134,-199]],[12.8,12,10.6,8.8],5);L(c,skin,-90,-194,26);line(c,skin);
  shine(c,[[-64,-200],[-92,-204],[-120,-206]],1.6,0.3);
  const UA=[[-4,-282],[12,-283],[25,-272],[27,-254],[18,-236],[4,-222],[-16,-204],[-32,-190],[-40,-178],[-50,-174],[-58,-180],[-58,-192],[-48,-204],[-32,-222],[-18,-242],[-12,-260],[-10,-274]];
  c.beginPath();by_curve(c,UA,true);L(c,skin,-10,-236,50);line(c,skin);
  c.save();c.beginPath();by_curve(c,UA,true);c.clip();
  // the deltoid's round, lit; the line where it meets the arm; the triceps in shade; the point of the elbow, and the crease inside it
  shine(c,[[-4,-276],[12,-274],[22,-260]],2.4,0.36);crease(c,[[20,-246],[10,-236],[-2,-232]],1,0.3);
  crease(c,[[8,-236],[-12,-212],[-30,-194]],1.8,0.22);c.beginPath();c.ellipse(-46,-179,6,5,0.3,0,TAU);c.fillStyle=rgba(lighten(skin,0.2),0.22);c.fill();
  crease(c,[[-50,-198],[-55,-193],[-58,-188]],0.8,0.4);c.restore();
  c.save();c.translate(-134,-200);c.rotate(1.8);c.scale(0.62,-0.62);by_hand(c,"rest",skin,{L:[0.5,0.85]});c.restore();}
// her head, in its own units: turned three-quarters to the left, the eyes up and to the left
function by_elderHead(c,skin,E,blink,L,line){
  const HD=[[4,-50],[-16,-48],[-30,-38],[-37,-24],[-39,-13],[-38,-7],[-44,3],[-48,9],[-43,13],[-41,15],[-42,19],[-39,23],[-40,27],[-36,36],[-27,44],[-12,45],[4,40],[16,28],[26,12],[36,-6],[37,-28],[26,-44]];
  c.beginPath();by_curve(c,HD,true);L(c,skin,-8,-4,52);line(c,skin,0.4);
  // the ear, behind the cheek
  c.beginPath();by_curve(c,[[12,-14],[18,-16],[23,-8],[22,4],[18,12],[13,10],[11,0]],true);L(c,darken(skin,0.05),16,-2,10);line(c,skin,0.5);
  c.beginPath();c.moveTo(19,-8);c.quadraticCurveTo(13,-2,18,6);c.strokeStyle=rgba(darken(skin,0.45),0.5);c.lineWidth=1.2;c.stroke();
  // short grey hair, tightly coiled: an uneven cap of coils of every size, a few breaking its outline; at the hairline it thins and the scalp shows
  const hr=E.hair,C=[2,-19],cap=[];for(let i=0;i<=34;i++){const a=Math.PI*(1.0+1.08*i/34),k=1+0.05*(hash(i,41)-0.5)+(hash(i,42)>0.7?0.05*hash(i,43):0);cap.push([C[0]+Math.cos(a)*39*k,C[1]+Math.sin(a)*34*k]);}
  cap.push([36,-12],[30,-9],[24,-16],[16,-23],[4,-28],[-10,-31],[-22,-31],[-32,-29]);
  c.save();c.beginPath();by_curve(c,cap,true);const hg=c.createLinearGradient(-30,-54,30,-10);hg.addColorStop(0,rgba(darken(hr,0.12),1));hg.addColorStop(1,rgba(darken(hr,0.42),1));c.fillStyle=hg;c.fill();
  c.restore();
  // at the hairline: a thin, soft fringe of coils on the skin, the scalp showing between them
  for(let i=0;i<26;i++){const u=i/25,px=lerp(-36,32,u)+hash(i,61)*3,py=(u<0.5?lerp(-27,-32,u*2):lerp(-32,-8,(u-0.5)*2))+hash(i,62)*3.5;c.beginPath();c.arc(px,py,1.3+hash(i,63)*1.2,0,TAU);c.fillStyle=rgba(darken(hr,0.3),0.55);c.fill();}
  // coils over the whole cap, and some just beyond its edge; each a small curl, lit on its upper left, shadowed on its lower right
  const coil=(px,py,r,a)=>{c.lineWidth=Math.max(0.9,r*0.55);c.beginPath();c.arc(px,py,r,Math.PI*0.85+a,Math.PI*1.75+a);c.strokeStyle=rgba(lighten(hr,0.22),0.6);c.stroke();
    c.beginPath();c.arc(px,py,r,Math.PI*1.9+a,Math.PI*2.7+a);c.strokeStyle=rgba(darken(hr,0.55),0.6);c.stroke();};
  for(let i=0;i<150;i++){const a=Math.PI*(1.0+1.08*hash(i,31)),rr=0.25+0.8*Math.sqrt(hash(i,32)),px=C[0]+Math.cos(a)*38*rr,py=C[1]+Math.sin(a)*33*rr;if(py>-24+(px>20?(px-20)*1.0:0)&&px<30)continue;coil(px,py,1.3+hash(i,34)*1.6,hash(i,35)*2);}
  for(let i=0;i<22;i++){const a=Math.PI*(1.02+1.02*i/21+0.02*hash(i,36)),k=1.0+0.04*hash(i,37),px=C[0]+Math.cos(a)*39*k,py=C[1]+Math.sin(a)*34*k,r=2+hash(i,38)*1.8;
    c.beginPath();c.arc(px,py,r,0,TAU);c.fillStyle=rgba(darken(hr,0.25),1);c.fill();coil(px,py,r*0.75,hash(i,39)*2);}
  // brow, lines of a long life, the eyes looking up at the bird
  c.strokeStyle=rgba(darken(skin,0.4),0.3);c.lineWidth=1;[[-30,-25,-12,-26],[-28,-21,-14,-22]].forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.quadraticCurveTo((a+d)/2,b-2,d,e);c.stroke();});
  c.strokeStyle=rgba(mix(E.hair,skin,0.35),0.9);c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(-29,-17);c.quadraticCurveTo(-20,-21,-9,-17);c.stroke();c.lineWidth=2;c.beginPath();c.moveTo(-40,-15);c.quadraticCurveTo(-37,-18,-34,-17);c.stroke();
  [[-19,-9,7.4,1],[-37,-9.5,3.4,0.6]].forEach(([ex,ey,ew,k])=>{const op=Math.max(0.08,blink);c.save();c.beginPath();c.moveTo(ex-ew,ey);c.quadraticCurveTo(ex,ey-6*op,ex+ew,ey+0.4);c.quadraticCurveTo(ex,ey+3.6*op,ex-ew,ey);c.closePath();c.fillStyle="rgba(236,226,214,0.95)";c.fill();c.clip();
    c.beginPath();c.arc(ex-ew*0.32,ey-1.4,3.9*Math.min(1,k+0.3),0,TAU);c.fillStyle="rgba(46,28,20,1)";c.fill();c.beginPath();c.arc(ex-ew*0.32-1,ey-2.6,1.1,0,TAU);c.fillStyle="rgba(255,255,255,0.9)";c.fill();c.restore();
    c.beginPath();c.moveTo(ex-ew-0.5,ey);c.quadraticCurveTo(ex,ey-6.4*op,ex+ew+0.5,ey+0.2);c.strokeStyle=rgba(darken(skin,0.55),0.9);c.lineWidth=1.7;c.stroke();});
  c.strokeStyle=rgba(darken(skin,0.4),0.4);c.lineWidth=0.9;[[-9,-9,-5,-11],[-9,-7,-4,-6],[-10,-5,-6,-2]].forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke();});
  // nose, the fold beside it, a quiet smile
  c.strokeStyle=rgba(darken(skin,0.45),0.55);c.lineWidth=1.3;c.beginPath();c.moveTo(-38,8);c.quadraticCurveTo(-33,6,-34,11);c.stroke();
  c.beginPath();by_taper(c,[[-33,9],[-30,17],[-31,27]],1.1);c.fillStyle=rgba(darken(skin,0.4),0.45);c.fill();
  c.beginPath();c.moveTo(-41,20.5);c.quadraticCurveTo(-35,21.5,-29,18.5);c.strokeStyle=rgba(darken(skin,0.55),0.85);c.lineWidth=1.6;c.stroke();
  c.fillStyle="rgba(200,110,90,0.14)";c.beginPath();c.ellipse(-22,8,8,5,0,0,TAU);c.fill();}
// the head's pivot (at the top of the neck), in her units, and her eye relative to it
const BY_EHEAD=[18,-302];
function by_elder(ctx,x,y,s,t,o){o=o||{};t=t||0;const E=BY_ELDER,skin=o.skin||E.skin,L=by_L(1,0.32),line=(c,col,al,w)=>seam(c,col,al==null?0.45:al,w||1.4);
  const breath=Math.sin(t*1.5+0.7),bl=(t+2.1)%4.6,blink=bl<0.15?Math.abs(bl-0.075)/0.075:1;
  // where she looks: the head turns up towards it
  const look=o.look||[x-460*s,y-560*s],hx=x+BY_EHEAD[0]*s,hy=y+BY_EHEAD[1]*s,la=Math.atan2(look[1]-hy,-(look[0]-hx)),R=clamp(-la*0.6,-0.12,0.4)+Math.sin(t*0.6)*0.012;
  const key="elder|"+skin.join(","),rim={col:o.edge||E.edge,glow:0.4,ring:1.2/s,blur:10.5/s},nx=BY_EHEAD[0],ny=BY_EHEAD[1]-breath*1.2;
  by_figure(ctx,[x-190*s,y-420*s,x+110*s,y+20*s],(c,e)=>{
    c.save();c.translate(x,y);c.scale(s,s);by_blit(c,key+"|body",0,0,0,[-180,-300,96,6],cc=>by_elderBody(cc,skin,E),{rim,edge:e});c.restore();
    c.save();c.translate(x+nx*s,y+ny*s);c.scale(s,s);by_blit(c,key+"|head",0,0,R,[-62,-106,50,8],cc=>{cc.translate(-4,-44);by_elderHead(cc,skin,E,1,L,line);},{rim,edge:e,live:true});
    // a blink: the lids close over the eyes
    if(!e&&blink<0.75){c.rotate(R);c.translate(-4,-44);[[-19,-9,7.4],[-37,-9.5,3.4]].forEach(([ex,ey,ew])=>{c.beginPath();c.moveTo(ex-ew-0.6,ey+0.2);c.quadraticCurveTo(ex,ey-6.8,ex+ew+0.6,ey+0.6);c.quadraticCurveTo(ex,ey+4.2,ex-ew-0.6,ey+0.2);c.closePath();c.fillStyle=rgba(darken(skin,0.08),1);c.fill();
      c.beginPath();c.moveTo(ex-ew-0.5,ey+0.6);c.quadraticCurveTo(ex,ey+2.4,ex+ew+0.5,ey+0.8);c.strokeStyle=rgba(darken(skin,0.55),0.85);c.lineWidth=1.5;c.stroke();});}
    c.restore();});}

/* ---------- a scribe's arm ---------- */
// A scribe's bare forearm and hand from the upper right, holding a cut reed. The arm has two bones: the shoulder is off the picture, and the elbow
// is found each frame from where the reed's tip must be (the upper arm about 1.15 times the forearm, the forearm about 1.45 times the hand),
// so the arm pivots at the shoulder and bends at the elbow as the hand moves along the rows.
const BY_REED=[204,176,118],BY_SCR_F=130,BY_SCR_U=150,BY_SCR_X=70;
// the reed, in the hand's units: a length of reed, tapering a little to a tip cut straight across (pressed upright it leaves a round hole,
// at a slant a notch), with two nodes and fine fibres along it
function by_reed(c){const P0=[BY_PEN.pinch[0]+BY_PEN.dir[0]*36,BY_PEN.pinch[1]+BY_PEN.dir[1]*36],d=BY_PEN.dir,len=128;
  c.save();c.translate(P0[0],P0[1]);c.rotate(Math.atan2(d[1],d[0])+Math.PI);
  c.beginPath();c.moveTo(0.4,-2.5);c.quadraticCurveTo(0,0,0.4,2.5);c.lineTo(20,3.1);c.lineTo(len,3.5);c.quadraticCurveTo(len+2.4,0,len,-3.5);c.lineTo(20,-3.1);c.closePath();
  const g=c.createLinearGradient(0,-3.5,0,3.5);g.addColorStop(0,rgba(lighten(BY_REED,0.3),1));g.addColorStop(0.5,rgba(BY_REED,1));g.addColorStop(1,rgba(darken(BY_REED,0.35),1));c.fillStyle=g;c.fill();c.strokeStyle=rgba(darken(BY_REED,0.55),0.6);c.lineWidth=0.7;c.stroke();
  // the cut end: the pale ring of the reed's wall
  c.beginPath();c.ellipse(1.1,0,1.1,2.4,0,0,TAU);c.fillStyle=rgba(mix(BY_REED,[244,232,200],0.55),1);c.fill();
  [58,112].forEach(nx=>{c.beginPath();c.ellipse(nx,0,1.6,3.8,0,0,TAU);c.fillStyle=rgba(darken(BY_REED,0.3),0.9);c.fill();c.beginPath();c.moveTo(nx+1.4,-3.3);c.lineTo(nx+1.4,3.3);c.strokeStyle=rgba(lighten(BY_REED,0.35),0.7);c.lineWidth=0.6;c.stroke();});
  c.strokeStyle=rgba(darken(BY_REED,0.3),0.35);c.lineWidth=0.4;[-1.6,0.4,2].forEach(yy=>{c.beginPath();c.moveTo(6,yy*0.8);c.lineTo(len-2,yy*1.1);c.stroke();});c.restore();}
// the reed's tip in the forearm's frame: the elbow at (0,0), the wrist at (F,0), the thumb's side towards +y (the hand is mirrored)
const BY_SCRT=[BY_SCR_F-4+(BY_PEN.pinch[0]+BY_PEN.dir[0]*36)*0.9,-(BY_PEN.pinch[1]+BY_PEN.dir[1]*36)*0.9];
// The two bones are drawn as they are each frame (their outlines are simple, and a long picture turned into place would cost more), each with
// its luminous edge put down first; the hand and the reed are one picture, turned with the forearm.
// the forearm's outline, in its frame (the elbow at 0,0, the wrist at (F,0)); its back end, round the elbow, lies under the upper arm
const BY_SCRF=[[BY_SCR_F+2,-13.4],[BY_SCR_F-12,-14.6],[104,-15.6],[76,-18],[48,-20.4],[22,-22],[4,-20.5],[-10,-12],[-15,0],[-9,12],[6,20],[26,25.5],[52,23.5],[80,18.8],[106,15.2],[BY_SCR_F+2,13.6]];
// the upper arm's outline, in its frame (the elbow at 0,0, the shoulder at (U,0) and beyond, off the picture). Over the forearm at the elbow:
// its round end makes the elbow's point (+y, away from the bend), and where it crosses the forearm, the crease inside the elbow
const BY_SCRU=[[-6,-13],[8,-20],[BY_SCR_U*0.3,-24.6],[BY_SCR_U*0.62,-23.8],[BY_SCR_U,-24.6],[BY_SCR_U+BY_SCR_X,-28],[BY_SCR_U+BY_SCR_X,28],[BY_SCR_U,25],[BY_SCR_U*0.55,23.4],[BY_SCR_U*0.2,21.6],[8,20.5],[-7,16.5],[-15.5,6],[-14,-5]];
// the light comes from the thumb's side of the forearm (+y), and from the biceps' side of the upper arm (-y), when the arm lies as in the end scene
function by_scribeFore(c,skin){const F=BY_SCR_F,out=BY_SCRF;
  c.beginPath();by_curve(c,out,true);const g=c.createLinearGradient(0,25,0,-21);g.addColorStop(0,rgba(lighten(skin,0.2),1));g.addColorStop(0.45,rgba(skin,1));g.addColorStop(1,rgba(darken(skin,0.34),1));c.fillStyle=g;c.fill();seam(c,skin,0.42,1.2);
  // the long muscle on the thumb's side catching the light; the ulna's ridge in shadow
  c.beginPath();by_taper(c,[[10,15],[36,18],[72,13.5],[108,9.5]],3.6);c.fillStyle=rgba(lighten(skin,0.3),0.3);c.fill();
  c.beginPath();by_taper(c,[[34,-14],[74,-13.4],[120,-11.2]],1.8);c.fillStyle=rgba(darken(skin,0.5),0.26);c.fill();
}
function by_scribeUpper(c,skin){const U=BY_SCR_U,out=BY_SCRU;
  c.beginPath();by_curve(c,out,true);const g=c.createLinearGradient(0,-25,0,25);g.addColorStop(0,rgba(lighten(skin,0.17),1));g.addColorStop(0.5,rgba(skin,1));g.addColorStop(1,rgba(darken(skin,0.36),1));c.fillStyle=g;c.fill();seam(c,skin,0.4,1.2);
  c.beginPath();by_taper(c,[[16,-15],[U*0.38,-18],[U*0.8,-17]],3.8);c.fillStyle=rgba(lighten(skin,0.28),0.26);c.fill();
  c.beginPath();by_taper(c,[[22,13],[U*0.5,15.5],[U*0.9,16.5]],2.2);c.fillStyle=rgba(darken(skin,0.5),0.24);c.fill();
  c.beginPath();by_taper(c,[[-8,-10],[0,-15],[10,-19]],1.2);c.fillStyle=rgba(darken(skin,0.5),0.4);c.fill();
  c.beginPath();c.ellipse(-7,9,6,4.4,-0.6,0,TAU);c.fillStyle=rgba(lighten(skin,0.22),0.14);c.fill();
  c.beginPath();by_taper(c,[[-12,2],[-9,11],[-2,16]],1);c.fillStyle=rgba(darken(skin,0.5),0.3);c.fill();}
// the hand and the reed, mirrored so that the thumb lies on the lit side; in units with the wrist at (0,0)
function by_scribeHand(c,skin){c.scale(0.9,-0.9);by_hand(c,"pen",skin,{L:[0.09,-0.99],mid:by_reed,thumbUnder:true});}
// the shadow on the clay of the hand, the reed and the forearm, soft, from the reed's tip (where the reed touches, its shadow meets it): the reed's
// drawn as it is, the hand's and the forearm's a blurred picture placed on whole pixels (turned in steps of 2 degrees: a soft shadow hides them)
function by_scribeShadow(c,x,y,phi,s,lift){const T=BY_SCRT,px=x+lift*0.3,py=y+lift*1.3,cs=Math.cos(phi)*s,sn=Math.sin(phi)*s,P=(u,v)=>[px+(u-T[0])*cs-(v-T[1])*sn,py+(u-T[0])*sn+(v-T[1])*cs];
  const r1=P(124+1.5,40-30);c.save();c.lineCap="round";[[7,0.07],[2.6,0.12]].forEach(([w,a])=>{c.strokeStyle="rgba(24,12,4,"+a+")";c.lineWidth=w*s;c.beginPath();c.moveTo(px,py);c.lineTo(r1[0],r1[1]);c.stroke();});c.restore();
  const q=Math.round(phi/0.035)*0.035;c.save();c.translate(px,py);c.scale(s,s);by_blit(c,"scrshadow",0,0,q,[-130,-50,10,20],(cc,D)=>{cc.translate(-T[0],-T[1]);cc.fillStyle="#000";
    cc.beginPath();cc.ellipse(166,-13,46,18,0.05,0,TAU);cc.fill();cc.globalAlpha=0.4;cc.beginPath();cc.ellipse(118,-22,36,14,-0.1,0,TAU);cc.fill();cc.globalAlpha=1;
    const W=cc.canvas.width,H=cc.canvas.height,sc=by_scratch(W,H);sc.drawImage(cc.canvas,0,0);cc.setTransform(1,0,0,1,0,0);cc.clearRect(0,0,W,H);cc.filter="blur("+(7*D).toFixed(1)+"px)";cc.globalAlpha=0.3;cc.drawImage(BY_SCR,0,0,W,H,0,0,W,H);cc.filter="none";cc.globalAlpha=1;},{sub:false,rq:0.035});c.restore();}
// Where the scribe's reed is, u seconds after the writing on a tablet(ctx,x,y,w,h,p) began (p going from 0 to 1 in 5 s): mark i forms while
// u*9.6 goes from i to i+1 (see tablet() in land.js). The hand glides along each row, dipping the reed into every mark as it starts to form,
// swings back in an eased arc of 0.3 s between rows, and after the last mark lifts away up and to the right (0.7 s). Returns what stylus()
// takes (x, y, alpha, and the options: the shoulder S and the lift), or null once the hand has gone.
function by_scribe(u,x,y,w,h){const q=u*9.6,c=0.82,d0=0.4,run=11*c,mk=i=>[x+48+(i%12)*(w-80)/12+hash(i,2)*6,y+Math.floor(i/12)*h/5+h/10+2];
  const at=m=>{const i=Math.floor(m),f=m-i,A=mk(i),B=mk(Math.min(47,i+1));return[lerp(A[0],B[0],f),lerp(A[1],B[1],f)];};
  let P,lift=0,leave=0;
  if(q<d0){P=mk(0);lift=7*(1-ease(clamp((q+5)/(5+d0),0,1)));}
  else{const r=Math.min(3,Math.floor((q-d0)/12)),ql=q-d0-12*r;
    if(ql<=run){const m=ql/c,f=m-Math.floor(m);P=at(12*r+Math.min(11,m));lift=1.5*(0.5-0.5*Math.cos(TAU*f));}
    else if(r<3){const v=(ql-run)/(12-run),e=v*v*(3-2*v),A=mk(12*r+11),B=mk(12*r+12);P=[lerp(A[0],B[0],e),lerp(A[1],B[1],e)-26*Math.sin(Math.PI*v)];lift=16*Math.sin(Math.PI*v);}
    else{P=mk(47);leave=clamp((ql-run)/6.72,0,1);lift=4*Math.sin(Math.PI*0.5*clamp((ql-run)/1.5,0,1));}}
  if(leave>=1)return null;
  // the shoulder: off the picture above, following the row, and part of the way along it, so that the arm pivots and bends as the hand travels
  const S=[x+370+0.42*(P[0]-x-48),P[1]-460],lv=leave*leave*(3-2*leave),L=[0.29,-0.96];
  const D=[lv*760,-lv*560];
  return{x:P[0]+L[0]*lift+D[0],y:P[1]+L[1]*lift+D[1],a:1-lv*lv,S:[S[0]+D[0],S[1]+D[1]],lift};}
// stylus(ctx,x,y,t,a[,o]): the reed's tip at (x,y) (exactly, whenever it presses). o.S: the shoulder (default: up and a little to the right),
// o.lift: how high the tip is above the clay, in px (for the shadow), o.s: the size (1.6: a hand about 145 px long), o.skin
function stylus(ctx,x,y,t,a,o){o=o||{};withA(ctx,a==null?1:a,()=>{const s=o.s||1.6,lift=o.lift||0,U=BY_SCR_U*s,T=BY_SCRT,B2=Math.hypot(T[0],T[1])*s,al=Math.atan2(T[1],T[0]),skin=o.skin||BY_SKIN.scribe;
  let S=o.S||[x+190*s/1.6,y-460*s/1.6];const dx=x-S[0],dy=y-S[1],D=Math.hypot(dx,dy)||1,ux=dx/D,uy=dy/D,Dc=clamp(D,Math.abs(U-B2)+1,U+B2-1);
  // out of reach (or too close), the shoulder comes along the line to the tip
  S=[x-ux*Dc,y-uy*Dc];const aa=(U*U-B2*B2+Dc*Dc)/(2*Dc),hh=Math.sqrt(Math.max(0,U*U-aa*aa)),E1=[S[0]+aa*ux+hh*uy,S[1]+aa*uy-hh*ux],E2=[S[0]+aa*ux-hh*uy,S[1]+aa*uy+hh*ux],E=E1[0]>E2[0]?E1:E2;
  const phi=Math.atan2(y-E[1],x-E[0])-al,thu=Math.atan2(S[1]-E[1],S[0]-E[0]),rim={col:BY_WARMRIM,glow:0.35,ring:1.2/s,blur:10/s};
  // the shadow first, on the clay
  by_scribeShadow(ctx,x,y,phi,s,lift);
  const X=[S[0],E[0],x],Y=[S[1],E[1],y],mg=70*s,W=[E[0]+Math.cos(phi)*(BY_SCR_F-4)*s,E[1]+Math.sin(phi)*(BY_SCR_F-4)*s];
  const bone=(c,ang,fn)=>{c.save();c.translate(E[0],E[1]);c.rotate(ang);c.scale(s,s);fn(c);c.restore();};
  by_figure(ctx,[Math.min(...X)-mg,Math.min(...Y)-mg,Math.max(...X)+mg+BY_SCR_X*s,Math.max(...Y)+mg],(c,e)=>{
    // both bones' edges in one go: their outlines, placed in the picture, as one path
    if(e){const pl=(P,a)=>{const cs=Math.cos(a)*s,sn=Math.sin(a)*s;return P.map(([u,v])=>[E[0]+u*cs-v*sn,E[1]+u*sn+v*cs]);};
      by_liveRim(c,q=>{by_curve(q,pl(BY_SCRF,phi),true);by_curve(q,pl(BY_SCRU,thu),true);},{col:rim.col,glow:rim.glow,ring:rim.ring*s,blur:rim.blur*s});return;}
    bone(c,phi,cc=>by_scribeFore(cc,skin));
    // the hand and the reed: its edge left out at the wrist, where it lies on the forearm
    c.save();c.translate(W[0],W[1]);c.scale(s,s);by_blit(c,"scrH|"+skin,0,0,phi,[-8,-26,100,46],cc=>by_scribeHand(cc,skin),{live:true,merge:true,rim,rimCut:q=>q.fillRect(-60,-60,64,120)});c.restore();
    bone(c,thu,cc=>by_scribeUpper(cc,skin));});});}

/* ---------- warming the caches ---------- */
// The pictures of these figures take 5 to 60 ms each to draw the first time (the brain, the baby's hand as it opens, the host's hand as it closes,
// the scribe's shadow at each angle...). Soon after the film's page loads they are drawn once, off screen, at the player's size, one small batch
// at a time with pauses between, so that playing or seeking into their scenes never stalls. Only on a page with the film's player: not while
// rendering the video, and not on the labs' pages.
(function(){if(typeof window==="undefined"||typeof document==="undefined"||typeof setTimeout!=="function")return;
  const ctx=()=>{const cv=document.getElementById("film"),S=clamp(((cv&&cv.width)||1280)/1920,0.2,1),c=mkCanvas(8,8).getContext("2d");c.setTransform(S,0,0,S,0,0);return c;};
  const card=[840,380,420,286,-0.03],jobs=[c=>by_elder(c,1487,925,1.02,1,{look:[1040,340]}),c=>brain(c,1380,470,2.4,1,0.5,1),c=>baby(c,1120,780,1.3,1,0.8,1,{at:[910,670]}),
    c=>pointArm(c,-60,560,236,500,1.35,1,{at:[900,630],t:1}),c=>pointArm(c,-60,680,740,598,2.0,1,{pose:"give",dress:"coat",card,t:1}),
    c=>{ground(c,600,1);grass(c,0,1920,610,1,0.8);}];
  for(let j=0;j<5;j++)jobs.push(c=>{for(let k=j*4;k<=Math.min(16,j*4+3);k++)baby(c,565,701,1.5,1,k<16?0.2+0.3*k/16:1,1,{at:[1040,340]});});
  for(let j=0;j<5;j++)jobs.push(c=>{for(let k=j*4;k<=Math.min(16,j*4+3);k++)pointArm(c,1360+760,680,1360,556,2.0,1,{pose:"take",dress:"coat",k:k/16,card,t:1});});
  for(let j=0;j<6;j++)jobs.push(c=>{for(let k=0;k<5;k++){const W=by_scribe((j*5+k)*0.19,660,230,600,380);if(W)stylus(c,W.x,W.y,1,W.a,W);}});
  const next=()=>{const f=jobs.shift();if(!f)return;try{f(ctx());}catch(e){}setTimeout(next,40);};
  const go=()=>{if(window.__RENDER__||!document.getElementById("film"))return;setTimeout(next,900);};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();})();
