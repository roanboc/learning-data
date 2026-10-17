/* ===== One person, many roles: the places and the pictures =====
   The places are painted once and kept (post.js): the parish in 1686, the campus today, the paper with a little sky and land for the
   chapters that explain, a second one for the industries, and the data architect's office. The pictures are the film's own things:
   the parish books, the moving certificate, the 1947 card, Linh's email and her four records, the shelves of the kinds of data, the
   university's model, the inventory, the industries, DAMA's wheel and the four ways to keep master data, the gallery and the four
   questions, and the nine films. Every name starts with m1_ (this film) or M1_. */

/* ---------- the places ---------- */
const M1_G1=x=>650-96*Math.exp(-Math.pow((x-450)/250,4))+6*Math.sin(x/150);
const M1_G2=x=>712+14*Math.sin(x/260+2)-44*Math.exp(-Math.pow((x-1010)/320,2));
const M1_G3=x=>812+22*Math.sin((x+200)/420)+8*Math.sin(x/130);
const M1_FF=x=>540+18*Math.sin(x/300+0.4)+6*Math.sin(x/110);
// the road from the farm to Uppsala, which the certificate travels
const M1_ROAD=wc_smooth([[1036,M1_G2(1036)+8],[1120,M1_G2(1120)-4],[1210,646],[1300,610],[1380,578],[1450,550],[1500,536]],8);
// 1686: a parish church on its hill, a lake, a falu-red farmhouse, the road to Uppsala and its cathedral far off, a roundpole fence
function m1_parish(ctx){const P=WCP;wc_sky(ctx,604,1,{sun:[1660,170]});
  wc_forest(ctx,x=>500+14*Math.sin(x/210)+8*Math.sin(x/80+1.3),P.farForest,0.05,11,{h:30,w:18});wc_cathedral(ctx,1430,532,0.8,0.14);
  wc_land(ctx,M1_FF,P.far,0.22);wc_fieldStrips(ctx,M1_FF,4,64,4,[P.far,P.field],0.24,3);
  wc_treeRow(ctx,x=>M1_FF(x)+2,1120,1420,46,34,0.24,7);wc_treeRow(ctx,x=>M1_FF(x)+2,1560,1900,44,32,0.24,9);wc_lake(ctx,574,820,0.34);
  wc_land(ctx,M1_G1,P.mid,0.5);wc_contact(ctx,270,700,M1_G1(450)+6,0.52);wc_church(ctx,296,M1_G1(450)+4,1.18,0.52);
  wc_wash(ctx,[[250,M1_G1(450)-1],[732,M1_G1(450)-1],[738,M1_G1(450)+16],[244,M1_G1(450)+16]],P.wall,{depth:0.55,kind:"wall",lw:1.5});
  wc_birch(ctx,208,M1_G1(208)+8,210,0.56,-0.03);wc_birch(ctx,770,M1_G1(770)+6,236,0.58,0.03);wc_birch(ctx,800,M1_G1(800)+8,190,0.58,-0.03);
  wc_land(ctx,M1_G2,P.mid2,0.6);for(const [x,h] of [[1196,150],[1236,178],[1272,140],[1716,140],[1760,170],[1804,128]])wc_spruce(ctx,x,M1_G2(x)+6,h,0.6);
  wc_contact(ctx,860,1130,M1_G2(1000)+6,0.64);wc_farmhouse(ctx,876,M1_G2(1000)+4,1.24,0.64);
  wc_wash(ctx,wc_band(M1_ROAD,30,6),P.road,{depth:0.62,kind:"road",line:false});
  wc_land(ctx,M1_G3,P.near,0.86);wc_fence(ctx,x=>M1_G3(x)+34,-40,1000,0.86);wc_tufts(ctx,M1_G3,0,1030,56,0.95,8);
  const R=wc_rng(5);for(let i=0;i<46;i++){const x=R()*1020,y=M1_G3(x)+90+R()*(H-M1_G3(x)-90),r=3+R()*3+(y-880)/60;wc_wash(ctx,wc_ell(x,y,r,r*0.9,12),[P.flowerA,P.flowerB,P.flowerC][i%3],{kind:"dab",flat:true});}}
// today: the university's old building and its glass wing, a lawn, terraced houses across the street, a lamp, the family's letterbox
const M1_LAWN=x=>664+5*Math.sin(x/300);
// the family's letterbox, where the post for nguyen.family goes
const M1_BOX=[1740,1012];
function m1_campus(ctx){const P=WCP;wc_sky(ctx,716,2,{sun:[1560,170]});
  wc_skyline(ctx,624,P.city,0.1,5);wc_treeRow(ctx,()=>640,-40,1980,58,70,0.24,21,P.leaf2);wc_land(ctx,M1_LAWN,P.lawn,0.42);
  wc_contact(ctx,140,770,668,0.46,0.22);wc_quad(ctx,150,668,0.46,0.62);wc_glassWing(ctx,762,668,150,170,0.48);
  [[1210,P.plaster],[1410,P.brickHouse,P.blueDoor],[1610,P.blueHouse],[1810,P.plaster]].forEach(([x,c,d])=>wc_terrace(ctx,x,742,232,c,0.56,{k:0.86,door:d}));
  wc_wash(ctx,[[1180,742],[W+60,742],[W+60,770],[1170,770]],P.hedge,{depth:0.6,kind:"hedge",lw:1.5});
  wc_roundTree(ctx,70,700,250,0.5);wc_roundTree(ctx,990,690,226,0.5,P.leaf2);wc_roundTree(ctx,1120,706,196,0.52);
  wc_wash(ctx,[[-60,782],[W+60,770],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.72,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth([[540,668],[560,720],[620,800],[740,900],[880,1090]],8),30,240),wc_lit(P.paving,0.08),{depth:0.62,kind:"path",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.14),0.55);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=800+i*i*5;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-10);ctx.stroke();}
  for(let i=-10;i<24;i++){ctx.beginPath();ctx.moveTo(960+i*54,782);ctx.lineTo(960+i*190,1080);ctx.stroke();}ctx.restore();
  wc_lamp(ctx,1186,846,300,0.72);wc_mailbox(ctx,M1_BOX[0],M1_BOX[1],0.95);}
