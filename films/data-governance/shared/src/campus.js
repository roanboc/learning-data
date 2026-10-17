/* ===== The data governance series: the university as a toy town =====
   The data governance office stands on the green in the middle, open at the front (south). The other offices stand round it in a
   ring, each open at the front towards it, with ten paths between them: from above, it's DAMA's wheel, governance in the middle
   where the others meet. Five offices are open, with people at work in them: the Data platform (north), the Registrar's office,
   the Data team, Planning; the others are closed. A film adds its own things to a room through st.hooks, and its people
   through st.figs. drawCampus(ctx,S,C,st) draws one picture of the town from the camera C. */

const RINGF=10.6;
// a building: its front centre (x,z), the angle its depth runs towards, its size, its colours, and its room's colours
const BLD=[
  {id:"office",name:"Data governance",x:0,z:-1.9,ang:0,w:5,d:3.8,open:true,wall:[250,240,216],roof:PAL.roof,band:PAL.band,room:{win:[0.95,1.12,2.15,2.38]}},
  {id:"platform",name:"Data platform",ang:0,w:5.2,d:4,open:true,wall:[236,242,250],roof:[110,146,204],band:[120,180,226],
    room:{paper:[234,242,252],stripe:[214,228,246],dado:[150,172,206],side:[222,232,248],floor:[206,174,142],sprig:[140,170,220]}},
  {id:"registrar",name:"Registrar's office",ang:36,w:5.2,d:4,open:true,wall:[252,236,222],roof:[200,112,112],band:[232,156,124],
    room:{paper:[252,238,228],stripe:[242,216,206],dado:[204,164,172],side:[250,224,208],floor:[216,172,122],sprig:[220,140,140],win:[-2.05,1.12,-0.95,2.38]}},
  {id:"data",name:"Data team",ang:72,w:5.6,d:4,open:true,wall:[234,248,238],roof:[92,160,140],band:[122,194,164],
    room:{paper:[238,250,240],stripe:[216,240,224],dado:[142,192,172],side:[228,244,228],floor:[220,178,128],sprig:[120,180,150]}},
  {id:"library",name:"Library",ang:108,w:5.4,d:4.2,wall:[246,232,206],roof:[146,124,186],band:[204,176,124]},
  {id:"health",name:"School of Health",ang:144,w:5.2,d:4,wall:[252,226,214],roof:[120,170,150],band:[240,170,140]},
  {id:"eng",name:"School of Engineering",ang:-144,w:5.2,d:4,wall:[232,236,246],roof:[200,120,90],band:[150,170,214]},
  {id:"finance",name:"Finance",ang:-108,w:5.2,d:4,wall:[248,246,232],roof:[110,130,170],band:[200,190,130]},
  {id:"students",name:"Student services",ang:-72,w:5.2,d:4,wall:[250,236,246],roof:[224,140,120],band:[220,170,210]},
  {id:"planning",name:"Planning",ang:-36,w:5.2,d:4,open:true,wall:[252,246,224],roof:[214,164,84],band:[238,204,112],
    room:{paper:[252,248,228],stripe:[246,234,198],dado:[216,198,152],side:[252,238,208],floor:[222,178,130],sprig:[220,180,110],win:[1.05,1.12,2.15,2.38]}}];
const BLDI={};BLD.forEach(b=>{if(b.id!=="office"){b.x=RINGF*Math.sin(b.ang*DEG);b.z=RINGF*Math.cos(b.ang*DEG);}b.R={X0:-b.w/2,X1:b.w/2,Z0:0,Z1:b.d,FY:0.3,HY:2.95};BLDI[b.id]=b;});
// a point in a building's own coordinates, in the town's; and where its front centre is
function bldP(id,x,y,z){const b=BLDI[id],M=MX;mxSet(b.x,b.z,b.ang);const p=mxP(v3(x,y,z));MX=M;return p;}
const SPOKES=[...Array(10).keys()].map(k=>18+36*k);

// ---- what grows and stands on the green: fixed for the whole series ----
const NATURE=(()=>{const trees=[],shrubs=[],lamps=[],benches=[];
  // outside the ring, and between the buildings
  for(let i=0;i<46;i++){const a=hash(i,301)*360,r=16.2+hash(i,302)*8;if(SPOKES.some(s=>Math.abs(((a-s+540)%360)-180)<5))continue;trees.push([r*Math.sin(a*DEG),r*Math.cos(a*DEG),3.6+hash(i,303)*2.2,hash(i,304)]);}
  for(const s of SPOKES){for(const k of [-1,1]){const a=s+k*5.2,r=12.9;trees.push([r*Math.sin(a*DEG),r*Math.cos(a*DEG),3.0+hash(s+k,305)*0.9,hash(s,306)]);}}
  // on the green: a few trees and benches, and shrubs along the fronts
  // (away from the open offices' fronts, so the camera can look into them from the middle)
  for(const [a,r,h] of [[118,6.6,3.0],[-120,6.8,3.1],[154,6.5,2.8],[-156,6.4,2.9],[98,7.4,2.6],[-98,7.2,2.7]])trees.push([r*Math.sin(a*DEG),r*Math.cos(a*DEG),h,0.5]);
  for(const b of BLD){if(b.id==="office")continue;for(const k of [-1,1]){const p=bldP(b.id,k*(b.w/2+0.5),0,0.3);shrubs.push([p.x,p.z,0.42+0.1*hash(b.ang+k,307)]);}}
  for(const s of SPOKES){const r=9.2;lamps.push([r*Math.sin((s+3.6)*DEG),r*Math.cos((s+3.6)*DEG)]);}
  for(const [a,r] of [[54,6.4],[-54,6.4],[126,6.2],[-162,6.2]])benches.push([r*Math.sin(a*DEG),r*Math.cos(a*DEG),a]);
  return{trees,shrubs,lamps,benches};})();

