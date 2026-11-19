/* ===== Many hats, one picture: the university, March 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows that Carmen Vidal, Jun and Helena write, and the pages Helena keeps.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.mhTeam=PK.place.team;AG_PLACES.mhCorner=PK.place.corner;AG_PLACES.mhCampus=PK.place.campus;AG_PLACES.mhLecture=PK.place.lecture;
AG_PLACES.mhBoard=PK.place.board;AG_PLACES.mhNotes=c=>PK.place.notes(c,{});
const MH_T=PK.ROOMS.team,MH_CA=PK.ROOMS.campus,MH_CO=PK.ROOMS.corner,MH_LE=PK.ROOMS.lecture;
const mh_hT=fl=>PK.hAt(fl,MH_T.eye),mh_hC=fl=>PK.hAt(fl,MH_CA.eye),mh_hL=fl=>PK.hAt(fl,MH_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const mh_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const mh_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const MH_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const MH_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const MH_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const mh_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const MH_DESK={sam:[1230,MH_T.back],jun:[1808,MH_T.back],marta:[560,MH_T.mid]};
function mh_team(x,tt,o){o=o||{};const r={},HB=mh_hT(MH_T.back),HM=mh_hT(MH_T.mid);PK.clock(x,MH_T.clock[0],MH_T.clock[1],MH_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:MH_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:"sam",MH_DESK.sam[0],MH_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:MH_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",MH_DESK.jun[0],MH_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:MH_T.mid,i:2,draw:c=>{r.marta=PK.atDesk(c,o.marta===null?null:"marta",MH_DESK.marta[0],MH_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.mhTeam=(x,tt)=>mh_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const MH_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const mh_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},MH_RB,{h:mh_hT(MH_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const MH_SIDE={x:1690,floor:900},MH_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function mh_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=mh_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||mh_lis(tt,-0.2)),people:[
    {fl:MH_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",MH_SAMC.x,MH_SAMC.floor,mh_hT(MH_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||mh_lis(tt,-0.25)));}},
    {fl:MH_RB.floor,draw:c=>{Jc=mh_roomBoard(c,tt,o.rows||[],"carmen",{say:o.say,events:o.events});}},
    {fl:MH_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",MH_SIDE.x,MH_SIDE.floor,mh_hT(MH_SIDE.floor),PK.poseMix("clasp",MH_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||mh_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const MH_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},MH_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const MH_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function mh_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=MH_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(MH_SITH,MH_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,MH_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,MH_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Mei shows Ivy the room as the timetable names it; Sam shows her the sensor over the door that counts the people in it every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const MH_LE2=PK.ROOMS.lecture;
function mh_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function mh_panel(cc,bx,by,bw,bh,head,rows,bars){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-6,w,30),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+62,{w:700,size:30,color:U.css(PK.C.ink)});y+=96;}}

/* ---------------------------------------------------------------- the boards (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Each is drawn as a designer would, a graphic recording pinned over the board, almost done when it first
   shows (PK.sk.drawn); whoever explains adds the last words, at the right or the foot, as the voice says them, and steps clear. */
// what each of them keeps: their hats, as small drawings
const MH_HATS=[["mei",["cal","door"]],["sam",["db","sensor"]],["jun",["gear","book"]],["noor",["map","pen"]]];
// 1. one role, two sides (Carmen)
const mh_boardA=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk,r=D.head(c,"Managing and leading",{sub:["two sides of one role","blue"]});
    D.caps(c,"· not rivals",110+D.capsW(c,"two sides of one role")+18,r.y1+50,{col:"amber"});
    D.panel(c,90,190,470,212,{title:"managing",col:"blue",fill:"blue"},(cc,x,y,pw)=>{[["target",x+95],["cal",x+235],["bars",x+375]].forEach(([k,ix])=>D.icon(cc,k,ix,y+44,32,{fill:"white"}));
      D.text(cc,"plans · dates · measures",x+pw/2,y+124,{size:34,align:"center"});});
    D.arrow(c,[574,296],[676,296],{col:"blue",bow:-16});
    D.panel(c,690,190,470,212,{title:"leading",col:"green",fill:"green"},(cc,x,y,pw)=>{D.faces(cc,x+85,y+40,["mei","sam","jun","noor"],{r:28,gap:100});
      D.text(cc,"the people",x+pw/2,y+124,{size:34,align:"center"});});}),
  {s:"serve the people",x:1160,y:462,size:52,w:700,col:"green",align:"right",at:w("role","serve the people",-0.2),d:0.9}];
