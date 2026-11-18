/* ===== Many hats, one picture: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says. The ideas are explained at a board, by Carmen
   Vidal, a consultant, by Noor or by Ivy; what to keep is a page of Ivy's or Helena's notebook (mh_uni.js). Kaifeng is in mhk_city.js.
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's
   recorded again; the score (tools/score.py) takes the same words. Sizes are in the 1920 x 1080 frame; people's sizes come from each
   place's eye line. */
const mh_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,1,"Many hats, one picture",a);}};
function mh_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const mh_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const mh_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const mh_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const mh_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const mh_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const mh_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const mh_sp=(tt,i,spans,base,g)=>mh_alive(tt,{expr:mh_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const mh_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=o.flip!=null?o.flip:x1<x0;if(tt<t0)return null;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip:x1<x0},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{},o.hold?{hold:o.hold,holds:true}:{}));};
const mh_static=rows=>rows.map(r=>{const q=Object.assign({},r);delete q.at;delete q.d;return q;});
const MH_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const MH_SITNOTE={mode:"sit",lean:10,head:12,aN:[34,70,"grip"],aF:[30,78,"grip"],lN:[86,3],lF:[82,-5]};
const MH_LAST="Grow people who go deep in one thing, and learn enough of the rest to see the whole.";

/* ---------------------------------------------------------------- Kaifeng's people at work */
// whoever stands a while on the street: [who, x, floor, pose, flip, opts]; or {fl, draw(x)} for whoever moves; drawn far to near
function mh_street(x,tt,list){list.filter(Boolean).map(p=>Array.isArray(p)?{fl:p[2],p}:p).sort((a,b)=>a.fl-b.fl).forEach(it=>{if(it.draw)return it.draw(x);
  const [who,px,fl,pose,flip,o0]=it.p,o=o0||{},f=o.face||mh_alive(tt,{expr:o.expr||"neutral",gaze:o.gaze||[1,0]},px%5);
  mhk_person(x,who,px,fl,pose||"stand",Object.assign({t:tt+(px%7),flip:!!flip},o,f));});}
// a digger at the trench's edge, bent over the spade and up again, steadily (i: so no two dig together); k (0 to 1): from standing
const mh_digger=(who,px,fl,tt,i,k,flip)=>({fl,draw:cc=>{const U=PK.u,u=0.5+0.5*Math.sin(tt*2.4+i*1.9),pose=PK.poseMix("stand",PK.poseMix(MHK_DIG2,MHK_DIG,u),U.clamp(k,0,1));
  mhk_person(cc,who,px,fl,pose,Object.assign({t:tt+i,flip:!!flip,hold:mhk_spade,holds:true},mh_alive(tt,{expr:"neutral",gaze:[1,0.6]},i)));}});
// a boat poled along the trench from x0 to x1 between t0 and t1; whoever poles stands at its stern
const mh_boat=(who,x0,x1,t0,t1,load,len,tt)=>({fl:MHK_TR.y1-40,draw:cc=>{const U=PK.u,bx=U.lerp(x0,x1,U.sine(U.clamp((tt-t0)/(t1-t0),0,1))),y=MHK_TR.y1-18;
  mhk_boat(cc,bx,y,{load,part:"back",len});mhk_person(cc,who,bx-len*0.4,y-22,MHK_POLE,Object.assign({t:tt,hold:mhk_pole,holds:true},mh_alive(tt,{gaze:[1,0.2]},bx%5)));
  mhk_boat(cc,bx,y,{part:"front",len});}});

