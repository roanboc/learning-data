/* ===== Rules and expectations the business owns: scenes =====
   Nine chapters, as in ../script.md. The qanats of Iran, as H. E. Wulff and Paul Ward English tell them: at Sehdeh, three hamlets,
   Dastgerd, Parvar and Karton, took their water from one qanat, through a basin with three outlets; a qanat's flow rises and falls with
   the water underground, drought came about one year in four, and silt washed into the tunnel every year; in the 1600s an engineer of
   Shah Abbas the Great set their shares, eight, eight and nine, built into the outlets as their widths, so whatever came in left in the
   same shares; the muqannis cleared the silt, and the mirab, paid with a free share, kept each farmer's turn; more than three hundred
   years on, the hamlets still took those shares. Then Tomás's next note: what the business expects of each concept; a policy carried out
   by processes, procedures and records; the rules a decision applies, in a table beside the flow; a reading late only against the step
   that needs it; the owners write billing's expectation down, and the check is built from it; the source checks its own data first;
   the data product and its contract; and the end of the story: deep wells, and about half of Iran's qanats run dry.
   The story's pictures (the qanat cut away, the village, its people) are the series' own, in ../../../shared/src/ba.js; Sehdeh from
   above, its basin and outlets, and the deep well are drawn here. Made to read on a phone (tools/legible.py): text is at least 28 px
   in the frame; what's drawn small is texture. Motion: the camera glides between what the narration names and things arrive with a
   spring; in one room nothing is cut, what moves slides there, and what leaves goes before what comes in. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

const B5_MOT=LAY6[0][1];
// a requirement's glyph, as Rules with a home draws a rule: a parallelogram
function b5_req(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,s*0.12);ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-s*0.75,y+s*0.42);ctx.lineTo(x-s*0.38,y-s*0.42);
  ctx.lineTo(x+s*0.78,y-s*0.42);ctx.lineTo(x+s*0.41,y+s*0.42);ctx.closePath();ctx.stroke();ctx.restore();}
// a tick or a cross in a ring, in a check's own colour (green passes, red fails), drawn in by a
function b5_mark(ctx,x,y,r,ok,a){if(a<=0.01)return;const col=ok?BA_OK:BA_RED;withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,col,0.3);ctx.fillStyle="rgba(8,14,12,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.lineCap="round";ctx.lineWidth=4;ctx.beginPath();
  if(ok){ctx.moveTo(x-r*0.45,y+r*0.02);ctx.lineTo(x-r*0.1,y+r*0.38);ctx.lineTo(x+r*0.5,y-r*0.36);}else{ctx.moveTo(x-r*0.38,y-r*0.38);ctx.lineTo(x+r*0.38,y+r*0.38);ctx.moveTo(x+r*0.38,y-r*0.38);ctx.lineTo(x-r*0.38,y+r*0.38);}ctx.stroke();});}

/* ---------- 1. Eight, eight and nine ---------- */
// Sehdeh from above: the mountains top left; the qanat's chain of shafts; where its water comes to light; the open channel to the
// basin; and the basin's three outlets, each with its channel to a hamlet, its fields and its houses. The outlets are gaps in the
// basin's right wall, as wide as each hamlet's share: eight spans, eight, and nine (B5_U pixels to a span).
const B5_CHAIN=(()=>{const P_=[];for(let i=0;i<=13;i++){const u=i/13;P_.push([lerp(150,770,u)+Math.sin(u*Math.PI)*-30,lerp(130,486,u)+Math.sin(u*Math.PI*1.1)*26]);}return P_;})();
const B5_MZ=[792,498],B5_BX=930,B5_BY=500,B5_BW=150,B5_BH=124,B5_SH=[8,8,9],B5_U=3.4,B5_OY=[524,562,602],B5_WX=B5_BX+B5_BW;
const B5_IN=[B5_MZ,[860,532],[B5_BX,560]];
// each hamlet: its name, its channel from its outlet, its fields (x, y, columns, rows), its houses and domes, and where its name sits
const B5_HAM=[
  {name:"Dastgerd",ch:[[B5_WX,524],[1170,500],[1260,410],[1380,312]],f:[1388,246,3,2],h:[[1640,214,60,44],[1708,238,52,50],[1662,282,66,40],[1744,300,56,42],[1600,300,48,38],[1780,222,50,40]],d:[[1700,296,18],[1622,250,15]],lab:[1700,170]},
  {name:"Parvar",ch:[[B5_WX,562],[1200,568],[1320,590],[1420,600]],f:[1428,556,3,2],h:[[1690,540,62,46],[1760,566,54,48],[1700,610,66,40],[1784,632,52,40],[1660,650,56,38]],d:[[1744,612,18],[1676,586,15]],lab:[1740,500]},
  {name:"Karton",ch:[[B5_WX,602],[1150,650],[1180,720],[1190,770]],f:[1196,740,3,2],h:[[1458,742,60,44],[1528,760,54,48],[1470,806,66,38],[1550,818,52,40],[1430,800,40,36]],d:[[1520,806,17]],lab:[1500,700]}];
const B5_FW=72,B5_FH=52,B5_FG=8;
function b5_path(ctx,P_){ctx.beginPath();P_.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));}
// st: flow (0..1) what comes into the basin; take (0..1) Dastgerd taking more than its share; wet[i] (0..1) each hamlet's fields;
// lit (0..1) the chain of shafts lit, litP how far along; span (0..1) the outlets measured, in spans; outHi[i] an outlet lit; run
// (0..1) the water running in at the start; dry (0..1) the bed dry, for a qanat nobody kept
function b5_plain(ctx,t,st){const X0=-1400,X1=3300,Y0=-900,Y1=2000;
  const g=ctx.createLinearGradient(0,-200,0,1300);g.addColorStop(0,"rgba(176,130,86,1)");g.addColorStop(0.5,"rgba(204,156,104,1)");g.addColorStop(1,"rgba(160,116,78,1)");ctx.fillStyle=g;ctx.fillRect(X0,Y0,X1-X0,Y1-Y0);
  ctx.save();ctx.strokeStyle="rgba(255,236,200,0.05)";ctx.lineWidth=10;for(let i=0;i<34;i++){const y=-260+i*52;ctx.beginPath();for(let x=-400;x<=2400;x+=80){const yy=y+Math.sin(x*0.004+i*0.7)*18+x*0.08;x===-400?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}ctx.restore();
  for(let i=0;i<22;i++){const x=hash(i,611)*2200-140,y=hash(i,612)*1200-60,r=60+hash(i,613)*160,gg=ctx.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,"rgba(70,46,30,"+(0.06+0.06*hash(i,614))+")");gg.addColorStop(1,"rgba(70,46,30,0)");ctx.fillStyle=gg;ctx.fillRect(x-r,y-r,2*r,2*r);}
  // the mountains, top left, seen from high above: a dark mass, its ridges lit towards the sun
  const mg=ctx.createRadialGradient(-300,-300,80,-300,-300,980);mg.addColorStop(0,"rgba(96,66,52,0.95)");mg.addColorStop(0.55,"rgba(132,94,68,0.6)");mg.addColorStop(1,"rgba(150,110,76,0)");ctx.fillStyle=mg;ctx.fillRect(-1400,-900,2400,2000);
  const ridge=(P_,w0)=>{for(let i=1;i<P_.length;i++){const[x0,y0]=P_[i-1],[x1,y1]=P_[i],w=w0*(1-0.55*i/P_.length);
      ctx.strokeStyle="rgba(52,34,28,0.42)";ctx.lineWidth=w*1.7;ctx.beginPath();ctx.moveTo(x0+w*0.55,y0+w*0.65);ctx.lineTo(x1+w*0.55,y1+w*0.65);ctx.stroke();
      ctx.strokeStyle="rgba(222,178,130,0.5)";ctx.lineWidth=w*0.6;ctx.beginPath();ctx.moveTo(x0-w*0.3,y0-w*0.3);ctx.lineTo(x1-w*0.3,y1-w*0.3);ctx.stroke();}};
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  [[[-820,-560],[-560,-400],[-330,-260],[-110,-130],[90,-40],[230,40]],[[-360,-700],[-170,-470],[-10,-310],[150,-190],[300,-110]],[[-980,-160],[-700,-80],[-470,6],[-260,110]]].forEach((sp,j)=>{
    for(let i=1;i<sp.length;i++){const[x0,y0]=sp[i-1],[x1,y1]=sp[i],dx=x1-x0,dy=y1-y0,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,nx=-uy,ny=ux;
      for(let k=0;k<3;k++){const u=(k+0.5)/3,bx=lerp(x0,x1,u),by=lerp(y0,y1,u);[-1,1].forEach(sd=>{const L=(80+80*hash(i*7+k+j*31,sd+15))*(1-0.1*i);
        ridge([[bx,by],[bx+nx*sd*L*0.55+ux*L*0.3,by+ny*sd*L*0.55+uy*L*0.3],[bx+nx*sd*L+ux*L*0.55,by+ny*sd*L+uy*L*0.55]],11);});}}
    ridge(sp,24);});
  ctx.restore();
  // the chain of shafts: rings of dug earth with dark mouths, lit as the narration names the qanat
  const lit=st.lit||0;B5_CHAIN.forEach(([x,y],i)=>{const r=i===0?16:12-4*i/13;ctx.fillStyle="rgba(60,40,26,0.28)";ctx.beginPath();ctx.ellipse(x+4,y+5,r*1.15,r,0,0,TAU);ctx.fill();
    const rg=ctx.createRadialGradient(x-r*0.3,y-r*0.3,1,x,y,r*1.1);rg.addColorStop(0,"rgba(236,204,160,1)");rg.addColorStop(1,"rgba(184,140,98,1)");ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(34,22,16,0.92)";ctx.beginPath();ctx.arc(x,y,r*0.34,0,TAU);ctx.fill();
    if(lit>0.01){const v=lit*clamp(((st.litP==null?1:st.litP)*14-i),0,1);if(v>0.01)glow(ctx,x,y,r*2.6,BAC,0.34*v);}});
  // how much water comes in, and how it leaves: in the shares of the outlets, or more for Dastgerd when it takes more
  const fl=st.flow==null?1:st.flow,run=st.run==null?1:st.run,tk=st.take||0,sh=[B5_SH[0]+8*tk,B5_SH[1],B5_SH[2]],ss=sh[0]+sh[1]+sh[2],Win=18*fl;
  const bed=(P_,w)=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="rgba(96,64,40,0.62)";ctx.lineWidth=w;b5_path(ctx,P_);ctx.stroke();ctx.restore();};
  const water=(P_,w,u,sp)=>{if(w<0.4||u<=0.01)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";const pts=mk(P_.map(([x,y])=>P(x,y))),e=at(pts,u);
    ctx.strokeStyle=rgba(BA_WATER,0.95);ctx.lineWidth=w;ctx.shadowColor=rgba(BA_WATER,0.6);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(P_[0][0],P_[0][1]);let d=0;
    for(let i=1;i<P_.length;i++){const sl=Math.hypot(P_[i][0]-P_[i-1][0],P_[i][1]-P_[i-1][1]);if(d+sl<=u*pts.total){ctx.lineTo(P_[i][0],P_[i][1]);d+=sl;}else{ctx.lineTo(e.x,e.y);break;}}ctx.stroke();ctx.shadowBlur=0;
    for(let k=0;k<6;k++){const v=((t*(sp||0.08)+k/6)%1)*u,q=at(pts,v);ctx.fillStyle="rgba(232,248,255,0.55)";ctx.beginPath();ctx.ellipse(q.x,q.y,Math.max(2,w*0.5),Math.max(1,w*0.16),0,0,TAU);ctx.fill();}ctx.restore();};
  bed(B5_IN,22);B5_HAM.forEach(hm=>bed(hm.ch,16));
  water(B5_IN,Win,clamp(run*1.6,0,1),0.1);
  // the fields, each hamlet's, fed from the end of its channel
  B5_HAM.forEach((hm,i)=>{const[fx,fy,nc,nr]=hm.f,wt=clamp(st.wet?st.wet[i]:0.8,0,1),c=mix(BA_DRY,BA_GREEN,wt);
    for(let r=0;r<nr;r++)for(let k=0;k<nc;k++){const x=fx+k*(B5_FW+B5_FG),y=fy+r*(B5_FH+B5_FG);ctx.fillStyle="rgba(60,40,26,0.3)";ctx.fillRect(x+4,y+5,B5_FW,B5_FH);ctx.fillStyle=rgba(c,1);ctx.fillRect(x,y,B5_FW,B5_FH);
      ctx.strokeStyle=rgba(mix(c,[40,30,20],0.4),0.7);ctx.lineWidth=2;for(let q=1;q<4;q++){ctx.beginPath();ctx.moveTo(x+6,y+q*B5_FH/4);ctx.lineTo(x+B5_FW-6,y+q*B5_FH/4);ctx.stroke();}
      ctx.strokeStyle="rgba(70,48,30,0.6)";ctx.lineWidth=3;ctx.strokeRect(x,y,B5_FW,B5_FH);}});
  // the water out of each outlet, in its share
  B5_HAM.forEach((hm,i)=>water(hm.ch,Win*sh[i]/ss*2.2,clamp(run*1.6-0.6,0,1),0.12));
  // trees by the channels and the houses
  [[1610,190,22],[1586,340,18],[1836,262,20],[1660,520,20],[1836,590,22],[1640,690,18],[1420,700,20],[1600,770,18],[1396,860,18],[1252,420,16],[1330,520,14]].forEach(([x,y,r])=>{ctx.fillStyle="rgba(40,30,20,0.32)";ctx.beginPath();ctx.ellipse(x+r*0.4,y+r*0.5,r,r*0.86,0,0,TAU);ctx.fill();
    const tg=ctx.createRadialGradient(x-r*0.35,y-r*0.4,2,x,y,r);tg.addColorStop(0,"rgba(150,190,104,1)");tg.addColorStop(1,"rgba(56,96,52,1)");ctx.fillStyle=tg;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();});
  B5_HAM.forEach(hm=>{hm.h.forEach(([x,y,w,h])=>{ctx.fillStyle="rgba(50,34,22,0.34)";ctx.fillRect(x+6,y+7,w,h);const hg=ctx.createLinearGradient(x,y,x+w,y+h);hg.addColorStop(0,"rgba(232,196,150,1)");hg.addColorStop(1,"rgba(196,154,110,1)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,h);
      ctx.strokeStyle="rgba(120,86,58,0.6)";ctx.lineWidth=2;ctx.strokeRect(x+3,y+3,w-6,h-6);});
    hm.d.forEach(([x,y,r])=>{ctx.fillStyle="rgba(50,34,22,0.34)";ctx.beginPath();ctx.arc(x+5,y+6,r,0,TAU);ctx.fill();const dg=ctx.createRadialGradient(x-r*0.4,y-r*0.4,1,x,y,r);dg.addColorStop(0,"rgba(246,220,180,1)");dg.addColorStop(1,"rgba(186,144,104,1)");ctx.fillStyle=dg;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();});});
  // the basin: a rim of stone and lime, its water inside, and the three outlets in its right wall
  const bx=B5_BX,by=B5_BY,bw=B5_BW,bh=B5_BH,wall=12;ctx.fillStyle="rgba(60,40,26,0.35)";rr(ctx,bx+6,by+8,bw,bh,14);ctx.fill();
  ctx.fillStyle="rgba(214,190,156,1)";rr(ctx,bx,by,bw,bh,14);ctx.fill();
  const wg=ctx.createLinearGradient(bx,by,bx+bw,by+bh);wg.addColorStop(0,rgba(mix(BA_WATER,[40,90,140],0.25),run>0.05?0.95:0.25));wg.addColorStop(1,rgba(mix(BA_WATER,[30,70,120],0.45),run>0.05?0.95:0.25));
  ctx.fillStyle=run>0.05?wg:"rgba(120,90,60,1)";ctx.fillRect(bx+wall,by+wall,bw-2*wall,bh-2*wall);
  if(run>0.05)for(let k=0;k<7;k++){const u=(t*0.18+k/7)%1,yy=by+wall+8+k*((bh-2*wall-16)/6);ctx.strokeStyle="rgba(230,248,255,"+(0.28*Math.sin(u*Math.PI))+")";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx+wall+10+u*40,yy);ctx.lineTo(bx+wall+60+u*40,yy);ctx.stroke();}
  // the right wall, cut by the outlets, each as wide as its share
  ctx.fillStyle="rgba(214,190,156,1)";ctx.fillRect(B5_WX-wall,by,wall,bh);
  B5_OY.forEach((oy,i)=>{const hw=B5_SH[i]*B5_U/2,oh=st.outHi?st.outHi[i]||0:0,tkA=i===0?tk:0;ctx.fillStyle=run>0.05?rgba(BA_WATER,0.95):"rgba(120,90,60,1)";ctx.fillRect(B5_WX-wall-1,oy-hw,wall+2,hw*2);
    if(oh>0.01){ctx.strokeStyle=rgba([255,236,190],0.9*oh);ctx.lineWidth=2.5;ctx.strokeRect(B5_WX-wall-3,oy-hw-2,wall+6,hw*2+4);glow(ctx,B5_WX-wall/2,oy,40,[255,236,190],0.3*oh);}
    if(tkA>0.01){ctx.strokeStyle=rgba(AMBER,0.95*tkA);ctx.lineWidth=3;ctx.strokeRect(B5_WX-wall-4,oy-hw-3,wall+8,hw*2+6);glow(ctx,B5_WX,oy,46,AMBER,0.35*tkA);}});
  ctx.strokeStyle="rgba(120,92,62,0.85)";ctx.lineWidth=2;rr(ctx,bx,by,bw,bh,14);ctx.stroke();ctx.strokeStyle="rgba(120,92,62,0.6)";ctx.strokeRect(bx+wall,by+wall,bw-2*wall,bh-2*wall);
  // the outlets measured: a rod across each, a tick for each span
  const sp=st.span||0;if(sp>0.01)B5_OY.forEach((oy,i)=>{const n=B5_SH[i],hw=n*B5_U/2,x=B5_WX+10,q=clamp(sp*1.6-i*0.3,0,1);if(q<=0)return;withA(ctx,q,()=>{ctx.strokeStyle="rgba(60,40,26,0.95)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x,oy-hw);ctx.lineTo(x,oy+hw);ctx.stroke();
      for(let k=0;k<=n;k++){const y=oy-hw+k*B5_U,L=k%n===0?6:3.2;ctx.lineWidth=k%n===0?1.8:1.1;ctx.beginPath();ctx.moveTo(x-L,y);ctx.lineTo(x+L,y);ctx.stroke();}});});}
