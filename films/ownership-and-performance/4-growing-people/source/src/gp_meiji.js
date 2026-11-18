/* ===== Growing people: Japan's schools, from the 1870s =====
   The opening's places and people, drawn with the people kit (films/people-first/shared/): a village school's one classroom in the
   1870s, with its blackboard, and that blackboard seen close, where a head teacher of the 1880s explains lesson study to his group.
   The children wear plain kimono in muted colours; teachers wear kimono and hakama, or the Western suits many teachers took up in
   those years. A kimono is drawn over the kit's person (gp_robe, gp_sleeve), as the kit draws a jacket's lapels: its collar crosses
   left over right whichever way the person faces, an obi or a hakama at the waist, a hanging sleeve under each arm. Nothing is taken
   from a culture's own patterns or crafts, nothing is written in Japanese on the walls, and nobody is a likeness. Everyone in the
   room is sized by one eye line (GP_M.eye), so near and far people belong to one picture. */
const GP_M={eye:420,board:{x:1330,y:214,w:500,h:330},door:{x:96,w:236,h:548},clock:[1580,132,40],win:[[438,214,290,316],[858,214,290,316]],dado:732};
const gp_hM=fl=>PK.hAt(fl,GP_M.eye);
const GP_PAL={plaster:[238,228,206],beam:[118,88,66],wood:[168,130,96],woodLt:[194,156,116],slate:[52,68,62],slateLt:[70,88,80],floor:[194,154,112],field:[150,180,108],
  hill:[136,166,156],hill2:[116,150,128],sky:[200,222,232],corridor:[132,108,90],paper:[246,240,222],ink:[58,46,50]};
const gp_c=n=>PK.S.tone(GP_PAL[n]);
// chalk on the slate: the kit's colours, light enough to read on a dark board, with their meaning kept (blue the idea's name, green
// what matters, white the words, grey a gloss)
const GP_CHALK={ink:[242,240,230],blue:[150,200,238],green:[170,222,174],mut:[176,186,180]};

/* ---------------------------------------------------------------- the people of the opening
   ki: the kimono drawn over the person: eri (its collar band), ju (the under-kimono's collar at the neck), obi (a sash; obiW "wide"
   for women and girls, a narrow one low on the hips for men and boys) or hakama (the pleated trousers over it, the bottom's colour),
   sl (how far the sleeve hangs, as a share of the height) */
const GP_CAST={
  // the village teacher of the 1870s, in kimono and hakama
  sensei:{key:"sensei",name:"",skin:[234,196,162],hair:{style:"short",c:[36,30,34]},top:{kind:"sweater",c:[92,100,122]},bottom:{kind:"long",c:[90,78,84]},shoe:[236,232,222],
    ki:{eri:[46,44,52],ju:[244,240,230],hakama:true,sl:0.1}},
  // the head teacher of the 1880s who explains lesson study to his group: a Western suit, as many teachers wore by then
  okada:{key:"okada",name:"Mr Okada",role:"Head teacher",skin:[226,186,150],hair:{style:"short",c:[78,72,72]},glasses:[60,50,50],top:{kind:"jacket",c:[98,90,86],inner:[244,240,232]},bottom:{kind:"trousers",c:[90,84,82]},shoe:[58,46,44]},
  // the teachers who visit: one in kimono and hakama, a woman teacher in kimono, one in a suit, one older in kimono
  kato:{key:"kato",name:"",skin:[230,190,154],hair:{style:"short",c:[30,26,28]},top:{kind:"sweater",c:[112,116,96]},bottom:{kind:"long",c:[72,74,92]},shoe:[236,232,222],ki:{eri:[50,48,46],ju:[242,238,226],hakama:true,sl:0.1}},
  aoki:{key:"aoki",name:"",skin:[240,206,176],hair:{style:"bun",c:[32,26,30]},top:{kind:"sweater",c:[126,104,114]},bottom:{kind:"long",c:[126,104,114]},shoe:[236,232,222],ki:{eri:[52,46,52],ju:[246,242,232],obi:[204,186,152],obiW:"wide",sl:0.13}},
  mori:{key:"mori",name:"",skin:[222,182,146],hair:{style:"short",c:[40,34,34]},top:{kind:"jacket",c:[70,70,80],inner:[242,240,234]},bottom:{kind:"trousers",c:[66,66,76]},shoe:[54,44,44]},
  ueda:{key:"ueda",name:"",skin:[230,192,160],hair:{style:"crop",c:[150,146,146]},top:{kind:"sweater",c:[120,104,90]},bottom:{kind:"long",c:[84,82,92]},shoe:[236,232,222],ki:{eri:[44,42,46],ju:[240,236,226],hakama:true,sl:0.1}}
};
// the children: plain kimono, a narrow obi for the boys and a wider one for the girls; girls with their hair cut level or tied up
const GP_KSKIN=[[240,206,174],[232,194,158],[226,186,150],[238,200,166],[244,212,182]],GP_KCOL=[[84,96,122],[134,110,92],[116,128,112],[188,170,140],[120,138,160],[146,118,126],[102,106,84],[160,132,104],[96,112,110]],
  GP_KOBI=[[214,196,150],[150,120,96],[196,170,150],[128,132,140]];
