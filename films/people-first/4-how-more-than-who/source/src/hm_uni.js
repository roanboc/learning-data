/* ===== How, more than who: the university, February and March 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows that Carmen Vidal, Jun and Helena write, and the pages Helena keeps.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.hmTeam=PK.place.team;AG_PLACES.hmCorner=PK.place.corner;AG_PLACES.hmCampus=PK.place.campus;AG_PLACES.hmLecture=PK.place.lecture;
AG_PLACES.hmBoard=PK.place.board;AG_PLACES.hmNotes=c=>PK.place.notes(c,{});
const HM_T=PK.ROOMS.team,HM_CA=PK.ROOMS.campus,HM_CO=PK.ROOMS.corner,HM_LE=PK.ROOMS.lecture;
const hm_hT=fl=>PK.hAt(fl,HM_T.eye),hm_hC=fl=>PK.hAt(fl,HM_CA.eye),hm_hL=fl=>PK.hAt(fl,HM_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const hm_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const hm_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const HM_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const HM_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const HM_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const hm_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const HM_DESK={sam:[1230,HM_T.back],jun:[1808,HM_T.back],marta:[560,HM_T.mid]};
function hm_team(x,tt,o){o=o||{};const r={},HB=hm_hT(HM_T.back),HM=hm_hT(HM_T.mid);PK.clock(x,HM_T.clock[0],HM_T.clock[1],HM_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:HM_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:"sam",HM_DESK.sam[0],HM_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:HM_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",HM_DESK.jun[0],HM_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:HM_T.mid,i:2,draw:c=>{r.marta=PK.atDesk(c,o.marta===null?null:"marta",HM_DESK.marta[0],HM_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.hmTeam=(x,tt)=>hm_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const HM_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const hm_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},HM_RB,{h:hm_hT(HM_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const HM_SIDE={x:1690,floor:900},HM_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function hm_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=hm_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||hm_lis(tt,-0.2)),people:[
    {fl:HM_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",HM_SAMC.x,HM_SAMC.floor,hm_hT(HM_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||hm_lis(tt,-0.25)));}},
    {fl:HM_RB.floor,draw:c=>{Jc=hm_roomBoard(c,tt,o.rows||[],"carmen",{say:o.say,events:o.events});}},
    {fl:HM_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",HM_SIDE.x,HM_SIDE.floor,hm_hT(HM_SIDE.floor),PK.poseMix("clasp",HM_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||hm_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const HM_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},HM_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const HM_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function hm_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=HM_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(HM_SITH,HM_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,HM_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=PK.person(x,"helena",hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,HM_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}

/* ---------------------------------------------------------------- the boards, as a graphic recording on a sheet pinned over the board
   In the board's own px (1250 by 524): drawn already when it first shows (PK.sk.drawn), and whoever explains adds the last words, a
   tick, a ring or a cross as the voice says them. PK.pace makes a row wait until they can have walked to it, so the last words go on
   from left to right, and nothing is drawn back along words. A board in the team's room (Jun's and Helena's) is the same sheet,
   seen small. */
// a drawing in a ring with words after it: (x, y) the words' baseline at their left, the ring before them
const hm_item=(c,x,y,ic,s,o)=>{const D=PK.sk;o=o||{};const r=o.r||22;D.disc(c,x-r-14,y-11,r,{fill:"white",col:"ink",w:3});D.icon(c,ic,x-r-14,y-11,r*0.64,{fill:o.fill||"blue"});
  if(s)D.text(c,s,x,y,{size:o.size||34,w:o.w,col:o.col});};
// 1. what one company's study of its own teams found (Carmen): a balance, who is on a team against how it works, tipped to how; and the
// top of the study's list, three cards. She writes how many teams, then less and more under the pans, and ticks each card as it is named
const HM_TOP=[["shield","Psychological safety"],["hand","Keeping your word"],["people","Clear on who does what"]];
const hmA_y=i=>196+i*94;
function hm_sheetA(c){const D=PK.sk;
  D.head(c,"How a team works",{col:"blue",ref:["One company's study",["of its own teams",{size:30}]],rsize:30,rx:1030,ry:84});
  D.scale(c,330,250,360,{l:"who",r:"how",tilt:-0.7,size:34});
  D.caps(c,"Top of its list",640,170,{col:"blue",size:30});
  HM_TOP.forEach(([ic,s],i)=>D.card(c,640,hmA_y(i),{icon:ic,ifill:"blue",lines:[s],fill:"paper",w:470,h:78,size:34}));}
