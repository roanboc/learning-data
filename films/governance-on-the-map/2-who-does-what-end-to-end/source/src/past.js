/* ===== Who does what, end to end: the people of the opening =====
   Madrid in 1892, Lima in the 1890s and in 1909, Mexico City in 1951, and the academies today, drawn as the series draws people (its
   people.js), a warm umber wash behind each person of the past. The academy's members in 1892 in dark frock coats with high collars,
   most of them bearded; Ricardo Palma in his fifties, with a full grey moustache, and at seventy-six, white-haired; a teacher and his
   pupil; a shopkeeper, a clerk, a market seller and her customer, who use the words; the delegates of 1951 in the suits of their day;
   and today's members, the commission and the person at a bus stop. Their poses, and what they hold, in the figure's own units. Every
   name starts with ee or ee_. */

// a full moustache, drawn over the mouth, for a man with no beard (P.tache, its colour): the series' faces have beards, not moustaches
const ee_face0=face;
face=function(ctx,P,E,po,t){ee_face0(ctx,P,E,po,t);if(P.tache)ee_tache(ctx,P,po);};
function ee_tache(ctx,P,po){const c=P.tache,fx=po.turn*7*1.1,y=21+po.look*1.5;ctx.save();ctx.translate(fx,y);
  ctx.beginPath();ctx.moveTo(0,-5);ctx.bezierCurveTo(8,-9,22,-8,28,-1);ctx.bezierCurveTo(33,4,34,12,30,16);ctx.bezierCurveTo(26,10,18,7,8,8);ctx.quadraticCurveTo(2,8,0,5);
  ctx.quadraticCurveTo(-2,8,-8,8);ctx.bezierCurveTo(-18,7,-26,10,-30,16);ctx.bezierCurveTo(-34,12,-33,4,-28,-1);ctx.bezierCurveTo(-22,-8,-8,-9,0,-5);ctx.closePath();
  ctx.fillStyle=rgba(c,0.96);ctx.fill();ctx.strokeStyle=rgba(darken(c,0.35),0.5);ctx.lineWidth=1.4;ctx.stroke();
  ctx.strokeStyle=rgba(lighten(c,0.3),0.45);ctx.lineWidth=1.2;ctx.lineCap="round";for(let i=0;i<10;i++){const s=i<5?-1:1,k=i%5;ctx.beginPath();ctx.moveTo(s*(4+k*5),-3+k*0.6);ctx.quadraticCurveTo(s*(8+k*5),3+k,s*(6+k*5.4),9+k*1.2);ctx.stroke();}
  ctx.restore();}