// where an outlet sits, for a tag to point at it
const b5_outAt=i=>[B5_WX+6,B5_OY[i]];

// the qanat cut away, with its silt, its diggers, its village, its gates, its owners and the mirab, as Who creates it, who owns it and
// What the business owns draw it; st: water (stretches holding water), blockA (the silt, 0..1), wet/fill/gate (each field), chFrom/chTo
// (the channel), dig (the diggers), bucket (0..1, the bucket's way up), mirab (0..1), own (the owners, 0..1 each); drop (0..1): the
// water underground fallen, as the deep wells drew it down; well (0..1) the deep well and its pump; pump (0..1) its water
const B5_GATES=BA_VFIELDS.map(([x])=>x-6),B5_MIRAB=B5_GATES[2]-16,B5_S=0.14,B5_SILT=900,B5_WELL=1010;
const B5_OWNERS=[[1640,-1,{dress:"robe",head:"turban"}],[1790,1,{dress:"tunic",head:"cap"}],[1990,-1,{dress:"chador"}],[2150,-1,{dress:"robe",head:"cap"}]];
function b5_lamp(ctx,x,y,s,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(150,104,60,1)";ctx.beginPath();ctx.ellipse(x,y-3*s,9*s,4*s,0,0,TAU);ctx.fill();
  const fl=0.85+0.15*Math.sin(t*9);ctx.fillStyle="rgba(255,214,140,1)";ctx.beginPath();ctx.ellipse(x+6*s,y-9*s,2.6*s,6*s*fl,0.3,0,TAU);ctx.fill();
  glow(ctx,x+6*s,y-9*s,64*s,[255,200,120],0.42);glow(ctx,x+6*s,y-9*s,18*s,[255,230,170],0.6);});}
// the water underground, fallen by D pixels: the earth that held it painted back, and its new top, dashed
const B5_DROP=190,b5_yw=(x,D)=>ba_yw(x)+D;
function b5_fallen(ctx,D){if(D<=0.5)return;ctx.save();ctx.beginPath();ctx.moveTo(-1400,ba_ys(-1400));for(let x=-1400;x<=3300;x+=40)ctx.lineTo(x,ba_ys(x));ctx.lineTo(3300,1900);ctx.lineTo(-1400,1900);ctx.closePath();ctx.clip();
  ctx.beginPath();for(let x=-1400;x<=1500;x+=30)x===-1400?ctx.moveTo(x,ba_yw(x)-2):ctx.lineTo(x,ba_yw(x)-2);for(let x=1500;x>=-1400;x-=30)ctx.lineTo(x,b5_yw(x,D));ctx.closePath();
  const eg=ctx.createLinearGradient(0,600,0,1200);eg.addColorStop(0,"rgba(104,70,48,1)");eg.addColorStop(1,"rgba(64,42,30,1)");ctx.fillStyle=eg;ctx.fill();
  for(let i=0;i<60;i++){const x=hash(i,771)*1900-400,y=ba_yw(x)+hash(i,772)*D;if(y>b5_yw(x,D)-3)continue;ctx.fillStyle="rgba("+(hash(i,773)>0.5?"58,38,26,":"176,134,98,")+(0.2+0.25*hash(i,774))+")";ctx.beginPath();ctx.ellipse(x,y,3+hash(i,775)*4,2+hash(i,776)*3,hash(i,777)*3,0,TAU);ctx.fill();}
  ctx.strokeStyle=rgba(BA_WATER,0.7);ctx.lineWidth=2.5;ctx.setLineDash([12,10]);ctx.beginPath();for(let x=-1400;x<=1500;x+=30)x===-1400?ctx.moveTo(x,b5_yw(x,D)):ctx.lineTo(x,b5_yw(x,D));ctx.stroke();ctx.setLineDash([]);ctx.restore();}
// the deep well: a steel pipe from the surface down past the water underground, a motor pump on a concrete plinth, and its water
// running out to the side (o.pump, 0..1); o.D, how far the water has fallen, so the pipe always reaches below it
function b5_well(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.01)return;const x=B5_WELL,ys=ba_ys(x),yb=b5_yw(x,B5_DROP)+70,pm=o.pump||0;withA(ctx,a,()=>{ctx.save();
  ctx.fillStyle="rgba(22,16,12,0.96)";ctx.fillRect(x-9,ys,18,yb-ys);ctx.fillStyle="rgba(150,156,164,1)";ctx.fillRect(x-5,ys,10,yb-ys);ctx.fillStyle="rgba(90,96,106,1)";ctx.fillRect(x-5,ys,3,yb-ys);
  ctx.fillStyle="rgba(172,166,156,1)";ctx.fillRect(x-44,ys-12,88,14);ctx.fillStyle="rgba(70,76,88,1)";rr(ctx,x-30,ys-58,60,46,6);ctx.fill();ctx.fillStyle="rgba(46,50,60,1)";ctx.fillRect(x-36,ys-46,8,24);
  ctx.strokeStyle="rgba(200,206,214,0.5)";ctx.lineWidth=2;rr(ctx,x-30,ys-58,60,46,6);ctx.stroke();
  for(let k=0;k<4;k++){ctx.strokeStyle="rgba(120,128,140,1)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-22+k*12,ys-52);ctx.lineTo(x-22+k*12,ys-18);ctx.stroke();}
  ctx.fillStyle="rgba(120,126,134,1)";ctx.fillRect(x+30,ys-40,46,10);
  if(pm>0.01){const vib=Math.sin(t*40)*0.8*pm;ctx.translate(vib,0);ctx.strokeStyle=rgba(BA_WATER,0.95*pm);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+76,ys-35);ctx.quadraticCurveTo(x+96,ys-30,x+100,ys-4);ctx.stroke();
    ctx.fillStyle=rgba(BA_WATER,0.8*pm);ctx.beginPath();ctx.ellipse(x+112,ys+1,30,5,0,0,TAU);ctx.fill();
    for(let k=0;k<3;k++){const u=(t*1.4+k/3)%1;ctx.fillStyle="rgba(230,248,255,"+(0.6*(1-u)*pm)+")";ctx.beginPath();ctx.arc(x+98+u*10,ys-18+u*16,2.4,0,TAU);ctx.fill();}}
  ctx.restore();});}
