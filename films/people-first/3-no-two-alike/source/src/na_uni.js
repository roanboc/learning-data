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


/* ---------------------------------------------------------------- the boards, as a graphic recording on a sheet pinned over the board
   In the board's own px (1250 by 524): drawn already when it first shows (PK.sk.drawn), and whoever explains adds the last words, a
   tick, a ring or a cross as the voice says them. PK.pace makes a row wait until they can have walked to it, so the last words go on
   from left to right, and nothing is drawn back along words. */
// a drawing in a ring with words after it: (x, y) the words' baseline at their left, the ring before them
const na_item=(c,x,y,ic,s,o)=>{const D=PK.sk;o=o||{};const r=o.r||22;D.disc(c,x-r-14,y-11,r,{fill:"white",col:"ink",w:3});D.icon(c,ic,x-r-14,y-11,r*0.64,{fill:o.fill||"blue"});
  if(s)D.text(c,s,x,y,{size:o.size||36,w:o.w,col:o.col});};
// 1. the plan for two weeks (Helena, at the team's board, on Monday): the two weeks sketched and the eight of the team at its foot;
// she writes each week's last item as the meeting goes on
function na_sheetP(c){const D=PK.sk;
  D.head(c,"Next two weeks",{col:"blue",ref:["Monday 15 February",["the team, all eight",{size:30}]],rsize:32,rx:1030,ry:84});
  for(const [x,s] of[[56,"Week 1"],[640,"Week 2"]])D.panel(c,x,136,554,232,{fill:"blue",line:"blue",title:s,col:"blue"},()=>{});
  na_item(c,140,236,"book","library numbers");na_item(c,140,316,"coin",null);
  na_item(c,724,236,"gear","platform upgrade");na_item(c,724,316,"key",null);
  D.faces(c,110,434,["helena","sam","jun","marta","noor","yusuf","erin","tomas"],{r:26,gap:78});}
const na_boardP=(sc,w)=>[PK.sk.drawn(na_sheetP),
  {s:"fees",x:140,y:316,size:40,w:700,col:"blue",at:w("plan","next two weeks",-0.3),d:0.5},
  {s:"new login",x:724,y:316,size:40,w:700,col:"blue",at:w("quiet","whole hour",-0.2),d:0.8}];
// 2. five broad traits (Carmen): each a soft scale from less to more, with nobody's place on it; she ticks each trait as the voice
// names it, then writes on the ribbon at the foot what they all are
const NA_TRAIT=[["bulb","open to new things"],["cal","organised"],["people","outgoing"],["heart","agreeable"],["anchor","steady under pressure"]];
const naA_y=i=>164+i*52;
function na_sheetA(c){const D=PK.sk;
  D.head(c,"Five broad traits",{col:"blue",ref:["Most research",["often: the Big Five",{size:30}]],rsize:32,rx:1030,ry:84});
  NA_TRAIT.forEach(([ic,s],i)=>{const y=naA_y(i);na_item(c,124,y,ic,s,{size:34,r:20});
    for(const [x0,w0] of[[560,420],[700,280],[840,140]])D.band(c,x0,y-22,w0,22,"blue",0.2);D.line(c,[[560,y-11],[980,y-11]],{col:"blue",w:4,seed:i+2});for(const u of[0,0.5,1])D.line(c,[[560+u*420,y-21],[560+u*420,y-1]],{col:"blue",w:3,seed:i*3+u*7+1});});
  D.text(c,"less",560,404,{size:30,col:"mut",align:"center"});D.text(c,"more",980,404,{size:30,col:"mut",align:"center"});
  D.ribbon(c,"",250,424,{col:"green",fill:[190,228,200],width:760,size:40});}
const na_boardA=(sc,w)=>{const tick=(i,at)=>({k:"tick",x:502,y:naA_y(i)-12,r:15,col:"blue",at,d:0.3});return[PK.sk.drawn(na_sheetA),
  tick(0,w("five","open",-0.3)),tick(1,w("five","organised",-0.3)),tick(2,w("five","outgoing",-0.3)),tick(3,w("five","agreeable",-0.4)),tick(4,w("five","steady",-0.3)),
  {s:"a scale, not a box: by degree",x:630,y:462,size:40,w:700,col:"green",align:"center",at:w("scale","scale",-0.3),d:1.2}];};
