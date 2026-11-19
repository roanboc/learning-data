/* ===== Day one at Quehue: every cord checked in, and three ropes braided into each cable =====
   Day one of the three (the Ministry of Culture's study, 2015, pages 177 to 180): each family has promised one cord of twisted grass,
   forty arm spans long, and on both banks the community's authorities check one from each family, as the coils are laid out in
   rows; families still come over the hill with theirs, and women and children twist more cord on the grass. Then men stretch and
   twist the cords into ropes, and braid three ropes into each cable of the floor: one man braids from one end, with hands and feet,
   and when he tires another takes his place, while many hands hold the cable along its length. The author chose the check-in as the
   film's tile (19 November 2026).
   It is drawn in the gorge's world and ink line (hm_gorge.js): in metres, the people kit's people at their true size where they
   stand. Away from the gorge, x is simply to the right and z ahead of the camera. What doesn't move is painted once, as a place
   (AG_PLACES.hmCheck, hmBraid): the sky, the ground, its tufts of ichu, the walls of fieldstone and the coils already checked in.
   The people are drawn over it every frame, the furthest first (hmv_scene), with the coils that come in as the shot goes on, and the
   cable as it grows. Nobody drawn is a likeness of anyone. Drawn first for the author's review (18 November 2026), then made the
   film's own here, from Wellbeing is in the work's home (ww_home.js). */
const HMV=(()=>{
const U=PK.u,col=hmq_c,INK=()=>PK.S.ink;
const C={adobe:[186,142,106],plaster:[214,190,156],door:[96,66,50],thatch:[202,170,104],thatch2:[170,138,80],
  tin:[168,172,176],tin2:[140,146,152],stone:[178,168,152],stone2:[150,140,126],yard:[204,176,132],path:[196,168,124],wood:[132,96,68]};
const inPoly=(x,z,p)=>{let a=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,zi]=p[i],[xj,zj]=p[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)a=!a;}return a;};
const ink=(cc,dm,k)=>U.mix(INK(),cc,U.clamp(dm/(k||260),0,0.6));
const lwAt=(c,dm,k,a,b)=>U.clamp(c.f*(k||0.02)/Math.max(dm,0.5),a||0.8,b||3.2);

/* the ground: one sweep of ichu from the horizon to our feet, the far slopes folding down to it, yards and paths of bare earth,
   and grass spread in the sun to dry (a patch's straw: its straws, each a short stroke lying on the ground) */
function ground(ctx,c,o){const g=o.grey,hz=c.hor;
  const gr=ctx.createLinearGradient(0,hz,0,1080);gr.addColorStop(0,U.css(hmq_fog(hmq_g(col("straw3"),g),300,g)));gr.addColorStop(0.25,U.css(hmq_fog(hmq_g(U.mix(col("straw2"),col("straw3"),0.5),g),60,g)));
  gr.addColorStop(1,U.css(hmq_g(col("straw2"),g)));ctx.fillStyle=gr;ctx.fillRect(0,hz+6,1920,1080-hz);
  const S=PK.S;S.begin(ctx,{lw:1.6,far:0.5});
  for(const [a,b,hh] of o.folds||[]){S.poly(ctx,[[a,hz+30,1],[a+(b-a)*0.18,hz-hh*0.5],[a+(b-a)*0.5,hz-hh],[a+(b-a)*0.82,hz-hh*0.55],[b,hz+30,1]],hmq_fog(hmq_g(col("straw"),g),180,g),{exact:true,ten:0.6});}
  const P=(o.patches||[]).map(p=>({p,dm:c.d(p.pts.reduce((s,q)=>s+q[0],0)/p.pts.length,p.pts.reduce((s,q)=>s+q[1],0)/p.pts.length)})).sort((a,b)=>b.dm-a.dm);
  for(const {p,dm} of P){const q=hmq_clip(c,p.pts.map(([x,z])=>[x,0,z]));if(q.length<3)continue;const cc=hmq_fog(hmq_g(p.c||C.yard,g),dm,g);
    hmq_path(ctx,q);ctx.fillStyle=U.css(cc);ctx.fill();ctx.strokeStyle=U.css(U.mix(cc,col("straw2"),0.5));ctx.lineWidth=lwAt(c,dm,0.05,1,6);ctx.lineJoin="round";ctx.stroke();
    if(p.straw){const xs=p.pts.map(q2=>q2[0]),zs=p.pts.map(q2=>q2[1]),x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs),R=U.rnd(17);ctx.lineCap="round";
      for(let k=0;k<p.straw;k++){const X=U.lerp(x0,x1,R()),Z=U.lerp(z0,z1,R()),a=(R()-0.5)*0.7+(p.dir||0),v=R();if(!inPoly(X,Z,p.pts))continue;const L=(p.L||0.3)*(0.7+R()*0.6),A=c.P(X,0.02,Z),B=c.P(X+Math.cos(a)*L,0.02,Z+Math.sin(a)*L);if(A[2]<c.N||B[2]<c.N)continue;
        ctx.strokeStyle=U.css(v<0.55?U.mix(cc,[252,240,196],0.3+v*0.6):U.dk(cc,0.06+(v-0.55)*0.3));ctx.lineWidth=lwAt(c,A[2],p.w||0.012,0.6,3);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.quadraticCurveTo((A[0]+B[0])/2,(A[1]+B[1])/2-lwAt(c,A[2],0.01,0.3,3),B[0],B[1]);ctx.stroke();}}}}
