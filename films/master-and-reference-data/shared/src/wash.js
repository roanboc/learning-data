/* ===== The same one, everywhere: the watercolour look =====
   Washes of pigment on warm paper, a pencil line, and colours that mean something: each role has its own, the same in every film,
   and the person, as the master record, is left as white paper and banded in her roles' colours. Backgrounds are daylight
   landscapes, soft, so the role colours are the strongest washes on screen. Text is dark ink on paper-light cards.
   Everything costly is painted once and kept: the paper, the pigment's grain, each place's background and each card's paper. Only
   the text and what moves are drawn every frame, so the site's player can draw the film live. Every name here starts with wc_ or WC,
   because every file of the film shares one script. */

/* ---------- colours ---------- */
const WC_PAPER=[251,247,238],WC_PENCIL=[58,54,66],WC_INK=[46,42,56],WC_MUTED=[100,96,112],WC_DARK=[30,26,40],WC_CARD=[253,251,245];
// the roles, the same in every film: student teal, platform user amber, customer coral, tutor violet, alumna green, donor magenta
const WC_ROLE={student:[14,150,146],platform:[226,150,10],customer:[238,96,78],tutor:[126,86,220],alumna:[38,160,96],donor:[200,70,150]};
// text in a role's colour on paper, darkened to keep 4.5:1
const WC_ROLEINK={student:[0,112,108],platform:[150,92,0],customer:[184,56,40],tutor:[100,62,190],alumna:[22,120,68]};
// the industries: the university teal (the student's), health red, banking blue, energy yellow, retail orange, the public sector green-blue
const WC_IND={uni:[14,150,146],health:[214,66,74],bank:[52,112,204],energy:[232,184,24],retail:[240,130,40],public:[36,148,168]};
// the soft wash a person is edged in: cyan for the technical side, gold for the business side, a neutral grey-blue for the person herself
const WC_SIDE={tech:[100,176,240],biz:[244,188,70],none:[150,170,200]};
const WC_BADGE=[255,214,90];
// the landscape, in daylight
const WCP={skyTop:[116,174,226],sun:[255,224,150],farForest:[124,162,154],far:[176,204,176],mid:[156,198,124],mid2:[146,192,118],near:[134,182,104],field:[222,216,142],
  water:[132,182,222],pine:[78,128,104],birchLeaf:[176,210,112],leaf:[114,172,104],leaf2:[146,190,114],trunk:[156,120,92],bark:WC_PAPER,barkMark:[72,68,74],
  wall:[248,242,230],roofDark:[104,108,126],spire:[90,94,114],pane:[112,134,176],door:[176,124,92],falu:[202,86,68],trim:WC_PAPER,roof:[120,108,116],
  farmDoor:[104,144,166],stoneGrey:[184,180,174],brick:[208,126,98],copper:[114,174,154],road:[238,218,176],coat:[112,126,174],skinTiny:[242,206,172],
  hat:[94,86,94],parchment:[250,240,216],parchInk:[64,52,46],leather:[176,112,82],flowerA:[255,255,255],flowerB:[255,214,80],flowerC:[156,146,232],
  city:[194,210,228],stone:[238,210,162],slate:[134,144,164],clock:[255,255,255],glass:[164,208,234],concrete:[228,226,222],plaster:[244,228,198],
  brickHouse:[214,126,102],blueHouse:[164,190,220],chimney:[194,118,98],tile:[134,118,124],blueDoor:[84,134,174],paving:[236,230,218],iron:[92,96,112],
  lampGlow:[255,232,172],mailbox:[218,92,78],lawn:[152,198,122],hedge:[98,152,102],wood:[172,138,102],wallIn:[242,232,214],floor:[214,196,170]};

/* ---------- randomness and textures ---------- */
function wc_rng(seed){let s=(seed>>>0)||1;return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function wc_noise(seed){const R=wc_rng(seed),N=new Float32Array(1024);for(let i=0;i<1024;i++)N[i]=R();const g=(ix,iy)=>N[((ix*73856093)^(iy*19349663))&1023];
  return(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),tx=x-ix,ty=y-iy,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);return lerp(lerp(g(ix,iy),g(ix+1,iy),sx),lerp(g(ix,iy+1),g(ix+1,iy+1),sx),sy);};}
// the paper's tooth and fibres, near white, to multiply over a whole frame; k is how strongly it shows, and the corners darken a touch
function wc_paperTex(w,h,seed,k){const c=mkCanvas(w,h),x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,n=wc_noise(seed),R=wc_rng(seed+5);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const q=(j*w+i)*4,v=n(i/2.3,j/2.3)*0.45+n(i/9,j/9)*0.35+n(i/60,j/60)*0.2,t=255-(Math.pow(v,2.4)*46+R()*6)*k,
    e=Math.pow(Math.hypot((i-w/2)/(w*0.62),(j-h*0.48)/(h*0.62)),2.2),vg=1-0.05*clamp(e-0.35,0,1);d[q]=t*vg;d[q+1]=(t-1*k)*(vg-0.003);d[q+2]=(t-3*k)*(vg-0.006);d[q+3]=255;}
  x.putImageData(im,0,0);x.lineCap="round";
  for(let i=0;i<w*h/2400;i++){const x0=R()*w,y0=R()*h,a=R()*TAU,l=5+R()*24;x.strokeStyle="rgba(130,118,100,"+((0.04+R()*0.07)*k)+")";x.lineWidth=0.5+R()*0.7;x.beginPath();x.moveTo(x0,y0);
    x.quadraticCurveTo(x0+Math.cos(a+0.5)*l*0.5,y0+Math.sin(a+0.5)*l*0.5,x0+Math.cos(a)*l,y0+Math.sin(a)*l);x.stroke();}
  return c;}
// pigment that settles in the paper's tooth: white with clustered specks, to multiply into washes
function wc_granTex(w,h,seed){const c=mkCanvas(w,h),x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,n=wc_noise(seed),R=wc_rng(seed+3);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const q=(j*w+i)*4,v=n(i/4,j/4)*0.55+n(i/19,j/19)*0.45,sp=R()<0.05*v?R()*60:0,t=255-v*36-sp;d[q]=t;d[q+1]=t;d[q+2]=t;d[q+3]=255;}
  x.putImageData(im,0,0);return c;}
// soft blotches, as an alpha mask, for washes that dry unevenly
function wc_blotchTex(w,h,seed,scale,bias){const c=mkCanvas(w,h),x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,n=wc_noise(seed);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const q=(j*w+i)*4,v=n(i/scale,j/scale)*0.6+n(i/(scale/2.7),j/(scale/2.7))*0.3+n(i/(scale/8),j/(scale/8))*0.1;
    d[q]=255;d[q+1]=255;d[q+2]=255;d[q+3]=clamp((v-0.22+bias)*1.7,0,1)*255;}
  x.putImageData(im,0,0);return c;}
