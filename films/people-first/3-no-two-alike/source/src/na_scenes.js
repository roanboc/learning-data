/* ===== No two alike: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says. The ideas are explained at a board, by Carmen
   Vidal, a consultant, or by Helena; what to keep is a page of a notebook (na_uni.js). Every time comes from the voice: a line's start
   (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded again; the score (tools/score.py) takes the
   same words. Sizes are in the 1920 x 1080 frame; people's sizes come from each place's eye line. */
const na_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,3,"No two alike",a);}};
function na_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const na_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const na_bub=(x,J,tt,t0,t1,lines,cam,o)=>PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));
const na_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
// while a chapter shows a key idea apart from the scene (a board seen close, a page of the notebook), its kicker steps back
const na_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const na_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};


// Marta at her desk, turned to her screen or to the room; who: more people in the room ({fl, draw})
const na_marta=(o)=>Object.assign({work:1,turn:0},o||{});
// someone who comes to a desk: walks in from x0 to x1 between t0 and t1, then stands (pose), flipped to face left when x1 < x0
const na_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=x1<x0;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{}));};
// a listener's nods and looks, every few seconds, for whoever stands at a board between rows
const NA_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
// the team's room, all seven, Helena at its board (o.rows); o.faces: {who: PK.face's result}
function na_seven(x,tt,o){o=o||{};const f=k=>(o.faces||{})[k]||na_alive(tt,{expr:"listen",gaze:[1,-0.2]},{sam:0,jun:1,marta:2,noor:3,yusuf:4,erin:5,tomas:6}[k],0);let Jh=null;
  na_team(x,tt,{clock:o.clock||15,sam:null,jun:Object.assign({work:0,pose:"sit"},f("jun")),marta:Object.assign({turn:1,work:0,pose:"sit"},f("marta")),people:[
    {fl:NA_RB.floor,draw:cc=>{Jh=na_roomBoard(cc,tt,o.rows||[],"helena",{say:o.say,events:o.hev||NA_HEV});}},
    {fl:NA_SAMC.floor,draw:cc=>PK.seated(cc,"sam",NA_SAMC.x,NA_SAMC.floor,na_hT(NA_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},f("sam")))},
    {fl:875,draw:cc=>PK.person(cc,"noor",1690,875,na_hT(875),"clasp",Object.assign({t:tt+2,flip:true},f("noor")))},
    {fl:935,draw:cc=>PK.person(cc,"yusuf",380,935,na_hT(935),"clasp",Object.assign({t:tt+3},f("yusuf")))},
    {fl:925,draw:cc=>PK.seated(cc,"erin",1640,925,na_hT(925),"sit",Object.assign({t:tt+5,flip:true},f("erin")))},
    {fl:965,draw:cc=>PK.person(cc,"tomas",200,965,na_hT(965),"ease",Object.assign({t:tt+6},f("tomas")))}]});return Jh;}
function na_audience(x,tt,n,look){const seats=PK.seats({}),order=[5,1,9,6,2,8,0,10,4,7,3],taken={};order.slice(0,n).forEach((s,i)=>taken[s]=i);
  seats.forEach((s,i)=>{const ch=PK.PAL[i%2?"chair2":"chair"];if(taken[i]==null){PK.S.begin(x,{lw:PK.u.clamp(s.h*0.0056,1.4,6.5),sh:4});PK.chair(x,s.x-0.012*s.h,s.fl,s.h,false,{col:ch});return;}
    PK.seated(x,PK.extra(i+3),s.x,s.fl,s.h,PK.poseMix("sit","sitBack",(i*0.37)%1),Object.assign({t:tt+i*1.7,chair:ch,shade:0},na_alive(tt,{expr:"listen",gaze:[1,-look]},(i*3)%7*0.7)));});}
const NA_LAST="Ask each person how they work. Never sort them.";
// a face that speaks over each span of [t0, t1], on a base expression
const na_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
// someone in Lu: alive (a look, a nod, a smile now and then), speaking over spans, leaning in (k) to speak
const na_luF=(tt,i,base,spans,g)=>na_alive(tt,{expr:na_talk(base||"listen",tt,spans||[]),gaze:[1,g==null?0.1:g]},i);

