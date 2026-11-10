/* ===== More than a junior: Berlin, 1904 =====
   The opening's pictures, drawn in the module's matte language (soft gradients, matte surfaces, light from the right), not as a diorama:
   the courtyard among tall apartment houses, Hans, the people of 1904, and the things of the story (the blackboard and the slate, the
   newspaper, the reports, the dot grids, the lens, the envelope). Every top-level name starts with mj_ or MJ_, the film's own prefix.

   Hans (mj_horse) is drawn in his own space, facing left so his right side shows (his right forefoot taps; his right hind leg has the
   white sock), standing on the ground at y 760, from the muzzle at x 60 to the tail at x 850; the withers 468 above the ground (a
   Russian trotting horse, about 1.6 m). His shapes are painted once into kept pictures at 1.5 times their size (2 for the head, which
   the camera comes close to), and drawn live: the tapping leg, the eye, the blinkers. */

/* ---------------------------------------------------------------- Hans */
const MJ_H={ground:760,res:1.5,
  coat:[82,44,27],coatHi:[170,104,62],coatDeep:[44,22,12],
  point:[40,33,32],pointHi:[112,100,96],sock:[236,231,222],hoof:[66,60,56],hoofHi:[132,124,116],
  pastern:36};
// the body: neck and barrel and quarters as one shape, the legs' tops inside it
function mj_hBody(c){
  c.moveTo(188,120);                                              // the poll
  c.bezierCurveTo(236,126,288,170,334,226);c.bezierCurveTo(356,254,376,278,402,290);     // the crest of the neck to the withers
  c.bezierCurveTo(432,304,462,314,498,316);c.bezierCurveTo(548,318,588,310,624,302);     // the back, dipping a little
  c.bezierCurveTo(656,294,686,290,712,296);c.bezierCurveTo(732,300,748,310,758,324);     // the croup, round
  c.bezierCurveTo(774,346,782,374,780,402);c.bezierCurveTo(778,434,768,462,752,486);     // the buttock and the back of the thigh
  c.bezierCurveTo(742,506,736,526,736,546);c.bezierCurveTo(736,566,744,584,746,598);     // the back of the gaskin to the point of the hock
  c.bezierCurveTo(748,608,744,616,738,618);c.lineTo(712,620);c.bezierCurveTo(706,612,704,600,704,588);   // under the hock, its front
  c.bezierCurveTo(702,562,696,542,690,528);c.bezierCurveTo(684,500,674,480,660,470);     // the front of the gaskin, the stifle
  c.bezierCurveTo(624,488,580,502,530,506);c.bezierCurveTo(470,510,412,504,372,494);     // the belly, rising to the flank
  c.bezierCurveTo(356,500,350,516,346,536);c.lineTo(300,536);                             // into the forearm
  c.bezierCurveTo(290,506,276,474,260,450);c.bezierCurveTo(244,428,238,404,240,382);     // the chest, the point of the shoulder
  c.bezierCurveTo(242,350,238,316,226,286);c.bezierCurveTo(216,262,206,246,198,236);     // the underside of the neck, the throat
  c.bezierCurveTo(194,200,190,160,188,120);c.closePath();}
// the head, from the poll and the throat to the muzzle (drawn at 0.86 about the poll, so a long face isn't a big one)
function mj_hHead(c){
  c.moveTo(196,124);c.bezierCurveTo(206,152,214,186,216,212);c.bezierCurveTo(218,236,214,258,204,276);   // behind the jaw
  c.bezierCurveTo(192,296,170,306,146,312);c.bezierCurveTo(126,318,110,326,96,330);                      // the lower jaw to the chin
  c.bezierCurveTo(84,334,72,332,66,322);c.bezierCurveTo(58,310,56,296,60,284);                            // the lips, the muzzle
  c.bezierCurveTo(64,268,70,252,80,236);c.bezierCurveTo(98,208,118,178,136,152);                          // the face, up to the eyes
  c.bezierCurveTo(150,132,168,118,186,114);c.bezierCurveTo(192,116,195,119,196,124);c.closePath();}
function mj_hCheek(c){c.moveTo(206,206);c.bezierCurveTo(206,240,196,270,170,284);c.bezierCurveTo(150,294,142,280,150,262);c.bezierCurveTo(160,236,176,214,206,206);}
function mj_hEars(c,near){if(near){c.moveTo(178,126);c.bezierCurveTo(174,104,176,80,188,58);c.bezierCurveTo(196,72,202,96,200,128);c.closePath();}
  else{c.moveTo(194,128);c.bezierCurveTo(196,104,204,84,218,66);c.bezierCurveTo(222,82,220,106,212,132);c.closePath();}}
function mj_hMane(c){c.moveTo(186,116);c.bezierCurveTo(234,120,290,162,338,216);c.bezierCurveTo(360,242,382,268,408,286);
  c.bezierCurveTo(400,300,386,304,372,298);c.bezierCurveTo(358,292,350,282,338,276);c.bezierCurveTo(318,264,306,262,290,250);
  c.bezierCurveTo(268,232,252,210,236,188);c.bezierCurveTo(222,168,208,146,196,130);c.bezierCurveTo(192,124,188,120,186,116);c.closePath();}
function mj_hForelock(c){c.moveTo(186,112);c.bezierCurveTo(172,124,160,140,152,160);c.bezierCurveTo(150,170,156,172,162,164);c.bezierCurveTo(170,150,180,136,192,124);c.closePath();}
function mj_hTail(c){c.moveTo(744,314);c.bezierCurveTo(770,310,790,326,798,358);c.bezierCurveTo(808,404,818,470,822,540);
  c.bezierCurveTo(826,600,820,650,808,690);c.bezierCurveTo(804,704,796,716,786,722);c.bezierCurveTo(782,712,776,700,772,690);
  c.bezierCurveTo(768,640,770,590,768,540);c.bezierCurveTo(766,480,762,420,754,382);c.bezierCurveTo(750,358,742,340,732,328);c.closePath();}
// a leg as a tapered chain of points [x, y, width], drawn as one smooth outline
function mj_legPath(P){const L=[],R=[];for(let i=0;i<P.length;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
    L.push([P[i][0]+nx*P[i][2]/2,P[i][1]+ny*P[i][2]/2]);R.push([P[i][0]-nx*P[i][2]/2,P[i][1]-ny*P[i][2]/2]);}
  return c=>{c.moveTo(L[0][0],L[0][1]);for(let i=1;i<L.length;i++){const m=[(L[i-1][0]+L[i][0])/2,(L[i-1][1]+L[i][1])/2];c.quadraticCurveTo(L[i-1][0],L[i-1][1],m[0],m[1]);}
    c.lineTo(L[L.length-1][0],L[L.length-1][1]);const e=P[P.length-1],a=P[P.length-2],an=Math.atan2(e[1]-a[1],e[0]-a[0]);c.arc(e[0],e[1],e[2]/2,an-Math.PI/2,an+Math.PI/2);
    for(let i=R.length-2;i>=0;i--){const m=[(R[i+1][0]+R[i][0])/2,(R[i+1][1]+R[i][1])/2];c.quadraticCurveTo(R[i+1][0],R[i+1][1],m[0],m[1]);}c.lineTo(R[0][0],R[0][1]);c.closePath();};}
// a hoof under the coronet C, tilted by r from standing flat (r 0: the sole on the ground); facing left, the toe is towards -x
function mj_hoofPath(C,r){const cs=Math.cos(r),sn=Math.sin(r),p=(x,y)=>[C[0]+x*cs-y*sn,C[1]+x*sn+y*cs];
  const pts=[p(-18,-2),p(-40,24),p(-36,27),p(6,27),p(14,24),p(15,6),p(10,-4)];
  return c=>{c.moveTo(pts[0][0],pts[0][1]);c.lineTo(pts[1][0],pts[1][1]);c.quadraticCurveTo(pts[2][0],pts[2][1],pts[2][0]+2,pts[2][1]);c.lineTo(pts[3][0],pts[3][1]);
    c.quadraticCurveTo(pts[4][0],pts[4][1],pts[4][0],pts[4][1]-2);c.quadraticCurveTo(pts[5][0]+2,pts[5][1],pts[5][0],pts[5][1]);c.quadraticCurveTo(pts[6][0],pts[6][1],pts[0][0],pts[0][1]);c.closePath();};}
// a foreleg from the elbow E: the knee bends forward (towards -x); F the fetlock; pa the pastern's angle from straight down, forward positive
function mj_fore(E,F,pa,L1,L2){const dx=F[0]-E[0],dy=F[1]-E[1],d=Math.min(Math.hypot(dx,dy),L1+L2-0.5),a=Math.atan2(dy,dx),
    k=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),ka=a+k;      // + k: the knee comes forward (to the left, facing left)
  const K=[E[0]+Math.cos(ka)*L1,E[1]+Math.sin(ka)*L1],u=[-Math.sin(pa),Math.cos(pa)],C=[F[0]+u[0]*MJ_H.pastern,F[1]+u[1]*MJ_H.pastern];return{E,K,F,C,u,pa};}
function mj_hind(S,H,F,pa){const u=[-Math.sin(pa),Math.cos(pa)],C=[F[0]+u[0]*MJ_H.pastern,F[1]+u[1]*MJ_H.pastern];return{S,H,F,C,u,pa};}
// paints one leg: the bay forearm or gaskin, fading into the body at its top, over the black lower leg (white where the sock is), and the hoof
function mj_paintLeg(c,J,o){o=o||{};const deep=o.far?0.4:0,coat=mix(MJ_H.coat,[0,0,0],deep),pt=mix(MJ_H.point,[0,0,0],deep),hiA=o.far?0.35:0.6,
    shade=rgba(MJ_H.coatDeep,o.far?0.5:0.4),top=o.hind?J.S:J.E,low=o.hind?J.H:J.K,mid=[(low[0]+J.F[0])/2,(low[1]+J.F[1])/2];
  // the lower leg: the cannon with its tendon behind, the round fetlock, the sloping pastern
  // along the cannon's own line, so a lifted leg keeps its shape: a is the cannon's direction, down it from the knee or the hock
  const cl=Math.hypot(J.F[0]-low[0],J.F[1]-low[1])||1,a=[(J.F[0]-low[0])/cl,(J.F[1]-low[1])/cl],at=(P,d,dx)=>[P[0]+a[0]*d+(dx||0),P[1]+a[1]*d];
  const lower=mj_legPath([[...at(low,-8,o.hind?5:2),o.hind?36:38],[...at(low,12,o.hind?3:1),o.hind?30:34],[...at(mid,0,3),o.hind?28:26],[...at(J.F,-12,2),28],[...at(J.F,2,3),33],[(J.F[0]+J.C[0])/2,(J.F[1]+J.C[1])/2,24],[J.C[0],J.C[1]-4,25]]);
  const lc=o.sock?MJ_H.sock:pt,lh=o.sock?[255,255,255]:mix(MJ_H.pointHi,[0,0,0],deep);
  ag_soft(c,lower,lc,lh,mid[0]+18,mid[1]+20,90,rgba(o.sock?[120,110,96]:[0,0,0],0.5),10,o.sock?0.7:0.3);
  c.save();ag_shape(c,lower);c.clip();
  if(o.sock){const y0=J.F[1]-34,g=c.createLinearGradient(0,y0-10,0,y0+6);g.addColorStop(0,rgba(pt,1));g.addColorStop(1,rgba(pt,0));c.fillStyle=g;c.fillRect(low[0]-60,low[1]-30,120,y0+6-(low[1]-30));}
  c.strokeStyle=rgba(o.sock?[150,140,126]:[150,140,136],0.22);c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(...at(low,20,14));c.quadraticCurveTo(...at(mid,0,14),...at(J.F,-16,12));c.stroke();c.restore();
  if(o.lowerOnly)return mj_hoof(c,J,o,deep);
  // the forearm or the gaskin: wide at the body, tapering into the knee or the hock, drawn apart and faded in at its top
  const upper=o.hind?mj_legPath([[J.S[0]-4,J.S[1]-(o.far?60:18),o.far?58:44],[J.S[0]+2,J.S[1]+8,44],[(J.S[0]+J.H[0])/2+3,(J.S[1]+J.H[1])/2,40],[J.H[0]+5,J.H[1]-4,40],[J.H[0]+6,J.H[1]+8,36]])
                    :mj_legPath([[J.E[0]+2,J.E[1]-(o.far?60:36),80],[J.E[0]+(J.K[0]-J.E[0])*0.5,J.E[1]+(J.K[1]-J.E[1])*0.5,52],[J.K[0],J.K[1]-8,42],[J.K[0]-1,J.K[1]+8,40],[J.K[0]+(J.F[0]-J.K[0])*0.18,J.K[1]+(J.F[1]-J.K[1])*0.18,34]]);
  const bx=[top[0]-120,top[1]-80,240,low[1]-top[1]+130],[bc,bxc]=ag_buf("mjleg",Math.ceil(bx[2]*2),Math.ceil(bx[3]*2));
  bxc.scale(2,2);bxc.translate(-bx[0],-bx[1]);
  ag_soft(bxc,upper,coat,MJ_H.coatHi,top[0]+30,top[1]+40,110,shade,14,hiA*0.7);
  {const g0=bxc.createLinearGradient(0,top[1]-20,0,top[1]+50);g0.addColorStop(0,"rgba(40,18,8,0.34)");g0.addColorStop(1,"rgba(40,18,8,0)");bxc.save();ag_shape(bxc,upper);bxc.clip();bxc.fillStyle=g0;bxc.fillRect(top[0]-80,top[1]-60,160,120);bxc.restore();}
  const ul=Math.hypot(low[0]-top[0],low[1]-top[1])||1,b=[(low[0]-top[0])/ul,(low[1]-top[1])/ul],nf=[b[1],-b[0]];   // down the forearm, and towards its front
  bxc.save();ag_shape(bxc,upper);bxc.clip();let g=bxc.createLinearGradient(low[0]-b[0]*36,low[1]-b[1]*36,low[0]+b[0]*6,low[1]+b[1]*6);g.addColorStop(0,rgba(pt,0));g.addColorStop(1,rgba(pt,1));bxc.fillStyle=g;bxc.fillRect(low[0]-80,low[1]-80,160,160);
  // the knee's flat front, or the point of the hock
  bxc.strokeStyle=rgba(MJ_H.pointHi,0.3);bxc.lineWidth=3;bxc.lineCap="round";bxc.beginPath();if(o.hind){bxc.moveTo(low[0]+20,low[1]-8);bxc.quadraticCurveTo(low[0]+26,low[1]+2,low[0]+18,low[1]+10);}
  else{const f0=[low[0]+nf[0]*19-b[0]*12,low[1]+nf[1]*19-b[1]*12];bxc.moveTo(f0[0],f0[1]);bxc.lineTo(f0[0]+b[0]*18,f0[1]+b[1]*18);}bxc.stroke();bxc.restore();
  bxc.setTransform(1,0,0,1,0,0);if(!o.far){bxc.globalCompositeOperation="destination-in";g=bxc.createLinearGradient(0,(top[1]-bx[1]-30)*2,0,(top[1]-bx[1]+8)*2);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,1)");
  bxc.fillStyle=g;bxc.fillRect(0,0,bc.width,bc.height);bxc.globalCompositeOperation="source-over";}
  c.drawImage(bc,bx[0],bx[1],bx[2],bx[3]);
  mj_hoof(c,J,o,deep);}
