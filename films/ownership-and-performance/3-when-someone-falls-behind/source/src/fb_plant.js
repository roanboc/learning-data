/* ===== When someone falls behind: Fremont, California, in 1982 and 1984, and a Toyota plant in Japan =====
   The opening's places and people, drawn with the people kit (films/people-first/shared/): the plant seen from the road, by its
   gate, on a grey morning in 1982 and a clear one in 1984; the hall where the cars are built, dim and worn in 1982 and lit in 1984,
   with the cord above the line and the board of lamps a pull of it lights; and the hall of a Toyota plant in Japan, where groups from
   Fremont worked beside the people there. The cars are saloons of the early 1980s in plain colours, with no maker's badge; nothing is
   a likeness of the real plant, its people or its cars, and nothing Japanese is drawn for Toyota but its people, in plain work
   clothes. The workers are the same people in 1982 and 1984: in 1984 they wear the plant's work jacket over their own clothes.
   Everyone stands on a floor sized by its place's eye line (FB_G.eye by the gate, FB_H.eye in a hall), so near and far belong to
   one picture. */
const FB_G={eye:430,plant:480,top:436,fence:650,gate:[680,1240],road:904};
const FB_H={eye:380,wall:600,line:722,cord:262,board:[760,58,400,92]};
const fb_hG=fl=>PK.hAt(fl,FB_G.eye),fb_hH=fl=>PK.hAt(fl,FB_H.eye);
// the plant's work jacket, 1984: the same people, in it
const FB_UNI=[186,196,204];
const FB_CAST={
  ray:{key:"ray",skin:[112,74,54],hair:{style:"coily",c:[30,24,22]},beard:[40,30,28],top:{kind:"sweater",c:[138,118,96]},bottom:{kind:"trousers",c:[70,74,92]},shoe:[60,48,44]},
  lupe:{key:"lupe",skin:[198,148,112],hair:{style:"bun",c:[40,30,28]},earrings:[220,200,160],top:{kind:"jacket",c:[120,136,122],inner:[236,226,206]},bottom:{kind:"trousers",c:[86,80,76]},shoe:[64,50,46]},
  dale:{key:"dale",skin:[236,196,168],hair:{style:"short",c:[142,104,70]},beard:[132,96,66],top:{kind:"jacket",c:[122,100,88],inner:[226,220,206]},bottom:{kind:"trousers",c:[74,80,100]},shoe:[66,52,46]},
  nita:{key:"nita",skin:[96,62,46],hair:{style:"coily",c:[28,22,22]},earrings:[226,196,140],top:{kind:"sweater",c:[170,134,122]},bottom:{kind:"trousers",c:[66,70,86]},shoe:[56,44,44]},
  joe:{key:"joe",skin:[214,170,132],hair:{style:"crop",c:[36,30,30]},glasses:[60,50,50],top:{kind:"sweater",c:[130,148,166]},bottom:{kind:"trousers",c:[92,86,80]},shoe:[62,50,48]},
  // a manager and a supervisor, in jackets and ties' shirts; the team leader of 1984; two of the Toyota plant's own people
  mgr:{key:"mgr",skin:[226,186,152],hair:{style:"short",c:[96,76,60]},glasses:[60,50,50],top:{kind:"jacket",c:[86,90,104],inner:[240,236,228]},bottom:{kind:"trousers",c:[80,82,96]},shoe:[50,42,42]},
  boss:{key:"boss",skin:[240,208,184],hair:{style:"short",c:[176,170,164]},top:{kind:"jacket",c:[110,100,94],inner:[236,230,220]},bottom:{kind:"trousers",c:[92,86,82]},shoe:[54,44,42]},
  lead:{key:"lead",skin:[176,126,94],hair:{style:"short",c:[40,32,30]},beard:[50,40,36],top:{kind:"jacket",c:FB_UNI,inner:[236,232,224]},bottom:{kind:"trousers",c:[74,78,96]},shoe:[58,46,42]},
  tk1:{key:"tk1",skin:[238,204,172],hair:{style:"crop",c:[30,26,28]},top:{kind:"jacket",c:[226,226,220],inner:[240,238,232]},bottom:{kind:"trousers",c:[96,100,112]},shoe:[60,52,52]},
  tk2:{key:"tk2",skin:[232,196,164],hair:{style:"bob",c:[34,28,30]},top:{kind:"jacket",c:[226,226,220],inner:[240,238,232]},bottom:{kind:"trousers",c:[96,100,112]},shoe:[60,52,52]},
  // someone who bought one of the plant's cars, and her son
  buyer:{key:"buyer",skin:[240,212,190],hair:{style:"bob",c:[150,96,62]},top:{kind:"jacket",c:[172,116,104],inner:[236,228,214]},bottom:{kind:"trousers",c:[92,96,114]},shoe:[70,54,50]},
  son:{key:"son",kid:true,skin:[236,206,184],hair:{style:"short",c:[150,100,66]},top:{kind:"sweater",c:[150,170,190],sleeve:"short"},bottom:{kind:"trousers",c:[100,96,90]},shoe:[96,70,52]}
};
// the same person in 1984, in the plant's work jacket
const FB_84={};
const fb84=k=>FB_84[k]||(FB_84[k]=Object.assign({},FB_CAST[k],{top:{kind:"jacket",c:FB_UNI,inner:[236,232,224]}}));
const FB_PAL={sky82:[[188,194,200],[226,224,218]],cloud82:[214,214,212],hill:[[176,170,140],[156,158,128]],
  wall82:[186,180,168],wall84:[224,214,194],wallJp:[228,232,226],roof82:[142,138,134],roof84:[170,152,136],glass82:[150,160,166],
  yard82:[188,184,176],yard84:[214,208,196],tar82:[118,116,116],tar84:[132,130,128],road:[96,96,100],fence:[150,152,150],
  hall82:[150,146,140],hall84:[204,200,190],hallJp:[212,216,210],floor82:[160,156,148],floor84:[196,192,182],floorJp:[206,206,198],
  truss:[96,98,104],rack:[124,116,104],box:[[176,150,112],[150,128,98],[196,170,128]],slat:[92,90,94],
  cars:[[214,200,170],[132,98,78],[112,124,140],[140,72,68],[230,222,200],[140,150,130],[190,192,192]],
  carsJp:[[236,234,226],[214,220,226],[196,204,214],[232,226,210]],wallJp2:[214,224,218],aisleJp:[150,186,150],tube:[246,248,240],trolley:[120,132,146],bin:[[92,128,170],[110,146,186]]};
