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








/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 0. five S (the director, at his office's board)
const kz_boardO=(sc,w)=>[
  {s:"Five S",x:70,y:110,size:64,col:"blue",at:w("fives","five S",-0.3),d:0.6},
  {s:"sort · set in order",x:110,y:230,size:54,at:w("steps","Sort",-0.2),d:1.0},
  {s:"shine · standardise",x:300,y:340,size:54,at:w("steps","Shine",-0.2),d:1.0},
  {s:"sustain",x:620,y:450,size:58,col:"green",at:w("steps","sustain",-0.2),d:0.6}];
// 1. kaizen's first idea (Carmen, at the team's board)
const kz_boardA=(sc,w)=>[
  {s:"Kaizen",x:70,y:120,size:64,col:"blue",at:w("idea","first idea",-0.3),d:0.5},
  {s:"everyone's job · own work",x:110,y:260,size:52,at:w("idea","everyone's job",-0.2),d:1.1},
  {s:"small steps",x:560,y:400,size:56,col:"green",at:w("idea","small steps",-0.3),d:0.6}];
// 1b. one cycle for each step (Carmen's board, close)
const kz_boardB=(sc,w)=>[
  {s:"Each small step",x:70,y:120,size:60,col:"blue",at:w("cycle","small step",-0.3),d:0.8},
  {s:"plan · do · study · act",x:200,y:270,size:56,col:"blue",at:w("cycle","plan a change",-0.2),d:1.1},
  {s:"keep it, or drop it",x:460,y:420,size:54,col:"green",at:w("cycle","keep it",-0.2),d:0.9}];
// 2. standardise, then automate (Carmen)
const kz_boardC=(sc,w)=>[
  {s:"Standardise, then automate",x:70,y:130,size:54,col:"blue",at:w("muddle","automate",-0.5),d:1.1},
  {s:"a muddle, automated:",x:200,y:270,size:52,at:w("muddle","a muddle",-0.2),d:0.9},
  {s:"a faster muddle",x:520,y:400,size:56,col:"amber",at:w("muddle","faster muddle",-0.3),d:0.8}];
// 3. on Monday (Helena, at the board seen close)
const kz_boardM=(sc,w)=>[
  {s:"On Monday",x:70,y:110,size:64,col:"blue",at:w("one","On Monday",0),d:0.6},
  {s:"one chore · time each step",x:110,y:210,size:48,col:"orange",at:w("one","one chore",-0.2),d:1.1},
  {s:"drop · write the rest down",x:200,y:300,size:48,at:w("two","Drop",-0.2),d:1.1},
  {s:"automate a step · check it",x:290,y:390,size:48,col:"green",at:w("three","Automate",-0.2),d:1.1},
  {s:"lead: ask · give time · show wins",x:300,y:470,size:44,col:"blue",at:w("four","if you lead",-0.2),d:1.3}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): one pen writes a page */
// 1. kaizen (the ward sister's notebook)
const kz_note1=(sc,w)=>[
  {s:"Kaizen",x:70,y:124,size:80,w:760,col:"blue",at:w("kaizen","kaizen",-0.3),d:0.5,marks:[["under","blue",null,0.3]]},
  {s:"a small change, our own",x:110,y:250,size:54,at:w("kaizen","propose",-0.4),d:1.0},
  {s:"try · check",x:110,y:360,size:56,col:"orange",at:w("kaizen","try",-0.2),d:0.6},
  {s:"keep or drop",x:110,y:470,size:56,col:"green",at:w("kaizen","keep or drop",-0.2),d:0.7}];
// 2. where the cycle comes from (Ivy)
const kz_note2=(sc,w)=>[
  {s:"Where it comes from",x:70,y:124,size:72,w:760,col:"blue",at:w("shew","Shewhart",-0.4),d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"Shewhart · 1939 · a circle",x:110,y:250,size:50,at:w("shew","circle",-0.6),d:1.0},
  {s:"Deming · Japan, 1950",x:110,y:350,size:50,at:w("deming","Japan",-0.3),d:0.9},
  {s:"plan, do, study, act",x:150,y:450,size:50,col:"green",at:w("deming","study",-0.4),d:0.9},
  {s:"Imai · 1986 · kaizen",x:110,y:550,size:50,col:"blue",at:w("imai","book",-0.2),d:0.9}];
// 3. Ivy's checklist
const kz_note3=(sc,w)=>[
  {s:"Monday checklist",x:70,y:124,size:76,w:760,col:"blue",at:w("list","checklist",-0.4),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"four steps, in order",x:110,y:250,size:54,at:w("list","in order",-0.4),d:0.9},
  {s:"what good looks like",x:110,y:350,size:54,col:"green",at:w("list","what good",-0.2),d:0.9},
  {s:"the same each Monday",x:110,y:450,size:54,at:w("same","every Monday",-0.3),d:0.9},
  {s:"anyone can do it",x:110,y:550,size:54,col:"green",at:w("same","anyone",-0.3),d:0.8}];
// 4. Helena's part
const kz_note4=(sc,w)=>[
  {s:"My part",x:70,y:124,size:80,w:760,col:"blue",at:w("none","three things",-0.4),d:0.5,marks:[["under","blue",null,0.3]]},
  {s:"ask what's in the way",x:110,y:250,size:54,at:w("ask","in the way",-0.4),d:1.0},
  {s:"make room · Sam's reviews",x:110,y:360,size:50,col:"orange",at:w("ask","made room",-0.2),d:1.1},
  {s:"give the time · Thursdays",x:110,y:470,size:50,col:"green",at:w("give","Thursday afternoons",-0.3),d:1.1}];
