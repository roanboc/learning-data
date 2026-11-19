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

/* the boards, as a graphic recording on a sheet pinned over the team's board, in the board's own px (1250 by 524): drawn already
   when it first shows (PK.sk.drawn), and Carmen adds the last words as the voice says them. PK.pace makes a row wait until she can
   have walked to it, so the last words go on from left to right, at the foot or the right, and nothing is drawn back along words */
const PB_KEYS=["yusuf","noor","marta","jun","erin","sam","tomas"],PB_ROLE={yusuf:"shield",noor:"map",marta:"bars",jun:"gear",erin:"wrench",sam:"db",tomas:"doc"};
// 1. what a chart shows and doesn't, and a standard for putting people first
function pb_sheetA(c){const D=PK.sk;
  D.head(c,"People before roles",{col:"blue",ref:["ISO 27500:2016",["putting people first",{size:30}]],rsize:34,rx:1010});
  // the chart: Helena's box, one line down to seven boxes, a role drawn in each
  D.caps(c,"The chart",64,174,{col:"blue",size:30});
  D.box(c,222,190,160,50,{fill:"blue",col:"blue",w:3.5,r:8});D.text(c,"Helena",302,226,{size:32,w:700,align:"center"});
  D.line(c,[[302,240],[302,258]],{col:"blue",w:3.5,seed:2});D.line(c,[[86,258],[518,258]],{col:"blue",w:3.5,seed:3});
  PB_KEYS.forEach((k,i)=>{const x=56+i*72;D.line(c,[[x+30,258],[x+30,270]],{col:"blue",w:3.5,seed:i+5});D.box(c,x,270,60,58,{fill:"paper",col:"blue",w:3,r:8});D.icon(c,PB_ROLE[k],x+30,299,17,{fill:"blue"});});
  D.text(c,"who reports to whom",60,380,{size:38});
  // who is in the boxes: the seven, as they are
  D.arrow(c,[560,300],[640,272],{col:"amber",w:4.5,bow:-10,head:16});
  [["noor",712,204],["sam",832,204],["jun",952,204],["yusuf",1072,204],["marta",772,300],["erin",892,300],["tomas",1012,300]].forEach(([k,x,y])=>D.face(c,k,x,y,29,{}));
  // the standard, at the foot: its first principle drawn; Carmen finishes the line
  D.box(c,56,406,1140,76,{fill:"blue",col:"blue",w:3,r:18});D.icon(c,"people",104,446,24,{fill:"white"});
  D.text(c,"value your people,",148,458,{size:38,w:700,col:"blue"});}
const pb_boardA=(sc,w)=>[PK.sk.drawn(pb_sheetA),
  {s:"not who is in the boxes",x:668,y:388,size:44,w:700,col:"amber",at:w("boxes","doesn't",-0.1),d:1.3},
  {s:"and their differences, a strength",x:456,y:458,size:38,w:700,col:"green",at:w("iso","differences",-0.6),d:1.4}];
// 2. who they turn to: Ubuntu, Jun as the four see him, and what research on shared leadership found
function pb_sheetB(c){const D=PK.sk;
  D.head(c,"Who they turn to",{col:"green",ref:["Shared leadership",["Wang, Waldman, Zhang, 2014",{size:30}]],rsize:34,rcol:"green",rx:984});
  // Ubuntu, on the left
  D.caps(c,"Ubuntu",64,180,{col:"blue",size:32});D.lines(c,["a person is a person","through other people"],64,228,{size:34});
  D.icon(c,"people",160,336,38,{fill:"blue"});
  // Jun in the middle, four turning to him with what they bring
  const P=[["marta",470,184,"a number",-1],["erin",770,184,"a model",1],["noor",470,352,"her map",-1],["sam",770,352,"a load",1]];
  for(const [k,x,y] of P){const dx=620-x,dy=266-y,L=Math.hypot(dx,dy);D.arrow(c,[x+dx/L*40,y+dy/L*40],[620-dx/L*62,266-dy/L*62],{col:"green",w:4,bow:(k==="marta"||k==="sam")?10:-10,head:14});}
  D.face(c,"jun",620,262,36,{ring:"green"});
  for(const [k,x,y,s,side] of P){D.face(c,k,x,y,23,{});if(side)D.text(c,s,x+side*44,y+10,{size:30,col:"mut",align:side<0?"right":"left"});else D.text(c,s,x,y-42,{size:30,col:"mut",align:"center"});}
  // the research: teams that share the leading do better, most of all in how they work together
  D.caps(c,"42 samples",930,214,{col:"green",size:30});D.bars(c,930,236,220,116,[{v:3,col:"green",label:"results"},{v:5,col:"green",label:"teamwork"}]);
  // the foot: a ribbon for the last words
  D.ribbon(c,"",380,402,{col:"mut",width:770,size:40});}