// tufts of ichu on a grid round the camera, none on bare ground: the near ones on a finer grid, larger
function tufts(c,o){const D=[],bare=(o.patches||[]).map(p=>p.pts).concat(o.bare||[]);
  for(const [st,R,d0,d1,dens,salt] of [[0.6,8,1.2,7,(o.tuftDensity||0.42)*0.55,11],[1.4,o.tuftR||46,7,1e9,o.tuftDensity||0.42,0]]){
  const cx=Math.round(c.x/st),cz=Math.round(c.z/st),n=Math.round(R/st);
  for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++){const gx=cx+i,gz=cz+j,hv=U.hash(gx*7919+gz*104729+salt,3);if(hv>dens)continue;
    const X=(gx+U.hash(gx+salt,gz*3+1))*st,Z=(gz+U.hash(gz+salt,gx*5+2))*st,dm=c.d(X,Z);if(dm<d0||dm>=d1)continue;
    if(bare.some(p=>inPoly(X,Z,p)))continue;const q=c.P(X,0,Z);if(q[0]<-60||q[0]>1980||q[1]<c.hor||q[1]>1140)continue;
    const s=U.clamp(c.f*0.42/dm,0.5,26);if(s<1.2)continue;
    D.push({d:dm,draw:ctx=>{const cc=hmq_fog(hmq_g(U.mix(col("ichu"),col("straw2"),hv*0.8),o.grey),dm,o.grey);ctx.strokeStyle=U.css(cc);ctx.lineWidth=Math.max(0.8,s*0.13);ctx.lineCap="round";ctx.beginPath();
      for(let k=0;k<6;k++){const an=-0.8+k*0.32+(hv-0.2)*0.3;ctx.moveTo(q[0],q[1]);ctx.quadraticCurveTo(q[0]+Math.sin(an)*s*0.45,q[1]-s*0.8,q[0]+Math.sin(an)*s*1.05,q[1]-Math.cos(an)*s*1.4);}ctx.stroke();
      if(s>7){ctx.strokeStyle=U.css(ink(cc,dm,120),0.5);ctx.lineWidth=Math.max(0.7,s*0.05);ctx.beginPath();for(let k=0;k<3;k++){const an=-0.5+k*0.5;ctx.moveTo(q[0],q[1]);ctx.quadraticCurveTo(q[0]+Math.sin(an)*s*0.4,q[1]-s*0.7,q[0]+Math.sin(an)*s*0.95,q[1]-Math.cos(an)*s*1.3);}ctx.stroke();}}});}}
  return D;}

/* a face in the world, filled and inked; seen: whether its outer side (normal n) faces the camera */
function face(ctx,c,pts,cc,dm,o){o=o||{};const q=hmq_clip(c,pts);if(q.length<3||!hmq_onScreen(q))return null;hmq_path(ctx,q);ctx.fillStyle=U.css(cc);ctx.fill();
  ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=o.lw||lwAt(c,dm,0.022,0.8,3.2);ctx.lineJoin="round";ctx.stroke();return q;}
const seen=(c,P0,n)=>(c.x-P0[0])*n[0]+(c.y-P0[1])*n[1]+(c.z-P0[2])*n[2]>0;
// lines across a face, in the world: courses of adobe, the ribs of a tin roof, the straws of a thatch
function lines(ctx,c,segs,cc,w){ctx.strokeStyle=U.css(cc);ctx.lineWidth=w;ctx.lineCap="round";ctx.beginPath();
  for(const [a,b] of segs){const A=c.cs(...a),B=c.cs(...b);if(A[2]<c.N||B[2]<c.N)continue;const pa=c.P(...a),pb=c.P(...b);ctx.moveTo(pa[0],pa[1]);ctx.lineTo(pb[0],pb[1]);}ctx.stroke();}

