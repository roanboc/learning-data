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


/* ---------------------------------------------------------------- the boards (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Each is drawn as a designer would, a graphic recording pinned over the board, almost done when it first
   shows (PK.sk.drawn); whoever explains adds the last marks and words as the voice says them, on from left to right, and steps clear. */
// 1. what the tests check, and what they can't (Carmen)
const dd_boardA=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"What the tests check",{ref:["4 tests","all pass"],rcol:"green",rsize:32});
    D.panel(c,70,150,570,262,{title:"the form",col:"green",fill:"green"},(cc,x,y)=>{
      // the model's grid, rooms down and hours along, every cell counted once
      for(let j=0;j<4;j++)for(let i=0;i<6;i++)D.box(cc,x+30+i*30,y+16+j*30,24,24,{fill:(i*5+j*3)%4?"green":"white",col:"ink",w:1.6,r:3});
      D.text(cc,"rooms × hours",x+120,y+170,{size:28,align:"center",col:"mut"});
      [["no room twice",y+44],["no hour left out",y+122]].forEach(([s,yy])=>{D.box(cc,x+246,yy-30,34,34,{fill:"white",col:"ink",w:2.5,r:6});D.text(cc,s,x+296,yy,{size:32,w:700});});});
    D.panel(c,680,150,500,262,{title:"the meaning",col:"amber",fill:"amber"},(cc,x,y)=>{D.face(cc,"graham",x+70,y+70,44);
      D.box(cc,x+136,y+18,352,112,{fill:"paper",col:"ink",w:3,r:16});D.line(cc,[[x+140,y+66],[x+122,y+78],[x+140,y+86]],{col:"ink",w:3,seed:3});
      D.text(cc,"used: people in the room,",x+158,y+62,{size:28,w:700});D.text(cc,"not a booking",x+158,y+104,{size:28,col:"mut"});
      D.text(cc,"Graham, in February",x+70,y+166,{size:28,col:"mut"});});}),
  {k:"tick",x:333,y:240,r:18,col:"green",at:w("tests","no room",-0.2),d:0.3},{k:"tick",x:333,y:318,r:18,col:"green",at:w("tests","no hour",-0.2),d:0.3},
  {s:"No test can know it",x:1180,y:466,size:48,w:700,col:"amber",align:"right",at:w("meaning","know",-0.3),d:1.0}];
// 2. the three things Ivy gives the agent (Ivy, at the team's board): a tick as the voice comes to each; the last one's words are hers
const DD_THREE=[["building","the decision","a new building?","for the Council"],["book","the words","room use","from the glossary"],["clock","what counts","teaching hours","8 to 6 · Mon to Fri"]];
const dd_boardB=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Three things, not one",{sub:["for the agent, before it drafts","mut"]});
    DD_THREE.forEach(([ic,h,a,b],i)=>D.panel(c,72+i*372,190,348,214,{title:h,col:"blue",fill:"blue"},(cc,x,y,pw)=>{D.icon(cc,ic,x+46,y+34,26,{fill:"white"});
      D.text(cc,a,x+86,y+46,{size:32,w:700});D.text(cc,b,x+pw/2,y+116,{size:30,align:"center",col:"mut"});}));}),
  {k:"tick",x:104,y:222,r:18,col:"green",at:w("decision","decision",-0.2),d:0.3},{k:"tick",x:476,y:222,r:18,col:"green",at:w("words","room use",-0.2),d:0.3},
  {s:"booked and used, side by side",x:1180,y:466,size:42,w:700,col:"orange",align:"right",at:w("counts","booked",-0.2),d:1.0}];
// 3. the work moves to either side of the draft (Carmen)
const dd_boardC=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Either side of the draft");
    const side=(x,title,col,rows)=>D.panel(c,x,140,370,262,{title,col,fill:col},(cc,px,py)=>rows.forEach(([ic,s],i)=>{D.icon(cc,ic,px+46,py+26+i*62,22,{fill:"white"});D.text(cc,s,px+86,py+38+i*62,{size:32});}));
    side(70,"before it","blue",[["target","the decision"],["book","the words"],["bars","what counts"]]);
    const b=D.card(c,486,212,{icon:"doc",ifill:"violet",lines:[["the draft",{w:700}],["an agent's",{size:30,col:"violet"}]],size:36});
    D.arrow(c,[448,b.y+b.h/2],[b.x-8,b.y+b.h/2],{col:"mut"});D.arrow(c,[b.x+b.w+8,b.y+b.h/2],[810,b.y+b.h/2],{col:"mut"});
    side(812,"after it","green",[["check","check it"],["scale","decide"],["hand","answer for it"]]);}),
  {s:"you frame it",x:255,y:462,size:46,w:700,col:"blue",align:"center",at:w("before","framing",-0.2),d:0.8},
  {s:"you decide",x:1180,y:462,size:46,w:700,col:"green",align:"right",at:w("after","deciding",-0.2),d:0.7}];
