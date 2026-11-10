/* ===== People and groups: the 1970s =====
   The opening's places, painted once in the module's night light (Night glass's dark petrol, with warm windows and lamps): Moss on its
   fjord at dusk, the factory's workshop, a hotel corridor at night, a street with a café and a lamp, a hotel's front desk, and
   Atlanta's round glass tower at night. And the people of the story, dressed for the time, never as likenesses: Tor Sørnes, about
   fifty, in a shirt, tie and grey jacket, and a desk clerk in a brown blazer and tie. The corridor's geometry (PG_HALLWAY) places
   its doors, lamps and the lock of Room 312, at the corridor's end, so the scenes can draw on them. */

// the people of the 1970s: kept clear of the module's colours (cyan, green, coral, amber, violet)
const PG_SORNES={key:"pgSornes",name:"Tor Sørnes",skin:[230,192,164],hair:{style:"side",c:[118,108,98]},glasses:[64,58,52],
  top:{kind:"blazer",c:[104,108,110],inner:[228,230,226],tie:[72,60,64]},breath:0.26};
const PG_CLERK={key:"pgClerk",name:"the desk clerk",skin:[196,150,118],hair:{style:"cropped",c:[42,32,28]},
  top:{kind:"blazer",c:[104,72,58],inner:[232,226,212],tie:[58,52,66]},breath:0.3};
DP_PEOPLE.push([PG_SORNES,"lamp"],[PG_CLERK,"lamp"]);

/* ---------------------------------------------------------------- Moss, on its fjord, at dusk */
// the factory's buildings, its windows (x, y, w, h), and its chimney
const PG_FACTORY={hall:[420,1180,446],block:[1180,1500,356],quay:648,chimney:[960,226,36]};
function pg_factoryWindows(){const L=[],F=PG_FACTORY;for(let i=0;i<12;i++)L.push([F.hall[0]+38+i*62,520,30,62]);
  for(let r=0;r<3;r++)for(let i=0;i<5;i++)L.push([F.block[0]+34+i*58,404+r*76,30,46]);return L;}
AG_PLACES.pgFjord=c=>{const w=W,h=H,F=PG_FACTORY,R=ag_rnd(51),hz=F.quay;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(6,18,26)");g.addColorStop(0.5,"rgb(14,40,52)");g.addColorStop(0.82,"rgb(40,66,76)");g.addColorStop(1,"rgb(92,86,84)");
  c.fillStyle=g;c.fillRect(0,0,w,hz+40);
  for(let i=0;i<60;i++){const x=R()*w,y=R()*hz*0.5;c.fillStyle="rgba(210,240,240,"+(0.08+R()*0.3).toFixed(2)+")";c.beginPath();c.arc(x,y,0.6+R()*1.2,0,TAU);c.fill();}
  // the hills across the fjord, two layers, the far one hazy
  const hill=(y0,amp,col,seed)=>{const r=ag_rnd(seed);c.fillStyle=col;c.beginPath();c.moveTo(0,hz);let y=y0;for(let x=0;x<=w;x+=24){y+=(r()-0.5)*amp;y=lerp(y,y0,0.08);c.lineTo(x,y);}c.lineTo(w,hz);c.closePath();c.fill();};
  hill(hz-150,26,"rgb(26,48,58)",3);hill(hz-92,20,"rgb(16,34,42)",8);
  // the water: the sky's light near the shore, dark further down
  g=c.createLinearGradient(0,hz,0,h);g.addColorStop(0,"rgb(44,62,70)");g.addColorStop(0.18,"rgb(18,36,44)");g.addColorStop(1,"rgb(4,12,16)");c.fillStyle=g;c.fillRect(0,hz,w,h-hz);
  // the factory: a long brick hall with saw-tooth roofs, a taller block, a chimney; the sky's light along their tops
  const brick=(x0,y0,x1,y1)=>{const bg=c.createLinearGradient(x0,y0,x0,y1);bg.addColorStop(0,"rgb(74,44,38)");bg.addColorStop(1,"rgb(42,26,24)");c.fillStyle=bg;c.fillRect(x0,y0,x1-x0,y1-y0);
    c.strokeStyle="rgba(20,10,8,0.35)";c.lineWidth=1;for(let y=y0+14;y<y1;y+=14){c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();}};
  const [hx0,hx1,ht]=F.hall;brick(hx0,ht,hx1,hz);
  c.fillStyle="rgb(36,28,30)";c.beginPath();c.moveTo(hx0,ht);for(let i=0;i<6;i++){const a=hx0+i*(hx1-hx0)/6,b=a+(hx1-hx0)/6;c.lineTo(a,ht-64);c.lineTo(b,ht);}c.closePath();c.fill();
  c.strokeStyle="rgba(150,200,210,0.45)";c.lineWidth=2;c.beginPath();for(let i=0;i<6;i++){const a=hx0+i*(hx1-hx0)/6,b=a+(hx1-hx0)/6;c.moveTo(a,ht);c.lineTo(a,ht-64);c.lineTo(b,ht);}c.stroke();
  const [bx0,bx1,bt]=F.block;brick(bx0,bt,bx1,hz);c.fillStyle="rgb(34,26,28)";c.fillRect(bx0-8,bt-14,bx1-bx0+16,16);c.fillStyle="rgba(150,200,210,0.4)";c.fillRect(bx0-8,bt-14,bx1-bx0+16,2);
  const [cx,ct,cw]=F.chimney;brick(cx-cw/2,ct,cx+cw/2,ht);c.fillStyle="rgb(30,22,24)";c.fillRect(cx-cw/2-5,ct-10,cw+10,12);c.fillStyle="rgba(150,200,210,0.4)";c.fillRect(cx-cw/2-5,ct-10,cw+10,2);
  // the quay along the water
  c.fillStyle="rgb(30,36,40)";c.fillRect(300,hz-8,1360,24);c.fillStyle="rgba(150,200,210,0.25)";c.fillRect(300,hz-8,1360,2);
  // the windows, warm, each with its glow, and their light broken on the water
  for(const [x,y,ww,hh] of pg_factoryWindows()){c.fillStyle="rgb(255,204,132)";rr(c,x,y,ww,hh,ww/2);c.fill();
    c.fillStyle="rgba(120,70,30,0.5)";c.fillRect(x+ww/2-1,y+6,2,hh-6);c.fillRect(x,y+hh*0.55,ww,2);
    pg_glow(c,x+ww/2,y+hh/2,70,PG.warm,0.16);
    const ry=hz+14+(hz-y-hh)*0.5,rg=c.createLinearGradient(0,ry,0,ry+170);rg.addColorStop(0,"rgba(255,196,124,0.26)");rg.addColorStop(1,"rgba(255,196,124,0)");c.fillStyle=rg;c.fillRect(x-2,ry,ww+4,170);
    for(let k=0;k<6;k++){const yy=ry+8+k*24+R()*8,len=ww*(0.7+R()*0.8);c.fillStyle="rgba(255,214,150,"+(0.22*(1-k/6)).toFixed(3)+")";c.fillRect(x+ww/2-len/2+(R()-0.5)*8,yy,len,2);}}
  // the sky's dusk in the water, and a lamp on the quay
  for(let k=0;k<40;k++){const y=hz+30+R()*(h-hz-60),x=R()*w,len=60+R()*220;c.fillStyle="rgba(120,170,180,"+(0.03+R()*0.05).toFixed(3)+")";c.fillRect(x,y,len,2);}
  c.fillStyle="rgb(24,28,30)";c.fillRect(1590,hz-130,6,124);pg_glow(c,1593,hz-134,90,PG.warm,0.35);c.fillStyle="rgb(255,226,178)";c.beginPath();c.arc(1593,hz-134,7,0,TAU);c.fill();
  // the water, softened: its streaks and reflections blurred a little, as moving water blurs them
  dp_blurDraw(c,c.canvas,0,hz+12,w,h-hz-12,0,hz+12,w,h-hz-12,3.2);
  // mist along the water
  g=c.createLinearGradient(0,hz-60,0,hz+70);g.addColorStop(0,"rgba(120,160,170,0)");g.addColorStop(0.6,"rgba(120,160,170,0.12)");g.addColorStop(1,"rgba(120,160,170,0)");c.fillStyle=g;c.fillRect(0,hz-60,w,130);};

