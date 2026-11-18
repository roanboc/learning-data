/* ===== The rope bridge at Quehue, in ink line: the gorge, the bridge and the communities' people =====
   Drawn once for the films of People first that show the rope bridge of Q'eswachaka, with the people kit (films/people-first/
   shared/), and copied into each film's own source under its prefix. The facts it rests on are the series' bridge notes (the
   Ministry of Culture's study, 2015; UNESCO; the photographs looked at for shapes and colours only, nothing traced).
   The picture: we stand on the left bank of the gorge, upstream of nothing, looking along it. The gorge comes towards us between
   its two walls of dark rock, the river at its foot; the bridge hangs across it some way off, from a stone base on each bank; far
   beyond, at a bend, the steel bridge of 1968. Straw-coloured hills of ichu rise to the high peaks. Everyone stands on one eye
   line (HMQ_E): people on the near bank are large, people on the bridge small, all of one picture. It is a drawing, not a likeness:
   the gorge is shallower than the real one (about 13 m), so the river fits above the captions. */
const HMQ_E=330,HMQ_DECK=368,HMQ_RIV=610;                       // the eye line, and where the bridge's floor meets each base
const hmq_h=fl=>PK.hAt(fl,HMQ_E);
const HMQ_B={x0:612,x1:1308};                      // the stone bases' inner faces: about 30 m apart
// the near banks: where people can stand, floor y from HMQ_DECK+10 down to about 960; the rim of the gorge at floor y
const hmq_rimL=y=>PK.u.lerp(HMQ_B.x0-20,470,PK.u.clamp((y-HMQ_DECK)/(1080-HMQ_DECK),0,1)**0.8);
const hmq_rimR=y=>PK.u.lerp(HMQ_B.x1+20,1460,PK.u.clamp((y-HMQ_DECK)/(1080-HMQ_DECK),0,1)**0.8);
const HMQ_PAL={straw:[220,196,136],straw2:[204,178,118],straw3:[232,212,160],ichu:[186,156,96],rock:[104,98,104],rock2:[124,116,118],rock3:[86,82,90],
  river:[96,138,134],river2:[78,118,118],foam:[236,240,236],snow:[246,248,250],peak:[170,176,198],peak2:[150,156,182],stone:[198,190,176],stone2:[170,162,150],
  rope:[214,186,110],ropeOld:[176,160,118],ropeDk:[150,124,70],steel:[150,156,166],steelDk:[110,116,128]};
const hmq_c=n=>PK.S.tone(HMQ_PAL[n]);
// the grey light of the years the bridge was left: everything duller and cooler
const hmq_g=(c,grey)=>grey?PK.u.mix(c,[150,154,160],0.32):c;

