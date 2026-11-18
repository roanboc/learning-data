/* ===== Rules that let people decide: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are written by hand: Yusuf's, Carmen Vidal's and Helena's boards, and a farmer's and Helena's notebooks (rd_uni.js). Bali in
   the 1970s and 1980s is in rdp_bali.js. Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt). */
const rd_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,4,"Rules that let people decide",a);}};
function rd_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const rd_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const rd_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const rd_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const rd_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const rd_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const rd_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const rd_sp=(tt,i,spans,base,g)=>rd_alive(tt,{expr:rd_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const RD_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const RD_LAST="A few clear rules, good tools, and trust.";
// a screen's callout from the monitor at the desk by the window
const rd_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>rd_panel(cc,bx,by,bw,bh,head,rows,o.bars||null,hc));};
// the team's room with someone at the desk by the window (o.at, default Helena); o.face: their face; o.noor: Noor at Sam's desk
const rd_atRoom=(x,tt,t0,o)=>{o=o||{};return rd_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:o.at||"helena",marta:o.at===null?null:Object.assign({work:o.work==null?1:o.work,turn:0},o.face||rd_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
  samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},o.sam||rd_alive(tt,{},1,t0)),jun:o.jun===null?null:Object.assign({work:1},o.jun||rd_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people:o.people||[]});};
// Helena standing in the team's room, her notebook under her arm (fl, x: where)
const rd_helena=(tt,face,o)=>({fl:(o&&o.fl)||930,draw:cc=>{o=o||{};const J=PK.person(cc,"helena",o.x||1560,o.fl||930,rd_hT(o.fl||930),"clasp",Object.assign({t:tt+4,flip:o.flip!==false,underF:PK.inHand.notebook({}),holds:true},face));if(o.out)o.out.J=J;}});
// Helena on her phone in the team's room, a chat in a callout from it
const rd_phone=(x,tt,t0,t1,CH,face,o)=>{o=o||{};let Jh=null;const cs=PK.chatSize(x,CH,{size:28});
  rd_team(x,tt,{clock:o.clock==null?16:o.clock,marta:null,samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},rd_alive(tt,{},1,t0)),jun:Object.assign({work:1},rd_alive(tt,{},2,t0)),people:[{fl:930,draw:cc=>{
    Jh=PK.person(cc,"helena",1560,930,rd_hT(930),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone?PK.inHand.phone({back:true}):null,holds:true},face));}}]});
  if(Jh)PK.callout(x,o.bx==null?560:o.bx,o.by==null?160:o.by,cs.w,cs.h,[Jh.hdN[0]-20,Jh.hdN[1]-30],ag_io(tt,t0+0.3,t1,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));
  return Jh;};

// a person who holds a sheet up to show it (who: a row of the story's people or a CAST name)
const rd_shows=(x,who,px,fl,tt,face,o)=>rdp_person(x,who,px,fl,PK.poseMix("clasp",RD_SHOW,1),Object.assign({t:tt,hold:rd_sheet,holds:true,flip:!!(o&&o.flip)},face));
// Ivy standing in the team's room (x, fl: where; o.out.J: her joints)
const rd_stand=(who,tt,face,o)=>{o=o||{};const fl=o.fl||930;return{fl,draw:cc=>{const q=Object.assign({t:tt,flip:o.flip!==false},o.book?{underF:PK.inHand.notebook({}),holds:true}:{},face);const J=PK.person(cc,rd_row(who),o.x||1560,fl,rd_hT(fl),"clasp",q);if(o.out)o.out.J=J;}};};