// 4. what employers seek (Carmen): the World Economic Forum's report, its numbers as the voice gives them
const dd_boardD=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"What employers seek",{ref:["Future of Jobs","WEF · 2025"],rsize:32});
    D.panel(c,70,140,560,292,{title:"sought most",col:"blue",fill:"blue"},(cc,x,y)=>{D.icon(cc,"bulb",x+56,y+36,30,{fill:"amber"});D.text(cc,"analytical thinking",x+104,y+50,{size:40,w:700});
      for(let i=0;i<10;i++)D.icon(cc,"person",x+50+i*50,y+112,18,{fill:i<7?"blue":"white"});});
    D.panel(c,670,140,510,292,{title:"rising fastest",col:"green",fill:"green"},(cc,x,y)=>{D.trend(cc,x+30,y+12,150,86,[[0,0.1],[0.4,0.3],[0.7,0.55],[1,0.95]],{col:"green"});
      D.text(cc,"AI and big data",x+210,y+64,{size:36,w:700});});}),
  {s:"7 in 10: essential",x:100,y:398,size:44,w:700,col:"green",at:w("seven","Seven",-0.2),d:0.8},
  {s:"+ creativity, curiosity",x:700,y:398,size:40,w:700,col:"green",at:w("rising","creative",-0.2),d:0.9}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): drawn as a designer would,
   a sketched page almost done when it first shows; the pen adds the last marks and words as the voice says them. One pen writes a page. */
// 1. what the agent assumed (Ivy)
const dd_note1=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"What it assumed",86,124,{size:80});
    D.card(c,110,196,{icon:"cal",ifill:"amber",lines:[["booked",{w:700}]],size:44,w:250});
    D.text(c,"=",410,252,{size:64,w:700,align:"center"});
    D.card(c,460,196,{icon:"people",ifill:"green",lines:[["used",{w:700}]],size:44,w:210});
    for(let i=0;i<5;i++)D.box(c,110+i*62,372,46,46,{fill:i===4?"white":"orange",col:"ink",w:2.5,r:6});
    D.text(c,"1 booked hour in 5: nobody there",110,470,{size:38});
    D.sticky(c,660,330,330,120,{col:"sun",rot:0.03,draw:(cc,x,y)=>{D.text(cc,"it said so,",x+24,y+50,{size:34,w:700});D.text(cc,"in its notes",x+24,y+92,{size:32,col:"mut"});}});
    D.text(c,"It had the task,",110,590,{size:48});},[60,40,1040,800]),
  {k:"cross",x:410,y:232,r:30,col:"amber",at:w("harm","bookings",-0.3),d:0.4},
  {k:"tick",x:950,y:372,r:24,col:"green",at:w("common","said what",-0.2),d:0.3},
  {s:"not the decision, or the words",x:110,y:680,size:52,w:700,col:"green",at:w("task","not the decision",-0.3),d:1.1}];
// 2. one room's week, by hand (Ivy): every hour as she worked it out, then what she found
const dd_note2=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"B-204, by hand",86,124,{size:80});D.icon(c,"pen",700,96,34,{fill:"orange"});
    ["Mon","Tue","Wed","Thu","Fri"].forEach((d,i)=>D.text(c,d,166+i*70,212,{size:28,align:"center",col:"mut"}));D.text(c,"8",108,248,{size:28,col:"mut"});D.text(c,"6",108,560,{size:28,col:"mut"});
    // booked and used (green), booked with nobody there (amber), free (white)
    for(let j=0;j<10;j++)for(let i=0;i<5;i++){const k=(i*3+j*7)%10;D.box(c,138+i*70,226+j*34,56,26,{fill:k<5?"green":k<7?"amber":"white",col:"ink",w:1.8,r:4});}
    [["green","booked, used"],["amber","booked, nobody"],["white","free"]].forEach(([col,s],i)=>{D.box(c,560,252+i*64,40,28,{fill:col,col:"ink",w:2,r:4});D.text(c,s,618,276+i*64,{size:32});});
    D.text(c,"50 hours, one by one",560,470,{size:34,w:700,col:"orange"});},[60,40,1040,800]),
  {k:"tick",x:130,y:648,r:30,col:"green",at:w("match","All",-0.3),d:0.3},
  {s:"All 50 match the draft",x:180,y:664,size:56,w:700,col:"green",at:w("match","fifty",-0.1),d:0.8}];