/* ---------------------------------------------------------------- the place, painted once: sky, peaks, hills, gorge, bases */
function hmq_place(ctx,o){o=o||{};const S=PK.S,U=PK.u,g=c=>hmq_g(c,o.grey);
  const sk=ctx.createLinearGradient(0,0,0,HMQ_E+40);sk.addColorStop(0,U.css(o.grey?[160,168,180]:PK.col("skyTop")));sk.addColorStop(1,U.css(o.grey?[214,214,212]:PK.col("skyLow")));
  ctx.fillStyle=sk;ctx.fillRect(0,0,1920,1080);
  S.begin(ctx,{lw:1.5,far:0.8});if(!o.grey){PK.cloud(ctx,380,120,1.0);PK.cloud(ctx,1500,90,0.8);}else{PK.cloud(ctx,300,110,1.3);PK.cloud(ctx,900,70,1.5);PK.cloud(ctx,1560,120,1.4);}
  // the high peaks, far off, with snow
  S.begin(ctx,{lw:1.4,far:0.75});S.poly(ctx,[[560,HMQ_E,1],[760,210,1],[880,150,1],[960,190,1],[1040,130,1],[1180,220,1],[1400,HMQ_E,1]],g(hmq_c("peak")),{exact:true,flat:true});
  S.poly(ctx,[[846,172,1],[880,150,1],[918,170,1],[900,182,1],[880,176,1],[862,186,1]],g(hmq_c("snow")),{exact:true,w:0.5,flat:true});
  S.poly(ctx,[[1008,154,1],[1040,130,1],[1080,158,1],[1056,166,1],[1034,160,1],[1020,170,1]],g(hmq_c("snow")),{exact:true,w:0.5,flat:true});
  // the hills of ichu on both sides, rounded, the far ones paler
  S.begin(ctx,{lw:1.6,far:0.55});S.poly(ctx,[[-40,HMQ_E+20,1],[-40,170],[180,120],[460,160],[700,250],[860,HMQ_E-10],[960,HMQ_E+20,1]],g(hmq_c("straw3")),{exact:true,ten:0.6});
  S.poly(ctx,[[900,HMQ_E+20,1],[1120,HMQ_E-20],[1360,200],[1640,130],[1960,170],[1960,HMQ_E+20,1]],g(hmq_c("straw3")),{exact:true,ten:0.6});
  S.begin(ctx,{lw:1.8,far:0.4});S.poly(ctx,[[-40,HMQ_E+60,1],[-40,280],[260,250],[520,300],[720,HMQ_E+10],[800,HMQ_E+60,1]],g(hmq_c("straw")),{exact:true,ten:0.6});
  S.poly(ctx,[[1120,HMQ_E+60,1],[1260,HMQ_E+4],[1520,270],[1760,250],[1960,280],[1960,HMQ_E+60,1]],g(hmq_c("straw")),{exact:true,ten:0.6});
  // the gorge beyond the bridge, narrowing to a bend: its far walls, and the river coming out of it
  ctx.fillStyle=U.css(g(hmq_c("rock3")));ctx.beginPath();U.pg(ctx,[[560,356],[1360,356],[1260,720],[660,720]]);ctx.fill();
  S.begin(ctx,{lw:1.8,far:0.35});
  S.poly(ctx,[[HMQ_B.x0,HMQ_DECK,1],[880,HMQ_E+14,1],[1040,HMQ_E+14,1],[HMQ_B.x1,HMQ_DECK,1],[1130,HMQ_RIV+12,1],[790,HMQ_RIV+12,1]],g(hmq_c("rock3")),{exact:true});
  S.poly(ctx,[[905,HMQ_E+16,1],[1015,HMQ_E+16,1],[1000,HMQ_E+44,1],[925,HMQ_E+44,1]],g(U.mix(hmq_c("river"),hmq_c("rock3"),0.3)),{exact:true,w:0.5,flat:true});
  S.line(ctx,c=>{for(const [a,b,cc,d] of [[860,360,820,470],[1060,360,1100,470],[900,380,880,520],[1020,380,1040,520]]){c.moveTo(a,b);c.lineTo(cc,d);}},null,0.5);
  // the near banks: straw-coloured ground from the bases to the bottom of the picture
  S.begin(ctx,{lw:2.2,far:0.15});const rim=(f,y0,y1,n)=>{const p=[];for(let i=0;i<=n;i++){const y=U.lerp(y0,y1,i/n);p.push([f(y),y]);}return p;};
  S.poly(ctx,[[-40,HMQ_DECK-4,1],[HMQ_B.x0+30,HMQ_DECK-6,1]].concat(rim(hmq_rimL,HMQ_DECK,1100,8)).concat([[-40,1100,1]]),g(hmq_c("straw2")),{exact:true,ten:0.4,grad:[0,HMQ_DECK,0,1080,0.1]});
  S.poly(ctx,[[1960,HMQ_DECK-4,1],[HMQ_B.x1-30,HMQ_DECK-6,1]].concat(rim(hmq_rimR,HMQ_DECK,1100,8)).concat([[1960,1100,1]]),g(hmq_c("straw2")),{exact:true,ten:0.4,grad:[0,HMQ_DECK,0,1080,0.1]});
  // the gorge's two walls, from the rim down to the water's edge, coming towards us; the river between them
  S.begin(ctx,{lw:2.2,far:0.1});const wl=y=>U.lerp(790,880,(y-HMQ_RIV)/(1100-HMQ_RIV)),wr=y=>U.lerp(1130,1040,(y-HMQ_RIV)/(1100-HMQ_RIV));
  S.poly(ctx,rim(hmq_rimL,HMQ_DECK+2,1100,8).concat([[wl(1100),1100,1],[wl(HMQ_RIV),HMQ_RIV,1]]),g(hmq_c("rock")),{exact:true,ten:0.4});
  S.poly(ctx,rim(hmq_rimR,HMQ_DECK+2,1100,8).concat([[wr(1100),1100,1],[wr(HMQ_RIV),HMQ_RIV,1]]),g(hmq_c("rock2")),{exact:true,ten:0.4});
  S.poly(ctx,[[wl(HMQ_RIV),HMQ_RIV,1],[wr(HMQ_RIV),HMQ_RIV,1],[wr(1100),1100,1],[wl(1100),1100,1]],g(hmq_c("river")),{exact:true,grad:[0,HMQ_RIV,0,1080,0.12]});
  // the rock's faces and the white of the water: lines of detail
  S.line(ctx,c=>{for(const [a,b,cc,d] of [[620,430,600,560],[680,520,640,700],[740,620,700,800],[600,640,560,820],[800,760,760,960],[660,820,620,1000]]){c.moveTo(a,b);c.lineTo(cc,d);}
    for(const [a,b,cc,d] of [[1300,430,1320,560],[1240,520,1280,700],[1180,620,1220,800],[1320,640,1360,820],[1120,760,1160,960],[1260,820,1300,1000]]){c.moveTo(a,b);c.lineTo(cc,d);}},null,0.6);
  ctx.save();ctx.strokeStyle=U.css(g(hmq_c("foam")),0.75);ctx.lineWidth=3;ctx.lineCap="round";const R=U.rnd(5);
  for(let i=0;i<26;i++){const y=HMQ_RIV+20+R()*420,hw=U.lerp(160,90,U.clamp((y-HMQ_RIV)/470,0,1)),x=962+(R()-0.5)*1.6*hw,l=10+R()*26*(y/700);ctx.beginPath();ctx.moveTo(x-l,y);ctx.quadraticCurveTo(x,y-3,x+l,y);ctx.stroke();}ctx.restore();
  // tufts of ichu on the banks, larger nearer us
  const R2=U.rnd(11);for(let i=0;i<120;i++){const y=HMQ_DECK+12+Math.pow(R2(),1.3)*700,left=R2()<0.5,x=left?R2()*(hmq_rimL(y)-30):hmq_rimR(y)+30+R2()*(1920-hmq_rimR(y)-30),k=0.4+(y-HMQ_DECK)/260;
    ctx.strokeStyle=U.css(g(U.mix(hmq_c("ichu"),hmq_c("straw2"),R2()*0.5)));ctx.lineWidth=1.6*k;ctx.lineCap="round";ctx.beginPath();for(let j=0;j<5;j++){const a=-0.7+j*0.35;ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.sin(a)*8*k,y-12*k,x+Math.sin(a)*16*k,y-Math.cos(a)*22*k);}ctx.stroke();}
  // the two stone bases: a platform of old stone, and two short pillars the handrails go round
  for(const [bx,d] of [[HMQ_B.x0,-1],[HMQ_B.x1,1]]){S.begin(ctx,{lw:1.6,far:0.2});
    S.fill(ctx,c=>{c.moveTo(bx,HMQ_DECK+30);c.lineTo(bx+d*70,HMQ_DECK+30);c.lineTo(bx+d*70,HMQ_DECK-6);c.lineTo(bx,HMQ_DECK-6);c.closePath();},g(hmq_c("stone")),{});
    S.line(ctx,c=>{for(let r=0;r<3;r++){const y=HMQ_DECK-6+r*12;c.moveTo(bx,y);c.lineTo(bx+d*70,y);for(let k=0;k<3;k++){const xx=bx+d*(12+k*22+(r%2)*10);c.moveTo(xx,y);c.lineTo(xx,y+12);}}},null,0.4);
    for(const px of [bx+d*14,bx+d*52])S.fill(ctx,c=>U.rrect(c,px-7,HMQ_DECK-40,14,36,2),g(hmq_c("stone2")),{});}}
