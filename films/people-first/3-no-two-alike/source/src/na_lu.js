/* ===== No two alike: the teacher's room in Lu =====
   A plain hall of its time, as the texts leave it: walls of rammed earth under a coat of clay, timber posts and a beam, a floor of
   beaten earth, and woven mats to sit on (Analects 10.9: he didn't sit unless his mat was straight). No chairs, no paper and no bound
   books: what they read was written on slips of bamboo, tied side by side with cords and rolled up, and the rolls here show no writing
   at all. The light comes from a doorway out of the frame on the right, as the university's does from its window. Nothing on the wall,
   and nothing sacred drawn.
     naLu                      the place: the hall, its two mats and the rolls beside the teacher's
     NA_LU_SEAT                where each of the four kneels: x, the mat's line under them, their size, and which way they face
     na_luFour(ctx, tt, o)     the four, each with a soft shadow on the mat; o.a fades them all, o.only one of them, o.light their light
     na_gift(ctx, x, y, s, a)  the smallest gift a student brought: a bundle of strips of dried meat, tied with a cord (Analects 7.7) */

// the floor as one camera sees it: the eye at y 440; a point on the floor 4 m away is at y 900, where a metre is 528 px across
const NA_LU_CAM={eye:440,vpx:1000,y4:900,p4:528},NA_LU_HZ=640;
const na_luY=z=>NA_LU_CAM.eye+(NA_LU_CAM.y4-NA_LU_CAM.eye)*4/z,na_luX=(X,z)=>NA_LU_CAM.vpx+X*NA_LU_CAM.p4*4/z;
const NA_LU_SEAT={zilu:{x:300,mat:884,s:0.475},ranyou:{x:640,mat:875,s:0.46},gongxi:{x:960,mat:850,s:0.43},kong:{x:1540,mat:884,s:0.475,flip:true}};
const na_luNeck=k=>NA_LU_SEAT[k].mat-(NA_SEAT.mat-AG_FIG.anchor[1])*NA_LU_SEAT[k].s;

function na_timber(c,x,y,w,h,o){o=o||{};const T=o.col||[122,92,66],up=h>w;let g=up?c.createLinearGradient(x,0,x+w,0):c.createLinearGradient(0,y,0,y+h);
  g.addColorStop(0,rgba(ag_dk(T,0.18),1));g.addColorStop(0.45,rgba(ag_lt(T,0.1),1));g.addColorStop(1,rgba(ag_dk(T,0.3),1));c.fillStyle=g;c.fillRect(x,y,w,h);
  const R=ag_rnd(o.seed||3);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.lineWidth=1.4;
  for(let i=0;i<(up?w:h)/5;i++){const u=R(),a=0.06+R()*0.1;c.strokeStyle=rgba(i%2?ag_dk(T,0.5):ag_lt(T,0.3),a);c.beginPath();
    if(up){const xx=x+u*w;c.moveTo(xx,y);c.bezierCurveTo(xx+4*R()-2,y+h*0.3,xx+6*R()-3,y+h*0.7,xx+4*R()-2,y+h);}
    else{const yy=y+u*h;c.moveTo(x,yy);c.bezierCurveTo(x+w*0.3,yy+4*R()-2,x+w*0.7,yy+6*R()-3,x+w,yy+4*R()-2);}c.stroke();}
  c.restore();}
