/* ===== Leading data people: the people, in the room's light =====
   The people are the agent films' (films/what-an-agent-is/shared/src/people.js, bundled as it is): an adult's proportions, one
   three-quarter head (AG_FACE), arms down, a hand only on the thing the story is about (pose "hold"). Here they stand in a room whose
   window is on the right of the frame, whichever way they face, so each is drawn whole, then lit: the side towards the window takes a
   little of the sun's warmth, the side away from it a little of the room's cool shade, and a soft shadow of them falls on the wall
   behind, down and to the left. Skin keeps its own colour where the light falls.

   lp_person(ctx, who, x, y, s, o) draws a person as ag_person does (the same who, x, y, s and o: t, flip, pose, hold, front, nod, gaze,
   talk, smile, cut, covered), and returns the hands as it does. who is a name in LP_CAST (this module's people) or in the agent films'
   cast ("noor", "sam", "jun", "mei", "yusuf", "clara", "anil", "david"), or a spec of someone else (see people.js there). o.light:
     light   the place's light, a name in LP_LIGHT ("day" by default), for the warmth and the shade
     warm    how much of the window's warmth the near side takes, 0 to 1 (0.12)
     shade   how far the far side sinks into the room's shade, 0 to 1 (0.2)
     wall    the soft shadow on the wall: its strength, 0 to 1 (0.16; 0 when the person stands far from any wall, or out of doors),
             and wallDx, wallDy where it falls, in figure units ([-90, 40])
   o.a fades them (0 to 1), as the canvas's own opacity does: a person fading in or out is drawn whole first and laid on the picture
   at that opacity, so they never show through themselves.
   lp_body(ctx, who, x, floor, s, o): a person whole, standing, walking, sitting or kneeling, their feet on the floor at y = floor (at
   the end of this file, with what it takes). Use it where people act, meet or move in a place; keep half-figures for talk seen close.
   LP_CROWD and lp_crowd(i): eight people for a crowd, such as students in a teaching room of the building in section.
   lp_nameTag(ctx, x, y, who, o) writes a person's name and the line under it (their role): o.align, o.role, o.a. */

/* ---------------------------------------------------------------- the cast this module adds
   As the module's numbers set them (/mnt/project-files/leading-data-people/numbers.md): Helena Novak, the data manager, as the data
   management module drew her; Ivy Reyes, a new graduate data analyst; Graham Ellis, the new Director of Facilities. Noor Rahman, Sam
   Okafor, Jun Park, Yusuf Demir and the others are the agent films' (AG_CAST). Each was looked at full size, facing both ways, on 5
   November 2026. Their clothes keep clear of the five colours that mean something. */
const LP_CAST={
  helena:{name:"Helena Novak",role:"Data manager",skin:[230,192,164],hair:{style:"long",c:[102,62,44],streak:[150,128,116]},glasses:[58,46,42],earrings:[214,200,170],top:{kind:"blazer",c:[118,64,72],inner:[240,234,228]},breath:0.26},
  ivy:{name:"Ivy Reyes",role:"Data analyst",skin:[214,170,136],hair:{style:"bob",c:[38,28,26]},earrings:[214,200,170],top:{kind:"sweater",c:[74,72,78]},breath:0.33},
  graham:{name:"Graham Ellis",role:"Facilities",skin:[226,186,158],hair:{style:"cropped",c:[170,166,162]},glasses:[64,56,50],top:{kind:"blazer",c:[104,90,74],inner:[232,230,224]},breath:0.24}
};
/* people in a crowd (students in a teaching room, staff in a corridor), so the cast never stands in for them: eight, of many ages and
   backgrounds, in plain clothes that mean nothing (each with a key of its own: the agent films keep a painted person by key or name); lp_crowd(i) is the i-th, round and round. Drawn small, but each was looked at full
   size, facing both ways, on 5 November 2026. */