const fb_c=(n,i)=>PK.S.tone(i==null?FB_PAL[n]:FB_PAL[n][i]);

/* ---------------------------------------------------------------- a car of the early 1980s, from the side
   x: its middle; floor: where its wheels stand; L: its length (a car is about 2.6 times a standing adult's height, PK.hAt). o.col
   its colour; o.left: it faces left; o.door: "gone" (the front door missing, the seat seen through the gap) or "odd" (a front door
   of another colour, o.doorCol); o.hood (0 to 1): the bonnet raised; o.a fades it. Returns where its parts are, for hands. */
const FB_CAR={body:[[-498,72,1],[-506,186,1],[-470,204],[-338,212,1],[-236,296],[36,300],[182,214,1],[468,194],[504,176,1],[506,80,1],
    [382,60],[372,104],[343,135],[300,148],[257,135],[228,104],[218,58],[-198,54],[-208,104],[-237,135],[-280,148],[-323,135],[-352,104],[-362,60]],
  glassR:[[-322,218,1],[-232,288,1],[-62,292,1],[-62,218,1]],glassF:[[-38,218,1],[-38,292,1],[28,290,1],[160,218,1]],wheels:[300,-280],r:64};
function fb_car(ctx,x,floor,L,o){o=o||{};const S=PK.S,U=PK.u,u=L/1000,f=o.left?-1:1,P=(p,c)=>[x+f*p[0]*u,floor-p[1]*u,c==null?p[2]:c],col=S.tone(o.col||fb_c("cars",0));
  if(o.a!=null&&o.a<=0.004)return null;ctx.save();if(o.a!=null)ctx.globalAlpha*=U.clamp(o.a,0,1);
  S.begin(ctx,{lw:U.clamp(L*0.0026,1.2,3.4),far:o.far||0,sh:4});
  // its shadow on the floor
  ctx.fillStyle="rgba(50,40,40,0.16)";ctx.beginPath();ctx.ellipse(x,floor-4*u,520*u,20*u,0,0,U.TAU);ctx.fill();
  // the bonnet, raised: behind the body, hinged at the windscreen's foot
  const hd=U.clamp(o.hood||0,0,1);if(hd>0.004){const a=U.lerp(0,0.95,hd),h0=[182,214],p=[[182,214],[470,196],[484,148],[196,166]].map(q=>{const dx=q[0]-h0[0],dy=q[1]-h0[1];return[h0[0]+dx*Math.cos(a)-dy*Math.sin(a),h0[1]+dx*Math.sin(a)+dy*Math.cos(a)];});
    S.poly(ctx,p.map(q=>P(q,1)),U.dk(col,0.08),{exact:true});S.poly(ctx,[p[0],p[1],[U.lerp(p[1][0],p[2][0],0.5),U.lerp(p[1][1],p[2][1],0.5)],[U.lerp(p[0][0],p[3][0],0.5),U.lerp(p[0][1],p[3][1],0.5)]].map(q=>P(q,1)),U.lt(col,0.12),{exact:true,w:0.6});}
  S.poly(ctx,FB_CAR.body.map(q=>P(q)),col,{exact:true});
  // the glass, the doors' lines and handles; a front door missing (the seat seen through the gap) or of another colour
  const glass=S.tone(o.glass||[176,196,204]),gone=o.door==="gone";
  S.poly(ctx,FB_CAR.glassR.map(q=>P(q,1)),glass,{exact:true,w:0.7});if(!gone)S.poly(ctx,FB_CAR.glassF.map(q=>P(q,1)),glass,{exact:true,w:0.7});
  if(o.door==="odd")S.poly(ctx,[[-48,54],[-48,212],[196,214],[200,206],[200,56]].map(q=>P(q,1)),S.tone(o.doorCol||fb_c("cars",2)),{exact:true,w:0.8});
  if(gone){S.poly(ctx,[[-48,54],[-48,292],[28,290],[160,218],[200,212],[200,56]].map(q=>P(q,1)),[92,86,88],{exact:true,w:0.8});
    S.fill(ctx,c=>{const a=P([-34,120]),b=P([44,262]);U.rrect(c,Math.min(a[0],b[0]),b[1],Math.abs(b[0]-a[0]),a[1]-b[1],12*u);},[150,132,118],{w:0.6});
    S.fill(ctx,c=>{const a=P([-40,96]),b=P([150,128]);U.rrect(c,Math.min(a[0],b[0]),b[1],Math.abs(b[0]-a[0]),a[1]-b[1],10*u);},[138,120,108],{w:0.6});}
  S.line(ctx,c=>{for(const [dx,y0,y1] of [[-196,62,214],[-48,54,292],[200,56,214]]){if(gone&&dx!==-196)continue;const a=P([dx,y0]),b=P([dx,y1]);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}
    const r=P([-490,140]),s=P([494,140]);c.moveTo(r[0],r[1]);c.lineTo(s[0],s[1]);},null,0.6);
  S.fill(ctx,c=>{for(const dx of gone?[-112]:[-112,140]){const a=P([dx,192]);U.rrect(c,a[0]-15*u,a[1]-4*u,30*u,8*u,3*u);}},U.dk(col,0.4),{w:0.4,flat:true});
  // bumpers and lamps
  S.fill(ctx,c=>{const a=P([494,120]),b=P([-494,120]);U.rrect(c,Math.min(a[0],a[0]+f*30*u),a[1],30*u,50*u,6*u);U.rrect(c,Math.min(b[0],b[0]-f*30*u),b[1],30*u,50*u,6*u);},[84,84,90],{w:0.6});
  S.fill(ctx,c=>{const a=P([484,176]);U.rrect(c,Math.min(a[0],a[0]+f*24*u),a[1],24*u,26*u,4*u);},[246,240,214],{w:0.5});
  S.fill(ctx,c=>{const a=P([-484,176]);U.rrect(c,Math.min(a[0],a[0]-f*24*u),a[1],24*u,36*u,4*u);},[170,90,84],{w:0.5});
  // the wheels
  const W=FB_CAR.wheels.map(wx=>P([wx,FB_CAR.r]));for(const w of W){S.fill(ctx,c=>U.ell(c,w[0],w[1],FB_CAR.r*u,FB_CAR.r*u),[58,56,60],{});S.fill(ctx,c=>U.ell(c,w[0],w[1],34*u,34*u),[176,176,178],{w:0.6});}
  ctx.restore();
  return{front:W[0],rear:W[1],door:P([80,170]),roof:P([-60,300]),boot:P([-420,206]),bonnet:P([360,200]),seat:P([10,190])};}
