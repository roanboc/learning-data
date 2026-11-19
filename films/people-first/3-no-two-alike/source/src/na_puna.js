/* ===== Above Quehue: the grass the bridge is made of, cut on the high plain =====
   The film's first two lines leave the bridge the series' other films follow: "One blade of grass is like another, and a person
   isn't like anyone." The author asked each film of the series for a view of the story of its own (18 November 2026), so this one
   doesn't show the bridge close: it shows where the bridge begins, the grass. The bridge is woven from q'oya (Festuca dolichophylla),
   a grass of the high, wet puna, of the same family as ichu; people go for it alone, as a family or in groups, and further each year,
   as it grows scarcer; once cut, it is tied in big bundles and carried home on their backs, to dry in the sun (the Ministry of
   Culture's study, 2015, page 177). Women cut it with sickles (AFP, 2023). So: three people at work, each their own way, an older
   woman kneeling at a tussock with her sickle, a younger one crouched at hers, a man tying a bundle; and further off someone carries
   one away, towards the gorge, where the bridge is a thin line across it, far off (the drawing puts it in sight of the grass, which is
   cut further up).

   Drawn in the series' world and ink line (People before roles' gorge, Wellbeing is in the work's yard): in metres, the people kit's
   people at their true size where they are. Away from the gorge, x is simply to the right and z ahead of the camera, which stands at
   the origin, at a person's eye height. What doesn't move is painted once, as a place (AG_PLACES.naPuna): the sky, the peaks, the
   folds of the plain with the gorge far off, the ground and its tussocks, the bundles already cut. The tussocks at work, the people
   and what they hold are drawn over it every frame, the furthest first (nap_scene), so the grass a hand takes stays sharp when the
   camera comes close. Nobody drawn is a likeness of anyone; the clothes are plain colours, no pattern invented and none copied.
   Copied from the series' drawing under this film's prefix, nap_. */
const NAP_PAL={straw:[220,196,136],straw2:[204,178,118],straw3:[232,212,160],ichu:[186,156,96],qoya:[196,176,104],qoya2:[160,150,84],qoyaG:[150,156,92],
  rock3:[86,82,90],peak:[170,176,198],snow:[246,248,250],stone:[198,190,176],rope:[214,186,110],ropeDk:[150,124,70],wet:[134,150,112],water:[150,184,196],
  blade:[198,204,210],bladeDk:[120,126,136],wood:[132,96,68]};
const nap_c=n=>PK.S.tone(NAP_PAL[n]);

/* ---------------------------------------------------------------- a camera, and drawing through it (the series' own) */
function nap_camera(c){if(c.P)return c;c=Object.assign({},c);const a=c.yaw*Math.PI/180;c.ca=Math.cos(a);c.sa=Math.sin(a);c.N=0.35;
  c.cs=(X,Y,Z)=>{const dx=X-c.x,dz=Z-c.z;return[dx*c.ca-dz*c.sa,Y-c.y,dx*c.sa+dz*c.ca];};
  c.P=(X,Y,Z)=>{const q=c.cs(X,Y,Z);return[960+c.f*q[0]/q[2],c.hor-c.f*q[1]/q[2],q[2]];};
  c.d=(X,Z)=>(X-c.x)*c.sa+(Z-c.z)*c.ca;
  c.h=(X,Z)=>1.62*c.f/c.d(X,Z);
  return c;}
function nap_clip(c,pts){const q=pts.map(p=>c.cs(p[0],p[1],p[2])),out=[];
  for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],ia=a[2]>=c.N,ib=b[2]>=c.N;if(ia)out.push(a);
    if(ia!==ib){const t=(c.N-a[2])/(b[2]-a[2]);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,c.N]);}}
  return out.map(p=>[960+c.f*p[0]/p[2],c.hor-c.f*p[1]/p[2]]);}
const nap_path=(ctx,p)=>{ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();};
const nap_fog=(c,d)=>PK.u.mix(c,[214,214,206],PK.u.clamp((d-40)/420,0,0.55));
const nap_ink=(cc,dm,k)=>PK.u.mix(PK.S.ink,cc,PK.u.clamp(dm/(k||260),0,0.6));
const nap_lw=(c,dm,k,a,b)=>PK.u.clamp(c.f*(k||0.02)/Math.max(dm,0.5),a||0.8,b||3.2);

// the camera: on the plain, at a person's eye height, looking along it towards the gorge
const NAP_CAM=nap_camera({x:0,y:1.5,z:0,yaw:0,f:1040,hor:392});
// the gorge, far off between two folds of the plain: where its notch is on the picture, and the bridge across it
const NAP_GORGE={x:1330,y:392,w:170};

/* ---------------------------------------------------------------- the sky, the peaks under snow, the folds of the plain and the gorge
   far off in one of them, with the bridge a thin line across it: painted from the horizon, as the series' sky is */
