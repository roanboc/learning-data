/* ===== Owning the outcome: Kenya's central highlands, from the 1970s =====
   The opening's places and people, drawn with the people kit (films/people-first/shared/): the hills with their forests cleared,
   a group's nursery under a shade of poles, and the same hills years later, with trees. The women wear plain clothes of the 1970s
   and headscarves in plain colours; Wangari Maathai is a composite, never a likeness; nothing is taken from a culture's own patterns
   or crafts. Everyone stands on the near slope, sized by one eye line (OO_K.eye), so near and far people belong to one picture. */
const OO_K={eye:455};
const oo_h=fl=>PK.hAt(fl,OO_K.eye);
const OO_CAST={
  maathai:{key:"maathai",name:"Wangari Maathai",role:"A biologist",skin:[118,76,54],hair:{style:"coily",c:[30,24,22]},earrings:[230,204,150],top:{kind:"jacket",c:[158,122,94],inner:[240,232,216]},bottom:{kind:"long",c:[110,86,70]},shoe:[62,48,42]},
  elder:{key:"maathai",name:"Wangari Maathai",skin:[118,76,54],hair:{style:"scarf",c:[226,196,120]},earrings:[230,204,150],top:{kind:"jacket",c:[96,128,112],inner:[240,232,216]},bottom:{kind:"long",c:[84,74,96]},shoe:[62,48,42]},
  wan:{key:"wan",skin:[104,66,48],hair:{style:"scarf",c:[204,124,112]},top:{kind:"sweater",c:[120,110,106]},bottom:{kind:"skirt",c:[154,118,80]},shoe:[74,56,44]},
  nya:{key:"nya",skin:[128,86,60],hair:{style:"scarf",c:[236,222,198]},top:{kind:"jacket",c:[150,74,70],inner:[228,214,190]},bottom:{kind:"long",c:[82,80,108]},shoe:[56,46,42]},
  mum:{key:"mum",skin:[94,60,44],hair:{style:"scarf",c:[112,94,88]},top:{kind:"jacket",c:[158,146,118],inner:[216,204,186]},bottom:{kind:"skirt",c:[118,114,80]},shoe:[68,52,42]},
  boy:{key:"boy",kid:true,skin:[110,70,50],hair:{style:"coily",c:[30,24,22]},top:{kind:"sweater",c:[206,180,126],sleeve:"short"},bottom:{kind:"trousers",c:[112,98,86]},shoe:[96,70,52]},
  girl:{key:"girl",kid:true,skin:[98,62,46],hair:{style:"coily",c:[28,22,22]},top:{kind:"sweater",c:[178,136,150],sleeve:"short"},bottom:{kind:"skirt",c:[104,116,140]},shoe:[96,70,52]}
};
const OO_PAL={mount:[160,172,196],snow:[252,252,252],ridge:[150,174,166],ridge2:[170,188,152],fields:[[218,190,124],[192,204,130],[152,180,112],[208,132,92],[230,210,154],[124,156,106],[180,154,100]],tea:[98,142,96],
  soil:[194,96,60],soilDk:[164,74,48],soilLt:[214,122,80],gully:[132,54,40],gullyLt:[226,146,100],stone:[230,212,186],straw:[226,192,116],stump:[126,88,62],stumpTop:[228,200,154],leaf:[104,160,92],
  grass:[150,176,104],grassDk:[122,152,92],water:[124,176,204],thatch:[206,176,122],pole:[150,112,80],sleeve:[70,66,70],can:[226,190,112],wood:[[142,104,74],[118,86,62],[160,122,88]]};