// a car's colour and front door, by its place on the line (i counts from the left as the line moves to the right)
const fb_carOf=(i,o)=>{o=o||{};const R=PK.u.rnd(i*7+3),c=Math.floor(R()*FB_PAL.cars.length);return{col:fb_c("cars",c),door:o.doors&&o.doors[i]||null,doorCol:fb_c("cars",(c+3)%FB_PAL.cars.length)};};
const fb_carJp=i=>({col:fb_c("carsJp",((i%4)+4)%4)});

/* ---------------------------------------------------------------- the line: cars on a floor conveyor, moving to the right
   p: how far the line has moved (px; it moves about 14 px a second: fb_moved), drawn at the line's floor. o.gap: the space between two
   cars; o.cars(i): a car's look (fb_carOf); o.first: the index of the first car at p = 0; o.L its length. Returns the cars in view,
   [{i, x, at (fb_car's parts)}], left to right, for the hands that work on them. */
const FB_L={L:990,gap:240,v:14};
const fb_moved=(t,stop,d)=>{const v=FB_L.v;if(stop==null||t<stop)return v*t;d=d||1.1;return v*stop+v*d*(1-Math.exp(-(t-stop)/d));};
function fb_line(ctx,p,o){o=o||{};const S=PK.S,U=PK.u,fl=FB_H.line,L=o.L||FB_L.L,sp=L+(o.gap||FB_L.gap),out=[];
  // the conveyor's slats, moving with the cars
  S.begin(ctx,{lw:2,sh:3});S.fill(ctx,c=>U.rrect(c,-40,fl-8,2000,22,4),fb_c("slat"),{w:0.7});
  ctx.save();ctx.strokeStyle=U.css(U.lt(fb_c("slat"),0.25),0.8);ctx.lineWidth=2;ctx.beginPath();const off=((p%34)+34)%34;for(let x=-40+off;x<1980;x+=34){ctx.moveTo(x,fl-6);ctx.lineTo(x-4,fl+12);}ctx.stroke();ctx.restore();
  const k0=Math.floor((-p-L)/sp)-1;
  for(let k=k0;k<k0+5;k++){const x=k*sp+p+(o.x0||0);if(x<-L*0.6||x>1920+L*0.6)continue;const i=k-(o.first||0),d=(o.cars||fb_carOf)(i);
    out.push({i,x,at:fb_car(ctx,x,fl,L,Object.assign({},d,{a:o.a}))});}
  return out;}

