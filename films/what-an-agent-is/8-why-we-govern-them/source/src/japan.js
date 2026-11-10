/* ===== Why we govern them: Japan, 1964, and the line today =====
   The opening's own pictures, drawn once in the module's matte language (soft gradients, matte shapes, the light from the right, the
   same calm palette as the lab), all prefixed wg_ / WG_:
     places (painted once): the platform in morning light, the line along an embankment past fields and low hills, plain track at
     night (Tokyo, 1962), a carriage of passengers, the driver's cab, and the control room;
     live pieces: the train, at rest or gliding (a long white body, a slate band under the windows, a rounded nose, no logo and no
     number; the slate isn't the module's blue, which means tools and structure), today's longer, sleeker train, a signal beside the
     track, the speedometer and the speed allowed above it, the board's lights, the corner tag, and the people of 1964, dressed for
     their time (a driver in a dark uniform and cap, controllers in white shirts and ties, passengers in suits, dresses and coats).
   No Japanese words, patterns, art styles or landmarks: signs are blank, and the corner names the place and the year. */

const WGC={sky0:[186,198,208],sky1:[236,229,214],sun:[255,244,222],haze:[204,208,212],concrete:[214,209,199],concreteDk:[178,173,164],
  body:[244,242,236],bodyShade:[210,207,200],band:[74,86,100],glass:[46,54,66],skirt:[132,136,140],rail:[128,124,118],ballast:[150,145,136],
  grass:[150,160,124],grassDk:[118,130,100],field:[168,176,130],hill:[156,168,156],night0:[30,36,50],night1:[56,62,80],red:[214,58,48]};

/* ---------------------------------------------------------------- people of 1964
   ag_person specs: a cap for the driver, a tie for a shirt; skin and hair as the people of the line, dressed as photographs of the
   time show city people. Each has its own key, so it's painted once. */
function wg_cap(col){return(c,P)=>{const d=ag_dk(col,0.35);
  ag_soft(c,cc=>{cc.moveTo(204,352);cc.bezierCurveTo(198,314,212,278,250,266);cc.bezierCurveTo(300,252,364,258,394,284);cc.bezierCurveTo(406,300,406,330,398,352);cc.closePath();},
    col,ag_lt(col,0.3),352,282,120,rgba(ag_dk(col,0.7),0.4),12);
  ag_soft(c,cc=>{cc.moveTo(206,344);cc.lineTo(398,344);cc.lineTo(396,370);cc.lineTo(210,372);cc.closePath();},d,ag_lt(col,0.12),340,352,80,null);
  ag_soft(c,cc=>{cc.moveTo(350,364);cc.bezierCurveTo(382,360,418,364,440,378);cc.bezierCurveTo(424,388,382,388,350,378);cc.closePath();},[30,32,36],[96,100,108],404,370,40,null);
  ag_soft(c,cc=>cc.ellipse(372,316,11,13,0,0,TAU),[214,206,184],[255,250,236],370,312,12,null);};}
// a brimmed hat, worn on the head: its band just above the ear, the brim over the brow
function wg_hat(col){return(c,P)=>{c.save();c.translate(0,22);
  ag_soft(c,cc=>{cc.moveTo(214,330);cc.bezierCurveTo(212,286,240,258,290,254);cc.bezierCurveTo(342,250,382,268,390,312);cc.lineTo(394,338);cc.closePath();},col,ag_lt(col,0.28),350,270,110,rgba(ag_dk(col,0.7),0.4),12);
  c.strokeStyle=rgba(ag_dk(col,0.4),0.7);c.lineWidth=4;c.beginPath();c.moveTo(262,262);c.quadraticCurveTo(300,282,350,262);c.stroke();
  ag_soft(c,cc=>{cc.moveTo(214,322);cc.lineTo(394,326);cc.lineTo(394,340);cc.lineTo(214,338);cc.closePath();},[34,34,38],[90,90,96],330,330,60,null);
  ag_soft(c,cc=>cc.ellipse(306,340,124,16,-0.04,0,TAU),ag_dk(col,0.12),ag_lt(col,0.25),380,334,120,rgba(ag_dk(col,0.7),0.35),6);c.restore();};}
function wg_tie(col){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  ag_soft(c,cc=>{cc.moveTo(302,616);cc.lineTo(324,614);cc.lineTo(330,642);cc.lineTo(338,820);cc.lineTo(320,850);cc.lineTo(304,820);cc.lineTo(306,644);cc.closePath();},
    col,ag_lt(col,0.3),326,680,90,rgba(ag_dk(col,0.7),0.4),8);c.restore();};}
const WG_P={
  driver:{key:"wg_driver",name:"the driver",skin:[226,188,154],hair:{style:"cropped",c:[22,20,24]},top:{kind:"suit",c:[40,48,62],inner:[232,234,236],tie:[34,38,48]},hat:{paint:wg_cap([42,50,64])},breath:0.27},
  ctrlA:{key:"wg_ctrlA",name:"a controller",skin:[222,182,148],hair:{style:"side",c:[24,22,26]},glasses:[40,40,44],top:{kind:"shirt",c:[240,240,236],paint:wg_tie([70,76,92])},breath:0.29},
  ctrlB:{key:"wg_ctrlB",name:"a second controller",skin:[216,176,142],hair:{style:"cropped",c:[30,28,30]},top:{kind:"shirt",c:[236,236,232],paint:wg_tie([96,70,68])},breath:0.26},
  clerk:{key:"wg_clerk",name:"an office worker",skin:[224,186,152],hair:{style:"side",c:[22,20,24]},glasses:[36,36,40],top:{kind:"suit",c:[64,66,72],inner:[234,236,238],tie:[60,64,84]},breath:0.28},
  oldMan:{key:"wg_oldMan",name:"an older man",skin:[214,176,144],hair:{style:"cropped",c:[176,176,178]},glasses:[60,56,52],top:{kind:"suit",c:[96,86,74],inner:[232,230,224],tie:[84,64,60]},breath:0.24},
  oldWoman:{key:"wg_oldWoman",name:"an older woman",skin:[222,186,156],hair:{style:"bun",c:[150,150,154]},earrings:[220,214,200],top:{kind:"cardigan",c:[150,120,118],inner:[236,232,226]},breath:0.25},
  mother:{key:"wg_mother",name:"a mother",skin:[230,194,162],hair:{style:"bob",c:[26,24,28]},top:{kind:"blazer",c:[200,186,160],inner:[240,236,228]},breath:0.3},
  manHat:{key:"wg_manHat",name:"a man in a hat",skin:[220,182,148],hair:{style:"cropped",c:[24,22,24]},top:{kind:"suit",c:[58,60,66],inner:[236,236,238],tie:[52,56,74]},hat:{paint:wg_hat([92,88,80])},breath:0.26},
  womanCoat:{key:"wg_womanCoat",name:"a woman in a light coat",skin:[230,194,164],hair:{style:"bob",c:[28,24,28]},earrings:[226,214,196],top:{kind:"blazer",c:[208,196,172],inner:[232,226,214]},breath:0.31},
  youngMan:{key:"wg_youngMan",name:"a young man",skin:[218,180,146],hair:{style:"side",c:[20,18,22]},top:{kind:"cardigan",c:[120,112,100],inner:[236,236,232]},breath:0.3},
  child:{key:"wg_child",name:"a child",skin:[234,198,166],hair:{style:"side",c:[24,22,26]},top:{kind:"sweater",c:[138,92,96]},breath:0.36}
};

