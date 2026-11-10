/* ===== No secret to lose: the Bank of England, 1990 =====
   The Bank's long wall from the street, its vault behind a round door, and a back office with a screen of 1990: painted once each,
   in the same light as the City (ns_city.js). What moves or changes (the vault's door, the screen's lines) is drawn live, here too. */

/* ---------------------------------------------------------------- the Bank's wall, face on */
function ns_paintBankFront(c,w,h){const K=ns_cam(960,660,820,1.65),R=ns_rnd(71);
  ns_sky(c,w,690,{dawn:[1240,560,760],stops:[[0,[5,13,19]],[0.5,[18,38,47]],[0.85,[44,72,78]],[1,[74,96,96]]]});
  for(let i=0;i<60;i++){const x=R()*w,y=R()*240;c.fillStyle=`rgba(210,235,240,${0.06+R()*0.2})`;c.beginPath();c.arc(x,y,R()*1.1+0.3,0,TAU);c.fill();}
  // the street in front: the road, the far pavement under the wall, the near kerb
  let g=c.createLinearGradient(0,660,0,h);g.addColorStop(0,"rgb(30,50,56)");g.addColorStop(1,"rgb(8,16,19)");c.fillStyle=g;c.fillRect(0,650,w,h-650);
  const pv=K.p(0,0,32.5),pk=K.p(0,0,29.5);c.fillStyle="rgba(60,90,98,0.35)";c.fillRect(0,pv[1],w,pk[1]-pv[1]);c.fillStyle="rgba(170,210,220,0.25)";c.fillRect(0,pk[1],w,1.6);
  // the wall, long and windowless, with its columns; the upper storeys set back behind it
  ns_bankWall(c,K,34,-60,60,{h:10.5,back:8,hb:20,seed:13,step:7.2});
  // a soft first light along the wall's top
  g=c.createLinearGradient(0,400,0,560);g.addColorStop(0,"rgba(255,200,150,0.10)");g.addColorStop(1,"rgba(255,200,150,0)");c.fillStyle=g;c.fillRect(0,400,w,160);
  // bollards and a lamp on the near kerb
  for(const x of [-12,-4,4,12])ns_bollard(c,K,x,29.3);ns_lamp(c,K,-18,29.6,true);ns_lamp(c,K,18,29.6,true);
  // the near road, darker, with the lamps' light on it
  for(const x of [-18,18]){const q=K.p(x,0,29.6);c.save();c.translate(q[0],q[1]+120);c.scale(0.35,1.2);const rg=c.createRadialGradient(0,0,0,0,0,140);rg.addColorStop(0,"rgba(255,214,150,0.16)");rg.addColorStop(1,"rgba(255,214,150,0)");c.fillStyle=rg;c.fillRect(-140,-140,280,280);c.restore();}}