// paper, with a little sky and a strip of land, for the chapters that explain; a second, for the industries
function m1_plain(ctx){wc_sky(ctx,836,3,{clouds:3});wc_land(ctx,x=>826+16*Math.sin(x/320+1),WCP.far,0.35,{line:false});wc_land(ctx,x=>882+10*Math.sin(x/240),WCP.near,0.75,{line:false});}
function m1_plainB(ctx){wc_sky(ctx,846,7,{clouds:4,cx:120,cw:1680});wc_land(ctx,x=>842+20*Math.sin(x/380+2),WCP.far,0.35,{line:false});wc_land(ctx,x=>898+12*Math.sin(x/260+1),WCP.near,0.75,{line:false});}
// the data architect's office: a warm wall, a tall window onto the campus, a floor
function m1_office(ctx){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,900),P.wallIn,{kind:"plaster",line:false});wc_wash(ctx,wc_rect(-40,858,W+80,260),P.floor,{kind:"ground",line:false});
  wc_wash(ctx,wc_rect(-40,846,W+80,18),wc_dim(P.wallIn,0.14),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.beginPath();ctx.rect(72,112,436,560);ctx.clip();wc_sky(ctx,560,4,{clouds:2,cx:80,cw:380,cy:150,ch:120});
  wc_land(ctx,x=>600+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_part(ctx,wc_rect(330,330,70,270),WCP.stone,0.4);wc_part(ctx,[[322,330],[408,330],[365,250]],WCP.slate,0.4);
  wc_roundTree(ctx,150,640,220,0.5);wc_roundTree(ctx,460,650,190,0.5,P.leaf2);ctx.restore();
  // the window's frame and sill
  for(const r of [wc_rect(60,100,460,16),wc_rect(60,100,16,584),wc_rect(504,100,16,584),wc_rect(282,100,16,584),wc_rect(60,384,460,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(40,676,500,22),wc_dim(P.wallIn,0.1),{kind:"trim",lw:1.5});}
const WC_PLACES={parish:m1_parish,campus:m1_campus,plain:m1_plain,plainB:m1_plainB,office:m1_office};
// a place, under the camera
function m1_place(ctx,key){ctx.drawImage(wc_place(key),0,0,W,H);}

/* ---------- 1. the parish ---------- */
// a veil of paper over the whole frame, so the one thing drawn after it stands out
function m1_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
// the household of Backa farm, as the priest wrote it: names, years of birth, and a mark for those who can read
const M1_HOUSE=[["Anders Persson","1648",1],["Karin Olsdotter","1652",1],["Erik","1675",1],["Brita","1678",0],["Per","1681",0]];
// the book's paper: a leather cover, two parchment pages, the gutter, a rule under each row (from r0, every rs), and the household
// ribbon in the first role colour; kept
function m1_bookPaper(w,h,r0,rs){return wc_kept("book"+w+"x"+h,w+64,h+120,ctx=>{ctx.translate(32,24);const P=WCP;
  wc_wash(ctx,wc_rect(-12,-10,w+24,h+22),P.leather,{kind:"cover",lw:2.5});wc_wash(ctx,wc_rect(0,0,w/2,h),P.parchment,{kind:"page",lw:2});wc_wash(ctx,wc_rect(w/2,0,w/2,h),P.parchment,{kind:"page",lw:2,seed:9});
  const g=ctx.createLinearGradient(w/2-30,0,w/2+30,0),gc=wc_dim(P.parchment,0.35);g.addColorStop(0,rgba(gc,0));g.addColorStop(0.5,rgba(gc,0.5));g.addColorStop(1,rgba(gc,0));ctx.fillStyle=g;ctx.fillRect(w/2-30,0,60,h);
  ctx.strokeStyle=rgba(P.parchInk,0.12);ctx.lineWidth=1.2;for(let y=r0;y<h-24;y+=rs){ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(w/2-30,y);ctx.moveTo(w/2+30,y);ctx.lineTo(w-30,y);ctx.stroke();}
  wc_wash(ctx,[[w/2-6,h-6],[w/2+10,h-6],[w/2+10,h+72],[w/2+2,h+60],[w/2-6,h+72]],WC_ROLE.student,{kind:"ribbon",flat:true});});}
function m1_bookAt(ctx,cx,cy,w,h,r0,rs){ctx.drawImage(m1_bookPaper(w,h,r0,rs),cx-w/2-32,cy-h/2-24);}
// a goose quill, for the hand that writes: its nib at (0,0), the feather leaning right as a pen is held; kept at twice the size
function m1_quill(ctx,x,y,a){if(a<=0.01)return;const q=wc_kept("quill",440,440,c=>{c.scale(2,2);c.translate(20,204);c.rotate(0.5);
    const Lf=[[-2,-38],[-8,-62],[-13,-96],[-14,-128],[-10,-154],[-2,-176]],Rt=[[3,-42],[12,-72],[19,-106],[20,-136],[13,-160],[2,-176]];
    const at=(e,y)=>{for(let i=1;i<e.length;i++)if(y>=e[i][1])return lerp(e[i-1][0],e[i][0],(y-e[i-1][1])/(e[i][1]-e[i-1][1]));return e[e.length-1][0];};
    wc_wash(c,Lf.concat(Rt.slice().reverse()),[246,240,226],{kind:"paper",lw:1.2,seed:5});
    c.lineCap="round";c.strokeStyle=rgba(WC_PENCIL,0.3);c.lineWidth=0.9;
    for(let y=-48;y>-170;y-=5.5){c.beginPath();c.moveTo(0,y);c.lineTo(at(Lf,y-9)*0.94,y-9);c.moveTo(0,y);c.lineTo(at(Rt,y-11)*0.94,y-11);c.stroke();}
    c.beginPath();c.moveTo(-1.7,-14);c.lineTo(-0.6,-176);c.lineTo(0.6,-176);c.lineTo(1.7,-14);c.closePath();c.fillStyle=rgba([226,214,186],1);c.fill();c.strokeStyle=rgba(WC_PENCIL,0.55);c.lineWidth=0.8;c.stroke();
    c.beginPath();c.moveTo(-2.6,-40);c.lineTo(-2.3,-15);c.lineTo(2.3,-15);c.lineTo(2.6,-40);c.closePath();c.fillStyle=rgba([234,224,198],1);c.fill();c.strokeStyle=rgba(WC_PENCIL,0.7);c.lineWidth=1;c.stroke();
    c.beginPath();c.moveTo(-2.3,-15);c.lineTo(0.2,0.5);c.lineTo(2.3,-15);c.closePath();c.fillStyle=rgba(WC_INK,0.92);c.fill();});
  withA(ctx,a,()=>ctx.drawImage(q,x-20,y-204,220,220));}
// handwriting that writes itself from p0 over d seconds, left to right, with the quill at the pen's tip, rising and falling with each
// letter; returns how far it has written
function m1_write(ctx,t,s,x,y,p0,d,o){o=o||{};const p=clamp((t-p0)/d,0,1);if(p<=0)return 0;const size=o.size||30,wt=o.w||600,x0=o.align==="right"?x-tw(ctx,s,size,wt):x;
  wc_hand(ctx,s,x0,y,{p,size,w:wt,col:o.col});
  if(p<1&&o.quill!==false){const f=s.length*p,n=Math.floor(f),a0=tw(ctx,s.slice(0,n),size,wt),a1=tw(ctx,s.slice(0,n+1),size,wt);
    m1_quill(ctx,x0+lerp(a0,a1,f-n)+1,y-5-Math.sin((f-n)*Math.PI)*8,1);}return p;}
// the next parish's book, smaller: it takes the name in
function m1_book2(ctx,t,cx,cy,t0){const w=560,h=250,L=cx-w/2+34,R=cx+26,top=cy-h/2;m1_bookAt(ctx,cx,cy,w,h,68,46);
  m1_write(ctx,t,"Uppsala",L,top+60,t0+0.2,0.7);m1_write(ctx,t,"Olof, farmhand",R,top+60,t0+0.9,0.9);m1_write(ctx,t,"1664",R,top+106,t0+1.8,0.4);
  m1_write(ctx,t,"from Backa farm",R,top+152,t0+2.2,1.0,{col:WC_ROLEINK.student});}
// the moving certificate: a folded paper with the household ribbon
function m1_cert(ctx,x,y,s,rot,a){if(a<=0.01)return;const c=wc_kept("cert",150,120,q=>{q.translate(15,12);wc_wash(q,[[0,8],[110,0],[118,80],[6,90]],WCP.parchment,{kind:"paper",lw:1.6});
    q.strokeStyle=rgba(WCP.parchInk,0.45);q.lineWidth=1.6;for(let i=0;i<3;i++){q.beginPath();q.moveTo(16,30+i*16);q.lineTo(80-i*10,26+i*16);q.stroke();}wc_wash(q,wc_rect(88,2,10,86),WC_ROLE.student,{kind:"ribbon",flat:true});});
  ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);withA(ctx,a,()=>ctx.drawImage(c,-75,-60));ctx.restore();}
// the walker who carries it, kept, with a step's bob
function m1_walker(ctx,x,y,t,a){if(a<=0.01)return;const c=wc_kept("walker",120,130,q=>{wc_walker(q,52,120,100,WCP.coat,0.9,{paper:true});});
  withA(ctx,a,()=>ctx.drawImage(c,x-52,y-120-Math.abs(Math.sin(t*5.4))*3));}
// the card of 1947, and the number stamped on it at ts: the impression lands a little large and settles, in violet ink inside a double
// rule, and the card gives under it
const M1_STAMP=[58,52,120];
function m1_card47(ctx,t,cx,cy,ts){const w=600,h=270,c=wc_kept("card47",w+40,h+40,q=>{q.translate(20,20);wc_wash(q,wc_rect(0,0,w,h),[246,236,212],{kind:"page",lw:2});
    q.strokeStyle=rgba(WCP.parchInk,0.18);q.lineWidth=1.4;for(let i=0;i<2;i++){q.beginPath();q.moveTo(36,212+i*30);q.lineTo(w-36,212+i*30);q.stroke();}});
  const dy=Math.sin(clamp((t-ts)/0.2,0,1)*Math.PI)*5;ctx.drawImage(c,cx-w/2-20,cy-h/2-20+dy);
  wc_T(ctx,"personal number",cx-w/2+36,cy-h/2+58+dy,{w:700,size:30,col:WCP.parchInk});
  const p=clamp((t-ts)/0.2,0,1);if(p<=0)return;const k=lerp(1.32,1,1-Math.pow(1-p,3));
  ctx.save();ctx.translate(cx,cy+22+dy);ctx.rotate(-0.035);ctx.scale(k,k);withA(ctx,p,()=>{ctx.drawImage(m1_stampRule(),-210,-60,420,120);
    wc_T(ctx,"260514-317",0,20,{f:"mono",w:500,size:56,col:M1_STAMP,a:0.88,align:"center"});});ctx.restore();}
// the stamp's double rule, its ink uneven where the stamp pressed less
function m1_stampRule(){return wc_kept("stampRule",840,240,q=>{q.scale(2,2);q.translate(4,4);
  wc_ink(q,wc_rrPts(0,0,412,112,10),true,3.6,M1_STAMP,0.9,41,0.6);wc_ink(q,wc_rrPts(9,9,394,94,6),true,1.8,M1_STAMP,0.85,43,0.6);
  q.globalCompositeOperation="destination-out";q.globalAlpha=0.5;q.drawImage(WC.blotch,-40,-30,520,300);});}

/* ---------- 2 and 3. the campus, Linh's email and her four records ---------- */
const M1_LX=560,M1_LY=1018;
// where Linh's phone is, when she holds it up
const M1_PHONE=[548,632];
// the email the family shares, and the one that is only hers
function m1_famCard(ctx,x,y,a,o){o=o||{};withA(ctx,a,()=>wc_info(ctx,x,y,560,124,"nguyen.family@mail.example","shared with Minh",{bigSize:28,badge:o.badge?"family":null}));}
function m1_ownCard(ctx,x,y,p,a){withA(ctx,a,()=>{wc_panel(ctx,x,y,560,94,{kind:"card",wash:WC_ROLE.student,washA:0.16});const s="linh.nguyen@mail.example",n=typeOn(s,p);
  wc_T(ctx,n,x+30,y+58,{f:"mono",w:500,size:28,col:WC_DARK});if(p<1&&p>0){const cx=x+30+tw(ctx,n,28,500,"mono")+3;ctx.fillStyle=rgba(WC_DARK,0.8);ctx.fillRect(cx,y+30,3,34);}});}
// Linh's four records, as each system holds them (and the fifth, next year), where they sit around her
const M1_CARDS={student:[90,170,400,120],platform:[640,130,446,120],customer:[40,330,476,120],tutor:[680,290,446,120],alumna:[700,450,410,102]};
function m1_card(ctx,k,o){o=o||{};const [x,y,w,h]=M1_CARDS[k];
  if(k==="student")wc_roleCard(ctx,x,y,w,h,"student","Student","S-20436",o.fresh?"linh.nguyen@…":"nguyen.family@…",{fresh:o.fresh,ba:o.ba});
  else if(k==="platform")wc_roleCard(ctx,x,y,w,h,"platform","Platform user","u-88236",o.fresh?"linh.nguyen@…":"nguyen.family@…",{fresh:o.fresh,ba:o.ba});
  else if(k==="customer")wc_roleCard(ctx,x,y,w,h,"customer","Short-course customer",null,o.fresh?"linh.nguyen@…":"nguyen.family@…",{fresh:o.fresh,ba:o.ba});
  else if(k==="tutor")wc_roleCard(ctx,x,y,w,h,"tutor","Casual tutor","E-4417",o.fresh?"linh.nguyen@…":"nguyen.family@…",{fresh:o.fresh,ba:o.ba});
  else wc_roleCard(ctx,x,y,w,h,"alumna","Alumna",null,null,{dashed:true,note:"next year"});}
// where a card's line to Linh starts
const m1_cardEnd=k=>{const [x,y,w,h]=M1_CARDS[k];return x+w/2<M1_LX?[x+w,y+h/2]:[x,y+h/2];};

/* ---------- 4. the kinds of data ---------- */
// Linh's roles, as bands on her white figure: the same order wherever she's drawn as the master record
const M1_BANDS=["student","customer","tutor","alumna"];
const m1_bands=a=>M1_BANDS.map((r,i)=>({col:WC_ROLE[r],dashed:r==="alumna",a:a[i]==null?1:a[i]}));
// a shelf: a plank on two brackets, drawn in from the left as p goes 0 to 1
function m1_shelf(ctx,cx,y,p){if(p<=0)return;const c=wc_kept("shelf",440,70,q=>{q.translate(20,10);wc_wash(q,wc_rect(0,0,400,18),WCP.wood,{kind:"trim",lw:1.6});
    for(const x of [34,366])wc_wash(q,[[x-12,18],[x+12,18],[x,44]],wc_dim(WCP.wood,0.12),{kind:"trim",lw:1.2});});
  ctx.save();ctx.beginPath();ctx.rect(cx-220,y-12,440*ease(clamp(p,0,1)),80);ctx.clip();ctx.drawImage(c,cx-220,y-10);ctx.restore();}
// a short list on a card: its name, its values, and the value that sorts Linh, lit as la goes 0 to 1; returns its height
function m1_list(ctx,x,y,w,head,items,lit,litCol,la){const h=66+items.length*44;wc_panel(ctx,x,y,w,h,{kind:"card"});wc_T(ctx,head,x+26,y+46,{w:800,size:30,col:WC_DARK});
  items.forEach((it,i)=>{const yy=y+96+i*44;if(i===lit&&la>0.01)withA(ctx,la,()=>wc_panel(ctx,x+14,yy-31,w-28,42,{kind:"chip",role:litCol,seed:i+3}));
    wc_T(ctx,it,x+30,yy,{w:i===lit&&la>0.5?700:600,size:28,col:WC_INK});});return h;}
// something that happened, as a slip: what, and when, with a dot in the colour of the role it happened to
function m1_slip(ctx,x,y,role,name,date){wc_panel(ctx,x,y,380,64,{kind:"tag",seed:name.length});ctx.fillStyle=rgba(WC_ROLE[role],1);ctx.beginPath();ctx.arc(x+30,y+32,8,0,TAU);ctx.fill();
  wc_T(ctx,name,x+50,y+43,{w:700,size:30,col:WC_DARK});wc_T(ctx,date,x+354,y+42,{w:500,size:28,f:"mono",align:"right",col:WC_MUTED});}
// the glossary's card for a term, and what it means
function m1_term(ctx,x,y,w,term,def){const h=130+def.length*40;wc_panel(ctx,x,y,w,h,{kind:"card"});wc_badge(ctx,x+24,y+40,"glossary");
  wc_T(ctx,term,x+26,y+112,{w:800,size:38,col:WC_DARK});def.forEach((l,i)=>wc_T(ctx,l,x+26,y+156+i*38,{w:600,size:28,col:WC_INK}));return h;}
// a double-headed pencil arrow that grows from its middle as p goes 0 to 1: two things to tell apart
function m1_dArrow(ctx,x0,y,x1,p,col){if(p<=0)return;const m=(x0+x1)/2,h=(x1-x0)/2*ease(clamp(p,0,1)),a=m-h,b=m+h;ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,0.9);
  ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(a,y);ctx.lineTo(b,y);if(p>0.6){ctx.moveTo(a+14,y-10);ctx.lineTo(a,y);ctx.lineTo(a+14,y+10);
    ctx.moveTo(b-14,y-10);ctx.lineTo(b,y);ctx.lineTo(b-14,y+10);}ctx.stroke();ctx.restore();}

// a person facing the other way when o.flip: someone who points at what's on their left, so the hand stays in the frame
function m1_person(ctx,id,x,y,s,o){if(!o.flip)return person(ctx,id,x,y,s,o);ctx.save();ctx.translate(x,0);ctx.scale(-1,1);person(ctx,id,0,y,s,o);ctx.restore();}

/* ---------- 5. the university's model ---------- */
// the university's map, as In the weeds of data crafting's project keeps it: its domains and their key entities, on a sheet pinned to
// the office wall. Learner, applicant and staff member are each a role; nothing on it is a person
const M1_MAP={x:600,y:96,w:1260,h:720};
const M1_DOM=[["student",630,184,520,300,WC_ROLE.student,["learner","credential","credit towards award"]],
  ["course",1170,184,330,300,[100,130,200],["award","unit of study","short course"]],
  ["organisation",1520,184,310,300,[130,134,160],["campus","faculty","school"]],
  ["admissions",630,504,330,290,[214,150,90],["applicant","application","offer"]],
  ["staff",980,504,300,290,WC_ROLE.tutor,["staff member","appointment"]],
  ["fees",1300,504,260,290,[150,160,110],["student fee","scholarship"]],
  ["research",1580,504,250,290,[170,120,150],["candidature","supervision"]]];
// where an entity sits on the map: its box
let M1_MC=null;
function m1_ent(name){if(!M1_MC)M1_MC=mkCanvas(8,8).getContext("2d");for(const [n,x,y,w,h,col,es] of M1_DOM){const i=es.indexOf(name);if(i>=0)return[x+20,y+70+i*58,Math.round(tw(M1_MC,name,28,600)+36),46];}return null;}
// the sheet and its domains' washes, painted once at twice the size
function m1_mapPaper(){const M=M1_MAP;return wc_kept("map",(M.w+40)*2,(M.h+40)*2,q=>{q.scale(2,2);q.translate(20,20);
  wc_wash(q,wc_rect(0,0,M.w,M.h),[250,248,240],{kind:"page",lw:2,seed:4});
  M1_DOM.forEach(([n,x,y,dw,dh,col],i)=>wc_wash(q,wc_resample(wc_rrPts(x-M.x,y-M.y,dw,dh,22),10),col,{kind:"chipwash",line:false,a:0.3,seed:11+i*5}));
  for(const px of [44,M.w-44]){q.fillStyle=rgba([196,72,60],1);q.beginPath();q.arc(px,20,8,0,TAU);q.fill();q.fillStyle=rgba([255,255,255],0.6);q.beginPath();q.arc(px-2.5,17.5,2.5,0,TAU);q.fill();}});}
// the map, with its words drawn live; o.hi lights the learner; o.spot fades every domain but the student's, to look at the learner alone
function m1_map(ctx,o){o=o||{};const M=M1_MAP,sp=o.spot||0;ctx.drawImage(m1_mapPaper(),M.x-20,M.y-20,M.w+40,M.h+40);
  wc_T(ctx,"the university's map",M.x+M.w-34,M.y+58,{w:800,size:32,align:"right",col:WC_DARK});
  if(sp>0.01){ctx.save();ctx.fillStyle=rgba([250,248,240],0.6*sp);M1_DOM.forEach(([n,x,y,dw,dh])=>{if(n==="student")return;ctx.beginPath();rr(ctx,x-6,y-6,dw+12,dh+12,24);ctx.fill();});ctx.restore();}
  M1_DOM.forEach(([n,x,y,dw,dh,col,es])=>withA(ctx,n==="student"?1:1-0.7*sp,()=>{wc_T(ctx,n,x+24,y+46,{w:800,size:30,col:wc_dim(col,0.4)});
    es.forEach(e=>{const [ex,ey,ew,eh]=m1_ent(e),hi=e==="learner"?(o.hi||0):0;wc_panel(ctx,ex,ey,ew,eh,{kind:"card",seed:e.length});
      if(hi>0.01)withA(ctx,hi,()=>wc_panel(ctx,ex,ey,ew,eh,{kind:"card",wash:WC_ROLE.student,washA:0.5,seed:e.length}));
      wc_T(ctx,e,ex+18,ey+33,{w:hi>0.5?800:600,size:28,col:WC_INK});});}));}
// the learner's keys, one per system that knows her, and the decision that says two of them are the same learner
function m1_keys(ctx,x,y){const w=620,h=262;wc_panel(ctx,x,y,w,h,{kind:"card"});wc_T(ctx,"the learner's keys",x+28,y+48,{w:800,size:30,col:WC_DARK});
  [["student","SIS | S-20436"],["platform","LMS | u-88236"],["customer","SC | nguyen.family@…"]].forEach(([r,k],i)=>{const yy=y+96+i*44;ctx.fillStyle=rgba(WC_ROLE[r],1);
    ctx.beginPath();ctx.arc(x+38,yy-9,8,0,TAU);ctx.fill();wc_T(ctx,k,x+58,yy,{w:500,size:28,f:"mono",col:WC_INK});});
  const bw=wc_badge(ctx,x+28,y+h-40,"D-001");wc_T(ctx,"same learner, decided by Mei",x+28+bw+14,y+h-30,{w:600,size:28,col:WC_INK});}
// the model's decision, typed in: what's wrong, and what to do; a note the size of her name card, which it replaces
function m1_decision(ctx,x,y,p){const w=380,h=196;wc_panel(ctx,x,y,w,h,{kind:"card"});wc_badge(ctx,x+26,y+40,"decision");
  const L=["The model has roles,","not people.","Add the person."];let n=Math.round(L.join("").length*clamp(p,0,1));
  L.forEach((s,i)=>{if(n<=0)return;wc_T(ctx,s.slice(0,n),x+28,y+96+i*38,{w:i<2?700:800,size:28,col:i<2?WC_DARK:WC_ROLEINK.student});n-=s.length;});}

/* ---------- 6. four things, kept apart ---------- */
// the person, with the label above her; the lanes start at M1_AX
const M1_AX=700,M1_FIG=[350,860,0.82];
// Linh's roles, dated; her contact points, each with its purpose; her identifiers, each with the system that issued it
const M1_ROLES=[["student","Student","from Jul 2025",700,168],["customer","Customer","Jan–Feb 2026",1284,168],["tutor","Tutor","Mar–Jun 2026",700,260],["alumna","Alumna","next year",1284,260]];
const M1_IDS=[["S-20436","by the student system",700],["u-88236","by the platform",1088],["E-4417","by HR",1476]];
// the same idea in enterprise architecture's notation (The map before the data): an actor, assigned to roles, for a time
function m1_ea(ctx,t,x,y,t0,tAs,tTime){const w=1144,h=440;wc_panel(ctx,x,y,w,h,{kind:"card",seed:5});wc_T(ctx,"in enterprise architecture",x+30,y+50,{w:600,size:28,col:WC_MUTED});
  const ax=x+250,ay=y+226;withA(ctx,fin(t,t0,0.5),()=>{archGlyph(ctx,"actor",ax,ay-10,92,WC_INK);wc_T(ctx,"actor",ax,ay+108,{w:800,size:32,align:"center",col:WC_DARK});
    wc_T(ctx,"person, team or organisation",ax,ay+150,{w:600,size:28,align:"center",col:WC_MUTED});});
  [["student",y+150],["tutor",y+320]].forEach(([r,ry],i)=>{const p=clamp((t-tAs-i*0.35)/0.7,0,1);if(p<=0)return;const x0=ax+70,x1=x+760,ex=lerp(x0,x1,ease(p)),ey=lerp(ay-20,ry,ease(p));
    ctx.save();ctx.strokeStyle=rgba(WC_INK,0.9);ctx.fillStyle=rgba(WC_INK,0.9);ctx.lineWidth=3.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,ay-20);ctx.lineTo(ex,ey);ctx.stroke();
    ctx.beginPath();ctx.arc(x0,ay-20,7,0,TAU);ctx.fill();if(p>0.9){const an=Math.atan2(ry-(ay-20),x1-x0);ctx.beginPath();ctx.moveTo(x1,ry);ctx.lineTo(x1-18*Math.cos(an-0.4),ry-18*Math.sin(an-0.4));
      ctx.lineTo(x1-18*Math.cos(an+0.4),ry-18*Math.sin(an+0.4));ctx.closePath();ctx.fill();}ctx.restore();
    withA(ctx,clamp(p*2-1,0,1),()=>{archGlyph(ctx,"role",x1+78,ry,64,WC_ROLEINK[r]);wc_T(ctx,r,x1+136,ry+11,{w:800,size:32,col:WC_ROLEINK[r]});});});
  withA(ctx,fin(t,tAs+0.3,0.5),()=>wc_T(ctx,"assigned to",x+520,y+150,{w:600,size:28,align:"center",col:WC_INK}));
  arrive(ctx,x+560,y+392,t,tTime,()=>wc_tag(ctx,x+560,y+392,"for a time",{align:"center"}),{dy:8});}

