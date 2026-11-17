/* ===== Owning the outcome: the chapters, shot by shot =====
   Every picture has people in it, whole, doing what the line says: the words on screen are where and when, a name, or what someone
   says. Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's
   recorded again; the score (tools/score.py) takes the same words. A shot is one stay in a place: the camera glides between its
   keys, and everyone in it moves as one function of time, so nothing jumps; between places the film cuts, or dissolves where the
   whole picture changes (Kenya and the university). Sizes are in the 1920 x 1080 frame; people's sizes come from each place's eye
   line (oo_h on the hills, oo_hT in the team's room, oo_hL in a teaching room, OO_HC on the campus). */
const OO_LAST="Own what it's for, not only what you did.";
const oo_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,1,"Owning the outcome",a);}};
// a card in the frame's own space, so it stays put while the camera glides: in at t0, out at t1; o.right: at the top right
function oo_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.right?"right":"left"});}
const oo_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const oo_tag=(x,tt,t0,t1,px,py,text,o)=>PK.tag(x,px,py,text,ag_io(tt,t0,t1==null?1e9:t1,0.4),o);
const oo_say=(x,J,tt,t0,t1,lines,cam,o)=>PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));
const OO_KNEEL={mode:"kneel",lean:30,head:-6,aN:[52,22,"grip"],aF:[20,34],lN:[28,-90],lF:[40,-88],fN:70,fF:70},OO_KNEEL2={mode:"kneel",lean:22,head:-30,aN:[44,30,"grip"],aF:[18,36],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
const OO_BEND={lean:17,head:9,aN:[10,58],aF:[16,66],lN:[-2,-2],lF:[5,4]},OO_POUR={lean:22,head:11,aN:[26,80,"grip"],aF:[14,60],lN:[-2,-2],lF:[5,4]},OO_CARRY={lean:0,head:0,aN:[28,74,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]},OO_SHOW={lean:2,head:-2,aN:[36,100,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};

/* ---------------------------------------------------------------- 1. Trees still standing: Kenya, the 1970s to 2004 */
scene("trees",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=OO_CAST;
  const tP=c.paid-0.4,tGr=c.fifty-0.6,tN=c.nobel-0.5,tU=c.data-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // the hills, their forests cleared: the women tell Maathai what is going wrong
    {at:0,place:"ooHills",keys:[[0,960,520,1.0],[c.women-0.4,810,630,1.2],[c.cleared-0.6,960,520,1.0],[c.soil-0.5,1080,610,1.14]],d:2.6,draw:(x,tt,cam)=>{
      oo_sky(x,tt);oo_run(x,tt,ag_io(tt,c.soil-0.2,c.harm-0.5,0.8));oo_plot(x);
      const sp=[w("streams","streams",-0.2),w("streams","food",-0.2),w("streams","walk",-0.3),c.cleared-0.6],up=ag_io(tt,c.cleared-0.4,c.soil-0.6,0.8),dn=ag_in(tt,c.soil-0.3,0.8);
      // each takes in what the others say, with a look or a nod; the one at the seedlings looks up to speak, and goes back to them
      const Jn=PK.person(x,K.nya,560,846,oo_h(846),"armful",Object.assign({t:tt,hold:oo_firewood},PK.face(tt,{expr:"worry",gaze:[1,-0.7*up]},
        [[c.when+1.2,"look",2.4,[1,0.7]],[c.women+1.6,"look",2.2,[-1,0]],[sp[0]+1.2,"nod"],[sp[1]+1.3,"nod"],[sp[2],"say",sp[3]-sp[2]],[c.sense+0.6,"look",2.6,[0.3,0.8]]])));
      const Jm=PK.walk(x,K.mum,tt,{x0:60,x1:330,t0:1.0,t1:c.women+2.2,floor:xx=>U.lerp(770,916,U.clamp((xx-60)/270,0,1)),h:oo_h,phase:0.7*Math.max(0,tt-1.0),arms:{aN:[3,5,"grip"]},then:"can"},
        Object.assign({hold:oo_can},PK.face(tt,{expr:"worry",gaze:[1,-0.6*up]},[[sp[0],"say",sp[1]-sp[0]],[sp[1]+1.6,"nod"],[sp[2]+2.4,"nod"],[c.sense+1.4,"look",2.4,[1,0.7]]])));
      const lk=ag_io(tt,c.women+3.4,sp[2]+1.0,0.9),bd=ag_io(tt,c.women+2.6,c.cleared-0.8,1),at=PK.among(tt,[[984,852],[1028,850],[954,858]],2.4,sp[2]+1.6);
      const Jw=PK.person(x,K.wan,826,900,oo_h(900),PK.poseMix(OO_KNEEL,OO_KNEEL2,lk),{t:tt,expr:oo_says("worry",tt,sp[1],sp[2]),gaze:[1,0.5-1.1*lk],reachN:[U.lerp(at[0],972,lk),U.lerp(at[1],846,lk)],reachF:[880,838]});
      const Ja=PK.person(x,K.maathai,1262,872,oo_h(872),PK.poseMix("listen",OO_BEND,bd),Object.assign({t:tt,flip:true,reachN:[1242,744],reachNk:bd,reachF:[1224,738],reachFk:bd},
        PK.face(tt,{expr:"listen",gaze:[1,0.5*bd-0.6*up+0.4*dn]},[[sp[0]+1.4,"nod"],[sp[1]+1.2,"nod"],[sp[2]+1.6,"nods"],[c.sense+1.0,"think",3.2]])));
      oo_tag(x,tt,w("women","rural",-0.1),sp[0]-0.3,470,348,"Rural women");PK.nameTag(x,1262,338,"Wangari Maathai","A biologist",ag_io(tt,w("women","Maathai",-0.2),sp[0]-0.3,0.4));
      oo_say(x,Jm,tt,sp[0],sp[1],["The stream is drying up."],cam);oo_say(x,Jw,tt,sp[1],sp[2],["Our food is less sure."],cam,{rise:70,dx:-110});oo_say(x,Jn,tt,sp[2],sp[3],["Each year, we walk further","for firewood."],cam);
      oo_tag(x,tt,w("cleared","farms",-0.1),c.soil-0.7,330,300,"Farms");oo_tag(x,tt,w("cleared","tea",-0.1),c.soil-0.7,900,330,"Tea and coffee, to sell");oo_tag(x,tt,w("cleared","plantations",-0.1),c.soil-0.7,1560,300,"Timber");
      oo_tag(x,tt,c.sense-0.1,c.soil-0.7,960,232,"Each choice made sense to those who made it",{weight:800});
      oo_tag(x,tt,w("soil","soil",-0.1),c.harm-0.7,1560,790,"The soil washed away",{col:PK.C.amber});oo_tag(x,tt,w("soil","springs",-0.1),c.harm-0.7,1470,470,"The springs ran dry",{col:PK.C.amber});}},
    // who carried it: the women, at their work, and their children; then Maathai comes with a seedling
    {at:c.harm-0.4,place:"ooHills",later:true,keys:[[c.harm-0.4,960,590,1.06],[c.change-0.5,1000,610,1.14]],d:2.4,draw:(x,tt,cam)=>{
      oo_sky(x,tt);oo_plot(x);const t0=c.harm-0.4,look=ag_in(tt,c.change-0.2,0.8);
      PK.person(x,K.nya,1590,862,oo_h(862),"armful",{t:tt,flip:true,hold:oo_firewood,expr:"neutral",gaze:[1,-0.4*look]});
      const mw={x0:640,x1:300,t0:t0+0.5,t1:c.harm+5.2,floor:916,h:oo_h(916),arms:{aN:[3,5,"grip"]},then:"can"};
      PK.person(x,K.boy,1170,902,oo_h(902)*0.74,"stand",{t:tt,flip:true,expr:"neutral",gaze:[1,0.5-0.9*look]});
      PK.person(x,K.wan,826,900,oo_h(900),OO_KNEEL,{t:tt,expr:"worry",gaze:[1,0.5-1.1*look],reachN:PK.among(Math.min(tt,c.change-0.6),[[984,852],[1028,850],[954,858]],2.2,t0+0.8),reachF:[880,838]});
      PK.walk(x,K.mum,tt,mw,{hold:oo_can,expr:"neutral"});PK.walk(x,K.girl,tt,Object.assign({},mw,{x0:724,x1:384,floor:924,h:oo_h(924)*0.7,arms:null,then:"stand",phase:0.3}),{expr:"neutral"});
      const Ja=PK.walk(x,K.maathai,tt,{x0:2010,x1:1370,t0:c.change-1.4,t1:c.change+1.6,floor:880,h:oo_h(880),arms:{aN:OO_SHOW.aN},then:OO_SHOW},{hold:oo_inHand(0.8),expr:"smile"});
      oo_tag(x,tt,w("harm","fetched",-0.1),c.change-0.6,420,372,"Water");oo_tag(x,tt,w("harm","gathered",-0.1),c.change-0.6,1590,372,"Firewood");oo_tag(x,tt,w("harm","grew",-0.1),c.change-0.6,880,496,"Food");
      oo_tag(x,tt,w("harm","harm",-0.2),c.change-0.6,960,262,"The harm fell first on them, and on their children",{col:PK.C.amber,weight:800});
      oo_tag(x,tt,w("change","women",-0.4),c.start-0.8,Ja.hc[0]-40,Ja.hc[1]-170,"Bring the trees back",{col:PK.C.green,weight:800});}},
    // 1977: a group's nursery
    {at:c.start-0.4,cut:true,place:"ooNursery",keys:[[c.start-0.4,960,560,1.0],[c.nursery-0.4,900,630,1.16]],d:3,draw:(x,tt,cam)=>{
      oo_sky(x,tt);const t0=c.start-0.4;
      // she waters the bed: the can goes out over the seedlings and comes back, again and again
      PK.person(x,K.nya,846,806,oo_h(806),PK.poseMix(OO_BEND,OO_POUR,ag_io((tt-t0)%4.6,0.3,2.9,0.7)),{t:tt,hold:oo_can,expr:"neutral",gaze:[1,0.8]});
      PK.person(x,K.maathai,1500,850,oo_h(850),PK.poseMix(OO_SHOW,"listen",ag_in(tt,c.nursery-0.2,0.8)),{t:tt,flip:true,hold:oo_inHand(0.9),expr:oo_says("smile",tt,c.start+0.4,c.nursery-0.8)});
      PK.walk(x,K.mum,tt,{x0:2010,x1:1720,t0:t0+0.2,t1:t0+3.2,floor:868,h:oo_h(868),arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4},then:"armful"},
        Object.assign({hold:oo_tray},PK.face(tt,{expr:"smile",gaze:[1,0]},[[t0+4.6,"look",2.6,[1,0.7]],[c.nursery+0.9,"nod"]])));
      // the girl lifts her seedling to look at it; the woman beside her sets hers in the bed, one after another, and looks up as Maathai speaks
      const lift=Math.max(ag_io(tt,t0+2.2,t0+5.6,0.8),ag_io(tt,c.nursery+1.4,c.nursery+4.4,0.8));
      PK.person(x,K.girl,372,938,oo_h(938)*0.7,PK.poseMix(OO_CARRY,OO_SHOW,0.3+0.7*lift),{t:tt,hold:oo_inHand(0.6),expr:PK.exprMix("smile","glad",lift),gaze:[1,0.5-0.7*lift]});
      PK.person(x,K.wan,500,930,oo_h(930),OO_KNEEL,Object.assign({t:tt,reachN:PK.among(tt,[[612,866],[652,864],[588,870]],2.3,t0+0.6),reachF:[586,862]},
        PK.face(tt,{expr:"neutral",gaze:[1,0.6]},[[c.start+2.6,"look",2.2,[1,-0.7]],[c.nursery+0.4,"smile",3.4]])));
      oo_tag(x,tt,w("nursery","nurseries",-0.3),c.paid-0.9,960,300,"Their own nurseries");oo_tag(x,tt,w("nursery","seeds",-0.2),c.paid-0.9,1180,700,"From the seeds of local trees");}},
    // months later: paid for each tree still alive; they answer for living trees
    {at:tP,cut:true,place:"ooHills",keys:[[tP,1040,610,1.12],[c.answer-0.4,1180,640,1.22]],d:2.6,draw:(x,tt,cam)=>{
      oo_sky(x,tt);const t1=w("paid","not",0.2),tE=c.answer-1.6,wk={x0:520,x1:1626,t0:tP+0.3,t1,floor:xx=>OO_ROW.y(xx)+44,h:oo_h,then:"stand"};
      // she walks the row and each living tree is counted as she passes; Maathai pays her; then she turns back to the last tree
      const pay=ag_io(tt,t1+0.3,tE,0.5),take=ag_io(tt,t1+0.5,tE,0.5),got=ag_in(tt,t1+0.9,0.25),turn=ag_in(tt,c.answer-0.9,0.4),kn=ag_in(tt,c.answer-0.3,0.9);
      oo_row(x,tt,0.5,1,i=>tP+0.3+(t1-tP-0.3)*(0.1+0.86*(OO_ROW.x[i]-520)/1106));
      const q=PK.walkAt(tt,wk),fm=OO_ROW.y(1790)+50,hy=q.floor-oo_h(q.floor)*0.56,ry=OO_ROW.y(1460),face=PK.exprMix(PK.exprMix("neutral","glad",got),"smile",kn);
      PK.person(x,K.maathai,1790,fm,oo_h(fm),"stand",{t:tt,flip:true,expr:"smile",gaze:[1,0.5*kn],reachN:[1712,hy],reachNk:pay,hold:oo_coins(pay*(1-got))});
      if(kn<=0)PK.walk(x,K.wan,tt,wk,{flip:turn,expr:face,gaze:[1,0.6*(1-ag_in(tt,t1,0.4))],reachN:[1716,hy],reachNk:take,hold:oo_coins(take*got)});
      else PK.person(x,K.wan,q.x,q.floor,q.h,PK.poseMix("stand",OO_KNEEL,kn),{t:tt,flip:turn,expr:face,gaze:[1,0.5*kn],reachN:[1482,ry-74],reachNk:kn,reachF:[1494,ry-44],reachFk:kn});
      oo_tag(x,tt,w("paid","not",-0.1),c.answer-0.5,1040,470,"Not for each seedling planted",{col:PK.C.mut});
      oo_tag(x,tt,w("answer","living",-0.3),tGr+0.2,1190,520,"Living trees, not the planting",{col:PK.C.green,weight:800});}},
    // the same hills, years later: more than fifty million trees; then 2004
    {at:tGr,place:"ooGreen",dis:1.2,keys:[[tGr,1085,630,1.22],[tGr+0.3,960,540,1.0]],d:3.4,draw:(x,tt,cam)=>{
      oo_sky(x,tt);const a=ag_in(tt,tGr+1.3,0.6);
      PK.walk(x,K.nya,tt,{x0:150,x1:640,t0:tGr+1.3,t1:c.give+3.6,floor:866,h:oo_h(866),arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4},then:"armful"},{hold:oo_firewood,expr:"smile",a});
      PK.person(x,K.wan,1150,884,oo_h(884),"stand",{t:tt,flip:true,expr:"smile",a,gaze:[1,0.3]});
      PK.person(x,K.boy,1010,894,oo_h(894)*0.74,"stand",{t:tt,expr:"glad",a});PK.person(x,K.girl,900,900,oo_h(900)*0.7,PK.poseMix("stand","wave",ag_io(tt,c.fifty+1,c.fifty+3,0.5)),{t:tt,expr:"glad",a});
      oo_tag(x,tt,w("give","fuel",-0.1),tN-0.3,520,356,"Fuel");oo_tag(x,tt,w("give","food",-0.1),tN-0.3,955,468,"Food");oo_tag(x,tt,w("give","shelter",-0.1),tN-0.3,1420,330,"Shelter");
      oo_tag(x,tt,w("give","thousands",-0.2),tN-0.3,960,216,"An income for thousands of women",{col:PK.C.green,weight:800});}},
    {at:tN,place:"ooGreen",later:true,keys:[[tN,960,540,1.0],[tN+0.2,940,610,1.15]],d:2.6,draw:(x,tt,cam)=>{
      oo_sky(x,tt);PK.person(x,K.nya,620,872,oo_h(872),"stand",{t:tt,expr:"smile",gaze:[1,0.5]});
      PK.person(x,K.wan,1250,880,oo_h(880),"stand",{t:tt,flip:true,expr:"smile",gaze:[1,0.5]});PK.person(x,K.girl,1360,892,oo_h(892)*0.7,"stand",{t:tt,flip:true,expr:"glad"});
      PK.S.begin(x,{lw:2.6,far:0,sh:4});PK.seedling(x,1010,892,3.4,1,{});
      const Je=PK.person(x,K.elder,890,896,oo_h(896),OO_KNEEL,{t:tt,expr:"smile",gaze:[1,0.5],reachN:[992,880],reachF:[966,872]});
      PK.nameTag(x,Je.hc[0]-20,Je.hc[1]-150,"Wangari Maathai","",ag_io(tt,w("nobel","Wangari",-0.2),tU-0.3,0.4));}},
    // the same in data work: Ivy at her desk, a job that ran, a report that was sent
    {at:tU,place:"ooTeam",dis:1.0,keys:[[tU,835,590,1.15],[c.own+0.6,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      const up=ag_in(tt,c.own+0.2,1.0),k=ag_in(tt,w("data","job",-0.2),0.6)*0.5+ag_in(tt,w("data","report",-0.2),0.6)*0.5;
      oo_team(x,tt,{clock:9.1,show:oo_scrTicks(k),ivy:{work:1-0.8*up,expr:PK.exprMix("neutral","think",up),gaze:[1,-0.8*up],nod:-0.1*up}});
      const a1=ag_io(tt,w("data","job",-0.2),c.breath-0.2,0.4),a2=ag_io(tt,w("data","report",-0.2),c.breath-0.2,0.4);
      PK.tag(x,330,286,"A job that ran",a1,{align:"left"});PK.tick(x,300,286,22,a1);PK.tag(x,330,350,"A report that was sent",a2,{align:"left"});PK.tick(x,300,350,22,a2);}}
  ]);
  oo_card(ctx,S,t,c.when-0.2,w("women","rural",-0.6),{kick:"Kenya",title:"The 1970s",sub:"The central highlands"},{y:84});
  oo_card(ctx,S,t,c.start+0.1,c.nursery-0.4,{kick:"1977",title:"The Green Belt Movement",sub:"With the National Council of Women of Kenya",col:PK.C.green},{y:84});
  oo_card(ctx,S,t,c.paid+0.1,c.answer-0.5,{kick:"Months later",title:"Paid for each tree still alive",col:PK.C.green},{y:84});
  oo_card(ctx,S,t,c.fifty+0.1,c.give-0.3,{kick:"Kenya, since 1977",title:"More than 50 million trees",col:PK.C.green},{y:84});
  oo_card(ctx,S,t,c.nobel+0.2,tU-0.3,{kick:"2004",title:"The Nobel Peace Prize",sub:"The first African woman to win it"},{y:84});
  oo_imagined(ctx,S,t,tU+0.8,c.breath-0.2);
  PK.title(ctx,S,t,c.breath+0.2,"Owning the outcome","Answer for what it's for","Leading data people · Ownership and performance",{side:"right"});
});

