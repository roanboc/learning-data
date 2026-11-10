/* ===== Tools are hands, and every hand is a permission: the film's own kit =====
   What only this film needs, each name with the prefix th_ (or TH_): the colours of Oxford's old library, the people of its past (specs
   for ag_person, with the collars and caps of their time drawn over them), and small helpers the scenes share. Nobody of the past is
   drawn as a likeness: they are dressed for their time, with the module's adult proportions, one three-quarter head and arms down. */

const TH={stone:[214,190,150],stoneDk:[178,152,114],stoneLt:[232,214,180],
  oak:[132,96,64],oakDk:[88,62,42],oakLt:[176,136,96],
  ceilA:[186,158,110],ceilB:[126,130,122],beam:[100,74,52],
  glass:[228,234,230],glassLt:[248,249,242],lead:[104,104,108],
  floor:[168,138,104],floorDk:[126,100,74],
  parch:[238,226,198],parchDk:[212,196,162],ink:[62,44,32],
  linen:[244,240,231],lace:[248,246,240],iron:[70,68,70],
  label:[74,54,38]};

// the place and year, at the top left, in the frame's own coordinates (as the lab's kicker is)
function th_place(ctx,S,text,a,k){if(a<=0)return;setScreen(ctx,S);const w=ag_tw(ctx,text,{w:700,size:30})+56;ctx.save();if(k!=null)ag_about(ctx,96+w/2,100,lerp(0.6,1,k));
  ag_pill(ctx,96+w/2,100,text,{a});ctx.restore();}
// the film's kicker, over the lab's chapters
function th_kick(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ag_kicker(ctx,"2.3","Tools are hands",{a});}
// a value computed once per chapter (the cue times of its words)
function th_once(sc,k,f){const m=sc.__th||(sc.__th={});return m[k]||(m[k]=f());}

/* ---------------------------------------------------------------- the people of its past
   Specs for ag_person. top.kind "gown" and "doublet" are this film's: the shared code paints a plain body for a kind it doesn't know,
   and top.paint adds the gown's open front or the doublet's buttons. A collar (P.collar) is drawn over the neck after the person, in
   figure space, by th_person: a ruff, a plain falling band, a lace collar or a scholar's hood. A cap or a small pointed beard is
   painted with the head (hat.paint). */
function th_gownFront(face){return (c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  // the gown open down the front over a darker doublet: two facings, the near one wider, and the doublet between them
  ag_soft(c,cc=>{cc.moveTo(276,600);cc.bezierCurveTo(296,700,312,860,318,1100);cc.lineTo(352,1100);cc.bezierCurveTo(348,880,350,720,356,604);cc.closePath();},
    ag_dk(P.top.c,0.3),ag_lt(P.top.c,0.12),340,700,160,null);
  for(const [x0,x1,w] of [[262,300,22],[356,346,16]]){c.strokeStyle=rgba(face,1);c.lineWidth=w;c.lineCap="butt";c.beginPath();c.moveTo(x0,596);c.bezierCurveTo(x0+12,700,x1-4,860,x1,1100);c.stroke();}
  c.strokeStyle=rgba(ag_lt(face,0.3),0.5);c.lineWidth=2;c.beginPath();c.moveTo(272,600);c.bezierCurveTo(284,700,306,860,310,1100);c.stroke();
  c.restore();};}
function th_doubletFront(btn){return (c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  // the doublet's front seam and its small round buttons, close together, and the seam at the waist
  c.strokeStyle=rgba(ag_dk(P.top.c,0.45),0.8);c.lineWidth=2.4;c.beginPath();c.moveTo(312,612);c.bezierCurveTo(316,760,322,900,326,1100);c.stroke();
  for(let i=0;i<11;i++){const u=i/10,y=lerp(640,1000,u),x=lerp(316,325,u)+3;ag_soft(c,cc=>cc.arc(x,y,4.6,0,TAU),btn,ag_lt(btn,0.5),x+2,y-2,6,null);}
  c.strokeStyle=rgba(ag_dk(P.top.c,0.5),0.5);c.lineWidth=3;c.beginPath();c.moveTo(118,1010);c.quadraticCurveTo(270,1030,412,1006);c.stroke();
  c.restore();};}