// 2. where data is born, and where it goes (Noor, at the team's board)
const mh_boardB=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Where data is born",{sub:["the map, kept by Noor","mut"]});
    D.card(c,80,200,{icon:"cal",ifill:"orange",lines:[["timetable",{w:700}],["Mei",{col:"mut",size:30}]],size:34,w:290});
    D.card(c,80,340,{icon:"sensor",ifill:"orange",lines:[["sensors",{w:700}],["Sam",{col:"mut",size:30}]],size:34,w:290});
    D.arrow(c,[384,250],[456,300],{col:"orange"});D.arrow(c,[384,390],[456,330],{col:"orange"});
    D.flow(c,466,270,[{s:"platform",icon:"db",ifill:"orange"},{s:"models",icon:"gear",ifill:"orange"},{s:"the page",icon:"bars",ifill:"green"}],{size:32,gap:50,h:92});}),
  {s:"→ where it goes",x:700,y:112,size:50,w:700,col:"blue",at:w("noor","where it goes",-0.2),d:0.9}];
// 3. each of them (Carmen)
const mh_boardC=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Deep in one part");D.caps(c,"and right about it",700,96,{col:"green"});
    MH_HATS.forEach(([k,ic],i)=>{const x=80+i*275;D.box(c,x,150,250,256,{fill:"paper",r:16});D.face(c,k,x+125,206,38);
      D.text(c,PK.CAST[k].name.split(" ")[0],x+125,310,{size:36,w:700,align:"center"});ic.forEach((q,j)=>D.icon(c,q,x+85+j*80,362,26,{fill:"orange"}));});}),
  {s:"more hats than a title says",x:1160,y:464,size:48,w:700,col:"amber",align:"right",at:w("deep","more hats",-0.2),d:1.1}];
// 4. the whole route of Graham's question, from his decision down (Ivy, at the team's board); its last row, the rule, is hers to add.
// A star by the decision and the question comes in a later chapter (mh_route: where each row's end is)
const MH_ROUTE={x:84,y:164,gap:66,star:880};
const mh_boardD=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk,R=MH_ROUTE;D.paper(c);D.ribbon(c,"The whole route",110,30,{col:"blue",size:44});
    D.line(c,[[R.x+16,R.y-12],[R.x+16,R.y+R.gap*4-12]],{col:"mut",w:3,dash:[10,10],seed:4});
    D.list(c,R.x,R.y,[{icon:"building",s:"Decision: ask for a building?",sub:"Council, June",col:"blue"},{icon:"q",s:"Question: too few rooms, or at some hours?",col:"blue"},
      {icon:"db",s:"Data: bookings beside counts",col:"orange"},{icon:"sensor",s:"Born: timetable · sensors",col:"orange"},{icon:"people",s:"Kept by: Mei, Sam, Jun, Noor",col:"green"}],{size:34,gap:R.gap,subSize:30});
    D.panel(c,950,140,236,272,{title:"kept by",col:"green",fill:"green"},(cc,x,y)=>{["mei","sam","jun","noor"].forEach((k,i)=>{const fx=x+66+(i%2)*104,fy=y+44+(i>>1)*104;D.face(cc,k,fx,fy,30);});});}),
  {s:"Rule: counts, never people",x:1160,y:466,size:46,w:700,col:"blue",align:"right",at:w("keeps","counts",-0.3),d:1.0}];
// 5. the T (Carmen)
const mh_boardE=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"T-shaped");
    D.face(c,"ivy",250,290,56,{ring:"blue"});D.text(c,"Ivy",250,410,{size:36,w:700,align:"center"});
    D.box(c,520,190,500,42,{fill:"green",col:"ink",w:3,r:10});D.box(c,738,190,64,262,{fill:"blue",col:"ink",w:3,r:10});
    [["business",610],["systems",930]].forEach(([s,x])=>D.text(c,s,x,276,{size:30,align:"center",col:"green"}));
    D.text(c,"depth",830,362,{size:42,w:700,col:"blue"});D.text(c,"statistics",830,406,{size:32,col:"mut"});}),
  {s:"enough of the rest",x:770,y:170,size:42,w:700,col:"green",align:"center",at:w("t","across the top",0.8),d:0.8}];
