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

/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 1. Yusuf's first list, and the question asked of each rule (Yusuf, at the team's board)
const rd_boardA=(sc,w)=>[
  {s:"Eleven rules?",x:70,y:120,size:62,col:"blue",at:w("eleven","first list",-0.3),d:0.8},
  {s:"what goes wrong here, now, without it?",x:110,y:250,size:44,at:w("ask","what goes wrong",-0.3),d:1.6},
  {s:"three needed now",x:520,y:400,size:56,col:"green",at:w("three","Three",-0.2),d:0.9}];
// 2. the three rules, each with its reason (Yusuf, at the board seen close)
const rd_boardB=(sc,w)=>[
  {s:"1 · room use means one thing",x:70,y:130,size:48,col:"blue",at:w("r1","room use means",-0.3),d:1.3},
  {s:"2 · per room per hour, never a person",x:110,y:270,size:44,col:"blue",at:w("r2","counts per room",-0.3),d:1.6},
  {s:"3 · a new measure: ask Ivy first",x:150,y:410,size:46,col:"blue",at:w("r3","new measure",-0.3),d:1.4}];
// 3. Ostrom (Carmen, at the team's board)
const rd_boardC=(sc,w)=>[
  {s:"Elinor Ostrom",x:70,y:120,size:62,col:"blue",at:w("ostrom","Elinor Ostrom",-0.3),d:0.8},
  {s:"shared for centuries",x:110,y:230,size:50,at:w("ostrom","for centuries",-0.4),d:0.9},
  {s:"a few clear rules · fitted to the place",x:150,y:340,size:44,col:"green",at:w("lasted","a few clear rules",-0.3),d:1.5},
  {s:"made by those who live by them",x:300,y:450,size:44,col:"green",at:w("lasted","made and changed",-0.3),d:1.3}];
// 4. data mesh and Team Topologies (Carmen)
const rd_boardD=(sc,w)=>[
  {s:"Data mesh · Team Topologies",x:70,y:130,size:52,col:"blue",at:w("mesh","Data mesh",-0.3),d:1.2},
  {s:"decisions with who knows the work",x:110,y:280,size:46,col:"green",at:w("mesh","decisions with",-0.3),d:1.4},
  {s:"a platform that makes it easy",x:300,y:420,size:46,at:w("mesh","a platform",-0.3),d:1.2}];
// 5. the fourth rule (Helena, at the team's board)
const rd_boardE=(sc,w)=>[
  {s:"4 · share the live page, not a copy",x:70,y:130,size:46,col:"blue",at:w("rule4","share the live page",-0.3),d:1.4},
  {s:"copies go stale",x:400,y:250,size:52,col:"amber",at:w("rule4","copies go stale",-0.3),d:0.8},
  {s:"the date of its data, in the corner",x:110,y:380,size:44,at:w("date","the date",-0.3),d:1.4}];
// 6. on Monday (Helena, at the board seen close)
const rd_boardM=(sc,w)=>[
  {s:"On Monday",x:70,y:110,size:64,col:"blue",at:w("m1","On Monday",0),d:0.6},
  {s:"few rules · each with its reason",x:110,y:205,size:44,col:"blue",at:w("m1","few rules",-0.2),d:1.2},
  {s:"the right way, the easy way",x:150,y:285,size:44,at:w("m2","right way",-0.2),d:1.1},
  {s:"say who decides what",x:190,y:365,size:44,col:"blue",at:w("m3","who decides",-0.2),d:0.9},
  {s:"watch what emerges · learn",x:230,y:445,size:44,col:"green",at:w("m4","Watch",-0.2),d:1.1}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. the temples' calendar (a farmer's book)
const rd_note1=(sc,w)=>[
  {s:"The temple's calendar",x:70,y:124,size:68,w:760,col:"blue",at:w("temple","calendar",-0.4),d:0.9,marks:[["under","blue",null,0.3]]},
  {s:"who plants first, who follows",x:110,y:250,size:50,at:w("temple","who plants first",-0.3),d:1.2},
  {s:"in turns: water shared",x:110,y:360,size:52,col:"green",at:w("turns","in turns",-0.3),d:1.0},
  {s:"empty together: pests go hungry",x:110,y:470,size:46,col:"green",at:w("rest","empty together",-0.3),d:1.3}];
// 2. every decision, one door (Helena)
const rd_note2=(sc,w)=>[
  {s:"One door",x:70,y:124,size:80,w:760,col:"amber",at:w("helena","saw more",-0.3),d:0.5,marks:[["under","amber",null,0.3]]},
  {s:"whose rooms first: me",x:110,y:250,size:54,at:w("helena","she chose",-0.3),d:1.0},
  {s:"every room decision, through us",x:110,y:360,size:48,col:"amber",at:w("centre","Every room decision",-0.3),d:1.3},
  {s:"those who know the courses wait",x:110,y:470,size:46,at:w("knew","were waiting",-0.6),d:1.3}];
// 3. Helena's job now
const rd_note3=(sc,w)=>[
  {s:"My job now",x:70,y:124,size:80,w:760,col:"blue",at:w("role","job changed",-0.3),d:0.5,marks:[["under","blue",null,0.3]]},
  {s:"less deciding",x:110,y:250,size:56,at:w("role","less deciding",-0.3),d:0.7},
  {s:"watch what emerges",x:110,y:360,size:56,col:"green",at:w("role","watching what emerged",-0.3),d:0.9},
  {s:"ask what it taught",x:110,y:470,size:56,col:"green",at:w("role","asking what it taught",-0.3),d:0.9}];
