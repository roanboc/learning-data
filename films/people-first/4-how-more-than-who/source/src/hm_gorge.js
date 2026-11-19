/* ===== The rope bridge at Quehue, in ink line: the gorge built once in 3D, seen from wherever the story needs =====
   The author found the bridge "almost invisible at the back" behind people stood in front of the picture, and asked for the context
   shown properly, with the people in it (18 November 2026). So the gorge is built once, in metres, and each shot looks at it through
   a camera of its own: from above with the bridge across the frame, from the rim beside its head, out over the gorge beside it. The
   people of the story stand in it at their true size for where they are: near, they are large; across the gorge, small; on the
   bridge, between its handrails. It is a drawing, not a likeness: the gorge is shallower and narrower than the real one, so the
   river, the walls and the bridge fit one picture. The facts it rests on are the series' bridge notes (the Ministry of Culture's
   study, 2015; UNESCO; photographs looked at for shapes and colours only, nothing traced).

   The world: x across the gorge (the left bank negative), y up (the banks' ground at 0), z along it (upstream positive); the rope
   bridge hangs across at z = 0, the steel bridge of 1968 is up the gorge at its first bend (z = 96). A camera {x, y, z, yaw, f, hor}
   stands at (x, y, z), turned yaw degrees from looking upstream (to the right positive), with a lens of f px and the horizon at hor.

   Each camera's sky, banks, walls and river are painted once, as a place (AG_PLACES): nothing nearer the camera than the bridge
   or the people ever covers them from these cameras, so they are drawn over it every frame (hmq_scene): the stone bases, the
   rope bridge, the steel one and the people, the furthest first. Drawn once for People first and copied into each film's own
   source under its prefix: here hmq_, for How, more than who, with what Wellbeing is in the work added (the bridge that sags with one
   handrail lower, tilt; that falls in two, fall; or is cut loose at one end, cut; and the rain) and this film's own: the floor cables
   as many hands pull them across, with more sag until they are taut (slack), the stones of a base's top, and a cable's end tied round
   a post of a base (hmq_tied). */
const HMQ_W={half:14,river:-16,rw:5,z0:-160,z1:330,bank:150};
const HMQ_PAL={straw:[220,196,136],straw2:[204,178,118],straw3:[232,212,160],ichu:[186,156,96],rock:[104,98,104],rock2:[124,116,118],rock3:[86,82,90],
  river:[96,138,134],river2:[78,118,118],foam:[236,240,236],snow:[246,248,250],peak:[170,176,198],peak2:[150,156,182],stone:[198,190,176],stone2:[170,162,150],
  rope:[214,186,110],ropeOld:[176,160,118],ropeDk:[150,124,70],steel:[150,156,166],steelDk:[110,116,128]};
const hmq_c=n=>PK.S.tone(HMQ_PAL[n]);
// the grey light of the years the bridge was left: everything duller and cooler
const hmq_g=(c,grey)=>grey?PK.u.mix(c,[150,154,160],0.34):c;
// the gorge bends both ways, out of sight: where its middle is at z
const hmq_xc=z=>z>40?(z-40)*(z-40)/260:(z<-40?-(z+40)*(z+40)/320:0);
const hmq_jit=(z,k)=>PK.u.hash(Math.round(z*7)+k*131,k)-0.5;

/* ---------------------------------------------------------------- a camera, and drawing through it */
function hmq_camera(c){if(c.P)return c;c=Object.assign({},c);const a=c.yaw*Math.PI/180;c.ca=Math.cos(a);c.sa=Math.sin(a);c.N=0.35;
  c.cs=(X,Y,Z)=>{const dx=X-c.x,dz=Z-c.z;return[dx*c.ca-dz*c.sa,Y-c.y,dx*c.sa+dz*c.ca];};
  c.P=(X,Y,Z)=>{const q=c.cs(X,Y,Z);return[960+c.f*q[0]/q[2],c.hor-c.f*q[1]/q[2],q[2]];};
  c.d=(X,Z)=>(X-c.x)*c.sa+(Z-c.z)*c.ca;                                 // how far ahead a point is
  c.h=(X,Z)=>1.62*c.f/c.d(X,Z);                                          // a standing adult's height there, px
  return c;}
// a polygon cut where it passes behind the camera, in the frame's px
function hmq_clip(c,pts){const q=pts.map(p=>c.cs(p[0],p[1],p[2])),out=[];
  for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],ia=a[2]>=c.N,ib=b[2]>=c.N;if(ia)out.push(a);
    if(ia!==ib){const t=(c.N-a[2])/(b[2]-a[2]);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,c.N]);}}
  return out.map(p=>[960+c.f*p[0]/p[2],c.hor-c.f*p[1]/p[2]]);}
const hmq_path=(ctx,p)=>{ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();};
const hmq_onScreen=p=>p.some(q=>q[0]>-200&&q[0]<2120&&q[1]>-200&&q[1]<1300);
// distance pales a colour into the haze of the high plain
const hmq_fog=(c,d,g)=>PK.u.mix(c,g?[178,182,188]:[214,214,206],PK.u.clamp((d-40)/420,0,0.55));

/* ---------------------------------------------------------------- the sky, the peaks under snow and the hills of ichu, from the horizon */
function hmq_sky(ctx,c,g){const U=PK.u,S=PK.S,hor=c.hor,sk=ctx.createLinearGradient(0,Math.min(0,hor-500),0,hor+40);
  sk.addColorStop(0,U.css(g?[150,160,174]:PK.col("skyTop")));sk.addColorStop(1,U.css(g?[210,210,208]:PK.col("skyLow")));ctx.fillStyle=sk;ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:1.5,far:0.8});
  // c.clouds {fair, grey}: where a view whose horizon is low keeps its clouds (high in the sky, not in the gorge under the bridge);
  // under a grey sky a cloud is a darker grey, since a white one there reads as a hole in the picture
  const cl=c.clouds?(g?c.clouds.grey:c.clouds.fair):hor>140?(g?[[300,Math.max(70,hor-240),1.3],[980,Math.max(60,hor-300),1.5],[1620,Math.max(70,hor-220),1.3]]
    :[[340,Math.max(70,hor-230),1.0],[1460,Math.max(60,hor-280),0.85]]):[];
  for(const [x,y,k] of cl||[])if(!g)PK.cloud(ctx,x,y,k);
    else S.fill(ctx,q=>{U.ell(q,x,y,70*k,26*k);U.ell(q,x+52*k,y+6*k,54*k,20*k);U.ell(q,x-56*k,y+8*k,48*k,17*k);U.ell(q,x+6*k,y-16*k,40*k,22*k);},[134,140,152],{sa:0.12});
  const pk=c.peaks||[[520,1],[760,1.35],[900,1.7],[1010,1.45],[1140,1.9],[1330,1.2]],ph=c.peakH||150,base=hor+6,pts=[[200,base,1]];
  S.begin(ctx,{lw:1.4,far:0.75});pk.forEach(([x,k])=>pts.push([x,base-ph*k]));pts.push([1700,base,1]);
  S.poly(ctx,pts.map(p=>[p[0],p[1],1]),hmq_g(hmq_c("peak"),g),{exact:true,flat:true});
  for(const [x,k] of pk)if(k>1.3){const y=base-ph*k,w=ph*0.32;
    S.poly(ctx,[[x-w,y+w*0.62,1],[x,y,1],[x+w,y+w*0.62,1],[x+w*0.4,y+w*0.5,1],[x,y+w*0.66,1],[x-w*0.45,y+w*0.48,1]],hmq_g(hmq_c("snow"),g),{exact:true,w:0.5,flat:true});}
  S.begin(ctx,{lw:1.6,far:0.55});const hh=c.hillH||70;
  S.poly(ctx,[[-40,hor+40,1],[-40,hor-hh*1.4],[260,hor-hh*1.9],[560,hor-hh*1.2],[820,hor-hh*0.3],[960,hor+40,1]],hmq_g(hmq_c("straw3"),g),{exact:true,ten:0.6});
  S.poly(ctx,[[860,hor+40,1],[1100,hor-hh*0.5],[1380,hor-hh*1.5],[1680,hor-hh*2.0],[1960,hor-hh*1.6],[1960,hor+40,1]],hmq_g(hmq_c("straw3"),g),{exact:true,ten:0.6});}

