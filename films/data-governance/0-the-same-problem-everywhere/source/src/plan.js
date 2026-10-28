/* ===== The same problem, everywhere: the places, the people and the things =====
   The prologue's places are other organisations' rooms, on purpose, because the point is that the problem is everywhere: a bank's
   risk floor at night in 2008 and the city round it, an office floor in the 1970s, a meeting room in Los Angeles in 1980, a boardroom
   in 2002, the regulators' table in Basel, a team room in 2017, an office's front desk in 2018, a team training a model in 2024; then
   the university, where film 1 begins (the series' rooms.js). No company is named and no logo appears. The thread is a shelf, where
   the body of knowledge arrives edition by edition. The people are invented, and dressed for their time; behind each person of the
   past is a warm umber wash, and from 2024 the business side's gold or the technical side's cyan. Every name starts with sp_ or SP_. */

/* ---------- the people ---------- */
// clothes of their time, from the engine's own (shirt, suit, blazer, cardigan, sweater, overshirt, skirt), with two additions for
// the 1970s and 1980: a wide pointed collar over the neckline (top.collar), and big round glasses (bigGlasses)
const sp_torso0=torso,sp_face0=face;
torso=function(ctx,P,br,sh){sp_torso0(ctx,P,br,sh);const T_=P.top;if(!T_.collar)return;const y0=-448+br,c=T_.collar===true?(T_.inner||lighten(T_.c,0.5)):T_.collar;
  for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*13,y0-3);ctx.quadraticCurveTo(s*30,y0-1,s*44,y0+6);ctx.lineTo(s*58+sh*0.2,y0+40);ctx.quadraticCurveTo(s*34+sh*0.2,y0+34,s*6+sh*0.3,y0+26);ctx.closePath();
    litFill(ctx,c,-58,y0,58,y0+40);seam(ctx,c,0.45,1.4);}};
face=function(ctx,P,E,po,t){if(!P.bigGlasses)return sp_face0(ctx,P,E,po,t);sp_face0(ctx,P,E,po,t);const fx=po.turn*7,ly=po.look*3;
  ctx.strokeStyle=rgba(P.bigGlasses,0.95);ctx.lineWidth=3;for(const s of [-1,1]){ell(ctx,s*17+fx,-1+ly,15.5,14.5);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-3+fx,-5+ly);ctx.quadraticCurveTo(fx,-8+ly,3+fx,-5+ly);ctx.stroke();ctx.beginPath();ctx.moveTo(-32+fx,-6+ly);ctx.lineTo(-42,-9);ctx.moveTo(32+fx,-6+ly);ctx.lineTo(42,-9);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.32)";ctx.lineWidth=1.8;for(const s of [-1,1]){ctx.beginPath();ctx.arc(s*17+fx,-1+ly,11,-2.6,-1.7);ctx.stroke();}};
const SP_LAN=[66,84,140];
Object.assign(PEOPLE,{
  // 2008, a bank's risk floor, late: shirtsleeves and lanyards
  spHead:{name:"",role:"head of risk",side:"",edge:GV_PAST,seed:51,skin:[190,140,106],hair:{style:"bob",c:[44,36,34],streak:[150,142,140]},earrings:[226,228,236],lanyard:SP_LAN,
    top:{kind:"shirt",c:[198,214,234]},bottom:{c:[52,56,66]},shoe:[40,34,32],build:{sh:68,hip:60,h:0.97}},
  spDep:{name:"",role:"from the board's office",side:"",edge:GV_PAST,seed:52,skin:[232,196,168],hair:{style:"side",c:[92,70,52]},lanyard:SP_LAN,
    top:{kind:"suit",c:[46,52,68],inner:[244,244,240]},bottom:{c:[46,52,68]},shoe:[30,26,26],build:{sh:76,hip:62,h:1.02}},
  spAn1:{name:"",role:"risk analyst",side:"",edge:GV_PAST,seed:53,skin:[124,86,62],hair:{style:"coily",c:[30,24,24]},lanyard:SP_LAN,
    top:{kind:"cardigan",c:[118,72,84],inner:[236,232,226]},bottom:{c:[48,50,60]},shoe:[36,30,30],build:{sh:66,hip:60,h:0.95}},
  spAn2:{name:"",role:"risk analyst",side:"",edge:GV_PAST,seed:54,skin:[238,206,180],hair:{style:"cropped",c:[168,128,88]},glasses:[40,40,44],lanyard:SP_LAN,
    top:{kind:"shirt",c:[222,232,214]},bottom:{c:[70,74,86]},shoe:[44,36,32],build:{sh:74,hip:62,h:1.0}},
  // the 1970s, an office floor: earth tones, wide collars, big glasses
  spAdmin:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:55,skin:[234,198,170],hair:{style:"long",c:[120,72,42]},bigGlasses:[96,62,40],
    top:{kind:"shirt",c:[228,190,110],collar:[244,226,180]},bottom:{kind:"skirt",c:[138,88,54]},legs:[212,178,152],shoe:[90,60,40],build:{sh:66,hip:62,h:0.96}},
  spSales:{name:"",role:"sales",side:"",edge:GV_PAST,seed:56,skin:[222,180,148],hair:{style:"side",c:[70,50,36]},beard:[80,58,42],
    top:{kind:"suit",c:[148,108,70],inner:[236,220,180],collar:[236,220,180]},bottom:{c:[148,108,70]},shoe:[70,48,34],build:{sh:76,hip:64,h:1.0}},
  spAcct:{name:"",role:"accounts",side:"",edge:GV_PAST,seed:57,skin:[160,110,84],hair:{style:"bun",c:[36,28,26]},
    top:{kind:"cardigan",c:[196,140,70],inner:[244,236,220]},bottom:{kind:"skirt",c:[100,80,60]},legs:[140,98,76],shoe:[66,48,36],build:{sh:64,hip:60,h:0.95}},
  spShip:{name:"",role:"shipping",side:"",edge:GV_PAST,seed:58,skin:[200,160,130],hair:{style:"cropped",c:[40,32,30]},bigGlasses:[50,46,46],
    top:{kind:"shirt",c:[178,198,168],collar:true},bottom:{c:[90,84,70]},shoe:[60,44,34],build:{sh:74,hip:62,h:1.0}},
  // Los Angeles, 1980: the people who looked after data, at an evening meeting
  spLa1:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:61,skin:[214,170,140],hair:{style:"bob",c:[150,100,60],streak:[192,150,110]},bigGlasses:[120,80,60],
    top:{kind:"blazer",c:[174,92,60],inner:[240,226,200],collar:[240,226,200]},bottom:{kind:"skirt",c:[118,90,70]},legs:[196,156,128],shoe:[80,56,40],build:{sh:66,hip:62,h:0.96}},
  spLa2:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:62,skin:[120,84,64],hair:{style:"coily",c:[30,24,22]},
    top:{kind:"suit",c:[120,100,80],inner:[230,210,170],collar:[230,210,170]},bottom:{c:[120,100,80]},shoe:[60,44,34],build:{sh:76,hip:64,h:1.02}},
  spLa3:{name:"",role:"database administrator",side:"",edge:GV_PAST,seed:63,skin:[236,200,176],hair:{style:"long",c:[208,168,100]},
    top:{kind:"sweater",c:[120,138,88]},bottom:{c:[90,80,60]},shoe:[70,52,40],build:{sh:66,hip:60,h:0.95}},
  spLa4:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:64,skin:[226,184,150],hair:{style:"side",c:[100,70,50]},beard:[110,80,56],bigGlasses:[60,50,44],
    top:{kind:"cardigan",c:[150,120,80],inner:[236,220,190],collar:[236,220,190]},bottom:{c:[110,96,74]},shoe:[70,50,36],build:{sh:76,hip:62,h:1.0}},
  spLa5:{name:"",role:"systems analyst",side:"",edge:GV_PAST,seed:65,skin:[190,140,100],hair:{style:"side",c:[40,30,26]},
    top:{kind:"shirt",c:[212,168,108],collar:true},bottom:{c:[80,66,54]},shoe:[60,44,34],build:{sh:74,hip:62,h:0.99}},
  spLa6:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:66,skin:[180,130,100],hair:{style:"coily",c:[50,36,30]},
    top:{kind:"shirt",c:[198,112,88],collar:[244,226,208]},bottom:{kind:"skirt",c:[90,70,60]},legs:[160,116,90],shoe:[70,50,40],build:{sh:64,hip:60,h:0.94}},
  spLa7:{name:"",role:"database administrator",side:"",edge:GV_PAST,seed:67,skin:[238,210,186],hair:{style:"cropped",c:[196,188,178]},bigGlasses:[60,60,60],
    top:{kind:"suit",c:[96,96,90],inner:[240,236,220],collar:[240,236,220]},bottom:{c:[96,96,90]},shoe:[40,36,34],build:{sh:76,hip:62,h:1.01}},
  spLa8:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:68,skin:[140,96,70],hair:{style:"bun",c:[30,24,22]},
    top:{kind:"cardigan",c:[132,104,70],inner:[240,232,220]},bottom:{kind:"skirt",c:[96,74,56]},legs:[120,84,62],shoe:[60,44,34],build:{sh:64,hip:60,h:0.94}},
  spLa9:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:69,skin:[204,154,122],hair:{style:"side",c:[120,104,88]},beard:[124,106,90],
    top:{kind:"blazer",c:[96,108,130],inner:[236,232,220],collar:[236,232,220]},bottom:{c:[84,84,92]},shoe:[50,40,34],build:{sh:76,hip:62,h:1.0}},
  spLa10:{name:"",role:"database administrator",side:"",edge:GV_PAST,seed:70,skin:[228,186,150],hair:{style:"long",c:[62,42,32]},
    top:{kind:"shirt",c:[164,192,204],collar:[240,240,232]},bottom:{kind:"skirt",c:[92,92,104]},legs:[208,170,140],shoe:[60,44,40],build:{sh:64,hip:60,h:0.95}},
  // 2002, a boardroom: a chief executive and a chief financial officer, in dark suits
  spCeo:{name:"",role:"chief executive",side:"",edge:GV_PAST,seed:71,skin:[232,196,168],hair:{style:"side",c:[150,146,140]},
    top:{kind:"suit",c:[40,44,58],inner:[244,244,246]},bottom:{c:[40,44,58]},shoe:[26,24,24],build:{sh:78,hip:64,h:1.02}},
  spCfo:{name:"",role:"chief financial officer",side:"",edge:GV_PAST,seed:72,skin:[180,128,96],hair:{style:"bob",c:[30,24,22],streak:[86,76,72]},earrings:[230,214,160],
    top:{kind:"suit",c:[50,50,58],inner:[236,236,240]},bottom:{c:[50,50,58]},shoe:[26,24,24],build:{sh:66,hip:60,h:0.96}},
  // 2002, the finance floor behind the boardroom's glass: an accountant, an analyst, a controller
  spFin1:{name:"",role:"accountant",side:"",edge:GV_PAST,seed:77,skin:[198,150,118],hair:{style:"cropped",c:[44,34,30]},
    top:{kind:"shirt",c:[186,204,226]},bottom:{c:[60,64,76]},shoe:[40,36,34],build:{sh:74,hip:62,h:1.0}},
  spFin2:{name:"",role:"financial analyst",side:"",edge:GV_PAST,seed:78,skin:[236,204,178],hair:{style:"bun",c:[120,84,56]},
    top:{kind:"cardigan",c:[176,120,130],inner:[240,236,232]},bottom:{kind:"skirt",c:[70,66,78]},legs:[220,186,160],shoe:[50,40,40],build:{sh:64,hip:60,h:0.95}},
  spFin3:{name:"",role:"financial controller",side:"",edge:GV_PAST,seed:79,skin:[128,88,66],hair:{style:"side",c:[28,24,22]},glasses:[40,40,44],
    top:{kind:"sweater",c:[110,124,146]},bottom:{c:[66,62,58]},shoe:[40,36,34],build:{sh:74,hip:62,h:1.0}},
  // Basel, 2013: the banks' regulators
  spBs1:{name:"",role:"supervisor",side:"",edge:GV_PAST,seed:73,skin:[236,206,184],hair:{style:"bob",c:[180,150,110],streak:[214,192,150]},glasses:[60,60,70],
    top:{kind:"suit",c:[60,70,96],inner:[240,240,244]},bottom:{c:[60,70,96]},shoe:[30,28,30],build:{sh:66,hip:60,h:0.96}},
  spBs2:{name:"",role:"supervisor",side:"",edge:GV_PAST,seed:74,skin:[214,176,144],hair:{style:"cropped",c:[70,60,56]},
    top:{kind:"suit",c:[76,78,86],inner:[236,238,242]},bottom:{c:[76,78,86]},shoe:[30,28,30],build:{sh:76,hip:62,h:1.0}},
  spBs3:{name:"",role:"supervisor",side:"",edge:GV_PAST,seed:75,skin:[150,104,78],hair:{style:"cropped",c:[30,26,24]},beard:[40,32,30],
    top:{kind:"suit",c:[56,60,72],inner:[238,240,244]},bottom:{c:[56,60,72]},shoe:[30,28,30],build:{sh:76,hip:62,h:1.01}},
  spBs4:{name:"",role:"supervisor",side:"",edge:GV_PAST,seed:76,skin:[226,186,160],hair:{style:"long",c:[90,60,40]},
    top:{kind:"blazer",c:[118,42,52],inner:[236,232,226]},bottom:{c:[52,48,56]},shoe:[30,28,30],build:{sh:66,hip:60,h:0.96}},
  // 2017, a team room: smart and casual
  spT1:{name:"",role:"marketing",side:"",edge:GV_PAST,seed:81,skin:[200,150,110],hair:{style:"side",c:[50,40,32]},
    top:{kind:"sweater",c:[70,110,140]},bottom:{c:[60,64,74]},shoe:[50,40,34],build:{sh:76,hip:62,h:1.0}},
  spT2:{name:"",role:"product",side:"",edge:GV_PAST,seed:82,skin:[236,204,180],hair:{style:"long",c:[170,110,60]},
    top:{kind:"blazer",c:[180,140,100],inner:[244,240,232]},bottom:{c:[64,60,70]},shoe:[60,44,36],build:{sh:66,hip:60,h:0.96}},
  spT3:{name:"",role:"analyst",side:"",edge:GV_PAST,seed:83,skin:[130,90,66],hair:{style:"coily",c:[30,24,22]},glasses:[40,40,44],
    top:{kind:"cardigan",c:[210,158,80],inner:[240,236,228]},bottom:{c:[56,56,66]},shoe:[40,34,30],build:{sh:64,hip:60,h:0.95}},
  spT4:{name:"",role:"sales",side:"",edge:GV_PAST,seed:84,skin:[226,190,160],hair:{style:"cropped",c:[120,90,60]},beard:[130,96,64],
    top:{kind:"overshirt",c:[120,130,100],inner:[230,228,220]},bottom:{c:[70,66,60]},shoe:[60,46,36],build:{sh:76,hip:62,h:1.0}},
  // 2018, an office's front desk: its privacy lead, and a customer with a letter
  spPriv:{name:"",role:"privacy lead",side:"",edge:GV_PAST,seed:85,skin:[240,210,190],hair:{style:"bun",c:[70,50,40]},glasses:[50,50,60],
    top:{kind:"blazer",c:[60,90,110],inner:[240,240,236]},bottom:{c:[50,54,64]},shoe:[36,30,30],build:{sh:66,hip:60,h:0.97}},
  spCust:{name:"",role:"customer",side:"",edge:GV_PAST,seed:86,skin:[170,120,90],hair:{style:"side",c:[40,30,28]},
    top:{kind:"overshirt",c:[150,92,72],inner:[220,214,200]},bottom:{c:[60,60,70]},shoe:[50,40,34],build:{sh:76,hip:62,h:1.0}},
  // 2024, a team training a model: the technical side in cyan, the business side in gold
  spMl1:{name:"",role:"machine learning engineer",side:"Technical",edge:TECH,seed:91,skin:[226,190,160],hair:{style:"curly",c:[60,44,36]},
    top:{kind:"sweater",c:[80,100,120]},bottom:{c:[54,58,70]},shoe:[44,40,40],build:{sh:76,hip:62,h:1.0}},
  spMl2:{name:"",role:"product owner",side:"Business",edge:BIZ,seed:92,skin:[176,124,94],hair:{style:"long",c:[36,28,26]},
    top:{kind:"blazer",c:[198,150,90],inner:[240,236,228]},bottom:{c:[60,58,70]},shoe:[50,40,36],build:{sh:66,hip:60,h:0.96}},
  spMl3:{name:"",role:"data scientist",side:"Technical",edge:TECH,seed:93,skin:[236,206,180],hair:{style:"bob",c:[150,80,50],streak:[192,122,90]},glasses:[40,40,48],
    top:{kind:"cardigan",c:[110,140,120],inner:[236,234,226]},bottom:{c:[50,54,64]},shoe:[40,36,36],build:{sh:66,hip:60,h:0.96}}
});
// poses: handing something over, standing, and taking it, seated (the right hand, out and a little down), the seated one looking up
// from her desk first, and reading what she took in one hand; holding a box up to ask about it; at a terminal on one's right, both hands
// on its keys, and looking up from it at something high on the left; holding a cup at the chest; seated, a binder held up at the chest
// with both hands, looking at the one beside, and the right hand out to them, to pass it; standing, the same
Object.assign(POSE,{
  spType:{L:[0.1,-1.9],R:[0.44,1.76],feet:24,shift:0,tilt:0.03,turn:0.35,gaze:[0.85,0.45],look:1},
  spLookCab:{L:[0.12,-0.12],R:[0.16,-0.6],feet:24,shift:0,tilt:-0.04,turn:-0.22,gaze:[-0.7,-0.7],look:0},
  spCup:{L:[0.12,-0.06],R:[0.22,-2.35],feet:28,shift:3,tilt:0.02,turn:0.1,gaze:[0.3,0.1],look:0},
  spGive:{L:[0.13,-0.1],R:[0.8,1.35],feet:28,shift:4,tilt:-0.03,turn:0.2,gaze:[0.6,0.5],look:0},
  spLookUp:{L:[0.16,-2.0],R:[0.3,-1.6],feet:24,shift:0,tilt:0,turn:0.2,gaze:[0.6,-0.3],look:0},
  spTake:{L:[0.16,-2.05],R:[1.25,2.0],feet:24,shift:0,tilt:0.02,turn:0.2,gaze:[0.6,-0.3],look:0},
  spReadOne:{L:[0.16,-2.05],R:[0.2,-2.4],feet:24,shift:0,tilt:0.04,turn:0.05,gaze:[0.3,0.8],look:1},
  spAsk:{L:[0.36,-2.6],R:[0.36,-2.6],feet:28,shift:2,tilt:-0.04,turn:0.05,gaze:[0,-0.3],look:0},
  spShowB:{L:[0.3,-2.5],R:[0.3,-2.5],feet:24,shift:0,tilt:0.02,turn:0.25,gaze:[0.6,0.1],look:0},
  spPassR:{L:[0.12,-0.1],R:[0.1,2.42],feet:24,shift:0,tilt:-0.04,turn:0.3,gaze:[0.7,0.1],look:0},
  spPassS:{L:[0.12,-0.1],R:[0.15,2.5],feet:28,shift:4,tilt:-0.03,turn:0.3,gaze:[0.7,0.1],look:0}
});

/* ---------- the year and the place in the corner ---------- */
// mk: [[time, "place · year"], ...]; the latest one passed, dissolving from the one before
function sp_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}

/* ---------- a city at night, for the bank's windows and its wide view ---------- */
// the towers of a skyline in a band from x0 to x1 standing on y (base), each [x, w, top, col]; kept with their windows' places
function sp_towers(seed,x0,x1,base,hmin,hmax,wmin,wmax){const R=wc_rng(seed),o=[];let x=x0;while(x<x1){const w=wmin+R()*(wmax-wmin),h=hmin+R()*(hmax-hmin);o.push([x,w,base-h]);x+=w+R()*18;}return o;}
const SP_NIGHT={top:[30,36,72],mid:[58,58,100],low:[122,92,110],glow:[255,206,140],far:[62,70,108],mid2:[46,52,88],near:[36,42,74]};
// a lit window (warm), or a dark one; a tower's windows in rows and columns
function sp_lit(ctx,x,y,w,h,a){ctx.fillStyle=rgba(SP_NIGHT.glow,a);ctx.fillRect(x,y,w,h);}
function sp_paintSky(ctx,x,y,w,h){const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(SP_NIGHT.top,1));g.addColorStop(0.6,rgba(SP_NIGHT.mid,1));g.addColorStop(1,rgba(SP_NIGHT.low,1));
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.save();ctx.globalAlpha=0.5;wc_wash(ctx,wc_rect(x,y,w,h),SP_NIGHT.mid,{kind:"plaster",line:false,seed:(x|0)+7});ctx.restore();
  const R=wc_rng((x|0)+11);ctx.fillStyle="rgba(255,250,236,0.5)";for(let i=0;i<w*h/26000;i++){ctx.beginPath();ctx.arc(x+R()*w,y+R()*h*0.5,0.8+R()*0.9,0,TAU);ctx.fill();}}
// a band of towers: each tower a wash, its windows a grid where some are lit (lit is 0 to 1, how many)
function sp_paintTowers(ctx,list,base,col,lit,seed,k){k=k||1;const R=wc_rng(seed);list.forEach(([x,w,top],i)=>{wc_wash(ctx,wc_rect(x,top,w,base-top+20),col,{kind:"build",lw:1.1,seed:seed+i});
    if(R()<0.3)wc_flat(ctx,wc_rect(x+w*0.35,top-26*k,w*0.3,26*k),col,1,"roof");
    const cw=12*k,ch=16*k,gx=8*k,gy=12*k;for(let yy=top+16*k;yy<base-24*k;yy+=ch+gy)for(let xx=x+10*k;xx<x+w-cw-6*k;xx+=cw+gx)if(R()<lit)sp_lit(ctx,xx,yy,cw,ch,0.55+0.4*R());});}
// the night city in a rectangle: the sky, three bands of towers, nearer ones taller and darker; d scales the towers (1 = the wide view)
function sp_paintCity(ctx,x,y,w,h,seed,d){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();sp_paintSky(ctx,x,y,w,h);const base=y+h+10;
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+w/2,base,w*0.7,[150,100,110],0.5);ctx.restore();
  sp_paintTowers(ctx,sp_towers(seed,x-40,x+w+40,base,h*0.18,h*0.42,60*d,120*d),base,SP_NIGHT.far,0.18,seed+1,d*0.8);
  sp_paintTowers(ctx,sp_towers(seed+5,x-60,x+w+60,base,h*0.26,h*0.62,90*d,170*d),base,SP_NIGHT.mid2,0.12,seed+6,d);
  ctx.restore();}

/* ---------- 2008: a bank's risk floor at night ---------- */
// the wide view: the city through tall windows, the floor's far row of desks with their screens' backs and their glow, and the head of
// risk's desk in front (its own layer, riskDesk, drawn over whoever sits at it). SP_RK says where: the windows, the far row, her desk.
const SP_RK={win:[100,590],far:{top:668,foot:840,x0:30,x1:1890},desk:{x0:520,x1:1400,top:792},seat:[960,1.0],lamp:[606,792]};
const SP_WALL08=[198,192,184],SP_CARPET=[98,106,130],SP_OAK08=[212,180,134];
// a screen seen from behind: its dark back and stand; the light it gives off is drawn with the room (sp_screenGlow)
function sp_screenBack(ctx,x,y,w,h){wc_part(ctx,[[x+w/2-12,y+h],[x+w/2+12,y+h],[x+w/2+20,y+h+30],[x+w/2-20,y+h+30]],[58,60,70],1);wc_part(ctx,wc_rrPts(x,y,w,h,8),[52,54,64],1,{kind:"thing",lw:1.2});}
function sp_screenGlow(ctx,x,y,r,a){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,r,[120,170,240],a);ctx.restore();}
// a desk seen from the front: a thin top, two legs, a modesty panel half way down
function sp_deskOpen(ctx,x,w,top,foot,col,seed){wc_contact(ctx,x-10,x+w+10,foot,0.9,0.28);for(const lx of [x+10,x+w-30])wc_part(ctx,wc_rect(lx,top+14,20,foot-top-14),wc_dim(col,0.3),1,{seed:seed+lx});
  wc_part(ctx,wc_rect(x+30,top+16,w-60,(foot-top)*0.46),wc_dim(col,0.12),1,{seed});wc_part(ctx,wc_rect(x-6,top,w+12,18),wc_lit(col,0.14),1,{seed:seed+1});}
// a television hung from the ceiling, its screen dark in the painting; sp_tvNews draws on it, every frame, the markets falling: a red
// line down the screen (u, how far it has run), and a red arrow
const SP_TV=[240,196,300,168];
function sp_tv(ctx){const [x,y,w,h]=SP_TV;wc_part(ctx,wc_rect(x+w/2-6,0,12,y+4),[90,90,96],1,{lw:1});wc_part(ctx,wc_rrPts(x-12,y-12,w+24,h+24,10),[40,42,50],1,{kind:"thing",lw:1.3});
  ctx.fillStyle=rgba([26,34,58],1);ctx.fillRect(x,y,w,h);}
const SP_TVLINE=(()=>{const R=wc_rng(19),o=[];for(let i=0;i<=24;i++){const u=i/24;o.push([u,0.16+0.62*Math.pow(u,1.5)+(R()-0.5)*0.11*(1-0.4*u)]);}return o;})();
function sp_tvNews(ctx,u){const [x,y,w,h]=SP_TV;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+w/2,y+h/2,w*0.8,[90,120,190],0.35);
  ctx.globalCompositeOperation="source-over";ctx.strokeStyle="rgba(150,170,220,0.22)";ctx.lineWidth=1.5;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+10,y+i*h/4);ctx.lineTo(x+w-10,y+i*h/4);ctx.stroke();}
  const n=Math.max(1,Math.round(u*(SP_TVLINE.length-1)));ctx.strokeStyle=rgba([236,84,70],1);ctx.lineWidth=4;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<=n;i++){const [a,b]=SP_TVLINE[i];if(i)ctx.lineTo(x+18+a*(w-80),y+h*b);else ctx.moveTo(x+18,y+h*b);}ctx.stroke();
  if(u>0.95){ctx.fillStyle=rgba([236,84,70],clamp((u-0.95)/0.05,0,1));ctx.beginPath();ctx.moveTo(x+w-36,y+h-20);ctx.lineTo(x+w-14,y+h-50);ctx.lineTo(x+w-58,y+h-50);ctx.closePath();ctx.fill();}ctx.restore();}
function sp_paintRisk(ctx){const K=SP_RK,[wy0,wy1]=K.win;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  // the city through the windows, the ceiling and its lights, the wall under the windows, the carpet
  sp_paintCity(ctx,0,wy0,W,wy1-wy0,21,0.8);
  wc_wash(ctx,wc_rect(-40,-40,W+80,wy0+40),[110,108,112],{kind:"plaster",line:false,seed:31});for(let x=120;x<W;x+=420){wc_flat(ctx,wc_rect(x,30,220,30),[250,244,226],1,"panel");
    ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+110,70,300,[255,238,200],0.3);ctx.restore();}
  for(let x=0;x<=W;x+=240)wc_part(ctx,wc_rect(x-7,wy0-6,14,wy1-wy0+12),[120,118,122],1,{lw:1});wc_part(ctx,wc_rect(-40,wy0-14,W+80,16),[120,118,122],1);
  sp_tv(ctx);
  wc_wash(ctx,wc_rect(-40,wy1,W+80,K.far.foot-wy1+40),SP_WALL08,{kind:"plaster",line:false,seed:33});wc_part(ctx,wc_rect(-40,wy1,W+80,16),[170,162,152],1);
  wc_wash(ctx,wc_rect(-40,K.far.foot,W+80,H-K.far.foot+40),SP_CARPET,{kind:"ground",line:false,seed:35});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(SP_CARPET,0.2),0.25);ctx.lineWidth=2;for(let i=-16;i<=16;i++){ctx.beginPath();ctx.moveTo(960+i*64,K.far.foot);ctx.lineTo(960+i*210,H+40);ctx.stroke();}ctx.restore();
  // the far row: chairs' backs behind the desks, two screens' backs to each desk and their glow, the desks, a lamp and papers here and there
  const F=K.far,n=6,step=(F.x1-F.x0)/n;for(let i=0;i<n;i++){const x=F.x0+i*step;wc_part(ctx,wc_rrPts(x+step/2-58,F.top-118,116,140,24),[70,74,90],1,{seed:60+i});}
  for(let i=0;i<n;i++){const x=F.x0+i*step;sp_screenGlow(ctx,x+step/2,F.top-80,200,0.32);}
  for(let i=0;i<n;i++){const x=F.x0+i*step;sp_screenBack(ctx,x+step/2-122,F.top-104,112,76);sp_screenBack(ctx,x+step/2+10,F.top-104,112,76);
    sp_deskOpen(ctx,x+12,step-24,F.top,F.foot,[214,206,194],70+i*5);
    if(i%2===0){wc_part(ctx,wc_rect(x+40,F.top-16,90,16),[244,242,236],1,{lw:1});wc_part(ctx,wc_rect(x+46,F.top-28,84,14),[236,234,228],1,{lw:1});}}
  // her chair's back
  const [sx]=K.seat;wc_part(ctx,wc_rrPts(sx-90,K.desk.top-246,180,262,32),[60,64,80],1,{seed:41});}
// her desk, in front of her: a screen's back on the left with its glow, a banker's lamp at the corner in front of it, two stacks of
// printouts on the right, the oak top, the front panel down past the frame's foot
function sp_paintRiskDesk(ctx){const D=SP_RK.desk,top=D.top,[lx,ly]=SP_RK.lamp;sp_screenGlow(ctx,752,top-130,230,0.36);sp_screenBack(ctx,650,top-196,212,150);
  for(const [px,ph,r] of [[1150,46,-0.02],[1244,64,0.03]])wc_part(ctx,[[px-60,top+4],[px+60,top+4],[px+58+r*200,top+4-ph],[px-62+r*200,top+4-ph]],[246,244,238],1,{lw:1.2,seed:px});
  ctx.save();ctx.strokeStyle=rgba([150,146,140],0.6);ctx.lineWidth=1.4;for(const [px,ph] of [[1150,46],[1244,64]])for(let yy=top-6;yy>top+4-ph;yy-=7){ctx.beginPath();ctx.moveTo(px-58,yy);ctx.lineTo(px+58,yy);ctx.stroke();}ctx.restore();
  wc_contact(ctx,D.x0-30,D.x1+30,top+300,0.9,0.3);wc_part(ctx,wc_rect(D.x0+24,top+30,D.x1-D.x0-48,H-top),wc_dim(SP_OAK08,0.18),1,{seed:43});
  // the front: the top's shadow, two raised panels and the grain running across them
  ctx.save();ctx.globalCompositeOperation="multiply";const sg=ctx.createLinearGradient(0,top+30,0,top+90);sg.addColorStop(0,"rgba(90,70,50,0.35)");sg.addColorStop(1,"rgba(90,70,50,0)");
  ctx.fillStyle=sg;ctx.fillRect(D.x0+24,top+30,D.x1-D.x0-48,60);ctx.restore();const pw=(D.x1-D.x0-48-90)/2;
  for(const px of [D.x0+54,D.x0+54+pw+30])wc_part(ctx,wc_rect(px,top+70,pw,H-top-40),wc_dim(SP_OAK08,0.1),1,{lw:1.1,seed:px});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(SP_OAK08,0.35),0.22);ctx.lineWidth=2;for(let y=top+92;y<H;y+=26){ctx.beginPath();ctx.moveTo(D.x0+60,y);for(let x=D.x0+60;x<=D.x1-60;x+=60)ctx.lineTo(x,y+4*Math.sin(x/90+y*0.7));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(D.x0-10,top,D.x1-D.x0+20,34),wc_lit(SP_OAK08,0.1),1,{seed:44});
  // the lamp: a brass foot and stem, a green glass shade, its pull chain
  const brass=[184,146,74],green=[46,112,74];wc_wash(ctx,wc_ell(lx,top+2,52,11,24),brass,{kind:"thing",lw:1.2});wc_part(ctx,wc_rect(lx-5,top-74,10,74),brass,1,{lw:1});
  wc_part(ctx,[[lx-74,top-108],[lx+74,top-108],[lx+92,top-70],[lx-92,top-70]],green,1,{kind:"thing",lw:1.3});wc_flat(ctx,wc_rect(lx-70,top-102,140,8),wc_lit(green,0.45),0.6,"shine");
  wc_part(ctx,wc_rect(lx-94,top-72,188,6),brass,1,{lw:0.8});ctx.save();ctx.strokeStyle=rgba(brass,1);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(lx+50,top-66);ctx.lineTo(lx+50,top-38);ctx.stroke();
  ctx.fillStyle=rgba(brass,1);ctx.beginPath();ctx.arc(lx+50,top-35,4,0,TAU);ctx.fill();ctx.restore();}
// her lamp's light, on (a 0 to 1): warm, on the papers and the desk under it
function sp_lampLight(ctx,a){if(a<=0.01)return;const [lx]=SP_RK.lamp,top=SP_RK.desk.top;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+20,top-20,320,[255,214,140],0.5*a);
  wc_glowAt(ctx,lx,top-62,90,[255,240,200],0.7*a);ctx.restore();}
// the floor's lights going out, row by row (u 0 to 1): the room darkens, but for her lamp
function sp_lightsOut(ctx,u,lamp){if(u<=0.001)return;ctx.save();ctx.fillStyle=rgba([22,24,44],0.52*u);ctx.fillRect(0,0,W,H);ctx.restore();if(lamp>0){ctx.save();ctx.globalCompositeOperation="screen";
  const [lx]=SP_RK.lamp,top=SP_RK.desk.top;wc_glowAt(ctx,lx+60,top-60,520,[255,206,140],0.3*u*lamp);ctx.restore();}}

// the desk from above, at night: pale laminate under her lamp's warm light, the keyboard's edge, a mug, a pen, the board's card
function sp_paintSpread(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[214,196,166],{kind:"plaster",line:false,seed:51});
  ctx.save();ctx.strokeStyle=rgba([170,146,110],0.22);ctx.lineWidth=2;for(let y=20;y<H;y+=34){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+3*Math.sin(x/170+y));ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1560,160,1000,[255,224,170],0.32);ctx.restore();ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,1080,900,[110,112,140],0.55);wc_glowAt(ctx,1920,1080,600,[140,140,160],0.35);ctx.restore();
  wc_part(ctx,[[600,-40],[1320,-40],[1310,40],[610,40]],[226,226,230],1,{lw:1.2});ctx.save();ctx.fillStyle=rgba([180,182,190],0.6);for(let i=0;i<14;i++)ctx.fillRect(630+i*48,2,40,26);ctx.restore();
  wc_wash(ctx,wc_ell(1790,196,62,62,30),[236,232,224],{kind:"thing",lw:1.4});wc_wash(ctx,wc_ell(1790,196,48,48,30),[96,66,48],{kind:"thing",line:false,flat:true});
  wc_part(ctx,[[1690,870],[1880,800],[1886,812],[1696,882]],[40,60,110],1,{lw:1.1});}
// the board's card, lying on the desk where she put it down, under the keyboard
function sp_cardOnDesk(ctx,x,y,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(gv_sheetPaper(440,236),-240,-138);
  wc_T(ctx,"From the board",-186,-50,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"How much do we",-186,12,{w:800,size:44,col:WC_DARK});wc_T(ctx,"stand to lose?",-186,66,{w:800,size:44,col:WC_DARK});ctx.restore();}