// ---- the ground: the lawn, the plaza round the office, the paths, and the light along them ----
function pathQuad(a0,r0,r1,w,y){const a=a0*DEG,s=Math.sin(a),c=Math.cos(a),nx=c*w/2,nz=-s*w/2;return[v3(r0*s-nx,y,r0*c-nz),v3(r1*s-nx,y,r1*c-nz),v3(r1*s+nx,y,r1*c+nz),v3(r0*s+nx,y,r0*c+nz)];}
function ringQuads(r0,r1,y,n){const q=[];for(let i=0;i<n;i++){const a0=i*360/n*DEG,a1=(i+1)*360/n*DEG;q.push([v3(r0*Math.sin(a0),y,r0*Math.cos(a0)),v3(r1*Math.sin(a0),y,r1*Math.cos(a0)),v3(r1*Math.sin(a1),y,r1*Math.cos(a1)),v3(r0*Math.sin(a1),y,r0*Math.cos(a1))]);}return q;}
const RINGQ=ringQuads(9.55,10.3,0.004,72);
function campusGround(ctx,C,st){tHorizon(ctx,C,PAL.lawn);
  // the plaza round the office, the ten paths, the ring path in front of the offices
  poly3(ctx,C,discPts(0,0,3.95,48,0.003),mix(PAL.path,[255,255,255],0.15),{});poly3(ctx,C,discPts(0,0,3.75,48,0.0035),PAL.path,{});
  for(const s of SPOKES)poly3(ctx,C,pathQuad(s,3.6,21,0.86,0.004),PAL.path,{});
  for(const q of RINGQ)poly3(ctx,C,q,PAL.path,{});
  // a forecourt in front of the office
  poly3(ctx,C,[v3(-1.6,0.0045,-1.95),v3(1.6,0.0045,-1.95),v3(1.6,0.0045,-3.7),v3(-1.6,0.0045,-3.7)],mix(PAL.path,[255,255,255],0.1),{});
  tFlock(ctx,C,0,0,40,{a:0.18});
  // shadows of the buildings and trees, along the sun
  for(const b of BLD){mxSet(b.x,b.z,b.ang);const R=b.R;contactShadow(ctx,C,R.X0,R.Z0,b.w,b.d,0.22);castShadow(ctx,C,R.X0,R.Z0,b.w,b.d,R.HY+1.2,0.13);}mxOff();
  if(st.gold)goldPaths(ctx,C,st.gold);}
