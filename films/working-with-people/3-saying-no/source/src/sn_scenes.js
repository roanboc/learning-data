/* ===== Saying no, and what instead: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are written by hand: the engineers' board at the Aral, Carmen Vidal's board, and Helena's and Noor's notebooks (sn_uni.js).
   The Aral Sea, from the 1960s to 2014, is in snp_aral.js. Every time comes from the voice: a line's start (sc.cues) or a word in it
   (wAt). */
const sn_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,3,"Saying no, and what instead",a);}};
function sn_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const sn_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const sn_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const sn_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const sn_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const sn_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const sn_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const sn_sp=(tt,i,spans,base,g)=>sn_alive(tt,{expr:sn_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const SN_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const SN_LAST="Never a bare no: say what you can do, and when.";
// a screen's callout from the monitor at the desk by the window
const sn_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>sn_panel(cc,bx,by,bw,bh,head,rows,o.bars||null,hc));};
// the team's room with someone at the desk by the window (o.at, default Helena); o.face: their face; o.noor: Noor at Sam's desk
const sn_atRoom=(x,tt,t0,o)=>{o=o||{};return sn_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:o.at||"helena",marta:o.at===null?null:Object.assign({work:o.work==null?1:o.work,turn:0},o.face||sn_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
  samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},o.sam||sn_alive(tt,{},1,t0)),jun:o.jun===null?null:Object.assign({work:1},o.jun||sn_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people:o.people||[]});};
// Helena standing in the team's room, her notebook under her arm (fl, x: where)
const sn_helena=(tt,face,o)=>({fl:(o&&o.fl)||930,draw:cc=>{o=o||{};const J=PK.person(cc,"helena",o.x||1560,o.fl||930,sn_hT(o.fl||930),"clasp",Object.assign({t:tt+4,flip:o.flip!==false,underF:PK.inHand.notebook({}),holds:true},face));if(o.out)o.out.J=J;}});
// Helena on her phone in the team's room, a chat in a callout from it
const sn_phone=(x,tt,t0,t1,CH,face,o)=>{o=o||{};let Jh=null;const cs=PK.chatSize(x,CH,{size:28});
  sn_team(x,tt,{clock:o.clock==null?16:o.clock,marta:null,samWho:o.noor?"noor":"sam",sam:o.sam===null?null:Object.assign({work:1},sn_alive(tt,{},1,t0)),jun:Object.assign({work:1},sn_alive(tt,{},2,t0)),people:[{fl:930,draw:cc=>{
    Jh=PK.person(cc,"helena",1560,930,sn_hT(930),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone?PK.inHand.phone({back:true}):null,holds:true},face));}}]});
  if(Jh)PK.callout(x,o.bx==null?560:o.bx,o.by==null?160:o.by,cs.w,cs.h,[Jh.hdN[0]-20,Jh.hdN[1]-30],ag_io(tt,t0+0.3,t1,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));
  return Jh;};
// the Aral's map, as the sea was: k0 how far it has shrunk (0 to 1), sp how far it has split, back how far the north came back,
// dry how far the south's eastern part has dried
const sn_st=(k0,sp,back,dry,dam)=>({n:sn_lerp(1,0.62,k0)+0.36*back,s:1-0.2*sp-0.25*dry,e:sn_lerp(1,0.7,k0)*(1-dry),dam:dam||0});
const sn_lerp=(a,b,k)=>a+(b-a)*k;