// the people at the product's review, seated (PK.audience's seats and order), each with a look, a nod or a smile now and then
function rd_audience(x,tt,n,look){const seats=PK.seats({}),order=[5,1,9,6,2,8,0,10,4,7,3],taken={};order.slice(0,n).forEach((s,i)=>taken[s]=i);
  seats.forEach((s,i)=>{const ch=PK.PAL[i%2?"chair2":"chair"];if(taken[i]==null){PK.S.begin(x,{lw:PK.u.clamp(s.h*0.0056,1.4,6.5),sh:4});PK.chair(x,s.x-0.012*s.h,s.fl,s.h,false,{col:ch});return;}
    PK.seated(x,PK.extra(i+3),s.x,s.fl,s.h,PK.poseMix("sit","sitBack",(i*0.37)%1),Object.assign({t:tt+i*1.7,chair:ch,shade:0},rd_alive(tt,{expr:"listen",gaze:[1,-look]},(i*3)%7*0.7)));});}

// the four timetable officers, seated in a teaching room, each with a look, a nod or a smile now and then
function rd_officers(x,tt,look){const seats=PK.seats({}),pick={5:"lucy",1:"arts",9:"business",6:"health"};
  seats.forEach((s,i)=>{const ch=PK.PAL[i%2?"chair2":"chair"];if(!pick[i]){PK.S.begin(x,{lw:PK.u.clamp(s.h*0.0056,1.4,6.5),sh:4});PK.chair(x,s.x-0.012*s.h,s.fl,s.h,false,{col:ch});return;}
    PK.seated(x,RD_FOLK[pick[i]],s.x,s.fl,s.h,PK.poseMix("sit","sitBack",(i*0.37)%1),Object.assign({t:tt+i*1.7,chair:ch,shade:0},rd_alive(tt,{expr:"listen",gaze:[1,-look]},(i*3)%7*0.7)));});}
// someone of the story's rooms at a desk with a 1980s screen on it (o.out.D: the desk)
const rdp_desk=(cc,who,x,fl,face,o)=>{o=o||{};const h=rdp_h(fl);return PK.atDesk(cc,who?rdp_row(who):null,x,fl,h,Object.assign({w:0.5*h,screen:null,t:0,work:1,flip:!!o.flip,on:(c2,D)=>{PK.monitor(c2,D.x0+D.dir*D.w*0.55,D.top,0.3*h,0.22*h,{});if(o.out)o.out.D=D;}},face));};
// an officer standing on the campus (who: a row's key in RD_FOLK; fl, x: where)
const rd_onCampus=(x,who,px,fl,tt,face,o)=>PK.person(x,rd_row(who),px,fl,rd_hC(fl),"clasp",Object.assign({t:tt,flip:!!(o&&o.flip)},face));

