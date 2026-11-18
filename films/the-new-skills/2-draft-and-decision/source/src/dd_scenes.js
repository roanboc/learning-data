/* ===== The draft and the decision: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are explained at a board, by Carmen Vidal, a consultant, or by Ivy; what to keep is a page of Ivy's or Helena's notebook
   (dd_uni.js). The chess is in ddc_chess.js. Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt). */
const dd_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,2,"The draft and the decision",a);}};
function dd_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const dd_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const dd_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const dd_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const dd_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const dd_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const dd_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const dd_sp=(tt,i,spans,base,g)=>dd_alive(tt,{expr:dd_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const dd_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=o.flip!=null?o.flip:x1<x0;if(tt<t0)return null;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip:x1<x0},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{},o.hold?{hold:o.hold,holds:true}:{}));};
const dd_static=rows=>rows.map(r=>{const q=Object.assign({},r);delete q.at;delete q.d;return q;});
const DD_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const DD_LAST="Let the agent draft; you frame, check and decide.";
const DD_V=PK.C.violet;
// a screen's callout from Ivy's monitor (Marta's desk by the window, where Ivy works this month)
const dd_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>dd_panel(cc,bx,by,bw,bh,head,rows,null,hc));};
// the team's room with Ivy at the desk by the window, at her screen; o: Jun's and Sam's moments, o.people, o.ivy (her face)
const dd_ivyRoom=(x,tt,t0,o)=>{o=o||{};return dd_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:"ivy",marta:Object.assign({work:o.work==null?1:o.work,turn:0},o.ivy||dd_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
  sam:o.sam===null?null:Object.assign({work:1},dd_alive(tt,{},1,t0)),jun:o.jun===null?null:Object.assign({work:1},o.junF||dd_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people:o.people||[]});};

