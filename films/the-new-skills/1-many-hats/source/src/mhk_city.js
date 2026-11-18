/* ===== Many hats, one picture: Kaifeng, 1015, in ink line =====
   One main street of the capital, seen across: the houses on its far side (white walls, timber posts, grey tiled roofs), the roofs of
   the city beyond, and at the right the palace's gate tower on its platform of rammed earth. The street is packed earth. By night the
   palace beyond the gate burns; by day the street is dug into a trench, filled from the Bian canal, used by boats, and filled again.
   A drawing, not a likeness: nothing is copied from a painting of the time, and no characters are written anywhere. The people are
   nobody's likeness, dressed in plain everyday colours: workers in short jackets and trousers with a cloth bound round the hair,
   officials in long robes with the stiff cap of their office, whose two flat wings stand out to the sides.
   Every name this file declares starts with mhk_ or MHK_. */
const MHK_E=440,MHK_ST=560;                                     // the eye line, and where the street meets the houses
const mhk_h=fl=>PK.hAt(fl,MHK_E);
const MHK_TR={y0:640,y1:730,gate:1620};                         // the trench: its far and near edge, and where it ends at the gate
const MHK_PAL={sky:[206,224,232],sky2:[234,236,226],nsky:[46,52,82],nsky2:[96,82,92],wall:[238,232,216],wall2:[220,212,192],post:[128,84,62],
  roof:[120,130,140],roof2:[96,104,116],far:[178,184,190],far2:[196,200,204],earth:[214,190,150],earth2:[196,170,128],dirt:[150,112,78],dirt2:[122,90,64],
  water:[110,150,152],water2:[90,130,136],wood:[160,116,78],wood2:[128,90,60],log:[176,134,92],rubble:[150,140,130],rubble2:[120,112,104],
  red:[164,72,58],plat:[196,168,128],plat2:[176,148,110],flame:[236,150,70],flame2:[246,206,120],smoke:[120,116,118],cloth:[230,222,200]};
const mhk_c=k=>PK.S.tone(MHK_PAL[k]);
const mhk_n=(c,night)=>night?PK.u.mix(c,[40,46,78],0.62):c;

/* ---------------------------------------------------------------- the street, painted once (o.night: by night) */
function mhk_roof(ctx,x0,x1,y,h,col){const S=PK.S;
  S.fill(ctx,c=>{c.moveTo(x0-46,y-16);c.quadraticCurveTo(x0-12,y+4,x0+14,y+2);c.lineTo(x1-14,y+2);c.quadraticCurveTo(x1+12,y+4,x1+46,y-16);
    c.lineTo(x1-30,y-h);c.lineTo(x0+30,y-h);c.closePath();},col,{});
  S.line(ctx,c=>{for(let x=x0+40;x<x1-30;x+=26){c.moveTo(x,y-h+4);c.lineTo(x+(x-(x0+x1)/2)*0.05,y-2);}},PK.u.dk(col,0.18),0.5);
  S.fill(ctx,c=>c.rect(x0+24,y-h-8,x1-x0-48,10),PK.u.dk(col,0.15),{});}
function mhk_house(ctx,x0,x1,base,top,o){const S=PK.S,U=PK.u,n=c=>mhk_n(c,o.night);S.begin(ctx,{lw:2.4,far:0.2,sh:3});
  S.fill(ctx,c=>c.rect(x0,top,x1-x0,base-top),n(mhk_c("wall")),{grad:[0,top,0,base,0.08]});
  for(const px of [x0,x0+(x1-x0)/3,x0+2*(x1-x0)/3,x1])S.fill(ctx,c=>c.rect(px-8,top,16,base-top),n(mhk_c("post")),{w:0.6});
  S.fill(ctx,c=>c.rect(x0,top,x1-x0,12),n(mhk_c("post")),{w:0.6});
  const dx=x0+(x1-x0)/3+30,dw=(x1-x0)/3-60;S.fill(ctx,c=>c.rect(dx,base-118,dw,118),n(U.dk(mhk_c("post"),0.25)),{w:0.7});
  const wx=x0+2*(x1-x0)/3+26,ww=(x1-x0)/3-52;S.fill(ctx,c=>c.rect(wx,top+30,ww,56),n(mhk_c("wall2")),{w:0.6});
  S.line(ctx,c=>{for(let i=1;i<5;i++){c.moveTo(wx+ww*i/5,top+30);c.lineTo(wx+ww*i/5,top+86);}c.moveTo(wx,top+58);c.lineTo(wx+ww,top+58);},n(mhk_c("post")),0.5);
  mhk_roof(ctx,x0,x1,top,o.rh||70,n(mhk_c("roof")));}