const gp_kid=(i,girl,o)=>Object.assign({key:"kid"+i,name:"",kid:true,skin:GP_KSKIN[(i*3+1)%5],hair:{style:girl?(i%3?"bob":"bun"):(i%2?"crop":"short"),c:[34+(i%3)*6,28,30]},
  top:{kind:"sweater",c:GP_KCOL[(i*4+2)%9]},bottom:{kind:"long",c:GP_KCOL[(i*4+2)%9]},shoe:[236,230,218],ki:{eri:i%3?[56,50,54]:[96,84,80],ju:[244,240,230],obi:GP_KOBI[i%4],obiW:girl?"wide":"narrow",sl:0.12}},o||{});
const GP_KIDS=[gp_kid(0,false),gp_kid(1,true),gp_kid(2,false),gp_kid(3,true),gp_kid(4,false),gp_kid(5,true,{key:"girl",top:{kind:"sweater",c:[160,116,110]},bottom:{kind:"long",c:[160,116,110]},hair:{style:"bob",c:[30,24,28]},skin:[238,202,170]}),
  gp_kid(6,false),gp_kid(7,true),gp_kid(8,false)];

/* ---------------------------------------------------------------- a kimono over the kit's person
   Drawn in the person's own picture, with their joints as the kit gives them there (they always face right in it; a person facing
   left is that picture mirrored, sg -1). The front is clipped to the torso's outline, as the kit clips a jacket's lapels, so it moves
   to the front edge as the body turns and stays inside it. */
function gp_torso(J){const U=PK.u,p=J.p,u=J.u,T=p.torso*u,pr=J.side||0,sw=p.tor[0]*u/2*U.lerp(1,0.6,pr),ww=p.tor[1]*u/2*U.lerp(1,0.72,pr),hw=p.tor[2]*u/2*U.lerp(1,0.7,pr),nw=p.head*u*0.16,
    ch=pr*0.12*sw,d=pr*0.14*T,hem=U.lerp(0.08,0.05,pr)*T,k=1-pr;
  return{T,sw,ww,hw,nw,hem,cx:U.lerp(sw*0.2,sw*0.8,pr)*(J.k==null?1:J.k),pts:[[-hw+d*0.9,hem,k],[-hw,hem-d,k],[-ww,-0.42*T],[-sw+ch*0.5,-0.8*T],[-sw*0.88+ch*0.5,-0.95*T],[-sw*0.5,-1.02*T],
    [-nw,-1.045*T],[nw*1.3,-1.04*T],[sw*0.5+ch,-1.0*T],[sw*0.84+ch,-0.9*T],[sw*0.96+ch*1.5,-0.7*T],[ww*1.06+ch,-0.4*T],[hw*1.02,hem-d*0.6,k],[hw*1.02-d*0.6,hem,k]]};}