const EE_FROCK=[[34,34,42],[48,44,46],[40,46,58],[56,48,44],[30,32,38]];
Object.assign(PEOPLE,{
  // the academy's members in 1892: its director at the head of the table, white-bearded; the others along it
  eeHead:{name:"",role:"the academy's director",side:"",edge:GV_PAST,seed:81,skin:[226,190,164],hair:{style:"side",c:[226,224,220]},beard:[232,230,226],glasses:[120,110,90],
    top:{kind:"frock",c:EE_FROCK[0],vest:[60,56,58],inner:[246,244,238],tie:[24,22,26]},bottom:{c:[40,40,46]},shoe:[24,22,24],build:{sh:76,hip:64,h:1.0}},
  eeM1:{name:"",role:"member",side:"",edge:GV_PAST,seed:82,skin:[222,184,156],hair:{style:"side",c:[150,146,140]},beard:[158,154,148],
    top:{kind:"frock",c:EE_FROCK[1],vest:[96,84,70],inner:[246,244,238],tie:[30,28,34]},bottom:{c:[50,48,54]},shoe:[24,22,24],build:{sh:76,hip:64,h:1.0}},
  eeM2:{name:"",role:"member",side:"",edge:GV_PAST,seed:83,skin:[214,172,140],hair:{style:"cropped",c:[52,42,36]},beard:[58,46,38],
    top:{kind:"frock",c:EE_FROCK[2],vest:[110,96,80],inner:[246,244,238],tie:[30,28,34]},bottom:{c:[50,52,60]},shoe:[24,22,24],build:{sh:74,hip:62,h:1.01}},
  eeM3:{name:"",role:"member",side:"",edge:GV_PAST,seed:84,skin:[230,194,166],hair:{style:"side",c:[110,96,84]},tache:[118,104,92],glasses:[110,100,84],
    top:{kind:"frock",c:EE_FROCK[3],vest:[84,72,64],inner:[246,244,238],tie:[34,30,38]},bottom:{c:[54,50,52]},shoe:[24,22,24],build:{sh:78,hip:66,h:0.99}},
  eeM4:{name:"",role:"member",side:"",edge:GV_PAST,seed:85,skin:[220,180,150],hair:{style:"cropped",c:[200,198,194]},beard:[206,204,200],
    top:{kind:"frock",c:EE_FROCK[4],vest:[70,64,66],inner:[246,244,238],tie:[24,22,26]},bottom:{c:[40,40,46]},shoe:[24,22,24],build:{sh:76,hip:64,h:1.0}},
  eeM5:{name:"",role:"member",side:"",edge:GV_PAST,seed:86,skin:[208,166,132],hair:{style:"side",c:[40,34,30]},tache:[44,36,32],
    top:{kind:"frock",c:EE_FROCK[1],vest:[120,104,84],inner:[246,244,238],tie:[30,28,34]},bottom:{c:[50,48,54]},shoe:[24,22,24],build:{sh:74,hip:62,h:1.02}},
  // Ricardo Palma in 1892, at fifty-nine, and in 1909, at seventy-six
  eePalma:{name:"",role:"writer",side:"",edge:GV_PAST,seed:87,skin:[200,154,118],hair:{style:"side",c:[132,124,116]},tache:[150,144,136],
    top:{kind:"frock",c:[62,56,52],vest:[92,80,68],inner:[246,244,238],tie:[30,26,30]},bottom:{c:[58,54,54]},shoe:[24,22,24],build:{sh:74,hip:62,h:0.97}},
  eePalmaOld:{name:"",role:"writer",side:"",edge:GV_PAST,seed:88,skin:[200,156,124],hair:{style:"side",c:[236,234,230]},tache:[240,238,234],glasses:[96,84,66],
    top:{kind:"frock",c:[46,44,48],vest:[70,62,58],inner:[246,244,238],tie:[30,26,30]},bottom:{c:[46,44,48]},shoe:[24,22,24],build:{sh:72,hip:62,h:0.95}},
  // Lima in the 1890s: a teacher and his pupil; then three people who use the words every day, and a customer
  eeTeacher:{name:"",role:"teacher",side:"",edge:GV_PAST,seed:89,skin:[196,148,112],hair:{style:"cropped",c:[46,38,32]},tache:[50,40,34],
    top:{kind:"frock",c:[70,66,62],vest:[110,100,86],inner:[246,244,238],tie:[40,34,40]},bottom:{c:[66,62,60]},shoe:[30,26,26],build:{sh:74,hip:62,h:1.0}},
  eePupil:{name:"",role:"pupil",side:"",edge:GV_PAST,seed:90,skin:[190,140,104],hair:{style:"cropped",c:[34,28,26]},
    top:{kind:"shirt",c:[226,222,208]},bottom:{c:[86,80,74]},shoe:[50,40,34],build:{sh:58,hip:52,h:0.62}},
  eeShop:{name:"",role:"shopkeeper",side:"",edge:GV_PAST,seed:91,skin:[204,158,122],hair:{style:"side",c:[60,48,40]},tache:[66,52,42],
    top:{kind:"vest",c:[238,232,218],vest:[104,86,64],apron:[226,218,198]},bottom:{c:[80,72,64]},shoe:[44,36,30],build:{sh:76,hip:66,h:0.99}},
  eeClerk:{name:"",role:"clerk",side:"",edge:GV_PAST,seed:92,skin:[226,190,160],hair:{style:"side",c:[96,74,52]},glasses:[90,80,64],
    top:{kind:"vest",c:[240,236,226],vest:[70,70,78]},bottom:{c:[60,60,66]},shoe:[30,26,26],build:{sh:72,hip:60,h:1.0}},
  eeSeller:{name:"",role:"market seller",side:"",edge:GV_PAST,seed:93,skin:[186,136,100],hair:{style:"bun",c:[30,24,22]},hat:"straw",hatC:[222,200,146],
    top:{kind:"gown",c:[120,78,66],inner:[236,228,212],apron:[232,224,206]},bottom:{c:[70,58,52]},shoe:[50,40,34],build:{sh:64,hip:62,h:0.93}},
  eeBuyer:{name:"",role:"customer",side:"",edge:GV_PAST,seed:94,skin:[214,170,136],hair:{style:"side",c:[70,56,44]},beard:[76,60,46],hat:"top",hatC:[50,46,48],
    top:{kind:"frock",c:[88,78,66],vest:[130,114,92],inner:[246,244,238],tie:[60,46,40]},bottom:{c:[80,74,68]},shoe:[36,30,28],build:{sh:74,hip:62,h:1.0}},
  // Mexico City, 1951: delegates of the academies of the Americas, in the suits of their day
  eeD1:{name:"",role:"delegate",side:"",edge:GV_PAST,seed:95,skin:[196,150,116],hair:{style:"side",c:[40,34,30]},tache:[44,36,30],glasses:[40,36,34],
    top:{kind:"suit",c:[64,66,74],inner:[240,240,236]},bottom:{c:[60,62,70]},shoe:[26,22,22],build:{sh:76,hip:64,h:1.0}},
  eeD2:{name:"",role:"delegate",side:"",edge:GV_PAST,seed:96,skin:[222,186,158],hair:{style:"side",c:[176,172,166]},
    top:{kind:"suit",c:[84,72,62],inner:[240,240,236]},bottom:{c:[78,68,60]},shoe:[40,30,26],build:{sh:78,hip:66,h:0.99}},
  eeD3:{name:"",role:"delegate",side:"",edge:GV_PAST,seed:97,skin:[180,132,98],hair:{style:"cropped",c:[26,22,20]},
    top:{kind:"suit",c:[46,52,70],inner:[240,240,236]},bottom:{c:[44,50,66]},shoe:[26,22,22],build:{sh:74,hip:62,h:1.02}},
  eeD4:{name:"",role:"delegate",side:"",edge:GV_PAST,seed:98,skin:[214,174,142],hair:{style:"side",c:[120,112,104]},tache:[128,120,112],
    top:{kind:"suit",c:[96,96,100],inner:[240,240,236]},bottom:{c:[90,90,94]},shoe:[30,26,26],build:{sh:76,hip:66,h:0.98}},
  eeD5:{name:"",role:"delegate",side:"",edge:GV_PAST,seed:99,skin:[204,160,126],hair:{style:"side",c:[56,44,36]},glasses:[60,50,40],
    top:{kind:"suit",c:[58,48,44],inner:[240,240,236]},bottom:{c:[56,48,44]},shoe:[30,26,26],build:{sh:74,hip:62,h:1.0}},
  eeD6:{name:"",role:"delegate",side:"",edge:GV_PAST,seed:100,skin:[226,192,166],hair:{style:"side",c:[210,208,204]},beard:[214,212,208],
    top:{kind:"suit",c:[38,40,50],inner:[240,240,236]},bottom:{c:[38,40,50]},shoe:[26,22,22],build:{sh:76,hip:64,h:0.99}},
  // Madrid, 1956: the Spanish Academy's delegate, at the table where the academies meet again
  eeD7:{name:"",role:"delegate",side:"",edge:GV_PAST,seed:110,skin:[224,186,156],hair:{style:"side",c:[206,204,200]},glasses:[60,50,44],
    top:{kind:"suit",c:[54,52,60],inner:[240,240,236]},bottom:{c:[54,52,60]},shoe:[26,22,22],build:{sh:76,hip:64,h:0.99}},
  // today: two members who propose words, each in their own city; the commission; the academy's members; someone at a bus stop
  eeTodayA:{name:"",role:"member",side:"",edge:GV_PAST,seed:101,skin:[184,134,100],hair:{style:"long",c:[36,28,26]},earrings:[255,214,140],
    top:{kind:"blazer",c:[150,70,74],inner:[238,230,218]},bottom:{c:[46,48,58]},shoe:[40,32,32],build:{sh:66,hip:60,h:0.95}},
  eeTodayB:{name:"",role:"member",side:"",edge:GV_PAST,seed:102,skin:[222,184,154],hair:{style:"side",c:[150,146,140]},beard:[160,156,150],glasses:[50,46,44],
    top:{kind:"sweater",c:[70,104,96]},bottom:{c:[60,60,70]},shoe:[40,32,32],build:{sh:76,hip:64,h:1.0}},
  eeC1:{name:"",role:"commission",side:"",edge:GV_PAST,seed:103,skin:[214,170,136],hair:{style:"bob",c:[150,148,146],streak:[200,200,202]},glasses:[70,58,54],
    top:{kind:"cardigan",c:[96,110,140],inner:[236,236,230]},bottom:{c:[50,52,62]},shoe:[40,32,32],build:{sh:66,hip:60,h:0.95}},
  eeC2:{name:"",role:"commission",side:"",edge:GV_PAST,seed:104,skin:[160,112,82],hair:{style:"cropped",c:[30,26,24]},
    top:{kind:"suit",c:[54,62,80],inner:[236,238,244]},bottom:{c:[50,56,72]},shoe:[26,22,22],build:{sh:76,hip:64,h:1.02}},
  eeC3:{name:"",role:"commission",side:"",edge:GV_PAST,seed:105,skin:[232,196,168],hair:{style:"bun",c:[110,74,48]},earrings:[255,214,140],
    top:{kind:"blazer",c:[110,124,98],inner:[238,232,220]},bottom:{c:[60,60,66]},shoe:[40,32,32],build:{sh:66,hip:60,h:0.96}},
  eeC4:{name:"",role:"commission",side:"",edge:GV_PAST,seed:106,skin:[206,162,128],hair:{style:"side",c:[78,62,50]},glasses:[40,36,34],
    top:{kind:"shirt",c:[196,210,226]},bottom:{c:[70,70,80]},shoe:[40,32,32],build:{sh:76,hip:62,h:1.0}},
  eeC5:{name:"",role:"member",side:"",edge:GV_PAST,seed:107,skin:[226,188,160],hair:{style:"bob",c:[190,186,182],streak:[230,230,232]},
    top:{kind:"blazer",c:[70,62,80],inner:[238,232,222]},bottom:{c:[46,44,52]},shoe:[30,26,26],build:{sh:68,hip:60,h:0.96}},
  eeC6:{name:"",role:"member",side:"",edge:GV_PAST,seed:108,skin:[176,128,94],hair:{style:"side",c:[36,30,28]},beard:[40,32,30],
    top:{kind:"suit",c:[86,76,64],inner:[238,236,230]},bottom:{c:[76,68,58]},shoe:[36,28,24],build:{sh:76,hip:64,h:1.0}},
  eeC7:{name:"",role:"member",side:"",edge:GV_PAST,seed:111,skin:[150,104,76],hair:{style:"coily",c:[40,34,32]},glasses:[50,46,44],
    top:{kind:"blazer",c:[60,84,110],inner:[236,236,232]},bottom:{c:[50,54,66]},shoe:[30,26,26],build:{sh:68,hip:62,h:0.97}},
  eeBus:{name:"",role:"someone at a bus stop",side:"",edge:GV_PAST,seed:109,skin:[196,146,110],hair:{style:"long",c:[52,36,28]},
    top:{kind:"overshirt",c:[196,140,74],inner:[236,232,222]},bottom:{c:[60,74,100]},shoe:[228,226,220],build:{sh:66,hip:60,h:0.94}}
});
// today's people stand in the present: their wash is the paper's, not the past's umber
for(const id of ["eeTodayA","eeTodayB","eeC1","eeC2","eeC3","eeC4","eeC5","eeC6","eeC7","eeBus"])PEOPLE[id].edge=[250,248,242];