/* ---------------------------------------------------------------- 1. Two amateurs, three computers */
scene("chess",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tF=c.fear-0.4,tL=c.leon-0.4,tO=c.free-0.4,tX=w("entrants","supercomputer",-0.5),tW=c.winners-0.4,tK=c.lesson-0.4,tC=c.counts-0.4,tD=c.data-0.4;
  const fan=(i,base,t0)=>dd_alive(base==null?0:0,base||{},i,t0);
  ag_shots(ctx,S,t,sc.dur,[
    // New York, May 1997: the world champion across the board from the operator who makes the computer's moves
    {at:0,place:"ddcHall",keys:[[0,960,560,1.0],[c.loses,960,580,1.08]],d:3,draw:(x,tt,cam)=>{let Jk=null,Jr=null;
      const R=ddc_match(x,tt,"kasp","oper",960,{left:Object.assign({},PK.face(tt,{expr:PK.exprMix("think","worry",ag_in(tt,w("loses","wins",0),1.0)),gaze:[1,0.5]},[[c.when+4,"look",2.4,[1,0.2]],[c.loses+2,"nod"]])),
        right:Object.assign({screen:"monitor",sx:1215,sw:150,sh:110,show:ddc_screen,work:0.6},PK.face(tt,{expr:"neutral",gaze:[1,0.4]},[[c.when+3,"look",2,[1,0.1]],[c.loses+1.4,"nod"]]))});Jk=R.l;
      Jr=ddc_person(x,PK.extra(6),1700,990,"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},dd_sp(tt,6,[[c.loses+0.3,E.loses]],"glad",0.1)));
      ddc_person(x,PK.extra(13),230,1000,"clasp",Object.assign({t:tt},dd_alive(tt,{expr:"listen",gaze:[1,0.2]},2,0)));
      dd_name(x,Jk,tt,w("when","Garry Kasparov",0),c.loses-0.5,"Garry Kasparov","World champion",160);
      dd_bub(x,Jr,tt,c.loses+0.3,E.loses+0.6,["The machine has won!"],cam,{lean:-160});}},
    // a chess club: what is a player's skill worth now?
    {at:tF,place:"ddcClub",dis:0.8,keys:[[tF,960,560,1.0],[c.worth,1000,580,1.06]],d:3,draw:(x,tt,cam)=>{let Jb=null,Ja=null;
      const A=ddc_match(x,tt,PK.extra(7),PK.extra(11),560,{fl:860,gap:250,left:dd_alive(tt,{expr:"think",gaze:[1,0.5]},1,tF),right:dd_sp(tt,2,[[c.change+0.2,E.change]],"worry",0.3)});Ja=A.r;
      const B=ddc_match(x,tt,PK.extra(3),PK.extra(14),1340,{fl:990,gap:300,left:dd_sp(tt,3,[[c.worth+0.2,E.worth]],"worry",0.2),right:dd_alive(tt,{expr:"worry",gaze:[1,0.4]},4,tF)});Jb=B.l;
      dd_bub(x,Jb,tt,c.worth+0.2,c.change-0.3,["If it plays better than the best,","what is our skill worth?"],cam,{lean:-200});
      dd_bub(x,Ja,tt,c.change+0.2,tL-0.2,["We'll find what it's for."],cam,{lean:160});}},
    // León, 1998: each player with a computer at hand, beside the board
    {at:tL,place:"ddcLeon",dis:0.8,keys:[[tL,960,560,1.0],[c.plan,900,580,1.1]],d:3,draw:(x,tt,cam)=>{
      const R=ddc_match(x,tt,"kasp","topa",960,{left:Object.assign({screen:"laptop",work:ag_in(tt,w("plan","checking",-0.3),0.6)*(1-ag_in(tt,w("plan","plan",-0.4),0.5))},PK.face(tt,{expr:PK.exprMix("think","smile",ag_in(tt,w("plan","plan",0),0.8)),gaze:[1,0.5]},[[c.each+2,"look",2.2,[1,0.1]]])),
        right:Object.assign({screen:"laptop",work:0.4},dd_alive(tt,{expr:"think",gaze:[1,0.5]},5,tL))});
      dd_name(x,R.r,tt,w("each","Veselin Topalov",0),c.plan-0.5,"Veselin Topalov","",160);}},
    // 2005, online: a team of grandmasters, each with a computer
    {at:tO,place:"ddcLeon",dis:0.8,keys:[[tO,960,560,1.0]],d:2,draw:(x,tt,cam)=>{
      const h=ddc_h(900);ddc_desk(x,"gm1",640,900,h,Object.assign({t:tt,screen:"monitor",show:ddc_screen,w:0.7*h},dd_alive(tt,{expr:"think",gaze:[1,0.4]},1,tO)));
      const h2=ddc_h(980);ddc_desk(x,"gm2",1100,980,h2,Object.assign({t:tt+1,screen:"monitor",show:ddc_screen,w:0.7*h2},dd_alive(tt,{expr:"think",gaze:[1,0.4]},3,tO)));}},
    // a supercomputer, alone
    {at:tX,place:"ddcRack",dis:0.8,keys:[[tX,960,540,1.0],[tW,1000,520,1.06]],d:3,draw:(x,tt,cam)=>{ddc_lights(x,tt);}},
    // the winners: two amateurs, three computers, at one desk at night
    {at:tW,place:"ddcHome",dis:0.8,keys:[[tW,960,560,1.0],[c.how+1,1000,580,1.08]],d:3,draw:(x,tt,cam)=>{let J1=null,J2=null;
      const h=ddc_h(900);J1=ddc_desk(x,"am1",760,900,h,Object.assign({t:tt,screen:"monitor",sx:1020,show:ddc_screen,w:0.95*h,work:1,
        on:(cc,D)=>{PK.monitor(cc,1180,D.top,0.3*h,0.22*h,{draw:ddc_screen});PK.monitor(cc,1330,D.top,0.3*h,0.22*h,{draw:ddc_screen});}},
        dd_sp(tt,1,[[w("deeper","deeper",-0.4),E.deeper]],"think",0.4)));
      const h2=ddc_h(990);J2=PK.seated(x,ddc_row("am2"),600,990,h2,"sit",Object.assign({t:tt+2},dd_sp(tt,2,[[w("how","worth a look",-0.5),E.how],[c.final+0.4,c.final+1.6]],"smile",0.3)));
      dd_bub(x,J2,tt,w("how","worth a look",-0.5),E.how+0.4,["This one's worth a look."],cam,{lean:-120});
      dd_bub(x,J1,tt,w("deeper","deeper",-0.4),E.deeper+0.3,["Let's send it deeper."],cam,{lean:160});
      dd_bub(x,J2,tt,c.final+0.4,tK-0.3,["First prize!"],cam,{lean:-120});}},
    // Kasparov writes the lesson down
    {at:tK,place:"ddcClub",dis:0.8,keys:[[tK,960,560,1.0],[c.worse,900,580,1.08]],d:3,draw:(x,tt,cam)=>{
      const h=ddc_h(940),J=ddc_desk(x,"kasp",760,940,h,Object.assign({t:tt,screen:null,pose:"sit",workPose:"sitWork",work:1,hold:PK.inHand.pen("blue"),holds:true,
        on:(cc,D)=>{PK.S.begin(cc,{lw:2.4,sh:3});PK.sheet(cc,D.cx-40,D.top-8,120,12,{});}},PK.face(tt,{expr:"think",gaze:[1,0.8]},[[c.worse+0.4,"look",2.4,[1,0.1]]])));
      dd_bub(x,J,tt,c.lesson+0.4,c.worse-0.2,["Weak players, a machine and a better process","beat a strong computer alone."],cam,{lean:220});
      dd_bub(x,J,tt,c.worse+0.1,tC-0.2,["They beat strong players","whose process was worse."],cam,{lean:220});}},
    // the players' skill still counted: how they worked with the machines counted most
    {at:tC,place:"ddcHome",dis:0.8,keys:[[tC,1000,580,1.08]],d:2,draw:(x,tt,cam)=>{
      const h=ddc_h(900);ddc_desk(x,"am1",760,900,h,Object.assign({t:tt,screen:"monitor",sx:1020,show:ddc_screen,w:0.95*h,work:1,
        on:(cc,D)=>{PK.monitor(cc,1180,D.top,0.3*h,0.22*h,{draw:ddc_screen});PK.monitor(cc,1330,D.top,0.3*h,0.22*h,{draw:ddc_screen});}},dd_alive(tt,{expr:"think",gaze:[1,0.4]},1,tC)));
      PK.seated(x,ddc_row("am2"),600,990,ddc_h(990),"sit",Object.assign({t:tt+2},dd_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tC)));}},
    // data work has its machine now too: Ivy at her screen, the agent's draft on it
    {at:tD,place:"ddTeam",dis:1.0,keys:[[tD,960,540,1.0],[c.left,760,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=dd_ivyRoom(x,tt,tD,{ivy:dd_alive(tt,{expr:"think",gaze:[1,0.3]},3,tD)});
      dd_screenCall(x,R,ag_io(tt,w("data","agent",-0.2),c.cheap+0.4,0.4),"The agent · a first draft",[["A model, in a minute",PK.C.ink,36]],DD_V);}}
  ]);
  dd_card(ctx,S,t,c.when+0.3,c.loses-0.6,{kick:"New York, May 1997",title:"A six-game match"},{y:40,mid:true});
  dd_card(ctx,S,t,c.leon+0.3,c.each-0.3,{kick:"León, Spain, 1998",title:"With the machine, not against it"},{y:40,mid:true});
  dd_card(ctx,S,t,c.free+0.3,tX-0.3,{kick:"Online, 2005",title:"Anyone can enter, in teams"},{y:40,mid:true});
  dd_card(ctx,S,t,c.winners+0.3,c.how-0.3,{kick:"The winners, 2005",title:"Two amateurs, three computers"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"The draft and the decision","A draft is cheap; judgement isn't","Leading data people · The new skills",{side:"right",size:64});
});

/* ---------------------------------------------------------------- 2. A draft in a minute */
scene("draft",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tI=c.ivy-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // the question the team has taken up: Graham Ellis, on the campus with Helena, by the teaching building
    {at:0,place:"ddCampus",keys:[[0,960,540,1.0],[c.q,1000,560,1.06]],d:3,draw:(x,tt,cam)=>{let Jg=null;
      PK.person(x,"helena",780,960,dd_hC(960),"clasp",Object.assign({t:tt},dd_alive(tt,{expr:"listen",gaze:[1,0.1]},4,0)));
      Jg=PK.person(x,"graham",1120,CA.near,dd_hC(CA.near),"clasp",Object.assign({t:tt,flip:true},dd_sp(tt,1,[[c.q+0.2,E.q]],"think",0.1)));
      dd_name(x,Jg,tt,w("uni","Graham Ellis",0),c.building+1.5,"Graham Ellis","Director of Facilities",170);
      dd_bub(x,Jg,tt,c.q+0.2,tI-0.3,["Too few rooms,","or too few at some hours?"],cam,{lean:-160});}},
    // Wednesday 7 April: Ivy, in her sixth week, asks the team's agent for a first draft; a minute later, it's there
    {at:tI,place:"ddTeam",cut:true,keys:[[tI,960,540,1.0],[c.ask,700,560,1.12]],d:3,draw:(x,tt,cam)=>{
      const R=dd_ivyRoom(x,tt,tI,{ivy:PK.face(tt,{expr:PK.exprMix("think","smile",ag_in(tt,c.tidy,0.6)*(1-ag_in(tt,c.almost,0.6))),gaze:[1,0.3]},[[c.figure+1,"nod"],[c.sure+0.4,"look",2,[1,0.1]]])});
      dd_screenCall(x,R,ag_io(tt,w("ask","asks",-0.2),c.minute-0.2,0.35),"Ivy, to the agent",[["A first draft: room use",PK.C.ink,36],["every room, every teaching hour",PK.C.ink,32]],PK.C.blue);
      dd_screenCall(x,R,ag_io(tt,c.minute+0.1,c.figure-0.2,0.35),"The agent · draft",[["the model, every column described",PK.C.ink,32],["4 tests: all pass",PK.C.green,36]],DD_V);
      dd_screenCall(x,R,ag_io(tt,c.figure+0.1,c.almost+1.4,0.35),"The agent · answer",[["Rooms used 38% of the week",PK.C.orange,36],["93% at the busiest hours",PK.C.orange,36]],DD_V);
      dd_screenCall(x,R,ag_in(tt,w("almost","notes",-0.4),0.35),"The agent · notes",[["What I assumed …",PK.C.ink,36]],DD_V);}}
  ]);
  dd_imagined(ctx,S,t,0.4,c.building+0.6,"The university, 2027 · imagined");
  dd_card(ctx,S,t,c.ivy+0.2,w("ivy","Ivy Reyes",-0.2),{kick:"Wednesday 7 April 2027",title:"Ivy's sixth week"},{y:40,mid:true});
  dd_kick(ctx,S,ag_in(t,0.6,0.6)*(1-dd_apart(t,[[0,c.building+1.5],[c.q,tI],[c.ivy,1e9]])));
});

