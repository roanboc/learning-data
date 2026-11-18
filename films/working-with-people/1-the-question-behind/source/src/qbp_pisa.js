/* ===== The question behind the request: Pisa, 1989 to 2001, in ink line =====
   The opening story's places, people and things (prefix qbp_). The people kit draws the people and the rooms' things and is never
   changed for this film. Checked against the script's Rigour (Burland, Jamiolkowski and Viggiani, 2009; Jamiolkowski, 2001).
     qbpSquare      the lawn below the tower on a clear day, seen from where visitors stand: the eye line low (QBP_E), so the tower
                    stands far off, whole, and people near are large
     qbpSite        the tower's foot seen from nearer (QBP_SE): the lawn, a site's fence, the tower's lower floors going up out of frame
     qbpPavia       a square in another city, Pavia, in 1989: brick houses, and a fenced heap where a tower stood
     qbpOffice      the room in 1990 where the committee meets: a table, a window with the tower far off, a sheet on the wall
     qbp_tower(ctx, x, y, k, lean)   the bell tower as built: the tall ground floor's blind arches, six open galleries of columns, the
                    narrower bell chamber; its foot's middle at (x, y), k px a metre, leaning lean degrees to the right (south)
     qbp_lead(ctx, x, y, k, a)       the lead ingots stacked on a concrete ring on the north side (o: how much is there, 0 to 1)
     qbp_drill(ctx, x, y, k, a, run) a small drilling rig, its auger slanting under the tower's north side
   Nothing is a likeness or a copy of a photograph; nobody is shown hurt. Colour keeps the module's meaning: amber the danger, blue
   the plan, green what was done; the marble, the lawn and the sky carry none. Every name this file declares starts with qbp_ or QBP_. */
const QBP_E=600,QBP_SE=470;                                   // the eye lines: on the lawn, and at the site
const QBP_TW=[1220,616],QBP_K=8.2,QBP_LEAN0=5.5,QBP_LEAN1=5.0;   // where the tower stands on the lawn, its px a metre, its lean before and after
const qbp_h=fl=>PK.hAt(fl,QBP_E),qbp_hs=fl=>PK.hAt(fl,QBP_SE);
const QBP_PAL={sky:[206,224,236],sky2:[240,236,222],hill:[176,180,166],roof:[196,120,92],wallc:[232,214,186],lawn:[150,170,120],lawn2:[132,154,106],
  path:[224,214,192],marble:[240,236,224],shade:[176,170,158],brick:[184,106,82],brick2:[160,92,70],fence:[200,140,60],lead:[110,116,124],concrete:[196,192,184],
  rig:[220,170,70],wall:[232,226,212],floor:[176,150,124],wood:[150,110,78]};
const qbp_c=k=>PK.S.tone(QBP_PAL[k]);

