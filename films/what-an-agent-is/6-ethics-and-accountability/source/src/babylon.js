/* ===== Ethics we can't read, accountability it can't hold: Babylon, about 1750 BC =====
   This film's own pictures of the opening (prefix ox_ and OX_), drawn in the module's matte way: soft forms, a soft highlight where the
   sun falls (from the right, as the lab's window), a soft inner shadow on the side away from it, and the place's own warm palette. */

const OX_PAL={
  hide:[150,98,62],hideHi:[206,162,118],
  hide2:[104,74,54],hide2Hi:[170,134,100],
  horn:[214,198,166],hornTip:[86,72,58],hoof:[50,40,34],
  brick:[196,164,124],brickHi:[230,206,170],brickDark:[150,120,88],
  earth:[168,134,98],earthDark:[118,88,62],furrow:[96,70,48],
  reed:[176,164,112],palm:[104,120,82],palmDark:[70,84,58],trunk:[142,110,80],
  sky0:[206,216,222],sky1:[236,226,206],water:[150,170,170],
  linen:[226,214,190],wool:[196,170,132],dye:[146,96,74],fringe:[176,140,96]
};

/* a tube along a cubic curve p [x0,y0, x1,y1, x2,y2, x3,y3], from width w0 to w1, as part of a shape; round: a rounded end */
function ox_tube(c,p,w0,w1,round,n){n=n||24;const L=[],R=[];
  for(let i=0;i<=n;i++){const u=i/n,q=ag_bz(p,u),q2=ag_bz(p,Math.min(1,u+0.01)),q1=ag_bz(p,Math.max(0,u-0.01)),dx=q2[0]-q1[0],dy=q2[1]-q1[1],l=Math.hypot(dx,dy)||1,
    w=lerp(w0,w1,Math.pow(u,0.9))/2;L.push([q[0]-dy/l*w,q[1]+dx/l*w]);R.push([q[0]+dy/l*w,q[1]-dx/l*w]);}
  c.moveTo(L[0][0],L[0][1]);for(let i=1;i<L.length;i++)c.lineTo(L[i][0],L[i][1]);
  const e=ag_bz(p,1),e0=ag_bz(p,0.98),an=Math.atan2(e[1]-e0[1],e[0]-e0[0]);
  if(round)c.arc(e[0],e[1],w1/2,an+Math.PI/2,an-Math.PI/2,true);else c.lineTo(e[0]+Math.cos(an)*w1*0.6,e[1]+Math.sin(an)*w1*0.6);
  for(let i=R.length-1;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();}

/* ---------------------------------------------------------------- the ox
   The humpless, long-horned cattle of the time, side on, facing right; (x, y) is the ground under the middle of its body; s = 1 is about
   640 px from rump to muzzle and 350 px to the withers. o:
     t      time, for the walk, the tail, breathing and chewing
     walk   0 (standing) to 1 (walking): how far the legs swing; speed, steps a second (0.55)
     head   0 (level) to 1 (lowered, horns forward, as to gore); toss 0 to 1 lifts it back up sharply
     horns  "sharp" or "blunt"; chew 0 to 1; far: the second ox of a pair, darker; flip: facing left; a */
function ox_cattle(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const t=o.t||0,walk=o.walk||0,sp=o.speed||0.55,far=!!o.far;
  const base=far?OX_PAL.hide2:OX_PAL.hide,hi=far?OX_PAL.hide2Hi:OX_PAL.hideHi,shade=rgba(mix(base,[20,10,4],0.7),0.5),point=mix(base,[34,20,12],0.42);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);
  if(!o.noShadow)ag_floorShadow(ctx,-50,6,340,26,0.28);
  const ph=t*sp*TAU,br=Math.sin(t*1.6)*1.6;
  /* a leg from its top (hidden under the body) to the hoof, by its hoof's place: on the ground it moves back as the ox steps forward,
     then it lifts and swings forward (ph: where the leg is in its step, 0 to 1); the knee folds forward, the hock back */
  const STR=118*walk,LIFT=34*walk,leg=(hx,hy,k,front,col,hic)=>{const u=((ph/TAU+k)%1+1)%1,st=0.66;
    let fx,fy;if(u<st){fx=lerp(STR/2,-STR/2,u/st);fy=0;}else{const v=(u-st)/(1-st);fx=lerp(-STR/2,STR/2,ag_sine(v));fy=-LIFT*Math.sin(Math.PI*v);}
    const H0=[hx+(front?4:-10)+fx,fy];                 // the hoof
    const F=[H0[0]-(front?8:6),H0[1]-30];              // the fetlock, just above it
    const L1=front?92:116,L2=front?78:100,A=[hx,hy],dx=F[0]-A[0],dy=F[1]-A[1],d=Math.min(Math.hypot(dx,dy),L1+L2-1),
      al=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),an=Math.atan2(dy,dx),sg=front?-1:1,
      E=[A[0]+Math.cos(an+sg*al)*L1,A[1]+Math.sin(an+sg*al)*L1];
    const w=front?[68,40,30]:[80,40,30];
    ag_soft(ctx,ag_armPath(A,E,F,w),col,hic,hx+26,hy+40,160,shade,14);
    // the fetlock and pastern, and the hoof, dark and cloven
    ag_soft(ctx,c=>ag_capsule(c,F,[H0[0]-2,H0[1]-12],30,26),mix(col,[30,20,14],0.25),hic,F[0]+8,F[1],40,null);
    ctx.save();ctx.translate(H0[0],H0[1]);ctx.fillStyle=rgba(OX_PAL.hoof,1);ctx.beginPath();ctx.moveTo(-16,-16);ctx.lineTo(14,-16);ctx.lineTo(22,3);ctx.lineTo(-17,3);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.14)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(3,-14);ctx.lineTo(4,2);ctx.stroke();ctx.restore();};
  // the legs, the far ones darker, all under the body's edge
  const farC=mix(base,[30,20,12],0.32),farH=mix(hi,[60,40,24],0.35);
  leg(122,-200,0.75,true,farC,farH);leg(-166,-224,0.5,false,farC,farH);
  leg(150,-198,0.25,true,base,hi);leg(-190,-228,0.0,false,base,hi);
  // the tail, from the tail head down the back of the thigh, swaying a little, with a dark tuft
  const tw=Math.sin(t*1.3)*8+Math.sin(t*0.71)*5;
  ag_soft(ctx,c=>ox_tube(c,[-262,-322,-292,-280,-292+tw*0.3,-200,-286+tw,-150],13,9,true),mix(base,[30,18,10],0.18),hi,-270,-280,60,null);
  ag_soft(ctx,c=>{c.ellipse(-286+tw,-128,13,30,0.04*tw,0,TAU);},mix(base,[20,12,6],0.62),mix(hi,[60,40,20],0.4),-282+tw,-142,30,null);
  // the body: the rump, the hip, the back, the withers, the neck to the poll, the throat and dewlap, the brisket, the belly, the thigh
  const hd=clamp(o.head||0,0,1)-0.6*clamp(o.toss||0,0,1);
  const body=c=>{c.moveTo(-262,-322+br*0.2);
    c.bezierCurveTo(-232,-338,-196,-344,-170,-338);c.bezierCurveTo(-120,-330,-60,-322,-10,-326);c.bezierCurveTo(46,-330,92,-352,128,-354+br*0.3);
    c.bezierCurveTo(170,-356,206,-346,232+hd*6,-326+hd*22);                                              // the crest of the neck to the poll
    c.lineTo(250+hd*10,-300+hd*34);c.bezierCurveTo(252+hd*8,-276+hd*36,246+hd*4,-254+hd*40,236,-236+hd*40); // the throat
    c.bezierCurveTo(226,-206,214,-178,196,-160);c.bezierCurveTo(186,-150,174,-146,160,-150);              // the dewlap to the brisket
    c.bezierCurveTo(140,-152,118,-158,92,-158);c.bezierCurveTo(30,-160,-40,-146,-100,-156);              // the girth and the belly
    c.bezierCurveTo(-130,-172,-150,-184,-164,-198);c.bezierCurveTo(-200,-198,-236,-214,-258,-244);      // the flank and the thigh
    c.bezierCurveTo(-276,-268,-276,-300,-262,-322);c.closePath();};
  ag_soft(ctx,body,base,hi,96,-334,340,shade,40);
  // what lies under the hide: the shoulder, the ribs' soft line, the hip bone, the thigh's fold, the dewlap's folds
  ag_folds(ctx,body,[[[128,-344],[104,-282],[122,-206]],[[60,-316],[34,-250],[46,-182]],[[-170,-338],[-186,-300],[-204,-252]],[[-120,-310],[-140,-246],[-150,-196]],
      [[206,-232],[194,-206],[180,-180]]],rgba(mix(base,[20,10,4],0.62),0.11),rgba(mix(hi,[255,255,255],0.3),0.1));
  // the head, turned down by hd about the top of the neck
  ctx.save();ctx.translate(226,-312);ctx.rotate(hd*0.66);ctx.translate(-226,312);
  ox_horn(ctx,o.horns,true,base);
  const head=c=>{c.moveTo(226,-340);c.bezierCurveTo(250,-350,282,-344,300,-328);c.bezierCurveTo(326,-300,352,-258,370,-232);
    c.bezierCurveTo(382,-214,380,-196,366,-190);c.bezierCurveTo(348,-182,322,-184,302,-194);c.bezierCurveTo(278,-206,256,-226,242,-250);
    c.bezierCurveTo(226,-276,214,-318,226,-340);c.closePath();};
  ag_soft(ctx,head,mix(base,point,0.35),hi,306,-318,120,shade,22);
  // the forehead's light between the horns, a soft line down the face, the muzzle, the nostril, the eye; the jaw moves while it chews
  const ch=(o.chew||0)*(0.5+0.5*Math.sin(t*5.4));
  ag_soft(ctx,c=>{c.moveTo(346,-250);c.bezierCurveTo(366,-236,382,-212,374,-196);c.bezierCurveTo(366,-184,344,-182,330,-188);c.bezierCurveTo(336,-208,340,-232,346,-250);c.closePath();},
    mix(base,[64,44,36],0.42),mix(hi,[210,176,160],0.32),364,-222,32,null);
  ctx.fillStyle=rgba(mix(base,[10,6,4],0.78),0.85);ctx.beginPath();ctx.ellipse(364,-213,5,8,0.55,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(mix(base,[10,6,4],0.6),0.5);ctx.lineWidth=2.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(334,-190+ch*4);ctx.quadraticCurveTo(318,-188+ch*6,300,-194+ch*4);ctx.stroke();
  ctx.fillStyle="#1d1410";ctx.beginPath();ctx.ellipse(288,-290,7.5,6.5,0.35,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.7)";ctx.beginPath();ctx.arc(290,-292,1.8,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(mix(base,[10,6,4],0.6),0.4);ctx.lineWidth=2;ctx.beginPath();ctx.arc(288,-290,11,-2.5,-0.5);ctx.stroke();
  // the near ear, out to the side and back, under the horn
  ag_soft(ctx,c=>{c.moveTo(244,-310);c.bezierCurveTo(222,-326,192,-326,178,-312);c.bezierCurveTo(190,-298,220,-292,244,-298);c.closePath();},
    mix(base,point,0.2),mix(hi,[230,184,156],0.3),214,-312,44,shade,8);
  ctx.strokeStyle=rgba(mix(base,[90,40,30],0.5),0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(238,-306);ctx.quadraticCurveTo(212,-312,190,-312);ctx.stroke();
  ox_horn(ctx,o.horns,false,base);
  ctx.restore();
  ctx.restore();}
/* a horn, long and curving, as the cattle of the time had them: out from the poll, forward and up, its tip turning back; far: the one
   behind the head, paler and a little higher; blunt: the tip rasped round */
function ox_horn(ctx,kind,far,base){const bl=kind==="blunt",dx=far?-20:0,dy=far?-12:0,
    p0=[242+dx,-338+dy, 300+dx,-356+dy, 352+dx,-394+dy, 350+dx,-458+dy],p=bl?ox_cut(p0,0.84):p0,tipW=bl?13:3,
    path=c=>ox_tube(c,p,34,tipW,bl);
  const hc=far?mix(OX_PAL.horn,[130,110,88],0.28):OX_PAL.horn;
  ag_soft(ctx,path,hc,[255,250,238],344,-400+dy,80,rgba([70,54,36],0.42),10);
  ctx.save();ag_shape(ctx,path);ctx.clip();
  const g=ctx.createLinearGradient(330+dx,-400+dy,352+dx,-462+dy);g.addColorStop(0,rgba(OX_PAL.hornTip,0));g.addColorStop(1,rgba(OX_PAL.hornTip,bl?0.42:0.8));ctx.fillStyle=g;ctx.fillRect(220+dx,-520+dy,160,110);
  // faint rings near the base
  ctx.strokeStyle="rgba(90,70,50,0.22)";ctx.lineWidth=2;for(let i=0;i<4;i++){const q=ag_bz(p,0.08+i*0.05);ctx.beginPath();ctx.arc(q[0],q[1],17-i*1.5,-0.9,0.9);ctx.stroke();}
  ctx.restore();
  // a blunt tip: the pale end where the horn was rasped
  if(bl){const e=ag_bz(p,1);ctx.fillStyle="rgba(236,226,204,0.9)";ctx.beginPath();ctx.ellipse(e[0],e[1]+1,5.5,3.2,-0.2,0,TAU);ctx.fill();}}
// the first part of a cubic, up to u (de Casteljau), as a cubic of its own
function ox_cut(p,u){const L=(a,b)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)],P0=[p[0],p[1]],P1=[p[2],p[3]],P2=[p[4],p[5]],P3=[p[6],p[7]],
  A=L(P0,P1),B=L(P1,P2),C=L(P2,P3),D=L(A,B),E=L(B,C),F=L(D,E);return[P0[0],P0[1],A[0],A[1],D[0],D[1],F[0],F[1]];}