/* ---------------------------------------------------------------- 1. Two answers */
// the hall in Lu: the teacher on his mat, facing the three; o.talk: spans each speaks; o.lean: how far each leans in; o.gift (0 to 1)
function na_hall(x,tt,o){o=o||{};const T=o.talk||{},L=o.lean||{},E=o.expr||{},r={},U=PK.u;
  const pose=k=>PK.poseMix(NA_SEIZA,NA_SEIZA2,L[k]||0);
  const items=[
    {fl:NA_SEAT.lu5[1],draw:c=>{if(o.lu5)r.lu5=o.lu5(c);}},
    {fl:NA_SEAT.gongxi[1],draw:c=>{r.gongxi=na_lu(c,"gongxi",NA_SEAT.gongxi[0],NA_SEAT.gongxi[1],pose("gongxi"),Object.assign({t:tt+2},na_luF(tt,3,E.gongxi,T.gongxi,0.05)));}},
    {fl:NA_SEAT.ranyou[1],draw:c=>{r.ranyou=na_lu(c,"ranyou",NA_SEAT.ranyou[0],NA_SEAT.ranyou[1],pose("ranyou"),Object.assign({t:tt+1},na_luF(tt,1,E.ranyou,T.ranyou,0.1)));}},
    {fl:NA_SEAT.kong[1],draw:c=>{r.kong=na_lu(c,"kong",NA_SEAT.kong[0],NA_SEAT.kong[1],pose("kong"),Object.assign({t:tt,flip:true},na_luF(tt,0,E.kong||"neutral",T.kong,0.15)));
      if(o.gift>0.004){const a=U.clamp(o.gift,0,1);c.save();c.globalAlpha*=a;na_bundle(c,[1218,NA_SEAT.kong[1]-12]);c.restore();}}},
    {fl:NA_SEAT.zilu[1],draw:c=>{r.zilu=na_lu(c,"zilu",NA_SEAT.zilu[0],NA_SEAT.zilu[1],pose("zilu"),Object.assign({t:tt+3},na_luF(tt,2,E.zilu,T.zilu,0.12)));}}];
  items.sort((a,b)=>a.fl-b.fl).forEach(i=>i.draw(x));return r;}
// whoever brings the smallest gift: a newcomer walks in with it, sets it at the teacher's mat, and kneels on his own mat
function na_newcomer(c,tt,t0,t1,tk){const [sx,fl]=NA_SEAT.lu5;
  if(tt<t1)return na_luWalk(c,"lu5",tt,{x0:-140,x1:sx,t0,t1,floor:fl,then:"stand"},Object.assign({hold:na_bundle,holds:true},na_alive(tt,{expr:"smile",gaze:[1,0.1]},4,t0)));
  return na_lu(c,"lu5",sx,fl,PK.poseMix("stand",NA_SEIZA,PK.u.sine(PK.u.clamp((tt-t1)/0.5,0,1))),Object.assign({t:tt},na_alive(tt,{expr:"smile",gaze:[1,0.1]},4,t1)));}
