/* ===== Rules that run: the past =====
   Fustat and Roda Island in 861, painted the series' way (master data's wash.js and people.js, the series' rooms.js and people.js):
   the Nile in flood in the late afternoon, boats under lateen sails, palms, and Fustat's low buildings across the water; a farmer's
   field by the river in a flood year and in a low one, his family's mud-brick house behind it; the southern tip of Roda Island, where a
   low stone parapet frames the Nilometer's well at the river's edge; the well inside, as the sources describe it: courses of dressed
   stone, a stair down the walls to the water, three pointed arches on small columns in the east wall where the river comes in and lies
   still, and in the middle the octagonal marble column marked in cubits, tied at the top by a wooden beam; the column, close; and an
   office in Fustat. In 861 the well had no dome, so none is painted. The inscription bands on its walls are plain bands, with no
   lettering, and the papyri's lines are ink without letters. Its people wear their own time: long linen tunics, mantles and turbans,
   in undyed linen, indigo and madder; the official in the Abbasid black, a tall cap wound with a turban, bands woven on his sleeves.
   Nothing borrows a style: it's the series' watercolour, as it paints any place of work. The places are painted once and kept (the
   series' finish.js); what moves is drawn every frame: the water, the column, the light, the boats and the people. Every name starts
   with rr_ or RR. */

/* ---------- colours ---------- */
// the late afternoon's sand and plaster, the Nile in flood (brown-green with its silt), the fields, the palms, the well's stone and the
// column's marble, linen, indigo and madder, papyrus and its ink
const RR={hill:[226,200,166],plaster:[238,226,198],plasterDk:[212,192,156],brick:[200,164,122],mud:[186,150,110],mudLt:[214,186,144],mudDk:[146,112,80],
  nile:[126,142,112],nileLt:[178,184,148],nileDk:[90,106,86],green:[132,168,90],green2:[160,186,104],green3:[108,146,82],dike:[184,158,112],
  dry:[220,192,146],dryDk:[184,152,108],crack:[118,88,60],straw:[216,194,130],palm:[96,128,74],palm2:[124,148,86],trunk:[150,116,82],dates:[214,112,54],
  stone:[214,196,160],stoneLt:[232,220,192],stoneDk:[164,142,108],marble:[240,236,226],marbleDk:[186,180,170],wood:[132,94,62],woodDk:[94,66,46],
  linen:[232,222,198],indigo:[74,92,134],madder:[170,86,64],black:[46,44,52],papyrus:[228,210,160],ink:[60,48,40],sail:[240,232,208],hull:[120,86,58],
  sky:[150,190,214],water:[156,170,150]};

/* ---------- the Nile's things: palms, boats, houses ---------- */
// a date palm: a trunk curving a little and narrowing, ringed with the bases of old leaves; a crown of fronds, each arching out and
// down, with its leaflets; in late summer, dates hanging orange under it. (x, y) is its foot, h its height, lean how far the crown
// leans (a share of h); o.dry: a low year's, dusty, its fronds paler and fewer, no dates
function rr_palm(ctx,x,y,h,lean,seed,depth,o){o=o||{};const R=wc_rng(seed),d=depth==null?1:depth,k=h/400,line=[];
  for(let i=0;i<=14;i++){const u=i/14;line.push([x+lean*h*Math.pow(u,1.6)+Math.sin(u*2.6+seed)*h*0.012,y-h*u]);}
  const top=line[14],tr=o.dry?wc_lit(RR.trunk,0.1):RR.trunk;
  wc_wash(ctx,wc_band(line,h*0.05,h*0.032),tr,{depth:d,kind:"trunk",lw:Math.max(0.7,1.2*k),seed});
  if(h>90){ctx.save();ctx.strokeStyle=rgba(wc_haze(wc_dim(tr,0.32),d),0.5);ctx.lineWidth=Math.max(0.8,1.5*k);ctx.lineCap="round";
    for(let i=1;i<27;i++){const u=i/28,p=wc_along(line,u),w=lerp(h*0.024,h*0.015,u);ctx.beginPath();ctx.moveTo(p[0]-w,p[1]+w*0.3);ctx.quadraticCurveTo(p[0],p[1]-w*0.4,p[0]+w,p[1]+w*0.3);ctx.stroke();}ctx.restore();}
  if(!o.dry&&h>120)for(let i=0;i<3;i++){const a=-0.55+i*0.55+(R()-0.5)*0.2;wc_wash(ctx,wc_ell(top[0]+Math.sin(a)*h*0.07,top[1]+h*0.075,h*0.026,h*0.045,14),RR.dates,{depth:d,kind:"dab",seed:seed+i});}
  const n=o.dry?9:13,col=o.dry?wc_lit(RR.palm2,0.2):RR.palm,fr=[];
  for(let i=0;i<n;i++){const a=-Math.PI*0.5+(i/(n-1)-0.5)*Math.PI*1.72+(R()-0.5)*0.16,L=h*(0.25+R()*0.08)*(o.dry?0.85:1),droop=0.5+R()*0.35,pts=[];
    for(let j=0;j<=10;j++){const u=j/10;pts.push([top[0]+Math.cos(a)*L*u,top[1]+Math.sin(a)*L*u+L*droop*u*u*(Math.abs(Math.cos(a))+0.2)]);}fr.push(pts);}
  fr.forEach((pts,i)=>{const c=i%2===0?wc_dim(col,0.12):i%3===1?RR.palm2:col;wc_wash(ctx,wc_band(pts,h*0.034,h*0.004),c,{depth:d,kind:"tree",lw:Math.max(0.6,1.1*k),seed:seed+i*3});
    if(h>70){ctx.save();ctx.strokeStyle=rgba(wc_haze(wc_dim(c,0.2),d),0.7);ctx.lineWidth=Math.max(0.7,1.5*k);ctx.lineCap="round";
      for(let j=1;j<10;j++){const p=pts[j],q=pts[j+1],dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,ll=h*0.05*(1-j/12);
        for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+dx/l*ll*0.5+s*nx*ll,p[1]+dy/l*ll*0.5+s*ny*ll+ll*0.35);ctx.stroke();}}ctx.restore();}});
  return top;}
// a Nile boat under a lateen sail, side on, its bow to the right: a long hull rising to the stern, a mast stepped forward, the long
// yard slanting up and back, and the triangle of the sail under it; a man at the steering oar. Kept at 300 px long
function rr_boatC(seed){return wc_kept("rrBoat"+seed,380,330,q=>{q.translate(40,270);
  wc_wash(q,[[300,-58],[52,-252],[74,-34],[262,-30]],RR.sail,{kind:"cover",lw:1.2,seed:seed+2});
  q.save();q.strokeStyle=rgba(wc_dim(RR.sail,0.18),0.45);q.lineWidth=1.4;for(let i=1;i<5;i++){const u=i/5;q.beginPath();q.moveTo(lerp(300,52,u),lerp(-58,-252,u));q.lineTo(lerp(262,74,u)+6,-32);q.stroke();}q.restore();
  wc_wash(q,[[196,-24],[204,-24],[202,-214],[198,-214]],RR.woodDk,{kind:"thing",lw:1,seed:seed+1});
  q.save();q.strokeStyle=rgba(RR.woodDk,1);q.lineWidth=4.5;q.lineCap="round";q.beginPath();q.moveTo(306,-52);q.quadraticCurveTo(176,-150,44,-262);q.stroke();q.restore();
  // the steersman: a small figure in a tunic and a cloth on his head, at the oar
  wc_wash(q,[[34,-30],[52,-30],[50,-78],[36,-78]],[214,204,184],{kind:"thing",lw:1,seed:seed+5});wc_wash(q,wc_ell(43,-86,8,9,12),[150,104,74],{kind:"thing",lw:0.8,seed:seed+6});
  wc_wash(q,wc_ell(43,-94,9,5,12),RR.linen,{kind:"thing",lw:0.8,seed:seed+7});
  q.save();q.strokeStyle=rgba(RR.woodDk,1);q.lineWidth=3.5;q.lineCap="round";q.beginPath();q.moveTo(46,-62);q.lineTo(4,-4);q.stroke();q.restore();
  wc_wash(q,[[4,-50],[40,-30],[150,-20],[252,-26],[304,-46],[298,-36],[262,-12],[150,2],[40,-8],[0,-32]],RR.hull,{kind:"thing",lw:1.4,seed});
  q.save();q.strokeStyle=rgba(wc_lit(RR.hull,0.25),0.6);q.lineWidth=2;q.beginPath();q.moveTo(14,-40);q.quadraticCurveTo(150,-14,292,-40);q.stroke();q.restore();});}
// a boat on the water at (x, y), its length s x 300 px, facing left (flip) or right, bobbing a little with t; its reflection under it
function rr_boat(ctx,x,y,s,flip,seed,t,a){const c=rr_boatC(seed),b=Math.sin((t||0)*1.3+seed)*1.5*s;if(a!=null&&a<=0.01)return;ctx.save();if(a!=null)ctx.globalAlpha*=a;ctx.translate(x,y+b);ctx.scale(flip?-s:s,s);
  ctx.save();ctx.globalAlpha*=0.22;ctx.scale(1,-0.5);ctx.drawImage(c,-150-40,-270-10);ctx.restore();ctx.drawImage(c,-150-40,-270);ctx.restore();}
// Fustat's houses across the water: flat roofs, plastered or of brick, two to four storeys, small dark windows, a palm among them here
// and there; two rows, between x0 and x1, their feet at base; k is their scale with the distance
function rr_city(ctx,x0,x1,base,k,seed,depth){const R=wc_rng(seed);[[-7*k,0.8,0.82],[0,1,1]].forEach(([dy,dk,dd],row)=>{let x=x0;
  while(x<x1){const w=(24+R()*42)*k*dk,tall=R()<0.14?1.9:1,h=(14+R()*26)*k*dk*tall,y=base+dy,col=[RR.plaster,RR.plasterDk,RR.brick,RR.mudLt,RR.plaster][Math.floor(R()*5)];
    wc_part(ctx,wc_rect(x,y-h,w,h+2),col,depth*dd,{line:false,seed:seed+(x|0)});wc_flat(ctx,wc_rect(x+w*0.72,y-h,w*0.28,h+2),wc_dim(col,0.14),depth*dd,"side");
    if(h>14*k)for(let j=0;j<Math.floor(h/(12*k));j++)if(R()<0.6)wc_flat(ctx,wc_rect(x+w*(0.18+R()*0.4),y-h+6*k+j*12*k,3*k,4*k),[96,80,70],depth*dd,"window");
    if(R()<0.12)rr_palm(ctx,x+w*0.5,y-h*0.2,(48+R()*30)*k,(R()-0.5)*0.1,seed+(x|0)%97,depth*dd*0.9);x+=w*(0.78+R()*0.3);}});}