/* ---------------------------------------------------------------- the ground: banks, walls of rock and the river, as drawables */
function hmq_terrain(c,g){const U=PK.u,D=[],col=hmq_c,ink=()=>PK.S.ink,W=HMQ_W,xc=hmq_xc,step=z=>Math.abs(z)<60?2.5:5;
  const rimL=z=>xc(z)-W.half,rimR=z=>xc(z)+W.half;
  for(let z=W.z0;z<W.z1;){const z1=z+step(z),zm=(z+z1)/2;
    // the banks, in cells across, so the nearer ones cover what they hide
    for(const side of[-1,1]){const r0=side<0?rimL(z):rimR(z),r1=side<0?rimL(z1):rimR(z1),edges=[0,3,8,16,28,46,70,100,W.bank];
      for(let i=0;i<edges.length-1;i++){const a=edges[i],b=edges[i+1],pts=[[r0+side*a,0,z],[r1+side*a,0,z1],[r1+side*b,0,z1],[r0+side*b,0,z]];
        const dm=c.d(r0+side*(a+b)/2,zm);if(dm<-30)continue;
        D.push({d:dm,draw:ctx=>{const p=hmq_clip(c,pts);if(p.length<3||!hmq_onScreen(p))return;
          const cc=hmq_fog(hmq_g(U.mix(col("straw2"),col("straw3"),U.clamp((dm-30)/260,0,0.6)),g),dm,g);
          hmq_path(ctx,p);ctx.fillStyle=U.css(cc);ctx.fill();ctx.strokeStyle=U.css(cc);ctx.lineWidth=1.4;ctx.stroke();
          // the rim's edge, in the ink
          if(i===0){const e=hmq_clip(c,[[r0,0,z],[r1,0,z1],[r1,-0.01,z1],[r0,-0.01,z]]);
            if(e.length>=2){ctx.strokeStyle=U.css(U.mix(ink(),cc,U.clamp(dm/300,0,0.6)));ctx.lineWidth=U.clamp(260/dm,1,3.2);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(e[0][0],e[0][1]);ctx.lineTo(e[1][0],e[1][1]);ctx.stroke();}}
          // tufts of ichu, larger nearer
          if(dm<160){const R=U.rnd(Math.round(z*13+i*7+(side+3)*1000)),n=dm<14?8:dm<40?4:2;
            for(let k=0;k<n;k++){const X=r0+side*(a+R()*(b-a)),Z=z+R()*(z1-z),q=c.P(X,0,Z);if(q[2]<c.N+0.5)continue;const s=U.clamp(c.f*0.5/q[2],0.6,14);
              if(q[0]<-40||q[0]>1960||q[1]<-40||q[1]>1120)continue;
              ctx.strokeStyle=U.css(hmq_fog(hmq_g(U.mix(col("ichu"),col("straw2"),R()*0.4),g),dm,g));ctx.lineWidth=Math.max(0.8,s*0.16);ctx.lineCap="round";ctx.beginPath();
              for(let j=0;j<5;j++){const an=-0.7+j*0.35;ctx.moveTo(q[0],q[1]);ctx.quadraticCurveTo(q[0]+Math.sin(an)*s*0.5,q[1]-s*0.75,q[0]+Math.sin(an)*s,q[1]-Math.cos(an)*s*1.35);}ctx.stroke();}}}});}}
    // the walls: three faces from the rim down to the river's edge, jittered so they read as rock
    for(const side of[-1,1]){const lay=[0,-5,-10.5,W.river],ins=[W.half,W.half-2.6,W.half-5.6,W.rw];
      for(let b=0;b<3;b++){const pt=(zz,j)=>{const jj=j===0||j===3?0:hmq_jit(zz,j+side*5)*1.6;return[xc(zz)+side*(ins[j]+jj),lay[j]+hmq_jit(zz,j*3+side)*0.8*(j>0&&j<3),zz];};
        const pts=[pt(z,b),pt(z1,b),pt(z1,b+1),pt(z,b+1)],dm=c.d(xc(zm)+side*(ins[b]+ins[b+1])/2,zm);if(dm<-30)continue;
        const P0=pts[0],e1=[pts[1][0]-P0[0],pts[1][1]-P0[1],pts[1][2]-P0[2]],e2=[pts[3][0]-P0[0],pts[3][1]-P0[1],pts[3][2]-P0[2]],
          nn=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]].map(v=>v*(side<0?1:-1)),
          seen=(c.x-P0[0])*nn[0]+(c.y-P0[1])*nn[1]+(c.z-P0[2])*nn[2]>0;
        if(!seen)continue;                                                  // its back: hidden
        D.push({d:dm-0.4,draw:ctx=>{const p=hmq_clip(c,pts);if(p.length<3||!hmq_onScreen(p))return;
          const hv=U.hash(Math.round(zm/5),b+side*3),tone=b===0?U.mix(col("straw2"),[150,128,104],0.35+0.25*hv):U.mix([col("rock2"),col("rock"),col("rock3")][(b+Math.floor(hv*2.4))%3],[150,124,100],0.32);
          const cc=hmq_fog(hmq_g(tone,g),dm,g),lw=U.clamp(200/dm,0.6,2.4);hmq_path(ctx,p);ctx.fillStyle=U.css(cc);ctx.fill();ctx.strokeStyle=U.css(cc);ctx.lineWidth=1.2;ctx.stroke();
          // a crack or a ledge now and then, in the ink
          ctx.strokeStyle=U.css(U.mix(ink(),cc,U.clamp(dm/260,0.15,0.7)));ctx.lineWidth=lw;ctx.lineCap="round";ctx.beginPath();
          if(U.hash(Math.round(zm*3),b+side)<0.45){ctx.moveTo(p[0][0],p[0][1]);ctx.lineTo(p[3][0],p[3][1]);}
          if(b>0){ctx.moveTo(p[0][0],p[0][1]);ctx.lineTo(p[1][0],p[1][1]);}ctx.stroke();}});}}
    // the river, with white water
    {const pts=[[xc(z)-W.rw,W.river,z],[xc(z1)-W.rw,W.river,z1],[xc(z1)+W.rw,W.river,z1],[xc(z)+W.rw,W.river,z]],dm=c.d(xc(zm),zm);
      if(dm>-30)D.push({d:dm+1,draw:ctx=>{const p=hmq_clip(c,pts);if(p.length<3||!hmq_onScreen(p))return;
        const cc=hmq_fog(hmq_g(U.mix(col("river"),col("river2"),U.hash(Math.round(z),9)*0.3),g),dm,g);
        hmq_path(ctx,p);ctx.fillStyle=U.css(cc);ctx.fill();ctx.strokeStyle=U.css(cc);ctx.lineWidth=1.2;ctx.stroke();
        const R=U.rnd(Math.round(z*17+5));ctx.strokeStyle=U.css(hmq_fog(hmq_g(col("foam"),g),dm,g),0.8);ctx.lineCap="round";
        for(let k=0;k<2;k++){const X=xc(zm)+(R()-0.5)*2*W.rw*0.8,Z=z+R()*(z1-z),q=c.P(X,W.river,Z);if(q[2]<1)continue;const l=U.clamp(c.f*1.2/q[2],3,60);ctx.lineWidth=U.clamp(c.f*0.08/q[2],1,4);
          ctx.beginPath();ctx.moveTo(q[0]-l,q[1]);ctx.quadraticCurveTo(q[0],q[1]-l*0.12,q[0]+l,q[1]);ctx.stroke();}}});}
    z=z1;}
  return D;}