function b5_section(ctx,t,st){ba_secSky(ctx,{warm:0.35,dusk:st.dusk||0});
  ba_section(ctx,t,{water:st.water,block:B5_SILT,blockA:st.blockA,wet:st.gw==null?1:st.gw});
  b5_fallen(ctx,(st.drop||0)*B5_DROP);
  ba_village(ctx,t,{wet:st.wet,fill:st.fill});ba_channel(ctx,t,2230,st.chTo==null?1:st.chTo,{from:st.chFrom||0});
  B5_GATES.forEach((x,i)=>ba_gate(ctx,x,st.gate?st.gate[i]||0:0,1));
  if((st.well||0)>0.01)b5_well(ctx,t,{a:st.well,pump:st.pump});
  // the diggers: one at the windlass over the shaft, bringing the silt up; one in the tunnel, with a lamp, at the silt with a pick
  const dA=st.dig||0;if(dA>0.01){const sy=ba_ys(950);ba_windlass(ctx,950,sy,0.2,st.bucket||0,t,{f:-1,depth:(ba_yt(950)-sy)/0.2-30,a:dA});
    ba_fig(ctx,924,ba_ys(924),B5_S,{dress:"tunic",head:"cap",f:1,reach:ba_crank(950,sy,0.2,t,-1),a:dA,t});
    b5_lamp(ctx,B5_SILT-34,ba_yt(B5_SILT-34),1.0,t,dA);ba_fig(ctx,B5_SILT-58,ba_yt(B5_SILT-58),B5_S,{kind:"stoop",hold:"pick",head:"cap",f:1,a:dA,rimA:0.85,rim:[255,206,140],col:[52,40,34],t});}
  // the owners by their fields, and the mirab with his hand on the gate whose turn it is
  B5_OWNERS.forEach(([x,f,o],i)=>{const a=st.own?st.own[i]||0:0;if(a>0.01)ba_fig(ctx,x,ba_ys(x),B5_S,Object.assign({f,a,t,rimA:0.6},o));});
  const gx=B5_GATES[2];if((st.mirab||0)>0.01)ba_fig(ctx,B5_MIRAB,ba_ys(B5_MIRAB),B5_S,{dress:"robe",head:"turban",f:1,reach:[gx-7,ba_ys(gx)-12-(st.gate?st.gate[2]||0:0)*16],a:st.mirab,t,rimA:0.6});}

// three bars, a hamlet's share each, as wide as its outlet: what leaves the basin, in a wet year or a dry one (f, 0..1, what came in)
function b5_bars(ctx,x,y,a,f,o){if(a<=0.01)return;o=o||{};withA(ctx,a,()=>{glass(ctx,x,y,520,330,20,BAC,{glow:12,ea:0.8,fill:"rgba(8,14,24,0.92)"});
  T(ctx,o.title||"what each hamlet gets",x+28,y+50,{w:700,size:30});
  B5_HAM.forEach((hm,i)=>{const bx=x+48+i*156,base=y+268,hh=150*f*B5_SH[i]/9;ctx.fillStyle=rgba(BA_WATER,0.85);rr(ctx,bx,base-hh,96,hh,8);ctx.fill();glow(ctx,bx+48,base-hh/2,60,BA_WATER,0.18);
    T(ctx,String(B5_SH[i]),bx+48,base-hh-16,{w:800,size:32,align:"center"});T(ctx,hm.name,bx+48,base+40,{w:700,size:28,align:"center",color:rgba(SOFT,1)});});});}

scene("outlets",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tBa=c("basin"),tFl=c("flow"),tMo=c("more"),tSi=c("silt"),tNe=c("needed"),tSe=c("set"),tBu=c("built"),tSa=c("same"),tCl=c("clean"),tMi=c("mirab"),tHe=c("held"),tLe=c("less"),tLi=c("link");
  // six places, each dissolving into the next as the whole picture changes: Sehdeh from above; the qanat cut away, silting up; Sehdeh
  // from above again, the shares set and built in; the qanat cut away, cleaned, and the mirab at the gates; Sehdeh three hundred years
  // on; and the words for the utility
  const bA=fin(t,tSi-0.9,1.2),cA=fin(t,tNe-0.9,1.2),dA=fin(t,tCl-0.9,1.2),eA=fin(t,tHe-0.9,1.2),fA=fin(t,tLi-0.6,0.9);
  const tg=(s_,x,y,col,a,o)=>baTagAt(ctx,S,x,y,s_,col,Object.assign({a},o||{}));
  // Sehdeh from above: the qanat lit, the water running in, the three hamlets named; the basin and its outlets; a drought; and a
  // hamlet taking more than its share
  if(bA<0.99){setScreen(ctx,S);ctx.save();const tQ=w("edge","one qanat")-0.3,tD=w("edge","Dastgerd")-0.2,tP=w("edge","Parvar")-0.2,tK=w("edge","Karton")-0.2,tOu=w("basin","three outlets")-0.3,tDr=w("flow","drought")-0.3,tTk=w("more","took more")-0.3,tOt=w("more","the others' fields dry")-0.3;
    focus(ctx,t,[[0,940,520,0.96],[tQ-0.6,1010,520,1.02],[tBa-0.3,1040,560,2.1],[tTk-0.6,1260,560,1.18]],2.2);
    const wave=1-0.22*Math.sin(clamp((t-w("flow","rises and falls")+0.2)/1.6,0,1)*Math.PI),dry=fin(t,tDr,1.2)*(1-fin(t,tMo-0.2,1.0)),take=fin(t,tTk,1.2);
    const flow=Math.min(wave,1-0.55*dry),wetOthers=lerp(0.82,0.16,fin(t,tOt-0.2,1.6));
    b5_plain(ctx,t,{run:clamp((t-tQ)/2.4,0,1),lit:fin(t,tQ,0.6),litP:clamp((t-tQ)/1.6,0,1),flow,take,wet:[lerp(0.82,0.9,take),wetOthers,wetOthers].map((v,i)=>lerp(v,0.5+0.3*(i===9),dry*0.6)),outHi:[0,0,0].map((_,i)=>pulseAt(t,tOu+i*0.3,1.0))});
    tg("one qanat",B5_CHAIN[7][0],B5_CHAIN[7][1],BAC,fin(t,tQ,0.5)*(1-fin(t,tBa-0.8,0.4)),{dy:-56});
    [[tD,0],[tP,1],[tK,2]].forEach(([t0,i])=>tg(B5_HAM[i].name,B5_HAM[i].lab[0],B5_HAM[i].lab[1],BA_SAND,fin(t,t0,0.5)*(1-fin(t,tBa-0.3,0.4)*(1-fin(t,tTk-0.4,0.6))),{dy:-10}));
    tg("a basin, three outlets",B5_BX+B5_BW/2,B5_BY,BAC,fin(t,tOu,0.5)*(1-fin(t,tFl-0.4,0.4)),{dy:-50});
    tg("one to each hamlet",B5_WX+90,B5_BY+B5_BH+30,BA_WATER,fin(t,w("basin","one to each")-0.2,0.5)*(1-fin(t,tFl-0.4,0.4)),{dy:30});
    tg("drought: about one year in four",B5_BX+B5_BW/2,B5_BY,AMBER,fin(t,tDr+0.2,0.5)*(1-fin(t,tMo-0.4,0.4)),{dy:-50});
    tg("one takes more",B5_WX,B5_OY[0],AMBER,fin(t,tTk+0.3,0.5)*(1-fin(t,tSi-1.2,0.4)),{dy:-80});
    tg("the others' fields: dry",1760,760,BA_RED,fin(t,tOt+0.3,0.5)*(1-fin(t,tSi-1.2,0.4)),{dy:0});
    ctx.restore();eaYear(ctx,80,80,"Sehdeh, Iran · the 1960s",CLAY,fin(t,0.5,0.8)*(1-fin(t,tFl-1.0,0.4)));}
  // the qanat cut away: silt washing in every year, and a qanat nobody cleaned choking, its water gone from the fields
  if(bA>0.01&&cA<0.99)withA(ctx,bA,()=>{setScreen(ctx,S);ctx.save();const tW=w("silt","silt washed")-0.3,tC=w("silt","nobody cleaned")-0.3,tCh=w("silt","choke")-0.3,tDu=w("silt","dry up")-0.3;
    focus(ctx,t,[[tSi-1.0,860,640,1.25],[tC-0.4,1260,660,1.05]],2.0);
    const bl=clamp((t-tW)/2.6,0,1)*0.55+0.45*clamp((t-tCh)/0.9,0,1),dr=clamp((t-tCh-0.3)/2.2,0,1);
    b5_section(ctx,t,{water:[[BA_XM,B5_SILT-30],[lerp(B5_SILT+30,BA_XO+30,dr),BA_XO+30]],blockA:bl,chFrom:dr,chTo:1,wet:[0,1,2,3].map(()=>lerp(0.85,0.2,fin(t,tDu,1.8))),gate:[0,0,0,0],own:[1,1,1,1].map(v=>v*fin(t,tC,0.8))});
    const sOut=1-fin(t,tNe-1.4,0.4);tg("silt, every year",B5_SILT,ba_yt(B5_SILT)-BA_TH,BA_SAND,fin(t,tW+0.4,0.5)*sOut,{dy:-120});
    tg("nobody cleans it: it chokes",B5_SILT+420,ba_yt(B5_SILT+420)-BA_TH,BA_RED,fin(t,tCh+0.2,0.5)*sOut,{dy:-190});
    tg("the fields dry up",1900,ba_ys(1900)-40,BA_RED,fin(t,tDu+0.4,0.5)*sOut,{dy:-60});
    ctx.restore();});
  // Sehdeh from above again: what each hamlet needed; the shares set in the 1600s and built into the outlets; and whatever came in,
  // left in the same shares
  if(cA>0.01&&dA<0.99)withA(ctx,cA,()=>{setScreen(ctx,S);ctx.save();const tFa=w("needed","fair share")-0.3,tOp=w("needed","the tunnel kept open")-0.3,tEn=w("set","an engineer")-0.3,tSh=w("set","eight, eight and nine")-0.3,tWi=w("built","eight spans")-0.3,tWe=w("same","in a wet year")-0.3,tDy=w("same","a dry one")-0.3,tSs=w("same","the same shares")-0.3;
    focus(ctx,t,[[tNe-1.0,1010,540,1.2],[tSe-0.4,1060,560,2.4],[tBu-0.4,1090,562,3.2],[tSa-0.3,1180,560,1.5]],2.0);
    const fl=1-0.58*clamp((t-tDy)/1.2,0,1)+0.58*clamp((t-tSs-0.8)/1.4,0,1);
    b5_plain(ctx,t,{flow:fl,wet:[0.82,0.82,0.82].map(v=>v-0.12*clamp((t-tDy)/1.2,0,1)*(1-clamp((t-tSs-0.8)/1.4,0,1))),span:clamp((t-tWi)/1.6,0,1),outHi:[0,1,2].map(i=>pulseAt(t,tSh+i*0.32,1.0)),lit:pulseAt(t,tOp,1.8),litP:1});
    tg("a fair share, wet year or dry",B5_BX+B5_BW/2,B5_BY,BA_WATER,fin(t,tFa,0.5)*(1-fin(t,tSe-0.5,0.4)),{dy:-50});
    tg("the tunnel kept open",B5_CHAIN[7][0],B5_CHAIN[7][1],BAC,fin(t,tOp,0.5)*(1-fin(t,tSe-0.5,0.4)),{dy:-56});
    // the shares, set by the engineer; then built in: each outlet's width, in spans
    const shA=fin(t,tSh,0.5)*(1-fin(t,tBu+0.6,0.4)),spA=fin(t,tWi+0.2,0.5)*(1-fin(t,tSa-0.5,0.4));
    B5_OY.forEach((oy,i)=>{tg(B5_SH[i]+" shares · "+B5_HAM[i].name,B5_WX+28,oy,BA_SAND,shA*fin(t,tSh+i*0.32,0.4),{align:"left",dy:(i-1)*12});
      tg(B5_SH[i]+" spans wide",B5_WX+28,oy,BA_WATER,spA*fin(t,tWi+0.2+i*0.3,0.4),{align:"left",dy:(i-1)*12});});
    tg("a wet year",B5_BX,B5_BY,BA_WATER,fin(t,tWe,0.4)*(1-fin(t,tDy-0.1,0.3)),{dy:-50});
    tg("a dry year",B5_BX,B5_BY,AMBER,fin(t,tDy+0.1,0.4)*(1-fin(t,Math.min(tSs+0.9,tCl-1.4),0.4)),{dy:-50});
    ctx.restore();
    b5_bars(ctx,1320,90,fin(t,tWe-0.2,0.6)*(1-fin(t,tCl-1.3,0.5)),fl,{title:"8 : 8 : 9, whatever comes in"});
    eaYear(ctx,80,80,"the 1600s · Shah Abbas the Great",CLAY,fin(t,tSe,0.6)*(1-fin(t,tSa-0.6,0.4)));});
  // the qanat cut away again: the muqannis clear the silt; then the village, and the mirab at the gates, each field's turn in time
  if(dA>0.01&&eA<0.99)withA(ctx,dA,()=>{setScreen(ctx,S);ctx.save();const tMu=w("clean","the muqannis")-0.3,tCs=w("clean","cleared the silt")-0.3,tPa=w("mirab","paid with a free share")-0.3,tPr=w("mirab","the proper time")-0.3;
    focus(ctx,t,[[tCl-1.0,900,660,1.9],[tMi-0.3,1960,760,1.6]],2.2);
    const cl=clamp((t-tCs)/2.4,0,1),bk=((t-tMu)*0.55)%1,TA=[tMi+0.4,tMi+1.8,tPr-0.2,tPr+1.4],gate=TA.map(t0=>pulseAt(t,t0,1.3));
    b5_section(ctx,t,{water:[[BA_XM,BA_XO+30]],blockA:0.75*(1-cl),chTo:1,wet:[0.85,0.85,0.85,0.85],fill:gate,gate,dig:fin(t,tMu-0.4,0.6),bucket:bk,mirab:fin(t,tMi,0.6),own:[1,1,1,1]});
    tg("the muqannis: the silt cleared, each year",B5_SILT-40,ba_ys(B5_SILT-40),BAC,fin(t,tMu+0.2,0.5)*(1-fin(t,tMi-0.6,0.4)),{dy:-130});
    const mOut=1-fin(t,tHe-1.4,0.4);tg("the mirab, the water master",B5_MIRAB,ba_ys(B5_MIRAB)-50,BIZ,fin(t,w("mirab","the mirab")-0.1,0.5)*mOut,{dy:-70});
    tg("paid with a free share",B5_MIRAB,ba_ys(B5_MIRAB)-50,TRUST,fin(t,tPa,0.5)*mOut,{dy:-10});
    tg("each farmer's water, on time",2230,ba_ys(2230)-60,BA_WATER,fin(t,tPr,0.5)*mOut,{dy:-60});
    ctx.restore();});
  // Sehdeh three hundred years on: the same shares; then a dry year, less for each and a share for each; then the words for the utility
  const eOut=1-fin(t,tLi-0.9,0.6);if(eA>0.01&&fA<0.99)withA(ctx,eA,()=>{setScreen(ctx,S);if(eOut>0.01)withA(ctx,eOut,()=>{ctx.save();const tTh=w("held","three hundred years")-0.3,tSt=w("held","still took")-0.3,tLs=w("less","each got less")-0.3,tIt=w("less","each still got its share")-0.3;
    focus(ctx,t,[[tHe-1.0,1100,560,1.4],[tLe-0.4,1200,560,1.25]],2.0);
    const fl=1-0.55*fin(t,tLs,1.4);
    b5_plain(ctx,t,{flow:fl,wet:[0.84,0.84,0.84].map(v=>v-0.14*fin(t,tLs,1.4)),outHi:[0,1,2].map(i=>pulseAt(t,tSt+i*0.3,1.0))});
    B5_OY.forEach((oy,i)=>tg(B5_SH[i]+" · "+B5_HAM[i].name,B5_WX+28,oy,BA_SAND,fin(t,tSt+i*0.3,0.4)*(1-fin(t,tLs-0.4,0.4)),{align:"left",dy:(i-1)*12}));
    tg("less for each, and a share for each",1240,700,BA_WATER,fin(t,tIt,0.5),{dy:0});
    ctx.restore();eaYear(ctx,80,80,"Sehdeh · the 1960s, more than 300 years on",CLAY,fin(t,tTh,0.6));});});
  if(fA>0.01)withA(ctx,fA,()=>{setScreen(ctx,S);bg2(ctx);const tSt=w("link","what each step expects")-0.2,tWr=w("link","written down")-0.2,tCh=w("link","and checked")-0.2,out=1-fin(t,B-0.2,0.8);
    withA(ctx,out,()=>{T(ctx,"at the utility, the data needs the same",960,380,{w:800,size:40,align:"center"});
      if(t>tSt)arrive(ctx,960,480,t,tSt,()=>tag(ctx,960,480,"what each step expects of it",BA_BUS,{align:"center",size:32}),{dy:10});
      if(t>tWr)arrive(ctx,960,566,t,tWr,()=>tag(ctx,960,566,"written down by its owners",TRUST,{align:"center",size:32}),{dy:10});
      if(t>tCh)arrive(ctx,960,652,t,tCh,()=>tag(ctx,960,652,"and checked",TECH,{align:"center",size:32}),{dy:10});});});
  vign(ctx,S);
  baTitle(ctx,S,t,B+0.6,"Rules and expectations the business owns","what each step expects, written down by its owners","Film 5 of 5");});