// 3. what traits are for, and what shows how someone is doing (Carmen): understanding people, in green; assessing them, in amber,
// crossed out as the voice says never; and the two places to look, ticked
function na_sheetB(c){const D=PK.sk;
  D.head(c,"Traits are for",{col:"blue"});
  D.panel(c,56,132,540,186,{fill:"green",line:"green",title:"Understanding people",col:"green"},(cc,x,y)=>{
    D.faces(cc,x+70,y+58,[PK.extra(3),PK.extra(6),PK.extra(9)],{r:28,gap:84});D.icon(cc,"chat",x+350,y+56,26,{fill:"green"});D.icon(cc,"bulb",x+440,y+56,24,{fill:"green"});});
  D.panel(c,640,132,554,186,{fill:"amber",line:"amber",title:"Assessing them",col:"amber",dash:[10,8]},(cc,x,y)=>{
    D.icon(cc,"scale",x+84,y+58,30,{fill:"amber"});D.icon(cc,"doc",x+164,y+58,26,{fill:"amber"});D.icon(cc,"cards",x+244,y+58,26,{fill:"amber"});});
  D.caps(c,"How someone is doing shows in",60,366,{col:"blue",size:30});
  D.card(c,56,390,{icon:"bars",ifill:"green",lines:["the results of their work"],fill:"paper",w:520,h:84,size:34});
  D.card(c,610,390,{icon:"people",ifill:"green",lines:["how the team works together"],fill:"paper",w:584,h:84,size:34});}
const na_boardB=(sc,w)=>[PK.sk.drawn(na_sheetB),
  {k:"tick",x:556,y:172,r:16,col:"green",at:w("never","understanding",-0.4),d:0.3},
  {k:"cross",x:804,y:250,r:72,col:"amber",at:w("never","never",-0.3),d:0.4},
  {s:"never",x:990,y:300,size:48,w:700,col:"amber",at:w("never","assessing",-0.2),d:0.5},
  {k:"tick",x:540,y:432,r:16,col:"green",at:w("outcomes","results",-0.4),d:0.3},
  {k:"tick",x:1162,y:432,r:16,col:"green",at:w("outcomes","team works",-0.4),d:0.3}];
// 4. a type (Carmen): people along one scale, most of them near the middle, and its two labels; she cuts the scale in two as the
// voice says so, rings the middle, writes what the research council found, and what a small change near the cut does
const NA_BELL=[1,1,2,3,4,5,6,5,4,3,2,1,1];
function na_sheetC(c){const D=PK.sk;
  D.head(c,"A type",{col:"blue",ref:["US National Research Council",["1991",{size:30}]],rsize:30,rx:1000,ry:84});
  D.line(c,[[70,336],[650,336]],{col:"ink",w:4,seed:2});
  NA_BELL.forEach((n,i)=>{for(let k=0;k<n;k++)D.disc(c,94+i*44,314-k*24,10,{fill:[236,164,116],col:"ink",w:2.5});});
  D.box(c,70,362,200,48,{fill:"blue",col:"blue",w:3,r:24});D.text(c,"one label",170,396,{size:30,align:"center"});
  D.box(c,426,362,224,48,{fill:"green",col:"green",w:3,r:24});D.text(c,"another label",538,396,{size:30,align:"center"});
  // the research council's ten who took one such test twice, four filled in; and a scale near its cut, one score moving across it
  D.caps(c,"Took one such test twice",712,176,{col:"blue",size:30});
  D.dots(c,726,210,10,1,{gap:46,r:14,on:4,col:"green"});
  D.text(c,"the scores held up well enough",712,322,{size:30,col:"mut"});
  D.line(c,[[712,382],[1180,382]],{col:"ink",w:4,seed:5});D.line(c,[[946,356],[946,406]],{col:"amber",w:4,seed:6});
  D.disc(c,918,382,11,{fill:[236,164,116],col:"ink",w:2.5});D.arrow(c,[930,360],[966,360],{col:"ink",w:3,head:10,bow:-6});D.disc(c,976,382,11,{fill:[236,164,116],col:"ink",w:2.5});}
const na_boardC=(sc,w)=>[PK.sk.drawn(na_sheetC),
  {k:"line",x:358,y:150,x1:358,y1:352,col:"amber",at:w("type","scale",-0.4),d:0.5},
  {k:"ring",x:358,y:252,rx:118,ry:92,col:"amber",at:w("middle","middle",-0.6),d:0.6},
  {s:"4 in 10: same type again",x:712,y:276,size:40,w:700,col:"green",at:w("again","twice",-0.3),d:1.2},
  {s:"small change, new label",x:712,y:456,size:40,w:700,col:"amber",at:w("steady","near the cut",-0.3),d:1.1}];