// a band of cloth w wide along a line of points: its outline, for S.poly
function gp_band(Q,w){const L=[],R=[];Q.forEach((q,i)=>{const a=Q[Math.max(0,i-1)],b=Q[Math.min(Q.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy)||1,nx=-dy/n*w/2,ny=dx/n*w/2;
  L.push([q[0]+nx,q[1]+ny,1]);R.push([q[0]-nx,q[1]-ny,1]);});return L.concat(R.reverse());}
const gp_shift=(Q,v)=>Q.map(q=>[q[0]+v[0],q[1]+v[1]]);
function gp_robe(ctx,P,J,sg){const S=PK.S,U=PK.u,G=P.ki,B=gp_torso(J),{T,ww,nw,cx}=B,kc=S.tone(P.top.c),eri=S.tone(G.eri||U.dk(P.top.c,0.4)),ju=S.tone(G.ju||[244,240,230]);
  ctx.save();ctx.translate(J.hip[0],J.hip[1]);ctx.rotate(J.le);ctx.beginPath();U.spline(ctx,B.pts);ctx.clip();
  const bw=0.08*T,yX=-0.7*T,yW=-0.3*T,N=[cx-nw*1.3,-1.04*T],F=[cx+nw*1.25,-1.04*T],X=[cx,yX];
  // the panel on top runs from the wearer's left side of the neck to their right hip: from the far side when they face right
  const top=sg>0?[F,X,[cx-0.82*ww,yW]]:[N,X,[cx+0.82*ww,yW]],und=sg>0?[N,X]:[F,X],vc=[(N[0]+F[0]+X[0])/3,(N[1]+F[1]+X[1])/3],tw=v=>{const q=v[0],d=[vc[0]-q[0][0],vc[1]-q[0][1]],n=Math.hypot(d[0],d[1])||1;return[d[0]/n*bw*0.55,d[1]/n*bw*0.2];};
  S.poly(ctx,[N,F,X],S.tone(P.skin),{exact:true,line:false,flat:true});
  // the under-kimono's white collar, just inside each band, then the two bands: the one beneath first
  for(const Q of [und,top.slice(0,2)])S.poly(ctx,gp_band(gp_shift(Q,tw([Q])),bw*0.42),ju,{exact:true,w:0.6,flat:true});
  S.poly(ctx,gp_band(und,bw),eri,{exact:true,w:0.8,flat:true});S.poly(ctx,gp_band(top,bw),eri,{exact:true,w:0.8,flat:true});
  // the front edge of the panel on top, on down to the hem
  S.line(ctx,c=>{c.moveTo(top[2][0],top[2][1]);c.lineTo(top[2][0],B.hem+0.1*T);},null,0.6);
  if(G.hakama){const hk=S.tone(P.bottom.c);S.fill(ctx,c=>U.rrect(c,-B.hw*1.8,-0.26*T,B.hw*3.6,0.6*T,0),hk,{flat:true});
    S.fill(ctx,c=>U.rrect(c,-B.hw*1.8,-0.26*T,B.hw*3.6,0.045*T,0),U.dk(hk,0.18),{w:0.6,flat:true});
    S.line(ctx,c=>{for(const f of [-0.3,0.15,0.55]){c.moveTo(cx+f*ww,-0.2*T);c.lineTo(cx+f*ww*1.1,B.hem+0.1*T);}},null,0.5);}
  else if(G.obi){const wide=G.obiW==="wide",y0=wide?-0.54*T:-0.22*T,y1=wide?-0.26*T:-0.08*T,ob=S.tone(G.obi);
    S.fill(ctx,c=>U.rrect(c,-B.hw*1.8,y0,B.hw*3.6,y1-y0,0),ob,{w:0.8,flat:true});
    if(wide)S.line(ctx,c=>{c.moveTo(-B.hw*1.8,(y0+y1)/2);c.lineTo(B.hw*1.8,(y0+y1)/2);},U.dk(ob,0.3),0.7);}
  ctx.restore();}
// the hanging sleeve: a wide bag along the arm, falling below it and a little behind, from the upper arm to below the wrist;
// it hangs by its weight, the same way whatever the arm does
function gp_sleeve(ctx,P,J,far){const S=PK.S,U=PK.u,sh=far?J.shF:J.shN,e=far?J.eF:J.eN,w=far?J.wF:J.wN,L=(P.ki.sl||0.11)*1000*J.u*(far?0.8:1),D=[-0.5*L,0.87*L],
    A=[U.lerp(sh[0],e[0],0.3),U.lerp(sh[1],e[1],0.3)],B=[U.lerp(e[0],w[0],0.84),U.lerp(e[1],w[1],0.84)],col=far?U.dk(S.tone(P.top.c),0.05):S.tone(P.top.c),
    at=(q,f)=>[q[0]+D[0]*f,q[1]+D[1]*f];
  S.poly(ctx,[[A[0],A[1],1],[e[0],e[1]],[B[0],B[1],1],at(B,0.86),at([U.lerp(e[0],B[0],0.5),U.lerp(e[1],B[1],0.5)],1.02),at(e,0.92),at(A,0.55)],col,{exact:true});}
const gp_flipOf=f=>f===true?1:(f||0),gp_sgOf=f=>Math.cos(Math.PI*gp_flipOf(f))<0?-1:1;
const gp_row=who=>typeof who==="string"?(GP_CAST[who]||PK.CAST[who]):who;
// what PK.person needs to draw someone's kimono over them: their own o.under and o.underF still run, after it
function gp_dress(P,o){o=o||{};if(!P||!P.ki)return o;const sg=gp_sgOf(o.flip),u0=o.under,uF=o.underF;
  return Object.assign({},o,{under:(c,h,d,J)=>{gp_robe(c,P,J,sg);gp_sleeve(c,P,J,false);if(u0)u0(c,h,d,J);},underF:(c,h,d,J)=>{gp_sleeve(c,P,J,true);if(uF)uF(c,h,d,J);}});}
const gp_person=(ctx,who,x,fl,h,pose,o)=>{const P=gp_row(who);return PK.person(ctx,P,x,fl,h,pose,gp_dress(P,o));};
const gp_walk=(ctx,who,t,w,o)=>{const P=gp_row(who);o=Object.assign({},o||{});if(o.flip==null)o.flip=PK.walkAt(t,w).left;return PK.walk(ctx,P,t,w,gp_dress(P,o));};
// a pupil at a desk with a slate, seen from the side, facing the board on the right, their feet hanging from the chair; the desk at a
// child's height. o.hand: where the near hand rests or writes (handK how far); o.reachF the far hand; o.pose ("sit")
const gp_pupil=(ctx,who,x,fl,h,o)=>{const P=gp_row(who),S=PK.S,U=PK.u;o=Object.assign({t:0},o||{});const top=fl-0.37*h,x0=x+0.11*h,w=0.52*h,
    lw={lw:U.clamp(h*0.0056,1.4,6.5),sh:U.clamp(h*0.0078,1.5,8.5)},po=gp_dress(P,Object.assign({},o,{flip:false,seat:PK.seatOf(h)*1.04})),pose=o.pose||"sit";
  S.begin(ctx,lw);PK.chair(ctx,x-0.012*h,fl,h,false,{col:GP_PAL.wood});PK.person(ctx,P,x,fl,h,pose,Object.assign({},po,{part:"lower"}));
  S.begin(ctx,lw);PK.desk(ctx,x0+w/2,top,w,fl,{col:GP_PAL.woodLt,k:h/600,panel:true});if(o.slate!==false)gp_slate(ctx,x0+w*0.42,top,h/640);
  const J=PK.person(ctx,P,x,fl,h,pose,Object.assign({},po,{part:"upper"},o.hand?{reachN:o.hand,reachNk:o.handK==null?1:o.handK}:{},{reachF:o.reachF||[x0+w*0.2,top-0.012*h]}));
  J.desk={x0,x1:x0+w,top,w};return J;};
/* ---------------------------------------------------------------- things
   a slate on a desk: a dark board in a wooden frame, a few marks of chalk on it (marks 0 to 1: how far written) */
function gp_slate(ctx,x,y,k,marks){const S=PK.S,U=PK.u;S.fill(ctx,c=>U.pg(c,[[x-62*k,y],[x+62*k,y],[x+50*k,y-12*k],[x-50*k,y-12*k]]),gp_c("wood"),{w:0.6});
  S.fill(ctx,c=>U.pg(c,[[x-52*k,y-2*k],[x+52*k,y-2*k],[x+43*k,y-10*k],[x-43*k,y-10*k]]),gp_c("slate"),{line:false,flat:true});}
// a slate held up in a hand, its face to us: marks, the chalk on it (strokes, each a row of [x, y] in its own px, 0 to 1); they read the
// right way round whichever way the child faces
const gp_slateUp=(marks,o)=>(ctx,hd,deg,J)=>{o=o||{};const S=PK.S,U=PK.u,k=J.u*(o.k||1.5),x=hd[0]+(o.dx||0)*J.u,y=hd[1]-(o.dy==null?60:o.dy)*J.u,w=120*k,h=88*k;
  ctx.save();if(ctx.getTransform().a<0){ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);}
  S.fill(ctx,c=>U.rrect(c,x-w/2-8*k,y-h/2-8*k,w+16*k,h+16*k,5*k),gp_c("wood"),{w:0.7});S.fill(ctx,c=>U.rrect(c,x-w/2,y-h/2,w,h,3*k),gp_c("slate"),{line:false,flat:true});
  if(marks){ctx.strokeStyle=U.css(GP_CHALK.ink,0.92);ctx.lineWidth=Math.max(1.5,3.4*k);ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    for(const m of marks)m.forEach((q,i)=>i?ctx.lineTo(x-w/2+q[0]*w,y-h/2+q[1]*h):ctx.moveTo(x-w/2+q[0]*w,y-h/2+q[1]*h));ctx.stroke();}
  ctx.restore();};
