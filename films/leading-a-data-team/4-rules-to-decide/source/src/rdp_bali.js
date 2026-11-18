/* ===== Rules that let people decide: Bali, the 1970s and 1980s, in ink line =====
   The opening story's places, people and things (prefix rdp_). The people kit draws the people and the rooms' things and is never
   changed for this film. Drawn from what is known of them (Lansing 1991 and 2007; Lansing and Kremer 1993), never a likeness or a copy
   of a photograph or a painting. The temple is drawn plainly, as a place where farmers meet: a stone wall with a split gate and an open
   pavilion, no ornament copied from Balinese art. People are farmers and officials of the time, in plain clothes, nobody's likeness;
   the two researchers are named, never drawn.
     rdpTerraces   a terraced hillside, the volcano behind in haze, a canal coming down on the left; what the fields hold is drawn with
                   the shot (rdp_fields: water, young rice, ripe rice, bare, or dry)
     rdpTemple     a water temple's court: its wall, the split gate, the pavilion where the groups meet
     rdpOffice     a planners' office: a window, a map of the island's rivers on the wall
   Colour keeps the module's meaning: the temples' calendar in blue (a plan), the harvest in green, the pests and the lost water in
   amber; the land wears none of them. Every name this file declares starts with rdp_ or RDP_. */
const RDP_IE=380,rdp_h=fl=>PK.hAt(fl,RDP_IE),RDP_RF=800;
const RDP_PAL={sky:[206,220,228],volc:[176,180,192],volcHi:[206,208,212],water:[184,206,214],sage:[160,178,120],ripe:[214,190,124],bare:[160,136,108],dry:[206,186,150],
  riser:[124,120,90],stone:[196,188,172],stoneDk:[164,156,140],thatch:[96,84,72],wood:[150,112,80],ground:[184,170,140],wall:[226,218,200],floor:[170,150,122],map:[236,230,214],mapRiver:[150,176,184]};
const rdp_c=k=>PK.S.tone(RDP_PAL[k]);
const RDP_FIELDS=[[0,560,1920,600],[0,640,1920,690],[0,730,1920,800],[0,820,1920,900],[0,910,1920,1000],[0,1000,1920,1100]];
AG_PLACES.rdpTerraces=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(rdp_c("sky"));ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:2.2,far:0.5,sh:0});S.fill(ctx,c=>{c.moveTo(700,560);c.lineTo(1100,150);c.lineTo(1220,150);c.lineTo(1700,560);c.closePath();},rdp_c("volc"),{w:0.4});
  S.fill(ctx,c=>{c.moveTo(1040,212);c.lineTo(1100,150);c.lineTo(1220,150);c.lineTo(1280,212);c.closePath();},rdp_c("volcHi"),{w:0.3});
  rdp_fields(ctx,"young");};
// the terraces' fields, step by step down the hill, holding what the season gives (state: water, young, ripe, bare or dry)
function rdp_fields(ctx,state,o){o=o||{};const S=PK.S,U=PK.u,col={water:"water",young:"sage",ripe:"ripe",bare:"bare",dry:"dry"};
  S.begin(ctx,{lw:2.4,sh:3});RDP_FIELDS.forEach(([x0,y0,x1,y1],i)=>{const k=typeof state==="function"?state(i):state;
    S.fill(ctx,c=>c.rect(x0-20,y0,x1-x0+40,y1-y0),rdp_c(col[k]||"sage"),{w:0.6});S.fill(ctx,c=>c.rect(x0-20,y1-10,x1-x0+40,10),rdp_c("riser"),{w:0.5});
    if(k==="young"||k==="ripe")S.line(ctx,c=>{for(let x=40;x<1920;x+=60){c.moveTo(x,y1-12);c.lineTo(x+6,y0+8);}},U.dk(rdp_c(col[k]),0.25),0.5);});
  // the canal, coming down on the left
  S.fill(ctx,c=>{c.moveTo(150,560);c.lineTo(210,560);c.lineTo(250,1080);c.lineTo(170,1080);c.closePath();},rdp_c(o.dryCanal?"dry":"water"),{w:0.6});}
