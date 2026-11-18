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


/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524)
   Each row has the time the voice says it; PK.pace makes a row wait until whoever writes can have walked to it, so they are laid out
   for someone who walks: on from left to right, a row's parts written along it, and nothing drawn back along words. */

/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524)
   Each row has the time the voice says it; PK.pace makes a row wait until whoever writes can have walked to it, so they are laid out
   for someone who walks: on from left to right, a row's parts written along it, and nothing drawn back along words. */
// 1. what one study of 180 teams found (Carmen)
const hm_boardA=(sc,w)=>[
  {s:"One study of its own teams",x:70,y:104,size:58,col:"blue",at:w("google","studied",-0.3),d:1.0},
  {s:"Less who is on it",x:70,y:196,size:50,col:"amber",at:w("quote","less about who",-0.2),d:0.8},{s:" · more how it works",size:50,col:"green",at:w("quote","more about how",-0.2),d:1.0},
  {s:"1 Psychological safety",x:70,y:288,size:48,at:w("safe","psychological",-0.3),d:0.9},
  {s:"2 Keeping your word",x:70,y:366,size:48,at:w("word","keeping",-0.3),d:0.8},
  {s:"3 Clear on who does what",x:70,y:444,size:48,at:w("word","clear",-0.3),d:1.0}];
// 2. two numbers for one day (Jun, at the team's board)
const hm_boardB=(sc,w)=>[
  {s:"Census day, last year",x:70,y:104,size:58,col:"blue",at:w("check","census day",-0.2),d:1.0},
  {s:"Old report: 18,412",x:70,y:204,size:54,col:"orange",at:w("differ","old report",-0.2),d:0.9},
  {s:"New model: 19,549",x:70,y:300,size:54,col:"orange",at:w("differ","new model",-0.2),d:0.9}];
// 3. conflict about the person, and about the work (Carmen)
const hm_boardC=(sc,w)=>[
  {s:"Conflict in a team: many studies",x:70,y:110,size:54,col:"blue",at:w("study","studies",-0.3),d:1.1},
  {s:"About the person: harms the work",x:70,y:220,size:52,col:"amber",at:w("study","about the person",-0.2),d:1.2},
  {s:"About the work: need not",x:70,y:320,size:52,col:"green",at:w("study","Disagreement",-0.2),d:1.0},
  {s:"if it stays about the work",x:70,y:410,size:46,at:w("study","if it stays",-0.2),d:1.0}];
// 4. three things, each of us (Helena, at the team's board)
const hm_boardD=(sc,w)=>[
  {s:"Three things, each of us",x:70,y:110,size:58,col:"blue",at:w("ask","three things",-0.3),d:1.0},
  {s:"1 What you saw",x:70,y:206,size:50,at:w("ask","what you saw",-0.2),d:0.7},
  {s:"2 What you feel and need",x:70,y:292,size:50,at:w("ask","feel",-0.4),d:0.9},
  {s:"3 What you ask",x:70,y:378,size:50,at:w("ask","what you ask",-0.2),d:0.7}];
// 5. where the three things come from (Carmen)
const hm_boardE=(sc,w)=>[
  {s:"Non-violent communication",x:70,y:110,size:58,col:"blue",at:w("named","communication",-0.9),d:1.1},
  {s:"Marshall Rosenberg, a psychologist",x:70,y:200,size:46,at:w("named","Marshall",-0.2),d:1.2},
  {s:"Practice and small studies",x:70,y:296,size:48,col:"amber",at:w("practice","practice",-0.3),d:0.9},{s:" · no large trials",size:48,col:"amber",at:w("practice","large trials",-0.3),d:0.8},
  {s:"Named, a feeling can be answered",x:70,y:400,size:48,col:"green",at:w("answer","named",-0.3),d:1.2}];
// 6. what each number counts (Helena writes as Marta says it)
const hm_boardF=(sc,w)=>[
  {s:"Students: 18,412",x:70,y:104,size:54,col:"blue",at:w("students","counts students",-0.2),d:0.9},
  {s:"taking a degree's units · sent to the government",x:70,y:184,size:40,at:w("students","units",-0.3),d:1.6},
  {s:"Learners: 19,549",x:70,y:282,size:54,col:"blue",at:w("learners","learners",-0.3),d:0.9},
  {s:"students, and 1,137 on short courses",x:70,y:362,size:44,at:w("learners","short courses",-0.6),d:1.4},
  {s:"Both right · never the same thing",x:70,y:452,size:48,col:"green",at:w("both","Both",-0.2),d:1.2}];
// 7. what the best groups had (Carmen)
const hm_boardG=(sc,w)=>[
  {s:"Collective intelligence",x:70,y:110,size:58,col:"blue",at:w("groups","collective intelligence",-0.3),d:1.0},
  {s:"Anita Woolley and colleagues",x:70,y:200,size:46,at:w("groups","Anita Woolley",-0.2),d:1.1},
  {s:"Not how clever the cleverest is",x:70,y:300,size:48,col:"amber",at:w("turns","clever",-0.3),d:1.2},
  {s:"Turns to speak, more equal",x:70,y:396,size:50,col:"green",at:w("turns","taking turns",-0.3),d:1.1}];