/* ---------------------------------------------------------------- the corner tag: where and when, at the top left */
function wg_corner(ctx,text,a){if(a<=0)return;const w=ag_tw(ctx,text,{w:700,size:30,ls:3})+56;
  ag_box(ctx,72,64,w,62,31,{a:a*0.92});ag_T(ctx,text.toUpperCase(),100,106,{w:700,size:30,ls:3,col:AG.kick,a});}

/* ---------------------------------------------------------------- the sky, hills and ground, shared by the places outside */
function wg_sky(c,top,bot,y0,y1,sunX,sunY,sunA){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(top,1));g.addColorStop(1,rgba(bot,1));c.fillStyle=g;c.fillRect(0,y0,W,y1-y0);
  if(sunA>0){const s=c.createRadialGradient(sunX,sunY,10,sunX,sunY,900);s.addColorStop(0,rgba(WGC.sun,0.55*sunA));s.addColorStop(0.4,rgba(WGC.sun,0.18*sunA));s.addColorStop(1,rgba(WGC.sun,0));c.fillStyle=s;c.fillRect(0,y0,W,y1-y0);}}
// a soft ridge of hills: a wandering top edge, filled down to y1, a little lighter at the top (the haze)
function wg_ridge(c,base,amp,col,y1,seed,fr,hazeA){const R=ag_rnd(seed);const ph=[R()*9,R()*9,R()*9];c.beginPath();c.moveTo(0,y1);
  for(let x=0;x<=W;x+=12){const y=base-amp*(0.55*Math.sin(x*fr+ph[0])+0.3*Math.sin(x*fr*2.3+ph[1])+0.15*Math.sin(x*fr*5.1+ph[2]));c.lineTo(x,y);}
  c.lineTo(W,y1);c.closePath();const g=c.createLinearGradient(0,base-amp,0,y1);g.addColorStop(0,rgba(mix(col,WGC.haze,hazeA),1));g.addColorStop(1,rgba(col,1));c.fillStyle=g;c.fill();}

/* ---------------------------------------------------------------- the platform, in morning light (the place "wgPlatform")
   Seen across the track from our platform: a far platform under a long low roof, the city soft in the haze beyond, the track, and our
   own platform's edge in front, which hides the train's wheels, as it does from where a passenger stands. The train is drawn live,
   then wg_platformFront over it. */
const WG_PLAT={rail:708,edge:694};
function wg_paintPlatform(c,o){o=o||{};const ev=!!o.dusk;if(ev)wg_sky(c,[176,170,186],[246,206,164],0,560,1820,420,1.3);else wg_sky(c,[198,208,214],[240,232,216],0,560,1700,180,1);
  // the city, soft in the haze: plain low blocks, no landmark
  const R=ag_rnd(64);for(let i=0;i<34;i++){const x=R()*W,w=60+R()*150,h=30+R()*90;c.fillStyle=rgba(mix([176,184,192],[226,224,218],0.35+R()*0.3),0.75);c.fillRect(x,470-h,w,h+40);}
  // the far platform: its roof, a long low slab, on slim columns; the shade under it
  c.fillStyle=rgba([196,196,192],1);c.fillRect(0,268,W,30);c.fillStyle=rgba([150,150,148],1);c.fillRect(0,296,W,8);
  let g=c.createLinearGradient(0,304,0,520);g.addColorStop(0,"rgba(80,78,74,0.32)");g.addColorStop(1,"rgba(80,78,74,0.12)");c.fillStyle=g;c.fillRect(0,304,W,216);
  for(let x=60;x<W;x+=330){ag_soft(c,cc=>cc.rect(x,304,14,216),[176,176,172],[230,228,222],x+10,320,60,null);}
  c.fillStyle=rgba([206,202,194],1);c.fillRect(0,512,W,22);c.fillStyle=rgba([170,166,158],1);c.fillRect(0,532,W,6);
  // the track bed between the platforms, in soft shade
  g=c.createLinearGradient(0,538,0,WG_PLAT.rail+20);g.addColorStop(0,rgba([120,116,110],1));g.addColorStop(1,rgba(WGC.ballast,1));c.fillStyle=g;c.fillRect(0,538,W,WG_PLAT.rail+20-538);
  // morning light across everything from the right
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,ev?"rgba(40,30,44,0.22)":"rgba(40,34,28,0.12)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,ev?"rgba(255,190,120,0.2)":"rgba(255,246,226,0.14)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // our own roof's edge across the top of the frame
  g=c.createLinearGradient(0,0,0,86);g.addColorStop(0,"rgba(96,94,90,1)");g.addColorStop(1,"rgba(132,130,126,1)");c.fillStyle=g;c.fillRect(0,0,W,78);c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(0,76,W,2);}