// governance's decisions reaching the work: gold light from the office along the paths to every office round it
function goldPaths(ctx,C,u){if(u<=0)return;const segs=[];
  for(const s of SPOKES){const r0=3.7,r1=9.92,ur=clamp(u/0.6,0,1);if(ur>0){const pts=[];for(let r=r0;r<=r0+(r1-r0)*ur+1e-6;r+=0.3)pts.push([r,s]);pts.push([r0+(r1-r0)*ur,s]);segs.push(pts);}
    const ua=clamp((u-0.6)/0.4,0,1);if(ua>0)for(const k of [-1,1]){const pts=[];for(let i=0;i<=12;i++)pts.push([r1,s+k*18*ua*i/12]);segs.push(pts);}}
  ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";ctx.lineJoin="round";
  for(const [w,a] of [[0.55,0.16],[0.26,0.3],[0.1,0.85]])for(const pts of segs){for(let i=1;i<pts.length;i++){const A=fromCyl([pts[i-1][0],pts[i-1][1],0.02]),B=fromCyl([pts[i][0],pts[i][1],0.02]),p=pj(C,A),q=pj(C,B);if(p.z<NEAR||q.z<NEAR)continue;
    ctx.strokeStyle=rgba(a>0.5?[255,236,170]:PAL.gold,a);ctx.lineWidth=Math.max(1,w*(p.s+q.s)/2);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
  ctx.restore();}

// ---- small things of the green ----
function tLamp(ctx,C,x,z,on){drawBox(ctx,C,x-0.04,0,z-0.04,0.08,1.9,0.08,[70,80,100],{edge:0.3});const P_=pj(C,v3(x,2.0,z));if(P_.z<NEAR)return;const r=0.14*P_.s;
  if(on){const g=ctx.createRadialGradient(P_.x,P_.y,1,P_.x,P_.y,r*5);g.addColorStop(0,"rgba(255,236,180,"+0.45*on+")");g.addColorStop(1,"rgba(255,236,180,0)");ctx.fillStyle=g;ctx.fillRect(P_.x-r*5,P_.y-r*5,r*10,r*10);}
  const g=ctx.createRadialGradient(P_.x-r*0.3,P_.y-r*0.3,1,P_.x,P_.y,r);g.addColorStop(0,"#fffbe8");g.addColorStop(1,"#f0d890");ctx.fillStyle=g;ctx.beginPath();ctx.arc(P_.x,P_.y,r,0,TAU);ctx.fill();}
function tBench(ctx,C,x,z,a){const M=MX;mxSet(x,z,a+180);drawBox(ctx,C,-0.6,0.36,-0.2,1.2,0.06,0.4,PAL.wood,{edge:0.4});drawBox(ctx,C,-0.6,0.5,0.14,1.2,0.34,0.06,PAL.wood,{edge:0.4});
  for(const k of [-0.5,0.46])drawBox(ctx,C,k,0,-0.18,0.06,0.36,0.36,[90,96,110],{edge:0.3});MX=M;}
// a signpost on a path: a post, and a board the scene writes on (drawn with the words, after the blur)
function tPost(ctx,C,x,z,h){drawBox(ctx,C,x-0.05,0,z-0.05,0.1,h,0.1,[150,104,66],{edge:0.3});}

// ---- the rooms: what's in each office (in the building's own coordinates) ----
// add(x,y,z,fn) puts a thing in the room's painter's order; lod 1 leaves out the small things, when the room is far
const FURNISH={
  office(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz,o=st.office||{};
    poly3(ctx,C,[v3(0.95,FY+0.004,bz-0.05),v3(2.15,FY+0.004,bz-0.05),v3(1.75,FY+0.004,bz-1.6),v3(0.55,FY+0.004,bz-1.6)],[255,240,196],{a:0.28});
    // the framed assessment, the clock
    wq3(ctx,C,-0.32,1.5,0.62,2.4,bz-0.03,ilit([196,150,96],1),{edge:0.5});wq3(ctx,C,-0.25,1.57,0.55,2.33,bz-0.035,[255,251,240]);
    surfDraw(ctx,C,v3(0.15,2.33,bz-0.04),v3(1,0,0),v3(0,1,0),c=>{Tw(c,"maturity",0,22,{w:700,size:12,align:"center",color:rgba([100,104,124],1)});Tw(c,"2.1 / 5",0,52,{w:800,size:20,align:"center",color:rgba([196,78,62],1)});});
    if(o.maturity>0)glowQuad(ctx,C,[v3(-0.36,1.46,bz-0.05),v3(0.66,1.46,bz-0.05),v3(0.66,2.44,bz-0.05),v3(-0.36,2.44,bz-0.05)],o.maturity);
    if(!lod)tClock(ctx,C,1.55,2.66,bz-0.03,0.16,9,10);
    // the pinboard on the left wall: the chart of who's responsible for what, with names still to be confirmed
    officePinboard(ctx,C,Q.xl+0.012,o,lod);
    tRug(ctx,C,-1.62,0.66,0.82,2.64,FY,PAL.rug);
    const SX=Q.xl+0.08,SZ=bz-0.42;
    add(SX+0.9,1,SZ+0.2,ctx=>{const n=tShelf(ctx,C,SX,SZ,1.85,2.22,0.42,{FY,skip:o.shelfSkip||((r,j)=>r===2&&j===4),out:o.shelfOut});
      if(o.shelfSign>0){const P_=pj(C,v3(SX+0.92,FY+2.26,SZ));lbAdd(c=>signBoard(c,P_.x,P_.y-4,"34 data policies",{size:32,bg:[255,226,150],rim:[200,150,60],ink:[74,52,20],a:o.shelfSign}));}});
    if(!lod)add(2.05,1,bz-0.3,ctx=>tPlant(ctx,C,2.02,FY,bz-0.3,1.25));
    add(1.45,1,2.95,ctx=>tChair(ctx,C,1.2,2.75,FY));
    add(1.45,1,2.1,ctx=>{const top=tDesk(ctx,C,0.55,1.75,1.8,0.78,FY);
      // the council's minutes in a red folder, a laptop, a lamp (o.bare clears the desk for the film's own things)
      if(!o.bare){ibox(ctx,C,0.7,top,1.85,0.48,0.08,0.36,[250,246,236],{edge:0.5});ibox(ctx,C,0.69,top+0.08,1.84,0.5,0.025,0.38,[214,84,72],{edge:0.4});
        ibox(ctx,C,1.38,top,1.9,0.52,0.025,0.36,[176,184,200],{edge:0.5});poly3(ctx,C,[v3(1.4,top+0.025,2.25),v3(1.88,top+0.025,2.25),v3(1.88,top+0.34,2.34),v3(1.4,top+0.34,2.34)],[70,80,104],{edge:0.5});}
      if(!lod)tDeskLamp(ctx,C,2.15,top,2.3,0.62,1);
      if(st.hooks&&st.hooks.officeDesk)st.hooks.officeDesk(ctx,C,top);});},
  platform(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz;
    // a big screen of a table's columns, two racks with their lights, a desk
    wq3(ctx,C,-1.9,1.25,0.3,2.5,bz-0.03,[56,62,78],{edge:0.5});wq3(ctx,C,-1.84,1.31,0.24,2.44,bz-0.035,[230,240,250]);
    surfDraw(ctx,C,v3(-1.84,2.44,bz-0.04),v3(1,0,0),v3(0,1,0),c=>{Tw(c,"students",8,12,{w:800,size:9,color:rgba(PAL.ink,1)});
      ["student_id","name","date_of_birth","award_code","email"].forEach((s,i)=>{c.fillStyle=i%2?"rgba(214,226,242,1)":"rgba(240,246,252,1)";c.fillRect(6,18+i*19,196,18);Tw(c,s,12,31+i*19,{w:600,size:9,f:"mono",color:rgba([60,70,100],1)});});});
    for(const x of [1.0,1.62])add(x+0.28,1,bz-0.5,ctx=>{ibox(ctx,C,x,FY,bz-0.75,0.56,1.95,0.6,[70,78,98],{edge:0.4});
      if(!lod)for(let i=0;i<9;i++){const yy=FY+0.2+i*0.19;wq3(ctx,C,x+0.06,yy,x+0.5,yy+0.13,bz-0.755,[90,100,124],{edge:0.25});
        const p=pj(C,v3(x+0.44,yy+0.065,bz-0.76)),on=0.5+0.5*Math.sin((st.t||0)*3+i*1.7+x*5);if(p.z>NEAR){ctx.fillStyle=rgba(i%3?[120,230,160]:[120,200,255],0.5+0.5*on);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.2,0.025*p.s),0,TAU);ctx.fill();}}});
    add(-1.0,1,1.9,ctx=>{const top=tDesk(ctx,C,-1.9,1.55,1.7,0.72,FY,[200,206,220]);ibox(ctx,C,-1.5,top,1.65,0.5,0.025,0.34,[176,184,200],{edge:0.5});poly3(ctx,C,[v3(-1.48,top+0.025,1.98),v3(-1.02,top+0.025,1.98),v3(-1.02,top+0.32,2.07),v3(-1.48,top+0.32,2.07)],[60,70,96],{edge:0.5});
      if(st.hooks&&st.hooks.platformDesk)st.hooks.platformDesk(ctx,C,top);});
    if(!lod)add(-2.15,1,bz-0.3,ctx=>tPlant(ctx,C,-2.15,FY,bz-0.3,1.1));},
  registrar(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz;
    // framed certificates on the wall: the awards the office confers
    for(let i=0;i<3;i++){const x=-0.35+i*0.78;wq3(ctx,C,x,1.62,x+0.56,2.3,bz-0.03,ilit([196,160,96],1),{edge:0.5});wq3(ctx,C,x+0.06,1.68,x+0.5,2.24,bz-0.035,[255,252,240]);
      if(!lod){const p=pj(C,v3(x+0.28,1.82,bz-0.04));if(p.z>NEAR){ctx.fillStyle="#c8463a";ctx.beginPath();ctx.arc(p.x,p.y,0.05*p.s,0,TAU);ctx.fill();}
        for(let k=0;k<3;k++)wq3(ctx,C,x+0.12,2.12-k*0.08,x+0.44-(k===2?0.1:0),2.135-k*0.08,bz-0.04,[150,140,130],{a:0.7});}}
    // filing cabinets, and the counter across the room
    for(const x of [1.45,1.95])add(x+0.22,0.6,bz-0.35,ctx=>{ibox(ctx,C,x,FY,bz-0.62,0.46,1.3,0.58,[176,186,200],{edge:0.4});for(let i=0;i<3;i++){wq3(ctx,C,x+0.05,FY+0.1+i*0.4,x+0.41,FY+0.44+i*0.4,bz-0.625,ilit([196,204,216],1),{edge:0.3});}});
    add(0,0.6,1.5,ctx=>{ibox(ctx,C,-1.75,FY,1.3,3.1,0.95,0.42,[226,206,180],{edge:0.45});for(let i=0;i<4;i++)wq3(ctx,C,-1.68+i*0.76,FY+0.1,-1.02+i*0.76,FY+0.84,1.295,ilit([236,220,198],1),{edge:0.35});
      ibox(ctx,C,-1.82,FY+0.95,1.25,3.24,0.06,0.52,[204,150,104],{edge:0.6});const top=FY+1.01;
      // the draft submission, in a neat stack
      ibox(ctx,C,-0.95,top,1.32,0.42,0.1,0.3,[250,248,240],{edge:0.5});ibox(ctx,C,-0.96,top+0.1,1.31,0.44,0.02,0.32,[100,150,200],{edge:0.4});
      if(st.hooks&&st.hooks.registrarCounter)st.hooks.registrarCounter(ctx,C,top);});
    if(!lod)add(-2.15,1,bz-0.3,ctx=>tPlant(ctx,C,-2.15,FY,bz-0.3,1.15));},
  data(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz;
    // the team's poster of its loop of ten steps and a cork board for reports share the back wall; a desk with a big screen
    // stands well forward, so a camera close in looks over it at both
    loopPoster(ctx,C,-2.45,0.98,-0.2,2.72,bz-0.03,st,lod);
    wq3(ctx,C,0.01,1.18,2.49,2.72,bz-0.03,ilit(PAL.walnut,1),{edge:0.4});wq3(ctx,C,0.05,1.22,2.45,2.68,bz-0.034,ilit([222,176,124],1));
    if(st.hooks&&st.hooks.dataBoard)st.hooks.dataBoard(ctx,C,bz-0.04);
    add(0.85,1,1.4,ctx=>{const top=tDesk(ctx,C,-0.2,1.05,2.1,0.75,FY,[214,170,118]);
      tMonitor(ctx,C,0.4,top,1.25,1.02,0.62,st.hooks&&st.hooks.dataScreen?(c=>st.hooks.dataScreen(c,top)):(c=>{for(let i=0;i<6;i++){c.fillStyle=rgba(i%2?[120,170,220]:[160,200,140],0.8);c.fillRect(8,10+i*9,30+40*hash(i,5),4);}}),{bg:[246,250,252]});
      ibox(ctx,C,0.0,top,1.15,0.34,0.02,0.24,[190,196,210],{edge:0.4});});
    add(0.85,1,2.05,ctx=>tChair(ctx,C,0.66,1.95,FY,[96,160,140]));
    if(!lod)add(-2.3,1,0.6,ctx=>tPlant(ctx,C,-2.3,FY,0.6,1.2));},
  planning(ctx,C,b,R,Q,add,st,lod){const FY=R.FY,bz=Q.bz;
    // a dashboard on the wall: bars and a line, and the number of awards
    wq3(ctx,C,-2.05,1.15,0.6,2.6,bz-0.03,[56,62,78],{edge:0.5});wq3(ctx,C,-1.99,1.21,0.54,2.54,bz-0.035,[244,248,252]);
    surfDraw(ctx,C,v3(-1.99,2.54,bz-0.04),v3(1,0,0),v3(0,1,0),c=>{for(let i=0;i<7;i++){const h=24+40*hash(i,41);c.fillStyle=rgba(i===6?PAL.gold:[140,180,220],1);c.fillRect(14+i*20,124-h,13,h);}
      c.strokeStyle=rgba(PAL.coral,1);c.lineWidth=2.4;c.beginPath();for(let i=0;i<8;i++){const x=160+i*12,y=96-26*hash(i,43)-i*3;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
      if(st.hooks&&st.hooks.planningScreen)st.hooks.planningScreen(c);});
    add(0.9,1,1.9,ctx=>{const top=tDesk(ctx,C,0.1,1.55,1.9,0.74,FY,[220,186,130]);ibox(ctx,C,0.4,top,1.7,0.5,0.025,0.34,[176,184,200],{edge:0.5});poly3(ctx,C,[v3(0.42,top+0.025,2.03),v3(0.88,top+0.025,2.03),v3(0.88,top+0.32,2.12),v3(0.42,top+0.32,2.12)],[60,70,96],{edge:0.5});
      for(let i=0;i<3;i++)ibox(ctx,C,1.2,top+i*0.03,1.7,0.36,0.03,0.26,[250,248,240],{edge:0.4});});
    add(1.0,1,2.6,ctx=>tChair(ctx,C,0.8,2.45,FY,[200,150,80]));
    if(!lod)add(2.2,1,bz-0.3,ctx=>tPlant(ctx,C,2.2,FY,bz-0.3,1.2));}};
// text in the world: decoration when it's drawn too small to read, words to read when it's big enough. The line is the one
// tools/legible.py draws: 28 px, less the 5% it allows for things still settling
function Tw(ctx,s,x,y,o){o=o||{};const m=ctx.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))/(ctx.canvas.width/W);T(ctx,s,x,y,Object.assign({},o,{deco:o.deco||(o.size||24)*k<26.6?1:0}));}
// a soft gold light on a quad, for what's being named
function glowQuad(ctx,C,pts,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="lighter";poly3(ctx,C,pts,[255,214,120],{a:0.22*a});ctx.restore();
  const Q=pts.map(p=>pj(C,p));if(Q.some(q=>q.z<NEAR))return;ctx.save();ctx.strokeStyle=rgba(PAL.gold,0.9*a);ctx.lineWidth=4;ctx.lineJoin="round";ctx.shadowColor=rgba(PAL.gold,0.8*a);ctx.shadowBlur=16;ctx.beginPath();Q.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.stroke();ctx.restore();}
