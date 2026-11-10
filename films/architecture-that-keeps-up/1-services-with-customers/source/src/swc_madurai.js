/* ===== Services with customers: Madurai, from 1976 =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix swc_). Nothing here is a likeness of a real person or a copy of a photograph: the hospital, the fields and the clothes are drawn
   plainly, from what is known of the place and the time (a low, whitewashed building with a flat roof; a farmer in a cotton shirt with a
   cloth over his shoulder; an older woman in a sari, its end over her shoulder), in this film's own style, with no pattern or ornament
   borrowed from the place.
     swcSky        the hospital's street under a pale, hot sky, its ground and a few far trees: the hospital is drawn live on it
     swc_hospital  the hospital cut open like the module's section of the teaching building: an entrance, a ward of eleven beds, an
                   operating room; o.beds (0 to 1, the beds come in), o.free (0 to 1, six of them outlined in blue: kept for those who pay
                   nothing), o.lit
     swcField      a farmer's field in the dry season, low under the sky: the people of the problem stand in it
     swcWard       the hospital's whitewashed wall inside, in morning light: the doctor stands by it
     swc_eye       an eye seen from the side, its lens clearing or clouding (o.cloud), the light through it reaching the back, or not
     swcMap        the country round the town from above, its villages and roads
     swc_camps     the eye camps in the villages, lit one by one, and the buses that bring people in, along their roads
     swc_flow      an operating room's flow on one sheet: four steps, who does each, and what each costs
     SWC_PEOPLE    the doctor, a farmer and a grandmother: dressed for their time, never likenesses
   Colour keeps the module's meaning: the hospital's purpose and its design in blue, sight given back and what got better in green, cost
   and harm in amber; the place itself wears none of the five. */

const SWC_K={sky0:[206,214,214],sky1:[246,232,204],ground:[196,170,132],groundDk:[160,134,100],lime:[238,232,220],limeDk:[204,196,182],
  cut:[84,74,70],room:[232,222,204],roomDk:[206,192,170],tree:[110,118,92],treeDk:[82,90,70],bed:[118,104,92],sheet:[246,244,238],
  field:[188,164,118],fieldDk:[150,126,88],furrow:[166,140,100],road:[214,196,160],village:[150,128,100]};

/* ---------------------------------------------------------------- the street and the hospital, cut open */
const SWC_H={x0:300,x1:1620,ground:860,top:520,roof:22,par:30,wall:18,rooms:[["entrance",300,540],["ward",540,1360],["theatre",1360,1620]]};
// a far tree: a round crown of soft blobs on a thin trunk, lit from the right
function swc_tree(c,x,base,h,R){const r=h*0.32;c.fillStyle=rgba(SWC_K.treeDk,1);c.fillRect(x-4,base-h*0.55,8,h*0.55);
  for(let k=0;k<7;k++){const a=k/7*TAU,dx=Math.cos(a)*r*0.55,dy=Math.sin(a)*r*0.35,rr2=r*(0.55+R()*0.2);
    const g=c.createRadialGradient(x+dx+rr2*0.3,base-h*0.7+dy-rr2*0.3,2,x+dx,base-h*0.7+dy,rr2);g.addColorStop(0,rgba(ag_lt(SWC_K.tree,0.18),1));g.addColorStop(1,rgba(SWC_K.treeDk,1));
    c.fillStyle=g;c.beginPath();c.arc(x+dx,base-h*0.7+dy,rr2,0,TAU);c.fill();}}
function swc_skyGround(c,hz){let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(SWC_K.sky0,1));g.addColorStop(1,rgba(SWC_K.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,hz);
  // the sun's haze, high on the right
  g=c.createRadialGradient(1600,120,20,1600,120,900);g.addColorStop(0,"rgba(255,240,210,0.6)");g.addColorStop(1,"rgba(255,240,210,0)");c.fillStyle=g;c.fillRect(0,0,W,hz);
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(SWC_K.ground,1));g.addColorStop(1,rgba(SWC_K.groundDk,1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);}
AG_PLACES.swcSky=c=>{const R=ag_rnd(1976);swc_skyGround(c,SWC_H.ground);
  // the town's low roofs far off, flat and pale, then a few trees
  c.fillStyle=rgba(mix(SWC_K.sky1,SWC_K.limeDk,0.55),1);for(let x=-20;x<W;x+=90+R()*80){const h=40+R()*50;c.fillRect(x,SWC_H.ground-h,70+R()*60,h);}
  for(const x of [140,1760,1840,70])swc_tree(c,x,SWC_H.ground,230+R()*60,R);
  c.fillStyle=rgba(LP.shade,0.12);c.fillRect(0,SWC_H.ground,W,6);};