// 3. what goes with the pull request (Ivy): the reasoning, a tick as the voice comes to each
const DD_WHY=[["what I asked for","what she asked"],["what it assumed","what the agent assumed"],["what I changed","what she changed"],["how I checked","how she checked"]];
const dd_note3=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"With the pull request",86,124,{size:72});
    D.card(c,110,180,{icon:"doc",ifill:"green",lines:[["Room use",{w:700}],["pull request · Ivy Reyes",{size:30,col:"mut"}]],size:38});
    DD_WHY.forEach(([s],i)=>{const y=420+i*84;D.box(c,110,y-36,40,40,{fill:"white",col:"ink",w:2.5,r:6});D.text(c,s,176,y,{size:46});});},[60,40,1040,800]),
  {s:"keep the reasoning:",x:110,y:350,size:52,w:700,col:"blue",at:w("reason","reasoning",-0.3),d:0.8},
  ...DD_WHY.map(([,word],i)=>({k:"tick",x:130,y:402+i*84,r:20,col:"green",at:w("reason",word,-0.1),d:0.3}))];
// 4. what an agent can, and can't (Helena)
const dd_note4=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"An agent",86,124,{size:84,col:"violet"});D.icon(c,"gear",530,96,36,{fill:"violet"});
    D.panel(c,100,180,880,236,{title:"can",col:"green",fill:"green"},(cc,x,y)=>[["doc","draft"],["check","test its work"],["chat","say what it assumed"]].forEach(([ic,s],i)=>{
      const cx=x+[130,390,680][i];D.icon(cc,ic,cx,y+44,34,{fill:"white"});D.text(cc,s,cx,y+130,{size:32,w:700,align:"center"});}));
    D.panel(c,100,450,880,300,{title:"can't take",col:"amber",fill:"amber"},()=>{});},[60,40,1040,800]),
  {s:"the decision",x:150,y:604,size:56,w:700,col:"amber",at:w("cant","decision",-0.4),d:0.8},
  {s:"or the responsibility",x:150,y:700,size:56,w:700,col:"amber",at:w("cant","responsibility",-0.4),d:1.0}];
// 5. on Monday (Helena): what to do is there; a tick as the voice comes to each, and the last in her hand
const DD_MON=[["The decision, the words, what counts","one","decision"],["Read what it assumed, to the end","two","Read"],["Check it against what's true","three","Check"]];
const dd_note5=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"On Monday",86,122,{size:88});
    DD_MON.forEach(([s],i)=>{const y=262+i*100;D.disc(c,120,y-16,30,{fill:"blue",col:"ink",w:3});D.text(c,String(i+1),120,y-4,{size:36,w:700,align:"center"});D.text(c,s,170,y,{size:42});});
    D.disc(c,120,546,30,{fill:"amber",col:"ink",w:3});D.text(c,"4",120,558,{size:36,w:700,align:"center"});
    D.sticky(c,150,616,500,180,{col:"sun",rot:-0.02,draw:(cc,x,y)=>{D.text(cc,"two amateurs,",x+26,y+52,{size:32,w:700});D.text(cc,"three computers:",x+26,y+96,{size:32,w:700});
      D.text(cc,"they framed, compared, decided",x+26,y+146,{size:30,col:"blue"});}});},[60,40,1040,800]),
  ...DD_MON.map(([,id,word],i)=>({k:"tick",x:980,y:244+i*100,r:22,col:"green",at:w(id,word,0.4),d:0.3})),
  {s:"Never approve your own",x:170,y:562,size:46,w:700,col:"amber",at:w("four","Never",0),d:0.9}];
