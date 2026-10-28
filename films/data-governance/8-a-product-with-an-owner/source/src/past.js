/* ===== A product with an owner: the past =====
   Istanbul, painted the series' way (master data's wash.js and people.js, the series' rooms.js and people.js): the bedesten in 1461,
   a stone and brick hall under rows of small lead domes, its iron-clad doors open, and inside, silk and velvet on its shelves, a
   goldsmith's tray, and rows of locked cupboards; the market seen from above, its wooden shops spreading along the open streets from
   the hall's four gates, then filling them by the 1520s; a street of the 1520s at a buyer's height, and the buyer's three questions;
   the cap makers' street in the 1600s, the guild's officer, the market inspector and his men at the cloth seller's stall, and a woman
   who comes back with a friend. Its people wear their own time (the script's rigour sheet has the sources): men in long robes over a
   longer inner robe, a sash at the waist and a turban, the officials' robes longer and their turbans larger; craftsmen in shorter
   robes and an apron; a woman out in the street in a long, dark cloak buttoned to the throat, with veils over her hair and the lower
   part of her face. Nothing borrows a style from the period's own painting, and no script or ornament is drawn: shop signs are the
   film's tags, in English. The places are painted once and kept (the series' finish.js); what moves is drawn every frame. Every name
   starts with po_ or PO. */

/* ---------- colours ---------- */
// stone and brick, the domes' lead, the doors' iron; the shops' wood, their awnings' canvas and their roofs' tiles; the street's earth
// and cobbles; plaster houses, cypresses, the water of the Golden Horn; the goods: silk and velvet, felt, gold
const PO={stone:[228,214,186],stoneDk:[198,180,148],brick:[178,100,74],lead:[146,158,172],leadLt:[200,208,216],iron:[66,68,76],
  wood:[166,118,80],woodDk:[118,82,56],woodLt:[200,158,112],canvas:[236,224,194],canvasDk:[214,196,158],tile:[188,106,78],tileDk:[150,80,60],
  earth:[214,192,152],cobble:[200,188,164],plaster:[240,228,204],cypress:[60,100,76],water:[146,182,200],
  silk:[[176,40,56],[52,72,140],[42,116,86],[214,168,62],[112,64,124],[196,96,60]],felt:[[110,78,56],[62,54,52],[150,62,52],[128,102,74],[214,200,172]],
  gold:[226,180,72],silver:[206,210,218]};
// people of the past get the series' warm umber wash behind them (GV_PAST)

/* ---------- helpers ---------- */
// made once per chapter, the first time it draws: its cues are known by then
const po_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a point in depth, seen by a camera at height C.ch (metres), F the focal length in pixels and hz the horizon's height on the frame:
// X across, Y up, Z away from the camera
function po_pj(C,X,Y,Z){const z=Math.max(0.3,Z);return[960+C.F*X/z,C.hz+C.F*(C.ch-Y)/z];}
const po_ppm=(C,Z)=>C.F/Math.max(0.3,Z);
// a person standing at (X, Z) on the ground: where their feet are on the frame, and the scale person() takes for their height h
function po_at(C,X,Z,h){const [x,y]=po_pj(C,X,0,Z);return{x,y,s:(h||1.68)*po_ppm(C,Z)/560};}
// a wash with a pencil line, for the things of the past (kind "build" lines it)
const po_q=(ctx,pts,col,o)=>wc_wash(ctx,pts,col,Object.assign({kind:"build",depth:1},o||{}));
// the year and the place in the top corner: the latest one passed, dissolving from the one before
function po_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}
// a tag that springs in at t0 and goes at t1 (or stays)
function po_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}

/* ---------- people of Istanbul ---------- */
// men: a long robe (kaftan) over a longer inner robe, open below the sash, and a turban wound round a cap; an official's robe is longer
// and fuller and his turban larger; a craftsman's robe is shorter, over trousers, with an apron. A woman out in the street: a long, dark
// cloak buttoned to the throat, and veils over her hair and the lower part of her face. hatC is the turban's cloth, capC its cap's crown,
// tb its size
Object.assign(PEOPLE,{
  // 1461: the masons taking the last scaffold poles away, and the merchants bringing in the first goods
  po_mason:{name:"",role:"mason",side:"",edge:GV_PAST,seed:61,skin:[206,160,120],hair:{style:"none",c:[40,32,28]},beard:[52,40,32],hat:"po_turban",hatC:[226,218,200],tb:0.86,
    top:{kind:"po_robe",c:[150,126,96],inner:[222,210,186],sash:[110,84,60],hem:-150,apron:[200,186,160]},bottom:{c:[112,96,80]},shoe:[96,70,48],build:{sh:76,hip:64,h:1.0}},
  po_mason2:{name:"",role:"mason",side:"",edge:GV_PAST,seed:62,skin:[190,142,104],hair:{style:"none",c:[30,26,24]},beard:[34,28,26],hat:"po_turban",hatC:[214,206,188],tb:0.84,
    top:{kind:"po_robe",c:[126,110,90],inner:[214,204,184],sash:[150,70,56],hem:-150,apron:[206,194,170]},bottom:{c:[96,86,74]},shoe:[90,66,46],build:{sh:74,hip:62,h:0.98}},
  po_silk:{name:"",role:"silk merchant",side:"",edge:GV_PAST,seed:63,skin:[222,180,144],hair:{style:"none",c:[44,34,30]},beard:[58,44,36],hat:"po_turban",hatC:[248,246,238],capC:[176,52,58],tb:1.0,
    top:{kind:"po_robe",c:[52,84,120],inner:[236,226,200],sash:[196,150,70]},bottom:{c:[70,60,60]},shoe:[196,150,60],build:{sh:74,hip:62,h:1.0}},
  po_chest:{name:"",role:"merchant",side:"",edge:GV_PAST,seed:64,skin:[200,156,118],hair:{style:"none",c:[60,46,38]},beard:[110,96,86],hat:"po_turban",hatC:[244,240,228],tb:1.0,
    top:{kind:"po_robe",c:[120,58,56],inner:[232,220,196],sash:[64,90,80]},bottom:{c:[60,56,60]},shoe:[164,60,48],build:{sh:76,hip:64,h:1.02}},
  // the 1520s: the buyer, the cap seller, the cloth seller
  po_buyer:{name:"",role:"buyer",side:"",edge:GV_PAST,seed:65,skin:[214,170,132],hair:{style:"none",c:[40,32,28]},beard:[46,36,30],hat:"po_turban",hatC:[246,243,234],capC:[150,60,52],tb:0.96,
    top:{kind:"po_robe",c:[70,106,104],inner:[238,230,208],sash:[176,96,62]},bottom:{c:[76,70,72]},shoe:[200,156,64],build:{sh:74,hip:62,h:1.0}},
  po_capman:{name:"",role:"cap seller",side:"",edge:GV_PAST,seed:66,skin:[196,150,112],hair:{style:"none",c:[50,40,34]},beard:[70,56,46],hat:"po_turban",hatC:[232,224,206],tb:0.9,
    top:{kind:"po_robe",c:[140,96,70],inner:[224,212,188],sash:[90,70,56],hem:-150,apron:[214,204,182]},bottom:{c:[96,84,72]},shoe:[96,70,48],build:{sh:74,hip:62,h:0.98}},
  po_cloth1:{name:"",role:"cloth seller",side:"",edge:GV_PAST,seed:67,skin:[218,176,140],hair:{style:"none",c:[30,26,24]},beard:[36,30,28],hat:"po_turban",hatC:[240,236,224],tb:0.95,
    top:{kind:"po_robe",c:[110,74,104],inner:[234,224,204],sash:[70,100,90]},bottom:{c:[64,60,66]},shoe:[150,70,52],build:{sh:76,hip:64,h:1.0}},
  // the 1600s: the cap makers' master and his apprentice, the guild's officer, the cloth seller, the market inspector and his two men,
  // and the woman and her friend
  po_master:{name:"",role:"master cap maker",side:"",edge:GV_PAST,seed:68,skin:[208,164,126],hair:{style:"none",c:[60,50,44]},beard:[150,138,126],hat:"po_turban",hatC:[238,232,216],tb:0.94,
    top:{kind:"po_robe",c:[96,104,72],inner:[228,218,196],sash:[160,84,58],hem:-150,apron:[204,190,166]},bottom:{c:[84,76,66]},shoe:[104,74,50],build:{sh:76,hip:64,h:1.0}},
  po_appr:{name:"",role:"apprentice",side:"",edge:GV_PAST,seed:69,skin:[226,186,150],hair:{style:"none",c:[50,38,30]},hat:"po_turban",hatC:[226,218,198],tb:0.8,
    top:{kind:"po_robe",c:[176,140,96],inner:[232,222,200],sash:[120,90,64],hem:-150,apron:[214,200,176]},bottom:{c:[104,92,78]},shoe:[110,80,54],build:{sh:66,hip:56,h:0.86}},
  po_officer:{name:"",role:"the guild's officer",side:"",edge:GV_PAST,seed:70,skin:[214,172,136],hair:{style:"none",c:[50,42,38]},beard:[96,86,80],hat:"po_turban",hatC:[250,248,242],capC:[214,204,180],tb:1.22,
    top:{kind:"po_robe",c:[64,82,62],inner:[236,228,206],sash:[200,170,110],hem:-24,fl:56,loops:true},bottom:{c:[60,56,56]},shoe:[196,150,62],build:{sh:78,hip:66,h:1.03}},
  po_cloth2:{name:"",role:"cloth seller",side:"",edge:GV_PAST,seed:71,skin:[196,150,110],hair:{style:"none",c:[36,30,28]},beard:[44,36,32],hat:"po_turban",hatC:[238,234,222],tb:0.95,
    top:{kind:"po_robe",c:[150,80,62],inner:[230,220,198],sash:[80,96,120]},bottom:{c:[70,62,62]},shoe:[150,72,50],build:{sh:76,hip:64,h:1.0}},
  po_inspector:{name:"",role:"the market inspector",side:"",edge:GV_PAST,seed:72,skin:[220,178,142],hair:{style:"none",c:[40,34,32]},beard:[60,50,44],hat:"po_turban",hatC:[252,250,246],capC:[150,52,56],tb:1.3,
    top:{kind:"po_robe",c:[56,64,96],inner:[238,232,214],sash:[184,150,90],hem:-20,fl:60,loops:true},bottom:{c:[56,54,60]},shoe:[196,150,62],build:{sh:80,hip:68,h:1.04}},
  po_scales:{name:"",role:"the inspector's man",side:"",edge:GV_PAST,seed:73,skin:[198,152,114],hair:{style:"none",c:[34,28,26]},beard:[40,32,28],hat:"po_turban",hatC:[232,226,210],tb:0.9,
    top:{kind:"po_robe",c:[118,104,82],inner:[222,212,190],sash:[90,74,60],hem:-130},bottom:{c:[90,80,70]},shoe:[96,70,48],build:{sh:74,hip:62,h:0.99}},
  po_rodman:{name:"",role:"the inspector's man",side:"",edge:GV_PAST,seed:74,skin:[212,168,128],hair:{style:"none",c:[44,36,30]},beard:[70,56,44],hat:"po_turban",hatC:[228,222,206],tb:0.9,
    top:{kind:"po_robe",c:[96,96,104],inner:[220,212,194],sash:[130,90,64],hem:-130},bottom:{c:[84,78,74]},shoe:[96,70,48],build:{sh:74,hip:62,h:1.0}},
  po_woman:{name:"",role:"buyer",side:"",edge:GV_PAST,seed:75,skin:[226,186,152],hair:{style:"none",c:[50,38,32]},hat:"po_veil",hatC:[250,248,242],
    top:{kind:"po_ferace",c:[60,70,98]},bottom:{c:[60,60,70]},shoe:[214,170,72],build:{sh:64,hip:62,h:0.95}},
  po_friend:{name:"",role:"buyer",side:"",edge:GV_PAST,seed:76,skin:[212,170,134],hair:{style:"none",c:[40,30,26]},hat:"po_veil",hatC:[248,246,240],
    top:{kind:"po_ferace",c:[110,72,64]},bottom:{c:[70,60,60]},shoe:[200,96,72],build:{sh:64,hip:62,h:0.93}}
});
// the crowd of the 1520s and the 1600s: men and women of the market, in the same dress, drawn small and still in the places
const PO_CROWD=[["po_mason",0],["po_silk",0],["po_chest",0],["po_cloth1",0],["po_capman",0],["po_scales",0],["po_rodman",0],["po_woman",1],["po_friend",1],["po_appr",0]];

// ---- the clothes of Istanbul: the series' engine and its wraps stay as they are; these wrap the torso and head once more, for their kinds only ----
const _poTorso=torso,_poHead=head;
torso=function(ctx,P,br,sh){const k=P.top.kind;if(k==="po_robe")return po_robe(ctx,P,br,sh);if(k==="po_ferace")return po_ferace(ctx,P,br,sh);return _poTorso(ctx,P,br,sh);};
// the outline of a long robe from the shoulders to its hem, flaring by fl
function po_robePath(ctx,sw,hw,y0,sh,hem,fl){ctx.beginPath();ctx.moveTo(-16,y0);ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-2,y0+28,-sw-2,y0+50);
  ctx.bezierCurveTo(-sw-2,y0+84,-hw-4,-352,-hw+2,-322);ctx.quadraticCurveTo(-hw-fl*0.5+sh*0.4,-230,-hw-fl+sh*0.5,hem);
  ctx.quadraticCurveTo(sh*0.5,hem+12,hw+fl+sh*0.5,hem);ctx.quadraticCurveTo(hw+fl*0.5+sh*0.4,-230,hw-2,-322);
  ctx.bezierCurveTo(hw+4,-352,sw+2,y0+84,sw+2,y0+50);ctx.quadraticCurveTo(sw+2,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,16,y0);ctx.closePath();}
// a kaftan: the inner robe shows at the neck in a V and below the sash, where the kaftan's fronts part; folds fall from the sash; a
// craftsman's apron hangs from it to the knee; an official's kaftan has cords across its chest (loops)
function po_robe(ctx,P,br,sh){const T_=P.top,c=T_.c,inn=T_.inner||lighten(c,0.45),sw=P.build.sh,hw=P.build.hip,y0=-448+br,hem=T_.hem||-40,fl=T_.fl||(hem>-100?44:26),sash=T_.sash||darken(c,0.25);
  const path=()=>po_robePath(ctx,sw,hw,y0,sh,hem,fl);
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);
  ctx.save();path();ctx.clip();ctx.lineCap="round";ctx.lineJoin="round";
  // the inner robe: at the neck, and in the opening below the sash, widening to the hem
  ctx.fillStyle=rgba(inn,1);ctx.beginPath();ctx.moveTo(-17,y0-2);ctx.lineTo(17,y0-2);ctx.lineTo(sh*0.3+3,y0+46);ctx.lineTo(sh*0.3-3,y0+46);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(sh*0.4-7,-322);ctx.lineTo(sh*0.4+7,-322);ctx.quadraticCurveTo(sh*0.45+14,-200,sh*0.5+26,hem+8);ctx.lineTo(sh*0.5-26,hem+8);ctx.quadraticCurveTo(sh*0.45-14,-200,sh*0.4-7,-322);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(darken(inn,0.3),0.35);ctx.lineWidth=2;for(const q of [-0.5,0.5]){ctx.beginPath();ctx.moveTo(sh*0.4+q*8,-316);ctx.lineTo(sh*0.5+q*30,hem+6);ctx.stroke();}
  // folds of the kaftan, falling from the sash; light along the folds
  ctx.strokeStyle=rgba(darken(c,0.4),0.3);ctx.lineWidth=2.4;for(const q of [-0.66,-0.3,0.34,0.7]){ctx.beginPath();ctx.moveTo(q*hw*0.8+sh*0.3,-310);ctx.quadraticCurveTo(q*hw*1.05+sh*0.4,-220,q*(hw+fl)*0.95+sh*0.5,hem+6);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(c,0.22),0.2);ctx.lineWidth=5;for(const q of [-0.48,0.52]){ctx.beginPath();ctx.moveTo(q*hw*0.8+sh*0.3,-304);ctx.quadraticCurveTo(q*hw+sh*0.4,-220,q*(hw+fl)*0.9+sh*0.5,hem+6);ctx.stroke();}
  // the kaftan's front edges: down from the neck to the sash, and parting below it
  ctx.strokeStyle=rgba(darken(c,0.3),0.85);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-18,y0);ctx.lineTo(sh*0.3-3,y0+48);ctx.lineTo(sh*0.4-1,-336);ctx.stroke();
  ctx.beginPath();ctx.moveTo(18,y0);ctx.lineTo(sh*0.3+3,y0+48);ctx.stroke();
  for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(sh*0.4+s*7,-320);ctx.quadraticCurveTo(sh*0.45+s*14,-200,sh*0.5+s*26,hem+8);ctx.stroke();}
  // an official's cords across the chest
  if(T_.loops){ctx.strokeStyle=rgba(lighten(c,0.38),0.8);ctx.lineWidth=3.2;for(let i=0;i<4;i++){const yy=y0+60+i*22;ctx.beginPath();ctx.moveTo(sh*0.3-22,yy);ctx.lineTo(sh*0.3+22,yy+1);ctx.stroke();
      ctx.fillStyle=rgba(lighten(c,0.45),0.95);ell(ctx,sh*0.3+24,yy+1,3.4,3.4);ctx.fill();}}
  // a craftsman's apron, from the sash to the knee
  if(T_.apron){const ap=T_.apron;ctx.beginPath();ctx.moveTo(-hw-2,-322);ctx.lineTo(hw+2+sh*0.4,-322);ctx.quadraticCurveTo(hw+12+sh*0.5,-240,hw+14+sh*0.5,-170);ctx.quadraticCurveTo(sh*0.5,-162,-hw-14+sh*0.5,-170);
    ctx.quadraticCurveTo(-hw-12,-240,-hw-2,-322);ctx.closePath();litFill(ctx,ap,-hw,-322,hw,-166);seam(ctx,ap,0.3);
    ctx.strokeStyle=rgba(darken(ap,0.22),0.3);ctx.lineWidth=2;for(const q of [-0.5,0.08,0.6]){ctx.beginPath();ctx.moveTo(q*hw,-312);ctx.quadraticCurveTo(q*hw*1.1,-240,q*(hw+12),-174);ctx.stroke();}}
  // the sash, wound twice round the waist
  ctx.fillStyle=rgba(sash,1);ctx.beginPath();ctx.moveTo(-hw-8,-346);ctx.quadraticCurveTo(sh*0.4,-338,hw+8,-346);ctx.lineTo(hw+8,-314);ctx.quadraticCurveTo(sh*0.4,-306,-hw-8,-314);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(darken(sash,0.3),0.55);ctx.lineWidth=2;for(const yy of [-334,-324]){ctx.beginPath();ctx.moveTo(-hw-6,yy);ctx.quadraticCurveTo(sh*0.4,yy+8,hw+6,yy);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(sash,0.3),0.4);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-hw*0.6,-340);ctx.quadraticCurveTo(sh*0.4,-333,hw*0.5,-340);ctx.stroke();
  ctx.restore();}
// a ferace: a long, dark cloak to the ground, full, buttoned from the throat; a white collar of the inner dress at the neck
function po_ferace(ctx,P,br,sh){const T_=P.top,c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br,hem=-12,fl=46;
  const path=()=>po_robePath(ctx,sw,hw,y0,sh,hem,fl);path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);
  ctx.save();path();ctx.clip();ctx.lineCap="round";
  ctx.strokeStyle=rgba(darken(c,0.4),0.32);ctx.lineWidth=2.4;for(const q of [-0.7,-0.36,0.3,0.68]){ctx.beginPath();ctx.moveTo(q*sw*0.8+sh*0.2,y0+70);ctx.quadraticCurveTo(q*hw*1.1+sh*0.4,-220,q*(hw+fl)*0.96+sh*0.5,hem+6);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(c,0.24),0.22);ctx.lineWidth=6;for(const q of [-0.52,0.5]){ctx.beginPath();ctx.moveTo(q*sw*0.7+sh*0.2,y0+80);ctx.quadraticCurveTo(q*hw+sh*0.4,-220,q*(hw+fl)*0.9+sh*0.5,hem+6);ctx.stroke();}
  // the front closing, and its buttons from the throat down
  ctx.strokeStyle=rgba(darken(c,0.35),0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sh*0.2,y0+4);ctx.quadraticCurveTo(sh*0.4,-240,sh*0.5,hem+8);ctx.stroke();
  ctx.fillStyle=rgba(lighten(c,0.35),0.95);for(let i=0;i<7;i++){const yy=y0+18+i*24;ell(ctx,sh*(0.2+0.2*(yy-y0)/(hem-y0))+5,yy,3.4,3.4);ctx.fill();}
  ctx.restore();}