AG_PLACES.hmGorge=c=>hmq_place(c,{});
AG_PLACES.hmGorgeGrey=c=>hmq_place(c,{grey:true});
AG_ROOMS.hmGorge=AG_ROOMS.hmGorgeGrey="hmGorge";

/* ---------------------------------------------------------------- the rope bridge, drawn every frame
   o.age (0 new and gold, 1 left for years: sagging, grey, its floor gone in places); o.k (0 to 1): how much of it there is (the
   building, cable by cable: below 0.5 the floor cables only); o.walkers: people on it, [[u, who, flip, t]]: u from 0 (left base)
   to 1 (right). Returns hmq_deck(u) for anyone drawn on it. */
const HMQ_SAG=a=>34+70*a;
function hmq_deck(u,o){o=o||{};const U=PK.u,x=U.lerp(HMQ_B.x0+8,HMQ_B.x1-8,u),y=HMQ_DECK+HMQ_SAG(o.age||0)*4*u*(1-u),f=o.fall||0;if(f<=0)return[x,y];
  // fallen: each half hangs from its own base down the wall into the gorge
  const L=u<0.5,v=L?u/0.5:(1-u)/0.5,b=L?HMQ_B.x0+8:HMQ_B.x1-8,hx=b+(L?1:-1)*(40+70*v)*(1-0.5*v),hy=HMQ_DECK+v*230;return[U.lerp(x,hx,f),U.lerp(y,hy,f)];}
