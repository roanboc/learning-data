/* ===== Measure the work, not the people: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the
   line says, and the words on the frame are where and when, a name, a number, what someone says, or what a screen shows. The ideas
   the story opens with are explained at the team's board, by Carmen Vidal, a consultant, and by Helena, who writes the team's page
   and what its readings find there; what to keep from a chapter is a page of Helena's notebook, in colour (mw_uni.js). People also
   talk from where they are: Ivy calls Mei, Helena writes to Graham, and the director's message comes to Helena's laptop, the
   director never drawn; and they meet face to face, at the board, at Ivy's desk and at Helena's corner. Every time comes from the
   voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded again; the score
   (tools/score.py) takes the same words. A shot is one stay in a place: the camera glides between its keys, and everyone in it moves
   as one function of time, so nothing jumps; between places the film cuts where the same people go on, and dissolves where the
   whole picture changes (Sweden and the university). Sizes are in the 1920 x 1080 frame; people's sizes come from each place's eye
   line (mw_h outdoors in Sweden, mw_hK in the kitchen, mw_hO in the office, mw_hT in the team's room, MW_HC on the campus). */
const MW_LAST="Measure the work together. Fix the system, not the people.";
const mw_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,2,"Measure the work, not the people",a);}};
// a card in the frame's own space, so it stays put while the camera glides: in at t0, out at t1; o.right: at the top right
function mw_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.right?"right":"left"});}
const mw_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const mw_tag=(x,tt,t0,t1,px,py,text,o)=>PK.tag(x,px,py,text,ag_io(tt,t0,t1==null?1e9:t1,0.4),o);
// what someone says, over their head, from t0 to t1
const mw_bub=(x,J,tt,t0,t1,lines,cam,o)=>PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));
// while a chapter shows a key idea apart from the scene (a board seen close, a page of the notebook), its kicker steps back
const mw_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
const mw_lerp2=(a,b,k)=>[PK.u.lerp(a[0],b[0],k),PK.u.lerp(a[1],b[1],k)];
// poses of this film's own: writing on a pad or a clipboard held in the far hand; kneeling to measure; leaning in at a desk
const MW_WRITE={lean:4,head:16,aN:[8,98,"grip"],aF:[2,92,"grip"],lN:[-2,-2],lF:[5,4]};
const MW_KNEEL={mode:"kneel",lean:30,head:-6,aN:[52,22,"grip"],aF:[20,34],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
const MW_OVER={lean:14,head:6,aN:[40,62],aF:[6,14],lN:[-2,-2],lF:[5,4]};
const MW_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
// on the phone, the hand at the ear behind the cheek: the kit's own pose (onPhone) brings the phone before the mouth and the nose
const MW_PHONE={lean:0,head:-2,aN:[-10,164,"grip"],aF:[4,14],lN:[-2,-2],lF:[5,4]};
// the title card, as the kit's (PK.title, side "right") but with the title on two lines: on one, it's too long for the room beside
// the picture. Ivy, at her desk on the left, stays in view
function mw_title(ctx,S,t,t0){const U=PK.u,oA=U.pin(t,t0,0.8),tA=U.pin(t,t0+0.5,0.8);if(oA<=0)return;setScreen(ctx,S);
  const bc=PK.col("board"),g=ctx.createLinearGradient(0,0,1920,0);for(const [o,v] of [[0,0],[0.3,0],[0.56,0.94],[1,0.97]])g.addColorStop(o,U.css(bc,v*U.clamp(oA,0,1)));
  ctx.fillStyle=g;ctx.fillRect(0,0,1920,1080);const x=1060,ink=U.css(PK.C.ink),mut=U.css(PK.C.mut);
  ctx.save();ctx.globalAlpha*=tA;PK.mark(ctx,x+64,250,64,(t-t0-0.4)/1.8,1);
  ag_T(ctx,"Measure the work,",x,436,{w:800,size:76,color:ink});ag_T(ctx,"not the people",x,522,{w:800,size:76,color:ink});
  ag_T(ctx,"Read it together, and fix the system",x,594,{w:600,size:36,color:mut});
  ctx.globalAlpha*=U.pin(t,t0+1.2,0.8);["LEADING DATA PEOPLE","OWNERSHIP AND PERFORMANCE"].forEach((p,i)=>ag_T(ctx,p,x,682+i*44,{w:800,size:28,ls:3,color:mut}));ctx.restore();}
// tyre marks on the asphalt, where a car left its lane: what the investigators measure
function mw_skid(x){const U=PK.u;x.save();x.strokeStyle=U.css([70,70,78],0.42);x.lineWidth=7;x.lineCap="round";
  for(const d of [0,26]){x.beginPath();x.moveTo(1120,676-d*0.3);x.bezierCurveTo(1300,676-d*0.3,1460,660-d,1700,628-d*0.6);x.stroke();}x.restore();}

/* ---------------------------------------------------------------- 1. Roads, not drivers: Sweden, 1997 to 2024 */
scene("vision",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=MW_CAST;
  const tD=c.drift-0.4,tK=w("harm","For hundreds",-0.3),tC=c.change-0.4,tS=c.study-0.4,tF=c.found-0.4,tB=c.barrier-0.4,tM=c.more-0.4,tL=c.fell-0.4,tA=c.care-0.4,tE=c.measured-0.4,tU=c.data-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // 1997: a driver stopped on the verge, and an officer who writes her a fine. Cars go by on the road behind, without a sound
    {at:0,place:"mwRoad",keys:[[0,960,540,1.0],[c.counted-0.6,880,600,1.12]],d:3,draw:(x,tt,cam)=>{
      mw_traffic(x,tt,[["far",0.6,7.5,2,true],["near",3.8,6.2,4,false],["far",8.4,7.2,5,true],["near",12.6,6.4,0,true],["far",16.2,7,3,false]]);
      mw_car(x,1330,768,{col:mw_c("car",1)});
      // the two stand near enough for their hands to meet on the slip (m): further apart, each arm stopped short of the other, and
      // the slip went from one hand to the other through the air
      const tg=w("answer","fine",-0.7),give=ag_io(tt,tg,tD-0.6,0.5),got=ag_in(tt,tg+0.7,0.25),m=[818,545],wr=ag_io(tt,c.when-0.2,tg-0.1,0.5);
      const Jo=PK.walk(x,K.officer,tt,{x0:-150,x1:730,t0:0.2,t1:2.8,floor:880,h:mw_h(880),then:PK.poseMix("stand",MW_WRITE,wr)},
        {underF:mw_pad,hold:give>0.05?mw_slip(1-got):wr>0.2?PK.inHand.pen("ink"):null,holds:true,expr:mw_says("neutral",tt,tg+0.1,tg+2.6),gaze:[1,0.8*wr],reachN:m,reachNk:give});
      const Jd=PK.person(x,K.driver,915,850,mw_h(850),"clasp",Object.assign({t:tt,flip:true,hold:got>0?mw_slip(got):null,holds:got>0,reachN:[m[0]+22,m[1]+8],reachNk:give},
        PK.face(tt,{expr:"worry",gaze:[1,0.4]},[[2.4,"look",2.0,[1,0.1]],[c.counted+0.8,"look",2.2,[1,0.7]],[tg+0.2,"look",2.6,[1,0.2]]])));
      mw_bub(x,Jo,tt,tg+0.1,tD-0.3,["Here's your fine.","Take more care."],cam);}},
    // that evening: a tired driver drifts over the middle line, and a car comes the other way. The film cuts before they meet
    {at:tD,place:"mwDusk",dis:0.8,keys:[[tD,900,600,1.18],[tK,1060,610,1.32]],d:3.2,draw:(x,tt,cam)=>{
      mw_traffic(x,tt,[["far",tD-2.6,7.4,4,true]],{dusk:true});
      const tn=w("drift","tired",-0.1),td=w("drift","drifts",-0.3),q=U.clamp((tt-td)/2.6,0,1),dk=0.9*U.sine(q),tO=c.harm-0.9;
      if(tt>tO)mw_car(x,2450-290*(tt-tO),MW_R.mid-14,{flip:true,dusk:true,lights:1,col:mw_c("car",2),estate:false});
      mw_car(x,U.lerp(-500,900,U.clamp((tt-tD)/(tK-tD),0,1)),U.lerp(MW_R.near-10,MW_R.mid-20,dk),{dusk:true,lights:1,col:mw_c("car",3),tilt:-0.06*Math.sin(Math.PI*q),who:{c:[58,48,52],nod:0.35*ag_in(tt,tn,0.8)}});}},
    // that night, at home: someone who never came home. A mother waits at the table, a place laid; her son at the window
    {at:tK,place:"mwKitchen",dis:0.8,keys:[[tK,960,540,1.0],[tC,1000,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const fl=MW_KT.floor,h=mw_hK(fl),turn=ag_in(tt,tK+2.6,0.45);
      mw_kitChair(x,780,fl,h,false);mw_kitChair(x,1160,fl,h,true);PK.person(x,K.mum,790,fl,h,"sit",{t:tt,part:"lower"});mw_kitTable(x,{plate:true,mug:true,t:tt});
      PK.person(x,K.mum,790,fl,h,"sit",Object.assign({t:tt,part:"upper"},PK.face(tt,{expr:"worry",gaze:[1,-0.3]},[[tK+0.8,"look",2.6,[1,0.1]],[tK+3.6,"look",1.8,[-1,-0.1]]])));
      PK.person(x,K.boy,420,860,mw_hK(860)*0.72,"stand",{t:tt,flip:1-0.7*turn,expr:"worry",gaze:[1,-0.2]});}},
    // the road engineers' office: the year's toll. In October, Vision Zero: the decision comes in, and she pins it up by the map
    {at:tC,place:"mwOffice",dis:0.8,keys:[[tC,960,540,1.0],[c.adopt-0.6,1010,520,1.08]],d:3,draw:(x,tt,cam)=>{
      const tG=w("adopt","Vision Zero",-0.5),take=ag_io(tt,tG,tG+1.2,0.4),got=ag_in(tt,tG+0.6,0.25),tP=w("who","answer",-0.6),pin=ag_io(tt,tP,tP+1.5,0.45),pinned=tt>=tP+0.75,
        PP=[1300,356],give=[1260,556],hers=got>=0.5&&!pinned;
      // her far hand takes the sheet where his holds it out, and pins it by the map's edge at the height of her eyes: the near arm
      // is drawn over the head, so it lay across her face, and the pin was above her head. The pinned sheet is the one she held
      if(pinned)PK.sheet(x,PP[0]-47,PP[1]-74,54,74,{pin:true,rot:0.04});
      const rk=Math.max(take,pin),rp=pin>0.004?PP:give;
      PK.person(x,K.eng,1400,900,mw_hO(900),"stand",Object.assign({t:tt,flip:true,reachF:rp,reachFk:rk,underF:hers?mw_sheet:null,holds:hers},
        PK.face(tt,{expr:"think",gaze:[1,-0.2]},[[tG+0.9,"look",2.2,[1,0.5]],[w("adopt","no one",0),"nod"],[tP+1.6,"smile",2.6]])));
      // he stops near enough for the two hands to meet on the sheet: it is in one place as it changes hands, never drawn twice
      if(tt>c.adopt-1.4)PK.walk(x,K.inv,tt,{x0:-160,x1:1130,t0:c.adopt-1.4,t1:tG-0.2,floor:930,h:mw_hO(930),arms:{aN:MW_CARRY.aN},then:"stand"},
        {hold:got<0.5?mw_sheet:null,holds:got<0.5,reachN:[give[0]-38,give[1]],reachNk:take,expr:"smile",gaze:[1,0.1]});
      mw_tag(x,tt,w("who","design",-0.2),tS-0.3,1180,112,"Road engineers");}},
    // from 1997: every fatal crash studied, where it happened. He measures the marks a car left; she writes it down
    {at:tS,cut:true,place:"mwRoad",keys:[[tS,960,560,1.04],[tF,1000,580,1.1]],d:3,draw:(x,tt,cam)=>{
      mw_skid(x);const run=ag_in(tt,tS+0.5,1.6);
      PK.person(x,K.inv,820,900,mw_h(900),MW_KNEEL,{t:tt,expr:"think",gaze:[1,0.6],hold:mw_tape([U.lerp(890,1100,run),704]),holds:true});
      PK.person(x,K.eng,1270,860,mw_h(860),MW_WRITE,Object.assign({t:tt,flip:true,underF:mw_clip,hold:PK.inHand.pen("ink"),holds:true},PK.face(tt,{expr:"think",gaze:[1,0.8]},[[tS+2.4,"look",1.8,[1,0.3]]])));}},
    // the map: where each fatal crash happened. Most were on the fast roads with two lanes
    {at:tF,cut:true,place:"mwOffice",keys:[[tF,1000,470,1.14]],d:2,draw:(x,tt,cam)=>{
      const n=34*ag_in(tt,tF+0.3,3.2),lit=ag_in(tt,w("found","two lanes",-0.3),0.7),RD=MW_DOTS.filter(p=>p[0]>1070&&p[0]<1230&&p[1]>300).slice(0,5),put=ag_io(tt,tF+0.3,tF+3.6,0.4);
      mw_mapDots(x,n,lit);
      PK.person(x,K.inv,430,930,mw_hO(930),"clasp",Object.assign({t:tt},PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tF+1.4,"look",2.0,[1,-0.4]],[w("found","two lanes",0.3),"worry",3.0]])));
      // the far hand marks the dots it can reach, between her hips and the top of her head (the near arm lay across her throat)
      PK.person(x,K.eng,1300,900,mw_hO(900),"stand",Object.assign({t:tt,flip:true,underF:put>0.1?PK.inHand.marker("orange"):null,holds:put>0.1,reachF:PK.among(tt,RD,0.45,tF+0.3),reachFk:put},
        PK.face(tt,{expr:"think",gaze:[1,-0.3]},[[w("found","two lanes",0.2),"worry",3.2]])));}},
    // from 1998: workers set the barrier down the middle of such a road, post by post, its cables along them
    {at:tB,place:"mwRoad",dis:0.6,keys:[[tB,640,560,1.12],[tM-0.2,1000,590,1.22]],d:3,draw:(x,tt,cam)=>{
      const set=ag_in(tt,tB+1.6,1.0),xg=1000+18*set;mw_barrier(x,-60,xg-30+30*set,false);
      PK.person(x,K.wk2,1030,672,mw_h(672),"crouch",{t:tt,expr:"neutral",gaze:[1,0.6],reachN:[1004,610],reachNk:1-0.6*set});
      PK.walk(x,K.wk1,tt,{x0:1990,x1:1180,t0:tB+0.4,t1:tB+4.2,floor:680,h:mw_h(680),arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4},then:"armful"},{flip:true,hold:mw_postHeld,holds:true,expr:"neutral"});}},
    // where people walk: a roundabout in place of a crossroads, and cars that slow for a crossing
    {at:tM,place:"mwTown",dis:0.6,keys:[[tM,960,540,1.0],[tL,1000,560,1.06]],d:3,draw:(x,tt,cam)=>{
      mw_car(x,1720-150*(tt-tM),578,{flip:true,col:mw_c("car",2)});mw_car(x,180+130*Math.max(0,tt-tM-0.6),640,{col:mw_c("car",5)});
      const wk={x0:560,x1:1290,t0:tM+0.6,t1:tM+5.4,floor:846,h:mw_h(846),then:"stand"};
      PK.walk(x,K.walker,tt,wk,{expr:"smile",reachF:[0,0],reachFk:0});PK.walk(x,K.child,tt,Object.assign({},wk,{x0:660,x1:1390,floor:856,h:mw_h(856)*0.7,phase:0.3}),{expr:"glad"});
      PK.person(x,K.old,1660,900,mw_h(900),"ease",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"neutral",gaze:[1,0.1]},[[tM+3.2,"smile",2.4],[tM+3.6,"nod"]])));}},
    // the roads with a barrier, years on: traffic both ways, held apart; the engineers on the verge
    {at:tL,place:"mwRoad",dis:0.6,keys:[[tL,960,540,1.0],[tA-0.4,940,560,1.06]],d:3,draw:(x,tt,cam)=>{
      mw_traffic(x,tt,[["near",tL-1.0,5.4,0,true],["far",tL+0.4,5.8,2,false],["near",tL+2.6,5.2,5,true],["far",tL+3.8,6,6,true],["near",tL+6.0,5.6,3,false],["far",tL+7.4,5.6,1,true],["near",tL+9.0,5.2,4,true]],{barrier:true});
      PK.person(x,K.eng,560,860,mw_h(860),MW_WRITE,Object.assign({t:tt,underF:mw_clip,hold:PK.inHand.pen("ink"),holds:true},PK.face(tt,{expr:"neutral",gaze:[1,0.6]},[[c.half+0.6,"look",2.4,[1,0.1]],[c.half+1.2,"smile",3.4]])));
      PK.person(x,K.inv,820,880,mw_h(880),"ease",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[c.fell+1.6,"nod"],[c.half+1.4,"glad",2.6]])));}},
    // a mistake that no longer costs a life: a car held by the cables, its driver on the verge, unhurt, on the phone
    {at:tA,place:"mwDusk",dis:0.8,keys:[[tA,960,540,1.0],[tE,900,560,1.08]],d:3,draw:(x,tt,cam)=>{
      mw_barrier(x,-60,1980,true,[1330,1]);
      mw_car(x,940,MW_R.mid+8,{dusk:true,lights:0.5,col:mw_c("car",6),tilt:-0.03,hazard:0.15+0.85*Math.pow(0.5+0.5*Math.cos((tt-tA)*U.TAU*0.75),2)});
      const ts=w("care","But a mistake",-0.3),J=PK.person(x,K.driver2,560,800,mw_h(800),PK.poseMix("stand",MW_PHONE,ag_in(tt,tA+0.6,0.5)),
        {t:tt,expr:mw_says(PK.exprMix("worry","relief",ag_in(tt,ts,0.8)),tt,ts+0.1,tE-0.6),hold:PK.inHand.phone({}),holds:true,gaze:[1,0.1]});
      mw_bub(x,J,tt,ts+0.1,tE-0.3,["I'm all right.","I'm coming home."],cam);}},
    // the map again: the roads they fixed, marked over in green
    {at:tE,place:"mwOffice",dis:0.8,keys:[[tE,1000,480,1.12]],d:2,draw:(x,tt,cam)=>{
      // the last stretch she marks is of the road beside her, which her far hand reaches from end to end (the road at the top of
      // the map is above her head: the arm went straight up, across her face)
      const g0=w("measured","measured",-0.4),fin=ag_in(tt,g0,2.6),u2=0.6+0.4*fin,g=[1,u2,1,1],hd=mw_along(2,u2),dr=ag_io(tt,g0-0.4,g0+3.0,0.5);
      mw_mapDots(x,34,0);mw_mapGreen(x,g);
      PK.person(x,K.inv,430,930,mw_hO(930),"clasp",Object.assign({t:tt},PK.face(tt,{expr:"smile",gaze:[1,-0.3]},[[g0+3.0,"nod"]])));
      PK.person(x,K.eng,1375,900,mw_hO(900),"stand",{t:tt,flip:true,underF:dr>0.1?PK.inHand.marker("green"):null,holds:dr>0.1,reachF:hd,reachFk:dr,expr:PK.exprMix("think","smile",ag_in(tt,g0+2.8,0.8)),gaze:[1,-0.3]});}},
    // the same in data work: at the university, a request's way from start to end, and most of it waiting
    {at:tU,place:"mwTeam",dis:1.0,keys:[[tU,835,590,1.15],[c.fix+0.6,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      const up=ag_in(tt,c.fix+0.2,1.0),k=ag_in(tt,w("data","flows",-0.4),2.2);
      mw_team(x,tt,{clock:9.1,show:mw_scrRows(0.6+0.4*k,k),ivy:{work:1-0.8*up,expr:PK.exprMix("neutral","think",up),gaze:[1,-0.8*up],nod:-0.1*up}});
      PK.callout(x,40,150,560,200,[205,474],ag_io(tt,w("data","slow",-0.4),c.breath-0.2,0.4),(cc,bx,by,bw,bh)=>mw_flowCard(cc,bx,by,bw,bh,k));}}
  ]);
  mw_card(ctx,S,t,c.when-0.2,c.answer-0.6,{kick:"Sweden, 1997",title:"541 people died on the roads"},{y:84});
  mw_card(ctx,S,t,w("adopt","October",-0.3),c.who-0.4,{kick:"October 1997",title:"Vision Zero",sub:"No one killed or seriously injured on the roads",col:PK.C.blue},{y:84});
  mw_card(ctx,S,t,c.study+0.1,tF-0.3,{kick:"From 1997",title:"Every fatal crash studied in depth"},{y:84});
  mw_card(ctx,S,t,w("barrier","nineteen",-0.6),tM-0.3,{kick:"From 1998",title:"Steel cables down the middle"},{y:84});
  mw_card(ctx,S,t,c.fell+0.2,c.half-0.4,{kick:"Roads with a middle barrier",title:"Deaths down about three quarters",col:PK.C.green},{y:84});
  mw_card(ctx,S,t,c.half+0.1,tA-0.3,{kick:"Road deaths in Sweden",title:"541 in 1997, 213 in 2024",sub:"while traffic grew",col:PK.C.green},{y:84});
  mw_imagined(ctx,S,t,tU+0.8,c.breath-0.2);
  mw_title(ctx,S,t,c.breath+0.2);
});

