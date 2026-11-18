/* ===== Learning while doing: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are written by hand: the circle's sheet in Angicos, Ivy's and Carmen Vidal's boards, and Ivy's and Helena's notebooks
   (lw_uni.js). Angicos is in lwa_town.js. Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt). */
const lw_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,3,"Learning while doing",a);}};
function lw_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const lw_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const lw_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const lw_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const lw_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const lw_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const lw_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const lw_sp=(tt,i,spans,base,g)=>lw_alive(tt,{expr:lw_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const lw_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=o.flip!=null?o.flip:x1<x0;if(tt<t0)return null;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip:x1<x0},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{},o.hold?{hold:o.hold,holds:true}:{}));};
const LW_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const LW_LAST="Learn on the real work, beside someone, then teach it.";
// a letter held in the hand
const lw_letter=(c,hd,deg,J)=>{PK.S.begin(c,{lw:2.2});PK.sheet(c,hd[0]-28*J.u,hd[1]-70*J.u,56*J.u,74*J.u,{rot:0.06});};
// a screen's callout from the monitor at the desk by the window, where Ivy works
const lw_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>lw_panel(cc,bx,by,bw,bh,head,rows,null,hc));};
// the team's room with Ivy at the desk by the window; o.with: who sits beside her, pairing (o.withF their face); o.people, o.ivy
const lw_ivyRoom=(x,tt,t0,o)=>{o=o||{};const people=(o.people||[]).slice();
  if(o.with)people.push({fl:906,draw:cc=>{o.J2=PK.seated(cc,o.with,830,906,lw_hT(906),"sit",Object.assign({t:tt+2,flip:true},o.withF||lw_alive(tt,{expr:"listen",gaze:[1,0.35]},4,t0)));}});
  const R=lw_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:o.at||"ivy",marta:Object.assign({work:o.work==null?1:o.work,turn:0},o.ivy||lw_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
    sam:o.sam===null?null:Object.assign({work:1},o.samF||lw_alive(tt,{},1,t0)),jun:o.jun===null||o.with==="jun"?null:Object.assign({work:1},o.junF||lw_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people});
  R.with=o.J2;return R;};
// Angicos's people, seated on a bench from the side, and standing
const lw_learner=(x,who,px,fl,i,t0,o)=>lwa_seat(x,who,px,fl,"sit",Object.assign({t:t0+i,flip:!!(o&&o.flip)},(o&&o.face)||lw_alive(t0,{expr:"listen",gaze:[1,0.2]},i,0)));