/* ---------------------------------------------------------------- the plant from the road, by its gate
   Everything here keeps the eye line (FB_G.eye): the plant stands far back across its yard (its foot at FB_G.plant), the fence and its
   gate are about as tall as an adult's eyes (their top on the eye line), and the car park and the road are where people walk.
   y84: the morning of 1984 (clear, the plant painted again, cars in the yard and the car park); 1982 is grey and nearly empty */
const fb_cloud=(ctx,x,y,k,col)=>PK.S.fill(ctx,c=>{const U=PK.u;U.ell(c,x,y,70*k,26*k);U.ell(c,x+52*k,y+6*k,54*k,20*k);U.ell(c,x-56*k,y+8*k,48*k,17*k);U.ell(c,x+6*k,y-16*k,40*k,22*k);},col,{sa:0.1});
function fb_gatePlace(ctx,y84){const S=PK.S,U=PK.u,G=FB_G,[g0,g1]=G.gate;
  // the sky
  const g=ctx.createLinearGradient(0,0,0,G.plant);if(y84){g.addColorStop(0,U.css(PK.col("skyTop")));g.addColorStop(1,U.css(PK.col("skyLow")));}
  else{g.addColorStop(0,U.css(fb_c("sky82",0)));g.addColorStop(1,U.css(fb_c("sky82",1)));}ctx.fillStyle=g;ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:1.5,far:0.6,sh:3});if(y84){PK.cloud(ctx,330,104,1.1);PK.cloud(ctx,1420,76,0.9);}
  else for(const [x,y,k] of [[300,96,1.6],[860,60,1.3],[1400,110,1.8],[1800,50,1.2]])fb_cloud(ctx,x,y,k,fb_c("cloud82"));
  // the plant: a long wall under a saw-tooth roof, high windows, two loading doors
  S.begin(ctx,{lw:2,far:0.35,sh:4});const wall=fb_c(y84?"wall84":"wall82"),roof=fb_c(y84?"roof84":"roof82"),glass=y84?PK.col("glass"):fb_c("glass82");
  const teeth=[];for(let x=-200;x<2100;x+=240)teeth.push([x,254,1],[x,200,1]);teeth.push([2100,254,1],[2100,300,1],[-200,300,1]);
  S.poly(ctx,teeth,roof,{exact:true});S.fill(ctx,c=>{for(let x=-200;x<2100;x+=240)U.rrect(c,x,200,8,54,1);},U.lt(glass,0.1),{w:0.5});
  S.fill(ctx,c=>U.rrect(c,-40,252,2000,G.plant-252,0),wall,{});
  S.line(ctx,c=>{for(let x=-20;x<1960;x+=64){c.moveTo(x,330);c.lineTo(x,G.plant-24);}},U.dk(wall,0.16),0.5);
  S.fill(ctx,c=>{for(let x=24;x<1920;x+=128)U.rrect(c,x,276,96,36,3);},glass,{w:0.6});
  S.fill(ctx,c=>U.rrect(c,-40,G.plant-24,2000,24,0),U.dk(wall,0.14),{w:0.6});
  S.fill(ctx,c=>{U.rrect(c,150,360,170,G.plant-360,2);U.rrect(c,1560,360,170,G.plant-360,2);},U.dk(wall,y84?0.3:0.42),{w:0.7});
  if(y84)S.line(ctx,c=>{for(const x0 of [150,1560])for(let y=376;y<G.plant;y+=16){c.moveTo(x0+6,y);c.lineTo(x0+164,y);}},U.dk(wall,0.45),0.4);
  // the yard inside the fence, with the cars of the people at work (in 1984)
  S.begin(ctx,{lw:2,far:0.25,sh:4});S.poly(ctx,[[-40,G.plant,1],[1960,G.plant,1],[1960,G.fence,1],[-40,G.fence,1]],fb_c(y84?"yard84":"yard82"),{exact:true,flat:true});
  for(const [x,i,lf] of y84?[[260,1,0],[700,4,1],[1380,2,0],[1800,6,1]]:[[1520,2,0]])fb_car(ctx,x,560,372,{col:fb_c("cars",i),left:!!lf,far:0.3});
  // the car park and the road
  S.begin(ctx,{lw:2.4,far:0.05,sh:5});S.poly(ctx,[[-40,G.fence,1],[1960,G.fence,1],[1960,1100,1],[-40,1100,1]],fb_c(y84?"tar84":"tar82"),{exact:true,flat:true});
  ctx.save();ctx.strokeStyle=U.css([236,232,220],y84?0.6:0.4);ctx.lineWidth=4;ctx.beginPath();for(let x=-120;x<2040;x+=250){if(x>g0-120&&x<g1+40)continue;ctx.moveTo(x,676);ctx.lineTo(x-56,870);}ctx.stroke();ctx.restore();
  S.poly(ctx,[[-40,G.road,1],[1960,G.road,1],[1960,1100,1],[-40,1100,1]],fb_c("road"),{exact:true,flat:true});
  ctx.save();ctx.fillStyle=U.css([232,226,206],0.7);for(let x=-20;x<1960;x+=260)ctx.fillRect(x,1004,140,10);ctx.restore();
  S.fill(ctx,c=>U.rrect(c,-40,G.road-10,2000,14,2),[176,172,166],{w:0.6});
  // the fence, either side of the gate: posts, a top rail and the mesh; the gateposts
  S.begin(ctx,{lw:2.2,far:0.1,sh:4});const fc=fb_c("fence"),y0=G.top,y1=G.fence;
  ctx.save();ctx.beginPath();ctx.rect(-40,y0,g0+40,y1-y0);ctx.rect(g1,y0,1960-g1,y1-y0);ctx.clip();ctx.strokeStyle=U.css(U.dk(fc,0.1),0.5);ctx.lineWidth=1.5;ctx.beginPath();
  for(let x=-260;x<2160;x+=18){ctx.moveTo(x,y0);ctx.lineTo(x+(y1-y0),y1);ctx.moveTo(x,y1);ctx.lineTo(x+(y1-y0),y0);}ctx.stroke();ctx.restore();
  S.fill(ctx,c=>{U.rrect(c,-40,y0-4,g0+30,9,3);U.rrect(c,g1+10,y0-4,1960-g1,9,3);for(let x=60;x<1920;x+=200){if(x>g0-40&&x<g1+40)continue;U.rrect(c,x-5,y0-8,10,y1-y0+10,3);}},fc,{w:0.8});
  S.fill(ctx,c=>{U.rrect(c,g0-22,y0-30,22,y1-y0+34,4);U.rrect(c,g1,y0-30,22,y1-y0+34,4);},U.dk(fc,0.2),{});}
