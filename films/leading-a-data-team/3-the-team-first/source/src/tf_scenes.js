/* ===== The team comes first: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are written by hand: Carmen Vidal's and Helena's boards, and the notebooks of a stokvel's member, Helena and Ivy (tf_uni.js).
   Johannesburg in the 1930s, and today, is in tfp_joburg.js. Every time comes from the voice: a line's start (sc.cues) or a word in it
   (wAt). */
const tf_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,3,"The team comes first",a);}};
function tf_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const tf_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const tf_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const tf_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const tf_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const tf_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const tf_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const tf_sp=(tt,i,spans,base,g)=>tf_alive(tt,{expr:tf_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const TF_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const TF_LAST="Nobody alone, nobody the only one who knows.";
// a screen's callout from the monitor at the desk by the window
const tf_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>tf_panel(cc,bx,by,bw,bh,head,rows,o.bars||null,hc));};
// the team's room with someone at the desk by the window (o.at, default Helena); o.face: their face; o.noor: Noor at Sam's desk
const tf_atRoom=(x,tt,t0,o)=>{o=o||{};return tf_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:o.at||"helena",marta:o.at===null?null:Object.assign({work:o.work==null?1:o.work,turn:0},o.face||tf_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
  samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},o.sam||tf_alive(tt,{},1,t0)),jun:o.jun===null?null:Object.assign({work:1},o.jun||tf_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people:o.people||[]});};
// Helena standing in the team's room, her notebook under her arm (fl, x: where)
const tf_helena=(tt,face,o)=>({fl:(o&&o.fl)||930,draw:cc=>{o=o||{};const J=PK.person(cc,"helena",o.x||1560,o.fl||930,tf_hT(o.fl||930),"clasp",Object.assign({t:tt+4,flip:o.flip!==false,underF:PK.inHand.notebook({}),holds:true},face));if(o.out)o.out.J=J;}});
// Helena on her phone in the team's room, a chat in a callout from it
const tf_phone=(x,tt,t0,t1,CH,face,o)=>{o=o||{};let Jh=null;const cs=PK.chatSize(x,CH,{size:28});
  tf_team(x,tt,{clock:o.clock==null?16:o.clock,marta:null,samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},tf_alive(tt,{},1,t0)),jun:Object.assign({work:1},tf_alive(tt,{},2,t0)),people:[{fl:930,draw:cc=>{
    Jh=PK.person(cc,"helena",1560,930,tf_hT(930),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone?PK.inHand.phone({back:true}):null,holds:true},face));}}]});
  if(Jh)PK.callout(x,o.bx==null?560:o.bx,o.by==null?160:o.by,cs.w,cs.h,[Jh.hdN[0]-20,Jh.hdN[1]-30],ag_io(tt,t0+0.3,t1,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));
  return Jh;};

// a person who holds a sheet up to show it (who: a row of the story's people or a CAST name)
const tf_shows=(x,who,px,fl,tt,face,o)=>tfp_person(x,who,px,fl,PK.poseMix("clasp",TF_SHOW,1),Object.assign({t:tt,hold:tf_sheet,holds:true,flip:!!(o&&o.flip)},face));
// Ivy standing in the team's room (x, fl: where; o.out.J: her joints)
const tf_stand=(who,tt,face,o)=>{o=o||{};const fl=o.fl||930;return{fl,draw:cc=>{const q=Object.assign({t:tt,flip:o.flip!==false},o.book?{underF:PK.inHand.notebook({}),holds:true}:{},face);const J=PK.person(cc,who,o.x||1560,fl,tf_hT(fl),"clasp",q);if(o.out)o.out.J=J;}};};

