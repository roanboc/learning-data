/* ===== Grants by design: the islands =====
   The opening's world, painted in the module's night light: a shore of the Galápagos at dusk in the 1970s, as seen from the sea's
   edge. The sky is the hall's petrol, with the last warm light low on the right; far islands of old volcanoes on the horizon; the sea;
   and, in front, black lava with a flat rock where boats land, saltbush and the pale, bare palo santo trees of the dry coast, and a
   small lagoon on the right. Painted once as the place gdShore; what moves is drawn live: boats with a lamp, the visitors and their
   guide (small, far off, in the clothes of the time: shorts, shirts, hats, a pack), the animals (sea lions on the landing rock, boobies
   on their nests, a marine iguana on a boulder, flamingos at the lagoon), the trail and its stakes, and the zones of frosted glass
   that keep most of the land from visitors. No one's likeness is drawn. Sizes in the 1920 x 1080 frame. */

const GD_HZ=556;   // the horizon
// where the lava meets the sea, x to y
const GD_EDGE=x=>742+Math.sin(x*0.011)*10+Math.sin(x*0.037+1.3)*6-(x<600?Math.max(0,1-Math.abs(x-360)/260)*26:0)+(x>1400?-34*Math.min(1,(x-1400)/300):0);
// where the trail runs, from the landing rock inland and along to the lagoon: points the stakes stand on
const GD_TRAIL=[[402,812],[520,800],[640,782],[760,770],[880,772],[1000,782],[1120,786],[1240,776],[1360,758],[1470,742],[1570,736]];
// the nests beside the trail, and the one a visitor would walk through
const GD_NESTS=[[700,838,0.95],[930,826,1.0],[1190,836,0.95],[1420,800,0.85],[1050,734,0.8]];
// a point along the trail, u from 0 (the landing) to 1 (the lagoon)
function gd_along(u){u=clamp(u,0,1)*(GD_TRAIL.length-1);const i=Math.min(GD_TRAIL.length-2,Math.floor(u)),f=u-i,a=GD_TRAIL[i],b=GD_TRAIL[i+1];
  return[lerp(a[0],b[0],f),lerp(a[1],b[1],f)];}