function mhk_gate(ctx,o){const S=PK.S,U=PK.u,n=c=>mhk_n(c,o.night),x0=1330,x1=1960,top=330;S.begin(ctx,{lw:2.6,far:0.25,sh:4});
  // the platform of rammed earth, faced with brick, its doorway through
  S.poly(ctx,[[x0,MHK_ST+6,1],[x0+30,top,1],[x1+20,top,1],[x1+20,MHK_ST+6,1]],n(mhk_c("plat")),{exact:true,grad:[0,top,0,MHK_ST,0.12]});
  S.line(ctx,c=>{for(let y=top+30;y<MHK_ST;y+=34){c.moveTo(x0+30-(y-top)*0.13,y);c.lineTo(1940,y);}},n(mhk_c("plat2")),0.4);
  S.fill(ctx,c=>{c.moveTo(1560,MHK_ST+6);c.lineTo(1560,450);c.quadraticCurveTo(1620,402,1680,450);c.lineTo(1680,MHK_ST+6);c.closePath();},n([66,52,48]),{});
  if(o.night||o.burned)return;
  // the hall on top: red posts, a balustrade, a roof of two tiers
  S.begin(ctx,{lw:2.4,far:0.3,sh:3});S.fill(ctx,c=>c.rect(x0+70,top-16,x1-x0-70,16),n(mhk_c("post")),{});
  for(let px=x0+110;px<x1;px+=96)S.fill(ctx,c=>c.rect(px-9,top-130,18,116),n(mhk_c("red")),{w:0.6});
  S.fill(ctx,c=>c.rect(x0+80,top-140,x1-x0-60,14),n(U.dk(mhk_c("red"),0.2)),{w:0.6});
  mhk_roof(ctx,x0+90,1990,top-136,56,n(mhk_c("roof2")));mhk_roof(ctx,x0+170,1990,top-210,62,n(mhk_c("roof2")));}
function mhk_place(ctx,o){o=o||{};const S=PK.S,U=PK.u,n=c=>mhk_n(c,o.night);
  const sk=ctx.createLinearGradient(0,0,0,MHK_ST);sk.addColorStop(0,U.css(o.night?mhk_c("nsky"):mhk_c("sky")));sk.addColorStop(1,U.css(o.night?mhk_c("nsky2"):mhk_c("sky2")));
  ctx.fillStyle=sk;ctx.fillRect(0,0,1920,1080);
  if(!o.night){S.begin(ctx,{lw:1.5,far:0.8});PK.cloud(ctx,340,110,0.9);PK.cloud(ctx,980,70,0.7);}
  // the city beyond: roofs on roofs, paler with distance
  S.begin(ctx,{lw:1.6,far:0.65});for(const [x,y,w] of [[-40,380,260],[200,360,220],[420,384,300],[700,350,240],[930,372,280],[1180,356,200]])mhk_roof(ctx,x,x+w,y,36,n(mhk_c("far2")));
  S.begin(ctx,{lw:1.8,far:0.5});for(const [x,y,w] of [[60,420,240],[380,410,260],[720,424,230],[1020,404,260]])mhk_roof(ctx,x,x+w,y,40,n(mhk_c("far")));
  // the street: packed earth to the bottom of the picture
  S.begin(ctx,{lw:2.4,far:0.1,sh:3});S.poly(ctx,[[-40,MHK_ST,1],[1960,MHK_ST,1],[1960,1100,1],[-40,1100,1]],n(mhk_c("earth")),{exact:true,grad:[0,MHK_ST,0,1080,0.1]});
  S.line(ctx,c=>{for(const [x,y,l] of [[140,820,120],[560,960,160],[980,790,90],[1380,900,140],[1700,1000,120],[300,1040,100],[1200,1040,130],[760,600,80]]){c.moveTo(x,y);c.lineTo(x+l,y+3);}},n(mhk_c("earth2")),0.6);
  // the houses on the far side, and the gate tower
  for(const [x0,x1,top,rh] of [[-60,330,410,64],[350,760,396,72],[780,1060,418,60],[1080,1320,404,66]])mhk_house(ctx,x0,x1,MHK_ST,top,{night:o.night,rh});
  mhk_gate(ctx,o);
  // a willow by the street
  if(!o.night){S.begin(ctx,{lw:2.2,far:0.15,sh:3});PK.tree(ctx,1250,MHK_ST+20,0.95,3,{});}}
