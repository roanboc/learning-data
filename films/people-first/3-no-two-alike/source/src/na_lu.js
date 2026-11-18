/* ===== No two alike: Lu, about 2,500 years ago, in ink line =====
   A plain hall as the texts leave it: earth walls, timber posts, a beam, a packed-earth floor and woven mats, a doorway onto a small
   court with a tree, and rolls of bamboo slips on a low stand that show no writing. No chairs, no paper, no bound books, and no
   characters drawn. The people of Lu are nobody's likeness, dressed from the texts: hair bound up under a small cap held by a cord,
   robes closing to the right over a pale under-robe, in plain everyday colours; they kneel on their mats, sitting back on their
   heels, seen from the side as the kit draws a body that folds. Every name this file declares starts with na_ or NA_. */
const NA_LU={eye:430,wall:560};
const na_hLu=fl=>PK.hAt(fl,NA_LU.eye);
const NA_LUPAL={wall:[222,196,156],wall2:[206,178,138],beam:[120,86,62],post:[134,96,68],floor:[200,172,132],floor2:[186,158,118],
  mat:[214,192,140],mat2:[190,166,116],sky:[200,222,234],court:[226,206,166],slip:[210,190,130],slip2:[176,150,96]};
const na_lc=k=>PK.S.tone(NA_LUPAL[k]);
// a mat on the floor, seen in perspective: centre x, the floor line it lies on, its width
function na_mat(c,x,fl,w){const S=PK.S,d=w*0.16*(fl-NA_LU.eye)/500;S.begin(c,{lw:2.2,sh:3});
  S.poly(c,[[x-w*0.5+d,fl-d*1.2,1],[x+w*0.5-d,fl-d*1.2,1],[x+w*0.5+d,fl+d*0.9,1],[x-w*0.5-d,fl+d*0.9,1]],na_lc("mat"),{exact:true});
  S.line(c,cc=>{for(let i=1;i<6;i++){const u=i/6;cc.moveTo(x-w*0.5+d+u*(w-2*d),fl-d*1.2);cc.lineTo(x-w*0.5-d+u*(w+2*d),fl+d*0.9);}},na_lc("mat2"),0.5);}
// where each one kneels: [x, floor, mat width]
const NA_SEAT={kong:[1380,850,300],zilu:[560,930,300],ranyou:[860,800,250],gongxi:[330,760,240],lu5:[1110,730,220]};
AG_PLACES.naLu=ctx=>{const S=PK.S,U=PK.u,W=NA_LU.wall;
  ctx.fillStyle=U.css(na_lc("wall"));ctx.fillRect(0,0,1920,W);
  // the doorway onto the court: sky, a far wall, a tree
  const dx0=760,dx1=1160,dy0=170;ctx.save();ctx.beginPath();ctx.rect(dx0,dy0,dx1-dx0,W-dy0);ctx.clip();
  ctx.fillStyle=U.css(na_lc("sky"));ctx.fillRect(dx0,dy0,dx1-dx0,W-dy0);S.begin(ctx,{lw:2,far:0.6,sh:3});
  S.fill(ctx,c=>c.rect(dx0-20,400,dx1-dx0+40,80),U.mix(na_lc("wall2"),na_lc("sky"),0.3),{});
  S.fill(ctx,c=>c.rect(dx0-20,470,dx1-dx0+40,120),na_lc("court"),{flat:true});
  S.begin(ctx,{lw:2.2,far:0.4,sh:3});PK.tree(ctx,1040,486,0.9,5,{far:1});ctx.restore();
  S.begin(ctx,{lw:3,sh:4});S.line(ctx,c=>c.rect(dx0,dy0,dx1-dx0,W-dy0),S.ink,1);
  // the floor of packed earth
  S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,W],[1940,W],[1940,1100,1],[-20,1100,1]],na_lc("floor"),S.shade?{grad:[0,W,0,1080,0.1],exact:true}:{flat:true,exact:true});
  S.line(ctx,c=>{for(const [x,y,l] of [[180,640,90],[1500,700,120],[700,1010,140],[1700,980,100],[1040,600,70]]){c.moveTo(x,y);c.lineTo(x+l,y+2);}},na_lc("floor2"),0.6);
  // the beam and the posts along the back wall
  S.begin(ctx,{lw:3,sh:4});S.fill(ctx,c=>c.rect(-20,92,1960,46),na_lc("beam"),{});
  for(const px of [150,660,1260,1770]){S.fill(ctx,c=>c.rect(px-22,138,44,W-138),na_lc("post"),{});S.fill(ctx,c=>c.rect(px-30,W-14,60,18),U.dk(na_lc("post"),0.15),{});}
  // rolls of bamboo slips, tied, on a low stand by the far wall: no writing shows
  S.begin(ctx,{lw:2.4,sh:3});S.fill(ctx,c=>c.rect(1420,500,260,16),na_lc("beam"),{});S.fill(ctx,c=>{c.rect(1436,516,14,40);c.rect(1650,516,14,40);},na_lc("beam"),{});
  for(const [x,y,r] of [[1470,478,22],[1520,476,24],[1574,479,22],[1626,477,23],[1496,440,21],[1550,438,22],[1602,440,21]]){
    S.fill(ctx,c=>U.ell(c,x,y,r,r*0.92),na_lc("slip"),{});S.line(ctx,c=>{c.moveTo(x-r*0.7,y-r*0.2);c.lineTo(x+r*0.7,y-r*0.2);c.moveTo(x-r*0.7,y+r*0.25);c.lineTo(x+r*0.7,y+r*0.25);},na_lc("slip2"),0.7);}
  // the mats
  for(const k in NA_SEAT){const [x,fl,w]=NA_SEAT[k];na_mat(ctx,x,fl+8,w);}};
