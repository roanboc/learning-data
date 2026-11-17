/* ===== No two alike: the people =====
   The film's own people (prefix na_), drawn by the agent films' kit and never added to it.

   The four of Lu, about 2,500 years ago: the teacher, Kong Qiu, and three of his students, Zilu, Ran You and Gongxi Hua. Nobody knows
   their faces: no likeness of any of them survives from their own time, and none is attempted. What is drawn comes from the texts:
     - their ages, from the Shiji's chapter on the students (67): Zilu nine years younger than the teacher, Ran You twenty-nine,
       Gongxi Hua forty-two. With Gongxi Hua a young man, the teacher is about seventy, Zilu about sixty, Ran You about forty;
     - hair bound up and a robe that closes to the right, which the Analects calls their own way (14.17, of those who wear their hair
       loose and close to the left); a grown man's cap over the topknot, tied under the chin with a cord (Zilu's cap and its cord are
       in the Shiji's account of him);
     - a robe with wide sleeves, as the Liji has the teacher say he wore in Lu (Ruxing); a worn hemp robe for Zilu (Analects 9.27);
       a sash neatly tied for Gongxi Hua (5.8); plain cloth in the colours the Analects allows for everyday wear (10.6: no purple,
       no red). No pattern is invented and none is copied.
   They sit as people of their time sat, kneeling on a mat (Analects 10.9): na_seated draws the kit's half-figure, then the robe's
   skirt over the folded legs and the wide sleeves over the arms, the hands inside them, as its own pictures.
     NA_LU                               the four, each in two specs: r, facing right, and l, to be drawn flipped (facing left), so
                                         the collar still closes to the right
     na_seated(ctx, name, x, y, s, o)    one of them, kneeling: (x, y) where the neck meets the shoulders, s the size; o.flip, o.t,
                                         o.nod, o.gaze, o.talk, o.light (the place's light, as lp_person's), o.a. The mat is at y + 796 s
     na_standing(ctx, name, x, y, s, o)  the same person as a half-figure, for looking at them (lp_person's own o)
   The team, February 2027: Marta Silva, Erin Walsh and Tomás Ortega, copied as the module's numbers give them, each with this film's
   own key. Helena, Noor, Sam, Jun and Yusuf are the kit's (LP_CAST, AG_CAST).
     NA_MARTA, NA_ERIN, NA_TOMAS         (the eight at the team's table are in na_uni.js) */

/* ---------------------------------------------------------------- cloth: a band along a line, a shape from points */
// a band of cloth w wide along a smooth line through pts: its two edges, L on the left of the way it runs (y is down) and R on the right
function na_edges(pts,w){const S=[],n=pts.length;for(let i=0;i<n-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(n-1,i+2)];
    for(let k=0;k<8;k++){const u=k/8,u2=u*u,u3=u2*u;S.push([0,1].map(j=>0.5*(2*p1[j]+(p2[j]-p0[j])*u+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*u2+(3*p1[j]-p0[j]-3*p2[j]+p3[j])*u3)));}}
  S.push(pts[n-1]);const L=[],R=[];for(let i=0;i<S.length;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(S.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;
    L.push([S[i][0]+dy/l*w/2,S[i][1]-dx/l*w/2]);R.push([S[i][0]-dy/l*w/2,S[i][1]+dx/l*w/2]);}
  return{L,R};}
const na_poly=P=>c=>{c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)c.lineTo(P[i][0],P[i][1]);c.closePath();};
const na_stroke=(c,P)=>{c.beginPath();c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)c.lineTo(P[i][0],P[i][1]);c.stroke();};

/* ---------------------------------------------------------------- the robe's crossed collar and sash, in the kit's figure space
   The figure faces right, its right shoulder nearer us. The robe closes to the right: the wearer's left panel lies over the right
   one, so its collar runs from the left side of the neck across the chest to under the right arm. Facing right, that is from the far
   side of the neck down to under the near arm (r). A person drawn flipped is a mirror image, so their robe is painted the other way
   round (l): the near panel on top, its collar from the near side of the neck across the chest to under the far arm. Both keep the V
   on the chest's own centre line. */
