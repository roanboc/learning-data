/* ===== One small change at a time: Colombo, 2000 to 2007, in ink line =====
   The opening story's places, people and things (prefix kzp_). The people kit draws the people and the rooms' things and is never
   changed for this film. Checked against the script's Rigour (the Castle Street Hospital for Women's 5S and kaizen work from 2000;
   JICA's programme for African hospitals from 2007).
     kzpWard     a ward of a public hospital: pale walls, tall windows, beds and cots along the wall (o.tidy: the clutter gone)
     kzpStore    a store room: its shelves, from cluttered to sorted and labelled (kzp_store, with the shot)
     kzpOffice   the director's office: a window, a board for the five steps (KZP_BD)
   Nothing Sri Lankan, Japanese or African is borrowed in the look (no motif, script or pattern): a plain public hospital of the time,
   never a likeness of the real one. Nobody is shown ill or hurt. Colour keeps the module's meaning: amber for the infections and
   for what isn't needed, green for what got better; the rooms carry none. Every name this file declares starts with kzp_ or KZP_. */
const KZP_IE=380,kzp_h=fl=>PK.hAt(fl,KZP_IE),KZP_RF=800;
const KZP_PAL={ward:[220,230,222],store:[226,220,204],office:[230,222,206],tile:[196,196,186],boards:[176,150,118],sky:[206,222,232],palm:[112,140,96],
  bed:[150,156,166],sheet:[244,244,238],blanket:[196,210,224],cot:[210,200,186],shelf:[140,124,104],box:[200,170,120],box2:[176,186,196],bin:[130,130,120]};
const kzp_c=k=>PK.S.tone(KZP_PAL[k]);
function kzp_room(ctx,wall,floor,wins){const S=PK.S,U=PK.u;ctx.fillStyle=U.css(kzp_c(wall));ctx.fillRect(0,0,1920,KZP_RF);
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,KZP_RF-22,1960,22),U.dk(kzp_c(wall),0.12),{w:0.6});
  S.poly(ctx,[[-20,KZP_RF,1],[1940,KZP_RF,1],[1940,1100,1],[-20,1100,1]],kzp_c(floor),{exact:true,grad:[0,KZP_RF,0,1080,0.1]});
  for(const [x,y,w,h] of wins||[]){S.begin(ctx,{lw:2.4,sh:2});S.fill(ctx,c=>c.rect(x,y,w,h),kzp_c("sky"),{flat:true,line:false});
    S.begin(ctx,{lw:2.2,far:0.4,sh:0});S.fill(ctx,c=>{c.moveTo(x+w*0.3,y+h);c.quadraticCurveTo(x+w*0.34,y+h*0.6,x+w*0.3,y+h*0.35);},kzp_c("palm"),{w:0.4});
    S.fill(ctx,c=>c.ellipse(x+w*0.3,y+h*0.33,w*0.16,h*0.08,0,0,7),kzp_c("palm"),{w:0.4});PK.windowFrame(ctx,x,y,w,h,{});}}
// a bed against the back wall, seen from the side (x: its middle)
function kzp_bed(ctx,x){const S=PK.S;S.begin(ctx,{lw:2.4,sh:3});S.line(ctx,c=>{c.moveTo(x-150,KZP_RF+10);c.lineTo(x-150,KZP_RF-130);c.moveTo(x+150,KZP_RF+10);c.lineTo(x+150,KZP_RF-90);},kzp_c("bed"),1.4);
  S.fill(ctx,c=>c.rect(x-150,KZP_RF-80,300,24),kzp_c("sheet"),{});S.fill(ctx,c=>c.rect(x-60,KZP_RF-86,210,30),kzp_c("blanket"),{});S.fill(ctx,c=>c.ellipse(x-120,KZP_RF-88,30,12,0,0,7),kzp_c("sheet"),{});}
// a cot beside it
function kzp_cot(ctx,x){const S=PK.S;S.begin(ctx,{lw:2.2,sh:3});S.fill(ctx,c=>c.rect(x-60,KZP_RF-110,120,70),kzp_c("cot"),{});
  S.line(ctx,c=>{for(let i=-50;i<=50;i+=20){c.moveTo(x+i,KZP_RF-110);c.lineTo(x+i,KZP_RF-40);}c.moveTo(x-56,KZP_RF-40);c.lineTo(x-56,KZP_RF+10);c.moveTo(x+56,KZP_RF-40);c.lineTo(x+56,KZP_RF+10);},PK.u.dk(kzp_c("cot"),0.3),0.8);}
AG_PLACES.kzpWard=ctx=>{kzp_room(ctx,"ward","tile",[[140,130,300,400],[1520,130,300,400]]);for(const x of [640,1180])kzp_bed(ctx,x);kzp_cot(ctx,880);kzp_cot(ctx,1420);};
// clutter on a floor or a bed's foot: boxes, a bin, papers (u: how much is still there, 0 to 1)
function kzp_clutter(ctx,xs,u){if(u<=0.004)return;const S=PK.S;ctx.save();ctx.globalAlpha*=u;S.begin(ctx,{lw:2.2,sh:3});
  xs.forEach((x,i)=>{const y=KZP_RF+20+(i%3)*14;S.fill(ctx,c=>c.rect(x-34,y-44,68,44),i%2?kzp_c("box"):kzp_c("box2"),{});if(i%3===1)S.fill(ctx,c=>c.rect(x+40,y-56,34,56),kzp_c("bin"),{});});ctx.restore();}