/* ---------------------------------------------------------------- 3. What it assumed */
scene("assumed",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CO=PK.ROOMS.corner;
  const tG=c.graham-0.4,tT=c.tests-0.4,tB=w("tests","no room",-1.0),tS=c.sensors-0.4,tN=c.harm-0.4,LE=PK.ROOMS.lecture,hL=fl=>PK.hAt(fl,LE.eye);
  const BA=PK.pace(ctx,"carmen",dd_boardA(sc,w)),N1=PK.pace(ctx,null,dd_note1(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // at the end of its notes, the agent lists what it assumed; one line stops her
    {at:0,place:"ddTeam",later:true,keys:[[0,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=dd_ivyRoom(x,tt,0,{ivy:PK.face(tt,{expr:PK.exprMix("think","worry",ag_in(tt,w("line","booked",-0.2),0.6)),gaze:[1,0.3]},[[c.line+3,"look",2,[1,0.1]]])});
      dd_screenCall(x,R,1-ag_in(tt,tG-0.6,0.4),"The agent · what I assumed",[["Teaching hours: 8 to 6",PK.C.ink,32],["A booked hour counts as used",PK.C.amber,36]],DD_V);}},
    // in February, Graham had said what used means
    {at:tG,place:"ddCorner",cut:true,keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=dd_corner(x,tt,{t0:tG,who2:"graham",he:"listen",hg:[1,0.3],hf:dd_alive(tt,{expr:"listen",gaze:[1,0.3]},1,tG),iface:dd_sp(tt,2,[[w("graham","people in the room",-0.6),E.graham]],"talk",0.3)});
      dd_bub(x,R.who2,tt,w("graham","people in the room",-0.6),tT-0.3,["Used means people in the room,","not a booking."],cam,{lean:-140});}},
    // the tests check the form of the data; no test can know what Graham means (Carmen, at the board)
    {at:tT,place:"ddTeam",cut:true,keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{dd_lesson(x,tt,{rows:BA,clock:11,events:DD_HEV});}},
    {at:tB,cut:true,place:"ddBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.tests,E.tests],[c.meaning,E.meaning]],events:DD_HEV});}},
    // so Ivy checks the draft against the sensors, with Sam, in a teaching room
    {at:tS,place:"ddLecture",dis:0.6,keys:[[tS,960,540,1.0],[c.fifth,760,520,1.1]],d:3,draw:(x,tt,cam)=>{
      dd_room(x,tt,{plate:1,people:[
        {fl:900,draw:cc=>{PK.person(cc,"sam",360,900,hL(900),"clasp",Object.assign({t:tt},dd_alive(tt,{expr:"listen",gaze:[1,0.2]},1,tS)));}},
        {fl:960,draw:cc=>{PK.person(cc,"ivy",1000,960,hL(960),"clasp",Object.assign({t:tt,flip:true,hold:PK.inHand.notebook({}),holds:true},PK.face(tt,{expr:PK.exprMix("think","worry",ag_in(tt,c.fifth,0.6)),gaze:[1,0.1]},[[w("sensors","sensors",0.2),"look",2.6,[1,-0.9]],[c.fifth+3,"nod"]])));}}]});
      PK.callout(x,980,70,560,250,[LE.sensor[0]+30,LE.sensor[1]+10],ag_io(tt,w("fifth","one booked hour",-0.3),tN-0.3,0.4),(cc,bx,by,bw,bh)=>dd_panel(cc,bx,by,bw,bh,"Booked hours",[["1 in 5: nobody counted",PK.C.amber,40],["the draft calls them used"]]));}},
    {at:tN,place:"ddNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N1,{});}}
  ]);
  dd_card(ctx,S,t,tG+0.3,w("graham","people in the room",-1.0),{kick:"In February",title:"What used means"},{y:40,mid:true});
  dd_kick(ctx,S,ag_in(t,0.6,0.6)*(1-dd_apart(t,[[0,1e9]])));
});

/* ---------------------------------------------------------------- 4. Frame it, then ask */
scene("frame",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tO=c.owner-0.4,tH=c.three-0.4,tB=c.decision-0.6,tD=c.draft-0.4,tN=w("hand","by hand",-1.4);
  const BB=PK.pace(ctx,"ivy",dd_boardB(sc,w)),N2=PK.pace(ctx,null,dd_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // first, the word: Ivy writes room use into the glossary
    {at:0,place:"ddTeam",keys:[[0,960,540,1.0],[c.word,700,560,1.12]],d:3,draw:(x,tt,cam)=>{
      const R=dd_ivyRoom(x,tt,0,{ivy:dd_alive(tt,{expr:"think",gaze:[1,0.3]},3,0)});
      dd_screenCall(x,R,ag_io(tt,w("word","glossary",-0.3),tO-0.3,0.4),"Glossary · room use",[["The share of teaching hours",PK.C.ink,34],["in which the sensors counted",PK.C.ink,34],["at least one person",PK.C.blue,36]],PK.C.blue,{bh:300});}},
    // Graham approves it there, as its owner
    {at:tO,place:"ddCampus",cut:true,keys:[[tO,900,570,1.1]],d:2,draw:(x,tt,cam)=>{
      const CH={title:"Ivy Reyes",who:["ivy"],me:"graham",msgs:[{who:"ivy",s:"Room use, for your approval?",at:-10},{who:"graham",s:"Approved, as its owner.",at:w("owner","approves",0),type:1.2}]},cs=PK.chatSize(x,CH,{size:28});
      const Jg=PK.person(x,"graham",1060,CA.near,dd_hC(CA.near),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone({back:true}),holds:true},PK.face(tt,{expr:"think",gaze:[1,0.9]},[[w("owner","approves",0.6),"smile",2.0]])));
      PK.callout(x,240,180,cs.w,cs.h,[Jg.hdN[0]-20,Jg.hdN[1]-30],ag_in(tt,tO+0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}},
    // then she asks again, with three things, not one: she writes them at the team's board
    {at:tH,place:"ddTeam",cut:true,keys:[[tH,960,540,1.0],[tB,1000,520,1.06]],d:3,draw:(x,tt,cam)=>{
      dd_team(x,tt,{clock:14,sam:null,jun:Object.assign({work:0,pose:"sit"},dd_alive(tt,{expr:"listen",gaze:[1,-0.2]},2,tH)),
        marta:Object.assign({turn:1,work:0,pose:"sit"},dd_alive(tt,{expr:"listen",gaze:[1,-0.2]},3,tH)),people:[
        {fl:DD_RB.floor,draw:cc=>{dd_roomBoard(cc,tt,BB,"ivy",{events:DD_HEV});}},
        {fl:DD_SAMC.floor,draw:cc=>{PK.seated(cc,"sam",DD_SAMC.x,DD_SAMC.floor,dd_hT(DD_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},dd_alive(tt,{expr:"listen",gaze:[1,-0.2]},4,tH)));}}]});}},
    {at:tB,cut:true,place:"ddBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"ivy",tt,BB,{say:[],events:DD_HEV});}},
    // the new draft keeps the two apart, and says again what it assumed
    {at:tD,place:"ddTeam",cut:true,keys:[[tD,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=dd_ivyRoom(x,tt,tD,{ivy:dd_alive(tt,{expr:"think",gaze:[1,0.3]},3,tD)});
      dd_screenCall(x,R,ag_in(tt,tD+0.3,0.4),"The agent · new draft",[["booked and used, side by side",PK.C.orange,34],["What I assumed …",PK.C.ink,32]],DD_V);}},
    // she checks it against one room's week, worked out by hand
    {at:tN,place:"ddNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N2,{});}}
  ]);
  dd_kick(ctx,S,ag_in(t,0.6,0.6)*(1-dd_apart(t,[[w("word","glossary",-0.3),tH],[tD,1e9]])));
});

/* ---------------------------------------------------------------- 5. Someone else approves */
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tR=c.reason-0.4,tJ=c.jun-0.4,tU=c.standup-0.4,N3=PK.pace(ctx,null,dd_note3(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Ivy opens a pull request: she's its author, so she answers for it
    {at:0,place:"ddTeam",keys:[[0,960,540,1.0],[c.pr+1,700,560,1.12]],d:3,draw:(x,tt,cam)=>{
      const R=dd_ivyRoom(x,tt,0,{ivy:dd_alive(tt,{expr:"think",gaze:[1,0.3]},3,0)});
      dd_screenCall(x,R,ag_io(tt,w("pr","pull request",-0.2),tR-0.3,0.4),"Pull request · room use",[["Author: Ivy Reyes",PK.C.ink,36],["She answers for it",PK.C.blue,34]],PK.C.green);}},
    {at:tR,place:"ddNotes",dis:0.6,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N3,{});}},
    // Jun reviews it; he asks which room she checked by hand; he approves it, and it's merged
    {at:tJ,place:"ddTeam",dis:0.6,keys:[[tJ,1250,560,1.12]],d:2,draw:(x,tt,cam)=>{let Ji=null;
      const R=dd_team(x,tt,{clock:15,marta:null,sam:null,
        jun:Object.assign({work:PK.u.clamp(1-ag_in(tt,c.asks-0.6,0.5)+ag_in(tt,c.merge,0.5),0,1)},dd_sp(tt,2,[[c.asks,w("asks","The answer",-0.3)]],"listen",0.2)),people:[
        {fl:930,draw:cc=>{Ji=dd_come(cc,"ivy",tt,850,1100,tJ+0.2,tJ+2.6,930,dd_hT(930),{then:"clasp",flip:false,face:dd_sp(tt,4,[[w("asks","The answer",-0.2),c.merge-0.3]],"listen",0.1)});}}]});
      const D=R.jun&&R.jun.desk,J=R.jun;
      dd_bub(x,J,tt,c.asks,w("asks","The answer",-0.3),["Which room did you check by hand?"],cam,{lean:-40,rise:60});
      dd_bub(x,Ji,tt,w("asks","The answer",-0.2),c.merge-0.3,["B-204. It's in the pull request."],cam,{lean:-200});
      PK.callout(x,1250,100,600,270,[D?D.cx:1690,690],ag_io(tt,c.merge,tU-0.3,0.4),(cc,bx,by,bw,bh)=>dd_panel(cc,bx,by,bw,bh,"Pull request · room use",[["Approved by Jun",PK.C.green,36],["Merged",PK.C.green,36],["Graham told what it changes",PK.C.ink,32]],null,PK.C.green));}},
    // next morning, at stand-up: Ivy says what she nearly missed, and Helena thanks her for saying it
    {at:tU,place:"ddTeam",later:true,keys:[[tU,1250,560,1.12],[tU+1.6,960,540,1.0]],d:3,draw:(x,tt,cam)=>{let Ji=null,Jh=null;
      dd_team(x,tt,{clock:9,sam:null,jun:null,marta:null,people:[
        {fl:925,draw:cc=>{PK.person(cc,"jun",1330,925,dd_hT(925),"clasp",Object.assign({t:tt,flip:true},dd_alive(tt,{expr:"listen",gaze:[1,0.1]},2,tU)));}},
        {fl:970,draw:cc=>{Ji=PK.person(cc,"ivy",1080,970,dd_hT(970),"clasp",Object.assign({t:tt,flip:true},dd_sp(tt,3,[[w("standup","says",-0.2),E.standup]],"think",0.1)));}},
        {fl:1012,draw:cc=>{Jh=PK.person(cc,"helena",760,1012,dd_hT(1012),"clasp",Object.assign({t:tt},dd_sp(tt,4,[[c.thanks+0.2,c.thanks+1.6]],"smile",0.1)));}},
        {fl:1058,draw:cc=>{PK.person(cc,"sam",1600,1058,dd_hT(1058),"clasp",Object.assign({t:tt,flip:true},dd_alive(tt,{expr:"listen",gaze:[1,0.1]},1,tU)));}},
        {fl:880,draw:cc=>{PK.person(cc,"marta",520,880,dd_hT(880),"clasp",Object.assign({t:tt},dd_alive(tt,{expr:"listen",gaze:[1,0.1]},5,tU)));}}]});
      dd_bub(x,Ji,tt,w("standup","says",-0.2),c.thanks-0.2,["I asked for the task,","not the decision or the words."],cam,{lean:-160});
      dd_bub(x,Jh,tt,c.thanks+0.2,1e9,["Thank you for saying it."],cam,{lean:160});}}
  ]);
  dd_card(ctx,S,t,tU+0.3,w("standup","says",-0.6),{kick:"Next morning",title:"Stand-up"},{y:40,mid:true});
  dd_kick(ctx,S,ag_in(t,0.6,0.6)*(1-dd_apart(t,[[w("pr","pull request",-0.2),tR],[tJ,1e9]])));
});