/* ---------------------------------------------------------------- 1. One move, three jobs */
scene("trench",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tN=c.fire-0.4,tD=c.ding-0.5,tJ=c.jobs-0.4,tP=c.plan-0.4,tB=c.boats-0.4,tF=c.fill-0.4,tS=c.shen-0.4,tV=c.saving-0.4,tO=c.one-0.4,tA=c.data-0.5;
  const ding=(tt,o)=>["ding",1560,985,"clasp",true,Object.assign({face:mh_alive(tt,{expr:"neutral",gaze:[1,0.1]},1,tD)},o||{})];
  const clerk=tt=>["clerk",1790,1010,"clasp",true,{hold:mhk_scroll,holds:true,face:mh_alive(tt,{expr:"listen",gaze:[1,0.1]},3,tD)}];
  ag_shots(ctx,S,t,sc.dur,[
    // a main street of the capital by day: people about their business, a cart going by
    {at:0,place:"mhkStreet",keys:[[0,960,540,1.0],[tN,1040,520,1.04]],d:3,draw:(x,tt,cam)=>{
      mh_street(x,tt,[["pass2",380,900,"clasp",false,{face:mh_sp(tt,1,[[1.0,3.4],[6.4,8.0]],"smile",0)}],["pass3",600,920,"clasp",true,{face:mh_sp(tt,2,[[3.8,6.0]],"smile",0)}],
        {fl:800,draw:cc=>{if(tt>0.4&&tt<13)mhk_walk(cc,"pass1",tt,{x0:2100,x1:-160,t0:0.4,t1:12.4,floor:800},{});}},
        {fl:1000,draw:cc=>{if(tt>1.0&&tt<15)mhk_carter(cc,"cart1",tt,{x0:2500,x1:-700,t0:1.0,t1:14.4,floor:1000},"timber");}}]);}},
    // that night: the palace beyond the gate burns, and the fire spreads; people come out to look
    {at:tN,cut:true,place:"mhkNight",keys:[[tN,960,540,1.0],[E.burns,1160,480,1.08]],d:3,draw:(x,tt,cam)=>{
      mhk_fire(x,tt,ag_in(tt,c.fire,E.burns-c.fire),{});
      const look=(i)=>mh_alive(tt,{expr:"worry",gaze:[1,-0.35]},i,tN);
      mh_street(x,tt,[["pass2",380,900,"clasp",false,{face:look(1)}],["pass3",600,920,"clasp",false,{face:look(2)}],["pass1",880,840,"stand",false,{face:look(3)}],["cart1",240,980,"stand",false,{face:look(4)}]]);}},
    // the next day: the gate burned, smoke still rising; Ding Wei is put in charge of the repairs
    {at:tD,place:"mhkBurned",dis:1.0,keys:[[tD,960,540,1.0],[c.ding+3,1300,610,1.12]],d:3,draw:(x,tt,cam)=>{let Jd=null;mhk_smoke(x,tt,1);
      mh_street(x,tt,[clerk(tt),{fl:985,draw:cc=>{Jd=mh_come(cc,MHK_FOLK.ding,tt,2150,1560,tD+0.2,tD+1.9,985,mhk_h(985),{flip:true,then:"clasp",face:mh_alive(tt,{expr:"neutral",gaze:[1,0.1]},1,tD)});
        if(Jd)mhk_cap(cc,MHK_FOLK.ding,Jd);}}]);
      mh_name(x,Jd,tt,w("ding","Ding Wei",0),E.ding+0.4,"Ding Wei","In charge of the repairs",190);}},
    // three jobs, each by cart through the crowded city: earth carried in, timber hauled up from the water, rubble carted away
    {at:tJ,place:"mhkBurned",later:true,keys:[[tJ,1300,610,1.12],[tJ+1.6,960,540,1.0],[c.change,1360,660,1.22],[tP-0.2,1360,660,1.22]],d:3,draw:(x,tt,cam)=>{mhk_smoke(x,tt,0.6);
      const wait=(i)=>mh_alive(tt,{expr:PK.exprMix("neutral","worry",ag_in(tt,c.cost,0.6)),gaze:[1,0]},i,tJ);
      mh_street(x,tt,[ding(tt,{face:PK.face(tt,{expr:PK.exprMix("neutral","think",ag_in(tt,c.change,0.6)),gaze:[1,0.2]},[[c.earth+1,"look",2.4,[1,0.5]],[c.timber+1.4,"nod"],[c.cost+2,"look",2.4,[1,0.4]],[c.change+2,"nod"]])}),clerk(tt),
        ["pass2",300,900,"clasp",false,{face:wait(1)}],["pass3",470,930,"clasp",true,{face:wait(2)}],
        {fl:860,draw:cc=>{if(tt>c.earth-0.6&&tt<c.earth+13)mhk_carter(cc,"cart1",tt,{x0:-600,x1:2500,t0:c.earth-0.6,t1:c.earth+12.6,floor:860},"earth");}},
        {fl:940,draw:cc=>{if(tt>c.timber-0.6&&tt<c.timber+13)mhk_carter(cc,"cart2",tt,{x0:2600,x1:-700,t0:c.timber-0.6,t1:c.timber+12.6,floor:940},"timber");}},
        {fl:800,draw:cc=>{if(tt>c.rubble-0.6&&tt<c.rubble+12)mhk_carter(cc,"cart3",tt,{x0:2400,x1:-600,t0:c.rubble-0.6,t1:c.rubble+11.6,floor:800},"rubble");}}]);}},
    // his plan makes the three jobs one: the street dug for earth, the canal's water let in, boats to the gate, the rubble back in
    {at:tP,place:"mhkBurned",later:true,keys:[[tP,1360,660,1.22],[tP+1.8,960,540,1.0]],d:3,draw:(x,tt,cam)=>{mhk_smoke(x,tt,0.4);let Jd=null;
      mhk_trench(x,{dug:ag_in(tt,c.dig,E.dig-c.dig+1.2),water:ag_in(tt,c.canal+2.0,c.boats-c.canal-2.4),heaps:1});
      const k=1-ag_in(tt,c.canal+0.4,0.45);
      mh_street(x,tt,[{fl:985,draw:cc=>{Jd=mhk_person(cc,"ding",1560,985,"clasp",Object.assign({t:tt,flip:true},mh_sp(tt,1,[[c.plan+0.2,E.plan+0.4]],"neutral",0.1)));}},clerk(tt),
        mh_digger("dig1",360,770,tt,0,k*ag_in(tt,c.dig-0.4,0.5),false),mh_digger("dig2",780,800,tt,1,k*ag_in(tt,c.dig,0.5),true),mh_digger("dig3",1180,850,tt,2,k*ag_in(tt,c.dig+0.4,0.5),false)]);
      mh_bub(x,Jd,tt,c.plan+0.2,E.plan+1.0,["One move for all three jobs."],cam,{lean:-120});}},
    {at:tB,place:"mhkBurned",later:true,keys:[[tB,960,540,1.0],[c.fill-1,1060,560,1.05]],d:3,draw:(x,tt,cam)=>{mhk_smoke(x,tt,0.3);
      mhk_trench(x,{dug:1,water:1,heaps:0.6});
      mh_street(x,tt,[ding(tt,{face:mh_alive(tt,{expr:"smile",gaze:[1,0.2]},1,tB)}),clerk(tt),
        mh_boat("boat1",-500,1380,c.boats-0.2,c.boats+5.2,"timber",320,tt),mh_boat("boat2",-500,860,c.boats+1.2,c.boats+6.6,"goods",280,tt)]);}},
    {at:tF,place:"mhkBurned",later:true,keys:[[tF,1060,560,1.05],[tF+1.6,960,540,1.0]],d:3,draw:(x,tt,cam)=>{mhk_smoke(x,tt,0.2);
      const f=ag_in(tt,c.fill+0.3,E.fill-c.fill+0.4);mhk_trench(x,{dug:1,water:1,heaps:0,fill:f});
      mh_street(x,tt,[ding(tt,{face:mh_alive(tt,{expr:"smile",gaze:[1,0.2]},1,tF)}),clerk(tt),
        {fl:870,draw:cc=>{mhk_cart(cc,560,870,"rubble",1,0);}},mh_digger("dig1",820,790,tt,0,1-ag_in(tt,E.fill,0.45),true),mh_digger("dig2",1200,800,tt,1,1-ag_in(tt,E.fill,0.45),false)]);}},
    // some seventy years later, Shen Kuo writes the story down
    {at:tS,place:"mhkStudy",dis:1.0,keys:[[tS,960,540,1.0],[c.saving-0.6,1000,560,1.06]],d:3,draw:(x,tt,cam)=>{const fl=930,h=mhk_hS(fl),top=fl-0.2*h;
      const Js=mhk_person(x,"shen",830,fl,MHK_WRITE,Object.assign({t:tt,hold:mhk_brush,holds:true,reachN:[1010,top-4],reachF:[960,top-2]},mh_alive(tt,{expr:"think",gaze:[1,0.9]},2,tS)));
      mhk_desk(x,1080,fl,h,{write:ag_in(tt,c.shen,E.shen-c.shen)});
      mh_name(x,Js,tt,w("shen","Shen Kuo",0),E.shen+0.6,"Shen Kuo","A scholar",120,-40);
      mh_bub(x,Js,tt,c.shen+0.1,w("shen","wrote",-0.1),["One move, and three jobs done."],cam,{lean:220,rise:60});}},
    // the city got its streets back
    {at:tV,place:"mhkStreet",dis:1.0,keys:[[tV,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      mh_street(x,tt,[["pass2",380,900,"clasp",false,{face:mh_alive(tt,{expr:"smile"},1,tV)}],["pass3",600,920,"clasp",true,{face:mh_alive(tt,{expr:"smile"},2,tV)}],
        {fl:820,draw:cc=>{mhk_walk(cc,"pass1",tt,{x0:-160,x1:2100,t0:tV+0.2,t1:tV+12,floor:820},{});}},
        {fl:990,draw:cc=>{mhk_carter(cc,"cart2",tt,{x0:2500,x1:-700,t0:tV+0.6,t1:tV+13.6,floor:990},"timber");}}]);}},
    // the diggers, the boatmen and the carters, each good at their job; and the one who saw the three as one
    {at:tO,place:"mhkStreet",later:true,keys:[[tO,960,540,1.0],[c.one+3.4,1000,600,1.08]],d:3,draw:(x,tt,cam)=>{const look=i=>mh_alive(tt,{expr:"smile",gaze:[1,0.1]},i,tO);
      mh_street(x,tt,[["dig1",300,860,"stand",false,{hold:mhk_spade,holds:true,face:look(0)}],["boat1",560,930,"stand",false,{hold:mhk_pole,holds:true,face:look(1)}],
        {fl:1010,draw:cc=>{mhk_cart(cc,770,1010,"timber",1,0);mhk_person(cc,"cart2",1000,1010,"stand",Object.assign({t:tt},look(2)));}},
        ["ding",1460,895,"clasp",true,{face:PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[c.one+1.2,"look",2.4,[1,0.3]],[c.one+4.4,"nod"]])}]]);}},
    // a data team has its parts too, each known deeply by someone who wears more than one hat
    {at:tA,place:"mhTeam",dis:1.0,keys:[[tA,960,540,1.0],[c.see,1000,560,1.05]],d:3,draw:(x,tt,cam)=>{
      mh_team(x,tt,{clock:10,sam:Object.assign({work:1},mh_alive(tt,{},1,tA)),jun:Object.assign({work:1},mh_alive(tt,{},2,tA)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tA)),
        people:[{fl:875,draw:cc=>{PK.person(cc,"noor",1680,875,mh_hT(875),"clasp",Object.assign({t:tt,flip:true},mh_alive(tt,{expr:"neutral"},4,tA)));}},
          {fl:990,draw:cc=>{PK.person(cc,"helena",760,990,mh_hT(990),"clasp",Object.assign({t:tt},PK.face(tt,{expr:"think",gaze:[1,0.1]},[[c.see+0.8,"look",2.6,[1,0.4]],[c.see+4,"nod"]])));}}]});}}
  ]);
  mh_card(ctx,S,t,c.when+0.3,tN-0.3,{kick:"Kaifeng, 1015",title:"China's capital, under the Song dynasty"},{y:40,mid:true});
  mh_card(ctx,S,t,tD+0.4,c.jobs-0.6,{kick:"The next day",title:"Two gates, a hall, a treasury, a library"},{y:40,mid:true});
  mh_card(ctx,S,t,tS+0.3,c.saving-0.5,{kick:"About seventy years later",title:"Shen Kuo writes it down"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"Many hats, one picture","Seeing the parts as one","Leading data people · The new skills",{side:"right",size:64});
});