// a close cap, worn by a scholar of the 1400s: it follows the skull over the hair, and stops above the ear
function th_cap(col){return (c,P)=>{ag_soft(c,cc=>{cc.moveTo(210,392);cc.bezierCurveTo(204,330,240,290,300,286);cc.bezierCurveTo(352,284,384,312,388,352);
    cc.bezierCurveTo(352,340,300,338,266,352);cc.bezierCurveTo(244,362,228,380,222,398);cc.closePath();},col,ag_lt(col,0.35),330,300,90,"rgba(0,0,0,0.4)",10);
  c.strokeStyle=rgba(ag_lt(col,0.25),0.55);c.lineWidth=3;c.beginPath();c.moveTo(222,396);c.bezierCurveTo(244,362,300,338,388,352);c.stroke();};}
// a moustache and a small pointed beard, as the 1630s and 1640s wore them
function th_pointed(col){return (c,P)=>{
  ag_soft(c,cc=>{cc.moveTo(352,476);cc.bezierCurveTo(358,468,374,466,388,470);cc.bezierCurveTo(394,466,398,460,400,456);cc.bezierCurveTo(400,466,394,474,386,476);
    cc.bezierCurveTo(374,476,362,478,352,480);cc.closePath();},col,ag_lt(col,0.3),380,468,20,null);
  ag_soft(c,cc=>{cc.moveTo(338,518);cc.bezierCurveTo(346,526,360,528,370,520);cc.bezierCurveTo(368,536,360,550,352,558);cc.bezierCurveTo(344,546,338,532,338,518);cc.closePath();},
    col,ag_lt(col,0.3),360,526,24,"rgba(0,0,0,0.3)",4);};}

const TH_PEOPLE={
  // a scholar of the 1400s: a dark wool gown, a hood round the shoulders, a close cap
  scholar15:{key:"th_scholar15",name:"A scholar of the 1400s",skin:[226,190,158],hair:{style:"cropped",c:[92,70,52]},
    top:{kind:"gown",c:[78,66,74],paint:th_gownFront([58,50,58])},hat:{paint:th_cap([46,40,48])},collar:"hood",hood:[112,72,62],breath:0.25},
  // a scholar of the 1570s, in the emptied room: a gown and a small ruff
  scholar70:{key:"th_scholar70",name:"A scholar of the 1570s",skin:[212,172,138],hair:{style:"side",c:[64,50,40]},beard:[70,54,42],
    top:{kind:"gown",c:[60,56,62],paint:th_gownFront([44,42,48])},collar:"ruffS",breath:0.27},
  // Thomas Bodley in 1598: a black doublet, a white ruff, a short beard going grey; his face is ours, not a portrait
  bodley:{key:"th_bodley",name:"Thomas Bodley",skin:[228,192,160],hair:{style:"side",c:[104,92,82]},beard:[116,104,94],
    top:{kind:"doublet",c:[44,42,46],paint:th_doubletFront([92,88,84])},collar:"ruff",breath:0.24},
  // a reader of 1602: a gown over a doublet, a ruff
  reader02:{key:"th_reader02",name:"A reader of 1602",skin:[220,180,146],hair:{style:"side",c:[72,52,38]},
    top:{kind:"gown",c:[70,64,58],paint:th_gownFront([50,46,44])},collar:"ruffS",breath:0.28},
  // King Charles the First in 1645: a dark doublet, a lace falling collar, long hair, a moustache and a small pointed beard
  king:{key:"th_king",name:"King Charles the First",skin:[232,200,174],hair:{style:"long",c:[82,60,44]},
    top:{kind:"doublet",c:[58,50,62],paint:th_doubletFront([168,152,120])},hat:{paint:th_pointed([86,64,48])},collar:"lace",breath:0.23},
  // the librarian in 1645: a black scholar's gown and a plain white band
  librarian:{key:"th_librarian",name:"The librarian",skin:[222,184,152],hair:{style:"side",c:[78,64,52]},
    top:{kind:"gown",c:[40,38,42],paint:th_gownFront([30,30,34])},collar:"band",breath:0.26},
  // a reader of today, at the admissions desk
  today:{key:"th_today",name:"A reader today",skin:[192,146,114],hair:{style:"bob",c:[42,32,28]},top:{kind:"sweater",c:[150,124,112]},breath:0.3}
};