const hm_boardA=(sc,w)=>{const tick=(i,at)=>({k:"tick",x:1150,y:hmA_y(i)+39,r:16,col:"blue",at,d:0.3});return[PK.sk.drawn(hm_sheetA),
  {s:"180 teams",x:110,y:178,size:44,w:700,col:"blue",at:w("google","studied",-0.3),d:0.8},
  {s:"less",x:152,y:384,size:42,w:700,col:"amber",align:"center",at:w("quote","less about who",-0.2),d:0.5},
  {s:"more",x:508,y:436,size:42,w:700,col:"green",align:"center",at:w("quote","more about how",-0.2),d:0.5},
  tick(0,w("safe","psychological",-0.3)),tick(1,w("word","keeping",-0.3)),tick(2,w("word","clear",-0.3))];};
// 2. two numbers for one day (Jun, at the team's board): census day on its calendar; the old report and the new model one over the
// other, each with who made it; and the two as bars, side by side. He rings the day and writes each one's number as the voice says
// it, all at the sheet's left, so he never stands in front of Sam's desk
function hm_sheetB(c){const D=PK.sk;
  D.head(c,"Census day, last year",{col:"blue",ref:["Wednesday 24 February",["Jun's check",{size:30}]],rsize:30,rx:1010,ry:84});
  D.icon(c,"cal",96,186,26,{fill:"blue"});D.text(c,"counted for the government",158,198,{size:32,col:"mut"});
  [[236,"Old report","doc","tomas"],[356,"New model","db","jun"]].forEach(([y,t,ic,who])=>{D.box(c,56,y,660,108,{fill:"paper",col:"ink",w:3,r:14});
    D.disc(c,108,y+54,34,{fill:"white",col:"ink",w:3});D.icon(c,ic,108,y+54,21,{fill:"orange"});D.text(c,t,160,y+66,{size:34,w:700,col:"blue"});
    D.face(c,who,656,y+50,30,{});D.line(c,[[396,y+90],[600,y+90]],{col:"mut",w:2.5,dash:[8,10],seed:y});});
  D.panel(c,760,140,434,332,{fill:"paper",line:"ink",title:"Side by side",col:"blue"},(cc,x,y)=>{
    D.bars(cc,x+70,y+16,290,170,[{v:18412,col:"orange",label:"report"},{v:19549,col:"orange",label:"model"}],{max:20000});});}
const hm_boardB=(sc,w)=>[PK.sk.drawn(hm_sheetB),
  {k:"ring",x:96,y:186,rx:44,ry:40,col:"blue",at:w("check","census day",-0.2),d:0.4},
  {s:"18,412",x:400,y:318,size:56,w:700,col:"orange",at:w("differ","old report",-0.2),d:0.8},
  {s:"19,549",x:400,y:438,size:56,w:700,col:"orange",at:w("differ","new model",-0.2),d:0.8}];
// 3. conflict in a team (Carmen): a pile of studies; about the person, two turned on each other, the work going down; about the work,
// two over the same page, the work holding up. She writes how many studies, what each does, and the condition
function hm_sheetC(c){const D=PK.sk;
  D.head(c,"Conflict in a team",{col:"blue"});
  for(let i=0;i<3;i++)D.icon(c,"doc",104+i*16,196-i*10,24,{fill:"white"});
  D.panel(c,56,236,520,236,{fill:"amber",line:"amber",title:"About the person",col:"amber",dash:[10,8]},(cc,x,y)=>{
    D.face(cc,PK.extra(2),x+70,y+52,32,{});D.icon(cc,"bolt",x+150,y+48,22,{fill:"amber"});D.face(cc,PK.extra(7),x+230,y+52,32,{});
    D.trend(cc,x+320,y+6,160,84,[[0,0.85],[0.35,0.7],[0.7,0.35],[1,0.1]],{col:"amber"});});
  D.panel(c,620,132,574,340,{fill:"green",line:"green",title:"About the work",col:"green"},(cc,x,y)=>{
    D.face(cc,PK.extra(4),x+70,y+56,34,{});D.icon(cc,"doc",x+160,y+50,24,{fill:"green"});D.face(cc,PK.extra(11),x+250,y+56,34,{});
    D.trend(cc,x+350,y+8,180,92,[[0,0.4],[0.4,0.55],[0.7,0.6],[1,0.8]],{col:"green"});});}