/* ---------------------------------------------------------------- 1. Save what can be saved */
scene("aral",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tR=c.rivers-0.4,tS=c.shrank-0.4,tT=c.towns-0.4,tW=c.whole-0.4,tD=c.dam-0.4,tRo=c.rose-0.4,tSo=c.south-0.4,tN=c.no-0.4,tA=c.data-0.4;
  const BO=PK.pace(ctx,SNP_FOLK.eng,sn_boardO(sc,w)),HI=snp_hi(SNP_BD.floor),FI=snp_hi(960);
  const shrunk=tt=>ag_in(tt,c.shrank,4),split=tt=>ag_in(tt,w("split","split in two",0),1.6);
  ag_shots(ctx,S,t,sc.dur,[
    // the 1960s: Aralsk's harbour, the sea up to the jetty, a boat out on it, two fishers on the sand
    {at:0,place:"snpHarbour",keys:[[0,960,540,1.0],[tR-0.2,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{snp_water(x,1);snp_boat(x,1320,600,0.5,0);
      snp_person(x,"fisher2",1120,880,"clasp",Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"smile",gaze:[1,0.1]},2,0)));
      snp_person(x,"fisher1",700,960,"stand",Object.assign({t:tt},sn_alive(tt,{expr:"neutral",gaze:[1,0.1]},1,0)));}},
    // its two rivers turned to grow cotton and rice in the desert
    {at:tR,place:"snpFields",dis:0.8,keys:[[tR,960,540,1.0],[tS-0.2,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{
      snp_person(x,"farmer2",1260,880,PK.poseMix("stand","bend",ag_in(tt,c.rivers+1.0,0.5)),Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"neutral",gaze:[1,0.5]},2,tR)));
      snp_person(x,"farmer1",620,960,"stand",Object.assign({t:tt},sn_alive(tt,{expr:"neutral",gaze:[1,0.3]},1,tR)));}},
    // the water board's office: the sea shrinks on the map, and splits; the engineer writes what it lost
    {at:tS,place:"snpOffice",dis:0.8,keys:[[tS,960,540,1.0]],d:3,draw:(x,tt,cam)=>{const k=shrunk(tt);snp_map(x,sn_st(k,split(tt),0,0,0));
      snp_person(x,"sci",1700,960,"clasp",Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"worry",gaze:[1,0.1]},2,tS)),snp_hi);
      PK.teach(x,SNP_FOLK.eng,tt,BO,{x:SNP_BD.x,y:SNP_BD.y,k:SNP_BD.k,deco:true,floor:SNP_BD.floor,rest:SNP_BD.rest,h:HI,say:[],events:SN_HEV});}},
    // Aralsk, far from the water: a boat on the sand; salt and dust on the wind
    {at:tT,place:"snpHarbour",dis:0.8,keys:[[tT,960,540,1.0],[tW-0.2,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{let Jw=null;snp_boat(x,1320,920,1.0,5,{rust:true});
      snp_person(x,"fisher1",820,900,"clasp",Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"worry",gaze:[1,0.2]},1,tT)));
      Jw=snp_person(x,"woman1",460,970,"clasp",Object.assign({t:tt},sn_sp(tt,2,[[c.dust+0.3,E.dust]],"worry",0.1)));
      sn_bub(x,Jw,tt,c.dust+0.3,tW-0.3,["The water isn't safe to drink."],cam,{lean:160});}},
    // back at the office: the whole sea is out of reach; save the north
    {at:tW,place:"snpOffice",dis:0.8,keys:[[tW,960,540,1.0]],d:3,draw:(x,tt,cam)=>{let Je=null,Js=null;snp_map(x,sn_st(1,1,0,0,0));
      Js=snp_person(x,"sci",1700,960,"clasp",Object.assign({t:tt,flip:true},sn_sp(tt,2,[[c.change+0.2,E.change]],"worry",0.1)),snp_hi);
      Je=PK.teach(x,SNP_FOLK.eng,tt,BO,{x:SNP_BD.x,y:SNP_BD.y,k:SNP_BD.k,deco:true,floor:SNP_BD.floor,rest:SNP_BD.rest,h:HI,say:[[c.whole+0.2,E.whole],[c.chose+0.2,E.chose]],events:SN_HEV});
      sn_bub(x,Je,tt,c.whole+0.2,c.change-0.2,["The whole sea would take","the rivers from the farms."],cam,{lean:180});
      sn_bub(x,Js,tt,c.change+0.2,c.chose-0.2,["Waiting saves nothing."],cam,{lean:-180});
      sn_bub(x,Je,tt,c.chose+0.2,tD-0.3,["Then we save the north."],cam,{lean:180});}},
    // the Kok-Aral dam across the strait, the northern sea behind it
    {at:tD,place:"snpDam",dis:0.8,keys:[[tD,960,540,1.0],[tRo-0.2,1000,540,1.04]],d:3,draw:(x,tt,cam)=>{
      snp_person(x,"worker2",1240,890,"clasp",Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"neutral",gaze:[1,0.3]},2,tD)));
      snp_person(x,"worker1",720,960,"stand",Object.assign({t:tt},sn_alive(tt,{expr:"smile",gaze:[1,0.3]},1,tD)));}},
    // the water comes back towards Aralsk; boats go out again
    {at:tRo,place:"snpHarbour",dis:0.8,keys:[[tRo,960,540,1.0],[tSo-0.2,1000,540,1.05]],d:3,draw:(x,tt,cam)=>{let Jf=null,Jw=null;
      snp_water(x,0.2+0.8*ag_in(tt,c.rose,c.shore-c.rose+2));snp_boat(x,1420,600,0.5,0);
      Jw=snp_person(x,"woman1",1200,890,"clasp",Object.assign({t:tt,flip:true},sn_sp(tt,2,[[c.plants+0.2,E.plants]],"smile",0.1)));
      Jf=snp_person(x,"fisher2",640,960,"clasp",Object.assign({t:tt},sn_sp(tt,1,[[c.fresh+0.3,E.fresh]],"smile",0.1)));
      sn_bub(x,Jf,tt,c.fresh+0.3,c.plants-0.2,["Fifty tonnes, once.","Now two thousand."],cam,{lean:160});
      sn_bub(x,Jw,tt,c.plants+0.2,c.shore-0.2,["The fish plants are open again."],cam,{lean:-160});}},
    // the southern sea, which the dam didn't save, goes on shrinking
    {at:tSo,place:"snpOffice",dis:0.8,keys:[[tSo,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Js=null;snp_map(x,sn_st(1,1,1,ag_in(tt,c.south+0.4,3),1));
      PK.teach(x,SNP_FOLK.eng,tt,BO,{x:SNP_BD.x,y:SNP_BD.y,k:SNP_BD.k,deco:true,floor:SNP_BD.floor,rest:SNP_BD.rest,h:HI,say:[],events:SN_HEV});
      Js=snp_person(x,"sci",1700,960,"clasp",Object.assign({t:tt,flip:true},sn_sp(tt,2,[[w("south","eastern",-0.2),E.south]],"worry",0.1)),snp_hi);
      sn_bub(x,Js,tt,w("south","eastern",-0.2),tN-0.3,["The south's eastern part is dry."],cam,{lean:-180});}},
    // a no to the whole sea, a yes to the north: the two at the bank
    {at:tN,place:"snpDam",dis:0.8,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      snp_person(x,"woman1",1180,900,"clasp",Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"smile",gaze:[1,0.4]},2,tN)));
      snp_person(x,"fisher1",760,960,"stand",Object.assign({t:tt},sn_alive(tt,{expr:"smile",gaze:[1,0.4]},1,tN)));}},
    // in data work, more is asked than a team can do well
    {at:tA,place:"snTeam",dis:1.0,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_atRoom(x,tt,tA,{at:"helena",face:sn_alive(tt,{expr:"think",gaze:[1,0.3]},3,tA),noor:true});
      sn_screenCall(x,R,ag_io(tt,w("data","more is asked",-0.3),c.breath-0.3,0.4),"Asks this month",[["a new forecast model",PK.C.ink,34],["the rooms' data",PK.C.ink,34],["five more",PK.C.amber,34]],PK.C.orange,{by:70,bh:270});}}
  ]);
  sn_card(ctx,S,t,0.4,tR-0.2,{kick:"The 1960s",title:"The Aral Sea"},{y:40,mid:true});
  sn_card(ctx,S,t,tR+0.4,c.shrank-0.6,{kick:"From the 1960s",title:"The rivers go to the fields"},{y:40,mid:true});
  sn_card(ctx,S,t,tT+0.3,c.dust-0.2,{kick:"Aralsk",title:"Far from the water"},{y:40,mid:true});
  sn_card(ctx,S,t,w("done","August",-0.2),tRo-0.2,{kick:"August 2005",title:"The Kok-Aral dam"},{y:40,mid:true});
  sn_card(ctx,S,t,tSo+0.3,w("south","eastern",-0.4),{kick:"By 2014",title:"The southern sea"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"Saying no, and what instead","Never a bare no: say what you can do, and when","Leading data people · Working with people",{side:"right",size:52});
});