function hmq_bridge(ctx,o){o=o||{};const S=PK.S,U=PK.u,age=o.age||0,k=o.k==null?1:o.k,grey=o.grey,col=hmq_g(U.mix(hmq_c("rope"),hmq_c("ropeOld"),age),grey),dkc=U.dk(col,0.25);
  const fall=o.fall||0,along=(y0,sag)=>{ctx.beginPath();for(let i=0;i<=40;i++){const u=i/40,[x,y]=hmq_deck(u,{age,fall});const yy=y+(y0-HMQ_DECK)+(sag-HMQ_SAG(age))*4*u*(1-u)*(1-fall);
    if(fall>0.5&&u>=0.5&&(i-1)/40<0.5){ctx.moveTo(x,yy);continue;}i?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}};
  const sag=HMQ_SAG(age),hr=30-10*age;ctx.save();ctx.lineCap="round";
  // the side cords, from each handrail down to the floor: fewer where it has worn
  if(k>0.6){const n=46,R=U.rnd(3);ctx.strokeStyle=U.css(dkc);ctx.lineWidth=1.3;ctx.beginPath();for(let i=1;i<n;i++){const u=i/n;if(age>0.2&&R()<age*0.55)continue;const [x,y]=hmq_deck(u,{age,fall});if(fall>0.3)continue;ctx.moveTo(x,y-2);ctx.lineTo(x+1,y-hr*U.clamp((k-0.6)/0.4,0,1)+(age*R()*8));}ctx.stroke();}
  // the four floor cables, as one band seen from the side, and the floor laid on them; holes where the rods are gone
  if(k>0){const nf=Math.min(4,Math.ceil(k*8));for(let i=0;i<nf;i++){ctx.strokeStyle=U.css(i===nf-1?dkc:col);ctx.lineWidth=4;along(HMQ_DECK+i*2.2,sag,0);ctx.stroke();}
    ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=1.4;along(HMQ_DECK-2,sag);ctx.stroke();along(HMQ_DECK+8,sag);ctx.stroke();}
  // the two handrails
  if(k>0.5){const q=U.clamp((k-0.5)/0.3,0,1);ctx.strokeStyle=U.css(col);ctx.lineWidth=3.2;ctx.globalAlpha*=q;along(HMQ_DECK-hr,sag-6*age);ctx.stroke();
    ctx.strokeStyle=U.css(PK.S.ink);ctx.lineWidth=1.2;along(HMQ_DECK-hr-1.6,sag-6*age);ctx.stroke();}
  // o.tilt (0 to 1): the far handrail hangs lower than the near one, as a visitor found it five months after a renewal
  if(o.tilt&&k>0.5){ctx.strokeStyle=U.css(dkc);ctx.lineWidth=2.6;along(HMQ_DECK-hr+o.tilt*14,sag-6*age+o.tilt*12);ctx.stroke();}
  ctx.restore();
  for(const [u,who,fl,tt] of o.walkers||[]){const [x,y]=hmq_deck(u,{age});hmq_person(ctx,who,x,y+2,hmq_h(HMQ_DECK+2),"stand",{t:tt||0,flip:fl===true,far:0.3,shade:0});}}

/* ---------------------------------------------------------------- the steel bridge of 1968, far up the gorge, at its bend
   a: how far it is there (0 to 1); truck: where a truck is on it (0 to 1, or null) */