const pb_boardB=(sc,w)=>[PK.sk.drawn(pb_sheetB),
  {k:"star",x:1152,y:250,r:15,col:"green",at:w("review","most of all",-0.3),d:0.5},
  {s:"No title needed:",x:414,y:440,size:40,w:700,at:w("title","Leading",-0.2),d:1.0},
  {s:"anyone can lead",size:40,w:700,col:"green",at:w("title","Anyone",-0.2),d:1.0}];
/* ---------------------------------------------------------------- Helena's notebook: what she keeps (the page's own px)
   Each page is sketched already, a heading on a highlighter's band, boxes with drawings and the people's portraits (PK.sk.drawn);
   her pen adds the last words and ticks, each as the voice says it, one stroke after the other (PK.pace(ctx, null, rows)). Nothing is
   below y 826 of the page, where the captions are. */
const PB_PAGE=[PK.SK.page.x,PK.SK.page.y,PK.SK.page.x+PK.SK.page.w,PK.SK.page.y+PK.SK.page.h];
// the gorge as she sketches it: two rock walls, the river, the bridge and its handrails, two people on it
function pb_bridgeSk(c,x,y,w,h){const U=PK.u,INK=PK.C.ink,rock=[176,150,128],riv=[120,170,166],gold=[214,176,92];c.save();c.lineCap="round";c.lineJoin="round";
  c.fillStyle=U.css(rock,0.55);c.strokeStyle=U.css(INK);c.lineWidth=3.4;
  for(const sg of[0,1]){const X=u=>sg?x+w*(1-u):x+w*u;c.beginPath();c.moveTo(X(0),y+h*0.25);c.lineTo(X(0.24),y+h*0.25);c.lineTo(X(0.36),y+h*0.62);c.lineTo(X(0.42),y+h);c.lineTo(X(0),y+h);c.closePath();c.fill();c.stroke();}
  c.fillStyle=U.css(riv,0.8);c.beginPath();c.moveTo(x+w*0.42,y+h);c.lineTo(x+w*0.46,y+h*0.86);c.lineTo(x+w*0.54,y+h*0.86);c.lineTo(x+w*0.58,y+h);c.closePath();c.fill();
  const L=[x+w*0.2,y+h*0.25],R=[x+w*0.8,y+h*0.25],sag=h*0.22,at=(u,dy)=>[U.lerp(L[0],R[0],u),U.lerp(L[1],R[1],u)+sag*4*u*(1-u)+(dy||0)];
  const curve=dy=>{c.beginPath();for(let i=0;i<=24;i++){const p=at(i/24,dy);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}};
  c.strokeStyle=U.css(gold);c.lineWidth=7;curve(0);c.stroke();c.strokeStyle=U.css(INK);c.lineWidth=2.4;curve(4);c.stroke();curve(-4);c.stroke();
  c.strokeStyle=U.css(gold);c.lineWidth=3;curve(-h*0.13);c.stroke();c.strokeStyle=U.css(U.dk(gold,0.3));c.lineWidth=1.6;c.beginPath();
  for(let i=1;i<20;i++){const a=at(i/20,-h*0.13),b=at(i/20,-3);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}c.stroke();
  c.fillStyle=U.css([206,196,180]);c.strokeStyle=U.css(INK);c.lineWidth=3;for(const p of[L,R]){c.beginPath();c.rect(p[0]-(p===L?w*0.06:0),p[1]-h*0.05,w*0.06,h*0.07);c.fill();c.stroke();}
  for(const [u,col] of[[0.38,[150,70,88]],[0.62,[98,128,160]]]){const p=at(u,-4),s=h*0.11;c.fillStyle=U.css(col);c.beginPath();U.rrect(c,p[0]-s*0.32,p[1]-s*1.5,s*0.64,s*1.0,s*0.2);c.fill();c.stroke();
    c.fillStyle=U.css([196,150,116]);c.beginPath();c.arc(p[0],p[1]-s*1.75,s*0.3,0,U.TAU);c.fill();c.stroke();c.beginPath();c.moveTo(p[0]-s*0.15,p[1]-s*0.5);c.lineTo(p[0]-s*0.18,p[1]);c.moveTo(p[0]+s*0.15,p[1]-s*0.5);c.lineTo(p[0]+s*0.18,p[1]);c.stroke();}
  c.restore();}
