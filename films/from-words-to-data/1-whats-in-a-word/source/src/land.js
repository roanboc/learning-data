/* ===== What's in a word: the land =====
   The ground of the grassland, its grass, trees and bushes, a branch for a bird, layers of rock with fossils in them, and a clay tablet.
   Scenes place these; each draws in the frame's own units (1920 × 1080), and moves with t where the world would move.
   Whatever holds still (bark, leaves, rock, clay) is painted once into offscreen canvases, and each frame only places them, on whole
   pixels when the frame is drawn 1:1; leaves and grass bend with one breeze, ln_wind(x,t), whose gusts roll across from the left. */

/* ---------- shared: caches, noise, the breeze ---------- */
const LN_C=new Map();
function ln_cv(w,h){return mkCanvas(Math.max(1,Math.ceil(w)),Math.max(1,Math.ceil(h)));}
// smooth noise in -1..1, in one and two dimensions, and a few octaves of it
function ln_n1(x,s){const i=Math.floor(x),f=x-i;return lerp(hash(i,s),hash(i+1,s),f*f*(3-2*f))*2-1;}
function ln_fbm(x,s,o){let v=0,a=0.5,f=1;for(let k=0;k<(o||4);k++){v+=a*ln_n1(x*f+k*13.1,s+k);f*=2.03;a*=0.5;}return v;}
function ln_n2(x,y,s){const i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j,su=u*u*(3-2*u),sv=v*v*(3-2*v),h=(a,b)=>hash(a*57.31+b*131.7,s);
  return lerp(lerp(h(i,j),h(i+1,j),su),lerp(h(i,j+1),h(i+1,j+1),su),sv)*2-1;}
// the breeze at x, about 0.3 to 1.2: a steady lean, and gusts that roll across from the left at uneven speed
function ln_wind(x,t){const g=0.5+0.5*Math.sin(x*0.0062-t*1.15+1.3*Math.sin(t*0.21)),h=0.5+0.5*Math.sin(x*0.0023-t*0.47+1.7);return 0.3+0.9*g*g*(0.3+0.7*h);}
// a point on the cubic p=[x0,y0,x1,y1,x2,y2,x3,y3]
function ln_bz(p,u){const m=1-u,a=m*m*m,b=3*m*m*u,c=3*m*u*u,d=u*u*u;return[a*p[0]+b*p[2]+c*p[4]+d*p[6],a*p[1]+b*p[3]+c*p[5]+d*p[7]];}
// adds to the path a tapering tube along the cubic p, w0 wide at its start and w1 at its end, its end rounded
function ln_tube(c,p,w0,w1,n){n=n||18;const L=[],R=[];for(let i=0;i<=n;i++){const u=i/n,a=ln_bz(p,Math.max(0,u-0.02)),b=ln_bz(p,Math.min(1,u+0.02)),q=ln_bz(p,u);
    let tx=b[0]-a[0],ty=b[1]-a[1];const l=Math.hypot(tx,ty)||1;tx/=l;ty/=l;const w=lerp(w0,w1,Math.pow(u,0.85))/2;L.push([q[0]+ty*w,q[1]-tx*w]);R.push([q[0]-ty*w,q[1]+tx*w]);}
  const e=ln_bz(p,1);c.moveTo(L[0][0],L[0][1]);for(let i=1;i<=n;i++)c.lineTo(L[i][0],L[i][1]);c.quadraticCurveTo(e[0]+(e[0]-ln_bz(p,0.97)[0])*w1*0.3,e[1]+(e[1]-ln_bz(p,0.97)[1])*w1*0.3,R[n][0],R[n][1]);
  for(let i=n-1;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();}
// draws V[k] (the same picture shifted k/V.length px right) with its corner at (x,y): on whole device pixels when drawn 1:1, where it is sharpest and fastest
function ln_put(ctx,V,x,y,m){m=m||ctx.getTransform();if(m.a===1&&m.d===1&&m.b===0&&m.c===0){const n=V.length,q=Math.round((x+m.e)*n),ix=Math.floor(q/n);ctx.drawImage(V[q-ix*n],ix-m.e,Math.round(y+m.f)-m.f);}else ctx.drawImage(V[0],x,y);}
// the rim of a mask M (same size as c's canvas): its edges that face (-dx,-dy), in colour col, with a soft glow
function ln_rim(c,M,dx,dy,col,a,blur){const R=ln_cv(M.width,M.height),r=R.getContext("2d");r.drawImage(M,0,0);r.globalCompositeOperation="destination-out";r.drawImage(M,dx,dy);
  r.globalCompositeOperation="source-in";r.fillStyle=col;r.fillRect(0,0,R.width,R.height);c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=a;if(blur){c.shadowColor=col;c.shadowBlur=blur;}c.drawImage(R,0,0);c.restore();}
// a mask painted in colour: the shapes of M filled with fill (a colour or gradient), drawn onto c
function ln_tint(c,M,fill,a){const R=ln_cv(M.width,M.height),r=R.getContext("2d");r.drawImage(M,0,0);r.globalCompositeOperation="source-in";r.fillStyle=fill;r.fillRect(0,0,R.width,R.height);
  c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=a==null?1:a;c.drawImage(R,0,0);c.restore();return R;}

/* ---------- leaves: clumps of puffs, lit from the upper left ---------- */
// the puffs of a cluster of leaves sp {rx,ry,clumps,seed,r,dens,flat}: a few clumps side by side, domed above and (if flat) cut flat below
function ln_puffs(sp){const P=[],nc=sp.clumps;for(let k=0;k<nc;k++){const q=j=>hash(k+sp.seed*17,sp.seed+j),u=nc>1?-1+2*(k+0.5)/nc:0,cx=(u*0.74+(q(1)-0.5)*0.2)*sp.rx,e=Math.sqrt(Math.max(0.05,1-(cx/sp.rx)*(cx/sp.rx))),
    crx=sp.rx/nc*(1.1+0.45*q(2)),cry=sp.ry*(0.55+0.4*e)*(0.8+0.35*q(3)),cy=-sp.ry*0.22*e+(q(4)-0.5)*sp.ry*0.4,n=Math.round((sp.dens||1)*3.4*crx*cry/(sp.r*sp.r))+6;
    for(let i=0;i<n;i++){const h=j=>hash(i+k*131+sp.seed*7,sp.seed*3+j),a=h(5)*TAU,d=Math.sqrt(h(6));let x=cx+Math.cos(a)*d*crx,y=cy+Math.sin(a)*d*cry;
      if(sp.flat)y=Math.min(y,cy+cry*(0.35+0.2*h(8)));P.push({x,y,r:sp.r*(0.5+0.6*h(7))*(1.15-0.45*d),k,cx,cy,crx,cry});}}
  return P;}
// a cluster of leaves painted into its own canvas, sub px right of centre; returns {c,ox,oy}, (ox,oy) being where its centre lies.
// Each clump is one mass, shaded as a whole from its lit upper left to its dark lower right, with a lobe or two showing, and fine leaves on it
function ln_leaves(sp,s,sub){const pal=sp.pal,sq=sp.sq||0.78,m=Math.ceil((14+0.35*sp.rx)*s),W=Math.ceil(2*sp.rx*s)+2*m+2,H=Math.ceil(2*sp.ry*s)+2*m,ox=m+Math.ceil(sp.rx*s),oy=m+Math.ceil(sp.ry*s);
  const c=ln_cv(W,H),x=c.getContext("2d"),M=ln_cv(W,H),mx=M.getContext("2d"),P=ln_puffs(sp),T=q=>q.setTransform(s,0,0,s,ox+(sub||0),oy);
  const blob=(q,p,dx,dy,k)=>{const r=p.r*k;q.moveTo(p.x+dx+r,p.y+dy);q.ellipse(p.x+dx,p.y+dy,r,r*sq,0,0,TAU);};
  T(mx);mx.fillStyle="#fff";mx.beginPath();P.forEach(p=>blob(mx,p,0,0,1));mx.fill();
  T(x);const ks=[];P.forEach(p=>{if(!ks.includes(p.k))ks.push(p.k);});ks.sort((a,b)=>P.find(p=>p.k===a).cy-P.find(p=>p.k===b).cy);
  ks.forEach(k=>{const Q=P.filter(p=>p.k===k),p0=Q[0],path=(dx,dy)=>{x.beginPath();Q.forEach(p=>blob(x,p,dx,dy,1));};
    // its shadow on what lies behind, then the mass
    path(0.8,1.8);x.fillStyle=rgba(pal.dark,0.85);x.fill();
    path(0,0);const g=x.createLinearGradient(p0.cx-p0.crx*0.55,p0.cy-p0.cry*1.1,p0.cx+p0.crx*0.45,p0.cy+p0.cry*0.9);g.addColorStop(0,rgba(pal.lit,1));g.addColorStop(0.42,rgba(pal.body,1));g.addColorStop(1,rgba(pal.dark,1));x.fillStyle=g;x.fill();
    x.save();x.clip();
    // lobes: the lit upper edge of some puffs inside the mass
    x.lineWidth=0.9;Q.forEach((p,i)=>{if(hash(i,sp.seed+50)>0.3)return;const l=(p.x-p.cx)/p.crx*0.7+(p.y-p.cy)/p.cry;x.strokeStyle=rgba(l<0.2?pal.hi:pal.lit,l<0.2?0.35:0.3);x.beginPath();x.ellipse(p.x,p.y,p.r*0.95,p.r*sq*0.95,0,Math.PI*1.02,Math.PI*1.6);x.stroke();
      x.strokeStyle=rgba(pal.dark,0.45);x.beginPath();x.ellipse(p.x,p.y,p.r*0.95,p.r*sq*0.95,0,Math.PI*0.05,Math.PI*0.6);x.stroke();});
    // the leaves: fine flecks, pale where the light falls, dark in the shade
    const nf=Math.round(p0.crx*p0.cry*(sp.leaf?0.55:0.9));for(let i=0;i<nf;i++){const h=j=>hash(i+k*997+sp.seed*13,j+40),a=h(0)*TAU,d=Math.sqrt(h(1)),fx=p0.cx+Math.cos(a)*d*p0.crx*1.1,fy=p0.cy+Math.sin(a)*d*p0.cry*1.1,
      l=(fx-p0.cx)/p0.crx*0.7+(fy-p0.cy)/p0.cry+(h(2)-0.5)*0.9;x.fillStyle=l<-0.1?rgba(pal.hi,0.35+0.4*h(3)):l>0.5?rgba(pal.dark,0.55):rgba(pal.lit,0.35);x.beginPath();
      if(sp.leaf)x.ellipse(fx,fy,sp.leaf*(0.7+0.5*h(4)),sp.leaf*0.42,h(5)*3,0,TAU);else x.ellipse(fx,fy,0.5+0.6*h(4),0.35+0.3*h(4),h(5)*3,0,TAU);x.fill();}
    x.restore();});
  ln_rim(x,M,-1.4*s,-1.8*s,rgba(pal.deep||[4,8,8],1),0.6,0);
  ln_rim(x,M,1.2*s,1.4*s,rgba(pal.rim,1),pal.ra||0.6,3*s);
  return{c,ox,oy};}
// the same cluster in four sub-pixel shifts, so that it can sway smoothly on whole pixels
function ln_cluster(key,sp,s){let F=LN_C.get(key);if(F)return F;const V=[0,1,2,3].map(k=>ln_leaves(sp,s,k/4));F={V:V.map(v=>v.c),ox:V[0].ox,oy:V[0].oy};LN_C.set(key,F);return F;}

/* ---------- the ground ---------- */
const LN_FAR=[[1300,0.56],[1742,0.64],[64,0.46],[586,0.4]];
// a far acacia on the horizon, k its size: a short trunk forking under a flat crown, dark against the hills, its top catching the last light
function ln_farTree(c,x,y,k,col){c.fillStyle=col;c.strokeStyle=col;c.lineCap="round";c.lineWidth=2.4*k;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-1*k,y-9*k,x+1*k,y-15*k);c.moveTo(x,y-6*k);c.quadraticCurveTo(x-6*k,y-11*k,x-10*k,y-15*k);c.moveTo(x+0.5*k,y-8*k);c.quadraticCurveTo(x+7*k,y-12*k,x+12*k,y-15.5*k);c.stroke();
  const P=[];for(let i=0;i<11;i++){const u=i/10-0.5;P.push([x+u*46*k+(hash(i,x)-0.5)*4*k,y-18*k-(1-4*u*u)*2.6*k+(hash(i,x+1)-0.5)*2*k,(4.6+2.4*hash(i,x+2))*k]);}
  c.beginPath();P.forEach(([px,py,r])=>{c.moveTo(px+r,py);c.ellipse(px,py,r,r*0.5,0,0,TAU);});c.fill();
  c.strokeStyle="rgba(255,196,140,0.3)";c.lineWidth=0.9;c.beginPath();P.forEach(([px,py,r])=>{c.moveTo(px-r*0.8,py-r*0.3);c.ellipse(px,py,r,r*0.5,0,Math.PI*1.12,Math.PI*1.88);});c.stroke();}