/* ---------------------------------------------------------------- 1. Water, shared */
scene("subak",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tT=c.temple-0.4,tN=c.turns-0.4,tP=c.push-0.4,tC=c.clock-0.4,tM=c.change-0.4,tB=c.bank-0.4,tK=c.back-0.4,tD=c.data-0.4;
  const N1=PK.pace(ctx,null,rd_note1(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the 1970s: terraces of rice, and the water from the mountains
    {at:0,place:"rdpTerraces",keys:[[0,960,540,1.0],[tT-0.2,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{
      rdp_person(x,"f2",1500,900,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:"neutral",gaze:[1,0.3]},2,0)));
      rdp_person(x,"f1",640,980,"clasp",Object.assign({t:tt},rd_alive(tt,{expr:"think",gaze:[1,0.3]},1,0)));}},
    // the groups meet at a water temple, and agree a calendar
    {at:tT,place:"rdpTemple",cut:true,keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let J4=null;
      rdp_person(x,"f2",1560,880,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:"listen",gaze:[1,0.2]},2,tT)));
      rdp_person(x,"f3",1200,940,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:"smile",gaze:[1,0.2]},3,tT)));
      J4=rdp_person(x,"f4",420,1000,"clasp",Object.assign({t:tt},rd_sp(tt,4,[[w("temple","who plants first",0),E.temple]],"think",0.2)));
      rd_bub(x,J4,tt,w("temple","who plants first",0),tN-0.3,["Upstream plants first;","we follow."],cam,{lean:160});}},
    // planting in turns, resting together (a farmer's book)
    {at:tN,place:"rdNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,RDP_FOLK.f3,tt,N1,{});}},
    // the country sets out to grow more rice, fast
    {at:tP,place:"rdpOffice",dis:0.8,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jp=null;
      rdp_person(x,"f1",1560,960,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:ag_in(tt,c.told,0.5)>0.5?"worry":"listen",gaze:[1,0.2]},1,tP)));
      Jp=rdp_person(x,"planner",980,920,"clasp",Object.assign({t:tt},rd_sp(tt,2,[[c.told+0.2,E.told]],"think",0.2)));
      rd_bub(x,Jp,tt,c.told+0.2,tC-0.3,["Plant as often","as you can."],cam,{lean:160});}},
    // every field on its own clock: pests next door, water that doesn't come
    {at:tC,place:"rdpTerraces",cut:true,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      rdp_fields(x,i=>ag_in(tt,c.dry,0.6)>0.5?(i%2?"dry":"bare"):["young","ripe","bare","water","ripe","young"][i],{dryCanal:ag_in(tt,c.dry,0.6)>0.5});
      rdp_person(x,"f1",640,980,"clasp",Object.assign({t:tt},rd_alive(tt,{expr:"worry",gaze:[1,0.3]},1,tC)));
      rdp_person(x,"f3",1400,920,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:"worry",gaze:[1,0.3]},3,tC)));}},
    // someone had to show the planners: a model of two rivers and their 172 subaks
    {at:tM,place:"rdpOffice",dis:0.8,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const O={};
      rdp_desk(x,null,640,930,{},{out:O});
      rdp_person(x,"planner",1300,960,PK.poseMix("clasp",RD_SHOW,1),Object.assign({t:tt,flip:true,hold:rd_sheet,holds:true},rd_alive(tt,{expr:"think",gaze:[1,0.4]},2,tM)));
      PK.callout(x,240,90,760,240,O.D?[O.D.x0+O.D.dir*O.D.w*0.55,O.D.top-120]:[700,620],ag_io(tt,c.model+1.2,tB-0.3,0.4),(cc,bx,by,bw,bh)=>rd_panel(cc,bx,by,bw,bh,"The model · two rivers",[["172 subaks",PK.C.orange,34],[ag_in(tt,c.showed,0.4)>0.5?"the temples' calendar: the most rice":"",PK.C.green,32]],null,PK.C.orange));}},
    // 1988: the bank agrees
    {at:tB,place:"rdpOffice",later:true,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jb=null;
      rdp_person(x,"planner",1460,960,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:"listen",gaze:[1,0.2]},2,tB)));
      Jb=rdp_person(x,"banker",900,920,"clasp",Object.assign({t:tt},rd_sp(tt,1,[[w("bank","agreed",-0.2),E.bank]],"smile",0.2)));
      rd_bub(x,Jb,tt,w("bank","agreed",-0.2),tK-0.3,["The temples set","the planting."],cam,{lean:160});}},
    // the temples set the planting again; pests under control; World Heritage
    {at:tK,place:"rdpTemple",cut:true,keys:[[tK,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      rdp_person(x,"f2",1560,880,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:"smile",gaze:[1,0.2]},2,tK)));
      rdp_person(x,"f3",1200,940,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:"smile",gaze:[1,0.2]},3,tK)));
      rdp_person(x,"f4",420,1000,"clasp",Object.assign({t:tt},rd_alive(tt,{expr:"smile",gaze:[1,0.2]},4,tK)));}},
    // a data team can make the planners' mistake
    {at:tD,place:"rdTeam",dis:1.0,keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      rd_atRoom(x,tt,tD,{at:"ivy",noor:true,face:rd_alive(tt,{expr:"think",gaze:[1,0.3]},3,tD),people:[rd_helena(tt,rd_alive(tt,{expr:"think",gaze:[1,0.1]},5,tD),{x:1560,fl:930})]});}}
  ]);
  rd_card(ctx,S,t,0.4,c.years+1.0,{kick:"Bali, the 1970s",title:"Rice terraces"},{y:40,mid:true});
  rd_card(ctx,S,t,c.hopper-0.2,c.dry-0.4,{kick:"Indonesia, 1977",title:"About two million tons lost"},{y:40,mid:true});
  rd_card(ctx,S,t,tB+0.3,w("bank","agreed",-0.4),{kick:"1988",title:"The bank listens"},{y:40,mid:true});
  rd_card(ctx,S,t,c.unesco,tD-0.3,{kick:"2012",title:"World Heritage"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"Rules that let people decide","A few clear rules, good tools, and trust","Leading data people · Leading a data team",{side:"right",size:48});
});