// what is kept: the textures, each place's background, each card's paper, each white figure, and spare canvases
const WC={ready:false,bg:{},paint:{},card:{},tint:{},fig:{},buf:{}};
function wc_prep(){if(WC.ready)return;WC.gran=wc_granTex(W,H,17);WC.paper=wc_paperTex(W,H,23,0.42);WC.blotch=wc_blotchTex(480,270,31,60,0.05);WC.ready=true;}
function wc_buf(k,w,h){let c=WC.buf[k];if(!c)c=WC.buf[k]=mkCanvas(w,h);if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const x=c.getContext("2d");x.setTransform(1,0,0,1,0,0);
  x.globalAlpha=1;x.globalCompositeOperation="source-over";x.filter="none";x.clearRect(0,0,w,h);return[c,x];}
// a texture's alpha, filled with one colour
function wc_tint(tex,col){const k=col.map(v=>v|0).join(",")+"|"+tex.width;if(WC.tint[k])return WC.tint[k];const c=mkCanvas(tex.width,tex.height),x=c.getContext("2d");
  x.fillStyle=rgba(col,1);x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation="destination-in";x.drawImage(tex,0,0);return WC.tint[k]=c;}

/* ---------- shapes: lists of points, so each can be painted as a wash ---------- */
const wc_multi=p=>Array.isArray(p[0][0]);
function wc_tr(ctx,pts){ctx.beginPath();for(const p of wc_multi(pts)?pts:[pts]){ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();}}
function wc_trOpen(ctx,p){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);}
function wc_bbox(pts){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of wc_multi(pts)?pts:[pts])for(const q of p){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}
  return{x0,y0,x1,y1,w:x1-x0,h:y1-y0};}
function wc_rect(x,y,w,h){return[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];}
function wc_ell(cx,cy,rx,ry,n){n=n||32;const o=[];for(let i=0;i<n;i++){const a=i/n*TAU;o.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);}return o;}
function wc_arched(x,y,w,h){const r=w/2,o=[[x,y+h],[x,y+r]];for(let i=1;i<14;i++){const a=Math.PI+i/14*Math.PI;o.push([x+r+Math.cos(a)*r,y+r+Math.sin(a)*r]);}o.push([x+w,y+r],[x+w,y+h]);return o;}
function wc_rrPts(x,y,w,h,r){const o=[],n=6;r=Math.min(r,w/2,h/2);[[x+w-r,y+r,-Math.PI/2],[x+w-r,y+h-r,0],[x+r,y+h-r,Math.PI/2],[x+r,y+r,Math.PI]].forEach(([cx,cy,a0])=>{
  for(let i=0;i<=n;i++){const a=a0+i/n*Math.PI/2;o.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}});return o;}
function wc_resample(pts,step){if(wc_multi(pts))return pts.map(p=>wc_resample(p,step));const o=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],
  L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/step));for(let j=0;j<n;j++)o.push([lerp(a[0],b[0],j/n),lerp(a[1],b[1],j/n)]);}return o;}
function wc_jitter(pts,amp,seed,freq){if(wc_multi(pts))return pts.map((p,i)=>wc_jitter(p,amp,seed+i*7,freq));const n=wc_noise(seed);freq=freq||0.04;
  return pts.map(p=>[p[0]+(n(p[0]*freq,p[1]*freq)-0.5)*2*amp,p[1]+(n(p[1]*freq+31.7,p[0]*freq+11.3)-0.5)*2*amp]);}
// a tapered band along a centre line, for roads and paths
function wc_band(line,w0,w1){const L=[],R=[];for(let i=0;i<line.length;i++){const a=line[Math.max(0,i-1)],b=line[Math.min(line.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,
  w=lerp(w0,w1,i/(line.length-1))/2;L.push([line[i][0]-dy/l*w,line[i][1]+dx/l*w]);R.push([line[i][0]+dy/l*w,line[i][1]-dx/l*w]);}return L.concat(R.reverse());}
function wc_smooth(pts,n){const o=[];for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];for(let j=0;j<n;j++){const t=j/n,t2=t*t,t3=t2*t;
  o.push([0,1].map(k=>0.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3)));}}o.push(pts[pts.length-1]);return o;}
// a point along a polyline, at u (0..1) of its length
function wc_along(pts,u){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}let left=clamp(u,0,1)*L;
  for(let i=0;i<seg.length;i++){if(left<=seg[i]||i===seg.length-1){const k=seg[i]?clamp(left/seg[i],0,1):0;return[lerp(pts[i][0],pts[i+1][0],k),lerp(pts[i][1],pts[i+1][1],k)];}left-=seg[i];}return pts[0];}

/* ---------- painting ---------- */
const wc_lit=(c,k)=>mix(c,[255,255,255],k),wc_dim=(c,k)=>mix(c,[0,0,0],k);
// distance pales a colour towards the paper
const wc_haze=(c,depth)=>mix(c,WC_PAPER,(1-clamp(depth==null?1:depth,0,1))*0.55);
const WC_BARE={field:1,chipwash:1,swatch:1,mark:1,ribbon:1,dab:1};
const WC_LINED={build:1,door:1,trim:1,tree:1,trunk:1,cover:1,page:1,wall:1,coat:1,head:1,hat:1,limb:1,arm:1,iron:1,kerb:1,clock:1,paper:1,thing:1};
// a wash: the shape cleared to paper, then three layers of pigment that don't quite agree on the edge, a darker rim where the pigment
// dried, grain in the paper's tooth, and on larger shapes, blotches where it dried unevenly; buildings, trees and people get a pencil line
function wc_wash(ctx,pts,col,o){o=o||{};col=wc_haze(col,o.depth);const d=o.depth==null?1:o.depth,a=(o.a==null?1:o.a)*0.95,rp=wc_resample(pts,8),b=wc_bbox(pts),seed=(o.seed||7)+Math.round(b.x0);
  if(!WC_BARE[o.kind]&&!o.bare){wc_tr(ctx,wc_jitter(rp,2,seed,0.022));ctx.fillStyle=rgba(WC_PAPER,1);ctx.fill();}
  ctx.save();ctx.globalCompositeOperation="multiply";
  if(o.flat||b.w<26){wc_tr(ctx,wc_jitter(rp,0.8,seed,0.08));ctx.fillStyle=rgba(col,a*0.85);ctx.fill();}
  else{for(let i=0;i<3;i++){wc_tr(ctx,wc_jitter(rp,2.5+i*2.2,seed+i*13,0.022+i*0.012));ctx.fillStyle=rgba(col,a*0.36);ctx.fill();}
    wc_tr(ctx,wc_jitter(rp,2,seed+99,0.03));ctx.lineWidth=2.4;ctx.strokeStyle=rgba(wc_dim(col,0.18),a*0.4);ctx.stroke();
    ctx.save();wc_tr(ctx,rp);ctx.clip();ctx.globalAlpha=0.55;ctx.drawImage(WC.gran,0,0,W,H);
    if(b.w>220&&o.kind!=="page"){ctx.globalAlpha=0.5*a;ctx.drawImage(wc_tint(WC.blotch,col),-(seed%420),-((seed*7)%300),W+420,H+300);
      ctx.globalAlpha=1;ctx.filter="blur(5px)";ctx.lineWidth=16;ctx.strokeStyle=rgba(col,a*0.2);wc_tr(ctx,rp);ctx.stroke();ctx.filter="none";}
    ctx.restore();}
  ctx.restore();
  if((o.kind==="land"||o.kind==="ground")&&!o.flat){const y0=Math.max(b.y0,0),y1=Math.min(b.y1,H);if(y1-y0>120){ctx.save();wc_tr(ctx,rp);ctx.clip();
    const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(WC_PAPER,0));g.addColorStop(0.35,rgba(WC_PAPER,0));g.addColorStop(1,rgba(WC_PAPER,0.3));ctx.fillStyle=g;ctx.fillRect(b.x0,y0,b.w,y1-y0);ctx.restore();}}
  if(o.line!==false&&d>=0.45&&WC_LINED[o.kind])wc_ink(ctx,wc_multi(pts)?pts[0]:pts,true,o.lw||(o.kind==="tree"?1.4:1.7),o.ink||WC_INK,0.75*d,seed,o.kind==="tree"?2:1.1);}