AG_PLACES.gdShore=c=>{const w=W,h=H,R=ag_rnd(1969),hz=GD_HZ;
  // the sky: the hall's petrol, lighter and warmer low on the right where the sun has set
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(6,17,22)");g.addColorStop(0.55,"rgb(11,31,38)");g.addColorStop(0.86,"rgb(24,50,56)");g.addColorStop(1,"rgb(46,62,62)");
  c.fillStyle=g;c.fillRect(0,0,w,hz);
  const glow=(x,y,r,col,a)=>{const gg=c.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,rgba(col,a));gg.addColorStop(1,rgba(col,0));c.fillStyle=gg;c.fillRect(x-r,y-r,2*r,2*r);};
  c.save();c.beginPath();c.rect(0,0,w,hz+4);c.clip();glow(1560,hz+10,620,[196,132,86],0.30);glow(1560,hz,260,[236,170,110],0.22);glow(420,hz-40,700,[70,150,160],0.10);c.restore();
  for(let i=0;i<70;i++){const x=R()*w,y=R()*hz*0.62,r=0.6+R()*1.5;c.fillStyle="rgba(200,240,240,"+(0.06+R()*0.22*(1-y/hz)).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // thin clouds caught by the last light
  for(let i=0;i<4;i++){const y=hz-70-R()*140,x=1000+R()*800,cw=160+R()*260;c.save();c.globalAlpha=0.06+R()*0.05;c.filter="blur(2px)";const cg=c.createLinearGradient(x-cw,0,x+cw,0);
    cg.addColorStop(0,"rgba(220,170,130,0)");cg.addColorStop(0.5,"rgba(220,170,130,1)");cg.addColorStop(1,"rgba(220,170,130,0)");c.fillStyle=cg;c.fillRect(x-cw,y,2*cw,2+R()*4);c.restore();}
  // far islands: old shield volcanoes and a cone, dark against the sky, lit along the right of each slope
  const island=(pts,col,rim)=>{c.save();c.beginPath();c.moveTo(pts[0][0],hz+2);for(const p of pts)c.lineTo(p[0],p[1]);c.lineTo(pts[pts.length-1][0],hz+2);c.closePath();
    c.fillStyle=col;c.fill();c.clip();const rg=c.createLinearGradient(0,hz-140,0,hz);rg.addColorStop(0,rgba(rim,0.16));rg.addColorStop(1,rgba(rim,0.02));c.fillStyle=rg;c.fillRect(0,hz-200,w,200);c.restore();
    c.save();c.strokeStyle=rgba(rim,0.34);c.lineWidth=1.6;c.beginPath();for(let i=0;i<pts.length;i++){const p=pts[i];i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.restore();};
  const dome=(x0,x1,top,n)=>{const P=[];for(let i=0;i<=n;i++){const u=i/n,s=Math.sin(Math.PI*u);P.push([lerp(x0,x1,u),hz-(top)*Math.pow(s,0.7)-R()*3*s]);}return P;};
  island(dome(-80,760,96,24),"rgb(12,28,34)",[150,190,186]);
  island(dome(560,980,46,14),"rgb(14,31,37)",[170,190,180]);
  island([[1040,hz],[1100,hz-28],[1150,hz-64],[1176,hz-92],[1196,hz-96],[1220,hz-70],[1266,hz-36],[1330,hz-12],[1380,hz]],"rgb(16,32,36)",[230,180,130]);
  island(dome(1640,2000,30,10),"rgb(18,34,38)",[230,176,128]);
  // the sea: the sky's light laid on it in long glints, warmest under the glow
  g=c.createLinearGradient(0,hz,0,800);g.addColorStop(0,"rgb(26,46,50)");g.addColorStop(0.3,"rgb(13,32,38)");g.addColorStop(1,"rgb(7,20,25)");c.fillStyle=g;c.fillRect(0,hz,w,800-hz);
  for(let i=0;i<260;i++){const y=hz+4+Math.pow(R(),1.7)*230,x=R()*w,len=20+R()*120*(1-(y-hz)/260),d=Math.abs(x-1560)/900,warm=Math.max(0,1-d);
    const a=(0.05+0.16*warm)*(1-(y-hz)/300);c.fillStyle=rgba(mix([120,190,196],[236,178,120],warm),Math.max(0,a));c.fillRect(x,y,len,1.2+R()*1.2);}
  // the shore: black lava from the water's edge to the front, its edge uneven, with a flat rock where boats land on the left
  const edge=GD_EDGE;
  c.save();c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=12)c.lineTo(x,edge(x));c.lineTo(w,h);c.closePath();
  g=c.createLinearGradient(0,700,0,h);g.addColorStop(0,"rgb(20,30,32)");g.addColorStop(0.35,"rgb(12,20,22)");g.addColorStop(1,"rgb(6,11,13)");c.fillStyle=g;c.fill();c.clip();
  // the lava's ropes and cracks, faint, and the cool sheen of the sky on its tops
  for(let i=0;i<180;i++){const x=R()*w,y=730+Math.pow(R(),0.8)*350,r=10+R()*40*(y/h);c.strokeStyle="rgba(120,170,170,"+(0.03+R()*0.05).toFixed(3)+")";c.lineWidth=1+R()*1.4;
    c.beginPath();c.ellipse(x,y,r*1.8,r*0.5,-0.1+R()*0.2,Math.PI*1.05,Math.PI*1.95);c.stroke();}
  for(let i=0;i<70;i++){let x=R()*w,y=760+R()*320;c.strokeStyle="rgba(0,0,0,"+(0.25+R()*0.3).toFixed(3)+")";c.lineWidth=1+R()*1.6;c.beginPath();c.moveTo(x,y);
    for(let k=0;k<4;k++){x+=(R()-0.5)*60;y+=(R()-0.3)*24;c.lineTo(x,y);}c.stroke();}
  // the landing rock: a flat ledge at the water, its top catching the sky
  c.fillStyle="rgb(24,34,36)";c.beginPath();c.moveTo(150,760);c.bezierCurveTo(220,736,420,730,560,748);c.lineTo(580,790);c.bezierCurveTo(430,800,250,806,140,796);c.closePath();c.fill();
  c.fillStyle="rgba(170,210,206,0.16)";c.fillRect(170,744,380,2);
  // a small lagoon on the right, behind the shore, holding the glow
  c.save();c.beginPath();c.ellipse(1660,724,250,30,0,0,TAU);const lg=c.createLinearGradient(0,694,0,754);lg.addColorStop(0,"rgb(70,72,68)");lg.addColorStop(1,"rgb(28,40,42)");c.fillStyle=lg;c.fill();
  c.clip();for(let i=0;i<30;i++){c.fillStyle="rgba(240,190,140,"+(0.08+R()*0.14).toFixed(3)+")";c.fillRect(1430+R()*460,700+R()*46,30+R()*80,1.2);}c.restore();
  c.restore();
  // the water's edge: a fine line of foam where the sea meets the lava
  c.save();c.strokeStyle="rgba(200,236,236,0.22)";c.lineWidth=1.6;c.beginPath();for(let x=0;x<=w;x+=10){const y=edge(x)-2;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.restore();
  // saltbush, low and rounded, and palo santo trees, bare and pale, along the back of the shore
  const bush=(x,y,r)=>{for(let k=0;k<7;k++){const bx=x+(R()-0.5)*r*1.6,by=y-R()*r*0.5,br=r*(0.35+R()*0.4);const bg=c.createRadialGradient(bx-br*0.3,by-br*0.4,1,bx,by,br);
      bg.addColorStop(0,"rgb(30,44,40)");bg.addColorStop(1,"rgb(12,20,20)");c.fillStyle=bg;c.beginPath();c.ellipse(bx,by,br*1.2,br*0.8,0,0,TAU);c.fill();}};
  for(const [x,y,r] of [[90,760,40],[640,744,34],[820,736,30],[1290,730,38],[1080,724,26],[1860,742,30],[560,880,46],[1540,900,52],[260,940,58]])bush(x,y,r);
  const tree=(x,y,s)=>{const br=(x0,y0,ang,len,wd,d)=>{if(d>4||len<6)return;const x1=x0+Math.sin(ang)*len,y1=y0-Math.cos(ang)*len;
      c.strokeStyle="rgba(140,152,150,"+(0.36-d*0.05).toFixed(3)+")";c.lineWidth=wd;c.lineCap="round";c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+x1)/2+(R()-0.5)*8,(y0+y1)/2,x1,y1);c.stroke();
      const n=2+(R()<0.4?1:0);for(let k=0;k<n;k++)br(x1,y1,ang+(R()-0.5)*1.3,len*(0.62+R()*0.18),wd*0.66,d+1);};
    br(x,y,(R()-0.5)*0.2,54*s,7*s,0);};
  for(const [x,y,s] of [[700,740,1.0],[880,734,0.8],[1330,726,1.1],[1120,720,0.7],[1900,740,0.9],[40,756,0.9]])tree(x,y,s);
  // the dark at the front, so the eye goes to the shore
  g=c.createLinearGradient(0,900,0,h);g.addColorStop(0,"rgba(4,10,12,0)");g.addColorStop(1,"rgba(4,10,12,0.7)");c.fillStyle=g;c.fillRect(0,900,w,h-900);};