const hm_boardC=(sc,w)=>[PK.sk.drawn(hm_sheetC),
  {s:"116 studies",x:184,y:200,size:44,w:700,col:"blue",at:w("study","studies",-0.3),d:0.9},
  {s:"harms the work",x:84,y:450,size:42,w:700,col:"amber",at:w("study","about the person",-0.2),d:1.0},
  {s:"need not",x:650,y:378,size:48,w:700,col:"green",at:w("study","Disagreement",-0.2),d:0.7},
  {s:"if it stays about the work",x:650,y:450,size:38,w:700,at:w("study","if it stays",-0.2),d:1.2}];
// 4. three things, each of us (Helena, at the team's board): the three as cards joined by arrows, and the eight of the team at the
// foot; she ticks each card as the voice says it
const HM_3=[["eye","What you saw"],["heart",["What you feel","and need"]],["speech","What you ask"]];
const hmD_x=i=>56+i*384;
function hm_sheetD(c){const D=PK.sk;
  D.head(c,"Three things",{col:"blue",ref:["Wednesday 24 February",["Jun first, then Tomás",{size:30}]],rsize:30,rx:1010,ry:84});
  HM_3.forEach(([ic,s],i)=>{const x=hmD_x(i);D.box(c,x,142,334,192,{fill:"blue",col:"blue",w:3,r:16});D.disc(c,x+167,196,36,{fill:"white",col:"ink",w:3});D.icon(c,ic,x+167,196,22,{fill:"blue"});
    if(Array.isArray(s))D.lines(c,s,x+167,268,{size:34,w:700,align:"center",lh:1.12});else D.text(c,s,x+167,290,{size:34,w:700,align:"center"});
    if(i<2)D.arrow(c,[x+340,238],[x+378,238],{col:"blue",w:4,head:12});});
  D.faces(c,110,418,["helena","sam","jun","marta","noor","yusuf","erin","tomas"],{r:26,gap:74});
  D.caps(c,"A turn each",700,428,{col:"mut",size:30});}
const hm_boardD=(sc,w)=>{const tick=(i,at)=>({k:"tick",x:hmD_x(i)+296,y:172,r:16,col:"green",at,d:0.3});return[PK.sk.drawn(hm_sheetD),
  tick(0,w("ask","what you saw",-0.2)),tick(1,w("ask","feel",-0.4)),tick(2,w("ask","what you ask",-0.2))];};
// 5. where the three things come from (Carmen): the three in rings; what it rests on, three cards, the last struck out. She writes what
// the rings are, ticks practice and small studies, strikes out large trials, and writes the last words at the foot
function hm_sheetE(c){const D=PK.sk;
  D.head(c,"Non-violent communication",{col:"blue",ref:["Marshall Rosenberg",["a psychologist",{size:30}]],rsize:30,rx:1040,ry:84});
  [["eye","saw"],["heart","feel, need"],["speech","ask"]].forEach(([ic,s],i)=>{const cx=110+i*150;D.disc(c,cx,236,44,{fill:"white",col:"ink",w:3});D.icon(c,ic,cx,236,27,{fill:"blue"});
    D.text(c,s,cx,320,{size:30,align:"center",col:"mut"});});
  D.caps(c,"It rests on",560,170,{col:"blue",size:30});
  D.card(c,560,190,{icon:"hand",ifill:"green",lines:["practice"],fill:"paper",w:400,h:70,size:34});
  D.card(c,560,272,{icon:"doc",ifill:"green",lines:["small studies"],fill:"paper",w:400,h:70,size:34});
  D.card(c,560,354,{icon:"bars",ifill:"amber",lines:["large trials"],fill:"paper",col:"amber",dash:[10,8],w:400,h:70,size:34});}
