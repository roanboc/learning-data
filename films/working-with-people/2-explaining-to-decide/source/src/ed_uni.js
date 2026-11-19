/* ===== Explaining so people can decide: the university, April to June 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows Carmen Vidal writes, and the pages Ivy and Helena keep, and Daniels's count in 1952.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.edTeam=PK.place.team;AG_PLACES.edCorner=PK.place.corner;AG_PLACES.edCampus=PK.place.campus;AG_PLACES.edLecture=PK.place.lecture;
AG_PLACES.edBoard=PK.place.board;AG_PLACES.edNotes=c=>PK.place.notes(c,{});
const ED_T=PK.ROOMS.team,ED_CA=PK.ROOMS.campus,ED_CO=PK.ROOMS.corner,ED_LE=PK.ROOMS.lecture;
const ed_hT=fl=>PK.hAt(fl,ED_T.eye),ed_hC=fl=>PK.hAt(fl,ED_CA.eye),ed_hL=fl=>PK.hAt(fl,ED_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const ed_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const ed_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const ED_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const ED_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const ED_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const ed_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function ed_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const ED_DESK={sam:[1230,ED_T.back],jun:[1808,ED_T.back],marta:[560,ED_T.mid]};
function ed_team(x,tt,o){o=o||{};const r={},HB=ed_hT(ED_T.back),HM=ed_hT(ED_T.mid);PK.clock(x,ED_T.clock[0],ED_T.clock[1],ED_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:ED_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),ED_DESK.sam[0],ED_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:ED_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",ED_DESK.jun[0],ED_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:ED_T.mid,i:2,draw:c=>{r.marta=ed_desk(c,o.marta===null?null:(o.deskWho||"marta"),ED_DESK.marta[0],ED_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.edTeam=(x,tt)=>ed_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const ED_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const ed_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},ED_RB,{h:ed_hT(ED_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const ED_SIDE={x:1690,floor:900},ED_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function ed_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=ed_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||ed_lis(tt,-0.2)),people:[
    {fl:ED_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",ED_SAMC.x,ED_SAMC.floor,ed_hT(ED_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||ed_lis(tt,-0.25)));}},
    {fl:ED_RB.floor,draw:c=>{Jc=ed_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:ED_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",ED_SIDE.x,ED_SIDE.floor,ed_hT(ED_SIDE.floor),PK.poseMix("clasp",ED_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||ed_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const ED_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},ED_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const ED_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function ed_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=ED_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(ED_SITH,ED_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,ED_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,ED_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const ED_LE2=PK.ROOMS.lecture;
function ed_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function ed_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-6,w,30),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+62,{w:700,size:30,color:U.css(PK.C.ink)});y+=96;}}





/* ---------------------------------------------------------------- the boards (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Daniels's board in 1952 is written plainly, as his office's was; Carmen's and Helena's are drawn as a
   designer would, a graphic recording pinned over the board, almost done when it first shows (PK.sk.drawn): whoever explains adds the
   last marks and words as the voice says them, on from left to right, and steps clear. */
// 0. Daniels's count in 1952, on his office's board: how many of the flyers were average, measurement by measurement
const ed_boardO=(sc,w)=>[
  {s:"4,063 flyers",x:70,y:110,size:64,col:"orange",at:w("height","men",-0.6),d:0.8},
  {s:"height · 1,055",x:110,y:220,size:58,at:w("height","height",-0.3),d:0.9},
  {s:"chest · 302",x:560,y:220,size:58,at:w("chest","chest",-0.3),d:0.8},
  {s:"143 · 73 · 28 · 12",x:170,y:330,size:58,at:w("fewer","fewer",-0.1),d:1.2},
  {s:"6 · 3 · 2",x:700,y:330,size:58,at:w("fewer","six",-0.2),d:0.9},
  {s:"all ten · not one",x:520,y:450,size:64,col:"amber",at:w("none","not one",-0.4),d:0.9,marks:[["under","amber",null,0.3]]}];