scene("lu",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,luT=c.where-0.6;
  const N1=PK.pace(ctx,null,na_note1(sc,w)),gW=w("gift","Whoever",-0.6),gA=w("gift","is taught",-0.6),gift=ag_in(t,gA+0.6,0.3);
  ag_shots(ctx,S,t,sc.dur,[
    // above Quehue, the grass the bridge is made of: three people cut and tie it, each their own way, and someone carries a bundle
    // off towards the gorge, where the bridge is a thin line far off. The camera starts towards it, and leaves it for the grass
    {at:0,place:"naPuna",keys:[[0,1060,500,1.1],[c.aside-0.2,820,600,1.18],[w("aside","One blade",-0.3),700,640,1.3],[w("aside","a person",-0.4),960,560,1.06]],d:2.2,draw:(x,tt,cam)=>{
      const pw=w("aside","a person",0);nap_work(x,tt,{t0:0,look:{elder:pw+0.2,young:pw+0.9,man:pw+1.5}});}},
    // Lu: the teacher's hall. One room, so the camera only glides; a newcomer brings his gift and kneels
    {at:luT,place:"naLu",dis:1.6,keys:[[luT,960,560,1.0],[c.teacher-0.2,1180,600,1.22],[gW,960,560,1.0],[c.bold-0.2,820,620,1.1],[c.rule-0.2,820,640,1.2],
        [c.zilu-0.3,900,600,1.08],[c.third-0.3,860,580,1.04],[c.person,900,600,1.12],[c.count-0.3,960,560,1.0]],d:3,draw:(x,tt,cam)=>{
      const R=na_hall(x,tt,{gift,
        talk:{kong:[[w("bold","tells",0),E.bold],[w("holds","tells",0),E.holds],[w("first","says",0),E.first],[w("ranyou","says",0),E.ranyou],[w("why","tells",0),E.why],[w("office","says",0),E.office]],
          zilu:[[w("zilu","when",-0.1),E.zilu]],ranyou:[[w("ranyou","asks",-0.1),w("ranyou","question",0.4)]],gongxi:[[w("third","confused",-0.4),E.third]]},
        lean:{zilu:ag_io(tt,w("tell","go ahead",-0.3),c.need,0.4)+0.6*ag_io(tt,w("zilu","asks",-0.2),E.zilu,0.4),ranyou:ag_io(tt,w("ranyou","asks",-0.3),E.ranyou,0.4),
          gongxi:ag_io(tt,w("third","confused",-0.6),E.third,0.4),kong:ag_io(tt,w("why","tells",-0.3),E.why,0.5)},
        expr:{zilu:ag_io(tt,w("tell","go ahead",-0.3),c.need,0.4)>0.5?"smile":tt>c.fit&&tt<c.office?"smile":"listen",ranyou:ag_io(tt,w("tell","wait",-0.3),c.need,0.4)>0.5?"worry":tt>c.fit&&tt<c.office?"smile":"listen",
          gongxi:tt>w("third","confused",-0.6)&&tt<c.why?"think":"listen"},
        lu5:c=>tt>gW-0.2?na_newcomer(c,tt,gW,gA,0):null});
      na_name(x,R.kong,tt,w("teacher","Kong",-0.2),gW-0.4,"Kong Qiu","Confucius",170);
      na_name(x,R.zilu,tt,c.bold,c.holds-0.4,"Zilu",null,150);
      na_name(x,R.ranyou,tt,c.holds,c.rule-0.4,"Ran You",null,150);
      na_name(x,R.gongxi,tt,w("third","Gongxi",-0.2),w("third","confused",-0.8),"Gongxi Hua",null,150);
      na_bub(x,R.kong,tt,w("bold","tells",0.1),E.bold+0.6,["I wouldn't take to war a man","who fights tigers bare-handed."],cam);
      na_bub(x,R.kong,tt,w("holds","tells",0.1),E.holds+0.6,["It isn't strength you lack.","You set your own limit."],cam);
      na_bub(x,R.zilu,tt,w("zilu","when",-0.2),E.zilu+0.4,["When I hear something,","should I act on it at once?"],cam);
      na_bub(x,R.kong,tt,w("first","says",0.1),E.means+0.4,["Your father and elder brothers are alive.","How can you act at once?"],cam);
      na_bub(x,R.ranyou,tt,w("ranyou","asks",-0.1),w("ranyou","teacher",-0.3),["When I hear something,","should I act on it at once?"],cam);
      na_bub(x,R.kong,tt,w("ranyou","act",-0.1),E.ranyou+0.8,["Act at once."],cam);
      na_bub(x,R.gongxi,tt,w("third","confused",-0.5),E.third+0.4,["I'm confused.","May I ask?"],cam);
      na_bub(x,R.kong,tt,w("why","tells",0.1),E.why+0.6,["Ran You holds back, so I urged him on.","Zilu has the energy of two, so I held him back."],cam);
      na_bub(x,R.kong,tt,w("office","says",0),E.office+0.4,["Yes, both: one is decisive,","the other skilled."],cam);}},
    // and a data team: the seven in their room, with Helena; no two alike
    {at:c.team-0.4,place:"naTeam",dis:1.2,keys:[[c.team-0.4,960,540,1.0]],d:3,draw:(x,tt,cam)=>{na_seven(x,tt,{clock:10});}},
    {at:c.each-0.4,place:"naNotes",dis:0.6,keys:[[c.each-0.4,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N1,{});}}
  ]);
  na_card(ctx,S,t,0.8,c.aside-0.6,{kick:"Quehue, Cusco, Peru",title:"Q'oya, the grass of the bridge"},{y:40,mid:true});
  na_card(ctx,S,t,c.where+0.3,c.teacher-0.5,{kick:"Lu, now eastern China",title:"About 2,500 years ago"},{y:40,mid:true});
  na_card(ctx,S,t,w("count","counts",0),c.team-0.8,{kick:"A historian, centuries later",title:"77 students mastered what he taught",col:PK.C.green},{y:40,mid:true});
  na_imagined(ctx,S,t,c.team+0.4,c.each-0.6,"The university, 2027 · imagined");
  PK.title(ctx,S,t,c.breath+0.2,"No two alike","Ask each person how they work","Leading data people · People first",{side:"right"});
});