/* the gate's two leaves, which slide along the fence on wheels: shut, 0 open (behind the fence either side) to 1 shut */
function fb_gate(ctx,shut){const S=PK.S,U=PK.u,G=FB_G,[g0,g1]=G.gate,w=(g1-g0)/2,fc=fb_c("fence"),k=U.clamp(shut,0,1),y0=G.top+4,y1=G.fence-10;S.begin(ctx,{lw:2.2,far:0.1,sh:4});
  for(const x0 of [g0-w+k*w,g1-k*w]){ctx.save();ctx.beginPath();ctx.rect(x0+6,y0+6,w-12,y1-y0-12);ctx.clip();ctx.strokeStyle=U.css(U.dk(fc,0.15),0.6);ctx.lineWidth=1.5;ctx.beginPath();
    for(let x=x0-y1+y0-20;x<x0+w+20;x+=18){ctx.moveTo(x,y0);ctx.lineTo(x+(y1-y0),y1);ctx.moveTo(x,y1);ctx.lineTo(x+(y1-y0),y0);}ctx.stroke();ctx.restore();
    S.fill(ctx,c=>{U.rrect(c,x0,y0,w,8,3);U.rrect(c,x0,y1-8,w,8,3);U.rrect(c,x0,y0,8,y1-y0,3);U.rrect(c,x0+w-8,y0,8,y1-y0,3);U.rrect(c,x0+w/2-3,y0,6,y1-y0,2);},U.dk(fc,0.12),{w:0.8});
    S.fill(ctx,c=>{U.ell(c,x0+22,y1+4,7,7);U.ell(c,x0+w-22,y1+4,7,7);},[70,70,74],{w:0.6});}}

/* ---------------------------------------------------------------- the hall where the cars are built
   which: "82" (dim, grey, worn: two lamps out, the high windows dirty, boxes missing from the racks) or "84" (lit and clean, the board
   of lamps over the line): Fremont's hall; or "jp", a Toyota plant in Japan: the same work in another hall, with long lights under
   a flat ceiling, tall windows, trolleys of parts in small bins and a green walkway. The line, its cars and its cord are drawn with
   the people, since they move */