// 6. the maps of the work (Carmen)
const mh_boardF=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Maps of the work");
    D.panel(c,80,140,500,262,{title:"SFIA",col:"blue",fill:"blue"},(cc,x,y)=>{D.dots(cc,x+44,y+26,18,6,{gap:23,r:7,on:108,col:"blue"});
      D.text(cc,"over a hundred skills",x+250,y+186,{size:34,align:"center"});});
    D.panel(c,660,140,500,262,{title:"DAMA",col:"green",fill:"green"},(cc,x,y)=>{D.donut(cc,x+130,y+92,72,Array.from({length:11},(_,i)=>({v:1,col:["blue","green","orange","amber","violet"][i%5]})));
      D.lines(cc,["the roles","of data work"],x+250,y+80,{size:34});});}),
  {s:"Nobody holds them all",x:1160,y:464,size:50,w:700,col:"amber",align:"right",at:w("nobody","Nobody",-0.2),d:0.9}];
// 7. range (Carmen): a game with fixed rules beside a tangle
const mh_boardG=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Range",{ref:["David Epstein","Range, 2019"],rsize:32});
    D.panel(c,80,160,500,252,{title:"fixed rules",col:"blue",fill:"blue"},(cc,x,y)=>{for(let i=0;i<4;i++)for(let j=0;j<4;j++)D.box(cc,x+50+i*40,y+18+j*40,40,40,{fill:(i+j)%2?"white":"ink",col:"ink",w:2,r:2});
      D.icon(cc,"target",x+360,y+66,40,{fill:"blue"});D.text(cc,"specialists",x+360,y+160,{size:34,w:700,align:"center"});});
    D.panel(c,660,160,500,252,{title:"messy problems",col:"green",fill:"green"},(cc,x,y)=>{const P=[];for(let i=0;i<14;i++){const a=i*2.4,r=40+(i*29)%60;P.push([x+130+Math.cos(a)*r,y+90+Math.sin(a)*r*0.7]);}
      D.line(cc,P,{col:"ink",w:3,seed:12});});}),
  {s:"range",x:1060,y:330,size:64,w:700,col:"green",align:"center",at:w("messy","messy",-0.2),d:0.8}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): a sketched page, almost
   done when it first shows (PK.sk.drawn), and the last words the pen adds as the voice says them. The ink stays above y 800 */
// the route of a question, five stops along a path, each with a word under it (ticked: done)
function mh_stops(c,x,y,gap,ticked){const D=PK.sk,S=[["building","decision"],["q","question"],["db","data"],["sensor","born"],["people","kept"]];
  D.line(c,[[x,y],[x+gap*4,y]],{col:"mut",w:3,dash:[10,10],seed:8});
  S.forEach(([k,s],i)=>{const cx=x+i*gap;D.disc(c,cx,y,40,{fill:"white",col:"ink",w:3});D.icon(c,k,cx,y,24,{fill:i<2?"blue":i<4?"orange":"green"});
    D.text(c,s,cx,y+84,{size:32,align:"center",col:"mut"});if(ticked)D.icon(c,"check",cx+34,y-34,16,{fill:"green"});});}
// 1. Ivy's first goals
const mh_note1=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"My first goals",86,124);D.icon(c,"flag",930,96,40,{fill:"blue"});
    D.sticky(c,80,186,880,150,{col:"sun",rot:-0.01,draw:(cc,x,y)=>{D.icon(cc,"building",x+70,y+82,40,{fill:"blue"});
      D.text(cc,"Graham: too few rooms,",x+140,y+70,{size:40,w:700});D.text(cc,"or too few at some hours?",x+140,y+122,{size:40,w:700});}});
    mh_stops(c,150,452,180,false);},[60,56,1040,800]),
  {s:"By Easter: the whole route",x:90,y:672,size:58,w:700,col:"green",at:w("first","By Easter",-0.2),d:1.2},
  {s:"of one question's data",x:90,y:760,size:54,at:w("first","data",-0.6),d:0.9}];