// the people at the product's review, seated (PK.audience's seats and order), each with a look, a nod or a smile now and then
function tf_audience(x,tt,n,look){const seats=PK.seats({}),order=[5,1,9,6,2,8,0,10,4,7,3],taken={};order.slice(0,n).forEach((s,i)=>taken[s]=i);
  seats.forEach((s,i)=>{const ch=PK.PAL[i%2?"chair2":"chair"];if(taken[i]==null){PK.S.begin(x,{lw:PK.u.clamp(s.h*0.0056,1.4,6.5),sh:4});PK.chair(x,s.x-0.012*s.h,s.fl,s.h,false,{col:ch});return;}
    PK.seated(x,PK.extra(i+3),s.x,s.fl,s.h,PK.poseMix("sit","sitBack",(i*0.37)%1),Object.assign({t:tt+i*1.7,chair:ch,shade:0},tf_alive(tt,{expr:"listen",gaze:[1,-look]},(i*3)%7*0.7)));});}


/* ---------------------------------------------------------------- 1. Through other people */
scene("stokvel",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tG=c.group-0.4,tB=c.banks-0.4,tC=c.change-0.4,tR=c.rules-0.4,tA=c.answer-0.4,tY=c.burial-0.4,tU=c.ubuntu-0.4,tD=c.decades-0.4,tT=c.team-0.4;
  const N1=PK.pace(ctx,null,tf_note1(sc,w)),N2=PK.pace(ctx,null,tf_note2(sc,w)),HC=c.carry;
  ag_shots(ctx,S,t,sc.dur,[
    // the 1930s: a yard of rooms near the city, the women at their work
    {at:0,place:"tfpYard",keys:[[0,960,540,1.0],[tG-0.2,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{
      tfp_person(x,"m3",1640,880,"clasp",Object.assign({t:tt,flip:true},tf_alive(tt,{expr:"neutral",gaze:[1,0.3]},3,0)));
      tf_shows(x,"m2",420,940,tt,tf_alive(tt,{expr:"think",gaze:[1,0.3]},2,0));
      tfp_person(x,"m1",1040,1000,PK.poseMix("clasp",TF_CARRY,1),Object.assign({t:tt,flip:true,hold:tf_sheet,holds:true},tf_alive(tt,{expr:"neutral",gaze:[1,0.2]},1,0)));}},
    // eight or ten who trust each other: a stokvel, and its pot
    {at:tG,place:"tfpMeet",cut:true,keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jt=null;
      tfp_person(x,"m3",300,890,"clasp",Object.assign({t:tt},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},3,tG)));
      tfp_table(x,"m4",760,930,Object.assign({t:tt,work:0},tf_alive(tt,{expr:"listen",gaze:[1,0.2]},4,tG)));
      Jt=tfp_table(x,"m2",1260,960,Object.assign({t:tt,flip:true,work:0,pot:true},tf_sp(tt,2,[[c.turn+0.3,E.turn]],"smile",0.2)));
      tfp_person(x,"m5",1640,1000,"clasp",Object.assign({t:tt,flip:true},tf_alive(tt,{expr:"listen",gaze:[1,0.2]},5,tG)));
      tf_bub(x,Jt,tt,w("turn","takes it all",-0.2),tB-0.3,["This month,","the pot is yours."],cam,{lean:-160});}},
    // the banks: no account, no loan
    {at:tB,place:"tfpBank",dis:0.8,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tfp_person(x,"clerk",1460,880,"clasp",Object.assign({t:tt,flip:true},tf_alive(tt,{expr:"neutral",gaze:[1,0.2]},2,tB)));
      tfp_person(x,"m1",620,980,"clasp",Object.assign({t:tt},tf_alive(tt,{expr:ag_in(tt,c.harm,0.5)>0.5?"worry":"think",gaze:[1,0.3]},1,tB)));}},
    // they built their own, out of trust: the yard again, at their meeting's table
    {at:tC,place:"tfpMeet",cut:true,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tfp_table(x,"m1",760,930,Object.assign({t:tt,work:0},tf_alive(tt,{expr:"think",gaze:[1,0.2]},1,tC)));
      tfp_table(x,"m4",1260,960,Object.assign({t:tt,flip:true,work:0,pot:true},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},4,tC)));}},
    // the rules, agreed together (a member's book)
    {at:tR,place:"tfNotes",dis:0.6,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,TFP_FOLK.m4,tt,N1,{});}},
    // everyone answers to the others
    {at:tA,place:"tfpMeet",dis:0.6,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tfp_person(x,"m3",300,890,"clasp",Object.assign({t:tt},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},3,tA)));
      tfp_table(x,"m4",760,930,Object.assign({t:tt,work:0},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},4,tA)));
      tfp_table(x,"m2",1260,960,Object.assign({t:tt,flip:true,work:0,pot:true},tf_alive(tt,{expr:"listen",gaze:[1,0.2]},2,tA)));
      tfp_person(x,"m5",1640,1000,"clasp",Object.assign({t:tt,flip:true},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tA)));}},
    // the burial society; and when one member falls on hard times, the group carries her
    {at:tY,place:"tfpYard",cut:true,keys:[[tY,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let J2=null;
      tfp_person(x,"m1",1180,900,"clasp",Object.assign({t:tt,flip:true},tf_alive(tt,{expr:ag_in(tt,HC+1.0,0.6)>0.5?"smile":"worry",gaze:[1,0.2]},1,tY)));
      J2=tf_shows(x,"m2",720,960,tt,tf_sp(tt,2,[[HC+0.3,E.carry]],"smile",0.2));
      tfp_person(x,"m5",420,1010,"clasp",Object.assign({t:tt},tf_alive(tt,{expr:"listen",gaze:[1,0.2]},5,tY)));
      tf_bub(x,J2,tt,HC+0.3,tU-0.3,["We'll carry you","through this."],cam,{lean:160});}},
    // Ubuntu (the member's book)
    {at:tU,place:"tfNotes",dis:0.6,keys:[[tU,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,TFP_FOLK.m4,tt,N2,{});}},
    // for decades, and today: more than 11 million members
    {at:tD,place:"tfpMeet",dis:0.6,keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Js=null;
      tfp_table(x,"t2",760,930,Object.assign({t:tt,work:0},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},2,tD)));
      tfp_table(x,"t3",1260,960,Object.assign({t:tt,flip:true,work:0,pot:true},tf_alive(tt,{expr:"listen",gaze:[1,0.2]},3,tD)));
      Js=tf_shows(x,"t1",360,990,tt,tf_alive(tt,{expr:"smile",gaze:[1,0.2]},1,tD));
      PK.callout(x,560,80,720,220,Js?[Js.hdN[0]+30,Js.hdN[1]-60]:[440,560],ag_io(tt,c.today+1.6,tT-0.3,0.4),(cc,bx,by,bw,bh)=>tf_panel(cc,bx,by,bw,bh,"Stokvels today",[["11 million members",PK.C.green,34],[ag_in(tt,c.rand,0.4)>0.5?"R50 billion a year":"",PK.C.green,34]],null,PK.C.green));}},
    // a team can hold its people the same way
    {at:tT,place:"tfTeam",dis:1.0,keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tf_atRoom(x,tt,tT,{at:"ivy",noor:true,face:tf_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tT),people:[tf_helena(tt,tf_alive(tt,{expr:"smile",gaze:[1,0.1]},5,tT),{x:1560,fl:930})]});}}
  ]);
  tf_card(ctx,S,t,0.4,c.earn-0.2,{kick:"Johannesburg, the 1930s",title:"A yard of rooms"},{y:40,mid:true});
  tf_card(ctx,S,t,tD+0.3,c.today+1.4,{kick:"Today",title:"South Africa"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"The team comes first","Nobody alone, nobody the only one who knows","Leading data people · Leading a data team",{side:"right",size:52});
});