const NA_ROBE=(()=>{const nearLine=[[204,566],[230,600],[330,720]],farLine=[[396,574],[384,608],[366,656],[350,700],[330,740]],W0=44;
  const r=(()=>{const under=na_edges(nearLine,W0),top=na_edges(farLine.concat([[288,782],[220,830],[140,882],[64,932]]),W0),fold=top.R;
    return{under:na_poly(under.L.concat(under.R.slice().reverse())),ufold:under.L,top:na_poly(top.L.concat(top.R.slice().reverse())),fold,seam:top.L,
      panel:na_poly(fold.concat([[fold[fold.length-1][0],1130],[480,1130],[480,540],[fold[0][0],540]]))};})();
  const l=(()=>{const under=na_edges(farLine,W0),top=na_edges(nearLine.concat([[366,770],[402,818],[440,864],[474,906]]),W0),fold=top.L;
    return{under:na_poly(under.L.concat(under.R.slice().reverse())),ufold:under.R,top:na_poly(top.L.concat(top.R.slice().reverse())),fold,seam:top.R,
      panel:na_poly(fold.concat([[fold[fold.length-1][0],1130],[20,1130],[20,540],[fold[0][0],540]]))};})();
  return{r,l,skin:na_poly([[228,548],[368,568],[330,654]]),inner:na_poly([[210,546],[384,564],[334,682]])};})();
function na_robe(mirrored){return(c,P)=>{const T=P.top,K=mirrored?NA_ROBE.l:NA_ROBE.r,cl=T.c,band=T.band||ag_dk(cl,0.22),inn=T.inner||[232,226,212],sk=P.skin;
  c.save();ag_shape(c,AG_F.torso);c.clip();
  // the inner robe's pale collar, and the skin inside its V
  ag_soft(c,NA_ROBE.inner,inn,ag_lt(inn,0.5),352,620,90,rgba(ag_dk(inn,0.5),0.3),8);
  ag_soft(c,NA_ROBE.skin,mix(sk,ag_dk(sk,0.4),0.1),ag_lt(sk,0.18),350,600,70,rgba(mix(sk,[90,40,30],0.6),0.35),12);
  // the panel underneath: its collar, as far as the other covers it
  ag_soft(c,K.under,band,ag_lt(band,0.28),320,690,110,rgba(ag_dk(band,0.7),0.35),8);
  // the panel on top: the same cloth as the body, a soft shadow where it lies on the other, and its collar along its edge
  c.save();c.shadowColor=rgba(LP.shade,0.4);c.shadowBlur=10;c.shadowOffsetX=mirrored?4:-4;c.shadowOffsetY=6;ag_shape(c,K.panel);c.fillStyle=rgba(ag_dk(cl,0.08),1);c.fill();c.restore();
  ag_soft(c,K.panel,ag_dk(cl,0.08),ag_lt(cl,0.4),400,690,300,null);
  ag_soft(c,K.top,band,ag_lt(band,0.3),360,660,150,null);
  c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba(ag_dk(band,0.75),0.5);c.lineWidth=3;na_stroke(c,K.fold);
  c.strokeStyle=rgba(ag_dk(band,0.75),0.38);c.lineWidth=2.6;na_stroke(c,K.ufold);
  c.strokeStyle=rgba(ag_lt(band,0.5),0.45);c.lineWidth=2;c.save();c.translate(mirrored?-2:3,3);na_stroke(c,K.fold);c.restore();
  c.strokeStyle=rgba(ag_dk(band,0.5),0.3);c.lineWidth=1.6;na_stroke(c,K.seam);
  // soft folds in the cloth below the collar
  ag_folds(c,AG_F.torso,mirrored?[[[214,820],[226,880],[220,950]],[[258,850],[282,900],[296,960]]]:[[[408,760],[392,850],[400,940]],[[380,820],[350,880],[330,960]]],rgba(ag_dk(cl,0.6),0.22),"rgba(255,255,255,0.08)");
  // the sash round the waist, knotted in front, its two ends falling
  const sa=T.sash||ag_dk(cl,0.4),y0=990,y1=1036,sash=cc=>{cc.moveTo(60,y0+12);cc.quadraticCurveTo(250,y0-8,446,y0+2);cc.lineTo(446,y1);cc.quadraticCurveTo(250,y1+6,60,y1+10);cc.closePath();};
  c.save();c.shadowColor=rgba(LP.shade,0.35);c.shadowBlur=8;c.shadowOffsetY=5;ag_shape(c,sash);c.fillStyle=rgba(sa,1);c.fill();c.restore();
  ag_soft(c,sash,sa,ag_lt(sa,0.3),380,y0+20,170,rgba(ag_dk(sa,0.7),0.35),8);
  const kx=326;ag_soft(c,cc=>{cc.moveTo(kx-6,y1-6);cc.bezierCurveTo(kx-20,y1+30,kx-22,1080,kx-16,1130);cc.lineTo(kx+4,1130);cc.bezierCurveTo(kx+2,1080,kx+6,y1+30,kx+10,y1-6);cc.closePath();
      cc.moveTo(kx+12,y1-6);cc.bezierCurveTo(kx+24,y1+30,kx+30,1080,kx+26,1130);cc.lineTo(kx+44,1130);cc.bezierCurveTo(kx+46,1080,kx+38,y1+26,kx+28,y1-8);cc.closePath();},ag_dk(sa,0.08),ag_lt(sa,0.28),kx+20,y1+30,60,null);
  ag_soft(c,cc=>{cc.ellipse(kx+8,(y0+y1)/2+2,22,26,0.1,0,TAU);},ag_lt(sa,0.06),ag_lt(sa,0.36),kx+14,y0+14,30,rgba(ag_dk(sa,0.8),0.4),6);
  c.restore();};}