const hm_boardE=(sc,w)=>[PK.sk.drawn(hm_sheetE),
  {s:"the three things",x:70,y:400,size:40,w:700,col:"blue",at:w("named","communication",-0.9),d:1.0},
  {k:"tick",x:1000,y:225,r:16,col:"green",at:w("practice","practice",-0.3),d:0.3},
  {k:"tick",x:1000,y:307,r:16,col:"green",at:w("practice","small studies",-0.3),d:0.3},
  {k:"line",x:600,y:394,x1:800,y1:382,col:"amber",at:w("practice","large trials",-0.3),d:0.4},
  {s:"feelings are there anyway",x:560,y:466,size:38,w:700,col:"green",at:w("practice","feelings",-0.3),d:1.2}];
// 6. what each number counts (Helena writes as Marta says it): the old report and the new model, what each counts, and the two as
// rounds, one inside the other; she writes each number, the people on short courses, and that both are right
function hm_sheetF(c){const D=PK.sk;
  D.head(c,"What each number counts",{col:"blue",ref:["Census day",["last year",{size:30}]],rsize:30,rx:1060,ry:84});
  D.panel(c,56,140,410,332,{fill:"paper",line:"ink",title:"Old report",col:"blue"},(cc,x,y)=>{D.icon(cc,"doc",x+56,y+38,24,{fill:"orange"});D.text(cc,"students",x+96,y+50,{size:38,w:700,col:"blue"});
    hm_item(cc,x+84,y+186,"book","a degree's units",{size:30,r:18});hm_item(cc,x+84,y+240,"building","to the government",{size:30,r:18});});
  D.panel(c,494,140,410,332,{fill:"paper",line:"ink",title:"New model",col:"blue"},(cc,x,y)=>{D.icon(cc,"db",x+56,y+38,24,{fill:"orange"});D.text(cc,"learners",x+96,y+50,{size:38,w:700,col:"blue"});
    D.text(cc,"students, and",x+40,y+186,{size:30,col:"mut"});});
  D.disc(c,1060,262,108,{fill:"blue",col:"ink",w:3});D.disc(c,1036,280,74,{fill:[176,204,236],col:"ink",w:3});
  D.text(c,"students",1036,290,{size:30,w:700,align:"center"});}
const hm_boardF=(sc,w)=>[PK.sk.drawn(hm_sheetF),
  {s:"18,412",x:96,y:326,size:56,w:700,col:"orange",at:w("students","counts students",-0.2),d:0.8},
  {k:"tick",x:420,y:376,r:16,col:"blue",at:w("students","units",-0.3),d:0.3},
  {s:"19,549",x:534,y:326,size:56,w:700,col:"orange",at:w("learners","learners",-0.3),d:0.8},
  {s:"1,137 short courses",x:534,y:442,size:36,w:700,col:"orange",at:w("learners","short courses",-0.6),d:1.2},
  {s:"Both right",x:1060,y:452,size:44,w:700,col:"green",align:"center",at:w("both","Both",-0.2),d:0.8,marks:[["under","green",null,0.3]]}];
// 7. what the best groups had (Carmen): small groups, each at many kinds of task; the cleverest member's share, one bar towards the top;
// turns to speak, the bars even. She rings the best group, strikes out the cleverest, and writes what it went with
function hm_sheetG(c){const D=PK.sk;
  D.head(c,"Collective intelligence",{col:"blue",ref:["Anita Woolley",["and colleagues",{size:30}]],rsize:30,rx:1040,ry:84});
  D.panel(c,56,140,330,332,{fill:"paper",line:"ink",title:"Small groups",col:"blue"},(cc,x,y)=>{
    ["puzzle","pen","bulb","gear"].forEach((ic,i)=>D.icon(cc,ic,x+62+i*68,y+26,20,{fill:"blue"}));
    for(let g=0;g<3;g++)for(let k=0;k<3;k++)D.icon(cc,"person",x+70+k*48,y+90+g*58,16,{fill:g===1?"green":"white"});});
  D.panel(c,412,140,370,332,{fill:"amber",line:"amber",title:"The cleverest",col:"amber",dash:[10,8]},(cc,x,y)=>{
    D.bars(cc,x+40,y+14,290,170,[{v:0.3,col:"amber"},{v:1,col:"amber"},{v:0.35,col:"amber"},{v:0.4,col:"amber"}],{});});
  D.panel(c,808,140,386,332,{fill:"green",line:"green",title:"Turns to speak",col:"green"},(cc,x,y)=>{
    D.bars(cc,x+40,y+14,300,140,[{v:0.8,col:"green"},{v:0.86,col:"green"},{v:0.76,col:"green"},{v:0.82,col:"green"}],{max:1});
    D.icon(cc,"chat",x+193,y+192,22,{fill:"green"});});}
