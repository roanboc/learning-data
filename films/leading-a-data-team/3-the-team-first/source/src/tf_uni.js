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








/* ---------------------------------------------------------------- the boards (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Carmen's and Helena's are drawn as a designer would, a graphic recording pinned over the board, almost
   done when it first shows (PK.sk.drawn): whoever explains adds the last words and marks as the voice says them, on from left to
   right, and steps clear. */
// a graphic recording in two drawn parts: its heading, high on the sheet, where nobody standing at the board hides it, and the drawing
// under it, with the box its ink lies in, so whoever explains steps only as far right as it reaches
const tf_rec=(title,o,draw,box)=>[PK.sk.drawn(c=>PK.sk.head(c,title,o),[40,36,1210,150]),PK.sk.drawn(draw,box)];
// 1. leading and managing (Carmen, at the team's board): both her job, leading the heavier; people first; and what someone may need
const TF_NEED=[["hand","support","more support"],["wrench","a tool","better tool"],["speech","a word","encouragement"],["up","a push","a push"]];
const tf_boardA=(sc,w)=>[...tf_rec("Lead and manage",{},c=>{const D=PK.sk;
    D.panel(c,70,150,360,280,{title:"both her job",col:"blue",fill:"blue"},(cc,x,y)=>D.scale(cc,x+180,y+34,200,{l:"manage",r:"lead",tilt:-0.5,lcol:"blue",rcol:"green",size:30}));
    D.panel(c,460,150,330,280,{title:"first",col:"green",fill:"green"},(cc,x,y)=>{D.icon(cc,"heart",x+165,y+42,34,{fill:"green"});
      D.faces(cc,x+85,y+124,["sam","noor","jun"],{r:24,gap:80});});
    D.panel(c,820,150,360,280,{title:"sometimes",col:"amber",fill:"amber"},(cc,x,y)=>TF_NEED.forEach(([ic,s],i)=>{const cx=x+90+(i%2)*180,cy=y+30+Math.floor(i/2)*100;
      D.icon(cc,ic,cx,cy,26,{fill:"white"});D.text(cc,s,cx,cy+56,{size:28,align:"center"});}));},[60,150,1190,436]),
  {s:"a little more",x:100,y:404,size:40,w:700,col:"green",at:w("weighs","a little more",-0.3),d:0.8},
  {s:"wellbeing",x:625,y:404,size:44,w:700,col:"green",align:"center",at:w("first","wellbeing",-0.3),d:0.7},
  ...TF_NEED.map(([,,word],i)=>({k:"tick",x:820+90+(i%2)*180+46,y:150+60+30+Math.floor(i/2)*100-16,r:14,col:"green",at:w("comfort",word,0.1),d:0.25})),
  {s:"no big gap opens",x:1180,y:474,size:40,w:700,col:"blue",align:"right",at:w("open","no big gap",-0.3),d:1.0}];
// 2. psychological safety (Carmen): what it means, the hospital teams, and the 51 work teams; she writes what each shows
const tf_boardB=(sc,w)=>[...tf_rec("Psychological safety",{ref:["Amy Edmondson","1999"],rsize:32},c=>{const D=PK.sk;
    D.panel(c,70,150,400,300,{title:"a shared belief",col:"blue",fill:"blue"},(cc,x,y)=>{D.faces(cc,x+70,y+52,["ivy","jun","noor"],{r:28,gap:84});D.icon(cc,"shield",x+330,y+52,30,{fill:"blue"});});
    D.panel(c,500,150,330,300,{title:"hospital teams",col:"orange",fill:"orange"},(cc,x,y)=>{D.icon(cc,"speech",x+50,y+40,24,{fill:"green"});D.text(cc,"talked openly",x+90,y+52,{size:30});
      D.icon(cc,"lock",x+50,y+110,24,{fill:"amber"});D.text(cc,"kept quiet",x+90,y+122,{size:30,col:"mut"});});
    D.panel(c,860,150,320,300,{title:"work teams",col:"green",fill:"green"},(cc,x,y)=>{D.text(cc,"fifty-one",x+28,y+48,{size:38,w:700,col:"green"});
      D.trend(cc,x+206,y+4,86,74,[[0,0.12],[0.5,0.45],[1,0.95]],{col:"green"});});},[60,150,1190,456]),
  {s:"safe to take risks",x:100,y:380,size:38,w:700,col:"blue",at:w("belief","taking risks",-0.4),d:0.9},
  {s:"admit a mistake",x:530,y:430,size:38,w:700,col:"green",at:w("belief","admitting a mistake",-0.3),d:0.8},
  {s:"learned more",x:1160,y:380,size:38,w:700,col:"green",align:"right",at:w("teams","learned more",-0.3),d:0.8},
  {s:"did better",x:1160,y:432,size:38,w:700,col:"green",align:"right",at:w("teams","did better",-0.3),d:0.7}];
