/* ===== The question behind the request: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are written by hand: the committee's sheet in 1990, Carmen Vidal's board, and Noor's, Ivy's and Helena's notebooks (qb_uni.js).
   Pisa is in qbp_pisa.js. Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt). */
const qb_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,1,"The question behind the request",a);}};
function qb_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const qb_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const qb_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const qb_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const qb_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const qb_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const qb_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const qb_sp=(tt,i,spans,base,g)=>qb_alive(tt,{expr:qb_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const qb_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=o.flip!=null?o.flip:x1<x0;if(tt<t0)return null;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip:x1<x0},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{},o.hold?{hold:o.hold,holds:true}:{}));};
const QB_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const QB_LAST="Ask what it's for, and agree it in writing.";
// a screen's callout from the monitor at the desk by the window
const qb_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>qb_panel(cc,bx,by,bw,bh,head,rows,o.bars||null,hc));};
// the team's room with someone at the desk by the window (o.at, default Ivy); o.ivy: their face
const qb_atRoom=(x,tt,t0,o)=>{o=o||{};return qb_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:o.at||"ivy",marta:Object.assign({work:o.work==null?1:o.work,turn:0},o.ivy||qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
  sam:o.sam===null?null:Object.assign({work:1},qb_alive(tt,{},1,t0)),jun:o.jun===null?null:Object.assign({work:1},qb_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people:o.people||[]});};
// Graham's office: Graham and Helena at the round table, Noor beside them with her notebook (o.nw: she writes, 0 to 1)
const qb_office=(x,tt,t0,o)=>{o=o||{};let Jn=null;const R=qb_corner(x,tt,{t0,who1:"graham",who2:"helena",he:o.ge,hf:o.gf||qb_alive(tt,{expr:"listen",gaze:[1,0.3]},1,t0),
  iface:o.hf||qb_alive(tt,{expr:"listen",gaze:[1,0.3]},2,t0),laptop:o.laptop});
  const nw=o.nw||0;Jn=PK.person(x,"noor",1790,950,PK.hAt(950,QB_CO.eye),PK.poseMix("clasp",QB_NOTE,nw),Object.assign({t:tt+3,flip:true,underF:PK.inHand.notebook({}),hold:nw>0.3?PK.inHand.pen("blue"):null,holds:true},o.nf||qb_alive(tt,{expr:"listen",gaze:[1,0.2]},4,t0),nw>0.004?{gaze:[1,0.6*nw]}:{}));
  R.noor=Jn;return R;};