function wg_platformFront(ctx,dusk){const y=WG_PLAT.edge;
  // our platform: pale concrete, its edge a little lighter, seen a little from above, running out of the frame's foot
  ctx.save();let g=ctx.createLinearGradient(0,y,0,H);g.addColorStop(0,rgba(WGC.concrete,1));g.addColorStop(1,rgba(WGC.concreteDk,1));ctx.fillStyle=g;ctx.fillRect(0,y,W,H-y);
  ctx.fillStyle="rgba(255,255,255,0.55)";ctx.fillRect(0,y,W,3);ctx.fillStyle="rgba(60,54,46,0.18)";ctx.fillRect(0,y+3,W,10);
  ctx.fillStyle="rgba(240,236,226,0.7)";ctx.fillRect(0,y+46,W,6);
  if(dusk){g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,40,0.18)");g.addColorStop(1,"rgba(255,186,120,0.12)");ctx.fillStyle=g;ctx.fillRect(0,y,W,H-y);}
  ctx.restore();}

/* ---------------------------------------------------------------- the line along an embankment (the place "wgCountry") */
const WG_LINE={rail:690};
function wg_paintCountry(c){wg_sky(c,[184,198,212],[236,232,220],0,520,1600,140,0.8);
  // two soft clouds, very faint
  for(const [x,y,r] of [[420,150,170],[1340,110,130]]){const g=c.createRadialGradient(x,y,10,x,y,r);g.addColorStop(0,"rgba(255,255,255,0.32)");g.addColorStop(1,"rgba(255,255,255,0)");c.save();c.translate(x,y);c.scale(1.8,0.5);c.translate(-x,-y);c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
  wg_ridge(c,452,50,[162,174,172],600,11,0.0036,0.55);wg_ridge(c,500,36,[146,160,140],620,23,0.0052,0.3);
  // the fields: long bands, wider towards us, each a little different
  const R=ag_rnd(5);let y=540,h=6;while(y<WG_LINE.rail+6){c.fillStyle=rgba(mix(WGC.field,[146,160,118],R()*0.8),1);c.fillRect(0,y,W,h+1);c.fillStyle="rgba(255,255,240,0.1)";c.fillRect(0,y,W,1);y+=h;h*=1.32;}
  // the embankment: ballast on top, the rails' bed, the grassy slope below
  c.fillStyle=rgba(WGC.ballast,1);c.fillRect(0,WG_LINE.rail-4,W,18);c.fillStyle="rgba(255,255,255,0.25)";c.fillRect(0,WG_LINE.rail-4,W,2);
  let g=c.createLinearGradient(0,WG_LINE.rail+14,0,WG_LINE.rail+90);g.addColorStop(0,rgba(WGC.grassDk,1));g.addColorStop(1,rgba(WGC.grass,1));c.fillStyle=g;c.fillRect(0,WG_LINE.rail+14,W,76);
  // the near field, out of focus, darker towards the foot of the frame
  g=c.createLinearGradient(0,WG_LINE.rail+90,0,H);g.addColorStop(0,rgba([158,168,128],1));g.addColorStop(1,rgba([120,132,100],1));c.fillStyle=g;c.fillRect(0,WG_LINE.rail+90,W,H-WG_LINE.rail-90);
  c.fillStyle="rgba(255,255,240,0.14)";c.fillRect(0,WG_LINE.rail+90,W,2);
  // the light from the right
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.1)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,246,226,0.12)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the rails and the masts that carry the wires, drawn live so they can pass: off is how far the scenery has moved to the left
function wg_lineFront(ctx,off,o){o=o||{};const r=WG_LINE.rail;ctx.save();
  ctx.fillStyle=rgba(WGC.rail,1);ctx.fillRect(0,r-2,W,4);ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(0,r-2,W,1);
  // the overhead wire and its masts
  ctx.strokeStyle="rgba(70,72,76,0.55)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,r-232);ctx.lineTo(W,r-232);ctx.stroke();
  const P=520,x0=((-off)%P+P)%P-P;for(let x=x0;x<W+P;x+=P){ag_soft(ctx,cc=>cc.rect(x,r-262,10,262),[112,114,118],[170,172,176],x+8,r-250,40,null);ctx.fillStyle="rgba(90,92,96,1)";ctx.fillRect(x-6,r-248,46,6);}
  ctx.restore();}

/* ---------------------------------------------------------------- the train
   wg_train(ctx, x, y, o): x is the tip of its nose, y the top of the rails, o.k its size (1: a body 214 px tall), o.cars how many cars
   reach back from the nose (the frame is the limit), o.today today's train, longer and sleeker; o.lamp the headlight's glow (0 to 1);
   o.people faint passengers in the windows; o.driver the driver's head in the cab's window; o.a. Light from the right; no logo,
   no number. */
function wg_noseShape(k,today){return today?
  c=>{c.moveTo(-1260*k,-196*k);c.bezierCurveTo(-900*k,-196*k,-620*k,-186*k,-420*k,-150*k);c.bezierCurveTo(-240*k,-118*k,-80*k,-82*k,-8*k,-52*k);
    c.bezierCurveTo(6*k,-44*k,4*k,-30*k,-12*k,-24*k);c.lineTo(-1260*k,-24*k);c.closePath();}:
  c=>{c.moveTo(-460*k,-214*k);c.bezierCurveTo(-270*k,-214*k,-120*k,-196*k,-48*k,-130*k);c.bezierCurveTo(-14*k,-100*k,2*k,-76*k,0,-58*k);
    c.bezierCurveTo(-2*k,-42*k,-16*k,-30*k,-44*k,-26*k);c.lineTo(-460*k,-26*k);c.closePath();};}