// 5. Helena's yes, and her four rules (at the team's board): a card for each, ticked as the voice says it; then a star on the
// three the test's makers ask for themselves
const NA_RULE=[["hand","Each person's choice"],["lock","Your results are yours"],["bars","Degrees, not boxes"],["shield","Never to hire, hand out work or judge"]];
const naR_y=i=>146+i*80;
function na_sheetR(c){const D=PK.sk;
  D.head(c,"Yes, to start talking",{col:"blue",ref:["Thursday 18 February",["four rules",{size:30}]],rsize:32,rx:1040,ry:84});
  NA_RULE.forEach(([ic,s],i)=>{const y=naR_y(i);D.box(c,56,y,880,66,{fill:"blue",col:"blue",w:3,r:14});D.disc(c,96,y+33,22,{fill:"white",col:"ink",w:3});
    D.text(c,String(i+1),96,y+44,{size:30,w:700,align:"center"});D.icon(c,ic,152,y+33,18,{fill:"blue"});D.text(c,s,190,y+45,{size:34});});}
const na_boardR=(sc,w)=>{const m=w("makers","three",-0.2),tick=(i,at)=>({k:"tick",x:984,y:naR_y(i)+33,r:16,col:"blue",at,d:0.3}),star=(i,at)=>({k:"star",x:1064,y:naR_y(i)+33,r:20,col:"green",at,d:0.35});
  return[PK.sk.drawn(na_sheetR),tick(0,w("rules1","choice",-0.4)),tick(1,w("rules1","results",-0.4)),tick(2,w("rules2","degrees",-0.4)),tick(3,w("rules2","never",-0.3)),
    star(0,m),star(1,m+0.4),star(3,m+0.8)];};
// 6. the pages, shared (Helena): seven pages with their writers above them, each page's five headings sketched, two with one left
// out; she writes how many have shared, rings the two pages and writes whose choice that is
const naS_x=i=>78+i*156;
function na_sheetS(c){const D=PK.sk;
  D.head(c,"Seven pages",{col:"green",ref:["Friday 26 February",["a page each",{size:30}]],rsize:32,rx:1040,ry:84});
  ["sam","jun","marta","noor","yusuf","erin","tomas"].forEach((k,i)=>{const x=naS_x(i);D.face(c,k,x+54,166,26,{});
    D.box(c,x,204,108,150,{fill:"white",col:"ink",w:3,r:6});for(let r=0;r<5;r++){if((i===1||i===4)&&r===3)continue;const y=228+r*26;D.line(c,[[x+14,y],[x+(r%2?78:94),y]],{col:"mut",w:3,seed:i*5+r});}});}
const na_boardS=(sc,w)=>[PK.sk.drawn(na_sheetS),
  {s:"Shared: 7 of 7",x:78,y:430,size:44,w:700,col:"green",at:w("friday","all seven",-0.3),d:0.9},
  {k:"ring",x:naS_x(1)+54,y:280,rx:70,ry:94,col:"blue",at:w("friday","Two left",-0.3),d:0.4},{k:"ring",x:naS_x(4)+54,y:280,rx:70,ry:94,col:"blue",at:w("friday","Two left",0.2),d:0.4},
  {s:"theirs to leave",x:760,y:430,size:44,w:700,col:"blue",at:w("friday","theirs",-0.3),d:0.8}];
// 7. the meeting's new steps (Helena): four steps sketched, joined by arrows; she writes when each happens under it
const NA_STEP=[["mail","The question"],["pen","Everyone writes"],["speech","A turn each"],["clock","Anyone adds"]];
const naM_x=i=>56+i*290;
function na_sheetM(c){const D=PK.sk;
  D.head(c,"Our meetings",{col:"blue",ref:["From Monday 22 February",["every meeting she runs",{size:30}]],rsize:32,rx:1010,ry:84});
  NA_STEP.forEach(([ic,s],i)=>{const x=naM_x(i);D.box(c,x,150,250,180,{fill:"blue",col:"blue",w:3,r:16});D.disc(c,x+125,206,34,{fill:"white",col:"ink",w:3});D.icon(c,ic,x+125,206,21,{fill:"blue"});
    D.text(c,s,x+125,296,{size:32,w:700,align:"center"});if(i<3)D.arrow(c,[x+256,240],[x+286,240],{col:"blue",w:4,head:12});});}
