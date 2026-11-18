/* ===== One small change at a time: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are written by hand: the director's board for five S, Carmen Vidal's and Helena's boards, and the ward sister's, Ivy's and
   Helena's notebooks (kz_uni.js). The hospital, 2000 to 2007, is in kzp_hospital.js. Every time comes from the voice: a line's start
   (sc.cues) or a word in it (wAt). */
const kz_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,2,"One small change at a time",a);}};
function kz_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const kz_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const kz_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const kz_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const kz_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const kz_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const kz_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const kz_sp=(tt,i,spans,base,g)=>kz_alive(tt,{expr:kz_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const KZ_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const KZ_LAST="Change one small thing, check it, keep what works.";
// a screen's callout from the monitor at the desk by the window
const kz_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>kz_panel(cc,bx,by,bw,bh,head,rows,o.bars||null,hc));};
// the team's room with someone at the desk by the window (o.at, default Helena); o.face: their face; o.noor: Noor at Sam's desk
const kz_atRoom=(x,tt,t0,o)=>{o=o||{};return kz_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:o.at||"helena",marta:o.at===null?null:Object.assign({work:o.work==null?1:o.work,turn:0},o.face||kz_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
  samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},o.sam||kz_alive(tt,{},1,t0)),jun:o.jun===null?null:Object.assign({work:1},o.jun||kz_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people:o.people||[]});};
// Helena standing in the team's room, her notebook under her arm (fl, x: where)
const kz_helena=(tt,face,o)=>({fl:(o&&o.fl)||930,draw:cc=>{o=o||{};const J=PK.person(cc,"helena",o.x||1560,o.fl||930,kz_hT(o.fl||930),"clasp",Object.assign({t:tt+4,flip:o.flip!==false,underF:PK.inHand.notebook({}),holds:true},face));if(o.out)o.out.J=J;}});
// Helena on her phone in the team's room, a chat in a callout from it
const kz_phone=(x,tt,t0,t1,CH,face,o)=>{o=o||{};let Jh=null;const cs=PK.chatSize(x,CH,{size:28});
  kz_team(x,tt,{clock:o.clock==null?16:o.clock,marta:null,samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},kz_alive(tt,{},1,t0)),jun:Object.assign({work:1},kz_alive(tt,{},2,t0)),people:[{fl:930,draw:cc=>{
    Jh=PK.person(cc,"helena",1560,930,kz_hT(930),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone?PK.inHand.phone({back:true}):null,holds:true},face));}}]});
  if(Jh)PK.callout(x,o.bx==null?560:o.bx,o.by==null?160:o.by,cs.w,cs.h,[Jh.hdN[0]-20,Jh.hdN[1]-30],ag_io(tt,t0+0.3,t1,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));
  return Jh;};
// a desk in the story's rooms with a laptop on it; o.out.D: the desk, for a callout's tail
const kz_lap=(cc,who,x,fl,face,o)=>{o=o||{};return kzp_desk(cc,who,x,fl,Object.assign({t:0,work:o.work==null?1:o.work,flip:!!o.flip,on:(c2,D)=>{kzp_laptop(c2,D,o.flip);if(o.out)o.out.D=D;}},face));};
const kz_tip=D=>D?[D.x0+D.dir*0.45*D.w,D.top-70]:[960,600];

// a person who holds a sheet up to show it (who: a row of the story's people or a CAST name)
const kz_shows=(x,who,px,fl,tt,face,o)=>kzp_person(x,who,px,fl,PK.poseMix("clasp",KZ_SHOW,1),Object.assign({t:tt,hold:kz_sheet,holds:true,flip:!!(o&&o.flip)},face));
// Ivy standing in the team's room (x, fl: where; o.out.J: her joints)
const kz_stand=(who,tt,face,o)=>{o=o||{};const fl=o.fl||930;return{fl,draw:cc=>{const q=Object.assign({t:tt,flip:o.flip!==false},o.book?{underF:PK.inHand.notebook({}),holds:true}:{},face);const J=PK.person(cc,who,o.x||1560,fl,kz_hT(fl),"clasp",q);if(o.out)o.out.J=J;}};};

