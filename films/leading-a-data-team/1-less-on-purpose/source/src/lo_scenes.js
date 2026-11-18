/* ===== Less, on purpose: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are written by hand: the design principles at the Government Digital Service, Carmen Vidal's and Helena's boards, and Ivy's
   and Helena's notebooks (lo_uni.js). GOV.UK, 2010 to 2013, is in lop_gov.js. Every time comes from the voice: a line's start
   (sc.cues) or a word in it (wAt). */
const lo_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,1,"Less, on purpose",a);}};
function lo_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const lo_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const lo_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const lo_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const lo_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const lo_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const lo_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const lo_sp=(tt,i,spans,base,g)=>lo_alive(tt,{expr:lo_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const LO_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const LO_LAST="Keep what people use; stop the rest, together.";
// a screen's callout from the monitor at the desk by the window
const lo_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>lo_panel(cc,bx,by,bw,bh,head,rows,o.bars||null,hc));};
// the team's room with someone at the desk by the window (o.at, default Helena); o.face: their face; o.noor: Noor at Sam's desk
const lo_atRoom=(x,tt,t0,o)=>{o=o||{};return lo_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:o.at||"helena",marta:o.at===null?null:Object.assign({work:o.work==null?1:o.work,turn:0},o.face||lo_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
  samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},o.sam||lo_alive(tt,{},1,t0)),jun:o.jun===null?null:Object.assign({work:1},o.jun||lo_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people:o.people||[]});};
// Helena standing in the team's room, her notebook under her arm (fl, x: where)
const lo_helena=(tt,face,o)=>({fl:(o&&o.fl)||930,draw:cc=>{o=o||{};const J=PK.person(cc,"helena",o.x||1560,o.fl||930,lo_hT(o.fl||930),"clasp",Object.assign({t:tt+4,flip:o.flip!==false,underF:PK.inHand.notebook({}),holds:true},face));if(o.out)o.out.J=J;}});
// Helena on her phone in the team's room, a chat in a callout from it
const lo_phone=(x,tt,t0,t1,CH,face,o)=>{o=o||{};let Jh=null;const cs=PK.chatSize(x,CH,{size:28});
  lo_team(x,tt,{clock:o.clock==null?16:o.clock,marta:null,samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},lo_alive(tt,{},1,t0)),jun:Object.assign({work:1},lo_alive(tt,{},2,t0)),people:[{fl:930,draw:cc=>{
    Jh=PK.person(cc,"helena",1560,930,lo_hT(930),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone?PK.inHand.phone({back:true}):null,holds:true},face));}}]});
  if(Jh)PK.callout(x,o.bx==null?560:o.bx,o.by==null?160:o.by,cs.w,cs.h,[Jh.hdN[0]-20,Jh.hdN[1]-30],ag_io(tt,t0+0.3,t1,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));
  return Jh;};
// a desk in the story's rooms with a laptop on it; o.out.D: the desk, for a callout's tail
const lo_lap=(cc,who,x,fl,face,o)=>{o=o||{};return lop_desk(cc,who,x,fl,Object.assign({t:0,work:o.work==null?1:o.work,flip:!!o.flip,on:(c2,D)=>{if(o.piles)lop_piles(c2,D.x0+D.dir*D.w*0.62,D.top,3,o.piles);else lop_laptop(c2,D,o.flip);if(o.out)o.out.D=D;}},face));};
const lo_tip=D=>D?[D.x0+D.dir*0.45*D.w,D.top-70]:[960,600];

