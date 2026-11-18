/* ===== Saying no, and what instead: the Aral Sea, 1960s to 2014, in ink line =====
   The opening story's places, people and things (prefix snp_). The people kit draws the people and the rooms' things and is never
   changed for this film. Checked against the script's Rigour (the World Bank's project papers on the Syr Darya and the Northern Aral
   Sea; Micklin, 2007 and 2016).
     snpHarbour  Aralsk's harbour: a low town, a jetty, the sand where the sea was (the water drawn with the shot, snp_water)
     snpFields   cotton fields in the desert, a canal of the river's water across them
     snpOffice   an office of the water board: a board on the wall (the engineers' rows), the map in its frame (snp_map)
     snpDam      the Kok-Aral dam: a long low bank across the strait, the northern sea behind it, the dry bed in front
   Nothing is a likeness or a copy of a photograph; nobody is shown ill. Colour keeps the module's meaning: blue the plan (the dam),
   amber what was lost, green what came back; the sea, the sand and the sky carry none. Every name this file declares starts with
   snp_ or SNP_. */
const SNP_E=520,snp_h=fl=>PK.hAt(fl,SNP_E),SNP_IE=380,snp_hi=fl=>PK.hAt(fl,SNP_IE),SNP_RF=800;
const SNP_PAL={sky:[208,224,232],sky2:[244,236,216],sand:[222,204,168],sand2:[204,184,146],sea:[110,160,178],sea2:[150,190,200],town:[226,210,180],roof:[150,140,130],
  wood:[150,112,80],field:[150,160,110],cotton:[246,244,236],canal:[120,166,180],wall:[222,216,198],floor:[170,150,122],bank:[176,160,128],rust:[170,110,80],hull:[96,120,136]};
const snp_c=k=>PK.S.tone(SNP_PAL[k]);
function snp_sky(ctx,hz){const U=PK.u,g=ctx.createLinearGradient(0,0,0,hz);g.addColorStop(0,U.css(snp_c("sky")));g.addColorStop(1,U.css(snp_c("sky2")));ctx.fillStyle=g;ctx.fillRect(0,0,1920,hz+4);}
function snp_ground(ctx,hz,col){const S=PK.S;S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,hz,1],[1940,hz,1],[1940,1100,1],[-20,1100,1]],snp_c(col||"sand"),{exact:true,grad:[0,hz,0,1080,0.12]});}

/* ---------------------------------------------------------------- places */
AG_PLACES.snpHarbour=ctx=>{const S=PK.S,hz=SNP_E+10;snp_sky(ctx,hz);snp_ground(ctx,hz);
  // the town, low, on the left; the jetty's posts running out from it
  S.begin(ctx,{lw:2.2,far:0.35,sh:2});for(let i=0;i<6;i++){const x0=-40+i*120,h=60+(i*29)%40;S.fill(ctx,c=>c.rect(x0,hz-h,104,h),snp_c("town"),{w:0.5});S.fill(ctx,c=>c.rect(x0-4,hz-h-10,112,12),snp_c("roof"),{w:0.5});}
  S.begin(ctx,{lw:2.4,sh:3});S.fill(ctx,c=>c.rect(560,hz+40,520,16),snp_c("wood"),{});S.fill(ctx,c=>{for(let x=580;x<1080;x+=70)c.rect(x,hz+56,10,40);},PK.u.dk(snp_c("wood"),0.2),{});};
// the water: how near it comes (near 0: none, gone over the horizon; 1: up to the jetty)
function snp_water(ctx,near){if(near<=0.004)return;const S=PK.S,hz=SNP_E+10,y=hz+PK.u.lerp(0,90,near);S.begin(ctx,{lw:2.4,sh:2});
  S.poly(ctx,[[-20,hz,1],[1940,hz,1],[1940,y,1],[-20,y+PK.u.lerp(0,30,near),1]],snp_c("sea"),{exact:true,grad:[0,hz,0,y,0.15]});}