/* ---------------------------------------------------------------- 2. The team as a whole */
scene("whole",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tW=c.weekly-0.4,tH=c.whole-0.4,tL=c.weighs-0.4,tZ=c.weighs+2.4,tG=c.gap-0.4;
  const N3=PK.pace(ctx,null,tf_note3(sc,w)),BA=PK.pace(ctx,"carmen",tf_boardA(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 1 February 2027: Helena starts, and watches
    {at:0,place:"tfTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Hh={};
      tf_atRoom(x,tt,0,{at:"ivy",noor:true,face:tf_alive(tt,{expr:"think",gaze:[1,0.3]},3,0),people:[tf_helena(tt,tf_alive(tt,{expr:"think",gaze:[1,0.1]},5,0),{x:1560,fl:930,out:Hh})]});
      tf_name(x,Hh.J,tt,w("helena","Helena Novak",0),c.watch-0.2,"Helena Novak","Data manager",170);}},
    // in her first months, half an hour a week with each person
    {at:tW,place:"tfCorner",cut:true,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const r=tf_corner(x,tt,{who2:"jun",lean:0.4,t0:tW,hf:tf_sp(tt,5,[[c.asks+0.2,E.asks]],"smile",0.25),iface:tf_alive(tt,{expr:"listen",gaze:[1,0.3]},2,tW)});
      tf_bub(x,r.helena,tt,c.asks+0.2,tH-0.3,["How are you?","What's in your way?"],cam,{lean:160});}},
    // the team as a whole (Helena's notebook)
    {at:tH,place:"tfNotes",dis:0.6,keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}},
    // leading weighs a little more (Carmen, at the team's board)
    {at:tL,place:"tfTeam",dis:0.6,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=tf_lesson(x,tt,{rows:BA,jun:Object.assign({work:1,pose:undefined},tf_alive(tt,{},2,tL)),clock:10,events:TF_HEV});
      tf_name(x,R.at,tt,tL+0.4,tZ-0.3,"Carmen Vidal","Consultant",160);}},
    {at:tZ,cut:true,place:"tfBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.weighs,E.open]],events:TF_HEV});}},
    // the gap: every night alert goes to Sam
    {at:tG,place:"tfTeam",cut:true,keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=tf_atRoom(x,tt,tG,{at:"sam",sam:null,noor:true,clock:18,face:tf_alive(tt,{expr:ag_in(tt,c.leans,0.5)>0.5?"worry":"think",gaze:[1,0.5]},1,tG)});
      tf_name(x,R.marta,tt,w("sam","Sam Okafor",0),c.sixty-0.2,"Sam Okafor","Platform",170,60);
      tf_screenCall(x,R,ag_io(tt,c.sixty+0.3,1e9,0.4),"Night alerts · to Sam",[["about 60 a week",PK.C.amber,34],["most need nothing",PK.C.ink,34],[ag_in(tt,w("sixty","only Sam",0),0.4)>0.5?"only Sam knows how":"",PK.C.amber,34]],PK.C.amber,{bh:290});}}
  ]);
  tf_card(ctx,S,t,0.3,w("helena","Helena Novak",-0.3),{kick:"Monday 1 February 2027",title:"A new data manager"},{y:40,mid:true});
  tf_card(ctx,S,t,tW+0.3,c.asks-0.2,{kick:"Her first months",title:"Half an hour each"},{y:40,mid:true});
  tf_imagined(ctx,S,t,0.4,w("helena","Helena Novak",-0.2),"The university, 2027 · imagined");
  tf_kick(ctx,S,ag_in(t,0.6,0.6)*(1-tf_apart(t,[[0,w("helena","Helena Novak",0)],[tW,c.asks],[tH,tL]])));
});