/* ---------------------------------------------------------------- 1. Do less */
scene("doless",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tN=c.need-0.4,tC=c.cost-0.4,tR=c.review-0.4,tG=c.gds-0.4,tP=c.rules-0.4,tL=c.launch-0.4,tA=c.award-0.4,tD=c.data-0.4;
  const BO=PK.pace(ctx,LOP_FOLK.gds1,lo_boardO(sc,w)),LE=PK.ROOMS.lecture;
  ag_shots(ctx,S,t,sc.dur,[
    // 2010: a government office in London, its desks under printed pages
    {at:0,place:"lopOffice",keys:[[0,960,540,1.0],[tN-0.2,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{
      lo_lap(x,"clerk1",900,900,Object.assign({t:tt},lo_alive(tt,{expr:"think",gaze:[1,0.5]},1,0)),{piles:2});
      lop_person(x,"clerk2",420,980,PK.poseMix("clasp",LO_SHOW,0.6),Object.assign({t:tt,hold:lo_sheet,holds:true},lo_alive(tt,{expr:"neutral",gaze:[1,0.3]},2,0)));}},
    // to renew a passport: which part of government, and which of its sites?
    {at:tN,place:"lopHome",dis:0.8,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const O={};let J=null;
      J=lo_lap(x,"resident",1000,940,Object.assign({t:tt},lo_sp(tt,1,[[c.same+0.3,E.same]],"worry",0.4)),{out:O});
      PK.callout(x,980,110,760,260,lo_tip(O.D),ag_io(tt,c.need+0.6,tC-0.3,0.4),(cc,bx,by,bw,bh)=>lo_panel(cc,bx,by,bw,bh,"Renew a passport",[["site one · Renewing your passport",PK.C.ink,32],["site two · Passport renewals",PK.C.ink,32],["the same advice, other words",PK.C.amber,32]],null,PK.C.orange));
      lo_bub(x,J,tt,w("same","sure",-0.6),tC-0.3,["Which page is right?"],cam,{lean:-160});}},
    // and taxpayers pay for all of them: one place, and simpler
    {at:tC,place:"lopOffice",dis:0.8,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jo=null;
      lo_lap(x,"clerk1",900,900,Object.assign({t:tt},lo_alive(tt,{expr:"listen",gaze:[1,0.2]},1,tC)),{piles:2});
      Jo=lop_person(x,"official",1480,960,PK.poseMix("clasp",LO_SHOW,ag_in(tt,c.cost,0.4)),Object.assign({t:tt,flip:true,hold:lo_sheet,holds:true},lo_sp(tt,2,[[c.change+0.2,E.change]],"think",0.2)));
      PK.callout(x,500,110,700,220,Jo?[Jo.hdN[0]-30,Jo.hdN[1]-60]:[1400,560],ag_io(tt,c.cost+0.4,c.change-0.3,0.4),(cc,bx,by,bw,bh)=>lo_panel(cc,bx,by,bw,bh,"The websites, a year",[["about £560 million",PK.C.amber,36]],null,PK.C.amber));
      lo_bub(x,Jo,tt,c.change+0.2,tR-0.3,["One place, and simpler."],cam,{lean:-160});}},
    // October 2010: the digital champion's report on Directgov
    {at:tR,place:"loLecture",cut:true,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jm=null;
      PK.seated(x,lop_row("clerk2"),620,950,PK.hAt(950,LE.eye),"sit",Object.assign({t:tt},lo_alive(tt,{expr:"listen",gaze:[1,0.1]},2,tR)));
      PK.seated(x,lop_row("official"),300,990,PK.hAt(990,LE.eye),"sit",Object.assign({t:tt},lo_alive(tt,{expr:"think",gaze:[1,0.1]},3,tR)));
      Jm=PK.person(x,lop_row("champion"),1300,930,PK.hAt(930,LE.eye),"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},lo_sp(tt,1,[[c.advice+0.2,E.advice],[c.archive+0.2,E.archive]],"smile",0.1)));
      lo_name(x,Jm,tt,w("review","Martha Lane Fox",0),c.advice-0.2,"Martha Lane Fox","Digital champion",170);
      lo_bub(x,Jm,tt,c.advice+0.2,c.archive-0.2,["One website, and one team","that answers for it."],cam,{lean:-180});
      lo_bub(x,Jm,tt,c.archive+0.2,tG-0.3,["Don't move the old pages.","Archive them."],cam,{lean:-180});}},
    // the Government Digital Service reads every page, and what people searched for
    {at:tG,place:"lopGDS",dis:0.8,keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const O={};let J3=null;
      J3=lop_person(x,"gds3",620,900,"clasp",Object.assign({t:tt,flip:true},lo_sp(tt,3,[[c.keep+0.2,E.keep]],"think",0.2)));
      lo_lap(x,"gds2",1180,960,Object.assign({t:tt},lo_alive(tt,{expr:"think",gaze:[1,0.6]},2,tG)),{out:O});
      PK.callout(x,980,90,760,250,lo_tip(O.D),ag_io(tt,w("read","reads",0),c.keep-0.3,0.4),(cc,bx,by,bw,bh)=>lo_panel(cc,bx,by,bw,bh,"Read, page by page",[["Directgov · Business Link",PK.C.orange,34],["what people searched for",PK.C.orange,34]],null,PK.C.orange));
      lo_bub(x,J3,tt,c.keep+0.2,tP-0.3,["Keep it only if","someone needs it."],cam,{lean:160});}},
    // 2012: the design principles, at the board
    {at:tP,place:"lopGDS",later:true,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      lop_person(x,"gds2",330,990,"clasp",Object.assign({t:tt},lo_alive(tt,{expr:"listen",gaze:[1,0.1]},2,tP)));
      PK.teach(x,LOP_FOLK.gds1,tt,BO,{x:LOP_BD.x,y:LOP_BD.y,k:LOP_BD.k,deco:true,floor:LOP_BD.floor,rest:LOP_BD.rest,h:lop_h(LOP_BD.floor),say:[],events:LO_HEV});}},
    // October 2012: GOV.UK, and the resident finds it, faster
    {at:tL,place:"lopHome",dis:0.8,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const O={};let J=null;
      J=lo_lap(x,"resident",1000,940,Object.assign({t:tt},lo_sp(tt,1,[[c.test+0.3,E.test]],"smile",0.4)),{out:O});
      PK.callout(x,980,110,760,220,lo_tip(O.D),ag_io(tt,c.launch+0.4,tA-0.3,0.4),(cc,bx,by,bw,bh)=>lo_panel(cc,bx,by,bw,bh,"One site",[["about 3,800 pieces",PK.C.green,34]],null,PK.C.blue));
      lo_bub(x,J,tt,w("test","faster",-0.2),tA-0.3,["Done. That was quick."],cam,{lean:-160});}},
    // spring 2013: the Design Museum's award
    {at:tA,place:"lopMuseum",dis:0.8,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      lop_person(x,"visitor",1420,880,"clasp",Object.assign({t:tt,flip:true},lo_alive(tt,{expr:"think",gaze:[1,0.4]},3,tA)));
      lop_person(x,"gds2",620,930,"clasp",Object.assign({t:tt},lo_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tA)));
      lop_person(x,"gds1",360,990,"clasp",Object.assign({t:tt},lo_alive(tt,{expr:"smile",gaze:[1,0.3]},1,tA)));}},
    // a data team's work piles up the same way
    {at:tD,place:"loTeam",dis:1.0,keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=lo_atRoom(x,tt,tD,{at:"helena",face:lo_alive(tt,{expr:"think",gaze:[1,0.3]},3,tD),noor:true});
      lo_screenCall(x,R,ag_io(tt,w("data","reports",-0.3),c.breath-0.3,0.4),"Our week",[["38 old reports",PK.C.orange,34],["8 hours of meetings each",PK.C.amber,34],["60 alerts a week",PK.C.amber,34]],PK.C.blue,{by:70,bh:270});}}
  ]);
  lo_card(ctx,S,t,0.4,tN-0.2,{kick:"Britain, 2010",title:"Government on the web"},{y:40,mid:true});
  lo_card(ctx,S,t,tR+0.3,w("review","Martha Lane Fox",-0.3),{kick:"October 2010",title:"A report on Directgov"},{y:40,mid:true});
  lo_card(ctx,S,t,tG+0.3,w("read","reads",-0.4),{kick:"2011",title:"The Government Digital Service"},{y:40,mid:true});
  lo_card(ctx,S,t,tL+0.3,c.launch+0.2,{kick:"October 2012",title:"GOV.UK"},{y:40,mid:true});
  lo_card(ctx,S,t,tA+0.3,tD-0.3,{kick:"Spring 2013",title:"Design of the Year"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"Less, on purpose","Keep what people use; stop the rest, together","Leading data people · Leading a data team",{side:"right",size:52});
});

