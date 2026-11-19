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

/* ---------------------------------------------------------------- the boards (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). The water board's in the 1990s is written plainly, as an office's was; Carmen's and Helena's are drawn
   as a designer would, a graphic recording pinned over the board, almost done when it first shows (PK.sk.drawn): whoever explains
   adds the last marks and words as the voice says them, on from left to right, and steps clear. */
// 0. the engineers at the Aral, on the water board's wall: what the sea lost
const sn_boardO=(sc,w)=>[
  {s:"The Aral Sea",x:70,y:110,size:64,col:"blue",at:w("shrank","sea shrank",-0.4),d:0.7},
  {s:"surface · −70%",x:110,y:220,size:58,col:"amber",at:w("shrank","seventy percent",-0.4),d:0.9},
  {s:"level · −20 m",x:560,y:220,size:58,col:"amber",at:w("shrank","twenty metres",-0.6),d:0.8},
  {s:"1990 · two seas",x:300,y:340,size:58,at:w("split","split in two",-0.3),d:0.9},
  {s:"north · south",x:760,y:450,size:58,at:w("split","small sea",-0.2),d:0.8}];
// 1. position and interest (Carmen, at the team's board): what is asked, and why
const sn_boardA=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Position and interest",{ref:["Getting to Yes","Fisher · Ury · 1981"],rsize:32});
    D.panel(c,70,150,500,300,{title:"a position",col:"orange",fill:"orange"},(cc,x,y)=>{D.icon(cc,"person",x+56,y+62,32,{fill:"white"});
      D.box(cc,x+118,y+16,340,90,{fill:"paper",col:"ink",w:3,r:16});D.line(cc,[[x+122,y+56],[x+102,y+68],[x+122,y+78]],{col:"ink",w:3,seed:4});
      D.text(cc,"By August.",x+152,y+74,{size:38,w:700});});
    D.arrow(c,[588,306],[652,306],{col:"ink",w:4});D.text(c,"why?",620,284,{size:30,col:"mut",align:"center"});
    D.panel(c,670,150,510,300,{title:"an interest",col:"green",fill:"green"},(cc,x,y)=>{D.icon(cc,"target",x+56,y+62,32,{fill:"white"});
      D.text(cc,"why they ask",x+110,y+74,{size:34,col:"mut"});});}),
  {s:"what is asked",x:110,y:430,size:48,w:700,col:"orange",at:w("position","what someone",-0.2),d:0.8},
  {s:"what it's for",x:1150,y:430,size:48,w:700,col:"green",align:"right",at:w("position","why",-0.2),d:0.8}];
// 2. one list, fair criteria (Carmen): the order comes from value and effort, which both sides can check, never from who asks or who
// pushes harder; she strikes that out last, as the voice says it
const sn_boardB=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"One list, in order");
    D.panel(c,70,140,440,324,{title:"ordered by",col:"blue",fill:"blue"},(cc,x,y)=>D.matrix(cc,x+70,y+32,320,132,{ys:"value",xs:"effort",on:0,col:"green",q:[["first",{size:30}],"","",""],size:28}));
    D.panel(c,540,140,230,324,{title:"never",col:"amber",fill:"amber"},(cc,x,y)=>{D.icon(cc,"person",x+115,y+56,36,{fill:"white"});
      D.text(cc,"who asks,",x+115,y+150,{size:32,w:700,align:"center"});D.text(cc,"who pushes",x+115,y+192,{size:32,w:700,align:"center"});});
    D.panel(c,800,140,380,324,{title:"fair criteria",col:"green",fill:"green"},(cc,x,y)=>{D.icon(cc,"scale",x+60,y+56,32,{fill:"white"});
      D.text(cc,"Fisher · Ury",x+112,y+68,{size:30,col:"mut"});});}),
  {s:"value and effort",x:100,y:450,size:42,w:700,col:"green",at:w("order","value and effort",-0.2),d:1.0},
  {s:"both sides can check",x:1160,y:450,size:36,w:700,col:"green",align:"right",at:w("fair","check",-0.8),d:1.1},
  {k:"line",x:612,y:300,x1:700,y1:216,col:"amber",at:w("fair","not who",-0.1),d:0.4}];