// headwear: a turban, white cloth wound round a cap, its crown showing at the top for some; and a woman's veils, one over her hair and
// shoulders, one over the lower part of her face, so only her eyes and brows show
head=function(ctx,P,E,po,t){const h=P.hat;if(h==="po_veil")po_veilBack(ctx,P);_poHead(ctx,P,E,po,t);if(h==="po_turban")po_turban(ctx,P);if(h==="po_veil")po_veilFront(ctx,P);};
function po_turban(ctx,P){const s=P.tb||1,c=P.hatC||[244,240,228],hw=64*Math.pow(s,1.25),h=100*Math.pow(s,1.15),rim=-22,top=rim-h,bul=rim-h*0.42;
  // the cap's crown, showing at the top for some
  if(P.capC){const cc=P.capC,r=hw*0.3;ctx.beginPath();ctx.moveTo(-r,top+h*0.16);ctx.bezierCurveTo(-r,top-h*0.1,r,top-h*0.1,r,top+h*0.16);ctx.closePath();litFill(ctx,cc,-r,top-h*0.1,r,top+h*0.16);seam(ctx,cc,0.45);}
  // the wound cloth: round, wider than the head, a little flattened at the top
  const path=()=>{ctx.beginPath();ctx.moveTo(-44,rim+4);ctx.bezierCurveTo(-hw-4,rim+2,-hw-2,bul+16,-hw,bul);ctx.bezierCurveTo(-hw+2,top+h*0.12,-hw*0.42,top,0,top);
    ctx.bezierCurveTo(hw*0.42,top,hw-2,top+h*0.12,hw,bul);ctx.bezierCurveTo(hw+2,bul+16,hw+4,rim+2,44,rim+4);ctx.quadraticCurveTo(0,rim+14,-44,rim+4);ctx.closePath();};
  path();litFill(ctx,c,-hw,top,hw,rim+10);seam(ctx,c,0.45);
  // its turns, wound slantwise, each with a shade under it and light along its edge; shade low down where it meets the brow
  ctx.save();path();ctx.clip();ctx.lineCap="round";const n=Math.round(5+s);
  for(let i=0;i<n;i++){const y=rim-4-i*(rim-4-top-h*0.1)/n,k=hw*1.15;ctx.strokeStyle=rgba(darken(c,0.24),0.42);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-k,y+22);ctx.quadraticCurveTo(-hw*0.2,y-4,k,y-18);ctx.stroke();
    ctx.strokeStyle=rgba(lighten(c,0.6),0.55);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(-k,y+26);ctx.quadraticCurveTo(-hw*0.2,y,k,y-14);ctx.stroke();}
  const g=ctx.createLinearGradient(0,rim-30,0,rim+12);g.addColorStop(0,rgba(darken(c,0.2),0));g.addColorStop(1,rgba(darken(c,0.2),0.4));ctx.fillStyle=g;ctx.fillRect(-hw-6,rim-30,hw*2+12,46);
  ctx.fillStyle=rgba([255,255,255],0.22);ell(ctx,-hw*0.36,bul-h*0.12,hw*0.34,h*0.2,-0.4);ctx.fill();
  ctx.restore();}
function po_veilBack(ctx,P){const c=P.hatC||[248,246,240];ctx.beginPath();ctx.moveTo(-50,-28);ctx.bezierCurveTo(-58,-88,58,-88,50,-28);ctx.bezierCurveTo(58,24,72,70,78,112);ctx.quadraticCurveTo(0,126,-78,112);
  ctx.bezierCurveTo(-72,70,-58,24,-50,-28);ctx.closePath();litFill(ctx,c,-78,-88,78,124);seam(ctx,c,0.32);}
function po_veilFront(ctx,P){const c=P.hatC||[248,246,240];
  // over the hair and round the face
  ctx.beginPath();ctx.moveTo(-47,-6);ctx.bezierCurveTo(-52,-82,52,-82,47,-6);ctx.lineTo(41,4);ctx.quadraticCurveTo(40,-32,24,-40);ctx.quadraticCurveTo(0,-47,-24,-40);ctx.quadraticCurveTo(-40,-32,-41,4);ctx.closePath();
  litFill(ctx,c,-52,-82,52,4);seam(ctx,c,0.32);
  // the face veil, from just under the eyes to below the chin, falling in soft folds
  const fv=lighten(c,0.02);ctx.save();ctx.globalAlpha=0.9;ctx.beginPath();ctx.moveTo(-42,4);ctx.quadraticCurveTo(0,0,42,4);ctx.bezierCurveTo(46,30,40,60,30,74);ctx.quadraticCurveTo(0,84,-30,74);ctx.bezierCurveTo(-40,60,-46,30,-42,4);ctx.closePath();
  litFill(ctx,fv,-46,0,46,84);seam(ctx,fv,0.3);ctx.save();ctx.clip();ctx.strokeStyle=rgba(darken(fv,0.14),0.4);ctx.lineWidth=1.8;
  for(const q of [-24,-8,10,26]){ctx.beginPath();ctx.moveTo(q*0.9,8);ctx.quadraticCurveTo(q*1.05,40,q*1.1,80);ctx.stroke();}ctx.restore();ctx.restore();}

// ---- poses and things people of the past hold (in the figure's units, like the series' held things) ----
Object.assign(POSE,{
  // a basket on the forearm, the hand at the waist
  po_basket:{L:[0.22,-1.25],R:[0.09,0.06],feet:24,shift:3,tilt:0.02,turn:0.05,gaze:[0.2,0],look:0},
  // a hand up at the shoulder, steadying a pole that rests there
  po_pole:{L:[0.13,-0.1],R:[0.55,3.0],feet:22,shift:4,tilt:-0.03,turn:0.06,gaze:[0.3,0],look:0},
  // an arm held straight out to the side, a length of cloth along it
  po_measure:{L:[0.13,-0.1],R:[1.5,1.53],hand:"open",feet:30,shift:6,tilt:-0.06,turn:0.1,gaze:[1.2,0.1],look:0},
  // a staff or a rod held upright at the side
  po_staff:{L:[0.13,-0.1],R:[0.36,-0.5],feet:26,shift:3,tilt:0.02,turn:0.05,gaze:[0.2,0],look:0},
  // a balance held up in one hand
  po_balance:{L:[0.13,-0.1],R:[0.5,-1.0],feet:26,shift:3,tilt:0.02,turn:0.08,gaze:[0.4,-0.2],look:0},
  // the head bowed, the hands together in front
  po_bow:{L:[0.18,-1.9],R:[0.18,-1.9],feet:24,shift:0,tilt:0.16,turn:0,gaze:[0,1.3],look:1},
  // hands open at the sides, showing: "here, see"
  po_offer:{L:[0.4,-0.9],R:[0.4,-0.9],hand:"open",feet:26,shift:0,tilt:0.03,turn:0.05,gaze:[0.3,0.4],look:0}
});
// bolts of silk and velvet, carried in both arms, their ends to us
function po_heldBolts(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-14);
  [[-44,10,0],[44,10,1],[0,-34,2]].forEach(([bx,by,i])=>{const c=PO.silk[(i*2+1)%PO.silk.length];cx.beginPath();cx.ellipse(bx,by,46,42,0,0,TAU);litFill(cx,c,bx-46,by-42,bx+46,by+42);seam(cx,c,0.55);
    cx.strokeStyle=rgba(lighten(c,0.3),0.6);cx.lineWidth=2;for(const rr of [32,20,9]){cx.beginPath();cx.ellipse(bx,by,rr,rr*0.92,0,0,TAU);cx.stroke();}
    cx.fillStyle=rgba(darken(c,0.4),1);cx.beginPath();cx.arc(bx,by,5,0,TAU);cx.fill();});cx.restore();fingers(cx,P_,[[l[0]+4,l[1]],[r[0]-4,r[1]]]);}
// a small wooden chest with iron bands and a lock, held in both hands
function po_heldChest(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-6);const w=150,h=96,c=PO.wood;
  cx.beginPath();cx.rect(-w/2,-h/2+20,w,h-20);litFill(cx,c,-w/2,-h/2,w/2,h/2);seam(cx,c,0.6);cx.beginPath();cx.moveTo(-w/2,-h/2+20);cx.quadraticCurveTo(0,-h/2-14,w/2,-h/2+20);cx.closePath();litFill(cx,lighten(c,0.08),-w/2,-h/2-14,w/2,-h/2+20);seam(cx,c,0.6);
  cx.fillStyle=rgba(PO.iron,0.9);for(const bx of [-w/2+18,w/2-26])cx.fillRect(bx,-h/2+2,8,h-2);cx.fillRect(-w/2,-h/2+18,w,6);
  cx.fillStyle=rgba([196,160,80],1);rr(cx,-12,-h/2+28,24,26,4);cx.fill();cx.strokeStyle=rgba([150,116,50],1);cx.lineWidth=3;cx.beginPath();cx.arc(0,-h/2+28,8,Math.PI,0);cx.stroke();
  cx.restore();fingers(cx,P_,[[mx-w/2+2,my+18],[mx+w/2-2,my+18]]);}
// a basket of reed on the forearm, a cloth over what's bought
function po_basketArm(cx,P_,hands){const l=hands[0];cx.save();cx.translate(l[0]+6,l[1]+4);const c=[196,160,104];
  cx.strokeStyle=rgba(darken(c,0.25),1);cx.lineWidth=7;cx.beginPath();cx.ellipse(0,0,40,34,0,Math.PI*1.05,Math.PI*1.95);cx.stroke();
  cx.beginPath();cx.moveTo(-50,8);cx.lineTo(50,8);cx.lineTo(40,74);cx.quadraticCurveTo(0,82,-40,74);cx.closePath();litFill(cx,c,-50,8,50,80);seam(cx,c,0.55);
  cx.strokeStyle=rgba(darken(c,0.3),0.45);cx.lineWidth=2;for(let i=1;i<5;i++){cx.beginPath();cx.moveTo(-50+i*2,8+i*13);cx.lineTo(50-i*2,8+i*13);cx.stroke();}
  for(let i=-3;i<=3;i++){cx.beginPath();cx.moveTo(i*14,10);cx.lineTo(i*11.5,76);cx.stroke();}
  cx.fillStyle=rgba([226,214,186],1);cx.beginPath();cx.moveTo(-46,10);cx.quadraticCurveTo(-10,-10,44,8);cx.quadraticCurveTo(10,18,-46,10);cx.fill();cx.restore();fingers(cx,P_,[l]);}
// a felt cap, its brim rolled, held in both hands in front: o.turn turns it, o.seam shows a seam coming apart (0 to 1)
function po_capPaint(cx,c,o){o=o||{};const sq=Math.cos(o.turn||0),w=58,h=72;cx.save();
  cx.beginPath();cx.moveTo(-w,0);cx.bezierCurveTo(-w*0.96,-h*0.8,-w*0.42,-h*1.1,0,-h*1.08);cx.bezierCurveTo(w*0.42,-h*1.1,w*0.96,-h*0.8,w,0);cx.closePath();litFill(cx,c,-w,-h,w,0);seam(cx,c,0.5);
  // its felt: a soft nap, and the stitched seam up the middle, turning with it
  cx.strokeStyle=rgba(darken(c,0.3),0.5);cx.lineWidth=2.4;const sx=w*0.6*Math.sin(o.turn||0);cx.setLineDash([5,5]);cx.beginPath();cx.moveTo(sx,-4);cx.quadraticCurveTo(sx*0.8,-h*0.6,sx*0.3,-h*1.04);cx.stroke();cx.setLineDash([]);
  if(o.seam>0){const a=o.seam;cx.fillStyle=rgba(darken(c,0.62),0.95*a);cx.beginPath();cx.moveTo(sx-3,-6);cx.quadraticCurveTo(sx-17*a,-34,sx-2,-62);cx.quadraticCurveTo(sx+14*a,-34,sx+3,-6);cx.closePath();cx.fill();
    cx.strokeStyle=rgba(darken(c,0.5),0.95*a);cx.lineWidth=2.6;cx.lineCap="round";for(const [dx,dy,ex,ey] of [[-4,-14,-22,-4],[4,-26,22,-32],[-3,-44,-20,-54],[3,-52,18,-60]]){cx.beginPath();cx.moveTo(sx+dx,dy);cx.quadraticCurveTo(sx+(dx+ex)/2,dy+8,sx+ex,ey);cx.stroke();}}
  // the rolled brim
  cx.beginPath();cx.ellipse(0,-2,w+6,15*Math.max(0.5,sq),0,0,TAU);litFill(cx,darken(c,0.08),-w-6,-16,w+6,12);seam(cx,c,0.55);
  cx.strokeStyle=rgba(lighten(c,0.25),0.5);cx.lineWidth=2;cx.beginPath();cx.ellipse(0,-6,w,9,0,Math.PI*1.1,Math.PI*1.9);cx.stroke();cx.restore();}
function po_heldCap(c,o){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(o&&o.tilt||0);po_capPaint(cx,c,o);cx.restore();
  fingers(cx,P_,[[l[0]+6,l[1]-2],[r[0]-6,r[1]-2]]);};}
// a balance: a beam, two pans on cords, held up by its loop
function po_heldBalance(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0],r[1]);const br=[176,140,70];cx.strokeStyle=rgba(darken(br,0.35),1);cx.lineWidth=3;
  cx.beginPath();cx.moveTo(0,-8);cx.lineTo(0,26);cx.stroke();cx.lineWidth=6;cx.beginPath();cx.moveTo(-84,28);cx.lineTo(84,28);cx.stroke();
  for(const s of [-1,1]){cx.lineWidth=1.6;cx.beginPath();cx.moveTo(s*84,28);cx.lineTo(s*64,110);cx.moveTo(s*84,28);cx.lineTo(s*104,110);cx.stroke();
    cx.beginPath();cx.ellipse(s*84,112,26,8,0,0,TAU);litFill(cx,br,s*84-26,104,s*84+26,120);seam(cx,br,0.6);}
  cx.restore();fingers(cx,P_,[[r[0],r[1]-6]]);}
// a measuring rod, the market's standard length, held upright: its marks in red
function po_heldRod(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0],r[1]);cx.rotate(0.05);const c=PO.woodLt,L=430;
  cx.beginPath();cx.rect(-7,-L+60,14,L);litFill(cx,c,-7,-L,7,60);seam(cx,c,0.6);cx.fillStyle=rgba([170,52,40],0.9);for(let i=0;i<=8;i++)cx.fillRect(-7,-L+60+i*L/8-2,i%4===0?14:8,4);
  cx.restore();fingers(cx,P_,[r]);}
// felt in the hands, being stitched: a needle and thread (for someone sitting at work)
function po_heldFelt(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my);const c=PO.felt[2];
  cx.beginPath();cx.moveTo(-70,10);cx.quadraticCurveTo(-40,-30,10,-24);cx.quadraticCurveTo(60,-20,70,14);cx.quadraticCurveTo(0,34,-70,10);cx.closePath();litFill(cx,c,-70,-30,70,30);seam(cx,c,0.5);
  cx.strokeStyle=rgba([236,226,200],0.9);cx.lineWidth=1.6;cx.beginPath();cx.moveTo(30,-6);cx.quadraticCurveTo(52,-44,40,-80);cx.stroke();cx.strokeStyle=rgba([180,184,192],1);cx.lineWidth=2.4;cx.beginPath();cx.moveTo(40,-80);cx.lineTo(46,-104);cx.stroke();
  cx.restore();fingers(cx,P_,[[l[0]+8,l[1]],[r[0]-8,r[1]]]);}

// ---- a person of the past seen from behind, walking away (or standing, o.ph fixed): their robe, sash and turban, or cloak and veil ----
function po_back(ctx,id,x,y,s,o){o=o||{};const P_=PEOPLE[id],k=s*P_.build.h,ph=o.ph||0,sw=P_.build.sh,hw=P_.build.hip,T_=P_.top,c=T_.c,fer=T_.kind==="po_ferace",
    hem=fer?-12:(T_.hem||-40),fl=fer?46:(T_.fl||(hem>-100?44:26));
  if(!WC_RAW&&o.shadow!==false){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,100);g.addColorStop(0,rgba([90,80,96],0.22));g.addColorStop(1,rgba([90,80,96],0));
    ctx.fillStyle=g;ell(ctx,0,-4,100,16);ctx.fill();ctx.restore();}
  outlined(ctx,cx=>{const st=Math.sin(ph),up=[Math.max(0,st)*16,Math.max(0,-st)*16];
    for(const [i,sd] of [[0,-1],[1,1]]){limb(cx,[[sd*20,-282],[sd*22,-146-up[i]*0.6],[sd*23,-26-up[i]]],46,36,P_.bottom.c,[-80,-300,80,0]);ell(cx,sd*24,-12-up[i],21,11);litFill(cx,P_.shoe,-40,-24,40,0);}
    // what's carried in front, showing either side of them (o.under); the arms hang, or are hidden holding it (o.noArms); one raised to
    // steady something on the shoulder (o.armUp: -1 left, 1 right)
    if(o.under)o.under(cx,P_);
    if(!o.noArms)for(const sd of [-1,1])if(sd!==o.armUp)arm(cx,P_,sd,[0.12,-0.06+0.22*sd*st],0,{});
    if(o.armUp)arm(cx,P_,o.armUp,[0.62,3.02],0,{});
    po_robePath(cx,sw,hw,-448,0,hem,fl);litFill(cx,darken(c,0.06),-sw,-448,sw,hem);seam(cx,c,0.5);
    cx.save();po_robePath(cx,sw,hw,-448,0,hem,fl);cx.clip();cx.lineCap="round";
    cx.strokeStyle=rgba(darken(c,0.4),0.3);cx.lineWidth=2.4;for(const q of [-0.6,-0.2,0.24,0.62]){cx.beginPath();cx.moveTo(q*hw*0.8,-306);cx.quadraticCurveTo(q*hw*1.05,-220,q*(hw+fl)*0.95,hem+6);cx.stroke();}
    cx.strokeStyle=rgba(darken(c,0.4),0.5);cx.lineWidth=2;cx.beginPath();cx.moveTo(0,-440);cx.lineTo(0,hem+6);cx.stroke();
    if(!fer){const sash=T_.sash||darken(c,0.25);cx.fillStyle=rgba(sash,1);cx.beginPath();cx.moveTo(-hw-8,-346);cx.quadraticCurveTo(0,-338,hw+8,-346);cx.lineTo(hw+8,-314);cx.quadraticCurveTo(0,-306,-hw-8,-314);cx.closePath();cx.fill();
      cx.strokeStyle=rgba(darken(sash,0.3),0.55);cx.lineWidth=2;for(const yy of [-334,-324]){cx.beginPath();cx.moveTo(-hw-6,yy);cx.quadraticCurveTo(0,yy+8,hw+6,yy);cx.stroke();}}
    cx.restore();
    if(o.carry)o.carry(cx,P_,[[-(sw-12)-12,-300],[(sw-12)+12,-300]]);
    limb(cx,[[0,-476],[0,-446]],28,28,darken(P_.skin,0.2),[-20,-476,20,-446]);
    cx.save();cx.translate(0,-502);
    if(P_.hat==="po_veil"){po_veilBack(cx,P_);const hc=P_.hatC||[248,246,240];cx.beginPath();cx.moveTo(-48,10);cx.bezierCurveTo(-54,-82,54,-82,48,10);cx.quadraticCurveTo(0,30,-48,10);cx.closePath();litFill(cx,hc,-54,-82,54,30);seam(cx,hc,0.32);}
    else{for(const sd of [-1,1]){ell(cx,sd*41,2,7,11);litFill(cx,darken(P_.skin,0.1),-50,-12,50,12);}
      // from behind, the turban's cloth is wound low round the back of the head, down to the nape
      if(P_.hat==="po_turban"){const c=P_.hatC||[244,240,228];cx.beginPath();cx.moveTo(-44,-40);cx.bezierCurveTo(-50,-4,-40,26,-20,32);cx.quadraticCurveTo(0,36,20,32);cx.bezierCurveTo(40,26,50,-4,44,-40);cx.closePath();
        litFill(cx,c,-50,-40,50,36);seam(cx,c,0.45);cx.save();cx.clip();cx.lineCap="round";for(const y of [-24,-6,12]){cx.strokeStyle=rgba(darken(c,0.24),0.42);cx.lineWidth=2.4;cx.beginPath();cx.moveTo(-52,y+12);cx.quadraticCurveTo(0,y-8,52,y-6);cx.stroke();
          cx.strokeStyle=rgba(lighten(c,0.6),0.5);cx.beginPath();cx.moveTo(-52,y+16);cx.quadraticCurveTo(0,y-4,52,y-2);cx.stroke();}cx.restore();po_turban(cx,P_);}
      else{headPath(cx);litFill(cx,P_.hair.c,-42,-56,42,51);}}
    cx.restore();if(o.over)o.over(cx,P_);},x,y,k,P_.edge,[-300,-760,300,10]);}