/* ---------------------------------------------------------------- what moves on the islands */
// a boat of the time, a small motor schooner, far out on the sea: its hull and cabin dark, its mast, and a warm lamp; s its size
function gd_boat(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgb(8,16,20)";ctx.beginPath();ctx.moveTo(-60,-6);ctx.lineTo(56,-6);ctx.quadraticCurveTo(64,-6,70,-14);ctx.lineTo(64,4);ctx.quadraticCurveTo(10,10,-52,6);ctx.closePath();ctx.fill();
  ctx.fillRect(-30,-22,46,16);ctx.fillRect(-4,-30,22,9);ctx.strokeStyle="rgb(8,16,20)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(4,-30);ctx.lineTo(4,-74);ctx.moveTo(4,-70);ctx.lineTo(-40,-8);ctx.stroke();
  ctx.strokeStyle="rgba(170,210,206,0.35)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-60,-6);ctx.lineTo(56,-6);ctx.stroke();
  const L=o.lamp==null?1:o.lamp;if(L>0){dp_halo(ctx,-8,-16,46,[255,200,130],0.5*L);ctx.fillStyle=rgba([255,214,150],L);ctx.fillRect(-24,-18,6,5);ctx.fillRect(-12,-18,6,5);ctx.fillRect(0,-18,6,5);
    // its lamp on the water
    ctx.fillStyle=rgba([255,200,130],0.25*L);ctx.fillRect(-20,10,28,1.6);ctx.fillRect(-14,16,16,1.4);}
  ctx.restore();}

