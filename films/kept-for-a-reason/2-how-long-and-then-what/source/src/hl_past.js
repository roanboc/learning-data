/* ===== How long, and then what: Washington, 1943 =====
   The opening's places, each painted once, in the module's night light (Night glass): a petrol sky, stone cool, windows and lamps
   warm. Plain shapes and soft gradients, as the module's look paints the past; nothing fine enough to crawl under a slow camera.
   Everything here is this film's own (prefix hl_); the hall, the people, the cards and the words are the kit's. Each place paints the
   whole 1920 x 1080 frame and is named in AG_PLACES at the end of this file. */

/* ---------------------------------------------------------------- helpers */
// a seeded random, so a place paints the same every time
function hl_rnd(s){let x=(s>>>0)||1;return()=>{x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return x/4294967296;};}
const hl_rgb=c=>"rgb("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+")";
// a view in perspective: x = vx + f*X/Z, y = vy + f*(eye - U)/Z; metres in, pixels out
function hl_cam(vx,vy,f,eye){return{vx,vy,f,eye,p:(X,U,Z)=>[vx+f*X/Z,vy+f*(eye-U)/Z]};}
// a quad on the plane X (a wall along the view), from depth z0 to z1 and height u0 to u1
function hl_side(c,K,X,z0,z1,u0,u1){const a=K.p(X,u0,z0),b=K.p(X,u0,z1),d=K.p(X,u1,z1),e=K.p(X,u1,z0);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
// a quad facing us, on the plane Z
function hl_front(c,K,Z,x0,x1,u0,u1){const a=K.p(x0,u0,Z),b=K.p(x1,u1,Z);c.beginPath();c.rect(a[0],b[1],b[0]-a[0],a[1]-b[1]);}
// a quad level with the ground (or a ceiling) at height U, from x0 to x1 and z0 to z1
function hl_flat(c,K,U,x0,x1,z0,z1){const a=K.p(x0,U,z0),b=K.p(x1,U,z0),d=K.p(x1,U,z1),e=K.p(x0,U,z1);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
// a line between two points of the view
function hl_line(c,K,A,B,col,lw){const a=K.p(A[0],A[1],A[2]),b=K.p(B[0],B[1],B[2]);c.strokeStyle=col;c.lineWidth=lw||1;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
// a soft round glow, and one drawn out long (a light's reflection on a wet road or a polished floor)
function hl_glow(c,x,y,r,col,a){if(!(r>0)||!(a>0))return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
function hl_streak(c,x,y,r,sx,sy,col,a){c.save();c.translate(x,y);c.scale(sx,sy);hl_glow(c,0,0,r,col,a);c.restore();}
// a vertical gradient fill of the current path, from colour a at y0 to b at y1
function hl_vfill(c,y0,y1,a,b){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,hl_rgb(a));g.addColorStop(1,hl_rgb(b));c.fillStyle=g;c.fill();}

const HL_SKY=[[0,[5,13,19]],[0.5,[12,30,38]],[0.84,[26,52,60]],[1,[42,68,72]]];
const HL_STONE={lit:[52,76,82],mid:[36,57,64],dark:[21,37,43],deep:[11,22,27],edge:"rgba(190,225,232,0.34)",soft:"rgba(170,210,220,0.16)",glass:[9,19,23]};
const HL_WARM={glow:"rgba(255,196,120,0.9)",win:[255,206,140],lamp:[255,226,178],pool:[255,200,130]};

// the night sky down to y1: the module's petrol, a few stars, a faint glow of the city low down
function hl_sky(c,w,y1,o){o=o||{};const g=c.createLinearGradient(0,0,0,y1);for(const [s,col] of (o.stops||HL_SKY))g.addColorStop(s,rgba(col,1));c.fillStyle=g;c.fillRect(0,0,w,y1);
  const R=hl_rnd(o.seed||5);for(let i=0;i<(o.stars==null?140:o.stars);i++){const x=R()*w,y=R()*y1*0.7,r=R()*1.1+0.3;c.fillStyle="rgba(210,235,240,"+(0.10+R()*0.34).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  if(o.glow){const [x,y,r]=o.glow;hl_glow(c,x,y,r,[120,168,172],0.16);}}

// a window on a wall along the view: lit (warm, the tops of filing cabinets dark across its lower part) or dark (the sky in its glass)
function hl_sideWindow(c,K,X,z0,z1,u0,u1,lit,R,o){o=o||{};
  hl_side(c,K,X,z0-0.16,z1+0.16,u0-0.24,u1+0.22);c.fillStyle=rgba(HL_STONE.lit,0.32);c.fill();
  hl_side(c,K,X,z0,z1,u0,u1);
  if(lit){const a=K.p(X,u1,z0),b=K.p(X,u0,z0),k=o.k==null?0.62+0.3*R():o.k,g=c.createLinearGradient(0,a[1],0,b[1]);
    g.addColorStop(0,rgba(HL_WARM.win,0.9*k));g.addColorStop(1,rgba([226,160,96],0.8*k));c.save();c.shadowColor=HL_WARM.glow;c.shadowBlur=o.blur||10;c.fillStyle=g;c.fill();c.restore();
    hl_side(c,K,X,z0,z1,u0,u0+(u1-u0)*0.34);c.fillStyle="rgba(46,30,20,0.78)";c.fill();
    const m=K.p(X,u0+(u1-u0)*0.62,(z0+z1)/2),wz=Math.abs(K.p(X,u0,z1)[0]-K.p(X,u0,z0)[0]);hl_glow(c,m[0],m[1],wz*0.9,[255,236,200],0.35*k);}
  else{const a=K.p(X,u1,z0),b=K.p(X,u0,z0);hl_vfill(c,a[1],b[1],[20,40,48],HL_STONE.glass);}
  const ink=lit?"rgba(110,70,36,0.6)":"rgba(150,190,200,0.16)",m=(z0+z1)/2,tu=u0+(u1-u0)*0.7;hl_line(c,K,[X,u0,m],[X,u1,m],ink,1.2);hl_line(c,K,[X,tu,z0],[X,tu,z1],ink,1.2);
  hl_line(c,K,[X-0.05,u0-0.06,z0-0.1],[X-0.05,u0-0.06,z1+0.1],HL_STONE.edge,1.2);}

/* ---------------------------------------------------------------- Washington's avenue at night, 1943 */
// One of the government's office blocks, its long side along the avenue (the plane X), from depth z0 to z1, H high: a rusticated base,
// a giant order of engaged columns over three floors of tall windows, a cornice and an attic, a tiled roof dark against the sky.
// lamps: where the street lamps stand, to light the wall's foot; win: windows asked to be lit, by "bay:floor"
function hl_govBlock(c,K,X,z0,z1,H,o){o=o||{};const R=hl_rnd(o.seed||3),bay=o.bay||4.2,base=7.4,capT=20.2,cor=22.6,n=Math.max(1,Math.round((z1-z0)/bay)),bz=(z1-z0)/n;
  hl_side(c,K,X,z0,z1,0,H);const a=K.p(X,0,z0),b=K.p(X,0,z1),g=c.createLinearGradient(a[0],0,b[0],0);g.addColorStop(0,hl_rgb(HL_STONE.lit));g.addColorStop(0.55,hl_rgb(HL_STONE.mid));g.addColorStop(1,hl_rgb(HL_STONE.dark));c.fillStyle=g;c.fill();
  c.save();hl_side(c,K,X,z0,z1,0,H);c.clip();for(const lz of (o.lamps||[])){const q=K.p(X,3.4,lz),r=K.f*6.5/lz;c.save();c.translate(q[0],q[1]);c.scale(0.7,1);hl_glow(c,0,0,r,HL_WARM.pool,0.20);c.restore();}c.restore();
  c.save();hl_side(c,K,X,z0,z1,0,base);c.clip();for(let u=0.75;u<base;u+=0.75)hl_line(c,K,[X,u,z0],[X,u,z1],"rgba(150,190,200,0.09)",1);c.restore();
  // the columns, one at each bay's edge, standing proud of the wall: lit on their near side, a shadow on the wall beyond
  for(let i=0;i<=n;i++){const zc=z0+i*bz,w2=0.5;
    hl_side(c,K,X-0.02,zc+w2,zc+w2+0.5,base+0.6,capT);c.fillStyle="rgba(8,18,22,0.35)";c.fill();
    hl_side(c,K,X-0.35,zc-w2,zc+w2,base+0.6,capT);const p0=K.p(X,0,zc-w2),p1=K.p(X,0,zc+w2),cg=c.createLinearGradient(p0[0],0,p1[0],0);
    cg.addColorStop(0,hl_rgb([84,110,114]));cg.addColorStop(0.45,hl_rgb([62,86,92]));cg.addColorStop(1,hl_rgb(HL_STONE.dark));c.fillStyle=cg;c.fill();
    hl_side(c,K,X-0.4,zc-w2-0.2,zc+w2+0.2,capT-0.75,capT);c.fillStyle=hl_rgb([72,96,100]);c.fill();hl_line(c,K,[X-0.4,capT,zc-w2-0.2],[X-0.4,capT,zc+w2+0.2],"rgba(210,236,236,0.35)",1.2);
    hl_side(c,K,X-0.4,zc-w2-0.16,zc+w2+0.16,base,base+0.6);c.fillStyle=hl_rgb(HL_STONE.mid);c.fill();}
  const floors=[[1.4,4.6,0],[5.3,6.7,1],[8.5,11.1,2],[12.3,14.9,3],[16.1,18.7,4],[23.4,24.8,5]],win=o.win||{};
  for(let i=0;i<n;i++){const zm=z0+(i+0.5)*bz,hw=Math.min(0.95,bz*0.24);for(const [u0,u1,f] of floors){const want=win[i+":"+f];
      const lit=want!=null?want:R()<(f===0?0.18:f===5?0.3:o.lit||0.55);if(o.door===i&&f===0)continue;hl_sideWindow(c,K,X-0.02,zm-hw,zm+hw,u0,u1,lit,R,{k:want?0.95:null,blur:want?16:10});}}
  if(o.door!=null){const zm=z0+(o.door+0.5)*bz;hl_side(c,K,X-0.02,zm-1.1,zm+1.1,0,5.0);c.save();c.shadowColor=HL_WARM.glow;c.shadowBlur=18;const q=K.p(X,2,zm),dg=c.createRadialGradient(q[0],q[1],2,q[0],q[1],K.f*3/zm);
    dg.addColorStop(0,"rgb(255,214,150)");dg.addColorStop(0.5,"rgb(196,132,72)");dg.addColorStop(1,"rgb(70,44,28)");c.fillStyle=dg;c.fill();c.restore();hl_side(c,K,X-0.2,zm-1.5,zm+1.5,5.0,5.6);c.fillStyle=hl_rgb(HL_STONE.deep);c.fill();}
  hl_side(c,K,X-0.3,z0,z1,capT,cor);c.fillStyle=hl_rgb([40,62,68]);c.fill();hl_line(c,K,[X-0.3,capT+0.5,z0],[X-0.3,capT+0.5,z1],"rgba(150,190,200,0.12)",1);
  hl_side(c,K,X-0.7,z0,z1,cor-0.5,cor);c.fillStyle=hl_rgb(HL_STONE.deep);c.fill();hl_line(c,K,[X-0.7,cor,z0],[X-0.7,cor,z1],HL_STONE.edge,1.6);
  const r0=K.p(X,H,z0),r1=K.p(X,H,z1),r2=K.p(X+4,H+3.2,z1),r3=K.p(X+4,H+3.2,z0);c.beginPath();c.moveTo(r0[0],r0[1]);c.lineTo(r1[0],r1[1]);c.lineTo(r2[0],r2[1]);c.lineTo(r3[0],r3[1]);c.closePath();c.fillStyle="rgb(14,24,28)";c.fill();
  hl_line(c,K,[X,H,z0],[X,H,z1],"rgba(150,190,200,0.24)",1.2);hl_line(c,K,[X+4,H+3.2,z0],[X+4,H+3.2,z1],"rgba(170,210,220,0.20)",1.2);
  hl_line(c,K,[X,0,z1],[X,H,z1],HL_STONE.soft,1.2);}

// The National Archives, closing the far end: a plain block of columns on a podium, its wide steps in the middle, a low pediment over
// the middle columns, the attic above; the doors' warm light between the middle columns, and the avenue's lamps lighting it from below.
function hl_archives(c,K,Z,x0,x1,o){o=o||{};const pod=3.0,colB=pod+0.5,capT=19.6,ent=22.4,H=29.5,xm=(x0+x1)/2;
  hl_front(c,K,Z+3,x0+1.5,x1-1.5,ent,H);let a=K.p(0,H,Z+3),b=K.p(0,ent,Z+3);hl_vfill(c,a[1],b[1],[36,56,62],[46,68,72]);
  hl_line(c,K,[x0+1.5,H,Z+3],[x1-1.5,H,Z+3],"rgba(190,225,232,0.40)",1.4);
  hl_front(c,K,Z+2.6,x0,x1,pod,capT);c.fillStyle="rgb(12,24,28)";c.fill();
  const dq=K.p(xm,pod+5,Z+2.6),dr=K.f*9/Z;hl_glow(c,dq[0],dq[1],dr,[255,200,130],0.55);
  hl_front(c,K,Z+2.6,xm-1.6,xm+1.6,pod,pod+10.5);c.save();c.shadowColor=HL_WARM.glow;c.shadowBlur=14;hl_vfill(c,K.p(0,pod+10.5,Z)[1],K.p(0,pod,Z)[1],[255,214,150],[190,128,70]);c.restore();
  hl_front(c,K,Z,x0-1.5,x1+1.5,0,pod);a=K.p(0,pod,Z);b=K.p(0,0,Z);hl_vfill(c,a[1],b[1],[58,80,84],[36,54,60]);
  for(let u=0.375;u<pod;u+=0.375)hl_line(c,K,[xm-11,u,Z-0.4],[xm+11,u,Z-0.4],u>pod-1.2?"rgba(255,214,150,0.30)":"rgba(190,225,232,0.22)",1);
  hl_line(c,K,[x0-1.5,pod,Z],[x1+1.5,pod,Z],"rgba(190,225,232,0.34)",1.4);
  for(let x=x0+1.2;x<=x1-1.0;x+=3.25){const p0=K.p(x-0.62,colB,Z),p1=K.p(x+0.62,capT,Z),w2=p1[0]-p0[0],cg=c.createLinearGradient(p0[0],0,p1[0],0),near=1-Math.min(1,Math.abs(x-xm)/7);
    cg.addColorStop(0,"rgb(34,52,58)");cg.addColorStop(0.42,near>0?hl_rgb(mix([92,116,118],[150,128,100],near*0.6)):"rgb(92,116,118)");cg.addColorStop(1,"rgb(30,48,54)");c.fillStyle=cg;c.fillRect(p0[0],p1[1],w2,p0[1]-p1[1]);
    const lg=c.createLinearGradient(0,p1[1],0,p0[1]);lg.addColorStop(0,"rgba(255,206,150,0)");lg.addColorStop(1,"rgba(255,206,150,0.22)");c.fillStyle=lg;c.fillRect(p0[0],p1[1],w2,p0[1]-p1[1]);
    const cp=K.p(x-0.95,capT-1.1,Z),cq=K.p(x+0.95,capT,Z);c.fillStyle="rgb(100,124,124)";c.fillRect(cp[0],cq[1],cq[0]-cp[0],cp[1]-cq[1]);
    const bp=K.p(x-0.85,pod,Z),bq=K.p(x+0.85,colB,Z);c.fillStyle="rgb(62,84,88)";c.fillRect(bp[0],bq[1],bq[0]-bp[0],bp[1]-bq[1]);}
  hl_front(c,K,Z,x0,x1,capT,ent);a=K.p(0,ent,Z);b=K.p(0,capT,Z);hl_vfill(c,a[1],b[1],[54,76,80],[70,92,94]);
  hl_line(c,K,[x0,ent,Z],[x1,ent,Z],"rgba(210,236,236,0.5)",1.6);hl_line(c,K,[x0,capT+0.9,Z],[x1,capT+0.9,Z],"rgba(150,190,200,0.16)",1);
  const pw=o.ped||10.5,P0=K.p(xm-pw,ent,Z),P1=K.p(xm+pw,ent,Z),P2=K.p(xm,ent+4.6,Z);c.beginPath();c.moveTo(P0[0],P0[1]);c.lineTo(P2[0],P2[1]);c.lineTo(P1[0],P1[1]);c.closePath();c.fillStyle="rgb(44,66,70)";c.fill();
  c.strokeStyle="rgba(210,236,236,0.5)";c.lineWidth=1.6;c.beginPath();c.moveTo(P0[0],P0[1]);c.lineTo(P2[0],P2[1]);c.lineTo(P1[0],P1[1]);c.stroke();}

// an elm of the Mall: a dark crown of overlapping masses on a dark trunk, its upper edge touched by the city's light
function hl_tree(c,K,X,Z,R,o){o=o||{};const s=K.f/Z,top=o.h||11,cr=o.r||4.6,cu=top-cr;
  const t0=K.p(X,0,Z),t1=K.p(X,cu-0.6,Z);c.fillStyle="rgb(8,16,19)";c.beginPath();c.moveTo(t0[0]-0.26*s,t0[1]);c.quadraticCurveTo(t1[0]-0.12*s,(t0[1]+t1[1])/2,t1[0]-0.5*s,t1[1]);c.lineTo(t1[0]+0.5*s,t1[1]);c.quadraticCurveTo(t1[0]+0.12*s,(t0[1]+t1[1])/2,t0[0]+0.26*s,t0[1]);c.closePath();c.fill();
  const q=K.p(X,cu,Z),blobs=[];for(let i=0;i<14;i++){const an=-Math.PI*(0.08+0.84*R()),d=0.25+R()*0.55;blobs.push([q[0]+Math.cos(an)*d*cr*s*1.15,q[1]+Math.sin(an)*d*cr*s*0.8+cr*s*0.22,cr*s*(0.30+R()*0.22)]);}
  for(let i=0;i<5;i++)blobs.push([q[0]+(R()-0.5)*cr*s*1.4,q[1]+cr*s*(0.25+R()*0.25),cr*s*(0.32+R()*0.15)]);
  for(const [x,y,r] of blobs){c.fillStyle="rgba(44,72,78,0.9)";c.beginPath();c.ellipse(x,y-r*0.08,r,r*0.88,0,0,TAU);c.fill();}
  for(const [x,y,r] of blobs){const gg=c.createLinearGradient(0,y-r,0,y+r);gg.addColorStop(0,"rgb(18,32,36)");gg.addColorStop(1,"rgb(6,14,17)");c.fillStyle=gg;c.beginPath();c.ellipse(x+r*0.02,y+r*0.02,r*0.95,r*0.84,0,0,TAU);c.fill();}}

// one of Washington's street lamps: a dark post and a white globe, lit, its pool on the pavement and its reflection in the wet road
function hl_lamp(c,K,X,Z){const s=K.f/Z,b=K.p(X,0,Z),t=K.p(X,4.2,Z),g=K.p(X,4.5,Z),gr=Math.max(1.5,0.24*s);
  const pl=K.p(X,0,Z);c.save();c.translate(pl[0],pl[1]);c.scale(1.9,0.42);hl_glow(c,0,0,4.2*s,HL_WARM.pool,0.20);c.restore();
  const m=K.p(X,-4.5,Z);hl_streak(c,m[0],m[1],1.6*s,0.32,2.2,HL_WARM.lamp,0.18);
  c.strokeStyle="rgb(6,12,14)";c.lineWidth=Math.max(1,0.16*s);c.beginPath();c.moveTo(b[0],b[1]);c.lineTo(t[0],t[1]);c.stroke();
  c.fillStyle="rgb(6,12,14)";c.fillRect(b[0]-0.22*s,b[1]-0.9*s,0.44*s,0.9*s);
  hl_glow(c,g[0],g[1],gr*8,HL_WARM.lamp,0.26);c.save();c.shadowColor="rgba(255,220,170,1)";c.shadowBlur=Math.min(22,gr*3.5);c.fillStyle="rgb(255,236,206)";c.beginPath();c.arc(g[0],g[1],gr,0,TAU);c.fill();c.restore();}

const HL_STREET_K=hl_cam(800,660,1000,1.6);
// where the camera goes in: a lit window on the first floor of the near block (its middle, in the frame)
const HL_STREET_WINDOW=(()=>{const K=HL_STREET_K,z=9+4*4.2+2.1,a=K.p(16,8.5,z-0.95),b=K.p(16,11.1,z+0.95);return{x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,w:Math.abs(a[0]-b[0]),h:Math.abs(a[1]-b[1])};})();
function hl_paintStreet(c,w,h){const K=HL_STREET_K,R=hl_rnd(1943),hz=K.vy;
  hl_sky(c,w,hz,{glow:[760,hz,640],stars:150});
  let g=c.createLinearGradient(0,hz,0,h);g.addColorStop(0,"rgb(18,32,36)");g.addColorStop(1,"rgb(5,11,13)");c.fillStyle=g;c.fillRect(0,hz,w,h-hz);
  hl_flat(c,K,0,-12,12,2.2,120);g=c.createLinearGradient(0,hz,0,h);g.addColorStop(0,"rgb(30,48,52)");g.addColorStop(0.35,"rgb(16,28,32)");g.addColorStop(1,"rgb(8,15,18)");c.fillStyle=g;c.fill();
  hl_flat(c,K,0,12,16,2.2,104);c.fillStyle="rgb(28,45,50)";c.fill();hl_flat(c,K,0,-16,-12,2.2,112);c.fillStyle="rgb(22,38,43)";c.fill();
  hl_flat(c,K,0,-36,24,104,118);c.fillStyle="rgb(26,42,46)";c.fill();
  hl_line(c,K,[12,0.15,2.5],[12,0.15,104],"rgba(190,225,232,0.22)",1.4);hl_line(c,K,[-12,0.15,2.5],[-12,0.15,112],"rgba(190,225,232,0.14)",1.2);
  // far off across the Mall, low lights
  for(let i=0;i<12;i++){const x=20+R()*420,y=hz-2-R()*10;hl_glow(c,x,y,5+R()*5,HL_WARM.win,0.30);}
  hl_archives(c,K,120,-36,16,{});
  hl_front(c,K,64,16,40,0,24);c.fillStyle=hl_rgb(HL_STONE.dark);c.fill();
  hl_govBlock(c,K,16,64,104,24,{seed:11,lamps:[70,80,90,100],lit:0.5});
  hl_govBlock(c,K,16,9,56,26,{seed:5,lamps:[12,22,32,42,52],door:7,win:{"4:2":true,"3:2":true,"5:2":true}});
  c.save();hl_flat(c,K,0,-12,12,2.2,120);c.clip();for(let z=12;z<60;z+=3.5){const q=K.p(15,-11,z);hl_streak(c,q[0],q[1],K.f*1.4/z,0.5,2.4,HL_WARM.win,0.10);}c.restore();
  // the elms, painted on a layer of their own and softened once, a little out of focus (one blur for the row; one for each leaf is slow)
  const trees=[[-25,64],[-24,57],[-23,50],[-22,43],[-21,36],[-20,29],[-20,22]],tl=mkCanvas(w,h),tc=tl.getContext("2d");for(const [x,z] of trees)hl_tree(tc,K,x,z,R,{h:11.5,r:4.6});
  c.save();c.filter="blur(1.4px)";c.drawImage(tl,0,0);c.restore();
  for(let z=100;z>=12;z-=10){if(z>56&&z<66)continue;hl_lamp(c,K,13.2,z);hl_lamp(c,K,-13.2,z+5);}}

/* ---------------------------------------------------------------- the office of 1943: a long room of steel filing cabinets */
// one point of view down the aisle: the cabinets along both walls, lamps hanging over the aisle, a desk and its lamp at the far end
// under a tall window. HL_OFFICE_K is its camera, so what a scene adds in the room (more cabinets, a drawer) is drawn in it.
const HL_OFFICE_K=hl_cam(1060,470,900,1.6);
const HL_STEEL={face:[74,82,70],hi:[124,128,104],lo:[34,40,36],deep:[18,22,20],brass:[218,180,110],card:[226,214,186]};
const HL_CAB=1.33;   // a cabinet's height, metres; four drawers
// one cabinet's front on a wall along the view (plane X), from depth z0 to z1, lit warm by the lamps (k, 0 to 1)
function hl_cabSide(c,K,X,z0,z1,k){const H=HL_CAB,base=0.07,dh=(H-base)/4,side=X<0?1:-1,warm=mix(HL_STEEL.face,[150,118,82],0.18*k);
  hl_side(c,K,X,z0,z1,0,H);const t=K.p(X,H,z0),b=K.p(X,0,z0);hl_vfill(c,t[1],b[1],mix(warm,HL_STEEL.hi,0.15*k),mix(warm,HL_STEEL.lo,0.55));
  for(let d=0;d<4;d++){const u0=base+d*dh+0.014,u1=base+(d+1)*dh-0.014,zm=(z0+z1)/2;
    hl_line(c,K,[X+side*0.004,u1,z0+0.02],[X+side*0.004,u1,z1-0.02],rgba(mix(HL_STEEL.hi,[255,230,190],0.3*k),0.55),1);
    hl_line(c,K,[X+side*0.004,u0,z0+0.02],[X+side*0.004,u0,z1-0.02],rgba(HL_STEEL.deep,0.7),1);
    // the label holder, a brass frame with a pale card, and under it the handle
    const lu=u0+(u1-u0)*0.70;hl_side(c,K,X+side*0.006,zm-0.05,zm+0.05,lu-0.022,lu+0.022);c.fillStyle=rgba(HL_STEEL.card,0.40+0.25*k);c.fill();
    const hu=u0+(u1-u0)*0.46;hl_side(c,K,X+side*0.012,zm-0.065,zm+0.065,hu-0.012,hu+0.012);c.fillStyle=rgba(HL_STEEL.brass,0.45+0.4*k);c.fill();}
  // the gap to the next cabinet
  hl_line(c,K,[X,0,z1],[X,H,z1],rgba(HL_STEEL.deep,0.85),1.2);}
// a cabinet's top, seen from above the aisle, with what is piled on it: transfer boxes and tied bundles of paper
function hl_cabTop(c,K,X0,X1,z0,z1,R,k){hl_flat(c,K,HL_CAB,X0,X1,z0,z1);c.fillStyle=hl_rgb(mix(HL_STEEL.lo,[90,76,56],0.25*k));c.fill();
  if(R()<0.55){const n=1+Math.floor(R()*2.2);let u=HL_CAB;for(let i=0;i<n;i++){const hh=0.18+R()*0.14,inset=0.04+R()*0.06,xa=X0<0?X1-0.04:X0+0.04,box=R()<0.6;
      const col=box?mix([120,92,62],[60,48,36],0.5-0.3*k):mix([196,186,160],[90,86,76],0.6-0.3*k);
      const xb=X0<0?X0+0.06:X1-0.06;hl_front(c,K,z0+inset,Math.min(xa,xb),Math.max(xa,xb),u,u+hh);c.fillStyle=hl_rgb(mix(col,[10,8,6],0.45));c.fill();
      hl_line(c,K,[Math.min(xa,xb),u+hh,z0+inset],[Math.max(xa,xb),u+hh,z0+inset],rgba(mix(col,[255,236,200],0.4),0.35),1);
      hl_side(c,K,xa,z0+inset,z1-inset,u,u+hh);c.fillStyle=hl_rgb(col);c.fill();
      hl_line(c,K,[xa,u+hh,z0+inset],[xa,u+hh,z1-inset],rgba(mix(col,[255,236,200],0.5),0.6),1);
      if(!box){hl_line(c,K,[xa,u+hh*0.5,z0+inset],[xa,u+hh*0.5,z1-inset],"rgba(120,80,50,0.7)",1);}
      u+=hh;}}}
// a hanging lamp over the aisle: a cord, a glass globe lit warm, its glow on the ceiling and its pool on the floor
function hl_pendant(c,K,X,U,Z,ceil){const s=K.f/Z,top=K.p(X,ceil,Z),g=K.p(X,U,Z),r=Math.max(2,0.17*s);
  c.strokeStyle="rgba(10,10,10,0.9)";c.lineWidth=Math.max(1,0.012*s);c.beginPath();c.moveTo(top[0],top[1]);c.lineTo(g[0],g[1]-r);c.stroke();
  hl_glow(c,g[0],g[1],r*9,[255,214,160],0.22);c.save();c.shadowColor="rgba(255,214,160,1)";c.shadowBlur=Math.min(30,r*2.5);
  const gg=c.createRadialGradient(g[0]-r*0.3,g[1]-r*0.3,r*0.1,g[0],g[1],r);gg.addColorStop(0,"rgb(255,246,226)");gg.addColorStop(1,"rgb(240,206,150)");c.fillStyle=gg;c.beginPath();c.arc(g[0],g[1],r,0,TAU);c.fill();c.restore();}
function hl_paintOffice(c,w,h){const K=HL_OFFICE_K,R=hl_rnd(4317),ceil=3.2,Zf=26,XW=2.5,XC=1.9,lamps=[3,7,11,15,19,23];
  // ceiling, walls above the cabinets, the far wall, the floor
  hl_flat(c,K,ceil,-XW,XW,1.0,Zf);hl_vfill(c,0,K.p(0,ceil,Zf)[1],[12,18,20],[30,34,32]);
  hl_side(c,K,-XW,1.0,Zf,HL_CAB,ceil);let a=K.p(-XW,0,1.2),b=K.p(-XW,0,Zf);let g=c.createLinearGradient(a[0],0,b[0],0);g.addColorStop(0,"rgb(26,32,32)");g.addColorStop(1,"rgb(44,46,42)");c.fillStyle=g;c.fill();
  hl_side(c,K,XW,1.0,Zf,HL_CAB,ceil);a=K.p(XW,0,1.2);b=K.p(XW,0,Zf);g=c.createLinearGradient(a[0],0,b[0],0);g.addColorStop(0,"rgb(24,30,30)");g.addColorStop(1,"rgb(44,46,42)");c.fillStyle=g;c.fill();
  hl_front(c,K,Zf,-XW,XW,0,ceil);a=K.p(0,ceil,Zf);b=K.p(0,0,Zf);hl_vfill(c,a[1],b[1],[40,42,38],[52,50,44]);
  // the tall window at the far end: the night outside, another building's lit windows, the glazing bars
  hl_front(c,K,Zf-0.01,-0.85,0.85,0.95,2.85);a=K.p(0,2.85,Zf);b=K.p(0,0.95,Zf);hl_vfill(c,a[1],b[1],[12,30,38],[30,56,62]);
  for(let i=0;i<9;i++){const X=-0.75+R()*1.5,U=1.0+R()*1.4,p=K.p(X,U,Zf-0.01);c.fillStyle=rgba(HL_WARM.win,0.55+0.3*R());c.fillRect(p[0],p[1],2.4,3.2);}
  c.strokeStyle="rgba(20,16,12,0.9)";c.lineWidth=2;for(const X of [-0.28,0.28]){const p0=K.p(X,0.95,Zf),p1=K.p(X,2.85,Zf);c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  for(const U of [1.6,2.25]){const p0=K.p(-0.85,U,Zf),p1=K.p(0.85,U,Zf);c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  // the floor: brown linoleum, its tiles' joints, and the lamps' light on it
  hl_flat(c,K,0,-XC,XC,1.0,Zf);a=K.p(0,0,Zf);hl_vfill(c,a[1],h,[54,48,40],[22,20,18]);
  c.save();hl_flat(c,K,0,-XC,XC,1.0,Zf);c.clip();for(let x=-XC;x<=XC+0.01;x+=0.475)hl_line(c,K,[x,0,1.0],[x,0,Zf],"rgba(0,0,0,0.16)",1);
  for(let z=1.2;z<Zf;z+=0.475)hl_line(c,K,[-XC,0,z],[XC,0,z],"rgba(0,0,0,0.12)",1);
  for(const z of lamps){const p=K.p(0,0,z),r=K.f*1.3/z;c.save();c.translate(p[0],p[1]);c.scale(1.4,0.36);hl_glow(c,0,0,r,[255,206,140],0.26);c.restore();}c.restore();
  // the ceiling's light round each lamp
  for(const z of lamps){const p=K.p(0,ceil,z),r=K.f*1.5/z;c.save();c.translate(p[0],p[1]);c.scale(1.5,0.4);hl_glow(c,0,0,r,[255,214,160],0.16);c.restore();}
  // the desk at the far end under the window, and its lamp
  hl_front(c,K,Zf-1.2,-0.7,0.7,0.72,0.76);c.fillStyle="rgb(70,48,32)";c.fill();hl_front(c,K,Zf-1.2,-0.66,0.66,0,0.72);c.fillStyle="rgb(40,28,20)";c.fill();
  {const p=K.p(0.42,0.98,Zf-1.3);hl_glow(c,p[0],p[1],K.f*0.9/(Zf-1.3),[255,214,150],0.5);c.fillStyle="rgb(255,226,170)";c.beginPath();c.arc(p[0],p[1],2.2,0,TAU);c.fill();}
  // the cabinets along both walls, far to near, and what is piled on them; the lamps' warmth falls off between them
  const warmth=z=>{let k=0;for(const l of lamps)k=Math.max(k,Math.exp(-Math.pow((z-l)/2.4,2)));return 0.35+0.65*k;};
  for(let z=Zf-1.6;z>=1.0;z-=0.42){const k=warmth(z);hl_cabTop(c,K,-XW,-XC,z,z+0.42,R,k);hl_cabTop(c,K,XC,XW,z,z+0.42,R,k);hl_cabSide(c,K,-XC,z,z+0.42,k);hl_cabSide(c,K,XC,z,z+0.42,k);}
  // the lamps over the aisle, far to near
  for(let i=lamps.length-1;i>=0;i--)hl_pendant(c,K,0,2.65,lamps[i],ceil);
  // a soft dark at the frame's edges, so the light reads as the lamps'
  g=c.createRadialGradient(1060,520,300,1060,520,1250);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,6,8,0.55)");c.fillStyle=g;c.fillRect(0,0,w,h);}

/* ---------------------------------------------------------------- the night, for the opening's diagrams: a building in section */
function hl_paintNight(c,w,h){hl_sky(c,w,h,{stops:[[0,[5,13,19]],[0.62,[12,30,38]],[1,[22,44,50]]],stars:120,seed:9});
  const hz=860;let g=c.createLinearGradient(0,hz,0,h);g.addColorStop(0,"rgb(16,30,34)");g.addColorStop(1,"rgb(6,12,14)");c.fillStyle=g;c.fillRect(0,hz,w,h-hz);
  c.fillStyle="rgba(190,225,232,0.26)";c.fillRect(0,hz,w,1.4);
  // the city low on the horizon, roofs and a few lit windows
  const R=hl_rnd(77);let x=-20;while(x<w){const ww=60+R()*140,hh=24+R()*70;c.fillStyle=hl_rgb(mix([12,24,28],[18,32,36],R()));c.fillRect(x,hz-hh,ww,hh);
    for(let i=0;i<3;i++)if(R()<0.6){c.fillStyle=rgba(HL_WARM.win,0.5+0.3*R());c.fillRect(x+8+R()*(ww-16),hz-hh+8+R()*(hh-16),4,6);}x+=ww+R()*30;}}

/* ---------------------------------------------------------------- a railway platform at night */
// side on: the platform's edge, a freight car on the track behind it with its door slid open, a baggage cart of crates, a lamp,
// the canopy's edge across the top, and the night over the yard
function hl_paintPlatform(c,w,h){const R=hl_rnd(1944);
  hl_sky(c,w,560,{stars:90,seed:21,glow:[300,560,420]});
  // the yard beyond: other tracks, a signal box's lit window, low sheds
  c.fillStyle="rgb(12,22,26)";c.fillRect(0,520,w,260);for(let i=0;i<6;i++){const x=40+i*130+R()*40,hh=40+R()*50;c.fillStyle="rgb(14,26,30)";c.fillRect(x,520-hh,110,hh+20);}
  hl_glow(c,640,470,40,HL_WARM.win,0.5);c.fillStyle="rgba(255,206,140,0.85)";c.fillRect(632,462,16,14);
  // the freight car: plank sides, dark red-brown in the night, its roof's edge lit, its door slid open on a dark inside
  const x0=760,x1=2000,y0=300,y1=780;c.fillStyle="rgb(58,34,28)";c.fillRect(x0,y0,x1-x0,y1-y0);
  hl_carLight(c,x0,y0,x1,y1);
  c.strokeStyle="rgba(0,0,0,0.30)";c.lineWidth=2;for(let x=x0+26;x<x1;x+=26){c.beginPath();c.moveTo(x,y0+12);c.lineTo(x,y1);c.stroke();}
  c.fillStyle="rgb(30,18,16)";c.fillRect(x0,y0-14,x1-x0,16);c.fillStyle="rgba(210,200,190,0.30)";c.fillRect(x0,y0-14,x1-x0,1.6);
  // the door opening, dark, with crates inside, and the door slid aside on its rail
  c.fillStyle="rgb(10,8,8)";c.fillRect(1120,360,330,420);for(let i=0;i<5;i++){c.fillStyle=hl_rgb(mix([40,30,22],[20,14,12],R()));c.fillRect(1130+i*62,620-((i%2)*70),58,160+((i%2)*70));}
  hl_glow(c,1280,600,180,HL_WARM.pool,0.10);
  c.fillStyle="rgb(66,40,32)";c.fillRect(1450,350,340,440);c.strokeStyle="rgba(0,0,0,0.35)";for(let x=1476;x<1790;x+=26){c.beginPath();c.moveTo(x,352);c.lineTo(x,788);c.stroke();}
  c.fillStyle="rgb(24,16,14)";c.fillRect(1100,342,720,10);
  // the platform: its stone edge catching the lamp, and the platform towards us
  c.fillStyle="rgb(30,40,40)";c.fillRect(0,770,w,310);let g=c.createLinearGradient(0,770,0,h);g.addColorStop(0,"rgb(38,48,48)");g.addColorStop(1,"rgb(12,18,18)");c.fillStyle=g;c.fillRect(0,780,w,300);
  c.fillStyle="rgba(220,226,214,0.30)";c.fillRect(0,776,w,4);c.fillStyle="rgb(18,24,24)";c.fillRect(0,770,w,6);
  // the lamp on its post, its pool on the platform
  c.save();c.translate(330,900);c.scale(2.2,0.4);hl_glow(c,0,0,260,HL_WARM.pool,0.22);c.restore();
  c.fillStyle="rgb(8,12,12)";c.fillRect(324,300,10,600);hl_glow(c,330,286,150,HL_WARM.lamp,0.30);c.save();c.shadowColor="rgba(255,220,170,1)";c.shadowBlur=24;c.fillStyle="rgb(255,232,196)";rr(c,312,262,36,46,6);c.fill();c.restore();
  c.fillStyle="rgb(8,12,12)";c.beginPath();c.moveTo(304,264);c.lineTo(330,240);c.lineTo(356,264);c.closePath();c.fill();
  // the canopy's edge across the top
  c.fillStyle="rgb(10,16,18)";c.fillRect(0,0,w,70);c.fillStyle="rgba(190,225,232,0.22)";c.fillRect(0,70,w,1.6);
  for(let x=60;x<w;x+=300){c.fillStyle="rgb(10,16,18)";c.fillRect(x,70,8,26);}
  // the baggage cart: a flat bed on two spoked wheels, its handle, crates of papers on it, one open
  const cx=420,cy=850;c.fillStyle="rgb(40,30,22)";c.fillRect(cx,cy-24,560,24);c.fillStyle="rgba(230,200,150,0.25)";c.fillRect(cx,cy-24,560,2);
  for(const wx of [cx+90,cx+470]){c.strokeStyle="rgb(14,12,10)";c.lineWidth=8;c.beginPath();c.arc(wx,cy+46,52,0,TAU);c.stroke();c.lineWidth=3;for(let k=0;k<8;k++){const an=k*TAU/8;c.beginPath();c.moveTo(wx,cy+46);c.lineTo(wx+Math.cos(an)*50,cy+46+Math.sin(an)*50);c.stroke();}}
  c.strokeStyle="rgb(14,12,10)";c.lineWidth=7;c.beginPath();c.moveTo(cx+560,cy-14);c.lineTo(cx+700,cy-190);c.stroke();
  const crates=[[cx+20,cy-24,170,150],[cx+200,cy-24,160,130],[cx+370,cy-24,170,160],[cx+60,cy-174,150,120],[cx+230,cy-154,150,110]];
  for(const [x,y,ww,hh] of crates){c.fillStyle="rgb(86,60,38)";c.fillRect(x,y-hh,ww,hh);c.fillStyle="rgba(255,220,170,0.16)";c.fillRect(x,y-hh,ww,3);
    c.strokeStyle="rgba(30,18,10,0.55)";c.lineWidth=2;for(let k=1;k<4;k++){c.beginPath();c.moveTo(x,y-hh*k/4);c.lineTo(x+ww,y-hh*k/4);c.stroke();}
    c.beginPath();c.moveTo(x+6,y-6);c.lineTo(x+ww-6,y-hh+6);c.stroke();}
  // papers showing at an open crate's top
  for(let i=0;i<6;i++){c.fillStyle=hl_rgb(mix([150,152,146],[90,92,88],R()));c.save();c.translate(cx+250+i*14,cy-264+R()*6);c.rotate((R()-0.5)*0.3);c.fillRect(-30,-8,60,12);c.restore();}}
// a freight car's light: the lamp's warmth on its near end, the night on its far end
function hl_carLight(c,x0,y0,x1,y1){const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"rgba(255,200,140,0.10)");g.addColorStop(0.5,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.25)");c.fillStyle=g;c.fillRect(x0,y0,x1-x0,y1-y0);}

/* ---------------------------------------------------------------- a desk under a lamp */
// seen from above: a walnut desk of three long boards, an oxblood leather blotter where a page will lie, a lamp's warm pool, a pile of
// manila folders at the left, a stamp and its pad and a pen at the right; the lamp itself is out of the frame. HL_DESK_PAGE is where
// the page lies.
const HL_DESK_PAGE={x:560,y:150,w:800,h:700};
function hl_paintDesk(c,w,h){const R=hl_rnd(707);let g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgb(40,27,20)");g.addColorStop(1,"rgb(30,20,15)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // the boards: long soft grain, a seam between each
  for(const [y0,y1] of [[0,372],[372,724],[724,h]]){for(let i=0;i<22;i++){const y=y0+R()*(y1-y0),a=0.05+R()*0.07;c.strokeStyle=R()<0.5?"rgba(0,0,0,"+a.toFixed(3)+")":"rgba(255,214,170,"+(a*0.5).toFixed(3)+")";c.lineWidth=1+R()*2.5;
      c.beginPath();c.moveTo(-20,y);c.bezierCurveTo(w*0.3,y+(R()-0.5)*26,w*0.65,y+(R()-0.5)*26,w+20,y+(R()-0.5)*20);c.stroke();}
    c.fillStyle="rgba(0,0,0,0.45)";c.fillRect(0,y1-2,w,3);c.fillStyle="rgba(255,220,180,0.06)";c.fillRect(0,y1+1,w,1);}
  // the lamp's pool, warm, from the top right
  hl_glow(c,980,440,980,[255,200,130],0.30);hl_glow(c,960,460,520,[255,222,170],0.22);
  // the blotter: oxblood leather, a tooled line round its edge, darker leather corners
  rr(c,400,86,1120,850,6);c.save();c.shadowColor="rgba(0,0,0,0.55)";c.shadowBlur=24;c.shadowOffsetY=8;c.fillStyle="rgb(70,34,30)";c.fill();c.restore();
  c.save();rr(c,400,86,1120,850,6);c.clip();hl_glow(c,960,470,760,[255,190,130],0.22);c.restore();
  c.strokeStyle="rgba(232,190,130,0.22)";c.lineWidth=2;rr(c,420,106,1080,810,4);c.stroke();
  for(const [x,y,sx,sy] of [[400,86,1,1],[1520,86,-1,1],[400,936,1,-1],[1520,936,-1,-1]]){c.beginPath();c.moveTo(x,y);c.lineTo(x+sx*150,y);c.quadraticCurveTo(x+sx*60,y+sy*60,x,y+sy*150);c.closePath();
    c.fillStyle="rgb(40,18,16)";c.fill();c.strokeStyle="rgba(232,190,130,0.28)";c.lineWidth=1.5;c.beginPath();c.moveTo(x+sx*150,y);c.quadraticCurveTo(x+sx*60,y+sy*60,x,y+sy*150);c.stroke();}
  // a pile of manila folders at the left, part out of the frame, tied with tape
  c.save();c.translate(170,660);c.rotate(-0.08);for(let i=0;i<7;i++){const y=i*-9,col=mix([196,168,118],[150,124,84],R());c.fillStyle=hl_rgb(mix(col,[0,0,0],0.15+0.06*(6-i)));c.fillRect(-300,y-200,560,210);
      c.fillStyle="rgba(255,236,200,0.25)";c.fillRect(-300,y-200,560,2);}
  c.fillStyle="rgb(206,180,128)";c.fillRect(-300,-264,560,210);c.fillRect(120,-290,120,30);c.fillStyle="rgba(255,236,200,0.35)";c.fillRect(-300,-264,560,2);c.fillRect(120,-290,120,2);
  c.fillStyle="rgb(150,60,48)";c.fillRect(30,-266,18,276);c.restore();
  // the stamp's pad, a tin, and the stamp, its wooden knob, at the right; a pen
  rr(c,1590,640,200,126,10);c.fillStyle="rgb(22,22,24)";c.fill();rr(c,1604,654,172,98,6);c.fillStyle="rgb(40,36,48)";c.fill();c.fillStyle="rgba(255,236,210,0.18)";c.fillRect(1590,640,200,2);
  c.save();c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=14;c.shadowOffsetY=6;c.fillStyle="rgb(96,62,36)";c.beginPath();c.arc(1700,520,40,0,TAU);c.fill();c.restore();
  g=c.createRadialGradient(1688,506,4,1700,520,40);g.addColorStop(0,"rgb(170,118,70)");g.addColorStop(1,"rgb(90,58,34)");c.fillStyle=g;c.beginPath();c.arc(1700,520,38,0,TAU);c.fill();
  c.save();c.translate(1640,300);c.rotate(0.42);c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=10;c.shadowOffsetY=5;rr(c,-9,-150,18,300,9);c.fillStyle="rgb(18,14,14)";c.fill();c.restore();
  c.save();c.translate(1640,300);c.rotate(0.42);c.fillStyle="rgba(240,206,150,0.55)";c.fillRect(-3,-140,2,230);c.fillStyle="rgb(196,160,96)";c.fillRect(-9,-40,18,8);c.restore();
  // a soft dark at the edges
  g=c.createRadialGradient(960,480,400,960,480,1200);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.62)");c.fillStyle=g;c.fillRect(0,0,w,h);}

/* ---------------------------------------------------------------- the Archives' steps, today */
// close to, face on: the colonnade, its bronze doors open on a warm hall, the wide steps lit from below by two bronze lamps, the night
// over the roof. HL_STEPS_DOOR is the doors' opening, where the few folders go in.
const HL_STEPS_DOOR={x:960,y:520,w:200,h:470};
function hl_column(c,x,y0,y1,wid,inner){const cx=x+wid/2;
  // the shaft: round, lit from the doors on its inner side; its flutes faint
  let g=c.createLinearGradient(x,0,x+wid,0);const st=inner>0?[[0,"rgb(26,40,46)"],[0.55,"rgb(90,106,106)"],[0.85,"rgb(150,128,100)"],[1,"rgb(118,100,80)"]]:[[0,"rgb(118,100,80)"],[0.15,"rgb(150,128,100)"],[0.45,"rgb(90,106,106)"],[1,"rgb(26,40,46)"]];
  for(const [s,col] of st)g.addColorStop(s,col);c.fillStyle=g;c.fillRect(x,y0+60,wid,y1-y0-96);
  for(let k=1;k<8;k++){const fx=x+wid*k/8;c.fillStyle="rgba(0,0,0,0.13)";c.fillRect(fx-1.5,y0+66,3,y1-y0-108);c.fillStyle="rgba(255,236,210,0.05)";c.fillRect(fx+1.5,y0+66,1.5,y1-y0-108);}
  const lg=c.createLinearGradient(0,y0,0,y1);lg.addColorStop(0,"rgba(0,0,0,0.30)");lg.addColorStop(0.7,"rgba(0,0,0,0)");lg.addColorStop(1,"rgba(255,206,150,0.16)");c.fillStyle=lg;c.fillRect(x,y0+60,wid,y1-y0-96);
  // the capital: a bell of leaves under a square abacus
  c.beginPath();c.moveTo(x-2,y0+62);c.lineTo(x-20,y0+14);c.lineTo(x+wid+20,y0+14);c.lineTo(x+wid+2,y0+62);c.closePath();g=c.createLinearGradient(0,y0+14,0,y0+62);g.addColorStop(0,"rgb(92,112,112)");g.addColorStop(1,"rgb(56,74,78)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(0,0,0,0.25)";c.lineWidth=2;for(let k=0;k<5;k++){const lx=x-12+k*(wid+24)/4;c.beginPath();c.moveTo(lx,y0+60);c.quadraticCurveTo(lx+(cx-lx)*0.2,y0+34,lx+(lx<cx?-6:6),y0+20);c.stroke();}
  c.fillStyle="rgb(104,124,122)";c.fillRect(x-28,y0,wid+56,16);c.fillStyle="rgba(220,240,236,0.4)";c.fillRect(x-28,y0,wid+56,2);
  // the base: a round moulding on a square plinth
  c.fillStyle="rgb(70,88,90)";c.beginPath();c.ellipse(cx,y1-30,wid/2+12,10,0,0,TAU);c.fill();c.fillStyle="rgb(58,76,80)";c.fillRect(x-18,y1-24,wid+36,24);c.fillStyle="rgba(255,214,160,0.22)";c.fillRect(x-18,y1-24,wid+36,2);}
function hl_paintSteps(c,w,h){hl_sky(c,w,h,{stars:60,seed:31});
  // the wall behind the columns, warm round the doors
  c.fillStyle="rgb(14,26,30)";c.fillRect(0,150,w,600);hl_glow(c,960,520,620,[255,200,130],0.30);
  // the doors' opening: a warm hall inside, a rotunda's arch far in, and the two bronze leaves swung open against the jambs
  const D=HL_STEPS_DOOR,dx=D.x-D.w/2,dy=D.y-D.h/2;c.save();c.shadowColor=HL_WARM.glow;c.shadowBlur=36;let g=c.createLinearGradient(0,dy,0,dy+D.h);g.addColorStop(0,"rgb(255,214,150)");g.addColorStop(1,"rgb(200,136,74)");c.fillStyle=g;c.fillRect(dx,dy,D.w,D.h);c.restore();
  c.strokeStyle="rgba(140,90,46,0.55)";c.lineWidth=3;c.beginPath();c.moveTo(dx+40,dy+D.h);c.lineTo(dx+40,dy+150);c.arc(D.x,dy+150,D.w/2-40,Math.PI,0);c.lineTo(dx+D.w-40,dy+D.h);c.stroke();
  for(const sx of [-1,1]){const x0=sx<0?dx-46:dx+D.w,g2=c.createLinearGradient(x0,0,x0+46,0);g2.addColorStop(0,sx<0?"rgb(40,30,20)":"rgb(118,84,48)");g2.addColorStop(1,sx<0?"rgb(118,84,48)":"rgb(40,30,20)");c.fillStyle=g2;c.fillRect(x0,dy-6,46,D.h+6);
    c.strokeStyle="rgba(20,12,8,0.6)";c.lineWidth=2;for(let k=1;k<6;k++){c.beginPath();c.moveTo(x0,dy+k*D.h/6);c.lineTo(x0+46,dy+k*D.h/6);c.stroke();}}
  c.fillStyle="rgb(40,58,62)";c.fillRect(dx-60,dy-36,D.w+120,30);c.fillStyle="rgba(220,240,236,0.3)";c.fillRect(dx-60,dy-36,D.w+120,2);
  // the entablature across the top: architrave, a plain frieze, the cornice's lit edge
  g=c.createLinearGradient(0,30,0,150);g.addColorStop(0,"rgb(44,66,70)");g.addColorStop(1,"rgb(70,92,92)");c.fillStyle=g;c.fillRect(0,30,w,120);
  c.fillStyle="rgba(0,0,0,0.22)";c.fillRect(0,112,w,3);c.fillStyle="rgba(0,0,0,0.18)";c.fillRect(0,66,w,3);c.fillStyle="rgba(210,236,236,0.45)";c.fillRect(0,30,w,2);
  // the columns, leaving the doors clear
  for(const x of [96,356,616,1208,1468,1728])hl_column(c,x,150,756,96,Math.sign(960-(x+48)));
  // the steps: each a lit tread and a darker riser, deeper towards us
  let y=756;for(let k=0;k<9;k++){const rh=24+k*2.6,th=10+k*1.4,f=k/9;c.fillStyle=hl_rgb(mix([84,100,98],[44,58,60],f));c.fillRect(0,y,w,th);
    c.fillStyle="rgba(255,214,160,"+(0.30-k*0.025).toFixed(3)+")";c.fillRect(0,y,w,1.6);y+=th;c.fillStyle=hl_rgb(mix([38,54,58],[18,28,30],f));c.fillRect(0,y,w,rh);y+=rh;}
  // the two bronze lamps on the steps' cheeks, and their warmth on the steps
  for(const lx of [150,1770]){hl_glow(c,lx,600,260,[255,206,140],0.26);c.fillStyle="rgb(20,16,12)";c.fillRect(lx-7,604,14,330);c.fillRect(lx-26,920,52,22);
    c.save();c.shadowColor="rgba(255,220,170,1)";c.shadowBlur=26;c.fillStyle="rgb(255,232,196)";rr(c,lx-20,560,40,52,8);c.fill();c.restore();c.fillStyle="rgb(20,16,12)";c.fillRect(lx-24,552,48,10);}
  hl_glow(c,960,1080,760,[255,200,130],0.16);
  // the night's shadow over the portico's top left, where the film's place and time stand
  g=c.createRadialGradient(240,120,40,240,120,600);g.addColorStop(0,"rgba(2,8,10,0.66)");g.addColorStop(1,"rgba(2,8,10,0)");c.fillStyle=g;c.fillRect(0,0,960,760);}

/* ---------------------------------------------------------------- a glass case, read by lamplight */
// in a dark hall of the Archives: a case of glass on a wooden stand under a lamp; in it, a family's page and a service record
// (drawn as pages, no words), the lamp's light on the glass's edges
function hl_paintCase(c,w,h){let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgb(10,18,22)");g.addColorStop(1,"rgb(16,22,24)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // shelves of grey boxes far off in the dark
  const R=hl_rnd(55);for(let row=0;row<6;row++){const y=60+row*130;c.fillStyle="rgb(24,32,34)";c.fillRect(0,y+104,w,8);c.fillStyle="rgba(190,225,232,0.08)";c.fillRect(0,y+104,w,1.5);
    let x=-10;while(x<w){const bw=44+R()*30,bh=74+R()*26;c.fillStyle=hl_rgb(mix([26,34,36],[38,46,46],R()));c.fillRect(x,y+104-bh,bw,bh);c.fillStyle="rgba(190,200,190,0.10)";c.fillRect(x+bw*0.25,y+104-bh*0.7,bw*0.5,12);
      c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(x+bw-2,y+104-bh,2,bh);x+=bw+2;if(R()<0.06)x+=40;}}
  for(let x=0;x<w;x+=320){c.fillStyle="rgb(18,24,26)";c.fillRect(x,40,12,820);}
  g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgba(8,14,16,0.55)");g.addColorStop(1,"rgba(8,14,16,0.85)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // the lamp's cone and its light on the case
  c.save();c.globalCompositeOperation="lighter";const cg=c.createLinearGradient(0,0,0,700);cg.addColorStop(0,"rgba(255,214,160,0.10)");cg.addColorStop(1,"rgba(255,214,160,0.02)");c.fillStyle=cg;
  c.beginPath();c.moveTo(900,0);c.lineTo(1020,0);c.lineTo(1420,700);c.lineTo(500,700);c.closePath();c.fill();c.restore();
  // the stand
  c.fillStyle="rgb(46,30,22)";c.fillRect(520,690,880,40);c.fillStyle="rgb(34,22,16)";c.fillRect(560,730,800,250);c.fillStyle="rgba(255,214,160,0.18)";c.fillRect(520,690,880,2);
  // the pages inside: a family's page (lines and a small photograph's frame) and a service record (a card, a stamp's ring)
  c.save();c.translate(760,560);c.rotate(-0.03);c.fillStyle="rgb(214,200,168)";c.fillRect(-170,-110,340,220);c.fillStyle="rgba(90,70,50,0.5)";for(let k=0;k<7;k++)c.fillRect(-140,-80+k*24,k%3===2?160:240,4);
  c.fillStyle="rgba(60,50,40,0.55)";c.fillRect(70,-90,80,96);c.restore();
  c.save();c.translate(1150,580);c.rotate(0.04);c.fillStyle="rgb(222,212,186)";c.fillRect(-150,-90,300,180);c.fillStyle="rgba(90,70,50,0.5)";for(let k=0;k<5;k++)c.fillRect(-120,-60+k*26,200,4);
  c.strokeStyle="rgba(120,60,50,0.55)";c.lineWidth=3;c.beginPath();c.arc(90,40,30,0,TAU);c.stroke();c.restore();
  hl_glow(c,960,560,520,[255,214,160],0.22);
  // the glass: its front a faint sheen, its edges catching the lamp
  c.fillStyle="rgba(190,240,240,0.04)";c.fillRect(540,420,840,270);c.strokeStyle="rgba(230,250,250,0.45)";c.lineWidth=2;c.strokeRect(540,420,840,270);
  c.fillStyle="rgba(255,240,210,0.5)";c.fillRect(540,420,840,2);
  c.save();c.globalCompositeOperation="lighter";c.fillStyle="rgba(200,240,240,0.05)";c.beginPath();c.moveTo(600,420);c.lineTo(720,420);c.lineTo(640,690);c.lineTo(520+60,690);c.closePath();c.fill();c.restore();}

/* ---------------------------------------------------------------- the clerk's cabinets: a row of them, face on, close */
// A row of four-drawer cabinets against the office's wall, seen face on from where the clerk stands (978 px a metre at their depth):
// their top drawers along the bottom of the frame, the plaster wall above, a clock, a window on the night, a gooseneck lamp on one.
// The top drawers are drawn live (hl_wallDrawer), so they can open, close, fill and empty; the place paints the rest.
const HL_WALL={eye:[960,352],top:600,w:372,gap:12,x0:6,n:5,dTop:620,dH:293};
const hl_wallX=i=>HL_WALL.x0+i*(HL_WALL.w+HL_WALL.gap);
function hl_steelGrad(c,x,y0,y1,k){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,hl_rgb(mix(HL_STEEL.face,[170,140,100],0.22*k)));g.addColorStop(1,hl_rgb(mix(HL_STEEL.lo,[60,50,40],0.2)));return g;}
function hl_paintWall(c,w,h){const R=hl_rnd(4318),T=HL_WALL.top;
  // the wall: plaster, warm where the lamp lights it, a dark wainscot rail behind the cabinets
  let g=c.createLinearGradient(0,0,0,T);g.addColorStop(0,"rgb(30,32,30)");g.addColorStop(1,"rgb(52,50,44)");c.fillStyle=g;c.fillRect(0,0,w,T+40);
  hl_glow(c,1620,300,900,[255,206,140],0.20);hl_glow(c,1600,540,420,[255,222,170],0.14);
  c.fillStyle="rgb(36,30,24)";c.fillRect(0,T-130,w,34);c.fillStyle="rgba(255,220,180,0.10)";c.fillRect(0,T-130,w,2);
  // a window on the night above the second cabinet: the dark sky, lit windows far off, the glazing bars
  {const x=470,y=60,ww=270,hh=370;c.fillStyle="rgb(40,34,28)";c.fillRect(x-16,y-16,ww+32,hh+32);g=c.createLinearGradient(0,y,0,y+hh);g.addColorStop(0,"rgb(8,22,30)");g.addColorStop(1,"rgb(22,46,54)");c.fillStyle=g;c.fillRect(x,y,ww,hh);
    for(let i=0;i<5;i++){c.fillStyle=rgba(HL_WARM.win,0.6);c.fillRect(x+30+R()*210,y+200+R()*140,5,7);}c.fillStyle="rgb(36,30,24)";c.fillRect(x+ww/2-4,y,8,hh);c.fillRect(x,y+hh/2-4,ww,8);}
  // a clock, its hands at twenty to ten
  {const cx=1090,cy=250,r=62;c.fillStyle="rgb(40,32,24)";c.beginPath();c.arc(cx,cy,r+8,0,TAU);c.fill();c.fillStyle="rgb(214,204,180)";c.beginPath();c.arc(cx,cy,r,0,TAU);c.fill();
    c.strokeStyle="rgb(40,34,28)";c.lineCap="round";for(let k=0;k<12;k++){const a=k*TAU/12;c.lineWidth=k%3?2:4;c.beginPath();c.moveTo(cx+Math.cos(a)*(r-12),cy+Math.sin(a)*(r-12));c.lineTo(cx+Math.cos(a)*(r-4),cy+Math.sin(a)*(r-4));c.stroke();}
    const hand=(a,l,lw)=>{c.lineWidth=lw;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.sin(a)*l,cy-Math.cos(a)*l);c.stroke();};hand(TAU*(9.67/12),34,6);hand(TAU*(40/60),50,4);}
  // the cabinets: each its top, its frame, the slots of its top two drawers (the fronts are drawn live), its lower drawers
  for(let i=0;i<HL_WALL.n;i++){const x=hl_wallX(i),W2=HL_WALL.w,k=Math.max(0.25,1-Math.abs(x+W2/2-1600)/1400);
    c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=30;c.fillStyle=hl_steelGrad(c,x,T,h,k);c.fillRect(x,T,W2,h-T+20);c.restore();
    c.fillStyle=hl_rgb(mix(HL_STEEL.hi,[255,226,180],0.25*k));c.fillRect(x,T-16,W2,16);c.fillStyle="rgba(255,236,210,"+(0.25*k+0.08).toFixed(3)+")";c.fillRect(x,T-16,W2,2);
    c.fillStyle="rgba(0,0,0,0.55)";c.fillRect(x+12,HL_WALL.dTop-4,W2-24,HL_WALL.dH+8);
    const y2=HL_WALL.dTop+HL_WALL.dH+12;c.fillStyle=hl_steelGrad(c,x,y2,y2+HL_WALL.dH,k*0.8);c.fillRect(x+14,y2,W2-28,HL_WALL.dH);
    c.fillStyle="rgba(255,236,210,0.16)";c.fillRect(x+14,y2,W2-28,2);rr(c,x+W2/2-85,y2+40,170,50,4);c.fillStyle=rgba(HL_STEEL.brass,0.55*k+0.2);c.fill();
    rr(c,x+W2/2-60,y2+124,120,18,9);c.fillStyle=rgba(HL_STEEL.brass,0.6*k+0.25);c.fill();}
  // the lamp on the last cabinet: a gooseneck and a green-black shade, its light on the wall
  {const bx=1780,by=T-16;c.fillStyle="rgb(24,22,20)";c.beginPath();c.ellipse(bx,by-6,46,12,0,0,TAU);c.fill();c.strokeStyle="rgb(24,22,20)";c.lineWidth=9;c.beginPath();c.moveTo(bx,by-10);c.bezierCurveTo(bx-10,by-160,bx-120,by-230,bx-170,by-200);c.stroke();
    c.save();c.translate(bx-180,by-196);c.rotate(0.5);c.fillStyle="rgb(30,28,26)";c.beginPath();c.moveTo(-50,0);c.lineTo(50,0);c.lineTo(30,-44);c.lineTo(-30,-44);c.closePath();c.fill();c.restore();
    hl_glow(c,bx-196,by-160,260,[255,226,178],0.35);c.save();c.shadowColor="rgba(255,226,178,1)";c.shadowBlur=20;c.fillStyle="rgb(255,236,206)";c.beginPath();c.ellipse(bx-196,by-168,30,9,0.5,0,TAU);c.fill();c.restore();}
  // the floor's dark at the very bottom, and a soft dark round the edges
  g=c.createRadialGradient(1100,520,420,1100,520,1300);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,4,6,0.5)");c.fillStyle=g;c.fillRect(0,0,w,h);}
// a top drawer of cabinet i, drawn live: out (0 shut, 1 pulled 0.25 m towards us), its label card (words, or null), how full (0 to 1),
// o.a its light. Returns its front's box and its handle, for a hand or a folder. Drawn about the eye, as the place's own perspective.
function hl_wallDrawer(c,i,o){o=o||{};const x=hl_wallX(i)+14,w=HL_WALL.w-28,y=HL_WALL.dTop,h=HL_WALL.dH,E=o.eyeX==null?HL_WALL.eye:[o.eyeX,HL_WALL.eye[1]],k=1+0.12*clamp(o.out||0,0,1.6),
    P=(px,py)=>[E[0]+(px-E[0])*k,E[1]+(py-E[1])*k],a=P(x,y),b=P(x+w,y+h),lit=o.lit==null?1:o.lit,warm=Math.max(0.3,1-Math.abs(x+w/2-1600)/1400);
  if(k>1.001){// the drawer's sides and the inside, seen from above
    c.fillStyle="rgb(14,14,12)";c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.lineTo(b[0],a[1]);c.lineTo(a[0],a[1]);c.closePath();c.fill();
    c.fillStyle=hl_rgb(mix(HL_STEEL.lo,[0,0,0],0.3));c.beginPath();c.moveTo(x,y);c.lineTo(a[0],a[1]);c.lineTo(a[0],b[1]);c.lineTo(x,y+h);c.closePath();c.fill();
    c.beginPath();c.moveTo(x+w,y);c.lineTo(b[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(x+w,y+h);c.closePath();c.fill();
    // the folders inside: manila edges, standing, seen from above, as many as it is full
    const n=Math.round(14*clamp(o.full==null?1:o.full,0,1));for(let f=0;f<n;f++){const u=(f+0.5)/14,yy=lerp(y+4,a[1]-4,u),xx0=lerp(x+10,a[0]+10,u),xx1=lerp(x+w-10,b[0]-10,u);
      c.fillStyle=hl_rgb(mix([206,180,128],[120,100,70],0.4+0.4*(1-u)));c.fillRect(xx0,yy-3,xx1-xx0,4);}}
  // the front
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=k>1.001?24:0;c.shadowOffsetY=k>1.001?10:0;c.fillStyle=hl_steelGrad(c,a[0],a[1],b[1],warm*lit);c.fillRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);c.restore();
  c.fillStyle="rgba(255,236,210,"+(0.22*lit).toFixed(3)+")";c.fillRect(a[0],a[1],b[0]-a[0],2);c.fillStyle="rgba(0,0,0,0.35)";c.fillRect(a[0],b[1]-3,b[0]-a[0],3);
  const cx=(a[0]+b[0])/2,big=o.big||o.label||o.typeOf,lw=(big?280:150)*k,lh=(big?56:40)*k,ly=a[1]+(big?24:30)*k,hy=a[1]+(0.45*h)*k;
  // the label holder: a brass frame and its card, and on the card its words, typed
  rr(c,cx-lw/2-6*k,ly-6*k,lw+12*k,lh+12*k,4);c.fillStyle=rgba(HL_STEEL.brass,0.5*warm*lit+0.25);c.fill();
  rr(c,cx-lw/2,ly,lw,lh,2);c.fillStyle=hl_rgb(mix(HL_STEEL.card,[120,110,90],1-lit));c.fill();
  // its words; while they're typed (o.typeOf, the whole label), they start where the whole label will, so nothing shifts as they grow
  if(o.label){const la=o.labelA==null?1:o.labelA,sz=Math.round(28*k),q={w:600,size:sz,f:"mono",col:[34,26,18]};
    if(la>0)withA(c,la,()=>o.typeOf?dp_T(c,o.label,cx-dp_tw(c,o.typeOf,q)/2,ly+lh*0.7,q):dp_T(c,o.label,cx,ly+lh*0.7,Object.assign({align:"center"},q)));}
  // the handle, a brass pull
  rr(c,cx-66*k,hy-11*k,132*k,22*k,11*k);c.fillStyle=rgba(HL_STEEL.brass,0.65*warm*lit+0.3);c.fill();c.fillStyle="rgba(255,240,200,0.4)";c.fillRect(cx-56*k,hy-9*k,112*k,2);
  return{x:a[0],y:a[1],w:b[0]-a[0],h:b[1]-a[1],handle:[cx,hy],inside:[(x+a[0])/2,(y+a[1])/2]};}

/* ---------------------------------------------------------------- the clerk of 1943 */
// One of the war offices' clerks, as the agent films draw people (one three-quarter head, arms down, a hand only on a drawer's handle):
// a cream blouse with a pointed collar; her hair to the collar, its ends rolled under, and a roll swept up from the forehead, as women
// wore it in 1943. The rolls are painted with the head, inside its picture.
function hl_rolls(c,P){const h=P.hair.c,hi=ag_lt(h,0.30),sh="rgba(0,0,0,0.40)",line=rgba(ag_dk(h,0.5),0.5);c.lineCap="round";
  // the ends, rolled under along the collar
  ag_soft(c,cc=>{cc.moveTo(214,488);cc.bezierCurveTo(212,520,240,546,276,542);cc.bezierCurveTo(300,540,318,528,318,512);cc.bezierCurveTo(300,520,276,524,252,516);cc.bezierCurveTo(232,510,220,500,214,488);cc.closePath();},
    h,hi,262,520,40,sh,8);
  c.strokeStyle=line;c.lineWidth=2;c.beginPath();c.moveTo(226,508);c.bezierCurveTo(240,526,272,532,306,522);c.stroke();
  // the roll swept up and back from the forehead, its open end towards us
  ag_soft(c,cc=>{cc.moveTo(392,346);cc.bezierCurveTo(400,318,384,286,350,276);cc.bezierCurveTo(316,266,272,272,250,290);cc.bezierCurveTo(262,300,286,304,306,312);
      cc.bezierCurveTo(330,322,352,330,368,342);cc.bezierCurveTo(378,348,386,350,392,346);cc.closePath();},h,hi,330,284,46,sh,12);
  c.strokeStyle=line;c.lineWidth=2.2;c.beginPath();c.moveTo(262,288);c.bezierCurveTo(300,282,346,290,384,326);c.stroke();
  c.strokeStyle=rgba(ag_lt(h,0.5),0.25);c.lineWidth=1.8;c.beginPath();c.moveTo(276,280);c.bezierCurveTo(310,274,348,282,378,306);c.stroke();}
const HL_CLERK={name:"A clerk",key:"hl-clerk",skin:[236,204,178],hair:{style:"bob",c:[96,64,44]},top:{kind:"shirt",c:[206,192,166]},hat:{paint:hl_rolls},breath:0.26};

AG_PLACES.hlStreet=c=>hl_paintStreet(c,W,H);
AG_PLACES.hlWall=c=>hl_paintWall(c,W,H);
AG_PLACES.hlOffice=c=>hl_paintOffice(c,W,H);
AG_PLACES.hlNight=c=>hl_paintNight(c,W,H);
AG_PLACES.hlPlatform=c=>hl_paintPlatform(c,W,H);
AG_PLACES.hlDesk=c=>hl_paintDesk(c,W,H);
AG_PLACES.hlSteps=c=>hl_paintSteps(c,W,H);
AG_PLACES.hlCase=c=>hl_paintCase(c,W,H);
