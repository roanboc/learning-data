/* ===== Ideas that last, features you test: the film's own world, Mexico, 1944 to 1956 =====
   The film draws with the module's look (films/data-that-moves/shared/README.md); these are its own pictures, each name starting
   with il_ or IL_. The opening is lit by a low sun over the fields, on the module's navy: a wheat field in Sonora's Yaqui Valley
   (ilField), painted once with its sky, its mountains and its rows, and its wheat drawn live (il_field: each stalk a tapering curve,
   its ear of grain, swaying, the rust spreading on it, a ruined stalk bowing over); and a map of Mexico (ilMexico), with the two
   places the breeders worked: the highlands near Mexico City in summer and Sonora in winter (il_site, il_shuttle).
     the map         the land from Natural Earth's 1:110m land (public domain, naturalearthdata.com; NOTICE.md), simplified to about a
                     third of a degree and kept here in tenths of a degree, as Files as data and as context keeps it; il_xy projects
                     it, plate carrée, 50 px a degree, centred on 102° W, 23.5° N. The sites are where the program worked: Ciudad
                     Obregón in the Yaqui Valley, and Toluca, in the highlands west of Mexico City
     the people      a plant breeder (Norman Borlaug) and a young agronomist, one of the hundreds of Mexican graduates the program
                     trained, in the work shirts of a 1940s field station (IL_P)
   Every word is at least 28 px as seen, or marked as decoration; none but the captions below y 890. */

const IL={wheat:[218,190,124],wheatHi:[246,226,170],wheatDk:[140,112,62],stem:[150,148,92],rust:[200,104,52],rustDk:[118,58,34],
  soil:[34,26,22],soilHi:[70,52,40],sun:[255,190,120],sky0:[10,18,40],sky1:[64,52,74],hill:[22,26,44],land:[24,33,50],landHi:[38,50,72],coast:[128,164,214]};
const il_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const il_k=(tt,t0)=>clamp(tt-t0,0,1);
// screen space inside a shot: what's drawn here stays put while the camera moves
function il_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);try{fn();}finally{ctx.restore();}}

/* ---------------------------------------------------------------- the field */
// the sky at dusk, the Sierra Madre far off, and the valley's ploughed ground in rows going away: painted once
function il_paintField(c){let g=c.createLinearGradient(0,0,0,600);g.addColorStop(0,"#07102a");g.addColorStop(0.55,"#1a2142");g.addColorStop(0.86,"#4a3a4e");g.addColorStop(1,"#6a4a44");c.fillStyle=g;c.fillRect(0,0,1920,600);
  // the low sun's glow on the horizon, to the right
  let q=c.createRadialGradient(1500,560,10,1500,560,900);q.addColorStop(0,"rgba(255,186,120,0.42)");q.addColorStop(0.25,"rgba(240,150,100,0.14)");q.addColorStop(1,"rgba(200,120,90,0)");c.fillStyle=q;c.fillRect(0,0,1920,640);
  // a few stars high up
  const r=ag_rnd(1944);c.fillStyle="rgba(220,230,255,0.5)";for(let i=0;i<60;i++){const x=r()*1920,y=r()*260,s=r()*1.6+0.4;c.globalAlpha=0.25+0.5*r();c.beginPath();c.arc(x,y,s,0,TAU);c.fill();}c.globalAlpha=1;
  // two ranges of mountains, the far one paler
  for(const [y0,amp,col,seed] of [[500,90,[52,48,74],7],[548,60,[26,28,48],11]]){const rr_=ag_rnd(seed);c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,620);
    let y=y0;for(let x=0;x<=1940;x+=40){y=clamp(y+(rr_()-0.5)*amp*0.6,y0-amp,y0+amp*0.25);c.lineTo(x,y);}c.lineTo(1920,620);c.closePath();c.fill();}
  // the ground: dark soil, warmer towards the sun, in rows that run away to the horizon
  g=c.createLinearGradient(0,580,0,1080);g.addColorStop(0,"#2a2026");g.addColorStop(0.3,"#1c1614");g.addColorStop(1,"#0b0807");c.fillStyle=g;c.fillRect(0,580,1920,500);
  q=c.createRadialGradient(1500,590,10,1500,620,1100);q.addColorStop(0,"rgba(255,170,110,0.22)");q.addColorStop(1,"rgba(255,170,110,0)");c.fillStyle=q;c.fillRect(0,580,1920,500);
  c.strokeStyle="rgba(150,110,80,0.10)";c.lineWidth=2;for(let k=-30;k<=30;k++){c.beginPath();c.moveTo(960+k*16,590);c.lineTo(960+k*130,1080);c.stroke();}
  // a far line of the field's wheat on the horizon, lit at its top
  c.fillStyle="rgba(150,120,70,0.35)";for(let x=0;x<1920;x+=5){const h=6+r()*6;c.fillRect(x,592-h,3,h);}
  const v=c.createRadialGradient(1100,600,300,1100,560,1250);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.55)");c.fillStyle=v;c.fillRect(0,0,1920,1080);}