// the hoof, flat on the ground when the pastern is at rest, tilting with it when the leg lifts
function mj_hoof(c,J,o,deep){
  const hf=mj_hoofPath(J.C,(o.rest!=null?J.pa-o.rest:0)*0.9);ag_soft(c,hf,o.sock?[178,160,130]:mix(MJ_H.hoof,[0,0,0],deep),o.sock?[236,222,196]:MJ_H.hoofHi,J.C[0]+4,J.C[1]+4,34,"rgba(0,0,0,0.4)",6,0.55);
  c.save();ag_shape(c,hf);c.clip();c.fillStyle=o.sock?"rgba(210,200,184,0.9)":rgba(mix(MJ_H.point,[0,0,0],0.2),0.8);c.beginPath();c.ellipse(J.C[0]-10,J.C[1]-3,28,7,0,0,TAU);c.fill();c.restore();}
// the legs at rest (and the tapping leg's poses come from mj_tap)
const MJ_REST=0.6;
const MJ_LEGS={nearFore:()=>mj_fore([320,470],[318,704],MJ_REST,150,86),farFore:()=>mj_fore([364,464],[366,698],MJ_REST,150,86),
  nearHind:()=>mj_hind([712,520],[724,604],[716,704],MJ_REST),farHind:()=>mj_hind([690,508],[700,596],[690,698],MJ_REST)};
// the tapping leg: u 0..1 through one tap (lift, strike, settle); returns its joints
function mj_tap(u){const E=[320,470],st=[318,704];
  // the fetlock's path: the knee swings forward and up, the cannon hangs from it with the hoof flexed back; then the leg reaches
  // forward and strikes down hard, a small rebound, and still
  const k=[[0,0,0,MJ_REST],[0.3,-84,-57,-0.9],[0.48,-46,-26,0.1],[0.62,-2,0,MJ_REST],[0.71,-2,-5,MJ_REST-0.05],[1,0,0,MJ_REST]];
  let i=1;while(i<k.length-1&&u>k[i][0])i++;const a=k[i-1],b=k[i],v=ag_sine((u-a[0])/((b[0]-a[0])||1));
  const F=[st[0]+lerp(a[1],b[1],v),st[1]+lerp(a[2],b[2],v)],pa=lerp(a[3],b[3],v);return mj_fore(E,F,pa,150,86);}
// the horse's kept pictures
function mj_hLayer(key,box,res,paint){return ag_kept("mjh:"+key,Math.ceil((box[2]-box[0])*res),Math.ceil((box[3]-box[1])*res),(c)=>{c.scale(res,res);c.translate(-box[0],-box[1]);paint(c);});}
const MJ_HBOX={far:[230,380,800,790],body:[150,100,840,640],hind:[540,380,820,790],head:[40,40,240,350],tail:[720,300,840,730]};
function mj_hParts(){
  const far=mj_hLayer("far",MJ_HBOX.far,MJ_H.res,c=>{mj_paintLeg(c,MJ_LEGS.farHind(),{hind:1,far:1,rest:MJ_REST});mj_paintLeg(c,MJ_LEGS.farFore(),{far:1,rest:MJ_REST});});
  const tail=mj_hLayer("tail",MJ_HBOX.tail,MJ_H.res,c=>{ag_soft(c,mj_hTail,MJ_H.point,MJ_H.pointHi,812,440,120,"rgba(0,0,0,0.55)",18,0.5);
    c.save();ag_shape(c,mj_hTail);c.clip();c.filter="blur(2px)";c.lineCap="round";const R=ag_rnd(9);
    for(let i=0;i<9;i++){const x0=752+R()*40,lit=x0>778;c.strokeStyle=lit?"rgba(170,160,156,0.16)":"rgba(10,8,8,0.2)";c.lineWidth=3+R()*3;
      c.beginPath();c.moveTo(x0-6,330);c.bezierCurveTo(x0+22,430,x0+16+R()*10,560,x0+2+R()*12,712);c.stroke();}c.filter="none";c.restore();});
  const body=mj_hLayer("body",MJ_HBOX.body,MJ_H.res,c=>{
    ag_soft(c,mj_hBody,MJ_H.coat,MJ_H.coatHi,620,300,400,rgba(MJ_H.coatDeep,0.55),34,0.55);
    // soft light on the quarters and the shoulder, shade under the barrel and in the flank, a sheen along the back
    c.save();ag_shape(c,mj_hBody);c.clip();
    const glow=(x,y,r,col,a)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);};
    glow(712,356,118,[240,176,120],0.34);glow(330,336,104,[240,176,120],0.22);glow(276,250,80,[240,176,120],0.14);
    glow(640,452,70,[40,18,8],0.3);glow(380,470,90,[40,18,8],0.28);glow(560,470,140,[40,18,8],0.24);
    c.save();c.translate(480,528);c.scale(1,0.2);let g=c.createRadialGradient(0,0,0,0,0,330);g.addColorStop(0,"rgba(40,18,8,0.4)");g.addColorStop(1,"rgba(40,18,8,0)");c.fillStyle=g;c.fillRect(-340,-340,680,680);c.restore();
    g=c.createLinearGradient(0,560,0,610);g.addColorStop(0,rgba(MJ_H.point,0));g.addColorStop(1,rgba(MJ_H.point,1));c.fillStyle=g;c.fillRect(690,560,80,80);
    glow(742,560,40,[40,18,8],0.3);
    c.lineCap="round";c.filter="blur(6px)";c.strokeStyle="rgba(40,18,8,0.13)";c.lineWidth=10;
    c.beginPath();c.moveTo(396,304);c.bezierCurveTo(356,360,326,420,308,476);c.stroke();                  // behind the shoulder blade
    c.beginPath();c.moveTo(666,470);c.bezierCurveTo(674,424,700,388,744,358);c.stroke();                  // the stifle, up the quarters
    c.strokeStyle="rgba(255,222,186,0.2)";c.lineWidth=7;c.beginPath();c.moveTo(420,306);c.bezierCurveTo(520,318,620,306,712,298);c.stroke();
    c.filter="none";c.restore();
    ag_soft(c,mj_hMane,MJ_H.point,MJ_H.pointHi,300,190,150,"rgba(0,0,0,0.5)",12,0.4);
    c.save();ag_shape(c,mj_hMane);c.clip();c.filter="blur(1.5px)";c.strokeStyle="rgba(150,140,136,0.16)";c.lineWidth=3;c.lineCap="round";
    for(let i=0;i<9;i++){const u=(i+0.5)/9,x=lerp(200,392,u),y=lerp(128,286,u);c.beginPath();c.moveTo(x-4,y-4);c.quadraticCurveTo(x+8,y+18,x-4,y+40);c.stroke();}c.filter="none";c.restore();});
  const hind=mj_hLayer("hind",MJ_HBOX.hind,MJ_H.res,c=>mj_paintLeg(c,MJ_LEGS.nearHind(),{hind:1,sock:1,rest:MJ_REST,lowerOnly:1}));
  const head=mj_hLayer("head",MJ_HBOX.head,3,c=>mj_paintHead(c));
  return{far,tail,body,hind,head};}
function mj_paintHead(c){
  ag_soft(c,c2=>mj_hEars(c2,false),mix(MJ_H.coat,[0,0,0],0.25),MJ_H.coatHi,214,90,40,"rgba(0,0,0,0.4)",8,0.4);
  ag_soft(c,mj_hHead,MJ_H.coat,MJ_H.coatHi,176,170,150,rgba(MJ_H.coatDeep,0.55),22,0.55);
  c.save();ag_shape(c,mj_hHead);c.clip();
  // the muzzle darker and soft, the face's bony ridge in light, the hollow above the eye
  let g=c.createRadialGradient(70,300,0,70,300,74);g.addColorStop(0,"rgba(34,20,16,0.75)");g.addColorStop(1,"rgba(34,20,16,0)");c.fillStyle=g;c.fillRect(0,220,160,140);
  c.filter="blur(3px)";c.strokeStyle="rgba(255,214,170,0.2)";c.lineWidth=7;c.lineCap="round";c.beginPath();c.moveTo(152,138);c.bezierCurveTo(124,178,100,218,80,258);c.stroke();
  c.strokeStyle="rgba(40,18,8,0.28)";c.lineWidth=5;c.beginPath();c.moveTo(150,150);c.quadraticCurveTo(164,150,176,160);c.stroke();c.filter="none";c.restore();
  ag_soft(c,mj_hCheek,mix(MJ_H.coat,[255,255,255],0.03),MJ_H.coatHi,192,230,60,rgba(MJ_H.coatDeep,0.3),16,0.5);
  // the nostril and the lips
  c.fillStyle="rgba(20,12,10,0.7)";c.beginPath();c.moveTo(72,276);c.quadraticCurveTo(84,272,88,288);c.quadraticCurveTo(80,292,74,288);c.closePath();c.fill();
  c.strokeStyle="rgba(20,12,10,0.45)";c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(68,318);c.quadraticCurveTo(84,315,102,320);c.stroke();
  ag_soft(c,c2=>mj_hEars(c2,true),MJ_H.coat,MJ_H.coatHi,192,80,50,rgba(MJ_H.coatDeep,0.5),8,0.5);
  c.fillStyle="rgba(30,16,12,0.5)";c.beginPath();c.moveTo(184,120);c.bezierCurveTo(182,100,184,82,188,68);c.bezierCurveTo(192,82,194,104,194,124);c.closePath();c.fill();
  ag_soft(c,mj_hForelock,MJ_H.point,MJ_H.pointHi,180,130,40,"rgba(0,0,0,0.4)",6,0.4);
  // the bridle: the crownpiece behind the ears, the browband, the cheekpiece to the bit, the noseband, the throatlatch
  const lea="rgb(46,34,28)";c.strokeStyle=lea;c.lineCap="round";c.lineJoin="round";c.lineWidth=6;
  c.beginPath();c.moveTo(198,128);c.bezierCurveTo(186,170,160,226,112,300);c.stroke();
  c.beginPath();c.moveTo(196,132);c.quadraticCurveTo(178,140,160,146);c.stroke();
  c.beginPath();c.moveTo(152,266);c.bezierCurveTo(130,260,106,250,84,238);c.stroke();
  c.beginPath();c.moveTo(196,136);c.bezierCurveTo(208,170,214,200,208,236);c.stroke();
  c.strokeStyle="rgba(255,236,210,0.16)";c.lineWidth=2;c.beginPath();c.moveTo(196,126);c.bezierCurveTo(184,168,158,224,110,298);c.stroke();
  c.fillStyle="rgb(170,160,150)";c.beginPath();c.arc(112,302,6,0,TAU);c.fill();c.strokeStyle="rgba(60,50,44,0.6)";c.lineWidth=1.5;c.stroke();}