/* the place a camera sees, painted once: the sky, then the ground, the furthest first. o.grey: the years the bridge was left */
function hmq_ground(ctx,c,o){o=o||{};const U=PK.u;c=hmq_camera(c);hmq_sky(ctx,c,o.grey);
  ctx.fillStyle=U.css(hmq_fog(hmq_g(hmq_c("straw3"),o.grey),300,o.grey));ctx.fillRect(0,c.hor+8,1920,1080);
  const D=hmq_terrain(c,o.grey);D.sort((a,b)=>b.d-a.d);for(const it of D)it.draw(ctx);}

/* ---------------------------------------------------------------- the stone bases, one on each bank: a low platform of old stone at the
   rim, and the two short posts the handrails go round. Drawn with the people, since someone may
   stand behind one. Each face shows its courses of stone */
// a base: its platform from the rim back (x0 to x1, metres from the gorge's middle line, past W.half), its height and half-width, and
// its two posts (how far back, either side of the middle, how high)
const HMQ_BASE={x0:0.2,x1:2.0,h:0.32,zh:1.2,post:0.7,pz:0.85,ph:1.0};
function hmq_bases(c,g){const U=PK.u,D=[],W=HMQ_W,ink=PK.S.ink;
  const box=(X0,X1,Y0,Y1,Z0,Z1,cc,rows)=>{const v=(X,Y,Z)=>[X,Y,Z],faces=[[v(X0,Y1,Z0),v(X1,Y1,Z0),v(X1,Y1,Z1),v(X0,Y1,Z1)],[v(X0,Y0,Z0),v(X1,Y0,Z0),v(X1,Y1,Z0),v(X0,Y1,Z0)],
    [v(X0,Y0,Z1),v(X1,Y0,Z1),v(X1,Y1,Z1),v(X0,Y1,Z1)],[v(X0,Y0,Z0),v(X0,Y0,Z1),v(X0,Y1,Z1),v(X0,Y1,Z0)],[v(X1,Y0,Z0),v(X1,Y0,Z1),v(X1,Y1,Z1),v(X1,Y1,Z0)]];
    const dm=c.d((X0+X1)/2,(Z0+Z1)/2);
    return{d:dm,draw:ctx=>{const fd=faces.map((f,i)=>[i,c.d((f[0][0]+f[2][0])/2,(f[0][2]+f[2][2])/2)]).sort((a,b)=>b[1]-a[1]),lw=U.clamp(c.f*0.02/dm,0.8,3);   // the back faces first
      for(const [i] of fd){const p=hmq_clip(c,faces[i]);if(p.length<3)continue;const fc=i===0?U.lt(cc,0.08):i<3?cc:U.dk(cc,0.1);
        hmq_path(ctx,p);ctx.fillStyle=U.css(fc);ctx.fill();ctx.strokeStyle=U.css(ink);ctx.lineWidth=lw;ctx.lineJoin="round";ctx.stroke();
        // a platform's top: flagstones, fitted
        if(i===0&&rows&&Y1-Y0<0.6&&faces[0].every(q=>c.cs(q[0],q[1],q[2])[2]>c.N)){const R=U.rnd(Math.round(X0*7+Z0*3)+40),seg=[];
          for(let gx=0;gx<4;gx++)for(let gz=0;gz<4;gz++){const ax=U.lerp(X0,X1,(gx+0.08+R()*0.1)/4),bx=U.lerp(X0,X1,(gx+0.92-R()*0.1)/4),az=U.lerp(Z0,Z1,(gz+0.08+R()*0.1)/4),bz=U.lerp(Z0,Z1,(gz+0.92-R()*0.1)/4);
            seg.push([[ax,Y1,az],[bx,Y1,az+(R()-0.5)*0.08],[bx+(R()-0.5)*0.06,Y1,bz],[ax,Y1,bz+(R()-0.5)*0.08]]);}
          ctx.strokeStyle=U.css(U.dk(fc,0.22));ctx.lineWidth=lw*0.55;for(const f of seg){const q=f.map(v=>c.P(v[0],v[1],v[2]));ctx.beginPath();q.forEach((v,k)=>k?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.stroke();}}
        // its courses of stone: a line along each, and the joints between the stones, staggered
        if(i>0&&rows&&p.length===4&&faces[i].every(q=>c.cs(q[0],q[1],q[2])[2]>c.N)){const P=faces[i].map(q=>c.P(q[0],q[1],q[2])),L=(a,b,f)=>[U.lerp(a[0],b[0],f),U.lerp(a[1],b[1],f)];
          ctx.strokeStyle=U.css(U.dk(fc,0.32));ctx.lineWidth=lw*0.6;ctx.beginPath();
          for(let r=1;r<rows;r++){const a=L(P[0],P[3],r/rows),b=L(P[1],P[2],r/rows);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);}
          for(let r=0;r<rows;r++)for(let k=1;k<4;k++){const f=(k-(r%2?0.5:0))/3.5;if(f<=0.05||f>=0.95)continue;const a=L(L(P[0],P[1],f),L(P[3],P[2],f),r/rows),b=L(L(P[0],P[1],f),L(P[3],P[2],f),(r+1)/rows);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);}
          ctx.stroke();}}}};};
  const st=hmq_g(hmq_c("stone2"),g),st2=hmq_g(U.dk(hmq_c("stone2"),0.08),g);
  for(const s of[-1,1]){const lo=(a,b)=>[Math.min(s*a,s*b),Math.max(s*a,s*b)];
    const pf=box(...lo(W.half+HMQ_BASE.x0,W.half+HMQ_BASE.x1),0,HMQ_BASE.h,-HMQ_BASE.zh,HMQ_BASE.zh,st,2);pf.d+=0.4;D.push(pf);
    for(const zz of[-HMQ_BASE.pz,HMQ_BASE.pz]){const xp=s*(W.half+HMQ_BASE.post),po=box(xp-0.18,xp+0.18,HMQ_BASE.h,HMQ_BASE.ph,zz-0.18,zz+0.18,st2,2);po.d=c.d(xp,zz)+0.1;D.push(po);}}
  return D;}