// a printout from one business line: the line's name on a coloured band at its top, rows of printed figures, and the row with this
// customer, highlighted, under its own code; a, the sheet's arrival (0 to 1), slid up onto the desk from below, never across the board's card; hi, the highlight. SP_SHEET: its size, and where the code is.
const SP_LINES=[["treasury","client 0042",[72,130,190]],["markets","CPTY-A17",[180,96,60]],["lending","acct 9-310",[60,140,100]],["abroad","K-77/2",[140,96,170]]];
const SP_SHEET={w:380,h:470,code:250};
function sp_printout(ctx,i,x,y,rot,a,hi){if(a<=0.01)return;const [line,code,col]=SP_LINES[i],{w,h}=SP_SHEET,cy=SP_SHEET.code,u=easeCam(clamp(a,0,1));
  ctx.save();ctx.translate(x+w/2+(1-u)*(i<2?-160:160),y+h/2+(1-u)*460);ctx.rotate(rot*(0.3+0.7*u));withA(ctx,clamp(a*3,0,1),()=>{
    ctx.drawImage(gv_sheetPaper(w,h),-w/2-20,-h/2-20);wc_flat(ctx,wc_rect(-w/2+14,-h/2+14,w-28,64),col,1,"band");
    wc_T(ctx,line,-w/2+34,-h/2+58,{w:800,size:36,col:[255,255,255]});
    gv_lines(ctx,-w/2+34,-h/2+108,w-80,4,24,0.9);
    if(hi>0)wc_wash(ctx,wc_rect(-w/2+22,-h/2+cy-38,(w-44)*easeCam(clamp(hi,0,1)),56),[252,226,96],{kind:"swatch",line:false,a:0.75,seed:60+i});
    wc_T(ctx,code,-w/2+34,-h/2+cy,{w:600,size:32,f:"mono",col:WC_DARK});
    gv_lines(ctx,-w/2+34,-h/2+cy+56,w-80,6,24,0.9);});
  ctx.restore();}

// the head of risk's whiteboard, close, and the desk calendar on the edge of her desk; what's written on them is drawn every frame
const SP_WB={board:[110,70,1360,700],cal:[1560,606,250,240],top:830};
function sp_paintBoard08(ctx){const B=SP_WB,[bx,by,bw,bh]=B.board;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),SP_WALL08,{kind:"plaster",line:false,seed:55});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1760,860,760,[255,214,150],0.34);ctx.restore();ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,0,900,[150,150,170],0.35);ctx.restore();
  wc_part(ctx,wc_rect(bx-14,by-14,bw+28,bh+28),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(bx,by,bw,bh),[250,251,250],1,"board");
  wc_part(ctx,wc_rect(bx+bw*0.3,by+bh+12,bw*0.4,14),GV.metal,1);for(const [mx,c] of [[bx+bw*0.36,[204,62,50]],[bx+bw*0.42,[50,90,170]],[bx+bw*0.48,[40,40,48]]])wc_flat(ctx,wc_rect(mx,by+bh+2,40,12),c,1,"marker");
  // the desk's edge across the foot of the frame, under the calendar
  wc_part(ctx,wc_rect(-40,B.top+26,W+80,H-B.top+40),wc_dim(SP_OAK08,0.18),1,{seed:57});wc_part(ctx,wc_rect(-40,B.top,W+80,30),wc_lit(SP_OAK08,0.1),1,{seed:58});}
// the calendar: a stand, and the day's page; the page turns over its top from one day to the next (u 0 to 1), its day squashed as it
// goes, so not read then
function sp_calendar(ctx,from,to,u){const [x,y,w,h]=SP_WB.cal;wc_part(ctx,[[x-12,y+h],[x+w+12,y+h],[x+w-20,y+h-30],[x+20,y+h-30]],[60,62,70],1);
  const page=(s,k,a)=>{if(a<=0.01)return;ctx.save();ctx.translate(x+w/2,y);ctx.scale(1,Math.max(0.02,k));withA(ctx,a,()=>{ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(-w/2,0,w,h-30);
    ctx.fillStyle=rgba([204,62,50],1);ctx.fillRect(-w/2,0,w,40);ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2;ctx.strokeRect(-w/2,0,w,h-30);
    wc_T(ctx,s,0,(h-30)*0.68,{w:800,size:76,align:"center",col:WC_DARK,deco:k<0.999?1:0});});ctx.restore();};
  if(u<=0||from===to)page(to,1,1);else{page(to,1,1);page(from,Math.cos(u*Math.PI/2),1);}
  for(let i=0;i<9;i++){ctx.fillStyle=rgba([90,90,100],1);ctx.beginPath();ctx.arc(x+24+i*(w-48)/8,y,5,0,TAU);ctx.fill();}}

// the city, wide, at night: the bank's tower near on the left with its one lit floor; towers all round, most of their windows dark
const SP_CT={bank:[90,430,150],floor:[300,446,330,40]},SP_CITY2=sp_towers(75,500,W+60,1100,380,760,140,260);
function sp_paintCityWide(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);sp_paintSky(ctx,0,0,W,H);
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,1100,1300,[160,110,120],0.5);ctx.restore();
  sp_paintTowers(ctx,sp_towers(71,-40,W+40,1090,260,520,90,170),1090,SP_NIGHT.far,0.1,72,0.9);
  sp_paintTowers(ctx,SP_CITY2,1100,SP_NIGHT.mid2,0.06,76,1.1);
  // the bank's tower: a dark wash, rows of dark windows, and one floor lit across
  const [bx,bw,bt]=SP_CT.bank;wc_wash(ctx,wc_rect(bx,bt,bw,H-bt+40),SP_NIGHT.near,{kind:"build",lw:1.4,seed:77});wc_flat(ctx,wc_rect(bx+bw*0.3,bt-40,bw*0.4,40),SP_NIGHT.near,1,"roof");
  ctx.fillStyle=rgba([70,78,110],0.7);for(let yy=bt+30;yy<H;yy+=46)for(let xx=bx+20;xx<bx+bw-30;xx+=34)ctx.fillRect(xx,yy,20,24);
  const [fx,fy,fw,fh]=SP_CT.floor;sp_lit(ctx,bx+16,fy,bw-32,fh,0.92);ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,bx+bw/2,fy+fh/2,300,[255,210,140],0.4);ctx.restore();
  // inside, against the light: the backs of the screens along the desks, and one person still at hers, by a lamp
  ctx.fillStyle=rgba([70,56,60],0.75);for(let xx=bx+28;xx<bx+bw-30;xx+=46){ctx.fillRect(xx,fy+fh-15,17,11);ctx.fillRect(xx+7,fy+fh-4,3,4);}
  const px=bx+bw*0.58;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,px+22,fy+fh-14,26,[255,236,190],0.9);ctx.restore();
  ctx.fillStyle=rgba([62,48,54],0.9);ctx.beginPath();ctx.arc(px,fy+fh-24,5,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(px-10,fy+fh);ctx.quadraticCurveTo(px-10,fy+fh-17,px,fy+fh-17);ctx.quadraticCurveTo(px+10,fy+fh-17,px+10,fy+fh);ctx.fill();
  ctx.fillStyle=rgba(SP_NIGHT.near,0.9);for(let xx=bx+16;xx<bx+bw-16;xx+=34)ctx.fillRect(xx+22,fy,6,fh);}
// the windows that light one after another in the other towers, on their own grids: [x, y, when], kept once
const SP_LATE=(()=>{const R=wc_rng(91),o=[],k=1.1,cw=12*k,ch=16*k,gx=8*k,gy=12*k;SP_CITY2.forEach(([x,w,top])=>{for(let yy=top+16*k;yy<1100-24*k;yy+=ch+gy)for(let xx=x+10*k;xx<x+w-cw-6*k;xx+=cw+gx)if(R()<0.16)o.push([xx,yy,R()]);});return o;})();
function sp_lateWindows(ctx,u){if(u<=0)return;const k=1.1;SP_LATE.forEach(([x,y,w])=>{const a=clamp((u-w*0.85)/0.15,0,1);if(a>0)sp_lit(ctx,x,y,12*k,16*k,0.85*a);});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1250,760,900,[255,200,130],0.1*u);ctx.restore();}

/* ---------- the 1970s: an office floor that begins to share its data ---------- */
// three departments round one shared computer: sales on the left, shipping on the right, accounts in front; the computer stands on its
// raised floor at the back, its tape reels behind glass, and each department's sign hangs from the ceiling. The desks and their
// terminals are a layer of their own (desks70), drawn over the people at them. SP_70 says where: the wall's foot, the computer
// [x, y, w, h], and each desk: who sits at it, its span and top, the seat [x, scale], the terminal [x, scale, which way its screen
// faces: 1 to the right], the sign's middle and name.
const SP_70={fy:690,cab:[760,230,400,410],desks:[
  {id:"spSales",x0:60,x1:600,top:770,seat:[400,0.86],term:[110,0.72,1],sign:[420,"sales"]},
  {id:"spShip",x0:1320,x1:1860,top:770,seat:[1520,0.86],term:[1810,0.72,-1],sign:[1520,"shipping"]},
  {id:"spAcct",x0:620,x1:1300,top:870,seat:[1010,0.95],term:[700,0.82,1],sign:[1100,"accounts"]}]};
const SP_WALL70=[232,208,156],SP_WOOD70=[134,90,56],SP_CARPET70=[158,104,60],SP_DESK70=[190,146,98],SP_BEIGE=[228,216,190],SP_CAB=[186,196,202],SP_SIGN70=[150,92,52];
// a window with its venetian blind two thirds down: the far side of the street in daylight, then the slats, the cord
function sp_blinds(ctx,x,y,w,h,seed){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgb(204,218,228)");g.addColorStop(1,"rgb(234,236,228)");
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);const R=wc_rng(seed);for(let bx=x-20;bx<x+w;bx+=90+R()*60){const bh=h*(0.4+R()*0.5);wc_part(ctx,wc_rect(bx,y+h-bh,80+R()*40,bh+10),[198,190,176],0.4,{line:false,seed:seed+bx});}
  const down=y+h*0.66;for(let sy=y+4;sy<down;sy+=15){ctx.fillStyle="rgba(240,230,206,0.92)";ctx.fillRect(x,sy,w,10);ctx.fillStyle="rgba(150,130,100,0.35)";ctx.fillRect(x,sy+10,w,1.5);}
  ctx.fillStyle="rgba(150,130,100,0.6)";ctx.fillRect(x,down,w,6);ctx.restore();
  for(const r of [wc_rect(x-12,y-12,w+24,12),wc_rect(x-12,y-12,12,h+24),wc_rect(x+w,y-12,12,h+24),wc_rect(x-12,y+h,w+24,12)])wc_part(ctx,r,[176,170,160],1,{lw:1.1});
  ctx.save();ctx.strokeStyle="rgba(120,110,96,0.7)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+w-24,y);ctx.lineTo(x+w-24,y+h*0.8);ctx.stroke();ctx.restore();}
// a video terminal of the time on a desk whose top is at y: a deep beige box, its screen turned to whoever sits beside it (face 1: to
// the right) with lines of green text, and its keyboard in front, towards them
function sp_terminal(ctx,x,y,s,face){ctx.save();ctx.translate(x,y);ctx.scale(face*s,s);
  wc_part(ctx,[[0,-8],[0,-140],[96,-158],[100,0]],wc_dim(SP_BEIGE,0.1),1,{kind:"thing",lw:1.4,seed:3});
  wc_part(ctx,[[0,-140],[34,-152],[150,-166],[96,-158]],wc_lit(SP_BEIGE,0.12),1,{kind:"thing",lw:1.2,seed:5});
  wc_part(ctx,[[96,-158],[150,-166],[154,-10],[100,0]],SP_BEIGE,1,{kind:"thing",lw:1.4,seed:7});
  wc_flat(ctx,[[106,-146],[144,-151],[146,-62],[108,-58]],[24,46,34],1,"screen");
  ctx.strokeStyle="rgba(120,232,150,0.75)";ctx.lineWidth=2.4;for(let i=0;i<6;i++){const yy=-136+i*12,l=0.4+0.5*((i*37)%7)/7;ctx.beginPath();ctx.moveTo(112,yy);ctx.lineTo(112+28*l,yy-1);ctx.stroke();}
  wc_part(ctx,[[106,-2],[214,-14],[228,12],[114,22]],wc_lit(SP_BEIGE,0.05),1,{kind:"thing",lw:1.2,seed:9});
  ctx.fillStyle="rgba(120,108,90,0.55)";for(let r=0;r<3;r++)for(let k=0;k<7;k++)ctx.fillRect(118+k*14+r*3,-2+r*7-k*1.4,10,4);ctx.restore();}
// a terminal screen's green light, on the desk and on whoever sits at it
function sp_termGlow(ctx,d,a){const [x,s,f]=d.term;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+f*s*126,d.top-100*s,190,[110,220,150],0.22*a);ctx.restore();}
// the shared computer on its raised floor: a tape drive's two reels behind glass with the columns under them, a panel of lamps
// (sp_blink lights them, every frame), and plain doors under the lamps
function sp_computer(ctx){const [x,y,w,h]=SP_70.cab,fy=y+h,gx=x+18,gy=y+30,gw=w*0.48,gh=150,px=x+w*0.55,pw=w*0.4;
  wc_part(ctx,wc_rect(x-70,fy,w+140,50),[176,174,166],1,{lw:1.2,seed:81});wc_flat(ctx,wc_rect(x-70,fy,w+140,8),wc_lit([176,174,166],0.2),1,"edge");
  ctx.fillStyle="rgba(90,86,80,0.35)";for(let vx=x-50;vx<x+w+60;vx+=40)ctx.fillRect(vx,fy+20,24,6);wc_contact(ctx,x-20,x+w+20,fy+2,0.9,0.32);
  wc_part(ctx,wc_rect(x,y,w,h),SP_CAB,1,{kind:"thing",lw:1.6,seed:83});wc_part(ctx,wc_rect(x-6,y-14,w+12,24),wc_dim(SP_CAB,0.3),1,{lw:1.2,seed:84});
  wc_flat(ctx,wc_rect(gx,gy,gw,gh),[64,74,86],1,"glass");
  for(const rx of [gx+gw*0.27,gx+gw*0.73]){const ry=gy+gh*0.48;wc_wash(ctx,wc_ell(rx,ry,44,44,30),[214,218,222],{kind:"thing",lw:1.3,seed:rx|0});
    wc_wash(ctx,wc_ell(rx,ry,34,34,30),[70,56,48],{kind:"thing",line:false,flat:true,seed:(rx|0)+1});wc_wash(ctx,wc_ell(rx,ry,12,12,16),[226,230,234],{kind:"thing",lw:1,seed:(rx|0)+2});}
  ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(255,255,255,0.16)";ctx.beginPath();ctx.moveTo(gx+20,gy);ctx.lineTo(gx+70,gy);ctx.lineTo(gx+20,gy+gh);ctx.lineTo(gx-30,gy+gh);ctx.closePath();ctx.fill();ctx.restore();
  for(const cx of [gx+gw*0.3,gx+gw*0.7])wc_flat(ctx,wc_rect(cx-14,gy+gh+24,28,h-gh-80),[96,104,112],1,"column");
  wc_flat(ctx,wc_rect(px,gy,pw,96),[58,62,72],1,"panel");wc_part(ctx,wc_rect(px,gy+116,pw,h-146),wc_lit(SP_CAB,0.06),1,{lw:1.1,seed:86});
  ctx.save();ctx.strokeStyle="rgba(90,96,104,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px+pw/2,gy+120);ctx.lineTo(px+pw/2,fy-34);ctx.stroke();ctx.restore();
  for(const hx of [px+pw/2-22,px+pw/2+12])wc_flat(ctx,wc_rect(hx,gy+250,10,40),[110,114,120],1,"handle");}
function sp_blink(ctx,t){const [x,y,w]=SP_70.cab,px=x+w*0.55+14,py=y+46,cols=[[236,84,60],[250,190,70],[120,220,120],[240,240,226]];
  for(let j=0;j<4;j++)for(let i=0;i<8;i++){const h=Math.sin(i*12.9898+j*78.233)*43758.5453,f=h-Math.floor(h),on=Math.sin(t*(1.2+f*3.4)+f*20)>0.1;
    ctx.fillStyle=rgba(cols[(i+j*3)%4],on?0.95:0.22);ctx.beginPath();ctx.arc(px+i*18,py+j*20,4.5,0,TAU);ctx.fill();}}
// a department's sign, hanging from the ceiling on two strings: its board painted, its name written every frame (sp_signName)
function sp_signBoard(ctx,x){ctx.save();ctx.strokeStyle="rgba(80,70,60,0.6)";ctx.lineWidth=2;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(x+s*90,20);ctx.lineTo(x+s*90,76);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(x-130,74,260,66),SP_SIGN70,1,{kind:"thing",lw:1.4,seed:x|0});}
function sp_signName(ctx,x,s){wc_T(ctx,s,x,121,{w:700,size:40,align:"center",col:[252,240,214]});}
function sp_paintOffice70(ctx){const K=SP_70,fy=K.fy;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  // the wall, the panelling under the windows, the carpet, the ceiling and its strip lights
  wc_wash(ctx,wc_rect(-40,-40,W+80,fy+40),SP_WALL70,{kind:"plaster",line:false,seed:101});wc_wash(ctx,wc_rect(-40,470,W+80,fy-470),SP_WOOD70,{kind:"build",line:false,seed:103});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(SP_WOOD70,0.35),0.45);ctx.lineWidth=2;for(let gx=20;gx<W;gx+=64){ctx.beginPath();ctx.moveTo(gx,474);ctx.lineTo(gx,fy);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(-40,456,W+80,18),wc_lit(SP_WOOD70,0.1),1,{lw:1.2,seed:104});wc_wash(ctx,wc_rect(-40,fy,W+80,H-fy+40),SP_CARPET70,{kind:"ground",line:false,seed:105});
  wc_wash(ctx,wc_rect(-40,-40,W+80,74),[238,232,214],{kind:"plaster",line:false,seed:107});
  for(const lx of [150,640,1180,1670]){wc_flat(ctx,wc_rect(lx,6,220,20),[252,250,240],1,"tube");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+110,40,300,[255,250,226],0.35);ctx.restore();}
  // the windows; between them a print of a sunset and the clock; the computer; the signs
  sp_blinds(ctx,90,150,450,290,111);sp_blinds(ctx,1380,150,450,290,113);
  wc_part(ctx,wc_rect(568,232,164,134),[110,74,46],1,{lw:1.2,seed:115});wc_flat(ctx,wc_rect(580,244,140,110),[244,184,104],1,"print");
  wc_wash(ctx,wc_ell(650,318,28,28,24),[252,226,150],{kind:"thing",line:false,flat:true,seed:116});wc_flat(ctx,[[580,354],[580,330],[612,318],[650,336],[692,314],[720,330],[720,354]],[150,84,56],1,"hills");
  wc_wash(ctx,wc_ell(1270,300,60,60,40),[120,84,52],{kind:"thing",lw:1.4,seed:117});wc_wash(ctx,wc_ell(1270,300,50,50,40),[250,246,236],{kind:"thing",line:false,flat:true,seed:118});
  ctx.save();ctx.strokeStyle="rgba(60,50,44,0.85)";ctx.lineCap="round";for(let i=0;i<12;i++){const a=i*TAU/12;ctx.lineWidth=i%3?2:3.5;ctx.beginPath();ctx.moveTo(1270+Math.cos(a)*40,300+Math.sin(a)*40);
    ctx.lineTo(1270+Math.cos(a)*46,300+Math.sin(a)*46);ctx.stroke();}ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(1270,300);ctx.lineTo(1270+Math.cos(-1.2)*26,300+Math.sin(-1.2)*26);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1270,300);ctx.lineTo(1270+Math.cos(-0.1)*38,300+Math.sin(-0.1)*38);ctx.stroke();ctx.restore();
  sp_computer(ctx);K.desks.forEach(d=>sp_signBoard(ctx,d.sign[0]));
  // the chairs' backs, orange, behind the desks
  K.desks.forEach((d,i)=>{const [sx,s]=d.seat;wc_part(ctx,wc_rrPts(sx-78*s,d.top-250*s,156*s,260*s,30*s),[204,112,54],1,{seed:120+i});});}
// the desks, over the people at them: a laminate top, a panel down to the floor, a pedestal of drawers; on each its terminal, and what
// the department keeps there: a telephone in sales, an in-tray in accounts, a pile of delivery notes in shipping, and mugs
function sp_paintDesks70(ctx){SP_70.desks.forEach((d,i)=>{const {x0,x1,top}=d,foot=top+(top>800?300:190),col=SP_DESK70,dx=d.term[2]>0?x1-190:x0+20;
    wc_contact(ctx,x0-20,x1+20,foot,0.9,0.3);wc_part(ctx,wc_rect(x0+20,top+20,x1-x0-40,foot-top-20),wc_dim(col,0.18),1,{seed:130+i});
    wc_part(ctx,wc_rect(dx,top+20,170,foot-top-20),wc_dim(col,0.08),1,{seed:133+i});for(let k=0;k<3;k++)wc_flat(ctx,wc_rect(dx+55,top+50+k*(foot-top-40)/3,60,8),wc_dim(col,0.45),1,"handle");
    wc_part(ctx,wc_rect(x0-8,top,x1-x0+16,24),wc_lit(col,0.1),1,{seed:136+i});sp_terminal(ctx,d.term[0],top+4,d.term[1],d.term[2]);});
  const red=[214,96,52],px=556,py=774;wc_part(ctx,[[px-44,py],[px+44,py],[px+34,py-34],[px-34,py-34]],red,1,{kind:"thing",lw:1.3,seed:141});
  wc_part(ctx,[[px-50,py-30],[px+50,py-30],[px+42,py-50],[px-42,py-50]],wc_dim(red,0.15),1,{kind:"thing",lw:1.2,seed:142});wc_wash(ctx,wc_ell(px,py-15,17,11,20),[240,232,214],{kind:"thing",lw:1,seed:143});
  wc_part(ctx,wc_rect(1170,836,120,38),[150,150,150],1,{kind:"thing",lw:1.2,seed:144});for(let k=0;k<4;k++)wc_flat(ctx,wc_rect(1178+k*2,842-k*5,104,8),[250,248,240],1,"sheet");
  for(let k=0;k<6;k++)wc_flat(ctx,wc_rect(1360+(k%2)*6,766-k*7,110,8),k%2?[252,222,190]:[250,240,170],1,"sheet");
  gv_mug(ctx,476,774,[110,150,90]);gv_mug(ctx,1240,874-40,[200,120,60],true);}
// a pencil line from each terminal to the computer: where it starts, where it bends towards, where it lands; u draws them one by one
const SP_LINKS70=[[[165,660],[300,120],[905,222]],[[1755,660],[1620,120],[1015,222]],[[762,748],[560,300],[935,226]]];
function sp_links70(ctx,u){SP_LINKS70.forEach(([a,c,b],i)=>{const p=clamp(u*1.9-i*0.45,0,1);if(p<=0)return;const pts=[];
    for(let k=0;k<=24;k++){const v=k/24;pts.push([(1-v)*(1-v)*a[0]+2*v*(1-v)*c[0]+v*v*b[0],(1-v)*(1-v)*a[1]+2*v*(1-v)*c[1]+v*v*b[1]]);}
    wc_pencil(ctx,pts,p,{lw:3.6,col:[70,64,80],seed:41+i});ctx.save();ctx.fillStyle=rgba([70,64,80],0.9);ctx.beginPath();ctx.arc(a[0],a[1],6,0,TAU);ctx.fill();
    if(p>=1){ctx.beginPath();ctx.arc(b[0],b[1],6,0,TAU);ctx.fill();}ctx.restore();});}
// a note stuck on with a strip of tape: handwriting on a coloured slip, landing a little large and settling (p 0 to 1)
function sp_slip(ctx,x,y,w,h,col,rot,lines,size,p,seed){if(p<=0.01)return;const k=lerp(1.25,1,1-Math.pow(1-clamp(p,0,1),3));ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(k,k);
  withA(ctx,clamp(p*2,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:col,washA:0.6,seed});ctx.fillStyle="rgba(240,236,220,0.65)";ctx.fillRect(-30,-h/2-10,60,22);
    lines.forEach((l,i)=>wc_hand(ctx,l,-w/2+22,-h/2+size*1.15+i*size*1.18,{size,col:WC_DARK,w:600}));});ctx.restore();}

/* ---------- the 1970s: the data administrator's office ---------- */
// seen from the corridor: her door, its glass lettered with the job's name, and the glass wall of her office; inside, shelves of binders,
// a window with its blind, her desk with a typewriter, a lamp and the dictionary open in front of her. Her desk, the glass, its frame
// and the panel under it are a layer of their own (adminFront70), over her. SP_AD: the door and its pane, the glass, her desk's top
// and span, her seat [x, scale], her lamp.
const SP_AD={door:[60,160,320,700],pane:[92,210,256,262],glass:[420,150,1460,610],floor:860,top:700,desk:[860,1620],seat:[1180,0.9],lamp:[1450,700]};
const SP_AVO=[198,198,148];
function sp_paintAdmin70(ctx){const A=SP_AD,[gx,gy,gw,gh]=A.glass;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,A.floor+40),SP_WALL70,{kind:"plaster",line:false,seed:151});wc_wash(ctx,wc_rect(-40,A.floor,W+80,H-A.floor+40),SP_CARPET70,{kind:"ground",line:false,seed:152});
  wc_wash(ctx,wc_rect(-40,A.floor-16,W+80,18),wc_dim(SP_WALL70,0.25),{kind:"trim",line:false,flat:true});
  // inside, through the glass: her wall, her shelves of binders, her window, her chair's back
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();wc_wash(ctx,wc_rect(gx-20,gy-20,gw+40,gh+40),SP_AVO,{kind:"plaster",line:false,seed:153});
  gv_bookcase(ctx,470,760,500,560,[330,470,610],{col:[150,104,66]});const R=wc_rng(155),bc=[[200,110,50],[150,84,44],[214,170,70],[120,130,80],[236,220,190],[170,70,50]];
  for(const sy of [330,470,610]){let bx=500;while(bx<930){const bw=26+R()*10,bh=104+R()*16;gv_binder(ctx,bx,sy-bh,bw,bh,bc[Math.floor(R()*bc.length)]);bx+=bw+3;}}
  sp_blinds(ctx,1490,210,330,300,157);wc_part(ctx,wc_rrPts(A.seat[0]-74,A.top-236,148,250,28),[150,84,44],1,{seed:158});ctx.restore();
  // her door: the frame, the wood, the pane of frosted glass with a gold rule under where its lettering goes, the handle
  const [dx,dy,dw,dh]=A.door,[qx,qy,qw,qh]=A.pane;wc_wash(ctx,wc_rect(dx-18,dy-18,dw+36,dh+18),[206,176,124],{kind:"trim",lw:1.5});wc_wash(ctx,wc_rect(dx,dy,dw,dh),[146,98,58],{kind:"door",lw:1.6,seed:159});
  wc_flat(ctx,wc_rect(qx-8,qy-8,qw+16,qh+16),[120,80,48],1,"frame");wc_flat(ctx,wc_rect(qx,qy,qw,qh),[220,226,222],1,"glass");
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,qx+qw*0.6,qy+qh*0.4,200,[255,250,230],0.3);ctx.restore();
  ctx.fillStyle=rgba([170,124,40],0.9);ctx.fillRect(qx+40,qy+176,qw-80,3);wc_part(ctx,wc_rect(dx+dw-46,dy+dh*0.52,30,14),[200,170,100],1,{kind:"thing",lw:1.1});
  wc_part(ctx,wc_rect(dx+30,dy+dh*0.62,dw-60,dh*0.3),wc_dim([146,98,58],0.08),1,{lw:1.1,seed:160});}
// over her: her desk and what's on it, then the glass with its light, its frame and mullion, and the panel under it
function sp_paintAdminFront70(ctx){const A=SP_AD,[gx,gy,gw,gh]=A.glass,[x0,x1]=A.desk,top=A.top,col=[176,128,84];
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();
  wc_part(ctx,wc_rect(x0+20,top+20,x1-x0-40,200),wc_dim(col,0.2),1,{seed:161});wc_part(ctx,wc_rect(x0-8,top,x1-x0+16,24),wc_lit(col,0.1),1,{seed:162});
  // a typewriter on the left, a stack of binders on the right, the lamp, and the dictionary open in front of her
  const tx=876;wc_part(ctx,[[tx,top+4],[tx+170,top+4],[tx+160,top-50],[tx+10,top-50]],[96,104,96],1,{kind:"thing",lw:1.3,seed:163});
  wc_part(ctx,wc_rect(tx+20,top-92,130,46),[236,234,226],1,{lw:1.1,seed:164});wc_part(ctx,wc_rect(tx-6,top-62,182,14),[70,76,70],1,{lw:1.1,seed:165});
  ctx.fillStyle="rgba(230,226,214,0.6)";for(let r=0;r<3;r++)for(let k=0;k<9;k++){ctx.beginPath();ctx.arc(tx+30+k*14+r*4,top-38+r*11,3.6,0,TAU);ctx.fill();}
  for(let k=0;k<4;k++)gv_book(ctx,1500+(k%2)*8,top+2-k*16,104,[[200,110,50],[120,130,80],[214,170,70],[150,84,44]][k]);
  const [lx]=A.lamp;wc_part(ctx,wc_rect(lx-5,top-120,10,120),[60,54,50],1,{lw:1});wc_wash(ctx,wc_ell(lx,top+2,38,8,20),[60,54,50],{kind:"thing",lw:1.1});
  wc_wash(ctx,[[lx-64,top-96],[lx-48,top-132],[lx,top-148],[lx+48,top-132],[lx+64,top-96]],[226,120,44],{kind:"thing",lw:1.3,seed:166});
  wc_part(ctx,[[1086,top+6],[1180,top+10],[1280,top+6],[1270,top-14],[1180,top-8],[1096,top-14]],[250,248,240],1,{lw:1.2,seed:167});
  wc_part(ctx,[[1070,top+12],[1290,top+12],[1286,top+4],[1074,top+4]],[176,92,48],1,{lw:1,seed:168});ctx.restore();
  // the glass: a cool tint, two streaks of light; the frame, the mullion; the panel under the glass
  ctx.save();ctx.fillStyle="rgba(200,226,232,0.12)";ctx.fillRect(gx,gy,gw,gh);ctx.globalCompositeOperation="screen";
  for(const [sx,sw] of [[520,90],[640,36],[1300,110],[1440,40]]){ctx.fillStyle="rgba(255,255,255,0.13)";ctx.beginPath();ctx.moveTo(sx,gy);ctx.lineTo(sx+sw,gy);ctx.lineTo(sx+sw-260,gy+gh);ctx.lineTo(sx-260,gy+gh);ctx.closePath();ctx.fill();}ctx.restore();
  for(const r of [wc_rect(gx-16,gy-16,gw+32,16),wc_rect(gx-16,gy-16,16,gh+32),wc_rect(gx+gw,gy-16,16,gh+32),wc_rect(1069,gy,12,gh)])wc_part(ctx,r,[184,182,174],1,{lw:1.2});
  wc_part(ctx,wc_rect(gx-16,gy+gh,gw+32,A.floor-gy-gh),[146,104,64],1,{seed:169});ctx.save();ctx.strokeStyle=rgba([100,70,44],0.45);ctx.lineWidth=2;for(let x=gx+40;x<gx+gw;x+=64){ctx.beginPath();ctx.moveTo(x,gy+gh+6);ctx.lineTo(x,A.floor-4);ctx.stroke();}ctx.restore();}
// her lamp's warm light, and the lettering on her door's glass, in gold
function sp_adminLamp(ctx,a){const [lx]=SP_AD.lamp,top=SP_AD.top;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx,top-60,300,[255,200,120],0.42*a);wc_glowAt(ctx,lx,top-100,70,[255,236,190],0.6*a);ctx.restore();}
function sp_doorName(ctx){const [qx,qy,qw]=SP_AD.pane,gold=[132,92,22];wc_T(ctx,"Data",qx+qw/2,qy+112,{w:700,size:40,f:"serif",align:"center",col:gold});
  wc_T(ctx,"administration",qx+qw/2,qy+160,{w:700,size:34,f:"serif",align:"center",col:gold});}

/* ---------- the 1970s: the dictionary, open on her desk ---------- */
// from above: the desk and its green blotter, the binder's covers, two typed pages of words and what they mean, the rings; her mug and
// a pencil. The page's title and the new entry she writes on the right page are drawn every frame.
const SP_DC={left:[300,110,640,860],right:[980,110,640,860],rings:[300,540,780]};
function sp_paintDict70(ctx){const D=SP_DC;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[184,138,92],{kind:"plaster",line:false,seed:171});
  ctx.save();ctx.strokeStyle=rgba([140,100,62],0.25);ctx.lineWidth=2;for(let y=14;y<H;y+=30){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+3*Math.sin(x/150+y));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(170,20,1580,1100),[62,96,72],1,{seed:172});ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(40,30,20,0.35)";rr(ctx,262,96,1420,930,24);ctx.fill();ctx.restore();
  wc_part(ctx,wc_rrPts(250,72,1420,946,22),[176,92,48],1,{kind:"cover",lw:1.5,seed:173});wc_flat(ctx,wc_rect(938,84,44,920),wc_dim([176,92,48],0.25),1,"spine");
  for(const [x,y,w,h] of [D.left,D.right]){ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(60,40,30,0.25)";ctx.fillRect(x+6,y+8,w,h);ctx.restore();wc_wash(ctx,wc_rect(x,y,w,h),[252,250,244],{kind:"page",lw:1.3,seed:x});}
  for(const ry of D.rings){for(const hx of [D.left[0]+D.left[2]-26,D.right[0]+26]){ctx.fillStyle="rgba(90,80,70,0.55)";ctx.beginPath();ctx.arc(hx,ry,9,0,TAU);ctx.fill();}
    wc_wash(ctx,wc_ell(960,ry,46,20,24),[206,210,216],{kind:"thing",lw:1.3,seed:ry});wc_wash(ctx,wc_ell(960,ry,34,11,24),[176,92,48],{kind:"thing",line:false,flat:true,seed:ry+1});}
  // the typed entries: each a word in capitals (a short dark bar) and two or three lines of what it means
  const typed=(x,y,n)=>{for(let i=0;i<n;i++){const by=y+i*128;ctx.fillStyle=rgba([60,56,52],0.6);ctx.fillRect(x,by,90+((i*53)%60),9);gv_lines(ctx,x+24,by+30,500,2+(i%2),22,1.1);}};
  typed(360,300,5);typed(1040,170,2);
  // the mug, the pencil, the lamp's light from the right
  wc_wash(ctx,wc_ell(1790,190,64,64,30),[230,130,60],{kind:"thing",lw:1.4,seed:174});wc_wash(ctx,wc_ell(1790,190,50,50,30),[96,66,48],{kind:"thing",line:false,flat:true,seed:175});
  wc_wash(ctx,[[1846,170],[1880,166],[1882,214],[1846,210]],[230,130,60],{kind:"thing",lw:1.2,bare:true,seed:176});
  wc_part(ctx,[[1700,880],[1890,940],[1886,952],[1696,892]],[240,190,60],1,{lw:1.1,seed:177});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1700,300,1100,[255,220,160],0.3);ctx.restore();ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,1080,900,[150,140,160],0.45);ctx.restore();}