// the people at the product's review, seated (PK.audience's seats and order), each with a look, a nod or a smile now and then
function kz_audience(x,tt,n,look){const seats=PK.seats({}),order=[5,1,9,6,2,8,0,10,4,7,3],taken={};order.slice(0,n).forEach((s,i)=>taken[s]=i);
  seats.forEach((s,i)=>{const ch=PK.PAL[i%2?"chair2":"chair"];if(taken[i]==null){PK.S.begin(x,{lw:PK.u.clamp(s.h*0.0056,1.4,6.5),sh:4});PK.chair(x,s.x-0.012*s.h,s.fl,s.h,false,{col:ch});return;}
    PK.seated(x,PK.extra(i+3),s.x,s.fl,s.h,PK.poseMix("sit","sitBack",(i*0.37)%1),Object.assign({t:tt+i*1.7,chair:ch,shade:0},kz_alive(tt,{expr:"listen",gaze:[1,-look]},(i*3)%7*0.7)));});}

/* ---------------------------------------------------------------- 1. Ward by ward */
scene("wards",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tM=c.money-0.4,tF=c.fives-0.4,tK=c.cheap-0.4,tN=c.kaizen-0.4,tS=c.spread-0.4,tA=c.africa-0.4,tD=c.data-0.4;
  const BO=PK.pace(ctx,KZP_FOLK.director,kz_boardO(sc,w)),N1=PK.pace(ctx,null,kz_note1(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // 2000: a ward of the Castle Street Hospital for Women, and its director
    {at:0,place:"kzpWard",keys:[[0,960,540,1.0],[tM-0.2,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{let Jd=null,Jn=null;
      kzp_person(x,"orderly",360,880,"clasp",Object.assign({t:tt},kz_alive(tt,{expr:"neutral",gaze:[1,0.2]},4,0)));
      Jn=kzp_person(x,"nurse",760,920,"clasp",Object.assign({t:tt},kz_sp(tt,1,[[c.means+0.3,E.means]],"worry",0.3)));
      kzp_person(x,"mother",1140,990,"clasp",Object.assign({t:tt,flip:true},kz_alive(tt,{expr:"neutral",gaze:[1,0.2]},2,0)));
      Jd=kzp_person(x,"director",1560,950,"clasp",Object.assign({t:tt,flip:true},kz_alive(tt,{expr:"think",gaze:[1,0.2]},3,0)));
      kz_name(x,Jd,tt,w("where","Wimal",-0.2),c.infect-0.2,"Dr Wimal Karandagoda","Director",170);
      kz_bub(x,Jn,tt,c.means+0.3,tM-0.4,["Another fever","this week."],cam,{lean:160});}},
    // no money for a fix: the director, in his office
    {at:tM,place:"kzpOffice",cut:true,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jd=null;
      kzp_person(x,"sister",1460,960,"clasp",Object.assign({t:tt,flip:true},kz_alive(tt,{expr:"listen",gaze:[1,0.2]},2,tM)));
      Jd=kzp_person(x,"director",900,920,"clasp",Object.assign({t:tt},kz_sp(tt,1,[[c.change+0.2,E.change]],"think",0.2)));
      kz_bub(x,Jd,tt,c.change+0.2,tF-0.3,["We get cleaner","with what we have."],cam,{lean:160});}},
    // five steps, called 5S, at the office's board
    {at:tF,place:"kzpOffice",later:true,keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      kzp_person(x,"sister",1460,960,"clasp",Object.assign({t:tt,flip:true},kz_alive(tt,{expr:"listen",gaze:[1,-0.1]},2,tF)));
      PK.teach(x,KZP_FOLK.director,tt,BO,{x:KZP_BD.x,y:KZP_BD.y,k:KZP_BD.k,deco:true,floor:KZP_BD.floor,rest:KZP_BD.rest,h:kzp_h(KZP_BD.floor),say:[],events:KZ_HEV});}},
    // the staff of each ward do it themselves: the store room, sorted and labelled
    {at:tK,place:"kzpStore",dis:0.8,keys:[[tK,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      kzp_store(x,PK.u.clamp((tt-c.cheap-0.6)/Math.max(1,E.own-c.cheap-1.2),0,1));
      kzp_person(x,"orderly",1500,930,"clasp",Object.assign({t:tt,flip:true},kz_alive(tt,{expr:"smile",gaze:[1,0.3]},4,tK)));
      kzp_person(x,"nurse",760,990,PK.poseMix("clasp",KZ_CARRY,1),Object.assign({t:tt,hold:kz_sheet,holds:true},kz_alive(tt,{expr:"think",gaze:[1,0.4]},1,tK)));}},
    // kaizen (the ward sister's notebook)
    {at:tN,place:"kzNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,KZP_FOLK.sister,tt,N1,{});}},
    // ward by ward it spreads, and infections fall by half
    {at:tS,place:"kzpWard",dis:0.6,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Js=null;
      kzp_person(x,"nurse",360,990,"clasp",Object.assign({t:tt},kz_alive(tt,{expr:"listen",gaze:[1,0.2]},1,tS)));
      Js=kz_shows(x,"sister",1420,940,tt,kz_sp(tt,2,[[c.fall+0.3,E.fall]],"smile",0.2),{flip:true});
      PK.callout(x,560,80,700,200,Js?[Js.hdN[0]-30,Js.hdN[1]-60]:[1340,560],ag_io(tt,c.fall+0.4,tA-0.3,0.4),(cc,bx,by,bw,bh)=>kz_panel(cc,bx,by,bw,bh,"Infections, two years",[["after a Caesarean · half",PK.C.green,32],["newborn babies · more than half",PK.C.green,32]],null,PK.C.green));}},
    // from 2007, to public hospitals in fifteen African countries
    {at:tA,place:"kzpWard",later:true,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      kzp_person(x,"nurse3",620,930,"clasp",Object.assign({t:tt},kz_alive(tt,{expr:"smile",gaze:[1,0.2]},3,tA)));
      kzp_person(x,"nurse2",1300,980,"clasp",Object.assign({t:tt,flip:true},kz_alive(tt,{expr:"listen",gaze:[1,0.2]},1,tA)));}},
    // a data team's weekly chores, done by hand
    {at:tD,place:"kzTeam",dis:1.0,keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=kz_atRoom(x,tt,tD,{at:"ivy",face:kz_alive(tt,{expr:"think",gaze:[1,0.3]},3,tD),noor:true});
      kz_screenCall(x,R,ag_io(tt,w("data","weekly chores",-0.3),c.breath-0.3,0.4),"Monday's refresh",[["checked by hand",PK.C.amber,34],["two hours, every week",PK.C.amber,34]],PK.C.orange,{bh:230});}}
  ]);
  kz_card(ctx,S,t,0.4,w("where","Wimal",-0.4),{kick:"Colombo, 2000",title:"Castle Street Hospital"},{y:40,mid:true});
  kz_card(ctx,S,t,tA+0.3,c.blame-0.2,{kick:"From 2007",title:"Fifteen African countries"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"One small change at a time","Change one small thing, check it, keep what works","Leading data people · Leading a data team",{side:"right",size:52});
});

