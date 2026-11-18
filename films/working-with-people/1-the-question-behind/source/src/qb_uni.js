/* ===== The question behind the request: the university, February to June 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows Carmen Vidal writes, and the pages Noor, Ivy and Helena keep.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.qbTeam=PK.place.team;AG_PLACES.qbCorner=PK.place.corner;AG_PLACES.qbCampus=PK.place.campus;AG_PLACES.qbLecture=PK.place.lecture;
AG_PLACES.qbBoard=PK.place.board;AG_PLACES.qbNotes=c=>PK.place.notes(c,{});
const QB_T=PK.ROOMS.team,QB_CA=PK.ROOMS.campus,QB_CO=PK.ROOMS.corner,QB_LE=PK.ROOMS.lecture;
const qb_hT=fl=>PK.hAt(fl,QB_T.eye),qb_hC=fl=>PK.hAt(fl,QB_CA.eye),qb_hL=fl=>PK.hAt(fl,QB_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const qb_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const qb_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const QB_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const QB_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const QB_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const qb_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function qb_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const QB_DESK={sam:[1230,QB_T.back],jun:[1808,QB_T.back],marta:[560,QB_T.mid]};
function qb_team(x,tt,o){o=o||{};const r={},HB=qb_hT(QB_T.back),HM=qb_hT(QB_T.mid);PK.clock(x,QB_T.clock[0],QB_T.clock[1],QB_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:QB_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),QB_DESK.sam[0],QB_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:QB_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",QB_DESK.jun[0],QB_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:QB_T.mid,i:2,draw:c=>{r.marta=qb_desk(c,o.marta===null?null:(o.deskWho||"marta"),QB_DESK.marta[0],QB_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.qbTeam=(x,tt)=>qb_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const QB_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const qb_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},QB_RB,{h:qb_hT(QB_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const QB_SIDE={x:1690,floor:900},QB_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function qb_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=qb_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||qb_lis(tt,-0.2)),people:[
    {fl:QB_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",QB_SAMC.x,QB_SAMC.floor,qb_hT(QB_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||qb_lis(tt,-0.25)));}},
    {fl:QB_RB.floor,draw:c=>{Jc=qb_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:QB_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",QB_SIDE.x,QB_SIDE.floor,qb_hT(QB_SIDE.floor),PK.poseMix("clasp",QB_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||qb_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const QB_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},QB_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const QB_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function qb_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=QB_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(QB_SITH,QB_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,QB_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,QB_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const QB_LE2=PK.ROOMS.lecture;
function qb_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function qb_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-6,w,30),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+62,{w:700,size:30,color:U.css(PK.C.ink)});y+=96;}}





/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 0. the committee's sheet in 1990 (an engineer): what saving the tower would mean, and how
const qb_boardO=(sc,w)=>[
  {s:"Saving it means",x:70,y:120,size:72,col:"blue",at:w("meant","agreed",-0.2),d:0.9},
  {s:"about ½ a degree",x:70,y:250,size:72,col:"green",at:w("meant","half a degree",-0.3),d:1.0},
  {s:"too little to see",x:640,y:250,size:56,at:w("meant","too little",-0.2),d:0.9},
  {s:"less strain · steadier ground",x:70,y:370,size:56,at:w("enough","ease",-0.3),d:1.2},
  {s:"soil out, north side",x:520,y:470,size:60,col:"blue",at:w("method","draw",-0.2),d:1.0}];
// 1. what a request says, and doesn't (Carmen)
const qb_boardA=(sc,w)=>[
  {s:"A request names",x:70,y:110,size:60,col:"blue",at:w("clear","sounds clear",-0.3),d:0.8},
  {s:"a thing · a date",size:56,at:w("clear","a thing",-0.2),d:0.8},
  {s:"a guess at a solution",x:70,y:230,size:60,col:"amber",at:w("guess","guess",-0.3),d:1.0},
  {s:"not what it's for",x:560,y:340,size:60,col:"amber",at:w("guess","What it's for",-0.2),d:0.9},
  {s:"on time, and no help",x:560,y:450,size:56,at:w("nobody","on time",-0.2),d:0.9}];
// 2. how to ask, and how to listen (Carmen)
const qb_boardB=(sc,w)=>[
  {s:"Humble inquiry · Schein",x:70,y:110,size:56,col:"blue",at:w("schein","humble inquiry",-0.3),d:1.0},
  {s:"ask what you don't know",x:110,y:210,size:52,at:w("schein","asking",-0.2),d:1.0},
  {s:"Active listening · Rogers, Farson",x:70,y:320,size:52,col:"green",at:w("rogers","active listening",-0.3),d:1.2},
  {s:"hear it all, say it back",x:560,y:420,size:52,at:w("rogers","whole meaning",-0.2),d:1.0}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. what Graham said (Noor, in his office)
const qb_note1=(sc,w)=>[
  {s:"Graham · 16 February",x:70,y:124,size:72,w:820,col:"blue",at:w("decide","What will you",-0.3),d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"Decides: a new building?",x:110,y:240,size:50,at:w("decide","new teaching building",-0.4),d:0.9},
  {s:"By: paper 1 June",x:110,y:330,size:50,at:w("when","paper",-0.2),d:0.8},
  {s:"Who: the Council; academics read it",x:110,y:420,size:46,at:w("who","University Council",-0.2),d:1.1},
  {s:"Trusts: his walks",x:110,y:510,size:50,col:"orange",at:w("trust","walks",-0.3),d:0.8},
  {s:"Mind: short at every hour?",x:110,y:600,size:50,col:"amber",at:w("mind","every hour",-0.3),d:0.9}];
// 2. the one page, written down with Graham (Noor)
const qb_note2=(sc,w)=>[
  {s:"“A dashboard of room use, by Easter”",x:70,y:124,size:44,w:900,col:"mut",at:w("question","rooms",-1.2),d:1.0},
  {s:"Too few rooms, or too few",x:70,y:236,size:62,col:"blue",at:w("question","too few rooms",-0.2),d:1.0},
  {s:"at some hours?",x:70,y:322,size:62,col:"blue",at:w("question","some hours",-0.2),d:0.7},
  {s:"decision · dates · who decides",x:110,y:430,size:48,at:w("under","decision",-0.2),d:1.0},
  {s:"what would change his mind",x:110,y:516,size:48,at:w("under","change his mind",-0.3),d:0.9},
  {s:"used = people in the room",x:110,y:602,size:48,col:"green",at:w("under","what “used” means",-0.2),d:0.9}];
// 3. what the data said (Ivy)
const qb_note3=(sc,w)=>[
  {s:"Room use, spring 2027",x:70,y:124,size:72,w:820,col:"blue",at:w("week","whole week",-0.6),d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"the week: booked 38%",x:110,y:250,size:54,col:"orange",at:w("week","booked",-0.2),d:0.9},
  {s:"10 to 2, Tue to Thu: 93%",x:110,y:350,size:54,col:"orange",at:w("peak","Tuesday",-0.4),d:1.0},
  {s:"1 booked hour in 5: nobody",x:110,y:450,size:54,col:"amber",at:w("empty","nobody",-0.6),d:1.0},
  {s:"too few at some hours",x:110,y:556,size:60,col:"green",at:w("so","some hours",-0.3),d:0.9}];
// 4. on Monday (Helena)
const qb_note4=(sc,w)=>{const dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:w("monday","On Monday",0),d:0.6,marks:[["under","blue",null,0.3]]},
  dot(246,"blue",w("monday","decide",-0.4)),{s:"What will you decide, by when?",x:128,y:246,size:46,at:w("monday","decide",-0.1),d:1.1},
  dot(338,"orange",w("who","who else",-0.3)),{s:"Who else decides? What do you trust?",x:128,y:338,size:42,at:w("who","who else",0),d:1.2},
  dot(430,"amber",w("who","change their mind",-0.4)),{s:"What would change your mind?",x:128,y:430,size:46,at:w("who","change their mind",-0.1),d:1.0},
  dot(522,"green",w("listen","Listen",-0.3)),{s:"Listen; say back what you heard",x:128,y:522,size:46,at:w("listen","Listen",0),d:1.1},
  dot(614,"blue",w("write","write the question",-0.3)),{s:"Write it beside their words",x:128,y:614,size:46,at:w("write","write the question",0),d:1.0}];};
// 5. the engineer's note, each day in 1999 to 2001
const qb_note5=(sc,w)=>[
  {s:"The tower · today",x:70,y:124,size:76,w:760,col:"blue",at:w("note","signed a note",-0.6),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"moved north, a little",x:110,y:262,size:58,col:"green",at:w("note","moved",-0.3),d:0.9},
  {s:"take out: hole 7, slowly",x:110,y:370,size:58,at:w("note","exactly what",-0.2),d:1.0},
  {s:"signed, the engineer",x:110,y:480,size:52,col:"mut",at:w("note","take out",0.4),d:0.8}];