// a hand writing, seen from above, the nib at x, y: the pen's tail to the top right, the index finger along it, the thumb's tip beyond
// it, the back of the hand, the curled fingers' knuckles, the wrist and the sleeve going off to the bottom right. who: whose skin and
// sleeve; s: its size. Drawn along the pen (x) and across it (y, toward the hand), then turned.
function sp_penHand(ctx,x,y,s,who){const P_=PEOPLE[who||"spAdmin"],skin=P_.skin,cuff=P_.top.c,ink=[34,40,70];ctx.save();ctx.translate(x,y);ctx.scale(s||1,s||1);ctx.rotate(-Math.PI/4);
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(60,40,30,0.16)";ctx.beginPath();ctx.ellipse(40,100,70,90,0.1,0,TAU);ctx.fill();ctx.restore();
  ctx.beginPath();ctx.moveTo(48,104);ctx.lineTo(126,98);ctx.lineTo(128,170);ctx.lineTo(36,178);ctx.closePath();litFill(ctx,skin,126,98,36,178);seam(ctx,skin,0.35,1.6);
  if(P_.top.kind==="suit"&&P_.top.inner){const sh=P_.top.inner;ctx.beginPath();ctx.moveTo(32,148);ctx.quadraticCurveTo(84,134,134,132);ctx.lineTo(136,170);ctx.lineTo(30,186);ctx.closePath();
    litFill(ctx,sh,134,132,30,186);seam(ctx,sh,0.4,1.6);ctx.save();ctx.translate(0,22);}else ctx.save();
  ctx.beginPath();ctx.moveTo(30,156);ctx.quadraticCurveTo(84,142,136,140);ctx.lineTo(160,900);ctx.lineTo(-30,900);ctx.closePath();litFill(ctx,cuff,160,400,-30,400);seam(ctx,cuff,0.5,2);
  ctx.strokeStyle=rgba(wc_dim(cuff,0.3),0.35);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(52,230);ctx.quadraticCurveTo(70,300,60,380);ctx.stroke();
  ctx.beginPath();ctx.moveTo(30,158);ctx.quadraticCurveTo(84,144,136,142);ctx.strokeStyle=rgba(wc_dim(cuff,0.35),0.8);ctx.lineWidth=5;ctx.stroke();ctx.restore();
  ctx.beginPath();ctx.moveTo(64,2);ctx.quadraticCurveTo(58,-20,38,-21);ctx.quadraticCurveTo(20,-21,18,-10);ctx.quadraticCurveTo(22,0,36,3);ctx.closePath();litFill(ctx,skin,18,-21,64,3);seam(ctx,skin,0.45,1.6);
  ctx.lineCap="round";ctx.strokeStyle=rgba(ink,1);ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(168,0);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(74,-2.5);ctx.lineTo(160,-2.5);ctx.stroke();
  ctx.fillStyle=rgba([200,176,110],1);ctx.beginPath();ctx.moveTo(-1,0);ctx.lineTo(16,-5);ctx.lineTo(16,5);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(44,12);ctx.quadraticCurveTo(84,2,118,14);ctx.quadraticCurveTo(146,34,142,80);ctx.quadraticCurveTo(136,116,108,124);
  ctx.quadraticCurveTo(70,130,48,116);ctx.quadraticCurveTo(26,96,28,60);ctx.quadraticCurveTo(30,26,44,12);ctx.closePath();litFill(ctx,skin,28,2,146,130);seam(ctx,skin,0.45,1.8);
  ctx.strokeStyle=rgba(darken(skin,0.3),0.35);ctx.lineWidth=1.6;for(const [kx,ky] of [[46,58],[48,82],[56,104]]){ctx.beginPath();ctx.arc(kx,ky,12,Math.PI*0.55,Math.PI*1.45);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(70,6);ctx.quadraticCurveTo(44,-6,22,-4);ctx.quadraticCurveTo(10,-2,10,4);ctx.quadraticCurveTo(12,11,24,11);ctx.quadraticCurveTo(48,14,70,26);ctx.closePath();
  litFill(ctx,skin,10,-6,70,26);seam(ctx,skin,0.45,1.6);ctx.fillStyle=rgba(lighten(skin,0.3),0.8);ctx.beginPath();ctx.ellipse(18,3,6,4,0,0,TAU);ctx.fill();ctx.restore();}
// a line of handwriting too small to read, from x along y, w long, written up to p (a heading, a little heavier); returns where the pen is
function sp_scribble(ctx,x,y,w,p,seed,head){const R=wc_rng(seed),n=Math.max(2,Math.round(w/7)),q=clamp(p,0,1),m=Math.round(n*q),pts=[],gap=[];
  for(let i=0;i<=n;i++){pts.push([x+w*i/n,y+Math.sin(i*1.9+R()*2)*5-(R()<0.12?7:0)]);gap.push(i>2&&i<n-2&&R()<0.11);}
  if(m>0){ctx.save();ctx.strokeStyle=rgba([36,56,130],0.92);ctx.lineWidth=head?5:3;ctx.lineJoin=ctx.lineCap="round";ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
    for(let i=1;i<=m;i++){if(gap[i])ctx.moveTo(pts[i][0],pts[i][1]);else ctx.lineTo(pts[i][0],pts[i][1]);}ctx.stroke();ctx.restore();}
  return pts[m];}

/* ---------- Los Angeles, 1980: an office building at dusk, and the meeting in it ---------- */
// a dusk sky, purple above and orange low down, in a rectangle
function sp_duskSky(ctx,x,y,w,h,k){k=k||0;const g=ctx.createLinearGradient(0,y,0,y+h),c=(a,b)=>"rgb("+a.map((v,i)=>Math.round(lerp(v,b[i],k))).join(",")+")";
  g.addColorStop(0,c([84,82,140],[44,46,96]));g.addColorStop(0.45,c([176,118,150],[110,80,128]));g.addColorStop(0.8,c([246,160,110],[206,122,110]));g.addColorStop(1,c([252,198,132],[236,160,112]));
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.save();ctx.globalAlpha=0.35;wc_wash(ctx,wc_rect(x,y,w,h),[200,140,150],{kind:"plaster",line:false,seed:(x|0)+3});ctx.restore();}
// a fan palm against the sky, as they stand in Los Angeles: a tall thin trunk curving up from x, y to a small crown h above, the old
// fronds hanging under it as a skirt, the new ones each a stalk with a fan of leaves at its end, the leaves' tips drooping; in col
function sp_palm(ctx,x,y,h,lean,col,seed){const R=wc_rng(seed),tx=x+lean*h,ty=y-h,line=[],k=h/700;for(let i=0;i<=14;i++){const u=i/14;line.push([x+lean*h*u*u+Math.sin(u*3+seed)*h*0.01,y-h*u]);}
  wc_wash(ctx,wc_band(line,h*0.02,h*0.012),col,{kind:"trunk",line:false,flat:true,seed});
  ctx.save();ctx.fillStyle=rgba(col,1);ctx.strokeStyle=rgba(col,1);ctx.lineCap="round";ctx.lineJoin="round";
  const sk=58*k,sw=15*k;ctx.beginPath();ctx.moveTo(tx-sw,ty-4*k);ctx.quadraticCurveTo(tx-sw*1.5,ty+sk*0.5,tx-sw*0.8,ty+sk);ctx.lineTo(tx-sw*0.3,ty+sk*0.9);ctx.lineTo(tx,ty+sk*1.08);
  ctx.lineTo(tx+sw*0.3,ty+sk*0.9);ctx.lineTo(tx+sw*0.8,ty+sk);ctx.quadraticCurveTo(tx+sw*1.5,ty+sk*0.5,tx+sw,ty-4*k);ctx.closePath();ctx.fill();
  const n=15;for(let i=0;i<n;i++){const a=-Math.PI/2+(i/(n-1)-0.5)*Math.PI*1.55+(R()-0.5)*0.2,L=(22+R()*12)*k,ex=tx+Math.cos(a)*L,ey=ty+Math.sin(a)*L*0.8+Math.abs(Math.cos(a))*L*0.3;
    ctx.lineWidth=3*k;ctx.beginPath();ctx.moveTo(tx,ty);ctx.quadraticCurveTo(tx+Math.cos(a)*L*0.55,ty+Math.sin(a)*L*0.55-5*k,ex,ey);ctx.stroke();
    const f=Math.atan2(ey-ty,ex-tx),fl=(24+R()*8)*k;ctx.beginPath();ctx.moveTo(ex,ey);ctx.arc(ex,ey,fl*0.55,f-0.75,f+0.75);ctx.closePath();ctx.fill();
    ctx.lineWidth=2.2*k;for(let j=0;j<9;j++){const b=f+(j/8-0.5)*1.7,l=fl*(0.85+R()*0.3),mx=ex+Math.cos(b)*l*0.6,my=ey+Math.sin(b)*l*0.6,qx=ex+Math.cos(b)*l,qy=ey+Math.sin(b)*l+l*0.28;
      ctx.beginPath();ctx.moveTo(ex,ey);ctx.quadraticCurveTo(mx,my,qx,qy);ctx.stroke();}}
  ctx.beginPath();ctx.arc(tx,ty,8*k,0,TAU);ctx.fill();ctx.restore();}
// the hills and a low skyline at dusk in a band whose foot is base, from x0 to x1: towers here and there, a few windows lit
function sp_duskCity(ctx,x0,x1,base,seed,k){const R=wc_rng(seed);wc_wash(ctx,[[x0-40,base],[x0-40,base-150],[x0+200,base-210],[x0+520,base-170],[x0+800,base-240],[x1+40,base-180],[x1+40,base]],[150,112,150],{kind:"land",line:false,flat:true,seed});
  let x=x0;while(x<x1){const w=50+R()*90,h=(R()<0.25?160+R()*200:30+R()*70)*(k||1);wc_flat(ctx,wc_rect(x,base-h,w,h+4),[104,86,128],1,"build");
    for(let wy=base-h+12;wy<base-10;wy+=16)for(let wx=x+8;wx<x+w-8;wx+=14)if(R()<0.18)sp_lit(ctx,wx,wy,6,8,0.8);x+=w+R()*30;}}
const SP_LAO={bld:[80,420,1080,500],up:[140,480,960,92],down:[140,650,960,92],lit:[380,940]};
function sp_paintLaOut(ctx){const B=SP_LAO,[bx,by,bw,bh]=B.bld;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);sp_duskSky(ctx,0,0,W,760);
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1500,700,700,[255,190,120],0.5);ctx.restore();sp_duskCity(ctx,1000,W+40,720,201);
  // the street beyond the lot: its kerb, the verge, a low hedge; then the parking lot and its lines
  wc_wash(ctx,wc_rect(-40,708,W+80,170),[112,96,116],{kind:"ground",line:false,seed:202});wc_flat(ctx,wc_rect(-40,708,W+80,10),[150,128,140],1,"kerb");
  wc_wash(ctx,[[1150,812],[1150,780],[1300,770],[1500,778],[1700,766],[W+40,774],[W+40,820]],[74,84,80],{kind:"tree",line:false,flat:true,seed:204});
  wc_wash(ctx,wc_rect(-40,860,W+80,H-860+40),[104,90,104],{kind:"ground",line:false,seed:203});ctx.save();ctx.strokeStyle="rgba(236,226,200,0.35)";ctx.lineWidth=5;
  for(let x=1180;x<W;x+=190){ctx.beginPath();ctx.moveTo(x,1080);ctx.lineTo(x+80,900);ctx.stroke();}ctx.restore();
  // the building: stucco in the last light, a flat roof, two long rows of windows; upstairs the meeting's room is lit, people in it
  wc_contact(ctx,bx-30,bx+bw+30,by+bh,0.9,0.4);wc_part(ctx,wc_rect(bx,by,bw,bh),[200,166,160],1,{kind:"build",lw:1.6,seed:207});wc_part(ctx,wc_rect(bx-14,by-24,bw+28,30),[170,136,140],1,{lw:1.3,seed:208});
  for(const [x,y,w,h] of [B.up,B.down]){wc_flat(ctx,wc_rect(x,y,w,h),[66,74,110],1,"glass");}
  const [l0,l1]=B.lit,[ux,uy,,uh]=B.up;wc_flat(ctx,wc_rect(l0,uy,l1-l0,uh),[252,210,146],1,"lit");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,(l0+l1)/2,uy+uh/2,420,[255,200,120],0.45);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(l0,uy,l1-l0,uh);ctx.clip();ctx.filter="blur(2.5px)";
  [[418,44,0.34],[478,36,0.26],[548,50,0.36],[622,40,0.28],[690,48,0.34],[770,38,0.26],[846,52,0.36],[904,42,0.3]].forEach(([px,ph,a],i)=>{ctx.fillStyle=rgba([104,64,66],a);
    const hx=px+((i*37)%9-4),hy=uy+uh-ph-8;ctx.beginPath();ctx.ellipse(hx,hy,9+ph*0.04,11+ph*0.04,0,0,TAU);ctx.fill();
    ctx.beginPath();ctx.moveTo(px-24-ph*0.1,uy+uh+6);ctx.bezierCurveTo(px-22,hy+16,px+22,hy+16,px+24+ph*0.1,uy+uh+6);ctx.closePath();ctx.fill();});ctx.restore();
  for(let x=ux;x<=ux+B.up[2];x+=80)for(const [y,h] of [[uy,uh],[B.down[1],B.down[3]]])wc_flat(ctx,wc_rect(x-4,y,8,h),[170,136,140],1,"mullion");
  wc_flat(ctx,wc_rect(560,B.down[1],200,by+bh-B.down[1]),[240,214,170],1,"lobby");ctx.save();ctx.strokeStyle=rgba([150,120,110],0.8);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(560,B.down[1]+B.down[3]);ctx.lineTo(760,B.down[1]+B.down[3]);ctx.moveTo(660,B.down[1]+B.down[3]);ctx.lineTo(660,by+bh);ctx.stroke();ctx.restore();for(const px of [544,768])wc_part(ctx,wc_rect(px,640,8,by+bh-640),[120,96,104],1,{lw:1});
  wc_part(ctx,wc_rect(530,620,260,22),[140,110,116],1,{lw:1.2,seed:209});
  for(const px of [180,330,960,1070])wc_wash(ctx,wc_ell(px,by+bh-20,70,34,20),[70,96,72],{kind:"tree",lw:1.1,seed:px});
  // a street lamp coming on, the palms in front of the hills, and a car of the time parked in front of them
  wc_part(ctx,wc_rect(1176,600,10,330),[70,64,76],1,{lw:1});wc_part(ctx,[[1162,600],[1200,600],[1194,584],[1168,584]],[70,64,76],1,{lw:1});ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1181,606,90,[255,226,170],0.6);ctx.restore();
  const pc=[58,44,66];sp_palm(ctx,1250,930,760,0.06,pc,211);sp_palm(ctx,1500,920,620,-0.08,pc,212);sp_palm(ctx,1800,940,820,0.04,pc,213);sp_palm(ctx,24,930,700,0.1,pc,214);
  const cx=1320,cy=1000,car=[150,96,64];wc_contact(ctx,cx-20,cx+400,cy+6,0.9,0.4);wc_part(ctx,[[cx,cy-14],[cx,cy-62],[cx+70,cy-70],[cx+120,cy-118],[cx+270,cy-118],[cx+320,cy-72],[cx+390,cy-64],[cx+392,cy-14]],car,1,{kind:"thing",lw:1.4,seed:205});
  wc_flat(ctx,[[cx+132,cy-110],[cx+190,cy-110],[cx+190,cy-74],[cx+96,cy-74]],[70,80,110],1,"window");wc_flat(ctx,[[cx+204,cy-110],[cx+262,cy-110],[cx+306,cy-74],[cx+204,cy-74]],[70,80,110],1,"window");
  for(const wx of [cx+80,cx+316]){wc_wash(ctx,wc_ell(wx,cy-10,34,34,24),[40,36,40],{kind:"thing",lw:1.2,seed:wx|0});wc_wash(ctx,wc_ell(wx,cy-10,14,14,16),[170,170,176],{kind:"thing",line:false,flat:true});}}
// The meeting: a warm room in the evening, a flip chart on the left, a table across the room, the window behind it onto the palms and
// the lights coming on. People stand at the back, sit at the table (gv_behind at its top) and stand at the flip chart; the table is a
// layer of its own (la80table), over the people at it. SP_LA: the wall's foot, the window, the flip chart's pad, the table's span and
// top, who sits where, who stands at the back [x, who], the one at the flip chart [x, foot, scale], the card on the table.
const SP_LA={fy:700,win:[1160,96,720,500],pad:[90,170,460,470],table:[720,1880,800],
  seats:[[1230,"spAdmin"],[1450,"spLa9"],[1670,"spLa6"]],s:0.84,back:[[790,"spLa2"],[960,"spLa3"],[1120,"spLa4"],[1330,"spLa5"],[1540,"spLa7"],[1760,"spLa8"]],bs:0.72,bf:714,
  chart:[640,840,0.92],card:[750,640,400,160]};
const SP_WALL80=[226,206,178];
function sp_paintLa80(ctx){const L=SP_LA,[wx,wy,ww,wh]=L.win,[px,py,pw,ph]=L.pad;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,L.fy+40),SP_WALL80,{kind:"plaster",line:false,seed:221});wc_wash(ctx,wc_rect(-40,L.fy,W+80,H-L.fy+40),[150,110,90],{kind:"ground",line:false,seed:222});
  wc_wash(ctx,wc_rect(-40,L.fy-16,W+80,18),wc_dim(SP_WALL80,0.25),{kind:"trim",line:false,flat:true});wc_part(ctx,wc_rect(-40,430,wx+40,14),wc_dim(SP_WALL80,0.12),1,{lw:1});
  wc_wash(ctx,wc_rect(-40,-40,W+80,70),[236,230,214],{kind:"plaster",line:false,seed:223});ctx.save();ctx.strokeStyle="rgba(150,140,120,0.3)";ctx.lineWidth=1.5;for(let x=0;x<W;x+=96){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,30);ctx.stroke();}ctx.restore();
  for(const lx of [300,900]){wc_flat(ctx,wc_rect(lx,6,240,18),[252,250,240],1,"tube");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+120,40,320,[255,246,220],0.32);ctx.restore();}
  // the window: later dusk, the hills and the skyline lighting up, palms; its frame and mullions
  ctx.save();ctx.beginPath();ctx.rect(wx,wy,ww,wh);ctx.clip();sp_duskSky(ctx,wx,wy,ww,wh,0.45);ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww*0.6,wy+wh,420,[255,170,110],0.35);ctx.restore();
  sp_duskCity(ctx,wx-20,wx+ww+20,wy+wh-30,231,0.7);wc_flat(ctx,wc_rect(wx,wy+wh-34,ww,40),[86,74,96],1,"street");
  const pc=[48,36,58];sp_palm(ctx,wx+120,wy+wh+20,430,0.05,pc,232);sp_palm(ctx,wx+520,wy+wh+30,360,-0.07,pc,233);sp_palm(ctx,wx+680,wy+wh+20,470,0.03,pc,234);ctx.restore();
  for(const r of [wc_rect(wx-16,wy-16,ww+32,16),wc_rect(wx-16,wy-16,16,wh+32),wc_rect(wx+ww,wy-16,16,wh+32),wc_rect(wx+236,wy,12,wh),wc_rect(wx+476,wy,12,wh)])wc_part(ctx,r,[190,186,178],1,{lw:1.2});
  wc_wash(ctx,wc_rect(wx-30,wy+wh,ww+60,22),wc_dim(SP_WALL80,0.1),{kind:"trim",lw:1.4});
  // the flip chart on its easel: three legs, the pad, the sheets already turned over its top, the tray for the markers
  const leg=[150,110,70];for(const [x0,x1] of [[px+30,px-20],[px+pw-30,px+pw+20]])wc_part(ctx,[[x0-7,py+ph],[x0+7,py+ph],[x1+8,860],[x1-8,860]],leg,1,{lw:1.1});
  wc_part(ctx,[[px+pw/2-6,py+ph],[px+pw/2+6,py+ph],[px+pw/2+30,820],[px+pw/2+18,820]],wc_dim(leg,0.2),1,{lw:1});
  wc_part(ctx,wc_rect(px-10,py-20,pw+20,24),leg,1,{lw:1.2});ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(60,50,40,0.22)";ctx.fillRect(px+8,py+10,pw,ph);ctx.restore();
  wc_wash(ctx,wc_rect(px,py,pw,ph),[252,251,246],{kind:"page",lw:1.4,seed:241});for(let k=0;k<3;k++)wc_part(ctx,[[px+4,py-4-k*7],[px+pw-4,py-4-k*7],[px+pw-10,py+14-k*5],[px+10,py+14-k*5]],[244,242,234],1,{lw:1,seed:242+k});
  wc_part(ctx,wc_rect(px-12,py+ph,pw+24,18),leg,1,{lw:1.1});for(const [mx,c] of [[px+60,[40,60,150]],[px+110,[200,50,40]],[px+160,[40,40,48]]])wc_flat(ctx,wc_rect(mx,py+ph-8,40,10),c,1,"marker");
  // a poster of the city's coast on the wall, over the head of whoever stands at the chart
  wc_part(ctx,wc_rect(590,96,170,200),[90,70,60],1,{lw:1.2,seed:243});wc_flat(ctx,wc_rect(602,108,146,176),[244,200,140],1,"poster");wc_flat(ctx,wc_rect(602,222,146,62),[96,150,180],1,"sea");
  wc_wash(ctx,wc_ell(670,170,26,26,24),[250,140,80],{kind:"thing",line:false,flat:true,seed:244});sp_palm(ctx,720,286,140,-0.1,[90,70,60],245);}
// the table, over the people at it: its top and front, and on it cups, binders, a pot of coffee, and the card with the association's name
function sp_paintLa80Table(ctx){const L=SP_LA,[x0,x1,top]=L.table,col=[160,112,72],[cx,cy,cw,ch]=L.card;
  wc_part(ctx,wc_rect(x0+30,top+24,x1-x0+60,H-top),wc_dim(col,0.2),1,{seed:251});wc_part(ctx,wc_rect(x0-10,top,x1-x0+60,28),wc_lit(col,0.1),1,{seed:252});
  // the card: folded, standing, its face paper; the words are written every frame (sp_cardName)
  ctx.save();ctx.filter="blur(5px)";ctx.fillStyle="rgba(60,40,30,0.28)";ctx.fillRect(cx+10,cy+18,cw,ch-10);ctx.restore();wc_wash(ctx,wc_rect(cx,cy,cw,ch),[250,248,240],{kind:"page",lw:1.4,seed:253});
  wc_flat(ctx,wc_rect(cx+14,cy+12,cw-28,58),[40,70,130],1,"band");
  for(const [x,c] of [[1340,[248,248,244]],[1560,[248,248,244]],[1180,[200,90,60]]])sp_cup(ctx,x,top+12,c);
  gv_book(ctx,1260,top+14,120,[40,70,130]);gv_book(ctx,1268,top,108,[176,92,48]);gv_book(ctx,1480,top+14,118,[120,130,80]);gv_book(ctx,1690,top+14,112,[214,170,70]);
  wc_part(ctx,[[1800,top+12],[1860,top+12],[1868,top-76],[1852,top-92],[1808,top-92],[1792,top-76]],[214,226,232],1,{kind:"thing",lw:1.3,seed:254});
  wc_flat(ctx,[[1800,top+8],[1860,top+8],[1864,top-40],[1796,top-40]],[110,70,44],1,"coffee");wc_part(ctx,wc_rect(1800,top-104,60,16),[40,40,44],1,{lw:1});}
// a cup on a table whose top is at y: plastic foam, white (or a mug's colour), a little coffee showing
function sp_cup(ctx,x,y,c){wc_part(ctx,[[x-15,y],[x+15,y],[x+21,y-46],[x-21,y-46]],c,1,{kind:"thing",lw:1.2,seed:x|0});wc_flat(ctx,wc_ell(x,y-46,21,5,16),[120,80,54],1,"coffee");}
// a cup held in the right hand, in the figure's units
function sp_cupHeld(cx,P_,hands){const [hx,hy]=hands[1];cx.save();cx.translate(hx,hy+6);cx.fillStyle="#f6f4ee";cx.beginPath();cx.moveTo(-15,26);cx.lineTo(15,26);cx.lineTo(21,-30);cx.lineTo(-21,-30);cx.closePath();cx.fill();
  cx.strokeStyle="rgba(58,54,66,0.7)";cx.lineWidth=2;cx.stroke();cx.restore();fingers(cx,P_,[[hx-14,hy+6]]);}
// the card's words, the flip chart's title and what's written under it, in marker (each line's p reveals it)
function sp_cardName(ctx){const [cx,cy,cw]=SP_LA.card;wc_T(ctx,"DAMA",cx+cw/2,cy+58,{w:800,size:48,align:"center",col:[255,255,255]});
  wc_T(ctx,"Data Administration",cx+cw/2,cy+108,{w:600,size:28,align:"center",col:WC_DARK});wc_T(ctx,"Management Association",cx+cw/2,cy+142,{w:600,size:28,align:"center",col:WC_DARK});}
const SP_LEARNED=["one meaning for each word","who owns it?","write it down"];
function sp_chart(ctx,ps){const [px,py]=SP_LA.pad,blue=[40,60,150];wc_hand(ctx,"What we've learned",px+38,py+76,{size:40,col:[200,50,40],w:800});
  SP_LEARNED.forEach((s,i)=>{if(ps[i]>0){wc_hand(ctx,"·",px+22,py+170+i*96,{size:44,col:blue,w:800,a:clamp(ps[i]*4,0,1)});wc_hand(ctx,s,px+46,py+170+i*96,{size:30,col:blue,w:700,p:ps[i]});}});}
// a name badge on someone's chest: white, a red band at its top
function sp_badge(ctx,id,x,foot,s,flip){const k=s*PEOPLE[id].build.h,bx=x+(flip?24:-24)*k-17*k,by=foot-404*k;ctx.save();ctx.fillStyle="rgba(250,250,246,0.95)";ctx.fillRect(bx,by,34*k,24*k);
  ctx.fillStyle=rgba([200,50,40],0.95);ctx.fillRect(bx,by,34*k,7*k);ctx.strokeStyle="rgba(58,54,66,0.5)";ctx.lineWidth=1.2;ctx.strokeRect(bx,by,34*k,24*k);ctx.restore();}

/* ---------- 1980 on: the association's chapters, city after city ---------- */
// a corridor's cork board, where a flyer for each new chapter's meeting is pinned (sp_flyer, every frame)
function sp_paintNotice80(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),SP_WALL80,{kind:"plaster",line:false,seed:261});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,0,1100,[255,246,220],0.3);ctx.restore();gv_cork(ctx,150,70,1620,800,22);}
const SP_CITIES=[["San Francisco",[214,120,50]],["Portland",[60,130,140]],["Seattle",[120,96,170]],["Minneapolis",[176,140,40]],["New York",[190,70,60]],["Washington, D.C.",[70,120,80]]];
// a flyer: its paper and coloured band kept, then the association's name, the city, what it's for; pinned, landing as p goes 0 to 1
function sp_flyer(ctx,i,p){if(p<=0.01)return;const [city,col]=SP_CITIES[i],w=470,h=340,x=210+(i%3)*530,y=110+Math.floor(i/3)*390,rot=[-0.03,0.02,-0.015,0.025,-0.02,0.015][i],k=lerp(1.2,1,1-Math.pow(1-clamp(p,0,1),3));
  const c=wc_kept("flyer|"+i,w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(6px)";q.fillStyle="rgba(70,60,50,0.25)";q.fillRect(6,10,w,h);q.restore();wc_wash(q,wc_rect(0,0,w,h),[251,250,245],{kind:"page",lw:1.4,seed:271+i});
    wc_flat(q,wc_rect(14,14,w-28,72),col,1,"band");gv_lines(q,40,h-72,w-120,2,24,1);});
  ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.scale(k,k);withA(ctx,clamp(p*2.2,0,1),()=>{ctx.drawImage(c,-w/2-20,-h/2-20);
    wc_T(ctx,"DAMA",0,-h/2+64,{w:800,size:40,align:"center",col:[255,255,255]});wc_T(ctx,city,0,-h/2+164,{w:800,size:46,align:"center",col:WC_DARK});
    wc_T(ctx,"chapter meeting",0,-h/2+222,{w:600,size:32,align:"center",col:WC_MUTED});gv_pin(ctx,0,-h/2+8,[200,60,50],1.3);});ctx.restore();}

/* ---------- before: each organisation, alone ---------- */
// three office buildings at night, of brick, concrete and glass, each dark but for one window, where someone works late alone at a
// desk with a lamp and a binder (drawn every frame, sp_aloneWindow). SP_AL: each building [x, y, w, h, colour], its lit window, who's in it.
const SP_AL=[{b:[40,250,560,830],col:[110,64,56],win:[170,430,300,200],id:"spAdmin"},{b:[680,120,560,960],col:[96,98,108],win:[810,600,300,200],id:"spLa9"},
  {b:[1320,180,560,900],col:[60,68,96],win:[1460,330,300,200],id:"spLa6"}];
function sp_paintAlone70(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);sp_paintSky(ctx,0,0,W,H);ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,1100,1200,[150,100,120],0.4);ctx.restore();
  sp_paintTowers(ctx,sp_towers(301,-40,W+40,1090,300,640,90,170),1090,SP_NIGHT.far,0.04,302,0.9);
  SP_AL.forEach((a,i)=>{const [x,y,w,h]=a.b,[lx,ly,lw,lh]=a.win;wc_wash(ctx,wc_rect(x,y,w,h+40),a.col,{kind:"build",lw:1.4,seed:311+i});wc_flat(ctx,wc_rect(x-10,y-18,w+20,22),wc_dim(a.col,0.2),1,"roof");
    const cw=i===2?120:86,ch=i===2?150:110;for(let yy=y+50;yy<H-40;yy+=ch+46)for(let xx=x+34;xx<x+w-cw-10;xx+=cw+40){if(xx<lx+lw+10&&xx+cw>lx-10&&yy<ly+lh+10&&yy+ch>ly-10)continue;
      wc_flat(ctx,wc_rect(xx,yy,cw,ch),[36,40,62],1,"window");}
    wc_flat(ctx,wc_rect(lx,ly,lw,lh),[236,196,140],1,"lit");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+lw/2,ly+lh/2,260,[255,206,140],0.4);ctx.restore();
    wc_part(ctx,wc_rect(lx-10,ly+lh,lw+20,14),wc_lit(a.col,0.2),1,{lw:1.1});});}
// a lit window: inside, the person at a desk under a lamp, writing in a binder; the window's bars over them
function sp_aloneWindow(ctx,i,t,o){const a=SP_AL[i],[lx,ly,lw,lh]=a.win,top=ly+lh-46,s=0.42;ctx.save();ctx.beginPath();ctx.rect(lx,ly,lw,lh);ctx.clip();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+lw*0.78,top-30,120,[255,226,170],0.6);ctx.restore();
  person(ctx,a.id,lx+lw*0.3,top+GV_SIT*s,s,{t,pose:"write",expr:o&&o.expr||"calm"});
  const g=ctx.createLinearGradient(0,top,0,ly+lh);g.addColorStop(0,"rgb(150,104,70)");g.addColorStop(1,"rgb(110,74,50)");ctx.fillStyle=g;ctx.fillRect(lx,top,lw,lh);
  ctx.fillStyle="rgba(250,248,240,1)";ctx.beginPath();ctx.moveTo(lx+lw*0.3,top+4);ctx.lineTo(lx+lw*0.56,top+4);ctx.lineTo(lx+lw*0.54,top-6);ctx.lineTo(lx+lw*0.32,top-6);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([226,120,44],1);ctx.beginPath();ctx.moveTo(lx+lw*0.72,top-44);ctx.lineTo(lx+lw*0.84,top-44);ctx.lineTo(lx+lw*0.88,top-26);ctx.lineTo(lx+lw*0.68,top-26);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(60,54,50,1)";ctx.fillRect(lx+lw*0.78-2,top-26,4,26);ctx.restore();
  ctx.fillStyle=rgba(wc_dim(a.col,0.3),1);ctx.fillRect(lx+lw/2-5,ly,10,lh);ctx.fillRect(lx,ly+lh*0.22-4,lw,8);}

/* ---------- together: she copies a page ---------- */
// from above, on the meeting's table: the binder she borrowed, open at its typed entries, and her own, open at a page she fills to
// match (sp_scribble, every frame); a cup, a pencil. SP_CP: the lines she writes [x, y, length, heading?]
const SP_CP={lines:[[1124,320,150,1],[1124,376,300],[1124,424,264],[1124,520,170,1],[1124,576,300],[1124,624,240]]};
function sp_paintCopy80(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[166,118,78],{kind:"plaster",line:false,seed:341});
  ctx.save();ctx.strokeStyle=rgba([120,80,50],0.25);ctx.lineWidth=2;for(let y=10;y<H;y+=34){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+3*Math.sin(x/170+y*0.7));ctx.stroke();}ctx.restore();
  // an open binder: its shadow, its cover and spine, two pages, the rings; turned rot about its middle; fill(x, y, page width) types on it
  const open=(cx,cy,w,h,rot,col,seed,fill)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.save();ctx.filter="blur(12px)";ctx.fillStyle="rgba(50,30,20,0.32)";rr(ctx,-w/2+14,-h/2+20,w,h,20);ctx.fill();ctx.restore();
    wc_part(ctx,wc_rrPts(-w/2,-h/2,w,h,18),col,1,{kind:"cover",lw:1.5,seed});wc_flat(ctx,wc_rect(-20,-h/2+12,40,h-24),wc_dim(col,0.25),1,"spine");
    const pw=w/2-36;for(const px of [-w/2+16,20])wc_wash(ctx,wc_rect(px,-h/2+18,pw,h-36),[252,250,244],{kind:"page",lw:1.3,seed:seed+px});
    for(const ry of [-h*0.3,0,h*0.3]){wc_wash(ctx,wc_ell(0,ry,40,17,24),[206,210,216],{kind:"thing",lw:1.3,seed:seed+ry});wc_wash(ctx,wc_ell(0,ry,29,9,24),col,{kind:"thing",line:false,flat:true,seed:seed+ry+1});}
    fill(-w/2+16,-h/2+18,pw);ctx.restore();};
  const typed=(x,y,n)=>{for(let i=0;i<n;i++){const by=y+i*200;ctx.fillStyle=rgba([60,56,52],0.62);ctx.fillRect(x,by,96+((i*53)%50),10);gv_lines(ctx,x+20,by+48,290,3,48,1.1);}};
  open(560,540,860,720,-0.05,[40,70,130],342,(x,y,pw)=>{typed(x+34,y+80,3);typed(x+pw+74,y+80,3);});
  open(1480,546,800,700,0,[176,92,48],343,(x,y,pw)=>typed(x+pw+74,y+80,3));
  // a cup from above, a pencil
  wc_wash(ctx,wc_ell(1030,120,62,62,30),[246,244,238],{kind:"thing",lw:1.4,seed:344});wc_wash(ctx,wc_ell(1030,120,48,48,30),[110,72,48],{kind:"thing",line:false,flat:true,seed:345});
  wc_part(ctx,[[60,930],[250,990],[246,1002],[56,942]],[240,190,60],1,{lw:1.1,seed:346});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1700,200,1200,[255,220,160],0.28);ctx.restore();ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,1080,900,[150,140,160],0.4);ctx.restore();}