function nap_sky(ctx,c){const U=PK.u,S=PK.S,hor=c.hor,sk=ctx.createLinearGradient(0,0,0,hor+40);
  sk.addColorStop(0,U.css(PK.col("skyTop")));sk.addColorStop(1,U.css(PK.col("skyLow")));ctx.fillStyle=sk;ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:1.5,far:0.8});PK.cloud(ctx,330,120,1.0);PK.cloud(ctx,1180,84,0.8);PK.cloud(ctx,1720,150,0.7);
  // the peaks, far off, with snow
  const base=hor+6,pk=[[300,0.8],[520,1.25],[700,1.0],[860,1.6],[1010,1.3]],ph=150,pts=[[120,base,1]];
  S.begin(ctx,{lw:1.4,far:0.75});pk.forEach(([x,k])=>pts.push([x,base-ph*k]));pts.push([1180,base,1]);
  S.poly(ctx,pts.map(p=>[p[0],p[1],1]),nap_c("peak"),{exact:true,flat:true});
  for(const [x,k] of pk)if(k>1.2){const y=base-ph*k,w=ph*0.3;
    S.poly(ctx,[[x-w,y+w*0.62,1],[x,y,1],[x+w,y+w*0.62,1],[x+w*0.4,y+w*0.5,1],[x,y+w*0.66,1],[x-w*0.45,y+w*0.48,1]],nap_c("snow"),{exact:true,w:0.5,flat:true});}
  // the folds of the plain: long, low, the far ones paler
  S.begin(ctx,{lw:1.6,far:0.6});
  S.poly(ctx,[[-40,hor+40,1],[-40,hor-60],[240,hor-92],[520,hor-50],[760,hor-14],[900,hor+40,1]],nap_fog(nap_c("straw3"),300),{exact:true,ten:0.6});
  const G=NAP_GORGE;
  S.poly(ctx,[[760,hor+40,1],[930,hor-30],[1110,hor-58],[G.x-G.w*0.62,hor-40],[G.x-G.w*0.5,hor+40,1]],nap_fog(nap_c("straw3"),300),{exact:true,ten:0.6});
  S.poly(ctx,[[G.x+G.w*0.5,hor+40,1],[G.x+G.w*0.62,hor-46],[1600,hor-92],[1840,hor-110],[1960,hor-96],[1960,hor+40,1]],nap_fog(nap_c("straw3"),300),{exact:true,ten:0.6});
  nap_notch(ctx,c);}
// the gorge far off: its far wall in shadow between the two folds, and the bridge across it, from a stone base on each side
function nap_notch(ctx,c){const U=PK.u,S=PK.S,{x,y,w}=NAP_GORGE,hz=c=>nap_fog(c,330);
  S.begin(ctx,{lw:1.4,far:0.45});
  S.poly(ctx,[[x-w*0.5,y-26,1],[x-w*0.18,y+30,1],[x+w*0.16,y+30,1],[x+w*0.5,y-30,1],[x+w*0.5,y+30,1],[x-w*0.5,y+30,1]],hz(nap_c("rock3")),{exact:true});
  // the two banks' lips, in the plain's straw, and the bridge: two handrails and the floor, sagging, gold
  S.poly(ctx,[[x-w*0.62,y-30,1],[x-w*0.5,y-26,1],[x-w*0.3,y+4,1],[x-w*0.62,y+8,1]],hz(nap_c("straw2")),{exact:true});
  S.poly(ctx,[[x+w*0.62,y-34,1],[x+w*0.5,y-30,1],[x+w*0.32,y+4,1],[x+w*0.62,y+8,1]],hz(nap_c("straw2")),{exact:true});
  const a=[x-w*0.46,y-22],b=[x+w*0.46,y-26],sag=14,rope=U.css(hz(nap_c("rope"))),dk=U.css(U.dk(hz(nap_c("rope")),0.25));
  ctx.save();ctx.lineCap="round";
  for(const [dy,col,lw] of[[-9,dk,1.6],[0,rope,2.6],[-9,rope,1.1]]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(a[0],a[1]+dy);ctx.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2+sag*2+dy,b[0],b[1]+dy);ctx.stroke();}
  ctx.strokeStyle=dk;ctx.lineWidth=0.9;ctx.beginPath();for(let i=1;i<12;i++){const u=i/12,px=U.lerp(a[0],b[0],u),py=U.lerp(a[1],b[1],u)+sag*4*u*(1-u);ctx.moveTo(px,py-9+sag*0);ctx.lineTo(px,py);}ctx.stroke();
  ctx.restore();
  S.begin(ctx,{lw:1.2,far:0.4});for(const [bx,by] of[[a[0]-4,a[1]],[b[0]+4,b[1]]])S.poly(ctx,[[bx-6,by+4,1],[bx-6,by-6,1],[bx+6,by-6,1],[bx+6,by+4,1]],hz(nap_c("stone")),{exact:true});}

/* ---------------------------------------------------------------- the ground: the plain from the horizon to our feet, a wet hollow where
   the q'oya grows thickest, and a path worn towards the gorge; then tussocks on a grid round the camera, none where people work */
const NAP_BARE=[[[-3.6,3.2],[0.4,3.2],[0.4,6.2],[-3.6,6.2]],[[1.0,6.6],[3.8,6.6],[3.8,9.0],[1.0,9.0]],[[-5.8,8.6],[-2.4,8.6],[-2.4,11.2],[-5.8,11.2]]];
const NAP_WET={pts:(()=>{const p=[],U=PK.u;for(let i=0;i<22;i++){const a=i/22*Math.PI*2,k=0.86+0.22*U.hash(i*13+5,5);p.push([-9+Math.cos(a)*16*k,30+Math.sin(a)*7*k]);}return p;})()};
// the worn path: its middle at Z, to test that no tussock grows on it
const NAP_PATH=[[8.9,8],[12.1,16],[11.1,26],[14.1,45],[36.1,120]];
const nap_onRoad=(X,Z)=>{if(Z<6)return false;let i=1;while(i<NAP_PATH.length-1&&NAP_PATH[i][1]<Z)i++;const [a,b]=[NAP_PATH[i-1],NAP_PATH[i]],k=PK.u.clamp((Z-a[1])/(b[1]-a[1]),0,1);return Math.abs(X-PK.u.lerp(a[0],b[0],k))<1.1;};
const nap_inPoly=(x,z,p)=>{let a=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,zi]=p[i],[xj,zj]=p[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)a=!a;}return a;};
function nap_ground(ctx,c){const U=PK.u,hz=c.hor;
  const gr=ctx.createLinearGradient(0,hz,0,1080);gr.addColorStop(0,U.css(nap_fog(nap_c("straw3"),300)));gr.addColorStop(0.25,U.css(nap_fog(U.mix(nap_c("straw2"),nap_c("straw3"),0.5),60)));
  gr.addColorStop(1,U.css(nap_c("straw2")));ctx.fillStyle=gr;ctx.fillRect(0,hz+6,1920,1080-hz);
  // the wet hollow, greener, with standing water in it
  {const q=nap_clip(c,NAP_WET.pts.map(([x,z])=>[x,0,z]));const cc=nap_fog(nap_c("wet"),30);nap_path(ctx,q);ctx.fillStyle=U.css(cc);ctx.fill();
    ctx.strokeStyle=U.css(U.mix(cc,nap_c("straw2"),0.5));ctx.lineWidth=2;ctx.stroke();
    for(const [x0,z0,rx,rz] of[[-12,31,3.2,1.2],[-5,29.5,2.0,0.7],[-15.5,33,1.6,0.6]]){const pts=[];for(let i=0;i<16;i++){const a=i/16*Math.PI*2;pts.push([x0+Math.cos(a)*rx,0.01,z0+Math.sin(a)*rz]);}
      const w=nap_clip(c,pts);nap_path(ctx,w);ctx.fillStyle=U.css(nap_fog(nap_c("water"),30));ctx.fill();ctx.strokeStyle=U.css(nap_ink(nap_c("water"),40,120));ctx.lineWidth=1.4;ctx.stroke();}}
  // the path towards the gorge: bare earth, worn by feet, narrowing into the distance
  {const pts=[[9.4,0,8],[12.6,0,16],[11.6,0,26],[14.6,0,45],[36.6,0,120],[35.6,0,120],[13.6,0,45],[10.6,0,26],[11.6,0,16],[8.4,0,8]],q=nap_clip(c,pts);nap_path(ctx,q);ctx.fillStyle=U.css(nap_fog([200,176,130],60));ctx.fill();}}