/* ---------------------------------------------------------------- 2. Every question, one door */
scene("door",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tC=c.council-0.4,tP=c.product-0.4,tH=c.helena-0.4,tD=c.decide-0.4,N2=PK.pace(ctx,null,rd_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // September 2027, at the university
    {at:0,place:"rdTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      rd_atRoom(x,tt,0,{at:"ivy",noor:true,face:rd_alive(tt,{expr:"think",gaze:[1,0.3]},3,0),people:[rd_helena(tt,rd_alive(tt,{expr:"think",gaze:[1,0.1]},5,0),{x:1560,fl:930})]});}},
    // the Council's ask, and the four faculties' timetable officers
    {at:tC,place:"rdCampus",dis:0.6,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jl=null;
      rd_onCampus(x,"arts",1500,880,tt,rd_alive(tt,{expr:"listen",gaze:[1,0.2]},2,tC),{flip:true});
      rd_onCampus(x,"business",1140,920,tt,rd_alive(tt,{expr:"think",gaze:[1,0.2]},3,tC),{flip:true});
      rd_onCampus(x,"health",760,960,tt,rd_alive(tt,{expr:"listen",gaze:[1,0.2]},4,tC));
      Jl=rd_onCampus(x,"lucy",380,1000,tt,rd_alive(tt,{expr:"think",gaze:[1,0.2]},1,tC));}},
    // one data product, and only the data team works with it: 27 room reports
    {at:tP,place:"rdTeam",dis:0.6,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=rd_atRoom(x,tt,tP,{at:"ivy",noor:true,face:rd_alive(tt,{expr:ag_in(tt,c.wait,0.5)>0.5?"worry":"think",gaze:[1,0.5]},3,tP)});
      rd_screenCall(x,R,ag_io(tt,c.product+1.0,c.asked-0.3,0.4),"Teaching space use",[["which rooms are used, and when",PK.C.orange,32],[ag_in(tt,c.only,0.4)>0.5?"only the data team works with it":"",PK.C.amber,32]],PK.C.orange,{bh:240});
      rd_screenCall(x,R,ag_io(tt,c.asked+0.3,tH-0.3,0.4),"Room reports · July to September",[["27 asked",PK.C.orange,34],[ag_in(tt,c.wait,0.4)>0.5?"a day and a half each":"",PK.C.amber,34],[ag_in(tt,w("wait","two weeks",0),0.4)>0.5?"two weeks in the list":"",PK.C.amber,34]],PK.C.amber,{bh:290});}},
    // one door, and it's Helena (her notebook)
    {at:tH,place:"rdNotes",dis:0.6,keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N2,{});}},
    // she decided to stop deciding
    {at:tD,place:"rdTeam",dis:0.6,keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Hh={};
      rd_atRoom(x,tt,tD,{at:"ivy",noor:true,face:rd_alive(tt,{expr:"listen",gaze:[1,0.3]},3,tD),people:[rd_helena(tt,rd_sp(tt,5,[[c.decide+0.2,E.decide]],"smile",0.1),{x:1560,fl:930,out:Hh})]});
      rd_bub(x,Hh.J,tt,w("decide","the faculties",0),1e9,["The faculties will read","the data themselves."],cam,{lean:-160});}}
  ]);
  rd_card(ctx,S,t,0.3,c.univ+1.6,{kick:"September 2027",title:"The university"},{y:40,mid:true});
  rd_card(ctx,S,t,tC+0.3,c.officers-0.2,{kick:"June",title:"The Council's ask"},{y:40,mid:true});
  rd_imagined(ctx,S,t,0.4,c.univ+1.6,"The university, 2027 · imagined");
  rd_kick(ctx,S,ag_in(t,0.6,0.6)*(1-rd_apart(t,[[0,c.univ+1.6],[tC,c.officers],[tH,tD]])));
});

