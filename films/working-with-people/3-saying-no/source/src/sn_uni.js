/* ===== Saying no, and what instead: the university, July to November 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows Carmen Vidal writes, and the pages Noor and Helena keep, and the engineers' board at the Aral.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.snTeam=PK.place.team;AG_PLACES.snCorner=PK.place.corner;AG_PLACES.snCampus=PK.place.campus;AG_PLACES.snLecture=PK.place.lecture;
AG_PLACES.snBoard=PK.place.board;AG_PLACES.snNotes=c=>PK.place.notes(c,{});
const SN_T=PK.ROOMS.team,SN_CA=PK.ROOMS.campus,SN_CO=PK.ROOMS.corner,SN_LE=PK.ROOMS.lecture;
const sn_hT=fl=>PK.hAt(fl,SN_T.eye),sn_hC=fl=>PK.hAt(fl,SN_CA.eye),sn_hL=fl=>PK.hAt(fl,SN_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const sn_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const sn_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const SN_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const SN_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const SN_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const sn_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function sn_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const SN_DESK={sam:[1230,SN_T.back],jun:[1808,SN_T.back],marta:[560,SN_T.mid]};
function sn_team(x,tt,o){o=o||{};const r={},HB=sn_hT(SN_T.back),HM=sn_hT(SN_T.mid);PK.clock(x,SN_T.clock[0],SN_T.clock[1],SN_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:SN_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),SN_DESK.sam[0],SN_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:SN_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",SN_DESK.jun[0],SN_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:SN_T.mid,i:2,draw:c=>{r.marta=sn_desk(c,o.marta===null?null:(o.deskWho||"marta"),SN_DESK.marta[0],SN_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.snTeam=(x,tt)=>sn_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const SN_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const sn_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},SN_RB,{h:sn_hT(SN_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const SN_SIDE={x:1690,floor:900},SN_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function sn_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=sn_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||sn_lis(tt,-0.2)),people:[
    {fl:SN_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",SN_SAMC.x,SN_SAMC.floor,sn_hT(SN_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||sn_lis(tt,-0.25)));}},
    {fl:SN_RB.floor,draw:c=>{Jc=sn_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:SN_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",SN_SIDE.x,SN_SIDE.floor,sn_hT(SN_SIDE.floor),PK.poseMix("clasp",SN_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||sn_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const SN_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},SN_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const SN_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function sn_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=SN_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(SN_SITH,SN_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,SN_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,SN_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const SN_LE2=PK.ROOMS.lecture;
function sn_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function sn_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){if(!n)continue;const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-10,w,24),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+50,{w:700,size:30,color:U.css(PK.C.ink)});y+=86;}}






/* ---------------------------------------------------------------- Clara Jensen, in Planning: this film's own, nobody's likeness */
const SN_CLARA={key:"snClara",name:"Clara Jensen",role:"Planning",skin:[236,200,170],hair:{style:"bob",c:[176,120,70]},top:{kind:"jacket",c:[70,110,130],inner:[244,238,226]},bottom:{kind:"trousers",c:[66,64,80]},shoe:[54,46,48]};

/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 0. the engineers at the Aral, on the water board's wall: what the sea lost
const sn_boardO=(sc,w)=>[
  {s:"The Aral Sea",x:70,y:110,size:64,col:"blue",at:w("shrank","sea shrank",-0.4),d:0.7},
  {s:"surface · −70%",x:110,y:220,size:58,col:"amber",at:w("shrank","seventy percent",-0.4),d:0.9},
  {s:"level · −20 m",x:560,y:220,size:58,col:"amber",at:w("shrank","twenty metres",-0.6),d:0.8},
  {s:"1990 · two seas",x:300,y:340,size:58,at:w("split","split in two",-0.3),d:0.9},
  {s:"north · south",x:760,y:450,size:58,at:w("split","small sea",-0.2),d:0.8}];
// 1. position and interest (Carmen, at the team's board)
const sn_boardA=(sc,w)=>[
  {s:"Getting to Yes",x:70,y:110,size:60,col:"blue",at:w("book","Getting to Yes",-0.2),d:0.8},
  {s:"Fisher · Ury",x:600,y:110,size:52,at:w("book","Fisher",-0.2),d:0.6},
  {s:"position · what is asked",x:110,y:250,size:54,col:"orange",at:w("position","position",-0.2),d:1.1},
  {s:"interest · what it's for",x:330,y:400,size:54,col:"green",at:w("position","interest",-0.2),d:1.1}];