function swc_bed(c,x,y,w){c.fillStyle=rgba(SWC_K.bed,1);c.fillRect(x,y-30,6,30);c.fillRect(x+w-6,y-22,6,22);c.fillRect(x,y-12,w,5);
  c.fillStyle=rgba(SWC_K.sheet,1);rr(c,x+4,y-24,w-8,12,5);c.fill();c.fillStyle=rgba(SWC_K.sheet,1);rr(c,x+6,y-32,18,9,4);c.fill();}
function swc_hospital(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const H0=SWC_H,top=H0.top,gr=H0.ground;ctx.save();ctx.globalAlpha*=a;
  // the rooms inside, lit, then the cut walls, slab and parapet over them
  for(const [id,x0,x1] of H0.rooms){let g=ctx.createLinearGradient(0,top,0,gr);g.addColorStop(0,rgba(SWC_K.room,1));g.addColorStop(1,rgba(SWC_K.roomDk,1));ctx.fillStyle=g;ctx.fillRect(x0,top,x1-x0,gr-top);
    g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(LP.shade,0.12));g.addColorStop(1,rgba(LP.sun,0.12));ctx.fillStyle=g;ctx.fillRect(x0,top,x1-x0,gr-top);}
  // the entrance: a door to the street, a bench
  ctx.fillStyle=rgba(mix(SWC_K.sky1,SWC_K.room,0.4),1);ctx.fillRect(H0.x0,gr-200,H0.wall,200);
  ctx.fillStyle=rgba(SWC_K.bed,1);ctx.fillRect(360,gr-46,140,8);ctx.fillRect(370,gr-38,6,38);ctx.fillRect(484,gr-38,6,38);
  // the ward: eleven beds, coming in one by one; six outlined in blue, for those who pay nothing
  const n=11,bx0=572,bw=58,gap=(1360-40-bx0-n*bw)/(n-1);
  for(let i=0;i<n;i++){const k=clamp((o.beds==null?1:o.beds)*n-i,0,1);if(k<=0)continue;const x=bx0+i*(bw+gap);ctx.save();ctx.globalAlpha*=k;swc_bed(ctx,x,gr-6,bw);ctx.restore();
    if(i>=n-6&&(o.free||0)>0){ctx.save();ctx.globalAlpha*=o.free;ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=5;rr(ctx,x-8,gr-52,bw+16,52,8);ctx.stroke();ctx.restore();}}
  // the operating room: a table under its lamp
  ctx.fillStyle=rgba(SWC_K.bed,1);ctx.fillRect(1420,gr-60,140,10);ctx.fillRect(1484,gr-50,10,50);
  ctx.strokeStyle=rgba(SWC_K.cut,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1490,top+H0.roof);ctx.lineTo(1490,top+90);ctx.stroke();
  ctx.fillStyle=rgba(SWC_K.cut,1);ctx.beginPath();ctx.ellipse(1490,top+98,36,12,0,0,TAU);ctx.fill();
  if((o.lit||0)>0){const g=ctx.createRadialGradient(1490,top+110,4,1490,gr-60,220);g.addColorStop(0,"rgba(255,246,220,"+(0.55*o.lit)+")");g.addColorStop(1,"rgba(255,246,220,0)");ctx.fillStyle=g;ctx.fillRect(1362,top,256,gr-top);}
  // the cut: outer walls, the walls between rooms, the roof slab and its parapet
  ctx.fillStyle=rgba(SWC_K.cut,1);ctx.fillRect(H0.x0-H0.wall,top-H0.par,H0.wall,gr-top+H0.par-200);ctx.fillRect(H0.x1,top-H0.par,H0.wall,gr-top+H0.par);
  ctx.fillRect(H0.x0-H0.wall,top,H0.x1-H0.x0+2*H0.wall,H0.roof);ctx.fillRect(H0.x0-H0.wall,top-H0.par,24,H0.par);ctx.fillRect(H0.x1-6,top-H0.par,24,H0.par);
  for(const x of [540,1360]){ctx.fillRect(x-6,top,12,gr-top-150);}
  // the whitewashed face of the roof's edge, catching the sun
  ctx.fillStyle=rgba(SWC_K.lime,1);ctx.fillRect(H0.x0-H0.wall,top-H0.par-10,H0.x1-H0.x0+2*H0.wall,10);
  ctx.fillStyle=rgba(LP.shade,0.14);ctx.fillRect(H0.x0-H0.wall,gr,H0.x1-H0.x0+2*H0.wall,8);
  ctx.restore();}