const LP_CROWD=[
  {key:"lpCrowd1",name:"",skin:[238,206,180],hair:{style:"bob",c:[196,150,96]},top:{kind:"sweater",c:[150,140,128]},breath:0.31},
  {key:"lpCrowd2",name:"",skin:[120,82,60],hair:{style:"coily",c:[26,22,20]},top:{kind:"overshirt",c:[96,92,90],inner:[226,222,214]},breath:0.27},
  {key:"lpCrowd3",name:"",skin:[214,172,138],hair:{style:"long",c:[30,24,22]},earrings:[214,200,170],top:{kind:"cardigan",c:[176,150,138],inner:[236,232,226]},breath:0.3},
  {key:"lpCrowd4",name:"",skin:[196,150,112],hair:{style:"cropped",c:[34,28,26]},top:{kind:"sweater",c:[110,104,112]},breath:0.26},
  {key:"lpCrowd5",name:"",skin:[230,196,170],hair:{style:"side",c:[132,96,62]},glasses:[60,52,46],top:{kind:"overshirt",c:[136,124,104],inner:[232,230,224]},breath:0.28},
  {key:"lpCrowd6",name:"",skin:[92,62,46],hair:{style:"bun",c:[24,20,20]},top:{kind:"cardigan",c:[164,150,128],inner:[234,230,222]},breath:0.29},
  {key:"lpCrowd7",name:"",skin:[226,190,160],hair:{style:"shaved",c:[60,48,40]},beard:[70,56,46],top:{kind:"sweater",c:[78,80,88]},breath:0.25},
  {key:"lpCrowd8",name:"",skin:[204,164,128],hair:{style:"bob",c:[52,36,30]},glasses:[44,40,40],top:{kind:"sweater",c:[188,176,160]},breath:0.32}];
const lp_crowd=i=>LP_CROWD[((i%LP_CROWD.length)+LP_CROWD.length)%LP_CROWD.length];
const lp_who=who=>typeof who==="string"&&LP_CAST[who]?LP_CAST[who]:who;

