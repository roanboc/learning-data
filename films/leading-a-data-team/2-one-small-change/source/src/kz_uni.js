/* ===== One small change at a time: the university, July to October 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, the corner, the campus and a teaching
   room; and, apart from the scene, a board seen close and a page of a notebook (concepts.js). This file holds what is this film's own
   in them: where the team works, the boards' rows Carmen Vidal and Helena write, and the pages Ivy and Helena keep.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green value or something done, amber a cost or something waiting. */
AG_PLACES.kzTeam=PK.place.team;AG_PLACES.kzCorner=PK.place.corner;AG_PLACES.kzCampus=PK.place.campus;AG_PLACES.kzLecture=PK.place.lecture;
AG_PLACES.kzBoard=PK.place.board;AG_PLACES.kzNotes=c=>PK.place.notes(c,{});
const KZ_T=PK.ROOMS.team,KZ_CA=PK.ROOMS.campus,KZ_CO=PK.ROOMS.corner,KZ_LE=PK.ROOMS.lecture;
const kz_hT=fl=>PK.hAt(fl,KZ_T.eye),kz_hC=fl=>PK.hAt(fl,KZ_CA.eye),kz_hL=fl=>PK.hAt(fl,KZ_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const kz_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const kz_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const KZ_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const KZ_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const KZ_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const kz_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function kz_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const KZ_DESK={sam:[1230,KZ_T.back],jun:[1808,KZ_T.back],marta:[560,KZ_T.mid]};
function kz_team(x,tt,o){o=o||{};const r={},HB=kz_hT(KZ_T.back),HM=kz_hT(KZ_T.mid);PK.clock(x,KZ_T.clock[0],KZ_T.clock[1],KZ_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:KZ_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),KZ_DESK.sam[0],KZ_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:KZ_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",KZ_DESK.jun[0],KZ_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:KZ_T.mid,i:2,draw:c=>{r.marta=kz_desk(c,o.marta===null?null:(o.deskWho||"marta"),KZ_DESK.marta[0],KZ_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.kzTeam=(x,tt)=>kz_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const KZ_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const kz_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},KZ_RB,{h:kz_hT(KZ_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const KZ_SIDE={x:1690,floor:900},KZ_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function kz_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=kz_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||kz_lis(tt,-0.2)),people:[
    {fl:KZ_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",KZ_SAMC.x,KZ_SAMC.floor,kz_hT(KZ_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||kz_lis(tt,-0.25)));}},
    {fl:KZ_RB.floor,draw:c=>{Jc=kz_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:KZ_SIDE.floor,draw:c=>{R2=PK.person(c,o.side||(o.who==="helena"?"ivy":"helena"),KZ_SIDE.x,KZ_SIDE.floor,kz_hT(KZ_SIDE.floor),PK.poseMix("clasp",KZ_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||kz_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const KZ_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},KZ_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const KZ_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function kz_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=KZ_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(KZ_SITH,KZ_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,KZ_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,KZ_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const KZ_LE2=PK.ROOMS.lecture;
function kz_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function kz_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){if(!n)continue;const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-10,w,24),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+50,{w:700,size:30,color:U.css(PK.C.ink)});y+=86;}}








/* ---------------------------------------------------------------- the boards (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). The director's board at Castle Street is written plainly, as an office's board was; Carmen's and
   Helena's are drawn as a designer would, a graphic recording pinned over the board, almost done when it first shows (PK.sk.drawn):
   whoever explains adds the last words and marks as the voice says them, on from left to right, and steps clear. */
// 0. five S (the director, at his office's board)
const kz_boardO=(sc,w)=>[
  {s:"Five S",x:70,y:110,size:64,col:"blue",at:w("fives","five S",-0.3),d:0.6},
  {s:"sort · set in order",x:110,y:230,size:54,at:w("steps","Sort",-0.2),d:1.0},
  {s:"shine · standardise",x:300,y:340,size:54,at:w("steps","Shine",-0.2),d:1.0},
  {s:"sustain",x:620,y:450,size:58,col:"green",at:w("steps","sustain",-0.2),d:0.6}];
// a graphic recording in two drawn parts: its heading, high on the sheet, where nobody standing at the board hides it, and the drawing
// under it, with the box its ink lies in, so whoever explains steps only as far right as it reaches
const kz_rec=(title,o,draw,box)=>[PK.sk.drawn(c=>PK.sk.head(c,title,o),[40,36,1210,150]),PK.sk.drawn(draw,box)];
// 1. kaizen's first idea (Carmen, at the team's board): who improves, on what, and how; she writes each answer as the voice says it
const kz_boardA=(sc,w)=>[...kz_rec("Kaizen",{},c=>{const D=PK.sk;
    D.panel(c,70,160,380,300,{title:"who",col:"blue",fill:"blue"},(cc,x,y)=>D.faces(cc,x+58,y+52,["ivy","jun","sam","noor"],{r:28,gap:88}));
    D.panel(c,480,160,320,300,{title:"on what",col:"orange",fill:"orange"},(cc,x,y,pw)=>D.icon(cc,"laptop",x+pw/2,y+52,34,{fill:"white"}));
    D.panel(c,830,160,350,300,{title:"how",col:"green",fill:"green"},(cc,x,y)=>D.stairs(cc,x+40,y+10,200,110,["","","",""],{col:"green"}));},[60,150,1190,470]),
  {s:"everyone's job",x:100,y:420,size:44,w:700,col:"blue",at:w("idea","everyone's job",-0.2),d:0.9},
  {s:"own work",x:510,y:420,size:44,w:700,col:"orange",at:w("idea","own work",-0.2),d:0.6},
  {s:"small steps",x:1160,y:420,size:44,w:700,col:"green",align:"right",at:w("idea","small steps",-0.3),d:0.6}];
// 1b. one cycle for each small step (Carmen's board, close): the step, the cycle it runs through, and what comes out of it, at the
// right, where she writes the last words
const kz_boardB=(sc,w)=>[...kz_rec("One cycle",{},c=>{const D=PK.sk;
    D.panel(c,70,170,320,280,{title:"a step",col:"green",fill:"green"},(cc,x,y)=>D.stairs(cc,x+50,y+12,220,110,["","","",""],{col:"green"}));
    D.arrow(c,[400,316],[450,316],{col:"ink",w:3.5,head:14});
    D.cycle(c,620,316,112,[["plan",{col:"blue"}],["do",{col:"orange"}],["study",{col:"violet"}],["act",{col:"green"}]],{a0:Math.PI,size:32});
    D.arrow(c,[672,436],[850,410],{col:"ink",w:3.5,head:14,bow:-24});},[60,150,860,470]),
  {s:"each small step",x:92,y:420,size:36,w:700,col:"green",at:w("cycle","small step",-0.3),d:0.9},
  {s:"keep it",x:1160,y:330,size:48,w:700,col:"green",align:"right",at:w("cycle","keep it",-0.2),d:0.6},
  {s:"or drop it",x:1160,y:420,size:48,w:700,col:"amber",align:"right",at:w("cycle","drop it",-0.2),d:0.7}];
// 2. standardise, then automate (Carmen): the checklist automated, and a muddle automated; she names the muddle, and what comes of it
const kz_scribble=(c,x,y)=>PK.sk.line(c,[[x,y+10],[x+120,y+66],[x+18,y+72],[x+128,y+14],[x+6,y+44],[x+134,y+46],[x+30,y+6],[x+96,y+78]],{col:"ink",w:3,seed:9});
const kz_boardC=(sc,w)=>[...kz_rec("Standardise, then automate",{},c=>{const D=PK.sk;
    D.card(c,70,170,{icon:"doc",lines:[["4 steps, in order",{size:32}]],fill:"blue",h:96});
    D.arrow(c,[424,218],[470,218],{col:"ink",w:3.5,head:14});
    D.card(c,480,170,{icon:"gear",lines:[["in the job",{size:32}]],fill:"orange",h:96});
    D.arrow(c,[736,218],[782,218],{col:"ink",w:3.5,head:14});
    D.text(c,"the same, faster",796,232,{size:40,w:700,col:"green"});
    D.box(c,70,320,350,96,{fill:"amber",col:"ink",w:3,r:14});kz_scribble(c,88,328);
    D.arrow(c,[430,368],[470,368],{col:"ink",w:3.5,head:14});
    D.card(c,480,320,{icon:"gear",lines:[["in the job",{size:32}]],fill:"orange",h:96});
    D.arrow(c,[736,368],[782,368],{col:"ink",w:3.5,head:14});},[60,160,1090,426]),
  {s:"a muddle",x:244,y:382,size:38,w:700,col:"amber",at:w("muddle","a muddle",-0.2),d:0.6},
  {s:"a faster muddle",x:1160,y:382,size:44,w:700,col:"amber",align:"right",at:w("muddle","faster muddle",-0.3),d:0.9}];
// 3. on Monday (Helena, at the board seen close): Ivy's Monday as a chart, and the four steps; she ticks each at the board's right edge
// as the voice comes to it, clear of what is written, and adds the last words
const KZ_MON=[["one chore, each step timed","one","pick"],["drop · write the rest down","two","Drop"],["automate a step, check it","three","Automate"],["if you lead: ask, give time","four","ask what's"]];
const kz_boardM=(sc,w)=>[...kz_rec("On Monday",{},c=>{const D=PK.sk;
    D.panel(c,70,140,380,300,{title:"Ivy's Monday",col:"orange",fill:"orange"},(cc,x,y)=>{
      D.bars(cc,x+40,y+50,300,130,[{v:120,col:"amber",top:"120"},{v:30,col:"orange",top:"30"},{v:10,col:"green",top:"10"}],{size:30});
      D.text(cc,"minutes, each Monday",x+40,y+218,{size:28,col:"mut"});});
    KZ_MON.forEach(([s],i)=>{const y=180+i*74;D.disc(c,512,y-12,24,{fill:["orange","amber","green","blue"][i],col:"ink",w:3});D.text(c,String(i+1),512,y-1,{size:30,w:700,align:"center"});D.text(c,s,556,y,{size:36});});},[60,140,1040,450]),
  ...KZ_MON.map(([,id,word],i)=>({k:"tick",x:1150,y:166+i*74,r:18,col:"green",at:w(id,word,0.3),d:0.3})),
  {s:"and show the small wins",x:1180,y:470,size:44,w:700,col:"green",align:"right",at:w("four","show the small wins",-0.3),d:1.1}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page.
   The ward sister's is written plainly; Ivy's and Helena's are sketched pages, almost done, and the pen adds the last words. */
// 1. kaizen (the ward sister's notebook)
const kz_note1=(sc,w)=>[
  {s:"Kaizen",x:70,y:124,size:80,w:760,col:"blue",at:w("kaizen","kaizen",-0.3),d:0.5,marks:[["under","blue",null,0.3]]},
  {s:"a small change, our own",x:110,y:250,size:54,at:w("kaizen","propose",-0.4),d:1.0},
  {s:"try · check",x:110,y:360,size:56,col:"orange",at:w("kaizen","try",-0.2),d:0.6},
  {s:"keep or drop",x:110,y:470,size:56,col:"green",at:w("kaizen","keep or drop",-0.2),d:0.7}];
// 2. where the cycle comes from (Ivy): a line of years, and what each added; the pen adds the names they gave it
const kz_note2=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Where it comes from",86,124,{size:76});
    D.timeline(c,110,250,860,[{u:0.07,s:"1939",sub:"Shewhart",col:"blue",up:false},{u:0.42,s:"1950",sub:"Deming, in Japan",col:"orange",up:false},{u:0.86,s:"1986",sub:"Imai's book",col:"green",up:false}],{size:34});
    D.icon(c,"loop",170,420,34,{fill:"blue"});D.icon(c,"flag",471,420,34,{fill:"orange"});D.icon(c,"book",850,420,34,{fill:"green"});
    D.line(c,[[100,620],[980,620]],{col:"mut",w:2.5,dash:[8,10],seed:4});},[60,40,1040,800]),
  {s:"a circle",x:110,y:530,size:46,w:700,col:"blue",at:w("shew","circle",-0.4),d:0.6},
  {s:"plan, do, study, act",x:380,y:530,size:46,w:700,col:"orange",at:w("deming","plan, do",-0.3),d:1.2},
  {s:"kaizen: change for the better",x:110,y:710,size:54,w:700,col:"green",at:w("imai","kaizen",-0.3),d:1.4}];
// 3. Ivy's checklist (Ivy): her four steps, each with what good looks like; the pen adds what makes it a checklist
const KZ_STEPS=["bookings in","head counts","totals","the page"];
const kz_note3=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Monday checklist",86,124,{size:76});
    D.box(c,100,270,880,330,{fill:"blue",col:"ink",w:3,r:16});D.caps(c,"the steps",140,318,{col:"blue",size:30});
    KZ_STEPS.forEach((s,i)=>{const by=386+i*54;D.disc(c,150,by-12,20,{fill:"white",col:"ink",w:2.5});D.text(c,String(i+1),150,by-1,{size:28,w:700,align:"center"});
      D.text(c,s,190,by,{size:36});D.icon(c,"check",900,by-12,16,{fill:"green"});});
    D.icon(c,"cal",140,640,28,{fill:"white"});D.icon(c,"people",140,730,28,{fill:"white"});},[60,40,1040,800]),
  {s:"each step, in order",x:110,y:226,size:46,w:700,col:"blue",at:w("list","each step",-0.3),d:1.0},
  {s:"what good looks like",x:940,y:320,size:36,w:700,col:"green",align:"right",at:w("list","what good",-0.2),d:1.0},
  {s:"the same each Monday",x:190,y:654,size:46,w:700,at:w("same","every Monday",-0.3),d:1.0},
  {s:"anyone can do it",x:190,y:744,size:46,w:700,col:"green",at:w("same","anyone",-0.3),d:0.8}];