/* ---------------------------------------------------------------- places, painted once
   The field by a canal outside the city wall in the low sun of morning (oxField); a street of mud-brick houses (oxStreet); the temple
   courtyard where the stone stands (oxCourt). The sun is low on the right, so shadows fall left, as in the lab. */
// a soft sky: pale grey-blue above, warm near the horizon, brighter towards the sun
function ox_sky(c,hz,sun){let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(198,208,212)");g.addColorStop(0.6,"rgb(226,224,214)");g.addColorStop(1,"rgb(240,230,210)");
  c.fillStyle=g;c.fillRect(0,0,W,hz+2);if(sun){g=c.createRadialGradient(sun[0],sun[1],10,sun[0],sun[1],900);g.addColorStop(0,"rgba(255,246,222,0.75)");g.addColorStop(0.25,"rgba(255,240,210,0.3)");g.addColorStop(1,"rgba(255,240,210,0)");
    c.fillStyle=g;c.fillRect(0,0,W,hz+2);}
  // a few long, thin clouds, soft
  c.save();c.filter="blur(18px)";c.fillStyle="rgba(255,250,240,0.35)";for(const [x,y,w,h] of [[260,150,520,26],[980,96,420,20],[1360,210,380,18]]){c.beginPath();c.ellipse(x,y,w/2,h/2,0,0,TAU);c.fill();}c.restore();}
// a mud-brick block in the module's matte way: a face lit from the right, a darker side, a soft top edge; v: lightness shift
function ox_block(c,x,y,w,h,v,side){const b=mix(OX_PAL.brick,v>0?[255,248,232]:[90,70,50],Math.abs(v||0));
  c.fillStyle=rgba(b,1);c.fillRect(x,y,w,h);
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(60,40,24,0.14)");g.addColorStop(0.7,"rgba(60,40,24,0)");g.addColorStop(1,"rgba(255,246,226,0.12)");c.fillStyle=g;c.fillRect(x,y,w,h);
  if(side){c.fillStyle=rgba(mix(b,[60,40,24],0.3),1);c.fillRect(x-side,y+side*0.4,side,h-side*0.4);}
  c.fillStyle="rgba(255,248,232,0.4)";c.fillRect(x,y,w,2);}
// a date palm: a slender trunk with tapering curves and ring scars, a crown of arching fronds; s its height
function ox_palm(c,x,y,s,lean,seed){const R=ag_rnd(seed||5),tx=x+lean*s*0.3,ty=y-s;
  c.save();c.lineCap="round";const tr=cc=>ox_tube(cc,[x,y,x+lean*s*0.05,y-s*0.4,tx-lean*s*0.05,ty+s*0.3,tx,ty],s*0.07,s*0.045,true,18);
  ag_soft(c,tr,OX_PAL.trunk,[214,188,150],tx+s*0.05,ty+s*0.4,s*0.5,"rgba(50,34,20,0.4)",8);
  c.strokeStyle="rgba(70,50,30,0.25)";c.lineWidth=Math.max(1,s*0.006);for(let i=1;i<12;i++){const q=ag_bz([x,y,x+lean*s*0.05,y-s*0.4,tx-lean*s*0.05,ty+s*0.3,tx,ty],i/12),w=s*0.03;c.beginPath();c.moveTo(q[0]-w,q[1]+2);c.lineTo(q[0]+w,q[1]-2);c.stroke();}
  // fronds: arching curves, darker underneath, lighter where the sun catches them
  const n=13;for(let i=0;i<n;i++){const an=-Math.PI/2+(i/(n-1)-0.5)*3.4+(R()-0.5)*0.2,L=s*(0.42+R()*0.14),droop=0.55+R()*0.3,
      ex=tx+Math.cos(an)*L,ey=ty+Math.sin(an)*L*0.55+L*droop*0.45,mx=tx+Math.cos(an)*L*0.55,my=ty+Math.sin(an)*L*0.55-L*0.08;
    const lit=Math.cos(an)>0;c.strokeStyle=rgba(lit?OX_PAL.palm:OX_PAL.palmDark,0.95);c.lineWidth=Math.max(1.5,s*0.012);c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();
    // leaflets along the frond: short strokes on both sides
    c.lineWidth=Math.max(1,s*0.006);for(let k=2;k<11;k++){const u=k/11,px=(1-u)*(1-u)*tx+2*(1-u)*u*mx+u*u*ex,py=(1-u)*(1-u)*ty+2*(1-u)*u*my+u*u*ey,ll=s*0.07*(1-u*0.5);
      for(const sd of [-1,1]){c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(an+sd*1.9)*ll*0.5,py+Math.sin(an+sd*1.9)*ll*0.5+ll*0.6);c.stroke();}}}
  c.fillStyle=rgba(OX_PAL.palmDark,1);c.beginPath();c.ellipse(tx,ty+s*0.02,s*0.05,s*0.035,0,0,TAU);c.fill();c.restore();}
// the city wall far off: mud brick, with towers, and the gate; roofs and palms show over it
function ox_wall(c,x0,x1,y,h,gx){c.save();
  for(let x=x1-60;x>x0-200;x-=150){ox_palm(c,x+((x*7)%40),y-h*0.6,h*(1.6+((x*13)%50)/100),0.12,(x|0)+3);}
  c.fillStyle=rgba(mix(OX_PAL.brick,[255,248,232],0.15),1);
  for(let x=x0+40;x<x1;x+=210){c.fillRect(x,y-h-34-((x*3)%20),120,40);}   // roofs over the wall
  ox_block(c,x0,y-h,x1-x0,h,0.08);
  for(let x=x0;x<x1;x+=96){const th=h+22;ox_block(c,x,y-th,34,th,0.12,8);c.fillStyle="rgba(60,40,24,0.25)";for(let k=0;k<2;k++)c.fillRect(x+8+k*14,y-th+4,6,6);}
  if(gx){c.fillStyle="rgba(70,50,34,0.9)";c.beginPath();c.moveTo(gx-26,y);c.lineTo(gx-26,y-h*0.55);c.arc(gx,y-h*0.55,26,Math.PI,0);c.lineTo(gx+26,y);c.closePath();c.fill();
    ox_block(c,gx-70,y-h-46,40,h+46,0.16,8);ox_block(c,gx+30,y-h-46,40,h+46,0.16,8);}
  c.restore();}
// furrows across a field, running left to right as the plough goes, closer together as they recede towards the horizon hz; from y0 to
// y1, between x0 and x1 (or a clip the caller sets); dark: freshly turned, deeper troughs
function ox_furrows(c,x0,x1,y0,y1,hz,dark,seed){const R=ag_rnd(seed||3);c.save();c.lineCap="round";
  for(let y=y0;y<y1;){const d=y-hz,gap=Math.max(3,d*0.075),wob=d*0.012;c.strokeStyle=rgba(OX_PAL.furrow,(dark?0.34:0.07)*clamp(d/120,0.3,1));c.lineWidth=Math.max(1,gap*0.32);
    c.beginPath();for(let x=x0;x<=x1;x+=60){const yy=y+Math.sin(x*0.004+y*0.3)*wob+(R()-0.5)*wob*0.3;x===x0?c.moveTo(x,yy):c.lineTo(x,yy);}c.stroke();
    c.strokeStyle="rgba(255,240,214,"+((dark?0.16:0.05)*clamp(d/120,0.3,1))+")";c.lineWidth=Math.max(1,gap*0.14);
    c.beginPath();for(let x=x0;x<=x1;x+=60){const yy=y-gap*0.35+Math.sin(x*0.004+y*0.3)*wob;x===x0?c.moveTo(x,yy):c.lineTo(x,yy);}c.stroke();y+=gap;}
  c.restore();}