// a fishing boat, its hull seen from the side (lean: degrees, as it lies on the sand)
function snp_boat(ctx,x,y,k,lean,o){o=o||{};const S=PK.S;ctx.save();ctx.translate(x,y);ctx.rotate((lean||0)*Math.PI/180);S.begin(ctx,{lw:2.6*k,sh:3});
  S.fill(ctx,c=>{c.moveTo(-160*k,-60*k);c.lineTo(170*k,-60*k);c.quadraticCurveTo(150*k,0,100*k,0);c.lineTo(-120*k,0);c.quadraticCurveTo(-150*k,-20*k,-160*k,-60*k);c.closePath();},o.rust?snp_c("rust"):snp_c("hull"),{});
  S.fill(ctx,c=>c.rect(-40*k,-110*k,80*k,50*k),[236,232,222],{});S.line(ctx,c=>{c.moveTo(60*k,-60*k);c.lineTo(60*k,-200*k);},[90,80,70],1.2*k);ctx.restore();}
AG_PLACES.snpFields=ctx=>{const S=PK.S,hz=480;snp_sky(ctx,hz);snp_ground(ctx,hz,"field");
  S.begin(ctx,{lw:2.2,sh:2});for(let r=0;r<9;r++){const y=hz+20+r*r*7+r*20,s=0.4+r*0.12;S.line(ctx,c=>{c.moveTo(-20,y);c.lineTo(1940,y);},PK.u.dk(snp_c("field"),0.2),0.6);
    S.fill(ctx,c=>{for(let x=(r%2)*30;x<1960;x+=60*s+20){c.moveTo(x+8*s,y-6*s);c.arc(x,y-6*s,8*s,0,7);}},snp_c("cotton"),{w:0.4});}
  // the canal, bringing the river's water, from the far left to the near right
  S.fill(ctx,c=>{c.moveTo(200,hz);c.lineTo(240,hz);c.lineTo(1940,1000);c.lineTo(1940,1080);c.closePath();},snp_c("canal"),{});};
AG_PLACES.snpOffice=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(snp_c("wall"));ctx.fillRect(0,0,1920,SNP_RF);
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,SNP_RF-60,1960,60),U.dk(snp_c("wall"),0.1),{w:0.6});
  S.poly(ctx,[[-20,SNP_RF,1],[1940,SNP_RF,1],[1940,1100,1],[-20,1100,1]],snp_c("floor"),{exact:true,grad:[0,SNP_RF,0,1080,0.1]});
  PK.board(ctx,SNP_BD.x,SNP_BD.y,SNP_BD.w,SNP_BD.h,{});
  S.fill(ctx,c=>c.rect(SNP_MAP.x-14,SNP_MAP.y-14,SNP_MAP.w+28,SNP_MAP.h+28),snp_c("wood"),{});};
const SNP_BD={x:200,y:240,k:0.5,w:1250*0.5,h:524*0.5,floor:930,rest:920};
const SNP_MAP={x:1080,y:150,w:420,h:480};
// the map in its frame: n the northern sea (1 its size in 1960), s the southern (1 in 1960), e its eastern part, dam (0 to 1)
function snp_map(ctx,st){const S=PK.S,{x,y,w,h}=SNP_MAP,P=(u,v)=>[x+u*w,y+v*h];S.begin(ctx,{lw:2,sh:0});
  S.fill(ctx,c=>c.rect(x,y,w,h),snp_c("sand"),{flat:true,line:false});
  const lake=(u,v,ru,rv,a)=>{if(a<=0.01)return;S.fill(ctx,c=>c.ellipse(x+u*w,y+v*h,ru*w*a,rv*h*a,0,0,7),snp_c("sea"),{});};
  // the rivers: the Syr Darya into the north, the Amu Darya into the south
  S.line(ctx,c=>{c.moveTo(...P(1.0,0.12));c.quadraticCurveTo(...P(0.75,0.15),...P(0.55,0.24));c.moveTo(...P(0.9,1.0));c.quadraticCurveTo(...P(0.7,0.92),...P(0.55,0.8));},snp_c("canal"),1.0);
  lake(0.42,0.24,0.2,0.13,st.n);lake(0.4,0.6,0.13,0.3,Math.max(st.s,0.5));lake(0.6,0.58,0.22,0.26,st.e);lake(0.5,0.6,0.26,0.3,st.s>0.9?st.s:0);
  if((st.dam||0)>0.01){ctx.save();ctx.globalAlpha*=st.dam;S.line(ctx,c=>{c.moveTo(...P(0.33,0.38));c.lineTo(...P(0.5,0.38));},PK.C.blue,1.8);ctx.restore();}}