// 1. Minto's pyramid (Carmen, at the team's board): the boxes are there, joined as a tree; she names each level as the voice comes to it
const ed_boardA=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"The pyramid",{ref:["Barbara Minto","1978"],rsize:32});
    // the answer at the top, three reasons under it, the evidence under each
    const MX=[70,260,450],MW=160;D.box(c,250,146,200,62,{fill:"green",col:"ink",w:3,r:10});D.icon(c,"check",350,177,20,{fill:"white"});
    MX.forEach((x,i)=>{D.line(c,[[350,208],[x+MW/2,262]],{col:"ink",w:2.5,seed:i+1});D.box(c,x,262,MW,56,{fill:"blue",col:"ink",w:3,r:10});
      for(let j=0;j<2;j++){const ex=x+8+j*80;D.line(c,[[x+MW/2,318],[ex+32,372]],{col:"ink",w:2,seed:i*2+j+5});D.box(c,ex,372,64,44,{fill:"orange",col:"ink",w:2.5,r:8});}});
    // a dashed line from each level to where its name goes
    [[462,178,604],[622,290,664],[614,394,640]].forEach(([x0,y,x1],i)=>D.line(c,[[x0,y],[x1,y]],{col:"mut",w:2.5,dash:[8,10],seed:i+9}));}),
  {s:"the answer",x:620,y:194,size:48,w:700,col:"green",at:w("minto","answer",-0.2),d:0.7},
  {s:"the reasons",x:680,y:306,size:48,w:700,col:"blue",at:w("minto","reasons",-0.2),d:0.7},
  {s:"the evidence under each",x:1180,y:410,size:46,w:700,col:"orange",align:"right",at:w("minto","evidence",-0.2),d:1.0}];
// 2. show the data, to whom (Carmen): Tufte's chart of the whole week and Knaflic's reader are there; she writes what each says
const ed_boardB=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"Charts for a decision");
    D.panel(c,70,138,560,326,{title:"Tufte · 1983",col:"blue",fill:"blue"},(cc,x,y)=>{
      // every day of the week as it is, the peak in it, nothing summed away
      D.bars(cc,x+30,y+6,280,112,[{v:22,col:"orange"},{v:93,col:"orange"},{v:91,col:"orange"},{v:90,col:"orange"},{v:18,col:"orange"}],{max:100});
      D.text(cc,"93%",x+352,y+62,{size:46,w:700,col:"orange"});D.text(cc,"at the peak",x+352,y+100,{size:30,col:"mut"});
      D.text(cc,"above all else,",x+30,y+180,{size:32,col:"mut"});});
    D.panel(c,670,138,510,326,{title:"Knaflic · 2015",col:"green",fill:"green"},(cc,x,y)=>{
      D.icon(cc,"people",x+50,y+48,32,{fill:"blue"});D.text(cc,"the Council",x+100,y+104,{size:30,col:"mut"});
      D.icon(cc,"target",x+50,y+170,32,{fill:"amber"});D.text(cc,"they need to see",x+100,y+226,{size:30,col:"mut"});});}),
  {s:"show the data",x:100,y:444,size:50,w:700,col:"blue",at:w("tufte","show the data",-0.4),d:0.9},
  {s:"know who",x:770,y:262,size:48,w:700,col:"green",at:w("knaflic","know who",-0.2),d:0.6},
  {s:"the one thing",x:1150,y:384,size:48,w:700,col:"green",align:"right",at:w("knaflic","one thing",-0.2),d:0.8}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. fit the range (the designers' notebook, 1952 onwards)
const ed_note1=(sc,w)=>[
  {s:"Fit the range",x:70,y:124,size:80,w:760,col:"blue",at:w("range","range",-0.4),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"5 ft 5 to 6 ft 1",x:110,y:262,size:60,col:"orange",at:w("range","five foot five",-0.3),d:1.0},
  {s:"nine flyers in ten",x:110,y:372,size:60,col:"green",at:w("range","nine flyers",-0.2),d:0.9},
  {s:"not the average",x:110,y:482,size:60,col:"amber",at:w("fit","not the average",-0.2),d:0.8}];
// 2. Ivy's page, top first (Ivy): the page's parts are laid out in Minto's order; she writes the decision and the answer as the voice
// says them, and ticks the three lines under them
const ED_THREE=[["bars","orange","the peak","peak"],["door","amber","bookings nobody used","nobody"],["building","green","not to build","not to build"]];
const ed_note2=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Council · 1 June",86,124,{size:72});
    D.panel(c,100,172,880,150,{title:"the decision",col:"blue",fill:"blue"},(cc,x,y)=>D.icon(cc,"building",x+46,y+40,26,{fill:"white"}));
    D.panel(c,100,352,880,150,{title:"the answer",col:"green",fill:"green"},(cc,x,y)=>D.icon(cc,"clock",x+46,y+40,26,{fill:"white"}));
    D.caps(c,"three lines under it",110,566,{size:30,col:"mut"});
    ED_THREE.forEach(([ic,col,s],i)=>{const y=600+i*64;D.icon(c,ic,136,y+22,22,{fill:col});D.text(c,s,180,y+34,{size:40,w:700});});},[60,40,1040,800]),
  {s:"A new building now, or not yet?",x:190,y:290,size:46,w:700,col:"blue",at:w("decision","new building",-0.3),d:1.1},
  {s:"short only 10 to 2, Tue to Thu",x:190,y:470,size:46,w:700,col:"green",at:w("answer","short",-0.3),d:1.1},
  ...ED_THREE.map(([,,,word],i)=>({k:"tick",x:640,y:622+i*64,r:20,col:"green",at:w("three",word,-0.1),d:0.3}))];