/* ---------------------------------------------------------------- the rope bridge, at z = 0, from rim to rim
   o.age (0 new and gold; 1 left for years: sagging, grey, its floor gone in places), o.k (how much of it there is, as it is made: below
   0.5 the floor cables only), o.weave (the middle still bare, from u = weave to 1 - weave: the floor cables only), o.grey. Each stretch
   is two drawables at their depths: its far side and floor, and its near side, so whoever is on it walks between its handrails */
const HMQ_B={x0:-HMQ_W.half-0.2,x1:HMQ_W.half+0.2,hr:0.95,wd:0.55};
function hmq_deckAt(u,o){const U=PK.u,age=(o&&o.age)||0,sag=2.4+2.2*age+((o&&o.slack)||0),x=U.lerp(HMQ_B.x0,HMQ_B.x1,u),y=-sag*4*u*(1-u);
  const f=(o&&o.fall)||0,ct=(o&&o.cut)||0;if(f<=0&&ct<=0)return[x,y];
  const W=HMQ_W,span=HMQ_B.x1-HMQ_B.x0;let hx,hy;
  if(f>0){const s=u<0.5?u/0.5:(1-u)/0.5,side=u<0.5?-1:1,len=span*0.52*s;                  // fallen in two: each half hangs down its own wall
    hx=side*(W.half+0.2-Math.min(len,15.6)*0.45);hy=-Math.min(len,15.6);return[U.lerp(x,hx,U.sine(f)),U.lerp(y,hy,U.sine(f))];}
  const len=(1-u)*span*1.04;                                                                 // cut loose at the near end: it hangs from the far base
  hx=len<15.6?W.half+0.2-len*0.45:W.half-6.8-(len-15.6)*0.2;hy=len<15.6?-len:W.river+0.1;
  return[U.lerp(x,hx,U.sine(ct)),U.lerp(y,hy,U.sine(ct))];}
// the z of a point of the bridge: once it is down in the river, the water takes it downstream
const hmq_deckZ=(u,o)=>{const ct=(o&&o.cut)||0;if(ct<=0)return 0;const len=(1-u)*(HMQ_B.x1-HMQ_B.x0)*1.04;return len<15.6?0:-(len-15.6)*0.7*PK.u.sine(ct);};
// the bank the camera is on hides what is down in the gorge below its rim: from a camera on a bank, the bridge shows only above that
// rim's line on the picture (none for a camera over the gorge)
function hmq_rimClip(c){const W=HMQ_W,xm=hmq_xc(c.z),s=c.x<xm-W.half?-1:c.x>xm+W.half?1:0;if(!s)return null;
  const zs=[-30,-15,0,15,30].filter(z=>c.d(s*W.half,z)>1.5);if(zs.length<2)return null;
  const A=c.P(s*W.half,0,zs[0]),B=c.P(s*W.half,0,zs[zs.length-1]);if(Math.abs(B[0]-A[0])<1)return null;
  const m=(B[1]-A[1])/(B[0]-A[0]),y=x=>A[1]+m*(x-A[0]);
  return ctx=>{ctx.beginPath();ctx.moveTo(-3000,y(-3000));ctx.lineTo(5000,y(5000));ctx.lineTo(5000,-30000);ctx.lineTo(-3000,-30000);ctx.closePath();ctx.clip();};}