/* ---------------------------------------------------------------- hair bound up, and a cap over the topknot
   Everything inside the head's picture (figure x 160 to 440, y 250 to 560). The kit paints no hair for these heads (style "shaved"):
   the hair is combed up from the hairline to a knot at the crown; a small dark cap sits over the knot, a pin through both, and a cord
   runs down past the ear to tie under the chin. beard: a tuft below the chin, for the two older men. */
function na_hairUp(c,P){const hc=P.hair.c;ag_soft(c,AG_HAIR.cropped,hc,ag_lt(hc,0.32),330,300,110,"rgba(0,0,0,0.42)",16);
  c.save();ag_shape(c,AG_HAIR.cropped);c.clip();c.strokeStyle=rgba(ag_lt(hc,0.5),0.2);c.lineWidth=1.8;c.lineCap="round";
  for(const [x0,y0] of [[384,352],[366,350],[344,353],[320,361],[302,373],[232,442],[221,412],[214,382],[221,352],[236,326],[258,308]]){c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+294)/2+(x0<290?-6:8),(y0+286)/2,294,286);c.stroke();}
  c.restore();
  // the hairline over the brow, soft
  c.strokeStyle=rgba(mix(P.skin,hc,0.4),0.35);c.lineWidth=2.2;c.lineCap="round";c.beginPath();c.moveTo(304,368);c.bezierCurveTo(326,354,356,348,386,350);c.stroke();}
function na_cap(col,pin){return(c,P)=>{na_hairUp(c,P);const hc=P.hair.c;
  // the knot, then the cap over it: a low rounded crown and a band round its foot
  ag_soft(c,cc=>{cc.ellipse(294,286,30,24,-0.2,0,TAU);},hc,ag_lt(hc,0.3),302,274,30,"rgba(0,0,0,0.4)",8);
  ag_soft(c,cc=>{cc.moveTo(256,302);cc.bezierCurveTo(252,270,270,254,297,254);cc.bezierCurveTo(326,254,340,270,336,300);cc.bezierCurveTo(320,308,276,310,256,302);cc.closePath();},col,ag_lt(col,0.26),308,264,40,"rgba(0,0,0,0.4)",8);
  c.fillStyle=rgba(ag_lt(col,0.16),1);c.beginPath();c.moveTo(254,300);c.bezierCurveTo(276,310,318,308,338,298);c.lineTo(338,306);c.bezierCurveTo(318,316,276,318,254,308);c.closePath();c.fill();
  // the pin through the cap and the knot, and the cord down past the ear to under the chin
  c.strokeStyle=rgba(pin||[150,132,104],1);c.lineWidth=3.4;c.lineCap="round";c.beginPath();c.moveTo(238,284);c.lineTo(356,276);c.stroke();
  c.strokeStyle=rgba(mix(col,hc,0.45),0.8);c.lineWidth=2.4;c.beginPath();c.moveTo(262,308);c.bezierCurveTo(258,360,268,420,276,470);c.bezierCurveTo(282,500,300,520,322,527);c.stroke();
  if(P.mo){const bd=P.mo;c.save();ag_shape(c,AG_F.head);c.clip();
    ag_soft(c,cc=>{cc.moveTo(338,480);cc.bezierCurveTo(346,470,366,463,398,464);cc.lineTo(394,471);cc.bezierCurveTo(374,471,356,475,346,484);cc.closePath();},bd,mix(bd,[150,150,160],0.35),366,468,30,"rgba(0,0,0,0.3)",4);
    ag_soft(c,cc=>{cc.moveTo(350,499);cc.bezierCurveTo(362,494,378,494,388,499);cc.bezierCurveTo(392,514,386,532,370,539);cc.bezierCurveTo(354,538,344,524,345,508);cc.closePath();},bd,mix(bd,[150,150,160],0.35),370,512,30,"rgba(0,0,0,0.3)",5);
    c.restore();}
  if(P.tuft){const bd=P.tuft;ag_soft(c,cc=>{cc.moveTo(300,512);cc.bezierCurveTo(318,528,344,534,366,530);cc.bezierCurveTo(374,528,380,522,384,514);cc.bezierCurveTo(384,532,376,548,358,556);cc.bezierCurveTo(336,558,312,540,300,512);cc.closePath();},
      bd,mix(bd,[236,236,240],0.4),356,528,40,"rgba(0,0,0,0.3)",6);}};}