function hmq_steel(ctx,a,truck,grey){if(a<=0.004)return;const S=PK.S,U=PK.u,x0=870,x1=1050,y=HMQ_E+12,col=hmq_g(hmq_c("steel"),grey);ctx.save();ctx.globalAlpha*=a;
  S.begin(ctx,{lw:1.0,far:0.4});S.fill(ctx,c=>U.rrect(c,x0,y,x1-x0,5,1),col,{w:0.8});
  S.line(ctx,c=>{c.moveTo(x0,y);c.lineTo(x0+10,y-12);c.lineTo(x1-10,y-12);c.lineTo(x1,y);for(let i=0;i<=8;i++){const xx=U.lerp(x0+10,x1-10,i/8);c.moveTo(xx,y);c.lineTo(xx+(i%2?-10:10),y-12);}},hmq_g(hmq_c("steelDk"),grey),1.0);
  if(truck!=null){const tx=U.lerp(x0-10,x1+10,truck);S.fill(ctx,c=>{U.rrect(c,tx-10,y-11,14,9,1);U.rrect(c,tx+4,y-8,6,6,1);},hmq_g([176,118,96],grey),{w:0.5});}
  ctx.restore();}

/* ---------------------------------------------------------------- the communities' people, in plain colours
   Men in pale wool jackets and dark trousers, a felt hat, often over a knitted cap; women in a felt hat, a full skirt and a
   cardigan, long braids. One plain colour each: no pattern is invented and none copied. Nobody drawn is a likeness of anyone. */
const HMQ_FOLK={
  keeper:{key:"keeper",name:"",skin:[176,124,92],hair:{style:"short",c:[200,196,190]},top:{kind:"jacket",c:[214,206,188],inner:[150,110,90]},bottom:{kind:"trousers",c:[70,66,70]},shoe:[60,46,40],qhat:"felt",qcap:[150,74,70]},
  m1:{key:"m1",name:"",skin:[170,116,84],hair:{style:"short",c:[34,28,28]},top:{kind:"jacket",c:[222,214,196],inner:[90,96,120]},bottom:{kind:"trousers",c:[60,60,72]},shoe:[54,42,38],qhat:"felt",qcap:[96,104,140]},
  m2:{key:"m2",name:"",skin:[160,108,78],hair:{style:"short",c:[30,26,28]},top:{kind:"sweater",c:[148,112,96]},bottom:{kind:"trousers",c:[66,62,66]},shoe:[54,42,38],qhat:"cap",qcap:[178,90,80]},
  m3:{key:"m3",name:"",skin:[180,128,94],hair:{style:"short",c:[40,32,30]},top:{kind:"jacket",c:[196,186,164],inner:[120,80,70]},bottom:{kind:"trousers",c:[80,74,72]},shoe:[54,42,38],qhat:"felt"},
  w1:{key:"w1",name:"",skin:[174,120,88],hair:{style:"long",c:[28,24,26]},top:{kind:"sweater",c:[120,86,104]},bottom:{kind:"skirt",c:[64,72,104]},shoe:[54,42,38],qhat:"felt",braid:true},
  w2:{key:"w2",name:"",skin:[166,112,82],hair:{style:"long",c:[30,24,26]},top:{kind:"sweater",c:[96,120,112]},bottom:{kind:"skirt",c:[132,70,76]},shoe:[54,42,38],qhat:"felt",braid:true},
  w3:{key:"w3",name:"",skin:[180,126,96],hair:{style:"long",c:[44,34,32]},top:{kind:"sweater",c:[170,134,90]},bottom:{kind:"skirt",c:[78,64,86]},shoe:[54,42,38],qhat:"felt",braid:true},
  m4:{key:"m4",name:"",skin:[164,112,80],hair:{style:"short",c:[36,30,28]},top:{kind:"jacket",c:[120,92,76],inner:[210,200,180]},bottom:{kind:"trousers",c:[58,58,66]},shoe:[54,42,38],qhat:"cap",qcap:[92,120,104]},
  m5:{key:"m5",name:"",skin:[176,120,86],hair:{style:"short",c:[30,26,26]},top:{kind:"sweater",c:[178,150,104]},bottom:{kind:"trousers",c:[72,66,64]},shoe:[54,42,38],qhat:"felt"},
  w4:{key:"w4",name:"",skin:[170,116,86],hair:{style:"long",c:[26,22,24]},top:{kind:"sweater",c:[150,70,74]},bottom:{kind:"skirt",c:[52,64,90]},shoe:[54,42,38],qhat:"felt",braid:true},
  w5:{key:"w5",name:"",skin:[178,124,92],hair:{style:"long",c:[36,28,28]},top:{kind:"sweater",c:[84,104,136]},bottom:{kind:"skirt",c:[120,84,60]},shoe:[54,42,38],qhat:"felt",braid:true},
  // two visitors of 1972, and a geographer of 1970: clothes of their time, no hat
  v1:{key:"v1",name:"",skin:[236,204,180],hair:{style:"short",c:[140,104,70]},beard:[150,112,80],top:{kind:"jacket",c:[150,120,84],inner:[224,214,196]},bottom:{kind:"trousers",c:[92,98,120]},shoe:[90,70,56]},
  v2:{key:"v2",name:"",skin:[240,210,186],hair:{style:"long",c:[180,140,90]},top:{kind:"sweater",c:[116,134,120]},bottom:{kind:"trousers",c:[110,96,84]},shoe:[90,70,56]},
  geo:{key:"geo",name:"",skin:[232,198,170],hair:{style:"short",c:[96,80,70]},glasses:[60,50,50],top:{kind:"jacket",c:[128,132,110],inner:[230,226,214]},bottom:{kind:"trousers",c:[104,96,84]},shoe:[80,62,50]}
};
// a felt hat, or a knitted cap, over the head's picture: drawn after the person, from the joints PK.person gives back (J.hc, the
// head's size J.p.head*J.u), and it nods with them. A braid, for a woman, falls behind the near shoulder
function hmq_hat(ctx,P,J){if(!P.qhat||!J||!J.hc)return;const S=PK.S,U=PK.u,hh=J.p.head*J.u,[x,y]=J.hc,r=hh*0.5,lw={lw:U.clamp(hh*0.03,0.8,3.4)};S.begin(ctx,lw);
  if(P.qcap&&P.qhat==="cap"||P.qhat==="cap")S.fill(ctx,c=>{c.moveTo(x-r*1.02,y-r*0.12);c.bezierCurveTo(x-r*1.0,y-r*1.25,x+r*1.0,y-r*1.25,x+r*1.02,y-r*0.12);c.lineTo(x+r*0.96,y+r*0.2);c.lineTo(x-r*0.96,y+r*0.2);c.closePath();},P.qcap||[178,90,80],{});
  if(P.qhat==="felt"){const hc=S.tone([96,80,70]),top=y-r*0.62;
    S.fill(ctx,c=>U.ell(c,x,top+r*0.02,r*1.42,r*0.26),U.dk(hc,0.06),{});
    S.fill(ctx,c=>{c.moveTo(x-r*0.8,top);c.bezierCurveTo(x-r*0.82,top-r*0.7,x+r*0.82,top-r*0.7,x+r*0.8,top);c.closePath();},hc,{});
    S.line(ctx,c=>{c.moveTo(x-r*0.78,top-r*0.12);c.quadraticCurveTo(x,top-r*0.04,x+r*0.78,top-r*0.12);},[150,74,70],1.4);}}