// 3. the night rota (Helena, at the team's board): who can answer, and the four weeks of the rota; she writes what it comes to
const TF_ROTA=["sam","noor","jun","erin"];
const tf_boardC=(sc,w)=>[...tf_rec("Nights",{},c=>{const D=PK.sk;
    D.panel(c,70,150,420,300,{title:"who can answer",col:"green",fill:"green"},(cc,x,y)=>D.faces(cc,x+75,y+52,TF_ROTA,{r:30,gap:90}));
    D.panel(c,520,150,660,300,{title:"the rota",col:"blue",fill:"blue"},(cc,x,y)=>TF_ROTA.forEach((k,i)=>{const bx=x+30+i*152;
      D.box(cc,bx,y+14,132,128,{fill:"white",col:"ink",w:2.5,r:10});D.text(cc,"week "+(i+1),bx+66,y+50,{align:"center",size:30,col:"blue",w:700});D.face(cc,k,bx+66,y+100,26);}));},[60,150,1190,456]),
  {s:"four, not one",x:100,y:400,size:44,w:700,col:"green",at:w("four","not one",-0.6),d:0.8},
  {s:"one week in four each",x:1160,y:420,size:40,w:700,col:"blue",align:"right",at:w("rota","one week in four",-0.3),d:1.1}];
// 4. Ubuntu as an ethic (Carmen): Metz's two things, held together; she writes what each one is
const tf_boardD=(sc,w)=>[...tf_rec("Ubuntu, an ethic",{ref:["Ramose · Metz","philosophers"],rsize:32},c=>{const D=PK.sk;
    D.panel(c,70,150,500,280,{title:"share",col:"green",fill:"green"},(cc,x,y)=>{D.icon(cc,"people",x+190,y+44,34,{fill:"white"});D.icon(cc,"house",x+310,y+44,34,{fill:"white"});});
    D.icon(c,"plus",625,290,24,{fill:"white"});
    D.panel(c,680,150,500,280,{title:"care",col:"orange",fill:"orange"},(cc,x,y)=>D.icon(cc,"heart",x+250,y+44,34,{fill:"orange"}));
    D.caps(c,"held together",625,474,{align:"center",size:30,col:"mut"});},[60,150,1190,480]),
  {s:"a life with others",x:100,y:400,size:44,w:700,col:"green",at:w("metz","sharing a life",-0.3),d:1.0},
  {s:"how their lives go",x:710,y:400,size:44,w:700,col:"orange",at:w("metz","caring how",-0.3),d:1.0}];