/* ---------------------------------------------------------------- the four of Lu */
const na_luSpec=(key,name,o)=>{const mk=(mir)=>({key:key+(mir?"-l":""),name,skin:o.skin,hair:{style:"shaved",c:o.hair},beard:o.beard,tuft:o.tuft,mo:o.mo,
    top:{kind:"na_robe",c:o.c,band:o.band,inner:o.inner,sash:o.sash,paint:na_robe(mir)},hat:{paint:na_cap(o.cap,o.pin)},breath:o.breath});return{r:mk(false),l:mk(true)};};
const NA_LU={
  // the teacher, about seventy: white hair and beard, a dark robe
  kong:na_luSpec("na-kong","Kong Qiu",{skin:[216,176,142],hair:[204,200,194],beard:[212,208,202],tuft:[212,208,202],c:[62,56,54],band:[40,36,36],inner:[226,218,200],sash:[118,102,84],cap:[26,24,26],pin:[156,140,112],breath:0.21}),
  // Zilu, about sixty: weathered, iron-grey hair and a full beard, a worn hemp robe the colour of earth
  zilu:na_luSpec("na-zilu","Zilu",{skin:[196,150,112],hair:[104,100,98],beard:[122,118,114],tuft:[122,118,114],c:[146,120,88],band:[112,90,64],inner:[212,198,170],sash:[84,68,50],cap:[34,30,30],pin:[136,112,84],breath:0.3}),
  // Ran You, about forty: dark hair and a short dark beard, a plain grey robe, neatly worn
  ranyou:na_luSpec("na-ranyou","Ran You",{skin:[222,182,146],hair:[30,26,26],mo:[36,30,30],c:[124,122,122],band:[88,86,90],inner:[230,224,210],sash:[66,62,62],cap:[24,22,26],pin:[150,132,104],breath:0.25}),
  // Gongxi Hua, in his twenties: no beard, a pale undyed robe, its sash neatly tied
  gongxi:na_luSpec("na-gongxi","Gongxi Hua",{skin:[230,192,158],hair:[28,24,24],c:[212,200,176],band:[174,158,128],inner:[240,236,226],sash:[78,64,56],cap:[30,28,30],pin:[160,144,116],breath:0.28})
};

/* ---------------------------------------------------------------- kneeling on a mat: the skirt over the folded legs, the wide sleeves
   In figure space, as two kept pictures for each person: the skirt, which stays where it is, and the sleeves, which breathe with the
   body. The sleeves cover the kit's hanging arms whole, and meet in the lap with the hands inside them. */