// a pencil line: two passes that don't quite agree
function wc_ink(ctx,pts,closed,lw,col,a,seed,amp){const p=wc_resample(pts,6);ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  for(const [k,aa,ww] of [[0,1,1],[1,0.45,0.55]]){const j=wc_jitter(p,amp==null?1.1:amp,(seed||3)+k*17,0.05);if(closed)wc_tr(ctx,j);else wc_trOpen(ctx,j);ctx.lineWidth=lw*ww;ctx.strokeStyle=rgba(col,a*aa);ctx.stroke();}
  ctx.restore();}
// a pencil line along an open path (o.closed: a loop), drawn on from its start as p goes from 0 to 1; its jitter is worked out once and kept
function wc_resampleOpen(pts,step){const o=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/step));
  for(let j=0;j<n;j++)o.push([lerp(a[0],b[0],j/n),lerp(a[1],b[1],j/n)]);}o.push(pts[pts.length-1]);return o;}
function wc_pencil(ctx,pts,p,o){o=o||{};if(p<=0)return;const q=o.closed?pts.concat([pts[0]]):pts,key=q.map(v=>v[0].toFixed(1)+","+v[1].toFixed(1)).join(";")+"|"+(o.seed||5)+"|"+(o.amp==null?1:o.amp);
  let J=WC.paint[key];if(!J){const r=wc_resampleOpen(q,5),amp=o.amp==null?1.0:o.amp;J=WC.paint[key]=[wc_jitter(r,amp,o.seed||5,0.05),wc_jitter(r,amp,(o.seed||5)+17,0.05)];}
  const n=Math.max(2,Math.round(J[0].length*clamp(p,0,1)));ctx.save();ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);
  J.forEach((pp,i)=>{ctx.beginPath();ctx.moveTo(pp[0][0],pp[0][1]);for(let k=1;k<n;k++)ctx.lineTo(pp[k][0],pp[k][1]);ctx.lineWidth=(o.lw||2.6)*(i?0.55:1);
    ctx.strokeStyle=rgba(o.col||WC_PENCIL,(o.a==null?0.9:o.a)*(i?0.45:1));ctx.stroke();});ctx.restore();}
function wc_glowAt(ctx,x,y,r,col,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}