/* a visitor of the time, small and far off, walking: a hat (some), a shirt, shorts, a pack (some); lit warm from the glow on the right
   and cool from the sky. ph is the walk's phase (it moves the legs), dir 1 to the right, -1 to the left; o.guide gives the guide's
   wide hat and a slow, steady step; o.still stands. Arms hang: no one points. Drawn whole; fade a group through gd_whole. */
const GD_FOLK=[{shirt:[150,128,96],hat:"cap",pack:[90,80,64]},{shirt:[98,120,132],hat:null,pack:null},{shirt:[176,150,120],hat:"sun",pack:[70,84,70]},
  {shirt:[120,96,110],hat:null,pack:[84,74,60]},{shirt:[200,186,150],hat:"sun",pack:null},{shirt:[110,130,104],hat:"cap",pack:[96,80,70]},
  {shirt:[160,110,90],hat:null,pack:null},{shirt:[136,146,150],hat:"sun",pack:[80,70,58]}];
function gd_walker(ctx,x,y,s,ph,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const P=o.guide?{shirt:[178,164,118],hat:"guide",pack:[76,70,56]}:GD_FOLK[(o.k||0)%GD_FOLK.length];
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);
  const sw=o.still?0:Math.sin(ph)*0.42,lift=o.still?0:Math.abs(Math.cos(ph))*1.6,skin=[150,112,90],dark=[14,20,22];
  const shade=(col,k)=>rgba(mix(col,[10,16,20],k),1);
  // its shadow on the lava
  ctx.fillStyle="rgba(0,0,0,0.35)";ctx.beginPath();ctx.ellipse(0,0,15,3.4,0,0,TAU);ctx.fill();
  // legs, from the hips, swinging in turn; shorts over them, then boots
  const leg=(sgn)=>{const an=sgn*sw;ctx.save();ctx.translate(0,-30);ctx.rotate(an);ctx.strokeStyle=shade(skin,0.55);ctx.lineWidth=4.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,27);ctx.stroke();
    ctx.fillStyle=shade([40,40,38],0.2);ctx.fillRect(-3,25,8,4);ctx.restore();};
  leg(-1);leg(1);ctx.translate(0,-lift);
  ctx.fillStyle=shade(o.guide?[96,92,70]:[84,80,72],0.25);ctx.beginPath();ctx.moveTo(-7,-38);ctx.lineTo(7,-38);ctx.lineTo(8,-26);ctx.lineTo(-8,-26);ctx.closePath();ctx.fill();
  // the body and a pack behind it
  if(P.pack){ctx.fillStyle=shade(P.pack,0.4);rr(ctx,-13,-60,8,20,3);ctx.fill();}
  ctx.fillStyle=shade(P.shirt,0.45);ctx.beginPath();ctx.moveTo(-8,-60);ctx.quadraticCurveTo(0,-64,8,-60);ctx.lineTo(8,-37);ctx.lineTo(-8,-37);ctx.closePath();ctx.fill();
  // the warm light from the glow on the leading edge, the cool sky on the top
  ctx.fillStyle="rgba(240,180,120,0.30)";ctx.fillRect(5,-59,3,21);
  // arms hang at the sides
  ctx.strokeStyle=shade(P.shirt,0.5);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(6,-57);ctx.lineTo(7+sw*3,-40);ctx.moveTo(-6,-57);ctx.lineTo(-7-sw*3,-40);ctx.stroke();
  // the head, and a hat of the time
  ctx.fillStyle=shade(skin,0.42);ctx.beginPath();ctx.arc(0,-68,5.4,0,TAU);ctx.fill();ctx.fillStyle="rgba(240,180,120,0.35)";ctx.beginPath();ctx.arc(1.6,-68,4,-0.9,0.9);ctx.fill();
  if(P.hat==="cap"){ctx.fillStyle=shade([170,160,130],0.4);ctx.beginPath();ctx.arc(0,-70,5.6,Math.PI,0);ctx.fill();ctx.fillRect(1,-71,7,2);}
  if(P.hat==="sun"){ctx.fillStyle=shade([196,180,140],0.35);ctx.beginPath();ctx.ellipse(0,-71,9,2.2,0,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(0,-71,5,Math.PI,0);ctx.fill();}
  if(P.hat==="guide"){ctx.fillStyle=shade([150,130,92],0.3);ctx.beginPath();ctx.ellipse(0,-71,11,2.6,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-5.6,-71);ctx.quadraticCurveTo(-5,-78,0,-78);ctx.quadraticCurveTo(5,-78,5.6,-71);ctx.closePath();ctx.fill();}
  ctx.restore();}