// their poses (angles from the shoulder: the upper arm, then the forearm, from straight down, outward positive)
Object.assign(POSE,{
  // both hands at the chest, untying a bundle; holding a letter to be sealed; a slip held out across a table to the left
  ee_untie:{L:[0.2,-2.3],R:[0.2,-2.3],feet:24,shift:0,tilt:0.04,turn:0,gaze:[0,1],look:1},
  ee_pass:{L:[0.12,-0.06],R:[-0.05,-1.62],feet:26,shift:-4,tilt:-0.03,turn:-0.3,gaze:[-0.9,0.4],look:1},
  ee_take:{L:[0.12,-0.06],R:[0.05,1.62],feet:26,shift:4,tilt:0.03,turn:0.3,gaze:[0.9,0.4],look:1},
  // a slip held up to the lamp, looked at (its forearm turns inward on the way up, so the arm rises past the chest, not across a neighbour)
  ee_toLamp:{L:[0.14,-0.08],R:[2.2,-3.38],feet:26,shift:4,tilt:-0.04,turn:0.2,gaze:[0.4,-1],look:0},
  // a bundle held low at the chest, clear of the face
  ee_bundle:{L:[0.15,-2.0],R:[0.15,-2.0],feet:24,shift:0,tilt:0.04,turn:0,gaze:[0,1],look:1},
  // a hand laid flat on a book in front; a pen struck through a word; a hand raised in a vote; a handshake
  ee_hand:{L:[0.12,-0.06],R:[0.5,0.3],hand:"open",feet:24,shift:2,tilt:0.04,turn:0.1,gaze:[0.3,1],look:1},
  // a hand laid on the open dictionary on the desk beside him, standing
  ee_onBook:{L:[0.12,-0.06],R:[1.05,0.9],hand:"open",feet:30,shift:6,tilt:0.06,turn:0.35,gaze:[0.6,0.7],look:1},
  ee_strike:{L:[0.12,-0.1],R:[0.42,-1.05],feet:30,shift:6,tilt:0.12,turn:0.3,gaze:[0.5,1],look:1},
  ee_vote:{L:[0.12,-0.08],R:[2.75,-3.28],hand:"open",feet:26,shift:3,tilt:-0.02,turn:0.1,gaze:[0.2,-0.4],look:0},
  // halfway up: the hand at the shoulder, the forearm upright, so a hand raised from the table rises past the chest, then up
  ee_voteUp:{L:[0.12,-0.08],R:[0.9,-3.0],hand:"open",feet:26,shift:3,tilt:-0.01,turn:0.1,gaze:[0.2,-0.1],look:0},
  ee_shake:{L:[0.12,-0.06],R:[0.25,1.35],hand:"open",feet:30,shift:6,tilt:-0.02,turn:0.4,gaze:[1,0],look:0},
  // talking with a hand open, at the waist; a pencil running down a card held in front
  ee_talk:{L:[0.12,-0.06],R:[0.55,1.55],hand:"open",feet:28,shift:4,tilt:-0.03,turn:0.25,gaze:[0.7,0],look:0},
  ee_read:{L:[0.3,-2.2],R:[0.3,-2.2],feet:24,shift:0,tilt:0.06,turn:0,gaze:[0,1],look:1},
  // seated, making a point: the hand open at the chin, out to the side, its elbow above the table
  ee_explain:{L:[0.12,-0.06],R:[0.8,2.4],hand:"open",feet:24,shift:2,tilt:-0.02,turn:0.3,gaze:[0.8,0.1],look:0},
  // looking up, at someone standing beside the desk; looking down at the desk in front
  ee_lookUp:{L:[0.14,-0.08],R:[0.1,0.05],feet:26,shift:4,tilt:-0.1,turn:0.5,gaze:[0.9,-0.7],look:0},
  ee_down:{L:[0.14,-0.08],R:[0.1,0.05],feet:26,shift:2,tilt:0.08,turn:0.1,gaze:[0.2,1],look:1},
  // seated, turned to the screen beside her, the hands down on the desk; standing, a card pinned high on the board beside her
  ee_toScreen:{L:[0.2,-0.5],R:[0.3,0.6],feet:24,shift:2,tilt:0.02,turn:0.45,gaze:[1,0.1],look:0},
  ee_pin:{L:[0.14,-0.08],R:[2.3,2.75],hand:"open",feet:30,shift:5,tilt:-0.05,turn:0.3,gaze:[0.7,-0.7],look:0}
});

