/* ===== Less, on purpose: the university, May and June 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, the corner, the campus and a teaching
   room; and, apart from the scene, a board seen close and a page of a notebook (concepts.js). This file holds what is this film's own
   in them: where the team works, the boards' rows Carmen Vidal and Helena write, and the pages Ivy and Helena keep.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green value or something done, amber a cost or something waiting. */
AG_PLACES.loTeam=PK.place.team;AG_PLACES.loCorner=PK.place.corner;AG_PLACES.loCampus=PK.place.campus;AG_PLACES.loLecture=PK.place.lecture;
AG_PLACES.loBoard=PK.place.board;AG_PLACES.loNotes=c=>PK.place.notes(c,{});
const LO_T=PK.ROOMS.team,LO_CA=PK.ROOMS.campus,LO_CO=PK.ROOMS.corner,LO_LE=PK.ROOMS.lecture;
const lo_hT=fl=>PK.hAt(fl,LO_T.eye),lo_hC=fl=>PK.hAt(fl,LO_CA.eye),lo_hL=fl=>PK.hAt(fl,LO_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const lo_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const lo_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const LO_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const LO_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const LO_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const lo_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function lo_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const LO_DESK={sam:[1230,LO_T.back],jun:[1808,LO_T.back],marta:[560,LO_T.mid]};
function lo_team(x,tt,o){o=o||{};const r={},HB=lo_hT(LO_T.back),HM=lo_hT(LO_T.mid);PK.clock(x,LO_T.clock[0],LO_T.clock[1],LO_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:LO_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),LO_DESK.sam[0],LO_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:LO_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",LO_DESK.jun[0],LO_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:LO_T.mid,i:2,draw:c=>{r.marta=lo_desk(c,o.marta===null?null:(o.deskWho||"marta"),LO_DESK.marta[0],LO_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.loTeam=(x,tt)=>lo_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const LO_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const lo_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},LO_RB,{h:lo_hT(LO_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const LO_SIDE={x:1690,floor:900},LO_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function lo_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=lo_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||lo_lis(tt,-0.2)),people:[
    {fl:LO_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",LO_SAMC.x,LO_SAMC.floor,lo_hT(LO_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||lo_lis(tt,-0.25)));}},
    {fl:LO_RB.floor,draw:c=>{Jc=lo_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:LO_SIDE.floor,draw:c=>{R2=PK.person(c,o.side||(o.who==="helena"?"ivy":"helena"),LO_SIDE.x,LO_SIDE.floor,lo_hT(LO_SIDE.floor),PK.poseMix("clasp",LO_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||lo_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const LO_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},LO_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const LO_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function lo_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=LO_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(LO_SITH,LO_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,LO_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,LO_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const LO_LE2=PK.ROOMS.lecture;
function lo_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function lo_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){if(!n)continue;const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-10,w,24),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+50,{w:700,size:30,color:U.css(PK.C.ink)});y+=86;}}







/* ---------------------------------------------------------------- the boards (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). The design principles in 2012 are written plainly, as an office's board was; Carmen's and Helena's are
   drawn as a designer would, a graphic recording pinned over the board, almost done when it first shows (PK.sk.drawn): whoever
   explains adds the last marks and words as the voice says them, on from left to right, and steps clear. */
// 0. the Government Digital Service's design principles, 2012 (a designer, at its office's board)
const lo_boardO=(sc,w)=>[
  {s:"Design principles",x:70,y:110,size:60,col:"blue",at:w("rules","design principles",-0.3),d:0.9},
  {s:"1 · start with needs",x:110,y:230,size:56,at:w("rules","start with",-0.2),d:1.0},
  {s:"2 · do less",x:560,y:340,size:60,col:"green",at:w("rules","do less",-0.2),d:0.6},
  {s:"only what only government can do",x:300,y:450,size:48,at:w("only","only do",-0.3),d:1.4}];
// 1. the series' four ideas (Carmen, at the team's board): one film each; she rings the first, and writes what it means
const LO_IDEAS=[["minimalism","minus","green","Less, on purpose"],["kaizen","up","blue","One small change"],["Ubuntu","people","orange","The team first"],["emergence","sprout","violet","Rules to decide"]];
const lo_boardA=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Leading a team",{sub:["four ideas, a film each","mut"]});
    LO_IDEAS.forEach(([h,ic,col,f],i)=>D.panel(c,70+i*280,170,262,236,{title:h,col,fill:col},(cc,x,y,pw)=>{D.icon(cc,ic,x+pw/2,y+50,36,{fill:"white"});
      D.text(cc,f,x+pw/2,y+140,{size:28,col:"mut",align:"center"});}));}),
  {k:"ring",x:201,y:210,rx:118,ry:34,col:"green",at:w("first","minimalism",-0.2),d:0.5},
  {s:"keep what does a job, well",x:1180,y:468,size:46,w:700,col:"green",align:"right",at:w("first","keeping",-0.2),d:1.2}];
// 2. everything on one wall (Helena, at the team's board): the wall's three kinds of thing, and what the logs say
const lo_boardB=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Everything we run");
    D.panel(c,70,150,520,300,{title:"reports",col:"orange",fill:"orange"},(cc,x,y)=>D.dots(cc,x+40,y+30,19,2,{gap:23,r:8,on:17,col:"amber"}));
    D.panel(c,620,150,260,300,{title:"meetings",col:"amber",fill:"amber"},(cc,x,y,pw)=>D.icon(cc,"clock",x+pw/2,y+50,36,{fill:"white"}));
    D.panel(c,910,150,270,300,{title:"alerts",col:"amber",fill:"amber"},(cc,x,y,pw)=>D.icon(cc,"bolt",x+pw/2,y+50,36,{fill:"white"}));}),
  {s:"38 · 17 unopened",x:110,y:400,size:48,w:700,col:"orange",at:w("reports","38",-0.2),d:1.1},
  {s:"8 h a week",x:750,y:400,size:42,w:700,col:"amber",align:"center",at:w("meetings","eight hours",-0.3),d:0.8},
  {s:"60 a week",x:1045,y:340,size:42,w:700,col:"amber",align:"center",at:w("alerts","60 alerts",-0.2),d:0.7},
  {s:"most: nothing",x:1160,y:420,size:36,col:"mut",align:"right",at:w("alerts","need nothing",-0.4),d:0.7}];