/* ---------- 2002: a boardroom, and the report they sign ---------- */
// The boardroom from across its table: walnut walls, and behind the two who sign, a glass wall onto the finance floor, where people work
// at partitioned desks and a shelf on the far wall holds the company's internal controls, its sign and glow drawn every frame
// (sp_controls). The two sit in high-backed chairs behind the table, a layer of its own (board02table). SP_B2: the table's top, the
// glass [x, y, w, h], its mullions, the seats [x, who], their scale, the shelf of binders [x, y, w, h].
const SP_B2={top:770,glass:[150,80,1620,640],mull:[690,1230],seats:[[760,"spCeo"],[1150,"spCfo"]],s:0.95,shelf:[790,300,340,150]};
function sp_paintBoard02(ctx){const K=SP_B2,[gx,gy,gw,gh]=K.glass,[sx,sy,sw,sh]=K.shelf;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[112,74,54],{kind:"plaster",line:false,seed:401});
  for(const [x,w] of [[14,118],[1788,118]])for(const [y,h] of [[90,300],[420,320]]){wc_part(ctx,wc_rect(x,y,w,h),[124,82,60],1,{lw:1.1,seed:x+y});wc_part(ctx,wc_rect(x+14,y+14,w-28,h-28),[106,68,50],1,{lw:1,seed:x+y+1});}
  // the finance floor through the glass: its ceiling and lights, the windows on its far side, the shelf of binders, the partitioned desks
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();wc_wash(ctx,wc_rect(gx-20,gy-20,gw+40,gh+40),[214,218,214],{kind:"plaster",line:false,seed:402});
  wc_flat(ctx,wc_rect(gx,gy,gw,112),[232,234,230],1,"ceiling");ctx.strokeStyle=rgba([180,184,186],0.6);ctx.lineWidth=2;
  for(let x=gx;x<gx+gw;x+=100){ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x,gy+112);ctx.stroke();}for(const y of [gy+40,gy+80]){ctx.beginPath();ctx.moveTo(gx,y);ctx.lineTo(gx+gw,y);ctx.stroke();}
  for(let x=gx+20;x<gx+gw;x+=300)wc_flat(ctx,wc_rect(x,gy+44,160,32),[252,252,246],1,"panel");
  for(let x=gx+30;x<gx+gw-120;x+=280){if(x+230>sx-20&&x<sx+sw+20)continue;wc_flat(ctx,wc_rect(x-8,gy+142,246,266),[206,208,210],1,"trim");
    const sky=ctx.createLinearGradient(0,gy+150,0,gy+400);sky.addColorStop(0,"rgb(168,194,220)");sky.addColorStop(1,"rgb(226,232,234)");ctx.fillStyle=sky;ctx.fillRect(x,gy+150,230,250);
    const R=wc_rng(x|0);for(let k=0;k<4;k++){const bx=x+2+k*56+R()*14,bw=34+R()*28,bh=70+R()*140;wc_flat(ctx,wc_rect(bx,gy+400-bh,bw,bh),[148+k*6,162+k*4,184],1,"tower");
      ctx.fillStyle="rgba(232,238,242,0.4)";for(let wy=gy+412-bh;wy<gy+392;wy+=14)ctx.fillRect(bx+6,wy,bw-12,4);}
    ctx.fillStyle="rgb(206,208,210)";ctx.fillRect(x+113,gy+150,5,250);}
  wc_part(ctx,wc_rect(sx-14,sy+sh,sw+28,14),[150,150,154],1,{lw:1.1});
  for(let i=0;i<12;i++)gv_binder(ctx,sx+8+i*27,sy+44,24,sh-44,[236,236,228]);
  const desks=[[290,"spFin1",1],[540,null],[1400,"spFin3",-1],[1640,"spFin2",-1]];
  desks.forEach(([x,id,d])=>{wc_part(ctx,[[x-70,546],[x+70,546],[x+64,476],[x-64,476]],[214,206,184],1,{kind:"thing",lw:1.2,seed:x|0});
    wc_flat(ctx,wc_rect(x-48,488,96,46),[60,96,110],1,"screen");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,510,90,[120,200,190],0.25);ctx.restore();
    if(id)gv_behind(ctx,id,x+118*d,566,0.36,{t:0,pose:"spType",flip:d>0});});
  wc_part(ctx,wc_rect(gx,560,gw,170),[150,158,172],1,{seed:403});wc_flat(ctx,wc_rect(gx,554,gw,12),[196,198,202],1,"trim");
  ctx.strokeStyle=rgba([120,126,140],0.6);ctx.lineWidth=3;for(let x=gx+220;x<gx+gw;x+=240){ctx.beginPath();ctx.moveTo(x,566);ctx.lineTo(x,gy+gh);ctx.stroke();}ctx.restore();
  // the glass: a cool tint, a frosted band, two streaks of light; its frame and mullions
  ctx.save();ctx.fillStyle="rgba(196,220,226,0.12)";ctx.fillRect(gx,gy,gw,gh);ctx.fillStyle="rgba(240,244,244,0.4)";ctx.fillRect(gx,612,gw,26);ctx.globalCompositeOperation="screen";
  for(const [x,w] of [[400,90],[520,30],[1420,120],[1580,40]]){ctx.fillStyle="rgba(255,255,255,0.12)";ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x+w,gy);ctx.lineTo(x+w-240,gy+gh);ctx.lineTo(x-240,gy+gh);ctx.closePath();ctx.fill();}ctx.restore();
  for(const r of [wc_rect(gx-14,gy-14,gw+28,14),wc_rect(gx-14,gy-14,14,gh+28),wc_rect(gx+gw,gy-14,14,gh+28),...K.mull.map(m=>wc_rect(m-5,gy,10,gh))])wc_part(ctx,r,[176,178,180],1,{lw:1.1});
  // the chairs' high backs, black leather, behind the seats
  K.seats.forEach(([x])=>{wc_part(ctx,wc_rrPts(x-88,K.top-326,176,360,46),[36,34,40],1,{kind:"thing",lw:1.4,seed:x|0});
    wc_flat(ctx,wc_rrPts(x-68,K.top-306,136,250,32),[50,48,56],1,"panel");ctx.save();ctx.strokeStyle="rgba(18,16,22,0.5)";ctx.lineWidth=2;
    for(const dx of [-34,0,34]){ctx.beginPath();ctx.moveTo(x+dx,K.top-298);ctx.lineTo(x+dx,K.top-64);ctx.stroke();}ctx.fillStyle="rgba(96,94,104,0.85)";
    for(const dx of [-34,0,34])for(const dy of [-268,-198,-128]){ctx.beginPath();ctx.arc(x+dx,K.top+dy,3.4,0,TAU);ctx.fill();}ctx.restore();
    ctx.save();ctx.strokeStyle="rgba(255,255,255,0.14)";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x-56,K.top-290);ctx.quadraticCurveTo(x-70,K.top-150,x-62,K.top-40);ctx.stroke();ctx.restore();});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,-80,1100,[255,226,180],0.16);ctx.restore();}
// the table, over the two at it: its polished top and front; the report in front of him, her leather folder, glasses, a carafe and the
// conference phone
function sp_paintBoard02Table(ctx){const top=SP_B2.top;wc_part(ctx,wc_rect(-20,top+26,W+40,H-top),[64,34,26],1,{seed:411});
  ctx.save();ctx.strokeStyle="rgba(30,14,10,0.22)";ctx.lineWidth=2;for(let y=top+44;y<H;y+=17){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+3*Math.sin(x/170+y*0.7));ctx.stroke();}
  ctx.strokeStyle="rgba(140,90,64,0.22)";ctx.lineWidth=3;for(const x of [60,980])ctx.strokeRect(x,top+70,880,H-top-40);ctx.restore();wc_part(ctx,wc_rect(-20,top,W+40,30),[112,62,46],1,{seed:412});
  ctx.save();ctx.fillStyle="rgba(255,230,200,0.3)";ctx.fillRect(-20,top+4,W+40,3);ctx.restore();
  wc_part(ctx,[[606,top+22],[914,top+22],[898,top+6],[622,top+6]],[40,60,110],1,{lw:1.1,seed:413});wc_part(ctx,[[612,top+16],[906,top+16],[894,top+2],[626,top+2]],[246,246,242],1,{lw:1.1,seed:414});
  wc_part(ctx,[[1020,top+22],[1290,top+22],[1276,top+6],[1034,top+6]],[74,42,30],1,{lw:1.1,seed:415});
  for(const x of [470,1420]){ctx.save();ctx.fillStyle="rgba(200,226,236,0.35)";ctx.fillRect(x-20,top-60,40,72);ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=2;ctx.strokeRect(x-20,top-60,40,72);
    ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(x-14,top-54,6,60);ctx.restore();}
  ctx.save();ctx.fillStyle="rgba(200,226,236,0.32)";ctx.beginPath();ctx.moveTo(1540,top+12);ctx.lineTo(1600,top+12);ctx.lineTo(1606,top-60);ctx.lineTo(1588,top-96);ctx.lineTo(1588,top-122);ctx.lineTo(1552,top-122);
  ctx.lineTo(1552,top-96);ctx.lineTo(1534,top-60);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=2;ctx.stroke();ctx.restore();
  wc_part(ctx,[[230,top+14],[390,top+14],[350,top-24],[270,top-24]],[58,60,66],1,{kind:"thing",lw:1.2,seed:416});wc_flat(ctx,wc_rect(296,top-14,28,8),[120,200,150],1,"display");}
// the binders lighting gold as u goes 0 to 1, and the shelf's sign with them
function sp_controls(ctx,u){const [sx,sy,sw,sh]=SP_B2.shelf;if(u>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,sx+sw/2,sy+sh*0.6,sw*0.95,[255,200,90],0.55*u);ctx.restore();
    ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.gold,0.45),0.75*u);ctx.fillRect(sx+6,sy+44,sw-12,sh-44);ctx.restore();}
  if(u>0.01){const a=clamp(u*3,0,1);ctx.save();ctx.globalAlpha=a;wc_flat(ctx,wc_rect(sx+14,sy-6,sw-28,42),[30,32,40],1,"plate");ctx.restore();
    wc_T(ctx,"internal controls",sx+sw/2,sy+26,{w:700,size:30,align:"center",a,col:[lerp(236,250,u),lerp(236,196,u),lerp(232,80,u)]});}}
// the report from above, open at its last page on the table: the dark polished wood and the lights in it, the cover and the pages under
// the last; its words, the signatures and the hands that write them are drawn every frame (sp_reportPage). SP_RP: the page, the two
// lines to sign, side by side [x, y, w]
const SP_RP={page:[580,50,800,980],lines:[[640,570,290],[1020,570,290]]};
function sp_paintReport02(ctx){const [px,py,pw,ph]=SP_RP.page;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[92,50,38],{kind:"plaster",line:false,seed:421});
  ctx.save();ctx.strokeStyle=rgba([58,28,18],0.3);ctx.lineWidth=2;for(let y=8;y<H;y+=26){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=90)ctx.lineTo(x,y+4*Math.sin(x/210+y*0.5));ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";for(const [x,y] of [[260,190],[1660,250],[1500,900]])wc_glowAt(ctx,x,y,200,[255,232,200],0.16);ctx.restore();
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(30,14,10,0.45)";ctx.fillRect(px-6,py+22,pw+40,ph+10);ctx.restore();
  wc_part(ctx,wc_rrPts(px-16,py+12,pw+34,ph+12,10),[40,60,110],1,{kind:"cover",lw:1.3,seed:422});
  [[-0.012,8,6],[0.008,4,3]].forEach(([r,dx,dy],i)=>{ctx.save();ctx.translate(px+pw/2+dx,py+ph/2+dy);ctx.rotate(r);wc_part(ctx,wc_rect(-pw/2,-ph/2,pw,ph),[240,240,236],1,{lw:1,seed:423+i});ctx.restore();});
  wc_wash(ctx,wc_rect(px,py,pw,ph),[252,252,248],{kind:"page",lw:1.3,seed:425});for(const k of [0,1]){ctx.save();ctx.translate(px+40+k*16,py+26);ctx.rotate(-0.7);ctx.fillStyle="rgba(150,150,156,0.9)";ctx.fillRect(-12,-2,24,4);ctx.restore();}
  gv_lines(ctx,px+60,py+880,pw-120,2,30,0.8);}
// a signature: one or two words, each a tall capital and smaller letters that loop, hump and dip below the line, leaning forward and
// trailing off, then a stroke back under the name or a tail rising away; seed makes it someone's. Built once (SP_SIG) as strokes, w
// wide, in units then scaled.
const SP_SIG={};
function sp_sigBuild(seed,w){const R=wc_rng(seed),under=seed%2===1,words=under?[2,3]:[4],raw=[];let X=0,cur=null;
  words.forEach((n,wi)=>{if(wi>0)X+=3.4;cur=[[X-1.6,1.4]];raw.push(cur);
    const cyc=[{c:1.0,k:1.9+R()*0.3,H:8.6+R()*1.2,dir:1}];
    for(let i=0;i<n;i++){const r=R(),f=1-0.22*i/Math.max(1,n-1);
      cyc.push(r<0.2?{c:0.72,k:1.5,H:5.2*f,dir:-1}:r<0.45?{c:0.68,k:1.55,H:(5.8+R())*f,dir:1}:r<0.75?{c:0.9,k:0.6+R()*0.2,H:(2.8+R()*0.5)*f,dir:1}:
        {c:0.7,k:1.3+R()*0.3,H:(2.6+R()*0.6)*f,dir:1});}
    cyc.forEach(q=>{for(let j=1;j<=26;j++){const t=TAU*j/26;cur.push([X+q.c*t+q.k*Math.sin(t),-q.dir*q.H*(1-Math.cos(t))/2]);}X+=q.c*TAU;});});
  const e=cur[cur.length-1],bz=under?[[e[0]+3,e[1]+2.2],[X*0.55,4.6],[-1.2,3.2]]:[[e[0]+2.4,e[1]],[e[0]+4.4,e[1]-2.6],[e[0]+6.2,e[1]-5.4]];
  for(let j=1;j<=30;j++){const u=j/30,v=1-u;cur.push([0,1].map(d=>v*v*v*e[d]+3*v*v*u*bz[0][d]+3*v*u*u*bz[1][d]+u*u*u*bz[2][d]));}
  const sl=raw.map(s=>s.map(([px,py])=>[px-py*0.34,py-px*(under?0.03:-0.02)])),xs=sl.flat().map(q=>q[0]),x0=Math.min(...xs),a=w/(Math.max(...xs)-x0);
  return sl.map(s=>s.map(([px,py])=>[(px-x0)*a,py*a]));}
// a signature written from x on its baseline y as p goes 0 to 1, the pen lifting between words; the ink shines wet until dry reaches 1.
// Returns where the pen is.
function sp_signature(ctx,x,y,w,p,seed,dry){const key=seed+"|"+w,S=SP_SIG[key]||(SP_SIG[key]=sp_sigBuild(seed,w)),pts=[];dry=clamp(dry||0,0,1);let L=0;
  S.forEach(s=>s.forEach((q,j)=>{if(pts.length){const r=pts[pts.length-1];L+=Math.hypot(q[0]-r[0],q[1]-r[1]);}pts.push([q[0],q[1],L,j===0]);}));
  const goal=clamp(p,0,1)*L,at=i=>{const r=pts[i-1],q=pts[i],u=(goal-r[2])/Math.max(1e-6,q[2]-r[2]);return [lerp(r[0],q[0],u),lerp(r[1],q[1],u)];};
  let pen=pts[0];for(let i=1;i<pts.length;i++){pen=pts[i];if(pts[i][2]>=goal){pen=at(i);break;}}
  if(goal>0){ctx.save();ctx.translate(x,y);ctx.lineJoin=ctx.lineCap="round";
    const path=()=>{ctx.beginPath();for(let i=0;i<pts.length;i++){const q=pts[i];if(q[2]>goal){if(!q[3]){const m=at(i);ctx.lineTo(m[0],m[1]);}break;}
      if(q[3])ctx.moveTo(q[0],q[1]);else ctx.lineTo(q[0],q[1]);}};
    path();ctx.strokeStyle=rgba([lerp(18,40,dry),lerp(24,46,dry),lerp(86,98,dry)],0.95);ctx.lineWidth=4;ctx.stroke();
    if(dry<1){ctx.translate(-1.2,-1.4);path();ctx.strokeStyle="rgba(255,255,255,"+(0.5*(1-dry)).toFixed(3)+")";ctx.lineWidth=1.3;ctx.stroke();}ctx.restore();}
  return [x+pen[0],y+pen[1]];}
// the page's words, the two lines to sign and their titles; each signature as its time comes (sg: [[who, start, seconds], ...]), the hand
// that writes it coming in from the bottom right and going; o.dry: the ink drying, 0 to 1; o.gold: each line ruled in gold, 0 to 1
function sp_reportPage(ctx,tt,sg,o){o=o||{};const [px,py,pw]=SP_RP.page,hands=[];wc_T(ctx,"Quarterly report",px+60,py+70,{w:600,size:30,col:WC_MUTED});
  wc_T(ctx,"We certify",px+60,py+150,{w:700,size:56,f:"serif",col:WC_DARK});wc_T(ctx,"that this report fairly presents",px+60,py+206,{w:500,size:34,f:"serif",col:WC_DARK});
  wc_T(ctx,"the company's financial condition.",px+60,py+248,{w:500,size:34,f:"serif",col:WC_DARK});gv_lines(ctx,px+60,py+304,pw-120,2,28,1);
  SP_RP.lines.forEach(([lx,ly,lw],i)=>{ctx.fillStyle=rgba(WC_DARK,0.75);ctx.fillRect(lx,ly,lw,3);const g=o.gold?o.gold[i]:0;if(g>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(lx,ly-2,lw*easeCam(g),7);}
    wc_T(ctx,["Chief Executive Officer","Chief Financial Officer"][i],lx,ly+42,{w:600,size:28,col:WC_DARK});
    const [who,t0,d]=sg[i],pt=sp_signature(ctx,lx+10,ly-16,lw-30,(tt-t0)/d,501+i,o.dry);
    const inn=fin(tt,t0-0.45,0.45),out=fin(tt,t0+d,0.4);if(inn>0&&out<1){const k=1-easeCam(inn)+easeCam(out);hands.push([pt[0]+520*k,pt[1]+640*k,who]);}});
  hands.forEach(([x,y,who])=>sp_penHand(ctx,x,y,1.3,who));}

/* ---------- 2009: the body of knowledge, on its shelf and open at its wheel ---------- */
// A bookcase from the front, at eye level: on its middle shelf, the binders of what the members had learned, then room for the book
// and the editions after it, drawn every frame (sp_book). SP_SH: where things stand, the bookcase's sides, where each edition stands
// (its middle), a book's size. SP_BINDERS: [x, w, h, colour, lean]; the first three are the 1980s' binders.
const SP_SH={top:766,sides:[150,1770],books:[1160,1510],w:320,h:440};
const SP_BINDERS=[[236,70,352,[40,70,130]],[312,64,340,[120,130,80]],[382,74,360,[210,128,64]],[462,62,334,[150,62,66]],[530,70,348,[92,112,124]],
  [606,66,356,[204,170,92]],[678,72,342,[70,112,92]],[756,64,330,[226,222,208],-0.14]];
function sp_paintShelf(ctx,o){o=o||{};const K=SP_SH,[l,r]=K.sides;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[206,192,170],{kind:"plaster",line:false,seed:431});
  // the back panel, its grain, shadowed under each shelf
  wc_part(ctx,wc_rect(l+20,-20,r-l-40,H+40),[128,90,64],1,{lw:1,seed:432});
  ctx.save();ctx.strokeStyle="rgba(70,42,26,0.16)";ctx.lineWidth=2;for(let x=l+40;x<r-30;x+=46){ctx.beginPath();ctx.moveTo(x,-10);for(let y=0;y<=H+20;y+=90)ctx.lineTo(x+3*Math.sin(y/130+x),y);ctx.stroke();}ctx.restore();
  for(const [y0,y1,a] of [[136,340,0.5],[806,H,0.55]]){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,"rgba(36,20,12,"+a+")");g.addColorStop(1,"rgba(36,20,12,0)");ctx.fillStyle=g;ctx.fillRect(l+20,y0,r-l-40,y1-y0);}
  // the shelf above, seen from under it: the bottoms of its books behind its edge
  const R=wc_rng(433),cols=[[118,62,58],[62,86,112],[152,132,98],[82,102,82],[178,162,132],[96,70,96]];
  for(let x=l+44;x<r-70;){const w=30+R()*40,h=40+R()*70;wc_part(ctx,wc_rect(x,30-h,w,h+90),cols[Math.floor(R()*cols.length)],0.8,{lw:1.1,seed:x|0});x+=w+2+R()*6;}
  wc_part(ctx,wc_rect(l,96,r-l,40),[146,100,68],1,{lw:1.1,seed:435});ctx.fillStyle="rgba(255,236,206,0.3)";ctx.fillRect(l,98,r-l,3);
  // the middle shelf: its top, the binders, a few flyers lying flat, a bookend; then its edge
  wc_part(ctx,wc_rect(l,K.top-14,r-l,20),[184,136,96],1,{lw:1,seed:438});
  SP_BINDERS.slice(0,o.binders==null?SP_BINDERS.length:o.binders).forEach(([x,w,h,col,lean])=>{if(lean){ctx.save();ctx.translate(x+w,K.top);ctx.rotate(lean);gv_binder(ctx,-w,-h,w,h,col);ctx.restore();}else gv_binder(ctx,x,K.top-h,w,h,col);});
  if(o.flyers!==false)for(let i=0;i<4;i++)wc_flat(ctx,wc_rect(832+i*5,K.top-6-i*6,150,6),[242-i*4,236-i*4,222],1,"paper");
  if(o.bookend!==false){wc_part(ctx,wc_rect(1686,K.top-170,14,170),[150,156,168],1,{kind:"thing",lw:1.1,seed:436});wc_part(ctx,wc_rect(1640,K.top-8,60,8),[150,156,168],1,{kind:"thing",lw:1,seed:437});}
  wc_part(ctx,wc_rect(l,K.top+4,r-l,36),[146,100,68],1,{lw:1.1,seed:439});ctx.fillStyle="rgba(255,236,206,0.35)";ctx.fillRect(l,K.top+5,r-l,3);
  // the bookcase's sides, and the light
  for(const x of [l-20,r-20])wc_part(ctx,wc_rect(x,-20,40,H+40),[160,114,78],1,{lw:1.2,seed:440+x});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1500,180,1000,[255,228,186],0.2);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,H,1000,[150,130,120],0.35);ctx.restore();}
// a book of the body of knowledge, standing face out, its bottom's middle at (x, y): the first edition (2009), the second (2017), the
// revision (2024, its edition on two lines); its cover kept, its words drawn every frame. o.k scales it about its bottom.
const SP_ED={1:{col:[44,92,108]},2:{col:[124,48,54],sub:"Second Edition"}};
function sp_bookCover(ed){const K=SP_SH,w=K.w,h=K.h,E=SP_ED[ed];return wc_kept("spBook"+ed,w+80,h+80,q=>{q.translate(40,40);
  q.save();q.filter="blur(12px)";q.fillStyle="rgba(40,22,12,0.45)";q.fillRect(-18,16,w,h);q.restore();
  wc_flat(q,wc_rect(8,-8,w,h),[236,228,206],1,"pages");q.strokeStyle="rgba(150,136,112,0.5)";q.lineWidth=1.2;
  for(let i=1;i<4;i++){q.beginPath();q.moveTo(10,-8+i*2);q.lineTo(w+6,-8+i*2);q.stroke();q.beginPath();q.moveTo(w+8-i*2,-6);q.lineTo(w+8-i*2,h-10);q.stroke();}
  wc_wash(q,wc_rrPts(0,0,w,h,8),E.col,{kind:"cover",lw:1.5,seed:440+ed});wc_flat(q,wc_rect(0,4,22,h-8),wc_dim(E.col,0.25),1,"spine");
  for(const ry of [86,318])wc_flat(q,wc_rect(48,ry,w-80,4),[226,214,180],0.9,"rule");});}
function sp_book(ctx,x,y,ed,o){o=o||{};const K=SP_SH,w=K.w,h=K.h,E=SP_ED[ed],k=o.k||1,cx=11,deco=!!o.deco;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.drawImage(sp_bookCover(ed),-w/2-40,-h-40);
  wc_T(ctx,"DAMA-DMBOK",cx,-h+160,{w:800,size:40,align:"center",col:[246,238,214],deco});
  wc_T(ctx,"Data Management",cx,-h+226,{w:600,size:28,align:"center",col:[226,232,226],deco});wc_T(ctx,"Body of Knowledge",cx,-h+266,{w:600,size:28,align:"center",col:[226,232,226],deco});
  if(E.sub)wc_T(ctx,E.sub,cx,-h+(E.sub2?364:380),{w:600,size:28,align:"center",col:[236,226,200],deco});if(E.sub2)wc_T(ctx,E.sub2,cx,-h+402,{w:600,size:28,align:"center",col:[236,226,200],deco});ctx.restore();}
// a hand holding a book by its side at (x, y): the thumb on the cover, the side of the hand round the edge (the index finger curling
// behind it, the base of the thumb, the wrist), a ribbed cuff, the arm going down out of the frame; side -1 holds the left edge, 1 the
// right; s scales it
const SP_HOLD={skin:[214,170,136],sleeve:[92,108,138]};
function sp_holdHand(ctx,x,y,side,s){const {skin,sleeve}=SP_HOLD,crease=rgba(darken(skin,0.35),0.45);ctx.save();ctx.translate(x,y);ctx.scale(side*s,s);
  ctx.beginPath();ctx.moveTo(-10,150);ctx.lineTo(98,156);ctx.lineTo(214,1000);ctx.lineTo(14,1010);ctx.closePath();litFill(ctx,sleeve,214,150,-10,1010);seam(ctx,sleeve,0.3,1.2);
  ctx.beginPath();ctx.moveTo(0,-98);ctx.bezierCurveTo(16,-114,44,-112,56,-90);ctx.bezierCurveTo(64,-76,66,-58,62,-42);ctx.bezierCurveTo(72,-6,72,38,64,78);
  ctx.bezierCurveTo(60,104,56,126,54,150);ctx.lineTo(0,150);ctx.closePath();litFill(ctx,skin,70,-110,0,150);seam(ctx,skin,0.35,1.4);
  ctx.save();ctx.strokeStyle=crease;ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(2,-50);ctx.quadraticCurveTo(30,-56,60,-44);ctx.stroke();
  ctx.beginPath();ctx.arc(46,-88,9,-0.2,1.6);ctx.stroke();ctx.beginPath();ctx.arc(58,-30,8,-0.6,1.2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(4,22);ctx.quadraticCurveTo(30,30,46,56);ctx.stroke();ctx.restore();
  ctx.beginPath();ctx.moveTo(-12,138);ctx.lineTo(102,144);ctx.lineTo(104,178);ctx.lineTo(-12,174);ctx.closePath();litFill(ctx,darken(sleeve,0.08),104,138,-12,178);seam(ctx,sleeve,0.3,1.2);
  ctx.save();ctx.strokeStyle=rgba(darken(sleeve,0.3),0.35);ctx.lineWidth=2;for(let i=0;i<10;i++){const u=i/9,bx=lerp(-6,98,u);ctx.beginPath();ctx.moveTo(bx,140+u*6);ctx.lineTo(bx+1,174+u*4);ctx.stroke();}ctx.restore();
  const thumb=()=>{ctx.beginPath();ctx.moveTo(8,40);ctx.bezierCurveTo(-16,30,-40,6,-58,-20);ctx.bezierCurveTo(-68,-34,-76,-46,-68,-56);ctx.bezierCurveTo(-60,-64,-48,-58,-40,-48);
    ctx.bezierCurveTo(-26,-32,-8,-20,8,-12);ctx.closePath();};
  ctx.save();ctx.translate(5,7);thumb();ctx.fillStyle="rgba(20,16,12,0.18)";ctx.fill();ctx.restore();thumb();litFill(ctx,skin,-70,-60,10,40);seam(ctx,skin,0.35,1.4);
  ctx.save();ctx.translate(-58,-46);ctx.rotate(-0.85);ell(ctx,0,0,13,8.5);ctx.fillStyle=rgba(lighten(skin,0.3),0.95);ctx.fill();ctx.strokeStyle=rgba(darken(skin,0.3),0.4);ctx.lineWidth=1.2;ctx.stroke();ctx.restore();
  ctx.save();ctx.strokeStyle=crease;ctx.lineWidth=2;ctx.beginPath();ctx.arc(-32,-22,7,0.4,2.0);ctx.stroke();ctx.restore();ctx.restore();}
// the book open at its wheel, close: the paper filling the frame, the fold into the spine on the left, the next pages' edges on the right
function sp_paintWheelPage(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[250,247,238],{kind:"paper",line:false,seed:451});
  const g=ctx.createLinearGradient(0,0,170,0);g.addColorStop(0,"rgba(90,70,50,0.34)");g.addColorStop(0.45,"rgba(90,70,50,0.1)");g.addColorStop(1,"rgba(90,70,50,0)");ctx.fillStyle=g;ctx.fillRect(0,0,170,H);
  ctx.save();ctx.strokeStyle="rgba(150,136,112,0.35)";ctx.lineWidth=1.5;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(W-14+i*2.6,0);ctx.lineTo(W-14+i*2.6,H);ctx.stroke();}ctx.restore();}
// the wheel, painted our own way: ten areas of data management round the centre, data governance; each area's name outside it
const SP_WH={x:960,y:448,r0:122,r1:290,rl:342},SP_WHC=[[188,202,230],[204,196,230]];
const SP_AREAS=[["data","architecture"],["data modelling","& design"],["data storage","& operations"],["data security"],["data integration","& interoperability"],
  ["documents","& content"],["reference","& master data"],["data warehousing","& BI"],["metadata"],["data quality"]];
const sp_whAng=k=>-Math.PI/2+k*TAU/10;
// where each area sits before the centre holds them: out or in, along the rim, larger or smaller ([dr, da, scale])
const SP_UNEVEN=SP_AREAS.map((_,k)=>{const R=wc_rng(460+k);return[(R()-0.5)*44,(R()-0.5)*0.16,0.94+R()*0.1];});
function sp_wedgePts(k,cx,cy){const R=SP_WH,a0=sp_whAng(k)-TAU/20+0.014,a1=sp_whAng(k)+TAU/20-0.014,p=[];
  for(let i=0;i<=12;i++){const a=lerp(a0,a1,i/12);p.push([cx+Math.cos(a)*R.r1,cy+Math.sin(a)*R.r1]);}for(let i=12;i>=0;i--){const a=lerp(a0,a1,i/12);p.push([cx+Math.cos(a)*(R.r0+8),cy+Math.sin(a)*(R.r0+8)]);}return p;}
function sp_wedgeC(k){const s=SP_WH.r1+30;return wc_kept("spWedge"+k,2*s,2*s,q=>wc_wash(q,sp_wedgePts(k,s,s),SP_WHC[k%2],{kind:"thing",lw:1.4,seed:470+k}));}
// o: area(k) brings each area in (0 to 1); off, how far from true they sit (1 uneven, 0 true); turn, the wheel's turn (radians);
// centre lights data governance, pulse brightens it; spokes runs gold from it out to each area (spokeA, their strength); rim draws the
// wheel's edge; labels shows the names; ring goes round the whole wheel; dim pales the areas but those keep(k) holds lit; outlines,
// [[area or "centre", 0 to 1], ...]
function sp_wheel(ctx,o){const R=SP_WH,s=R.r1+30,lab=o.labels==null?1:o.labels,off=o.off||0,turn=o.turn||0,dim=o.dim||0,where=[];
  SP_AREAS.forEach((lines,k)=>{const u=o.area(k);if(u<=0)return;const [dr,da,ds]=SP_UNEVEN[k],an=sp_whAng(k),a2=an+turn+da*off,rr_=dr*off,
      sp=(0.6+0.4*spring(u))*lerp(1,ds,off),a=clamp(u*2.5,0,1)*(1-dim*0.55*(1-(o.keep?o.keep(k):0)));
    ctx.save();ctx.translate(R.x+Math.cos(an)*rr_,R.y+Math.sin(an)*rr_);ctx.rotate(turn+da*off);ctx.scale(sp,sp);withA(ctx,a,()=>ctx.drawImage(sp_wedgeC(k),-s,-s));ctx.restore();
    where[k]=[a2,rr_,sp];
    const c=Math.cos(an),sn=Math.sin(an),lr=R.rl+rr_*0.5,lx=R.x+Math.cos(a2)*lr,ly=R.y+Math.sin(a2)*lr,al=Math.abs(c)<0.3?"center":c>0?"left":"right",n=lines.length,
      y0=al!=="center"?ly-(n-1)*18+10:sn<0?ly-(n-1)*38-6:ly+32;
    if(lab>0.01)withA(ctx,clamp(u*2,0,1)*lab,()=>lines.forEach((l,i)=>wc_T(ctx,l,lx,y0+i*38,{w:i?600:700,size:30,align:al,col:WC_INK})));});
  if(o.spokes>0){ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(GV.gold,0.9*(o.spokeA==null?1:o.spokeA));ctx.lineWidth=7;
    where.forEach(([a2,rr_,sp],k)=>{const e=easeCam(clamp(o.spokes*1.6-k*0.06,0,1));if(e<=0)return;const r0=R.r0*0.9,r1=lerp(r0,(R.r1-20)*sp+rr_,e);
      ctx.beginPath();ctx.moveTo(R.x+Math.cos(a2)*r0,R.y+Math.sin(a2)*r0);ctx.lineTo(R.x+Math.cos(a2)*r1,R.y+Math.sin(a2)*r1);ctx.stroke();});ctx.restore();}
  if(o.rim>0){ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.7);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.arc(R.x,R.y,R.r1+10,-Math.PI/2,-Math.PI/2+TAU*easeCam(clamp(o.rim,0,1)));ctx.stroke();ctx.restore();}
  if(o.centre>0){const k=0.7+0.3*spring(o.centre),p=o.pulse||0;ctx.save();ctx.translate(R.x,R.y);ctx.scale(k,k);withA(ctx,clamp(o.centre*2,0,1),()=>{wc_glowAt(ctx,0,0,R.r0*(1.6+0.5*p),[255,226,140],0.45+0.3*p);
    ctx.drawImage(wc_kept("spWhCentre",2*R.r0+40,2*R.r0+40,q=>wc_wash(q,wc_ell(R.r0+20,R.r0+20,R.r0-2,R.r0-2,40),wc_lit(GV.gold,0.2),{kind:"thing",lw:1.6,seed:474})),-R.r0-20,-R.r0-20);
    wc_T(ctx,"data",0,-6,{w:800,size:34,align:"center",col:GV.goldInk});wc_T(ctx,"governance",0,36,{w:800,size:34,align:"center",col:GV.goldInk});});ctx.restore();}
  if(o.ring>0){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=6;ctx.setLineDash([18,12]);ctx.lineCap="round";ctx.beginPath();
    ctx.arc(R.x,R.y,R.r1+22,-Math.PI/2,-Math.PI/2+TAU*easeCam(clamp(o.ring,0,1)));ctx.stroke();ctx.restore();}
  (o.outlines||[]).forEach(([hi,u])=>{if(u<=0)return;ctx.save();ctx.globalAlpha*=clamp(u,0,1);ctx.strokeStyle=rgba(WC_DARK,0.85);ctx.lineWidth=5;ctx.lineJoin="round";ctx.beginPath();
    if(hi==="centre")ctx.arc(R.x,R.y,R.r0+4,0,TAU);else sp_wedgePts(hi,R.x,R.y).forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();ctx.stroke();ctx.restore();});}