/* ---------------------------------------------------------------- 2. What she owns: Thursday 1 July */
// the two sheets Ivy pins to the team's board on her first day as owner: the product, and its promise (a1, a2: how far each is up)
const oo_sheets=(cx,a1,a2)=>{oo_pinned(cx,806,226,"Data product","Teaching space use",a1,PK.C.orange);oo_pinned(cx,806,352,"Its promise","Every Monday by 7:00",a2,PK.C.blue);};
scene("owns",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tB=w("owner","becomes"),tR=c.what-0.4,tM=c.mesh-0.4,tC=c.readers-0.5,tL=c.truly-0.5,tD=w("many","Sam",-0.5);
  ag_shots(ctx,S,t,sc.dur,[
    // her first day as owner: Helena brings her a seedling in a pot. The shot opens as the chapter before ends (Ivy looking up from
    // her screen), so only the title card fades
    {at:0,place:"ooTeam",keys:[[0,960,540,1.0],[tB-1.6,780,590,1.18]],d:2.6,draw:(x,tt,cam)=>{
      const st=ag_in(tt,0.9,1.2),turn=ag_in(tt,tB-1.2,0.5),up=ag_in(tt,tB-0.8,0.8),th=tB+1.0,rk=ag_in(tt,tB+0.3,0.7),pull=ag_in(tt,th+0.2,0.9),hand=[U.lerp(676,628,pull),U.lerp(588,604,pull)],seen=ag_in(tt,tB+0.6,0.6);
      const R=oo_team(x,tt,{clock:9.1,sam:{work:1-0.8*seen,expr:PK.exprMix("neutral","smile",seen),gaze:[1,-0.3*seen],turn:seen},jun:{work:1-0.8*seen,expr:PK.exprMix("neutral","smile",seen)},
        ivy:Object.assign({turn,work:U.lerp(0.2,1,st),pose:PK.poseSit(1-up),expr:PK.exprMix(PK.exprMix("think","neutral",st),"glad",ag_in(tt,tB+0.6,0.6)),gaze:[1,U.lerp(-0.8,0.2,st)],nod:-0.1*(1-st),hold:tt>=th?oo_potHold(0.3):null},
          tt<tB-0.2?{}:{reachN:hand,reachNk:rk,reachF:[hand[0]+22,hand[1]+8],reachFk:rk})});
      const Jh=PK.walk(x,"helena",tt,{x0:2030,x1:806,t0:0.4,t1:tB-0.2,floor:904,h:oo_hT(904),arms:{aN:OO_CARRY.aN},then:PK.poseMix(OO_CARRY,"clasp",ag_in(tt,th+0.35,0.7))},{hold:tt<th?oo_potHold(0.3):null,expr:oo_says("smile",tt,tB+0.3,tB+1.6),reachN:[690,590],reachNk:ag_io(tt,tB+0.2,th+0.5,0.6)});
      PK.nameTag(x,R.ivy.hc[0],R.ivy.hc[1]-150,"Ivy Reyes","Data analyst",ag_io(tt,w("owner","Ivy",-0.2),tB+0.1,0.4));
      oo_say(x,Jh,tt,tB+0.3,tR-0.4,["It's yours now."],cam);}},
    // what she owns: for every teaching room and every hour, how many people came
    {at:tR,cut:true,place:"ooRoom",keys:[[tR,900,560,1.05]],d:2,draw:(x,tt,cam)=>{
      const seats=PK.seats(),ts=[c.what+0.3,c.what+1.7,c.what+3.1],n=31+ts.filter(q=>tt>q+0.5).length;let seen=0;
      oo_class(x,tt,{n:8,open:ag_io(tt,tR+0.1,c.what+6.4,0.5),look:0.2,teacher:false,between:(cx,row)=>{if(row===0)[0,2,3].forEach((s,i)=>{seen=Math.max(seen,oo_toSeat(cx,tt,PK.extra(30+i*3),seats[s],ts[i],2.8+i*0.5));});}});
      PK.sensor(x,OO_L.sensor[0],OO_L.sensor[1],seen);oo_count(x,n+" people");
      PK.person(x,OO_TEACHER,1560,856,oo_hL(856),"stand",{t:tt,flip:true,expr:"smile"});
      oo_tag(x,tt,w("what","Counts",-0.2),tM-0.4,322,306,"Counts, never people",{align:"left",weight:800});}},
    // the data product owner: she pins the product to the board, and its promise; Sam, who keeps the platform, looks round at it
    {at:tM,cut:true,place:"ooTeam",keys:[[tM,900,500,1.18]],d:2,draw:(x,tt,cam)=>{
      const tq=w("promise","refreshed"),p1=ag_io(tt,tM+0.2,c.mesh+1.4,0.5),p2=ag_io(tt,tq-0.7,tq+0.9,0.5),back=ag_io(tt,c.mesh+2.2,tq-1.2,0.7),look=ag_io(tt,tq+0.5,tC-0.2,0.5);let Ji;
      oo_team(x,tt,{clock:9.5,ivy:null,pot:0.3,sam:{turn:look,work:1,expr:PK.exprMix("neutral","smile",look),gaze:[1,-0.4*look]},behind:cx=>{
        oo_sheets(cx,ag_in(tt,tM+0.5,0.35),ag_in(tt,tq-0.35,0.35));
        Ji=PK.person(cx,"ivy",716,842,oo_hT(842),PK.poseMix("stand","listen",back),{t:tt,expr:PK.exprMix("neutral","smile",Math.max(back,ag_in(tt,tq+0.6,0.6))),gaze:[1,-0.5+0.5*back],reachN:[822,p2>p1?366:240],reachNk:Math.max(p1,p2)});}});
      PK.nameTag(x,Ji.hc[0]-170,Ji.hc[1]-150,"Ivy Reyes","Data product owner",ag_io(tt,w("mesh","owner",-0.3),c.film-0.4,0.4));
      PK.nameTag(x,975,590,"Zhamak Dehghani","Data mesh",ag_io(tt,w("mesh","Zhamak",0.3),c.film-0.4,0.4));}},
    // its readers, by name, and what it is for; others come and go on the campus
    {at:tC,cut:true,place:"ooCampus",keys:[[tC,960,560,1.0],[c.readers+2.6,830,585,1.1]],d:3,draw:(x,tt,cam)=>{
      oo_passer(x,tt,PK.extra(4),tC+0.2,{});oo_passer(x,tt,PK.extra(11),tC+10.4,{out:true});
      const show=ag_io(tt,c.for-0.2,c.truly-1,0.8),nod=Math.sin(tt*2.4)*0.04*ag_io(tt,c.which+0.2,c.truly-0.8,0.5);
      const Ji=PK.walk(x,"ivy",tt,{x0:-120,x1:560,t0:tC+0.1,t1:c.readers+3.2,floor:OO_CA.near,h:OO_HC,then:PK.poseMix("ease","wave",ag_io(tt,c.readers+3.0,c.readers+4.4,0.4))},{expr:PK.exprMix("smile","listen",show),nod});
      // Mei a step behind Graham, half hidden by his shoulder: two who came together, not three in a row
      const Jm=PK.person(x,"mei",1016,OO_CA.near-30,PK.hAt(OO_CA.near-30,OO_CA.eye),"clasp",Object.assign({t:tt,flip:true},
        PK.face(tt,{expr:"smile",gaze:[1,0]},[[c.readers+3.5,"nod"],[c.for+0.9,"look",2.6,[0.5,0.8]],[c.for+3.8,"nod"],[c.which,"say",1.8]])));
      const Jg=PK.person(x,"graham",880,OO_CA.near,OO_HC,PK.poseMix("ease",OO_SHOW,show),Object.assign({t:tt,flip:true,hold:oo_plan},
        PK.face(tt,{expr:"smile",gaze:[1,0.6*show]},[[c.readers+3.3,"nod"],[c.for,"say",3],[c.which+0.8,"nod"]])));
      PK.nameTag(x,Jg.hc[0]-40,Jg.hc[1]-150,"Graham Ellis","Facilities",ag_io(tt,w("readers","Graham",-0.2),c.for-0.4,0.4));PK.nameTag(x,Jm.hc[0]+110,Jm.hc[1]-150,"Mei Tanaka","Registrar's office",ag_io(tt,w("readers","Mei",-0.2),c.for-0.4,0.4));
      oo_say(x,Jm,tt,c.which-0.1,tL-0.3,["Which ones?","Your counts will tell us."],cam,{dx:60});}},
    // what she answers for: a room in use; Graham comes to look at his sensor
    {at:tL,cut:true,place:"ooRoom",keys:[[tL,960,560,1.0],[c.many-0.2,760,560,1.14]],d:2.6,draw:(x,tt,cam)=>{
      oo_class(x,tt,{});oo_count(x,"34 people");const gz=ag_in(tt,c.many+0.6,0.6),tg=c.many+2.0;
      PK.person(x,"ivy",150,892,oo_hL(892),"clasp",{t:tt,expr:"smile",gaze:[1,-0.2-0.5*gz]});
      PK.walk(x,"graham",tt,{x0:-140,x1:372,t0:c.many-0.6,t1:tg,floor:902,h:oo_hL(902),then:"ease"},{flip:ag_in(tt,tg-0.1,0.4),expr:"neutral",gaze:[1,-0.9*ag_in(tt,tg+0.2,0.5)],nod:-0.12*ag_in(tt,tg+0.3,0.5)});
      PK.bubble(x,960,112,["Monday's job"],null,ag_io(tt,w("truly","Monday's",-0.2),c.many-0.5,0.4),{size:30,weight:700,ink:PK.C.mut,strike:U.clamp((tt-w("truly","job",0.2))/0.5,0,1)||0});
      oo_tag(x,tt,w("truly","true",-0.6),c.many-0.5,960,196,"True counts, for the timetable change",{col:PK.C.green,weight:800});
      oo_tag(x,tt,w("many","Facilities",-0.1),tD-0.2,330,306,"Facilities keeps the sensors",{align:"left"});}},
    // the team: Sam keeps the platform, Jun reviews her changes; one person answers; Helena gives her the authority to match
    {at:tD,cut:true,place:"ooTeam",keys:[[tD,1100,570,1.15],[c.one-0.4,960,550,1.06],[c.helena-0.6,960,540,1.0]],d:2.6,draw:(x,tt,cam)=>{
      const up=ag_in(tt,c.one-0.2,0.8),turn=ag_in(tt,c.one-0.5,0.5),ok=ag_in(tt,w("can","without",-0.2),0.6);
      const jr=ag_io(tt,w("can","review",-0.5),w("can","tell",0.6),0.5);
      const R=oo_team(x,tt,{clock:10.2,pot:0.3,sam:{expr:"neutral"},jun:Object.assign({work:1-0.8*jr},PK.face(tt,{expr:"neutral",gaze:[1,-0.3*jr]},[[w("can","review",-0.2),"smile",2.6],[w("can","review",0.3),"nod"]])),behind:cx=>oo_sheets(cx,1,1),
        ivy:Object.assign({turn,work:1,pose:PK.poseSit(1-up,"ease")},PK.face(tt,{expr:PK.exprMix("neutral","glad",ok),gaze:[1,0.1]},
          [[w("one","Ray-see",0.7),"look",2.4,[1,-0.25]],[c.helena-0.4,"look",Infinity,[1,-0.05]],[w("can","hold",0.9),"nod"],[w("can","change",1.7),"nod"]]))});
      PK.nameTag(x,R.sam.hc[0]+130,R.sam.hc[1]-150,"Sam Okafor","Keeps the platform",ag_io(tt,w("many","Sam",-0.1),c.one-0.5,0.4));PK.nameTag(x,R.jun.hc[0]-60,R.jun.hc[1]-150,"Jun Park","Reviews her changes",ag_io(tt,w("many","Jun",-0.1),c.one-0.5,0.4));
      oo_letter(x,R.sam,"R",ag_io(tt,w("one","Ray-see",-0.1),c.helena-0.5,0.4));oo_letter(x,R.jun,"R",ag_io(tt,w("one","Ray-see",0.2),c.helena-0.5,0.4));oo_letter(x,R.ivy,"A",ag_io(tt,w("one","A,",-0.2),c.helena-0.5,0.4),true);
      oo_tag(x,tt,w("one","accountable",-0.2),c.helena-0.5,R.ivy.hc[0]+70,R.ivy.hc[1]-250,"Accountable: only one",{col:PK.C.blue,weight:800,align:"left"});
      const Jh=PK.walk(x,"helena",tt,{x0:2030,x1:770,t0:c.helena-1.2,t1:c.helena+1.6,floor:904,h:oo_hT(904),then:"listen"},{expr:oo_says("smile",tt,c.can,c.can+5.4)});
      PK.say(x,Jh,["Hold a refresh.","Change the model, with a review.","Tell the readers. No need to ask me."],ag_in(tt,c.can-0.1,0.3),{cam,dx:350,dy:-41,la:[ag_in(tt,w("can","hold",-0.1),0.3),ag_in(tt,w("can","change",-0.1),0.3),ag_in(tt,w("can","tell",-0.1),0.3)]});}}
  ]);
  oo_card(ctx,S,t,w("owner","Thursday",-0.3),tR-0.3,{kick:"Thursday 1 July",title:"Ivy's first data product",col:PK.C.blue});
  oo_card(ctx,S,t,c.what+0.1,tM-0.4,{kick:"The data product",title:"Teaching space use",sub:"Each room, each hour: booked, and how many came",col:PK.C.orange},{right:true,y:76});
  oo_card(ctx,S,t,c.film+0.1,c.promise-0.5,{kick:"An earlier film",title:"A product with an owner",sub:"How a product gets one"});
  oo_card(ctx,S,t,w("for","timetable",-0.4),c.which-0.5,{kick:"Next year's timetable",title:"Move about one peak class in six",sub:"and release rooms nobody uses",col:PK.C.blue},{right:true,y:76});
  oo_imagined(ctx,S,t,0.2,7.5);oo_kick(ctx,S,ag_in(t,1.0,0.6));
});
// the timetable plan Graham holds: a board with a grid, in his hand
function oo_plan(c,h,deg,J){const U=PK.u,u=J.u,x=h[0]-40*u,y=h[1]-150*u,w=170*u,hh=210*u;PK.S.begin(c,{lw:2.4,sh:3});PK.S.fill(c,cc=>U.rrect(cc,x,y,w,hh,8*u),PK.col("board"),{});
  for(let i=0;i<4;i++)for(let j=0;j<3;j++){c.fillStyle=U.css((i*3+j)%6===1?PK.C.blue:[214,208,196],(i*3+j)%6===1?0.8:1);c.beginPath();U.rrect(c,x+16*u+j*48*u,y+22*u+i*44*u,40*u,34*u,5*u);c.fill();}}