AG_PLACES.mhkStreet=ctx=>mhk_place(ctx,{});
AG_PLACES.mhkNight=ctx=>mhk_place(ctx,{night:true});
AG_PLACES.mhkBurned=ctx=>mhk_place(ctx,{burned:true});

/* ---------------------------------------------------------------- the fire beyond the gate: flames over the platform, smoke above.
   k (0 to 1): how far it has spread; tt moves the flames, slowly */
function mhk_fire(ctx,tt,k,o){o=o||{};const S=PK.S,U=PK.u;if(k<=0.004)return;ctx.save();ctx.globalAlpha*=U.clamp(k*1.5,0,1);
  const glow=ctx.createRadialGradient(1640,300,40,1640,300,620);glow.addColorStop(0,"rgba(246,170,90,0.55)");glow.addColorStop(1,"rgba(246,170,90,0)");ctx.fillStyle=glow;ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:2,far:0.2,sh:0});
  for(let i=0;i<7;i++){const fx=1380+i*86,on=U.clamp(k*7-i*0.6,0,1);if(on<=0)continue;const hh=(120+((i*53)%70))*on,sw=Math.sin(tt*2.1+i*1.7)*10;
    S.fill(ctx,c=>{c.moveTo(fx-46,332);c.quadraticCurveTo(fx-40+sw,332-hh*0.5,fx+sw*1.4,332-hh);c.quadraticCurveTo(fx+30-sw*0.5,332-hh*0.45,fx+46,332);c.closePath();},mhk_c("flame"),{w:0.5});
    S.fill(ctx,c=>{c.moveTo(fx-22,332);c.quadraticCurveTo(fx-16+sw,332-hh*0.3,fx+sw,332-hh*0.6);c.quadraticCurveTo(fx+14,332-hh*0.25,fx+22,332);c.closePath();},mhk_c("flame2"),{line:false});}
  S.begin(ctx,{lw:1.8,far:0.4});for(let i=0;i<4;i++){const sy=180-((tt*14+i*60)%220)*k,sx=1440+i*130+Math.sin(tt*0.4+i)*20;
    S.fill(ctx,c=>U.ell(c,sx,sy,90+i*10,40),U.mix(mhk_c("smoke"),[60,60,80],0.4),{w:0.5});}
  ctx.restore();}
// the next day: thin smoke still rising beyond the burned gate
function mhk_smoke(ctx,tt,a){const S=PK.S,U=PK.u;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a*0.8;S.begin(ctx,{lw:1.6,far:0.5});
  for(let i=0;i<4;i++){const sy=300-((tt*10+i*50)%200),sx=1500+i*110+Math.sin(tt*0.3+i)*16;S.fill(ctx,c=>U.ell(c,sx,sy,60+i*8,26),U.mix(mhk_c("smoke"),[220,220,220],0.4),{w:0.5});}
  ctx.restore();}

/* ---------------------------------------------------------------- the trench. o.dug (0 to 1): how far it runs from the left to the gate;
   o.water (0 to 1): how far the canal's water has come along it; o.fill (0 to 1): the rubble back in it, until it is street again */