/* ---------- what they hold, in the figure's units ---------- */
const EE_SLIP=[244,238,220],EE_RIBBON=[164,52,58];
// a paper slip with one word on it, as a writer of the time kept them: lines too small to read; drawn at (x, y), w wide
function ee_slipAt(cx,x,y,w,rot,o){o=o||{};const h=w*0.42;cx.save();cx.translate(x,y);cx.rotate(rot||0);cx.fillStyle="rgba(50,36,24,0.22)";cx.fillRect(-w/2+3,-h/2+4,w,h);
  cx.fillStyle=rgba(o.col||EE_SLIP,1);cx.fillRect(-w/2,-h/2,w,h);cx.strokeStyle=rgba(WC_PENCIL,0.45);cx.lineWidth=Math.max(1,w*0.012);cx.strokeRect(-w/2,-h/2,w,h);
  cx.strokeStyle=rgba([60,50,46],0.6);cx.lineWidth=Math.max(1.2,w*0.03);cx.lineCap="round";cx.beginPath();cx.moveTo(-w*0.32,-h*0.08);cx.lineTo(w*0.06,-h*0.08);cx.stroke();
  cx.lineWidth=Math.max(1,w*0.016);cx.beginPath();cx.moveTo(-w*0.32,h*0.2);cx.lineTo(w*0.3,h*0.2);cx.stroke();cx.restore();}