// the wheel's two rings sketched in pencil before its areas come in, u 0 to 1: the outer ring, then the inner one round the empty centre
function sp_wheelGuide(ctx,u){if(u<=0)return;const R=SP_WH,ring=(r,p,seed)=>{if(p<=0)return;const pts=[];for(let i=0;i<=90;i++){const a=-Math.PI/2+TAU*i/90;
    pts.push([R.x+Math.cos(a)*r,R.y+Math.sin(a)*r]);}wc_pencil(ctx,pts,p,{lw:2.8,a:0.55,seed});};ring(R.r1+10,clamp(u*1.4,0,1),471);ring(R.r0+4,clamp(u*1.4-0.4,0,1),472);}
// the book closing on its wheel: the cover swings over from the spine at the left (u, 0 to 1), darker while it stands up, its title on
// it once it lies flat
function sp_coverClose(ctx,u,ed){ed=ed||1;if(u<=0)return;const f=Math.sin(Math.PI/2*easeCam(clamp(u,0,1))),x0=40,w=2100;if(f<0.01)return;
  const C=wc_kept("spCoverBig"+(ed>1?ed:""),w,H+240,q=>{const col=SP_ED[ed].col,R=wc_rng(481);q.fillStyle=rgba(col,1);q.fillRect(0,0,w,H+240);
    for(let i=0;i<90;i++){const d=R()<0.5;wc_glowAt(q,R()*w,R()*(H+240),80+R()*220,d?wc_dim(col,0.3):lighten(col,0.18),0.08+R()*0.08);}
    q.fillStyle=rgba(wc_dim(col,0.25),1);q.fillRect(0,0,110,H+240);for(const ry of [280,1000])wc_flat(q,wc_rect(330,ry,1300,8),[226,214,180],0.9,"rule");});
  ctx.save();const g=ctx.createLinearGradient(x0+f*w,0,x0+f*w+260,0);g.addColorStop(0,"rgba(40,26,14,"+(0.3*(1-f)).toFixed(3)+")");g.addColorStop(1,"rgba(40,26,14,0)");
  ctx.fillStyle=g;ctx.fillRect(x0+f*w,-120,260,H+240);ctx.translate(x0,-120);ctx.scale(f,1);ctx.drawImage(C,0,0);ctx.fillStyle="rgba(20,14,10,"+(0.45*(1-f)).toFixed(3)+")";ctx.fillRect(0,0,w,H+240);ctx.restore();
  const a=clamp((f-0.86)/0.14,0,1),E=SP_ED[ed],up=E.sub?50:0;if(a>0)withA(ctx,a,()=>{wc_T(ctx,"DAMA-DMBOK",1000,470-up,{w:800,size:120,align:"center",col:[246,238,214]});
    wc_T(ctx,"Data Management",1000,640-up,{w:600,size:64,align:"center",col:[226,232,226]});wc_T(ctx,"Body of Knowledge",1000,730-up,{w:600,size:64,align:"center",col:[226,232,226]});
    if(E.sub)wc_T(ctx,E.sub+(E.sub2?" · "+E.sub2:""),1000,826,{w:600,size:48,align:"center",col:[236,226,200]});});}

/* ---------- Basel, 2013 and 2023: the regulators' room, the principles, and the progress report ten years on ---------- */
// The meeting room from across its table, high over the old town: three tall windows; four regulators at the table (gv_behind at
// SP_BS.top, at scale s), the table a layer of its own (basel13table). SP_BS: the table's top, the windows, who sits where, the minster's x.
const SP_BS={top:800,wins:[[140,64,500,628],[710,64,500,628],[1280,64,500,628]],seats:[[400,"spBs1"],[760,"spBs2"],[1160,"spBs3"],[1520,"spBs4"]],s:1.02,minster:960};
// the view from a high window: the sky, the hills and the far bank, the river, the minster on its hill, the old town's roofs below
function sp_baselView(ctx,x0,y0,x1,y1){const R=wc_rng(611),mx=SP_BS.minster;
  const sky=ctx.createLinearGradient(0,y0,0,330);sky.addColorStop(0,"rgb(150,186,220)");sky.addColorStop(1,"rgb(230,236,236)");ctx.fillStyle=sky;ctx.fillRect(x0,y0,x1-x0,y1-y0);
  ctx.save();ctx.globalCompositeOperation="screen";for(const [cx,cy,r] of [[300,150,120],[420,130,90],[900,110,140],[1040,140,100],[1500,170,130],[1630,150,90]])wc_glowAt(ctx,cx,cy,r,[255,255,255],0.5);ctx.restore();
  // the far hills, the far bank's houses
  wc_wash(ctx,[[x0-20,300],[x0+200,262],[520,250],[820,272],[1120,246],[1420,268],[1700,252],[x1+20,270],[x1+20,320],[x0-20,320]],[124,150,150],{depth:0.45,kind:"land",line:false,seed:612});
  for(let x=x0-20;x<x1;){const w=14+R()*26,h=8+R()*16;wc_flat(ctx,wc_rect(x,324-h,w,h+6),[[206,188,170],[196,180,170],[218,204,186],[180,150,140]][Math.floor(R()*4)],0.42,"build");x+=w*(0.7+R()*0.5);}
  wc_flat(ctx,wc_rect(x0,318,x1-x0,12),[200,186,170],0.4,"bank");
  // the river, and a bridge across it
  wc_flat(ctx,wc_rect(x0,328,x1-x0,52),[118,152,166],0.8,"water");ctx.save();ctx.strokeStyle="rgba(240,246,248,0.5)";ctx.lineWidth=2;
  for(let i=0;i<34;i++){const x=x0+R()*(x1-x0),y=334+R()*42,l=20+R()*50;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+l,y);ctx.stroke();}ctx.restore();
  wc_flat(ctx,[[430,382],[470,382],[566,326],[540,326]],[206,190,170],0.8,"bridge");ctx.save();ctx.fillStyle="rgba(70,80,90,0.45)";for(let k=0;k<4;k++){const u=0.15+k*0.22,bx=lerp(450,553,u),by=lerp(382,326,u);ctx.beginPath();ctx.ellipse(bx+8,by+2,7,4,0,Math.PI,TAU);ctx.fill();}ctx.restore();
  // the minster on its hill over the river, red sandstone among trees: the nave under its patterned roof, the choir's apse, and the two
  // west towers, each with a gallery, corner pinnacles and an open spire, one face lit and one in shade
  wc_wash(ctx,[[mx-330,430],[mx-300,382],[mx-150,366],[mx+230,364],[mx+380,378],[mx+420,430]],[132,146,98],{kind:"land",line:false,seed:613,depth:0.85});
  const red=[198,120,102],shade=[160,92,80],nv=[mx-40,mx+200],ridge=244,eave=300;
  wc_part(ctx,wc_rect(nv[0],eave,nv[1]-nv[0],78),red,1,{lw:1.1,seed:614});
  ctx.save();ctx.fillStyle=rgba(shade,0.5);for(let k=0;k<7;k++)ctx.fillRect(nv[0]+12+k*33,eave+4,6,74);ctx.fillStyle="rgba(70,40,40,0.5)";
  for(let k=0;k<6;k++){const wx=nv[0]+26+k*33;ctx.beginPath();ctx.moveTo(wx,eave+56);ctx.lineTo(wx,eave+26);ctx.quadraticCurveTo(wx+5,eave+16,wx+10,eave+26);ctx.lineTo(wx+10,eave+56);ctx.closePath();ctx.fill();}ctx.restore();
  const roof=[[nv[0]-6,eave+2],[nv[0]+28,ridge],[nv[1]-18,ridge],[nv[1]+8,eave+2]];wc_part(ctx,roof,[150,138,98],1,{lw:1,seed:618});
  ctx.save();wc_tr(ctx,roof);ctx.clip();const tc=[[96,124,84],[204,172,92],[158,86,64],[72,72,70]];
  for(let r=0;r<10;r++)for(let c=0;c<40;c++){const x=nv[0]-6+c*7+(r%2)*3.5,y=ridge+2+r*6;ctx.fillStyle=rgba(tc[(r+2*c)%4],0.42);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+3.5,y+3);ctx.lineTo(x,y+6);ctx.lineTo(x-3.5,y+3);ctx.closePath();ctx.fill();}ctx.restore();
  wc_part(ctx,[[nv[1]+4,eave+78],[nv[1]+4,eave+8],[nv[1]+30,eave],[nv[1]+52,eave+12],[nv[1]+58,eave+78]],shade,1,{lw:1,seed:615});
  wc_part(ctx,[[nv[1]+2,eave+10],[nv[1]+30,eave-26],[nv[1]+56,eave+12]],[146,132,94],1,{lw:1,seed:619});
  for(const [tx,tw2] of [[mx-138,46],[mx-86,46]]){const top=176,cx2=tx+tw2/2;wc_part(ctx,wc_rect(tx,top,tw2,eave+78-top),red,1,{lw:1.1,seed:tx|0});
    ctx.save();ctx.fillStyle=rgba(shade,0.55);ctx.fillRect(tx+tw2-10,top,10,eave+78-top);ctx.fillRect(tx,top,4,eave+78-top);ctx.strokeStyle=rgba(shade,0.8);ctx.lineWidth=1.4;
    for(const yy of [226,268,314,352]){ctx.beginPath();ctx.moveTo(tx,yy);ctx.lineTo(tx+tw2,yy);ctx.stroke();}ctx.fillStyle="rgba(70,40,40,0.55)";
    for(const [yy,hh] of [[188,30],[236,26],[278,30],[322,24]]){ctx.beginPath();ctx.moveTo(cx2-5,yy+hh);ctx.lineTo(cx2-5,yy+6);ctx.quadraticCurveTo(cx2,yy-2,cx2+5,yy+6);ctx.lineTo(cx2+5,yy+hh);ctx.closePath();ctx.fill();}ctx.restore();
    wc_flat(ctx,wc_rect(tx-4,top-10,tw2+8,12),wc_lit(red,0.12),1,"gallery");ctx.save();ctx.strokeStyle=rgba(shade,0.7);ctx.lineWidth=1.2;for(let k=0;k<=8;k++){const bx=tx-2+k*(tw2+4)/8;ctx.beginPath();ctx.moveTo(bx,top-10);ctx.lineTo(bx,top);ctx.stroke();}ctx.restore();
    for(const px of [tx-3,tx+tw2-3])wc_flat(ctx,[[px,top-10],[px+6,top-10],[px+3,top-30]],shade,1,"pinnacle");
    const sp0=top-10,sp1=58;ctx.save();ctx.beginPath();ctx.moveTo(tx+5,sp0);ctx.lineTo(cx2,sp1);ctx.lineTo(cx2,sp0);ctx.closePath();ctx.fillStyle=rgba(wc_lit(red,0.08),0.95);ctx.fill();
    ctx.beginPath();ctx.moveTo(cx2,sp0);ctx.lineTo(cx2,sp1);ctx.lineTo(tx+tw2-5,sp0);ctx.closePath();ctx.fillStyle=rgba(shade,0.95);ctx.fill();
    ctx.strokeStyle="rgba(250,232,220,0.45)";ctx.lineWidth=1.1;for(let k=1;k<7;k++){const y=sp0-k*(sp0-sp1)/7.4,hw=(tw2/2-5)*(1-k/7.4);ctx.beginPath();ctx.moveTo(cx2-hw,y);ctx.lineTo(cx2+hw,y);ctx.stroke();}
    ctx.strokeStyle=rgba(shade,0.9);ctx.lineWidth=1.2;for(let k=1;k<9;k++){const u=k/9,y=lerp(sp0,sp1,u),hw=(tw2/2-5)*(1-u);for(const sg of [-1,1]){ctx.beginPath();ctx.moveTo(cx2+sg*hw,y);ctx.lineTo(cx2+sg*(hw+4),y-3);ctx.stroke();}}
    ctx.beginPath();ctx.moveTo(cx2,sp1);ctx.lineTo(cx2,sp1-10);ctx.moveTo(cx2-4,sp1-6);ctx.lineTo(cx2+4,sp1-6);ctx.stroke();ctx.restore();}
  sp_treeLine(ctx,mx-330,mx+420,392,40,616);
  // another church's slim spire, further off; the old town's roofs, row on row below, terracotta, with walls of cream and ochre
  wc_part(ctx,wc_rect(1528,300,22,80),[200,186,160],0.8,{lw:1});wc_part(ctx,[[1526,302],[1552,302],[1539,236]],[96,136,120],0.8,{lw:1});
  sp_roofs(ctx,x0,x1,mx);}
// the old town from above, far to near: mostly roofs, terracotta and a few of slate, gable ends facing this way with a window or two,
// long roofs with a dormer, a tree in a courtyard; hazier and smaller with distance
function sp_roofs(ctx,x0,x1,mx){const R=wc_rng(617),roofs=[[182,96,68],[166,90,66],[196,118,82],[148,86,66],[176,108,84],[124,108,100]],
    walls=[[236,220,190],[222,196,150],[232,200,182],[214,208,196],[196,128,104],[240,226,200]];
  [[388,0.5,0.4],[418,0.58,0.48],[452,0.66,0.58],[490,0.76,0.7],[534,0.86,0.86],[584,0.98,0.93],[640,1.1,1],[704,1.24,1]].forEach(([by,k,d],row)=>{let x=x0-60-R()*80;
    while(x<x1+40){const kind=R(),w=(kind<0.45?(46+R()*44):(90+R()*110))*k,wh=(30+R()*30)*k,rh=(kind<0.45?w*(0.5+R()*0.2):(26+R()*14)*k),y=by+(R()-0.5)*14*k;
      if(row<3&&x+w>mx-310&&x<mx+420){x+=w*0.6;continue;}
      const wc=walls[Math.floor(R()*6)],rf=roofs[Math.floor(R()*6)];
      wc_part(ctx,wc_rect(x,y-wh,w,wh+46*k),wc,d,{lw:0.9,seed:(x|0)+row*7});
      if(kind<0.45){wc_part(ctx,[[x-3*k,y-wh+2],[x+w+3*k,y-wh+2],[x+w/2,y-wh-rh]],rf,d,{lw:0.9,seed:(x|0)+row*11});
        ctx.save();ctx.fillStyle=rgba(wc_haze([74,56,48],d),0.55);const nw=w>60*k?2:1;for(let j=0;j<nw;j++)ctx.fillRect(x+w*(nw===1?0.42:0.25+j*0.38),y-wh+10*k,7*k,11*k);ctx.restore();}
      else{const hip=R()<0.5;wc_part(ctx,hip?[[x-4*k,y-wh+2],[x+w+4*k,y-wh+2],[x+w-rh*0.9,y-wh-rh],[x+rh*0.9,y-wh-rh]]:[[x-4*k,y-wh+2],[x+w+4*k,y-wh+2],[x+w+1*k,y-wh-rh],[x-1*k,y-wh-rh]],rf,d,{lw:0.9,seed:(x|0)+row*11});
        if(R()<0.22){const dx=x+w*(0.3+R()*0.4);wc_flat(ctx,wc_rect(dx-8*k,y-wh-rh*0.62,16*k,12*k),wc_lit(walls[0],0),d,"dormer");wc_flat(ctx,[[dx-10*k,y-wh-rh*0.62],[dx+10*k,y-wh-rh*0.62],[dx,y-wh-rh*0.62-7*k]],wc_dim(rf,0.1),d,"dormer");}
        ctx.save();ctx.strokeStyle=rgba(wc_dim(wc_haze(rf,d),0.25),0.35);ctx.lineWidth=1.2;for(let yy=y-wh-rh+6*k;yy<y-wh;yy+=7*k){ctx.beginPath();ctx.moveTo(x+2*k,yy);ctx.lineTo(x+w-2*k,yy);ctx.stroke();}ctx.restore();}
      if(R()<0.25)wc_flat(ctx,wc_rect(x+w*(0.2+R()*0.6),y-wh-rh*0.8,7*k,15*k),wc_dim(rf,0.25),d,"chimney");
      if(R()<0.16)sp_clump(ctx,x+w+10*k,y-wh*0.4,26*k,(x|0)+3,d);
      x+=w*(0.78+R()*0.3);}});}
// trees: a clump with a bumpy edge, or a line of them along a hill (its top bumping from x0 to x1 at y), one wash each so they don't
// darken where they meet, lighter where the light falls
function sp_clump(ctx,x,y,r,seed,d){const pts=[];for(let i=0;i<28;i++){const a=i/28*TAU,rr=r*(0.86+0.14*Math.sin(a*5+seed));pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr*0.82]);}
  wc_wash(ctx,pts,[120,146,90],{depth:d==null?1:d,kind:"leaf",line:false,seed});ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x-r*0.3,y-r*0.35,r*0.7,[210,226,160],0.25);ctx.restore();}