/* ---------------------------------------------------------------- 2. Everything on one wall */
scene("wall",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tZ=c.series+2.2,tU=c.univ-0.4,tL=c.list-0.4,tS=c.study-0.4,tK=c.ask-0.4;
  const BA=PK.pace(ctx,"carmen",lo_boardA(sc,w)),BB=PK.pace(ctx,"helena",lo_boardB(sc,w)),N1=PK.pace(ctx,null,lo_note1(sc,w)),JW=Object.assign({work:1,pose:undefined},lo_alive(0,{},2,0));
  ag_shots(ctx,S,t,sc.dur,[
    // the series' four ideas (Carmen, at the team's board)
    {at:0,place:"loTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=lo_lesson(x,tt,{rows:BA,jun:Object.assign({work:1,pose:undefined},lo_alive(tt,{},2,0)),clock:9,events:LO_HEV});
      lo_name(x,R.at,tt,0.4,tZ-0.3,"Carmen Vidal","Consultant",160);}},
    {at:tZ,cut:true,place:"loBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.series,E.first]],events:LO_HEV});}},
    // at the university: Helena leads a team of eight
    {at:tU,place:"loTeam",dis:0.6,keys:[[tU,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Hh={};
      lo_atRoom(x,tt,tU,{at:"ivy",noor:true,people:[lo_helena(tt,lo_alive(tt,{expr:"smile",gaze:[1,0.1]},5,tU),{x:1560,fl:930,out:Hh})]});
      lo_name(x,Hh.J,tt,w("univ","Helena Novak",0),tL-0.3,"Helena Novak","Data manager",170);}},
    // Tuesday 4 May: everything on one wall (Helena writes; the team looks on)
    {at:tL,place:"loTeam",later:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=lo_lesson(x,tt,{rows:BB,who:"helena",jun:Object.assign({work:1,pose:undefined},lo_alive(tt,{},2,tL)),helena:lo_sp(tt,5,[[c.reason+0.2,E.reason]],"think",-0.2),sam:lo_alive(tt,{expr:"listen",gaze:[1,-0.25]},4,tL),clock:10,events:LO_HEV});
      lo_bub(x,R.helena,tt,c.reason+0.2,tS-0.3,["Each one came","from a request."],cam,{lean:-200});}},
    // we add, and rarely take away (Ivy's notebook)
    {at:tS,place:"loNotes",dis:0.6,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N1,{});}},
    // so Helena asks the team to choose, together
    {at:tK,place:"loTeam",dis:0.6,keys:[[tK,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Hh={};
      lo_atRoom(x,tt,tK,{at:"ivy",noor:true,people:[lo_helena(tt,lo_sp(tt,5,[[c.ask+0.3,E.ask]],"smile",0.1),{x:1560,fl:930,out:Hh})]});
      lo_bub(x,Hh.J,tt,c.ask+0.3,1e9,["What do we keep,","and what do we stop?"],cam,{lean:-160});}}
  ]);
  lo_card(ctx,S,t,tL+0.3,w("list","everything",-0.4),{kick:"Tuesday 4 May",title:"Everything on one wall"},{y:40,mid:true});
  lo_imagined(ctx,S,t,tU+0.4,w("univ","Helena Novak",-0.2),"The university, 2027 · imagined");
  lo_kick(ctx,S,ag_in(t,0.6,0.6)*(1-lo_apart(t,[[tU,w("univ","Helena Novak",0)],[tL,w("list","everything",0)],[tS,tK]])));
});