function ln_groundKit(y){const key="gd"+y;let G=LN_C.get(key);if(G)return G;const top=Math.floor(y-120),c=ln_cv(1920,1080-top),x=c.getContext("2d");x.translate(0,-top);
  // the last warmth of the day, low over the land
  let g=x.createLinearGradient(0,y-120,0,y+4);g.addColorStop(0,"rgba(255,170,110,0)");g.addColorStop(0.7,"rgba(255,160,100,0.035)");g.addColorStop(1,"rgba(255,150,96,0.08)");x.fillStyle=g;x.fillRect(0,y-120,1920,124);
  // far hills, a nearer ridge, and a line of bush with acacias on it; the farther, the paler and bluer
  const hill=(X,c,w,h)=>h*Math.exp(-((X-c)/w)*((X-c)/w)),far=X=>y-10-hill(X,300,220,30)-hill(X,820,300,20)-hill(X,1180,260,44)-hill(X,1560,190,26)-hill(X,1890,260,36)-12*(0.5+0.5*ln_fbm(X*0.004,11,4))-2.5*ln_fbm(X*0.02,12,2),
    mid=X=>y-5-hill(X,620,240,13)-hill(X,1420,320,17)-5*(0.5+0.5*ln_fbm(X*0.006,13,3)),near=X=>y-2-6*(0.5+0.5*ln_fbm(X*0.0042,23,3));
  const ridge=(f,c0,c1,h)=>{x.beginPath();x.moveTo(0,y+6);for(let X=0;X<=1920;X+=4)x.lineTo(X,f(X));x.lineTo(1920,y+6);x.closePath();g=x.createLinearGradient(0,y-h,0,y);g.addColorStop(0,c0);g.addColorStop(1,c1);x.fillStyle=g;x.fill();};
  ridge(far,"rgb(28,34,52)","rgb(18,22,34)",70);x.beginPath();for(let X=0;X<=1920;X+=4)X?x.lineTo(X,far(X)):x.moveTo(X,far(X));x.strokeStyle="rgba(160,168,210,0.16)";x.lineWidth=1.1;x.stroke();
  ridge(mid,"rgb(21,26,38)","rgb(16,20,28)",30);x.beginPath();for(let X=0;X<=1920;X+=4)X?x.lineTo(X,mid(X)):x.moveTo(X,mid(X));x.strokeStyle="rgba(150,150,170,0.08)";x.lineWidth=1;x.stroke();
  LN_FAR.forEach(([X,k])=>ln_farTree(x,X,near(X)+1,k,"rgb(8,11,14)"));
  x.beginPath();x.moveTo(0,y+6);for(let X=0;X<=1920;X+=4)x.lineTo(X,near(X));x.lineTo(1920,y+6);x.closePath();x.fillStyle="rgb(14,18,20)";x.fill();
  // the plain: a gently rolling edge, lit a little from the upper left, darker toward us
  const edge=X=>y+2.6*ln_fbm(X*0.005,5,3);x.beginPath();x.moveTo(0,1080);for(let X=0;X<=1920;X+=4)x.lineTo(X,edge(X));x.lineTo(1920,1080);x.closePath();
  g=x.createLinearGradient(0,y-4,0,1080);g.addColorStop(0,"rgb(50,58,38)");g.addColorStop(0.1,"rgb(34,42,28)");g.addColorStop(0.45,"rgb(19,24,17)");g.addColorStop(1,"rgb(7,9,8)");x.fillStyle=g;x.fill();
  x.save();x.clip();
  g=x.createLinearGradient(0,0,1920,0);g.addColorStop(0,"rgba(255,220,160,0.05)");g.addColorStop(0.5,"rgba(255,220,160,0)");g.addColorStop(1,"rgba(0,0,0,0.12)");x.fillStyle=g;x.fillRect(0,y-10,1920,1090-y);
  // patches of darker and paler grass, seen in perspective: noise laid on the plain, stretched with distance
  const tw=480,th=Math.max(1,Math.ceil((1080-y)/4)),N=ln_cv(tw,th),nx=N.getContext("2d"),D=nx.createImageData(tw,th);
  for(let j=0;j<th;j++){const dy=j*4+2,z=900/(dy+6),fade=Math.min(1,dy/50);for(let i=0;i<tw;i++){const wx=(i*4+2-960)/(dy+6),v=ln_n2(wx*1.1,z*1.1,7)*0.65+ln_n2(wx*3.1,z*3.1,8)*0.35,o=(j*tw+i)*4;
    if(v<0){D.data[o]=0;D.data[o+1]=0;D.data[o+2]=0;D.data[o+3]=Math.round(255*fade*Math.min(0.22,-v*0.5));}else{D.data[o]=150;D.data[o+1]=150;D.data[o+2]=92;D.data[o+3]=Math.round(255*fade*Math.min(0.06,Math.max(0,v-0.12)*0.22));}}}
  nx.putImageData(D,0,0);x.imageSmoothingEnabled=true;x.drawImage(N,0,y,1920,th*4);
  // grass all over the plain, seen in perspective: tapered blades, tiny near the horizon, taller and warmer toward us; the nearest in shade
  const bl=(px,py,h,w,lean,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(px-w/2,py);x.quadraticCurveTo(px-w*0.2+lean*h*0.4,py-h*0.55,px+lean*h,py-h);x.quadraticCurveTo(px+w*0.2+lean*h*0.4,py-h*0.55,px+w/2,py);x.closePath();x.fill();};
  for(let i=0;i<9000;i++){const d=Math.pow(hash(i,311),1.5),px=hash(i,312)*1940-10,py=y+5+d*(1085-y),h=(0.8+1.6*hash(i,313))*(1+14*Math.pow(d,1.4)),w=0.6+2.4*d,lean=(hash(i,314)-0.4)*0.55,q=hash(i,315),
      lt=clamp(1.1-0.9*d,0.25,1),a=(0.1+0.22*d)*(0.6+0.4*hash(i,316));
    bl(px,py,h,w,lean,q<0.45?rgba(mix([96,100,60],[164,144,96],d),a*lt):q<0.75?rgba([4,6,4],0.35+0.25*d):rgba(mix([60,70,44],[120,100,66],d),a*1.3*lt));}
  // a few stones, lit from the upper left
  for(let i=0;i<16;i++){const d=0.35+0.65*hash(i,321),px=hash(i,322)*1920,py=y+10+d*(1080-y-20),r=(1.5+3*hash(i,323))*(0.5+1.4*d);
    x.fillStyle="rgba(3,4,3,0.5)";x.beginPath();x.ellipse(px+r*0.3,py+r*0.25,r*1.1,r*0.5,0,0,TAU);x.fill();x.fillStyle="rgba(46,50,40,0.8)";x.beginPath();x.ellipse(px,py,r,r*0.5,0,0,TAU);x.fill();
    x.fillStyle="rgba(150,150,120,0.16)";x.beginPath();x.ellipse(px-r*0.3,py-r*0.16,r*0.5,r*0.2,0,0,TAU);x.fill();}
  x.restore();
  // the rim of the land, where the light catches it
  x.save();x.beginPath();for(let X=0;X<=1920;X+=4)X?x.lineTo(X,edge(X)):x.moveTo(X,edge(X));g=x.createLinearGradient(0,0,1920,0);g.addColorStop(0,"rgba(190,205,140,0.42)");g.addColorStop(1,"rgba(160,180,130,0.22)");
  x.strokeStyle=g;x.lineWidth=1.3;x.shadowColor="rgba(170,200,120,0.6)";x.shadowBlur=6;x.stroke();x.restore();
  G={c,top};LN_C.set(key,G);return G;}
// the ground of a scene, from y down to the bottom of the frame: a grassland at dusk, with hills and acacias far off
function ground(ctx,y,t,a){const G=ln_groundKit(Math.round(y));withA(ctx,a==null?1:a,()=>ln_put(ctx,[G.c],0,G.top));}

/* ---------- grass ---------- */
// three depths of grass, back to front: spacing of clumps, blade heights, blades a clump, blade widths, sway (px at the tip), rooting depth,
// spread of a clump, share of empty places, and how many kinds of clump
const LN_GR=[{d:6,h:[5,12],n:[6,10],w:[1.0,1.6],A:1.4,dy:[-6,-1],sp:9,skip:0.03,V:8,dim:0.5},
  {d:11,h:[10,24],n:[6,10],w:[1.4,2.3],A:4,dy:[-1,4],sp:13,skip:0.08,V:10,dim:0.76},
  {d:20,h:[16,38],n:[5,10],w:[1.8,3.0],A:7,dy:[3,13],sp:16,skip:0.22,V:12,dim:1}];