/* the collars, in figure space (the neck meets the shoulders at 296, 596; the chin's lowest point is at about y 531). Each is drawn
   below the jaw, so it never covers the face, and over the neck's foot, as a collar closes over it */
/* a ruff: a wheel of pleated white linen round the neck, seen nearly edge on, over the doublet's high collar: its top, foreshortened
   and folded, and its rim with the figure-of-eight pleats, both scalloped; the head stays in front of it (the head's shape is left out,
   turned and breathing as ag_person draws it), and it hides the neck */
function th_ruff(c,P,big,o){const cx=big?304:302,cy=big?541:542,rx=big?122:102,ry=big?10:9,th=big?44:38,gc=P.top.c;
  c.save();c.beginPath();c.rect(-200,-200,1100,1500);th_headPath(c,o);c.clip("evenodd");
  // the doublet's standing collar, closing over the neck's foot
  const col=cc=>{cc.moveTo(cx-78,cy);cc.bezierCurveTo(cx-80,cy+20,cx-84,cy+th,cx-88,cy+th+12);cc.bezierCurveTo(cx-40,cy+th+22,cx+40,cy+th+24,cx+74,cy+th+10);
    cc.bezierCurveTo(cx+70,cy+th,cx+66,cy+20,cx+64,cy);cc.closePath();};
  ag_soft(c,col,ag_dk(gc,0.1),ag_lt(gc,0.18),cx+50,cy+40,90,"rgba(0,0,0,0.35)",8);
  // its soft shadow on the chest and shoulders
  c.save();c.filter="blur(8px)";c.fillStyle="rgba(26,20,16,0.32)";c.beginPath();c.ellipse(cx-8,cy+th+14,rx*0.97,ry+10,0,0,TAU);c.fill();c.restore();
  // the rim: the folds' edges as figure-of-eight loops, evenly spaced across, rounding off at both ends
  const rim=cc=>{cc.moveTo(cx+rx,cy+th);cc.ellipse(cx,cy+th,rx,ry,0,0,Math.PI);cc.ellipse(cx,cy,rx,ry,0,Math.PI,0,true);cc.closePath();};
  ag_soft(c,rim,[212,208,200],[250,248,242],cx+rx*0.5,cy+th,rx,"rgba(60,56,52,0.32)",6);
  // the folds go round the ring evenly, so they crowd together towards its ends; each has a shaded half, and its edge is a figure of eight
  c.save();ag_shape(c,rim);c.clip();c.lineCap="round";const nP=big?30:26,fx=k=>cx-rx*Math.cos(Math.PI*k/nP);
  for(let k=0;k<nP;k++){const x0=fx(k),x1=fx(k+1),xm=(x0+x1)/2,am=Math.PI*(k+0.5)/nP;c.fillStyle="rgba(122,116,108,"+(0.13+0.2*Math.abs(Math.cos(am)))+")";
    c.fillRect(xm,cy-ry-2,x1-xm,th+2*ry+4);}
  c.strokeStyle="rgba(112,106,98,0.5)";c.lineWidth=2;
  for(let k=1;k<nP;k++){const x0=fx(k),u=(x0-cx)/rx,y0=cy+Math.sqrt(Math.max(0,1-u*u))*ry,w=(fx(k+1)-fx(k-1))*0.2+0.6;c.beginPath();c.moveTo(x0,y0);
    c.bezierCurveTo(x0-w,y0+th*0.22,x0-w,y0+th*0.42,x0,y0+th*0.5);c.bezierCurveTo(x0+w,y0+th*0.58,x0+w,y0+th*0.78,x0,y0+th+1);c.stroke();}
  c.restore();
  // the top, foreshortened: its folds run out from the neck
  const top=cc=>{cc.moveTo(cx+rx,cy);cc.ellipse(cx,cy,rx,ry,0,0,TAU);};
  ag_soft(c,top,[230,228,222],[255,255,252],cx+rx*0.45,cy-ry*0.3,rx*1.2,"rgba(60,56,52,0.2)",5,0.35);
  c.save();ag_shape(c,top);c.clip();c.lineCap="round";c.lineWidth=1.6;
  for(let k=0;k<nP*2;k++){const a=k/(nP*2)*TAU,ca=Math.cos(a),sa=Math.sin(a);c.strokeStyle="rgba(124,118,110,"+(0.32-0.12*(0.5+0.5*ca))+")";c.beginPath();
    c.moveTo(cx+ca*rx*0.4,cy+sa*ry*0.4);c.lineTo(cx+ca*rx,cy+sa*ry);c.stroke();}
  c.restore();
  // both edges scalloped, where each fold turns
  const scal=(yo,from,to,col2)=>{c.strokeStyle=col2;c.lineWidth=1.7;c.beginPath();for(let k=0;k<=nP;k++){const x0=fx(k),u=(x0-cx)/rx,y0=cy+yo+Math.sqrt(Math.max(0,1-u*u))*ry*(from);
      if(!k)c.moveTo(x0,y0);else{const xm=(fx(k-1)+x0)/2,um=(xm-cx)/rx,ym=cy+yo+Math.sqrt(Math.max(0,1-um*um))*ry*from;c.quadraticCurveTo(xm,ym+to,x0,y0);}}c.stroke();};
  scal(0,1,3.5,"rgba(150,144,136,0.6)");scal(th,1,4.5,"rgba(130,124,116,0.55)");
  c.restore();}