function fb_hallPlace(ctx,which){const S=PK.S,U=PK.u,H=FB_H,lit=which!=="82",jp=which==="jp",wall=fb_c(jp?"hallJp":lit?"hall84":"hall82");
  ctx.fillStyle=U.css(U.dk(wall,0.12));ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:2.4,far:0.2,sh:4});S.fill(ctx,c=>U.rrect(c,-40,120,2000,H.wall-120,0),wall,{line:false});
  const tc=fb_c("truss");
  if(jp){// a flat ceiling with rows of long lights; tall windows on a soft sky; trolleys of parts at the wall
    S.fill(ctx,c=>U.rrect(c,-40,-10,2000,130,0),fb_c("wallJp2"),{});
    S.fill(ctx,c=>{for(let x=40;x<1920;x+=300){U.rrect(c,x,30,220,14,4);U.rrect(c,x+20,86,220,14,4);}},fb_c("tube"),{w:0.6});
    ctx.save();const gl=ctx.createLinearGradient(0,100,0,300);gl.addColorStop(0,"rgba(255,255,246,0.5)");gl.addColorStop(1,"rgba(255,255,246,0)");ctx.fillStyle=gl;ctx.fillRect(0,100,1920,200);ctx.restore();
    for(let x=60;x<1900;x+=360){ctx.save();ctx.beginPath();ctx.rect(x,160,280,220);ctx.clip();const sk=ctx.createLinearGradient(0,160,0,380);sk.addColorStop(0,U.css(PK.col("skyTop")));sk.addColorStop(1,U.css(PK.col("skyLow")));ctx.fillStyle=sk;ctx.fillRect(x,160,280,220);
      S.begin(ctx,{lw:1.6,far:0.6,sh:3});S.poly(ctx,[[x-20,340],[x+90,300],[x+190,326],[x+300,296],[x+300,400,1],[x-20,400,1]],[150,176,140],{exact:true,flat:true});ctx.restore();
      S.begin(ctx,{lw:2.4,far:0.2,sh:4});S.fill(ctx,c=>{U.rrect(c,x-10,150,300,10,2);U.rrect(c,x-10,380,300,12,2);U.rrect(c,x-10,150,10,240,2);U.rrect(c,x+280,150,10,240,2);U.rrect(c,x+136,160,8,220,2);},U.lt(wall,0.3),{});}
    S.begin(ctx,{lw:2.2,far:0.15,sh:4});
    for(const x0 of [40,560,1120,1560]){S.fill(ctx,c=>{U.rrect(c,x0,470,300,12,3);U.rrect(c,x0,536,300,12,3);U.rrect(c,x0+6,470,10,124,2);U.rrect(c,x0+284,470,10,124,2);},fb_c("trolley"),{});
      S.fill(ctx,c=>{U.ell(c,x0+22,600,9,9);U.ell(c,x0+278,600,9,9);},[70,70,74],{w:0.6});
      for(const y of [470,536])for(let i=0;i<5;i++)S.fill(ctx,c=>U.rrect(c,x0+14+i*56,y-34,48,34,4),fb_c("bin",(i+y)%2),{w:0.6});}}
  else{// the back wall, its high windows, the roof's trusses and the lamps that hang from them
    S.line(ctx,c=>{for(let x=-20;x<1960;x+=96){c.moveTo(x,250);c.lineTo(x,H.wall);}},U.dk(wall,0.16),0.5);
    const win=lit?[214,230,236]:[150,156,154];S.fill(ctx,c=>{for(let x=40;x<1900;x+=176)U.rrect(c,x,150,132,80,3);},win,{w:0.7});
    if(!lit){ctx.fillStyle="rgba(70,66,60,0.25)";for(let x=40;x<1900;x+=176)ctx.fillRect(x,196,132,34);}
    S.begin(ctx,{lw:2,far:0.3,sh:3});S.fill(ctx,c=>{U.rrect(c,-40,30,2000,14,2);U.rrect(c,-40,104,2000,14,2);},tc,{});
    S.line(ctx,c=>{for(let x=-40;x<1980;x+=80){c.moveTo(x,44);c.lineTo(x+40,104);c.lineTo(x+80,44);}},tc,1.1);
    for(let x=120,i=0;x<1900;x+=240,i++){const off=!lit&&(i===2||i===5);S.fill(ctx,c=>U.rrect(c,x-2,118,4,40,1),tc,{w:0.5});
      S.poly(ctx,[[x-44,190,1],[x+44,190,1],[x+24,156,1],[x-24,156,1]],lit?[236,232,220]:[150,146,138],{exact:true,w:0.8});
      if(!off){const gl=ctx.createRadialGradient(x,196,4,x,196,lit?170:90);gl.addColorStop(0,lit?"rgba(255,246,214,0.55)":"rgba(240,230,200,0.3)");gl.addColorStop(1,"rgba(255,246,214,0)");ctx.fillStyle=gl;ctx.fillRect(x-180,190,360,220);}}
    // racks of parts at the wall: shelves of boxes, and the office's glass between them
    S.begin(ctx,{lw:2.2,far:0.15,sh:4});const rk=fb_c("rack");
    for(const [x0,w,sd] of [[40,420,3],[1440,440,7]]){S.fill(ctx,c=>{U.rrect(c,x0,330,10,270,2);U.rrect(c,x0+w-10,330,10,270,2);for(const y of [380,470,560])U.rrect(c,x0,y,w,10,2);},rk,{});
      const R=U.rnd(sd);for(const y of [380,470,560]){let x=x0+18;while(x<x0+w-60){const bw=40+R()*36,bh=34+R()*30;if(!(!lit&&R()<0.2))S.fill(ctx,c=>U.rrect(c,x,y-bh,bw,bh,3),fb_c("box",(R()*3)|0),{w:0.6});x+=bw+6+R()*14;}}}
    S.fill(ctx,c=>U.rrect(c,930,300,380,300,4),U.dk(wall,0.08),{});S.fill(ctx,c=>{U.rrect(c,950,330,160,150,3);U.rrect(c,1130,330,160,150,3);},lit?[214,228,232]:[160,166,166],{w:0.7});
    S.fill(ctx,c=>U.rrect(c,1180,500,80,100,3),U.dk(wall,0.3),{w:0.7});}
  // the floor: concrete, a walkway painted along the line (green in Japan)
  S.begin(ctx,{lw:2.6,far:0.05,sh:5});const fl=fb_c(jp?"floorJp":lit?"floor84":"floor82");S.poly(ctx,[[-40,H.wall,1],[1960,H.wall,1],[1960,1100,1],[-40,1100,1]],fl,{exact:true,flat:true});
  ctx.save();if(jp){ctx.fillStyle=U.css(fb_c("aisleJp"),0.55);ctx.fillRect(-40,770,2000,236);ctx.strokeStyle=U.css([246,240,200],0.9);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-40,770);ctx.lineTo(1960,770);ctx.moveTo(-40,1006);ctx.lineTo(1960,1006);ctx.stroke();}
  else{ctx.strokeStyle=U.css(U.lt(fl,0.45),lit?0.9:0.45);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-40,778);ctx.lineTo(1960,778);ctx.moveTo(-40,1010);ctx.lineTo(1960,1010);ctx.stroke();}
  if(!lit){ctx.fillStyle="rgba(60,56,50,0.12)";for(const [x,y,rx,ry] of [[300,880,180,26],[1100,940,240,30],[1680,860,140,20]]){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,U.TAU);ctx.fill();}}ctx.restore();
  // the board of lamps over the line (Fremont, 1984): its lamps unlit; fb_lamps lights one
  if(lit&&!jp){const [bx,by,bw,bh]=H.board;S.begin(ctx,{lw:2.2,far:0.1,sh:4});S.fill(ctx,c=>{U.rrect(c,bx+60,0,6,by,1);U.rrect(c,bx+bw-66,0,6,by,1);},tc,{w:0.5});
    S.fill(ctx,c=>U.rrect(c,bx,by,bw,bh,8),[60,62,70],{});S.fill(ctx,c=>{for(let i=0;i<8;i++)U.rrect(c,bx+22+i*46,by+24,34,44,5);},[96,96,100],{w:0.5});}}