function mhk_trench(ctx,o){const S=PK.S,U=PK.u,{y0,y1,gate}=MHK_TR,xe=U.lerp(-40,gate+60,o.dug==null?1:o.dug),f=o.fill||0;if(xe<=-30||f>=1)return;
  ctx.save();ctx.globalAlpha*=1-U.clamp((f-0.75)/0.25,0,1);S.begin(ctx,{lw:2.4,far:0.05,sh:2});
  // its far face, dark earth, and its floor
  S.poly(ctx,[[-40,y0,1],[xe,y0,1],[xe+20,y1,1],[-40,y1,1]],mhk_c("dirt"),{exact:true});
  S.fill(ctx,c=>c.rect(-40,y0,xe+40,(y1-y0)*0.45),mhk_c("dirt2"),{line:false});
  const xw=Math.min(xe,U.lerp(-40,gate+60,o.water||0));
  if(xw>-30){S.poly(ctx,[[-40,y0+(y1-y0)*0.42,1],[xw,y0+(y1-y0)*0.42,1],[xw+10,y1-2,1],[-40,y1-2,1]],mhk_c("water"),{exact:true,w:0.5});
    S.line(ctx,c=>{for(let x=40;x<xw-40;x+=150){c.moveTo(x,y1-24);c.lineTo(x+50,y1-24);c.moveTo(x+70,y1-12);c.lineTo(x+110,y1-12);}},mhk_c("water2"),0.5);}
  if(f>0){const xr=U.lerp(-40,gate+60,U.clamp(f*1.4,0,1));S.poly(ctx,[[-40,y0+4,1],[xr,y0+4,1],[xr+20,y1,1],[-40,y1,1]],mhk_c("rubble"),{exact:true,w:0.5});
    S.line(ctx,c=>{for(let x=10;x<xr-30;x+=70){c.moveTo(x,y0+30);c.lineTo(x+24,y0+22);c.moveTo(x+36,y1-20);c.lineTo(x+56,y1-28);}},mhk_c("rubble2"),0.5);}
  // the earth dug out, heaped along the near edge, carried off as the work goes on
  const heaps=o.heaps==null?1:o.heaps;if(heaps>0.01){S.begin(ctx,{lw:2.2,sh:3});for(let x=60;x<xe-60;x+=230){const r=46*heaps;S.fill(ctx,c=>{c.moveTo(x-r*1.6,y1+8);c.quadraticCurveTo(x,y1+8-r*1.3,x+r*1.6,y1+8);c.closePath();},mhk_c("dirt"),{});}}
  ctx.restore();}

/* ---------------------------------------------------------------- a boat on the trench's water, with its load of timber.
   x: its middle, y: the waterline; o.load: "timber" or "goods"; o.part: "back" (hull's far side, before whoever stands in it) or "front" */
function mhk_boat(ctx,x,y,o){o=o||{};const S=PK.S,U=PK.u,L=o.len||300;S.begin(ctx,{lw:2.4,sh:2});
  if(o.part!=="front"){S.fill(ctx,c=>{c.moveTo(x-L/2-20,y-34);c.lineTo(x+L/2+20,y-34);c.lineTo(x+L/2,y-14);c.lineTo(x-L/2,y-14);c.closePath();},mhk_c("wood2"),{});
    if(o.load==="timber")for(let i=0;i<3;i++)S.fill(ctx,c=>c.rect(x-L/2+10+i*8,y-62+i*-14,L*0.62,18),mhk_c("log"),{w:0.6});
    else for(const [dx,w] of [[-0.3,70],[-0.05,60],[0.18,64]])S.fill(ctx,c=>c.rect(x+dx*L,y-82,w,50),mhk_c("cloth"),{w:0.6});
    return;}
  S.fill(ctx,c=>{c.moveTo(x-L/2-26,y-40);c.quadraticCurveTo(x-L/2,y+6,x-L/2+40,y+4);c.lineTo(x+L/2-40,y+4);c.quadraticCurveTo(x+L/2,y+6,x+L/2+26,y-40);c.lineTo(x+L/2,y-30);c.lineTo(x-L/2,y-30);c.closePath();},mhk_c("wood"),{});
  S.line(ctx,c=>{c.moveTo(x-L/2+10,y-14);c.lineTo(x+L/2-10,y-14);},mhk_c("wood2"),0.5);}