/* ---------------------------------------------------------------- a person in the room */
function lp_person(ctx,who,x,y,s,o){o=o||{};const a=ctx.globalAlpha*(o.a==null?1:o.a);if(a<0.004)return null;const W0=lp_who(who),Lg=o.__legs,
    L0=Object.assign({light:"day",warm:0.12,shade:0.2,wall:Lg?0:0.16,wallDx:-90,wallDy:40,floor:0.3},o.light||{}),Lt=LP_LIGHT[L0.light]||LP_LIGHT.day;
  const A=AG_FIG.anchor,m=ctx.getTransform(),M=m.translate(x,y).scale(o.flip?-s:s,s).translate(-A[0],-A[1]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  const pt=(fx,fy)=>[M.a*fx+M.c*fy+M.e,M.b*fx+M.d*fy+M.f],k=Math.hypot(M.a,M.b);
  // the part of the canvas the person (and what the near hand may hold) can reach: down to the soles for a whole person
  let L=1e9,R=-1e9,T0=1e9,B=-1e9;for(const [fx,fy] of [[-260,120],[Lg?900:820,120],[-260,Lg?2080:1160],[Lg?900:820,Lg?2080:1160]]){const q=pt(fx,fy);L=Math.min(L,q[0]);R=Math.max(R,q[0]);T0=Math.min(T0,q[1]);B=Math.max(B,q[1]);}
  L=Math.max(0,Math.floor(L));T0=Math.max(0,Math.floor(T0));R=Math.min(cw,Math.ceil(R));B=Math.min(ch,Math.ceil(B));if(R<=L||B<=T0)return null;const w=R-L,h=B-T0;
  // the person, whole, on a canvas of their own
  const [pc,px]=ag_buf("lpPerson",cw,ch);px.setTransform(m);let hands,o2=Object.assign({},o,{light:undefined,a:undefined,__legs:undefined});
  if(Lg){const P=ag_spec(W0);px.save();px.setTransform(M);
    if(Lg.pose==="walk")lp_legs(px,P,Lg.J,"walk");else ag_drawLayer(px,lp_legsPic(P,Lg.pose,Lg.J));px.restore();o2.covered=true;
    // sitting, the hands rest in the lap: both forearms forward, over the thighs
    if(Lg.J.arms&&(!o.pose||o.pose==="hang"))o2.pose=Lg.J.arms;}
  try{hands=ag_person(px,W0,x,y,s,o2);
    // a whole person's painted arms carry on past the waist to their hands
    if(Lg){const F=ag_fig(W0),P=F.P,pose=o2.pose&&o2.pose!=="hang"?(typeof o2.pose==="string"?(ag_namedPose(o2.pose)||{}):o2.pose):null,
        br=Math.sin((o.t||0)*TAU/(P.breath?1/P.breath:3.6))*2.2;
      px.save();px.setTransform(M);px.translate(0,br);if(!pose||!pose.far)lp_forearm(px,P,F.C,true);if(!pose)lp_forearm(px,P,F.C,false);px.restore();}}
  finally{px.setTransform(1,0,0,1,0,0);px.globalAlpha=1;}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);
  // a whole person's soft shadow on the floor, under their feet
  if(Lg&&L0.floor>0){const J=Lg.J,lo=pt(Math.min(J.N.A[0],J.F.A[0],J.N.K[0])-60,J.low),hi=pt(Math.max(J.N.A[0],J.F.A[0])+LP_LEGS.foot+40,J.low),cx=(lo[0]+hi[0])/2,
      rx=Math.abs(hi[0]-lo[0])/2+20*k,ry=Math.max(3,rx*0.14),g=ctx.createRadialGradient(0,0,0,0,0,1);
    g.addColorStop(0,rgba(LP.shade,L0.floor));g.addColorStop(1,rgba(LP.shade,0));ctx.globalAlpha=a;ctx.save();ctx.translate(cx,lo[1]);ctx.scale(rx,ry);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.fill();ctx.restore();}
  // the soft shadow on the wall: the silhouette made small and dark, laid back larger, down and to the left
  if(L0.wall>0){const sw=Math.max(2,Math.ceil(w/8)),sh=Math.max(2,Math.ceil(h/8)),[sc,sx]=ag_buf("lpWallShadow",sw,sh);sx.filter="blur(2px)";sx.drawImage(pc,L,T0,w,h,0,0,sw,sh);sx.filter="none";
    sx.globalCompositeOperation="source-in";sx.fillStyle=rgba(LP.shade,1);sx.fillRect(0,0,sw,sh);
    const dx=L0.wallDx*k,dy=L0.wallDy*k;ctx.globalAlpha=a*L0.wall*(Lt.a>0?1:0.6);ctx.imageSmoothingQuality="high";ctx.drawImage(sc,0,0,sw,sh,L+dx-w*0.03,T0+dy,w*1.06,h*1.02);}
  // the light: warm from the window on the right of the frame, the room's shade on the left
  px.globalCompositeOperation="source-atop";let g=px.createLinearGradient(L,0,R,0);
  g.addColorStop(0,rgba(LP.shade,L0.shade));g.addColorStop(0.5,rgba(LP.shade,L0.shade*0.25));g.addColorStop(0.62,rgba(Lt.col,0));g.addColorStop(1,rgba(Lt.col,L0.warm*(Lt.a>0?1:0.5)));
  px.fillStyle=g;px.fillRect(L,T0,w,h);px.globalCompositeOperation="source-over";
  ctx.globalAlpha=a;ctx.drawImage(pc,L,T0,w,h,L,T0,w,h);ctx.restore();
  return hands;}

// a person's name, and the line under it (their role)
function lp_nameTag(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P_=typeof who==="string"?(LP_CAST[who]||AG_CAST[who]):who,
    name=o.name||(P_&&P_.name)||String(who),role=o.role!=null?o.role:(P_&&P_.role)||"",al=o.align||"left";
  ctx.save();ctx.globalAlpha*=a;lp_T(ctx,name,x,y,{w:800,size:32,align:al});if(role)lp_T(ctx,role,x,y+38,{w:600,size:28,col:LP.mut,align:al});ctx.restore();}

