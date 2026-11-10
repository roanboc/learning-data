/* ===== A capability, not a project: the people of 1300 =====
   Farmers and the water board's people, around 1300, drawn as the series draws people of the past (its people.js: tunics and gowns of
   wool, hoods, coifs and veils, a warm umber wash behind each one), in wool undyed or dyed with weld, woad and madder; the board's
   members in longer gowns, with staffs. Their poses (a spade dug in and levered, a staff held and tapped on clay, a tally notched, a
   sack lifted, a coin given, a hand raised) and what they hold, drawn in the figure's own units at its hands. Every name starts with cp
   or cp_. */

Object.assign(PEOPLE,{
  // a farm's people: the man who cuts a ditch's end; on the farm in the flood, the man, his wife, their son and two small children
  cpDig:{name:"",role:"farmer",side:"",edge:GV_PAST,seed:61,skin:[214,168,132],hair:{style:"side",c:[96,70,48]},beard:[100,74,52],hat:"hood",hatC:[128,122,104],
    top:{kind:"tunic",c:[150,124,92],inner:[214,204,184],belt:[90,62,40]},bottom:{c:[104,96,80]},shoe:[70,52,38],build:{sh:76,hip:64,h:1.0}},
  cpHus:{name:"",role:"farmer",side:"",edge:GV_PAST,seed:63,skin:[222,178,142],hair:{style:"side",c:[70,52,38]},beard:[78,58,42],hat:"coif",hatC:[236,230,216],
    top:{kind:"tunic",c:[84,104,142],inner:[220,212,196],belt:[86,60,40]},bottom:{c:[96,88,74]},shoe:[66,48,36],build:{sh:76,hip:64,h:1.0}},
  cpWife:{name:"",role:"farmer",side:"",edge:GV_PAST,seed:62,skin:[230,190,160],hair:{style:"cropped",c:[120,80,50]},hat:"veil",hatC:[236,230,214],wimpleC:[246,242,232],
    top:{kind:"gown",c:[168,82,64],inner:[226,214,196],belt:[96,66,44],apron:[232,224,206]},bottom:{c:[90,80,70]},shoe:[70,52,40],build:{sh:66,hip:62,h:0.95}},
  cpSon:{name:"",role:"farmer's son",side:"",edge:GV_PAST,seed:64,skin:[226,184,150],hair:{style:"cropped",c:[150,110,70]},
    top:{kind:"tunic",c:[196,170,92],inner:[226,218,200],belt:[100,70,46]},bottom:{c:[110,100,84]},shoe:[70,52,38],build:{sh:66,hip:56,h:0.86}},
  cpKid:{name:"",role:"child",side:"",edge:GV_PAST,seed:65,skin:[232,192,162],hair:{style:"cropped",c:[176,130,80]},
    top:{kind:"tunic",c:[120,140,104],inner:[228,220,204]},bottom:{c:[120,110,94]},shoe:[80,60,44],build:{sh:60,hip:52,h:0.6}},
  cpKid2:{name:"",role:"child",side:"",edge:GV_PAST,seed:66,skin:[226,186,156],hair:{style:"cropped",c:[110,76,50]},hat:"coif",hatC:[240,236,226],
    top:{kind:"gown",c:[196,120,96],inner:[232,224,210]},bottom:{c:[110,100,90]},shoe:[80,60,44],build:{sh:58,hip:54,h:0.56}},
  // the water board: the dike reeve at its head, grey-bearded, in woad with a madder hood; two of its members; its clerk, with a tally
  cpReeve:{name:"",role:"dike reeve",side:"",edge:GV_PAST,seed:67,skin:[220,178,146],hair:{style:"side",c:[166,160,152]},beard:[176,170,162],hat:"hood",hatC:[150,52,46],
    top:{kind:"gown",c:[56,72,112],inner:[214,206,190],belt:[70,50,36],purse:true},bottom:{c:[60,60,70]},shoe:[54,40,30],build:{sh:76,hip:64,h:1.02}},
  cpBoardA:{name:"",role:"board member",side:"",edge:GV_PAST,seed:68,skin:[206,160,126],hair:{style:"side",c:[60,46,36]},beard:[66,50,40],hat:"hood",hatC:[96,110,80],
    top:{kind:"gown",c:[120,92,66],inner:[220,210,190],belt:[80,56,38]},bottom:{c:[70,64,60]},shoe:[60,44,32],build:{sh:76,hip:64,h:1.0}},
  cpBoardB:{name:"",role:"board member",side:"",edge:GV_PAST,seed:69,skin:[228,188,158],hair:{style:"cropped",c:[130,100,70]},hat:"coif",hatC:[238,232,218],
    top:{kind:"gown",c:[124,124,118],inner:[226,218,204],cape:[70,84,120]},bottom:{c:[70,70,78]},shoe:[54,40,32],build:{sh:74,hip:62,h:0.99}},
  cpClerk:{name:"",role:"the board's clerk",side:"",edge:GV_PAST,seed:70,skin:[232,194,164],hair:{style:"cropped",c:[86,62,44]},hat:"coif",hatC:[240,236,224],
    top:{kind:"tunic",c:[180,166,132],inner:[230,222,206],belt:[96,66,44],purse:true},bottom:{c:[96,92,84]},shoe:[66,48,36],build:{sh:70,hip:60,h:0.97}},
  // landowners: a man in madder, a widow who holds her own land, in woad; a man in woad over madder
  cpOwner:{name:"",role:"landowner",side:"",edge:GV_PAST,seed:71,skin:[210,164,128],hair:{style:"side",c:[80,58,40]},beard:[88,64,44],hat:"hood",hatC:[110,96,72],
    top:{kind:"tunic",c:[150,70,58],inner:[220,210,190],belt:[90,62,40]},bottom:{c:[96,86,72]},shoe:[66,48,34],build:{sh:76,hip:64,h:1.01}},
  cpOwnerB:{name:"",role:"landowner",side:"",edge:GV_PAST,seed:72,skin:[226,184,154],hair:{style:"cropped",c:[90,64,46]},hat:"veil",hatC:[214,206,180],wimpleC:[244,240,230],
    top:{kind:"gown",c:[70,104,140],inner:[228,222,210],belt:[90,62,44]},bottom:{c:[80,76,80]},shoe:[60,44,34],build:{sh:64,hip:60,h:0.94}},
  cpOwnerC:{name:"",role:"landowner",side:"",edge:GV_PAST,seed:73,skin:[200,152,118],hair:{style:"side",c:[50,40,32]},hat:"coif",hatC:[232,226,210],
    top:{kind:"tunic",c:[128,86,118],inner:[220,212,194],belt:[86,60,40]},bottom:{c:[90,84,72]},shoe:[62,46,34],build:{sh:74,hip:62,h:0.98}}
});