// the office's pinboard, on the left wall (facing east, into the room): the chart, notes, and later the answers Yusuf pins up
const RACI={rows:["census report","award term","government submission","data access"],
  cells:[["Clara","TBC","Jun","TBC"],["Mei","TBC","TBC","Jun"],["Mei","TBC","TBC","Clara"],["Sam","TBC","Jun","TBC"]]};
function officePinboard(ctx,C,x,o,lod){const z0=0.5,z1=2.2,y0=1.28,y1=2.34,k=ILIT.L,n=v3(1,0,0);
  sq3(ctx,C,x,z0-0.04,y0-0.04,z1+0.04,y1+0.04,ilit(PAL.walnut,k),{edge:0.4});sq3(ctx,C,x+0.004,z0,y0,z1,y1,ilit([222,176,124],k),{grad:[0.04,0.06]});
  // notes round the chart
  for(const [za,ya,dz,dy,c] of [[1.62,1.95,0.3,0.3,[255,226,140]],[1.95,1.62,0.2,0.36,[196,226,240]],[1.66,1.38,0.26,0.24,[250,200,190]]]){sq3(ctx,C,x+0.008,za,ya,za+dz,ya+dy,ilit(c,k),{edge:0.3});const p=pj(C,v3(x+0.012,ya+dy*0.85,za+dz/2));if(p.z>NEAR){ctx.fillStyle="#d8574a";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.5,0.02*p.s),0,TAU);ctx.fill();}}
  // the chart: who's responsible, accountable, consulted and informed, for four things; half its names to be confirmed.
  // o.tbc (0..1) writes the TBCs in, one by one; o.raciHi lights the government submission's row; o.stamp (0..1) stamps its A
  sq3(ctx,C,x+0.008,0.56,1.32,1.58,2.28,ilit([255,253,246],k),{edge:0.4});
  {const O=v3(x+0.012,2.28,0.56),UX=v3(0,0,1),UY=v3(0,1,0),at=(X_,Y_,fn)=>surfAt(ctx,C,O,UX,UY,X_,Y_,fn),tbc=o.tbc==null?1:o.tbc,hi=o.raciHi||0,X=[60,70.5,81,91.5];
    // a line or a band across the chart, from y0 to y1 centimetres down
    const band=(y0,y1,col,a)=>sq3(ctx,C,x+0.01,0.57,2.28-y1/100,1.57,2.28-y0/100,col,{a});
    if(hi>0)band(57,72,[255,222,140],0.75*hi);
    at(5,12,c=>Tw(c,"RACI",0,0,{w:800,size:9,color:rgba(PAL.ink,1)}));["R","A","C","I"].forEach((s,j)=>at(X[j],24,c=>Tw(c,s,0,0,{w:800,size:6.2,align:"center",color:rgba([90,96,120],1)})));
    let n=0;RACI.rows.forEach((s,i)=>{const y=34+i*15;band(y-6.3,y-5.7,[200,204,220],0.9);at(4,y+4,c=>Tw(c,s,0,0,{w:700,size:4.2,color:rgba([70,76,100],1)}));
      RACI.cells[i].forEach((v,j)=>{if(v==="TBC"){const u=clamp(tbc*8-n,0,1);n++;if(u>0)at(X[j],y+4,c=>Tw(c,"TBC",0,0,{w:800,size:3.7*(0.6+0.4*spring(u)),align:"center",color:rgba(PAL.red,u)}));}
        else at(X[j],y+4,c=>Tw(c,v,0,0,{w:600,size:3.3,align:"center",color:rgba([70,76,100],1)}));});});
    const st=o.stamp||0;if(st>0)at(X[1],64,c=>{const k_=1.15*(1+1.3*(1-spring(st))),a=clamp(st*3,0,1);c.rotate(-0.14);c.scale(k_,k_);c.globalAlpha*=a;
      c.strokeStyle=rgba([200,52,44],0.9);c.lineWidth=1.1;rr(c,-9.5,-5.6,19,9.2,1.6);c.stroke();Tw(c,"TBC",0,1.7,{w:800,size:5.6,align:"center",color:rgba([200,52,44],0.95)});});}
  // the four answers, pinned over the chart one by one
  const cards=o.cards||0;[[0.66,1.86,[255,226,140]],[1.08,1.9,[250,200,190]],[0.7,1.44,[196,226,240]],[1.12,1.46,[214,236,214]]].forEach(([za,ya,c],i)=>{const u=clamp(cards-i,0,1);if(u<=0)return;const dz=0.36,dy=0.34,lift=(1-spring(u))*0.3;
    sq3(ctx,C,x+0.016+lift,za,ya,za+dz,ya+dy,ilit(c,k),{edge:0.4});for(let j=1;j<4;j++)sq3(ctx,C,x+0.018+lift,za+0.04,ya+dy*(j/4.5),za+dz-0.06,ya+dy*(j/4.5)+0.014,[120,120,150],{a:0.7});
    const p=pj(C,v3(x+0.02+lift,ya+dy*0.86,za+dz/2));if(p.z>NEAR){ctx.fillStyle=rgba(PAL.gold,1);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(2,0.025*p.s),0,TAU);ctx.fill();}});}