// tones of blades, from the base (in shade) to the tip (in the last light): olive, straw, rust, grey-green
const LN_GT=[[[20,24,16],[62,70,40],[134,136,80]],[[26,24,16],[98,86,50],[184,164,104]],[[24,20,16],[94,70,46],[160,122,82]],[[16,24,20],[54,72,54],[104,128,92]]];
// a blade: its centre line bends by its lean, its own curl, and the wind D, most near the tip; it tapers to a point
function ln_blade(c,b,D,hr,lit){const f=Math.pow(b.h/hr,1.5),bend=b.cu*b.h+D*f,tip=b.lean*b.h+bend,k=1-0.14*Math.min(1,(tip/b.h)*(tip/b.h)),n=7,L=[],R=[];
  for(let i=0;i<=n;i++){const u=i/n,x=b.bx+b.lean*b.h*u+bend*u*u,y=-b.h*k*u,dx=b.lean*b.h+2*bend*u,dy=-b.h*k,l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l,hw=b.w/2*Math.pow(1-u,0.75);
    L.push([x-nx*hw,y-ny*hw]);R.push([x+nx*hw,y+ny*hw]);}
  c.beginPath();c.moveTo(L[0][0],L[0][1]);for(let i=1;i<=n;i++)c.lineTo(L[i][0],L[i][1]);for(let i=n-1;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();c.fill();
  if(lit){c.beginPath();c.moveTo(L[2][0],L[2][1]);for(let i=3;i<n;i++)c.lineTo(L[i][0],L[i][1]);c.stroke();}
  return[b.bx+tip,-b.h*k,b.lean*b.h+2*bend,-b.h*k];}
// cuts the cells [x,y,w,h] of the atlas c into canvases of their own, each trimmed to what shows in it, with its offset (ox,oy) in the cell:
// a whole small canvas is drawn several times faster than a piece of a big one
function ln_cut(c,cells){const W=c.width,D=c.getContext("2d").getImageData(0,0,W,c.height).data;return cells.map(([x,y,w,h])=>{let a=w,b=h,e=-1,f=-1;
  for(let j=0;j<h;j++){const r=((y+j)*W+x)*4+3;for(let i=0;i<w;i++)if(D[r+i*4]>1){if(i<a)a=i;if(i>e)e=i;if(j<b)b=j;f=j;}}
  if(e<0){a=0;b=0;e=0;f=0;}const q=ln_cv(e-a+1,f-b+1);q.getContext("2d").drawImage(c,x+a,y+b,e-a+1,f-b+1,0,0,e-a+1,f-b+1);return{c:q,ox:a,oy:b};});}
// the clumps of each depth, painted once at every lean the breeze can give them (0.5 px apart at the tip), into one atlas a depth
function ln_grassKit(){let K=LN_C.get("gr");if(K)return K;
  K=LN_GR.map((G,li)=>{const hr=G.h[1],D0=G.A*0.12,NL=Math.ceil((G.A*1.35-D0)*2)+1,vars=[];
    for(let v=0;v<G.V;v++){const q=j=>hash(v+li*50,j),n=G.n[0]+Math.floor(q(1)*(G.n[1]-G.n[0]+1)),B=[];
      for(let i=0;i<n;i++){const r=j=>hash(v*31+i+li*977,j+10),bx=(r(2)-0.5)*G.sp*(0.35+0.65*r(3));B.push({bx,h:lerp(G.h[0],hr,Math.pow(r(4),0.75)),lean:bx/G.sp*0.55+(r(5)-0.5)*0.3,cu:(r(6)-0.4)*0.28,w:lerp(G.w[0],G.w[1],r(7)),tone:Math.floor(r(8)*4)});}
      B.mean=B.reduce((s,b)=>s+b.h,0)/n;B.sort((a,b)=>b.h-a.h);vars.push(B);}
    vars.sort((a,b)=>a.mean-b.mean);  // shortest clumps first, so that a scene can pick taller ones where the grass grows lush
    // how far any blade reaches, at the least and the most wind
    let x0=0,x1=0;vars.forEach(B=>B.forEach(b=>[D0,D0+(NL-1)*0.5].forEach(D=>{const f=Math.pow(b.h/hr,1.5),tip=b.bx+b.lean*b.h+b.cu*b.h+D*f;x0=Math.min(x0,tip-4,b.bx-3);x1=Math.max(x1,tip+4,b.bx+3);})));
    const cw=Math.ceil(x1-x0)+4,ax=Math.ceil(-x0)+2,rows=[];let yy=0;vars.forEach(B=>{const h=Math.ceil(B[0].h)+7;rows.push({y:yy,h,ay:h-2});yy+=h;});
    const c=ln_cv(cw*NL,yy),x=c.getContext("2d"),dimC=col=>mix([10,14,22],col,G.dim);
    const grads=LN_GT.map(T=>{const g=x.createLinearGradient(0,0,0,-hr*1.15);g.addColorStop(0,rgba(dimC(T[0]),1));g.addColorStop(0.45,rgba(dimC(T[1]),1));g.addColorStop(1,rgba(dimC(T[2]),1));return g;});
    x.lineWidth=0.6;x.strokeStyle=rgba(dimC([220,214,160]),0.32);
    vars.forEach((B,v)=>{for(let l=0;l<NL;l++){x.setTransform(1,0,0,1,l*cw+ax,rows[v].y+rows[v].ay);B.forEach(b=>{x.fillStyle=grads[b.tone];ln_blade(x,b,D0+l*0.5,hr,li>0);});}});
    const sp=li<2?null:ln_cut(c,rows.flatMap(r=>Array.from({length:NL},(_,l)=>[l*cw,r.y,cw,r.h])));
    return{c:li<2?c:null,cw,ax,rows,NL,D0,hr,sp};});
  LN_C.set("gr",K);return K;}

/* seed stems, standing above the clumps here and there: a culm with a leaf or two, and a head */
// an airy panicle (Panicum): a nodding axis with hair-thin branches in whorls, longest below, drooping, a spikelet at each tip
function ln_panicle(c,tip,sd){const [x,y,dx,dy]=tip,dr=dx>=0?1:-1,L=22+8*hash(sd,1),n=8,ax=[];let px=x,py=y,a=Math.atan2(dy,dx);
  for(let i=0;i<=n;i++){ax.push([px,py,a]);a+=dr*0.17;px+=Math.cos(a)*L/n;py+=Math.sin(a)*L/n;}
  const sp=(qx,qy,e)=>{c.fillStyle="rgba(196,178,132,0.95)";c.beginPath();c.ellipse(qx,qy,1.5,0.65,e,0,TAU);c.fill();c.fillStyle="rgba(240,228,190,0.55)";c.beginPath();c.ellipse(qx-0.3,qy-0.35,0.7,0.3,e,0,TAU);c.fill();};
  c.lineCap="round";c.strokeStyle="rgba(156,140,102,0.8)";c.lineWidth=0.6;c.beginPath();ax.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  for(let i=1;i<n;i++)for(let k=0;k<(i<4?2:1);k++){const [bx,by,ba]=ax[i],sde=(i+k)%2?1:-1,bl=(5+13*(1-i/n))*(0.75+0.5*hash(i*2+k,sd+2));let qx=bx,qy=by,qa=ba+sde*(0.85+0.4*hash(i*2+k,sd+3));const P=[[qx,qy]];
    for(let j=0;j<5;j++){qx+=Math.cos(qa)*bl/5;qy+=Math.sin(qa)*bl/5+0.02*j*j*bl;P.push([qx,qy]);}
    c.strokeStyle="rgba(156,140,102,0.55)";c.lineWidth=0.42;c.beginPath();P.forEach((p,j)=>j?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    const e=Math.atan2(P[5][1]-P[4][1],P[5][0]-P[4][0]);sp(P[5][0]+Math.cos(e)*1.2,P[5][1]+Math.sin(e)*1.2,e);if(bl>9&&hash(i*2+k,sd+4)<0.7){const m=P[3],e2=e+sde*0.7;c.beginPath();c.moveTo(m[0],m[1]);c.lineTo(m[0]+Math.cos(e2)*2.5,m[1]+Math.sin(e2)*2.5);c.stroke();sp(m[0]+Math.cos(e2)*3.6,m[1]+Math.sin(e2)*3.6,e2);}}
  const e=ax[n];sp(e[0],e[1],e[2]);}
// red oat grass (Themeda): clusters of rusty spikelets in narrow sheaths, nodding from the top of the culm on short stalks,
// each with a long dark awn, twisted, bent at the knee
function ln_themeda(c,S,sd){c.lineCap="round";[[0.66,-1],[0.82,1],[1,-1]].forEach(([u,sde],j)=>{const p=S(u),q=S(Math.max(0,u-0.02)),ta=Math.atan2(p[1]-q[1],p[0]-q[0]),
    pa=ta+sde*(j===2?0.5:1.0),pl=j===2?2.5:4,x=p[0]+Math.cos(pa)*pl,y=p[1]+Math.sin(pa)*pl,ha=Math.PI/2-sde*0.35;  // the cluster hangs, a little outward
    c.strokeStyle="rgba(100,76,50,0.9)";c.lineWidth=0.5;c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo(p[0]+Math.cos(pa)*pl*1.2,p[1]+Math.sin(pa)*pl*1.2-1,x,y);c.stroke();
    // the sheath (a spathe), then the spikelets in its mouth
    c.fillStyle="rgba(84,56,40,0.95)";c.beginPath();c.ellipse(x+Math.cos(ha)*3.4,y+Math.sin(ha)*3.4,3.8,0.9,ha,0,TAU);c.fill();
    for(let k=0;k<3;k++){const a=ha+(k-1)*0.28,cx=x+Math.cos(a)*5,cy=y+Math.sin(a)*5;c.fillStyle="rgba(116,74,50,0.95)";c.beginPath();c.ellipse(cx,cy,2.3,0.75,a,0,TAU);c.fill();
      c.fillStyle="rgba(170,114,78,0.45)";c.beginPath();c.ellipse(cx-0.3,cy-0.3,1.2,0.35,a,0,TAU);c.fill();}
    // the awn of the fertile spikelet
    const ex=x+Math.cos(ha)*7,ey=y+Math.sin(ha)*7,a1=ha-sde*0.5,l1=5+2*hash(j,sd),kx=ex+Math.cos(a1)*l1,ky=ey+Math.sin(a1)*l1,b2=a1-sde*(0.9+0.3*hash(j,sd+5)),l2=7+4*hash(j,sd+6);
    c.strokeStyle="rgba(50,36,26,0.95)";c.lineWidth=0.5;c.beginPath();c.moveTo(ex,ey);for(let s=1;s<=4;s++){const w=s%2?0.45:-0.45;c.lineTo(lerp(ex,kx,s/4)+w*Math.sin(a1),lerp(ey,ky,s/4)-w*Math.cos(a1));}c.lineTo(kx+Math.cos(b2)*l2,ky+Math.sin(b2)*l2);c.stroke();
    c.strokeStyle="rgba(150,110,76,0.4)";c.lineWidth=0.4;c.beginPath();c.moveTo(kx,ky);c.lineTo(kx+Math.cos(b2)*l2,ky+Math.sin(b2)*l2);c.stroke();});}
const LN_ST={V:6,A:6,hr:38};
function ln_stemKit(){let K=LN_C.get("gs");if(K)return K;const G=LN_ST,D0=G.A*0.12,NL=Math.ceil((G.A*1.35-D0)*2)+1,vars=[];
  for(let v=0;v<G.V;v++){const q=j=>hash(v,j+60),h=G.hr*1.55*(0.72+0.56*q(1)),kind=v%2;
    vars.push({h,kind,lean:(q(2)-0.45)*0.22,cu:0.05+0.08*q(3),w:1.25,tone:1,bx:0,leaves:[[0.18+0.12*q(4),q(5)<0.5?-1:1,12+8*q(6)],[0.42+0.1*q(7),q(5)<0.5?1:-1,9+6*q(8)]]});}
  const cw=110,ax=48,ch=Math.ceil(G.hr*1.55*1.28)+34,c=ln_cv(cw*NL,ch*G.V),x=c.getContext("2d");
  vars.forEach((b,v)=>{for(let l=0;l<NL;l++){x.setTransform(1,0,0,1,l*cw+ax,v*ch+ch-3);const D=D0+l*0.5,f=1,bend=b.cu*b.h+D*f,k=1-0.1*Math.min(1,((b.lean*b.h+bend)/b.h)**2);
      const S=u=>[b.lean*b.h*u+bend*u*u,-b.h*k*u],Sd=u=>[b.lean*b.h+2*bend*u,-b.h*k];
      // the leaves at its nodes, arching away
      b.leaves.forEach(([u,sde,L])=>{const p=S(u),d=Sd(u),a=Math.atan2(d[1],d[0])+sde*0.55,ex=p[0]+Math.cos(a)*L*0.55+sde*L*0.35+D*0.3,ey=p[1]+Math.sin(a)*L*0.55+L*0.25;
        x.fillStyle="rgb(56,58,34)";x.beginPath();x.moveTo(p[0]-0.6,p[1]);x.quadraticCurveTo(p[0]+Math.cos(a)*L*0.5,p[1]+Math.sin(a)*L*0.5-1,ex,ey);x.quadraticCurveTo(p[0]+Math.cos(a)*L*0.45+0.8,p[1]+Math.sin(a)*L*0.45+0.4,p[0]+0.6,p[1]+0.6);x.fill();});
      // the culm, straw-coloured toward its top
      const g=x.createLinearGradient(0,0,0,-b.h);g.addColorStop(0,"rgb(40,40,26)");g.addColorStop(0.5,"rgb(112,100,62)");g.addColorStop(1,"rgb(170,152,104)");x.fillStyle=g;
      x.beginPath();for(let i=0;i<=12;i++){const p=S(i/12),hw=0.65*(1-i/14);i?x.lineTo(p[0]-hw,p[1]):x.moveTo(p[0]-hw,p[1]);}for(let i=12;i>=0;i--){const p=S(i/12),hw=0.65*(1-i/14);x.lineTo(p[0]+hw,p[1]);}x.closePath();x.fill();
      const e=S(1),d=Sd(1);if(b.kind===0)ln_panicle(x,[e[0],e[1],d[0],d[1]],v*7+3);else ln_themeda(x,S,v*7+3);}});
  K={cw,ax,ch,NL,D0,vars,sp:ln_cut(c,vars.flatMap((_,v)=>Array.from({length:NL},(_,l)=>[l*cw,v*ch,cw,ch])))};LN_C.set("gs",K);return K;}

/* where the clumps and stems of one stretch of grass stand; the back two depths are baked into strips, one per lean, cut into slices each frame */
function ln_grassLay(x0,x1,y){const key=x0+"_"+x1+"_"+y,LC=LN_C.get("gl")||new Map();LN_C.set("gl",LC);let P=LC.get(key);if(P){LC.delete(key);LC.set(key,P);return P;}
  const K=ln_grassKit();
  P=K.map((L,li)=>{const G=LN_GR[li],s=li*7,cl=[];
    for(let i=Math.floor((x0-40)/G.d),i1=Math.ceil((x1+40)/G.d);i<=i1;i++){const cx=(i+0.15+0.7*hash(i,s+4))*G.d,lush=0.5+0.5*ln_fbm(cx*0.0045+li*2.3,91,2);
      if(hash(i,s+3)<G.skip+(0.5-lush)*0.3||cx<x0-24||cx>x1+24)continue;
      const v=Math.floor(clamp(lush*0.9+(hash(i,s+5)-0.5)*0.7,0,0.999)*G.V);cl.push({cx,v,R:L.rows[v],dy:lerp(G.dy[0],G.dy[1],hash(i,s+6)),ph:hash(i,s+7)*TAU});}
    if(li===2)return{cl};
    // a strip: every clump of this depth at each lean, stacked
    const X0=Math.floor(x0-40-L.cw),W=Math.ceil(x1+40+L.cw)-X0;let top=1e9,bot=-1e9;cl.forEach(k=>{const yy=Math.round(y+k.dy-k.R.ay);top=Math.min(top,yy);bot=Math.max(bot,yy+k.R.h);});
    const SH=bot-top,cs=[];
    for(let l=0;l<L.NL;l++){const c=ln_cv(W,SH),x=c.getContext("2d");cl.forEach(k=>x.drawImage(L.c,l*L.cw,k.R.y,L.cw,k.R.h,Math.round(k.cx-L.ax)-X0,Math.round(y+k.dy-k.R.ay)-top,L.cw,k.R.h));cs.push(c);}
    return{cs,X0,W,top,SH};});
  // the stems: a few, in loose groups where the grass grows lush
  const SK=ln_stemKit(),st=[];for(let i=Math.floor(x0/70)-1,i1=Math.ceil(x1/70)+1;i<=i1;i++){const lush=0.5+0.5*ln_fbm(i*70*0.0045+4.6,91,2);if(hash(i,501)>0.22+0.5*lush)continue;
    const n=1+Math.floor(hash(i,502)*3);for(let j=0;j<n;j++){const cx=(i+hash(i*5+j,503))*70;if(cx<x0-10||cx>x1+10)continue;st.push({cx,v:Math.floor(hash(i*5+j,504)*SK.vars.length),dy:6+8*hash(i*5+j,505),ph:hash(i*5+j,506)*TAU});}}
  P.st=st;LC.set(key,P);if(LC.size>4)LC.delete(LC.keys().next().value);return P;}
// grass along y from x0 to x1: tapered blades of many heights, leans and tones, in clumps, at three depths, with a few seed heads;
// gusts roll across from the left, the near blades moving most
function grass(ctx,x0,x1,y,t,a){const K=ln_grassKit(),P=ln_grassLay(x0,x1,y),SK=ln_stemKit();withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform(),un=m.a===1&&m.d===1&&m.b===0&&m.c===0,flat=m.b===0&&m.c===0&&m.a>0&&m.d>0;
  // drawn 1:1 on whole pixels, the sprites need no resampling
  if(un)ctx.imageSmoothingEnabled=false;const X=v=>flat?(Math.round(m.a*v+m.e)-m.e)/m.a:v,Y=v=>flat?(Math.round(m.d*v+m.f)-m.f)/m.d:v;  // on whole device pixels
  // the back depths: slices 16 px wide, each at the lean of the breeze at its middle, neighbouring slices of one lean drawn as one,
  // each a strip seen through a clip whose edges lie on whole device pixels
  [0,1].forEach(li=>{const L=K[li],S=P[li],A=LN_GR[li].A,n=Math.ceil(S.W/16),lv=[];
    for(let k=0;k<n;k++){const xc=S.X0+k*16+8,w=ln_wind(xc,t)+0.05*Math.sin(t*2.3+xc*0.043);lv.push(clamp(Math.round((w*A-L.D0)*2),0,L.NL-1));}
    const ox=X(S.X0),oy=Y(S.top),dv=(u,sy)=>flat?(Math.round(sy?m.d*u+m.f:m.a*u+m.e)-(sy?m.f:m.e))/(sy?m.d:m.a):u;
    for(let k=0;k<n;){let j=k+1;while(j<n&&lv[j]===lv[k])j++;if(k===0&&j===n)ctx.drawImage(S.cs[lv[k]],ox,oy);
      else{const u0=dv(ox+k*16,0),u1=dv(ox+Math.min(S.W,j*16),0),v0=dv(oy,1),v1=dv(oy+S.SH,1);ctx.save();ctx.beginPath();ctx.rect(u0,v0,u1-u0,v1-v0);ctx.clip();ctx.drawImage(S.cs[lv[k]],ox,oy);ctx.restore();}k=j;}});
  // the stems, then the nearest clumps over their feet, each clump with its own flutter
  P.st.forEach(s=>{const w=ln_wind(s.cx,t)+0.08*Math.sin(t*1.9+s.ph)+0.04*Math.sin(t*3.1+s.ph*1.7),l=clamp(Math.round((w*LN_ST.A-SK.D0)*2),0,SK.NL-1),r=SK.sp[s.v*SK.NL+l];
    ctx.drawImage(r.c,X(s.cx-SK.ax+r.ox),Y(y+s.dy-SK.ch+3+r.oy));});
  const L=K[2],G=LN_GR[2];P[2].cl.forEach(k=>{const w=ln_wind(k.cx,t)+0.07*Math.sin(t*2.3+k.ph)+0.035*Math.sin(t*3.7+k.ph*1.7),lv=clamp(Math.round((w*G.A-L.D0)*2),0,L.NL-1),r=L.sp[k.v*L.NL+lv];
    ctx.drawImage(r.c,X(k.cx-L.ax+r.ox),Y(y+k.dy-k.R.ay+r.oy));});});}

/* ---------- an umbrella thorn acacia ---------- */
// in its own units (about 380 wide, 265 tall), its foot at (0,0): a short trunk forks into limbs that rise steeply, fork again, and fan out
// in thin branches under a broad flat crown, with a lower tier on each side and a raised one on top. Monkeys climbing it sit on the limbs at
// (-47,-140), (27,-167), (-20,-200) and (60,-120), so the limbs pass just under those points
const LN_TREE={
  limbs:[[[0,4,-3,-18,3,-36,1,-54],26,17],
    [[-3,-50,-18,-84,-34,-116,-62,-154],12,8],[[-62,-154,-76,-170,-90,-186,-106,-204],8,4.5],[[-100,-198,-116,-200,-132,-202,-156,-209],3.4,1.4],[[-90,-186,-88,-200,-84,-212,-80,-228],3.6,1.6],
    [[-1,-52,-6,-110,-14,-170,-24,-228],10,4],[[-16,-180,-30,-196,-44,-208,-62,-224],3.2,1.3],
    [[2,-52,12,-100,24,-148,40,-226],10,4],[[30,-180,44,-196,58,-208,76,-224],3.2,1.3],[[36,-205,34,-220,31,-236,30,-250],2.4,1.2],
    [[5,-50,22,-76,42,-104,76,-132],11,7],[[76,-132,96,-150,116,-172,140,-194],7,3.2],[[96,-150,100,-170,102,-192,100,-226],3.6,1.6],[[124,-176,140,-182,156,-186,178,-196],2,1],
    [[-128,-202,-140,-202,-152,-204,-168,-210],1.6,0.8]],
  // the crown's tiers, back to front: the far side in shade, a raised tier on top, the broad main mat, and a lower tier each side
  back:{x:22,y:-244,rx:138,ry:14},
  pads:[{x:36,y:-255,rx:80,ry:9,sw:1.15},{x:-4,y:-236,rx:152,ry:17,sw:1},{x:-142,y:-213,rx:50,ry:10,sw:0.8},{x:142,y:-196,rx:52,ry:10,sw:0.75}]};