/* ---------------------------------------------------------------- 2. Two hours every Monday */
scene("hours",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tJ=c.job-0.4,tT=c.talk-0.4,tI=c.idea-0.4,BA=PK.pace(ctx,"carmen",kz_boardA(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Ivy owns Teaching space use, refreshed every Monday by seven
    {at:0,place:"kzTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=kz_atRoom(x,tt,0,{at:"ivy",noor:true,face:kz_alive(tt,{expr:ag_in(tt,c.risk,0.5)>0.5?"worry":"think",gaze:[1,0.4]},3,0)});
      kz_screenCall(x,R,ag_io(tt,w("own","Teaching space use",0),tJ-0.3,0.4),"Teaching space use",[["owner · Ivy Reyes",PK.C.ink,34],[ag_in(tt,c.promise,0.4)>0.5?"refreshed Mondays by 7:00":"",PK.C.blue,34]],PK.C.orange,{bh:240});
      kz_screenCall(x,R,ag_io(tt,c.job+0.3,tT-0.3,0.4),"Monday",[["6:00 · the job loads it",PK.C.orange,34],[ag_in(tt,c.hand,0.4)>0.5?"8:30 · two hours by hand":"",PK.C.amber,34],[ag_in(tt,c.risk,0.4)>0.5?"till then, maybe wrong":"",PK.C.amber,34]],PK.C.orange,{bh:290});}},
    // Tuesday 20 July: Ivy's mid-year conversation, at Helena's corner
    {at:tT,place:"kzCorner",cut:true,keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const r=kz_corner(x,tt,{who2:"ivy",lean:0.4,t0:tT,he:kz_talk("smile",tt,[[c.talk+0.3,E.talk],[c.way,w("way","My Monday",-0.2)],[c.time+0.2,E.time]]),ie:kz_talk("think",tt,[[c.wants+0.2,E.wants],[w("way","My Monday",0),E.way]])});
      kz_bub(x,r.helena,tt,w("talk","asks",0),c.wants,["What do you","want next?"],cam,{lean:160});
      kz_bub(x,r.who2,tt,c.wants+0.2,c.way,["Make my Monday better,","and teach what I learn."],cam,{lean:-160});
      kz_bub(x,r.helena,tt,c.way+0.1,w("way","My Monday",-0.1),["What's in the way?"],cam,{lean:160});
      kz_bub(x,r.who2,tt,w("way","My Monday",0),c.time,["My Monday mornings."],cam,{lean:-160});
      kz_bub(x,r.helena,tt,c.time+0.2,tI-0.3,["Use your Thursday","learning time."],cam,{lean:160});}},
    // kaizen's first idea (Carmen, at the team's board)
    {at:tI,place:"kzTeam",cut:true,keys:[[tI,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=kz_lesson(x,tt,{rows:BA,side:"ivy",jun:Object.assign({work:1,pose:undefined},kz_alive(tt,{},2,tI)),clock:15,events:KZ_HEV});
      kz_name(x,R.at,tt,tI+0.4,w("idea","everyone's job",-0.2),"Carmen Vidal","Consultant",160);}}
  ]);
  kz_card(ctx,S,t,0.3,w("own","Teaching space use",-0.2),{kick:"Thursday 1 July 2027",title:"Ivy's product"},{y:40,mid:true});
  kz_card(ctx,S,t,tT+0.3,w("talk","asks",-0.4),{kick:"Tuesday 20 July",title:"A mid-year conversation"},{y:40,mid:true});
  kz_imagined(ctx,S,t,0.4,w("own","Teaching space use",-0.2),"The university, 2027 · imagined");
  kz_kick(ctx,S,ag_in(t,0.6,0.6)*(1-kz_apart(t,[[0,w("own","Teaching space use",0)],[tT,c.wants]])));
});