/* ---------------------------------------------------------------- 1. Saving a leaning tower */
scene("tower",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tP=c.pavia-0.4,tC=c.closed-0.4,tM=c.committee-0.4,tZ=w("meant","agreed",-1.4),tT=c.trial-0.4,tS=c.soil-0.4,tN=c.note-0.4,tL=c.less-0.4,tR=c.reopen-0.4,tD=c.data-0.4,tF=c.found-0.4;
  const BO=PK.pace(ctx,QBP_FOLK.eng1,qb_boardO(sc,w)),N5=PK.pace(ctx,null,qb_note5(sc,w));
  const lean=tt=>PK.u.lerp(QBP_LEAN0,QBP_LEAN1,ag_in(tt,c.soil+2,(c.reopen-1)-(c.soil+2)));
  const tower=(x,tt)=>qbp_tower(x,QBP_TW[0],QBP_TW[1],QBP_K,lean(tt));
  const visitors=(x,tt,t0,n)=>{
    for(const [i,x0,x1,ts,d,fl] of [[2,-120,700,t0+0.4,9,700],[8,2060,1500,t0+2.0,8,690]].slice(0,n))qbp_walk(x,PK.extra(i),tt,{x0,x1,t0:ts,t1:ts+d,floor:fl,then:"stand"},{flip:x1<x0,t:tt});
    qbp_person(x,PK.extra(4),420,820,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"smile",gaze:[1,-0.6]},1,t0)));
    qbp_person(x,PK.extra(11),1620,880,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"neutral",gaze:[1,-0.5]},2,t0)));};
  ag_shots(ctx,S,t,sc.dur,[
    // Pisa: the bell tower, leaning, and visitors on the lawn
    {at:0,place:"qbpSquare",keys:[[0,960,540,1.0],[c.lean,1000,540,1.08]],d:3,draw:(x,tt,cam)=>{tower(x,tt);visitors(x,tt,0,2);
      const J=qbp_person(x,"eng1",1060,1000,"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},qb_sp(tt,1,[[w("lean","each year",-0.6),E.lean]],"worry",-0.4)));
      qb_bub(x,J,tt,w("lean","each year",-0.6),tP-0.3,["Further out, every year."],cam,{lean:-160});}},
    // Pavia, March 1989: where a tower stood
    {at:tP,place:"qbpPavia",dis:0.8,keys:[[tP,960,540,1.0],[tC,960,520,1.06]],d:3,draw:(x,tt,cam)=>{
      qbp_person(x,PK.extra(5),620,880,"clasp",Object.assign({t:tt},PK.face(tt,{expr:"worry",gaze:[1,-0.2]},[[tP+2.6,"look",2.4,[1,0.2]]])));
      qbp_person(x,PK.extra(6),1440,930,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"worry",gaze:[1,0.1]},2,tP)));
      qbp_person(x,PK.extra(7),820,1000,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"worry",gaze:[1,-0.3]},3,tP)));}},
    // January 1990: Pisa's tower is closed; any work is a risk
    {at:tC,place:"qbpSquare",dis:0.8,keys:[[tC,960,540,1.0],[c.risk,1060,540,1.08]],d:3,draw:(x,tt,cam)=>{tower(x,tt);let Jr=null,Je=null;
      PK.S.begin(x,{lw:2.2,sh:2});PK.S.line(x,c2=>{c2.moveTo(1060,650);c2.lineTo(1380,650);for(let k=0;k<=8;k++){c2.moveTo(1060+k*40,636);c2.lineTo(1060+k*40,662);}},qbp_c("fence"),0.8);
      qbp_person(x,"guard",1300,760,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"neutral",gaze:[1,0.1]},1,tC)));
      Jr=qbp_person(x,"res1",520,860,"clasp",Object.assign({t:tt},qb_sp(tt,2,[[c.harm+0.2,E.harm]],"worry",-0.3)));
      qbp_person(x,PK.extra(4),760,800,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"worry",gaze:[1,-0.5]},3,tC)));
      Je=qbp_person(x,"eng1",1500,1000,"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},qb_sp(tt,4,[[c.risk+0.2,E.risk]],"worry",-0.3)));
      qb_bub(x,Jr,tt,c.harm+0.2,c.risk-0.2,["If it fell, on a busy day…"],cam,{lean:140});
      qb_bub(x,Je,tt,c.risk+0.2,tM-0.3,["Even digging near it","could bring it down."],cam,{lean:-180});}},
    // spring 1990: an international committee agrees what saving it would mean, and how
    {at:tM,place:"qbpOffice",cut:true,keys:[[tM,960,540,1.0],[tZ,960,540,1.0],[tZ+1.6,500,440,1.8],[c.trial-1.8,500,440,1.8]],d:3,draw:(x,tt,cam)=>{
      qbp_seat(x,"com2",1480,860,"sit",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"listen",gaze:[1,0.1]},1,tM)));
      PK.teach(x,QBP_FOLK.eng1,tt,BO,{x:QBP_BD.x,y:QBP_BD.y,k:QBP_BD.k,deco:true,floor:QBP_BD.floor,rest:QBP_BD.rest,h:qbp_hi(QBP_BD.floor),say:[[c.meant,E.method]],events:QB_HEV});
      qbp_seat(x,"eng2",1200,960,"sit",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"listen",gaze:[1,0.1]},2,tM)));
      qbp_seat(x,"com1",1680,1010,"sit",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"think",gaze:[1,0.1]},3,tM)));}},
    // they try it on a test footing, with lead on the tower's north side
    {at:tT,place:"qbpSite",cut:true,keys:[[tT,960,540,1.0],[tS,1000,540,1.04]],d:3,draw:(x,tt,cam)=>{
      qbp_tower(x,1100,QBP_SE+8,25,lean(tt));qbp_lead(x,940,QBP_SE+10,25,1);
      PK.S.begin(x,{lw:2.4,sh:2});PK.S.fill(x,c2=>c2.rect(300,QBP_SE+10,160,40),qbp_c("concrete"),{});
      qbp_person(x,"eng2",520,900,"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},qb_alive(tt,{expr:"think",gaze:[1,-0.2]},1,tT)),qbp_hs);
      qbp_person(x,"eng3",820,980,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"listen",gaze:[1,-0.1]},2,tT)),qbp_hs);}},
    // from February 1999, under the tower itself, a little at a time
    {at:tS,place:"qbpSite",later:true,keys:[[tS,1000,540,1.04]],d:2,draw:(x,tt,cam)=>{
      qbp_tower(x,1100,QBP_SE+8,25,lean(tt));qbp_lead(x,940,QBP_SE+10,25,1);qbp_drill(x,700,QBP_SE+12,25,1,ag_in(tt,tS+1,6));
      qbp_person(x,"eng1",420,960,"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},qb_alive(tt,{expr:"think",gaze:[1,-0.2]},1,tS)),qbp_hs);
      qbp_person(x,"eng3",1460,900,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"listen",gaze:[1,-0.1]},2,tS)),qbp_hs);}},
    // every day, the engineer in charge signs a note
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,QBP_FOLK.eng1,tt,N5,{});}},
    // by the summer of 2001, it has come back about 45 centimetres; in December, it reopens
    {at:tL,place:"qbpSquare",dis:1.0,keys:[[tL,960,540,1.0],[c.years,1000,540,1.06]],d:3,draw:(x,tt,cam)=>{tower(x,tt);
      qbp_person(x,"eng1",1060,1000,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"smile",gaze:[1,-0.4]},1,tL)));
      if(tt>=tR)visitors(x,tt,tR,2);}},
    // at a university, a request for a dashboard hid a decision
    {at:tD,place:"qbTeam",dis:1.0,keys:[[tD,960,540,1.0],[c.found-0.2,760,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=qb_atRoom(x,tt,tD,{at:"helena",ivy:qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,tD)});
      qb_screenCall(x,R,ag_io(tt,w("data","dashboard",-0.3),tF-0.3,0.4),"Email · Graham Ellis",[["A dashboard of room use,",PK.C.ink,34],["by Easter?",PK.C.ink,34]],PK.C.blue);}},
    // half an hour of listening found it
    {at:tF,place:"qbCorner",cut:true,keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{qb_office(x,tt,tF,{});}}
  ]);
  qb_card(ctx,S,t,c.when+0.3,c.lean-0.2,{kick:"Pisa, Italy",title:"The bell tower"},{y:40,mid:true});
  qb_card(ctx,S,t,tP+0.4,tC-0.2,{kick:"Pavia, March 1989",title:"A tower collapses"},{y:40,mid:true});
  qb_card(ctx,S,t,tC+0.4,c.harm-0.2,{kick:"January 1990",title:"Closed to visitors"},{y:40,mid:true});
  qb_card(ctx,S,t,tM+0.4,tZ+0.6,{kick:"Spring 1990",title:"An international committee"},{y:40,mid:true});
  qb_card(ctx,S,t,tT+0.4,tS-0.2,{kick:"First",title:"A test footing"},{y:40,mid:true});
  qb_card(ctx,S,t,tS+0.3,tN-0.2,{kick:"From February 1999",title:"Soil out, a little at a time"},{y:40,mid:true});
  qb_card(ctx,S,t,tL+0.4,tR-0.2,{kick:"Summer 2001",title:"About 45 cm back"},{y:40,mid:true});
  qb_card(ctx,S,t,tR+0.3,tD-0.2,{kick:"December 2001",title:"Open again"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"The question behind the request","Find the decision; agree the question","Leading data people · Working with people",{side:"right",size:52});
});