// a bundle of slips tied with a ribbon (o.open, 0 to 1: the ribbon off, the slips fanned)
function ee_bundle(cx,x,y,s,o){o=o||{};const op=clamp(o.open||0,0,1);cx.save();cx.translate(x,y);cx.scale(s,s);
  for(let i=0;i<7;i++){const a=(i-3)*0.05*op+((i*37)%7-3)*0.006,dx=(i-3)*14*op,dy=-i*4;ee_slipAt(cx,dx,dy,120,a);}
  if(op<0.98)withA(cx,1-op,()=>{cx.strokeStyle=rgba(EE_RIBBON,1);cx.lineWidth=6;cx.beginPath();cx.moveTo(-60,-12);cx.lineTo(60,-12);cx.stroke();cx.beginPath();cx.moveTo(4,-44);cx.lineTo(4,22);cx.stroke();
    cx.beginPath();cx.ellipse(-8,-16,12,6,0.5,0,TAU);cx.ellipse(16,-16,12,6,-0.5,0,TAU);cx.stroke();});cx.restore();}
function ee_heldBundle(o){return(cx,P_,hands)=>{const [l,r]=hands;ee_bundle(cx,(l[0]+r[0])/2,(l[1]+r[1])/2-6,1.1,o);fingers(cx,P_,[l,r]);};}
// one slip between finger and thumb, held up
function ee_heldSlip(cx,P_,hands){const h=hands[1];ee_slipAt(cx,h[0]+8,h[1]-36,130,-0.12);fingers(cx,P_,[h]);}
// a letter, folded, in both hands at the chest, held by its lower corners; o.seal (0 to 1) the wax seal pressed on
function ee_heldLetter(o){o=o||{};return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-28);cx.rotate(-0.04);
  cx.fillStyle="rgba(50,36,24,0.22)";cx.fillRect(-86,-50,180,112);cx.fillStyle=rgba([240,232,212],1);cx.fillRect(-90,-56,180,112);cx.strokeStyle=rgba(WC_PENCIL,0.5);cx.lineWidth=2;cx.strokeRect(-90,-56,180,112);
  cx.beginPath();cx.moveTo(-90,-56);cx.lineTo(0,6);cx.lineTo(90,-56);cx.stroke();
  const s=clamp(o.seal||0,0,1);if(s>0.01){const k=0.6+0.4*spring(s);cx.fillStyle=rgba([150,36,40],0.95);cx.beginPath();for(let i=0;i<12;i++){const a=i/12*TAU,rr_=18*k*(1+0.12*Math.sin(i*2.3));cx.lineTo(Math.cos(a)*rr_,6+Math.sin(a)*rr_);}cx.closePath();cx.fill();
    cx.strokeStyle=rgba([110,24,28],0.8);cx.lineWidth=2;cx.beginPath();cx.arc(0,6,9*k,0,TAU);cx.stroke();}cx.restore();fingers(cx,P_,[[mx-80,my+18],[mx+80,my+18]]);};}