/* ---------------------------------------------------------------- 3. Measure, then simplify */
scene("measure",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tS=c.shew-0.4,tM=c.measure-0.4,tR=c.rooms-0.4,tC=c.copy-0.4,BB=PK.pace(ctx,"carmen",kz_boardB(sc,w)),N2=PK.pace(ctx,null,kz_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // one cycle for every small step (Carmen's board, close)
    {at:0,place:"kzBoard",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.cycle,E.cycle]],events:KZ_HEV});}},
    // where the cycle comes from (Ivy's notebook)
    {at:tS,place:"kzNotes",dis:0.6,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N2,{});}},
    // Monday 26 July: Ivy times each step
    {at:tM,place:"kzTeam",dis:0.6,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=kz_atRoom(x,tt,tM,{at:"ivy",noor:true,face:kz_alive(tt,{expr:"think",gaze:[1,0.5]},3,tM)});
      kz_screenCall(x,R,ag_io(tt,w("measure","times",0),tR-0.3,0.4),"My Monday, timed",[["six steps",PK.C.ink,34],["120 minutes",PK.C.amber,34],[ag_in(tt,c.back,0.4)>0.5?"who needs each one?":"",PK.C.blue,34]],PK.C.orange,{bh:290});}},
    // fourteen rooms checked by hand, and Jun's test that checks them too
    {at:tR,place:"kzTeam",later:true,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Ij={};
      const R=kz_atRoom(x,tt,tR,{at:null,noor:true,jun:Object.assign({work:1},kz_sp(tt,2,[[c.test+0.2,E.test]],"smile",0.3)),people:[kz_stand("ivy",tt,kz_alive(tt,{expr:"think",gaze:[1,0.3]},3,tR),{x:1000,fl:960,flip:false,out:Ij})]});
      kz_bub(x,R.jun,tt,c.test+0.2,c.try-0.2,["My test checks","the same fourteen."],cam,{lean:-200});
      kz_bub(x,Ij.J,tt,w("try","covers",0),tC-0.3,["All fourteen.","I'll keep that."],cam,{lean:-160});}},
    // the copy for Facilities: Ivy asks, and drops it
    {at:tC,place:"kzTeam",later:true,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=kz_atRoom(x,tt,tC,{at:"ivy",sam:null,face:kz_alive(tt,{expr:"think",gaze:[1,0.6]},3,tC)});const D=R&&R.marta&&R.marta.desk;
      const CH={title:"Facilities",who:["graham"],me:"ivy",msgs:[{who:"ivy",s:"Do you still use the copy I send?",at:c.copy+1.6,type:1.4},{who:"graham",s:"No, we read the page now.",at:w("copy","drops",-1.6),type:1.2}]},cs=PK.chatSize(x,CH,{size:28});
      PK.callout(x,720,110,cs.w,cs.h,D?[150,D.top-120]:[150,620],ag_io(tt,tC+0.4,c.ninety-0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));
      kz_screenCall(x,R,ag_in(tt,c.ninety+0.2,0.4),"Two steps gone",[["90 minutes back",PK.C.green,36]],PK.C.green,{bh:200});}}
  ]);
  kz_card(ctx,S,t,tM+0.3,w("measure","times",-0.3),{kick:"Monday 26 July",title:"Each step, timed"},{y:40,mid:true});
  kz_kick(ctx,S,ag_in(t,0.6,0.6)*(1-kz_apart(t,[[tS,tM],[tM,w("measure","times",0)]])));
});