/* ---------------------------------------------------------------- 3. Three rules, each with its reason */
scene("rules",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tB=c.r1-0.4,tW=c.drawer-0.4,tO=c.ostrom-0.4,tZ=c.ostrom+2.4,tH=c.with-0.4,LE=PK.ROOMS.lecture;
  const BA=PK.pace(ctx,"yusuf",rd_boardA(sc,w)),BB=PK.pace(ctx,"yusuf",rd_boardB(sc,w)),BC=PK.pace(ctx,"carmen",rd_boardC(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Yusuf's first list, and the question asked of each rule
    {at:0,place:"rdTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=rd_lesson(x,tt,{rows:BA,who:"yusuf",side:"helena",sam:rd_alive(tt,{expr:"listen",gaze:[1,-0.25]},1,0),helena:rd_alive(tt,{expr:"listen",gaze:[1,-0.2]},4,0),jun:Object.assign({work:1,pose:undefined},rd_alive(tt,{},2,0)),clock:10,events:RD_HEV});
      rd_name(x,R.at,tt,w("yusuf","Yusuf Demir",0),c.eleven-0.2,"Yusuf Demir","Data governance",160);}},
    // the three, each with its reason (the board, close)
    {at:tB,cut:true,place:"rdBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"yusuf",tt,BB,{say:[],events:RD_HEV});}},
    // the other eight go in a drawer
    {at:tW,place:"rdTeam",cut:true,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Yy={};
      rd_atRoom(x,tt,tW,{at:"ivy",noor:true,face:rd_alive(tt,{expr:"listen",gaze:[1,0.3]},3,tW),people:[rd_stand("yusuf",tt,rd_sp(tt,5,[[c.drawer+0.2,E.drawer]],"smile",0.1),{x:1560,fl:930,book:true,out:Yy})]});
      rd_bub(x,Yy.J,tt,c.drawer+0.2,tO-0.3,["Eight wait in a drawer,","for a real problem."],cam,{lean:-160});}},
    // Elinor Ostrom (Carmen)
    {at:tO,place:"rdTeam",later:true,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{rd_lesson(x,tt,{rows:BC,jun:Object.assign({work:1,pose:undefined},rd_alive(tt,{},2,tO)),clock:11,events:RD_HEV});}},
    {at:tZ,cut:true,place:"rdBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.ostrom,E.lasted]],events:RD_HEV});}},
    // agreed with the four officers, not for them
    {at:tH,place:"rdLecture",dis:0.6,keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jh=null;rd_officers(x,tt,0.6);
      Jh=PK.person(x,"helena",1500,950,PK.hAt(950,LE.eye),"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},rd_sp(tt,1,[[w("with","any of them",0),E.with]],"smile",0.1)));
      rd_bub(x,Jh,tt,w("with","any of them",0),1e9,["Any of you can ask","to change one."],cam,{lean:-180});}}
  ]);
  rd_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 4. The right way, the easy way */
scene("tools",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tC=c.copy-0.4,tM=c.mesh-0.4,tZ=c.mesh+2.4,tS=c.start-0.4,BD=PK.pace(ctx,"carmen",rd_boardD(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Ivy and Jun make a template
    {at:0,place:"rdTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=rd_atRoom(x,tt,0,{at:"ivy",noor:true,jun:Object.assign({work:1},rd_alive(tt,{expr:"smile",gaze:[1,0.3]},2,0)),face:rd_alive(tt,{expr:"think",gaze:[1,0.5]},3,0)});
      rd_screenCall(x,R,ag_io(tt,c.template+0.8,tC-0.3,0.4),"The template",[["booked hours beside counted",PK.C.orange,34],["room use, the agreed way",PK.C.blue,34]],PK.C.blue,{bh:240});}},
    // an officer copies it, with Anil beside her for her first hour; who decides what
    {at:tC,place:"rdCorner",dis:0.6,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const r=rd_corner(x,tt,{who1:RD_FOLK.health,who2:RD_FOLK.anil,laptop:true,t0:tC,hf:rd_alive(tt,{expr:"think",gaze:[1,0.5]},1,tC),iface:rd_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tC)});
      rd_name(x,r.who2,tt,w("anil","Anil",0),c.who-0.2,"Anil","Data partner",150);
      PK.callout(x,1408,440,492,230,r.laptop||[810,700],ag_io(tt,c.copy+0.6,c.who-0.3,0.4),(cc,bx,by,bw,bh)=>rd_panel(cc,bx,by,bw,bh,"Health · its rooms",[["her own questions",PK.C.blue,32],["an afternoon, not two weeks",PK.C.green,30]],null,PK.C.blue));
      PK.callout(x,1408,420,492,350,r.laptop||[810,700],ag_io(tt,c.who+0.3,tM-0.3,0.4),(cc,bx,by,bw,bh)=>rd_panel(cc,bx,by,bw,bh,"Who decides what",[["faculties · their classes",PK.C.blue,32],[ag_in(tt,c.whos,0.4)>0.5?"Ivy · what the numbers mean":"",PK.C.blue,32],[ag_in(tt,c.keeps,0.4)>0.5?"team · platform":"",PK.C.blue,30],[ag_in(tt,c.keeps,0.4)>0.5?"registrar · timetable":"",PK.C.blue,30]],null,PK.C.blue));}},
    // data mesh and Team Topologies (Carmen)
    {at:tM,place:"rdTeam",cut:true,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{rd_lesson(x,tt,{rows:BD,jun:Object.assign({work:1,pose:undefined},rd_alive(tt,{},2,tM)),clock:14,events:RD_HEV});}},
    {at:tZ,cut:true,place:"rdBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BD,{say:[[c.mesh,E.mesh]],events:RD_HEV});}},
    // Monday 4 October: the officers start, and the team stops making room reports by hand
    {at:tS,place:"rdTeam",cut:true,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=rd_atRoom(x,tt,tS,{at:"ivy",noor:true,face:rd_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tS)});
      rd_screenCall(x,R,ag_io(tt,c.start+1.4,1e9,0.4),"Room reports by hand",[["none this week",PK.C.green,36]],PK.C.green,{bh:200});}}
  ]);
  rd_card(ctx,S,t,tS+0.3,c.start+1.2,{kick:"Monday 4 October",title:"The officers start"},{y:40,mid:true});
  rd_kick(ctx,S,ag_in(t,0.6,0.6)*(1-rd_apart(t,[[tS,c.start+1.2]])));
});