// 2. one list, fair criteria (Carmen)
const sn_boardB=(sc,w)=>[
  {s:"One list",x:70,y:110,size:60,col:"blue",at:w("order","list",-0.3),d:0.6},
  {s:"value and effort",x:110,y:220,size:54,col:"green",at:w("order","value and effort",-0.2),d:1.0},
  {s:"never who asks",x:540,y:220,size:54,col:"amber",at:w("order","who asks",-0.4),d:0.8},
  {s:"Fair criteria",x:300,y:350,size:58,col:"blue",at:w("fair","fair criteria",-0.3),d:0.8},
  {s:"what both sides can check",x:420,y:460,size:52,at:w("fair","check",-0.6),d:1.1}];
// 3. a positive no (Carmen)
const sn_boardC=(sc,w)=>[
  {s:"A positive no · Ury",x:70,y:110,size:58,col:"blue",at:w("ury","positive no",-0.3),d:1.0},
  {s:"1 · yes · what you protect",x:110,y:230,size:52,col:"green",at:w("ury","a yes",-0.2),d:1.1},
  {s:"2 · no · said plainly",x:330,y:340,size:52,col:"amber",at:w("ury","clear no",-0.2),d:0.9},
  {s:"3 · an offer",x:560,y:450,size:52,col:"blue",at:w("ury","offer",-0.2),d:0.7}];
// 4. on Monday (Helena, at the team's board)
const sn_boardM=(sc,w)=>[
  {s:"On Monday",x:70,y:110,size:64,col:"blue",at:w("ask","On Monday",0),d:0.6},
  {s:"ask what the date is for",x:110,y:210,size:50,at:w("ask","what it's for",-0.3),d:1.1},
  {s:"show the trade-off",x:200,y:300,size:50,col:"orange",at:w("show","trade-off",-0.3),d:0.9},
  {s:"no to the date · an offer",x:290,y:390,size:50,col:"amber",at:w("offer","no to the date",-0.2),d:1.0},
  {s:"they choose · keep your word",x:380,y:470,size:50,col:"green",at:w("write","choose",-0.4),d:1.1}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. Helena's page: yes to both, or a bare no
const sn_note1=(sc,w)=>[
  {s:"Both in August?",x:70,y:124,size:76,w:760,col:"blue",at:w("yes","yes to both",-0.4),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"yes · one done badly",x:110,y:250,size:56,col:"amber",at:w("yes","done badly",-0.4),d:0.9},
  {s:"bare no · Clara left",x:110,y:360,size:56,col:"amber",at:w("bare","bare no",-0.2),d:0.9},
  {s:"nothing for the budget",x:150,y:470,size:52,col:"amber",at:w("bare","nothing",-0.3),d:0.9}];
// 2. Noor's page: what the date is for
const sn_note2=(sc,w)=>[
  {s:"What it's for",x:70,y:124,size:76,w:760,col:"blue",at:w("enough","budget need",-0.4),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"budget · current model",x:110,y:250,size:54,col:"orange",at:w("enough","current model",-0.4),d:1.0},
  {s:"asks · new model by Aug",x:110,y:360,size:52,col:"mut",at:w("interest","position",-0.2),d:1.0},
  {s:"needs · a number to trust",x:110,y:460,size:52,col:"green",at:w("interest","a number",-0.2),d:1.0},
  {s:"early warning · Dec",x:110,y:550,size:52,col:"green",at:w("interest","earlier warning",-0.2),d:0.9}];
// 3. Helena's offer
const sn_note3=(sc,w)=>[
  {s:"The offer",x:70,y:124,size:76,w:760,col:"blue",at:w("yes","yes",-0.4),d:0.6,marks:[["under","blue",null,0.3]]},
  {s:"yes · the timetable, done well",x:110,y:250,size:48,col:"green",at:w("yes","timetable",-0.3),d:1.1},
  {s:"no · a new model by August",x:110,y:350,size:48,col:"amber",at:w("no","no new model",-0.2),d:1.0},
  {s:"refresh · Fri 27 Aug",x:110,y:450,size:52,col:"blue",at:w("refresh","refreshed",-0.3),d:0.9},
  {s:"new model · Fri 29 Oct",x:110,y:545,size:52,col:"blue",at:w("october","new model",-0.2),d:0.9}];