// a blue-footed booby sitting on its nest, small, seen side on: a white breast, brown back, a long pale bill; up (0 to 1) raises its head
function gd_booby(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const up=o.up||0;
  // the nest: a ring of guano and twigs on the lava
  ctx.fillStyle="rgba(150,150,140,0.35)";ctx.beginPath();ctx.ellipse(0,1,24,5,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(56,46,40)";ctx.beginPath();ctx.moveTo(-22,0);ctx.bezierCurveTo(-24,-18,-8,-26,8,-22);ctx.bezierCurveTo(18,-18,22,-8,20,0);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(196,196,188)";ctx.beginPath();ctx.moveTo(8,-22);ctx.bezierCurveTo(18,-18,22,-8,20,0);ctx.lineTo(4,0);ctx.bezierCurveTo(6,-8,4,-16,8,-22);ctx.closePath();ctx.fill();
  // the head and neck, rising as it looks up
  const hx=14,hy=-30-up*8;ctx.strokeStyle="rgb(170,166,156)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(10,-20);ctx.quadraticCurveTo(14,-26,hx,hy);ctx.stroke();
  ctx.fillStyle="rgb(176,170,160)";ctx.beginPath();ctx.arc(hx,hy,5.6,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(120,140,150)";ctx.beginPath();ctx.moveTo(hx+4,hy-2);ctx.lineTo(hx+17,hy+2-up*2);ctx.lineTo(hx+4,hy+3);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(20,22,24)";ctx.beginPath();ctx.arc(hx+1.6,hy-1,1.3,0,TAU);ctx.fill();
  // the warm rim of the glow on its breast, the cool sky on its back
  ctx.strokeStyle="rgba(240,186,130,0.45)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(20,-2);ctx.bezierCurveTo(22,-10,18,-18,10,-22);ctx.stroke();
  ctx.strokeStyle="rgba(150,210,210,0.25)";ctx.beginPath();ctx.moveTo(-20,-6);ctx.bezierCurveTo(-18,-20,-4,-26,8,-23);ctx.stroke();
  ctx.restore();}

// a sea lion resting on the landing rock, its head raised a little (lift 0 to 1), seen side on; s its size
function gd_sealion(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const L=o.lift||0;
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(0,2,70,6,0,0,TAU);ctx.fill();
  const g=ctx.createLinearGradient(0,-40,0,2);g.addColorStop(0,"rgb(70,64,56)");g.addColorStop(1,"rgb(30,28,26)");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-70,0);ctx.bezierCurveTo(-74,-8,-60,-14,-40,-16);ctx.bezierCurveTo(-10,-20,18,-24,34,-30-L*8);ctx.bezierCurveTo(44,-36-L*10,56,-40-L*12,64,-36-L*12);
  ctx.bezierCurveTo(72,-32-L*12,72,-24-L*8,62,-20-L*6);ctx.bezierCurveTo(54,-16,46,-8,44,0);ctx.closePath();ctx.fill();
  // a fore flipper, and the eye
  ctx.fillStyle="rgb(36,32,30)";ctx.beginPath();ctx.moveTo(26,-6);ctx.quadraticCurveTo(36,2,44,4);ctx.lineTo(30,4);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(14,14,14)";ctx.beginPath();ctx.arc(60,-32-L*12,1.8,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(240,186,130,0.40)";ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(-40,-16);ctx.bezierCurveTo(-10,-20,18,-24,34,-30-L*8);ctx.bezierCurveTo(44,-36-L*10,56,-40-L*12,64,-36-L*12);ctx.stroke();
  ctx.restore();}

// a marine iguana on a boulder, dark, its crest of spines along its back; s its size
function gd_iguana(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);
  ctx.fillStyle="rgb(20,26,26)";ctx.beginPath();ctx.ellipse(0,6,62,20,0,Math.PI,TAU);ctx.fill();
  ctx.fillStyle="rgb(36,38,36)";ctx.beginPath();ctx.moveTo(-60,-6);ctx.bezierCurveTo(-30,-12,-10,-18,14,-18);ctx.bezierCurveTo(26,-18,36,-22,44,-22);ctx.bezierCurveTo(52,-22,56,-16,52,-12);
  ctx.bezierCurveTo(40,-8,20,-4,0,-4);ctx.bezierCurveTo(-24,-4,-44,-2,-60,-6);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgb(46,46,42)";ctx.lineWidth=1.4;for(let i=0;i<9;i++){const px=-30+i*7,py=-14-Math.sin(i/8*Math.PI)*4;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+1,py-5);ctx.stroke();}
  ctx.strokeStyle="rgba(150,210,210,0.30)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-50,-8);ctx.bezierCurveTo(-20,-14,10,-18,44,-22);ctx.stroke();
  ctx.restore();}

