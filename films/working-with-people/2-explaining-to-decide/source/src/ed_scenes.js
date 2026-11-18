/* ===== Explaining so people can decide: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are written by hand: Daniels's board in 1952, Carmen Vidal's board, and the designers', Ivy's and Helena's notebooks
   (ed_uni.js). The Air Force of 1950 to 1952 is in edp_air.js. Every time comes from the voice: a line's start (sc.cues) or a word
   in it (wAt). */
const ed_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,2,"Explaining so people can decide",a);}};
function ed_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const ed_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const ed_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const ed_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const ed_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const ed_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const ed_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const ed_sp=(tt,i,spans,base,g)=>ed_alive(tt,{expr:ed_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const ed_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=o.flip!=null?o.flip:x1<x0;if(tt<t0)return null;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip:x1<x0},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{},o.hold?{hold:o.hold,holds:true}:{}));};
const ED_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const ED_LAST="Lead with the decision; show what it turns on.";
// a screen's callout from the monitor at the desk by the window
const ed_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>ed_panel(cc,bx,by,bw,bh,head,rows,o.bars||null,hc));};
// the team's room with someone at the desk by the window (o.at, default Ivy); o.ivy: their face
const ed_atRoom=(x,tt,t0,o)=>{o=o||{};return ed_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:o.at||"ivy",marta:Object.assign({work:o.work==null?1:o.work,turn:0},o.ivy||ed_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
  sam:o.sam===null?null:Object.assign({work:1},ed_alive(tt,{},1,t0)),jun:o.jun===null?null:Object.assign({work:1},ed_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people:o.people||[]});};
// the week's heat map, on a screen: the days down the side, the hours from 8 to 6 across, each hour as dark as the share of rooms
// booked; pk (0 to 1): the peak's hours picked out in amber
const ED_DAYS=["Mon","Tue","Wed","Thu","Fri"];
const ed_share=(d,h)=>{if(d>=1&&d<=3&&h>=2&&h<=5)return 0.93;if((d===0&&h<4)||(d===4&&h>=6))return 0.06;return 0.2;};
function ed_heat(cc,bx,by,bw,bh,pk){const U=PK.u,S=PK.S;ag_T(cc,"ROOMS BOOKED, BY HOUR",bx+30,by+54,{w:800,size:28,ls:3,color:U.css(PK.C.orange)});
  const x0=bx+130,y0=by+84,cw=(bw-170)/10,ch=(bh-150)/5;
  for(let d=0;d<5;d++){ag_T(cc,ED_DAYS[d],bx+30,y0+d*ch+ch*0.7,{w:700,size:28,color:U.css(PK.C.ink)});
    for(let h=0;h<10;h++){const v=ed_share(d,h),col=U.mix([250,246,236],PK.C.orange,v);S.begin(cc,{lw:1.4});S.fill(cc,c=>c.rect(x0+h*cw+2,y0+d*ch+2,cw-4,ch-4),col,{flat:true});
      if(pk>0.004&&v>0.9){cc.save();cc.globalAlpha*=pk;S.line(cc,c=>c.rect(x0+h*cw+2,y0+d*ch+2,cw-4,ch-4),PK.C.amber,1.0);cc.restore();}}}
  for(const [h,lab] of [[0,"8"],[2,"10"],[6,"2"],[9,"5"]])ag_T(cc,lab,x0+h*cw+6,y0+5*ch+40,{w:700,size:28,color:U.css(PK.C.mut)});}
// the team's room with a callout of a heat map from the screen by the window
const ed_heatCall=(x,R,a,pk)=>{const D=R&&R.marta&&R.marta.desk;PK.callout(x,720,90,760,420,D?[150,D.top-120]:[150,620],a,(cc,bx,by,bw,bh)=>ed_heat(cc,bx,by,bw,bh,pk));};
// Helena standing by Ivy's desk, her notebook under her arm (fl, x: where)
const ed_helena=(tt,face,o)=>({fl:(o&&o.fl)||930,draw:cc=>{o=o||{};const J=PK.person(cc,"helena",o.x||1560,o.fl||930,ed_hT(o.fl||930),"clasp",Object.assign({t:tt+4,flip:o.flip!==false,underF:PK.inHand.notebook({}),holds:true},face));if(o.out)o.out.J=J;}});