/* ---------------------------------------------------------------- the field, and the ward's wall */
AG_PLACES.swcField=c=>{const R=ag_rnd(58),hz=620;let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(SWC_K.sky0,1));g.addColorStop(1,rgba(SWC_K.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,hz);
  g=c.createRadialGradient(1640,90,20,1640,90,900);g.addColorStop(0,"rgba(255,240,210,0.6)");g.addColorStop(1,"rgba(255,240,210,0)");c.fillStyle=g;c.fillRect(0,0,W,hz);
  for(const x of [210,520,1500,1780])swc_tree(c,x,hz+4,150+R()*60,R);
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(SWC_K.field,1));g.addColorStop(1,rgba(SWC_K.fieldDk,1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  // furrows running away to the horizon, dry and pale
  c.strokeStyle=rgba(SWC_K.furrow,0.7);for(let k=-14;k<=14;k++){c.lineWidth=2+Math.abs(k)*0.2;c.beginPath();c.moveTo(960+k*30,hz);c.lineTo(960+k*170,H);c.stroke();}
  c.fillStyle=rgba(LP.shade,0.1);c.fillRect(0,hz,W,4);};
AG_PLACES.swcWard=c=>lp_paintRoom(c,{light:"morning",seed:9,base:[234,228,214]});

/* ---------------------------------------------------------------- an eye, from the side */
// the light comes in from the left, through the clear front and the lens, and meets at the back of the eye; a cataract clouds the lens
// (o.cloud, 0 to 1) until no light gets through; o.rays (0 to 1) draws the light in; o.a
function swc_eye(ctx,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const cl=clamp(o.cloud||0,0,1),lx=cx-r*0.58;
  // the eyeball: a pale sphere, lit from the right, with its back wall in a soft rose
  let g=ctx.createRadialGradient(cx+r*0.3,cy-r*0.3,r*0.1,cx,cy,r);g.addColorStop(0,"rgb(252,250,244)");g.addColorStop(1,"rgb(226,218,206)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(150,96,92,0.55)";ctx.lineWidth=14;ctx.beginPath();ctx.arc(cx,cy,r-10,-1.1,1.1);ctx.stroke();
  ctx.strokeStyle="rgba(90,80,76,0.9)";ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();
  // the clear front, bulging forward, and the coloured ring behind it
  ctx.strokeStyle="rgba(90,80,76,0.9)";ctx.beginPath();ctx.ellipse(cx-r*0.86,cy,r*0.22,r*0.46,0,Math.PI/2,Math.PI*1.5);ctx.stroke();
  ctx.fillStyle="rgb(104,86,70)";ctx.fillRect(lx-10,cy-r*0.5,10,r*0.32);ctx.fillRect(lx-10,cy+r*0.18,10,r*0.32);
  // the light: three rays from the left, bending at the lens and meeting at the back; after the lens they fade as it clouds
  const ru=clamp(o.rays==null?1:o.rays,0,1),fy=cy,fx=cx+r-16;
  if(ru>0){ctx.lineCap="round";for(const dy of [-r*0.3,0,r*0.3]){const p0=[cx-r*1.9,cy+dy],p1=[lx,cy+dy*0.8],u1=clamp(ru*2,0,1),u2=clamp(ru*2-1,0,1);
    ctx.strokeStyle="rgba(255,200,110,0.95)";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(lerp(p0[0],p1[0],u1),lerp(p0[1],p1[1],u1));ctx.stroke();
    if(u2>0&&cl<0.98){ctx.strokeStyle="rgba(255,200,110,"+(0.95*(1-cl))+")";ctx.beginPath();ctx.moveTo(p1[0],p1[1]);ctx.lineTo(lerp(p1[0],fx,u2),lerp(p1[1],fy,u2));ctx.stroke();}}
    if(ru>=1&&cl<0.9){const gg=ctx.createRadialGradient(fx,fy,0,fx,fy,30);gg.addColorStop(0,"rgba(255,220,150,"+(0.9*(1-cl))+")");gg.addColorStop(1,"rgba(255,220,150,0)");ctx.fillStyle=gg;ctx.fillRect(fx-30,fy-30,60,60);}}
  // the lens: clear, then clouding grey-white
  ctx.fillStyle="rgba(230,238,240,0.55)";ctx.beginPath();ctx.ellipse(lx+r*0.08,cy,r*0.12,r*0.3,0,0,TAU);ctx.fill();
  if(cl>0){ctx.fillStyle="rgba(214,210,204,"+(0.96*cl)+")";ctx.beginPath();ctx.ellipse(lx+r*0.08,cy,r*0.12,r*0.3,0,0,TAU);ctx.fill();}
  ctx.strokeStyle="rgba(90,80,76,0.8)";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(lx+r*0.08,cy,r*0.12,r*0.3,0,0,TAU);ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- the country round the town, its eye camps and buses */
const SWC_TOWN=[960,470];
const SWC_VILL=[[300,230],[520,150],[760,190],[1240,170],[1500,250],[1700,400],[1640,640],[1380,760],[1060,780],[700,760],[420,690],[240,520],[560,430],[1350,450]];
const SWC_CAMPS=[1,4,6,9,11];
AG_PLACES.swcMap=c=>{const R=ag_rnd(1977);c.fillStyle=rgba(mix(SWC_K.field,SWC_K.sky1,0.35),1);c.fillRect(0,0,W,H);
  // fields in patches, a dry river crossing the land
  for(let k=0;k<80;k++){const x=R()*W,y=R()*900,w=80+R()*160,h=50+R()*90;c.fillStyle=rgba(mix(SWC_K.field,SWC_K.fieldDk,R()*0.5),0.35);c.fillRect(x,y,w,h);}
  c.strokeStyle=rgba(mix(SWC_K.road,[200,210,214],0.5),1);c.lineWidth=26;c.lineCap="round";c.beginPath();c.moveTo(0,560);c.bezierCurveTo(400,520,700,620,960,560);c.bezierCurveTo(1240,500,1500,600,W,520);c.stroke();
  // the roads, from each village to the town
  c.strokeStyle=rgba(SWC_K.road,1);c.lineWidth=6;for(const [x,y] of SWC_VILL){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo((x+SWC_TOWN[0])/2+30,(y+SWC_TOWN[1])/2-20,SWC_TOWN[0],SWC_TOWN[1]);c.stroke();}
  // the villages: a few roofs each
  for(const [x,y] of SWC_VILL){for(let k=0;k<5;k++){const dx=(R()-0.5)*50,dy=(R()-0.5)*30;c.fillStyle=rgba(SWC_K.village,1);c.fillRect(x+dx-8,y+dy-6,16,12);c.fillStyle=rgba(ag_lt(SWC_K.village,0.3),1);c.fillRect(x+dx,y+dy-6,8,12);}}
  // the town
  c.fillStyle=rgba(mix(SWC_K.limeDk,SWC_K.village,0.4),1);for(let k=0;k<40;k++){const an=R()*TAU,d=R()*70;c.fillRect(SWC_TOWN[0]+Math.cos(an)*d-10,SWC_TOWN[1]+Math.sin(an)*d*0.7-7,20,14);}};
// a village's road towards the town, at u (0 at the village, 1 in the town)
function swc_roadAt(v,u){const [x,y]=v,mx=(x+SWC_TOWN[0])/2+30,my=(y+SWC_TOWN[1])/2-20,k=1-u;return[k*k*x+2*k*u*mx+u*u*SWC_TOWN[0],k*k*y+2*k*u*my+u*u*SWC_TOWN[1]];}
function swc_camps(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  // the hospital in the town, in blue: what it's for
  ctx.fillStyle=rgba(LP.blue,1);rr(ctx,SWC_TOWN[0]-26,SWC_TOWN[1]-26,52,52,8);ctx.fill();lp_icon(ctx,"dot",SWC_TOWN[0],SWC_TOWN[1],24,[255,255,255]);
  SWC_CAMPS.forEach((vi,i)=>{const v=SWC_VILL[vi],k=clamp(((o.camps||0)*SWC_CAMPS.length-i),0,1);if(k<=0)return;
    // the camp: a pale awning in the village, outlined in green: sight checked where people live
    ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.moveTo(v[0]-34,v[1]+30);ctx.lineTo(v[0],v[1]+4);ctx.lineTo(v[0]+34,v[1]+30);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(LP.green,1);ctx.lineWidth=5;ctx.stroke();ctx.restore();
    // the bus, along the road to the town and back, once it's running
    const bt=t-(o.bus0||0)-i*0.5;if(bt>0){const u=ag_sine(clamp(bt/3.2,0,1)),p=swc_roadAt(v,u),q=swc_roadAt(v,Math.min(1,u+0.02));const an=Math.atan2(q[1]-p[1],q[0]-p[0]);
      ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(an);ctx.fillStyle="rgba(52,44,52,0.25)";rr(ctx,-20,-8,44,22,5);ctx.fill();ctx.fillStyle=rgba(LP.blue,1);rr(ctx,-22,-12,44,22,5);ctx.fill();
      ctx.fillStyle="rgba(255,255,255,0.8)";for(let k2=0;k2<3;k2++)ctx.fillRect(-16+k2*12,-8,8,7);ctx.restore();}});
  ctx.restore();}

/* ---------------------------------------------------------------- an operating room's flow, on one sheet */
// four steps joined left to right, who does each under it, and its cost on a tag once o.cost comes in; o.u (0 to 1: the steps), o.k
const SWC_STEPS=[["Examined","A nurse"],["Prepared","A nurse"],["Operated","The surgeon"],["Recovered","A nurse"]];
function swc_flow(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=1500,h=440;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});
  lp_label(ctx,x+44,y+80,"The operating room",{col:LP.blue});lp_T(ctx,"Every step designed",x+44,y+134,{w:800,size:40});
  const bw=290,gap=(w-88-4*bw)/3,by=y+180;
  SWC_STEPS.forEach(([s,who],i)=>{const k=clamp((o.u||0)*4-i,0,1);if(k<=0)return;const bx=x+44+i*(bw+gap);ctx.save();ctx.globalAlpha*=k;
    ctx.strokeStyle=rgba(i===2?LP.blue:LP.mut,1);ctx.lineWidth=i===2?5:3;rr(ctx,bx,by,bw,96,12);ctx.stroke();
    lp_T(ctx,s,bx+bw/2,by+60,{w:800,size:34,align:"center"});lp_T(ctx,who,bx+bw/2,by+150,{w:600,size:28,align:"center",col:LP.mut});
    if(i<3){ctx.strokeStyle=rgba(LP.mut,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx+bw+12,by+48);ctx.lineTo(bx+bw+gap-14,by+48);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx+bw+gap-26,by+38);ctx.lineTo(bx+bw+gap-14,by+48);ctx.lineTo(bx+bw+gap-26,by+58);ctx.stroke();}
    ctx.restore();});
  if((o.cost||0)>0)lp_tag(ctx,x+w/2,y+h-60,"What each step costs, written down",{align:"center",col:LP.amber,a:o.cost});
  ctx.restore();}