// a sum on a slate, 2 + 3 = 5, written stroke by stroke (GP_SUM.slice(0, n) is the sum as far as it is written: 6 strokes ask it, the 7th answers it)
const GP_SUM=[[[0.07,0.36],[0.15,0.3],[0.2,0.37],[0.08,0.62],[0.21,0.62]],[[0.27,0.47],[0.39,0.47]],[[0.33,0.39],[0.33,0.55]],[[0.45,0.32],[0.56,0.31],[0.5,0.45],[0.57,0.55],[0.45,0.62]],
  [[0.63,0.43],[0.74,0.43]],[[0.63,0.53],[0.74,0.53]],[[0.93,0.3],[0.82,0.3],[0.81,0.44],[0.9,0.45],[0.92,0.56],[0.81,0.62]]];
// a book held open in both hands: the teacher's manual
const gp_book=o=>(ctx,hd,deg,J)=>{o=o||{};const S=PK.S,U=PK.u,k=J.u*(o.k||1.6),x=hd[0]+(o.dx==null?18:o.dx)*J.u,y=hd[1]-(o.dy==null?14:o.dy)*J.u,col=S.tone(o.cover||[120,84,70]);
  S.fill(ctx,c=>U.pg(c,[[x-64*k,y-6*k],[x,y+4*k],[x+64*k,y-6*k],[x+60*k,y-50*k],[x,y-42*k],[x-60*k,y-50*k]]),col,{w:0.7});
  S.fill(ctx,c=>{U.pg(c,[[x-58*k,y-10*k],[x-2*k,y-2*k],[x-2*k,y-42*k],[x-56*k,y-50*k]]);U.pg(c,[[x+58*k,y-10*k],[x+2*k,y-2*k],[x+2*k,y-42*k],[x+56*k,y-50*k]]);},gp_c("paper"),{w:0.6,flat:true});
  S.line(ctx,c=>{for(let i=0;i<4;i++){const yy=y-38*k+i*8*k;c.moveTo(x-48*k,yy-1*k);c.lineTo(x-10*k,yy+3*k);c.moveTo(x+10*k,yy+3*k);c.lineTo(x+48*k,yy-1*k);}},U.dk(gp_c("paper"),0.35),0.4);};
// a small sewn notebook held in one hand, where a visitor writes what the children do
const gp_booklet=o=>(ctx,hd,deg,J)=>{o=o||{};const S=PK.S,U=PK.u,k=J.u*(o.k||1.4),x=hd[0]+8*J.u,y=hd[1]-20*J.u;
  S.fill(ctx,c=>U.rrect(c,x-30*k,y-40*k,60*k,46*k,3*k),gp_c("paper"),{w:0.7});S.line(ctx,c=>{c.moveTo(x-24*k,y-38*k);c.lineTo(x-24*k,y+4*k);for(let i=0;i<3;i++){c.moveTo(x-16*k,y-30*k+i*10*k);c.lineTo(x+22*k,y-30*k+i*10*k);}},U.dk(gp_c("paper"),0.4),0.45);};