/* ---------------------------------------------------------------- 1. Their own words */
scene("circles",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tR=c.read-0.4,tP=c.primers-0.4,tO=c.own-0.4,tC=c.circle-0.4,tF=c.forty-0.4,tS=c.stop-0.4,tB=c.book-0.4,tD=c.data-0.4;
  const tW=w("picture","belota",-0.4),tZ=w("syllables","syllables",-0.6),tU=c.steps+0.6;
  const BO=PK.pace(ctx,LWA_FOLK.stu2,lw_boardO(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Angicos, January 1963: adults sign up for evening classes at the students' table in the street
    {at:0,place:"lwaStreet",keys:[[0,960,560,1.0],[c.guides,1180,580,1.1]],d:3,draw:(x,tt,cam)=>{let Jt=null,Jf=null,Js=null;
      const H1=lwa_h(900);
      lwa_person(x,"wash2",260,880,"clasp",Object.assign({t:tt},lw_alive(tt,{expr:"listen",gaze:[1,0.1]},4,0)));
      Js=lwa_person(x,"stu2",1680,900,"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},lw_sp(tt,2,[[c.adults+0.4,c.adults+2.2]],"smile",0.1)));
      Jt=PK.atDesk(x,lwa_row("stu1"),1430,912,lwa_h(912),Object.assign({t:tt,flip:true,screen:null,work:0,pose:"sit"},lw_alive(tt,{expr:"smile",gaze:[1,0.2]},1,0)));
      lwa_person(x,"wash1",700,960,"clasp",Object.assign({t:tt},lw_alive(tt,{expr:"think",gaze:[1,0.2]},3,0)));
      Jf=lw_come(x,lwa_row("farm"),tt,-120,1080,c.when+0.4,c.adults+0.2,950,lwa_h(950),{then:"clasp",flip:false,face:lw_sp(tt,5,[[c.adults+2.6,c.guides-0.4]],"glad",0.2)});
      lw_come(x,lwa_row("build"),tt,2080,1880,c.adults+1.0,c.guides+0.6,1010,lwa_h(1010),{then:"clasp",face:lw_alive(tt,{expr:"listen",gaze:[1,0.1]},6,0)});
      lw_bub(x,Js,tt,c.adults+0.4,c.adults+2.4,["Evenings, from Monday."],cam,{lean:-200});
      lw_bub(x,Jf,tt,c.adults+2.6,tR-0.3,["Put my name down."],cam,{lean:-140});}},
    // three adults in four can't read or write: a neighbour reads a letter out at a door
    {at:tR,place:"lwaStreet",later:true,keys:[[tR,1180,580,1.1],[tR+1.8,560,600,1.3]],d:2,draw:(x,tt,cam)=>{let Jn=null,Jw=null,Jf=null;
      Jn=PK.person(x,PK.extra(5),520,930,lwa_h(930),"clasp",Object.assign({t:tt,flip:true,hold:lw_letter,holds:true},lw_sp(tt,1,[[c.letters+0.3,E.letters]],"neutral",0.6)));
      Jw=lwa_person(x,"wash2",300,900,"clasp",Object.assign({t:tt},lw_alive(tt,{expr:"listen",gaze:[1,0.3]},2,tR)));
      Jf=lwa_person(x,"farm",790,1000,"clasp",Object.assign({t:tt,flip:true},lw_sp(tt,3,[[c.vote+0.2,E.vote]],"worry",0.1)));
      lw_bub(x,Jf,tt,c.vote+0.2,c.letters,["And none of us can vote."],cam,{lean:120});
      lw_bub(x,Jn,tt,c.letters+0.3,tP-0.3,["“Your son writes: he's well.”"],cam,{lean:140});}},
    // adult classes often use children's primers: many give up
    {at:tP,place:"lwaClass",cut:true,keys:[[tP,960,560,1.0],[c.change,900,580,1.06]],d:3,draw:(x,tt,cam)=>{let Jt=null;
      lw_learner(x,"wash1",1000,900,1,tt,{face:lw_alive(tt,{expr:"worry",gaze:[1,0.2]},1,tP)});
      lw_learner(x,"farm",620,960,2,tt,{face:lw_alive(tt,{expr:"neutral",gaze:[1,0.2]},2,tP)});
      lw_learner(x,"build",380,1030,3,tt,{face:PK.face(tt,{expr:PK.exprMix("neutral","worry",ag_in(tt,w("primers","give up",-0.6),0.6)),gaze:[1,0.2]},[])});
      lw_come(x,lwa_row("wash2"),tt,1240,2100,w("primers","give up",-0.8),w("primers","give up",3.8),930,lwa_h(930),{then:"stand"});
      Jt=lwa_person(x,PK.extra(9),1500,960,"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},lw_sp(tt,4,[[w("primers","Eva saw",-0.2),w("primers","nothing",-0.4)]],"neutral",0.3)));
      lw_bub(x,Jt,tt,w("primers","Eva saw",-0.2),w("primers","nothing",-0.2),["Eva saw the grape."],cam,{lean:-160});}},
    // Freire's team starts from the town's own words: they listen, and write them down
    {at:tO,place:"lwaStreet",cut:true,keys:[[tO,1320,580,1.2]],d:2,draw:(x,tt,cam)=>{let Jf=null;
      Jf=lwa_person(x,"farm",1060,960,"clasp",Object.assign({t:tt},lw_sp(tt,1,[[c.listen+0.2,c.listen+2.8]],"talk",0.1)));
      lwa_person(x,"stu1",1430,910,PK.poseMix("clasp",LW_NOTE,ag_in(tt,w("listen","write down",-0.4),0.4)),Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},lw_alive(tt,{expr:"listen",gaze:[1,0.2]},2,tO),{gaze:[1,0.6*ag_in(tt,w("listen","write down",-0.4),0.4)]}));
      lwa_person(x,"stu2",1700,1000,"clasp",Object.assign({t:tt,flip:true},lw_alive(tt,{expr:"listen",gaze:[1,0.1]},3,tO)));
      lw_bub(x,Jf,tt,c.listen+0.2,tC-0.3,["The rain hasn't come this year."],cam,{lean:-140});}},
    // each evening, a culture circle: a picture from their own lives, one word, its syllables, new words
    {at:tC,place:"lwaCircle",cut:true,keys:[[tC,960,540,1.0],[tW,960,540,1.0],[tZ,1381,440,1.9],[tU,1381,440,1.9],[tU+1.8,960,540,1.0]],d:3,draw:(x,tt,cam)=>{let Jl=null;
      lwa_slide(x,ag_in(tt,w("picture","picture",-0.4),0.8));
      const tl=PK.face(tt,{expr:"listen",gaze:[1,0.2]},[]);
      lw_learner(x,"wash2",760,890,3,tt,{face:lw_alive(tt,{expr:"smile",gaze:[1,0.2]},3,tC)});
      lw_learner(x,"build",240,900,1,tt,{face:lw_alive(tt,{expr:"listen",gaze:[1,0.2]},1,tC)});
      PK.teach(x,LWA_FOLK.stu2,tt,BO,{x:LWA_BD.x,y:LWA_BD.y,k:LWA_BD.k,deco:true,floor:LWA_BD.floor,rest:LWA_BD.rest,h:lwa_hi(LWA_BD.floor),say:[[c.picture,E.steps]],events:LW_HEV});
      Jl=lw_learner(x,"wash1",1090,980,2,tt,{flip:true,face:lw_sp(tt,2,[[w("picture","picture",0.3),w("picture","belota",-0.3)]],"glad",0.2)});
      lw_learner(x,"farm",520,1040,4,tt,{face:lw_alive(tt,{expr:"listen",gaze:[1,0.2]},4,tC)});
      lw_bub(x,Jl,tt,w("picture","picture",0.3),w("picture","belota",-0.3),["A hammock, like ours!"],cam,{lean:-140});}},
    // the fortieth hour: a spring evening, and the windows lit across the town
    {at:tF,place:"lwaDusk",cut:true,keys:[[tF,960,560,1.0],[c.spread,980,560,1.05]],d:3,draw:(x,tt,cam)=>{let J1=null;
      lwa_lit(x,ag_in(tt,tF+0.4,1.2));
      lwa_person(x,"build",1600,900,"clasp",Object.assign({t:tt,flip:true},lw_alive(tt,{expr:"smile",gaze:[1,0.1]},2,tF)));
      J1=lw_come(x,lwa_row("wash1"),tt,140,1060,tF+0.2,c.forty+3.6,980,lwa_h(980),{then:"clasp",flip:false,face:lw_sp(tt,1,[[c.forty+3.8,c.forty+6.0]],"glad",0.1),hold:PK.inHand.notebook({})});
      lwa_person(x,"farm",1320,1040,"clasp",Object.assign({t:tt,flip:true},lw_alive(tt,{expr:"listen",gaze:[1,0.1]},3,tF)));
      lw_bub(x,J1,tt,c.forty+3.8,c.count+1.6,["I wrote my name!"],cam,{lean:140});}},
    // April 1964: the plan is stopped
    {at:tS,place:"lwaCircle",dis:1.0,keys:[[tS,960,540,1.0],[tB,900,560,1.06]],d:3,draw:(x,tt,cam)=>{
      lwa_person(x,"stu2",1000,960,"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},PK.face(tt,{expr:"worry",gaze:[1,0.3]},[[tS+2.2,"look",2.6,[1,-0.2]]])));}},
    // abroad, he writes a book
    {at:tB,place:"lwaAbroad",dis:1.0,keys:[[tB,960,540,1.0],[tD,960,540,1.08]],d:3,draw:(x,tt,cam)=>{}},
    // learning data work can feel like those primers
    {at:tD,place:"lwTeam",dis:1.0,keys:[[tD,960,540,1.0],[c.real,760,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=lw_ivyRoom(x,tt,tD,{ivy:PK.face(tt,{expr:PK.exprMix("neutral","worry",ag_in(tt,c.data+1,0.6)),gaze:[1,0.3]},[])});
      lw_screenCall(x,R,ag_io(tt,w("data","tutorials",-0.3),c.real+0.4,0.4),"A tutorial · lesson 1 of 40",[["A shop that sells shoes",PK.C.ink,36]],PK.C.mut);}}
  ]);
  lw_card(ctx,S,t,c.when+0.3,c.adults+0.6,{kick:"Angicos, Brazil",title:"January 1963"},{y:40,mid:true});
  lw_card(ctx,S,t,w("guides","Paulo Freire",-0.2),tR-0.2,{kick:"Trained by an educator",title:"Paulo Freire"},{y:40,mid:true});
  lw_card(ctx,S,t,tC+0.4,w("picture","picture",-0.6),{kick:"Each evening",title:"A culture circle"},{y:40,mid:true});
  lw_card(ctx,S,t,tF+0.4,c.count-0.2,{kick:"2 April 1963",title:"The fortieth hour"},{y:40,mid:true});
  lw_card(ctx,S,t,c.spread+0.2,tS-0.2,{kick:"January 1964",title:"A national plan"},{y:40,mid:true});
  lw_card(ctx,S,t,tS+0.4,tB-0.2,{kick:"April 1964",title:"The plan stopped"},{y:40,mid:true});
  lw_card(ctx,S,t,tB+0.4,tD-0.2,{kick:"Abroad",title:"Pedagogy of the Oppressed"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"Learning while doing","Skills grow on the real work","Leading data people · The new skills",{side:"right",size:64});
});

/* ---------------------------------------------------------------- 2. Beside Jun, an hour a day */
scene("beside",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tP=c.pair-0.4,tN=w("small","Each day",-1.0),tF=c.fifth-0.4,tO=c.own-0.4,N1=PK.pace(ctx,null,lw_note1(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 1 March 2027: Ivy's first day; Helena meets her, and Jun turns from his desk
    {at:0,place:"lwTeam",later:true,keys:[[0,960,540,1.0],[c.jun,1200,560,1.08]],d:3,draw:(x,tt,cam)=>{let Ji=null,Jh=null;
      const R=lw_team(x,tt,{clock:9,marta:null,sam:null,
        jun:Object.assign({turn:ag_in(tt,c.jun-0.4,0.5),work:0},lw_sp(tt,2,[[c.jun+0.4,E.jun]],"smile",0.1)),people:[
        {fl:1000,draw:cc=>{Jh=PK.person(cc,"helena",720,1000,lw_hT(1000),"clasp",Object.assign({t:tt},lw_sp(tt,3,[[0.8,2.6]],"smile",0.1)));}},
        {fl:960,draw:cc=>{Ji=lw_come(cc,"ivy",tt,2060,1020,0.2,3.0,960,lw_hT(960),{then:"clasp",face:lw_alive(tt,{expr:"smile",gaze:[1,0.1]},4,0)});}}]});
      lw_name(x,Ji,tt,w("ivy","Ivy Reyes",0),c.jun-0.2,"Ivy Reyes","Data analyst, new",170);
      lw_bub(x,Jh,tt,0.8,c.ivy+2.0,["Welcome, Ivy."],cam,{lean:-120});
      lw_bub(x,R.jun,tt,c.jun+0.4,tP-0.3,["No course. Let's open the real models."],cam,{lean:-220});}},
    // they pair for an hour a day: one types, the other reads, asks and thinks ahead, and they swap
    {at:tP,place:"lwTeam",later:true,keys:[[tP,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const sw=ag_in(tt,w("pair","swap",-0.2),0.5);
      const R=lw_ivyRoom(x,tt,tP,{with:"jun",withF:lw_sp(tt,4,[[w("pair","asks",-0.4),w("pair","swap",-0.6)]],"think",0.4),
        ivy:lw_sp(tt,3,[[w("pair","swap",-0.2),w("pair","swap",1.0)]],"think",0.3)});
      lw_bub(x,R.marta,tt,w("pair","swap",-0.2),tN-0.2,["Your turn."],cam,{lean:120});
      lw_bub(x,R.with,tt,w("pair","asks",-0.4),w("pair","swap",-0.6),["Why join the rooms here?"],cam,{lean:160});}},
    // each day, one small change, finished, and someone else reviews it (Ivy's notebook)
    {at:tN,place:"lwNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N1,{});}},
    // the fifth week: one her own page found; six weeks, twenty-five small changes
    {at:tF,place:"lwTeam",dis:0.6,keys:[[tF,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=lw_ivyRoom(x,tt,tF,{with:"jun",ivy:lw_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tF)});
      lw_screenCall(x,R,ag_io(tt,c.fourteen,c.count-0.3,0.4),"Rooms renumbered · 14",[["matched to their old numbers",PK.C.ink,32],["a check: no room drops out",PK.C.green,34]],PK.C.orange);
      lw_screenCall(x,R,ag_io(tt,c.count,tO-0.3,0.4),"Six weeks",[["25 small changes",PK.C.green,38],["each one reviewed",PK.C.ink,34]],PK.C.green);}},
    // by the sixth week she writes changes on her own, and Jun reviews them
    {at:tO,place:"lwTeam",later:true,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=lw_ivyRoom(x,tt,tO,{ivy:lw_alive(tt,{expr:"think",gaze:[1,0.3]},3,tO),junF:lw_sp(tt,2,[[c.own+1.6,c.own+3.2]],"smile",0.1)});
      lw_bub(x,R.jun,tt,c.own+1.6,E.xp,["Approved. A good check."],cam,{lean:-200});}}
  ]);
  lw_imagined(ctx,S,t,0.4,c.jun,"The university, 2027 · imagined");
  lw_card(ctx,S,t,0.4,w("ivy","Ivy Reyes",-0.4),{kick:"Monday 1 March 2027",title:"Ivy's first day"},{y:40,mid:true});
  lw_card(ctx,S,t,c.xp+0.2,E.xp+0.6,{kick:"Extreme programming",title:"Two people, one keyboard"},{y:40,mid:true});
  lw_kick(ctx,S,ag_in(t,0.6,0.6)*(1-lw_apart(t,[[0,c.jun],[c.fourteen,tO],[c.xp,1e9]])));
});

/* ---------------------------------------------------------------- 3. Two hours every Thursday */
scene("thursday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tT=c.time-0.4,tG=w("helena","a meeting",-0.6),tN=c.pick-0.4,tI=c.ivy-0.4,LE=PK.ROOMS.lecture,hL=fl=>PK.hAt(fl,LE.eye);
  const N2=PK.pace(ctx,null,lw_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the tools change every month, and so do their docs
    {at:0,place:"lwTeam",later:true,keys:[[0,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=lw_ivyRoom(x,tt,0,{ivy:PK.face(tt,{expr:PK.exprMix("think","worry",ag_in(tt,c.wait,0.6)),gaze:[1,0.3]},[])});
      lw_screenCall(x,R,ag_io(tt,w("tools","every month",-0.4),tT-0.3,0.4),"The docs · what's new",[["This month: 3 pages changed",PK.C.orange,34],["Last month: 5",PK.C.ink,32]],PK.C.blue);}},
    // Helena keeps two hours every Thursday, for the whole team
    {at:tT,place:"lwCorner",dis:0.6,keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=lw_corner(x,tt,{t0:tT,laptop:true,he:"think",hg:[1,0.6],hf:lw_alive(tt,{expr:"think",gaze:[1,0.6]},1,tT),handN:[830,616],handF:[856,606]});
      lw_name(x,R.helena,tt,w("helena","Helena Novak",0),tG-0.2,"Helena Novak","Data manager",170);
      PK.callout(x,1080,90,700,260,R.laptop,ag_io(tt,w("time","two hours",-0.3),tG-0.3,0.4),(cc,bx,by,bw,bh)=>lw_panel(cc,bx,by,bw,bh,"Calendar · every Thursday",[["2 to 4 · learning time",PK.C.blue,36],["the whole team · no meetings",PK.C.ink,32]],null,PK.C.blue));}},
    // a meeting asked for then is offered another time
    {at:tG,place:"lwCampus",dis:0.6,keys:[[tG,900,570,1.1]],d:2,draw:(x,tt,cam)=>{
      const CH={title:"Helena Novak",who:["helena"],me:"graham",msgs:[{who:"graham",s:"Thursday at 3, about the rooms?",at:tG+0.2},{who:"helena",s:"That's our learning time. Friday at 10?",at:w("helena","another time",-0.8),type:1.4},{who:"graham",s:"Friday it is.",at:E.helena+0.2,type:0.8}]},cs=PK.chatSize(x,CH,{size:28});
      const Jg=PK.person(x,"graham",1060,CA.near,lw_hC(CA.near),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone({back:true}),holds:true},PK.face(tt,{expr:"think",gaze:[1,0.9]},[[E.helena+0.4,"smile",2.0]])));
      PK.callout(x,200,160,cs.w,cs.h,[Jg.hdN[0]-20,Jg.hdN[1]-30],ag_in(tt,tG+0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}},
    // each person picks one thing the work needs, from the official docs, and tries it on the real project (Ivy's notebook)
    {at:tN,place:"lwNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N2,{});}},
    // Ivy picks the sensors' counts: she goes through a week of them with Sam, under a sensor
    {at:tI,place:"lwLecture",dis:0.6,keys:[[tI,960,540,1.0],[c.read,760,520,1.1]],d:3,draw:(x,tt,cam)=>{
      lw_room(x,tt,{plate:1,people:[
        {fl:900,draw:cc=>{PK.person(cc,"sam",360,900,hL(900),"clasp",Object.assign({t:tt},lw_alive(tt,{expr:"listen",gaze:[1,0.2]},1,tI)));}},
        {fl:960,draw:cc=>{PK.person(cc,"ivy",820,960,hL(960),"clasp",Object.assign({t:tt,flip:true,hold:PK.inHand.notebook({}),holds:true},PK.face(tt,{expr:"think",gaze:[1,0.1]},[[w("ivy","sensors'",0.2),"look",2.6,[1,-0.9]],[c.read+3,"nod"]])));}}]});
      PK.callout(x,1080,70,560,300,[LE.sensor[0]+30,LE.sensor[1]+10],ag_io(tt,w("read","week of counts",-0.4),1e9,0.4),(cc,bx,by,bw,bh)=>lw_panel(cc,bx,by,bw,bh,"B-204 · Tuesday",[["9:00 · 41",PK.C.orange,38],["10:00 · 0",PK.C.green,38],["11:00 · nothing sent",PK.C.amber,36]]));}}
  ]);
  lw_card(ctx,S,t,c.time+0.2,w("time","two hours",-0.6),{kick:"From Thursday 1 April",title:"Two hours, every week"},{y:40,mid:true});
  lw_kick(ctx,S,ag_in(t,0.6,0.6)*(1-lw_apart(t,[[w("tools","every month",-0.4),tT],[c.time,1e9]])));
});

/* ---------------------------------------------------------------- 4. Teach it to keep it */
scene("teach",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tB=w("peak","count",-1.0),tR=c.ready-0.4,tN=c.study-0.4,tS=c.spread-0.4,BA=PK.pace(ctx,"ivy",lw_boardA(sc,w)),N3=PK.pace(ctx,null,lw_note3(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday 13 May: Ivy teaches the team what one count means, on one page, in twenty minutes
    {at:0,place:"lwTeam",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{lw_lesson(x,tt,{who:"ivy",rows:BA,clock:14,events:LW_HEV});}},
    {at:tB,cut:true,place:"lwBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"ivy",tt,BA,{say:[[c.peak,E.heads]],events:LW_HEV});}},
    // getting ready, she asked Sam about two things she couldn't explain
    {at:tR,place:"lwTeam",cut:true,keys:[[tR,1300,540,1.12]],d:2,draw:(x,tt,cam)=>{let Ji=null;
      const R=lw_team(x,tt,{clock:11,marta:null,jun:null,sam:Object.assign({turn:ag_in(tt,tR+1.0,0.5),work:0},lw_sp(tt,1,[[w("ready","asked Sam",0.4),tN-0.3]],"smile",0.1)),people:[
        {fl:900,draw:cc=>{Ji=PK.person(cc,"ivy",1620,900,lw_hT(900),"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},lw_sp(tt,2,[[tR+0.4,w("ready","asked Sam",0.2)]],"think",0.1)));}}]});
      lw_bub(x,Ji,tt,tR+0.4,w("ready","asked Sam",0.2),["Why a gap here, not a zero?"],cam,{lean:-220});
      lw_bub(x,R.sam,tt,w("ready","asked Sam",0.4),tN-0.3,["It lost its network: it sent nothing."],cam,{lean:-200,rise:150});}},
    // whoever prepares to teach, then teaches, remembers more (Helena's notebook)
    {at:tN,place:"lwNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}},
    // now the whole team reads a count the same way
    {at:tS,place:"lwTeam",dis:0.6,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=lw_team(x,tt,{clock:10,sam:Object.assign({work:1},lw_alive(tt,{},1,tS)),jun:Object.assign({turn:1,work:0},lw_alive(tt,{expr:"listen",gaze:[1,-0.2]},2,tS)),
        marta:Object.assign({turn:1,work:0},lw_sp(tt,3,[[tS+0.8,tS+2.6]],"smile",0.1))});
      lw_bub(x,R.marta,tt,tS+0.8,1e9,["A gap, so not a zero."],cam,{lean:140});}}
  ]);
  lw_card(ctx,S,t,0.3,tB-0.3,{kick:"Thursday 13 May",title:"Ivy teaches the team"},{y:40,mid:true});
  lw_card(ctx,S,t,tR+0.3,w("ready","asked Sam",-0.2),{kick:"The week before",title:"Getting ready"},{y:40,mid:true});
  lw_kick(ctx,S,ag_in(t,0.6,0.6)*(1-lw_apart(t,[[0,tB],[tB,tN],[tN,tS]])));
});

/* ---------------------------------------------------------------- 5. Nobody the only one */
scene("two",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tL=c.list-0.4,tF=c.five-0.4,tP=c.pairs-0.4,tJ=c.june-0.4,tV=c.ivy-0.4,tA=c.away-0.4,N4=PK.pace(ctx,null,lw_note4(sc,w));
  const samPair=(x,tt,t0,o)=>lw_team(x,tt,Object.assign({clock:15,samWho:"ivy",sam:Object.assign({work:1},lw_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
    jun:Object.assign({work:1},lw_alive(tt,{},2,t0)),marta:Object.assign({work:1},lw_alive(tt,{},5,t0))},o||{}));
  ag_shots(ctx,S,t,sc.dur,[
    // one absence away from trouble: Sam is off, and only Sam runs the sensors' feed
    {at:0,place:"lwTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jh=null;
      const R=lw_team(x,tt,{clock:9,sam:null,jun:Object.assign({turn:1,work:0},lw_sp(tt,2,[[0.6,2.8]],"worry",0.1)),marta:Object.assign({work:1},lw_alive(tt,{},5,0)),people:[
        {fl:1000,draw:cc=>{Jh=PK.person(cc,"helena",1000,1000,lw_hT(1000),"clasp",Object.assign({t:tt,flip:true},lw_alive(tt,{expr:"worry",gaze:[1,0.1]},4,0)));}}]});
      lw_bub(x,R.jun,tt,0.6,tL-0.3,["Sam's off. Who runs the feed?"],cam,{lean:-200});}},
    // in May, Helena lists the nine jobs that must keep running, in her corner
    {at:tL,place:"lwCorner",cut:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{lw_corner(x,tt,{t0:tL,book:true,write:ag_in(tt,tL+0.8,0.5),hf:lw_alive(tt,{expr:"think",gaze:[1,0.7]},1,tL)});}},
    {at:tF,place:"lwNotes",dis:0.6,keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}},
    // they pair on those too, and write each one down, step by step: Ivy at Sam's desk, Sam beside her
    {at:tP,place:"lwTeam",dis:0.6,keys:[[tP,1300,540,1.12]],d:2,draw:(x,tt,cam)=>{let Js=null;
      samPair(x,tt,tP,{people:[{fl:880,draw:cc=>{Js=PK.seated(cc,"sam",930,880,lw_hT(880),"sit",Object.assign({t:tt+2},lw_sp(tt,1,[[tP+0.8,tJ-0.4]],"talk",0.3)));}}]});
      lw_bub(x,Js,tt,tP+0.8,tJ-0.3,["Step three: check the counts came."],cam,{lean:-140});}},
    // by 30 June, every job has at least two names: Helena tells the pair
    {at:tJ,place:"lwTeam",later:true,keys:[[tJ,1300,540,1.12]],d:2,draw:(x,tt,cam)=>{let Jh=null;
      samPair(x,tt,tJ,{people:[{fl:880,draw:cc=>{PK.seated(cc,"sam",930,880,lw_hT(880),"sit",Object.assign({t:tt+2},lw_alive(tt,{expr:"smile",gaze:[1,0.3]},1,tJ)));}},
        {fl:990,draw:cc=>{Jh=lw_come(cc,"helena",tt,560,760,tJ+0.1,tJ+1.6,990,lw_hT(990),{then:"clasp",flip:false,face:lw_sp(tt,4,[[tJ+1.8,tV-0.4]],"smile",0.1)});}}]});
      lw_bub(x,Jh,tt,tJ+1.8,tV-0.3,["Every job has two names now."],cam,{lean:200});}},
    {at:tV,place:"lwNotes",dis:0.6,keys:[[tV,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}},
    // now anyone can take a holiday, or be ill, and the work goes on
    {at:tA,place:"lwTeam",dis:0.6,keys:[[tA,1300,540,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=samPair(x,tt,tA,{sam:Object.assign({work:PK.u.clamp(1-ag_in(tt,tA+1.4,0.5),0,1),turn:ag_in(tt,tA+1.4,0.5)},lw_sp(tt,3,[[tA+1.8,tA+3.6]],"smile",0.1))});
      lw_bub(x,R.sam,tt,tA+1.8,1e9,["The feed's in. Enjoy the beach, Sam."],cam,{lean:-160});}}
  ]);
  lw_card(ctx,S,t,tA+0.3,1e9,{kick:"July",title:"Sam on holiday"},{y:40,mid:true});
  lw_kick(ctx,S,ag_in(t,0.6,0.6)*(1-lw_apart(t,[[tA,1e9]])));
});

/* ---------------------------------------------------------------- 6. Why it works */
scene("why",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tB=c.lave-0.6,tN=c.rule-0.4,tD=c.docs-0.4,BB=PK.pace(ctx,"carmen",lw_boardB(sc,w)),N5=PK.pace(ctx,null,lw_note5(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // how adults learn at work: Carmen Vidal, at the team's board
    {at:0,place:"lwTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=lw_lesson(x,tt,{rows:BB,clock:14,events:LW_HEV,marta:null});
      lw_name(x,R.at,tt,0.6,tB-0.3,"Carmen Vidal","Consultant",160);}},
    {at:tB,cut:true,place:"lwBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.trades,E.ericsson]],events:LW_HEV});}},
    // seventy, twenty, ten: a rule of thumb (Helena's notebook)
    {at:tN,place:"lwNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N5,{});}},
    // courses and docs still count: Ivy, the official docs open beside the work
    {at:tD,place:"lwTeam",dis:0.6,keys:[[tD,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=lw_ivyRoom(x,tt,tD,{ivy:lw_alive(tt,{expr:"think",gaze:[1,0.3]},3,tD)});
      lw_screenCall(x,R,ag_in(tt,tD+0.4,0.4),"The official docs",[["open beside the work",PK.C.blue,36],["then tried on the project",PK.C.green,34]],PK.C.blue);}}
  ]);
  lw_kick(ctx,S,ag_in(t,0.6,0.6)*(1-lw_apart(t,[[tB,tD],[tD,1e9]])));
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tI=c.ivy-0.4,tN=c.real-0.1,tL=c.last-0.4,tE=c.breath+0.6,N6=PK.pace(ctx,null,lw_note6(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Angicos: adults learned to read from their own words, a step each evening
    {at:0,place:"lwaDusk",keys:[[0,960,560,1.0],[tI-0.2,1000,580,1.06]],d:3,draw:(x,tt,cam)=>{lwa_lit(x,1);
      lw_come(x,lwa_row("wash1"),tt,300,1000,0.2,4.6,980,lwa_h(980),{then:"clasp",flip:false,face:lw_alive(tt,{expr:"smile",gaze:[1,0.1]},1,0),hold:PK.inHand.notebook({})});
      lwa_person(x,"farm",1340,1030,"clasp",Object.assign({t:tt,flip:true},lw_alive(tt,{expr:"smile",gaze:[1,0.1]},2,0)));}},
    // Ivy learned the team's work the same way
    {at:tI,place:"lwTeam",dis:1.0,keys:[[tI,1300,540,1.12]],d:2,draw:(x,tt,cam)=>{
      lw_team(x,tt,{clock:10,samWho:"ivy",sam:Object.assign({work:1},lw_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tI)),jun:Object.assign({work:1},lw_alive(tt,{},2,tI)),marta:null,people:[
        {fl:880,draw:cc=>{PK.seated(cc,"sam",930,880,lw_hT(880),"sit",Object.assign({t:tt+2},lw_alive(tt,{expr:"listen",gaze:[1,0.3]},1,tI)));}}]});}},
    {at:tN,place:"lwNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N6,{});}},
    // learn on the real work, beside someone, then teach it: Ivy beside Marta now
    {at:tL,place:"lwTeam",dis:0.6,keys:[[tL,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      lw_ivyRoom(x,tt,tL,{at:"marta",with:"ivy",withF:lw_alive(tt,{expr:"smile",gaze:[1,0.35]},4,tL),ivy:lw_alive(tt,{expr:"think",gaze:[1,0.3]},3,tL)});}}
  ]);
  lw_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-lw_apart(t,[[0,tI],[tN,tL]])));
  PK.end(ctx,S,t,tE,"Learning while doing",LW_LAST,"Film 3 of 3","The new skills",{side:"right"});
});
ag_cutInto(["beside","thursday","teach","two","why"]);