/* a house of adobe under a roof of ichu thatch (or, newer, of tin), its ridge along x; doors and windows in its front wall (towards -z) */
function house(c,o){const {x0,x1,z0,z1}=o,h=o.h||2.3,rg=o.ridge||4.0,ov=o.over||0.45,zm=(z0+z1)/2,g=o.grey,dm=c.d((x0+x1)/2,zm);
  const wall=hmq_g(o.wall||C.adobe,g),wall2=U.dk(wall,0.1),roofC=hmq_g(o.tin?C.tin:C.thatch,g),roofD=hmq_g(o.tin?C.tin2:C.thatch2,g);
  return{d:dm,draw:ctx=>{const F=cc=>hmq_fog(cc,dm,g),lw=lwAt(c,dm,0.022,0.8,3.2);
    // the back first, then the ends, the front, the roof
    if(c.z>z1)face(ctx,c,[[x0,0,z1],[x1,0,z1],[x1,h,z1],[x0,h,z1]],F(wall2),dm);
    for(const [xe,s] of [[x0,-1],[x1,1]]){if((c.x-xe)*s<=0)continue;
      const q=face(ctx,c,[[xe,0,z0],[xe,0,z1],[xe,h,z1],[xe,rg,zm],[xe,h,z0]],F(wall2),dm);
      if(q&&!o.plain){const segs=[];for(let y=0.42;y<h;y+=0.42)segs.push([[xe,y,z0+0.05],[xe,y,z1-0.05]]);lines(ctx,c,segs,U.css(U.dk(F(wall2),0.12),0.7),Math.max(0.6,lw*0.45));}}
    if(c.z<z0){face(ctx,c,[[x0,0,z0],[x1,0,z0],[x1,h,z0],[x0,h,z0]],F(wall),dm);
      // courses of adobe, faint, and a plinth of earth darker at its foot
      if(!o.plain){const segs=[];for(let y=0.42;y<h-0.1;y+=0.42)segs.push([[x0+0.05,y,z0-0.005],[x1-0.05,y,z0-0.005]]);ctx.save();lines(ctx,c,segs,U.css(U.dk(F(wall),0.12)),Math.max(0.6,lw*0.45));
        const vs=[];for(let y=0,r=0;y<h-0.42;y+=0.42,r++)for(let x=x0+(r%2?0.35:0.7);x<x1-0.2;x+=0.75)vs.push([[x,y,z0-0.005],[x,y+0.42,z0-0.005]]);ctx.globalAlpha*=0.55;lines(ctx,c,vs,U.css(U.dk(F(wall),0.12)),Math.max(0.5,lw*0.35));ctx.restore();
        face(ctx,c,[[x0,0,z0-0.01],[x1,0,z0-0.01],[x1,0.32,z0-0.01],[x0,0.32,z0-0.01]],F(U.dk(wall,0.14)),dm,{lw:Math.max(0.6,lw*0.6)});}
      for(const d of o.doors||[]){face(ctx,c,[[d.x-d.w/2-0.08,0,z0-0.02],[d.x+d.w/2+0.08,0,z0-0.02],[d.x+d.w/2+0.08,d.h+0.08,z0-0.02],[d.x-d.w/2-0.08,d.h+0.08,z0-0.02]],F(hmq_g(C.wood,g)),dm);
        face(ctx,c,[[d.x-d.w/2,0,z0-0.03],[d.x+d.w/2,0,z0-0.03],[d.x+d.w/2,d.h,z0-0.03],[d.x-d.w/2,d.h,z0-0.03]],F(hmq_g(d.open?[64,50,46]:C.door,g)),dm);
        if(!d.open)lines(ctx,c,[[[d.x,0.05,z0-0.035],[d.x,d.h-0.05,z0-0.035]]],U.css(U.dk(F(hmq_g(C.door,g)),0.25)),Math.max(0.6,lw*0.5));}
      for(const w of o.windows||[]){face(ctx,c,[[w.x-w.s/2-0.07,w.y-0.07,z0-0.02],[w.x+w.s/2+0.07,w.y-0.07,z0-0.02],[w.x+w.s/2+0.07,w.y+w.s+0.07,z0-0.02],[w.x-w.s/2-0.07,w.y+w.s+0.07,z0-0.02]],F(hmq_g(C.wood,g)),dm);
        face(ctx,c,[[w.x-w.s/2,w.y,z0-0.03],[w.x+w.s/2,w.y,z0-0.03],[w.x+w.s/2,w.y+w.s,z0-0.03],[w.x-w.s/2,w.y+w.s,z0-0.03]],F(hmq_g([70,60,60],g)),dm);}}
    // the roof: the back slope (only from above), then the front one, over the walls' tops; thick at its eaves
    const ey=h-0.25,front=[[x0-ov,ey,z0-ov],[x1+ov,ey,z0-ov],[x1+ov,rg+0.12,zm],[x0-ov,rg+0.12,zm]],back=[[x0-ov,ey,z1+ov],[x1+ov,ey,z1+ov],[x1+ov,rg+0.12,zm],[x0-ov,rg+0.12,zm]];
    const nF=[0,(zm-(z0-ov)),-(rg+0.12-ey)],nB=[0,(zm-(z1+ov))*-1,(rg+0.12-ey)];
    const slope=(pts,n,isFront)=>{if(!seen(c,pts[0],n))return;const q=face(ctx,c,pts,F(isFront?roofC:U.dk(roofC,0.06)),dm);if(!q)return;
      const zA=pts[0][2],segs=[];
      if(o.tin){for(let x=x0-ov+0.25;x<x1+ov;x+=0.32)segs.push([[x,ey+0.01,zA],[x,rg+0.11,zm]]);lines(ctx,c,segs,U.css(U.dk(F(roofC),0.16)),Math.max(0.6,lw*0.5));}
      else{const R=U.rnd(Math.round(x0*31+zA*7));for(let x=x0-ov+0.12;x<x1+ov-0.05;x+=0.16+R()*0.1){const t=0.25+R()*0.6;segs.push([[x,ey+0.01,zA],[x+(R()-0.5)*0.1,U.lerp(ey,rg,t),U.lerp(zA,zm,t)]]);}
        lines(ctx,c,segs,U.css(U.dk(F(roofC),0.2),0.8),Math.max(0.6,lw*0.42));
        // the eave's cut edge, thick straw
        const e0=c.P(x0-ov,ey,zA),e1=c.P(x1+ov,ey,zA),th=U.clamp(c.f*0.22/Math.max(1,c.d(x0,zA)),2,40);if(e0[2]>c.N&&e1[2]>c.N){ctx.fillStyle=U.css(F(roofD));ctx.beginPath();ctx.moveTo(e0[0],e0[1]);ctx.lineTo(e1[0],e1[1]);ctx.lineTo(e1[0]+th*0.1,e1[1]+th);ctx.lineTo(e0[0]-th*0.1,e0[1]+th);ctx.closePath();ctx.fill();ctx.strokeStyle=U.css(ink(F(roofD),dm));ctx.lineWidth=lw;ctx.stroke();
          ctx.strokeStyle=U.css(U.dk(F(roofD),0.22));ctx.lineWidth=Math.max(0.6,lw*0.5);ctx.beginPath();for(let k=1;k<40;k++){const t=k/40,x=U.lerp(e0[0],e1[0],t),y=U.lerp(e0[1],e1[1],t);ctx.moveTo(x,y+th*0.2);ctx.lineTo(x+(k%3-1)*0.8,y+th*0.95);}ctx.stroke();}}};
    slope(back,nB,false);slope(front,nF,true);
    lines(ctx,c,[[[x0-ov,rg+0.12,zm],[x1+ov,rg+0.12,zm]]],U.css(ink(F(roofD),dm)),lw*1.6);}};}