/* ---------------------------------------------------------------- 1. No average pilot */
scene("pilot",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tW=c.why-0.4,tD=c.door-0.4,tK=c.cockpit-0.4,tN=c.daniels-0.4,tB=c.height-0.4,tT=c.note-0.4,tR=c.range-0.4,tS=c.seats-0.4,tC=c.car-0.4,tA=c.data-0.4;
  const BO=PK.pace(ctx,EDP_FOLK.daniels,ed_boardO(sc,w)),N1=PK.pace(ctx,null,ed_note1(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // 1950: a flyer measured at the post; others wait on the bench; a clerk writes each figure down
    {at:0,place:"edpLab",keys:[[0,960,540,1.0],[tW-0.2,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{const hf=edp_h(EDP_POST.fl);
      edp_seat(x,"flyer2",1300,812,"sit",Object.assign({t:tt},ed_alive(tt,{expr:"neutral",gaze:[1,0.1]},1,0)));
      edp_seat(x,"flyer3",1560,812,"sit",Object.assign({t:tt,flip:true},ed_alive(tt,{expr:"neutral",gaze:[1,0.1]},2,0)));
      edp_post(x,EDP_POST.fl-hf+4);
      edp_person(x,"flyer1",EDP_POST.x+50,EDP_POST.fl,"stand",Object.assign({t:tt},PK.face(tt,{expr:"neutral",gaze:[1,0]},[])));
      edp_person(x,"measurer",1000,960,PK.poseMix("clasp",ED_NOTE,0.8),Object.assign({t:tt+2,flip:true,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},ed_alive(tt,{expr:"think",gaze:[1,0.4]},3,0)));
      edp_desk(x,"clerk",300,1010,Object.assign({t:tt,work:1,on:(cc,D)=>{edp_cards(cc,D.x0+0.16*edp_h(1010),D.top,1.2);}},ed_alive(tt,{expr:"think",gaze:[1,0.6]},4,0)));}},
    // the figures go to the designers: suits, helmets, cockpits; they take one figure, the average man
    {at:tW,place:"edpDraw",dis:0.8,keys:[[tW,960,540,1.0],[c.easy,1000,540,1.06]],d:3,draw:(x,tt,cam)=>{let J1=null,J2=null;const fl=940,h=edp_h(fl);
      edp_drawing(x,1260,fl,h,true);edp_drawing(x,700,fl,h,false);
      J1=edp_person(x,"designer1",470,fl,"clasp",Object.assign({t:tt},ed_sp(tt,1,[[c.easy+0.2,E.easy]],"think",0.3)));
      J2=edp_person(x,"designer2",1500,fl,"clasp",Object.assign({t:tt,flip:true},ed_sp(tt,2,[[c.avg+0.2,E.avg]],"neutral",0.3)));
      ed_bub(x,J2,tt,c.avg+0.2,c.easy-0.2,["Draw for the average man:","five foot nine."],cam,{lean:-160});
      ed_bub(x,J1,tt,c.easy+0.2,tD-0.3,["Easiest to fit."],cam,{lean:160});}},
    // a doorway built to his height: about half the men stoop
    {at:tD,place:"edpDoor",dis:0.8,keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const {x:dx,fl}=EDP_DOOR,h=edp_h(fl);
      edp_person(x,"flyer1",dx+330,fl-40,"stand",Object.assign({t:tt,flip:true},ed_alive(tt,{expr:"neutral",gaze:[1,0.1]},2,tD)));
      edp_person(x,"flyer3",dx,fl,PK.poseMix("stand","bend",ag_in(tt,c.door+1.2,0.5)),Object.assign({t:tt},PK.face(tt,{expr:"worry",gaze:[1,0.3]},[])));
      edp_person(x,"flyer4",dx-380,fl+50,"stand",Object.assign({t:tt},ed_alive(tt,{expr:"neutral",gaze:[1,0.2]},3,tD)));}},
    // in a cockpit, a control just out of reach
    {at:tK,place:"edpCock",dis:0.8,keys:[[tK,960,540,1.0],[c.change,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{const {x:px,fl}=EDP_CK,h=edp_h(fl);let Jp=null;
      edp_cockpit(x,0,ag_io(tt,w("cockpit","out of reach",-0.2),tN-0.4,0.4));
      Jp=edp_seat(x,"pilot",px,fl,"sit",Object.assign({t:tt},ed_sp(tt,1,[[c.change+0.2,E.change]],"worry",0.0)));
      edp_person(x,"measurer",1700,980,PK.poseMix("clasp",ED_NOTE,0.6),Object.assign({t:tt+2,flip:true,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},ed_alive(tt,{expr:"worry",gaze:[1,0.3]},2,tK)));
      ed_bub(x,Jp,tt,c.change+0.2,tN-0.3,["I can't reach that switch."],cam,{lean:120});}},
    // 1952: Gilbert Daniels counts, at his board, how many flyers are average
    {at:tN,place:"edpOffice",cut:true,keys:[[tN,960,540,1.0],[tB,960,540,1.0],[tB+1.6,600,430,1.5]],d:3,draw:(x,tt,cam)=>{let Jd=null;
      edp_desk(x,"measurer",1500,960,Object.assign({t:tt,flip:true,work:0,on:(cc,D)=>{edp_cards(cc,D.x0-0.3*edp_h(960),D.top,1.2);}},ed_alive(tt,{expr:"listen",gaze:[1,0.2]},2,tN)));
      Jd=PK.teach(x,EDP_FOLK.daniels,tt,BO,{x:EDP_BD.x,y:EDP_BD.y,k:EDP_BD.k,deco:true,floor:EDP_BD.floor,rest:EDP_BD.rest,h:edp_h(EDP_BD.floor),say:[[c.asked,E.asked]],events:ED_HEV});
      ed_name(x,Jd,tt,w("daniels","Gilbert Daniels",0),c.asked-0.2,"Gilbert Daniels","Air Force scientist",170);
      ed_bub(x,Jd,tt,c.asked+0.1,c.ten-0.2,["How many flyers","are average?"],cam,{lean:180});}},
    // his note, seven pages, says so in its first lines
    {at:tT,place:"edpOffice",cut:true,keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const fl=960,h=edp_h(fl);let Jd=null;
      Jd=edp_desk(x,"daniels",1400,fl,Object.assign({t:tt,flip:true,work:1,on:(cc,D)=>{edp_typewriter(cc,D.x0-0.24*h,D.top,1.0,ag_in(tt,tT+0.6,4));edp_cards(cc,D.x0-0.58*h,D.top,1.1);}},ed_alive(tt,{expr:"think",gaze:[1,0.6]},1,tT)));
      PK.callout(x,240,120,760,260,[1150,560],ag_io(tt,w("note","virtually",-0.4),tR-0.3,0.4),(cc,bx,by,bw,bh)=>ed_panel(cc,bx,by,bw,bh,"His note, page 1",[["“It is virtually impossible",PK.C.ink,34],["to find an average man",PK.C.ink,34],["in the Air Force.”",PK.C.ink,34]],null,PK.C.blue));}},
    // fit the range, not the average (a designer's notebook)
    {at:tR,place:"edNotes",dis:0.6,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,EDP_FOLK.designer2,tt,N1,{});}},
    // by the 1970s: the seat rises and falls, the pedals move
    {at:tS,place:"edpCock",dis:0.8,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const {x:px,fl}=EDP_CK,h=edp_h(fl),up=60*ag_in(tt,c.adjust+0.2,1.4);
      edp_cockpit(x,up,0);
      edp_seat(x,"pilot2",px,fl-up,"sit",Object.assign({t:tt},ed_alive(tt,{expr:"smile",gaze:[1,0.1]},1,tS)),h*0.94);
      edp_person(x,"designer1",1700,980,"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},ed_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tS)));}},
    // a car's seat slides for the same reason
    {at:tC,place:"edpStreet",dis:0.8,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const {x:cx,fl}=EDP_CAR,sl=60*ag_in(tt,c.car+0.6,1.0);
      edp_carBack(x);edp_person(x,"driver",cx-60-sl,fl-200,"sit",Object.assign({t:tt},ed_alive(tt,{expr:"smile",gaze:[1,0.2]},1,tC)),edp_h(fl)*0.98);edp_carFront(x);}},
    // data has its average men too: one number that seems to describe everything
    {at:tA,place:"edTeam",dis:1.0,keys:[[tA,960,540,1.0],[c.lead,760,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=ed_atRoom(x,tt,tA,{at:"ivy",ivy:ed_alive(tt,{expr:"think",gaze:[1,0.3]},3,tA)});
      ed_screenCall(x,R,ag_io(tt,w("data","average men",-0.3),c.breath-0.3,0.4),"Rooms booked",[],PK.C.orange,{bh:220,bars:[["the whole week · 38%",38,100,PK.C.orange]]});}}
  ]);
  ed_card(ctx,S,t,c.when+0.3,tW-0.2,{kick:"1950",title:"The Air Force measures its flyers"},{y:40,mid:true});
  ed_card(ctx,S,t,tW+0.4,c.avg-0.2,{kick:"The designers",title:"Suits, helmets, cockpits"},{y:40,mid:true});
  ed_card(ctx,S,t,tN+0.4,w("daniels","Gilbert Daniels",-0.3),{kick:"1952",title:"The anthropology section"},{y:40,mid:true});
  ed_card(ctx,S,t,tS+0.3,c.adjust-0.2,{kick:"By the 1970s",title:"Cockpits for the middle ninety"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"Explaining so people can decide","Lead with the decision; show what it turns on","Leading data people · Working with people",{side:"right",size:52});
});

/* ---------------------------------------------------------------- 2. One page for the University Council */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tF=c.full-0.4,tQ=c.q-0.4,tI=c.ivy-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // Graham, in his office, with the building he must decide whether to ask for
    {at:0,place:"edCorner",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=ed_corner(x,tt,{t0:0,who1:"graham",laptop:true,hf:ed_alive(tt,{expr:"think",gaze:[1,0.6]},1,0),handN:[830,616],handF:[856,606]});
      ed_name(x,R.who1,tt,w("uni","Graham Ellis",0),c.ask-0.2,"Graham Ellis","Director of Facilities",170);
      PK.callout(x,1060,90,720,250,R.laptop,ag_io(tt,c.ask+0.2,tF-0.3,0.4),(cc,bx,by,bw,bh)=>ed_panel(cc,bx,by,bw,bh,"A new teaching building",[["forty rooms",PK.C.ink,34],["about A$140 million",PK.C.ink,34]],null,PK.C.blue));}},
    // the academics say the rooms are always full
    {at:tF,place:"edCampus",dis:0.6,keys:[[tF,900,570,1.1]],d:2,draw:(x,tt,cam)=>{let Ja=null;
      PK.person(x,PK.extra(6),1180,CA.near-20,ed_hC(CA.near-20),"clasp",Object.assign({t:tt,flip:true},ed_alive(tt,{expr:"listen",gaze:[1,0.1]},2,tF)));
      Ja=PK.person(x,PK.extra(5),860,CA.near,ed_hC(CA.near),"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},ed_sp(tt,1,[[c.full+0.2,E.full]],"worry",0.1)));
      ed_bub(x,Ja,tt,c.full+0.2,tQ-0.3,["The rooms are always full."],cam,{lean:-160});}},
    // the question agreed in February, the answer in April, the page by 1 June; Ivy drafts it with Helena
    {at:tQ,place:"edTeam",dis:0.6,keys:[[tQ,960,540,1.0],[tI,820,560,1.06]],d:3,draw:(x,tt,cam)=>{const Hh={};
      const R=ed_atRoom(x,tt,tQ,{at:"ivy",sam:null,ivy:ed_sp(tt,3,[],"think",0.3),people:[ed_helena(tt,ed_sp(tt,5,[[c.who+0.1,E.who]],"listen",0.1),{x:1560,fl:930,out:Hh})]});
      ed_screenCall(x,R,ag_io(tt,w("q","agreed",-0.3),c.june-0.3,0.4),"The question · 16 Feb",[["Too few rooms,",PK.C.blue,36],["or too few at some hours?",PK.C.blue,36],[ag_in(tt,c.april,0.4)>0.5?"April: too few, at some hours":"",PK.C.green,34]],PK.C.blue,{bh:300});
      ed_name(x,R.marta,tt,w("ivy","Ivy Reyes",0),w("ivy","Helena Novak",-0.3),"Ivy Reyes","Data analyst",170);
      ed_name(x,Hh.J,tt,w("ivy","Helena Novak",0),c.draft-0.2,"Helena Novak","Data manager",170);
      ed_screenCall(x,R,ag_io(tt,c.draft+0.2,c.chart-0.3,0.4),"Draft 1 · 12 pages",[["the data · the method",PK.C.ink,34],["the checks …",PK.C.ink,34],["page 9: the answer",PK.C.amber,34]],PK.C.blue,{bh:300});
      ed_screenCall(x,R,ag_io(tt,c.chart+0.2,c.who-0.3,0.4),"Chart 1",[],PK.C.orange,{bh:220,bars:[["the week · booked 38%",38,100,PK.C.orange]]});
      ed_bub(x,Hh.J,tt,c.who+0.1,1e9,["Who will read it, and what","will they decide with it?"],cam,{lean:-160});}}
  ]);
  ed_imagined(ctx,S,t,0.4,c.ask-0.1,"The university, 2027 · imagined");
  ed_card(ctx,S,t,c.june+0.2,c.ivy-0.2,{kick:"By Tuesday 1 June",title:"One page for the Council"},{y:40,mid:true});
  ed_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ed_apart(t,[[0,c.ask],[c.june,c.ivy]])));
});