const hm_boardG=(sc,w)=>[PK.sk.drawn(hm_sheetG),
  {k:"ring",x:174,y:346,rx:96,ry:36,col:"green",at:w("groups","best groups",-0.3),d:0.5},
  {s:"best",x:284,y:358,size:36,w:700,col:"green",at:w("groups","best groups",0.3),d:0.5},
  {k:"line",x:752,y:212,x1:440,y1:396,col:"amber",at:w("turns","clever",-0.3),d:0.5},
  {s:"more equal",x:840,y:452,size:44,w:700,col:"green",at:w("turns","taking turns",-0.3),d:0.8}];
// 8. the team's page (Helena writes what the eight agree): its five lines drawn as strips, each with its drawing and its heading, the
// eight of them at the top; she writes each line's own words as the voice says them
const HM_PAGE=[["clock","How we meet"],["hand","Asking for help"],["chat","Disagreeing"],["check","Deciding"],["cal","A date we can't make"]];
const hmH_y=i=>176+i*62;
function hm_sheetH(c){const D=PK.sk;
  D.head(c,"How we work together",{col:"blue",sub:["Five lines, in our own words","mut"]});
  D.faces(c,756,86,["helena","sam","jun","marta","noor","yusuf","erin","tomas"],{r:20,gap:54});
  HM_PAGE.forEach(([ic,s],i)=>{const y=hmH_y(i);D.box(c,56,y,1138,56,{fill:"blue",col:"blue",w:2.5,r:12});D.disc(c,90,y+28,20,{fill:"white",col:"ink",w:2.5});
    D.icon(c,ic,90,y+28,12,{fill:"blue"});D.text(c,s,124,y+40,{size:32,w:700});});}
const hm_boardH=(sc,w)=>{const r=(i,s,at,d,col)=>({s,x:500,y:hmH_y(i)+40,size:34,w:700,col:col||"blue",at,d});return[PK.sk.drawn(hm_sheetH),
  r(0,"the question the day before, a turn each",w("meet","question",-0.3),1.6),
  r(1,"early, and out loud",w("help","early",-0.3),1.0),
  r(2,"about the work, never the person",w("disagree","about the work",-0.3),1.5),
  r(3,"whoever owns it, after hearing all",w("decide","whoever owns",-0.3),1.5),
  r(4,"as soon as we know, with a new date",w("date","as soon",-0.3),1.5,"green")];};
// 9. what holds the page up (Carmen): trust, from many studies; a team charter, from 32 student teams, the ones whose work held up
// coloured; and a note of how sure that is. She writes what each found, and how small the last study is
function hm_sheetI(c){const D=PK.sk;
  D.head(c,"What holds the page up",{col:"green"});
  D.panel(c,56,140,340,332,{fill:"green",line:"green",title:"Trust",col:"green"},(cc,x,y)=>{
    D.bars(cc,x+60,y+12,220,120,[{v:0.45,col:"amber",label:"low"},{v:0.92,col:"green",label:"high"}],{});});
  D.panel(c,424,140,400,332,{fill:"blue",line:"blue",title:"A team charter",col:"blue"},(cc,x,y)=>{
    D.icon(cc,"doc",x+64,y+50,30,{fill:"blue"});D.text(cc,"32 student teams",x+112,y+62,{size:30,col:"mut"});
    D.dots(cc,x+60,y+96,8,4,{gap:34,r:10,on:9,col:"green"});});
  D.sticky(c,852,150,330,300,{col:"sun",rot:0.03,draw:(cc,x,y)=>{D.caps(cc,"How sure",x+26,y+64,{col:"amber",size:30});D.icon(cc,"q",x+262,y+52,18,{fill:"amber"});}});}
const hm_boardI=(sc,w)=>[PK.sk.drawn(hm_sheetI),
  {s:"112 studies",x:84,y:406,size:34,w:700,at:w("trust","studies",-0.3),d:0.8},
  {s:"better work",x:84,y:458,size:40,w:700,col:"green",at:w("trust","trust each other",-0.3),d:0.9},
  {s:"+ a good plan",x:452,y:452,size:42,w:700,col:"blue",at:w("charter","held up",-0.6),d:1.0},
  {s:"one small study",x:880,y:300,size:36,w:700,col:"amber",at:w("small","small study",-0.3),d:1.1},
  {s:"from practice",x:880,y:380,size:36,w:700,col:"blue",at:w("small","practice",-0.3),d:0.9}];