const LN_LEAF_TREE={dark:[16,20,14],body:[40,47,29],lit:[80,86,52],hi:[150,148,94],rim:[200,186,124],ra:0.55,deep:[6,8,7]};
const LN_LEAF_BACK={dark:[7,10,11],body:[16,22,20],lit:[30,36,30],hi:[62,70,54],rim:[108,112,86],ra:0.32,deep:[3,4,5]};
// a flat mat of fine leaves (an acacia's crown tier) {rx,ry,seed,pal}, sub px right of centre: a gently domed, lobed top of many small
// leaf clusters, a flat underside in deep shade, fine leaflets over it; returns {c,ox,oy}, (ox,oy) where its centre lies
function ln_mat(sp,s,sub){const {rx,ry,pal}=sp,sd=sp.seed,m=Math.ceil(12*s),W=Math.ceil(2*rx*s)+2*m+2,H=Math.ceil(2.4*ry*s)+2*m,ox=m+Math.ceil(rx*s),oy=m+Math.ceil(1.4*ry*s);
  const c=ln_cv(W,H),x=c.getContext("2d"),M=ln_cv(W,H),mx=M.getContext("2d"),T=q=>q.setTransform(s,0,0,s,ox+(sub||0),oy);
  const lob=X=>0.5+0.5*ln_fbm(X*0.028+sd*1.7,sd,3),e=X=>Math.sqrt(Math.max(0,1-(X/rx)*(X/rx))),top=X=>-ry*(0.3+0.7*Math.pow(e(X),0.55))*(0.7+0.55*lob(X)),bot=X=>ry*(0.5+0.08*ln_n1(X*0.06,sd+3))*Math.min(1,e(X)*2.6);
  const P=[],N=Math.round(2.3*rx*ry/3);for(let i=0;i<N;i++){const h=j=>hash(i+sd*1013,sd+j),X=(2*h(1)-1)*rx*0.98,tp=top(X),bt=bot(X),v=Math.pow(h(2),0.8);if(lob(X)<0.3&&v<0.35&&h(6)<0.7)continue;
    const Y=lerp(tp,bt,v),r=(2.2+2.6*h(3))*(0.75+0.35*e(X));P.push({x:X,y:Y+r*0.3,r,v});}
  // the mask: the core, and the clusters round it
  T(mx);mx.fillStyle="#fff";mx.beginPath();for(let X=-rx*0.97;X<=rx*0.97;X+=3)mx.lineTo(X,top(X)*0.55);for(let X=rx*0.97;X>=-rx*0.97;X-=3)mx.lineTo(X,bot(X)-1);mx.closePath();mx.fill();
  mx.beginPath();P.forEach(p=>{mx.moveTo(p.x+p.r,p.y);mx.ellipse(p.x,p.y,p.r,p.r*0.6,0,0,TAU);});mx.fill();
  // shaded as one mass: lit on top, darkening down to a flat underside in deep shade; a little brighter to the left, where the light comes from
  let g=x.createLinearGradient(0,oy-ry*s*1.1,0,oy+ry*0.6*s);g.addColorStop(0,rgba(pal.lit,1));g.addColorStop(0.42,rgba(pal.body,1));g.addColorStop(0.78,rgba(pal.dark,1));g.addColorStop(1,rgba(pal.deep,1));ln_tint(x,M,g,1);
  const L=ln_cv(W,H),lx=L.getContext("2d");T(lx);
  g=lx.createLinearGradient(-rx,0,rx,0);g.addColorStop(0,rgba(pal.hi,0.16));g.addColorStop(0.45,rgba(pal.hi,0));g.addColorStop(1,"rgba(0,0,0,0.22)");lx.fillStyle=g;lx.fillRect(-rx-20,-ry*3,2*rx+40,ry*5);
  // each cluster: a lit crescent on its upper left, a shadow on its lower right; fine leaflets over them
  lx.lineWidth=0.8/s*1.2;P.forEach((p,i)=>{if(p.v>0.75||hash(i,sd+40)>0.55)return;lx.strokeStyle=rgba(pal.hi,0.14+0.2*(1-p.v));lx.beginPath();lx.ellipse(p.x,p.y,p.r*0.9,p.r*0.54,0,Math.PI*1.05,Math.PI*1.7);lx.stroke();
    lx.strokeStyle=rgba(pal.dark,0.35);lx.beginPath();lx.ellipse(p.x,p.y,p.r*0.9,p.r*0.54,0,Math.PI*0.1,Math.PI*0.7);lx.stroke();});
  const nf=Math.round(rx*ry*1.3);for(let i=0;i<nf;i++){const h=j=>hash(i+sd*577,j+70),X=(2*h(0)-1)*rx,tp=top(X),bt=bot(X),v=h(1),Y=lerp(tp,bt,v),l=v-0.35*(X/rx)+(h(2)-0.5)*0.6;
    lx.fillStyle=l<0.2?rgba(pal.hi,0.22+0.3*h(3)):l>0.62?rgba(pal.deep,0.5):rgba(pal.lit,0.28);lx.beginPath();lx.ellipse(X,Y,0.7+0.5*h(4),0.3+0.2*h(4),h(5)*3,0,TAU);lx.fill();}
  lx.setTransform(1,0,0,1,0,0);lx.globalCompositeOperation="destination-in";lx.drawImage(M,0,0);x.drawImage(L,0,0);
  // a few leaflets hanging below the underside, so that its edge is soft
  T(x);for(let i=0;i<rx*0.5;i++){const h=j=>hash(i+sd*331,j+90),X=(2*h(0)-1)*rx*0.9,Y=bot(X)+0.3+1.2*h(1);if(bot(X)<1)continue;x.fillStyle=rgba(pal.dark,0.8);x.beginPath();x.ellipse(X,Y,0.9,0.4,0.3+h(2),0,TAU);x.fill();}
  ln_rim(x,M,-1.2*s,-1.6*s,rgba(pal.deep,1),0.6,0);ln_rim(x,M,1.0*s,1.3*s,rgba(pal.rim,1),pal.ra,2.5*s);
  return{c,ox,oy};}
function ln_treeKit(s){const key="tr"+s;let K=LN_C.get(key);if(K)return K;
  const m=24,X0=Math.floor(-196*s-m),Y0=Math.floor(-270*s-m),W=Math.ceil(392*s+2*m),H=Math.ceil(282*s+2*m),c=ln_cv(W,H),x=c.getContext("2d"),T=q=>q.setTransform(s,0,0,s,-X0,-Y0);
  // its shadow on the ground
  T(x);x.save();x.translate(10,1);x.scale(1,0.06);let g=x.createRadialGradient(0,0,0,0,0,160);g.addColorStop(0,"rgba(0,0,0,0.5)");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.beginPath();x.arc(0,0,160,0,TAU);x.fill();x.restore();
  // the crown's far side, in shade
  const b=LN_TREE.back,BL=ln_mat(Object.assign({seed:80,pal:LN_LEAF_BACK},b),s,0);x.setTransform(1,0,0,1,0,0);x.drawImage(BL.c,Math.round(-X0+b.x*s-BL.ox),Math.round(-Y0+b.y*s-BL.oy));
  // trunk and limbs: dark grey-brown bark, fissured, lit from the upper left
  const M=ln_cv(W,H),mx=M.getContext("2d");T(mx);mx.fillStyle="#fff";mx.beginPath();LN_TREE.limbs.forEach(l=>ln_tube(mx,l[0],l[1],l[2]));
  mx.moveTo(-21,4);mx.quadraticCurveTo(-12,0,-11,-16);mx.lineTo(11,-16);mx.quadraticCurveTo(12,0,23,4);mx.closePath();mx.fill();
  g=x.createLinearGradient(-X0-150*s,-Y0-250*s,-X0+150*s,-Y0);g.addColorStop(0,"rgb(66,58,50)");g.addColorStop(1,"rgb(34,30,28)");ln_tint(x,M,g,1);
  const F=ln_cv(W,H),fx=F.getContext("2d");T(fx);fx.lineCap="round";
  LN_TREE.limbs.forEach((l,li)=>{if(l[1]<4)return;[-0.3,-0.05,0.22,0.4].forEach((o,j)=>{fx.beginPath();let on=false;for(let i=0;i<=30;i++){const u=i/30,q=ln_bz(l[0],u),q2=ln_bz(l[0],Math.min(1,u+0.03)),tx=q2[0]-q[0],ty=q2[1]-q[1],tl=Math.hypot(tx,ty)||1,w=lerp(l[1],l[2],u),px=q[0]-ty/tl*o*w,py=q[1]+tx/tl*o*w,vis=ln_n1(u*9+j*3,li*5+j)>-0.2;
      if(vis&&on)fx.lineTo(px,py);else if(vis)fx.moveTo(px,py);on=vis;}fx.strokeStyle=j===3?"rgba(130,118,100,0.42)":"rgba(14,11,10,0.75)";fx.lineWidth=j===3?0.6:0.8;fx.stroke();});});
  const Fr=F.getContext("2d");Fr.globalCompositeOperation="destination-in";Fr.setTransform(1,0,0,1,0,0);Fr.drawImage(M,0,0);x.save();x.setTransform(1,0,0,1,0,0);x.drawImage(F,0,0);x.restore();
  ln_rim(x,M,-1.6*s,-1.2*s,"rgb(8,6,5)",0.6,0);ln_rim(x,M,1.1*s,1.2*s,"rgb(210,180,136)",0.55,2.5*s);
  // pale thorns in pairs on the thin branches
  T(x);x.strokeStyle="rgba(232,224,204,0.5)";x.lineWidth=0.45;LN_TREE.limbs.forEach((l,li)=>{if(l[2]>1.7)return;for(let k=1;k<4;k++){const q=ln_bz(l[0],k/4.4);x.beginPath();x.moveTo(q[0],q[1]);x.lineTo(q[0]-2.2,q[1]-1.9);x.moveTo(q[0],q[1]);x.lineTo(q[0]+1.9,q[1]-2.3);x.stroke();}});
  const pads=LN_TREE.pads.map((p,j)=>{const key="tp"+s+"_"+j;let F=LN_C.get(key);if(!F){const V=[0,1,2,3].map(k=>ln_mat(Object.assign({seed:20+j*3,pal:LN_LEAF_TREE},p),s,k/4));F={V:V.map(v=>v.c),ox:V[0].ox,oy:V[0].oy};LN_C.set(key,F);}
    return{V:F.V,ox:F.ox,oy:F.oy,x:p.x*s,y:p.y*s,h:-p.y/250*p.sw,ph:hash(j,5)*TAU};});
  K={c,X0,Y0,pads};LN_C.set(key,K);return K;}
// an umbrella thorn acacia, its foot at (x,y), s its size; with t, its crown sways in the breeze (its tiers each a little differently), its trunk and limbs hold still
function tree(ctx,x,y,s,a,t){t=t||0;const K=ln_treeKit(s);withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform();ln_put(ctx,[K.c],x+K.X0,y+K.Y0,m);const w=ln_wind(x,t)-0.7;
  K.pads.forEach(p=>{const dx=s*p.h*(3.2*w+0.9*Math.sin(t*1.1+p.ph)+0.45*Math.sin(t*2.1+p.ph*2));ln_put(ctx,p.V,x+p.x-p.ox+dx,y+p.y-p.oy,m);});});}

/* ---------- a bush ---------- */
// its clusters of leaves, back to front: the upper ones behind, then the low ones in front (f), which can also be drawn alone, over whatever hides in the bush
const LN_BUSH={clumps:[{x:-58,y:-26,rx:28,ry:20,clumps:3},{x:52,y:-40,rx:30,ry:22,clumps:3},{x:-24,y:-44,rx:32,ry:24,clumps:3},{x:14,y:-52,rx:34,ry:24,clumps:3},
    {x:-80,y:-12,rx:15,ry:12,clumps:2,f:1},{x:84,y:-22,rx:19,ry:16,clumps:2,f:1},{x:30,y:-18,rx:38,ry:16,clumps:3,f:1},{x:-30,y:-13,rx:34,ry:14,clumps:3,f:1}],
  twigs:[[[-8,-50,-10,-62,-13,-74,-18,-86],2,0.8],[[38,-52,42,-62,47,-72,55,-82],1.8,0.8],[[-66,-36,-72,-44,-78,-50,-86,-58],1.8,0.8],[[88,-28,94,-32,99,-36,106,-42],1.6,0.7],
    [[-4,0,-6,-12,-4,-22,-8,-34],3.2,1.6],[[12,0,14,-10,18,-20,16,-30],3,1.4],[[-36,0,-38,-8,-42,-14,-46,-22],2.6,1.2]]};
const LN_LEAF_BUSH={dark:[11,17,12],body:[32,45,28],lit:[66,84,48],hi:[136,152,90],rim:[180,196,118],ra:0.55,deep:[4,7,5]};
function ln_bushKit(s){const key="bu"+s;let K=LN_C.get(key);if(K)return K;
  const m=20,X0=Math.floor(-112*s-m),Y0=Math.floor(-96*s-m),W=Math.ceil(226*s+2*m),H=Math.ceil(104*s+2*m),c=ln_cv(W,H),x=c.getContext("2d"),T=q=>q.setTransform(s,0,0,s,-X0,-Y0);
  T(x);x.save();x.translate(4,0);x.scale(1,0.08);let g=x.createRadialGradient(0,0,0,0,0,110);g.addColorStop(0,"rgba(0,0,0,0.5)");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.beginPath();x.arc(0,0,110,0,TAU);x.fill();x.restore();
  const L=ln_leaves({x:0,y:-32,rx:86,ry:30,clumps:5,seed:61,r:6,pal:LN_LEAF_BACK,leaf:1.6},s,0);x.setTransform(1,0,0,1,0,0);x.drawImage(L.c,Math.round(-X0-L.ox),Math.round(-Y0-32*s-L.oy));
  // stems and bare twigs
  T(x);x.fillStyle="rgb(40,32,26)";x.beginPath();LN_BUSH.twigs.forEach(l=>ln_tube(x,l[0],l[1],l[2],10));x.fill();
  LN_BUSH.twigs.slice(0,4).forEach((l,i)=>{for(let k=0;k<5;k++){const q=ln_bz(l[0],0.5+k*0.12),a=(k%2?1:-1)*1.0-1.45+(hash(k,i)-0.5)*0.5;x.fillStyle=k%2?"rgb(24,38,24)":"rgb(40,58,34)";x.beginPath();x.ellipse(q[0]+Math.cos(a)*2.4,q[1]+Math.sin(a)*2.4,2.4,1.05,a,0,TAU);x.fill();
    x.strokeStyle="rgba(150,190,110,0.45)";x.lineWidth=0.4;x.beginPath();x.ellipse(q[0]+Math.cos(a)*2.4,q[1]+Math.sin(a)*2.4,2.4,1.05,a,Math.PI*1.1,Math.PI*1.9);x.stroke();}});
  const sd=[5,15,20,25,0,10,30,35],clumps=LN_BUSH.clumps.map((p,j)=>{const F=ln_cluster("bc"+s+"_"+j,Object.assign({seed:40+sd[j],r:5.2,pal:LN_LEAF_BUSH,leaf:1.5,sq:0.85},p),s);return{V:F.V,ox:F.ox,oy:F.oy,x:p.x*s,y:p.y*s,h:0.4-p.y/80,ph:hash(j,9)*TAU,f:p.f};});
  K={c,X0,Y0,clumps};LN_C.set(key,K);return K;}
// a bush: an uneven mound of leaf clusters with a few bare twigs, its foot at (x,y); with t, its leaves stir in the breeze.
// o.front: only its low front clusters, to draw over animals that dive into it
function bush(ctx,x,y,s,a,t,o){t=t||0;const K=ln_bushKit(s),fr=o&&o.front;withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform();if(!fr)ln_put(ctx,[K.c],x+K.X0,y+K.Y0,m);const w=ln_wind(x,t)-0.7;
  K.clumps.forEach(p=>{if(fr&&!p.f)return;const dx=s*p.h*(1.3*w+0.6*Math.sin(t*1.7+p.ph)+0.28*Math.sin(t*3.1+p.ph*1.3));ln_put(ctx,p.V,x+p.x-p.ox+dx,y+p.y-p.oy,m);});});}