const NA_LAPS={};
const NA_SEAT={mat:1392,box:[-80,200,760,1440]};
function na_lap(P){const k=P.key;if(NA_LAPS[k])return NA_LAPS[k];const cl=P.top.c,band=P.top.band||ag_dk(cl,0.22),dkc=ag_dk(cl,0.14);
  const skirt=c=>{c.moveTo(92,1040);c.bezierCurveTo(62,1110,30,1250,22,1372);c.bezierCurveTo(20,1390,26,1398,40,1398);c.quadraticCurveTo(330,1418,626,1398);
    c.bezierCurveTo(646,1394,652,1380,652,1360);c.bezierCurveTo(654,1290,652,1200,612,1140);c.bezierCurveTo(570,1096,480,1076,420,1070);c.lineTo(110,1040);c.closePath();};
  const far=c=>{c.moveTo(404,628);c.bezierCurveTo(424,628,444,640,452,656);c.bezierCurveTo(468,684,474,730,474,790);c.bezierCurveTo(486,880,518,980,530,1086);c.bezierCurveTo(528,1138,482,1166,442,1148);
    c.lineTo(426,1088);c.bezierCurveTo(418,1000,418,900,424,820);c.bezierCurveTo(430,760,430,720,430,700);c.bezierCurveTo(430,668,420,642,404,628);c.closePath();};
  const near=c=>{c.moveTo(152,600);c.bezierCurveTo(116,604,84,626,70,664);c.bezierCurveTo(54,724,38,860,60,1010);c.bezierCurveTo(80,1104,150,1184,236,1200);
    c.bezierCurveTo(318,1212,396,1186,446,1130);c.lineTo(452,1082);c.bezierCurveTo(384,1058,304,1030,244,962);c.bezierCurveTo(218,900,198,770,198,700);c.bezierCurveTo(198,664,186,624,168,606);c.closePath();};
  const cuff=c=>{c.moveTo(446,1130);c.lineTo(452,1082);c.bezierCurveTo(442,1078,430,1074,420,1070);c.bezierCurveTo(410,1090,404,1124,408,1160);c.bezierCurveTo(422,1152,436,1142,446,1130);c.closePath();};
  return NA_LAPS[k]={
    skirt:ag_layer(c=>{c.save();c.shadowColor=rgba(LP.shade,0.3);c.shadowBlur=14;c.shadowOffsetY=-6;ag_soft(c,skirt,dkc,ag_lt(cl,0.3),520,1150,330,rgba(ag_dk(cl,0.8),0.4),30);c.restore();
        ag_soft(c,skirt,dkc,ag_lt(cl,0.3),520,1150,330,rgba(ag_dk(cl,0.8),0.4),30);
        // folds: over the thighs towards the knees, falling from the knees to the mat, and down the back
        ag_folds(c,skirt,[[[330,1100],[450,1112],[560,1150]],[[250,1130],[380,1160],[500,1230]],[[600,1170],[626,1270],[628,1380]],[[530,1200],[556,1290],[556,1392]],[[150,1120],[118,1240],[104,1380]],[[224,1190],[232,1290],[224,1396]],[[392,1230],[410,1320],[406,1400]]],
          rgba(ag_dk(cl,0.7),0.24),"rgba(255,255,255,0.1)");
        // the hem, where it lies on the mat
        c.save();ag_shape(c,skirt);c.clip();c.strokeStyle=rgba(band,0.9);c.lineWidth=14;c.beginPath();c.moveTo(10,1392);c.quadraticCurveTo(330,1414,660,1390);c.stroke();c.restore();},[-80,1000,760,1440]),
    sleeves:ag_layer(c=>{ag_soft(c,far,ag_dk(cl,0.18),ag_lt(cl,0.26),486,900,150,rgba(ag_dk(cl,0.8),0.38),18);
        ag_folds(c,far,[[[452,820],[474,940],[484,1090]],[[440,960],[452,1040],[450,1120]]],rgba(ag_dk(cl,0.7),0.24),"rgba(255,255,255,0.08)");
        c.save();c.shadowColor=rgba(LP.shade,0.35);c.shadowBlur=14;c.shadowOffsetX=6;c.shadowOffsetY=8;ag_shape(c,near);c.fillStyle=rgba(dkc,1);c.fill();c.restore();
        ag_soft(c,near,ag_dk(cl,0.16),ag_lt(cl,0.3),170,720,260,rgba(ag_dk(cl,0.8),0.4),26);
        ag_folds(c,near,[[[120,700],[96,840],[110,980]],[[196,960],[250,1040],[340,1090]],[[110,1030],[190,1120],[300,1150]],[[176,820],[170,900],[196,956]],[[300,1070],[340,1130],[330,1196]]],rgba(ag_dk(cl,0.72),0.24),"rgba(255,255,255,0.1)");
        ag_soft(c,cuff,band,ag_lt(band,0.3),430,1100,40,rgba(ag_dk(band,0.7),0.35),6);},[20,580,560,1240])};}
