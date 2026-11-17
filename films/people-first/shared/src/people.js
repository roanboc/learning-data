/* ===== The people kit: people =====
   A person is a row in a table (skin, hair, top, bottom, shoes, what they wear on the face); a pose is a row of angles; a face is
   three numbers. PK.person draws any person in any pose, whole, with their feet on the floor, seen three-quarters from the side,
   facing right (or left: flip). Angles are in degrees from straight down, positive the way the person faces.

   PK.person(ctx, who, x, floor, h, pose, o) -> the joints, in the frame's px (J.hc the head's centre, J.hdN and J.hdF the hands,
     J.shN the near shoulder, J.hip, J.kN the near knee, J.nN the near ankle).
     who    a name in PK.CAST, or a row like its rows
     x      under the hips; floor: where the feet stand (for a sitting person the floor under the seat; kneeling, the ground)
     h      how tall they stand, in px. In a place with an eye line, PK.hAt(floor, eye) gives the size at each depth
     pose   a name in PK.POSES, a row like its rows, or PK.poseMix(a, b, t); PK.poseWalk(step) for a stride
     o.flip     faces left (true), or a number from 0 to 1: a turn from right to left, to cross in about a quarter of a second
     o.expr     a face: a name in PK.EXPR or {brow, smile, open}; o.gaze [x, y] moves the eyes; o.nod tilts the head (radians)
     o.reachN, o.reachF   a point of the frame the near or far hand rests on: the arm follows; o.reachNk, o.reachFk (0 to 1) blend it in
     o.hold(ctx, hand, deg, J)   draws what the near hand holds, over the hand; o.under and o.underF the same, under a hand
     o.part     "lower" (the legs, to draw behind a table) or "upper" (the rest, in front of it); both by default
     o.side     how far the body is seen from the side (0 to 1); by default it follows the pose (PK.side): someone who sits, kneels,
                crouches or bends forward is drawn from the side, as their legs are
     o.seat     a seat's height above the floor, px, for a seat that isn't a chair's height (a stool, a log): the feet may hang
     o.t        the time, for breath and blinks; o.far (0 to 1) fades the line with distance; o.shade 0: no shadow on the ground
     o.a        fades the person, as one picture
   PK.walk(ctx, who, t, w, o) walks a person from w.x0 to w.x1 between w.t0 and w.t1 (the stride dies away as they stop), then
     takes up w.then (a pose); w.floor a number or a function of x; w.h a number or a function of the floor; w.arms {aN, aF} keeps
     arms that carry something; w.before a pose to stand in before they set off. o as PK.person's (o.hold and the rest).
   PK.poseMix(a, b, t), PK.exprMix(a, b, t), PK.talk(t, t0, t1) (a mouth that opens and closes while someone speaks).
   PK.poseSit(k, stand, sit): sitting down or standing up (k: 0 standing, 1 seated), leaning forward on the way.
   Every pose a person takes up is blended from the one before (poseMix, or PK.walk), never switched to. */
(K=>{
const {TAU,rad,lerp,clamp,sine,pin,pio,mix,dk,lt,css,hash,polar,pg,spline,capsule,rrect,ell}=K.u;

/* ---------------------------------------------------------------- the cast: the university's people, as the module's films know them */
K.CAST={
  ivy:{name:"Ivy Reyes",role:"Data analyst",skin:[230,188,156],hair:{style:"bob",c:[40,32,38]},top:{kind:"sweater",c:[104,112,130]},bottom:{kind:"trousers",c:[60,64,86]},shoe:[62,50,56]},
  helena:{name:"Helena Novak",role:"Data manager",skin:[242,210,186],hair:{style:"long",c:[132,78,50]},glasses:[70,52,50],top:{kind:"jacket",c:[150,70,88],inner:[246,238,226]},bottom:{kind:"trousers",c:[78,62,74]},shoe:[66,46,48]},
  graham:{name:"Graham Ellis",role:"Facilities",skin:[238,202,178],hair:{style:"short",c:[186,182,180]},glasses:[70,62,60],top:{kind:"jacket",c:[128,114,96],inner:[242,238,230]},bottom:{kind:"trousers",c:[78,84,104]},shoe:[70,54,46]},
  mei:{name:"Mei Tanaka",role:"Registrar's office",skin:[242,208,178],hair:{style:"bun",c:[38,30,36]},top:{kind:"jacket",c:[128,168,148],inner:[246,240,228]},bottom:{kind:"skirt",c:[70,76,98]},shoe:[56,46,52]},
  sam:{name:"Sam Okafor",role:"Data platform",skin:[120,80,58],hair:{style:"coily",c:[34,26,26]},glasses:[40,32,32],top:{kind:"jacket",c:[98,128,160],inner:[238,238,234]},bottom:{kind:"trousers",c:[60,62,80]},shoe:[52,42,42]},
  jun:{name:"Jun Park",role:"Analytics engineer",skin:[238,202,170],hair:{style:"crop",c:[34,28,34]},glasses:[44,36,40],top:{kind:"sweater",c:[66,158,138]},bottom:{kind:"trousers",c:[76,78,96]},shoe:[58,48,48]},
  noor:{name:"Noor Rahman",role:"Data architect",skin:[184,132,100],hair:{style:"long",c:[30,24,26]},earrings:[226,214,190],top:{kind:"jacket",c:[86,104,124],inner:[234,236,240]},bottom:{kind:"trousers",c:[62,60,72]},shoe:[50,42,44]},
  yusuf:{name:"Yusuf Demir",role:"Data governance lead",skin:[212,168,132],hair:{style:"short",c:[44,34,32]},beard:[52,40,36],top:{kind:"jacket",c:[168,104,84],inner:[240,234,224]},bottom:{kind:"trousers",c:[74,70,76]},shoe:[60,46,40]},
  marta:{name:"Marta Silva",role:"Data analyst",skin:[164,114,86],hair:{style:"coily",c:[44,32,28]},earrings:[226,190,128],top:{kind:"jacket",c:[190,168,140],inner:[92,84,88]},bottom:{kind:"trousers",c:[92,76,70]},shoe:[62,48,44]},
  erin:{name:"Erin Walsh",role:"Platform engineer",skin:[240,204,178],hair:{style:"bun",c:[150,88,54]},top:{kind:"sweater",c:[146,122,110]},bottom:{kind:"trousers",c:[66,70,88]},shoe:[58,48,50]},
  tomas:{name:"Tomás Ortega",role:"Report developer",skin:[206,158,122],hair:{style:"short",c:[52,40,34]},beard:[64,50,44],top:{kind:"sweater",c:[150,96,90]},bottom:{kind:"trousers",c:[70,72,84]},shoe:[58,46,42]}
};
/* people nobody names: students, staff, passers-by. PK.extra(i) is the i-th, of many backgrounds, the same every time */
const X_SKIN=[[244,212,186],[226,180,146],[198,150,114],[160,112,84],[118,78,56],[92,60,44],[236,196,160]],X_HAIR=[[40,32,36],[92,60,40],[150,104,62],[30,24,24],[196,150,96],[62,44,40]],
  X_TOP=[[214,170,150],[150,170,160],[226,196,130],[132,140,170],[196,120,110],[120,150,140],[232,220,200],[170,150,190],[110,120,130]],X_BOT=[[70,76,98],[86,78,74],[112,104,96],[60,64,86],[150,128,100]],
  X_STYLE=["short","bob","long","coily","bun","crop"];
const X_MEMO={};
const X_NEAR=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])<110;   // hair the colour of the skin under it hides the face
// hair for a skin: never its own colour, and dark hair with a dark skin (fair hair there reads as a cap)
const X_HAIRFOR=(i,sk)=>{const h=X_HAIR[(i*7+3)%6];return X_NEAR(h,sk)||(sk[0]+sk[1]+sk[2]<400&&h[0]>100)?X_HAIR[i%2?0:3]:h;};
K.extra=i=>X_MEMO[i]||(X_MEMO[i]={key:"extra"+i,name:"",skin:X_SKIN[(i*3+1)%7],hair:{style:X_STYLE[(i*5+2)%6],c:X_HAIRFOR(i,X_SKIN[(i*3+1)%7])},glasses:i%4===1?[60,50,50]:null,
    top:{kind:i%3===0?"jacket":"sweater",c:X_TOP[(i*4+1)%9],inner:[244,238,228]},bottom:{kind:i%5===3?"skirt":"trousers",c:X_BOT[(i*3)%5]},shoe:[64,52,52]});