/* ---------------------------------------------------------------- the people of the story */
// a cloth over one shoulder, falling across the body to the near hip: a farmer's towel, or a sari's end
function swc_drape(col,wide){return(c,P)=>{const f=cc=>{cc.moveTo(330,598);cc.bezierCurveTo(380,606,420,624,432,660);cc.bezierCurveTo(420,760,330,900,250,1100);
    cc.lineTo(wide?120:190,1100);cc.bezierCurveTo(wide?230:270,920,330,790,368,690);cc.bezierCurveTo(352,650,320,626,300,610);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.28),400,700,200,rgba(ag_dk(col,0.6),0.35),10);
  c.strokeStyle=rgba(ag_dk(col,0.25),0.5);c.lineWidth=3;c.beginPath();c.moveTo(420,676);c.bezierCurveTo(400,780,330,900,264,1090);c.stroke();};}
const SWC_PEOPLE={
  doctor:{name:"The doctor",key:"swc-doctor",skin:[150,104,76],hair:{style:"cropped",c:[200,198,194]},glasses:[44,40,40],top:{kind:"tunic",c:[240,238,230]},breath:0.24},
  farmer:{name:"A farmer",key:"swc-farmer",skin:[136,92,64],hair:{style:"cropped",c:[34,30,30]},top:{kind:"tunic",c:[214,206,186],paint:swc_drape([236,230,214],false)},breath:0.3},
  gran:{name:"A grandmother",key:"swc-gran",skin:[146,100,72],hair:{style:"bun",c:[176,172,168]},top:{kind:"tunic",c:[112,96,104],paint:swc_drape([150,120,96],true)},breath:0.27}
};