// the tussocks: on a grid round the camera, none where people work nor on the path. Those within NAP_NEAR m are drawn every frame,
// with the people, the furthest first, and sway in the wind; the rest are painted with the place
const NAP_NEAR=7;
function nap_grid(c,d0,d1){const U=PK.u,out=[];
  for(const [st,R,salt] of[[0.62,NAP_NEAR+1,11],[1.5,60,0]]){const cx=Math.round(c.x/st),cz=Math.round(c.z/st),n=Math.round(R/st);
    for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++){const gx=cx+i,gz=cz+j,hv=U.hash(gx*7919+gz*104729+salt,3),wet=salt?false:null;
      const X=(gx+U.hash(gx+salt,gz*3+1))*st,Z=(gz+U.hash(gz+salt,gx*5+2))*st,dm=c.d(X,Z);
      if(st<1?(dm>=NAP_NEAR+0.5||hv>0.38):(dm<NAP_NEAR+0.5||hv>0.55))continue;if(dm<d0||dm>=d1)continue;
      if(NAP_BARE.some(p=>nap_inPoly(X,Z,p)))continue;if(nap_onRoad(X,Z))continue;
      const w=nap_inPoly(X,Z,NAP_WET.pts),q=c.P(X,0,Z);if(q[0]<-260||q[0]>2180||q[1]<c.hor||q[1]>1500)continue;
      const s=c.f*(w?0.62:0.52)*(0.8+0.4*U.hash(gx*31+gz*17,7))/dm;if(s<1.2)continue;out.push({X,Z,dm,q,s,hv,wet:w});}}
  return out;}