// 3. what each thing is for (Carmen): a meeting, an alert and a report, each with what it's for in her hand
const lo_boardC=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"What each is for");
    D.panel(c,70,140,380,320,{title:"a meeting",col:"blue",fill:"blue"},(cc,x,y)=>{D.icon(cc,"people",x+56,y+46,30,{fill:"white"});
      D.face(cc,"noor",x+214,y+44,24);D.face(cc,"jun",x+270,y+44,24);D.face(cc,"sam",x+326,y+44,24);
      D.text(cc,"reading out",x+30,y+214,{size:30,col:"mut"});D.text(cc,"the board",x+30,y+252,{size:30,col:"mut"});});
    D.panel(c,480,140,360,320,{title:"an alert",col:"amber",fill:"amber"},(cc,x,y)=>{D.icon(cc,"bolt",x+56,y+46,30,{fill:"white"});
      D.icon(cc,"clock",x+236,y+46,26,{fill:"white"});D.icon(cc,"phone",x+300,y+46,26,{fill:"white"});});
    D.panel(c,870,140,310,320,{title:"a report",col:"orange",fill:"orange"},(cc,x,y)=>{D.icon(cc,"doc",x+56,y+46,30,{fill:"white"});
      D.bars(cc,x+150,y+6,120,70,[{v:2,col:"orange"},{v:3,col:"orange"},{v:5,col:"green"}],{size:28});});}),
  {s:"decide or help",x:100,y:330,size:44,w:700,col:"blue",at:w("meeting","deciding",-0.2),d:1.0},
  {k:"line",x:92,y:416,x1:280,y1:400,col:"amber",at:w("meeting","reading out",-0.3),d:0.4},
  {s:"someone acts now",x:505,y:330,size:38,w:700,col:"amber",at:w("alert","act now",-0.4),d:1.0},
  {s:"a decision",x:1160,y:330,size:44,w:700,col:"orange",align:"right",at:w("report","report",0),d:0.8}];
