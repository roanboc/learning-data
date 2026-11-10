/* ===== Who did what: the opening's places and things, 1953 to 1963 =====
   Australia in the 1950s, painted in the module's night light (Night glass's petrol dark, warm lamps, a cool rim from the sky), each
   place painted once (AG_PLACES) and named with the film's prefix, wd:
     wdLab    the Aeronautical Research Laboratories in Melbourne at night: a long bench under two lamps, a cut-away fuel tank, a chart
              of a tank on the wall, and a tall window of night sky on the right, where a Comet crosses (drawn live)
     wdSea    the night sea under a low moon, calm, with nothing on it
     wdTable  the investigators' table under a hanging lamp: a few twisted panels of aluminium
     wdApron  an airport at dusk: the terminal's lit windows, the tower, the wet apron (the Comet and its steps are drawn live)
     wdHigh   the night sky high over cloud, where a plane flies on its own (drawn live, its tail's soft glow too)
     wdCoast  a coast at night in Queensland, 1960: low hills, a town's few lights, the sea
     wdDawn   the sky at dawn over cloud, where the planes fly on (drawn live)
   and the things the story keeps: the Comet side on (wd_comet), Warren's note on the bench (wd_benchNote), the recorder, a steel box with a loop of
   fine wire turning in it (wd_recorder), headphones (wd_phones), coral question marks (wd_qmark), and David Warren himself (WD_WARREN),
   lit by the lamps (night.js's "lamp" light). No crash is shown: a plane high over the sea fades, and a card says what happened. */

const WD={lamp:[255,222,170],warm:[255,204,140],silver:[178,192,198],silverDk:[88,102,110],steel:[70,84,90],wood:[78,58,44],woodDk:[40,30,24],
  paper:[226,220,204],ink:[52,48,44],sea0:[10,30,36],sea1:[5,15,19],sky0:[6,18,23],sky1:[14,38,44]};
// David Warren in 1953, in his late twenties: short dark hair parted at the side, a white shirt, a dark tie and a grey tweed jacket
const WD_WARREN={key:"wd_warren",name:"David Warren",skin:[228,192,164],hair:{style:"side",c:[52,40,34]},top:{kind:"suit",c:[104,106,102],inner:[236,234,226],tie:[64,46,44]},breath:0.26};

/* ---------------------------------------------------------------- painting the past */
// a night sky from the top down to hz: o.top, o.low its colours, stars (o.stars, seeded), a low moon o.moon [x, y, r] with its haze, and
// o.glow [colour, height, alpha] rising from the horizon (a town's light, dusk or dawn)
function wd_sky(c,hz,o){o=o||{};const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(o.top||WD.sky0,1));g.addColorStop(1,rgba(o.low||WD.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz);const R=ag_rnd(o.seed||11);
  for(let i=0;i<(o.stars==null?120:o.stars);i++){const x=R()*W,y=R()*hz*0.86,r=0.6+R()*1.5,a=0.06+R()*0.26;c.fillStyle="rgba(206,238,238,"+a.toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  if(o.moon){const [mx,my,mr]=o.moon,h=c.createRadialGradient(mx,my,0,mx,my,mr*10);h.addColorStop(0,"rgba(206,234,232,0.20)");h.addColorStop(1,"rgba(206,234,232,0)");
    c.fillStyle=h;c.fillRect(mx-mr*10,my-mr*10,mr*20,mr*20);const mg=c.createRadialGradient(mx-mr*0.3,my-mr*0.3,0,mx,my,mr);mg.addColorStop(0,"rgb(244,248,240)");mg.addColorStop(1,"rgb(206,220,214)");
    c.fillStyle=mg;c.beginPath();c.arc(mx,my,mr,0,TAU);c.fill();}
  if(o.glow){const [col,gh,ga]=o.glow,g2=c.createLinearGradient(0,hz-gh,0,hz);g2.addColorStop(0,rgba(col,0));g2.addColorStop(1,rgba(col,ga));c.fillStyle=g2;c.fillRect(0,hz-gh,W,gh);}}
// long soft clouds, seen from above or far off: n of them along y, seeded
function wd_clouds(c,y,n,col,a,seed){const R=ag_rnd(seed||5);for(let i=0;i<n;i++){const x=R()*W,yy=y+(R()-0.5)*90,rx=180+R()*320,ry=10+R()*16;
    const g=c.createRadialGradient(x,yy,0,x,yy,rx);g.addColorStop(0,rgba(col,a*(0.6+R()*0.4)));g.addColorStop(1,rgba(col,0));c.save();c.translate(x,yy);c.scale(1,ry/rx);c.translate(-x,-yy);
    c.fillStyle=g;c.fillRect(x-rx,yy-rx,2*rx,2*rx);c.restore();}}
// a lamp's warm light falling from (x, y) to a surface at yb, w wide there: a soft cone, blurred, brightest in its middle, and its pool
function wd_lampLight(c,x,y,yb,w,a){const [bc,bx]=ag_buf("wdcone",480,270),k=0.25;bx.clearRect(0,0,480,270);bx.save();bx.scale(k,k);
  const g=bx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,rgba(WD.lamp,0));g.addColorStop(0.5,rgba(WD.lamp,a*0.2));g.addColorStop(1,rgba(WD.lamp,0));
  bx.fillStyle=g;bx.beginPath();bx.moveTo(x-46,y);bx.lineTo(x+46,y);bx.lineTo(x+w/2,yb);bx.lineTo(x-w/2,yb);bx.closePath();bx.fill();
  bx.globalCompositeOperation="destination-in";const v=bx.createLinearGradient(0,y,0,yb);v.addColorStop(0,"rgba(0,0,0,1)");v.addColorStop(1,"rgba(0,0,0,0.45)");bx.fillStyle=v;bx.fillRect(0,0,W,H);bx.restore();
  c.save();c.globalCompositeOperation="lighter";dp_blurDraw(c,bc,0,0,480,270,0,0,W,H,10);
  const s=c.createRadialGradient(x,yb,0,x,yb,w*0.8);s.addColorStop(0,rgba(WD.lamp,a*0.3));s.addColorStop(0.5,rgba(WD.lamp,a*0.1));s.addColorStop(1,rgba(WD.lamp,0));c.translate(x,yb);c.scale(1,0.22);c.translate(-x,-yb);
  c.fillStyle=s;c.fillRect(x-w,yb-w,2*w,2*w);c.restore();}