AG_PLACES.oxField=c=>ox_paintField(c,false);
AG_PLACES.oxFieldHalf=c=>ox_paintField(c,true);
// half: the ploughing stopped part way across, the furrows ending in stubble
function ox_paintField(c,half){const hz=470;ox_sky(c,hz,[1640,250]);
  // far fields and the wall, the gate a little right of the middle
  let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(196,176,138)");g.addColorStop(0.35,"rgb(176,146,108)");g.addColorStop(1,"rgb(150,118,86)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  ox_wall(c,820,W+40,hz+6,62,1290);
  // a line of palms along the canal, mid-distance, on the left
  for(const [x,s,l] of [[90,250,-0.1],[210,210,0.08],[330,240,0.02],[470,200,-0.06],[600,180,0.1]])ox_palm(c,x,hz+40,s,l,x);
  // the canal, from the left foreground curving away to the palms, between reed banks
  const canal=cc=>{cc.moveTo(-20,708);cc.bezierCurveTo(240,640,420,560,640,512);cc.lineTo(700,506);cc.bezierCurveTo(520,566,330,660,140,760);cc.lineTo(-20,790);cc.closePath();};
  c.save();ag_shape(c,canal);c.clip();g=c.createLinearGradient(0,500,0,790);g.addColorStop(0,"rgb(214,220,214)");g.addColorStop(1,"rgb(150,170,170)");c.fillStyle=g;c.fillRect(0,480,800,320);
  c.strokeStyle="rgba(255,255,255,0.35)";c.lineWidth=2;for(let i=0;i<14;i++){const y=520+i*18,x=640-i*44;c.beginPath();c.moveTo(x,y);c.lineTo(x+60+i*4,y-4);c.stroke();}c.restore();
  // reeds along both banks
  const R=ag_rnd(9);c.lineCap="round";for(let i=0;i<220;i++){const u=R(),side=R()<0.5,bx=side?lerp(-20,640,u):lerp(-20,700,u),by=side?lerp(708,512,Math.pow(u,0.9))-2:lerp(790,506,Math.pow(u,0.8))+2,
      hh=lerp(70,16,u)*(0.6+R()*0.6);c.strokeStyle=rgba(mix(OX_PAL.reed,[90,90,50],R()*0.4),0.9);c.lineWidth=lerp(4,1.5,u);c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(bx+(R()-0.3)*10,by-hh*0.6,bx+(R()-0.2)*hh*0.4,by-hh);c.stroke();}
  // the field: unploughed stubble far, ploughed earth near, furrows running to the far side
  // the field beyond the canal: stubble far off, then the ploughed earth, darker, where the oxen work, then the near bank of stubble
  c.save();c.beginPath();c.moveTo(700,506);c.lineTo(W,506);c.lineTo(W,H);c.lineTo(0,H);c.lineTo(0,790);c.lineTo(140,760);c.bezierCurveTo(330,660,520,566,700,506);c.closePath();c.clip();
  ox_furrows(c,0,W,hz+14,H,hz,false,4);
  { const R2=ag_rnd(77);c.lineCap="round";for(let i=0;i<1400;i++){const y=hz+14+Math.pow(R2(),1.6)*(H-hz-14),d=y-hz,x=R2()*W,l=1.5+d*0.022;
      c.strokeStyle=R2()<0.5?"rgba(214,190,140,0.5)":"rgba(120,90,60,0.28)";c.lineWidth=Math.max(1,d*0.004);c.beginPath();c.moveTo(x,y);c.lineTo(x+(R2()-0.5)*l*0.4,y-l);c.stroke();}}
  const plo=cc=>{cc.moveTo(0,700);cc.bezierCurveTo(600,660,1300,640,W,650);cc.lineTo(W,930);cc.bezierCurveTo(1200,940,600,950,0,960);cc.closePath();};
  c.save();ag_shape(c,plo);c.clip();if(half){c.beginPath();c.moveTo(0,600);c.lineTo(1080,600);for(let y=600;y<=980;y+=20)c.lineTo(1080+Math.sin(y*0.09)*14+(y-600)*0.12,y);c.lineTo(0,980);c.closePath();c.clip();}g=c.createLinearGradient(0,640,0,960);g.addColorStop(0,"rgba(104,74,50,0.30)");g.addColorStop(1,"rgba(104,74,50,0.40)");c.fillStyle=g;c.fillRect(0,600,W,400);
  ox_furrows(c,0,W,640,970,hz,true,7);c.restore();c.restore();
  // the low sun's warmth over everything, and the soft shade towards the left
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(50,34,20,0.14)");g.addColorStop(0.45,"rgba(50,34,20,0)");g.addColorStop(1,"rgba(255,236,200,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);}

/* a street of mud-brick houses round their courtyards: fronts with small wooden doors, few windows, flat roofs on beams; packed earth */
const OX_STREET={base:720,houses:[[-40,470,500,0.02],[430,400,430,-0.04],[830,340,520,0.06],[1330,420,380,-0.02],[1690,300,470,0.04]],
  doors:[[140,0],[620,1],[1020,0],[1500,0],[1800,0]]};
function ox_house(c,x,w,h,v,base){const y=base-h,b=mix(OX_PAL.brick,v>0?[255,246,228]:[96,72,50],Math.abs(v)*2.2);
  // the wall, plastered with mud, a little uneven; the light from the right, soft shade to the left
  c.fillStyle=rgba(b,1);c.fillRect(x,y,w,h);
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(70,46,26,0.18)");g.addColorStop(0.5,"rgba(70,46,26,0.04)");g.addColorStop(1,"rgba(255,244,222,0.1)");c.fillStyle=g;c.fillRect(x,y,w,h);
  g=c.createLinearGradient(0,y,0,base);g.addColorStop(0,"rgba(255,246,228,0.12)");g.addColorStop(0.8,"rgba(70,46,26,0)");g.addColorStop(1,"rgba(70,46,26,0.16)");c.fillStyle=g;c.fillRect(x,y,w,h);
  // the plaster's soft patches, and bricks showing where it has worn
  const R=ag_rnd((x|0)+7);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.filter="blur(14px)";for(let i=0;i<8;i++){const px=x+R()*w,py=y+40+R()*(h-80),pw=40+R()*90,ph=16+R()*30;c.fillStyle="rgba("+(R()<0.5?"80,56,34,0.05":"255,246,226,0.06")+")";c.beginPath();c.ellipse(px,py,pw,ph,0,0,TAU);c.fill();}c.restore();
  for(let i=0;i<2;i++){const px=x+30+R()*(w-160),py=y+80+R()*(h-240),n=2+((R()*2)|0);c.strokeStyle="rgba(90,62,40,0.14)";c.lineWidth=1.2;
    for(let r=0;r<n;r++)for(let k=0;k<n+1-r;k++){c.strokeRect(px+k*26+(r%2)*13,py+r*12,26,12);}}
  // the parapet, and the round ends of the roof beams under it, each with a small shadow
  c.fillStyle=rgba(mix(b,[255,248,232],0.18),1);c.fillRect(x-4,y-14,w+8,22);c.fillStyle="rgba(70,46,26,0.2)";c.fillRect(x-4,y+8,w+8,5);
  for(let bx=x+24;bx<x+w-10;bx+=44){c.fillStyle="rgba(60,40,24,0.22)";c.beginPath();c.ellipse(bx-3,y+30,8,7,0,0,TAU);c.fill();c.fillStyle=rgba(OX_PAL.trunk,1);c.beginPath();c.ellipse(bx,y+27,7.5,7,0,0,TAU);c.fill();
    c.fillStyle="rgba(255,236,200,0.35)";c.beginPath();c.arc(bx+2,y+25,3,0,TAU);c.fill();}
  // a small high window, or two
  for(let i=0;i<(w>420?2:1);i++){const wx=x+w*(0.3+0.4*i)-14,wy=y+90;c.fillStyle="rgba(46,32,22,0.8)";c.fillRect(wx,wy,28,36);c.fillStyle="rgba(255,240,210,0.25)";c.fillRect(wx+28,wy,3,36);}}
// a small wooden door with a lintel, in a deep frame; open: the door stands open on a dark room
function ox_door(c,x,base,open){const w=110,h=200,y=base-h;c.fillStyle="rgba(70,46,26,0.35)";c.fillRect(x-14,y-10,w+28,h+10);
  c.fillStyle=rgba(OX_PAL.trunk,1);c.fillRect(x-20,y-24,w+40,18);c.fillStyle="rgba(255,236,200,0.3)";c.fillRect(x-20,y-24,w+40,3);
  if(open){c.fillStyle="rgb(58,42,32)";c.fillRect(x,y,w,h);let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(0,0,0,0.3)");g.addColorStop(1,"rgba(120,90,60,0.25)");c.fillStyle=g;c.fillRect(x,y,w,h);
    c.fillStyle=rgba([120,84,56],1);c.beginPath();c.moveTo(x,y);c.lineTo(x-36,y+16);c.lineTo(x-36,base+6);c.lineTo(x,base);c.closePath();c.fill();}
  else{c.fillStyle=rgba([126,88,58],1);c.fillRect(x,y,w,h);c.strokeStyle="rgba(50,32,20,0.35)";c.lineWidth=2;for(let k=1;k<4;k++){c.beginPath();c.moveTo(x+k*w/4,y);c.lineTo(x+k*w/4,base);c.stroke();}
    c.fillStyle="rgba(40,26,16,0.6)";c.beginPath();c.arc(x+w-22,y+h*0.5,5,0,TAU);c.fill();}
  c.fillStyle="rgba(40,26,16,0.3)";c.fillRect(x-14,base-6,w+28,6);}
function ox_ground(c,y0,seed){let g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,"rgb(190,160,122)");g.addColorStop(1,"rgb(160,126,92)");c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  const R=ag_rnd(seed||11);for(let i=0;i<260;i++){const x=R()*W,y=y0+Math.pow(R(),0.7)*(H-y0),r=1+R()*3*(y-y0)/(H-y0)+0.5;c.fillStyle="rgba("+(R()<0.5?"90,64,42,0.18":"255,244,222,0.18")+")";c.beginPath();c.ellipse(x,y,r*2.4,r,0,0,TAU);c.fill();}
  // two soft ruts of cart wheels
  c.strokeStyle="rgba(100,72,48,0.12)";c.lineWidth=14;for(const yy of [y0+150,y0+230]){c.beginPath();c.moveTo(0,yy);c.bezierCurveTo(600,yy-10,1300,yy+12,W,yy-4);c.stroke();}}
// the temple's stepped tower, far off over the roofs: three tiers of mud brick, a shrine on top, hazy with distance
function ox_tower(c,cx,base,h){const tiers=[[1,0.42],[0.72,0.3],[0.46,0.2]],w0=h*1.3;let y=base;c.save();c.globalAlpha=0.75;
  tiers.forEach(([k,f],i)=>{const w=w0*k,th=h*f;ox_block(c,cx-w/2,y-th,w,th,0.18+i*0.04,0);c.fillStyle="rgba(70,46,26,0.12)";for(let x=cx-w/2+10;x<cx+w/2-10;x+=26)c.fillRect(x,y-th+8,8,th-16);y-=th;});
  ox_block(c,cx-w0*0.12,y-h*0.12,w0*0.24,h*0.12,0.26,0);c.fillStyle="rgba(240,232,214,0.35)";c.fillRect(cx-w0*0.66,base-h,w0*1.32,h);c.restore();}