// 4. less, but better (Carmen): where the word comes from, two ideas from Japan, and Rams's three words, each drawn at the left; she
// writes what each means in the column at their right, as the voice says it, and strikes out "waste": the team never calls work waste
const lo_boardD=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Less, but better");
    const row=(i,title,col,draw)=>{const y=150+i*80;D.box(c,70,y,96,64,{fill:col,col:"ink",w:3,r:8});draw(118,y+32);D.caps(c,title,190,y+44,{size:28,col});
      D.line(c,[[450,y+34],[520,y+34]],{col:"mut",w:2.5,dash:[8,10],seed:i+3});};
    row(0,"art · 1960s","blue",(x,y)=>{D.box(c,x-36,y-14,26,26,{fill:"white",col:"ink",w:2.5,r:2});D.box(c,x-2,y-14,10,26,{fill:"white",col:"ink",w:2.5,r:2});D.disc(c,x+24,y-1,13,{fill:"white",col:"ink",w:2.5});});
    row(1,"kanso","green",(x,y)=>{D.box(c,x-34,y-14,68,28,{fill:"white",col:"ink",w:2.5,r:4});D.disc(c,x,y,4,{fill:"green",col:"ink",w:1.5});});
    row(2,"muda · lean","amber",(x,y)=>D.icon(c,"gear",x,y,20,{fill:"white"}));
    row(3,"Dieter Rams","green",(x,y)=>D.icon(c,"star",x,y,20,{fill:"white"}));}),
  {s:"simplest forms",x:540,y:196,size:44,w:700,col:"blue",at:w("art","simplest forms",-0.3),d:0.9},
  {s:"simplicity",x:540,y:276,size:44,w:700,col:"green",at:w("kanso","simplicity",-0.3),d:0.7},
  {s:"waste",x:540,y:356,size:44,w:700,col:"amber",at:w("lean","waste",-0.2),d:0.5,marks:[["strike","ink",w("never","never",-0.2),0.4]]},
  {s:"less, but better",x:540,y:436,size:48,w:700,col:"green",at:w("rams","less, but better",-0.2),d:1.0}];
// 5. one rule to keep the time (Helena, at the team's board): what anything new needs, and the quarter's look back
const LO_NEEDS=[["eye","a reader"],["q","a reason"],["person","an owner"]];
const lo_boardE=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"One rule");
    D.panel(c,70,140,700,320,{title:"anything new needs",col:"green",fill:"green"},(cc,x,y)=>LO_NEEDS.forEach(([ic,s],i)=>{const cx=x+110+i*230;D.icon(cc,ic,cx,y+60,36,{fill:"white"});D.text(cc,s,cx,y+150,{size:36,w:700,align:"center"});}));
    D.panel(c,800,140,380,320,{title:"each quarter",col:"blue",fill:"blue"},(cc,x,y,pw)=>D.icon(cc,"cal",x+pw/2,y+60,36,{fill:"white"}));}),
  ...LO_NEEDS.map(([,s],i)=>({k:"tick",x:180+i*230+80,y:236,r:18,col:"green",at:w("rule",s,0.2),d:0.3})),
  {s:"all back on the wall",x:1160,y:400,size:36,w:700,col:"blue",align:"right",at:w("review","quarterly",-0.3),d:1.0}];
// 6. on Monday (Helena, at the board seen close): the wall as it was kept, and the four steps; she ticks each at the board's right
// edge as the voice comes to it, clear of what is written, and adds the last words
const LO_MON=[["list everything you run","list","list everything"],["ask who uses it, for what","who","who uses"],["stop the rest, openly","stop","Stop the rest"],["measure the time back","time","Measure"]];
const lo_boardM=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"On Monday");
    D.panel(c,70,140,380,272,{title:"the wall",col:"blue",fill:"blue"},(cc,x,y)=>{for(let i=0;i<10;i++){const kept=[0,2,3,5,8].includes(i),bx=x+34+(i%5)*64,by=y+20+Math.floor(i/5)*84;
      D.box(cc,bx,by,50,50,{fill:kept?"green":"white",col:kept?"ink":"mut",w:2.5,r:4,dash:kept?null:[6,6]});}
      D.text(cc,"kept: what people use",x+34,y+192,{size:28,col:"mut"});});
    LO_MON.forEach(([s],i)=>{const y=180+i*74;D.disc(c,512,y-12,24,{fill:["blue","orange","amber","green"][i],col:"ink",w:3});D.text(c,String(i+1),512,y-1,{size:30,w:700,align:"center"});D.text(c,s,556,y,{size:36});});}),
  ...LO_MON.map(([,id,word],i)=>({k:"tick",x:1150,y:166+i*74,r:18,col:"green",at:w(id,word,0.3),d:0.3})),
  {s:"and protect it",x:1180,y:470,size:46,w:700,col:"green",align:"right",at:w("time","protect",-0.2),d:0.8}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. Ivy's page (Ivy): what people do to make something better; the pen adds what the study found, as the voice says it