/* ---------------------------------------------------------------- 2. Management, for this work */
scene("manage",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tH=w("uni","Helena",-0.2),tL=c.sides-0.6,tZ=w("sides","It did harm",-0.4),tR=w("fit","hours",1.6),tJ=c.page-0.4,tB=w("days","Days",-0.6),tP=c.promise-0.4,tO=c.load-0.4;
  const BA=PK.pace(ctx,"carmen",mw_boardA(sc,w)),BB=PK.pace(ctx,"helena",mw_boardB(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the team's room, a year from now: Helena comes in, and the team looks up from its work
    {at:0,place:"mwTeam",keys:[[0,960,540,1.0],[tH+0.4,1010,560,1.08]],d:2.6,draw:(x,tt,cam)=>{
      const seen=ag_in(tt,tH+0.2,0.6);
      mw_team(x,tt,{clock:9.15,sam:{work:1-0.8*seen,expr:PK.exprMix("neutral","smile",seen),gaze:[1,-0.3*seen]},jun:{work:1-0.8*seen,expr:PK.exprMix("neutral","smile",seen)},
        ivy:{turn:ag_in(tt,tH+0.6,0.5),work:0.2*(1-seen),expr:PK.exprMix("think","smile",seen),gaze:[1,-0.8*(1-seen)-0.1*seen],nod:-0.1*(1-seen)}});
      const Jh=PK.walk(x,"helena",tt,{x0:2030,x1:1500,t0:0.3,t1:tH+0.2,floor:904,h:mw_hT(904),then:"ease"},{expr:"smile",gaze:[1,0.05]});
      PK.nameTag(x,Jh.hc[0],Jh.hc[1]-150,"Helena Novak","Data manager",ag_io(tt,tH,tL-0.3,0.4));}},
    // later that day: Carmen Vidal, a consultant, at the team's board. The team has turned to her at their desks, and Helena stands
    // at the side with her notebook
    {at:tL,place:"mwTeam",later:true,keys:[[tL,960,540,1.0],[tL+0.3,1010,530,1.08]],d:2.6,draw:(x,tt,cam)=>{
      const R=mw_lesson(x,tt,{clock:11.0,who:"carmen",rows:BA,say:[[c.sides,tZ+0.6]]});
      PK.nameTag(x,R.at.hc[0],R.at.hc[1]-150,"Carmen Vidal","Consultant",ag_io(tt,tL+0.6,c.sides+2.8,0.4));}},
    // the board, close enough to read: management and leading, and measures fitted to the work
    {at:tZ,cut:true,place:"mwBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[tZ,sc.ends.sides],[c.see,sc.ends.see],[c.fit,sc.ends.fit]]});}},
    // the room again: hours and tickets say little about thinking work; Sam and Jun nod, and Helena writes it down
    {at:tR,cut:true,place:"mwTeam",keys:[[tR,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{
      mw_lesson(x,tt,{clock:11.2,who:"carmen",rows:BA,note:ag_io(tt,tR+0.3,tJ-0.5,0.5),
        sam:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[tR+0.4,"nod"],[tR+1.4,"smile",2.0]]),jun:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tR+0.8,"nod"]])});}},
    // July: Helena at the board, with the team's page: four measures, in two pairs
    {at:tJ,place:"mwTeam",later:true,keys:[[tJ,960,540,1.0],[tJ+0.3,1010,530,1.08]],d:2.6,draw:(x,tt,cam)=>{
      mw_lesson(x,tt,{clock:9.6,who:"helena",rows:BB,say:[[c.page,sc.ends.page]],sam:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[c.page+2.4,"nod"]])});}},
    // the board: days to first use, and sent back
    {at:tB,cut:true,place:"mwBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BB,{say:[[c.days,sc.ends.days],[c.back,sc.ends.back]]});}},
    // the room: promises met, a measure of Ivy's data products: she smiles, and the others look at her
    {at:tP,cut:true,place:"mwTeam",keys:[[tP,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{
      const tI=w("promise","data products",-0.2);
      mw_lesson(x,tt,{clock:9.7,who:"helena",rows:BB,say:[[c.promise,sc.ends.promise]],ivy:PK.face(tt,{expr:"listen",gaze:[1,-0.3]},[[tI,"smile",2.6],[tI+0.4,"nod"]]),
        sam:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[tI+0.3,"look",1.8,[1,0.1]]]),jun:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tI+0.5,"look",1.6,[1,0.1]],[tI+1.4,"smile",2.0]])});}},
    // the board: load and its limit, and the two pairs
    {at:tO,cut:true,place:"mwBoard",keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BB,{say:[[c.load,sc.ends.load],[c.pairs,sc.ends.pairs]]});}}
  ]);
  mw_imagined(ctx,S,t,0.2,tL-0.4);
  mw_card(ctx,S,t,c.page+0.1,tB-0.45,{kick:"July",title:"The team's page",sub:"from the data management module",col:PK.C.blue},{right:true,y:76});
  mw_kick(ctx,S,ag_in(t,1.0,0.6)*(1-mw_apart(t,[[tZ,tR],[tB,tP],[tO,1e9]])));
});