/* ---------------------------------------------------------------- 2. A dashboard by Easter */
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tE=c.email-0.4,tB=c.clear-0.4,tZ=w("guess","guess",-1.2),tH=c.helena-0.4,BA=PK.pace(ctx,"carmen",qb_boardA(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // these films: the people who ask for data, and the team who answers
    {at:0,place:"qbTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      qb_atRoom(x,tt,0,{at:"helena",ivy:qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,0)});}},
    // Graham emails the data team from his office
    {at:tE,place:"qbCorner",cut:true,keys:[[tE,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=qb_corner(x,tt,{t0:tE,who1:"graham",laptop:true,hf:qb_alive(tt,{expr:"think",gaze:[1,0.6]},1,tE),handN:[830,616],handF:[856,606]});
      qb_name(x,R.who1,tt,w("email","Graham Ellis",0),c.asks-0.2,"Graham Ellis","Director of Facilities",170);
      PK.callout(x,1060,90,720,250,R.laptop,ag_io(tt,c.asks-0.2,tB-0.3,0.4),(cc,bx,by,bw,bh)=>qb_panel(cc,bx,by,bw,bh,"To the data team",[["Could I have a dashboard",PK.C.ink,34],["of room use, by Easter?",PK.C.ink,34]],null,PK.C.blue));}},
    // a request names a guess at a solution (Carmen, at the team's board)
    {at:tB,place:"qbTeam",dis:0.6,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=qb_lesson(x,tt,{rows:BA,clock:11,events:QB_HEV});
      qb_name(x,R.at,tt,tB+0.4,tZ-0.3,"Carmen Vidal","Consultant",160);}},
    {at:tZ,cut:true,place:"qbBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.clear,E.nobody]],events:QB_HEV});}},
    // so Helena asks Graham for half an hour, with Noor
    {at:tH,place:"qbCampus",dis:0.6,keys:[[tH,900,570,1.1]],d:2,draw:(x,tt,cam)=>{
      const CH={title:"Helena Novak",who:["helena"],me:"graham",msgs:[{who:"helena",s:"Half an hour, with Noor? To hear what it's for.",at:w("helena","asks Graham",-0.2),type:1.4},{who:"graham",s:"Tuesday at 10.",at:E.helena+0.3,type:0.8}]},cs=PK.chatSize(x,CH,{size:28});
      const Jg=PK.person(x,"graham",1060,CA.near,qb_hC(CA.near),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone({back:true}),holds:true},PK.face(tt,{expr:"think",gaze:[1,0.9]},[[E.helena+0.5,"smile",2.0]])));
      PK.callout(x,200,160,cs.w,cs.h,[Jg.hdN[0]-20,Jg.hdN[1]-30],ag_in(tt,tH+0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}}
  ]);
  qb_imagined(ctx,S,t,0.4,tE,"The university, 2027 · imagined");
  qb_card(ctx,S,t,tE+0.3,w("email","Graham Ellis",-0.3),{kick:"Thursday 11 February 2027",title:"An email"},{y:40,mid:true});
  qb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-qb_apart(t,[[0,c.asks],[tH,1e9]])));
});