AG_PLACES.oxStreet=c=>{const S=OX_STREET;ox_sky(c,S.base,[1700,120]);ox_tower(c,1180,S.base-300,300);
  ox_palm(c,840,S.base-250,300,0.06,31);ox_palm(c,1300,S.base-290,280,-0.08,35);ox_palm(c,1700,S.base-300,300,-0.05,37);
  for(const h of S.houses)ox_house(c,h[0],h[2],h[1],h[3],S.base);
  ox_ground(c,S.base,13);
  // soft shadows of the house fronts on the street, falling left and towards us a little
  let g=c.createLinearGradient(0,S.base,0,S.base+60);g.addColorStop(0,"rgba(70,46,26,0.22)");g.addColorStop(1,"rgba(70,46,26,0)");c.fillStyle=g;c.fillRect(0,S.base,W,60);
  for(const d of S.doors)ox_door(c,d[0],S.base,d[1]);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(50,34,20,0.14)");g.addColorStop(0.45,"rgba(50,34,20,0)");g.addColorStop(1,"rgba(255,236,200,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);};

/* the temple's courtyard: a high wall of mud brick with niched buttresses, a moulding, a deep gateway; a floor of baked brick */
AG_PLACES.oxCourt=c=>{const base=742,top=170;ox_sky(c,top+40,[1700,60]);
  const wall=mix(OX_PAL.brick,[255,246,228],0.12);c.fillStyle=rgba(wall,1);c.fillRect(0,top,W,base-top);
  // niches: deep vertical recesses in a rhythm, each lit on its left edge (the light is from the right) and shaded on its right
  for(let x=-40;x<W;x+=150){const nx=x+40,nw=56;c.fillStyle=rgba(mix(wall,[90,64,42],0.18),1);c.fillRect(nx,top+70,nw,base-top-70);
    c.fillStyle="rgba(70,46,26,0.22)";c.fillRect(nx,top+70,10,base-top-70);c.fillStyle="rgba(255,246,228,0.35)";c.fillRect(nx+nw-3,top+70,3,base-top-70);
    c.fillStyle=rgba(mix(wall,[90,64,42],0.32),1);c.fillRect(nx+18,top+110,20,base-top-110);}
  // the moulding along the top, and the parapet
  c.fillStyle=rgba(mix(wall,[255,248,232],0.2),1);c.fillRect(0,top-6,W,30);c.fillStyle="rgba(70,46,26,0.2)";c.fillRect(0,top+24,W,6);
  c.fillStyle=rgba(mix(wall,[90,64,42],0.1),1);c.fillRect(0,top+40,W,14);
  let g=c.createLinearGradient(0,top,0,base);g.addColorStop(0,"rgba(255,246,228,0.12)");g.addColorStop(1,"rgba(70,46,26,0.18)");c.fillStyle=g;c.fillRect(0,top,W,base-top);
  // the gateway on the right, deep and dark, with stepped jambs
  const gx=1480,gw=230;for(let k=0;k<3;k++){c.fillStyle=rgba(mix(wall,[60,40,26],0.12+k*0.12),1);c.fillRect(gx-k*-0-24+k*12,top+120+k*20,gw+48-k*24,base-top-120-k*20);}
  c.fillStyle="rgb(62,46,34)";c.beginPath();c.moveTo(gx+36,base);c.lineTo(gx+36,top+300);c.arc(gx+gw/2+12,top+300,gw/2-24,Math.PI,0);c.lineTo(gx+gw-12,base);c.closePath();c.fill();
  // the floor: square baked bricks in rows, receding
  g=c.createLinearGradient(0,base,0,H);g.addColorStop(0,"rgb(196,170,134)");g.addColorStop(1,"rgb(170,140,104)");c.fillStyle=g;c.fillRect(0,base,W,H-base);
  c.strokeStyle="rgba(110,80,54,0.22)";c.lineWidth=1.5;for(let y=base,k=0;y<H;k++){const d=(y-base)+40,gp=d*0.16;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();y+=gp;}
  for(let i=-30;i<40;i++){const xb=960+i*110;c.beginPath();c.moveTo(960+(xb-960)*0.42,base);c.lineTo(xb+(xb-960)*0.4,H);c.stroke();}
  g=c.createLinearGradient(0,base,0,base+70);g.addColorStop(0,"rgba(70,46,26,0.25)");g.addColorStop(1,"rgba(70,46,26,0)");c.fillStyle=g;c.fillRect(0,base,W,70);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(50,34,20,0.14)");g.addColorStop(0.45,"rgba(50,34,20,0)");g.addColorStop(1,"rgba(255,236,200,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- the stone of the laws
   A tall black stone, rounded at the top, taller than the people round it: at its top a soft relief of a standing man before a seated
   figure (a soft shape, not a copy of any relief), below it columns of small wedge marks (decoration, not a text). (x, y) is the middle
   of its foot, h its height; o.lit (a column, 0 to 5) glows softly while o.litA > 0; o.a */
function ox_stele(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=h*0.36,top=y-h;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x-w*0.25,y+4,w*0.9,h*0.04,0.4);
  // a low plinth
  ag_soft(ctx,c=>ag_rect(c,x-w*0.62,y-h*0.035,w*1.24,h*0.05,4),[150,126,98],[220,200,170],x+w*0.4,y-h*0.03,w,"rgba(60,40,24,0.35)",8);
  const sh=c=>{c.moveTo(x-w*0.5,y-h*0.03);c.lineTo(x-w*0.47,top+w*0.5);c.bezierCurveTo(x-w*0.46,top+w*0.08,x-w*0.22,top,x,top);c.bezierCurveTo(x+w*0.22,top,x+w*0.46,top+w*0.08,x+w*0.47,top+w*0.5);c.lineTo(x+w*0.5,y-h*0.03);c.closePath();};
  ag_soft(ctx,sh,[50,50,54],[150,148,148],x+w*0.32,top+h*0.3,h*0.6,"rgba(0,0,0,0.55)",30,0.55);
  ctx.save();ag_shape(ctx,sh);ctx.clip();
  // the polished stone's long soft sheen, and its edge catching the light on the right
  let g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.72,"rgba(255,255,255,0.05)");g.addColorStop(0.86,"rgba(255,250,240,0.16)");g.addColorStop(1,"rgba(255,255,255,0.02)");ctx.fillStyle=g;ctx.fillRect(x-w/2,top,w,h);
  // the relief: a slightly raised panel, a standing man (left) before a seated figure (right), soft shapes lit on their right edges
  const ry=top+h*0.06,rh=h*0.24;
  ctx.fillStyle="rgba(0,0,0,0.22)";ctx.beginPath();ctx.moveTo(x-w*0.42,ry+rh);ctx.lineTo(x-w*0.42,ry+w*0.3);ctx.bezierCurveTo(x-w*0.4,ry,x+w*0.4,ry,x+w*0.42,ry+w*0.3);ctx.lineTo(x+w*0.42,ry+rh);ctx.closePath();ctx.fill();
  // in a box 200 wide and 220 tall, its foot at (0, 0): the standing man on the left, the seated figure on the right
  const k=rh/240;ctx.save();ctx.translate(x,ry+rh*0.97);ctx.scale(k,k);
  const relief=(fn,lx,ly)=>{ctx.save();ctx.translate(-5,4);ctx.fillStyle="rgba(0,0,0,0.42)";ctx.beginPath();fn(ctx);ctx.fill();ctx.restore();
    ag_soft(ctx,fn,[84,84,90],[160,158,156],lx,ly,120,"rgba(0,0,0,0.5)",8,0.6);};
  // the standing man: a cap, a beard, a long robe, one hand raised before his face
  relief(c=>{c.moveTo(-150,0);c.lineTo(-146,-120);c.bezierCurveTo(-150,-150,-140,-170,-120,-174);c.lineTo(-96,-176);c.bezierCurveTo(-86,-170,-84,-150,-88,-120);c.lineTo(-84,0);c.closePath();},-90,-150);
  relief(c=>{c.arc(-114,-196,20,0,TAU);},-100,-206);relief(c=>{c.moveTo(-136,-212);c.bezierCurveTo(-130,-226,-100,-228,-92,-210);c.closePath();},-100,-220);
  relief(c=>{c.moveTo(-100,-168);c.bezierCurveTo(-80,-160,-70,-176,-72,-200);c.lineTo(-62,-204);c.bezierCurveTo(-58,-176,-70,-148,-96,-150);c.closePath();},-66,-190);
  // the seated figure: a tall rounded crown, a beard, a robe in tiers, on a throne, feet on a stool
  relief(c=>{c.moveTo(-10,-60);c.lineTo(24,-60);c.lineTo(24,0);c.lineTo(-10,0);c.closePath();},20,-40);
  relief(c=>{c.moveTo(20,0);c.lineTo(20,-60);c.lineTo(10,-130);c.bezierCurveTo(14,-160,40,-170,66,-166);c.bezierCurveTo(86,-160,90,-120,86,-80);c.lineTo(100,-60);c.lineTo(104,0);c.closePath();},80,-140);
  relief(c=>{c.arc(54,-188,22,0,TAU);},70,-200);relief(c=>{c.moveTo(36,-206);c.lineTo(40,-246);c.bezierCurveTo(48,-256,64,-256,70,-246);c.lineTo(74,-206);c.closePath();},66,-240);
  relief(c=>{c.moveTo(-40,0);c.lineTo(-40,-16);c.lineTo(0,-16);c.lineTo(0,0);c.closePath();},-10,-10);
  ctx.strokeStyle="rgba(0,0,0,0.3)";ctx.lineWidth=3;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(14,-60+i*-26);ctx.lineTo(92,-56+i*-26);ctx.stroke();}
  ctx.restore();
  // the wedge marks: columns of short rows of small wedges, cut into the stone (decoration, not words); o.lit glows softly
  const cols=6,c0=top+h*0.34,cw=w*0.84/cols,R=ag_rnd(17);
  for(let k=0;k<cols;k++){const cx=x+w*0.42-cw*(k+1);const lit=o.lit===k?(o.litA||0):0;
    if(lit>0){ctx.save();ctx.globalAlpha*=lit;g=ctx.createLinearGradient(cx,0,cx+cw,0);g.addColorStop(0,"rgba(240,200,140,0)");g.addColorStop(0.5,"rgba(240,200,140,0.28)");g.addColorStop(1,"rgba(240,200,140,0)");ctx.fillStyle=g;ctx.fillRect(cx,c0-6,cw,y-c0-h*0.06);ctx.restore();}
    ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,c0);ctx.lineTo(cx,y-h*0.08);ctx.stroke();
    for(let yy=c0+8;yy<y-h*0.1;yy+=h*0.018){let xx=cx+4;while(xx<cx+cw-8){const ww=h*0.006+R()*h*0.008;
        ctx.fillStyle=lit>0?"rgba(255,226,180,"+(0.2+0.4*lit)+")":"rgba(0,0,0,0.45)";ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+ww,yy-ww*0.5);ctx.lineTo(xx+ww,yy+ww*0.5);ctx.closePath();ctx.fill();
        ctx.fillStyle="rgba(255,255,255,"+(0.1+0.15*lit)+")";ctx.fillRect(xx+ww,yy-ww*0.5,1,ww);xx+=ww+3+R()*h*0.01;}}}
  ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- people of Babylon, full length
   For the wide shots: men in wrapped garments of undyed wool with fringed edges, a shawl over one shoulder, short beards and hair close to
   the head; women in long dresses with fringed shawls; children in tunics. An adult is about 7.4 heads tall, a child about 5.6.
   ox_folk(ctx, x, y, h, who, o): (x, y) the middle of the feet on the ground, h the height; who a spec from OX_FOLK; o: t, flip (face
   left), walk (0 to 1, a step cycle), speed (steps a second), near and far ([upper arm, forearm] angles in degrees from straight down,
   positive towards the way they face), or nearTo and farTo, a point [x, y] in the frame for each hand to reach; nod (radians), a. */
