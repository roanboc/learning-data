/* ===== Explaining so people can decide: the university, April to June 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows Carmen Vidal writes, and the pages Ivy and Helena keep, and Daniels's count in 1952.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.edTeam=PK.place.team;AG_PLACES.edCorner=PK.place.corner;AG_PLACES.edCampus=PK.place.campus;AG_PLACES.edLecture=PK.place.lecture;
AG_PLACES.edBoard=PK.place.board;AG_PLACES.edNotes=c=>PK.place.notes(c,{});
const ED_T=PK.ROOMS.team,ED_CA=PK.ROOMS.campus,ED_CO=PK.ROOMS.corner,ED_LE=PK.ROOMS.lecture;
const ed_hT=fl=>PK.hAt(fl,ED_T.eye),ed_hC=fl=>PK.hAt(fl,ED_CA.eye),ed_hL=fl=>PK.hAt(fl,ED_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const ed_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const ed_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const ED_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const ED_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const ED_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const ed_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function ed_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const ED_DESK={sam:[1230,ED_T.back],jun:[1808,ED_T.back],marta:[560,ED_T.mid]};
function ed_team(x,tt,o){o=o||{};const r={},HB=ed_hT(ED_T.back),HM=ed_hT(ED_T.mid);PK.clock(x,ED_T.clock[0],ED_T.clock[1],ED_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:ED_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),ED_DESK.sam[0],ED_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:ED_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",ED_DESK.jun[0],ED_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:ED_T.mid,i:2,draw:c=>{r.marta=ed_desk(c,o.marta===null?null:(o.deskWho||"marta"),ED_DESK.marta[0],ED_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.edTeam=(x,tt)=>ed_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const ED_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const ed_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},ED_RB,{h:ed_hT(ED_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const ED_SIDE={x:1690,floor:900},ED_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function ed_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=ed_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||ed_lis(tt,-0.2)),people:[
    {fl:ED_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",ED_SAMC.x,ED_SAMC.floor,ed_hT(ED_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||ed_lis(tt,-0.25)));}},
    {fl:ED_RB.floor,draw:c=>{Jc=ed_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:ED_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",ED_SIDE.x,ED_SIDE.floor,ed_hT(ED_SIDE.floor),PK.poseMix("clasp",ED_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||ed_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const ED_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},ED_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const ED_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function ed_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=ED_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(ED_SITH,ED_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,ED_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,ED_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const ED_LE2=PK.ROOMS.lecture;
function ed_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function ed_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-6,w,30),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+62,{w:700,size:30,color:U.css(PK.C.ink)});y+=96;}}





/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 0. Daniels's count in 1952, on his office's board: how many of the flyers were average, measurement by measurement
const ed_boardO=(sc,w)=>[
  {s:"4,063 flyers",x:70,y:110,size:64,col:"orange",at:w("height","men",-0.6),d:0.8},
  {s:"height · 1,055",x:110,y:220,size:58,at:w("height","height",-0.3),d:0.9},
  {s:"chest · 302",x:560,y:220,size:58,at:w("chest","chest",-0.3),d:0.8},
  {s:"143 · 73 · 28 · 12",x:170,y:330,size:58,at:w("fewer","fewer",-0.1),d:1.2},
  {s:"6 · 3 · 2",x:700,y:330,size:58,at:w("fewer","six",-0.2),d:0.9},
  {s:"all ten · not one",x:520,y:450,size:64,col:"amber",at:w("none","not one",-0.4),d:0.9,marks:[["under","amber",null,0.3]]}];
// 1. Minto's pyramid (Carmen, at the team's board)
const ed_boardA=(sc,w)=>[
  {s:"The pyramid · Minto",x:70,y:110,size:58,col:"blue",at:w("minto","pyramid",-0.3),d:1.0},
  {s:"1 · the answer",x:110,y:220,size:58,col:"green",at:w("minto","answer",-0.2),d:0.8},
  {s:"2 · the reasons",x:330,y:330,size:56,at:w("minto","reasons",-0.2),d:0.8},
  {s:"3 · the evidence under each",x:540,y:440,size:52,at:w("minto","evidence",-0.2),d:1.1}];
// 2. show the data, to whom (Carmen)
const ed_boardB=(sc,w)=>[
  {s:"Tufte",x:70,y:110,size:56,col:"blue",at:w("tufte","Tufte's",-0.2),d:0.5},
  {s:"above all else, show the data",x:110,y:210,size:52,at:w("tufte","show the data",-0.6),d:1.2},
  {s:"Knaflic",x:70,y:320,size:56,col:"green",at:w("knaflic","Knaflic's",-0.2),d:0.6},
  {s:"know who · the one thing",x:520,y:430,size:52,at:w("knaflic","know who",-0.2),d:1.1}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. fit the range (the designers' notebook, 1952 onwards)
const ed_note1=(sc,w)=>[
  {s:"Fit the range",x:70,y:124,size:80,w:760,col:"blue",at:w("range","range",-0.4),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"5 ft 5 to 6 ft 1",x:110,y:262,size:60,col:"orange",at:w("range","five foot five",-0.3),d:1.0},
  {s:"nine flyers in ten",x:110,y:372,size:60,col:"green",at:w("range","nine flyers",-0.2),d:0.9},
  {s:"not the average",x:110,y:482,size:60,col:"amber",at:w("fit","not the average",-0.2),d:0.8}];
// 2. Ivy's page, top first (the decision, the answer, three lines)
const ed_note2=(sc,w)=>[
  {s:"Council · 1 June",x:70,y:124,size:72,w:760,col:"blue",at:w("decision","Ivy's page",-0.4),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"A new building now, or not yet?",x:110,y:240,size:48,col:"blue",at:w("decision","new building",-0.3),d:1.1},
  {s:"Short only 10 to 2, Tue to Thu",x:110,y:340,size:48,col:"green",at:w("answer","one sentence",-0.2),d:1.1},
  {s:"the peak · unused bookings",x:150,y:440,size:46,at:w("three","the peak",-0.2),d:1.0},
  {s:"what not building takes",x:150,y:530,size:46,at:w("three","what it would take",-0.2),d:0.9}];
// 3. what the average hid (Ivy)
const ed_note3=(sc,w)=>[
  {s:"What it turns on",x:70,y:124,size:76,w:760,col:"blue",at:w("hides","hides",-0.4),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"the week: 38%",x:110,y:250,size:56,col:"mut",at:w("hides","average",-0.2),d:0.8},
  {s:"10 to 2, Tue to Thu: 93%",x:110,y:350,size:54,col:"orange",at:w("peak","Tuesday",-0.4),d:1.0},
  {s:"booked, nobody: 1 in 5",x:110,y:450,size:54,col:"amber",at:w("used","nobody",-0.6),d:0.9}];
// 4. what isn't known, in their words (Ivy)
const ed_note4=(sc,w)=>[
  {s:"Not to build",x:70,y:124,size:76,w:760,col:"blue",at:w("take","not to build",-0.4),d:0.6,marks:[["under","blue",null,0.3]]},
  {s:"move 1 peak class in 6",x:110,y:250,size:52,col:"green",at:w("take","move",-0.2),d:0.9},
  {s:"release rooms nobody uses",x:110,y:340,size:52,col:"green",at:w("take","release",-0.2),d:0.9},
  {s:"not known: students by 2030",x:110,y:440,size:50,col:"amber",at:w("unknown","isn't known",-0.2),d:1.0},
  {s:"holds at twice the growth",x:110,y:540,size:50,at:w("holds","twice",-0.4),d:0.9}];
// 5. on Monday (Helena, at the team's board)
const ed_boardM=(sc,w)=>[
  {s:"On Monday",x:70,y:110,size:64,col:"blue",at:w("one","On Monday",0),d:0.6},
  {s:"the decision, then the answer",x:110,y:210,size:50,at:w("one","decision",-0.1),d:1.1},
  {s:"show what it turns on",x:200,y:300,size:50,col:"orange",at:w("two","Show",0),d:0.9},
  {s:"say what you don't know",x:290,y:390,size:50,col:"amber",at:w("three","don't know",-0.3),d:1.0},
  {s:"try it on someone new",x:380,y:470,size:50,col:"green",at:w("four","Try it",0),d:0.9}];
