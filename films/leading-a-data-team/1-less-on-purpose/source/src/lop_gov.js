/* ===== Less, on purpose: GOV.UK, 2010 to 2013, in ink line =====
   The opening story's places, people and things (prefix lop_). The people kit draws the people and the rooms' things and is never
   changed for this film. Checked against the script's Rigour (Martha Lane Fox's letter of 14 October 2010; the Government Digital
   Service's design principles of 2012 and its blog; the Design Museum's award of April 2013).
     lopOffice   a government office in London, 2010: a tall window on the street, filing cabinets, a desk under piles of printed pages
     lopHome     a resident's front room: a window, a sideboard, a lamp; a small table with a laptop (drawn with the shot)
     lopGDS      the Government Digital Service's open office: a wall of cards, a board for its principles (LOP_BD), long windows
     lopMuseum   a gallery of the Design Museum: pale walls, the award's screen on its plinth
   Nothing is a likeness or a copy of a photograph or of a page; no logo is drawn. Colour keeps the module's meaning: blue a plan or a
   rule (the principles), orange data (the pages, the searches), green what got better, amber a cost; the rooms carry none. Every
   name this file declares starts with lop_ or LOP_. */
const LOP_IE=380,lop_h=fl=>PK.hAt(fl,LOP_IE),LOP_RF=800;
const LOP_PAL={grey:[214,216,206],warm:[232,214,190],white:[236,234,226],gallery:[238,236,230],floor:[170,150,122],boards:[186,160,124],stone:[200,196,186],
  cab:[150,156,150],paper:[248,246,238],sky:[206,220,230],town:[196,190,180],wood:[150,112,80],plinth:[226,224,216],lamp:[240,220,150]};
const lop_c=k=>PK.S.tone(LOP_PAL[k]);
// a room: its wall, a skirting, its floor; o.win [x,y,w,h]: a window on the street
function lop_room(ctx,wall,floor,o){o=o||{};const S=PK.S,U=PK.u;ctx.fillStyle=U.css(lop_c(wall));ctx.fillRect(0,0,1920,LOP_RF);
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,LOP_RF-22,1960,22),U.dk(lop_c(wall),0.12),{w:0.6});
  S.poly(ctx,[[-20,LOP_RF,1],[1940,LOP_RF,1],[1940,1100,1],[-20,1100,1]],lop_c(floor||"floor"),{exact:true,grad:[0,LOP_RF,0,1080,0.1]});
  if(o.win){const [x,y,w,h]=o.win;S.begin(ctx,{lw:2.4,sh:2});S.fill(ctx,c=>c.rect(x,y,w,h),lop_c("sky"),{flat:true,line:false});
    S.begin(ctx,{lw:2.2,far:0.4,sh:0});for(let i=0;i<5;i++){const bx=x+i*w/5,bh=h*(0.35+((i*37)%30)/100);S.fill(ctx,c=>c.rect(bx,y+h-bh,w/5-6,bh),lop_c("town"),{w:0.4});}
    PK.windowFrame(ctx,x,y,w,h,{});}}
AG_PLACES.lopOffice=ctx=>{const S=PK.S;lop_room(ctx,"grey","floor",{win:[1240,120,460,520]});
  // filing cabinets on the left, their drawers labelled with nothing
  S.begin(ctx,{lw:2.6,sh:4});for(const x0 of [60,250]){S.fill(ctx,c=>c.rect(x0,430,170,370),lop_c("cab"),{grad:[0,430,0,800,0.1]});
    S.line(ctx,c=>{for(let k=1;k<4;k++){c.moveTo(x0,430+k*92);c.lineTo(x0+170,430+k*92);}},PK.u.dk(lop_c("cab"),0.3),0.8);}};
// piles of printed pages on a desk's top (x: the pile's middle, top: the desk's top; n: piles; hgt: how tall, 0 to 1)
function lop_piles(ctx,x,top,n,hgt,k){const S=PK.S;k=k||1;S.begin(ctx,{lw:2.2*k,sh:2});for(let i=0;i<n;i++){const px=x+(i-(n-1)/2)*70*k,ph=(40+((i*53)%50))*hgt*k;
  S.fill(ctx,c=>c.rect(px-30*k,top-ph,60*k,ph),lop_c("paper"),{});S.line(ctx,c=>{for(let y=top-ph+8*k;y<top-4;y+=9*k){c.moveTo(px-30*k,y);c.lineTo(px+30*k,y);}},[180,176,166],0.5*k);}}
AG_PLACES.lopHome=ctx=>{const S=PK.S;lop_room(ctx,"warm","boards",{win:[260,140,420,460]});
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(1380,560,420,240),lop_c("wood"),{grad:[0,560,0,800,0.1]});
  S.fill(ctx,c=>{c.moveTo(1560,420);c.lineTo(1640,420);c.lineTo(1660,480);c.lineTo(1540,480);c.closePath();},lop_c("lamp"),{});
  S.line(ctx,c=>{c.moveTo(1600,480);c.lineTo(1600,560);},[90,80,70],1.0);};