function wg_train(ctx,x,y,o){o=o||{};const k=o.k||1,a=o.a==null?1:o.a,today=!!o.today,carL=(today?1700:1500)*k,cars=o.cars||3,top=today?-196*k:-214*k,bot=today?-24*k:-26*k;
  if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);
  const back=-carL*cars;
  // its shadow on the track bed
  ag_floorShadow(ctx,(back)/2,6*k,(-back)/2,10*k,0.3);
  // wheels and bogies under the skirt, in shadow
  ctx.fillStyle=rgba([46,48,52],1);for(let i=0;i<cars;i++){const cx=-carL*i;for(const b of [-carL+190*k,-180*k])for(const d of [-46*k,46*k]){ctx.beginPath();ctx.arc(cx+b+d,-14*k,14*k,0,TAU);ctx.fill();}}
  const nose=wg_noseShape(k,today),noseL=today?1260*k:460*k;
  // the body: the cars behind the nose's own, then the lead car with its nose
  const body=c=>{c.moveTo(back,bot);c.lineTo(back,top+14*k);c.quadraticCurveTo(back,top,back+14*k,top);c.lineTo(-noseL,top);c.lineTo(-noseL,bot);c.closePath();};
  const fillBody=(fn)=>{ag_soft(ctx,fn,WGC.body,[255,255,252],-200*k,top+20*k,900*k,"rgba(70,64,56,0.22)",18*k);};
  fillBody(body);fillBody(nose);
  // shade on the lower half, light along the roof
  ctx.save();ctx.beginPath();body(ctx);nose(ctx);ctx.clip();
  let g=ctx.createLinearGradient(0,top,0,bot);g.addColorStop(0,"rgba(255,255,255,0.5)");g.addColorStop(0.18,"rgba(255,255,255,0)");g.addColorStop(0.62,"rgba(60,56,50,0)");g.addColorStop(1,"rgba(60,56,50,0.2)");
  ctx.fillStyle=g;ctx.fillRect(back,top,-back+10*k,bot-top);
  // the slate band under the windows (today's train: a thin line), round the nose
  const b0=today?-80*k:-86*k,b1=today?-70*k:-60*k;ctx.fillStyle=rgba(WGC.band,1);ctx.fillRect(back,b0,-back+10*k,b1-b0);
  if(!today){ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(back,b0,-back,2*k);}
  // the skirt
  ctx.fillStyle=rgba(WGC.skirt,1);ctx.fillRect(back,bot-14*k,-back+10*k,14*k);
  // windows: a row of small ones (1964), or one long band (today)
  const wy0=today?-150*k:-160*k,wy1=today?-112*k:-118*k;
  for(let i=0;i<cars;i++){const c0=-carL*(i+1),c1=-carL*i-(i===0?noseL+40*k:60*k);
    if(today){ctx.fillStyle=rgba(WGC.glass,1);rr(ctx,c0+120*k,wy0,c1-c0-160*k,wy1-wy0,10*k);ctx.fill();}
    else for(let wx=c0+150*k;wx<c1-40*k;wx+=56*k){ctx.fillStyle=rgba(WGC.glass,1);rr(ctx,wx,wy0,36*k,wy1-wy0,7*k);ctx.fill();
      if(o.people&&hash(Math.round(wx),7)>0.35){ctx.fillStyle="rgba(150,140,130,0.45)";ctx.beginPath();ctx.arc(wx+18*k,wy1-17*k,8*k,0,TAU);ctx.fill();ctx.fillRect(wx+6*k,wy1-9*k,24*k,9*k);}
      ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(wx+3*k,wy0+3*k,10*k,wy1-wy0-6*k);}
    // doors near each end of the car, and the gap between cars
    ctx.strokeStyle="rgba(90,86,80,0.4)";ctx.lineWidth=2;for(const dx of [c0+70*k,c1-10*k]){if(dx<-noseL+20*k||i>0){ctx.strokeRect(dx,-196*k+(today?20*k:0),40*k,170*k-(today?20*k:0));}}
    if(i>0||cars>1){ctx.fillStyle="rgba(50,48,46,0.85)";ctx.fillRect(-carL*(i+1)-6*k,top+10*k,12*k,bot-top-10*k);}}
  ctx.restore();
  // the nose's windscreen and its headlights
  ctx.save();ctx.beginPath();nose(ctx);ctx.clip();
  if(today){ctx.fillStyle=rgba(WGC.glass,1);ctx.beginPath();ctx.moveTo(-760*k,-178*k);ctx.lineTo(-560*k,-172*k);ctx.lineTo(-440*k,-146*k);ctx.lineTo(-700*k,-150*k);ctx.closePath();ctx.fill();}
  else{const ws=cc=>{cc.moveTo(-318*k,-212*k);cc.bezierCurveTo(-240*k,-210*k,-170*k,-200*k,-122*k,-170*k);cc.lineTo(-104*k,-150*k);cc.bezierCurveTo(-170*k,-154*k,-250*k,-158*k,-300*k,-160*k);cc.closePath();};
    ag_soft(ctx,ws,WGC.glass,[120,132,148],-170*k,-200*k,120*k,null);
    if(o.driver){ctx.save();ctx.beginPath();ws(ctx);ctx.clip();ctx.fillStyle="rgba(20,22,26,0.75)";ctx.beginPath();ctx.ellipse(-214*k,-176*k,14*k,16*k,0,0,TAU);ctx.fill();ctx.fillRect(-232*k,-196*k,38*k,9*k);ctx.fillRect(-236*k,-160*k,48*k,20*k);ctx.restore();}
    ctx.fillStyle="rgba(255,255,255,0.2)";ctx.beginPath();ctx.moveTo(-290*k,-209*k);ctx.lineTo(-268*k,-208*k);ctx.lineTo(-246*k,-159*k);ctx.lineTo(-266*k,-159*k);ctx.closePath();ctx.fill();}
  const hl=today?[-40*k,-50*k]:[-26*k,-80*k];ctx.fillStyle=rgba([226,228,226],1);ctx.beginPath();ctx.ellipse(hl[0],hl[1],12*k,9*k,0,0,TAU);ctx.fill();
  ctx.restore();
  if(o.lamp>0){const gg=ctx.createRadialGradient(hl[0],hl[1],0,hl[0],hl[1],80*k);gg.addColorStop(0,"rgba(255,248,220,"+(0.8*o.lamp)+")");gg.addColorStop(1,"rgba(255,248,220,0)");ctx.fillStyle=gg;ctx.fillRect(hl[0]-80*k,hl[1]-80*k,160*k,160*k);}
  // a pantograph on the second car's roof
  if(cars>1){const px=-carL*1.5;ctx.strokeStyle="rgba(70,72,76,0.85)";ctx.lineWidth=3*k;ctx.beginPath();ctx.moveTo(px-50*k,top);ctx.lineTo(px,top-50*k);ctx.lineTo(px+50*k,top);ctx.moveTo(px-30*k,top-50*k);ctx.lineTo(px+30*k,top-50*k);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- a signal beside the track
   wg_signal(ctx, x, y, h, lamp, o): a slim mast from the ground at (x, y), h tall, with a hooded lamp: lamp "red", "green" or null
   (dark); o.glow 0 to 1; o.blur smears it sideways, as it passes the window. */
function wg_signal(ctx,x,y,h,lamp,o){o=o||{};const s=o.s||1,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const draw=(dx,al)=>{ctx.save();ctx.globalAlpha*=al;ctx.translate(dx,0);
    ag_soft(ctx,cc=>cc.rect(x-5*s,y-h,10*s,h),[96,98,102],[150,152,156],x+4,y-h+20,40,null);
    ag_soft(ctx,cc=>ag_rect(cc,x-26*s,y-h-96*s,52*s,96*s,12*s),[40,42,46],[96,100,106],x+10,y-h-90*s,60*s,null);
    const col=lamp==="red"?WGC.red:lamp==="green"?[86,200,130]:[70,72,76];ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y-h-48*s,14*s,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(30,30,34,1)";ctx.fillRect(x-22*s,y-h-70*s,44*s,7*s);ctx.restore();};
  if(o.blur){for(let i=0;i<9;i++)draw(i*o.blur/8,0.16);}else draw(0,1);
  if(lamp&&o.glow>0){const col=lamp==="red"?WGC.red:[86,200,130],g=ctx.createRadialGradient(x,y-h-48*s,0,x,y-h-48*s,120*s);g.addColorStop(0,rgba(col,0.6*o.glow));g.addColorStop(1,rgba(col,0));
    ctx.globalCompositeOperation="screen";ctx.fillStyle=g;ctx.fillRect(x-120*s,y-h-168*s,240*s,240*s);}
  ctx.restore();}

/* ---------------------------------------------------------------- plain track at night (the place "wgNight"): Tokyo, 1962 */
function wg_paintNight(c){wg_sky(c,WGC.night0,WGC.night1,0,560,0,0,0);
  let g=c.createLinearGradient(0,540,0,H);g.addColorStop(0,"rgb(44,46,54)");g.addColorStop(1,"rgb(26,28,34)");c.fillStyle=g;c.fillRect(0,540,W,H-540);
  // a faint glow of the city along the horizon
  g=c.createLinearGradient(0,470,0,560);g.addColorStop(0,"rgba(120,110,120,0)");g.addColorStop(1,"rgba(120,110,120,0.22)");c.fillStyle=g;c.fillRect(0,470,W,90);
  // the track, running away from us to the right: sleepers, then the rails
  // the track, running away from us: one vanishing point for the sleepers and the rails (depth z, 1 at the frame's foot)
  const vp=[1180,546],P=(z,side)=>[lerp(vp[0],660,1/z)+side*380/z,lerp(vp[1],H+30,1/z)];
  for(let z=1;z<40;z*=1.16){const a=P(z,-1.5),b=P(z,1.5),th=Math.max(1,22/z);c.fillStyle="rgba(76,72,68,"+clamp(1.1-z*0.03,0.25,0.9)+")";c.fillRect(a[0],a[1]-th/2,b[0]-a[0],th);}
  c.strokeStyle="rgba(156,156,162,0.75)";c.lineWidth=5;for(const sd of [-1,1]){c.beginPath();for(let z=1;z<60;z*=1.1){const q=P(z,sd);z===1?c.moveTo(q[0],q[1]):c.lineTo(q[0],q[1]);}c.stroke();}}

/* ---------------------------------------------------------------- a carriage of passengers (the place "wgCarriage")
   Seen from the side, as the passengers face the way the train goes: the far wall with its windows and the luggage rack, and each
   row's seat back; the passengers and the armrests are drawn live, in front of their seat backs. */
const WG_ROWS=[140,520,900,1280,1660],WG_SEAT={top:470,seat:792};
function wg_paintCarriage(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(226,222,212)");g.addColorStop(1,"rgb(204,198,186)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the windows, bright, the country blurred past them
  for(let x=-80;x<W+200;x+=380){const wx=x+70,wy=250,ww=250,wh=210;c.save();rr(c,wx,wy,ww,wh,26);c.clip();
    const s=c.createLinearGradient(0,wy,0,wy+wh);s.addColorStop(0,"rgb(232,238,240)");s.addColorStop(0.55,"rgb(214,224,216)");s.addColorStop(0.62,"rgb(170,184,150)");s.addColorStop(1,"rgb(150,166,128)");c.fillStyle=s;c.fillRect(wx,wy,ww,wh);
    c.fillStyle="rgba(255,255,255,0.25)";for(let i=0;i<5;i++)c.fillRect(wx,wy+130+i*16,ww,3);c.restore();
    c.strokeStyle="rgba(150,142,128,0.9)";c.lineWidth=10;rr(c,wx,wy,ww,wh,26);c.stroke();c.strokeStyle="rgba(255,255,255,0.5)";c.lineWidth=2;rr(c,wx+5,wy+5,ww-10,wh-10,22);c.stroke();}
  // the luggage rack above them, and the ceiling's soft light
  c.fillStyle="rgb(170,164,152)";c.fillRect(0,196,W,10);c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(0,196,W,2);
  g=c.createLinearGradient(0,0,0,190);g.addColorStop(0,"rgba(255,255,250,0.6)");g.addColorStop(1,"rgba(255,255,250,0)");c.fillStyle=g;c.fillRect(0,0,W,190);
  // the wall under the windows, and the floor
  c.fillStyle="rgb(196,188,174)";c.fillRect(0,500,W,330);c.fillStyle="rgb(120,112,104)";c.fillRect(0,830,W,H-830);
  // each row's seat back, in profile: a tall soft slab, leaning back a little
  for(const x of WG_ROWS)wg_seatBack(c,x);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,248,232,0.12)");c.fillStyle=g;c.fillRect(0,0,W,H);}
function wg_seatBack(c,x){const col=[112,122,124];ag_soft(c,cc=>{cc.moveTo(x-10,WG_SEAT.top+10);cc.bezierCurveTo(x-6,WG_SEAT.top-14,x+40,WG_SEAT.top-18,x+50,WG_SEAT.top+6);
    cc.lineTo(x+72,WG_SEAT.seat);cc.lineTo(x+14,WG_SEAT.seat+10);cc.closePath();},col,ag_lt(col,0.35),x+40,WG_SEAT.top+30,180,rgba(ag_dk(col,0.6),0.4),14);
  ag_soft(c,cc=>ag_rect(cc,x+10,WG_SEAT.seat-6,250,44,14),ag_dk(col,0.06),ag_lt(col,0.3),x+200,WG_SEAT.seat,140,rgba(ag_dk(col,0.6),0.35),10);}
// the armrest in front of a passenger
function wg_armrest(ctx,x){ag_soft(ctx,cc=>ag_rect(cc,x+40,WG_SEAT.seat-58,190,22,11),[150,140,124],[214,204,186],x+180,WG_SEAT.seat-58,90,"rgba(60,50,40,0.3)",6);
  ctx.fillStyle="rgba(90,84,76,0.9)";ctx.fillRect(x+210,WG_SEAT.seat-38,12,44);}
// a folded newspaper in a hand: in figure space, at the wrist
function wg_paper(c,h){if(!h||!h.near)return;const [x,y]=h.near;c.save();c.translate(x+60,y-10);c.rotate(-0.25);
  ag_soft(c,cc=>ag_rect(cc,-20,-110,150,180,6),[236,232,220],[255,255,250],60,-100,120,"rgba(60,50,40,0.25)",8);
  c.fillStyle="rgba(80,78,74,0.55)";for(let i=0;i<7;i++)c.fillRect(0,-90+i*22,(i%3?100:70),6);c.restore();}

/* ---------------------------------------------------------------- the driver's cab (the place "wgCab")
   Seen from the side: the cab's wall, its side window with the country streaming past (drawn live), the windscreen ahead, and the
   console in front of the driver, with the speedometer and, above it, the speed allowed (wg_speedo, live). */
const WG_CAB={win:[150,150,1060,330],dial:[1430,690,118],box:[1430,486]};
function wg_paintCab(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(178,182,184)");g.addColorStop(1,"rgb(140,144,146)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the side window's frame (the view through it is live)
  const [wx,wy,ww,wh]=WG_CAB.win;c.fillStyle="rgb(110,114,118)";rr(c,wx-18,wy-18,ww+36,wh+36,34);c.fill();
  // the windscreen, ahead, sloping: sky and the line ahead, bright
  c.save();c.beginPath();c.moveTo(1290,120);c.lineTo(W,60);c.lineTo(W,430);c.lineTo(1420,430);c.closePath();c.clip();
  g=c.createLinearGradient(0,60,0,430);g.addColorStop(0,"rgb(214,224,232)");g.addColorStop(0.7,"rgb(236,234,224)");g.addColorStop(0.71,"rgb(176,186,150)");g.addColorStop(1,"rgb(160,170,136)");c.fillStyle=g;c.fillRect(1280,60,700,380);
  c.strokeStyle="rgba(120,118,112,0.8)";c.lineWidth=4;c.beginPath();c.moveTo(1560,430);c.lineTo(1770,326);c.moveTo(1960,430);c.lineTo(1782,326);c.stroke();c.restore();
  c.strokeStyle="rgb(100,104,108)";c.lineWidth=22;c.beginPath();c.moveTo(1290,120);c.lineTo(1420,430);c.stroke();
  // the console: a sloped desk in front of the driver, matte grey-green
  const col=[118,130,126];ag_soft(c,cc=>{cc.moveTo(1040,1080);cc.lineTo(1100,560);cc.lineTo(1720,520);cc.lineTo(W,540);cc.lineTo(W,1080);cc.closePath();},col,ag_lt(col,0.35),1500,560,600,rgba(ag_dk(col,0.6),0.4),26);
  c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();c.moveTo(1100,560);c.lineTo(1720,520);c.lineTo(W,540);c.lineTo(W,546);c.lineTo(1720,527);c.lineTo(1100,567);c.closePath();c.fill();
  // the seat's back behind the driver
  ag_soft(c,cc=>ag_rect(cc,150,560,220,560,40),[86,90,96],[140,146,152],330,600,200,"rgba(0,0,0,0.3)",14);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,26,22,0.18)");g.addColorStop(0.6,"rgba(30,26,22,0)");g.addColorStop(1,"rgba(255,248,232,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the view through the side window: the country streaming past (off: how far it has moved), a signal now and then
function wg_cabWindow(ctx,off,draw){const [wx,wy,ww,wh]=WG_CAB.win;ctx.save();rr(ctx,wx,wy,ww,wh,22);ctx.clip();
  let g=ctx.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgb(214,224,232)");g.addColorStop(0.5,"rgb(232,232,224)");g.addColorStop(0.52,"rgb(170,182,144)");g.addColorStop(1,"rgb(136,150,116)");ctx.fillStyle=g;ctx.fillRect(wx,wy,ww,wh);
  // far hills hardly move; the near ground streams
  ctx.fillStyle="rgba(150,164,150,0.8)";for(let i=0;i<6;i++){const x=((i*260-off*0.04)%1560+1560)%1560-200;ctx.beginPath();ctx.ellipse(wx+x,wy+wh*0.5,180,26,0,Math.PI,0);ctx.fill();}
  ctx.fillStyle="rgba(240,240,226,0.35)";for(let i=0;i<14;i++){const x=((i*97-off*1.2)%1200+1200)%1200;ctx.fillRect(wx+x-100,wy+wh*0.62+((i*37)%5)*18,220,3);}
  if(draw)draw(ctx);ctx.restore();
  ctx.strokeStyle="rgba(255,255,255,0.4)";ctx.lineWidth=2;rr(ctx,wx+3,wy+3,ww-6,wh-6,20);ctx.stroke();}
/* the speedometer, and above it the speed allowed: wg_speedo(ctx, v, o): v the speed (km/h), o.allow the speed allowed, o.state
   "set" (blue), "over" (amber) or "under" (green), o.today a screen instead of a dial; o.a. The box's words are at least 30 px. */
function wg_speedo(ctx,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [cx,cy,R]=WG_CAB.dial,[bx,by]=WG_CAB.box;ctx.save();ctx.globalAlpha*=a;
  // the dial: matte cream face, graphite ticks every 50, a needle
  ag_soft(ctx,cc=>cc.arc(cx,cy,R+16,0,TAU),[70,74,78],[130,134,138],cx+30,cy-40,R,null);
  ag_soft(ctx,cc=>cc.arc(cx,cy,R,0,TAU),[238,234,222],[255,255,248],cx+20,cy-30,R,"rgba(60,50,40,0.25)",14);
  const ang=u=>Math.PI*(0.8+1.4*u);for(let s=0;s<=250;s+=10){const u=s/250,a1=ang(u),r0=s%50?R-16:R-28;ctx.strokeStyle="rgba(50,52,56,0.9)";ctx.lineWidth=s%50?2:4;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(a1)*r0,cy+Math.sin(a1)*r0);ctx.lineTo(cx+Math.cos(a1)*(R-6),cy+Math.sin(a1)*(R-6));ctx.stroke();}
  for(const s of [0,100,200]){const a1=ang(s/250);ag_T(ctx,String(s),cx+Math.cos(a1)*(R-54),cy+Math.sin(a1)*(R-54)+10,{w:700,size:28,align:"center",col:[60,62,66],deco:1});}
  // the allowed speed marked on the dial's edge, in the box's colour
  const col=o.state==="over"?AG.amber:o.state==="under"?AG.green:AG.blue,aa=ang((o.allow||0)/250);
  if(o.allow!=null){ctx.strokeStyle=rgba(col,0.95*(o.boxA==null?1:o.boxA));ctx.lineWidth=8;ctx.beginPath();ctx.arc(cx,cy,R-4,aa-0.05,aa+0.05);ctx.stroke();}
  const na=ang(clamp(v,0,250)/250);ctx.strokeStyle="rgb(40,40,44)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-Math.cos(na)*16,cy-Math.sin(na)*16);ctx.lineTo(cx+Math.cos(na)*(R-24),cy+Math.sin(na)*(R-24));ctx.stroke();
  ctx.fillStyle="rgb(50,52,56)";ctx.beginPath();ctx.arc(cx,cy,12,0,TAU);ctx.fill();
  ctx.restore();
  wg_allowBox(ctx,bx,by,o.allow,o.state,{a:a*(o.boxA==null?1:o.boxA),k:o.k});}
// the speed allowed: a box that fits its words, "allowed 210", in blue while set, amber while the train is over it, green once under
function wg_allowBox(ctx,x,y,allow,state,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||allow==null)return;const col=state==="over"?AG.amber:state==="under"?AG.green:AG.blue,
  t1="allowed",t2=String(allow),w=ag_tw(ctx,t1,{w:600,size:30})+ag_tw(ctx,t2,{w:800,size:46})+86,h=84;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,o.k));ag_box(ctx,x-w/2,y-h/2,w,h,16,{edge:col,edgeA:0.95,lw:3.4,glow:col,glowA:state==="over"?1:0.4});
  ag_T(ctx,t1,x-w/2+28,y+11,{w:600,size:30,col:AG.mut});ag_T(ctx,t2,x+w/2-28,y+17,{w:800,size:46,col,align:"right"});ctx.restore();}