AG_PLACES.ilField=c=>il_paintField(c);

// the field's stalks, made once: three bands, each further back smaller and dimmer, each stalk a little bent its own way
let IL_STALKS=null;
function il_stalks(){if(IL_STALKS)return IL_STALKS;const r=ag_rnd(1945),out=[];
  for(const [y0,y1,n,s] of [[598,640,150,0.26],[648,760,120,0.5],[780,1010,64,0.92]])for(let i=0;i<n;i++){const x=-40+(i+r()*0.9)/n*2000,y=lerp(y0,y1,r());
    out.push({x,y,s:s*(0.8+0.4*r()),ph:r()*TAU,lean:(r()-0.5)*0.14,bend:(r()-0.5)*0.16,leaf:r()<0.7?(r()<0.5?-1:1):0,d:r()});}
  out.sort((a,b)=>a.y-b.y);IL_STALKS=out;return out;}
// one stalk of wheat at (x, y), its foot, of height h: a stem that tapers as it rises, bent a little (o.bend), a leaf, and its ear of grain
// nodding at the top, swaying (sway, in radians), its colour going from straw and grain to rust (rust 0 to 1, specks of it spreading
// up the stem); a ruined stalk (bow 0 to 1) bends at the top, its ear hanging, thin and brown
function il_stalk(c,x,y,h,o){o=o||{};const sway=o.sway||0,rust=o.rust||0,bow=o.bow||0,a=o.a==null?1:o.a,lit=o.lit==null?1:o.lit,bend=o.bend||0;if(a<=0.004)return;
  const ang=sway+bow*0.3,tip=[x+Math.sin(ang)*h,y-Math.cos(ang)*h*(1-0.08*bow)],mid=[x+Math.sin(ang*0.4)*h*0.5+bend*h,y-h*0.5];
  const stem=mix(mix(IL.stem,IL.rustDk,rust*0.8),[46,36,28],bow*0.5),grain=mix(mix(IL.wheat,IL.rust,rust),[96,60,38],bow*0.75);
  c.save();c.globalAlpha*=a;c.lineCap="round";
  const pts=[];for(let i=0;i<=8;i++){const u=i/8;pts.push([lerp(lerp(x,mid[0],u),lerp(mid[0],tip[0],u),u),lerp(lerp(y,mid[1],u),lerp(mid[1],tip[1],u),u)]);}
  for(let i=0;i<8;i++){c.strokeStyle=rgba(mix(stem,IL.wheatHi,0.25*lit*(i/8)),1);c.lineWidth=Math.max(0.7,(2.6-1.8*i/8)*h/220);c.beginPath();c.moveTo(pts[i][0],pts[i][1]);c.lineTo(pts[i+1][0],pts[i+1][1]);c.stroke();}
  // a long leaf from low on the stem, arching out and down to a point
  if(o.leaf){const b=pts[2],L=h*0.36,dir=o.leaf;c.fillStyle=rgba(mix(stem,[34,40,30],0.25),1);c.beginPath();c.moveTo(b[0],b[1]);
    c.quadraticCurveTo(b[0]+dir*L*0.55,b[1]-L*0.42,b[0]+dir*L,b[1]-L*0.08+bow*L*0.3);c.quadraticCurveTo(b[0]+dir*L*0.5,b[1]-L*0.28,b[0],b[1]+h*0.02);c.fill();}
  // the ear: small grains in pairs up its length, each an almond set at an angle, lit on the sun's side; it nods, and hangs when ruined
  const ea=ang+0.12*Math.sign(ang||1)+bow*2.3,ex=Math.sin(ea),ey=-Math.cos(ea),n=10,eL=h*0.2*(1-0.25*bow),gw=Math.max(1.2,h*0.012),gl=Math.max(2.4,h*0.03);
  for(let i=0;i<n;i++){const u=i/(n-1),cx_=tip[0]+ex*eL*u,cy_=tip[1]+ey*eL*u,sz=(1-0.4*u)*(1-0.3*bow);
    for(const sd of [-1,1]){c.save();c.translate(cx_+(-ey)*sd*gw*0.8,cy_+ex*sd*gw*0.8);c.rotate(ea+sd*0.45);
      c.fillStyle=rgba(mix(grain,IL.wheatHi,sd>0?0.4*lit:0.05),1);c.beginPath();c.ellipse(0,0,gw*sz,gl*sz,0,0,TAU);c.fill();c.restore();}}
  // the awns: fine bristles from the ear, longer at its top
  c.strokeStyle=rgba(mix(grain,IL.wheatHi,0.35),0.5*(1-0.6*bow));c.lineWidth=Math.max(0.5,h/420);for(let i=0;i<n;i+=1){const u=i/(n-1),cx_=tip[0]+ex*eL*u,cy_=tip[1]+ey*eL*u,sd=i%2?1:-1,L=h*(0.07+0.07*u);
    c.beginPath();c.moveTo(cx_,cy_);c.lineTo(cx_+ex*L+(-ey)*sd*L*0.35,cy_+ey*L+ex*sd*L*0.35);c.stroke();}
  // rust: specks along the stem and leaf, more of them as it spreads
  if(rust>0.02){const r=ag_rnd(Math.floor(x*7+y));c.fillStyle=rgba(IL.rust,0.9);const m=Math.floor(3+16*rust);for(let i=0;i<m;i++){const p=pts[1+Math.floor(r()*6)];
    c.beginPath();c.ellipse(p[0]+(r()-0.5)*5*h/220,p[1]+(r()-0.5)*8,1+1.4*r()*h/220,2+1.6*r()*h/220,0.3,0,TAU);c.fill();}}
  c.restore();}