const na_boardM=(sc,w)=>{const n=(i,s,at,d)=>({s,x:naM_x(i)+125,y:392,size:34,w:700,col:"blue",align:"center",at,d});return[PK.sk.drawn(na_sheetM),
  n(0,"the day before",w("ways1","day before",-0.3),0.9),n(1,"2 minutes, first",w("ways2","two minutes",-0.4),0.9),n(2,"then, in turn",w("ways2","turn",-0.6),0.8),n(3,"till next day",w("ways3","add",-0.3),0.9)];};

/* ---------------------------------------------------------------- Helena's notebook: what she keeps (the page's own px)
   Each page is sketched already, a heading on a highlighter's band, boxes with drawings and the people's portraits (PK.sk.drawn);
   her pen adds the last words and ticks, each as the voice says it, one stroke after the other (PK.pace(ctx, null, rows)). Nothing is
   below y 800 of the page, where the captions are. */
const NA_PAGE=[PK.SK.page.x,PK.SK.page.y,PK.SK.page.x+PK.SK.page.w,PK.SK.page.y+PK.SK.page.h];
// 1. a data team, read like the school: seven people, no two alike, and one way for all that leaves one out; her pen adds what to do
function na_page1(c){const D=PK.sk;
  D.title(c,"A data team",80,132,{size:84,col:"blue"});
  const team=["sam","jun","marta","noor","yusuf","erin","tomas"],ic=["bulb","chat","clock","pen","people","star","book"],fl=["blue","green","amber","orange","violet","blue","green"];
  team.forEach((k,i)=>{const x=136+i*126;D.face(c,k,x,258,36,{});D.disc(c,x+32,306,18,{fill:"white",col:"ink",w:2.5});D.icon(c,ic[i],x+32,306,11,{fill:fl[i]});});
  D.caps(c,"No two work the same way",96,380,{col:"mut",size:30});
  D.box(c,80,412,540,150,{fill:"amber",col:"amber",w:3,r:16,dash:[10,8]});D.caps(c,"One way for all",104,452,{col:"amber",size:30});
  for(let i=0;i<6;i++)D.icon(c,"person",136+i*80,514,22,{fill:"white"});
  D.icon(c,"person",700,514,22,{fill:"amber"});D.arrow(c,[676,496],[630,474],{col:"amber",w:3,head:12});D.text(c,"leaves one out",744,526,{size:34,col:"amber"});}
const na_note1=(sc,w)=>[PK.sk.drawn(na_page1,NA_PAGE),
  {s:"Find out how each one works",x:96,y:664,size:56,w:700,col:"green",at:w("each","how each",-0.2),d:1.1},
  {s:"the team hears what each knows",x:96,y:762,size:50,at:w("each","hears",-0.3),d:1.1,marks:[["hl","green"]]}];
// 2. what Helena can do that the teacher didn't need to: years against two weeks, and the way round it
function na_page2(c){const D=PK.sk;
  D.title(c,"Knowing each one",80,132,{size:76,col:"blue"});
  D.panel(c,74,180,440,300,{fill:"blue",line:"blue",title:"The teacher in Lu",col:"blue"},(cc,x,y)=>{D.face(cc,NA_LUFOLK.kong,x+96,y+62,50,{});D.icon(cc,"hourglass",x+250,y+62,30,{fill:"blue"});});
  D.panel(c,560,180,440,300,{fill:"amber",line:"amber",title:"Me",col:"amber"},(cc,x,y)=>{D.face(cc,"helena",x+96,y+62,50,{});D.icon(cc,"cal",x+250,y+62,30,{fill:"amber"});});
  D.disc(c,124,598,34,{fill:"white",col:"ink",w:3});D.icon(c,"speech",124,598,21,{fill:"green"});
  D.lines(c,["A person can say","how they work"],180,592,{size:44});}
const na_note2=(sc,w)=>[PK.sk.drawn(na_page2,NA_PAGE),
  {s:"years",x:120,y:454,size:56,w:700,col:"blue",at:w("known","years",-0.6),d:0.5},
  {s:"two weeks",x:606,y:454,size:56,w:700,col:"amber",at:w("known","two weeks",-0.4),d:0.7},
  {s:"So: ask",x:620,y:650,size:72,w:700,col:"green",at:w("say","asks",-0.3),d:0.5,marks:[["ring","green",null]]}];