function sp_treeLine(ctx,x0,x1,y,h,seed){const R=wc_rng(seed),pts=[[x0,y+h]];let x=x0,tops=[];while(x<x1){const r=12+R()*12;for(let i=0;i<=6;i++){const a=Math.PI+i/6*Math.PI;pts.push([x+r+Math.cos(a)*r,y-R()*6+Math.sin(a)*r*0.9]);}tops.push([x+r,y-r]);x+=r*2*(0.8+R()*0.2);}
  pts.push([x1,y+h]);wc_wash(ctx,pts,[120,146,90],{kind:"leaf",line:false,seed});ctx.save();ctx.globalCompositeOperation="screen";tops.forEach(([tx,ty])=>wc_glowAt(ctx,tx-4,ty+8,18,[214,230,166],0.3));ctx.restore();
  ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(70,90,60,0.35)");ctx.fillStyle=g;ctx.fillRect(x0,y,x1-x0,h);ctx.restore();}
// the room: its pale walls, the view through the windows, their frames and sills, the light they let in, the chairs' backs
function sp_paintBasel13(ctx){const K=SP_BS;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[222,216,206],{kind:"plaster",line:false,seed:601});wc_wash(ctx,wc_rect(-40,-40,W+80,74),[238,234,226],{kind:"plaster",line:false,seed:602});
  ctx.save();ctx.beginPath();K.wins.forEach(([x,y,w,h])=>ctx.rect(x,y,w,h));ctx.clip();sp_baselView(ctx,K.wins[0][0],K.wins[0][1],K.wins[2][0]+K.wins[2][2],K.wins[0][1]+K.wins[0][3]);
  ctx.fillStyle="rgba(214,232,240,0.1)";ctx.fillRect(0,0,W,H);ctx.restore();
  K.wins.forEach(([x,y,w,h])=>{for(const r of [wc_rect(x-12,y-12,w+24,12),wc_rect(x-12,y-12,12,h+24),wc_rect(x+w,y-12,12,h+24),wc_rect(x+w/2-4,y,8,h),wc_rect(x,y+150,w,8)])wc_part(ctx,r,[92,96,106],1,{lw:1});
    wc_part(ctx,wc_rect(x-24,y+h,w+48,16),[236,232,224],1,{lw:1.2});});
  ctx.save();ctx.globalCompositeOperation="screen";K.wins.forEach(([x,y,w,h])=>wc_glowAt(ctx,x+w/2,y+h+20,360,[255,246,226],0.22));ctx.restore();
  // the chairs' backs: charcoal, curved
  K.seats.forEach(([x],i)=>{wc_part(ctx,wc_rrPts(x-66,K.top-218,132,250,36),[64,66,76],1,{lw:1.3,seed:620+i});
    ctx.save();ctx.strokeStyle="rgba(255,255,255,0.12)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-48,K.top-198);ctx.quadraticCurveTo(x-58,K.top-120,x-52,K.top-40);ctx.stroke();ctx.restore();});}
// the table, over the people at it: pale oak; for each, the principles in a white folder, a glass, a microphone on its stem
function sp_paintBasel13Table(ctx){const K=SP_BS,top=K.top,near=990,oak=[220,188,144];
  wc_part(ctx,[[-40,top],[W+40,top],[W+40,near],[-40,near]],oak,1,{seed:632,lw:1.2});ctx.save();const G=wc_rng(633);ctx.lineWidth=1.6;
  for(let y=top+10;y<near;y+=9+G()*14+(y-top)*0.05){ctx.strokeStyle="rgba(130,90,52,"+(0.06+G()*0.08).toFixed(3)+")";ctx.beginPath();const x0=-20+G()*400,x1=W+20-G()*400;ctx.moveTo(x0,y);
    for(let x=x0;x<=x1;x+=60)ctx.lineTo(x,y+2.4*Math.sin(x/(150+G()*60)+y*0.3));ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";K.wins.forEach(([x,,w])=>wc_glowAt(ctx,x+w/2,top+60,340,[255,250,236],0.3));ctx.restore();
  wc_part(ctx,wc_rect(-40,near,W+80,H-near+40),[150,116,82],1,{seed:631});ctx.save();ctx.fillStyle="rgba(255,250,236,0.45)";ctx.fillRect(-40,near-2,W+80,3);ctx.restore();
  K.seats.forEach(([x],i)=>{const fx=x+(i%2?24:-24),y0=top+36,y1=top+110,wb=150,wf=172;ctx.save();ctx.filter="blur(4px)";ctx.fillStyle="rgba(90,60,30,0.22)";
    ctx.beginPath();ctx.moveTo(fx-wb+6,y0+8);ctx.lineTo(fx+wb+6,y0+8);ctx.lineTo(fx+wf+8,y1+10);ctx.lineTo(fx-wf+8,y1+10);ctx.closePath();ctx.fill();ctx.restore();
    wc_part(ctx,[[fx-wb,y0],[fx+wb,y0],[fx+wf,y1],[fx-wf,y1]],[248,248,244],1,{lw:1.1,seed:640+i});
    wc_flat(ctx,[[fx-wb*0.92,y0+12],[fx+wb*0.92,y0+12],[fx+wb*0.94,y0+22],[fx-wb*0.94,y0+22]],[52,84,140],1,"band");
    ctx.save();ctx.strokeStyle="rgba(120,124,136,0.5)";ctx.lineWidth=2;for(let j=0;j<3;j++){const yy=y0+44+j*16,ww=lerp(wb,wf,(yy-y0)/(y1-y0))*0.7;ctx.beginPath();ctx.moveTo(fx-ww,yy);ctx.lineTo(fx+ww*(j===2?0.3:1),yy);ctx.stroke();}ctx.restore();
    const gx=x+(i%2?-200:200),gy=top+70;ctx.save();ctx.fillStyle="rgba(206,228,236,0.4)";ctx.fillRect(gx-17,gy-64,34,66);ctx.strokeStyle="rgba(255,255,255,0.8)";ctx.lineWidth=2;ctx.strokeRect(gx-17,gy-64,34,66);
    ctx.fillStyle="rgba(255,255,255,0.45)";ctx.fillRect(gx-12,gy-58,5,54);ctx.beginPath();ctx.ellipse(gx,gy-64,17,4,0,0,TAU);ctx.strokeStyle="rgba(255,255,255,0.85)";ctx.stroke();ctx.beginPath();ctx.ellipse(gx,gy+2,17,4,0,0,TAU);ctx.fillStyle="rgba(120,100,80,0.18)";ctx.fill();ctx.restore();
    const mx2=x+(i%2?120:-120),my=top+46;wc_part(ctx,wc_rrPts(mx2-30,my-16,60,22,7),[40,42,48],1,{lw:1});ctx.save();ctx.strokeStyle="rgb(36,38,44)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx2,my-14);
    ctx.quadraticCurveTo(mx2,my-150,mx2+(x-mx2)*0.42,my-190);ctx.stroke();ctx.restore();});}

// The principles and the report from above, open on the table: SP_PR is the spread, its spine, top, and one page's size.
const SP_PR={spine:960,y:70,w:640,h:940};
// a table's top from above: pale oak, its grain in long uneven streaks, the light from the windows at the top of the frame (warm: the
// afternoon's, from the right)
function sp_paintOak(ctx,seed,warm){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),warm?[222,186,138]:[226,196,152],{kind:"plaster",line:false,seed});
  const G=wc_rng(seed+1);ctx.save();ctx.lineCap="round";for(let i=0;i<70;i++){const y=G()*H,x0=-60+G()*W*0.6,len=500+G()*1400,amp=2+G()*6,f=120+G()*200;ctx.strokeStyle="rgba(130,88,48,"+(0.05+G()*0.08).toFixed(3)+")";ctx.lineWidth=1+G()*2.2;
    ctx.beginPath();ctx.moveTo(x0,y);for(let x=x0;x<=x0+len;x+=40)ctx.lineTo(x,y+amp*Math.sin(x/f+i)+(x-x0)*0.012);ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";if(warm)wc_glowAt(ctx,W+100,200,1200,[255,224,170],0.3);else wc_glowAt(ctx,960,-200,1300,[255,250,236],0.3);ctx.restore();}
// a booklet open on it, spine at SP_PR.spine: its soft shadow, the cover's edge round the pages, the pages' stacked edges; the pages are
// painted blank and their words written every frame
function sp_spread(ctx,cover){const {spine,y,w,h}=SP_PR;ctx.save();ctx.filter="blur(16px)";ctx.fillStyle="rgba(80,50,20,0.32)";ctx.fillRect(spine-w-4,y+22,2*w+30,h+8);ctx.restore();
  wc_part(ctx,wc_rrPts(spine-w-14,y-10,2*w+28,h+22,8),cover,1,{kind:"cover",lw:1.2,seed:651});
  for(const s of [-1,1])for(let k=3;k>=0;k--){const x0=s<0?spine-w-k*3:spine;wc_flat(ctx,wc_rect(x0,y+k*2,w+k*3,h-k*2),[244-k*6,242-k*6,236-k*6],1,"page");}
  sp_pageBlank(ctx,spine-w,y,w,h,-1);sp_pageBlank(ctx,spine,y,w,h,1);}
// one page's paper, and the shade in its gutter (side -1: a left page, its gutter on the right)
function sp_pageBlank(ctx,x,y,w,h,side){wc_wash(ctx,wc_rect(x,y,w,h),[252,251,246],{kind:"page",line:false,seed:(x|0)+7});const gx=side<0?x+w:x,g=ctx.createLinearGradient(gx,0,gx-side*-90,0);
  g.addColorStop(0,"rgba(120,104,84,0.3)");g.addColorStop(0.35,"rgba(120,104,84,0.08)");g.addColorStop(1,"rgba(120,104,84,0)");ctx.fillStyle=g;ctx.fillRect(side<0?x+w-90:x,y,90,h);}
// paragraphs of small print: [[y, lines], ...] on a page from x, w wide
function sp_print(ctx,x,w,blocks,a){blocks.forEach(([y,n])=>gv_lines(ctx,x,y,w,n,22,a));}
// the list of principles on the left page: the title, then the first six; o.lit: "1 · Governance" lit gold, 0 to 1; o.run: gold
// running from it down to each of the others, 0 to 1
const SP_PRL=["1 · Governance","2 · Data architecture","3 · Accuracy","4 · Completeness","5 · Timeliness","6 · Adaptability"],SP_PRY=[440,540,610,680,750,820];
function sp_prList(ctx,o){o=o||{};const x=SP_PR.spine-SP_PR.w+70,a=o.a==null?1:o.a;
  wc_T(ctx,"Principles for",x,230,{w:800,size:52,f:"serif",col:WC_DARK,a});wc_T(ctx,"banks' risk data",x,292,{w:800,size:52,f:"serif",col:WC_DARK,a});
  ctx.save();ctx.fillStyle=rgba(WC_DARK,0.55*a);ctx.fillRect(x,334,500,3);ctx.restore();
  const lit=o.lit||0,run=o.run||0;if(lit>0){const tw1=tw(ctx,SP_PRL[0],46,800);ctx.save();ctx.globalCompositeOperation="multiply";
    wc_wash(ctx,wc_rrPts(x-16,SP_PRY[0]-46,(tw1+32)*easeCam(lit),62,10),GV.gold,{kind:"swatch",a:0.55*a,seed:661});ctx.restore();}
  if(run>0){const rx=x-30,y0=SP_PRY[0]-14,y1=SP_PRY[5]-10,p=easeCam(run),yy=lerp(y0,y1,p);ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95*a);ctx.lineWidth=5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(rx,y0);ctx.lineTo(rx,yy);ctx.stroke();for(let i=1;i<6;i++){const ty=SP_PRY[i]-10;if(yy<ty)continue;const q=clamp((yy-ty)/60,0,1);ctx.beginPath();ctx.moveTo(rx,ty);ctx.lineTo(rx+22*q,ty);ctx.stroke();}ctx.restore();}
  SP_PRL.forEach((s,i)=>{if(i===0){wc_T(ctx,s,x,SP_PRY[0],{w:800,size:46,col:mix(WC_DARK,GV.goldInk,lit),a});return;}
    const g=run>0?clamp((lerp(SP_PRY[0]-14,SP_PRY[5]-10,easeCam(run))-(SP_PRY[i]-10))/60,0,1):0;wc_T(ctx,s,x,SP_PRY[i],{w:600,size:30,col:mix(WC_MUTED,GV.goldInk,g*0.7),a:a*(0.85+0.15*g)});});}
// the page about the first principle (the right page; it turns), and the back of it, about the second, where one line is written
// every frame (sp_prOwn); and the page under it. Kept as pictures, so the turning page can be drawn squeezed.
function sp_prFace(key,paint,side){const {w,h}=SP_PR;return wc_kept("spPr"+key,w,h,q=>{sp_pageBlank(q,0,0,w,h,side);paint(q);});}
const sp_prGov=q=>{wc_T(q,"1 · Governance",60,110,{w:800,size:36,col:WC_DARK});sp_print(q,60,520,[[160,6],[330,5],[470,7],[660,4],[790,5]],1);};
const sp_prArch=q=>{wc_T(q,"2 · Data architecture",70,110,{w:800,size:36,col:WC_DARK});sp_print(q,70,500,[[160,5],[300,3],[596,6],[770,5]],1);};
const sp_prNext=q=>sp_print(q,60,520,[[110,7],[290,6],[460,5],[620,7],[810,4]],1);
// the second principle's line: written in word by word as p goes 0 to 1; "ownership" and "quality" lit gold as own and qual do, "risk
// data" underlined as risk does
function sp_prOwn(ctx,p,own,qual,risk){const x=SP_PR.spine-SP_PR.w+70,y=SP_PR.y,L1=["the","ownership","and","quality"],L2=["of","risk","data"],sz=50,sp=tw(ctx," ",sz,500,"serif");
  const words=[...L1.map((s,i)=>[s,0,i]),...L2.map((s,i)=>[s,1,i])];let cx=[x,x];
  words.forEach(([s,ln,i],k)=>{const wd=tw(ctx,s,sz,500,"serif"),wx=cx[ln],wy=y+(ln?530:466);cx[ln]+=wd+sp;const a=clamp(p*words.length-k,0,1);if(a<=0)return;
    const g=s==="ownership"?own:s==="quality"?qual:0;if(g>0){ctx.save();ctx.globalCompositeOperation="multiply";wc_wash(ctx,wc_rrPts(wx-8,wy-44,(wd+16)*easeCam(g),58,8),GV.gold,{kind:"swatch",a:0.55,seed:670+k});ctx.restore();}
    if((s==="risk"||s==="data")&&risk>0){ctx.save();ctx.fillStyle=rgba(GV.goldInk,0.8);ctx.fillRect(wx,wy+10,(wd+(s==="risk"?sp:0))*easeCam(risk),4);ctx.restore();}
    wc_T(ctx,s,wx,wy,{w:500,size:sz,f:"serif",col:mix(WC_DARK,GV.goldInk,g),a});});}
// the right page turning over the spine, th 0 to PI: its front squeezed toward the spine, then its back opening out over the left page;
// shaded as it stands up, and its shadow on the pages under it
function sp_turn(ctx,th,front,back){const {spine,y,w,h}=SP_PR,c=Math.cos(th),up=Math.sin(th),fx=w*Math.abs(c);
  ctx.save();const sx=c>0?spine+fx:spine-fx,g=ctx.createLinearGradient(sx,0,sx+(c>0?1:-1)*140*up,0);g.addColorStop(0,"rgba(80,60,40,"+(0.28*up).toFixed(3)+")");g.addColorStop(1,"rgba(80,60,40,0)");
  ctx.fillStyle=g;ctx.fillRect(c>0?sx:sx-140*up,y,140*up,h);ctx.restore();
  ctx.save();ctx.translate(spine,y+h/2);ctx.scale(Math.max(0.001,Math.abs(c)),1+0.05*up);ctx.drawImage(c>0?front:back,c>0?0:-w,-h/2,w,h);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle="rgba(150,140,128,"+(0.32*up*up).toFixed(3)+")";const x0=c>0?spine:spine-fx;ctx.fillRect(x0,y-h*0.025*up,fx,h*(1+0.05*up));ctx.restore();}

// thirty-one small towers in rows on the report's left page, one for each bank, no names (SP_TW: where each stands, its size and shape);
// the two in SP_GREEN met all the principles
const SP_TW=(()=>{const R=wc_rng(681),o=[];for(let i=0;i<31;i++){const row=Math.floor(i/8),col=i%8;o.push({x:SP_PR.spine-SP_PR.w+92+col*62+(row===3?31:0),base:360+row*110,
  w:30+R()*12,h:56+R()*40,top:Math.floor(R()*4),win:R()<0.5?2:3,row,col});}return o;})(),SP_GREEN=[10,21];
// one tower: o.in, how far it has stood up; o.g, how green; o.shine, a light passing over it
function sp_tower(ctx,T,o){const k=o.in==null?1:o.in;if(k<=0.01)return;const {x,base,w,top,win}=T,h=T.h*easeCam(k),g=o.g||0,sh=o.shine||0;
  const body=mix(mix([206,212,224],[150,206,164],g),[255,255,255],0.4*sh),ink=mix([96,104,124],GV.greenInk,g);ctx.save();ctx.globalAlpha=clamp(k*1.5,0,1);
  ctx.beginPath();const l=x-w/2,r=x+w/2,t=base-h;if(top===0){ctx.rect(l,t,w,h);}else if(top===1){ctx.moveTo(l,base);ctx.lineTo(l,t+14);ctx.lineTo(l+w*0.22,t+14);ctx.lineTo(l+w*0.22,t);ctx.lineTo(r-w*0.22,t);ctx.lineTo(r-w*0.22,t+14);ctx.lineTo(r,t+14);ctx.lineTo(r,base);ctx.closePath();}
  else if(top===2){ctx.moveTo(l,base);ctx.lineTo(l,t+12);ctx.lineTo(r,t);ctx.lineTo(r,base);ctx.closePath();}else{ctx.moveTo(l,base);ctx.lineTo(l,t+16);ctx.lineTo(x,t-6);ctx.lineTo(r,t+16);ctx.lineTo(r,base);ctx.closePath();}
  ctx.fillStyle=rgba(body,0.95);ctx.fill();ctx.lineJoin="round";ctx.lineWidth=2.4;ctx.strokeStyle=rgba(ink,0.85);ctx.stroke();
  ctx.fillStyle=rgba(mix([252,252,248],[236,250,240],g),0.9);const cw=(w-10)/win;for(let yy=t+(top===0?8:20);yy<base-12;yy+=13)for(let c=0;c<win;c++)ctx.fillRect(l+5+c*cw+1,yy,cw-3,6);
  if(top===0){ctx.fillStyle=rgba(ink,0.8);ctx.fillRect(x-1,t-12,2,12);}ctx.restore();}
// the green towers' light, under all the towers so it doesn't tint their neighbours
function sp_towerGlow(ctx,T,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,T.x,T.base-T.h*0.5,T.h*0.85,[150,220,170],0.75*a);ctx.restore();}
// the line each row stands on
function sp_rowGround(ctx,a){ctx.save();ctx.fillStyle=rgba([140,148,164],0.5*a);for(let r=0;r<4;r++)ctx.fillRect(SP_PR.spine-SP_PR.w+52,360+r*110,536,3);ctx.restore();}
// a sticky note stuck on as p goes 0 to 1, with words in marker
function sp_sticky(ctx,x,y,rot,lines,p,seed){if(p<=0.01)return;const s=1.18-0.18*spring(clamp(p,0,1)),w=320,h=210;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.globalAlpha=clamp(p*3,0,1);
  ctx.save();ctx.filter="blur(5px)";ctx.fillStyle="rgba(70,60,40,0.25)";ctx.fillRect(-w/2+6,-h/2+10,w,h);ctx.restore();wc_wash(ctx,wc_rect(-w/2,-h/2,w,h),GV_NOTE[0],{kind:"card",line:false,seed});
  ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(-w/2,-h/2,w,26);lines.forEach((l,i)=>wc_hand(ctx,l,-w/2+26,-h/2+(lines.length===1?124:90+i*58),{size:40,col:[44,52,90],w:700}));ctx.restore();}
// the places: the principles open on the pale oak table in the morning; the report open on it in the afternoon, ten years on
function sp_paintPrinciples13(ctx){sp_paintOak(ctx,641,false);sp_spread(ctx,[236,236,232]);}
function sp_paintReport23(ctx){sp_paintOak(ctx,691,true);sp_spread(ctx,[52,98,100]);const {spine,w}=SP_PR;sp_print(ctx,spine-w+70,500,[[234,2]],1);
  sp_print(ctx,spine+60,520,[[110,6],[290,5],[460,7],[650,4],[790,6]],1);}
// the report's page as it's read (o: the times things happen): its title; the towers standing up row by row; a light passing over them
// all; the two that met the principles turning green; what that means, in words; the notes stuck on the facing page; then, ten years
// on from the principles, the two green towers glowing as the decisions are named
function sp_report(ctx,tt,o){const {spine,w}=SP_PR,go=fin(tt,o.go,0.6);wc_T(ctx,"Progress report",spine-w+70,200,{w:700,size:34,col:WC_MUTED});
  const g=i=>i===SP_GREEN[0]?fin(tt,o.two-0.1,0.5):i===SP_GREEN[1]?fin(tt,o.two+0.2,0.5):0,glow=1+0.8*fin(tt,o.dec-0.1,0.9);
  SP_GREEN.forEach(i=>sp_towerGlow(ctx,SP_TW[i],g(i)*glow));sp_rowGround(ctx,fin(tt,o.at+0.2,0.6));
  SP_TW.forEach((T,i)=>sp_tower(ctx,T,{in:fin(tt,o.at+0.3+T.row*0.28+T.col*0.05,0.6),g:g(i),shine:gv_io(tt,o.thirty-0.15+i*0.03,o.thirty+0.2+i*0.03,0.2)}));
  const ca=fin(tt,o.met-0.1,0.5)*(1-go);if(ca>0.01){const s1="2",s2=" of 31 met them all",sz=42,w1=tw(ctx,s1,sz,800),w2=tw(ctx,s2,sz,800),cx=spine-w/2-(w1+w2)/2;
    wc_T(ctx,s1,cx,790,{w:800,size:sz,col:GV.greenInk,a:ca});wc_T(ctx,s2,cx+w1,790,{w:800,size:sz,col:WC_DARK,a:ca});}
  [[1200,300,-0.04,["underfunded"],o.under],[1420,520,0.05,["narrow"],o.narrow],[1230,750,-0.03,["the board's","attention?"],o.att]].forEach(([x,y,r,l,t0],i)=>{
    const p=fin(tt,t0-0.1,0.6);if(p>0.01&&go<0.99)withA(ctx,1-go,()=>sp_sticky(ctx,x,y,r,l,p,701+i));});}


/* ---------- 2017: a team room ---------- */
// The team room: a pale sage wall, a whiteboard on the left where the proposal is stuck up, a window onto the city on the right; one of
// the team stands at the board, three sit at the table, the table a layer of its own (team17table), over them. SP_TR: the wall's foot,
// the whiteboard, the sheet on it, the map on the sheet, the window, the table's left end, far edge and near edge, who sits where,
// their scale, the one standing [x, foot, scale].
const SP_TR={fy:742,board:[64,104,780,580],sheet:[112,136,600,510],map:[146,302,532,318],win:[1072,80,830,600],table:[1000,808,904],
  seats:[[1196,"spT1"],[1476,"spT3"],[1752,"spT4"]],s:0.92,stand:[806,1014,0.95]};
const SP_WALL17=[222,226,212];
// poses: seated, turned to the left or the right, and the same looking down a little (a nod is a swing between them); a hand raised to
// ask; standing, an arm up pointing high on the left, the other arm open to the right while turned to the right, and turned to the right
// with the arms down
Object.assign(POSE,{
  spSitL:{L:[0.14,-0.08],R:[0.1,0.05],feet:24,shift:0,tilt:0.04,turn:-0.32,gaze:[-0.8,-0.05],look:0},
  spSitLNod:{L:[0.14,-0.08],R:[0.1,0.05],feet:24,shift:0,tilt:-0.07,turn:-0.32,gaze:[-0.6,1],look:2.6},
  spSitR:{L:[0.14,-0.08],R:[0.1,0.05],feet:24,shift:0,tilt:-0.04,turn:0.32,gaze:[0.8,-0.05],look:0},
  spAskUp:{L:[0.14,-0.08],R:[0.55,-2.8],hand:"open",feet:24,shift:0,tilt:-0.03,turn:0.06,gaze:[0.1,-0.05],look:0},
  spPointUp:{L:[0.12,-0.06],R:[1.6,2.2],hand:"open",feet:34,shift:6,tilt:-0.05,turn:0.32,gaze:[0.7,-0.4],look:0},
  spPitch:{L:[0.85,2.15],R:[0.12,-0.06],feet:32,shift:-4,tilt:0.03,turn:-0.3,gaze:[-0.7,0],look:0},
  spPitchNod:{L:[0.85,2.15],R:[0.12,-0.06],feet:32,shift:-4,tilt:0.09,turn:-0.3,gaze:[-0.5,1],look:2.6},
  spBackR:{L:[0.12,-0.08],R:[0.14,-0.06],feet:30,shift:4,tilt:0.02,turn:-0.28,gaze:[-0.7,0],look:0}
});
// the city through the window by day: a pale sky, far towers in haze, nearer blocks of offices and flats with their windows, the tops
// of the trees along the street
function sp_dayCity(ctx,x,y,w,h,seed){const R=wc_rng(seed),base=y+h;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  const g=ctx.createLinearGradient(0,y,0,base);g.addColorStop(0,"rgb(176,204,226)");g.addColorStop(0.7,"rgb(222,232,236)");g.addColorStop(1,"rgb(238,236,228)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ctx.save();ctx.globalCompositeOperation="screen";for(let i=0;i<5;i++)wc_glowAt(ctx,x+R()*w,y+40+R()*h*0.35,120+R()*140,[255,255,255],0.42);ctx.restore();
  for(let X=x-20;X<x+w+20;){const tw_=50+R()*70,th=h*(0.28+R()*0.34);wc_wash(ctx,wc_rect(X,base-th-90,tw_,th+90),[168,182,200],{kind:"build",depth:0.45,lw:0.8,seed:seed+X});X+=tw_+6+R()*30;}
  const cols=[[196,188,174],[176,120,98],[150,170,186],[208,200,184],[164,150,140]];
  for(let X=x-30;X<x+w+30;){const bw=110+R()*150,bh=h*(0.22+R()*0.3),c=cols[Math.floor(R()*cols.length)],top=base-bh-40;
    wc_part(ctx,wc_rect(X,top,bw,bh+40),c,0.75,{lw:1,seed:seed+7+X});
    ctx.save();ctx.fillStyle=rgba(wc_dim(c,0.38),0.55);for(let yy=top+16;yy<base-50;yy+=30)for(let xx=X+12;xx<X+bw-22;xx+=26)ctx.fillRect(xx,yy,14,16);ctx.restore();
    ctx.save();ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(X,top,bw*0.3,bh+40);ctx.restore();X+=bw+4+R()*20;}
  sp_treeLine(ctx,x-20,x+w+20,base-46,60,seed+3);ctx.restore();}
// the proposal's map: streets in a slanted grid, blocks, two parks, a river; the shop's pin and the ring round it are drawn every frame
const SP_SHOP=[420,452],SP_ZONE=[74,84,120];
function sp_mapArt(ctx){const [mx,my,mw,mh]=SP_TR.map;ctx.save();ctx.beginPath();ctx.rect(mx,my,mw,mh);ctx.clip();
  ctx.fillStyle="rgb(238,234,222)";ctx.fillRect(mx,my,mw,mh);
  ctx.fillStyle="rgb(196,222,236)";ctx.beginPath();ctx.moveTo(mx-10,my+mh-60);ctx.bezierCurveTo(mx+160,my+mh-110,mx+320,my+mh-10,mx+mw+10,my+mh-70);ctx.lineTo(mx+mw+10,my+mh-30);
  ctx.bezierCurveTo(mx+320,my+mh+30,mx+160,my+mh-70,mx-10,my+mh-20);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(200,224,184)";ctx.fillRect(mx+40,my+30,120,86);ctx.fillRect(mx+380,my+40,100,70);
  ctx.translate(mx+mw/2,my+mh/2);ctx.rotate(-0.12);ctx.strokeStyle="rgb(252,252,248)";ctx.lineCap="round";
  for(let i=-6;i<=6;i++){ctx.lineWidth=i%3===0?12:6;ctx.beginPath();ctx.moveTo(i*62,-mh);ctx.lineTo(i*62,mh);ctx.stroke();}
  for(let j=-4;j<=4;j++){ctx.lineWidth=j%2===0?11:6;ctx.beginPath();ctx.moveTo(-mw,j*58);ctx.lineTo(mw,j*58);ctx.stroke();}
  ctx.restore();ctx.save();ctx.strokeStyle="rgba(120,120,120,0.5)";ctx.lineWidth=2;ctx.strokeRect(mx,my,mw,mh);ctx.restore();}
// the customers' locations on it, in plum, as the series draws personal data: n of them (0 to SP_DOTS.length), each popping in; the
// ring round the shop, dashed, drawn as ring goes 0 to 1; the shop, a pin with a bag in it
const SP_DOTS=(()=>{const R=wc_rng(701),o=[],[mx,my,mw,mh]=SP_TR.map;for(let i=0;i<120;i++){let px,py;
  if(R()<0.55){const a=R()*TAU,r=30+R()*170;px=SP_SHOP[0]+Math.cos(a)*r*1.3;py=SP_SHOP[1]+Math.sin(a)*r*0.8;}else{px=mx+14+R()*(mw-28);py=my+14+R()*(mh-28);}
  o.push([clamp(px,mx+12,mx+mw-12),clamp(py,my+12,my+mh-12)]);}return o;})();
function sp_mapDots(ctx,n,ring){const [mx,my,mw,mh]=SP_TR.map,[sx,sy]=SP_SHOP;ctx.save();ctx.beginPath();ctx.rect(mx,my,mw,mh);ctx.clip();
  if(ring>0){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([238,214,170],0.55*ring);ctx.beginPath();ctx.ellipse(sx,sy,150,96,0,0,TAU);ctx.fill();ctx.restore();
    ctx.save();ctx.strokeStyle=rgba(SP_ZONE,0.85);ctx.lineWidth=4;ctx.setLineDash([14,10]);ctx.beginPath();ctx.ellipse(sx,sy,150,96,0,-Math.PI/2,-Math.PI/2+TAU*easeCam(ring));ctx.stroke();ctx.restore();}
  for(let i=0;i<SP_DOTS.length;i++){const q=clamp(n-i,0,1);if(q<=0)break;const [px,py]=SP_DOTS[i],k=spring(q);
    ctx.fillStyle="rgba(255,255,255,0.9)";ctx.beginPath();ctx.arc(px,py,9*k,0,TAU);ctx.fill();ctx.fillStyle=rgba(GV_CLASS.direct,0.92);ctx.beginPath();ctx.arc(px,py,6.5*k,0,TAU);ctx.fill();}
  ctx.restore();ctx.save();ctx.fillStyle="rgba(40,30,30,0.25)";ctx.beginPath();ctx.ellipse(sx+4,sy+4,12,5,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(WC_DARK,1);ctx.beginPath();ctx.moveTo(sx,sy);ctx.bezierCurveTo(sx-26,sy-30,sx-24,sy-62,sx,sy-62);ctx.bezierCurveTo(sx+24,sy-62,sx+26,sy-30,sx,sy);ctx.fill();
  ctx.fillStyle="rgb(252,250,244)";ctx.fillRect(sx-9,sy-46,18,15);ctx.strokeStyle="rgb(252,250,244)";ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(sx,sy-46,5,Math.PI,0);ctx.stroke();ctx.restore();}
// an office chair, empty, seen from behind: black mesh on a five-star base; its base's middle on the floor at (x, y)
function sp_officeChair(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const blk=[44,46,54],dk=[30,32,38];
  wc_contact(ctx,-150,150,0,1,0.3);
  for(const [ax,ay] of [[-128,-6],[-70,8],[0,12],[78,6],[126,-8]]){wc_part(ctx,[[-8,-34],[8,-34],[ax+6,ay-14],[ax-6,ay-14]],dk,1,{kind:"thing",lw:1,seed:(ax+200)|0});
    ctx.fillStyle="rgb(26,26,30)";ctx.beginPath();ctx.arc(ax,ay-6,10,0,TAU);ctx.fill();}
  wc_part(ctx,wc_rect(-9,-150,18,118),[150,152,160],1,{kind:"thing",lw:1,seed:771});wc_part(ctx,wc_rrPts(-120,-196,240,52,20),blk,1,{kind:"thing",lw:1.2,seed:772});
  wc_part(ctx,wc_rrPts(-104,-430,208,236,48),blk,1,{kind:"thing",lw:1.2,seed:773});
  ctx.save();ctx.strokeStyle="rgba(255,255,255,0.07)";ctx.lineWidth=2;for(let i=-90;i<=90;i+=12){ctx.beginPath();ctx.moveTo(i,-420);ctx.lineTo(i*0.9,-206);ctx.stroke();}ctx.restore();
  for(const sx of [-1,1])wc_part(ctx,[[sx*112,-196],[sx*124,-196],[sx*124,-262],[sx*96,-262]],dk,1,{kind:"thing",lw:1,seed:774+sx});ctx.restore();}
// the room: the wall and the floor, the window and its light, the whiteboard with the sheet stuck on it, the chair she got up from
function sp_paintTeam17(ctx){const K=SP_TR,[bx,by,bw,bh]=K.board,[sx,sy,sw,sh]=K.sheet,[wx,wy,ww,wh]=K.win;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,K.fy+40),SP_WALL17,{kind:"plaster",line:false,seed:711});
  wc_wash(ctx,wc_rect(-40,K.fy,W+80,H-K.fy+40),[132,138,150],{kind:"ground",line:false,seed:712});
  ctx.save();ctx.strokeStyle="rgba(90,96,110,0.16)";ctx.lineWidth=2;for(let yy=K.fy+30;yy<H;yy+=46+(yy-K.fy)*0.18){ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(W,yy);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,K.fy-14,W+80,16),wc_dim(SP_WALL17,0.3),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh*0.6,900,[255,250,236],0.32);ctx.restore();
  sp_dayCity(ctx,wx,wy,ww,wh,721);
  for(const r of [wc_rect(wx-14,wy-14,ww+28,14),wc_rect(wx-14,wy-14,14,wh+28),wc_rect(wx+ww,wy-14,14,wh+28),wc_rect(wx+ww/3-5,wy,10,wh),wc_rect(wx+ww*2/3-5,wy,10,wh)])wc_part(ctx,r,[226,226,222],1,{lw:1.1});
  wc_part(ctx,wc_rect(wx-30,wy+wh,ww+60,18),[236,234,228],1,{lw:1.2});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh/2,560,[255,255,250],0.18);ctx.restore();
  ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(60,60,60,0.18)";ctx.fillRect(bx+10,by+14,bw,bh);ctx.restore();
  wc_part(ctx,wc_rect(bx-10,by-10,bw+20,bh+20),[176,180,188],1,{kind:"thing",lw:1.2,seed:713});wc_flat(ctx,wc_rect(bx,by,bw,bh),[250,251,250],1,"board");
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,bx+bw*0.8,by+80,300,[255,255,255],0.4);ctx.restore();
  wc_part(ctx,wc_rect(bx+40,by+bh+10,bw-80,14),[170,174,182],1,{kind:"thing",lw:1,seed:714});for(const [mx2,c] of [[bx+90,[40,60,150]],[bx+150,[200,50,40]],[bx+200,[30,30,36]]])wc_flat(ctx,wc_rect(mx2,by+bh+4,46,10),c,1,"marker");
  // marker left on the board beside the sheet, that nobody needs to read
  ctx.save();ctx.strokeStyle="rgba(40,60,150,0.55)";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx+sw+30,by+60);ctx.lineTo(sx+sw+100,by+60);ctx.moveTo(sx+sw+30,by+100);ctx.lineTo(sx+sw+80,by+100);
  ctx.moveTo(sx+sw+40,by+170);ctx.quadraticCurveTo(sx+sw+80,by+140,sx+sw+96,by+200);ctx.stroke();ctx.restore();
  ctx.drawImage(gv_sheetPaper(sw,sh),sx-20,sy-20);sp_mapArt(ctx);
  for(const [mx2,my2,c] of [[sx+22,sy+20,[220,70,60]],[sx+sw-22,sy+20,[60,120,200]],[sx+22,sy+sh-18,[60,160,100]],[sx+sw-22,sy+sh-18,[240,180,40]]]){ctx.save();ctx.fillStyle="rgba(40,40,40,0.25)";
    ctx.beginPath();ctx.arc(mx2+3,my2+4,13,0,TAU);ctx.fill();ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(mx2,my2,12,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.5)";ctx.beginPath();ctx.arc(mx2-4,my2-4,4,0,TAU);ctx.fill();ctx.restore();}
  sp_officeChair(ctx,330,1066,0.82);}
// the proposal's title, printed, coming in line by line as p goes 0 to 1
function sp_proposal(ctx,p){const [sx,sy]=SP_TR.sheet;wc_T(ctx,"Use customers' locations",sx+40,sy+84,{w:800,size:42,col:WC_DARK,a:clamp(p*2,0,1)});
  wc_T(ctx,"to time our offers?",sx+40,sy+138,{w:800,size:42,col:WC_DARK,a:clamp(p*2-1,0,1)});}
// the table, over the people at it: a pale top seen from above, its edge, the dark under it; on it a laptop, cups, glasses, a phone, a pad
function sp_paintTeam17Table(ctx){const [x0,top,near]=SP_TR.table,col=[236,232,224];
  ctx.save();ctx.fillStyle="rgba(50,50,60,0.4)";ctx.filter="blur(10px)";ctx.fillRect(x0+40,near+20,W,H-near);ctx.restore();
  wc_part(ctx,[[x0+40,near+34],[W+40,near+34],[W+40,H+40],[x0+70,H+40]],[86,88,98],1,{lw:1,seed:731});wc_part(ctx,wc_rect(x0+70,near+30,26,H-near),[150,152,160],1,{kind:"thing",lw:1,seed:732});
  wc_part(ctx,[[x0+30,top],[W+40,top],[W+40,near],[x0,near]],col,1,{lw:1.2,seed:733});
  wc_part(ctx,wc_rect(x0,near,W+40-x0,30),[196,168,128],1,{lw:1.1,seed:734});ctx.save();ctx.fillStyle="rgba(255,255,255,0.5)";ctx.fillRect(x0,near,W-x0,3);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1500,top+30,520,[255,255,250],0.35);ctx.restore();
  ctx.save();ctx.filter="blur(4px)";ctx.fillStyle="rgba(60,60,70,0.25)";ctx.fillRect(1306,top+34,190,40);ctx.restore();
  wc_part(ctx,[[1310,top+26],[1480,top+26],[1490,top+66],[1300,top+66]],[196,200,206],1,{kind:"thing",lw:1.1,seed:735});ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(1312,top+28,166,3);
  wc_part(ctx,[[1590,top+40],[1660,top+40],[1664,top+60],[1586,top+60]],[40,42,50],1,{kind:"thing",lw:1,seed:741});
  wc_part(ctx,[[1074,top+58],[1106,top+58],[1111,top+6],[1069,top+6]],[246,244,238],1,{kind:"thing",lw:1.2,seed:736});wc_part(ctx,wc_rect(1067,top-4,46,12),[60,50,46],1,{kind:"thing",lw:1,seed:737});
  wc_flat(ctx,wc_rect(1070,top+20,40,18),[150,110,80],1,"sleeve");gv_mug(ctx,1700,top+62,[70,130,160]);gv_mug(ctx,1338,top+20,[214,120,70],true);
  wc_part(ctx,[[1810,top+24],[1900,top+24],[1912,top+70],[1800,top+70]],[250,232,120],1,{kind:"thing",lw:1,seed:742});
  ctx.save();ctx.strokeStyle="rgba(80,80,80,0.4)";ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(1814,top+36+i*11);ctx.lineTo(1890,top+36+i*11);ctx.stroke();}
  ctx.strokeStyle="rgb(30,40,90)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(1790,top+78);ctx.lineTo(1880,top+60);ctx.stroke();ctx.restore();
  for(const [gx,gy] of [[1240,top+64],[1530,top+70]]){ctx.save();ctx.fillStyle="rgba(206,228,236,0.4)";ctx.fillRect(gx-15,gy-56,30,56);ctx.strokeStyle="rgba(255,255,255,0.85)";ctx.lineWidth=2;
    ctx.strokeRect(gx-15,gy-56,30,56);ctx.fillStyle="rgba(255,255,255,0.45)";ctx.fillRect(gx-11,gy-50,5,46);ctx.restore();}}
// someone seated behind a table whose far edge is at cutY, sitting up: as gv_behind, a little higher
function sp_seated(ctx,id,x,cutY,s,o){ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();person(ctx,id,x,cutY+268*s,s,o);ctx.restore();}
// a tab standing up out of a book's pages, with its word: what that edition added. The book's bottom's middle at (x, y), as sp_book;
// lit gold as lit goes 0 to 1. Drawn before the book, which hides its foot. deco: its word only decoration (the camera cuts it).
function sp_bookTab(ctx,x,y,label,lit,dx,deco){const K=SP_SH,top=y-K.h-8,w=Math.round(tw(ctx,label,34,700)+40),h=86,tx=x+(dx||40);
  ctx.save();ctx.fillStyle="rgba(40,24,12,0.25)";ctx.fillRect(tx+6,top-h+30,w,h);ctx.restore();
  wc_part(ctx,wc_rrPts(tx,top-h+24,w,h,8),mix([248,246,238],GV.gold,0.75*lit),1,{kind:"thing",lw:1.2,seed:label.length+880});
  if(lit>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,tx+w/2,top-h/2+24,w*0.9,[255,214,120],0.5*lit);ctx.restore();}
  wc_T(ctx,label,tx+w/2,top-h+70,{w:700,size:34,align:"center",col:mix(WC_DARK,GV.goldInk,lit),deco:!!deco});}

/* ---------- 2018: an office's front desk in Europe ---------- */
// The front desk: a tall window onto an old street on the left, where the customer stands; the counter across the rest, its oak front
// and pale top, and behind it the office's privacy lead (standing, cut at the counter's top), a print, a clock, a shelf of binders. The
// counter is a layer of its own (front18desk), over her. SP_FD: the wall's foot, the window, the counter's left end, top and front
// edge, the print, the clock, the shelf, the customer [x, foot, scale], the privacy lead [x, foot, scale].
const SP_FD={fy:820,win:[64,70,500,650],desk:[790,694,716],print:[880,170,300,220],clock:[1290,230],shelf:[1440,170,430,400],cust:[640,1046,0.97],priv:[1140,986,0.95]};
const SP_WALL18=[220,222,226];
// poses, standing: a sheet held out, at shoulder height; read, held in both hands at the chest
Object.assign(POSE,{
  spOffer:{L:[0.13,-0.1],R:[0.9,1.75],feet:28,shift:4,tilt:-0.03,turn:0.22,gaze:[0.6,0.1],look:0},
  spReadStand:{L:[0.16,-2.05],R:[0.2,-2.4],feet:26,shift:2,tilt:0.04,turn:0.08,gaze:[0.3,0.8],look:1},
  spReadNod:{L:[0.16,-2.05],R:[0.2,-2.4],feet:26,shift:2,tilt:-0.05,turn:0.08,gaze:[0.3,1],look:2.6}
});
// an old street through the window by day: the houses opposite, pastel, with tall windows, shutters and iron balconies, cornices at
// each floor and dormers in the roof; a shop with a striped awning or a doorway at street level; the tram's wire, a lamp post, a bicycle
function sp_streetEU(ctx,x,y,w,h,seed){const R=wc_rng(seed),gy=y+h-70;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  const g=ctx.createLinearGradient(0,y,0,y+120);g.addColorStop(0,"rgb(184,210,230)");g.addColorStop(1,"rgb(226,234,238)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  const cols=[[230,200,146],[218,176,164],[200,210,180],[236,226,206]],hw=[200,180,210];let X=x-40,i=0;
  while(X<x+w){const bw=hw[i%3],c=cols[(i+seed)%4],top=y+40+R()*40;
    wc_part(ctx,wc_rect(X,top,bw,gy-top+20),c,0.9,{lw:1,seed:seed+i});
    wc_part(ctx,[[X-6,top],[X+bw+6,top],[X+bw-10,top-34],[X+10,top-34]],[120,104,104],0.9,{lw:1,seed:seed+40+i});
    wc_part(ctx,wc_rect(X+bw/2-22,top-58,44,40),c,0.9,{lw:1,seed:seed+50+i});wc_flat(ctx,wc_rect(X+bw/2-12,top-48,24,28),[90,96,110],0.9,"pane");
    const fl=4,fh=(gy-110-top)/fl;for(let f=0;f<fl;f++){const fy=top+14+f*fh;ctx.fillStyle=rgba(wc_dim(c,0.18),0.8);ctx.fillRect(X,fy+fh-6,bw,5);
      for(let k=0;k<2;k++){const wx=X+bw*(0.2+k*0.42),ww=bw*0.2,wh=fh*0.62,wy=fy+fh*0.18;wc_flat(ctx,wc_rect(wx,wy,ww,wh),[98,108,124],0.9,"pane");
        ctx.fillStyle="rgba(255,255,255,0.22)";ctx.fillRect(wx+3,wy+3,ww*0.35,wh-6);ctx.strokeStyle=rgba([246,242,232],0.9);ctx.lineWidth=2.5;ctx.strokeRect(wx,wy,ww,wh);
        ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.stroke();
        if((i+f+k)%3===0){const sc=[96,124,108];wc_flat(ctx,wc_rect(wx-ww*0.42,wy,ww*0.4,wh),sc,0.9,"shutter");wc_flat(ctx,wc_rect(wx+ww*1.02,wy,ww*0.4,wh),sc,0.9,"shutter");}
        if(f===1||f===2){ctx.strokeStyle="rgba(40,40,46,0.85)";ctx.lineWidth=2;const by=wy+wh;ctx.beginPath();ctx.moveTo(wx-10,by);ctx.lineTo(wx+ww+10,by);ctx.moveTo(wx-10,by-26);ctx.lineTo(wx+ww+10,by-26);
          for(let b=wx-10;b<=wx+ww+10;b+=8){ctx.moveTo(b,by);ctx.lineTo(b,by-26);}ctx.stroke();}}}
    const sy=gy-100;if(i%2===0){wc_flat(ctx,wc_rect(X+16,sy+20,bw-32,80),[70,80,92],0.9,"shop");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,X+bw/2,sy+60,90,[255,226,170],0.35);ctx.restore();
      const aw=[[X+8,sy+4],[X+bw-8,sy+4],[X+bw+4,sy+34],[X-4,sy+34]];wc_part(ctx,aw,[190,80,70],0.9,{lw:1,seed:seed+60+i});ctx.save();wc_tr(ctx,aw);ctx.clip();ctx.fillStyle="rgba(255,250,240,0.7)";
      for(let sx=X;sx<X+bw;sx+=28)ctx.fillRect(sx,sy,14,40);ctx.restore();}
    else wc_flat(ctx,wc_arched(X+bw/2-30,sy+10,60,90),[96,70,60],0.9,"door");
    X+=bw;i++;}
  wc_flat(ctx,wc_rect(x,gy,w,26),[196,190,182],1,"pavement");wc_flat(ctx,wc_rect(x,gy+26,w,50),[150,148,150],1,"street");
  ctx.save();ctx.strokeStyle="rgba(200,196,186,0.8)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,gy+44);ctx.lineTo(x+w,gy+44);ctx.moveTo(x,gy+60);ctx.lineTo(x+w,gy+60);ctx.stroke();
  ctx.strokeStyle="rgba(40,40,46,0.7)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+176);ctx.quadraticCurveTo(x+w/2,y+190,x+w,y+170);ctx.stroke();ctx.restore();
  const lx=x+w*0.72;wc_part(ctx,wc_rect(lx-5,gy-250,10,252),[44,48,52],1,{kind:"iron",lw:1});wc_part(ctx,[[lx-20,gy-250],[lx+20,gy-250],[lx+12,gy-284],[lx-12,gy-284]],[44,48,52],1,{kind:"iron",lw:1});
  const bx=x+w*0.32,by=gy+18;ctx.save();ctx.strokeStyle="rgba(40,46,56,0.9)";ctx.lineWidth=3;for(const wx2 of [bx-34,bx+34]){ctx.beginPath();ctx.arc(wx2,by,24,0,TAU);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(bx-34,by);ctx.lineTo(bx-6,by-34);ctx.lineTo(bx+24,by-34);ctx.lineTo(bx+34,by);ctx.moveTo(bx-6,by-34);ctx.lineTo(bx,by);ctx.lineTo(bx+24,by-34);
  ctx.moveTo(bx-10,by-44);ctx.lineTo(bx-2,by-44);ctx.moveTo(bx+24,by-34);ctx.lineTo(bx+28,by-48);ctx.stroke();ctx.restore();ctx.restore();}
// the room: the wall and the floor, the window and its light, the print, the clock, the shelf of binders, the light from the ceiling
function sp_paintFront18(ctx){const K=SP_FD,[wx,wy,ww,wh]=K.win,[px,py,pw,ph]=K.print,[sx,sy,sw]=K.shelf;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,K.fy+40),SP_WALL18,{kind:"plaster",line:false,seed:801});
  wc_wash(ctx,wc_rect(-40,K.fy,W+80,H-K.fy+40),[180,152,120],{kind:"ground",line:false,seed:802});
  ctx.save();ctx.strokeStyle="rgba(110,80,50,0.18)";ctx.lineWidth=2;for(let xx=-400;xx<W+400;xx+=90){ctx.beginPath();ctx.moveTo(xx,K.fy);ctx.lineTo(xx+(xx-960)*0.9,H);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,K.fy-14,W+80,16),wc_dim(SP_WALL18,0.28),{kind:"trim",line:false,flat:true});
  sp_streetEU(ctx,wx,wy,ww,wh,811);
  for(const r of [wc_rect(wx-16,wy-16,ww+32,16),wc_rect(wx-16,wy-16,16,wh+32),wc_rect(wx+ww,wy-16,16,wh+32),wc_rect(wx+ww/2-6,wy,12,wh),wc_rect(wx,wy+170,ww,12)])wc_part(ctx,r,[238,236,230],1,{lw:1.1});
  wc_part(ctx,wc_rect(wx-30,wy+wh,ww+60,18),[240,238,232],1,{lw:1.2});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh/2,520,[255,252,240],0.2);wc_glowAt(ctx,wx+ww+200,K.fy+120,500,[255,246,224],0.25);wc_glowAt(ctx,wx+ww+260,360,520,[255,248,232],0.22);ctx.restore();
  ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(60,60,70,0.2)";ctx.fillRect(px+8,py+10,pw,ph);ctx.restore();wc_part(ctx,wc_rect(px-12,py-12,pw+24,ph+24),[60,62,70],1,{kind:"thing",lw:1,seed:812});
  wc_flat(ctx,wc_rect(px,py,pw,ph),[250,248,240],1,"mount");ctx.save();ctx.beginPath();ctx.rect(px+30,py+30,pw-60,ph-60);ctx.clip();wc_flat(ctx,wc_rect(px+30,py+30,pw-60,ph-60),[224,232,236],1,"sky");
  wc_wash(ctx,[[px,py+ph-70],[px+80,py+110],[px+160,py+140],[px+240,py+96],[px+pw,py+130],[px+pw,py+ph],[px,py+ph]],[150,176,150],{kind:"field",line:false,seed:813});
  wc_wash(ctx,[[px,py+ph-40],[px+120,py+150],[px+pw,py+170],[px+pw,py+ph],[px,py+ph]],[110,146,120],{kind:"field",line:false,seed:814});ctx.restore();
  const [cx,cy]=K.clock;ctx.save();ctx.fillStyle="rgba(60,60,70,0.2)";ctx.beginPath();ctx.arc(cx+5,cy+7,62,0,TAU);ctx.fill();ctx.restore();wc_part(ctx,wc_ell(cx,cy,60,60,40),[52,54,60],1,{kind:"thing",lw:1,seed:815});
  wc_flat(ctx,wc_ell(cx,cy,50,50,40),[250,248,242],1,"face");ctx.save();ctx.strokeStyle="rgb(40,40,46)";ctx.lineCap="round";for(let k=0;k<12;k++){const a=k/12*TAU;ctx.lineWidth=k%3===0?4:2;ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*40,cy+Math.sin(a)*40);ctx.lineTo(cx+Math.cos(a)*46,cy+Math.sin(a)*46);ctx.stroke();}
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+20,cy-14);ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx-6,cy-38);ctx.stroke();ctx.restore();
  const bc=[[58,82,118],[160,62,66],[70,112,92],[204,170,92],[92,112,124],[120,92,140]];
  for(const [yy,n] of [[sy+150,7],[sy+330,7]]){wc_part(ctx,wc_rect(sx,yy,sw,16),[196,170,136],1,{lw:1,seed:816+yy});let bx=sx+18;
    for(let k=0;k<n;k++){const bw=48+(k%3)*6,bh=130-(k%2)*10;gv_binder(ctx,bx,yy-bh,bw,bh,bc[(k+(yy>400?2:0))%bc.length]);bx+=bw+4;}}
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1300,-60,700,[255,246,226],0.28);ctx.restore();}
// the counter, over her: its pale top, its front of oak slats; on it the register, a pen pot, a monitor with its back to us, a plant
function sp_paintFront18Desk(ctx){const [x0,top,fr]=SP_FD.desk,wood=[206,170,126];
  wc_contact(ctx,x0-20,W+40,H+10,1,0.3);
  wc_part(ctx,wc_rect(x0,fr,W+40-x0,H-fr+40),wood,1,{lw:1.2,seed:821});ctx.save();ctx.strokeStyle="rgba(110,70,36,0.26)";ctx.lineWidth=2;for(let xx=x0+40;xx<W;xx+=44){ctx.beginPath();ctx.moveTo(xx,fr+8);ctx.lineTo(xx,H);ctx.stroke();}
  ctx.strokeStyle="rgba(255,236,200,0.18)";ctx.lineWidth=4;for(let xx=x0+60;xx<W;xx+=44){ctx.beginPath();ctx.moveTo(xx,fr+8);ctx.lineTo(xx,H);ctx.stroke();}ctx.restore();
  ctx.save();const g=ctx.createLinearGradient(0,fr,0,fr+60);g.addColorStop(0,"rgba(60,36,16,0.3)");g.addColorStop(1,"rgba(60,36,16,0)");ctx.fillStyle=g;ctx.fillRect(x0,fr,W-x0,60);
  const g2=ctx.createLinearGradient(x0,0,x0+500,0);g2.addColorStop(0,"rgba(255,246,226,0.22)");g2.addColorStop(1,"rgba(255,246,226,0)");ctx.fillStyle=g2;ctx.fillRect(x0,fr,500,H-fr);ctx.restore();
  wc_part(ctx,[[x0+14,top],[W+40,top],[W+40,fr+8],[x0,fr+8]],[236,232,224],1,{lw:1.2,seed:822});ctx.save();ctx.fillStyle="rgba(255,255,255,0.6)";ctx.fillRect(x0,fr+6,W-x0,3);ctx.restore();
  wc_part(ctx,[[1700,top+6],[1770,top+6],[1758,top-36],[1712,top-36]],[110,114,122],1,{kind:"thing",lw:1,seed:823});wc_part(ctx,wc_rrPts(1630,top-196,210,160,10),[120,124,134],1,{kind:"thing",lw:1.2,seed:824});
  ctx.save();ctx.fillStyle="rgba(255,255,255,0.12)";ctx.fillRect(1640,top-186,190,4);ctx.restore();
  wc_part(ctx,[[1520,top+10],[1560,top+10],[1564,top-40],[1516,top-40]],[70,110,130],1,{kind:"thing",lw:1,seed:825});
  ctx.save();ctx.strokeStyle="rgb(40,40,50)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(1530,top-40);ctx.lineTo(1524,top-74);ctx.moveTo(1546,top-40);ctx.lineTo(1554,top-70);ctx.stroke();ctx.restore();
  wc_part(ctx,[[1860,top+10],[1910,top+10],[1918,top-40],[1852,top-40]],[204,120,90],1,{kind:"thing",lw:1,seed:826});
  for(let k=0;k<7;k++){const a=-Math.PI/2+(k-3)*0.32;wc_wash(ctx,[[1885,top-40],[1885+Math.cos(a-0.12)*70,top-40+Math.sin(a-0.12)*70],[1885+Math.cos(a)*96,top-40+Math.sin(a)*96],
    [1885+Math.cos(a+0.12)*70,top-40+Math.sin(a+0.12)*70]],[90,140,90],{kind:"leaf",lw:1,seed:827+k});}
  wc_part(ctx,[[1256,top+4],[1460,top+4],[1448,top-30],[1268,top-30]],[58,82,118],1,{kind:"cover",lw:1.2,seed:828});wc_flat(ctx,[[1262,top-6],[1454,top-6],[1450,top-14],[1266,top-14]],[244,240,228],1,"pages");}