/* ---------------------------------------------------------------- 2. One question to follow */
scene("question",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tH=c.helena-0.5,tR=c.role-0.5,tW=c.hats-0.5,tG=c.graham-0.5,tQ=c.q-0.3,tL=c.goals-0.4,tN=w("goals","first goals",-0.9),CA=PK.ROOMS.campus;
  const BA=PK.pace(ctx,"carmen",mh_boardA(sc,w)),N1=PK.pace(ctx,null,mh_note1(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the campus, a year from now; on Monday 1 March, Ivy Reyes arrives
    {at:0,place:"mhCampus",keys:[[0,960,540,1.0],[c.ivy,1080,580,1.1],[tH-0.2,1100,590,1.12]],d:3,draw:(x,tt,cam)=>{let Ji=null;
      if(tt<12)PK.walk(x,PK.extra(4),tt,{x0:-160,x1:1300,t0:0.6,t1:11.6,floor:CA.near-120,h:PK.hAt(CA.near-120,CA.eye)},{});
      if(tt<14)PK.walk(x,PK.extra(9),tt,{x0:2100,x1:-160,t0:2.0,t1:13.6,floor:CA.near-40,h:PK.hAt(CA.near-40,CA.eye)},{});
      Ji=mh_come(x,"ivy",tt,2140,1160,c.ivy-0.6,c.ivy+2.4,CA.near,PK.hAt(CA.near,CA.eye),{then:"clasp",flip:true,hold:PK.inHand.notebook({}),face:mh_sp(tt,2,[[c.depth,E.depth]],"smile",0)});
      mh_name(x,Ji,tt,w("ivy","Ivy Reyes",0),c.depth-0.4,"Ivy Reyes","Graduate data analyst",180);
      mh_bub(x,Ji,tt,c.depth-0.1,c.helena-0.6,["My degree is in statistics."],cam,{lean:-200});}},
    // in the team's room, Helena Novak, the data manager, welcomes her
    {at:tH,cut:true,place:"mhTeam",keys:[[tH,960,540,1.0],[c.helena+3,1000,560,1.06]],d:3,draw:(x,tt,cam)=>{let Jh=null,Ji=null;
      mh_team(x,tt,{clock:9,sam:Object.assign({work:0.4,turn:0.3},mh_alive(tt,{expr:"smile"},1,tH)),jun:Object.assign({work:0.4,turn:0.3},mh_alive(tt,{expr:"smile"},2,tH)),marta:Object.assign({work:0,turn:1},mh_alive(tt,{expr:"smile"},3,tH)),
        people:[{fl:960,draw:cc=>{Jh=PK.person(cc,"helena",820,960,mh_hT(960),"clasp",Object.assign({t:tt},mh_sp(tt,4,[[tH+0.3,c.helena+1.2]],"smile",0)));}},
          {fl:985,draw:cc=>{Ji=PK.person(cc,"ivy",1160,985,mh_hT(985),"clasp",Object.assign({t:tt,flip:true,hold:PK.inHand.notebook({}),holds:true},mh_alive(tt,{expr:"smile",gaze:[1,0]},5,tH)));}}]});
      mh_name(x,Jh,tt,c.helena+1.5,c.role-0.8,"Helena Novak","Data manager",170);
      mh_bub(x,Jh,tt,tH+0.3,c.helena+1.2,["Welcome, Ivy."],cam,{lean:-160});}},
    // Carmen Vidal explains, at the board: managing and leading, two sides of one role
    {at:tR,place:"mhBoard",dis:0.6,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const J=PK.teach(x,"carmen",tt,BA,{say:[[c.role,E.role]]});
      mh_name(x,J,tt,tR+0.4,w("role","plans",0),"Carmen Vidal","Consultant",150);}},
    // everyone in the team wears more than one hat; so Helena gives Ivy a month, and one real question
    {at:tW,place:"mhTeam",dis:0.6,keys:[[tW,960,540,1.0],[c.month,920,560,1.08],[tG-0.2,920,560,1.08]],d:3,draw:(x,tt,cam)=>{let Jh=null;
      mh_team(x,tt,{clock:10,sam:Object.assign({work:1},mh_alive(tt,{},1,tW)),jun:Object.assign({work:1},mh_alive(tt,{},2,tW)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tW)),
        people:[{fl:875,draw:cc=>{PK.person(cc,"noor",1680,875,mh_hT(875),"clasp",Object.assign({t:tt,flip:true},mh_alive(tt,{},4,tW)));}},
          {fl:960,draw:cc=>{Jh=PK.person(cc,"helena",820,960,mh_hT(960),"clasp",Object.assign({t:tt},mh_sp(tt,5,[[c.month+0.2,E.month]],"smile",0)));}},
          {fl:985,draw:cc=>{PK.person(cc,"ivy",1160,985,mh_hT(985),"clasp",Object.assign({t:tt,flip:true,hold:PK.inHand.notebook({}),holds:true},mh_alive(tt,{expr:"listen",gaze:[1,0]},6,tW)));}}]});
      mh_bub(x,Jh,tt,c.month+0.2,tG-0.3,["A month to learn every part of our work,","and one real question to follow."],cam,{lean:-150});}},
    // the question comes from Graham Ellis, Director of Facilities, on a call to Helena's corner
    {at:tG,cut:true,place:"mhCorner",keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let J=null;
      mh_corner(x,tt,{t0:tG,he:"listen",hg:[1,0.3],hf:mh_alive(tt,{expr:"listen",gaze:[1,0.3]},1,tG)});
      PK.callout(x,1180,60,560,250,[960,600],ag_io(tt,tG+0.2,tQ,0.4),(cc,bx,by,bw,bh)=>{J=PK.call(cc,bx,by,bw,bh,[
        {who:"graham",a:ag_in(tt,tG+0.3,0.4),face:{expr:"think"},say:[[w("graham","should he",0),E.graham]],events:[[c.graham+3,"nod"]],name:"Graham Ellis",role:""}],tt,{stack:true});});
      if(J)PK.say(x,J[0],["Should I ask the Council","for a new building?"],ag_io(tt,w("graham","should he",0),tQ-0.2,0.3),{cam});}},
    // his question, agreed with him in writing
    {at:tQ,place:"mhCorner",later:true,keys:[[tQ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const CH={title:"Graham Ellis",who:["graham"],me:"helena",msgs:[{who:"graham",s:"Too few rooms, or too few at some hours?",at:w("q","too few",0)},{who:"helena",s:"Agreed: that's the question.",at:E.q+0.2,type:1.0}]},cs=PK.chatSize(x,CH,{size:28});
      const R=mh_corner(x,tt,{t0:tQ,laptop:true,he:"think",hg:[1,0.5],hf:mh_alive(tt,{expr:"think",gaze:[1,0.5]},1,tQ)});
      PK.callout(x,1100,60,cs.w,cs.h,R.laptop||[900,600],ag_in(tt,tQ+0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}},
    // in her first week, Ivy writes her first goals
    {at:tL,place:"mhTeam",dis:0.6,keys:[[tL,1300,620,1.2]],d:2,draw:(x,tt,cam)=>{
      mh_team(x,tt,{clock:14,sam:Object.assign({work:1},mh_alive(tt,{},1,tL)),jun:Object.assign({work:1},mh_alive(tt,{},2,tL)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tL)),
        people:[{fl:MH_SAMC.floor,draw:cc=>{PK.seated(cc,"ivy",MH_SAMC.x,MH_SAMC.floor,mh_hT(MH_SAMC.floor),PK.poseMix("sit",MH_SITNOTE,ag_in(tt,tL+0.3,0.5)),Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},mh_alive(tt,{expr:"think",gaze:[1,0.7]},4,tL)));}}]});}},
    {at:tN,place:"mhNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N1,{});}}
  ]);
  mh_imagined(ctx,S,t,c.films,c.ivy+1,"The university, 2027 · imagined");
  mh_card(ctx,S,t,c.ivy+0.2,w("ivy","Ivy Reyes",-0.3),{kick:"Monday 1 March 2027",title:"Ivy joins the team"},{y:40,mid:true});
  mh_kick(ctx,S,ag_in(t,0.6,0.6)*(1-mh_apart(t,[[c.films,c.depth],[c.month,tG],[tR,tW],[tG,tL],[tN,1e9]])));
});

