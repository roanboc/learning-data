/* ===== Good enough for what?: Mercator's chart =====
   The opening's pictures, drawn live on the film's own place, a worktable of dark oak seen from above (ge_table), lit from the
   window on the right like the module's places. No people of 1569 are drawn: the chart, its ports and a ship stand for the pilot.
   The chart of the North Atlantic, from 66° W to 4° E and 33° to 60° N, is a plane chart of the time (latitude and longitude drawn
   the same, ge_xy's u 0) that Mercator's stretch turns into his (u 1): each parallel moves up by his stretched latitude, ge_psi,
   about the parallel of 46° N, so the chart grows towards the pole. The course from Lisbon to St John's that the plane chart shows
   (a straight line on it, its angle read off it, GE_PLANE) is a bearing the ship holds: on the plane chart it curves away south of
   the line, and on Mercator's it is straight, and still misses; the course Mercator's chart shows (GE_RIGHT) is straight on it and
   reaches the port. The numbers are worked out in the script's Rigour.
     ge_chart(ctx, o)              the chart: o.u (the stretch), o.a, o.ports, o.line (the straight line ruled on the plane chart, drawn
                                   on 0 to 1), o.lineA, o.track and o.trackA (the ship on the plane chart's course, 0 to 1 of the way),
                                   o.gap (a steel mark of how far south of the port it ends), o.ruler (the ruler slides in), o.rightLine
                                   (the course Mercator's chart shows, ruled along it), o.right and o.rightA (the ship on it), o.angle (the steel angle read at
                                   Lisbon), o.label (0: the charts of the time, 1: Mercator's, in a cartouche in the sea), o.labelA,
                                   o.rulerA, o.lisbonA (Lisbon's name, while the camera is close on St John's), o.words (false: no words)
     ge_compass(ctx, x, y, w, o)   the compass card: a bearing, one fixed angle to north (o.bearing draws it on), its words; returns bb
     ge_sizes(ctx, x, y, w, o)     Greenland and Africa as the chart draws them, and (o.u) as they are; o.say, the words under them
     ge_ship(ctx, x, y, s, o)      a small ship, drawn as old charts draw them, its keel on (x, y)
   Every top-level name starts with ge_ or GE_. */
const GE_R2D=180/Math.PI;
// Mercator's stretched latitude, in degrees: how far from the equator his chart draws the parallel at lat; and back again
const ge_psi=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))*GE_R2D;
const ge_unpsi=p=>(2*Math.atan(Math.exp(p/GE_R2D))-Math.PI/2)*GE_R2D;
const GE_CH={lon0:-66,lon1:4,lat0:33,lat1:60,x:110,w:1110,pa:46,ya:480};
GE_CH.k=GE_CH.w/(GE_CH.lon1-GE_CH.lon0);
// a point of the chart, u of the way from the plane chart (0) to Mercator's (1)
function ge_xy(lon,lat,u){const C=GE_CH;return[C.x+(lon-C.lon0)*C.k,C.ya-lerp(lat-C.pa,ge_psi(lat)-ge_psi(C.pa),u)*C.k];}
const ge_yAt=(lat,u)=>ge_xy(0,lat,u)[1];
const GE_PORT={lisbon:[-9.14,38.72],stjohns:[-52.71,47.56]};
// the courses from Lisbon, as the tangent of their angle from north (west of north): the plane chart's, read off it with latitude
// and longitude drawn the same; and the bearing that reaches St John's, read off Mercator's chart
const GE_PLANE=(GE_PORT.lisbon[0]-GE_PORT.stjohns[0])/(GE_PORT.stjohns[1]-GE_PORT.lisbon[1]);
const GE_RIGHT=(GE_PORT.lisbon[0]-GE_PORT.stjohns[0])/(ge_psi(GE_PORT.stjohns[1])-ge_psi(GE_PORT.lisbon[1]));
// where the ship is on a course of one bearing (tan tn) from Lisbon, f of the way to longitude lonEnd
function ge_onCourse(tn,f,lonEnd){const L=GE_PORT.lisbon,lon=lerp(L[0],lonEnd,f);return[lon,ge_unpsi(ge_psi(L[1])+(L[0]-lon)/tn)];}
// the plane chart's course is sailed on past St John's longitude, to show where it ends
const GE_TRACK_END=-55.6;
// the ship's size on the chart: small, so it passes clear of Newfoundland's south coast where the plane chart's course misses it
const GE_SHIP=0.55;

