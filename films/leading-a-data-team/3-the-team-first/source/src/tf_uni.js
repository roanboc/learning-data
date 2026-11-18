/* ===== The team comes first: the university, February to October 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, the corner, the campus and a teaching
   room; and, apart from the scene, a board seen close and a page of a notebook (concepts.js). This file holds what is this film's own
   in them: where the team works, the boards' rows Carmen Vidal and Helena write, and the pages Ivy and Helena keep.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green value or something done, amber a cost or something waiting. */
AG_PLACES.tfTeam=PK.place.team;AG_PLACES.tfCorner=PK.place.corner;AG_PLACES.tfCampus=PK.place.campus;AG_PLACES.tfLecture=PK.place.lecture;
AG_PLACES.tfBoard=PK.place.board;AG_PLACES.tfNotes=c=>PK.place.notes(c,{});
const TF_T=PK.ROOMS.team,TF_CA=PK.ROOMS.campus,TF_CO=PK.ROOMS.corner,TF_LE=PK.ROOMS.lecture;
const tf_hT=fl=>PK.hAt(fl,TF_T.eye),tf_hC=fl=>PK.hAt(fl,TF_CA.eye),tf_hL=fl=>PK.hAt(fl,TF_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const tf_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const tf_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const TF_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const TF_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const TF_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const tf_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function tf_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const TF_DESK={sam:[1230,TF_T.back],jun:[1808,TF_T.back],marta:[560,TF_T.mid]};
function tf_team(x,tt,o){o=o||{};const r={},HB=tf_hT(TF_T.back),HM=tf_hT(TF_T.mid);PK.clock(x,TF_T.clock[0],TF_T.clock[1],TF_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:TF_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),TF_DESK.sam[0],TF_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:TF_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",TF_DESK.jun[0],TF_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:TF_T.mid,i:2,draw:c=>{r.marta=tf_desk(c,o.marta===null?null:(o.deskWho||"marta"),TF_DESK.marta[0],TF_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.tfTeam=(x,tt)=>tf_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const TF_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const tf_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},TF_RB,{h:tf_hT(TF_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const TF_SIDE={x:1690,floor:900},TF_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function tf_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=tf_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||tf_lis(tt,-0.2)),people:[
    {fl:TF_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",TF_SAMC.x,TF_SAMC.floor,tf_hT(TF_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||tf_lis(tt,-0.25)));}},
    {fl:TF_RB.floor,draw:c=>{Jc=tf_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:TF_SIDE.floor,draw:c=>{R2=PK.person(c,o.side||(o.who==="helena"?"ivy":"helena"),TF_SIDE.x,TF_SIDE.floor,tf_hT(TF_SIDE.floor),PK.poseMix("clasp",TF_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||tf_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const TF_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},TF_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const TF_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function tf_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=TF_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(TF_SITH,TF_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,TF_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,TF_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const TF_LE2=PK.ROOMS.lecture;
function tf_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function tf_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){if(!n)continue;const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-10,w,24),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+50,{w:700,size:30,color:U.css(PK.C.ink)});y+=86;}}








/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 1. leading and managing (Carmen, at the team's board)
const tf_boardA=(sc,w)=>[
  {s:"Lead · manage",x:70,y:120,size:62,col:"blue",at:w("weighs","Managing",-0.3),d:0.8},
  {s:"leading weighs a little more",x:110,y:230,size:50,at:w("weighs","leading weighs",-0.2),d:1.2},
  {s:"people first · wellbeing first",x:200,y:330,size:50,col:"green",at:w("first","wellbeing",-0.4),d:1.2},
  {s:"support · a tool · a push",x:290,y:430,size:50,at:w("comfort","more support",-0.3),d:1.1}];
// 2. psychological safety (Carmen)
const tf_boardB=(sc,w)=>[
  {s:"Psychological safety",x:70,y:120,size:60,col:"blue",at:w("name","psychological safety",-0.4),d:1.0},
  {s:"safe to take a risk",x:110,y:240,size:52,at:w("belief","taking risks",-0.4),d:0.9},
  {s:"admit a mistake",x:520,y:340,size:52,col:"green",at:w("belief","admitting a mistake",-0.3),d:0.8},
  {s:"51 teams: safer, learned more",x:200,y:450,size:48,at:w("teams","felt safer",-0.6),d:1.3}];
// 3. the night rota (Helena, at the team's board)
const tf_boardC=(sc,w)=>[
  {s:"Nights",x:70,y:120,size:64,col:"blue",at:w("four","four people",-0.4),d:0.5},
  {s:"Sam · Noor · Jun · Erin",x:110,y:240,size:52,col:"green",at:w("four","every night alert",-0.4),d:1.2},
  {s:"one week in four each",x:300,y:360,size:52,col:"blue",at:w("rota","one week in four",-0.3),d:1.1}];
// 4. Ubuntu as an ethic (Carmen)
const tf_boardD=(sc,w)=>[
  {s:"Ubuntu, an ethic",x:70,y:120,size:60,col:"blue",at:w("ethic","Ubuntu",-0.3),d:0.8},
  {s:"Ramose · Metz",x:110,y:230,size:50,at:w("ethic","Mogobe Ramose",-0.2),d:0.8},
  {s:"share a life with others",x:200,y:340,size:52,col:"green",at:w("metz","sharing a life",-0.3),d:1.1},
  {s:"care how their lives go",x:380,y:450,size:52,col:"green",at:w("metz","caring",-0.3),d:1.1}];
// 5. on Monday (Helena, at the board seen close)
const tf_boardM=(sc,w)=>[
  {s:"On Monday",x:70,y:110,size:64,col:"blue",at:w("pair","On Monday",0),d:0.6},
  {s:"pair · two for each job",x:110,y:205,size:48,col:"green",at:w("pair","pair until",-0.2),d:1.0},
  {s:"protect leave",x:200,y:290,size:48,at:w("leave","Protect leave",-0.2),d:0.7},
  {s:"thank who says: I got it wrong",x:200,y:375,size:46,col:"green",at:w("thank","Thank",-0.2),d:1.2},
  {s:"ask how people are · new: watch first",x:200,y:460,size:42,col:"blue",at:w("ask","ask how",-0.2),d:1.5}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. the stokvel's rules (a member's book)
const tf_note1=(sc,w)=>[
  {s:"Our rules",x:70,y:124,size:80,w:760,col:"blue",at:w("rules","agrees its rules",-0.4),d:0.6,marks:[["under","blue",null,0.3]]},
  {s:"how much · how often",x:110,y:250,size:54,at:w("rules","how much",-0.2),d:1.0},
  {s:"whose turn comes next",x:110,y:360,size:54,col:"green",at:w("rules","whose turn",-0.2),d:1.0},
  {s:"if someone can't pay",x:110,y:470,size:54,col:"amber",at:w("rules","can't pay",-0.5),d:1.0}];
// 2. Ubuntu (the same book)
const tf_note2=(sc,w)=>[
  {s:"Ubuntu",x:70,y:124,size:84,w:760,col:"blue",at:w("ubuntu","Ubuntu",-0.3),d:0.5,marks:[["under","blue",null,0.3]]},
  {s:"a person is a person",x:110,y:260,size:56,col:"green",at:w("ubuntu","a person is a person",-0.3),d:1.0},
  {s:"through other people",x:150,y:370,size:56,col:"green",at:w("ubuntu","through other people",-0.3),d:1.0}];
// 3. the team as a whole (Helena)
const tf_note3=(sc,w)=>[
  {s:"The team, as a whole",x:70,y:124,size:72,w:760,col:"blue",at:w("whole","as a whole",-0.4),d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"what it does together",x:110,y:250,size:52,col:"green",at:w("whole","achieves together",-0.4),d:1.0},
  {s:"against what it really does",x:110,y:350,size:50,at:w("really","really does",-0.4),d:1.1},
  {s:"11 ways in · day and night",x:110,y:450,size:50,col:"orange",at:w("eleven","eleven different ways",-0.3),d:1.1}];
// 4. said out loud (Ivy)
const tf_note4=(sc,w)=>[
  {s:"Said out loud",x:70,y:124,size:76,w:760,col:"blue",at:w("learn","said out loud",-0.4),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"and thanked",x:110,y:250,size:56,col:"green",at:w("learn","thanked",-0.3),d:0.6},
  {s:"the whole team learns",x:110,y:360,size:56,at:w("learn","whole team learns",-0.3),d:1.0}];
// 5. Tutu (Helena)
const tf_note5=(sc,w)=>[
  {s:"Desmond Tutu",x:70,y:124,size:76,w:760,col:"blue",at:w("tutu","Desmond Tutu",-0.3),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"not threatened",x:110,y:250,size:54,at:w("tutu","threatened",-0.3),d:0.8},
  {s:"that others are able and good",x:110,y:350,size:48,col:"green",at:w("tutu","able and good",-0.6),d:1.2},
  {s:"Sam taught three · lost nothing",x:110,y:460,size:48,col:"green",at:w("lost","lost nothing",-0.8),d:1.3}];