/* ---------------------------------------------------------------- 6. The skills that grow */
scene("grows",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tB=c.before-0.6,tW=c.wef-0.4,tN=c.cant-0.4,tF=c.films-0.4;
  const BC=PK.pace(ctx,"carmen",dd_boardC(sc,w)),BD=PK.pace(ctx,"carmen",dd_boardD(sc,w)),N4=PK.pace(ctx,null,dd_note4(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // when an agent drafts, the work moves to either side of the draft (Carmen, at the board)
    {at:0,place:"ddTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{dd_lesson(x,tt,{rows:BC,clock:10,events:DD_HEV,marta:null});}},
    {at:tB,cut:true,place:"ddBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.moves,E.moves],[c.before,E.after]],events:DD_HEV});}},
    // employers see it too
    {at:tW,place:"ddBoard",later:true,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BD,{say:[[c.wef,E.rising]],events:DD_HEV});}},
    // an agent can draft; it can't take the decision, or the responsibility (Helena's notebook)
    {at:tN,place:"ddNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}},
    // films of their own
    {at:tF,place:"ddTeam",dis:0.6,keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{dd_ivyRoom(x,tt,tF,{});}}
  ]);
  dd_card(ctx,S,t,c.films+0.2,E.films+0.6,{kick:"Films of their own",title:"What an agent is",sub:"Agents at work on data"},{y:40,mid:true});
  dd_kick(ctx,S,ag_in(t,0.6,0.6)*(1-dd_apart(t,[[tB,tN],[tF,1e9]])));
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tI=c.ivy-0.4,tN=c.one-0.4,tL=c.last-0.4,tE=c.breath+0.6,N5=PK.pace(ctx,null,dd_note5(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // 2005: two amateurs finished ahead of grandmasters and a supercomputer
    {at:0,place:"ddcHome",keys:[[0,960,560,1.0],[tI-0.2,1000,580,1.06]],d:3,draw:(x,tt,cam)=>{
      const h=ddc_h(900);ddc_desk(x,"am1",760,900,h,Object.assign({t:tt,screen:"monitor",sx:1020,show:ddc_screen,w:0.95*h,work:1,
        on:(cc,D)=>{PK.monitor(cc,1180,D.top,0.3*h,0.22*h,{draw:ddc_screen});PK.monitor(cc,1330,D.top,0.3*h,0.22*h,{draw:ddc_screen});}},dd_alive(tt,{expr:"think",gaze:[1,0.4]},1,0)));
      PK.seated(x,ddc_row("am2"),600,990,ddc_h(990),"sit",Object.assign({t:tt+2},dd_alive(tt,{expr:"smile",gaze:[1,0.3]},2,0)));}},
    // Ivy did the same with data, and Graham's answer counts people in the rooms
    {at:tI,place:"ddTeam",dis:1.0,keys:[[tI,960,540,1.0],[c.rooms,760,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=dd_ivyRoom(x,tt,tI,{ivy:dd_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tI)});
      dd_screenCall(x,R,ag_io(tt,c.rooms,tN-0.3,0.4),"Graham's answer",[["counts people in the rooms",PK.C.blue,36],["not bookings",PK.C.ink,34]],PK.C.blue);}},
    {at:tN,place:"ddNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N5,{});}},
    // let the agent draft; you frame, check and decide
    {at:tL,place:"ddTeam",dis:0.6,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      dd_ivyRoom(x,tt,tL,{people:[{fl:990,draw:cc=>{PK.person(cc,"helena",900,990,dd_hT(990),"clasp",Object.assign({t:tt},dd_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tL)));}}]});}}
  ]);
  dd_card(ctx,S,t,0.3,tI-0.4,{kick:"Online, 2005",title:"Ahead of grandmasters and a supercomputer"},{y:40,mid:true});
  dd_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-dd_apart(t,[[0,tI],[c.rooms,tN]])));
  PK.end(ctx,S,t,tE,"The draft and the decision",DD_LAST,"Film 2 of 3","The new skills",{side:"right"});
});
ag_cutInto(["assumed","grows"]);