const oo_c=(n,i)=>PK.S.tone(i==null?OO_PAL[n]:OO_PAL[n][i]);
const OO_HILL=[x=>372+16*Math.sin(x/310+1.2)+10*Math.sin(x/130),x=>446+22*Math.sin(x/380+2.4)+9*Math.sin(x/150+1),x=>536+26*Math.sin(x/430+0.3)+12*Math.sin(x/170+2)];
const oo_slope=x=>690-46*Math.sin((x+260)/640)-14*Math.sin(x/210+1.3);
function oo_ridge(f,yb,x0,x1,step){const p=[];for(let x=x0;x<=x1;x+=step||60)p.push([x,f(x)]);p.push([x1+40,yb,1],[x0-40,yb,1]);return p;}
// small farms on a fold of the hills: strips of fields, some of them tea; green: the years after, with more of it grown over
function oo_fields(ctx,f,yb,seed,far,green){const S=PK.S,U=PK.u,R=U.rnd(seed),bh=(yb-f(900))/2.2;ctx.save();ctx.beginPath();U.spline(ctx,oo_ridge(f,yb,-60,1980));ctx.clip();
  for(let j=0;j<3;j++){let x=-80-R()*120;while(x<1990){const w=130+R()*190,sl=24+R()*30,d0=j*bh-2,d1=(j+1)*bh+2,ci=(R()*OO_PAL.fields.length)|0,tea=R()<0.22,
        col=U.mix(tea?oo_c("tea"):U.mix(oo_c("fields",ci),oo_c("ridge2"),far*0.5),oo_c("grassDk"),green?0.45:0);
      const top=[],bot=[];for(let i=0;i<=3;i++){const xx=x+w*i/3;top.push([xx,f(xx)+d0]);bot.push([xx-sl,f(xx-sl)+d1]);}
      const pts=top.concat(bot.reverse());top[0][2]=1;top[3][2]=1;pts[4][2]=1;pts[7][2]=1;S.poly(ctx,pts,col,{w:0.5,flat:true,exact:true});
      if(tea||R()<0.35){ctx.strokeStyle=U.css(U.dk(col,tea?0.22:0.1),0.9);ctx.lineWidth=1.2;ctx.beginPath();const n=Math.round(w/(tea?11:17));
        for(let i=1;i<n;i++){const xx=x+w*i/n;ctx.moveTo(xx,f(xx)+d0+3);ctx.lineTo(xx-sl,f(xx-sl)+d1-3);}ctx.stroke();}
      x+=w+3;}}
  ctx.restore();}
function oo_tuft(ctx,x,y,k,seed,col){const U=PK.u,R=U.rnd(seed);ctx.fillStyle=U.css(col||U.mix(oo_c("straw"),oo_c("soilLt"),R()*0.3));ctx.beginPath();
  for(let i=0;i<4;i++){const a=-0.6+i*0.4+R()*0.2,l=(14+R()*12)*k;ctx.moveTo(x-2.5*k,y);ctx.quadraticCurveTo(x+Math.sin(a)*l*0.5,y-l*0.6,x+Math.sin(a)*l,y-Math.cos(a)*l);ctx.quadraticCurveTo(x+Math.sin(a)*l*0.4+2*k,y-l*0.5,x+2.5*k,y);}ctx.fill();}
function oo_stump(ctx,x,y,k){const S=PK.S,U=PK.u;S.fill(ctx,c=>{U.rrect(c,x-22*k,y-20*k,44*k,26*k,6*k);U.ell(c,x,y+4*k,22*k,7*k);},oo_c("stump"),{});S.fill(ctx,c=>U.ell(c,x,y-20*k,22*k,7*k),oo_c("stumpTop"),{flat:true});
  S.line(ctx,c=>{c.moveTo(x+8*k,y-20*k);c.arc(x,y-20*k,8*k,0,U.TAU);},U.dk(oo_c("stumpTop"),0.3),0.4);}
const OO_GULLY=[[[330,668,3],[322,720,6],[300,790,9],[262,880,13],[210,980,18],[160,1090,22]],[[1262,690,3],[1280,740,6],[1300,820,9],[1304,900,12],[1330,990,16],[1350,1090,20]],[[1700,676,3],[1716,740,5],[1750,820,8],[1800,930,12],[1850,1090,16]]];
function oo_gully(ctx,pts,k){const S=PK.S,U=PK.u,L=[],Rr=[];pts.forEach(([x,y,w],i)=>{const q=pts[Math.min(i+1,pts.length-1)],p=pts[Math.max(i-1,0)],a=Math.atan2(q[1]-p[1],q[0]-p[0]),n=[-Math.sin(a),Math.cos(a)];w*=k||1;L.push([x+n[0]*w,y+n[1]*w]);Rr.push([x-n[0]*w,y-n[1]*w]);});
  const all=L.concat(Rr.reverse());all[0][2]=1;S.poly(ctx,all,oo_c("gully"),{w:0.6,flat:true,exact:true});
  ctx.save();ctx.beginPath();U.spline(ctx,all);ctx.clip();ctx.strokeStyle=U.css(oo_c("gullyLt"),0.85);ctx.lineWidth=5;ctx.beginPath();U.spline(ctx,Rr.reverse().map(q=>[q[0]+2,q[1]]),false);ctx.stroke();ctx.restore();}