// 3. people move along their scales: one trait over two or three weeks, round a usual level; two traits over the years; and where
// researchers didn't find the five
function na_page3(c){const D=PK.sk;
  D.title(c,"People move",80,132,{size:84,col:"blue"});
  D.panel(c,74,176,926,272,{fill:"blue",line:"blue",title:"Two or three weeks · one study",col:"blue"},(cc,x,y)=>{
    D.trend(cc,x+40,y+10,400,150,[[0,0.5],[0.08,0.82],[0.16,0.3],[0.25,0.66],[0.33,0.12],[0.42,0.74],[0.5,0.42],[0.58,0.95],[0.66,0.36],[0.75,0.6],[0.83,0.18],[0.92,0.7],[1,0.48]],{col:"orange"});
    D.line(cc,[[x+40,y+85],[x+452,y+85]],{col:"blue",w:3,dash:[10,8],seed:4});});
  D.panel(c,74,474,560,300,{fill:"green",line:"green",title:"The years · many studies",col:"green"},(cc,x,y)=>{
    D.trend(cc,x+40,y+6,300,114,[[0,0.25],[0.5,0.6],[1,0.82]],{col:"green",labels:[[0,"20"],[1,"40"]]});
    D.icon(cc,"cal",x+420,y+60,24,{fill:"green"});D.icon(cc,"anchor",x+490,y+60,24,{fill:"green"});});
  D.sticky(c,664,500,320,190,{col:"sun",rot:0.035,draw:(cc,x,y,w,h)=>D.lines(cc,["Bolivia:","farmers and","foragers"],x+22,y+50,{size:34})});}
const na_note3=(sc,w)=>[PK.sk.drawn(na_page3,NA_PAGE),
  {s:"nearly every level",x:580,y:296,size:44,w:700,at:w("days","two or three weeks",-0.3),d:1.0},
  {s:"round a usual level",x:580,y:376,size:44,w:700,col:"blue",at:w("usual","usual level",-0.3),d:1.0},
  {s:"more organised, steadier",x:114,y:752,size:42,w:700,col:"green",at:w("years","more organised",-0.3),d:1.1},
  {s:"not the last word",x:650,y:752,size:40,w:700,col:"amber",at:w("last","Bolivia",-0.5),d:0.9}];
// 4. what a test can do, and what it can't; and Helena's four rules on a sticky note
function na_page4(c){const D=PK.sk;
  D.title(c,"A test",80,132,{size:88,col:"blue"});
  D.sticky(c,640,60,340,200,{col:"sun",rot:0.03,draw:(cc,x,y,w,h)=>{D.caps(cc,"Four rules",x+22,y+44,{col:"blue",size:30});D.lines(cc,["choice · yours","degrees, not boxes","never to judge"],x+22,y+88,{size:30,lh:1.3});}});
  D.panel(c,74,290,926,220,{fill:"green",line:"green",title:"Can",col:"green"},(cc,x,y)=>{D.face(cc,PK.extra(4),x+80,y+52,40,{});D.icon(cc,"chat",x+170,y+26,26,{fill:"green"});D.face(cc,PK.extra(11),x+260,y+52,40,{});});
  D.panel(c,74,540,926,220,{fill:"amber",line:"amber",title:"Can't",col:"amber",dash:[10,8]},(cc,x,y)=>{D.icon(cc,"scale",x+80,y+52,32,{fill:"amber"});D.icon(cc,"doc",x+180,y+52,28,{fill:"amber"});});}
const na_note4=(sc,w)=>[PK.sk.drawn(na_page4,NA_PAGE),
  {s:"start a conversation",x:420,y:430,size:56,w:700,col:"green",at:w("start","start",-0.3),d:1.0},
  {s:"decide anything",x:420,y:680,size:56,w:700,col:"amber",at:w("start","can't",-0.3),d:0.9}];