/* ---------------------------------------------------------------- 3. A few days with each */
scene("parts",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,LE=PK.ROOMS.lecture,hL=fl=>PK.hAt(fl,LE.eye);
  const tS=c.sam-0.4,tY=c.yusuf-0.4,tO=c.noor-0.5,tB=w("noor","born",-1.2),tJ=c.jun-0.5,tC=c.deep-0.5,tI=E.deep-0.2,tN=w("learn","enough",-0.9);
  const BB=PK.pace(ctx,"noor",mh_boardB(sc,w)),BC=PK.pace(ctx,"carmen",mh_boardC(sc,w)),N2=PK.pace(ctx,null,mh_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // a teaching room: Mei Tanaka, who keeps the timetable, shows Ivy the room as it names it
    {at:0,place:"mhLecture",keys:[[0,960,540,1.0],[c.mei+1,900,560,1.08],[tS-0.2,900,560,1.08]],d:3,draw:(x,tt,cam)=>{let Jm=null,Ji=null;
      mh_room(x,tt,{plate:ag_in(tt,w("names","rooms",-0.6),0.5),people:[
        {fl:930,draw:cc=>{Jm=PK.person(cc,"mei",760,930,hL(930),MH_SHOW,Object.assign({t:tt,hold:mh_sheet,holds:true},mh_sp(tt,1,[[w("names","She",0),E.names]],"smile",0.1)));}},
        {fl:960,draw:cc=>{Ji=mh_come(cc,"ivy",tt,2140,1180,0.3,2.5,960,hL(960),{then:"clasp",flip:true,hold:PK.inHand.notebook({}),face:mh_alive(tt,{expr:"listen",gaze:[1,0.1]},2,0)});}}]});
      mh_name(x,Jm,tt,w("mei","Mei Tanaka",0),c.names-0.4,"Mei Tanaka","Registrar's office",170);
      if(Jm)PK.callout(x,1040,80,580,250,[Jm.hdN[0]+70,Jm.hdN[1]+80],ag_io(tt,w("mei","every class",-0.2),c.names-0.3,0.4),(cc,bx,by,bw,bh)=>mh_panel(cc,bx,by,bw,bh,"The timetable",[["Every class, hour by hour"],["186 rooms",PK.C.orange,40]]));
      mh_bub(x,Jm,tt,w("names","She",0),tS-0.4,["I name the rooms, too."],cam,{lean:-160});}},
    // Sam Okafor runs the data platform, and the feed from each room's sensor, which counts the people in it every hour
    {at:tS,place:"mhLecture",later:true,keys:[[tS,900,560,1.08],[tS+1.6,700,520,1.1],[tY-0.2,700,520,1.1]],d:3,draw:(x,tt,cam)=>{let Js=null;
      mh_room(x,tt,{plate:1,people:[
        {fl:900,draw:cc=>{Js=PK.person(cc,"sam",360,900,hL(900),"clasp",Object.assign({t:tt},PK.face(tt,{expr:mh_talk("smile",tt,[[c.sam+0.6,c.sam+2.4]]),gaze:[1,0.2]},[[w("sam","sensor",0),"look",3.0,[1,-0.9]],[c.sam+5.6,"nod"]])));}},
        {fl:960,draw:cc=>{PK.person(cc,"ivy",1000,960,hL(960),"clasp",Object.assign({t:tt,flip:true,hold:PK.inHand.notebook({}),holds:true},PK.face(tt,{expr:"listen",gaze:[1,0.1]},[[w("sam","sensor",0.4),"look",2.6,[1,-0.9]],[c.sam+5.8,"nod"]])));}}]});
      mh_name(x,Js,tt,w("sam","Sam Okafor",0),w("sam","sensor",-0.6),"Sam Okafor","Data platform",170);
      PK.callout(x,980,70,520,250,[LE.sensor[0]+30,LE.sensor[1]+10],ag_io(tt,w("sam","counts",-0.3),tY-0.3,0.4),(cc,bx,by,bw,bh)=>mh_panel(cc,bx,by,bw,bh,"B-204 · 10:00",[["31 people",PK.C.orange,44],["counted every hour"]]));}},
    // Yusuf Demir set the rule for that feed: on the campus, he answers Ivy's message
    {at:tY,place:"mhCampus",dis:0.6,keys:[[tY,900,570,1.1]],d:2,draw:(x,tt,cam)=>{const CA=PK.ROOMS.campus;
      const CH={title:"Ivy Reyes",who:["ivy"],me:"yusuf",msgs:[{who:"ivy",s:"Does the sensor see who's there?",at:-10},{who:"yusuf",s:"Counts, never people.",at:w("yusuf","counts",0),type:1.4}]},cs=PK.chatSize(x,CH,{size:28});
      const Jy=PK.person(x,"yusuf",1060,CA.near,PK.hAt(CA.near,CA.eye),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone({back:true}),holds:true},PK.face(tt,{expr:"think",gaze:[1,0.9]},[[w("yusuf","counts",0.6),"smile",2.0]])));
      mh_name(x,Jy,tt,w("yusuf","Yusuf Demir",0),w("yusuf","counts",-0.4),"Yusuf Demir","Data governance lead",170,80);
      PK.callout(x,240,180,cs.w,cs.h,[Jy.hdN[0]-20,Jy.hdN[1]-30],ag_in(tt,tY+0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}},
    // Noor Rahman keeps the map of where data is born and where it goes: she draws it at the team's board
    {at:tO,place:"mhTeam",dis:0.6,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Jn=null;
      mh_team(x,tt,{clock:11,sam:null,jun:Object.assign({work:0,pose:"sit"},mh_alive(tt,{expr:"listen",gaze:[1,-0.2]},2,tO)),marta:Object.assign({turn:1,work:0,pose:"sit"},mh_alive(tt,{expr:"listen",gaze:[1,-0.2]},3,tO)),people:[
        {fl:MH_RB.floor,draw:cc=>{Jn=mh_roomBoard(cc,tt,BB,"noor",{});}},
        {fl:MH_SAMC.floor,draw:cc=>{PK.seated(cc,"ivy",MH_SAMC.x,MH_SAMC.floor,mh_hT(MH_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},mh_alive(tt,{expr:"listen",gaze:[1,-0.2]},4,tO)));}}]});
      mh_name(x,Jn,tt,w("noor","Noor Rahman",0),tB-0.2,"Noor Rahman","Data architect",170);}},
    {at:tB,cut:true,place:"mhBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"noor",tt,BB,{say:[[c.noor,E.noor]]});}},
    // Jun Park builds the models, and teaches: every day, Ivy spends an hour beside him, changing real ones
    {at:tJ,place:"mhTeam",dis:0.6,keys:[[tJ,1300,560,1.12],[c.films,1240,560,1.08],[tC-0.2,1240,560,1.08]],d:3,draw:(x,tt,cam)=>{let Jj=null;
      const R=mh_team(x,tt,{clock:15,sam:Object.assign({work:1},mh_alive(tt,{},1,tJ)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tJ)),
        jun:Object.assign({work:1},mh_sp(tt,2,[[c.pair+0.4,c.pair+2.2]],"smile",-0.1)),showJ:PK.onScreen.chat(0.5,{rows:[[0.5,0.4,1],[0.4,0.5,1]]}),people:[
        {fl:900,draw:cc=>{PK.seated(cc,"ivy",1540,900,mh_hT(900),"sitWork",Object.assign({t:tt,reachN:[1650,700],reachF:[1630,706]},mh_alive(tt,{expr:"listen",gaze:[1,0.4]},4,tJ)));}}]});
      Jj=R.jun;mh_name(x,Jj,tt,w("jun","Jun Park",0),c.pair-0.3,"Jun Park","Analytics engineer",170,-60);}},
    // each of them is deep in one part, and right about it (Carmen)
    {at:tC,place:"mhBoard",dis:0.6,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.deep,E.deep]]});}},
    // Ivy learns enough of each to follow, and asks each the same question
    {at:tI,place:"mhTeam",dis:0.6,keys:[[tI,1300,620,1.2]],d:2,draw:(x,tt,cam)=>{
      mh_team(x,tt,{clock:16,sam:Object.assign({work:1},mh_alive(tt,{},1,tI)),jun:Object.assign({work:1},mh_alive(tt,{},2,tI)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tI)),
        people:[{fl:MH_SAMC.floor,draw:cc=>{PK.seated(cc,"ivy",MH_SAMC.x,MH_SAMC.floor,mh_hT(MH_SAMC.floor),MH_SITNOTE,Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},mh_alive(tt,{expr:"think",gaze:[1,0.7]},4,tI)));}}]});}},
    {at:tN,place:"mhNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N2,{});}}
  ]);
  mh_card(ctx,S,t,c.films+0.2,E.films+0.6,{kick:"Films of their own",title:"The Inner Life of Data",sub:"The map before the data"},{y:40,mid:true});
  mh_kick(ctx,S,ag_in(t,0.6,0.6)*(1-mh_apart(t,[[w("mei","every class",-0.4),c.names],[w("sam","counts",-0.3),tY],[tY,tY+0.6],[tB,tJ],[c.films,tI],[tN,1e9]])));
});