/* ---------- 7. who keeps what ---------- */
// the sheet Noor and Mei write: for each role, where it's created and who owns it; for each detail of the person, the system trusted
// for it and who keeps it; and at the top, who looks after the person
const M1_KS={x:400,y:76,w:1080,h:714},M1_KC=[440,780,1150];
const M1_KROLES=[["student","student system","registrar's office"],["customer","short-course platform","short courses"],["tutor","HR system","HR"],["alumna","alumni system","alumni office"]];
const M1_KDET=[["legal name","student system","registrar's office"],["preferred name","student portal","Linh"],["personal email","student portal","Linh"],["work details","HR system","HR"]];
// o: the moment each row is written (roles, dets), each detail's keeper is lit (keep), the person's row arrives (person), Mei ticks it (tick)
function m1_keeps(ctx,t,o){const K=M1_KS,[c1,c2,c3]=M1_KC;wc_panel(ctx,K.x,K.y,K.w,K.h,{kind:"sheet",seed:3});wc_T(ctx,"who keeps what",c1,K.y+64,{w:800,size:36,col:WC_DARK});
  const head=(y,a,cols)=>withA(ctx,a,()=>{cols.forEach((s,i)=>wc_T(ctx,s,M1_KC[i],y,{w:600,size:28,col:WC_MUTED}));ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(c1,y+14);ctx.lineTo(K.x+K.w-40,y+14);ctx.stroke();ctx.restore();});
  // who looks after the person: Mei's office, as steward
  const pa=fin(t,o.person,0.6);if(pa>0.01)withA(ctx,pa,()=>{wc_panel(ctx,K.x+20,K.y+92,K.w-40,62,{kind:"card",wash:WC_BADGE,washA:0.5,seed:2});
    wc_T(ctx,"the person",c1,K.y+134,{w:800,size:30,col:WC_DARK});wc_T(ctx,"Mei's office",c2,K.y+134,{w:800,size:30,col:WC_DARK});
    const bw=wc_badge(ctx,c3,K.y+123,"steward");wc_tick(ctx,c3+bw+34,K.y+120,40,[176,124,10],clamp((t-o.tick)/0.45,0,1),5.5);});
  head(K.y+210,fin(t,o.roles[0]-0.4,0.4),["role","who creates it","who owns it"]);
  M1_KROLES.forEach(([r,a,b],i)=>{const k=fin(t,o.roles[i],0.35);if(k<=0.01)return;const y=K.y+256+i*46;withA(ctx,k,()=>{ctx.save();ctx.beginPath();ctx.arc(c1+9,y-9,9,0,TAU);
      if(r==="alumna"){ctx.setLineDash([4,4]);ctx.strokeStyle=rgba(WC_ROLE[r],1);ctx.lineWidth=2.5;ctx.stroke();}else{ctx.fillStyle=rgba(WC_ROLE[r],1);ctx.fill();}ctx.restore();
    wc_T(ctx,r,c1+30,y,{w:700,size:28,col:WC_DARK});wc_T(ctx,a,c2,y,{w:600,size:28,col:WC_INK});wc_T(ctx,b,c3,y,{w:600,size:28,col:WC_INK});});});
  head(K.y+480,fin(t,o.dets[0]-0.4,0.4),["detail","trusted system","who keeps it"]);
  M1_KDET.forEach(([d,a,b],i)=>{const k=fin(t,o.dets[i],0.35),kk=fin(t,o.keep[i],0.45);if(k<=0.01)return;const y=K.y+526+i*46;withA(ctx,k,()=>{
    wc_T(ctx,d,c1,y,{w:700,size:28,col:WC_DARK});wc_T(ctx,a,c2,y,{w:600,size:28,col:WC_INK});
    if(kk>0.01)withA(ctx,kk,()=>wc_panel(ctx,c3-14,y-31,Math.round(tw(ctx,b,28,700)+28),42,{kind:"chip",role:WC_BADGE,seed:i}));
    wc_T(ctx,b,c3,y,{w:kk>0.5?700:600,size:28,col:kk>0.5?WC_DARK:WC_INK});});});}