// a hanging lamp: its cord from the top of the frame, an enamel shade, its rim lit and the bulb's glow under it
function wd_shade(c,x,y,s){c.save();c.strokeStyle="rgb(18,28,32)";c.lineWidth=3*s;c.beginPath();c.moveTo(x,0);c.lineTo(x,y-46*s);c.stroke();
  const g=c.createLinearGradient(x-70*s,0,x+70*s,0);g.addColorStop(0,"rgb(24,40,44)");g.addColorStop(0.45,"rgb(58,78,80)");g.addColorStop(1,"rgb(22,36,40)");c.fillStyle=g;
  c.beginPath();c.moveTo(x-16*s,y-46*s);c.lineTo(x+16*s,y-46*s);c.bezierCurveTo(x+30*s,y-30*s,x+60*s,y-12*s,x+70*s,y);c.lineTo(x-70*s,y);c.bezierCurveTo(x-60*s,y-12*s,x-30*s,y-30*s,x-16*s,y-46*s);c.closePath();c.fill();
  const b=c.createRadialGradient(x,y+2*s,0,x,y+2*s,90*s);b.addColorStop(0,rgba(WD.lamp,0.9));b.addColorStop(0.25,rgba(WD.lamp,0.35));b.addColorStop(1,rgba(WD.lamp,0));c.fillStyle=b;c.fillRect(x-90*s,y-88*s,180*s,180*s);
  c.fillStyle=rgba(mix(WD.lamp,[255,255,255],0.4),1);c.beginPath();c.ellipse(x,y,64*s,7*s,0,0,TAU);c.fill();c.restore();}
// the dark at a frame's edges
function wd_vignette(c,x,y,r0,r1,a){const v=c.createRadialGradient(x,y,r0,x,y,r1);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,8,10,"+a+")");c.fillStyle=v;c.fillRect(0,0,W,H);}

/* ---------------------------------------------------------------- the Comet, side on, its nose to the left
   (x, y): the nose's tip on the fuselage's middle line; s its size (1: 1000 px long); o.lit (0 to 1) its cabin's windows, o.a its
   opacity, o.lights its navigation lights (a soft red at the far wing's tip, a white at the tail), o.n how many windows are lit (from the
   front; all by default). A slender fuselage with a rounded nose and the cockpit's windows; the first Comets' rectangular cabin windows;
   the low swept wing with its engines in the wing's root (two intakes at its leading edge); a swept fin. Silver lit from above. */