// a mud-brick house: flat-roofed, its bricks plastered with mud, a parapet and the ends of palm ribs along the roof, a doorway under a
// palm-wood lintel, a small window high up, a bench of mud beside the door and a water jar; x0 to x1 its front, base its foot, top
// its roof's edge, side the width of its side wall in perspective, door its doorway [x, w, h]; o.dry: a low year's, paler
function rr_house(ctx,x0,x1,base,top,side,door,o){o=o||{};const col=o.dry?wc_lit(RR.mud,0.08):RR.mud,R=wc_rng(71);
  wc_contact(ctx,x0-30,x1+side+20,base+4,1,0.3);
  wc_part(ctx,[[x1,top+4],[x1+side,top+22],[x1+side,base-10],[x1,base]],wc_dim(col,0.18),1,{seed:72});
  wc_part(ctx,wc_rect(x0,top,x1-x0,base-top),col,1,{seed:73});
  // the plaster's patches and the courses of brick where it has worn
  ctx.save();wc_tr(ctx,wc_rect(x0,top,x1-x0,base-top));ctx.clip();ctx.strokeStyle=rgba(wc_dim(col,0.25),0.22);ctx.lineWidth=1.3;
  for(let i=0;i<9;i++){const px=lerp(x0+20,x1-120,R()),py=lerp(top+30,base-60,R());for(let j=0;j<4;j++){ctx.beginPath();ctx.moveTo(px,py+j*11);ctx.lineTo(px+60+R()*40,py+j*11+1);ctx.stroke();}}ctx.restore();
  // the parapet, and the palm ribs of the roof sticking out under it
  wc_part(ctx,wc_rect(x0-6,top-18,x1-x0+12,20),wc_lit(col,0.06),1,{seed:74});wc_part(ctx,[[x1+6,top-18],[x1+side,top+2],[x1+side,top+22],[x1+6,top+2]],wc_dim(col,0.22),1,{seed:75});
  ctx.save();ctx.strokeStyle=rgba(RR.woodDk,0.8);ctx.lineWidth=3;ctx.lineCap="round";for(let x=x0+16;x<x1-10;x+=34+R()*14){ctx.beginPath();ctx.moveTo(x,top+6);ctx.lineTo(x-4,top+20);ctx.stroke();}ctx.restore();
  // the doorway, dark, under its lintel; the window; the bench and the jar
  const [dx,dw,dh]=door;wc_flat(ctx,wc_rect(dx,base-dh,dw,dh),[70,52,40],1,"door");wc_part(ctx,wc_rect(dx-14,base-dh-14,dw+28,16),RR.wood,1,{seed:76});
  wc_flat(ctx,wc_rect(x0+70,top+44,40,30),[84,64,50],1,"window");wc_part(ctx,wc_rect(x0+64,top+40,52,6),RR.wood,1,{seed:77});
  wc_part(ctx,wc_rect(dx-150,base-46,120,46),wc_lit(col,0.05),1,{seed:78});
  const jx=dx+dw+48;wc_contact(ctx,jx-30,jx+30,base+2,1,0.3);wc_wash(ctx,[[jx-16,base],[jx+16,base],[jx+30,base-36],[jx+20,base-66],[jx+12,base-74],[jx-12,base-74],[jx-20,base-66],[jx-30,base-36]],[178,112,76],{kind:"thing",lw:1.2,seed:79});}

// a pointed arch's outline, as the period's builders drew it: each side an arc whose centre lies inside the opposite half of the span
// (c, a share of the half-span), from the left foot up over the point and down to the right foot; up is +1 when y grows upwards
function rr_arch(cx,hw,yFoot,ySpring,up,c){c=c==null?0.5:c;const r=hw*(1+c),th=Math.acos(-c/(1+c)),o=[[cx-hw,yFoot],[cx-hw,ySpring]];
  for(let i=1;i<=8;i++){const a=Math.PI-(Math.PI-th)*i/8;o.push([cx+hw*c+r*Math.cos(a),ySpring+up*r*Math.sin(a)]);}
  for(let i=7;i>=0;i--){const a=Math.PI-(Math.PI-th)*i/8;o.push([cx-hw*c-r*Math.cos(a),ySpring+up*r*Math.sin(a)]);}o.push([cx+hw,yFoot]);return o;}

/* ---------- the people of 861 ---------- */
// invented people of their time: a farmer and his family, a tax scribe, the Nilometer's keeper and his scribe, a messenger with his
// boat, an official in Fustat
Object.assign(PEOPLE,{
  rr_farmer:{name:"",role:"farmer",side:"",edge:GV_PAST,seed:51,skin:[176,124,90],hair:{style:"cropped",c:[30,24,22]},beard:[38,30,26],hat:"rr_cloth",hatC:[226,214,188],
    top:{kind:"tunic",c:[214,200,172],inner:[226,216,194],belt:[150,120,84],rolled:true},bottom:{c:[170,120,86]},shoe:[150,104,74],build:{sh:76,hip:62,h:1.0}},
  rr_wife:{name:"",role:"his wife",side:"",edge:GV_PAST,seed:52,skin:[186,134,98],hair:{style:"none",c:[30,24,24]},hat:"rr_veil",hatC:RR.indigo,
    top:{kind:"gown",c:RR.madder,inner:[226,214,190],belt:[120,70,52]},bottom:{c:[120,70,56]},shoe:[150,104,74],build:{sh:64,hip:60,h:0.94}},
  rr_child:{name:"",role:"their son",side:"",edge:GV_PAST,seed:53,skin:[184,130,94],hair:{style:"cropped",c:[34,26,24]},
    top:{kind:"tunic",c:[226,214,186],inner:[232,224,204]},bottom:{c:[184,130,94]},shoe:[160,112,80],build:{sh:58,hip:48,h:0.62}},
  rr_taxman:{name:"",role:"tax scribe",side:"",edge:GV_PAST,seed:54,skin:[200,150,112],hair:{style:"cropped",c:[34,28,26]},beard:[44,36,32],hat:"rr_turban",hatC:[240,234,218],
    top:{kind:"gown",c:[236,228,208],inner:[244,240,230],belt:[134,100,70],mantle:[150,112,78]},bottom:{c:[200,190,170]},shoe:[96,70,50],build:{sh:74,hip:62,h:1.0}},
  rr_keeper:{name:"",role:"keeper of the Nilometer",side:"",edge:GV_PAST,seed:55,skin:[192,142,104],hair:{style:"cropped",c:[150,146,142]},beard:[178,174,168],hat:"rr_turban",hatC:[240,236,222],
    top:{kind:"gown",c:[222,210,184],inner:[238,232,218],belt:[120,92,64],mantle:RR.indigo},bottom:{c:[190,180,160]},shoe:[96,70,50],build:{sh:74,hip:62,h:1.0}},
  rr_scribe:{name:"",role:"scribe",side:"",edge:GV_PAST,seed:56,skin:[204,156,116],hair:{style:"cropped",c:[30,26,24]},beard:[40,32,28],hat:"rr_turban",hatC:[232,226,210],
    top:{kind:"gown",c:[240,236,224],inner:[246,244,236],belt:[150,110,74]},bottom:{c:[210,202,186]},shoe:[96,70,50],build:{sh:72,hip:60,h:0.98}},
  rr_boatman:{name:"",role:"messenger",side:"",edge:GV_PAST,seed:57,skin:[160,110,80],hair:{style:"cropped",c:[28,22,20]},beard:[34,28,24],hat:"rr_cloth",hatC:[232,224,204],
    top:{kind:"tunic",c:RR.indigo,inner:[214,206,190],belt:[150,120,84],rolled:true},bottom:{c:[160,110,80]},shoe:[140,98,70],build:{sh:76,hip:62,h:1.0}},
  rr_official:{name:"",role:"official in Fustat",side:"",edge:GV_PAST,seed:58,skin:[210,164,126],hair:{style:"cropped",c:[34,28,26]},beard:[46,38,34],hat:"rr_qal",hatC:RR.black,wrapC:[242,238,226],
    top:{kind:"gown",c:RR.black,inner:[236,230,216],belt:[110,84,52],mantle:[62,58,66],tiraz:[204,166,96]},bottom:{c:[60,58,66]},shoe:[60,46,36],build:{sh:76,hip:62,h:1.02}}
});
// holding a basket close, or something up to read; reaching out a hand for what another holds; pointing down to the water
Object.assign(POSE,{rr_take:{L:[0.16,-2.05],R:[1.1,1.85],hand:"open",feet:30,shift:6,tilt:-0.04,turn:0.28,gaze:[0.7,0.4],look:1},
  rr_read:{L:[0.14,-0.06],R:[0.85,2.05],hand:"open",feet:28,shift:4,tilt:0.08,turn:0.3,gaze:[0.9,0.9],look:1},
  rr_give:{L:[0.14,-0.08],R:[0.95,1.6],feet:30,shift:6,tilt:-0.02,turn:0.25,gaze:[0.7,0.6],look:1}});

// ---- the clothes of 861: the series' engine and its wraps stay as they are; these add to them, for their own kinds only ----
const _rrTorso=torso,_rrHead=head,_rrArm=arm;
// a mantle worn open over the tunic: it falls from the shoulders down both sides to the shins, its folds and its edge
torso=function(ctx,P,br,sh){_rrTorso(ctx,P,br,sh);const m=P.top.mantle;if(!m)return;const sw=P.build.sh,hw=P.build.hip,y0=-448+br,hem=-64;
  for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*14,y0-2);ctx.quadraticCurveTo(s*(sw+4),y0+2,s*(sw+8),y0+40);ctx.quadraticCurveTo(s*(hw+16)+sh*0.4,-250,s*(hw+44)+sh*0.5,hem);
    ctx.lineTo(s*(hw-6)+sh*0.5,hem+8);ctx.quadraticCurveTo(s*(hw-14)+sh*0.4,-250,s*(sw-28),y0+60);ctx.quadraticCurveTo(s*30,y0+20,s*8,y0+12);ctx.closePath();
    litFill(ctx,m,-sw-40,y0,sw+40,hem);seam(ctx,m,0.5);
    ctx.strokeStyle=rgba(darken(m,0.35),0.4);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(s*(sw-6),y0+80);ctx.quadraticCurveTo(s*(hw+10)+sh*0.4,-240,s*(hw+20)+sh*0.5,hem+2);ctx.stroke();
    ctx.strokeStyle=rgba(lighten(m,0.25),0.35);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(s*(sw-22),y0+70);ctx.quadraticCurveTo(s*(hw-2)+sh*0.4,-250,s*(hw+4)+sh*0.5,hem+6);ctx.stroke();}};
// the bands woven on an official's sleeves (tiraz), in the figure's units: a band round the upper arm, its weave as faint strokes,
// no letters
arm=function(ctx,P,s,a,br,po){_rrArm(ctx,P,s,a,br,po);const tz=P.top.tiraz;if(!tz)return;const sw=P.build.sh,sx=s*(sw-12),sy=-416+br,u0=0.38,u1=0.56,
    e=[sx+s*Math.sin(a[0])*108,sy+Math.cos(a[0])*108],p0=[lerp(sx,e[0],u0),lerp(sy,e[1],u0)],p1=[lerp(sx,e[0],u1),lerp(sy,e[1],u1)];
  ctx.lineCap="butt";ctx.strokeStyle=rgba(tz,0.95);ctx.lineWidth=31;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();
  ctx.strokeStyle=rgba(darken(tz,0.4),0.55);ctx.lineWidth=1.4;for(const u of [0.42,0.47,0.52]){const p=[lerp(sx,e[0],u),lerp(sy,e[1],u)],dx=e[0]-sx,dy=e[1]-sy,l=Math.hypot(dx,dy)||1;
    ctx.beginPath();ctx.moveTo(p[0]-dy/l*13,p[1]+dx/l*13);ctx.lineTo(p[0]+dy/l*13,p[1]-dx/l*13);ctx.stroke();}};