function nap_tufts(c){return nap_grid(c,1.2,1e9).filter(g=>g.dm>=NAP_NEAR&&!nap_clear(c,g)).map(g=>({d:g.dm,draw:ctx=>nap_tuft(ctx,g.q[0],g.q[1],g.s,g.hv,g.dm,g.wet,0)}));}
let NAP_NEARS=null;
const nap_nears=c=>NAP_NEARS||(NAP_NEARS=nap_grid(c,1.2,NAP_NEAR).filter(g=>!nap_clear(c,g)));
// a tussock of q'oya at (x, y), s px tall about: a fan of long blades from one base, the outer ones arching over; wind leans them.
// Near, it is a mound of blades: filled, in the ink, with the blades drawn over it and the longest arching out of it
function nap_tuft(ctx,x,y,s,hv,dm,wet,wind){const U=PK.u,cc=nap_fog(U.mix(wet?nap_c("qoyaG"):nap_c("qoya"),nap_c("straw2"),hv*0.6),dm),w=wind||0,H=(k,n)=>U.hash(k*13+n,Math.round(hv*97)+3);
  if(s>40){const cx=x,cy=y-s*0.12,N=46,R=th=>s*(1.0-0.3*Math.pow(Math.abs(th)/1.75,2)),pts=[];
    // the clump's outline: a dome of fine points, wider than it is tall, leaning with the wind
    for(let i=0;i<=N;i++){const th=-1.75+3.5*(i+(i%2?0.5*(H(i,1)-0.5):0))/N,r=R(th)*(i%2?0.78+0.14*H(i,3):0.94+0.12*H(i,2)),lean=w*(1-Math.abs(th)/1.75)*s*0.9;
      pts.push([cx+Math.sin(th)*r*0.78+lean,cy-Math.cos(th)*r]);}
    ctx.beginPath();ctx.moveTo(x-s*0.14,y);ctx.quadraticCurveTo(x-s*0.5,y-s*0.04,pts[0][0],pts[0][1]);for(let i=1;i<=N;i++)ctx.lineTo(pts[i][0],pts[i][1]);
    ctx.quadraticCurveTo(x+s*0.5,y-s*0.04,x+s*0.14,y);ctx.closePath();ctx.fillStyle=U.css(U.mix(cc,nap_c("qoya2"),0.2));ctx.fill();
    ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=Math.max(1.6,s*0.01);ctx.lineJoin="round";ctx.stroke();
    // the blades inside it, from the base up to its points, in a darker straw, and a few lighter ones catching the sun
    ctx.lineCap="round";ctx.beginPath();for(let k=0;k<16;k++){const i=1+2*Math.floor(H(k,4)*(N/2-1)),[tx,ty]=pts[i],f=(tx-x)/s;
      ctx.moveTo(x+f*s*0.08,y);ctx.quadraticCurveTo(x+f*s*0.2,y-s*0.6,U.lerp(x,tx,0.92),U.lerp(y,ty,0.92));}
    ctx.strokeStyle=U.css(U.dk(cc,0.22));ctx.lineWidth=Math.max(0.8,s*0.006);ctx.stroke();
    ctx.beginPath();for(let k=0;k<8;k++){const i=2*Math.floor(H(k,6)*(N/2)),[tx,ty]=pts[i],f=(tx-x)/s;ctx.moveTo(x+f*s*0.05,y-s*0.06);ctx.quadraticCurveTo(x+f*s*0.18,y-s*0.55,U.lerp(x,tx,0.8),U.lerp(y,ty,0.8));}
    ctx.strokeStyle=U.css(U.lt(cc,0.28));ctx.lineWidth=Math.max(0.8,s*0.007);ctx.stroke();
    // the longest blades, arching out over its sides and down
    ctx.beginPath();for(const [side,k] of[[-1,0],[-1,1],[1,2],[1,3],[1,4]]){const r0=0.55+0.25*H(k,8),ex=x+side*s*(0.95+0.25*H(k,9))+w*s*0.6,ey=y-s*(0.25+0.3*H(k,10));
      ctx.moveTo(x+side*s*0.06,y-s*0.1);ctx.quadraticCurveTo(x+side*s*r0*0.8+w*s*0.4,y-s*(1.0+0.15*H(k,11)),ex,ey);}
    ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=Math.max(2.2,s*0.014);ctx.stroke();ctx.strokeStyle=U.css(cc);ctx.lineWidth=Math.max(1,s*0.007);ctx.stroke();return;}
  ctx.strokeStyle=U.css(cc);ctx.lineWidth=Math.max(0.8,s*0.07);ctx.lineCap="round";ctx.beginPath();const n=s>12?9:6;
  for(let k=0;k<n;k++){const f=k/(n-1)*2-1,an=f*0.95+(H(k,5)-0.5)*0.3+w*(1-0.5*Math.abs(f)),len=0.8+0.3*H(k,7);
    ctx.moveTo(x+f*s*0.07,y);ctx.quadraticCurveTo(x+Math.sin(an)*s*0.4*len,y-s*0.95*len,x+Math.sin(an)*s*1.0*len,y-Math.cos(an)*s*1.1*len);}ctx.stroke();
  if(s>6){ctx.strokeStyle=U.css(nap_ink(cc,dm,120),0.55);ctx.lineWidth=Math.max(0.7,s*0.03);ctx.beginPath();for(let k=0;k<3;k++){const an=-0.45+k*0.45+w;ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.sin(an)*s*0.36,y-s*0.85,x+Math.sin(an)*s*0.9,y-Math.cos(an)*s);}ctx.stroke();}}
// the near tussocks, as drawables: the wind leans them a little, each at its own moment
const nap_nearTufts=(c,tt)=>nap_nears(c).map(g=>({d:g.dm,draw:ctx=>nap_tuft(ctx,g.q[0],g.q[1],g.s,g.hv,g.dm,g.wet,Math.sin(tt*1.1+g.X*0.7)*0.05+Math.sin(tt*2.3+g.Z)*0.02)}));

/* a bundle of cut q'oya lying on the ground, tied in the middle, its blades fanning out at both ends: from X0 to X1 at Z */
function nap_bundle(c,X0,X1,Z,o){o=o||{};const dm=c.d((X0+X1)/2,Z);
  return{d:dm-(o.front||0),draw:ctx=>{const U=PK.u,a=c.P(X0,0,Z),b=c.P(X1,0,Z);if(a[2]<c.N+0.3)return;const m=c.f/a[2],r=(o.r||0.2)*m,cc=nap_fog(U.mix(nap_c("qoya"),nap_c("straw"),0.35),dm),lw=nap_lw(c,dm,0.016,0.8,2.8);
    const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);ctx.save();ctx.translate(a[0],a[1]);ctx.rotate(Math.atan2(dy,dx));
    const shape=()=>{ctx.beginPath();ctx.moveTo(-r*0.15,-r*0.1);ctx.quadraticCurveTo(-r*0.45,-r*1.5,r*0.25,-r*1.85);ctx.quadraticCurveTo(L*0.3,-r*1.35,L*0.5,-r*1.2);
      ctx.quadraticCurveTo(L*0.7,-r*1.35,L-r*0.25,-r*1.9);ctx.quadraticCurveTo(L+r*0.5,-r*1.5,L+r*0.15,-r*0.1);ctx.quadraticCurveTo(L*0.5,r*0.12,-r*0.15,-r*0.1);ctx.closePath();};
    shape();ctx.fillStyle=U.css(cc);ctx.fill();ctx.strokeStyle=U.css(nap_ink(cc,dm));ctx.lineWidth=lw;ctx.lineJoin="round";ctx.stroke();
    // its blades: along it, gathered at the band, and their tips out at both ends
    ctx.strokeStyle=U.css(U.dk(cc,0.2));ctx.lineWidth=Math.max(0.5,lw*0.5);ctx.lineCap="round";ctx.beginPath();
    for(let k=0;k<6;k++){const f=(k+0.5)/6;ctx.moveTo(r*0.05,-r*(0.2+f*1.5));ctx.quadraticCurveTo(L*0.3,-r*(0.25+f*1.0),L*0.5,-r*(0.25+f*0.9));ctx.quadraticCurveTo(L*0.7,-r*(0.25+f*1.0),L-r*0.05,-r*(0.2+f*1.55));}
    for(let k=0;k<5;k++){const f=(k-2)/2;ctx.moveTo(-r*0.1,-r*(0.95+f*0.6));ctx.lineTo(-r*(0.45+0.15*Math.abs(f)),-r*(1.0+f*0.95));ctx.moveTo(L+r*0.1,-r*(0.95+f*0.6));ctx.lineTo(L+r*(0.45+0.15*Math.abs(f)),-r*(1.0+f*0.95));}
    ctx.stroke();
    ctx.fillStyle=U.css(nap_fog(nap_c("ropeDk"),dm));ctx.beginPath();U.rrect(ctx,L*0.47,-r*1.26,L*0.06,r*1.3,2);ctx.fill();ctx.strokeStyle=U.css(nap_ink(cc,dm));ctx.lineWidth=lw*0.8;ctx.stroke();ctx.restore();}};}