const lo_note1=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"We add",86,124,{size:84});
    D.sticky(c,640,60,300,104,{col:"sun",rot:0.03,draw:(cc,x,y)=>{D.text(cc,"Nature, 2021",x+26,y+48,{size:34,w:700});D.text(cc,"a study",x+26,y+86,{size:30,col:"mut"});}});
    D.panel(c,100,190,420,260,{title:"to improve: add",col:"orange",fill:"orange"},(cc,x,y)=>{for(let i=0;i<10;i++)D.icon(cc,"plus",x+50+(i%5)*80,y+24+Math.floor(i/5)*58,18,{fill:"orange"});});
    D.panel(c,560,190,420,260,{title:"or take away",col:"green",fill:"green"},(cc,x,y)=>D.icon(cc,"minus",x+210,y+86,22,{fill:"green"}));
    for(let i=0;i<10;i++)D.icon(c,"person",140+i*82,560,24,{fill:i===0?"green":"white"});},[60,40,1040,800]),
  {s:"mostly add",x:130,y:428,size:46,w:700,col:"orange",at:w("study","add",-0.4),d:0.7},
  {s:"rarely",x:590,y:428,size:46,w:700,col:"amber",at:w("away","rarely",-0.2),d:0.5},
  {s:"1 in 10 took something away",x:110,y:690,size:48,w:700,col:"green",at:w("uni","one in ten",-0.2),d:1.2}];
// 2. Helena's page (Helena): the week they want, its meetings in place; she names them as the voice does, and writes the hours
const lo_note2=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"The week",86,124,{size:84});
    ["Mon","Tue","Wed","Thu","Fri"].forEach((d,i)=>{const x=150+i*168;D.text(c,d,x+70,212,{size:30,col:"mut",align:"center"});D.box(c,x,228,140,26,{fill:"blue",col:"ink",w:2,r:5});
      if(i===0)D.box(c,x,266,140,64,{fill:"blue",col:"ink",w:2.5,r:6});if(i===3)D.box(c,x,266,140,64,{fill:"green",col:"ink",w:2.5,r:6});if(i===2)D.box(c,x,266,140,34,{fill:"amber",col:"ink",w:2.5,r:6});});
    [["blue",410],["green",500]].forEach(([col,y])=>D.box(c,110,y-30,36,30,{fill:col,col:"ink",w:2,r:4}));},[60,40,1040,800]),
  {s:"stand-up 15 min · planning Mon",x:170,y:410,size:44,w:700,col:"blue",at:w("week","stand-up",-0.3),d:1.3},
  {s:"review · one-to-one",x:170,y:500,size:44,w:700,col:"green",at:w("more","review",-0.2),d:1.0},
  {s:"3 h a week, not 8",x:110,y:650,size:62,w:700,col:"green",at:w("hours","three hours",-0.2),d:0.9}];
// 3. Helena's page (Helena): the team, each with time back, and what it adds up to
const lo_note3=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"The time back",86,124,{size:80});
    for(let i=0;i<8;i++){const x=150+i*100;D.icon(c,"person",x,316,26,{fill:"white"});D.icon(c,"clock",x,378,17,{fill:"green"});}
    D.line(c,[[120,408],[120,428],[900,428],[900,408]],{col:"ink",w:3,seed:3});D.arrow(c,[510,436],[510,498],{col:"ink",w:3.5});
    D.disc(c,510,562,56,{fill:"green",col:"ink",w:3});D.text(c,"40 h",510,576,{size:38,w:700,align:"center"});},[60,40,1040,800]),
  {s:"5 h a week back, each",x:110,y:236,size:48,w:700,col:"green",at:w("hours","five hours",-0.3),d:1.0},
  {s:"= one person's whole week",x:110,y:720,size:54,w:700,col:"green",at:w("hours","whole week",-0.3),d:1.1}];