/* ---------------------------------------------------------------- the control room (the place "wgControl")
   A long pale board on the wall, the line drawn along it from Tokyo to Osaka, a station marked on it here and there; desks in front
   with telephones. The board's lights (one for each train) and the controllers are live. */
const WG_BOARD={x0:190,x1:1730,y:300};
function wg_paintControl(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(214,216,210)");g.addColorStop(1,"rgb(190,192,186)");c.fillStyle=g;c.fillRect(0,0,W,H);
  ag_soft(c,cc=>ag_rect(cc,110,150,1700,300,14),[236,236,230],[255,255,252],1500,170,900,"rgba(60,56,50,0.2)",18);
  c.strokeStyle="rgba(150,148,140,0.9)";c.lineWidth=6;rr(c,110,150,1700,300,14);c.stroke();
  const B=WG_BOARD;c.strokeStyle="rgb(70,72,78)";c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(B.x0,B.y);c.lineTo(B.x1,B.y);c.stroke();
  c.strokeStyle="rgba(70,72,78,0.5)";c.lineWidth=3;c.beginPath();c.moveTo(B.x0,B.y+30);c.lineTo(B.x1,B.y+30);c.stroke();
  for(let i=0;i<=11;i++){const x=lerp(B.x0,B.x1,i/11);c.fillStyle="rgb(70,72,78)";c.beginPath();c.arc(x,B.y+15,i===0||i===11?14:9,0,TAU);c.fill();c.fillStyle="rgb(236,236,230)";c.beginPath();c.arc(x,B.y+15,i===0||i===11?7:4,0,TAU);c.fill();}
  // the wall under the board, and the floor
  c.fillStyle="rgb(176,178,172)";c.fillRect(0,600,W,10);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,248,232,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the board's live parts: the two ends' names, and a light for each train, creeping along the line (u: how far each has gone)
function wg_board(ctx,t,o){o=o||{};const B=WG_BOARD;ag_T(ctx,"Osaka",B.x0,B.y+92,{w:700,size:32,col:[60,62,68]});ag_T(ctx,"Tokyo",B.x1,B.y+92,{w:700,size:32,col:[60,62,68],align:"right"});
  const trains=[[0.08,1],[0.31,1],[0.55,-1],[0.77,1],[0.92,-1]];for(const [u0,dir] of trains){const u=((u0+dir*t*0.004)%1+1)%1,x=lerp(B.x0,B.x1,u),y=dir>0?B.y:B.y+30;
    const g=ctx.createRadialGradient(x,y,0,x,y,26);g.addColorStop(0,"rgba(255,244,210,0.95)");g.addColorStop(1,"rgba(255,244,210,0)");ctx.fillStyle=g;ctx.fillRect(x-26,y-26,52,52);
    ctx.fillStyle="rgb(255,250,232)";ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();}}
// a desk seen from the front, its top's front edge at y, from x0 to x1; a telephone on it (lift 0 to 1: the handset rises)
function wg_ctrlDesk(ctx,x0,x1,y,phones){ag_desk(ctx,x0,y,x1-x0,{depth:60});for(const [px,lift] of phones)wg_phone(ctx,px,y-24,lift);}
function wg_phone(ctx,x,y,lift){ag_soft(ctx,cc=>{cc.moveTo(x-46,y+12);cc.lineTo(x-34,y-18);cc.lineTo(x+34,y-18);cc.lineTo(x+46,y+12);cc.closePath();},[36,36,40],[96,98,104],x+20,y-10,60,null);
  if(lift<1){ctx.save();ctx.translate(x,y-24);ag_soft(ctx,cc=>{ag_rect(cc,-52,-8,104,16,8);cc.moveTo(-52,0);cc.arc(-46,6,12,0,TAU);cc.moveTo(52,0);cc.arc(46,6,12,0,TAU);},[30,30,34],[90,92,98],20,-6,60,null);ctx.restore();}}

/* ---------------------------------------------------------------- the driver's controller: the lever in his hand (figure space, under the hand) */
function wg_lever(c,h){if(!h||!h.near)return;const [x,y]=h.near;c.save();
  ag_soft(c,cc=>ag_rect(cc,x+2,y+10,30,420,12),[54,56,60],[120,124,130],x+24,y+30,80,null);
  ag_soft(c,cc=>cc.arc(x+18,y+8,34,0,TAU),[40,42,46],[120,124,130],x+30,y-8,34,null);c.restore();}

/* ---------------------------------------------------------------- cards of the opening (words at least 28 px; no colour of the series' meanings
   but the green of the trip that got shorter, as the script has it)
   wg_mapCard: the new line, Osaka on the left and Tokyo on the right, as the map has them; p draws the line from Tokyo. */
function wg_mapCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=560,h=210,p=clamp(o.p==null?1:o.p,0,1);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,"THE NEW LINE",x+28,y+52,{w:700,size:28,ls:4,col:AG.kick});
  const B=[x+w-76,y+112,x+w-210,y+150,x+220,y+86,x+76,y+124];
  ctx.strokeStyle="rgba(70,72,78,0.22)";ctx.lineWidth=10;ctx.lineCap="round";ag_bzPath(ctx,B,0,1);ctx.stroke();
  if(p>0){ctx.strokeStyle="rgb(60,62,68)";ctx.lineWidth=7;ag_bzPath(ctx,B,0,p);ctx.stroke();}
  for(const [u,name,al] of [[0,"Tokyo","right"],[1,"Osaka","left"]]){const q=ag_bz(B,u),on=u===0?1:ag_in(p,0.9,0.1);
    ctx.fillStyle="rgb(60,62,68)";ctx.beginPath();ctx.arc(q[0],q[1],13,0,TAU);ctx.fill();ctx.fillStyle=rgba([238,236,230],1);ctx.beginPath();ctx.arc(q[0],q[1],6,0,TAU);ctx.fill();
    ag_T(ctx,name,al==="right"?q[0]+20:q[0]-20,y+184,{w:700,size:32,align:al,a:on});}
  ctx.restore();}