// the eye, live: open, blinking; at the eye (146, 173) in the head's space. A dark eye with a brown rim, the window's light in it, the
// upper lid's lashes and a soft hollow above
function mj_hEye(c,blink){c.save();const by=Math.max(0.08,1-blink),x=146,y=173;
  c.fillStyle="rgba(30,16,12,0.45)";c.beginPath();c.ellipse(x,y+1,15.5,12,-0.35,0,TAU);c.fill();
  c.save();c.translate(x,y);c.rotate(-0.35);c.scale(1,by);
  let g=c.createRadialGradient(-2,1,0,0,0,12);g.addColorStop(0,"#0E0806");g.addColorStop(0.62,"#1C0F0A");g.addColorStop(1,"#4A2818");c.fillStyle=g;c.beginPath();c.ellipse(0,0,12,8.6,0,0,TAU);c.fill();
  c.fillStyle="rgba(255,255,255,0.88)";c.beginPath();c.ellipse(4.5,-3.2,3.6,2.3,0.2,0,TAU);c.fill();
  c.fillStyle="rgba(255,255,255,0.35)";c.beginPath();c.arc(-5,3,1.4,0,TAU);c.fill();c.restore();
  // the upper lid, lowering as it blinks, with its lashes; a pale line under the eye
  const ly=lerp(166,180,1-by);c.strokeStyle="rgba(34,16,8,0.75)";c.lineWidth=2.6;c.lineCap="round";c.beginPath();c.moveTo(131,171);c.quadraticCurveTo(146,ly-8,161,166);c.stroke();
  c.lineWidth=1.4;for(const [u,d] of [[0.62,5],[0.74,6],[0.86,5]]){const px=lerp(131,161,u),py=lerp(171,166,u)-8*Math.sin(u*Math.PI)*(1-(1-by)*0.6);c.beginPath();c.moveTo(px,py);c.lineTo(px+d*0.8,py-d*0.7);c.stroke();}
  c.strokeStyle="rgba(255,214,170,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(135,183);c.quadraticCurveTo(147,188,158,180);c.stroke();c.restore();}
// large square leather blinkers, on the cheekpiece at the eye
function mj_hBlinker(c,a){if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(150,176);c.rotate(-0.42);
  const sh=cc=>ag_rect(cc,-36,-30,72,62,10);ag_soft(c,sh,[50,38,32],[120,96,80],14,-20,60,"rgba(0,0,0,0.5)",8,0.5);
  c.strokeStyle="rgba(200,180,160,0.35)";c.lineWidth=2;c.setLineDash([4,5]);ag_shape(c,cc=>ag_rect(cc,-30,-24,60,50,7));c.stroke();c.setLineDash([]);c.restore();}
/* Hans: (x, y) where his near forefoot stands on the ground, s his size (1: as drawn, the withers 468 above the ground); o:
   t the time (breathing, the tail, the ears, a blink now and then); tap 0 to 1 through one tap of the right forefoot (or o.taps,
   a list of times, each starting a tap of 0.6 s); head, a small nod in radians (plus looks down); blink; blinkers 0 to 1; flip to face right */
function mj_horse(ctx,x,y,s,o){o=o||{};const t=o.t||0,P=mj_hParts(),R=MJ_H.res;
  let tap=o.tap==null?0:o.tap;if(o.taps){for(const t0 of o.taps)if(t>=t0&&t<t0+0.6)tap=(t-t0)/0.6;}
  const breath=Math.sin(t*TAU/3.4)*1.2,sway=Math.sin(t*0.9)*0.025+Math.sin(t*2.3)*0.008,nod=(o.head||0)+Math.sin(tap*Math.PI)*0.035,
    blink=o.blink!=null?o.blink:mj_hBlinkAt(t);
  ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.translate(-316,-MJ_H.ground);
  // his shadow on the ground, falling a little to the left
  ag_floorShadow(ctx,470,MJ_H.ground+4,330,20,0.32);ag_floorShadow(ctx,316,MJ_H.ground+2,40,8,0.3);ag_floorShadow(ctx,742,MJ_H.ground+2,40,8,0.3);
  const draw=(L,b)=>ctx.drawImage(L,b[0],b[1],b[2]-b[0],b[3]-b[1]);
  draw(P.far,MJ_HBOX.far);
  ctx.save();ctx.translate(748,322);ctx.rotate(sway);ctx.translate(-748,-322);draw(P.tail,MJ_HBOX.tail);ctx.restore();
  draw(P.hind,MJ_HBOX.hind);
  ctx.save();ctx.translate(0,breath*0.4);draw(P.body,MJ_HBOX.body);ctx.restore();
  ctx.save();mj_paintLeg(ctx,tap>0&&tap<1?mj_tap(tap):MJ_LEGS.nearFore(),{rest:MJ_REST});ctx.restore();
  // the head turns about the throat; the ears follow it
  ctx.save();ctx.translate(200,200);ctx.rotate(nod);ctx.translate(-200,-200);ctx.translate(190,122);ctx.scale(0.8,0.8);ctx.translate(-190,-122);draw(P.head,MJ_HBOX.head);mj_hEye(ctx,blink);mj_hBlinker(ctx,o.blinkers||0);
  if(o.headDraw)o.headDraw(ctx);ctx.restore();
  ctx.restore();}
function mj_hBlinkAt(t){const k=Math.floor(t/5.1+3),ph=t-((k-3)*5.1+2.3+1.9*hash(k,7));return ph>0&&ph<0.18?Math.sin(ph/0.18*Math.PI):0;}
// where a point of Hans's space lands in the frame, for a horse drawn at (x, y, s)
function mj_hAt(x,y,s,p,flip){return[x+(p[0]-316)*s*(flip?-1:1),y+(p[1]-MJ_H.ground)*s];}

/* ---------------------------------------------------------------- the courtyard
   A paved courtyard in the north of Berlin, among apartment houses of five storeys: seen from inside it, at a person's eye height
   (1.6 m), looking at the brick wall at its back with the arched wooden door of the stable, the rear house's windows above it, and the
   side houses' plastered fronts with white-framed windows. Noon light from the right: the left houses' fronts are lit, the right ones
   in shade, and the shadows fall to the left. mj_P(X, Y, Z) puts a point of the courtyard (in metres: X across, Y up, Z away from us)
   in the frame; things that stand in it (Hans, the people, the blackboard) use the same, so they sit on its ground. */
const MJ_CY={back:12,left:-7.5,right:7.5,rear:16};
/* the cameras the courtyard is seen from: wide, at eye height; mid, low and closer, on the slate and Hans's forequarters; head, close
   on his head and the people by it; high, from a first-floor window behind us, so the commission's half circle reads. f the focal
   length in px, eye the camera's height, (cx, cy) where the horizon's middle falls in the frame, X0 where it stands across the
   courtyard, Z0 how far behind the courtyard's front it stands. A shot sets its camera (mj_cam), so what it draws sits on the place painted from the same one. */
const MJ_CAMS={wide:{f:900,eye:1.6,cx:960,cy:470,X0:0},mid:{f:1500,eye:1.0,cx:960,cy:480,X0:-0.86,dof:6.2},head:{f:1900,eye:1.7,cx:960,cy:520,X0:-1.6,dof:5.4},
  high:{f:1100,eye:3.4,cx:960,cy:330,X0:-0.3,Z0:-3.5}};
let MJ_CAM=MJ_CAMS.wide;
const mj_cam=k=>{MJ_CAM=MJ_CAMS[k]||k;return MJ_CAM;};
const mj_P=(X,Y,Z)=>{const d=Z-(MJ_CAM.Z0||0);return[MJ_CAM.cx+MJ_CAM.f*(X-MJ_CAM.X0)/d,MJ_CAM.cy-MJ_CAM.f*(Y-MJ_CAM.eye)/d];};
const mj_k=Z=>MJ_CAM.f/(Z-(MJ_CAM.Z0||0));                                                          // pixels per metre at depth Z
// Hans and the others in the courtyard, in metres: where Hans's near forefoot stands, where von Osten stands, the blackboard
const MJ_AT={hans:[-0.6,4.6],osten:[-2.3,4.1],board:[-3.9,5.4]};
// Hans at a point of the courtyard: his size from the depth (his withers 1.6 m above the ground)
function mj_hansAt(ctx,X,Z,o){const p=mj_P(X,0,Z);mj_horse(ctx,p[0],p[1],mj_k(Z)*1.6/468,o);return{p,s:mj_k(Z)*1.6/468};}
// someone standing at a point of the courtyard, h metres tall
function mj_standAt(ctx,X,Z,h,P,o){const p=mj_P(X,0,Z);return mj_figure(ctx,p[0],p[1],mj_k(Z)*h,P,o);}
function mj_quad(c,a,b,d,e){c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
// a window on a plane: corners from a function (u, v) -> frame point, in metres on the plane; white frame, sill, lintel, dark panes
function mj_window(c,F,u0,v0,w,h,o){o=o||{};const q=(u,v)=>F(u,v),fr=0.09;
  c.fillStyle=o.frame||"rgb(238,235,228)";c.beginPath();mj_quad(c,q(u0-fr,v0-fr),q(u0+w+fr,v0-fr),q(u0+w+fr,v0+h+fr),q(u0-fr,v0+h+fr));c.fill();
  const g=c.createLinearGradient(0,q(u0,v0+h)[1],0,q(u0,v0)[1]);g.addColorStop(0,o.glass2||"rgb(132,140,146)");g.addColorStop(1,o.glass||"rgb(96,104,112)");
  c.fillStyle=g;c.beginPath();mj_quad(c,q(u0,v0),q(u0+w,v0),q(u0+w,v0+h),q(u0,v0+h));c.fill();
  // the sky's soft light in the upper panes, the window's cross
  c.fillStyle="rgba(210,220,228,0.18)";c.beginPath();mj_quad(c,q(u0,v0+h*0.62),q(u0+w,v0+h*0.62),q(u0+w,v0+h),q(u0,v0+h));c.fill();
  c.strokeStyle=o.frame||"rgb(238,235,228)";c.lineWidth=Math.max(1.2,o.lw||2);c.beginPath();const m1=q(u0+w/2,v0),m2=q(u0+w/2,v0+h),n1=q(u0,v0+h*0.62),n2=q(u0+w,v0+h*0.62);
  c.moveTo(m1[0],m1[1]);c.lineTo(m2[0],m2[1]);c.moveTo(n1[0],n1[1]);c.lineTo(n2[0],n2[1]);c.stroke();
  // the sill (a little lighter) and the lintel's moulding
  c.fillStyle="rgba(255,252,246,0.75)";c.beginPath();mj_quad(c,q(u0-0.16,v0-0.2),q(u0+w+0.16,v0-0.2),q(u0+w+0.16,v0-0.1),q(u0-0.16,v0-0.1));c.fill();
  c.fillStyle="rgba(255,252,246,0.5)";c.beginPath();mj_quad(c,q(u0-0.2,v0+h+0.16),q(u0+w+0.2,v0+h+0.16),q(u0+w+0.2,v0+h+0.32),q(u0-0.2,v0+h+0.32));c.fill();}
function mj_paintCourtyard(c,o){o=o||{};const C=MJ_CY,au=!!o.autumn,R=ag_rnd(au?71:17);
  const light=au?[236,222,200]:[248,236,212],shadeTint=au?[150,156,170]:[160,160,166];
  // the sky, a strip above the rear house, pale
  let g=c.createLinearGradient(0,0,0,300);g.addColorStop(0,au?"#C9CFD6":"#CFD8DE");g.addColorStop(1,au?"#DCDDDB":"#E6E8E4");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the rear house behind the wall: plaster, its windows in rows
  const rz=C.rear,rearF=(u,v)=>mj_P(u,v,rz);
  c.fillStyle=au?"rgb(204,196,182)":"rgb(214,204,186)";c.beginPath();mj_quad(c,rearF(C.left-2,0),rearF(C.right+2,0),rearF(C.right+2,20),rearF(C.left-2,20));c.fill();
  for(let fl=1;fl<5;fl++)for(let k=-4;k<=4;k++){const u=k*1.9-0.5,v=fl*3.4+0.9;mj_window(c,rearF,u,v,1.0,1.75,{lw:1.5,frame:"rgb(232,228,220)"});}
  c.fillStyle="rgba(230,232,232,0.22)";c.fillRect(0,0,W,mj_P(0,3.2,C.back)[1]);
  // storey lines on the rear house
  c.strokeStyle="rgba(120,110,96,0.18)";c.lineWidth=2;for(let fl=1;fl<6;fl++){const a=rearF(C.left-2,fl*3.4+0.3),b=rearF(C.right+2,fl*3.4+0.3);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  // the side houses' fronts, receding: the left one lit, the right one in shade
  const leftF=(u,v)=>mj_P(C.left,v,u),rightF=(u,v)=>mj_P(C.right,v,u);
  const side=(F,lit)=>{const base=lit?(au?[220,206,182]:[230,216,190]):(au?[168,164,160]:[176,170,162]);
    c.fillStyle=rgba(base,1);c.beginPath();mj_quad(c,F(1.2,0),F(C.back,0),F(C.back,22),F(1.2,22));c.fill();
    // the plinth, a darker band of render at the foot
    c.fillStyle=lit?"rgba(120,100,80,0.22)":"rgba(70,66,64,0.22)";c.beginPath();mj_quad(c,F(1.2,0),F(C.back,0),F(C.back,0.8),F(1.2,0.8));c.fill();
    for(let fl=0;fl<5;fl++)for(let z=2.6;z<C.back-0.8;z+=2.3){const v=fl*3.4+(fl?0.9:1.3);mj_window(c,F,z,v,1.0,1.8,{lw:1.6,glass:lit?"rgb(104,110,118)":"rgb(84,90,98)",glass2:lit?"rgb(140,146,150)":"rgb(112,118,124)",frame:lit?"rgb(236,232,224)":"rgb(190,190,190)"});}
    c.strokeStyle=lit?"rgba(150,130,104,0.22)":"rgba(80,80,84,0.2)";c.lineWidth=3;for(let fl=1;fl<6;fl++){const a=F(1.2,fl*3.4+0.3),b=F(C.back,fl*3.4+0.3);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}};
  side(leftF,true);side(rightF,false);
  // the brick wall across the back, three metres, with a coping
  const bw=(u,v)=>mj_P(u,v,C.back),bTop=3.1,bc=au?[166,102,80]:[176,108,80];
  c.fillStyle=rgba(bc,1);c.beginPath();mj_quad(c,bw(C.left,0),bw(C.right,0),bw(C.right,bTop),bw(C.left,bTop));c.fill();
  {const k=mj_k(C.back),y0=bw(0,0)[1],x0=bw(C.left,0)[0],x1=bw(C.right,0)[0],bh=0.075*k,bl=0.25*k;
    for(let r=0;r*bh<bTop*k;r++){const y=y0-(r+1)*bh,off=(r%2)*bl/2;for(let x=x0-off;x<x1;x+=bl){const t=(R()-0.5)*16;c.fillStyle=rgba(mix(bc,[t>0?220:90,t>0?140:50,t>0?110:36],Math.abs(t)/40),1);
      c.fillRect(Math.max(x0,x+1),y+1,Math.min(bl-2,x1-x-1),bh-1.5);}}
    c.fillStyle="rgba(214,204,188,0.35)";for(let r=0;r*bh<bTop*k;r++)c.fillRect(x0,y0-r*bh-1,x1-x0,1);}
  c.fillStyle="rgb(150,146,140)";c.beginPath();mj_quad(c,bw(C.left-0.05,bTop),bw(C.right+0.05,bTop),bw(C.right+0.05,bTop+0.16),bw(C.left-0.05,bTop+0.16));c.fill();
  c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();mj_quad(c,bw(C.left-0.05,bTop+0.12),bw(C.right+0.05,bTop+0.12),bw(C.right+0.05,bTop+0.16),bw(C.left-0.05,bTop+0.16));c.fill();
  // the stable's arched wooden door, set in the wall
  {const d0=1.6,dw=2.0,dh=2.2,ar=dw/2,k=mj_k(C.back),p0=bw(d0,0),p1=bw(d0+dw,0),top=bw(d0,dh)[1],cx=(p0[0]+p1[0])/2,r=ar*k;
    const door=cc=>{cc.moveTo(p0[0],p0[1]);cc.lineTo(p0[0],top);cc.arc(cx,top,r,Math.PI,0);cc.lineTo(p1[0],p1[1]);cc.closePath();};
    c.fillStyle="rgb(120,84,58)";c.beginPath();c.moveTo(p0[0]-0.18*k,p0[1]);c.lineTo(p0[0]-0.18*k,top);c.arc(cx,top,r+0.18*k,Math.PI,0);c.lineTo(p1[0]+0.18*k,p1[1]);c.closePath();c.fillStyle="rgba(130,74,52,1)";c.fill();
    ag_soft(c,door,[104,72,48],[160,118,80],p1[0]-r*0.4,top-r*0.2,r*2.4,"rgba(30,16,8,0.5)",14,0.5);
    c.save();ag_shape(c,door);c.clip();c.strokeStyle="rgba(40,24,14,0.45)";c.lineWidth=2;for(let x=p0[0]+r/4;x<p1[0];x+=r/4){c.beginPath();c.moveTo(x,top-r);c.lineTo(x,p0[1]);c.stroke();}
    c.beginPath();c.moveTo(cx,top-r);c.lineTo(cx,p0[1]);c.lineWidth=4;c.stroke();
    c.fillStyle="rgb(52,48,46)";for(const y of [top+0.2*k,p0[1]-0.5*k])for(const s of [-1,1]){c.fillRect(s<0?p0[0]:cx+4,y,r*0.8,5);}c.restore();
    // a horseshoe over the door
    c.strokeStyle="rgb(70,66,62)";c.lineWidth=4;c.beginPath();c.arc(cx,top-r-0.32*k,0.1*k,0.2,Math.PI-0.2,true);c.stroke();}
  // the cobbles: granite setts in rows that recede, with sandy patches; painted apart and laid down a touch soft, as the room's floor is
  {const cobC=mkCanvas(W,H),cc0=c;c=cobC.getContext("2d");const z0=MJ_CAM.dof?0.6:1.2,z1=C.back;let z=z0;const rows=[];while(z<z1){const d=0.11*Math.pow(z/3,0.25);rows.push([z,z+d]);z+=d;}
    c.fillStyle=au?"rgb(150,142,130)":"rgb(158,148,134)";c.beginPath();mj_quad(c,mj_P(C.left,0,z0),mj_P(C.right,0,z0),mj_P(C.right,0,z1),mj_P(C.left,0,z1));c.fill();
    for(const [za,zb] of rows){const ya=mj_P(0,0,za)[1],yb=mj_P(0,0,zb)[1],hh=ya-yb;if(hh<0.8)continue;let x=C.left+R()*0.12;
      while(x<C.right){const w=0.13+R()*0.08,a=mj_P(x+0.012,0,za),b=mj_P(x+w-0.012,0,za),d=mj_P(x+w-0.012,0,zb),e=mj_P(x+0.012,0,zb),v=(R()-0.5);
        const sand=AG_NZ.fbm(x*0.3+3,za*0.5+9,3);const base=mix([160+v*12,153+v*11,144+v*10],[196,182,154],clamp((sand-0.55)*2,0,1)*0.6);
        c.fillStyle=rgba(base,1);c.beginPath();const rr2=Math.min(hh*0.3,(b[0]-a[0])*0.25);c.moveTo(a[0]+rr2,a[1]);c.lineTo(b[0]-rr2,b[1]);c.quadraticCurveTo(b[0],b[1],(b[0]+d[0])/2,(b[1]+d[1])/2);
        c.quadraticCurveTo(d[0],d[1],d[0]-rr2*0.6,d[1]);c.lineTo(e[0]+rr2*0.6,e[1]);c.quadraticCurveTo(e[0],e[1],(a[0]+e[0])/2,(a[1]+e[1])/2);c.quadraticCurveTo(a[0],a[1],a[0]+rr2,a[1]);c.fill();
        if(hh>3){c.fillStyle="rgba(255,250,236,0.12)";c.fillRect(e[0]+rr2,e[1]+0.5,(d[0]-e[0])-2*rr2,Math.max(1,hh*0.22));}
        x+=w;}}
    // sand drifted along the walls' feet
    g=c.createLinearGradient(0,mj_P(0,0,C.back)[1],0,mj_P(0,0,C.back)[1]+40);g.addColorStop(0,"rgba(214,198,166,0.7)");g.addColorStop(1,"rgba(214,198,166,0)");c.fillStyle=g;
    c.beginPath();mj_quad(c,mj_P(C.left,0,C.back),mj_P(C.right,0,C.back),mj_P(C.right,0,C.back-1.4),mj_P(C.left,0,C.back-1.4));c.fill();
    c=cc0;c.save();c.filter="blur(0.7px)";c.drawImage(cobC,0,0);c.restore();}
  // the light: the right house's shadow over the right of the courtyard, falling left; the walls' contact shade
  c.save();c.globalCompositeOperation="multiply";const sh=au?"rgb(178,182,196)":"rgb(196,196,204)";
  c.fillStyle=sh;c.beginPath();mj_quad(c,mj_P(C.right,0,1.2),mj_P(C.right-(au?3.6:2.4),0,1.2),mj_P(C.right-(au?3.0:1.8),0,C.back),mj_P(C.right,0,C.back));c.fill();
  c.fillStyle=sh;c.beginPath();mj_quad(c,bw(C.right-(au?3.0:1.8),0),bw(C.right,0),bw(C.right,3.4),bw(C.right-(au?2.6:1.4),3.4));c.fill();
  c.restore();
  g=c.createLinearGradient(0,mj_P(0,0,C.back)[1],0,mj_P(0,0,C.back)[1]+30);g.addColorStop(0,"rgba(40,30,24,0.22)");g.addColorStop(1,"rgba(40,30,24,0)");c.fillStyle=g;c.fillRect(0,mj_P(0,0,C.back)[1],W,30);
  // the sun's warmth from the right, the left side and the near corners in soft shade, as in the room
  g=c.createRadialGradient(1700,-80,40,1500,60,1600);g.addColorStop(0,rgba(light,au?0.2:0.3));g.addColorStop(1,rgba(light,0));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(0.35,"rgba(40,34,28,0.02)");g.addColorStop(1,"rgba(40,34,28,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,H-260,0,H);g.addColorStop(0,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(40,34,28,0.16)");c.fillStyle=g;c.fillRect(0,H-260,W,260);
  if(au){c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(232,234,242)";c.fillRect(0,0,W,H);c.restore();
    // a few fallen leaves on the cobbles
    const L=ag_rnd(23);for(let i=0;i<46;i++){const X=C.left+L()*(C.right-C.left),Z=1.6+L()*9,p=mj_P(X,0,Z),k=mj_k(Z),s=0.08*k,a=L()*TAU,col=[[176,112,52],[196,148,64],[150,84,46]][i%3];
      c.save();c.translate(p[0],p[1]);c.scale(1,0.45);c.rotate(a);c.fillStyle=rgba(col,0.9);c.beginPath();c.moveTo(-s,0);c.quadraticCurveTo(0,-s*0.7,s,0);c.quadraticCurveTo(0,s*0.7,-s,0);c.fill();
      c.strokeStyle="rgba(90,50,24,0.5)";c.lineWidth=1;c.beginPath();c.moveTo(-s,0);c.lineTo(s,0);c.stroke();c.restore();}}}
// a place painted from a camera; a close camera blurs what lies beyond its depth of field, as a lens would
function mj_courtyardFrom(cam,o){return c=>{const old=MJ_CAM;MJ_CAM=MJ_CAMS[cam];
  if(MJ_CAM.dof){const cv=mkCanvas(W,H),x=cv.getContext("2d");mj_paintCourtyard(x,o);c.save();c.filter="blur(7px)";c.drawImage(cv,0,0);c.restore();
    // the ground near the camera stays sharp: the courtyard again, clipped below the line where the depth of field ends
    const yd=mj_P(0,0,MJ_CAM.dof)[1];x.globalCompositeOperation="destination-in";const g=x.createLinearGradient(0,yd-40,0,yd+80);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,1)");
    x.fillStyle=g;x.fillRect(0,0,W,H);x.globalCompositeOperation="source-over";c.drawImage(cv,0,0);}
  else mj_paintCourtyard(c,o);
  MJ_CAM=old;};}
AG_PLACES.mjNoon=mj_courtyardFrom("wide",{});
AG_PLACES.mjNoonHead=mj_courtyardFrom("head",{});
AG_PLACES.mjNoonMid=mj_courtyardFrom("mid",{});
AG_PLACES.mjNoonHigh=mj_courtyardFrom("high",{});
AG_PLACES.mjAutumn=mj_courtyardFrom("wide",{autumn:true});
AG_PLACES.mjAutumnHead=mj_courtyardFrom("head",{autumn:true});

/* ---------------------------------------------------------------- the people of 1904, full length
   For the wide shots, where people stand in the courtyard with their feet on its ground: mj_figure(ctx, x, y, h, P, o) draws a person
   standing at (x, y) (where their feet meet the ground), h px from the soles to the crown, in three-quarter view facing right (o.flip
   for left). Drawn in a space 750 units tall (a head is 100), with an adult's proportions (seven and a half heads), matte and lit from
   the right, dressed for 1904: men in dark suits or frock coats with a white high collar, a tie, and a bowler, a top hat or a soft hat;
   women in long skirts, blouses with high collars and full sleeves, and wide hats. P: {skin, hair, beard, moustache, coat, coatLen
   ("frock" to the knee, "sack" to the hip, "long" below the knee), trousers, hat: {kind: "bowler"|"top"|"slouch"|"wide"|"cap", c, trim},
   woman, skirt, blouse}. o: t, nod (the head, in radians; up is negative), arms ("hang", "behind", "hold" (hands together in front),
   "point" (the far arm up and forward), "ask" (an open hand forward), "book" (a notebook in front of the chest), "hat" (the hat held in
   both hands)), arms2 and mix (0 to 1: on the way to a second pose), cloud (a function
   that draws above the head: (ctx, x, y, scale)). Returns where the head is, in the frame. */
const MJ_SH={far:[66,-592,44],near:[-70,-592,48]};
const MJ_ARMS={hang:{far:[MJ_SH.far,[84,-462,34],[80,-356,28]],near:[MJ_SH.near,[-92,-460,38],[-88,-352,30]]},
  hold:{far:[MJ_SH.far,[86,-470,34],[30,-418,28]],near:[MJ_SH.near,[-90,-470,38],[-8,-420,30]]},
  behind:{far:[MJ_SH.far,[82,-470,34],[60,-386,28]],near:[MJ_SH.near,[-88,-470,38],[-52,-392,30]]},
  point:{far:[MJ_SH.far,[128,-542,34],[196,-600,28]],near:[MJ_SH.near,[-92,-460,38],[-88,-352,30]]},
  ask:{far:[MJ_SH.far,[110,-500,34],[150,-520,28]],near:[MJ_SH.near,[-90,-470,38],[-8,-420,30]]},
  book:{far:[MJ_SH.far,[84,-476,34],[40,-480,28]],near:[MJ_SH.near,[-90,-480,38],[-10,-468,30]]},
  hat:{far:[MJ_SH.far,[86,-470,34],[34,-430,28]],near:[MJ_SH.near,[-90,-470,38],[-8,-432,30]]}};
function mj_figure(ctx,x,y,h,P,o){o=o||{};const k=h/750,t=o.t||0,br=Math.sin(t*TAU*0.27+(P.seed||0))*1.5,fl=o.flip?-1:1;
  ctx.save();ctx.translate(x,y);
  ag_floorShadow(ctx,-50*k,4*k,(P.woman?170:110)*k,14*k,0.32);
  ctx.scale(fl*k,k);
  const sk=P.skin||[232,196,170],dark=(c,a)=>mix(c,[0,0,0],a==null?0.35:a),lite=c=>mix(c,[255,255,255],0.35);
  const S=(fn,c,lx,ly,r,a)=>ag_soft(ctx,fn,c,lite(c),lx,ly,r,rgba(mix(c,[20,12,8],0.6),0.42),8,a==null?0.45:a);
  const coat=P.coat||[46,46,52],trou=P.trousers||dark(coat,0.15),hand=(hx,hy,a,far)=>S(c=>{c.save();c.translate(hx,hy);c.rotate(a||0);c.moveTo(-13,-6);c.bezierCurveTo(-16,16,-8,34,4,36);
      c.bezierCurveTo(16,36,18,18,15,-6);c.closePath();c.restore();},far?dark(sk,0.15):sk,hx+6,hy+8,26,0.5);
  // the legs and shoes, or the skirt
  if(P.woman){const sk2=P.skirt||[70,64,70];
    S(c=>{c.moveTo(-48,-452);c.bezierCurveTo(-74,-380,-120,-170,-140,-8);c.quadraticCurveTo(0,8,136,-8);c.bezierCurveTo(118,-170,72,-380,46,-452);c.closePath();},sk2,60,-300,240,0.4);
    ctx.save();ctx.strokeStyle=rgba(dark(sk2,0.4),0.3);ctx.lineWidth=4;ctx.lineCap="round";for(const xx of [-60,-10,40]){ctx.beginPath();ctx.moveTo(xx*0.35,-430);ctx.quadraticCurveTo(xx*0.9,-220,xx*1.9,-12);ctx.stroke();}ctx.restore();
    S(c=>{c.moveTo(40,-8);c.bezierCurveTo(40,-20,80,-22,96,-10);c.quadraticCurveTo(80,0,40,-2);c.closePath();},[38,32,32],70,-14,30);}
  else{for(const [lx,far] of [[22,1],[-24,0]]){const col=far?dark(trou,0.25):trou;
      S(mj_legPath([[lx,-392,58],[lx-2,-210,48],[lx+1,-60,42],[lx+2,-30,44]]),col,lx+18,-300,170,far?0.25:0.4);
      S(c=>{c.moveTo(lx-22,-36);c.bezierCurveTo(lx-26,-10,lx-16,0,lx+6,0);c.bezierCurveTo(lx+36,0,lx+58,-2,lx+58,-14);c.bezierCurveTo(lx+54,-26,lx+30,-34,lx+20,-40);c.closePath();},far?[24,22,24]:[34,30,30],lx+30,-22,40,0.5);}}
  // the body, breathing a little: the far arm behind it, the coat or the blouse, the near arm in front
  ctx.save();ctx.translate(0,br*0.6);
  const m=clamp(o.mix||0,0,1),arms=o.arms2&&m>=0.5?o.arms2:(o.arms||"hang"),sl=P.woman?(P.blouse||[236,232,222]):coat;
  // the arms: a pose, or on the way from o.arms to o.arms2 (o.mix 0 to 1)
  const A1=MJ_ARMS[o.arms||"hang"]||MJ_ARMS.hang,A2=o.arms2?MJ_ARMS[o.arms2]:null,
    armPts=A2&&m>0?{far:A1.far.map((q,i)=>[lerp(q[0],A2.far[i][0],ag_sine(m)),lerp(q[1],A2.far[i][1],ag_sine(m)),q[2]]),near:A1.near.map((q,i)=>[lerp(q[0],A2.near[i][0],ag_sine(m)),lerp(q[1],A2.near[i][1],ag_sine(m)),q[2]])}:A1;
  const drawArm=(pts,far)=>{const col=far?dark(sl,0.25):sl;
    const pp=P.woman?[[pts[0][0],pts[0][1]-4,pts[0][2]*1.3],[lerp(pts[0][0],pts[1][0],0.45),lerp(pts[0][1],pts[1][1],0.45),pts[0][2]*1.25],[pts[1][0],pts[1][1],pts[1][2]*0.75],[pts[2][0],pts[2][1],pts[2][2]*0.8]]:pts;
    S(mj_legPath(pp),col,pts[0][0]+16,pts[0][1]+30,120,far?0.2:0.4);
    const w=pts[2],v=pts[1],an=Math.atan2(w[1]-v[1],w[0]-v[0])-Math.PI/2;
    ctx.fillStyle=rgba(dark(col,0.2),1);ctx.save();ctx.translate(w[0],w[1]);ctx.rotate(an);ctx.fillRect(-w[2]*0.55,-4,w[2]*1.1,8);ctx.restore();
    hand(w[0]+Math.cos(an+Math.PI/2)*8,w[1]+Math.sin(an+Math.PI/2)*8,an,far);};
  drawArm(armPts.far,true);
  if(P.woman){const bl=P.blouse||[236,232,222];
    S(c=>{c.moveTo(-66,-602);c.bezierCurveTo(-74,-560,-60,-500,-46,-452);c.lineTo(46,-452);c.bezierCurveTo(58,-500,70,-560,64,-602);c.bezierCurveTo(30,-618,-34,-618,-66,-602);c.closePath();},bl,36,-570,110);
    ctx.strokeStyle=rgba(dark(bl,0.3),0.35);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(10,-600);ctx.quadraticCurveTo(14,-530,8,-456);ctx.stroke();
    ctx.fillStyle=rgba(P.belt||dark(P.skirt||[70,64,70],0.3),1);ctx.fillRect(-48,-466,94,16);}
  else{const len=P.coatLen==="sack"?-330:P.coatLen==="long"?-150:-226,hem=P.coatLen==="sack"?74:P.coatLen==="long"?98:86;
    const body=c=>{c.moveTo(-74,-604);c.bezierCurveTo(-92,-592,-96,-560,-90,-520);c.bezierCurveTo(-84,-480,-70,-458,-64,-440);c.bezierCurveTo(-74,-380,-hem,-300,-hem-4,len);
      c.quadraticCurveTo(0,len+8,hem+4,len);c.bezierCurveTo(hem,-300,76,-380,64,-440);c.bezierCurveTo(70,-470,84,-500,86,-530);c.bezierCurveTo(88,-566,82,-592,66,-604);
      c.bezierCurveTo(30,-618,-40,-618,-74,-604);c.closePath();};
    S(body,coat,46,-560,240,0.38);
    // the lapels, the waistcoat, the shirt and tie in the opening; below the button, the coat's skirts part
    S(c=>{c.moveTo(-12,-610);c.lineTo(34,-610);c.lineTo(18,-460);c.lineTo(6,-460);c.closePath();},P.waistcoat||mix(coat,[255,255,255],0.07),26,-560,60,0.3);
    ctx.fillStyle="rgb(240,238,232)";ctx.beginPath();ctx.moveTo(-4,-612);ctx.lineTo(24,-612);ctx.lineTo(14,-556);ctx.lineTo(6,-556);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(P.tie||[60,50,56],1);ctx.beginPath();ctx.moveTo(4,-610);ctx.lineTo(16,-610);ctx.lineTo(13,-574);ctx.lineTo(7,-574);ctx.closePath();ctx.fill();
    S(c=>{c.moveTo(-16,-612);c.bezierCurveTo(-30,-580,-22,-520,4,-462);c.lineTo(-4,-540);c.bezierCurveTo(-8,-570,-4,-596,-6,-610);c.closePath();},lite(coat),-10,-560,40,0.2);
    S(c=>{c.moveTo(36,-612);c.bezierCurveTo(46,-580,40,-520,18,-462);c.lineTo(26,-540);c.bezierCurveTo(30,-570,28,-596,28,-610);c.closePath();},mix(coat,[255,255,255],0.12),34,-560,40,0.2);
    ctx.strokeStyle=rgba(dark(coat,0.5),0.5);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(10,-460);ctx.quadraticCurveTo(4,-380,-6,len+4);ctx.stroke();
    ctx.fillStyle=rgba(lite(coat),0.55);for(const yy of [-474,-446])ctx.beginPath(),ctx.arc(12,yy,4,0,TAU),ctx.fill();
    ag_folds(ctx,body,[[[-60,-470],[-40,-456],[-20,-452]],[[30,-300],[40,-260],[44,-232]]],rgba(dark(coat,0.6),0.18),null);}
  if(arms==="hat")mj_hat(ctx,P.hat,12,-424,0.85,true);
  if(arms==="book"){ctx.save();ctx.translate(14,-486);ctx.rotate(-0.1);ag_soft(ctx,c=>ag_rect(c,-34,-44,68,88,4),[70,58,46],[130,112,96],20,-30,60,"rgba(0,0,0,0.4)",6,0.5);
    ctx.fillStyle="rgb(238,232,216)";ctx.fillRect(-28,-38,54,76);ctx.strokeStyle="rgba(90,80,70,0.4)";ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-22,-26+i*14);ctx.lineTo(18,-26+i*14);ctx.stroke();}ctx.restore();}
  drawArm(armPts.near,false);
  ctx.restore();
  // the head: the neck, a high collar, the face in three-quarter view, hair, beard, hat; it nods about the neck
  ctx.save();ctx.translate(0,br);const hx=6;ctx.translate(hx,-630);ctx.rotate(o.nod||0);ctx.translate(-hx,630);
  S(c=>{c.moveTo(-16,-668);c.lineTo(26,-668);c.lineTo(28,-606);c.lineTo(-18,-606);c.closePath();},dark(sk,0.12),20,-640,40,0.3);
  if(!P.woman){ctx.fillStyle="rgb(240,238,232)";ctx.beginPath();ctx.moveTo(-20,-636);ctx.quadraticCurveTo(6,-628,32,-636);ctx.lineTo(34,-610);ctx.quadraticCurveTo(6,-604,-22,-610);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(150,146,140,0.5)";ctx.lineWidth=2;ctx.stroke();}
  else{const bl=P.blouse||[236,232,222];ctx.fillStyle=rgba(bl,1);ctx.beginPath();ctx.moveTo(-20,-644);ctx.quadraticCurveTo(6,-636,32,-644);ctx.lineTo(36,-606);ctx.quadraticCurveTo(6,-600,-26,-606);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(dark(bl,0.3),0.4);ctx.lineWidth=2;ctx.stroke();}
  const head=c=>{c.moveTo(-26,-730);c.bezierCurveTo(-6,-756,36,-756,48,-726);c.bezierCurveTo(52,-714,52,-704,56,-694);c.bezierCurveTo(60,-688,62,-684,58,-680);
    c.bezierCurveTo(56,-676,54,-672,54,-668);c.bezierCurveTo(52,-656,44,-648,30,-646);c.bezierCurveTo(10,-646,-10,-654,-22,-670);c.bezierCurveTo(-36,-688,-38,-714,-26,-730);c.closePath();};
  S(head,sk,36,-714,72,0.6);
  const hair=P.hair||[60,48,40];
  if(P.woman){S(c=>{c.moveTo(-30,-700);c.bezierCurveTo(-36,-746,24,-766,50,-726);c.bezierCurveTo(30,-732,6,-730,-6,-720);c.bezierCurveTo(-14,-706,-22,-694,-30,-690);c.closePath();},hair,16,-740,60,0.4);
    S(c=>{c.ellipse(-26,-726,20,18,0,0,TAU);},hair,-20,-736,24,0.4);}
  else S(c=>{c.moveTo(-30,-700);c.bezierCurveTo(-34,-740,2,-760,40,-746);c.bezierCurveTo(10,-736,-2,-724,-8,-706);c.bezierCurveTo(-14,-692,-22,-680,-28,-676);c.closePath();},hair,0,-740,60,0.4);
  S(c=>{c.ellipse(-6,-694,8,13,0.2,0,TAU);},dark(sk,0.1),-2,-700,14,0.5);
  if(P.beard){S(c=>{c.moveTo(-10,-692);c.bezierCurveTo(-14,-662,-4,-632,16,P.beardLong?-602:-628);c.bezierCurveTo(38,P.beardLong?-606:-630,52,-648,56,-672);
      c.bezierCurveTo(46,-668,36,-670,30,-678);c.bezierCurveTo(20,-674,6,-680,-2,-694);c.closePath();},P.beard,40,-660,60,0.5);}
  if(P.moustache){S(c=>{c.moveTo(28,-678);c.bezierCurveTo(38,-688,52,-688,60,-676);c.bezierCurveTo(50,-678,40,-674,28,-670);c.closePath();},P.moustache,48,-682,20,0.4);}
  ctx.fillStyle="rgba(30,22,20,0.9)";ctx.beginPath();ctx.ellipse(24,-704,3.4,4.4,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(45,-704,2.6,4,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(mix(hair,[60,40,30],0.4),0.8);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(16,-716);ctx.lineTo(32,-718);ctx.moveTo(41,-718);ctx.lineTo(50,-716);ctx.stroke();
  if(P.hat&&arms!=="hat")mj_hat(ctx,P.hat,8,-732,1,false);
  const at=ctx.getTransform().transformPoint(new DOMPoint(14,-770));ctx.restore();
  ctx.restore();
  if(o.cloud){const m=ctx.getTransform().inverse().transformPoint(at);o.cloud(ctx,m.x,m.y,k);}
  return{x:x+fl*14*k,y:y-760*k,k};}
// a hat, centred at (x, y) on the head's top, in the figure's space; held: drawn tilted in the hands
function mj_hat(ctx,H,x,y,s,held){if(!H||!H.kind)return;const c0=H.c||[34,32,34],hi=mix(c0,[255,255,255],0.3),shd=rgba(mix(c0,[0,0,0],0.6),0.5);ctx.save();ctx.translate(x,y);ctx.scale(s,s);if(held)ctx.rotate(-0.25);
  const S=(fn,c,lx,ly,r)=>ag_soft(ctx,fn,c,mix(c,[255,255,255],0.3),lx,ly,r,rgba(mix(c,[0,0,0],0.6),0.45),8,0.45);
  if(H.kind==="bowler"){S(c=>{c.ellipse(0,4,62,12,0,0,TAU);},mix(c0,[0,0,0],0.1),20,0,50);S(c=>{c.moveTo(-40,4);c.bezierCurveTo(-42,-56,42,-56,40,4);c.closePath();},c0,18,-30,50);
    ctx.fillStyle=rgba(mix(c0,[0,0,0],0.3),1);ctx.fillRect(-40,-8,80,9);}
  else if(H.kind==="top"){S(c=>{c.ellipse(0,4,58,11,0,0,TAU);},mix(c0,[0,0,0],0.1),20,0,50);S(c=>{c.moveTo(-34,4);c.lineTo(-38,-84);c.quadraticCurveTo(0,-92,38,-84);c.lineTo(34,4);c.closePath();},c0,18,-50,70);
    ctx.fillStyle=rgba(mix(c0,[0,0,0],0.3),1);ctx.fillRect(-35,-14,70,12);}
  else if(H.kind==="slouch"){S(c=>{c.moveTo(-86,10);c.bezierCurveTo(-60,-6,60,-6,92,12);c.bezierCurveTo(70,24,-60,24,-86,10);c.closePath();},c0,30,0,70);
    S(c=>{c.moveTo(-40,0);c.bezierCurveTo(-44,-40,-24,-60,0,-54);c.bezierCurveTo(10,-48,16,-58,26,-58);c.bezierCurveTo(44,-54,46,-30,42,0);c.closePath();},c0,20,-34,50);
    ctx.fillStyle=rgba(mix(c0,[255,255,255],0.12),1);ctx.fillRect(-41,-12,83,9);}
  else if(H.kind==="wide"){S(c=>{c.ellipse(0,2,110,20,-0.04,0,TAU);},c0,30,-6,90);S(c=>{c.moveTo(-46,0);c.bezierCurveTo(-48,-44,46,-44,46,0);c.closePath();},c0,18,-24,50);
    ctx.fillStyle=rgba(H.trim||[180,150,150],1);ctx.fillRect(-46,-14,92,12);for(const [fx,fc] of [[30,[214,170,170]],[44,[230,210,190]],[18,[190,120,120]]]){ctx.fillStyle=rgba(fc,1);ctx.beginPath();ctx.arc(fx,-22,11,0,TAU);ctx.fill();}}
  else if(H.kind==="cap"){S(c=>{c.moveTo(-42,0);c.bezierCurveTo(-44,-30,40,-36,50,-6);c.lineTo(78,4);c.quadraticCurveTo(40,10,-42,0);c.closePath();},c0,20,-14,50);}
  ctx.restore();}
// a small thought cloud above someone's head, with a word in it (at least 28 px as drawn)
function mj_cloud(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const s=o.s||1,w=Math.max(84,ag_tw(ctx,text,{w:800,size:40})+44)*s,h=72*s;ctx.save();ctx.globalAlpha*=a;
  ag_about(ctx,x,y,lerp(0.6,1,o.k==null?1:o.k));const cy=y-h/2-30*s;
  ag_card(ctx,c=>{c.moveTo(x-w/2+h/2,cy-h/2);c.arc(x-w/2+h/2,cy,h/2,-Math.PI/2,Math.PI/2,true);c.lineTo(x+w/2-h/2,cy+h/2);c.arc(x+w/2-h/2,cy,h/2,Math.PI/2,-Math.PI/2,true);c.closePath();},{x:x-w/2,y:cy-h/2,w,h},{edge:o.col||null});
  for(const [dx,dy,r] of [[-6,h/2+12,9],[-14,h/2+28,6]])ag_box(ctx,x+dx*s-r*s,cy+dy*s-r*s,2*r*s,2*r*s,r*s,{});
  ag_T(ctx,text,x,cy+14*s,{w:800,size:40*s,align:"center",col:o.col||AG.ink});ctx.restore();}

/* ---------------------------------------------------------------- the things of the story
   Drawn flat to the camera, matte, in the same light. In the courtyard they stand at a point (X, Z) and take their size from its
   depth; over a shot they are cards and papers in the frame. */
const MJ_WOOD=[150,112,78],MJ_CHALK=[236,236,228],MJ_SLATE=[52,60,58];
// von Osten's blackboard on its easel, at (X, Z) in the courtyard: 1.5 by 1 m, its foot 0.8 m up, with the grid of numbers and letters
// he taught from (like the one in Pfungst's frontispiece, drawn anew; its letters are decoration). Returns the board's box.
function mj_board(ctx,X,Z,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const k=mj_k(Z),p=mj_P(X,0,Z),bw=1.5*k,bh=1.0*k,x0=p[0]-bw/2,y1=p[1]-0.8*k,y0=y1-bh;
  ctx.save();ctx.globalAlpha*=a;
  const leg=(xa,ya,xb,yb,w,col)=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=w;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(xa,ya);ctx.lineTo(xb,yb);ctx.stroke();};
  ag_floorShadow(ctx,p[0]-0.12*k,p[1]+0.03*k,0.95*k,0.07*k,0.3);
  leg(p[0]+0.06*k,y0-0.12*k,p[0]+0.42*k,p[1]-0.03*k,0.045*k,mix(MJ_WOOD,[0,0,0],0.3));
  leg(x0+0.14*k,y0-0.1*k,x0-0.06*k,p[1],0.05*k,MJ_WOOD);leg(x0+bw-0.14*k,y0-0.1*k,x0+bw+0.06*k,p[1],0.05*k,MJ_WOOD);
  ag_soft(ctx,c=>ag_rect(c,x0-0.045*k,y0-0.045*k,bw+0.09*k,bh+0.09*k,0.02*k),MJ_WOOD,[218,180,136],x0+bw*0.85,y0,bw*0.7,"rgba(40,24,12,0.4)",6,0.5);
  ag_soft(ctx,c=>ag_rect(c,x0,y0,bw,bh,0.01*k),MJ_SLATE,[104,116,112],x0+bw*0.75,y0+bh*0.15,bw*0.8,"rgba(0,0,0,0.35)",8,0.35);
  // the chalk ledge
  ag_soft(ctx,c=>ag_rect(c,x0-0.06*k,y1+0.01*k,bw+0.12*k,0.05*k,0.01*k),MJ_WOOD,[218,180,136],x0+bw*0.8,y1,bw*0.5,null);
  ctx.fillStyle=rgba(MJ_CHALK,0.95);ctx.fillRect(x0+bw*0.7,y1-0.005*k,0.09*k,0.022*k);
  // the grid: numbers along the top and the side, letters in the cells
  const cols=8,rows=5,gx=x0+bw*0.05,gy=y0+bh*0.07,cw=bw*0.9/cols,rh=bh*0.86/rows,sz=Math.max(6,rh*0.6);
  ctx.save();ctx.beginPath();ctx.rect(x0,y0,bw,bh);ctx.clip();
  ctx.fillStyle="rgba(236,236,228,0.05)";ctx.beginPath();ctx.ellipse(x0+bw*0.4,y0+bh*0.55,bw*0.42,bh*0.3,-0.1,0,TAU);ctx.fill();    // an old wiping
  ctx.strokeStyle="rgba(236,236,228,0.4)";ctx.lineWidth=Math.max(0.8,k*0.006);ctx.beginPath();
  for(let i=1;i<cols;i++){ctx.moveTo(gx+cw*i,gy);ctx.lineTo(gx+cw*i+0.004*k,gy+rh*rows);}for(let j=1;j<rows;j++){ctx.moveTo(gx,gy+rh*j);ctx.lineTo(gx+cw*cols,gy+rh*j+0.004*k);}ctx.stroke();
  const L="abcdefghijklmnopqrstuvwxyz";
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let s="";if(j===0&&i>0)s=String(i);else if(i===0&&j>0)s=String(j);else if(i>0&&j>0){const n=(j-1)*(cols-1)+(i-1);s=n<26?L[n]:"";}
    if(s)ag_T(ctx,s,gx+cw*(i+0.5),gy+rh*(j+0.5)+sz*0.36,{w:600,size:sz,align:"center",color:"rgba(236,236,228,0.85)",deco:1});}
  ctx.restore();ctx.restore();return{x:x0,y:y0,w:bw,h:bh,k};}
// a small easel with a slate on it, at (X, Z): the slate 0.8 by 0.59 m, its middle 1.15 m up; returns the slate's box in the frame
function mj_easel(ctx,X,Z,o){o=o||{};const a=o.a==null?1:o.a,k=mj_k(Z),p=mj_P(X,0,Z),w=0.8*k,h=0.59*k,x0=p[0]-w/2,y0=p[1]-1.15*k-h/2;if(a<=0)return{x:x0,y:y0,w,k};
  ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,p[0]-0.06*k,p[1]+0.02*k,0.42*k,0.05*k,0.3);
  ctx.lineCap="round";const leg=(xa,ya,xb,yb,col)=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=0.032*k;ctx.beginPath();ctx.moveTo(xa,ya);ctx.lineTo(xb,yb);ctx.stroke();};
  leg(p[0]+0.02*k,y0,p[0]+0.26*k,p[1]-0.02*k,mix(MJ_WOOD,[0,0,0],0.3));leg(x0+0.08*k,y0+0.05*k,x0-0.12*k,p[1],MJ_WOOD);leg(x0+w-0.08*k,y0+0.05*k,x0+w+0.12*k,p[1],MJ_WOOD);
  ag_soft(ctx,c=>ag_rect(c,x0-0.06*k,y0+h+0.01*k,w+0.12*k,0.04*k,0.01*k),MJ_WOOD,[218,180,136],x0+w*0.8,y0+h,w*0.5,null);
  ctx.restore();return{x:x0,y:y0,w,k};}