/* ---------------------------------------------------------------- 2. Erin's silence */
scene("silence",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tN=c.note-0.6,tA=c.ask-0.6,tK=c.known-0.5,BP=PK.pace(ctx,"helena",na_boardP(sc,w)),N2=PK.pace(ctx,null,na_note2(sc,w));
  const said=(i,t0)=>na_alive(t,{expr:na_talk("smile",t,[[t0,t0+2.2]]),gaze:[1,-0.1]},i);
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 15 February: the eight plan two weeks; everyone talks in turn but Erin, who says nothing
    {at:0,place:"naTeam",keys:[[0,960,540,1.0],[c.quiet-0.3,1300,580,1.16],[c.guess,1060,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const faces={jun:said(1,c.plan+1.2),noor:said(3,c.plan+3.4),yusuf:said(4,c.quiet+0.4),tomas:said(6,c.quiet+3.0),
        erin:na_alive(tt,{expr:"neutral",gaze:[1,0.5]},5)};
      na_seven(x,tt,{clock:10,rows:BP,faces,say:[[c.plan,E.guess]]});}},
    // Tuesday morning: Erin's note comes in on Helena's phone, at her corner
    {at:tN,place:"naCorner",cut:true,keys:[[tN,960,540,1.0],[c.miss,920,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const R=na_corner(x,tt,{t0:tN-4,hold:PK.inHand.phone,he:"think",hf:PK.face(tt,{expr:"neutral",gaze:[1,0.6]},[[c.note+1.6,"look",2.4,[1,0.6]],[c.miss+2.4,"nod"]])});
      const ph=R.helena&&R.helena.hdN?R.helena.hdN:[790,640];
      PK.callout(x,980,60,780,400,ph,ag_io(tt,w("note","sends",-0.4),tA-0.4,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,{title:"Erin Walsh",who:["erin"],me:"helena",
        msgs:[{who:"erin",s:"Two things the plan missed.",at:w("note","short note",0)},{who:"erin",s:"Week 2: the upgrade and the new login",at:w("miss","can't",-0.4)},{who:"erin",s:"can't both be tested.",at:w("miss","can't",0.6)}]},tt,{}));}},
    // Wednesday: Erin's half hour. Helena asks instead of guessing
    {at:tA,place:"naCorner",later:true,keys:[[tA,960,540,1.0],[c.after,940,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const R=na_corner(x,tt,{t0:tA-6,who2:"erin",book:true,lean:0.6,he:na_talk("smile",tt,[[w("ask","asks",-0.1),E.ask]]),hf:PK.face(tt,{gaze:[1,0.1]},[[c.after+1.0,"nod"],[c.after+4.4,"smile",2.4]]),
        ie:na_talk("smile",tt,[[w("after","Erin says",0.4),E.after]]),iface:PK.face(tt,{gaze:[1,0.2]},[[c.ask+2.6,"look",2.4,[1,0.3]],[w("ask","how do you",0.4),"nod"]])});
      na_bub(x,R.helena,tt,w("ask","how do you",-0.3),E.ask+0.6,["How do you work best","in a meeting like Monday's?"],cam);
      na_bub(x,R.who2,tt,w("after","I think",-0.2),E.after+0.8,["I think after a meeting, not in it.","Send me the question the day before,","and I'll come with an answer."],cam);}},
    {at:tK,place:"naNotes",dis:0.6,keys:[[tK,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N2,{});}}
  ]);
  na_imagined(ctx,S,t,0.2,c.plan-0.3,"The university, 2027 · imagined");
  na_card(ctx,S,t,0.6,c.plan-0.3,{kick:"February 2027",title:"Helena's third week"},{y:40,mid:true});
  na_card(ctx,S,t,c.plan+0.2,c.quiet-0.4,{kick:"Monday 15 February",title:"Two weeks, planned"},{y:40,mid:true});
  na_card(ctx,S,t,tN+0.4,w("note","short note",-0.6),{kick:"Tuesday morning",title:"A note from Erin"},{y:40,mid:true});
  na_card(ctx,S,t,tA+0.4,w("ask","how do you",-0.6),{kick:"Wednesday",title:"Erin's half hour"},{y:40,mid:true});
  na_kick(ctx,S,ag_in(t,c.quiet,0.6)*(1-na_apart(t,[[tN,tN+3],[tA,tA+3],[tK,1e9]])));
});