/* a big bundle standing, tied round its middle (band: 0 to 1, how tight the cord is drawn; the cord's ends in the hands that pull it) */
function nap_stook(c,X,Z,o){o=o||{};const dm=c.d(X,Z)+(o.back||0);
  return{d:dm,draw:ctx=>{const U=PK.u,p=c.P(X,0,Z);if(p[2]<c.N+0.3)return;const m=c.f/p[2],H=(o.ht||1.05)*m,W=0.5*m,cc=U.mix(nap_c("qoya"),nap_c("straw"),0.3),lw=nap_lw(c,dm,0.016,0.8,2.8),
      pinch=0.1+0.08*(o.band||0),yb=p[1]-H*0.5;
    ctx.save();ctx.translate(p[0],p[1]);ctx.fillStyle=U.css(cc);ctx.beginPath();ctx.moveTo(-W*0.48,0);ctx.quadraticCurveTo(-W*(0.5-pinch),-H*0.5,-W*0.62,-H*0.98);ctx.quadraticCurveTo(0,-H*1.12,W*0.62,-H*0.98);
    ctx.quadraticCurveTo(W*(0.5-pinch),-H*0.5,W*0.48,0);ctx.closePath();ctx.fill();ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=lw;ctx.lineJoin="round";ctx.stroke();
    ctx.strokeStyle=U.css(U.dk(cc,0.22));ctx.lineWidth=Math.max(0.5,lw*0.5);ctx.lineCap="round";ctx.beginPath();for(let k=-4;k<=4;k++){ctx.moveTo(k*W*0.1,-H*0.03);ctx.quadraticCurveTo(k*W*(0.03),-H*0.5,k*W*0.15,-H*0.99);}ctx.stroke();
    ctx.fillStyle=U.css(nap_c("ropeDk"));ctx.beginPath();U.rrect(ctx,-W*(0.5-pinch)*1.02,-H*0.53,W*(0.5-pinch)*2.04,H*0.05,2);ctx.fill();ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=lw*0.8;ctx.stroke();
    ctx.restore();}};}

/* the place, painted once: the sky, the ground, the far tussocks and the bundles already cut, the furthest first */
const NAP_THINGS=[c=>nap_bundle(c,-8.6,-7.0,13.5),c=>nap_bundle(c,-7.8,-6.4,14.4,{r:0.18}),c=>nap_bundle(c,5.2,6.6,15.5),c=>nap_bundle(c,6.9,8.1,16.2,{r:0.18})];
AG_PLACES.naPuna=ctx=>{const c=NAP_CAM;nap_sky(ctx,c);nap_ground(ctx,c);const D=nap_tufts(c).concat(NAP_THINGS.map(f=>f(c)));D.sort((a,b)=>b.d-a.d);for(const it of D)it.draw(ctx);};

/* ---------------------------------------------------------------- the people at work, in plain colours
   An older woman and a younger one in a felt hat, a cardigan and a full skirt, long braids; a man in a knitted sweater, dark trousers
   and a felt hat; and whoever carries a bundle away. One plain colour each. */
const NAP_FOLK={
  elder:{key:"elder",name:"",skin:[170,118,88],hair:{style:"long",c:[150,146,144]},top:{kind:"sweater",c:[128,74,82]},bottom:{kind:"skirt",c:[52,58,84]},shoe:[54,42,38],qhat:"felt"},
  young:{key:"young",name:"",skin:[178,124,92],hair:{style:"long",c:[28,24,26]},top:{kind:"sweater",c:[84,120,110]},bottom:{kind:"skirt",c:[150,72,70]},shoe:[54,42,38],qhat:"felt"},
  man:{key:"man",name:"",skin:[164,110,80],hair:{style:"short",c:[32,28,28]},top:{kind:"sweater",c:[92,106,124]},bottom:{kind:"trousers",c:[62,60,70]},shoe:[54,42,38],qhat:"felt"},
  bearer:{key:"bearer",name:"",skin:[172,118,86],hair:{style:"short",c:[34,28,28]},top:{kind:"jacket",c:[150,110,86],inner:[214,204,184]},bottom:{kind:"trousers",c:[70,66,70]},shoe:[54,42,38],qhat:"felt"}};
// a felt hat over the head's picture, from the joints PK.person gives back: it nods with the head
function nap_hat(ctx,P,J){if(!P.qhat||!J||!J.hc)return;const S=PK.S,U=PK.u,hh=J.p.head*J.u,[x,y]=J.hc,r=hh*0.5,lw={lw:U.clamp(hh*0.03,0.8,3.4)};S.begin(ctx,lw);
  const hc=S.tone([96,80,70]),top=y-r*0.62;
  S.fill(ctx,c=>U.ell(c,x,top+r*0.02,r*1.42,r*0.26),U.dk(hc,0.06),{});
  S.fill(ctx,c=>{c.moveTo(x-r*0.8,top);c.bezierCurveTo(x-r*0.82,top-r*0.7,x+r*0.82,top-r*0.7,x+r*0.8,top);c.closePath();},hc,{});
  S.line(ctx,c=>{c.moveTo(x-r*0.78,top-r*0.12);c.quadraticCurveTo(x,top-r*0.04,x+r*0.78,top-r*0.12);},[150,74,70],1.4);}