/* ---------------------------------------------------------------- whole people: legs, feet and where they stand
   lp_body(ctx, who, x, floor, s, o) draws a person whole, standing, walking, sitting or kneeling, with their feet (or knee) on the
   floor at y = floor: x is where their neck meets their shoulders, as in lp_person, s their size. It takes lp_person's o (t, flip,
   pose, hold, nod, gaze, talk, smile, light, a), and:
     body    "stand" (the default), "walk", "sit" (on a seat as high as the knee: lp_seatY says where its top is) or "kneel" (the near
             knee on the ground, the far foot flat, as someone planting or looking closely at the ground)
     step    for "walk": how far through the stride, in strides (1: both feet once); lp_step(dist, s) gives it for a distance walked
     stride  for "walk": 0 to 1, how full the stride is (1 by default): ease it from 0 as someone sets off and back to 0 as they stop,
             and at 0 they stand as "stand" does, so a walk starts and ends without a jump
   Both arms are drawn live, hanging, so the hands show at the hips; a walking person's arms swing a little against their legs. A hand
   rises only for what the story is about (pose "hold", or {near: ...}, as in lp_person). The legs are painted in the person's
   own light, under the torso, so the hem of the top falls over the trousers or the skirt. who.bottom: {kind: "trousers" (default),
   "skirt" (to below the knee; hem 0 to 1 lowers it towards the ankle) or "long" (to the ankle), c: its colour}; who.shoe: the shoes'
   colour; who.legs: the legs' colour under a skirt (the skin's by default). People who say none get plain, quiet trousers and shoes.
   A soft shadow lies on the floor under them (o.light.floor, 0.3; 0 for none), and none on the wall unless o.light.wall says so.
   The legs' figure space carries on below the agent films' (the hips at figure y 1170, the knees at 1580, the soles at 2010), so a
   person is about seven and a half heads tall: s = 0.5 stands 860 px from crown to sole. */
const LP_LEGS={hipN:[210,1140],hipF:[336,1134],L1:432,L2:402,w:[150,112,96],bare:[136,86,56],fore:0.82,sole:30,foot:156,
  // each leg: [thigh, shin] in degrees from straight down, positive the way the person faces; foot: the foot's angle, positive toe down
  poses:{stand:{n:[-3,2],f:[5,1],fn:0,ff:0},
         sit:{n:[86,-2],f:[82,-6],fn:0,ff:0,fore:0.6,arms:{near:[4,64,"rest"],far:[0,58,"rest"]}},
         kneel:{n:[-6,-96],f:[84,-3],fn:58,ff:0}},
  trousers:[[58,60,70],[74,66,60],[92,86,74],[52,58,72],[86,80,72],[66,62,58]],shoes:[[44,38,36],[64,48,38],[36,36,40],[80,64,50]]};
// where a pose's lowest point (a sole or a knee) is below the neck, in figure units
function lp_legJoints(pose,step,stride){const G=LP_LEGS;let n,f,fn,ff,fo,arms=null;
  if(pose==="walk"){const ph=TAU*(step||0),sn=Math.sin(ph),cs=Math.cos(ph),bend=c=>6+40*Math.pow(Math.max(0,c),1.4);
    const k=stride==null?1:clamp(stride,0,1),S=G.poses.stand,m=(a,b)=>[lerp(a[0],b[0],k),lerp(a[1],b[1],k)];
    n=m(S.n,[22*sn,22*sn-bend(cs)]);f=m(S.f,[-22*sn,-22*sn-bend(-cs)]);fn=k*(cs>0?12*cs:0);ff=k*(cs<0?-12*cs:0);}
  else{const P=G.poses[pose]||G.poses.stand;n=P.n;f=P.f;fn=P.fn;ff=P.ff;fo=P.fore;arms=P.arms;}
  const leg=(H,a)=>{const a1=a[0]*Math.PI/180,a2=a[1]*Math.PI/180,K=[H[0]+Math.sin(a1)*G.L1*(fo||G.fore),H[1]+Math.cos(a1)*G.L1],
    A=[K[0]+Math.sin(a2)*G.L2*G.fore,K[1]+Math.cos(a2)*G.L2];return{H,K,A,a};};
  const N=leg(G.hipN,n),F=leg(G.hipF,f);
  // the lowest point: a sole (the ankle and the shoe under it), or a knee on the ground
  const low=L=>Math.max(L.A[1]+G.sole,pose==="kneel"?L.K[1]+G.w[1]*0.5:-1e9);
  return{N,F,fn,ff,arms,low:Math.max(low(N),low(F))};}