AG_PLACES.lopGDS=ctx=>{const S=PK.S;lop_room(ctx,"white","floor",{win:[1460,110,420,560]});
  // the wall of cards: what people need, a card each
  S.begin(ctx,{lw:2.2,sh:2});const cols=[[246,226,150],[200,226,240],[214,236,200],[244,206,190]];
  for(let r=0;r<5;r++)for(let q=0;q<5;q++){const x0=80+q*92,y0=170+r*86;S.fill(ctx,c=>c.rect(x0,y0,72,62),cols[(r*3+q)%4],{w:0.5});}
  S.begin(ctx,{lw:3,far:0.1,sh:5});PK.board(ctx,LOP_BD.x,LOP_BD.y,LOP_BD.w,LOP_BD.h,{});};
const LOP_BD={x:640,y:300,k:0.5,w:1250*0.5,h:524*0.5,floor:930,rest:1320};
AG_PLACES.lopMuseum=ctx=>{const S=PK.S;lop_room(ctx,"gallery","stone");
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(860,560,220,240),lop_c("plinth"),{grad:[0,560,0,800,0.1]});
  // the award's screen on its plinth: plain bands, no page copied
  S.fill(ctx,c=>c.rect(800,300,340,250),[60,64,70],{});S.fill(ctx,c=>c.rect(816,316,308,218),[250,250,248],{flat:true});
  S.fill(ctx,c=>c.rect(816,316,308,40),[40,40,44],{flat:true});S.line(ctx,c=>{for(let y=390;y<520;y+=26){c.moveTo(840,y);c.lineTo(1080,y);}},[120,120,124],0.7);
  for(const x0 of [200,1440])S.fill(ctx,c=>c.rect(x0,260,280,200),[222,218,208],{});};

/* ---------------------------------------------------------------- the people of the story: nobody's likeness */
const LOP_FOLK={
  clerk1:{key:"lopClerk1",name:"",skin:[230,196,168],hair:{style:"short",c:[90,70,56]},top:{kind:"jacket",c:[70,76,92],inner:[236,234,228]},bottom:{kind:"trousers",c:[64,66,78]},shoe:[44,40,40]},
  clerk2:{key:"lopClerk2",name:"",skin:[196,150,118],hair:{style:"bob",c:[40,32,30]},top:{kind:"jacket",c:[120,96,110],inner:[240,236,228]},bottom:{kind:"skirt",c:[70,70,80]},shoe:[50,44,44]},
  official:{key:"lopOfficial",name:"",skin:[234,204,180],hair:{style:"short",c:[170,164,156]},glasses:[60,52,50],top:{kind:"jacket",c:[60,64,74],inner:[226,232,240]},bottom:{kind:"trousers",c:[56,58,66]},shoe:[40,36,36]},
  champion:{key:"lopChampion",name:"",skin:[238,208,186],hair:{style:"bob",c:[214,184,130]},top:{kind:"jacket",c:[170,80,90],inner:[244,238,230]},bottom:{kind:"trousers",c:[60,60,70]},shoe:[54,44,44]},
  resident:{key:"lopResident",name:"",skin:[232,198,172],hair:{style:"bun",c:[176,170,164]},glasses:[70,60,56],top:{kind:"sweater",c:[150,120,140]},bottom:{kind:"skirt",c:[90,90,110]},shoe:[60,50,48]},
  gds1:{key:"lopGds1",name:"",skin:[206,160,128],hair:{style:"crop",c:[50,40,36]},beard:[60,48,42],top:{kind:"sweater",c:[60,120,120]},bottom:{kind:"trousers",c:[60,64,80]},shoe:[50,44,40]},
  gds2:{key:"lopGds2",name:"",skin:[226,190,160],hair:{style:"long",c:[120,70,50]},top:{kind:"sweater",c:[200,150,70]},bottom:{kind:"trousers",c:[70,74,90]},shoe:[56,46,44]},
  gds3:{key:"lopGds3",name:"",skin:[160,116,90],hair:{style:"coily",c:[30,26,26]},top:{kind:"jacket",c:[90,110,90],inner:[236,232,224]},bottom:{kind:"trousers",c:[64,64,72]},shoe:[46,40,38]},
  visitor:{key:"lopVisitor",name:"",skin:[220,180,150],hair:{style:"short",c:[60,50,44]},top:{kind:"jacket",c:[140,130,110],inner:[236,232,224]},bottom:{kind:"trousers",c:[80,78,84]},shoe:[50,44,40]}};
const lop_row=w=>typeof w==="string"?(LOP_FOLK[w]||PK.CAST[w]):w;
const lop_person=(ctx,who,x,fl,pose,o,h)=>PK.person(ctx,lop_row(who),x,fl,h||lop_h(fl),pose,o);
const lop_desk=(ctx,who,x,fl,o)=>PK.atDesk(ctx,who?lop_row(who):null,x,fl,lop_h(fl),Object.assign({w:0.5*lop_h(fl),screen:null},o||{}));
// a laptop on a desk, drawn in a desk's o.on (D: the desk), and where its screen is, for a callout's tail
const lop_laptop=(cc,D,flip)=>{PK.laptop(cc,D.x0+D.dir*0.45*D.w,D.top,{k:D.k,flip:!!flip});};