// the head's outline as ag_person turns it (o.nod) and breathes it (a little less than the body), in the collar's figure space
function th_headPath(c,o){const br=o&&o.br||0;c.save();c.translate(AG_FIG.piv[0],AG_FIG.piv[1]-br*0.3);c.rotate(o&&o.nod||0);c.translate(-AG_FIG.piv[0],-AG_FIG.piv[1]);AG_F.head(c);c.restore();}
// a plain falling band: white linen lying flat from the neck over the chest, in two halves
function th_bandPath(lace){return c=>{if(lace){c.moveTo(226,560);c.bezierCurveTo(196,590,170,640,172,690);c.bezierCurveTo(230,716,290,718,316,700);
    c.bezierCurveTo(350,716,404,708,436,684);c.bezierCurveTo(430,640,400,612,366,600);c.bezierCurveTo(330,618,262,612,226,560);c.closePath();return;}
  c.moveTo(232,562);c.bezierCurveTo(222,590,214,622,220,656);c.bezierCurveTo(258,672,292,672,314,660);c.bezierCurveTo(338,672,370,668,388,652);
  c.bezierCurveTo(390,630,380,610,364,600);c.bezierCurveTo(330,618,266,612,232,562);c.closePath();};}
function th_band(c,P,lace){const B=th_bandPath(lace);
  c.save();c.filter="blur(6px)";c.fillStyle="rgba(30,24,20,0.22)";c.translate(-6,8);ag_shape(c,B);c.fill();c.restore();
  ag_soft(c,B,lace?TH.lace:TH.linen,[255,255,255],380,610,200,"rgba(70,64,58,0.3)",8);
  c.strokeStyle="rgba(120,112,104,0.45)";c.lineWidth=2;c.beginPath();c.moveTo(314,632);c.lineTo(314,lace?700:660);c.stroke();
  if(lace){// the lace: a scalloped edge and a fine pattern of small openings near it
    c.save();ag_shape(c,B);c.clip();c.fillStyle="rgba(150,144,138,0.28)";const R=ag_rnd(9);
    for(let i=0;i<120;i++){const u=R(),x=lerp(176,432,u),y=lerp(668,690,R())+Math.sin(u*Math.PI)*14;c.beginPath();c.arc(x,y,2.2+R()*1.6,0,TAU);c.fill();}c.restore();
    c.strokeStyle="rgba(140,134,126,0.6)";c.lineWidth=1.6;c.beginPath();for(let i=0;i<=26;i++){const u=i/26,x=lerp(172,436,u),y=lerp(690,684,u)+Math.sin(u*Math.PI)*22;
      if(!i)c.moveTo(x,y);else c.quadraticCurveTo(x-5,y+9,x,y);}c.stroke();}
  // the neck's foot, closed over: a soft line where the band meets it
  c.strokeStyle="rgba(150,140,128,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(232,562);c.bezierCurveTo(266,612,330,618,364,600);c.stroke();}
// a scholar's hood, lying round the shoulders in soft folds, its lining showing at the edge
function th_hood(c,P){const col=P.hood||[110,70,60],H_=cc=>{cc.moveTo(214,556);cc.bezierCurveTo(196,590,190,630,206,664);cc.bezierCurveTo(260,690,340,690,398,660);
    cc.bezierCurveTo(410,630,400,600,374,592);cc.bezierCurveTo(330,618,262,612,226,556);cc.closePath();};
  c.save();c.filter="blur(7px)";c.fillStyle="rgba(30,24,20,0.26)";c.translate(-6,10);ag_shape(c,H_);c.fill();c.restore();
  ag_soft(c,H_,col,ag_lt(col,0.3),360,610,170,"rgba(20,12,10,0.4)",12);
  ag_folds(c,H_,[[[236,620],[262,650],[300,662]],[[320,640],[350,652],[384,640]]],rgba(ag_dk(col,0.6),0.35),"rgba(255,255,255,0.12)");
  c.strokeStyle=rgba(ag_lt(col,0.5),0.6);c.lineWidth=5;c.beginPath();c.moveTo(226,558);c.bezierCurveTo(262,610,330,616,372,594);c.stroke();}
const TH_COLLARS={ruff:(c,P,o)=>th_ruff(c,P,true,o),ruffS:(c,P,o)=>th_ruff(c,P,false,o),band:(c,P)=>th_band(c,P,false),lace:(c,P)=>th_band(c,P,true),hood:th_hood};

// a person of the film: ag_person, then their collar in figure space, breathing with the body; faded whole (person and collar in one
// picture, laid on at its opacity), so nothing shows through anything else
function th_collar(ctx,P,x,y,s,o){const k=P.collar;if(!k||!TH_COLLARS[k])return;const t=o.t||0,br=Math.sin(t*TAU*(P.breath||1/3.6))*2.2;
  ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);ctx.translate(-AG_FIG.anchor[0],-AG_FIG.anchor[1]+br);TH_COLLARS[k](ctx,P,{nod:o.nod||0,br});ctx.restore();}