/* ---------------------------------------------------------------- 3. By degree */
scene("degree",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tZ=w("how","five broad",-1.0),tD=c.days-0.5,tR=c.right-0.5,tB=c.never-0.6,BA=PK.pace(ctx,"carmen",na_boardA(sc,w)),BB=PK.pace(ctx,"carmen",na_boardB(sc,w)),N3=PK.pace(ctx,null,na_note3(sc,w));
  const talk=(t0,t1)=>PK.face(t,{expr:na_talk("smile",t,[[t0,t1]]),gaze:[1,0]},[[t1+1,"nod"]]);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"naTeam",keys:[[0,960,540,1.0],[tZ,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{na_lesson(x,tt,{clock:11,rows:BA,marta:Object.assign({turn:1,work:0},na_lis(tt,-0.2)),say:[[c.how,E.scale]]});}},
    {at:tZ,cut:true,place:"naBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.how,E.how],[c.five,E.five],[c.scale,E.scale]]});}},
    {at:tD,place:"naNotes",dis:0.6,keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}},
    // a team has a use for each: the one who rushes ahead and the one who holds back, who thinks aloud and who thinks afterwards
    {at:tR,place:"naTeam",dis:0.8,keys:[[tR,960,540,1.0],[c.team,1100,560,1.08]],d:3,draw:(x,tt,cam)=>{
      na_seven(x,tt,{clock:11.5,faces:{jun:talk(w("team","rushes",-0.4),w("team","holds back",-0.4)),tomas:talk(w("team","thinks aloud",-0.4),w("team","afterwards",-0.6)),
        erin:PK.face(tt,{expr:"think",gaze:[1,0.5]},[[w("team","afterwards",-0.2),"look",2.6,[1,0.2]],[E.team+0.6,"smile",2.2]])}});}},
    {at:tB,place:"naBoard",cut:true,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.never,E.never],[c.outcomes,E.outcomes]]});}}
  ]);
  na_kick(ctx,S,ag_in(t,0.6,0.6)*(1-na_apart(t,[[tZ,tR],[tB,1e9]])));
});

/* ---------------------------------------------------------------- 4. A scale, cut in two */
scene("cut",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tT=c.type-0.6,tZ=Math.max(w("type","scale",-1.0),tT+1.8),tY=c.yes-0.6,tS=c.start-0.5,BC=PK.pace(ctx,"carmen",na_boardC(sc,w)),BR=PK.pace(ctx,"helena",na_boardR(sc,w)),N4=PK.pace(ctx,null,na_note4(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday: Yusuf comes over to Helena with his idea
    {at:0,place:"naTeam",keys:[[0,960,540,1.0],[c.test,900,560,1.1]],d:3,draw:(x,tt,cam)=>{let Jy=null;
      const k=ag_in(tt,c.type-1.8,0.5);na_team(x,tt,{clock:14,sam:null,jun:Object.assign({work:1-k,pose:PK.poseMix("sitWork","sit",k)},na_alive(tt,{},2,0)),marta:Object.assign(na_marta({turn:k,work:1-k}),na_alive(tt,{},3,0)),
        people:[{fl:905,draw:cc=>PK.person(cc,"helena",930,905,na_hT(905),"clasp",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"listen",gaze:[1,0]},[[c.test+1.4,"nod"],[c.test+5.2,"look",2.2,[1,0.2]],[c.type-1.6,"smile",2.2]])))},
          {fl:925,draw:cc=>{Jy=na_come(cc,"yusuf",tt,2150,1180,0.4,c.idea+1.6,925,na_hT(925),{face:PK.face(tt,{expr:na_talk("smile",tt,[[w("test","In",-0.1),E.test]]),gaze:[1,0]},[[E.test+0.8,"nod"]])});}}]});
      na_name(x,Jy,tt,c.idea+1.8,c.test-0.2,"Yusuf Demir","Data engineer",160);
      na_bub(x,Jy,tt,w("test","In",0),E.test+0.6,["At my last job, a type test","gave us words for our differences."],cam);}},
    // what a type is: Carmen at the team's board
    {at:tT,place:"naTeam",later:true,keys:[[tT,960,540,1.0],[tZ,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{na_lesson(x,tt,{clock:14.2,rows:BC,marta:Object.assign({turn:1,work:0},na_lis(tt,-0.2)),say:[[c.type,E.steady]]});}},
    {at:tZ,cut:true,place:"naBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.type,E.type],[c.middle,E.middle],[c.again,E.again],[c.steady,E.steady]]});}},
    // Helena says yes, with four rules, at the team's board, all seven there
    {at:tY,place:"naTeam",cut:true,keys:[[tY,1010,530,1.08],[c.rules1,960,540,1.0]],d:2,draw:(x,tt,cam)=>{na_seven(x,tt,{clock:14.5,rows:BR,say:[[c.yes,E.makers]],
      faces:{yusuf:PK.face(tt,{expr:"smile",gaze:[1,0]},[[c.yes+1.0,"nod"],[c.rules2+2,"look",2.4,[1,0.2]],[c.makers+0.6,"nod"]])}});}},
    {at:tS,place:"naNotes",dis:0.6,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}}
  ]);
  na_card(ctx,S,t,0.6,c.test-0.3,{kick:"Thursday 18 February",title:"Yusuf's idea"},{y:40,mid:true});
  na_kick(ctx,S,ag_in(t,0.6,0.6)*(1-na_apart(t,[[tZ,tY],[tS,1e9]])));
});