/* a wall of fieldstone, knee to hip high, along a line of points [x, z] */
function pirca(c,pts,o){o=o||{};const D=[],h=o.h||1.0,t=0.45,g=o.grey;
  for(let i=0;i<pts.length-1;i++){const [ax,az]=pts[i],[bx,bz]=pts[i+1],L=Math.hypot(bx-ax,bz-az),n=Math.max(1,Math.round(L/2.5));
    for(let k=0;k<n;k++){const u0=k/n,u1=(k+1)/n,x0=U.lerp(ax,bx,u0),z0=U.lerp(az,bz,u0),x1=U.lerp(ax,bx,u1),z1=U.lerp(az,bz,u1),nx=-(bz-az)/L*t/2,nz=(bx-ax)/L*t/2,dm=c.d((x0+x1)/2,(z0+z1)/2);
      D.push({d:dm,draw:ctx=>{const cc=hmq_fog(hmq_g(C.stone,g),dm,g),cd=hmq_fog(hmq_g(C.stone2,g),dm,g);
        const A=[x0+nx,z0+nz],B=[x1+nx,z1+nz],Cc=[x1-nx,z1-nz],Dd=[x0-nx,z0-nz];
        for(const [p,q] of [[A,B],[B,Cc],[Cc,Dd],[Dd,A]]){const mx=(p[0]+q[0])/2,mz=(p[1]+q[1])/2,nn=[(q[1]-p[1]),0,-(q[0]-p[0])];
          const cxm=(x0+x1)/2,czm=(z0+z1)/2;if((mx-cxm)*nn[0]+(mz-czm)*nn[2]<0){nn[0]*=-1;nn[2]*=-1;}if(!seen(c,[mx,h/2,mz],nn))continue;
          const fq=face(ctx,c,[[p[0],0,p[1]],[q[0],0,q[1]],[q[0],h,q[1]],[p[0],h,p[1]]],cd,dm);
          if(fq){const R=U.rnd(Math.round(mx*13+mz*7));ctx.strokeStyle=U.css(ink(cd,dm,180),0.55);ctx.lineWidth=lwAt(c,dm,0.012,0.5,1.8);ctx.beginPath();
            for(let r=0;r<3;r++){const y=h*(r+0.5)/3;for(let s=0;s<4;s++){const u=(s+R()*0.6+(r%2)*0.4)/4,X=U.lerp(p[0],q[0],u),Z=U.lerp(p[1],q[1],u),P2=c.P(X,y,Z);if(P2[2]<c.N)continue;const rr=U.clamp(c.f*0.16/P2[2],1,30);
              ctx.moveTo(P2[0]+rr,P2[1]);ctx.ellipse(P2[0],P2[1],rr,rr*0.62,0,0,Math.PI*2);}}ctx.stroke();}}
        face(ctx,c,[[A[0],h,A[1]],[B[0],h,B[1]],[Cc[0],h,Cc[1]],[Dd[0],h,Dd[1]]],cc,dm);}});}}
  return D;}