/* ---------- 8. elsewhere ---------- */
// three panels, each an industry with its own Linh: a nurse who's a patient, a customer who's a guarantor, an occupant whose account
// holder has gone
const M1_PAN=[[40,"health","a hospital"],[670,"bank","a bank"],[1300,"energy","an energy company"]],M1_PY=96,M1_PW=580,M1_PH=560;
function m1_panel(ctx,i){const [x,ind,title]=M1_PAN[i];wc_panel(ctx,x,M1_PY,M1_PW,M1_PH,{kind:"card",seed:20+i});
  wc_panel(ctx,x+12,M1_PY+12,M1_PW-24,62,{kind:"card",wash:WC_IND[ind],washA:0.62,seed:30+i});wc_T(ctx,title,x+36,M1_PY+55,{w:800,size:32,col:WC_DARK});}
// a role in an industry: a chip in its colour (dashed when the role has gone)
function m1_indChip(ctx,x,y,ind,label,o){o=o||{};const w=Math.round(tw(ctx,label,30,800)+56);wc_chip(ctx,x,y,w,58,WC_IND[ind],label,null,{dashed:o.dashed,seed:label.length});return w;}
// a brick wall, the width of a chip: what keeps the nurse's record and the patient's apart
function m1_wall(ctx,x,y,w){const c=wc_kept("wall"+w,w+20,46,q=>{q.translate(10,10);for(let r=0;r<2;r++)for(let i=-1;i<w/44+1;i++){const bx=i*44+(r?22:0),x0=Math.max(0,bx),x1=Math.min(w,bx+40);if(x1-x0<8)continue;
    wc_wash(q,wc_rect(x0,r*13,x1-x0,11),[196,118,96],{kind:"trim",lw:1,seed:i*3+r,flat:true});}});ctx.drawImage(c,x-10,y-10);}