/* ---------------------------------------------------------------- 3. A Monday that looked fine: Monday 23 August */
const OO_LEANIN={mode:"sit",lean:16,head:-2,aN:[30,84,"flat"],aF:[34,88,"flat"],lN:[86,4],lF:[82,-4]};
const OO_PLANT={mode:"kneel",lean:48,head:-18,aN:[20,10,"grip"],aF:[10,20],lN:[28,-90],lF:[40,-88],fN:70,fF:70},OO_PLANT2={mode:"kneel",lean:32,head:-8,aN:[30,20,"grip"],aF:[14,28],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=OO_CAST;
  const tEv=w("ran","Every"),tS=c.seedling-0.5,tR=c.reads-0.5,tC=c.release-0.5,tW=c.wait-0.5,tT=c.tell-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // seven weeks on, before the others are in: Ivy comes in and sits down to the refresh, which ran at seven
    {at:0,place:"ooTeam",later:true,keys:[[0,960,540,1.0],[tEv-0.6,835,590,1.15]],d:2.6,draw:(x,tt,cam)=>{
      const tA=4.4,here=tt>=tA+0.3,sit=ag_in(tt,tA+0.3,0.9),ok=ag_in(tt,tEv+0.3,0.6);
      oo_team(x,tt,{clock:8.0,pot:0.55,sam:null,jun:null,away:!here,ivy:{pose:PK.poseSit(sit),work:ag_in(tt,tA+1.0,0.8),expr:PK.exprMix("neutral","smile",0.6*ok),gaze:[1,0.3*sit]}});
      if(!here)PK.walk(x,"ivy",tt,{x0:2040,x1:OO_IVY.x,t0:0.4,t1:tA,floor:OO_IVY.floor,h:OO_HI,then:"stand"},{t:tt+1,expr:"neutral"});
      const a=ag_io(tt,tEv-0.2,tS-0.2,0.4);PK.tag(x,136,432,"Every check passes",a,{align:"left",col:PK.C.green,weight:800});PK.tick(x,104,432,22,a);}},
    // Kenya: where one died, a seedling goes back in the ground. It earns nothing yet
    {at:tS,cut:true,place:"ooHills",keys:[[tS,1100,640,1.18],[tS+0.6,1182,650,1.3]],d:3,draw:(x,tt,cam)=>{
      oo_sky(x,tt);oo_row(x,tt,0.5,1,null,{i:5,g:0.5});
      const ry=OO_ROW.y(1320),fw=OO_ROW.y(1196)+44,up=ag_in(tt,w("seedling","nothing",-0.3),0.9),pat=Math.sin(tt*5.2)*(1-up);
      PK.person(x,K.wan,1196,fw,oo_h(fw),PK.poseMix(OO_PLANT,OO_PLANT2,up),{t:tt,expr:PK.exprMix("neutral","smile",up),gaze:[1,0.6],reachN:[1292,ry-6+5*pat],reachNk:1-0.4*up,reachF:[1280,ry+14-5*pat],reachFk:1-0.4*up});
      PK.walk(x,K.girl,tt,{x0:2010,x1:1560,t0:tS-0.6,t1:tS+2.8,floor:xx=>OO_ROW.y(xx)+50,h:fl=>oo_h(fl)*0.7,arms:{aN:[3,5,"grip"]},then:"can"},{hold:oo_can,expr:"smile"});
      oo_tag(x,tt,w("seedling","nothing",-0.2),tR-0.3,1330,486,"Nothing, until it lives",{col:PK.C.mut,weight:800});}},
    // she reads the numbers themselves; Sam comes in behind her
    {at:tR,cut:true,place:"ooTeam",keys:[[tR,835,590,1.15],[c.drop-0.3,800,560,1.2]],d:2.4,draw:(x,tt,cam)=>{
      const lk=ag_in(tt,c.reads+0.2,0.8),bad=ag_in(tt,c.drop+0.6,0.8),bk=ag_in(tt,c.drop+2.0,0.9),tA=tR+3.4,in1=tt>=tA+0.3,sit=ag_in(tt,tA+0.3,0.9);
      oo_team(x,tt,{clock:8.2,pot:0.55,jun:null,sam:in1?{pose:PK.poseSit(sit),work:ag_in(tt,tA+1.1,0.8),expr:"neutral"}:null,
        behind:cx=>{if(!in1)PK.walk(cx,"sam",tt,{x0:2010,x1:1230,t0:tR+0.2,t1:tA,floor:xx=>U.lerp(838,872,U.clamp((xx-1230)/160,0,1)),h:oo_hT,then:"stand"},{flip:1-ag_in(tt,tA-0.3,0.4),expr:"neutral"});},
        ivy:{work:1-0.6*bk,workPose:PK.poseMix("sitWork",OO_LEANIN,lk*(1-bk)),expr:PK.exprMix(PK.exprMix("neutral","think",lk),"worry",bad),gaze:[1,0.2]}});
      const p=0.62*ag_in(tt,c.reads+0.9,1.2)+0.38*ag_in(tt,c.drop-0.2,1.4);
      oo_callout(x,40,150,520,256,205,474,ag_io(tt,c.reads+0.5,tC-0.3,0.4),(cc,bx,by,bw,bh)=>oo_dropChart(cc,bx,by,bw,bh,p));}},
    // what the counts would do: a full room, counted at nine, would be released
    {at:tC,cut:true,place:"ooRoom",keys:[[tC,960,560,1.0],[tC+0.4,900,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const gone=ag_io(tt,w("release","release",-0.4),w("release","really",-0.2),0.6);
      oo_class(x,tt,{a:1-0.78*gone});oo_count(x,"9 people",1,PK.C.amber);
      oo_tag(x,tt,w("release","release",-0.1),w("release","really",0.3),900,196,"Release this room?",{col:PK.C.amber,weight:800});}},
    // she doesn't wait: she gets up and goes
    {at:tW,cut:true,place:"ooTeam",keys:[[tW,835,590,1.15],[c.wait+0.6,960,560,1.04]],d:2.4,draw:(x,tt,cam)=>{
      const turn=ag_in(tt,c.wait-0.1,0.5),up=ag_in(tt,c.wait+0.2,0.7),tG=c.wait+0.9,gone=tt>=tG,look=ag_in(tt,tG+1.2,0.6);
      oo_team(x,tt,{clock:8.4,pot:0.55,jun:null,sam:{work:1-0.7*look,expr:PK.exprMix("neutral","think",look),gaze:[1,-0.3*look],nod:-0.06*look},away:gone,
        ivy:{turn:gone?1:turn,work:0.3,pose:PK.poseSit(1-up),expr:"worry",gaze:[1,0]}});
      if(gone)PK.walk(x,"ivy",tt,{x0:OO_IVY.x,x1:1900,t0:tG,t1:tG+3.2,floor:OO_IVY.floor,h:OO_HI},{t:tt+1,expr:"worry"});}},
    // she tells the readers herself, before the fix: Graham and Mei, on their way across the campus
    {at:tT,cut:true,place:"ooCampus",keys:[[tT,960,560,1.0],[c.tell+2.2,830,585,1.1]],d:3,draw:(x,tt,cam)=>{
      oo_passer(x,tt,PK.extra(16),tT+0.4,{out:true});
      const tM=c.tell+1.5,tg=c.first-1.9,said=ag_in(tt,tg+0.4,0.8),f1=w("tell","forty",-0.1),f2=w("tell","Don't",-0.1),f3=w("tell","The right",-0.1),hear=ag_in(tt,tM,0.5);
      PK.walk(x,"mei",tt,{x0:1700,x1:1036,t0:tT-1.4,t1:tM+0.2,floor:OO_CA.near-30,h:PK.hAt(OO_CA.near-30,OO_CA.eye),then:"clasp"},{expr:PK.exprMix("neutral","listen",hear),nod:Math.sin(tt*2.6+1)*0.04*ag_io(tt,f2,c.first+2,0.5)});
      const Jg=PK.walk(x,"graham",tt,{x0:1560,x1:900,t0:tT-1.4,t1:tM,floor:OO_CA.near,h:OO_HC,arms:{aN:[2,9,"grip"]},then:"stand"},{hold:oo_plan,expr:oo_says(PK.exprMix("neutral","listen",hear),tt,tg,tg+1.8),nod:Math.sin(tt*2.2)*0.03*ag_io(tt,f1,tg,0.5)});
      const Ji=PK.walk(x,"ivy",tt,{x0:-140,x1:600,t0:tT+0.1,t1:c.tell+1.6,floor:OO_CA.near,h:OO_HC,then:"clasp"},{expr:oo_says(PK.exprMix("worry","relief",said),tt,f1,tg-0.4)});
      PK.say(x,Ji,["Forty rooms look wrong to me.","Please don't use them yet.","Right counts by tomorrow."],ag_io(tt,f1,tg-0.2,0.3),{cam,dx:40,la:[ag_in(tt,f1,0.3),ag_in(tt,f2,0.3),ag_in(tt,f3,0.3)]});
      oo_say(x,Jg,tt,tg,c.first+2.9,["Thanks. We'll hold off."],cam,{dx:-40});}}
  ]);
  oo_card(ctx,S,t,1.2,tS-0.3,{kick:"Monday 23 August",title:"Refreshed at 7:00",col:PK.C.blue});
  oo_kick(ctx,S,1-ag_io(t,c.reads+0.5,tC-0.3,0.4));
});