/* ---------- 2. What the business expects ---------- */
// Rules with a home's three rules, on cards: its data rule and its two business rules, each with a home, an owner and a reason
const B5_RULES=[["data rule · RUL-020","Every reading is marked actual or estimated."],["business rule · RUL-021","An estimate is replaced when the actual reading arrives."],["business rule · RUL-022","A bill based on a replaced estimate is corrected on the next bill."]];
// a rule's card, as Rules with a home draws it, with a requirement's glyph in its corner; returns its height
function b5_rule(ctx,x,y,w,k,s_,o){o=o||{};const h=ruleCard(ctx,x,y,w,s_,{kicker:k,size:o.size||28,col:B5_MOT,hi:o.hi||0});b5_req(ctx,x+w-34,y+34,16,B5_MOT);return h;}
scene("note",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const tHo=c("home"),tNo=c("now"),tRu=w("note","the rules on it")-0.1,tGo=w("note","how good it must be")-0.1;
  // the camera starts on Tomás and his note, and steps back as the film before's rules come in under it
  ctx.save();focus(ctx,t,[[0,1240,540,1.3],[tHo-0.9,960,520,1.0]],1.8);
  const nP=Math.min(1,pulseAt(t,w("note","what the business expects")-0.1,1.6)+pulseAt(t,tRu,1.3)+pulseAt(t,tGo,1.3));if(nP>0.01)glow(ctx,1000,300,380,NOTEC[0],0.2*nP);
  sticky(ctx,1000,300,700,180,"What does the business expect of it? "+ba_nb("The rules on it,")+" "+ba_nb("how good it must be?"),{col:NOTEC[0],size:36,rot:-0.02});
  // Rules with a home's rules, each with a home, an owner and a reason; then they dim, the three words leave, and the two new
  // questions come in where the words were
  const dim=1-0.55*fin(t,tNo-0.2,0.6),wOut=1-fin(t,tNo-0.3,0.4);
  withA(ctx,fin(t,tHo-0.2,0.5)*dim,()=>T(ctx,"Rules with a home",100,420,{f:"mono",w:500,size:28,color:rgba(SOFT,1)}));
  B5_RULES.forEach(([k,s_],i)=>{const t0=tHo+0.2+i*0.35;if(t<t0)return;arrive(ctx,350+i*530,520,t,t0,()=>withA(ctx,dim,()=>b5_rule(ctx,100+i*530,450,500,k,s_)),{dy:-12});});
  [["a home",w("home","rule a home")+0.1],["an owner",w("home","an owner")],["a reason",w("home","a reason")]].forEach(([s_,t0],k)=>{if(t<t0-0.1)return;
    arrive(ctx,560+k*300,720,t,t0-0.1,()=>withA(ctx,wOut,()=>tag(ctx,560+k*300,720,s_,k===1?TRUST:B5_MOT,{align:"center",size:30})),{dy:8});});
  withA(ctx,fin(t,w("now","where rules come from")-0.2,0.5),()=>tag(ctx,620,720,"where do rules come from?",B5_MOT,{align:"center",size:32}));
  withA(ctx,fin(t,w("now","who says")-0.2,0.5),()=>tag(ctx,1170,720,"who says how good is good enough?",TRUST,{align:"center",size:32}));
  baPersonR(ctx,"tomas",1770,1040,0.74,{t,expr:"calm"});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Policy, process, procedure ---------- */
// The chain ISO 9000 draws, left to right: a policy, the processes that carry it out, the procedure that says how a step is done, and
// the records that show it was; the rules that make the policy checkable hang below it. The camera starts on the policy, steps back
// to take in its rules, then the whole chain, named in the room the rules leave to the right
const B5_CH=[[70,200,440,250],[590,200,360,250],[1030,200,360,250],[1470,200,380,250]];
function b5_chainArrow(ctx,i,p){if(p<=0.01)return;const a=B5_CH[i],b=B5_CH[i+1],x0=a[0]+a[2]+10,x1=b[0]-10,y=a[1]+a[3]/2;arrowTo(ctx,x0,y,lerp(x0,x1,ease(clamp(p,0,1))),y,SOFT,0.85,{lw:3,head:12});}
scene("policy",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const tRe=c("retail"),tRu=c("rules"),tBr=c("brule"),tPr=c("process"),tPc=c("procedure"),tRc=c("record"),tIs=c("iso");
  ctx.save();focus(ctx,t,[[0,400,430,1.55],[tRu-0.6,520,560,1.15],[tPc-0.8,960,540,1.0]],2.0);
  const isoHi=k=>pulseAt(t,w("iso",["Policy","process","procedure","record"][k])-0.1,1.2);
  const kick=(s_,x,y,col,k)=>T(ctx,s_,x,y,{f:"mono",w:500,size:28,color:rgba(mix(col,[255,236,190],isoHi(k)),1)});
  // the policy, in the business's words, with its owner
  const pA=fin(t,0.3,0.6);if(pA>0.01){const[x,y,w_,h]=B5_CH[0];withA(ctx,pA,()=>{glass(ctx,x,y,w_,h,18,B5_MOT,{glow:12+18*(pulseAt(t,w("policy","a policy")-0.1,1.4)+isoHi(0)),ea:0.85,fill:"rgba(10,8,22,0.95)"});
      kick("policy",x+26,y+48,B5_MOT,0);
      withA(ctx,fin(t,w("policy","what the business means")-0.2,0.5)*(1-fin(t,tRe-0.3,0.4)),()=>wrapT(ctx,"what the business means to do",x+26,y+112,w_-52,{size:30,w:700}));
      withA(ctx,fin(t,tRe+0.2,0.5),()=>{wrapT(ctx,"Bills use actual readings wherever they can.",x+26,y+112,w_-52,{size:30,w:700});tag(ctx,x+26,y+h-34,"head of retail",TRUST,{size:28});});});}
  // the rules that make it checkable, below it: Rules with a home's data rule and its business rule, each a requirement
  const rA=fin(t,tRu-0.2,0.6);if(rA>0.01){withA(ctx,rA,()=>{ctx.save();ctx.strokeStyle=rgba(B5_MOT,0.7);ctx.lineWidth=2.5;ctx.setLineDash([8,7]);ctx.beginPath();ctx.moveTo(290,456);ctx.lineTo(290,524);ctx.stroke();ctx.restore();
      T(ctx,"makes it checkable",310,500,{w:700,size:28,color:rgba(B5_MOT,1)});});}
  [[w("rules","A data rule")-0.2,530,0],[tBr-0.2,680,1]].forEach(([t0,y,i])=>{if(t<t0)return;arrive(ctx,500,y+60,t,t0,()=>b5_rule(ctx,70,y,860,B5_RULES[i][0],B5_RULES[i][1],{size:30,hi:pulseAt(t,t0+0.4,1.4)}),{dy:-12});});
  // the processes that carry it out
  const prA=fin(t,tPr-0.2,0.6);if(prA>0.01){const[x,y,w_,h]=B5_CH[1];withA(ctx,prA,()=>{glass(ctx,x,y,w_,h,18,BA_BUS,{glow:12+18*isoHi(1),ea:0.8,fill:"rgba(14,12,6,0.95)"});kick("processes",x+26,y+48,BA_BUS,1);
      baEl(ctx,x+22,y+74,w_-44,70,"check readings",BA_BUS,"process",{hi:pulseAt(t,w("process","check readings")-0.1,1.4)});baEl(ctx,x+22,y+160,w_-44,70,"make bills",BA_BUS,"process",{hi:pulseAt(t,w("process","make bills")-0.1,1.4)});});
    b5_chainArrow(ctx,0,clamp((t-tPr+0.1)/0.8,0,1));}
  // the procedure that says how a step is done
  const pcA=fin(t,tPc-0.2,0.6);if(pcA>0.01){const[x,y,w_,h]=B5_CH[2];withA(ctx,pcA,()=>{glass(ctx,x,y,w_,h,18,BA_BUS,{glow:12+18*(pulseAt(t,w("procedure","how to make an estimate")-0.1,1.4)+isoHi(2)),ea:0.8,fill:"rgba(14,12,6,0.95)"});
      kick("procedure",x+26,y+48,BA_BUS,2);T(ctx,"how to make",x+26,y+104,{w:700,size:30});T(ctx,"an estimate:",x+26,y+142,{w:700,size:30});
      T(ctx,"from the same month",x+26,y+192,{w:600,size:28,color:rgba(SOFT,1)});T(ctx,"last year",x+26,y+228,{w:600,size:28,color:rgba(SOFT,1)});});
    b5_chainArrow(ctx,1,clamp((t-tPc+0.1)/0.8,0,1));}
  // the records that show it was done
  const rcA=fin(t,tRc-0.2,0.6);if(rcA>0.01){const[x,y,w_,h]=B5_CH[3];withA(ctx,rcA,()=>{glass(ctx,x,y,w_,h,18,BA_INF,{glow:12+18*isoHi(3),ea:0.8,fill:"rgba(14,10,10,0.95)"});
      kick("records",x+26,y+48,BA_INF,3);
      withA(ctx,fin(t,w("record","each reading's mark")-0.2,0.4),()=>{T(ctx,"a reading:",x+26,y+104,{w:700,size:28});T(ctx,"actual or estimated",x+26,y+140,{w:600,size:28,color:rgba(AMBER,1)});});
      withA(ctx,fin(t,w("record","each bill's note")-0.2,0.4),()=>{T(ctx,"a bill:",x+26,y+194,{w:700,size:28});T(ctx,"if it used an estimate",x+26,y+230,{w:600,size:28,color:rgba(AMBER,1)});});});
    b5_chainArrow(ctx,2,clamp((t-tRc+0.1)/0.8,0,1));}
  // the chain, named: ISO 9000's four words, each lit as it's said, in the room to the right of the rules
  const iA=fin(t,tIs-0.2,0.5);if(iA>0.01)arrive(ctx,1430,640,t,tIs-0.2,()=>{glass(ctx,1010,540,840,200,18,SOFT,{glow:10,ea:0.7,fill:"rgba(12,10,8,0.95)"});
    T(ctx,"ISO 9000",1036,588,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});
    let x=1036;["policy","process","procedure","record"].forEach((s_,k)=>{T(ctx,s_,x,654,{w:800,size:34,color:rgba(mix(INK,[255,226,160],isoHi(k)),1)});x+=tw(ctx,s_,34,800);
      if(k<3){T(ctx," · ",x,654,{w:800,size:34,color:rgba(SOFT,0.8)});x+=tw(ctx," · ",34,800);}});
    T(ctx,"the chain the standards draw",1036,706,{w:600,size:28,color:rgba(SOFT,1)});},{dy:10});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. A decision, in a table ---------- */
// check readings at level three, in BPMN, as Processes, as deep as data needs drew it: a start event, its tasks, the gateway that
// chooses, an end event; its "no" branch drawn above the flow, to leave the room below for the decision table its choice is taken from
const B5_BP={e0:[150,360],t1:[250,312,320,96],g1:[690,360],t2:[1000,312,320,96],e1:[1430,360],t3:[480,150,420,96]};
function b5_bpmn(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=[200,214,240],hi=o.hi||{},A=B5_BP;
  withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
    const flow=(pts,lab,lx,ly)=>{ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=3;b5_path(ctx,pts);ctx.stroke();const[x1,y1]=pts[pts.length-1],[x0,y0]=pts[pts.length-2],an=Math.atan2(y1-y0,x1-x0);
      ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.45)*15,y1-Math.sin(an-0.45)*15);ctx.lineTo(x1-Math.cos(an+0.45)*15,y1-Math.sin(an+0.45)*15);ctx.closePath();ctx.fill();
      if(lab)T(ctx,lab,lx,ly,{w:700,size:28,color:rgba(SOFT,1)});};
    const task=([x,y,w,h],lab,key)=>{const h_=hi[key]||0;glass(ctx,x,y,w,h,16,col,{glow:8+18*h_,ea:0.8,fill:"rgba(10,14,26,0.95)"});
      if(h_>0.01){ctx.save();ctx.strokeStyle=rgba([255,214,150],0.9*h_);ctx.lineWidth=3.5;rr(ctx,x-6,y-6,w+12,h+12,20);ctx.stroke();ctx.restore();}
      const ls=wrapT(ctx,lab,0,0,w-40,{size:30,w:700,measure:true});ls.forEach((l,i)=>T(ctx,l,x+w/2,y+h/2+11-(ls.length-1)*17+i*34,{w:700,size:30,align:"center"}));};
    const ev=([x,y],end)=>{ctx.fillStyle="rgba(10,14,26,0.95)";ctx.beginPath();ctx.arc(x,y,26,0,TAU);ctx.fill();ctx.strokeStyle=rgba(end?[232,110,96]:[120,210,130],1);ctx.lineWidth=end?7:3;ctx.beginPath();ctx.arc(x,y,26,0,TAU);ctx.stroke();};
    ev(A.e0,false);T(ctx,"billing day",A.e0[0],A.e0[1]+66,{w:700,size:28,align:"center",color:rgba(SOFT,1)});
    flow([[A.e0[0]+28,A.e0[1]],[A.t1[0],A.e0[1]]]);task(A.t1,"check each reading","t1");
    const[gx,gy]=A.g1;flow([[A.t1[0]+A.t1[2],gy],[gx-44,gy]]);
    // the gateway, which chooses: a diamond with an X
    const g=hi.g1||0;ctx.save();ctx.translate(gx,gy);ctx.rotate(Math.PI/4);ctx.fillStyle="rgba(10,14,26,0.95)";ctx.fillRect(-31,-31,62,62);ctx.strokeStyle=rgba(mix(col,[255,214,150],g),1);ctx.lineWidth=3+2*g;ctx.strokeRect(-31,-31,62,62);ctx.restore();
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(gx-12,gy-12);ctx.lineTo(gx+12,gy+12);ctx.moveTo(gx+12,gy-12);ctx.lineTo(gx-12,gy+12);ctx.stroke();if(g>0.01)glow(ctx,gx,gy,80,[255,214,150],0.4*g);
    T(ctx,"passes?",gx+46,gy+66,{w:800,size:30});
    flow([[gx+44,gy],[A.t2[0],gy]],"yes",gx+66,gy-16);task(A.t2,"send to billing","t2");
    flow([[A.t2[0]+A.t2[2],A.e1[1]],[A.e1[0]-28,A.e1[1]]]);ev(A.e1,true);
    flow([[gx,gy-44],[gx,A.t3[1]+A.t3[3]+4]],"no",gx+18,gy-72);task(A.t3,"estimate from the same month last year","t3");
    const ym=A.t3[1]+A.t3[3]/2,xm=A.t2[0]+A.t2[2]/2;flow([[A.t3[0]+A.t3[2],ym],[xm,ym],[xm,A.t2[1]-4]]);
    ctx.restore();});}