// a flamingo standing in the lagoon, seen side on: thin legs, its body, an S of a neck, the bent bill; tinted by the glow; s its size
function gd_flamingo(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const pk=[214,140,128],dk=[150,92,86],dip=o.dip||0;
  ctx.strokeStyle=rgba(dk,1);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(0,-46);ctx.lineTo(2,-86);ctx.moveTo(6,0);ctx.lineTo(6,-40);ctx.lineTo(4,-86);ctx.stroke();
  const g=ctx.createLinearGradient(-24,-110,24,-80);g.addColorStop(0,rgba(pk,1));g.addColorStop(1,rgba(dk,1));ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(-2,-96,26,13,-0.16,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(pk,1);ctx.lineWidth=4.2;ctx.beginPath();ctx.moveTo(18,-102);ctx.bezierCurveTo(30,-118,10,-132,14,-148+dip*30);ctx.bezierCurveTo(18,-162+dip*30,30,-160+dip*30,30,-150+dip*30);ctx.stroke();
  ctx.fillStyle=rgba(pk,1);ctx.beginPath();ctx.arc(30,-151+dip*30,4.4,0,TAU);ctx.fill();ctx.fillStyle="rgb(30,26,26)";ctx.beginPath();ctx.moveTo(32,-150+dip*30);ctx.quadraticCurveTo(40,-148+dip*30,38,-140+dip*30);ctx.lineTo(33,-146+dip*30);ctx.closePath();ctx.fill();
  // its reflection, faint, in the still water
  ctx.save();ctx.globalAlpha*=0.18;ctx.scale(1,-0.45);ctx.strokeStyle=rgba(pk,1);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(2,-86);ctx.stroke();ctx.fillStyle=rgba(pk,1);ctx.beginPath();ctx.ellipse(-2,-96,26,13,-0.16,0,TAU);ctx.fill();ctx.restore();
  ctx.restore();}

/* the trail and its stakes: a band of paler crushed lava from the landing to the lagoon, laid as far as u (0 to 1), with a stake at
   each point, lit (0 to 1) one after another as it's marked: a short post with a white tip, as the park's trails are marked */
function gd_trail(ctx,u,lit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;const n=48;
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";for(const [wd,col] of [[30,"rgba(60,66,64,0.55)"],[18,"rgba(96,100,94,0.55)"],[3,"rgba(190,220,214,0.22)"]]){
    ctx.strokeStyle=col;ctx.lineWidth=wd;ctx.beginPath();for(let i=0;i<=n;i++){const v=i/n;if(v>u)break;const p=gd_along(v),q=[p[0],p[1]+4];i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();}ctx.restore();
  GD_TRAIL.forEach((p,i)=>{const v=i/(GD_TRAIL.length-1);if(v>u+1e-6)return;const L=clamp(lit*GD_TRAIL.length*1.3-i,0,1),side=i%2?14:-14,sx=p[0],sy=p[1]+side*0.5-4;
    ctx.fillStyle="rgb(40,36,30)";ctx.fillRect(sx-2,sy-26,4,26);ctx.fillStyle=rgba(mix([150,150,140],[236,240,232],L),1);ctx.fillRect(sx-2.4,sy-28,4.8,8);
    if(L>0)dp_halo(ctx,sx,sy-24,26,[230,240,230],0.25*L);});
  ctx.restore();}

/* the zones: frost laid over the land itself, on both sides of the trail, keeping most of the shore from visitors (u 0 to 1 lays it
   on); what lives there is drawn over it, still there, only out of reach; the trail's corridor, the landing rock and the lagoon's edge
   stay clear, their edges lit like the edges of a pane */
function gd_open(c){const up=[],dn=[];for(let i=0;i<=44;i++){const p=gd_along(i/44);up.push([p[0],p[1]-26]);dn.push([p[0],p[1]+30]);}
  c.moveTo(up[0][0],up[0][1]);for(const p of up)c.lineTo(p[0],p[1]);for(let i=dn.length-1;i>=0;i--)c.lineTo(dn[i][0],dn[i][1]);c.closePath();
  c.moveTo(600,776);c.ellipse(372,774,228,40,0,0,TAU);c.moveTo(1930,730);c.ellipse(1680,730,250,42,0,0,TAU);}
function gd_zones(ctx,u,o){o=o||{};const a=(o.a==null?1:o.a)*ag_sine(clamp(u,0,1));if(a<=0.004)return;
  const cv=ctx.canvas,[bc,bx]=ag_buf("gdzones",cv.width,cv.height);bx.setTransform(ctx.getTransform());
  bx.save();bx.beginPath();bx.moveTo(0,H);for(let x=0;x<=W;x+=16)bx.lineTo(x,GD_EDGE(x)+6);bx.lineTo(W,H);bx.closePath();bx.clip();
  dp_behind(bx,"gdShore");bx.fillStyle="rgba(10,24,30,0.34)";bx.fillRect(0,0,W,H);const g=bx.createLinearGradient(0,740,0,H);g.addColorStop(0,"rgba(170,200,204,0.16)");g.addColorStop(1,"rgba(170,200,204,0.05)");bx.fillStyle=g;bx.fillRect(0,700,W,H-700);
  bx.globalCompositeOperation="destination-out";bx.fillStyle="#000";bx.beginPath();gd_open(bx);bx.fill();bx.restore();
  // the edges of what stays open, in the light of a pane's edge
  bx.save();bx.strokeStyle=rgba(DP.ice,0.55);bx.shadowColor=rgba(DP.ice,0.8);bx.shadowBlur=8;bx.lineWidth=1.8;bx.beginPath();gd_open(bx);bx.stroke();bx.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}

/* ---------------------------------------------------------------- more of the islands: a bird leaving, flamingos on their nests, the map */
// a booby in flight, seen from the side, its wings beating (ph); s its size
function gd_flyer(ctx,x,y,s,ph,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const f=Math.sin(ph);
  ctx.fillStyle="rgb(196,196,188)";ctx.beginPath();ctx.ellipse(0,0,20,6.4,-0.1,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(120,140,150)";ctx.beginPath();ctx.moveTo(18,-3);ctx.lineTo(32,0);ctx.lineTo(18,2);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(70,58,50)";for(const k of [1,-1]){ctx.beginPath();ctx.moveTo(-6,-1);ctx.quadraticCurveTo(-2,-24*f*k-4,-24,-34*f*k);ctx.quadraticCurveTo(-12,-10*f*k,6,-1);ctx.closePath();ctx.fill();}
  ctx.strokeStyle="rgba(240,186,130,0.4)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-18,2);ctx.quadraticCurveTo(0,7,18,2);ctx.stroke();ctx.restore();}
// a flamingo sitting on its nest, a cone of mud at the lagoon's edge; s its size
function gd_sitter(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.dir||1),s);const pk=[214,140,128],dk=[150,92,86];
  ctx.fillStyle="rgb(58,52,46)";ctx.beginPath();ctx.moveTo(-34,0);ctx.lineTo(-24,-22);ctx.lineTo(24,-22);ctx.lineTo(34,0);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(240,190,140,0.18)";ctx.fillRect(-24,-23,48,2);
  const g=ctx.createLinearGradient(-24,-50,24,-24);g.addColorStop(0,rgba(pk,1));g.addColorStop(1,rgba(dk,1));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(-2,-36,28,14,-0.1,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(pk,1);ctx.lineWidth=4.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(18,-42);ctx.bezierCurveTo(30,-60,8,-74,14,-88);ctx.bezierCurveTo(18,-100,30,-98,30,-90);ctx.stroke();
  ctx.fillStyle=rgba(pk,1);ctx.beginPath();ctx.arc(30,-91,4.4,0,TAU);ctx.fill();ctx.fillStyle="rgb(30,26,26)";ctx.beginPath();ctx.moveTo(32,-90);ctx.quadraticCurveTo(40,-88,38,-80);ctx.lineTo(33,-86);ctx.closePath();ctx.fill();
  ctx.restore();}
// a piece of coral, pale and branched, as a visitor carries it off; s its size
function gd_coral(ctx,x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgb(232,206,196)";ctx.lineCap="round";
  const br=(x0,y0,an,len,wd,d)=>{if(d>3)return;const x1=x0+Math.sin(an)*len,y1=y0-Math.cos(an)*len;ctx.lineWidth=wd;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();br(x1,y1,an-0.5,len*0.7,wd*0.7,d+1);br(x1,y1,an+0.45,len*0.66,wd*0.7,d+1);};
  br(0,0,0,9,3.4,0);ctx.restore();}
/* the map: a card of glass with the coast of Ecuador on its right, the islands on its left, and the sea between, about 1,000 km
   (o.p draws the line between them on) */
function gd_map(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,glowR:30,behind:o.behind});
  ctx.save();rr(ctx,x,y,w,h,20);ctx.clip();
  // the land of South America on the right: a coast running down from the top, bulging west at Ecuador
  const cx=x+w*0.74;ctx.beginPath();ctx.moveTo(cx+20,y);ctx.bezierCurveTo(cx-6,y+h*0.2,cx-34,y+h*0.42,cx-26,y+h*0.55);ctx.bezierCurveTo(cx-18,y+h*0.68,cx+10,y+h*0.8,cx+30,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y);ctx.closePath();
  ctx.fillStyle="rgba(92,120,112,0.42)";ctx.fill();ctx.strokeStyle=rgba(mix(dp_f("cyan"),[255,255,255],0.4),0.8);ctx.lineWidth=2;ctx.stroke();ctx.restore();
  // the islands, a cluster on the left
  const ix=x+w*0.17,iy=y+h*0.52;for(const [dx,dy,r] of [[0,0,9],[-16,10,6],[14,14,5],[6,-14,5],[-10,-10,4],[22,-4,4],[-22,-2,3.5]]){ctx.fillStyle="rgba(150,190,180,0.9)";ctx.beginPath();ctx.arc(ix+dx,iy+dy,r,0,TAU);ctx.fill();}
  const p=o.p==null?1:clamp(o.p,0,1),ex=lerp(ix+34,cx-40,p);ctx.save();ctx.strokeStyle=rgba(DP.T.ink,0.9);ctx.lineWidth=2.4;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(ix+34,iy);ctx.lineTo(ex,iy);ctx.stroke();ctx.restore();
  dp_T(ctx,"Galápagos",ix-12,iy+66,{w:700,size:28,align:"center"});dp_T(ctx,"Ecuador",cx+44,y+h*0.42,{w:700,size:28,align:"center"});
  if(p>0.5)dp_T(ctx,"about 1,000 km",lerp(ix,cx,0.5),iy-26,{w:600,size:28,align:"center",col:"mut",a:clamp((p-0.5)*2,0,1)});
  ctx.restore();}