/* ---------------------------------------------------------------- 4. The whole route, on one page */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tB=c.decision-0.6,tJ=c.join-0.5,tD=c.drop-0.4,tM=c.nobody-0.5,BD=PK.pace(ctx,"ivy",mh_boardD(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // in her fourth week, Ivy draws the whole route of Graham's question at the team's board, starting from his decision
    {at:0,place:"mhTeam",keys:[[0,960,540,1.0],[tB,1000,520,1.06]],d:3,draw:(x,tt,cam)=>{
      mh_team(x,tt,{clock:10,sam:null,jun:Object.assign({work:0,pose:"sit"},mh_alive(tt,{expr:"listen",gaze:[1,-0.2]},2,0)),
        marta:Object.assign({turn:1,work:0,pose:"sit"},mh_alive(tt,{expr:"listen",gaze:[1,-0.2]},3,0)),people:[
        {fl:MH_RB.floor,draw:cc=>{mh_roomBoard(cc,tt,BD,"ivy",{events:MH_HEV});}},
        {fl:MH_SAMC.floor,draw:cc=>{PK.seated(cc,"helena",MH_SAMC.x,MH_SAMC.floor,mh_hT(MH_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},mh_alive(tt,{expr:"listen",gaze:[1,-0.2]},4,0)));}}]});}},
    {at:tB,cut:true,place:"mhBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"ivy",tt,BD,{say:[]});}},
    // where the bookings meet the counts: the two must name each room the same way; for 172 they do, for 14 they don't
    {at:tJ,cut:true,place:"mhTeam",keys:[[tJ,1300,560,1.12]],d:2,draw:(x,tt,cam)=>{let Ji=null;
      const R=mh_team(x,tt,{clock:11,sam:Object.assign({work:1},mh_alive(tt,{},1,tJ)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tJ)),
        jun:Object.assign({work:0.6},mh_alive(tt,{expr:"listen",gaze:[1,0.3]},2,tJ)),people:[
        {fl:900,draw:cc=>{Ji=PK.seated(cc,"ivy",1540,900,mh_hT(900),"sitWork",Object.assign({t:tt,reachN:[1650,700],reachF:[1630,706]},PK.face(tt,{expr:PK.exprMix("think","worry",ag_in(tt,c.fourteen,0.6)),gaze:[1,0.4]},[[c.names+1.2,"nod"],[c.drop-1,"look",2,[1,0]]])));}}]});
      const sx=R.jun&&R.jun.desk?R.jun.desk.cx:1690;
      PK.callout(x,560,140,620,330,[sx-40,690],ag_in(tt,tJ+0.4,0.4),(cc,bx,by,bw,bh)=>mh_panel(cc,bx,by,bw,bh,"Room names, joined",[],
        [["172 the same",172*ag_in(tt,w("names","172",-0.2),0.8),186,PK.C.green],["14 not: renumbered",14*ag_in(tt,w("fourteen","14",-0.2),0.6),186,PK.C.amber]]));}},
    // joined as they were, those 14 would drop out without a word: Ivy tells Helena
    {at:tD,cut:true,place:"mhCorner",keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=mh_corner(x,tt,{t0:tD,who2:"ivy",he:"listen",hg:[1,0.3],hf:PK.face(tt,{expr:PK.exprMix("listen","worry",ag_in(tt,w("drop","not 186",0),0.6)),gaze:[1,0.3]},[[c.drop+2,"nod"]]),
        ie:mh_talk("think",tt,[[c.drop+0.2,c.drop+3.2]]),ig:[1,0.3]});
      mh_bub(x,R.who2,tt,c.drop+0.1,tM-0.4,["Joined as they are,","14 rooms drop out."],cam,{lean:-120});}},
    // nobody was wrong: Mei and Sam, side by side for the first time
    {at:tM,cut:true,place:"mhTeam",keys:[[tM,960,540,1.0],[c.hats,1120,560,1.1]],d:3,draw:(x,tt,cam)=>{
      mh_team(x,tt,{clock:15,sam:Object.assign({work:0,turn:1},mh_alive(tt,{expr:"smile",gaze:[1,0.1]},1,tM)),jun:Object.assign({work:1},mh_alive(tt,{},2,tM)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tM)),
        people:[{fl:1010,draw:cc=>{mh_come(cc,"mei",tt,2140,1500,tM+0.3,tM+2.2,1010,mh_hT(1010),{then:"clasp",flip:true,face:mh_alive(tt,{expr:"smile",gaze:[1,0.1]},4,tM)});}},
          {fl:960,draw:cc=>{PK.person(cc,"helena",700,960,mh_hT(960),"clasp",Object.assign({t:tt},mh_alive(tt,{expr:"listen",gaze:[1,0.1]},5,tM)));}},
          {fl:900,draw:cc=>{PK.person(cc,"ivy",1040,900,mh_hT(900),"clasp",Object.assign({t:tt},mh_alive(tt,{expr:"listen",gaze:[1,0.1]},6,tM)));}}]});}}
  ]);
  mh_card(ctx,S,t,0.3,tB-0.4,{kick:"Week four",title:"One page"},{y:40,mid:true});
  mh_kick(ctx,S,ag_in(t,0.6,0.6)*(1-mh_apart(t,[[0,tB],[tB,tJ],[tJ,tD]])));
});