/* ---------------------------------------------------------------- 3. What each thing is for */
scene("use",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tA=c.agree-0.4,tZ=c.agree+2.2,tW=c.week-0.4,BC=PK.pace(ctx,"carmen",lo_boardC(sc,w)),N2=PK.pace(ctx,null,lo_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // who uses it, and for what? The warehouse's logs answer for the reports
    {at:0,place:"loTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Hh={};
      const R=lo_atRoom(x,tt,0,{at:"ivy",noor:true,people:[lo_helena(tt,lo_sp(tt,5,[[c.who+0.2,E.who]],"think",0.1),{x:1560,fl:930,out:Hh})]});
      lo_bub(x,Hh.J,tt,c.who+0.2,c.logs-0.2,["Who uses it,","and for what?"],cam,{lean:-160});
      lo_screenCall(x,R,ag_io(tt,c.logs+0.3,tA-0.3,0.4),"The logs · a year",[["21 reports · about 260 readers",PK.C.green,32],["17 reports · nobody",PK.C.amber,32]],PK.C.orange,{bh:230});}},
    // what each kind of thing is for (Carmen)
    {at:tA,place:"loTeam",later:true,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=lo_lesson(x,tt,{rows:BC,jun:Object.assign({work:1,pose:undefined},lo_alive(tt,{},2,tA)),clock:11,events:LO_HEV});}},
    {at:tZ,cut:true,place:"loBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.agree,E.report]],events:LO_HEV});}},
    // the week they want (Helena's notebook)
    {at:tW,place:"loNotes",dis:0.6,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N2,{});}}
  ]);
  lo_kick(ctx,S,ag_in(t,0.6,0.6)*(1-lo_apart(t,[[tW,1e9]])));
});