// a plant that did not take: a dry stalk with hanging leaves
function oo_wilted(ctx,x,y,k,seed){const S=PK.S,U=PK.u,R=U.rnd(seed),st=U.mix(oo_c("straw"),oo_c("leaf"),0.35),lf=U.mix(oo_c("straw"),oo_c("leaf"),0.2),bend=(R()-0.3)*14*k,top=[x+bend,y-(58+R()*18)*k];
  S.fill(ctx,c=>{c.moveTo(x-3*k,y);c.quadraticCurveTo(x-2*k,y-30*k,top[0]-1.5*k,top[1]);c.lineTo(top[0]+1.5*k,top[1]);c.quadraticCurveTo(x+3*k,y-30*k,x+3*k,y);c.closePath();},U.dk(st,0.12),{w:0.5,flat:true});
  for(const [f,a,l] of [[0.42,-1,30],[0.6,1,34],[0.82,-1,28],[1,1,30]]){const bx=U.lerp(x,top[0],f),by=U.lerp(y,top[1],f),ex=bx+a*l*k*(0.8+R()*0.3),ey=by+(10+R()*16)*k;
    S.fill(ctx,c=>{c.moveTo(bx,by);c.quadraticCurveTo(bx+a*l*k*0.55,by-16*k,ex,ey);c.quadraticCurveTo(bx+a*l*k*0.5,by-4*k,bx,by+5*k);c.closePath();},a>0?lf:U.lt(lf,0.1),{w:0.5,flat:true});}
  S.fill(ctx,c=>U.ell(c,x,y+2*k,15*k,4.5*k),oo_c("soilDk"),{w:0.5,flat:true});}
// the sky, Mount Kenya far off, a ridge and three folds of farmed hills; green: years later, with trees along them
function oo_far(ctx,green){const S=PK.S,U=PK.u;const g=ctx.createLinearGradient(0,0,0,430);g.addColorStop(0,U.css(PK.col("skyTop")));g.addColorStop(1,U.css(PK.col("skyLow")));ctx.fillStyle=g;ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:1.6,far:0.72,sh:3});
  S.poly(ctx,[[1010,372,1],[1180,318],[1330,236],[1418,168],[1452,132,1],[1476,156],[1500,140,1],[1540,186],[1640,250],[1790,318],[1960,372,1]],oo_c("mount"),{exact:true,flat:true});
  S.poly(ctx,[[1418,168],[1452,132,1],[1476,156],[1500,140,1],[1530,176],[1508,186],[1484,172],[1462,192],[1440,176],[1424,188]],oo_c("snow"),{w:0.6,flat:true,exact:true});
  S.line(ctx,c=>{c.moveTo(1452,150);c.lineTo(1380,250);c.moveTo(1500,160);c.lineTo(1580,262);c.moveTo(1470,190);c.lineTo(1450,300);},null,0.5);
  S.poly(ctx,oo_ridge(x=>338+10*Math.sin(x/260)+6*Math.sin(x/90+1),1080,-60,1980),U.mix(oo_c("ridge"),oo_c("grassDk"),green?0.3:0),{flat:true,exact:true});
  OO_HILL.forEach((f,i)=>{S.begin(ctx,{lw:1.6+i*0.4,far:0.62-i*0.2,sh:3});S.poly(ctx,oo_ridge(f,1080,-60,1980),U.mix(U.mix(oo_c("ridge2"),oo_c("fields",1),0.3+i*0.2),oo_c("grassDk"),green?0.4:0),{flat:true,exact:true});
    oo_fields(ctx,f,i<2?OO_HILL[i+1](900)+40:720,31+i*7,0.5-i*0.22,green);S.line(ctx,c=>U.spline(c,oo_ridge(f,1080,-60,1980).slice(0,-2),false),null,0.8);
    if(green){const R=U.rnd(60+i),col=U.mix(PK.col(i%2?"viewTree":"viewTree2"),oo_c("ridge"),0.3-i*0.1),k=0.5+i*0.28;
      for(let x=-20;x<1960;x+=(54+R()*90)*k){const y=f(x)+6+R()*(i<2?50:80)*k,r=(15+R()*9)*k;S.fill(ctx,c=>{U.rrect(c,x-2*k,y,4*k,18*k,1);U.ell(c,x,y-2*k,r,r*0.84);U.ell(c,x+r*0.7,y+r*0.2,r*0.6,r*0.5);},col,{w:0.5,flat:true});}}});}