// a child: a larger head and shorter legs for their height
K.KID={head:1.34,neck:0.8,torso:0.98,thigh:0.84,shin:0.84,uarm:0.92,farm:0.92,hand:1.12,shW:0.9,hipW:0.92,foot:1.1};

/* ---------------------------------------------------------------- poses and faces
   a pose: lean (the back, forwards), head (the head's tilt, added to the lean), aN and aF (near and far arm: [upper arm, forearm,
   hand]; a hand is "rest", "open", "point", "grip" or "flat"), lN and lF (near and far leg: [thigh, shin]), fN and fF (the feet:
   toe down is positive), mode ("stand"; "sit": the hips on a seat; "kneel": the knees on the ground) */
K.POSES={
  stand:{lean:0,head:0,aN:[2,9],aF:[5,12],lN:[-2,-2],lF:[4,3]},
  listen:{lean:5,head:3,aN:[4,22],aF:[6,16],lN:[-2,-2],lF:[5,4]},
  talk:{lean:3,head:-3,aN:[20,92,"open"],aF:[6,14],lN:[-2,-2],lF:[5,4]},
  explain:{lean:4,head:-2,aN:[20,84,"open"],aF:[12,60,"open"],lN:[-2,-2],lF:[6,5]},
  point:{lean:5,head:-2,aN:[58,82,"point"],aF:[4,12],lN:[-3,-3],lF:[6,5]},
  wave:{lean:0,head:-3,aN:[150,196,"open"],aF:[5,12],lN:[-2,-2],lF:[4,3]},
  armful:{lean:-4,head:2,aN:[16,84,"grip"],aF:[24,92,"grip"],lN:[-2,-2],lF:[4,3]},
  can:{lean:-2,head:1,aN:[2,4,"grip"],aF:[10,20],lN:[-2,-2],lF:[4,3]},
  bend:{lean:17,head:9,aN:[10,58],aF:[16,66],lN:[-2,-2],lF:[5,4]},
  sit:{mode:"sit",lean:3,head:0,aN:[14,62],aF:[2,52],lN:[86,3],lF:[82,-5]},
  sitIn:{mode:"sit",lean:14,head:-5,aN:[30,96,"open"],aF:[0,58],lN:[86,4],lF:[82,-6]},
  sitBack:{mode:"sit",lean:-6,head:-2,aN:[10,58],aF:[0,50],lN:[86,10],lF:[82,2]},
  sitWork:{mode:"sit",lean:7,head:4,aN:[30,84,"flat"],aF:[34,88,"flat"],lN:[86,4],lF:[82,-4]},
  kneel:{mode:"kneel",lean:26,head:-8,aN:[42,24,"grip"],aF:[4,30],lN:[28,-90],lF:[40,-88],fN:70,fF:70},
  crouch:{mode:"stand",lean:22,head:-10,aN:[40,64],aF:[34,54],lN:[114,-34],lF:[106,-42],fN:0,fF:12}
};
K.EXPR={neutral:{brow:0,smile:0.3,open:0},smile:{brow:0.25,smile:0.9,open:0},worry:{brow:-0.9,smile:-0.4,open:0},talk:{brow:0.35,smile:0.25,open:0.7},
  listen:{brow:0.25,smile:0.15,open:0},relief:{brow:0.5,smile:0.7,open:0.1},think:{brow:-0.35,smile:-0.05,open:0},glad:{brow:0.6,smile:1,open:0.35}};
const poseOf=p=>typeof p==="string"?K.POSES[p]:p,exprOf=e=>typeof e==="string"?K.EXPR[e]:(e||K.EXPR.neutral);
K.poseMix=(a,b,t)=>{a=poseOf(a);b=poseOf(b);if(t<=0)return a;if(t>=1)return b;const o={mode:(t<0.5?a:b).mode};
  for(const k of ["lean","head","fN","fF"])o[k]=lerp(a[k]||0,b[k]||0,t);
  for(const k of ["aN","aF","lN","lF"]){o[k]=[lerp(a[k][0],b[k][0],t),lerp(a[k][1],b[k][1],t)];if(k[0]==="a")o[k][2]=(t<0.5?a:b)[k][2];}return o;};
K.exprMix=(a,b,t)=>{a=exprOf(a);b=exprOf(b);t=clamp(t,0,1);return{brow:lerp(a.brow,b.brow,t),smile:lerp(a.smile,b.smile,t),open:lerp(a.open||0,b.open||0,t)};};
/* sitting down or standing up (k: 0 standing, 1 seated): the back leans forward on the way, as a body does to keep its balance, and
   the feet stay under the hips until the seat takes the weight; only then do the legs come forward. Never poseMix a stand and a sit:
   half way, that is someone falling backwards with stiff legs */
K.poseSit=(k,stand,sit)=>{k=clamp(k,0,1);const p=K.poseMix(stand||"stand",sit||"sit",k),b=Math.sin(Math.PI*k);
  return Object.assign({},p,{lean:(p.lean||0)+20*b,head:(p.head||0)-5*b,lN:[p.lN[0],p.lN[1]-50*b],lF:[p.lF[0],p.lF[1]-50*b]});};
// a mouth that opens and closes while someone speaks, from t0 to t1
K.talk=(t,t0,t1)=>pio(t,t0,t1,0.18)*(0.35+0.65*Math.abs(Math.sin(t*8.2+Math.sin(t*3.1))));
/* a stride: where each leg and arm is at this point of it (step: 1 is both feet once), blended in from standing by k.
   PK.strideOf(h): how far one stride carries a person h tall, so the feet don't slide */
K.poseWalk=(step,k,amp)=>{k=k==null?1:k;amp=amp||1;const ph=TAU*step,s=Math.sin(ph),c=Math.cos(ph),g=24*amp,ar=20*(0.4+0.6*amp),bend=x=>(7+32*Math.pow(Math.max(0,x),1.5))*amp;
  const W={lean:4,head:0,aN:[-ar*s,-ar*s+16+6*c],aF:[ar*s,ar*s+16-6*c],lN:[g*s,g*s-bend(c)],lF:[-g*s,-g*s-bend(-c)],fN:(c>0?12*c:-6*s)*amp,fF:(c<0?-12*c:6*s)*amp};
  return k>=1?W:K.poseMix("stand",W,k);};
// amp: how long the steps are (1 by default; a long skirt keeps them shorter, PK.ampOf)
K.strideOf=(h,amp)=>h*0.7*(amp||1);
K.ampOf=P=>P.bottom&&P.bottom.kind==="long"?0.6:P.kid?0.9:1;
K.hAt=(floor,eye)=>(floor-eye)/0.91;           // a standing adult's height where their eyes are on the place's eye line
K.seatOf=h=>{const p=K.S.prop;return(p.shin+p.ankle-p.leg[0]*0.32)*h/1000;};   // a chair's seat, above the floor, for someone h tall

/* where every joint is, in frame px, for a person h px tall with their feet (or seat, or knees) placed by the pose */
const propOf=P=>{const S=K.S;if(!P.build&&!P.kid)return S.prop;const key=S.key+"|"+(P.key||P.name);P._p=P._p||{};if(P._p[key])return P._p[key];
  const b=Object.assign({},P.kid?K.KID:{},P.build||{}),q={};for(const j in S.prop){const v=S.prop[j],f=b[j]||1;q[j]=Array.isArray(v)?v.map(x=>x*(b.thick||1)):v*f;}return P._p[key]=K.norm(q);};