/* ---------------------------------------------------------------- 3. Said out loud */
scene("aloud",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tS=c.standup-0.4,tN=c.name-0.4,tZ=c.name+2.4,tL=c.learn-0.4,BB=PK.pace(ctx,"carmen",tf_boardB(sc,w)),N4=PK.pace(ctx,null,tf_note4(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // April: Ivy reviews the agent's draft, and only just catches it
    {at:0,place:"tfTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=tf_atRoom(x,tt,0,{at:"ivy",noor:true,face:tf_alive(tt,{expr:ag_in(tt,c.caught,0.5)>0.5?"worry":"think",gaze:[1,0.5]},3,0)});
      tf_screenCall(x,R,ag_io(tt,c.april+1.0,tS-0.3,0.4),"The agent's draft",[["used hours = booked hours",PK.C.amber,34],[ag_in(tt,c.draft+1.6,0.4)>0.5?"used: people in the room":"",PK.C.green,34]],PK.C.violet||PK.C.blue,{bh:240});}},
    // the next morning's stand-up: I nearly let it through
    {at:tS,place:"tfTeam",later:true,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Ji=null,Jj=null,Jh=null,Jn=null;
      tf_team(x,tt,{clock:9,sam:null,jun:null,marta:null,people:[
        {fl:850,draw:cc=>{Jn=PK.person(cc,"noor",1440,850,tf_hT(850),"clasp",Object.assign({t:tt,flip:true},tf_sp(tt,4,[[c.more+0.2,E.more]],"think",0.1)));}},
        {fl:900,draw:cc=>{Jh=PK.person(cc,"helena",900,900,tf_hT(900),"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},tf_sp(tt,1,[[w("thanks","Helena asks",0),E.thanks]],"smile",0.1)));}},
        {fl:960,draw:cc=>{Ji=PK.person(cc,"ivy",360,960,tf_hT(960),"clasp",Object.assign({t:tt},tf_sp(tt,3,[[c.standup+0.2,E.standup],[c.glossary+0.2,E.glossary]],"think",0.1)));}},
        {fl:925,draw:cc=>{PK.person(cc,"sam",1220,925,tf_hT(925),"clasp",Object.assign({t:tt,flip:true},tf_alive(tt,{expr:"listen",gaze:[1,0.1]},2,tS)));}},
        {fl:1000,draw:cc=>{Jj=PK.person(cc,"jun",640,1000,tf_hT(1000),"clasp",Object.assign({t:tt},tf_sp(tt,5,[[c.thanks+0.2,w("thanks","Helena asks",-0.2)]],"smile",0.1)));}}]});
      tf_bub(x,Ji,tt,c.standup+0.2,c.thanks-0.1,["I nearly let it through."],cam,{lean:160});
      tf_bub(x,Jj,tt,c.thanks+0.2,w("thanks","Helena asks",-0.1),["Thanks, Ivy."],cam,{lean:160});
      tf_bub(x,Jh,tt,w("thanks","Helena asks",0),c.glossary-0.1,["What would make it","easier to catch?"],cam,{lean:160});
      tf_bub(x,Ji,tt,c.glossary+0.2,c.more-0.1,["Write what used means","in the glossary."],cam,{lean:160});
      tf_bub(x,Jn,tt,c.more+0.2,tN-0.3,["I nearly missed","one too."],cam,{lean:-160});}},
    // psychological safety (Carmen)
    {at:tN,place:"tfTeam",later:true,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{tf_lesson(x,tt,{rows:BB,jun:Object.assign({work:1,pose:undefined},tf_alive(tt,{},2,tN)),clock:10,events:TF_HEV});}},
    {at:tZ,cut:true,place:"tfBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.name,E.teams]],events:TF_HEV});}},
    // said out loud, and thanked (Ivy's notebook)
    {at:tL,place:"tfNotes",dis:0.6,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N4,{});}}
  ]);
  tf_card(ctx,S,t,0.3,c.april+0.8,{kick:"April",title:"A draft to review"},{y:40,mid:true});
  tf_kick(ctx,S,ag_in(t,0.6,0.6)*(1-tf_apart(t,[[0,c.april+0.8],[tL,1e9]])));
});