// a calm card of the opening: words {kick, title, sub}, the kicker in the room's grey (not the model's violet), o.edge for a meaning
function wg_card(ctx,x,y,w,words,o){o=o||{};return ag_textCard(ctx,x,y,w,words,Object.assign({kickCol:AG.kick},o));}

/* ---------------------------------------------------------------- the line seen from beside it: a long arrow ahead of the train, along the rails
   (it can't stop at once); and the thin blue line of the limits, drawn along the rails as far as we can see */
function wg_ahead(ctx,x0,x1,y,p,a){if(p<=0||a<=0)return;const xe=lerp(x0,x1,ag_eo(p));ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=8;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(xe-18,y);ctx.stroke();ag_arrowHead(ctx,xe,y,0,22,rgba(AG.amber,0.95));ctx.restore();}
function wg_blueLine(ctx,x0,x1,y,p,a){if(p<=0||a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(AG.blue,0.8);ctx.shadowBlur=18;ctx.strokeStyle=rgba(AG.blue,0.95);
  ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,ag_sine(p)),y);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the control room's people and desks, live
   wg_controlRoom(ctx, t, o): the two controllers at their desks in front of the board, facing it from either side (people face us in
   three-quarter view), a telephone on each desk. They watch the board, their arms down behind the desks: a handset lifted to the ear
   put a hand on the face, and read as wrong. */