/* ---------------------------------------------------------------- 2. Two asks, the same weeks */
scene("asks",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),CA=PK.ROOMS.campus;
  const tS=c.same-0.4,tL=c.list-0.4,tY=c.yes-0.4,tA=c.asks-0.4,N1=PK.pace(ctx,null,sn_note1(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Clara, in Planning, writes to the data team
    {at:0,place:"snCorner",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_corner(x,tt,{t0:0,who1:SN_CLARA,laptop:true,hf:sn_alive(tt,{expr:"think",gaze:[1,0.6]},1,0),handN:[830,616],handF:[856,606]});
      sn_name(x,R.who1,tt,w("clara","Clara Jensen",0),tS-0.3,"Clara Jensen","Planning",170);
      PK.callout(x,1060,150,720,250,R.laptop,ag_io(tt,w("clara","asks",-0.2),tS-0.3,0.4),(cc,bx,by,bw,bh)=>sn_panel(cc,bx,by,bw,bh,"To the data team",[["A new student forecast",PK.C.ink,34],["model, by end of August?",PK.C.ink,34]],null,PK.C.blue));}},
    // the registrar's office needs the rooms' data for the timetable change
    {at:tS,place:"snCampus",dis:0.6,keys:[[tS,900,570,1.1]],d:2,draw:(x,tt,cam)=>{let Jm=null,Jg=null;
      Jg=PK.person(x,"graham",1180,CA.near-30,sn_hC(CA.near-30),"clasp",Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"listen",gaze:[1,0.1]},2,tS)));
      Jm=PK.person(x,"mei",840,CA.near,sn_hC(CA.near),"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},sn_sp(tt,1,[[c.mei+0.2,E.mei]],"think",0.1)));
      sn_name(x,Jm,tt,w("mei","Mei Tanaka",0),w("mei","Graham Ellis",-0.2),"Mei Tanaka","Registrar's office",170);
      sn_name(x,Jg,tt,w("mei","Graham Ellis",0),c.mei+3.4,"Graham Ellis","Facilities",170);
      sn_bub(x,Jm,tt,c.mei+3.6,tL-0.3,["The rooms' data, by the end","of August, for October."],cam,{lean:-160});}},
    // both go on the team's one list; both need Jun and Noor
    {at:tL,place:"snTeam",dis:0.6,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_atRoom(x,tt,tL,{at:"helena",noor:true,face:sn_alive(tt,{expr:"think",gaze:[1,0.3]},3,tL)});
      sn_screenCall(x,R,ag_io(tt,c.list+0.2,c.both-0.3,0.4),"The one list",[["the rooms' data · end of Aug",PK.C.orange,34],["a new model · end of Aug",PK.C.orange,34]],PK.C.blue,{bh:250});
      sn_name(x,R.jun,tt,w("both","Jun",0),w("both","four weeks",0),"Jun","Data engineer",150,-150);
      sn_name(x,R.sam,tt,w("both","Noor",0),w("both","four weeks",0),"Noor","Data engineer",150);
      sn_screenCall(x,R,ag_io(tt,w("both","four weeks",-0.2),tY-0.3,0.4),"August",[["Jun and Noor · 4 weeks",PK.C.amber,34]],PK.C.amber,{bh:200});}},
    // a yes to both, or a bare no (Helena's notebook)
    {at:tY,place:"snNotes",dis:0.6,keys:[[tY,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N1,{});}},
    // first, she asks: a message to Clara
    {at:tA,place:"snTeam",dis:0.6,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const CH={title:"Clara Jensen",who:[SN_CLARA],me:"helena",msgs:[{who:"helena",s:"Can we meet on Wednesday? What is the date for?",at:w("asks","asks",0.2),type:1.6}]};
      const Jh=sn_phone(x,tt,tA,1e9,CH,PK.face(tt,{expr:"think",gaze:[1,0.9]},[]),{clock:11,noor:true});
      sn_name(x,Jh,tt,w("asks","Helena Novak",0),w("asks","First",-0.2),"Helena Novak","Data manager",170);}}
  ]);
  sn_imagined(ctx,S,t,0.4,c.same-0.1,"The university, 2027 · imagined");
  sn_kick(ctx,S,ag_in(t,0.6,0.6)*(1-sn_apart(t,[[0,c.same],[tY,tA]])));
});

