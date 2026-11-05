/* ===== Borrowed from the brain: the film's kit =====
   Helpers every chapter uses, in the module's look (films/what-an-agent-is/shared/src). Every name here starts with bb_ or BB_.
     BB                              the film's own colours: Cajal's ink and paper, brass and walnut, the stained slide's gold, the
                                     living cell's warm tones, and the signal's warm white; never one of the module's meaning colours
     bb_scr(ctx, S, fn)              draw in screen space, whatever the camera is doing (a tag, a card that stays put)
     bb_tag(ctx, s, a, o)            a place-and-year tag, top left
     bb_pillAt, bb_cardAt            a pill or a card that springs in at t0 and fades at t1
     bb_cell(seed, o) -> cell        a nerve cell, grown once from a seed: its body, branches (dendrites) and one long fibre (the axon),
                                     each a tapering curve; bb_drawCell(ctx, cell, o) draws it (o.u grows it in, o.ink as Cajal drew
                                     it, o.col, o.glow); bb_axonAt(cell, u) is a point along its fibre
     bb_spark(ctx, x, y, r, a)       the signal: a small warm-white glow
     bb_lens(ctx, x, y, r, fn, o)    a microscope's round field: fn draws inside it, then the rim
     bb_paper(ctx, x, y, w, h, o)    a sheet of drawing paper, lying flat, with a soft shadow
     bb_ink(ctx, pts, u, w, a)       an ink line drawn on along points, tapering at both ends
     bb_unit(ctx, x, y, r, o)        a unit, people's simple copy of a nerve cell: a violet disc that adds up its inputs
     bb_wire(ctx, a, b, o)           a connection between units, its weight shown by its width
     bb_perceptron(ctx, x, y, o)     the perceptron, as the opening film drew it */

const BB={ink:[30,27,26],inkSoft:[78,70,64],paper:[244,236,219],paperDk:[224,212,188],paperEdge:[198,184,158],
  brass:[184,146,78],brassDk:[118,88,42],brassHi:[244,220,160],walnut:[118,84,58],walnutDk:[76,54,38],walnutHi:[166,124,88],
  plaster:[226,214,194],plasterDk:[190,174,150],gold:[226,186,108],goldDk:[176,128,58],
  flesh:[226,176,150],fleshDk:[170,112,92],fleshHi:[250,222,204],spark:[255,240,206],
  sea:[64,118,132],seaDk:[26,58,74],sand:[214,196,160],
  mut:[96,100,106]};

/* ---------------------------------------------------------------- small things */
function bb_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// the place and year, on a tag at the top left (the module's tags are mono, on a card)
function bb_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,12,{});ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:o.col||AG.mut});ctx.restore();}
function bb_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));ag_pill(ctx,x,y,text,o||{});ctx.restore();}
function bb_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;
  return ag_textCard(ctx,x,y,w,words,Object.assign({},o,{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}
// words on the picture, with a soft halo of paper behind them so they read on anything
function bb_word(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.shadowColor=o.halo||"rgba(250,246,238,0.95)";ctx.shadowBlur=o.blur||14;ag_T(ctx,s,x,y,Object.assign({w:700,size:o.size||32},o,{a:1}));ctx.restore();}
// a smooth closed blob round (cx, cy), seeded
function bb_blob(cx,cy,rx,ry,seed,amp,n){n=n||48;const pts=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=1+amp*(AG_NZ.fbm(Math.cos(a)*1.4+seed*3.1,Math.sin(a)*1.4+seed*1.7,3)-0.5)*2;
  pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}return pts;}
function bb_path(c,P,close){c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)c.lineTo(P[i][0],P[i][1]);if(close!==false)c.closePath();}
// a Catmull-Rom curve through points, as n points per span
function bb_smooth(pts,n){const out=[],Q=[pts[0]].concat(pts,[pts[pts.length-1]]);for(let i=1;i<Q.length-2;i++){const p0=Q[i-1],p1=Q[i],p2=Q[i+1],p3=Q[i+2];
  for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;out.push([0.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
    0.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]);}}out.push(pts[pts.length-1]);return out;}