/* ---------------------------------------------------------------- 3. Read it together */
scene("read",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=MW_CAST;
  const tW=c.sweden-0.4,tH=w("sweden","Helena",-0.3),tJ=c.june-0.4,tY=c.why-0.3,tE=c.early-0.5,tO=c.one-0.4,tU=c.unclear-0.4,tT=c.talk-0.4,tD=c.dec-0.4,tN=c.most-0.4;
  const BR=PK.pace(ctx,"helena",mw_boardR(sc,w)),N1=PK.pace(ctx,null,mw_note1(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday 15 July, the first reading: the team turned to the board, Helena at it. Her one question, and the one she never asks
    {at:0,place:"mwTeam",keys:[[0,960,540,1.0],[c.what-0.4,1010,530,1.08]],d:2.6,draw:(x,tt,cam)=>{
      const q0=w("what","Never",-0.1),R=mw_lesson(x,tt,{clock:10.0,who:"helena",rows:BR,say:[[w("what","what slowed",-0.1),q0-0.3]],
        ivy:PK.face(tt,{expr:"listen",gaze:[1,-0.3]},[[c.thurs+2.6,"look",2.2,[1,-0.1]],[w("what","what slowed",0.4),"nod"],[w("what","Never",0.6),"smile",2.6]]),
        sam:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[w("what","Never",0.4),"nod"]]),jun:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[w("what","Never",0.8),"smile",2.4]])});
      PK.bubble(x,1420,230,["Who was slow?"],[R.at.hc[0]+40,R.at.hc[1]-60],ag_io(tt,q0-0.1,tW-0.3,0.3),{ink:PK.C.mut,strike:U.clamp((tt-w("what","who was",0))/0.4,0,1)});}},
    // in Sweden, they asked what in a road let a mistake kill: the investigators at work
    {at:tW,place:"mwRoad",dis:0.6,keys:[[tW,960,560,1.04],[tH,1000,580,1.1]],d:3,draw:(x,tt,cam)=>{
      mw_skid(x);PK.person(x,K.inv,820,900,mw_h(900),MW_KNEEL,{t:tt,expr:"think",gaze:[1,0.6],hold:mw_tape([1100,704]),holds:true});
      PK.person(x,K.eng,1270,860,mw_h(860),MW_WRITE,{t:tt,flip:true,underF:mw_clip,hold:PK.inHand.pen("ink"),holds:true,expr:"think",gaze:[1,0.8]});}},
    // Helena asks the same of the work
    {at:tH,place:"mwTeam",dis:0.6,keys:[[tH,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{
      mw_lesson(x,tt,{clock:10.05,who:"helena",rows:BR,say:[[tH+0.2,sc.ends.sweden]],ivy:PK.face(tt,{expr:"listen",gaze:[1,-0.3]},[[tH+1.0,"nod"]])});}},
    // the board: June's 24 days, taken apart; seven of them waiting for access
    {at:tJ,cut:true,place:"mwBoard",keys:[[tJ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BR,{say:[[c.june,sc.ends.june],[c.access,sc.ends.access]]});}},
    // why: Jun knows. Access was asked for only when work started; nobody was slow, and the room eases
    {at:tY,cut:true,place:"mwTeam",keys:[[tY,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{
      const tn=c.nobody,ok=ag_in(tt,tn+0.2,0.9),fr=f=>PK.exprMix("listen","relief",ok);
      const R=mw_lesson(x,tt,{clock:10.15,who:"helena",rows:BR,say:[[tn,sc.ends.nobody]],
        jun:Object.assign(PK.face(tt,{expr:"neutral",gaze:[1,-0.1]},[[c.why,"say",sc.ends.why-c.why]]),{expr:mw_says(PK.exprMix("neutral","relief",ok),tt,c.why,sc.ends.why)}),
        ivy:{expr:fr(),gaze:[1,-0.3]},sam:Object.assign(PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[c.why+0.6,"look",3.0,[1,0.1]],[tn+0.6,"nod"]]),{expr:fr()})});
      mw_bub(x,R.jun,tt,c.why,tn-0.2,["We only ask when we start,","one dataset at a time."],cam);}},
    // Monday 19 July: a request accepted, and its access asked for the same day
    {at:tE,place:"mwTeam",later:true,keys:[[tE,835,590,1.15]],d:2.6,draw:(x,tt,cam)=>{
      const a1=w("early","accepted",-0.3),k1=ag_in(tt,a1,0.4),k0=ag_in(tt,a1+1.0,0.4);
      mw_team(x,tt,{clock:9.3,show:mw_scrRows(0.5+0.5*k1),ivy:{work:1-0.3*k0,expr:PK.exprMix("neutral","smile",k0),gaze:[1,0.1]}});
      mw_screen(x,330,170,ag_io(tt,a1-0.5,tO-0.3,0.4),[["Request accepted",k1,null,k1],["Access asked for",k0,null,k0]]);}},
    // September: the wait for access, down from seven days to one
    {at:tO,place:"mwTeam",later:true,keys:[[tO,835,590,1.15],[tO+0.3,960,540,1.0]],d:2.6,draw:(x,tt,cam)=>{
      mw_team(x,tt,{clock:14.2,ivy:{expr:"smile"},sam:{expr:"neutral"},jun:Object.assign({},PK.face(tt,{expr:"neutral",gaze:[1,0]},[[tO+1.6,"smile",2.4]]))});}},
    // a second cause: work sent back, read one way and meant another. Mei brings a report back to Ivy
    {at:tU,place:"mwTeam",later:true,keys:[[tU,900,560,1.1]],d:2.6,draw:(x,tt,cam)=>{
      const tm=w("unclear","read one way",-0.4),sp=ag_in(tt,tm-0.3,0.4);
      const R=mw_team(x,tt,{clock:15.0,ivy:Object.assign({turn:ag_in(tt,tU+1.6,0.5),work:1-ag_in(tt,tU+1.4,0.6)},PK.face(tt,{expr:"neutral",gaze:[1,0]},[[tm+0.4,"worry",3.4]]))});
      const Jm=PK.walk(x,"mei",tt,{x0:2020,x1:840,t0:tU+0.1,t1:tU+2.3,floor:904,h:mw_hT(904),arms:{aN:MW_CARRY.aN},then:MW_CARRY},{hold:mw_sheet,holds:true,expr:mw_says(PK.exprMix("neutral","worry",sp),tt,tm,tm+1.6)});
      mw_bub(x,Jm,tt,tm,tT-0.3,["That's not what I meant."],cam,{dx:240});}},
    // Thursday 29 July: before work starts, fifteen minutes with whoever asked. Ivy calls Mei
    {at:tT,place:"mwTeam",later:true,keys:[[tT,800,470,1.2]],d:2.6,draw:(x,tt,cam)=>{
      const tq=w("talk","fifteen",-0.2),tA=w("talk","agrees",-0.2);let J=null;
      mw_team(x,tt,{clock:10.0,show:PK.onScreen.call(1,true),sam:{expr:"neutral"},jun:{expr:"neutral"},ivy:Object.assign({work:0.3},PK.face(tt,{expr:"smile",gaze:[1,-0.1]},[[tq,"say",2.2],[tA+0.6,"nod"]]))});
      PK.callout(x,24,40,446,236,[205,474],ag_io(tt,tT+0.3,tD-0.3,0.4),(cc,bx,by,bw,bh)=>{J=PK.call(cc,bx,by,bw,bh,[
        {who:"mei",a:ag_in(tt,tT+0.6,0.4),face:{expr:"smile"},say:[[tA,tA+1.8]],events:[[tq+1.6,"nod"],[tA+2.0,"nod"]]}],tt,{stack:true});});
      if(J)PK.say(x,J[0],["Done means this.","Let's agree it now."],ag_io(tt,tA,tD-0.4,0.3),{cam});}},
    // December: the days down to 14, sent back halved. Helena looks over Ivy's shoulder, and writes it down
    {at:tD,place:"mwTeam",later:true,keys:[[tD,835,590,1.15],[c.most-0.6,880,570,1.12]],d:2.6,draw:(x,tt,cam)=>{
      const p=0.6*ag_in(tt,w("dec","fourteen",-0.4),1.0)+0.4*ag_in(tt,w("dec","sent back",-0.3),0.8),wr=ag_in(tt,c.most+0.2,0.6);
      mw_team(x,tt,{clock:11.4,sam:{expr:"neutral"},jun:{expr:"neutral"},ivy:Object.assign({work:0.4},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[w("dec","halved",0.2),"glad",2.4]]))});
      PK.person(x,"helena",860,904,mw_hT(904),PK.poseMix("clasp",MW_NOTE,wr),Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},
        PK.face(tt,{expr:"smile",gaze:[1,0.1+0.5*wr]},[[w("dec","fourteen",0.3),"nod"]])));
      PK.callout(x,40,140,540,300,[205,474],ag_io(tt,tD+0.3,tN-0.1,0.4),(cc,bx,by,bw,bh)=>mw_daysCard(cc,bx,by,bw,bh,p));}},
    // what she keeps from it, in her notebook
    {at:tN,place:"mwNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N1,{});}}
  ]);
  mw_card(ctx,S,t,0.4,c.what-0.6,{kick:"Thursday 15 July",title:"The first reading",sub:"Every second Thursday, 20 minutes",col:PK.C.blue},{right:true,y:76});
  mw_card(ctx,S,t,tE+0.4,tO-0.45,{kick:"Monday 19 July",title:"Ivy's next request"},{right:true,y:76});
  mw_card(ctx,S,t,c.one+0.1,tU-0.45,{kick:"By September",title:"1 day waiting for access",sub:"down from 7",col:PK.C.green});
  mw_card(ctx,S,t,w("unclear","one piece",-0.3),tT-0.45,{kick:"Sent back",title:"1 piece of work in 8",col:PK.C.amber});
  mw_card(ctx,S,t,tT+0.4,tD-0.45,{kick:"Thursday 29 July",title:"Fifteen minutes first",col:PK.C.blue},{right:true,y:76});
  mw_kick(ctx,S,ag_in(t,0.6,0.6)*(1-Math.max(ag_io(t,w("early","accepted",-0.9),tO-0.3,0.4),ag_io(t,tT+0.1,tN-0.1,0.4),mw_apart(t,[[tJ,tY],[tN,1e9]]))));
});

