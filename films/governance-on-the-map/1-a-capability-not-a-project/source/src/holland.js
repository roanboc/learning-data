/* ===== A capability, not a project: Holland, what moves =====
   What happens on the land plan.js paints: a farmer cuts a channel from a pool to a ditch, and the wet land drains; the river breaks
   through the slumped stretch and floods the fields, the farms and the cattle; a farm in the flood, its family carrying the winter's
   grain up into the loft; three small pictures of a dike that's never finished; the gap mended; the water board gathered on the dike,
   each landowner's stretch staked out, and the board walking the dikes; the land kept, ploughed and safe; the charter of 1255; the same
   kind of land today; the storm of 1953, the barrier that came after, and the board's people on a dike today. Every name starts with
   cp_ or CP_. */

// the flood's water: the river's grey, muddied with clay
const CP_FLOOD=mix(CP.river,CP.clay,0.28);
/* ---------- the wet land drained ---------- */
// Near the camera on the wet land (CP_A), a pool lies on the field, and a farmer cuts a channel from it to the ditch at the left: the
// channel grows from the ditch as he digs (cut, 0 to 1); once it reaches the pool, the water runs along it, glinting, into the ditch,
// and the pool shrinks (drain, 0 to 1). CP_DR: the pool (X, Z, its half width and half depth), the channel's ends ([X, Z] each), its width
const CP_DR={pool:[1.2,15.2,2.4,1.2],a:[-5.1,12.3],b:[-1.1,14.6],w:0.42};
const cp_drainAt=u=>[lerp(CP_DR.a[0],CP_DR.b[0],u),lerp(CP_DR.a[1],CP_DR.b[1],u)];
function cp_drain(ctx,t,cut,drain){const D=CP_DR,P=cp_aP,p=cp_a,[px,pz,rx,rz]=D.pool,sh=1-0.85*clamp(drain,0,1);
  // the pool, shrinking as it runs away
  if(sh>0.02){const L=[];for(let i=0;i<28;i++){const a=i/28*TAU,r=1+0.1*Math.sin(2*a+1)+0.06*Math.sin(3*a+2);L.push([px+Math.cos(a)*rx*sh*r,0.01,pz+Math.sin(a)*rz*Math.sqrt(sh)*r]);}cp_pool(ctx,P(L),0.95,171);}
  // the channel, from the ditch to where he's dug: the spoil thrown up along its far side, clods of peat; its floor of wet peat seen
  // between its lips, and its far side, a wall of dark peat (n points across it, away from us)
  const c=clamp(cut,0,1);if(c<=0.01)return;const n=18,dx=D.b[0]-D.a[0],dz=D.b[1]-D.a[1],l=Math.hypot(dx,dz),nx=-dz/l,nz=dx/l,
    edge=(s,y)=>{const o=[];for(let i=0;i<=n;i++){const [X,Z]=cp_drainAt(c*i/n);o.push([X+nx*D.w*s,y,Z+nz*D.w*s]);}return o;},band=(s0,y0,s1,y1)=>P([...edge(s0,y0),...edge(s1,y1).reverse()]);
  const R=wc_rng(173);for(let i=0;i<Math.floor(30*c);i++){const [X,Z]=cp_drainAt((i+0.5)/30),q=p(X+nx*D.w*1.9,0,Z+nz*D.w*1.9),kk=cp_aK(X,Z);
    const cx=q[0]+(R()-0.5)*kk*0.3,cy=q[1]-kk*0.03+(R()-0.5)*kk*0.06,rx=kk*(0.08+R()*0.14),ry=rx*(0.4+R()*0.25),L=[];for(let j=0;j<7;j++){const a=j/7*TAU,rr=0.75+R()*0.45;L.push([cx+Math.cos(a)*rx*rr,cy+Math.sin(a)*ry*rr]);}
    wc_wash(ctx,L,mix(wc_dim(CP.peat,R()*0.25),CP.sedge,0.12),{kind:"ground",line:false,depth:1,seed:180+i});}
  wc_flat(ctx,band(-1,0,1,-0.32),wc_dim(CP.peat,0.12),1,"cut");wc_flat(ctx,band(1,-0.32,1,0),CP.peatDk,1,"wall");
  // once it's through, the water: the sky's grey in it, and a little light running along it to the ditch
  const full=clamp((c-0.97)/0.03,0,1)*clamp(1-drain*0.6,0.35,1);if(full<=0.01)return;
  withA(ctx,full,()=>{const wp=band(-1,-0.1,1,-0.1);wc_flat(ctx,wp,mix(CP.river,CP.riverDk,0.3),1,"water");ctx.save();wc_tr(ctx,wp);ctx.clip();ctx.globalCompositeOperation="screen";
    ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineCap="round";ctx.lineWidth=Math.max(1.2,0.03*cp_aK(0,13));
    for(let i=0;i<6;i++){const u=1-((t*0.35+i/6)%1),s=i%2?0.3:-0.3,[X,Z]=cp_drainAt(u),[X2,Z2]=cp_drainAt(Math.max(0,u-0.05)),q=p(X+nx*D.w*s,-0.1,Z+nz*D.w*s),q2=p(X2+nx*D.w*s,-0.1,Z2+nz*D.w*s);
      ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q2[0],q2[1]);ctx.stroke();}ctx.restore();});}
// the farmer at the channel's end, the spade at his left (he's turned to face us), digging; he steps back along it as it grows
function cp_drainer(ctx,t,cut){const [X,Z]=cp_drainAt(clamp(cut,0,1)),ph=cut<0.99?cp_dig(t,1.5):0;
  cp_who(ctx,CP_A.C,"cpDig",X+0.62,0,Z-0.42,{pose:"cp_digDown",pose2:"cp_digUp",mix:ph,t,flip:true,wide:true,carry:cp_heldSpade({ground:-4,clod:clamp((ph-0.35)/0.4,0,1)})});}