const LP_FLOOR={};for(const p of ["stand","sit","kneel","walk"])LP_FLOOR[p]=lp_legJoints(p,0).low-AG_FIG.anchor[1];
// the height of a seat's top for someone sitting with their feet on the floor at y = floor
const lp_seatY=(floor,s)=>floor-(LP_FLOOR.sit+AG_FIG.anchor[1]-LP_LEGS.hipN[1]-LP_LEGS.w[0]*0.5)*s;
// a walk's step for a distance walked in the frame: one stride covers about 2.2 thighs and shins seen at three-quarters
const lp_step=(dist,s)=>dist/((LP_LEGS.L1+LP_LEGS.L2)*2*Math.sin(22*Math.PI/180)*2*LP_LEGS.fore*s);
function lp_bottomOf(P){const b=P.bottom||{},h=hash((P.key||P.name||"x").length,(P.skin||[0])[0]);
  return{kind:b.kind||"trousers",c:b.c||LP_LEGS.trousers[Math.floor(h*LP_LEGS.trousers.length)%LP_LEGS.trousers.length],hem:b.hem||0,
    shoe:P.shoe||LP_LEGS.shoes[Math.floor(hash(h*97,3)*LP_LEGS.shoes.length)%LP_LEGS.shoes.length],legs:P.legs||P.skin};}
// a shoe at the ankle A, pointing the way the person faces, tipped by deg (toe down)
function lp_shoe(c,A,deg,col,back){const L=LP_LEGS.foot;c.save();c.translate(A[0],A[1]);c.rotate(deg*Math.PI/180);
  const base=back?ag_dk(col,0.18):col;
  ag_soft(c,cc=>{cc.moveTo(-34,-22);cc.bezierCurveTo(-10,-30,22,-26,40,-14);cc.bezierCurveTo(70,-8,L-6,0,L+4,14);cc.bezierCurveTo(L+8,24,L,32,L-16,32);
    cc.lineTo(-30,32);cc.bezierCurveTo(-44,32,-48,14,-44,0);cc.bezierCurveTo(-42,-10,-40,-18,-34,-22);cc.closePath();},
    ag_dk(base,0.05),ag_lt(base,0.35),L*0.55,-10,90,rgba(ag_dk(base,0.8),0.35),8);
  c.fillStyle=rgba(ag_dk(base,0.45),0.9);c.fillRect(-36,26,L+30,6);c.restore();}
// a leg: the thigh and shin as one tapering shape (the agent films' arm, made longer), in its cloth, the shin bare under a skirt
function lp_leg(c,L,B,back,bare){const G=LP_LEGS,col=back?ag_dk(B.c,0.16):B.c,fn=ag_armPath(L.H,L.K,L.A,bare?G.bare:G.w),
    hx=L.H[0]+60,hy=L.H[1]+120,d=[L.A[0]-L.K[0],L.A[1]-L.K[1]],dl=Math.hypot(d[0],d[1])||1,u=[d[0]/dl,d[1]/dl],v=[-u[1],u[0]];
  // the hem: the leg ends square across the shin at the ankle, over the top of the shoe
  c.save();c.beginPath();const E=(a,b)=>[L.A[0]+u[0]*a+v[0]*b,L.A[1]+u[1]*a+v[1]*b];for(const q of [E(4,-400),E(4,400),E(-3000,400),E(-3000,-400)])c.lineTo(q[0],q[1]);c.closePath();c.clip();
  if(bare){const sk=back?ag_dk(B.legs,0.14):B.legs;ag_soft(c,fn,ag_dk(sk,0.12),ag_lt(sk,0.3),L.K[0]+30,L.K[1]+80,220,rgba(ag_dk(sk,0.7),0.35),14);}
  else{ag_soft(c,fn,ag_dk(col,0.1),ag_lt(col,0.24),hx,hy,320,rgba(ag_dk(col,0.8),0.36),16);
    // a soft crease behind the knee, and the hem's shadow on the shoe
    c.save();ag_shape(c,fn);c.clip();c.strokeStyle=rgba(ag_dk(col,0.75),0.16);c.lineWidth=3;c.lineCap="round";
    c.beginPath();c.moveTo(L.K[0]-30,L.K[1]+20);c.quadraticCurveTo(L.K[0]-6,L.K[1]+34,L.K[0]+14,L.K[1]+60);c.stroke();
    const a=E(-6,-60),b=E(-6,60);c.strokeStyle=rgba(ag_dk(col,0.6),0.35);c.lineWidth=4;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.restore();}
  c.restore();}