// a piece of chalk, held to the board
const gp_chalk=(ctx,hd,deg,J)=>{const S=PK.S,U=PK.u,a=U.polar(hd,deg,-4*J.u),b=U.polar(hd,deg,26*J.u);S.fill(ctx,c=>U.capsule(c,a,b,5*J.u,5*J.u),[244,242,234],{w:0.6});};

/* ---------------------------------------------------------------- the classroom */
function gp_view(ctx,x,y,w,h,i){const S=PK.S,U=PK.u;ctx.fillStyle=U.css(gp_c("sky"));ctx.fillRect(x,y,w,h);
  S.begin(ctx,{lw:1.5,far:0.6,sh:3});PK.cloud(ctx,x+w*(i?0.68:0.3),y+h*0.18,0.55);
  S.poly(ctx,[[x-10,y+h*0.6],[x+w*0.28,y+h*0.47],[x+w*0.6,y+h*0.56],[x+w+10,y+h*0.44],[x+w+10,y+h+10,1],[x-10,y+h+10,1]],gp_c("hill"),{exact:true,flat:true});
  S.poly(ctx,[[x-10,y+h*0.72],[x+w*0.5,y+h*0.68],[x+w+10,y+h*0.71],[x+w+10,y+h+10,1],[x-10,y+h+10,1]],gp_c("hill2"),{exact:true,flat:true});
  S.poly(ctx,[[x-10,y+h*0.83],[x+w+10,y+h*0.8],[x+w+10,y+h+10,1],[x-10,y+h+10,1]],gp_c("field"),{exact:true,flat:true});
  S.line(ctx,c=>{for(let j=0;j<3;j++){const yy=y+h*(0.86+j*0.045);c.moveTo(x,yy);c.lineTo(x+w,yy-4);}},U.dk(gp_c("field"),0.2),0.4);
  S.begin(ctx,{lw:1.8,far:0.4,sh:3});for(const [f,k,sd] of i?[[0.2,0.38,4],[0.78,0.46,9]]:[[0.12,0.44,2],[0.64,0.36,6]])PK.tree(ctx,x+w*f,y+h*0.76,k,sd,{far:1});}
function gp_window(ctx,x,y,w,h,i){const S=PK.S,U=PK.u;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();gp_view(ctx,x,y,w,h,i);ctx.restore();
  S.begin(ctx,{lw:3,far:0.1,sh:5});const fr=gp_c("beam");
  S.fill(ctx,c=>{U.rrect(c,x-16,y-16,w+32,16,3);U.rrect(c,x-16,y+h,w+32,16,3);U.rrect(c,x-16,y-16,16,h+32,3);U.rrect(c,x+w,y-16,16,h+32,3);},fr,{});
  S.fill(ctx,c=>{U.rrect(c,x+w/2-6,y,12,h,2);for(const f of [1/3,2/3])U.rrect(c,x,y+h*f-4,w,8,2);},U.lt(fr,0.08),{w:0.7});
  S.fill(ctx,c=>U.rrect(c,x-30,y+h+12,w+60,18,5),gp_c("wood"),{});}
// the blackboard: a slate in a wooden frame, with a ledge for chalk under it
function gp_blackboard(ctx,x,y,w,h,k){const S=PK.S,U=PK.u;k=k||1;S.fill(ctx,c=>U.rrect(c,x-14*k,y-14*k,w+28*k,h+28*k,5*k),gp_c("beam"),{});
  S.fill(ctx,c=>U.rrect(c,x,y,w,h,2*k),gp_c("slate"),{line:false,flat:true});
  ctx.save();ctx.globalAlpha*=0.16;ctx.strokeStyle=U.css(GP_CHALK.ink);ctx.lineWidth=10*k;ctx.lineCap="round";ctx.beginPath();
  for(const [a,b,c2,d] of [[0.08,0.3,0.42,0.22],[0.5,0.7,0.9,0.62],[0.2,0.82,0.5,0.86]]){ctx.moveTo(x+a*w,y+b*h);ctx.quadraticCurveTo(x+(a+c2)/2*w,y+(b+d)/2*h-12*k,x+c2*w,y+d*h);}ctx.stroke();ctx.restore();
  S.fill(ctx,c=>U.rrect(c,x-24*k,y+h+10*k,w+48*k,14*k,4*k),gp_c("wood"),{});
  S.fill(ctx,c=>{U.rrect(c,x+w*0.7,y+h+2*k,26*k,9*k,3*k);U.rrect(c,x+w*0.76,y+h+3*k,18*k,8*k,3*k);},GP_CHALK.ink,{w:0.6,flat:true});
  S.fill(ctx,c=>U.rrect(c,x+w*0.18,y+h-2*k,70*k,14*k,3*k),[150,120,96],{w:0.6,flat:true});}
// the school's clock, in an eight-sided case, its pendulum below; hours: the time it shows
function gp_clock(ctx,hours){const S=PK.S,U=PK.u,[x,y,r]=GP_M.clock,pts=[];for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;pts.push([x+Math.cos(a)*r*1.18,y+Math.sin(a)*r*1.18,1]);}
  S.begin(ctx,{lw:2.6,far:0.1,sh:4});S.fill(ctx,c=>U.rrect(c,x-r*0.42,y+r*0.9,r*0.84,r*1.2,4),gp_c("beam"),{});S.poly(ctx,pts,gp_c("beam"),{exact:true});PK.clock(ctx,x,y,r*0.86,hours);}