AG_PLACES.rdpTemple=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(rdp_c("sky"));ctx.fillRect(0,0,1920,RDP_RF);
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,420,1960,RDP_RF-420),rdp_c("stone"),{grad:[0,420,0,RDP_RF,0.08]});
  // the split gate: two halves of one tower, an opening between them
  for(const [x0,x1] of [[640,880],[1040,1280]])S.fill(ctx,c=>{c.moveTo(x0,RDP_RF);c.lineTo(x0+30,170);c.lineTo(x1-30,170);c.lineTo(x1,RDP_RF);c.closePath();},rdp_c("stoneDk"),{});
  // the open pavilion, on the right: a roof on four posts
  S.fill(ctx,c=>{c.moveTo(1400,330);c.lineTo(1660,250);c.lineTo(1920,330);c.closePath();},rdp_c("thatch"),{});
  S.line(ctx,c=>{for(const x of [1430,1560,1760,1890]){c.moveTo(x,330);c.lineTo(x,RDP_RF);}},rdp_c("wood"),1.4);
  S.poly(ctx,[[-20,RDP_RF,1],[1940,RDP_RF,1],[1940,1100,1],[-20,1100,1]],rdp_c("ground"),{exact:true,grad:[0,RDP_RF,0,1080,0.1]});};
AG_PLACES.rdpOffice=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(rdp_c("wall"));ctx.fillRect(0,0,1920,RDP_RF);
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,RDP_RF-22,1960,22),U.dk(rdp_c("wall"),0.12),{w:0.6});
  S.poly(ctx,[[-20,RDP_RF,1],[1940,RDP_RF,1],[1940,1100,1],[-20,1100,1]],rdp_c("floor"),{exact:true,grad:[0,RDP_RF,0,1080,0.1]});
  S.begin(ctx,{lw:2.4,sh:2});S.fill(ctx,c=>c.rect(1460,140,380,420),rdp_c("sky"),{flat:true,line:false});PK.windowFrame(ctx,1460,140,380,420,{});
  // a map of the island's rivers on the wall: no place named
  S.begin(ctx,{lw:2.4,sh:3});S.fill(ctx,c=>c.rect(240,170,560,380),rdp_c("map"),{});
  S.line(ctx,c=>{c.moveTo(420,190);c.bezierCurveTo(400,300,480,380,450,530);c.moveTo(600,190);c.bezierCurveTo(640,320,560,400,620,530);},rdp_c("mapRiver"),1.0);};

/* ---------------------------------------------------------------- farmers and officials of the time: nobody's likeness */
const RDP_FOLK={
  f1:{key:"rdpF1",name:"",skin:[170,120,84],hair:{style:"short",c:[30,26,24]},top:{kind:"sweater",c:[200,196,180]},bottom:{kind:"trousers",c:[90,86,80]},shoe:[70,56,46]},
  f2:{key:"rdpF2",name:"",skin:[150,104,74],hair:{style:"crop",c:[26,22,20]},top:{kind:"jacket",c:[150,140,110],inner:[230,226,214]},bottom:{kind:"trousers",c:[100,92,80]},shoe:[64,52,44]},
  f3:{key:"rdpF3",name:"",skin:[164,114,82],hair:{style:"bun",c:[24,20,20]},top:{kind:"sweater",c:[176,150,130]},bottom:{kind:"skirt",c:[110,100,90]},shoe:[70,56,46]},
  f4:{key:"rdpF4",name:"",skin:[140,96,70],hair:{style:"short",c:[180,176,170]},top:{kind:"sweater",c:[220,214,200]},bottom:{kind:"trousers",c:[80,80,84]},shoe:[60,50,44]},
  planner:{key:"rdpPlanner",name:"",skin:[176,128,94],hair:{style:"short",c:[34,30,28]},glasses:[60,52,50],top:{kind:"jacket",c:[90,96,110],inner:[236,234,228]},bottom:{kind:"trousers",c:[70,72,82]},shoe:[44,40,40]},
  banker:{key:"rdpBanker",name:"",skin:[232,200,176],hair:{style:"short",c:[120,110,100]},top:{kind:"jacket",c:[70,74,86],inner:[236,234,228]},bottom:{kind:"trousers",c:[60,62,72]},shoe:[40,36,36]}};
const rdp_row=w=>typeof w==="string"?(RDP_FOLK[w]||PK.CAST[w]):w;
const rdp_person=(ctx,who,x,fl,pose,o,h)=>PK.person(ctx,rdp_row(who),x,fl,h||rdp_h(fl),pose,o);