// headwear: a turban of white linen wound round the head; a smaller cloth for a farmer or a boatman; the official's tall black cap,
// wound with a turban at its foot; a woman's veil over her head and shoulders, framing her face
head=function(ctx,P,E,po,t){const h=P.hat;if(h==="rr_veil")rr_veilBack(ctx,P);_rrHead(ctx,P,E,po,t);
  if(h==="rr_turban")rr_turban(ctx,P.hatC,1);if(h==="rr_cloth")rr_turban(ctx,P.hatC,0.78);if(h==="rr_qal")rr_qal(ctx,P);if(h==="rr_veil")rr_veilFront(ctx,P);};
function rr_turban(ctx,c,k){const top=-56-44*k;ctx.beginPath();ctx.moveTo(-47,-14);ctx.bezierCurveTo(-58,-56,-44,top,0,top);ctx.bezierCurveTo(44,top,58,-56,47,-14);
  ctx.quadraticCurveTo(30,-34,0,-37);ctx.quadraticCurveTo(-30,-34,-47,-14);ctx.closePath();litFill(ctx,c,-58,top,58,-14);seam(ctx,c,0.42);
  ctx.save();ctx.clip();ctx.strokeStyle=rgba(darken(c,0.26),0.42);ctx.lineWidth=2.2;ctx.lineCap="round";
  for(let i=0;i<5;i++){const y=-24-i*(top+24)/-5.4;ctx.beginPath();ctx.moveTo(-56,y+10-i*2);ctx.quadraticCurveTo(-4,y-16-i*3,56,y-2-i*4);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(c,0.3),0.45);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-36,-30);ctx.quadraticCurveTo(-8,-44,24,-40);ctx.stroke();ctx.restore();}
function rr_qal(ctx,P){const c=P.hatC||RR.black,tc=P.wrapC||[240,236,224];
  ctx.beginPath();ctx.moveTo(-32,-70);ctx.lineTo(-27,-170);ctx.quadraticCurveTo(0,-184,27,-170);ctx.lineTo(32,-70);ctx.closePath();litFill(ctx,c,-32,-184,32,-70);seam(ctx,c,0.5);
  ctx.strokeStyle=rgba(lighten(c,0.3),0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-14,-84);ctx.lineTo(-12,-164);ctx.stroke();rr_turban(ctx,tc,0.62);}
function rr_veilBack(ctx,P){const c=P.hatC;ctx.beginPath();ctx.moveTo(-50,-34);ctx.bezierCurveTo(-58,-90,58,-90,50,-34);ctx.bezierCurveTo(60,20,74,70,86,140);ctx.quadraticCurveTo(0,160,-86,140);
  ctx.bezierCurveTo(-74,70,-60,20,-50,-34);ctx.closePath();litFill(ctx,c,-86,-90,86,150);seam(ctx,c,0.4);}
function rr_veilFront(ctx,P){const c=P.hatC;ctx.beginPath();ctx.moveTo(-46,22);ctx.bezierCurveTo(-52,-76,52,-76,46,22);ctx.lineTo(54,30);ctx.bezierCurveTo(62,-92,-62,-92,-54,30);ctx.closePath();
  litFill(ctx,c,-62,-92,62,30);ctx.strokeStyle=rgba(lighten(c,0.28),0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-40,-30);ctx.quadraticCurveTo(0,-74,40,-30);ctx.stroke();}

// ---- what they hold, in the figure's units ----
// a small basket of grain, held close in both hands
function rr_heldBasket(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2+24;cx.save();cx.translate(mx,my);const c=[190,150,96];
  cx.beginPath();cx.moveTo(-62,-30);cx.lineTo(62,-30);cx.quadraticCurveTo(58,26,40,40);cx.lineTo(-40,40);cx.quadraticCurveTo(-58,26,-62,-30);cx.closePath();litFill(cx,c,-62,-30,62,40);seam(cx,c,0.5);
  cx.save();cx.clip();cx.strokeStyle=rgba(darken(c,0.3),0.45);cx.lineWidth=2;for(let y=-20;y<40;y+=11){cx.beginPath();cx.moveTo(-64,y);cx.lineTo(64,y+1);cx.stroke();}
  for(let x=-60;x<64;x+=13){cx.beginPath();cx.moveTo(x,-30);cx.lineTo(x*0.7,40);cx.stroke();}cx.restore();
  cx.beginPath();cx.ellipse(0,-30,62,14,0,0,TAU);litFill(cx,[214,184,110],-62,-44,62,-16);cx.fillStyle=rgba([238,212,140],0.7);for(let i=0;i<26;i++){cx.beginPath();cx.arc(-48+hash(i,3)*96,-38+hash(i,5)*14,2.2,0,TAU);cx.fill();}
  cx.restore();fingers(cx,P_,[[mx-60,my-8],[mx+60,my-10]]);}
// a sheet of papyrus between the hands, unrolled from its roll as u goes 0 to 1, its lines ink without letters; o.left: held in the
// left hand alone, the right being free
function rr_heldScroll(u,o){o=o||{};return(cx,P_,hands)=>{const [l,r]=hands,e=easeCam(clamp(u,0,1)),w=lerp(26,190,e),x0=o.left?l[0]-14:(l[0]+r[0])/2-w/2,y0=(o.left?l[1]:(l[1]+r[1])/2)-74;
  cx.save();cx.translate(x0,y0);cx.fillStyle="rgba(70,50,30,0.16)";cx.fillRect(6,8,w,150);const g=cx.createLinearGradient(0,0,w,0);g.addColorStop(0,rgba(RR.papyrus,1));g.addColorStop(1,rgba(wc_dim(RR.papyrus,0.08),1));
  cx.fillStyle=g;cx.fillRect(0,0,w,150);cx.strokeStyle=rgba(wc_dim(RR.papyrus,0.25),0.5);cx.lineWidth=1.2;for(let x=6;x<w;x+=9){cx.beginPath();cx.moveTo(x,2);cx.lineTo(x,148);cx.stroke();}
  if(w>60){cx.strokeStyle=rgba(RR.ink,0.62);cx.lineWidth=2.6;cx.lineCap="round";for(let i=0;i<6;i++){const ly=20+i*21,lw=(w-34)*(i===5?0.5:0.86+0.14*hash(i,7));cx.beginPath();cx.moveTo(w-14,ly);
      for(let x=0;x<lw;x+=8)cx.lineTo(w-14-x,ly+Math.sin(x*0.9+i)*1.6+(hash(i*31+x|0,3)<0.2?-3:0));cx.stroke();}}
  const rg=cx.createLinearGradient(w-10,0,w+14,0);rg.addColorStop(0,rgba(wc_dim(RR.papyrus,0.25),1));rg.addColorStop(0.5,rgba(RR.papyrus,1));rg.addColorStop(1,rgba(wc_dim(RR.papyrus,0.3),1));cx.fillStyle=rg;rr(cx,w-10,-6,24,162,10);cx.fill();
  cx.restore();fingers(cx,P_,o.left?[[x0+4,y0+70]]:[[x0+2,y0+74],[x0+w+6,y0+74]]);};}
// a scribe's sheet on a board, a reed pen in the right hand writing on it (the pen moves with t)
function rr_heldSheet(t){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx-6,my-30);cx.rotate(-0.12);
  cx.fillStyle=rgba(RR.wood,1);rr(cx,-82,-62,164,124,6);cx.fill();cx.fillStyle=rgba(RR.papyrus,1);cx.fillRect(-72,-54,144,108);cx.strokeStyle=rgba(RR.ink,0.6);cx.lineWidth=2.4;cx.lineCap="round";
  for(let i=0;i<4;i++){cx.beginPath();cx.moveTo(60,-36+i*22);cx.lineTo(60-(i===3?50:100),-36+i*22);cx.stroke();}cx.restore();
  const px=r[0]+Math.sin((t||0)*7)*6;cx.save();cx.translate(px,r[1]-6);cx.rotate(-0.7);cx.fillStyle=rgba([196,170,110],1);cx.fillRect(-3,-70,6,74);cx.fillStyle=rgba(RR.ink,1);cx.fillRect(-3,2,6,6);cx.restore();
  fingers(cx,P_,[l,[px,r[1]]]);};}
// a folded sheet in one hand, held out
function rr_heldFolded(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0]+6,r[1]-30);cx.rotate(-0.2);cx.fillStyle="rgba(70,50,30,0.18)";cx.fillRect(-26,-22,60,50);
  cx.fillStyle=rgba(RR.papyrus,1);cx.fillRect(-30,-26,60,50);cx.strokeStyle=rgba(wc_dim(RR.papyrus,0.3),0.7);cx.lineWidth=1.6;cx.strokeRect(-30,-26,60,50);cx.beginPath();cx.moveTo(-30,-2);cx.lineTo(30,-2);cx.stroke();
  cx.restore();fingers(cx,P_,[r]);}
// a sheet held open in both hands, to read (u: how far it's unfolded)
function rr_heldOpen(u){return(cx,P_,hands)=>{const [l,r]=hands,e=easeCam(clamp(u,0,1)),mx=(l[0]+r[0])/2,h=lerp(50,118,e),my=(l[1]+r[1])/2+h/2-46,w=170;cx.save();cx.translate(mx,my);
  cx.fillStyle="rgba(70,50,30,0.18)";cx.fillRect(-w/2+6,-h/2+8,w,h);cx.fillStyle=rgba(RR.papyrus,1);cx.fillRect(-w/2,-h/2,w,h);cx.strokeStyle=rgba(wc_dim(RR.papyrus,0.3),0.6);cx.lineWidth=1.4;
  cx.beginPath();cx.moveTo(-w/2,0);cx.lineTo(w/2,0);cx.stroke();if(e>0.5){cx.strokeStyle=rgba(RR.ink,0.6*clamp(e*2-1,0,1));cx.lineWidth=2.6;cx.lineCap="round";
    const n=Math.max(1,Math.floor((h-32)/24)+1);for(let i=0;i<n;i++){cx.beginPath();cx.moveTo(w/2-16,-h/2+22+i*24);cx.lineTo(w/2-16-(i===n-1?60:130),-h/2+22+i*24);cx.stroke();}}cx.restore();fingers(cx,P_,[[mx-w/2+2,my+10],[mx+w/2-2,my+10]]);};}

/* ---------- the Nile in flood, in the late afternoon ---------- */
// from the west bank, looking east across the river: the Muqattam hills, Fustat's houses along the far bank, the long low island of
// Roda in the river with the Nilometer at its southern tip, the river wide and brown-green, and the near bank's fields with water in
// their channels; palms. The boats are drawn every frame
const RR_NL={hz:318,city:344,isl:x=>352+3*Math.sin(x/140)+(x>1240?Math.pow((x-1240)/260,2)*16:0),bank:x=>748+10*Math.sin(x/230+1)-x*0.012,tip:[1500,370],nilo:[1452,362]};
function rr_warm(ctx,y0,y1,a){ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,"rgba(255,238,214,0)");g.addColorStop(1,rgba([255,214,164],a));
  ctx.fillStyle=g;ctx.fillRect(0,y0,W,y1-y0);ctx.restore();}