/* ---------------------------------------------------------------- 5. Deep in one, enough of the rest */
scene("shape",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tN=w("needed","Ivy",-0.9),tT=c.t-0.5,tL=c.lists-0.4,tR=c.range-0.4,tE=c.essential-0.5;
  const N3=PK.pace(ctx,null,mh_note3(sc,w)),BE=PK.pace(ctx,"carmen",mh_boardE(sc,w)),BF=PK.pace(ctx,"carmen",mh_boardF(sc,w)),BG=PK.pace(ctx,"carmen",mh_boardG(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Helena, in her corner, writes what she needed from Ivy
    {at:0,place:"mhCorner",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{mh_corner(x,tt,{t0:0,book:true,write:ag_io(tt,0.4,tN+0.4,0.5),he:"think",hg:[1,0.6],hf:mh_alive(tt,{expr:"think",gaze:[1,0.6]},1,0)});}},
    {at:tN,place:"mhNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}},
    // that shape has a name; the frameworks that map the work; range (Carmen)
    {at:tT,place:"mhBoard",dis:0.6,keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BE,{say:[[c.t,E.t]]});}},
    {at:tL,place:"mhBoard",later:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BF,{say:[[c.lists,E.lists],[c.nobody,E.nobody]]});}},
    {at:tR,place:"mhBoard",later:true,keys:[[tR,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BG,{say:[[c.range,E.range],[c.messy,E.messy]]});}},
    // the specialists stay essential: Mei and Sam matched the 14 rooms in a day; Helena makes sure someone sees across them
    {at:tE,place:"mhTeam",dis:0.6,keys:[[tE,1100,560,1.1],[c.across,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      mh_team(x,tt,{clock:13,sam:Object.assign({work:1},mh_sp(tt,1,[[c.essential+3,c.essential+4.4]],"smile",0.2)),jun:Object.assign({work:1},mh_alive(tt,{},2,tE)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tE)),
        show:PK.onScreen.chat(0.6,{}),people:[
        {fl:MH_SAMC.floor-40,draw:cc=>{PK.seated(cc,"mei",1440,MH_SAMC.floor-40,mh_hT(MH_SAMC.floor-40),"sit",Object.assign({t:tt,flip:true},mh_sp(tt,4,[[c.essential+1,c.essential+2.6]],"smile",0.3)));}},
        {fl:985,draw:cc=>{PK.person(cc,"helena",760,985,mh_hT(985),"clasp",Object.assign({t:tt},mh_alive(tt,{expr:"smile",gaze:[1,0.1]},5,tE)));}},
        {fl:950,draw:cc=>{PK.person(cc,"ivy",560,950,mh_hT(950),"clasp",Object.assign({t:tt},mh_alive(tt,{expr:"smile",gaze:[1,0.1]},6,tE)));}}]});}}
  ]);
  mh_card(ctx,S,t,tE+0.3,c.across-0.4,{kick:"One day",title:"The 14 rooms matched"},{y:40,mid:true});
  mh_kick(ctx,S,ag_in(t,0.6,0.6)*(1-mh_apart(t,[[tN,tE+0.2]])));
});