// the field: o.t, o.rust(stalk) (0 to 1 for each stalk, from its place), o.bow(stalk), o.wind (how strongly it sways), o.a, o.band (only stalks
// whose foot is past y band), o.health (how lit the grain is: 1 as at dusk, more for a harvest)
function il_field(c,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.wind==null?1:o.wind;
  for(const s of il_stalks()){if(o.band&&s.y<o.band)continue;if(o.upTo&&s.y>=o.upTo)continue;const h=250*s.s,sway=s.lean+w*0.05*Math.sin(t*1.3+s.ph+s.x*0.004),rust=o.rust?o.rust(s):0,bow=o.bow?o.bow(s):0;
    const dim=lerp(0.4,1,(s.s-0.2)/0.9);il_stalk(c,s.x,s.y,h,{sway,rust,bow,bend:s.bend,leaf:s.leaf,a:a*dim,lit:dim*(o.health==null?1:o.health)});}}
// how far the rust has come: a front that spreads from (x0, y0) at speed v px a second from t0; a stalk behind it rusts, and later bows
function il_rustAt(s,t,t0,x0,y0,v){if(t<t0||s.d<0.12)return 0;const d=Math.hypot(s.x-x0,(s.y-y0)*3);return clamp(((t-t0)*v-d)/260,0,1);}