/* ---------------------------------------------------------------- 5. Labs on a Monday */
scene("labs",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tR=c.rule3-0.4,tF=c.freed-0.4,tS=c.then-0.4,tM=c.model-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // Lucy opens the template: Engineering's labs, booked and counted
    {at:0,place:"rdCorner",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const r=rd_corner(x,tt,{who1:RD_FOLK.lucy,laptop:true,t0:0,hf:rd_sp(tt,1,[[w("why","two first-year",0),E.why]],ag_in(tt,c.empty,0.5)>0.5?"think":"neutral",0.5)});
      rd_name(x,r.who1,tt,w("lucy","Lucy Tran",0),c.labs-0.2,"Lucy Tran","Engineering",160);
      PK.callout(x,980,90,760,290,r.laptop||[810,700],ag_io(tt,c.labs+0.4,w("why","two first-year",-0.3),0.4),(cc,bx,by,bw,bh)=>rd_panel(cc,bx,by,bw,bh,"Engineering · 12 labs",[["booked beside counted",PK.C.orange,34],[ag_in(tt,c.empty,0.4)>0.5?"Mondays: 9 booked":"",PK.C.orange,34],[ag_in(tt,w("empty","counted nobody",0),0.4)>0.5?"counted in them: nobody":"",PK.C.amber,34]],null,PK.C.orange));
      rd_bub(x,r.who1,tt,w("why","two first-year",0),tR-0.3,["Two courses moved","to Thursdays."],cam,{lean:160});}},
    // a new measure: before she shares it, Lucy asks Ivy
    {at:tR,place:"rdTeam",dis:0.6,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=rd_atRoom(x,tt,tR,{at:"ivy",noor:true,sam:null,face:rd_alive(tt,{expr:"think",gaze:[1,0.6]},3,tR)});const D=R&&R.marta&&R.marta.desk;
      const CH={title:"Lucy Tran",who:[RD_FOLK.lucy],me:"ivy",msgs:[{who:RD_FOLK.lucy,s:"Lab use is a new measure. May I share it?",at:c.rule3+1.4,type:1.6},{who:"ivy",s:"Yes: it's in the glossary now.",at:w("gloss","glossary",-0.6),type:1.3}]},cs=PK.chatSize(x,CH,{size:28});
      PK.callout(x,720,110,cs.w,cs.h,D?[150,D.top-120]:[150,620],ag_io(tt,tR+0.4,tF-0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}},
    // Engineering releases the nine mornings
    {at:tF,place:"rdCorner",dis:0.6,keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const r=rd_corner(x,tt,{who1:RD_FOLK.lucy,laptop:true,t0:tF,hf:rd_alive(tt,{expr:"smile",gaze:[1,0.5]},1,tF)});
      PK.callout(x,980,90,760,240,r.laptop||[810,700],ag_io(tt,c.freed+0.4,tS-0.3,0.4),(cc,bx,by,bw,bh)=>rd_panel(cc,bx,by,bw,bh,"Engineering",[["9 Monday mornings released",PK.C.green,34],["two new labs: on hold",PK.C.blue,34]],null,PK.C.green));}},
    // then, nobody planned it: Health and Arts copy Lucy's page
    {at:tS,place:"rdCampus",cut:true,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jh=null;
      rd_onCampus(x,"arts",1460,900,tt,rd_alive(tt,{expr:"smile",gaze:[1,0.2]},2,tS),{flip:true});
      Jh=rd_onCampus(x,"health",1000,950,tt,rd_sp(tt,4,[[c.spread+0.3,E.spread]],"smile",0.2),{flip:true});
      rd_onCampus(x,"lucy",460,1000,tt,rd_alive(tt,{expr:"smile",gaze:[1,0.2]},1,tS));
      rd_bub(x,Jh,tt,c.spread+0.3,tM-0.3,["We copied your page","for our skills rooms."],cam,{lean:-160});}},
    // the model saw it too: groups planting together appear, and nobody drew them
    {at:tM,place:"rdpTerraces",dis:0.8,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const u=PK.u.clamp((tt-c.emerge)/3,0,1);
      rdp_fields(x,i=>u<0.5?["young","bare","ripe","water","young","bare"][i]:(i<3?"young":"ripe"));
      rdp_person(x,"f2",1500,900,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tM)));
      rdp_person(x,"f1",640,980,"clasp",Object.assign({t:tt},rd_alive(tt,{expr:"smile",gaze:[1,0.3]},1,tM)));}}
  ]);
  rd_card(ctx,S,t,tS+0.3,c.spread+0.1,{kick:"Within three weeks",title:"Copied, not sent"},{y:40,mid:true});
  rd_card(ctx,S,t,tM+0.3,c.emerge-0.2,{kick:"The model, again",title:"Four nearest neighbours"},{y:40,mid:true});
  rd_kick(ctx,S,ag_in(t,0.6,0.6)*(1-rd_apart(t,[[tS,c.spread],[tM,c.emerge]])));
});