// 3. the four questions, asked of each of the seven, and what she never asks
function pb_page1(c){const D=PK.sk;
  D.title(c,"Four questions",80,132,{size:84,col:"blue"});
  D.icon(c,"clock",700,104,26,{fill:"amber"});D.lines(c,["an hour with each,",["where they work",{col:"mut"}]],740,98,{size:34});
  [["star","Proud of?","amber"],["plus","More of?","green"],["rock","In your way?","ink"],["key","Know, to work well?","blue"]].forEach(([ic,s,col],i)=>{const x=74+(i%2)*484,y=186+(i>>1)*140;
    D.box(c,x,y,466,118,{fill:"paper",col:"ink",w:3,r:14});D.icon(c,ic,x+56,y+59,28,{fill:col});D.text(c,s,x+102,y+74,{size:i===3?40:46});});
  D.text(c,"with each of the seven",74,510,{size:36,col:"mut"});PB_KEYS.forEach((k,i)=>D.face(c,k,500+i*78,494,25,{}));
  D.box(c,74,566,950,196,{fill:"amber",col:"amber",w:3.5,r:16});D.icon(c,"heart",132,632,24,{fill:"orange"});D.icon(c,"house",196,634,24,{fill:"amber"});D.icon(c,"speech",944,700,30,{fill:"white"});}
const pb_note1=(sc,w)=>[PK.sk.drawn(pb_page1,PB_PAGE),
  {k:"cross",x:164,y:632,r:52,col:"amber",at:w("never","never",-0.3),d:0.4},
  {s:"Health, family: never",x:262,y:648,size:56,w:700,col:"amber",at:w("never","health",-0.3),d:1.1},
  {s:"only what they offer",x:262,y:722,size:46,col:"mut",at:w("never","offer",-0.4),d:0.9}];
// 5. her first week, written in the pause that ends Friday
function pb_page2(c){const D=PK.sk;
  D.title(c,"My first week",80,132,{size:84,col:"blue"});pb_bridgeSk(c,760,52,250,124);
  [["Mon",["noor","sam"]],["Tue",["jun","yusuf"]],["Wed",["marta","erin"]],["Thu",["tomas"]],["Fri",null]].forEach(([d,who],i)=>{const x=74+i*190,fri=!who;
    D.box(c,x,196,174,226,{fill:fri?"green":"paper",col:fri?"green":"ink",w:3,r:12});D.text(c,d,x+87,244,{size:40,w:700,align:"center",col:fri?"green":"ink"});
    if(who)who.forEach((k,j)=>D.face(c,k,x+87,300+j*76,25,{}));else{D.icon(c,"people",x+87,306,34,{fill:"green"});D.text(c,"all seven",x+87,384,{size:34,w:700,align:"center",col:"green"});}});
  // what she did: two boxes to tick, and the list she sorted on Monday
  for(const [y,s] of[[506,"an hour with each of the seven"],[578,"said what stays, this month"]]){D.box(c,74,y-30,34,34,{fill:"paper",col:"ink",w:3,r:6});D.text(c,s,126,y,{size:38});}
  D.icon(c,"cards",92,638,20,{fill:"white"});D.text(c,"46 requests, sorted",126,650,{size:38,col:"mut"});
  // Jun, and the room she makes for him: beside the newcomer, in March
  D.box(c,700,462,326,214,{fill:"green",col:"green",w:3.5,r:16});D.text(c,"Jun: room to lead",863,510,{size:36,w:700,col:"green",align:"center"});
  D.face(c,"jun",782,586,29,{ring:"green"});D.arrow(c,[828,588],[876,588],{col:"green",w:4,head:12});
  D.disc(c,928,590,34,{col:"ink",w:3,dash:[7,7]});D.text(c,"?",928,604,{size:40,w:700,align:"center",col:"mut"});D.text(c,"in March",928,656,{size:34,align:"center",col:"mut"});
  // the foot: a ribbon for her last words
  D.ribbon(c,"",120,718,{col:"green",fill:[190,228,200],width:640,size:42});}