/* ---------------------------------------------------------------- 3. What's the date for? */
scene("date",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tZ=c.book+2.2,tW=c.wed-0.4,tE=c.enough-0.4,tB=c.back-0.4,BA=PK.pace(ctx,"carmen",sn_boardA(sc,w)),N2=PK.pace(ctx,null,sn_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // position and interest (Carmen, at the team's board)
    {at:0,place:"snTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=sn_lesson(x,tt,{rows:BA,jun:Object.assign({work:1,pose:undefined},sn_alive(tt,{},2,0)),clock:10,events:SN_HEV});
      sn_name(x,R.at,tt,0.4,tZ-0.3,"Carmen Vidal","Consultant",160);}},
    {at:tZ,cut:true,place:"snBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.book,E.position]],events:SN_HEV});}},
    // Wednesday 14 July: Helena asks Clara what the date is for
    {at:tW,place:"snCorner",dis:0.6,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_corner(x,tt,{t0:tW,who1:"helena",who2:SN_CLARA,book:true,hf:sn_sp(tt,1,[[w("wed","ask",0),E.wed]],"listen",0.3),
        iface:sn_sp(tt,2,[[c.budget+0.2,E.budget],[c.new+0.2,E.new]],"think",0.3)});
      sn_bub(x,R.who1,tt,w("wed","ask",0),c.budget-0.2,["What is the date for?"],cam,{lean:160});
      sn_bub(x,R.who2,tt,c.budget+0.2,c.new-0.2,["The budget round closes","on 17 September."],cam,{lean:-160});
      sn_bub(x,R.who2,tt,c.new+0.2,tE-0.3,["A new model would warn us","early, for December."],cam,{lean:-160});}},
    // what the budget needs: Noor's notebook
    {at:tE,place:"snNotes",dis:0.6,keys:[[tE,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"noor",tt,N2,{});}},
    // Helena says it back; Clara nods
    {at:tB,place:"snCorner",dis:0.6,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_corner(x,tt,{t0:tB,who1:"helena",who2:SN_CLARA,book:true,hf:sn_sp(tt,1,[[c.back+0.1,c.back+2.6]],"listen",0.3),
        iface:Object.assign(sn_sp(tt,2,[[w("back","nods",0.3),E.back]],"smile",0.3),{})});
      sn_bub(x,R.who1,tt,c.back+0.1,w("back","nods",0),["A number to trust,","and early warning?"],cam,{lean:160});
      sn_bub(x,R.who2,tt,w("back","nods",0.2),1e9,["That's what it's for."],cam,{lean:-160});}}
  ]);
  sn_card(ctx,S,t,tW+0.3,w("wed","ask",-0.2),{kick:"Wednesday 14 July",title:"Helena and Noor meet Clara"},{y:40,mid:true});
  sn_kick(ctx,S,ag_in(t,0.6,0.6)*(1-sn_apart(t,[[tW,c.wed+1.4],[tE,tB]])));
});