/* a slate, flat, its top left at (x, y), w wide and 0.74 w tall, in a wooden frame. o: text (in chalk, "3 + 2"); ticks (how many
   chalk ticks count the taps so far, in fives; tick, 0 to 1, how far the latest is drawn); past (the answer: ticks after it are
   amber); cal ({month, day, year}: a calendar page pinned on it instead); next and turn (0 to 1: it turns over, about its middle, to the
   face o.next, {text, cal}); a. Words at least 28 px as drawn: keep w at least 230. */
function mj_slate(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*0.74,u=clamp(o.turn||0,0,1),face=u<0.5?o:Object.assign({},o,o.next||{},{ticks:0}),sx=Math.abs(Math.cos(u*Math.PI));
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.scale(Math.max(0.02,sx),1);ctx.translate(-w/2,-h/2);
  const fr=w*0.045;ag_soft(ctx,c=>ag_rect(c,0,0,w,h,w*0.02),MJ_WOOD,[226,190,146],w*0.85,0,w*0.8,"rgba(40,24,12,0.45)",8,0.55);
  ag_soft(ctx,c=>ag_rect(c,fr,fr,w-2*fr,h-2*fr,w*0.01),MJ_SLATE,[100,112,108],w*0.7,h*0.2,w*0.8,"rgba(0,0,0,0.4)",10,0.35);
  ctx.save();ctx.beginPath();ctx.rect(fr,fr,w-2*fr,h-2*fr);ctx.clip();ctx.fillStyle="rgba(236,236,228,0.05)";ctx.beginPath();ctx.ellipse(w*0.45,h*0.55,w*0.36,h*0.25,0.1,0,TAU);ctx.fill();
  if(face.cal){const C=face.cal,px=w*0.2,py=h*0.1,pw=w*0.6,ph=h*0.8;
    ctx.save();ctx.shadowColor="rgba(0,0,0,0.35)";ctx.shadowBlur=10;ctx.shadowOffsetY=4;ctx.fillStyle="rgb(240,236,226)";ctx.fillRect(px,py,pw,ph);ctx.restore();
    ctx.fillStyle="rgb(150,64,52)";ctx.fillRect(px,py,pw,ph*0.24);
    ag_T(ctx,C.month,px+pw/2,py+ph*0.17,{w:700,size:Math.max(28,w*0.07),align:"center",color:"rgb(250,244,236)",ls:2});
    ag_T(ctx,String(C.day),px+pw/2,py+ph*0.74,{w:800,size:w*0.24,align:"center",col:[40,34,30]});
    ag_T(ctx,String(C.year),px+pw/2,py+ph*0.93,{w:600,size:Math.max(28,w*0.07),align:"center",col:[90,80,72]});}
  else{if(face.text)ag_T(ctx,face.text,w/2,h*0.42,{w:700,size:w*0.19,align:"center",color:"rgba(240,240,232,0.95)"});
    // the ticks, in fives: four down, the fifth across them
    const n=face.ticks||0,past=o.past==null?1e9:o.past,tw=w*0.042,gw=w*0.25,y0=h*0.6,y1=h*0.82,x0=w*0.16;
    ctx.lineCap="round";ctx.lineWidth=w*0.018;
    for(let i=0;i<n;i++){const g=Math.floor(i/5),j=i%5,p=i===n-1?clamp(o.tick==null?1:o.tick,0,1):1,amb=i>=past,col=amb?rgba(mix(AG.amber,[255,220,150],0.35),0.95):"rgba(240,240,232,0.92)";
      const gx=x0+g*gw,jit=hash(i,3)-0.5;ctx.strokeStyle=col;ctx.beginPath();
      if(j<4){const xa=gx+j*tw+jit*3,ya=y0+jit*4;ctx.moveTo(xa,ya);ctx.lineTo(xa+w*0.01,lerp(ya,y1,p));}
      else{const xa=gx-tw*0.5,ya=y1-h*0.04,xb=gx+tw*3.6,yb=y0+h*0.04;ctx.moveTo(xa,ya);ctx.lineTo(lerp(xa,xb,p),lerp(ya,yb,p));}ctx.stroke();}}
  ctx.restore();ctx.restore();}