/* ---------------------------------------------------------------- the worktable, from above */
function ge_paintTable(c){const nz=dq_noise(61),oak=[104,68,42],seam=188;
  dq_field(c,0,0,W,H,3,(px,py,out)=>{const plank=Math.floor(py/seam),ox=plank*311.7,gr=nz((px+ox)/460,py/15,3),fine=nz((px+ox)/90,py/4.2,2),m=nz(px/520,py/520,2),
      sh=nz((px+ox)/1400,plank*3.1,1),
      e=Math.min(py-plank*seam,(plank+1)*seam-py),edge=e<3.5?0.55+0.45*e/3.5:1,
      lit=(0.74+0.36*sstep(-300,W+100,px))*(0.92+0.08*sstep(0,500,py))*(1-0.1*sstep(700,H,py)),
      k=lit*edge*(0.8+0.26*gr+0.07*(fine-0.5)+0.08*(m-0.5)+0.1*(sh-0.5));
    out[0]=Math.min(255,oak[0]*k+5);out[1]=Math.min(255,oak[1]*k+2);out[2]=Math.min(255,oak[2]*k);});
  // the window's daylight across the table from the right, and a soft dark at the far left
  dq_pool(c,1700,380,1100,[255,236,206],0.12,0.7);
  const g=c.createLinearGradient(0,0,520,0);g.addColorStop(0,"rgba(18,10,6,0.28)");g.addColorStop(1,"rgba(18,10,6,0)");c.fillStyle=g;c.fillRect(0,0,520,H);}
AG_PLACES.ge_table=c=>ge_paintTable(c);