/* ---------------------------------------------------------------- the map of Mexico */
// Natural Earth's 1:110m land around Mexico (public domain), as Files as data and as context keeps it: each ring's first point, then
// each step from the one before, longitude then latitude, in tenths of a degree
const IL_LAND=[[-797,228,14,-3,26,-18,15,-4,-36,-4,7,5,-22,12,-25,6,-4,2,4,2,-32,-7,27,13,26,-4],[-905,695,-1,-10,14,8,12,-7,-3,-7,9,-7,18,16,1,11,29,-2,13,-5,1,-5,-8,-6,7,-5,-1,-5,-19,-7,-25,2,-15,-18,-12,-7,-14,-1,-8,-4,-1,-6,-11,-2,-13,-8,-10,-11,-5,-20,15,-1,9,-17,14,2,59,-20,27,-2,2,-18,7,-11,15,-10,8,3,5,11,-5,15,-7,6,16,4,17,14,-8,16,-12,7,12,11,-8,24,43,1,24,-13,18,0,3,-21,17,-8,14,6,16,15,32,-33,-4,-7,45,-17,4,-8,11,-5,1,-12,-43,-19,-64,0,-47,-34,24,15,36,9,9,-5,-9,-6,6,-19,13,-5,17,2,10,11,1,-7,6,-4,-56,-24,-7,1,-1,9,18,8,-27,-2,1,-3,-31,-11,-6,-7,-1,-7,8,-7,-37,-7,18,0,-21,-1,-9,-19,-6,6,4,-11,-8,-12,2,7,-6,13,0,-11,-7,1,7,-3,6,-23,-34,-21,-22,-21,0,-14,12,-31,-3,-17,-8,0,-5,7,-12,20,0,12,-12,10,-10,-5,-13,8,-28,-1,-4,-1,4,-9,-10,-2,-14,6,-22,0,-28,-14,-8,-9,3,-15,-8,-35,16,-31,19,-12,24,6,12,6,5,17,32,5,3,-7,-10,-25,-5,2,-1,-20,-5,-6,39,1,16,-7,2,-10,-6,-32,16,-21,8,-2,18,8,28,-10,11,8,2,12,6,5,15,1,16,12,7,-3,-8,-7,2,-23,7,8,-4,11,12,4,3,8,17,-16,20,0,13,-5,6,5,24,1,-8,-3,3,-5,16,-5,1,-8,16,-6,6,-12,14,-8,31,-2,27,-16,8,-23,5,-2,1,-7,-8,-8,3,-3,18,-1,0,-10,8,6,29,-10,5,-5,-2,-6,12,3,34,-5,28,-19,16,-3,9,-22,-4,-17,-36,-41,-6,-48,-16,-40,-11,-11,-26,-4,-30,-15,-9,-10,-4,-28,-49,-57,-11,-6,-13,1,-22,10,-1,-5,13,-9,-2,-7,7,-4,-1,-5,-9,-13,-15,-5,-31,-1,2,-19,-6,-3,-24,-1,1,-10,7,-3,5,4,3,-6,-17,-9,-4,-15,-17,-6,-3,-7,20,-9,-4,-9,-12,-6,-6,-12,-13,-8,9,-16,-13,0,-13,-6,-2,-9,-4,-1,-35,16,-4,7,3,6,-5,6,-1,17,4,10,11,8,-15,3,9,8,3,17,12,-4,5,21,-7,3,-3,-13,-6,2,11,39,-4,21,4,1,18,47,-1,35,6,13,7,78,-2,15,-11,9,-45,28,-38,74,-14,11,3,4,-5,10,16,20,-2,5,-4,-5,-6,5,1,11,8,19,12,6,5,12,13,12,-4,3,0,26,-7,8,0,8,-14,6,-9,-8,5,-6,-9,-3,-2,6,-24,6,-1,7,-14,10,-1,-5,-6,3,0,12,-20,18,2,4,-37,6,-35,23,-19,-5,-69,26,-20,16,-2,5,4,10,-7,14,-33,28,0,8,-29,26,-9,22,-8,4,-9,2,1,-16,31,-35,9,-24,13,-9,-6,-6,-22,19,-1,13,-28,17,5,0,4,9,-13,10,-18,34,-12,10,-21,6,-38,57,-1,25,6,27,-8,27,16,-2,5,-9,-2,19,-46,18,-6,9,1,6,-12,5,-2,8,-27,19,-2,9,-13,8,-6,9,-25,1,-33,13,-72,14,-11,-2,2,-7,-37,-8,3,15,11,3,-3,3,-34,-19,7,-5,-9,-8,-21,-7,-21,-14,-64,-16,71,32,7,13,-21,-5,-13,7,-16,-4,1,9,-6,4,-13,-2,-15,7,-1,6,-7,4,15,16,15,0,23,7,-7,6,7,4,-42,-4,-14,3,-17,10,36,9,8,0,-1,-5,21,0,-51,23,6,5,30,5,13,9,53,11,23,-7,107,-5,71,-13,21,7,15,-1,31,7,7,-4,10,7,23,-10,14,7,1,-8,28,4,63,-9,13,-5,-14,-5,54,1,10,-6,11,5,-10,4,6,4,20,1,19,-8,28,-4,31,2,-2,6,9,2,16,-4,0,-9,6,8,8,0,5,10,-23,10,1,11,12,7,23,-6,14,-11,-9,-5,19,-2]];
const IL_BORDER=[[-117.1,32.53],[-114.72,32.72],[-111.07,31.33],[-108.21,31.33],[-108.21,31.78],[-106.5,31.76],[-105.0,30.68],[-104.4,29.57],[-103.3,28.98],[-102.4,29.77],[-101.4,29.77],[-100.3,28.3],[-99.5,27.5],[-99.1,26.4],[-97.15,25.95]];
const IL_PRJ={lon0:-102,lat0:23.5,k:50};
const il_xy=(lon,lat)=>[960+(lon-IL_PRJ.lon0)*IL_PRJ.k,540-(lat-IL_PRJ.lat0)*IL_PRJ.k];
// the two places the program bred its wheat, and Mexico City
const IL_SITE={sonora:[-109.94,27.49],toluca:[-99.66,19.29],cdmx:[-99.13,19.43]};
function il_paintMexico(c){let g=c.createLinearGradient(0,0,0,1080);g.addColorStop(0,"#0a1430");g.addColorStop(0.55,"#071026");g.addColorStop(1,"#040812");c.fillStyle=g;c.fillRect(0,0,1920,1080);
  for(const [x,y,r,a] of [[900,500,900,0.06],[1500,800,600,0.04]]){const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(MD.flow,a));q.addColorStop(1,rgba(MD.flow,0));c.fillStyle=q;c.fillRect(0,0,1920,1080);}
  // lines of latitude and longitude every five degrees
  c.strokeStyle=rgba(MD.flow,0.06);c.lineWidth=1.2;c.beginPath();for(let lo=-125;lo<=-80;lo+=5){const p=il_xy(lo,40),q=il_xy(lo,5);c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);}
  for(let la=10;la<=35;la+=5){const p=il_xy(-130,la),q=il_xy(-75,la);c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);}c.stroke();
  // the land, its coast lit faintly
  c.beginPath();for(const r of IL_LAND){let lo=0,la=0;for(let i=0;i<r.length;i+=2){lo+=r[i];la+=r[i+1];const p=il_xy(lo/10,la/10);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.closePath();}
  g=c.createLinearGradient(0,0,0,1080);g.addColorStop(0,rgba(IL.landHi,1));g.addColorStop(1,rgba(IL.land,1));c.fillStyle=g;c.fill();c.lineJoin="round";
  c.strokeStyle=rgba(IL.coast,0.16);c.lineWidth=6;c.stroke();c.strokeStyle=rgba(IL.coast,0.6);c.lineWidth=1.6;c.stroke();
  // the border with the United States, drawn faintly (illustrative: from the Pacific to the Gulf, along the Rio Grande)
  c.save();c.setLineDash([10,8]);c.strokeStyle="rgba(170,200,245,0.35)";c.lineWidth=2;c.beginPath();
  IL_BORDER.forEach((q,i)=>{const p=il_xy(q[0],q[1]);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);});c.stroke();c.restore();
  const v=c.createRadialGradient(960,540,400,960,540,1250);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,1920,1080);}