/* a newspaper page, flat, its top left at (x, y), w wide: a masthead (decoration), the headline o.head, large, and columns of
   print. o.next and o.turn (0 to 1): the headline changes, the old one sliding up and out as the new one comes in; o.rot; o.k (springs
   in from 0.6 of its size); o.a */
function mj_paper(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*1.3,pad=w*0.07,K=o.k==null?1:lerp(0.6,1,o.k),ink=[38,34,32];
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.scale(K,K);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.32)";ctx.shadowBlur=34;ctx.shadowOffsetX=AG.sdx*1.5;ctx.shadowOffsetY=18;ctx.fillStyle="rgb(234,228,214)";ctx.fillRect(0,0,w,h);ctx.restore();
  let g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,252,244,0.5)");g.addColorStop(1,"rgba(200,190,170,0.25)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  // the masthead, between two rules: the place and the year, as decoration
  ctx.fillStyle=rgba(ink,0.85);ctx.fillRect(pad,pad,w-2*pad,3);ctx.fillRect(pad,pad+w*0.13,w-2*pad,1.5);
  ag_T(ctx,"BERLIN · 1904",w/2,pad+w*0.095,{w:800,size:w*0.06,align:"center",col:ink,ls:w*0.012,deco:1});
  // the headline: the old one leaving, the new one arriving
  const hy=pad+w*0.32,hs=Math.min(w*0.13,72),u=clamp(o.turn||0,0,1);
  ctx.save();ctx.beginPath();ctx.rect(pad,pad+w*0.15,w-2*pad,w*0.24);ctx.clip();
  const head=(s,dy,al)=>{if(al<=0||!s)return;const sz=Math.min(hs,(w-2*pad)/Math.max(1,ag_tw(ctx,s,{w:800,size:hs}))*hs);ag_T(ctx,s,w/2,hy+dy,{w:800,size:sz,align:"center",col:ink,a:al});};
  head(o.head,-ag_sine(u)*w*0.2,1-ag_sine(u));head(o.next,(1-ag_sine(u))*w*0.2,ag_sine(u));ctx.restore();
  ctx.fillStyle=rgba(ink,0.7);ctx.fillRect(pad,pad+w*0.42,w-2*pad,1.5);
  // the print: three columns of grey lines, a small picture in the first
  const cw=(w-2*pad-2*w*0.04)/3,top=pad+w*0.47;ctx.fillStyle=rgba(ink,0.22);
  for(let ci=0;ci<3;ci++){const cx=pad+ci*(cw+w*0.04);let yy=top;if(ci===0){ctx.fillStyle="rgba(120,110,96,0.32)";ctx.fillRect(cx,yy,cw,cw*0.7);ctx.fillStyle=rgba(ink,0.22);yy+=cw*0.7+w*0.03;}
    for(;yy<h-pad;yy+=w*0.026){const lw=hash(ci*97+Math.round(yy),5)<0.12?cw*0.6:cw;ctx.fillRect(cx,yy,lw,w*0.011);}}
  ctx.restore();}