/* coils of finished cord on the ground, stacked: golden, a hole in the middle, the turns of the cord drawn round it */
function coils(c,X,Z,n,o){o=o||{};const r=o.r||0.34,th=0.11,dm=c.d(X,Z),g=o.grey;
  return{d:dm-(o.front||0),draw:ctx=>{const cc=hmq_fog(hmq_g(U.mix(col("rope"),[230,204,130],o.light||0),g),dm,g),cd=hmq_fog(hmq_g(col("ropeDk"),g),dm,g);
    for(let i=0;i<n;i++){const y=i*th+th,ox=(i%2?0.04:-0.03)+(o.dx||0)*i,P0=c.P(X+ox,y,Z),Px=c.P(X+ox+r,y,Z),Pz=c.P(X+ox,y,Z-r),Pz2=c.P(X+ox,y,Z+r);if(P0[2]<c.N+0.2)return;
      const rx=Math.abs(Px[0]-P0[0]),ry=Math.max(1.5,Math.abs(Pz[1]-Pz2[1])/2),side=Math.max(1.5,c.f*th/P0[2]),lw=lwAt(c,dm,0.012,0.7,2.6);
      ctx.fillStyle=U.css(U.dk(cc,0.12));ctx.beginPath();ctx.ellipse(P0[0],P0[1]+side*0.5,rx,ry,0,0,Math.PI);ctx.lineTo(P0[0]-rx,P0[1]-side*0.5);ctx.ellipse(P0[0],P0[1]-side*0.5,rx,ry,0,Math.PI,0,true);ctx.closePath();ctx.fill();
      ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=lw;ctx.stroke();
      ctx.fillStyle=U.css(cc);ctx.beginPath();ctx.ellipse(P0[0],P0[1]-side*0.5,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.strokeStyle=U.css(U.dk(cc,0.2));ctx.lineWidth=Math.max(0.6,lw*0.55);ctx.beginPath();for(const k of[0.78,0.6]){ctx.moveTo(P0[0]+rx*k,P0[1]-side*0.5);ctx.ellipse(P0[0],P0[1]-side*0.5,rx*k,ry*k,0,0,Math.PI*2);}ctx.stroke();
      ctx.fillStyle=U.css(cd);ctx.beginPath();ctx.ellipse(P0[0],P0[1]-side*0.5,rx*0.42,ry*0.42,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=lw;ctx.stroke();}}};}

/* a sheaf of cut grass, tied, standing or leaning (lean, in degrees, to screen right) */
function sheaf(c,X,Z,o){o=o||{};const dm=c.d(X,Z),g=o.grey,ht=o.ht||1.0;
  return{d:dm,draw:ctx=>{const p=c.P(X,0,Z);if(p[2]<c.N+0.3)return;const s=c.f/p[2],H=ht*s,W=0.36*s,lean=(o.lean||0)*Math.PI/180,cc=hmq_fog(hmq_g(U.mix(col("ichu"),col("straw"),0.35),g),dm,g);
    ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(lean);const lw=lwAt(c,dm,0.016,0.7,2.6);
    ctx.fillStyle=U.css(cc);ctx.beginPath();ctx.moveTo(-W*0.42,0);ctx.quadraticCurveTo(-W*0.18,-H*0.45,-W*0.5,-H);ctx.quadraticCurveTo(0,-H*1.08,W*0.5,-H);ctx.quadraticCurveTo(W*0.18,-H*0.45,W*0.42,0);ctx.closePath();ctx.fill();
    ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=lw;ctx.stroke();
    ctx.strokeStyle=U.css(U.dk(cc,0.22));ctx.lineWidth=Math.max(0.5,lw*0.45);ctx.beginPath();for(let k=-3;k<=3;k++){ctx.moveTo(k*W*0.1,-H*0.05);ctx.quadraticCurveTo(k*W*0.04,-H*0.45,k*W*0.15,-H*0.97);}ctx.stroke();
    ctx.fillStyle=U.css(hmq_fog(hmq_g(col("ropeDk"),g),dm,g));ctx.beginPath();U.rrect(ctx,-W*0.24,-H*0.5,W*0.48,H*0.06,1);ctx.fill();ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=lw*0.8;ctx.stroke();ctx.restore();}};}

// an irregular patch of ground, from a centre and radii round it
const blob=(cx,cz,rx,rz,seed)=>{const p=[];for(let i=0;i<22;i++){const a=i/22*Math.PI*2,k=0.86+0.22*U.hash(i*13+seed,seed);p.push([cx+Math.cos(a)*rx*k,cz+Math.sin(a)*rz*k]);}return p;};

/* the place, painted once: the sky, the ground, and everything on it that doesn't move, the furthest first */
function paint(ctx,c,things,o){hmq_sky(ctx,c,o.grey);ground(ctx,c,o);const D=tufts(c,o).concat(...things.map(f=>{const r=f(c);return Array.isArray(r)?r:[r];}));
  D.sort((a,b)=>b.d-a.d);for(const it of D)it.draw(ctx);}

/* a rope or a cable in the world: through points [x, y, z], ink round its colour; w: its thickness in metres. A thick one shows its
   twist, short strokes across it */
function rope(c,pts,o){o=o||{};const w=o.w||0.05,g=o.grey,D=[];
  for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],dm=c.d((a[0]+b[0])/2,(a[2]+b[2])/2);
    D.push({d:dm-(o.front||0),draw:ctx=>{const A=c.P(...a),B=c.P(...b);if(A[2]<c.N||B[2]<c.N)return;const lw=Math.max(1.2,c.f*w/((A[2]+B[2])/2)),cc=hmq_fog(hmq_g(o.c||col("rope"),g),dm,g);
      ctx.lineCap="round";ctx.strokeStyle=U.css(ink(cc,dm,200));ctx.lineWidth=lw+2.2;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();ctx.strokeStyle=U.css(cc);ctx.lineWidth=lw;ctx.stroke();
      if(lw>5&&o.braid!==false){ctx.strokeStyle=U.css(U.dk(cc,0.22));ctx.lineWidth=Math.max(0.8,lw*0.12);ctx.beginPath();const L=Math.hypot(B[0]-A[0],B[1]-A[1])||1,nx=(B[0]-A[0])/L,ny=(B[1]-A[1])/L,st=lw*0.9;
        for(let s=st*0.5;s<L;s+=st){const x=A[0]+nx*s,y=A[1]+ny*s;ctx.moveTo(x-ny*lw*0.42-nx*lw*0.2,y+nx*lw*0.42-ny*lw*0.2);ctx.lineTo(x+ny*lw*0.42+nx*lw*0.2,y-nx*lw*0.42+ny*lw*0.2);}ctx.stroke();}}});}
  return D;}
// a cable that sags between the points where hands hold it: [x, z] of each hand, the height they hold it at
function sagging(pts,hy,sag){const out=[];for(let i=0;i<pts.length-1;i++){const [ax,az]=pts[i],[bx,bz]=pts[i+1];for(let k=0;k<6;k++){const t=k/6;out.push([U.lerp(ax,bx,t),hy-sag*4*t*(1-t),U.lerp(az,bz,t)]);}}
  const l=pts[pts.length-1];out.push([l[0],hy,l[1]]);return out;}
return{C,paint,house,pirca,coils,sheaf,blob,rope,sagging,inPoly};})();