// their poses (angles from the shoulder, as the series' people take them: the upper arm, then the forearm, from straight down, outward
// positive): a spade pushed into the soil at the right side, and levered out with a clod; a staff held at the side, and lifted to tap
// the clay; a sack lifted over the head, and reached down to from above; a sack steadied on the left shoulder; a basket held at the
// waist; a hand out with a coin; both hands low on a plough's handles
Object.assign(POSE,{
  cp_digDown:{L:[-0.42,-1.68],R:[0.53,0.04],feet:34,shift:5,tilt:0.08,turn:0.25,gaze:[0.7,1],look:1},
  cp_digUp:{L:[-0.2,-1.66],R:[-0.18,0.85],feet:34,shift:-2,tilt:-0.02,turn:0.25,gaze:[0.7,0.8],look:1},
  cp_staff:{L:[0.12,-0.06],R:[0.3,0.05],feet:26,shift:3,tilt:0.0,turn:0.1,gaze:[0.3,0.2],look:0},
  cp_tapUp:{L:[0.12,-0.06],R:[-0.5,1.2],feet:30,shift:4,tilt:0.05,turn:0.3,gaze:[0.8,1],look:1},
  cp_tapDown:{L:[0.12,-0.06],R:[-0.33,0.91],feet:30,shift:5,tilt:0.08,turn:0.3,gaze:[0.8,1],look:1},
  cp_sackUp:{L:[2.4,-2.16],R:[2.4,-2.16],feet:28,shift:0,tilt:-0.04,turn:0,gaze:[0,-1],look:0},
  cp_reachDown:{L:[0.14,-0.26],R:[0.14,-0.26],feet:24,shift:0,tilt:0.1,turn:0,gaze:[0,1],look:1},
  cp_shoulder:{L:[-1.0,2.26],R:[0.18,0.04],feet:26,shift:-4,tilt:0.06,turn:-0.1,gaze:[-0.2,0.3],look:0},
  cp_basket:{L:[0.59,-0.83],R:[0.59,-0.83],feet:24,shift:0,tilt:0.02,turn:0,gaze:[0.1,0.6],look:1},
  cp_give:{L:[0.12,-0.06],R:[-0.24,1.74],hand:"open",feet:30,shift:6,tilt:-0.03,turn:0.4,gaze:[0.9,0.2],look:0},
  cp_plough:{L:[0.59,-0.83],R:[0.59,-0.83],feet:30,shift:0,tilt:0.12,turn:0,gaze:[0,0.2],look:0},
  cp_spade:{L:[0.12,-0.06],R:[0.3,0.05],feet:28,shift:3,tilt:0,turn:0.1,gaze:[0.2,0],look:0}
});
POSE.cp_tally=Object.assign({},POSE.write,{gaze:[0.1,1],look:1});
// riding a bicycle, seen from in front: both hands out on the handlebar, at the waist
POSE.cp_ride={L:[0.32,0.2],R:[0.32,0.2],feet:18,shift:0,tilt:0,turn:0,gaze:[0,0.1],look:0};

