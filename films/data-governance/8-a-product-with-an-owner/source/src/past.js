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
  if(o.seam>0){const a=o.seam;cx.fillStyle=rgba(darken(c,0.55),0.9*a);cx.beginPath();cx.moveTo(sx-3,-10);cx.quadraticCurveTo(sx-10*a,-30,sx-2,-50);cx.quadraticCurveTo(sx+8*a,-30,sx+3,-10);cx.closePath();cx.fill();
    cx.strokeStyle=rgba([236,226,200],0.9*a);cx.lineWidth=1.6;for(const [dx,dy,ex,ey] of [[-2,-14,-14,-6],[2,-24,14,-28],[-1,-40,-12,-46]]){cx.beginPath();cx.moveTo(sx+dx,dy);cx.quadraticCurveTo(sx+(dx+ex)/2,dy+6,sx+ex,ey);cx.stroke();}}
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
    for(const sd of [-1,1])arm(cx,P_,sd,[0.12,-0.06+0.22*sd*st],0,{});
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
    cx.restore();},x,y,k,P_.edge,[-260,-720,260,10]);}

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
  const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(wc_dim(lead,0.3),0.55));g.addColorStop(0.55,rgba(lead,0));g.addColorStop(1,rgba(wc_lit(lead,0.5),0.5));ctx.fillStyle=g;ctx.fillRect(x0,ya,x1-x0,yb-ya);
  wc_glowAt(ctx,lerp(x0,x1,0.66),lerp(ya,by,0.3),(x1-x0)*0.3,[250,250,246],0.5);
  // the seams of the lead, from the crown down
  ctx.strokeStyle=rgba(wc_dim(lead,0.35),0.35);ctx.lineWidth=Math.max(0.6,(x1-x0)/90);for(let i=0;i<12;i++){const a=Math.PI*(0.08+0.84*i/11);ctx.beginPath();
    for(let j=0;j<=8;j++){const e=j/8*Math.PI/2,p=P(cx+Math.cos(a)*r*Math.cos(e),y0+dr+r*kk*Math.sin(e),cz-Math.sin(a)*r*Math.cos(e));j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  ctx.restore();po_line(ctx,h,Math.max(0.8,(x1-x0)/70),0.55);
  const fin=P(cx,y0+dr+r*kk+r*0.28,cz);ctx.strokeStyle=rgba(wc_dim(lead,0.4),0.9);ctx.lineWidth=Math.max(1,(x1-x0)/60);ctx.beginPath();ctx.moveTo(top[0],top[1]);ctx.lineTo(fin[0],fin[1]);ctx.stroke();
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
  const band=[[x0+N[0]*w,z0+N[1]*w],[x1+N[0]*w,z1+N[1]*w],[x1-N[0]*w,z1-N[1]*w],[x0-N[0]*w,z0-N[1]*w]].map(p=>po_air(p[0],0.05,p[1]+Zc));po_fill(ctx,band,col,0.35,700+i);
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