/* ---------------------------------------------------------------- the workshop: a bench under a lamp, a window on the fjord */
const PG_BENCH=770;   // the bench's back edge: Sørnes stands behind it, hidden below it
AG_PLACES.pgWorkshop=c=>{const w=W,h=H,R=ag_rnd(17);
  let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgb(16,24,28)");g.addColorStop(1,"rgb(28,30,30)");c.fillStyle=g;c.fillRect(0,0,w,h);
  // the window on the left: small panes, the fjord at dusk outside
  const wx=120,wy=150,ww=560,wh=420;g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgb(14,40,54)");g.addColorStop(0.7,"rgb(44,70,80)");g.addColorStop(1,"rgb(26,44,52)");
  c.fillStyle=g;c.fillRect(wx,wy,ww,wh);c.fillStyle="rgb(18,32,40)";c.beginPath();c.moveTo(wx,wy+wh*0.62);for(let x=0;x<=ww;x+=20)c.lineTo(wx+x,wy+wh*0.62-14*Math.sin(x/90)-R()*6);c.lineTo(wx+ww,wy+wh);c.lineTo(wx,wy+wh);c.fill();
  for(let i=0;i<5;i++)c.fillStyle="rgba(255,200,130,0.6)",c.fillRect(wx+60+i*90,wy+wh*0.6+4,10,6);
  c.strokeStyle="rgb(40,34,30)";c.lineWidth=12;c.strokeRect(wx,wy,ww,wh);c.lineWidth=6;for(let i=1;i<4;i++){c.beginPath();c.moveTo(wx+ww*i/4,wy);c.lineTo(wx+ww*i/4,wy+wh);c.stroke();}
  for(let j=1;j<3;j++){c.beginPath();c.moveTo(wx,wy+wh*j/3);c.lineTo(wx+ww,wy+wh*j/3);c.stroke();}
  c.fillStyle="rgba(150,210,220,0.12)";c.fillRect(wx,wy,ww,3);
  // a pegboard of tools on the right, in the lamp's edge
  c.fillStyle="rgb(40,36,32)";c.fillRect(1240,170,560,400);c.fillStyle="rgba(0,0,0,0.25)";for(let y=190;y<560;y+=24)for(let x=1260;x<1790;x+=24){c.beginPath();c.arc(x,y,2,0,TAU);c.fill();}
  c.strokeStyle="rgb(96,100,102)";c.lineCap="round";c.lineWidth=10;
  for(const [x,y,l] of [[1300,220,170],[1360,230,140],[1430,210,200],[1660,220,160],[1720,230,130]]){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+l);c.stroke();c.beginPath();c.arc(x,y+l+14,16,0,TAU);c.stroke();}
  c.lineWidth=6;for(const [x,y] of [[1510,230],[1560,240],[1610,226]]){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+200);c.stroke();}
  // the lamp: an enamel shade on a cord, its warm cone on the bench
  c.strokeStyle="rgb(20,20,20)";c.lineWidth=3;c.beginPath();c.moveTo(1010,0);c.lineTo(1010,96);c.stroke();
  c.fillStyle="rgb(40,54,52)";c.beginPath();c.moveTo(930,170);c.quadraticCurveTo(1010,80,1090,170);c.closePath();c.fill();c.fillStyle="rgb(255,236,190)";c.beginPath();c.ellipse(1010,170,80,12,0,0,TAU);c.fill();
  {const [bc,bx]=ag_buf("pgCone",480,270);bx.scale(0.25,0.25);const cg=bx.createLinearGradient(0,172,0,PG_BENCH+60);cg.addColorStop(0,"rgba(255,214,150,0.20)");cg.addColorStop(0.6,"rgba(255,214,150,0.08)");cg.addColorStop(1,"rgba(255,214,150,0.03)");
    bx.fillStyle=cg;bx.beginPath();bx.moveTo(950,172);bx.lineTo(1070,172);bx.lineTo(1440,PG_BENCH+60);bx.lineTo(580,PG_BENCH+60);bx.closePath();bx.fill();
    c.save();c.globalCompositeOperation="lighter";dp_blurDraw(c,bc,0,0,480,270,0,0,W,H,26);c.restore();}
  pg_glow(c,1010,180,520,PG.warm,0.14);
  // the bench: an oiled top in the lamp's light, its front in shadow
  g=c.createLinearGradient(0,PG_BENCH,0,PG_BENCH+64);g.addColorStop(0,"rgb(124,86,54)");g.addColorStop(1,"rgb(96,64,40)");c.fillStyle=g;c.fillRect(0,PG_BENCH,w,64);
  c.save();c.globalCompositeOperation="lighter";const bg=c.createRadialGradient(1010,PG_BENCH+30,10,1010,PG_BENCH+30,620);bg.addColorStop(0,"rgba(255,200,130,0.28)");bg.addColorStop(1,"rgba(255,200,130,0)");c.fillStyle=bg;c.fillRect(0,PG_BENCH,w,64);c.restore();
  c.fillStyle="rgba(255,230,180,0.3)";c.fillRect(0,PG_BENCH,w,2);
  g=c.createLinearGradient(0,PG_BENCH+64,0,h);g.addColorStop(0,"rgb(50,34,24)");g.addColorStop(1,"rgb(22,16,12)");c.fillStyle=g;c.fillRect(0,PG_BENCH+64,w,h-PG_BENCH-64);
  c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=2;for(let x=200;x<w;x+=420){c.beginPath();c.moveTo(x,PG_BENCH+64);c.lineTo(x,h);c.stroke();}
  // on the bench: lock cases, coil springs and a pair of ice skates
  const box=(x,y,bw,bh)=>{pg_shadow(c,x+bw/2,y+bh,bw*0.6,8,0.5);const mg=c.createLinearGradient(x,y,x+bw,y+bh);mg.addColorStop(0,"rgb(196,198,190)");mg.addColorStop(1,"rgb(110,112,108)");
    c.fillStyle=mg;c.fillRect(x,y,bw,bh);c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(x,y,bw,2);c.fillStyle="rgb(40,40,40)";c.beginPath();c.arc(x+bw*0.7,y+bh*0.5,4,0,TAU);c.fill();c.fillRect(x+bw*0.7-1.5,y+bh*0.5,3,8);};
  box(1150,PG_BENCH-30,96,46);box(1262,PG_BENCH-24,80,38);box(1110,PG_BENCH+6,70,32);
  c.strokeStyle="rgb(170,172,168)";c.lineWidth=2;for(const [sx,sy] of [[1400,PG_BENCH+10],[1440,PG_BENCH+18]]){c.beginPath();for(let i=0;i<=60;i++){const u=i/60;c.lineTo(sx+u*44,sy-9*Math.sin(u*TAU*5));}c.stroke();}
  // the skates: two leather boots on their blades, side by side
  const skate=(x,y,k)=>{c.save();c.translate(x,y);c.scale(k,k);pg_shadow(c,60,8,110,10,0.5);c.fillStyle="rgb(36,30,28)";c.beginPath();c.moveTo(0,0);c.lineTo(10,-70);c.lineTo(60,-80);c.lineTo(70,-34);
    c.quadraticCurveTo(120,-30,124,-6);c.lineTo(124,0);c.closePath();c.fill();c.strokeStyle="rgba(210,190,160,0.35)";c.lineWidth=2;c.stroke();
    c.strokeStyle="rgb(190,196,198)";c.lineWidth=4;c.beginPath();c.moveTo(-12,8);c.lineTo(130,8);c.quadraticCurveTo(146,8,140,-4);c.stroke();c.lineWidth=3;c.beginPath();c.moveTo(14,8);c.lineTo(14,0);c.moveTo(104,8);c.lineTo(104,0);c.stroke();c.restore();};
  skate(1560,PG_BENCH+20,0.95);skate(1640,PG_BENCH+34,1.0);};