/* ---------------------------------------------------------------- 3. The decision first */
scene("first",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tM=c.minto-0.4,tZ=c.minto+2.2,tN=c.decision-0.4,tB=c.back-0.4,BA=PK.pace(ctx,"carmen",ed_boardA(sc,w)),N2=PK.pace(ctx,null,ed_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the University Council's members read a pile of papers before each meeting
    {at:0,place:"edLecture",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.audience(x,tt,8,{look:0});}},
    // Minto's pyramid (Carmen, at the team's board)
    {at:tM,place:"edTeam",dis:0.6,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=ed_lesson(x,tt,{rows:BA,clock:10,events:ED_HEV});
      ed_name(x,R.at,tt,tM+0.4,tZ-0.3,"Carmen Vidal","Consultant",160);}},
    {at:tZ,cut:true,place:"edBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.minto,E.minto]],events:ED_HEV});}},
    // Ivy's page opens with the decision, then the answer, then three lines
    {at:tN,place:"edNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N2,{});}},
    // the method and the other charts move to the back; a half-full room still holds a class
    {at:tB,place:"edTeam",dis:0.6,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Hh={};
      const R=ed_atRoom(x,tt,tB,{at:"ivy",sam:null,ivy:ed_alive(tt,{expr:"think",gaze:[1,0.3]},3,tB),people:[ed_helena(tt,ed_sp(tt,5,[[c.holds+0.1,E.holds]],"listen",0.1),{x:1560,fl:930,out:Hh})]});
      ed_screenCall(x,R,ag_io(tt,c.back+0.2,c.holds-0.3,0.4),"At the back",[["the method · other charts",PK.C.ink,34],["when people came:",PK.C.ink,34],["rooms about half full",PK.C.ink,34]],PK.C.mut,{bh:300});
      ed_bub(x,Hh.J,tt,c.holds+0.1,1e9,["A half-full room","still holds a class."],cam,{lean:-160});}}
  ]);
  ed_card(ctx,S,t,0.3,c.start-0.2,{kick:"Before each meeting",title:"The University Council reads"},{y:40,mid:true});
  ed_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ed_apart(t,[[0,c.start],[tN,tB]])));
});