// a person standing on the land of a scene drawn in depth (cp_pj's camera): at (X, Y, Z) metres, their size from how far they are
// (1.7 m tall at build 1); returns where their feet are and the scale they're drawn at
function cp_who(ctx,C,id,X,Y,Z,o){const z=cp_z(C,X,Z);if(z<0.6)return null;const p=cp_pj(C,X,Y||0,Z),s=C.F/z*1.7/560;
  if(p[0]<-400||p[0]>W+400)return null;person(ctx,id,p[0],p[1],s,o||{});return{x:p[0],y:p[1],s};}
// a dig: the stroke's phase, from pushed in (0) to levered out (1) and back, once every per seconds
const cp_dig=(t,per)=>0.5-0.5*Math.cos(TAU*t/(per||1.7));

/* ---------- what they hold, in the figure's units ---------- */
const CP_WOOD=[146,112,76],CP_WOODDK=[96,72,50],CP_LINEN=[224,212,184],CP_SACK=[196,172,128];
// a wooden spade through both hands, the top hand on its grip side: the grip above, the shaft, and below the other hand its blade
// of wood shod with iron, cut off where it's in the soil (below the feet's line, o.ground); o.clod, earth on the blade (0 to 1)
function cp_heldSpade(o){o=o||{};return(cx,P_,hands)=>{const [a,b]=hands,L=Math.hypot(b[0]-a[0],b[1]-a[1])||1,d=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[-d[1],d[0]],
    g=[a[0]-d[0]*44,a[1]-d[1]*44],s1=[b[0]+d[0]*120,b[1]+d[1]*120],tip=[s1[0]+d[0]*112,s1[1]+d[1]*112];
  cx.save();if(o.ground!=null){cx.beginPath();cx.rect(-900,-1400,1800,1400+o.ground);cx.clip();}
  cx.lineCap="round";cx.strokeStyle=rgba(CP_WOODDK,1);cx.lineWidth=15;cx.beginPath();cx.moveTo(g[0],g[1]);cx.lineTo(s1[0],s1[1]);cx.stroke();
  cx.strokeStyle=rgba(CP_WOOD,1);cx.lineWidth=10;cx.beginPath();cx.moveTo(g[0],g[1]);cx.lineTo(s1[0],s1[1]);cx.stroke();
  // the grip, a short crosspiece
  cx.strokeStyle=rgba(CP_WOODDK,1);cx.lineWidth=13;cx.beginPath();cx.moveTo(g[0]+n[0]*28,g[1]+n[1]*28);cx.lineTo(g[0]-n[0]*28,g[1]-n[1]*28);cx.stroke();
  // the blade, a little wider at its iron edge
  const bl=[[s1[0]+n[0]*24,s1[1]+n[1]*24],[tip[0]+n[0]*30,tip[1]+n[1]*30],[tip[0]-n[0]*30,tip[1]-n[1]*30],[s1[0]-n[0]*24,s1[1]-n[1]*24]];
  cx.fillStyle=rgba(CP_WOOD,1);cx.beginPath();bl.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.closePath();cx.fill();
  cx.strokeStyle=rgba(CP_WOODDK,0.8);cx.lineWidth=2.4;cx.stroke();
  const e0=[tip[0]-d[0]*22,tip[1]-d[1]*22];cx.fillStyle=rgba([96,98,104],1);cx.beginPath();cx.moveTo(e0[0]+n[0]*29,e0[1]+n[1]*29);cx.lineTo(tip[0]+n[0]*30,tip[1]+n[1]*30);
  cx.lineTo(tip[0]-n[0]*30,tip[1]-n[1]*30);cx.lineTo(e0[0]-n[0]*29,e0[1]-n[1]*29);cx.closePath();cx.fill();
  if((o.clod||0)>0.01){const c=[lerp(s1[0],tip[0],0.55)+n[0]*-6,lerp(s1[1],tip[1],0.55)+n[1]*-6],r=34*clamp(o.clod,0,1);cx.fillStyle=rgba(CP.peat,1);
    cx.beginPath();for(let i=0;i<10;i++){const an=i/10*TAU,rr=r*(0.8+0.3*hash(i,7));cx.lineTo(c[0]+Math.cos(an)*rr*1.3-n[0]*r*0.5,c[1]+Math.sin(an)*rr*0.8-n[1]*r*0.5);}cx.closePath();cx.fill();
    cx.fillStyle=rgba(CP.turf,0.9);cx.beginPath();cx.ellipse(c[0]-n[0]*r*0.9,c[1]-n[1]*r*0.9-6,r*1.1,r*0.35,Math.atan2(d[1],d[0])+Math.PI/2,0,TAU);cx.fill();}
  cx.restore();fingers(cx,P_,[a,b]);};}