// the sliding door at the left: open (0 to 1) slides its panel aside, the corridor behind it
function gp_door(ctx,open){const S=PK.S,U=PK.u,d=GP_M.door,x=d.x,y=800-d.h,w=d.w;S.begin(ctx,{lw:3,far:0.1,sh:5});
  S.fill(ctx,c=>U.rrect(c,x-14,y-16,w+28,d.h+16,3),gp_c("beam"),{});S.fill(ctx,c=>U.rrect(c,x,y,w,d.h,2),gp_c("corridor"),{line:false,flat:true});
  const px=x+w*0.82*U.clamp(open||0,0,1);ctx.save();ctx.beginPath();ctx.rect(x-6,y-4,w+12,d.h+8);ctx.clip();
  S.fill(ctx,c=>U.rrect(c,px,y,w,d.h,2),gp_c("wood"),{});
  S.fill(ctx,c=>{for(let r=0;r<2;r++)for(let q=0;q<2;q++)U.rrect(c,px+18+q*(w-36)/2+4,y+24+r*120,(w-36)/2-8,108,2);},U.mix(gp_c("sky"),gp_c("paper"),0.5),{w:0.6,flat:true});
  S.line(ctx,c=>{c.moveTo(px+w*0.12,y+d.h*0.5);c.lineTo(px+w*0.12,y+d.h*0.58);},null,1.2);ctx.restore();}
function gp_classPlace(ctx){const S=PK.S,U=PK.u;PK.paint.wall(ctx,gp_c("plaster"),800);
  S.begin(ctx,{lw:3,far:0.1,sh:5});
  // the beam along the top, and the posts
  S.fill(ctx,c=>U.rrect(c,-20,140,1960,26,2),gp_c("beam"),{});S.fill(ctx,c=>{for(const x of [24,372,1196,1880])U.rrect(c,x-15,-20,30,830,3);},gp_c("beam"),{});
  // boards along the foot of the wall
  S.fill(ctx,c=>U.rrect(c,-20,GP_M.dado,1960,800-GP_M.dado,0),gp_c("wood"),{});S.line(ctx,c=>{for(let x=40;x<1920;x+=92){c.moveTo(x,GP_M.dado+8);c.lineTo(x,794);}},U.dk(gp_c("wood"),0.25),0.4);
  S.fill(ctx,c=>U.rrect(c,-20,GP_M.dado-8,1960,12,3),gp_c("beam"),{});
  GP_M.win.forEach(([x,y,w,h],i)=>gp_window(ctx,x,y,w,h,i));
  const b=GP_M.board;S.begin(ctx,{lw:3,far:0.1,sh:5});gp_blackboard(ctx,b.x,b.y,b.w,b.h,1);
  PK.paint.floorAt(ctx,800,gp_c("floor"),true);S.begin(ctx,{lw:3,far:0.1,sh:5});S.fill(ctx,c=>U.rrect(c,-20,792,1960,12,2),gp_c("beam"),{});}
// the blackboard seen close, where a teacher explains: the kit's board's place and size (PK.ROOMS.board), so PK.teach stands right
function gp_boardPlace(ctx){const S=PK.S,U=PK.u,R=PK.ROOMS.board,b=R.board;PK.paint.wall(ctx,gp_c("plaster"),900);
  S.begin(ctx,{lw:4,far:0.05,sh:6});S.fill(ctx,c=>U.rrect(c,-20,40,1960,30,3),gp_c("beam"),{});S.fill(ctx,c=>U.rrect(c,1560,-20,40,920,3),gp_c("beam"),{});
  S.fill(ctx,c=>U.rrect(c,-20,780,1960,120,0),gp_c("wood"),{});S.line(ctx,c=>{for(let x=40;x<1920;x+=120){c.moveTo(x,790);c.lineTo(x,896);}},U.dk(gp_c("wood"),0.25),0.5);
  S.fill(ctx,c=>U.rrect(c,-20,772,1960,14,3),gp_c("beam"),{});
  gp_blackboard(ctx,b.x,b.y,b.w,b.h,1.6);
  PK.paint.floorAt(ctx,900,gp_c("floor"),true);S.fill(ctx,c=>U.rrect(c,-20,892,1960,14,2),gp_c("beam"),{});}
AG_PLACES.gpClass=gp_classPlace;AG_PLACES.gpBoard=gp_boardPlace;

/* ---------------------------------------------------------------- the children at their desks
   GP_SEATS: where each child sits, back row first (so nearer ones are drawn over them): [child, x, floor] */
const GP_SEATS=[[0,520,836],[1,800,836],[2,1066,836],[3,392,880],[5,676,880],[4,958,880],[6,250,928],[7,560,928],[8,866,928]];
const gp_kidH=fl=>gp_hM(fl)*0.74;
/* every child at their desk. o.look(i, tt): where child i looks ([x, y] of the eyes, -1 to 1), o.expr(i, tt) their face, o.nod(i,
   tt), o.write(i, tt) (0 to 1: the near hand on the slate, writing), o.skip(i): a child drawn by the scene itself (o.empty(i):
   their seat stands empty), o.after(ctx, i): drawn after child i (someone standing between the rows) */