// the board's lamps: the i-th lit in amber (a: how far, 0 to 1)
function fb_lamps(ctx,i,a){if(!(a>0.004))return;const U=PK.u,[bx,by]=FB_H.board,x=bx+22+i*46,y=by+24;ctx.save();ctx.globalAlpha*=U.clamp(a,0,1);
  const gl=ctx.createRadialGradient(x+17,y+22,4,x+17,y+22,70);gl.addColorStop(0,"rgba(255,214,140,0.7)");gl.addColorStop(1,"rgba(255,214,140,0)");ctx.fillStyle=gl;ctx.fillRect(x-60,y-50,154,144);
  ctx.fillStyle=U.css(PK.C.amber);ctx.beginPath();U.rrect(ctx,x,y,34,44,5);ctx.fill();ctx.restore();}
/* the cord along the line, at head height over the near walkway, with a pull hanging every few metres. pull: [x of the pull that is
   pulled, how far down (0 to 1)], or null */
const FB_PULLS=[180,620,1060,1500,1900];
function fb_cord(ctx,pull){const S=PK.S,U=PK.u,y=FB_H.cord;S.begin(ctx,{lw:2.6,sh:3});const col=[226,178,60];
  S.line(ctx,c=>{c.moveTo(-40,y);for(const x of FB_PULLS){const d=pull&&Math.abs(pull[0]-x)<1?pull[1]*26:0;c.lineTo(x,y+d);}c.lineTo(1960,y);},U.dk(col,0.3),3);
  for(const x of FB_PULLS){const d=pull&&Math.abs(pull[0]-x)<1?pull[1]*26:0;S.line(ctx,c=>{c.moveTo(x,y+d);c.lineTo(x,y+d+86);},U.dk(col,0.3),2.4);S.fill(ctx,c=>U.rrect(c,x-10,y+d+84,20,30,7),col,{w:0.8});}}
// where a pull's handle is, for the hand that pulls it
const fb_pullAt=(x,k)=>[x,FB_H.cord+(k||0)*26+100];
// a station's tool, hanging on its spring from above (for the empty place in 1982: it hangs there, nobody at it)
function fb_tool(ctx,x,y,sw){const S=PK.S,U=PK.u,a=(sw||0);S.begin(ctx,{lw:2,sh:3});const tip=[x+Math.sin(a)*180,y+Math.cos(a)*180];
  S.line(ctx,c=>{c.moveTo(x,0);c.lineTo(x,y);c.lineTo(tip[0],tip[1]);},[70,70,76],1.2);S.fill(ctx,c=>U.rrect(c,x-14,y-30,28,32,6),[80,84,92],{w:0.6});
  S.fill(ctx,c=>{U.capsule(c,[tip[0]-26,tip[1]],[tip[0]+30,tip[1]],13,11);U.rrect(c,tip[0]-10,tip[1],20,44,5);},[96,104,118],{w:0.7});}
// a supervisor's desk at the front, piled high with forms (the complaints): n how many piles. Returns its top and each pile's top
function fb_desk(ctx,x,floor,h,n){const S=PK.S,U=PK.u,top=floor-0.43*h,w=0.9*h,piles=[];S.begin(ctx,{lw:U.clamp(h*0.0056,1.4,6.5),sh:4});PK.desk(ctx,x,top,w,floor,{col:[150,128,104],k:h/600});
  const R=U.rnd(5);for(let i=0;i<n;i++){const px=x-w*0.42+i*w*0.2,ph=(40+R()*36)*h/600;for(let j=0;j<6;j++)S.fill(ctx,c=>U.rrect(c,px+(R()-0.5)*5,top-ph*(j+1)/6-2,w*0.15,ph/6,2),j%2?[244,240,228]:[232,226,212],{w:0.5});
    piles.push([px+w*0.075,top-ph-2]);}
  return{top,x0:x-w/2,x1:x+w/2,piles};}
