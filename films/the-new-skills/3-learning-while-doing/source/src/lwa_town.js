/* ===== Learning while doing: Angicos, 1963, in ink line =====
   The main street of a small town in the sertão of Rio Grande do Norte, seen across: low plastered houses in soft colours, each with a
   parapet over its door, timber shutters and a darker band along the foot of the wall; the caatinga's grey-green scrub, a mandacaru
   cactus and a carnaúba palm; a flat-topped serra far off. By day, and at dusk with its windows lit where a culture circle meets.
   Inside: a culture circle's room at night (a whitewashed wall, a bare bulb, a picture projected on the wall, a small board), an adult
   class of the kind Freire's team replaced, by day, and a plain room far away, for the book written in exile. Nothing here is a
   likeness or a copy of a photograph, and Paulo Freire and the president are named on cards, never drawn. People are dressed in plain
   everyday clothes of the place and time. Every name this file declares starts with lwa_ or LWA_. */
const LWA_E=430,LWA_ST=640;                                      // the eye line; where the street meets the houses
const lwa_h=fl=>PK.hAt(fl,LWA_E);
const LWA_PAL={sky:[214,228,236],sky2:[242,232,206],dusk:[118,104,140],dusk2:[230,160,120],serra:[170,160,150],ground:[220,196,156],ground2:[200,172,130],
  w1:[236,214,170],w2:[214,188,190],w3:[176,200,206],w4:[236,230,214],w5:[206,214,170],band:[150,120,96],roof:[176,104,76],shut:[94,120,110],door:[120,84,62],
  scrub:[150,164,130],cactus:[110,140,108],palm:[120,140,96],trunk:[150,120,92],white:[240,236,226],floor:[178,150,118],bench:[150,110,78],lamp:[250,226,160]};
const lwa_c=k=>PK.S.tone(LWA_PAL[k]);
const lwa_n=(c,dusk)=>dusk?PK.u.mix(c,[70,60,96],0.45):c;
// the houses along the street: [x0, x1, colour, height]
const LWA_HOUSES=[[-40,300,"w1",250],[300,620,"w3",230],[620,900,"w2",262],[900,1240,"w4",244],[1240,1540,"w5",236],[1540,1960,"w1",256]];
// the windows of the houses, in order (lit at dusk where a culture circle meets)
const LWA_WIN=LWA_HOUSES.map(([x0,x1])=>[x0+(x1-x0)*0.68,LWA_ST-150]);