/* ---------------------------------------------------------------- Helena's notebook: what she keeps (the page's own px)
   Each page is sketched already, a heading on a highlighter's band, boxes with drawings and the people's portraits (PK.sk.drawn);
   her pen adds the last words and ticks, each as the voice says it, one stroke after the other (PK.pace(ctx, null, rows)). Nothing is
   below y 800 of the page, where the captions are. */
const HM_PAGEBOX=[PK.SK.page.x,PK.SK.page.y,PK.SK.page.x+PK.SK.page.w,PK.SK.page.y+PK.SK.page.h];
// the gorge and its bridge, sketched in a box (x, y, w, h): the two rock walls, the river below, the bridge between them with its two
// hand ropes, and a few people on each bank
const hm_gorgeSk=(c,x,y,w,h,o)=>{const D=PK.sk;o=o||{};const L=x+w*0.3,R=x+w*0.7,top=y+h*0.34,bot=y+h,rock=[214,196,170],rope=[150,110,60];
  D.line(c,[[x,top],[L,top],[L+w*0.05,y+h*0.66],[L+w*0.02,bot],[x,bot]],{fill:rock,col:"ink",w:3,close:true,seed:3});
  D.line(c,[[x+w,top],[R,top],[R-w*0.05,y+h*0.62],[R-w*0.02,bot],[x+w,bot]],{fill:rock,col:"ink",w:3,close:true,seed:5});
  D.line(c,[[L+w*0.04,bot-h*0.08],[x+w*0.43,bot-h*0.12],[x+w*0.5,bot-h*0.06],[x+w*0.57,bot-h*0.11],[R-w*0.04,bot-h*0.08]],{col:"blue",w:4,seed:7});
  const sag=(u,d)=>top+d+Math.sin(Math.PI*u)*h*0.16,at=(u,d)=>[L+(R-L)*u,sag(u,d)],run=d=>Array.from({length:9},(_,i)=>at(i/8,d));
  for(let i=1;i<8;i++)D.line(c,[at(i/8,-h*0.13),at(i/8,0)],{col:rope,w:2,seed:13+i});
  D.line(c,run(0),{col:rope,w:5,seed:9});D.line(c,run(-h*0.13),{col:rope,w:3,seed:11});
  for(const [px,f] of[[x+w*0.08,"white"],[x+w*0.16,"blue"],[x+w*0.84,"white"],[x+w*0.92,"green"]])D.icon(c,"person",px,top-h*0.1,h*0.07,{fill:f});
  if(o.houses)for(const [px,f] of[[x+w*0.06,"amber"],[x+w*0.2,"blue"],[x+w*0.8,"green"],[x+w*0.94,"orange"]])D.icon(c,"house",px,y+h*0.1,h*0.08,{fill:f});};
// 1. what the gorge shares: the bridge and its four communities; no plan, but promises kept and parts that everyone knows
function hm_page1(c){const D=PK.sk;
  D.title(c,"At the gorge",80,132,{size:84,col:"blue"});
  D.panel(c,74,176,926,316,{fill:"paper",line:"ink",title:"Every June, four communities",col:"blue"},(cc,x,y,w,h)=>hm_gorgeSk(cc,x+40,y+4,w-80,h-20,{houses:true}));
  D.disc(c,124,560,34,{fill:"white",col:"ink",w:3});D.icon(c,"doc",124,560,21,{fill:"amber"});
  D.box(c,74,622,440,170,{fill:"green",col:"green",w:3,r:16});D.disc(c,140,680,34,{fill:"white",col:"ink",w:3});D.icon(c,"hand",140,680,21,{fill:"green"});
  D.box(c,560,622,440,170,{fill:"green",col:"green",w:3,r:16});D.disc(c,626,680,34,{fill:"white",col:"ink",w:3});D.icon(c,"people",626,680,21,{fill:"green"});}