// each a spec the module's people.js reads too (so a close shot can use ag_person with the same face), and what this film adds: robe,
// band (the fringed edge), shawl, woman, child, short (a tunic to the knee)
const ox_robe=(c,band)=>({kind:"robe",c,band,inner:mix(c,[255,250,240],0.25),paint:(cc,P)=>ox_fringe(cc,P)});
const ox_band=(c)=>({paint:(cc,P)=>{cc.save();cc.strokeStyle=rgba(c,0.95);cc.lineWidth=12;cc.lineCap="round";cc.beginPath();cc.moveTo(216,352);cc.quadraticCurveTo(300,300,384,340);cc.stroke();cc.restore();}});
const OX_FOLK={
  owner:{name:"the owner",key:"ox-owner",skin:[184,132,96],hair:{style:"cropped",c:[38,30,26]},beard:[44,34,28],top:ox_robe([200,182,150],[150,112,78]),shawl:[176,146,108],breath:0.27},
  elder:{name:"an elder",key:"ox-elder",skin:[170,122,90],hair:{style:"cropped",c:[198,194,186]},beard:[206,202,194],top:ox_robe([168,150,122],[118,88,64]),shawl:[150,126,96],breath:0.22},
  scribe:{name:"a scribe",key:"ox-scribe",skin:[180,128,92],hair:{style:"cropped",c:[34,28,24]},beard:[40,32,26],top:ox_robe([226,218,198],[140,120,96]),shawl:[206,196,170],breath:0.26},
  passer:{name:"a passer-by",key:"ox-passer",skin:[176,124,88],hair:{style:"cropped",c:[30,26,24]},beard:[36,30,26],top:ox_robe([176,160,132],[126,98,70]),breath:0.3},
  worker:{name:"a hired worker",key:"ox-worker",skin:[160,112,80],hair:{style:"cropped",c:[34,28,24]},beard:[40,32,26],top:ox_robe([190,172,140],[140,108,76]),short:true,breath:0.3},
  stranger:{name:"a stranger",key:"ox-stranger",skin:[168,118,86],hair:{style:"cropped",c:[30,26,24]},beard:[34,28,24],top:ox_robe([110,100,92],[80,72,66]),shawl:[92,84,78],breath:0.28},
  woman:{name:"a woman",key:"ox-woman",skin:[188,138,102],hair:{style:"bun",c:[30,24,22]},earrings:[214,186,120],hat:ox_band([120,76,62]),top:ox_robe([164,106,86],[120,76,62]),shawl:[214,196,160],woman:true,breath:0.3},
  neighbour:{name:"a neighbour",key:"ox-neighbour",skin:[192,142,106],hair:{style:"bun",c:[34,28,24]},hat:ox_band([110,94,74]),top:ox_robe([150,134,112],[110,94,74]),shawl:[196,176,140],woman:true,breath:0.29},
  girl:{name:"a girl",key:"ox-girl",skin:[190,140,104],hair:{style:"bob",c:[32,26,22]},top:ox_robe([206,190,156],[160,130,96]),child:true,woman:true,breath:0.34},
  boy:{name:"a boy",key:"ox-boy",skin:[186,134,98],hair:{style:"cropped",c:[34,28,24]},top:ox_robe([184,164,130],[140,112,80]),child:true,breath:0.35}
};
// the fringe along a wrapped garment's band, in figure space (people.js's robe draws the band; this adds its fringe)
function ox_fringe(c,P){const band=P.top.band;c.save();ag_shape(c,AG_F.torso);c.clip();c.strokeStyle=rgba(mix(band,[255,246,226],0.3),0.8);c.lineWidth=2.4;c.lineCap="round";
  for(let k=0;k<16;k++){const u=k/15,q=ag_bz([396,624,350,740,250,850,120,940],u);c.beginPath();c.moveTo(q[0]-4,q[1]+6);c.lineTo(q[0]-10,q[1]+22);c.stroke();}c.restore();}
// a head from people.js (the same face as in a close shot), hu tall, its middle at (cx, cy), facing right; o: t, gaze, talk, smile
function ox_head(ctx,P,cx,cy,hu,o){o=o||{};const F=ag_fig(P),k=hu/226,t=o.t||0;ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.translate(-300,-413);
  ag_drawLayer(ctx,F.head);const blink=ag_blinkAt(t,P),by=Math.max(0.12,1-blink),g=o.gaze||[2,0];ctx.fillStyle="#1a1416";
  ctx.save();ctx.translate(334+g[0],418+g[1]);ctx.scale(1,by);ctx.beginPath();ctx.ellipse(0,0,4.8,5.6,0,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(376+g[0]*0.8,417+g[1]);ctx.scale(1,by);ctx.beginPath();ctx.ellipse(0,0,3.4,5,0,0,TAU);ctx.fill();ctx.restore();
  const tk=clamp(o.talk||0,0,1),sm=clamp(o.smile==null?0.2:o.smile,0,1);
  if(tk>0.04){ctx.fillStyle=rgba(mix(P.skin,[60,20,24],0.7),0.9);ctx.beginPath();ctx.moveTo(354,482);ctx.quadraticCurveTo(366,486-sm*3,379,480);ctx.quadraticCurveTo(368,488+tk*10,354,482);ctx.fill();}
  else{ctx.strokeStyle=F.C.line;ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(353,482-sm*1.5);ctx.quadraticCurveTo(365,486+sm*3,378,481-sm*1.5);ctx.stroke();}
  ctx.restore();}
function ox_folk(ctx,x,y,h,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const P=typeof who==="string"?OX_FOLK[who]:who,ch=!!P.child,ROBE=P.top.c,BAND=P.top.band,hu=h/(ch?5.6:7.4),t=o.t||0;
  const wk=o.walk||0,ph=t*(o.speed||1.6)*TAU,bob=wk*Math.abs(Math.sin(ph))*hu*0.05,br=Math.sin(t*1.8)*hu*0.012;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(o.flip?-1:1,1);
  ag_floorShadow(ctx,-hu*0.6,2,hu*1.3,hu*0.18,0.3);
  const top=-h+bob,sh=top+hu*1.22,wst=top+hu*(ch?2.6:3.05),hem=-hu*(P.short||ch?1.3:0.2),sw=hu*(ch?0.95:1.18),hw=hu*(ch?0.62:0.84);
  const rob=ROBE,dk=c=>mix(c,[30,18,10],0.42),lt=c=>mix(c,[255,248,232],0.35);
  // the feet (sandals) and, under a short tunic, the legs, stepping
  const step=wk*Math.sin(ph)*hu*0.35;
  for(const s of [-1,1]){const fx=s*step+(s<0?-hu*0.06:hu*0.06);
    if(P.short||ch){ag_soft(ctx,c=>ag_capsule(c,[fx*0.4,hem-hu*0.1],[fx,-hu*0.18],hu*0.26,hu*0.2),s<0?dk(P.skin):P.skin,lt(P.skin),fx+hu*0.1,hem,hu,null);}
    ctx.fillStyle=rgba(s<0?[60,44,32]:[86,64,46],1);ctx.beginPath();ctx.ellipse(fx+hu*0.12,-hu*0.06,hu*0.24,hu*0.08,0,0,TAU);ctx.fill();}
  // the far arm, behind the body
  const loc=p=>[(p[0]-x)*(o.flip?-1:1),p[1]-y];
  const arm=(near,ang,to)=>{const J=[near?-sw*0.55:sw*0.5,sh+hu*0.12],L1=hu*1.18,L2=hu*1.08;let a1=ag_rad(ang[0]),a2=ag_rad(ang[1]);
      if(to){const T_=loc(to),dx=T_[0]-J[0],dy=T_[1]-J[1],d=clamp(Math.hypot(dx,dy)-hu*0.16,hu*0.3,L1+L2-1),an=Math.atan2(dy,dx),
          al=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),e1=an+al,e2=an-al,ea=Math.sin(e1)>Math.sin(e2)?e1:e2,  // the elbow that hangs lower
          Ex=J[0]+Math.cos(ea)*L1,Ey=J[1]+Math.sin(ea)*L1,Wx=J[0]+Math.cos(an)*d,Wy=J[1]+Math.sin(an)*d;
        a1=Math.atan2(Ex-J[0],Ey-J[1]);a2=Math.atan2(Wx-Ex,Wy-Ey);}
      const E=[J[0]+Math.sin(a1)*L1,J[1]+Math.cos(a1)*L1],Wr=[E[0]+Math.sin(a2)*L2,E[1]+Math.cos(a2)*L2],col=near?rob:dk(rob);
    ag_soft(ctx,ag_armPath(J,E,Wr,[hu*0.44,hu*0.34,hu*0.26]),col,lt(col),J[0]+hu*0.3,J[1],hu*1.6,rgba(dk(rob),0.4),hu*0.2);
    ag_soft(ctx,c=>{c.ellipse(Wr[0]+Math.sin(a2)*hu*0.14,Wr[1]+Math.cos(a2)*hu*0.14,hu*0.16,hu*0.2,-a2,0,TAU);},near?P.skin:dk(P.skin),lt(P.skin),Wr[0],Wr[1],hu*0.3,null);
    return{J,E,Wr,H:[Wr[0]+Math.sin(a2)*hu*0.16,Wr[1]+Math.cos(a2)*hu*0.16]};};
  const sway=wk*Math.sin(ph)*14,far=arm(false,o.far||[-6-sway,4-sway],o.farTo);
  // the robe: from the shoulders, narrowing a little at the waist, to the hem, with a fringe at the hem
  const robe=c=>{c.moveTo(-sw*0.62,sh+hu*0.05);c.bezierCurveTo(-sw*0.2,sh-hu*0.16,sw*0.25,sh-hu*0.16,sw*0.62,sh+hu*0.05);
    c.bezierCurveTo(sw*0.66,sh+hu*0.6,hw*0.82,wst,hw*0.86,wst+hu*0.4);c.bezierCurveTo(hw*0.98,hem-hu*1.2,hw*1.02+step*0.1,hem-hu*0.4,hw*1.0+step*0.12,hem);
    c.lineTo(-hw*1.02+step*0.12,hem);c.bezierCurveTo(-hw*1.0,hem-hu*0.6,-hw*0.9,wst+hu*0.6,-hw*0.84,wst);c.bezierCurveTo(-sw*0.7,sh+hu*0.9,-sw*0.68,sh+hu*0.4,-sw*0.62,sh+hu*0.05);c.closePath();};
  ag_soft(ctx,robe,rob,lt(rob),hw*0.6,sh+hu*1.2,hu*3.2,rgba(dk(rob),0.45),hu*0.3);
  ag_folds(ctx,robe,[[[-hw*0.2,wst+hu*0.5],[-hw*0.3,wst+hu*2],[-hw*0.36,hem-hu*0.2]],[[hw*0.3,wst+hu*0.6],[hw*0.38,wst+hu*1.8],[hw*0.5,hem-hu*0.3]]],rgba(dk(rob),0.25),rgba(lt(rob),0.2));
  // the fringed edges: at the hem, and a band wrapped across from the shoulder to the hip
  ctx.save();ag_shape(ctx,robe);ctx.clip();
  ctx.strokeStyle=rgba(BAND,0.95);ctx.lineWidth=hu*0.16;ctx.beginPath();ctx.moveTo(-hw*1.1,hem-hu*0.12);ctx.lineTo(hw*1.1,hem-hu*0.12);ctx.stroke();
  if(!ch){ctx.lineWidth=hu*0.2;ctx.beginPath();ctx.moveTo(sw*0.5,sh);ctx.bezierCurveTo(sw*0.2,sh+hu*1.2,-hw*0.3,wst+hu*0.4,-hw*1.0,wst+hu*1.2);ctx.stroke();
    ctx.strokeStyle=rgba(lt(BAND),0.8);ctx.lineWidth=Math.max(1,hu*0.035);for(let k=0;k<14;k++){const u=k/13,q=ag_bz([sw*0.5,sh,sw*0.2,sh+hu*1.2,-hw*0.3,wst+hu*0.4,-hw*1.0,wst+hu*1.2],u);ctx.beginPath();ctx.moveTo(q[0],q[1]+hu*0.08);ctx.lineTo(q[0]-hu*0.03,q[1]+hu*0.24);ctx.stroke();}}
  ctx.restore();
  ctx.strokeStyle=rgba(BAND,0.9);ctx.lineWidth=Math.max(1,hu*0.04);for(let k=0;k<16;k++){const fx=lerp(-hw*1.0,hw*1.0,k/15)+step*0.12;ctx.beginPath();ctx.moveTo(fx,hem-hu*0.02);ctx.lineTo(fx-hu*0.02,hem+hu*0.12);ctx.stroke();}
  // a shawl over the shoulders
  if(P.shawl){ag_soft(ctx,c=>{c.moveTo(-sw*0.66,sh+hu*0.1);c.bezierCurveTo(-sw*0.3,sh-hu*0.2,sw*0.3,sh-hu*0.2,sw*0.66,sh+hu*0.08);c.bezierCurveTo(sw*0.6,sh+hu*0.6,sw*0.3,sh+hu*(P.woman?1.3:0.9),0,sh+hu*(P.woman?1.4:0.95));
      c.bezierCurveTo(-sw*0.36,sh+hu*1.3,-sw*0.66,sh+hu*0.7,-sw*0.66,sh+hu*0.1);c.closePath();},P.shawl,lt(P.shawl),sw*0.4,sh+hu*0.2,hu*1.6,rgba(dk(P.shawl),0.4),hu*0.2);}
  // the neck and head: in three-quarter view, facing the way they face
  const hx=hu*0.04,hy=top+hu*0.55+br;ctx.save();ctx.translate(hx,hy+hu*0.5);ctx.rotate(o.nod||0);ctx.translate(-hx,-hy-hu*0.5);
  ag_soft(ctx,c=>ag_capsule(c,[hx-hu*0.1,hy+hu*0.2],[hx-hu*0.12,sh+hu*0.04],hu*0.4,hu*0.44),dk(P.skin),P.skin,hx,hy+hu*0.5,hu*0.5,null);
  ox_head(ctx,P,hx,hy,hu,{t,gaze:o.gaze,talk:o.talk,smile:o.smile});
  ctx.restore();
  const near=arm(true,o.near||[6+sway,-4+sway],o.nearTo);
  ctx.restore();return{near,far};}