function wd_comet(c,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);
  const dk=o.dusk||0,SV=mix(WD.silver,[40,52,58],dk*0.55),SD=mix(WD.silverDk,[16,24,28],dk*0.5),HI=mix([236,244,244],[150,170,176],dk*0.5);
  const body=cc=>{cc.moveTo(0,10);cc.bezierCurveTo(0,-26,40,-52,118,-55);cc.lineTo(820,-54);cc.bezierCurveTo(900,-52,960,-38,1012,-22);cc.lineTo(1012,-6);
    cc.bezierCurveTo(960,12,890,34,820,44);cc.lineTo(118,50);cc.bezierCurveTo(40,50,4,36,0,10);cc.closePath();};
  // the far wing, a sliver above the body's line, and the far tailplane
  c.fillStyle=rgba(mix(SD,[0,0,0],0.4),1);c.beginPath();c.moveTo(380,4);c.lineTo(606,-40);c.lineTo(644,-40);c.lineTo(530,12);c.closePath();c.fill();
  c.beginPath();c.moveTo(904,-30);c.lineTo(964,-62);c.lineTo(988,-62);c.lineTo(972,-24);c.closePath();c.fill();
  // the fin, swept, its leading edge catching the light
  const fg=c.createLinearGradient(860,-190,1000,-40);fg.addColorStop(0,rgba(mix(SV,[255,255,255],0.06),1));fg.addColorStop(1,rgba(SD,1));c.fillStyle=fg;
  c.beginPath();c.moveTo(838,-50);c.bezierCurveTo(892,-86,926,-140,958,-188);c.lineTo(998,-190);c.bezierCurveTo(1004,-128,1006,-70,1004,-30);c.closePath();c.fill();
  c.strokeStyle=rgba(HI,0.55);c.lineWidth=2;c.beginPath();c.moveTo(844,-52);c.bezierCurveTo(896,-88,928,-142,958,-188);c.stroke();
  // the body: lit from above, dark beneath
  const g=c.createLinearGradient(0,-55,0,50);g.addColorStop(0,rgba(mix(SV,[255,255,255],0.22),1));g.addColorStop(0.42,rgba(SV,1));g.addColorStop(1,rgba(mix(SD,[0,0,0],0.4),1));
  c.fillStyle=g;c.beginPath();body(c);c.fill();
  // a dark line along the windows, and the first Comets' rectangular windows, warm where someone sits
  c.fillStyle=rgba(mix(SD,[0,0,0],0.2),0.5);c.fillRect(118,-6,700,2.6);
  const lit=o.lit||0,nLit=o.n==null?99:o.n;for(let i=0;i<19;i++){const wx=168+i*34,on=i<nLit?lit:0;c.fillStyle=rgba(mix(mix([30,42,48],SD,0.3),WD.warm,on*0.92),1);rr(c,wx,-34,16,20,3);c.fill();
    if(on>0.05){c.save();c.globalCompositeOperation="lighter";const wg=c.createRadialGradient(wx+8,-24,0,wx+8,-24,24);wg.addColorStop(0,rgba(WD.warm,0.22*on));wg.addColorStop(1,rgba(WD.warm,0));c.fillStyle=wg;c.fillRect(wx-16,-48,48,48);c.restore();}}
  // the cockpit's windows, and the front door (o.door: open, lit from inside)
  c.fillStyle="rgb(24,36,44)";c.beginPath();c.moveTo(36,-28);c.bezierCurveTo(56,-40,72,-44,90,-44);c.lineTo(98,-30);c.lineTo(46,-18);c.closePath();c.fill();
  if(o.door){c.fillStyle=rgba(mix([30,40,44],WD.warm,0.85),1);rr(c,122,-38,26,62,4);c.fill();c.save();c.globalCompositeOperation="lighter";const dg=c.createRadialGradient(135,-6,0,135,-6,60);dg.addColorStop(0,rgba(WD.warm,0.3));dg.addColorStop(1,rgba(WD.warm,0));c.fillStyle=dg;c.fillRect(75,-66,120,120);c.restore();}
  else{c.strokeStyle=rgba(mix(SD,[0,0,0],0.2),0.7);c.lineWidth=2;rr(c,122,-38,26,62,4);c.stroke();}
  // the near wing, swept back, with the engines in its root: two intakes in its leading edge
  const wg=c.createLinearGradient(0,16,0,80);wg.addColorStop(0,rgba(mix(SV,[255,255,255],0.1),1));wg.addColorStop(1,rgba(SD,1));c.fillStyle=wg;
  c.beginPath();c.moveTo(318,18);c.lineTo(578,20);c.lineTo(724,76);c.lineTo(678,80);c.lineTo(396,46);c.closePath();c.fill();
  c.fillStyle="rgb(20,30,36)";c.beginPath();c.ellipse(334,24,13,9,0,0,TAU);c.fill();c.beginPath();c.ellipse(364,29,12,8,0,0,TAU);c.fill();
  // the near tailplane
  c.fillStyle=rgba(SV,1);c.beginPath();c.moveTo(898,-20);c.lineTo(1000,-16);c.lineTo(1024,6);c.lineTo(962,4);c.closePath();c.fill();
  // the sky's cool light along its top
  c.strokeStyle=rgba(HI,0.55);c.lineWidth=1.8;c.beginPath();c.moveTo(14,-18);c.bezierCurveTo(40,-46,76,-55,118,-55);c.lineTo(820,-54);c.stroke();
  // on the ground: the nose gear under the cockpit and the main gear under the wing, each a strut and its wheels
  if(o.gear){c.fillStyle="rgb(34,42,46)";c.fillRect(150,40,8,46);c.fillRect(470,44,10,46);for(const [gx,r] of [[154,13],[466,17],[492,17]]){c.fillStyle="rgb(14,18,20)";c.beginPath();c.arc(gx,100-r,r,0,TAU);c.fill();c.fillStyle="rgb(64,72,74)";c.beginPath();c.arc(gx,100-r,r*0.4,0,TAU);c.fill();}}
  if(o.lights){c.globalCompositeOperation="lighter";for(const [lx,ly,col] of [[1012,-14,[240,250,250]]]){const lg=c.createRadialGradient(lx,ly,0,lx,ly,22);lg.addColorStop(0,rgba(col,0.9*o.lights));lg.addColorStop(1,rgba(col,0));c.fillStyle=lg;c.fillRect(lx-22,ly-22,44,44);}}
  c.restore();}