// the people of Lu: whole, in robes; a small cap over the bound hair, held by a cord under the chin
const NA_LUFOLK={
  kong:{key:"kong",name:"",skin:[222,184,150],hair:{style:"bun",c:[186,182,176]},beard:[196,192,186],top:{kind:"jacket",c:[80,88,108],inner:[232,224,206]},bottom:{kind:"long",c:[80,88,108]},shoe:[60,50,46],lucap:[52,48,52]},
  zilu:{key:"zilu",name:"",skin:[214,170,132],hair:{style:"bun",c:[30,26,26]},beard:[40,34,32],build:{thick:1.12},top:{kind:"jacket",c:[148,92,64],inner:[236,226,204]},bottom:{kind:"long",c:[148,92,64]},shoe:[60,50,46],lucap:[52,48,52]},
  ranyou:{key:"ranyou",name:"",skin:[226,190,156],hair:{style:"bun",c:[34,28,28]},top:{kind:"jacket",c:[108,128,108],inner:[236,230,212]},bottom:{kind:"long",c:[108,128,108]},shoe:[60,50,46],lucap:[52,48,52]},
  gongxi:{key:"gongxi",name:"",skin:[218,178,140],hair:{style:"bun",c:[36,30,30]},top:{kind:"jacket",c:[184,156,112],inner:[240,232,214]},bottom:{kind:"long",c:[184,156,112]},shoe:[60,50,46],lucap:[52,48,52]},
  lu5:{key:"lu5",name:"",skin:[210,168,128],hair:{style:"bun",c:[40,32,30]},top:{kind:"jacket",c:[126,110,140],inner:[236,228,210]},bottom:{kind:"long",c:[126,110,140]},shoe:[60,50,46],lucap:[52,48,52]}};
const na_luRow=w=>typeof w==="string"?(NA_LUFOLK[w]||PK.CAST[w]):w;
function na_luCap(ctx,P,J){if(!P.lucap||!J||!J.hc)return;const S=PK.S,U=PK.u,hh=J.p.head*J.u,[x,y]=J.hc,r=hh*0.5,sg=J.sgn||1;S.begin(ctx,{lw:U.clamp(hh*0.03,0.8,3.2)});
  S.fill(ctx,c=>{c.moveTo(x-r*0.34,y-r*0.86);c.bezierCurveTo(x-r*0.36,y-r*1.3,x+r*0.36,y-r*1.3,x+r*0.34,y-r*0.86);c.closePath();},P.lucap,{});
  S.line(ctx,c=>{c.moveTo(x-sg*r*0.3,y-r*0.86);c.quadraticCurveTo(x-sg*r*0.62,y-r*0.1,x-sg*r*0.42,y+r*0.62);},U.dk(P.lucap,0.1),0.45);}
const na_lu=(ctx,who,x,fl,pose,o)=>{const P=na_luRow(who),J=PK.person(ctx,P,x,fl,na_hLu(fl),pose,o);if(!(o&&o.part==="lower"))na_luCap(ctx,P,J);return J;};
const na_luWalk=(ctx,who,t,w,o)=>{const P=na_luRow(who),J=PK.walk(ctx,P,t,Object.assign({h:na_hLu(w.floor)},w),o);na_luCap(ctx,P,J);return J;};
// kneeling on a mat, sitting back on the heels, hands on the thighs; leaning in a little to listen or to speak
const NA_SEIZA={mode:"kneel",lean:3,head:2,aN:[26,64],aF:[18,60],lN:[80,-94],lF:[76,-94],fN:80,fF:80};
const NA_SEIZA2={mode:"kneel",lean:12,head:6,aN:[34,70],aF:[24,64],lN:[80,-94],lF:[76,-94],fN:80,fF:80};
// a gift for the teacher: a small bundle of dried meat, wrapped and tied
const na_bundle=(c,h)=>{const S=PK.S,U=PK.u,[x,y]=h;S.begin(c,{lw:2});S.fill(c,cc=>U.ell(cc,x+6,y+10,30,15),[150,104,72],{});
  S.line(c,cc=>{cc.moveTo(x-6,y-3);cc.lineTo(x-2,y+24);cc.moveTo(x+18,y-3);cc.lineTo(x+16,y+24);},[96,70,52],0.6);};
