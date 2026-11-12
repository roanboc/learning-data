/* ===== The people of the four communities =====
   Dressed from the sources' photographs and words, in plain colours that mean nothing in these films: men in a felt hat or a knitted
   cap with ear flaps, a wool jacket and dark trousers; women in a felt hat, a jacket, a full skirt and two long braids. No pattern is
   invented and none is copied; nobody drawn is a likeness of a real person.
     pb_fig(ctx, x, y, h, o)     a small whole person for the wide view, seen from the side: (x, y) where the feet stand (or where they
                                 sit), h their height in px (about 50 at the bridge). o.who a number (one of PB_FOLK, round and round)
                                 or a spec like those; o.pose "stand", "walk", "haul" (leaning back on a rope), "sit" (on the ground,
                                 hands at work in the lap), "astride" (sitting on the floor cables, a leg down each side), "carry"
                                 (walking with a load on the shoulder), "bend" (stooping to tie); o.t for the walk's step; o.flip to
                                 face left; o.shadow (0.3; 0 for none); o.a. Returns {hand, hand2, head, sh} in the picture's own
                                 px: where the hands, the head and the shoulder are, to tie a rope or a load to
     PB_PEOPLE                   half-figures for lp_person: two bridge builders, two more men, three women
     pb_hat(col, band), pb_cap(col), pb_capHat(cap, hat, band)   what they wear on their heads, inside the head's picture
     pb_braid(col)               a woman's near braid, over her shoulder (painted with her body, so it never parts from her head)
     pb_coil(ctx, x, y, r, o)    a coil of thin grass cord, for a hand to hold */

const PB_FOLK=[
  {k:"man",hat:"felt",hatC:[226,212,184],band:[112,84,66],top:[228,218,196],legs:[62,58,62],skin:[172,120,88]},
  {k:"woman",hat:"felt",hatC:[212,196,166],band:[96,62,54],top:[156,64,56],skirt:[96,74,84],legs:[70,58,54],skin:[178,126,94]},
  {k:"man",hat:"cap",hatC:[150,66,56],top:[128,100,78],legs:[70,66,70],skin:[160,110,80]},
  {k:"woman",hat:"felt",hatC:[136,104,80],band:[226,214,190],top:[72,68,74],skirt:[142,60,54],legs:[70,58,54],skin:[168,116,86]},
  {k:"man",hat:"felt",hatC:[146,116,90],band:[70,56,50],top:[196,184,164],legs:[86,74,64],skin:[182,130,96]},
  {k:"woman",hat:"felt",hatC:[228,216,190],band:[146,62,56],top:[226,214,190],skirt:[104,70,76],legs:[70,58,54],skin:[174,122,90]},
  {k:"man",hat:"cap",hatC:[112,70,62],top:[226,216,196],legs:[58,56,62],skin:[166,114,84]},
  {k:"woman",hat:"felt",hatC:[196,176,146],band:[70,58,54],top:[128,82,72],skirt:[112,88,76],legs:[70,58,54],skin:[184,132,98]}];
// a limb: from a to b, w0 wide at a and w1 at b, its ends round
function pb_limb(c,a,b,w0,w1,col){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,an=Math.atan2(dy,dx);
  c.fillStyle=col;c.beginPath();c.moveTo(a[0]+nx*w0/2,a[1]+ny*w0/2);c.lineTo(b[0]+nx*w1/2,b[1]+ny*w1/2);c.arc(b[0],b[1],w1/2,an+Math.PI/2,an-Math.PI/2,true);
  c.lineTo(a[0]-nx*w0/2,a[1]-ny*w0/2);c.arc(a[0],a[1],w0/2,an-Math.PI/2,an-Math.PI*1.5,true);c.closePath();c.fill();}
// the poses, as angles in degrees from straight down, towards the way they face: lean (the body), near and far leg [thigh, shin],
// near and far arm [upper, fore]; hip where the hips are above the feet (or the seat)
function pb_pose(name,t,woman){const s=Math.sin(t*5.4),c=Math.cos(t*5.4);
  if(name==="walk"||name==="carry")return{lean:4,hip:48-1.2*Math.abs(c),near:[24*s,24*s-13*Math.max(0,c)-6],far:[-24*s,-24*s-13*Math.max(0,-c)-6],
    armN:name==="carry"?[24,158]:[-18*s,-18*s+12],armF:[18*s,18*s+12]};
  if(name==="haul")return{lean:-17,hip:44,near:[34,20],far:[-6,-34],armN:[58,84],armF:[50,80]};
  if(name==="sit")return woman?{lean:5,hip:8,seat:true,near:null,far:null,armN:[30,84],armF:[24,80]}:{lean:8,hip:5,near:[112,50],far:[104,44],armN:[36,88],armF:[28,84]};
  if(name==="astride")return{lean:14,hip:1,near:[12,-4],far:null,armN:[44,74],armF:[36,70]};
  if(name==="bend")return{lean:52,hip:40,near:[30,-22],far:[14,-34],armN:[20,26],armF:[8,18]};
  return{lean:0,hip:49.5,near:[3,2],far:[-4,-2],armN:[3,8],armF:[-3,5]};}