// the meter on the wall, and a heart, for the occupant who needs the power on
function m1_meter(ctx,x,y){const c=wc_kept("meter",110,140,q=>{q.translate(15,10);wc_wash(q,wc_rrPts(0,0,80,110,10),[206,206,214],{kind:"build",lw:1.6});
    wc_wash(q,wc_ell(40,44,24,24,28),WC_PAPER,{kind:"clock",lw:1.5});q.strokeStyle=rgba(WC_INK,0.9);q.lineWidth=3;q.lineCap="round";q.beginPath();q.moveTo(40,44);q.lineTo(54,30);q.stroke();
    wc_wash(q,wc_rect(18,82,44,14),[90,96,110],{kind:"trim",flat:true});});ctx.drawImage(c,x-15,y-10);}
function m1_heart(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.beginPath();ctx.moveTo(0,8);ctx.bezierCurveTo(-20,-6,-12,-22,0,-12);ctx.bezierCurveTo(12,-22,20,-6,0,8);
  ctx.fillStyle=rgba(WC_ROLE.customer,0.92);ctx.fill();ctx.strokeStyle=rgba(wc_dim(WC_ROLE.customer,0.35),0.9);ctx.lineWidth=1.6/s;ctx.stroke();ctx.restore();}

/* ---------- 9. named once ---------- */
// DAMA's wheel: data governance at the hub, ten knowledge areas round it; only reference and master data is lit and named
const M1_WH=[440,510,290],M1_LITW=3;
function m1_wedge(i,lit){const [cx,cy,r]=M1_WH;return wc_kept("wedge"+i+(lit?"L":""),W,H,q=>{const a0=-Math.PI/2+i*TAU/10+0.025,a1=a0+TAU/10-0.05,pts=[];
  for(let k=0;k<=14;k++){const a=lerp(a0,a1,k/14);pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}for(let k=14;k>=0;k--){const a=lerp(a0,a1,k/14);pts.push([cx+Math.cos(a)*r*0.4,cy+Math.sin(a)*r*0.4]);}
  wc_wash(q,pts,lit?WC_ROLE.student:[[196,192,206],[206,200,190]][i%2],{kind:lit?"build":"chipwash",line:lit,a:lit?0.9:0.7,seed:50+i,lw:1.6});});}