const pb_note2=sc=>{const w=(id,word,off)=>wAt(sc,id,word,off);return[PK.sk.drawn(pb_page2,PB_PAGE),
  {s:"Nobody's work planned yet",x:156,y:758,size:46,w:700,at:w("knows","nobody's",-0.1),d:1.3},
  {k:"tick",x:91,y:488,r:20,col:"green",at:w("knows","knows seven",-0.3),d:0.3},
  {k:"tick",x:91,y:560,r:20,col:"green",at:w("knows","expect",-0.3),d:0.3}];};
// 6. on Monday: the four things to keep, a card each with a drawing; the hand ticks three as the voice says them, and writes the last
function pb_page3(c){const D=PK.sk;
  D.title(c,"On Monday",80,132,{size:88,col:"blue"});D.icon(c,"cal",600,104,30,{fill:"blue"});
  D.sticky(c,730,66,286,138,{col:"sun",rot:0.035,draw:(cc,x,y,w,h)=>D.lines(cc,["before you plan","anyone's work"],x+22,y+70,{size:36})});
  const card=(i,fill,lines,draw)=>{const x=74+(i%2)*486,y=226+(i>>1)*294;D.box(c,x,y,464,276,{fill,col:"ink",w:3,r:16});draw(x,y);
    if(lines)D.lines(c,lines,x+30,y+158,{size:44});return[x,y];};
  card(0,"blue",["Sit down with","each person"],(x,y)=>{D.disc(c,x+64,y+66,36,{fill:"white",col:"ink",w:3});D.icon(c,"chair",x+64,y+66,22,{fill:"blue"});
    D.face(c,"helena",x+250,y+70,24,{});D.face(c,"sam",x+340,y+70,24,{});});
  card(1,"green",["Ask about them","at work"],(x,y)=>{D.disc(c,x+64,y+66,36,{fill:"white",col:"ink",w:3});D.icon(c,"speech",x+64,y+66,22,{fill:"green"});
    D.icon(c,"star",x+262,y+66,24,{fill:"amber"});D.icon(c,"rock",x+350,y+70,24,{fill:"ink"});});
  card(2,"blue",["Notice who","they turn to",["make room",{size:36,col:"mut"}]],(x,y)=>{D.disc(c,x+64,y+66,36,{fill:"white",col:"ink",w:3});D.icon(c,"eye",x+64,y+66,22,{fill:"blue"});
    D.face(c,"jun",x+330,y+92,24,{ring:"green"});for(const [k,fx,fy] of[["marta",x+222,y+56],["noor",x+430,y+56]]){D.face(c,k,fx,fy,16,{});D.arrow(c,[fx+(fx<x+330?24:-24),fy+10],[x+330+(fx<x+330?-40:40),y+86],{col:"green",w:3.5,head:11,bow:fx<x+330?-6:6});}});
  card(3,"amber",null,(x,y)=>{D.disc(c,x+64,y+66,36,{fill:"white",col:"ink",w:3});D.icon(c,"anchor",x+64,y+66,22,{fill:"amber"});});}
const pb_note3=(sc,w)=>[PK.sk.drawn(pb_page3,PB_PAGE),
  {k:"tick",x:484,y:450,r:20,col:"green",at:w("m1","sit down",-0.2),d:0.3},
  {k:"tick",x:970,y:450,r:20,col:"green",at:w("m2","Ask",-0.2),d:0.3},
  {k:"tick",x:484,y:744,r:20,col:"green",at:w("m3","Notice",-0.2),d:0.3},
  {s:"Say what won't",x:590,y:678,size:46,w:700,col:"blue",at:w("m4","say",-0.3),d:0.9},
  {s:"change yet",x:590,y:734,size:46,w:700,col:"blue",at:w("m4","change",-0.3),d:0.7}];

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