// 3. a positive no (Carmen): a yes, then a clear no, then an offer
const SN_NO=[["yes","green","shield","what you protect","a yes"],["no","amber","cross","said plainly","clear no"],["then","blue","hand","an offer","offer"]];
const sn_boardC=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"A positive no",{ref:["William Ury","2007"],rsize:32});
    SN_NO.forEach(([h,col,ic],i)=>{D.panel(c,70+i*390,150,330,300,{title:(i+1)+" · "+h,col,fill:col},(cc,x,y,pw)=>D.icon(cc,ic,x+pw/2,y+66,42,{fill:"white"}));
      if(i<2)D.arrow(c,[408+i*390,300],[452+i*390,300],{col:"ink",w:4});});}),
  ...SN_NO.map(([,col,,s,word],i)=>({s,x:i<2?235+i*390:1160,y:420,size:40,w:700,col,align:i<2?"center":"right",at:w("ury",word,-0.2),d:0.8}))];
// 4. on Monday (Helena, at the team's board): the list as it was kept, and the four steps; she ticks each step at the board's right
// edge as the voice comes to it, clear of what is written, and adds the last words
const SN_MON=[["ask what the date is for","ask","what it's for"],["put the trade-off on the list","show","trade-off"],["no to the date, and an offer","offer","no to the date"],["let them choose; write it down","write","choose"]];
const sn_boardM=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"On Monday");
    D.panel(c,70,140,380,272,{title:"the one list",col:"blue",fill:"blue"},(cc,x,y,pw)=>[["rooms' data","27 Aug"],["the refresh","27 Aug"],["new model","29 Oct"]].forEach(([a,d],i)=>{
      const yy=y+40+i*62;D.disc(cc,x+30,yy-10,8,{fill:"green",col:"ink",w:2});D.text(cc,a,x+52,yy,{size:30,w:700});D.text(cc,d,x+pw-24,yy,{size:30,col:"mut",align:"right"});}));
    SN_MON.forEach(([s],i)=>{const y=180+i*74;D.disc(c,512,y-12,24,{fill:["blue","orange","amber","green"][i],col:"ink",w:3});D.text(c,String(i+1),512,y-1,{size:30,w:700,align:"center"});D.text(c,s,556,y,{size:36});});}),
  ...SN_MON.map(([,id,word],i)=>({k:"tick",x:1150,y:166+i*74,r:18,col:"green",at:w(id,word,0.3),d:0.3})),
  {s:"keep your word",x:1180,y:470,size:46,w:700,col:"green",align:"right",at:w("write","keep",-0.2),d:0.8}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. Helena's page (Helena): two asks for the same four weeks; she writes what a yes to both and a bare no would each leave
const sn_note1=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Both in August?",86,124,{size:76});
    D.card(c,100,166,{icon:"bars",ifill:"orange",lines:[["Planning",{w:700}],["a new model",{size:30,col:"mut"}]],size:38,w:360});
    D.card(c,620,166,{icon:"cal",ifill:"orange",lines:[["Registrar",{w:700}],["the rooms' data",{size:30,col:"mut"}]],size:38,w:360});
    // August's four weeks, both asks in them, and the two people both need
    D.caps(c,"August",110,390,{size:28,col:"mut"});for(let i=0;i<4;i++)D.box(c,250+i*104,354,92,50,{fill:"amber",col:"ink",w:2.5,r:8});
    D.arrow(c,[280,280],[320,344],{col:"ink",w:3});D.arrow(c,[800,280],[620,344],{col:"ink",w:3});
    D.faces(c,756,378,["jun","noor"],{r:30,names:true,size:28});
    D.panel(c,100,470,420,290,{title:"yes to both",col:"amber",fill:"amber"},(cc,x,y)=>{D.text(cc,"a model untested,",x+30,y+40,{size:32,col:"mut"});D.text(cc,"or the data late",x+30,y+82,{size:32,col:"mut"});});
    D.panel(c,560,470,420,290,{title:"a bare no",col:"amber",fill:"amber"},(cc,x,y)=>{D.face(cc,SN_CLARA,x+70,y+56,42);D.text(cc,"Clara",x+130,y+46,{size:34,w:700});D.text(cc,"Planning",x+130,y+86,{size:30,col:"mut"});});},[60,40,1040,800]),
  {s:"one done badly",x:130,y:720,size:46,w:700,col:"amber",at:w("yes","done badly",-0.4),d:0.9},
  {s:"left with nothing",x:590,y:720,size:44,w:700,col:"amber",at:w("bare","nothing",-0.4),d:0.9}];