const nap_person=(ctx,who,x,fl,h,pose,o)=>{const P=typeof who==="string"?NAP_FOLK[who]:who,J=PK.person(ctx,P,x,fl,h,pose,o);if(!(o&&o.part==="lower"))nap_hat(ctx,P,J);return J;};

/* a sickle in the near hand: a short wooden handle in the fist, and the curved blade from its end, drawn at the person's size
   (m: px in a metre where they are); deg the hand's angle, flipped for someone who faces left */
const nap_sickle=(m,left)=>(ctx,h,deg)=>{const S=PK.S,U=PK.u,[x,y]=h,a=(deg||0)*Math.PI/180,L=0.12*m,R=0.13*m;ctx.save();ctx.translate(x,y);ctx.rotate(a);if(left)ctx.scale(-1,1);
  S.begin(ctx,{lw:U.clamp(m*0.006,0.9,2.6)});
  S.fill(ctx,c=>U.rrect(c,-L*0.35,-0.016*m,L*1.15,0.032*m,0.012*m),nap_c("wood"),{});
  S.fill(ctx,c=>{c.moveTo(L*0.78,-0.008*m);c.bezierCurveTo(L*0.95+R*0.4,-R*1.15,L*0.95+R*1.55,-R*0.9,L*0.95+R*1.62,R*0.1);c.bezierCurveTo(L*0.95+R*1.3,-R*0.55,L*0.95+R*0.5,-R*0.7,L*0.8,0.012*m);c.closePath();},nap_c("blade"),{});
  ctx.restore();};
// a handful of blades, just cut, in the far hand: drawn under the hand, as the blades were gathered (nap_qoya): their cut ends below
// the fist, their tips fanning out above it, each blade in ink under its colour; a fades it as it goes onto the pile
const nap_handful=(m,left,a)=>(ctx,h)=>{const U=PK.u,[x,y]=h,s=left?-1:1;if(a!=null&&a<=0.01)return;const cc=U.mix(nap_c("qoya"),nap_c("straw2"),0.25);
  ctx.save();if(a!=null)ctx.globalAlpha*=a;ctx.lineCap="round";
  for(let i=0;i<12;i++){const f=(i-5.5)/5.5,bx=x+f*0.035*m-s*0.02*m,by=y+0.2*m,tx=x+f*0.1*m+s*0.01*m,ty=y-0.22*m+Math.abs(f)*0.05*m;
    ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=U.clamp(m*0.011,1.4,4.2);ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo(x+f*0.012*m,y,tx,ty);ctx.stroke();
    ctx.strokeStyle=U.css(i%3?cc:U.dk(cc,0.18));ctx.lineWidth=U.clamp(m*0.0065,0.8,2.6);ctx.stroke();}
  ctx.restore();};

/* a tussock at work, drawn every frame: its mound, and the handful of blades a hand gathers from it (grip: [x, y] in the frame, k 0 to
   1: how far the blades are pulled to it), then cut (cut 1: the handful is in the hand, a little stubble left at the base) */
function nap_qoya(c,X,Z,tt,o){o=o||{};const dm=c.d(X,Z)+(o.back||0.05);
  return{d:dm,draw:ctx=>{const U=PK.u,p=c.P(X,0,Z);if(p[2]<c.N+0.3)return;const m=c.f/p[2],s=(o.ht||0.5)*m,wind=Math.sin(tt*1.1+X*0.7)*0.05+Math.sin(tt*2.3+Z)*0.02;
    nap_tuft(ctx,p[0],p[1],s,0.42,dm,false,wind);
    const g=o.grip,k=g?U.clamp(o.k||0,0,1):0,cc=U.mix(nap_c("qoya"),nap_c("straw2"),0.25),sd=o.side||0;
    ctx.save();ctx.lineCap="round";
    if(o.cut){ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=U.clamp(m*0.008,1.2,3);ctx.beginPath();for(let i=0;i<6;i++){const f=(i-2.5)/2.5,x0=p[0]+sd*m*0.1+f*0.05*m;ctx.moveTo(x0,p[1]);ctx.lineTo(x0+f*0.015*m,p[1]-0.05*m);}ctx.stroke();}
    else if(k>0.01){for(let i=0;i<12;i++){const f=(i-5.5)/5.5,x0=p[0]+sd*m*0.1+f*0.05*m,an=f*0.6+wind,tx0=x0+Math.sin(an)*s*0.9,ty0=p[1]-Math.cos(an)*s*1.05,
        tx=U.lerp(tx0,g[0]+(tx0-g[0])*0.2+f*0.04*m,k),ty=U.lerp(ty0,g[1]-0.22*m+Math.abs(f)*0.05*m,k),mx=U.lerp((x0+tx0)/2,(x0+g[0])/2,k),my=U.lerp(p[1]-s*0.7,(p[1]+g[1])/2,k);
        ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=U.clamp(m*0.011,1.4,4.2);ctx.beginPath();ctx.moveTo(x0,p[1]);ctx.quadraticCurveTo(mx,my,tx,ty);ctx.stroke();
        ctx.strokeStyle=U.css(i%3?cc:U.dk(cc,0.18));ctx.lineWidth=U.clamp(m*0.0065,0.8,2.6);ctx.stroke();}}
    ctx.restore();}};}