/* ---------------------------------------------------------------- the tower */
function qbp_tower(ctx,x,y,k,lean,o){o=o||{};const S=PK.S,U=PK.u,R=7.7*k,G0=11*k,GS=6.5*k,BR=5.2*k,BH=6*k,mar=qbp_c("marble"),sh=qbp_c("shade");
  ctx.save();ctx.translate(x,y);ctx.rotate(lean*Math.PI/180);if(o.a!=null)ctx.globalAlpha*=o.a;
  S.begin(ctx,{lw:Math.max(1.4,k*0.22),sh:0});
  // the body, the ground floor's blind arches
  S.fill(ctx,c=>c.rect(-R,-(G0+6*GS),2*R,G0+6*GS),mar,{grad:[-R,0,R,0,0.12]});
  const nA=5;for(let i=0;i<nA;i++){const ax=-R+(i+0.5)*2*R/nA,aw=2*R/nA*0.34;S.line(ctx,c=>{c.moveTo(ax-aw,0);c.lineTo(ax-aw,-G0*0.7);c.arc(ax,-G0*0.7,aw,Math.PI,0);c.lineTo(ax+aw,0);},sh,0.6);}
  // six open galleries: the shade inside, the columns and their arches, a cornice under each
  for(let g=0;g<6;g++){const y0=-(G0+g*GS),y1=y0-GS;
    S.fill(ctx,c=>c.rect(-R*0.94,y1+GS*0.18,R*1.88,GS*0.72),sh,{w:0.5});
    const nC=7;for(let i=0;i<=nC;i++){const cx=-R*0.94+i*R*1.88/nC;S.fill(ctx,c=>c.rect(cx-k*0.28,y1+GS*0.3,k*0.56,GS*0.6),mar,{w:0.4});}
    S.line(ctx,c=>{for(let i=0;i<nC;i++){const cx=-R*0.94+(i+0.5)*R*1.88/nC,r=R*0.94/nC;c.moveTo(cx-r,y1+GS*0.34);c.arc(cx,y1+GS*0.34,r,Math.PI,0);}},mar,0.7);
    S.fill(ctx,c=>c.rect(-R*1.03,y0-GS*0.1,R*2.06,GS*0.12),mar,{w:0.6});}
  // the bell chamber
  const top=-(G0+6*GS);S.fill(ctx,c=>c.rect(-BR,top-BH,2*BR,BH),mar,{});
  S.line(ctx,c=>{for(let i=0;i<4;i++){const cx=-BR+(i+0.5)*2*BR/4,r=BR/5;c.moveTo(cx-r,top-BH*0.1);c.lineTo(cx-r,top-BH*0.6);c.arc(cx,top-BH*0.6,r,Math.PI,0);c.lineTo(cx+r,top-BH*0.1);}},sh,0.7);
  S.fill(ctx,c=>c.rect(-BR*1.08,top-BH-k*0.6,BR*2.16,k*0.7),mar,{w:0.6});
  ctx.restore();
  // the tower's top, where it is: [x, y], for a line from the foot
  const a=lean*Math.PI/180,Ht=G0+6*GS+BH;return{top:[x+Math.sin(a)*Ht,y-Math.cos(a)*Ht],foot:[x,y]};}

// the lead ingots on their concrete ring, at the north side's foot (x: the ring's middle; a: how much lead, 0 to 1)
function qbp_lead(ctx,x,y,k,a){if(a<=0.004)return;const S=PK.S;S.begin(ctx,{lw:Math.max(1.4,k*0.1),sh:2});
  S.fill(ctx,c=>c.rect(x-4*k,y-1.2*k,8*k,1.2*k),qbp_c("concrete"),{});
  const n=Math.round(10*a);for(let i=0;i<n;i++){const row=Math.floor(i/5),col=i%5,w=1.5*k;S.fill(ctx,c=>c.rect(x-3.8*k+col*w+row*0.6*k,y-1.2*k-(row+1)*0.55*k,w*0.94,0.52*k),qbp_c("lead"),{w:0.5});}}
// a small drilling rig at the north side, its auger slanting down under the tower (run: 0 to 1, how far the auger has gone in)
function qbp_drill(ctx,x,y,k,a,run){if(a<=0.004)return;const S=PK.S;ctx.save();ctx.globalAlpha*=a;S.begin(ctx,{lw:Math.max(1.4,k*0.1),sh:2});
  S.fill(ctx,c=>c.rect(x-2.4*k,y-1.4*k,3.4*k,1.4*k),qbp_c("rig"),{});S.fill(ctx,c=>c.rect(x-2.0*k,y-3.0*k,1.4*k,1.6*k),PK.u.dk(qbp_c("rig"),0.15),{});
  const L=2.4*k+run*1.6*k;S.line(ctx,c=>{c.moveTo(x+1.0*k,y-0.8*k);c.lineTo(x+1.0*k+L*0.92,y-0.8*k+L*0.38);},[90,86,82],1.4);
  ctx.restore();}

/* ---------------------------------------------------------------- places */
function qbp_sky(ctx,hz){const U=PK.u,g=ctx.createLinearGradient(0,0,0,hz);g.addColorStop(0,U.css(qbp_c("sky")));g.addColorStop(1,U.css(qbp_c("sky2")));ctx.fillStyle=g;ctx.fillRect(0,0,1920,hz+4);}
function qbp_city(ctx,hz,k){const S=PK.S;S.begin(ctx,{lw:2,far:0.6,sh:2});
  S.fill(ctx,c=>{c.moveTo(-20,hz-60*k);c.quadraticCurveTo(500,hz-120*k,900,hz-70*k);c.quadraticCurveTo(1400,hz-30*k,1940,hz-90*k);c.lineTo(1940,hz);c.lineTo(-20,hz);c.closePath();},qbp_c("hill"),{});
  S.begin(ctx,{lw:2,far:0.35,sh:2});for(let i=0;i<14;i++){const x0=-40+i*142,w=120+(i*37)%40,h=(40+(i*23)%30)*k;
    S.fill(ctx,c=>c.rect(x0,hz-h,w,h),qbp_c("wallc"),{w:0.5});S.fill(ctx,c=>{c.moveTo(x0-6,hz-h);c.lineTo(x0+w/2,hz-h-14*k);c.lineTo(x0+w+6,hz-h);c.closePath();},qbp_c("roof"),{w:0.5});}}