/* ---------------------------------------------------------------- a handcart: two wheels, a bed and its shafts; whoever pulls walks
   between the shafts, before it. load: "earth", "timber" or "rubble"; dir: 1 to the right, -1 to the left; spin: the wheels' turn */
function mhk_cart(ctx,x,fl,load,dir,spin,hand){const S=PK.S,U=PK.u,s=mhk_h(fl)/250,w=200*s,r=46*s,bx=x-dir*w*0.1,by=fl-r*1.4;S.begin(ctx,{lw:2.4*s+0.4,sh:3*s});
  const wheel=(cx,cy)=>{S.fill(ctx,c=>U.ell(c,cx,cy,r,r),mhk_c("wood2"),{});S.fill(ctx,c=>U.ell(c,cx,cy,r*0.72,r*0.72),mhk_c("wood"),{w:0.5});
    S.line(ctx,c=>{for(let i=0;i<4;i++){const a=spin+i*Math.PI/4;c.moveTo(cx-Math.cos(a)*r*0.72,cy-Math.sin(a)*r*0.72);c.lineTo(cx+Math.cos(a)*r*0.72,cy+Math.sin(a)*r*0.72);}},mhk_c("wood2"),0.5);};
  wheel(bx-dir*w*0.06,fl-r-4*s);
  S.fill(ctx,c=>c.rect(bx-w/2,by-14*s,w,22*s),mhk_c("wood"),{});
  const he=hand||[bx+dir*(w/2+120*s),by-4*s];S.line(ctx,c=>{c.moveTo(bx+dir*w/2,by-2*s);c.lineTo(he[0],he[1]);},mhk_c("wood2"),1.6*s+0.4);
  if(load==="earth")S.fill(ctx,c=>{c.moveTo(bx-w/2+6,by-14*s);c.quadraticCurveTo(bx,by-80*s,bx+w/2-6,by-14*s);c.closePath();},mhk_c("dirt"),{});
  else if(load==="timber")for(let i=0;i<3;i++)S.fill(ctx,c=>c.rect(bx-w*0.62,by-30*s-i*15*s,w*1.24,15*s),mhk_c("log"),{w:0.6});
  else if(load==="rubble")for(const [dx,dy,rw] of [[-0.3,-30,34],[-0.06,-40,40],[0.2,-30,36],[0.05,-58,30],[-0.2,-54,26]])S.fill(ctx,c=>c.rect(bx+dx*w,by+dy*s,rw*s,24*s),U.mix(mhk_c("rubble"),[60,50,48],0.3),{w:0.6});
  wheel(bx+dir*w*0.06,fl-r);}