/* ---------------------------------------------------------------- the places */
AG_PLACES.wdLab=c=>{
  // the back wall, dark, panelled low down, and a tall window of night sky on the right
  let g=c.createLinearGradient(0,0,0,712);g.addColorStop(0,"rgb(11,26,30)");g.addColorStop(1,"rgb(21,41,45)");c.fillStyle=g;c.fillRect(0,0,W,712);
  c.fillStyle="rgba(150,214,220,0.035)";c.fillRect(0,520,W,2);for(let x=60;x<W;x+=180)c.fillRect(x,522,2,190);
  c.save();c.beginPath();c.rect(1330,110,460,540);c.clip();wd_sky(c,650,{seed:5,stars:70,moon:[1690,190,17],low:[18,44,52]});wd_clouds(c,600,6,[120,170,180],0.10,8);c.restore();
  c.fillStyle="rgb(24,42,46)";for(const [x,y,w,h] of [[1322,102,476,12],[1316,644,488,18],[1322,102,12,556],[1786,102,12,556],[1554,110,7,540],[1330,375,460,7]])c.fillRect(x,y,w,h);
  c.fillStyle="rgba(150,214,220,0.12)";c.fillRect(1316,644,488,2);
  // the moon's light through the window, falling softly to the left
  const mg=c.createRadialGradient(1560,420,30,1240,560,940);mg.addColorStop(0,"rgba(170,220,225,0.08)");mg.addColorStop(1,"rgba(170,220,225,0)");c.fillStyle=mg;c.fillRect(0,0,W,H);
  // a chart pinned to the wall: a tank's section, in lines
  c.save();c.translate(940,250);c.rotate(-0.012);c.fillStyle="rgba(214,214,198,0.12)";c.fillRect(-170,-110,340,230);c.strokeStyle="rgba(214,226,218,0.24)";c.lineWidth=2;
  c.beginPath();c.ellipse(0,0,120,60,0,0,TAU);c.stroke();for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*38,-50);c.lineTo(i*38,50);c.stroke();}
  c.beginPath();c.moveTo(-150,86);c.lineTo(150,86);c.stroke();c.restore();
  // shelves on the left, with a row of books and boxes
  c.fillStyle="rgb(17,33,37)";c.fillRect(60,196,350,12);c.fillRect(60,336,350,12);
  const R=ag_rnd(17);for(let i=0;i<11;i++){const bw=18+R()*12,bh=70+R()*40;c.fillStyle=rgba(mix([34,52,56],[74,64,52],R()),1);c.fillRect(76+i*30,196-bh,bw,bh);}
  c.fillStyle="rgb(30,46,50)";c.fillRect(100,268,120,68);c.fillRect(240,288,110,48);
  // two lamps over the bench, and their warm light
  wd_lampLight(c,700,300,712,640,1.0);wd_lampLight(c,1220,300,712,640,1.0);wd_shade(c,700,300,1);wd_shade(c,1220,300,1);
  // the floor, out of sight below the bench; the bench: its top seen a little from above, catching the lamps; its front with drawers
  g=c.createLinearGradient(0,712,0,H);g.addColorStop(0,"rgb(14,30,34)");g.addColorStop(1,"rgb(7,17,21)");c.fillStyle=g;c.fillRect(0,712,W,H-712);
  g=c.createLinearGradient(0,704,0,758);g.addColorStop(0,rgba(mix(WD.wood,[20,30,34],0.35),1));g.addColorStop(1,rgba(mix(WD.wood,[255,224,180],0.1),1));c.fillStyle=g;
  c.beginPath();c.moveTo(150,704);c.lineTo(1770,704);c.lineTo(1810,758);c.lineTo(110,758);c.closePath();c.fill();
  c.save();c.globalCompositeOperation="lighter";for(const lx of [700,1220]){const lg=c.createRadialGradient(lx,730,0,lx,730,380);lg.addColorStop(0,rgba(WD.lamp,0.2));lg.addColorStop(1,rgba(WD.lamp,0));
    c.save();c.translate(lx,730);c.scale(1,0.16);c.translate(-lx,-730);c.fillStyle=lg;c.fillRect(lx-380,350,760,760);c.restore();}c.restore();
  c.fillStyle=rgba(mix(WD.wood,[255,224,180],0.25),1);c.fillRect(110,757,1700,3);
  g=c.createLinearGradient(0,760,0,H);g.addColorStop(0,rgba(mix(WD.woodDk,[255,224,180],0.06),1));g.addColorStop(1,rgba(mix(WD.woodDk,[0,0,0],0.4),1));c.fillStyle=g;c.fillRect(110,760,1700,320);
  c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=2;for(const x of [530,960,1390]){c.beginPath();c.moveTo(x,770);c.lineTo(x,1080);c.stroke();}
  c.beginPath();c.moveTo(110,850);c.lineTo(1810,850);c.stroke();c.fillStyle="rgba(214,200,170,0.18)";for(const x of [320,745,1175,1600]){rr(c,x-30,800,60,10,5);c.fill();}
  // the cut-away fuel tank on its cradle: a drum on its side, a quarter cut away to show the baffles inside
  const tx=1000,ty=652,tw=380,th=120;
  c.fillStyle="rgba(0,0,0,0.35)";c.beginPath();c.ellipse(tx+tw/2,ty+th/2+30,tw*0.62,14,0,0,TAU);c.fill();
  g=c.createLinearGradient(0,ty-th/2,0,ty+th/2);g.addColorStop(0,"rgb(200,206,204)");g.addColorStop(0.45,"rgb(146,154,154)");g.addColorStop(1,"rgb(62,70,74)");c.fillStyle=g;
  c.beginPath();c.moveTo(tx,ty-th/2);c.lineTo(tx+tw,ty-th/2);c.ellipse(tx+tw,ty,24,th/2,0,-Math.PI/2,Math.PI/2);c.lineTo(tx,ty+th/2);c.ellipse(tx,ty,24,th/2,0,Math.PI/2,Math.PI*1.5);c.fill();
  c.fillStyle="rgb(26,34,38)";c.fillRect(tx+110,ty-th/2+5,170,th/2-4);for(let i=0;i<5;i++){const bg2=c.createLinearGradient(0,ty-th/2,0,ty);bg2.addColorStop(0,"rgb(174,180,178)");bg2.addColorStop(1,"rgb(86,94,96)");c.fillStyle=bg2;c.fillRect(tx+122+i*34,ty-th/2+7,5,th/2-8);}
  c.strokeStyle="rgba(240,246,240,0.5)";c.lineWidth=1.6;c.beginPath();c.moveTo(tx,ty-th/2+1.5);c.lineTo(tx+tw,ty-th/2+1.5);c.stroke();
  c.fillStyle=rgba(WD.woodDk,1);c.fillRect(tx+44,ty+th/2-6,26,46);c.fillRect(tx+tw-70,ty+th/2-6,26,46);
  // papers on the bench, and a slide rule
  c.save();c.translate(560,728);c.transform(1,0,-0.5,0.32,0,0);c.fillStyle=rgba(mix(WD.paper,WD.lamp,0.22),0.95);c.fillRect(-120,-60,230,110);c.fillStyle="rgba(90,80,70,0.35)";for(let i=0;i<5;i++)c.fillRect(-100,-40+i*18,170,4);c.restore();
  c.save();c.translate(830,740);c.transform(1,0,-0.5,0.32,0,0);c.fillStyle="rgba(214,206,186,0.85)";c.fillRect(-120,-12,240,24);c.restore();
  wd_vignette(c,960,600,360,1240,0.58);};