function pb_fig(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;
  const F=typeof o.who==="object"&&o.who?o.who:PB_FOLK[((((o.who||0)%PB_FOLK.length)+PB_FOLK.length)%PB_FOLK.length)],woman=F.k==="woman",u=h/100,fl=o.flip?-1:1,
    P=pb_pose(o.pose||"stand",o.t||0,woman),rad=d=>d*Math.PI/180,dir=d=>[Math.sin(rad(d)),Math.cos(rad(d))],up=[Math.sin(rad(P.lean)),-Math.cos(rad(P.lean))],
    hip=[0,-P.hip],sh=[hip[0]+up[0]*29,hip[1]+up[1]*29],hd=[sh[0]+up[0]*9.6+1.2,sh[1]+up[1]*9.6],sun=fl,
    leg=A=>{if(!A)return null;const k=[hip[0]+dir(A[0])[0]*24,hip[1]+dir(A[0])[1]*24];return[k,[k[0]+dir(A[1])[0]*24,k[1]+dir(A[1])[1]*24]];},
    arm=A=>{const e=[sh[0]+dir(A[0])[0]*15,sh[1]+2+dir(A[0])[1]*15];return[e,[e[0]+dir(A[1])[0]*14,e[1]+dir(A[1])[1]*14]];},
    LN=leg(P.near),LF=leg(P.far),AN=arm(P.armN),AF=arm(P.armF),topC=F.top,topD=ag_dk(topC,0.22),lg=F.legs,lgD=ag_dk(lg,0.25),skin=F.skin;
  ctx.save();ctx.globalAlpha*=a;
  if(o.shadow!==0)ag_floorShadow(ctx,x-h*0.16,y+(P.seat||o.pose==="sit"?0:1),h*(o.pose==="sit"?0.34:0.26),h*0.05,o.shadow==null?0.3:o.shadow);
  ctx.translate(x,y);ctx.scale(fl*u,u);
  const shoe=q=>{ctx.fillStyle=rgba([52,44,40],1);ctx.beginPath();ctx.ellipse(q[0]+2,q[1]+1.2,4.4,2.1,0,0,TAU);ctx.fill();};
  // the far arm and the far leg
  pb_limb(ctx,[sh[0],sh[1]+2],AF[0],5.4,4.6,rgba(topD,1));pb_limb(ctx,AF[0],AF[1],4.6,3.8,rgba(topD,1));ctx.fillStyle=rgba(ag_dk(skin,0.12),1);ctx.beginPath();ctx.arc(AF[1][0]+dir(P.armF[1])[0]*1.6,AF[1][1]+dir(P.armF[1])[1]*1.6,2.3,0,TAU);ctx.fill();
  if(LF){pb_limb(ctx,hip,LF[0],7.6,6,rgba(lgD,1));pb_limb(ctx,LF[0],LF[1],6,4.4,rgba(lgD,1));shoe(LF[1]);}
  if(LN){pb_limb(ctx,hip,LN[0],8,6.2,rgba(lg,1));pb_limb(ctx,LN[0],LN[1],6.2,4.6,rgba(lg,1));shoe(LN[1]);}
  // a woman's full skirt, to below the knee; sitting, it spreads on the ground round her
  if(woman){const sk=F.skirt,skL=ag_lt(sk,0.16);
    if(P.seat){ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.moveTo(-17,0);ctx.bezierCurveTo(-17,-15,-6,-19,4,-18);ctx.bezierCurveTo(16,-17,29,-10,31,0);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(skL,0.6);ctx.beginPath();ctx.moveTo(6,-17);ctx.bezierCurveTo(16,-16,27,-9,29,0);ctx.lineTo(14,0);ctx.bezierCurveTo(13,-7,10,-13,6,-17);ctx.fill();}
    else if(LN){const sw=o.pose==="walk"||o.pose==="carry"?3*Math.sin((o.t||0)*5.4):0,hy=-19,wx=[hip[0]-7,hip[0]+7],lean=up[0]*-8;
      ctx.fillStyle=rgba(sk,1);ctx.beginPath();ctx.moveTo(wx[0],hip[1]-4);ctx.bezierCurveTo(wx[0]-5,hip[1]+10,-15+lean+sw,hy-10,-16+lean+sw,hy);ctx.quadraticCurveTo(lean+sw,hy+3.4,16+lean+sw,hy);
      ctx.bezierCurveTo(15+lean+sw,hy-10,wx[1]+5,hip[1]+10,wx[1],hip[1]-4);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(skL,0.55);ctx.beginPath();ctx.moveTo(wx[1]-2,hip[1]-3);ctx.bezierCurveTo(wx[1]+4,hip[1]+10,14+lean+sw,hy-10,15+lean+sw,hy);ctx.lineTo(6+lean+sw,hy+1.6);ctx.bezierCurveTo(6+lean,hy-12,wx[1]-1,hip[1]+8,wx[1]-2,hip[1]-3);ctx.fill();}}
  // the body, lighter on the side towards the sun
  pb_limb(ctx,[hip[0],hip[1]+1],sh,13,15,rgba(topC,1));pb_limb(ctx,[hip[0]+2.4*sun*fl,hip[1]],[sh[0]+2.6*sun*fl,sh[1]+1],6,7,rgba(ag_lt(topC,0.22),0.7));
  // the neck and the head
  pb_limb(ctx,sh,[hd[0]-0.6,hd[1]+2],4.6,4.2,rgba(ag_dk(skin,0.1),1));
  ctx.fillStyle=rgba([34,26,24],1);ctx.beginPath();ctx.ellipse(hd[0]-1.3,hd[1]-0.4,5.9,6.7,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(hd[0]+1.5,hd[1]+0.7,4.7,5.9,0,0,TAU);ctx.fill();
  // a woman's braids, down her back
  if(woman){const b0=[hd[0]-5.4,hd[1]+3],b1=[sh[0]-8.4-up[0]*9,sh[1]+17];for(const dx of [0,1.9]){ctx.strokeStyle=rgba([30,24,22],1);ctx.lineWidth=1.7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(b0[0]+dx,b0[1]);ctx.quadraticCurveTo(sh[0]-9.4+dx,sh[1]+3,b1[0]+dx,b1[1]+dx*0.6);ctx.stroke();}}
  // the hat: felt with a brim and a plain band, or a knitted cap with ear flaps and a point
  if(F.hat==="cap"){const hc=F.hatC;ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.moveTo(hd[0]-6.6,hd[1]-0.6);ctx.bezierCurveTo(hd[0]-7,hd[1]-8.6,hd[0]-2,hd[1]-10.4,hd[0]+0.4,hd[1]-13);ctx.bezierCurveTo(hd[0]+3,hd[1]-10,hd[0]+6.8,hd[1]-8,hd[0]+6.6,hd[1]-2.2);
    ctx.quadraticCurveTo(hd[0]+1,hd[1]-3.4,hd[0]-2.2,hd[1]-1.4);ctx.lineTo(hd[0]-3,hd[1]+6.4);ctx.quadraticCurveTo(hd[0]-6.4,hd[1]+4.4,hd[0]-6.6,hd[1]-0.6);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(ag_lt(hc,0.22),0.6);ctx.beginPath();ctx.ellipse(hd[0]+2.4*sun*fl,hd[1]-6.4,2.6,3.4,0,0,TAU);ctx.fill();}
  else{const hc=F.hatC,by=hd[1]-4.6;ctx.fillStyle=rgba(ag_dk(hc,0.16),1);ctx.beginPath();ctx.ellipse(hd[0]+0.5,by,10.2,2.4,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.moveTo(hd[0]-5.6,by-0.4);ctx.bezierCurveTo(hd[0]-5.8,by-7.6,hd[0]-3,by-8.6,hd[0]+0.4,by-8.6);ctx.bezierCurveTo(hd[0]+4,by-8.6,hd[0]+6.6,by-7.4,hd[0]+6.4,by-0.4);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(ag_lt(hc,0.25),0.7);ctx.beginPath();ctx.ellipse(hd[0]+0.5+2.6*sun*fl,by-0.5,5,1.2,0,0,TAU);ctx.fill();
    if(F.band){ctx.strokeStyle=rgba(F.band,1);ctx.lineWidth=1.5;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(hd[0]-5.6,by-1.5);ctx.lineTo(hd[0]+6.4,by-1.5);ctx.stroke();}}
  // the near arm, over the body
  pb_limb(ctx,[sh[0],sh[1]+2],AN[0],5.8,4.8,rgba(ag_dk(topC,0.08),1));pb_limb(ctx,AN[0],AN[1],4.8,4,rgba(ag_dk(topC,0.08),1));
  const hN=[AN[1][0]+dir(P.armN[1])[0]*1.8,AN[1][1]+dir(P.armN[1])[1]*1.8],hF=[AF[1][0]+dir(P.armF[1])[0]*1.6,AF[1][1]+dir(P.armF[1])[1]*1.6];
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.arc(hN[0],hN[1],2.4,0,TAU);ctx.fill();
  ctx.restore();
  const out=q=>[x+fl*u*q[0],y+u*q[1]];return{hand:out(hN),hand2:out(hF),head:out(hd),sh:out(sh),top:y+u*(hd[1]-14)};}

/* ---------------------------------------------------------------- half-figures, for lp_person
   Hats inside the head's picture (figure x 160 to 440, y 250 to 560). */
// a felt hat: a low rounded crown, a brim all round, a plain band
function pb_hat(col,band){return(c,P)=>{const crown=cc=>{cc.moveTo(208,352);cc.bezierCurveTo(200,296,238,262,300,262);cc.bezierCurveTo(360,262,396,296,390,350);cc.bezierCurveTo(350,366,250,368,208,352);cc.closePath();};
  // the brim's shade on the brow
  const g=c.createLinearGradient(0,356,0,392);g.addColorStop(0,"rgba(40,26,20,0.28)");g.addColorStop(1,"rgba(40,26,20,0)");c.fillStyle=g;c.beginPath();c.ellipse(318,372,82,22,0,0,TAU);c.fill();
  ag_soft(c,cc=>cc.ellipse(299,356,137,21,-0.035,0,TAU),ag_dk(col,0.12),ag_lt(col,0.3),372,348,120,rgba(ag_dk(col,0.7),0.4),10);
  ag_soft(c,crown,col,ag_lt(col,0.34),352,292,130,rgba(ag_dk(col,0.7),0.45),16);
  if(band){c.save();ag_shape(c,crown);c.clip();c.strokeStyle=rgba(band,1);c.lineWidth=15;c.beginPath();c.moveTo(200,346);c.bezierCurveTo(250,362,350,360,396,343);c.stroke();
    c.strokeStyle=rgba(ag_lt(band,0.3),0.5);c.lineWidth=2;c.beginPath();c.moveTo(300,345);c.quadraticCurveTo(350,343,392,335);c.stroke();c.restore();}
  // the brim's near edge, over the crown's foot
  c.strokeStyle=rgba(ag_lt(col,0.3),0.6);c.lineWidth=3;c.beginPath();c.ellipse(299,356,135,19,-0.035,0.25,Math.PI-0.25);c.stroke();};}
// a knitted cap with ear flaps, a point at its crown and a tie hanging from the flap: plain wool
function pb_cap(col){return(c,P)=>{const cap=cc=>{cc.moveTo(394,360);cc.bezierCurveTo(398,308,360,280,304,274);cc.bezierCurveTo(300,264,294,258,290,256);cc.bezierCurveTo(288,264,286,270,282,274);
      cc.bezierCurveTo(226,282,190,318,194,372);cc.bezierCurveTo(196,420,208,470,236,512);cc.bezierCurveTo(244,520,254,514,256,502);cc.bezierCurveTo(262,470,272,420,292,392);cc.bezierCurveTo(320,376,360,366,394,360);cc.closePath();};
  ag_soft(c,cap,col,ag_lt(col,0.3),346,300,130,rgba(ag_dk(col,0.7),0.5),14);
  // the knit's ribs, from the point down; the hem along the brow
  c.save();ag_shape(c,cap);c.clip();c.strokeStyle=rgba(ag_dk(col,0.5),0.26);c.lineWidth=2.4;c.lineCap="round";
  for(const [x1,y1] of [[214,400],[240,470],[250,350],[300,372],[340,360],[376,352],[392,340]]){c.beginPath();c.moveTo(290,262);c.quadraticCurveTo((290+x1)/2+(x1<290?-14:14),(262+y1)/2-20,x1,y1);c.stroke();}c.restore();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.6);c.lineWidth=3;c.beginPath();c.moveTo(394,361);c.bezierCurveTo(360,367,320,377,292,393);c.stroke();
  // the tie
  ag_taper(c,[244,512],[242,526],[246,538],[242,552],4,2.4,rgba(ag_dk(col,0.2),1));};}
// the cap under the hat, as many of the men wear them
function pb_capHat(cap,hat,band){const a=pb_cap(cap),b=pb_hat(hat,band);return(c,P)=>{a(c,P);b(c,P);};}
// a woman's braid over her near shoulder: painted with her body, from behind her ear down her front (the head is drawn over its top)
function pb_braid(col){return(c,P)=>{const pts=[];for(let i=0;i<=22;i++){const u=i/22;pts.push([236-10*Math.sin(u*2.2)+4*u,470+u*330]);}
  c.save();c.lineCap="round";
  for(let i=0;i<pts.length-1;i++){const p=pts[i],q=pts[i+1],w=17-7*(i/pts.length);ag_soft(c,cc=>cc.ellipse((p[0]+q[0])/2+(i%2?3:-3),(p[1]+q[1])/2,w*0.56,10.5,i%2?0.5:-0.5,0,TAU),col,ag_lt(col,0.4),(p[0]+q[0])/2+5,(p[1]+q[1])/2-4,12,null);}
  const e=pts[pts.length-1];c.strokeStyle=rgba([150,62,54],1);c.lineWidth=5;c.beginPath();c.moveTo(e[0]-6,e[1]-2);c.lineTo(e[0]+6,e[1]-1);c.stroke();ag_taper(c,[e[0],e[1]],[e[0]-1,e[1]+10],[e[0]+2,e[1]+18],[e[0],e[1]+28],7,2,rgba(col,1));c.restore();};}
const PB_PEOPLE={
  builder:{name:"A bridge builder",key:"pb-builder1",skin:[160,108,78],hair:{style:"cropped",c:[30,24,22]},top:{kind:"overshirt",c:[226,216,194],inner:[148,118,92]},hat:{paint:pb_capHat([146,64,56],[222,208,180],[104,80,64])},breath:0.26},
  builder2:{name:"A bridge builder",key:"pb-builder2",skin:[172,120,88],hair:{style:"cropped",c:[60,54,52]},top:{kind:"sweater",c:[122,98,78]},hat:{paint:pb_cap([116,72,62])},breath:0.29},
  man:{name:"A man of Quehue",key:"pb-man1",skin:[166,114,84],hair:{style:"cropped",c:[28,22,20]},top:{kind:"overshirt",c:[196,184,164],inner:[92,84,80]},hat:{paint:pb_hat([150,120,92],[72,58,52])},breath:0.31},
  man2:{name:"A man of Quehue",key:"pb-man2",skin:[178,126,92],hair:{style:"cropped",c:[34,26,24]},top:{kind:"sweater",c:[86,80,84]},hat:{paint:pb_capHat([122,76,66],[226,214,190],[96,74,62])},breath:0.27},
  woman:{name:"A woman of Quehue",key:"pb-woman1",skin:[174,122,90],hair:{style:"cropped",c:[30,24,22]},earrings:[214,196,160],top:{kind:"cardigan",c:[154,64,56],inner:[232,224,208],paint:pb_braid([30,24,22])},hat:{paint:pb_hat([214,198,168],[98,64,56])},breath:0.3},
  woman2:{name:"A woman of Quehue",key:"pb-woman2",skin:[164,112,82],hair:{style:"cropped",c:[58,52,50]},top:{kind:"cardigan",c:[76,70,76],inner:[214,204,188],paint:pb_braid([58,52,50])},hat:{paint:pb_hat([140,108,84],[226,214,190])},breath:0.25},
  woman3:{name:"A woman of Quehue",key:"pb-woman3",skin:[184,132,98],hair:{style:"cropped",c:[26,22,20]},earrings:[214,196,160],top:{kind:"cardigan",c:[226,214,190],inner:[150,70,62],paint:pb_braid([26,22,20])},hat:{paint:pb_hat([230,218,192],[148,64,58])},breath:0.33}};

/* ---------------------------------------------------------------- a coil of cord, for a hand to hold */
// at (x, y), r across: turns of thin grass cord, one end hanging; o.age, o.n (turns), o.a
function pb_coil(ctx,x,y,r,o){o=o||{};const n=o.n||5,w=o.w||r*0.17;for(let i=0;i<n;i++){const rx=r*(1-i*0.05),ry=r*0.62*(1-i*0.04),P=[],ph=i*0.7;
    for(let k=0;k<=30;k++){const an=k/30*TAU+ph;P.push([x+Math.cos(an)*rx+i*r*0.03,y+Math.sin(an)*ry-i*r*0.07]);}pb_rope(ctx,P,w,{age:o.age,a:o.a});}
  pb_rope(ctx,pb_hang([x+r*0.7,y+r*0.3],[x+r*0.5,y+r*1.5],-r*0.1,8),w,{age:o.age,a:o.a});}