// the data team's poster: the loop of ten steps it builds in, as drawn in In the weeds of data crafting
const LOOPP={cx:0.5,cy:0.53,rx:0.38,ry:0.36};
function loopPos(i,x0,y0,x1,y1,z){const an=-Math.PI/2+i/10*TAU,u=LOOPP.cx+Math.cos(an)*LOOPP.rx,v=LOOPP.cy+Math.sin(an)*LOOPP.ry;return v3(lerp(x0,x1,u),lerp(y1,y0,v),z);}
function loopPoster(ctx,C,x0,y0,x1,y1,z,st,lod){wq3(ctx,C,x0-0.04,y0-0.04,x1+0.04,y1+0.04,z,ilit([60,84,132],1),{edge:0.5});wq3(ctx,C,x0,y0,x1,y1,z-0.004,[252,250,244]);
  const w=(x1-x0)*100,h=(y1-y0)*100,hi=(st.data&&st.data.loopHi)||0;
  surfDraw(ctx,C,v3(x0,y1,z-0.006),v3(1,0,0),v3(0,1,0),c=>{const cx=w*LOOPP.cx,cy=h*LOOPP.cy,rx=w*LOOPP.rx,ry=h*LOOPP.ry;
    c.strokeStyle=rgba([150,170,210],1);c.lineWidth=4;c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,TAU);c.stroke();
    // arrows round the loop, clockwise
    for(let i=0;i<10;i++){const an=-Math.PI/2+(i+0.5)/10*TAU,px=cx+Math.cos(an)*rx,py=cy+Math.sin(an)*ry,ta=an+Math.PI/2;c.save();c.translate(px,py);c.rotate(Math.atan2(Math.sin(ta)*ry,Math.cos(ta)*rx));c.fillStyle=rgba([150,170,210],1);c.beginPath();c.moveTo(6,0);c.lineTo(-4,-5);c.lineTo(-4,5);c.closePath();c.fill();c.restore();}
    STEPS10.forEach(([nm,sg],i)=>{const an=-Math.PI/2+i/10*TAU,px=cx+Math.cos(an)*rx,py=cy+Math.sin(an)*ry,ph=phaseOf(i),col=[[120,170,240],[240,170,90],[130,200,150],[190,150,230]][ph];
      c.fillStyle=rgba(mix(col,[255,255,255],0.75),1);c.beginPath();c.arc(px,py,15,0,TAU);c.fill();c.strokeStyle=rgba(col,1);c.lineWidth=3;c.stroke();
      Tw(c,sg,px,py+5.5,{w:800,size:sg.length>2?11:14,align:"center",color:rgba(mix(col,[0,0,0],0.45),1)});});
    Tw(c,"build",cx,cy+4,{w:800,size:16,align:"center",color:rgba([90,110,150],1)});});
  if(hi>0)glowQuad(ctx,C,[v3(x0-0.05,y0-0.05,z-0.01),v3(x1+0.05,y0-0.05,z-0.01),v3(x1+0.05,y1+0.05,z-0.01),v3(x0-0.05,y1+0.05,z-0.01)],hi);}