/* A standing person is seen three-quarters on: both shoulders show, and the legs stand side by side. Legs that fold (a seat, a
   kneel, a crouch) and a back that bends forward move in the frame's plane, as seen from the side, so the body turns with them:
   K.side(pose) is how far (0: three-quarters, 1: from the side). The torso is then drawn as deep as a body is from the side, the
   shoulders come to its middle, one behind the other, and the legs lie one behind the other. o.side sets it by hand. */
K.side=pose=>{pose=poseOf(pose);return clamp(Math.max((Math.max(Math.abs(pose.lN[0]-pose.lN[1]),Math.abs(pose.lF[0]-pose.lF[1]))-40)/40,(Math.abs(pose.lean||0)-6)/16),0,1);};
/* A turn (o.flip between 0 and 1) goes through the front, as a body does: k is how far the person is still seen from the side they
   face (1: as drawn, 0: from the front; past the front the picture is mirrored). What reaches forwards (a stride, a seated thigh, an
   arm held out, a lean) is seen shorter by k, while the body and the head keep their width, the shoulders and hips open to their
   full width, and the feet point at us: so nobody is ever seen edge on, as a sheet of paper would be. */
const turnOf=o=>{const fl=o.flip===true?1:(o.flip||0),c=Math.cos(Math.PI*fl);return{c,k:Math.abs(c)>0.999?1:Math.abs(c),sg:c<0?-1:1};};
const scr=(deg,k)=>k>=1?deg:Math.atan2(Math.sin(rad(deg))*k,Math.cos(rad(deg)))*180/Math.PI;   // an angle as it is seen, k of the way round
function rig(P,pose,x,floor,h,o){const p=propOf(P),u=h/1000,M=pose.mode||"stand",{k,sg}=turnOf(o),L=(q,deg,len,kk)=>[q[0]+Math.sin(rad(deg))*len*u*(kk==null?k:kk),q[1]+Math.cos(rad(deg))*len*u],
    pr0=o.side!=null?clamp(o.side,0,1):K.side(pose),pr=pr0*k;
  const hw=p.hipW*u*lerp(1,0.22,pr),hip=[0,0],hN=[-hw,0],hF=[hw,-3*u*k],kN=L(hN,pose.lN[0],p.thigh),kF=L(hF,pose.lF[0],p.thigh),nN=L(kN,pose.lN[1],p.shin),nF=L(kF,pose.lF[1],p.shin);
  // how far the hips are above the floor: on whatever is lowest, the feet or the knees, so a person who sits down, kneels or stands
  // up stays on the ground all the way; on a seat of a given height (o.seat), the hips rest on it and the feet go where the legs put them
  const low=M==="sit"&&o.seat!=null?o.seat+p.leg[0]*u*0.42:Math.max(kN[1]+p.leg[1]*u*0.5,kF[1]+p.leg[1]*u*0.5,nN[1]+p.ankle*u,nF[1]+p.ankle*u);
  // someone who sits facing us: their knees come towards us, so a little down the frame, and their feet with them
  if(M==="sit"&&k<1)for(const [kn,an,deg] of [[kN,nN,pose.lN[0]],[kF,nF,pose.lF[0]]]){const d=(1-k)*0.15*p.thigh*u*Math.abs(Math.sin(rad(deg)));kn[1]+=d;an[1]+=d;}
  const le=rad(scr(pose.lean||0,k)),ax=[Math.cos(le),Math.sin(le)],up=[Math.sin(le),-Math.cos(le)],T=p.torso*u;
  // the shoulders: one before the other from the side, side by side from the front
  const sw=p.shW*u,sn=lerp(sw*1.06,sw*lerp(1,0.06,pr0),k),sf=lerp(sw*1.06,sw*0.8*lerp(1,0.16,pr0),k),dN=lerp(32,34,k)*u,dF=lerp(32,30,k)*u;
  const sc=[up[0]*T,up[1]*T],shN=[sc[0]-ax[0]*sn-up[0]*dN,sc[1]-ax[1]*sn-up[1]*dN],shF=[sc[0]+ax[0]*sf-up[0]*dF,sc[1]+ax[1]*sf-up[1]*dF];
  const ha=rad(scr((pose.lean||0)*0.55+(pose.head||0),k)),hu=[Math.sin(ha),-Math.cos(ha)],nb=[sc[0]+up[0]*4*u,sc[1]+up[1]*4*u],hc=[nb[0]+hu[0]*(p.neck+p.head*0.5)*u,nb[1]+hu[1]*(p.neck+p.head*0.5)*u];
  const reach=(sh,a,tg,rk)=>{if(!tg||rk===0)return a;const q=ik(sh,[(tg[0]-x)*sg,tg[1]-(floor-low)],p.uarm*u,(p.farm+p.hand*0.45)*u);
    return rk==null||rk>=1?[q[0],q[1],a[2]]:[lerp(a[0],q[0],rk),lerp(a[1],q[1],rk),a[2]];};
  // an arm that rests on something is in the frame's plane already: it is seen whole, however far round the person is
  const aN=reach(shN,pose.aN,o.reachN,o.reachNk),aF=reach(shF,pose.aF,o.reachF,o.reachFk),rN=o.reachN?(o.reachNk==null?1:clamp(o.reachNk,0,1)):0,rF=o.reachF?(o.reachFk==null?1:clamp(o.reachFk,0,1)):0,
    kaN=lerp(k,1,rN),kaF=lerp(k,1,rF);
  const eN=L(shN,aN[0],p.uarm,kaN),wN=L(eN,aN[1],p.farm,kaN),eF=L(shF,aF[0],p.uarm,kaF),wF=L(eF,aF[1],p.farm,kaF);
  const J={hip,hN,hF,kN,kF,nN,nF,sc,shN,shF,nb,hc,eN,wN,eF,wF};for(const j in J)J[j]=[x+J[j][0],floor-low+J[j][1]];
  // the arms' angles as they are seen: what a hand, a cuff and a held thing are drawn along
  J.u=u;J.p=p;J.le=le;J.ha=ha;J.mode=M;J.side=pr;J.k=k;J.aN=[scr(aN[0],kaN),scr(aN[1],kaN),aN[2]];J.aF=[scr(aF[0],kaF),scr(aF[1],kaF),aF[2]];
  J.hdN=polar(J.wN,J.aN[1],p.hand*0.45*u);J.hdF=polar(J.wF,J.aF[1],p.hand*0.45*u);return J;}
/* where an arm's two bones go for its hand to rest on a point: [upper arm, forearm], the elbow behind */
function ik(sh,tg,l1,l2){const dx=tg[0]-sh[0],dy=tg[1]-sh[1],d=clamp(Math.hypot(dx,dy),Math.abs(l1-l2)+1,l1+l2-1),base=Math.atan2(dx,dy);
  const a0=base-Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1)),ex=sh[0]+Math.sin(a0)*l1,ey=sh[1]+Math.cos(a0)*l1,k=d/(Math.hypot(dx,dy)||1);
  return[a0*180/Math.PI,Math.atan2(sh[0]+dx*k-ex,sh[1]+dy*k-ey)*180/Math.PI];}

/* ---------------------------------------------------------------- the head: one turn for all of it, from one table of points
   A head is drawn three-quarters on, facing right: HEAD is its outline, FACE where the eyes, the nose, the mouth, the ears and the
   cheeks are, HAIR each style's cap (and a bun, a knot, or the hair down the back). Each has its place seen from the front too
   (HEADF, FACEF, a style's turn: [the cap three-quarters on, with the far side's hair folded away behind the cheek; the same points
   from the front]). As a person turns round, every point moves from one to the other by the same k, and out again on the other
   side, mirrored: one turn for the whole head. A new style needs a cap and a turn, both drawn and looked at, at full size. */