// a lock case, held up: small and steel, its keyhole, gripped at its lower corner; in figure space at the hand
function pg_heldCase(c,h){const [x,y]=h.near;c.save();c.translate(x+62,y-34);c.rotate(-0.1);const mg=c.createLinearGradient(-60,-40,60,40);mg.addColorStop(0,"rgb(214,214,206)");mg.addColorStop(1,"rgb(112,114,110)");
  c.fillStyle=mg;rr(c,-62,-44,124,88,6);c.fill();c.strokeStyle="rgba(40,40,40,0.6)";c.lineWidth=2;c.stroke();c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(-58,-42,116,3);
  c.fillStyle="rgb(30,30,30)";c.beginPath();c.arc(26,-4,7,0,TAU);c.fill();c.fillRect(23,-2,6,16);c.fillStyle="rgb(170,150,96)";c.fillRect(-46,-30,30,60);c.restore();}
// a punched card, held up in the near hand: the hand at its lower corner (a, 0 to 1, as it's handed on)
function pg_heldCard(c,h,seed,a){const [x,y]=h.near;pg_punch(c,x-14,y-120,200,{seed:seed||5,rot:-0.06,shadow:false,a:a==null?1:a});}
// the bench or the counter again, over whoever stands behind it, so an arm that holds something goes behind it
function pg_front(ctx,place,y){ctx.drawImage(ag_place(place),0,y,W,H-y,0,y,W,H-y);}