/* ---------------------------------------------------------------- 3. Half an hour, mostly listening */
scene("listen",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tN=c.who-0.4,tM=c.mind-0.4,tB=c.schein-0.4,tZ=c.schein+2.0,N1=PK.pace(ctx,null,qb_note1(sc,w)),BB=PK.pace(ctx,"carmen",qb_boardB(sc,w));
  const qa=[["decide","Whether",["What will you decide with it?"],["Whether to ask","for a new building."]],["when","His paper",["By when?"],["My paper's due 1 June."]],
    ["mind","If rooms",["What would change your mind?"],["Short at every hour:","then I'd build."]]];
  const office=(x,tt,t0,cam,list)=>{const sp=[],gsp=[];for(const [id,ans] of list){sp.push([c[id]+0.1,w(id,ans,-0.4)]);gsp.push([w(id,ans,-0.2),E[id]]);}
    const R=qb_office(x,tt,t0,{nw:Math.max(...list.map(([id,ans])=>ag_in(tt,w(id,ans,0.2),0.4)*(1-ag_in(tt,E[id]+0.6,0.4)))),
      gf:qb_sp(tt,1,gsp,"think",0.3),hf:qb_sp(tt,2,sp,"listen",0.3)});
    for(const [id,ans,q,a] of qa.filter(r=>list.some(l=>l[0]===r[0]))){qb_bub(x,R.who2,tt,c[id]+0.1,w(id,ans,-0.3),q,cam,{lean:-120});qb_bub(x,R.who1,tt,w(id,ans,-0.2),E[id]+0.6,a,cam,{lean:160});}
    return R;};
  ag_shots(ctx,S,t,sc.dur,[
    // Tuesday 16 February, in Graham's office: a few open questions, then mostly listening
    {at:0,place:"qbCorner",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{office(x,tt,0,cam,[["decide","Whether"],["when","His paper"]]);}},
    // Noor writes down what he says
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"noor",tt,N1,{});}},
    {at:tM,place:"qbCorner",dis:0.6,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{office(x,tt,tM,cam,[["mind","If rooms"]]);}},
    // humble inquiry and active listening (Carmen, at the team's board)
    {at:tB,place:"qbTeam",cut:true,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{qb_lesson(x,tt,{rows:BB,clock:14,events:QB_HEV});}},
    {at:tZ,cut:true,place:"qbBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.schein,E.whys]],events:QB_HEV});}}
  ]);
  qb_card(ctx,S,t,0.3,c.decide-0.2,{kick:"Tuesday 16 February",title:"Graham's office"},{y:40,mid:true});
  qb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-qb_apart(t,[[0,c.decide],[tB,1e9]])));
});