function th_person(ctx,who,x,y,s,o){o=o||{};const P=ag_spec(who),draw=c=>{const h=ag_person(c,who,x,y,s,o);th_collar(c,P,x,y,s,o);if(o.after)o.after(c,h);return h;};
  const a=ctx.globalAlpha;if(a>=0.995||a<0.004||!P.collar)return draw(ctx);
  const cw=ctx.canvas.width,ch=ctx.canvas.height,[bc,bx]=ag_buf("th_fade",cw,ch);bx.setTransform(1,0,0,1,0,0);bx.globalAlpha=1;bx.clearRect(0,0,cw,ch);
  bx.setTransform(ctx.getTransform());const h=draw(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(bc,0,0);ctx.restore();return h;}

/* ---------------------------------------------------------------- small things the scenes share */
// a chain of small iron links along a curve from p to q, sagging by sag px (0 is taut); o.a; drawn link by link, each turned with it
function th_chain(ctx,p,q,sag,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=o.n||Math.max(6,Math.round(Math.hypot(q[0]-p[0],q[1]-p[1])/(o.link||9))),lw=o.lw||2.2;
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  const pt=u=>[lerp(p[0],q[0],u),lerp(p[1],q[1],u)+sag*4*u*(1-u)];
  for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,A=pt(u0),B=pt(u1),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2,an=Math.atan2(B[1]-A[1],B[0]-A[0]),L=Math.hypot(B[0]-A[0],B[1]-A[1]);
    ctx.save();ctx.translate(mx,my);ctx.rotate(an);ctx.strokeStyle=rgba(i%2?ag_dk(TH.iron,0.2):TH.iron,0.95);ctx.lineWidth=lw;ctx.beginPath();
    if(i%2)ctx.moveTo(-L*0.55,0),ctx.lineTo(L*0.55,0);else ctx.ellipse(0,0,L*0.58,Math.max(1.4,lw*1.1),0,0,TAU);ctx.stroke();
    ctx.strokeStyle="rgba(230,226,220,0.35)";ctx.lineWidth=lw*0.4;ctx.beginPath();ctx.moveTo(-L*0.3,-lw*0.5);ctx.lineTo(L*0.2,-lw*0.5);ctx.stroke();ctx.restore();}
  ctx.restore();}