function m1_wheel(ctx,t,t0,tLit){const [cx,cy,r]=M1_WH;for(let i=0;i<10;i++){const p=clamp((t-t0-i*0.09)/0.45,0,1);if(p<=0)continue;const lit=i===M1_LITW?fin(t,tLit,0.5):0;
    withA(ctx,ease(p)*(1-lit),()=>ctx.drawImage(m1_wedge(i,false),0,0));if(lit>0)withA(ctx,lit,()=>ctx.drawImage(m1_wedge(i,true),0,0));}
  const hp=clamp((t-t0)/0.6,0,1);if(hp>0)withA(ctx,hp,()=>{ctx.drawImage(wc_kept("hub",W,H,q=>wc_wash(q,wc_ell(cx,cy,r*0.36,r*0.36,48),WC_CARD,{kind:"page",lw:2,seed:5})),0,0);
    wc_T(ctx,"governance",cx,cy+10,{w:600,size:28,align:"center",col:WC_MUTED});});}
// the four ways to keep master data, small: three systems' records, and where the master record is, if there is one
const M1_STYLES=[["registry","only links"],["consolidation","a copy for analysis"],["coexistence","systems read it back"],["centralised","people created here"]];
const M1_SX=[1060,1480],M1_SY=[132,480];
function m1_arrow(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const ex=lerp(x0,x1,ease(clamp(p,0,1))),ey=lerp(y0,y1,ease(clamp(p,0,1))),an=Math.atan2(y1-y0,x1-x0);ctx.save();
  ctx.strokeStyle=rgba(o.col||WC_INK,0.9);ctx.fillStyle=rgba(o.col||WC_INK,0.9);ctx.lineWidth=o.lw||3;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  const head=(x,y,a)=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-15*Math.cos(a-0.45),y-15*Math.sin(a-0.45));ctx.lineTo(x-15*Math.cos(a+0.45),y-15*Math.sin(a+0.45));ctx.closePath();ctx.fill();};
  if(p>=1){if(o.end!==false)head(x1,y1,an);if(o.start)head(x0,y0,an+Math.PI);}ctx.restore();}