function qbp_lawn(ctx,hz){const S=PK.S;S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,hz,1],[1940,hz,1],[1940,1100,1],[-20,1100,1]],qbp_c("lawn"),{exact:true,grad:[0,hz,0,1080,0.12]});}
AG_PLACES.qbpSquare=ctx=>{const S=PK.S,hz=QBP_E+8;qbp_sky(ctx,hz);qbp_city(ctx,hz,1);qbp_lawn(ctx,hz);
  // the path across the lawn, and the stone ring at the tower's foot
  S.begin(ctx,{lw:2.4,sh:3});S.poly(ctx,[[300,1100,1],[860,hz+6,1],[960,hz+6,1],[1500,1100,1]],qbp_c("path"),{exact:true});
  S.fill(ctx,c=>c.ellipse(QBP_TW[0],QBP_TW[1]+2,110,14,0,0,7),qbp_c("path"),{w:0.6});};
AG_PLACES.qbpSite=ctx=>{const S=PK.S,hz=QBP_SE+6;qbp_sky(ctx,hz);qbp_city(ctx,hz,0.7);qbp_lawn(ctx,hz);
  // a site's fence across the lawn, behind where the engineers stand
  S.begin(ctx,{lw:2.4,sh:3});S.line(ctx,c=>{c.moveTo(-20,hz+70);c.lineTo(1940,hz+70);c.moveTo(-20,hz+100);c.lineTo(1940,hz+100);for(let x=0;x<1960;x+=120){c.moveTo(x,hz+50);c.lineTo(x,hz+116);}},qbp_c("fence"),1.0);};
AG_PLACES.qbpPavia=ctx=>{const S=PK.S,hz=500;qbp_sky(ctx,hz);
  S.begin(ctx,{lw:2.6,far:0.15,sh:3});
  for(const [x0,x1,top,col] of [[-40,420,170,"brick"],[420,760,230,"wallc"],[1220,1560,200,"brick2"],[1560,1960,150,"wallc"]]){
    S.fill(ctx,c=>c.rect(x0,top,x1-x0,hz-top+10),qbp_c(col),{grad:[0,top,0,hz,0.08]});
    for(let x=x0+50;x<x1-40;x+=110)S.fill(ctx,c=>c.rect(x,top+60,46,80),PK.u.dk(qbp_c(col),0.3),{w:0.5});}
  S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,hz,1],[1940,hz,1],[1940,1100,1],[-20,1100,1]],[200,190,176],{exact:true,grad:[0,hz,0,1080,0.1]});
  // where the tower stood: a stump of brick, the heap round it, and a fence in front
  S.fill(ctx,c=>{c.moveTo(800,hz+40);c.lineTo(860,hz-150);c.lineTo(900,hz-120);c.lineTo(940,hz-170);c.lineTo(1000,hz-110);c.lineTo(1050,hz+40);c.closePath();},qbp_c("brick2"),{});
  S.fill(ctx,c=>{c.moveTo(620,hz+70);c.quadraticCurveTo(930,hz-90,1240,hz+70);c.closePath();},qbp_c("brick"),{});
  S.line(ctx,c=>{for(const [x,y] of [[700,hz+40],[800,hz+10],[1000,hz+20],[1120,hz+50],[900,hz-10]]){c.moveTo(x,y);c.lineTo(x+40,y-8);}},PK.u.dk(qbp_c("brick"),0.3),0.6);
  S.line(ctx,c=>{c.moveTo(560,hz+110);c.lineTo(1320,hz+110);c.moveTo(560,hz+140);c.lineTo(1320,hz+140);for(let x=560;x<=1320;x+=95){c.moveTo(x,hz+90);c.lineTo(x,hz+160);}},qbp_c("fence"),1.0);};