// someone standing behind a counter, cut at its top (cutY), their feet at foot
function sp_behindAt(ctx,id,x,cutY,foot,s,o){ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();person(ctx,id,x,foot,s,o);ctx.restore();}
// a sheet of paper folded once, held in one hand at its corner: its middle at (x, y), turned rot; the thumbs of whoever holds it (hold,
// a list of [x, y, skin]); lines of writing show through it faintly
function sp_sheetHeld(ctx,x,y,rot,s,hold){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle="rgba(60,50,40,0.22)";ctx.fillRect(-46,-58,100,128);
  ctx.fillStyle="#fbfaf5";ctx.fillRect(-50,-64,100,128);ctx.strokeStyle="rgba(58,54,66,0.7)";ctx.lineWidth=2;ctx.strokeRect(-50,-64,100,128);
  ctx.strokeStyle="rgba(120,110,100,0.35)";ctx.beginPath();ctx.moveTo(-50,0);ctx.lineTo(50,0);ctx.stroke();ctx.strokeStyle="rgba(40,50,110,0.28)";ctx.lineWidth=2;
  for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-36,-44+k*12);ctx.lineTo(30-k*6,-44+k*12);ctx.stroke();}ctx.restore();
  for(const [hx,hy,skin] of hold){ctx.save();ctx.translate(hx,hy);ctx.scale(s,s);ell(ctx,0,0,12,15);litFill(ctx,skin,-12,-15,12,15);seam(ctx,skin,0.3,1.2);ctx.restore();}}
// the sheet held at the chest in both hands, its back to us (in the figure's units)
function sp_sheetBack(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-10);cx.rotate(0.03);
  cx.fillStyle="rgba(60,50,40,0.22)";cx.fillRect(-58,-74,124,160);cx.fillStyle="#fbfaf5";cx.fillRect(-62,-80,124,160);cx.strokeStyle="rgba(58,54,66,0.7)";cx.lineWidth=2;cx.strokeRect(-62,-80,124,160);
  cx.strokeStyle="rgba(120,110,100,0.3)";cx.beginPath();cx.moveTo(-62,0);cx.lineTo(62,0);cx.stroke();cx.restore();fingers(cx,P_,[[mx-60,my+4],[mx+60,my]]);}

// The counter from above: the customer's letter, open; the office's register, its record of processing open at its page; the reply.
// SP_DK: the letter [x, y, w, h, rot], the register's page (x, y, width), the reply [x, y, w, h]; SP_ROP: the page's title, its
// columns and rows
const SP_DK={letter:[70,104,560,740,-0.03],reg:[880,150,980],reply:[66,150,700,700]};
const SP_ROP={title:"Record of processing",cols:[["what data",0.34],["why",0.38],["who answers",0.28]],
  rows:[["name, address","to deliver orders","orders team"],["email","to send receipts","orders team"],["card details","to take payment","finance"],
    ["purchases","to suggest products","marketing"],["CVs","to hire staff","people team"],["payroll","to pay staff","finance"]]};
// the counter's top: pale stone, flecked, the window's light from the top left; the register's boards and spine under its page, and the
// edges of its pages; a pen
function sp_paintDesk18(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[232,228,220],{kind:"plaster",line:false,seed:851});
  const R=wc_rng(852);ctx.save();for(let i=0;i<900;i++){ctx.fillStyle="rgba("+(R()<0.5?"120,110,100":"255,255,255")+","+(0.08+R()*0.12).toFixed(3)+")";ctx.fillRect(R()*W,R()*H,1.5+R()*2.5,1.5+R()*2.5);}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,-100,-100,1500,[255,250,236],0.35);ctx.restore();
  const [rx,ry,rw]=SP_DK.reg,rh=gv_registerH({rows:SP_ROP.rows})*rw/1000;
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(50,40,30,0.3)";ctx.fillRect(rx-40,ry-8,rw+70,rh+44);ctx.restore();
  wc_wash(ctx,wc_rrPts(rx-46,ry-22,rw+72,rh+44,10),[58,82,118],{kind:"cover",lw:1.4,seed:853});wc_flat(ctx,wc_rect(rx-46,ry-22,34,rh+44),[40,58,88],1,"spine");
  for(let i=3;i>0;i--)wc_flat(ctx,wc_rect(rx+i*3,ry+i*3,rw,rh),[240-i*8,236-i*8,226-i*8],1,"pages");
  ctx.save();ctx.translate(1700,940);ctx.rotate(-0.5);ctx.fillStyle="rgba(40,30,20,0.25)";ctx.fillRect(-90,6,190,10);wc_part(ctx,wc_rrPts(-100,-6,200,14,6),[30,40,90],1,{kind:"thing",lw:1,seed:854});
  ctx.fillStyle="rgb(200,200,206)";ctx.fillRect(84,-6,16,14);ctx.restore();}
// the letter, open: its folds, the question in the customer's hand, a greeting and a name scribbled; a, how clearly its words show (as
// the reply covers it)
function sp_letterOpen(ctx,a){a=a==null?1:a;const [x,y,w,h,rot]=SP_DK.letter,ink=[34,44,92];ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.drawImage(gv_sheetPaper(w,h),-w/2-20,-h/2-20);
  ctx.strokeStyle="rgba(120,110,100,0.22)";ctx.lineWidth=2;for(const f of [1/3,2/3]){ctx.beginPath();ctx.moveTo(-w/2,-h/2+h*f);ctx.lineTo(w/2,-h/2+h*f);ctx.stroke();}
  ctx.translate(-w/2,-h/2);sp_scribble(ctx,60,96,170,1,861,false);if(a>0){wc_hand(ctx,"What do you hold",60,236,{size:56,col:ink,w:700,a});wc_hand(ctx,"about me?",60,316,{size:56,col:ink,w:700,a});}
  sp_scribble(ctx,60,420,380,1,862,false);sp_scribble(ctx,60,466,300,1,863,false);sp_scribble(ctx,w-260,620,180,1,864,true);ctx.restore();}
// the customer's rows lit plum, the colour of personal data in the series, one after another as u goes 0 to 1 (r: the register's rows)
function sp_ropLight(ctx,r,u){if(u<=0)return;const k=SP_DK.reg[2]/1000;ctx.save();ctx.globalCompositeOperation="multiply";
  for(let i=0;i<4;i++){const a=clamp(u*4-i,0,1);if(a<=0)continue;ctx.fillStyle=rgba(wc_lit(GV_CLASS.direct,0.74),easeCam(a));wc_tr(ctx,wc_rrPts(SP_DK.reg[0]+40*k,r.rows[i]-29*k,920*k*easeCam(a),58*k,8));ctx.fill();}
  ctx.restore();}
// the reply: slid in from below as d goes 0 to 1, its heading and rule; each of the customer's rows written onto it, what data and why,
// as qs[i] goes 0 to 1, while that row of the register (r) is ringed in plum; the stamp, "answered", landing as st goes 0 to 1
function sp_reply(ctx,r,d,qs,st){if(d<=0)return;const [x,y,w,h]=SP_DK.reply,dy=(1-easeCam(d))*900,k=SP_DK.reg[2]/1000;
  ctx.save();ctx.lineWidth=4;for(let i=0;i<4;i++){const b=Math.sin(Math.PI*clamp(qs[i],0,1));if(b<=0.01)continue;ctx.strokeStyle=rgba(GV_CLASS.direct,0.85*b);
    wc_tr(ctx,wc_rrPts(SP_DK.reg[0]+40*k,r.rows[i]-29*k,920*k,58*k,8));ctx.stroke();}ctx.restore();
  ctx.save();ctx.translate(0,dy);ctx.translate(x+w/2,y+h/2);ctx.rotate(0.05*(1-easeCam(d)));ctx.translate(-x-w/2,-y-h/2);ctx.drawImage(gv_sheetPaper(w,h),x-20,y-20);
  wc_T(ctx,"What we hold about you",x+50,y+96,{w:800,size:40,col:WC_DARK});ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(x+50,y+130,w-100,2);
  for(let i=0;i<4;i++){const e=easeCam(clamp(qs[i],0,1));if(e<=0)continue;for(let c=0;c<2;c++)wc_T(ctx,SP_ROP.rows[i][c],x+50+c*250,y+200+i*64+(1-e)*14,{w:600,size:30,col:WC_DARK,a:e});}
  ctx.restore();if(st>0)gv_stamp(ctx,x+500,y+610+dy,"answered",st,{size:40,col:GV.greenInk,rot:-0.06});}
// the register's cover, closed over its page with its name on its label, then swinging open from the spine as open goes 0 to 1, its
// name going with it (and fading, read only while it's closed)
function sp_regCover(ctx,open){if(open>=1)return;const [rx,ry,rw]=SP_DK.reg,rh=gv_registerH({rows:SP_ROP.rows})*rw/1000,x0=rx-46,y0=ry-22,w=rw+72,h=rh+44,col=[58,82,118],
    img=wc_kept("spRegCover",w+40,h+40,q=>{q.translate(20,20);wc_wash(q,wc_rrPts(0,0,w,h,10),col,{kind:"cover",lw:1.4,seed:857});const dk=wc_dim(col,0.35),cc=w*0.08;
      wc_flat(q,wc_rect(0,0,34,h),dk,1,"spine");wc_flat(q,[[w-cc,0],[w,0],[w,cc]],dk,1,"corner");wc_flat(q,[[w,h-cc],[w,h],[w-cc,h]],dk,1,"corner");
      wc_flat(q,wc_rect(w*0.2,h*0.3,w*0.64,150),WC_CARD,1,"label");}),e=easeCam(clamp(open,0,1)),sc=Math.cos(e*Math.PI/2);
  if(sc<0.02)return;ctx.save();ctx.translate(x0,0);ctx.scale(sc,1);ctx.drawImage(img,-20,y0-20);
  const la=clamp(1-e,0,1);if(la>0)wc_T(ctx,SP_ROP.title,w*0.52,y0+h*0.3+94,{w:800,size:50,align:"center",col:WC_DARK,a:la,deco:e>0});
  if(e>0){ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([150,150,170],0.6*e);ctx.fillRect(0,y0,w,h);}ctx.restore();}

/* ---------- 2024: a team training a model, the revised book, Europe's AI law, and the third edition's draft ---------- */
// The training table from above: on the left, a box of examples, "training data", photos of cats and dogs with their labels written on
// their white borders; on the right, the model, drawn as a notebook that copies what each example shows it. SP_TD: the box's front face
// [x, y, w, h] and how deep its open top looks; the notebook open [x, y, w, h]; a photo's size.
const SP_TD={box:[150,520,560,250],depth:250,book:[920,150,900,720],ph:[150,184]};
// the examples, in the order they're shown to the model: what the photo shows, and its label (the fifth's is wrong, and red)
const SP_EX=[["cat","cat"],["dog","dog"],["dog","dog"],["cat","cat"],["dog","cat"],["cat","cat"],["dog","dog"]];
// a cat's or a dog's face in a few pencil lines over a wash, its middle at (x, y), about 100 px across at s 1
function sp_pet(ctx,kind,x,y,s,ink,wash){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap="round";ctx.lineJoin="round";
  if(wash){ctx.fillStyle=rgba(wash,0.6);ctx.beginPath();if(kind==="cat"){ctx.moveTo(-36,-12);ctx.lineTo(-30,-46);ctx.lineTo(-10,-30);ctx.lineTo(10,-30);ctx.lineTo(30,-46);ctx.lineTo(36,-12);
      ctx.bezierCurveTo(44,26,22,40,0,40);ctx.bezierCurveTo(-22,40,-44,26,-36,-12);}else ctx.ellipse(0,4,36,34,0,0,TAU);ctx.fill();}
  ctx.strokeStyle=rgba(ink,0.92);ctx.fillStyle=rgba(ink,0.92);ctx.lineWidth=3.4;
  if(kind==="cat"){ctx.beginPath();ctx.moveTo(-36,-12);ctx.lineTo(-30,-46);ctx.lineTo(-10,-30);ctx.quadraticCurveTo(0,-33,10,-30);ctx.lineTo(30,-46);ctx.lineTo(36,-12);
      ctx.bezierCurveTo(44,26,22,40,0,40);ctx.bezierCurveTo(-22,40,-44,26,-36,-12);ctx.stroke();
    ctx.lineWidth=2.2;for(const k of [-1,1]){ctx.beginPath();ctx.moveTo(k*12,14);ctx.lineTo(k*48,8);ctx.moveTo(k*12,19);ctx.lineTo(k*48,22);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(-6,9);ctx.lineTo(6,9);ctx.lineTo(0,16);ctx.closePath();ctx.fill();ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(0,16);ctx.quadraticCurveTo(-5,24,-11,21);ctx.moveTo(0,16);ctx.quadraticCurveTo(5,24,11,21);ctx.stroke();}
  else{ctx.beginPath();ctx.ellipse(0,4,36,34,0,0,TAU);ctx.stroke();
    for(const k of [-1,1]){ctx.save();ctx.translate(k*36,2);ctx.rotate(k*0.3);ctx.beginPath();ctx.ellipse(0,10,11,26,0,0,TAU);ctx.fillStyle=rgba(ink,0.8);ctx.fill();ctx.restore();}
    ctx.beginPath();ctx.ellipse(0,13,9,6.5,0,0,TAU);ctx.fill();ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(0,19);ctx.lineTo(0,25);ctx.moveTo(-9,27);ctx.quadraticCurveTo(0,33,9,27);ctx.stroke();}
  for(const k of [-1,1]){ctx.beginPath();ctx.arc(k*14,-4,4.2,0,TAU);ctx.fill();}ctx.restore();}
// a photo from the box, its middle at (x, y), turned rot, scaled s: a white border, the animal on a pale ground, its label written on the
// border below, in red when it's wrong (o.deco: while it flies)
function sp_photo(ctx,x,y,rot,s,ex,a,deco){if(a<=0.01)return;const [kind,label]=ex,[w,h]=SP_TD.ph,bad=kind!==label;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);
  withA(ctx,a,()=>{ctx.fillStyle="rgba(50,40,30,0.22)";ctx.fillRect(-w/2+6,-h/2+9,w,h);ctx.fillStyle="#fbfaf6";ctx.fillRect(-w/2,-h/2,w,h);
    ctx.strokeStyle=rgba(bad?GV.red:[110,104,100],bad?0.95:0.5);ctx.lineWidth=bad?4:1.5;ctx.strokeRect(-w/2,-h/2,w,h);
    ctx.fillStyle=rgba(kind==="cat"?[212,224,236]:[222,232,206],1);ctx.fillRect(-w/2+10,-h/2+10,w-20,w-20);
    sp_pet(ctx,kind,0,-h/2+10+(w-20)/2+6,1.1,[64,54,50],kind==="cat"?[228,164,100]:[178,134,96]);
    wc_T(ctx,label,0,h/2-12,{w:700,size:28,align:"center",col:bad?GV.redInk:WC_DARK,deco});});ctx.restore();}
// where example i lands on the pile beside the notebook: [x, y, turn]
const sp_pile=i=>[815+((i*37)%5-2)*9,330+((i*53)%5-2)*8,((i*29)%7-3)*0.04];
// where the notebook copies example i: the left page first, two to a row, then the right
function sp_slot(i){const [bx,by,bw]=SP_TD.book,pw=bw/2,pg=i<6?0:1,j=i%6,c=j%2,r=Math.floor(j/2);return[bx+pg*pw+pw*(c?0.7:0.3),by+250+r*170];}
// the notebook's copy of example i, as a goes 0 to 1: the animal drawn in pencil from left to right, then its label written under it; the
// wrong one in red
function sp_copy(ctx,i,a){if(a<=0.01)return;const [kind,label]=SP_EX[i],[sx,sy]=sp_slot(i),bad=kind!==label,ink=bad?GV.redInk:[70,66,78],u=clamp(a/0.6,0,1);
  ctx.save();ctx.beginPath();ctx.rect(sx-70,sy-90,140*u,150);ctx.clip();sp_pet(ctx,kind,sx,sy-14,0.9,ink,null);ctx.restore();
  wc_hand(ctx,label,sx-24,sy+72,{size:36,col:ink,w:700,p:clamp((a-0.45)/0.55,0,1)});}
// the box from above and in front: its open top, the photos standing in it in rows, its front with its label
function sp_boxTop(ctx){const [x,y,w,h]=SP_TD.box,d=SP_TD.depth,kr=[196,158,112],R=wc_rng(921);
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(60,40,20,0.35)";ctx.fillRect(x-6,y-d+30,w+40,d+h);ctx.restore();
  wc_wash(ctx,[[x+34,y-d],[x+w-34,y-d],[x+w,y],[x,y]],wc_dim(kr,0.42),{kind:"thing",lw:1.4,seed:922});
  wc_wash(ctx,[[x+34,y-d],[x+w-34,y-d],[x+w-40,y-d+26],[x+40,y-d+26]],wc_dim(kr,0.15),{kind:"thing",line:false,seed:923});
  for(let r=0;r<5;r++){const yy=y-d+52+r*44,inset=34*(1-(yy-(y-d))/d);for(let i=0;i<4;i++){const cx=x+inset+40+i*((w-2*inset-80)/3)+(R()-0.5)*30,ph=SP_EX[(r*4+i)%SP_EX.length];
    ctx.save();ctx.translate(cx,yy);ctx.rotate((R()-0.5)*0.12);ctx.fillStyle="rgba(40,30,20,0.25)";ctx.fillRect(-58,-4,120,10);ctx.fillStyle="#f6f4ee";ctx.fillRect(-60,-30,120,40);
      ctx.fillStyle=rgba(ph[0]==="cat"?[212,224,236]:[222,232,206],1);ctx.fillRect(-52,-24,104,34);ctx.strokeStyle="rgba(110,104,100,0.5)";ctx.lineWidth=1.2;ctx.strokeRect(-60,-30,120,40);ctx.restore();}}
  wc_wash(ctx,wc_rect(x,y,w,h),kr,{kind:"cover",lw:1.5,seed:924});wc_flat(ctx,wc_rect(x,y,w,16),lighten(kr,0.12),1,"rim");
  wc_flat(ctx,wc_rect(x+w/2-170,y+70,340,110),[248,246,238],1,"label");wc_T(ctx,"training data",x+w/2,y+142,{w:700,size:44,align:"center",col:WC_DARK});
  ctx.save();ctx.fillStyle="rgba(40,28,16,0.5)";rr(ctx,x+w/2-50,y+204,100,22,11);ctx.fill();ctx.restore();}
// the notebook open from above: two pages, the gutter, the edges of the pages under them, its ribbon's tail; "model" written at the top left
function sp_notebook(ctx){const [x,y,w,h]=SP_TD.book,pw=w/2;
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(60,40,20,0.3)";ctx.fillRect(x+10,y+24,w,h);ctx.restore();
  wc_wash(ctx,wc_rrPts(x-14,y-10,w+28,h+24,10),[64,74,96],{kind:"cover",lw:1.4,seed:931});
  for(let i=3;i>0;i--){wc_flat(ctx,wc_rect(x-i*3,y+i*2,pw,h),[236-i*6,232-i*6,222-i*6],1,"pages");wc_flat(ctx,wc_rect(x+pw+i*3,y+i*2,pw,h),[236-i*6,232-i*6,222-i*6],1,"pages");}
  ctx.drawImage(gv_sheetPaper(pw,h),x-20,y-20);ctx.drawImage(gv_sheetPaper(pw,h),x+pw-20,y-20);
  const g=ctx.createLinearGradient(x+pw-60,0,x+pw+60,0);g.addColorStop(0,"rgba(90,70,50,0)");g.addColorStop(0.5,"rgba(90,70,50,0.3)");g.addColorStop(1,"rgba(90,70,50,0)");ctx.fillStyle=g;ctx.fillRect(x+pw-60,y,120,h);
  ctx.save();ctx.strokeStyle="rgba(120,150,190,0.22)";ctx.lineWidth=1.5;for(let ly=y+150;ly<y+h-20;ly+=42){for(const px of [x+30,x+pw+30]){ctx.beginPath();ctx.moveTo(px,ly);ctx.lineTo(px+pw-60,ly);ctx.stroke();}}ctx.restore();
  wc_flat(ctx,[[x+pw-8,y+h-20],[x+pw+12,y+h-20],[x+pw+44,y+h+76],[x+pw+28,y+h+64],[x+pw+20,y+h+84]],[150,52,60],1,"ribbon");
  wc_hand(ctx,"model",x+60,y+100,{size:56,col:[40,48,92],w:700});ctx.fillStyle="rgba(40,48,92,0.8)";ctx.fillRect(x+60,y+118,160,4);}
// the training table, from above: pale oak, its grain, the light from the top; the box, the notebook, a laptop's keyboard, a pencil, a cup
function sp_paintDesk24(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[226,206,172],{kind:"ground",line:false,seed:911});
  const R=wc_rng(912);ctx.save();ctx.strokeStyle="rgba(150,110,70,0.16)";ctx.lineWidth=2;for(let i=0;i<34;i++){const y0=R()*H;ctx.beginPath();ctx.moveTo(-20,y0);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y0+10*Math.sin(x/260+i)+R()*3);ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,700,-120,1300,[255,248,232],0.35);ctx.restore();
  // a laptop's keyboard at the top edge, its screen folded up out of sight
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(40,30,20,0.3)";ctx.fillRect(330,-40,520,150);ctx.restore();wc_wash(ctx,wc_rrPts(320,-60,520,160,14),[188,192,200],{kind:"thing",lw:1.3,seed:913});
  ctx.fillStyle="rgba(60,64,76,0.35)";for(let r=0;r<3;r++)for(let k=0;k<12;k++)ctx.fillRect(344+k*41,-30+r*34,34,26);ctx.fillRect(500,74,170,18);
  sp_boxTop(ctx);sp_notebook(ctx);
  // a pencil by the notebook, a cup
  ctx.save();ctx.translate(1700,960);ctx.rotate(-0.35);ctx.fillStyle="rgba(40,30,20,0.25)";ctx.fillRect(-120,8,250,10);wc_part(ctx,wc_rect(-130,-6,230,14),[236,186,70],1,{kind:"thing",lw:1,seed:914});
  wc_flat(ctx,[[100,-6],[130,1],[100,8]],[226,200,160],1,"tip");ctx.fillStyle="rgb(50,50,56)";ctx.beginPath();ctx.moveTo(122,-1);ctx.lineTo(130,1);ctx.lineTo(122,3);ctx.fill();ctx.restore();
  ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(40,30,20,0.3)";ctx.beginPath();ctx.arc(1840,1010,80,0,TAU);ctx.fill();ctx.restore();
  wc_wash(ctx,wc_ell(1830,1000,74,74,40),[70,110,130],{kind:"thing",lw:1.4,seed:915});wc_wash(ctx,wc_ell(1830,1000,58,58,40),[120,84,60],{kind:"thing",line:false,seed:916});}
// The team's room, from across a high table: a brick wall on the left with plants, a wide window onto trees, a glass building and wind
// turbines on the far hills, a screen for calls on the right. The three stand behind the table (team24table, a layer of its own), the box
// of examples on it. SP_T4: the floor's line, the window [x, y, w, h], the table's top and its ends, who stands where (and the scale), the
// line their feet stand on, the box's size and how far it's lifted.
const SP_T4={fy:840,win:[700,70,800,560],top:772,ends:[180,1740],stand:[[560,"spMl1"],[960,"spMl3"],[1360,"spMl2"]],s:1.0,foot:1046,bw:[240,104],lift:28};
const SP_WALL24=[234,231,224];
// an arm's angles [upper, fore] that put side s's hand (s -1 left, 1 right) at (tx, ty), in the figure's units from its feet, the elbow kept
// in by the body: so a held box hides the arm, and only the hands show at its sides
function sp_ik(id,s,tx,ty){const sx=PEOPLE[id].build.sh-12,dx=s*tx-sx,dy=ty+416,D=Math.hypot(dx,dy),L1=108,L2=113,
    al=Math.acos(clamp((L1*L1+D*D-L2*L2)/(2*L1*D),-1,1)),a0=Math.atan2(dx,dy)-al,ex=Math.sin(a0)*L1,ey=Math.cos(a0)*L1;return[a0,Math.atan2(dx-ex,dy-ey)];}
// the hands at the sides of the box in front of the one in the middle, on the table or lifted
function sp_boxArms(up){const K=SP_T4,id=K.stand[1][1],k=K.s*PEOPLE[id].build.h,hx=(K.bw[0]/2-14)/k,hy=(K.top-K.bw[1]/2-(up?K.lift:0)-K.foot)/k;
  return{L:sp_ik(id,-1,-hx,hy),R:sp_ik(id,1,hx,hy)};}
Object.assign(POSE,{
  // the one in the middle: her hands on the box, then lifting it and asking the one on her right, then turning to the one on her left
  spBoxRest:Object.assign({feet:26,shift:0,tilt:0.02,turn:0,gaze:[0,0.7],look:1.5},sp_boxArms(false)),
  spBoxUp:Object.assign({feet:26,shift:-2,tilt:-0.04,turn:-0.16,gaze:[-0.8,0],look:0},sp_boxArms(true)),
  spBoxUpR:Object.assign({feet:26,shift:2,tilt:0.04,turn:0.16,gaze:[0.8,0],look:0},sp_boxArms(true)),
  // looking towards the right of the picture, or the left (the other way for one drawn mirrored); asking with an open hand held out
  spEyesR:{L:[0.12,-0.08],R:[0.14,-0.06],feet:26,shift:0,tilt:0.02,turn:0.14,gaze:[0.75,0.1],look:0},
  spEyesL:{L:[0.12,-0.08],R:[0.14,-0.06],feet:26,shift:0,tilt:-0.02,turn:-0.14,gaze:[-0.75,0.1],look:0},
  spAskOpen:{L:[0.12,-0.06],R:[0.42,1.95],hand:"open",feet:28,shift:3,tilt:-0.06,turn:0.18,gaze:[0.8,0],look:0}});
// the view: sky, the far hills with three wind turbines, a glass building, trees close by
function sp_view24(ctx,x,y,w,h){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const sky=ctx.createLinearGradient(0,y,0,y+h);sky.addColorStop(0,"rgb(160,198,228)");sky.addColorStop(1,"rgb(232,238,236)");
  ctx.fillStyle=sky;ctx.fillRect(x,y,w,h);ctx.save();ctx.globalCompositeOperation="screen";for(const [cx,cy,r] of [[x+160,y+90,110],[x+300,y+70,80],[x+620,y+120,120]])wc_glowAt(ctx,cx,cy,r,[255,255,255],0.5);ctx.restore();
  const hz=y+h*0.6;wc_wash(ctx,[[x-20,hz],[x+150,hz-46],[x+330,hz-30],[x+520,hz-60],[x+700,hz-36],[x+w+20,hz-50],[x+w+20,hz+40],[x-20,hz+40]],[150,176,170],{depth:0.45,kind:"land",line:false,seed:941});
  for(const [tx,s] of [[x+250,1],[x+420,0.8],[x+560,0.9]]){const ty=hz-50*s-10;ctx.strokeStyle="rgba(236,240,240,0.95)";ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(tx,ty+90*s);ctx.lineTo(tx,ty);ctx.stroke();
    for(let k=0;k<3;k++){const a=-Math.PI/2+k*TAU/3+0.4;ctx.lineWidth=2.4*s;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(a)*40*s,ty+Math.sin(a)*40*s);ctx.stroke();}}
  // a glass building, its floors catching the sky
  const gx=x+w-330,gy=y+h*0.18;wc_part(ctx,wc_rect(gx,gy,230,h),[150,176,196],0.85,{lw:1.1,seed:942});ctx.fillStyle="rgba(255,255,255,0.35)";for(let fy2=gy+20;fy2<y+h;fy2+=34)ctx.fillRect(gx+6,fy2,218,3);
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,gx+60,gy+80,120,[255,255,255],0.35);ctx.restore();
  sp_treeLine(ctx,x-30,x+w+30,y+h-150,140,947);ctx.restore();}
// the room
function sp_paintTeam24(ctx){const K=SP_T4,[wx,wy,ww,wh]=K.win;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,K.fy+40),SP_WALL24,{kind:"plaster",line:false,seed:951});
  wc_wash(ctx,wc_rect(-40,K.fy,W+80,H-K.fy+40),[168,166,160],{kind:"ground",line:false,seed:952});
  // the brick wall, up to the window
  const R=wc_rng(953);ctx.save();ctx.beginPath();ctx.rect(0,0,640,K.fy);ctx.clip();wc_wash(ctx,wc_rect(-40,-40,720,K.fy+40),[172,98,74],{kind:"plaster",line:false,seed:954});
  for(let r=0,yy=0;yy<K.fy;r++,yy+=38){for(let xx=(r%2)*-50;xx<660;xx+=100){const v=(R()-0.5)*0.16;ctx.fillStyle=rgba(v>0?lighten([172,98,74],v):wc_dim([172,98,74],-v),0.55);ctx.fillRect(xx+3,yy+3,94,32);}
    ctx.fillStyle="rgba(230,220,206,0.5)";ctx.fillRect(0,yy+35,640,4);}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="multiply";const sh=ctx.createLinearGradient(560,0,660,0);sh.addColorStop(0,"rgba(120,100,90,0)");sh.addColorStop(1,"rgba(120,100,90,0.35)");ctx.fillStyle=sh;ctx.fillRect(560,0,100,K.fy);ctx.restore();
  // a shelf on the bricks with plants on it, one trailing down
  wc_part(ctx,wc_rect(80,300,420,18),[220,206,186],1,{kind:"thing",lw:1.1,seed:955});
  for(const [px,c] of [[140,[84,140,96]],[300,[110,150,90]],[430,[70,120,90]]]){wc_wash(ctx,wc_rrPts(px-34,232,68,68,8),[226,222,214],{kind:"thing",lw:1.2,seed:px});
    for(let k=0;k<9;k++){const a=-Math.PI/2+(k-4)*0.32,l=60+R()*40;wc_flat(ctx,[[px,236],[px+Math.cos(a-0.12)*l*0.6,236+Math.sin(a-0.12)*l*0.6],[px+Math.cos(a)*l,236+Math.sin(a)*l],[px+Math.cos(a+0.12)*l*0.6,236+Math.sin(a+0.12)*l*0.6]],c,0.9,"leaf");}}
  ctx.save();ctx.strokeStyle="rgba(70,120,80,0.85)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(300,300);ctx.bezierCurveTo(310,380,280,460,300,560);ctx.stroke();ctx.restore();
  for(let k=0;k<9;k++){const yy=330+k*26;wc_flat(ctx,wc_ell(300+12*Math.sin(k*1.7)+(k%2?14:-14),yy,14,9,12),[96,150,96],0.9,"leaf");}
  // the window, its light, the frame
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh*0.6,900,[255,250,236],0.3);ctx.restore();sp_view24(ctx,wx,wy,ww,wh);
  for(const r of [wc_rect(wx-14,wy-14,ww+28,14),wc_rect(wx-14,wy-14,14,wh+28),wc_rect(wx+ww,wy-14,14,wh+28),wc_rect(wx+ww/2-5,wy,10,wh)])wc_part(ctx,r,[64,68,76],1,{lw:1.1});
  wc_part(ctx,wc_rect(wx-24,wy+wh,ww+48,16),[220,218,212],1,{lw:1.2});
  // a screen for calls, off, on the right wall, and a tall plant in the corner
  ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(40,40,50,0.25)";ctx.fillRect(1570,150,330,200);ctx.restore();wc_part(ctx,wc_rrPts(1560,140,330,196,8),[44,48,58],1,{kind:"thing",lw:1.2,seed:956});
  ctx.save();ctx.globalCompositeOperation="screen";const gl=ctx.createLinearGradient(1560,140,1890,336);gl.addColorStop(0,"rgba(255,255,255,0)");gl.addColorStop(0.45,"rgba(255,255,255,0.12)");gl.addColorStop(0.55,"rgba(255,255,255,0)");ctx.fillStyle=gl;ctx.fillRect(1566,146,318,184);ctx.restore();
  gv_plant(ctx,1840,K.fy+30,1.5);}