function m1_style(ctx,t,i,t0){const p=clamp((t-t0)/1.1,0,1);if(p<=0)return;const x=M1_SX[i%2],y=M1_SY[i>>1],src=["student","platform","customer"],fx=x+190,fy=y+128;
  arrive(ctx,x+190,y+150,t,t0,()=>{wc_panel(ctx,x,y,380,320,{kind:"card",seed:60+i});
    src.forEach((r,k)=>wc_panel(ctx,x+34+k*112,y+186,90,46,{kind:"chip",role:WC_ROLE[r],seed:k+i}));
    wc_T(ctx,M1_STYLES[i][0],x+190,y+272,{w:800,size:30,align:"center",col:WC_DARK});wc_T(ctx,M1_STYLES[i][1],x+190,y+306,{w:600,size:28,align:"center",col:WC_MUTED});},{dy:14});
  const q=clamp((t-t0-0.4)/0.8,0,1);if(q<=0)return;const xs=src.map((r,k)=>x+79+k*112);
  if(i===0){wc_panel(ctx,x+150,y+34,80,96,{kind:"card",seed:7});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(x+164,y+62+k*24);ctx.lineTo(x+216,y+62+k*24);ctx.stroke();}ctx.restore();
    xs.forEach((sx,k)=>wc_link(ctx,x+190,y+130,sx,y+186,WC_PENCIL,{p:clamp(q*1.5-k*0.2,0,1),vertical:true,a:0.8,lw:2.6}));}
  else{wc_white(ctx,"linh",fx,fy,0.18,m1_bands([1,1,1,1]),{a:ease(q),shadow:false});
    xs.forEach((sx,k)=>{const pk=clamp(q*1.5-k*0.2,0,1);if(i===1)m1_arrow(ctx,sx,y+182,fx+(sx-fx)*0.25,fy+6,pk);else if(i===2)m1_arrow(ctx,sx,y+182,fx+(sx-fx)*0.25,fy+6,pk,{start:true});
      else m1_arrow(ctx,fx+(sx-fx)*0.25,fy+6,sx,y+182,pk);});
    if(i===1){ctx.save();ctx.fillStyle=rgba(WC_ROLEINK.platform,0.85);[[0,30],[16,46],[32,22]].forEach(([dx,hh])=>ctx.fillRect(x+262+dx,y+112-hh,11,hh));ctx.restore();}}}