/* ---------------------------------------------------------------- 4. Stopped, openly */
scene("stop",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),LE=PK.ROOMS.lecture;
  const tW=c.write-0.4,tC=c.case-0.4,tO=c.off-0.4,tG=c.gov-0.4,tA=c.alerts-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 10 May: the morning's stand-up, fifteen minutes, everyone standing
    {at:0,place:"loTeam",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jh=null;
      lo_team(x,tt,{clock:9,sam:null,jun:null,marta:null,people:[
        {fl:850,draw:cc=>{PK.person(cc,"ivy",1440,850,lo_hT(850),"clasp",Object.assign({t:tt,flip:true},lo_alive(tt,{expr:"listen",gaze:[1,0.1]},3,0)));}},
        {fl:900,draw:cc=>{Jh=PK.person(cc,"helena",900,900,lo_hT(900),"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},lo_sp(tt,1,[[c.monday+0.3,c.monday+3.0]],"smile",0.1)));}},
        {fl:960,draw:cc=>{PK.person(cc,"noor",360,960,lo_hT(960),"clasp",Object.assign({t:tt},lo_alive(tt,{expr:"listen",gaze:[1,0.1]},4,0)));}},
        {fl:925,draw:cc=>{PK.person(cc,"sam",1220,925,lo_hT(925),"clasp",Object.assign({t:tt,flip:true},lo_alive(tt,{expr:"smile",gaze:[1,0.1]},2,0)));}},
        {fl:1000,draw:cc=>{PK.person(cc,"jun",640,1000,lo_hT(1000),"clasp",Object.assign({t:tt},lo_alive(tt,{expr:"listen",gaze:[1,0.1]},5,0)));}}]});}},
    // they write to each report's last readers first
    {at:tW,place:"loTeam",later:true,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=lo_atRoom(x,tt,tW,{at:"ivy",sam:null,face:lo_alive(tt,{expr:"think",gaze:[1,0.6]},3,tW)});const D=R&&R.marta&&R.marta.desk;
      const CH={title:"Room use, 2019",who:[PK.extra(5)],me:"ivy",msgs:[{who:"ivy",s:"We plan to stop this report. Do you still read it?",at:c.write+1.0,type:1.6},{who:PK.extra(5),s:"Only last year's figures, please.",at:c.reply+1.6,type:1.4}]},cs=PK.chatSize(x,CH,{size:28});
      PK.callout(x,720,110,cs.w,cs.h,D?[150,D.top-120]:[150,620],ag_io(tt,tW+0.4,tC-0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}},
    // Tuesday 25 May: the data council approves the plan
    {at:tC,place:"loLecture",dis:0.6,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jh=null;PK.audience(x,tt,6,{look:0.6});
      Jh=PK.person(x,"helena",1500,950,PK.hAt(950,LE.eye),"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},lo_sp(tt,1,[[c.case+0.3,E.case]],"think",0.1)));
      lo_bub(x,Jh,tt,w("case","approves",0),tO-0.3,["21 move to the platform.","17 don't."],cam,{lean:-180});}},
    // Monday 31 May: the 17 switched off, not deleted
    {at:tO,place:"loTeam",dis:0.6,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=lo_atRoom(x,tt,tO,{at:"jun",jun:null,sam:null,face:lo_alive(tt,{expr:"think",gaze:[1,0.6]},3,tO)});
      lo_screenCall(x,R,ag_io(tt,c.off+0.4,tG-0.3,0.4),"17 old reports",[["switched off, not deleted",PK.C.amber,34],[ag_in(tt,c.undo,0.4)>0.5?"back on within a day":"",PK.C.green,34]],PK.C.amber,{bh:240});}},
    // GOV.UK archived its old pages, where they could still be found
    {at:tG,place:"lopGDS",dis:0.8,keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const O={};
      lo_lap(x,"gds2",1180,960,Object.assign({t:tt},lo_alive(tt,{expr:"think",gaze:[1,0.6]},2,tG)),{out:O});
      lop_person(x,"gds3",620,900,"clasp",Object.assign({t:tt,flip:true},lo_alive(tt,{expr:"listen",gaze:[1,0.2]},3,tG)));
      PK.callout(x,980,90,760,220,lo_tip(O.D),ag_io(tt,c.gov+0.4,tA-0.3,0.4),(cc,bx,by,bw,bh)=>lo_panel(cc,bx,by,bw,bh,"The old pages",[["archived, still found",PK.C.green,34]],null,PK.C.blue));}},
    // Sam, with Noor and Jun, goes through the alerts: when this fires, what do we do?
    {at:tA,place:"loTeam",dis:0.6,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jn=null,Js=null;
      const R=lo_team(x,tt,{clock:15,marta:null,jun:null,sam:Object.assign({work:1},lo_sp(tt,1,[[w("alerts","asking",0),E.alerts]],"think",0.2)),people:[
        {fl:960,draw:cc=>{Jn=PK.person(cc,"noor",820,960,lo_hT(960),"clasp",Object.assign({t:tt},lo_sp(tt,2,[[c.nothing+0.2,E.nothing]],"think",0.2)));}},
        {fl:940,draw:cc=>{PK.person(cc,"jun",1560,940,lo_hT(940),"clasp",Object.assign({t:tt,flip:true},lo_alive(tt,{expr:"listen",gaze:[1,0.2]},3,tA)));}}]});
      Js=R.sam;lo_bub(x,Js,tt,w("alerts","asking",0),c.nothing-0.2,["When this fires,","what do we do?"],cam,{lean:-160});
      lo_bub(x,Jn,tt,c.nothing+0.2,c.twelve-0.2,["Nothing. A line in","Monday's summary."],cam,{lean:-160});
      PK.callout(x,40,110,600,240,[1150,590],ag_io(tt,c.twelve+0.4,1e9,0.4),(cc,bx,by,bw,bh)=>lo_panel(cc,bx,by,bw,bh,"Alerts to Sam",[["about 12 a week",PK.C.green,34],["each with what to do",PK.C.ink,34]],null,PK.C.blue));}}
  ]);
  lo_card(ctx,S,t,0.3,c.write-0.6,{kick:"From Monday 10 May",title:"Fifteen minutes, standing"},{y:40,mid:true});
  lo_card(ctx,S,t,tC+0.3,w("case","approves",-0.2),{kick:"Tuesday 25 May",title:"The data council"},{y:40,mid:true});
  lo_card(ctx,S,t,tO+0.3,c.off+0.2,{kick:"Monday 31 May",title:"Switched off"},{y:40,mid:true});
  lo_card(ctx,S,t,c.twelve-0.2,c.twelve+0.2,{kick:"Monday 7 June",title:"The alerts that matter"},{y:40,mid:true});
});