const hm_note1=(sc,w)=>[PK.sk.drawn(hm_page1,HM_PAGEBOX),
  {k:"cross",x:124,y:560,r:40,col:"amber",at:w("how","Nobody",-0.4),d:0.4},
  {s:"no plan handed out",x:186,y:576,size:50,w:700,col:"amber",at:w("how","plan",-0.4),d:0.9},
  {s:"promises kept",x:196,y:696,size:46,w:700,col:"green",at:w("how","promises kept",-0.3),d:0.8},
  {s:"parts everyone",x:682,y:696,size:44,w:700,col:"green",at:w("how","parts",-0.2),d:0.8},{s:"knows",x:682,y:760,size:44,w:700,col:"green",at:w("how","parts",0.6),d:0.4}];
// 2. both, from custom, and said out loud: the gorge, where custom keeps them; a data team, where somebody says them
function hm_page2(c){const D=PK.sk;
  D.title(c,"Promises and parts",80,132,{size:76,col:"blue"});
  D.panel(c,74,180,440,420,{fill:"blue",line:"blue",title:"The gorge",col:"blue"},(cc,x,y,w,h)=>hm_gorgeSk(cc,x+30,y+10,w-60,220,{}));
  D.panel(c,560,180,440,420,{fill:"green",line:"green",title:"A data team",col:"green"},(cc,x,y)=>{
    D.faces(cc,x+80,y+60,["helena","jun","tomas"],{r:36,gap:110});D.disc(cc,x+220,y+190,34,{fill:"white",col:"ink",w:3});D.icon(cc,"speech",x+220,y+190,21,{fill:"green"});});
  D.sticky(c,140,640,760,150,{col:"sun",rot:-0.015,draw:(cc,x,y)=>{hm_item(cc,x+96,y+70,"hand","keeping your word",{size:36,r:22});hm_item(cc,x+96,y+124,"people","who does what",{size:36,r:22});}});}
const hm_note2=(sc,w)=>[PK.sk.drawn(hm_page2,HM_PAGEBOX),
  {s:"from custom",x:110,y:560,size:52,w:700,col:"blue",at:w("gorge","custom",-0.5),d:0.7},
  {s:"say it out loud",x:596,y:560,size:52,w:700,col:"green",at:w("gorge","out loud",-0.6),d:1.0,marks:[["under","green",null,0.3]]}];
// 3. the glossary first: the two words and the owner who says what they mean; the pen writes what each counts, then the model
function hm_page3(c){const D=PK.sk;
  D.title(c,"The glossary first",80,132,{size:80,col:"blue"});
  D.icon(c,"book",860,104,30,{fill:"blue"});
  D.panel(c,74,176,926,380,{fill:"paper",line:"blue",title:"Glossary",col:"blue"},(cc,x,y)=>{
    for(const [k,s] of[[0,"students"],[1,"learners"]]){const yy=y+86+k*130;D.text(cc,s,x+50,yy,{size:44,w:700,col:"blue"});D.line(cc,[[x+50,yy+66],[x+860,yy+66]],{col:"mut",w:2.5,dash:[8,10],seed:k+3});}});
  D.stamp(c,["Registrar's office",["owns what they mean",{size:30}]],816,236,{col:"blue",size:32,rot:0.05});
  D.arrow(c,[300,586],[300,660],{col:"blue",w:4,head:14});
  D.card(c,74,676,{icon:"db",ifill:"orange",lines:["the model"],fill:"orange",w:420,h:110,size:44});}
const hm_note3=(sc,w)=>[PK.sk.drawn(hm_page3,HM_PAGEBOX),
  {s:"a degree's units",x:126,y:378,size:44,w:700,at:w("glossary","each word counts",-0.3),d:0.9},
  {s:"students + short courses",x:126,y:508,size:44,w:700,at:w("glossary","each word counts",0.5),d:1.1},
  {s:"before a line changes",x:520,y:746,size:44,w:700,col:"green",at:w("glossary","before",-0.3),d:1.0,marks:[["under","green",null,0.3]]}];