// the high table, in front of them: its top, pale, a wooden edge, metal legs; a laptop seen from behind, two cups, a tablet lying flat
function sp_paintTeam24Table(ctx){const K=SP_T4,[l,r]=K.ends,y=K.top;
  for(const lx of [l+40,r-70])wc_part(ctx,wc_rect(lx,y+30,30,H-y),[120,124,134],1,{kind:"thing",lw:1.1,seed:lx});
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(40,40,40,0.25)";ctx.fillRect(l,y+30,r-l,24);ctx.restore();
  wc_wash(ctx,wc_rect(l,y,r-l,30),[244,242,236],{kind:"thing",lw:1.3,seed:961});wc_flat(ctx,wc_rect(l,y+22,r-l,8),[206,176,136],1,"edge");
  wc_part(ctx,[[290,y],[520,y],[506,y-150],[304,y-150]],[176,180,190],1,{kind:"thing",lw:1.2,seed:291});
  ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(310,y-146,190,4);ctx.fillStyle="rgba(230,232,238,0.8)";ctx.beginPath();ctx.arc(405,y-80,10,0,TAU);ctx.fill();
  gv_mug(ctx,700,y,[226,226,222]);gv_mug(ctx,1600,y,[70,110,130],true);
  wc_part(ctx,wc_rect(1150,y-8,190,8),[60,62,70],1,{kind:"thing",lw:1,seed:962});}
// the box of examples from the front, its bottom's middle at (x, y): the photos standing up out of it, the box, its label, a hand hole
function sp_boxFront(ctx,x,y,rot){const [bw,bh]=SP_T4.bw,kr=[196,158,112];ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);
  const R=wc_rng(971);for(let i=0;i<6;i++){const px=-bw/2+26+i*((bw-52)/5),ph=SP_EX[i%SP_EX.length],up=10+R()*10;ctx.save();ctx.translate(px,-bh+4);ctx.rotate((R()-0.5)*0.2);
    ctx.fillStyle="#f6f4ee";ctx.fillRect(-26,-up,52,up+20);ctx.fillStyle=rgba(ph[0]==="cat"?[212,224,236]:[222,232,206],1);ctx.fillRect(-21,-up+5,42,up+10);ctx.restore();}
  ctx.fillStyle="rgba(40,30,20,0.25)";ctx.fillRect(-bw/2+6,-6,bw,10);wc_wash(ctx,wc_rect(-bw/2,-bh,bw,bh),kr,{kind:"cover",lw:1.4,seed:972});wc_flat(ctx,wc_rect(-bw/2,-bh,bw,10),lighten(kr,0.12),1,"rim");
  wc_flat(ctx,wc_rect(-100,-bh+24,200,50),[248,246,238],1,"label");wc_T(ctx,"training data",0,-bh+59,{w:700,size:28,align:"center",col:WC_DARK});
  ctx.fillStyle="rgba(40,28,16,0.5)";rr(ctx,-28,-bh+84,56,12,6);ctx.fill();ctx.restore();}
// a hand gripping the box's side at (x, y), side -1 the left, 1 the right: the palm on the box's side, the fingers over its front
function sp_gripHand(ctx,x,y,side,skin){ctx.save();ctx.translate(x,y);ctx.scale(side,1);ell(ctx,6,0,12,17);litFill(ctx,skin,-6,-17,18,17);seam(ctx,skin,0.32,1.2);
  for(let i=0;i<3;i++){ell(ctx,-4,-9+i*9,7,4.4);litFill(ctx,skin,-11,-14+i*9,3,-4+i*9);seam(ctx,skin,0.25,1);}ctx.restore();}
// the team at the table: o.p[id] = [pose, pose2, mix, expr, mirrored] for each; o.hold, how far she has reached for the box (0 to 1),
// o.lift, how far it's lifted (0 to 1), o.rot, how it's turned
function sp_team24(ctx,tt,o){const K=SP_T4;K.stand.forEach(([sx,id],i)=>{const p=o.p[id];person(ctx,id,sx,K.foot,K.s,{t:tt+i*1.1,pose:p[0],pose2:p[1],mix:p[2],expr:p[3]||"calm",flip:!!p[4]});});
  ctx.drawImage(gv_place("team24table"),0,0);
  const [bx,id]=K.stand[1],k=K.s*PEOPLE[id].build.h,lift=K.lift*easeCam(clamp(o.lift||0,0,1)),by=K.top-lift,rot=o.rot||0;sp_boxFront(ctx,bx,by,rot);
  const g=clamp(((o.hold||0)-0.6)/0.4,0,1);if(g>0)withA(ctx,g,()=>{for(const sd of [-1,1]){const hx=sd*(K.bw[0]/2+2),hy=-K.bw[1]/2;
    sp_gripHand(ctx,bx+hx*Math.cos(rot)-hy*Math.sin(rot),by+hx*Math.sin(rot)+hy*Math.cos(rot),sd,PEOPLE[id].skin);}});}
// The shelf in 2024: the binders and flyers gone, the editions moved along to make room: the first, the second, the revision of 2024;
// then the third edition's draft leans on them, a tag hanging beside it. SP_SH4: the books' middles, the draft's foot (its bottom-left
// corner, against the revision) and its size, how far it leans.
const SP_SH4={books:[400,740,1080],draft:[1262,300,410,0.06]};
// the revision of 2024: navy, "Second Edition", "Revised"
SP_ED[3]={col:[46,58,88],sub:"Second Edition",sub2:"Revised"};
// the draft of the third edition, leaning on the books: a stack of printed pages held by a binder clip, "DAMA-DMBOK 3.0" on the first,
// "draft" written under it in pencil. o.notes: the three sticky notes (0 to 1 each), o.lift: its pages lifting (0 to 1), o.tag: the tag
// dropping in (0 to 1); o.y: how far up from the shelf it's still being lifted, o.lean: how far it has tipped onto the books (0 to 1)
const SP_NOTES3=[["AI governance",GV_NOTE[0],-0.05,[24,252]],["data ethics",GV_NOTE[1],0.04,[118,298]],["sustainability",GV_NOTE[3],-0.03,[30,344]]];
function sp_draft(ctx,o){o=o||{};const [x0,w,h,lean]=SP_SH4.draft,y0=SP_SH.top-(o.y||0),th=lean*(o.lean==null?1:o.lean),lf=o.lift||0;
  ctx.save();ctx.translate(x0,y0);ctx.rotate(-th);
  // the pages under the first, each a little out of line, fanning as they lift
  for(let i=3;i>=1;i--){const f=lf*(0.5+0.5*Math.sin(i*1.7+lf*5));ctx.save();ctx.translate(w/2,-h);ctx.rotate(0.012*i+0.045*f*i);ctx.translate(-w/2,h);
    ctx.drawImage(gv_sheetPaper(w,h),-20+i*2,-h-20+i*3);ctx.restore();}
  ctx.drawImage(gv_sheetPaper(w,h),-20,-h-20);
  wc_T(ctx,"DAMA-DMBOK",w/2,-h+96,{w:800,size:30,align:"center",col:WC_DARK});
  wc_T(ctx,"3.0",w/2,-h+176,{w:800,size:72,align:"center",col:WC_DARK});
  wc_hand(ctx,"draft",w/2-46,-h+232,{size:40,col:[60,70,120],w:700});
  // the notes, small, stuck on one by one
  SP_NOTES3.forEach(([s,col,rot,[nx,ny]],i)=>{const p=(o.notes||[])[i]||0;if(p<=0.01)return;const k=1.15-0.15*spring(clamp(p,0,1)),nw=168,nh=52;
    ctx.save();ctx.translate(nx+nw/2,-h+ny+nh/2);ctx.rotate(rot);ctx.scale(k,k);ctx.globalAlpha*=clamp(p*3,0,1);
    ctx.save();ctx.filter="blur(4px)";ctx.fillStyle="rgba(70,60,40,0.25)";ctx.fillRect(-nw/2+4,-nh/2+6,nw,nh);ctx.restore();
    wc_wash(ctx,wc_rect(-nw/2,-nh/2,nw,nh),col,{kind:"card",line:false,seed:960+i});ctx.fillStyle="rgba(255,255,255,0.2)";ctx.fillRect(-nw/2,-nh/2,nw,10);
    sp_hand(ctx,s,-nw/2+12,9,{size:22,col:[44,52,90],w:700,deco:o.deco});ctx.restore();});
  // the first page's corner curling up as the pages lift
  const cu=lf*(0.6+0.4*Math.sin(lf*7));if(cu>0.02){const c=40+70*cu;ctx.save();ctx.fillStyle="rgba(60,50,40,0.18)";ctx.beginPath();ctx.moveTo(w,-c);ctx.lineTo(w-c,0);ctx.lineTo(w,0);ctx.fill();
    ctx.fillStyle=rgba([234,232,226],1);ctx.beginPath();ctx.moveTo(w,-c);ctx.lineTo(w-c,0);ctx.lineTo(w-c*0.62,-c*0.62);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(110,104,100,0.45)";ctx.lineWidth=1.2;ctx.stroke();ctx.restore();}
  // the binder clip at the top, its wire handles folded up
  ctx.save();ctx.strokeStyle="rgb(170,176,186)";ctx.lineWidth=4;ctx.lineJoin="round";for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(w/2+s*22,-h+4);ctx.lineTo(w/2+s*12,-h-34);ctx.lineTo(w/2+s*30,-h-34);ctx.stroke();}ctx.restore();
  wc_part(ctx,[[w/2-38,-h-10],[w/2+38,-h-10],[w/2+34,-h+20],[w/2-34,-h+20]],[40,40,46],1,{kind:"thing",lw:1,seed:977});
  ctx.restore();}
// handwriting as wc_hand writes it, which can be marked as decoration (o.deco): where a wider shot shows words read close before
function sp_hand(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;const sub=s.slice(0,Math.ceil(s.length*clamp(p,0,1)));ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.2,1,0,0);
  wc_T(ctx,sub,0,0,{size:o.size||32,w:o.w||600,col:o.col||WCP.parchInk,align:o.align,a:o.a,deco:o.deco});ctx.restore();}
// where the draft's clip's right handle is, on the page: for the tag's string
function sp_draftHandle(f){const [x0,w,h,l0]=SP_SH4.draft,lean=l0*(f==null?1:f),px=w/2+30,py=-h-34;return[x0+px*Math.cos(lean)+py*Math.sin(lean),SP_SH.top-px*Math.sin(lean)+py*Math.cos(lean)];}
// a manila tag on a string from the clip's handle, hanging beside the draft, "planned for 2027"; p: dropping in and swinging to rest
function sp_tag(ctx,p,f,deco){if(p<=0.01)return;const [hx,hy]=sp_draftHandle(f),sw=0.35*Math.exp(-3*p)*Math.cos(p*9)*(p<1?1:0),drop=(1-easeCam(clamp(p*2.5,0,1)))*-60,
    ax=hx+132,ay=hy+92+drop,tw_=236,thh=64,rot=0.2+sw;
  ctx.save();ctx.globalAlpha*=clamp(p*4,0,1);ctx.strokeStyle="rgba(200,190,170,0.95)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(hx,hy);ctx.quadraticCurveTo(hx+70,hy-6+drop*0.3,ax+4,ay);ctx.stroke();
  ctx.translate(ax,ay);ctx.rotate(rot);ctx.save();ctx.filter="blur(4px)";ctx.fillStyle="rgba(50,40,30,0.25)";ctx.fillRect(-10,-thh/2+6,tw_,thh);ctx.restore();
  wc_part(ctx,[[0,-thh/2+14],[18,-thh/2],[tw_,-thh/2],[tw_,thh/2],[18,thh/2],[0,thh/2-14]],[222,196,150],1,{kind:"thing",lw:1.2,seed:978});
  ctx.fillStyle="rgba(250,246,236,1)";ctx.beginPath();ctx.arc(16,0,6,0,TAU);ctx.fill();ctx.strokeStyle="rgba(150,120,80,0.8)";ctx.lineWidth=2;ctx.stroke();
  sp_hand(ctx,"planned for 2027",34,9,{size:24,col:[60,46,30],w:700,deco});ctx.restore();}
// the shelf in 2024 (shelf24): the bookcase as in 2009, its middle shelf cleared for the editions
function sp_paintShelf24(ctx){sp_paintShelf(ctx,{binders:0,flyers:false,bookend:false});}
// Europe's AI law, printed, on a desk: a page open at Article 10, its title lit in gold by a highlighter. SP_AC: the page [x, y, w, h, rot],
// the title's line; SP_AC.p2: the opening of paragraph 2, as the law words it (the rest of the page is print too small to read)
const SP_AC={page:[520,36,880,1010,-0.012],head:"AI Act · Regulation (EU) 2024/1689",art:"Article 10",title:"Data and data governance",ty:250,
  p2:["2. Training, validation and testing data sets","shall be subject to data governance and","management practices appropriate for the","intended purpose of the high-risk AI system."]};
// the desk: grey-blue laminate, a little light from the top; the page, blank, its words drawn every frame; reading glasses, a pen
function sp_paintAct24(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[198,204,208],{kind:"plaster",line:false,seed:981});
  const R=wc_rng(982);ctx.save();for(let i=0;i<500;i++){ctx.fillStyle="rgba("+(R()<0.5?"110,116,124":"255,255,255")+","+(0.05+R()*0.08).toFixed(3)+")";ctx.fillRect(R()*W,R()*H,2+R()*3,1.5+R()*2);}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,900,-160,1300,[255,250,240],0.3);ctx.restore();
  const [x,y,w,h,rot]=SP_AC.page;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(40,46,56,0.3)";ctx.fillRect(10,24,w,h);ctx.restore();
  for(let i=3;i>0;i--)wc_flat(ctx,wc_rect(i*4,i*3,w,h),[238-i*6,238-i*6,234-i*6],1,"pages");ctx.drawImage(gv_sheetPaper(w,h),-20,-20);ctx.restore();
  // reading glasses folded on the left, a pen on the right
  ctx.save();ctx.translate(250,760);ctx.rotate(0.25);ctx.strokeStyle="rgba(40,40,48,0.9)";ctx.lineWidth=5;for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(s*58,0,50,40,0,0,TAU);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-10,-6);ctx.quadraticCurveTo(0,-16,10,-6);ctx.stroke();ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-104,-12);ctx.lineTo(96,-40);ctx.moveTo(104,-12);ctx.lineTo(-90,-44);ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.18)";for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(s*58-14,-12,16,10,-0.4,0,TAU);ctx.fill();}ctx.restore();
  ctx.save();ctx.translate(1620,860);ctx.rotate(-0.6);ctx.fillStyle="rgba(40,30,20,0.22)";ctx.fillRect(-100,8,210,10);wc_part(ctx,wc_rrPts(-110,-7,220,15,7),[34,40,58],1,{kind:"thing",lw:1,seed:983});
  ctx.fillStyle="rgb(196,198,204)";ctx.fillRect(70,-7,20,15);ctx.restore();}
// the page's words, and the gold over the title as lit goes 0 to 1 (a highlighter's stroke, from left to right)
function sp_actWords(ctx,lit){const [x,y,w,h,rot]=SP_AC.page,ty=SP_AC.ty;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  wc_T(ctx,SP_AC.head,60,74,{w:600,size:28,col:WC_MUTED});ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(60,96,w-120,2);
  const tw_=tw(ctx,SP_AC.title,44,800);if(lit>0.01){const x0=w/2-tw_/2-18,x1=x0+(tw_+36)*clamp(lit,0,1);ctx.save();ctx.globalCompositeOperation="multiply";
    ctx.fillStyle=rgba([250,214,110],0.85);ctx.beginPath();ctx.moveTo(x0,ty-40);ctx.lineTo(x1,ty-42);ctx.lineTo(x1+4,ty+14);ctx.lineTo(x0+2,ty+12);ctx.closePath();ctx.fill();ctx.restore();}
  wc_T(ctx,SP_AC.art,w/2,ty-62,{w:500,size:34,align:"center",col:WC_DARK});wc_T(ctx,SP_AC.title,w/2,ty,{w:800,size:44,align:"center",col:mix(WC_DARK,GV.goldInk,0.35*clamp(lit,0,1))});
  gv_lines(ctx,60,312,w-120,4,44);SP_AC.p2.forEach((l,i)=>wc_T(ctx,l,60,520+i*44,{w:500,size:30,col:WC_DARK}));gv_lines(ctx,60,700,w-120,1,44);gv_lines(ctx,100,744,w-160,2,44);
  ctx.restore();}
// where the highlighter's tip is, on the screen, as lit goes 0 to 1
function sp_actTip(ctx,lit){const [x,y,w,h,rot]=SP_AC.page,ty=SP_AC.ty,tw_=tw(ctx,SP_AC.title,44,800),px=w/2-tw_/2-18+(tw_+36)*clamp(lit,0,1),py=ty-14,cx=x+w/2,cy=y+h/2,
    dx=px-w/2,dy=py-h/2;return[cx+dx*Math.cos(rot)-dy*Math.sin(rot),cy+dx*Math.sin(rot)+dy*Math.cos(rot)];}
// a hand holding a highlighter as one writes, its tip at (x, y), coming in from the bottom right: the pen, gold; the index finger along
// it, the thumb under it, the back of the hand; the sleeve
function sp_highlighter(ctx,x,y,a){if(a<=0.01)return;const sk=[214,170,136],sl=[70,84,110];ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.translate(x,y);ctx.rotate(0.62);
  ctx.save();ctx.filter="blur(12px)";ctx.fillStyle="rgba(30,30,40,0.22)";ctx.fillRect(60,30,1640,100);ctx.restore();
  wc_part(ctx,[[0,-6],[24,-15],[24,15],[0,6]],[236,190,60],1,{kind:"thing",lw:1,seed:984});wc_part(ctx,wc_rrPts(24,-16,230,32,8),[244,206,80],1,{kind:"thing",lw:1.1,seed:985});
  ctx.beginPath();ctx.moveTo(214,-50);ctx.lineTo(1700,-84);ctx.lineTo(1700,92);ctx.lineTo(214,46);ctx.closePath();litFill(ctx,sl,214,-84,1700,92);seam(ctx,sl,0.3,1.2);
  ell(ctx,176,-4,74,54,0.08);litFill(ctx,sk,102,-58,250,50);seam(ctx,sk,0.35,1.4);
  ctx.save();ctx.strokeStyle=rgba(darken(sk,0.35),0.4);ctx.lineWidth=2;ctx.lineCap="round";for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(150+i*4,-34+i*22,9,-1.2,1.2);ctx.stroke();}ctx.restore();
  ell(ctx,92,-17,52,12,-0.05);litFill(ctx,sk,40,-29,144,-5);seam(ctx,sk,0.32,1.2);ell(ctx,50,-18,9,7,0);ctx.fillStyle=rgba(lighten(sk,0.3),0.9);ctx.fill();
  ell(ctx,104,17,40,12,0.12);litFill(ctx,sk,64,5,144,29);seam(ctx,sk,0.32,1.2);ctx.restore();}

// ---- 8 · Still at the centre: a pencil sketch of each time the question was asked, and the question; the newest copy of the book, open at
// its wheel; the university, and Yusuf's office before he comes ----
// a pencil sketch of a picture the film has shown: paint(q) composes it at full size, crop [x, y, w, h] is the part sketched, at w by h.
// Lines where it's darker than round about it (the difference of two blurs), short strokes of hatching where it's dark, a second layer
// across them where it's darker, on a sheet's paper
function sp_pencil(paint,crop,w,h,seed){const S=mkCanvas(W,H);paint(S.getContext("2d"));const [sx,sy,sw,sh]=crop,
    lum=sig=>{const B=mkCanvas(w,h),b=B.getContext("2d");b.fillStyle="#fff";b.fillRect(0,0,w,h);b.filter="blur("+sig+"px)";b.drawImage(S,sx,sy,sw,sh,0,0,w,h);
      const d=b.getImageData(0,0,w,h).data,L=new Float32Array(w*h);for(let i=0;i<w*h;i++)L[i]=(0.299*d[i*4]+0.587*d[i*4+1]+0.114*d[i*4+2])/255;return L;};
  const L1=lum(0.6),L2=lum(2.2),L3=lum(5),O=mkCanvas(w,h),q=O.getContext("2d"),R=wc_rng(seed),gr=WC_PENCIL;
  q.fillStyle=rgba(WC_CARD,1);q.fillRect(0,0,w,h);q.lineCap="round";
  for(const [dir,th,amp] of [[1,0.36,0.5],[-1,0.6,0.45]])for(let y=-10;y<h+10;y+=5)for(let x=-10+((y/5)%2)*6;x<w+10;x+=12){const jx=x+(R()-0.5)*4,jy=y+(R()-0.5)*2,
      dk=1-L3[clamp(Math.round(jy),0,h-1)*w+clamp(Math.round(jx),0,w-1)];if(dk<th)continue;const a=clamp((dk-th)/(1-th)*1.6,0,1)*amp,len=7+R()*5,an=dir*(0.78+(R()-0.5)*0.16);
    q.strokeStyle=rgba(gr,a);q.lineWidth=0.9+R()*0.5;q.beginPath();q.moveTo(jx-Math.cos(an)*len,jy+Math.sin(an)*len);q.lineTo(jx+Math.cos(an)*len,jy-Math.sin(an)*len);q.stroke();}
  const id=q.createImageData(w,h),p=id.data;for(let i=0;i<w*h;i++){const v=clamp((L2[i]-L1[i]-0.015)*7,0,1);p[i*4]=gr[0];p[i*4+1]=gr[1];p[i*4+2]=gr[2];p[i*4+3]=Math.round(v*v*(3-2*v)*242);}
  const Lc=mkCanvas(w,h);Lc.getContext("2d").putImageData(id,0,0);q.drawImage(Lc,0,0);return O;}
// the three sketched, as the film showed them: the meeting in Los Angeles (1980), the bank's floor at night (2008), the team with its box of
// examples (2024). Each on a sheet pinned to the board (at: its middle and turn), its year written under it
const SP_SK={w:684,h:385,sheet:[480,346],at:[[470,318,-0.022],[960,310,0.014],[1450,320,-0.012]],years:["1980","2008","2024"],
  crops:[[0,0,1920,1080],[100,90,1680,945],[160,40,1600,900]]};
function sp_sketchPaint(i,q){const tt=2;
  if(i===0){const L=SP_LA;q.drawImage(gv_place("la80"),0,0);
    L.back.forEach(([bx,id],j)=>{const cup=j%2===1;person(q,id,bx,L.bf,L.bs,{t:tt+j,pose:cup?"spCup":"listen",carry:cup?sp_cupHeld:null,flip:true});sp_badge(q,id,bx,L.bf,L.bs,true);});
    const [cx,cf,cs]=L.chart;person(q,"spLa1",cx,cf,cs,{t:tt,pose:"point",flip:true});sp_badge(q,"spLa1",cx,cf,cs,true);
    L.seats.forEach(([sx,id],j)=>gv_behind(q,id,sx,L.table[2],L.s,{t:tt+j,pose:"listen",flip:true}));q.drawImage(gv_place("la80table"),0,0);sp_cardName(q);sp_chart(q,[1,1,1]);}
  else if(i===1){const D=SP_RK.desk,[sx,ss]=SP_RK.seat;q.drawImage(gv_place("risk"),0,0);sp_tvNews(q,1);
    person(q,"spAn1",250,1004,0.86,{t:tt,pose:"listen"});person(q,"spAn2",420,1010,0.88,{t:tt+1,pose:"listen"});
    gv_behind(q,"spHead",sx,D.top,ss,{t:tt,pose:"hold",carry:sp_cardBack,expr:"concerned"});person(q,"spDep",1500,1012,0.9,{t:tt,pose:"stand",flip:true});
    q.drawImage(gv_place("riskDesk"),0,0);sp_lampLight(q,1);}
  else{q.drawImage(gv_place("team24"),0,0);sp_team24(q,tt,{p:{spMl1:["spEyesR","spEyesR",0,"calm"],spMl3:["spBoxUp","spBoxUpR",1,"concerned"],
    spMl2:["spEyesR","spAskOpen",1,"concerned",true]},hold:1,lift:1,rot:0.03});}}
function sp_sketchC(i){const K=SP_SK;return wc_kept("spSketch"+i,K.w,K.h,q=>q.drawImage(sp_pencil(c=>sp_sketchPaint(i,c),K.crops[i],K.w,K.h,601+i),0,0));}
// a sketch on its sheet, pinned up: the paper, the sketch, its year in pencil under it; it lands as it's pinned (u, 0 to 1)
function sp_sketchSheet(ctx,i,u){if(u<=0)return;const K=SP_SK,[cx,cy,rot]=K.at[i],[sw,sh]=K.sheet,k=lerp(1.14,1,easeCam(clamp(u,0,1))),iw=sw-24,ih=Math.round(iw*K.h/K.w);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(k,k);withA(ctx,clamp(u*3,0,1),()=>{gv_sheet(ctx,-sw/2,-sh/2,sw,sh);ctx.drawImage(sp_sketchC(i),-iw/2,-sh/2+26,iw,ih);
    ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=1.5;ctx.strokeRect(-iw/2,-sh/2+26,iw,ih);
    wc_hand(ctx,K.years[i],-iw/2+6,sh/2-12,{size:34,col:WC_PENCIL,w:700});gv_pin(ctx,0,-sh/2+13,GV.red,1.2);});ctx.restore();}
// the question, on a card pinned under them, gold: first a question mark; then Who decides? and Who answers?, each half as it's said
// (a, b, 0 to 1); the card as it lands (u)
const SP_Q={x:960,y:716,w:1040,h:150};
function sp_question(ctx,u,a,b){if(u<=0)return;const Q=SP_Q,k=lerp(1.12,1,easeCam(clamp(u,0,1)));ctx.save();ctx.translate(Q.x,Q.y);ctx.rotate(0.006);ctx.scale(k,k);
  withA(ctx,clamp(u*3,0,1),()=>{wc_panel(ctx,-Q.w/2,-Q.h/2,Q.w,Q.h,{kind:"card",wash:GV.gold,washA:0.35,seed:801});gv_pin(ctx,0,-Q.h/2+14,GV.red,1.3);
    if(a<0.4)withA(ctx,1-clamp(a*2.5,0,1),()=>wc_T(ctx,"?",0,32,{w:800,size:88,align:"center",col:WC_DARK}));
    if(a>0)withA(ctx,clamp(a,0,1),()=>wc_T(ctx,"Who decides?",-256,26,{w:800,size:60,align:"center",col:WC_DARK}));
    if(b>0)withA(ctx,clamp(b,0,1),()=>wc_T(ctx,"Who answers?",256,26,{w:800,size:60,align:"center",col:WC_DARK}));});ctx.restore();}
// a thread from each sketch down to the question, in gold, drawn on (ps[i], 0 to 1)
function sp_threads(ctx,ps){const K=SP_SK,Q=SP_Q;K.at.forEach(([cx,cy],i)=>{const p=ps[i];if(p<=0)return;
  wc_link(ctx,cx,cy+K.sheet[1]/2+4,Q.x+(i-1)*340,Q.y-Q.h/2+4,GV.goldInk,{p,vertical:true,a:0.85,lw:3.5});});}
// the board's wall
const SP_WALL26=[230,220,204];

// the shelf as the last chapter left it: the three editions, the draft leaning on the newest, its tag. Words the frame's left edge cuts
// stay as decoration (cam: the shot's camera). o.take, 0 to 1: two hands take the newest copy from it, and the draft, its prop gone,
// settles upright
function sp_shelfAll(x,cam,o){o=o||{};const KS=SP_SH,B=SP_SH4.books,left=cam.x-960/cam.z,cut=(bx,half)=>left>bx-half&&left<bx+half,tk=o.take||0;
  sp_book(x,B[0],KS.top,1,{deco:cut(B[0]+11,160)});sp_bookTab(x,B[1],KS.top,"ethics",0,40,cut(B[1]+112,80));sp_book(x,B[1],KS.top,2,{deco:cut(B[1]+11,160)});
  const lean=1-easeCam(clamp((tk-0.55)/0.35,0,1));sp_draft(x,{lean,notes:[1,1,1],deco:cam.z<1.3});sp_tag(x,1,lean,cam.z<1.17);
  // the newest copy: the hands come up to it, lift it a little, and take it down and towards us, out of the frame
  const reach=easeCam(clamp(tk/0.3,0,1)),up=easeCam(clamp((tk-0.3)/0.2,0,1)),go=easeCam(clamp((tk-0.5)/0.5,0,1)),dy=-26*up+760*go,k=1+0.16*go;
  x.save();x.translate(B[2],KS.top+dy);x.scale(k,k);sp_bookTab(x,0,0,"AI",0,70,cut(B[2]+112,50));x.restore();sp_book(x,B[2],KS.top+dy,3,{k,deco:cut(B[2]+11,160)});
  if(tk>0){const hx=KS.w/2*k,hy=KS.top+dy-KS.h*0.2*k+700*(1-reach);sp_holdHand(x,B[2]-hx,hy,-1,0.85);sp_holdHand(x,B[2]+hx,hy,1,0.85);}}

// Yusuf's office as film 1 first shows it, the morning he starts: its shelf of 34 binders, the chart on the board, the score on the wall
// (film 1's binders, chart and score, drawn the same way: 17 binders to a shelf, numbered along each row from the left)
const SP_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]]};
const SP_RACI=[[1,0,1,0],[1,0,0,1],[0,0,1,1],[1,0,0,1]];
function sp_paintOffice24(ctx){gv_paintOffice(ctx);const B=SP_BIND,O=GV_OFF;
  for(let i=0;i<34;i++)gv_binder(ctx,B.x+(i%17)*B.gap,O.shelf.rows[i<17?1:2]-B.h,B.w,B.h,B.cols[Math.floor(hash(i,17)*B.cols.length)]);
  // the chart of who's responsible for what, small on the board: lines for its words
  const [bx,by]=O.board,x=bx+40,y=by+50,w=330,h=190;gv_sheet(ctx,x,y,w,h);gv_pin(ctx,x+16,y+10,GV.red,0.8);gv_pin(ctx,x+w-16,y+10,GV.red,0.8);
  gv_lines(ctx,x+18,y+28,170,1,0);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.5;for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(x+14,y+56+i*30);ctx.lineTo(x+w-14,y+56+i*30);ctx.stroke();}ctx.restore();
  for(let i=0;i<4;i++){gv_lines(ctx,x+20,y+68+i*30,70,1,0,0.8);SP_RACI[i].forEach((n,j)=>{if(n)gv_lines(ctx,x+128+j*48,y+68+i*30,32,1,0,0.8);});}
  // the framed score: the maturity assessment's result, 2.1 of 5
  const [sx,sy,sw]=O.score,cx=sx+sw/2;wc_T(ctx,"maturity",cx,sy+40,{w:600,size:24,align:"center",col:WC_MUTED,deco:1});wc_T(ctx,"2.1 / 5",cx,sy+88,{w:800,size:42,align:"center",col:WC_DARK,deco:1});
  for(let i=0;i<5;i++){const qx=sx+24+i*26;ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(qx,sy+104,22,12);const f=clamp(2.1-i,0,1);if(f>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(qx,sy+104,22*f,12);}}}
// the newest copy of the book, set down on his desk, standing against the tray of papers: brought up by two hands (u, 0 to 1), which let
// go (rel, 0 to 1)
const SP_DB={x:1034,k:0.34};
function sp_deskBook(ctx,u,rel){if(u<=0)return;const KS=SP_SH,D=SP_DB,top=GV_OFF.desk[1],e=easeCam(clamp(u,0,1)),dy=(1-e)*520,k=D.k*(1.04-0.04*spring(fin(u,0.8,0.2)));
  ctx.save();ctx.translate(D.x,top+dy);ctx.rotate(0.05*e);sp_book(ctx,0,0,3,{k,deco:true});ctx.restore();
  if(rel<1){const hx=KS.w/2*k,hy=top+dy-KS.h*0.2*k,o=24*easeCam(clamp(rel*3,0,1)),dn=520*easeCam(rel);sp_holdHand(ctx,D.x-hx-o,hy+dn,-1,0.38);sp_holdHand(ctx,D.x+hx+o,hy+dn,1,0.38);}}
// a name card, as film 1 introduces people: the name, then the role; it rises a little as it comes
function sp_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:3});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// the corridor beyond his door (a, 0 to 1): its light under the door and on the floor; and someone coming to it (u, 0 to 1), a shadow
// moving across the door's frosted glass and stopping, their feet crossing the light
function sp_doorLight(ctx,a,u){if(a<=0.01)return;const O=GV_OFF,[x0,x1,dh]=O.door,fy=O.fy,gx=x0+(x1-x0)*0.3,gw=(x1-x0)*0.4,gy=fy-dh+dh*0.1,gh=dh*0.36;
  const g=ctx.createLinearGradient(0,fy,0,fy+46);g.addColorStop(0,rgba([255,226,170],0.5*a));g.addColorStop(1,rgba([255,226,170],0));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x0+6,fy);ctx.lineTo(x1-6,fy);ctx.lineTo(x1+70,fy+46);ctx.lineTo(x0-70,fy+46);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([255,236,196],0.95*a);ctx.fillRect(x0+6,fy-7,x1-x0-12,7);if(u<=0)return;
  const e=easeCam(clamp(u,0,1)),c=lerp(x0-60,(x0+x1)/2,e),st=Math.sin(u*Math.PI*5)*(1-u)*14,hx=lerp(gx-110,gx+gw/2,e);
  ctx.save();ctx.beginPath();ctx.rect(x0+6,fy-7,x1-x0-12,7);ctx.clip();ctx.fillStyle=rgba([60,48,40],0.7*a);for(const [dx,sd] of [[-22,1],[22,-1]])ctx.fillRect(c+dx+st*sd-15,fy-7,30,7);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();ctx.filter="blur(9px)";ctx.fillStyle=rgba([62,72,92],0.5*a*clamp(u*3,0,1));
  ctx.beginPath();ctx.ellipse(hx,gy+64,25,31,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(hx,gy+178,64,62,0,0,TAU);ctx.fill();ctx.restore();}

// chapters' places, painted once and kept: the film's, then the series' rooms the end comes back to
const WC_PLACES={risk:sp_paintRisk,riskDesk:sp_paintRiskDesk,spread:sp_paintSpread,board08:sp_paintBoard08,city:sp_paintCityWide,
  office70:sp_paintOffice70,desks70:sp_paintDesks70,admin70:sp_paintAdmin70,adminFront70:sp_paintAdminFront70,dict70:sp_paintDict70,
  laOut:sp_paintLaOut,la80:sp_paintLa80,la80table:sp_paintLa80Table,notice80:sp_paintNotice80,alone70:sp_paintAlone70,copy80:sp_paintCopy80,
  board02:sp_paintBoard02,board02table:sp_paintBoard02Table,report02:sp_paintReport02,shelf09:sp_paintShelf,wheelpage:sp_paintWheelPage,
  basel13:sp_paintBasel13,basel13table:sp_paintBasel13Table,principles13:sp_paintPrinciples13,report23:sp_paintReport23,
  team17:sp_paintTeam17,team17table:sp_paintTeam17Table,front18:sp_paintFront18,front18desk:sp_paintFront18Desk,desk18:sp_paintDesk18,
  desk24:sp_paintDesk24,team24:sp_paintTeam24,team24table:sp_paintTeam24Table,shelf24:sp_paintShelf24,act24:sp_paintAct24,
  board26:c=>gv_paintBoardClose(c,SP_WALL26),campus:gv_paintCampus,office24:sp_paintOffice24};