/* ---------------------------------------------------------------- 4. Nobody the only one */
scene("pairs",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tP=c.pair-0.4,tF=c.four-0.4,tQ=c.quiet-0.4,tT=c.tutu-0.4,BC=PK.pace(ctx,"helena",tf_boardC(sc,w)),N5=PK.pace(ctx,null,tf_note5(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // June: about twelve alerts a week, each one needing someone
    {at:0,place:"tfTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=tf_atRoom(x,tt,0,{at:"sam",sam:null,noor:true,face:tf_alive(tt,{expr:"think",gaze:[1,0.5]},1,0)});
      tf_screenCall(x,R,ag_io(tt,c.june+0.6,tP-0.3,0.4),"Night alerts",[["about 12 a week",PK.C.green,34],["each needs someone",PK.C.ink,34]],PK.C.blue,{bh:240});}},
    // the team pairs on the platform, and writes a runbook
    {at:tP,place:"tfTeam",later:true,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const Ej={};
      const R=tf_atRoom(x,tt,tP,{at:"sam",sam:null,noor:true,face:tf_sp(tt,1,[[w("runbook","write down",0),E.runbook]],"think",0.4),people:[tf_stand("erin",tt,tf_alive(tt,{expr:"listen",gaze:[1,0.3]},4,tP),{x:1560,fl:940,flip:true,out:Ej})]});
      tf_name(x,Ej.J,tt,w("pair","Erin Walsh",0),c.runbook-0.2,"Erin Walsh","Platform engineer",170);
      tf_screenCall(x,R,ag_io(tt,c.runbook+0.4,tF-0.3,0.4),"Runbook · a night alert",[["1 · read what failed",PK.C.ink,32],["2 · check the night's load",PK.C.ink,32],["3 · run it again, or call",PK.C.ink,32]],PK.C.blue,{bw:700,bh:280});}},
    // four can answer every night alert; the rota (Helena, at the team's board)
    {at:tF,place:"tfTeam",later:true,keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{tf_lesson(x,tt,{rows:BC,who:"helena",jun:Object.assign({work:1,pose:undefined},tf_alive(tt,{},2,tF)),clock:15,events:TF_HEV});}},
    {at:c.rota+0.2,cut:true,place:"tfBoard",keys:[[c.rota+0.2,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BC,{say:[],events:TF_HEV});}},
    // three weeks in four, Sam's phone stays quiet; two people for each job that matters most
    {at:tQ,place:"tfCorner",cut:true,keys:[[tQ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tf_corner(x,tt,{who1:"sam",book:true,t0:tQ,hf:tf_alive(tt,{expr:"smile",gaze:[1,0.4]},1,tQ)});}},
    // Desmond Tutu (Helena's notebook)
    {at:tT,place:"tfNotes",dis:0.6,keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N5,{});}}
  ]);
  tf_card(ctx,S,t,0.3,c.june+0.4,{kick:"June",title:"Twelve a week"},{y:40,mid:true});
  tf_card(ctx,S,t,tQ+0.3,c.two-0.2,{kick:"From Monday 5 July",title:"One week in four"},{y:40,mid:true});
  tf_kick(ctx,S,ag_in(t,0.6,0.6)*(1-tf_apart(t,[[0,c.june+0.4],[tQ,c.two],[tT,1e9]])));
});