function hmq_bridge(c,o){o=o||{};const U=PK.u,D=[],age=o.age||0,k=o.k==null?1:o.k,g=o.grey,n=40,ink=PK.S.ink;
  const rope=hmq_g(U.mix(hmq_c("rope"),hmq_c("ropeOld"),age),g),dkc=U.dk(rope,0.28),R=U.rnd(7),nearZ=c.d(0,-1)<c.d(0,1)?-1:1;
  const tl=(zs,u)=>zs>0?(o.tilt||0)*0.55*4*u*(1-u):0;
  const rc=hmq_rimClip(c),cl=f=>rc?ctx=>{ctx.save();rc(ctx);f(ctx);ctx.restore();}:f;
  for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,[x0,y0]=hmq_deckAt(u0,o),[x1,y1]=hmq_deckAt(u1,o),z0=hmq_deckZ(u0,o),z1=hmq_deckZ(u1,o),dm=c.d((x0+x1)/2,(z0+z1)/2);
    if(o.fall>0&&i===n/2-1&&o.fall>0.02)continue;
    const holes=age>0.4&&R()<age*0.35,lost=age>0.4&&R()<age*0.22,um=(u0+u1)/2,bare=o.weave!=null&&um>o.weave&&um<1-o.weave;
    const side=(zs,ctx)=>{const zz=zs*HMQ_B.wd,rl=bare?1:k>0.5?U.clamp((k-0.5)/0.3,0,1):0;
      // the handrail
      if(rl>0){const a=c.P(x0,y0+HMQ_B.hr-0.15*age-tl(zs,u0),zz*1.05+z0),b=c.P(x1,y1+HMQ_B.hr-0.15*age-tl(zs,u1),zz*1.05+z1);
        if(a[2]>c.N&&b[2]>c.N){const lw=U.clamp(c.f*0.07/a[2],1.4,9);ctx.save();ctx.globalAlpha*=rl;ctx.lineCap="round";ctx.strokeStyle=U.css(ink);ctx.lineWidth=lw+2.4;
          ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.strokeStyle=U.css(rope);ctx.lineWidth=lw;ctx.stroke();ctx.restore();}}
      // the side cords, from the handrail down to the floor: fewer where it has worn
      if(!bare&&k>0.6&&!lost){for(let j=0;j<3;j++){const u=U.lerp(u0,u1,(j+0.5)/3),[xx,yy]=hmq_deckAt(u,o);if(age>0.3&&U.hash(Math.round(u*999),zs+3)<age*0.5)continue;
        const zq=hmq_deckZ(u,o),a=c.P(xx,yy+HMQ_B.hr*U.clamp((k-0.6)/0.4,0,1)-0.15*age-tl(zs,u),zz+zq),b=c.P(xx+(j%2?0.25:-0.25),yy,zz*0.98+zq);if(a[2]<c.N||b[2]<c.N)continue;
        ctx.strokeStyle=U.css(dkc);ctx.lineWidth=U.clamp(c.f*0.02/a[2],0.7,3);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}};
    // the floor: the floor cables as one woven floor, with sticks laid across. Seen from above, it goes with the far side, under whoever
    // is on it; seen from below, with the near side, over their feet
    const floor=ctx=>{if(k<=0)return;
      if(bare||k<0.5){const zs=bare||k>=0.25?[-1,1]:[nearZ];for(const s of zs){const a=c.P(x0,y0,s*HMQ_B.wd+z0),b=c.P(x1,y1,s*HMQ_B.wd+z1);if(a[2]<c.N||b[2]<c.N)continue;const lw=U.clamp(c.f*0.09/a[2],1.6,10);
        ctx.lineCap="round";ctx.strokeStyle=U.css(ink);ctx.lineWidth=lw+2.4;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.strokeStyle=U.css(rope);ctx.lineWidth=lw;ctx.stroke();}return;}
      const f=[c.P(x0,y0,-HMQ_B.wd+z0),c.P(x1,y1,-HMQ_B.wd+z1),c.P(x1,y1,HMQ_B.wd+z1),c.P(x0,y0,HMQ_B.wd+z0)];if(f.some(q=>q[2]<c.N)||holes)return;
      const fl=f.map(q=>[q[0],q[1]]),th=U.clamp(c.f*0.16/f[0][2],2,40);
      ctx.fillStyle=U.css(dkc);ctx.beginPath();ctx.moveTo(fl[0][0],fl[0][1]);ctx.lineTo(fl[1][0],fl[1][1]);ctx.lineTo(fl[2][0],fl[2][1]);ctx.lineTo(fl[2][0],fl[2][1]+th);ctx.lineTo(fl[3][0],fl[3][1]+th);ctx.lineTo(fl[3][0],fl[3][1]);ctx.closePath();ctx.fill();
      ctx.strokeStyle=U.css(ink);ctx.lineWidth=U.clamp(c.f*0.012/f[0][2],0.8,2.6);ctx.lineJoin="round";ctx.stroke();
      hmq_path(ctx,fl);ctx.fillStyle=U.css(U.lt(rope,0.08));ctx.fill();ctx.stroke();
      ctx.strokeStyle=U.css(dkc);ctx.lineWidth=U.clamp(c.f*0.012/f[0][2],0.6,2.2);ctx.beginPath();
      for(let j=1;j<3;j++){const t=j/3,a=[U.lerp(fl[0][0],fl[1][0],t),U.lerp(fl[0][1],fl[1][1],t)],b=[U.lerp(fl[3][0],fl[2][0],t),U.lerp(fl[3][1],fl[2][1],t)];ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);}ctx.stroke();};
    const under=c.y<Math.min(y0,y1)-0.1;
    D.push({d:dm+0.6,draw:cl(ctx=>{side(-nearZ,ctx);if(!under)floor(ctx);})});
    D.push({d:dm-0.6,draw:cl(ctx=>{if(under)floor(ctx);side(nearZ,ctx);})});}
  return D;}

/* ---------------------------------------------------------------- a cable's end tied round a post of a base: from the bridge's floor at
   its head (side -1 the left bank, 1 the right; zs which side of the floor, -1 or 1) to the post, three turns round it, and its tail
   on to points [X, Y, Z] beyond (whoever holds it while it's tied); k: how far it's tied (0: only laid there, 1: three turns) */
function hmq_tied(c,side,zs,o){o=o||{};const U=PK.u,W=HMQ_W,ink=PK.S.ink,xp=side*(W.half+HMQ_BASE.post),zp=zs*HMQ_BASE.pz,x0=side>0?HMQ_B.x1:HMQ_B.x0,k=U.clamp(o.k==null?1:o.k,0,1),g=o.grey;
  const col=hmq_g(U.mix(hmq_c("rope"),hmq_c("ropeOld"),o.age||0),g),dm=c.d(xp,zp),r=0.25,y0=HMQ_BASE.h+0.2,pitch=0.11,th0=side<0?0:Math.PI,T=2.5*2*Math.PI*k;
  // a point of the turns: a helix round the post, from its side towards the gorge; two and a half turns end on its side towards the land
  const at=th=>[xp+r*Math.cos(th),y0+pitch*(th-th0)/(2*Math.PI),zp+r*Math.sin(th)];
  const run=(ctx,pts,lw)=>{const q=pts.map(p=>c.P(p[0],p[1],p[2]));if(q.length<2||q.some(v=>v[2]<c.N))return;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();q.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.strokeStyle=U.css(ink);ctx.lineWidth=lw+2.4;ctx.stroke();ctx.strokeStyle=U.css(col);ctx.lineWidth=lw;ctx.stroke();};
  const lw=()=>U.clamp(c.f*0.07/dm,1.4,9),e=at(th0+T),tail=[e].concat(o.tail||[]);
  // the cable and its turns, just before the post; its tail, at its own depth, so whoever it passes in front of or behind is right
  const D=[{d:dm-0.02,draw:ctx=>{const w=lw();
    // in from the bridge's floor at its head, over the platform's front edge, along its top to the post
    run(ctx,[[x0,0,zs*HMQ_B.wd],[x0+side*0.03,HMQ_BASE.h+0.03,zs*HMQ_B.wd],[xp-side*r*1.1,HMQ_BASE.h+0.05,zp-(zp-zs*HMQ_B.wd)*0.3],at(th0)],w);
    // the turns: only their near half shows, the post hides the rest; each turn over the one before
    const n=Math.max(1,Math.ceil(T/0.18));let cur=[];
    for(let i=0;i<=n;i++){const p=at(th0+T*i/n);if(c.d(p[0],p[2])<dm-0.02)cur.push(p);else{if(cur.length>1)run(ctx,cur,w);cur=[];}}
    if(cur.length>1)run(ctx,cur,w);}}];
  if(tail.length>1){const m=tail[1];D.push({d:o.tailD!=null?o.tailD:Math.min(c.d(m[0],m[2]),dm-0.04),draw:ctx=>run(ctx,tail,lw()*0.9)});}
  return D;}

/* ---------------------------------------------------------------- the steel bridge of 1968, up the gorge at its first bend (z = 96): a deck
   for trucks and people, a truss along each side. a: how far it is there (0 to 1); truck: how far a truck is across it (0 to 1), or
   null. Three drawables at their depths, so whoever crosses on it walks between its sides: the far truss, the deck, the near truss */
