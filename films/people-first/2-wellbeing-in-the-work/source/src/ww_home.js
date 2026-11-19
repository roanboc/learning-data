/* ===== At home in Quehue, June 2021: the cord made again =====
   In June 2021 the communities wove the bridge again "with their own means", and the cord for it is made at home: each family
   promises one of forty arm spans, twisted by hand from dried grass, with the children taking part (the Ministry of Culture's study,
   2015, page 177). The author chose this picture as the film's tile (19 November 2026): a family in its yard, the grandmother and a
   grandchild twisting on the bench by the door, the mother kneeling to twist, the cord running out across the yard to the father,
   who coils it, a child bringing more grass from where it dries in the sun, and last days' coils stacked by the wall.
   It is drawn in the gorge's world and ink line (ww_gorge.js): in metres, the people kit's people at their true size where they
   stand. Away from the gorge, x is simply to the right and z ahead of the camera. What doesn't move is painted once, as a place
   (AG_PLACES.wwHome): the sky, the ground, its tufts of ichu, the houses, the walls of fieldstone, the bench, the sheaves and the
   coils. The family is drawn over it every frame, the furthest first (wwv_scene). Nobody drawn is a likeness of anyone, and the
   houses are of no one house: adobe under ichu thatch, and newer tin, as photographs of Quehue show (looked at for shapes and
   colours only, nothing traced). Drawn first for the author's review (18 November 2026), then made the film's own here. */
const WWV=(()=>{
const U=PK.u,col=wwq_c,INK=()=>PK.S.ink;
const C={adobe:[186,142,106],plaster:[214,190,156],door:[96,66,50],thatch:[202,170,104],thatch2:[170,138,80],
  tin:[168,172,176],tin2:[140,146,152],stone:[178,168,152],stone2:[150,140,126],yard:[204,176,132],path:[196,168,124],wood:[132,96,68]};
const inPoly=(x,z,p)=>{let a=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,zi]=p[i],[xj,zj]=p[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)a=!a;}return a;};
const ink=(cc,dm,k)=>U.mix(INK(),cc,U.clamp(dm/(k||260),0,0.6));
const lwAt=(c,dm,k,a,b)=>U.clamp(c.f*(k||0.02)/Math.max(dm,0.5),a||0.8,b||3.2);

/* the ground: one sweep of ichu from the horizon to our feet, the far slopes folding down to it, yards and paths of bare earth,
   and grass spread in the sun to dry (a patch's straw: its straws, each a short stroke lying on the ground) */
function ground(ctx,c,o){const g=o.grey,hz=c.hor;
  const gr=ctx.createLinearGradient(0,hz,0,1080);gr.addColorStop(0,U.css(wwq_fog(wwq_g(col("straw3"),g),300,g)));gr.addColorStop(0.25,U.css(wwq_fog(wwq_g(U.mix(col("straw2"),col("straw3"),0.5),g),60,g)));
  gr.addColorStop(1,U.css(wwq_g(col("straw2"),g)));ctx.fillStyle=gr;ctx.fillRect(0,hz+6,1920,1080-hz);
  const S=PK.S;S.begin(ctx,{lw:1.6,far:0.5});
  for(const [a,b,hh] of o.folds||[]){S.poly(ctx,[[a,hz+30,1],[a+(b-a)*0.18,hz-hh*0.5],[a+(b-a)*0.5,hz-hh],[a+(b-a)*0.82,hz-hh*0.55],[b,hz+30,1]],wwq_fog(wwq_g(col("straw"),g),180,g),{exact:true,ten:0.6});}
  const P=(o.patches||[]).map(p=>({p,dm:c.d(p.pts.reduce((s,q)=>s+q[0],0)/p.pts.length,p.pts.reduce((s,q)=>s+q[1],0)/p.pts.length)})).sort((a,b)=>b.dm-a.dm);
  for(const {p,dm} of P){const q=wwq_clip(c,p.pts.map(([x,z])=>[x,0,z]));if(q.length<3)continue;const cc=wwq_fog(wwq_g(p.c||C.yard,g),dm,g);
    wwq_path(ctx,q);ctx.fillStyle=U.css(cc);ctx.fill();ctx.strokeStyle=U.css(U.mix(cc,col("straw2"),0.5));ctx.lineWidth=lwAt(c,dm,0.05,1,6);ctx.lineJoin="round";ctx.stroke();
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
    D.push({d:dm,draw:ctx=>{const cc=wwq_fog(wwq_g(U.mix(col("ichu"),col("straw2"),hv*0.8),o.grey),dm,o.grey);ctx.strokeStyle=U.css(cc);ctx.lineWidth=Math.max(0.8,s*0.13);ctx.lineCap="round";ctx.beginPath();
      for(let k=0;k<6;k++){const an=-0.8+k*0.32+(hv-0.2)*0.3;ctx.moveTo(q[0],q[1]);ctx.quadraticCurveTo(q[0]+Math.sin(an)*s*0.45,q[1]-s*0.8,q[0]+Math.sin(an)*s*1.05,q[1]-Math.cos(an)*s*1.4);}ctx.stroke();
      if(s>7){ctx.strokeStyle=U.css(ink(cc,dm,120),0.5);ctx.lineWidth=Math.max(0.7,s*0.05);ctx.beginPath();for(let k=0;k<3;k++){const an=-0.5+k*0.5;ctx.moveTo(q[0],q[1]);ctx.quadraticCurveTo(q[0]+Math.sin(an)*s*0.4,q[1]-s*0.7,q[0]+Math.sin(an)*s*0.95,q[1]-Math.cos(an)*s*1.3);}ctx.stroke();}}});}}
  return D;}