/* ---------- a branch for a bird ---------- */
// relative to the foothold (0,0) and the length w: a limb running in from the upper right, a thinning end with a tip, twigs with leaves, a knot, a stub
function ln_perchGeo(w){const S1=[3.0*w,-0.66*w,2.0*w,-0.5*w,0.75*w,-0.06*w,0,0.025*w],S2=[0,0.025*w,-0.18*w,0.035*w,-0.34*w,0.02*w,-0.47*w,-0.04*w],
    at=(p,u)=>ln_bz(p,u),b1=at(S1,0.42),b2=at(S1,0.2),b3=at(S1,0.8),tip=at(S2,1);
  return{limbs:[[S1,0.1*w,0.047*w],[S2,0.047*w,0.01*w],[[b1[0],b1[1],b1[0]+0.05*w,b1[1]-0.1*w,b1[0]+0.12*w,b1[1]-0.18*w,b1[0]+0.2*w,b1[1]-0.25*w],0.022*w,0.005*w],
      [[b2[0],b2[1],b2[0]+0.08*w,b2[1]+0.05*w,b2[0]+0.15*w,b2[1]+0.12*w,b2[0]+0.2*w,b2[1]+0.22*w],0.02*w,0.005*w],
      [[b3[0],b3[1]-0.01*w,b3[0]-0.01*w,b3[1]-0.03*w,b3[0]-0.02*w,b3[1]-0.045*w,b3[0]-0.03*w,b3[1]-0.06*w],0.022*w,0.017*w]],
    stub:[b3[0]-0.03*w,b3[1]-0.06*w],knot:at(S1,0.56),
    leaves:[[b1[0]+0.2*w,b1[1]-0.25*w,-0.6,1],[b1[0]+0.2*w,b1[1]-0.25*w,0.5,0.9],[b1[0]+0.12*w,b1[1]-0.18*w,-1.9,0.85],[b1[0]+0.06*w,b1[1]-0.11*w,0.2,0.8],
      [b2[0]+0.2*w,b2[1]+0.22*w,1.9,1],[b2[0]+0.2*w,b2[1]+0.22*w,0.9,0.9],[b2[0]+0.15*w,b2[1]+0.12*w,0.4,0.85],[b2[0]+0.1*w,b2[1]+0.07*w,2.3,0.8],
      [tip[0],tip[1],-2.9,0.8],[tip[0]+0.03*w,tip[1]+0.01*w,2.6,0.7]]};}
const LN_BARK={body:[[70,54,42],[40,31,25]],rim:[214,172,124],dark:[16,12,10]};
function ln_leafSprite(L,Wd){const key="lf"+L+"_"+Wd;let F=LN_C.get(key);if(F)return F;const c=ln_cv(L+10,Wd*2+10),x=c.getContext("2d"),o=[4,Wd+5];x.translate(o[0],o[1]);
  const shape=()=>{x.beginPath();x.moveTo(3,0);x.bezierCurveTo(3+L*0.22,-Wd*0.95,3+L*0.72,-Wd*0.72,L+3,0);x.bezierCurveTo(3+L*0.72,Wd*0.6,3+L*0.22,Wd*0.9,3,0);x.closePath();};
  x.strokeStyle="rgb(46,56,36)";x.lineWidth=1;x.beginPath();x.moveTo(0,0);x.lineTo(4,0);x.stroke();
  shape();let g=x.createLinearGradient(0,-Wd,0,Wd);g.addColorStop(0,"rgb(64,88,52)");g.addColorStop(1,"rgb(22,34,24)");x.fillStyle=g;x.fill();
  x.strokeStyle="rgba(150,184,112,0.55)";x.lineWidth=0.7;x.beginPath();x.moveTo(3,0);x.quadraticCurveTo(L*0.5,-0.6,L+2,0);for(let k=1;k<5;k++){const u=3+L*k/5.4;x.moveTo(u,0);x.quadraticCurveTo(u+L*0.08,-Wd*0.3,u+L*0.16,-Wd*0.55);x.moveTo(u,0);x.quadraticCurveTo(u+L*0.08,Wd*0.25,u+L*0.15,Wd*0.48);}x.stroke();
  x.save();shape();x.clip();x.strokeStyle="rgba(176,214,128,0.75)";x.lineWidth=1.4;x.beginPath();x.moveTo(3,0);x.bezierCurveTo(3+L*0.22,-Wd*0.95,3+L*0.72,-Wd*0.72,L+3,0);x.stroke();x.restore();
  F={c,o};LN_C.set(key,F);return F;}
function ln_perchKit(w){const key="pc"+w;let K=LN_C.get(key);if(K)return K;const G=ln_perchGeo(w),m=16,X0=Math.floor(-0.62*w-m),Y0=Math.floor(-0.95*w-m);
  const c=ln_cv(3.2*w-X0+m,0.35*w-Y0+m),x=c.getContext("2d"),T=q=>q.setTransform(1,0,0,1,-X0,-Y0);
  const M=ln_cv(c.width,c.height),mx=M.getContext("2d");T(mx);mx.fillStyle="#fff";mx.beginPath();G.limbs.forEach(l=>ln_tube(mx,l[0],l[1],l[2],30));mx.fill();
  T(x);let g=x.createLinearGradient(0,-0.7*w,0,0.1*w);g.addColorStop(0,rgba(LN_BARK.body[0],1));g.addColorStop(1,rgba(LN_BARK.body[1],1));ln_tint(x,M,g,1);
  // bark: fine fissures along the limb, lenticels across it
  const F=ln_cv(c.width,c.height),fx=F.getContext("2d");T(fx);fx.lineCap="round";
  G.limbs.slice(0,2).forEach((l,li)=>{for(let j=0;j<7;j++){const o=-0.42+j*0.14;fx.beginPath();let on=false;for(let i=0;i<=80;i++){const u=i/80,q=ln_bz(l[0],u),q2=ln_bz(l[0],Math.min(1,u+0.01)),tx=q2[0]-q[0],ty=q2[1]-q[1],tl=Math.hypot(tx,ty)||1,wd=lerp(l[1],l[2],Math.pow(u,0.85)),px=q[0]-ty/tl*o*wd,py=q[1]+tx/tl*o*wd,vis=ln_n1(u*26+j*5,li*9+j)>0.05;
      if(vis&&on)fx.lineTo(px,py);else if(vis)fx.moveTo(px,py);on=vis;}fx.strokeStyle=o<0?"rgba(150,124,96,0.35)":"rgba(18,13,10,0.6)";fx.lineWidth=0.7;fx.stroke();}
    // lenticels: short lens-shaped pores across the limb, in loose clusters, of varied length, fading on the shaded underside
    for(let i=0;i<23;i++){const cu=hash(Math.floor(i/4),li+72),u=clamp(cu+(hash(i,li+70)-0.5)*0.09,0.02,0.98),q=ln_bz(l[0],u),q2=ln_bz(l[0],Math.min(1,u+0.01)),tx=q2[0]-q[0],ty=q2[1]-q[1],tl=Math.hypot(tx,ty)||1,wd=lerp(l[1],l[2],Math.pow(u,0.85)),
        ov=(hash(i,li+71)-0.5)*0.72,o=ov*wd,px=q[0]-ty/tl*o,py=q[1]+tx/tl*o,ll=(0.05+0.1*hash(i,li+73))*wd,lit=ov<0?1:0.35,an=Math.atan2(ty,tx)+Math.PI/2;
      fx.fillStyle="rgba(186,160,122,"+(0.25+0.3*hash(i,li+74))*lit+")";fx.beginPath();fx.ellipse(px,py,ll,Math.max(0.45,ll*0.22),an,0,TAU);fx.fill();
      fx.fillStyle="rgba(20,14,10,"+0.35*lit+")";fx.beginPath();fx.ellipse(px+tx/tl*0.6,py+ty/tl*0.6,ll*0.8,0.35,an,0,TAU);fx.fill();}});
  // a knot, with rings of grain round it, and the cut end of a broken twig
  const [kx,ky]=G.knot;fx.save();fx.translate(kx,ky+0.004*w);fx.rotate(-0.33);fx.fillStyle="rgba(22,15,11,0.85)";fx.beginPath();fx.ellipse(0,0,0.034*w,0.02*w,0,0,TAU);fx.fill();
  fx.strokeStyle="rgba(150,120,90,0.5)";fx.lineWidth=0.8;for(let k=1;k<4;k++){fx.beginPath();fx.ellipse(0.002*w,0.002*w,0.034*w+k*2.6,0.02*w+k*1.7,0,Math.PI*1.05,Math.PI*1.95);fx.stroke();}
  fx.strokeStyle="rgba(10,7,5,0.6)";for(let k=1;k<3;k++){fx.beginPath();fx.ellipse(0,0,0.034*w+k*2.6,0.02*w+k*1.7,0,0.05*Math.PI,0.95*Math.PI);fx.stroke();}fx.restore();
  fx.setTransform(1,0,0,1,0,0);fx.globalCompositeOperation="destination-in";fx.drawImage(M,0,0);x.save();x.setTransform(1,0,0,1,0,0);x.drawImage(F,0,0);x.restore();
  ln_rim(x,M,-1.6,-2.2,rgba(LN_BARK.dark,1),0.7,0);ln_rim(x,M,1.1,1.6,rgba(LN_BARK.rim,1),0.7,4);
  T(x);const [sx,sy]=G.stub;x.fillStyle="rgb(150,120,86)";x.beginPath();x.ellipse(sx,sy,0.008*w,0.005*w,-0.5,0,TAU);x.fill();
  K={c,X0,Y0,G};LN_C.set(key,K);return K;}
// a branch for a bird to sit on: the bird's foothold at x, its top at y; w sets its size; it runs in from the upper right and thins to a tip at the left
function perch(ctx,x,y,w,t,a){t=t||0;const K=ln_perchKit(Math.round(w));withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform(),y0=y-0.0015*w;ln_put(ctx,[K.c],x+K.X0,y0+K.Y0,m);
  const L=ln_leafSprite(Math.round(0.085*w),Math.round(0.03*w));K.G.leaves.forEach(([lx,ly,an,k],i)=>{const f=0.06*Math.sin(t*1.9+i*1.7)+0.04*Math.sin(t*3.3+i*2.9)+0.05*(ln_wind(x+lx,t)-0.7);
    ctx.save();ctx.translate(x+lx,y0+ly);ctx.rotate(an+f);ctx.scale(k,k);ctx.drawImage(L.c,-L.o[0],-L.o[1]);ctx.restore();});});}

/* ---------- layers of rock ---------- */
// the tops of the layers, from the ground down: soil, a cross-bedded sandstone, a dark shale (it pinches out to the left and swells into a lens
// where a fern lies in it), a pale limestone with shells, a conglomerate whose base cuts channels into the red mudstone under it, a dark siltstone.
// Each contact has its own lie and its own roughness, so the layers thicken and thin
function ln_bedY(k,X){const F=(f,s,o)=>ln_fbm(X*f,s,o||2);
  if(k===0)return 300+4*Math.sin(X*0.004+0.7)+2*F(0.02,2);
  if(k===1)return 344+6*Math.sin(X*0.0031+2.0)+3.5*F(0.021,5,3);
  if(k===2)return Math.max(ln_bedY(1,X)+30,402+22*Math.sin(X*0.0019+1.1)+8*F(0.006,7,3)+3*F(0.022,8));
  if(k===3)return ln_bedY(2,X)+Math.max(0,(34+6*F(0.01,9))*sstep(40,420,X)+52*Math.exp(-((X-1510)/190)*((X-1510)/190))+2*F(0.03,16));
  if(k===4)return 684+12*Math.sin(X*0.0024+0.3)+6*F(0.007,10,3)+3*F(0.02,11);
  if(k===5)return ln_bedY(4,X)+40+8*F(0.01,12)+64*Math.exp(-((X-520)/150)*((X-520)/150))+38*Math.exp(-((X-1680)/110)*((X-1680)/110))+4*F(0.025,13);
  if(k===6)return 922+14*Math.sin(X*0.0028+2.2)+6*F(0.008,14,3)+3*F(0.02,15);
  return 1090;}