const HMQ_S={z:96,half:2.6,top:2.6,dy:0.3};
const hmq_steelX=()=>{const xc=hmq_xc(HMQ_S.z);return[xc-HMQ_W.half-3,xc+HMQ_W.half+3];};
function hmq_steel(c,g,a,truck){if(!(a>0.01))return[];const U=PK.u,S=HMQ_S,z=S.z,[x0,x1]=hmq_steelX(),xm=(x0+x1)/2,ink=PK.S.ink,near=c.z>z?1:-1;
  const st=hmq_g(hmq_c("steel"),g),sd=hmq_g(hmq_c("steelDk"),g),dmF=c.d(xm,z-near*S.half),dmN=c.d(xm,z+near*S.half),dm=c.d(xm,z);
  const fade=(ctx,dd,f)=>{ctx.save();ctx.globalAlpha*=a;f(hmq_fog(st,dd,g),hmq_fog(sd,dd,g));ctx.restore();};
  const truss=(zz,dd)=>ctx=>fade(ctx,dd,(cs,cd)=>{const L=(p,q)=>{const A=c.P(...p),B=c.P(...q);if(A[2]<c.N||B[2]<c.N)return;ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);};
    const lw=U.clamp(c.f*0.09/Math.max(dd,1),1.2,7),n=12,X=i=>U.lerp(x0+0.6,x1-0.6,i/n);ctx.lineCap="round";ctx.lineJoin="round";
    for(const [w,col] of[[lw+2.2,ink],[lw,cs]]){ctx.strokeStyle=U.css(col);ctx.lineWidth=w;ctx.beginPath();L([x0+0.6,S.dy,zz],[x0+0.6+1.6,S.top,zz]);L([x0+0.6+1.6,S.top,zz],[x1-0.6-1.6,S.top,zz]);L([x1-0.6-1.6,S.top,zz],[x1-0.6,S.dy,zz]);
      for(let i=1;i<n;i++){const xx=X(i);if(xx<x0+2.2||xx>x1-2.2)continue;L([xx,S.dy,zz],[xx,S.top,zz]);}
      for(let i=1;i<n-1;i++){const xa=X(i),xb=X(i+1);if(xa<x0+2.2||xb>x1-2.2)continue;i<n/2?L([xa,S.top,zz],[xb,S.dy,zz]):L([xa,S.dy,zz],[xb,S.top,zz]);}ctx.stroke();}
    // a handrail of the walkway, low along the inside
    ctx.strokeStyle=U.css(cd);ctx.lineWidth=Math.max(1,lw*0.6);ctx.beginPath();L([x0+1,S.dy+1.0,zz-Math.sign(zz-z)*0.1],[x1-1,S.dy+1.0,zz-Math.sign(zz-z)*0.1]);ctx.stroke();});
  const deck=ctx=>fade(ctx,dm,(cs,cd)=>{const zf=z-near*S.half,zn=z+near*S.half,top=[[x0,S.dy,zf],[x1,S.dy,zf],[x1,S.dy,zn],[x0,S.dy,zn]],side=[[x0,S.dy,zn],[x1,S.dy,zn],[x1,S.dy-0.6,zn],[x0,S.dy-0.6,zn]];
    const lw=U.clamp(c.f*0.02/Math.max(dm,1),0.8,3);for(const [pts,col] of [[side,cd],[top,U.lt(cs,0.06)]]){const q=hmq_clip(c,pts);if(q.length<3)continue;hmq_path(ctx,q);ctx.fillStyle=U.css(col);ctx.fill();ctx.strokeStyle=U.css(ink);ctx.lineWidth=lw;ctx.stroke();}
    // its abutments of concrete at the rims
    for(const xe of[x0,x1]){const s=xe<xm?-1:1,q=hmq_clip(c,[[xe-s*0.2,S.dy-0.6,zn],[xe+s*1.4,S.dy-0.6,zn],[xe+s*1.4,-0.2,zn],[xe-s*0.2,-1.6,zn]]);if(q.length<3)continue;hmq_path(ctx,q);ctx.fillStyle=U.css(hmq_g([176,172,164],g));ctx.fill();ctx.strokeStyle=U.css(ink);ctx.lineWidth=lw;ctx.stroke();}
    if(truck!=null){const tx=U.lerp(x0+1,x1-1,truck),gx=c.P(tx,S.dy,z),s=c.f*1/Math.max(gx[2],1),fw=c.P(tx+1,S.dy,z)[0]>gx[0]?1:-1,go=x1>x0?1:-1;PK.S.begin(ctx,{lw:U.clamp(s*0.04,0.8,2.6)});
      const X=v=>gx[0]+fw*go*v*s,Y=v=>gx[1]-v*s;
      PK.S.fill(ctx,q=>{q.moveTo(X(-2.6),Y(0.5));q.lineTo(X(1.2),Y(0.5));q.lineTo(X(1.2),Y(2.7));q.lineTo(X(-2.6),Y(2.7));q.closePath();},hmq_g([176,118,96],g),{});
      PK.S.fill(ctx,q=>{q.moveTo(X(1.3),Y(0.5));q.lineTo(X(2.7),Y(0.5));q.lineTo(X(2.7),Y(1.5));q.lineTo(X(2.2),Y(2.2));q.lineTo(X(1.3),Y(2.2));q.closePath();},hmq_g([92,120,150],g),{});
      PK.S.fill(ctx,q=>{q.moveTo(X(1.9),Y(1.5));q.lineTo(X(2.55),Y(1.5));q.lineTo(X(2.2),Y(2.0));q.lineTo(X(1.9),Y(2.0));q.closePath();},[214,226,232],{w:0.6});
      for(const v of[-1.8,0.4,2.0])PK.S.fill(ctx,q=>U.ell(q,X(v),Y(0.45),s*0.42,s*0.42),[60,58,62],{});}});
  return[{d:dmF+0.05,draw:truss(z-near*S.half,dmF)},{d:dm+0.4,draw:deck},{d:dmN-0.05,draw:truss(z+near*S.half,dmN)}];}
// a point on the steel bridge's deck: u along it (0 its left end), s across (-1 to 1)
const hmq_steelAt=(u,s)=>{const [x0,x1]=hmq_steelX();return[PK.u.lerp(x0+1,x1-1,u),HMQ_S.dy,HMQ_S.z+(s||0)*HMQ_S.half*0.7];};

/* ---------------------------------------------------------------- the communities' people, in plain colours
   Men in pale wool jackets and dark trousers, a felt hat, often over a knitted cap; women in a felt hat, a full skirt and a
   cardigan, long braids. One plain colour each: no pattern is invented and none copied. Nobody drawn is a likeness of anyone. */