// the decision table, in DMN's form: its name over it, the hit policy in the corner (F: the first row that matches), the inputs and
// the output as columns, each row one rule; o.rowHi[i] lights a row, o.add (0..1) brings in a new row, second, o.edit lights it
const B5_DT={x:130,y:560,cw:[70,250,230,330,250],rh:48};
const B5_DROWS=[["yes","yes","yes","actual"],["yes","yes","no","estimate"],["yes","no","–","estimate"],["no","–","–","estimate"]],B5_DNEW=["yes","yes","no: a new meter","actual"];
function b5_table(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const{x,y,cw,rh}=B5_DT,W_=cw.reduce((s,v)=>s+v,0),add=o.add||0,rows=B5_DROWS.slice();
  withA(ctx,a,()=>{const n=rows.length+add,h=rh*(1+n);glass(ctx,x-20,y-80,W_+40,h+110,18,B5_MOT,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(10,8,22,0.96)"});
    // DMN's decision, a rectangle, and its name
    ctx.strokeStyle=rgba(B5_MOT,1);ctx.lineWidth=2.5;ctx.strokeRect(x,y-62,40,30);T(ctx,"decision table · can billing use it?",x+56,y-36,{w:700,size:28,color:rgba(B5_MOT,1)});
    const cols=["F","reading came?","in range?","no lower than the last?","use"];let cx=x;
    ctx.fillStyle="rgba(200,186,255,0.10)";ctx.fillRect(x,y,W_,rh);
    cols.forEach((s_,k)=>{T(ctx,s_,cx+(k===0?cw[0]/2:14),y+33,{w:700,size:28,align:k===0?"center":"left",color:k===4?rgba([255,214,150],1):rgba(INK,0.95)});cx+=cw[k];});
    // a double line between the inputs and the output, as DMN draws it
    const xo=x+cw[0]+cw[1]+cw[2]+cw[3];ctx.strokeStyle=rgba(B5_MOT,0.8);ctx.lineWidth=2;[xo-3,xo+3].forEach(xx=>{ctx.beginPath();ctx.moveTo(xx,y);ctx.lineTo(xx,y+h);ctx.stroke();});
    const row=(r,yy,i,al)=>{withA(ctx,al,()=>{const hi=o.rowHi?o.rowHi[i]||0:0,est=r[3]==="estimate";if(hi>0.01){ctx.fillStyle=rgba(est?AMBER:BA_OK,0.16*hi);ctx.fillRect(x,yy,W_,rh);}
      let xx=x;T(ctx,String(i===-1?"2":i+1+(add>0.5&&i>0?1:0)),xx+cw[0]/2,yy+33,{w:700,size:28,align:"center",color:rgba(SOFT,1)});xx+=cw[0];
      r.forEach((s_,k)=>{T(ctx,s_,xx+14,yy+33,{w:k===3?800:600,size:28,color:k===3?rgba(est?AMBER:BA_OK,1):rgba(INK,0.9)});xx+=cw[k+1];});
      ctx.strokeStyle=rgba(B5_MOT,0.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+W_,yy);ctx.stroke();});};
    let yy=y+rh;row(rows[0],yy,0,1);yy+=rh;
    if(add>0.01){const e=o.edit||0;if(e>0.01){ctx.fillStyle=rgba([255,236,190],0.14*e);ctx.fillRect(x,yy,W_,rh*add);}row(B5_DNEW,yy,-1,clamp(add*1.6-0.6,0,1));yy+=rh*add;}
    for(let i=1;i<rows.length;i++){row(rows[i],yy,i,1);yy+=rh;}
    if(o.owner>0.01)withA(ctx,o.owner,()=>tag(ctx,x+W_-tw(ctx,"owner: Grace's team",28,700)-26,y-48,"owner: Grace's team",TRUST,{size:28}));});}
scene("decide",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});
  const tBp=c("bpmn"),tDm=c("dmn"),tRo=c("rows"),tOw=c("owns"),tUs=w("rows","it's used")-0.3,tEs=w("rows","failed or missing")-0.3,tCh=w("owns","a rule changes")-0.3,tSt=w("owns","the flow stays")-0.3;
  // the camera starts on the flow, and steps back to take in the table below it
  ctx.save();focus(ctx,t,[[0,800,290,1.22],[tDm-0.7,960,540,1.0]],2.0);
  arrive(ctx,400,110,t,0.2,()=>{T(ctx,"check readings",120,122,{w:800,size:38});tag(ctx,440,110,"level 3 · BPMN",BA_BUS,{size:28});},{dy:-10});
  const gHi=Math.max(pulseAt(t,w("decide","decides")-0.1,1.8),pulseAt(t,w("bpmn","its choice")-0.1,1.6),0.6*fin(t,tDm,0.6)*(1-fin(t,tCh,0.6)));
  b5_bpmn(ctx,t,{a:1-0.4*fin(t,tCh,0.6),hi:{g1:gHi,t1:pulseAt(t,w("bpmn","a step")-0.1,1.4)}});
  // the table, under the choice, joined to it by a dashed line: the rules the gateway applies
  const dA=fin(t,tDm-0.2,0.7);if(dA>0.01){withA(ctx,dA,()=>{ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(B5_MOT,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(B5_BP.g1[0],B5_BP.g1[1]+46);ctx.lineTo(B5_BP.g1[0],B5_DT.y-82);ctx.stroke();ctx.restore();});
    arrive(ctx,700,700,t,tDm-0.2,()=>b5_table(ctx,t,{rowHi:[pulseAt(t,tUs,2.2),pulseAt(t,tEs,2.2),pulseAt(t,tEs+0.25,2.2),pulseAt(t,tEs+0.5,2.2)],owner:fin(t,tOw,0.5),add:fin(t,tCh,0.8),edit:pulseAt(t,tCh+0.4,1.8)}),{dy:16});}
  withA(ctx,fin(t,w("dmn","DMN")-0.2,0.5)*(1-fin(t,tRo-0.2,0.4)),()=>tag(ctx,1320,520,"DMN: a notation for decisions",B5_MOT,{size:28}));
  withA(ctx,fin(t,tCh+0.6,0.5),()=>tag(ctx,1320,700,"a rule changes in the table",B5_MOT,{size:28}));
  withA(ctx,fin(t,tSt,0.5),()=>tag(ctx,1200,110,"the flow stays as it is",BA_BUS,{size:28}));
  arrive(ctx,1790,760,t,tOw-0.4,()=>baPersonR(ctx,"grace",1790,1050,0.7,{t,expr:"calm"}),{dy:20});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Late, for whom? ---------- */
// billing day, from midnight to noon: an hour every B5_HR pixels from B5_T0; the readings a fault held back, arriving from the meters
// on the left until nine; and billing (o.bill, the hour it runs). Written down by its owners carries this day on
const B5_T0=360,B5_HR=118,B5_TY=480,b5_hx=h=>B5_T0+h*B5_HR;
function b5_day(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const x0=b5_hx(0),x1=b5_hx(12);
  ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,B5_TY);ctx.lineTo(x1,B5_TY);ctx.stroke();
  for(let h=0;h<=12;h++){const x=b5_hx(h),big=h%3===0;ctx.strokeStyle=rgba(SOFT,big?0.85:0.4);ctx.lineWidth=big?3:2;ctx.beginPath();ctx.moveTo(x,B5_TY-(big?14:7));ctx.lineTo(x,B5_TY+(big?14:7));ctx.stroke();
    if(big)T(ctx,(h<10?"0":"")+h+":00",x,B5_TY+52,{f:"mono",w:500,size:28,align:"center",color:rgba(SOFT,1)});}
  // the readings held back, coming in from the meters after the fault until nine: a band of dots, each landing at its hour
  const ar=o.arrive||0;if(ar>0.01){for(let k=0;k<26;k++){const h=lerp(6.2,9,hash(k,901)),u=clamp(ar*1.25-hash(k,902)*0.25,0,1);if(u<=0)continue;const e=ease(u),x=lerp(250,b5_hx(h),e),y=lerp(440,B5_TY-36-hash(k,903)*58,e);
      ctx.fillStyle=rgba(o.lateCol||AMBER,0.9);ctx.beginPath();ctx.arc(x,y,6,0,TAU);ctx.fill();}
    withA(ctx,clamp(ar*2-1,0,1),()=>{ctx.fillStyle=rgba(o.lateCol||AMBER,0.10);ctx.fillRect(b5_hx(6.2),B5_TY-110,b5_hx(9)-b5_hx(6.2),96);ctx.strokeStyle=rgba(o.lateCol||AMBER,0.7);ctx.lineWidth=2;ctx.strokeRect(b5_hx(6.2),B5_TY-110,b5_hx(9)-b5_hx(6.2),96);});}
  // billing, at the hour it runs
  const bl=o.billA||0;if(bl>0.01){const x=b5_hx(o.bill==null?6:o.bill);withA(ctx,bl,()=>{ctx.strokeStyle=rgba(BA_RET,0.95);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,B5_TY-180);ctx.lineTo(x,B5_TY+20);ctx.stroke();glow(ctx,x,B5_TY-80,60,BA_RET,0.25*(o.billHi||0));
      tag(ctx,x,B5_TY-206,o.billLab||"billing runs",BA_RET,{align:"center",size:28});});}});}