/* ---------------------------------------------------------------- 5. How I work */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tP=c.heads1-0.6,tF=c.first-0.5,tV=c.seven-0.5,tE=c.erin-0.5,tK=c.nokind-0.4,N5=PK.pace(ctx,null,na_note5(sc,w)),NE=PK.pace(ctx,null,na_noteE(sc,w)),BS=PK.pace(ctx,"helena",na_boardS(sc,w));
  const wr=(i)=>Object.assign({work:1},na_alive(t,{expr:"think",gaze:[1,0.4]},i,0));
  ag_shots(ctx,S,t,sc.dur,[
    // what the team keeps: a page each writes in their own words
    {at:0,place:"naTeam",keys:[[0,960,540,1.0],[tP,900,560,1.06]],d:3,draw:(x,tt,cam)=>{na_team(x,tt,{clock:15,sam:wr(1),jun:wr(2),marta:Object.assign(na_marta({}),na_alive(tt,{expr:"think"},3,0))});}},
    {at:tP,place:"naNotes",dis:0.6,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N5,{});}},
    // Helena's page, first: she shows it to Marta, and reads the last heading
    {at:tF,place:"naCorner",dis:0.6,keys:[[tF,960,540,1.0],[c.hers,920,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const R=na_corner(x,tt,{t0:tF-5,who2:"marta",book:true,lean:0.4,he:na_talk("smile",tt,[[w("hers","asking",-0.3),E.hers+0.4]]),hf:PK.face(tt,{gaze:[1,0.1]},[[c.first+1.2,"look",2.2,[1,0.4]]]),
        ie:"listen",iface:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[c.hers+0.6,"nod"],[E.hers+0.8,"smile",2.4]])});
      na_bub(x,R.helena,tt,w("hers","asking",-0.4),E.hers+0.8,["What I'm getting better at:","asking, instead of guessing."],cam);}},
    // each of the seven writes one too; by Friday all seven have shared a page
    {at:tV,place:"naTeam",cut:true,keys:[[tV,960,540,1.0]],d:2,draw:(x,tt,cam)=>{na_seven(x,tt,{clock:16,rows:BS,say:[[c.friday,E.friday]]});}},
    {at:tE,place:"naNotes",dis:0.6,keys:[[tE,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"erin",tt,NE,{});}},
    {at:tK,place:"naTeam",dis:0.6,keys:[[tK,960,540,1.0],[sc.dur,1000,550,1.06]],d:3,draw:(x,tt,cam)=>{na_seven(x,tt,{clock:16.2,rows:BS});}}
  ]);
  na_card(ctx,S,t,tV+0.4,c.friday-0.3,{kick:"Thursday, then each of the seven",title:"A page each, shared by choice"},{y:40,mid:true});
  na_card(ctx,S,t,c.friday+0.2,c.erin-0.8,{kick:"Friday 26 February",title:"All seven have shared a page"},{y:40,mid:true});
  na_kick(ctx,S,ag_in(t,0.6,0.6)*(1-na_apart(t,[[tP,tF],[tE,tK]])));
});