// a skirt over standing or walking legs: from the waist to its hem, a little wider than the knees
function lp_skirt(c,B,J){const col=B.c,long=B.kind==="long",N=J.N,F=J.F,u=long?0.9:Math.min(0.85,0.12+B.hem*0.75),
    at=L=>[lerp(L.K[0],L.A[0],u),lerp(L.K[1],L.A[1],u)],hn=at(N),hf=at(F),y=Math.max(hn[1],hf[1]),
    x0=Math.min(hn[0],hf[0])-74,x1=Math.max(hn[0],hf[0])+78;
  const fn=cc=>{cc.moveTo(126,1056);cc.lineTo(410,1056);cc.bezierCurveTo(424,1140,440,1260,x1-10,y-40);cc.quadraticCurveTo(x1+6,y-10,x1,y);
    cc.bezierCurveTo((x0+x1)/2+60,y+16,(x0+x1)/2-60,y+10,x0,y-2);cc.quadraticCurveTo(x0-6,y-16,x0+6,y-44);cc.bezierCurveTo(100,1260,112,1140,126,1056);cc.closePath();};
  ag_soft(c,fn,ag_dk(col,0.08),ag_lt(col,0.28),370,1180,340,rgba(ag_dk(col,0.8),0.4),24);
  c.save();ag_shape(c,fn);c.clip();c.strokeStyle=rgba(ag_dk(col,0.7),0.2);c.lineWidth=3;c.lineCap="round";
  for(const k of [0.3,0.55,0.78]){const xa=lerp(126,410,k),xb=lerp(x0,x1,k);c.beginPath();c.moveTo(xa,1200);c.quadraticCurveTo((xa+xb)/2+6,(1200+y)/2,xb,y-6);c.stroke();}c.restore();}
// the legs, the shoes and the seat, in figure space, under the torso: the far leg behind, then the seat, then the near leg
function lp_legs(c,P,J,pose){const B=lp_bottomOf(P),G=LP_LEGS,skirt=B.kind==="skirt"||B.kind==="long";
  const shoe=(L,deg,back)=>lp_shoe(c,L.A,deg+(pose==="kneel"&&L===J.N?0:0),B.shoe,back);
  const draped=skirt&&(pose==="sit"||pose==="kneel");
  // under a skirt, standing or walking, the legs show only below it; sitting or kneeling, the thighs are in the skirt's cloth
  const bare=skirt&&B.kind!=="long";
  shoe(J.F,J.ff,true);lp_leg(c,J.F,B,true,bare);
  if(draped){const tB=Object.assign({},B);lp_leg(c,{H:J.F.H,K:J.F.K,A:[lerp(J.F.K[0],J.F.A[0],0.32),lerp(J.F.K[1],J.F.A[1],0.32)]},tB,true,false);}
  if(pose==="kneel"){lp_leg(c,J.N,B,false,bare);shoe(J.N,J.fn,false);}else{shoe(J.N,J.fn,false);lp_leg(c,J.N,B,false,bare);}
  if(draped)lp_leg(c,{H:J.N.H,K:J.N.K,A:[lerp(J.N.K[0],J.N.A[0],0.32),lerp(J.N.K[1],J.N.A[1],0.32)]},B,false,false);
  if(skirt&&!draped)lp_skirt(c,B,J);
  // sitting or kneeling, the seat: the hips rounded behind, from under the top's hem down to the thighs
  if(pose==="sit"||pose==="kneel"){const col=B.c,fn=cc=>{cc.moveTo(126,1050);cc.lineTo(300,1050);cc.lineTo(300,1214);cc.bezierCurveTo(220,1216,150,1212,124,1190);
      cc.bezierCurveTo(104,1160,108,1100,126,1050);cc.closePath();};
    ag_soft(c,fn,ag_dk(col,0.12),ag_lt(col,0.2),260,1110,160);
    c.save();ag_shape(c,fn);c.clip();c.strokeStyle=rgba(ag_dk(col,0.6),0.3);c.lineWidth=3;c.beginPath();c.moveTo(118,1150);c.bezierCurveTo(130,1196,190,1212,250,1212);c.stroke();c.restore();}}