/* ---------- land and sky ---------- */
// the sky: a wet wash of blue, drying unevenly, with clouds lifted out with a tissue, over the paper; hz is the horizon
function wc_sky(ctx,hz,seed,o){o=o||{};ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const [t,tx]=wc_buf("sky",W,H);const g=tx.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(WCP.skyTop,0.85));g.addColorStop(0.7,rgba(WCP.skyTop,0.35));g.addColorStop(1,rgba(WCP.skyTop,0));
  tx.fillStyle=g;tx.fillRect(0,0,W,hz);tx.globalCompositeOperation="destination-in";tx.drawImage(WC.blotch,0,0,W,H);tx.globalCompositeOperation="destination-out";
  const R=wc_rng(seed*3+1);for(let i=0;i<(o.clouds==null?5:o.clouds);i++){const x=(o.cx||200)+R()*(o.cw||1500),y=(o.cy||90)+R()*(o.ch||220),s=0.6+R()*0.7;
    for(const [dx,dy,r] of [[-80,10,60],[-20,-20,80],[60,0,64],[0,20,90]]){const q=tx.createRadialGradient(x+dx*s,y+dy*s,r*s*0.3,x+dx*s,y+dy*s,r*s);q.addColorStop(0,"rgba(0,0,0,0.95)");q.addColorStop(1,"rgba(0,0,0,0)");
      tx.fillStyle=q;tx.fillRect(x+dx*s-r*s,y+dy*s-r*s,r*s*2,r*s*2);}}
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.drawImage(t,0,0);if(o.sun){wc_glowAt(ctx,o.sun[0],o.sun[1],120,[255,226,150],0.7);}ctx.restore();}
function wc_land(ctx,f,col,depth,o){const pts=[];for(let x=-60;x<=W+60;x+=10)pts.push([x,f(x)]);pts.push([W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,Object.assign({depth,kind:"land"},o||{}));return pts;}
function wc_forest(ctx,base,col,depth,seed,o){o=o||{};const R=wc_rng(seed),pts=[];let x=-60;const hmax=o.h||24,wmax=o.w||16;
  while(x<=W+60){const by=base(x),h=hmax*(0.45+R()*0.55),w=wmax*(0.6+R()*0.5);pts.push([x,by]);pts.push([x+w*0.5,by-h]);pts.push([x+w,by]);x+=w*(0.55+R()*0.4);}
  pts.push([W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,{depth,kind:"forest",line:false});}
function wc_lake(ctx,y0,x1,depth){const pts=[];for(let x=-60;x<=x1;x+=10)pts.push([x,y0+3*Math.sin(x/90)]);pts.push([x1+40,y0+6],[x1+40,y0+80],[-60,y0+80]);wc_wash(ctx,pts,WCP.water,{depth,kind:"water",line:false});}
function wc_fieldStrips(ctx,f,y0,y1,n,cols,depth,seed){const R=wc_rng(seed||3);let prev=x=>f(x)+y0;for(let i=1;i<=n;i++){const t=i/n,off=lerp(y0,y1,t*t),skew=(R()-0.5)*0.05,cur=x=>f(x)+off+(x-960)*skew;
  const pts=[];for(let x=-60;x<=W+60;x+=16)pts.push([x,prev(x)]);for(let x=W+60;x>=-60;x-=16)pts.push([x,cur(x)]);wc_wash(ctx,pts,cols[i%cols.length],{depth,kind:"field",line:false});prev=cur;}}
// tufts of grass in the near meadow
function wc_tufts(ctx,f,x0,x1,n,depth,seed){const R=wc_rng(seed||8);for(let i=0;i<n;i++){const x=lerp(x0,x1,R()),y=f(x)+20+R()*(H-f(x)-20),s=0.7+R()*0.8*((y-700)/380);
  ctx.save();ctx.strokeStyle=rgba(wc_haze(wc_dim(WCP.near,0.22),depth),0.85);ctx.lineWidth=2.2*s;ctx.lineCap="round";ctx.beginPath();
  for(const a of [-0.5,-0.15,0.2,0.55]){ctx.moveTo(x,y);ctx.quadraticCurveTo(x+a*10*s,y-12*s,x+a*22*s,y-(18+R()*10)*s);}ctx.stroke();ctx.restore();}}
// a soft shadow where something meets the ground
function wc_contact(ctx,x0,x1,y,depth,a){ctx.save();const cx=(x0+x1)/2,rx=(x1-x0)/2*1.08,g=ctx.createRadialGradient(cx,y,1,cx,y,rx);g.addColorStop(0,rgba([110,100,90],(a||0.28)*(0.4+0.6*depth)));
  g.addColorStop(1,rgba([110,100,90],0));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,y,rx,Math.max(6,rx*0.09),0,0,TAU);ctx.fill();ctx.restore();}

/* ---------- trees ---------- */
function wc_spruce(ctx,x,y,h,depth,col){col=col||WCP.pine;const w=h*0.44,tiers=5,L=[],R=[];
  for(let i=0;i<tiers;i++){const t=i/tiers,yy=y-h*0.08-t*h*0.86,hw=w*(1-t)*0.5+2,nx=y-h*0.08-(i+1)/tiers*h*0.86+h*0.06;L.push([x-hw,yy],[x-hw*0.42,nx]);R.unshift([x+hw*0.42,nx],[x+hw,yy]);}
  wc_wash(ctx,wc_rect(x-h*0.03,y-h*0.1,h*0.06,h*0.1),WCP.trunk,{depth,kind:"trunk",line:false});
  wc_wash(ctx,[[x-w*0.08,y-h*0.08]].concat(L,[[x,y-h]],R,[[x+w*0.08,y-h*0.08]]),col,{depth,kind:"tree"});}
function wc_birch(ctx,x,y,h,depth,lean){lean=lean||0;const top=[x+lean*h,y-h*0.82];
  wc_wash(ctx,[[x-h*0.026,y],[top[0]-h*0.01,top[1]],[top[0]+h*0.01,top[1]],[x+h*0.026,y]],WCP.bark,{depth,kind:"trunk",lw:1.5});
  const R=wc_rng(Math.round(x));for(let i=0;i<7;i++){const t=0.1+R()*0.75,cx=lerp(x,top[0],t),cy=lerp(y,top[1],t),ww=h*0.02*(1-t*0.5);
    wc_wash(ctx,[[cx-ww,cy],[cx+ww*0.6,cy-2],[cx+ww,cy+3],[cx-ww*0.4,cy+4]],WCP.barkMark,{depth,kind:"mark",line:false,flat:true});}
  const Q=wc_rng(Math.round(x*3+y)),parts=[];for(let i=0;i<9;i++){const a=Q()*TAU,r=Q()*h*0.17;parts.push(wc_ell(top[0]+Math.cos(a)*r*1.1,top[1]+h*0.12+Math.sin(a)*r*1.3,h*(0.1+Q()*0.06),h*(0.13+Q()*0.07),20));}
  wc_wash(ctx,parts,WCP.birchLeaf,{depth,kind:"tree"});}
function wc_roundTree(ctx,x,y,h,depth,col){col=col||WCP.leaf;wc_wash(ctx,[[x-h*0.04,y],[x-h*0.025,y-h*0.5],[x+h*0.025,y-h*0.5],[x+h*0.04,y]],WCP.trunk,{depth,kind:"trunk"});
  const R=wc_rng(Math.round(x*7+h)),parts=[wc_ell(x,y-h*0.62,h*0.3,h*0.26,30)];for(let i=0;i<6;i++){const a=R()*TAU;parts.push(wc_ell(x+Math.cos(a)*h*0.17,y-h*0.64+Math.sin(a)*h*0.15,h*(0.15+R()*0.07),h*(0.14+R()*0.06),24));}
  wc_wash(ctx,parts,col,{depth,kind:"tree"});}
function wc_treeRow(ctx,f,x0,x1,step,h,depth,seed,col){const R=wc_rng(seed||5);for(let x=x0;x<x1;x+=step*(0.6+R()*0.8)){const hh=h*(0.7+R()*0.5);if(R()<0.35)wc_spruce(ctx,x,f(x)+3,hh*1.3,depth);else wc_roundTree(ctx,x,f(x)+3,hh,depth,col);}}

/* ---------- buildings ---------- */
function wc_part(ctx,pts,col,depth,o){wc_wash(ctx,pts,col,Object.assign({depth,kind:"build"},o||{}));}
function wc_flat(ctx,pts,col,depth,kind){wc_wash(ctx,pts,col,{depth,kind:kind||"trim",line:false,flat:true});}
function wc_bars(ctx,x,y,w,h,col,lw,depth){ctx.save();ctx.strokeStyle=rgba(wc_haze(col,depth),0.95);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h);ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2);ctx.stroke();ctx.restore();}
// a Swedish country church: west tower and spire, steep nave roof, a lower chancel
function wc_church(ctx,x,y,k,depth){const P=WCP,tw=66*k,nw=196*k,cw=58*k;
  wc_part(ctx,wc_rect(x+tw+nw,y-64*k,cw,64*k),P.wall,depth);wc_part(ctx,[[x+tw+nw-4*k,y-64*k],[x+tw+nw+cw+8*k,y-64*k],[x+tw+nw+cw-10*k,y-108*k],[x+tw+nw+6*k,y-108*k]],P.roofDark,depth);
  wc_part(ctx,wc_rect(x+tw,y-82*k,nw,82*k),P.wall,depth);wc_part(ctx,[[x+tw-6*k,y-82*k],[x+tw+nw+10*k,y-82*k],[x+tw+nw-22*k,y-152*k],[x+tw+12*k,y-152*k]],P.roofDark,depth);
  for(let i=0;i<3;i++)wc_flat(ctx,wc_arched(x+tw+40*k+i*56*k,y-66*k,18*k,40*k),P.pane,depth,"window");
  wc_part(ctx,wc_rect(x,y-150*k,tw,150*k),P.wall,depth);wc_part(ctx,[[x-5*k,y-150*k],[x+tw+5*k,y-150*k],[x+tw/2+4*k,y-272*k],[x+tw/2-4*k,y-272*k]],P.spire,depth);
  wc_wash(ctx,wc_arched(x+tw/2-14*k,y-50*k,28*k,50*k),P.door,{depth,kind:"door",lw:1.5});wc_flat(ctx,wc_arched(x+tw/2-7*k,y-126*k,14*k,24*k),P.pane,depth,"window");
  wc_flat(ctx,wc_rect(x+tw/2-1.8*k,y-298*k,3.6*k,30*k),P.spire,depth,"cross");wc_flat(ctx,wc_rect(x+tw/2-9*k,y-290*k,18*k,3.4*k),P.spire,depth,"cross");}