/* ---------------------------------------------------------------- the chart */
const GE_PAPER=[238,228,204],GE_LANDC=[221,205,166],GE_INK=[58,44,32];
function ge_path(ctx,pts,u,close){pts.forEach(([lo,la],i)=>{const [x,y]=ge_xy(lo,la,u);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});if(close)ctx.closePath();}
// a course drawn on the chart, from Lisbon, f of the way: n points, each a point of the course at u
function ge_course(ctx,tn,lonEnd,f,u){const n=Math.max(2,Math.ceil(48*f));for(let i=0;i<=n;i++){const [lo,la]=ge_onCourse(tn,f*i/n,lonEnd),[x,y]=ge_xy(lo,la,u);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}}
function ge_chart(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const C=GE_CH,u=o.u||0,top=ge_yAt(C.lat1,u),bot=ge_yAt(C.lat0,u),x0=C.x,x1=C.x+C.w,words=o.words!==false;
  ctx.save();ctx.globalAlpha*=a;
  // the paper, with its shadow on the oak, and a border of two rules
  ctx.save();ctx.shadowColor="rgba(10,4,0,0.5)";ctx.shadowBlur=30;ctx.shadowOffsetX=-10;ctx.shadowOffsetY=14;ctx.fillStyle=rgba(GE_PAPER,1);ctx.fillRect(x0-30,top-30,C.w+60,bot-top+60);ctx.restore();
  let g=ctx.createLinearGradient(x0,top,x1,bot);g.addColorStop(0,"rgba(120,90,50,0.07)");g.addColorStop(0.6,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(255,250,236,0.18)");ctx.fillStyle=g;ctx.fillRect(x0-30,top-30,C.w+60,bot-top+60);
  ctx.strokeStyle=rgba(GE_INK,0.8);ctx.lineWidth=2.4;ctx.strokeRect(x0-14,top-14,C.w+28,bot-top+28);ctx.lineWidth=1.2;ctx.strokeRect(x0-20,top-20,C.w+40,bot-top+40);
  ctx.save();ctx.beginPath();ctx.rect(x0,top,C.w,bot-top);ctx.clip();
  // the land, washed, its coast in ink; the Azores. Greenland starts at 60° N, the chart's top edge, so it isn't drawn here
  ctx.fillStyle=rgba(GE_LANDC,1);ctx.strokeStyle=rgba(GE_INK,0.85);ctx.lineWidth=1.8;ctx.lineJoin="round";
  for(const k of ["na","eurasia","britain","ireland","africa","newfoundland"]){ctx.beginPath();ge_path(ctx,GE_LAND[k],u,true);ctx.fill();ctx.stroke();}
  for(const [lo,la,r] of GE_ISLES){const [x,y]=ge_xy(lo,la,u);ctx.beginPath();ctx.ellipse(x,y,r*C.k,r*C.k*0.45*(1+0.4*u),0,0,TAU);ctx.fill();ctx.stroke();}
  // the meridians every 10 degrees, the parallels every 5, faint
  ctx.strokeStyle=rgba(GE_INK,0.26);ctx.lineWidth=1.3;for(let lo=-60;lo<=0;lo+=10){const x=ge_xy(lo,0,u)[0];ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,bot);ctx.stroke();}
  for(let la=35;la<=55;la+=5){const y=ge_yAt(la,u);ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();}
  const L=ge_xy(...GE_PORT.lisbon,u),J=ge_xy(...GE_PORT.stjohns,u);
  // the straight line ruled on the plane chart, from Lisbon towards St John's: straight there, and bent by the stretch
  const lf=o.line||0,la_=(o.lineA==null?1:o.lineA);if(lf>0&&la_>0){ctx.save();ctx.globalAlpha*=la_;ctx.strokeStyle=rgba(GE_INK,0.85);ctx.lineWidth=2.6;ctx.beginPath();
    const n=40,m=Math.max(1,Math.ceil(n*lf));for(let i=0;i<=m;i++){const f=lf*i/m,lo=lerp(GE_PORT.lisbon[0],GE_PORT.stjohns[0],f),lat=lerp(GE_PORT.lisbon[1],GE_PORT.stjohns[1],f),[x,y]=ge_xy(lo,lat,u);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    ctx.stroke();ctx.restore();}
  // the ship on the course the plane chart shows: its wake behind it, dashed
  const tf=o.track||0,ta=o.trackA==null?1:o.trackA;if(tf>0&&ta>0){ctx.save();ctx.globalAlpha*=ta;ctx.setLineDash([11,9]);ctx.strokeStyle=rgba(GE_INK,0.8);ctx.lineWidth=2.4;ctx.beginPath();
    ge_course(ctx,GE_PLANE,GE_TRACK_END,tf,u);ctx.stroke();ctx.setLineDash([]);
    // how far south of the port it crosses St John's longitude: a steel mark
    const gp=o.gap||0;if(gp>0){const fe=(GE_PORT.lisbon[0]-GE_PORT.stjohns[0])/(GE_PORT.lisbon[0]-GE_TRACK_END),[lo,la]=ge_onCourse(GE_PLANE,fe,GE_TRACK_END),P=ge_xy(lo,la,u);
      ctx.strokeStyle=rgba(DQ.steel,gp);ctx.lineWidth=3;const yy=lerp(P[1],J[1]+12,ag_sine(gp));ctx.beginPath();ctx.moveTo(P[0],P[1]);ctx.lineTo(P[0],yy);ctx.stroke();
      for(const yv of [P[1],yy]){ctx.beginPath();ctx.moveTo(P[0]-9,yv);ctx.lineTo(P[0]+9,yv);ctx.stroke();}}
    const [lo,la]=ge_onCourse(GE_PLANE,tf,GE_TRACK_END),[sx,sy]=ge_xy(lo,la,u);ge_ship(ctx,sx,sy,GE_SHIP,{a:ag_in(tf,0,0.04)});ctx.restore();}
  // the course Mercator's chart shows, straight, with the ruler along it; the ship sails it to the port
  const rl0=o.rightLine||0,rf=o.right||0,ra=o.rightA==null?1:o.rightA;if(rl0>0&&ra>0){ctx.save();ctx.globalAlpha*=ra;ctx.strokeStyle=rgba(GE_INK,0.9);ctx.lineWidth=2.8;ctx.beginPath();
    ge_course(ctx,GE_RIGHT,GE_PORT.stjohns[0],rl0,u);ctx.stroke();ctx.restore();}
  // the steel angle read at Lisbon: the meridian, north, and the arc from it to the course
  const an=o.angle||0;if(an>0){const d=Math.atan2(J[0]-L[0],-(J[1]-L[1])),r=96;ctx.save();ctx.strokeStyle=rgba(DQ.steel,1);ctx.lineWidth=3.4;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(L[0],L[1]);ctx.lineTo(L[0],L[1]-lerp(0,150,ag_sine(an/0.4)));ctx.stroke();const e=ag_sine((an-0.3)/0.7);
    if(e>0){ctx.beginPath();ctx.arc(L[0],L[1],r,-Math.PI/2,-Math.PI/2+d*e,d<0);ctx.stroke();}ctx.restore();}
  ctx.restore();
  // the ruler lies on the chart, along the course, a little below it (ruled from St John's, so its edge lies on the south side)
  const rl=o.ruler||0,rla=o.rulerA==null?1:o.rulerA;if(rl>0&&rla>0){ctx.save();ctx.globalAlpha*=rla;ge_ruler(ctx,J[0],J[1],L[0],L[1],rl);ctx.restore();}
  if(rf>0&&ra>0){const [lo,la]=ge_onCourse(GE_RIGHT,rf,GE_PORT.stjohns[0]),[sx,sy]=ge_xy(lo,la,u);ctx.save();ctx.globalAlpha*=ra;ge_ship(ctx,sx,sy,GE_SHIP,{a:ag_in(rf,0,0.04)});ctx.restore();}
  // the ports, and their names
  const pa=o.ports==null?1:o.ports;if(pa>0){ctx.save();ctx.globalAlpha*=pa;for(const [P,name,dx,dy,al] of [[L,"Lisbon",22,42,"left"],[J,"St John's",22,-22,"left"]]){
      ctx.fillStyle=rgba(GE_INK,1);ctx.beginPath();ctx.arc(P[0],P[1],7,0,TAU);ctx.fill();ctx.strokeStyle=rgba(GE_INK,1);ctx.lineWidth=2;ctx.beginPath();ctx.arc(P[0],P[1],13,0,TAU);ctx.stroke();
      if(words)dq_T(ctx,name,P[0]+dx,P[1]+dy,{w:800,size:30,col:GE_INK,align:al,a:name==="Lisbon"&&o.lisbonA!=null?o.lisbonA:1});}ctx.restore();}
  // what the chart is, in a cartouche in the open sea south of Greenland: the charts of the time, then Mercator's
  if(words){const lA=o.labelA==null?1:o.labelA;if(lA>0){const [kx,ky]=ge_xy(-32,55.5,u);ge_cartouche(ctx,kx,ky,o.label||0,lA);}}
  ctx.restore();}
// the cartouche: a panel of the chart's paper framed by two rules, its words in ink; lb 0 to 1 turns one name into the other, the
// first gone before the second comes, so the two are never seen together
function ge_cartouche(ctx,x,y,lb,a){const w=470,h=66;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(GE_PAPER,1);ctx.fillRect(x-w/2,y-h/2,w,h);ctx.strokeStyle=rgba(GE_INK,0.85);ctx.lineWidth=2.2;ctx.strokeRect(x-w/2,y-h/2,w,h);
  ctx.lineWidth=1.1;ctx.strokeRect(x-w/2+6,y-h/2+6,w-12,h-12);
  for(const [s,aa] of [["The charts of the time",1-sstep(0.2,0.5,lb)],["Mercator's chart, 1569",sstep(0.5,0.8,lb)]])if(aa>0)dq_T(ctx,s,x,y+10,{w:700,size:28,col:GE_INK,align:"center",ls:1,a:aa});
  ctx.restore();}
// a wooden ruler along the line from (x0, y0) to (x1, y1), its edge just below it; k slides it in
function ge_ruler(ctx,x0,y0,x1,y1,k){const d=Math.hypot(x1-x0,y1-y0),an=Math.atan2(y1-y0,x1-x0),w=46,e=ag_sine(k);if(e<=0)return;ctx.save();ctx.globalAlpha*=sstep(0,0.3,k);
  ctx.translate(x0,y0);ctx.rotate(an);ctx.translate(0,(1-e)*60);
  ctx.save();ctx.shadowColor="rgba(20,10,0,0.45)";ctx.shadowBlur=14;ctx.shadowOffsetX=-5;ctx.shadowOffsetY=8;const g=ctx.createLinearGradient(0,6,0,6+w);g.addColorStop(0,"#c89c64");g.addColorStop(0.5,"#b4844e");g.addColorStop(1,"#946638");
  ctx.fillStyle=g;rr(ctx,-90,6,d+180,w,5);ctx.fill();ctx.restore();
  // its grain, and the scale along its edge
  ctx.strokeStyle="rgba(80,46,18,0.22)";ctx.lineWidth=1.2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-86,14+i*8);ctx.bezierCurveTo(d*0.3,12+i*8+3,d*0.7,16+i*8-2,d+86,13+i*8);ctx.stroke();}
  ctx.fillStyle="rgba(50,30,14,0.75)";for(let xx=-80,i=0;xx<d+86;xx+=14,i++)ctx.fillRect(xx,6,1.6,i%5===0?14:7);
  ctx.restore();}