/* ---------------------------------------------------------------- the street, by day and at dusk */
function lwa_street(ctx,dusk){const S=PK.S,U=PK.u,n=c=>lwa_n(c,dusk);
  const g=ctx.createLinearGradient(0,0,0,LWA_ST);g.addColorStop(0,U.css(dusk?lwa_c("dusk"):lwa_c("sky")));g.addColorStop(1,U.css(dusk?lwa_c("dusk2"):lwa_c("sky2")));ctx.fillStyle=g;ctx.fillRect(0,0,1920,LWA_ST);
  S.begin(ctx,{lw:2,far:0.6,sh:2});S.fill(ctx,c=>{c.moveTo(-20,LWA_ST-170);c.lineTo(260,LWA_ST-250);c.lineTo(820,LWA_ST-256);c.lineTo(1040,LWA_ST-190);c.lineTo(1940,LWA_ST-200);c.lineTo(1940,LWA_ST);c.lineTo(-20,LWA_ST);c.closePath();},n(lwa_c("serra")),{});
  // the palm and the scrub behind the houses
  S.begin(ctx,{lw:2.4,far:0.3,sh:3});S.fill(ctx,c=>c.rect(1146,LWA_ST-420,16,200),n(lwa_c("trunk")),{});
  for(let i=0;i<9;i++){const a=-Math.PI*0.95+i*Math.PI*0.9/8;S.fill(ctx,c=>{c.moveTo(1154,LWA_ST-420);c.quadraticCurveTo(1154+Math.cos(a)*80,LWA_ST-420+Math.sin(a)*80-20,1154+Math.cos(a)*150,LWA_ST-420+Math.sin(a)*120+30);c.quadraticCurveTo(1154+Math.cos(a)*70,LWA_ST-420+Math.sin(a)*60,1154,LWA_ST-414);c.closePath();},n(lwa_c("palm")),{w:0.6});}
  for(const [x,r] of [[120,70],[460,60],[1420,80],[1800,64]])S.fill(ctx,c=>{c.ellipse(x,LWA_ST-230,r,40,0,0,7);},n(lwa_c("scrub")),{});
  // the houses: wall, band, parapet, door, window with shutters
  S.begin(ctx,{lw:2.6,far:0.15,sh:3});
  for(const [x0,x1,col,ht] of LWA_HOUSES){const top=LWA_ST-ht,mid=(x0+x1)/2;
    S.fill(ctx,c=>c.rect(x0,top,x1-x0,ht),n(lwa_c(col)),{grad:[0,top,0,LWA_ST,0.08]});
    S.fill(ctx,c=>c.rect(x0,LWA_ST-40,x1-x0,40),n(lwa_c("band")),{w:0.6});
    S.fill(ctx,c=>{c.moveTo(x0,top);c.lineTo(x0,top-26);c.lineTo(mid-60,top-26);c.quadraticCurveTo(mid,top-70,mid+60,top-26);c.lineTo(x1,top-26);c.lineTo(x1,top);c.closePath();},n(lwa_c(col)),{});
    S.fill(ctx,c=>c.rect(x0,top-8,x1-x0,10),n(PK.u.dk(lwa_c(col),0.15)),{w:0.5});
    const dx=x0+(x1-x0)*0.28;S.fill(ctx,c=>c.rect(dx-42,LWA_ST-180,84,180),n(lwa_c("door")),{});
    const [wx,wy]=[x0+(x1-x0)*0.68,LWA_ST-150];S.fill(ctx,c=>c.rect(wx-50,wy-50,100,96),n(PK.u.dk(lwa_c(col),0.35)),{});
    S.fill(ctx,c=>{c.rect(wx-50,wy-50,26,96);c.rect(wx+24,wy-50,26,96);},n(lwa_c("shut")),{w:0.6});}
  // a mandacaru cactus at the right, and the street
  S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,LWA_ST,1],[1940,LWA_ST,1],[1940,1100,1],[-20,1100,1]],n(lwa_c("ground")),{exact:true,grad:[0,LWA_ST,0,1080,0.1]});
  S.line(ctx,c=>{for(const [x,y,l] of [[200,760,120],[700,830,160],[1300,700,100],[1600,900,180],[400,980,140]]){c.moveTo(x,y);c.lineTo(x+l,y+4);}},n(lwa_c("ground2")),0.6);
  S.fill(ctx,c=>{c.rect(1860,LWA_ST-230,34,260);c.rect(1820,LWA_ST-170,24,90);c.rect(1820,LWA_ST-104,60,22);},n(lwa_c("cactus")),{});}
AG_PLACES.lwaStreet=ctx=>lwa_street(ctx,false);
AG_PLACES.lwaDusk=ctx=>lwa_street(ctx,true);
// the windows lit at dusk (lit: 0 to 1), drawn in the scene
function lwa_lit(ctx,lit){const U=PK.u;for(const [wx,wy] of LWA_WIN){if(lit<=0.004)continue;ctx.fillStyle=U.css(lwa_c("lamp"),0.85*lit);ctx.fillRect(wx-24,wy-48,48,92);}}

/* ---------------------------------------------------------------- rooms */
const LWA_RF=800;                                                 // where the rooms' floor meets the wall
function lwa_room(ctx,wall,floor){const S=PK.S;ctx.fillStyle=PK.u.css(wall);ctx.fillRect(0,0,1920,LWA_RF);S.begin(ctx,{lw:2.6,sh:4});
  S.fill(ctx,c=>c.rect(-20,LWA_RF-60,1960,60),PK.u.dk(wall,0.12),{w:0.6});
  S.poly(ctx,[[-20,LWA_RF,1],[1940,LWA_RF,1],[1940,1100,1],[-20,1100,1]],floor,{exact:true,grad:[0,LWA_RF,0,1080,0.1]});}
// the coordinator's sheet on the circle's wall, at the right (a board's 1250 by 524 px, at k)
const LWA_BD={x:1100,y:300,k:0.45,w:1250*0.45,h:524*0.45,floor:960,rest:1790};
// a culture circle's room at night: the bare bulb over the middle, the picture on the wall at the left, a small board at the right
AG_PLACES.lwaCircle=ctx=>{const S=PK.S,U=PK.u;lwa_room(ctx,PK.u.mix(lwa_c("white"),[200,190,170],0.25),lwa_c("floor"));
  const g=ctx.createRadialGradient(960,150,30,960,150,900);g.addColorStop(0,U.css(lwa_c("lamp"),0.35));g.addColorStop(1,U.css(lwa_c("lamp"),0));ctx.fillStyle=g;ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:2.2,sh:3});S.line(ctx,c=>{c.moveTo(960,0);c.lineTo(960,110);},[70,60,56],0.8);S.fill(ctx,c=>c.ellipse(960,128,16,20,0,0,7),lwa_c("lamp"),{});
  S.fill(ctx,c=>c.rect(220,150,520,380),[248,244,230],{w:0.6});
  S.begin(ctx,{lw:2.6,sh:4});PK.board(ctx,LWA_BD.x,LWA_BD.y,LWA_BD.w,LWA_BD.h,{});};