/* a grid of 100 dots, ten by ten, on a card: the answers given, right ones in green; p 0 to 1 how many are in so far; label over it.
   right: the indices of the right ones. (x, y) the card's top left, cell the dots' spacing. */
const MJ_RIGHT={blind:[7,23,41,58,76,92],seen:[]};
{const miss=[4,15,19,33,47,52,61,70,84,88,97];for(let i=0;i<100;i++)if(!miss.includes(i))MJ_RIGHT.seen.push(i);}
function mj_grid(ctx,x,y,cell,right,p,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const pad=30,lh=60,w=cell*10+pad*2,h=cell*10+pad*2+lh;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.6});
  ag_T(ctx,label,x+pad,y+pad+28,{w:700,size:30,col:AG.ink});
  const n=Math.floor(clamp(p,0,1)*100+1e-6),set=new Set(right);
  for(let i=0;i<100;i++){const cx=x+pad+cell*(i%10+0.5),cy=y+pad+lh+cell*(Math.floor(i/10)+0.5),r=cell*0.3;
    if(i>=n){ctx.strokeStyle="rgba(86,92,100,0.22)";ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();continue;}
    const ok=set.has(i),pop=i===n-1?ag_eo((p*100-i)):1;ctx.fillStyle=ok?rgba(AG.green,1):"rgba(150,150,156,0.55)";ctx.beginPath();ctx.arc(cx,cy,r*lerp(0.4,1,pop),0,TAU);ctx.fill();}
  ctx.restore();return{x,y,w,h};}