// a small ship, as old charts draw them: a dark hull, three masts and their sails, a pennant; its keel on (x, y), sailing west
function ge_ship(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.translate(0,-10);
  ctx.lineJoin="round";ctx.lineCap="round";ctx.strokeStyle=rgba(GE_INK,1);ctx.lineWidth=2.2;
  // the hull, its high stern on the right
  ctx.fillStyle="rgba(70,50,34,1)";ctx.beginPath();ctx.moveTo(-34,-8);ctx.lineTo(28,-12);ctx.lineTo(30,-20);ctx.lineTo(36,-20);ctx.quadraticCurveTo(34,0,20,4);ctx.lineTo(-22,4);ctx.quadraticCurveTo(-32,0,-34,-8);ctx.closePath();ctx.fill();ctx.stroke();
  for(const [mx,top,sw,sh] of [[-16,-46,20,22],[2,-58,26,30],[20,-44,18,20]]){ctx.beginPath();ctx.moveTo(mx,-8);ctx.lineTo(mx,top);ctx.stroke();
    ctx.fillStyle="rgba(246,238,220,1)";ctx.beginPath();ctx.moveTo(mx-sw/2,top+6);ctx.quadraticCurveTo(mx-2,top+3,mx+sw/2,top+6);ctx.quadraticCurveTo(mx+sw/2-4,top+6+sh/2,mx+sw/2,top+6+sh);ctx.lineTo(mx-sw/2,top+6+sh);ctx.quadraticCurveTo(mx-sw/2-4,top+6+sh/2,mx-sw/2,top+6);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.fillStyle=rgba(GE_INK,1);ctx.beginPath();ctx.moveTo(2,-58);ctx.lineTo(16,-55);ctx.lineTo(2,-52);ctx.closePath();ctx.fill();
  // the sea under the keel: two short strokes
  ctx.lineWidth=1.6;ctx.strokeStyle=rgba(GE_INK,0.6);ctx.beginPath();ctx.moveTo(-40,10);ctx.quadraticCurveTo(-30,6,-20,10);ctx.moveTo(10,10);ctx.quadraticCurveTo(22,6,34,10);ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- the compass card: a bearing */
function ge_compass(ctx,x,y,w,o){o=o||{};const h=340,bb={x,y,w,h},a=o.a==null?1:o.a;if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on});const r=126,cx=x+DQ_PAD+r+6,cy=y+h/2;
  // the rose: the circle, its 32 points, the four quarters, and north
  ctx.strokeStyle=rgba(DQ.ink,0.85);ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,r-16,0,TAU);ctx.stroke();
  for(let i=0;i<32;i++){const an=i*TAU/32,l=i%8===0?18:i%4===0?13:7;ctx.lineWidth=i%8===0?2.4:1.2;ctx.beginPath();ctx.moveTo(cx+Math.sin(an)*(r-16),cy-Math.cos(an)*(r-16));ctx.lineTo(cx+Math.sin(an)*(r-16-l),cy-Math.cos(an)*(r-16-l));ctx.stroke();}
  for(let i=0;i<4;i++){const an=i*TAU/4;ctx.fillStyle=i===0?rgba(DQ.ink,1):rgba(DQ.soft,0.85);ctx.beginPath();ctx.moveTo(cx+Math.sin(an)*(r-40),cy-Math.cos(an)*(r-40));
    ctx.lineTo(cx+Math.sin(an+0.5)*15,cy-Math.cos(an+0.5)*15);ctx.lineTo(cx,cy);ctx.lineTo(cx+Math.sin(an-0.5)*15,cy-Math.cos(an-0.5)*15);ctx.closePath();ctx.fill();}
  dq_T(ctx,"N",cx,cy-r-14,{w:800,size:30,align:"center"});
  // the bearing: a course one fixed angle west of north, and the angle, in steel: a measure the pilot holds
  const b=o.bearing||0;if(b>0){const d=-(o.deg||75)*Math.PI/180,e=ag_sine(b/0.5);ctx.strokeStyle=rgba(DQ.steel,1);ctx.fillStyle=rgba(DQ.steel,1);ctx.lineWidth=4;ctx.lineCap="round";
    const ex=cx+Math.sin(d)*(r-22)*e,ey=cy-Math.cos(d)*(r-22)*e;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);ctx.stroke();
    if(e>0.9){ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-Math.sin(d-0.45)*16,ey+Math.cos(d-0.45)*16);ctx.lineTo(ex-Math.sin(d+0.45)*16,ey+Math.cos(d+0.45)*16);ctx.closePath();ctx.fill();}
    const f=ag_sine((b-0.4)/0.6);if(f>0){ctx.lineWidth=3.4;ctx.beginPath();ctx.arc(cx,cy,58,-Math.PI/2,-Math.PI/2+d*f,true);ctx.stroke();}}
  // the words, beside the rose
  const tx=cx+r+40,tw=x+w-DQ_PAD-tx;dq_T(ctx,"BEARING",tx,y+96,{w:800,size:28,ls:4,col:DQ.soft});
  dq_wrap(ctx,"One fixed angle to north, held hour after hour",tw,{w:700,size:30}).forEach((l,i)=>dq_T(ctx,l,tx,y+146+i*42,{w:700,size:30}));
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- Greenland and Africa: as the chart draws them, and as they are
   As the chart draws them: Mercator's stretch (longitude as it is, latitude stretched by ge_psi). As they are: an equal-area view of
   each about its own middle (longitude narrowed by the cosine of latitude), so their areas compare truly: Africa is about 14 times
   Greenland. Both drawn at one scale, each about its middle, so Greenland shrinks where it lies. */
