/* ===== The team comes first: Johannesburg, the 1930s, and today, in ink line =====
   The opening story's places, people and things (prefix tfp_). The people kit draws the people and the rooms' things and is never
   changed for this film. Drawn from what is known of the yards of rooms near the city in the 1930s (single rooms in a long row round a
   yard of beaten earth, limewashed walls, roofs of corrugated iron, one tap for the whole yard, washing hung across it, a mine dump on
   the skyline), never a likeness or a copy of a photograph of the time, and with no pattern or ornament borrowed from any culture.
     tfpYard     the yard: a row of rooms, its tap, a washing line, the mine dump beyond
     tfpMeet     inside one of its rooms, where a stokvel meets: a limewashed wall, a window in the late sun, a table with the pot (drawn
                 with the shot: tfp_table)
     tfpBank     a bank in the city: stone, its columns, its doors shut
   Nobody is shown poor, ill or grieving for effect: the women are at work, at their meeting, or with each other. Colour keeps the
   module's meaning: what's paid in, and what it buys, in green; what's at risk in amber; the group's rules in blue; the places wear
   none of them. Every name this file declares starts with tfp_ or TFP_. */
const TFP_IE=380,tfp_h=fl=>PK.hAt(fl,TFP_IE),TFP_RF=800;
const TFP_PAL={lime:[232,226,208],limeDk:[204,196,176],earth:[196,176,146],iron:[164,166,166],door:[120,92,70],sky:[208,220,228],dump:[226,208,160],
  stone:[214,204,184],col:[226,218,200],bankDoor:[96,78,62],boards:[176,150,118],wood:[150,112,80],tin:[176,180,180],cloth1:[220,200,170],cloth2:[190,206,214],cloth3:[214,190,190],tub:[150,154,156]};
const tfp_c=k=>PK.S.tone(TFP_PAL[k]);
// a room's wall and floor (as the hospital's rooms are drawn): wall, skirting, floor; o.win [x,y,w,h]: a window on the late sky
function tfp_room(ctx,wall,floor,o){o=o||{};const S=PK.S,U=PK.u;ctx.fillStyle=U.css(tfp_c(wall));ctx.fillRect(0,0,1920,TFP_RF);
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,TFP_RF-22,1960,22),U.dk(tfp_c(wall),0.12),{w:0.6});
  S.poly(ctx,[[-20,TFP_RF,1],[1940,TFP_RF,1],[1940,1100,1],[-20,1100,1]],tfp_c(floor),{exact:true,grad:[0,TFP_RF,0,1080,0.1]});
  if(o.win){const [x,y,w,h]=o.win;S.begin(ctx,{lw:2.4,sh:2});S.fill(ctx,c=>c.rect(x,y,w,h),[238,214,170],{flat:true,line:false});PK.windowFrame(ctx,x,y,w,h,{});}}
AG_PLACES.tfpYard=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(tfp_c("sky"));ctx.fillRect(0,0,1920,300);
  // the mine dump on the skyline, far off
  S.begin(ctx,{lw:2.2,far:0.5,sh:0});S.fill(ctx,c=>{c.moveTo(980,300);c.lineTo(1180,170);c.lineTo(1500,160);c.lineTo(1700,300);c.closePath();},tfp_c("dump"),{w:0.4});
  // the row of rooms: an iron roof, limewashed walls, a door for each room
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,240,1960,70),tfp_c("iron"),{});S.line(ctx,c=>{for(let x=0;x<1940;x+=26){c.moveTo(x,244);c.lineTo(x,306);}},U.dk(tfp_c("iron"),0.18),0.5);
  S.fill(ctx,c=>c.rect(-20,310,1960,TFP_RF-310),tfp_c("lime"),{grad:[0,310,0,TFP_RF,0.08]});
  for(const x of [120,520,920,1320,1720]){S.fill(ctx,c=>c.rect(x,470,130,330),tfp_c("door"),{});S.fill(ctx,c=>c.rect(x+170,500,110,90),tfp_c("sky"),{flat:true});PK.windowFrame(ctx,x+170,500,110,90,{});}
  S.poly(ctx,[[-20,TFP_RF,1],[1940,TFP_RF,1],[1940,1100,1],[-20,1100,1]],tfp_c("earth"),{exact:true,grad:[0,TFP_RF,0,1080,0.1]});
  // the yard's one tap, on its pipe, and the washing line across
  S.line(ctx,c=>{c.moveTo(1580,TFP_RF+40);c.lineTo(1580,690);c.lineTo(1610,690);},[90,90,94],1.6);
  S.line(ctx,c=>{c.moveTo(60,380);c.quadraticCurveTo(960,430,1880,380);},[110,100,90],0.7);
  [[300,"cloth1"],[620,"cloth2"],[1080,"cloth3"],[1400,"cloth1"]].forEach(([x,k])=>S.fill(ctx,c=>c.rect(x,398,120,110),tfp_c(k),{w:0.5}));};
AG_PLACES.tfpMeet=ctx=>{tfp_room(ctx,"lime","boards",{win:[1380,150,340,300]});const S=PK.S,U=PK.u;
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,0,1960,70),tfp_c("iron"),{});S.line(ctx,c=>{for(let x=0;x<1940;x+=26){c.moveTo(x,4);c.lineTo(x,66);}},U.dk(tfp_c("iron"),0.18),0.5);
  S.fill(ctx,c=>c.rect(160,300,240,180),[222,214,196],{});};