/* ---------------------------------------------------------------- things of Babylon
   A balance, silver in coils and a stone weight shaped like a sleeping duck; a basket of dates; a post and its rope; a pair of oxen at a
   yoke with a plough or a cart; a hoe; a rasp. Each in the same matte way, lit from the right. */
const OX_SILVER=[208,210,216],OX_WOOD=[150,110,76],OX_WOOD2=[118,86,58],OX_ROPE=[188,160,114];
const ox_dk=(c,k)=>mix(c,[30,18,10],k==null?0.42:k),ox_lt=(c,k)=>mix(c,[255,248,232],k==null?0.35:k);
// a coil of silver: a spiral of thick wire in three turns, seen a little from above; (x, y) its middle, r its radius
function ox_coil(ctx,x,y,r,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.lineCap="round";
  for(let k=2;k>=0;k--){const rr=r*(1-k*0.1),yy=-k*r*0.16;
    ctx.strokeStyle=rgba(mix(OX_SILVER,[70,74,84],0.5),1);ctx.lineWidth=r*0.26;ctx.beginPath();ctx.ellipse(0,yy,rr,rr*0.4,0,0,TAU);ctx.stroke();
    ctx.strokeStyle=rgba(OX_SILVER,1);ctx.lineWidth=r*0.17;ctx.beginPath();ctx.ellipse(0,yy-r*0.03,rr,rr*0.4,0,Math.PI*0.05,Math.PI*0.95);ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.85)";ctx.lineWidth=r*0.06;ctx.beginPath();ctx.ellipse(0,yy-r*0.06,rr,rr*0.4,0,Math.PI*0.15,Math.PI*0.4);ctx.stroke();}
  ctx.restore();}
// a heap of n coils in a pan whose middle is (x, y), w wide
function ox_coils(ctx,x,y,w,n){const R=ag_rnd(41),r=w*0.13;const pos=[];let row=0,left=n;
  while(left>0){const m=Math.min(left,Math.max(1,4-row));for(let i=0;i<m;i++)pos.push([x+(i-(m-1)/2)*r*1.7+(R()-0.5)*r*0.3,y-row*r*0.5-r*0.2,(R()-0.5)*0.3]);left-=m;row++;}
  for(const p of pos)ox_coil(ctx,p[0],p[1],r,p[2]);}