/* ---------------------------------------------------------------- 5. Less, but better */
scene("roots",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tZ=c.art+2.2,tN=c.never-0.4,tR=c.rams-0.4,BD=PK.pace(ctx,"carmen",lo_boardD(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"loTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{lo_lesson(x,tt,{rows:BD,jun:Object.assign({work:1,pose:undefined},lo_alive(tt,{},2,0)),clock:14,events:LO_HEV});}},
    {at:tZ,cut:true,place:"loBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BD,{say:[[c.art,E.lean]],events:LO_HEV});}},
    // but the team never calls anyone's work waste
    {at:tN,place:"loTeam",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Hh={};
      lo_atRoom(x,tt,tN,{at:"ivy",noor:true,people:[lo_helena(tt,lo_sp(tt,5,[[w("never","Every",0),E.never]],"think",0.1),{x:1560,fl:930,out:Hh})]});
      lo_bub(x,Hh.J,tt,w("never","Every",0),tR-0.3,["Every report once answered","someone's real question."],cam,{lean:-160});}},
    {at:tR,cut:true,place:"loBoard",keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BD,{say:[[c.rams,E.better]],events:LO_HEV});}}
  ]);
  lo_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 6. The time back */
scene("time",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tS=c.sam-0.4,tG=c.goes-0.4,tR=c.rule-0.4,N3=PK.pace(ctx,null,lo_note3(sc,w)),BE=PK.pace(ctx,"helena",lo_boardE(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"loNotes",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}},
    // every alert that reaches Sam now matters
    {at:tS,place:"loTeam",dis:0.6,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=lo_atRoom(x,tt,tS,{at:"sam",sam:null,noor:false,face:lo_alive(tt,{expr:"smile",gaze:[1,0.5]},1,tS)});
      lo_screenCall(x,R,ag_io(tt,c.sam+0.4,tG-0.3,0.4),"This week",[["12 alerts · each needs us",PK.C.green,34]],PK.C.blue,{bh:200});}},
    // the time goes to the 21 reports people read, rebuilt on the platform
    {at:tG,place:"loTeam",cut:true,keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=lo_atRoom(x,tt,tG,{at:"ivy",noor:true,face:lo_alive(tt,{expr:"think",gaze:[1,0.5]},3,tG)});
      lo_screenCall(x,R,ag_io(tt,c.goes+0.4,tR-0.3,0.4),"On the platform",[["21 reports, rebuilt",PK.C.green,34],["each with an owner",PK.C.ink,34]],PK.C.blue,{bh:240});}},
    // one rule to keep the time (Helena, at the team's board)
    {at:tR,place:"loTeam",later:true,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{lo_lesson(x,tt,{rows:BE,who:"helena",jun:Object.assign({work:1,pose:undefined},lo_alive(tt,{},2,tR)),clock:16,events:LO_HEV});}}
  ]);
  lo_card(ctx,S,t,0.3,c.june+1.4,{kick:"June",title:"What came back"},{y:40,mid:true});
  lo_kick(ctx,S,ag_in(t,0.6,0.6)*(1-lo_apart(t,[[0,tS]])));
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tH=c.helena-0.4,tN=c.list-0.1,tL=c.next-0.4,tE=c.breath+0.6,BM=PK.pace(ctx,"helena",lo_boardM(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // GOV.UK found what people needed, did less, and did it well
    {at:0,place:"lopHome",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{lo_lap(x,"resident",1000,940,Object.assign({t:tt},lo_alive(tt,{expr:"smile",gaze:[1,0.4]},1,0)));}},
    // Helena's team did the same
    {at:tH,place:"loTeam",dis:0.8,keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      lo_atRoom(x,tt,tH,{at:"ivy",noor:true,face:lo_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tH),people:[lo_helena(tt,lo_alive(tt,{expr:"smile",gaze:[1,0.1]},5,tH),{x:1560,fl:930})]});}},
    {at:tN,place:"loBoard",cut:true,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BM,{say:[],events:LO_HEV});}},
    // keep what people use; stop the rest, together
    {at:tL,place:"loTeam",cut:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      lo_atRoom(x,tt,tL,{at:"ivy",noor:true,face:lo_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tL),people:[lo_helena(tt,lo_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tL),{x:1560,fl:930})]});}}
  ]);
  lo_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6)));
  PK.end(ctx,S,t,tE,"Less, on purpose",LO_LAST,"Film 1 of 4","Leading a data team",{side:"right"});
});
ag_cutInto(["wall","use","stop","roots","time","monday"]);