/* ---------- the flood over the polder ---------- */
// The river through the breach (CP_A.breach) and over the land behind (the place polderBreach, painted without its things, which stand
// in the water here): the ditches fill first and overflow, then the water spreads from the gap over the fields towards us (f, 0 to 1),
// muddy, a line of foam at its front, the sky's grey in it; it pours through the gap in the crest, down the dike's slope (pour, 0 to 1)
const CP_FL={b:[22,78],R:100};
const cp_floodR=f=>CP_FL.R*easeCam(clamp(f,0,1));
// how deep the flood is at (X, Z), as f spreads it: up to 0.7 m, deepening behind its front
function cp_floodDepth(X,Z,f){const [bx,bz]=CP_FL.b,r=Math.hypot((X-bx)/1.25,Z-bz),R=cp_floodR(f);return R<=r?0:0.7*clamp((R-r)/10,0,1);}
function cp_flood(ctx,t,f,pour){const A=CP_A,P=cp_aP,p=cp_a,[bx,bz]=CP_FL.b,R=cp_floodR(f),T=A.toe;
  // the water coming through the gap: a tongue down the slope, foaming, from the crest's cut to the dike's foot
  if(pour>0.01){const hw=A.breach[1]*0.8,top=cp_aCrest(bx,1),L=[[bx-hw,top-0.1,A.crest[0]],[bx+hw,top-0.1,A.crest[0]],[bx+hw*1.6,0.2,T-1],[bx-hw*1.6,0.2,T-1]],pts=P(L);
    withA(ctx,clamp(pour*2,0,1),()=>{wc_flat(ctx,pts,mix(CP_FLOOD,CP.riverLt,0.15),0.8,"pour");ctx.save();wc_tr(ctx,pts);ctx.clip();ctx.strokeStyle="rgba(250,252,250,0.75)";ctx.lineCap="round";
      const R2=wc_rng(301);for(let i=0;i<40;i++){const u=R2(),v=((t*0.9+R2())%1),a=p(lerp(bx-hw,bx+hw,u),lerp(top,0.2,v),lerp(A.crest[0],T-1,v)),b2=p(lerp(bx-hw,bx+hw,u)+(u-0.5)*2,lerp(top,0.2,v+0.08),lerp(A.crest[0],T-1,v+0.08));
        ctx.lineWidth=1.2+R2()*2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.stroke();}ctx.restore();});}
  if(R<=0.5)return;
  // the ditches fill and overflow ahead of the front
  for(const X of A.ditch){const reach=cp_floodR(clamp(f+0.18,0,1))-Math.abs(X-bx)*0.8;if(reach<=1)continue;const z0=Math.max(1.2,bz-reach),pts=P([[X-0.95,0.04,bz-6],[X+0.95,0.04,bz-6],[X+0.95,0.04,z0],[X-0.95,0.04,z0]]);
    if(pts.length>2)wc_wash(ctx,pts,mix(CP_FLOOD,CP.river,0.3),{kind:"ground",line:false,depth:0.9,seed:(X+500)|0,a:0.9});}
  // the sheet of water: a half disc from the gap towards us, its edge a little ragged and moving
  const n=60,arc=[];for(let i=0;i<=n;i++){const th=i/n*Math.PI,wob=1+0.05*Math.sin(th*7+t*1.3)+0.04*Math.sin(th*13-t*2.1);arc.push([bx+Math.cos(th)*R*1.25*wob,0.05,bz-Math.sin(th)*R*wob]);}
  const L=[[bx+R*1.25,0.05,bz+0.6],...arc,[bx-R*1.25,0.05,bz+0.6]],pts=P(L);if(pts.length<3)return;
  cp_floodSheet(ctx,pts,t,cp_a,cp_aK,A.C.hz,305);
  // foam along its front
  ctx.save();ctx.strokeStyle=rgba(CP.foam,0.8);ctx.lineCap="round";for(let i=0;i<n;i++){const a=arc[i],b=arc[i+1];if(a[2]<1.6||b[2]<1.6)continue;const qa=p(a[0],a[1],a[2]),qb=p(b[0],b[1],b[2]);
    if(Math.max(qa[0],qb[0])<-20||Math.min(qa[0],qb[0])>W+20)continue;ctx.lineWidth=Math.max(1.5,cp_aK(a[0],a[2])*0.12);ctx.beginPath();ctx.moveTo(qa[0],qa[1]);ctx.lineTo(qb[0],qb[1]);ctx.stroke();}ctx.restore();}
// the flood's water over a shape on the land (seen in depth, from a horizon at hz): muddy; the sky's light on it far off, as water is at a
// low angle, and deeper and browner near; then (o.under) what's mirrored in it; then ripples, light and dark, longer and thicker near,
// drifting (o.drift px a second, near the bottom of the frame)
function cp_floodSheet(ctx,pts,t,pj,pk,hz,seed,o){o=o||{};wc_wash(ctx,pts,CP_FLOOD,{kind:"ground",line:false,depth:0.9,seed,a:0.95});const b=wc_bbox(pts),dh=Math.max(1,H-hz);
  ctx.save();wc_tr(ctx,pts);ctx.clip();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgba(255,255,255,0)");
  g.addColorStop(0.3,"rgba(206,196,170,0.3)");g.addColorStop(1,"rgba(132,116,86,0.6)");ctx.fillStyle=g;ctx.fillRect(b.x0,b.y0,b.w,b.h);
  ctx.globalCompositeOperation="screen";const g2=ctx.createLinearGradient(0,hz,0,H);g2.addColorStop(0,"rgba(216,228,240,0.75)");g2.addColorStop(0.12,"rgba(216,228,240,0.4)");
  g2.addColorStop(0.45,"rgba(216,228,240,0.1)");g2.addColorStop(1,"rgba(216,228,240,0)");ctx.fillStyle=g2;ctx.fillRect(b.x0,b.y0,b.w,b.h);ctx.globalCompositeOperation="source-over";
  if(o.under)o.under(ctx);
  const R=wc_rng(seed),dr=o.drift==null?14:o.drift,y0=Math.max(hz+3,b.y0),y1=Math.min(H+10,b.y1),m=Math.round(240*clamp((y1-y0)/dh,0.12,1)*clamp(b.w/W,0.25,1));ctx.lineCap="round";
  for(let i=0;i<m;i++){const y=lerp(y0,y1,Math.pow(R(),1.5)),k=(y-hz)/dh,len=(10+R()*60)*(0.15+k*2.2),x=((R()*(W+400)+t*dr*(0.2+k))%(W+400))-200,lw=Math.max(0.8,0.6+k*3.2),light=R()<0.62;
    ctx.globalCompositeOperation=light?"screen":"multiply";ctx.strokeStyle=light?rgba([255,255,255],0.14+R()*0.28):rgba([96,90,74],0.12+R()*0.2);ctx.lineWidth=lw;
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+len/2,y-lw*(0.6+R()),x+len,y);ctx.stroke();}
  ctx.restore();}
// what stands at the water's edge, mirrored: the frame's own pixels from y0 down to the waterline yw (x0 to x1), taken as they are...
function cp_reflGrab(ctx,x0,x1,y0,yw){const w=Math.max(2,Math.round(x1-x0)),h=Math.max(2,Math.round(yw-y0)),c=mkCanvas(w,h);c.getContext("2d").drawImage(ctx.canvas,Math.round(x0),Math.round(y0),w,h,0,0,w,h);return c;}
// ...and drawn upside down under the waterline, in thin slices that waver, faint
function cp_reflDraw(ctx,c,x0,yw,a){const w=c.width,h=c.height;ctx.save();for(let y=0;y<h;y+=2){const dx=Math.sin(y*0.09)*(0.8+y*0.012)+Math.sin(y*0.031+1)*1.6;
  ctx.globalAlpha=a*(1-0.7*y/h);ctx.drawImage(c,0,h-y-2,w,2,x0+dx,yw+y,w,2);}ctx.restore();}