/* ---------------------------------------------------------------- 4. Fix it, or raise it */
const OO_OVER={lean:12,head:4,aN:[40,60],aF:[6,14],lN:[-2,-2],lF:[5,4]};
scene("fix",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tF=c.four+0.4,tX=sc.ends.four,tJ=w("fix","Jun",-0.3),tM=c.mine-0.5,tK=c.check-0.5,ti=w("raise","raises",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // Monday, half past nine: Sam comes over, and they find it together on her screen
    {at:0,place:"ooTeam",keys:[[0,800,560,1.2],[tX-0.2,960,540,1.0]],d:2.6,draw:(x,tt,cam)=>{
      const tB=tX-0.4,turn=ag_in(tt,tX+0.1,0.5),found=ag_in(tt,w("four","model",0.8),0.8),mine=tX+0.8,up=ag_in(tt,tB-0.4,0.6);
      const R=oo_team(x,tt,{clock:9.5,pot:0.55,sam:null,jun:{expr:"neutral"},ivy:{turn,work:1-0.5*found,expr:oo_says(PK.exprMix(PK.exprMix("worry","think",ag_in(tt,2,1)),"relief",found),tt,mine,mine+1.3),gaze:[1,0.2*(1-turn)-0.5*turn],nod:-0.06*turn}});
      // he leans in with a hand on her chair's back; as she turns round to him he lets go, straightens and steps back
      const so={expr:PK.exprMix("think","smile",up),gaze:[1,0.5],nod:0.05*up+Math.sin(tt*2.3)*0.03*up,reachN:[656,562]};
      if(tt<tB-0.4)PK.walk(x,"sam",tt,{x0:1230,x1:790,t0:-0.6,t1:2.0,floor:xx=>U.lerp(900,838,U.clamp((xx-790)/440,0,1)),h:oo_hT,then:OO_OVER},Object.assign(so,{reachNk:ag_in(tt,1.8,0.6)}));
      else PK.walk(x,"sam",tt,{x0:790,x1:905,t0:tB,t1:tB+1.0,floor:900,h:oo_hT(900),flip:true,before:OO_OVER,then:"listen"},Object.assign(so,{reachNk:1-ag_in(tt,tB-0.4,0.4)}));
      const p=0.62*ag_in(tt,w("four","four",-0.3),1.6)+0.38*ag_in(tt,w("four","model",-0.1),1.2);
      oo_callout(x,40,150,520,250,205,474,ag_io(tt,tF,tX-0.3,0.4),(cc,bx,by,bw,bh)=>oo_hourCard(cc,bx,by,bw,bh,p));
      oo_say(x,R.ivy,tt,mine,tJ-0.6,["That one's mine."],cam,{lean:0,dx:-50});}},
    // that afternoon: Jun reviews her change
    {at:tJ,place:"ooTeam",later:true,keys:[[tJ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const tq=w("fix","reviews",0.9),ok=ag_in(tt,tq-0.2,0.6);
      const R=oo_team(x,tt,{clock:15.2,pot:0.55,sam:{expr:"neutral"},jun:{work:1-0.9*ok,expr:oo_says(PK.exprMix("think","smile",ok),tt,tq,tq+1.4),gaze:[1,0]},
        ivy:{turn:ag_in(tt,tq+0.2,0.5),work:1,expr:PK.exprMix("think","glad",ag_in(tt,tq+0.6,0.6)),gaze:[1,0]}});
      oo_say(x,R.jun,tt,tq,tq+3.4,["Looks right to me."],cam);}},
    // what isn't hers: the sensors are Facilities'. She finds Graham under one, in a teaching room between classes
    {at:tM,cut:true,place:"ooRoom",keys:[[tM,900,560,1.05],[c.mine+1.6,740,530,1.28]],d:2.6,draw:(x,tt,cam)=>{
      const tg=c.mine+1.2,ta=w("raise","From",1.2),look=1-ag_in(tt,tg+1.2,0.6);
      oo_class(x,tt,{n:0,teacher:false,open:ag_io(tt,tg-0.3,tg+2.4,0.5),seen:U.pio(tt,tg+0.2,tg+1.0,0.25)});
      const Jg=PK.person(x,"graham",470,902,oo_hL(902),"listen",{t:tt,flip:true,expr:oo_says(PK.exprMix("neutral","smile",ag_in(tt,ta-0.4,0.6)),tt,ta,ta+1.6),gaze:[1,-0.9*look],nod:-0.12*look+Math.sin(tt*2.2)*0.03*ag_io(tt,ti+0.4,ta,0.5)});
      if(tt>=tg){const x0=OO_L.door.x+24,Ji=PK.walk(x,"ivy",tt,{x0,x1:210,t0:tg,t1:tg+2.0,phase:0.9*(tt-tg),floor:xx=>U.lerp(812,896,U.clamp((x0-xx)/74,0,1)),h:oo_hL,flip:false,then:"ease"},{t:tt+1,a:U.pin(tt,tg,0.4),expr:oo_says(PK.exprMix("think","neutral",ag_in(tt,ta,0.6)),tt,ti,ti+2.4)});
        oo_say(x,Ji,tt,ti,ta-0.2,["Can you warn us","before the next upgrade?"],cam,{dx:200});}
      oo_tag(x,tt,w("mine","sensors",-0.1),c.raise-0.6,OO_L.sensor[0]+62,OO_L.sensor[1],"Facilities' sensors",{align:"left",weight:800});
      oo_say(x,Jg,tt,ta,tK-0.4,["We will. Every time."],cam,{dx:250});}},
    // her own check: a drop like this one now holds the refresh
    {at:tK,cut:true,place:"ooTeam",keys:[[tK,835,590,1.15],[c.check+4.6,900,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const done=ag_in(tt,w("check","before",0.8),0.8);
      oo_team(x,tt,{clock:14.3,pot:0.62,ivy:{work:1-0.7*done,expr:PK.exprMix("think","smile",done),gaze:[1,0.2*(1-done)]}});
      oo_callout(x,60,170,440,236,205,474,ag_io(tt,c.check+0.5,sc.dur-0.9,0.4),(cc,bx,by,bw,bh)=>oo_checkCard(cc,bx,by,bw,bh,[ag_in(tt,w("check","a drop",-0.1),0.3),ag_in(tt,w("check","holds",-0.1),0.3),ag_in(tt,w("check","before",-0.1),0.3)]));}}
  ]);
  oo_card(ctx,S,t,w("fix","Tuesday",-0.2),c.mine-0.8,{kick:"Tuesday morning",title:"The right counts",sub:"for Graham's and Mei's teams",col:PK.C.green});
  oo_kick(ctx,S,1-Math.max(ag_io(t,tF,tX-0.3,0.4),ag_io(t,ti-0.3,tK-0.2,0.4),ag_io(t,c.check+0.5,sc.dur-0.9,0.4)));
});