// a point along points P at u (0..1): [x, y, angle]
function bb_along(P,u){let tot=0;const L=[0];for(let i=1;i<P.length;i++){tot+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(tot);}
  const d=clamp(u,0,1)*tot;for(let i=1;i<P.length;i++)if(d<=L[i]){const k=(d-L[i-1])/((L[i]-L[i-1])||1),a=P[i-1],b=P[i];return[lerp(a[0],b[0],k),lerp(a[1],b[1],k),Math.atan2(b[1]-a[1],b[0]-a[0])];}
  const a=P[P.length-2],b=P[P.length-1];return[b[0],b[1],Math.atan2(b[1]-a[1],b[0]-a[0])];}
// a tapering line along points: one filled shape from w0 to w1 wide, drawn on to u (0..1), with round ends
function bb_strand(ctx,P,w0,w1,col,u){u=u==null?1:u;if(u<=0||P.length<2)return;const n=P.length,m=Math.max(2,Math.ceil((n-1)*clamp(u,0,1))+1),L=[],R=[];
  for(let i=0;i<m;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,h=lerp(w0,w1,i/(n-1))/2;
    L.push([P[i][0]-dy/d*h,P[i][1]+dx/d*h]);R.push([P[i][0]+dy/d*h,P[i][1]-dx/d*h]);}
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(const q of L)ctx.lineTo(q[0],q[1]);const e=P[m-1],we=lerp(w0,w1,(m-1)/(n-1))/2;
  ctx.arc(e[0],e[1],we,Math.atan2(L[m-1][1]-e[1],L[m-1][0]-e[0]),Math.atan2(R[m-1][1]-e[1],R[m-1][0]-e[0]),true);
  for(let i=m-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);ctx.arc(P[0][0],P[0][1],w0/2,Math.atan2(R[0][1]-P[0][1],R[0][0]-P[0][0]),Math.atan2(L[0][1]-P[0][1],L[0][0]-P[0][0]),true);ctx.closePath();ctx.fill();}
// the signal: a small warm-white glow, brightest in the middle
function bb_spark(ctx,x,y,r,a,col){if(a<=0)return;const c=col||BB.spark,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba([255,255,250],0.95*a));g.addColorStop(0.35,rgba(c,0.7*a));g.addColorStop(1,rgba(c,0));
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}

/* ---------------------------------------------------------------- a nerve cell, grown once from a seed
   o: x, y (the body), r (its radius), dirs (how many branches), axon {ang, len, bend} (the long fibre and its end branches), reach
   (how far the branches go), wig (how much they wander), spines (small buds on the branches, as Cajal saw them). Each branch is a
   list of points with a start and end width, and its children start part of the way along it; the axon ends in a few short end
   branches, each with a small knob, where it nearly touches the next cell. */
function bb_cell(seed,o){o=o||{};const R=ag_rnd(seed),x=o.x||0,y=o.y||0,r=o.r||26,reach=o.reach||220,wig=o.wig==null?0.35:o.wig,B=[];
  const grow=(px,py,ang,len,w,depth,from,at)=>{const n=8,P=[[px,py]];let a=ang,cx=px,cy=py;for(let i=1;i<=n;i++){a+=(R()-0.5)*wig;cx+=Math.cos(a)*len/n;cy+=Math.sin(a)*len/n;P.push([cx,cy]);}
    const S=bb_smooth(P,3),b={P:S,w0:w,w1:Math.max(1.4,w*0.28),from,at,depth,kids:[]};B.push(b);const me=B.length-1;
    if(depth<(o.depth||3)){const k=depth<1?2:(R()<0.7?2:1);for(let j=0;j<k;j++){const u=0.35+R()*0.5,q=bb_along(S,u),da=(j%2?1:-1)*(0.35+R()*0.45);
      const kid=grow(q[0],q[1],q[2]+da,len*(0.5+R()*0.25),lerp(w,b.w1,u)*0.82,depth+1,me,u);b.kids.push(kid);}}
    return me;};
  const dirs=o.dirs||6,ax=o.axon||{ang:Math.PI*0.5,len:520,bend:0.25},roots=[];
  for(let k=0;k<dirs;k++){let a=ax.ang+Math.PI+(k-(dirs-1)/2)*(TAU*0.78/dirs)+(R()-0.5)*0.4;roots.push(grow(x+Math.cos(a)*r*0.8,y+Math.sin(a)*r*0.8,a,reach*(0.6+R()*0.5),r*0.55,0,-1,0));}
  // the axon: one long, smooth fibre, then its end branches with their knobs
  const n=12,AP=[[x+Math.cos(ax.ang)*r*0.9,y+Math.sin(ax.ang)*r*0.9]];let a=ax.ang,cx=AP[0][0],cy=AP[0][1];
  for(let i=1;i<=n;i++){a+=Math.sin(i*0.9+seed)*(ax.bend||0.2)*0.35;cx+=Math.cos(a)*ax.len/n;cy+=Math.sin(a)*ax.len/n;AP.push([cx,cy]);}
  const A=bb_smooth(AP,3),ends=[],en=ax.ends==null?4:ax.ends;
  for(let k=0;k<en;k++){const b0=bb_along(A,1),da=(k-(en-1)/2)*0.42+(R()-0.5)*0.2,L=(ax.endLen||70)*(0.7+R()*0.5),P=[[b0[0],b0[1]]];let aa=b0[2]+da,qx=b0[0],qy=b0[1];
    for(let i=1;i<=5;i++){aa+=(R()-0.5)*0.4;qx+=Math.cos(aa)*L/5;qy+=Math.sin(aa)*L/5;P.push([qx,qy]);}ends.push(bb_smooth(P,3));}
  const blob=bb_blob(x,y,r,r*0.88,seed*0.37,0.18,40);
  // spines: small buds along the outer branches
  const spines=[];if(o.spines)B.forEach((b,i)=>{if(b.depth<1)return;for(let k=0;k<6;k++){const u=0.2+R()*0.75,q=bb_along(b.P,u),s=(R()<0.5?1:-1);spines.push([i,u,q[2]+s*(1.2+R()*0.5),3+R()*4]);}});
  return{x,y,r,B,roots,A,ends,blob,spines,w0:o.axW||r*0.36};}