AG_PLACES.snpDam=ctx=>{const S=PK.S,hz=SNP_E-60;snp_sky(ctx,hz);
  // the northern sea behind the bank, the dry bed in front
  S.begin(ctx,{lw:2.4,sh:3});S.poly(ctx,[[-20,hz,1],[1940,hz,1],[1940,hz+120,1],[-20,hz+120,1]],snp_c("sea"),{exact:true,grad:[0,hz,0,hz+120,0.15]});
  snp_ground(ctx,hz+120,"sand2");
  S.fill(ctx,c=>{c.moveTo(-20,hz+150);c.lineTo(-20,hz+90);c.lineTo(1940,hz+70);c.lineTo(1940,hz+140);c.closePath();},snp_c("bank"),{grad:[0,hz+70,0,hz+150,0.15]});};

/* ---------------------------------------------------------------- the people of the Aral: nobody's likeness */
const SNP_FOLK={
  fisher1:{key:"snpFisher1",name:"",skin:[200,160,126],hair:{style:"short",c:[40,34,30]},top:{kind:"jacket",c:[86,96,110],inner:[230,226,214]},bottom:{kind:"trousers",c:[70,70,76]},shoe:[50,44,40]},
  fisher2:{key:"snpFisher2",name:"",skin:[214,174,140],hair:{style:"crop",c:[90,80,74]},beard:[110,100,92],top:{kind:"sweater",c:[120,90,70]},bottom:{kind:"trousers",c:[80,76,72]},shoe:[54,46,42]},
  woman1:{key:"snpWoman1",name:"",skin:[210,170,136],hair:{style:"scarf",c:[170,70,70]},top:{kind:"jacket",c:[90,110,140],inner:[236,228,214]},bottom:{kind:"skirt",c:[110,80,90]},shoe:[60,48,46]},
  farmer1:{key:"snpFarmer1",name:"",skin:[196,152,118],hair:{style:"short",c:[36,30,28]},top:{kind:"sweater",c:[200,190,160]},bottom:{kind:"trousers",c:[90,84,70]},shoe:[60,50,44]},
  farmer2:{key:"snpFarmer2",name:"",skin:[204,160,126],hair:{style:"scarf",c:[200,150,60]},top:{kind:"jacket",c:[150,90,96],inner:[236,228,214]},bottom:{kind:"skirt",c:[90,100,80]},shoe:[60,50,44]},
  eng:{key:"snpEng",name:"",skin:[214,176,144],hair:{style:"short",c:[50,42,38]},glasses:[60,52,50],top:{kind:"jacket",c:[90,100,120],inner:[232,228,218]},bottom:{kind:"trousers",c:[70,72,84]},shoe:[54,46,42]},
  sci:{key:"snpSci",name:"",skin:[222,186,156],hair:{style:"bun",c:[70,50,40]},top:{kind:"jacket",c:[140,120,90],inner:[240,236,226]},bottom:{kind:"trousers",c:[80,80,90]},shoe:[56,46,44]},
  worker1:{key:"snpWorker1",name:"",skin:[206,164,130],hair:{style:"crop",c:[46,38,34]},top:{kind:"jacket",c:[200,150,60],inner:[90,90,96]},bottom:{kind:"trousers",c:[80,84,96]},shoe:[50,44,40]},
  worker2:{key:"snpWorker2",name:"",skin:[190,146,112],hair:{style:"short",c:[40,34,30]},top:{kind:"jacket",c:[200,150,60],inner:[90,90,96]},bottom:{kind:"trousers",c:[80,84,96]},shoe:[50,44,40]}};
const snp_row=w=>typeof w==="string"?(SNP_FOLK[w]||PK.CAST[w]):w;
const snp_person=(ctx,who,x,fl,pose,o,hf)=>PK.person(ctx,snp_row(who),x,fl,(hf||snp_h)(fl),pose,o);