AG_PLACES.wdSea=c=>{const hz=560;wd_sky(c,hz,{seed:23,stars:150,moon:[1480,210,20],glow:[[60,120,130],140,0.16]});wd_clouds(c,470,5,[110,160,170],0.06,4);
  const g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(WD.sea0,1));g.addColorStop(1,rgba(WD.sea1,1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  // the moon's path on the water: short soft strokes, brighter near the horizon under the moon
  const R=ag_rnd(31);for(let i=0;i<300;i++){const d=R(),y=hz+6+Math.pow(d,1.5)*(H-hz-10),x=1480+(R()-0.5)*(70+d*560),w=12+R()*(26+d*100);
    c.fillStyle="rgba(206,234,232,"+((0.2-d*0.15)*(0.4+R()*0.6)).toFixed(3)+")";c.fillRect(x-w/2,y,w,1.2+d*1.8);}
  // the sea's slow swell
  c.strokeStyle="rgba(120,180,190,0.05)";c.lineWidth=2;for(let j=0;j<16;j++){const y=hz+Math.pow((j+1)/16,1.7)*(H-hz);c.beginPath();c.moveTo(0,y);for(let x=0;x<=W;x+=80)c.lineTo(x,y+Math.sin(x*0.004+j)*3);c.stroke();}
  c.fillStyle="rgba(170,220,225,0.16)";c.fillRect(0,hz,W,1.2);wd_vignette(c,960,560,400,1250,0.5);};

AG_PLACES.wdTable=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(8,20,24)");g.addColorStop(1,"rgb(14,29,33)");c.fillStyle=g;c.fillRect(0,0,W,H);
  wd_lampLight(c,960,236,600,1100,1.0);wd_shade(c,960,236,1.25);
  // the table, seen from above at an angle: its top receding, lit under the lamp; its front edge
  g=c.createLinearGradient(0,560,0,830);g.addColorStop(0,"rgb(40,48,50)");g.addColorStop(1,"rgb(64,72,72)");c.fillStyle=g;
  c.beginPath();c.moveTo(420,560);c.lineTo(1500,560);c.lineTo(1790,830);c.lineTo(130,830);c.closePath();c.fill();
  c.save();c.beginPath();c.moveTo(420,560);c.lineTo(1500,560);c.lineTo(1790,830);c.lineTo(130,830);c.closePath();c.clip();c.globalCompositeOperation="lighter";
  const tg=c.createRadialGradient(960,680,0,960,680,720);tg.addColorStop(0,rgba(WD.lamp,0.26));tg.addColorStop(0.55,rgba(WD.lamp,0.08));tg.addColorStop(1,rgba(WD.lamp,0));c.save();c.translate(960,680);c.scale(1,0.42);c.translate(-960,-680);c.fillStyle=tg;c.fillRect(0,0,W,H*2);c.restore();c.restore();
  c.fillStyle="rgba(236,226,200,0.22)";c.fillRect(130,830,1660,2);g=c.createLinearGradient(0,832,0,H);g.addColorStop(0,"rgb(24,30,32)");g.addColorStop(1,"rgb(10,16,18)");c.fillStyle=g;c.fillRect(130,832,1660,248);
  // torn panels of the fuselage's skin lying on it: two straight seams lined with rivets, two torn edges, the skin's curve in its light;
  // one with a window's opening in it. Each: its shadow, its edge's thickness, its face
  const R=ag_rnd(77),panel=(x,y,w,h,rot,win)=>{const pts=[],riv=[],jag=n=>(R()-0.5)*n;
    for(let i=0;i<=8;i++){const px=-w/2+w*i/8,py=-h/2;pts.push([px,py]);if(i>0&&i<8)riv.push([px,py+9]);}
    for(let i=1;i<6;i++)pts.push([w/2+jag(26)-(i%2)*12,-h/2+h*i/6]);
    for(let i=8;i>=0;i--){const px=-w/2+w*i/8+jag(6),py=h/2+(i%2?jag(14):0);pts.push([px,py]);}
    for(let i=5;i>0;i--)pts.push([-w/2+jag(22)+(i%2)*10,-h/2+h*i/6]);
    c.save();c.translate(x,y);c.rotate(rot);const path=(dx,dy)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0]+dx,p[1]+dy):c.moveTo(p[0]+dx,p[1]+dy));c.closePath();};
    c.fillStyle="rgba(0,0,0,0.45)";path(10,14);c.fill();c.fillStyle="rgb(66,74,78)";path(0,6);c.fill();
    const pg=c.createLinearGradient(0,-h/2,0,h/2);pg.addColorStop(0,"rgb(126,134,136)");pg.addColorStop(0.35,"rgb(212,218,214)");pg.addColorStop(0.6,"rgb(168,176,176)");pg.addColorStop(1,"rgb(110,120,124)");
    c.fillStyle=pg;path(0,0);c.fill();c.strokeStyle="rgba(244,248,244,0.4)";c.lineWidth=1.4;c.stroke();
    c.fillStyle="rgba(30,36,40,0.85)";for(const [rx,ry] of riv){c.beginPath();c.arc(rx,ry,2.6,0,TAU);c.fill();}
    c.strokeStyle="rgba(60,70,74,0.55)";c.lineWidth=1.4;c.beginPath();c.moveTo(-w/2,-h/2+18);c.lineTo(w/2-16,-h/2+18);c.stroke();
    if(win){c.fillStyle="rgb(36,44,48)";rr(c,win[0]-20,win[1]-16,40,32,6);c.fill();c.strokeStyle="rgba(244,248,244,0.35)";c.lineWidth=1.2;rr(c,win[0]-20,win[1]-16,40,32,6);c.stroke();}
    c.restore();};
  panel(640,694,300,100,-0.06,[30,10]);panel(1000,664,350,92,0.03,null);panel(1310,706,250,90,-0.1,null);panel(870,778,210,66,0.12,null);
  wd_vignette(c,960,600,280,1150,0.62);};