/* ---------------------------------------------------------------- 5. Nobody to blame */
scene("blame",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tD=c.dekker-0.5,tA=c.account-0.5,tF=w("fit","What failed");
  ag_shots(ctx,S,t,sc.dur,[
    // the week after, in the team's room: everyone who had a part in it says what they saw, and Helena listens
    {at:0,place:"ooTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const s=[w("each","Facilities",-0.1),w("each","Sam's",-0.1),w("each","The step",-0.1),c.each+7.5],ok=i=>ag_in(tt,s[i+1]-0.1,0.5),face=i=>PK.exprMix("worry","relief",ok(i));
      // nobody sits by: each looks at whoever speaks, and nods at what they hear
      const R=oo_team(x,tt,{clock:11.0,pot:0.75,away:true,ivy:{turn:1},
        jun:Object.assign({work:0,pose:"sit"},PK.face(tt,{expr:"listen",gaze:[1,0]},[[s[0]+0.5,"look",2.2,[1,-0.3]],[s[1]+1.3,"nod"],[s[2]+0.4,"look",2.4,[0.4,-0.2]],[s[2]+1.2,"worry",2.6],[tF+0.8,"nod"]])),
        sam:Object.assign({turn:1,work:0},PK.face(tt,{expr:face(1),gaze:[1,0]},[[s[0]+1.0,"nod"],[s[1],"say",s[2]-0.2-s[1]],[s[2]+0.5,"look",2.4,[1,-0.2]],[s[2]+1.9,"nod"],[tF+1.4,"think",3]]))});
      PK.person(x,"helena",OO_IVY.x,OO_IVY.floor,OO_HI,PK.poseMix("sit","sitBack",0.5),Object.assign({t:tt+2},
        PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[s[0]+1.5,"nod"],[s[1]+0.4,"look",2.4,[1,0.1]],[s[1]+1.6,"nod"],[s[2]+0.4,"look",2.6,[1,-0.35]],[s[2]+1.7,"nod"],[tF+0.5,"think",3.4]])));
      const Jg=PK.person(x,"graham",810,930,oo_hT(930),"ease",Object.assign({t:tt},PK.face(tt,{expr:face(0),gaze:[1,0]},[[s[0],"say",s[1]-0.2-s[0]],[s[1]+0.5,"look",2.2,[1,-0.1]],[s[2]+1.3,"nod"],[tF+1.0,"think",3]])));
      const Ji=PK.person(x,"ivy",1490,944,oo_hT(944),"clasp",Object.assign({t:tt+1,flip:true},PK.face(tt,{expr:face(2),gaze:[1,0]},[[s[0]+0.6,"look",2.2,[1,0.1]],[s[1]+1.1,"nod"],[s[2],"say",s[3]-0.2-s[2]],[tF+0.6,"nod"]])));
      // each was right about what they saw: a tick over each of the three; what failed lies between them
      const M=[oo_over(Jg,24),oo_over(R.sam,24),oo_over(Ji,24)],lk=ag_in(tt,tF,1.2),la=ag_io(tt,tF,tD-0.4,0.4);
      oo_link(x,M[0],M[1],U.clamp(lk*2,0,1),PK.C.amber,la);oo_link(x,M[1],M[2],U.clamp(lk*2-1,0,1),PK.C.amber,la);
      M.forEach((q,i)=>PK.tick(x,q[0],q[1],24,ag_io(tt,s[i+1]-0.1,tD-0.4,0.4)));
      oo_say(x,Jg,tt,s[0],s[1]-0.2,["We upgraded them in August."],cam);oo_say(x,R.sam,tt,s[1],s[2]-0.2,["The platform took all four."],cam,{dx:70});oo_say(x,Ji,tt,s[2],s[3]-0.2,["My step kept the first one."],cam,{dx:-110});
      oo_tag(x,tt,tF-0.1,tD-0.4,1000,120,"The gap was between the parts",{col:PK.C.amber,weight:800});}},
    // Helena's corner: her first question isn't who
    {at:tD,cut:true,place:"ooCorner",keys:[[tD,960,540,1.0],[c.helena-0.6,960,556,1.06]],d:3,draw:(x,tt,cam)=>{
      const q0=w("helena","isn't who",-0.1),q1=w("helena","what happened",-0.1),q2=w("helena","what Ivy",-0.1),ti=c.safe-0.2,lean=ag_in(tt,c.helena-0.4,0.9),up=ag_in(tt,q1+0.4,0.9);
      const R=oo_corner(x,tt,{t0:tD,lean,up,he:oo_says(PK.exprMix("listen","smile",0.5*lean),tt,q1,c.safe-1.0),ie:oo_says(PK.exprMix("worry","relief",ag_in(tt,q2+0.6,1.0)),tt,ti,ti+3.2)});
      // the question she doesn't ask, struck out; then the two she does
      PK.bubble(x,R.helena.hc[0]+170,R.helena.hc[1]-170,["Who did this?"],null,ag_io(tt,c.helena-0.5,q1-0.15,0.3),{ink:PK.C.mut,strike:U.clamp((tt-q0)/0.4,0,1)});
      PK.say(x,R.helena,["What happened?","What do you need?"],ag_io(tt,q1+0.1,c.safe-0.5,0.3),{cam,la:[ag_in(tt,q1+0.1,0.3),ag_in(tt,q2,0.3)]});
      oo_say(x,R.ivy,tt,ti,tA-0.4,["The sensors changed,","and my step missed it."],cam);
      oo_tag(x,tt,w("safe","early",-0.2),tA-0.4,700,214,"Safe to say it early",{col:PK.C.green,weight:800});}},
    // giving an account: Ivy writes it up for the team, and for the two who read her counts
    {at:tA,cut:true,place:"ooTeam",keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      oo_team(x,tt,{clock:11.6,pot:0.75,ivy:null,sam:Object.assign({turn:1,work:0},PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tA+3.2,"nod"]])),jun:Object.assign({work:0,pose:"sit"},PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tA+4.4,"smile",2.4]])),behind:cx=>{
        PK.atBoard(cx,"ivy",tt,[{s:"What happened",t0:tA-4,t1:tA-2.4},{s:"What changes",t0:tA+0.5,t1:tA+2.3}],{x:836,y:330,lh:62,rest:745,floor:842,h:oo_hT(842),t:tt+1,expr:oo_says("neutral",tt,tA+3.6,sc.dur)});}});
      PK.person(x,"graham",1384,930,oo_hT(930),"clasp",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tA+2.6,"nods"]])));
      PK.seated(x,"mei",1664,946,oo_hT(946),PK.poseMix("sit","sitBack",0.4),Object.assign({t:tt+2,flip:true},PK.face(tt,{expr:"listen",gaze:[1,-0.3]},[[tA+3.8,"nod"],[tA+4.6,"smile",2.2]])));}}
  ]);
  const ca=ag_io(t,w("dekker","just",-0.3),c.helena-0.7,0.4);if(ca>0.004){setScreen(ctx,S);PK.card(ctx,960,64,{kick:"Sidney Dekker",title:"A just culture",sub:"Ask what happened, not who to blame",col:PK.C.blue},ca,{align:"center"});}
  oo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=OO_CAST;
  const tI=c.ivy-0.5,tK=c.know-0.5,tJ=w("ivy","In June",-0.3),tN=c.next-0.3,tE=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // Kenya, years on: a young tree, still standing
    {at:0,place:"ooGreen",keys:[[0,960,560,1.0],[0.6,1040,600,1.12]],d:3,draw:(x,tt,cam)=>{
      oo_sky(x,tt);
      PK.walk(x,K.nya,tt,{x0:1990,x1:1560,t0:-1.5,t1:6.5,floor:866,h:oo_h(866),arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4},then:"armful"},{hold:oo_firewood,expr:"smile"});
      PK.S.begin(x,{lw:2.6,far:0,sh:4});PK.tree(x,1215,888,1.0,7,{});
      const tch=ag_in(tt,1.4,0.9),kw={t0:0.2,t1:4.6,floor:900,h:oo_h(900)*0.74,then:"stand"};
      PK.person(x,K.wan,1105,890,oo_h(890),"stand",{t:tt,expr:"smile",gaze:[1,-0.3*tch],reachN:[1162,612],reachNk:tch});
      PK.walk(x,K.boy,tt,Object.assign({x0:420,x1:930},kw),{expr:"glad"});PK.walk(x,K.girl,tt,Object.assign({x0:300,x1:836,phase:0.4},kw,{floor:908,h:oo_h(908)*0.7}),{expr:"glad"});}},
    // the university, two years on: the timetable has changed, and it is judged on her counts
    {at:tI,place:"ooRoom",dis:1.0,keys:[[tI,960,540,1.0],[c.ivy+3.4,860,536,1.1]],d:3,draw:(x,tt,cam)=>{
      oo_class(x,tt,{});oo_count(x,"34 people");const show=ag_in(tt,tJ,0.8);
      PK.person(x,"ivy",150,892,oo_hL(892),"ease",{t:tt+1,expr:PK.exprMix("neutral","smile",show),gaze:[1,0.1]});
      PK.person(x,"graham",372,902,oo_hL(902),PK.poseMix("stand",OO_SHOW,show),{t:tt,flip:true,expr:oo_says("smile",tt,tJ+0.4,tJ+2.6),hold:oo_plan});}},
    // on Monday: the four things, written up for the team; then everyone goes back to work, and Ivy to her desk, by the seedling
    {at:tK,cut:true,place:"ooTeam",keys:[[tK,960,500,1.04],[c.next+1.4,900,560,1.08],[c.take-1.0,880,600,1.15]],d:3,draw:(x,tt,cam)=>{
      const L=[["Know who uses it",w("know","know",-0.2),1.6],["Watch what it's for",w("watch","Watch",-0.1),1.7],["Say so first",w("say","say so",-0.2),1.2],["Fix, raise, mend",w("mend","Fix",-0.1),w("mend","mend",0.6)-w("mend","Fix",-0.1)]].map(([s,t0,d])=>({s,t0,t1:t0+d}));
      const tB=tN+0.9,tS=tB+1.7,board=tt<tB,seated=tt>=tS,sit=ag_in(tt,tS,0.9),look=ag_in(tt,tS+0.8,0.8),touch=ag_in(tt,c.take-0.4,0.9),back=ag_in(tt,tN+0.2,0.5);
      oo_team(x,tt,{clock:9.2,pot:1,away:!seated,
        sam:Object.assign({turn:1-ag_in(tt,tN+0.8,0.5),work:ag_in(tt,tN+1.5,0.8)},PK.face(tt,{expr:"listen",gaze:[1,-0.2*(1-back)]},[[L[0].t1+0.3,"nod"],[L[2].t0+0.4,"smile",2.6],[L[3].t1+0.2,"nod"]])),
        jun:Object.assign({work:ag_in(tt,tN+1.1,0.8),pose:"sit"},PK.face(tt,{expr:"listen",gaze:[1,-0.2*(1-back)]},[[L[1].t1+0.2,"nod"],[L[3].t0+1.6,"look",2.2,[0.5,0.1]],[L[3].t1+0.9,"smile",2.4]])),
        behind:cx=>{PK.atBoard(cx,board?"ivy":null,tt,L,{x:836,y:280,lh:56,rest:745,floor:842,h:oo_hT(842),t:tt+1,down:tN+0.3,tray:[886,506],a:1-ag_in(tt,tE-0.3,0.9),expr:"neutral"});},
        ivy:{pose:PK.poseMix(PK.poseSit(sit),OO_LEANIN,0.5*touch),work:0,expr:PK.exprMix("neutral","smile",look),gaze:[1,0.4*look*(1-touch)],reachN:[385,512],reachNk:touch,reachF:[462,630],reachFk:touch}});
      PK.walk(x,"helena",tt,{x0:1480,x1:2040,t0:tN-0.1,t1:tN+2.7,floor:926,h:oo_hT(926),before:"clasp"},Object.assign({t:tt+2,flip:1-ag_in(tt,tN-0.1,0.4)},
        PK.face(tt,{expr:PK.exprMix("listen","smile",back),gaze:[1,-0.2*(1-back)]},[[L[0].t1+0.9,"nod"],[L[1].t0+0.8,"look",2,[1,0.1]],[L[2].t1+0.4,"nods"],[L[3].t0+2.2,"smile",2.6]])));
      if(!board&&!seated)PK.walk(x,"ivy",tt,{x0:745,x1:OO_IVY.x,t0:tB,t1:tB+1.4,floor:xx=>U.lerp(OO_IVY.floor,842,U.clamp((xx-OO_IVY.x)/185,0,1)),h:oo_hT,before:"ease",then:"stand"},{t:tt+1,flip:ag_in(tt,tB,0.4),expr:"neutral"});}}
  ]);
  oo_card(ctx,S,t,1.0,c.ivy-1.4,{kick:"Kenya",title:"Trees still standing",col:PK.C.green});
  oo_card(ctx,S,t,tJ,tK-0.3,{kick:"June 2029",title:"The timetable change",sub:"Judged on true counts",col:PK.C.blue},{right:true,y:124});
  oo_imagined(ctx,S,t,tJ,tK-0.3,"The university, 2029 · imagined");
  oo_card(ctx,S,t,c.next+0.2,c.take-0.6,{kick:"The next film",title:"Measure the work,",sub:"not the people"});
  oo_kick(ctx,S,1-ag_in(t,tE-0.2,0.6));
  PK.end(ctx,S,t,tE,"Owning the outcome",OO_LAST,"Film 1 of 4","Ownership and performance",{side:"right"});
});
ag_cutInto(["owns","monday","fix","blame"]);