/* ---------------------------------------------------------------- the people of Kaifeng */
const MHK_FOLK={
  ding:{key:"ding",name:"Ding Wei",role:"",skin:[230,192,158],hair:{style:"bun",c:[40,34,34]},beard:[52,44,42],top:{kind:"jacket",c:[112,60,64],inner:[236,228,210]},bottom:{kind:"long",c:[112,60,64]},shoe:[46,40,40],cap:"wings"},
  clerk:{key:"clerk",name:"",skin:[224,182,146],hair:{style:"bun",c:[36,30,30]},top:{kind:"jacket",c:[86,104,124],inner:[234,228,210]},bottom:{kind:"long",c:[86,104,124]},shoe:[46,40,40],cap:"wings"},
  shen:{key:"shen",name:"Shen Kuo",role:"",skin:[228,188,152],hair:{style:"bun",c:[150,146,140]},beard:[170,166,160],top:{kind:"jacket",c:[86,92,120],inner:[236,228,210]},bottom:{kind:"long",c:[86,92,120]},shoe:[46,40,40],cap:"soft"},
  dig1:{key:"dig1",name:"",skin:[210,164,124],hair:{style:"bun",c:[32,26,26]},top:{kind:"jacket",c:[150,128,98],inner:[226,214,190]},bottom:{kind:"trousers",c:[86,80,76]},shoe:[70,56,48],cap:"cloth"},
  dig2:{key:"dig2",name:"",skin:[200,152,112],hair:{style:"bun",c:[30,24,24]},top:{kind:"jacket",c:[110,120,104],inner:[226,214,190]},bottom:{kind:"trousers",c:[96,86,78]},shoe:[70,56,48],cap:"cloth"},
  dig3:{key:"dig3",name:"",skin:[218,172,132],hair:{style:"bun",c:[40,32,30]},top:{kind:"jacket",c:[132,104,92],inner:[226,214,190]},bottom:{kind:"trousers",c:[80,82,92]},shoe:[70,56,48],cap:"cloth"},
  boat1:{key:"boat1",name:"",skin:[196,148,108],hair:{style:"bun",c:[30,24,24]},top:{kind:"jacket",c:[92,112,128],inner:[226,214,190]},bottom:{kind:"trousers",c:[78,74,72]},shoe:[70,56,48],cap:"cloth"},
  boat2:{key:"boat2",name:"",skin:[214,170,130],hair:{style:"bun",c:[36,28,28]},top:{kind:"jacket",c:[140,120,84],inner:[226,214,190]},bottom:{kind:"trousers",c:[88,80,74]},shoe:[70,56,48],cap:"cloth"},
  cart1:{key:"cart1",name:"",skin:[206,160,120],hair:{style:"bun",c:[34,28,28]},top:{kind:"jacket",c:[120,100,128],inner:[226,214,190]},bottom:{kind:"trousers",c:[84,78,80]},shoe:[70,56,48],cap:"cloth"},
  cart2:{key:"cart2",name:"",skin:[220,176,138],hair:{style:"bun",c:[38,30,30]},top:{kind:"jacket",c:[104,128,116],inner:[226,214,190]},bottom:{kind:"trousers",c:[90,84,78]},shoe:[70,56,48],cap:"cloth"},
  cart3:{key:"cart3",name:"",skin:[204,158,118],hair:{style:"bun",c:[32,26,26]},top:{kind:"jacket",c:[146,110,90],inner:[226,214,190]},bottom:{kind:"trousers",c:[80,78,86]},shoe:[70,56,48],cap:"cloth"},
  pass1:{key:"pass1",name:"",skin:[226,186,150],hair:{style:"bun",c:[36,30,30]},top:{kind:"jacket",c:[168,138,110],inner:[236,228,210]},bottom:{kind:"skirt",c:[110,96,120]},shoe:[70,56,48]},
  pass2:{key:"pass2",name:"",skin:[214,170,132],hair:{style:"bun",c:[40,32,30]},top:{kind:"jacket",c:[96,120,140],inner:[236,228,210]},bottom:{kind:"long",c:[96,120,140]},shoe:[70,56,48],cap:"cloth"},
  pass3:{key:"pass3",name:"",skin:[230,190,156],hair:{style:"bun",c:[34,28,30]},top:{kind:"jacket",c:[150,96,96],inner:[236,228,210]},bottom:{kind:"skirt",c:[86,96,116]},shoe:[70,56,48]}};
const mhk_row=w=>typeof w==="string"?(MHK_FOLK[w]||PK.CAST[w]):w;
// the cap: an official's stiff black cap with its two flat wings to the sides; a scholar's soft cap; a worker's cloth bound round the hair
function mhk_cap(ctx,P,J){if(!P.cap||!J||!J.hc)return;const S=PK.S,U=PK.u,hh=J.p.head*J.u,[x,y]=J.hc,r=hh*0.5,lw=U.clamp(hh*0.03,0.8,3.2);S.begin(ctx,{lw});
  if(P.cap==="wings"){S.fill(ctx,c=>{c.rect(x-r*1.9,y-r*0.98,r*3.8,r*0.13);},[34,32,36],{w:0.6});
    S.fill(ctx,c=>{c.moveTo(x-r*0.62,y-r*0.7);c.lineTo(x-r*0.6,y-r*1.12);c.quadraticCurveTo(x,y-r*1.42,x+r*0.6,y-r*1.12);c.lineTo(x+r*0.62,y-r*0.7);c.closePath();},[34,32,36],{});}
  else if(P.cap==="soft")S.fill(ctx,c=>{c.moveTo(x-r*0.64,y-r*0.72);c.quadraticCurveTo(x-r*0.7,y-r*1.36,x,y-r*1.4);c.quadraticCurveTo(x+r*0.7,y-r*1.36,x+r*0.64,y-r*0.72);c.closePath();},[60,58,66],{});
  else S.fill(ctx,c=>{c.moveTo(x-r*0.7,y-r*0.6);c.quadraticCurveTo(x-r*0.6,y-r*1.26,x,y-r*1.28);c.quadraticCurveTo(x+r*0.6,y-r*1.26,x+r*0.7,y-r*0.6);c.quadraticCurveTo(x,y-r*0.8,x-r*0.7,y-r*0.6);c.closePath();},P.top.inner?U.dk(P.top.inner,0.35):[150,140,120],{});}