/* a face in the world, filled and inked; seen: whether its outer side (normal n) faces the camera */
function face(ctx,c,pts,cc,dm,o){o=o||{};const q=wwq_clip(c,pts);if(q.length<3||!wwq_onScreen(q))return null;wwq_path(ctx,q);ctx.fillStyle=U.css(cc);ctx.fill();
  ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=o.lw||lwAt(c,dm,0.022,0.8,3.2);ctx.lineJoin="round";ctx.stroke();return q;}
const seen=(c,P0,n)=>(c.x-P0[0])*n[0]+(c.y-P0[1])*n[1]+(c.z-P0[2])*n[2]>0;
// lines across a face, in the world: courses of adobe, the ribs of a tin roof, the straws of a thatch
function lines(ctx,c,segs,cc,w){ctx.strokeStyle=U.css(cc);ctx.lineWidth=w;ctx.lineCap="round";ctx.beginPath();
  for(const [a,b] of segs){const A=c.cs(...a),B=c.cs(...b);if(A[2]<c.N||B[2]<c.N)continue;const pa=c.P(...a),pb=c.P(...b);ctx.moveTo(pa[0],pa[1]);ctx.lineTo(pb[0],pb[1]);}ctx.stroke();}

/* a house of adobe under a roof of ichu thatch (or, newer, of tin), its ridge along x; doors and windows in its front wall (towards -z) */
function house(c,o){const {x0,x1,z0,z1}=o,h=o.h||2.3,rg=o.ridge||4.0,ov=o.over||0.45,zm=(z0+z1)/2,g=o.grey,dm=c.d((x0+x1)/2,zm);
  const wall=wwq_g(o.wall||C.adobe,g),wall2=U.dk(wall,0.1),roofC=wwq_g(o.tin?C.tin:C.thatch,g),roofD=wwq_g(o.tin?C.tin2:C.thatch2,g);
  return{d:dm,draw:ctx=>{const F=cc=>wwq_fog(cc,dm,g),lw=lwAt(c,dm,0.022,0.8,3.2);
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
      for(const d of o.doors||[]){face(ctx,c,[[d.x-d.w/2-0.08,0,z0-0.02],[d.x+d.w/2+0.08,0,z0-0.02],[d.x+d.w/2+0.08,d.h+0.08,z0-0.02],[d.x-d.w/2-0.08,d.h+0.08,z0-0.02]],F(wwq_g(C.wood,g)),dm);
        face(ctx,c,[[d.x-d.w/2,0,z0-0.03],[d.x+d.w/2,0,z0-0.03],[d.x+d.w/2,d.h,z0-0.03],[d.x-d.w/2,d.h,z0-0.03]],F(wwq_g(d.open?[64,50,46]:C.door,g)),dm);
        if(!d.open)lines(ctx,c,[[[d.x,0.05,z0-0.035],[d.x,d.h-0.05,z0-0.035]]],U.css(U.dk(F(wwq_g(C.door,g)),0.25)),Math.max(0.6,lw*0.5));}
      for(const w of o.windows||[]){face(ctx,c,[[w.x-w.s/2-0.07,w.y-0.07,z0-0.02],[w.x+w.s/2+0.07,w.y-0.07,z0-0.02],[w.x+w.s/2+0.07,w.y+w.s+0.07,z0-0.02],[w.x-w.s/2-0.07,w.y+w.s+0.07,z0-0.02]],F(wwq_g(C.wood,g)),dm);
        face(ctx,c,[[w.x-w.s/2,w.y,z0-0.03],[w.x+w.s/2,w.y,z0-0.03],[w.x+w.s/2,w.y+w.s,z0-0.03],[w.x-w.s/2,w.y+w.s,z0-0.03]],F(wwq_g([70,60,60],g)),dm);}}
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
      D.push({d:dm,draw:ctx=>{const cc=wwq_fog(wwq_g(C.stone,g),dm,g),cd=wwq_fog(wwq_g(C.stone2,g),dm,g);
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
  return{d:dm-(o.front||0),draw:ctx=>{const cc=wwq_fog(wwq_g(U.mix(col("rope"),[230,204,130],o.light||0),g),dm,g),cd=wwq_fog(wwq_g(col("ropeDk"),g),dm,g);
    for(let i=0;i<n;i++){const y=i*th+th,ox=(i%2?0.04:-0.03)+(o.dx||0)*i,P0=c.P(X+ox,y,Z),Px=c.P(X+ox+r,y,Z),Pz=c.P(X+ox,y,Z-r),Pz2=c.P(X+ox,y,Z+r);if(P0[2]<c.N+0.2)return;
      const rx=Math.abs(Px[0]-P0[0]),ry=Math.max(1.5,Math.abs(Pz[1]-Pz2[1])/2),side=Math.max(1.5,c.f*th/P0[2]),lw=lwAt(c,dm,0.012,0.7,2.6);
      ctx.fillStyle=U.css(U.dk(cc,0.12));ctx.beginPath();ctx.ellipse(P0[0],P0[1]+side*0.5,rx,ry,0,0,Math.PI);ctx.lineTo(P0[0]-rx,P0[1]-side*0.5);ctx.ellipse(P0[0],P0[1]-side*0.5,rx,ry,0,Math.PI,0,true);ctx.closePath();ctx.fill();
      ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=lw;ctx.stroke();
      ctx.fillStyle=U.css(cc);ctx.beginPath();ctx.ellipse(P0[0],P0[1]-side*0.5,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.strokeStyle=U.css(U.dk(cc,0.2));ctx.lineWidth=Math.max(0.6,lw*0.55);ctx.beginPath();for(const k of[0.78,0.6]){ctx.moveTo(P0[0]+rx*k,P0[1]-side*0.5);ctx.ellipse(P0[0],P0[1]-side*0.5,rx*k,ry*k,0,0,Math.PI*2);}ctx.stroke();
      ctx.fillStyle=U.css(cd);ctx.beginPath();ctx.ellipse(P0[0],P0[1]-side*0.5,rx*0.42,ry*0.42,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=lw;ctx.stroke();}}};}

/* a sheaf of cut grass, tied, standing or leaning (lean, in degrees, to screen right) */
function sheaf(c,X,Z,o){o=o||{};const dm=c.d(X,Z),g=o.grey,ht=o.ht||1.0;
  return{d:dm,draw:ctx=>{const p=c.P(X,0,Z);if(p[2]<c.N+0.3)return;const s=c.f/p[2],H=ht*s,W=0.36*s,lean=(o.lean||0)*Math.PI/180,cc=wwq_fog(wwq_g(U.mix(col("ichu"),col("straw"),0.35),g),dm,g);
    ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(lean);const lw=lwAt(c,dm,0.016,0.7,2.6);
    ctx.fillStyle=U.css(cc);ctx.beginPath();ctx.moveTo(-W*0.42,0);ctx.quadraticCurveTo(-W*0.18,-H*0.45,-W*0.5,-H);ctx.quadraticCurveTo(0,-H*1.08,W*0.5,-H);ctx.quadraticCurveTo(W*0.18,-H*0.45,W*0.42,0);ctx.closePath();ctx.fill();
    ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=lw;ctx.stroke();
    ctx.strokeStyle=U.css(U.dk(cc,0.22));ctx.lineWidth=Math.max(0.5,lw*0.45);ctx.beginPath();for(let k=-3;k<=3;k++){ctx.moveTo(k*W*0.1,-H*0.05);ctx.quadraticCurveTo(k*W*0.04,-H*0.45,k*W*0.15,-H*0.97);}ctx.stroke();
    ctx.fillStyle=U.css(wwq_fog(wwq_g(col("ropeDk"),g),dm,g));ctx.beginPath();U.rrect(ctx,-W*0.24,-H*0.5,W*0.48,H*0.06,1);ctx.fill();ctx.strokeStyle=U.css(ink(cc,dm));ctx.lineWidth=lw*0.8;ctx.stroke();ctx.restore();}};}

/* a low bench of adobe along a wall (x0 to x1, its front at z), for sitting */
function bench(c,x0,x1,z,o){const h=0.42,dm=c.d((x0+x1)/2,z+0.25);return{d:dm,draw:ctx=>{const cc=wwq_g(U.lt(C.adobe,0.05),o&&o.grey);
  const F=(pts,k)=>{const q=wwq_clip(c,pts);if(q.length<3)return;wwq_path(ctx,q);ctx.fillStyle=U.css(k);ctx.fill();ctx.strokeStyle=U.css(INK());ctx.lineWidth=U.clamp(c.f*0.02/dm,0.8,3);ctx.lineJoin="round";ctx.stroke();};
  F([[x0,h,z],[x1,h,z],[x1,h,z+0.5],[x0,h,z+0.5]],U.lt(cc,0.08));F([[x0,0,z],[x1,0,z],[x1,h,z],[x0,h,z]],cc);if(c.x<x0)F([[x0,0,z],[x0,0,z+0.5],[x0,h,z+0.5],[x0,h,z]],U.dk(cc,0.1));if(c.x>x1)F([[x1,0,z],[x1,0,z+0.5],[x1,h,z+0.5],[x1,h,z]],U.dk(cc,0.1));}};}
// an irregular patch of ground, from a centre and radii round it
const blob=(cx,cz,rx,rz,seed)=>{const p=[];for(let i=0;i<22;i++){const a=i/22*Math.PI*2,k=0.86+0.22*U.hash(i*13+seed,seed);p.push([cx+Math.cos(a)*rx*k,cz+Math.sin(a)*rz*k]);}return p;};

/* the place, painted once: the sky, the ground, and everything on it that doesn't move, the furthest first */
function paint(ctx,c,things,o){wwq_sky(ctx,c,o.grey);ground(ctx,c,o);const D=tufts(c,o).concat(...things.map(f=>{const r=f(c);return Array.isArray(r)?r:[r];}));
  D.sort((a,b)=>b.d-a.d);for(const it of D)it.draw(ctx);}
return{C,paint,house,pirca,coils,sheaf,bench,blob};})();

/* ---------------------------------------------------------------- the family, and what they hold
   Two children of the family: a girl on the bench, twisting beside her grandmother, and a boy bringing grass */
const WWV_KID={key:"k1",name:"",kid:true,skin:[174,120,88],hair:{style:"short",c:[30,26,26]},top:{kind:"sweater",c:[182,96,76]},bottom:{kind:"trousers",c:[70,74,96]},shoe:[54,42,38]};
const WWV_KID2={key:"k2",name:"",kid:true,skin:[168,114,84],hair:{style:"long",c:[28,24,26]},top:{kind:"sweater",c:[96,124,110]},bottom:{kind:"skirt",c:[128,72,80]},shoe:[54,42,38],qhat:"felt",braid:true};
// sitting on a low seat to twist cord: hands together over the knees, seen from the side
const WWV_TWISTSIT={mode:"sit",lean:16,head:14,aN:[36,70,"grip"],aF:[32,74,"grip"],lN:[84,4],lF:[80,-4]};
// kneeling to twist: the gorge's pose, as a pose of its own, so the cord runs to the father's coil rather than to the ground (wwq_folk
// draws a twisted cord to the ground for WWQ_TWIST itself)
const WWV_TWIST=Object.assign({},WWQ_TWIST);
// kneeling to coil the cord as it comes: both hands at the coil, in front of the knees
const WWV_COILING={mode:"kneel",lean:22,head:10,aN:[30,62,"grip"],aF:[24,68,"grip"],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
// a coil of cord held in both hands, and an armful of grass: drawn at the person's own size (m: pixels in a metre where they are)
const wwv_coilH=m=>(c,h)=>{const S=PK.S,U=PK.u,[x,y]=h,rx=0.22*m,ry=0.1*m,th=0.08*m;S.begin(c,{lw:U.clamp(m*0.008,1,3)});
  S.fill(c,cc=>{cc.ellipse(x,y+th*0.5,rx,ry,0,0,Math.PI);cc.lineTo(x-rx,y-th*0.5);cc.ellipse(x,y-th*0.5,rx,ry,0,Math.PI,0,true);cc.closePath();},U.dk(wwq_c("rope"),0.1),{});
  S.fill(c,cc=>U.ell(cc,x,y-th*0.5,rx,ry),wwq_c("rope"),{});
  S.line(c,cc=>{for(const k of[0.8,0.62]){cc.moveTo(x+rx*k,y-th*0.5);cc.ellipse(x,y-th*0.5,rx*k,ry*k,0,0,Math.PI*2);}},U.dk(wwq_c("rope"),0.2),U.clamp(m*0.004,0.7,1.6));
  S.fill(c,cc=>U.ell(cc,x,y-th*0.5,rx*0.42,ry*0.42),wwq_c("ropeDk"),{w:0.7});};
const wwv_armful=m=>(c,h)=>{const S=PK.S,U=PK.u,[x,y]=h,L=0.62*m,W=0.1*m,cc=U.mix(wwq_c("ichu"),wwq_c("straw"),0.3);S.begin(c,{lw:U.clamp(m*0.008,1,3)});
  S.fill(c,c2=>{c2.moveTo(x-L*0.5,y-W*1.3);c2.quadraticCurveTo(x-L*0.2,y-W*0.5,x,y-W*0.5);c2.quadraticCurveTo(x+L*0.2,y-W*0.5,x+L*0.5,y-W*1.4);c2.lineTo(x+L*0.54,y+W*1.2);
    c2.quadraticCurveTo(x+L*0.2,y+W*0.5,x,y+W*0.5);c2.quadraticCurveTo(x-L*0.2,y+W*0.5,x-L*0.52,y+W*1.2);c2.closePath();},cc,{});
  S.line(c,c2=>{for(let k=0;k<6;k++){const f=(k-2.5)/2.5;c2.moveTo(x-L*0.5,y+f*W*1.2);c2.quadraticCurveTo(x-L*0.2,y+f*W*0.45,x,y+f*W*0.4);c2.quadraticCurveTo(x+L*0.2,y+f*W*0.45,x+L*0.5,y+f*W*1.25);}},U.dk(cc,0.22),U.clamp(m*0.003,0.6,1.4));
  S.fill(c,c2=>U.rrect(c2,x-W*0.32,y-W*0.62,W*0.64,W*1.24,2),wwq_c("ropeDk"),{w:0.7});};
/* someone of the family, as a drawable: wwq_folk with what they hold drawn at their size (o.coil, o.armful); o.k a child's height */
const wwv_folk=(c,who,X,Z,pose,o)=>{o=Object.assign({},o||{});o.opt=Object.assign({},o.opt||{});const m=c.f/c.d(X,Z)*(o.k||1);
  if(o.coil){o.opt.hold=wwv_coilH(m);o.opt.holds=true;}if(o.armful){o.opt.hold=wwv_armful(m);o.opt.holds=true;}
  return wwq_folk(c,who,X,Z,pose,o);};

/* ---------------------------------------------------------------- the yard, seen from its gate: the camera stands at the origin */
const WWV_CAM=wwq_camera({x:0,y:1.42,z:0,yaw:0,f:1080,hor:420,peakH:120,hillH:56});
const WWV_GROUND={patches:[{pts:WWV.blob(-1.6,6.6,7.4,4.2,3),straw:90,L:0.16,w:0.008},{pts:WWV.blob(3.0,3.2,2.6,1.45,11),c:[214,186,124],straw:2200,dir:0.4,L:0.34,w:0.014},{pts:[[3.5,9.8],[5.5,9.6],[16,40],[13,40]],c:WWV.C.path}],
  bare:[[[-6,9.6],[2.6,9.6],[2.6,14.4],[-6,14.4]]],folds:[[-200,700,70],[1150,2100,90]],tuftDensity:0.5};
const WWV_THINGS=[
  c=>WWV.house(c,{x0:-6.0,x1:2.6,z0:9.6,z1:14.4,h:2.4,ridge:4.1,doors:[{x:-1.9,w:0.95,h:1.85,open:true}],windows:[{x:0.9,y:1.05,s:0.55}]}),
  c=>WWV.house(c,{x0:-19,x1:-11.5,z0:21,z1:26,h:2.3,ridge:3.8}),c=>WWV.house(c,{x0:8,x1:15,z0:24,z1:29,h:2.3,ridge:3.6,tin:true,windows:[{x:11.5,y:1.0,s:0.5}]}),
  c=>WWV.house(c,{x0:-34,x1:-27,z0:44,z1:49,h:2.2,ridge:3.6,tin:true}),
  c=>WWV.pirca(c,[[2.9,9.8],[7.2,9.8],[7.2,2.6]]),c=>WWV.pirca(c,[[-6.3,9.8],[-8.6,9.8],[-8.6,2.8]]),c=>WWV.bench(c,-0.6,1.9,9.05),
  c=>WWV.sheaf(c,-5.5,9.25,{lean:-6}),c=>WWV.sheaf(c,-5.0,9.3,{lean:3}),c=>WWV.sheaf(c,-4.5,9.28,{lean:-2,ht:0.92}),c=>WWV.sheaf(c,-4.0,9.3,{lean:5,ht:0.96}),
  c=>WWV.coils(c,-3.5,4.6,3),c=>WWV.coils(c,-4.3,5.3,2,{dx:0.02}),c=>WWV.coils(c,-2.9,8.9,4,{light:0.15})];
AG_PLACES.wwHome=x=>WWV.paint(x,WWV_CAM,WWV_THINGS,WWV_GROUND);
// the family over it, the furthest first: items are drawables, or functions of the camera that give one
function wwv_scene(ctx,items){const c=WWV_CAM,D=items.filter(Boolean).map(f=>typeof f==="function"?f(c):f);D.sort((a,b)=>b.d-a.d);
  const out={};for(const it of D){const J=it.draw(ctx);if(it.key)out[it.key]=J;}return out;}
// the cord between two hands: from where it is twisted, down to the ground, along it, and up to where it is coiled
function wwv_cord(ctx,a,b,fl,tt){if(!a||!b)return;const U=PK.u,w=Math.sin(tt*2.2)*3;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  const path=()=>{ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.bezierCurveTo(a[0]+40,fl-4+w,b[0]-120,fl+2-w,b[0],b[1]);};
  path();ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=6;ctx.stroke();path();ctx.strokeStyle=U.css(wwq_c("rope"));ctx.lineWidth=3.2;ctx.stroke();ctx.restore();}
/* June 2021, from t0: the grandmother and a granddaughter twist on the bench; the mother kneels to twist, and her cord runs across
   the yard to the father, who coils it; a boy brings an armful of dried grass from where it lies in the sun */
function wwv_family(x,tt,t0){const c=WWV_CAM,m=c.f/c.d(4.3,6.2);
  const R=wwv_scene(x,[
    wwv_folk(c,"w3",0.1,9.3,WWV_TWISTSIT,{t:tt,flip:false,opt:PK.face(tt,{expr:"smile",gaze:[1,0.6]},[[t0+2.4,"look",2.2,[1,0.2]]])}),
    wwv_folk(c,WWV_KID2,1.2,9.3,WWV_TWISTSIT,{t:tt+1,flip:true,k:0.72,opt:PK.face(tt,{expr:"smile",gaze:[1,0.4]},[[t0+1.4,"look",2.4,[1,0]]])}),
    wwv_folk(c,"w2",-1.9,3.9,WWV_TWIST,{t:tt+2,flip:false,key:"mo",opt:Object.assign({holds:true},PK.face(tt,{expr:"neutral",gaze:[1,0.7]},[[t0+2.0,"smile",2.6]]))}),
    wwv_folk(c,"m3",1.7,4.8,WWV_COILING,{t:tt+3,flip:true,coil:true,key:"fa",opt:PK.face(tt,{expr:"smile",gaze:[1,0.3]},[[t0+1.0,"look",2.4,[1,0.1]]])}),
    wwq_walker(c,WWV_KID,tt,{path:[[5.7,0,6.9],[4.3,0,6.2]],t0:t0-0.4,t1:t0+3.0,then:"armful",arms:{aN:PK.POSES.armful.aN,aF:PK.POSES.armful.aF},k:0.74},
      {opt:Object.assign({hold:wwv_armful(m*0.74),holds:true},PK.face(tt,{expr:"smile",gaze:[1,0]},[[t0+3.4,"look",2.2,[1,0.3]]]))})]);
  wwv_cord(x,R.mo&&R.mo.hdN,R.fa&&R.fa.hdN,c.P(0,0,4.3)[1],tt);}