// Greenland, closer than the world map's outline, for the sizes card: Cape Farewell, up the east coast to the north, and down the west
const GE_GREENLAND=[[-43.9,59.8],[-42.5,60.5],[-41.5,61.5],[-40.3,63.5],[-38.2,65.6],[-35,66.2],[-32.5,67.5],[-29.5,68.2],[-25.5,69.4],[-22.5,70.4],
  [-21.8,72.5],[-20.2,74.3],[-18.8,76.5],[-18.4,78.5],[-17.5,80],[-12.5,81.6],[-17,82.2],[-25,83.2],[-33,83.6],[-40,83.3],[-50,82.5],[-58,81.8],[-62,81.2],
  [-64.5,80],[-67,79],[-71,78.5],[-72.5,77.6],[-69,76.4],[-66,76.1],[-62,75.9],[-58.5,75.5],[-56.5,74.5],[-55.5,72.8],[-54.8,71.6],[-55.8,70.6],[-54.5,70.2],
  [-53.5,69.3],[-51.5,68.8],[-53.5,67.8],[-53.8,66.9],[-52.8,65.5],[-51.8,64.2],[-50.5,62.8],[-49.4,61.9],[-48.3,61.1],[-46.5,60.6],[-45.2,60.1]];
function ge_shapeXY(pts,u){const m=pts.reduce((s,p)=>[s[0]+p[0]/pts.length,s[1]+p[1]/pts.length],[0,0]),pm=ge_psi(m[1]);
  return pts.map(([lo,la])=>{const ax=lo-m[0],ay=ge_psi(la)-pm,bx=(lo-m[0])*Math.cos(la*Math.PI/180),by=la-m[1];return[lerp(ax,bx,u),lerp(ay,by,u)];});}