// 4. Helena's part (Helena): who changed it, and her three things; the pen adds what she did, as the voice says it
const kz_note4=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"My part",86,124,{size:84});
    D.panel(c,640,40,360,150,{title:"who changed it",col:"green",fill:"green"},(cc,x,y)=>D.faces(cc,x+80,y+40,["ivy","jun","sam"],{r:28,gap:100}));
    D.panel(c,100,210,880,190,{title:"1 · ask",col:"blue",fill:"blue"},(cc,x,y)=>{D.icon(cc,"q",x+50,y+36,28,{fill:"white"});D.face(cc,"sam",x+820,y+70,26);});
    D.panel(c,100,420,880,170,{title:"2 · give the time",col:"amber",fill:"amber"},(cc,x,y)=>{D.icon(cc,"clock",x+50,y+30,28,{fill:"white"});
      D.text(cc,"no meeting takes them",x+100,y+92,{size:30,col:"mut"});});
    D.panel(c,100,610,880,170,{title:"3 · show the small wins",col:"green",fill:"green"},(cc,x,y)=>{D.icon(cc,"bars",x+50,y+40,28,{fill:"white"});
      D.text(cc,"Ivy's chart",x+100,y+52,{size:30,col:"mut"});
      D.bars(cc,x+500,y,260,90,[{v:120,col:"amber"},{v:30,col:"orange"},{v:10,col:"green"}],{size:28});});},[60,40,1040,800]),
  {s:"what's in the way?",x:200,y:318,size:44,w:700,col:"blue",at:w("ask","in the way",-0.4),d:1.0},
  {s:"room for Sam's reviews",x:200,y:376,size:40,w:700,at:w("ask","made room",-0.2),d:1.1},
  {s:"Thursday afternoons",x:200,y:530,size:44,w:700,col:"amber",at:w("give","Thursday",-0.3),d:1.0}];