/* the handfuls cut so far, in a low heap beside the tussock: blades lying across each other, their cut ends together */
function nap_heap(c,X,Z){const dm=c.d(X,Z);
  return{d:dm,draw:ctx=>{const U=PK.u,p=c.P(X,0,Z);if(p[2]<c.N+0.3)return;const m=c.f/p[2],cc=U.mix(nap_c("qoya"),nap_c("straw"),0.3),R=U.rnd(Math.round(X*41+Z*7));
    ctx.save();ctx.lineCap="round";
    for(let i=0;i<16;i++){const y0=p[1]-R()*0.07*m,x0=p[0]-0.14*m+R()*0.06*m,L=(0.3+R()*0.12)*m,an=-0.12+R()*0.24,x1=x0+Math.cos(an)*L,y1=y0+Math.sin(an)*L*0.3-0.04*m*R();
      ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=U.clamp(m*0.011,1.3,4);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,Math.min(y0,y1)-0.03*m,x1,y1);ctx.stroke();
      ctx.strokeStyle=U.css(i%3?cc:U.dk(cc,0.18));ctx.lineWidth=U.clamp(m*0.0065,0.8,2.6);ctx.stroke();}
    ctx.restore();}};}

/* ---------------------------------------------------------------- someone at work in the world, as a drawable: at (X, Z), their size a
   standing adult's there (1.62 m); o.t the time (always), o.flip, o.opt PK.person's own options; o.after(ctx, J) drawn over them */
function nap_folk(c,who,X,Z,pose,o){o=o||{};const U=PK.u,p=c.P(X,0,Z),h=c.h(X,Z)*(o.k||1),dm=p[2];
  return{d:dm-(o.front||0),key:o.key,draw:ctx=>{if(dm<c.N+0.3||h<6)return null;const far=U.clamp((dm-20)/140,0,0.7);
    const J=nap_person(ctx,who,p[0],p[1],h,pose||"stand",Object.assign({t:o.t,flip:o.flip||false,far,shade:h>60?1:0},o.opt||{}));if(o.after)o.after(ctx,J);return J;}};}
// a frame on the plain: the drawables, the furthest first; returns the joints of those with a key
function nap_scene(ctx,items){const c=NAP_CAM,D=items.filter(Boolean).map(f=>typeof f==="function"?f(c):f);D.sort((a,b)=>b.d-a.d);
  const out={};for(const it of D){const J=it.draw(ctx);if(it.key)out[it.key]=J;}return out;}

/* ---------------------------------------------------------------- someone walking on the plain along w.path, points [X, 0, Z], between
   w.t0 and w.t1: the stride grows out of w.before and dies into w.then, as PK.walk's does; w.arms keeps the arms that carry something;
   o.back(ctx, x, floor, h, left) draws what they carry on their back, before them, so their body is over it */
function nap_walker(c,who,t,w,o){o=o||{};const U=PK.u,P=typeof who==="string"?NAP_FOLK[who]:who,amp=PK.ampOf(P),pts=w.path,cum=[0];
  for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][2]-pts[i-1][2]));
  const L=cum[cum.length-1],at=s=>{s=U.clamp(s,0,L);let i=1;while(i<pts.length-1&&cum[i]<s)i++;const a=pts[i-1],b=pts[i],k=U.clamp((s-cum[i-1])/((cum[i]-cum[i-1])||1),0,1);
    return[U.lerp(a[0],b[0],k),0,U.lerp(a[2],b[2],k)];};
  const q=PK.walkAt(t,{x0:0,x1:L,t0:w.t0,t1:w.t1,floor:0,h:1.62,amp}),[X,,Z]=at(q.x),p=c.P(X,0,Z),h=c.h(X,Z);
  const sx=s=>c.P(...at(s))[0],left=sx(L)<sx(0);
  const arm=pp=>w.arms?Object.assign({},pp,{aN:w.arms.aN||pp.aN,aF:w.arms.aF||pp.aF}):pp,st=arm(PK.POSES.stand),pose=PK.poseMix(q.u<0.5?(w.before||st):arm(w.then||st),arm(PK.poseWalk(q.step,1,amp)),q.go);
  return{d:p[2],key:o.key,draw:ctx=>{if(p[2]<c.N+0.3||h<6)return null;if(o.back)o.back(ctx,p[0],p[1],h,left);
    return nap_person(ctx,who,p[0],p[1],h,pose,Object.assign({t,flip:left,life:1-0.8*q.go,far:U.clamp((p[2]-20)/140,0,0.7),shade:h>60?1:0},o.opt||{}));}};}
// a big bundle on someone's back, tied across the chest: drawn behind them at their size (h: their height, px)
function nap_load(ctx,x,fl,h,left){const U=PK.u,S=PK.S,s=left?1:-1,cx=x+s*0.13*h,cy=fl-0.66*h,W=0.2*h,H=0.36*h,cc=U.mix(nap_c("qoya"),nap_c("straw"),0.3);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-s*0.12);S.begin(ctx,{lw:U.clamp(h*0.012,0.8,2.6)});
  S.fill(ctx,c2=>{c2.moveTo(-W,-H*0.9);c2.quadraticCurveTo(0,-H*1.25,W,-H*0.9);c2.quadraticCurveTo(W*1.2,0,W,H*0.9);c2.quadraticCurveTo(0,H*1.1,-W,H*0.9);c2.quadraticCurveTo(-W*1.2,0,-W,-H*0.9);c2.closePath();},cc,{});
  S.line(ctx,c2=>{for(let k=-2;k<=2;k++){c2.moveTo(k*W*0.3,-H*0.95);c2.quadraticCurveTo(k*W*0.36,0,k*W*0.3,H*0.92);}},U.dk(cc,0.22),U.clamp(h*0.005,0.6,1.4));
  S.fill(ctx,c2=>U.rrect(c2,-W*1.08,-H*0.1,W*2.16,H*0.12,2),nap_c("ropeDk"),{w:0.7});ctx.restore();}

/* ---------------------------------------------------------------- the three at work, and the one who carries a bundle away
   Each cuts in a cycle of their own, so no two move together: the far hand gathers a handful of blades, the sickle in the near hand
   cuts them at the base, and the handful is laid on the pile beside them; the tussock grows back for the next (it is a drawing: a
   tussock gives several handfuls). The man draws the cord tight round a bundle. Every hand arrives at what it reaches for. */