// a staff in the right hand, upright to the ground (or to o.tip, [x, y] in the figure's units, where it touches, or o.rel, where its tip
// is from the hand, so it moves with the hand): 600 long, a knob at the top
function cp_heldStaff(o){o=o||{};return(cx,P_,hands)=>{const h=hands[1],tip=o.rel?[h[0]+o.rel[0],h[1]+o.rel[1]]:o.tip||[h[0]+4,0],L=Math.hypot(h[0]-tip[0],h[1]-tip[1])||1,d=[(h[0]-tip[0])/L,(h[1]-tip[1])/L],
    top=[tip[0]+d[0]*600,tip[1]+d[1]*600];
  cx.save();cx.lineCap="round";cx.strokeStyle=rgba(CP_WOODDK,1);cx.lineWidth=13;cx.beginPath();cx.moveTo(tip[0],tip[1]);cx.lineTo(top[0],top[1]);cx.stroke();
  cx.strokeStyle=rgba(wc_lit(CP_WOOD,0.1),1);cx.lineWidth=7;cx.beginPath();cx.moveTo(tip[0],tip[1]);cx.lineTo(top[0],top[1]);cx.stroke();
  cx.fillStyle=rgba(CP_WOODDK,1);cx.beginPath();cx.arc(top[0],top[1],12,0,TAU);cx.fill();cx.restore();fingers(cx,P_,[h]);};}
// the clerk's tally: a flat stick in the left hand, a notch cut for each fine (o.n, and o.cut 0 to 1 for the one being cut), a knife in
// the right
function cp_heldTally(o){o=o||{};return(cx,P_,hands)=>{const [l,r]=hands;cx.save();cx.translate(l[0]+10,l[1]-8);cx.rotate(-0.12);
  cx.fillStyle=rgba(wc_lit(CP_WOOD,0.25),1);rr(cx,-4,-10,150,20,5);cx.fill();cx.strokeStyle=rgba(CP_WOODDK,0.9);cx.lineWidth=2;cx.stroke();
  const n=o.n||3;cx.strokeStyle=rgba(CP_WOODDK,1);cx.lineWidth=3.4;for(let i=0;i<n;i++){cx.beginPath();cx.moveTo(20+i*16,-10);cx.lineTo(24+i*16,4);cx.stroke();}
  if((o.cut||0)>0.01){cx.globalAlpha=clamp(o.cut,0,1);cx.beginPath();cx.moveTo(20+n*16,-10);cx.lineTo(24+n*16,4);cx.stroke();cx.globalAlpha=1;}cx.restore();
  cx.save();cx.translate(r[0],r[1]);cx.rotate(-0.9+0.25*Math.sin((o.saw||0)*TAU));cx.fillStyle=rgba(CP_WOODDK,1);rr(cx,-6,-4,14,40,4);cx.fill();
  cx.fillStyle=rgba([196,200,206],1);cx.beginPath();cx.moveTo(-5,-4);cx.lineTo(7,-4);cx.lineTo(4,-44);cx.closePath();cx.fill();cx.restore();fingers(cx,P_,[l,r]);};}