function gp_class(ctx,tt,o){o=o||{};GP_SEATS.forEach(([i,x,fl],j)=>{if(o.skip&&o.skip(i)){if(o.empty&&o.empty(i))gp_seat(ctx,x,fl,gp_kidH(fl));if(o.after)o.after(ctx,i,j);return;}const h=gp_kidH(fl),P=GP_KIDS[i],
      w=o.write?o.write(i,tt):0.5+0.5*Math.sin(tt*0.7+i*1.9),top=fl-0.37*h,sx=x+0.11*h+0.52*h*0.42,wig=Math.sin(tt*9+i)*0.006*h*w;
    gp_pupil(ctx,P,x,fl,h,{t:tt+i*1.3,hand:[sx-0.03*h+wig,top-0.016*h],handK:0.3+0.7*w,expr:o.expr?o.expr(i,tt):"listen",gaze:o.look?o.look(i,tt):[0.6,-0.1+0.3*w],
      nod:o.nod?o.nod(i,tt):0,pose:PK.poseMix("sit","sitWork",0.4+0.4*w)});
    if(o.after)o.after(ctx,i,j);});}
// an empty seat: the chair, and the desk with its slate
function gp_seat(ctx,x,fl,h){const S=PK.S,U=PK.u,top=fl-0.37*h,x0=x+0.11*h,w=0.52*h;S.begin(ctx,{lw:U.clamp(h*0.0056,1.4,6.5),sh:U.clamp(h*0.0078,1.5,8.5)});
  PK.chair(ctx,x-0.012*h,fl,h,false,{col:GP_PAL.wood});PK.desk(ctx,x0+w/2,top,w,fl,{col:GP_PAL.woodLt,k:h/600,panel:true});gp_slate(ctx,x0+w*0.42,top,h/640);}
// the classroom with nobody in it: what a later moment in it passes through (the agent films' AG_BARE)
AG_BARE.gpClass=(x,tt)=>{gp_door(x,0);gp_clock(x,null);GP_SEATS.forEach(([i,sx,fl])=>gp_seat(x,sx,fl,gp_kidH(fl)));};
// a book held open in the far hand, while the near hand writes (PK.person's underF)
const gp_bookF=(ctx,hd,deg,J)=>gp_book({k:1.3,dx:6,dy:10})(ctx,hd,deg,J);

/* ---------------------------------------------------------------- someone explains at the blackboard, in chalk
   The kit's PK.teach writes with a marker and dresses nobody; a teacher of the 1870s writes with chalk, some in a kimono. So this is
   PK.teach's walk, ported: the writer walks to each line's start, along it as it grows, and between lines steps to the right of all
   that is written, facing the room, so nobody has to read round them (gp_chalkWalker is the kit's board walker). Pace the rows once
   with PK.pace, with the same board, floor, height and rest, and hand the result to every gp_chalkTeach that shows them. o: x, y
   (the board's corner), k, floor, h, rest (where they stand before the first row), say ([[t0, t1], …]), events (PK.face's), expr,
   face (how far they turn to the room: 0.66), stand ("clasp"), hold (what the near hand holds). -> their joints, with J.pen (PK.ink's
   result) and J.writing */
function gp_chalkWalker(P,o){const U=PK.u,h=o.h,u=h/1000,fl=o.floor,J0=PK.rig(P,0,fl,h,"stand",{flip:true,life:0}),sdx=J0.shF[0],sy=J0.shF[1],
    A=(J0.p.uarm+J0.p.farm+J0.p.hand*0.45)*u,near=0.14*h,
    // where they stand for the chalk to be at q: the shoulder as far from it as an arm reaches with ease, and never so near they hide it
    standX=q=>q[0]-sdx+Math.max(near+sdx,Math.sqrt(Math.max(0.09*A*A,0.7*A*A-(q[1]-sy)*(q[1]-sy)))),
    toPic=q=>[o.x+q[0]*o.k,o.y+q[1]*o.k],box=s=>{const a=toPic([s.box[0],s.box[1]]),b=toPic([s.box[2],s.box[3]]);return[a[0],a[1],b[0],b[1]];},
    far=q=>q[0]-sdx+Math.sqrt(Math.max(0.04*A*A,0.85*A*A-(q[1]-sy)*(q[1]-sy))),
    stay=(px,lo,hi,best)=>{if(px==null)return best;const c=U.clamp(px,lo,Math.max(lo,hi));return Math.abs(c-px)<0.06*h?c:best;},
    from=(s,px)=>{if(s.text||s.line){const q=toPic(s.at(0));return stay(px,q[0]+near,far(q),standX(q));}
      const b=box(s),m=[(b[0]+b[2])/2,(b[1]+b[3])/2],lo=b[2]+near,hi=Math.max(lo,far([b[0],m[1]]));return stay(px,lo,hi,Math.max(lo,Math.min(standX(m),hi)));};
  return{h,u,fl,sdx,sy,A,box,speed:0.95*h,side:0.9*h,dur:(d,sp)=>Math.abs(d)<0.06*h?0:Math.max(0.3,Math.abs(d)/sp+0.1),
    hid:s=>box(s)[3]>fl-0.95*h,from,to:(s,a)=>s.text||s.line?standX(toPic(s.at(1))):a};}