/* ---------------------------------------------------------------- 4. The trade-off, in the open */
scene("open",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),CA=PK.ROOMS.campus;
  const tO=c.order-0.4,tZ=c.order+2.2,tP=c.options-0.4,BB=PK.pace(ctx,"carmen",sn_boardB(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // both asks on the one list, side by side, with their dates, what they're for, and their weeks
    {at:0,place:"snTeam",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_atRoom(x,tt,0,{at:"helena",noor:true,face:sn_alive(tt,{expr:"think",gaze:[1,0.3]},3,0)});
      sn_screenCall(x,R,ag_io(tt,c.side+0.2,c.weeks-0.3,0.4),"The one list",[["rooms' data · 31 Aug · timetable",PK.C.orange,32],["new model · 31 Aug · budget",PK.C.orange,32]],PK.C.blue,{bh:250,bw:760});
      const rf=ag_in(tt,c.refresh,0.4)>0.5;
      sn_screenCall(x,R,ag_io(tt,c.weeks+0.2,tO-0.3,0.4),"Weeks of work",[],PK.C.amber,{by:60,bh:350,bw:760,bars:[["rooms' data · 3 of August's 4",3,6,PK.C.orange],["new model · 6, and tests",6,6,PK.C.amber],[rf?"refresh · 1":"",rf?1:0,6,PK.C.green]]});}},
    // the order: value and effort, never who asks; fair criteria (Carmen)
    {at:tO,place:"snTeam",later:true,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{sn_lesson(x,tt,{rows:BB,jun:Object.assign({work:1,pose:undefined},sn_alive(tt,{},2,0)),clock:11,events:SN_HEV});}},
    {at:tZ,cut:true,place:"snBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.order,E.fair]],events:SN_HEV});}},
    // options that serve both: Helena, Clara and Mei on the campus
    {at:tP,place:"snCampus",dis:0.6,keys:[[tP,900,570,1.1]],d:2,draw:(x,tt,cam)=>{let Jh=null;
      PK.person(x,"mei",1340,CA.near-110,sn_hC(CA.near-110),"clasp",Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"think",gaze:[1,0.2]},2,tP)));
      PK.person(x,SN_CLARA,1080,CA.near-50,sn_hC(CA.near-50),"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},sn_alive(tt,{expr:"listen",gaze:[1,0.2]},3,tP)));
      Jh=PK.person(x,"helena",700,CA.near,sn_hC(CA.near),"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},sn_sp(tt,1,[[c.options+0.3,E.options]],"think",0.2)));
      sn_bub(x,Jh,tt,c.options+0.3,1e9,["The budget by September,","early warning by December?"],cam,{lean:-160});}}
  ]);
  sn_kick(ctx,S,ag_in(t,0.6,0.6)*(1-sn_apart(t,[[tP,1e9]])));
});