const NAP_KNEELCUT={mode:"kneel",lean:56,head:-22,aN:[22,44,"grip"],aF:[30,52,"grip"],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
const NAP_CROUCHCUT={mode:"stand",lean:38,head:10,aN:[30,50,"grip"],aF:[40,58,"grip"],lN:[114,-34],lF:[106,-42],fN:0,fF:12};
const NAP_TIE={lean:36,head:12,aN:[30,40,"grip"],aF:[34,44,"grip"],lN:[16,-14],lF:[22,-10]};
const NAP_BEAR={aN:[18,118,"grip"],aF:[22,122,"grip"]};
// where each works: [who, X, Z, faces left, pose, the tussock's X, Z, the cycle's length and its start]
const NAP_AT={elder:[-1.95,4.6,false,NAP_KNEELCUT,-1.56,4.66,4.4,0.3],young:[2.9,7.8,true,NAP_CROUCHCUT,2.42,7.86,3.9,1.7]};
const NAP_MAN=[-4.35,9.6],NAP_STOOK=[-3.82,9.66],NAP_ROAD=[[12.7,0,16.5],[11.4,0,22],[11.0,0,27]];
// where nothing near grows in front of someone: [X, Z, half width in m] of each
const NAP_CLEAR=[[-1.85,4.6,0.75],[2.7,7.8,0.6],[-4.1,9.6,0.7]];
const nap_clear=(c,g)=>NAP_CLEAR.some(([X,Z,w])=>{const p=c.P(X,0,Z),m=c.f/p[2];if(g.dm>=p[2])return false;
  return g.q[0]+g.s*0.9>p[0]-w*m&&g.q[0]-g.s*0.9<p[0]+w*m&&g.q[1]>p[1]-1.7*m&&g.q[1]-g.s*1.1<p[1];});
// one cycle at u (0 to 1): how far the far hand has gathered (k), whether the handful is cut (cut), where the sickle is along the base
// (s, -1 to 1) and how far the near hand has come to it (n), how far the far hand has gone to the pile (lay), and the handful in it
// (held: 1 from the cut until it is laid down, then gone, so it never comes back to the hand that returns empty)
function nap_cycle(u){const U=PK.u,io=(a,b,c,d)=>U.sine(U.clamp((u-a)/(b-a),0,1))*(1-U.sine(U.clamp((u-c)/(d-c),0,1)));
  return{k:io(0.02,0.24,0.62,0.8),n:io(0.2,0.34,0.56,0.66),s:-1+2*U.sine(U.clamp((u-0.34)/0.2,0,1)),cut:u>0.5&&u<0.94?1:0,lay:io(0.6,0.76,0.84,0.98),
    held:u<0.5?0:1-U.sine(U.clamp((u-0.7)/0.06,0,1))};}
function nap_cutter(c,key,tt,T){const U=PK.u,[X,Z,left,pose,Xt,Zt,per,ph]=NAP_AT[key],p=c.P(Xt,0,Zt),m=c.f/p[2],s=left?-1:1,q=nap_cycle(((tt+ph)%per)/per);
  const grip=[p[0]+s*0.08*m,p[1]-0.36*m],base=[p[0]+q.s*0.05*m,p[1]-0.13*m],pile=[p[0]-s*0.12*m,p[1]-0.16*m];
  const hF=[U.lerp(grip[0],pile[0],q.lay),U.lerp(grip[1],pile[1],q.lay)];
  return[nap_qoya(c,Xt,Zt,tt,{grip:[grip[0],grip[1]],k:q.k,cut:q.cut,side:s*0.15,back:0.08}),nap_heap(c,Xt-s*0.2,Zt+0.12),
    nap_folk(c,key,X,Z,pose,{t:tt,flip:left,key,opt:Object.assign({reachF:hF,reachFk:Math.max(q.k,q.lay),reachN:base,reachNk:q.n*0.9+0.1,
      hold:nap_sickle(m,left),underF:q.held>0.01?nap_handful(m,left,q.held):null,holds:true},PK.face(tt,{expr:"neutral",gaze:[1,0.8]},T&&T.look&&T.look[key]!=null?[[T.look[key],"look",2.2,[1,-0.1]],[T.look[key]+0.5,"smile",1.8]]:[]))})];}
function nap_work(ctx,tt,T){const c=NAP_CAM,U=PK.u,ps=c.P(NAP_STOOK[0],0,NAP_STOOK[1]),ms=c.f/ps[2],pull=0.5+0.5*Math.sin(tt*1.6);
  const lk=T.look||{},ev=k=>lk[k]!=null?[[lk[k],"look",2.2,[1,-0.1]],[lk[k]+0.5,"smile",1.8]]:[];
  return nap_scene(ctx,[...nap_cutter(c,"elder",tt,T),...nap_cutter(c,"young",tt,T),
    nap_stook(c,NAP_STOOK[0],NAP_STOOK[1],{band:pull,back:0.05,ht:1.25}),
    nap_folk(c,"man",NAP_MAN[0],NAP_MAN[1],NAP_TIE,{t:tt,key:"man",opt:Object.assign({reachN:[ps[0]-0.12*ms+0.03*ms*pull,ps[1]-0.64*ms],reachNk:1,reachF:[ps[0]-0.04*ms,ps[1]-0.66*ms],reachFk:1,holds:true},
      PK.face(tt,{expr:"neutral",gaze:[1,0.7]},ev("man")))}),
    nap_walker(c,"bearer",tt,{path:NAP_ROAD,t0:(T.t0||0)-1,t1:(T.t0||0)+17,arms:NAP_BEAR},{key:"bearer",opt:{holds:true},back:nap_load}),
    ...nap_nearTufts(c,tt)]);}