const HEAD=[[0.02,-0.5],[0.3,-0.4],[0.41,-0.12],[0.4,0.12],[0.3,0.36],[0.1,0.5],[-0.14,0.44],[-0.36,0.22],[-0.44,-0.08],[-0.34,-0.36]];
const HEADF=HEAD.map((q,i)=>{const m=HEAD[(10-i)%10];return[(q[0]-m[0])/2,(q[1]+m[1])/2];});
const FACE={eyeN:[0.07,-0.02],eyeF:[0.29,-0.02],nose:[0.24,0.1],mouth:[0.19,0.275],ear:[-0.19,0.04],earF:[0.28,0.04],blushN:[0.0,0.17],blushF:[0.33,0.165]};
const FACEF={eyeN:[-0.115,-0.02],eyeF:[0.115,-0.02],nose:[0,0.1],mouth:[0,0.275],ear:[-0.425,0.04],earF:[0.425,0.04],blushN:[-0.2,0.17],blushF:[0.2,0.17]};
// the nose, a small curve (five points of two curves): three-quarters on, the tip and the nostril; from the front, the nostrils' line
const NOSE=[[-0.012,-0.07],[0.05,0.01],[0.022,0.03],[-0.005,0.04],[-0.02,0.025]],NOSEF=[[-0.026,0.006],[-0.024,0.036],[0,0.037],[0.024,0.036],[0.026,0.006]];
const HAIR={
  short:{cap:[[0.35,-0.28],[0.3,-0.45],[0.03,-0.56],[-0.35,-0.44],[-0.5,-0.1],[-0.45,0.18],[-0.3,0.16],[-0.27,-0.02],[-0.12,-0.1],[0,-0.23],[0.2,-0.3]],ear:1,
    turn:[[[0.405,-0.1],[0.35,-0.28],[0.3,-0.45],[0.03,-0.56],[-0.35,-0.44],[-0.5,-0.1],[-0.45,0.18],[-0.3,0.16],[-0.27,-0.02],[-0.12,-0.1],[0,-0.23],[0.2,-0.3],[0.28,-0.295],[0.345,-0.275],[0.385,-0.19],[0.4,-0.1]],
          [[0.455,0.03],[0.44,-0.25],[0.3,-0.48],[0,-0.565],[-0.3,-0.48],[-0.44,-0.25],[-0.455,0.03],[-0.385,0.04],[-0.37,-0.1],[-0.3,-0.19],[-0.16,-0.28],[0,-0.3],[0.16,-0.28],[0.3,-0.19],[0.37,-0.1],[0.385,0.04]]]},
  crop:{cap:[[0.4,-0.2],[0.37,-0.44],[0.06,-0.58],[-0.35,-0.45],[-0.5,-0.1],[-0.45,0.16],[-0.3,0.14],[-0.27,-0.02],[-0.12,-0.1],[0.02,-0.2],[0.22,-0.24]],ear:1,
    turn:[[[0.41,-0.06],[0.4,-0.2],[0.37,-0.44],[0.06,-0.58],[-0.35,-0.45],[-0.5,-0.1],[-0.45,0.16],[-0.3,0.14],[-0.27,-0.02],[-0.12,-0.1],[0.02,-0.2],[0.22,-0.24],[0.3,-0.225],[0.37,-0.2],[0.405,-0.14],[0.405,-0.07]],
          [[0.455,0.03],[0.45,-0.22],[0.32,-0.49],[0,-0.585],[-0.32,-0.49],[-0.45,-0.22],[-0.455,0.03],[-0.385,0.04],[-0.37,-0.08],[-0.31,-0.16],[-0.17,-0.22],[0,-0.24],[0.17,-0.22],[0.31,-0.16],[0.37,-0.08],[0.385,0.04]]]},
  bob:{cap:[[0.37,-0.2],[0.34,-0.45],[0.02,-0.575],[-0.38,-0.45],[-0.52,-0.08],[-0.51,0.28],[-0.4,0.45],[-0.16,0.46,1],[-0.08,0.22],[-0.05,-0.02],[0.06,-0.17],[0.23,-0.21]],
    turn:[[[0.33,0.31],[0.405,0],[0.37,-0.2],[0.34,-0.45],[0.02,-0.575],[-0.38,-0.45],[-0.52,-0.08],[-0.51,0.28],[-0.4,0.45],[-0.16,0.46,1],[-0.08,0.22],[-0.05,-0.02],[0.06,-0.17],[0.23,-0.21],[0.31,-0.205],[0.365,-0.19],[0.4,0],[0.33,0.3,1]],
          [[0.42,0.46],[0.52,0.22],[0.51,-0.12],[0.36,-0.46],[0,-0.575],[-0.36,-0.46],[-0.51,-0.12],[-0.52,0.22],[-0.42,0.46],[-0.28,0.47,1],[-0.3,0.2],[-0.29,-0.04],[-0.16,-0.2],[0,-0.23],[0.16,-0.2],[0.29,-0.04],[0.3,0.2],[0.28,0.47,1]]]},
  long:{cap:[[0.36,-0.22],[0.33,-0.45],[0.02,-0.58],[-0.39,-0.45],[-0.54,-0.06],[-0.52,0.3],[-0.3,0.46],[-0.1,0.34],[-0.06,0.1],[-0.04,-0.06],[0.07,-0.19],[0.22,-0.24]],
        back:[[-0.5,-0.1],[-0.6,0.5],[-0.58,1.0],[-0.36,1.14],[-0.14,1.0],[-0.08,0.4]],
        backT:[[[-0.5,-0.1],[-0.6,0.5],[-0.58,1.0],[-0.36,1.14],[-0.14,1.0],[-0.08,0.4],[-0.12,0]],[[-0.5,-0.1],[-0.57,0.5],[-0.5,1.0],[0,1.08],[0.5,1.0],[0.57,0.5],[0.5,-0.1]]],
    turn:[[[0.33,0.31],[0.405,0],[0.36,-0.22],[0.33,-0.45],[0.02,-0.58],[-0.39,-0.45],[-0.54,-0.06],[-0.52,0.3],[-0.3,0.46],[-0.1,0.34],[-0.06,0.1],[-0.04,-0.06],[0.07,-0.19],[0.22,-0.24],[0.3,-0.23],[0.355,-0.21],[0.4,0],[0.33,0.3]],
          [[0.36,0.48],[0.53,0.26],[0.53,-0.1],[0.37,-0.46],[0,-0.585],[-0.37,-0.46],[-0.53,-0.1],[-0.53,0.26],[-0.36,0.48],[-0.27,0.4],[-0.31,0.12],[-0.3,-0.06],[-0.17,-0.21],[0,-0.25],[0.17,-0.21],[0.3,-0.06],[0.31,0.12],[0.27,0.4]]]},
  bun:{cap:[[0.35,-0.28],[0.3,-0.45],[0.03,-0.56],[-0.35,-0.44],[-0.5,-0.1],[-0.45,0.2],[-0.3,0.18],[-0.27,-0.02],[-0.12,-0.1],[0,-0.23],[0.2,-0.3]],bun:[-0.43,-0.41,0.175],ear:1,
    turn:[[[0.405,-0.1],[0.35,-0.28],[0.3,-0.45],[0.03,-0.56],[-0.35,-0.44],[-0.5,-0.1],[-0.45,0.2],[-0.3,0.18],[-0.27,-0.02],[-0.12,-0.1],[0,-0.23],[0.2,-0.3],[0.28,-0.295],[0.345,-0.275],[0.385,-0.19],[0.4,-0.1]],
          [[0.455,0.03],[0.44,-0.25],[0.3,-0.48],[0,-0.565],[-0.3,-0.48],[-0.44,-0.25],[-0.455,0.03],[-0.385,0.04],[-0.37,-0.1],[-0.3,-0.19],[-0.16,-0.28],[0,-0.3],[0.16,-0.28],[0.3,-0.19],[0.37,-0.1],[0.385,0.04]]]},
  coily:{cap:null,ear:1},
  scarf:{cap:[[0.39,-0.25],[0.33,-0.47],[0.03,-0.6],[-0.38,-0.47],[-0.55,-0.1],[-0.5,0.22],[-0.3,0.26],[-0.24,0.06],[-0.1,-0.07],[0.06,-0.17],[0.24,-0.21]],
         knot:[[-0.5,0.08],[-0.66,0.2],[-0.74,0.44],[-0.62,0.46],[-0.56,0.3],[-0.5,0.52],[-0.4,0.5],[-0.42,0.24]],
    turn:[[[0.405,-0.08],[0.39,-0.25],[0.33,-0.47],[0.03,-0.6],[-0.38,-0.47],[-0.55,-0.1],[-0.5,0.22],[-0.3,0.26],[-0.24,0.06],[-0.1,-0.07],[0.06,-0.17],[0.24,-0.21],[0.31,-0.215],[0.365,-0.22],[0.4,-0.16],[0.4,-0.09]],
          [[0.48,0.12],[0.5,-0.2],[0.34,-0.5],[0,-0.605],[-0.34,-0.5],[-0.5,-0.2],[-0.48,0.12],[-0.39,0.13],[-0.36,-0.04],[-0.3,-0.15],[-0.16,-0.21],[0,-0.23],[0.16,-0.21],[0.3,-0.15],[0.36,-0.04],[0.39,0.13]]]}
};
// short coily hair: a cap with a softly scalloped edge
HAIR.coily.cap=(()=>{const o=[[0.36,-0.27]];for(let i=0;i<=10;i++){const a=rad(-50-i*15.4),r=0.56+(i%2?0.012:-0.008);o.push([0.01+Math.cos(a)*r*0.86,-0.02+Math.sin(a)*r]);}
  return o.concat([[-0.4,0.2],[-0.29,0.17],[-0.27,-0.01],[-0.15,-0.11],[-0.02,-0.25],[0.18,-0.32]]);})();