// how far along a branch, for growing in: a root grows first, its children once it has passed their place
function bb_branchU(cell,i,u){const b=cell.B[i];if(b.from<0)return clamp(u/0.6,0,1);const pu=bb_branchU(cell,b.from,u);if(pu<b.at)return 0;return clamp((u-0.6*b.at-0.15*b.depth)/0.55,0,1);}
function bb_axonAt(cell,u){if(u<=0.82)return bb_along(cell.A,u/0.82);const e=cell.ends[0];return bb_along(e,(u-0.82)/0.18);}
// draws a cell: o.u (0..1) grows it in (the body first, the branches out from it, then the fibre); o.ink draws it as Cajal's black
// cells, solid; otherwise a living cell, matte and lit from the right (o.col its colour); o.a; o.knobs the end branches' knobs
function bb_drawCell(ctx,cell,o){o=o||{};const u=o.u==null?1:o.u,a=o.a==null?1:o.a;if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;
  const ink=!!o.ink,col=o.col||(ink?BB.ink:BB.flesh),dk=ink?col:mix(col,[60,30,30],0.35),hi=ink?col:mix(col,[255,250,244],0.45);
  const fill=c=>rgba(c,1);
  // the branches: dark under-edge first (a little left and down, the window is on the right), then the body colour
  const pass=(c,dx,dy,wk)=>{ctx.save();ctx.translate(dx,dy);cell.B.forEach((b,i)=>{const v=bb_branchU(cell,i,u);if(v>0)bb_strand(ctx,b.P,b.w0*wk,b.w1*wk,c,v);});
    const av=clamp((u-0.35)/0.65,0,1);if(av>0){bb_strand(ctx,cell.A,cell.w0*wk,cell.w0*0.55*wk,c,Math.min(1,av/0.82));if(av>0.82)cell.ends.forEach(e=>bb_strand(ctx,e,cell.w0*0.55*wk,1.6*wk,c,(av-0.82)/0.18));}
    ctx.restore();};
  if(!ink)pass(fill(dk),-2,2,1.08);
  pass(fill(col),0,0,1);
  if(!ink){ctx.save();ctx.globalAlpha*=0.55;pass(fill(hi),1.2,-1.2,0.45);ctx.restore();}
  // spines and knobs
  const sp=clamp((u-0.5)/0.5,0,1);if(sp>0&&cell.spines.length){ctx.fillStyle=fill(col);for(const [i,v,ang,l] of cell.spines){if(bb_branchU(cell,i,u)<v)continue;const q=bb_along(cell.B[i].P,v);
    ctx.save();ctx.globalAlpha*=sp;ctx.beginPath();ctx.ellipse(q[0]+Math.cos(ang)*l,q[1]+Math.sin(ang)*l,2.4,2.4,0,0,TAU);ctx.fill();ctx.lineWidth=1.6;ctx.strokeStyle=fill(col);ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0]+Math.cos(ang)*l,q[1]+Math.sin(ang)*l);ctx.stroke();ctx.restore();}}
  const kn=clamp((u-0.92)/0.08,0,1);if(kn>0&&o.knobs!==false)for(const e of cell.ends){const q=e[e.length-1];ctx.fillStyle=fill(col);ctx.globalAlpha*=1;ctx.beginPath();ctx.arc(q[0],q[1],(o.knob||5)*kn,0,TAU);ctx.fill();}
  // the body: a soft blob, with its nucleus when it's alive
  const bu=clamp(u/0.25,0,1);if(bu>0){ctx.save();ag_about(ctx,cell.x,cell.y,lerp(0.4,1,ag_eo(bu)));
    if(ink){ctx.fillStyle=fill(col);ctx.beginPath();bb_path(ctx,cell.blob);ctx.fill();}
    else{ag_soft(ctx,c=>bb_path(c,cell.blob),col,hi,cell.x+cell.r*0.45,cell.y-cell.r*0.45,cell.r*1.3,rgba(dk,0.55),10,0.8);
      ctx.fillStyle=rgba(mix(dk,col,0.35),0.7);ctx.beginPath();ctx.ellipse(cell.x-cell.r*0.12,cell.y+cell.r*0.06,cell.r*0.36,cell.r*0.32,0.3,0,TAU);ctx.fill();
      ctx.fillStyle=rgba(hi,0.6);ctx.beginPath();ctx.arc(cell.x-cell.r*0.02,cell.y-cell.r*0.04,cell.r*0.09,0,TAU);ctx.fill();}
    ctx.restore();}
  ctx.restore();}