// the bed of the stream down the last hill: dry stones, or water again
function oo_bed(ctx,water){const S=PK.S,U=PK.u,bed=[[1560,556,7],[1500,580,9],[1430,592,11],[1380,612,13],[1300,628,15],[1240,654,18],[1150,676,22]],L=[],Rr=[];S.begin(ctx,{lw:2,far:0.3,sh:3});
  bed.forEach(([x,y,w])=>{L.push([x,y-w*0.6]);Rr.push([x+w*0.5,y+w*0.6]);});S.poly(ctx,L.concat(Rr.reverse()),water?oo_c("water"):U.mix(oo_c("stone"),oo_c("straw"),0.35),{w:0.6,flat:true,exact:true});
  const R=U.rnd(9);for(let i=0;i<(water?9:26);i++){const b=bed[1+((R()*5)|0)],x=b[0]+(R()-0.5)*60,y=b[1]+(R()-0.5)*b[2];S.fill(ctx,c=>U.ell(c,x,y,3+R()*5,2+R()*3),U.mix(oo_c("stone"),[150,140,130],R()*0.4),{w:0.4,flat:true});}}
/* the hills of the central highlands in the 1970s, their forests cleared: red soil, gullies where the rain ran, stumps */
function oo_hillsPlace(ctx){const S=PK.S,U=PK.u;oo_far(ctx,false);oo_bed(ctx,false);S.begin(ctx,{lw:2.6,far:0.12,sh:5});const sl=oo_ridge(oo_slope,1100,-60,1980,80);
  S.poly(ctx,sl,oo_c("soil"),{grad:[0,640,0,1080,0.2],exact:true});
  ctx.save();ctx.beginPath();U.spline(ctx,sl);ctx.clip();ctx.strokeStyle=U.css(oo_c("soilDk"),0.55);ctx.lineWidth=1.6;
  for(let j=0;j<7;j++){ctx.beginPath();for(let x=-40;x<=1960;x+=80){const y=oo_slope(x)+44+j*56+8*Math.sin(x/190+j);x<0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}ctx.restore();
  OO_GULLY.forEach(g=>oo_gully(ctx,g));for(const [x,y,k] of [[190,760,1.1],[1480,770,1.1],[1640,870,1.3],[820,720,0.8],[1120,742,0.9]])oo_stump(ctx,x,y,k);
  const Rt=U.rnd(5);for(let i=0;i<70;i++){const x=Rt()*1920,y=oo_slope(x)+30+Rt()*360;oo_tuft(ctx,x,y,0.7+(y-650)/420,i+3);}
  for(let i=0;i<60;i++){const x=Rt()*1920,y=oo_slope(x)+24+Rt()*380;ctx.fillStyle=U.css(Rt()<0.5?oo_c("soilDk"):oo_c("soilLt"),0.7);ctx.beginPath();ctx.ellipse(x,y,2+Rt()*4,1.4+Rt()*2,0,0,U.TAU);ctx.fill();}}
/* the same hills, years later: grass on the slope, the gullies closed, water in the stream, trees along the crest */
const OO_TREES=[[150,742,1.9,3],[520,720,1.55,8],[1010,716,1.75,5],[1420,734,1.6,12],[1800,756,2.0,9]];
function oo_greenPlace(ctx){const S=PK.S,U=PK.u;oo_far(ctx,true);oo_bed(ctx,true);S.begin(ctx,{lw:2.6,far:0.12,sh:5});const sl=oo_ridge(oo_slope,1100,-60,1980,80),gr=U.mix(oo_c("grass"),oo_c("soil"),0.12);
  S.poly(ctx,sl,gr,{grad:[0,640,0,1080,0.18],exact:true});
  ctx.save();ctx.beginPath();U.spline(ctx,sl);ctx.clip();ctx.strokeStyle=U.css(oo_c("grassDk"),0.5);ctx.lineWidth=1.6;
  for(let j=0;j<7;j++){ctx.beginPath();for(let x=-40;x<=1960;x+=80){const y=oo_slope(x)+44+j*56+8*Math.sin(x/190+j);x<0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
  ctx.fillStyle=U.css(oo_c("soil"),0.5);for(const [x,y,rx,ry] of [[420,930,150,26],[1240,880,120,20],[1640,1000,170,28]]){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,U.TAU);ctx.fill();}ctx.restore();
  const Rt=U.rnd(5);for(let i=0;i<90;i++){const x=Rt()*1920,y=oo_slope(x)+30+Rt()*360;oo_tuft(ctx,x,y,0.7+(y-650)/420,i+3,U.mix(oo_c("grassDk"),oo_c("straw"),Rt()*0.4));}
  S.begin(ctx,{lw:3,far:0.1,sh:5});OO_TREES.forEach(([x,y,k,sd])=>PK.tree(ctx,x,y,k,sd,{}));}
/* a group's nursery: beds of seedlings in their sleeves, under a shade of poles */
const OO_BEDS=[[250,760,560,0],[900,744,520,1],[560,880,640,2],[1300,872,500,3]];
function oo_nurseryPlace(ctx){const S=PK.S,U=PK.u;oo_far(ctx,false);S.begin(ctx,{lw:2.6,far:0.12,sh:5});const yard=[[-40,650],[500,640],[1100,646],[1960,652],[1960,1100,1],[-40,1100,1]];
  S.poly(ctx,yard,U.mix(oo_c("soil"),oo_c("straw"),0.25),{grad:[0,640,0,1080,0.16],exact:true});
  const Rt=U.rnd(15);for(let i=0;i<50;i++){const x=Rt()*1920,y=670+Rt()*380;ctx.fillStyle=U.css(Rt()<0.5?oo_c("soilDk"):oo_c("soilLt"),0.6);ctx.beginPath();ctx.ellipse(x,y,2+Rt()*4,1.4+Rt()*2,0,0,U.TAU);ctx.fill();}
  // the shade: poles at the back, a roof of sticks, its soft shadow on the yard
  ctx.fillStyle="rgba(90,50,40,0.1)";ctx.beginPath();PK.u.pg(ctx,[[300,700],[1640,700],[1760,1000],[160,1000]]);ctx.fill();
  S.fill(ctx,c=>{for(const x of [356,960,1560])U.rrect(c,x-9,250,18,440,5);},U.dk(oo_c("pole"),0.1),{});
  S.poly(ctx,[[250,246,1],[1680,246,1],[1740,206,1],[320,206,1]],oo_c("thatch"),{grad:[0,206,0,246,0.14],exact:true});
  S.line(ctx,c=>{for(let x=300;x<1700;x+=46){c.moveTo(x,246);c.lineTo(x+52,206);}},U.dk(oo_c("thatch"),0.3),0.5);
  // the beds: rows of seedlings in dark sleeves
  S.begin(ctx,{lw:2.4,far:0.1,sh:4});OO_BEDS.forEach(([x,y,w,sd])=>oo_seedBed(ctx,x,y,w,sd));
  // a drum of water by the last pole
  S.fill(ctx,c=>U.rrect(c,1660,560,120,150,14),[112,128,138],{grad:[1780,0,1660,0,0.2]});S.fill(ctx,c=>U.ell(c,1720,562,60,14),oo_c("water"),{});
  S.begin(ctx,{lw:2.8,far:0,sh:5});S.fill(ctx,c=>{for(const x of [300,1620])U.rrect(c,x-12,230,24,620,6);},oo_c("pole"),{grad:[0,230,0,850,0.1]});}
// a bed of seedlings: three rows of them in their sleeves, on a low frame; g: how grown they are
function oo_seedBed(ctx,x,y,w,seed,g){const S=PK.S,U=PK.u,R=U.rnd(seed+20);S.fill(ctx,c=>PK.u.pg(c,[[x,y],[x+w,y],[x+w+30,y+58],[x-30,y+58]]),U.dk(oo_c("soilDk"),0.15),{});
  for(let r=0;r<3;r++){const n=Math.round(w/34),yy=y+10+r*18;for(let i=0;i<n;i++){const xx=x-r*10+10+i*((w+r*20-20)/(n-1)),k=0.62+r*0.07,h=(g==null?0.55+R()*0.45:g);
      PK.seedling(ctx,xx,yy-9*k,k,h,{bare:true});S.fill(ctx,c=>U.rrect(c,xx-7*k,yy-9*k,14*k,17*k,2),oo_c("sleeve"),{w:0.5,flat:true});}}}

/* ---------------------------------------------------------------- what the women carry, drawn in a hand (PK.person's hold) */
const oo_firewood=(ctx,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u,x=h[0]-18*u,y=h[1]-34*u;ctx.save();ctx.translate(x,y);ctx.rotate(-0.1);
  for(let i=0;i<6;i++){const yy=(i-2.5)*17*u+(i%2?3:-2)*u,x0=-150*u+(i*37%40)*u,x1=150*u-(i*23%44)*u;S.fill(ctx,c=>U.capsule(c,[x0,yy],[x1,yy+(i%2?5:-4)*u],11*u,9*u),oo_c("wood",i%3),{w:0.7});}
  S.fill(ctx,c=>{U.rrect(c,-70*u,-56*u,12*u,112*u,4*u);U.rrect(c,56*u,-54*u,12*u,108*u,4*u);},S.tone([206,176,128]),{w:0.6,flat:true});ctx.restore();};
const oo_can=(ctx,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u,x=h[0],y=h[1]+6*u,col=oo_c("can");
  S.fill(ctx,c=>{U.rrect(c,x-62*u,y+30*u,124*u,150*u,22*u);U.rrect(c,x+34*u,y+12*u,26*u,22*u,5*u);},col,{grad:[x+50*u,0,x-70*u,0,0.2]});
  S.line(ctx,c=>{c.moveTo(x-30*u,y+34*u);c.quadraticCurveTo(x,y-22*u,x+30*u,y+34*u);},null,1);};
// a seedling in its sleeve, held up in a hand; g how grown
const oo_inHand=g=>(ctx,h,deg,J)=>{const S=PK.S,U=PK.u,k=J.u*2.2,x=h[0]+8*J.u,y=h[1]-6*J.u;PK.seedling(ctx,x,y-16*k,k,g==null?0.8:g,{bare:true});S.fill(ctx,c=>U.rrect(c,x-7*k,y-17*k,14*k,22*k,3*k),oo_c("sleeve"),{w:0.6,flat:true});};
// a tray of seedlings carried in both arms
const oo_tray=(ctx,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u,x=h[0]+10*u,y=h[1]-10*u;for(let i=0;i<5;i++)PK.seedling(ctx,x-88*u+i*44*u,y-18*u,u*1.5,0.7+0.3*((i*7)%3)/2,{bare:true});
  S.fill(ctx,c=>U.rrect(c,x-116*u,y-22*u,232*u,40*u,8*u),S.tone([176,136,96]),{grad:[0,y-22*u,0,y+18*u,0.14]});};
// a few coins in an open hand; a (0 to 1): how far they are there, so they pass from one hand to the other over a few frames
const oo_coins=a=>(ctx,h,deg,J)=>{if(!(a>0.004))return;const u=J.u;ctx.save();ctx.globalAlpha*=Math.min(1,a);for(const [dx,dy] of [[-10,-22],[8,-26],[0,-34]]){ctx.fillStyle=PK.u.css([232,196,104]);ctx.strokeStyle=PK.u.css([150,112,40]);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(h[0]+dx*u,h[1]+dy*u,13*u,7*u,0,0,PK.u.TAU);ctx.fill();ctx.stroke();}ctx.restore();};

/* ---------------------------------------------------------------- the row of young trees on the slope, planted out: five of seven live */
const OO_ROW={x:[620,760,900,1040,1180,1320,1460],alive:[1,1,0,1,1,0,1],y:x=>oo_slope(x)+150+0.04*(x-620)};
// g: how grown the living ones are (0 to 1); dry: how far the others have died; ticks: when the first living one is counted (a
// time; the others follow), or a function of a tree's place in the row that gives its own time; fresh {i, g}: a new seedling,
// grown to g, planted where the i-th one died
function oo_row(ctx,tt,g,dry,ticks,fresh){OO_ROW.x.forEach((x,i)=>{const y=OO_ROW.y(x);PK.S.begin(ctx,{lw:2.4,far:0,sh:4});
    if(OO_ROW.alive[i])PK.seedling(ctx,x,y,2.2+1.6*g,0.6+0.4*g,{});else if(fresh&&fresh.i===i){if(fresh.g>0.02)PK.seedling(ctx,x,y,2.2,fresh.g,{});}
    else if(dry>0.5)oo_wilted(ctx,x,y,1.3,i+3);else PK.seedling(ctx,x,y,2.2,0.6,{col:PK.u.mix(oo_c("leaf"),oo_c("straw"),dry*1.6)});
    if(ticks!=null&&OO_ROW.alive[i]){const n=OO_ROW.alive.slice(0,i).filter(Boolean).length;PK.tick(ctx,x,y-(150+70*g),26,ag_spr(tt,typeof ticks==="function"?ticks(i):ticks+n*0.45,0.5),null);}});}
// soil sliding down the gullies after rain: a (0 to 1) how much
function oo_run(ctx,tt,a){if(a<=0.004)return;const U=PK.u;ctx.save();ctx.globalAlpha*=a;OO_GULLY.forEach((g,gi)=>{for(let i=0;i<9;i++){const ph=((tt*0.22+i/9+gi*0.37)%1),f=ph*(g.length-1),j=Math.min(g.length-2,f|0),u=f-j,x=U.lerp(g[j][0],g[j+1][0],u),y=U.lerp(g[j][1],g[j+1][1],u),w=U.lerp(g[j][2],g[j+1][2],u);
      ctx.fillStyle=U.css(i%2?oo_c("gullyLt"):oo_c("soilLt"),Math.sin(ph*Math.PI));ctx.beginPath();ctx.ellipse(x+Math.sin(i*2.1)*w*0.5,y,w*0.5,w*0.24,0.3,0,U.TAU);ctx.fill();}});ctx.restore();}
// what every shot of the hills draws over them: the clouds, which drift, and the plot where the food did not take
const oo_sky=(x,tt)=>{PK.S.begin(x,{lw:1.5,far:0.8,sh:3});PK.cloud(x,380+tt*3,150,1.2);PK.cloud(x,1100+tt*2,96,0.9);};
const oo_plot=x=>{PK.S.begin(x,{lw:2.4,far:0,sh:4});[[992,892,1.25,3],[1058,902,1.3,5],[930,884,1.15,8],[1124,908,1.3,11]].forEach(([px,py,k,sd])=>oo_wilted(x,px,py,k,sd));};
AG_PLACES.ooHills=oo_hillsPlace;AG_PLACES.ooNursery=oo_nurseryPlace;AG_PLACES.ooGreen=oo_greenPlace;
// the hills with nobody on them: what a later moment there passes through
AG_BARE.ooHills=(x,tt)=>{oo_sky(x,tt);oo_plot(x);};AG_BARE.ooGreen=(x,tt)=>oo_sky(x,tt);AG_BARE.ooNursery=(x,tt)=>oo_sky(x,tt);