const mhk_person=(ctx,who,x,fl,pose,o)=>{const P=mhk_row(who),J=PK.person(ctx,P,x,fl,mhk_h(fl),pose,o);if(!(o&&o.part==="lower"))mhk_cap(ctx,P,J);return J;};
const mhk_walk=(ctx,who,t,w,o)=>{const P=mhk_row(who),J=PK.walk(ctx,P,t,Object.assign({h:mhk_h(w.floor)},w),o);mhk_cap(ctx,P,J);return J;};
// poses of the work: digging (bent over a spade), pulling a cart between its shafts, poling a boat
const MHK_DIG={lean:24,head:14,aN:[30,66,"grip"],aF:[22,58,"grip"],lN:[-6,-4],lF:[10,6]};
const MHK_DIG2={lean:6,head:4,aN:[24,40,"grip"],aF:[16,34,"grip"],lN:[-4,-2],lF:[8,4]};
const MHK_PULL={lean:10,head:2,aN:[-16,12,"grip"],aF:[-12,10,"grip"],lN:[-2,-2],lF:[5,4]};
const MHK_POLE={lean:6,head:2,aN:[40,90,"grip"],aF:[24,60,"grip"],lN:[-2,-2],lF:[5,4]};
const mhk_spade=(c,h)=>{const S=PK.S,[x,y]=h;S.begin(c,{lw:2});S.line(c,cc=>{cc.moveTo(x,y-20);cc.lineTo(x+16,y+90);},PK.S.tone(MHK_PAL.wood2),1.8);
  S.fill(c,cc=>{cc.moveTo(x+8,y+86);cc.lineTo(x+30,y+86);cc.lineTo(x+28,y+120);cc.lineTo(x+12,y+122);cc.closePath();},[140,140,146],{w:0.6});};
const mhk_pole=(c,h)=>{const S=PK.S,[x,y]=h;S.begin(c,{lw:2});S.line(c,cc=>{cc.moveTo(x+30,y-80);cc.lineTo(x-60,y+200);},PK.S.tone(MHK_PAL.wood2),1.6);};
const mhk_scroll=(c,h)=>{const S=PK.S,[x,y]=h;S.begin(c,{lw:2});S.fill(c,cc=>cc.rect(x-10,y-40,22,64),[236,228,206],{w:0.6});S.fill(c,cc=>{cc.rect(x-14,y-44,30,8);cc.rect(x-14,y+22,30,8);},[128,84,62],{w:0.5});};

/* ---------------------------------------------------------------- Shen Kuo's room, some seventy years later: a plain room, a lattice
   window onto a garden, a desk with paper and a brush. He sits at it, seen from the side, writing; nothing written can be read */