// a card for one step, its kicker in its colour, two lines and a mark (ok or not) in its corner
function b5_stepCard(ctx,x,y,w_,col,kicker,l1,l2,o){o=o||{};glass(ctx,x,y,w_,200,18,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(8,12,22,0.95)"});T(ctx,kicker,x+26,y+46,{f:"mono",w:500,size:28,color:rgba(col,1)});
  T(ctx,l1,x+26,y+106,{w:700,size:30});T(ctx,l2,x+26,y+146,{w:700,size:30,color:rgba(o.l2Col||INK,1)});if(o.mark>0.01)b5_mark(ctx,x+w_-36,y+40,20,o.ok!==false,o.mark);}
scene("late",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});
  const tNi=c("nine"),tCk=c("check"),tPl=c("planning"),tLa=c("late"),tRu=c("rule"),tGu=c("guess"),tFa=w("fault","a fault")-0.3,tSix=w("nine","at six")-0.3,tEst=w("nine","estimated bills")-0.3,tB=w("late","For billing")-0.2,tP=w("late","For planning")-0.2;
  // all but the day leaves before Written down by its owners carries the day on
  const aOut=1-fin(t,B+0.2,0.8);
  ctx.save();drift(ctx,t,sc,{z:0.015,x:960,y:520});focus(ctx,t,[[0,700,470,1.35],[tNi-0.6,960,540,1.0]],2.0);
  b5_day(ctx,t,{a:fin(t,0.2,0.6),arrive:clamp((t-tNi+0.2)/1.8,0,1),billA:fin(t,tSix,0.5),billHi:pulseAt(t,tSix+0.2,1.6),billLab:"billing ran: 06:00"});
  withA(ctx,aOut,()=>{
    // the meters whose readings were held back, at the left, with the count
    const mA=fin(t,tFa,0.6);if(mA>0.01)withA(ctx,mA,()=>{for(let k=0;k<6;k++){const x=176+(k%2)*52,y=394+Math.floor(k/2)*50;ctx.save();ctx.translate(x,y);ctx.scale(0.5,0.5);ctx.fillStyle="rgba(26,30,40,0.95)";rr(ctx,-34,-44,68,88,10);ctx.fill();
        ctx.strokeStyle=rgba(BA_RED,0.85);ctx.lineWidth=4;rr(ctx,-34,-44,68,88,10);ctx.stroke();ctx.fillStyle=rgba(BA_RED,0.5);ctx.fillRect(-20,-28,40,20);ctx.restore();}
      tag(ctx,202,330,"2,600 meters: held back",BA_RED,{align:"center",size:28});});
    withA(ctx,fin(t,w("nine","arrived by nine")-0.2,0.5),()=>tag(ctx,b5_hx(7.6),B5_TY-136,"arrived by 09:00",AMBER,{align:"center",size:28}));
    // the households billed on estimates; the data team's check, which asked only that each reading arrive within a day, and passed;
    // network planning, a week later: nothing wrong
    const eA=fin(t,tEst,0.5);if(eA>0.01)withA(ctx,eA,()=>baCount(ctx,280,590,420,200,"2,600","estimated bills","billing, at 06:00",AMBER,{hi:pulseAt(t,tEst,1.6)}));
    const kA=fin(t,tCk-0.2,0.5);if(kA>0.01)withA(ctx,kA,()=>b5_stepCard(ctx,750,590,440,TECH,"data team's check","each reading","within a day",{mark:fin(t,w("check","all was well")-0.2,0.4),l2Col:fin(t,tGu,0.6)>0.5?AMBER:INK}));
    const nA=fin(t,tPl-0.2,0.5);if(nA>0.01)withA(ctx,nA,()=>{arrowTo(ctx,b5_hx(12)+20,B5_TY,1880,B5_TY,SOFT,0.8,{lw:3,head:12,p:clamp((t-tPl)/0.8,0,1)});
      b5_stepCard(ctx,1240,590,440,BA_NET,"network planning","reads them","a week later",{mark:fin(t,w("planning","nothing wrong")-0.2,0.4)});});
    // late? for billing by three hours; for planning, not at all
    withA(ctx,fin(t,tLa-0.2,0.5)*(1-fin(t,tRu-0.4,0.4)),()=>T(ctx,"late?",960,176,{w:800,size:44,align:"center"}));
    withA(ctx,fin(t,tB,0.5),()=>tag(ctx,490,836,"for billing: 3 hours late",BA_RED,{align:"center",size:32}));
    withA(ctx,fin(t,tP,0.5),()=>tag(ctx,1460,836,"for planning: on time",BA_OK,{align:"center",size:32}));
    withA(ctx,fin(t,w("guess","guessed its own")-0.2,0.5),()=>tag(ctx,970,836,"a guess",AMBER,{align:"center",size:28}));
    // a reading is late only against the step that needs it, and its service level; billing's was never written down
    const rA=fin(t,tRu-0.1,0.5);if(rA>0.01)withA(ctx,rA*(1-fin(t,tGu-0.3,0.5)),()=>{glass(ctx,560,90,800,150,20,BA_BUS,{glow:16,ea:0.85,fill:"rgba(12,12,8,0.96)"});
      T(ctx,"late only against the step that needs it,",960,150,{w:800,size:34,align:"center"});T(ctx,"and that step's service level",960,204,{w:700,size:32,align:"center",color:rgba(BA_BUS,1)});});
    withA(ctx,fin(t,w("guess","never been written down")-0.2,0.5),()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BA_RED,0.9);ctx.lineWidth=3;rr(ctx,600,110,720,110,16);ctx.stroke();ctx.restore();
      T(ctx,"billing's service level: never written down",960,176,{w:700,size:30,align:"center",color:rgba(INK,0.9)});});});
  ctx.restore();eaYear(ctx,80,80,"billing day · January",SOFT,fin(t,0.2,0.6));
  vign(ctx,S);});

