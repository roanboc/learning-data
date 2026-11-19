/* ===== Wellbeing is in the work: the university, February 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the seven work, Marta's requests on her screen, the boards' rows that Carmen Vidal and Helena write,
   the pages Helena keeps, and the five questions Helena sends. Every time comes from the voice: sc is the chapter, w a word's time in
   a line. Colour means what it means in the module: blue a plan or a rule, orange data, green something done or of value, amber what
   the work asks, a risk or what isn't so. */
AG_PLACES.wwTeam=PK.place.team;AG_PLACES.wwCorner=PK.place.corner;AG_PLACES.wwCampus=PK.place.campus;AG_PLACES.wwLecture=PK.place.lecture;
AG_PLACES.wwBoard=PK.place.board;AG_PLACES.wwNotes=c=>PK.place.notes(c,{});
const WW_T=PK.ROOMS.team,WW_CA=PK.ROOMS.campus,WW_CO=PK.ROOMS.corner,WW_LE=PK.ROOMS.lecture;
const ww_hT=fl=>PK.hAt(fl,WW_T.eye),ww_hC=fl=>PK.hAt(fl,WW_CA.eye),ww_hL=fl=>PK.hAt(fl,WW_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const ww_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const ww_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const WW_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
// an open notebook held up in the far hand, its pages toward us (the kit's held notebook is seen edge on: on the bank, at a visitor's
// size, it read as a stick); o.side -1 when its holder faces left; o.lines how many lines the right page has so far
const ww_openNote=o=>(c,hd,deg,J)=>{o=o||{};const S=PK.S,U=PK.u,u=J.u,sd=o.side||-1,pw=104*u,ph=140*u,sq=0.56,r=0.1*sd,cx=hd[0]+sd*30*u,cy=hd[1]-14*u,
  T=(px,py)=>{const x=px,y=py*sq;return[cx+x*Math.cos(r)-y*Math.sin(r),cy+x*Math.sin(r)+y*Math.cos(r)];},Q=pts=>q=>U.pg(q,pts.map(p=>T(p[0],p[1]))),
  cover=S.tone(PK.PAL.cover),page=PK.col("page"),ink=S.ink||[60,56,64];
  S.fill(c,Q([[-pw-7*u,-ph+2*u],[pw+7*u,-ph+2*u],[pw+7*u,12*u],[-pw-7*u,12*u]]),cover,{w:0.7});
  S.fill(c,Q([[-pw,-ph-10*u],[0,-ph],[0,0],[-pw,-4*u]]),page,{w:0.6});S.fill(c,Q([[pw,-ph-10*u],[0,-ph],[0,0],[pw,-4*u]]),U.dk(page,0.04),{w:0.6});
  c.save();c.strokeStyle=U.css(U.lt(ink,0.35));c.lineCap="round";c.lineWidth=Math.max(1,5*u);
  const ln=(x0,x1,y)=>{const a=T(x0,y),b=T(x1,y);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();};
  for(let i=0;i<5;i++)ln(-pw+16*u,-14*u-(i===4?40*u:0),-ph+28*u+i*24*u);
  const n=o.lines==null?3:o.lines;for(let i=0;i<n;i++)ln(14*u,pw-16*u-(i===n-1?30*u:0),-ph+28*u+i*24*u);
  c.restore();};
const WW_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const WW_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const ww_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const WW_DESK={sam:[1230,WW_T.back],jun:[1808,WW_T.back],marta:[560,WW_T.mid]};
function ww_team(x,tt,o){o=o||{};const r={},HB=ww_hT(WW_T.back),HM=ww_hT(WW_T.mid);PK.clock(x,WW_T.clock[0],WW_T.clock[1],WW_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:WW_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:"sam",WW_DESK.sam[0],WW_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:WW_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",WW_DESK.jun[0],WW_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:WW_T.mid,i:2,draw:c=>{r.marta=PK.atDesk(c,o.marta===null?null:"marta",WW_DESK.marta[0],WW_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.wwTeam=(x,tt)=>ww_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (wwBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const WW_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const ww_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},WW_RB,{h:ww_hT(WW_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const WW_SIDE={x:1690,floor:900},WW_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function ww_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=ww_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||ww_lis(tt,-0.2)),people:[
    {fl:WW_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",WW_SAMC.x,WW_SAMC.floor,ww_hT(WW_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||ww_lis(tt,-0.25)));}},
    {fl:WW_RB.floor,draw:c=>{Jc=ww_roomBoard(c,tt,o.rows||[],"carmen",{say:o.say,events:o.events});}},
    {fl:WW_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",WW_SIDE.x,WW_SIDE.floor,ww_hT(WW_SIDE.floor),PK.poseMix("clasp",WW_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||ww_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Marta's requests, as her screen shows them
   The people who ask are from other areas, people nobody names (PK.extra), each by the way they asked: a message, a mail, a word at
   her desk. The panel comes out of Marta's screen, and each request comes in at its time; each is called urgent. */
const WW_ASK=[[21,"Urgent: fees by faculty, today?"],[24,"URGENT: room use for the board"],[27,"Need the library numbers, urgent"],[30,"Urgent, sorry: one more for Friday"]];
const ww_inbox=(ts,o)=>({title:(o&&o.title)||"Requests · 14 waiting",who:WW_ASK.map(([i])=>PK.extra(i)),me:"marta",msgs:WW_ASK.slice(0,(o&&o.n)||4).map(([i,s],k)=>({who:PK.extra(i),s,at:ts[k]}))});
// Helena's five questions, sent to the seven (as Jun's screen shows them), and the first answer
const ww_five=(a,b)=>({title:"Helena Novak",who:["helena"],me:"jun",msgs:[{who:"helena",s:["Five questions about the work,","to answer in writing, by Wednesday."],at:a},{who:"jun",s:"Done. Thanks for asking.",at:b,type:1.2}]});

/* the boards, as a graphic recording on a sheet pinned over the board, in the board's own px (1250 by 524): drawn already when it
   first shows (PK.sk.drawn), and whoever explains adds the last words, a tick or a ring as the voice says them. PK.pace makes a row
   wait until they can have walked to it, so the last words go on from left to right, and nothing is drawn back along words */
// a tile with a drawing in a ring at its left and a line or two beside it (each of the seven places to look, the three signs)
function ww_tile(c,x,y,w,h,icon,lines,o){const D=PK.sk;o=o||{};D.box(c,x,y,w,h,{fill:o.fill||"paper",col:o.line||"ink",w:3,r:14});
  const r=o.r||26,cy=y+h/2;D.disc(c,x+22+r,cy,r,{fill:"white",col:"ink",w:3});D.icon(c,icon,x+22+r,cy,r*0.62,{fill:o.ifill||o.fill||"blue"});
  const size=o.size||30,lh=size*1.2;D.lines(c,lines,x+r*2+40,cy-(lines.length-1)*lh/2+size*0.34,{size,w:o.w||400,lh:1.2});}
// a row of dots, so many coloured: how many of the seven said so
const ww_dots=(c,x,y,on,col)=>PK.sk.dots(c,x,y,7,1,{gap:22,r:8,on,col});
// 1. the page's two sides, as researchers name them (Carmen): Marta's week on each side, the names and what both depend on to come
function ww_sheetA(c){const D=PK.sk;
  D.head(c,"Two sides of the work",{col:"blue",ref:["Job demands, resources",["Demerouti and others, 2001",{size:30}]],rsize:32,rx:1000,ry:84});
  D.panel(c,56,140,450,212,{fill:"amber",line:"amber",title:"What the work asks",col:"amber"},(cc,x,y)=>D.list(cc,x+24,y+40,[
    {s:"14, all urgent",icon:"cards",col:"amber"},{s:"9 started, 0 done",icon:"loop",col:"amber"},{s:"2 Sundays",icon:"cal",col:"amber"}],{size:34,gap:48}));
  D.face(c,"marta",576,228,30,{});D.icon(c,"scale",576,314,24,{fill:"white"});
  D.panel(c,646,140,404,212,{fill:"green",line:"green",title:"What helps",col:"green"},(cc,x,y)=>D.list(cc,x+24,y+40,[
    {s:"knows the numbers",icon:"star",col:"green"},{s:"Jun checks a query",icon:"people",col:"green"}],{size:34,gap:48}));
  D.line(c,[[76,410],[486,410]],{col:"amber",w:2.5,dash:[8,9],seed:4});D.line(c,[[666,410],[1030,410]],{col:"green",w:2.5,dash:[8,9],seed:5});
  D.ribbon(c,"",300,424,{col:"mut",width:800,size:40});}
const ww_boardA=(sc,w)=>[PK.sk.drawn(ww_sheetA),
  {s:"job demands",x:80,y:398,size:42,w:700,col:"amber",at:w("jdr","job demands",-0.3),d:0.7},
  {s:"job resources",x:670,y:398,size:42,w:700,col:"green",at:w("jdr","job resources",-0.2),d:0.7},
  {s:"Most of both:",x:340,y:462,size:40,w:700,at:w("both","mostly",-0.3),d:0.8},{s:"how the work is arranged",size:40,w:700,col:"blue",at:w("both","arranged",-0.6),d:1.1}];
// 2. three things everyone needs from work (Carmen): Marta's page against each, and what hundreds of studies since found
function ww_sheetB(c){const D=PK.sk;
  D.head(c,"Three needs",{col:"blue",ref:["Self-determination",["Ryan and Deci, 2000",{size:30}]],rsize:32,rx:1040,ry:84});
  [["speech","A say in it"],["star","To be good at it"],["people","To belong"]].forEach(([ic,s],i)=>{const x=56+i*375;
    D.box(c,x,140,360,160,{fill:"blue",col:"blue",w:3,r:16});D.disc(c,x+46,186,28,{fill:"white",col:"ink",w:3});D.icon(c,ic,x+46,186,17,{fill:"blue"});
    D.text(c,s,x+88,198,{size:36,w:700});D.line(c,[[x+22,280],[x+338,280]],{col:"amber",w:2.5,dash:[8,9],seed:i+3});});
  D.face(c,"marta",100,398,30,{});D.lines(c,["Marta's page,",["read against them",{col:"mut"}]],146,388,{size:30,lh:1.2});
  D.caps(c,"Hundreds of studies since",440,350,{col:"green",size:30});
  for(const [s,v,y] of[["better off",5,386],["do better",2,432]]){D.text(c,s,440,y+24,{size:32});D.box(c,600,y,v*62,30,{fill:"green",col:"ink",w:3,r:5});}
  D.lines(c,[["881 samples",{col:"mut"}],["443,556 people",{col:"mut"}]],1000,410,{size:30,lh:1.3});}
const ww_boardB=(sc,w)=>[PK.sk.drawn(ww_sheetB),
  {s:"no say in her order",x:78,y:270,size:36,w:700,col:"amber",at:w("marta","no say",-0.3),d:1.0},
  {s:"finishes little",x:453,y:270,size:36,w:700,col:"amber",at:w("marta","finishes",-0.4),d:0.8},
  {s:"alone with the 14",x:828,y:270,size:36,w:700,col:"amber",at:w("marta","alone",-0.3),d:0.9},
  {k:"star",x:936,y:400,r:17,col:"green",at:w("better","better off",-0.3),d:0.5}];
// 3. what they agree, as Helena writes it at the teaching room's board: two requests struck, twelve in an order with a date each,
// three at a time for Marta, and new requests to Helena
function ww_sheetC(c){const D=PK.sk;
  D.head(c,"Agreed, in half an hour",{col:"green",ref:["Wednesday 10 February",["the nine who asked",{size:30}]],rsize:32,rx:1010,ry:84});
  for(const x of[60,128]){D.box(c,x,150,56,72,{fill:"mut",col:"mut",w:3,r:6});D.line(c,[[x+12,176],[x+44,176]],{col:"mut",w:2.5,seed:x});D.line(c,[[x+12,196],[x+36,196]],{col:"mut",w:2.5,seed:x+1});}
  D.text(c,"no longer needed",60,262,{size:30,col:"mut"});
  for(let i=0;i<12;i++){const x=300+i*68;D.box(c,x,150,58,72,{fill:"paper",col:"ink",w:3,r:6});D.text(c,String(i+1),x+29,198,{size:30,w:700,align:"center"});
    D.box(c,x+7,230,44,20,{fill:"blue",col:"blue",w:2,r:5});}
  // Marta's three at a time, and the way in for a new request: to Helena, who places it in the order with whoever asked
  D.box(c,56,316,520,164,{fill:"blue",col:"blue",w:3,r:16});D.face(c,"marta",114,374,30,{});
  for(let i=0;i<3;i++)D.box(c,180+i*70,344,56,64,{fill:"green",col:"ink",w:3,r:6});D.arrow(c,[404,376],[460,376],{col:"green",w:4,head:14});D.icon(c,"check",500,376,24,{fill:"green"});
  D.box(c,596,316,594,164,{fill:"paper",col:"ink",w:3,r:16,dash:[10,8]});D.icon(c,"mail",650,374,26,{fill:"blue"});D.arrow(c,[688,374],[740,374],{col:"blue",w:4,head:14});
  D.face(c,"helena",788,370,30,{});D.arrow(c,[836,374],[888,374],{col:"blue",w:4,head:14});
  for(let i=0;i<4;i++)D.box(c,904+i*44,346,36,52,{fill:i===2?"blue":"paper",col:i===2?"blue":"ink",w:3,r:5});D.face(c,PK.extra(8),1116,370,24,{});}
const ww_boardC=(sc,w)=>[PK.sk.drawn(ww_sheetC),
  {k:"cross",x:88,y:186,r:30,col:"amber",at:w("agree","Two requests",-0.2),d:0.35},{k:"cross",x:156,y:186,r:30,col:"amber",at:w("agree","Two requests",0.3),d:0.35},
  {s:"12: an order, a date each",x:300,y:296,size:40,w:700,col:"green",at:w("agree","twelve",-0.3),d:1.1},
  {s:"3 at a time, from Thursday",x:78,y:462,size:36,w:700,at:w("three","three at a time",-0.4),d:1.1},
  {s:"New requests: to Helena",x:620,y:462,size:36,w:700,col:"blue",at:w("door","new request",-0.3),d:1.0}];
// 4. where to look in the work (Carmen): seven places, ticked as the voice names them; and what a regulator calls them
const WW_LOOK=[["cards",["how much","in hand"]],["hand",["who decides","the order"]],["bolt",["interruptions"]],["person",["alone on","something"]],
  ["cal",["nights and","weekends"]],["q",["what is","unclear"]],["heart",["who thanks","whom"]]];
const ww_lookAt=i=>[56+(i>>1)*282,i%2?262:140];
function ww_sheetD(c){const D=PK.sk;
  D.head(c,"Where to look in the work",{col:"blue",ref:["Safe Work Australia",["Psychosocial hazards",{size:30}]],rsize:32,rx:1030,ry:84});
  WW_LOOK.forEach(([ic,s],i)=>{const [x,y]=ww_lookAt(i);ww_tile(c,x,y,266,110,ic,s,{fill:"paper",ifill:"blue"});});
  D.disc(c,1035,317,44,{fill:"blue",col:"ink",w:3});D.icon(c,"eye",1035,317,28,{fill:"white"});
  D.ribbon(c,"",130,412,{col:"amber",width:940,size:38});}
const ww_boardD=(sc,w)=>{const tick=(i,at)=>{const [x,y]=ww_lookAt(i);return{k:"tick",x:x+244,y:y+89,r:15,col:"blue",at,d:0.3};};return[PK.sk.drawn(ww_sheetD),
  tick(0,w("where","how much",-0.1)),tick(1,w("where","who decides",-0.1)),tick(2,w("more","interrupted",-0.2)),tick(3,w("more","alone",-0.1)),
  tick(4,w("more","Nights",-0.1)),tick(5,w("more","unclear",-0.1)),tick(6,w("more","thanks",-0.1)),
  {s:"Hazards: job demands",x:160,y:448,size:36,w:700,at:w("hazards","job demands",-0.3),d:0.9},{s:" · low job control",size:36,w:700,at:w("hazards","low",-0.2),d:0.8},
  {s:" · poor support",size:36,w:700,at:w("hazards","poor",-0.2),d:0.7}];};
// 5. three signs, early (Carmen): whose they are, what burn-out is classed as, and what a manager does first
function ww_sheetE(c){const D=PK.sk;
  D.head(c,"Three signs, early",{col:"amber",ref:["World Health Organization",["burn-out, 2019",{size:30}]],rsize:32,rx:990,ry:84,rcol:"amber"});
  [["hourglass",["worn out"]],["door",["distant from","the job"]],["down",["no longer","good at it"]]].forEach(([ic,s],i)=>ww_tile(c,56+i*375,140,360,110,ic,s,{fill:"amber",ifill:"amber",size:34,w:700,r:30}));
  D.caps(c,"Burn-out",60,304,{col:"amber",size:30});D.text(c,"from stress at work, not managed",60,346,{size:30,col:"mut"});
  D.box(c,560,276,260,58,{fill:"green",col:"green",w:3,r:29});D.text(c,"a matter of work",690,316,{size:30,w:700,align:"center"});
  D.box(c,870,276,300,58,{fill:"white",col:"ink",w:3,r:29,dash:[8,7]});D.text(c,"a medical condition",1020,316,{size:30,align:"center",col:"mut"});
  D.flow(c,60,380,[{s:"Asks",icon:"q",fill:"blue"},{s:"Listens",icon:"chat",fill:"blue"},{s:"Changes the work first",icon:"wrench",fill:"blue"}],{size:34,gap:56,h:84});}
const ww_boardE=(sc,w)=>[PK.sk.drawn(ww_sheetE),
  {k:"ring",x:108,y:195,rx:42,ry:42,col:"amber",at:w("signs","worn out",-0.2),d:0.4},{k:"ring",x:483,y:195,rx:42,ry:42,col:"amber",at:w("signs","distant",-0.2),d:0.4},
  {k:"ring",x:858,y:195,rx:42,ry:42,col:"amber",at:w("signs","no longer",-0.2),d:0.4},
  {k:"ring",x:690,y:305,rx:158,ry:40,col:"green",at:w("notmed","matter of work",-0.2),d:0.6},{k:"line",x:886,y:309,x1:1154,y1:303,col:"amber",at:w("notmed","medical",-0.2),d:0.4},
  {k:"tick",x:205,y:394,r:15,col:"green",at:w("ask","asks",-0.1),d:0.3},{k:"tick",x:462,y:394,r:15,col:"green",at:w("ask","listens",-0.1),d:0.3},
  {k:"tick",x:954,y:394,r:15,col:"green",at:w("ask","changes",-0.1),d:0.3}];
// 6. the answers, shown to all seven (Helena, at the room's board): as counts, each written as the voice says it; then what has
// changed already, and a date for the rest
const WW_SAY=[["hand","a say in their order",2],["check","get to finish things",3],["people","someone to turn to",7]],WW_WEAR=[["people","standing meetings",5],["cards","requests with no order",4],["clock","the nights",1]];
function ww_sheetF(c){const D=PK.sk;
  D.head(c,"Answers, 7 of 7",{col:"blue",ref:["Friday 19 February",["in writing",{size:30}]],rsize:32,rx:1030,ry:84});
  for(const [px,col,title,rows] of[[56,"blue","As counts",WW_SAY],[636,"amber","What wears them out",WW_WEAR]])
    D.panel(c,px,140,560,262,{fill:col,line:col,title,col},(cc,x,y)=>rows.forEach(([ic,s,n],i)=>{const yy=y+30+i*66;D.text(cc,s,x+24,yy+11,{size:30});ww_dots(cc,x+348,yy,n,col);}));
  D.ribbon(c,"",150,422,{col:"green",fill:[190,228,200],width:950,size:40});}
const ww_boardF=(sc,w)=>{const n=(i,right,s,at)=>({s,x:(right?636:56)+540,y:200+30+i*66+14,size:40,w:700,col:right?"amber":"blue",align:"right",at,d:0.3});return[PK.sk.drawn(ww_sheetF),
  n(0,0,"2",w("counts","Two of seven",-0.2)),n(1,0,"3",w("counts","Three",-0.2)),n(2,0,"7",w("counts","All seven",-0.2)),
  n(0,1,"5",w("wears","five",-0.2)),n(1,1,"4",w("wears","four",-0.2)),n(2,1,"1",w("wears","for one",0)),
  {s:"Changed: Marta's order",x:190,y:460,size:40,w:700,col:"green",at:w("changed","Marta's order",-0.3),d:0.9},{s:" · the rest: 15 March",size:40,w:700,col:"blue",at:w("changed","Monday",-0.3),d:0.8}];};

/* ---------------------------------------------------------------- Helena's notebook: what she keeps (the page's own px)
   Each page is sketched already, a heading on a highlighter's band, boxes with drawings and the people's portraits (PK.sk.drawn);
   her pen adds the last words and ticks, each as the voice says it, one stroke after the other (PK.pace(ctx, null, rows)). Nothing is
   below y 826 of the page, where the captions are. */
const WW_PAGE=[PK.SK.page.x,PK.SK.page.y,PK.SK.page.x+PK.SK.page.w,PK.SK.page.y+PK.SK.page.h];
// a pile of request cards, each with an amber corner, as she sketches it
function ww_pile(c,x,y,n){const D=PK.sk;for(let i=0;i<n;i++){const dx=(i%3-1)*10+i*3,dy=-i*13;c.save();c.translate(x+dx,y+dy);c.rotate((i%2?-1:1)*0.05*(i%3));
  D.box(c,-80,-46,160,92,{fill:"paper",col:"ink",w:3,r:8});D.line(c,[[-62,-16],[40,-16]],{col:"mut",w:2.5,seed:i});D.line(c,[[-62,10],[18,10]],{col:"mut",w:2.5,seed:i+9});
  D.line(c,[[52,-46],[80,-46],[80,-20]],{col:"amber",w:6,seed:i+3});c.restore();}}
// 1. what she could ask of Marta, and where she looks instead
function ww_page1(c){const D=PK.sk;
  D.title(c,"Ask Marta to cope?",80,132,{size:72,col:"amber"});
  D.face(c,"marta",150,272,44,{});D.text(c,"Marta",150,368,{size:34,w:700,align:"center"});
  [["cal","plan better"],["hand","push back"],["house","a day off"]].forEach(([ic,s],i)=>D.card(c,262,196+i*104,{icon:ic,ifill:"amber",lines:[[s,{size:40}]],fill:"paper",w:330,h:84}));
  ww_pile(c,800,404,6);D.big(c,"14",900,250,{size:56,col:"amber"});
  D.ribbon(c,"",130,636,{col:"blue",fill:[200,220,244],width:800,size:46});}
const ww_note1=(sc,w)=>[PK.sk.drawn(ww_page1,WW_PAGE),
  {s:"still there",x:690,y:540,size:48,w:700,col:"amber",at:w("still","still",-0.3),d:0.7},
  {s:"The work, before the person",x:240,y:681,size:46,w:700,col:"blue",at:w("work","work",-0.4),d:1.1}];
// 2. Marta's week, written with her: what the work asks, sketched, and what helps; her pen adds what the voice says last
function ww_page2(c){const D=PK.sk;
  D.title(c,"Marta's week · 1 to 5 Feb",80,128,{size:62,col:"blue"});
  D.panel(c,74,180,560,620,{fill:"amber",line:"amber",title:"What the work asks",col:"amber"},(cc,x,y)=>{
    D.icon(cc,"cards",x+44,y+36,22,{fill:"amber"});D.text(cc,"14, all urgent",x+80,y+50,{size:40});D.text(cc,"no say in the order",x+80,y+94,{size:34,col:"mut"});
    D.bars(cc,x+34,y+152,260,96,[{v:9,col:"amber",top:"9",label:"picked up"},{v:0.3,col:"amber",top:"0",label:"finished"}],{size:30,bw:62});
    D.icon(cc,"chat",x+44,y+330,22,{fill:"amber"});D.lines(cc,["asked about another,","each time"],x+80,y+330,{size:34});
    D.caps(cc,"January",x+34,y+420,{col:"amber",size:30});
    for(let r=0;r<5;r++)for(let k=0;k<7;k++)D.box(cc,x+34+k*26,y+436+r*24,20,18,{fill:k===6?[244,196,120]:"white",col:"ink",w:1.8,r:3});});
  D.panel(c,654,180,346,330,{fill:"green",line:"green",title:"What helps",col:"green"},(cc,x,y)=>{
    D.face(cc,"marta",x+52,y+50,28,{});D.lines(cc,["knows the","numbers best"],x+100,y+44,{size:34});
    D.face(cc,"jun",x+52,y+190,28,{});D.lines(cc,["checks a query","when asked"],x+100,y+184,{size:34});});
  D.sticky(c,676,548,300,176,{col:"sun",rot:0.035,draw:(cc,x,y,w,h)=>D.lines(cc,["from her inbox","and calendar,","not memory"],x+24,y+52,{size:34})});}
const ww_note2=(sc,w)=>[PK.sk.drawn(ww_page2,WW_PAGE),
  {s:"none finished",x:340,y:462,size:46,w:700,col:"amber",at:w("nine","finished",-0.2),d:0.8},
  {k:"ring",x:274,y:709,rx:17,ry:15,col:"amber",at:w("sundays","two",-0.2),d:0.3},{k:"ring",x:274,y:757,rx:17,ry:15,col:"amber",at:w("sundays","Sundays",-0.2),d:0.3},
  {s:"2 Sundays",x:330,y:750,size:46,w:700,col:"amber",at:w("sundays","Sundays",0.2),d:0.7}];
// 3. what the page is about: the page, sketched small, and Marta beside it
function ww_page3(c){const D=PK.sk;
  D.title(c,"The page",80,132,{size:84,col:"blue"});
  D.box(c,120,196,440,420,{fill:"white",col:"ink",w:3,r:6});D.text(c,"Marta's week",150,250,{size:36,w:700});
  D.box(c,144,276,200,310,{fill:"amber",col:"amber",w:2.5,r:10});D.box(c,360,276,176,210,{fill:"green",col:"green",w:2.5,r:10});
  [["cards",330],["loop",420],["cal",510]].forEach(([ic,y],i)=>{D.icon(c,ic,178,y,18,{fill:"amber"});D.line(c,[[206,y],[322,y]],{col:"ink",w:2.5,seed:i+2});});
  [["star",330],["people",420]].forEach(([ic,y],i)=>{D.icon(c,ic,392,y,18,{fill:"green"});D.line(c,[[420,y],[512,y]],{col:"ink",w:2.5,seed:i+7});});
  D.face(c,"marta",800,300,52,{});D.arrow(c,[720,330],[590,380],{col:"mut",w:3.5,head:14,bow:-16,dash:[9,8]});
  D.ribbon(c,"",130,666,{col:"green",fill:[190,228,200],width:800,size:54});}
const ww_note3=(sc,w)=>[PK.sk.drawn(ww_page3,WW_PAGE),
  {s:"nothing about her",x:620,y:460,size:44,w:700,col:"amber",at:w("about","nothing",-0.1),d:1.0},
  {s:"All of it: the work",x:312,y:719,size:54,w:700,col:"green",at:w("about","All of it",-0.3),d:0.9}];
// 4. what she takes into the room: what the team wants, what they want, what both want, and the least she can accept
function ww_page4(c){const D=PK.sk;
  D.title(c,"Prepared",80,132,{size:84,col:"blue"});D.icon(c,"doc",470,104,30,{fill:"blue"});
  D.panel(c,74,184,450,250,{fill:"blue",line:"blue",title:"The team",col:"blue"},(cc,x,y)=>
    D.list(cc,x+30,y+44,[{s:"one order",dot:true,col:"blue"},{s:"3 at a time",dot:true,col:"blue"},{s:"no weekends",dot:true,col:"blue"}],{size:38,gap:56}));
  D.panel(c,550,184,450,250,{fill:"orange",line:"orange",title:"They",col:"orange"},(cc,x,y)=>
    D.list(cc,x+30,y+44,[{s:"their number",dot:true,col:"orange"},{s:"by their date",dot:true,col:"orange"}],{size:38,gap:56}));
  D.box(c,74,460,926,120,{fill:"green",col:"green",w:3,r:16});D.caps(c,"Both",100,502,{col:"green",size:30});
  D.box(c,74,610,926,186,{fill:"white",col:"blue",w:3,r:16,dash:[10,8]});D.caps(c,"The least I can accept",100,652,{col:"blue",size:30});}
const ww_note4=(sc,w)=>[PK.sk.drawn(ww_page4,WW_PAGE),
  {s:"numbers to rely on, on a date",x:240,y:552,size:46,w:700,col:"green",at:w("they","Both",-0.3),d:1.2},
  {s:"an agreed order,",x:120,y:722,size:46,w:700,col:"blue",at:w("least","agreed order",-0.3),d:0.8},{s:"a date each",x:524,y:722,size:46,w:700,col:"blue",at:w("least","a date",-0.3),d:0.6,
    marks:[["ring","blue",sc.ends.least-0.2]]}];
// 5. where a manager's part ends: what she does, where it stops, and who helps past it
function ww_page5(c){const D=PK.sk;
  D.title(c,"My part has an end",80,128,{size:72,col:"blue"});
  D.box(c,74,170,926,108,{fill:"white",col:"amber",w:3,r:14,dash:[10,8]});
  D.box(c,74,306,430,420,{fill:"blue",col:"blue",w:3,r:16});D.face(c,"helena",134,368,32,{});D.caps(c,"My part",184,380,{col:"blue",size:30});
  D.list(c,104,480,[{s:"asks",icon:"q",col:"blue"},{s:"listens",icon:"chat",col:"blue"},{s:"changes the work",icon:"wrench",col:"blue"}],{size:38,gap:76});
  D.line(c,[[538,300],[538,732]],{col:"ink",w:3,dash:[10,10],seed:3});D.icon(c,"flag",538,288,20,{fill:"amber"});
  D.box(c,572,306,428,420,{fill:"green",col:"green",w:3,r:16});D.caps(c,"More than work",600,354,{col:"green",size:30});
  D.disc(c,640,440,34,{fill:"white",col:"ink",w:3});D.icon(c,"heart",640,440,20,{fill:"green"});D.icon(c,"lock",640,600,24,{fill:"green"});}
const ww_note5=(sc,w)=>[PK.sk.drawn(ww_page5,WW_PAGE),
  {s:"Not a clinician",x:110,y:246,size:56,w:700,col:"amber",at:w("part","clinician",-0.6),d:0.8},
  {s:"professional",x:690,y:430,size:44,w:700,col:"green",at:w("help","professional",-0.3),d:0.7},{s:"help",x:690,y:484,size:44,w:700,col:"green",at:w("help","help",-0.1),d:0.3},
  {s:"kept private",x:690,y:614,size:44,w:700,at:w("help","private",-0.4),d:0.8}];
// 6. this week: four things to keep, a card each with a drawing; the hand ticks three as the voice says them, and writes the last
function ww_page6(c){const D=PK.sk;
  D.title(c,"This week",80,132,{size:88,col:"blue"});D.icon(c,"cal",520,104,30,{fill:"blue"});
  D.sticky(c,700,62,300,128,{col:"sun",rot:0.035,draw:(cc,x,y,w,h)=>D.lines(cc,["June: the same","five questions"],x+22,y+56,{size:34})});
  const card=(i,fill,ic,lines,draw)=>{const x=74+(i%2)*486,y=226+(i>>1)*286;D.box(c,x,y,466,266,{fill,col:"ink",w:3,r:16});
    D.disc(c,x+60,y+62,36,{fill:"white",col:"ink",w:3});D.icon(c,ic,x+60,y+62,22,{fill});if(draw)draw(x,y);if(lines)D.lines(c,lines,x+30,y+156,{size:40});};
  card(0,"blue","doc",["Write one person's","week, with them"],(x,y)=>{D.face(c,"helena",x+260,y+64,24,{});D.face(c,"marta",x+350,y+64,24,{});});
  card(1,"green","people",["Agree a pace","with who asks"],(x,y)=>{D.icon(c,"clock",x+300,y+64,24,{fill:"green"});});
  card(2,"blue","mail",["Ask all, in writing;","show, say when"],(x,y)=>{D.faces(c,x+190,y+64,["sam","jun","noor","yusuf"],{r:18,gap:54});});
  card(3,"amber","wrench",null);}
const ww_note6=(sc,w)=>[PK.sk.drawn(ww_page6,WW_PAGE),
  {k:"tick",x:500,y:454,r:20,col:"green",at:w("week","write",-0.2),d:0.3},
  {k:"tick",x:986,y:454,r:20,col:"green",at:w("take","Take",-0.2),d:0.3},
  {k:"tick",x:500,y:740,r:20,col:"green",at:w("write","Ask everyone",-0.2),d:0.3},
  {s:"Change one thing now,",x:598,y:668,size:40,w:700,col:"blue",at:w("one","Change",-0.3),d:1.0},{s:"a date for the rest",x:598,y:722,size:40,w:700,col:"blue",at:w("one","date",-0.3),d:0.9,
    marks:[["under","blue",sc.ends.one]]}];

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const WW_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},WW_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const WW_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function ww_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=WW_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(WW_SITH,WW_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,WW_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=PK.person(x,"helena",hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,WW_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}