const MHK_SE=400,MHK_SF=800;
const mhk_hS=fl=>PK.hAt(fl,MHK_SE);
AG_PLACES.mhkStudy=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(mhk_c("wall"));ctx.fillRect(0,0,1920,MHK_SF);
  // the window: a garden beyond the lattice
  const wx=620,wy=140,ww=680,wh=400;ctx.fillStyle=U.css(mhk_c("sky"));ctx.fillRect(wx,wy,ww,wh);S.begin(ctx,{lw:2,far:0.5});
  S.fill(ctx,c=>c.rect(wx,wy+wh-120,ww,120),[150,184,140],{flat:true});PK.tree(ctx,wx+200,wy+wh-60,0.8,4,{far:1});PK.tree(ctx,wx+520,wy+wh-50,0.7,7,{far:1});
  S.begin(ctx,{lw:3,sh:4});S.line(ctx,c=>{for(let i=1;i<6;i++){c.moveTo(wx+ww*i/6,wy);c.lineTo(wx+ww*i/6,wy+wh);}for(let i=1;i<4;i++){c.moveTo(wx,wy+wh*i/4);c.lineTo(wx+ww,wy+wh*i/4);}},mhk_c("post"),0.8);
  S.line(ctx,c=>c.rect(wx,wy,ww,wh),mhk_c("post"),1.6);
  for(const px of [180,1740])S.fill(ctx,c=>c.rect(px-20,0,40,MHK_SF),mhk_c("post"),{});
  S.fill(ctx,c=>c.rect(-20,40,1960,30),mhk_c("post"),{});
  S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,MHK_SF,1],[1940,MHK_SF,1],[1940,1100,1],[-20,1100,1]],[188,152,112],{exact:true,grad:[0,MHK_SF,0,1080,0.1]});
  S.line(ctx,c=>{for(let y=850;y<1080;y+=60){c.moveTo(-20,y);c.lineTo(1940,y);}},[160,124,90],0.5);};
// a low desk, before whoever kneels at it: x its middle, h their height; o.write (0 to 1): the sheet written on, its lines unreadable
function mhk_desk(ctx,x,fl,h,o){o=o||{};const S=PK.S,k=h/700,top=fl-0.2*h,hw=0.3*h;S.begin(ctx,{lw:2.6*k+0.6,sh:4*k});
  S.fill(ctx,c=>c.rect(x-hw,top,2*hw,22*k),mhk_c("wood2"),{});S.fill(ctx,c=>{c.rect(x-hw+16*k,top+22*k,24*k,fl-top-22*k);c.rect(x+hw-40*k,top+22*k,24*k,fl-top-22*k);},mhk_c("wood2"),{});
  S.begin(ctx,{lw:2*k+0.4,sh:2*k});S.poly(ctx,[[x-hw*0.7,top-3,1],[x+hw*0.3,top-3,1],[x+hw*0.4,top+6,1],[x-hw*0.6,top+6,1]],[244,238,222],{exact:true,w:0.6});
  if(o.write>0)S.line(ctx,c=>{const n=Math.floor(o.write*6);for(let i=0;i<n;i++){const lx=x-hw*0.6+i*hw*0.14;c.moveTo(lx,top-1);c.lineTo(lx+4*k,top+4);}},[60,56,60],0.5);
  S.fill(ctx,c=>c.rect(x+hw*0.55,top-16*k,36*k,14*k),[60,56,60],{w:0.6});return top;}
const MHK_WRITE={mode:"kneel",lean:14,head:12,aN:[44,56,"grip"],aF:[34,50],lN:[80,-94],lF:[76,-94],fN:80,fF:80};
const mhk_brush=(c,h)=>{const S=PK.S,[x,y]=h;S.begin(c,{lw:2});S.line(c,cc=>{cc.moveTo(x-4,y-34);cc.lineTo(x+6,y+14);},[96,70,52],1.4);S.fill(c,cc=>{cc.moveTo(x+4,y+10);cc.lineTo(x+10,y+10);cc.lineTo(x+8,y+24);cc.closePath();},[40,36,40],{w:0.5});};

// someone pulling a handcart between its shafts, from x0 to x1 between t0 and t1 on a floor; the cart behind them. Returns their joints
function mhk_carter(ctx,who,tt,w,load){const h=mhk_h(w.floor),q=PK.walkAt(tt,Object.assign({h},w)),dir=w.x1>w.x0?1:-1,s=h/250,bw=200*s,hand=[q.x-dir*0.07*h,w.floor-0.45*h],
    bx=hand[0]-dir*(bw/2+120*s),cx=bx+dir*bw*0.1;
  mhk_cart(ctx,cx,w.floor,load,dir,(q.x-w.x0)/(46*s)*dir,hand);
  return mhk_walk(ctx,who,tt,Object.assign({arms:{aN:MHK_PULL.aN,aF:MHK_PULL.aF}},w),{hold:null});}