// one more form, lying on a pile (at [x, y], its top middle)
function fb_sheet(ctx,at,k){const S=PK.S,U=PK.u;S.begin(ctx,{lw:2,sh:3});S.poly(ctx,[[at[0]-34*k,at[1]-4,1],[at[0]+36*k,at[1]-8,1],[at[0]+40*k,at[1]+4,1],[at[0]-30*k,at[1]+8,1]],[250,246,236],{exact:true,w:0.5});}
// where someone works the line in 1982, painted on the floor: a station, and the tool that hangs over it (the one nobody came to)
function fb_station(ctx,x){const U=PK.u;ctx.save();ctx.strokeStyle=U.css([214,190,110],0.75);ctx.lineWidth=5;ctx.lineJoin="round";ctx.beginPath();
  ctx.moveTo(x-88,784);ctx.lineTo(x+84,784);ctx.lineTo(x+96,836);ctx.lineTo(x-100,836);ctx.closePath();ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- what people carry here (PK.person's hold) */
// a lunch box, hanging from a hand at the side
const fb_lunch=col=>(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u;S.begin(c,{lw:U.clamp(J.u*2.6,1.2,3.2),sh:3});
  S.line(c,cc=>{cc.moveTo(h[0]-26*u,h[1]+30*u);cc.quadraticCurveTo(h[0],h[1]-12*u,h[0]+26*u,h[1]+30*u);},[70,70,74],1.1);
  S.fill(c,cc=>U.rrect(cc,h[0]-62*u,h[1]+28*u,124*u,86*u,16*u),col||[150,62,52],{});S.fill(c,cc=>U.rrect(cc,h[0]-62*u,h[1]+52*u,124*u,10*u,3*u),[90,90,96],{w:0.5,flat:true});};
// a cardboard box carried in both arms
const fb_box=(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u,x=h[0]+8*u,y=h[1]-20*u;S.begin(c,{lw:U.clamp(J.u*2.6,1.2,3.2),sh:3});
  S.fill(c,cc=>U.rrect(cc,x-120*u,y-110*u,240*u,150*u,6*u),[196,166,122],{});S.line(c,cc=>{cc.moveTo(x-120*u,y-80*u);cc.lineTo(x+120*u,y-80*u);},[150,120,84],0.8);};
// a form, a sheet in a hand
const fb_form=(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u;S.begin(c,{lw:U.clamp(J.u*2.4,1.2,3),sh:3});
  S.poly(c,[[h[0]-10*u,h[1]-96*u,1],[h[0]+62*u,h[1]-104*u,1],[h[0]+70*u,h[1]-6*u,1],[h[0]-2*u,h[1]+2*u,1]],[246,242,230],{exact:true});
  S.line(c,cc=>{for(let i=0;i<4;i++){cc.moveTo(h[0]+4*u,h[1]-(80-i*18)*u);cc.lineTo(h[0]+52*u,h[1]-(85-i*18)*u);}},[150,140,130],0.5);};
// a clipboard, held up to read or to tick
const fb_clip=(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u;S.begin(c,{lw:U.clamp(J.u*2.4,1.2,3),sh:3});
  S.fill(c,cc=>U.rrect(cc,h[0]-20*u,h[1]-130*u,104*u,136*u,6*u),[176,140,100],{});S.fill(c,cc=>U.rrect(cc,h[0]-12*u,h[1]-118*u,88*u,116*u,3*u),[246,242,230],{w:0.5});
  S.fill(c,cc=>U.rrect(cc,h[0]+14*u,h[1]-138*u,36*u,16*u,4*u),[110,112,120],{w:0.5});
  S.line(c,cc=>{for(let i=0;i<4;i++){cc.moveTo(h[0]-2*u,h[1]-(96-i*22)*u);cc.lineTo(h[0]+60*u,h[1]-(96-i*22)*u);}},[150,140,130],0.5);};
// a door panel, carried to the car in both hands
const fb_panel=col=>(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u,x=h[0]-30*u,y=h[1]-60*u;S.begin(c,{lw:U.clamp(J.u*2.6,1.2,3.2),sh:3});
  S.poly(c,[[x-100*u,y-80*u,1],[x+140*u,y-90*u,1],[x+150*u,y+120*u,1],[x-110*u,y+120*u,1]],col||fb_c("cars",0),{exact:true});
  S.poly(c,[[x-80*u,y-70*u,1],[x+120*u,y-78*u,1],[x+60*u,y-10*u,1],[x-80*u,y-6*u,1]],[176,196,204],{exact:true,w:0.6});};
AG_PLACES.fbGate82=c=>fb_gatePlace(c,false);AG_PLACES.fbGate84=c=>fb_gatePlace(c,true);
AG_PLACES.fbHall82=c=>fb_hallPlace(c,"82");AG_PLACES.fbHall84=c=>fb_hallPlace(c,"84");AG_PLACES.fbJapan=c=>fb_hallPlace(c,"jp");
// the plant by day in 1982 and 1984 is one place, as is its hall: a later moment there glides on, and only what changes fades
AG_ROOMS.fbGate84="fbGate82";AG_ROOMS.fbHall84="fbHall82";
AG_BARE.fbGate82=x=>fb_gate(x,1);AG_BARE.fbGate84=x=>fb_gate(x,0);
// the hall with nobody in it, for a later moment there: the cord stays; the line and its cars come and go with each moment, since
// the line stops in one and runs in the next
AG_BARE.fbHall82=(x,tt)=>{};AG_BARE.fbHall84=(x,tt)=>fb_cord(x,null);