function rr_paintNile(ctx){const N=RR_NL;wc_sky(ctx,N.hz+30,52,{sun:[1660,150],clouds:3,cx:160,cw:1300,cy:50,ch:130});rr_warm(ctx,0,N.hz+30,0.55);
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1660,170,420,[255,230,180],0.35);ctx.restore();
  // the Muqattam hills, pale with distance, then Fustat along the far bank
  wc_land(ctx,x=>N.hz-10-12*Math.sin(x/300+0.6)-6*Math.sin(x/97)-(x>900?(x-900)*0.012:0),RR.hill,0.22,{seed:3,line:false});
  wc_wash(ctx,[[-60,N.city-16],[W+60,N.city-16],[W+60,N.city+8],[-60,N.city+8]],wc_lit(RR.mudLt,0.1),{kind:"ground",depth:0.3,seed:5,line:false});
  rr_city(ctx,-40,W+40,N.city,0.62,11,0.34);
  // the river: the narrow channel behind the island, and the wide one in front of it, darker as it comes near; the light on it
  const riv=[[-60,N.city+2],[W+60,N.city+2],[W+60,N.bank(W)+30],[-60,N.bank(0)+30]];wc_wash(ctx,riv,RR.nile,{kind:"field",depth:0.7,seed:13});
  ctx.save();wc_tr(ctx,riv);ctx.clip();const g=ctx.createLinearGradient(0,N.city,0,N.bank(0));g.addColorStop(0,rgba(RR.nileLt,0.55));g.addColorStop(0.4,rgba(RR.nileLt,0.12));g.addColorStop(1,rgba(RR.nileDk,0.25));
  ctx.fillStyle=g;ctx.fillRect(0,N.city,W,N.bank(0)-N.city+40);ctx.globalCompositeOperation="screen";const R=wc_rng(15);
  for(let i=0;i<160;i++){const y=lerp(N.city+30,N.bank(0)-10,Math.pow(R(),1.3)),k=(y-N.city)/(N.bank(0)-N.city),x=1660+(R()-0.5)*(120+k*520),w=(16+R()*60)*(0.4+k);
    ctx.fillStyle=rgba([255,236,196],0.1+0.25*(1-Math.abs(x-1660)/(80+k*300)));ctx.fillRect(x-w/2,y,w,1.5+k*2.5);}
  ctx.globalCompositeOperation="multiply";ctx.strokeStyle=rgba(RR.nileDk,0.2);ctx.lineCap="round";for(let i=0;i<90;i++){const y=lerp(N.city+40,N.bank(0),Math.pow(R(),1.2)),k=(y-N.city)/(N.bank(0)-N.city),x=R()*W,w=(30+R()*90)*(0.4+k);
    ctx.lineWidth=1+k*2;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+w/2,y-2*k,x+w,y);ctx.stroke();}ctx.restore();
  // Roda: its long bank in the river, palms and gardens on it, and at its southern tip the Nilometer's low parapet
  const isl=[[-60,N.isl(-60)]];for(let x=-60;x<=N.tip[0];x+=20)isl.push([x,N.isl(x)]);isl.push([N.tip[0]+20,N.tip[1]],[N.tip[0]-60,N.tip[1]+6],[-60,N.tip[1]+10]);
  wc_wash(ctx,isl,[176,170,118],{kind:"ground",depth:0.5,seed:17,line:false});wc_flat(ctx,[[-60,N.tip[1]+4],[N.tip[0]-30,N.tip[1]+1],[N.tip[0]+16,N.tip[1]],[N.tip[0]-60,N.tip[1]+8],[-60,N.tip[1]+12]],wc_dim(RR.mud,0.1),0.5,"bank");
  const Q=wc_rng(19);for(let x=20;x<N.tip[0]-90;x+=24+Q()*40){if(Q()<0.55)rr_palm(ctx,x,N.isl(x)+8,46+Q()*34,(Q()-0.5)*0.12,(x|0)+3,0.5);else wc_roundTree(ctx,x,N.isl(x)+8,34+Q()*16,0.5,Q()<0.5?RR.green3:RR.palm2);}
  const [nx,ny]=N.nilo;wc_part(ctx,wc_rect(nx-26,ny-7,52,9),RR.stone,0.55,{seed:21});wc_flat(ctx,wc_rect(nx-18,ny-8,36,3),wc_dim(RR.stone,0.4),0.55,"well");
  // the near bank: its earth, the fields behind it green, with water in a channel, and palms
  const bank=[[-60,N.bank(-60)]];for(let x=-60;x<=W+60;x+=30)bank.push([x,N.bank(x)]);bank.push([W+60,H+60],[-60,H+60]);wc_wash(ctx,bank,RR.green,{kind:"ground",depth:0.95,seed:23,line:false});
  wc_wash(ctx,[[-60,N.bank(-60)-2],[W+60,N.bank(W+60)-2],[W+60,N.bank(W+60)+26],[-60,N.bank(-60)+26]],RR.dike,{kind:"field",depth:0.9,seed:25,a:0.9});
  ctx.save();wc_tr(ctx,bank);ctx.clip();const S=wc_rng(27);for(let i=0;i<7;i++){const y=N.bank(0)+40+i*i*9;ctx.strokeStyle=rgba(wc_dim(RR.green,0.25),0.3);ctx.lineWidth=1.5+i*0.6;
    ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-30+S()*10);ctx.stroke();}
  for(let i=0;i<700;i++){const x=S()*W,y=N.bank(x)+30+Math.pow(S(),1.6)*340,k=(y-740)/340;ctx.strokeStyle=rgba(S()<0.5?RR.green3:RR.green2,0.5);ctx.lineWidth=1+k*1.6;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(S()-0.5)*4,y-4-k*12);ctx.stroke();}ctx.restore();
  const ch=[];for(let i=0;i<=20;i++){const u=i/20;ch.push([lerp(260,1180,u)+60*Math.sin(u*3),lerp(H+40,N.bank(1180)+34,Math.pow(u,0.7))]);}
  wc_wash(ctx,wc_band(ch,150,14),RR.sky,{kind:"field",depth:0.9,seed:29,a:0.8});ctx.save();wc_tr(ctx,wc_band(ch,150,14));ctx.clip();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,700,980,300,[255,236,200],0.35);ctx.restore();
  wc_ink(ctx,wc_band(ch,156,16),true,1.4,wc_dim(RR.dike,0.4),0.5,31,1.2);
  rr_palm(ctx,150,H+30,780,0.06,41,1);rr_palm(ctx,330,H+60,640,-0.08,43,1);rr_palm(ctx,1820,H+40,700,-0.05,45,1);wc_roundTree(ctx,1630,N.bank(1630)+40,230,0.9,RR.green3);}

/* ---------- the farmer's field, in a flood year and in a low one ---------- */
// by the river: a field of summer crops in its plots between earth banks, a channel bringing water, palms beyond, and the family's
// mud-brick house behind it. A low year: the channel empty, the earth cracked, the crop thin, the palms dusty
const RR_FD={hz:430,F:1100,eye:1.6,house:{x0:1180,x1:1740,base:640,top:330,side:90,door:[1438,96,220]},
  farmer:[600,942,0.86],taxman:[930,946,0.88],wife:[1420,648,0.36],child:[1490,652,0.36]};