// (x, y) where the neck meets the shoulders, as for any person; the mat is NA_SEAT.mat - 596 = 796 figure units below
function na_seated(ctx,name,x,y,s,o){o=o||{};const a=ctx.globalAlpha*(o.a==null?1:o.a);if(a<0.004)return;const P=NA_LU[name][o.flip?"l":"r"],t=o.t||0,
    L0=Object.assign({light:"day",warm:0.12,shade:0.2},o.light||{}),Lt=LP_LIGHT[L0.light]||LP_LIGHT.day;
  const A=AG_FIG.anchor,m=ctx.getTransform(),M=m.translate(x,y).scale(o.flip?-s:s,s).translate(-A[0],-A[1]),cw=ctx.canvas.width,ch=ctx.canvas.height,B0=NA_SEAT.box;
  let L=1e9,R=-1e9,T0=1e9,B=-1e9;for(const [fx,fy] of [[B0[0],B0[1]],[B0[2],B0[1]],[B0[0],B0[3]],[B0[2],B0[3]]]){const qx=M.a*fx+M.c*fy+M.e,qy=M.b*fx+M.d*fy+M.f;L=Math.min(L,qx);R=Math.max(R,qx);T0=Math.min(T0,qy);B=Math.max(B,qy);}
  L=Math.max(0,Math.floor(L));T0=Math.max(0,Math.floor(T0));R=Math.min(cw,Math.ceil(R));B=Math.min(ch,Math.ceil(B));if(R<=L||B<=T0)return;const w=R-L,h=B-T0;
  // the person, whole, on a canvas of their own: the kit's half-figure, then the skirt and the sleeves over it
  const [pc,px]=ag_buf("naSeated",cw,ch);px.setTransform(m);
  try{ag_person(px,P,x,y,s,{t,flip:o.flip,covered:true,nod:o.nod,gaze:o.gaze,smile:o.smile,talk:o.talk});
    const lap=na_lap(P),br=Math.sin(t*TAU/(P.breath?1/P.breath:3.6))*2.2;px.setTransform(M);ag_drawLayer(px,lap.skirt);px.translate(0,br);ag_drawLayer(px,lap.sleeves);}
  finally{px.setTransform(1,0,0,1,0,0);px.globalAlpha=1;}
  // the light, as lp_person lays it: warm from the right of the frame, the room's shade on the left
  px.globalCompositeOperation="source-atop";const g=px.createLinearGradient(L,0,R,0);
  g.addColorStop(0,rgba(LP.shade,L0.shade));g.addColorStop(0.5,rgba(LP.shade,L0.shade*0.25));g.addColorStop(0.62,rgba(Lt.col,0));g.addColorStop(1,rgba(Lt.col,L0.warm*(Lt.a>0?1:0.5)));
  px.fillStyle=g;px.fillRect(L,T0,w,h);px.globalCompositeOperation="source-over";
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(pc,L,T0,w,h,L,T0,w,h);ctx.restore();}
const na_standing=(ctx,name,x,y,s,o)=>lp_person(ctx,NA_LU[name][o&&o.flip?"l":"r"],x,y,s,o);

/* ---------------------------------------------------------------- the team, February 2027 */
const NA_MARTA={name:"Marta Silva",role:"Data analyst",key:"na-marta",skin:[156,108,80],hair:{style:"coily",c:[40,30,26]},earrings:[214,180,120],top:{kind:"cardigan",c:[168,150,126],inner:[70,66,70]},breath:0.3};
const NA_ERIN={name:"Erin Walsh",role:"Platform engineer",key:"na-erin",skin:[232,196,170],hair:{style:"bun",c:[132,76,48]},earrings:[214,200,170],top:{kind:"sweater",c:[126,106,96]},breath:0.28};
const NA_TOMAS={name:"Tomás Ortega",role:"Report developer",key:"na-tomas",skin:[198,150,114],hair:{style:"side",c:[46,36,30],streak:[120,108,100]},beard:[58,46,40],top:{kind:"cardigan",c:[112,100,88],inner:[226,222,214]},breath:0.27};