const hmq_row=w=>typeof w==="string"?(HMQ_FOLK[w]||PK.CAST[w]):w;
const hmq_person=(ctx,who,x,fl,h,pose,o)=>{const P=hmq_row(who),J=PK.person(ctx,P,x,fl,h,pose,o);if(!(o&&o.part==="lower"))hmq_hat(ctx,P,J);return J;};
const hmq_walk=(ctx,who,t,w,o)=>{const P=hmq_row(who),J=PK.walk(ctx,P,t,w,o);hmq_hat(ctx,P,J);return J;};
// a coil of cord, for a hand to hold, and cord twisted between two hands
const hmq_coil=(c,h)=>{const S=PK.S,U=PK.u,[x,y]=h;S.begin(c,{lw:2});S.fill(c,cc=>U.ell(cc,x+4,y+22,26,16),hmq_c("rope"),{});S.fill(c,cc=>U.ell(cc,x+4,y+22,13,7),hmq_c("ropeDk"),{w:0.6});};
// rain over the gorge (a: 0 to 1): short slanted strokes, in the place's grey, falling; wind leans them further
function hmq_rain(ctx,tt,a,wind){if(a<=0.004)return;const U=PK.u,R=U.rnd(11),lean=6+(wind||0)*16;ctx.save();ctx.globalAlpha*=0.55*a;ctx.strokeStyle=U.css([120,130,146]);ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<220;i++){const x0=R()*2100-90,sp=520+R()*200,y=((R()*1200+tt*sp)%1200)-60,x=x0+((tt*sp)%1200)*lean/40*0;ctx.moveTo(x,y);ctx.lineTo(x-lean,y+26);}ctx.stroke();ctx.restore();}