// draw a thing standing in water d deep at (X, Z) (pj and pk, the scene's point and its pixels a metre): only what's above the water, and
// a pale line where it meets it, w metres wide
function cp_inWater(ctx,X,Z,d,w,pj,pk,fn){if(d<=0.01){fn();return;}const q=pj(X,d,Z),k=pk(X,Z);ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,q[1]+H);ctx.clip();fn();ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(CP.foam,0.55);ctx.lineCap="round";ctx.lineWidth=Math.max(1,0.03*k);for(const [a,b] of [[-0.5,-0.08],[0.04,0.5]]){ctx.beginPath();ctx.moveTo(q[0]+a*w*k,q[1]);ctx.lineTo(q[0]+b*w*k,q[1]);ctx.stroke();}ctx.restore();}
// the cattle in the flood: they wade off to the left, towards the farm's mound, from where they were grazing
function cp_floodCows(t,t0){const A=CP_A;return A.cows.map(([X,Z,v,fl],i)=>{const u=clamp((t-t0-i*0.2)/6,0,1);return[X-u*(10+i*2),Z+u*(i%2?3:-2),v,0];});}

/* ---------- water that runs down ---------- */
// water running down a face (a dike's slope, through a gap, over a lip), between four corners on the frame (top left, top right, bottom
// right, bottom left): its sides ragged and moving, brown and grey, lighter at the top where it's thin; streaks of white running down
// it; foam where it comes over and where it lands. o: a (opacity), col (its colour), foam (0 to 1), n (how many streaks), rag (px),
// speed, seed
function cp_falls(ctx,TL,TR,BR,BL,t,o){o=o||{};const R=wc_rng(o.seed||7),col=o.col||mix(CP_FLOOD,CP.clay,0.22),sp=o.speed||1,fo=o.foam==null?1:o.foam,
    at=(u,v)=>{const a=[lerp(TL[0],TR[0],u),lerp(TL[1],TR[1],u)],b=[lerp(BL[0],BR[0],u),lerp(BL[1],BR[1],u)];return[lerp(a[0],b[0],v),lerp(a[1],b[1],v)];},
    wd=(Math.hypot(TR[0]-TL[0],TR[1]-TL[1])+Math.hypot(BR[0]-BL[0],BR[1]-BL[1]))/2,sc=clamp(wd/300,0.3,3),rg=o.rag==null?wd*0.022:o.rag,
    rag=(v,s)=>rg*clamp(v*5,0,1)*(Math.sin(v*9+s+t*2.2*sp)*0.6+Math.sin(v*23+s*2-t*3.1*sp)*0.4);
  // its outline: the top a little wavy where it comes over, the sides ragged
  const pts=[];for(let i=0;i<=16;i++){const u=i/16,a=at(u,0);pts.push([a[0],a[1]+Math.sin(u*7+t*2*sp)*rg*0.25-Math.sin(Math.PI*u)*rg*0.3]);}
  for(let i=1;i<=24;i++){const v=i/24,b=at(1,v);pts.push([b[0]+rag(v,2),b[1]]);}for(let i=23;i>=1;i--){const v=i/24,a=at(0,v);pts.push([a[0]-rag(v,1),a[1]]);}
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;const y0=Math.min(TL[1],TR[1]),y1=Math.max(BL[1],BR[1]),g=ctx.createLinearGradient(0,y0,0,y1+1);
  g.addColorStop(0,rgba(mix(col,CP.riverLt,0.25),0.92));g.addColorStop(0.3,rgba(col,0.95));g.addColorStop(1,rgba(wc_dim(col,0.16),0.96));ctx.fillStyle=g;wc_tr(ctx,pts);ctx.fill();
  ctx.save();ctx.clip();ctx.lineCap="round";
  // patches of white water in it, drifting down; then streaks running down
  for(let i=0;i<Math.round(10*sc*fo);i++){const u=R(),v=((t*sp*0.5+R())%1.2)-0.1,q=at(u,v),r=(10+R()*26)*sc,a2=0.22*Math.sin(Math.PI*clamp(v,0,1));if(a2<=0.01)continue;
    const g2=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],r);g2.addColorStop(0,rgba(CP.foam,a2));g2.addColorStop(1,rgba(CP.foam,0));ctx.fillStyle=g2;ctx.beginPath();ctx.ellipse(q[0],q[1],r,r*1.4,0,0,TAU);ctx.fill();}
  const n=Math.round((o.n||40)*sc);
  for(let i=0;i<n;i++){const u=R(),s=0.6+R()*0.7,len=0.08+R()*0.26,v0=((t*sp*s*0.9+R())%1.35)-0.3,v1=v0+len,a=at(u,clamp(v0,0,1)),m=at(u+(R()-0.5)*0.05,clamp(v0+len/2,0,1)),b=at(u+(R()-0.5)*0.02,clamp(v1,0,1)),
      al=(0.18+R()*0.42)*Math.sin(Math.PI*clamp(v0+len/2,0,1));if(al<=0.02)continue;ctx.strokeStyle=rgba([250,248,240],al);ctx.lineWidth=(0.8+R()*R()*5)*clamp(sc,0.5,2);
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(m[0],m[1],b[0],b[1]);ctx.stroke();}
  ctx.restore();
  // foam where it comes over and where it lands, heaving; spray thrown up at its foot
  if(fo>0.01){for(let i=0;i<Math.round(40*fo*sc);i++){const top=R()<0.3,u=top?R():-0.15+R()*1.3,ph=(t*1.4*sp+R())%1,v=top?R()*0.06:0.9+R()*0.14,q=at(u,v),
      r=(top?4+R()*10:4+R()*R()*30)*sc*(0.7+0.5*Math.sin(Math.PI*ph)),a2=(top?0.5:0.4+R()*0.4)*Math.sin(Math.PI*ph);if(a2<=0.02)continue;
    const g2=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],r*1.3);g2.addColorStop(0,rgba(CP.foam,a2));g2.addColorStop(0.55,rgba(CP.foam,a2*0.45));g2.addColorStop(1,rgba(CP.foam,0));ctx.fillStyle=g2;
    ctx.beginPath();ctx.ellipse(q[0]+(R()-0.5)*r,q[1]-(top?0:ph*r*0.4)+(R()-0.5)*r*0.5,r*1.3,r*0.65,0,0,TAU);ctx.fill();}
    ctx.fillStyle=rgba(CP.foam,0.6);for(let i=0;i<Math.round(26*fo*sc);i++){const u=-0.1+R()*1.2,ph=(t*1.2*sp+R())%1,q=at(u,0.97),h=(20+R()*40)*sc;
      ctx.globalAlpha=(o.a==null?1:o.a)*0.7*(1-ph);ctx.beginPath();ctx.arc(q[0]+(R()-0.5)*h*0.6,q[1]-h*ph*(1-ph)*3,Math.max(1,1.4*sc*(0.5+R())),0,TAU);ctx.fill();}}
  ctx.restore();}