function ge_sizes(ctx,x,y,w,o){o=o||{};const h=520,bb={x,y,w,h},a=o.a==null?1:o.a;if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on});const u=ag_sine(o.u||0);
  for(const [s_,aa] of [["As the chart draws them",1-sstep(0.05,0.35,u)],["As they are",sstep(0.65,0.95,u)]])if(aa>0)dq_label(ctx,x+DQ_PAD,y+56,s_,{a:aa});
  // one scale for both, from their outlines (Greenland as the chart draws it is the tallest, 90 degrees of stretched latitude): both fit
  // between the label and their names
  const sc=2.82,mid=y+86+59.8*sc;
  for(const [k,cx,name] of [["greenland",x+DQ_PAD+20+78,"Greenland"],["africa",x+w-DQ_PAD-20-94,"Africa"]]){const P=ge_shapeXY(k==="greenland"?GE_GREENLAND:GE_LAND[k],u);
    ctx.fillStyle=rgba(GE_LANDC,1);ctx.strokeStyle=rgba(GE_INK,0.9);ctx.lineWidth=2;ctx.lineJoin="round";ctx.beginPath();P.forEach(([px,py],i)=>{const X=cx+px*sc,Y=mid-py*sc;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.closePath();ctx.fill();ctx.stroke();
    dq_T(ctx,name,cx,y+h-100,{w:700,size:30,align:"center"});}
  // the words under them, in steel once the true sizes are shown: a measure
  if(o.say)dq_T(ctx,o.say,x+w/2,y+h-44,{w:800,size:30,align:"center",col:"steel",a:o.sayA==null?1:o.sayA});
  ctx.restore();return bb;}