AG_PLACES.tfpBank=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(tfp_c("stone"));ctx.fillRect(0,0,1920,TFP_RF);
  S.begin(ctx,{lw:2.8,sh:5});S.fill(ctx,c=>c.rect(-20,80,1960,60),U.dk(tfp_c("stone"),0.08),{});
  for(const x of [240,560,1300,1620])S.fill(ctx,c=>c.rect(x,140,90,TFP_RF-140),tfp_c("col"),{grad:[x,0,x+90,0,0.12]});
  S.fill(ctx,c=>c.rect(780,300,360,500),tfp_c("bankDoor"),{});S.line(ctx,c=>{c.moveTo(960,300);c.lineTo(960,800);},U.dk(tfp_c("bankDoor"),0.3),1.0);
  S.poly(ctx,[[-20,TFP_RF,1],[1940,TFP_RF,1],[1940,1100,1],[-20,1100,1]],U.dk(tfp_c("stone"),0.1),{exact:true,grad:[0,TFP_RF,0,1080,0.1]});};
// the pot: a lidded tin on the table, where each member pays in (x, top: on a table's top)
function tfp_pot(ctx,x,top,k){k=k||1;const S=PK.S;S.begin(ctx,{lw:2.4*k,sh:3});S.fill(ctx,c=>c.rect(x-34*k,top-56*k,68*k,56*k),tfp_c("tin"),{});S.fill(ctx,c=>c.rect(x-38*k,top-64*k,76*k,10*k),PK.u.dk(tfp_c("tin"),0.15),{});}

/* ---------------------------------------------------------------- the women of one stokvel, and the bank's clerk: nobody's likeness */
const TFP_FOLK={
  m1:{key:"tfpM1",name:"",skin:[110,74,56],hair:{style:"scarf",c:[150,110,90]},top:{kind:"sweater",c:[150,120,100]},bottom:{kind:"skirt",c:[110,96,90]},shoe:[60,50,44]},
  m2:{key:"tfpM2",name:"",skin:[96,64,48],hair:{style:"coily",c:[24,20,20]},top:{kind:"jacket",c:[120,130,150],inner:[230,226,214]},bottom:{kind:"skirt",c:[90,90,104]},shoe:[54,46,42]},
  m3:{key:"tfpM3",name:"",skin:[124,84,62],hair:{style:"scarf",c:[96,110,120]},top:{kind:"sweater",c:[170,150,120]},bottom:{kind:"skirt",c:[120,100,84]},shoe:[64,52,44]},
  m4:{key:"tfpM4",name:"",skin:[104,70,52],hair:{style:"bun",c:[22,18,18]},glasses:[60,50,44],top:{kind:"sweater",c:[130,110,130]},bottom:{kind:"skirt",c:[86,80,96]},shoe:[58,48,44]},
  m5:{key:"tfpM5",name:"",skin:[136,94,70],hair:{style:"coily",c:[30,24,22]},top:{kind:"jacket",c:[156,140,110],inner:[236,230,216]},bottom:{kind:"skirt",c:[100,92,80]},shoe:[60,50,46]},
  clerk:{key:"tfpClerk",name:"",skin:[230,196,170],hair:{style:"short",c:[80,66,56]},top:{kind:"jacket",c:[64,66,74],inner:[236,234,228]},bottom:{kind:"trousers",c:[60,62,70]},shoe:[40,36,36]},
  // members of a stokvel today
  t1:{key:"tfpT1",name:"",skin:[100,68,50],hair:{style:"bob",c:[24,20,20]},top:{kind:"jacket",c:[60,110,120],inner:[236,232,224]},bottom:{kind:"trousers",c:[60,64,80]},shoe:[50,44,40]},
  t2:{key:"tfpT2",name:"",skin:[130,88,66],hair:{style:"crop",c:[28,24,22]},top:{kind:"sweater",c:[190,150,80]},bottom:{kind:"trousers",c:[70,74,90]},shoe:[56,46,44]},
  t3:{key:"tfpT3",name:"",skin:[90,60,46],hair:{style:"long",c:[22,18,18]},top:{kind:"sweater",c:[150,90,110]},bottom:{kind:"skirt",c:[70,70,80]},shoe:[50,44,44]}};
const tfp_row=w=>typeof w==="string"?(TFP_FOLK[w]||PK.CAST[w]):w;
const tfp_person=(ctx,who,x,fl,pose,o,h)=>PK.person(ctx,tfp_row(who),x,fl,h||tfp_h(fl),pose,o);
// someone at the stokvel's table, seen from the side (o.pot: the pot on the table)
const tfp_table=(ctx,who,x,fl,o)=>PK.atDesk(ctx,who?tfp_row(who):null,x,fl,tfp_h(fl),Object.assign({w:0.5*tfp_h(fl),screen:null},o||{},{on:(c2,D)=>{if(o&&o.pot)tfp_pot(c2,D.x0+D.dir*D.w*0.7,D.top,D.k);if(o&&o.out)o.out.D=D;}}));