// 4. passed on by doing it, at the gorge; a team has no such years, so it writes
function hm_page4(c){const D=PK.sk;
  D.title(c,"Passed on",80,132,{size:84,col:"blue"});
  D.panel(c,74,176,440,420,{fill:"blue",line:"blue",title:"The gorge, by doing",col:"blue"},(cc,x,y)=>{
    D.face(cc,HMQ_FOLK.m5,x+120,y+70,52,{});D.face(cc,HMV_BOY,x+300,y+90,40,{});D.face(cc,HMQ_FOLK.w2,x+120,y+210,52,{});D.face(cc,HMV_KID2,x+300,y+230,40,{});});
  D.panel(c,560,176,440,420,{fill:"amber",line:"amber",title:"A team",col:"amber",dash:[10,8]},(cc,x,y)=>{
    D.faces(cc,x+90,y+80,["jun","marta","noor"],{r:34,gap:120});D.icon(cc,"hourglass",x+220,y+230,34,{fill:"amber"});});
  D.disc(c,124,700,40,{fill:"white",col:"ink",w:3});D.icon(c,"pen",124,700,25,{fill:"green"});}
const hm_note4=(sc,w)=>[PK.sk.drawn(hm_page4,HM_PAGEBOX),
  {s:"parents beside children",x:96,y:572,size:36,w:700,at:w("gorge","parents",-0.2),d:1.1},
  {s:"no such years",x:600,y:570,size:46,w:700,col:"amber",at:w("gorge","no such years",-0.3),d:0.9},
  {s:"So it writes",x:190,y:722,size:72,w:700,col:"green",at:w("gorge","writes",-0.3),d:0.6,marks:[["ring","green",null]]}];
// 5. what a data team has to do itself: ask each person; and never leave what it knows with one person, or one line of people
function hm_page5(c){const D=PK.sk;
  D.title(c,"A data team",80,132,{size:88,col:"blue"});
  D.panel(c,74,176,926,264,{fill:"green",line:"green",title:"Each person",col:"green"},(cc,x,y)=>{
    D.faces(cc,x+86,y+64,["helena","sam","jun","marta","noor","yusuf","erin","tomas"],{r:34,gap:108});});
  D.panel(c,74,470,926,330,{fill:"amber",line:"amber",title:"What it knows, never with",col:"amber",dash:[10,8]},(cc,x,y)=>{
    D.icon(cc,"person",x+110,y+66,30,{fill:"white"});D.icon(cc,"book",x+176,y+80,20,{fill:"amber"});
    for(let i=0;i<4;i++){D.icon(cc,"person",x+430+i*100,y+66,26,{fill:"white"});if(i<3)D.arrow(cc,[x+462+i*100,y+66],[x+500+i*100,y+66],{col:"ink",w:3,head:10});}});}
const hm_note5=(sc,w)=>[PK.sk.drawn(hm_page5,HM_PAGEBOX),
  {s:"asks each one",x:110,y:400,size:50,w:700,col:"green",at:w("each","ask each person",-0.2),d:0.9,marks:[["under","green",null,0.3]]},
  {k:"cross",x:206,y:600,r:62,col:"amber",at:w("each","one person",-0.3),d:0.4},
  {k:"line",x:470,y:646,x1:840,y1:548,col:"amber",at:w("each","one line",-0.3),d:0.4},
  {s:"one person, or one line",x:110,y:760,size:50,w:700,col:"amber",at:w("each","one line",0.3),d:1.1}];
// 6. on Monday: three cards, each with its drawing and its heading; the pen writes what to do under each
function hm_page6(c){const D=PK.sk;
  D.title(c,"On Monday",80,132,{size:88,col:"blue"});D.icon(c,"cal",580,104,30,{fill:"blue"});
  [[190,"blue","chat","Disagree"],[386,"amber","warn","When it turns to the person"],[582,"green","hand","Small promises"]].forEach(([y,f,ic,s])=>{
    D.box(c,74,y,926,176,{fill:f,col:f,w:3,r:16});D.disc(c,140,y+58,34,{fill:"white",col:"ink",w:3});D.icon(c,ic,140,y+58,21,{fill:f});D.caps(c,s,196,y+70,{col:f,size:32});});}
const hm_note6=(sc,w)=>[PK.sk.drawn(hm_page6,HM_PAGEBOX),
  {s:"about the work, in the open",x:196,y:332,size:50,w:700,at:w("open","Disagree",0),d:1.2},
  {s:"stop, and say so",x:196,y:528,size:50,w:700,col:"amber",at:w("open","stop",0),d:1.0},
  {s:"keep them; say early",x:196,y:724,size:50,w:700,col:"green",at:w("keep","small promises",0),d:1.1}];