/* ---------------------------------------------------------------- the people of the bank, and what they hold */
// a girl beside her mother, with her family's cord
const HMV_KID2={key:"k2",name:"",kid:true,skin:[168,114,84],hair:{style:"long",c:[28,24,26]},top:{kind:"sweater",c:[96,124,110]},bottom:{kind:"skirt",c:[128,72,80]},shoe:[54,42,38],qhat:"felt",braid:true};
// a boy beside his grandfather, or his father
const HMV_BOY={key:"k4",name:"",kid:true,skin:[166,112,82],hair:{style:"short",c:[28,24,26]},top:{kind:"sweater",c:[150,96,72]},bottom:{kind:"trousers",c:[66,62,66]},shoe:[54,42,38],qhat:"cap",qcap:[178,90,80]};
// holding out a coil: both hands under it, in front
const HMV_GIVE={lean:4,head:8,aN:[30,70,"grip"],aF:[26,76,"grip"],lN:[-2,-2],lF:[5,4]};
// kneeling at the rows to check a cord: a hand on the coil in front of the knees, the other on the knee
const HMV_CHECK={mode:"kneel",lean:26,head:16,aN:[34,58,"grip"],aF:[14,40],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
// bent over a cable at the knee's height, both hands on it; holding a cable at the hip, both hands on it
const HMV_BRAID={lean:38,head:12,aN:[26,30,"grip"],aF:[18,36,"grip"],lN:[-12,-8],lF:[16,10]};
const HMV_HOLD={lean:8,head:4,aN:[12,46,"grip"],aF:[8,52,"grip"],lN:[-4,-2],lF:[8,4]};
// a coil of cord held in both hands: drawn at the person's own size (m: pixels in a metre where they are); at(h), where given, places
// its middle from the near hand's point h (so a cord handed over stays where it is)
const hmv_coilH=(m,at)=>(c,h)=>{const S=PK.S,U=PK.u,[x,y]=at?at(h):h,rx=0.22*m,ry=0.1*m,th=0.08*m;S.begin(c,{lw:U.clamp(m*0.008,1,3)});
  S.fill(c,cc=>{cc.ellipse(x,y+th*0.5,rx,ry,0,0,Math.PI);cc.lineTo(x-rx,y-th*0.5);cc.ellipse(x,y-th*0.5,rx,ry,0,Math.PI,0,true);cc.closePath();},U.dk(hmq_c("rope"),0.1),{});
  S.fill(c,cc=>U.ell(cc,x,y-th*0.5,rx,ry),hmq_c("rope"),{});
  S.line(c,cc=>{for(const k of[0.8,0.62]){cc.moveTo(x+rx*k,y-th*0.5);cc.ellipse(x,y-th*0.5,rx*k,ry*k,0,0,Math.PI*2);}},U.dk(hmq_c("rope"),0.2),U.clamp(m*0.004,0.7,1.6));
  S.fill(c,cc=>U.ell(cc,x,y-th*0.5,rx*0.42,ry*0.42),hmq_c("ropeDk"),{w:0.7});};
/* someone of the bank, as a drawable: hmq_folk with a coil in their hands drawn at their size (o.coil: over the near hand; "under":
   under it, the hand on its rim; o.coilAt places it, as hmv_coilH's at); o.k a child's height */
const hmv_folk=(c,who,X,Z,pose,o)=>{o=Object.assign({},o||{});o.opt=Object.assign({},o.opt||{});const m=c.f/c.d(X,Z)*(o.k||1);
  if(o.coil){o.opt[o.coil==="under"?"under":"hold"]=hmv_coilH(m,o.coilAt);o.opt.holds=true;}return hmq_folk(c,who,X,Z,pose,o);};
// whoever walks in with their family's cord: along a path of [X, Z], a coil held in front, then stands (o.then) where it ends
const hmv_bringer=(c,who,tt,path,t0,t1,o)=>{o=o||{};const m=c.f/c.d(path[path.length-1][0],path[path.length-1][1])*(o.k||1);
  return hmq_walker(c,who,tt,{path:path.map(([X,Z])=>[X,0,Z]),t0,t1,then:o.then||"armful",arms:{aN:PK.POSES.armful.aN,aF:PK.POSES.armful.aF},k:o.k},
    {key:o.key,opt:Object.assign({hold:hmv_coilH(m),holds:true},o.face||{expr:"neutral",gaze:[1,0]})});};
// a scene of the bank over its place, the furthest first: items are drawables, or functions of the camera that give one
function hmv_scene(ctx,c,items){const D=items.filter(Boolean).map(f=>typeof f==="function"?f(c):f).flat();D.sort((a,b)=>b.d-a.d);
  const out={};for(const it of D){const J=it.draw(ctx);if(it.key)out[it.key]=J;}return out;}

/* ---------------------------------------------------------------- day one: every cord checked in
   The bank above the gorge, from among the families: the rows of coils already checked in, laid out on bare earth; the path down
   from the hill, with families still coming along it; on the grass, women twisting the last of their cord */
const HMV_CK=hmq_camera({x:0,y:1.6,z:0,yaw:0,f:1000,hor:380,peakH:140,hillH:60});
const HMV_ROWS=[];for(let r=0;r<5;r++)for(let k=0;k<7;k++)HMV_ROWS.push([-4.4+r*1.05+(k%2)*0.12,4.4+k*1.25+(r%2)*0.4,k%3===1?2:1,((r*7+k)%5)*0.05]);
const HMV_CKG={patches:[{pts:[[1.6,13.4],[3.2,13.6],[-20,44],[-23,44]],c:HMV.C.path},{pts:HMV.blob(-2.0,8.6,4.0,4.9,7),c:[206,184,140]}],folds:[[-100,900,60],[1000,2040,80]],tuftDensity:0.5};
AG_PLACES.hmCheck=x=>HMV.paint(x,HMV_CK,HMV_ROWS.map(([X,Z,n,l])=>c=>HMV.coils(c,X,Z,n,{light:l})),HMV_CKG);
/* the people of day one at time tt (t0: the shot's start; give: when the woman hands her cord over). The man who checks stands at
   the end of the rows; a woman holds out her family's cord, her daughter beside her, and he checks it in her hands; she lets it go
   to him, he holds it at his chest to look it over, then kneels and lays it down in front of him, a hand left on it as he looks up;
   others wait their turn; more come down the path from the hill; two women twist the last of their cord. The cord is in one place
   at a time and drawn one way: its middle at HMV_HP while it is in both their hands, then carried on from there in his, and laid
   at HMV_LAY */
const HMV_KP=[1.1,4.9],HMV_WP=[1.9,4.72],HMV_HP=[1.5,1.0,4.8],HMV_LAY=[1.52,0.11,5.0];
// standing to take a coil from someone's hands; holding it at the chest to look it over, the head bent to it; kneeling to lay it down
const HMV_TAKE={lean:6,head:8,aN:[30,64,"grip"],aF:[26,70,"grip"],lN:[-2,-2],lF:[5,4]};
const HMV_LOOKS={lean:2,head:20,aN:[14,88,"grip"],aF:[20,94,"grip"],lN:[-2,-2],lF:[4,3]};
const HMV_PUT=Object.assign({},HMV_CHECK,{lean:50,head:6}),HMV_REST={mode:"kneel",lean:46,head:-12,aN:[40,30,"grip"],aF:[10,30],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
function hmv_check(x,tt,t0,give){const c=HMV_CK,U=PK.u,m=c.f/c.d(HMV_HP[0],HMV_HP[2]),hp=c.P(...HMV_HP),lay=c.P(...HMV_LAY),rx=0.22*m,ry=0.1*m,th=0.08*m;
  const io=(a,d)=>U.sine(U.clamp((tt-a)/d,0,1)),down=give+2.3;
  // where a hand holds the cord whose middle is C: on its rim at the side s (-1 its left, 1 its right), the near hand at the front
  const rim=(C,s,near)=>near?[C[0]+s*rx*0.62,C[1]+th*0.5+ry*0.35]:[C[0]+s*rx*0.96,C[1]-ry*0.15];
  // his hands: onto her cord, then it is his, held at his chest; he kneels and lays it down; then the far hand on his knee, the near
  // hand left on the cord as he looks up at her
  const on=io(t0+0.6,0.5)*(1-io(give,0.6)),up=io(give,0.6),kn=io(down,0.6),put=io(down+0.2,0.6);
  const kp=PK.poseMix(PK.poseMix(PK.poseMix("listen",HMV_TAKE,io(t0+0.6,0.5)),HMV_LOOKS,up),PK.poseMix(HMV_PUT,HMV_REST,io(down+1.2,0.6)),kn);
  const kr=on>0.001?{reachN:rim(hp,-1,true),reachF:rim(hp,-1,false),reachNk:on,reachFk:on}:put>0.001?{reachN:[lay[0]-rx*0.75,lay[1]-th*0.5],reachF:[lay[0]-rx*0.98,lay[1]-th*0.2],reachNk:put,reachFk:put*(1-io(down+1.2,0.6))}:{};
  // the cord's middle: where it is in both their hands, then where his near hand holds its rim, then where it is laid
  const at=h=>{const H=[h[0]+rx*0.62,h[1]-th*0.5-ry*0.35],k=up,q=io(down+0.2,0.6);return[U.lerp(U.lerp(hp[0],H[0],k),lay[0],q),U.lerp(U.lerp(hp[1],H[1],k),lay[1],q)];};
  const wr=1-io(give,0.5);
  return hmv_scene(x,c,[
    // he and the cord she brought, under his near hand from the first (laid, it stays where it is)
    hmv_folk(c,"keeper",HMV_KP[0],HMV_KP[1],kp,{t:tt,flip:false,key:"keeper",coil:"under",coilAt:at,opt:Object.assign({holds:true},kr,PK.face(tt,{expr:"neutral",gaze:[1,0.5]},[[give-1.2,"look",1.6,[1,0.1]],[give+0.8,"nod"],[down+1.4,"smile",2.4]]))}),
    hmv_folk(c,"w4",HMV_WP[0],HMV_WP[1],PK.poseMix("stand",HMV_GIVE,wr),{t:tt+1,flip:true,opt:Object.assign({holds:wr>0.5,reachN:rim(hp,1,true),reachF:rim(hp,1,false),reachNk:wr,reachFk:wr},PK.face(tt,{expr:"smile",gaze:[1,0.4]},[[t0+1.4,"look",2.0,[1,0.1]],[give+0.5,"nod"]]))}),
    hmv_folk(c,HMV_KID2,2.85,4.15,"stand",{t:tt+2,flip:true,k:0.7,opt:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[t0+3,"look",2.2,[1,0.5]]])}),
    // others wait their turn with their cord
    hmv_folk(c,"m1",4.7,7.6,"armful",{t:tt+3,flip:true,coil:true,opt:PK.face(tt,{expr:"neutral",gaze:[1,0.2]},[[t0+4.2,"look",2.2,[1,0.4]],[t0+11,"nod"]])}),
    hmv_folk(c,"w1",5.4,10.8,"armful",{t:tt+4,flip:true,coil:true,opt:PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[t0+7,"look",2.4,[1,0.3]]])}),
    // families still coming down the path from the hill, each with its cord
    hmv_bringer(c,"m5",tt,[[-6.2,24],[-1.0,17.5],[1.6,14.2]],t0-6,t0+7,{then:"armful"}),
    hmv_bringer(c,"w5",tt,[[-10.6,30],[-4.6,22],[-1.4,18.2]],t0-2,t0+9,{then:"armful"}),
    hmv_bringer(c,4,tt,[[-15.4,36],[-8.6,27]],t0+1,t0+11),hmv_bringer(c,5,tt,[[-21,43],[-13.4,33]],t0+3,t0+14),
    hmv_folk(c,6,-19,40,"stand",{t:tt+5,flip:false}),
    // on the grass, two women twist the last of their cord
    hmv_folk(c,"w2",-6.6,9.5,HMQ_TWIST,{t:tt+6,flip:false,len:0.9}),hmv_folk(c,7,-8.6,11.8,HMQ_TWIST,{t:tt+7,flip:true,len:0.9})]);}