/* ---------------------------------------------------------------- 4. Standardise, then automate */
scene("automate",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tJ=c.jun-0.4,tU=c.muddle-0.4,tZ=c.muddle+1.8,tP=c.sept-0.4,tV=c.review-0.4,tO=c.stop-0.4;
  const N3=PK.pace(ctx,null,kz_note3(sc,w)),BC=PK.pace(ctx,"carmen",kz_boardC(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // one checklist (Ivy's notebook)
    {at:0,place:"kzNotes",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N3,{});}},
    // Jun follows it one Monday: the same result in the same time
    {at:tJ,place:"kzTeam",dis:0.6,keys:[[tJ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Ij={};
      const R=kz_atRoom(x,tt,tJ,{at:"jun",jun:null,noor:true,face:kz_sp(tt,3,[[w("jun","same result",0),E.jun]],"think",0.5),people:[kz_stand("ivy",tt,kz_alive(tt,{expr:"smile",gaze:[1,0.2]},4,tJ),{x:1000,fl:960,flip:true,book:true,out:Ij})]});
      kz_screenCall(x,R,ag_io(tt,c.jun+0.4,tU-0.3,0.4),"Ivy's checklist",[["four steps, in order",PK.C.blue,34]],PK.C.blue,{bx:1160,bw:680,bh:200});
      kz_bub(x,R.marta,tt,w("jun","same result",0),tU-0.3,["Same result,","same time."],cam,{lean:200});}},
    // automate a muddle, and you get a faster muddle (Carmen)
    {at:tU,place:"kzTeam",later:true,keys:[[tU,960,540,1.0]],d:2,draw:(x,tt,cam)=>{kz_lesson(x,tt,{rows:BC,side:"ivy",jun:Object.assign({work:1,pose:undefined},kz_alive(tt,{},2,tU)),clock:11,events:KZ_HEV});}},
    {at:tZ,cut:true,place:"kzBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.muddle,E.muddle]],events:KZ_HEV});}},
    // September, Thursday afternoons: one step a week into the job
    {at:tP,place:"kzCorner",dis:0.6,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const r=kz_corner(x,tt,{who1:"ivy",laptop:true,t0:tP,he:"think",hg:[1,0.5]});
      PK.callout(x,980,100,760,230,r.laptop||[810,700],ag_io(tt,c.sept+2.0,tV-0.3,0.4),(cc,bx,by,bw,bh)=>kz_panel(cc,bx,by,bw,bh,"Thursday",[["one step a week,",PK.C.ink,34],["a check in the job",PK.C.orange,34]],null,PK.C.blue));}},
    // Sam reviews each change; each new check runs beside Ivy's own
    {at:tV,place:"kzTeam",dis:0.6,keys:[[tV,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=kz_atRoom(x,tt,tV,{at:"sam",sam:null,noor:true,face:kz_alive(tt,{expr:"think",gaze:[1,0.5]},1,tV)});
      kz_screenCall(x,R,ag_io(tt,c.review+0.4,tO-0.3,0.4),"A new check",[["reviewed by Sam",PK.C.green,34],[ag_in(tt,w("review","runs beside",0),0.4)>0.5?"runs beside Ivy's for a Monday":"",PK.C.blue,32]],PK.C.orange,{bh:240});}},
    // now the job checks before it publishes; by October, ten minutes, checked
    {at:tO,place:"kzTeam",later:true,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=kz_atRoom(x,tt,tO,{at:"ivy",noor:true,face:kz_alive(tt,{expr:ag_in(tt,c.ten,0.4)>0.5?"smile":"think",gaze:[1,0.4]},3,tO)});
      kz_screenCall(x,R,ag_io(tt,c.stop+0.4,c.ten-0.5,0.4),"The job, Monday 6:00",[["checks the data first",PK.C.blue,32],[ag_in(tt,w("stop","If a check fails",0),0.4)>0.5?"a check fails: last week stays":"",PK.C.amber,32],[ag_in(tt,w("stop","Ivy is told",0),0.4)>0.5?"and Ivy is told":"",PK.C.ink,32]],PK.C.orange,{bh:280});
      kz_screenCall(x,R,ag_in(tt,c.ten+1.8,0.4),"Monday's refresh",[["10 minutes, checked",PK.C.green,36],[ag_in(tt,c.safe,0.4)>0.5?"no wrong number on the page":"",PK.C.green,32]],PK.C.green,{bh:240});}}
  ]);
  kz_card(ctx,S,t,tP+0.3,c.sept+1.6,{kick:"September",title:"Thursday afternoons"},{y:40,mid:true});
  kz_card(ctx,S,t,c.ten-0.2,c.ten+1.4,{kick:"October",title:"Ten minutes, checked"},{y:40,mid:true});
  kz_kick(ctx,S,ag_in(t,0.6,0.6)*(1-kz_apart(t,[[0,tJ],[tP,c.sept+1.6],[c.ten-0.2,c.ten+1.4]])));
});