/* ---------------------------------------------------------------- 4. Each measure has a partner */
scene("pairs",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tC=c.carry-0.4,tF=c.finish-0.4,tG=c.notnow-0.4,tP=w("notnow","reason",0.2),tR=tP+1.9,tS=c.six-0.4,tA=c.accel-0.4,tZ=w("accel","best teams",-0.6),tW=w("accel","measured",2.2),tN=w("honest","the other",0)-0.2;
  const BC=PK.pace(ctx,"carmen",mw_boardC(sc,w)),N2=PK.pace(ctx,null,mw_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday 12 August, at Ivy's screen: promises met, up to 82%; then load, nine pieces of work open against a limit of six
    {at:0,place:"mwTeam",later:true,keys:[[0,900,560,1.1]],d:2.6,draw:(x,tt,cam)=>{
      const tc=w("alone","celebrate",-0.4),tn=c.nine,bad=ag_in(tt,tn+0.4,0.8),pp=ag_in(tt,w("aug","eighty-two",-0.4),1.2),ld=ag_in(tt,w("nine","nine",-0.3),1.2),ov=ag_in(tt,w("nine","limit",-0.2),0.6);
      mw_team(x,tt,{clock:10.0,sam:null,jun:Object.assign({turn:0.6,work:0.2},PK.face(tt,{expr:"neutral",gaze:[1,0]},[[tc,"smile",2.4]])),ivy:{work:0.3,expr:PK.exprMix(PK.exprMix("neutral","glad",ag_in(tt,tc,0.6)),"worry",bad),gaze:[1,0.1]}});
      const Js=PK.person(x,"sam",830,930,mw_hT(930),MW_OVER,{t:tt,flip:true,reachN:[700,566],reachNk:1,expr:mw_says(PK.exprMix(PK.exprMix("neutral","glad",ag_in(tt,tc-0.2,0.5)),"worry",bad),tt,tc,tc+1.4),gaze:[1,0.2]});
      PK.person(x,"helena",1110,884,mw_hT(884),"clasp",{t:tt+2,flip:true,expr:PK.exprMix(PK.exprMix("listen","smile",ag_in(tt,tc,0.6)),"think",bad),gaze:[1,0.15]});
      mw_bub(x,Js,tt,tc,tn-0.3,["Eighty-two per cent!"],cam,{dx:40});
      PK.callout(x,40,150,560,226,[205,474],ag_io(tt,c.aug+0.4,tn-0.2,0.4),(cc,bx,by,bw,bh)=>mw_promCard(cc,bx,by,bw,bh,pp));
      PK.callout(x,40,150,640,226,[205,474],ag_io(tt,tn,tC-0.3,0.4),(cc,bx,by,bw,bh)=>mw_loadCard(cc,bx,by,bw,bh,6+3*ld,ov,1));}},
    // that evening, half past seven: Jun is still at work. Helena stops by on her way out
    {at:tC,place:"mwTeam",later:true,keys:[[tC,1120,540,1.06],[c.last-0.4,1200,560,1.12]],d:2.6,draw:(x,tt,cam)=>{
      mw_evening(x,1);const th=c.last+0.2,tg=w("last","tired",-0.3),turn=ag_in(tt,tg-0.5,0.5);
      const R=mw_team(x,tt,{clock:19.5,sam:null,ivy:null,jun:Object.assign({turn,work:1-turn},PK.face(tt,{expr:PK.exprMix("worry","relief",ag_in(tt,tg+1.2,0.8)),gaze:[1,0.2*(1-turn)]},[[tg+1.6,"nod"]]))});
      const Jh=PK.walk(x,"helena",tt,{x0:-140,x1:1450,t0:th-4.6,t1:th-0.4,floor:904,h:mw_hT(904),then:"ease"},{expr:mw_says("smile",tt,tg,tg+2.2),gaze:[1,0.05]});
      mw_bub(x,Jh,tt,tg,tF-0.3,["Go home, Jun.","We'll sort it out tomorrow."],cam,{dx:-60});}},
    // the next morning: nothing new begins until something open is done
    {at:tF,place:"mwTeam",later:true,keys:[[tF,960,540,1.0],[tF+0.3,1010,550,1.06]],d:2.6,draw:(x,tt,cam)=>{
      const ts=w("finish","finishes",-0.2),ok=ag_in(tt,ts+1.8,0.8);
      mw_team(x,tt,{clock:9.2,sam:Object.assign({turn:0.7,work:0.2},PK.face(tt,{expr:"listen",gaze:[1,0]},[[ts+1.4,"nod"]])),jun:Object.assign({turn:0.6,work:0.2},PK.face(tt,{expr:PK.exprMix("listen","relief",ok),gaze:[1,0]},[[ts+2.0,"nod"]])),
        ivy:Object.assign({turn:1,work:0},PK.face(tt,{expr:"listen",gaze:[1,0]},[[ts+1.6,"smile",2.4]]))});
      const Jh=PK.person(x,"helena",1060,920,mw_hT(920),"ease",{t:tt,expr:mw_says("smile",tt,ts,ts+2.2),gaze:[1,0]});
      mw_bub(x,Jh,tt,ts,tG-0.3,["Let's finish","before we start anything new."],cam);}},
    // two requests get a not now: Helena writes to Graham, at her corner
    {at:tG,cut:true,place:"mwCorner",keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const f1=c.notnow,f2=tP,CH=mw_chat(f1,f2),cs=PK.chatSize(x,CH,{size:28}),on=ag_in(tt,tG+0.3,0.4),ty=ag_io(tt,f1-1.2,f2+1.7,0.5);
      const R=mw_corner(x,tt,{t0:tG,laptop:true,type:ty,he:PK.exprMix("think","smile",ag_in(tt,f2+1.5,0.4)),hg:[1,0.4]});
      PK.callout(x,1300,140,cs.w,cs.h,R.laptop,on,(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}},
    // on the campus, Graham reads it on his phone, and answers: in the pause after the line, before mid-September (the hold on
    // "notnow" in breath.js gives him the time: his answer is sent 1.8 s after the cut, and stays a second and more to be read)
    {at:tR,cut:true,place:"mwCampus",keys:[[tR,900,570,1.1]],d:2,draw:(x,tt,cam)=>{
      const t0=tR,ta=t0+1.8,CH2=mw_chat2(ta),cs=PK.chatSize(x,CH2,{}),sent=ag_in(tt,ta+0.2,0.6);
      const Jg=PK.person(x,"graham",930,MW_CA.near,MW_HC,"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone({back:true}),holds:true},PK.face(tt,{expr:PK.exprMix("think","smile",sent),gaze:[1,0.9]},[[ta+0.4,"nod"]])));
      PK.callout(x,190,250,cs.w,cs.h,[Jg.hdN[0]-20,Jg.hdN[1]-30],ag_in(tt,t0+0.2,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH2,tt,{}));}},
    // mid-September: load back to six. At five, Jun goes home; Sam looks up to say goodbye
    {at:tS,place:"mwTeam",dis:0.6,keys:[[tS,960,540,1.0],[tA-0.4,1000,550,1.05]],d:3,draw:(x,tt,cam)=>{
      const up=tS+1.6,st=ag_in(tt,up,1.0),go=up+1.4,by=ag_io(tt,go+0.6,go+2.6,0.4);
      mw_team(x,tt,{clock:17.0,sam:Object.assign({turn:0.4*by,work:1-0.7*by},{expr:PK.exprMix("neutral","smile",by),gaze:[1,0.1]}),jun:tt<go?{pose:PK.poseSit(1-st),work:1-st,expr:"smile"}:null,ivy:{expr:"neutral"}});
      if(tt>=go)PK.walk(x,"jun",tt,{x0:1808,x1:2060,t0:go,t1:go+2.2,floor:MW_T.back,h:MW_HB,then:"stand"},{t:tt+3,expr:"smile",a:1});}},
    // Carmen, at the board: Accelerate's research, the best teams fast and stable at once
    {at:tA,place:"mwTeam",later:true,keys:[[tA,960,540,1.0],[tA+0.3,1010,530,1.08]],d:2.6,draw:(x,tt,cam)=>{
      mw_lesson(x,tt,{clock:11.0,who:"carmen",rows:BC,say:[[c.accel,tZ+0.6]]});}},
    {at:tZ,cut:true,place:"mwBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[tZ,sc.ends.accel]]});}},
    // the room: Helena writes it down
    {at:tW,cut:true,place:"mwTeam",keys:[[tW,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{
      mw_lesson(x,tt,{clock:11.3,who:"carmen",rows:BC,note:ag_in(tt,tW+0.2,0.5),sam:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[tW+0.4,"nod"]]),jun:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tW+0.9,"nod"]])});}},
    // what she keeps from it, in her notebook: a pair keeps the other honest
    {at:tN,place:"mwNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N2,{});}}
  ]);
  mw_card(ctx,S,t,0.4,c.alone-0.4,{kick:"Thursday 12 August",title:"The team's page",col:PK.C.blue},{right:true,y:76});
  mw_card(ctx,S,t,c.six+0.1,w("six","promises met",-0.5),{kick:"By mid-September",title:"Load: 6",sub:"back to the limit",col:PK.C.blue},{right:true,y:76});
  mw_card(ctx,S,t,w("six","promises met",-0.2),tA-0.45,{kick:"December",title:"Promises met: 86%",col:PK.C.green},{right:true,y:76});
  mw_kick(ctx,S,1-Math.max(ag_io(t,c.aug+0.4,tC-0.3,0.4),ag_io(t,tG+0.1,tS,0.3),mw_apart(t,[[tZ,tW],[tN,1e9]])));
});