// 8. the team's page (Helena writes what the eight agree)
const hm_boardH=(sc,w)=>[
  {s:"How we work together",x:70,y:96,size:54,col:"blue",at:w("thu","how we work together",-0.3),d:0.9},
  {s:"Meet: the question the day before, a turn each",x:70,y:176,size:40,at:w("meet","question",-0.3),d:1.6},
  {s:"Ask for help: early, out loud",x:70,y:250,size:40,at:w("help","early",-0.3),d:1.0},
  {s:"Disagree: about the work, never the person",x:70,y:324,size:40,at:w("disagree","about the work",-0.3),d:1.5},
  {s:"Decide: whoever owns it, after hearing all",x:70,y:398,size:40,at:w("decide","whoever owns",-0.3),d:1.5},
  {s:"Can't make a date: say so, with a new one",x:70,y:472,size:40,col:"green",at:w("date","as soon",-0.3),d:1.5}];
// 9. what holds the page up (Carmen)
const hm_boardI=(sc,w)=>[
  {s:"Trust: better work",x:70,y:110,size:58,col:"green",at:w("trust","trust each other",-0.3),d:0.9},
  {s:"A team charter",x:70,y:214,size:54,col:"blue",at:w("charter","team charter",-0.3),d:0.8},
  {s:"with a good plan: work that held up",x:70,y:304,size:46,at:w("charter","held up",-0.6),d:1.3},
  {s:"One small study · from practice",x:70,y:404,size:48,col:"amber",at:w("small","small study",-0.3),d:1.2}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. what the gorge shares
const hm_note1=(sc,w)=>[
  {s:"At the gorge",x:70,y:124,size:88,w:700,col:"blue",at:w("how","Nobody",-0.4),d:0.6,marks:[["under","blue",null,0.3]]},
  {s:"No plan handed out",x:110,y:280,size:58,col:"amber",at:w("how","plan",-0.4),d:0.9},
  {s:"Promises kept",x:110,y:400,size:62,col:"green",at:w("how","promises kept",-0.3),d:0.8},
  {s:"Parts that everyone knows",x:110,y:520,size:58,col:"green",at:w("how","parts",-0.2),d:1.0}];
// 2. say it out loud
const hm_note2=(sc,w)=>[
  {s:"The gorge: custom",x:70,y:124,size:76,w:800,col:"blue",at:w("gorge","custom",-0.5),d:0.7},
  {s:"A team: say it out loud",x:110,y:280,size:64,col:"green",at:w("gorge","out loud",-0.6),d:1.0,marks:[["under","green",null,0.3]]}];
// 3. the glossary first
const hm_note3=(sc,w)=>[
  {s:"The glossary first",x:70,y:124,size:80,w:800,col:"blue",at:w("glossary","glossary",-0.4),d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"what students counts",x:110,y:280,size:56,at:w("glossary","each word counts",-0.3),d:0.9},
  {s:"what learners counts",x:110,y:380,size:56,at:w("glossary","each word counts",0.5),d:0.9},
  {s:"then the model",x:110,y:500,size:60,col:"green",at:w("glossary","model",-0.3),d:0.7}];
// 4. a team has no such years
const hm_note4=(sc,w)=>[
  {s:"The gorge: by doing",x:70,y:124,size:76,w:800,col:"blue",at:w("gorge","by doing",-0.4),d:0.8},
  {s:"parents beside children",x:110,y:262,size:56,at:w("gorge","parents",-0.2),d:1.0},
  {s:"A team: no such years",x:110,y:392,size:60,col:"amber",at:w("gorge","no such years",-0.3),d:1.0},
  {s:"So it writes",x:110,y:522,size:72,col:"green",at:w("gorge","writes",-0.3),d:0.5,marks:[["ring","green",null]]}];
// 5. what a data team has to do itself
const hm_note5=(sc,w)=>[
  {s:"A data team",x:70,y:124,size:88,w:700,col:"blue",at:w("each","data team",-0.3),d:0.6,marks:[["under","blue",null,0.3]]},
  {s:"Asks each person",x:110,y:280,size:60,col:"green",at:w("each","ask each person",-0.2),d:0.9},
  {s:"Never one person, or one line",x:110,y:410,size:56,col:"amber",at:w("each","one person",-0.3),d:1.1}];
// 6. on Monday
const hm_note6=(sc,w)=>{const dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:w("open","Disagree",-0.9),d:0.6,marks:[["under","blue",null,0.3]]},
  dot(262,"blue",w("open","Disagree",-0.3)),{s:"Disagree about the work, openly",x:128,y:262,size:50,at:w("open","Disagree",0),d:1.2},
  dot(382,"amber",w("open","stop",-0.3)),{s:"When it turns personal: stop, say so",x:128,y:382,size:48,at:w("open","stop",0),d:1.3},
  dot(502,"blue",w("keep","small promises",-0.3)),{s:"Keep small promises, say early",x:128,y:502,size:50,at:w("keep","small promises",0),d:1.2}];};