AG_PLACES.wdApron=c=>{const hz=600;wd_sky(c,hz,{seed:41,stars:36,top:[9,24,32],low:[52,60,66],glow:[[236,160,112],220,0.36]});wd_clouds(c,500,7,[230,170,140],0.10,12);
  // the terminal far off on the left: a long low building, its windows lit, and the control tower
  c.fillStyle="rgb(13,22,26)";c.fillRect(0,500,620,hz-500);c.fillRect(470,420,80,90);c.fillStyle="rgb(18,29,33)";c.fillRect(452,400,116,24);
  for(let i=0;i<11;i++){c.fillStyle=rgba(WD.warm,0.66);c.fillRect(26+i*52,536,28,20);}c.fillStyle=rgba(WD.warm,0.5);c.fillRect(480,432,60,18);
  c.save();c.globalCompositeOperation="lighter";const tl=c.createRadialGradient(320,560,0,320,560,380);tl.addColorStop(0,rgba(WD.warm,0.10));tl.addColorStop(1,rgba(WD.warm,0));c.fillStyle=tl;c.fillRect(0,300,800,400);c.restore();
  // the apron, wet: the sky's glow in it, the terminal's light, and its small lamps
  const g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(40,44,48)");g.addColorStop(0.25,"rgb(22,30,34)");g.addColorStop(1,"rgb(8,15,18)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.fillStyle=rgba(WD.warm,0.06);for(let i=0;i<11;i++)c.fillRect(26+i*52,hz+6,28,90);
  c.strokeStyle="rgba(214,200,150,0.10)";c.lineWidth=3;c.beginPath();c.moveTo(0,880);c.bezierCurveTo(600,820,1300,800,W,812);c.stroke();
  const R=ag_rnd(5);for(let i=0;i<22;i++){const x=R()*W,y=hz+4+R()*22;c.fillStyle=rgba(R()<0.6?WD.warm:[226,236,236],0.6);c.beginPath();c.arc(x,y,2,0,TAU);c.fill();}
  wd_vignette(c,1000,640,420,1250,0.5);};

AG_PLACES.wdHigh=c=>{wd_sky(c,H,{seed:61,stars:180,moon:[1720,140,15],low:[16,40,48]});wd_clouds(c,900,9,[120,170,180],0.08,6);wd_clouds(c,980,7,[120,170,180],0.06,9);};

AG_PLACES.wdCoast=c=>{const hz=610;wd_sky(c,hz,{seed:73,stars:140,moon:[320,190,14]});
  // low hills along the coast, two layers, and a town's few lights at the shore
  c.fillStyle="rgb(12,25,29)";c.beginPath();c.moveTo(0,hz);for(let x=0;x<=W;x+=40)c.lineTo(x,hz-64-Math.sin(x*0.004)*30-Math.sin(x*0.011)*12);c.lineTo(W,hz);c.closePath();c.fill();
  c.fillStyle="rgb(8,19,23)";c.beginPath();c.moveTo(0,hz+10);for(let x=0;x<=W;x+=40)c.lineTo(x,hz-22-Math.sin(x*0.006+1)*18);c.lineTo(W,hz+10);c.closePath();c.fill();
  const R=ag_rnd(8);for(let i=0;i<28;i++){const x=1120+R()*600,y=hz-6+R()*10;c.fillStyle=rgba(WD.warm,0.5+R()*0.4);c.fillRect(x,y,2.4,2.4);}
  const g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(WD.sea0,1));g.addColorStop(1,rgba(WD.sea1,1));c.fillStyle=g;c.fillRect(0,hz+8,W,H-hz-8);
  c.strokeStyle="rgba(120,180,190,0.05)";c.lineWidth=2;for(let j=0;j<12;j++){const y=hz+8+Math.pow((j+1)/12,1.7)*(H-hz);c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  for(let i=0;i<46;i++){const x=1120+R()*600,y=hz+12+R()*70;c.fillStyle=rgba(WD.warm,0.06+R()*0.1);c.fillRect(x,y,2+R()*12,1.2);}
  wd_vignette(c,960,560,400,1250,0.5);};