// a weight of polished dark stone shaped like a sleeping duck, its head turned back to lie along its body; (x, y) the middle of its
// base, w its length; it faces right
function ox_duck(ctx,x,y,w){ctx.save();ctx.translate(x,y);const k=w/200;ctx.scale(k,k);
  const body=c=>{c.moveTo(-104,-34);c.bezierCurveTo(-96,-12,-80,0,-50,0);c.lineTo(66,0);c.bezierCurveTo(96,0,108,-24,100,-46);c.bezierCurveTo(92,-70,60,-80,20,-80);c.bezierCurveTo(-30,-80,-70,-60,-104,-34);c.closePath();};
  ag_soft(ctx,body,[64,60,66],[178,176,182],56,-56,150,"rgba(0,0,0,0.5)",16);
  // the neck rising from the breast and curving back, the head resting on the back, its flat bill towards the tail
  const head=c=>{c.moveTo(96,-50);c.bezierCurveTo(104,-84,86,-112,52,-112);c.bezierCurveTo(30,-112,14,-106,0,-102);c.bezierCurveTo(-24,-98,-48,-92,-62,-86);
    c.bezierCurveTo(-54,-80,-30,-80,-4,-84);c.bezierCurveTo(20,-88,40,-90,56,-88);c.bezierCurveTo(70,-86,76,-72,74,-58);c.closePath();};
  ag_soft(ctx,head,[72,68,74],[198,196,202],60,-100,100,"rgba(0,0,0,0.45)",8);
  ctx.strokeStyle="rgba(0,0,0,0.35)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-2,-100);ctx.quadraticCurveTo(-4,-92,-2,-86);ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.32)";ctx.beginPath();ctx.ellipse(60,-60,26,7,-0.35,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(64,-104,12,4,-0.2,0,TAU);ctx.fill();
  ctx.restore();}
/* a balance hanging from a wooden stand: (x, y) the foot of the stand, s = 1 is 460 px tall with a beam 440 px wide. o.tilt -1 (the
   left pan down) to 1 (the right); o.left and o.right draw what lies in each pan: (ctx, x, y, w), y the pan's floor; o.a */
function ox_balance(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ag_floorShadow(ctx,-110,4,240,16,0.3);
  ag_soft(ctx,c=>ag_rect(c,-70,-22,140,22,8),OX_WOOD2,ox_lt(OX_WOOD2),30,-16,90,"rgba(40,26,16,0.35)",6);
  ag_soft(ctx,c=>ag_rect(c,-13,-470,26,452,8),OX_WOOD,ox_lt(OX_WOOD,0.4),8,-300,280,"rgba(40,26,16,0.4)",8);
  ag_soft(ctx,c=>ag_rect(c,-46,-484,92,22,8),OX_WOOD,ox_lt(OX_WOOD,0.4),20,-478,60,"rgba(40,26,16,0.35)",6);
  const th=clamp(o.tilt||0,-1,1)*0.17,L=220,pv=[0,-436],end=sd=>[pv[0]+sd*L*Math.cos(th),pv[1]+sd*L*Math.sin(th)];
  // the cord from the stand's arm to the beam's middle
  ctx.strokeStyle=rgba(ox_dk(OX_ROPE,0.3),1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-462);ctx.lineTo(pv[0],pv[1]);ctx.stroke();
  // the pans, each on three cords (two show), the bowl shallow and lit on its right; then the beam over the cords' tops
  const pan=(sd,fill)=>{const e=end(sd),bw=170,by=e[1]+190;ctx.strokeStyle="rgba(70,52,36,0.85)";ctx.lineWidth=2.2;
    for(const k of [-1,1]){ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.lineTo(e[0]+k*bw*0.47,by-6);ctx.stroke();}
    if(fill)fill(ctx,e[0],by,bw);
    const bowl=c=>{c.moveTo(e[0]-bw/2,by-8);c.quadraticCurveTo(e[0],by+44,e[0]+bw/2,by-8);c.quadraticCurveTo(e[0],by+6,e[0]-bw/2,by-8);c.closePath();};
    ag_soft(ctx,bowl,[170,128,84],[236,200,150],e[0]+bw*0.3,by,bw*0.6,"rgba(50,30,14,0.4)",6);
    ctx.strokeStyle="rgba(255,236,200,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e[0]-bw/2+4,by-8);ctx.quadraticCurveTo(e[0],by+2,e[0]+bw/2-4,by-8);ctx.stroke();};
  pan(-1,o.left);pan(1,o.right);
  const l=end(-1),r=end(1);ag_soft(ctx,c=>ag_capsule(c,l,r,13,13),OX_WOOD2,ox_lt(OX_WOOD2,0.45),r[0]-40,r[1]-6,200,"rgba(40,26,16,0.35)",5);
  for(const e of [l,r,pv]){ctx.fillStyle=rgba(ox_dk(OX_WOOD2,0.5),1);ctx.beginPath();ctx.arc(e[0],e[1],5,0,TAU);ctx.fill();}
  ctx.restore();}
// dates: small, glossy, red-brown; scattered from (x, y) to the right, n of them, spread over w; o.roll moves the last one along
function ox_dates(ctx,x,y,w,n,seed){const R=ag_rnd(seed||23);for(let i=0;i<n;i++){const px=x+Math.pow(R(),0.8)*w,py=y+(R()-0.4)*w*0.16,rot=(R()-0.5)*2.4,c=mix([128,62,34],[90,40,22],R());
    ctx.save();ctx.translate(px,py);ctx.rotate(rot);ctx.fillStyle="rgba(50,30,14,0.22)";ctx.beginPath();ctx.ellipse(-2,5,12,6,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.ellipse(0,0,13,7.5,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,226,190,0.55)";ctx.beginPath();ctx.ellipse(3,-3,5,2,0,0,TAU);ctx.fill();ctx.restore();}}
// a basket woven of palm leaf, (x, y) the middle of its foot, w across; spill: lying on its side, its mouth to the right, dates spilled
function ox_basket(ctx,x,y,w,spill){ctx.save();ctx.translate(x,y);const k=w/200;ctx.scale(k,k);const col=[184,150,96];
  ag_floorShadow(ctx,-110,2,240,16,0.3);
  if(spill){ox_dates(ctx,60,-4,260,22,23);
    const body=c=>{c.moveTo(-100,-10);c.bezierCurveTo(-110,-70,-60,-120,0,-122);c.lineTo(70,-118);c.lineTo(70,0);c.lineTo(-60,2);c.bezierCurveTo(-84,2,-98,-2,-100,-10);c.closePath();};
    ag_soft(ctx,body,col,ox_lt(col,0.4),30,-100,160,rgba(ox_dk(col),0.45),12);
    ctx.save();ag_shape(ctx,body);ctx.clip();ctx.strokeStyle=rgba(ox_dk(col,0.3),0.5);ctx.lineWidth=3;for(let i=-12;i<12;i++){ctx.beginPath();ctx.moveTo(-120+i*18,0);ctx.lineTo(-40+i*18,-140);ctx.stroke();}
    ctx.strokeStyle=rgba(ox_lt(col,0.5),0.4);for(let i=-12;i<12;i++){ctx.beginPath();ctx.moveTo(-120+i*18,-140);ctx.lineTo(-40+i*18,0);ctx.stroke();}ctx.restore();
    ag_soft(ctx,c=>{c.ellipse(72,-60,30,62,0,0,TAU);},ox_dk(col,0.2),ox_lt(col,0.3),86,-80,60,null);
    ctx.fillStyle="rgb(70,46,26)";ctx.beginPath();ctx.ellipse(74,-60,20,50,0,0,TAU);ctx.fill();ox_dates(ctx,64,-30,24,4,29);}
  else{const body=c=>{c.moveTo(-80,0);c.bezierCurveTo(-96,-40,-100,-90,-100,-120);c.lineTo(100,-120);c.bezierCurveTo(100,-90,96,-40,80,0);c.closePath();};
    ag_soft(ctx,body,col,ox_lt(col,0.4),60,-90,160,rgba(ox_dk(col),0.45),12);
    ctx.fillStyle="rgb(110,56,30)";ctx.beginPath();ctx.ellipse(0,-122,98,16,0,0,TAU);ctx.fill();ox_dates(ctx,-80,-128,160,10,31);}
  ctx.restore();}
// a rope: a cord along a quadratic curve with its twist showing, from p0 through the control q to p1
function ox_ropeLine(ctx,p0,q,p1,w){ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(ox_dk(OX_ROPE,0.35),1);ctx.lineWidth=w+2;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.quadraticCurveTo(q[0],q[1],p1[0],p1[1]);ctx.stroke();
  ctx.strokeStyle=rgba(OX_ROPE,1);ctx.lineWidth=w;ctx.stroke();ctx.strokeStyle=rgba(ox_dk(OX_ROPE,0.3),0.6);ctx.lineWidth=Math.max(1,w*0.22);
  const n=Math.max(4,Math.round(Math.hypot(p1[0]-p0[0],p1[1]-p0[1])/(w*1.1)));for(let i=0;i<n;i++){const u=(i+0.5)/n,bx=(1-u)*(1-u)*p0[0]+2*(1-u)*u*q[0]+u*u*p1[0],by=(1-u)*(1-u)*p0[1]+2*(1-u)*u*q[1]+u*u*p1[1];
    ctx.beginPath();ctx.moveTo(bx-w*0.3,by-w*0.35);ctx.lineTo(bx+w*0.3,by+w*0.35);ctx.stroke();}ctx.restore();}
/* a wooden post, (x, y) its foot, h tall, with a rope tied round it near the top: o.to [x, y], where the rope runs (an ox's horns), with
   o.sag; or the rope hangs loose and lies coiled at the foot */
function ox_post(ctx,x,y,h,o){o=o||{};const w=h*0.1;ag_floorShadow(ctx,x-w*1.4,y+2,w*2.6,w*0.4,0.3);
  ag_soft(ctx,c=>{c.moveTo(x-w/2,y);c.lineTo(x-w*0.46,y-h+w*0.3);c.quadraticCurveTo(x,y-h-w*0.2,x+w*0.46,y-h+w*0.3);c.lineTo(x+w/2,y);c.closePath();},OX_WOOD,ox_lt(OX_WOOD,0.4),x+w*0.3,y-h*0.6,h*0.6,"rgba(40,26,16,0.4)",8);
  ctx.strokeStyle="rgba(60,40,24,0.25)";ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x-w*0.2+i*4,y-h*0.1-i*h*0.2);ctx.lineTo(x-w*0.1+i*4,y-h*0.25-i*h*0.2);ctx.stroke();}
  const ty=y-h*0.82,rw=Math.max(6,h*0.035);ox_ropeLine(ctx,[x-w*0.55,ty-rw*0.6],[x,ty+rw*0.8],[x+w*0.55,ty-rw*0.6],rw);
  if(o.to){const sag=o.sag==null?60:o.sag,m=[(x+o.to[0])/2,(ty+o.to[1])/2+sag];ctx.save();ctx.globalAlpha*=(o.ropeA==null?1:o.ropeA);ox_ropeLine(ctx,[x-w*0.5,ty],m,o.to,rw);ctx.restore();}
  else{ox_ropeLine(ctx,[x+w*0.5,ty],[x+w*1.6,y-h*0.3],[x+w*1.2,y-rw],rw);
    for(let i=0;i<3;i++)ox_ropeLine(ctx,[x+w*0.4+i*w*0.4,y-rw*0.5],[x+w*1.6+i*w*0.5,y-rw*3-i*2],[x+w*2.6+i*w*0.4,y-rw*0.5],rw);}}
// a hoe: a long wooden handle and a broad blade; (x, y) where the blade rests on the ground, leaning back at ang (radians from upright)
function ox_hoe(ctx,x,y,len,ang){ctx.save();ctx.translate(x,y);ctx.rotate(-ang);
  ag_soft(ctx,c=>ag_capsule(c,[0,-20],[0,-len],len*0.035,len*0.03),OX_WOOD,ox_lt(OX_WOOD,0.4),len*0.02,-len*0.5,len*0.6,"rgba(40,26,16,0.4)",4);
  ag_soft(ctx,c=>{c.moveTo(-len*0.03,-len*0.09);c.lineTo(len*0.05,-len*0.1);c.bezierCurveTo(len*0.14,-len*0.07,len*0.2,-len*0.03,len*0.22,0);c.lineTo(-len*0.03,0);c.closePath();},[112,84,62],[196,170,140],len*0.12,-len*0.05,len*0.22,"rgba(40,26,16,0.35)",4);
  ctx.restore();}
// a rasp: a flat bar of copper, its face cut with rows of teeth, and a wooden grip; (x, y) the grip's end, ang its angle, len its length
function ox_rasp(ctx,x,y,len,ang){ctx.save();ctx.translate(x,y);ctx.rotate(ang);
  ag_soft(ctx,c=>ag_capsule(c,[0,0],[len*0.36,0],len*0.11,len*0.1),OX_WOOD,ox_lt(OX_WOOD,0.4),len*0.2,-len*0.04,len*0.3,null);
  ag_soft(ctx,c=>ag_rect(c,len*0.34,-len*0.05,len*0.66,len*0.1,len*0.03),[176,120,84],[236,190,150],len*0.7,-len*0.04,len*0.5,"rgba(60,30,14,0.4)",3);
  ctx.strokeStyle="rgba(70,40,20,0.55)";ctx.lineWidth=1.4;for(let i=0;i<12;i++){const xx=len*0.38+i*len*0.05;ctx.beginPath();ctx.moveTo(xx,-len*0.04);ctx.lineTo(xx+len*0.025,len*0.04);ctx.stroke();}
  ctx.restore();}
/* a cart on two solid wheels, each three planks held by battens round a hub: (x, y) the ground under the wheel, s = 1 a wheel 150 px
   across; o.roll (radians), o.jars (how many); the pole runs forward from the bed to o.to [x, y] */
function ox_cart(ctx,x,y,s,o){o=o||{};const r=75*s,cx=x,cy=y-r;
  if(o.to){ag_soft(ctx,c=>ag_capsule(c,[cx+r*0.6,cy-r*0.55],o.to,10*s,8*s),OX_WOOD2,ox_lt(OX_WOOD2,0.4),cx+r,cy-r,r*3,null);}
  // the bed: a box of planks, its side lit on the right; jars standing in it
  const bx=cx-r*1.5,bw=r*2.6,bt=cy-r*1.0,bh=r*0.62;
  const R=ag_rnd(51);for(let i=0;i<(o.jars||3);i++){const jx=bx+bw*(0.2+i*0.28),jh=r*(0.9+R()*0.2),jw=r*0.48;
    ag_soft(ctx,c=>{c.moveTo(jx-jw*0.24,bt-jh);c.lineTo(jx+jw*0.24,bt-jh);c.bezierCurveTo(jx+jw*0.3,bt-jh*0.8,jx+jw*0.62,bt-jh*0.66,jx+jw*0.5,bt-jh*0.2);c.lineTo(jx+jw*0.4,bt+4);c.lineTo(jx-jw*0.4,bt+4);c.lineTo(jx-jw*0.5,bt-jh*0.2);c.bezierCurveTo(jx-jw*0.62,bt-jh*0.66,jx-jw*0.3,bt-jh*0.8,jx-jw*0.24,bt-jh);c.closePath();},
      [186,120,82],[236,186,140],jx+jw*0.3,bt-jh*0.6,jh,"rgba(70,36,18,0.4)",6);
    ctx.fillStyle="rgba(70,40,22,0.5)";ctx.beginPath();ctx.ellipse(jx,bt-jh,jw*0.24,jw*0.07,0,0,TAU);ctx.fill();}
  ag_soft(ctx,c=>ag_rect(c,bx,bt,bw,bh,6*s),OX_WOOD,ox_lt(OX_WOOD,0.4),bx+bw*0.8,bt+bh*0.3,bw*0.6,"rgba(40,26,16,0.4)",6);
  ctx.strokeStyle="rgba(50,32,18,0.3)";ctx.lineWidth=Math.max(1,2*s);for(let k=1;k<3;k++){ctx.beginPath();ctx.moveTo(bx,bt+bh*k/3);ctx.lineTo(bx+bw,bt+bh*k/3);ctx.stroke();}
  // the near wheel: three planks, two battens, a round hub; it turns
  ag_floorShadow(ctx,cx-r,y+2,r*2,r*0.14,0.3);
  ag_soft(ctx,c=>{c.arc(cx,cy,r,0,TAU);},[136,100,68],[210,170,124],cx+r*0.4,cy-r*0.3,r*1.4,"rgba(40,26,16,0.45)",10*s);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(o.roll||0);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.clip();ctx.strokeStyle="rgba(50,32,18,0.4)";ctx.lineWidth=Math.max(1,2.5*s);
  for(const k of [-1,1]){ctx.beginPath();ctx.moveTo(k*r*0.34,-r);ctx.lineTo(k*r*0.34,r);ctx.stroke();}
  ctx.fillStyle="rgba(90,64,42,0.8)";for(const k of [-1,1])ctx.fillRect(-r,k*r*0.5-5*s,r*2,10*s);ctx.restore();
  ag_soft(ctx,c=>{c.arc(cx,cy,r*0.2,0,TAU);},OX_WOOD2,ox_lt(OX_WOOD2,0.4),cx+r*0.08,cy-r*0.08,r*0.3,null);}
/* a yoked pair of oxen, walking to the right with a plough or a cart behind and a man with them: (x, y) the ground under the near ox,
   s its size. o.t; o.walk (0 to 1); o.horns; o.what "plough" or "cart"; o.man (a spec from OX_FOLK, or none) at the plough;
   o.lead (another) walking ahead, leading them by a rope; returns where the near ox's horns are */
function ox_team(ctx,x,y,s,o){o=o||{};const t=o.t||0,walk=o.walk==null?0.7:o.walk,what=o.what||"plough";
  const fx=x+70*s,fy=y-52*s,fs=s*0.96;
  ox_cattle(ctx,fx,fy,fs,{t:t+0.4,walk,horns:o.horns,far:true,chew:o.chew});
  // the yoke's middle, over the two necks; the pole from it back to what they pull, hidden by the near ox
  const yn=[x+178*s,y-364*s],yf=[fx+178*fs,fy-364*fs],ym=[(yn[0]+yf[0])/2,(yn[1]+yf[1])/2];
  if(what==="plough"){const sh=[x-470*s,y+4*s],jt=[sh[0]-96*s,sh[1]-64*s],hd=[sh[0]-196*s,sh[1]-262*s];   // the share's point, where the beam joins, the grip
    ag_soft(ctx,c=>ag_capsule(c,ym,jt,14*s,12*s),OX_WOOD2,ox_lt(OX_WOOD2,0.4),ym[0],ym[1],600*s,null);
    // the handle, from the sole up and back to a short grip across it
    ag_soft(ctx,c=>ag_capsule(c,[sh[0]-120*s,sh[1]-12*s],hd,20*s,14*s),OX_WOOD,ox_lt(OX_WOOD,0.4),hd[0]+30*s,hd[1]+60*s,300*s,"rgba(40,26,16,0.35)",5);
    // the sole along the ground, its pointed share cutting in, and the earth it turns
    ag_soft(ctx,c=>{c.moveTo(sh[0]+30*s,sh[1]);c.lineTo(sh[0]-140*s,sh[1]-30*s);c.lineTo(sh[0]-150*s,sh[1]-6*s);c.lineTo(sh[0]-20*s,sh[1]+10*s);c.closePath();},OX_WOOD2,ox_lt(OX_WOOD2,0.4),sh[0]-20*s,sh[1]-20*s,160*s,"rgba(40,26,16,0.4)",4);
    ag_soft(ctx,c=>{c.moveTo(sh[0]+44*s,sh[1]+4*s);c.lineTo(sh[0]-10*s,sh[1]-14*s);c.lineTo(sh[0]-14*s,sh[1]+8*s);c.closePath();},[138,112,90],[214,196,170],sh[0]+20*s,sh[1]-6*s,50*s,null);
    ctx.fillStyle="rgba(96,68,44,0.6)";for(let i=0;i<7;i++){const u=i/6;ctx.beginPath();ctx.ellipse(sh[0]+20*s-u*120*s,sh[1]-4*s-Math.sin(u*Math.PI)*10*s,(18-u*8)*s,(7-u*3)*s,0,0,TAU);ctx.fill();}
    const grip=[[hd[0]-22*s,hd[1]+12*s],[hd[0]+20*s,hd[1]-8*s]];
    if(o.man){const mh=480*s,mx=hd[0]-74*s;ox_folk(ctx,mx,y+10*s,mh,o.man,{t,walk:walk*0.9,speed:0.55,nearTo:grip[0],farTo:grip[1]});}
    ag_soft(ctx,c=>ag_capsule(c,grip[0],grip[1],12*s,12*s),OX_WOOD2,ox_lt(OX_WOOD2,0.45),hd[0],hd[1]-6*s,60*s,null);}
  else{ox_cart(ctx,x-560*s,y+4*s,s*1.1,{to:ym,roll:-(t*98*s*walk)/(75*s*1.1),jars:3});}
  ox_cattle(ctx,x,y,s,{t,walk,horns:o.horns,chew:o.chew});
  // the yoke over both necks, and its strap round the near ox's neck
  ag_soft(ctx,c=>ag_capsule(c,[yn[0]-10*s,yn[1]+8*s],[yf[0]+8*s,yf[1]-8*s],30*s,26*s),OX_WOOD2,ox_lt(OX_WOOD2,0.45),yn[0]+16*s,yn[1]-10*s,90*s,"rgba(40,26,16,0.4)",5);
  ctx.strokeStyle=rgba(ox_dk(OX_ROPE,0.25),1);ctx.lineWidth=9*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(yn[0]-6*s,yn[1]+10*s);ctx.quadraticCurveTo(yn[0]+30*s,yn[1]+70*s,yn[0]+58*s,yn[1]+108*s);ctx.stroke();
  if(o.lead){const mh=480*s,m=ox_folk(ctx,x+640*s,y+40*s,mh,o.lead,{t,walk:walk*0.9,speed:0.55,near:[-34,-18],gaze:[-3,0]});
    const H_=[x+640*s+m.near.H[0],y+40*s+m.near.H[1]];ox_ropeLine(ctx,[x+262*s,y-334*s],[(H_[0]+x+262*s)/2,Math.max(H_[1],y-334*s)+60*s],H_,7*s);}
  return{horn:[x+350*s,y-458*s]};}

// the sun, low and soft: a warm disc with a wide glow; a glint on a sharp point
function ox_sun(ctx,x,y,r,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const g=ctx.createRadialGradient(x,y,r*0.6,x,y,r*4);g.addColorStop(0,"rgba(250,200,120,0.55)");g.addColorStop(1,"rgba(250,200,120,0)");
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*4,0,TAU);ctx.fill();const d=ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r);d.addColorStop(0,"rgb(255,240,200)");d.addColorStop(1,"rgb(246,190,110)");
  ctx.fillStyle=d;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
function ox_glint(ctx,x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.fillStyle="rgba(255,252,240,0.95)";for(const r of [0,Math.PI/2]){ctx.save();ctx.rotate(r+0.3);
  ctx.beginPath();ctx.moveTo(-s,0);ctx.quadraticCurveTo(0,-s*0.08,s,0);ctx.quadraticCurveTo(0,s*0.08,-s,0);ctx.fill();ctx.restore();}ctx.beginPath();ctx.arc(0,0,s*0.12,0,TAU);ctx.fill();ctx.restore();}
// where an ox's near horn tip is, in the frame, for an ox drawn at (x, y), size s, head lowered by hd (as ox_cattle turns it)
function ox_hornTip(x,y,s,hd,blunt,flip){const p=blunt?ox_cut([242,-338,300,-356,352,-394,350,-458],0.84):[242,-338,300,-356,352,-394,350,-458],e=ag_bz(p,1),
    an=hd*0.66,dx=e[0]-226,dy=e[1]+312,rx=226+dx*Math.cos(an)-dy*Math.sin(an),ry=-312+dx*Math.sin(an)+dy*Math.cos(an);return[x+(flip?-rx:rx)*s,y+ry*s];}
// a plough left lying at the end of its furrows: the handle down on the earth, the beam along it
function ox_ploughIdle(ctx,x,y,s){ag_floorShadow(ctx,x-60*s,y+4*s,220*s,14*s,0.3);
  ag_soft(ctx,c=>ag_capsule(c,[x-260*s,y-14*s],[x+150*s,y-30*s],14*s,12*s),OX_WOOD2,ox_lt(OX_WOOD2,0.4),x,y-30*s,300*s,"rgba(40,26,16,0.35)",4);
  ag_soft(ctx,c=>ag_capsule(c,[x+60*s,y-6*s],[x-200*s,y-46*s],18*s,13*s),OX_WOOD,ox_lt(OX_WOOD,0.4),x-60*s,y-40*s,200*s,"rgba(40,26,16,0.35)",5);
  ag_soft(ctx,c=>{c.moveTo(x+170*s,y);c.lineTo(x+20*s,y-26*s);c.lineTo(x+10*s,y-4*s);c.lineTo(x+150*s,y+8*s);c.closePath();},OX_WOOD2,ox_lt(OX_WOOD2,0.4),x+100*s,y-14*s,120*s,null);}
/* a hired worker with a hoe, working the earth: (x, y) the feet, h the height; ph the swing (0 to 1 a stroke, the hoe raised at 0.3
   and striking at 0.75) */
function ox_hoer(ctx,x,y,h,ph,o){o=o||{};const sw=ph%1,k=sw<0.55?ag_sine(sw/0.55):1-ag_sine((sw-0.55)/0.45),th=ag_rad(lerp(40,155,k)),L=h*0.62,
    G=[x+h*0.16,y-h*0.5-k*h*0.06],D=[Math.sin(th),Math.cos(th)],B=[G[0]+D[0]*L,G[1]+D[1]*L],N=[G[0]+D[0]*L*0.2,G[1]+D[1]*L*0.2];
  const handle=()=>{ag_soft(ctx,c=>ag_capsule(c,[G[0]-D[0]*h*0.04,G[1]-D[1]*h*0.04],B,h*0.024,h*0.02),OX_WOOD,ox_lt(OX_WOOD,0.4),B[0],B[1],L,null);
    ctx.save();ctx.translate(B[0],B[1]);ctx.rotate(Math.atan2(D[1],D[0]));ag_soft(ctx,c=>{c.moveTo(-h*0.02,-h*0.02);c.lineTo(h*0.05,-h*0.03);c.lineTo(h*0.06,h*0.1);c.lineTo(-h*0.02,h*0.09);c.closePath();},[112,84,62],[196,170,140],h*0.03,0,h*0.1,null);ctx.restore();};
  handle();ox_folk(ctx,x,y,h,o.who||"worker",{t:o.t,nearTo:N,farTo:G,nod:0.12+k*-0.1});}