// a letter held in the left hand at the chest, written with the pen in the right: p, how far the writing has gone (0 to 1)
function ee_heldWriting(p){return(cx,P_,hands)=>{const [l,r]=hands;cx.save();cx.translate(l[0]+70,l[1]-30);cx.rotate(-0.06);cx.fillStyle="rgba(50,36,24,0.22)";cx.fillRect(-86,-56,176,120);
  cx.fillStyle=rgba([244,238,220],1);cx.fillRect(-90,-62,176,120);cx.strokeStyle=rgba(WC_PENCIL,0.5);cx.lineWidth=2;cx.strokeRect(-90,-62,176,120);
  cx.strokeStyle=rgba([40,40,70],0.75);cx.lineWidth=3;cx.lineCap="round";const n=5,q=clamp(p,0,1)*n;for(let i=0;i<n;i++){const f=clamp(q-i,0,1);if(f<=0)break;cx.beginPath();cx.moveTo(-70,-38+i*20);cx.lineTo(-70+(i===n-1?80:136)*f,-38+i*20);cx.stroke();}
  cx.restore();cx.save();cx.translate(r[0]+2,r[1]+4);cx.rotate(0.5);cx.fillStyle=rgba([40,34,32],1);rr(cx,-5,-60,10,64,4);cx.fill();cx.restore();fingers(cx,P_,[l,r]);};}