// the painted arms' forearms, from just above the waist (where the agent films' arms end, flat, at figure y 1100) to the wrists, with
// the hands hanging at rest: drawn over the person, along the painted arm's own edges, so no seam shows where the two meet
const LP_FORE={near:{top:1046,W:[260,1178],u:[0.435,0.9],w:74,up:1,
    path:(c,a,b)=>{c.moveTo(78,900);c.bezierCurveTo(84,930,110,990,140,1040);c.lineTo(170,1100);c.lineTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(274,1100);
      c.bezierCurveTo(262,1074,252,1054,246,1040);c.bezierCurveTo(222,1000,200,960,191,900);c.closePath();}},
  far:{top:1040,W:[446,1176],u:[-0.05,1],w:68,up:-1,clipX:414,
    path:(c,a,b)=>{c.moveTo(472,800);c.bezierCurveTo(472,860,468,920,464,960);c.bezierCurveTo(460,1000,456,1050,452,1100);c.lineTo(a[0],a[1]);c.lineTo(b[0],b[1]);
      c.lineTo(404,1100);c.lineTo(404,800);c.closePath();}}};
function lp_forearm(c,P,C,far){const A=LP_FORE[far?"far":"near"],sw=P.top.c,u=A.u,v=[u[1],-u[0]],h=A.w/2,W=A.W,
    out=[W[0]-v[0]*h,W[1]-v[1]*h],inn=[W[0]+v[0]*h,W[1]+v[1]*h],fn=cc=>far?A.path(cc,inn,out):A.path(cc,out,inn),col=far?ag_dk(sw,0.18):ag_dk(sw,0.2);
  c.save();c.beginPath();c.rect(A.clipX||-200,A.top,800,600);c.clip();
  ag_soft(c,fn,col,ag_lt(sw,far?0.28:0.25),far?474:150,far?700:660,far?140:170,rgba(ag_dk(sw,0.8),far?0.42:0.4),far?24:26);
  const ah=Math.atan2(u[1],u[0]);ag_hand(c,[W[0]+u[0]*6,W[1]+u[1]*6],ah,"rest",P,C,A.up);
  c.translate(W[0],W[1]);c.rotate(ah);c.fillStyle=rgba(ag_dk(far?ag_dk(sw,0.14):sw,0.12),1);rr(c,-16,-h-3,20,A.w+6,8);c.fill();c.restore();}
const LP_LEGPICS={};   // kept pictures of still legs, by person and pose
function lp_legsPic(P,pose,J){const k=(P.key||P.name)+"|"+pose;let L=LP_LEGPICS[k];if(L)return L;
  return(LP_LEGPICS[k]=ag_layer(c=>lp_legs(c,P,J,pose),[-200,1040,880,2060]));}

function lp_body(ctx,who,x,floor,s,o){o=o||{};const pose=o.body||"stand";if(!LP_FLOOR[pose]&&window.__RENDER__)throw new Error('body "'+pose+'": stand, walk, sit or kneel (people.js, lp_body)');
  const J=lp_legJoints(pose,o.step,o.stride),y=floor-(J.low-AG_FIG.anchor[1])*s;
  return lp_person(ctx,who,x,y,s,Object.assign({},o,{__legs:{pose,J}}));}