/* ---------------------------------------------------------------- 6. For the whole range */
scene("range",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tS=c.speaks-0.6,tL=c.leader-0.6,tA=c.asks-0.5,tM=c.monday-0.5,tX=c.next-0.4,tE=c.breath+0.6,BM=PK.pace(ctx,"helena",na_boardM(sc,w)),N6=PK.pace(ctx,null,na_note6(sc,w));
  const erinF=PK.face(t,{expr:na_talk("smile",t,[[w("speaks","speaks",0),c.both+2.6]]),gaze:[1,-0.1]},[[c.change+0.6,"look",2.4,[1,0.1]],[c.ways2+1,"smile",2.4],[c.ways1+1.5,"nod"],[c.ways2+6,"nod"],[c.ways3+0.6,"look",2.2,[1,0.05]],[E.ways3+0.8,"nod"],[E.ways3+5,"look",2.4,[1,0.25]],[E.ways3+11,"smile",2.2],[c.both+3.4,"nod"],[c.both+5.4,"smile",2.2]]);
  ag_shots(ctx,S,t,sc.dur,[
    // she changes the meeting: four steps, at the team's board
    // that Monday, Erin speaks in her turn: the camera glides to her
    {at:0,place:"naTeam",later:true,dis:0.8,keys:[[0,960,540,1.0],[tS,960,540,1.0],[tS+1.6,1360,580,1.18]],d:2,draw:(x,tt,cam)=>{na_seven(x,tt,{clock:10,rows:BM,say:[[c.change,E.ways3]],faces:{erin:erinF}});}},
    // the teacher held one back and urged the other on
    {at:tL,place:"naLu",dis:1.0,keys:[[tL,900,600,1.08],[c.asks-0.5,960,560,1.0]],d:3,draw:(x,tt,cam)=>{na_hall(x,tt,{lean:{kong:ag_io(tt,c.leader,E.leader,0.5)},talk:{kong:[[w("leader","held",-0.2),E.leader]]},expr:{zilu:"smile",ranyou:"smile"}});}},
    // Helena asks, and each person says it for themselves
    {at:tA,place:"naCorner",dis:0.8,keys:[[tA,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      const R=na_corner(x,tt,{t0:tA-6,who2:"tomas",book:true,lean:0.5,he:na_talk("smile",tt,[[w("asks","Helena asks",0),w("asks","Helena asks",1.6)]]),hf:PK.face(tt,{gaze:[1,0.1]},[[w("asks","says",0.4),"nod"]]),
        ie:na_talk("smile",tt,[[w("asks","each person",-0.2),E.asks+0.6]]),iface:PK.face(tt,{gaze:[1,0.2]},[[c.asks+3.6,"look",2.2,[1,0.3]]])});
      na_bub(x,R.helena,tt,w("asks","Helena asks",-0.2),w("asks","each person",-0.4),["How do you work best?"],cam);}},
    {at:tM,place:"naNotes",dis:0.6,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N6,{});}},
    // the team, after: everyone at work
    {at:tX,place:"naTeam",dis:0.8,keys:[[tX,960,540,1.0],[sc.dur,1000,550,1.06]],d:3,draw:(x,tt,cam)=>{na_seven(x,tt,{clock:11,rows:BM,faces:{erin:PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[tX+3,"nod"]])}});}}
  ]);
  na_card(ctx,S,t,tS+0.4,c.both-0.3,{kick:"Monday 22 February",title:"Erin speaks in her turn"},{y:40,mid:true});
  na_card(ctx,S,t,c.next+0.3,E.next+0.6,{kick:"The next film",title:"How, more than who"},{right:true});
  na_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-na_apart(t,[[tL,tA],[tM,tX]])));
  PK.end(ctx,S,t,tE,"No two alike",NA_LAST,"Film 3 of 4","People first",{side:"right"});
});
// chapters that open on the same people in the same room as the chapter before ends: the film cuts
ag_cutInto(["range"]);