// a woven mat lying on the floor: from x0 to x1 (metres from the room's middle) and from zN to zF metres away; a plain bound edge
function na_mat(c,x0,x1,zN,zF){const P=(X,z)=>[na_luX(X,z),na_luY(z)],quad=(a0,a1,b0,b1)=>cc=>{const p=P(a0,b1),q=P(a1,b1),r=P(a1,b0),s=P(a0,b0);cc.moveTo(p[0],p[1]);cc.lineTo(q[0],q[1]);cc.lineTo(r[0],r[1]);cc.lineTo(s[0],s[1]);cc.closePath();};
  const whole=quad(x0,x1,zN,zF),M=[200,176,128],E=[112,90,66],bd=0.07;
  c.save();c.shadowColor=rgba(LP.shade,0.4);c.shadowBlur=14;c.shadowOffsetX=-8;c.shadowOffsetY=7;ag_shape(c,whole);c.fillStyle=rgba(E,1);c.fill();c.restore();
  const inner=quad(x0+bd,x1-bd,zN+bd*0.9,zF-bd*0.9);ag_shape(c,inner);c.fillStyle=rgba(M,1);c.fill();
  // the weave: rushes along the mat, bound across at every hand's width
  c.save();ag_shape(c,inner);c.clip();c.lineWidth=1.3;
  for(let z=zN+bd;z<zF-bd;z+=0.034){const a=P(x0,z),b=P(x1,z),k=Math.round(z*100)%3;c.strokeStyle=rgba(k?ag_dk(M,0.24):ag_lt(M,0.3),k?0.3:0.34);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  c.lineWidth=2;for(let X=x0+bd+0.11;X<x1-bd;X+=0.11){const a=P(X,zN),b=P(X,zF);c.strokeStyle=rgba(ag_dk(M,0.4),0.2);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
    c.strokeStyle="rgba(255,248,226,0.16)";c.beginPath();c.moveTo(a[0]+2,a[1]);c.lineTo(b[0]+2,b[1]);c.stroke();}
  // the light across it: the far side a little in shade, the near side taking the door's light on the right
  const p0=P(x0,zN),p1=P(x1,zN);let g=c.createLinearGradient(p0[0],0,p1[0],0);g.addColorStop(0,rgba(LP.shade,0.2));g.addColorStop(1,rgba(LP.shade,0));c.fillStyle=g;c.fillRect(0,NA_LU_HZ,W,H-NA_LU_HZ);
  c.restore();
  // its near edge, a finger thick
  const n0=P(x0,zN),n1=P(x1,zN);c.fillStyle=rgba(ag_dk(E,0.4),1);c.fillRect(n0[0],n0[1],n1[0]-n0[0],5);c.fillStyle="rgba(255,244,220,0.22)";c.fillRect(n0[0],n0[1],n1[0]-n0[0],1.5);}
// a roll of bamboo slips lying on its side, tied twice: its near end at (x, y), len long, r its radius. No writing shows
function na_roll(c,x,y,len,r,seed){const B=[202,180,126],D=[140,114,74],R=ag_rnd(seed||5),body=cc=>{cc.moveTo(x,y-r);cc.lineTo(x+len,y-r);cc.ellipse(x+len,y,r*0.42,r,0,-Math.PI/2,Math.PI/2);cc.lineTo(x,y+r);cc.ellipse(x,y,r*0.42,r,0,Math.PI/2,-Math.PI/2,true);cc.closePath();};
  c.save();c.shadowColor=rgba(LP.shade,0.42);c.shadowBlur=10;c.shadowOffsetX=-6;c.shadowOffsetY=6;ag_shape(c,body);c.fillStyle=rgba(B,1);c.fill();c.restore();
  let g=c.createLinearGradient(0,y-r,0,y+r);g.addColorStop(0,rgba(ag_lt(B,0.28),1));g.addColorStop(0.45,rgba(B,1));g.addColorStop(1,rgba(ag_dk(B,0.36),1));ag_shape(c,body);c.fillStyle=g;c.fill();
  // the slips, side by side round the roll
  c.save();ag_shape(c,body);c.clip();c.lineWidth=1.2;for(let i=1;i<9;i++){const yy=y-r+i*(2*r/9)+(R()-0.5)*1.5;c.strokeStyle=rgba(D,0.34);c.beginPath();c.moveTo(x-r,yy);c.lineTo(x+len+r,yy);c.stroke();}c.restore();
  // the near end: the slips' ends, rolled
  ag_shape(c,cc=>cc.ellipse(x,y,r*0.42,r,0,0,TAU));c.fillStyle=rgba(ag_dk(B,0.12),1);c.fill();c.strokeStyle=rgba(D,0.55);c.lineWidth=1.3;
  for(const k of [0.72,0.44,0.18]){c.beginPath();c.ellipse(x,y,r*0.42*k,r*k,0,0,TAU);c.stroke();}
  // the two cords
  c.strokeStyle=rgba([96,74,54],0.9);c.lineWidth=3;c.lineCap="round";for(const u of [0.26,0.74]){c.beginPath();c.ellipse(x+len*u,y,r*0.42,r,0,-Math.PI/2,Math.PI/2);c.stroke();}}
function na_paintLu(c){const hz=NA_LU_HZ,E=NA_LU_CAM,TW=[122,92,66];
  lp_plaster(c,hz,{base:[210,186,148],seed:7});
  // the courses of rammed earth, showing faintly through the clay
  for(let y=96;y<hz-50;y+=96){c.fillStyle=rgba([112,84,58],0.07);c.fillRect(0,y,W,3);c.fillStyle="rgba(255,244,224,0.07)";c.fillRect(0,y+3,W,2);}
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.36));g.addColorStop(0.42,rgba(LP.shade,0.13));g.addColorStop(1,rgba(LP.shade,0.03));c.fillStyle=g;c.fillRect(0,0,W,hz);
  g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(LP.shade,0.24));g.addColorStop(0.36,rgba(LP.shade,0));g.addColorStop(0.78,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.shade,0.2));c.fillStyle=g;c.fillRect(0,0,W,hz);
  // the floor of beaten earth, at half size: soft patches, smaller the farther off
  const k=0.5,w=W*k,h=Math.ceil((H-hz)*k),img=c.createImageData(w,h),d=img.data,O=[164,136,104];
  for(let j=0;j<h;j++){const y=hz+(j+0.5)/k,z=(E.y4-E.eye)*4/(y-E.eye),damp=clamp((y-E.eye)/360,0.4,1);
    for(let i=0;i<w;i++){const X=((i+0.5)/k-E.vpx)*z/(E.p4*4),a=LP_NZ.fbm(X*1.1+20,z*1.1+7,4)-0.5,b=LP_NZ.fbm(X*6+3,z*6+11,3)-0.5,L=(a*34+b*12)*damp,q=(j*w+i)*4;
      d[q]=O[0]+L;d[q+1]=O[1]+L*0.95;d[q+2]=O[2]+L*0.86;d[q+3]=255;}}
  const cv=mkCanvas(w,h);cv.getContext("2d").putImageData(img,0,0);c.save();c.imageSmoothingQuality="high";c.drawImage(cv,0,0,w,h,0,hz,W,H-hz);c.restore();
  lp_grain(c,0,hz,W,H-hz,2.0,43);
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(LP.shade,0.36));g.addColorStop(0.3,rgba(LP.shade,0.1));g.addColorStop(1,rgba(LP.shade,0.2));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.26));g.addColorStop(0.5,rgba(LP.shade,0.06));g.addColorStop(1,rgba(LP.shade,0));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  // timber: the beam under the roof, two posts, and the sill the wall stands on
  na_timber(c,0,0,W,44,{seed:5});c.fillStyle=rgba(LP.shade,0.3);c.fillRect(0,44,W,10);
  for(const px of [118,1722]){c.fillStyle=rgba(LP.shade,0.2);c.fillRect(px-16,44,16,hz-44);na_timber(c,px,44,62,hz-44,{seed:px});}
  na_timber(c,0,hz-20,W,20,{seed:9});c.fillStyle="rgba(255,244,220,0.3)";c.fillRect(0,hz-20,W,1.5);c.fillStyle=rgba(LP.shade,0.45);c.fillRect(0,hz,W,3);
  // the doorway's light: a slanted patch on the wall, and on the floor in front of it
  const lk=0.25,sm=mkCanvas(W*lk,H*lk),s=sm.getContext("2d");s.scale(lk,lk);s.filter="blur(2.5px)";s.fillStyle="#fff";
  s.beginPath();s.moveTo(1150,300);s.lineTo(1590,150);s.lineTo(1590,hz-20);s.lineTo(1150,hz-20);s.closePath();s.fill();
  s.beginPath();s.moveTo(1150,hz+3);s.lineTo(1590,hz+3);s.lineTo(1460,H+40);s.lineTo(820,H+40);s.closePath();s.fill();
  const lit=mkCanvas(W,H),lc=lit.getContext("2d");lc.imageSmoothingQuality="high";lc.drawImage(sm,0,0,W,H);lc.globalCompositeOperation="source-in";lc.fillStyle=rgba([255,218,160],1);lc.fillRect(0,0,W,H);
  c.save();c.globalCompositeOperation="soft-light";c.globalAlpha=0.9;c.drawImage(lit,0,0);c.globalCompositeOperation="screen";c.globalAlpha=0.3;c.drawImage(lit,0,0);c.restore();
  // the students' long mat, the teacher's own, and the rolls of slips beside it
  na_mat(c,-1.66,0.3,3.93,4.98);na_mat(c,0.36,1.42,3.93,4.92);
  na_roll(c,1790,850,98,18,11);na_roll(c,1802,888,92,18,17);na_roll(c,1810,822,78,16,23);
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.26));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.naLu=na_paintLu;