/* ---------- 10. not only people ---------- */
// the other things a business is about, by industry, each in its industry's colour
const M1_GAL=[["uni","university",["employer","partner university","award","unit","campus","room"]],["health","hospital",["patient","practitioner","ward"]],
  ["bank","bank",["customer","account","counterparty"]],["energy","utility",["meter","connection point","pole"]],["retail","shop",["product","supplier","store"]]];
// the four questions, and three things put to them: a supplier (four yeses), a payment (it happens), a currency code (a list from outside)
const M1_QS=["a thing, not an event?","used by more than one process?","kept in more than one place?","does it matter if they disagree?"];
const M1_EX=[["retail","a supplier",[1,1,1,1],"master it"],[[150,146,160],"a payment",[0],"a transaction"],["bank","a currency code",[1,1,0],"reference data"]];
const M1_QX=[1000,1320,1640],M1_QY=[340,440,540,640];

/* ---------- 11. the series ---------- */
const M1_FILMS=[["One person,","many roles"],["Who is it?"],["Which value wins"],["Roles come","and go"],["Lists everyone","uses"],["For this","purpose only"],["One person,","many systems"],["A hub at work"],["Kept, not","cleaned"]];
function m1_film(ctx,i,here){const x=200+i*190,up=i%2===0,y=up?296:644,w=330,h=140,col=WC_ROLE[["student","platform","customer","tutor","alumna"][i%5]];
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,up?y+h:y);ctx.lineTo(x,540);ctx.stroke();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,540,11,0,TAU);ctx.fill();ctx.restore();
  wc_panel(ctx,x-w/2,y,w,h,{kind:"card",role:col,seed:40+i});wc_T(ctx,"Film "+(i+1),x-w/2+26,y+42,{w:600,size:28,col:WC_MUTED});
  M1_FILMS[i].forEach((l,k)=>wc_T(ctx,l,x-w/2+26,y+84+k*36,{w:800,size:30,col:WC_DARK}));if(here)wc_badge(ctx,x+w/2-26-Math.round(tw(ctx,"here",28,700)+28),y+34,"here");}

/* ---------- 12. once ---------- */
// one field: her email, typed once
function m1_field(ctx,x,y,p){const w=600,h=118;wc_panel(ctx,x,y,w,h,{kind:"card",wash:WC_ROLE.student,washA:0.14});wc_T(ctx,"email",x+28,y+44,{w:600,size:28,col:WC_MUTED});
  const s="linh.nguyen@mail.example",n=typeOn(s,p);wc_T(ctx,n,x+28,y+90,{f:"mono",w:500,size:30,col:WC_DARK});
  if(p<1){const cx=x+28+tw(ctx,n,30,500,"mono")+3;ctx.fillStyle=rgba(WC_DARK,0.8);ctx.fillRect(cx,y+62,3,36);}}