// a magnifying glass at (x, y), r its glass's radius: o.draw(ctx) draws what it shows, clipped to the glass (the caller magnifies);
// a brass rim, a dark wooden handle down and to the right; o.a
function mj_lens(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const an=0.72,hx=x+Math.cos(an)*r,hy=y+Math.sin(an)*r;
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.35)";ctx.shadowBlur=24;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=12;ctx.strokeStyle="#3A2E26";ctx.lineWidth=r*0.16;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(hx+Math.cos(an)*r*0.12,hy+Math.sin(an)*r*0.12);ctx.lineTo(hx+Math.cos(an)*r*0.95,hy+Math.sin(an)*r*0.95);ctx.stroke();ctx.restore();
  ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=r*0.04;ctx.beginPath();ctx.moveTo(hx+Math.cos(an)*r*0.2-3,hy+Math.sin(an)*r*0.2);ctx.lineTo(hx+Math.cos(an)*r*0.9-3,hy+Math.sin(an)*r*0.9);ctx.stroke();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.fillStyle="#F2F0EA";ctx.fillRect(x-r,y-r,2*r,2*r);if(o.draw)o.draw(ctx);
  const g=ctx.createRadialGradient(x-r*0.35,y-r*0.4,0,x,y,r);g.addColorStop(0,"rgba(255,255,255,0.28)");g.addColorStop(0.5,"rgba(255,255,255,0.04)");g.addColorStop(1,"rgba(80,90,100,0.22)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();
  const rg=ctx.createLinearGradient(x-r,y-r,x+r,y+r);rg.addColorStop(0,"#E2C68E");rg.addColorStop(0.5,"#B08A4E");rg.addColorStop(1,"#7A5A2E");
  ctx.strokeStyle=rg;ctx.lineWidth=r*0.09;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.restore();}
// a sealed envelope centred on (x, y), w wide: the flap's lines, a wax seal, and o.word on its face (at least 28 px); o.rot, o.a
function mj_envelope(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*0.6;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.3)";ctx.shadowBlur=22;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=10;ctx.fillStyle="rgb(232,222,200)";ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ctx.strokeStyle="rgba(120,100,70,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w/2,-h/2);ctx.lineTo(0,h*0.08);ctx.lineTo(w/2,-h/2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-w/2,h/2);ctx.lineTo(-w*0.12,-h*0.02);ctx.moveTo(w/2,h/2);ctx.lineTo(w*0.12,-h*0.02);ctx.stroke();
  ag_soft(ctx,c=>{c.arc(0,h*0.06,w*0.07,0,TAU);},[150,44,40],[210,110,96],w*0.02,h*0.02,w*0.08,"rgba(60,10,10,0.5)",4,0.6);
  if(o.word)ag_T(ctx,o.word,0,h*0.38,{w:700,size:Math.max(28,w*0.1),align:"center",col:[70,58,46]});
  ctx.restore();}
// a dashed line of sight from A to B, drawn on to p
function mj_sight(ctx,A,B,p,a){if(a<=0||p<=0)return;const q=ag_sine(p),E=[lerp(A[0],B[0],q),lerp(A[1],B[1],q)];ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(250,248,240,0.95)";
  ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([2,16]);ctx.shadowColor="rgba(0,0,0,0.35)";ctx.shadowBlur=6;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(E[0],E[1]);ctx.stroke();ctx.setLineDash([]);
  ctx.restore();}

/* ---------------------------------------------------------------- the people of 1904
   Full length in the wide shots (mj_figure), and from the waist up, as the series draws its people, in the close ones (ag_person with
   a spec of their own, plus what the shared people don't wear: a long beard, a high collar, a moustache, and hats drawn live, since a
   brim reaches past the head's own picture). */
const MJ_FIG={
  osten:{skin:[236,206,186],hair:[232,230,226],beard:[238,236,232],beardLong:1,coat:[206,196,176],coatLen:"long",trousers:[70,66,62],waistcoat:[192,184,168],tie:[50,46,48],hat:{kind:"slouch",c:[34,32,34]},seed:1},
  pfungst:{skin:[236,204,180],hair:[46,36,30],moustache:[52,40,32],coat:[44,44,52],coatLen:"sack",trousers:[46,46,54],waistcoat:[58,58,66],tie:[30,30,36],hat:{kind:"bowler",c:[30,30,32]},seed:2},
  asker:{skin:[230,196,170],hair:[96,80,66],moustache:[90,72,58],coat:[62,56,52],coatLen:"frock",trousers:[56,52,50],tie:[60,40,40],hat:{kind:"bowler",c:[40,38,38]},seed:3}};
