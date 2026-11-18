/* ===== Wellbeing is in the work: the university, February 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the seven work, Marta's requests on her screen, the boards' rows that Carmen Vidal and Helena write,
   the pages Helena keeps, and the five questions Helena sends. Every time comes from the voice: sc is the chapter, w a word's time in
   a line. Colour means what it means in the module: blue a plan or a rule, orange data, green something done or of value, amber what
   the work asks, a risk or what isn't so. */
AG_PLACES.wwTeam=PK.place.team;AG_PLACES.wwCorner=PK.place.corner;AG_PLACES.wwCampus=PK.place.campus;AG_PLACES.wwLecture=PK.place.lecture;
AG_PLACES.wwBoard=PK.place.board;AG_PLACES.wwNotes=c=>PK.place.notes(c,{});
const WW_T=PK.ROOMS.team,WW_CA=PK.ROOMS.campus,WW_CO=PK.ROOMS.corner,WW_LE=PK.ROOMS.lecture;
const ww_hT=fl=>PK.hAt(fl,WW_T.eye),ww_hC=fl=>PK.hAt(fl,WW_CA.eye),ww_hL=fl=>PK.hAt(fl,WW_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const ww_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const ww_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const WW_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const WW_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const WW_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const ww_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const WW_DESK={sam:[1230,WW_T.back],jun:[1808,WW_T.back],marta:[560,WW_T.mid]};
function ww_team(x,tt,o){o=o||{};const r={},HB=ww_hT(WW_T.back),HM=ww_hT(WW_T.mid);PK.clock(x,WW_T.clock[0],WW_T.clock[1],WW_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:WW_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:"sam",WW_DESK.sam[0],WW_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:WW_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",WW_DESK.jun[0],WW_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:WW_T.mid,i:2,draw:c=>{r.marta=PK.atDesk(c,o.marta===null?null:"marta",WW_DESK.marta[0],WW_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.wwTeam=(x,tt)=>ww_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (wwBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const WW_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const ww_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},WW_RB,{h:ww_hT(WW_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const WW_SIDE={x:1690,floor:900},WW_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function ww_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=ww_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||ww_lis(tt,-0.2)),people:[
    {fl:WW_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",WW_SAMC.x,WW_SAMC.floor,ww_hT(WW_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||ww_lis(tt,-0.25)));}},
    {fl:WW_RB.floor,draw:c=>{Jc=ww_roomBoard(c,tt,o.rows||[],"carmen",{say:o.say,events:o.events});}},
    {fl:WW_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",WW_SIDE.x,WW_SIDE.floor,ww_hT(WW_SIDE.floor),PK.poseMix("clasp",WW_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||ww_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* the boards' rows, in the board's own px (1250 by 524), each with the time the voice says it; PK.pace makes a row wait until Carmen
   can have walked to it, so they are laid out for someone who walks: on from left to right, and nothing drawn back along words */
// 1. what a chart shows, and a standard for putting people first

/* ---------------------------------------------------------------- Marta's requests, as her screen shows them
   The people who ask are from other areas, people nobody names (PK.extra), each by the way they asked: a message, a mail, a word at
   her desk. The panel comes out of Marta's screen, and each request comes in at its time; each is called urgent. */
const WW_ASK=[[21,"Urgent: fees by faculty, today?"],[24,"URGENT: room use for the board"],[27,"Need the library numbers, urgent"],[30,"Urgent, sorry: one more for Friday"]];
const ww_inbox=(ts,o)=>({title:(o&&o.title)||"Requests · 14 waiting",who:WW_ASK.map(([i])=>PK.extra(i)),me:"marta",msgs:WW_ASK.slice(0,(o&&o.n)||4).map(([i,s],k)=>({who:PK.extra(i),s,at:ts[k]}))});
// Helena's five questions, sent to the seven (as Jun's screen shows them), and the first answer
const ww_five=(a,b)=>({title:"Helena Novak",who:["helena"],me:"jun",msgs:[{who:"helena",s:["Five questions about the work,","to answer in writing, by Wednesday."],at:a},{who:"jun",s:"Done. Thanks for asking.",at:b,type:1.2}]});

/* the boards' rows, in the board's own px (1250 by 524), each with the time the voice says it; PK.pace makes a row wait until whoever
   writes can have walked to it, so they are laid out for someone who walks: on from left to right, and nothing drawn back along words */
// 1. the page's two sides, as researchers name them (Carmen)
const ww_boardA=(sc,w)=>[
  {s:"Job demands:",x:70,y:104,size:62,col:"amber",at:w("jdr","job demands",-0.3),d:0.6},{s:"Job resources:",x:640,y:104,size:62,col:"green",at:w("jdr","job resources",-0.2),d:0.6},
  {s:"what the work asks",x:70,y:184,size:48,at:sc.ends.jdr+0.1,d:0.8},{s:"what helps",x:640,y:184,size:48,at:sc.ends.jdr+1.1,d:0.5},
  {s:"Most of both:",x:70,y:330,size:56,w:700,col:"blue",at:w("both","mostly",-0.3),d:0.8},{s:"how the work is arranged",size:52,at:w("both","arranged",-0.6),d:1.1}];
// 2. three things everyone needs from work, and Marta's page against them (Carmen)
const ww_boardB=(sc,w)=>[
  {s:"Three needs",x:70,y:104,size:62,w:700,col:"blue",at:w("three","three things",-0.2),d:0.7},
  {s:"A say in it",x:70,y:190,size:54,at:w("three","a say",-0.2),d:0.6},
  {s:"To be good at it",x:70,y:272,size:54,at:w("three","good",-0.3),d:0.7},
  {s:"To belong",x:70,y:354,size:54,at:w("three","belong",-0.3),d:0.5},
  {s:"Marta: no say in her order",x:560,y:190,size:46,col:"amber",at:w("marta","no say",-0.3),d:1.0},
  {s:"good at it, finishes little",x:560,y:272,size:46,col:"amber",at:w("marta","finishes",-0.4),d:1.0},
  {s:"alone with the fourteen",x:560,y:354,size:46,col:"amber",at:w("marta","alone",-0.3),d:0.9},
  {s:"Ryan and Deci, 2000",x:70,y:446,size:42,col:"mut",at:w("names","Richard",-0.2),d:0.9},{s:"Hundreds of studies: better off",x:520,y:446,size:40,col:"green",at:w("better","better off",-0.5),d:1.1}];
// 3. what they agree, as Helena writes it at the teaching room's board
const ww_boardC=(sc,w)=>[
  {s:"Agreed, in half an hour",x:70,y:104,size:62,w:800,col:"blue",at:w("agree","half",-0.2),d:0.9},
  {s:"2 no longer needed",x:70,y:196,size:54,col:"amber",at:w("agree","Two requests",-0.2),d:0.8},
  {s:"12: one order, a date each",x:70,y:280,size:54,col:"green",at:w("agree","twelve",-0.3),d:1.0},
  {s:"3 at a time, from Thursday",x:70,y:364,size:54,at:w("three","three at a time",-0.4),d:1.0},
  {s:"New requests: to Helena",x:70,y:448,size:54,col:"blue",at:w("door","new request",-0.3),d:0.9}];
// 4. where to look in the work, and what a regulator calls it (Carmen)
const ww_boardD=(sc,w)=>[
  {s:"Where to look in the work",x:70,y:104,size:62,w:900,col:"blue",at:w("where","where to look",-0.2),d:0.9},
  {s:"How much in hand at once",x:70,y:184,size:46,at:w("where","how much",-0.3),d:0.9},{s:" · who decides the order",size:46,at:w("where","who decides",-0.3),d:0.8},
  {s:"Interruptions",x:70,y:258,size:46,at:w("more","interrupted",-0.5),d:0.6},{s:" · alone on something",size:46,at:w("more","alone",-0.3),d:0.7},
  {s:"Nights and weekends",x:70,y:332,size:46,at:w("more","Nights",-0.3),d:0.7},{s:" · what is unclear · thanks",size:46,at:w("more","unclear",-0.3),d:1.2},
  {s:"Hazards at work, Safe Work Australia:",x:70,y:410,size:40,col:"mut",at:w("hazards","Safe",-0.2),d:1.0},
  {s:"job demands · low control · poor support",x:70,y:466,size:46,col:"amber",at:w("hazards","job demands",-0.3),d:1.3}];
// 5. three signs, and what a manager does (Carmen)
const ww_boardE=(sc,w)=>[
  {s:"Three signs, early",x:70,y:104,size:62,w:800,col:"amber",at:w("signs","three signs",-0.2),d:0.8},
  {s:"Worn out",x:70,y:186,size:52,at:w("signs","worn out",-0.3),d:0.5},{s:" · distant from the job",size:52,at:w("signs","distant",-0.3),d:0.8},
  {s:"· feeling no longer good at it",x:70,y:262,size:52,at:w("signs","no longer",-0.4),d:1.0},
  {s:"WHO: burn-out, from stress at work not managed",x:70,y:344,size:42,col:"mut",at:w("who","World",-0.2),d:1.4},
  {s:"A matter of work, not a medical condition",x:70,y:406,size:46,col:"blue",at:w("notmed","matter of work",-0.3),d:1.2},
  {s:"Ask · listen · change the work first",x:70,y:466,size:50,col:"green",at:w("ask","asks",-0.2),d:1.2}];
// 6. the answers, shown to all seven (Helena, at the room's board)
const ww_boardF=(sc,w)=>[
  {s:"Answers, 7 of 7",x:70,y:104,size:62,w:700,col:"blue",at:w("show","answers",-0.3),d:0.7},
  {s:"A say in their order: 2",x:70,y:186,size:50,at:w("counts","Two of seven",-0.2),d:0.9},{s:" · finish things: 3",size:50,at:w("counts","Three",-0.2),d:0.7},
  {s:"Someone to turn to: 7",x:70,y:262,size:50,col:"green",at:w("counts","All seven",-0.3),d:0.9},
  {s:"Wears out: standing meetings 5",x:70,y:340,size:46,col:"amber",at:w("wears","standing",-0.4),d:1.1},{s:" · no order 4 · nights 1",size:46,col:"amber",at:w("wears","no order",-0.3),d:0.9},
  {s:"Changed: Marta's order",x:70,y:420,size:50,col:"green",at:w("changed","Marta's order",-0.3),d:0.9},{s:" · the rest: 15 March",size:50,col:"blue",at:w("changed","Monday",-0.3),d:0.8}];

/* ---------------------------------------------------------------- Helena's notebook: what she keeps (the page's own px)
   One pen writes a page: each row has the time the voice says it, in the order the pen writes them, and the page is paced once
   (PK.pace(ctx, null, rows)). */
// 1. what she could ask Marta, and where she looks instead
const ww_note1=(sc,w)=>[
  {s:"Ask Marta to cope?",x:70,y:124,size:80,w:800,col:"amber",at:w("cope","cope",-0.4),d:0.9,marks:[["under","amber",null,0.3]]},
  {s:"Plan better",x:130,y:262,size:58,at:w("cope","plan",-0.3),d:0.6},{s:"Push back",x:560,y:262,size:58,at:w("cope","push",-0.3),d:0.6},
  {s:"A day off",x:130,y:380,size:58,at:w("cope","day off",-0.3),d:0.6},
  {s:"The 14: still there",x:130,y:500,size:58,col:"amber",at:w("still","still",-0.3),d:0.9},
  {s:"The work, before the person",x:70,y:630,size:62,col:"blue",at:w("work","work",-0.4),d:1.0,marks:[["hl","blue"]]}];
// 2. Marta's week, written with her
const ww_note2=(sc,w)=>[
  {s:"Marta's week · 1 to 5 Feb",x:70,y:124,size:76,w:900,col:"blue",at:w("monday","one page",-0.4),d:1.0,marks:[["under","blue",null,0.3]]},
  {s:"What the work asks",x:70,y:236,size:54,col:"amber",at:w("asks","what the work asks",-0.3),d:0.8},
  {s:"14, all urgent; no say in the order",x:110,y:312,size:44,at:w("asks","fourteen",-0.3),d:1.2},
  {s:"9 picked up, none finished",x:110,y:382,size:44,at:w("nine","nine",-0.3),d:1.0},
  {s:"asked about another, each time",x:110,y:452,size:44,at:w("nine","Each time",-0.3),d:1.0},
  {s:"2 Sundays in January",x:110,y:522,size:44,at:w("sundays","two Sundays",-0.3),d:0.8},
  {s:"What helps",x:70,y:610,size:54,col:"green",at:w("helps","what helps",-0.3),d:0.6},
  {s:"Knows the numbers best · Jun checks a query",x:110,y:684,size:42,at:w("helps","knows",-0.3),d:1.4}];
// 3. what the page is about
const ww_note3=(sc,w)=>[
  {s:"The page",x:70,y:124,size:88,w:700,col:"blue",at:w("about","nothing",-0.7),d:0.5,marks:[["under","blue",null,0.3]]},
  {s:"Nothing in it about Marta",x:110,y:300,size:62,at:w("about","nothing",-0.1),d:1.1},
  {s:"All of it: the work",x:110,y:440,size:70,col:"green",at:w("about","All of it",-0.3),d:0.9,marks:[["hl","green"]]}];
// 4. what she takes into the room
const ww_note4=(sc,w)=>[
  {s:"Prepared",x:70,y:124,size:88,w:700,col:"blue",at:w("team","prepared",-0.3),d:0.6,marks:[["under","blue",null,0.3]]},
  {s:"Team: one order, 3 at a time, no weekends",x:70,y:262,size:48,at:w("team","The team",-0.3),d:1.4},
  {s:"They: their number, by their date",x:70,y:372,size:48,at:w("they","their number",-0.3),d:1.1},
  {s:"Both: numbers to rely on, on a date",x:70,y:482,size:48,col:"green",at:w("they","Both",-0.3),d:1.1},
  {s:"Least: an agreed order, a date each",x:70,y:600,size:52,col:"blue",at:w("least","least",-0.3),d:1.2,marks:[["ring","blue",sc.ends.least-0.2]]}];
// 5. where a manager's part ends
const ww_note5=(sc,w)=>[
  {s:"My part has an end",x:70,y:124,size:80,w:800,col:"blue",at:w("part","part",-0.4),d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"Not a clinician",x:110,y:280,size:60,col:"amber",at:w("part","clinician",-0.6),d:0.8},
  {s:"More than work:",x:110,y:400,size:58,at:w("help","more than",-0.3),d:0.7},
  {s:"professional help, kept private",x:110,y:500,size:54,col:"green",at:w("help","professional",-0.3),d:1.2}];
// 6. this week: the four things to keep; the last, ringed
const ww_note6=(sc,w)=>{const dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"This week",x:70,y:122,size:88,w:700,col:"blue",at:w("week","this week",-0.3),d:0.6,marks:[["under","blue",null,0.3]]},
  dot(252,"blue",w("week","write",-0.4)),{s:"One person's week, one page, with them",x:128,y:252,size:48,at:w("week","write",-0.2),d:1.3},
  dot(372,"green",w("take","Take",-0.4)),{s:"To the people who ask: a pace to keep",x:128,y:372,size:48,at:w("take","Take",-0.2),d:1.3},
  dot(492,"blue",w("write","Ask everyone",-0.4)),{s:"Same questions, in writing; show; say when",x:128,y:492,size:46,at:w("write","Ask everyone",-0.2),d:1.4},
  {s:"Change one thing now; a date for the rest",x:128,y:618,size:48,at:w("one","Change",-0.3),d:1.3,marks:[["ring","blue",sc.ends.one]]}];};

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const WW_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},WW_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const WW_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function ww_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=WW_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(WW_SITH,WW_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,WW_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=PK.person(x,"helena",hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,WW_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}