const rr_fdY=Z=>RR_FD.hz+RR_FD.F*RR_FD.eye/Z,rr_fdX=(X,Z)=>960+RR_FD.F*X/Z;
function rr_paintField(ctx,dry){const D=RR_FD,hz=D.hz,R=wc_rng(dry?61:63);wc_sky(ctx,hz+20,dry?57:55,{sun:[1700,140],clouds:dry?1:3,cx:160,cw:1300,cy:50,ch:120});
  rr_warm(ctx,0,hz+20,dry?0.75:0.5);if(dry){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([246,230,206],0.6);ctx.fillRect(0,0,W,hz+20);ctx.restore();}
  // the palms along the river, beyond the fields
  wc_wash(ctx,[[-60,hz-6],[W+60,hz-6],[W+60,hz+14],[-60,hz+14]],dry?RR.dryDk:RR.green3,{kind:"ground",depth:0.45,seed:65,line:false});
  for(let x=-30;x<W+40;x+=26+R()*36){const h=60+R()*70;if(x>1100&&x<1900&&h<100)continue;rr_palm(ctx,x,hz+8+R()*6,h,(R()-0.5)*0.14,(x|0)+7,0.42,{dry});}
  // the ground: the plots between their earth banks, running away from us
  const gr=[[-60,hz+6],[W+60,hz+6],[W+60,H+60],[-60,H+60]];wc_wash(ctx,gr,dry?RR.dry:RR.green,{kind:"ground",depth:1,seed:67,line:false});
  ctx.save();wc_tr(ctx,gr);ctx.clip();
  const bankX=[-14,-8,-3,2.5,8,14,21],bankZ=[6,11,19,34];
  if(!dry){// the crop: rows of green running to the horizon, darker and lighter plots
    for(let i=0;i<bankX.length-1;i++)for(let j=0;j<bankZ.length;j++){const x0=bankX[i],x1=bankX[i+1],z0=j?bankZ[j-1]:2.2,z1=bankZ[j];
      wc_flat(ctx,[[rr_fdX(x0,z0),rr_fdY(z0)],[rr_fdX(x1,z0),rr_fdY(z0)],[rr_fdX(x1,z1),rr_fdY(z1)],[rr_fdX(x0,z1),rr_fdY(z1)]],(i+j)%3===0?RR.green2:(i+j)%3===1?RR.green3:RR.green,0.6,"plot");}
    ctx.lineCap="round";for(let X=-16;X<24;X+=0.42){const L=[];for(let z=2.3;z<40;z*=1.08)L.push([rr_fdX(X,z),rr_fdY(z)]);ctx.strokeStyle=rgba(wc_dim(RR.green,0.3),0.28);ctx.lineWidth=1.4;wc_trOpen(ctx,L);ctx.stroke();}
    for(let i=0;i<2600;i++){const z=2.3*Math.pow(40/2.3,Math.pow(R(),0.8)),X=-16+R()*40,x=rr_fdX(X,z),y=rr_fdY(z),k=clamp(3.4/z,0,1.4);ctx.strokeStyle=rgba(R()<0.5?RR.green3:wc_lit(RR.green2,0.1),0.55);
      ctx.lineWidth=0.8+k*1.8;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(R()-0.5)*6*k,y-(5+R()*16)*k);ctx.stroke();}}
  else{// cracked earth: cells of dried mud, smaller with distance, their edges dark; thin, short stalks of the crop, few of them
    for(let i=0;i<bankX.length-1;i++)for(let j=0;j<bankZ.length;j++){const x0=bankX[i],x1=bankX[i+1],z0=j?bankZ[j-1]:2.2,z1=bankZ[j];
      wc_flat(ctx,[[rr_fdX(x0,z0),rr_fdY(z0)],[rr_fdX(x1,z0),rr_fdY(z0)],[rr_fdX(x1,z1),rr_fdY(z1)],[rr_fdX(x0,z1),rr_fdY(z1)]],(i+j)%2?wc_lit(RR.dry,0.08):RR.dryDk,0.35,"plot");}
    const cell=0.55,pts={};for(let gi=-34;gi<46;gi++)for(let gj=0;gj<70;gj++){const z=2.2*Math.pow(1.045,gj);if(z>40)break;pts[gi+","+gj]=[(gi+(hash(gi*7+gj,3)-0.5)*0.8)*cell*z/2.6,z*(1+(hash(gi+gj*13,5)-0.5)*0.035)];}
    ctx.lineCap="round";ctx.lineJoin="round";for(const key in pts){const [gi,gj]=key.split(",").map(Number),p=pts[key];for(const [di,dj] of [[1,0],[0,1]]){const q=pts[(gi+di)+","+(gj+dj)];if(!q||hash(gi*5+gj*3+di,9)<0.12)continue;
      const a=[rr_fdX(p[0],p[1]),rr_fdY(p[1])],b=[rr_fdX(q[0],q[1]),rr_fdY(q[1])],k=clamp(3/p[1],0.15,1.3),m=[(a[0]+b[0])/2+(hash(gi,gj)-0.5)*6*k,(a[1]+b[1])/2+(hash(gj,gi)-0.5)*3*k];
      ctx.strokeStyle=rgba(RR.crack,0.22+0.38*k);ctx.lineWidth=0.6+k*2;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(m[0],m[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}
    for(let i=0;i<520;i++){const z=2.3*Math.pow(40/2.3,Math.pow(R(),0.8)),X=-16+R()*40,x=rr_fdX(X,z),y=rr_fdY(z),k=clamp(3.4/z,0,1.4),hh=(8+R()*20)*k;ctx.strokeStyle=rgba(R()<0.6?RR.straw:[176,166,106],0.7);
      ctx.lineWidth=0.7+k*1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+2*k,y-hh*0.6,x+(R()-0.3)*6*k,y-hh);ctx.stroke();if(k>0.5&&R()<0.4){ctx.fillStyle=rgba(RR.straw,0.8);ell(ctx,x+(R()-0.3)*6*k,y-hh-3*k,1.6*k,4*k,0.2);ctx.fill();}}}
  // the earth banks between the plots: raised, lit on one side
  for(const X of bankX){const L=[],L2=[];for(let z=2.2;z<40;z*=1.06){L.push([rr_fdX(X-0.18,z),rr_fdY(z)]);L2.push([rr_fdX(X+0.18,z),rr_fdY(z)]);}
    wc_wash(ctx,L.concat(L2.reverse()),dry?wc_lit(RR.dryDk,0.1):RR.dike,{kind:"field",depth:1,seed:(X*7|0)+69,a:0.85});}
  for(const Z of bankZ){wc_wash(ctx,[[-60,rr_fdY(Z)-2],[W+60,rr_fdY(Z)-2],[W+60,rr_fdY(Z)+3+30/Z],[-60,rr_fdY(Z)+3+30/Z]],dry?wc_lit(RR.dryDk,0.1):RR.dike,{kind:"field",depth:1,seed:(Z|0)+71,a:0.8});}
  // the channel bringing the river's water: from the near left, between the plots, towards the house
  const ch=[];for(let i=0;i<=24;i++){const u=i/24,z=lerp(2.2,26,Math.pow(u,1.7)),X=lerp(-3.4,5.6,Math.pow(u,0.8))+0.6*Math.sin(u*4);ch.push([rr_fdX(X,z),rr_fdY(z)]);}
  const cw=ch.map((p,i)=>1.1*RR_FD.F/lerp(2.2,26,Math.pow(i/24,1.7)));const band=(() =>{const Lf=[],Rt=[];ch.forEach((p,i)=>{const w=cw[i]/2;Lf.push([p[0]-w,p[1]]);Rt.push([p[0]+w,p[1]]);});return Lf.concat(Rt.reverse());})();
  wc_wash(ctx,band,dry?RR.dryDk:wc_dim(RR.dike,0.12),{kind:"field",depth:1,seed:73});
  if(!dry){const inner=(()=>{const Lf=[],Rt=[];ch.forEach((p,i)=>{const w=cw[i]*0.36;Lf.push([p[0]-w,p[1]+2]);Rt.push([p[0]+w,p[1]+2]);});return Lf.concat(Rt.reverse());})();
    wc_wash(ctx,inner,RR.sky,{kind:"field",depth:1,seed:75,a:0.85});ctx.save();wc_tr(ctx,inner);ctx.clip();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,ch[4][0],ch[4][1],260,[255,240,210],0.4);ctx.restore();}
  else{ctx.save();wc_tr(ctx,band);ctx.clip();ctx.strokeStyle=rgba(RR.crack,0.5);ctx.lineWidth=1.6;for(let i=0;i<60;i++){const p=ch[Math.floor(R()*20)],w=cw[Math.floor(R()*20)]*0.4;
    ctx.beginPath();ctx.moveTo(p[0]+(R()-0.5)*w,p[1]+(R()-0.5)*w*0.2);ctx.lineTo(p[0]+(R()-0.5)*w*1.4,p[1]+(R()-0.5)*w*0.3);ctx.stroke();}ctx.restore();}
  ctx.restore();
  // the house, a palm behind it, and a sycamore at the field's edge
  rr_palm(ctx,1870,D.house.base-10,560,-0.06,77,1,{dry});rr_palm(ctx,1110,D.house.base-40,420,0.08,79,0.95,{dry});
  const Hs=D.house;rr_house(ctx,Hs.x0,Hs.x1,Hs.base,Hs.top,Hs.side,Hs.door,{dry});
  wc_roundTree(ctx,120,hz+150,300,0.95,dry?wc_lit(RR.palm2,0.25):RR.green3);}
function rr_paintGreen(ctx){rr_paintField(ctx,false);}
function rr_paintDry(ctx){rr_paintField(ctx,true);}
// the family at the house's door: his wife and their son, the son near her (look: 0 to 1, they turn to the field)
function rr_family(x,tt,o){o=o||{};const D=RR_FD,[wx,wy,ws]=D.wife,[cx,cy,cs]=D.child;
  person(x,"rr_wife",wx,wy,ws,{pose:"listen",expr:o.expr||"calm",t:tt,flip:true});person(x,"rr_child",cx,cy,cs,{pose:o.child||"stand",expr:o.expr||"calm",t:tt+1,flip:true});}

/* ---------- Roda Island's southern tip ---------- */
// on the island, looking across the narrow channel to Fustat: the Nilometer's low stone parapet framing its square opening at the
// river's edge, the stair going down into it at one corner; to the right, stone steps to the water where boats come in; palms.
// The well's opening is set out in depth (X across, Z away, metres; camera C), the rest is painted on the picture
const RR_RD={C:{F:1300,hz:380,ch:2.4},well:{x0:-6.6,x1:-0.4,z0:9.6,z1:15.8,h:0.7,t:0.55},shore:x=>x<1260?560+x*0.02:585+Math.pow((x-1260)/660,1.6)*300,
  steps:[1360,1660],scribe:[1450,690,0.6],boat:[1560,742,0.95]};