// the four on their mats: the three students facing the teacher, the youngest a little way behind
function na_luFour(ctx,tt,o){o=o||{};const lt=o.light||{light:"day",warm:0.14,shade:0.2};
  for(const k of ["gongxi","ranyou","zilu","kong"]){const S=NA_LU_SEAT[k],a=(o.a==null?1:o.a)*(o.only&&o.only[k]!=null?o.only[k]:1);if(a<=0.004)continue;
    ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,S.x+(S.flip?-30:30)*S.s-26,S.mat+4,330*S.s,40*S.s,0.3);ctx.restore();
    na_seated(ctx,k,S.x,na_luNeck(k),S.s,{t:tt+(k==="kong"?0:k==="zilu"?1.3:k==="ranyou"?2.1:3.4),flip:!!S.flip,light:lt,a,nod:o.nod&&o.nod[k],gaze:o.gaze&&o.gaze[k],smile:o.smile&&o.smile[k],talk:o.talk&&o.talk[k]});}}
// the gift: ten thin strips of dried meat in a bundle, tied round the middle; (x, y) the middle of where it lies
function na_gift(ctx,x,y,s,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(-0.05);
  ag_floorShadow(ctx,-10,26,150,22,0.34);const R=ag_rnd(77);
  for(let row=0;row<2;row++)for(let i=0;i<5;i++){const yy=-18+i*9+row*3,xx=-118+row*10+(R()-0.5)*14,len=228+(R()-0.5)*22,col=mix([118,70,52],[150,96,70],R());
    const g=ctx.createLinearGradient(0,yy-5,0,yy+5);g.addColorStop(0,rgba(ag_lt(col,0.2),1));g.addColorStop(1,rgba(ag_dk(col,0.3),1));ctx.fillStyle=g;rr(ctx,xx,yy-4.5,len,9,4);ctx.fill();}
  ctx.strokeStyle=rgba([214,196,160],1);ctx.lineWidth=4;ctx.lineCap="round";for(const dx of [-4,4]){ctx.beginPath();ctx.moveTo(dx,-25);ctx.quadraticCurveTo(dx+6,2,dx,32);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(0,-25);ctx.quadraticCurveTo(-18,-44,-30,-32);ctx.moveTo(0,-25);ctx.quadraticCurveTo(16,-46,28,-36);ctx.stroke();ctx.restore();}