// 3. what the average hid (Ivy): the week's average and the whole week are there; she rings the peak and writes what the picture shows
const ed_week=(c,x,y,cw,ch,o)=>{const D=PK.sk;o=o||{};for(let i=0;i<5;i++)for(let j=0;j<10;j++){const peak=i>=1&&i<=3&&j>=2&&j<=5,k=(i*7+j*3)%6;
    D.box(c,x+j*cw,y+i*ch,cw-6,ch-6,{fill:peak?PK.FILL.orange:k<2?"white":"orange",col:"ink",w:1.6,r:3});}
  if(o.days)["Mon","Tue","Wed","Thu","Fri"].forEach((d,i)=>D.text(c,d,x-14,y+i*ch+ch*0.62,{size:28,col:"mut",align:"right"}));
  if(o.hours)[["8",0],["12",4],["6",9]].forEach(([s,j])=>D.text(c,s,x+j*cw+(cw-6)/2,y+5*ch+28,{size:28,col:"mut",align:"center"}));};
const ed_note3=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"What it turns on",86,124,{size:76});
    // the week's average: one bar, 38% of its height
    D.caps(c,"the average",104,214,{size:28,col:"mut"});D.box(c,120,240,110,290,{fill:"white",col:"mut",w:2.5,r:6,dash:[8,8]});
    D.box(c,120,240+290*0.62,110,290*0.38,{fill:"orange",col:"ink",w:3,r:6});D.text(c,"38%",175,590,{size:48,w:700,col:"orange",align:"center"});
    // the whole week: the days down the side, the hours across
    D.caps(c,"the whole week",360,214,{size:28,col:"mut"});ed_week(c,400,240,56,52,{days:true,hours:true});
    D.text(c,"93%",400,610,{size:48,w:700,col:"orange"});D.text(c,"booked at the peak",524,610,{size:32,col:"mut"});},[60,40,1040,800]),
  {k:"ring",x:621,y:367,rx:140,ry:100,col:"green",at:w("daniels","one picture",-0.3),d:0.5},
  {s:"what the average hid",x:110,y:700,size:58,w:700,col:"green",at:w("daniels","what",-0.2),d:0.9}];
// 4. what it would take not to build (Ivy): the week is there, a peak class moved; she writes the two changes as the voice says them
const ed_note4=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Not to build",86,124,{size:80});
    ed_week(c,180,186,64,44,{days:true,hours:true});D.text(c,"93%",856,286,{size:48,w:700,col:"orange"});D.text(c,"at the peak",856,324,{size:30,col:"mut"});
    // one peak class, moved to an hour with rooms to spare
    D.arrow(c,[180+3*64+30,186+2*44+20],[180+8*64+24,186+2*44+20],{col:"green",w:4.5,bow:-46,dash:[10,8]});
    D.panel(c,100,470,880,290,{title:"what it would take",col:"green",fill:"green"},(cc,x)=>
      [["clock","move",606],["door","release",710]].forEach(([ic,s,y])=>{D.icon(cc,ic,x+50,y-15,26,{fill:"white"});D.text(cc,s,x+96,y,{size:46,w:700});}));},[60,40,1040,800]),
  {s:"1 peak class in 6",x:390,y:606,size:48,w:700,col:"green",at:w("take","one peak class",-0.3),d:0.9},
  {s:"rooms nobody uses",x:390,y:710,size:48,w:700,col:"green",at:w("take","release",-0.2),d:0.9}];
// 5. on Monday (Helena, at the team's board): the four steps are there; she ticks each as the voice comes to it, and adds the last words
const ED_MON=[["lead","blue","target",["the decision,","then the answer"],"one","decision"],["show","orange","bars",["what it turns on,","in a picture"],"two","Show"],
  ["say","amber","q",["what you","don't know"],"three","don't know"],["try","green","person",["it on someone","new to it"],"four","Try it"]];
const ed_boardM=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"On Monday");
    ED_MON.forEach(([h,col,ic,L],i)=>D.panel(c,70+i*280,140,262,276,{title:(i+1)+" · "+h,col,fill:col},(cc,x,y,pw)=>{D.icon(cc,ic,x+pw/2,y+44,36,{fill:"white"});
      L.forEach((s,j)=>D.text(cc,s,x+pw/2,y+140+j*42,{size:30,w:j?400:700,align:"center",col:j?"mut":"ink"}));}));}),
  ...ED_MON.map(([,,,,id,word],i)=>({k:"tick",x:70+i*280+228,y:170,r:18,col:"green",at:w(id,word,0.3),d:0.3})),
  {s:"then let them decide",x:1180,y:470,size:46,w:700,col:"green",align:"right",at:w("four","Then",0),d:0.9}];