// a sack of grain, tied at the neck: held up over the head in both hands (cp_heldSackUp), or on the left shoulder (cp_heldShoulder)
function cp_sack(cx,x,y,w,h,rot){cx.save();cx.translate(x,y);cx.rotate(rot||0);cx.beginPath();cx.moveTo(-w*0.18,-h/2);cx.quadraticCurveTo(-w*0.62,-h*0.3,-w/2,h*0.18);
  cx.quadraticCurveTo(-w*0.46,h/2,0,h/2);cx.quadraticCurveTo(w*0.46,h/2,w/2,h*0.18);cx.quadraticCurveTo(w*0.62,-h*0.3,w*0.18,-h/2);cx.closePath();litFill(cx,CP_SACK,-w/2,-h/2,w/2,h/2);seam(cx,CP_SACK,0.45);
  cx.strokeStyle=rgba(wc_dim(CP_SACK,0.4),0.5);cx.lineWidth=2;for(const k of [-0.2,0.15]){cx.beginPath();cx.moveTo(k*w,-h*0.3);cx.quadraticCurveTo(k*w*1.4,0,k*w,h*0.4);cx.stroke();}
  cx.fillStyle=rgba(wc_dim(CP_SACK,0.3),1);cx.beginPath();cx.ellipse(0,-h/2+2,w*0.2,8,0,0,TAU);cx.fill();cx.restore();}
function cp_heldSackUp(cx,P_,hands){const [l,r]=hands;cp_sack(cx,(l[0]+r[0])/2,(l[1]+r[1])/2-30,170,120,0.04);fingers(cx,P_,[l,r]);}
function cp_heldShoulder(cx,P_,hands){const l=hands[0];cp_sack(cx,l[0]-42,l[1]-58,140,96,-0.42);fingers(cx,P_,[l]);}
// a shallow basket of round cheeses, held at the waist
function cp_heldBasket(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-10);
  for(const [dx,dy,rr_] of [[-46,-26,30],[0,-34,32],[44,-24,30],[-22,-46,26],[24,-48,26]]){cx.beginPath();cx.ellipse(dx,dy,rr_,rr_*0.62,0,0,TAU);litFill(cx,[226,186,96],dx-rr_,dy-rr_,dx+rr_,dy+rr_);seam(cx,[226,186,96],0.4);}
  cx.beginPath();cx.moveTo(-96,-20);cx.lineTo(96,-20);cx.quadraticCurveTo(90,30,60,36);cx.lineTo(-60,36);cx.quadraticCurveTo(-90,30,-96,-20);cx.closePath();litFill(cx,[176,140,90],-96,-20,96,36);seam(cx,[176,140,90],0.5);
  cx.strokeStyle=rgba([120,92,58],0.6);cx.lineWidth=2;for(let i=0;i<4;i++){cx.beginPath();cx.moveTo(-92,-12+i*12);cx.quadraticCurveTo(0,-6+i*12,92,-12+i*12);cx.stroke();}cx.restore();fingers(cx,P_,[l,r]);}
// a coin between finger and thumb, catching the light
function cp_heldCoin(cx,P_,hands){const r=hands[1];fingers(cx,P_,[r]);cx.save();cx.translate(r[0]+12,r[1]-14);cx.fillStyle=rgba([226,196,112],1);cx.beginPath();cx.ellipse(0,0,13,11,0.3,0,TAU);cx.fill();
  cx.strokeStyle=rgba([150,118,50],0.9);cx.lineWidth=2;cx.stroke();cx.fillStyle="rgba(255,250,220,0.8)";cx.beginPath();cx.arc(-4,-3,3,0,TAU);cx.fill();cx.restore();}
// two things at once
const cp_both=(f,g)=>(cx,P_,hands)=>{f(cx,P_,hands);g(cx,P_,hands);};