HAIR.coily.turn=(()=>{const a=[[0.405,-0.1]].concat(HAIR.coily.cap,[[0.27,-0.3],[0.345,-0.28],[0.39,-0.2],[0.4,-0.1]]),b=[[0.42,0.07],[0.455,0.05]];
  for(let i=0;i<=10;i++){const g=rad(6-i*19.2),r=0.56+(i%2?0.012:-0.008);b.push([Math.cos(g)*r*0.86,-0.02+Math.sin(g)*r]);}
  return[a,b.concat([[-0.42,0.07],[-0.385,0.06],[-0.37,-0.09],[-0.3,-0.2],[-0.16,-0.29],[0,-0.32],[0.16,-0.29],[0.3,-0.2],[0.37,-0.09],[0.385,0.06]])];})();
const BEARD=[[-0.27,0.1],[-0.3,0.3],[-0.16,0.47],[0.08,0.545],[0.26,0.45],[0.35,0.3],[0.32,0.2],[0.25,0.215],[0.2,0.2],[0.1,0.215],[0.04,0.32],[-0.1,0.3],[-0.19,0.12]];
const BEARDF=[[-0.37,0.1],[-0.35,0.3],[-0.2,0.48],[0,0.55],[0.2,0.48],[0.35,0.3],[0.37,0.1],[0.28,0.13],[0.2,0.27],[0.07,0.2],[-0.07,0.2],[-0.2,0.27],[-0.28,0.13]];
function head(ctx,P,J,o){const S=K.S,hh=J.p.head*J.u,H=HAIR[P.hair.style]||HAIR.short,e=Object.assign({},K.EXPR.neutral,o.expr||{}),sk=S.tone(P.skin),hc=S.tone(P.hair.c),small=hh<26,k=J.k==null?1:J.k,tn=k<1;
  // a point, or a row of points, k of the way from its place seen from the front (b) to its place three-quarters on (a)
  const T1=(a,b)=>tn?[lerp(b[0],a[0],k),lerp(b[1],a[1],k)]:a,T2=(a,b)=>tn?a.map((q,i)=>[lerp(b[i][0],q[0],k),lerp(b[i][1],q[1],k),q[2]]):a,far=x=>tn?lerp(1,x,k):x;
  const Kp=(pts)=>pts.map(q=>[q[0]*hh,q[1]*hh,q[2]]),at=q=>[q[0]*hh,q[1]*hh],F={};for(const j in FACE)F[j]=T1(FACE[j],FACEF[j]);
  const HD=Kp(T2(HEAD,HEADF)),la=tn?clamp((k-0.35)/0.45,0,1):1;
  ctx.save();ctx.translate(J.hc[0],J.hc[1]);ctx.rotate(J.ha+(o.nod||0)*k);
  if(H.bun)S.fill(ctx,c=>ell(c,H.bun[0]*k*hh,H.bun[1]*hh,H.bun[2]*hh,H.bun[2]*hh),hc,{});
  if(H.knot&&tn)S.poly(ctx,Kp(H.knot.map(q=>[q[0]+0.57*(1-k),q[1]-0.14*(1-k)])),dk(hc,0.06),{seed:13});   // a knot at the back goes behind the head as it turns
  if(H.ear)for(const q of [at(F.ear),at(F.earF)])S.fill(ctx,c=>ell(c,q[0],q[1],0.065*hh,0.095*hh),dk(sk,0.05),{w:0.8});
  S.poly(ctx,HD,sk,S.shade?{grad:[0.3*hh,-0.3*hh,-0.4*hh,0.5*hh,0.1]}:{seed:7});
  if(P.beard)S.poly(ctx,Kp(T2(BEARD,BEARDF)),S.tone(P.beard),{seed:9,w:0.6,flat:true});
  // the cheeks, the eyes, the brows, the nose, the mouth
  const gz=o.gaze||[0,0],bl=o.blink||0,ey=q=>[q[0]*hh+gz[0]*k*0.02*hh,q[1]*hh+gz[1]*0.02*hh],eN=ey(F.eyeN),eF=ey(F.eyeF),hard=S.id==="line"&&!S.self,ink=hard?S.ink:mix(S.ink,[30,22,26],S.self?0.62:0.4);
  if(S.blush&&!small){ctx.fillStyle=css(mix(sk,[232,96,84],0.5),S.blush);ctx.save();ctx.beginPath();spline(ctx,HD);ctx.clip();ctx.beginPath();for(const q of [F.blushN,F.blushF])ell(ctx,q[0]*hh,q[1]*hh,0.085*hh,0.06*hh);ctx.fill();ctx.restore();}
  const er=(S.id==="line"?0.032:0.037)*hh;ctx.fillStyle=css(ink);
  for(const [q,f] of [[eN,1],[eF,far(0.86)]]){ctx.beginPath();ctx.ellipse(q[0],q[1],er*f,Math.max(er*0.16,er*1.12*(1-bl)),0,0,TAU);ctx.fill();}
  ctx.lineCap="round";ctx.lineJoin="round";
  if(!small){ctx.strokeStyle=css(hard?S.ink:dk(hc,0.25));ctx.lineWidth=(S.id==="line"?0.02:0.024)*hh;
    const bw=0.062*hh,by=-0.118*hh-e.brow*0.012*hh;
    for(const [q,f,sg] of [[eN,1,1],[eF,far(0.8),-1]]){const t=e.brow<0?e.brow*0.04*hh*sg:0;ctx.beginPath();ctx.moveTo(q[0]-bw*f,by+q[1]+0.02*hh-t);ctx.quadraticCurveTo(q[0],by+q[1]-0.004*hh-Math.max(0,e.brow)*0.014*hh,q[0]+bw*f,by+q[1]+0.02*hh+t);ctx.stroke();}
    const n=at(F.nose);
    if(S.id==="line"){const N=T2(NOSE,NOSEF).map(q=>[n[0]+q[0]*hh,n[1]+q[1]*hh]);ctx.strokeStyle=css(hard?S.ink:dk(mix(sk,[190,90,80],0.45),0.25));ctx.lineWidth=0.018*hh;
      ctx.beginPath();ctx.moveTo(N[0][0],N[0][1]);ctx.quadraticCurveTo(N[1][0],N[1][1],N[2][0],N[2][1]);ctx.quadraticCurveTo(N[3][0],N[3][1],N[4][0],N[4][1]);ctx.stroke();}
    else{ctx.fillStyle=css(dk(mix(sk,[214,110,90],0.25),0.1),S.id==="paper"?0.9:0.75);ctx.beginPath();ctx.ellipse(n[0]+0.012*hh*k,n[1],0.03*hh,0.04*hh,-0.3*k,0,TAU);ctx.fill();}
    const m=at(F.mouth),mw=(0.062+0.014*Math.max(0,e.smile))*hh*lerp(1.12,1,k),mr=far(0.9);ctx.strokeStyle=css(hard?S.ink:(P.beard?lt(S.tone(P.beard),0.5):dk(mix(sk,[170,60,60],0.5),0.3)));ctx.lineWidth=(S.id==="line"?0.02:0.024)*hh;
    if(e.open>0.05){const d=(0.02+0.05*e.open)*hh,ly=m[1]-e.smile*0.01*hh;ctx.fillStyle=css([104,46,52]);ctx.beginPath();ctx.moveTo(m[0]-mw*0.86,ly);ctx.quadraticCurveTo(m[0],ly+0.012*hh,m[0]+mw*far(0.8/0.86)*0.86,ly-0.004*hh*k);
      ctx.bezierCurveTo(m[0]+mw*0.7,ly+d*1.25,m[0]-mw*0.7,ly+d*1.3,m[0]-mw*0.86,ly);ctx.closePath();ctx.fill();if(S.id==="line")ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(m[0]-mw,m[1]-e.smile*0.012*hh);ctx.quadraticCurveTo(m[0]+0.006*hh*k,m[1]+e.smile*0.046*hh,m[0]+mw*mr,m[1]-e.smile*lerp(0.012,0.016,k)*hh);ctx.stroke();}}
  // the hair or the scarf, over the head
  if(H.knot&&!tn)S.poly(ctx,Kp(H.knot),dk(hc,0.06),{seed:13});
  S.poly(ctx,Kp(tn&&H.turn?T2(H.turn[0],H.turn[1]):H.cap),hc,S.shade?{grad:[0.2*hh,-0.5*hh,-0.5*hh,0.3*hh,0.12],seed:5}:{seed:5});
  if(!small&&la>0.01){if(P.hair.style==="scarf")S.line(ctx,c=>{c.moveTo(0.3*hh,-0.3*hh);c.quadraticCurveTo(0,-0.42*hh,-0.36*hh,-0.2*hh);c.moveTo(0.16*hh,-0.42*hh);c.quadraticCurveTo(-0.1*hh,-0.46*hh,-0.42*hh,-0.02*hh);},null,0.55,{a:la});
    else if(P.hair.style!=="coily")S.line(ctx,c=>{c.moveTo(0.12*hh,-0.48*hh);c.quadraticCurveTo(-0.1*hh,-0.4*hh,-0.3*hh,-0.16*hh);},null,0.5,{a:la});}
  if(P.earrings&&!small){const q=at(T1([-0.185,0.17],[-0.42,0.2])),f=at(T1([0.39,0.17],[0.42,0.2])),rf=tn?clamp((1-k)*2.5,0,1):0;S.fill(ctx,c=>ell(c,q[0],q[1],0.03*hh,0.03*hh),P.earrings,{w:0.6,flat:true});
    if(rf>0.05)S.fill(ctx,c=>ell(c,f[0],f[1],0.03*hh*rf,0.03*hh*rf),P.earrings,{w:0.6,flat:true});}
  if(P.glasses&&!small){ctx.strokeStyle=css(hard?S.ink:P.glasses);ctx.lineWidth=(S.id==="line"?0.02:0.026)*hh;ctx.fillStyle="rgba(255,255,255,0.22)";const fk=far(0.82);
    for(const [q,f] of [[at(F.eyeN),1],[at(F.eyeF),fk]]){ctx.beginPath();ctx.ellipse(q[0],q[1]+0.005*hh,0.098*hh*f,0.092*hh,0,0,TAU);ctx.fill();ctx.stroke();}
    // the bridge, and the arms back to the ears: the far one comes into view as the head turns
    const a=at(F.eyeN),b=at(F.eyeF),te=H.ear?0.415:0.3,t0=T1([-0.2,-0.04],[-te,-0.03]),t1=T1([0.29+0.098*0.82,-0.03],[te,-0.03]);   // the arms end at the ears, or where the hair covers themctx.beginPath();ctx.moveTo(a[0]+0.098*hh,a[1]);ctx.lineTo(b[0]-0.098*fk*hh,b[1]);ctx.moveTo(a[0]-0.098*hh,a[1]-0.01*hh);ctx.lineTo(t0[0]*hh,t0[1]*hh);
    if(tn){ctx.moveTo(b[0]+0.098*fk*hh,b[1]-0.01*hh);ctx.lineTo(t1[0]*hh,t1[1]*hh);}ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the body */
function hand(ctx,P,J,W,deg,kind,far){const S=K.S,r=J.p.hand*J.u*0.52,c=polar(W,deg,r*0.75),sk=far?dk(S.tone(P.skin),0.07):S.tone(P.skin);
  if(kind==="open"||kind==="flat"){const tip=polar(c,deg,r*1.25),th=polar(polar(c,deg,-r*0.2),deg+62,r*(kind==="flat"?0.9:1.25));S.fill(ctx,cc=>{capsule(cc,polar(c,deg,-r*0.5),tip,r*0.98,r*0.8);capsule(cc,c,th,r*0.46,r*0.3);},sk,{w:0.8});
    if(kind==="open")S.line(ctx,cc=>{for(const k of [-0.34,0,0.34]){const a=polar(polar(c,deg,r*0.95),deg+90,r*k*1.5),b=polar(a,deg,r*0.75);cc.moveTo(a[0],a[1]);cc.lineTo(b[0],b[1]);}},null,0.42);return;}
  S.fill(ctx,cc=>{ell(cc,c[0],c[1],r*0.92,r*1.16,-rad(deg));
    if(kind==="point"){const tip=polar(c,deg,r*1.9);capsule(cc,c,tip,r*0.42,r*0.3);}
    else{const th=polar(c,deg+95,r*(kind==="grip"?0.7:0.95));capsule(cc,c,th,r*0.5,r*0.34);}},sk,{w:0.8});}
function arm(ctx,P,J,far,o){const S=K.S,p=J.p,u=J.u,sh=far?J.shF:J.shN,e=far?J.eF:J.eN,w=far?J.wF:J.wN,a=far?J.aF:J.aN,top=S.tone(P.top.c),col=far?dk(top,S.id==="line"?0.05:0.1):(S.id==="soft"?lt(top,0.07):top);
  const short=P.top.sleeve==="short",r=[p.arm[0]*u/2,p.arm[1]*u/2,p.arm[2]*u/2],sk=far?dk(S.tone(P.skin),0.07):S.tone(P.skin);
  if(o.under)o.under(ctx,far?J.hdF:J.hdN,a[1],J);
  if(short){S.fill(ctx,c=>{capsule(c,e,w,r[1]*0.9,r[2]*0.92);},sk,{w:0.8});S.fill(ctx,c=>{capsule(c,sh,polar(sh,a[0],p.uarm*u*0.62),r[0],r[1]*1.06);},col,{});}
  else S.fill(ctx,c=>{capsule(c,sh,e,r[0],r[1]);capsule(c,e,w,r[1],r[2]);},col,{});
  hand(ctx,P,J,w,a[1],a[2]||"rest",far);
  if(!short)S.line(ctx,c=>{const q=polar(w,a[1],-4*u),n=[Math.cos(rad(a[1])),-Math.sin(rad(a[1]))];c.moveTo(q[0]-n[0]*r[2],q[1]-n[1]*r[2]);c.lineTo(q[0]+n[0]*r[2],q[1]+n[1]*r[2]);},null,0.6);}
function shoe(ctx,P,J,A,deg,far){const S=K.S,p=J.p,u=J.u,L=p.foot*u,hgt=p.ankle*u,col=far?dk(S.tone(P.shoe),0.1):S.tone(P.shoe);
  // a foot that points at us is seen short: its length shrinks about the ankle as the person turns to the front
  const k=J.k==null?1:J.k,f=lerp(0.46,1,k),X=v=>(v-0.18)*f*L+0.18*L*k;
  ctx.save();ctx.translate(A[0],A[1]);ctx.rotate(rad(scr(deg||0,k)));
  S.poly(ctx,[[X(-0.3),-0.2*hgt],[X(-0.34),hgt*0.62],[X(-0.28),hgt,1],[X(0.62),hgt,1],[X(0.7),hgt*0.66],[X(0.5),hgt*0.14],[X(0.18),-0.3*hgt],[X(-0.04),-0.42*hgt]],col,{seed:3,exact:true});
  ctx.restore();}
function leg(ctx,P,J,far,o){const S=K.S,p=J.p,u=J.u,h=far?J.hF:J.hN,k=far?J.kF:J.kN,n=far?J.nF:J.nN,b=P.bottom||{kind:"trousers",c:[70,70,84]},skirt=b.kind==="skirt"||b.kind==="long";
  const r=[p.leg[0]*u/2,p.leg[1]*u/2,p.leg[2]*u/2],col=far?dk(S.tone(b.c),S.id==="line"?0.06:0.11):S.tone(b.c),sk=far?dk(S.tone(P.skin),0.08):S.tone(P.skin);
  shoe(ctx,P,J,n,far?o.pose.fF:o.pose.fN,far);
  if(skirt)S.fill(ctx,c=>{capsule(c,k,n,r[1]*0.82,r[2]*0.86);},sk,{w:0.8});
  else S.fill(ctx,c=>{capsule(c,h,k,r[0],r[1]);capsule(c,k,n,r[1],r[2]*1.06);},col,{});}
// a skirt: one piece of cloth round both thighs, down to its hem; standing or walking it hangs from the hips and swings with the legs
function skirt(ctx,P,J,o){const S=K.S,p=J.p,u=J.u,b=P.bottom,long=b.kind==="long",t=long?0.86:0.16,col=S.tone(b.c),r0=p.leg[0]*u*0.56,r1=p.leg[1]*u*(long?0.9:0.78),r2=p.leg[1]*u*(long?1.0:0.86);
  const hemN=[lerp(J.kN[0],J.nN[0],t),lerp(J.kN[1],J.nN[1],t)],hemF=[lerp(J.kF[0],J.nF[0],t),lerp(J.kF[1],J.nF[1],t)],w=[J.hip[0],J.hip[1]-p.leg[0]*u*0.3],g=S.shade?{grad:[J.hip[0]+60*u,J.hip[1],J.hip[0]-90*u,hemN[1],0.12],seed:17,exact:true}:{seed:17,exact:true};
  if(J.mode==="stand"&&Math.abs(o.pose.lN[0])<60&&Math.abs(o.pose.lF[0])<60){const hw=p.tor[2]*u/2,y=Math.max(hemN[1],hemF[1])+r2*0.5,kb=Math.min(J.kN[0],J.kF[0]),kf=Math.max(J.kN[0],J.kF[0]),
      xb=Math.min(hemN[0],hemF[0],kb)-r2*(long?0.85:1.2)-8*u,xf=Math.max(hemN[0],hemF[0],kf)+r2*(long?0.85:1.2)+8*u,y0=J.hip[1]-14*u;
    S.poly(ctx,[[J.hip[0]-hw*0.98,y0,1],[lerp(J.hip[0]-hw,xb,0.6)-6*u,lerp(y0,y,0.5)],[xb,y,1],[(xb+xf)/2,y+5*u],[xf,y,1],[lerp(J.hip[0]+hw,xf,0.6)+6*u,lerp(y0,y,0.5)],[J.hip[0]+hw,y0,1]],col,g);
    S.line(ctx,c=>{for(const f of [0.3,0.55,0.78]){const a=[J.hip[0]+lerp(-hw,hw,f),y0+26*u],q=[lerp(xb,xf,f),y-4*u];c.moveTo(a[0],a[1]);c.quadraticCurveTo((a[0]+q[0])/2+5*u,(a[1]+q[1])/2,q[0],q[1]);}},null,0.5);return;}
  S.fill(ctx,c=>{capsule(c,J.hN,J.kN,r0,r1);capsule(c,J.hF,J.kF,r0,r1);capsule(c,J.kN,hemN,r1,r2);capsule(c,J.kF,hemF,r1,r2);
    pg(c,[J.hN,J.kN,[hemN[0],hemN[1]+r2*0.6],[hemF[0],hemF[1]+r2*0.6],J.kF,J.hF]);ell(c,w[0],w[1],p.tor[2]*u*0.5*lerp(1,0.78,J.side||0),p.leg[0]*u*0.5);},col,g);}
function torso(ctx,P,J,o){const S=K.S,p=J.p,u=J.u,T=p.torso*u,pr=J.side||0,sw=p.tor[0]*u/2*lerp(1,0.6,pr),ww=p.tor[1]*u/2*lerp(1,0.72,pr),hw=p.tor[2]*u/2*lerp(1,0.7,pr),nw=p.head*u*0.16,top=S.tone(P.top.c);
  ctx.save();ctx.translate(J.hip[0],J.hip[1]);ctx.rotate(J.le);   // y up the back is -y here
  // from the side the chest comes forward a little (ch) and the back is flatter
  // and the hem's corners are cut off (d), most of all at the back, where someone sits
  const ch=pr*0.12*sw,d=pr*0.14*T,hem=lerp(0.08,0.05,pr)*T,k=1-pr,pts=[[-hw+d*0.9,hem,k],[-hw,hem-d,k],[-ww,-0.42*T],[-sw+ch*0.5,-0.8*T],[-sw*0.88+ch*0.5,-0.95*T],[-sw*0.5,-1.02*T],[-nw,-1.045*T],[nw*1.3,-1.04*T],[sw*0.5+ch,-1.0*T],[sw*0.84+ch,-0.9*T],[sw*0.96+ch*1.5,-0.7*T],[ww*1.06+ch,-0.4*T],[hw*1.02,hem-d*0.6,k],[hw*1.02-d*0.6,hem,k]];
  S.poly(ctx,pts,top,S.shade?{grad:[sw,-T,-sw,0.1*T,0.15],seed:11,exact:true}:{seed:11,exact:true});
  // what is on the front of the top moves to the front edge as the body turns, and stays inside the top
  const tk=J.k==null?1:J.k,cx=lerp(sw*0.2,sw*0.8,pr)*tk;ctx.save();ctx.beginPath();spline(ctx,pts);ctx.clip();
  if(P.top.kind==="jacket"){const inn=S.tone(P.top.inner||[240,236,226]);
    S.fill(ctx,c=>pg(c,[[cx-nw*1.2,-1.04*T],[cx+nw*1.1,-1.04*T],[cx+nw*0.2,-0.66*T]]),inn,{w:0.7,flat:true});
    S.line(ctx,c=>{c.moveTo(cx+nw*0.2,-0.66*T);c.lineTo(cx+nw*0.1,0.07*T);c.moveTo(cx-nw*1.2,-1.04*T);c.lineTo(cx-nw*1.9,-0.84*T);c.lineTo(cx-nw*0.5,-0.8*T);c.moveTo(cx+nw*1.1,-1.04*T);c.lineTo(cx+nw*1.7,-0.86*T);c.lineTo(cx+nw*0.75,-0.82*T);},null,0.55);
    if(u>0.2){ctx.fillStyle=css(S.id==="line"?(S.self?dk(top,0.45):S.ink):dk(top,0.35));for(const f of [-0.42,-0.22]){ctx.beginPath();ctx.arc(cx+nw*lerp(0.75,0.5,pr)*tk,f*T,Math.max(1.2,5*u),0,TAU);ctx.fill();}}}
  else{const band=dk(top,0.12);S.fill(ctx,c=>{c.moveTo(-nw*1.25,-1.035*T);c.quadraticCurveTo(cx*0.6,-0.93*T,nw*1.6,-1.03*T);c.quadraticCurveTo(cx*0.6,-0.985*T,-nw*1.25,-1.035*T);c.closePath();},S.id==="line"?top:band,{w:0.6,flat:true});
    S.line(ctx,c=>{c.moveTo(-hw*0.96,hem-0.06*T);c.lineTo(hw*0.98,hem-0.06*T);},null,0.5);}
  ctx.restore();ctx.restore();}
// where the joints are in the frame, whichever way the person faces
const facing=(J,x,sg)=>{if(sg<0)for(const j in J)if(Array.isArray(J[j])&&J[j].length===2&&typeof J[j][0]==="number")J[j]=[2*x-J[j][0],J[j][1]];J.sgn=sg;return J;};
function draw(ctx,P,x,floor,h,pose,o){const S=K.S,t=o.t||0,id=(P.name||P.key||"x").length;
  const br=Math.sin(t*1.7+id)*0.9;                                      // breath: the chest and head rise a little
  if(o.blink==null){const k=(t*0.31+hash(id,3))%1;o.blink=k>0.965?1:0;}
  const tu=turnOf(o),mir=tu.sg<0;o.sgn=tu.sg;
  ctx.save();if(mir){ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);}
  const J=rig(P,pose,x,floor,h,o),u=J.u,p=J.p;S.begin(ctx,{lw:clamp(h*0.0056,1.4,6.5),sh:clamp(h*0.0078,1.5,8.5),far:o.far||0});
  const lower=o.part!=="upper",upper=o.part!=="lower";
  if(lower&&o.shade!==0&&S.id!=="paper"){const m=J.mode,cx=m==="sit"?J.hip[0]:(J.nN[0]+J.nF[0])/2+(m==="kneel"?-40*u:20*u)*J.k,w=m==="kneel"?230*u:m==="sit"?170*u:150*u;
    ctx.fillStyle=S.id==="line"?"rgba(60,44,70,0.16)":"rgba(70,48,56,0.14)";ctx.beginPath();ctx.ellipse(cx+(o.sun||30)*u,floor+2*u,w,w*0.16,0,0,TAU);ctx.fill();}
  const sk=P.bottom&&(P.bottom.kind==="skirt"||P.bottom.kind==="long");
  J.sc[1]-=br*u;J.shN[1]-=br*u;J.shF[1]-=br*u;J.hc[1]-=br*1.2*u;J.nb[1]-=br*u;
  if(upper&&HAIR[P.hair.style]&&HAIR[P.hair.style].back){const hh=p.head*u,H=HAIR[P.hair.style],bk=J.k<1&&H.backT?H.backT[0].map((q,i)=>[lerp(H.backT[1][i][0],q[0],J.k),lerp(H.backT[1][i][1],q[1],J.k)]):H.back;
    ctx.save();ctx.translate(J.hc[0],J.hc[1]);ctx.rotate(J.ha);S.poly(ctx,bk.map(q=>[q[0]*hh,q[1]*hh]),dk(S.tone(P.hair.c),0.08),{seed:21});ctx.restore();}
  if(upper)arm(ctx,P,J,true,{pose,under:o.underF});
  if(lower){leg(ctx,P,J,true,o);leg(ctx,P,J,false,o);if(sk)skirt(ctx,P,J,o);}
  if(upper){
    // the neck, then the top over it
    const nk=[J.nb[0]-Math.sin(J.le)*12*u,J.nb[1]+Math.cos(J.le)*12*u],nt=[lerp(J.nb[0],J.hc[0],0.62),lerp(J.nb[1],J.hc[1],0.62)];
    S.fill(ctx,c=>capsule(c,nk,nt,p.head*u*0.165,p.head*u*0.15),dk(S.tone(P.skin),0.09),{w:0.8,flat:true});
    torso(ctx,P,J,o);
    // a thigh that rises past the level of the hips (a crouch) lies along the near side of the body: it is drawn over the top
    const ov=lower?(o.legOver!=null?o.legOver:J.side*clamp((pose.lN[0]-92)/14,0,1)):0;
    if(ov>0){ctx.save();ctx.globalAlpha*=ov;if(sk)skirt(ctx,P,J,o);else leg(ctx,P,J,false,o);ctx.restore();}
    head(ctx,P,J,o);arm(ctx,P,J,false,{pose,under:o.under});
    if(o.hold)o.hold(ctx,J.hdN,J.aN[1],J);}
  ctx.restore();
  return facing(J,x,tu.sg);}
K.person=(ctx,who,x,floor,h,pose,o)=>{o=Object.assign({},o||{});const P=typeof who==="string"?K.CAST[who]:who;if(!P)throw new Error("PK.person: nobody called "+who);
  pose=poseOf(pose||"stand");o.pose=pose;if(typeof o.expr==="string")o.expr=K.EXPR[o.expr];
  if(K.watch)K.watch({who:typeof who==="string"?who:(P.key||P.name||"someone"),x,floor,h,flip:o.flip===true?1:(o.flip||0),part:o.part||"whole",mode:pose.mode||"stand",
    pose:[pose.lean||0,pose.head||0,pose.aN[0],pose.aN[1],pose.aF[0],pose.aF[1],pose.lN[0],pose.lN[1],pose.lF[0],pose.lF[1]],reach:[o.reachN?(o.reachNk==null?1:o.reachNk):0,o.reachF?(o.reachFk==null?1:o.reachFk):0],
    expr:o.expr?[o.expr.brow||0,o.expr.smile||0,o.expr.open||0]:[0,0.3,0],a:o.a==null?1:o.a,ctx});
  if(o.a!=null&&o.a<0.999){if(o.a<=0.004)return facing(rig(P,pose,x,floor,h,o),x,turnOf(o).sg);
    const cv=ctx.canvas,[bc,bx]=ag_buf("pkFade",cv.width,cv.height);bx.setTransform(ctx.getTransform());const J=draw(bx,P,x,floor,h,pose,o);
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=o.a;ctx.drawImage(bc,0,0);ctx.restore();return J;}
  return draw(ctx,P,x,floor,h,pose,o);};
K.rig=(who,x,floor,h,pose,o)=>facing(rig(typeof who==="string"?K.CAST[who]:who,poseOf(pose||"stand"),x,floor,h,o||{}),x,turnOf(o||{}).sg);
/* a walk from w.x0 to w.x1 between w.t0 and w.t1, the stride dying away as they stop; before it w.before, after it w.then */
K.walkAt=(t,w)=>{const u=clamp((t-w.t0)/(w.t1-w.t0),0,1),k=0.16,s=u<k?u*u/(2*k*(1-k)):u>1-k?1-(1-u)*(1-u)/(2*k*(1-k)):(u-k/2)/(1-k),x=lerp(w.x0,w.x1,s),
    fl=typeof w.floor==="function"?w.floor(x):w.floor,h=typeof w.h==="function"?w.h(fl):w.h,go=clamp(Math.min(u/k,(1-u)/k),0,1);
  return{x,floor:fl,h,go:sine(go),step:Math.abs(x-w.x0)/K.strideOf(h,w.amp)+(w.phase||0),left:w.flip!=null?w.flip:w.x1<w.x0,u};};
K.walk=(ctx,who,t,w,o)=>{const P=typeof who==="string"?K.CAST[who]:who,amp=w.amp||K.ampOf(P),q=K.walkAt(t,w.amp?w:Object.assign({},w,{amp}));let pose=K.poseWalk(q.step,q.go,amp);
  if(w.arms)pose=Object.assign({},pose,{aN:w.arms.aN||pose.aN,aF:w.arms.aF||pose.aF},w.arms.lean!=null?{lean:w.arms.lean}:{});
  if(t<w.t0&&w.before)pose=K.poseMix(w.before,pose,pin(t,w.t0-0.4,0.4));
  if(t>w.t1-0.2&&w.then)pose=K.poseMix(pose,w.then,pin(t,w.t1-0.2,0.5));
  const J=K.person(ctx,who,q.x,q.floor,q.h,pose,Object.assign({t,flip:q.left},o||{}));J.at=q;return J;};
})(PK);