/* ---------------------------------------------------------------- 4. What it turns on */
scene("turns",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tR=c.right-0.4,tC=c.corridors-0.4,tN=c.daniels-0.4,tU=c.used-0.4,tB=c.tufte-0.4,tZ=c.tufte+2.0,tG=c.together-0.4,tO=c.route-0.4;
  const BB=PK.pace(ctx,"carmen",ed_boardB(sc,w)),N3=PK.pace(ctx,null,ed_note3(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the week's average, then the whole week as a heat map, its peak picked out
    {at:0,place:"edTeam",later:true,keys:[[0,960,540,1.0],[c.map,820,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const R=ed_atRoom(x,tt,0,{at:"ivy",sam:null,ivy:ed_alive(tt,{expr:"think",gaze:[1,0.3]},3,0),people:[ed_helena(tt,ed_alive(tt,{expr:"listen",gaze:[1,0.1]},5,0),{x:1560,fl:930})]});
      ed_screenCall(x,R,ag_io(tt,0.3,c.map-0.3,0.4),"Rooms booked",[],PK.C.orange,{bh:220,bars:[["the whole week · 38%",38,100,PK.C.orange]]});
      ed_heatCall(x,R,ag_io(tt,c.map+0.2,tR-0.3,0.4),ag_in(tt,w("peak","booked",-0.4),0.5));}},
    // the academics were right, at the peak
    {at:tR,place:"edCampus",dis:0.6,keys:[[tR,900,570,1.1]],d:2,draw:(x,tt,cam)=>{let Ja=null;
      Ja=PK.person(x,PK.extra(5),860,CA.near,ed_hC(CA.near),"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},ed_sp(tt,1,[[c.right+0.2,E.right]],"smile",0.1)));
      PK.person(x,PK.extra(6),1180,CA.near-20,ed_hC(CA.near-20),"clasp",Object.assign({t:tt,flip:true},ed_alive(tt,{expr:"smile",gaze:[1,0.1]},2,tR)));
      ed_bub(x,Ja,tt,c.right+0.2,tC-0.3,["Tuesdays at eleven: full."],cam,{lean:-160});}},
    // and Facilities, who saw empty rooms on Monday mornings
    {at:tC,place:"edLecture",dis:0.6,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.audience(x,tt,0,{});
      const Jg=PK.person(x,"graham",640,940,PK.hAt(940,ED_LE.eye),"clasp",Object.assign({t:tt},ed_sp(tt,1,[[c.corridors+0.3,E.corridors]],"think",0.1)));
      ed_bub(x,Jg,tt,c.corridors+0.3,tN-0.3,["Monday morning: empty."],cam,{lean:160});}},
    // one picture shows what the average hid (Ivy's notebook)
    {at:tN,place:"edNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N3,{});}},
    // booked isn't used: Ivy and Sam under a room's sensor
    {at:tU,place:"edLecture",cut:true,keys:[[tU,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      ed_room(x,tt,{plate:1,people:[
        {fl:900,draw:cc=>{PK.person(cc,"sam",760,900,PK.hAt(900,ED_LE.eye),"clasp",Object.assign({t:tt,flip:true},ed_alive(tt,{expr:"listen",gaze:[1,-0.5]},2,tU)));}},
        {fl:930,draw:cc=>{PK.person(cc,"ivy",1020,930,PK.hAt(930,ED_LE.eye),"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},ed_alive(tt,{expr:"think",gaze:[1,-0.5]},1,tU)));}}]});}},
    // Tufte and Knaflic (Carmen, at the team's board)
    {at:tB,place:"edTeam",cut:true,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{ed_lesson(x,tt,{rows:BB,clock:14,events:ED_HEV});}},
    {at:tZ,cut:true,place:"edBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.tufte,E.knaflic]],events:ED_HEV});}},
    // Ivy draws the picture as she writes the page
    {at:tG,place:"edTeam",cut:true,keys:[[tG,820,560,1.06]],d:2,draw:(x,tt,cam)=>{const Hh={};
      const R=ed_atRoom(x,tt,tG,{at:"ivy",sam:null,ivy:ed_alive(tt,{expr:"think",gaze:[1,0.3]},3,tG),people:[ed_helena(tt,ed_sp(tt,5,[[c.route+0.2,E.route]],"listen",0.1),{x:1560,fl:930,out:Hh})]});
      ed_heatCall(x,R,ag_io(tt,tG+0.4,tO-0.3,0.4),1);
      ed_bub(x,Hh.J,tt,c.route+0.2,1e9,["Anything across teams:","its route, in one picture."],cam,{lean:-160});}}
  ]);
  ed_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ed_apart(t,[[0,tR],[tN,tU],[tG,1e9]])));
});

/* ---------------------------------------------------------------- 5. What isn't known, in their words */
scene("unknown",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tF=c.forecast-0.4,tM=c.mei-0.4,tS=c.same-0.4,N4=PK.pace(ctx,null,ed_note4(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // beside the picture, what it would take not to build (Ivy's notebook)
    {at:0,place:"edTeam",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      ed_atRoom(x,tt,0,{at:"ivy",sam:null,ivy:ed_alive(tt,{expr:"think",gaze:[1,0.3]},3,0),people:[ed_helena(tt,ed_alive(tt,{expr:"listen",gaze:[1,0.1]},5,0),{x:1560,fl:930})]});}},
    {at:1.4,place:"edNotes",dis:0.6,keys:[[1.4,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N4,{});}},
    // Planning's forecast, what isn't known, and how far the answer holds
    {at:tF,place:"edTeam",cut:true,keys:[[tF,960,540,1.0],[c.unknown,820,560,1.06]],d:3,draw:(x,tt,cam)=>{const Hh={};
      const R=ed_atRoom(x,tt,tF,{at:"ivy",sam:null,ivy:ed_alive(tt,{expr:"think",gaze:[1,0.3]},3,tF),people:[ed_helena(tt,ed_alive(tt,{expr:"listen",gaze:[1,0.1]},5,tF),{x:1560,fl:930,out:Hh})]});
      ed_screenCall(x,R,ag_io(tt,c.forecast+0.2,c.unknown-0.3,0.4),"Planning · to 2030",[["six percent more students",PK.C.ink,34],["the peak still fits",PK.C.green,34]],PK.C.blue,{bh:250});
      ed_screenCall(x,R,ag_io(tt,c.unknown+0.2,tM-0.3,0.4),"Not known",[["students by 2030",PK.C.amber,34],["at twice the growth:",PK.C.ink,34],["no fuller than today",PK.C.green,34]],PK.C.amber,{bh:300});}},
    // Ivy tries it on Mei, from the registrar's office, who wasn't in the work
    {at:tM,place:"edCorner",cut:true,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=ed_corner(x,tt,{t0:tM,who1:"ivy",who2:"mei",sheets:true,hf:ed_sp(tt,1,[[c.words+0.2,E.words],[c.plan+0.2,E.plan]],"listen",0.3),
        iface:ed_sp(tt,2,[[c.says+0.6,E.says],[c.word+0.2,E.word],[c.which+0.1,E.which]],"think",0.3)});
      ed_name(x,R.who2,tt,w("mei","Mei",0),c.says-0.2,"Mei Tanaka","Registrar's office",170);
      ed_bub(x,R.who2,tt,c.word+0.2,c.words-0.2,["Utilisation?","To me, that's seats filled."],cam,{lean:-160});
      ed_bub(x,R.who1,tt,c.words+0.2,c.which-0.2,["Booked, and used:","each in a line."],cam,{lean:160});
      ed_bub(x,R.who2,tt,c.which+0.1,c.plan-0.2,["Which classes would move?"],cam,{lean:-160});
      ed_bub(x,R.who1,tt,c.plan+0.2,tS-0.3,["Your office plans it,","from 2028."],cam,{lean:160});}},
    // everyone gets the same page, with the same numbers
    {at:tS,place:"edCampus",cut:true,keys:[[tS,900,570,1.1]],d:2,draw:(x,tt,cam)=>{
      PK.person(x,PK.extra(6),1320,CA.near-110,ed_hC(CA.near-110),ED_SHOW,Object.assign({t:tt,flip:true,hold:ed_sheet,holds:true},ed_alive(tt,{expr:"think",gaze:[1,0.5]},2,tS)));
      PK.person(x,"mei",1040,CA.near-55,ed_hC(CA.near-55),ED_SHOW,Object.assign({t:tt,flip:true,hold:ed_sheet,holds:true},ed_alive(tt,{expr:"smile",gaze:[1,0.5]},3,tS)));
      PK.person(x,"graham",700,CA.near,ed_hC(CA.near),ED_SHOW,Object.assign({t:tt,hold:ed_sheet,holds:true},ed_alive(tt,{expr:"smile",gaze:[1,0.5]},1,tS)));}}
  ]);
  ed_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ed_apart(t,[[0,tF],[tM,1e9]])));
});

/* ---------------------------------------------------------------- 6. They decide */
scene("decide",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tM=c.meets-0.4,tD=c.defers-0.4,tA=c.argued-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // Graham sends the page under his own name, the week's picture beside it
    {at:0,place:"edCorner",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=ed_corner(x,tt,{t0:0,who1:"graham",laptop:true,hf:ed_alive(tt,{expr:"think",gaze:[1,0.6]},1,0),handN:[830,616],handF:[856,606]});
      PK.callout(x,1060,90,720,250,R.laptop,ag_io(tt,c.sends+0.4,tM-0.3,0.4),(cc,bx,by,bw,bh)=>ed_panel(cc,bx,by,bw,bh,"To the University Council",[["Room use: one page,",PK.C.ink,34],["and the week's picture",PK.C.ink,34]],null,PK.C.blue));}},
    // the University Council meets; its members ask how sure the growth is
    {at:tM,place:"edLecture",cut:true,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jm=null;PK.audience(x,tt,8,{look:0.6});
      Jm=PK.seated(x,PK.extra(12),300,970,PK.hAt(970,ED_LE.eye),"sit",Object.assign({t:tt},ed_sp(tt,1,[[c.asks+0.2,E.asks]],"think",-0.2)));
      PK.person(x,"graham",1500,950,PK.hAt(950,ED_LE.eye),"clasp",Object.assign({t:tt,flip:true},ed_alive(tt,{expr:"listen",gaze:[1,0.1]},2,tM)));
      ed_bub(x,Jm,tt,c.asks+0.2,tD-0.3,["How sure is the growth?"],cam,{lean:160});}},
    // they defer the building; Graham writes to Helena
    {at:tD,place:"edTeam",dis:0.6,keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const CH={title:"Graham Ellis",who:["graham"],me:"helena",msgs:[{who:"graham",s:"Deferred two years. Timetable change from 2028.",at:c.defers+1.0,type:1.6}]},cs=PK.chatSize(x,CH,{size:28});
      let Jh=null;ed_team(x,tt,{clock:16,marta:null,sam:null,jun:Object.assign({work:1},ed_alive(tt,{},2,tD)),people:[{fl:930,draw:cc=>{
        Jh=PK.person(cc,"helena",1560,930,ed_hT(930),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone?PK.inHand.phone({back:true}):null,holds:true},PK.face(tt,{expr:"think",gaze:[1,0.9]},[[c.defers+3.0,"smile",2.0]])));}}]});
      if(Jh)PK.callout(x,560,160,cs.w,cs.h,[Jh.hdN[0]-20,Jh.hdN[1]-30],ag_io(tt,tD+0.3,tA-0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}},
    // afterwards, in person: the meeting argued about the choice, not the numbers
    {at:tA,place:"edCorner",cut:true,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=ed_corner(x,tt,{t0:tA,who1:"graham",who2:"helena",sheets:true,hf:ed_sp(tt,1,[[c.argued+0.3,E.argued]],"smile",0.3),iface:ed_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tA)});
      ed_bub(x,R.who1,tt,c.argued+0.3,c.see-0.2,["We argued about the choice,","not about the numbers."],cam,{lean:160});}}
  ]);
  ed_card(ctx,S,t,tM+0.3,c.asks-0.2,{kick:"Thursday 24 June",title:"The University Council meets"},{y:40,mid:true});
  ed_card(ctx,S,t,c.defers+0.2,c.argued-0.6,{kick:"Deferred two years",title:"The timetable changes from 2028"},{y:40,mid:true});
  ed_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ed_apart(t,[[tM,c.argued]])));
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tI=c.ivy-0.4,tN=c.one-0.1,tL=c.take-0.4,tE=c.breath+0.6,N5=PK.pace(ctx,"helena",ed_boardM(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Daniels didn't design a cockpit: he counted, and said plainly what the count meant
    {at:0,place:"edpOffice",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const fl=960,h=edp_h(fl);
      edp_desk(x,"daniels",1400,fl,Object.assign({t:tt,flip:true,work:0,on:(cc,D)=>{edp_typewriter(cc,D.x0-0.24*h,D.top,1.0,1);edp_cards(cc,D.x0-0.58*h,D.top,1.1);}},ed_alive(tt,{expr:"smile",gaze:[1,0.2]},1,0)));}},
    // Ivy's page did the same
    {at:tI,place:"edTeam",dis:0.8,keys:[[tI,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=ed_atRoom(x,tt,tI,{at:"ivy",ivy:ed_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tI)});
      ed_screenCall(x,R,ag_io(tt,tI+0.5,tN-0.3,0.4),"The page · 1 June",[["the decision first",PK.C.blue,34],["the peak beside the average",PK.C.orange,34],["the choice left to them",PK.C.green,34]],PK.C.blue,{bh:300});}},
    {at:tN,place:"edBoard",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,N5,{say:[],events:ED_HEV});}},
    // lead with the decision; show what it turns on
    {at:tL,place:"edTeam",cut:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      ed_atRoom(x,tt,tL,{at:"ivy",ivy:ed_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tL),people:[ed_helena(tt,ed_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tL),{x:1560,fl:930})]});}}
  ]);
  ed_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6)));
  PK.end(ctx,S,t,tE,"Explaining so people can decide",ED_LAST,"Film 2 of 3","Working with people",{side:"right"});
});
ag_cutInto(["page","first","turns","unknown","decide","monday"]);