// the thirteen men of the commission, in 1904 dress (the two officers retired, in civilian coats), and the visitors
const MJ_MEN=[
  {skin:[232,198,172],hair:[90,74,60],moustache:[80,64,52],coat:[46,46,52],coatLen:"frock",hat:{kind:"bowler",c:[30,30,32]}},
  {skin:[236,206,186],hair:[150,144,138],beard:[150,144,138],coat:[60,52,48],coatLen:"sack",hat:{kind:"top",c:[28,28,30]}},
  {skin:[228,190,164],hair:[60,48,40],beard:[60,48,40],coat:[38,40,48],coatLen:"frock",hat:{kind:"bowler",c:[36,34,34]}},
  {skin:[234,202,178],hair:[200,196,190],moustache:[204,200,194],coat:[74,66,60],coatLen:"sack",hat:{kind:"slouch",c:[60,54,50]}},
  {skin:[230,196,170],hair:[50,40,34],moustache:[44,34,28],coat:[44,46,56],coatLen:"long",hat:{kind:"top",c:[26,26,30]}},
  {skin:[236,204,182],hair:[170,164,156],beard:[176,170,162],beardLong:1,coat:[52,48,46],coatLen:"long",hat:{kind:"bowler",c:[34,32,32]}},
  {skin:[226,188,160],hair:[90,70,56],moustache:[90,70,56],coat:[36,36,40],coatLen:"frock",hat:{kind:"top",c:[24,24,28]}},
  {skin:[232,200,176],hair:[66,52,42],moustache:[60,46,38],coat:[64,60,70],coatLen:"sack",hat:{kind:"bowler",c:[40,36,36]}},
  {skin:[228,194,168],hair:[96,80,66],beard:[96,80,66],coat:[48,44,40],coatLen:"frock",hat:{kind:"slouch",c:[42,40,42]}},
  {skin:[234,204,180],hair:[180,176,170],moustache:[186,182,176],coat:[40,44,52],coatLen:"long",hat:{kind:"top",c:[26,26,30]}},
  {skin:[230,198,172],hair:[52,42,36],beard:[52,42,36],coat:[58,52,46],coatLen:"sack",hat:{kind:"bowler",c:[30,30,32]}},
  {skin:[236,206,184],hair:[120,100,80],moustache:[120,100,80],coat:[46,40,44],coatLen:"frock",hat:{kind:"bowler",c:[44,40,40]}},
  {skin:[226,190,164],hair:[76,62,52],moustache:[70,56,46],coat:[70,64,58],coatLen:"sack",hat:{kind:"top",c:[30,30,34]}}].map((P,i)=>Object.assign({seed:i*1.7+4},P));
const MJ_VISITORS=[
  {woman:1,skin:[236,206,186],hair:[110,74,50],blouse:[238,232,220],skirt:[64,70,92],hat:{kind:"wide",c:[200,184,160],trim:[150,90,96]},seed:21},
  {skin:[230,196,170],hair:[70,56,46],moustache:[70,56,46],coat:[58,54,52],coatLen:"sack",hat:{kind:"cap",c:[70,64,58]},seed:22},
  {woman:1,skin:[232,200,178],hair:[60,44,36],blouse:[226,220,232],skirt:[92,64,60],hat:{kind:"wide",c:[60,56,60],trim:[200,190,170]},seed:23},
  {skin:[234,204,180],hair:[120,100,80],coat:[44,46,52],coatLen:"frock",moustache:[110,90,70],hat:{kind:"bowler",c:[34,32,32]},seed:24},
  {skin:[228,192,166],hair:[46,38,34],coat:[80,72,62],coatLen:"sack",hat:{kind:"bowler",c:[60,52,46]},seed:25},
  {woman:1,skin:[236,208,190],hair:[150,108,70],blouse:[240,236,226],skirt:[50,60,70],hat:{kind:"wide",c:[226,214,190],trim:[110,130,150]},seed:26}];
// a high stiff collar, painted over the shirt (for the shared people's spec, top.paint)
function mj_highCollar(c){ag_soft(c,cc=>{cc.moveTo(232,540);cc.bezierCurveTo(260,566,318,578,362,560);cc.lineTo(364,604);cc.bezierCurveTo(318,622,258,614,232,584);cc.closePath();},
  [244,242,236],[255,255,255],330,560,80,"rgba(80,70,60,0.3)",8);
  c.strokeStyle="rgba(120,110,100,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(300,574);c.lineTo(304,610);c.stroke();}
// a long white beard from the jaw over the chest, drawn live with the head (mj_headHat); the head's own short beard covers the jaw under it
function mj_longBeard(col){return c=>{const B=cc=>{cc.moveTo(276,462);cc.bezierCurveTo(262,520,270,600,300,650);cc.bezierCurveTo(318,684,340,712,356,716);
    cc.bezierCurveTo(374,712,390,684,400,640);cc.bezierCurveTo(410,590,408,530,398,486);cc.bezierCurveTo(384,516,352,532,320,524);cc.bezierCurveTo(298,516,284,494,276,462);cc.closePath();};
  ag_soft(c,B,col,[255,255,255],366,560,150,"rgba(90,86,80,0.38)",16,0.6);
  c.save();ag_shape(c,B);c.clip();c.strokeStyle="rgba(140,136,130,0.28)";c.lineWidth=2.2;c.lineCap="round";
  for(const [x0,x1] of [[296,318],[314,332],[332,346],[350,358],[368,368],[386,378]]){c.beginPath();c.moveTo(x0,520);c.quadraticCurveTo(x0+4,610,x1,700);c.stroke();}c.restore();};}
function mj_moustache(col){return c=>{ag_soft(c,cc=>{cc.moveTo(348,476);cc.bezierCurveTo(354,462,374,457,393,464);cc.bezierCurveTo(396,470,392,476,385,476);cc.bezierCurveTo(372,471,360,474,348,478);cc.closePath();},
  col,mix(col,[255,255,255],0.3),384,466,24,"rgba(0,0,0,0.3)",4,0.4);};}
const MJ_PERSON={
  osten:{name:"Wilhelm von Osten",key:"mjOsten",skin:[236,206,186],hair:{style:"cropped",c:[234,232,228]},beard:[240,238,234],
    top:{kind:"suit",c:[200,190,170],inner:[242,240,234],tie:[50,46,48]},hat:{paint:mj_moustache([236,234,230])},longBeard:[240,238,234],breath:0.22},
  pfungst:{name:"Oskar Pfungst",key:"mjPfungst",skin:[236,204,180],hair:{style:"side",c:[46,36,30]},
    top:{kind:"suit",c:[44,44,52],inner:[244,242,236],tie:[34,34,42],paint:mj_highCollar},hat:{paint:mj_moustache([54,42,34])},breath:0.28},
  subject:{name:"A student",key:"mjSubject",skin:[232,198,172],hair:{style:"side",c:[110,86,64]},
    top:{kind:"suit",c:[76,68,62],inner:[244,242,236],tie:[90,50,48],paint:mj_highCollar},breath:0.3}};
// a hat on a shared person's head, drawn live in figure space with the head's own movement (ag_person's transform); kind as mj_hat's
// (and a long beard, P.longBeard, which hangs past the head's picture, over the neck and the chest). kind null: the beard alone.
function mj_headHat(ctx,P,x,y,s,o,kind,col){o=o||{};const t=o.t||0,br=Math.sin(t*TAU*(P.breath||0.28))*2.2;ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.translate(-296,-596);
  ctx.translate(282,480+br*0.7);ctx.rotate(o.nod||0);ctx.translate(-282,-480);if(o.lift)ctx.translate(0,-o.lift);
  if(P.longBeard)mj_longBeard(P.longBeard)(ctx);if(kind)mj_hatShape(ctx,kind,col);ctx.restore();}
// the hats, in figure space over a head whose top is at y 300 and runs from x 212 to 392
function mj_hatShape(ctx,kind,col){const S=(fn,c,lx,ly,r)=>ag_soft(ctx,fn,c,mix(c,[255,255,255],0.28),lx,ly,r,rgba(mix(c,[0,0,0],0.6),0.45),10,0.4);
  if(kind==="slouch"){S(c=>{c.moveTo(150,334);c.bezierCurveTo(196,306,404,300,452,326);c.bezierCurveTo(460,336,446,344,430,344);c.bezierCurveTo(360,334,240,338,170,350);c.bezierCurveTo(152,352,142,344,150,334);c.closePath();},col,380,318,140);
    S(c=>{c.moveTo(222,322);c.bezierCurveTo(214,270,240,234,290,230);c.bezierCurveTo(312,230,318,244,334,240);c.bezierCurveTo(372,232,396,262,392,322);c.closePath();},col,350,262,110);
    ctx.fillStyle=rgba(mix(col,[255,255,255],0.12),1);ctx.beginPath();ctx.moveTo(222,312);ctx.bezierCurveTo(280,302,340,302,392,310);ctx.lineTo(392,324);ctx.bezierCurveTo(340,316,280,316,222,326);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(mix(col,[0,0,0],0.5),0.5);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(300,240);ctx.quadraticCurveTo(312,262,306,290);ctx.stroke();}
  else if(kind==="bowler"){S(c=>{c.ellipse(304,334,124,20,-0.03,0,TAU);},mix(col,[0,0,0],0.1),380,330,120);
    S(c=>{c.moveTo(222,330);c.bezierCurveTo(218,250,392,250,388,330);c.closePath();},col,350,272,110);ctx.fillStyle=rgba(mix(col,[0,0,0],0.3),1);ctx.fillRect(222,312,166,16);}}

/* ---------------------------------------------------------------- Pfungst's laboratory, 1904
   A plain room at the university's psychological institute: a pale grey-green wall, dark wooden panelling to the dado, a tall window on
   the right with the day's light, a framed chart on the wall; the table across the front is drawn in the scene, over the people's waists. */
function mj_paintLab04(c){let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"#A9AC9E");g.addColorStop(0.6,"#C3C5B6");g.addColorStop(1,"#D4D4C4");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the window: deep reveal, white frame, bright panes
  const wx=1480,wy=110,ww=330,wh=560;c.fillStyle="#9EA294";c.fillRect(wx-26,wy-22,ww+52,wh+44);
  g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"#F4F6F2");g.addColorStop(1,"#E2E8E6");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.strokeStyle="#ECEAE2";c.lineWidth=14;c.strokeRect(wx,wy,ww,wh);c.lineWidth=8;c.beginPath();c.moveTo(wx+ww/2,wy);c.lineTo(wx+ww/2,wy+wh);c.moveTo(wx,wy+wh*0.36);c.lineTo(wx+ww,wy+wh*0.36);c.stroke();
  // its light falling into the room, and on the wall to its left
  c.save();c.globalCompositeOperation="screen";g=c.createLinearGradient(wx,0,wx-900,0);g.addColorStop(0,"rgba(255,246,226,0.32)");g.addColorStop(1,"rgba(255,246,226,0)");c.fillStyle=g;
  c.beginPath();c.moveTo(wx,wy);c.lineTo(wx,wy+wh);c.lineTo(wx-700,H);c.lineTo(wx-1100,H);c.closePath();c.fill();c.restore();
  // the panelling: a dado rail, dark panels, the skirting
  const py=600;c.fillStyle="#5E4634";c.fillRect(0,py,W,H-py);c.fillStyle="#7A5C44";c.fillRect(0,py-14,W,18);c.fillStyle="rgba(255,236,210,0.25)";c.fillRect(0,py-14,W,3);
  for(let x=40;x<W;x+=300){ag_soft(c,cc=>ag_rect(cc,x,py+30,250,150,6),[104,78,58],[150,116,88],x+200,py+40,200,"rgba(20,10,4,0.45)",10,0.35);}
  // a framed chart on the wall (decoration)
  ag_soft(c,cc=>ag_rect(cc,420,180,360,260,4),[70,52,40],[120,96,76],700,190,300,null);c.fillStyle="#EEEADE";c.fillRect(436,196,328,228);
  c.strokeStyle="rgba(60,50,40,0.35)";c.lineWidth=2;c.beginPath();for(let i=0;i<=12;i++){const x=456+i*24,y=400-Math.abs(Math.sin(i*0.9))*120-i*6;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  // soft shade in the corners
  g=c.createRadialGradient(1100,420,200,960,540,1300);g.addColorStop(0,"rgba(30,26,20,0)");g.addColorStop(1,"rgba(30,26,20,0.3)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mjLab04=mj_paintLab04;
// the institute's table across the front, its back edge at y: dark oiled wood
function mj_table04(ctx,y){let g=ctx.createLinearGradient(0,y,0,y+70);g.addColorStop(0,"#8A684C");g.addColorStop(1,"#6E5038");ctx.fillStyle=g;ctx.fillRect(0,y,W,70);
  ctx.fillStyle="rgba(255,236,210,0.3)";ctx.fillRect(0,y+68,W,3);g=ctx.createLinearGradient(0,y+70,0,H);g.addColorStop(0,"#5A402C");g.addColorStop(1,"#4A3424");ctx.fillStyle=g;ctx.fillRect(0,y+71,W,H-y-71);}