AG_PLACES.wdDawn=c=>{wd_sky(c,H,{seed:91,stars:30,top:[12,30,44],low:[150,116,100],glow:[[255,196,148],420,0.36]});wd_clouds(c,880,10,[255,214,186],0.14,3);wd_clouds(c,960,8,[220,190,180],0.12,7);};

/* ---------------------------------------------------------------- the things the story keeps */
// the recorder: a small steel box, its lid off, two spools and a loop of fine steel wire running between them, turning (t), o.glow its light
function wd_recorder(c,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);
  if(o.glow)dp_halo(c,0,0,320,DP.ice,0.2*o.glow);
  c.save();c.shadowColor="rgba(0,0,0,0.55)";c.shadowBlur=26;c.shadowOffsetY=12;const g=c.createLinearGradient(0,-110,0,110);g.addColorStop(0,"rgb(92,104,108)");g.addColorStop(1,"rgb(44,52,56)");
  c.fillStyle=g;rr(c,-190,-110,380,220,16);c.fill();c.restore();
  c.fillStyle="rgb(16,24,28)";rr(c,-170,-90,340,180,10);c.fill();c.strokeStyle="rgba(214,232,232,0.35)";c.lineWidth=2;rr(c,-189,-109,378,218,15);c.stroke();
  // the spools, turning
  for(const sx of [-82,82]){const sg=c.createRadialGradient(sx,0,4,sx,0,58);sg.addColorStop(0,"rgb(150,160,160)");sg.addColorStop(1,"rgb(72,82,86)");c.fillStyle=sg;c.beginPath();c.arc(sx,0,58,0,TAU);c.fill();
    c.strokeStyle="rgba(30,40,44,0.8)";c.lineWidth=3;for(let k=0;k<3;k++){const an=(t||0)*2.2+k*TAU/3;c.beginPath();c.moveTo(sx+Math.cos(an)*14,Math.sin(an)*14);c.lineTo(sx+Math.cos(an)*48,Math.sin(an)*48);c.stroke();}
    c.fillStyle="rgb(40,50,54)";c.beginPath();c.arc(sx,0,12,0,TAU);c.fill();}
  // the loop of wire, a fine line of light along the spools' tops and bottoms, a bead of light running along it (what's being kept)
  c.strokeStyle="rgba(214,240,240,0.85)";c.lineWidth=1.6;c.beginPath();c.moveTo(-82,-60);c.lineTo(82,-60);c.arc(82,0,60,-Math.PI/2,Math.PI/2);c.lineTo(-82,60);c.arc(-82,0,60,Math.PI/2,Math.PI*1.5);c.stroke();
  const L=2*164+2*Math.PI*60,u=(((t||0)*90)%L+L)%L;let bx,by;if(u<164){bx=-82+u;by=-60;}else if(u<164+Math.PI*60){const an=-Math.PI/2+(u-164)/60;bx=82+Math.cos(an)*60;by=Math.sin(an)*60;}
  else if(u<328+Math.PI*60){bx=82-(u-164-Math.PI*60);by=60;}else{const an=Math.PI/2+(u-328-Math.PI*60)/60;bx=-82+Math.cos(an)*60;by=Math.sin(an)*60;}
  c.save();c.globalCompositeOperation="lighter";const bg=c.createRadialGradient(bx,by,0,bx,by,18);bg.addColorStop(0,"rgba(220,250,250,0.95)");bg.addColorStop(1,"rgba(220,250,250,0)");c.fillStyle=bg;c.fillRect(bx-18,by-18,36,36);c.restore();
  // the head that writes on the wire
  c.fillStyle="rgb(120,132,134)";rr(c,-14,52,28,22,4);c.fill();
  c.restore();}
// headphones of the 1950s, on a table, seen from the front: the band and two round cups
function wd_phones(c,x,y,s,a){if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);c.strokeStyle="rgb(40,46,48)";c.lineWidth=10;c.lineCap="round";
  c.beginPath();c.arc(0,10,86,Math.PI*1.08,Math.PI*1.92);c.stroke();c.strokeStyle="rgba(214,232,232,0.3)";c.lineWidth=2;c.beginPath();c.arc(0,10,90,Math.PI*1.12,Math.PI*1.88);c.stroke();
  for(const sx of [-82,82]){const g=c.createRadialGradient(sx-8,26,4,sx,32,40);g.addColorStop(0,"rgb(96,104,106)");g.addColorStop(1,"rgb(30,36,38)");c.fillStyle=g;c.beginPath();c.ellipse(sx,34,30,36,0,0,TAU);c.fill();}
  c.restore();}
// a coral question mark in a ring of light: something no one can know; k springs it in
function wd_qmark(c,x,y,r,k,a){if(!(k>0)||a<=0)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(k,k);const col=DP.F.coral;
  c.shadowColor=rgba(col,0.7);c.shadowBlur=16;c.fillStyle="rgba(40,14,16,0.95)";c.beginPath();c.arc(0,0,r,0,TAU);c.fill();c.shadowBlur=0;c.strokeStyle=rgba(col,1);c.lineWidth=3;c.beginPath();c.arc(0,0,r-1.5,0,TAU);c.stroke();
  dp_T(c,"?",0,r*0.38,{w:800,size:Math.round(r*1.15),align:"center",col:"coral",deco:1});c.restore();}