/* ---------- painting many small things cheaply ---------- */
// a flat fill a touch uneven at its edge, and a pencil line; the grain comes once for the whole layer (po_grain), so a market of
// hundreds of shops paints in well under the place's two seconds
function po_fill(ctx,pts,col,a,seed){ctx.beginPath();const R=wc_rng(seed||1);pts.forEach((p,i)=>{const x=p[0]+(R()-0.5)*0.8,y=p[1]+(R()-0.5)*0.8;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();
  ctx.fillStyle=rgba(col,a==null?1:a);ctx.fill();}
function po_line(ctx,pts,lw,a,closed){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));if(closed!==false)ctx.closePath();ctx.lineJoin="round";ctx.lineCap="round";
  ctx.lineWidth=lw||1;ctx.strokeStyle=rgba(WC_INK,a==null?0.5:a);ctx.stroke();}
// the paper's grain and a few blooms, multiplied over what's painted on a layer (its empty parts stay empty)
function po_grain(ctx,k){ctx.save();ctx.globalCompositeOperation="source-atop";ctx.globalAlpha=0.32*(k||1);ctx.drawImage(WC.gran,0,0,W,H);ctx.globalAlpha=0.16*(k||1);ctx.drawImage(WC.blotch,0,0,W,H);ctx.restore();}

/* ---------- the market from above ---------- */
// a camera high over the market, tilted down by p: X across, Y up, Z away (metres). The bedesten stands in the middle, its long side to
// us; its four gates open onto four streets, and more streets cross them. Shops line every street; in 1461 only the first few, near
// the gates, by the 1520s all of them (po_airShops gives each its place and the moment it springs up)
const PO_AIR={F:1700,ch:104,p:0.6,Zc:150,hall:{x:22,z:15,h:11},bay:[8.8,10],dome:{r:3.6,drum:0.9,k:0.72}};
function po_pjT(C,X,Y,Z){const c=Math.cos(C.p),s=Math.sin(C.p),dy=Y-C.ch,yc=dy*c+Z*s,zc=Math.max(0.5,Z*c-dy*s);return[960+C.F*X/zc,540-C.F*yc/zc];}
const po_air=(X,Y,Z)=>po_pjT(PO_AIR,X,Y,Z);
// the streets: [x0, z0, x1, z1, half width, depth of the shops along them], in metres from the hall's middle. The four main streets run
// out from the gates; narrower ones cross them in a grid, a little uneven, so the blocks between fill with shops back to back
const PO_MKT={x:88,z0:-74,z1:112};
const PO_STREETS=(()=>{const M=PO_MKT,L=[[0,-19,0,M.z0,2.8,4.4],[0,19,0,M.z1,2.8,4.4],[-26,0,-M.x,0,2.8,4.4],[26,0,M.x,0,2.8,4.4]],R=wc_rng(431);
  for(let k=1;k<=12;k++)for(const s of [-1,1]){const z=s*k*13.6+(R()-0.5)*2.4;if(z<M.z0+4||z>M.z1-4)continue;L.push([-M.x,z,M.x,z+(R()-0.5)*3,1.7,4.6]);}
  for(let k=1;k<=5;k++)for(const s of [-1,1]){const x=s*k*16+(R()-0.5)*3;if(Math.abs(x)>M.x-4)continue;L.push([x,M.z0,x+(R()-0.5)*4,M.z1,1.7,3.4]);}return L;})();
// the open ground round the hall, kept free of shops
const PO_YARD={x:30,z:22};
// the convex hull of points on the frame (a dome's outline, a shop's)
function po_hull(P){const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const q of p){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q);}
  for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q);}up.pop();lo.pop();return lo.concat(up);}
// every shop of the 1520s: its corners in the world, its outline and foot on the frame, and when it springs up (k, from 0 for the first,
// near the gates, to 1 for the last, farthest out). Streets are lined in order, and a shop that would stand on a street, in the yard
// round the hall, or on another shop is left out
function po_airShops(){if(po_airShops.L)return po_airShops.L;const C=PO_AIR,Zc=C.Zc,occ=new Set(),key=(x,z)=>Math.round(x)+","+Math.round(z),L=[],R=wc_rng(812);
  const block=(x,z)=>Math.abs(x)>PO_MKT.x||z<PO_MKT.z0||z>PO_MKT.z1||Math.abs(x)<PO_YARD.x&&Math.abs(z)<PO_YARD.z||PO_STREETS.some(([x0,z0,x1,z1,w])=>{const dx=x1-x0,dz=z1-z0,l=Math.hypot(dx,dz),u=((x-x0)*dx+(z-z0)*dz)/(l*l),
    d=Math.abs((x-x0)*dz-(z-z0)*dx)/l;return u>=-0.02&&u<=1.02&&d<w+0.3;});
  PO_STREETS.forEach(([x0,z0,x1,z1,w,depth],si)=>{const dx=x1-x0,dz=z1-z0,l=Math.hypot(dx,dz),D=[dx/l,dz/l];
    for(const s of [1,-1]){const N=[-D[1]*s,D[0]*s];
      for(let u=0,fw=3;u<l-3;u+=fw){fw=2.8+R()*0.8;const dp=depth-R()*0.4,o=w+0.45,a=[x0+D[0]*u+N[0]*o,z0+D[1]*u+N[1]*o],b=[a[0]+D[0]*fw,a[1]+D[1]*fw],
          a2=[a[0]+N[0]*dp,a[1]+N[1]*dp],b2=[b[0]+N[0]*dp,b[1]+N[1]*dp],cells=[];let ok=true;
        for(let i=0;i<=3&&ok;i++)for(let j=0;j<=3;j++){const ui=0.14+0.72*i/3,uj=0.14+0.72*j/3,x=lerp(lerp(a[0],b[0],ui),lerp(a2[0],b2[0],ui),uj),z=lerp(lerp(a[1],b[1],ui),lerp(a2[1],b2[1],ui),uj);
          if(block(x,z)||occ.has(key(x,z))){ok=false;break;}cells.push(key(x,z));}
        if(!ok)continue;cells.forEach(c=>occ.add(c));
        // the world corners: front (on the street) and back, the front's eave, the roof's ridge at the back, the awning out over the street
        const h=3.0+R()*0.5,hb=h+0.7+R()*0.3,aw=0.6+R()*0.4,P=(q,Y)=>po_air(q[0],Y,q[1]+Zc),out=[a[0]-N[0]*aw,a[1]-N[1]*aw],out2=[b[0]-N[0]*aw,b[1]-N[1]*aw];
        const pts={a0:P(a,0),b0:P(b,0),a1:P(a,h),b1:P(b,h),c1:P(a2,hb),d1:P(b2,hb),c0:P(a2,0),d0:P(b2,0),e:P(out,h-0.45),f:P(out2,h-0.45)};
        // does its front face us? (the camera is on the street side of it)
        const face=(0-a[0])*(-N[0])+(-Zc-a[1])*(-N[1])>0,mid=[(a[0]+b2[0])/2,(a[1]+b2[1])/2],gate=Math.min(Math.hypot(mid[0],mid[1]+15),Math.hypot(mid[0],mid[1]-15),Math.hypot(mid[0]+22,mid[1]),Math.hypot(mid[0]-22,mid[1]));
        L.push({si,pts,face,sa:(0-a[0])*(-D[0])+(-Zc-a[1])*(-D[1])>0,mid,zc:Math.hypot(mid[0],mid[1]+Zc,C.ch),d:gate+R()*10,hull:po_hull(Object.values(pts)),foot:Math.max(pts.a0[1],pts.b0[1],pts.c0[1],pts.d0[1]),
          roof:R(),aw:R(),goods:Math.floor(R()*6),seed:Math.floor(R()*1e6)});}}});
  // the order they spring up in: the nearest the gates first; then far to near, for painting
  const ds=L.map(s=>s.d).sort((p,q)=>p-q);L.forEach(s=>s.k=ds.indexOf(s.d)/(L.length-1));L.sort((p,q)=>q.zc-p.zc);return po_airShops.L=L;}