// kept clear, for the question the scene asks there
const LN_QZ=(x,y)=>Math.abs(x-1000)<190&&Math.abs(y-560)<110,LN_QF=(x,y)=>sstep(1.25,0.85,Math.hypot((x-1000)/230,(y-560)/140));  // LN_QF: 1 in the middle of it, fading to 0 round it
// an ammonite, embossed in the rock and lit from the upper left: a coil that grows W times a whorl, turns whorls showing, its ribs splitting in two
// on the outer whorl if fork
function ln_ammonite(c,cx,cy,R,rot,o){o=o||{};const W=o.W||1.7,b=Math.log(W)/TAU,TH=(o.turns||5)*TAU,r=th=>R*Math.exp(b*(th-TH)),P=(th,rr)=>[cx+Math.cos(th+rot)*rr,cy+Math.sin(th+rot)*rr],nr=o.ribs||44;
  const outline=(dx,dy)=>{c.beginPath();for(let th=TH-TAU;th<=TH+0.001;th+=0.04){const p=P(th,r(th));c.lineTo(p[0]+dx,p[1]+dy);}const e=P(TH-TAU,r(TH-TAU));c.lineTo(e[0]+dx,e[1]+dy);c.closePath();};
  c.save();c.fillStyle="rgba(10,6,4,0.55)";outline(2.2,2.6);c.fill();
  outline(0,0);const g=c.createRadialGradient(cx-R*0.4,cy-R*0.45,R*0.1,cx,cy,R*1.1);g.addColorStop(0,"rgb(234,220,190)");g.addColorStop(0.6,"rgb(194,176,144)");g.addColorStop(1,"rgb(126,108,84)");c.fillStyle=g;c.fill();c.clip();
  c.lineCap="round";
  // ribs across each whorl, leaning a little forward; on the outer whorl each splits in two two-thirds of the way out
  for(let i=0;;i++){const th=TH-i*TAU/nr+0.03*Math.sin(i*1.7),ro=r(th),ri=r(th-TAU),hw=ro-ri;if(hw<1.6||th<0.5)break;const lw=Math.max(0.45,hw*0.075),fk=o.fork&&th>TH-TAU*1.05,st=TAU/nr;
    const seg=(u0,u1,a0,a1)=>{const pts=[];for(let j=0;j<=5;j++){const u=lerp(u0,u1,j/5),rr=lerp(ri+0.5,ro-0.3,u);pts.push(P(th+lerp(a0,a1,j/5)+0.05*u*u,rr));}return pts;};
    const L=fk?[seg(0,0.58,0,0),seg(0.58,1,0,-st*0.3),seg(0.58,1,0,st*0.3)]:[seg(0,1,0,0)];
    L.forEach(pts=>{c.strokeStyle="rgba(78,60,42,0.62)";c.lineWidth=lw*1.3;c.beginPath();pts.forEach((p,j)=>j?c.lineTo(p[0]+lw*0.6,p[1]+lw*0.7):c.moveTo(p[0]+lw*0.6,p[1]+lw*0.7));c.stroke();
      c.strokeStyle="rgba(252,242,218,0.6)";c.lineWidth=lw;c.beginPath();pts.forEach((p,j)=>j?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();});}
  // the seams between the whorls, each a groove with a lit lip
  for(let w=1;w<8;w++){if(r(TH-TAU*w)<1.5)break;c.beginPath();for(let th=TH-TAU*w;th>0.3;th-=0.05){const p=P(th,r(th));c.lineTo(p[0],p[1]);}c.strokeStyle="rgba(66,50,36,0.75)";c.lineWidth=Math.max(0.8,1.4-w*0.12);c.stroke();
    c.beginPath();for(let th=TH-TAU*w;th>0.3;th-=0.05){const p=P(th,r(th)+0.9);c.lineTo(p[0]-0.5,p[1]-0.6);}c.strokeStyle="rgba(250,238,210,0.45)";c.lineWidth=0.7;c.stroke();}
  // the tiny first whorls, and the mouth of the shell
  const p0=P(0.3,r(0.3));c.fillStyle="rgba(70,54,38,0.7)";c.beginPath();c.arc(p0[0],p0[1],Math.max(0.8,r(0.3)*0.9),0,TAU);c.fill();
  c.restore();c.lineWidth=1.2;const g2=c.createLinearGradient(cx-R,cy-R,cx+R,cy+R);g2.addColorStop(0,"rgba(255,246,222,0.7)");g2.addColorStop(1,"rgba(40,28,18,0.7)");c.strokeStyle=g2;outline(0,0);c.stroke();}
// a thigh bone, seen from the front, in the rock: a ball of a head on a neck set at an angle to the shaft, the great trochanter squared off beside it,
// the lesser one a knob below; a shaft thickening toward its ends; two unequal condyles at the knee with a shallow notch between them.
// Its shapes are merged, blurred and shaded as one relief, so that they flow into each other as bone does
function ln_bone(c,cx,cy,k,rot){const PW=Math.ceil(330*k),PH=Math.ceil(190*k),M=ln_cv(PW,PH),mx=M.getContext("2d");mx.setTransform(1,0,0,1,PW/2,PH/2);mx.rotate(rot);mx.scale(k,k);mx.fillStyle="#fff";
  mx.beginPath();ln_tube(mx,[-92,-3,-60,0,-30,2,4,2],30,25);ln_tube(mx,[4,2,40,3,70,2,100,0],25,33);ln_tube(mx,[-90,-3,-97,-11,-105,-20,-113,-28],21,18);mx.fill();
  mx.beginPath();mx.arc(-117,-32,15.5,0,TAU);mx.fill();                                    // the head
  mx.beginPath();mx.ellipse(-104,8,18,13,-0.15,0,TAU);mx.fill();rr(mx,-123,-5,32,24,7);mx.fill();  // the great trochanter
  mx.beginPath();mx.ellipse(-71,-15,8,5,-0.6,0,TAU);mx.fill();                              // the lesser trochanter
  rr(mx,82,-25,36,48,9);mx.fill();mx.beginPath();mx.ellipse(112,-12,11,12.5,0.1,0,TAU);mx.fill();mx.beginPath();mx.ellipse(109,12,10,10.5,-0.1,0,TAU);mx.fill();  // the knee: epicondyles and two unequal condyles
  mx.beginPath();mx.ellipse(96,-23,9,6,0.3,0,TAU);mx.fill();mx.beginPath();mx.ellipse(96,21,8,5.5,-0.3,0,TAU);mx.fill();
  mx.globalCompositeOperation="destination-out";mx.beginPath();mx.ellipse(122,1,4.5,3.5,0,0,TAU);mx.fill();
  const D=mx.getImageData(0,0,PW,PH).data,A=new Float32Array(PW*PH);for(let i=0;i<PW*PH;i++)A[i]=D[i*4+3]/255;
  const B=ln_blur(A,PW,PH,Math.max(1,Math.round(3*k))),Ms=new Float32Array(PW*PH);for(let i=0;i<PW*PH;i++)Ms[i]=sstep(0.38,0.62,B[i]);
  const B2=ln_blur(Ms,PW,PH,Math.max(1,Math.round(6*k))),Hh=new Float32Array(PW*PH);for(let i=0;i<PW*PH;i++)Hh[i]=11*Math.sqrt(B2[i])*Ms[i];
  const S=ln_shade(Hh,PW,PH),O=ln_cv(PW,PH),ox=O.getContext("2d"),I=ox.createImageData(PW,PH);
  for(let j=0;j<PH;j++)for(let i=0;i<PW;i++){const q=j*PW+i,m=Ms[q];if(m<=0)continue;const n=ln_n2(i*0.05,j*0.05,33),sh=clamp(0.36+0.78*S[q],0.25,1.22),o=q*4;
    I.data[o]=Math.min(255,(192+10*n)*sh);I.data[o+1]=Math.min(255,(172+8*n)*sh);I.data[o+2]=Math.min(255,(138+4*n)*sh);I.data[o+3]=Math.round(255*m);}
  ox.putImageData(I,0,0);
  // grain along the shaft, a crack across it, and a few pits
  ox.globalCompositeOperation="source-atop";ox.setTransform(1,0,0,1,PW/2,PH/2);ox.rotate(rot);ox.scale(k,k);ox.lineCap="round";
  for(let i=0;i<9;i++){const yy=-8+i*2+hash(i,41)-0.5;ox.strokeStyle=i%2?"rgba(110,90,66,0.22)":"rgba(255,246,224,0.12)";ox.lineWidth=0.7;ox.beginPath();ox.moveTo(-70+hash(i,42)*20,yy);ox.bezierCurveTo(-20,yy+1,30,yy+1,80-hash(i,43)*20,yy*1.2);ox.stroke();}
  ox.strokeStyle="rgba(46,32,22,0.85)";ox.lineWidth=1.3;ox.beginPath();ox.moveTo(24,-12);ox.lineTo(27,-6);ox.lineTo(23,-1);ox.lineTo(28,4);ox.lineTo(25,9);ox.lineTo(27,14);ox.stroke();
  ox.strokeStyle="rgba(255,244,220,0.45)";ox.lineWidth=0.6;ox.beginPath();ox.moveTo(25.6,-12);ox.lineTo(28.6,-6);ox.lineTo(24.6,-1);ox.lineTo(29.6,4);ox.lineTo(26.6,9);ox.stroke();
  for(let i=0;i<14;i++){ox.fillStyle="rgba(80,60,42,0.35)";ox.beginPath();ox.arc(-110+hash(i,44)*225,-10+hash(i,45)*20,0.5+0.7*hash(i,46),0,TAU);ox.fill();}
  // its shadow in its bed, then the bone
  const Sd=ln_cv(PW,PH),sx=Sd.getContext("2d");sx.drawImage(O,0,0);sx.globalCompositeOperation="source-in";sx.fillStyle="rgba(10,6,4,0.55)";sx.fillRect(0,0,PW,PH);
  c.drawImage(Sd,Math.round(cx-PW/2+2.5),Math.round(cy-PH/2+3));c.drawImage(O,Math.round(cx-PW/2),Math.round(cy-PH/2));}
// a scallop: a fan of ribs from its beak, growth lines across them, and at the hinge two low flat ears, the front one the larger
function ln_shell(c,cx,cy,R,rot){c.save();c.translate(cx,cy);c.rotate(rot);const hy=-0.74*R,sh=(dx,dy)=>{c.beginPath();c.moveTo(dx-0.54*R,dy+hy);c.lineTo(dx+0.42*R,dy+hy);
    c.quadraticCurveTo(dx+0.43*R,dy+hy+0.12*R,dx+0.36*R,dy+hy+0.2*R);c.bezierCurveTo(dx+0.86*R,dy-0.2*R,dx+0.84*R,dy+0.5*R,dx,dy+0.62*R);c.bezierCurveTo(dx-0.84*R,dy+0.5*R,dx-0.9*R,dy-0.2*R,dx-0.36*R,dy+hy+0.22*R);
    c.quadraticCurveTo(dx-0.46*R,dy+hy+0.2*R,dx-0.5*R,dy+hy+0.25*R);c.quadraticCurveTo(dx-0.56*R,dy+hy+0.1*R,dx-0.54*R,dy+hy);c.closePath();};
  c.fillStyle="rgba(10,6,4,0.5)";sh(1.8,2.2);c.fill();sh(0,0);const g=c.createLinearGradient(-R,-R,R,R);g.addColorStop(0,"rgb(228,214,184)");g.addColorStop(1,"rgb(140,120,92)");c.fillStyle=g;c.fill();c.save();c.clip();
  // the ribs of the disc
  for(let i=-8;i<=8;i++){const a=Math.PI/2+i*0.15,ex=Math.cos(a)*R*1.5,ey=hy+Math.sin(a)*R*1.5;c.strokeStyle="rgba(90,70,50,0.55)";c.lineWidth=1;c.beginPath();c.moveTo(0.6,hy+0.6);c.lineTo(ex+0.6,ey+0.6);c.stroke();
    c.strokeStyle="rgba(255,246,222,0.5)";c.lineWidth=0.7;c.beginPath();c.moveTo(0,hy);c.lineTo(ex,ey);c.stroke();}
  // growth lines round the beak, and fine lines along the ears
  for(let k=1;k<5;k++){c.strokeStyle="rgba(90,70,50,0.3)";c.lineWidth=0.7;c.beginPath();c.ellipse(0,hy,R*0.28*k,R*0.33*k,0,0.12*Math.PI,0.88*Math.PI);c.stroke();}
  c.strokeStyle="rgba(90,70,50,0.35)";c.lineWidth=0.6;for(let k=1;k<3;k++){const yy=hy+k*0.07*R;c.beginPath();c.moveTo(-0.5*R,yy);c.lineTo(-0.12*R,yy+0.02*R);c.moveTo(0.1*R,yy+0.02*R);c.lineTo(0.38*R,yy);c.stroke();}
  c.restore();c.strokeStyle="rgba(255,246,222,0.35)";c.lineWidth=0.8;sh(0,0);c.stroke();c.restore();}
// a fern frond (Pecopteris) pressed flat in the shale: a thin film, pale on the dark rock; a rachis tapering to a curled tip, with narrow pinnae
// on both sides, each a row of small rounded pinnules
function ln_fern(c,x0,y0,x1,y1,bend){const p=[x0,y0,lerp(x0,x1,0.33),lerp(y0,y1,0.33)-bend,lerp(x0,x1,0.7),lerp(y0,y1,0.7)-bend*0.8,x1,y1];c.save();c.lineCap="round";c.lineJoin="round";
  const tan=u=>{const a=ln_bz(p,Math.max(0,u-0.01)),b=ln_bz(p,Math.min(1,u+0.01));return Math.atan2(b[1]-a[1],b[0]-a[0]);},n=38,film="rgba(172,174,162,0.72)",lit="rgba(236,236,222,0.3)",vein="rgba(34,34,32,0.6)";
  for(let i=1;i<n;i++){const u=i/n,q=ln_bz(p,u),sd=i%2?1:-1,Lp=(3+21*Math.pow(1-u,0.8))*(u<0.1?0.82+u*1.8:1)*(0.94+0.12*hash(i,78)),a=tan(u)+sd*(1.02+0.08*hash(i,79)),pw=Math.min(4.3,1.6+Lp*0.16),sp=2.9;
    c.save();c.translate(q[0],q[1]);c.rotate(a);
    // the pinna: a strip whose edges swell into rounded pinnules, those of one side between those of the other
    const hw=(X,ph)=>pw*(1-0.45*X/Lp)*(0.62+0.38*Math.abs(Math.sin(Math.PI*(X+ph)/sp)));c.beginPath();c.moveTo(0,-pw*0.5);
    for(let X=0;X<=Lp;X+=0.5)c.lineTo(X,-hw(X,0));c.arc(Lp,0,hw(Lp,0)*0.9,-Math.PI/2,Math.PI/2);for(let X=Lp;X>=0;X-=0.5)c.lineTo(X,hw(X,sp/2));c.closePath();c.fillStyle=film;c.fill();
    c.strokeStyle=lit;c.lineWidth=0.5;c.beginPath();for(let X=0.5;X<=Lp;X+=0.5)c.lineTo(X,-hw(X,0)+0.3);c.stroke();
    c.strokeStyle=vein;c.lineWidth=0.45;c.beginPath();c.moveTo(0.5,0);c.lineTo(Lp,0);for(let X=sp*0.5;X<Lp-1;X+=sp){c.moveTo(X,0);c.lineTo(X+1.2,-pw*0.6);c.moveTo(X+sp/2,0);c.lineTo(X+sp/2+1.2,pw*0.6);}c.stroke();c.restore();}
  // the rachis, thinning to a crozier at its tip
  for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,a=ln_bz(p,u0),b=ln_bz(p,u1);c.strokeStyle=film;c.lineWidth=Math.max(0.7,3.2*(1-u0));c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  const e=ln_bz(p,1),ta=tan(1);c.lineWidth=0.8;c.beginPath();for(let j=0;j<=12;j++){const an=ta+j*0.45,rr=4.5*(1-j/16);const cx=e[0]+Math.cos(ta+Math.PI/2)*4.5,cy=e[1]+Math.sin(ta+Math.PI/2)*4.5;const px=cx+Math.cos(an-Math.PI/2)*rr,py=cy+Math.sin(an-Math.PI/2)*rr;j?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
  c.restore();}
function ln_strataKit(){let K=LN_C.get("st");if(K)return K;const Y0=280,c=ln_cv(1920,1080-Y0),x=c.getContext("2d");x.translate(0,-Y0);
  const LAY=[[34,26,20],[112,86,58],[52,48,47],[124,114,96],[96,78,58],[100,58,44],[40,34,30]],N=7,top=(k,X)=>k<N?ln_bedY(k,X):1090;
  // the contacts, sampled every 4 px
  const XS=[];for(let X=-12;X<=1932;X+=4)XS.push(X);const TOP=[];for(let k=0;k<=N;k++)TOP.push(XS.map(X=>top(k,X)));const at=(k,X)=>{const f=(X+12)/4,i=clamp(Math.floor(f),0,XS.length-2),u=f-i;return lerp(TOP[k][i],TOP[k][i+1],u);};
  const band=k=>{x.beginPath();XS.forEach((X,i)=>i?x.lineTo(X,TOP[k][i]):x.moveTo(X,TOP[k][i]));for(let i=XS.length-1;i>=0;i--)x.lineTo(XS[i],TOP[k+1][i]);x.closePath();};
  for(let k=0;k<N;k++){band(k);x.fillStyle=rgba(LAY[k],1);x.fill();x.save();band(k);x.clip();const y0=Math.min(...TOP[k])-4,y1=Math.max(...TOP[k+1])+4;
    // grains
    const n=k===1?5200:k===0?1500:k===3?2000:2600;for(let i=0;i<n;i++){const px=hash(i,k*10+5)*1920,py=lerp(y0,y1,hash(i,k*10+6)),r=0.4+(k===1?0.7:1)*hash(i,k*10+7);if(k===3&&hash(i,k*10+4)<0.6*LN_QF(px,py))continue;
      x.fillStyle=hash(i,k*10+8)<0.5?"rgba(255,236,200,"+(0.08+0.12*hash(i,k*10+9))+")":"rgba(10,6,4,"+(0.1+0.18*hash(i,k*10+9))+")";x.fillRect(px,py,r*1.6,r);}
    if(k===1){// trough cross-bedding: scoops cut into each other, each later one erasing what it cuts, each filled with laminae that follow its curved floor
      for(let i=0;i<16;i++){const cx=-80+i*132+hash(i,31)*70,w=230+190*hash(i,32),t1=at(1,cx),t2=at(2,cx),d=(t2-t1)*(0.45+0.4*hash(i,33)),y0s=t1+(t2-t1)*(0.05+0.4*hash(i,34))-d*0.15,sc=X=>{const u=(X-cx)/(w/2);return y0s+d*(1-u*u);};
        x.save();x.beginPath();for(let X=cx-w/2;X<=cx+w/2;X+=6)x.lineTo(X,sc(X));x.lineTo(cx+w/2,y0s-60);x.lineTo(cx-w/2,y0s-60);x.closePath();x.clip();
        if(i){x.fillStyle=rgba(mix(LAY[1],[90,66,42],0.3*hash(i,35)),0.55);x.fillRect(cx-w/2,y0s-60,w,d+62);}
        const nl=5+Math.floor(4*hash(i,36));for(let j=1;j<=nl;j++){const f=j/(nl+1);x.beginPath();for(let X=cx-w/2;X<=cx+w/2;X+=6){const u=(X-cx)/(w/2);x.lineTo(X,y0s+d*(1-f)*(1-u*u)+d*0.02*ln_n1(X*0.05+j,i*9+j));}
          x.strokeStyle=j%2?"rgba(60,40,22,0.34)":"rgba(186,154,108,0.16)";x.lineWidth=j%2?1:0.8;x.stroke();}
        x.beginPath();for(let X=cx-w/2;X<=cx+w/2;X+=6)x.lineTo(X,sc(X));x.strokeStyle="rgba(46,30,18,0.45)";x.lineWidth=1.1;x.stroke();x.restore();}}
    if(k===2){// shale: fine laminae, a few paler silty ones
      for(let j=1;j<22;j++){x.beginPath();for(let X=0;X<=1920;X+=8){const yy=lerp(at(2,X),at(3,X),j/22+0.012*ln_n1(X*0.01+j,j+40))+0.7*ln_n1(X*0.03+j,j);X?x.lineTo(X,yy):x.moveTo(X,yy);}
        x.strokeStyle=hash(j,44)<0.2?"rgba(150,142,132,0.22)":j%2?"rgba(18,16,16,0.32)":"rgba(140,132,124,0.12)";x.lineWidth=0.8;x.stroke();}}
    if(k===3){// limestone: two stylolites, broken shells, crinoid ossicles
      [0.35,0.72].forEach((f,si)=>{x.beginPath();let on=false;for(let X=0;X<=1920;X+=3){const yy=lerp(at(3,X),at(4,X),f)+4*ln_fbm(X*0.004,50+si,2)+(hash(X,51+si)-0.5)*2.6;const ok=LN_QF(X,yy)<0.02&&ln_n1(X*0.006+si*7,52+si)>-0.35;if(ok&&on)x.lineTo(X,yy);else if(ok)x.moveTo(X,yy);on=ok;}
        x.strokeStyle="rgba(40,34,28,0.35)";x.lineWidth=0.8;x.stroke();});
      for(let i=0;i<70;i++){const px=hash(i,91)*1920,py=lerp(at(3,px)+12,at(4,px)-12,hash(i,92));if(LN_QZ(px,py))continue;x.strokeStyle="rgba(236,224,200,0.3)";x.lineWidth=1;x.beginPath();x.arc(px,py,2+4*hash(i,93),hash(i,94)*6,hash(i,94)*6+1.4+hash(i,95));x.stroke();}
      for(let i=0;i<24;i++){const px=hash(i,96)*1920,py=lerp(at(3,px)+14,at(4,px)-14,hash(i,97));if(LN_QZ(px,py))continue;x.strokeStyle="rgba(236,224,200,0.4)";x.lineWidth=1;x.beginPath();x.arc(px,py,2.4,0,TAU);x.stroke();x.fillStyle="rgba(40,30,20,0.5)";x.beginPath();x.arc(px,py,0.8,0,TAU);x.fill();}}
    if(k===4){// conglomerate: pebbles packed against each other, of many rocks and sizes, rounded but not round, their long sides tilted the same way
      const G=new Map(),CL=[[196,190,176],[74,70,68],[128,78,62],[128,124,118],[164,140,108],[108,112,96],[182,166,140]],pl=[];
      for(let i=0;i<5200&&pl.length<900;i++){const px=hash(i,101)*1950-15,t4=at(4,px),t5=at(5,px);const r=2.6+11*Math.pow(hash(i,103),2.2),py=lerp(t4+r*0.5,t5-r*0.4,hash(i,102));if(t5-t4<6)continue;
        const gx=Math.floor(px/24),gy=Math.floor(py/24);let ok=true;for(let a=-1;a<=1&&ok;a++)for(let b=-1;b<=1&&ok;b++)(G.get((gx+a)+","+(gy+b))||[]).forEach(q=>{if(Math.hypot(q[0]-px,(q[1]-py)*1.3)<(q[2]+r)*0.82)ok=false;});
        if(!ok)continue;const key=gx+","+gy;G.set(key,(G.get(key)||[]).concat([[px,py,r]]));pl.push([px,py,r,i]);}
      pl.forEach(([px,py,r,i])=>{const rot=-0.3+(hash(i,104)-0.5)*0.7,e=0.6+0.35*hash(i,106),cl=CL[Math.floor(hash(i,105)*CL.length)],pts=[];
        for(let j=0;j<9;j++){const a=j/9*TAU,rr=r*(1+0.16*(hash(i*9+j,107)-0.5));pts.push([px+Math.cos(a)*rr*Math.cos(rot)-Math.sin(a)*rr*e*Math.sin(rot),py+Math.cos(a)*rr*Math.sin(rot)+Math.sin(a)*rr*e*Math.cos(rot)]);}
        const path=(dx,dy)=>{x.beginPath();for(let j=0;j<9;j++){const a=pts[j],b=pts[(j+1)%9],m=[(a[0]+b[0])/2+dx,(a[1]+b[1])/2+dy];j?x.quadraticCurveTo(a[0]+dx,a[1]+dy,m[0],m[1]):x.moveTo(m[0],m[1]);}const a=pts[0],b=pts[1];x.quadraticCurveTo(a[0]+dx,a[1]+dy,(a[0]+b[0])/2+dx,(a[1]+b[1])/2+dy);x.closePath();};
        path(r*0.16,r*0.2);x.fillStyle="rgba(14,10,8,0.55)";x.fill();path(0,0);x.fillStyle=rgba(cl,1);x.fill();
        x.save();x.clip();x.fillStyle="rgba(0,0,0,0.22)";x.beginPath();x.ellipse(px+r*0.35,py+r*0.35,r,r*0.8,0,0,TAU);x.fill();x.fillStyle="rgba(255,246,226,0.26)";x.beginPath();x.ellipse(px-r*0.3,py-r*0.3,r*0.45,r*0.28,rot,0,TAU);x.fill();x.restore();});}
    if(k===5){// red mudstone, with pale green spots where the iron was reduced, soft-edged
      for(let i=0;i<50;i++){const px=hash(i,111)*1920,py=lerp(at(5,px)+10,at(6,px)-10,hash(i,112)),r=2+7*hash(i,113);x.fillStyle="rgba(150,160,120,0.1)";x.beginPath();x.ellipse(px,py,r*1.5,r*1.2,0,0,TAU);x.fill();
        x.fillStyle="rgba(150,160,120,0.14)";x.beginPath();x.ellipse(px,py,r,r*0.8,0,0,TAU);x.fill();}}
    if(k===6){for(let i=0;i<16;i++){const px=hash(i,121)*1920;x.strokeStyle="rgba(0,0,0,0.3)";x.lineWidth=1;x.beginPath();x.moveTo(px,at(6,px)+4);for(let j=1;j<8;j++)x.lineTo(px+(hash(i*8+j,122)-0.5)*16,at(6,px)+j*24);x.stroke();}}
    x.restore();}
  // mottling: soft patches of darker and paler rock, stretched along the beds
  {const tw=480,th=Math.ceil((1080-Y0)/4),Nc=ln_cv(tw,th),nx=Nc.getContext("2d"),D=nx.createImageData(tw,th),AMP=[0.5,0.7,0.4,0.55,0.35,0.7,0.5];
    for(let i=0;i<tw;i++){const X=i*4+2,tp=[];for(let k=0;k<=N;k++)tp.push(at(k,X));for(let j=0;j<th;j++){const Y=Y0+j*4+2;let k=0;while(k<N-1&&Y>=tp[k+1])k++;if(Y<tp[0])continue;
      const v=(ln_n2(X*0.006,Y*0.02,60+k)*0.65+ln_n2(X*0.018,Y*0.05,70+k)*0.35)*AMP[k]*(k===3?1-0.6*LN_QF(X,Y):1),o=(j*tw+i)*4;
      if(v<0){D.data[o+3]=Math.round(255*Math.min(0.2,-v*0.4));}else{D.data[o]=255;D.data[o+1]=232;D.data[o+2]=196;D.data[o+3]=Math.round(255*Math.min(0.08,v*0.16));}}}
    nx.putImageData(D,0,0);x.imageSmoothingEnabled=true;x.drawImage(Nc,0,Y0,tw*4,th*4);}
  // bedding planes: a dark seam, and a lit lip just under it; the contacts are rough, a few px up and down
  for(let k=1;k<N;k++){x.beginPath();XS.forEach((X,i)=>i?x.lineTo(X,TOP[k][i]):x.moveTo(X,TOP[k][i]));x.strokeStyle="rgba(8,5,4,0.6)";x.lineWidth=1.6;x.stroke();
    x.beginPath();XS.forEach((X,i)=>i?x.lineTo(X,TOP[k][i]+2):x.moveTo(X,TOP[k][i]+2));x.strokeStyle="rgba(255,232,196,0.14)";x.lineWidth=1.2;x.stroke();}
  // roots reaching down from the soil
  x.lineCap="round";for(let i=0;i<30;i++){let px=hash(i,131)*1920,py=at(0,px)+14;const L=20+60*hash(i,132);x.strokeStyle="rgba(150,120,90,0.3)";x.lineWidth=1.2;x.beginPath();x.moveTo(px,py);for(let j=0;j<8;j++){px+=(hash(i*9+j,133)-0.5)*8;py+=L/8;x.lineTo(px,py);}x.stroke();}
  // the surface: soil, tufts of grass along it, lit at its edge
  x.beginPath();XS.forEach((X,i)=>i?x.lineTo(X,TOP[0][i]):x.moveTo(X,TOP[0][i]));x.strokeStyle="rgba(190,205,140,0.4)";x.lineWidth=1.3;x.shadowColor="rgba(170,200,120,0.6)";x.shadowBlur=6;x.stroke();x.shadowBlur=0;
  for(let i=0;i<150;i++){const px=hash(i,141)*1930,py=at(0,px)+1,n=3+Math.floor(hash(i,142)*4);for(let j=0;j<n;j++){const h=4+9*hash(i*7+j,143),l=(hash(i*7+j,144)-0.5)*7;x.strokeStyle=hash(i*7+j,145)<0.5?"rgba(98,110,64,0.8)":"rgba(40,48,30,0.9)";x.lineWidth=1;x.beginPath();x.moveTo(px+j*1.4,py);x.quadraticCurveTo(px+j*1.4+l*0.3,py-h*0.6,px+j*1.4+l,py-h);x.stroke();}}
  // the fossils: ammonites and scallops in the limestone, a fern in the shale, a thigh bone in the mudstone
  ln_ammonite(x,350,574,50,0.4,{W:1.7,turns:5,ribs:46,fork:1});ln_ammonite(x,1560,600,32,2.2,{W:1.85,turns:4,ribs:34});ln_ammonite(x,1262,630,16,4.1,{W:1.9,turns:3.5,ribs:26});
  ln_shell(x,660,590,22,-0.3);ln_shell(x,1792,562,15,0.45);
  ln_fern(x,1398,440,1622,420,10);
  ln_bone(x,1150,834,1.0,-0.08);
  // light from the upper left, over everything
  let g=x.createLinearGradient(0,280,1500,1300);g.addColorStop(0,"rgba(255,226,180,0.08)");g.addColorStop(0.5,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.35)");x.fillStyle=g;x.fillRect(0,280,1920,800);
  g=x.createLinearGradient(0,300,0,1080);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.3)");x.fillStyle=g;x.fillRect(0,280,1920,800);
  K={c,top:Y0};LN_C.set("st",K);return K;}
// layers of rock filling the frame from y ≈ 300 down, with shells and bones in them, but no words
function strata(ctx,t){const K=ln_strataKit();ln_put(ctx,[K.c],0,K.top);}

/* ---------- a clay tablet ---------- */
// the numerals, row by row: O a round hole (the round end of the stylus pressed straight in), D a notch (pressed in at a slant);
// three cases of four in each row, the bigger units first
const LN_MARKS="OODDODDDOOOD"+"ODDDOODDDDDD"+"OOODODDDOODD"+"OODDOOODODDD";
const LN_LIGHT=(()=>{const l=Math.hypot(-0.5,-0.62,0.6);return[-0.5/l,-0.62/l,0.6/l];})();
// the outline of the tablet's face, in its own units (the rows of numerals are laid out in w × h; the clay reaches a little above them):
// a softened, slightly uneven rectangle that bulges at its sides, with a nick or two knocked out of its edge
const LN_NICKS=[[1.62,0.022,0.06],[2.95,0.018,0.05],[0.52,0.014,0.07]];
function ln_slab(w,h){const P=[],n=200,t0=-18,H=h-t0-8;for(let i=0;i<n;i++){const th=i/n*TAU,ct=Math.cos(th),st=Math.sin(th),e=4.4,px=Math.sign(ct)*Math.pow(Math.abs(ct),2/e),py=Math.sign(st)*Math.pow(Math.abs(st),2/e);
    let wob=1+0.011*ln_n1(th*2.2,71)+0.005*ln_n1(th*7,72);LN_NICKS.forEach(([c,d,s])=>{const dt=Math.atan2(Math.sin(th-c),Math.cos(th-c));wob-=d*Math.exp(-(dt/s)*(dt/s));});
    P.push([w/2+(px*w/2+0.012*w*st*(1+ct))*wob,t0+H/2+(py*H/2-0.01*H*ct)*wob]);}return P;}
function ln_path(c,P,dx,dy){c.moveTo(P[0][0]+dx,P[0][1]+dy);for(let i=1;i<P.length;i++)c.lineTo(P[i][0]+dx,P[i][1]+dy);c.closePath();}
// relief shading: the light a surface of heights H (W×H2, row by row) catches from the upper left
function ln_shade(H,W,H2){const L=LN_LIGHT,out=new Float32Array(W*H2);for(let j=0;j<H2;j++)for(let i=0;i<W;i++){const k=j*W+i,gx=(H[j*W+Math.min(W-1,i+1)]-H[j*W+Math.max(0,i-1)])/2,gy=(H[Math.min(H2-1,j+1)*W+i]-H[Math.max(0,j-1)*W+i])/2,
    l=Math.hypot(gx,gy,1);out[k]=(-gx*L[0]-gy*L[1]+L[2])/l;}return out;}
// a box blur of radius r over the array A (W×H), three times, which is close to a gaussian: the same in every browser, unlike a canvas filter
function ln_blur(A,W,H,r,n){let a=Float32Array.from(A),b=new Float32Array(W*H);const d=2*r+1;
  for(let p=0;p<(n||3);p++){for(let j=0;j<H;j++){const o=j*W;let s=0;for(let i=-r;i<=r;i++)s+=a[o+clamp(i,0,W-1)];for(let i=0;i<W;i++){b[o+i]=s/d;s+=a[o+Math.min(W-1,i+r+1)]-a[o+Math.max(0,i-r)];}}
    for(let i=0;i<W;i++){let s=0;for(let j=-r;j<=r;j++)s+=b[clamp(j,0,H-1)*W+i];for(let j=0;j<H;j++){a[j*W+i]=s/d;s+=b[Math.min(H-1,j+r+1)*W+i]-b[Math.max(0,j-r)*W+i];}}}
  return a;}
// fingerprints left in the clay by the hands that held it: where (in parts of w × h), how big (a fingertip, about 1.3 cm), turned how far
const LN_PRINTS=[[0.015,0.8,40,-0.35],[0.985,0.22,36,0.5],[0.62,1.0,34,0.1]];
// the frieze of a cylinder seal rolled along the bottom band: cattle walking, and the ring-post of Inanna between them
function ln_seal(c,x0,y0,len){c.fillStyle="#fff";for(let X=x0;X<x0+len;X+=132){const cow=(x,s)=>{c.beginPath();c.ellipse(x,y0+1,15*s,6.5*s,0,0,TAU);c.fill();
      c.beginPath();c.ellipse(x+15*s,y0-3*s,5*s,3.4*s,-0.5,0,TAU);c.fill();c.lineCap="round";c.lineWidth=2.6*s;c.strokeStyle="#fff";c.beginPath();
      [[-11,5,-12,17],[-7,5,-6,17],[8,5,9,17],[12,5,13,17]].forEach(([a,b,cc,d])=>{c.moveTo(x+a*s,y0+b*s);c.lineTo(x+cc*s,y0+d*s);});c.moveTo(x-15*s,y0);c.quadraticCurveTo(x-20*s,y0+3*s,x-19*s,y0+11*s);
      c.moveTo(x+16*s,y0-6*s);c.quadraticCurveTo(x+14*s,y0-14*s,x+8*s,y0-16*s);c.moveTo(x+18*s,y0-5*s);c.quadraticCurveTo(x+22*s,y0-13*s,x+27*s,y0-14*s);c.stroke();};
    cow(X+26,1);cow(X+82,0.92);
    // the ring-post: a reed bundle with a loop at its top and a streamer
    c.lineWidth=3;c.beginPath();c.moveTo(X+118,y0+17);c.lineTo(X+118,y0-8);c.stroke();c.lineWidth=2.4;c.beginPath();c.arc(X+118,y0-12,4,0,TAU);c.stroke();
    c.lineWidth=1.8;c.beginPath();c.moveTo(X+120,y0-12);c.quadraticCurveTo(X+127,y0-8,X+126,y0+2);c.stroke();}}
function ln_tabletKit(w,h){const key="tb"+w+"x"+h;let K=LN_C.get(key);if(K)return K;const M=56,CW=w+2*M,CH=h+2*M,c=ln_cv(CW,CH),x=c.getContext("2d"),P=ln_slab(w,h);
  // the face's shape; blurred a little it rounds the edges, blurred a lot it gives the pillow its dome
  const Fm=ln_cv(CW,CH),fm=Fm.getContext("2d");fm.translate(M,M);fm.fillStyle="#fff";fm.beginPath();ln_path(fm,P,0,0);fm.fill();
  const mA=fm.getImageData(0,0,CW,CH).data,A0=new Float32Array(CW*CH);for(let k=0;k<CW*CH;k++)A0[k]=mA[k*4+3]/255;
  const B1=ln_blur(A0,CW,CH,6),B2=ln_blur(A0,CW,CH,24);
  // the seal's rolling: raised figures, softened as clay is
  const Sm=ln_cv(CW,CH),sm=Sm.getContext("2d");sm.translate(M,M);sm.save();sm.beginPath();sm.rect(18,h-68,w-36,54);sm.clip();ln_seal(sm,-40+hash(w,7)*30,h-44,w+80);sm.restore();
  const sA=sm.getImageData(0,0,CW,CH).data,S0=new Float32Array(CW*CH);for(let k=0;k<CW*CH;k++)S0[k]=sA[k*4+3]/255;const SB=ln_blur(S0,CW,CH,1,2);
  const Hh=new Float32Array(CW*CH);
  for(let j=0;j<CH;j++)for(let i=0;i<CW;i++){const k=j*CW+i,X=i-M,Y=j-M,b=B1[k];if(b<0.01){Hh[k]=0;continue;}
    // rounded edges, a low dome, the unevenness of hand-pressed clay, and the seal's figures standing a little proud
    let H=10*Math.pow(clamp((b-0.3)/0.7,0,1),0.6)+14*Math.pow(B2[k],1.6)+1.3*ln_n2(X*0.011,Y*0.011,5)+0.5*ln_n2(X*0.03,Y*0.03,6)+0.18*ln_n2(X*0.1,Y*0.1,7)+0.7*ln_n2(X*0.004,Y*0.03,11)+1.1*SB[k]*(0.75+0.25*ln_n2(X*0.05,Y*0.05,12))+18*(1-Math.min(1,((X-w/2)/(w/2))**2*0.8+((Y-h/2+14)/(h/2+10))**2*0.8));
    // fingerprints: a shallow dimple, and faint ridges in whorls, only partly there
    for(const [pu,pv,R,rot] of LN_PRINTS){const dx=X-pu*w,dy=Y-pv*h;if(dx*dx+dy*dy>R*R*1.7)continue;const cs=Math.cos(rot),sn=Math.sin(rot),a=(dx*cs+dy*sn)/1.25,bb=-dx*sn+dy*cs,d=Math.hypot(a,bb),f=Math.max(0,1-d/R);
      const vis=clamp(0.5+0.9*ln_n2(X*0.035+pu*9,Y*0.035,13),0,1);H+=-1.2*f*f+0.2*vis*Math.sin(d*TAU/3.1+0.35*Math.sin(Math.atan2(bb,a)*2))*Math.min(1,f*3)*Math.min(1,d/6);}
    Hh[k]=H;}
  const S=ln_shade(Hh,CW,CH),F=ln_cv(CW,CH),fx=F.getContext("2d"),D=fx.createImageData(CW,CH);
  for(let j=0;j<CH;j++)for(let i=0;i<CW;i++){const k=j*CW+i,a=mA[k*4+3];if(!a)continue;const X=i-M,Y=j-M,tone=ln_n2(X*0.006,Y*0.006,9),red=ln_n2(X*0.02,Y*0.02,10),sh=clamp(0.42+0.72*S[k],0.2,1.25),
    r=(168+10*tone+5*red)*sh,g=(128+6*tone-2*red)*sh,bl=(90+2*tone-5*red)*sh,o=k*4;D.data[o]=Math.min(255,r);D.data[o+1]=Math.min(255,g);D.data[o+2]=Math.min(255,bl);D.data[o+3]=a;}
  fx.putImageData(D,0,0);
  // its shadow, and the thickness of the slab showing at its lower edge
  x.translate(M,M);x.save();x.shadowColor="rgba(0,0,0,0.55)";x.shadowBlur=34;x.shadowOffsetX=10;x.shadowOffsetY=18;x.fillStyle="rgb(64,42,28)";x.beginPath();ln_path(x,P,3,10);x.fill();x.restore();
  x.fillStyle="rgb(80,54,36)";x.beginPath();ln_path(x,P,3,10);x.fill();x.fillStyle="rgb(104,72,48)";x.beginPath();ln_path(x,P,1.5,5);x.fill();
  x.drawImage(F,-M,-M);
  // clay: grit and pores
  x.save();x.beginPath();ln_path(x,P,0,0);x.clip();
  for(let i=0;i<4200;i++){const px=hash(i,201)*w,py=-18+hash(i,202)*(h+10),r=0.5+1.0*hash(i,203);x.fillStyle=hash(i,204)<0.5?"rgba(255,236,206,"+(0.05+0.12*hash(i,205))+")":"rgba(60,34,18,"+(0.06+0.14*hash(i,205))+")";x.fillRect(px,py,r,r);}
  for(let i=0;i<150;i++){const px=hash(i,206)*w,py=-18+hash(i,207)*(h+10),r=0.6+1.1*hash(i,208);x.fillStyle="rgba(58,32,16,0.4)";x.beginPath();x.arc(px,py,r,0,TAU);x.fill();x.fillStyle="rgba(255,240,214,0.3)";x.beginPath();x.arc(px+r*0.7,py+r*0.7,r*0.55,0,TAU);x.fill();}
  // ruled lines between the rows and round the cases, drawn with the edge of the stylus: a groove, dark on its upper side, lit on its lower lip
  const rule=(x0,y0,x1,y1,sd)=>{const n=30,hz=y0===y1,pt=(i,o)=>{const u=i/n,j=ln_n1(u*6,sd)*1.3;return[lerp(x0,x1,u)+(hz?0:j)+o[0],lerp(y0,y1,u)+(hz?j:0)+o[1]];};
    [[[-0.4,-0.6],"rgba(58,32,14,0.55)",2.1],[[0.9,1.2],"rgba(255,236,206,0.32)",1.1]].forEach(([o,col,lw])=>{x.strokeStyle=col;x.lineWidth=lw;x.beginPath();for(let i=0;i<=n;i++){const p=pt(i,o),wv=0.75+0.35*ln_n1(i*0.7,sd+5);if(i){x.lineWidth=lw*wv;x.lineTo(p[0],p[1]);}else x.moveTo(p[0],p[1]);}x.stroke();});};
  x.lineCap="round";for(let r=1;r<5;r++){const yy=r*h/5+2+(hash(r,302)-0.5)*3;rule(24+hash(r,301)*8,yy,w-24-hash(r,303)*8,yy,300+r);}
  [3.5,7.5].forEach((cc,i)=>{const cx=40+cc*(w-80)/12+11;rule(cx,2,cx+2,4*h/5+2,310+i);});
  x.restore();
  K={c,M};LN_C.set(key,K);return K;}
// one pressed mark, as a shading to lay over the clay: O a round hole, D a notch pressed at a slant, deepest at its round end where the stylus went in,
// shallowing to a point where it came out; the clay it pushed aside stands as a low lip round it. Dark where its walls turn from the light,
// pale where they face it, darker with depth; the sprite fades to nothing well inside its edges
function ln_markKit(kind,v){const key="mk"+kind+v;let F=LN_C.get(key);if(F)return F;const S=64,o=S/2,sz=0.93+0.14*hash(v,3),an=-1.22+(hash(v,4)-0.5)*0.22,ca=Math.cos(an),sa=Math.sin(an),Hh=new Float32Array(S*S),dep=new Float32Array(S*S);
  const R=8.4*sz,r0=5.4*sz,Lt=17*sz;
  for(let j=0;j<S;j++)for(let i=0;i<S;i++){const X=i+0.5-o,Y=j+0.5-o;let d=0,sd,lip=0.9;
    if(kind==="O"){const r=Math.hypot(X,Y);sd=r-R;if(r<R)d=5.2*Math.pow(1-(r/R)*(r/R),0.6);}
    else{const a=X*ca+Y*sa,b=-X*sa+Y*ca;
      if(a<0){const r=Math.hypot(a,b);sd=r-r0;if(r<r0)d=4.8*Math.sqrt(1-(r/r0)*(r/r0));}
      else{const f=(a/Lt)*(a/Lt)+(b/r0)*(b/r0)-1,gx=2*a/(Lt*Lt),gy=2*b/(r0*r0);sd=f/Math.max(0.08,Math.hypot(gx,gy));const u=Math.min(1,a/Lt),wd=r0*Math.sqrt(Math.max(0,1-u*u));
        if(wd>0&&Math.abs(b)<wd)d=4.8*Math.pow(1-u,0.8)*Math.sqrt(1-(b/wd)*(b/wd));lip=0.7*(1-0.55*u);}}
    const win=1-sstep(o-14,o-4,Math.hypot(X,Y)),rim=lip*Math.exp(-((sd-1.3)/1.5)*((sd-1.3)/1.5));Hh[j*S+i]=(rim-d)*win;dep[j*S+i]=d;}
  const Sh=ln_shade(Hh,S,S),c=ln_cv(S,S),x=c.getContext("2d"),D=x.createImageData(S,S),flat=LN_LIGHT[2];
  for(let k=0;k<S*S;k++){const s=Sh[k]-flat-0.06*dep[k],q=k*4;if(s<0){D.data[q]=46;D.data[q+1]=24;D.data[q+2]=10;D.data[q+3]=Math.min(255,-s*420);}else{D.data[q]=255;D.data[q+1]=238;D.data[q+2]=208;D.data[q+3]=Math.min(255,s*300);}}
  x.putImageData(D,0,0);F={c,o};LN_C.set(key,F);return F;}
// a clay tablet from Uruk, c. 3300 BCE, with rows of numerals pressed in as p goes from 0 to 1: mark k lies at
// x+40+(k%12)*(w-80)/12 (+ a little), y+row*h/5+h/10+8; each is pressed in while the stylus rests on it
function tablet(ctx,x,y,w,h,p,a){const K=ln_tabletKit(Math.round(w),Math.round(h));withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform();ln_put(ctx,[K.c],x-K.M,y-K.M,m);
  const n=48,q=clamp(p,0,1)*n;for(let i=0;i<n&&i<q;i++){const row=Math.floor(i/12),col_=i%12,px=x+40+col_*(w-80)/12+hash(i,2)*6,py=y+row*h/5+h/10+8,d=clamp(q-i,0,1),F=ln_markKit(LN_MARKS[i]||"D",i%5);
    ctx.save();ctx.globalAlpha*=d;ln_put(ctx,[F.c],px+8-F.o,py-6-F.o,m);ctx.restore();}});}

/* ---------- warming the caches ---------- */
// The pictures that take long to paint the first time (the acacia, the rocks, the tablet...) are painted soon after the film's page loads,
// one at a time with pauses between, so that playing or seeking into their scenes never stalls. Only on a page with the film's player:
// not while rendering the video, and not on the labs' pages
(function(){if(typeof window==="undefined"||typeof document==="undefined"||typeof setTimeout!=="function")return;
  const jobs=[()=>ln_groundKit(760),()=>ln_groundKit(700),()=>ln_grassKit(),()=>ln_stemKit(),()=>ln_grassLay(0,1920,770),()=>ln_grassLay(0,1920,710),()=>ln_treeKit(1.5),()=>ln_bushKit(1.5),
    ()=>ln_perchKit(320),()=>ln_leafSprite(27,10),()=>ln_strataKit(),()=>ln_tabletKit(600,380)];
  for(let v=0;v<5;v++)["O","D"].forEach(k=>jobs.push(()=>ln_markKit(k,v)));
  const next=()=>{const f=jobs.shift();if(!f)return;try{f();}catch(e){}setTimeout(next,40);};
  const go=()=>{if(window.__RENDER__||!document.getElementById("film"))return;setTimeout(next,300);};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();})();