// 2. Noor's page (Noor): what the budget needs, Clara's position, and her interests as she names them
const sn_note2=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"What it's for",86,124,{size:76});
    D.panel(c,100,170,880,160,{title:"the budget needs",col:"orange",fill:"orange"},(cc,x,y)=>D.icon(cc,"coin",x+46,y+40,26,{fill:"white"}));
    // Clara's position, as she first asked it
    D.face(c,SN_CLARA,150,420,44);D.box(c,214,372,460,84,{fill:"paper",col:"ink",w:3,r:16});D.line(c,[[218,412],[198,424],[218,432]],{col:"ink",w:3,seed:5});
    D.text(c,"a new model by August",240,428,{size:36,col:"mut"});D.caps(c,"her position",700,424,{size:28,col:"mut"});
    D.panel(c,100,500,880,260,{title:"her interests",col:"green",fill:"green"},(cc,x,y)=>
      [["scale","in the budget",x+40],["warn","for admissions",x+490]].forEach(([ic,s,xx])=>{D.icon(cc,ic,xx+30,y+40,26,{fill:"white"});D.text(cc,s,xx+76,y+104,{size:32,col:"mut"});}));},[60,40,1040,800]),
  {s:"the current model, this year's figures",x:190,y:290,size:40,w:700,col:"orange",at:w("enough","current model",-0.4),d:1.2},
  {s:"a number to trust",x:216,y:600,size:42,w:700,col:"green",at:w("interest","a number",-0.2),d:0.9},
  {s:"earlier warning",x:666,y:600,size:42,w:700,col:"green",at:w("interest","earlier warning",-0.2),d:0.8}];
// 3. Helena's offer (Helena): the yes and the no, then what instead, with its two dates
const sn_note3=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"The offer",86,124,{size:80});
    [["yes","green",212],["no","amber",322]].forEach(([s,col,y])=>{D.box(c,100,y-40,96,54,{fill:col,col:"ink",w:3,r:27});D.text(c,s,148,y-2,{size:34,w:700,align:"center"});});
    D.panel(c,100,390,880,370,{title:"what instead",col:"blue",fill:"blue"},(cc,x,y)=>{D.line(cc,[[x+60,y+50],[x+60,y+176]],{col:"ink",w:3,seed:6});
      [["Fri 27 Aug","for the budget",y+56],["Fri 29 Oct","before admissions",y+186]].forEach(([d,g,yy])=>{D.disc(cc,x+60,yy-12,14,{fill:"blue",col:"ink",w:3});
        D.text(cc,d,x+100,yy,{size:40,w:700});D.text(cc,g,x+370,yy+46,{size:30,col:"mut"});});});},[60,40,1040,800]),
  {s:"the timetable, done well",x:220,y:212,size:46,w:700,col:"green",at:w("yes","timetable",-0.3),d:1.0},
  {s:"no new model by August",x:220,y:322,size:46,w:700,col:"amber",at:w("no","no new model",-0.2),d:1.0},
  {s:"the model, refreshed",x:470,y:506,size:42,w:700,col:"blue",at:w("refresh","refreshed",-0.3),d:0.9},
  {s:"the new model",x:470,y:636,size:42,w:700,col:"blue",at:w("october","new model",-0.2),d:0.8}];