/* ---------------------------------------------------------------- 5. A no, and what instead */
scene("offer",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tZ=c.ury+2.2,tD=c.dam-0.4,tY=c.yes-0.4,tW=w("october","admissions",-0.2),BC=PK.pace(ctx,"carmen",sn_boardC(sc,w)),N3=PK.pace(ctx,null,sn_note3(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // a positive no (Carmen, at the team's board)
    {at:0,place:"snTeam",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{sn_lesson(x,tt,{rows:BC,jun:Object.assign({work:1,pose:undefined},sn_alive(tt,{},2,0)),clock:14,events:SN_HEV});}},
    {at:tZ,cut:true,place:"snBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.ury,E.ury]],events:SN_HEV});}},
    // the Kok-Aral dam was one
    {at:tD,place:"snpDam",dis:0.8,keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      snp_person(x,"worker2",1240,890,"clasp",Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tD)));
      snp_person(x,"worker1",720,960,"stand",Object.assign({t:tt},sn_alive(tt,{expr:"smile",gaze:[1,0.3]},1,tD)));}},
    // Helena's offer, in her notebook
    {at:tY,place:"snNotes",dis:0.6,keys:[[tY,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}},
    // would that work? It's Clara's to choose; she agrees, and both dates go on the list
    {at:tW,place:"snCorner",dis:0.6,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_corner(x,tt,{t0:tW,who1:"helena",who2:SN_CLARA,laptop:true,hf:sn_sp(tt,1,[[c.work+0.1,E.work],[w("choose","If",0),E.choose]],"listen",0.3),
        iface:sn_sp(tt,2,[[c.agrees+0.1,c.agrees+1.6]],"think",0.3),handN:[830,616],handF:[856,606]});
      sn_bub(x,R.who1,tt,c.work+0.1,c.choose-0.2,["Would that work?"],cam,{lean:160});
      sn_bub(x,R.who1,tt,w("choose","If",0),c.agrees-0.2,["If not, the data council","decides, on 27 July."],cam,{lean:160});
      sn_bub(x,R.who2,tt,c.agrees+0.1,w("agrees","in writing",-0.4),["That works."],cam,{lean:-160});
      PK.callout(x,40,520,480,220,R.laptop,ag_io(tt,w("agrees","in writing",-0.2),1e9,0.4),(cc,bx,by,bw,bh)=>sn_panel(cc,bx,by,bw,bh,"The one list",[["refresh · Fri 27 Aug",PK.C.green,34],["new model · Fri 29 Oct",PK.C.green,34]],null,PK.C.blue));}}
  ]);
  sn_kick(ctx,S,ag_in(t,0.6,0.6)*(1-sn_apart(t,[[tD,tW]])));
});