AG_PLACES.kzpStore=ctx=>{kzp_room(ctx,"store","tile",[]);const S=PK.S;S.begin(ctx,{lw:2.6,sh:4});
  for(const x0 of [200,1160])S.fill(ctx,c=>{c.rect(x0,180,560,16);for(let k=1;k<4;k++)c.rect(x0,180+k*150,560,14);c.rect(x0,180,14,620);c.rect(x0+546,180,14,620);},kzp_c("shelf"),{});};
// the shelves' contents: messy (tidy 0) or sorted, each thing in its place with a label under it (tidy 1)
function kzp_store(ctx,tidy){const S=PK.S;S.begin(ctx,{lw:2.2,sh:3});
  for(const x0 of [200,1160])for(let k=0;k<3;k++){const y=180+k*150+150;for(let i=0;i<5;i++){const jit=(1-tidy)*(((i*31+k*17)%40)-20),bx=x0+40+i*100+jit,bh=60+(1-tidy)*(((i+k)%3)*14);
    S.fill(ctx,c=>c.rect(bx,y-bh,76,bh),(i+k)%2?kzp_c("box"):kzp_c("box2"),{});
    if(tidy>0.5){ctx.save();ctx.globalAlpha*=PK.u.clamp((tidy-0.5)*2,0,1);S.fill(ctx,c=>c.rect(bx+14,y-24,48,14),[250,250,244],{flat:true});ctx.restore();}}}
  kzp_clutter(ctx,[420,560,700,1300,1460,1620],1-tidy);}
AG_PLACES.kzpOffice=ctx=>{kzp_room(ctx,"office","boards",[[1500,130,320,420]]);const S=PK.S;S.begin(ctx,{lw:3,far:0.1,sh:5});PK.board(ctx,KZP_BD.x,KZP_BD.y,KZP_BD.w,KZP_BD.h,{});};
const KZP_BD={x:300,y:300,k:0.5,w:1250*0.5,h:524*0.5,floor:930,rest:980};

/* ---------------------------------------------------------------- the hospital's staff, in the plain working clothes of the time: nobody's likeness */
const KZP_FOLK={
  director:{key:"kzpDirector",name:"",skin:[150,104,78],hair:{style:"short",c:[40,34,32]},glasses:[56,48,44],top:{kind:"jacket",c:[226,222,210],inner:[240,240,236]},bottom:{kind:"trousers",c:[90,90,96]},shoe:[50,44,40]},
  nurse:{key:"kzpNurse",name:"",skin:[152,106,80],hair:{style:"bun",c:[28,22,20]},top:{kind:"jacket",c:[236,236,232],inner:[226,226,220]},bottom:{kind:"skirt",c:[230,230,226]},shoe:[230,228,222]},
  sister:{key:"kzpSister",name:"",skin:[170,122,94],hair:{style:"bun",c:[40,30,28]},glasses:[58,48,44],top:{kind:"jacket",c:[200,210,226],inner:[236,236,232]},bottom:{kind:"skirt",c:[200,210,226]},shoe:[230,228,222]},
  orderly:{key:"kzpOrderly",name:"",skin:[128,88,64],hair:{style:"crop",c:[30,26,24]},top:{kind:"sweater",c:[194,196,194]},bottom:{kind:"trousers",c:[150,150,150]},shoe:[60,54,50]},
  mother:{key:"kzpMother",name:"",skin:[160,114,86],hair:{style:"long",c:[24,20,20]},top:{kind:"sweater",c:[186,120,140]},bottom:{kind:"skirt",c:[110,90,120]},shoe:[90,70,60]},
  nurse2:{key:"kzpNurse2",name:"",skin:[96,66,50],hair:{style:"coily",c:[22,18,18]},top:{kind:"jacket",c:[236,236,232],inner:[226,226,220]},bottom:{kind:"skirt",c:[230,230,226]},shoe:[230,228,222]},
  nurse3:{key:"kzpNurse3",name:"",skin:[110,76,56],hair:{style:"bun",c:[26,22,20]},top:{kind:"jacket",c:[200,210,226],inner:[236,236,232]},bottom:{kind:"skirt",c:[200,210,226]},shoe:[230,228,222]}};
const kzp_row=w=>typeof w==="string"?(KZP_FOLK[w]||PK.CAST[w]):w;
const kzp_person=(ctx,who,x,fl,pose,o,h)=>PK.person(ctx,kzp_row(who),x,fl,h||kzp_h(fl),pose,o);
const kzp_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};
const kzp_desk=(ctx,who,x,fl,o)=>PK.atDesk(ctx,who?kzp_row(who):null,x,fl,kzp_h(fl),Object.assign({w:0.5*kzp_h(fl),screen:null},o||{}));
const kzp_laptop=(cc,D,flip)=>{PK.laptop(cc,D.x0+D.dir*0.45*D.w,D.top,{k:D.k,flip:!!flip});};