// 5. How I work: the page's five headings, each with a drawing and a line for one's own words; the pen ticks each as the voice says it
const NA_HEADS=[["star","When I do my best work"],["mail","How to ask me for something"],["chat","How to disagree with me"],["hourglass","What wears me out"],["sprout","What I'm getting better at"]];
const na5_y=i=>240+i*108;
function na_page5(c){const D=PK.sk;
  D.title(c,"How I work",80,132,{size:88,col:"blue"});D.icon(c,"doc",560,104,30,{fill:"blue"});
  NA_HEADS.forEach(([ic,s],i)=>{const y=na5_y(i);D.disc(c,124,y-14,30,{fill:"white",col:"ink",w:3});D.icon(c,ic,124,y-14,18,{fill:"blue"});D.text(c,s,176,y,{size:44,w:700});
    D.line(c,[[176,y+38],[880,y+38]],{col:"mut",w:2.5,dash:[8,10],seed:i+11});});}
const na_note5=(sc,w)=>{const tick=(i,at)=>({k:"tick",x:950,y:na5_y(i)-14,r:20,col:"green",at,d:0.3});return[PK.sk.drawn(na_page5,NA_PAGE),
  tick(0,w("heads1","best work",-0.6)),tick(1,w("heads1","ask me",-0.5)),tick(2,w("heads2","disagree",-0.5)),tick(3,w("heads2","wears",-0.5)),tick(4,w("heads2","better",-0.5))];};
// 6. Erin's page, in her own notebook: the five headings, and her answers to four of them as lines of her own writing; her pen
// underlines the heading the story is about and writes her answer under it
const na_scrib=(c,x,y,w,seed)=>{const pts=[];for(let i=0;i<=Math.round(w/14);i++)pts.push([x+i*14,y+(i%2?-5:4)+Math.sin(i*1.3+seed)*2]);PK.sk.line(c,pts,{col:"mut",w:2.5,seed});};
const NA_EH=[[236,"When I do my best work"],[340,"How to ask me for something"],[520,"How to disagree with me"],[620,"What wears me out"],[720,"What I'm getting better at"]];
function na_pageE(c){const D=PK.sk;
  D.title(c,"How I work",80,132,{size:84,col:"blue"});D.face(c,"erin",900,112,46,{});
  NA_EH.forEach(([y,s],i)=>{D.text(c,s,110,y,{size:40,w:700,col:"blue"});if(i!==1)na_scrib(c,124,y+40,i===4?460:600,i+3);});}
const na_noteE=(sc,w)=>[PK.sk.drawn(na_pageE,NA_PAGE),
  {k:"under",x:110,y:340,w:600,size:40,col:"blue",at:w("erin","ask me",-0.4),d:0.4},
  {s:"in writing, the day before",x:124,y:440,size:56,w:700,col:"green",at:w("erin","writing",-0.3),d:1.0}];
// 7. on Monday: don't sort (people put in boxes by a type, a test or a first guess), and three things to do, a card each; the pen
// strikes the sorting through, ticks two cards and writes the last words of the third
function na_page6(c){const D=PK.sk;
  D.title(c,"On Monday",80,132,{size:88,col:"blue"});D.icon(c,"cal",580,104,30,{fill:"blue"});
  D.panel(c,74,170,926,196,{fill:"amber",line:"amber",title:"Don't sort",col:"amber",dash:[10,8]},(cc,x,y)=>{
    ["a type","a test","a first guess"].forEach((s,i)=>{const bx=x+30+i*300;D.box(cc,bx,y-2,270,106,{fill:"white",col:"ink",w:3,r:8});D.icon(cc,"person",bx+135,y+28,18,{fill:"white"});
      D.text(cc,s,bx+135,y+86,{size:32,align:"center"});});});
  const card=(y,fill,ic,s)=>{D.box(c,74,y,926,120,{fill,col:"ink",w:3,r:16});D.disc(c,134,y+60,34,{fill:"white",col:"ink",w:3});D.icon(c,ic,134,y+60,21,{fill});D.text(c,s,196,y+76,{size:44});};
  card(392,"blue","chat","Ask each one how they work best");card(532,"blue","doc","Write your own page first");card(672,"green","people","Build the ways");}
const na_note6=(sc,w)=>[PK.sk.drawn(na_page6,NA_PAGE),
  {k:"line",x:104,y:340,x1:974,y1:232,col:"amber",at:w("monday","sort",-0.2),d:0.5},
  {k:"tick",x:950,y:452,r:20,col:"green",at:w("do","Ask",-0.2),d:0.3},
  {k:"tick",x:950,y:592,r:20,col:"green",at:w("do","Write",-0.2),d:0.3},
  {s:"for the whole range",x:540,y:748,size:44,w:700,col:"green",at:w("do","build",-0.3),d:1.0,marks:[["ring","green",null]]}];