// 5. on Monday (Helena, at the board seen close): the team as a ring, nobody alone, and four of the five steps; she ticks each at the
// board's right edge as the voice comes to it, and writes the fifth
const TF_MON=[["pair: two for each job","pair","pair until"],["protect leave","leave","Protect leave"],["thank who says: I got it wrong","thank","Thank"],["ask how people are","ask","ask how"]];
const tf_boardM=(sc,w)=>[...tf_rec("On Monday",{},c=>{const D=PK.sk;
    D.panel(c,70,140,380,300,{title:"nobody alone",col:"green",fill:"green"},(cc,x,y)=>{const cx=x+190,cy=y+112;D.icon(cc,"heart",cx,cy,22,{fill:"green"});
      ["sam","noor","jun","erin","ivy"].forEach((k,i)=>{const a=-Math.PI/2+i*Math.PI*2/5;D.face(cc,k,cx+Math.cos(a)*92,cy+Math.sin(a)*80,26);});});
    TF_MON.forEach(([s],i)=>{const y=180+i*74;D.disc(c,512,y-12,24,{fill:["green","amber","orange","blue"][i],col:"ink",w:3});D.text(c,String(i+1),512,y-1,{size:30,w:700,align:"center"});D.text(c,s,556,y,{size:36});});},[60,140,1080,450]),
  ...TF_MON.map(([,id,word],i)=>({k:"tick",x:1150,y:166+i*74,r:18,col:"green",at:w(id,word,0.3),d:0.3})),
  {s:"if you're new, watch first",x:1180,y:470,size:42,w:700,col:"blue",align:"right",at:w("new","watch first",-0.6),d:1.2}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page.
   The stokvel member's book is written plainly; Helena's and Ivy's are sketched pages, almost done, and the pen adds the last words. */
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
// 3. the team as a whole (Helena): the team's faces, what she measures it against, and how this team works; the pen adds what she reads
const tf_note3=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"The team, as a whole",86,124,{size:72});
    D.panel(c,100,170,880,230,{title:"together",col:"green",fill:"green"},(cc,x,y)=>D.faces(cc,x+110,y+52,["sam","noor","jun","erin","ivy"],{r:30,gap:110}));
    D.panel(c,100,430,420,300,{title:"measured against",col:"blue",fill:"blue"},(cc,x,y)=>{D.icon(cc,"building",x+50,y+40,26,{fill:"white"});D.text(cc,"her last team",x+92,y+52,{size:34,col:"mut"});});
    D.panel(c,560,430,420,300,{title:"this team",col:"orange",fill:"orange"},(cc,x,y)=>{for(let i=0;i<11;i++)D.icon(cc,"mail",x+50+(i%6)*62,y+34+Math.floor(i/6)*54,16,{fill:"orange"});
      D.icon(cc,"clock",x+360,y+88,22,{fill:"white"});});},[60,40,1040,800]),
  {s:"what it does together",x:140,y:370,size:46,w:700,col:"green",at:w("whole","achieves together",-0.4),d:1.0},
  {s:"what it really does",x:130,y:640,size:40,w:700,col:"blue",at:w("really","really does",-0.4),d:1.0},
  {k:"line",x:186,y:531,x1:394,y1:527,col:"amber",at:w("really","not what her last team",-0.1),d:0.4},
  {s:"11 ways in",x:590,y:650,size:42,w:700,col:"orange",at:w("eleven","eleven different ways",-0.3),d:0.7},
  {s:"day and night",x:590,y:708,size:38,w:700,at:w("eleven","day and night",-0.3),d:0.8}];
// 4. said out loud (Ivy): what she said, who thanked her, and the team; the pen adds what follows
const tf_note4=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Said out loud",86,124,{size:76});
    D.face(c,"ivy",180,270,40);D.box(c,250,224,520,96,{fill:"white",col:"ink",w:3,r:20});D.text(c,"I nearly let it through.",280,286,{size:36});
    D.arrow(c,[180,326],[180,410],{col:"ink",w:3.5,head:14});D.face(c,"jun",180,466,40);
    D.arrow(c,[180,522],[180,596],{col:"ink",w:3.5,head:14});D.faces(c,180,652,["sam","noor","helena","erin"],{r:30,gap:96});},[60,40,1040,800]),
  {s:"and thanked",x:250,y:482,size:50,w:700,col:"green",at:w("learn","thanked",-0.3),d:0.6},
  {s:"the whole team learns",x:110,y:770,size:52,w:700,at:w("learn","whole team learns",-0.3),d:1.0}];
// 5. Tutu (Helena): his words, and what Sam's nights came to; the pen adds the words that matter
const tf_note5=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Desmond Tutu",86,124,{size:76});
    D.panel(c,100,170,880,250,{title:"a person with Ubuntu",col:"blue",fill:"blue"},(cc,x,y)=>D.text(cc,"\u201c",x+22,y+70,{size:80,w:700,col:"mut"}));
    D.face(c,"sam",200,580,40);[["noor",500],["jun",580],["erin",660]].forEach(([k,y])=>{D.arrow(c,[250,580],[400,y],{col:"ink",w:3,head:12,bow:y<580?-10:y>580?10:0});D.face(c,k,446,y,30);});
    D.caps(c,"taught three",520,590,{size:30,col:"mut"});},[60,40,1040,800]),
  {s:"is not threatened",x:200,y:300,size:48,w:700,at:w("tutu","threatened",-0.3),d:0.9},
  {s:"that others are able and good",x:200,y:380,size:44,w:700,col:"green",at:w("tutu","able and good",-0.6),d:1.3},
  {s:"and lost nothing",x:110,y:760,size:52,w:700,col:"green",at:w("lost","lost nothing",-0.5),d:0.9}];