const HMQ_FOLK={
  keeper:{key:"keeper",name:"",skin:[176,124,92],hair:{style:"short",c:[200,196,190]},top:{kind:"jacket",c:[214,206,188],inner:[150,110,90]},bottom:{kind:"trousers",c:[70,66,70]},shoe:[60,46,40],qhat:"felt",qcap:[150,74,70]},
  m1:{key:"m1",name:"",skin:[170,116,84],hair:{style:"short",c:[34,28,28]},top:{kind:"jacket",c:[222,214,196],inner:[90,96,120]},bottom:{kind:"trousers",c:[60,60,72]},shoe:[54,42,38],qhat:"felt",qcap:[96,104,140]},
  m2:{key:"m2",name:"",skin:[160,108,78],hair:{style:"short",c:[30,26,28]},top:{kind:"sweater",c:[148,112,96]},bottom:{kind:"trousers",c:[66,62,66]},shoe:[54,42,38],qhat:"cap",qcap:[178,90,80]},
  m3:{key:"m3",name:"",skin:[180,128,94],hair:{style:"short",c:[40,32,30]},top:{kind:"jacket",c:[196,186,164],inner:[120,80,70]},bottom:{kind:"trousers",c:[80,74,72]},shoe:[54,42,38],qhat:"felt"},
  w1:{key:"w1",name:"",skin:[174,120,88],hair:{style:"long",c:[28,24,26]},top:{kind:"sweater",c:[120,86,104]},bottom:{kind:"skirt",c:[64,72,104]},shoe:[54,42,38],qhat:"felt",braid:true},
  w2:{key:"w2",name:"",skin:[166,112,82],hair:{style:"long",c:[30,24,26]},top:{kind:"sweater",c:[96,120,112]},bottom:{kind:"skirt",c:[132,70,76]},shoe:[54,42,38],qhat:"felt",braid:true},
  w3:{key:"w3",name:"",skin:[180,126,96],hair:{style:"long",c:[44,34,32]},top:{kind:"sweater",c:[170,134,90]},bottom:{kind:"skirt",c:[78,64,86]},shoe:[54,42,38],qhat:"felt",braid:true},
  m4:{key:"m4",name:"",skin:[164,112,80],hair:{style:"short",c:[36,30,28]},top:{kind:"jacket",c:[120,92,76],inner:[210,200,180]},bottom:{kind:"trousers",c:[58,58,66]},shoe:[54,42,38],qhat:"cap",qcap:[92,120,104]},
  m5:{key:"m5",name:"",skin:[176,120,86],hair:{style:"short",c:[30,26,26]},top:{kind:"sweater",c:[178,150,104]},bottom:{kind:"trousers",c:[72,66,64]},shoe:[54,42,38],qhat:"felt"},
  w4:{key:"w4",name:"",skin:[170,116,86],hair:{style:"long",c:[26,22,24]},top:{kind:"sweater",c:[150,70,74]},bottom:{kind:"skirt",c:[52,64,90]},shoe:[54,42,38],qhat:"felt",braid:true},
  w5:{key:"w5",name:"",skin:[178,124,92],hair:{style:"long",c:[36,28,28]},top:{kind:"sweater",c:[84,104,136]},bottom:{kind:"skirt",c:[120,84,60]},shoe:[54,42,38],qhat:"felt",braid:true},
  // two visitors of 1972, and a geographer of 1970: clothes of their time, no hat
  v1:{key:"v1",name:"",skin:[236,204,180],hair:{style:"short",c:[140,104,70]},beard:[150,112,80],top:{kind:"jacket",c:[150,120,84],inner:[224,214,196]},bottom:{kind:"trousers",c:[92,98,120]},shoe:[90,70,56]},
  v2:{key:"v2",name:"",skin:[240,210,186],hair:{style:"long",c:[180,140,90]},top:{kind:"sweater",c:[116,134,120]},bottom:{kind:"trousers",c:[110,96,84]},shoe:[90,70,56]},
  geo:{key:"geo",name:"",skin:[232,198,170],hair:{style:"short",c:[96,80,70]},glasses:[60,50,50],top:{kind:"jacket",c:[128,132,110],inner:[230,226,214]},bottom:{kind:"trousers",c:[104,96,84]},shoe:[80,62,50]}
};
// a felt hat, or a knitted cap, over the head's picture: drawn after the person, from the joints PK.person gives back (J.hc, the
// head's size J.p.head*J.u), and it nods with them
function hmq_hat(ctx,P,J){if(!P.qhat||!J||!J.hc)return;const S=PK.S,U=PK.u,hh=J.p.head*J.u,[x,y]=J.hc,r=hh*0.5,lw={lw:U.clamp(hh*0.03,0.8,3.4)};S.begin(ctx,lw);
  if(P.qhat==="cap")S.fill(ctx,c=>{c.moveTo(x-r*1.02,y-r*0.12);c.bezierCurveTo(x-r*1.0,y-r*1.25,x+r*1.0,y-r*1.25,x+r*1.02,y-r*0.12);c.lineTo(x+r*0.96,y+r*0.2);c.lineTo(x-r*0.96,y+r*0.2);c.closePath();},P.qcap||[178,90,80],{});
  if(P.qhat==="felt"){const hc=S.tone([96,80,70]),top=y-r*0.62;
    S.fill(ctx,c=>U.ell(c,x,top+r*0.02,r*1.42,r*0.26),U.dk(hc,0.06),{});
    S.fill(ctx,c=>{c.moveTo(x-r*0.8,top);c.bezierCurveTo(x-r*0.82,top-r*0.7,x+r*0.82,top-r*0.7,x+r*0.8,top);c.closePath();},hc,{});
    S.line(ctx,c=>{c.moveTo(x-r*0.78,top-r*0.12);c.quadraticCurveTo(x,top-r*0.04,x+r*0.78,top-r*0.12);},[150,74,70],1.4);}}
/* the communities' other people, whom nobody names: hmq_row(i) is the i-th, men and women in turn, the same every time. Like the
   kit's PK.extra, they are the background: whoever is nearer may stand in front of them */
const HMQ_MEMO={},HMQ_SKIN=[[176,124,92],[166,112,82],[180,128,94],[160,108,78],[174,120,88],[170,116,86],[164,112,80]],
  HMQ_TOP=[[222,214,196],[150,70,74],[196,186,164],[84,104,136],[148,112,96],[120,86,104],[178,150,104],[96,120,112],[120,92,76],[170,134,90],[132,96,120],[104,128,96]],
  HMQ_SKIRT=[[64,72,104],[132,70,76],[78,64,86],[52,64,90],[120,84,60],[96,60,70]],HMQ_TROU=[[60,60,72],[66,62,66],[80,74,72],[58,58,66],[72,66,64]],
  HMQ_CAP=[[150,74,70],[96,104,140],[178,90,80],[92,120,104],[160,120,70]];
const hmq_villager=i=>HMQ_MEMO[i]||(HMQ_MEMO[i]=(()=>{const w=i%2===1,k=Math.floor(i/2);
  return{key:"extra"+(600+i),name:"",skin:HMQ_SKIN[(i*3+1)%7],hair:{style:w?"long":"short",c:[26+(i*7)%20,22+(i*5)%14,24+(i*3)%12]},
    top:{kind:w||k%3===1?"sweater":"jacket",c:HMQ_TOP[(i*5+2)%12],inner:[214,204,184]},bottom:w?{kind:"skirt",c:HMQ_SKIRT[(k*5+1)%6]}:{kind:"trousers",c:HMQ_TROU[(k*3)%5]},
    shoe:[54,42,38],qhat:!w&&k%3===2?"cap":"felt",qcap:HMQ_CAP[(i*2)%5],braid:w};})());