// an adult class by day, before Freire's team: a plain room with a window
AG_PLACES.lwaClass=ctx=>{const S=PK.S;lwa_room(ctx,lwa_c("w4"),lwa_c("floor"));S.begin(ctx,{lw:2.4,sh:3});PK.window(ctx,1180,150,420,360,null,{});};
// far away, years later: a plain room, a desk under a window, a book on it
AG_PLACES.lwaAbroad=ctx=>{const S=PK.S;lwa_room(ctx,[214,214,206],[160,150,140]);S.begin(ctx,{lw:2.4,sh:3});PK.window(ctx,760,140,400,360,null,{});
  PK.desk(ctx,960,640,560,LWA_RF+120,{});S.fill(ctx,c=>c.rect(880,610,170,30),[150,60,52],{});S.fill(ctx,c=>c.rect(880,604,170,8),[246,240,226],{w:0.5});};

/* ---------------------------------------------------------------- what the picture on the wall shows: a hammock with its tassels */
function lwa_slide(ctx,a){if(a<=0.004)return;const S=PK.S;ctx.save();ctx.globalAlpha*=a;S.begin(ctx,{lw:3,sh:0});
  S.line(ctx,c=>{c.moveTo(270,250);c.lineTo(690,250);},[110,84,62],1.2);
  S.fill(ctx,c=>{c.moveTo(300,256);c.quadraticCurveTo(480,440,660,256);c.quadraticCurveTo(480,360,300,256);c.closePath();},[204,104,82],{});
  for(let i=0;i<9;i++){const x=330+i*37,y=256+Math.sin(Math.PI*(i+0.5)/9)*130;S.line(ctx,c=>{c.moveTo(x,y);c.lineTo(x,y+40);},[204,104,82],1);S.fill(ctx,c=>c.arc(x,y+46,7,0,7),[236,180,90],{w:0.5});}
  ctx.restore();}

/* ---------------------------------------------------------------- the people of Angicos: nobody's likeness */
const LWA_FOLK={
  farm:{key:"farm",name:"",skin:[176,124,92],hair:{style:"short",c:[40,32,30]},top:{kind:"jacket",c:[214,200,170],inner:[236,230,214]},bottom:{kind:"trousers",c:[120,110,96]},shoe:[90,70,56]},
  build:{key:"build",name:"",skin:[150,104,78],hair:{style:"crop",c:[30,26,24]},top:{kind:"sweater",c:[176,150,120]},bottom:{kind:"trousers",c:[90,96,110]},shoe:[80,64,52]},
  wash1:{key:"wash1",name:"",skin:[196,146,110],hair:{style:"bun",c:[34,28,26]},top:{kind:"jacket",c:[196,170,200],inner:[240,232,220]},bottom:{kind:"skirt",c:[120,130,160]},shoe:[90,72,60]},
  wash2:{key:"wash2",name:"",skin:[120,82,62],hair:{style:"coily",c:[30,24,22]},top:{kind:"jacket",c:[230,190,120],inner:[240,232,220]},bottom:{kind:"skirt",c:[160,100,90]},shoe:[80,60,50]},
  stu1:{key:"stu1",name:"",skin:[232,196,164],hair:{style:"short",c:[52,40,34]},glasses:[50,44,44],top:{kind:"jacket",c:[236,234,226],inner:[236,234,226]},bottom:{kind:"trousers",c:[90,96,110]},shoe:[50,44,44]},
  stu2:{key:"stu2",name:"",skin:[214,170,136],hair:{style:"long",c:[40,30,28]},top:{kind:"jacket",c:[120,150,180],inner:[240,236,226]},bottom:{kind:"skirt",c:[70,80,100]},shoe:[60,50,48]}};
const lwa_row=w=>typeof w==="string"?(LWA_FOLK[w]||PK.CAST[w]):w;
const lwa_person=(ctx,who,x,fl,pose,o)=>PK.person(ctx,lwa_row(who),x,fl,lwa_h(fl),pose,o);
const lwa_walk=(ctx,who,t,w,o)=>PK.walk(ctx,lwa_row(who),t,Object.assign({h:lwa_h(w.floor)},w),o);
// someone on a bench, seen from the side (o.flip: facing left); h from the room's eye line (the rooms' eye: LWA_IE)
const LWA_IE=380,lwa_hi=fl=>PK.hAt(fl,LWA_IE);
const lwa_seat=(ctx,who,x,fl,pose,o)=>PK.seated(ctx,lwa_row(who),x,fl,lwa_hi(fl),pose||"sit",o);
