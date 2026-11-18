/* ===== Learning while doing: the university, March to June 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows that Ivy and Carmen Vidal write, and the pages Ivy and Helena keep.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.lwTeam=PK.place.team;AG_PLACES.lwCorner=PK.place.corner;AG_PLACES.lwCampus=PK.place.campus;AG_PLACES.lwLecture=PK.place.lecture;
AG_PLACES.lwBoard=PK.place.board;AG_PLACES.lwNotes=c=>PK.place.notes(c,{});
const LW_T=PK.ROOMS.team,LW_CA=PK.ROOMS.campus,LW_CO=PK.ROOMS.corner,LW_LE=PK.ROOMS.lecture;
const lw_hT=fl=>PK.hAt(fl,LW_T.eye),lw_hC=fl=>PK.hAt(fl,LW_CA.eye),lw_hL=fl=>PK.hAt(fl,LW_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const lw_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const lw_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const LW_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const LW_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const LW_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const lw_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function lw_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const LW_DESK={sam:[1230,LW_T.back],jun:[1808,LW_T.back],marta:[560,LW_T.mid]};
function lw_team(x,tt,o){o=o||{};const r={},HB=lw_hT(LW_T.back),HM=lw_hT(LW_T.mid);PK.clock(x,LW_T.clock[0],LW_T.clock[1],LW_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:LW_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),LW_DESK.sam[0],LW_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:LW_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",LW_DESK.jun[0],LW_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:LW_T.mid,i:2,draw:c=>{r.marta=lw_desk(c,o.marta===null?null:(o.deskWho||"marta"),LW_DESK.marta[0],LW_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.lwTeam=(x,tt)=>lw_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const LW_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const lw_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},LW_RB,{h:lw_hT(LW_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const LW_SIDE={x:1690,floor:900},LW_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function lw_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=lw_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||lw_lis(tt,-0.2)),people:[
    {fl:LW_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",LW_SAMC.x,LW_SAMC.floor,lw_hT(LW_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||lw_lis(tt,-0.25)));}},
    {fl:LW_RB.floor,draw:c=>{Jc=lw_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:LW_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",LW_SIDE.x,LW_SIDE.floor,lw_hT(LW_SIDE.floor),PK.poseMix("clasp",LW_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||lw_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const LW_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},LW_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const LW_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function lw_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=LW_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(LW_SITH,LW_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,LW_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,LW_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const LW_LE2=PK.ROOMS.lecture;
function lw_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function lw_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-6,w,30),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+62,{w:700,size:30,color:U.css(PK.C.ink)});y+=96;}}




/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 0. the culture circle's sheet on the wall, in Angicos (a coordinator): the word, its syllables, and new words made from them
const lw_boardO=(sc,w)=>[
  {s:"belota",x:70,y:150,size:96,col:"orange",at:w("picture","belota",-0.1),d:0.9},
  {s:"be · lo · ta",x:520,y:150,size:80,at:w("syllables","syllables",-0.3),d:1.1},
  {s:"ba be bi bo bu",x:70,y:300,size:66,col:"blue",at:w("syllables","new words",-1.4),d:1.2},
  {s:"la le li lo lu",x:640,y:300,size:66,col:"blue",at:w("syllables","new words",-0.2),d:1.2},
  {s:"bola · lata · bota",x:240,y:440,size:70,col:"green",at:w("steps","small step",-0.4),d:1.4}];
// 1. what one count means: Ivy teaches the team, on Thursday 13 May
const lw_boardA=(sc,w)=>[
  {s:"An hour's count",x:70,y:110,size:60,col:"orange",at:w("peak","count",-0.3),d:0.9},
  {s:"= the most at once",size:52,at:w("peak","most people",-0.2),d:0.9},
  {s:"0 = saw nobody",x:70,y:226,size:54,col:"green",at:w("gap","zero",-0.2),d:0.8},
  {s:"· gap = sent nothing",size:54,col:"amber",at:w("gap","gap",-0.1),d:0.9},
  {s:"never the same",x:560,y:330,size:54,col:"amber",at:w("gap","never the same",-0.2),d:0.8},
  {s:"heads, never whose",x:560,y:436,size:54,col:"blue",at:w("heads","heads",-0.2),d:0.9}];
// 2. how adults learn at work (Carmen Vidal)
const lw_boardB=(sc,w)=>[
  {s:"Lave & Wenger · apprentices",x:70,y:106,size:48,col:"mut",at:w("lave","Jean Lave",0),d:1.1},
  {s:"Start at the edge, on real work",x:70,y:212,size:52,col:"blue",at:w("edge","taking part",-0.3),d:1.2},
  {s:"Ericsson · just past what you can do",x:70,y:318,size:46,at:w("ericsson","practice",-0.3),d:1.3},
  {s:"+ quick feedback",x:640,y:424,size:50,col:"green",at:w("ericsson","feedback",-0.3),d:0.8}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. pairing (Ivy)
const lw_note1=(sc,w)=>[
  {s:"Pairing, an hour a day",x:70,y:124,size:72,w:840,col:"blue",at:w("small","Each day",-0.4),d:0.9,marks:[["under","blue",null,0.3]]},
  {s:"one types, one reads and asks",x:110,y:262,size:50,at:w("small","small change",-0.3),d:1.0},
  {s:"one small change, finished",x:110,y:358,size:52,col:"green",at:w("small","finished",-0.2),d:0.9},
  {s:"reviewed by someone else",x:110,y:454,size:52,at:w("review","reviews",-0.3),d:0.9},
  {s:"Noor or Sam",x:110,y:548,size:52,col:"green",at:w("review","Noor",-0.2),d:0.6}];
// 2. the learning time (Ivy)
const lw_note2=(sc,w)=>[
  {s:"Thursdays, 2 to 4",x:70,y:124,size:80,w:760,col:"blue",at:w("pick","picks",-0.4),d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"one thing the work needs",x:110,y:262,size:54,at:w("pick","one thing",-0.2),d:0.9},
  {s:"the official docs first",x:110,y:358,size:54,col:"blue",at:w("pick","own docs",-0.2),d:0.9},
  {s:"try it on the real project",x:110,y:454,size:54,col:"orange",at:w("try","try it",-0.2),d:0.9},
  {s:"write it down, beside the code",x:110,y:548,size:50,col:"green",at:w("try","write down",-0.2),d:1.0}];
// 3. teach it to keep it (Helena)
const lw_note3=(sc,w)=>[
  {s:"Teach it to keep it",x:70,y:124,size:80,w:760,col:"blue",at:w("study","found the same",-0.4),d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"Fiorella and Mayer",x:110,y:252,size:50,col:"mut",at:w("study","Logan Fiorella",0),d:0.8},
  {s:"prepared, then taught:",x:110,y:350,size:54,at:w("taught","prepared",-0.2),d:0.9},
  {s:"remembered more",x:110,y:446,size:58,col:"green",at:w("taught","remembered more",-0.2),d:0.8},
  {s:"Freire: teaching, we learn",x:110,y:548,size:52,col:"orange",at:w("freire","whoever teaches",-0.3),d:1.0}];
// 4. the nine jobs, and who can run each (Helena): the second names come later, at the right of their rows
const lw_note4=(sc,w)=>[
  {s:"Nine jobs: who can run each?",x:70,y:118,size:62,w:900,col:"blue",at:sc.cues.five-0.1,d:1.0},
  {s:"5 with one name",x:110,y:226,size:56,col:"amber",at:w("five","Five",0.9),d:0.8},
  {s:"sensors' feed: Sam",x:110,y:326,size:52,at:w("five","sensors' feed",-0.2),d:0.9},
  {s:"room models: Jun",x:110,y:420,size:52,at:w("five","room models",-0.2),d:0.9},
  {s:"30 June: two names each",x:110,y:540,size:56,col:"green",at:w("june","two names",-0.5),d:1.0},
  {s:"+ Ivy",x:600,y:326,size:52,col:"green",at:w("ivy","sensors' feed",-0.3),d:0.5},
  {s:"+ Ivy",x:600,y:420,size:52,col:"green",at:w("ivy","room models",-0.3),d:0.5}];
// 5. seventy, twenty, ten (Helena)
const lw_note5=(sc,w)=>[
  {s:"70 · 20 · 10",x:70,y:124,size:84,w:700,col:"orange",at:w("rule","seventy",-0.3),d:0.8,marks:[["under","orange",null,0.3]]},
  {s:"70 doing the work",x:110,y:256,size:54,at:w("rule","doing",-0.3),d:0.8},
  {s:"20 other people · 10 courses",x:110,y:352,size:50,at:w("twenty","twenty",-0.2),d:1.1},
  {s:"a rule of thumb",x:110,y:448,size:54,col:"amber",at:w("thumb","rule of thumb",-0.2),d:0.8},
  {s:"it points the same way",x:110,y:548,size:54,col:"green",at:w("thumb","points",-0.2),d:0.9}];
// 6. on Monday (Helena)
const lw_note6=(sc,w)=>{const dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:w("real","On Monday",0),d:0.6,marks:[["under","blue",null,0.3]]},
  dot(252,"orange",w("real","real work",-0.4)),{s:"On the real work, beside someone",x:128,y:252,size:46,at:w("real","real work",-0.1),d:1.2},
  dot(352,"green",w("step","small step",-0.4)),{s:"One small step, finished",x:128,y:352,size:48,at:w("step","small step",-0.1),d:0.9},
  dot(452,"blue",w("time","learning time",-0.4)),{s:"Learning time, kept · docs first",x:128,y:452,size:46,at:w("time","learning time",-0.1),d:1.1},
  dot(552,"green",w("teach","Write down",-0.3)),{s:"Write it down, and teach it",x:128,y:552,size:48,at:w("teach","Write down",0),d:1.0}];};