/* ---------------------------------------------------------------- 6. Watch what emerges */
scene("watch",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tR=c.role-0.4,tP=c.problem-0.4,tF=c.four-0.4,N3=PK.pace(ctx,null,rd_note3(sc,w)),BE=PK.pace(ctx,"helena",rd_boardE(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Friday 26 November: all four faculties' plans; one peak class in six moved
    {at:0,place:"rdTeam",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=rd_atRoom(x,tt,0,{at:"ivy",noor:true,face:rd_alive(tt,{expr:"smile",gaze:[1,0.4]},3,0),people:[rd_helena(tt,rd_alive(tt,{expr:"smile",gaze:[1,0.1]},5,0),{x:1560,fl:930})]});
      rd_screenCall(x,R,ag_io(tt,c.plans+1.2,tR-0.3,0.4),"Plans for February",[["all four faculties",PK.C.green,34],[ag_in(tt,c.moved,0.4)>0.5?"1 peak class in 6, moved":"",PK.C.green,34],[ag_in(tt,c.none,0.4)>0.5?"no room reports by hand":"",PK.C.green,34]],PK.C.blue,{bh:290});}},
    // Helena's job changed too (her notebook)
    {at:tR,place:"rdNotes",dis:0.6,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}},
    // one real problem, and one rule out of the drawer (Helena, at the team's board)
    {at:tP,place:"rdTeam",dis:0.6,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{rd_lesson(x,tt,{rows:BE,who:"helena",jun:Object.assign({work:1,pose:undefined},rd_alive(tt,{},2,tP)),clock:15,events:RD_HEV});}},
    {at:c.rule4+0.6,cut:true,place:"rdBoard",keys:[[c.rule4+0.6,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BE,{say:[],events:RD_HEV});}}
  ]);
  rd_card(ctx,S,t,0.3,c.plans+1.0,{kick:"Friday 26 November",title:"Four plans for February"},{y:40,mid:true});
  rd_kick(ctx,S,ag_in(t,0.6,0.6)*(1-rd_apart(t,[[0,c.plans+1.0],[tR,tP]])));
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tU=c.uni-0.4,tN=c.m1-0.1,tL=c.last-0.4,tE=c.breath+0.6,BM=PK.pace(ctx,"helena",rd_boardM(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // in Bali, nobody planned every field
    {at:0,place:"rdpTerraces",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{rdp_fields(x,i=>i<3?"ripe":"young");
      rdp_person(x,"f3",1400,920,"clasp",Object.assign({t:tt,flip:true},rd_alive(tt,{expr:"smile",gaze:[1,0.3]},3,0)));
      rdp_person(x,"f1",640,980,"clasp",Object.assign({t:tt},rd_alive(tt,{expr:"smile",gaze:[1,0.3]},1,0)));}},
    // at the university, four officers planned their own rooms
    {at:tU,place:"rdCampus",dis:0.8,keys:[[tU,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      rd_onCampus(x,"arts",1500,880,tt,rd_alive(tt,{expr:"smile",gaze:[1,0.2]},2,tU),{flip:true});
      rd_onCampus(x,"business",1140,920,tt,rd_alive(tt,{expr:"smile",gaze:[1,0.2]},3,tU),{flip:true});
      rd_onCampus(x,"health",760,960,tt,rd_alive(tt,{expr:"smile",gaze:[1,0.2]},4,tU));
      rd_onCampus(x,"lucy",380,1000,tt,rd_alive(tt,{expr:"smile",gaze:[1,0.2]},1,tU));}},
    {at:tN,place:"rdBoard",cut:true,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BM,{say:[],events:RD_HEV});}},
    // a few clear rules, good tools, and trust
    {at:tL,place:"rdTeam",cut:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      rd_atRoom(x,tt,tL,{at:"ivy",noor:true,face:rd_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tL),people:[rd_helena(tt,rd_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tL),{x:1560,fl:930})]});}}
  ]);
  rd_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6)));
  PK.end(ctx,S,t,tE,"Rules that let people decide",RD_LAST,"Film 4 of 4","Leading a data team",{side:"right"});
});
ag_cutInto(["door","rules","tools","labs","watch","monday"]);