/* ---------------------------------------------------------------- 6. From her page */
scene("kept",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tN=w("goal","Thursday",-0.6),tT=c.team-0.5,tC=c.catalog-0.5,tK=c.cant-0.5,N4=PK.pace(ctx,null,mh_note4(sc,w));
  const BD0=mh_static(mh_boardD(sc,w)),BD=PK.pace(ctx,"ivy",BD0),BR=PK.pace(ctx,"ivy",BD0.concat([{k:"star",x:1140,y:86,r:24,col:"green",at:w("cant","decision",-0.2),d:0.4},{k:"star",x:1140,y:162,r:24,col:"green",at:w("cant","question",-0.2),d:0.4}]));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"mhNotes",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N4,{});}},
    // the next week, the team takes up Graham's question from her page; Helena gives the join an owner
    {at:tT,place:"mhTeam",dis:0.6,keys:[[tT,960,540,1.0],[c.owner,960,570,1.08],[tC-0.2,960,570,1.08]],d:3,draw:(x,tt,cam)=>{let Jh=null;
      mh_team(x,tt,{clock:10,sam:null,jun:Object.assign({work:0,pose:"sit"},mh_alive(tt,{expr:"listen",gaze:[1,-0.2]},2,tT)),
        marta:Object.assign({turn:1,work:0,pose:"sit"},mh_alive(tt,{expr:"listen",gaze:[1,-0.2]},3,tT)),people:[
        {fl:MH_RB.floor,draw:cc=>{mh_roomBoard(cc,tt,BD,"ivy",{events:MH_HEV});}},
        {fl:1040,draw:cc=>{PK.person(cc,"mei",1560,1040,mh_hT(1040),"clasp",Object.assign({t:tt,flip:true},mh_alive(tt,{expr:"listen",gaze:[1,0.1]},4,tT)));}},
        {fl:930,draw:cc=>{PK.person(cc,"sam",1330,930,mh_hT(930),"clasp",Object.assign({t:tt,flip:true},mh_alive(tt,{expr:"listen",gaze:[1,0.1]},1,tT)));}},
        {fl:985,draw:cc=>{Jh=PK.person(cc,"helena",660,985,mh_hT(985),"clasp",Object.assign({t:tt},mh_sp(tt,5,[[c.owner+0.2,E.owner]],"smile",0.1)));}}]});
      mh_bub(x,Jh,tt,c.owner+0.2,tC-0.3,["Each term, Mei and Sam,","check the room names together."],cam,{lean:-140});}},
    // from April the catalog draws much of the route by itself: its lineage, on Jun's screen
    {at:tC,place:"mhTeam",later:true,keys:[[tC,960,570,1.08],[tC+1.6,1300,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=mh_team(x,tt,{clock:11,sam:Object.assign({work:1},mh_alive(tt,{},1,tC)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tC)),
        jun:Object.assign({work:0.6},mh_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tC)),people:[
        {fl:900,draw:cc=>{PK.seated(cc,"ivy",1540,900,mh_hT(900),"sitWork",Object.assign({t:tt,reachN:[1650,700],reachF:[1630,706]},mh_alive(tt,{expr:"listen",gaze:[1,0.4]},4,tC)));}}]});
      const sx=R.jun&&R.jun.desk?R.jun.desk.cx:1690;
      PK.callout(x,560,140,640,360,[sx-40,690],ag_in(tt,tC+0.4,0.4),(cc,bx,by,bw,bh)=>mh_panel(cc,bx,by,bw,bh,"Lineage",[
        ["Bookings · counts",PK.C.orange],["→ Jun's models",null],["→ Graham's page",PK.C.blue]].map((r,i)=>[r[0],r[1]?U.mix(r[1],[255,255,255],1-ag_in(tt,w("lineage",["raw","Jun's","page"][i],-0.3),0.5)):U.mix(PK.C.ink,[255,255,255],1-ag_in(tt,w("lineage","Jun's",-0.3),0.5)),36])));}},
    // what it can't draw is the decision and the question behind it: those stay on Ivy's page
    {at:tK,cut:true,place:"mhBoard",keys:[[tK,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      PK.teach(x,"ivy",tt,BR,{say:[],events:MH_HEV});}}
  ]);
  mh_card(ctx,S,t,0.3,tN-0.4,{kick:"Thursday 25 March",title:"Just before Easter"},{y:40,mid:true});
  mh_card(ctx,S,t,tT+0.3,c.owner-0.4,{kick:"The next week",title:"All 186 rooms"},{y:40,mid:true});
  mh_kick(ctx,S,ag_in(t,0.6,0.6)*(1-mh_apart(t,[[0,1e9]])));
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tI=c.ivy-0.5,tN=c.depth+0.2,tK=c.take-0.9,tE=c.breath+0.6,N5=PK.pace(ctx,null,mh_note5(sc,w));
  const BD=PK.pace(ctx,"ivy",mh_static(mh_boardD(sc,w)));
  ag_shots(ctx,S,t,sc.dur,[
    // in Kaifeng, the street back, and the people who did each job; Ding Wei saw the three as one
    {at:0,place:"mhkStreet",dis:1.0,keys:[[0,960,540,1.0],[tI-0.2,1000,600,1.08]],d:3,draw:(x,tt,cam)=>{const look=i=>mh_alive(tt,{expr:"smile",gaze:[1,0.1]},i,0);
      mh_street(x,tt,[["dig1",300,860,"stand",false,{hold:mhk_spade,holds:true,face:look(0)}],["boat1",560,930,"stand",false,{hold:mhk_pole,holds:true,face:look(1)}],
        {fl:1010,draw:cc=>{mhk_cart(cc,770,1010,"timber",1,0);mhk_person(cc,"cart2",1000,1010,"stand",Object.assign({t:tt},look(2)));}},
        ["ding",1460,895,"clasp",true,{face:PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[c.back+3,"look",2.4,[1,0.3]],[c.back+6,"nod"]])}]]);}},
    // Helena did the same with her team: Ivy, and 14 rooms kept in Graham's answer
    {at:tI,place:"mhTeam",dis:1.0,keys:[[tI,960,540,1.0],[tN-0.2,1000,560,1.05]],d:3,draw:(x,tt,cam)=>{
      mh_team(x,tt,{clock:9,sam:null,jun:Object.assign({work:1},mh_alive(tt,{},2,tI)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tI)),people:[
        {fl:MH_RB.floor,draw:cc=>{mh_roomBoard(cc,tt,BD,"ivy",{events:MH_HEV});}},
        {fl:985,draw:cc=>{PK.person(cc,"helena",660,985,mh_hT(985),"clasp",Object.assign({t:tt,flip:true},mh_alive(tt,{expr:"smile",gaze:[1,0.1]},5,tI)));}}]});}},
    {at:tN,place:"mhNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N5,{});}},
    // grow people who go deep in one thing, and learn enough of the rest to see the whole: Ivy at work with Jun, Helena by
    {at:tK,place:"mhTeam",dis:0.8,keys:[[tK,1240,560,1.08],[tE,1200,560,1.04]],d:3,draw:(x,tt,cam)=>{
      mh_team(x,tt,{clock:17,sam:Object.assign({work:1},mh_alive(tt,{},1,tK)),marta:Object.assign({work:1,turn:0},mh_alive(tt,{},3,tK)),
        jun:Object.assign({work:1},mh_alive(tt,{expr:"smile"},2,tK)),showJ:PK.onScreen.chat(0.5,{rows:[[0.5,0.4,1],[0.4,0.5,1]]}),people:[
        {fl:900,draw:cc=>{PK.seated(cc,"ivy",1540,900,mh_hT(900),"sitWork",Object.assign({t:tt,reachN:[1650,700],reachF:[1630,706]},mh_alive(tt,{expr:"smile",gaze:[1,0.4]},4,tK)));}},
        {fl:985,draw:cc=>{PK.person(cc,"helena",1060,985,mh_hT(985),"clasp",Object.assign({t:tt},mh_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tK)));}}]});}}
  ]);
  mh_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-mh_apart(t,[[tN,tK]])));
  PK.end(ctx,S,t,tE,"Many hats, one picture",MH_LAST,"Film 1 of 3","The new skills",{side:"right"});
});
ag_cutInto(["shape"]);