/* ---------------------------------------------------------------- a hotel corridor at night: Room 312 at its end */
// one-point perspective: the corridor 2 wide (x -1 to 1), its floor at y -1 and its ceiling at 1.4, the camera at depth 0 looking in;
// depth z puts a point at 960 + 960 x / z across and 470 - 960 y / z down. Room 312's door is the end wall, at depth 4
const PG_HALLWAY={vx:960,vy:470,f:960,end:4};
function pg_hp(x,y,z){const P=PG_HALLWAY;return[P.vx+P.f*x/z,P.vy-P.f*y/z];}
const PG_DOOR={x0:pg_hp(-0.4,0,4)[0],x1:pg_hp(0.4,0,4)[0],y0:pg_hp(0,0.92,4)[1],y1:pg_hp(0,-1,4)[1]};   // the end door: 864 to 1056, 249 to 710
const PG_LOCK=[pg_hp(0.27,-0.08,4)[0],pg_hp(0.27,-0.08,4)[1]];                                      // its lock, at the handle's side
AG_PLACES.pgCorridor=c=>{const P=PG_HALLWAY,R=ag_rnd(9),Z=P.end,q=(x,y,z)=>pg_hp(x,y,z);
  c.fillStyle="rgb(10,14,16)";c.fillRect(0,0,W,H);
  const quad=(a,b,cc,d,fill)=>{c.fillStyle=fill;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(cc[0],cc[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill();};
  // walls, floor and ceiling, from near (depth 0.8) to the end wall
  const zn=0.8;let g=c.createLinearGradient(0,0,P.vx,0);g.addColorStop(0,"rgb(46,34,30)");g.addColorStop(1,"rgb(26,22,22)");
  quad(q(-1,1.4,zn),q(-1,1.4,Z),q(-1,-1,Z),q(-1,-1,zn),g);
  g=c.createLinearGradient(W,0,P.vx,0);g.addColorStop(0,"rgb(46,34,30)");g.addColorStop(1,"rgb(26,22,22)");quad(q(1,1.4,zn),q(1,1.4,Z),q(1,-1,Z),q(1,-1,zn),g);
  g=c.createLinearGradient(0,0,0,P.vy);g.addColorStop(0,"rgb(22,24,26)");g.addColorStop(1,"rgb(32,30,28)");quad(q(-1,1.4,zn),q(1,1.4,zn),q(1,1.4,Z),q(-1,1.4,Z),g);
  g=c.createLinearGradient(0,P.vy,0,H);g.addColorStop(0,"rgb(40,24,24)");g.addColorStop(1,"rgb(26,14,16)");quad(q(-1,-1,zn),q(1,-1,zn),q(1,-1,Z),q(-1,-1,Z),g);
  // the wainscot along both walls, and the wallpaper's stripes
  for(const sx of [-1,1]){quad(q(sx,-0.25,zn),q(sx,-0.25,Z),q(sx,-1,Z),q(sx,-1,zn),"rgba(20,12,10,0.55)");
    c.strokeStyle="rgba(255,210,160,0.14)";c.lineWidth=2;const a=q(sx,-0.25,zn),b=q(sx,-0.25,Z);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
    c.strokeStyle="rgba(255,220,180,0.05)";c.lineWidth=1.5;for(let z=1.0;z<Z;z+=0.07){const t0=q(sx,1.4,z),t1=q(sx,-0.25,z);c.beginPath();c.moveTo(t0[0],t0[1]);c.lineTo(t1[0],t1[1]);c.stroke();}}
  // the carpet runner, with its border lines and a pattern across it
  quad(q(-0.62,-1,zn),q(0.62,-1,zn),q(0.62,-1,Z),q(-0.62,-1,Z),"rgb(70,30,30)");
  c.strokeStyle="rgba(230,180,120,0.25)";c.lineWidth=3;for(const sx of [-0.55,0.55]){const a=q(sx,-1,zn),b=q(sx,-1,Z);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  c.lineWidth=1.5;for(let z=1;z<Z;z+=0.12){const a=q(-0.5,-1,z),b=q(0.5,-1,z);c.strokeStyle="rgba(230,180,120,"+(0.10*Math.min(1,1.6/z)).toFixed(3)+")";c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  // doors along the walls, each in its frame, its number plate a small gleam
  for(const sx of [-1,1])for(const [z0,z1] of [[1.15,1.6],[2.05,2.4],[2.85,3.1]]){const fr=0.05;
    quad(q(sx,0.98,z0-fr),q(sx,0.98,z1+fr),q(sx,-1,z1+fr),q(sx,-1,z0-fr),"rgb(70,52,40)");
    g=c.createLinearGradient(q(sx,0,z0)[0],0,q(sx,0,z1)[0],0);g.addColorStop(0,"rgb(92,62,42)");g.addColorStop(1,"rgb(62,42,30)");quad(q(sx,0.92,z0),q(sx,0.92,z1),q(sx,-1,z1),q(sx,-1,z0),g);
    const pl=q(sx,0.62,(z0*0.6+z1*0.4));c.fillStyle="rgba(230,190,110,0.75)";c.fillRect(pl[0]-12/z0*1.6,pl[1]-4/z0*1.6,24/z0*1.6,8/z0*1.6);
    const kn=q(sx,-0.05,z0+0.06*(z1-z0));c.fillStyle="rgba(230,190,110,0.85)";c.beginPath();c.arc(kn[0],kn[1],5/z0*1.8,0,TAU);c.fill();}
  // the end wall, and Room 312's door in it
  const ew=[q(-1,1.4,Z),q(1,1.4,Z),q(1,-1,Z),q(-1,-1,Z)];quad(ew[0],ew[1],ew[2],ew[3],"rgb(40,30,28)");
  const D=PG_DOOR;c.fillStyle="rgb(66,48,36)";c.fillRect(D.x0-14,D.y0-14,D.x1-D.x0+28,D.y1-D.y0+14);
  g=c.createLinearGradient(D.x0,0,D.x1,0);g.addColorStop(0,"rgb(104,70,46)");g.addColorStop(1,"rgb(78,52,36)");c.fillStyle=g;c.fillRect(D.x0,D.y0,D.x1-D.x0,D.y1-D.y0);
  c.strokeStyle="rgba(30,18,12,0.6)";c.lineWidth=3;c.strokeRect(D.x0+20,D.y0+30,D.x1-D.x0-40,(D.y1-D.y0)*0.38);c.strokeRect(D.x0+20,D.y0+40+(D.y1-D.y0)*0.4,D.x1-D.x0-40,(D.y1-D.y0)*0.48);
  c.fillStyle="rgba(255,230,190,0.12)";c.fillRect(D.x0,D.y0,D.x1-D.x0,3);
  // the lamps on the ceiling, and their pools on the carpet
  for(const z of [1.5,2.5,3.5]){const a=q(-0.18,1.4,z),b=q(0.18,1.4,z);c.fillStyle="rgb(255,226,178)";c.fillRect(a[0],a[1]-3/z,b[0]-a[0],7/z*1.6);
    pg_glow(c,(a[0]+b[0])/2,a[1],260/z,PG.warm,0.22);const fl=q(0,-1,z);c.save();c.translate(fl[0],fl[1]);c.scale(1,0.3);pg_glow(c,0,0,520/z,PG.warm,0.2);c.restore();}
  // a haze of warm light in the corridor's far end
  pg_glow(c,P.vx,P.vy+60,420,[200,150,110],0.07);};
// the key, in Room 312's lock: its bow, and the fob hanging under it; x, y the lock, s its size
// its brass plate and keyhole, at the handle's side (x, y the lock, s its size)
function pg_escutcheon(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgb(196,160,92)";ctx.beginPath();ctx.ellipse(0,0,16,30,0,0,TAU);ctx.fill();ctx.fillStyle="rgb(40,26,12)";ctx.beginPath();ctx.arc(0,-6,4,0,TAU);ctx.fill();ctx.fillRect(-2,-6,4,14);ctx.restore();}
function pg_keyInLock(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  if(o.rimA>0)pg_glow(ctx,0,40,150,dp_f(o.rim||"coral"),0.45*o.rimA);
  ctx.strokeStyle="rgb(214,174,96)";ctx.lineWidth=7;ctx.beginPath();ctx.ellipse(0,-14,13,22,0,0,TAU);ctx.stroke();
  pg_key(ctx,0,128,1,{rot:Math.PI/2+0.05,num:o.num||"312",rim:o.rim,rimA:o.rimA,shadow:false,deco:o.deco,fob:true});ctx.restore();}
// the light under Room 312's door: warm while the guest is up, a night lamp's once they sleep (u 0 to 1)
function pg_doorLight(ctx,u){const D=PG_DOOR,k=lerp(1,0.25,clamp(u||0,0,1));ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba(PG.warm,0.85*k);ctx.fillRect(D.x0+4,D.y1-5,D.x1-D.x0-8,5);
  const g=ctx.createLinearGradient(0,D.y1,0,D.y1+90);g.addColorStop(0,rgba(PG.warm,0.32*k));g.addColorStop(1,rgba(PG.warm,0));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(D.x0,D.y1);ctx.lineTo(D.x1,D.y1);ctx.lineTo(D.x1+70,D.y1+90);ctx.lineTo(D.x0-70,D.y1+90);ctx.closePath();ctx.fill();ctx.restore();}
// the door's number plate, small, and its card lock of 1978: a slot plate, lit green when a card opens it
function pg_plate(ctx){const D=PG_DOOR,cx=(D.x0+D.x1)/2;ctx.fillStyle="rgb(220,184,110)";rr(ctx,cx-30,D.y0+60,60,30,5);ctx.fill();dp_T(ctx,"312",cx,D.y0+84,{w:800,size:22,col:PG.brassInk,align:"center",deco:1});}
// the card locks of 1978 on the corridor's side doors, beside each knob, lit green one by one from the nearest (u 0 to 1)
function pg_sideLocks(ctx,u){let k=0;for(const [z0,z1] of [[1.15,1.6],[2.05,2.4],[2.85,3.1]])for(const sx of [-1,1]){const zz=z0+0.14*(z1-z0),p=pg_hp(sx,0.06,zz),s=1.7/zz,a=clamp(u*6.5-k,0,1);k++;
  ctx.fillStyle="rgb(170,172,166)";rr(ctx,p[0]-7*s,p[1]-20*s,14*s,40*s,3*s);ctx.fill();ctx.fillStyle="rgb(30,30,30)";ctx.fillRect(p[0]-1.2*s,p[1]-15*s,2.4*s,18*s);
  if(a>0){const c=dp_f("green");ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(p[0],p[1]+11*s,3.2*s,0,TAU);ctx.fill();pg_glow(ctx,p[0],p[1]+11*s,20*s,c,0.7);ctx.restore();}}}
function pg_cardLock(ctx,u,ok){const [x,y]=PG_LOCK;ctx.save();ctx.fillStyle="rgb(170,172,166)";rr(ctx,x-16,y-44,32,88,6);ctx.fill();ctx.fillStyle="rgb(30,30,30)";ctx.fillRect(x-2,y-34,4,40);
  if(u>0){const c=dp_f(ok?"green":"coral");ctx.globalAlpha*=clamp(u,0,1);ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x,y+26,5,0,TAU);ctx.fill();pg_glow(ctx,x,y+26,28,c,0.6);}ctx.restore();}

/* ---------------------------------------------------------------- a street at night: a café's table, a lamp on the pavement */
AG_PLACES.pgStreet=c=>{const R=ag_rnd(33);let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(6,16,22)");g.addColorStop(1,"rgb(12,24,28)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the houses across the street, a few windows lit
  c.fillStyle="rgb(16,26,32)";for(const [x,y,w] of [[760,200,300],[1080,150,260],[1360,240,320],[1700,180,240]])c.fillRect(x,y,w,560-y);
  for(let i=0;i<34;i++){const x=780+R()*1140,y=230+R()*300;if(R()<0.55)continue;c.fillStyle="rgba(255,206,140,"+(0.25+R()*0.4).toFixed(2)+")";c.fillRect(x,y,18,26);}
  // the road and the pavement, wet
  g=c.createLinearGradient(0,560,0,700);g.addColorStop(0,"rgb(20,30,34)");g.addColorStop(1,"rgb(14,22,26)");c.fillStyle=g;c.fillRect(0,560,W,140);
  c.fillStyle="rgb(44,52,54)";c.fillRect(0,700,W,12);g=c.createLinearGradient(0,712,0,H);g.addColorStop(0,"rgb(34,42,46)");g.addColorStop(1,"rgb(18,24,26)");c.fillStyle=g;c.fillRect(0,712,W,H-712);
  c.strokeStyle="rgba(0,0,0,0.25)";c.lineWidth=2;for(let x=-200;x<W+200;x+=180){c.beginPath();c.moveTo(x,712);c.lineTo(x-140,H);c.stroke();}for(const y of [790,900,1030]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the café on the left: its lit window and a round table outside it
  c.fillStyle="rgb(26,22,22)";c.fillRect(0,120,720,592);g=c.createLinearGradient(0,220,0,600);g.addColorStop(0,"rgb(255,214,150)");g.addColorStop(1,"rgb(214,150,90)");c.fillStyle=g;c.fillRect(60,230,560,360);
  c.fillStyle="rgba(40,26,20,0.75)";c.fillRect(60,410,560,8);for(const x of [240,430])c.fillRect(x,230,8,360);
  for(const [x,y] of [[150,300],[340,290],[530,305]]){pg_glow(c,x,y,60,[255,240,200],0.5);c.fillStyle="rgb(255,244,214)";c.beginPath();c.arc(x,y,9,0,TAU);c.fill();}
  c.fillStyle="rgba(110,60,34,0.45)";c.fillRect(60,520,560,70);for(const x of [120,300,480])c.fillRect(x,470,70,50);
  pg_glow(c,340,420,520,PG.warm,0.2);c.save();c.translate(340,760);c.scale(1,0.25);pg_glow(c,0,0,560,PG.warm,0.26);c.restore();
  c.fillStyle="rgb(30,22,20)";c.fillRect(0,120,720,40);c.fillStyle="rgba(255,220,170,0.2)";c.fillRect(0,158,720,2);
  // the table: a round top on one leg, seen a little from above
  c.fillStyle="rgb(36,32,30)";c.fillRect(424,712,12,120);c.fillRect(380,828,100,10);
  c.fillStyle="rgb(70,62,56)";c.beginPath();c.ellipse(430,712,160,38,0,0,TAU);c.fill();c.fillStyle="rgba(255,220,170,0.35)";c.beginPath();c.ellipse(430,706,160,32,0,Math.PI,TAU);c.fill();
  c.strokeStyle="rgba(255,226,180,0.45)";c.lineWidth=2;c.beginPath();c.ellipse(430,712,160,38,0,Math.PI*1.05,TAU-0.05);c.stroke();
  // the street lamp on the right, and its pool of light on the pavement
  c.fillStyle="rgb(22,28,30)";c.fillRect(1494,150,10,700);c.fillRect(1470,846,58,10);c.beginPath();c.moveTo(1460,150);c.lineTo(1540,150);c.lineTo(1520,110);c.lineTo(1480,110);c.closePath();c.fill();
  c.fillStyle="rgb(255,232,190)";c.fillRect(1470,150,60,10);pg_glow(c,1500,160,300,PG.lamp,0.32);
  c.save();c.translate(1380,850);c.scale(1,0.3);pg_glow(c,0,0,520,PG.lamp,0.42);c.restore();
  // the wet road's reflections
  for(let i=0;i<24;i++){const x=R()*W,y=580+R()*110;c.fillStyle="rgba(255,206,140,"+(0.04+R()*0.08).toFixed(3)+")";c.fillRect(x,y,4,20+R()*40);}};

/* ---------------------------------------------------------------- a hotel's front desk, 1978: pigeonholes of keys, a counter, a lamp */
const PG_COUNTER=726;   // the counter's back edge: the clerk stands behind it
AG_PLACES.pgDesk=c=>{const R=ag_rnd(21);let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(24,20,18)");g.addColorStop(1,"rgb(36,28,24)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // wood panels on the wall
  for(let x=0;x<W;x+=240){g=c.createLinearGradient(x,0,x+240,0);g.addColorStop(0,"rgb(58,40,30)");g.addColorStop(1,"rgb(44,30,22)");c.fillStyle=g;c.fillRect(x+6,60,228,PG_COUNTER-60);}
  // the pigeonholes behind the desk, a key in many of them
  const px=90,py=150,cw=78,ch=74;c.fillStyle="rgb(30,22,18)";c.fillRect(px-10,py-10,cw*8+20,ch*5+20);
  for(let j=0;j<5;j++)for(let i=0;i<8;i++){const x=px+i*cw,y=py+j*ch;c.fillStyle="rgb(20,14,12)";c.fillRect(x+4,y+4,cw-8,ch-8);
    if(R()<0.6){c.strokeStyle="rgb(200,160,90)";c.lineWidth=3;c.beginPath();c.moveTo(x+cw/2,y+12);c.lineTo(x+cw/2,y+30);c.stroke();c.fillStyle="rgb(206,166,92)";rr(c,x+cw/2-9,y+30,18,30,5);c.fill();}
    c.fillStyle="rgba(230,200,140,0.35)";c.fillRect(x+10,y+ch-14,20,4);}
  // the lamp on the counter, warm on the wall and the counter's top
  pg_glow(c,1700,520,620,PG.warm,0.22);c.fillStyle="rgb(40,60,56)";c.beginPath();c.moveTo(1640,560);c.lineTo(1760,560);c.lineTo(1730,490);c.lineTo(1670,490);c.closePath();c.fill();
  c.fillStyle="rgb(30,26,22)";c.fillRect(1696,560,8,PG_COUNTER-560);c.fillStyle="rgb(255,232,190)";c.fillRect(1650,556,100,6);
  // a clock on the wall
  c.fillStyle="rgb(220,210,190)";c.beginPath();c.arc(1100,250,56,0,TAU);c.fill();c.strokeStyle="rgb(60,44,32)";c.lineWidth=6;c.stroke();c.lineWidth=4;c.beginPath();c.moveTo(1100,250);c.lineTo(1100,212);c.moveTo(1100,250);c.lineTo(1128,262);c.stroke();
  // the counter: its top, lit, and its panelled front
  g=c.createLinearGradient(0,PG_COUNTER,0,PG_COUNTER+40);g.addColorStop(0,"rgb(132,94,62)");g.addColorStop(1,"rgb(96,66,44)");c.fillStyle=g;c.fillRect(0,PG_COUNTER,W,40);c.fillStyle="rgba(255,230,180,0.35)";c.fillRect(0,PG_COUNTER,W,2);
  g=c.createLinearGradient(0,PG_COUNTER+40,0,H);g.addColorStop(0,"rgb(62,42,30)");g.addColorStop(1,"rgb(28,18,14)");c.fillStyle=g;c.fillRect(0,PG_COUNTER+40,W,H-PG_COUNTER-40);
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=3;for(let x=40;x<W;x+=320)c.strokeRect(x,PG_COUNTER+80,280,220);
  // a bell on the counter
  c.fillStyle="rgb(200,170,100)";c.beginPath();c.ellipse(1520,PG_COUNTER+6,30,8,0,0,TAU);c.fill();c.beginPath();c.arc(1520,PG_COUNTER,24,Math.PI,TAU);c.fill();c.fillStyle="rgba(255,240,200,0.5)";c.beginPath();c.arc(1512,PG_COUNTER-10,6,0,TAU);c.fill();};

/* ---------------------------------------------------------------- Atlanta, 1978: a round glass tower at night */
const PG_TOWER={x:980,r:150,top:150,floors:46,fy0:236,fh:15};
AG_PLACES.pgAtlanta=c=>{const R=ag_rnd(77),T=PG_TOWER;let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(4,12,22)");g.addColorStop(0.7,"rgb(16,32,44)");g.addColorStop(1,"rgb(54,50,50)");c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){c.fillStyle="rgba(210,236,240,"+(0.06+R()*0.25).toFixed(2)+")";c.beginPath();c.arc(R()*W,R()*520,0.6+R()*1.1,0,TAU);c.fill();}
  // the city's lower buildings, their windows here and there
  const bl=(x,y,w,col)=>{c.fillStyle=col;c.fillRect(x,y,w,H-y);for(let yy=y+20;yy<H-20;yy+=26)for(let xx=x+12;xx<x+w-14;xx+=22)if(R()<0.22){c.fillStyle="rgba(255,206,140,"+(0.2+R()*0.4).toFixed(2)+")";c.fillRect(xx,yy,9,12);c.fillStyle=col;}};
  for(const [x,y,w] of [[0,640,260],[230,560,220],[480,700,200],[1260,600,240],[1500,520,190],[1690,660,240]])bl(x,y,w,"rgb(14,22,30)");
  for(const [x,y,w] of [[90,760,280],[640,780,220],[1380,760,260],[1640,800,280]])bl(x,y,w,"rgb(10,16,22)");
  // the tower: a glass cylinder, dark bands of glass between thin lines of its floors, lit down one side by the city's glow
  const x0=T.x-T.r,x1=T.x+T.r;g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"rgb(14,30,40)");g.addColorStop(0.35,"rgb(40,64,74)");g.addColorStop(0.6,"rgb(22,40,50)");g.addColorStop(1,"rgb(8,18,24)");
  c.fillStyle=g;c.fillRect(x0,T.top+60,2*T.r,H-T.top-60);
  c.strokeStyle="rgba(150,200,210,0.16)";c.lineWidth=1.4;for(let k=0;k<T.floors+8;k++){const y=T.fy0+k*T.fh;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();}
  for(let k=1;k<12;k++){const u=k/12,x=T.x-T.r*Math.cos(u*Math.PI);c.strokeStyle="rgba(150,200,210,"+(0.05+0.06*Math.sin(u*Math.PI)).toFixed(3)+")";c.beginPath();c.moveTo(x,T.top+60);c.lineTo(x,H);c.stroke();}
  // its top: a wider ring, as its restaurant is, and a light
  c.fillStyle="rgb(20,36,46)";rr(c,x0-26,T.top,2*T.r+52,64,14);c.fill();c.fillStyle="rgba(150,200,210,0.3)";c.fillRect(x0-20,T.top+2,2*T.r+40,2);
  c.fillStyle="rgba(255,214,160,0.55)";for(let i=0;i<14;i++)c.fillRect(x0-10+i*24,T.top+26,12,14);
  c.fillStyle="rgb(255,120,100)";c.beginPath();c.arc(T.x,T.top-30,4,0,TAU);c.fill();c.fillStyle="rgb(30,40,46)";c.fillRect(T.x-2,T.top-28,4,28);
  // the city's glow low in the sky, and haze
  g=c.createLinearGradient(0,560,0,H);g.addColorStop(0,"rgba(255,170,110,0)");g.addColorStop(1,"rgba(255,170,110,0.10)");c.fillStyle=g;c.fillRect(0,560,W,H-560);};
// the tower's floors lit, from the ground up (u 0 to 1), a few rooms on each
function pg_towerLights(ctx,u){const T=PG_TOWER,n=T.floors,on=clamp(u,0,1)*n;for(let k=0;k<n;k++){const f=n-1-k,a=clamp(on-k,0,1);if(a<=0)break;const y=T.fy0+f*T.fh+3;
  for(let i=0;i<14;i++){if(hash(f*3+i,9)>0.62)continue;const v=(i+0.5)/14,x=T.x-T.r*Math.cos(v*Math.PI),wv=T.r*Math.PI/14*Math.sin(v*Math.PI)*0.55;
    ctx.fillStyle="rgba(255,210,150,"+(0.75*a*(0.6+0.4*Math.sin(v*Math.PI))).toFixed(3)+")";ctx.fillRect(x-wv/2,y,wv,T.fh-6);}}}
