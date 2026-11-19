/* ===== Rules that let people decide: the university, September to November 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, the corner, the campus and a teaching
   room; and, apart from the scene, a board seen close and a page of a notebook (concepts.js). This file holds what is this film's own
   in them: where the team works, the boards' rows Carmen Vidal and Helena write, and the pages Ivy and Helena keep.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green value or something done, amber a cost or something waiting. */
AG_PLACES.rdTeam=PK.place.team;AG_PLACES.rdCorner=PK.place.corner;AG_PLACES.rdCampus=PK.place.campus;AG_PLACES.rdLecture=PK.place.lecture;
AG_PLACES.rdBoard=PK.place.board;AG_PLACES.rdNotes=c=>PK.place.notes(c,{});
const RD_T=PK.ROOMS.team,RD_CA=PK.ROOMS.campus,RD_CO=PK.ROOMS.corner,RD_LE=PK.ROOMS.lecture;
const rd_hT=fl=>PK.hAt(fl,RD_T.eye),rd_hC=fl=>PK.hAt(fl,RD_CA.eye),rd_hL=fl=>PK.hAt(fl,RD_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const rd_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const rd_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const RD_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const RD_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const RD_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const rd_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function rd_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const RD_DESK={sam:[1230,RD_T.back],jun:[1808,RD_T.back],marta:[560,RD_T.mid]};
function rd_team(x,tt,o){o=o||{};const r={},HB=rd_hT(RD_T.back),HM=rd_hT(RD_T.mid);PK.clock(x,RD_T.clock[0],RD_T.clock[1],RD_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:RD_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),RD_DESK.sam[0],RD_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:RD_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",RD_DESK.jun[0],RD_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:RD_T.mid,i:2,draw:c=>{r.marta=rd_desk(c,o.marta===null?null:(o.deskWho||"marta"),RD_DESK.marta[0],RD_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.rdTeam=(x,tt)=>rd_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const RD_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const rd_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},RD_RB,{h:rd_hT(RD_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const RD_SIDE={x:1690,floor:900},RD_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function rd_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=rd_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||rd_lis(tt,-0.2)),people:[
    {fl:RD_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",RD_SAMC.x,RD_SAMC.floor,rd_hT(RD_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||rd_lis(tt,-0.25)));}},
    {fl:RD_RB.floor,draw:c=>{Jc=rd_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:RD_SIDE.floor,draw:c=>{R2=PK.person(c,o.side||(o.who==="helena"?"ivy":"helena"),RD_SIDE.x,RD_SIDE.floor,rd_hT(RD_SIDE.floor),PK.poseMix("clasp",RD_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||rd_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const RD_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},RD_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const RD_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function rd_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=RD_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(RD_SITH,RD_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,RD_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,RD_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const RD_LE2=PK.ROOMS.lecture;
function rd_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function rd_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){if(!n)continue;const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-10,w,24),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+50,{w:700,size:30,color:U.css(PK.C.ink)});y+=86;}}








/* ---------------------------------------------------------------- the people this film adds: the faculties' timetable officers, and
   Anil, Health's data partner (nobody's likeness; their clothes keep clear of the five colours) */
const RD_FOLK={
  lucy:{key:"rdLucy",name:"Lucy Tran",role:"Timetable officer",skin:[224,186,152],hair:{style:"bun",c:[30,26,28]},top:{kind:"sweater",c:[106,110,80]},bottom:{kind:"trousers",c:[70,70,80]},shoe:[54,46,44]},
  arts:{key:"rdArts",name:"",skin:[120,82,60],hair:{style:"coily",c:[34,28,26]},top:{kind:"sweater",c:[150,122,98]},bottom:{kind:"skirt",c:[90,84,96]},shoe:[58,48,44]},
  business:{key:"rdBusiness",name:"",skin:[214,174,140],hair:{style:"crop",c:[52,44,40]},glasses:[54,50,48],top:{kind:"jacket",c:[112,108,100],inner:[226,228,230]},bottom:{kind:"trousers",c:[70,72,80]},shoe:[46,40,40]},
  health:{key:"rdHealth",name:"",skin:[196,146,112],hair:{style:"long",c:[44,34,30]},top:{kind:"jacket",c:[96,98,104],inner:[236,236,232]},bottom:{kind:"trousers",c:[66,66,74]},shoe:[50,44,44]},
  anil:{key:"rdAnil",name:"Anil",role:"Data partner",skin:[176,124,92],hair:{style:"short",c:[30,26,24]},beard:[40,34,30],top:{kind:"sweater",c:[120,128,140]},bottom:{kind:"trousers",c:[64,66,78]},shoe:[50,44,40]}};
const rd_row=w=>typeof w==="string"?(RD_FOLK[w]||PK.CAST[w]):w;

/* ---------------------------------------------------------------- the boards (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Yusuf's, Carmen's and Helena's are drawn as a designer would, a graphic recording pinned over the
   board, almost done when it first shows (PK.sk.drawn): whoever explains adds the last words and marks as the voice says them, on
   from left to right, and steps clear. */
// a graphic recording in two drawn parts: its heading, high on the sheet, where nobody standing at the board hides it, and the drawing
// under it, with the box its ink lies in, so whoever explains steps only as far right as it reaches
const rd_rec=(title,o,draw,box)=>[PK.sk.drawn(c=>PK.sk.head(c,title,o),[40,36,1210,150]),PK.sk.drawn(draw,box)];
// a rule's number, a sticker on the top left corner of its panel
const rd_num=(c,n,x,y)=>{const D=PK.sk;D.disc(c,x+6,y+6,26,{fill:"blue",col:"ink",w:3});D.text(c,String(n),x+6,y+17,{size:32,w:700,align:"center"});};
// 1. Yusuf's first list (Yusuf, at the team's board): eleven rules, the question asked of each, and the three needed now; he writes
// the question and how many
const rd_boardA=(sc,w)=>[...rd_rec("Eleven rules?",{},c=>{const D=PK.sk;
    D.panel(c,70,150,380,300,{title:"the first list",col:"blue",fill:"blue"},(cc,x,y)=>{for(let i=0;i<11;i++){const bx=x+30+(i%6)*54,by=y+14+Math.floor(i/6)*66;
        D.box(cc,bx,by,42,52,{fill:"white",col:"ink",w:2.5,r:6});D.line(cc,[[bx+9,by+18],[bx+33,by+18]],{col:"mut",w:2.5,seed:i+1});D.line(cc,[[bx+9,by+33],[bx+27,by+33]],{col:"mut",w:2.5,seed:i+5});}
      D.text(cc,"against past mistakes",x+30,y+190,{size:28,col:"mut"});});
    D.panel(c,480,150,380,300,{title:"of each, ask",col:"amber",fill:"amber"},(cc,x,y)=>D.icon(cc,"q",x+56,y+46,30,{fill:"white"}));
    D.panel(c,890,150,290,300,{title:"needed now",col:"green",fill:"green"},(cc,x,y)=>{for(let i=0;i<3;i++)D.box(cc,x+40+i*76,y+14,56,66,{fill:"white",col:"green",w:3,r:8});});},[60,150,1190,456]),
  {s:"what goes wrong",x:510,y:340,size:40,w:700,col:"amber",at:w("ask","what goes wrong",-0.3),d:0.9},
  {s:"here, now, without it?",x:510,y:406,size:32,w:700,at:w("ask","without it",-0.3),d:1.0},
  {s:"three",x:1035,y:410,size:60,w:700,col:"green",align:"center",at:w("three","Three",-0.2),d:0.6}];
// 2. the three rules, each with its reason (Yusuf, at the board seen close): one meaning for room use, the product's promise, and a
// new measure asked of its owner; he writes what each rule holds
const rd_boardB=(sc,w)=>[...rd_rec("Three rules",{},c=>{const D=PK.sk;
    D.panel(c,70,150,340,300,{title:"one meaning",col:"blue",fill:"blue"},(cc,x,y)=>{D.icon(cc,"book",x+50,y+44,28,{fill:"white"});D.text(cc,"room use",x+92,y+56,{size:34,w:700});
      for(let i=0;i<8;i++)D.box(cc,x+30+i*36,y+86,28,28,{fill:i<5?"orange":"white",col:"ink",w:2.5,r:5});
      D.text(cc,"share of hours counted",x+30,y+152,{size:28,col:"mut"});});
    rd_num(c,1,70,150);
    D.panel(c,440,150,350,300,{title:"the promise",col:"green",fill:"green"},(cc,x,y)=>{D.icon(cc,"door",x+56,y+44,26,{fill:"white"});D.icon(cc,"clock",x+136,y+44,26,{fill:"white"});
      D.icon(cc,"person",x+276,y+44,28,{fill:"white"});D.line(cc,[[x+250,y+18],[x+302,y+70]],{col:"amber",w:5,seed:3});D.line(cc,[[x+302,y+18],[x+250,y+70]],{col:"amber",w:5,seed:4});
      D.text(cc,"per room, per hour",x+30,y+124,{size:30});});
    rd_num(c,2,440,150);
    D.panel(c,820,150,360,300,{title:"new measures",col:"orange",fill:"orange"},(cc,x,y)=>{D.face(cc,"ivy",x+70,y+46,30);D.text(cc,"its owner",x+124,y+60,{size:30});
      D.icon(cc,"doc",x+310,y+46,24,{fill:"white"});D.text(cc,"written down first",x+30,y+144,{size:28,col:"mut"});});
    rd_num(c,3,820,150);},[44,124,1190,456]),
  {s:"means one thing",x:100,y:430,size:38,w:700,col:"blue",at:w("r1","means one thing",-0.3),d:1.0},
  {s:"never a person",x:770,y:430,size:38,w:700,col:"green",align:"right",at:w("r2","never a person",-0.3),d:0.9},
  {s:"ask Ivy first",x:1160,y:430,size:38,w:700,col:"blue",align:"right",at:w("r3","ask its owner",-0.3),d:0.9}];
// 3. Ostrom (Carmen, at the team's board): the commons people shared for centuries, and what the ones that lasted had; she writes how
// long, ticks each as the voice comes to it, and writes who made them
const rd_boardC=(sc,w)=>[...rd_rec("Elinor Ostrom",{ref:["Governing the Commons","1990"],rsize:32,rx:1010},c=>{const D=PK.sk;
    D.panel(c,70,150,400,300,{title:"commons",col:"green",fill:"green"},(cc,x,y)=>{[["anchor","fish"],["tree","forests"],["drop","water"]].forEach(([ic,s],i)=>{const cx=x+70+i*130;
        D.icon(cc,ic,cx,y+44,28,{fill:"white"});D.text(cc,s,cx,y+102,{size:28,align:"center"});});
      D.arrow(cc,[x+30,y+146],[x+370,y+146],{col:"mut",w:3.5,head:14});});
    D.panel(c,500,150,680,300,{title:"the ones that lasted",col:"blue",fill:"blue"},(cc,x,y)=>[["a few clear rules","blue"],["fitted to the place","orange"],["made and changed by","green"]].forEach(([s,col],i)=>{const by=y+38+i*58;
        D.disc(cc,x+40,by-11,12,{fill:col,col:"ink",w:2.5});D.text(cc,s,x+66,by,{size:34});}));},[60,150,1190,456]),
  {s:"shared for centuries",x:100,y:430,size:36,w:700,col:"green",at:w("ostrom","for centuries",-0.4),d:0.9},
  {k:"tick",x:842,y:237,r:18,col:"green",at:w("lasted","a few clear rules",0.3),d:0.25},
  {k:"tick",x:866,y:295,r:18,col:"green",at:w("lasted","fitted to the place",0.3),d:0.25},
  {s:"the people who live by them",x:566,y:426,size:36,w:700,col:"green",at:w("lasted","the people",-0.3),d:1.2}];
// 4. data mesh and Team Topologies (Carmen): decisions with the people who know the work, on a platform that makes the hard parts easy
const rd_boardD=(sc,w)=>[...rd_rec("Decisions near the work",{ref:["Data mesh","Team Topologies"],rsize:32},c=>{const D=PK.sk;
    D.panel(c,70,150,520,300,{title:"decisions",col:"green",fill:"green"},(cc,x,y)=>{[RD_FOLK.lucy,RD_FOLK.arts,RD_FOLK.business,RD_FOLK.health].forEach((p,i)=>D.face(cc,p,x+75+i*105,y+48,28));
      D.text(cc,"the faculties decide their classes",x+30,y+150,{size:28,col:"mut"});});
    D.panel(c,620,150,560,300,{title:"a platform",col:"blue",fill:"blue"},(cc,x,y)=>{[["gear","orange"],["db","orange"],["shield","blue"],["lock","blue"]].forEach(([ic,f],i)=>D.icon(cc,ic,x+90+i*120,y+42,26,{fill:f}));
      D.box(cc,x+40,y+92,480,34,{fill:"blue",col:"ink",w:3,r:8});D.text(cc,"the team keeps it",x+40,y+166,{size:28,col:"mut"});});},[60,150,1190,456]),
  {s:"with who knows the work",x:100,y:430,size:40,w:700,col:"green",at:w("mesh","decisions with",-0.3),d:1.4},
  {s:"makes the hard parts easy",x:1160,y:430,size:40,w:700,col:"blue",align:"right",at:w("mesh","a platform",-0.2),d:1.2}];
// 5. the fourth rule (Helena, at the team's board): the live page, because copies go stale, and the date in the template's corner
const rd_boardE=(sc,w)=>[...rd_rec("A fourth rule",{},c=>{const D=PK.sk;
    D.panel(c,70,150,310,300,{title:"the live page",col:"blue",fill:"blue"},(cc,x,y)=>{D.icon(cc,"laptop",x+70,y+46,32,{fill:"white"});D.disc(cc,x+132,y+28,9,{fill:"green",col:"ink",w:2});
      D.text(cc,"on the platform",x+30,y+130,{size:28,col:"mut"});});
    rd_num(c,4,70,150);
    D.panel(c,410,150,350,300,{title:"because",col:"amber",fill:"amber"},(cc,x,y)=>{D.icon(cc,"doc",x+56,y+46,28,{fill:"white"});D.text(cc,"three weeks old",x+100,y+58,{size:28});
      D.text(cc,"two planned from it",x+30,y+130,{size:28,col:"mut"});});
    D.panel(c,790,150,390,300,{title:"the template",col:"green",fill:"green"},(cc,x,y)=>{D.box(cc,x+40,y+10,170,120,{fill:"white",col:"ink",w:2.5,r:6});
      for(let i=0;i<3;i++)D.line(cc,[[x+60,y+52+i*26],[x+150-i*20,y+52+i*26]],{col:"mut",w:2.5,seed:i+2});
      D.box(cc,x+164,y+18,38,24,{fill:"green",col:"green",w:2.5,r:4});D.arrow(cc,[x+300,y+90],[x+214,y+34],{col:"green",w:3.5,head:14,bow:-20});});},[44,124,1190,456]),
  {s:"not a copy",x:100,y:430,size:38,w:700,col:"blue",at:w("rule4","not a copy",-0.3),d:0.7},
  {s:"copies go stale",x:440,y:430,size:38,w:700,col:"amber",at:w("rule4","copies go stale",-0.3),d:0.8},
  {s:"the date, in the corner",x:1160,y:430,size:34,w:700,col:"green",align:"right",at:w("date","the date",-0.3),d:1.0}];
// 6. on Monday (Helena, at the board seen close): four rules and room to decide, and four of the five steps; she ticks each at the
// board's right edge as the voice comes to it, and writes the fifth
const RD_MON=[["few rules, each with its reason","m1","few rules"],["the right way, the easy way","m2","right way"],["say who decides what","m3","who decides"],["watch what emerges, and learn","m4","Watch"]];
const rd_boardM=(sc,w)=>[...rd_rec("On Monday",{},c=>{const D=PK.sk;
    D.panel(c,70,140,380,300,{title:"four rules",col:"blue",fill:"blue"},(cc,x,y)=>{for(let i=0;i<4;i++){const cx=x+70+i*80;D.disc(cc,cx,y+30,24,{fill:"blue",col:"ink",w:3});
        D.text(cc,String(i+1),cx,y+41,{size:30,w:700,align:"center"});D.icon(cc,"building",cx,y+120,24,{fill:"green"});}
      D.caps(cc,"room to decide",x+190,y+210,{align:"center",size:28,col:"green"});});
    RD_MON.forEach(([s],i)=>{const y=180+i*74;D.disc(c,512,y-12,24,{fill:["blue","green","orange","amber"][i],col:"ink",w:3});D.text(c,String(i+1),512,y-1,{size:30,w:700,align:"center"});D.text(c,s,556,y,{size:34});});},[60,140,1080,450]),
  ...RD_MON.map(([,id,word],i)=>({k:"tick",x:1150,y:166+i*74,r:18,col:"green",at:w(id,word,0.3),d:0.3})),
  {s:"add a rule only for a real problem",x:1180,y:470,size:38,w:700,col:"blue",align:"right",at:w("m5","add a rule",-0.2),d:1.4}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page.
   The farmer's book is written plainly; Helena's are sketched pages, almost done, and the pen adds the last words. */
// 1. the temples' calendar (a farmer's book)
const rd_note1=(sc,w)=>[
  {s:"The temple's calendar",x:70,y:124,size:68,w:760,col:"blue",at:w("temple","calendar",-0.4),d:0.9,marks:[["under","blue",null,0.3]]},
  {s:"who plants first, who follows",x:110,y:250,size:50,at:w("temple","who plants first",-0.3),d:1.2},
  {s:"in turns: water shared",x:110,y:360,size:52,col:"green",at:w("turns","in turns",-0.3),d:1.0},
  {s:"empty together: pests go hungry",x:110,y:470,size:46,col:"green",at:w("rest","empty together",-0.3),d:1.3}];
// 2. every decision, one door (Helena): the four faculties' questions all coming to her door, and the room reports waiting; the pen
// adds what she saw
const rd_note2=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"One door",86,124,{size:76,col:"amber"});
    [150,270,390,510].forEach((x,i)=>{D.icon(c,"building",x,250,30,{fill:"white"});D.arrow(c,[x,292],[310+i*14,394],{col:"ink",w:3,head:12,bow:(i-1.5)*6});});
    D.icon(c,"door",330,440,40,{fill:"amber"});D.face(c,"helena",440,440,34);
    D.dots(c,650,236,9,3,{gap:30,r:9,on:27,col:"orange"});D.text(c,"27 room reports",640,344,{size:30,col:"mut"});
    D.icon(c,"hourglass",660,394,18,{fill:"amber"});D.text(c,"two weeks waiting",690,404,{size:30,col:"mut"});},[60,40,1040,800]),
  {s:"whose rooms first: me",x:500,y:466,size:36,w:700,at:w("helena","she chose",-0.3),d:1.0},
  {s:"every room decision, through us",x:110,y:590,size:46,w:700,col:"amber",at:w("centre","Every room decision",-0.3),d:1.3},
  {s:"those who know the courses wait",x:110,y:700,size:44,w:700,at:w("knew","were waiting",-0.6),d:1.3}];
// 3. Helena's job now: every decision through her before, the faculties deciding now while she watches, and the room reports made
// by hand; the pen adds what her job is now
const rd_note3=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"My job now",86,124,{size:76});
    D.panel(c,100,170,280,290,{title:"before",col:"amber",fill:"amber"},(cc,x,y)=>{D.face(cc,"helena",x+140,y+96,34);
      [[x+36,y+20],[x+244,y+20],[x+36,y+176],[x+244,y+176]].forEach(([ax,ay])=>D.arrow(cc,[ax,ay],[x+140+(ax<x+140?-50:50),y+96+(ay<y+96?-30:40)],{col:"amber",w:3,head:12}));});
    D.panel(c,410,170,280,290,{title:"now",col:"green",fill:"green"},(cc,x,y)=>{D.icon(cc,"eye",x+140,y+40,28,{fill:"white"});
      for(let i=0;i<4;i++){const bx=x+50+i*60;D.icon(cc,"sprout",bx,y+116,16,{fill:"green"});D.icon(cc,"building",bx,y+170,22,{fill:"white"});}});
    D.panel(c,720,170,260,290,{title:"by hand",col:"orange",fill:"orange"},(cc,x,y)=>D.bars(cc,x+30,y+60,200,126,[{v:27,col:"amber",top:"27",label:"before"},{v:0,col:"green",top:"0",label:"now"}],{size:28}));},[60,40,1040,800]),
  {s:"less deciding",x:110,y:570,size:52,w:700,at:w("role","less deciding",-0.3),d:0.7},
  {s:"watch what emerges",x:110,y:660,size:52,w:700,col:"green",at:w("role","watching what emerged",-0.3),d:0.9},
  {s:"ask what it taught",x:110,y:750,size:52,w:700,col:"green",at:w("role","asking what it taught",-0.3),d:0.9}];