// a chain along a line of points in the frame, link by link (L px each, lw thick): one round, the next seen edge on, each turned with it
function th_links(c,pts,L,lw){const acc=[0];for(let i=1;i<pts.length;i++)acc.push(acc[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const tot=acc[acc.length-1],n=Math.max(3,Math.round(tot/L));
  const at=s=>{for(let i=1;i<pts.length;i++)if(s<=acc[i]){const u=(s-acc[i-1])/Math.max(1e-6,acc[i]-acc[i-1]);return[lerp(pts[i-1][0],pts[i][0],u),lerp(pts[i-1][1],pts[i][1],u)];}return pts[pts.length-1];};
  c.save();c.lineCap="round";for(let i=0;i<n;i++){const A=at(tot*i/n),B=at(tot*(i+1)/n),l=Math.hypot(B[0]-A[0],B[1]-A[1]);c.save();c.translate((A[0]+B[0])/2,(A[1]+B[1])/2);c.rotate(Math.atan2(B[1]-A[1],B[0]-A[0]));
    c.strokeStyle=rgba(i%2?ag_dk(TH.iron,0.25):TH.iron,0.95);c.lineWidth=lw;c.beginPath();if(i%2){c.moveTo(-l*0.56,0);c.lineTo(l*0.56,0);}else c.ellipse(0,0,l*0.6,Math.max(1.2,lw*1.25),0,0,TAU);c.stroke();
    c.strokeStyle="rgba(236,230,220,0.38)";c.lineWidth=lw*0.45;c.beginPath();c.moveTo(-l*0.3,-lw*0.55);c.lineTo(l*0.2,-lw*0.55);c.stroke();c.restore();}c.restore();}
// lines of handwriting as decoration: wavy strokes in rows inside a box, p (0 to 1) how much is written; too small to read on purpose
function th_hand(ctx,x,y,w,rows,pitch,p,o){o=o||{};const R=ag_rnd(o.seed||5),col=o.col||TH.ink,n=Math.min(rows,Math.max(0,p*rows));ctx.save();ctx.strokeStyle=rgba(col,o.a==null?0.8:o.a);
  ctx.lineWidth=o.lw||2;ctx.lineCap="round";ctx.lineJoin="round";
  for(let r=0;r<Math.ceil(n);r++){const f=Math.min(1,n-r),yy=y+r*pitch,len=w*(r===rows-1?0.55:0.92+R()*0.08)*f;let xx=x,first=true;ctx.beginPath();
    while(xx<x+len){const wl=10+R()*34;for(let k=0;k<=wl;k+=3){const X=xx+k,Y=yy+Math.sin((X+r*7)*0.55)*pitch*0.13-(R()<0.12?pitch*0.24:0);if(X>x+len)break;first?ctx.moveTo(X,Y):ctx.lineTo(X,Y);first=false;}
      xx+=wl+9+R()*6;first=true;ctx.stroke();ctx.beginPath();}}
  ctx.restore();}
// a soft glow of daylight, as a window's light falling on a wall or a floor
function th_light(c,x,y,rx,ry,a,col){c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,rgba(col||[255,248,230],a));
  g.addColorStop(1,rgba(col||[255,248,230],0));c.fillStyle=g;c.fillRect(-rx,-rx,rx*2,rx*2);c.restore();}