/* ---------------------------------------------------------------- day one, from midday: three ropes braided into each cable
   On the bank, the cable grows from where three ropes meet: the man who braids it bends over that point, with hands and feet, and
   three men hold the three ropes; along the cable, many hands hold it up; coils still to be braided lie near, and a woman twists more
   cord. When he tires, he stands and steps back, and the man who waits beside him kneels in his place */
const HMV_BR=hmq_camera({x:0,y:1.45,z:0,yaw:0,f:1000,hor:420,peakH:130,hillH:56});
const HMV_BP=[-1.0,6.5],HMV_BHY=0.66,HMV_BLINE=(()=>{const L=[HMV_BP];for(let k=1;k<8;k++)L.push([HMV_BP[0]+2.6*k,HMV_BP[1]+2.4*k]);return L;})();
const HMV_BENDS=[[-3.5,5.7],[-3.4,6.6],[-3.1,7.6]];
AG_PLACES.hmBraid=x=>HMV.paint(x,HMV_BR,[c=>HMV.coils(c,1.7,3.9,3),c=>HMV.coils(c,2.5,4.3,2,{light:0.2}),c=>HMV.coils(c,1.2,4.6,1,{light:0.1})],{folds:[[-120,820,62],[980,2040,84]],tuftDensity:0.5});
function hmv_braid(x,tt,t0,tire,o){o=o||{};const c=HMV_BR,U=PK.u,B=HMV_BP,hy=HMV_BHY,ts=tire+0.5;
  const it=[HMV.rope(c,HMV.sagging(HMV_BLINE,hy,0.1),{w:0.12})];
  for(const e of HMV_BENDS)it.push(HMV.rope(c,[[B[0],hy,B[1]],[U.lerp(B[0],e[0],0.5),hy+0.03,U.lerp(B[1],e[1],0.5)],[e[0]+0.3,hy+0.05,e[1]]],{w:0.05,braid:false}));
  it.push(hmv_folk(c,"m1",HMV_BENDS[0][0]-0.15,HMV_BENDS[0][1],HMV_HOLD,{t:tt,flip:false}),hmv_folk(c,"m5",HMV_BENDS[1][0]-0.15,HMV_BENDS[1][1],HMV_HOLD,{t:tt+1,flip:false}),
    hmv_folk(c,8,HMV_BENDS[2][0]-0.15,HMV_BENDS[2][1],HMV_HOLD,{t:tt+2,flip:false}));
  // the one who braids, until he tires: he straightens, then steps back and aside
  const up=U.sine(U.clamp((tt-ts)/0.5,0,1));
  if(tt<ts+0.6)it.push(hmv_folk(c,"keeper",B[0]+0.55,B[1]+0.2,PK.poseMix(HMV_BRAID,"stand",up),{t:tt,flip:true,opt:PK.face(tt,{expr:"neutral",gaze:[1,0.8]},[[ts+0.2,"look",2.6,[1,0.1]]])}));
  else it.push(hmq_walker(c,"keeper",tt,{path:[[B[0]+0.55,0,B[1]+0.2],[B[0]+1.7,0,B[1]-1.6]],t0:ts+0.6,t1:ts+2.6,then:"stand"},{opt:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[ts+2.8,"nod"]])}));
  // the one who takes his place: standing ready beside him, then he steps in and bends to the cable
  const sw=ts+0.9,dn=U.sine(U.clamp((tt-sw-1.0)/0.5,0,1));
  if(tt<sw)it.push(hmv_folk(c,"m4",B[0]+1.3,B[1]-0.9,"stand",{t:tt+3,flip:true,opt:PK.face(tt,{expr:"smile",gaze:[1,0.3]},[[t0+2,"look",2.2,[1,0.7]],[ts,"nod"]])}));
  else if(tt<sw+1.0)it.push(hmq_walker(c,"m4",tt,{path:[[B[0]+1.3,0,B[1]-0.9],[B[0]+0.55,0,B[1]+0.2]],t0:sw,t1:sw+1.0,then:"stand"},{opt:{expr:"neutral",gaze:[1,0.6]}}));
  else it.push(hmv_folk(c,"m4",B[0]+0.55,B[1]+0.2,PK.poseMix("stand",HMV_BRAID,dn),{t:tt+3,flip:true,opt:{expr:"neutral",gaze:[1,0.8]}}));
  // many hands along the cable
  HMV_BLINE.slice(1,7).forEach((p,k)=>it.push(hmv_folk(c,[9,"m2",10,"m3",11,12][k],p[0]+0.2,p[1]+0.45,HMV_HOLD,{t:tt+4+k,flip:true})));
  // a woman twists more cord beside the coils still to be braided
  it.push(hmv_folk(c,"w5",2.95,3.9,HMQ_TWIST,{t:tt+11,flip:true,len:0.8,opt:PK.face(tt,{expr:"neutral",gaze:[1,0.7]},[[t0+2.8,"look",2.0,[1,0.2]],[t0+7.6,"smile",2.4],[t0+12.4,"look",2.2,[1,0.3]],[t0+16.8,"nod"]])}));
  // o.kids: the way passed on by doing it, a daughter twisting beside her mother, a son holding the cable beside his father
  if(o.kids){it.push(hmv_folk(c,HMV_KID2,3.55,3.5,HMQ_TWIST,{t:tt+12,flip:true,k:0.7,len:0.5,opt:PK.face(tt,{expr:"think",gaze:[1,0.6]},[[t0+2.6,"look",2.0,[1,0.2]],[t0+4.8,"smile",2.4]])}));
    const p=HMV_BLINE[2];it.push(hmv_folk(c,HMV_BOY,p[0]-0.25,p[1]+0.05,HMV_HOLD,{t:tt+13,flip:true,k:0.72,opt:PK.face(tt,{expr:"smile",gaze:[1,0.3]},[[t0+3.4,"look",2.2,[1,0.1]]])}));}
  return hmv_scene(x,c,it);}