/* ---------------------------------------------------------------- 4. Say it back, write it down */
scene("agree",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tP=c.pisa-0.4,tW=c.write-0.4,tN=c.question-0.4,tR=c.reply-0.4,N2=PK.pace(ctx,null,qb_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Helena says back what she heard; Graham stops her at one word; Noor names the data it decides
    {at:0,place:"qbCorner",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=qb_office(x,tt,0,{gf:qb_sp(tt,1,[[c.used+0.1,E.used]],"think",0.3),hf:qb_sp(tt,2,[[c.back+0.2,c.used-0.2],[c.data+0.2,E.data]],"listen",0.3)});
      qb_bub(x,R.who2,tt,c.back+0.2,c.used-0.1,["So: a decision about a building,","and how the rooms are used?"],cam,{lean:-160});
      qb_bub(x,R.who1,tt,c.used+0.1,c.data-0.1,["Used: people in the room.","A booking isn't use."],cam,{lean:160});
      qb_bub(x,R.who2,tt,c.data+0.2,tP-0.3,["Then: bookings, beside","the sensors' head counts."],cam,{lean:-160});}},
    // in Pisa, saving meant half a degree
    {at:tP,place:"qbpSquare",dis:0.8,keys:[[tP,1000,540,1.08]],d:2,draw:(x,tt,cam)=>{qbp_tower(x,QBP_TW[0],QBP_TW[1],QBP_K,QBP_LEAN1);
      qbp_person(x,PK.extra(4),420,820,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"smile",gaze:[1,-0.6]},1,tP)));
      qbp_person(x,PK.extra(11),1620,880,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"neutral",gaze:[1,-0.5]},2,tP)));}},
    // Noor writes the question down with him, on one page
    {at:tW,place:"qbCorner",dis:0.8,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{qb_office(x,tt,tW,{nw:ag_in(tt,tW+0.6,0.4)});}},
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"noor",tt,N2,{});}},
    // that afternoon, Graham replies
    {at:tR,place:"qbTeam",dis:0.6,keys:[[tR,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=qb_atRoom(x,tt,tR,{at:"noor",ivy:PK.face(tt,{expr:PK.exprMix("think","smile",ag_in(tt,w("reply","Yes",0),0.6)),gaze:[1,0.3]},[])});
      qb_screenCall(x,R,ag_in(tt,w("reply","replies",-0.2),0.4),"Graham Ellis · re: the question",[["“Yes, that's it.”",PK.C.green,40]],PK.C.green);}}
  ]);
  qb_card(ctx,S,t,tR+0.3,w("reply","replies",-0.4),{kick:"That afternoon",title:"A reply"},{y:40,mid:true});
  qb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-qb_apart(t,[[tP,tW],[tR,1e9]])));
});