const rr_rdp=(X,Y,Z)=>{const C=RR_RD.C;return[960+C.F*X/Z,C.hz+C.F*(C.ch-Y)/Z];};
function rr_paintRoda(ctx){const D=RR_RD,hz=D.C.hz;wc_sky(ctx,hz-30,58,{sun:[260,130],clouds:3,cx:300,cw:1400,cy:40,ch:120});rr_warm(ctx,0,hz,0.5);
  wc_land(ctx,x=>hz-58-16*Math.sin(x/320+1.4)-8*Math.sin(x/110),RR.hill,0.3,{seed:81,line:false});
  wc_wash(ctx,[[-60,hz-18],[W+60,hz-18],[W+60,hz+6],[-60,hz+6]],RR.mudLt,{kind:"ground",depth:0.45,seed:83,line:false});rr_city(ctx,-40,W+40,hz+2,1.2,85,0.5);
  // the channel: brown-green, lit by the low sun, darker towards us
  const wat=[[-60,hz+4],[W+60,hz+4],[W+60,H+60],[-60,H+60]];wc_wash(ctx,wat,RR.nile,{kind:"field",depth:0.85,seed:87});
  ctx.save();wc_tr(ctx,wat);ctx.clip();const g=ctx.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(RR.nileLt,0.5));g.addColorStop(0.5,rgba(RR.nileLt,0.1));g.addColorStop(1,rgba(RR.nileDk,0.3));ctx.fillStyle=g;ctx.fillRect(0,hz,W,H-hz);
  const R=wc_rng(89);ctx.globalCompositeOperation="screen";for(let i=0;i<90;i++){const y=lerp(hz+8,700,Math.pow(R(),1.4)),k=(y-hz)/320,x=260+(R()-0.5)*(100+k*420),w=(20+R()*50)*(0.5+k);
    ctx.fillStyle=rgba([255,236,196],0.12+0.2*R());ctx.fillRect(x-w/2,y,w,1.5+k*2);}ctx.restore();
  // the island: its earth, a paving of stone round the well, palms
  const isl=[[-60,D.shore(-60)]];for(let x=-60;x<=W+60;x+=20)isl.push([x,D.shore(x)]);isl.push([W+60,H+60],[-60,H+60]);
  wc_wash(ctx,isl,[200,180,134],{kind:"ground",depth:1,seed:91,line:false});wc_wash(ctx,[[-60,D.shore(-60)-3],[W+60,D.shore(W+60)-3],[W+60,D.shore(W+60)+14],[-60,D.shore(-60)+14]],wc_dim(RR.mud,0.12),{kind:"field",depth:1,seed:93,a:0.8});
  const W_=D.well,pv=[rr_rdp(W_.x0-2.2,0,W_.z0-2.6),rr_rdp(W_.x1+2.6,0,W_.z0-2.6),rr_rdp(W_.x1+2.2,0,W_.z1+1.2),rr_rdp(W_.x0-1.6,0,W_.z1+1.2)];
  wc_wash(ctx,pv,RR.stoneLt,{kind:"field",depth:1,seed:95,a:0.85});ctx.save();wc_tr(ctx,pv);ctx.clip();ctx.strokeStyle=rgba(RR.stoneDk,0.35);ctx.lineWidth=1.4;
  for(let z=W_.z0-2.6;z<W_.z1+1.2;z+=0.9){const a=rr_rdp(W_.x0-3,0,z),b=rr_rdp(W_.x1+3,0,z);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  for(let X=W_.x0-3;X<W_.x1+3;X+=1.1){const a=rr_rdp(X,0,W_.z0-2.6),b=rr_rdp(X,0,W_.z1+1.2);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  for(const [x,y,h,l,s] of [[90,D.shore(90)+30,500,0.05,97],[250,D.shore(250)+12,380,-0.07,98],[1780,D.shore(1780)+8,520,-0.04,99]])rr_palm(ctx,x,y,h,l,s,1);
  // the well: the dark opening, the far wall's inside going down into the shade, the parapet's four sides with their courses
  rr_parapet(ctx);
  // the steps down to the water, at the landing
  const [s0,s1]=D.steps;for(let i=0;i<6;i++){const y=D.shore(s0)+4+i*26,x0=s0-i*14,x1=s1+i*18;wc_part(ctx,[[x0,y],[x1,y],[x1+10,y+24],[x0-8,y+24]],i%2?RR.stone:RR.stoneLt,1,{seed:101+i,lw:1.2});}
  ctx.save();ctx.globalCompositeOperation="multiply";const sg=ctx.createLinearGradient(0,D.shore(s0)+100,0,D.shore(s0)+170);sg.addColorStop(0,"rgba(255,255,255,0)");sg.addColorStop(1,rgba(RR.nile,0.8));
  ctx.fillStyle=sg;ctx.fillRect(s0-120,D.shore(s0)+90,s1-s0+240,90);ctx.restore();}
// the parapet round the opening, as the island's camera sees it: the opening's dark, the far side's inner face, the near side and the
// two ends with their tops, their courses of stone, the gap where the stair goes in
function rr_parapet(ctx){const D=RR_RD,w=D.well,h=w.h,t=w.t,P=(X,Y,Z)=>rr_rdp(X,Y,Z);
  const op=[P(w.x0,0,w.z0),P(w.x1,0,w.z0),P(w.x1,0,w.z1),P(w.x0,0,w.z1)];wc_flat(ctx,op,[58,52,48],1,"well");
  const inner=[P(w.x0,h,w.z1),P(w.x1,h,w.z1),P(w.x1,-3,w.z1),P(w.x0,-3,w.z1)];ctx.save();wc_tr(ctx,op.concat([]));ctx.clip();
  wc_wash(ctx,inner,wc_dim(RR.stone,0.35),{kind:"field",depth:1,seed:111});const g=ctx.createLinearGradient(0,P(0,h,w.z1)[1],0,P(0,-2,w.z1)[1]);g.addColorStop(0,"rgba(40,34,30,0)");g.addColorStop(1,"rgba(40,34,30,0.8)");
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.strokeStyle=rgba(wc_dim(RR.stone,0.55),0.5);ctx.lineWidth=1.4;for(let Y=h-0.35;Y>-3;Y-=0.35){const a=P(w.x0,Y,w.z1),b=P(w.x1,Y,w.z1);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  const side=(pts,col,seed)=>{wc_part(ctx,pts,col,1,{seed,lw:1.3});};
  // the far side's top, then the two ends (the right one in shade), then the near side, its outer face and its top
  side([P(w.x0-t,h,w.z1),P(w.x1+t,h,w.z1),P(w.x1+t,h,w.z1+t),P(w.x0-t,h,w.z1+t)],RR.stoneLt,113);
  side([P(w.x0-t,0,w.z0),P(w.x0-t,h,w.z0),P(w.x0-t,h,w.z1+t),P(w.x0-t,0,w.z1+t)],RR.stone,115);
  side([P(w.x0-t,h,w.z0-t),P(w.x0,h,w.z0-t),P(w.x0,h,w.z1),P(w.x0-t,h,w.z1)],RR.stoneLt,117);
  side([P(w.x1,h,w.z0-t),P(w.x1+t,h,w.z0-t),P(w.x1+t,h,w.z1),P(w.x1,h,w.z1)],RR.stoneLt,119);
  side([P(w.x1,0,w.z0),P(w.x1,h,w.z0),P(w.x1,h,w.z1),P(w.x1,0,w.z1)],wc_dim(RR.stone,0.2),121);
  const front=[P(w.x0-t,0,w.z0-t),P(w.x1+t,0,w.z0-t),P(w.x1+t,h,w.z0-t),P(w.x0-t,h,w.z0-t)];side(front,RR.stone,123);
  ctx.save();wc_tr(ctx,front);ctx.clip();ctx.strokeStyle=rgba(RR.stoneDk,0.45);ctx.lineWidth=1.6;for(const Y of [0.23,0.46]){const a=P(w.x0-t,Y,w.z0-t),b=P(w.x1+t,Y,w.z0-t);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  for(let X=w.x0-t+0.5,i=0;X<w.x1+t;X+=0.9,i++){const yy=i%2?0.23:0;const a=P(X,yy,w.z0-t),b=P(X,yy+0.23,w.z0-t);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  side([P(w.x0-t,h,w.z0-t),P(w.x1+t,h,w.z0-t),P(w.x1+t,h,w.z0),P(w.x0-t,h,w.z0)],RR.stoneLt,125);
  wc_contact(ctx,P(w.x0-t,0,w.z0-t)[0],P(w.x1+t,0,w.z0-t)[0],P(0,0,w.z0-t)[1]+4,1,0.3);}

/* ---------- the well ---------- */
// inside the Nilometer, from just under its rim at the west wall, looking east and down: a square well of dressed stone (X across, Y
// up from its floor, Z away, metres), the stair coming down the south wall (on the right) and on along the east wall under the water;
// three pointed arches on small columns in the east wall, at three heights, where the river comes in; in the middle the octagonal
// marble column, cubits cut into it (a cubit is about 54 cm), tied at its top by a wooden beam running east to west; a plain band along
// the top of the walls where the inscriptions are. Two cameras: the well, and the column close. The water and the column are drawn
// every frame, so the water can rise
const RR_WL={X:3.1,Z:5.7,top:11.6,cub:0.54,colZ:3.1,colR:0.21,colTop:10.5,beam:[10.5,10.78,0.13],
  main:{F:807,hz:40,Y:10.8,Z:0},close:{F:1900,hz:25,Y:9.4,Z:0.4},
  sR:{x0:2.2,x1:3.1,z0:0.6,z1:5.25,y0:11.6,y1:8.0,n:14},sF:{z0:4.8,z1:5.7,x0:2.65,x1:-3.1,y0:8.0,y1:3.7,n:17},
  arches:[[-2.15,9.35],[-0.95,7.95],[1.45,6.55]],aw:0.9,ah:1.62};
const rr_wpj=(C,X,Y,Z)=>{const z=Math.max(0.05,Z-C.Z);return[960+C.F*X/z,C.hz+C.F*(C.Y-Y)/z];};
// a cubit's height on the column, in metres from the floor (the column's foot is the floor's level, its marks start there)
const rr_cub=k=>k*RR_WL.cub;
// the stair's steps as boxes: [x0, x1, z0, z1, top]; the south wall's run, then the east wall's
function rr_steps(){const L=RR_WL,o=[],a=L.sR,b=L.sF;for(let i=0;i<a.n;i++){const z0=lerp(a.z0,a.z1,i/a.n),z1=lerp(a.z0,a.z1,(i+1)/a.n);o.push([a.x0,a.x1,z0,z1,lerp(a.y0,a.y1,(i+1)/a.n),"s"]);}
  o.push([2.2,3.1,a.z1,b.z1,a.y1,"c"]);for(let i=0;i<b.n;i++){const x0=lerp(b.x0-0.45,b.x1,i/b.n),x1=lerp(b.x0-0.45,b.x1,(i+1)/b.n);o.push([x1,x0,b.z0,b.z1,lerp(b.y0,b.y1,(i+1)/b.n),"e"]);}return o;}
const RR_STEPS=rr_steps();
// the faces of a step the camera sees: its tread, and its side towards the well's middle (the south run's) or its front (the east run's)
function rr_stepFaces(s,low){const [x0,x1,z0,z1,y,k]=s,b=low==null?-1:low;const f=[[[x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1]]];
  if(k==="s"||k==="c")f.push([[x0,y,z0],[x0,y,z1],[x0,b,z1],[x0,b,z0]]);if(k==="e"||k==="c")f.push([[x0,y,z0],[x1,y,z0],[x1,b,z0],[x0,b,z0]]);if(k==="e"&&x1>0)f.push([[x1,y,z0],[x1,y,z1],[x1,b,z1],[x1,b,z0]]);return f;}
// a polygon cut to what's above the water (Y >= L)
function rr_above(poly,L){const o=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ia=a[1]>=L,ib=b[1]>=L;if(ia)o.push(a);
  if(ia!==ib){const u=(L-a[1])/(b[1]-a[1]);o.push([lerp(a[0],b[0],u),L,lerp(a[2],b[2],u)]);}}return o;}
function rr_paintWellAt(ctx,C){const L=RR_WL,P=(X,Y,Z)=>rr_wpj(C,X,Y,Z),R=wc_rng(131),zn=C.Z+0.06;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const quad=(pts,col,seed,kind)=>wc_wash(ctx,pts.map(p=>P(...p)),col,{kind:kind||"field",depth:1,seed,a:0.95});
  // the three walls: the north (left) in the afternoon light, the east (far) lit above and shaded under, the south (right) in shade
  quad([[-L.X,L.top+1,zn],[-L.X,L.top+1,L.Z],[-L.X,-1,L.Z],[-L.X,-1,zn]],RR.stone,133);
  quad([[L.X,L.top+1,zn],[L.X,L.top+1,L.Z],[L.X,-1,L.Z],[L.X,-1,zn]],wc_dim(RR.stone,0.22),135);
  quad([[-L.X,L.top+1,L.Z],[L.X,L.top+1,L.Z],[L.X,-1,L.Z],[-L.X,-1,L.Z]],wc_dim(RR.stone,0.06),137);
  // their courses of stone, and the joints between the blocks, staggered
  ctx.save();ctx.lineCap="round";const ln=(a,b,al,lw)=>{const p=P(...a),q=P(...b);ctx.strokeStyle=rgba(wc_dim(RR.stone,0.5),al);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();};
  for(let Y=L.top,i=0;Y>-1;Y-=0.36,i++){ln([-L.X,Y,zn],[-L.X,Y,L.Z],0.4,1.8);ln([L.X,Y,zn],[L.X,Y,L.Z],0.4,1.8);ln([-L.X,Y,L.Z],[L.X,Y,L.Z],0.42,1.6);
    for(let X=-L.X+(i%2?0.35:0.75);X<L.X;X+=0.8+R()*0.2)ln([X,Y,L.Z],[X,Y-0.36,L.Z],0.3,1.2);
    for(let Z=zn+(i%2?0.3:0.7);Z<L.Z;Z+=0.8+R()*0.2){ln([-L.X,Y,Z],[-L.X,Y-0.36,Z],0.28,1.4);ln([L.X,Y,Z],[L.X,Y-0.36,Z],0.28,1.4);}}
  ctx.restore();
  // weathering: a few darker stones, the water's old marks low on the walls
  for(let i=0;i<46;i++){const X=-L.X+R()*L.X*2,Y=Math.floor(R()*30)*0.36+0.4,w=0.7;quad([[X,Y,L.Z],[X+w,Y,L.Z],[X+w,Y-0.36,L.Z],[X,Y-0.36,L.Z]],wc_dim(RR.stone,0.12+R()*0.1),141+i,"dab");}
  // the plain band along the top of the walls, where the inscriptions are (painted without letters)
  for(const [a,b] of [[[-L.X,10.62,zn],[-L.X,10.62,L.Z]],[[-L.X,10.62,L.Z],[L.X,10.62,L.Z]],[[L.X,10.62,L.Z],[L.X,10.62,zn]]]){
    const q=[a,b,[b[0],b[1]+0.46,b[2]],[a[0],a[1]+0.46,a[2]]];quad(q,wc_lit(RR.stone,0.12),151,"swatch");
    ctx.save();ctx.strokeStyle=rgba(wc_dim(RR.stone,0.45),0.6);ctx.lineWidth=2;for(const yy of [0,0.46]){const p=P(a[0],a[1]+yy,a[2]),q2=P(b[0],b[1]+yy,b[2]);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q2[0],q2[1]);ctx.stroke();}ctx.restore();}
  // the three arches in the east wall: a pointed arch in a frame, on two small columns with round bases and capitals, dark inside
  for(const [X,sill] of L.arches){const w=L.aw,h=L.ah,outline=rr_arch(X,w/2,sill,sill+h*0.6,1,0.5);
    const fr=outline.map(([px,py])=>[X+(px-X)*1.28,sill+(py-sill)*1.12-0.08]);
    wc_wash(ctx,fr.map(([px,py])=>P(px,py,L.Z)),wc_lit(RR.stone,0.1),{kind:"build",depth:1,seed:(X*10|0)+161,lw:1.2});
    wc_flat(ctx,outline.map(([px,py])=>P(px,py,L.Z)),[62,56,50],1,"arch");
    for(const s of [-1,1]){const cx=X+s*(w/2+0.07);quad([[cx-0.06,sill+h*0.58,L.Z-0.02],[cx+0.06,sill+h*0.58,L.Z-0.02],[cx+0.06,sill+0.12,L.Z-0.02],[cx-0.06,sill+0.12,L.Z-0.02]],RR.stoneLt,171,"thing");
      const b=P(cx,sill+0.07,L.Z-0.03),k=C.F/(L.Z-C.Z);wc_wash(ctx,wc_ell(b[0],b[1],0.1*k,0.07*k,16),RR.stoneLt,{kind:"thing",depth:1,seed:173,lw:1});
      const cp=P(cx,sill+h*0.6,L.Z-0.03);wc_wash(ctx,wc_rect(cp[0]-0.09*k,cp[1]-0.05*k,0.18*k,0.08*k),RR.stoneLt,{kind:"thing",depth:1,seed:175,lw:1});}}
  // the stair: each step's tread lit, its side or front in shade, from the top down
  RR_STEPS.forEach((s,i)=>{const F=rr_stepFaces(s);F.forEach((f,j)=>wc_wash(ctx,f.map(p=>P(...p)),j===0?RR.stoneLt:wc_dim(RR.stone,j===1?0.28:0.2),{kind:"build",depth:1,seed:181+i*3+j,lw:1.2}));});
  // the shadow at the walls' foot of the light that comes from above
  ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createRadialGradient(960,C.hz+40,80,960,C.hz+200,1100);g.addColorStop(0,"rgba(255,250,240,0)");g.addColorStop(1,"rgba(150,130,110,0.35)");
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();}
function rr_paintWell(ctx){rr_paintWellAt(ctx,RR_WL.main);}
function rr_paintColumnBack(ctx){rr_paintWellAt(ctx,RR_WL.close);}
// the beam over the column, as the well's camera sees it: from the column's top to the east wall, so the camera, under the west rim,
// looks along it: its end on the capital, and its top going away, a sliver (the camera is just above it). In front of everything,
// painted on its own (the place's front layer)
function rr_paintWellFront(ctx){const L=RR_WL,C=L.main,[y0,y1,w]=L.beam,P=(X,Y,Z)=>rr_wpj(C,X,Y,Z),zn=L.colZ-w;
  const top=[P(-w,y1,zn),P(w,y1,zn),P(w,y1,L.Z),P(-w,y1,L.Z)],end=[P(-w,y1,zn),P(w,y1,zn),P(w,y0,zn),P(-w,y0,zn)];
  wc_wash(ctx,top,wc_lit(RR.wood,0.2),{kind:"build",depth:1,seed:195,lw:1.2});wc_wash(ctx,end,wc_dim(RR.wood,0.08),{kind:"build",depth:1,seed:193,lw:1.2});
  // the end grain's rings
  const c=P(0,(y0+y1)/2,zn),k=C.F/(zn-C.Z);ctx.save();wc_tr(ctx,end);ctx.clip();ctx.strokeStyle=rgba(RR.woodDk,0.35);ctx.lineWidth=1.2;
  for(const r of [0.04,0.08,0.12]){ctx.beginPath();ctx.ellipse(c[0]+k*0.03,c[1]+k*0.02,r*k,r*k*0.8,0,0,TAU);ctx.stroke();}ctx.restore();}
// the column: octagonal, white marble, its three near faces (lit, front, shaded); every cubit a groove cut round it, every sixth of one
// a short tick on its front face, its capital under the beam. Kept for each camera, from its top down to the floor
function rr_columnC(C){return wc_kept("rrCol"+C.F,W,H*2,q=>{const L=RR_WL,P=(Y)=>rr_wpj(C,0,Y,L.colZ-L.colR),k=C.F/(L.colZ-L.colR-C.Z),hw=L.colR*k,x0=960-hw,x1=960+hw,yt=P(L.colTop)[1],yb=P(0)[1];
  const f=[[x0,x0+hw*0.62,wc_lit(RR.marble,0.02)],[x0+hw*0.62,x1-hw*0.62,RR.marble],[x1-hw*0.62,x1,wc_dim(RR.marble,0.14)]];
  f.forEach(([a,b,c],i)=>wc_wash(q,wc_rect(a,yt,b-a,yb-yt),c,{kind:"build",depth:1,seed:201+i,lw:1.3}));
  q.save();q.globalCompositeOperation="multiply";const g=q.createLinearGradient(x0,0,x1,0);g.addColorStop(0,"rgba(230,222,210,0.4)");g.addColorStop(0.45,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(170,160,150,0.45)");q.fillStyle=g;q.fillRect(x0,yt,x1-x0,yb-yt);
  // the marble's veins
  q.strokeStyle="rgba(150,146,150,0.18)";q.lineWidth=Math.max(1,k*0.004);const R=wc_rng(203);for(let i=0;i<26;i++){const y=lerp(yt,yb,R());q.beginPath();q.moveTo(x0,y);q.bezierCurveTo(x0+hw*0.6,y+k*0.1*(R()-0.5),x1-hw*0.6,y+k*0.2*(R()-0.5),x1,y+k*0.15*(R()-0.5));q.stroke();}q.restore();
  for(let c=1;c<=19;c++){const y=P(rr_cub(c))[1],lw=Math.max(1.6,k*0.012);q.strokeStyle=rgba([110,104,100],0.78);q.lineWidth=lw;q.beginPath();q.moveTo(x0,y+k*0.008);q.lineTo(x0+hw*0.62,y);q.lineTo(x1-hw*0.62,y);q.lineTo(x1,y+k*0.008);q.stroke();
    q.strokeStyle="rgba(255,255,255,0.6)";q.lineWidth=lw*0.5;q.beginPath();q.moveTo(x0+hw*0.62,y+lw*0.8);q.lineTo(x1-hw*0.62,y+lw*0.8);q.stroke();
    for(let s=1;s<6;s++){const ys=P(rr_cub(c-1+s/6))[1],l=s===3?0.55:0.3;q.strokeStyle=rgba([120,114,110],0.6);q.lineWidth=Math.max(1,k*0.006);q.beginPath();q.moveTo(960-hw*0.38*l*2,ys);q.lineTo(960+hw*0.38*l*2,ys);q.stroke();}}
  // the capital: a broader block, its moulding
  wc_wash(q,[[x0-hw*0.3,yt+k*0.02],[x1+hw*0.3,yt+k*0.02],[x1+hw*0.12,yt+k*0.26],[x0-hw*0.12,yt+k*0.26]],RR.marble,{kind:"build",depth:1,seed:205,lw:1.3});
  q.strokeStyle=rgba(RR.marbleDk,0.7);q.lineWidth=Math.max(1.4,k*0.01);q.beginPath();q.moveTo(x0-hw*0.18,yt+k*0.13);q.lineTo(x1+hw*0.18,yt+k*0.13);q.stroke();});}
// where the water meets the column, on screen, for a camera and a level L (metres)
const rr_waterY=(C,L,Z)=>rr_wpj(C,0,L,Z==null?RR_WL.colZ-RR_WL.colR:Z)[1];
// the water at level L, drawn in a spare canvas: lit from the far wall, darker towards us, its ripples moving slowly, the column's
// reflection; then the steps above it are lifted out of it, so they stand dry, and it's laid over the well, a little clear
function rr_water(ctx,C,L,t){const W_=RR_WL,P=(X,Z)=>rr_wpj(C,X,L,Z),[bc,bx]=wc_buf("rrWater",ctx.canvas.width,ctx.canvas.height);bx.setTransform(ctx.getTransform());
  const zn=C.Z+0.3,pts=[P(-W_.X,W_.Z),P(W_.X,W_.Z),P(W_.X,zn),P(-W_.X,zn)],yf=P(0,W_.Z)[1];
  bx.save();wc_tr(bx,pts);bx.clip();const g=bx.createLinearGradient(0,yf,0,H*1.4);g.addColorStop(0,rgba(wc_lit(RR.nile,0.18),1));g.addColorStop(0.25,rgba(RR.nile,1));g.addColorStop(1,rgba(RR.nileDk,1));
  bx.fillStyle=g;bx.fillRect(-W,yf-10,3*W,H*2);
  // the light of the lit wall, laid on the water near it; the column's reflection, wavering; ripples, slowly
  bx.globalCompositeOperation="screen";const lg=bx.createLinearGradient(0,yf,0,yf+(C.F/(W_.Z-C.Z))*1.2);lg.addColorStop(0,"rgba(255,226,170,0.35)");lg.addColorStop(1,"rgba(255,226,170,0)");bx.fillStyle=lg;bx.fillRect(-W,yf,3*W,H);
  const k=C.F/(W_.colZ-C.Z),cy=rr_waterY(C,L),hw=W_.colR*k;for(let i=0;i<14;i++){const y=cy+i*hw*0.35,ww=hw*(1.6-i*0.05),dx=Math.sin(t*1.6+i*1.3)*hw*0.25;bx.fillStyle=rgba([255,250,236],0.16*(1-i/14));bx.fillRect(960-ww/2+dx,y,ww,hw*0.22);}
  bx.globalCompositeOperation="multiply";bx.strokeStyle=rgba(RR.nileDk,0.28);bx.lineCap="round";for(let i=0;i<26;i++){const z=lerp(W_.Z-0.1,zn+0.4,Math.pow((i+((t*0.15)%1))/26,0.8)),y=P(0,z)[1],lw=Math.max(1,(C.F/(z-C.Z))*0.012);
    bx.lineWidth=lw;for(let j=0;j<5;j++){const X=-W_.X+(j+hash(i,j)*0.6)*W_.X*0.42,a=P(X,z),b=P(X+0.5+hash(j,i)*0.6,z);bx.beginPath();bx.moveTo(a[0],a[1]);bx.quadraticCurveTo((a[0]+b[0])/2,a[1]-lw*1.5,b[0],b[1]);bx.stroke();}}
  bx.restore();
  // the stair above the water, lifted out
  bx.save();bx.globalCompositeOperation="destination-out";bx.fillStyle="#000";RR_STEPS.forEach(s=>{if(s[4]<L)return;rr_stepFaces(s,L-0.02).forEach(f=>{const a=rr_above(f,L);if(a.length<3)return;wc_tr(bx,a.map(p=>rr_wpj(C,...p)));bx.fill();});});bx.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=0.9;ctx.drawImage(bc,0,0);ctx.restore();
  // a line of light where it meets the walls
  ctx.save();ctx.strokeStyle="rgba(255,244,220,0.35)";ctx.lineWidth=2;const a=P(-W_.X,W_.Z),b=P(W_.X,W_.Z);ctx.beginPath();ctx.moveTo(P(-W_.X,zn)[0],P(-W_.X,zn)[1]);ctx.lineTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.restore();}
// the column above the water (lit16, 0 to 1: its sixteenth mark lit gold), and the ring of ripples where it stands in the water
function rr_column(ctx,C,L,t,lit16){const W_=RR_WL,y=rr_waterY(C,L),k=C.F/(W_.colZ-W_.colR-C.Z),hw=W_.colR*k;ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,y+H);ctx.clip();ctx.drawImage(rr_columnC(C),0,0,W,H*2);ctx.restore();
  if(lit16>0.01){const y16=rr_wpj(C,0,rr_cub(16),W_.colZ-W_.colR)[1];withA(ctx,clamp(lit16,0,1),()=>{ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,y16,hw*3.2,[255,214,120],0.55);ctx.restore();
    ctx.strokeStyle=rgba(GV.gold,1);ctx.lineWidth=Math.max(3,k*0.022);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(960-hw,y16+k*0.008);ctx.lineTo(960-hw*0.38,y16);ctx.lineTo(960+hw*0.38,y16);ctx.lineTo(960+hw,y16+k*0.008);ctx.stroke();});}
  const rw=hw*1.25;ctx.save();ctx.strokeStyle="rgba(255,248,230,0.55)";ctx.lineWidth=Math.max(1.5,k*0.008);for(let i=0;i<3;i++){const u=((t*0.5+i/3)%1),r=rw*(1+u*1.4);ctx.globalAlpha=(1-u)*0.8;
    ctx.beginPath();ctx.ellipse(960,y+k*0.01,r,r*0.16,0,0.05*Math.PI,0.95*Math.PI);ctx.stroke();}ctx.restore();}
// the afternoon's light on the walls: a warm light above the shadow the west wall throws on the east wall, which climbs as the sun goes
// down (day, 0 to 1 through an afternoon); and a dusk between one day and the next (dusk, 0 to 1)
function rr_wellLight(ctx,C,day,dusk){const L=RR_WL,P=(X,Y,Z)=>rr_wpj(C,X,Y,Z),ys=lerp(7.4,10.2,easeCam(clamp(day,0,1))),tilt=0.5;
  ctx.save();ctx.globalCompositeOperation="screen";const lit=[P(-L.X,L.top+1,L.Z),P(L.X,L.top+1,L.Z),P(L.X,ys-tilt,L.Z),P(-L.X,ys+tilt,L.Z)];
  ctx.fillStyle=rgba([255,222,160],0.24*(1-dusk));wc_tr(ctx,lit);ctx.fill();const lw=[P(-L.X,L.top+1,C.Z+0.1),P(-L.X,L.top+1,L.Z),P(-L.X,ys+tilt,L.Z),P(-L.X,ys+tilt+1.4,C.Z+1)];
  ctx.fillStyle=rgba([255,222,160],0.16*(1-dusk));wc_tr(ctx,lw);ctx.fill();ctx.restore();
  if(dusk>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[120,120,150],dusk),1);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}}
