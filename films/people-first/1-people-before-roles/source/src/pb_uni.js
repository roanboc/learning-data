/* ===== People before roles: the university, February 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the seven work, the chart of seven boxes pinned on the room's wall and the list of 46 requests (two
   sheets, shown close in a card that comes out of them), the boards' rows that Carmen Vidal writes, the pages Helena keeps, and Erin's
   chat with Jun. Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the
   module: blue a plan or a rule (the chart), orange data (the list of requests), green something done or of value, amber a risk or
   what isn't so. */
AG_PLACES.pbTeam=PK.place.team;AG_PLACES.pbCorner=PK.place.corner;AG_PLACES.pbCampus=PK.place.campus;AG_PLACES.pbLecture=PK.place.lecture;
AG_PLACES.pbBoard=PK.place.board;AG_PLACES.pbNotes=c=>PK.place.notes(c,{});
const PB_T=PK.ROOMS.team,PB_CA=PK.ROOMS.campus,PB_CO=PK.ROOMS.corner,PB_LE=PK.ROOMS.lecture;
const pb_hT=fl=>PK.hAt(fl,PB_T.eye),pb_hC=fl=>PK.hAt(fl,PB_CA.eye),pb_hL=fl=>PK.hAt(fl,PB_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const pb_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const pb_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const PB_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const PB_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const PB_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const pb_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

/* ---------------------------------------------------------------- the chart of seven boxes, and the list of 46
   The chart as it is pinned on the room's wall, right of the board (small: it is there to be seen, not read), and as it is seen close,
   in a card that comes out of it. In the card: Helena's box at the top, the seven under it, each with its one line up; o.lit (0 to 1)
   lights the boxes one by one; o.jun (0 to 1) rings Jun's box; o.up (0 to 1) draws its one line up again, in blue; o.turn (0 to 1)
   draws the lines the chart doesn't have, in pencil: four, to Jun's box from Marta's, Erin's, Noor's and Sam's. */
const PB_PIN=[1262,226,250,176];
const PB_SEVEN=["Yusuf","Noor","Marta","Jun","Erin","Sam","Tomás"],PB_JUN=3;
function pb_chartPin(x){const S=PK.S,U=PK.u,[px,py,pw,ph]=PB_PIN;S.begin(x,{lw:2.2});PK.sheet(x,px,py,pw,ph,{pin:true});
  x.save();x.strokeStyle=U.css(PK.C.blue);x.lineWidth=2;x.strokeRect(px+pw/2-22,py+26,44,22);x.beginPath();x.moveTo(px+pw/2,py+48);x.lineTo(px+pw/2,py+80);x.moveTo(px+24,py+80);x.lineTo(px+pw-24,py+80);
  for(let i=0;i<7;i++){const bx=px+24+i*(pw-48)/6;x.moveTo(bx,py+80);x.lineTo(bx,py+100);}x.stroke();
  for(let i=0;i<7;i++){const bx=px+24+i*(pw-48)/6;x.strokeRect(bx-13,py+100,26,22);}x.restore();}
function pb_chartCard(c,x,y,w,h,o){o=o||{};const U=PK.u,bw=(w-60)/7-6,top=y+60,row=y+190,cx=i=>x+30+bw/2+i*(bw+6),blue=PK.C.blue;
  ag_T(c,"THE DATA TEAM",x+30,y+44,{w:800,size:28,ls:3,col:PK.C.mut});
  const box=(bx,by,s,a,col,fill,ww)=>{const bw_=ww||bw;c.save();c.globalAlpha*=a;c.fillStyle=U.css(fill||[244,246,250]);c.strokeStyle=U.css(col);c.lineWidth=3;c.beginPath();U.rrect(c,bx-bw_/2,by,bw_,54,8);c.fill();c.stroke();
    ag_T(c,s,bx,by+37,{w:700,size:28,align:"center",col:PK.C.ink});c.restore();};
  const hx=x+w/2;box(hx,top,"Helena",1,blue,null,bw*1.5);c.save();c.strokeStyle=U.css(blue);c.lineWidth=3;c.beginPath();c.moveTo(hx,top+54);c.lineTo(hx,row-30);c.moveTo(cx(0),row-30);c.lineTo(cx(6),row-30);
  for(let i=0;i<7;i++){c.moveTo(cx(i),row-30);c.lineTo(cx(i),row);}c.stroke();c.restore();
  PB_SEVEN.forEach((s,i)=>box(cx(i),row,s,1,blue,o.lit!=null&&U.clamp(o.lit*7-i,0,1)>0.5?[214,228,244]:null));
  if(o.up){const q=U.clamp(o.up,0,1),jx=cx(PB_JUN);c.save();c.strokeStyle=U.css(blue);c.lineWidth=7;c.beginPath();c.moveTo(jx,row);c.lineTo(jx,U.lerp(row,row-30,Math.min(1,q*3)));
    if(q>0.33){c.lineTo(U.lerp(jx,hx,U.clamp((q-0.33)*3,0,1)),row-30);}if(q>0.66){c.lineTo(hx,U.lerp(row-30,top+54,U.clamp((q-0.66)*3,0,1)));}c.stroke();c.restore();}
  if(o.jun){c.save();c.strokeStyle=U.css(PK.C.blue);c.lineWidth=4;c.beginPath();c.ellipse(cx(PB_JUN),row+27,bw*0.78,44,0,0,U.TAU*U.clamp(o.jun,0,1));c.stroke();c.restore();}
  if(o.turn){const jx=cx(PB_JUN),by=row+54;c.save();c.strokeStyle=U.css([96,92,98]);c.lineWidth=3.2;c.lineCap="round";
    [2,4,1,5].forEach((i,k)=>{const q=U.clamp(o.turn*4-k,0,1);if(q<=0)return;const sx=cx(i),dep=40+Math.abs(i-PB_JUN)*14;c.beginPath();
      for(let s=0;s<=20*q;s++){const u=s/20,xx=U.lerp(sx,jx,u),yy=by+8+Math.sin(Math.PI*u)*dep;s?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();
      if(q>=1){c.beginPath();c.moveTo(jx+(sx<jx?-16:16),by+22);c.lineTo(jx+(sx<jx?-4:4),by+10);c.lineTo(jx+(sx<jx?-2:2),by+26);c.stroke();}});c.restore();}}
// the list: 46 open requests, its first lines; o.sort (0 to 1): the lines fade out and come back in order; o.k (0 to 1): how far the card has come
const PB_LIST=[["Room use by term",2],["Student numbers, faculty",0],["Library hours",3],["Fees report fix",1]];
function pb_listCard(c,x,y,w,h,o){o=o||{};const U=PK.u,s=U.sine(U.clamp(o.sort||0,0,1));ag_T(c,"46 OPEN REQUESTS",x+30,y+44,{w:800,size:28,ls:3,col:PK.C.orange});
  PB_LIST.forEach(([t,r],i)=>{const yy=y+100+(s<0.5?i:r)*52;c.save();c.globalAlpha*=Math.abs(1-2*s);c.fillStyle=U.css(PK.C.orange);c.beginPath();c.arc(x+42,yy-10,7,0,U.TAU);c.fill();ag_T(c,t,x+62,yy,{w:600,size:30,col:PK.C.ink});c.restore();});
  ag_T(c,"+ 42 more",x+62,y+100+4*52,{w:600,size:28,col:PK.C.mut});}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const PB_DESK={sam:[1230,PB_T.back],jun:[1808,PB_T.back],marta:[560,PB_T.mid]};
function pb_team(x,tt,o){o=o||{};const r={},HB=pb_hT(PB_T.back),HM=pb_hT(PB_T.mid);PK.clock(x,PB_T.clock[0],PB_T.clock[1],PB_T.clock[2],o.clock===undefined?9:o.clock);pb_chartPin(x);
  const items=[{fl:PB_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:"sam",PB_DESK.sam[0],PB_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:PB_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",PB_DESK.jun[0],PB_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:PB_T.mid,i:2,draw:c=>{r.marta=PK.atDesk(c,o.marta===null?null:"marta",PB_DESK.marta[0],PB_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.pbTeam=(x,tt)=>pb_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (pbBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const PB_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const pb_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},PB_RB,{h:pb_hT(PB_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const PB_SIDE={x:1690,floor:900},PB_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function pb_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=pb_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||pb_lis(tt,-0.2)),people:[
    {fl:PB_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",PB_SAMC.x,PB_SAMC.floor,pb_hT(PB_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||pb_lis(tt,-0.25)));}},
    {fl:PB_RB.floor,draw:c=>{Jc=pb_roomBoard(c,tt,o.rows||[],"carmen",{say:o.say,events:o.events});}},
    {fl:PB_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",PB_SIDE.x,PB_SIDE.floor,pb_hT(PB_SIDE.floor),PK.poseMix("clasp",PB_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||pb_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* the boards' rows, in the board's own px (1250 by 524), each with the time the voice says it; PK.pace makes a row wait until Carmen
   can have walked to it, so they are laid out for someone who walks: on from left to right, and nothing drawn back along words */
// 1. what a chart shows, and a standard for putting people first
const pb_boardA=(sc,w)=>[
  {s:"A chart shows",x:70,y:104,size:62,w:700,col:"blue",at:w("boxes","chart shows",-0.2),d:0.9},
  {s:"who reports to whom",x:70,y:186,size:54,at:w("boxes","reports",-0.4),d:1.1},
  {s:"not who is in the boxes",x:560,y:268,size:54,col:"amber",at:w("boxes","doesn't",-0.1),d:1.3},
  {s:"ISO 27500:2016, the human-centred organization",x:70,y:364,size:42,col:"mut",at:w("iso","standard",-0.3),d:1.6},
  {s:"Value your people,",x:70,y:452,size:56,w:700,col:"blue",at:w("iso","value",-0.2),d:1.0},
  {s:"differences a strength",size:54,col:"green",at:w("iso","differences",-0.3),d:1.2}];
// 2. who people turn to: Ubuntu, and shared leadership
const pb_boardB=(sc,w)=>[
  {s:"Ubuntu:",x:70,y:104,size:62,w:700,col:"blue",at:w("ubuntu","Ubuntu",-0.1),d:0.6},
  {s:"a person through other people",size:52,at:w("ubuntu","person is",-0.2),d:1.3},
  {s:"Shared leadership",x:70,y:200,size:62,w:700,col:"blue",at:w("shared","shared leadership",-0.2),d:1.0},
  {s:"Wang, Waldman, Zhang, 2014",size:42,col:"mut",at:w("shared","Researchers",-0.2)+2.2,d:1.1},
  {s:"42 samples: teams do better",x:70,y:290,size:54,col:"green",at:w("review","forty-two",-0.3),d:1.2},
  {s:"most in how they work together",x:70,y:370,size:52,at:w("review","most of all",-0.2),d:1.3},
  {s:"Anyone can lead,",x:70,y:452,size:56,w:700,col:"blue",at:w("title","Anyone",-0.2),d:0.9},
  {s:"no title needed",size:54,at:w("title","from where",-0.2),d:0.8}];

/* ---------------------------------------------------------------- Helena's notebook: what she keeps (the page's own px)
   One pen writes a page: each row has the time the voice says it, in the order the pen writes them, and the page is paced once
   (PK.pace(ctx, null, rows)). Glosses go in one muted column at the right. */
// 3. the four questions, and what she never asks
const pb_note1=(sc,w)=>[
  {s:"Four questions",x:70,y:124,size:88,w:700,col:"blue",at:w("four","four questions",-0.3),d:0.9,marks:[["under","blue",null,0.3]]},
  {s:"Proud of?",x:130,y:262,size:66,at:w("q12","proud",-0.4),d:0.6},{s:"More of?",x:560,y:262,size:66,at:w("q12","more",-0.4),d:0.6},
  {s:"In your way?",x:130,y:392,size:66,at:w("q34","way",-0.6),d:0.7},{s:"Know, to work well?",x:560,y:392,size:54,at:w("q34","know",-0.5),d:1.0},
  {k:"cross",x:100,y:518,r:16,col:"amber",at:w("never","never",-0.3),d:0.25},{s:"Health, family: never",x:140,y:536,size:62,col:"amber",at:w("never","health",-0.3),d:1.1},
  {s:"only what they offer",x:140,y:640,size:46,col:"mut",at:w("never","offer",-0.4),d:0.8}];
// 5. her first week, written in the pause that ends Friday
const pb_note2=sc=>{const b=sc.cues.breath-1.6,w=(id,word,off)=>wAt(sc,id,word,off);return[
  {s:"My first week",x:70,y:124,size:88,w:700,col:"blue",at:w("knows","planned",-0.6),d:0.8,marks:[["under","blue",null,0.3]]},
  {k:"tick",x:100,y:244,r:18,col:"green",at:w("knows","knows seven",-0.4),d:0.25},{s:"An hour with each of the seven",x:140,y:262,size:60,at:w("knows","knows seven",-0.15),d:1.2},
  {k:"tick",x:100,y:374,r:18,col:"green",at:w("knows","expect",-0.3),d:0.25},{s:"Said what stays, this month",x:140,y:392,size:60,at:w("knows","expect",0),d:1.1},
  {s:"Jun: room to lead",x:140,y:520,size:60,at:b+0.6,d:0.9},
  {s:"Nobody's work planned yet",x:140,y:640,size:62,w:700,at:b+2.0,d:1.1,marks:[["hl","green"]]}];};
// 6. on Monday: the four things to keep; the last, ringed, sums up
const pb_note3=(sc,w)=>{const dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:w("m1","On Monday",-0.3),d:0.6,marks:[["under","blue",null,0.3]]},
  dot(252,"blue",w("m1","sit down",-0.4)),{s:"Sit down with each person",x:128,y:252,size:62,at:w("m1","sit down",-0.2),d:1.1},
  dot(372,"green",w("m2","Ask",-0.4)),{s:"Ask about them at work",x:128,y:372,size:62,at:w("m2","Ask",-0.2),d:1.1},
  dot(492,"blue",w("m3","Notice",-0.4)),{s:"Notice who they turn to",x:128,y:492,size:62,at:w("m3","Notice",-0.2),d:1.1},
  {s:"make room",x:780,y:492,size:44,col:"mut",at:w("m3","make room",-0.2),d:0.6},
  // the last has no dot: the ring round it would run through one
  {s:"Say what won't change yet",x:128,y:618,size:62,at:w("m4","say",-0.3),d:1.1,marks:[["ring","blue",sc.ends.m4-0.3]]}];};

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const PB_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},PB_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const PB_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function pb_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=PB_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(PB_SITH,PB_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,PB_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=PK.person(x,"helena",hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,PB_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}

/* ---------------------------------------------------------------- Erin's chat with Jun
   As Jun's screen has it: Erin's question comes in (at a), and Jun answers (at b), typed in a second. It says what the voice says:
   Erin asks Jun about a model. */
const pb_chat=(a,b)=>({title:"Erin Walsh",who:["erin"],me:"jun",msgs:[{who:"erin",s:"Got a minute? A model looks odd.",at:a},{who:"jun",s:"Coming over.",at:b,type:1.0}]});
