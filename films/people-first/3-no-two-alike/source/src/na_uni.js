/* ===== No two alike: the university, February 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the seven work, Marta's requests on her screen, the boards' rows that Carmen Vidal and Helena write,
   the pages Helena keeps, and the five questions Helena sends. Every time comes from the voice: sc is the chapter, w a word's time in
   a line. Colour means what it means in the module: blue a plan or a rule, orange data, green something done or of value, amber what
   the work asks, a risk or what isn't so. */
AG_PLACES.naTeam=PK.place.team;AG_PLACES.naCorner=PK.place.corner;AG_PLACES.naCampus=PK.place.campus;AG_PLACES.naLecture=PK.place.lecture;
AG_PLACES.naBoard=PK.place.board;AG_PLACES.naNotes=c=>PK.place.notes(c,{});
const NA_T=PK.ROOMS.team,NA_CA=PK.ROOMS.campus,NA_CO=PK.ROOMS.corner,NA_LE=PK.ROOMS.lecture;
const na_hT=fl=>PK.hAt(fl,NA_T.eye),na_hC=fl=>PK.hAt(fl,NA_CA.eye),na_hL=fl=>PK.hAt(fl,NA_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const na_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const na_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const NA_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const NA_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const NA_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const na_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const NA_DESK={sam:[1230,NA_T.back],jun:[1808,NA_T.back],marta:[560,NA_T.mid]};
function na_team(x,tt,o){o=o||{};const r={},HB=na_hT(NA_T.back),HM=na_hT(NA_T.mid);PK.clock(x,NA_T.clock[0],NA_T.clock[1],NA_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:NA_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:"sam",NA_DESK.sam[0],NA_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:NA_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",NA_DESK.jun[0],NA_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:NA_T.mid,i:2,draw:c=>{r.marta=PK.atDesk(c,o.marta===null?null:"marta",NA_DESK.marta[0],NA_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.naTeam=(x,tt)=>na_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const NA_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const na_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},NA_RB,{h:na_hT(NA_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const NA_SIDE={x:1690,floor:900},NA_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function na_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=na_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||na_lis(tt,-0.2)),people:[
    {fl:NA_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",NA_SAMC.x,NA_SAMC.floor,na_hT(NA_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||na_lis(tt,-0.25)));}},
    {fl:NA_RB.floor,draw:c=>{Jc=na_roomBoard(c,tt,o.rows||[],"carmen",{say:o.say,events:o.events});}},
    {fl:NA_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",NA_SIDE.x,NA_SIDE.floor,na_hT(NA_SIDE.floor),PK.poseMix("clasp",NA_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||na_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const NA_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},NA_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const NA_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function na_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=NA_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(NA_SITH,NA_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,NA_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=PK.person(x,"helena",hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,NA_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}


/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524)
   Each row has the time the voice says it; PK.pace makes a row wait until whoever writes can have walked to it, so they are laid out
   for someone who walks: on from left to right, a row's parts written along it, and nothing drawn back along words. */
// 1. the plan for two weeks (Helena, at the team's board, on Monday)
const na_boardP=(sc,w)=>[
  {s:"Next two weeks",x:70,y:104,size:62,col:"blue",at:w("plan","next two weeks",-0.3),d:0.8},
  {s:"Week 1: library numbers · fees",x:70,y:196,size:48,at:w("quiet","whole hour",-0.2),d:1.2},
  {s:"Week 2: platform upgrade · new login",x:70,y:280,size:48,at:w("guess","reads",-0.2),d:1.4}];
// 2. five broad traits, each a scale (Carmen)
const na_boardA=(sc,w)=>[
  {s:"Five broad traits",x:70,y:104,size:62,col:"blue",at:w("how","five broad traits",-0.2),d:0.8},{s:" · the Big Five",size:48,col:"mut",at:w("how","Big Five",-0.4),d:0.7},
  {s:"Open to new things",x:70,y:196,size:48,at:w("five","open",-0.3),d:0.7},{s:" · organised",size:48,at:w("five","organised",-0.3),d:0.5},{s:" · outgoing",size:48,at:w("five","outgoing",-0.3),d:0.5},
  {s:"Agreeable",x:70,y:276,size:48,at:w("five","agreeable",-0.4),d:0.5},{s:" · steady under pressure",size:48,at:w("five","steady",-0.3),d:0.9},
  {s:"Each a scale, not a box: by degree",x:70,y:380,size:52,col:"green",at:w("scale","scale",-0.3),d:1.2,marks:[["under","green",null,0.3]]}];
// 3. for understanding, never for assessing (Carmen)
const na_boardB=(sc,w)=>[
  {s:"Traits: to understand",x:70,y:120,size:58,col:"green",at:w("never","understanding",-0.4),d:0.9},{s:" · never to assess",size:58,col:"amber",at:w("never","never",-0.3),d:0.8},
  {s:"How someone is doing:",x:70,y:240,size:52,col:"blue",at:w("outcomes","How someone",-0.2),d:0.9},
  {s:"the results of their work",x:70,y:330,size:52,at:w("outcomes","results",-0.4),d:0.9},{s:" · how the team works",size:52,at:w("outcomes","team works",-0.4),d:0.9}];
// 4. a type, and how often it holds (Carmen)
const na_boardC=(sc,w)=>[
  {s:"A type: a scale, cut in two",x:70,y:104,size:58,col:"blue",at:w("type","scale",-0.4),d:1.0},
  {s:"one side, one label · the other, another",x:70,y:188,size:44,at:w("type","One side",-0.2),d:1.3},
  {s:"Most people: near the middle",x:70,y:272,size:50,col:"amber",at:w("middle","middle",-0.6),d:0.9},
  {s:"Took it twice: 4 in 10, the same type",x:70,y:356,size:48,at:w("again","twice",-0.3),d:1.3},
  {s:"Near the cut: a small change, a new label",x:70,y:446,size:46,col:"amber",at:w("steady","near the cut",-0.3),d:1.3}];
// 5. Helena's yes, and her four rules (at the team's board); the three the test's own makers ask for, lit green
const na_boardR=(sc,w)=>{const m=w("makers","three",-0.2);return[
  {s:"Yes, to start talking. Four rules:",x:70,y:104,size:54,col:"blue",at:w("yes","start talking",-0.3),d:1.1},
  {s:"1 Each person's choice",x:70,y:188,size:48,at:w("rules1","choice",-0.4),d:0.8,marks:[["hl","green",m]]},
  {s:"2 Your results are yours",x:70,y:266,size:48,at:w("rules1","results",-0.4),d:0.8,marks:[["hl","green",m+0.4]]},
  {s:"3 Degrees, not boxes",x:70,y:344,size:48,at:w("rules2","degrees",-0.4),d:0.8},
  {s:"4 Never to hire, hand out work or judge",x:70,y:422,size:46,at:w("rules2","never",-0.3),d:1.3,marks:[["hl","green",m+0.8]]}];};
// 6. the page, shared (Helena)
const na_boardS=(sc,w)=>[
  {s:"How I work: shared, 7 of 7",x:70,y:120,size:58,col:"green",at:w("friday","all seven",-0.3),d:1.0},
  {s:"2 left a heading out: theirs to leave",x:70,y:220,size:48,at:w("friday","Two left",-0.3),d:1.2}];
// 7. the meeting's new steps (Helena)
const na_boardM=(sc,w)=>[
  {s:"Our meetings, from 22 Feb",x:70,y:104,size:58,col:"blue",at:w("ways1","Monday",-0.3),d:0.9},
  {s:"1 The question, the working day before",x:70,y:192,size:46,at:w("ways1","question",-0.3),d:1.3},
  {s:"2 Two minutes writing, before anyone talks",x:70,y:270,size:46,at:w("ways2","two minutes",-0.4),d:1.3},
  {s:"3 Then a turn each",x:70,y:348,size:46,at:w("ways2","turn",-0.6),d:0.7},
  {s:"4 Add until the end of the next day",x:70,y:426,size:46,at:w("ways3","add",-0.3),d:1.2}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. a data team, read like the school
const na_note1=(sc,w)=>[
  {s:"A data team",x:70,y:124,size:88,w:700,col:"blue",at:w("each","Find",-0.4),d:0.6,marks:[["under","blue",null,0.3]]},
  {s:"Find out how each one works",x:110,y:290,size:58,col:"green",at:w("each","how each",-0.2),d:1.1},
  {s:"The team hears what each knows",x:110,y:420,size:56,at:w("each","hears",-0.3),d:1.1,marks:[["hl","green"]]}];
// 2. what Helena can do that the teacher didn't need to
const na_note2=(sc,w)=>[
  {s:"Lu: years to know each one",x:70,y:124,size:66,w:900,col:"blue",at:w("known","years",-0.6),d:1.0},
  {s:"Me: two weeks",x:110,y:262,size:62,col:"amber",at:w("known","two weeks",-0.4),d:0.7},
  {s:"A person can say how they work",x:110,y:400,size:56,at:w("say","say",-0.4),d:1.1},
  {s:"So: ask",x:110,y:530,size:72,col:"green",at:w("say","asks",-0.3),d:0.5,marks:[["ring","green",null]]}];
// 3. people move along their scales
const na_note3=(sc,w)=>[
  {s:"People move",x:70,y:124,size:88,w:700,col:"blue",at:w("days","Nobody",-0.4),d:0.6,marks:[["under","blue",null,0.3]]},
  {s:"2 or 3 weeks: nearly every level",x:110,y:262,size:52,at:w("days","two or three weeks",-0.3),d:1.2},
  {s:"around a usual level of their own",x:110,y:350,size:52,at:w("usual","usual level",-0.3),d:1.2},
  {s:"Years: more organised, steadier",x:110,y:460,size:52,col:"green",at:w("years","more organised",-0.3),d:1.2},
  {s:"Not the last word: Bolivia",x:110,y:580,size:52,col:"amber",at:w("last","Bolivia",-0.5),d:1.0}];
// 4. what a test can do
const na_note4=(sc,w)=>[
  {s:"A test",x:70,y:124,size:88,w:600,col:"blue",at:w("start","test",-0.5),d:0.4,marks:[["under","blue",null,0.3]]},
  {s:"Can start a conversation",x:110,y:290,size:62,col:"green",at:w("start","start",-0.3),d:1.0},
  {s:"Can't decide anything",x:110,y:420,size:62,col:"amber",at:w("start","can't",-0.3),d:0.9}];
// 5. How I work: the page's five headings (Helena's own page)
const na_note5=(sc,w)=>[
  {s:"How I work",x:70,y:124,size:88,w:700,col:"blue",at:w("keep","How I work",-0.3),d:0.6,marks:[["under","blue",null,0.3]]},
  {s:"When I do my best work",x:110,y:252,size:52,at:w("heads1","best work",-0.6),d:0.9},
  {s:"How to ask me for something",x:110,y:342,size:52,at:w("heads1","ask me",-0.5),d:1.0},
  {s:"How to disagree with me",x:110,y:432,size:52,at:w("heads2","disagree",-0.5),d:0.9},
  {s:"What wears me out",x:110,y:522,size:52,at:w("heads2","wears",-0.5),d:0.7},
  {s:"What I'm getting better at",x:110,y:612,size:52,at:w("heads2","better",-0.5),d:0.9}];
// 6. Erin's page, in her own words
const na_noteE=(sc,w)=>[
  {s:"How I work · Erin",x:70,y:124,size:76,w:800,col:"blue",at:w("erin","Erin's",-0.6),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"How to ask me for something:",x:110,y:280,size:52,at:w("erin","ask me",-0.6),d:0.9},
  {s:"in writing, the day before",x:110,y:380,size:60,col:"green",at:w("erin","writing",-0.3),d:1.0}];
// 7. on Monday
const na_note6=(sc,w)=>{const dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:w("monday","Monday",-0.3),d:0.6,marks:[["under","blue",null,0.3]]},
  dot(262,"amber",w("monday","sort",-0.4)),{s:"Don't sort: no type, test or first guess",x:128,y:262,size:48,at:w("monday","sort",-0.2),d:1.4},
  dot(382,"blue",w("do","Ask",-0.4)),{s:"Ask each how they work best",x:128,y:382,size:52,at:w("do","Ask",-0.2),d:1.1},
  dot(502,"blue",w("do","Write",-0.4)),{s:"Write your own page first",x:128,y:502,size:52,at:w("do","Write",-0.2),d:1.0},
  {s:"Ways for the whole range",x:128,y:622,size:52,col:"green",at:w("do","build",-0.3),d:1.0,marks:[["ring","green",null]]}];};
