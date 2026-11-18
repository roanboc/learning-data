/* ===== Many hats, one picture: the university, March 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows that Carmen Vidal, Jun and Helena write, and the pages Helena keeps.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.mhTeam=PK.place.team;AG_PLACES.mhCorner=PK.place.corner;AG_PLACES.mhCampus=PK.place.campus;AG_PLACES.mhLecture=PK.place.lecture;
AG_PLACES.mhBoard=PK.place.board;AG_PLACES.mhNotes=c=>PK.place.notes(c,{});
const MH_T=PK.ROOMS.team,MH_CA=PK.ROOMS.campus,MH_CO=PK.ROOMS.corner,MH_LE=PK.ROOMS.lecture;
const mh_hT=fl=>PK.hAt(fl,MH_T.eye),mh_hC=fl=>PK.hAt(fl,MH_CA.eye),mh_hL=fl=>PK.hAt(fl,MH_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const mh_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const mh_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const MH_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const MH_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const MH_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const mh_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const MH_DESK={sam:[1230,MH_T.back],jun:[1808,MH_T.back],marta:[560,MH_T.mid]};
function mh_team(x,tt,o){o=o||{};const r={},HB=mh_hT(MH_T.back),HM=mh_hT(MH_T.mid);PK.clock(x,MH_T.clock[0],MH_T.clock[1],MH_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:MH_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:"sam",MH_DESK.sam[0],MH_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:MH_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",MH_DESK.jun[0],MH_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:MH_T.mid,i:2,draw:c=>{r.marta=PK.atDesk(c,o.marta===null?null:"marta",MH_DESK.marta[0],MH_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.mhTeam=(x,tt)=>mh_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const MH_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const mh_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},MH_RB,{h:mh_hT(MH_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const MH_SIDE={x:1690,floor:900},MH_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function mh_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=mh_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||mh_lis(tt,-0.2)),people:[
    {fl:MH_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",MH_SAMC.x,MH_SAMC.floor,mh_hT(MH_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||mh_lis(tt,-0.25)));}},
    {fl:MH_RB.floor,draw:c=>{Jc=mh_roomBoard(c,tt,o.rows||[],"carmen",{say:o.say,events:o.events});}},
    {fl:MH_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",MH_SIDE.x,MH_SIDE.floor,mh_hT(MH_SIDE.floor),PK.poseMix("clasp",MH_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||mh_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const MH_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},MH_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const MH_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function mh_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=MH_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(MH_SITH,MH_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,MH_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,MH_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Mei shows Ivy the room as the timetable names it; Sam shows her the sensor over the door that counts the people in it every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const MH_LE2=PK.ROOMS.lecture;
function mh_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function mh_panel(cc,bx,by,bw,bh,head,rows,bars){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-6,w,30),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+62,{w:700,size:30,color:U.css(PK.C.ink)});y+=96;}}

/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 1. one role, two sides (Carmen)
const mh_boardA=(sc,w)=>[
  {s:"Managing and leading",x:70,y:110,size:62,col:"blue",at:w("role","managing",-0.2),d:1.0},
  {s:"two sides of one role",x:70,y:206,size:52,at:w("role","two sides",-0.2),d:0.9},{s:"· not rivals",size:52,col:"amber",at:w("role","not rivals",-0.2),d:0.6},
  {s:"Plans, dates, measures",x:70,y:310,size:52,at:w("role","plans",-0.2),d:1.0},
  {s:"serve the people",x:70,y:400,size:56,col:"green",at:w("role","serve the people",-0.2),d:0.9}];
// 2. where data is born, and where it goes (Noor, at the team's board)
const mh_boardB=(sc,w)=>[
  {s:"Where data is born",x:70,y:110,size:58,col:"blue",at:w("noor","born",-0.5),d:0.9},{s:"→ where it goes",size:52,at:w("noor","where it goes",-0.2),d:0.8},
  {s:"timetable · sensors",x:70,y:206,size:52,col:"orange",at:w("noor","goes",0.8),d:0.9}];
// 3. each of them (Carmen)
const mh_boardC=(sc,w)=>[
  {s:"Deep in one part",x:70,y:110,size:62,col:"blue",at:w("deep","deep",-0.2),d:0.8},
  {s:"and right about it",x:70,y:212,size:54,col:"green",at:w("deep","right",-0.3),d:0.8},
  {s:"More hats than a title says",x:70,y:322,size:52,col:"amber",at:w("deep","more hats",-0.2),d:1.1}];
// 4. the whole route of Graham's question, from his decision down (Ivy, at the team's board)
const mh_boardD=(sc,w)=>[
  {s:"Decision: ask for a building?",x:70,y:100,size:46,col:"blue",at:w("decision","decision",-0.2),d:1.1},{s:"Council, June",size:40,col:"mut",at:w("decision","June",-0.3),d:0.6},
  {s:"Question: too few rooms, or at some hours?",x:70,y:176,size:42,at:w("question","too few rooms",-0.3),d:1.5},
  {s:"Data: bookings beside counts",x:70,y:252,size:44,col:"orange",at:w("data","bookings",-0.3),d:1.1},
  {s:"Born: timetable · sensors",x:70,y:328,size:44,col:"orange",at:w("born","timetable",-0.3),d:1.0},
  {s:"Kept by: Mei, Sam, Jun, Noor",x:70,y:404,size:44,at:w("keeps","Mei",-0.3),d:1.1},
  {s:"Rule: counts, never people",x:70,y:470,size:44,col:"blue",at:w("keeps","counts",-0.3),d:1.0}];
// 5. the T (Carmen)
const mh_boardE=(sc,w)=>[
  {s:"T-shaped",x:70,y:120,size:66,col:"blue",at:w("t","T-shaped",-0.3),d:0.7},
  {k:"line",x:760,y:150,x1:760,y1:440,col:"blue",at:w("t","deep stroke",-0.2),d:0.6},
  {k:"line",x:560,y:150,x1:960,y1:150,col:"green",at:w("t","wide bar",-0.2),d:0.6},
  {s:"depth",x:790,y:330,size:48,col:"blue",at:w("t","across the top",0.2),d:0.4},
  {s:"enough of the rest",x:840,y:126,size:42,col:"green",at:w("t","across the top",0.8),d:0.8}];
// 6. the maps of the work (Carmen)
const mh_boardF=(sc,w)=>[
  {s:"SFIA: over a hundred skills",x:70,y:110,size:52,at:w("lists","SFIA",-0.2),d:1.1},
  {s:"DAMA: the roles of data work",x:70,y:206,size:52,at:w("lists","DAMA",-0.2),d:1.1},
  {s:"Nobody holds them all",x:70,y:320,size:56,col:"amber",at:w("nobody","Nobody",-0.2),d:0.9}];
// 7. range (Carmen)
const mh_boardG=(sc,w)=>[
  {s:"Range · David Epstein",x:70,y:100,size:42,col:"mut",at:w("range","Range",-0.2),d:0.8},
  {s:"Fixed rules: specialists",x:70,y:206,size:54,at:w("range","specialists",-0.2),d:1.0},
  {s:"Messy problems: range",x:70,y:310,size:54,col:"green",at:w("messy","messy",-0.2),d:1.0}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. Ivy's first goals
const mh_note1=(sc,w)=>[
  {s:"My first goals",x:70,y:124,size:84,w:700,col:"blue",at:w("goals","first goals",-0.3),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"By Easter:",x:110,y:290,size:64,at:w("first","By Easter",-0.2),d:0.6},
  {s:"the whole route",x:110,y:410,size:64,col:"green",at:w("first","whole route",-0.3),d:0.8},
  {s:"of one question's data",x:110,y:520,size:58,at:w("first","data",-0.6),d:0.9}];
// 2. what Ivy takes from each
const mh_note2=(sc,w)=>[
  {s:"From each of them",x:70,y:124,size:80,w:800,col:"blue",at:w("learn","enough",-0.3),d:0.8},
  {s:"their words, their tools",x:110,y:270,size:58,at:w("learn","their words",-0.2),d:1.0},
  {s:"what worries them",x:110,y:380,size:58,col:"amber",at:w("learn","worries",-0.3),d:0.8},
  {s:"Who uses this, for which decision?",x:110,y:510,size:50,col:"green",at:w("ask","who uses",-0.2),d:1.3}];
// 3. what Helena needs from Ivy
const mh_note3=(sc,w)=>[
  {s:"Ivy",x:70,y:124,size:88,w:700,col:"blue",at:w("needed","Ivy",-0.2),d:0.4,marks:[["under","blue",null,0.3]]},
  {s:"Keep her depth: statistics",x:110,y:280,size:58,at:w("own","depth",-0.3),d:1.0},
  {s:"Enough of the rest",x:110,y:400,size:62,at:w("own","business",-0.3),d:0.8},
  {s:"to join them",x:110,y:520,size:66,col:"green",at:w("own","join",-0.4),d:0.6,marks:[["ring","green",null]]}];
// 4. the goal met
const mh_note4=(sc,w)=>[
  {s:"25 March",x:70,y:124,size:84,w:700,col:"blue",at:w("goal","Thursday",-0.2),d:0.6},
  {k:"tick",x:120,y:270,r:30,col:"green",at:w("goal","met",-0.6),d:0.3},
  {s:"the whole route, known",x:170,y:290,size:60,col:"green",at:w("goal","whole route",-0.3),d:1.0}];
// 5. on Monday (Helena)
const mh_note5=(sc,w)=>{const dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:w("depth","On Monday",0.6),d:0.6,marks:[["under","blue",null,0.3]]},
  dot(252,"blue",w("depth","hats",-0.4)),{s:"Each one's hats, not the title",x:128,y:252,size:48,at:w("depth","hats",-0.1),d:1.1},
  dot(352,"green",w("words","time",-0.4)),{s:"Time to learn every part",x:128,y:352,size:48,at:w("words","time",-0.1),d:1.0},
  dot(452,"blue",w("route","one real question",-0.4)),{s:"One real question, one page",x:128,y:452,size:48,at:w("route","one real question",-0.1),d:1.0},
  dot(552,"amber",w("ask","owner",-0.5)),{s:"What falls between: an owner",x:128,y:552,size:48,at:w("ask","owner",-0.2),d:1.0}];};