/* ---------------------------------------------------------------- 5. What the question gave */
scene("answer",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tI=c.ivy-0.4,tN=c.so-0.4,tB=c.both-0.4,tG=c.dash-0.4,N3=PK.pace(ctx,null,qb_note3(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the request waits its turn; Ivy follows the question, starting from the page
    {at:0,place:"qbTeam",later:true,keys:[[0,960,540,1.0],[tI,700,560,1.12]],d:3,draw:(x,tt,cam)=>{
      const R=qb_atRoom(x,tt,0,{sam:null,ivy:qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,0)});
      qb_name(x,R.marta,tt,w("ivy","Ivy Reyes",0),c.start-0.2,"Ivy Reyes","Data analyst",170);
      qb_screenCall(x,R,ag_io(tt,w("ivy","page",-0.3),c.start-0.1,0.4),"The page · agreed 16 Feb",[["Too few rooms,",PK.C.blue,36],["or too few at some hours?",PK.C.blue,36]],PK.C.blue);
      qb_screenCall(x,R,ag_io(tt,c.week,tN-0.3,0.4),"Rooms booked",[],PK.C.orange,{bh:380,bars:[["the whole week · 38%",38,100,PK.C.orange],["10 to 2, Tue to Thu · 93%",93,100,PK.C.orange],["booked, nobody there · 1 in 5",20,100,PK.C.amber]]});}},
    // so: not too few rooms, but too few at some hours (Ivy's notebook)
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N3,{});}},
    // the academics were right about the peak, and Graham about Monday mornings
    {at:tB,place:"qbCampus",dis:0.6,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Ja=null,Jg=null;
      Ja=PK.person(x,PK.extra(6),760,960,qb_hC(960),"clasp",Object.assign({t:tt},qb_sp(tt,1,[[tB+0.6,tB+2.4]],"smile",0.1)));
      Jg=PK.person(x,"graham",1120,CA.near,qb_hC(CA.near),"clasp",Object.assign({t:tt,flip:true},qb_sp(tt,2,[[tB+2.8,tG-0.4]],"smile",0.1)));
      qb_bub(x,Ja,tt,tB+0.6,tB+2.6,["Tuesdays at eleven: all full."],cam,{lean:-160});
      qb_bub(x,Jg,tt,tB+2.8,tG-0.3,["And Monday mornings: empty."],cam,{lean:160});}},
    // a dashboard by Easter might have settled nothing; instead, an answer in time
    {at:tG,place:"qbCorner",cut:true,keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=qb_corner(x,tt,{t0:tG,who1:"graham",who2:"helena",laptop:true,hf:qb_sp(tt,1,[[c.instead+0.4,E.instead]],"smile",0.4),iface:qb_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tG),handN:[830,616],handF:[856,606]});
      qb_bub(x,R.who1,tt,c.instead+0.4,1e9,["Now I know what to ask the Council."],cam,{lean:160});}}
  ]);
  qb_card(ctx,S,t,0.3,tI,{kick:"Tuesday 30 March",title:"The team takes it up"},{y:40,mid:true});
  qb_card(ctx,S,t,c.start+0.2,c.week-0.3,{kick:"By 23 April",title:"An answer"},{y:40,mid:true});
  qb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-qb_apart(t,[[0,tI],[tI,tN]])));
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tD=c.daily-0.4,tS=c.same-0.4,tF=c.form-0.4,tN=c.monday-0.1,tL=c.take-0.4,tE=c.breath+0.6,N4=PK.pace(ctx,null,qb_note4(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // in Pisa, they first agreed what saving the tower would mean
    {at:0,place:"qbpSquare",keys:[[0,960,540,1.0],[tD-0.2,1000,540,1.06]],d:3,draw:(x,tt,cam)=>{qbp_tower(x,QBP_TW[0],QBP_TW[1],QBP_K,QBP_LEAN1);
      qbp_person(x,PK.extra(4),420,820,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"smile",gaze:[1,-0.6]},1,0)));
      qbp_person(x,"eng1",1060,1000,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"smile",gaze:[1,-0.4]},2,0)));}},
    // every day, a signed note
    {at:tD,place:"qbpSite",cut:true,keys:[[tD,1000,540,1.04]],d:2,draw:(x,tt,cam)=>{
      qbp_tower(x,1100,QBP_SE+8,25,QBP_LEAN1);qbp_lead(x,940,QBP_SE+10,25,1);
      qbp_person(x,"eng1",620,960,PK.poseMix("clasp",QB_NOTE,ag_in(tt,tD+0.6,0.4)),Object.assign({t:tt,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},qb_alive(tt,{expr:"think",gaze:[1,0.6]},1,tD)),qbp_hs);}},
    // Graham's request got the same care
    {at:tS,place:"qbCorner",dis:0.8,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{qb_office(x,tt,tS,{gf:qb_alive(tt,{expr:"smile",gaze:[1,0.3]},1,tS),hf:qb_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tS)});}},
    // from June, the team's front door, a form
    {at:tF,place:"qbTeam",cut:true,keys:[[tF,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=qb_atRoom(x,tt,tF,{at:"helena",sam:null,ivy:qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,tF)});
      qb_screenCall(x,R,ag_in(tt,tF+0.4,0.4),"Ask the data team",[["What will you decide with it?",PK.C.ink,32],["By when? Who decides?",PK.C.ink,32],["… five questions",PK.C.mut,30]],PK.C.blue,{bh:300});}},
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}},
    // ask what it's for, and agree it in writing
    {at:tL,place:"qbTeam",dis:0.6,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      qb_atRoom(x,tt,tL,{at:"noor",ivy:qb_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tL),people:[{fl:990,draw:cc=>{PK.person(cc,"helena",960,990,qb_hT(990),"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tL)));}}]});}}
  ]);
  qb_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-qb_apart(t,[[0,tS],[tF,tL]])));
  PK.end(ctx,S,t,tE,"The question behind the request",QB_LAST,"Film 1 of 3","Working with people",{side:"right"});
});
ag_cutInto(["ask","listen","agree","answer"]);