AG_PLACES.ilMexico=c=>il_paintMexico(c);
// a site on the map: a ring of light, its name and a line under it, at the size they read through the camera (o.cam)
function il_site(c,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const z=o.cam&&o.cam.z||1,p=il_xy(IL_SITE[k][0],IL_SITE[k][1]),col=o.col||MD.agreed,lit=o.lit||0;
  c.save();c.globalAlpha*=a;glow(c,p[0],p[1],(40+40*lit)/z,col,0.35+0.4*lit);c.fillStyle=rgba(col,1);c.beginPath();c.arc(p[0],p[1],7/z,0,TAU);c.fill();
  c.strokeStyle=rgba(col,0.8);c.lineWidth=2.4/z;c.beginPath();c.arc(p[0],p[1],(16+6*lit)/z,0,TAU);c.stroke();
  if(o.name){const al=o.align||"left",dx=(al==="left"?28:-28)/z;md_T(c,o.name,p[0]+dx,p[1]-8/z+(o.dy||0)/z,{w:700,size:30/z,align:al});
    if(o.sub)md_T(c,o.sub,p[0]+dx,p[1]+30/z+(o.dy||0)/z,{w:500,size:28/z,align:al,col:MD.soft});}
  c.restore();}
// the arc between the two sites, bowed out to sea, and the seed's place along it (u 0 at Toluca, 1 in Sonora)
function il_arc(){const A=il_xy(...IL_SITE.toluca),B=il_xy(...IL_SITE.sonora);return md_curve(A,B,{bend:0.38});}
// a packet of seed, a small paper envelope with a wheat ear on it, at (x, y), size s
function il_packet(c,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(o.rot||0);const w=s,h=s*1.25;
  c.fillStyle=rgba(mix([214,198,160],[255,255,255],0.1),1);c.shadowColor="rgba(0,0,0,0.45)";c.shadowBlur=s*0.25;rr(c,-w/2,-h/2,w,h,s*0.06);c.fill();c.shadowColor="transparent";
  c.fillStyle="rgba(150,126,86,0.9)";c.beginPath();c.moveTo(-w/2,-h/2);c.lineTo(0,-h/2+h*0.28);c.lineTo(w/2,-h/2);c.closePath();c.fill();
  c.strokeStyle=rgba(IL.wheatDk,1);c.lineWidth=s*0.05;c.lineCap="round";c.beginPath();c.moveTo(0,h*0.36);c.lineTo(0,-h*0.02);c.stroke();
  c.fillStyle=rgba(IL.wheatDk,1);for(let i=0;i<4;i++)for(const sd of[-1,1]){c.beginPath();c.ellipse(sd*s*0.07,h*0.02-i*s*0.1,s*0.05,s*0.085,sd*0.4,0,TAU);c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- the people of the program */
const IL_P={
  breeder:{name:"Norman Borlaug",role:"Plant breeder",skin:[226,184,152],hair:{style:"side",c:[110,84,58]},top:{kind:"overshirt",c:[150,138,104],inner:[226,220,200]},breath:0.27},
  agronomist:{name:"A young agronomist",role:"One of hundreds the program trained",skin:[190,142,106],hair:{style:"side",c:[26,22,22]},top:{kind:"overshirt",c:[212,204,184],inner:[236,232,220]},breath:0.29}};
// a person of the program, arms down: the field is what the story is about, and it is all round them
function il_period(ctx,who,x,y,s,o){return md_person(ctx,IL_P[who],x,y,s,o||{});}