// a falu-red farmhouse, long side to us, white corners and window frames
function wc_farmhouse(ctx,x,y,k,depth){const P=WCP,w=200*k,hw=78*k;
  wc_part(ctx,wc_rect(x+138*k,y-114*k,16*k,40*k),P.trim,depth);wc_part(ctx,[[x-10*k,y-hw],[x+w+10*k,y-hw],[x+w-28*k,y-hw-64*k],[x+28*k,y-hw-64*k]],P.roof,depth);
  wc_part(ctx,wc_rect(x,y-hw,w,hw),P.falu,depth);wc_flat(ctx,wc_rect(x,y-hw,7*k,hw),P.trim,depth);wc_flat(ctx,wc_rect(x+w-7*k,y-hw,7*k,hw),P.trim,depth);
  for(const wx of [24,66,152]){wc_flat(ctx,wc_rect(x+wx*k,y-62*k,28*k,32*k),P.trim,depth);wc_flat(ctx,wc_rect(x+wx*k+4*k,y-58*k,20*k,24*k),P.pane,depth,"window");wc_bars(ctx,x+wx*k+4*k,y-58*k,20*k,24*k,P.trim,2*k,depth);}
  wc_flat(ctx,wc_rect(x+104*k,y-56*k,32*k,56*k),P.trim,depth);wc_wash(ctx,wc_rect(x+108*k,y-52*k,24*k,52*k),P.farmDoor,{depth,kind:"door",line:false});
  wc_flat(ctx,wc_rect(x-2*k,y-6*k,w+4*k,8*k),P.stoneGrey,depth,"base");}
// Uppsala's cathedral, far off: two west towers with tall copper spires
function wc_cathedral(ctx,x,y,k,depth){const P=WCP;wc_part(ctx,wc_rect(x+70*k,y-60*k,150*k,60*k),P.brick,depth);wc_part(ctx,[[x+66*k,y-60*k],[x+224*k,y-60*k],[x+210*k,y-92*k],[x+80*k,y-92*k]],P.copper,depth);
  for(const tx of [0,44]){wc_part(ctx,wc_rect(x+tx*k,y-118*k,30*k,118*k),P.brick,depth);wc_part(ctx,[[x+tx*k-2*k,y-118*k],[x+tx*k+32*k,y-118*k],[x+tx*k+16*k,y-210*k]],P.copper,depth);}
  wc_part(ctx,wc_rect(x+30*k,y-96*k,14*k,96*k),P.brick,depth);}
// the university's old building: a sandstone front, two rows of arched windows, and a clock tower
function wc_quad(ctx,x,y,depth,k){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const P=WCP,w=980,top=-300;
  wc_part(ctx,[[30,top-8],[w-30,top-8],[w-90,top-46],[90,top-46]],P.slate,depth);wc_part(ctx,wc_rect(0,top,w,300),P.stone,depth);
  wc_wash(ctx,wc_rect(-10,top-12,w+20,20),wc_lit(P.stone,0.12),{depth,kind:"trim",lw:2});wc_flat(ctx,wc_rect(-6,-150,w+12,10),wc_dim(P.stone,0.06),depth);
  for(const row of [0,1])for(let i=0;i<8;i++){const wx=44+i*120+(i>=4?40:0),wy=top+48+row*150;if(wx>380&&wx<600)continue;wc_wash(ctx,wc_arched(wx,wy,48,84),P.pane,{depth,kind:"window",lw:2});}
  const tx=410,tw=160;wc_part(ctx,wc_rect(tx,-440,tw,440),wc_lit(P.stone,0.04),depth);wc_part(ctx,[[tx-12,-440],[tx+tw+12,-440],[tx+tw/2+8,-560],[tx+tw/2-8,-560]],P.slate,depth);
  wc_flat(ctx,wc_rect(tx+tw/2-3,-596,6,40),P.slate,depth,"cross");wc_wash(ctx,wc_ell(tx+tw/2,-372,40,40,40),P.clock,{depth,kind:"clock",lw:2.5});
  ctx.strokeStyle=rgba(WC_INK,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(tx+tw/2,-372);ctx.lineTo(tx+tw/2,-400);ctx.moveTo(tx+tw/2,-372);ctx.lineTo(tx+tw/2+20,-366);ctx.stroke();
  wc_wash(ctx,wc_arched(tx+tw/2-44,-150,88,150),P.door,{depth,kind:"door",lw:2});wc_flat(ctx,wc_rect(tx-14,-10,tw+28,12),wc_lit(P.stone,0.1),depth);ctx.restore();}
function wc_glassWing(ctx,x,y,w,h,depth){const P=WCP;wc_part(ctx,wc_rect(x,y-h,w,h),P.glass,depth,{kind:"glass"});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.glass,0.35),0.7);ctx.lineWidth=3;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(x+i*w/5,y-h);ctx.lineTo(x+i*w/5,y);ctx.stroke();}
  for(let j=1;j<4;j++){ctx.beginPath();ctx.moveTo(x,y-h+j*h/4);ctx.lineTo(x+w,y-h+j*h/4);ctx.stroke();}ctx.restore();wc_wash(ctx,wc_rect(x-8,y-h-14,w+16,16),P.concrete,{depth,kind:"trim",lw:2});}
// a terraced house, long side to the street
function wc_terrace(ctx,x,y,w,col,depth,o){o=o||{};const k=o.k||1,P=WCP,top=-230;ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  wc_part(ctx,wc_rect(w*0.68,top-112,22,60),P.chimney,depth);wc_part(ctx,[[-6,top],[w+6,top],[w-40,top-80],[40,top-80]],P.tile,depth);wc_part(ctx,wc_rect(0,top,w,230),col,depth);
  for(const [wx,wy] of [[28,40],[w-80,40],[28,140]]){wc_flat(ctx,wc_rect(wx-5,top+wy-5,62,74),P.trim,depth);wc_wash(ctx,wc_rect(wx,top+wy,52,64),P.pane,{depth,kind:"window",line:false});wc_bars(ctx,wx,top+wy,52,64,P.trim,3,depth);}
  wc_wash(ctx,wc_rect(w-86,top+124,62,106),o.door||P.door,{depth,kind:"door",lw:2});wc_flat(ctx,wc_rect(w-64,top+170,20,5),P.trim,depth,"slot");ctx.restore();}