/* ---------- 6. Written down by its owners ---------- */
// billing's expectation, written down: a requirement on its card, its three lines (o.l[i], 0..1; a long one wraps, and those under it
// move down), its owner, who agreed to meet it, and its reason
function b5_expect(ctx,x,y,w_,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const L=o.lines||["by 10:00 on billing day","a reading or an estimate for every active meter","no more than 1 in 100 estimated"],h=o.h||300;
  withA(ctx,a,()=>{glass(ctx,x,y,w_,h,18,B5_MOT,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(10,8,22,0.96)"});b5_req(ctx,x+w_-40,y+34,18,B5_MOT);
    T(ctx,"expectation · billing",x+26,y+48,{f:"mono",w:500,size:28,color:rgba(B5_MOT,1)});
    let yy=y+100;L.forEach((s_,i)=>{const v=o.l?o.l[i]||0:1,ls=wrapT(ctx,s_,0,0,w_-52,{size:30,w:700,measure:true});if(v>0.01)withA(ctx,v,()=>ls.forEach((l,k)=>T(ctx,l,x+26,yy+k*36,{w:700,size:30,color:o.lineCol&&o.lineCol[i]?rgba(o.lineCol[i],1):rgba(INK,0.96)})));yy+=50+(ls.length-1)*36;});
    if(o.owner>0.01)withA(ctx,o.owner,()=>tag(ctx,x+26,y+h-40,"owner: head of retail",TRUST,{size:28}));
    if(o.agreed>0.01)withA(ctx,o.agreed,()=>{tag(ctx,x+340,y+h-40,"agreed: Grace",TRUST,{size:28});kt_gtick(ctx,x+340+tw(ctx,"agreed: Grace",28,700)+52,y+h-40,16,1);});});return h;}
// a check, built from what's written: its card, in the data team's blue
function b5_check(ctx,x,y,w_,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=96+lines.length*40;withA(ctx,a,()=>{glass(ctx,x,y,w_,h,18,o.col||TECH,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(8,12,22,0.95)"});
  T(ctx,o.kicker||"check · built from it",x+26,y+46,{f:"mono",w:500,size:28,color:rgba(o.col||TECH,1)});lines.forEach((s_,i)=>T(ctx,s_,x+26,y+96+i*40,{w:700,size:30}));if(o.mark>0.01)b5_mark(ctx,x+w_-36,y+38,20,o.ok!==false,o.mark);});}
// ArchiMate's realisation: a dotted line with a hollow triangle at the end it realises (p draws it)
function b5_realise(ctx,x0,y0,x1,y1,p,col){if(p<=0.01)return;const u=clamp(p,0,1),xe=lerp(x0,x1,u),ye=lerp(y0,y1,u);ctx.save();ctx.strokeStyle=rgba(col||SOFT,0.9);ctx.lineWidth=2.5;ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(u>=0.98){const an=Math.atan2(y1-y0,x1-x0);ctx.fillStyle="rgba(8,10,20,1)";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.5)*18,y1-Math.sin(an-0.5)*18);ctx.lineTo(x1-Math.cos(an+0.5)*18,y1-Math.sin(an+0.5)*18);ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();}
// Sehdeh's outlets, small, in a card: the shares set first, the outlets built to them (their words beside the card, to its right)
function b5_inset(ctx,x,y,a,t,o){if(a<=0.01)return;o=o||{};withA(ctx,a,()=>{glass(ctx,x,y,560,300,20,BAC,{glow:12,ea:0.8,fill:"rgba(8,14,24,0.95)"});T(ctx,"Sehdeh",x+26,y+48,{f:"mono",w:500,size:28,color:rgba(BAC,1)});
  ctx.save();ctx.beginPath();rr(ctx,x+14,y+64,532,222,14);ctx.clip();ctx.translate(x+280,y+176);ctx.scale(1.4,1.4);ctx.translate(-1060,-562);b5_plain(ctx,t,{span:o.span||0,outHi:o.outHi});ctx.restore();
  if(o.l1>0.01)withA(ctx,o.l1,()=>tag(ctx,x+590,y+96,"the shares, set first",BA_SAND,{size:28}));if(o.l2>0.01)withA(ctx,o.l2,()=>tag(ctx,x+590,y+220,"the outlets, built to them",BA_WATER,{size:28}));});}
scene("set",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});
  const tTe=c("ten"),tNe=c("needs"),tGr=c("grace"),tMa=c("map"),tSe=c("sehdeh"),tFi=c("first"),tMv=w("ten","moves billing to ten")-0.2,tWr=w("ten","writes down")-0.3;
  // the day, carried on from Late, for whom?: billing moves from six to ten, and the day leaves once the expectation goes on the map
  ctx.save();drift(ctx,t,sc,{z:0.015,x:960,y:520});
  const dOut=1-fin(t,tMa-0.3,0.6),bH=lerp(6,10,ease(clamp((t-tMv)/1.4,0,1)));
  b5_day(ctx,t,{a:dOut,arrive:1,billA:1,bill:bH,billHi:Math.max(pulseAt(t,w("whose","the owner of the step")-0.2,1.8),pulseAt(t,tMv+1.0,1.4)),billLab:bH>9.9?"billing: 10:00":bH<6.1?"billing ran: 06:00":"billing"});
  withA(ctx,fin(t,w("whose","the owner of the step")-0.1,0.5)*(1-fin(t,tTe+0.6,0.4))*dOut,()=>tag(ctx,b5_hx(6),B5_TY-266,"its owner: head of retail",TRUST,{align:"center",size:28}));
  ctx.restore();eaYear(ctx,80,80,"billing day · January",SOFT,dOut);
  // once the check is built, the camera centres the map and comes a little closer
  ctx.save();focus(ctx,t,[[0,960,540,1.0],[tFi-0.6,980,410,1.08]],2.2);
  // what billing needs, written down, line by line; Grace agrees to meet it; then it moves up and right, onto the map
  const mv=ease(clamp((t-tMa+0.2)/1.4,0,1)),eX=lerp(580,1080,mv),eY=lerp(570,150,mv);
  const eA=fin(t,tWr,0.6);if(eA>0.01)b5_expect(ctx,eX,eY,760,{a:eA,l:[fin(t,tNe-0.1,0.4),fin(t,w("needs","a reading or an estimate")-0.2,0.4),fin(t,w("needs","no more than one")-0.2,0.4)],owner:fin(t,tWr+0.4,0.5),agreed:fin(t,w("grace","agrees")-0.2,0.5),hi:pulseAt(t,tFi,1.6)});
  arrive(ctx,1790,760,t,tGr-0.4,()=>withA(ctx,1-fin(t,tMa-0.3,0.5),()=>baPersonR(ctx,"grace",1790,1050,0.7,{t,expr:"calm"})),{dy:20});
  // on the map: beside check readings, which realises it, the step before make bills; its reason
  const mA=fin(t,tMa+0.2,0.6);if(mA>0.01)withA(ctx,mA,()=>{baEl(ctx,140,200,380,100,"check readings",BA_BUS,"process",{hi:pulseAt(t,w("map","check readings")-0.1,1.4)});baEl(ctx,140,420,380,100,"make bills",BA_BUS,"process");
    arrowTo(ctx,330,306,330,412,SOFT,0.8,{lw:3,head:12});b5_realise(ctx,526,250,eX-6,250,clamp((t-tMa-1.2)/0.8,0,1),B5_MOT);
    withA(ctx,fin(t,w("map","reason")-0.2,0.5),()=>tag(ctx,eX,eY+340,"reason: billing's service level",B5_MOT,{size:28}));});
  // at Sehdeh, the shares set first and the outlets built to them; here, the expectation first, and the check built from it
  b5_inset(ctx,140,560,fin(t,tSe-0.2,0.6)*(1-fin(t,tFi+0.4,0.5)),t,{l1:fin(t,w("sehdeh","set first")-0.2,0.4),l2:fin(t,w("sehdeh","the outlets built")-0.2,0.4),span:fin(t,w("sehdeh","the outlets built")-0.2,0.8),outHi:[0,1,2].map(i=>pulseAt(t,w("sehdeh","set first")+i*0.3,1.0))});
  const kA=fin(t,w("first","the check")-0.2,0.6);if(kA>0.01){withA(ctx,kA,()=>arrowTo(ctx,eX+640,eY+306,eX+640,eY+380,TECH,0.85,{lw:3,head:12}));
    b5_check(ctx,eX,eY+386,760,["every active meter: a reading by 10:00","no more than 1 in 100 estimated"],{a:kA,hi:pulseAt(t,w("first","built from it")-0.1,1.4)});}
  withA(ctx,fin(t,w("first","the expectation comes first")-0.2,0.5)*(1-fin(t,sc.dur-0.8,0.5)),()=>tag(ctx,eX+380,eY-36,"the expectation comes first",B5_MOT,{align:"center",size:28}));
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Fixed at the source ---------- */
// the meter system, accountable for its own readings; the data platform, which only reads it and billing; and what each checks. The
// camera starts on the meter system and steps back as the platform, then billing, come in
scene("source",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});
  const tCh=c("checks"),tRd=c("reads"),tOn=c("only"),tBo=c("both"),tLe=c("lead"),tNw=w("reads","never writes back")-0.3,tFx=w("reads","fixed at the source")-0.3,tAc=w("both","billing's accounts")-0.3,tPf=w("both","runs on the platform")-0.3;
  ctx.save();focus(ctx,t,[[0,400,430,1.35],[tRd-0.6,760,470,1.1],[tAc-0.8,960,520,1.0]],2.0);
  // the meter system, with its owner and the team that runs it, and what it checks of its own
  arrive(ctx,330,240,t,0.2,()=>{baEl(ctx,100,180,460,110,"meter system",BA_APP,"component",{hi:pulseAt(t,w("source","the meter system")-0.1,1.6)+0.8*pulseAt(t,tFx+0.3,1.6)});
    tag(ctx,100,330,"owner: Grace",TRUST,{size:28});tag(ctx,100,384,"run by: the metering team",BA_NET,{size:28});},{dy:-10});
  [["checks each reading as it comes",w("checks","checks each one")],["makes the estimates",w("checks","makes the estimates")],["reports what's missing by 10:00",w("checks","reports what's missing")]].forEach(([s_,t0],k)=>{if(t<t0-0.2)return;
    arrive(ctx,330,470+k*58,t,t0-0.2,()=>{b5_mark(ctx,124,460+k*58,15,true,1);T(ctx,s_,152,470+k*58,{w:700,size:30});},{dy:8});});
  withA(ctx,fin(t,w("source","accountable")-0.2,0.5),()=>tag(ctx,330,140,"accountable for its readings",BA_NET,{align:"center",size:28}));
  // the data platform: it reads the meter system, one way, and never writes back
  const pA=fin(t,tRd-0.2,0.6);if(pA>0.01)withA(ctx,pA,()=>{baEl(ctx,840,180,460,110,"data platform",TECH,"component");
    arrowTo(ctx,570,214,830,214,TECH,0.9,{lw:4,head:14,p:clamp((t-tRd)/0.8,0,1)});T(ctx,"reads",700,196,{w:700,size:28,align:"center",color:rgba(TECH,1)});
    const nb=fin(t,tNw,0.5);if(nb>0.01)withA(ctx,nb,()=>{ctx.save();ctx.setLineDash([9,8]);arrowTo(ctx,830,262,580,262,BA_RED,0.75,{lw:3,head:12});ctx.restore();b5_mark(ctx,700,262,16,false,1);T(ctx,"never writes back",700,316,{w:700,size:28,align:"center",color:rgba(BA_RED,1)});});});
  // a problem found goes to the source's own team, which fixes it there
  const fA=fin(t,tFx,0.5);if(fA>0.01)withA(ctx,fA*(1-fin(t,tOn-0.2,0.5)),()=>tag(ctx,330,680,"fixed at the source, by its own team",BA_NET,{align:"center",size:28}));
  // billing, read too; the one check the source can't run, on the platform; and its result, each billing morning, to the metering lead
  const bA=fin(t,tAc,0.6);if(bA>0.01)withA(ctx,bA,()=>{baEl(ctx,1420,180,400,110,"billing",BA_APP,"component");tag(ctx,1420,330,"owner: head of retail",TRUST,{size:28});arrowTo(ctx,1410,214,1310,214,TECH,0.9,{lw:4,head:14,p:clamp((t-tAc)/0.8,0,1)});
    T(ctx,"active accounts",1362,166,{w:700,size:28,align:"center",color:rgba(TECH,1)});});
  const kA=fin(t,tOn-0.1,0.6);if(kA>0.01)withA(ctx,kA,()=>{arrowTo(ctx,1070,296,1070,404,TECH,0.85,{lw:3,head:12,p:clamp((t-tOn)/0.6,0,1)});
    b5_check(ctx,790,410,560,["every active account:","a reading by 10:00"],{kicker:"check · on the platform",mark:fin(t,tLe,0.4),ok:false});
    withA(ctx,fin(t,tPf,0.5),()=>tag(ctx,1070,626,"reads both: readings and accounts",TECH,{align:"center",size:28}));});
  const lA=fin(t,tLe-0.1,0.5);if(lA>0.01)withA(ctx,lA,()=>{arrowTo(ctx,790,540,650,660,BA_RED,0.85,{lw:3,head:12,p:clamp((t-tLe)/0.8,0,1)});
    glass(ctx,140,650,500,150,18,BA_NET,{glow:14+14*pulseAt(t,tLe+0.6,1.6),ea:0.85,fill:"rgba(8,12,22,0.95)"});T(ctx,"each billing morning",166,696,{f:"mono",w:500,size:28,color:rgba(BA_NET,1)});T(ctx,"2 active accounts, no reading",166,752,{w:700,size:30});
    tag(ctx,390,836,"to: the metering lead",TRUST,{align:"center",size:28});});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. The data practice ---------- */
// an access line across the short gap between a process and the concept it reads, as Processes, as deep as data needs draws them
function b5_pacc(ctx,x0,y0,x1,y1,p){if(p<=0.01)return;const P_=[[x0,y0],[x0+36,y0],[x1-36,y1],[x1,y1]],n=32,m=Math.round(n*clamp(p,0,1));ctx.save();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(BA_INF,0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x0,y0);
  for(let i=1;i<=m;i++){const u=i/n,v=1-u,x=v*v*v*P_[0][0]+3*v*v*u*P_[1][0]+3*v*u*u*P_[2][0]+u*u*u*P_[3][0],y=v*v*v*P_[0][1]+3*v*v*u*P_[1][1]+3*v*u*u*P_[2][1]+u*u*u*P_[3][1];ctx.lineTo(x,y);}ctx.stroke();ctx.restore();}
// ArchiMate's aggregation: a line with a hollow diamond at the whole's end (x0, y0); p draws it
function b5_agg(ctx,x0,y0,x1,y1,p,col){if(p<=0.01)return;const u=clamp(p,0,1),an=Math.atan2(y1-y0,x1-x0),dx=Math.cos(an),dy=Math.sin(an),sx=x0+dx*24,sy=y0+dy*24;ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(lerp(sx,x1,u),lerp(sy,y1,u));ctx.stroke();ctx.fillStyle="rgba(8,10,20,1)";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+dx*12-dy*8,y0+dy*12+dx*8);ctx.lineTo(sx,sy);ctx.lineTo(x0+dx*12+dy*8,y0+dy*12-dx*8);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  arrive(ctx,500,120,t,0.2,()=>{T(ctx,"the data practice, on the map",120,128,{w:800,size:38});tag(ctx,1800-tw(ctx,"business layer",28,700)-26,116,"business layer",BA_BUS,{size:28});},{dy:-10});
  const tBu=c("bundle"),tCo=c("contract"),at={product:w("product","a data product")-0.3,products:w("bundle","the service")-0.3,contract:w("bundle","its contract")-0.3};
  // the lines of the films before, drawn first, so the elements lie over them
  baPracticeAccess(ctx,"requests","cp",1,{a:0.75});baPracticeAccess(ctx,"requests","account",1,{lift:330,a:0.75});
  ["product","products","contract"].forEach(id=>{const e=BA_PRACTICE.find(r=>r[0]===id),v=fin(t,at[id],0.6);if(e&&v>0.01)withA(ctx,v,()=>{ctx.fillStyle="rgb(6,9,18)";rr(ctx,e[4]+2,e[5]+2,e[6]-4,e[7]-4,14);ctx.fill();});});
  baPractice(ctx,t,{film:5,at,pre:fin(t,0.4,0.8),owners:true,ownersA:1,hi:{product:pulseAt(t,w("bundle","ArchiMate product")-0.2,1.6),contract:pulseAt(t,w("contract","Its contract")-0.2,1.8)}});
  baPracticeLine(ctx,"team","tickets",1,BA_BUS);baPracticeLine(ctx,"tickets","requests",1,BA_BUS);
  ["p_request","p_build","p_source"].forEach((id,k)=>{const e=BA_PRACTICE.find(r=>r[0]===id);if(e)b5_pacc(ctx,e[4]+e[6],e[5]+e[7]/2,1100,490+k*18,1);});
  // the product bundles the service that provides it and its contract: ArchiMate's aggregation, from the product to each
  b5_agg(ctx,600,658,520,658,clamp((t-at.products-0.4)/0.7,0,1),BA_BUS);b5_agg(ctx,800,706,800,742,clamp((t-at.contract-0.4)/0.5,0,1),BA_BUS);
  // what its contract holds
  const kA=fin(t,tCo-0.1,0.5);if(kA>0.01)withA(ctx,kA,()=>{glass(ctx,120,722,440,138,18,BA_BUS,{glow:12,ea:0.85,fill:"rgba(12,12,8,0.96)"});
    [["what each reader expects",w("contract","what each of its readers expects")],["set by that reader's owner",w("contract","set by that reader's owner")],["checks built from it",w("contract","its checks")]].forEach(([s_,t0],k)=>withA(ctx,fin(t,t0-0.2,0.4),()=>T(ctx,s_,144,762+k*36,{w:700,size:28,color:k===1?rgba(TRUST,1):k===2?rgba(TECH,1):rgba(INK,0.95)})));});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. Kept, and changed ---------- */