// a pen in the right hand, its nib down (o.red: dipped in red ink)
function ee_heldPen(o){o=o||{};return(cx,P_,hands)=>{const h=hands[1];cx.save();cx.translate(h[0]+2,h[1]+4);cx.rotate(0.5);cx.fillStyle=rgba([40,34,32],1);rr(cx,-5,-60,10,64,4);cx.fill();
  cx.fillStyle=rgba(o.red?[176,40,40]:[150,140,120],1);cx.beginPath();cx.moveTo(-4,4);cx.lineTo(4,4);cx.lineTo(0,22);cx.closePath();cx.fill();cx.restore();fingers(cx,P_,[h]);};}
// a phone in the right hand, its screen lit (the series' "phone" pose holds it to read)
function ee_heldCard(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-40);cx.fillStyle="rgba(40,30,20,0.2)";cx.fillRect(-60,-40,128,90);
  cx.fillStyle="#fffdf6";cx.fillRect(-64,-46,128,90);cx.strokeStyle=rgba(WC_PENCIL,0.45);cx.lineWidth=2;cx.strokeRect(-64,-46,128,90);cx.fillStyle=rgba(WC_MUTED,0.5);cx.fillRect(-46,-20,70,6);cx.fillRect(-46,-4,86,5);cx.fillRect(-46,10,60,5);
  cx.restore();fingers(cx,P_,[l,r]);}
// the same card held lower, on the chest, so the face above it shows
function ee_heldCardLow(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-14);cx.rotate(-0.05);cx.fillStyle="rgba(40,30,20,0.2)";cx.fillRect(-54,-34,116,80);
  cx.fillStyle="#fffdf6";cx.fillRect(-58,-40,116,80);cx.strokeStyle=rgba(WC_PENCIL,0.45);cx.lineWidth=2;cx.strokeRect(-58,-40,116,80);cx.fillStyle=rgba(WC_MUTED,0.5);cx.fillRect(-42,-18,64,6);cx.fillRect(-42,-4,78,5);cx.fillRect(-42,9,54,5);
  cx.restore();fingers(cx,P_,[l,r]);}