function wg_controlRoom(ctx,t,o){o=o||{};wg_board(ctx,t,{});
  ag_person(ctx,WG_P.ctrlA,520,700,0.72,{t,gaze:[3,-3],cut:900});
  ag_person(ctx,WG_P.ctrlB,1400,700,0.72,{t:t+1.3,flip:true,gaze:[3,-3],cut:900});
  for(const x0 of [200,1080]){const g=ctx.createLinearGradient(0,984,0,H);g.addColorStop(0,"rgb(150,154,150)");g.addColorStop(1,"rgb(126,130,126)");ctx.fillStyle=g;ctx.fillRect(x0+24,984,592,H-984);
    ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(x0+24,984,592,2);ag_desk(ctx,x0,962,640,{depth:62});}
  wg_phone(ctx,700,930,0);wg_phone(ctx,1220,930,0);}

/* ---------------------------------------------------------------- the places, painted once */
AG_PLACES.wgPlatform=c=>wg_paintPlatform(c);
AG_PLACES.wgDusk=c=>wg_paintPlatform(c,{dusk:true});
AG_PLACES.wgCountry=c=>wg_paintCountry(c);
AG_PLACES.wgNight=c=>wg_paintNight(c);
AG_PLACES.wgCarriage=c=>wg_paintCarriage(c);
AG_PLACES.wgCab=c=>wg_paintCab(c);
AG_PLACES.wgControl=c=>wg_paintControl(c);