// 2. what Ivy takes from each
const mh_note2=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"From each of them",86,124);
    MH_HATS.forEach(([k],i)=>{const x=150+i*215;D.face(c,k,x,240,40);D.text(c,PK.CAST[k].name.split(" ")[0],x,334,{size:36,w:700,align:"center"});});
    let x=80;for(const [ic,s,col] of [["chat","their words","blue"],["wrench","their tools","blue"],["warn","what worries them","amber"]])
      x+=D.card(c,x,394,{icon:ic,ifill:col,lines:[[s,{w:700}]],size:34,h:96}).w+26;},[60,56,1040,800]),
  {s:"Who uses this, for which decision?",x:90,y:620,size:50,w:700,col:"green",at:w("ask","who uses",-0.2),d:1.3,marks:[["under","green",null,0.4]]}];
// 3. what Helena needs from Ivy
const mh_note3=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Ivy",86,124,{size:88});D.face(c,"ivy",320,96,44);
    D.card(c,110,200,{icon:"bars",ifill:"blue",lines:[["keep her depth",{w:700,col:"blue"}],["statistics",{size:36}]],size:42});
    D.caps(c,"and learn enough of",110,404,{col:"green",size:30});
    let x=110;const ends=[];[["building","business"],["gear","systems"],["db","data"]].forEach(([ic,s])=>{const b=D.card(c,x,432,{icon:ic,ifill:"green",lines:[[s,{w:700}]],size:34});ends.push(b.x+b.w/2);x=b.x+b.w+24;});
    // a brace under the three: what the last words are for
    D.line(c,[[ends[0],552],[ends[0],572],[ends[2],572],[ends[2],552]],{col:"green",w:3,seed:5});D.line(c,[[(ends[0]+ends[2])/2,572],[(ends[0]+ends[2])/2,596]],{col:"green",w:3,seed:6});},[60,40,1040,800]),
  {s:"to join them",x:460,y:676,size:66,w:700,col:"green",align:"center",at:w("own","join",-0.4),d:0.6,marks:[["ring","green",null]]}];
// 4. the goal met
const mh_note4=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"25 March",86,124);D.icon(c,"cal",500,96,38,{fill:"green"});
    mh_stops(c,150,300,180,true);D.card(c,620,460,{icon:"bars",ifill:"green",lines:[["Graham's page",{w:700}],["all 186 rooms",{col:"mut",size:32}]],size:36,w:380});},[60,56,1040,800]),
  {k:"tick",x:120,y:650,r:30,col:"green",at:w("goal","met",-0.6),d:0.3},
  {s:"the whole route, known",x:170,y:670,size:58,col:"green",w:700,at:w("goal","whole route",-0.3),d:1.0}];
// 5. on Monday (Helena): what to do is there; a tick as the voice comes to each, and the last row in her hand
const MH_MON=[["hat","Each one's hats, not the title","blue"],["clock","Time to learn every part","green"],["doc","One real question, one page","blue"]];
const mh_note5=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"On Monday",86,122,{size:88});
    MH_MON.forEach(([ic,s,col],i)=>{const y=262+i*100;D.disc(c,120,y-16,34,{fill:col,col:"ink",w:3});D.icon(c,ic,120,y-16,22,{fill:"white"});D.text(c,s,180,y,{size:46});});
    D.disc(c,120,546,34,{fill:"amber",col:"ink",w:3});D.icon(c,"key",120,546,22,{fill:"white"});
    // what the film leaves: deep in one, enough of the rest, on a sticky note with its T
    D.sticky(c,150,616,470,176,{col:"sun",rot:-0.02,draw:(cc,x,y,w)=>{D.box(cc,x+28,y+44,110,18,{fill:"green",col:"ink",w:2.5,r:5});D.box(cc,x+71,y+44,24,100,{fill:"blue",col:"ink",w:2.5,r:5});
      D.text(cc,"deep in one,",x+164,y+90,{size:36,w:700,col:"blue"});D.text(cc,"enough of the rest",x+164,y+138,{size:32,col:"green"});}});},[60,40,1040,800]),
  {k:"tick",x:860,y:244,r:22,col:"blue",at:w("depth","hats",0.4),d:0.3},{k:"tick",x:860,y:344,r:22,col:"green",at:w("words","time",0.4),d:0.3},
  {k:"tick",x:860,y:444,r:22,col:"blue",at:w("route","one real question",0.4),d:0.3},
  {s:"What falls between: an owner",x:180,y:562,size:46,w:700,col:"amber",at:w("ask","owner",-0.2),d:1.0}];