// where someone stands on the stair a little above the water (L): on the south run, or on the east run under it; returns the screen
// point of their feet and their scale (s=1 is 560 px tall)
function rr_onStair(C,Y,dx){const L=RR_WL,a=L.sR,b=L.sF;let X,Z;if(Y>=a.y1){Z=lerp(a.z0,a.z1,(a.y0-Y)/(a.y0-a.y1));X=2.62+(dx||0);}else{X=lerp(b.x0-0.45,b.x1,(b.y0-Y)/(b.y0-b.y1));Z=5.25;}
  const [x,y]=rr_wpj(C,X,Y,Z);return{x,y,s:1.7*C.F/(Z-C.Z)/560};}
// the well with its water at L, the light of the day, the keeper reading it and the scribe writing it down, the column, the beam
function rr_well(x,tt,o){const C=RR_WL.main;rr_wellLight(x,C,o.day||0,0);rr_water(x,C,o.L,tt);
  if(o.keeper!==false){const ky=o.ky||o.L+0.3,k=rr_onStair(C,ky,-0.2),sc=rr_onStair(C,ky+0.55,0.22);
    person(x,"rr_scribe",sc.x,sc.y,sc.s,{pose:"write",t:tt,flip:true,carry:rr_heldSheet(tt),shadow:false});
    person(x,"rr_keeper",k.x,k.y,k.s,{pose:"stand",pose2:"rr_read",mix:o.read==null?1:o.read,t:tt+2,flip:true,shadow:false});}
  rr_column(x,C,o.L,tt,o.lit16||0);x.drawImage(gv_place("wellFront"),0,0,W,H);
  if(o.dusk>0.01){x.save();x.globalCompositeOperation="multiply";x.fillStyle=rgba(mix([255,255,255],[120,120,150],o.dusk),1);x.fillRect(-W,-H,3*W,3*H);x.restore();}}