function wc_skyline(ctx,base,col,depth,seed){const R=wc_rng(seed),pts=[[-60,base]];let x=-60;while(x<W+60){const w=60+R()*120,h=50+R()*150;pts.push([x,base-h],[x+w,base-h]);x+=w;
  if(R()<0.3){pts.push([x,base-h-30-R()*40],[x+14,base-h-30-R()*40]);x+=14;}}pts.push([W+60,base],[W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,{depth,kind:"skyline",line:false});}
function wc_lamp(ctx,x,y,h,depth){const P=WCP;wc_wash(ctx,wc_rect(x-5,y-h,10,h),P.iron,{depth,kind:"iron",lw:1.5});wc_wash(ctx,[[x-24,y-h-6],[x+24,y-h-6],[x+16,y-h-44],[x-16,y-h-44]],P.iron,{depth,kind:"iron",lw:1.5});
  wc_flat(ctx,wc_rect(x-14,y-h-38,28,28),P.lampGlow,depth,"lampglass");}
// the family's letterbox, on a post
function wc_mailbox(ctx,x,y,depth){const P=WCP;wc_wash(ctx,wc_rect(x-7,y-150,14,150),P.iron,{depth,kind:"iron",lw:2});
  wc_part(ctx,[[x-48,y-150],[x+48,y-150],[x+48,y-206],[x+36,y-222],[x-36,y-222],[x-48,y-206]],P.mailbox,depth);wc_flat(ctx,wc_rect(x-30,y-196,60,8),wc_dim(P.mailbox,0.4),depth,"slot");}
// a Swedish roundpole fence: pairs of posts, and thin poles laid on the slant
function wc_fence(ctx,f,x0,x1,depth){const P=WCP;for(let x=x0;x<x1;x+=120){const y=f(x);for(const dx of [-4,4])wc_wash(ctx,wc_rect(x+dx-2.5,y-56,5,62),wc_dim(P.wood,0.15),{depth,kind:"post",lw:1.2});}
  for(let x=x0;x<x1;x+=19){const y=f(x);wc_wash(ctx,[[x-2,y-46],[x+3,y-48],[x+46,y-6],[x+41,y-4]],(Math.round(x/19)%3)?P.wood:wc_lit(P.wood,0.12),{depth,kind:"pole",lw:1});}}
// a small figure, for the past: a walker in a coat and hat, carrying a paper in the household ribbon's teal
function wc_walker(ctx,x,y,h,cloth,depth,o){o=o||{};const k=h/100,P=WCP;
  wc_wash(ctx,[[x-6*k,y-46*k],[x-14*k,y],[x-8*k,y],[x+1*k,y-36*k]],wc_dim(cloth,0.35),{depth,kind:"limb",lw:1.2});wc_wash(ctx,[[x+4*k,y-46*k],[x+16*k,y-2*k],[x+10*k,y],[x-3*k,y-38*k]],wc_dim(cloth,0.3),{depth,kind:"limb",lw:1.2});
  wc_wash(ctx,[[x-14*k,y-80*k],[x+12*k,y-80*k],[x+16*k,y-40*k],[x-16*k,y-40*k]],cloth,{depth,kind:"coat",lw:1.4});wc_wash(ctx,wc_ell(x,y-90*k,9*k,10*k,18),P.skinTiny,{depth,kind:"head",lw:1.2});
  wc_wash(ctx,[[x-13*k,y-96*k],[x+13*k,y-96*k],[x+9*k,y-104*k],[x-9*k,y-104*k]],P.hat,{depth,kind:"hat",lw:1.2});
  if(o.paper){wc_wash(ctx,[[x+12*k,y-70*k],[x+34*k,y-74*k],[x+36*k,y-58*k],[x+14*k,y-54*k]],P.parchment,{depth,kind:"paper",lw:1.2,flat:true});wc_flat(ctx,wc_rect(x+22*k,y-73*k,4*k,18*k),WC_ROLE.student,1,"ribbon");}
  wc_wash(ctx,[[x+8*k,y-78*k],[x+20*k,y-60*k],[x+15*k,y-56*k],[x+4*k,y-70*k]],cloth,{depth,kind:"arm",lw:1.2});}

/* ---------- what is kept ---------- */
// a picture painted once, by paint(ctx) on a w×h canvas (default the frame), and kept: every background, and anything still
function wc_kept(key,w,h,paint){let c=WC.bg[key];if(c)return c;wc_prep();c=WC.bg[key]=mkCanvas(w||W,h||H);const x=c.getContext("2d");paint(x);return c;}
// the paper's tooth, and a soft darkening at the corners, over the whole frame: the last thing every scene draws, in the frame's own space
function wc_paperOver(ctx,S){setScreen(ctx,S);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation="multiply";ctx.drawImage(WC.paper,0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
// the film opens out of the paper, and each chapter's first moment
function wc_fadeIn(ctx,S,t,d){d=d||1.2;if(t<d){setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,1-ease(t/d));ctx.fillRect(0,0,W,H);}}
// a veil of paper over the scene, for the title and end cards
function wc_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,clamp(a,0,1));ctx.fillRect(0,0,W,H);}

/* ---------- text ---------- */
// text in ink; size at least 28, as everywhere in the films
function wc_T(ctx,s,x,y,o){o=Object.assign({},o||{});if(!o.color)o.color=rgba(o.col||WC_INK,o.a==null?1:o.a);T(ctx,s,x,y,o);}
// handwriting: the same face, leaning, as a pen writes; p reveals it letter by letter
function wc_hand(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;const n=Math.ceil(s.length*clamp(p,0,1)),sub=s.slice(0,n);ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.2,1,0,0);
  wc_T(ctx,sub,0,0,{size:o.size||32,w:o.w||600,col:o.col||WCP.parchInk,align:o.align,a:o.a});ctx.restore();}

/* ---------- cards, chips, tags: paper, painted once, with the text drawn every frame ---------- */
// the paper of a card, a chip, a tag, a badge or an envelope: a pale card with a pencil edge; a chip is washed in its role's colour, a
// card wears its role's colour as a brushstroke behind its title (o.sw wide), and a role that hasn't started yet is dashed in its colour
function wc_panelPaint(x,w,h,o){const r=o.kind==="card"||o.kind==="sheet"?12:o.kind==="envelope"?4:h/2,pad=8;
  x.translate(pad,pad);wc_tr(x,wc_rrPts(0,0,w,h,r));x.fillStyle=rgba(o.fill||WC_CARD,o.dashed?0.92:0.95);x.fill();
  if(o.kind==="chip"&&!o.dashed&&o.role)wc_wash(x,wc_resample(wc_rect(4,4,w-8,h-8),10),mix(o.role,[255,255,255],0.2),{kind:"chipwash",line:false,a:0.74,seed:o.seed});
  if(o.kind==="card"&&o.role&&!o.dashed&&o.sw)wc_wash(x,wc_resample(wc_rect(16,o.sy||14,Math.min(w-30,o.sw),o.sh||46),10),o.role,{kind:"swatch",line:false,a:0.58,seed:o.seed});
  if(o.kind==="badge")wc_wash(x,wc_resample(wc_rect(2,2,w-4,h-4),8),o.role||WC_BADGE,{kind:"swatch",line:false,a:0.6,seed:o.seed});
  if(o.wash)wc_wash(x,wc_resample(wc_rect(6,6,w-12,h-12),10),o.wash,{kind:"chipwash",line:false,a:o.washA||0.3,seed:o.seed});
  if(o.dashed){x.save();wc_tr(x,wc_rrPts(2,2,w-4,h-4,r));x.setLineDash([10,9]);x.lineWidth=2.5;x.strokeStyle=rgba(o.role||WC_PENCIL,0.95);x.stroke();x.restore();}
  else wc_ink(x,wc_rrPts(0,0,w,h,Math.min(r,6)),true,o.kind==="tag"||o.kind==="badge"?1.5:2,WC_PENCIL,0.85,o.seed||Math.round(w+h),0.9);}
const WC_SC=2; // cards are kept at twice the frame's resolution, so they stay sharp when the camera moves in
function wc_panel(ctx,x,y,w,h,o){o=o||{};w=Math.round(w);h=Math.round(h);const key=[o.kind,w,h,o.role,o.dashed?1:0,o.sw|0,o.sy|0,o.sh|0,o.wash,o.washA,o.fill,o.seed|0].join("|");let c=WC.card[key];
  if(!c){wc_prep();c=WC.card[key]=mkCanvas((w+16)*WC_SC,(h+16)*WC_SC);const cx=c.getContext("2d");cx.scale(WC_SC,WC_SC);wc_panelPaint(cx,w,h,o);}
  ctx.drawImage(c,x-8,y-8,w+16,h+16);}