const QBP_RF=800,QBP_IE=380,qbp_hi=fl=>PK.hAt(fl,QBP_IE);
AG_PLACES.qbpOffice=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(qbp_c("wall"));ctx.fillRect(0,0,1920,QBP_RF);
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,QBP_RF-60,1960,60),U.dk(qbp_c("wall"),0.1),{w:0.6});
  S.poly(ctx,[[-20,QBP_RF,1],[1940,QBP_RF,1],[1940,1100,1],[-20,1100,1]],qbp_c("floor"),{exact:true,grad:[0,QBP_RF,0,1080,0.1]});
  // the window, the tower small and far beyond the roofs
  PK.window(ctx,1240,140,460,380,(c,x,y,w,h)=>{qbp_sky(c,y+h);c.save();c.translate(x,y+h*0.25);c.scale(w/1920,w/1920);qbp_city(c,QBP_E+300,1.4);c.restore();
    qbp_tower(c,x+w*0.56,y+h*0.86,4.6,QBP_LEAN0);},{});
  // the committee's sheet on the wall, where a hand can reach it (drawn on by the board's rows)
  S.begin(ctx,{lw:2.6,sh:4});PK.board(ctx,QBP_BD.x,QBP_BD.y,QBP_BD.w,QBP_BD.h,{});};
// the committee's sheet: a board's 1250 by 524 px at k
const QBP_BD={x:180,y:250,k:0.5,w:1250*0.5,h:524*0.5,floor:930,rest:900};

/* ---------------------------------------------------------------- the people of Pisa and Pavia: nobody's likeness */
const QBP_FOLK={
  eng1:{key:"eng1",name:"",skin:[226,188,160],hair:{style:"short",c:[176,170,166]},glasses:[60,52,50],top:{kind:"jacket",c:[120,124,136],inner:[236,232,222]},bottom:{kind:"trousers",c:[70,72,84]},shoe:[60,50,46]},
  eng2:{key:"eng2",name:"",skin:[232,196,166],hair:{style:"bob",c:[70,48,40]},top:{kind:"jacket",c:[60,88,120],inner:[240,236,226]},bottom:{kind:"trousers",c:[80,84,96]},shoe:[56,48,46]},
  eng3:{key:"eng3",name:"",skin:[212,170,136],hair:{style:"crop",c:[40,32,30]},beard:[54,42,36],top:{kind:"sweater",c:[150,120,96]},bottom:{kind:"trousers",c:[86,80,74]},shoe:[70,56,48]},
  com1:{key:"com1",name:"",skin:[238,206,180],hair:{style:"short",c:[214,210,206]},glasses:[60,52,50],top:{kind:"jacket",c:[86,90,104],inner:[236,232,222]},bottom:{kind:"trousers",c:[60,62,72]},shoe:[50,44,42]},
  com2:{key:"com2",name:"",skin:[180,130,100],hair:{style:"bun",c:[50,40,36]},top:{kind:"jacket",c:[150,80,74],inner:[240,232,220]},bottom:{kind:"skirt",c:[70,70,86]},shoe:[60,48,46]},
  guard:{key:"guard",name:"",skin:[220,180,150],hair:{style:"short",c:[50,40,34]},top:{kind:"jacket",c:[50,60,90],inner:[220,224,232]},bottom:{kind:"trousers",c:[46,52,76]},shoe:[40,36,36]},
  res1:{key:"res1",name:"",skin:[230,196,170],hair:{style:"long",c:[90,60,44]},top:{kind:"jacket",c:[196,170,120],inner:[240,236,226]},bottom:{kind:"skirt",c:[110,90,80]},shoe:[80,60,50]},
  res2:{key:"res2",name:"",skin:[214,176,146],hair:{style:"short",c:[60,50,44]},top:{kind:"sweater",c:[130,150,130]},bottom:{kind:"trousers",c:[90,90,100]},shoe:[60,50,46]}};
const qbp_row=w=>typeof w==="string"?(QBP_FOLK[w]||PK.CAST[w]):w;
const qbp_person=(ctx,who,x,fl,pose,o,hf)=>PK.person(ctx,qbp_row(who),x,fl,(hf||qbp_h)(fl),pose,o);
const qbp_walk=(ctx,who,t,w,o,hf)=>PK.walk(ctx,qbp_row(who),t,Object.assign({h:(hf||qbp_h)(w.floor)},w),o);
const qbp_seat=(ctx,who,x,fl,pose,o)=>PK.seated(ctx,qbp_row(who),x,fl,qbp_hi(fl),pose||"sit",o);