/* ---------------------------------------------------------------- the vault: a round doorway, the shelves behind it */
const NS_VAULT={cx:960,cy:500,r:300};
function ns_paintVault(c,w,h){const V=NS_VAULT,R=ns_rnd(83);
  // the antechamber: steel plates on the wall, riveted, in a cool overhead light
  let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgb(14,26,31)");g.addColorStop(0.6,"rgb(24,42,48)");g.addColorStop(1,"rgb(10,19,23)");c.fillStyle=g;c.fillRect(0,0,w,h);
  c.strokeStyle="rgba(150,190,200,0.10)";c.lineWidth=1.2;for(let x=0;x<w;x+=240){c.beginPath();c.moveTo(x,0);c.lineTo(x,860);c.stroke();}for(let y=120;y<860;y+=240){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
  c.fillStyle="rgba(190,225,232,0.16)";for(let x=0;x<w;x+=240)for(let y=120;y<860;y+=240)for(const [dx,dy] of [[12,12],[-12,12],[12,-12],[-12,-12]]){c.beginPath();c.arc(x+dx,y+dy,2.2,0,TAU);c.fill();}
  // the floor
  g=c.createLinearGradient(0,860,0,h);g.addColorStop(0,"rgb(26,42,46)");g.addColorStop(1,"rgb(8,15,18)");c.fillStyle=g;c.fillRect(0,860,w,h-860);c.fillStyle="rgba(170,210,220,0.18)";c.fillRect(0,860,w,1.4);
  // a lamp's pool of light on the wall above the door
  g=c.createRadialGradient(V.cx,120,10,V.cx,260,640);g.addColorStop(0,"rgba(200,232,236,0.20)");g.addColorStop(1,"rgba(200,232,236,0)");c.fillStyle=g;c.fillRect(0,0,w,860);
  // the doorway's heavy frame, a ring of steel
  c.save();c.beginPath();c.arc(V.cx,V.cy,V.r+56,0,TAU);g=c.createRadialGradient(V.cx-60,V.cy-80,40,V.cx,V.cy,V.r+60);g.addColorStop(0,"rgb(92,118,122)");g.addColorStop(1,"rgb(40,60,66)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(210,236,236,0.45)";c.lineWidth=2;c.beginPath();c.arc(V.cx,V.cy,V.r+56,Math.PI*1.05,Math.PI*1.75);c.stroke();c.restore();
  // inside: the vault, lit cool and even: shelves on both sides running back, each holding papers in sealed sleeves
  c.save();c.beginPath();c.arc(V.cx,V.cy,V.r,0,TAU);c.clip();
  g=c.createLinearGradient(0,V.cy-V.r,0,V.cy+V.r);g.addColorStop(0,"rgb(44,66,70)");g.addColorStop(1,"rgb(22,36,40)");c.fillStyle=g;c.fillRect(V.cx-V.r,V.cy-V.r,V.r*2,V.r*2);
  const K=ns_cam(V.cx,V.cy-30,520,1.6);
  // the back wall and the floor
  ns_frontQuad(c,K,22,-3.2,3.2,0,3.4);c.fillStyle="rgb(36,56,60)";c.fill();
  const f0=K.p(-3.2,0,22),f1=K.p(3.2,0,22),f2=K.p(3.2,0,1.6),f3=K.p(-3.2,0,1.6);c.beginPath();c.moveTo(f0[0],f0[1]);c.lineTo(f1[0],f1[1]);c.lineTo(f2[0],f2[1]);c.lineTo(f3[0],f3[1]);c.closePath();c.fillStyle="rgb(30,46,50)";c.fill();
  // the shelves: uprights and five shelves a side, the sleeves on them, pale, each with a small gold seal
  for(const X of [-3.2,3.2]){ns_wallQuad(c,K,X,1.6,22,0,3.4);c.fillStyle="rgb(28,44,48)";c.fill();
    for(let z=2;z<22;z+=2.2){const a=K.p(X,0,z),b=K.p(X,3.2,z);c.strokeStyle="rgba(150,180,186,0.55)";c.lineWidth=Math.max(1,6/z*3);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
    for(let u=0.35;u<3.2;u+=0.62){const a=K.p(X,u,1.6),b=K.p(X,u,22);c.strokeStyle="rgba(170,200,206,0.6)";c.lineWidth=2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
      for(let z=2.1;z<21.5;z+=0.36){if(R()<0.12)continue;const hh=0.32+R()*0.14;ns_wallQuad(c,K,X,z,z+0.26,u+0.02,u+hh);c.fillStyle=`rgb(${196+R()*24|0},${200+R()*20|0},${190+R()*16|0})`;c.globalAlpha=0.78;c.fill();c.globalAlpha=1;
        if(z<8&&R()<0.6){const s=K.p(X,u+hh*0.5,z+0.13);c.fillStyle="rgb(230,180,60)";c.beginPath();c.arc(s[0],s[1],Math.max(1.2,5/z),0,TAU);c.fill();}}}}
  // the lights overhead, a line of them going back
  for(let z=4;z<22;z+=4.5){const p=K.p(0,3.35,z),s2=Math.max(8,140/z);c.fillStyle="rgb(18,30,34)";c.fillRect(p[0]-s2,p[1]-s2*0.18-2,s2*2,s2*0.18+2);const lg=c.createRadialGradient(p[0],p[1]+s2*0.4,1,p[0],p[1]+s2*0.4,s2*3);lg.addColorStop(0,"rgba(230,246,246,0.35)");lg.addColorStop(1,"rgba(230,246,246,0)");c.fillStyle=lg;c.fillRect(p[0]-s2*3,p[1]-s2*3,s2*6,s2*6);c.fillStyle="rgba(236,248,248,0.95)";c.fillRect(p[0]-s2*0.9,p[1]-1,s2*1.8,Math.max(2,s2*0.12));}
  c.restore();
  // the ring's inner lip, catching the light
  c.strokeStyle="rgba(210,236,236,0.35)";c.lineWidth=3;c.beginPath();c.arc(V.cx,V.cy,V.r+2,Math.PI*1.1,Math.PI*1.9);c.stroke();}
// the vault's door, drawn live: u 0 wide open (swung towards us on its hinge at the right), 1 shut
function ns_vaultDoor(ctx,u){const V=NS_VAULT,a=(1-ns_easeIO(u))*1.45,hx=V.cx+V.r+30,cw=Math.cos(a),fx=hx-(V.r+30)*cw,rx=Math.max(6,(V.r+18)*cw),th=78*Math.sin(a)+18*cw;
  ctx.save();
  // its shadow on the wall beside the doorway, while it's open
  if(a>0.2){ctx.save();ctx.filter="blur(18px)";ctx.fillStyle=`rgba(4,10,12,${0.30*Math.sin(a)})`;ctx.beginPath();ctx.ellipse(hx+th*0.9,V.cy+30,th*0.8,V.r*0.8,0,0,TAU);ctx.fill();ctx.restore();}
  // the door's thickness: a band from its face to its back edge, towards the hinge
  ctx.fillStyle="rgb(58,80,84)";ctx.beginPath();ctx.ellipse(fx+th,V.cy,rx,V.r+18,0,-Math.PI/2,Math.PI/2);ctx.lineTo(fx,V.cy+V.r+18);ctx.ellipse(fx,V.cy,rx,V.r+18,0,Math.PI/2,-Math.PI/2,true);ctx.closePath();ctx.fill();
  ctx.save();ctx.clip();ctx.strokeStyle="rgba(20,34,38,0.5)";ctx.lineWidth=2;for(const k of [0.3,0.55,0.8]){ctx.beginPath();ctx.ellipse(fx+th*k,V.cy,rx,V.r+18,0,-Math.PI/2,Math.PI/2);ctx.stroke();}ctx.restore();
  // the face: brushed steel in rings, a wheel and its spokes, the bolts round the edge
  const g=ctx.createLinearGradient(fx-rx,0,fx+rx,0);g.addColorStop(0,"rgb(70,94,98)");g.addColorStop(0.45,"rgb(132,156,156)");g.addColorStop(1,"rgb(62,84,88)");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(fx,V.cy,rx,V.r+18,0,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(20,34,38,0.45)";ctx.lineWidth=2;for(const k of [0.82,0.6,0.22]){ctx.beginPath();ctx.ellipse(fx,V.cy,rx*k,(V.r+18)*k,0,0,TAU);ctx.stroke();}
  // the wheel that throws the bolts: a rim and three spokes with knobs, turning as the door shuts
  const spin=-Math.PI/2+u*2.4,wr=0.4;ctx.strokeStyle="rgb(40,58,62)";ctx.lineWidth=Math.max(2,12*cw);ctx.beginPath();ctx.ellipse(fx,V.cy,rx*wr,(V.r+18)*wr,0,0,TAU);ctx.stroke();ctx.lineWidth=Math.max(2,10*cw);
  for(let i=0;i<3;i++){const an=spin+i*TAU/3,ex=fx+Math.cos(an)*rx*(wr+0.1),ey=V.cy+Math.sin(an)*(V.r+18)*(wr+0.1);ctx.beginPath();ctx.moveTo(fx,V.cy);ctx.lineTo(ex,ey);ctx.stroke();ctx.fillStyle="rgb(150,172,172)";ctx.beginPath();ctx.ellipse(ex,ey,Math.max(3,14*cw),14,0,0,TAU);ctx.fill();}
  ctx.fillStyle="rgb(40,58,62)";ctx.beginPath();ctx.ellipse(fx,V.cy,Math.max(3,rx*0.1),34,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(210,236,236,0.55)";for(let i=0;i<16;i++){const an=i/16*TAU;ctx.beginPath();ctx.ellipse(fx+Math.cos(an)*rx*0.92,V.cy+Math.sin(an)*(V.r+18)*0.92,Math.max(1.5,7*cw),7,0,0,TAU);ctx.fill();}
  ctx.strokeStyle="rgba(220,240,240,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(fx,V.cy,rx,V.r+18,0,Math.PI*1.1,Math.PI*1.7);ctx.stroke();
  ctx.restore();}
function ns_easeIO(u){u=Math.max(0,Math.min(1,u));return u<0.5?2*u*u:1-Math.pow(-2*u+2,2)/2;}

/* ---------------------------------------------------------------- a back office of 1990: a screen on a desk */
// The screen's glass is drawn live (its lines change); the room around it is painted once. NS_SCREEN is the glass, in the frame.
const NS_SCREEN={x:520,y:170,w:1000,h:560};
function ns_paintOffice(c,w,h){const S=NS_SCREEN,R=ns_rnd(97);
  // the room: a dark wall, a window with its blind half down, the morning outside it faint
  let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgb(14,26,31)");g.addColorStop(1,"rgb(20,36,42)");c.fillStyle=g;c.fillRect(0,0,w,h);
  const wx=1620,wy=90,ww=240,wh=420;g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgb(40,64,72)");g.addColorStop(1,"rgb(70,92,94)");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.fillStyle="rgb(24,40,46)";for(let y=wy;y<wy+wh*0.55;y+=14)c.fillRect(wx,y,ww,9);c.strokeStyle="rgba(190,225,232,0.3)";c.lineWidth=3;c.strokeRect(wx,wy,ww,wh);
  // the desk's top and its front edge
  g=c.createLinearGradient(0,800,0,h);g.addColorStop(0,"rgb(52,40,32)");g.addColorStop(1,"rgb(24,18,15)");c.fillStyle=g;c.fillRect(0,800,w,h-800);c.fillStyle="rgba(255,214,150,0.18)";c.fillRect(0,800,w,2);
  // the terminal: a beige case round the glass, a deep back, a base; a keyboard in front
  const bx=S.x-70,by=S.y-60,bw=S.w+140,bh=S.h+150;g=c.createLinearGradient(bx,by,bx,by+bh);g.addColorStop(0,"rgb(150,146,128)");g.addColorStop(1,"rgb(104,100,88)");
  c.fillStyle=g;rr(c,bx,by,bw,bh,26);c.fill();c.strokeStyle="rgba(230,226,206,0.5)";c.lineWidth=2;rr(c,bx+2,by+2,bw-4,bh-4,24);c.stroke();
  c.fillStyle="rgb(18,20,18)";rr(c,S.x-18,S.y-18,S.w+36,S.h+36,30);c.fill();
  // its name plate and a power light
  c.fillStyle="rgba(60,58,50,0.9)";rr(c,bx+bw/2-80,by+bh-56,160,22,6);c.fill();c.fillStyle="rgb(236,226,200)";c.beginPath();c.arc(bx+bw-70,by+bh-45,6,0,TAU);c.fill();
  c.fillStyle="rgb(96,92,80)";c.beginPath();c.moveTo(bx+bw/2-220,by+bh);c.lineTo(bx+bw/2+220,by+bh);c.lineTo(bx+bw/2+260,808);c.lineTo(bx+bw/2-260,808);c.closePath();c.fill();
  // the room's light: the screen's glow on the wall round it, and a lamp's warm pool at the left
  g=c.createRadialGradient(S.x+S.w/2,S.y+S.h/2,S.w*0.3,S.x+S.w/2,S.y+S.h/2,S.w*0.95);g.addColorStop(0,"rgba(200,228,224,0.08)");g.addColorStop(1,"rgba(200,228,224,0)");c.fillStyle=g;c.fillRect(0,0,w,800);
  g=c.createRadialGradient(140,760,10,140,760,420);g.addColorStop(0,"rgba(255,206,140,0.26)");g.addColorStop(1,"rgba(255,206,140,0)");c.fillStyle=g;c.fillRect(0,340,600,740);
  c.fillStyle="rgb(18,26,26)";c.beginPath();c.moveTo(80,800);c.lineTo(200,800);c.lineTo(170,780);c.lineTo(110,780);c.closePath();c.fill();c.fillRect(136,560,8,220);
  c.save();c.translate(140,560);c.rotate(-0.25);c.beginPath();c.moveTo(-70,40);c.lineTo(-40,-20);c.lineTo(40,-20);c.lineTo(70,40);c.closePath();c.fillStyle="rgb(58,44,26)";c.fill();c.restore();}
// the screen's glass, drawn live under its lines: dark, a faint glow, curved at its edges (its letters are white: green means allowed in this module)
function ns_screenGlass(ctx,a){const S=NS_SCREEN;a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;rr(ctx,S.x,S.y,S.w,S.h,22);ctx.clip();
  const g=ctx.createRadialGradient(S.x+S.w/2,S.y+S.h/2,40,S.x+S.w/2,S.y+S.h/2,S.w*0.62);g.addColorStop(0,"rgb(16,24,24)");g.addColorStop(1,"rgb(5,8,9)");ctx.fillStyle=g;ctx.fillRect(S.x,S.y,S.w,S.h);
  const r=ctx.createLinearGradient(S.x,S.y,S.x+S.w*0.4,S.y+S.h*0.5);r.addColorStop(0,"rgba(200,240,220,0.06)");r.addColorStop(1,"rgba(200,240,220,0)");ctx.fillStyle=r;ctx.fillRect(S.x,S.y,S.w,S.h);ctx.restore();}
const NS_PHOSPHOR=[226,236,230];