/* ---------------------------------------------------------------- 5. The rota holds */
scene("holds",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tK=c.week-0.4,tA=c.alerts-0.4,tB=c.back-0.4,tP=c.paid-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // Sunday 1 August, that evening: Sam calls Helena
    {at:0,place:"tfTeam",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=tf_atRoom(x,tt,0,{at:"helena",sam:null,jun:null,clock:19,face:tf_sp(tt,1,[[c.go+0.2,E.go]],"listen",0.4)});const D=R&&R.marta&&R.marta.desk;
      PK.callout(x,720,110,620,330,D?[150,D.top-120]:[150,620],ag_io(tt,c.call+1.0,tK-0.3,0.4),(cc,bx,by,bw,bh)=>PK.call(cc,bx,by,bw,bh,[{who:"sam",face:{expr:"worry"},say:[[c.call+1.4,c.go-0.2]]}],tt,{}));}},
    // his week on the rota: Jun and Erin take it; the upgrade waits two weeks
    {at:tK,place:"tfTeam",dis:0.6,keys:[[tK,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=tf_atRoom(x,tt,tK,{at:"helena",sam:null,clock:9,face:tf_alive(tt,{expr:"think",gaze:[1,0.5]},1,tK),people:[tf_stand("erin",tt,tf_alive(tt,{expr:"smile",gaze:[1,0.2]},4,tK),{x:1560,fl:940,flip:true})]});
      tf_screenCall(x,R,ag_io(tt,c.week+0.4,c.work-0.3,0.4),"Rota · this week",[["Sam · away",PK.C.amber,34],["Jun and Erin",PK.C.green,34]],PK.C.blue,{bh:240});
      tf_screenCall(x,R,ag_io(tt,c.work+0.4,tA-0.3,0.4),"Platform upgrade",[["two weeks later",PK.C.blue,34],["new date sent",PK.C.ink,34]],PK.C.blue,{bh:240});}},
    // twice, an alert in the night, answered from the runbooks
    {at:tA,place:"tfTeam",later:true,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=tf_atRoom(x,tt,tA,{at:"jun",jun:null,sam:null,clock:2,face:tf_alive(tt,{expr:"think",gaze:[1,0.5]},2,tA)});
      tf_screenCall(x,R,ag_io(tt,c.alerts+0.4,tB-0.3,0.4),"Two night alerts",[["answered from the runbooks",PK.C.green,34],[ag_in(tt,c.nobody,0.4)>0.5?"nobody calls Sam":"",PK.C.green,34]],PK.C.blue,{bh:240});}},
    // Monday 16 August: Helena's first question is about his mother
    {at:tB,place:"tfCorner",cut:true,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const r=tf_corner(x,tt,{who2:"sam",lean:0.5,t0:tB,hf:tf_sp(tt,5,[[w("back","first question",0),E.back]],"think",0.25),iface:tf_alive(tt,{expr:"listen",gaze:[1,0.3]},1,tB)});
      tf_bub(x,r.helena,tt,w("back","first question",0),tP-0.3,["How is your mother?"],cam,{lean:160});}},
    // like a stokvel carrying a member through hard times
    {at:tP,place:"tfpMeet",dis:0.8,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tfp_person(x,"m3",300,890,"clasp",Object.assign({t:tt},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},3,tP)));
      tfp_table(x,"m1",760,930,Object.assign({t:tt,work:0},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},1,tP)));
      tfp_table(x,"m2",1260,960,Object.assign({t:tt,flip:true,work:0,pot:true},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},2,tP)));}}
  ]);
  tf_card(ctx,S,t,0.3,c.call+0.8,{kick:"Sunday 1 August",title:"A call in the evening"},{y:40,mid:true});
  tf_card(ctx,S,t,tB+0.3,w("back","first question",-0.3),{kick:"Monday 16 August",title:"Sam comes back"},{y:40,mid:true});
  tf_kick(ctx,S,ag_in(t,0.6,0.6)*(1-tf_apart(t,[[0,c.call+0.8],[tB,w("back","first question",0)]])));
});