/* ---------------------------------------------------------------- 5. The leader's part */
scene("leader",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),LE=PK.ROOMS.lecture;
  const tW=c.show-0.4,tN=c.no-0.4,tH=c.habit-0.4,N4=PK.pace(ctx,null,kz_note4(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Helena's part (her notebook)
    {at:0,place:"kzNotes",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}},
    // Thursday 7 October: Ivy's chart, at the product's review
    {at:tW,place:"kzLecture",dis:0.6,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jh=null;kz_audience(x,tt,6,0.6);
      Jh=PK.person(x,"helena",1500,950,PK.hAt(950,LE.eye),PK.poseMix("clasp",KZ_SHOW,1),Object.assign({t:tt,flip:true,hold:kz_sheet,holds:true},kz_sp(tt,1,[[c.named+0.2,E.named]],"smile",0.1)));
      PK.callout(x,520,110,640,240,Jh?[Jh.hdN[0]-30,Jh.hdN[1]-60]:[1420,560],ag_io(tt,c.show+2.0,c.named-0.2,0.4),(cc,bx,by,bw,bh)=>kz_panel(cc,bx,by,bw,bh,"Ivy's Monday",[["was 120 minutes",PK.C.amber,34],["now 10, checked",PK.C.green,34]],null,PK.C.green));
      kz_bub(x,Jh,tt,c.named+0.2,tN-0.3,["Ivy, Jun and Sam","did this."],cam,{lean:-180});}},
    // questions, time and a chart; and from September, the Friday half-hour
    {at:tN,place:"kzTeam",cut:true,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      kz_atRoom(x,tt,tN,{at:"ivy",noor:true,face:kz_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tN),people:[kz_helena(tt,kz_alive(tt,{expr:"smile",gaze:[1,0.1]},5,tN),{x:1560,fl:930})]});}},
    {at:tH,place:"kzTeam",later:true,keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      kz_team(x,tt,{clock:16,sam:null,jun:null,marta:null,people:[
        {fl:850,draw:cc=>{PK.person(cc,"ivy",1440,850,kz_hT(850),"clasp",Object.assign({t:tt,flip:true},kz_alive(tt,{expr:"smile",gaze:[1,0.1]},3,tH)));}},
        {fl:900,draw:cc=>{PK.person(cc,"helena",900,900,kz_hT(900),"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},kz_alive(tt,{expr:"smile",gaze:[1,0.1]},1,tH)));}},
        {fl:960,draw:cc=>{PK.person(cc,"noor",360,960,kz_hT(960),"clasp",Object.assign({t:tt},kz_alive(tt,{expr:"listen",gaze:[1,0.1]},4,tH)));}},
        {fl:925,draw:cc=>{PK.person(cc,"sam",1220,925,kz_hT(925),"clasp",Object.assign({t:tt,flip:true},kz_alive(tt,{expr:"smile",gaze:[1,0.1]},2,tH)));}},
        {fl:1000,draw:cc=>{PK.person(cc,"jun",640,1000,kz_hT(1000),"clasp",Object.assign({t:tt},kz_alive(tt,{expr:"listen",gaze:[1,0.1]},5,tH)));}}]});}}
  ]);
  kz_card(ctx,S,t,tW+0.3,c.show+1.6,{kick:"Thursday 7 October",title:"The product's review"},{y:40,mid:true});
  kz_card(ctx,S,t,tH+0.3,c.others-0.2,{kick:"From Friday 3 September",title:"One change a week"},{y:40,mid:true});
  kz_kick(ctx,S,ag_in(t,0.6,0.6)*(1-kz_apart(t,[[tW,c.show+1.6],[tH,c.others-0.2]])));
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tI=c.ivy-0.4,tN=c.one-0.1,tL=c.take-0.4,tE=c.breath+0.6,BM=PK.pace(ctx,"helena",kz_boardM(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // at Castle Street, the staff changed their own wards
    {at:0,place:"kzpWard",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      kzp_person(x,"nurse",700,930,"clasp",Object.assign({t:tt},kz_alive(tt,{expr:"smile",gaze:[1,0.2]},1,0)));
      kzp_person(x,"sister",1400,980,"clasp",Object.assign({t:tt,flip:true},kz_alive(tt,{expr:"smile",gaze:[1,0.2]},2,0)));}},
    // Ivy did the same with her Monday
    {at:tI,place:"kzTeam",dis:0.8,keys:[[tI,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=kz_atRoom(x,tt,tI,{at:"ivy",noor:true,face:kz_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tI)});
      kz_screenCall(x,R,ag_io(tt,c.ivy+0.4,tN-0.3,0.4),"Monday's refresh",[["10 minutes, checked",PK.C.green,36]],PK.C.green,{bh:200});}},
    {at:tN,place:"kzBoard",cut:true,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BM,{say:[],events:KZ_HEV});}},
    // change one small thing, check it, keep what works
    {at:tL,place:"kzTeam",cut:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      kz_atRoom(x,tt,tL,{at:"ivy",noor:true,face:kz_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tL),people:[kz_helena(tt,kz_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tL),{x:1560,fl:930})]});}}
  ]);
  kz_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6)));
  PK.end(ctx,S,t,tE,"One small change at a time",KZ_LAST,"Film 2 of 4","Leading a data team",{side:"right"});
});
ag_cutInto(["hours","measure","automate","leader","monday"]);