/* ---------------------------------------------------------------- 5. Not a target */
scene("target",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tG=c.goodhart-0.4,tZ=c.strathern-0.4,tX=c.split-0.4,tX2=w("split","stop helping",-0.4),tQ=c.space-0.4,tM=c.deming-0.4,tR=c.no-0.4,tO=c.own-0.4,tV=c.review-0.4,tb=mw_N3(sc);
  const BD=PK.pace(ctx,"carmen",mw_boardD(sc,w)),N3=PK.pace(ctx,null,mw_note3(sc));
  const la=tt=>[ag_in(tt,w("count","A count",-0.2),0.4),ag_in(tt,w("count","each person",-0.2),0.4),ag_in(tt,w("fair","faster",-0.6),0.4),ag_in(tt,w("fair","needs help",-0.4),0.4)];
  const ra=tt=>[U.clamp((tt-w("no","says no",0.1))/1.6,0,1),U.clamp((tt-w("no","shows",-0.1))/2.6,0,1)];
  // the message grows as its lines come, so it's never an empty box waiting for words: the director's four, Helena's two, the answer
  const mail=(x,tt,R,a,da)=>{const s=mw_mailSize(x),L=la(tt),Q=ra(tt),op=k=>U.clamp(k*5,0,1),h=112+44*L.reduce((m,v)=>m+v,0)+(Q[0]>0?20*op(Q[0])+44*(op(Q[0])+op(Q[1])):0)+72*U.clamp(da||0,0,1);
    PK.callout(x,1810-s.w,84,s.w,h,R.laptop,a,(cc,bx,by,bw,bh)=>mw_mail(cc,bx,by,bw,bh,L,Q,da));};
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 13 September, at Helena's corner: a message from the director, her manager, line by line. Fair questions
    {at:0,place:"mwCorner",keys:[[0,960,540,1.0],[c.fair,940,556,1.05]],d:3,draw:(x,tt,cam)=>{
      const fair=ag_in(tt,w("fair","fair questions",-0.2),0.8);
      const R=mw_corner(x,tt,{t0:0,laptop:true,type:0.15,hf:PK.face(tt,{expr:PK.exprMix("think","listen",fair),gaze:[1,0.4-0.3*fair]},[[c.mon+2.4,"look",1.8,[1,0.55]],[c.count+0.4,"look",2.4,[1,0.25]],[w("count","each person",0.6),"worry",2.6],[w("fair","fair questions",0.2),"nod"],[c.fair+4.0,"look",1.6,[1,0.05]]])});
      mail(x,tt,R,ag_in(tt,c.mon+1.2,0.4),0);}},
    // Carmen, at the board: Goodhart and Strathern; what a count per person does; and, later, Deming
    {at:tG,cut:true,place:"mwTeam",keys:[[tG,960,540,1.0],[tG+0.3,1010,530,1.08]],d:2.6,draw:(x,tt,cam)=>{
      mw_lesson(x,tt,{clock:15.0,who:"carmen",rows:BD,say:[[c.goodhart,sc.ends.goodhart]],sam:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[w("goodhart","pushed",0.2),"look",2.0,[1,0.1]],[w("goodhart","stops",0.4),"nod"]]),
        jun:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[w("goodhart","economist",0.2),"look",1.6,[1,0.05]],[w("goodhart","meaning",0.3),"nod"]]),ivy:PK.face(tt,{expr:"listen",gaze:[1,-0.3]},[[w("goodhart","pushed",0.6),"worry",2.4]]),
        helena:PK.face(tt,{expr:"listen",gaze:[1,-0.15]},[[w("goodhart","Charles",0.3),"nod"],[w("goodhart","meaning",0.2),"look",1.8,[1,0.2]]])});}},
    {at:tZ,cut:true,place:"mwBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BD,{say:[[tZ,sc.ends.goodhart],[c.strathern,sc.ends.strathern]]});}},
    // the room: count tickets per person, and see what people do. Sam frowns; Jun looks away, worried
    {at:tX,cut:true,place:"mwTeam",keys:[[tX,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{
      mw_lesson(x,tt,{clock:15.2,who:"carmen",rows:BD,say:[[c.split,tX2+0.6]],sam:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[w("split","split",0.2),"worry",3.4]]),
        jun:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[w("split","pick easy",0.3),"look",2.2,[1,0.1]],[w("split","pick easy",0.6),"worry",2.6]]),note:ag_io(tt,tX+1.0,tX2-0.3,0.5)});}},
    {at:tX2,cut:true,place:"mwBoard",keys:[[tX2,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BD,{say:[[tX2,sc.ends.split]]});}},
    // what a count of activity never shows: Jun comes over to help Ivy with her work, which no count of Jun's tickets would see
    {at:tQ,place:"mwTeam",dis:0.6,keys:[[tQ,835,590,1.15]],d:2.6,draw:(x,tt,cam)=>{
      const tl=tQ+2.8,lean=ag_in(tt,tl,0.6),ok=ag_in(tt,w("space","how well",-0.2),0.8);
      mw_team(x,tt,{clock:14.0,jun:null,ivy:Object.assign({work:1-0.6*lean},PK.face(tt,{expr:PK.exprMix("think","glad",ok),gaze:[1,0.1]},[[tl+0.8,"look",2.6,[-1,-0.2]],[w("space","how well",0.4),"nod"]]))});
      PK.walk(x,"jun",tt,{x0:1808,x1:790,t0:tQ+0.2,t1:tl,floor:904,h:mw_hT(904),flip:true,then:MW_OVER},{t:tt+3,expr:"smile",gaze:[1,0.5],reachN:[662,560],reachNk:lean});}},
    // the board again: Deming, at its right
    {at:tM,cut:true,place:"mwBoard",keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BD,{say:[[c.deming,sc.ends.deming]]});}},
    // Helena says no to the count, and shows what instead: she types her answer
    {at:tR,cut:true,place:"mwCorner",keys:[[tR,960,540,1.0],[c.no+0.6,940,556,1.05]],d:3,draw:(x,tt,cam)=>{
      const R=mw_corner(x,tt,{t0:tR,laptop:true,type:ag_io(tt,tR+0.4,tO-1.0,0.6),he:PK.exprMix("think","smile",ag_in(tt,w("no","readings",0),0.8)),hg:[1,0.4]});mail(x,tt,R,ag_in(tt,tR+0.2,0.4),0);}},
    // how each person grows stays in their own goals: Helena and Ivy, at the round table, Ivy's goals between them
    {at:tO,place:"mwCorner",later:true,keys:[[tO,960,540,1.0],[c.own+0.4,960,556,1.06]],d:3,draw:(x,tt,cam)=>{
      const tg=w("own","agreed",-0.2);
      mw_corner(x,tt,{t0:tO,ivy:true,sheet:true,lean:ag_in(tt,tO+0.6,0.8),he:mw_says("smile",tt,c.own+0.2,c.own+1.6),ie:PK.exprMix("listen","glad",ag_in(tt,tg,0.6)),ig:[1,0.35]});}},
    // the director's answer: the page goes to the quarterly review. No one is ranked
    {at:tV,place:"mwCorner",later:true,keys:[[tV,960,540,1.0],[tb,940,556,1.05]],d:3,draw:(x,tt,cam)=>{
      const R=mw_corner(x,tt,{t0:tV,laptop:true,type:0,he:PK.exprMix("listen","smile",ag_in(tt,w("review","quarterly",0),0.8)),hg:[1,0.4]});
      mail(x,tt,R,ag_in(tt,tV+0.2,0.4),ag_in(tt,w("review","takes",-0.2),0.5));}},
    // what she keeps from it, written in the pause that ends the chapter
    {at:tb,place:"mwNotes",dis:0.6,keys:[[tb,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}}
  ]);
  mw_card(ctx,S,t,0.6,c.count-0.4,{kick:"Monday 13 September",title:"A message from the director",sub:"Helena's manager",col:PK.C.blue},{y:84});
  mw_card(ctx,S,t,tQ+3.0,tM-0.45,{kick:"2021",title:"The SPACE framework",sub:"Nicole Forsgren and others"},{right:true,y:76});
  mw_kick(ctx,S,1-Math.max(ag_io(t,c.mon+1.0,tG,0.4),ag_io(t,tR,tO,0.4),ag_io(t,tV,tb,0.4),mw_apart(t,[[tZ,tX],[tX2,tQ],[tM,tR],[tb,1e9]])));
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=MW_CAST;
  const tH=c.helena-0.4,tK=w("flow","work sent back",-0.3),tN=c.next-0.3,tE=c.breath+0.6,N4=PK.pace(ctx,null,mw_note4(sc,w)),BB=PK.pace(ctx,"helena",mw_boardB(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Sweden: roads that forgive a mistake, their traffic held apart, and the engineers who still measure them
    {at:0,place:"mwRoad",keys:[[0,960,540,1.0],[tH,1000,560,1.06]],d:3,draw:(x,tt,cam)=>{
      mw_traffic(x,tt,[["near",-1.2,5.6,0,true],["far",0.4,6,2,false],["near",2.4,5.4,5,true],["far",4.0,6,6,true],["near",6.2,5.6,3,false],["far",7.4,5.6,1,true]],{barrier:true});
      PK.person(x,K.eng,560,860,mw_h(860),MW_WRITE,{t:tt,underF:mw_clip,hold:PK.inHand.pen("ink"),holds:true,expr:"neutral",gaze:[1,0.7]});
      PK.person(x,K.inv,800,880,mw_h(880),"ease",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[3.4,"nod"]])));}},
    // the university, December: a reading, and the team smiles at what it fixed
    {at:tH,place:"mwTeam",dis:1.0,keys:[[tH,960,540,1.0],[tH+0.4,1010,530,1.08]],d:3,draw:(x,tt,cam)=>{
      const wr=ag_in(tt,tK-1.6,0.6);
      mw_lesson(x,tt,{clock:10.0,who:"helena",rows:BB.map(r=>r.drawn?r:Object.assign({},r,{at:-60})),rest:1212,events:[[tH+0.8,"smile",4.0]],
        ivy:PK.face(tt,{expr:"smile",gaze:[1,-0.3]},[[tH+1.6,"glad",2.4]]),sam:PK.face(tt,{expr:"smile",gaze:[1,-0.25]},[[tH+1.2,"glad",2.8]]),jun:PK.face(tt,{expr:"smile",gaze:[1,-0.2]},[[tH+2.0,"nod"]])});}},
    // what to keep, on Monday: the four things, in her notebook
    {at:tK,place:"mwNotes",dis:0.6,keys:[[tK,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}},
    // Helena at her corner: she shuts her notebook, puts her pen down and looks out of the window, where two people cross the lawn
    {at:tN,place:"mwCorner",dis:0.6,keys:[[tN,960,540,1.0],[c.end-0.6,900,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const look=ag_in(tt,tN+1.6,0.8),ty=w("end","Fix",-0.3);
      mw_corner(x,tt,{t0:tN-6,book:true,hf:PK.face(tt,{expr:PK.exprMix("neutral","smile",look),gaze:[1,0.4-0.6*look]},[[tN+4.6,"look",2.2,[1,0.3]],[tN+7.4,"nod"],[tN+9.6,"glad",2.6],[tN+12.8,"look",2.0,[1,-0.35]]]),handN:[740,632],handF:[770,626]});}}
  ]);
  mw_card(ctx,S,t,1.0,tH-0.45,{kick:"Sweden",title:"Roads that forgive a mistake",col:PK.C.green});
  mw_card(ctx,S,t,c.next+0.4,c.end-0.6,{kick:"The next film",title:"When someone",sub:"falls behind"});
  mw_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-mw_apart(t,[[tK,tN]])));
  PK.end(ctx,S,t,tE,"Measure the work, not the people",MW_LAST,"Film 2 of 4","Ownership and performance",{side:"right"});
});
ag_cutInto(["manage","read"]);
