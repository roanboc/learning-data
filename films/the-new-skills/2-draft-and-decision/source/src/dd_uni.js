/* ===== The draft and the decision: the university, April 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows that Carmen Vidal and Ivy write, and the pages Ivy and Helena keep.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.ddTeam=PK.place.team;AG_PLACES.ddCorner=PK.place.corner;AG_PLACES.ddCampus=PK.place.campus;AG_PLACES.ddLecture=PK.place.lecture;
AG_PLACES.ddBoard=PK.place.board;AG_PLACES.ddNotes=c=>PK.place.notes(c,{});
const DD_T=PK.ROOMS.team,DD_CA=PK.ROOMS.campus,DD_CO=PK.ROOMS.corner,DD_LE=PK.ROOMS.lecture;
const dd_hT=fl=>PK.hAt(fl,DD_T.eye),dd_hC=fl=>PK.hAt(fl,DD_CA.eye),dd_hL=fl=>PK.hAt(fl,DD_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const dd_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const dd_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const DD_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const DD_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const DD_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const dd_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const DD_DESK={sam:[1230,DD_T.back],jun:[1808,DD_T.back],marta:[560,DD_T.mid]};
function dd_team(x,tt,o){o=o||{};const r={},HB=dd_hT(DD_T.back),HM=dd_hT(DD_T.mid);PK.clock(x,DD_T.clock[0],DD_T.clock[1],DD_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:DD_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:"sam",DD_DESK.sam[0],DD_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:DD_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",DD_DESK.jun[0],DD_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:DD_T.mid,i:2,draw:c=>{r.marta=ddc_desk(c,o.marta===null?null:(o.deskWho||"marta"),DD_DESK.marta[0],DD_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.ddTeam=(x,tt)=>dd_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const DD_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const dd_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},DD_RB,{h:dd_hT(DD_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const DD_SIDE={x:1690,floor:900},DD_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function dd_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=dd_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||dd_lis(tt,-0.2)),people:[
    {fl:DD_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",DD_SAMC.x,DD_SAMC.floor,dd_hT(DD_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||dd_lis(tt,-0.25)));}},
    {fl:DD_RB.floor,draw:c=>{Jc=dd_roomBoard(c,tt,o.rows||[],"carmen",{say:o.say,events:o.events});}},
    {fl:DD_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",DD_SIDE.x,DD_SIDE.floor,dd_hT(DD_SIDE.floor),PK.poseMix("clasp",DD_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||dd_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const DD_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},DD_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const DD_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function dd_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=DD_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(DD_SITH,DD_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,DD_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,DD_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const DD_LE2=PK.ROOMS.lecture;
function dd_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function dd_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-6,w,30),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+62,{w:700,size:30,color:U.css(PK.C.ink)});y+=96;}}


/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 1. what the tests check (Carmen)
const dd_boardA=(sc,w)=>[
  {s:"Tests check the form",x:70,y:110,size:60,col:"blue",at:w("tests","form",-0.3),d:0.9},
  {s:"no room twice",x:110,y:212,size:50,at:w("tests","no room",-0.2),d:0.7},{s:"· no hour left out",size:50,at:w("tests","no hour",-0.2),d:0.8},
  {s:"Not what “used” means",x:70,y:330,size:58,col:"amber",at:w("meaning","know",-0.3),d:0.9}];
// 2. the three things Ivy gives the agent (Ivy, at the team's board)
const dd_boardB=(sc,w)=>[
  {s:"Three things, not one",x:70,y:100,size:54,col:"blue",at:w("three","three things",-0.3),d:0.9},
  {s:"1 · Decision: a new building?",x:70,y:196,size:46,at:w("decision","decision",-0.2),d:1.1},{s:"the Council",size:40,col:"mut",at:w("decision","Council",-0.2),d:0.6},
  {s:"2 · Words: room use, as the glossary has it",x:70,y:292,size:44,col:"blue",at:w("words","room use",-0.2),d:1.3},
  {s:"3 · Counts: teaching hours, 8 to 6, Mon to Fri",x:70,y:388,size:42,at:w("counts","teaching hours",-0.2),d:1.4},
  {s:"booked and used, side by side",x:110,y:466,size:42,col:"orange",at:w("counts","booked",-0.2),d:1.0}];
// 3. the work moves to either side of the draft (Carmen)
const dd_boardC=(sc,w)=>[
  {s:"The draft: an agent's",x:70,y:110,size:56,col:"violet",at:w("moves","either side",-0.3),d:0.9},
  {s:"Before: decision · words · what counts",x:70,y:226,size:46,col:"blue",at:w("before","Before",-0.2),d:1.4},
  {s:"After: check · decide · answer for it",x:70,y:340,size:46,col:"green",at:w("after","After",-0.2),d:1.4}];
// 4. what employers seek (Carmen)
const dd_boardD=(sc,w)=>[
  {s:"Future of Jobs 2025 · World Economic Forum",x:70,y:100,size:38,col:"mut",at:w("wef","Future of Jobs",-0.2),d:1.0},
  {s:"Sought most: analytical thinking",x:70,y:196,size:50,col:"blue",at:w("wef","analytical",-0.3),d:1.0},
  {s:"7 in 10: essential",x:70,y:286,size:50,col:"green",at:w("seven","Seven",-0.2),d:0.7},
  {s:"Rising fastest: AI, big data",x:70,y:376,size:46,at:w("rising","fastest",-0.3),d:1.0},
  {s:"too: creativity, curiosity",x:600,y:462,size:40,at:w("rising","creative",-0.2),d:0.9}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. what the agent assumed (Ivy)
const dd_note1=(sc,w)=>[
  {s:"What it assumed",x:70,y:124,size:80,w:760,col:"blue",at:w("harm","weighed",-0.4),d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"booked = used",x:110,y:262,size:62,col:"amber",at:w("harm","bookings",-0.3),d:0.7},
  {s:"1 booked hour in 5: nobody",x:110,y:362,size:52,at:w("harm","rooms people use",-0.3),d:1.0},
  {s:"It said so. It had the task,",x:110,y:452,size:50,at:w("common","said what",-0.3),d:1.0},
  {s:"not the decision, or the words",x:110,y:536,size:50,col:"green",at:w("task","not the decision",-0.3),d:1.1}];
// 2. one room's week, by hand (Ivy)
const dd_note2=(sc,w)=>[
  {s:"B-204, by hand",x:70,y:124,size:80,w:760,col:"blue",at:w("hand","by hand",-0.6),d:0.7},
  {s:"Mon to Fri, 8 to 6",x:110,y:262,size:60,at:w("hand","hour by hour",-0.4),d:0.8},
  {s:"50 hours, one by one",x:110,y:362,size:56,col:"orange",at:w("hand","hour by hour",0.4),d:0.8},
  {k:"tick",x:130,y:462,r:30,col:"green",at:w("match","All",-0.3),d:0.3},
  {s:"All 50 match the draft",x:180,y:478,size:56,col:"green",at:w("match","fifty",-0.1),d:0.8}];
// 3. what goes with the pull request (Ivy)
const dd_note3=(sc,w)=>[
  {s:"With the pull request",x:70,y:124,size:72,w:820,col:"blue",at:w("reason","reasoning",-0.5),d:0.8},
  {s:"what I asked for",x:110,y:258,size:54,at:w("reason","what she asked",-0.2),d:0.7},
  {s:"what it assumed",x:110,y:350,size:54,col:"amber",at:w("reason","what the agent assumed",-0.1),d:0.7},
  {s:"what I changed",x:110,y:442,size:54,at:w("reason","what she changed",-0.1),d:0.7},
  {s:"how I checked",x:110,y:534,size:54,col:"green",at:w("reason","how she checked",-0.1),d:0.7}];
// 4. what an agent can, and can't (Helena)
const dd_note4=(sc,w)=>[
  {s:"An agent",x:70,y:124,size:84,w:700,col:"violet",at:w("cant","An agent",-0.2),d:0.5,marks:[["under","violet",null,0.3]]},
  {s:"drafts, tests, says what it assumed",x:110,y:270,size:48,at:w("cant","draft",-0.2),d:1.3},
  {s:"never takes the decision",x:110,y:380,size:56,col:"amber",at:w("cant","decision",-0.4),d:0.9},
  {s:"nor the responsibility",x:110,y:480,size:56,col:"amber",at:w("cant","responsibility",-0.4),d:0.9}];
// 5. on Monday (Helena)
const dd_note5=(sc,w)=>{const dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:w("one","On Monday",0),d:0.6,marks:[["under","blue",null,0.3]]},
  dot(252,"blue",w("one","decision",-0.4)),{s:"Decision, words, what counts",x:128,y:252,size:48,at:w("one","decision",-0.1),d:1.1},
  dot(352,"amber",w("two","Read",-0.3)),{s:"Read what it assumed",x:128,y:352,size:48,at:w("two","Read",0),d:0.9},
  dot(452,"orange",w("three","Check",-0.3)),{s:"Check it against what's true",x:128,y:452,size:48,at:w("three","Check",0),d:1.0},
  dot(552,"green",w("four","Never",-0.3)),{s:"Never approve your own",x:128,y:552,size:48,at:w("four","Never",0),d:0.9}];};