// a label: the paper tag, its text at 28 px or more; y is its middle; returns its width
function wc_tag(ctx,x,y,s,o){o=o||{};const size=o.size||30,wt=o.w||700,w=Math.round(tw(ctx,s,size,wt,o.f)+40),h=Math.round(size+22),x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  wc_panel(ctx,x0,y-h/2,w,h,{kind:"tag",role:o.role,wash:o.wash,washA:o.washA,seed:o.seed});wc_T(ctx,s,x0+20,y+size*0.36,{w:wt,size,f:o.f,col:o.col||WC_INK});return w;}
// the year and the place, in the top corner
function wc_year(ctx,x,y,s,a){if(a==null)a=1;if(a<=0.01)return;withA(ctx,a,()=>{const w=Math.round(tw(ctx,s,30,500,"mono")+76),h=56;wc_panel(ctx,x,y-h/2,w,h,{kind:"pill"});
  ctx.fillStyle=rgba(WC_ROLE.platform,1);ctx.beginPath();ctx.arc(x+30,y,6.5,0,TAU);ctx.fill();wc_T(ctx,s,x+50,y+11,{w:500,size:30,f:"mono"});});}
// a badge: a short word on a yellow wash, such as "family" or "shared"
function wc_badge(ctx,x,y,s,o){o=o||{};const size=o.size||28,w=Math.round(tw(ctx,s,size,700)+28),h=42;wc_panel(ctx,x,y-h/2,w,h,{kind:"badge",role:o.role,seed:o.seed});
  wc_T(ctx,s,x+w/2,y+size*0.36,{w:700,size,align:"center",col:WC_DARK});return w;}
// a record as one system holds it: the role, the system's own key, and the email it has on file (marked "family" while it's the shared one)
function wc_roleCard(ctx,x,y,w,h,role,title,id,email,o){o=o||{};const col=WC_ROLE[role],tW=tw(ctx,title,30,800);
  wc_panel(ctx,x,y,w,h,{kind:"card",role:col,dashed:o.dashed,sw:tW+36,seed:o.seed});const lx=x+32;
  wc_T(ctx,title,lx,y+48,{w:800,size:30,col:o.dashed?WC_INK:WC_DARK});if(id)wc_T(ctx,id,x+w-24,y+48,{w:500,size:28,f:"mono",align:"right"});
  if(email){const ok=o.fresh,s=(ok?"✓ ":"")+email;wc_T(ctx,s,lx,y+96,{w:500,size:28,f:"mono",col:ok?WC_ROLEINK.student:WC_MUTED,a:o.ea==null?1:o.ea});
    if(!ok&&o.badge!==false){const bw=tw(ctx,s,28,500,"mono");withA(ctx,o.ba==null?1:o.ba,()=>wc_badge(ctx,lx+bw+12,y+87,"family"));}}
  else if(o.note)wc_T(ctx,o.note,lx,y+96,{w:600,size:28,col:WC_MUTED});}
// a role, dated: a chip in the role's wash, with its name and its dates
function wc_chip(ctx,x,y,w,h,role,label,sub,o){o=o||{};const col=WC_ROLE[role]||role;wc_panel(ctx,x,y,w,h,{kind:"chip",role:col,dashed:o.dashed,seed:o.seed});
  const lw=tw(ctx,label,30,800);wc_T(ctx,label,x+28,y+h/2+11,{w:800,size:30,col:WC_DARK});if(sub)wc_T(ctx," · "+sub,x+28+lw,y+h/2+10,{w:600,size:28,col:WC_DARK,a:0.88});}
// a contact point or an identifier: a big line, mono, and what it is under it
function wc_info(ctx,x,y,w,h,big,small,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",seed:o.seed,wash:o.wash,washA:o.washA});const lx=x+30;
  wc_T(ctx,big,lx,y+50,{w:o.mono===false?700:500,size:o.bigSize||30,f:o.mono===false?"sans":"mono",col:WC_DARK});wc_T(ctx,small,lx,y+96,{w:600,size:28,col:WC_MUTED});
  if(o.badge){const bw=tw(ctx,small,28,600);withA(ctx,o.ba==null?1:o.ba,()=>wc_badge(ctx,lx+bw+14,y+87,o.badge));}}
// a lane's name, and what it holds
function wc_laneHead(ctx,x,y,t,sub,o){o=o||{};const w=tw(ctx,t,36,800);wc_T(ctx,t,x,y,{w:800,size:36,col:WC_DARK});if(sub)wc_T(ctx,sub,x+w+20,y,{w:600,size:28,col:WC_MUTED});}
// an envelope; with o.label, a tag under it
function wc_envelope(ctx,x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);const w=Math.round(120*s),h=Math.round(80*s);wc_panel(ctx,-w/2,-h/2,w,h,{kind:"envelope"});
  ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-w/2+6,-h/2+6);ctx.lineTo(0,h*0.08);ctx.lineTo(w/2-6,-h/2+6);ctx.stroke();ctx.restore();}
// a dotted pencil line from one thing to another, leaving and arriving level (o.vertical: upright), drawn on as p goes from 0 to 1; returns its tip
function wc_link(ctx,x0,y0,x1,y1,col,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return null;const c1=o.vertical?[x0,(y0+y1)/2]:[(x0+x1)/2,y0],c2=o.vertical?[x1,(y0+y1)/2]:[(x0+x1)/2,y1],pts=[];
  for(let i=0;i<=24;i++){const t=i/24,u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;pts.push([a*x0+b*c1[0]+c*c2[0]+d*x1,a*y0+b*c1[1]+c*c2[1]+d*y1]);}
  const n=Math.max(2,Math.round(pts.length*clamp(p,0,1)));ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,o.a==null?0.7:o.a);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.setLineDash(o.dash||[2,11]);
  ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();ctx.restore();return pts[n-1];}
// a tick, drawn in pencil as p goes from 0 to 1
function wc_tick(ctx,x,y,s,col,p,lw){p=p==null?1:p;if(p<=0)return;const a=[x-s*0.42,y],b=[x-s*0.1,y+s*0.32],c=[x+s*0.46,y-s*0.38],l1=Math.hypot(b[0]-a[0],b[1]-a[1]),l2=Math.hypot(c[0]-b[0],c[1]-b[1]),L=(l1+l2)*clamp(p,0,1);
  ctx.save();ctx.strokeStyle=rgba(col||WC_ROLEINK.alumna,1);ctx.lineWidth=lw||Math.max(3,s*0.15);ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);
  if(L<=l1)ctx.lineTo(lerp(a[0],b[0],L/l1),lerp(a[1],b[1],L/l1));else{ctx.lineTo(b[0],b[1]);ctx.lineTo(lerp(b[0],c[0],(L-l1)/l2),lerp(b[1],c[1],(L-l1)/l2));}ctx.stroke();ctx.restore();}