/* ---------- the breach, from the field behind it ---------- */
// The slumped stretch seen from the field, close, the eye 1.7 m up: the dike's slope runs right across the frame, its crest against the
// sky. The crest is higher than the eye, so the river behind it doesn't show. In the middle the crest sags: the turf there has slid,
// the clay is bare and cracked, and lumps of turf lie lower down. Then (cp_breachFlow) the river comes over the sag, cuts a gap through
// the dike and pours through, and the field goes under. CP_B: the camera; the dike's foot, its crest's near and far edges (Z), its
// height; the sag (X from, X to) and its crest's height there; the gap's middle (X), its half width once it's cut, and its floor; the
// river's level, and how high it rises; the ditch at the foot (Z from, to); the two ditches across the field (X)
const CP_B={C:{F:1250,hz:600,eye:1.7},toe:14,c0:19,c1:22,top:4.4,sag:[-7.5,7.5],low:3.0,gap:[0.6,3.6],floor:0.4,water:2.6,rise:3.4,ditch:[11.4,13.2],dX:[-6,5.5]};
const cp_b=(X,Y,Z)=>cp_pj(CP_B.C,X,Y,Z),cp_bK=(X,Z)=>CP_B.C.F/Z,cp_bP=L=>cp_proj(CP_B.C,L,1);
// the crest's height at X, sagging along the slumped stretch
function cp_bCrest(X){const B=CP_B,u=clamp((X-B.sag[0])/(B.sag[1]-B.sag[0]),0,1);return B.top-(B.top-B.low)*Math.pow(Math.sin(Math.PI*u),2);}
// the gap as it's cut (cut, 0 to 1): its half width, and how low its floor is
const cp_bGap=cut=>{const B=CP_B,e=easeCam(clamp(cut,0,1));return{hw:lerp(0.6,B.gap[1],e),fl:lerp(B.low-0.2,B.floor,easeCam(clamp(cut*1.5,0,1)))};};
// a point on the dike's slope towards us: X across it, v from its foot (0) up to the crest (1)
const cp_bSlope=(X,v)=>cp_b(X,v*cp_bCrest(X),lerp(CP_B.toe,CP_B.c0,v));
// o.sky: the sky alone, what shows through the gap once it's cut (the place breachSky); o.kept: a stretch that's kept, no sag; o.slump,
// how far the turf has slid under the sag (1, the breach's; less for a stretch that's only begun to slump)
function cp_paintBreach(ctx,o){o=Object.assign({slump:1},o);const B=CP_B,C=B.C,p=cp_b,P=cp_bP,R=wc_rng(351);
  cp_sky(ctx,C.hz+4,57,{n:7,top:[196,204,214]});if(o.sky)return;
  // the slope towards us, lit along the top, a shade deeper at its foot
  const xs=[];for(let X=-24;X<=24;X+=Math.abs(X)<10?0.25:1)xs.push(X);
  const slope=[...xs.map(X=>p(X,0,B.toe)),...xs.slice().reverse().map(X=>p(X,cp_bCrest(X),B.c0))];
  wc_wash(ctx,slope,mix(CP.grass2,CP.sedge,0.25),{kind:"ground",line:false,depth:0.9,seed:353});
  ctx.save();wc_tr(ctx,slope);ctx.clip();const sb=wc_bbox(slope),g=ctx.createLinearGradient(0,p(0,B.top,B.c0)[1],0,p(0,0,B.toe)[1]);g.addColorStop(0,"rgba(255,250,226,0.3)");
  g.addColorStop(0.6,"rgba(255,250,226,0)");g.addColorStop(1,"rgba(60,80,40,0.25)");ctx.fillStyle=g;ctx.fillRect(sb.x0,sb.y0,sb.w,sb.h);ctx.restore();
  if(o.kept||o.fine)cp_mottle(ctx,slope,500,357,cp_bK(0,B.toe),cp_bK(0,B.c0),p(0,0,B.toe)[1],p(0,B.top,B.c0)[1]);
  cp_grass(ctx,slope,CP.grass2,o.kept||o.fine?5000:1400,355,cp_bK(0,B.toe),cp_bK(0,B.c0),p(0,0,B.toe)[1],p(0,B.top,B.c0)[1],o.kept||o.fine);
  // the slumped stretch: under the crest, a band where the turf has slid away, bare clay, its lower edge torn; cracks in it; the turf
  // that slid, in lumps lower down, their torn undersides showing
  const sm=(B.sag[0]+B.sag[1])/2,sh=(B.sag[1]-B.sag[0])/2-0.9,sk=sh/6.6;
  if(!o.kept){const band=[];for(let X=-sh;X<=sh;X+=0.2*sk)band.push(cp_bSlope(sm+X,0.995));for(let X=sh;X>=-sh;X-=0.2*sk){const u=Math.abs(X)/sh;band.push(cp_bSlope(sm+X,lerp(1-0.38*o.slump,0.97,u*u)+(0.04*Math.sin(X/sk*2.3)+0.025*Math.sin(X/sk*5.1)+(o.slump<1?0.035*Math.sin(X/sk*11.3)+0.02*Math.sin(X/sk*23.7):0))*o.slump));}
  wc_wash(ctx,band,CP.clay,{kind:"ground",line:false,depth:0.95,seed:361});
  ctx.save();wc_tr(ctx,band);ctx.clip();ctx.globalCompositeOperation="multiply";const gb=ctx.createLinearGradient(0,cp_bSlope(0,1)[1],0,cp_bSlope(0,0.62)[1]);gb.addColorStop(0,"rgba(255,255,255,0)");
  gb.addColorStop(1,"rgba(150,120,90,0.5)");ctx.fillStyle=gb;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation="source-over";ctx.strokeStyle=rgba(CP.clayDk,0.65);ctx.lineCap="round";ctx.lineJoin="round";
  for(let i=0;i<34*sk;i++){const X=sm+(R()-0.5)*2*sh*0.9,a=cp_bSlope(X,1-0.3*o.slump+R()*0.27*o.slump);ctx.lineWidth=1+R()*1.2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(a[0]+(R()-0.5)*22,a[1]+(R()-0.2)*8);ctx.lineTo(a[0]+(R()-0.5)*34,a[1]+R()*14);ctx.stroke();}ctx.restore();
  for(const [X0,v0,w0] of [[-4.6,0.42,1.3],[-1.2,0.3,1.7],[2.4,0.4,1.2],[5.0,0.5,0.9]]){const X=sm+X0*sk,v=1-(1-v0)*o.slump,w=w0*Math.sqrt(sk),c=cp_bSlope(X,v),k=cp_bK(X,lerp(B.toe,B.c0,v)),rx=w*k*0.5,ry=w*k*0.2,
      blob=(dy,sx,sy,sd)=>{const L=[];for(let j=0;j<14;j++){const a=j/14*TAU,r=1+0.18*Math.sin(3*a+sd)+0.1*Math.sin(5*a+sd*2);L.push([c[0]+Math.cos(a)*rx*sx*r,c[1]+dy+Math.sin(a)*ry*sy*r*(Math.sin(a)<0?1.3:0.8)]);}return L;};
    wc_wash(ctx,blob(ry*0.35,1,0.9,X),CP.clayDk,{kind:"ground",line:false,depth:0.95,seed:(X*10+400)|0});wc_wash(ctx,blob(0,0.98,0.85,X+1),mix(CP.grass3,CP.grass2,0.3),{kind:"ground",line:false,depth:0.95,seed:(X*10+420)|0});
    cp_grass(ctx,blob(0,0.95,0.8,X+1),CP.grass3,40,(X*10+440)|0,k,k,c[1]+ry,c[1]-ry);}}
  // tufts along the crest against the sky, but none on the bare clay
  ctx.save();ctx.strokeStyle=rgba(wc_dim(CP.grass2,0.3),0.8);ctx.lineCap="round";ctx.lineWidth=1.6;for(let X=-24;X<24;X+=0.08){if(!o.kept&&Math.abs(X-sm)<sh+0.2)continue;const q=p(X,cp_bCrest(X),B.c0);
    ctx.beginPath();ctx.moveTo(q[0],q[1]+1);ctx.lineTo(q[0]+(R()-0.5)*5,q[1]-1-R()*8);ctx.stroke();}ctx.restore();
  // the track along the foot, rutted, and the ditch below it
  wc_wash(ctx,P([[-60,0,B.toe],[60,0,B.toe],[60,0,B.ditch[1]+0.1],[-60,0,B.ditch[1]+0.1]]),wc_lit(CP.clay,0.36),{kind:"ground",line:false,depth:0.9,seed:381,a:0.95});
  ctx.save();ctx.strokeStyle=rgba(CP.clayDk,0.3);ctx.lineWidth=1.6;for(const z of [13.45,13.75]){const a=p(-60,0,z),b=p(60,0,z);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  cp_water(ctx,P([[-60,0,B.ditch[1]],[60,0,B.ditch[1]],[60,0,B.ditch[0]],[-60,0,B.ditch[0]]]),CP.ditch,0.95,383);
  // the field coming to us: three strips between the two ditches that run back to the dike, hay on the left
  // (B.near: the fields end at a ditch running across, near us, and we stand on its bank)
  const cols=B.cols||[CP.hay,CP.grass,CP.grass2],ed=[-80,...B.dX,80],ne=ed.length-1,zn=B.near||1,fine=o.kept||o.fine;
  for(let i=0;i<ne;i++){const a=ed[i]+(i?0.6:0),b=ed[i+1]-(i<ne-1?0.6:0),pts=P([[a,0,B.ditch[0]],[b,0,B.ditch[0]],[b,0,zn],[a,0,zn]]),col=cols[i%cols.length];if(pts.length<3)continue;
    wc_wash(ctx,pts,col,{kind:"field",depth:0.95,seed:385+i,a:0.92});if(fine)cp_mottle(ctx,pts,240,393+i,cp_bK(0,3),cp_bK(0,B.ditch[0]),H,p(0,0,B.ditch[0])[1]);
    if(col===CP.hay){ctx.save();wc_tr(ctx,pts);ctx.clip();ctx.lineCap="round";for(let j=1;j<14;j++){const X=lerp(a,b,j/14),q0=p(X,0,B.ditch[0]),q1=p(X,0,zn);ctx.strokeStyle=rgba(wc_dim(col,0.2),0.35);
      ctx.lineWidth=Math.max(1.2,cp_bK(X,zn)*0.12);ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.stroke();}ctx.restore();}
    cp_grass(ctx,pts,col,fine?2400:600,389+i,cp_bK(0,4),cp_bK(0,B.ditch[0]),H,p(0,0,B.ditch[0])[1],fine);}
  for(const X of B.dX)cp_water(ctx,P([[X-0.6,0,B.ditch[0]+0.2],[X+0.6,0,B.ditch[0]+0.2],[X+0.6,0,zn],[X-0.6,0,zn]]),CP.ditch,0.95,(X*10+400)|0);
  if(B.near){cp_water(ctx,P([[-80,0,zn],[80,0,zn],[80,0,zn-0.7],[-80,0,zn-0.7]]),CP.ditch,0.95,397);const nb=P([[-80,0,zn-0.7],[80,0,zn-0.7],[80,0,0.4],[-80,0,0.4]]);
    wc_wash(ctx,nb,CP.grass,{kind:"field",depth:1,seed:399,a:0.95});cp_mottle(ctx,nb,200,401,cp_bK(0,1.5),cp_bK(0,zn),H,p(0,0,zn)[1]);cp_grass(ctx,nb,CP.grass,1600,403,cp_bK(0,2),cp_bK(0,zn),H,p(0,0,zn)[1],true);
    for(let i=0;i<40;i++){const X=(R()-0.5)*2*zn*W/C.F,q=p(X,0,zn-0.72);cp_reeds(ctx,q[0],q[1],cp_bK(X,zn)*0.7,R,5);}}
  // reeds along the ditches, tussocks and buttercups in the grass
  const z0=Math.max(4,zn+0.3),zr=B.ditch[0]-0.4-z0;
  for(let i=0;i<70;i++){const Z=z0+R()*zr,X=B.dX[i%B.dX.length]+(R()<0.5?-1:1)*(0.7+R()*0.25),q=p(X,0,Z);if(q[0]<-30||q[0]>W+30)continue;cp_reeds(ctx,q[0],q[1],cp_bK(X,Z)*0.8,R,5);}
  for(let i=0;i<50;i++){const Z=z0+R()*zr,X=(R()-0.5)*Z*1.6,q=p(X,0,Z);cp_reeds(ctx,q[0],q[1],cp_bK(X,Z)*0.3,R,6,wc_dim(CP.grass3,0.25));}
  ctx.save();ctx.fillStyle=rgba([238,206,72],0.85);for(let i=0;i<120;i++){const Z=z0+Math.pow(R(),0.8)*zr,X=(R()-0.5)*Z*1.6,q=p(X,0.15,Z),k=cp_bK(X,Z);
    ctx.beginPath();ctx.ellipse(q[0],q[1],Math.max(1.6,k*0.025),Math.max(1.2,k*0.018),R()*3,0,TAU);ctx.fill();}ctx.restore();}
// the river over the sag and through the dike: it rises (over, 0 to 1) and spills over where the crest is lowest, in a sheet down the
// slope; it cuts a gap (cut, 0 to 1), and through it, under the sky, it pours, brown and white; it fills the ditch at the foot and
// spreads over the field towards us (spread, 0 to 1). Drawn on the place breach
function cp_breachFlow(ctx,t,over,cut,spread){const B=CP_B,C=B.C,p=cp_b,P=cp_bP,Lv=lerp(B.water,B.rise,easeCam(clamp(over,0,1))),{hw,fl}=cp_bGap(cut),gx=B.gap[0],
    cutting=cut>0.01,xs=[];for(let X=-8;X<=8;X+=0.1)xs.push(X);
  if(over<=0.01)return;const wa=clamp(over*3,0,1)*clamp(1-cut*1.6,0,1),brown=mix(CP_FLOOD,CP.clay,0.5);
  // over the sag, beside the gap: the river's edge over the crest, and a sheet down the slope to the foot
  const runs=[];let cur=[];for(const X of xs){const on=cp_bCrest(X)<Lv-0.02&&!(cutting&&Math.abs(X-gx)<hw);if(on)cur.push(X);else if(cur.length){runs.push(cur);cur=[];}}if(cur.length)runs.push(cur);
  withA(ctx,wa,()=>{runs.forEach((r,i)=>{if(r.length<3)return;const xa=r[0],xb=r[r.length-1],w=xb-xa;
    const lip=[...r.map(X=>p(X,cp_bCrest(X)-0.03,B.c0)),p(xb,Lv,B.c0),p(xa,Lv,B.c0)];wc_flat(ctx,lip,mix(CP.river,brown,0.5),0.95,"lip");
    cp_falls(ctx,p(xa,Lv,B.c0),p(xb,Lv,B.c0),p(gx+(xb-gx)*1.18,0.05,B.toe-0.3),p(gx+(xa-gx)*1.18,0.05,B.toe-0.3),t,{a:0.8,col:mix(brown,CP.riverLt,0.3),n:16+w*5,foam:0.7,seed:401+i,speed:0.9});});});
  // the gap: the dike cut through. Through it, the sky; its walls of raw clay; the river pouring through it towards us
  if(cutting){const X0=gx-hw,X1=gx+hw,zf=B.toe+fl/cp_bCrest(gx)*(B.c0-B.toe),gs=xs.filter(X=>X>X0&&X<X1);
    const hole=[p(X0,fl,zf),...[X0,...gs,X1].map(X=>p(X,cp_bCrest(X)+0.02,B.c0)),p(X1,fl,zf)];
    ctx.save();wc_tr(ctx,hole);ctx.clip();ctx.drawImage(gv_place("breachSky"),0,0,W,H);
    for(const [X,s] of [[X0,1],[X1,-1]]){const top=cp_bCrest(X),far=B.c1+(top-B.water)*2.2,wall=[p(X,fl,zf),p(X,top,B.c0),p(X,top,B.c1),p(X,B.water,far),p(X,fl,far+1)];
      wc_flat(ctx,wall,s>0?wc_lit(CP.clay,0.06):wc_dim(CP.clay,0.16),1,"wall");ctx.strokeStyle=rgba(CP.clayDk,0.5);ctx.lineWidth=1.4;ctx.lineCap="round";
      for(let i=0;i<4;i++){const y=lerp(fl,top,0.25+i*0.2),a=p(X,y,lerp(zf,B.c0,0.25+i*0.2)),b=p(X,y,B.c1+1);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}
    ctx.restore();
    const gw=Math.max(0.2,hw-0.1);withA(ctx,clamp(cut*5,0,1),()=>cp_falls(ctx,p(gx-gw,Lv-0.15,B.c1+4),p(gx+gw,Lv-0.15,B.c1+4),p(gx+gw*1.15+0.3,0.1,B.toe-1.4),p(gx-gw*1.15-0.3,0.1,B.toe-1.4),t,
      {col:mix(brown,CP.riverLt,0.12),n:120,foam:1.3,seed:411,speed:1.3}));}
  // the field going under: the ditch at the foot fills from the gap outwards, then the water comes over the grass towards us, its edge
  // ragged and foaming; the ditches across fill ahead of it
  if(spread<=0.01)return;const e=easeCam(clamp(spread,0,1)),ln=4+e*60,dz=B.ditch;
  wc_wash(ctx,P([[gx-ln,0.06,dz[1]],[gx+ln,0.06,dz[1]],[gx+ln,0.06,dz[0]],[gx-ln,0.06,dz[0]]]),mix(CP_FLOOD,CP.river,0.3),{kind:"ground",line:false,depth:0.95,seed:419,a:0.92});
  for(const X of B.dX){const reach=dz[0]-clamp(e*1.6-Math.abs(X-gx)/30,0,1)*11;if(Math.abs(X-gx)>ln||reach>=dz[0]-0.3)continue;
    wc_wash(ctx,P([[X-0.6,0.04,dz[0]+0.2],[X+0.6,0.04,dz[0]+0.2],[X+0.6,0.04,Math.max(1.2,reach)],[X-0.6,0.04,Math.max(1.2,reach)]]),mix(CP_FLOOD,CP.river,0.3),{kind:"ground",line:false,depth:0.95,seed:(X*10+430)|0,a:0.92});}
  const zF=lerp(B.toe-1.4,1.1,e),n=60,arc=[];for(let i=0;i<=n;i++){const u=i/n,th=Math.PI*u,Z=lerp(B.toe-0.8,zF,Math.sin(th)),half=(hw+1.5)+(B.toe-Z)*1.3,
    wob=0.25*Math.sin(u*23+t*1.7)+0.18*Math.sin(u*41-t*2.3);arc.push([gx-Math.cos(th)*half+wob,0.05,Z+wob*0.4]);}
  const sheet=P(arc),yt=p(0,0,B.toe-0.8)[1];if(sheet.length>2)cp_floodSheet(ctx,sheet,t,p,cp_bK,C.hz,397,{drift:6,under:c=>{const g=c.createLinearGradient(0,yt,0,yt+170);
    g.addColorStop(0,rgba(mix(CP.grass2,CP.sedge,0.3),0.42));g.addColorStop(1,rgba(mix(CP.grass2,CP.sedge,0.3),0));c.fillStyle=g;c.fillRect(-W,yt,3*W,170);}});
  ctx.save();ctx.strokeStyle=rgba(CP.foam,0.85);ctx.lineCap="round";for(let i=1;i<n;i++){const a=arc[i],b=arc[i+1];if(a[2]<1.4)continue;const qa=p(a[0],a[1],a[2]),qb=p(b[0],b[1],b[2]);
    if(Math.max(qa[0],qb[0])<-20||Math.min(qa[0],qb[0])>W+20)continue;ctx.lineWidth=Math.max(1.5,cp_bK(a[0],a[2])*0.05);ctx.beginPath();ctx.moveTo(qa[0],qa[1]);ctx.lineTo(qb[0],qb[1]);ctx.stroke();}ctx.restore();}

/* ---------- a farm, close ---------- */
// A farmhouse from its yard, the eye 1.6 m up: its long side, low walls of timber and daub, the door, a shuttered window, the byre's
// wide door, and the high reed roof, with a dormer for the loft over the window; to the right, the fields going back to the dike on the
// horizon, willows, another farm. v: "dry" (a fine day, the yard's grass) or "flood" (a grey sky, the water up to the door, mirroring
// the house, and a ladder to the loft). CP_F: the camera; the house's front (Z), its ends (X), the walls' and ridge's height, the door,
// window, byre door and dormer (X from, X to), the ladder's rails; the flood's level
const CP_F={C:{F:1300,hz:520,eye:1.6},z:12,x0:-9.6,x1:3.0,wall:2.3,ridge:6.8,door:[-2.9,-1.9],win:[-7.4,-6.6],byre:[0.2,2.3],dorm:[-6.3,-4.7],ladder:[-5.9,-5.2],water:0.55};
const cp_f=(X,Y,Z)=>cp_pj(CP_F.C,X,Y,Z),cp_fK=(X,Z)=>CP_F.C.F/Z;
// the ditches across the fields beside the farm (Z): the long strips between them run across the frame
const CP_FD=[19,30,46,72];
function cp_paintFarm(ctx,v){const F=CP_F,C=F.C,p=cp_f,P=L=>cp_proj(C,L,1),flood=v==="flood",Zf=F.z,R=wc_rng(321),wl=F.water,k=cp_fK(0,Zf);
  cp_sky(ctx,C.hz+4,flood?71:73,{n:7,dark:flood,top:flood?[176,182,194]:null});
  if(flood){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([202,202,206],0.6);ctx.fillRect(0,0,W,C.hz+6);ctx.restore();}
  // far land: fields going back to the dike, a low bank along the horizon, willows, a farm; ditches running away
  const dk=p(0,4.4,160)[1];wc_wash(ctx,[[-60,C.hz-4],[W+60,C.hz-4],[W+60,H+40],[-60,H+40]],flood?[150,160,150]:mix(CP.grass,CP.grass2,0.4),{kind:"ground",line:false,depth:0.8,seed:323});
  wc_wash(ctx,[[-60,p(0,0,150)[1]],[W+60,p(0,0,150)[1]],[W+60,dk],[-60,dk]],flood?[132,146,124]:mix(CP.grass2,CP.sedge,0.3),{kind:"ground",line:false,depth:0.5,seed:325});
  cp_hedge(ctx,()=>dk+2,-40,W+40,20,0.4,327,flood?[128,140,126]:[150,170,126]);
  if(!flood){for(const Z of CP_FD){const pts=P([[3.4,0,Z-0.45],[300,0,Z-0.45],[300,0,Z+0.45],[3.4,0,Z+0.45]]);if(pts.length>2)cp_water(ctx,pts,CP.ditch,0.8,Z|0);}
    cp_grass(ctx,[[1200,C.hz+2],[W+40,C.hz+2],[W+40,p(0,0,Zf-2)[1]],[1200,p(0,0,Zf-2)[1]]],CP.grass,300,329,cp_fK(0,Zf),cp_fK(0,90),p(0,0,Zf-2)[1],C.hz);}
  cp_farm(ctx,1700,p(0,0,95)[1],0.24,{seed:9,smoke:!flood});for(const [X,z] of [[18,70],[26,48],[12,110]]){const q=p(X,0,z);cp_willow(ctx,q[0],q[1],cp_fK(X,z)*6,0.7,X*7);}
  // in the flood, the water over all of it: one sheet, from the horizon to our feet (in front of the house, it's drawn again below)
  const sea=P([[-200,wl,1],[200,wl,1],[200,wl,400],[-200,wl,400]]);if(flood)cp_floodSheet(ctx,sea,0,p,cp_fK,C.hz,343);
  // the house: walls of daub between posts, the door, window and byre door; the roof, hipped, with its dormer
  const wy=p(0,0,Zf)[1],ty=p(0,F.wall,Zf)[1],xA=p(F.x0,0,Zf)[0],xB=p(F.x1,0,Zf)[0];
  if(!flood)wc_wash(ctx,[[xA-50,wy+24],[xA-24,wy-8],[xB+24,wy-8],[xB+60,wy+24]],CP.grass3,{kind:"ground",line:false,seed:331});
  wc_part(ctx,wc_rect(xA,ty,xB-xA,wy-ty),CP.daub,1,{seed:333,lw:1.4});
  ctx.save();ctx.strokeStyle=rgba(CP.timberDk,0.9);ctx.lineCap="round";ctx.lineWidth=0.15*k;for(let X=F.x0+0.1;X<=F.x1;X+=1.05){const q=p(X,0,Zf)[0];ctx.beginPath();ctx.moveTo(q,ty);ctx.lineTo(q,wy-3);ctx.stroke();}
  ctx.lineWidth=0.18*k;ctx.beginPath();ctx.moveTo(xA,wy-0.1*k);ctx.lineTo(xB,wy-0.1*k);ctx.stroke();ctx.lineWidth=0.08*k;ctx.strokeStyle=rgba(CP.timberDk,0.5);
  for(let X=F.x0+0.55;X<F.x1-1;X+=2.1){const a=p(X,F.wall-0.1,Zf),b=p(X+0.85,0.2,Zf);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  const rect=(a,b,y0,y1,col,kind)=>{const q0=p(a,y1,Zf),q1=p(b,y0,Zf);wc_wash(ctx,[[q0[0],q0[1]],[q1[0],q0[1]],[q1[0],q1[1]],[q0[0],q1[1]]],col,{kind:kind||"door",lw:1.3,seed:(a*10|0)+400});};
  rect(F.door[0],F.door[1],0,1.9,flood?[54,42,34]:[64,50,40]);rect(F.win[0],F.win[1],1.0,1.6,CP.timberDk);rect(F.byre[0],F.byre[1],0,2.1,CP.timber);
  ctx.save();ctx.strokeStyle=rgba(CP.timberDk,0.7);ctx.lineWidth=0.06*k;const bm=p((F.byre[0]+F.byre[1])/2,0,Zf)[0];ctx.beginPath();ctx.moveTo(bm,p(0,2.1,Zf)[1]);ctx.lineTo(bm,wy);ctx.stroke();ctx.restore();
  const ez=Zf-0.45,rz=Zf+3.2,eY=F.wall-0.1,roof=[p(F.x0-0.6,eY,ez),p(F.x1+0.6,eY,ez),p(F.x1-2.4,F.ridge,rz),p(F.x0+2.4,F.ridge,rz)];
  wc_wash(ctx,roof,CP.reed,{kind:"build",seed:335,lw:1.5});
  ctx.save();wc_tr(ctx,roof);ctx.clip();ctx.lineCap="round";const b=wc_bbox(roof);for(let i=0;i<700;i++){const x=b.x0+R()*b.w,y=b.y0+R()*b.h;ctx.strokeStyle=rgba(R()<0.5?CP.reedDk:wc_lit(CP.reed,0.25),0.4);
    ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(R()-0.5)*4,y+12+R()*16);ctx.stroke();}
  const g=ctx.createLinearGradient(0,b.y0,0,b.y1);g.addColorStop(0,"rgba(80,60,40,0)");g.addColorStop(1,"rgba(80,60,40,0.24)");ctx.fillStyle=g;ctx.fillRect(b.x0,b.y0,b.w,b.h);ctx.restore();
  wc_flat(ctx,[p(F.x0+2.4,F.ridge,rz),p(F.x1-2.4,F.ridge,rz),p(F.x1-2.5,F.ridge+0.18,rz),p(F.x0+2.5,F.ridge+0.18,rz)],CP.turf,1,"ridge");
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle="rgba(90,70,50,0.3)";ctx.fillRect(xA,ty,xB-xA,0.3*k);ctx.restore();
  // the dormer: an opening to the loft, in the roof's foot over the window, under its own little roof of reed; in the flood, sacks in it
  const [d0,d1]=F.dorm,dz=Zf-0.35,dy0=F.wall-0.15,dy1=3.35,dm=(d0+d1)/2;
  wc_part(ctx,[p(d0-0.12,dy0,dz),p(d1+0.12,dy0,dz),p(d1+0.12,dy1,dz),p(d0-0.12,dy1,dz)],wc_dim(CP.daub,0.08),1,{seed:345});
  wc_flat(ctx,[p(d0+0.1,dy0+0.05,dz),p(d1-0.1,dy0+0.05,dz),p(d1-0.1,dy1-0.12,dz),p(d0+0.1,dy1-0.12,dz)],[44,34,28],1,"hatch");
  wc_part(ctx,[p(d0-0.5,dy1-0.1,dz-0.25),p(d1+0.5,dy1-0.1,dz-0.25),p(dm,dy1+1.1,dz+0.4)],CP.reed,1,{seed:347});
  if(flood)for(const [dx,sz] of [[0.3,0.9],[0.72,0.8]]){const q=p(lerp(d0,d1,dx),dy0+0.32,dz+0.6);ctx.save();ctx.globalAlpha=0.6;cp_sack(ctx,q[0],q[1],62*sz,44*sz,0.1);ctx.restore();}
  // the yard's grass; or, in the flood, the water in front of the house too, up its walls to the door, the house mirrored in it, straw
  // afloat, and the ladder standing in it
  if(!flood){wc_wash(ctx,[[-60,wy-2],[W+60,wy-2],[W+60,H+60],[-60,H+60]],CP.grass,{kind:"ground",line:false,seed:339,a:0.95});cp_grass(ctx,[[-60,wy],[W+60,wy],[W+60,H+60],[-60,H+60]],CP.grass,500,341,cp_fK(0,4),k,H,wy);
    for(let i=0;i<20;i++){const Z=4+R()*7,X=-8+R()*15,q=p(X,0,Z);cp_reeds(ctx,q[0],q[1],cp_fK(X,Z)*0.3,R,6,wc_dim(CP.grass3,0.2));}return;}
  const yw=p(0,wl,Zf)[1],rx0=p(F.x0-0.7,0,Zf)[0],rx1=p(F.x1+0.7,0,Zf)[0],mir=cp_reflGrab(ctx,rx0,rx1,p(0,F.ridge+0.3,rz)[1],yw);
  ctx.save();ctx.beginPath();ctx.rect(rx0,yw,rx1-rx0,H-yw+20);ctx.clip();cp_floodSheet(ctx,sea,0,p,cp_fK,C.hz,343,{under:c=>cp_reflDraw(c,mir,rx0,yw,0.3)});ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(CP.foam,0.6);ctx.lineCap="round";for(let x=xA-6;x<xB+6;x+=14+R()*30){const w=10+R()*40;ctx.lineWidth=1.2+R()*1.6;ctx.beginPath();ctx.moveTo(x,yw+R()*2);ctx.lineTo(Math.min(xB+6,x+w),yw+R()*2);ctx.stroke();}
  ctx.strokeStyle=rgba(wc_lit(CP.hay,0.1),0.85);for(let i=0;i<26;i++){const Z=3+R()*8,X=-12+R()*20,q=p(X,wl,Z),kk=cp_fK(X,Z);ctx.lineWidth=Math.max(1,kk*0.012);
    for(let j=0;j<3;j++){const a=R()*0.5-0.25,l=kk*(0.08+R()*0.12);ctx.beginPath();ctx.moveTo(q[0]-l/2,q[1]+(R()-0.5)*kk*0.02);ctx.lineTo(q[0]+l/2,q[1]+a*l*0.3);ctx.stroke();}}ctx.restore();
  const [la,lb]=F.ladder,z0=Zf-1.0,z1=dz-0.05;ctx.save();ctx.strokeStyle=rgba(CP_WOODDK,1);ctx.lineCap="round";ctx.lineWidth=0.09*k;
  for(const X of [la,lb]){const a=p(X,wl,z0),b2=p(X,dy0+0.3,z1);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.stroke();}
  ctx.lineWidth=0.06*k;for(let Y=0.9;Y<dy0+0.2;Y+=0.32){const u=(Y-wl)/(dy0+0.3-wl),z=lerp(z0,z1,u),a=p(la,Y,z),b2=p(lb,Y,z);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b2[0],b2[1]);ctx.stroke();}ctx.restore();}
// someone standing in the farm's flood at (X, Z): drawn above the water only, with faint rings spreading round them (fn draws them)
function cp_farmWade(ctx,t,X,Z,w,fn){const F=CP_F,q=cp_f(X,F.water,Z),k=cp_fK(X,Z);cp_inWater(ctx,X,Z,F.water,w,cp_f,cp_fK,fn);ctx.save();ctx.lineCap="round";
  for(let i=0;i<2;i++){const r=((t*0.4+i*0.5)%1),rx=w*k*(0.5+r*0.8),ry=w*k*(0.06+r*0.07);ctx.strokeStyle=rgba(CP.foam,0.45*(1-r));ctx.lineWidth=Math.max(1,0.03*k);
    for(let j=0;j<5;j++){const a0=j/5*TAU+i,a1=a0+TAU/5*0.6;ctx.beginPath();ctx.ellipse(q[0],q[1]+1,rx,ry,0,a0,a1);ctx.stroke();}}ctx.restore();}