const hmq_row=w=>typeof w==="number"?hmq_villager(w):typeof w==="string"?(HMQ_FOLK[w]||PK.CAST[w]):w;
const hmq_person=(ctx,who,x,fl,h,pose,o)=>{const P=hmq_row(who),J=PK.person(ctx,P,x,fl,h,pose,o);if(!(o&&o.part==="lower"))hmq_hat(ctx,P,J);return J;};
// a coil of cord, for a hand to hold
const hmq_coil=(c,h,deg,J)=>{const S=PK.S,U=PK.u,[x,y]=h,k=J&&J.p?J.p.head*J.u/44:1;S.begin(c,{lw:U.clamp(2*k,0.8,2.4)});S.fill(c,cc=>U.ell(cc,x+4*k,y+22*k,26*k,16*k),hmq_c("rope"),{});S.fill(c,cc=>U.ell(cc,x+4*k,y+22*k,13*k,7*k),hmq_c("ropeDk"),{w:0.6});};
// kneeling to twist grass into cord, seen from the side: both hands together in front, the cord running from them to the ground
const HMQ_TWIST={mode:"kneel",lean:16,head:12,aN:[44,56,"grip"],aF:[40,60,"grip"],lN:[28,-90],lF:[40,-88],fN:70,fF:70};

/* ---------------------------------------------------------------- someone of the story in the world, as a drawable
   hmq_folk(c, who, X, Z, pose, o): standing (or kneeling, sitting) on the bank at (X, Z), or o.Y above the ground (on the bridge);
   o.t the time (always), o.flip, o.opt PK.person's own options (a face, what a hand holds), o.after(ctx, J) drawn over them,
   o.len a twisted cord's length (pose HMQ_TWIST). Their size is a standing adult's there (1.62 m), so everyone is of one picture */
function hmq_folk(c,who,X,Z,pose,o){o=o||{};const U=PK.u,p=c.P(X,o.Y||0,Z),h=c.h(X,Z)*(o.k||1),dm=p[2];
  return{d:dm-(o.front||0),key:o.key,draw:ctx=>{if(dm<c.N+0.3||h<6)return null;const far=U.clamp((dm-20)/140,0,0.7),twist=pose===HMQ_TWIST;
    const J=hmq_person(ctx,who,p[0],p[1],h,pose||"stand",Object.assign({t:o.t,flip:o.flip||false,far,shade:h>60?1:0},twist?{holds:true}:{},o.opt||{}));
    if(twist&&J&&J.hdN){const [hx,hy]=J.hdN,len=(o.len||1.0)*h*(o.flip?-1:1),tw=Math.sin((o.t||0)*5)*h*0.006;ctx.save();ctx.lineCap="round";
      ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=Math.max(2,h*0.02);ctx.beginPath();ctx.moveTo(hx,hy+2);ctx.quadraticCurveTo(hx+len*0.4,p[1]-3+tw,hx+len,p[1]-1);ctx.stroke();
      ctx.strokeStyle=U.css(hmq_c("rope"));ctx.lineWidth=Math.max(1,h*0.011);ctx.stroke();ctx.restore();}
    if(o.after)o.after(ctx,J);return J;}};}
// someone walking in the world along w.path, points [X, Y, Z] (on the bank Y is 0; hmq_deckAt gives the bridge's floor), between
// w.t0 and w.t1: the stride grows out of w.before and dies into w.then, as PK.walk's does, and is as long as their legs, so their feet
// don't slide; w.arms {aN, aF} keeps the arms that carry something; w.k a child's height. They face the way they go on the picture
function hmq_walker(c,who,t,w,o){o=o||{};const U=PK.u,P=hmq_row(who),amp=PK.ampOf(P),pts=w.path,cum=[0];
  for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1],pts[i][2]-pts[i-1][2]));
  const L=cum[cum.length-1],at=s=>{s=U.clamp(s,0,L);let i=1;while(i<pts.length-1&&cum[i]<s)i++;const a=pts[i-1],b=pts[i],k=U.clamp((s-cum[i-1])/((cum[i]-cum[i-1])||1),0,1);
    return[U.lerp(a[0],b[0],k),U.lerp(a[1],b[1],k),U.lerp(a[2],b[2],k)];};
  const q=PK.walkAt(t,{x0:0,x1:L,t0:w.t0,t1:w.t1,floor:0,h:1.62*(w.k||1),amp}),[X,Y,Z]=at(q.x),p=c.P(X,Y,Z),h=c.h(X,Z)*(w.k||1);
  // which way they face: the way the path goes on the picture here (where it goes nearly straight in or out, the way it goes overall)
  const sx=s=>{const r=at(s);return c.P(r[0],r[1],r[2])[0];},s0=Math.min(q.x,L-0.4),dx=sx(s0+0.4)-sx(s0),left=w.flip!=null?w.flip:Math.abs(dx)>1?dx<0:sx(L)<sx(0);
  const arm=pp=>w.arms?Object.assign({},pp,{aN:w.arms.aN||pp.aN,aF:w.arms.aF||pp.aF}):pp,st=arm(PK.POSES.stand),pose=PK.poseMix(q.u<0.5?(w.before||st):arm(typeof w.then==="string"?PK.POSES[w.then]:(w.then||st)),arm(PK.poseWalk(q.step,1,amp)),q.go);
  return{d:p[2]-(o.front||0),key:o.key,draw:ctx=>{if(p[2]<c.N+0.3||h<6)return null;
    const J=hmq_person(ctx,who,p[0],p[1],h,pose,Object.assign({t,flip:left,life:1-0.8*q.go,far:U.clamp((p[2]-20)/140,0,0.7),shade:h>60?1:0},o.opt||{}));
    if(o.after)o.after(ctx,J);return J;}};}

/* ---------------------------------------------------------------- a frame of the gorge: over its place (hmq_ground, painted once), the
   stone bases, the rope bridge, the steel bridge and the people, the furthest first.
   o: the bridge's own (age, k, weave), grey, steel (how far the steel bridge is there, 1 by default), truck. items: drawables */
function hmq_scene(ctx,c,o,items){o=o||{};c=hmq_camera(c);
  const D=hmq_bases(c,o.grey).concat(...(o.bridges||[{age:o.age,k:o.k,weave:o.weave,tilt:o.tilt,fall:o.fall,cut:o.cut,slack:o.slack}]).map(b=>hmq_bridge(c,Object.assign({grey:o.grey},b))),hmq_steel(c,o.grey,o.steel==null?1:o.steel,o.truck),(items||[]).filter(Boolean).map(f=>typeof f==="function"?f(c):f));
  D.sort((a,b)=>b.d-a.d);const out={};for(const it of D){const J=it.draw(ctx);if(it.key)out[it.key]=J;}return out;}

/* ---------------------------------------------------------------- rain, over the whole frame, leaning with the wind (a: how much) */
function hmq_rain(ctx,tt,a,wind){if(a<=0.004)return;const U=PK.u,R=U.rnd(11),lean=6+(wind||0)*16;ctx.save();ctx.globalAlpha*=0.55*a;ctx.strokeStyle=U.css([120,130,146]);ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<220;i++){const x0=R()*2100-90,sp=520+R()*200,y=((R()*1200+tt*sp)%1200)-60,x=x0;ctx.moveTo(x,y);ctx.lineTo(x-lean,y+26);}ctx.stroke();ctx.restore();}