/* a walk across the lava, before the plan: from the landing rock out to points anywhere on the shore (a seeded polyline per visitor),
   and the point u (0 to 1) along it; worn (0 to 1) lays the paleness of many feet along it */
const GD_WANDER=(()=>{const R=ag_rnd(1971),L=[];for(let i=0;i<8;i++){const P=[[300+R()*240,790+R()*14]];let x=P[0][0],y=P[0][1];
    for(let k=0;k<4;k++){x=clamp(x+(R()*2-0.6)*360,150,1760);y=clamp(y+(R()-0.5)*90+18,770,960);P.push([x,y]);}L.push(P);}return L;})();
function gd_walkAt(P,u){u=clamp(u,0,1);let tot=0;const seg=[];for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(d);tot+=d;}
  let r=u*tot;for(let i=0;i<seg.length;i++){if(r<=seg[i]||i===seg.length-1){const f=clamp(r/seg[i],0,1);return{x:lerp(P[i][0],P[i+1][0],f),y:lerp(P[i][1],P[i+1][1],f),dir:P[i+1][0]>=P[i][0]?1:-1,dist:u*tot};}r-=seg[i];}
  return{x:P[0][0],y:P[0][1],dir:1,dist:0};}
function gd_worn(ctx,P,u,a){if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(150,160,150,0.20)";ctx.lineWidth=12;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();const n=30;for(let i=0;i<=n;i++){const q=gd_walkAt(P,u*i/n);i?ctx.lineTo(q.x,q.y+2):ctx.moveTo(q.x,q.y+2);}ctx.stroke();ctx.restore();}
// a walker's size at a depth on the shore: further (higher up the frame) is smaller
const gd_depth=y=>lerp(0.95,1.55,clamp((y-740)/260,0,1));