// the boarding steps: a stair from the ground at (x, yg) up to a door at (dx, dy), its rails and steps in light
function wd_stair(c,x,yg,dx,dy,a){if(a<=0)return;c.save();c.globalAlpha*=a;const n=11;
  // its frame on wheels, and the stair: a solid side, its steps, its rail
  c.fillStyle="rgb(26,34,38)";c.fillRect(x-70,yg-26,150,20);for(const wx of [x-50,x+60]){c.fillStyle="rgb(12,16,18)";c.beginPath();c.arc(wx,yg-8,10,0,TAU);c.fill();}
  const side=cc=>{cc.beginPath();cc.moveTo(x-60,yg-26);cc.lineTo(dx-6,dy+30);cc.lineTo(dx-6,dy+6);cc.lineTo(x-60,yg-58);cc.closePath();};
  c.strokeStyle="rgba(206,222,222,0.35)";c.lineWidth=2;for(let i=1;i<n;i++){const u=i/n,px=lerp(x-60,dx-6,u),py=lerp(yg-40,dy+16,u);c.beginPath();c.moveTo(px-12,py);c.lineTo(px+14,py);c.stroke();}
  side(c);const g=c.createLinearGradient(x,yg,dx,dy);g.addColorStop(0,"rgb(40,50,54)");g.addColorStop(1,"rgb(58,70,74)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(214,236,236,0.55)";c.lineWidth=2.4;c.beginPath();c.moveTo(x-60,yg-96);c.lineTo(dx-6,dy-30);c.moveTo(x-60,yg-58);c.lineTo(x-60,yg-96);c.moveTo(lerp(x-60,dx-6,0.5),lerp(yg-58,dy+6,0.5));c.lineTo(lerp(x-60,dx-6,0.5),lerp(yg-96,dy-30,0.5));c.stroke();
  c.restore();}
// a passenger far off, walking: a dark coat, a hat or bare head, the sky's light along their back; h their height, ph their step
function wd_walker(c,x,y,h,ph,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;const k=h/100;
  // a soft shadow under the feet, then the figure, lit from the open door in front of them
  c.fillStyle="rgba(0,0,0,0.38)";c.beginPath();c.ellipse(x,y+1,18*k,4.5*k,0,0,TAU);c.fill();
  c.translate(x,y);const sw=Math.sin(ph)*8*k,f=o.flip?-1:1;c.scale(f,1);
  const col=o.col||[78,84,88],g=c.createLinearGradient(0,-100*k,0,0);g.addColorStop(0,rgba(mix(col,[255,214,170],0.2),1));g.addColorStop(1,rgba(mix(col,[0,0,0],0.4),1));
  c.fillStyle=rgba(mix(col,[0,0,0],0.45),1);
  c.beginPath();c.moveTo(-6*k,-46*k);c.lineTo(-2*k+sw,0);c.lineTo(4*k+sw,0);c.lineTo(4*k,-46*k);c.closePath();c.fill();
  c.beginPath();c.moveTo(-2*k,-46*k);c.lineTo(2*k-sw,0);c.lineTo(8*k-sw,0);c.lineTo(8*k,-46*k);c.closePath();c.fill();
  c.fillStyle=g;c.beginPath();c.moveTo(-10*k,-80*k);c.bezierCurveTo(-14*k,-60*k,-14*k,-44*k,-12*k,-30*k);c.lineTo(14*k,-30*k);c.bezierCurveTo(14*k,-48*k,12*k,-66*k,8*k,-80*k);c.closePath();c.fill();
  c.fillStyle="rgb(122,98,82)";c.beginPath();c.arc(-1*k,-89*k,8*k,0,TAU);c.fill();
  if(o.hat){c.fillStyle="rgb(44,44,46)";c.fillRect(-12*k,-95*k,22*k,3*k);c.fillRect(-7*k,-102*k,13*k,8*k);}
  if(o.bag){c.fillStyle="rgb(96,70,52)";c.fillRect(10*k,-44*k,12*k,10*k);}
  // the door's warm light on the side that faces it
  c.strokeStyle="rgba(255,206,150,0.6)";c.lineWidth=2;c.beginPath();c.moveTo(8*k,-80*k);c.bezierCurveTo(12*k,-66*k,14*k,-48*k,14*k,-30*k);c.stroke();
  c.beginPath();c.arc(-1*k,-89*k,8*k,-0.9,0.9);c.stroke();c.restore();}
// Warren's note on the bench, in the bench's perspective, warm in the lamp's light: its lines written one by one as u runs 0 to 1
function wd_benchNote(c,x,y,u,a){if(!(a>0))return;c.save();c.globalAlpha*=a;
  const g=c.createRadialGradient(x,y,0,x,y,190);g.addColorStop(0,"rgba(255,214,160,0.26)");g.addColorStop(1,"rgba(255,214,160,0)");c.fillStyle=g;c.fillRect(x-190,y-100,380,200);
  c.translate(x,y);c.transform(1,0,-0.5,0.32,0,0);
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=10;c.shadowOffsetY=8;c.fillStyle=rgba(mix(WD.paper,WD.lamp,0.32),1);c.fillRect(-120,-90,220,170);c.restore();
  c.fillStyle=rgba(WD.ink,0.8);c.fillRect(-100,-72,120,9);
  const n=7;for(let i=0;i<n;i++){const kk=clamp(u*n-i,0,1);if(kk<=0)break;c.fillRect(-100,-48+i*17,(150-(i%3)*22)*kk,5);}
  c.restore();}