// what keeps a practice maturing: the owner writes it down, the check follows, the business changes, and round again
function b5_loop(ctx,t,a,o){if(a<=0.01)return;o=o||{};withA(ctx,a,()=>{const cx=960,cy=470,R=230,N=[["the owner writes it down",TRUST],["the check follows",TECH],["the business changes",BA_BUS]];
  ctx.save();ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=3;for(let k=0;k<3;k++){const a0=-Math.PI/2+k*TAU/3+0.42,a1=a0+TAU/3-0.84;ctx.beginPath();ctx.arc(cx,cy,R,a0,a0+(a1-a0)*clamp((o.p||1)*3-k,0,1));ctx.stroke();
    const ae=a1;if((o.p||1)*3-k>=1){const x=cx+Math.cos(ae)*R,y=cy+Math.sin(ae)*R,dir=ae+Math.PI/2;ctx.fillStyle=rgba(SOFT,0.8);ctx.beginPath();ctx.moveTo(x+Math.cos(dir)*12,y+Math.sin(dir)*12);ctx.lineTo(x+Math.cos(dir+2.5)*12,y+Math.sin(dir+2.5)*12);ctx.lineTo(x+Math.cos(dir-2.5)*12,y+Math.sin(dir-2.5)*12);ctx.closePath();ctx.fill();}}ctx.restore();
  N.forEach(([s_,col],k)=>{const an=-Math.PI/2+k*TAU/3,x=cx+Math.cos(an)*R,y=cy+Math.sin(an)*R;tag(ctx,x,y,s_,col,{align:"center",size:30});});
  T(ctx,"keeps maturing",cx,cy+12,{w:800,size:36,align:"center",color:rgba(INK,0.95)});});}
// a bracket down the right of the map, from layer l0 to l1, with its label, as What the business owns draws the series' part
function b5_rbr(ctx,R,l0,l1,x,lines,col,a,p){if(a<=0.01)return;const y0=R[l0][1]+4,y1=R[l1][1]+R[l1][3]-4;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
  ctx.moveTo(x-12,y0);ctx.lineTo(x,y0);ctx.lineTo(x,lerp(y0,y1,ease(clamp(p==null?1:p,0,1))));if((p==null?1:p)>0.75)ctx.lineTo(x-12,y1);ctx.stroke();ctx.restore();
  const ym=(y0+y1)/2-(lines.length-1)*19;lines.forEach((l,i)=>T(ctx,l,x+22,ym+11+i*38,{w:800,size:30,color:rgba(col,1)}));});}
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tPu=c("pumps"),tHa=c("half"),tKe=c("keep"),tUt=c("utility"),tPr=c("prices"),tMa=c("matures"),tNx=c("next");
  const tg=(s_,x,y,col,a,o)=>baTagAt(ctx,S,x,y,s_,col,Object.assign({a},o||{}));
  // four places, each dissolving into the next: Sehdeh's shares held; the deep wells and the water fallen; the words, and the utility;
  // then Tomás's map, the business layer drawn
  const bA=fin(t,tPu-0.9,1.2),cA=fin(t,tKe-0.6,1.0),dA=fin(t,tNx-0.8,1.1);
  if(bA<0.99){setScreen(ctx,S);ctx.save();focus(ctx,t,[[0,1120,560,1.5],[w("held","the tunnel cleaned")-0.5,1000,520,1.15]],2.4);
    b5_plain(ctx,t,{outHi:[0,1,2].map(i=>pulseAt(t,w("held","the shares held")+i*0.3,1.0)),lit:pulseAt(t,w("held","the tunnel cleaned")-0.1,2.0),litP:1});
    B5_OY.forEach((oy,i)=>tg(B5_SH[i]+" · "+B5_HAM[i].name,B5_WX+28,oy,BA_SAND,fin(t,w("held","the shares held")+i*0.3,0.4)*(1-fin(t,tPu-1.4,0.4)),{align:"left",dy:(i-1)*12}));
    ctx.restore();eaYear(ctx,80,80,"more than 300 years",CLAY,fin(t,0.4,0.6)*(1-fin(t,tPu-1.2,0.4)));}
  // the deep wells: a pump drawing the water down faster than rain puts it back; the qanat's water gone, and its fields dry
  if(bA>0.01&&cA<0.99)withA(ctx,bA,()=>{setScreen(ctx,S);ctx.save();const tWl=w("pumps","deep wells")-0.3,tFa=w("pumps","faster than rain")-0.3,tRd=w("half","run dry")-0.3;
    focus(ctx,t,[[tPu-1.0,980,640,1.0],[tHa-0.2,1060,660,0.94]],2.4);
    const dr=clamp((t-tFa)/4.2,0,1),qa=clamp((t-tFa-1.2)/3.2,0,1);
    b5_section(ctx,t,{water:[[BA_XM,lerp(BA_XO+30,BA_XM+6,qa)]],blockA:0,chTo:1-qa,wet:[0,1,2,3].map(()=>lerp(0.85,0.18,clamp((t-tRd)/2.0,0,1))),own:[1,1,1,1].map(v=>v*(1-fin(t,tRd+0.6,1.4))),
      drop:dr,gw:lerp(1,0.55,dr),well:fin(t,tWl,0.8),pump:fin(t,tWl+0.6,0.6),dusk:0.35*fin(t,tRd,2.0)});
    tg("deep wells, motor pumps",B5_WELL,ba_ys(B5_WELL)-60,BA_RED,fin(t,tWl+0.2,0.5)*(1-fin(t,tHa-0.4,0.4)),{dy:-80});
    tg("faster than rain puts it back",B5_WELL,ba_ys(B5_WELL)+170,BA_WATER,fin(t,tFa+0.4,0.5)*(1-fin(t,tHa-0.4,0.4)),{dy:0});
    ctx.restore();eaYear(ctx,80,80,"after the Second World War",CLAY,fin(t,tPu,0.6)*(1-fin(t,tHa-0.8,0.4)));
    const hA=fin(t,tHa,0.6);if(hA>0.01)withA(ctx,hA,()=>baCount(ctx,1200,90,640,200,"about half","of Iran's qanats, dry in fifty years","Iran's hydrologists",BA_WATER,{hi:pulseAt(t,tHa+0.4,1.6)}));
    withA(ctx,fin(t,w("half","from poor upkeep")-0.2,0.5),()=>tag(ctx,1520,330,"poor upkeep, or wells lowering the water",BA_SAND,{align:"center",size:28}));});
  // the words; then the utility: billing's expectation, its owner, and the change that prices by the hour will bring; then the loop
  if(cA>0.01&&dA<0.99)withA(ctx,cA,()=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});const wOut=1-fin(t,tUt-0.6,0.5);
    withA(ctx,wOut,()=>{T(ctx,"rules last only while people keep them,",960,450,{w:800,size:40,align:"center"});withA(ctx,fin(t,w("keep","and change them")-0.2,0.5),()=>T(ctx,"and change them when the world changes",960,520,{w:800,size:40,align:"center",color:rgba(BA_BUS,1)}));});
    const uA=fin(t,tUt-0.2,0.6)*(1-fin(t,tMa-0.4,0.5));if(uA>0.01)withA(ctx,uA,()=>{ctx.save();drift(ctx,t,sc,{z:0.012,x:960,y:500});const tCg=w("prices","a reading for every hour")-0.3,ch=fin(t,tCg,0.6);
      b5_expect(ctx,540,150,840,{lines:["by 10:00 on billing day",ch>0.5?"a reading every hour, for every active meter":"a reading or an estimate for every active meter","no more than 1 in 100 estimated"],l:[1,ch>0.5?fin(t,tCg+0.2,0.4):1-fin(t,tCg-0.1,0.3),1],lineCol:[null,ch>0.5?AMBER:null,null],owner:1,agreed:1,hi:pulseAt(t,w("utility","an owner")-0.2,1.8)});
      withA(ctx,fin(t,w("prices","change by the hour")-0.2,0.5),()=>tag(ctx,960,110,"prices that change by the hour",AMBER,{align:"center",size:30}));
      const kA=fin(t,w("prices","its check will follow")-0.2,0.6);if(kA>0.01){arrowTo(ctx,960,456,960,516,TECH,0.85*kA,{lw:3,head:12});b5_check(ctx,540,522,840,["rebuilt from what's written"],{a:kA,hi:pulseAt(t,w("prices","will follow")-0.1,1.4)});}
      ctx.restore();});
    b5_loop(ctx,t,fin(t,tMa-0.2,0.6)*(1-fin(t,tNx-0.9,0.5)),{p:clamp((t-tMa)/1.4,0,1)});});
  // Tomás's map: the business layer drawn, and the data architecture next, starting from it
  const eOut=1-fin(t,B+0.9,0.7);if(dA>0.01)withA(ctx,dA,()=>{wallBg(ctx,S,t);if(eOut>0.01)withA(ctx,eOut,()=>{ctx.save();drift(ctx,t,sc,{z:0.015,x:880,y:520});
    const tDr=w("next","is drawn")-0.3,tDa=w("next","Data architecture")-0.3,part=fin(t,tNx-0.4,0.8);
    const R=layerStack(ctx,460,236,640,{sh:72,gap:20,p:1,fill:[0,part*0.55,part*0.55,part*0.55,0,0],hi:[0,0.35*part,0.35*part,0.35*part+pulseAt(t,tDa+0.4,1.8),0,0]});
    b5_rbr(ctx,R,1,3,1190,["business architecture","for data"],BAC,part,clamp((t-tNx+0.3)/1.0,0,1));
    withA(ctx,fin(t,tDr,0.5),()=>{const yd=(R[1][1]+R[3][1]+R[3][3])/2+90;kt_gtick(ctx,1230,yd-10,18,1);T(ctx,"drawn",1260,yd,{w:800,size:30,color:rgba(TRUST,1)});});
    // data architecture, the next series, works in the information layer: named on the left, an arrow to it
    const nA=fin(t,tDa,0.6);if(nA>0.01){const ym=R[3][1]+R[3][3]/2,x1=R[3][0]-14;withA(ctx,nA,()=>{T(ctx,"next:",80,ym-8,{w:800,size:30,color:rgba(SOFT,1)});T(ctx,"data architecture",80,ym+30,{w:800,size:30,color:rgba(LAY6[3][1],1)});});
      arrowTo(ctx,350,ym+10,lerp(350,x1,ease(clamp((t-tDa)/1.0,0,1))),ym+10,SOFT,0.8*nA,{lw:3,head:12});}
    arrive(ctx,1760,760,t,tNx-0.6,()=>baPersonR(ctx,"tomas",1760,1040,0.8,{t,expr:"calm"}),{dy:20});
    ctx.restore();});});
  vign(ctx,S);
  baEnd(ctx,S,t,B+1.4,"Rules and expectations the business owns","The business writes down what it expects, "+ba_nb("and the check follows."),"Film 5 of 5");});

// where the chapters meet (From words to data's joins.js): Written down by its owners carries Late, for whom?'s billing day on, so its
// camera carries on from there and the day stays put while billing moves to ten. Where the whole picture changes, what was there
// leaves first and the next comes in over its own background, so no words show through other words: the title card leaves before
// Tomás's note comes onto the wall, the note's cards before the policy's, the wall before the flow, the flow before the day, the
// expectation before the source and its platform, that before the data practice's map, and the map before Sehdeh
const CHAPTER_JOINS={glide:["set"],leave:["note","policy","decide","late","source","practice","end"],
  bare:{note:(ctx,S,t)=>{wallBg(ctx,S,t);vign(ctx,S);},policy:(ctx,S,t)=>{wallBg(ctx,S,t);vign(ctx,S);},decide:(ctx,S,t)=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});vign(ctx,S);},
    late:(ctx,S,t)=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});vign(ctx,S);},source:(ctx,S,t)=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});vign(ctx,S);},
    practice:(ctx,S,t)=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});vign(ctx,S);},end:(ctx,S,t)=>{setScreen(ctx,S);ctx.fillStyle="#1a120c";ctx.fillRect(0,0,W,H);vign(ctx,S);}}};