// a cell's glow while it fires: its body lights from within
function bb_cellGlow(ctx,cell,k){if(k<=0)return;const g=ctx.createRadialGradient(cell.x,cell.y,0,cell.x,cell.y,cell.r*3.2);g.addColorStop(0,rgba(BB.spark,0.75*k));g.addColorStop(1,rgba(BB.spark,0));
  ctx.fillStyle=g;ctx.fillRect(cell.x-cell.r*3.2,cell.y-cell.r*3.2,cell.r*6.4,cell.r*6.4);}

/* ---------------------------------------------------------------- the microscope's field, paper, ink */
// fn draws inside a round field of radius r at (x, y); a soft dark rim and a little vignette round it, like looking down the tube
function bb_lens(ctx,x,y,r,fn,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();fn(ctx);
  const g=ctx.createRadialGradient(x,y,r*0.62,x,y,r);g.addColorStop(0,"rgba(30,20,10,0)");g.addColorStop(1,"rgba(30,20,10,0.55)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();
  ctx.strokeStyle="rgba(24,20,18,0.9)";ctx.lineWidth=o.rim||18;ctx.beginPath();ctx.arc(x,y,r+(o.rim||18)/2,0,TAU);ctx.stroke();
  ctx.strokeStyle="rgba(255,240,210,0.18)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r+(o.rim||18)-2,-1.2,0.2);ctx.stroke();ctx.restore();}
// a sheet of paper lying flat: cream, a deckled shadow, and a little tooth
function bb_paper(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(46,34,20,0.32)";ctx.shadowBlur=26;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=10;ctx.fillStyle=rgba(o.col||BB.paper,1);ctx.fillRect(x,y,w,h);ctx.restore();
  const g=ctx.createLinearGradient(x+w,y,x,y+h);g.addColorStop(0,"rgba(255,252,244,0.5)");g.addColorStop(1,"rgba(170,150,120,0.16)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ag_grain(ctx,x,y,w,h,1.2,23);ctx.strokeStyle=rgba(BB.paperEdge,0.6);ctx.lineWidth=1.5;ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);ctx.restore();}
// an ink line drawn on along points P to u, w wide, tapering at its ends
function bb_ink(ctx,P,u,w,a,col){if(u<=0||a<=0)return;ctx.save();ctx.globalAlpha*=a;bb_strand(ctx,P,w*0.6,w*0.4,rgba(col||BB.ink,0.92),u);ctx.restore();}
// a curved arrow in ink, drawn on to u: along points, with its head at the end
function bb_inkArrow(ctx,P,u,w,a,col){if(u<=0||a<=0)return;bb_ink(ctx,P,u,w,a,col);if(u<0.98)return;const e=bb_along(P,1);ctx.save();ctx.globalAlpha*=a;ag_arrowHead(ctx,e[0],e[1],e[2],w*3.2,rgba(col||BB.ink,0.92));ctx.restore();}

/* ---------------------------------------------------------------- the units people built on the nerve cell */
// a unit: a violet disc, lit from the right, with a sum sign; o.on (0..1, it fires: a ring of light), o.a, o.sigma
function bb_unit(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const on=o.on||0,col=AG.violet;
  ag_floorShadow(ctx,x-r*0.15,y+r*0.9,r*0.9,r*0.28,0.18);
  ag_soft(ctx,c=>c.arc(x,y,r,0,TAU),mix(col,[255,255,255],0.72),[255,255,255],x+r*0.4,y-r*0.45,r*1.4,"rgba(40,30,90,0.35)",Math.max(6,r*0.3),0.85);
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=Math.max(2.5,r*0.09);ctx.beginPath();ctx.arc(x,y,r-ctx.lineWidth/2,0,TAU);ctx.stroke();
  if(on>0){ctx.save();ctx.shadowColor=rgba(col,0.9*on);ctx.shadowBlur=r*0.9;ctx.strokeStyle=rgba(col,0.9*on);ctx.lineWidth=Math.max(3,r*0.12);ctx.beginPath();ctx.arc(x,y,r*1.12,0,TAU);ctx.stroke();ctx.restore();
    ctx.fillStyle=rgba(col,0.35*on);ctx.beginPath();ctx.arc(x,y,r*0.86,0,TAU);ctx.fill();}
  if(o.sigma!==false&&r>=24){ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(2.5,r*0.1);ctx.lineCap="round";ctx.lineJoin="round";const s=r*0.38;ctx.beginPath();
    ctx.moveTo(x+s*0.75,y-s);ctx.lineTo(x-s*0.75,y-s);ctx.lineTo(x+s*0.2,y);ctx.lineTo(x-s*0.75,y+s);ctx.lineTo(x+s*0.75,y+s);ctx.stroke();}
  ctx.restore();}
// a connection between two points; o.w its width (its weight), o.col, o.a, o.u draws it on, o.sig (0..1) a signal along it
function bb_wire(ctx,a,b,o){o=o||{};const al=o.a==null?1:o.a,u=o.u==null?1:o.u;if(al<=0||u<=0)return;ctx.save();ctx.globalAlpha*=al;
  const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2+(o.bow||0),P=[];for(let i=0;i<=16;i++){const t=i/16,m=1-t;P.push([m*m*a[0]+2*m*t*mx+t*t*b[0],m*m*a[1]+2*m*t*my+t*t*b[1]]);}
  bb_strand(ctx,P,o.w||4,o.w||4,rgba(o.col||mix(AG.violet,[120,116,140],0.35),o.alpha||0.7),u);
  if(o.sig!=null&&o.sig>0&&o.sig<1){const q=bb_along(P,o.sig);bb_spark(ctx,q[0],q[1],o.sr||16,1,o.sigCol);}ctx.restore();return P;}

/* ---------------------------------------------------------------- the perceptron, as the opening film drew it
   (Decades in the making, dm_perceptron): one cabinet so its parts can be seen, an eye of 20 x 20 cells, the card shown to it,
   two lamps for its guess, and six dials, the numbers each wrong guess nudges. o.on, o.card (0 left, 1 right), o.show, o.guess,
   o.right, o.dial(i) -> angle, o.nudge, o.a. The cabinet is 760 by 520, on legs 120 tall. */
const BB_EYE=20;
function bb_perceptron(ctx,x,y,o){const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=760,h=520,on=o.on==null?1:o.on;
  ag_floorShadow(ctx,x+w/2-20,y+h+122,w*0.55,34,0.22);
  for(const lx of [x+50,x+w-80])ag_soft(ctx,cc=>ag_rect(cc,lx,y+h-6,30,128,4),[90,98,106],[150,160,168],lx+30,y+h,80,"rgba(0,0,0,0.3)",4);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,w,h,18),[150,162,170],[214,222,226],x+w,y,700,"rgba(30,40,50,0.4)",18);
  const pw=ag_tw(ctx,"PERCEPTRON",{w:800,size:30,ls:5})+60;
  ag_soft(ctx,cc=>ag_rect(cc,x+w/2-pw/2,y+22,pw,52,8),[170,134,66],[236,212,146],x+w/2+pw/2,y+22,pw,"rgba(80,60,20,0.4)",4);
  ag_T(ctx,"PERCEPTRON",x+w/2,y+60,{w:800,size:30,ls:5,align:"center",col:[72,54,26]});
  const cx=x+44,cy=y+122,cw=200,ch=150,sh=o.show||0;
  ag_inner(ctx,cc=>ag_rect(cc,cx-10,cy-10,cw+20,ch+20,10),"rgba(20,30,40,0.5)",12,-3,3);
  if(sh>0){ctx.save();ctx.globalAlpha*=clamp(sh*1.6,0,1);ctx.translate(0,(1-ag_eo(sh))*-30);ctx.fillStyle="#FBFAF6";ctx.fillRect(cx,cy,cw,ch);
    ctx.fillStyle=rgba(BB.ink,0.85);ctx.beginPath();ctx.arc(cx+(o.card?cw*0.74:cw*0.26),cy+ch/2,34,0,TAU);ctx.fill();ctx.restore();}
  ag_T(ctx,"Shown",cx+cw/2,y+352,{w:600,size:28,align:"center",col:AG.mut});
  const ex=x+290,ey=y+100,es=196,cs=es/BB_EYE;ctx.fillStyle="#2B2E33";rr(ctx,ex-8,ey-8,es+16,es+16,8);ctx.fill();
  const mx=(o.card?0.74:0.26)*BB_EYE;
  for(let i=0;i<BB_EYE;i++)for(let j=0;j<BB_EYE;j++){const lit=sh>0.6&&Math.hypot(i+0.5-mx,j+0.5-BB_EYE/2)<3.7?clamp((sh-0.6)/0.3,0,1):0;
    ctx.fillStyle=rgba(mix(mix([58,62,70],[78,86,96],on),[255,236,190],lit),1);ctx.fillRect(ex+i*cs+1,ey+j*cs+1,cs-2,cs-2);}
  ag_T(ctx,"Its eye",ex+es/2,y+352,{w:600,size:28,align:"center",col:AG.mut});
  for(const [k,lab] of [[0,"Left"],[1,"Right"]]){const lx=x+576,ly=y+162+k*92,lit=o.guess===k?1:0;
    ctx.fillStyle=rgba(mix(mix([80,86,94],[104,112,120],on),AG.violet,lit),1);ctx.beginPath();ctx.arc(lx,ly,22,0,TAU);ctx.fill();
    if(lit){ctx.save();ctx.shadowColor=rgba(AG.violet,0.8);ctx.shadowBlur=24;ctx.fill();ctx.restore();}
    ag_T(ctx,lab,lx+38,ly+11,{w:700,size:30,col:lit?AG.ink:AG.mut});}
  if(o.right!=null&&o.guess!=null){const vx=x+w-46,vy=y+162+o.guess*92;if(o.right)ag_tick(ctx,vx,vy,30,rgba(AG.green,1),5);else{ctx.save();ctx.strokeStyle=rgba(AG.amber,1);ctx.lineWidth=5;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(vx-13,vy-13);ctx.lineTo(vx+13,vy+13);ctx.moveTo(vx+13,vy-13);ctx.lineTo(vx-13,vy+13);ctx.stroke();ctx.restore();}}
  const nu=o.nudge||0;
  for(let i=0;i<6;i++){const dx=x+90+i*116,dy=y+428,ang=o.dial?o.dial(i):0;
    if(nu>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.85*nu);ctx.lineWidth=5;ctx.beginPath();ctx.arc(dx,dy,42,0,TAU);ctx.stroke();ctx.restore();}
    ag_soft(ctx,cc=>cc.arc(dx,dy,36,0,TAU),[226,230,232],[255,255,255],dx+14,dy-14,40,"rgba(30,40,50,0.35)",6);
    ctx.strokeStyle=rgba(AG.blue,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+Math.sin(ang)*26,dy-Math.cos(ang)*26);ctx.stroke();}
  ag_T(ctx,"Its numbers",x+w/2,y+500,{w:600,size:28,align:"center",col:AG.mut});
  ctx.restore();}