function gp_chalkTeach(ctx,who,t,items,o){const U=PK.u,R=PK.ROOMS.board;
  o=Object.assign({x:R.board.x,y:R.board.y,k:1,floor:R.floor,h:R.h,rest:R.rest,face:0.66,stand:"clasp",lw:7},o||{});
  const io={x:o.x,y:o.y,k:o.k,lw:o.lw,walk:true,deco:o.deco},pen=PK.ink(ctx,items,t,io),P=who?gp_row(who):null;if(!P)return{pen};
  const G=gp_chalkWalker(P,o),{h,u,fl,sdx,sy,A,box,hid,from,to,speed,side,dur}=G,
    all=PK.inkPlan(ctx,items,io,true),S_=all.filter(s=>s.t1>-1e8).sort((a,b)=>a.t0-b.t0),amp=PK.ampOf(P),stride=PK.strideOf(h,amp),mv=[],busyAt=[];
  // their feet, as the kit's PK.teach plans them: to each line's start, along it as it grows, then clear to the right of what is written
  let px=o.rest,pt=-1e9,right=-1e9;for(const s of all)if(s.t1<=-1e8&&hid(s))right=Math.max(right,box(s)[2]);
  const go=(t1,x1,sp,busy)=>{if(Math.abs(x1-px)<=0.5)return Math.max(pt,t1);const d=Math.max(0.12,dur(x1-px,sp)),t0=Math.max(pt,t1-d),te=Math.max(t1,t0+0.72*d);
    mv.push([t0,te,px,x1,1]);if(busy)busyAt.push([t0,te]);px=x1;pt=te;return te;};
  S_.forEach((s,j)=>{const a=from(s,px),b=to(s,a),ta=go(s.t0-0.05,a,speed,true);
    if(b!==a&&ta<s.t1-0.05){mv.push([Math.max(s.t0,ta),s.t1,a,b,0]);px=b;}
    pt=Math.max(pt,s.t1);busyAt.push([s.t0-0.2,s.t1+0.1]);if(hid(s))right=Math.max(right,box(s)[2]);
    const nx=S_[j+1],clear=Math.max(px,right+0.26*h);if(clear-px<=0.03*h)return;
    if(!nx){go(pt+0.2+dur(clear-px,side),clear,side,false);return;}
    const aN=from(nx,px);
    if(aN>=clear-0.02*h){if(nx.t0-pt>0.5+dur(aN-px,speed))go(pt+0.2+dur(aN-px,speed),aN,speed,false);}
    else if(aN!==px&&nx.t0-0.05-pt>=0.2+dur(clear-px,side)+0.3+dur(aN-clear,speed))go(pt+0.2+dur(clear-px,side),clear,side,false);});
  const xAt=tt=>{let x=o.rest;for(const [t0,t1,x0,x1,e] of mv){if(tt<=t0)break;const q=U.clamp((tt-t0)/(t1-t0),0,1);x=U.lerp(x0,x1,e?U.sine(q):q);}return x;};
  let busy=0;for(const [t0,t1] of busyAt)busy=Math.max(busy,U.pin(t,t0-0.35,0.4)*(1-U.pin(t,t1+0.1,0.45)));
  const x=xAt(t),vs=(xAt(t+0.04)-xAt(t-0.04))/0.08,v=Math.abs(vs),off=U.clamp(vs/(0.3*h),0,1)*(1-busy),wr=(pen.on||0)*busy,q=pen.pen||[x-0.2*h,sy],
    walk=PK.poseMix(PK.poseMix(o.stand,"ease",Math.max(busy,off)),PK.poseWalk(Math.abs(x-o.rest)/stride,1,amp*U.lerp(1,0.42,wr)),U.clamp(v/180,0,1)*0.85),
    low=U.clamp((q[1]-sy-0.5*A)/(0.45*A),0,1.3)*wr,pose=Object.assign({},walk,{lean:(walk.lean||0)+14*low,aF:[walk.aF[0],walk.aF[1],"grip"]}),
    // the hand, so that the chalk's tip is on the writing: a short stick, along the forearm
    sh=[x+sdx,sy],dl=Math.hypot(q[0]-sh[0],q[1]-sh[1])||1,tg=[q[0]-(q[0]-sh[0])/dl*26*u,q[1]-(q[1]-sh[1])/dl*26*u+Math.sin(t*23)*2.2*(1-(pen.lift||0))*wr],
    F=PK.face(t,{expr:o.expr||"neutral",gaze:[U.lerp(0.1,1,busy),U.lerp(0,q[1]<sy?-0.4:0.3,wr)]},(o.events||[]).concat((o.say||[]).map(([a,b])=>[a,"say",b-a])));
  const J=gp_person(ctx,P,x,fl,h,pose,Object.assign({t:o.t==null?t:o.t,flip:U.lerp(U.lerp(o.face,0.25,off),1,busy),reachF:tg,reachFk:wr,underF:gp_chalk,hold:o.hold},F));
  J.pen=pen;J.writing=wr;return J;}