// ---- one building: open and furnished when the camera is in front of it, closed otherwise ----
function drawBuilding(ctx,C,b,st,figs){mxSet(b.x,b.z,b.ang);const R=b.R,E=mxL(C.eye);
  if(b.open&&(E.z<R.Z0+0.05||st.inside===b.id)){const fs=pj(C,v3(0,1.5,0)),lod=fs.z>NEAR&&b.w*fs.s<380?1:0;
    const Q=tRoom(ctx,C,R,Object.assign({lod},b.room||{}));const items=[];const add=(x,y,z,fn)=>items.push({z:eyeD(C,v3(x,y,z)),fn});
    FURNISH[b.id](ctx,C,b,R,Q,add,st,lod);if(st.hooks&&st.hooks[b.id])st.hooks[b.id](ctx,C,R,Q,add,lod);
    for(const f of figs)add(f.x,1,f.z+(f.dz||0),ctx=>{const B=tFig(ctx,C,f.id,f.x,f.z,Object.assign({y:R.FY},f));if(f.onDraw)f.onDraw(ctx,B);});
    items.sort((a,b)=>b.z-a.z);for(const it of items)it.fn(ctx);
    tShell(ctx,C,R,{wall:b.wall,roof:b.roof,band:b.band,plinth:mix(b.wall,[0,0,0],0.04)});}
  else tClosed(ctx,C,R,{wall:b.wall,roof:b.roof,band:b.band,frontWins:b.open?null:(ctx,C,R)=>frontDoor(ctx,C,R,b)});
  if(st.glowFront&&st.glowFront[b.id]>0){const a=st.glowFront[b.id];glowQuad(ctx,C,[v3(R.X0,0.02,R.Z0-0.02),v3(R.X1,0.02,R.Z0-0.02),v3(R.X1,R.HY+0.2,R.Z0-0.02),v3(R.X0,R.HY+0.2,R.Z0-0.02)],a);}
  // a name over the front, when the picture asks for it: drawn after the blur, so it stays sharp
  const nm=st.names&&st.names[b.id];if(nm>0){const P_=pj(C,v3(0,R.HY+0.32,R.Z0-0.1));if(P_.z>NEAR)lbAdd(c=>signBoard(c,clamp(P_.x,260,W-260),Math.max(P_.y+20,108),b.name,{size:32,dot:b.band,bg:[255,252,244],rim:mix(b.band,[120,90,40],0.25),a:nm}));}
  mxOff();}