// a lead dome on its drum, seen from above: its outline, the light on its right (the morning sun is in the east, to our right), the seams
// of its lead sheets, and a small finial; P projects a point (X, Y, Z) to the frame
function po_dome(ctx,P,cx,cz,y0,r,dr,o){o=o||{};const pts=[],kk=o.k||1;for(let i=0;i<24;i++){const a=i/24*TAU;pts.push(P(cx+Math.cos(a)*r,y0,cz+Math.sin(a)*r));}
  for(let j=1;j<=6;j++){const e=j/6*Math.PI/2;for(let i=0;i<24;i++){const a=i/24*TAU;pts.push(P(cx+Math.cos(a)*r*Math.cos(e),y0+dr+r*kk*Math.sin(e),cz+Math.sin(a)*r*Math.cos(e)));}}
  for(let i=0;i<24;i++){const a=i/24*TAU;pts.push(P(cx+Math.cos(a)*r,y0+dr,cz+Math.sin(a)*r));}
  const h=po_hull(pts),top=P(cx,y0+dr+r*kk,cz),bot=P(cx,y0,cz-r),lead=o.col||PO.lead;let x0=1e9,x1=-1e9,ya=1e9,yb=-1e9;h.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);ya=Math.min(ya,p[1]);yb=Math.max(yb,p[1]);});
  po_fill(ctx,h,lead,1,o.seed);ctx.save();wc_tr(ctx,h);ctx.clip();
  // the drum, a band darker than the dome; light on the right, shade on the left, a soft gleam high on the right
  const by=P(cx,y0+dr,cz-r)[1];ctx.fillStyle=rgba(wc_dim(lead,0.12),0.9);ctx.fillRect(x0-2,by,x1-x0+4,yb-by+2);
  // (o.left: the light comes from the left)
  const g=ctx.createLinearGradient(o.left?x1:x0,0,o.left?x0:x1,0);g.addColorStop(0,rgba(wc_dim(lead,0.3),0.55));g.addColorStop(0.55,rgba(lead,0));g.addColorStop(1,rgba(wc_lit(lead,0.5),0.5));ctx.fillStyle=g;ctx.fillRect(x0,ya,x1-x0,yb-ya);
  wc_glowAt(ctx,lerp(x0,x1,o.left?0.34:0.66),lerp(ya,by,0.3),(x1-x0)*0.3,[250,250,246],0.5);
  // the seams of the lead, from the crown down
  ctx.strokeStyle=rgba(wc_dim(lead,0.35),o.seams||0.35);ctx.lineWidth=Math.max(0.6,(x1-x0)/(o.seams?160:90));for(let i=0;i<12;i++){const a=Math.PI*(0.08+0.84*i/11);ctx.beginPath();
    for(let j=0;j<=8;j++){const e=j/8*Math.PI/2,p=P(cx+Math.cos(a)*r*Math.cos(e),y0+dr+r*kk*Math.sin(e),cz-Math.sin(a)*r*Math.cos(e));j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  ctx.restore();po_line(ctx,h,Math.max(0.8,(x1-x0)/70),0.55);
  const fin=P(cx,y0+dr+r*kk+r*(o.seams?0.16:0.28),cz);ctx.strokeStyle=rgba(wc_dim(lead,0.4),0.9);ctx.lineWidth=Math.max(1,(x1-x0)/60);ctx.beginPath();ctx.moveTo(top[0],top[1]);ctx.lineTo(fin[0],fin[1]);ctx.stroke();
  if(o.seams){ctx.fillStyle=rgba(wc_dim(lead,0.3),1);ctx.beginPath();ctx.arc(fin[0],fin[1],Math.max(1.5,(x1-x0)/70),0,TAU);ctx.fill();}
  return{x0,x1,ya,yb,bot};}
// a wall face of the hall, from (X0, Z0) to (X1, Z1), with stone courses and bands of brick between them, high windows, and a gate
function po_hallFace(ctx,P,X0,Z0,X1,Z1,h,o){o=o||{};const Q=(u,Y)=>P(lerp(X0,X1,u),Y,lerp(Z0,Z1,u)),face=[Q(0,0),Q(1,0),Q(1,h),Q(0,h)];
  wc_wash(ctx,face,o.light?wc_lit(PO.stone,0.05):wc_dim(PO.stone,0.04),{kind:"build",seed:o.seed||71,lw:1.5});ctx.save();wc_tr(ctx,face);ctx.clip();
  // courses: a band of brick every metre and a bit, three thin rows of red
  for(let Y=0.9;Y<h-0.3;Y+=1.25)for(let k=0;k<3;k++){const y=Y+k*0.11;po_fill(ctx,[Q(0,y),Q(1,y),Q(1,y+0.07),Q(0,y+0.07)],PO.brick,0.75,y*100|0);}
  // the stones' joints, faint, between the bands
  ctx.strokeStyle=rgba(wc_dim(PO.stone,0.3),0.25);ctx.lineWidth=0.8;const L=Math.hypot(X1-X0,Z1-Z0);for(let Y=0.2;Y<h;Y+=1.25)for(let x=0;x<L;x+=0.9+((Y*7|0)%3)*0.2){const a=Q(x/L,Y+0.1),b=Q(x/L,Y+0.85);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  // the shade at the foot, and the lighter top
  const f0=Q(0.5,0),f1=Q(0.5,h*0.35);const g=ctx.createLinearGradient(0,f1[1],0,f0[1]);g.addColorStop(0,"rgba(120,96,70,0)");g.addColorStop(1,"rgba(120,96,70,0.18)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
  // high windows: small, arched, iron-barred, one in each bay
  (o.wins||[]).forEach(u=>{const ww=0.55/L,arc=[];for(let i=0;i<=10;i++){const a=Math.PI*i/10;arc.push(Q(u-ww*Math.cos(a),h-2.6+0.55*Math.sin(a)));}const win=[Q(u-ww,h-4.2),Q(u+ww,h-4.2)].concat(arc.reverse());
    po_fill(ctx,win,[70,62,58],0.92,u*999|0);ctx.strokeStyle=rgba(PO.iron,0.6);ctx.lineWidth=0.8;const m0=Q(u,h-4.2),m1=Q(u,h-2.1);ctx.beginPath();ctx.moveTo(m0[0],m0[1]);ctx.lineTo(m1[0],m1[1]);ctx.stroke();
    po_line(ctx,win,0.9,0.5);});
  // the gate: a tall arch in a frame of dressed stone, dark inside, its iron-clad doors open back against the passage
  if(o.gate!=null){const u=o.gate,gw=2.0/L,gh=6.2,arc=[];for(let i=0;i<=16;i++){const a=Math.PI*i/16;arc.push(Q(u-gw*Math.cos(a),gh-2.0+2.0*Math.sin(a)));}
    const fr=[Q(u-gw-0.7/L,0),Q(u+gw+0.7/L,0),Q(u+gw+0.7/L,gh+0.8),Q(u-gw-0.7/L,gh+0.8)];wc_wash(ctx,fr,wc_lit(PO.stone,0.12),{kind:"build",seed:77,lw:1.3});
    const op=[Q(u-gw,0),Q(u+gw,0)].concat(arc.reverse());po_fill(ctx,op,[58,48,44],1,78);
    for(const s of [-1,1]){const d=[Q(u+s*gw,0),Q(u+s*gw*0.45,0),Q(u+s*gw*0.45,gh-2.6),Q(u+s*gw,gh-2.2)];po_fill(ctx,d,[92,70,52],1,79+s);ctx.save();wc_tr(ctx,d);ctx.clip();
      for(let k=1;k<5;k++){const y=k*(gh-2.4)/5;const a=Q(u+s*gw,y),b=Q(u+s*gw*0.45,y);ctx.strokeStyle=rgba(PO.iron,0.85);ctx.lineWidth=Math.max(1,Math.abs(b[0]-a[0])/14);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();po_line(ctx,d,0.9,0.5);}
    po_line(ctx,op,1.1,0.6,false);}
  return face;}
// the hall from above: the face to us with its gate, the lead roof, the fifteen domes in three rows of five
function po_hallAir(ctx,P){const C=PO_AIR,h=C.hall.h,x=C.hall.x,z=C.hall.z,Zc=C.Zc,[bx,bz]=C.bay,D=C.dome;
  // its shadow on the ground, to the left and behind (the sun is low in the east)
  po_fill(ctx,[P(-x,0,Zc-z),P(-x-9,0,Zc-z+5),P(-x-9,0,Zc+z+5),P(x-4,0,Zc+z+5),P(x,0,Zc+z)],[140,120,96],0.25,70);
  po_hallFace(ctx,P,-x,Zc-z,x,Zc-z,h,{wins:[0.1,0.3,0.7,0.9],gate:0.5,seed:72,light:true});
  // the roof's lead between the domes, and its parapet
  const roof=[P(-x,h,Zc-z),P(x,h,Zc-z),P(x,h,Zc+z),P(-x,h,Zc+z)];wc_wash(ctx,roof,wc_lit(PO.lead,0.15),{kind:"build",seed:73,lw:1.4});
  for(let i=1;i<5;i++){const a=P(-x+i*bx,h,Zc-z),b=P(-x+i*bx,h,Zc+z);ctx.strokeStyle=rgba(wc_dim(PO.lead,0.3),0.35);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  for(let j=1;j<3;j++){const a=P(-x,h,Zc-z+j*bz),b=P(x,h,Zc-z+j*bz);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  po_fill(ctx,[P(-x,h,Zc-z),P(x,h,Zc-z),P(x,h+0.6,Zc-z),P(-x,h+0.6,Zc-z)],wc_lit(PO.stone,0.1),1,74);
  // the domes, from the back row to the front
  for(let j=2;j>=0;j--)for(let i=0;i<5;i++)po_dome(ctx,P,-x+bx*(i+0.5),Zc-z+bz*(j+0.5),h,D.r,D.drum,{seed:80+j*5+i,k:D.k});}
// a house of the city round the market, from above: walls of plaster or of wood, ochre, brown or grey, and a hipped roof of red tiles
const PO_HOUSE=[[238,226,204],[214,182,136],[176,132,100],[204,180,160],[228,210,176],[190,160,128],[240,232,214]];
function po_houseAir(ctx,P,x,z,w,d,h,seed){seed=Math.abs(seed|0);const R=wc_rng(seed),wall=PO_HOUSE[seed%PO_HOUSE.length],tile=PO_TILES[(seed>>2)%4];
  const A=P(x-w/2,0,z-d/2),B=P(x+w/2,0,z-d/2),A1=P(x-w/2,h,z-d/2),B1=P(x+w/2,h,z-d/2),r=Math.min(w,d)*0.42,ridge=[P(x-w/2+r,h+r*0.8,z),P(x+w/2-r,h+r*0.8,z)];
  po_fill(ctx,[A,B,B1,A1],wall,1,seed);const side=x<0?[B,P(x+w/2,0,z+d/2),P(x+w/2,h,z+d/2),B1]:[A,P(x-w/2,0,z+d/2),P(x-w/2,h,z+d/2),A1];po_fill(ctx,side,wc_dim(wall,0.12),1,seed+1);
  // windows in a row on the upper floor, a door below
  const nw=Math.max(2,Math.round(w/2.6));for(let i=0;i<nw;i++){const u=(i+0.6)/(nw+0.2),wx=lerp(x-w/2,x+w/2,u),p=[P(wx-0.35,h*0.62,z-d/2),P(wx+0.35,h*0.62,z-d/2),P(wx+0.35,h*0.86,z-d/2),P(wx-0.35,h*0.86,z-d/2)];po_fill(ctx,p,[96,84,76],0.8,seed+i);}
  // the roof: its front slope, the slope at the side we see, and the back one rising behind
  const back=x<0?[B1,P(x+w/2,h,z+d/2),ridge[1]]:[A1,P(x-w/2,h,z+d/2),ridge[0]];po_fill(ctx,back,wc_dim(tile,0.14),1,seed+2);
  const front=[A1,B1,ridge[1],ridge[0]];po_fill(ctx,front,tile,1,seed+3);
  po_fill(ctx,[ridge[0],ridge[1],P(x+w/2-r,h+r*0.8,z+0.01),P(x+w/2,h,z+d/2),P(x-w/2,h,z+d/2)],wc_lit(tile,0.08),0.95,seed+4);
  ctx.save();wc_tr(ctx,front);ctx.clip();ctx.strokeStyle=rgba(wc_dim(tile,0.35),0.4);ctx.lineWidth=0.7;for(let k=1;k<6;k++){const u=k/6,a=[lerp(A1[0],ridge[0][0],u),lerp(A1[1],ridge[0][1],u)],b=[lerp(B1[0],ridge[1][0],u),lerp(B1[1],ridge[1][1],u)];
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  po_line(ctx,[A,B,B1,ridge[1],ridge[0],A1],0.8,0.4);}
// a tree from above: a round crown, light on its right; a cypress: tall and dark, a flame of green
function po_treeAir(ctx,P,x,z,h,seed,kind){seed=Math.abs(seed|0);const b=P(x,0,z),t=P(x,h,z),sz=Math.abs(b[1]-t[1]);if(kind==="cypress"){const w=sz*0.13,sh=P(x-h*0.55,0,z+h*0.2);
    // its shadow on the ground, long and thin, away from the sun; then the tree: a slim flame of dark green, lit on its right
    ctx.fillStyle="rgba(96,86,70,0.3)";ctx.beginPath();ctx.moveTo(b[0]-w*0.8,b[1]);ctx.quadraticCurveTo((b[0]+sh[0])/2,(b[1]+sh[1])/2-w*0.6,sh[0],sh[1]);ctx.quadraticCurveTo((b[0]+sh[0])/2,(b[1]+sh[1])/2+w*0.6,b[0]+w*0.8,b[1]);ctx.fill();
    const pts=[];for(let i=0;i<=12;i++){const u=i/12,ww=w*Math.sin(Math.PI*Math.pow(u,0.75))*(1-0.1*u);pts.push([lerp(b[0],t[0],u)-ww,lerp(b[1],t[1],u)]);}for(let i=12;i>=0;i--){const u=i/12,ww=w*Math.sin(Math.PI*Math.pow(u,0.75))*(1-0.1*u);pts.push([lerp(b[0],t[0],u)+ww,lerp(b[1],t[1],u)]);}
    po_fill(ctx,pts,wc_dim(PO.cypress,0.08),1,seed);ctx.fillStyle=rgba(wc_lit(PO.cypress,0.22),0.55);ctx.beginPath();ctx.ellipse(lerp(b[0],t[0],0.45)+w*0.35,lerp(b[1],t[1],0.45),w*0.4,sz*0.28,0,0,TAU);ctx.fill();po_line(ctx,pts,0.7,0.35);return;}
  const r=sz*0.42,c=[b[0],b[1]-sz*0.55],col=[[112,150,96],[126,160,100],[100,140,92]][seed%3];ctx.fillStyle=rgba([120,104,90],0.25);ctx.beginPath();ctx.ellipse(b[0]-r*0.5,b[1],r,r*0.4,0,0,TAU);ctx.fill();
  const R=wc_rng(seed);for(let i=0;i<5;i++){const a=i/5*TAU,px=c[0]+Math.cos(a)*r*0.45,py=c[1]+Math.sin(a)*r*0.35;ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.arc(px,py,r*(0.55+R()*0.15),0,TAU);ctx.fill();}
  ctx.fillStyle=rgba(wc_lit(col,0.25),0.6);ctx.beginPath();ctx.arc(c[0]+r*0.3,c[1]-r*0.25,r*0.42,0,TAU);ctx.fill();}
// the city round the market and the open ground where the market will grow: earth, worn paths out from the gates, dry grass and a few
// gardens; houses of plaster and of wood, with gardens of trees and cypresses between them, close round it; a distant domed building;
// then the hall
function po_paintAir(ctx){const C=PO_AIR,Zc=C.Zc,P=po_air;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_prep();
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[224,206,168],{kind:"ground",line:false,seed:61});
  const R=wc_rng(77);
  // patches of dry grass, and paths worn out from the four gates
  for(let i=0;i<40;i++){const x=(R()-0.5)*2*PO_MKT.x,z=lerp(PO_MKT.z0,PO_MKT.z1,R()),r=6+R()*14,q=[];for(let k=0;k<14;k++){const a=k/14*TAU,rr=r*(0.7+R()*0.5);q.push(P(x+Math.cos(a)*rr,0,z+Zc+Math.sin(a)*rr*0.8));}
    po_fill(ctx,q,[[200,198,140],[190,188,128],[212,200,150]][i%3],0.45,300+i);}
  for(const [dx,dz] of [[0,-1],[0,1],[-1,0],[1,0]]){const q=[],q2=[];for(let k=0;k<=24;k++){const u=k/24,d=(dx?24:17)+u*(dz<0?60:dz>0?100:70),wob=Math.sin(u*7+dx*3+dz)*3;
      const x=dx?dx*d:wob,z=dz?dz*d:wob,w=3.2-u*1.2;q.push(P(x+(dz?w:0),0,z+Zc+(dx?w:0)));q2.push(P(x-(dz?w:0),0,z+Zc-(dx?w:0)));}po_fill(ctx,q.concat(q2.reverse()),[238,226,196],0.75,310+dx*3+dz);}
  po_fill(ctx,[P(-PO_YARD.x,0,Zc-PO_YARD.z),P(PO_YARD.x,0,Zc-PO_YARD.z),P(PO_YARD.x,0,Zc+PO_YARD.z),P(-PO_YARD.x,0,Zc+PO_YARD.z)],[236,224,194],0.6,95);
  // the city: houses in their plots outside the market, far to near, with gardens of trees and cypresses between them
  const items=[];for(let gz=-90;gz<=340;gz+=11.5)for(let gx=-320;gx<=320;gx+=12){const x=gx+(R()-0.5)*5,z=gz+(R()-0.5)*4,inMarket=Math.abs(x)<PO_MKT.x+6&&z<PO_MKT.z1+6&&z>PO_MKT.z0-8;
      if(inMarket)continue;const r=R();if(r<0.1)continue;
      if(r<0.26)items.push({z,f:()=>po_treeAir(ctx,P,x,z+Zc,6+R()*5,(x*7+z)|0,R()<0.5?"cypress":"round")});
      else items.push({z,f:()=>po_houseAir(ctx,P,x,z+Zc,7.5+R()*4.5,6.5+R()*3.5,4.6+R()*3,((x+400)*13+(z+200)*7)|0)});
      if(R()<0.3){const tx=x+(R()-0.5)*9,tz=z+4+R()*4;items.push({z:tz,f:()=>po_treeAir(ctx,P,tx,tz+Zc,7+R()*6,(tx*11+tz)|0,R()<0.55?"cypress":"round")});}}
  // gardens and orchards on the ground where the market will grow (its shops will cover most of them)
  for(let i=0;i<30;i++){const x=(R()-0.5)*2*PO_MKT.x,z=lerp(PO_MKT.z0,PO_MKT.z1,R());if(Math.abs(x)<PO_YARD.x+6&&Math.abs(z)<PO_YARD.z+6)continue;items.push({z,f:()=>po_treeAir(ctx,P,x,z+Zc,6+R()*4,(x*5+z*3)|0,R()<0.3?"cypress":"round")});}
  // a domed building far off, and its slender tower
  items.push({z:310,f:()=>{const x=-150,z=310+Zc;po_hallFace(ctx,P,x-14,z-12,x+14,z-12,10,{seed:96});po_fill(ctx,[P(x-14,10,z-12),P(x+14,10,z-12),P(x+14,10,z+12),P(x-14,10,z+12)],wc_lit(PO.lead,0.15),1,99);
    po_dome(ctx,P,x,z,10,11,1.2,{seed:97,k:0.8});const b=P(x+18,0,z-14),t=P(x+18,40,z-14),pts=[[b[0]-3,b[1]],[b[0]+3,b[1]],[t[0]+3,t[1]+10],[t[0],t[1]],[t[0]-3,t[1]+10]];po_fill(ctx,pts,wc_lit(PO.stone,0.1),1,98);po_line(ctx,pts,0.7,0.4);}});
  items.sort((a,b)=>b.z-a.z).forEach(it=>it.f());
  // two plane trees at the yard's far corners
  po_treeAir(ctx,P,-27,Zc+19,14,3,"round");po_treeAir(ctx,P,27,Zc+19,13,5,"round");
  po_grain(ctx,0.8);po_hallAir(ctx,P);}
// the hall alone, to lay over the shops and the crowd behind it
function po_paintAirHall(ctx){wc_prep();po_hallAir(ctx,po_air);}
// the shops of the 1520s, on a layer of their own: tiled or wooden roofs, the fronts that face us with their goods, the raised shutters
// and awnings out over the street. The scene shows each as it springs up (po_airAt)
const PO_TILES=[[188,112,84],[176,100,78],[196,126,92],[164,94,74],[150,120,100]],PO_AWN=[[214,180,130],[236,224,194],[200,160,112],[226,206,170]];
function po_paintAirShops(ctx){wc_prep();const L=po_airShops();
  for(const s of L){const p=s.pts,R=wc_rng(s.seed),roof=s.roof<0.18?[150,126,104]:PO_TILES[Math.floor(s.roof*5)%5],wood=mix(PO.wood,[120,96,74],R()*0.5);
    // the side we see, then the front if it faces us: its wooden posts, the dark of the shop behind the goods
    const sideA=[p.a0,p.c0,p.c1,p.a1],sideB=[p.b0,p.d0,p.d1,p.b1];po_fill(ctx,s.sa?sideA:sideB,wc_dim(wood,0.15),1,s.seed);
    if(s.face){po_fill(ctx,[p.a0,p.b0,p.b1,p.a1],wood,1,s.seed+1);const q=(u,v)=>[lerp(lerp(p.a0[0],p.b0[0],u),lerp(p.a1[0],p.b1[0],u),v),lerp(lerp(p.a0[1],p.b0[1],u),lerp(p.a1[1],p.b1[1],u),v)];
      po_fill(ctx,[q(0.1,0.2),q(0.9,0.2),q(0.9,0.85),q(0.1,0.85)],[84,66,54],0.85,s.seed+2);
      for(let i=0;i<3;i++){const c=PO.silk.concat(PO.felt)[(s.goods+i*2)%11];po_fill(ctx,[q(0.14+i*0.26,0.22),q(0.34+i*0.26,0.22),q(0.34+i*0.26,0.5),q(0.14+i*0.26,0.5)],c,0.9,s.seed+3+i);}}
    const aw=[p.a1,p.b1,p.f,p.e],awc=s.aw<0.55?wc_lit(wood,0.12):PO_AWN[Math.floor(s.aw*4)%4];if(!s.face){po_fill(ctx,aw,awc,1,s.seed+7);po_line(ctx,aw,0.6,0.3);}
    // the roof, its courses of tiles, its pencil line
    const rf=[p.a1,p.b1,p.d1,p.c1];po_fill(ctx,rf,roof,1,s.seed+6);ctx.save();wc_tr(ctx,rf);ctx.clip();ctx.strokeStyle=rgba(wc_dim(roof,0.3),0.4);ctx.lineWidth=0.7;
    for(let k=1;k<4;k++){const u=k/4,a=[lerp(p.a1[0],p.c1[0],u),lerp(p.a1[1],p.c1[1],u)],b=[lerp(p.b1[0],p.d1[0],u),lerp(p.b1[1],p.d1[1],u)];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
    po_line(ctx,rf,0.7,0.35);
    // the awning, or the upper shutter raised, out over the street
    if(s.face){po_fill(ctx,aw,awc,1,s.seed+7);po_line(ctx,aw,0.6,0.3);}}
  po_grain(ctx,0.9);}
// the crowd of the 1520s, small, in the streets: a robe and a white turban each (a woman's cloak and veil for some)
function po_paintAirCrowd(ctx){wc_prep();const P=po_air,Zc=PO_AIR.Zc,R=wc_rng(515),L=[];
  PO_STREETS.forEach(([x0,z0,x1,z1,w])=>{const dx=x1-x0,dz=z1-z0,l=Math.hypot(dx,dz),n=Math.round(l/(w>3?3.2:4.5));for(let i=0;i<n;i++){const u=R(),o=(R()-0.5)*w*1.5;
      const x=x0+dx*u-dz/l*o,z=z0+dz*u+dx/l*o;if(Math.abs(x)<PO_YARD.x-2&&Math.abs(z)<PO_YARD.z-2)continue;L.push([x,z+Zc]);}});
  for(let i=0;i<40;i++){const a=R()*TAU,r=17+R()*10;L.push([Math.cos(a)*r*1.3,Zc+Math.sin(a)*r*0.9]);}
  L.sort((a,b)=>b[1]-a[1]).forEach(([x,z],i)=>{const f=P(x,0,z),t=P(x,1.7,z),h=f[1]-t[1],w=h*0.34,woman=R()<0.18,c=woman?[[60,70,98],[110,72,64],[80,60,70]][i%3]:PO.silk.concat(PO.felt)[i%11];
    ctx.fillStyle="rgba(90,80,70,0.25)";ctx.beginPath();ctx.ellipse(f[0]-w*0.6,f[1],w*0.9,w*0.3,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(wc_dim(c,0.05),1);ctx.beginPath();ctx.moveTo(f[0]-w*0.62,f[1]);ctx.lineTo(f[0]+w*0.62,f[1]);ctx.lineTo(f[0]+w*0.42,t[1]+h*0.3);ctx.lineTo(f[0]-w*0.42,t[1]+h*0.3);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(woman?[248,246,240]:[246,242,232],1);ctx.beginPath();ctx.arc(t[0],t[1]+h*0.18,w*(woman?0.42:0.5),0,TAU);ctx.fill();ctx.strokeStyle="rgba(60,50,46,0.35)";ctx.lineWidth=0.6;ctx.stroke();});
  po_grain(ctx,0.6);}
// the 1600s: three streets, each now its trade's own: the goldsmiths' to the east, the cap makers' running towards us from the south
// gate, the quilt makers' to the west. Each street's shops show the same goods (gold, caps of felt, quilts), and a soft wash of the
// trade's colour runs down the street. [street, colour, goods]
const PO_TRADES=[[3,[232,184,64],"gold"],[0,[188,74,58],"caps"],[2,[96,104,176],"quilts"]];
function po_paintAirTrade(ctx,i){wc_prep();const [si,col,kind]=PO_TRADES[i],[x0,z0,x1,z1,w]=PO_STREETS[si],Zc=PO_AIR.Zc,dx=x1-x0,dz=z1-z0,l=Math.hypot(dx,dz),N=[-dz/l,dx/l];
  const band=[[x0+N[0]*w,z0+N[1]*w],[x1+N[0]*w,z1+N[1]*w],[x1-N[0]*w,z1-N[1]*w],[x0-N[0]*w,z0-N[1]*w]].map(p=>po_air(p[0],0.05,p[1]+Zc));po_fill(ctx,band,col,0.6,700+i);
  for(const s of po_airShops()){if(s.si!==si)continue;const p=s.pts,R=wc_rng(s.seed+5),q=(u,v)=>[lerp(lerp(p.e[0],p.f[0],u),lerp(p.a0[0],p.b0[0],u),v),lerp(lerp(p.e[1],p.f[1],u),lerp(p.a0[1],p.b0[1],u),v)];
    // the goods laid out at the shop's front, under its awning
    for(let k=0;k<4;k++){const [gx,gy]=q(0.18+k*0.21,0.55),sz=Math.max(2.4,Math.hypot(p.b0[0]-p.a0[0],p.b0[1]-p.a0[1])*0.11);
      if(kind==="gold"){ctx.fillStyle=rgba([240,196,72],1);ctx.beginPath();ctx.arc(gx,gy,sz*0.8,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,252,230,0.95)";ctx.beginPath();ctx.arc(gx-sz*0.25,gy-sz*0.25,sz*0.3,0,TAU);ctx.fill();}
      if(kind==="caps"){const c=PO.felt[[2,0,2,4][k]];ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.ellipse(gx,gy,sz,sz*0.9,0,Math.PI,TAU);ctx.closePath();ctx.fill();ctx.fillStyle=rgba(wc_dim(c,0.2),1);ctx.fillRect(gx-sz,gy,sz*2,sz*0.3);}
      if(kind==="quilts"){const c=[[200,70,70],[70,110,170],[220,180,70],[60,140,110]][(k+(s.seed&3))%4];ctx.fillStyle=rgba(c,1);ctx.fillRect(gx-sz,gy-sz*1.1,sz*2,sz*2.2);ctx.strokeStyle="rgba(255,250,236,0.85)";ctx.lineWidth=0.8;
        ctx.strokeRect(gx-sz*0.6,gy-sz*0.7,sz*1.2,sz*1.4);}}}
  po_grain(ctx,0.5);}
// the market from above at a moment. o.g: how far the shops have spread (0 none, PO_K1461 the first, 1 all), each springing up from its
// foot as g passes its turn; o.crowd: how much of the crowd is out; o.trades: how far each trade's street has gathered (three, 0 to 1)
const PO_K1461=0.1;
function po_airAt(x,o){x.drawImage(gv_place("air"),0,0,W,H);const g=o.g||0;
  if(g>0){const L=po_airShops();x.save();x.beginPath();for(const s of L){const u=clamp((g-s.k)/0.03,0,1);if(u<=0)continue;const e=1-Math.pow(1-u,3);
      s.hull.forEach((p,i)=>{const y=s.foot-(s.foot-p[1])*e;i?x.lineTo(p[0],y):x.moveTo(p[0],y);});x.closePath();}x.clip();x.drawImage(gv_place("airShops"),0,0,W,H);x.restore();}
  if(o.crowd>0.01)withA(x,o.crowd,()=>x.drawImage(gv_place("airCrowd"),0,0,W,H));
  (o.trades||[]).forEach((a,i)=>{if(a>0.01)withA(x,a,()=>x.drawImage(gv_place("airTrade"+i),0,0,W,H));});
  x.drawImage(gv_place("airHall"),0,0,W,H);}
// where each trade's tag hangs: over the middle of its street, high above it
function po_tradeTagAt(i){const [si]=PO_TRADES[i],[x0,z0,x1,z1]=PO_STREETS[si];return po_air(lerp(x0,x1,0.55),16,lerp(z0,z1,0.55)+PO_AIR.Zc);}

/* ---------- 1461: the bedesten from its yard ---------- */
// at a person's height, across the open yard on a spring morning: the hall's long face runs away to the left from beyond the frame's
// right edge, its gate in the middle; the front row of domes rises over the parapet, the rows behind it just showing; the last of the
// builders' scaffold against the wall at the right, and a pile of its poles; the city beyond the hall's far end. A point on the face is u
// metres along it from its near end, Y up, and d into the wall (po_gtW)
const PO_GT={F:1250,ch:1.6,hz:690,x0:17,z0:16,th:0.52,L:44,h:11,gate:22,bays:[4.4,13.2,22,30.8,39.6]};
function po_gtW(u,Y,d){const C=PO_GT,c=Math.cos(C.th),s=Math.sin(C.th);d=d||0;return po_pj(C,C.x0-u*c+d*s,Y,C.z0+u*s+d*c);}
// a wall of the hall, seen close: courses of cut stone with three thin rows of brick between them every metre and a bit, the joints of
// the stones, the rain's streaks under the cornice, the damp at its foot. Q(u, Y, d) places a point on it; L long, h high; light: how
// much the morning sun is on it
function po_wallEye(ctx,Q,L,h,o){o=o||{};const face=[Q(0,0),Q(L,0),Q(L,h),Q(0,h)],col=o.light?wc_lit(PO.stone,0.04*o.light):PO.stone,cs=o.course||1.0,R=wc_rng(o.seed||71);
  wc_wash(ctx,face,col,{kind:"build",seed:o.seed||71,lw:1.6});ctx.save();wc_tr(ctx,face);ctx.clip();ctx.lineCap="round";
  // the stones: a course of blocks between each band of brick, long and staggered, each a shade of its own; their joints
  for(let Y=0.75-cs;Y<h;Y+=cs){const y0=Y+0.3,y1=Y+cs;let u=-R()*0.8;while(u<L){const w=0.55+R()*0.6,k=R();
      po_fill(ctx,[Q(u,y0),Q(u+w,y0),Q(u+w,y1),Q(u,y1)],k<0.3?[214,190,150]:k<0.55?[204,198,184]:k<0.7?[236,222,196]:col,0.32+R()*0.2,(u*31+Y*7)|0);
      const a=Q(u,y0),b=Q(u,y1);ctx.strokeStyle=rgba(wc_dim(PO.stone,0.34),0.38);ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();u+=w;}}
  // three rows of brick in each band, a little uneven: some stretches redder, some paler, the mortar between them
  for(let Y=0.75;Y<h-0.4;Y+=cs){for(let k=0;k<3;k++){const y=Y+k*0.095;for(let u=0;u<L;){const l=0.8+R()*1.6,c=mix(PO.brick,R()<0.5?[150,84,64]:[206,150,120],R()*0.6);
        po_fill(ctx,[Q(u,y),Q(Math.min(L,u+l),y),Q(Math.min(L,u+l),y+0.068),Q(u,y+0.068)],c,0.5+R()*0.28,(y*100+u*7)|0);u+=l;}}
    ctx.strokeStyle=rgba([236,226,204],0.45);ctx.lineWidth=0.8;for(let k=0;k<4;k++){const a=Q(0,Y-0.014+k*0.095),b=Q(L,Y-0.014+k*0.095);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
    ctx.strokeStyle=rgba(wc_dim(PO.brick,0.3),0.3);for(let u=R()*0.3;u<L;u+=0.28+R()*0.08){const k=(u*10|0)%3,a=Q(u,Y+k*0.095),b=Q(u,Y+k*0.095+0.068);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}
  // rain streaks from the cornice and the windows, the damp at the foot
  for(let i=0;i<90;i++){const u=R()*L,y=h-0.3-R()*1.6,l=0.8+R()*3,a=Q(u,y),b=Q(u+0.05,y-l);ctx.strokeStyle=rgba(wc_dim(PO.stone,0.24),0.13);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  const f0=Q(L/2,0),f1=Q(L/2,1.6),g=ctx.createLinearGradient(0,f1[1],0,f0[1]);g.addColorStop(0,"rgba(120,96,70,0)");g.addColorStop(1,"rgba(120,96,70,0.24)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // the cornice's shade along the top; the sun's warmth, stronger towards it, and big soft blooms where the paint pooled
  const c0=Q(L/2,h),c1=Q(L/2,h-1.4),gs=ctx.createLinearGradient(0,c0[1],0,c1[1]);gs.addColorStop(0,"rgba(110,90,70,0.2)");gs.addColorStop(1,"rgba(110,90,70,0)");ctx.fillStyle=gs;ctx.fillRect(0,0,W,H);
  if(o.light){const a=Q(L,0),b=Q(0,0),gl=ctx.createLinearGradient(a[0],0,b[0],0);gl.addColorStop(0,rgba([255,232,188],0.3*o.light));gl.addColorStop(0.6,rgba([255,232,188],0.08*o.light));gl.addColorStop(1,rgba([120,100,90],0.08*o.light));ctx.fillStyle=gl;ctx.fillRect(0,0,W,H);}
  ctx.globalAlpha=0.35;ctx.globalCompositeOperation="multiply";ctx.drawImage(wc_tint(WC.blotch,[214,196,170]),-((o.seed||71)%300),0,W+300,H);
  ctx.restore();
  // the cornice along the top, standing out a little
  po_fill(ctx,[Q(0,h-0.35,-0.25),Q(L,h-0.35,-0.25),Q(L,h,-0.25),Q(0,h,-0.25)],wc_lit(PO.stone,0.14),1,(o.seed||71)+5);
  po_line(ctx,[Q(0,h-0.35,-0.25),Q(L,h-0.35,-0.25),Q(L,h,-0.25),Q(0,h,-0.25)],1.2,0.55);
  // the high windows: small, arched, with iron bars, one in each bay
  (o.wins||[]).forEach(u=>{const ww=0.42,arc=[];for(let i=0;i<=12;i++){const a=Math.PI*i/12;arc.push(Q(u-ww*Math.cos(a),h-2.45+ww*Math.sin(a)));}const win=[Q(u-ww,h-3.7),Q(u+ww,h-3.7)].concat(arc.reverse());
    const fr=[Q(u-ww-0.2,h-3.9),Q(u+ww+0.2,h-3.9)];for(let i=0;i<=12;i++){const a=Math.PI*(1-i/12);fr.push(Q(u-(ww+0.2)*Math.cos(a),h-2.45+(ww+0.2)*Math.sin(a)));}po_fill(ctx,fr,wc_lit(PO.stone,0.16),1,(u*77)|0);
    po_fill(ctx,win,[64,56,54],0.94,(u*999)|0);ctx.strokeStyle=rgba(PO.iron,0.7);ctx.lineWidth=1.2;for(const q of [-0.2,0,0.2]){const m0=Q(u+q,h-3.7),m1=Q(u+q,h-2.1);ctx.beginPath();ctx.moveTo(m0[0],m0[1]);ctx.lineTo(m1[0],m1[1]);ctx.stroke();}
    po_line(ctx,fr,0.8,0.35);po_line(ctx,win,1,0.55);});
  if(o.gate!=null)po_gateEye(ctx,Q,o.gate,o);return face;}
// the gate: a tall arch in a frame of dressed stone, its voussoirs; inside, the passage through the wall, and the iron-clad doors swung
// back against it (we see the far one); beyond, the dim, warm hall. gw wide, springing at gs, gh to the top of its arch; deep: the wall
function po_gateEye(ctx,Q,u0,o){const gw=o.gw||4,gs=o.gs||4.4,r=gw/2,gh=gs+r,dp=o.deep||1.8,arc=d=>{const a=[];for(let i=0;i<=20;i++){const t=Math.PI*i/20;a.push(Q(u0-r*Math.cos(t),gs+r*Math.sin(t),d));}return a;};
  // the frame, standing out from the wall, a shade paler
  const fr=[Q(u0-r-0.9,0,-0.12),Q(u0+r+0.9,0,-0.12),Q(u0+r+0.9,gh+1.2,-0.12),Q(u0-r-0.9,gh+1.2,-0.12)];wc_wash(ctx,fr,wc_lit(PO.stone,0.16),{kind:"build",seed:181,lw:1.4});
  ctx.save();wc_tr(ctx,fr);ctx.clip();ctx.strokeStyle=rgba(wc_dim(PO.stone,0.3),0.32);ctx.lineWidth=1;for(let Y=0.6;Y<gh+1.2;Y+=0.6){const a=Q(u0-r-0.9,Y,-0.12),b=Q(u0+r+0.9,Y,-0.12);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  // the voussoirs round the arch, and the keystone
  ctx.strokeStyle=rgba(wc_dim(PO.stone,0.35),0.5);ctx.lineWidth=1.2;for(let i=0;i<=12;i++){const t=Math.PI*i/12,a=Q(u0-r*Math.cos(t),gs+r*Math.sin(t),-0.12),b=Q(u0-(r+0.7)*Math.cos(t),gs+(r+0.7)*Math.sin(t),-0.12);
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  const ko=[];for(let i=0;i<=20;i++){const t=Math.PI*i/20;ko.push(Q(u0-(r+0.7)*Math.cos(t),gs+(r+0.7)*Math.sin(t),-0.12));}po_line(ctx,ko,1.1,0.5,false);
  // the opening: the passage, its floor of stone, the dim hall beyond with light from above, and the far side of the passage
  const op=[Q(u0-r,0,-0.12),Q(u0+r,0,-0.12)].concat(arc(-0.12).reverse());ctx.save();wc_tr(ctx,op);ctx.clip();
  const b=wc_bbox(op);ctx.fillStyle=rgba([70,58,50],1);ctx.fillRect(b.x0-2,b.y0-2,b.w+4,b.h+4);
  const far=[Q(u0-r,0,dp),Q(u0+r,0,dp)].concat(arc(dp).reverse());po_fill(ctx,far,[96,76,60],1,183);wc_glowAt(ctx,(b.x0+b.x1)/2,b.y0+b.h*0.62,b.w*0.55,[236,180,110],0.5);
  // inside, far off: a pier, and light falling from a dome's window on a shelf of silk
  const fb=wc_bbox(far);po_fill(ctx,[[fb.x0+fb.w*0.62,fb.y1],[fb.x0+fb.w*0.8,fb.y1],[fb.x0+fb.w*0.8,fb.y0+fb.h*0.2],[fb.x0+fb.w*0.62,fb.y0+fb.h*0.2]],[70,58,50],0.8,182);
  for(let i=0;i<8;i++){const c=PO.silk[i%6],bx=fb.x0+fb.w*(0.16+(i%4)*0.1),by=fb.y0+fb.h*(0.58+Math.floor(i/4)*0.07);ctx.fillStyle=rgba(wc_dim(c,0.35),0.7);ctx.beginPath();ctx.arc(bx,by,fb.w*0.04,0,TAU);ctx.fill();}
  po_fill(ctx,[Q(u0-r,0,-0.12),Q(u0+r,0,-0.12),Q(u0+r,0,dp),Q(u0-r,0,dp)],[176,160,134],1,184);
  po_fill(ctx,[Q(u0+r,0,-0.12),Q(u0+r,0,dp),Q(u0+r,gs,dp),Q(u0+r,gs,-0.12)],[120,104,90],0.95,185);
  // the far door, swung back against the passage: oak, clad in iron, bands across it and rows of studs; its top follows the arch
  const lf=(v,Y)=>Q(u0+r-0.1,Y,v),top=[];for(let i=0;i<=10;i++){const v=i/10*gw/2;top.push(lf(v+0.05,gs+Math.sqrt(Math.max(0,r*r-(r-v)*(r-v)))));}
  const leaf=[lf(0.05,0),lf(gw/2+0.05,0)].concat(top.reverse());po_fill(ctx,leaf,[96,74,58],1,186);ctx.save();wc_tr(ctx,leaf);ctx.clip();
  for(let k=1;k<=6;k++){const Y=k*gh/7,a=lf(0,Y),c=lf(gw/2+0.1,Y),a2=lf(0,Y+0.16),c2=lf(gw/2+0.1,Y+0.16);po_fill(ctx,[a,c,c2,a2],PO.iron,0.88,187+k);
    ctx.fillStyle=rgba([150,150,156],0.8);for(let j=1;j<6;j++){const p=lf(j*gw/12,Y+0.08);ctx.beginPath();ctx.arc(p[0],p[1],1.6,0,TAU);ctx.fill();}}ctx.restore();po_line(ctx,leaf,1,0.5);
  ctx.restore();po_line(ctx,op,1.3,0.65,false);}
// the yard: earth, trodden paler on the way to the gate; dust and chips of stone; a cut block or two left over, a heap of sand, a
// mortar trough; the last scaffold against the wall, and a pile of its poles
function po_paintGate(ctx){const C=PO_GT,Q=po_gtW,R=wc_rng(611);wc_sky(ctx,C.hz-40,61,{sun:[230,250],cx:120,cw:900,cy:70,ch:160,clouds:4});
  // the city beyond the hall's far end: plaster and wooden houses on a slope, roofs of tile, cypresses, a far hill
  wc_land(ctx,x=>C.hz-70+18*Math.sin(x/210+0.4)+8*Math.sin(x/77),[196,200,170],0.3,{seed:613,line:false});
  const hs=[];for(let i=0;i<46;i++){const X=-130+R()*150,Z=70+R()*120;hs.push([X,Z]);}hs.sort((a,b)=>b[1]-a[1]).forEach(([X,Z],i)=>{const w=6+R()*5,hh=4+R()*4,[x0,y0]=po_pj(C,X,0,Z),k=po_ppm(C,Z),y=y0-(1.4+R()*0.6)*k*2.4;
    if(x0>480)return;const wall=PO_HOUSE[i%PO_HOUSE.length],tile=PO_TILES[i%4];po_fill(ctx,[[x0,y],[x0+w*k,y],[x0+w*k,y-hh*k],[x0,y-hh*k]],wc_haze(wall,0.5),1,640+i);
    po_fill(ctx,[[x0-0.4*k,y-hh*k],[x0+(w+0.4)*k,y-hh*k],[x0+(w-1.6)*k,y-(hh+1.6)*k],[x0+1.6*k,y-(hh+1.6)*k]],wc_haze(tile,0.5),1,700+i);
    if(R()<0.4){const cx=x0+R()*w*k,ch=(7+R()*5)*k;po_fill(ctx,[[cx-0.7*k,y],[cx+0.7*k,y],[cx+0.2*k,y-ch],[cx,y-ch-0.6*k],[cx-0.2*k,y-ch]],wc_haze(PO.cypress,0.6),1,760+i);}});
  po_grain(ctx,0.5);
  // the domes: the rows behind first, each on its drum over the roof; the front row last, rising over the parapet
  const Pd=(u,Y,v)=>Q(u,Y,v);for(let j=2;j>=0;j--)for(const u of C.bays)po_dome(ctx,Pd,u,5+j*10,C.h,3.6,0.9,{seed:620+j*5+u|0,k:0.72,left:true,seams:0.16});
  // the long face, its high windows and its gate
  po_wallEye(ctx,Q,C.L,C.h,{wins:C.bays.filter(u=>u!==C.gate),gate:C.gate,seed:631,light:1});
  // aerial haze: the far end paler
  ctx.save();const fa=Q(C.L,0),ne=Q(0,0),hz=ctx.createLinearGradient(fa[0],0,fa[0]+700,0);hz.addColorStop(0,rgba(WC_PAPER,0.3));hz.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=hz;ctx.fillRect(0,0,W,C.hz+60);ctx.restore();
  // the ground
  wc_wash(ctx,[[-60,C.hz-6],[W+60,C.hz-6],[W+60,H+60],[-60,H+60]],[222,204,166],{kind:"ground",seed:641,line:false});
  const foot=[];for(let i=0;i<=20;i++)foot.push(Q(C.L*i/20,0));po_fill(ctx,foot.concat([[foot[20][0],foot[20][1]+6],[foot[0][0],foot[0][1]+14]]),[150,124,96],0.28,642);
  // the trodden way to the gate, and the worn ground before it
  const gp=Q(C.gate,0),tw=[];for(let i=0;i<=16;i++){const v=i/16,y=lerp(gp[1]+4,H+40,v*v),hw=lerp(60,640,v*v)+Math.sin(i*1.7)*14;tw.push([gp[0]-hw*1.1-v*v*260,y]);}
  for(let i=16;i>=0;i--){const v=i/16,y=lerp(gp[1]+4,H+40,v*v),hw=lerp(60,560,v*v)+Math.cos(i*1.3)*12;tw.push([gp[0]+hw-v*v*260,y]);}
  // lifted, as with a damp brush: the paper shows through where feet have worn the earth
  ctx.save();ctx.filter="blur(10px)";wc_tr(ctx,tw);ctx.fillStyle=rgba([250,244,230],0.45);ctx.fill();ctx.filter="none";ctx.restore();
  // stones, chips and tufts across the yard
  for(let i=0;i<160;i++){const X=-24+R()*44,Z=5+R()*26,[x,y]=po_pj(C,X,0,Z),k=po_ppm(C,Z);if(y<C.hz+4)continue;const r=(0.04+R()*0.12)*k;
    ctx.fillStyle=rgba(R()<0.5?[196,180,150]:[176,160,130],0.7);ctx.beginPath();ctx.ellipse(x,y,r*1.4,r*0.6,0,0,TAU);ctx.fill();}
  for(let i=0;i<40;i++){const X=-24+R()*40,Z=6+R()*22,[x,y]=po_pj(C,X,0,Z),k=po_ppm(C,Z);ctx.strokeStyle=rgba([150,150,96],0.5);ctx.lineWidth=1;for(let j=0;j<4;j++){ctx.beginPath();ctx.moveTo(x+j*0.04*k,y);ctx.lineTo(x+(j-1.5)*0.06*k,y-0.12*k);ctx.stroke();}}
  // the scaffold still against the wall, near the corner: two standards, a ledger and a brace, lashed with rope
  for(const u of [6.6,10.4]){const a=Q(u,0,-0.6),b=Q(u,8.2,-0.6),w=Math.max(3,po_ppm(C,po_pjZ(u))*0.12);po_fill(ctx,[[a[0]-w/2,a[1]],[a[0]+w/2,a[1]],[b[0]+w/2,b[1]],[b[0]-w/2,b[1]]],PO.woodLt,1,650+u|0);po_line(ctx,[[a[0]-w/2,a[1]],[a[0]+w/2,a[1]],[b[0]+w/2,b[1]],[b[0]-w/2,b[1]]],0.8,0.45);}
  for(const [u0,y0,u1,y1] of [[6.2,5.4,10.8,5.4],[6.6,0.6,10.4,5.4]]){const a=Q(u0,y0,-0.65),b=Q(u1,y1,-0.65);ctx.strokeStyle=rgba(PO.woodDk,0.9);ctx.lineWidth=Math.max(3,Math.hypot(b[0]-a[0],b[1]-a[1])*0.012);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
    ctx.strokeStyle=rgba(wc_lit(PO.woodLt,0.2),0.8);ctx.lineWidth*=0.4;ctx.beginPath();ctx.moveTo(a[0],a[1]-2);ctx.lineTo(b[0],b[1]-2);ctx.stroke();}
  for(const u of [6.6,10.4]){const p=Q(u,5.4,-0.65);ctx.strokeStyle=rgba([214,196,150],0.95);ctx.lineWidth=3;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(p[0]-7,p[1]-6+k*4);ctx.lineTo(p[0]+7,p[1]-2+k*4);ctx.stroke();}}
  // a heap of sand, a mortar trough, and two cut blocks left over
  {const [x,y]=po_pj(C,4.6,0,14.5),k=po_ppm(C,14.5);wc_contact(ctx,x-1.8*k,x+1.8*k,y+2,1,0.25);po_q(ctx,[[x-1.7*k,y],[x+1.7*k,y],[x+0.9*k,y-0.5*k],[x+0.1*k,y-0.72*k],[x-0.8*k,y-0.5*k]],[226,202,150],{kind:"thing",seed:652});
    const [tx,ty]=po_pj(C,1.4,0,15.5),tk=po_ppm(C,15.5);po_q(ctx,[[tx-1*tk,ty],[tx+1*tk,ty],[tx+1.08*tk,ty-0.36*tk],[tx-1.08*tk,ty-0.36*tk]],PO.woodDk,{kind:"thing",seed:653});po_fill(ctx,[[tx-0.98*tk,ty-0.36*tk],[tx+0.98*tk,ty-0.36*tk],[tx+0.9*tk,ty-0.44*tk],[tx-0.9*tk,ty-0.44*tk]],[214,206,192],1,654);}
  for(const [X,Z,w,hh,sd] of [[-8.6,11.5,1.1,0.55,655],[-6.9,12.4,0.9,0.5,656]]){const [x,y]=po_pj(C,X,0,Z),k=po_ppm(C,Z);wc_contact(ctx,x-w*0.7*k,x+w*0.7*k,y+2,1,0.3);
    po_q(ctx,[[x-w/2*k,y],[x+w/2*k,y],[x+w/2*k,y-hh*k],[x-w/2*k,y-hh*k]],wc_lit(PO.stone,0.04),{kind:"thing",seed:sd});po_fill(ctx,[[x-w/2*k,y-hh*k],[x+w/2*k,y-hh*k],[x+(w/2+0.18)*k,y-(hh+0.16)*k],[x-(w/2-0.18)*k,y-(hh+0.16)*k]],wc_lit(PO.stone,0.18),1,sd+9);}
  // the pile of poles, taken down, at the right
  for(let i=0;i<9;i++){const Z=9.6+i*0.13+(i%3)*0.05,Y=0.12+Math.floor(i/3)*0.16,a=po_pj(C,6.2+(i%2)*0.3,Y,Z+0.6),b=po_pj(C,13.5+(i%3)*0.4,Y,Z-0.4),w=po_ppm(C,Z)*0.13;
    ctx.strokeStyle=rgba(wc_dim(PO.woodLt,0.12+(i%3)*0.06),1);ctx.lineWidth=w;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
    ctx.strokeStyle=rgba(WC_INK,0.35);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a[0],a[1]+w/2);ctx.lineTo(b[0],b[1]+w/2);ctx.stroke();ctx.fillStyle=rgba(wc_lit(PO.woodLt,0.25),1);ctx.beginPath();ctx.ellipse(b[0],b[1],w*0.3,w/2,0,0,TAU);ctx.fill();}
  po_grain(ctx,0.25);}
// how far a point on the face is from the camera (for sizes along it)
const po_pjZ=u=>PO_GT.z0+u*Math.sin(PO_GT.th);

/* ---------- people walking in depth ---------- */
// walking with something held in both arms, or a pole on the shoulder: the legs and the free arm swing, the held arms stay
Object.assign(POSE,{
  po_hold:{L:[0.16,-2.05],R:[0.16,-2.05],feet:24,shift:0,tilt:0,turn:0,gaze:[0.2,0],look:0},
  po_holdA:{L:[0.16,-2.05],R:[0.16,-2.05],feet:14,shift:-5,tilt:0.03,turn:0.06,gaze:[0.3,0],look:0},
  po_holdB:{L:[0.16,-2.05],R:[0.16,-2.05],feet:14,shift:5,tilt:-0.03,turn:0.06,gaze:[0.3,0],look:0},
  po_poleA:{L:[0.34,0.3],R:[0.55,3.0],feet:14,shift:-5,tilt:0.03,turn:0.06,gaze:[0.3,0],look:0},
  po_poleB:{L:[-0.26,-0.32],R:[0.55,3.0],feet:14,shift:5,tilt:-0.03,turn:0.06,gaze:[0.3,0],look:0},
  // sitting at work, stitching felt in the lap; the hand that pulls the thread up
  po_stitch:{L:[0.22,-1.3],R:[0.3,-1.36],feet:20,shift:0,tilt:0.08,turn:0.05,gaze:[0.2,1.2],look:1},
  po_stitchUp:{L:[0.22,-1.3],R:[0.58,-2.6],feet:20,shift:0,tilt:0.05,turn:0.05,gaze:[0.4,0.8],look:1},
  // holding something up to look at it, then a nod over it
  po_holdNod:{L:[0.16,-2.05],R:[0.16,-2.05],feet:24,shift:0,tilt:0.1,turn:0.06,gaze:[0.3,1.3],look:1}
});
// someone walking on the ground of a level camera C, from (X0, Z0) to (X1, Z1), from t0, at v metres a second: where their feet are on
// the frame and how big they are, the step's bob and swing, when they arrive, which way they face
function po_stroll(C,t,t0,X0,Z0,X1,Z1,v,h){const L=Math.hypot(X1-X0,Z1-Z0),T_=Math.max(0.3,L/(v||1.3)),u=clamp((t-t0)/T_,0,1),moving=u>0&&u<1,ph=(t-t0)*Math.PI*3.2,
    e=u<0.06?u*u/0.12:u>0.94?1-(1-u)*(1-u)/0.12:u-0.03,X=lerp(X0,X1,e),Z=lerp(Z0,Z1,e),p=po_at(C,X,Z,h);
  return{x:p.x,y:p.y,s:p.s,X,Z,moving,ph,swing:moving?Math.sin(ph):0,bob:moving?Math.abs(Math.sin(ph))*10*p.s:0,end:t0+T_,flip:X1<X0};}
// a person drawn where po_stroll puts them: walking (pose names A and B swing), or standing in pose o.pose once they stop
function po_walker(ctx,id,w,o){o=o||{};const A=o.walk||"walk",sw=w.swing;
  person(ctx,id,w.x,w.y-w.bob,w.s,Object.assign({},o,{pose:w.moving?(o.base||"stand"):(o.pose||o.base||"stand"),pose2:w.moving?(sw>0?A+"A":A+"B"):o.pose2,mix:w.moving?Math.abs(sw):o.mix,
    flip:o.flip!=null?o.flip:w.flip}));}
// seen from behind: bolts of silk carried in the arms in front, their ends showing either side; a chest on the left shoulder
function po_boltsBehind(cx,P_){const sw=P_.build.sh;[[-372,0],[-336,2],[-404,4]].forEach(([y,i],k)=>{const c=PO.silk[i],L=sw+78-k*8;
  cx.beginPath();cx.moveTo(-L,y-30);cx.lineTo(L,y-30);cx.quadraticCurveTo(L+14,y,L,y+30);cx.lineTo(-L,y+30);cx.quadraticCurveTo(-L-14,y,-L,y-30);cx.closePath();litFill(cx,c,-L,y-30,L,y+30);seam(cx,c,0.5);
  for(const sd of [-1,1]){cx.strokeStyle=rgba(lighten(c,0.3),0.6);cx.lineWidth=2;cx.beginPath();cx.ellipse(sd*L,y,7,22,0,0,TAU);cx.stroke();}});}
function po_chestShoulder(cx,P_){const sw=P_.build.sh,w=150,h=100,x0=-sw-62,y0=-560,c=PO.wood;cx.save();cx.translate(x0+w/2,y0+h/2);cx.rotate(-0.06);
  cx.beginPath();cx.rect(-w/2,-h/2+18,w,h-18);litFill(cx,c,-w/2,-h/2,w/2,h/2);seam(cx,c,0.6);cx.beginPath();cx.moveTo(-w/2,-h/2+18);cx.quadraticCurveTo(0,-h/2-12,w/2,-h/2+18);cx.closePath();
  litFill(cx,lighten(c,0.08),-w/2,-h/2-12,w/2,-h/2+18);seam(cx,c,0.6);cx.fillStyle=rgba(PO.iron,0.9);for(const bx of [-w/2+16,w/2-24])cx.fillRect(bx,-h/2+4,8,h-4);cx.fillRect(-w/2,-h/2+16,w,6);cx.restore();}

/* ---------- 1461: inside the bedesten ---------- */
// at a person's height, inside, facing a wall: the arch of one bay rising out of the frame between its pilasters; the wall under it
// lined with two rows of wooden cupboards, iron-hasped and locked, where merchants kept gold, silver, money and papers; a high window
// letting in a shaft of the morning; at the left, a rack with bolts of silk and velvet; at the right, a goldsmith's low table and his
// tray. A plane facing us, Z metres away, is drawn with po_pj (PO_IN)
const PO_IN={F:1000,ch:1.6,hz:780,Z:10,cup:[1.1,1.6,0.5,2.25]};
function po_paintHallIn(ctx){const C=PO_IN,Z=C.Z,P=(X,Y,z)=>po_pj(C,X,Y,z==null?Z:z),R=wc_rng(671);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  // the wall: stone and brick, dim; the pilasters and the arch over the bay; the wall of the next bays either side
  const wall=[P(-14,0),P(14,0),P(14,12),P(-14,12)];wc_wash(ctx,wall,[198,180,150],{kind:"plaster",seed:672,line:false});
  ctx.save();wc_tr(ctx,wall);ctx.clip();for(let Y=0.75;Y<12;Y+=1.0)for(let k=0;k<3;k++){const y=Y+k*0.095;po_fill(ctx,[P(-14,y),P(14,y),P(14,y+0.068),P(-14,y+0.068)],[160,96,74],0.45,(y*100)|0);}
  for(let Y=-0.25;Y<12;Y+=1.0){let X=-14-R();while(X<14){const w=0.55+R()*0.6;const a=P(X,Y+0.3),b=P(X,Y+1.0);ctx.strokeStyle=rgba([150,130,104],0.35);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();X+=w;}}ctx.restore();
  // the arch of the bay: its soffit, deep, and the pilasters it springs from; the arch of each bay beside it
  for(const cx of [-9.2,0,9.2]){const r=4.0,sp=5.2,arc=[],arc2=[];for(let i=0;i<=24;i++){const a=Math.PI*i/24;arc.push(P(cx-r*Math.cos(a),sp+r*Math.sin(a)));arc2.push(P(cx-(r+0.7)*Math.cos(a),sp+(r+0.7)*Math.sin(a),Z-0.6));}
    po_q(ctx,arc2.concat(arc.slice().reverse()),[196,172,138],{seed:673+cx|0,lw:1.3});
    ctx.strokeStyle=rgba([120,100,80],0.45);ctx.lineWidth=1.3;for(let i=1;i<14;i++){const a=Math.PI*i/14,p=P(cx-r*Math.cos(a),sp+r*Math.sin(a)),q=P(cx-(r+0.7)*Math.cos(a),sp+(r+0.7)*Math.sin(a),Z-0.6);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}}
  for(const X of [-4.6,4.6,-13.8,13.8]){const pl=[P(X-0.7,0,Z-0.6),P(X+0.7,0,Z-0.6),P(X+0.7,5.2,Z-0.6),P(X-0.7,5.2,Z-0.6)];po_q(ctx,pl,[206,188,158],{seed:680+X|0,lw:1.4});
    ctx.save();wc_tr(ctx,pl);ctx.clip();for(let Y=0.75;Y<5.2;Y+=1.0)po_fill(ctx,[P(X-0.7,Y,Z-0.6),P(X+0.7,Y,Z-0.6),P(X+0.7,Y+0.26,Z-0.6),P(X-0.7,Y+0.26,Z-0.6)],[166,98,74],0.5,(X*10+Y*10)|0);ctx.restore();
    po_fill(ctx,[P(X-0.85,5.0,Z-0.65),P(X+0.85,5.0,Z-0.65),P(X+0.85,5.3,Z-0.65),P(X-0.85,5.3,Z-0.65)],[220,206,180],1,690+X|0);}
  // a high window in the bay, and the light it lets in
  const wn=[];for(let i=0;i<=12;i++){const a=Math.PI*i/12;wn.push(P(-0.45*Math.cos(a),7.6+0.45*Math.sin(a)));}const win=[P(-0.45,6.4),P(0.45,6.4)].concat(wn.reverse());po_fill(ctx,win,[252,240,210],1,691);po_line(ctx,win,1.2,0.6);
  ctx.strokeStyle=rgba(PO.iron,0.8);ctx.lineWidth=2;for(const q of [-0.18,0,0.18]){const a=P(q,6.4),b=P(q,8.0);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  // the stone floor in slabs, going away to the wall; a little light on it
  const fl=[P(-14,0,0.6),P(14,0,0.6),P(14,0),P(-14,0)];wc_wash(ctx,[[-60,P(0,0)[1]],[W+60,P(0,0)[1]],[W+60,H+60],[-60,H+60]],[186,170,146],{kind:"ground",seed:692,line:false});
  ctx.save();ctx.strokeStyle=rgba([130,114,94],0.35);ctx.lineWidth=1.2;for(let X=-14;X<=14;X+=1.2){const a=P(X,0),b=P(X*Z/1.2,0,1.2);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  for(let z=Z;z>1.4;z-=1.2){const a=P(-30,0,z),b=P(30,0,z);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  // the stone bench along the wall, and the cupboards on it in two rows: oak, each with an iron hasp and a lock
  const [cw,ch,y0,y1]=C.cup;po_q(ctx,[P(-14,0,Z-0.5),P(14,0,Z-0.5),P(14,y0,Z-0.5),P(-14,y0,Z-0.5)],[214,198,170],{seed:693,lw:1.3});
  for(const Y of [y0,y1])for(let X=-13.2;X<13.2;X+=cw+0.08){if(Math.abs(Math.abs(X+cw/2)-4.6)<0.8||Math.abs(Math.abs(X+cw/2)-13.8)<0.8)continue;
    const d=[P(X,Y),P(X+cw,Y),P(X+cw,Y+ch),P(X,Y+ch)],c=mix(PO.wood,[138,98,66],R()*0.6);po_fill(ctx,d,c,1,(X*13+Y*7)|0);
    po_fill(ctx,[P(X+0.08,Y+0.08),P(X+cw-0.08,Y+0.08),P(X+cw-0.08,Y+ch-0.08),P(X+0.08,Y+ch-0.08)],wc_lit(c,0.08),1,(X*17+Y*5)|0);po_line(ctx,d,1,0.5);
    const hp=P(X+cw/2,Y+ch*0.55),k=po_ppm(C,Z);ctx.fillStyle=rgba(PO.iron,0.95);ctx.fillRect(hp[0]-0.04*k,hp[1]-0.16*k,0.08*k,0.3*k);ctx.strokeStyle=rgba(PO.iron,1);ctx.lineWidth=Math.max(1.5,0.03*k);
    ctx.beginPath();ctx.arc(hp[0],hp[1]+0.2*k,0.07*k,Math.PI,0);ctx.stroke();ctx.fillStyle=rgba([90,84,80],1);ctx.fillRect(hp[0]-0.08*k,hp[1]+0.2*k,0.16*k,0.14*k);
    for(const q of [0.18,0.82]){const a=P(X+0.04,Y+ch*q),b=P(X+0.22,Y+ch*q);ctx.strokeStyle=rgba(PO.iron,0.8);ctx.lineWidth=Math.max(1.5,0.025*k);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}
  po_grain(ctx,0.4);
  // the dimness of the hall, and the shaft of light from the window down across the floor
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle="rgba(188,160,132,0.55)";ctx.fillRect(0,0,W,H);
  const dg=ctx.createRadialGradient(1060,620,160,960,560,1150);dg.addColorStop(0,"rgba(90,64,50,0)");dg.addColorStop(1,"rgba(90,64,50,0.5)");ctx.fillStyle=dg;ctx.fillRect(0,0,W,H);ctx.restore();
  po_fill(ctx,win,[255,246,220],1,691);
  ctx.save();ctx.filter="blur(14px)";const w0=P(-0.4,7.2),w1=P(0.4,7.2),f0=P(3.2,0,6.4),f1=P(5.6,0,6.4);const sh=ctx.createLinearGradient(w0[0],w0[1],(f0[0]+f1[0])/2,f0[1]);
  sh.addColorStop(0,"rgba(255,242,210,0.7)");sh.addColorStop(1,"rgba(255,242,210,0.22)");ctx.fillStyle=sh;ctx.beginPath();ctx.moveTo(w0[0],w0[1]);ctx.lineTo(w1[0],w1[1]);ctx.lineTo(f1[0],f1[1]);ctx.lineTo(f0[0],f0[1]);ctx.closePath();ctx.fill();
  ctx.filter="none";ctx.restore();const sp=P(4.4,0,6.4);wc_glowAt(ctx,sp[0],sp[1],220,[255,236,196],0.3);
  ctx.strokeStyle=rgba(PO.iron,0.85);ctx.lineWidth=2.4;for(const q of [-0.18,0,0.18]){const a=P(q,6.4),b=P(q,8.0);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}po_line(ctx,win,1.2,0.6);}
// the things nearer than the merchants, drawn after them: the rack of silk and velvet at the left, and the goldsmith's low table, his
// tray of rings, cups and coins, and a small balance, at the right
function po_paintHallInFront(ctx){const C=PO_IN,P=(X,Y,z)=>po_pj(C,X,Y,z),R=wc_rng(701);wc_prep();
  // the rack: two uprights, three shelves, bolts on each, their ends to us
  const rz=5.6,k=po_ppm(C,rz);for(const X of [-6.2,-3.4]){const a=P(X,0,rz),b=P(X,2.4,rz);po_q(ctx,[[a[0]-0.05*k,a[1]],[a[0]+0.05*k,a[1]],[b[0]+0.05*k,b[1]],[b[0]-0.05*k,b[1]]],PO.woodDk,{kind:"thing",seed:702+X|0});}
  wc_contact(ctx,P(-6.4,0,rz)[0],P(-3.2,0,rz)[0],P(0,0,rz)[1]+2,1,0.3);
  [0.35,1.15,1.95].forEach((Y,j)=>{const a=P(-6.3,Y,rz),b=P(-3.3,Y,rz);po_q(ctx,[[a[0],a[1]],[b[0],b[1]],[b[0],b[1]+0.06*k],[a[0],a[1]+0.06*k]],PO.wood,{kind:"thing",seed:705+j});
    for(let i=0;i<7;i++){const c=PO.silk[(i*5+j*3)%6],r=0.19*k,cx=a[0]+(0.22+i*0.4)*k,cy=a[1]-r*0.98;wc_wash(ctx,wc_ell(cx,cy,r,r*0.96,22),c,{kind:"thing",lw:1,seed:710+i+j*9});
      ctx.strokeStyle=rgba(wc_lit(c,0.35),0.6);ctx.lineWidth=1.4;for(const q of [0.66,0.36]){ctx.beginPath();ctx.ellipse(cx,cy,r*q,r*q*0.96,0,0,TAU);ctx.stroke();}
      ctx.fillStyle=rgba(wc_dim(c,0.4),1);ctx.beginPath();ctx.arc(cx,cy,r*0.1,0,TAU);ctx.fill();}});
  // a length of silk unrolled from the middle shelf, hanging in folds
  {const a=P(-4.1,1.15,rz),b=P(-3.55,1.15,rz),c=PO.silk[0],f=[];for(let i=0;i<=10;i++){const v=i/10;f.push([lerp(b[0],b[0]+0.06*k,v)+Math.sin(v*9)*0.03*k,lerp(b[1],P(0,0.3,rz)[1],v)]);}
    const pts=[a].concat(f).concat([[a[0]+0.02*k,f[10][1]]]);wc_wash(ctx,pts,c,{kind:"thing",lw:1.1,seed:719});ctx.save();wc_tr(ctx,pts);ctx.clip();ctx.strokeStyle=rgba(wc_lit(c,0.35),0.5);ctx.lineWidth=0.04*k;
    for(const q of [0.3,0.65]){ctx.beginPath();ctx.moveTo(lerp(a[0],b[0],q),a[1]);ctx.lineTo(lerp(a[0],b[0],q)+0.03*k,f[10][1]);ctx.stroke();}ctx.restore();}
  // the goldsmith's table: low, with a cloth over it, and his things on it
  const tz=4.8,tk=po_ppm(C,tz),tl=P(1.9,0.42,tz),tr=P(4.0,0.42,tz),bl=P(1.9,0.42,tz+0.8),br=P(4.0,0.42,tz+0.8);
  for(const X of [2.0,3.9]){const a=P(X,0,tz),b=P(X,0.4,tz);po_fill(ctx,[[a[0]-0.04*tk,a[1]],[a[0]+0.04*tk,a[1]],[b[0]+0.04*tk,b[1]],[b[0]-0.04*tk,b[1]]],PO.woodDk,1,720+X|0);}
  wc_contact(ctx,tl[0]-10,tr[0]+10,P(0,0,tz)[1]+2,1,0.3);po_q(ctx,[tl,tr,br,bl],[160,44,52],{kind:"thing",seed:722});po_q(ctx,[tl,tr,P(4.05,0.24,tz),P(1.85,0.24,tz)],[140,36,46],{kind:"thing",seed:723});
  // the tray: copper, round, and on it rings, two cups, a little heap of coins
  const tc=P(2.8,0.43,tz+0.4);wc_wash(ctx,wc_ell(tc[0],tc[1],0.56*tk,0.16*tk,30),[196,128,76],{kind:"thing",lw:1.2,seed:724});wc_wash(ctx,wc_ell(tc[0],tc[1]-2,0.46*tk,0.12*tk,30),[214,150,96],{kind:"thing",lw:0.8,seed:725});
  for(let i=0;i<9;i++){const x=tc[0]+(R()-0.5)*0.5*tk,y=tc[1]-2+(R()-0.5)*0.1*tk;ctx.fillStyle=rgba(PO.gold,1);ctx.beginPath();ctx.ellipse(x,y,0.03*tk,0.012*tk,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,250,224,0.9)";ctx.fillRect(x-0.01*tk,y-0.006*tk,0.01*tk,0.004*tk);}
  for(const [dx,h] of [[-0.24,0.16],[0.2,0.13]]){const x=tc[0]+dx*tk,y=tc[1]-0.02*tk;po_q(ctx,[[x-0.06*tk,y],[x+0.06*tk,y],[x+0.08*tk,y-h*0.6*tk],[x+0.1*tk,y-h*tk],[x-0.1*tk,y-h*tk],[x-0.08*tk,y-h*0.6*tk]],PO.gold,{kind:"thing",lw:1,seed:727+dx*10|0});
    ctx.fillStyle="rgba(255,250,224,0.8)";ctx.fillRect(x-0.06*tk,y-h*0.9*tk,0.025*tk,h*0.6*tk);}
  for(let i=0;i<5;i++){const x=tc[0]+(0.02+i*0.05)*tk,y=tc[1]+0.04*tk;ctx.strokeStyle=rgba(PO.gold,1);ctx.lineWidth=Math.max(1.5,0.012*tk);ctx.beginPath();ctx.ellipse(x,y,0.022*tk,0.012*tk,0,0,TAU);ctx.stroke();}
  // a small balance at the table's end
  const bp=P(3.65,0.42,tz+0.3);ctx.strokeStyle=rgba([150,116,60],1);ctx.lineWidth=Math.max(2,0.015*tk);ctx.beginPath();ctx.moveTo(bp[0],bp[1]);ctx.lineTo(bp[0],bp[1]-0.36*tk);ctx.moveTo(bp[0]-0.22*tk,bp[1]-0.34*tk);ctx.lineTo(bp[0]+0.22*tk,bp[1]-0.34*tk);ctx.stroke();
  for(const s of [-1,1]){ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bp[0]+s*0.22*tk,bp[1]-0.34*tk);ctx.lineTo(bp[0]+s*0.22*tk,bp[1]-0.14*tk);ctx.stroke();wc_wash(ctx,wc_ell(bp[0]+s*0.22*tk,bp[1]-0.13*tk,0.07*tk,0.02*tk,16),[196,160,80],{kind:"thing",lw:0.8});}
  po_grain(ctx,0.3);}

/* ---------- a street of the market, at a person's height ---------- */
// looking along a street of shops: wooden shops either side, each raised on its platform, its lower shutter let down as a counter for
// its goods and its upper one propped up as a shade; a canvas stretched across the street here and there; houses beyond the shops'
// roofs; at the end, the city (the 1520s, looking away from the hall) or the bedesten's gate (the cap makers' street of the 1600s). X
// across, Y up, Z away (metres), the camera in the street's middle; the sun is high on the right, so the right-hand shops' fronts are in
// shade and their roofs' shadow lies along that side of the street
const PO_STR={F:1150,ch:1.6,hz:520,half:3.2,deep:2.7,z1:62};
const po_st=(X,Y,Z)=>po_pj(PO_STR,X,Y,Z);
// the shops either side, near to far: {s: side, z0, z1, kind}. In the 1600s the street is the cap makers': the master's stall is the
// near one on the left, the cloth seller's next to it; in the 1520s the goods are of every kind
const PO_KINDS=["caps","cloth","copper","slippers","spice","quilts","pots"];
function po_strShops(era){const R=wc_rng(era==="1600"?911:913),L=[];
  for(const s of [-1,1]){let z=s<0?4.5:3.0,i=0;while(z<PO_STR.z1-4){const w=s<0&&i<2?3.0:2.6+R()*0.9;
      const kind=era==="1600"?(s<0&&i===1?"cloth":R()<0.86?"caps":PO_KINDS[1+Math.floor(R()*3)]):(s<0&&i===0?"caps":s>0&&i===1?"cloth":PO_KINDS[Math.floor(R()*PO_KINDS.length)]);
      L.push({s,z0:z,z1:z+w,kind,seed:Math.floor(R()*1e6)});z+=w;i++;}
}
  return L;}
// goods: a few things of a kind, set out at (x, y) on the frame, k pixels a metre, w metres of shelf
function po_goods(ctx,kind,x,y,k,w,R){const n=Math.max(2,Math.round(w/0.34));
  for(let i=0;i<n;i++){const gx=x+(i+0.5)*w*k/n,c=PO.felt[i%5];
    if(kind==="caps"){const st=0.16*k;ctx.fillStyle=rgba(PO.woodDk,1);ctx.fillRect(gx-st*0.08,y-st,st*0.16,st);ctx.save();ctx.translate(gx,y-st);ctx.scale(k/420,k/420);po_capPaint(ctx,PO.felt[[2,0,4,2,1,3][(i+(R()*3|0))%6]],{turn:R()-0.5});ctx.restore();}
    else if(kind==="cloth"){if(i%2)continue;const h=0.06*k;for(let j=0;j<3;j++){const cc=mix(PO_CLOTH[(i+j*2+(R()*6|0))%6],[226,214,196],0.3),y0=y-j*h;
        po_fill(ctx,[[gx-0.16*k,y0],[gx+0.16*k,y0],[gx+0.16*k,y0-h+1],[gx-0.16*k,y0-h+1]],cc,1,(gx*7+j)|0);ctx.strokeStyle=rgba(wc_dim(cc,0.3),0.6);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx-0.16*k,y0-h*0.5);ctx.lineTo(gx+0.12*k,y0-h*0.5);ctx.stroke();}}
    else if(kind==="copper"){const r=(0.1+R()*0.05)*k;ctx.fillStyle=rgba([196,118,70],1);ctx.beginPath();ctx.ellipse(gx,y-r,r,r*0.9,0,0,TAU);ctx.fill();ctx.fillStyle=rgba([170,96,56],1);ctx.fillRect(gx-r*0.7,y-r*2.1,r*1.4,r*0.4);
      ctx.fillStyle="rgba(255,236,200,0.7)";ctx.beginPath();ctx.ellipse(gx-r*0.35,y-r*1.25,r*0.2,r*0.35,0.4,0,TAU);ctx.fill();}
    else if(kind==="slippers"){const cc=[[214,170,62],[176,52,48],[200,190,170]][i%3];ctx.fillStyle=rgba(cc,1);ctx.beginPath();ctx.moveTo(gx-0.12*k,y);ctx.quadraticCurveTo(gx-0.1*k,y-0.08*k,gx+0.06*k,y-0.07*k);ctx.quadraticCurveTo(gx+0.16*k,y-0.08*k,gx+0.14*k,y-0.12*k);
      ctx.quadraticCurveTo(gx+0.18*k,y-0.02*k,gx+0.1*k,y);ctx.closePath();ctx.fill();}
    else if(kind==="spice"){const cc=[[200,120,40],[176,60,40],[214,180,60],[120,110,60]][i%4],r=0.13*k;ctx.fillStyle=rgba([206,184,140],1);ctx.fillRect(gx-r,y-r*1.3,r*2,r*1.3);ctx.fillStyle=rgba(cc,1);ctx.beginPath();ctx.ellipse(gx,y-r*1.3,r*1.05,r*0.45,0,Math.PI,TAU);ctx.fill();}
    else if(kind==="quilts"){if(i%2)continue;const h=0.07*k;for(let j=0;j<3;j++){const cc=mix([[176,84,74],[84,104,140],[196,166,96],[96,128,104]][(i+j)%4],[226,214,196],0.45),y0=y-j*h;
        po_fill(ctx,[[gx-0.17*k,y0],[gx+0.17*k,y0],[gx+0.18*k,y0-h*0.5],[gx+0.16*k,y0-h+1],[gx-0.16*k,y0-h+1],[gx-0.18*k,y0-h*0.5]],cc,1,(gx*5+j)|0);ctx.strokeStyle=rgba(wc_dim(cc,0.3),0.45);ctx.lineWidth=1;ctx.setLineDash([3,3]);
        ctx.beginPath();ctx.moveTo(gx-0.13*k,y0-h*0.5);ctx.lineTo(gx+0.13*k,y0-h*0.5);ctx.stroke();ctx.setLineDash([]);}}
    else if(kind==="pots"){const r=(0.09+R()*0.04)*k;ctx.fillStyle=rgba([186,110,74],1);ctx.beginPath();ctx.moveTo(gx-r*0.4,y);ctx.quadraticCurveTo(gx-r*1.2,y-r,gx-r*0.5,y-r*1.9);ctx.lineTo(gx+r*0.5,y-r*1.9);ctx.quadraticCurveTo(gx+r*1.2,y-r,gx+r*0.4,y);ctx.closePath();ctx.fill();
      ctx.fillStyle="rgba(255,230,200,0.4)";ctx.fillRect(gx-r*0.55,y-r*1.2,r*0.18,r*0.7);}}}
// one shop: inside, its back wall, ceiling and raised floor, dim, and its far side wall facing us with shelves of goods; then its front:
// the platform's boards, the counter let down with goods on it in the light, the posts and lintel, the shutter propped up as a shade and
// the eave over it. The first shop of a row shows its near side wall. Far ones fade into the haze; the right-hand ones are in shade
function po_strShop(ctx,sh,first){const P=po_st,C=PO_STR,s=sh.s,X0=s*C.half,X1=s*(C.half+C.deep),z0=sh.z0,z1=sh.z1,R=wc_rng(sh.seed),wood=mix(PO.wood,[126,96,70],R()*0.5),
    dp=1-clamp((z0-8)/70,0,0.75),lit=(c,k)=>wc_haze(s>0?mix(wc_dim(c,0.24+(k||0)),[100,112,150],0.12):mix(wc_dim(c,k||0),[255,226,170],0.08),dp);
  // inside: dark at the back, the floor of the platform, the ceiling
  po_fill(ctx,[P(X1,0.7,z0),P(X1,0.7,z1),P(X1,2.9,z1),P(X1,2.9,z0)],lit([70,52,42]),1,sh.seed);
  po_fill(ctx,[P(X0,2.9,z0),P(X1,2.9,z0),P(X1,2.9,z1),P(X0,2.9,z1)],lit([64,48,40]),1,sh.seed+1);
  po_fill(ctx,[P(X0,0.7,z0),P(X1,0.7,z0),P(X1,0.7,z1),P(X0,0.7,z1)],lit([150,118,86]),1,sh.seed+2);
  // the far side wall, its shelves and goods, in the shop's shade
  const k=po_ppm(C,z1),pa=[P(X0,0.7,z1),P(X1,0.7,z1),P(X1,2.9,z1),P(X0,2.9,z1)];if(z1<16)wc_wash(ctx,pa,lit(wood,0.12),{kind:"build",seed:sh.seed+3,lw:1.1});else po_fill(ctx,pa,lit(wood,0.18),1,sh.seed+3);
  ctx.save();wc_tr(ctx,pa);ctx.clip();ctx.strokeStyle=rgba(wc_dim(wood,0.45),0.35);ctx.lineWidth=Math.max(0.6,k*0.008);for(let X=0.24;X<C.deep;X+=0.24){const a=P(s*(C.half+X),0.7,z1),b=P(s*(C.half+X),2.9,z1);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  for(const Y of [1.5,2.25]){const a=P(X0,Y,z1),b=P(X1,Y,z1);po_fill(ctx,[[a[0],a[1]],[b[0],b[1]],[b[0],b[1]+0.045*k],[a[0],a[1]+0.045*k]],lit(PO.woodDk),1,sh.seed+(Y*10|0));
    ctx.save();ctx.globalAlpha=0.85*dp;po_goods(ctx,sh.kind,Math.min(a[0],b[0])+0.12*k,a[1],k*0.8,(C.deep-0.3)/0.8,R);ctx.restore();}ctx.restore();
  // the shade inside, deepest at the back and under the ceiling
  ctx.save();ctx.globalCompositeOperation="multiply";const op=[P(X0,0.7,z0),P(X0,0.7,z1),P(X0,2.9,z1),P(X0,2.9,z0)],ob=wc_bbox(op),g=ctx.createLinearGradient(0,ob.y0,0,ob.y1);
  g.addColorStop(0,rgba([120,100,92],0.75));g.addColorStop(0.6,rgba([150,128,112],0.5));g.addColorStop(1,rgba([190,170,150],0.3));ctx.fillStyle=g;wc_tr(ctx,op);ctx.fill();ctx.restore();
  // the near side wall, where a row starts
  if(first){const nw=[P(X0,0,z0),P(X1+s*0.4,0,z0),P(X1+s*0.4,3.5,z0),P(X0,3.5,z0)];wc_wash(ctx,nw,lit([232,218,192]),{kind:"build",seed:sh.seed+12,lw:1.4});
    ctx.save();wc_tr(ctx,nw);ctx.clip();for(const Y of [0.9,1.9,2.9])for(let k=0;k<3;k++)po_fill(ctx,[P(X0,Y+k*0.09,z0),P(X1+s*0.4,Y+k*0.09,z0),P(X1+s*0.4,Y+k*0.09+0.06,z0),P(X0,Y+k*0.09+0.06,z0)],PO.brick,0.55,sh.seed+20+k);
      const a=P(X0,0.5,z0),b=P(X0,0,z0);const gg=ctx.createLinearGradient(0,a[1],0,b[1]);gg.addColorStop(0,"rgba(120,96,70,0)");gg.addColorStop(1,"rgba(120,96,70,0.25)");ctx.fillStyle=gg;ctx.fillRect(0,0,W,H);ctx.restore();}
  // the platform's front, boards; the counter let down from it, on its brackets, with goods in the light
  const pf=[P(X0,0,z0),P(X0,0,z1),P(X0,0.7,z1),P(X0,0.7,z0)];if(z0<16)wc_wash(ctx,pf,lit(wood,0.06),{kind:"build",seed:sh.seed+5,lw:1.1});else po_fill(ctx,pf,lit(wood,0.08),1,sh.seed+5);
  ctx.save();wc_tr(ctx,pf);ctx.clip();ctx.strokeStyle=rgba(wc_dim(wood,0.4),0.35);ctx.lineWidth=1;for(const Y of [0.23,0.46]){const a=P(X0,Y,z0),b=P(X0,Y,z1);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  const cX=X0-s*0.5,ct=[P(X0,0.68,z0+0.1),P(X0,0.68,z1-0.1),P(cX,0.68,z1-0.1),P(cX,0.68,z0+0.1)],ce=[P(cX,0.61,z0+0.1),P(cX,0.61,z1-0.1),P(cX,0.68,z1-0.1),P(cX,0.68,z0+0.1)];
  po_fill(ctx,ct,lit(wc_lit(wood,0.22)),1,sh.seed+6);po_fill(ctx,ce,lit(wood,0.25),1,sh.seed+7);if(dp>0.5)po_line(ctx,ct,0.8,0.35*dp);
  const n=Math.max(2,Math.round((z1-z0)/0.62));for(let i=0;i<n;i++){const z=lerp(z0+0.35,z1-0.35,(i+0.5)/n),g=P(X0-s*0.25,0.68,z),gk=po_ppm(C,z);ctx.save();ctx.globalAlpha=dp;po_goods(ctx,sh.kind,g[0]-0.16*gk,g[1],gk,0.32,R);ctx.restore();}
  // the posts at each end and the lintel
  for(const z of [z0,z1]){const a=P(X0,0,z),b=P(X0,3.1,z),q=po_ppm(C,z)*0.07;po_fill(ctx,[[a[0]-q,a[1]],[a[0]+q,a[1]],[b[0]+q,b[1]],[b[0]-q,b[1]]],lit(PO.woodDk),1,sh.seed+(z*10|0));}
  po_fill(ctx,[P(X0,2.9,z0),P(X0,2.9,z1),P(X0,3.1,z1),P(X0,3.1,z0)],lit(PO.woodDk),1,sh.seed+8);
  // the shutter propped out over the counter on its stick, its underside catching the light off the street; the eave over it
  const sX=X0-s*0.7,su=[P(X0,3.08,z0+0.06),P(X0,3.08,z1-0.06),P(sX,3.36,z1-0.06),P(sX,3.36,z0+0.06)];po_fill(ctx,su,lit(wc_lit(wood,0.1)),1,sh.seed+9);if(dp>0.5)po_line(ctx,su,0.8,0.35*dp);
  const ck=po_ppm(C,(z0+z1)/2),st0=P(cX+s*0.05,0.68,z1-0.3),st1=P(sX+s*0.04,3.34,z1-0.3);ctx.strokeStyle=rgba(lit(PO.woodDk),1);ctx.lineWidth=Math.max(1,ck*0.028);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(st0[0],st0[1]);ctx.lineTo(st1[0],st1[1]);ctx.stroke();
  const ev=[P(X0+s*0.1,3.46,z0),P(X0+s*0.1,3.46,z1),P(X0-s*0.25,3.46,z1),P(X0-s*0.25,3.46,z0)];po_fill(ctx,ev,lit([110,72,56]),1,sh.seed+10);
}
// the street at its far end: the city's houses round a small square (the 1520s), or the bedesten's face with its gate (the 1600s)
function po_strEnd(ctx,era){const C=PO_STR,P=po_st,Z=C.z1;
  if(era==="1600"){const Q=(u,Y,d)=>P(-22+u,Y,Z+(d||0));for(const u of [4.4,13.2,22,30.8,39.6])po_dome(ctx,(uu,Y,v)=>Q(uu,Y,v),u,5,11,3.6,0.9,{seed:930+u|0,k:0.72,left:false,seams:0.16});
    po_wallEye(ctx,Q,44,11,{wins:[4.4,13.2,30.8,39.6],gate:22,seed:931,light:0.6});return;}
  // houses: plaster below, wooden upper floors standing out over the street, tiled roofs; a cypress; the square's fountain
  const R=wc_rng(941);[[-16,Z+6,9,7.5],[-7,Z+4,7,9],[0.5,Z+9,8,7],[8,Z+5,7,8.5],[15,Z+7,9,7]].forEach(([X,z,w,h],i)=>{const wall=PO_HOUSE[(i*3)%7],tile=PO_TILES[i%4];
    po_q(ctx,[P(X,0,z),P(X+w,0,z),P(X+w,h*0.5,z),P(X,h*0.5,z)],wall,{seed:942+i,lw:1.2});po_q(ctx,[P(X-0.4,h*0.5,z-0.6),P(X+w+0.4,h*0.5,z-0.6),P(X+w+0.4,h,z-0.6),P(X-0.4,h,z-0.6)],mix(PO.woodLt,[200,180,150],0.5),{seed:950+i,lw:1.2});
    for(let j=0;j<Math.round(w/1.6);j++){const wx=X+0.5+j*1.6;po_fill(ctx,[P(wx,h*0.62,z-0.6),P(wx+0.8,h*0.62,z-0.6),P(wx+0.8,h*0.86,z-0.6),P(wx,h*0.86,z-0.6)],[96,84,76],0.85,960+i*9+j);}
    po_q(ctx,[P(X-0.9,h,z-1.0),P(X+w+0.9,h,z-1.0),P(X+w-1.5,h+2.4,z+2),P(X+1.5,h+2.4,z+2)],tile,{seed:970+i,lw:1.2});});
  for(const [cx,cz,hh] of [[-3.6,Z+12,13],[4.6,Z+14,11]]){const cp=P(cx,0,cz),ck=po_ppm(C,cz),pts=[];for(let i=0;i<=12;i++){const u=i/12,ww=1.1*ck*Math.sin(Math.PI*Math.pow(u,0.7))*(1-0.15*u);pts.push([cp[0]-ww,cp[1]-u*hh*ck]);}
    for(let i=12;i>=0;i--){const u=i/12,ww=1.1*ck*Math.sin(Math.PI*Math.pow(u,0.7))*(1-0.15*u);pts.push([cp[0]+ww,cp[1]-u*hh*ck]);}po_fill(ctx,pts,wc_haze(PO.cypress,0.6),1,975+cx|0);po_line(ctx,pts,0.7,0.3);}
  const fp=P(0,0,Z+2),fk=po_ppm(C,Z+2);po_q(ctx,[[fp[0]-1.2*fk,fp[1]],[fp[0]+1.2*fk,fp[1]],[fp[0]+1.2*fk,fp[1]-0.9*fk],[fp[0]-1.2*fk,fp[1]-0.9*fk]],wc_lit(PO.stone,0.1),{kind:"thing",seed:976});
  po_q(ctx,[[fp[0]-0.5*fk,fp[1]-0.9*fk],[fp[0]+0.5*fk,fp[1]-0.9*fk],[fp[0]+0.3*fk,fp[1]-2.0*fk],[fp[0]-0.3*fk,fp[1]-2.0*fk]],wc_lit(PO.stone,0.06),{kind:"thing",seed:977});}
// the houses over the shops' roofs, either side: plaster and wood, their upper floors and roofs
function po_strHouses(ctx){const C=PO_STR,P=po_st,R=wc_rng(981);for(const s of [-1,1])for(let z=58;z>24;z-=6+R()*4){const X=s*(C.half+C.deep+1.2),w=5+R()*3,h=6+R()*3,wall=wc_haze(PO_HOUSE[(z|0)%7],0.45),tile=wc_haze(PO_TILES[(z|0)%4],0.45);
    const f=[P(X,3,z),P(X,3,z+w),P(X,h,z+w),P(X,h,z)];po_fill(ctx,f,wc_dim(wall,s>0?0.12:0),1,(z*13)|0);
    for(let j=0;j<Math.floor(w/1.8);j++){const zz=z+0.6+j*1.8;po_fill(ctx,[P(X,h*0.6+1,zz),P(X,h*0.6+1,zz+0.8),P(X,h*0.6+2.1,zz+0.8),P(X,h*0.6+2.1,zz)],[96,84,76],0.8,(zz*31)|0);}
    po_fill(ctx,[P(X-s*0.5,h,z-0.4),P(X-s*0.5,h,z+w+0.4),P(X+s*2.5,h+2.2,z+w+0.4),P(X+s*2.5,h+2.2,z-0.4)],tile,1,(z*17)|0);po_line(ctx,f,0.8,0.35);}}
// a canvas stretched across the street from eave to eave, sagging a little; its shadow on the ground under it
function po_strCanvas(ctx,z,col,a){const C=PO_STR,P=po_st,top=[],bot=[];for(let i=0;i<=16;i++){const X=lerp(-C.half+0.4,C.half-0.4,i/16),sag=0.32*Math.sin(Math.PI*i/16);top.push(P(X,3.3-sag,z+3.2));bot.push(P(X,3.3-sag,z));}
  const pts=top.concat(bot.reverse());po_fill(ctx,pts,col,a==null?0.92:a,(z*7)|0);po_line(ctx,pts,0.8,0.3);
  // its ropes to the eaves
  for(const sd of [-1,1]){const p=P(sd*(C.half-0.4),3.3,z),q=P(sd*(C.half-0.05),3.4,z);ctx.strokeStyle=rgba([120,100,80],0.7);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}}
// the street: the earth, trodden; cobbles along the shops' feet; the shade of the right-hand roofs along that side
function po_strGround(ctx){const C=PO_STR,P=po_st;wc_wash(ctx,[[-60,C.hz-4],[W+60,C.hz-4],[W+60,H+60],[-60,H+60]],[220,200,162],{kind:"ground",seed:991,line:false});
  const R=wc_rng(993);for(let i=0;i<120;i++){const X=-C.half+R()*C.half*2,Z=2+Math.pow(R(),1.6)*50,[x,y]=P(X,0,Z),k=po_ppm(C,Z),r=(0.03+R()*0.05)*k;if(r<0.6)continue;
    ctx.fillStyle=rgba(R()<0.5?[196,178,146]:[184,166,134],0.4);ctx.beginPath();ctx.ellipse(x,y,r*1.5,r*0.5,0,0,TAU);ctx.fill();}
  ctx.save();ctx.filter="blur(12px)";wc_tr(ctx,[P(-1.3,0,2),P(1.1,0,2),P(0.5,0,C.z1),P(-0.5,0,C.z1)]);ctx.fillStyle=rgba([250,244,230],0.35);ctx.fill();ctx.filter="none";ctx.restore();
  for(const s of [-1,1]){const pts=[P(s*C.half,0,2),P(s*C.half,0,C.z1),P(s*(C.half-0.7),0,C.z1),P(s*(C.half-0.7),0,2)];po_fill(ctx,pts,[200,184,156],0.7,995+s);
    for(let z=2.2;z<30;z+=0.3)for(let X=C.half-0.12;X>C.half-0.7;X-=0.26){const [x,y]=P(s*X,0,z+(X*7%0.3)),k=po_ppm(C,z);if(k<14)continue;ctx.strokeStyle=rgba([150,136,112],0.3);ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,0.1*k,0.035*k,0,0,TAU);ctx.stroke();}}
  po_fill(ctx,[P(C.half,0,2),P(C.half,0,C.z1),P(C.half-1.5,0,C.z1),P(C.half-1.1,0,2)],[110,100,110],0.22,997);}
// the market's crowd: men in robes and turbans of many colours, women in cloaks and veils; made once from a few choices, so no two near
// each other look alike
(()=>{const R=wc_rng(1201),robes=[[70,106,104],[120,58,56],[52,84,120],[110,74,104],[150,96,70],[96,104,72],[126,110,90],[64,82,62],[176,140,96],[90,70,60],[150,80,62],[60,64,90]],
    sk=[[226,186,150],[214,170,132],[200,156,118],[190,142,104],[222,180,144]],cloaks=[[60,70,98],[110,72,64],[80,60,70],[70,84,76],[96,80,64]];
  for(let i=0;i<16;i++){const woman=i%5===3,c=robes[i%robes.length];
    PEOPLE["po_c"+i]=woman?{name:"",role:"buyer",side:"",edge:GV_PAST,seed:1300+i,skin:sk[i%5],hair:{style:"none",c:[50,38,32]},hat:"po_veil",hatC:[250,248,242],
        top:{kind:"po_ferace",c:cloaks[i%5]},bottom:{c:[60,60,70]},shoe:[200,150,70],build:{sh:64,hip:62,h:0.93+R()*0.04}}
      :{name:"",role:"",side:"",edge:GV_PAST,seed:1300+i,skin:sk[i%5],hair:{style:"none",c:[40,32,28]},beard:R()<0.85?[[46,36,30],[90,80,72],[150,140,130],[60,46,36]][i%4]:null,
        hat:"po_turban",hatC:R()<0.8?[246,243,234]:[232,214,170],capC:R()<0.4?[150,60,52]:null,tb:0.88+R()*0.16,
        top:{kind:"po_robe",c,inner:[234,224,204],sash:robes[(i*5+3)%robes.length],hem:R()<0.3?-150:-40,apron:R()<0.2?[210,196,170]:null},bottom:{c:[76,70,72]},shoe:[[200,156,64],[150,70,52],[96,70,48]][i%3],
        build:{sh:72+R()*6,hip:60+R()*6,h:0.96+R()*0.08}};}})();
// the crowd in a street, still, far to near: walking to and fro, a few stopped at the stalls. n: how many; seen from behind or in front
function po_strCrowd(ctx,n,seed,zmin){const C=PO_STR,R=wc_rng(seed),L=[];for(let i=0;i<n;i++){const Z=(zmin||10)+Math.pow(R(),0.8)*40,stall=R()<0.3,sd=R()<0.5?-1:1,
    X=stall?sd*(C.half-0.85-R()*0.25):(R()-0.5)*2*(C.half-1.2);L.push({X,Z,id:"po_c"+(i%16),back:stall?true:R()<0.5,ph:R()*TAU,flip:R()<0.5,walk:!stall});}
  // people near each other in depth are never the same person
  L.sort((a,b)=>b.Z-a.Z).forEach((p,i)=>{p.id="po_c"+((i*7)%16);const a=po_at(C,p.X,p.Z);if(p.back)po_back(ctx,p.id,a.x,a.y,a.s,{ph:p.walk?p.ph:0});
    else person(ctx,p.id,a.x,a.y,a.s,{pose:"stand",pose2:p.ph>Math.PI?"walkA":"walkB",mix:0.8,flip:p.flip,t:p.ph*3});});}
// the street, painted once: sky, the ground, the end, the houses, the shops and the canvases far to near, the crowd
function po_paintStreet(ctx,era){const C=PO_STR;wc_sky(ctx,C.hz-60,era==="1600"?1203:1205,{cx:500,cw:900,cy:40,ch:120,clouds:3});wc_prep();
  po_strGround(ctx);po_strEnd(ctx,era);po_grain(ctx,0.4);
  const items=po_strShops(era).map((sh,i,L)=>({z:sh.z0,f:()=>po_strShop(ctx,sh,!L.some(o=>o.s===sh.s&&o.z0<sh.z0))}));
  (era==="1600"?[[14,[230,218,190]],[30,[218,196,158]]]:[[12,[218,200,164]],[26,[230,218,190]],[40,[206,182,146]]]).forEach(([z,c])=>items.push({z:z+1.6,f:()=>po_strCanvas(ctx,z,c)}));
  items.sort((a,b)=>b.z-a.z).forEach(it=>it.f());po_grain(ctx,0.35);
  po_strCrowd(ctx,era==="1600"?18:70,era==="1600"?1207:1209,era==="1600"?12:8.0);
  // the shade of the canvases on the ground, soft
  ctx.save();ctx.filter="blur(8px)";for(const z of era==="1600"?[14,30]:[12,26,40]){const pts=[po_st(-C.half+0.6,0,z+1.4),po_st(C.half-0.6,0,z+1.4),po_st(C.half-0.4,0,z+4.6),po_st(-C.half+0.4,0,z+4.6)];
    ctx.fillStyle="rgba(110,90,70,0.16)";wc_tr(ctx,pts);ctx.fill();}ctx.filter="none";ctx.restore();}

/* ---------- the 1600s, close: the cloth seller's counter ---------- */
// at the counter, a little above it: the stall's back wall of boards and two shelves of folded cloth in its shade, then the counter's
// top in the light and its front of boards. The seller stands behind it (gv_behind, cut at its back edge, top); the bolt and the length
// unrolled from it lie on it (po_paintClothFront); the inspector's man lays the market's rod along the length, step by step, and the
// inspector's back is at the right edge, in the street. roll: the bolt's front face (x, y, r); cloth: where the length runs; rod: where
// its first step starts and how long it is; y: where it lies on the cloth; seller: where he stands and his scale
const PO_CC={top:600,front:720,roll:[322,626,76],cloth:[398,1530],rod:[410,400],y:688,seller:[760,1.05]};
// cloth of the time, dyed and undyed: madder, indigo, saffron, undyed wool, olive, plum
const PO_CLOTH=[[164,74,64],[70,84,132],[196,156,86],[226,212,184],[108,116,86],[140,96,120]];
function po_paintClothClose(ctx){const C=PO_CC,R=wc_rng(1401);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_prep();
  // the back wall: boards, a knot here and there
  wc_wash(ctx,wc_rect(-40,-40,W+80,C.top+60),[140,104,76],{kind:"plaster",seed:1402,line:false});
  ctx.save();ctx.lineCap="round";for(let x=30;x<W;x+=104+R()*40){ctx.strokeStyle=rgba([70,50,38],0.32);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x+(R()-0.5)*4,C.top);ctx.stroke();
    ctx.strokeStyle=rgba([206,170,128],0.16);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+4,-10);ctx.lineTo(x+4,C.top);ctx.stroke();}
  for(let i=0;i<14;i++){const kx=R()*W,ky=R()*C.top;ctx.strokeStyle=rgba([80,58,42],0.25);ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(kx,ky,7+R()*5,3+R()*2,0,0,TAU);ctx.stroke();}ctx.restore();
  // two shelves, and folded cloth on them in stacks
  for(const [sy,n0] of [[214,0],[420,3]]){wc_wash(ctx,wc_rect(-40,sy,W+80,20),[156,116,82],{kind:"trim",seed:1403+sy,lw:1.2});
    ctx.save();ctx.filter="blur(5px)";ctx.fillStyle="rgba(50,34,26,0.35)";ctx.fillRect(-40,sy+20,W+80,16);ctx.filter="none";ctx.restore();
    for(let k=0,x=90+n0*24;x<W-150;k++,x+=200+R()*44){const n=2+Math.floor(R()*3);for(let j=0;j<n;j++){const c=mix(PO_CLOTH[(k*2+j+n0)%PO_CLOTH.length],[150,120,96],0.28),w=150+R()*10,h=30,y0=sy-(j+1)*h+2;
        const pts=[[x,y0+h],[x+w,y0+h],[x+w+2,y0+5],[x+w-6,y0],[x+6,y0],[x-2,y0+5]];po_fill(ctx,pts,c,1,1410+k*7+j);
        ctx.strokeStyle=rgba(wc_dim(c,0.35),0.6);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+4,y0+h*0.56);ctx.lineTo(x+w-4,y0+h*0.56);ctx.stroke();
        ctx.strokeStyle=rgba(wc_lit(c,0.3),0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+8,y0+2.5);ctx.lineTo(x+w-8,y0+2.5);ctx.stroke();po_line(ctx,pts,1,0.35);}}}
  // the shade: deeper high up and at the left, where the light off the street doesn't reach
  ctx.save();ctx.globalCompositeOperation="multiply";let g=ctx.createLinearGradient(0,0,0,C.top);g.addColorStop(0,"rgba(112,92,82,0.85)");g.addColorStop(1,"rgba(236,220,200,0.35)");ctx.fillStyle=g;ctx.fillRect(0,0,W,C.top);
  g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(150,130,120,0.55)");g.addColorStop(0.55,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,C.top);ctx.restore();
  // the stall's corner post at the left
  wc_wash(ctx,[[0,-20],[66,-20],[70,C.top],[0,C.top]],PO.woodDk,{kind:"build",seed:1406,lw:1.2});
  // the counter: its top in the light, then its front of boards
  const top=[[90,C.top],[1830,C.top],[W+40,C.front],[-40,C.front]];wc_wash(ctx,top,[216,176,128],{kind:"build",seed:1407,lw:1.4});
  ctx.save();wc_tr(ctx,top);ctx.clip();ctx.strokeStyle=rgba([150,110,76],0.3);ctx.lineWidth=1.6;for(const v of [0.3,0.62]){const y=lerp(C.top,C.front,v);ctx.beginPath();ctx.moveTo(-40,y);ctx.lineTo(W+40,y);ctx.stroke();}
    g=ctx.createLinearGradient(0,C.top,0,C.front);g.addColorStop(0,"rgba(120,90,70,0.28)");g.addColorStop(1,"rgba(255,240,210,0)");ctx.fillStyle=g;ctx.fillRect(0,C.top,W,C.front-C.top);ctx.restore();
  const fr=wc_rect(-40,C.front,W+80,H-C.front+40);wc_wash(ctx,fr,[158,114,80],{kind:"build",seed:1408,lw:1.4});
  ctx.save();wc_tr(ctx,fr);ctx.clip();ctx.strokeStyle=rgba([96,66,46],0.4);ctx.lineWidth=2.2;for(let y=C.front+74;y<H;y+=80){ctx.beginPath();ctx.moveTo(-40,y);ctx.lineTo(W+40,y+(R()-0.5)*3);ctx.stroke();}
    g=ctx.createLinearGradient(0,C.front,0,C.front+44);g.addColorStop(0,"rgba(60,40,30,0.38)");g.addColorStop(1,"rgba(60,40,30,0)");ctx.fillStyle=g;ctx.fillRect(0,C.front,W,44);ctx.restore();
  po_grain(ctx,0.5);}
// the bolt and the length unrolled from it, on the counter: indigo wool, a pale selvedge along its near edge, cut straight at its end;
// the bolt's far end showing over it, and its front face, the cloth wound round and round
function po_paintClothFront(ctx){const C=PO_CC,[rx,ry,rr]=C.roll,[c0,c1]=C.cloth,col=PO_CLOTH[1];wc_prep();
  const yb=C.top+16,yf=C.front-18,L=[[c0,yb],[c1,yb+1],[c1+4,yf],[c0,yf]];wc_wash(ctx,L,col,{kind:"thing",seed:1411,lw:1.3});
  ctx.save();wc_tr(ctx,L);ctx.clip();ctx.strokeStyle=rgba(wc_lit(col,0.22),0.35);ctx.lineWidth=1.2;for(let y=yb+6;y<yf;y+=7){ctx.beginPath();ctx.moveTo(c0,y);ctx.lineTo(c1+4,y);ctx.stroke();}
    ctx.fillStyle=rgba([206,196,168],0.85);ctx.fillRect(c0,yf-11,c1-c0+6,7);ctx.restore();
  const bk=[rx,ry-64];ctx.fillStyle=rgba(wc_dim(col,0.22),1);ctx.beginPath();ctx.ellipse(bk[0],bk[1],rr*0.92,rr*0.92,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(rx-rr,ry);ctx.lineTo(bk[0]-rr*0.92,bk[1]);ctx.lineTo(bk[0]+rr*0.92,bk[1]);ctx.lineTo(rx+rr,ry);ctx.closePath();ctx.fill();
  wc_wash(ctx,wc_ell(rx,ry,rr,rr,28),wc_lit(col,0.06),{kind:"thing",seed:1412,lw:1.4});
  ctx.strokeStyle=rgba(wc_dim(col,0.38),0.6);ctx.lineWidth=1.6;ctx.beginPath();for(let a=0;a<TAU*6;a+=0.08){const r=rr*0.12+rr*0.84*a/(TAU*6),x=rx+Math.cos(a)*r,y=ry+Math.sin(a)*r;a?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  ctx.fillStyle=rgba(wc_dim(col,0.5),1);ctx.beginPath();ctx.arc(rx,ry,rr*0.12,0,TAU);ctx.fill();po_grain(ctx,0.6);}
// the market's rod lying on the cloth from x, lifted by lift pixels: its top face and front, its red marks, its darker ends; its shadow
function po_rodFlat(ctx,x,y,L,lift){const c=[222,184,126];
  ctx.save();ctx.filter="blur(4px)";ctx.fillStyle=`rgba(30,30,50,${0.3*(1-clamp(lift/40,0,0.8))})`;ctx.fillRect(x+4+lift*0.3,y+2,L,8+lift*0.15);ctx.filter="none";ctx.restore();
  y-=lift;po_fill(ctx,[[x,y-16],[x+L,y-16],[x+L+4,y-6],[x+4,y-6]],wc_lit(c,0.14),1,1421);po_fill(ctx,[[x+4,y-6],[x+L+4,y-6],[x+L+4,y+6],[x+4,y+6]],wc_dim(c,0.2),1,1422);
  ctx.fillStyle=rgba([176,50,40],0.95);for(let i=0;i<=8;i++){const mx=x+3+i*(L-3)/8;ctx.fillRect(mx-2.2,y-16,4.4,i%4===0?22:12);}
  ctx.fillStyle=rgba([120,92,60],1);ctx.fillRect(x,y-16,8,22);ctx.fillRect(x+L-4,y-16,8,22);po_line(ctx,[[x,y-16],[x+L,y-16],[x+L+4,y+6],[x+4,y+6]],1,0.5);}
// the inspector's man's hand on the rod, his sleeve coming up from the street below the frame: a tapering sleeve, its cuff, the hand
// round the rod, its thumb along it
function po_rodHand(ctx,hx,hy){const P_=PEOPLE.po_rodman,sl=P_.top.c,cuff=P_.top.inner,sk=P_.skin,b0=[hx+230,H+60],b1=[hx+46,hy+40];
  const dx=b1[0]-b0[0],dy=b1[1]-b0[1],l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l,sh=(p,q,r)=>[[p[0]+nx*r,p[1]+ny*r],[q[0]+nx*r*0.62,q[1]+ny*r*0.62],[q[0]-nx*r*0.62,q[1]-ny*r*0.62],[p[0]-nx*r,p[1]-ny*r]];
  wc_wash(ctx,sh(b0,b1,64),sl,{kind:"thing",seed:1431,lw:1.3});const cf=[b1[0]-dx/l*16,b1[1]-dy/l*16];wc_wash(ctx,sh(cf,b1,44),cuff,{kind:"thing",seed:1432,lw:1.1});
  // the hand: the back of it over the rod, the fingers round its far side, the thumb along it
  const hp=[[hx-30,hy-4],[hx-24,hy-30],[hx+2,hy-40],[hx+34,hy-34],[hx+56,hy-12],[hx+60,hy+24],[hx+40,hy+42],[hx+8,hy+30]];wc_wash(ctx,hp,sk,{kind:"thing",seed:1433,lw:1.2});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(sk,0.3),0.6);ctx.lineWidth=2;ctx.lineCap="round";for(const k of [0,1,2]){const fx=hx-20+k*18;ctx.beginPath();ctx.moveTo(fx,hy-30+k*3);ctx.quadraticCurveTo(fx-4,hy-12,fx-2,hy+2);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(hx+42,hy+18);ctx.quadraticCurveTo(hx+10,hy+10,hx-12,hy+12);ctx.stroke();ctx.restore();}
// sold short: a red bracket over the gap between the cloth's end and the rod's last mark, drawn out from its middle
function po_shortMark(ctx,x0,x1,y,p){if(p<=0)return;const e=easeCam(clamp(p,0,1)),xm=(x0+x1)/2,w=(x1-x0)/2*e;ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.92);ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(xm-w,y+20);ctx.lineTo(xm-w,y);ctx.lineTo(xm+w,y);ctx.lineTo(xm+w,y+20);ctx.stroke();ctx.restore();}
// the rod at a moment: laid at step k0 when the shot starts, and stepped along to the next at each time in steps (each step 0.85 s:
// lifted, carried, laid down); a pale chalk tick on the cloth where each step ended. Returns where its far end is
function po_rodAt(ctx,tt,k0,steps){const C=PO_CC,[x0,L]=C.rod;let k=k0,u=0;steps.forEach(ts=>{if(tt>=ts+0.85)k++;else if(tt>ts)u=easeCam((tt-ts)/0.85);});
  for(let i=1;i<=k;i++){const cx=x0+i*L;if(cx>C.cloth[1])continue;ctx.fillStyle=rgba([236,232,220],0.85);ctx.fillRect(cx-2,C.front-36,4,22);}
  const x=x0+(k+u)*L,lift=Math.sin(Math.PI*u)*26;po_rodFlat(ctx,x,C.y,L,lift);po_rodHand(ctx,x+150,C.y-6-lift);return x+L;}

/* ---------- the light of another hour, and plain paper ---------- */
// laid over everything in a street: "next", the next morning, cooler and brighter from the left; "eve", the evening, warm and low, a glow
// at the street's end
function po_light(ctx,kind,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha=a;let g;
  if(kind==="eve"){ctx.globalCompositeOperation="multiply";g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(232,170,124)");g.addColorStop(0.5,"rgb(246,208,166)");g.addColorStop(1,"rgb(212,168,150)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation="screen";g=ctx.createRadialGradient(960,430,40,960,430,760);g.addColorStop(0,"rgba(255,186,116,0.5)");g.addColorStop(1,"rgba(255,186,116,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  else{ctx.globalCompositeOperation="screen";g=ctx.createRadialGradient(240,60,60,240,60,1400);g.addColorStop(0,"rgba(255,246,222,0.36)");g.addColorStop(1,"rgba(214,228,250,0.06)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  ctx.restore();}
// a plain sheet of the series' paper, for the cards that come out of the story
function po_paintPlain(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_prep();wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[244,236,220],{kind:"plaster",seed:1451,line:false});
  const g=ctx.createRadialGradient(960,500,300,960,540,1200);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(150,130,110,0.16)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
// a length of cloth just bought, held along the outstretched arm to see its length: over the arm from the shoulder to the hand, hanging
// below it in a soft fold; past the hand, a dashed outline where the length paid for would end, and a red tick there
function po_heldClothArm(cx,P_,hands){const r=hands[1],sd=Math.sign(r[0])||1,sh=[sd*P_.build.sh*0.5,-424],c=PO_CLOTH[2],l=Math.hypot(r[0]-sh[0],r[1]-sh[1]),
    dx=(r[0]-sh[0])/l,dy=(r[1]-sh[1])/l,nx=-dy*sd,ny=dx*sd,q=(u,v)=>[sh[0]+dx*u*l+nx*v,sh[1]+dy*u*l+ny*v],ext=96,pts=a=>{cx.beginPath();a.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.closePath();};
  // where it should have ended, a hand further on: a pale ghost of the cloth that isn't there, its dashed edge, and a red tick at its end
  const g=[q(1,-14),[r[0]+dx*ext-nx*14,r[1]+dy*ext-ny*14],[r[0]+dx*ext+nx*40,r[1]+dy*ext+ny*40],q(1,40)];pts(g);cx.fillStyle=rgba([252,248,238],0.8);cx.fill();
  cx.save();cx.setLineDash([11,8]);cx.strokeStyle=rgba(WC_INK,0.85);cx.lineWidth=4;cx.lineJoin="round";cx.stroke();cx.restore();
  const e1=[r[0]+dx*ext,r[1]+dy*ext];cx.strokeStyle=rgba(GV.redInk,0.95);cx.lineWidth=8;cx.lineCap="round";cx.beginPath();cx.moveTo(e1[0]-nx*30,e1[1]-ny*30);cx.lineTo(e1[0]+nx*56,e1[1]+ny*56);cx.stroke();
  // the cloth: over the arm, hanging below it in a soft fold, its end falling from the hand
  const top=[],bot=[];for(let i=0;i<=8;i++){const u=i/8;top.push(q(u,-14));bot.push(q(u,38+8*Math.sin(Math.PI*u)));}
  pts(top.concat(bot.reverse()));litFill(cx,c,Math.min(sh[0],r[0]),sh[1]-20,Math.max(sh[0],r[0]),r[1]+60);seam(cx,c,0.55);
  pts([q(0.9,30),q(1.0,-12),[r[0]+dx*4+nx*86,r[1]+dy*4+ny*86],[r[0]-dx*26+nx*80,r[1]-dy*26+ny*80]]);litFill(cx,wc_dim(c,0.1),r[0]-40,r[1],r[0]+40,r[1]+90);seam(cx,c,0.5);
  cx.lineCap="round";cx.strokeStyle=rgba(darken(c,0.3),0.45);cx.lineWidth=2;for(const v of [6,20,32]){cx.beginPath();for(let i=0;i<=8;i++){const p=q(i/8,v+5*Math.sin(Math.PI*i/8));i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]);}cx.stroke();}
  fingers(cx,P_,[r]);}
