/* ===== No secret to lose: the City of London, 1990 =====
   The opening's places, painted once each, in the module's night glass light: a petrol sky going pale at the horizon, stone cool,
   windows and doorways warm. Plain shapes and soft gradients, as the module's look paints the past; no texture that would crawl
   under a slow camera. Everything here is the film's own (prefix ns_); the hall, the people, the cards and the words are the kit's. */

/* ---------------------------------------------------------------- a street in perspective */
// A street seen from the middle of the road: x = vx + f*X/Z, y = vy + f*(eye - up)/Z, metres in, pixels out.
function ns_cam(vx,vy,f,eye){return{vx,vy,f,eye,p:(X,up,Z)=>[vx+f*X/Z,vy+f*(eye-up)/Z]};}
// a quad on a facade (the plane X), from depth z0 to z1 and height u0 to u1
function ns_wallQuad(c,K,X,z0,z1,u0,u1){const a=K.p(X,u0,z0),b=K.p(X,u0,z1),d=K.p(X,u1,z1),e=K.p(X,u1,z0);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
// a quad facing us (the plane Z), from x0 to x1 and height u0 to u1
function ns_frontQuad(c,K,Z,x0,x1,u0,u1){const a=K.p(x0,u0,Z),b=K.p(x1,u1,Z);c.beginPath();c.rect(a[0],b[1],b[0]-a[0],a[1]-b[1]);}
const NS_SKY=[[0,[5,13,19]],[0.55,[16,36,45]],[0.86,[38,66,74]],[1,[70,92,94]]];
function ns_sky(c,w,y1,o){o=o||{};const g=c.createLinearGradient(0,0,0,y1);for(const [s,col] of (o.stops||NS_SKY))g.addColorStop(s,`rgb(${col})`);c.fillStyle=g;c.fillRect(0,0,w,y1);
  // the first light, low behind the buildings: warm, faint
  if(o.dawn){const [x,y,r]=o.dawn,d=c.createRadialGradient(x,y,10,x,y,r);d.addColorStop(0,"rgba(255,200,150,0.30)");d.addColorStop(0.45,"rgba(240,170,130,0.10)");d.addColorStop(1,"rgba(240,170,130,0)");c.fillStyle=d;c.fillRect(0,0,w,y1);}}
const NS_STONE={lit:[44,70,78],mid:[30,52,60],dark:[17,32,38],deep:[10,21,26],edge:"rgba(190,225,232,0.34)",edgeSoft:"rgba(170,210,220,0.18)",glass:[9,19,23]};
const NS_WARM={glow:"rgba(255,196,120,0.9)",win:[255,206,140],door:[255,214,150]};
// a window on a facade, dark or lit, with its stone surround and a sill
function ns_sideWindow(c,K,X,z0,z1,u0,u1,lit,R){ns_wallQuad(c,K,X,z0-0.12,z1+0.12,u0-0.22,u1+0.18);c.fillStyle=`rgb(${NS_STONE.lit})`;c.globalAlpha=0.35;c.fill();c.globalAlpha=1;
  ns_wallQuad(c,K,X,z0,z1,u0,u1);if(lit){c.save();c.shadowColor=NS_WARM.glow;c.shadowBlur=10;c.fillStyle=`rgba(${NS_WARM.win},${0.55+0.35*R()})`;c.fill();c.restore();}
  else{c.fillStyle=`rgb(${NS_STONE.glass})`;c.fill();}
  // the glazing bar down the middle
  const m=(z0+z1)/2,a=K.p(X,u0,m),b=K.p(X,u1,m);c.strokeStyle=lit?"rgba(120,80,40,0.55)":"rgba(150,190,200,0.16)";c.lineWidth=1.2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
// one building on one side of the street: X its facade's plane, from depth z0 to z1, H tall, its style from s
function ns_building(c,K,X,z0,z1,H,s,R){const side=X<0?-1:1,base=s.base||5.2,top=H;
  // the facade, lit from the sky: the right side a little brighter (the light comes down the street from beyond the Bank)
  ns_wallQuad(c,K,X,z0,z1,0,top);const a=K.p(X,0,z0),b=K.p(X,0,z1),g=c.createLinearGradient(a[0],0,b[0],0),L=side>0?NS_STONE.lit:NS_STONE.mid,D=side>0?NS_STONE.mid:NS_STONE.dark;
  g.addColorStop(0,`rgb(${D})`);g.addColorStop(1,`rgb(${L})`);c.fillStyle=g;c.fill();
  // the ground floor's rusticated stone: its joints
  c.strokeStyle="rgba(150,190,200,0.10)";c.lineWidth=1;for(let u=0.9;u<base;u+=0.9){const p0=K.p(X,u,z0),p1=K.p(X,u,z1);c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  // a string course over the ground floor and a cornice at the top, each catching the light on its upper edge
  for(const [u,d] of [[base,0.35],[top-0.6,0.6]]){ns_wallQuad(c,K,X,z0,z1,u,u+d);c.fillStyle=`rgb(${NS_STONE.deep})`;c.fill();
    const p0=K.p(X,u+d,z0),p1=K.p(X,u+d,z1);c.strokeStyle=NS_STONE.edge;c.lineWidth=1.4;c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  // the floors above: tall windows, some lit
  const bays=Math.max(1,Math.round((z1-z0)/(s.bay||3.2))),fh=s.floor||3.6;
  for(let u=base+1.0;u+fh*0.62<top-1.2;u+=fh)for(let i=0;i<bays;i++){const zz0=z0+(i+0.28)*(z1-z0)/bays,zz1=z0+(i+0.72)*(z1-z0)/bays;ns_sideWindow(c,K,X,zz0,zz1,u,u+fh*0.62,R()<(s.lit||0.22),R);}
  // the ground floor: a doorway with its warm light, or tall dark windows
  for(let i=0;i<bays;i++){const zz0=z0+(i+0.25)*(z1-z0)/bays,zz1=z0+(i+0.75)*(z1-z0)/bays;
    if(s.door===i){const zm=(zz0+zz1)/2,dz=Math.min(0.9,(zz1-zz0)/2),dh=3.4;
      // the stone surround, then the opening with a round head, lit from inside, and one leaf of the door swung in
      ns_wallQuad(c,K,X,zm-dz-0.35,zm+dz+0.35,0,dh+0.9);c.fillStyle=`rgb(${NS_STONE.deep})`;c.fill();
      const A=K.p(X,0,zm-dz),B=K.p(X,0,zm+dz),T=K.p(X,dh-0.6,zm-dz),U=K.p(X,dh-0.6,zm+dz),M=K.p(X,dh+0.3,zm);
      c.save();c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(T[0],T[1]);c.quadraticCurveTo(M[0],M[1]-(T[1]-M[1])*0.15,U[0],U[1]);c.lineTo(B[0],B[1]);c.closePath();
      const q=K.p(X,1.4,zm),r=Math.abs(A[0]-B[0])*1.6+Math.abs(A[1]-T[1])*0.5,gg=c.createRadialGradient(q[0],q[1],2,q[0],q[1],r);gg.addColorStop(0,`rgb(${NS_WARM.door})`);gg.addColorStop(0.45,"rgb(196,132,72)");gg.addColorStop(1,"rgb(72,44,28)");
      c.fillStyle=gg;c.shadowColor=NS_WARM.glow;c.shadowBlur=14;c.fill();c.clip();
      const D0=K.p(X,0,zm-dz),D1=K.p(X,0,zm-dz+dz*0.7),D2=K.p(X,dh-0.8,zm-dz+dz*0.7),D3=K.p(X,dh-0.8,zm-dz);c.fillStyle="rgb(48,30,20)";c.beginPath();c.moveTo(D0[0],D0[1]);c.lineTo(D1[0]+(side>0?-1:1)*Math.abs(D1[0]-D0[0])*0.5,D1[1]);c.lineTo(D2[0]+(side>0?-1:1)*Math.abs(D1[0]-D0[0])*0.5,D2[1]);c.lineTo(D3[0],D3[1]);c.closePath();c.fill();c.restore();
      // a step, catching the light
      ns_wallQuad(c,K,X,zm-dz-0.2,zm+dz+0.2,0,0.25);c.fillStyle="rgba(255,214,150,0.25)";c.fill();
      // the light thrown on the pavement
      const P=K.p(X-side*1.6,0,zm),pr=Math.abs(A[0]-B[0])*1.3+18;c.save();c.translate(P[0],P[1]);c.scale(1.6,0.45);const pg=c.createRadialGradient(0,0,0,0,0,pr);pg.addColorStop(0,"rgba(255,206,140,0.20)");pg.addColorStop(1,"rgba(255,206,140,0)");c.fillStyle=pg;c.fillRect(-pr,-pr,pr*2,pr*2);c.restore();}
    else{ns_wallQuad(c,K,X,zz0,zz1,0.8,base-1.0);c.fillStyle=`rgb(${NS_STONE.glass})`;c.fill();}}
  // the facade's near edge, lit
  const e0=K.p(X,0,z0),e1=K.p(X,top,z0);c.strokeStyle=NS_STONE.edgeSoft;c.lineWidth=1.4;c.beginPath();c.moveTo(e0[0],e0[1]);c.lineTo(e1[0],e1[1]);c.stroke();
  // the roof's edge against the sky
  const r0=K.p(X,top,z0),r1=K.p(X,top,z1);c.strokeStyle=NS_STONE.edge;c.lineWidth=1.6;c.beginPath();c.moveTo(r0[0],r0[1]);c.lineTo(r1[0],r1[1]);c.stroke();}
// the Bank of England's outer wall, face on at depth Z: rusticated, windowless, with columns in pairs and a cornice; its upper storeys set back
function ns_bankWall(c,K,Z,x0,x1,o){o=o||{};const H=o.h||10.5,R=ns_rnd(o.seed||7);
  // the upper storeys behind, set back: a long block with rows of windows, a few lit
  const Zb=Z+(o.back||7),Hb=o.hb||22,X0=x0*1.2,X1=x1*1.2;ns_frontQuad(c,K,Zb,X0,X1,0,Hb);const ug=c.createLinearGradient(0,K.p(0,Hb,Zb)[1],0,K.p(0,H,Zb)[1]);ug.addColorStop(0,"rgb(40,64,70)");ug.addColorStop(1,`rgb(${NS_STONE.mid})`);c.fillStyle=ug;c.fill();
  // its bays: tall windows in pairs between stone piers, two floors and an attic, a few lit
  for(let x=X0+1.0;x<X1-3;x+=4.6){const pa=K.p(x-0.5,H,Zb),pb=K.p(x-0.1,Hb-1.6,Zb);c.fillStyle="rgba(70,96,100,0.55)";c.fillRect(pa[0],pb[1],pb[0]-pa[0],pa[1]-pb[1]);
    const rows=[];for(let u=H+1.5;u+2.6<=Hb-1.4;u+=3.5)rows.push([u,2.6]);for(const [u,hh] of rows)for(const dx of [0.9,2.6]){ns_frontQuad(c,K,Zb,x+dx,x+dx+1.15,u,u+hh);const lit=R()<0.2;
      if(lit){c.save();c.shadowColor=NS_WARM.glow;c.shadowBlur=8;c.fillStyle=`rgba(${NS_WARM.win},0.82)`;c.fill();c.restore();}else{c.fillStyle=`rgb(${NS_STONE.glass})`;c.fill();}}}
  ns_frontQuad(c,K,Zb,X0,X1,Hb-1.0,Hb);c.fillStyle="rgb(22,40,46)";c.fill();
  const t0=K.p(X0,Hb,Zb),t1=K.p(X1,Hb,Zb);c.strokeStyle=NS_STONE.edge;c.lineWidth=1.6;c.beginPath();c.moveTo(t0[0],t0[1]);c.lineTo(t1[0],t1[1]);c.stroke();
  // the wall: warm-grey stone, a little lighter than the streets', in the first light
  ns_frontQuad(c,K,Z,x0,x1,0,H);const a=K.p(x0,0,Z),b=K.p(x1,H,Z),g=c.createLinearGradient(0,b[1],0,a[1]);g.addColorStop(0,"rgb(58,80,84)");g.addColorStop(1,"rgb(34,54,60)");c.fillStyle=g;c.fill();
  // its rustication: long courses
  c.strokeStyle="rgba(150,190,200,0.14)";c.lineWidth=1;for(let u=0.7;u<H-2.2;u+=0.7){const p0=K.p(x0,u,Z),p1=K.p(x1,u,Z);c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  // columns in pairs, each on its plinth, with a blind niche between the pairs
  const step=o.step||7.2;for(let x=x0+step/2;x<x1;x+=step){
    for(const dx of [-0.9,0.9]){const cx=x+dx,p=K.p(cx-0.42,1.1,Z),q=K.p(cx+0.42,H-1.9,Z),w=q[0]-p[0];
      const cg=c.createLinearGradient(p[0],0,q[0],0);cg.addColorStop(0,"rgb(40,62,68)");cg.addColorStop(0.45,"rgb(96,122,124)");cg.addColorStop(1,"rgb(36,56,62)");c.fillStyle=cg;c.fillRect(p[0],q[1],w,p[1]-q[1]);
      // its flutes, faint
      c.strokeStyle="rgba(10,22,26,0.35)";c.lineWidth=1;for(let k=1;k<5;k++){c.beginPath();c.moveTo(p[0]+w*k/5,q[1]+4);c.lineTo(p[0]+w*k/5,p[1]-4);c.stroke();}
      // the capital and the base
      const cp=K.p(cx-0.6,H-1.9,Z),cq=K.p(cx+0.6,H-1.4,Z);c.fillStyle="rgb(110,134,134)";c.fillRect(cp[0],cq[1],cq[0]-cp[0],cp[1]-cq[1]);
      const bp=K.p(cx-0.6,0,Z),bq=K.p(cx+0.6,1.1,Z);c.fillStyle="rgb(46,68,72)";c.fillRect(bp[0],bq[1],bq[0]-bp[0],bp[1]-bq[1]);}
    if(x+step/2<x1){const nx=x+step/2,n0=K.p(nx-0.8,1.6,Z),n1=K.p(nx+0.8,H-3.6,Z),nw=n1[0]-n0[0];c.fillStyle="rgba(10,22,26,0.55)";c.beginPath();c.moveTo(n0[0],n0[1]);c.lineTo(n0[0],n1[1]+nw/2);c.arc(n0[0]+nw/2,n1[1]+nw/2,nw/2,Math.PI,0);c.lineTo(n1[0],n0[1]);c.closePath();c.fill();}}
  // the entablature, the cornice and the balustrade on top
  ns_frontQuad(c,K,Z,x0,x1,H-1.4,H-0.4);c.fillStyle="rgb(62,86,90)";c.fill();ns_frontQuad(c,K,Z,x0,x1,H-0.4,H);c.fillStyle="rgb(24,42,48)";c.fill();
  const k0=K.p(x0,H-0.4,Z),k1=K.p(x1,H-0.4,Z);c.strokeStyle="rgba(210,236,236,0.5)";c.lineWidth=1.6;c.beginPath();c.moveTo(k0[0],k0[1]);c.lineTo(k1[0],k1[1]);c.stroke();
  for(let x=x0+0.3;x<x1;x+=0.5){const p=K.p(x,H,Z),q=K.p(x+0.22,H+0.9,Z);c.fillStyle="rgb(46,68,72)";c.fillRect(p[0],q[1],Math.max(1,q[0]-p[0]),p[1]-q[1]);}
  const r0=K.p(x0,H+0.9,Z),r1=K.p(x1,H+1.1,Z);c.fillStyle="rgb(52,76,80)";c.fillRect(r0[0],r1[1],r1[0]-r0[0],Math.max(2,r0[1]-r1[1]));}
// a seeded random, the module's way (the prototype's DP.rnd), kept here so these places paint the same every time
function ns_rnd(s){let x=s>>>0||1;return()=>{x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return(x%100000)/100000;};}
// a City bollard and an old street lamp, on the pavement's edge
function ns_bollard(c,K,X,Z){const p=K.p(X,0,Z),q=K.p(X,1.0,Z),w=Math.max(3,(K.f*0.24)/Z);c.fillStyle="rgb(8,14,16)";rr(c,p[0]-w/2,q[1],w,p[1]-q[1],w/3);c.fill();
  c.fillStyle="rgba(190,225,232,0.35)";c.fillRect(p[0]-w/2+1,q[1]+(p[1]-q[1])*0.2,1.4,(p[1]-q[1])*0.6);c.fillStyle="rgb(8,14,16)";c.beginPath();c.ellipse(p[0],q[1],w*0.62,w*0.3,0,0,TAU);c.fill();}
function ns_lamp(c,K,X,Z,lit){const p=K.p(X,0,Z),q=K.p(X,4.0,Z),w=Math.max(2,(K.f*0.13)/Z),s=Math.max(4,K.f*0.42/Z),ink="rgb(8,14,16)";
  // the post, a little wider at its foot, and the lantern on top: a glazed box, narrower below, under a pointed cap
  c.fillStyle=ink;c.beginPath();c.moveTo(p[0]-w*0.9,p[1]);c.lineTo(p[0]-w*0.45,q[1]);c.lineTo(p[0]+w*0.45,q[1]);c.lineTo(p[0]+w*0.9,p[1]);c.closePath();c.fill();c.fillRect(p[0]-w*1.2,p[1]-s*0.5,w*2.4,s*0.5);
  const L=[p[0],q[1]-s*0.9];c.beginPath();c.moveTo(L[0]-s*0.36,L[1]+s*0.85);c.lineTo(L[0]-s*0.55,L[1]-s*0.5);c.lineTo(L[0]+s*0.55,L[1]-s*0.5);c.lineTo(L[0]+s*0.36,L[1]+s*0.85);c.closePath();
  if(lit){c.save();c.shadowColor=NS_WARM.glow;c.shadowBlur=s*1.4;c.fillStyle="rgb(255,226,170)";c.fill();c.restore();const g=c.createRadialGradient(L[0],L[1],2,L[0],L[1],s*8);g.addColorStop(0,"rgba(255,214,150,0.20)");g.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=g;c.fillRect(L[0]-s*8,L[1]-s*8,s*16,s*16);}
  else{c.fillStyle="rgb(20,34,38)";c.fill();}
  c.strokeStyle=ink;c.lineWidth=Math.max(1,s*0.07);c.beginPath();c.moveTo(L[0],L[1]-s*0.5);c.lineTo(L[0],L[1]+s*0.85);c.stroke();
  c.fillStyle=ink;c.beginPath();c.moveTo(L[0]-s*0.7,L[1]-s*0.5);c.lineTo(L[0],L[1]-s*1.05);c.lineTo(L[0]+s*0.7,L[1]-s*0.5);c.closePath();c.fill();c.fillRect(L[0]-s*0.08,L[1]-s*1.3,s*0.16,s*0.3);}

/* ---------------------------------------------------------------- the City street, with the Bank at its end */
// o.quiet: the quieter street of the theft, narrower, with no Bank at its end, fewer windows lit
const NS_STREET={vx:960,vy:560,f:820,eye:1.65,half:10};
function ns_paintStreet(c,w,h,o){o=o||{};const S=NS_STREET,K=ns_cam(S.vx,S.vy,S.f,S.eye),R=ns_rnd(o.quiet?53:29),half=o.quiet?7.5:S.half,zEnd=o.quiet?60:34;
  ns_sky(c,w,o.quiet?S.vy+60:330,{dawn:o.quiet?null:[S.vx,300,560]});if(!o.quiet){c.fillStyle="rgb(70,92,94)";c.fillRect(0,330,w,S.vy+60-330);}
  // a few stars still out at the top
  for(let i=0;i<70;i++){const x=R()*w,y=R()*300;c.fillStyle=`rgba(210,235,240,${0.08+R()*0.25})`;c.beginPath();c.arc(x,y,R()*1.1+0.3,0,TAU);c.fill();}
  // the far end: the Bank's wall across it, or, in the quiet street, a bend and more buildings
  if(!o.quiet){const g=K.p(0,0,44);c.fillStyle="rgb(20,36,42)";c.fillRect(0,g[1],w,h-g[1]);ns_bankWall(c,K,46,-32,32,{h:10.5,back:9,hb:21,seed:11});}
  else{for(let i=0;i<6;i++){const x0=-14+i*5.2,hb=14+R()*9;ns_frontQuad(c,K,zEnd+4,x0,x0+5,0,hb);c.fillStyle=`rgb(${i%2?NS_STONE.mid:NS_STONE.dark})`;c.fill();
      for(let u=4;u<hb-2;u+=3.4)for(let x=x0+0.8;x<x0+4.4;x+=1.9){ns_frontQuad(c,K,zEnd+4,x,x+1,u,u+2);const lit=R()<0.12;c.fillStyle=lit?`rgba(${NS_WARM.win},0.75)`:`rgb(${NS_STONE.glass})`;c.fill();}
      const t=K.p(x0,hb,zEnd+4),t1=K.p(x0+5,hb,zEnd+4);c.strokeStyle=NS_STONE.edgeSoft;c.lineWidth=1.2;c.beginPath();c.moveTo(t[0],t[1]);c.lineTo(t1[0],t1[1]);c.stroke();}}
  // the road and its pavements
  const gl=K.p(-half,0,zEnd),gr=K.p(half,0,zEnd),nl=K.p(-half,0,0.6),nr=K.p(half,0,0.6);c.beginPath();c.moveTo(gl[0],gl[1]);c.lineTo(gr[0],gr[1]);c.lineTo(nr[0],nr[1]);c.lineTo(nl[0],nl[1]);c.closePath();
  let g=c.createLinearGradient(0,gl[1],0,h);g.addColorStop(0,"rgb(26,44,50)");g.addColorStop(1,"rgb(8,16,19)");c.fillStyle=g;c.fill();
  for(const sx of [-1,1]){const k0=K.p(sx*(half-2.4),0,zEnd),k1=K.p(sx*(half-2.4),0,0.6);c.strokeStyle="rgba(170,210,220,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(k0[0],k0[1]);c.lineTo(k1[0],k1[1]);c.stroke();
    // the pavement, a shade lighter than the road
    const a=K.p(sx*half,0,zEnd),b=K.p(sx*half,0,0.6);c.beginPath();c.moveTo(k0[0],k0[1]);c.lineTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(k1[0],k1[1]);c.closePath();c.fillStyle="rgba(48,76,84,0.30)";c.fill();}
  // the first light on the road, down its middle
  if(!o.quiet){const m=K.p(0,0,40);g=c.createRadialGradient(m[0],m[1],4,m[0],m[1]+80,420);g.addColorStop(0,"rgba(255,200,150,0.14)");g.addColorStop(1,"rgba(255,200,150,0)");c.fillStyle=g;c.fillRect(0,m[1]-60,w,h-m[1]+60);}
  // the buildings, far ones first
  const L=o.quiet?[[0.6,15,19,{lit:0.08}],[15,27,22,{lit:0.1,bay:3.0}],[27,40,17,{lit:0.06}],[40,60,20,{lit:0.1}]]:[[0.6,12,24,{lit:0.24}],[12,21,21,{lit:0.3,bay:3.0,door:1}],[21,34,23,{lit:0.22,door:2}]];
  const Rr=o.quiet?[[0.6,13,18,{lit:0.08}],[13,26,21,{lit:0.1,door:2}],[26,42,18,{lit:0.08}],[42,60,22,{lit:0.06}]]:[[0.6,11,22,{lit:0.3}],[11,23,25,{lit:0.24,door:1}],[23,34,20,{lit:0.3,door:0}]];
  for(const [z0,z1,H,s] of L.slice().reverse())ns_building(c,K,-half,z0,z1,H,s,R);
  for(const [z0,z1,H,s] of Rr.slice().reverse())ns_building(c,K,half,z0,z1,H,s,R);
  // bollards and lamps along the kerbs
  for(const z of (o.quiet?[6,14,24,36]:[5,9,15,22,30]))for(const sx of [-1,1])ns_bollard(c,K,sx*(half-2.6),z);
  for(const [sx,z,lit] of (o.quiet?[[-1,9,true],[1,22,false]]:[[-1,7,true],[1,13,true],[-1,24,false]]))ns_lamp(c,K,sx*(half-2.2),z,lit);
  // the lamps' and the doorways' light, reflected on the road in soft streaks
  const streak=(x,y,wd,hgt,al)=>{c.save();c.translate(x,y);c.scale(wd/100,hgt/100);const rg=c.createRadialGradient(0,0,0,0,0,100);rg.addColorStop(0,`rgba(255,214,150,${al})`);rg.addColorStop(0.5,`rgba(255,214,150,${al*0.35})`);rg.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=rg;c.fillRect(-100,-100,200,200);c.restore();};
  for(const [sx,z] of (o.quiet?[[-1,9]]:[[-1,7],[1,13]])){const q=K.p(sx*(half-2.6),0,z-1.2);streak(q[0],q[1]+Math.min(260,K.f*1.6/z),Math.max(16,K.f*0.55/z),Math.min(300,K.f*2.0/z),0.22);}
  // a low haze where the street meets the far end
  const hz=K.p(0,0,zEnd);g=c.createLinearGradient(0,hz[1]-160,0,hz[1]+40);g.addColorStop(0,"rgba(120,150,156,0)");g.addColorStop(0.8,"rgba(120,150,156,0.05)");g.addColorStop(1,"rgba(120,150,156,0)");c.fillStyle=g;c.fillRect(0,hz[1]-160,w,200);}
// a doorway's middle on the street, in screen space: for messengers to walk from and to (side -1 left, 1 right; which building; z along it)
function ns_streetPoint(X,up,Z){const S=NS_STREET;return ns_cam(S.vx,S.vy,S.f,S.eye).p(X,up,Z);}

/* ---------------------------------------------------------------- a messenger, far off: a dark coat, a case, walking */
// x, y: where the feet meet the ground; s: height in px; ph: the step's phase (0..1); o.case: 0..1, the case in hand; o.dir: 1 walking right, -1 left;
// o.rim: the warm light's side (1 the side he walks towards, -1 behind)
function ns_walker(ctx,x,y,s,ph,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;
  // fading, he is drawn whole first, then faded as one picture, so his arm and coat don't show through each other
  if(a<1){const m=ctx.getTransform(),P=[[x-0.3*s,y-1.08*s],[x+0.3*s,y-1.08*s],[x-0.3*s,y+0.06*s],[x+0.3*s,y+0.06*s]].map(([px,py])=>[m.a*px+m.c*py+m.e,m.b*px+m.d*py+m.f]),
      bx=Math.floor(Math.min(...P.map(p=>p[0])))-2,by=Math.floor(Math.min(...P.map(p=>p[1])))-2,bw=Math.ceil(Math.max(...P.map(p=>p[0])))-bx+4,bh=Math.ceil(Math.max(...P.map(p=>p[1])))-by+4;
    if(bw<2||bh<2)return;const [bc,bk]=ag_buf("nswalk",bw,bh);bk.setTransform(m.a,m.b,m.c,m.d,m.e-bx,m.f-by);ns_walker(bk,x,y,s,ph,Object.assign({},o,{a:1}));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0,bw,bh,bx,by,bw,bh);ctx.restore();return;}
  ctx.save();ctx.translate(x,y);const k=s/100,dir=o.dir||1;ctx.scale(k*dir,k);
  const sw=Math.sin(ph*TAU),st=sw*7,lift=Math.max(0,-sw)*2.5,lift2=Math.max(0,sw)*2.5,ink="rgb(11,13,15)";ctx.fillStyle=ink;
  // the legs, tapering to the shoes, one forward and one back
  const leg=(hx,fx,l)=>{ctx.beginPath();ctx.moveTo(hx-4.2,-44);ctx.lineTo(fx-2.6,-l-1);ctx.lineTo(fx+5.5,-l-1);ctx.lineTo(fx+5.5,-l+0.4);ctx.lineTo(fx-3.4,-l+0.4);ctx.lineTo(hx+4.2,-44);ctx.closePath();ctx.fill();};
  leg(-1.5,-st-1,lift);leg(1.5,st+1,lift2);
  // the overcoat: shoulders, a little flare to below the knee, the collar up
  ctx.beginPath();ctx.moveTo(-4.5,-85.5);ctx.bezierCurveTo(-9,-85,-13.5,-83.5,-14,-79);ctx.lineTo(-15.5,-50);ctx.lineTo(-16.5,-31);ctx.quadraticCurveTo(0,-29,16.5,-31);ctx.lineTo(15.5,-50);ctx.lineTo(14,-79);ctx.bezierCurveTo(13.5,-83.5,9,-85,4.5,-85.5);ctx.closePath();ctx.fill();
  // the head on its neck, a short haircut
  ctx.fillRect(-2.6,-89,5.2,5);ctx.beginPath();ctx.ellipse(0.8,-93.5,5.6,6.8,0,0,TAU);ctx.fill();
  // the near arm down the coat, the case under the hand, swinging a little with the step
  const cs=o.case==null?1:o.case,sway=-sw*0.05;ctx.save();ctx.translate(11.5,-80);ctx.rotate(sway);ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(3.4,0);ctx.lineTo(4.4,32);ctx.lineTo(-1.6,32);ctx.closePath();ctx.fill();
  if(cs>0){ctx.save();ctx.globalAlpha*=cs;ctx.translate(1.4,34);ctx.fillStyle="rgb(40,27,20)";rr(ctx,-11,1.5,24,18,1.6);ctx.fill();ctx.fillStyle=ink;ctx.fillRect(-4,-1.5,9,3.5);
    ctx.strokeStyle="rgba(255,214,150,0.5)";ctx.lineWidth=1.1/k;ctx.beginPath();ctx.moveTo(-11,2.5);ctx.lineTo(13,2.5);ctx.stroke();ctx.restore();}
  ctx.restore();
  // the warm light of the doorways along one edge of him
  const r=o.rim==null?1:o.rim;ctx.strokeStyle="rgba(255,214,150,0.55)";ctx.lineWidth=1.3/k;ctx.beginPath();
  if(r>0){ctx.moveTo(14,-79);ctx.lineTo(15.5,-50);ctx.moveTo(4.6,-90);ctx.ellipse(0.8,-93.5,5.6,6.8,0,-0.6,1.1);}else{ctx.moveTo(-14,-79);ctx.lineTo(-15.5,-50);ctx.moveTo(-3,-99);ctx.ellipse(0.8,-93.5,5.6,6.8,0,Math.PI-0.9,Math.PI+0.6);}ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- the City from above, at first light */
// The streets round the Bank, drawn as a plan (not to scale): each a line of points; the Bank's block north of the junction.
const NS_MAP={junction:[980,600],
  streets:[{n:"Poultry",w:34,P:[[980,600],[620,630],[260,640],[-60,628]]},{n:"Princes",w:30,P:[[980,600],[930,420],[900,230],[884,-40]]},
    {n:"Threadneedle",w:28,P:[[980,600],[1120,470],[1268,356],[1520,250],[1990,160]]},{n:"Cornhill",w:32,P:[[980,600],[1240,575],[1520,560],[1990,520]]},
    {n:"Lombard",w:28,P:[[980,600],[1180,690],[1420,770],[1990,905]]},{n:"King William",w:34,P:[[980,600],[1080,760],[1180,905],[1300,1120]]},
    {n:"Queen Victoria",w:34,P:[[980,600],[820,760],[690,900],[420,1120]]},{n:"Lothbury",w:22,P:[[900,262],[1100,250],[1290,248],[1600,232]]},
    {n:"Nicholas",w:18,P:[[1360,750],[1384,880],[1404,1000],[1420,1120]]},{n:"Moorgate",w:28,P:[[1100,250],[1110,60],[1120,-40]]},
    {n:"Cheapside lane",w:18,P:[[620,630],[600,820],[560,1120]]},{n:"Old Broad",w:22,P:[[1268,356],[1300,120],[1320,-40]]},
    {n:"Gracechurch",w:28,P:[[1520,560],[1560,800],[1600,1120]]},{n:"Coleman",w:20,P:[[700,622],[690,300],[680,-40]]}],
  bank:[[1000,572],[918,282],[1262,262],[1266,350]]};
// a point along a street's line, u from 0 to 1, and the direction there
function ns_mapAt(st,u){const P=st.P;let L=0;const seg=[];for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(d);L+=d;}
  let r=Math.max(0,Math.min(1,u))*L;for(let i=0;i<seg.length;i++){if(r<=seg[i]||i===seg.length-1){const k=seg[i]?r/seg[i]:0,a=P[i],b=P[i+1];return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,Math.atan2(b[1]-a[1],b[0]-a[0])];}r-=seg[i];}return P[0].concat([0]);}
function ns_paintMap(c,w,h){const M=NS_MAP,R=ns_rnd(131);
  // roofs: the whole City a dark slate, broken into blocks by a fine grid of lighter roof edges
  let g=c.createRadialGradient(M.junction[0],M.junction[1],60,M.junction[0],M.junction[1],1300);g.addColorStop(0,"rgb(24,42,48)");g.addColorStop(1,"rgb(9,18,22)");c.fillStyle=g;c.fillRect(0,0,w,h);
  for(let i=0;i<520;i++){const x=R()*w,y=R()*h,bw=30+R()*70,bh=24+R()*60,sh=14+R()*14|0;c.fillStyle=`rgba(${sh+8},${sh+24},${sh+30},0.55)`;c.fillRect(x,y,bw,bh);
    c.strokeStyle="rgba(170,210,220,0.10)";c.lineWidth=1;c.strokeRect(x+0.5,y+0.5,bw,bh);if(R()<0.05){c.save();c.shadowColor=NS_WARM.glow;c.shadowBlur=6;c.fillStyle="rgba(255,206,140,0.8)";c.fillRect(x+bw*0.3,y+bh*0.4,4,4);c.restore();}}
  // the streets: a darker channel, its edges catching the light, a few lamps along it
  for(const st of M.streets){c.lineJoin="round";c.lineCap="round";c.strokeStyle="rgb(8,15,18)";c.lineWidth=st.w+10;c.beginPath();st.P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();}
  for(const st of M.streets){c.strokeStyle="rgb(20,36,42)";c.lineWidth=st.w;c.beginPath();st.P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    for(let u=0.06;u<1;u+=0.11){const q=ns_mapAt(st,u),nx=-Math.sin(q[2]),ny=Math.cos(q[2]),sd=(Math.round(u*100)%2?1:-1)*st.w*0.42;const lx=q[0]+nx*sd,ly=q[1]+ny*sd;
      const lg=c.createRadialGradient(lx,ly,0,lx,ly,22);lg.addColorStop(0,"rgba(255,214,150,0.30)");lg.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=lg;c.fillRect(lx-22,ly-22,44,44);c.fillStyle="rgba(255,226,170,0.9)";c.beginPath();c.arc(lx,ly,1.8,0,TAU);c.fill();}}
  // the Bank: one great block of pale stone, its courtyards, its long wall lit along the top
  c.beginPath();M.bank.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();g=c.createLinearGradient(918,262,1266,572);g.addColorStop(0,"rgb(70,94,98)");g.addColorStop(1,"rgb(52,76,82)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(210,236,236,0.55)";c.lineWidth=2.4;c.stroke();
  for(const [x,y,ww,hh] of [[1010,320,90,60],[1130,310,80,70],[1040,410,70,50]]){c.fillStyle="rgb(26,44,50)";c.fillRect(x,y,ww,hh);c.strokeStyle="rgba(210,236,236,0.25)";c.lineWidth=1.2;c.strokeRect(x,y,ww,hh);}
  // first light, from the east
  g=c.createLinearGradient(w,0,0,h);g.addColorStop(0,"rgba(255,200,150,0.10)");g.addColorStop(0.5,"rgba(255,200,150,0.03)");g.addColorStop(1,"rgba(255,200,150,0)");c.fillStyle=g;c.fillRect(0,0,w,h);}
// a messenger's case on the map, drawn live: a small dark case with a soft coral ring round it (the risk it carries)
function ns_mapCase(ctx,x,y,a,risk){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(risk>0){const g=ctx.createRadialGradient(x,y,4,x,y,30);g.addColorStop(0,`rgba(255,122,106,${0.45*risk})`);g.addColorStop(1,"rgba(255,122,106,0)");ctx.fillStyle=g;ctx.fillRect(x-30,y-30,60,60);
    ctx.strokeStyle=`rgba(255,140,124,${0.8*risk})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,13,0,TAU);ctx.stroke();}
  ctx.fillStyle="rgb(52,36,26)";rr(ctx,x-8,y-6,16,12,2);ctx.fill();ctx.strokeStyle="rgba(255,214,150,0.7)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-8,y-5);ctx.lineTo(x+8,y-5);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the bearer papers: security paper, a guilloche border, a gold seal, no words */
function ns_paper(c,x,y,w,h,rot,seed){const R=ns_rnd(seed||5);c.save();c.translate(x,y);c.rotate(rot||0);
  c.shadowColor="rgba(0,0,0,0.45)";c.shadowBlur=18;c.shadowOffsetY=6;c.fillStyle="rgb(238,232,214)";rr(c,-w/2,-h/2,w,h,4);c.fill();c.shadowColor="transparent";
  // an underprint, faint: a wash from rose to sage
  let g=c.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,"rgba(220,180,180,0.25)");g.addColorStop(0.5,"rgba(200,214,190,0.18)");g.addColorStop(1,"rgba(180,200,214,0.25)");c.fillStyle=g;rr(c,-w/2,-h/2,w,h,4);c.fill();
  // the border: two bands of fine interlaced waves
  c.save();rr(c,-w/2,-h/2,w,h,4);c.clip();const band=(inset,amp,n,col)=>{c.strokeStyle=col;c.lineWidth=0.9;for(let k=0;k<3;k++){c.beginPath();const ph=k*TAU/3;
      const L=2*(w+h-4*inset),N=Math.ceil(L/2.5);for(let i=0;i<=N;i++){const s=i/N*L;let px,py,nx,ny;const W=w-2*inset,H=h-2*inset;
        if(s<W){px=-w/2+inset+s;py=-h/2+inset;nx=0;ny=1;}else if(s<W+H){px=w/2-inset;py=-h/2+inset+(s-W);nx=-1;ny=0;}else if(s<2*W+H){px=w/2-inset-(s-W-H);py=h/2-inset;nx=0;ny=-1;}else{px=-w/2+inset;py=h/2-inset-(s-2*W-H);nx=1;ny=0;}
        const o=amp*Math.sin(s/L*n*TAU+ph);i?c.lineTo(px+nx*o,py+ny*o):c.moveTo(px+nx*o,py+ny*o);}c.stroke();}};
  band(12,5,90,"rgba(120,90,110,0.55)");band(22,4,120,"rgba(90,120,110,0.45)");c.restore();
  // a rosette, off centre, of fine curves; and the gold seal
  const rx=-w*0.18,ry=0;c.strokeStyle="rgba(110,100,130,0.4)";c.lineWidth=0.8;for(let k=0;k<12;k++){c.beginPath();for(let i=0;i<=120;i++){const t=i/120*TAU,r=h*0.28*(0.62+0.38*Math.cos(6*t+k*TAU/12));i?c.lineTo(rx+r*Math.cos(t),ry+r*Math.sin(t)):c.moveTo(rx+r*Math.cos(t),ry+r*Math.sin(t));}c.stroke();}
  const sx=w*0.3,sy=h*0.12,sr=h*0.16;g=c.createRadialGradient(sx-sr*0.3,sy-sr*0.3,2,sx,sy,sr);g.addColorStop(0,"rgb(255,226,140)");g.addColorStop(0.6,"rgb(214,160,52)");g.addColorStop(1,"rgb(150,104,30)");
  c.fillStyle=g;c.beginPath();for(let i=0;i<=40;i++){const a=i/40*TAU,r=sr*(1+0.06*Math.cos(i*2.6));c.lineTo(sx+r*Math.cos(a),sy+r*Math.sin(a));}c.closePath();c.fill();
  c.strokeStyle="rgba(120,80,20,0.6)";c.lineWidth=1.2;c.beginPath();c.arc(sx,sy,sr*0.62,0,TAU);c.stroke();c.beginPath();c.arc(sx,sy,sr*0.3,0,TAU);c.stroke();
  // lines where words would be, too faint to read: a paper's look, never its words
  c.strokeStyle="rgba(90,80,70,0.25)";c.lineWidth=1.4;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-w*0.02,-h*0.2+i*h*0.14);c.lineTo(w*0.16,-h*0.2+i*h*0.14);c.stroke();}
  c.restore();}
// one paper, painted once and kept (its shadow inside the picture), drawn rotated wherever it lies
function ns_paperPic(i,w){const h=Math.round(w*0.56);return ag_kept("ns:paper:"+i+":"+w,w+90,h+90,c=>ns_paper(c,(w+90)/2,(h+90)/2,w,h,0,7+i*13));}
// the papers fanned: n of them, spread by u (0 a neat stack, 1 a full fan)
function ns_papers(c,x,y,w,u,n){n=n||5;for(let i=0;i<n;i++){const k=i-(n-1)/2,rot=k*0.12*u,dx=k*w*0.16*u,dy=Math.abs(k)*8*u,P=ns_paperPic(i,w);
  c.save();c.translate(x+dx,y+dy);c.rotate(rot);c.drawImage(P,-P.width/2,-P.height/2);c.restore();}}