// the front of a closed building: a door and windows
function frontDoor(ctx,C,R,b){const z=R.Z0-0.01,w=R.X1-R.X0;winQ(ctx,C,[v3(-0.45,R.FY-0.3,z),v3(0.45,R.FY-0.3,z),v3(0.45,R.FY+1.75,z),v3(-0.45,R.FY+1.75,z)],NRM.F,{glass:mix(b.band,[60,50,40],0.35)});
  for(const k of [-1,1])for(const yy of [[R.FY+0.75,R.FY+1.95]]){const xc=k*w*0.3;winQ(ctx,C,[v3(xc-0.4,yy[0],z),v3(xc+0.4,yy[0],z),v3(xc+0.4,yy[1],z),v3(xc-0.4,yy[1],z)],NRM.F,{});}}

// ---- the whole picture ----
// st: t, figs [{id,x,z,at?,dz?,onDraw?,...tFig options}], hooks, office/data states, names {id:alpha}, gold, glowFront, inside (a room the camera
// stands in), posts(C,add) and extra(C,add) (things in the painter's order), over(ctx,C) (on top, before the blur), ts (blur band), after(ctx)
function drawCampus(ctx,S,C,st){setScreen(ctx,S);LBQ=[];DL=[];hazeFor(C,1.8);tSky(ctx);campusGround(ctx,C,st);
  // people in a room are drawn with the room; everyone else stands on the green
  const inB={},out=[];BLD.forEach(b=>inB[b.id]=[]);
  for(const f of (st.figs||[])){if(f.at){inB[f.at].push(f);continue;}let placed=false;for(const b of BLD){if(!b.open)continue;mxSet(b.x,b.z,b.ang);const L=mxL(v3(f.x,0,f.z));mxOff();
      if(L.x>b.R.X0&&L.x<b.R.X1&&L.z>b.R.Z0-0.05&&L.z<b.R.Z1){inB[b.id].push(Object.assign({},f,{x:L.x,z:L.z}));placed=true;break;}}if(!placed)out.push(f);}
  for(const b of BLD){const c=bldP(b.id,0,1.5,b.d/2);const vis=csp(C,c);if(vis.z<-6)continue;const P_=pjc(C,vis);if(vis.z>NEAR&&(P_.x<-P_.s*8||P_.x>W+P_.s*8||P_.y<-P_.s*7||P_.y>H+P_.s*6))continue;
    dlAdd(Math.hypot(c.x-C.eye.x,c.y-C.eye.y,c.z-C.eye.z),ctx=>drawBuilding(ctx,C,b,st,inB[b.id]));}
  for(const [x,z,h,k] of NATURE.trees)dlAdd(eyeD(C,v3(x,h*0.4,z)),ctx=>tTree(ctx,C,x,z,h,mix([104,178,104],[150,190,96],k*0.4),{round:k>0.7}));
  for(const [x,z,r] of NATURE.shrubs)dlAdd(eyeD(C,v3(x,r,z)),ctx=>tShrub(ctx,C,x,z,r,[84,160,96]));
  for(const [x,z] of NATURE.lamps)dlAdd(eyeD(C,v3(x,1,z)),ctx=>tLamp(ctx,C,x,z,st.lamps||0));
  for(const [x,z,a] of NATURE.benches)dlAdd(eyeD(C,v3(x,0.4,z)),ctx=>tBench(ctx,C,x,z,a));
  const addAt=(p,fn)=>dlAdd(eyeD(C,p),fn);if(st.posts)st.posts(C,addAt);
  for(const f of out)dlAdd(eyeD(C,v3(f.x,0.8,f.z))-0.3,ctx=>{const B=tFig(ctx,C,f.id,f.x,f.z,f);if(f.onDraw)f.onDraw(ctx,B);});
  if(st.extra)st.extra(C,addAt);
  dlDraw(ctx);
  if(st.over)st.over(ctx,C);
  const ts=st.ts||C.ts||[250,860,7];tiltShift(ctx,ts[0],ts[1],ts[2],ts[3]);vignetteSoft(ctx,[60,70,110],0.14);
  lbDraw(ctx,S);setScreen(ctx,S);if(st.after)st.after(ctx);}