/* ---------------------------------------------------------------- 6. Kept, on time */
scene("kept",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tS=c.sep-0.4,tO=c.oct-0.4,tN=c.next-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // Friday 27 August: the refreshed model goes to Planning
    {at:0,place:"snTeam",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const CH={title:"Clara Jensen",who:[SN_CLARA],me:"helena",msgs:[{who:"helena",s:"The refreshed model is in Planning's folder.",at:c.aug+1.0,type:1.6},{who:SN_CLARA,s:"Thank you. In time for the budget.",at:c.aug+3.6,type:1.4}]};
      sn_phone(x,tt,0,tS-0.3,CH,PK.face(tt,{expr:"think",gaze:[1,0.9]},[[c.aug+4.6,"smile",2.0]]),{clock:16,noor:true,by:250});}},
    // Friday 17 September: the budget closes, with Planning's numbers in it
    {at:tS,place:"snCorner",dis:0.6,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_corner(x,tt,{t0:tS,who1:SN_CLARA,laptop:true,hf:sn_alive(tt,{expr:"smile",gaze:[1,0.6]},1,tS),handN:[830,616],handF:[856,606]});
      PK.callout(x,1060,150,720,250,R.laptop,ag_io(tt,c.sep+0.6,tO-0.3,0.4),(cc,bx,by,bw,bh)=>sn_panel(cc,bx,by,bw,bh,"Budget 2028",[["student numbers · in",PK.C.green,34]],null,PK.C.blue));}},
    // Friday 29 October: the new model is ready, reviewed
    {at:tO,place:"snTeam",dis:0.6,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_atRoom(x,tt,tO,{at:"noor",sam:null,face:sn_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tO),people:[sn_helena(tt,sn_alive(tt,{expr:"smile",gaze:[1,0.1]},5,tO),{x:1560,fl:930})]});
      sn_screenCall(x,R,ag_io(tt,c.oct+3.2,tN-0.3,0.4),"The new model",[["applications, week by week",PK.C.orange,34],["reviewed · ready",PK.C.green,34]],PK.C.blue,{bh:250});}},
    // November: Clara brings the next request early, in person
    {at:tN,place:"snCorner",cut:true,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=sn_corner(x,tt,{t0:tN,who1:"helena",who2:SN_CLARA,sheets:true,hf:sn_alive(tt,{expr:"smile",gaze:[1,0.3]},1,tN),iface:sn_sp(tt,2,[[c.next+0.4,E.next]],"smile",0.3)});
      sn_bub(x,R.who2,tt,c.next+0.4,1e9,["Our next request: what it's","for, and when we need it."],cam,{lean:-160});}}
  ]);
  sn_card(ctx,S,t,0.3,c.aug+3.4,{kick:"Friday 27 August",title:"The refreshed model goes to Planning"},{y:40,mid:true});
  sn_card(ctx,S,t,tS+0.3,c.sep+3.0,{kick:"Friday 17 September",title:"The budget round closes"},{y:40,mid:true});
  sn_card(ctx,S,t,tO+0.3,c.oct+3.0,{kick:"Friday 29 October",title:"The new model is ready"},{y:40,mid:true});
  sn_card(ctx,S,t,tN+0.3,c.next+0.2,{kick:"November",title:"Planning's next request"},{y:40,mid:true});
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tH=c.helena-0.4,tN=c.ask-0.1,tL=c.next-0.4,tE=c.breath+0.6,BM=PK.pace(ctx,"helena",sn_boardM(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // at the Aral, the northern sea came back
    {at:0,place:"snpHarbour",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{snp_water(x,1);snp_boat(x,1420,600,0.5,0);
      snp_person(x,"woman1",1180,890,"clasp",Object.assign({t:tt,flip:true},sn_alive(tt,{expr:"smile",gaze:[1,0.1]},2,0)));
      snp_person(x,"fisher2",660,960,"stand",Object.assign({t:tt},sn_alive(tt,{expr:"smile",gaze:[1,0.1]},1,0)));}},
    // Helena did the same
    {at:tH,place:"snTeam",dis:0.8,keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      sn_atRoom(x,tt,tH,{at:"noor",sam:null,face:sn_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tH),people:[sn_helena(tt,sn_alive(tt,{expr:"smile",gaze:[1,0.1]},5,tH),{x:1560,fl:930})]});}},
    {at:tN,place:"snBoard",cut:true,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BM,{say:[],events:SN_HEV});}},
    // never a bare no
    {at:tL,place:"snTeam",cut:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      sn_atRoom(x,tt,tL,{at:"noor",sam:null,face:sn_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tL),people:[sn_helena(tt,sn_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tL),{x:1560,fl:930})]});}}
  ]);
  sn_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6)));
  PK.end(ctx,S,t,tE,"Saying no, and what instead",SN_LAST,"Film 3 of 3","Working with people",{side:"right"});
});
ag_cutInto(["asks","date","open","offer","kept","monday"]);