// the column, close, with its water at L
function rr_columnClose(x,tt,L,lit16){const C=RR_WL.close;rr_water(x,C,L,tt);rr_column(x,C,L,tt,lit16);}

/* ---------- an office in Fustat ---------- */
// plastered walls, a window onto the river in the low sun, niches with rolled papyri, a low bench along the wall with a cushion, a mat;
// the official stands in the light from the window with the keeper's sheet
const RR_DW={fy:820,win:[230,170,380,470],official:[1180,900,0.82]};
function rr_paintDiwan(ctx){const D=RR_DW,wall=RR.plaster;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,D.fy+40),wall,{kind:"plaster",line:false,seed:221});
  wc_wash(ctx,wc_rect(-40,D.fy,W+80,H-D.fy+40),[210,182,138],{kind:"ground",line:false,seed:223});wc_flat(ctx,wc_rect(-40,D.fy-12,W+80,14),wc_dim(wall,0.16),1,"skirting");
  // the window: a pointed arch, the river and palms through it in the low sun, its sill, the light on the floor
  const [wx,wy,ww,wh]=D.win,arch=rr_arch(wx+ww/2,ww/2,wy+wh,wy+ww/2*Math.SQRT2,-1,0.5);
  const fr=arch.map(([x,y])=>[wx+ww/2+(x-wx-ww/2)*1.16,wy+wh+(y-wy-wh)*1.08]);wc_wash(ctx,fr,wc_dim(wall,0.12),{kind:"build",depth:1,seed:225,lw:1.3});
  ctx.save();wc_tr(ctx,arch);ctx.clip();const sky=ctx.createLinearGradient(0,wy,0,wy+wh);sky.addColorStop(0,rgba([170,200,220],1));sky.addColorStop(0.6,rgba([246,222,180],1));sky.addColorStop(1,rgba([240,214,170],1));
  ctx.fillStyle=sky;ctx.fillRect(wx,wy,ww,wh);wc_wash(ctx,[[wx-10,wy+wh*0.66],[wx+ww+10,wy+wh*0.62],[wx+ww+10,wy+wh+10],[wx-10,wy+wh+10]],RR.nile,{kind:"field",depth:0.6,seed:227});
  wc_wash(ctx,[[wx-10,wy+wh*0.6],[wx+ww+10,wy+wh*0.58],[wx+ww+10,wy+wh*0.66],[wx-10,wy+wh*0.68]],[176,170,118],{kind:"field",depth:0.5,seed:229});
  rr_palm(ctx,wx+80,wy+wh*0.64,170,0.05,231,0.6);rr_palm(ctx,wx+ww-70,wy+wh*0.62,130,-0.08,233,0.55);rr_boat(ctx,wx+ww*0.55,wy+wh*0.8,0.32,true,7,0);ctx.restore();
  wc_part(ctx,wc_rect(wx-30,wy+wh-6,ww+60,24),wc_lit(wall,0.05),1,{seed:235});
  ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(255,226,170,0.2)";ctx.beginPath();ctx.moveTo(wx,wy+wh+18);ctx.lineTo(wx+ww,wy+wh+18);ctx.lineTo(wx+ww+520,H);ctx.lineTo(wx+180,H);ctx.closePath();ctx.fill();
  wc_glowAt(ctx,wx+ww/2,wy+wh*0.5,520,[255,226,170],0.3);ctx.restore();
  // niches in the far wall, with rolled papyri in them; a chest
  for(const [nx,ny] of [[880,250],[1080,250],[1580,250]]){const nw=150,nh=190,ar=rr_arch(nx+nw/2,nw/2,ny+nh,ny+nw/2*Math.sqrt(1.8),-1,0.4);wc_wash(ctx,ar,wc_dim(wall,0.3),{kind:"build",depth:1,seed:nx+1,lw:1.2});
    const R=wc_rng(nx);for(let r=0;r<2;r++)for(let i=0;i<5;i++){const rx=nx+18+i*26+R()*4,ry=ny+nh-22-r*58;wc_wash(ctx,wc_ell(rx,ry,13,13,14),RR.papyrus,{kind:"thing",depth:1,seed:nx+i+r*7,lw:1});
      ctx.save();ctx.strokeStyle=rgba(wc_dim(RR.papyrus,0.35),0.7);ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(rx,ry,6,0,TAU);ctx.stroke();ctx.restore();}}
  wc_part(ctx,wc_rect(1520,640,300,180),RR.wood,1,{seed:239});wc_part(ctx,wc_rect(1510,624,320,20),RR.woodDk,1,{seed:241});wc_contact(ctx,1500,1840,822,1,0.3);
  // the bench along the wall, its cushion, the mat
  wc_part(ctx,wc_rect(700,640,700,180),wc_lit(wall,0.04),1,{seed:243});wc_part(ctx,wc_rrPts(740,592,600,60,24),RR.madder,1,{seed:245});
  wc_wash(ctx,[[560,D.fy+20],[1640,D.fy+20],[1780,H+30],[420,H+30]],[226,200,146],{kind:"thing",depth:1,seed:247,lw:1.2});
  ctx.save();ctx.strokeStyle=rgba(wc_dim([226,200,146],0.25),0.4);ctx.lineWidth=2;for(let k=-12;k<=12;k++){ctx.beginPath();ctx.moveTo(1100+k*45,D.fy+20);ctx.lineTo(1100+k*56,H+30);ctx.stroke();}ctx.restore();}