/* ---------------------------------------------------------------- 6. Each person, as they need */
scene("each",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),LE=PK.ROOMS.lecture;
  const tR=c.review-0.4,tE=c.ethic-0.4,tZ=c.ethic+2.4,tC=c.cares-0.4,BD=PK.pace(ctx,"carmen",tf_boardD(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // September: Jun says he's fine
    {at:0,place:"tfCorner",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const r=tf_corner(x,tt,{who2:"jun",lean:0.4,t0:0,hf:tf_sp(tt,5,[[c.moves+0.2,E.moves]],"think",0.25),iface:tf_sp(tt,2,[[c.jun+0.2,E.jun]],"smile",0.3)});
      tf_bub(x,r.who2,tt,w("jun","fine",-0.2),c.moves-0.1,["I'm fine. Two to teach,","models, and the rota."],cam,{lean:-160});
      tf_bub(x,r.helena,tt,c.moves+0.2,tR-0.3,["One project moves","to November."],cam,{lean:160});}},
    // October: the quarterly review, the credit by name
    {at:tR,place:"tfLecture",cut:true,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jh=null;tf_audience(x,tt,6,0.6);
      Jh=PK.person(x,"helena",1500,950,PK.hAt(950,LE.eye),"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},tf_sp(tt,1,[[c.review+0.6,E.review]],"smile",0.1)));
      tf_bub(x,Jh,tt,w("review","by name",-0.2),w("review","answers herself",-0.1),["Sam, Noor, Jun, Erin","and Ivy did this."],cam,{lean:-180});
      tf_bub(x,Jh,tt,w("review","answers herself",0),tE-0.3,["What slipped","is mine."],cam,{lean:-180});}},
    // Ubuntu, written down as an ethic (Carmen)
    {at:tE,place:"tfTeam",cut:true,keys:[[tE,960,540,1.0]],d:2,draw:(x,tt,cam)=>{tf_lesson(x,tt,{rows:BD,jun:Object.assign({work:1,pose:undefined},tf_alive(tt,{},2,tE)),clock:11,events:TF_HEV});}},
    {at:tZ,cut:true,place:"tfBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BD,{say:[[c.ethic,E.metz]],events:TF_HEV});}},
    // the team shares the work, and cares how each is doing
    {at:tC,place:"tfTeam",cut:true,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tf_atRoom(x,tt,tC,{at:"ivy",noor:true,face:tf_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tC),people:[tf_helena(tt,tf_alive(tt,{expr:"smile",gaze:[1,0.1]},5,tC),{x:1560,fl:930})]});}}
  ]);
  tf_card(ctx,S,t,0.3,c.jun-0.2,{kick:"September",title:"A one-to-one"},{y:40,mid:true});
  tf_card(ctx,S,t,tR+0.3,c.review+1.4,{kick:"October",title:"The quarterly review"},{y:40,mid:true});
  tf_kick(ctx,S,ag_in(t,0.6,0.6)*(1-tf_apart(t,[[0,c.jun],[tR,c.review+1.4]])));
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tT=c.team-0.4,tN=c.pair-0.1,tL=c.take-0.4,tE=c.breath+0.6,BM=PK.pace(ctx,"helena",tf_boardM(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // in a stokvel, everyone pays in
    {at:0,place:"tfpMeet",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tfp_table(x,"m4",760,930,Object.assign({t:tt,work:0},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},4,0)));
      tfp_table(x,"m2",1260,960,Object.assign({t:tt,flip:true,work:0,pot:true},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},2,0)));
      tfp_person(x,"m5",1640,1000,"clasp",Object.assign({t:tt,flip:true},tf_alive(tt,{expr:"smile",gaze:[1,0.2]},5,0)));}},
    // Helena's team did the same
    {at:tT,place:"tfTeam",dis:0.8,keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tf_atRoom(x,tt,tT,{at:"sam",noor:true,sam:null,face:tf_alive(tt,{expr:"smile",gaze:[1,0.3]},1,tT),people:[tf_stand("erin",tt,tf_alive(tt,{expr:"smile",gaze:[1,0.2]},4,tT),{x:1000,fl:960,flip:true})]});}},
    {at:tN,place:"tfBoard",cut:true,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BM,{say:[],events:TF_HEV});}},
    // nobody alone, nobody the only one who knows
    {at:tL,place:"tfTeam",cut:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      tf_atRoom(x,tt,tL,{at:"ivy",noor:true,face:tf_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tL),people:[tf_helena(tt,tf_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tL),{x:1560,fl:930})]});}}
  ]);
  tf_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6)));
  PK.end(ctx,S,t,tE,"The team comes first",TF_LAST,"Film 3 of 4","Leading a data team",{side:"right"});
});
ag_cutInto(["whole","aloud","pairs","holds","each","monday"]);