// a cross, the same way
function wc_cross(ctx,x,y,s,col,p){p=p==null?1:p;if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(col||WC_ROLEINK.customer,1);ctx.lineWidth=Math.max(3,s*0.15);ctx.lineCap="round";
  const q=clamp(p*2,0,1),r=clamp(p*2-1,0,1);ctx.beginPath();ctx.moveTo(x-s*0.35,y-s*0.35);ctx.lineTo(lerp(x-s*0.35,x+s*0.35,q),lerp(y-s*0.35,y+s*0.35,q));
  if(r>0){ctx.moveTo(x+s*0.35,y-s*0.35);ctx.lineTo(lerp(x+s*0.35,x-s*0.35,r),lerp(y-s*0.35,y+s*0.35,r));}ctx.stroke();ctx.restore();}
// a pencil circle round something, drawn on: a loop that overshoots its start, as a hand draws one
function wc_ring(ctx,cx,cy,rx,ry,p,o){o=o||{};if(p<=0)return;const pts=[];for(let i=0;i<=60;i++){const u=i/60,a=-2.2+u*TAU*1.08,r=1+0.05*Math.sin(u*9)+0.04*u;pts.push([cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r]);}
  wc_pencil(ctx,pts,p,{col:o.col||WC_PENCIL,lw:o.lw||3.4,a:o.a==null?0.92:o.a,seed:o.seed||9,amp:1.4});}

/* ---------- the person, as the master record ---------- */
// the person cleared to white paper in a pencil line, gathering her roles' colours as bands; kept once per person and size. bands: [{col,
// dashed, a}] from the shoulders down; each band's a (0..1) lets it arrive, and o.a fades the whole figure
function wc_whiteFig(id,s){const key=id+"|"+s;if(WC.fig[key])return WC.fig[key];const P=PEOPLE[id],k=s*P.build.h,pad=44,w=Math.ceil(500*k+pad*2),h=Math.ceil(660*k+pad*2),fy=pad+650*k;
  const fig=mkCanvas(w,h),fx=fig.getContext("2d");WC_RAW=true;try{person(fx,id,w/2,fy,s,{pose:"ease",t:1.2});}finally{WC_RAW=false;}
  const M=mkCanvas(w,h),mx=M.getContext("2d");mx.drawImage(fig,0,0);mx.globalCompositeOperation="source-in";mx.fillStyle="#fff";mx.fillRect(0,0,w,h);
  const G=mkCanvas(w,h),gx=G.getContext("2d");gx.fillStyle="rgba(255,255,255,0.72)";gx.fillRect(0,0,w,h);gx.globalAlpha=0.2;gx.drawImage(fig,0,0);gx.globalAlpha=1;
  gx.globalCompositeOperation="destination-in";gx.drawImage(M,0,0);
  // the pencil line: the silhouette grown a little in pencil, less the silhouette
  const D=mkCanvas(w,h),dx=D.getContext("2d"),Tn=mkCanvas(w,h),tx=Tn.getContext("2d");tx.drawImage(M,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(WC_PENCIL,1);tx.fillRect(0,0,w,h);
  for(let i=0;i<24;i++){const a=i/24*TAU;dx.drawImage(Tn,Math.cos(a)*1.8,Math.sin(a)*1.8);}dx.drawImage(Tn,0,0);dx.globalCompositeOperation="destination-out";dx.drawImage(M,0,0);
  return WC.fig[key]={w,h,fy,k,M,G,D};}
function wc_white(ctx,id,x,y,s,bands,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const F=wc_whiteFig(id,s),ox=x-F.w/2,oy=y-F.fy;
  withA(ctx,a,()=>{if(o.shadow!==false){ctx.save();const tg=ctx.createRadialGradient(x,y-4,4,x,y-4,110*F.k);tg.addColorStop(0,rgba([90,80,96],0.14));tg.addColorStop(1,rgba([90,80,96],0));ctx.fillStyle=tg;
      ctx.beginPath();ctx.ellipse(x,y-4,110*F.k,18*F.k,0,0,TAU);ctx.fill();ctx.restore();}
    ctx.save();ctx.globalAlpha*=0.85;ctx.drawImage(F.D,ox,oy);ctx.restore();ctx.drawImage(F.G,ox,oy);
    if(bands&&bands.length){const [bc,bx]=wc_buf("bands",F.w,F.h),by0=F.fy-436*F.k;bands.forEach((b,i)=>{const ba=(b.a==null?1:b.a);if(ba<=0.01)return;
        bx.fillStyle=rgba(b.col,(b.dashed?0.4:1)*0.72*ba);const yy=by0+(b.i==null?i:b.i)*64*F.k;bx.fillRect(0,yy,F.w,42*F.k);});
      bx.globalCompositeOperation="destination-in";bx.drawImage(F.M,0,0);ctx.drawImage(bc,ox,oy);}});}
// the middle of band i on the figure, for lines that run to it
function wc_bandY(id,s,y,i){const k=s*PEOPLE[id].build.h;return y-650*k+(650-436)*k+i*64*k+21*k;}

/* ---------- title and end cards ---------- */
const WC_SERIES="The same one, everywhere";
// five strokes of the role colours, the series' mark
function wc_mark(ctx,cx,cy,w,p,a){if(a<=0.01)return;const cols=["student","platform","customer","tutor","alumna"],n=cols.length,sw=w/n;withA(ctx,a,()=>{cols.forEach((r,i)=>{const q=clamp(p*n*0.8-i*0.6,0,1);if(q<=0)return;
  const x=cx-w/2+i*sw,c=wc_kept("mark"+i,Math.round(sw+24),40,x2=>{wc_prep();wc_wash(x2,wc_resample(wc_rect(6,6,sw+10,26),8),WC_ROLE[r],{kind:"swatch",line:false,a:0.85,seed:31+i*7});});
  ctx.save();ctx.beginPath();ctx.rect(x-4,cy-30,(sw+30)*ease(q),60);ctx.clip();ctx.drawImage(c,x-6,cy-20);ctx.restore();});});}
function wc_title(ctx,S,t,t0,title,sub,line){const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{wc_T(ctx,WC_SERIES.toUpperCase(),960,400,{w:800,size:30,align:"center",col:WC_MUTED});wc_T(ctx,title,960,510,{w:800,size:92,align:"center",col:WC_DARK});
    wc_mark(ctx,960,572,520,(t-t0-0.6)/1.2,1);if(sub)wc_T(ctx,sub,960,664,{w:600,size:36,align:"center",col:WC_MUTED});
    withA(ctx,fin(t,t0+1.2,0.8),()=>wc_tag(ctx,960,750,line,{align:"center",size:28,w:600}));});}
function wc_end(ctx,S,t,t0,title,line,n){const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)wc_T(ctx,line,960,420,{w:700,size:48,align:"center",col:WC_DARK});wc_mark(ctx,960,520,400,(t-t0-0.7)/1.0,1);wc_T(ctx,title,960,622,{w:800,size:44,align:"center",col:WC_DARK});
    wc_T(ctx,WC_SERIES+(n?" · "+n:"")+" · Learning Data",960,680,{w:600,size:28,align:"center",col:WC_MUTED});});}
