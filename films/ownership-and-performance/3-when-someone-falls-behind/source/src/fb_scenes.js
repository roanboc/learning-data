/* ===== When someone falls behind: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the
   line says, and the words on the frame are where and when, a name, a number the voice gives, what someone says, or what a screen
   shows. A key idea is never a label in a scene: the questions the film asks are explained by Carmen Vidal, a consultant, at the
   board of a seminar room, and what to keep is written by hand, in Tomás's own plan and in Helena's notebook (fb_uni.js). People
   also write to each other from where they are: Jun sends a report back to Tomás in a chat, and answers from the campus; and they
   meet face to face, at the line in Fremont and at Helena's round table. Every time comes from the voice: a line's start (sc.cues)
   or a word in it (wAt), so the pictures stay with the voice if it's recorded again; the score (tools/score.py) takes the same
   words. A shot is one stay in a place: the camera glides between its keys, and everyone in it moves as one function of time, so
   nothing jumps; between places the film cuts, or dissolves where the whole picture changes (Fremont and the university). Sizes are
   in the 1920 x 1080 frame; people's sizes come from each place's eye line (fb_hG by the plant's gate, fb_hH in its hall, fb_hT
   in the team's room, fb_hS in the seminar room). */
const FB_LAST="Find the cause, clear the way, and give it time.";
const fb_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,3,"When someone falls behind",a);}};
// a card in the frame's own space, so it stays put while the camera glides: in at t0, out at t1; o.right: at the top right
function fb_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.right?"right":"left"});}
const fb_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const fb_say=(x,J,tt,t0,t1,lines,cam,o)=>PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));
// while a chapter shows a key idea apart from the scene (the board seen close, a page of a notebook), its kicker steps back
const fb_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// a floor that runs between two points as someone walks from x0 to x1 (towards the camera, or away from it)
const fb_path=(x0,f0,x1,f1)=>x=>PK.u.lerp(f0,f1,PK.u.clamp((x-x0)/(x1-x0),0,1));

/* ---------------------------------------------------------------- the plant's people at work
   In 1982 one car in two leaves the line with its front door missing or of another colour. Someone who works the line has their
   hands on the car in front of them, on its side, while its body is there, and lets them fall in the gap between two cars (they
   come about once a minute). cars: what fb_line returned; sx: where they stand; dir: the way they face (1 right, -1 left) */
const FB_DEF82={"-1":"gone",0:"odd",1:"gone",2:"odd",3:"gone"};
const fb_cars82=i=>fb_carOf(i,{doors:FB_DEF82});
function fb_atCar(cars,sx,tt,dir){const U=PK.u;let m=-1e9;for(const c of cars)m=Math.max(m,470-Math.abs(c.x-sx));
  const k0=U.clamp(m/90,0,1),k=k0*k0*(3-2*k0),s=Math.sin(tt*2.3+sx*0.01)*10,y=FB_H.line-176+Math.cos(tt*1.7+sx*0.01)*6;
  return{k,n:[sx+dir*(72+0.6*s),y],f:[sx+dir*(116-0.4*s),y+16]};}
// what a worker's hands do: on the car (fb_atCar), or reaching for something else, w (0 to 1) of the way, at to
const fb_hands=(W,at,w,atF)=>{const U=PK.u,k=U.clamp(w||0,0,1);return{reachN:k>0.004?[U.lerp(W.n[0],at[0],k),U.lerp(W.n[1],at[1],k)]:W.n,reachNk:Math.max(W.k,k),
  reachF:atF&&k>0.004?[U.lerp(W.f[0],atF[0],k),U.lerp(W.f[1],atF[1],k)]:W.f,reachFk:W.k*(1-k)+(atF?k:0)};};
// the plant's people in 1984 who aren't named: the same faces as anyone's, in the plant's work jacket
const FB_X84={};
const fb_x84=i=>FB_X84[i]||(FB_X84[i]=Object.assign({},PK.extra(i),{key:"x84_"+i,top:{kind:"jacket",c:FB_UNI,inner:[236,232,224]}}));
/* someone who walks from the car park to the gate and on into the yard, between t0 and t1: from (sx, sf) to (gx, FB_G.fence), then
   on, smaller, until the yard takes them (they fade as they go in). arms: what their arms do as they walk, when they carry something;
   before: the stance they set off from. The second stretch starts where the first has come to rest, the same way on, so the stride
   never jumps between them */
function fb_toGate(x,who,tt,t0,t1,sx,sf,gx,o,arms,before){if(tt<t0-0.01)return null;const U=PK.u,fl=FB_G.fence+14,t1b=t1+0.6,t2=t1b+3.2,gy=gx+(gx>=sx?40:-40),
    w=tt<t1b?{x0:sx,x1:gx,t0,t1:t1b,floor:fb_path(sx,sf,gx,fl),h:fb_hG,phase:o&&o.phase||0,arms,before}:{x0:gx,x1:gy,t0:t1b,t1:t2,floor:fb_path(gx,fl,gy,FB_G.fence-70),h:fb_hG,phase:0.5,arms};
  const q=PK.walkAt(tt,w),a=U.clamp((q.floor-(FB_G.fence-60))/50,0,1);if(a<=0.004)return null;
  return PK.walk(x,who,tt,w,Object.assign({a},o||{}));}

/* ---------------------------------------------------------------- 1. Same people, another way: Fremont, 1982 to 1986 */
scene("nummi",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=FB_CAST;
  const tH=c.name-0.5,tG=c.harm-0.4,tR=c.reopen-0.5,tJ=c.japan-0.4,tT=c.teams-0.4,tQ=c.quality-0.5,tF=c.fell-0.4,tB=c.right-0.4,tS=c.same-0.5,tU=c.data-0.5;
  const shut=w("close","closes",-0.2),open=w("reopen","reopen",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // the plant's last day: people walk out with their things, the gate rolls shut behind them, and two who worked the line stand
    // by the fence, and watch it
    {at:0,place:"fbGate82",keys:[[0,960,540,1.0],[c.close-0.6,960,556,1.08]],d:3,draw:(x,tt,cam)=>{
      fb_gate(x,ag_in(tt,shut,3.4));
      PK.walk(x,PK.extra(21),tt,{x0:1150,x1:2060,t0:-3.4,t1:7.6,floor:fb_path(1150,676,2060,744),h:fb_hG,arms:{aN:[3,5,"grip"]}},{hold:fb_lunch([70,96,140]),expr:"neutral",gaze:[1,0.3]});
      const look=ag_in(tt,shut+0.4,0.8);
      PK.person(x,K.dale,1600,782,fb_hG(782),"stand",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"worry",gaze:[1,0.1]},[[1.4,"say",2.6],[5.0,"nod"],[shut+0.8,"look",4.4,[1,-0.05]],[shut+5.6,"nod"]])));
      PK.person(x,K.nita,1416,812,fb_hG(812),"listen",Object.assign({t:tt+1,flip:0.85*look},PK.face(tt,{expr:"worry",gaze:[1,0.12]},[[1.9,"nod"],[4.4,"say",2.0],[shut+4.6,"look",2.2,[1,0.4]]])));
      PK.walk(x,K.lupe,tt,{x0:860,x1:-190,t0:-2.4,t1:8.4,floor:fb_path(860,672,-190,852),h:fb_hG,arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4},then:"armful"},{hold:fb_box,expr:"worry",gaze:[1,0.3]});
      PK.walk(x,K.ray,tt,{x0:1000,x1:560,t0:0.6,t1:8.8,floor:fb_path(1000,668,560,902),h:fb_hG,arms:{aN:[3,5,"grip"]},then:"can"},
        Object.assign({hold:fb_lunch(),flip:1-ag_in(tt,9.4,0.7)*(1-ag_in(tt,-1,0.1))},PK.face(tt,{expr:"worry",gaze:[1,0.35]},[[0,"look",0.9,[-1,0.1]],[9.8,"look",3.4,[1,0]],[12.4,"nod"]])));}},
    // the plant's name: one of the worst in the country. Its hall, as it was: dim and worn, a car with its door missing and one with
    // a door of another colour, a station nobody came to, complaints piling up on the supervisor's desk, and a manager who blames
    // the workers
    {at:tH,cut:true,place:"fbHall82",keys:[[tH,960,540,1.0],[c.absent-0.3,1000,556,1.12],[w("absent","complaints",-0.5),1063,556,1.12],[c.cars-0.5,960,540,1.0],[c.blame-0.9,1063,540,1.12]],d:2,draw:(x,tt,cam)=>{
      for(const sx of [380,1060,1360])fb_station(x,sx);
      const cars=fb_line(x,fb_moved(tt),{cars:fb_cars82});fb_tool(x,1060,330,Math.sin(tt*0.9)*0.05);
      const D=fb_atCar(cars,380,tt,1),N=fb_atCar(cars,1360,tt,-1),tg=w("absent","complaints",0.1),tm=c.cars-0.6,tq=c.blame+0.2;
      PK.person(x,K.dale,380,800,fb_hH(800),"stand",Object.assign({t:tt,reachN:D.n,reachNk:D.k,reachF:D.f,reachFk:0.8*D.k},PK.face(tt,{expr:"worry",gaze:[1,0.5]},
        [[c.absent+1.4,"look",2.0,[-1,0.1]],[c.cars+0.8,"look",1.8,[1,0.25]],[tq+0.6,"look",2.2,[-1,0]]])));
      PK.person(x,K.nita,1360,812,fb_hH(812),"stand",Object.assign({t:tt+2,flip:true,reachN:N.n,reachNk:N.k,reachF:N.f,reachFk:0.8*N.k},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},
        [[c.absent+2.2,"look",2.2,[-1,0.1]],[c.cars+1.2,"worry",3.4],[tq+0.9,"look",2.0,[-1,0]]])));
      // the manager comes to the supervisor's desk; the supervisor takes Joe's complaint, reads it, and puts it on a pile
      const Jm=PK.walk(x,K.mgr,tt,{x0:-160,x1:1620,t0:tm,t1:tq,floor:842,h:fb_hH(842),then:"stand"},
        Object.assign({},PK.face(tt,{expr:"think",gaze:[1,0.1]},[[c.blame,"say",1.8],[tq+2.4,"nod"]])));
      const give=ag_io(tt,tg+0.3,tg+1.5,0.4),take=ag_in(tt,tg+0.7,0.4),got=tt>=tg+1.0,read=ag_in(tt,tg+1.4,0.6),put=ag_in(tt,c.cars+0.4,0.6),done=tt>=c.cars+1.0,back=ag_in(tt,c.cars+1.0,0.5),
        hand=[U.lerp(U.lerp(1672,1720,read),1660,put),U.lerp(U.lerp(604,596,read),574,put)];
      PK.person(x,K.boss,1800,846,fb_hH(846),"listen",Object.assign({t:tt,flip:true,underF:got&&!done?fb_form:null,holds:got&&!done,reachF:hand,reachFk:take*(1-back)},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},
        [[tg+0.2,"look",1.2,[1,0.15]],[tg+1.6,"think",3.0],[tq+0.2,"look",3.2,[1,-0.05]],[tq+0.8,"nods"]])));
      PK.S.begin(x,{lw:3,sh:4});const Dk=fb_desk(x,1780,880,fb_hH(880),3);if(done)fb_sheet(x,Dk.piles[1],1.2);
      // Joe brings one more complaint, and goes back to the line
      const j1={x0:-150,x1:1600,t0:c.name+0.4,t1:tg+0.3,floor:912,h:fb_hH(912),then:"stand"},j2={x0:1600,x1:-170,t0:tg+2.6,t1:tg+10.4,floor:912,h:fb_hH(912),before:"stand"};
      if(tt<j2.t0)PK.walk(x,K.joe,tt,j1,Object.assign({hold:got?null:fb_form,flip:ag_in(tt,tg+2.0,0.5),reachN:[1672,606],reachNk:give},PK.face(tt,{expr:"worry",gaze:[1,0.1]},[[tg+0.3,"say",1.0]])));
      else PK.walk(x,K.joe,tt,j2,{expr:"worry",gaze:[1,0.2]});
      fb_say(x,Jm,tt,c.blame,tG-0.3,["The problem is the workers."],cam);}},
    // what it meant: a family with a car that keeps going wrong; and Ray, at a gate that stays shut
    {at:tG,cut:true,place:"fbGate82",keys:[[tG,1063,560,1.12],[w("harm","For the workers",-0.6),857,560,1.12],[c.change-0.3,960,540,1.0]],d:2.2,draw:(x,tt,cam)=>{
      fb_gate(x,1);
      const L=2.6*fb_hG(784),car=fb_car(x,1500,784,L,{col:fb_c("cars",3),left:true,hood:1}),bon=car.bonnet,bent=ag_in(tt,tG+0.3,0.6);
      PK.person(x,K.son,880,846,0.68*fb_hG(846),"stand",Object.assign({t:tt},PK.face(tt,{expr:"neutral",gaze:[1,-0.3]},[[c.harm+1.6,"look",2.2,[1,-0.6]],[w("harm","For the workers",0.4),"look",3.2,[-1,0]]])));
      const Jy=PK.person(x,K.buyer,1010,820,fb_hG(820),PK.poseMix("stand","bend",bent),Object.assign({t:tt+2,reachN:[bon[0]-30,bon[1]+22],reachNk:bent,reachF:[bon[0]-70,bon[1]+30],reachFk:0.8*bent},
        PK.face(tt,{expr:"worry",gaze:[1,0.6]},[[c.harm+1.4,"say",1.2],[c.change+0.8,"look",2.6,[-1,0.1]]])));
      fb_say(x,Jy,tt,c.harm+1.3,w("harm","For the workers",-0.4),["Not again."],cam);
      const go=c.change+0.4;
      PK.walk(x,K.ray,tt,{x0:440,x1:-170,t0:go,t1:go+3.6,floor:900,h:fb_hG(900),before:"can",arms:{aN:[3,5,"grip"]}},
        Object.assign({hold:fb_lunch(),flip:ag_in(tt,go-0.5,0.5)},PK.face(tt,{expr:"worry",gaze:[1,0]},[[w("harm","For the workers",0.2),"look",2.6,[1,-0.15]],[w("harm","a name",0),"nod"],[go-1.2,"look",1.6,[1,0.4]]])));}},
    // 1984: the plant opens again, as NUMMI. Its people come back to the gate, in its new work jacket, and most of them know each
    // other: Ray finds Nita and Joe, Dale finds Lupe. Then they go in
    {at:tR,place:"fbGate84",later:true,keys:[[tR,960,540,1.0],[c.hire-0.4,960,560,1.08]],d:2.6,draw:(x,tt,cam)=>{
      fb_gate(x,1-ag_in(tt,open,2.6));const t0=tR,gi=c.hire+0.6,tD=t0+3.0,tA=open-0.6;
      const hi=ag_io(tt,tD+0.2,tD+1.5,0.3),lf=1-ag_in(tt,tD-0.9,0.5)*(1-ag_in(tt,gi+3.5,0.5)),lo=PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[tD+0.2,"glad",2.6],[tD+1.8,"say",1.6],[gi+1.2,"nod"]]);
      if(tt<gi+4.2)PK.person(x,fb84("lupe"),1440,760,fb_hG(760),PK.poseMix("stand","wave",hi),Object.assign({t:tt,flip:lf},lo));
      else fb_toGate(x,fb84("lupe"),tt,gi+4.2,gi+8.6,1440,760,1120,Object.assign({},lo));
      if(tt<gi+3.6)PK.walk(x,fb84("dale"),tt,{x0:2040,x1:1640,t0:t0+0.2,t1:tD,floor:792,h:fb_hG(792),then:"stand"},Object.assign({},PK.face(tt,{expr:"smile",gaze:[1,0]},[[tD,"glad",2.4],[tD+1.0,"say",1.4],[tD+3.4,"nods"]])));
      else fb_toGate(x,fb84("dale"),tt,gi+3.6,gi+8.4,1640,792,1040,{expr:"smile"});
      // Joe a step behind Nita; both turn to Ray as he comes
      const sees=ag_in(tt,tA-1.6,0.5);
      if(tt<gi)PK.person(x,fb84("joe"),1010,818,fb_hG(818),"stand",Object.assign({t:tt+2,flip:sees},PK.face(tt,{expr:"neutral",gaze:[1,0]},[[open+0.4,"look",1.8,[-1,-0.1]],[tA,"smile",Infinity],[tA+1.2,"say",1.2]])));
      else fb_toGate(x,fb84("joe"),tt,gi,gi+4.4,1010,818,1060,{expr:"smile"});
      const nf=PK.face(tt,{expr:"neutral",gaze:[1,0]},[[tA-1.0,"glad",3.0],[tA+0.2,"say",1.6],[c.hire+0.4,"nods"]]);
      if(tt<gi+0.8)PK.person(x,fb84("nita"),850,848,fb_hG(848),"clasp",Object.assign({t:tt+1,flip:sees*(1-ag_in(tt,gi+0.3,0.5))},nf));
      else fb_toGate(x,fb84("nita"),tt,gi+0.8,gi+5.2,850,848,960,nf,null,"clasp");
      const rf=PK.face(tt,{expr:"neutral",gaze:[1,0]},[[tA-0.4,"glad",Infinity],[tA+1.6,"say",1.4],[c.hire+1.2,"nod"]]);
      if(tt<gi+1.4)PK.walk(x,fb84("ray"),tt,{x0:-150,x1:630,t0:t0+0.3,t1:tA,floor:892,h:fb_hG(892),arms:{aN:[3,5,"grip"]},then:"can"},Object.assign({hold:fb_lunch()},rf));
      else fb_toGate(x,fb84("ray"),tt,gi+1.4,gi+6.4,630,892,880,Object.assign({hold:fb_lunch()},rf),{aN:[3,5,"grip"]});}},
    // groups from Fremont work for two weeks beside the people of a Toyota plant in Japan: one shows Ray how the door is done, then
    // steps back and Ray does it; Nita works beside another, and copies her. Only one pair of hands is on a car at a time
    {at:tJ,cut:true,place:"fbJapan",keys:[[tJ,960,540,1.0],[c.japan+1.4,900,560,1.1]],d:2.4,draw:(x,tt,cam)=>{
      const cars=fb_line(x,fb_moved(tt),{cars:fb_carJp,x0:-260}),sh=c.japan+0.8,tw=w("japan","work",0);
      const T1=fb_atCar(cars,800,tt,-1),Ry=fb_atCar(cars,500,tt,1),N=fb_atCar(cars,1380,tt,1),T2=fb_atCar(cars,1640,tt,1),show=1-ag_in(tt,tw-0.8,0.4),fit=ag_in(tt,tw,0.5);
      PK.person(x,fb84("ray"),500,806,fb_hH(806),PK.poseMix("listen","stand",fit),Object.assign({t:tt+1,reachN:Ry.n,reachNk:Ry.k*fit,reachF:Ry.f,reachFk:0.8*Ry.k*fit},
        PK.face(tt,{expr:"listen",gaze:[1,0.35]},[[sh+0.4,"nod"],[sh+2.0,"look",1.4,[1,0.1]],[w("japan","beside",0),"smile",3.0]])));
      PK.person(x,K.tk1,800,846,fb_hH(846),PK.poseMix("listen","stand",show),Object.assign({t:tt,flip:true,reachN:T1.n,reachNk:T1.k*show,reachF:T1.f,reachFk:0.8*T1.k*show},
        PK.face(tt,{expr:"smile",gaze:[1,0.45]},[[sh,"say",2.0],[tw-0.6,"look",2.8,[1,0.25]],[w("japan","beside",0.4),"nod"]])));
      PK.person(x,fb84("nita"),1380,812,fb_hH(812),"stand",Object.assign({t:tt+2,reachN:N.n,reachNk:N.k,reachF:N.f,reachFk:0.8*N.k},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},[[c.japan+2.2,"look",2.2,[1,0.1]],[w("japan","there",0),"smile",3.0]])));
      PK.person(x,K.tk2,1640,862,fb_hH(862),"stand",Object.assign({t:tt+3,reachN:T2.n,reachNk:T2.k,reachF:T2.f,reachFk:0.8*T2.k},PK.face(tt,{expr:"smile",gaze:[1,0.45]},[[c.japan+2.4,"look",2.4,[-1,0.2]],[c.japan+4.6,"nod"]])));}},
    // back in Fremont, in small teams: the team leader comes down the line and stops by Ray. Anyone can pull the cord: Joe does, a
    // lamp lights, and she comes; he steps aside and she works at his place, facing the way he did, so her hands are on the car
    // and never between two people. The problem isn't fixed in time, and the line stops
    {at:tT,cut:true,place:"fbHall84",keys:[[tT,960,540,1.0],[w("teams","small",-0.4),960,560,1.1],[c.cord-0.6,860,530,1.1]],d:2.2,draw:(x,tt,cam)=>{
      const stop=w("cord","the line stops",0.2),x0=900-fb_moved(stop+9,stop),cars=fb_line(x,fb_moved(tt,stop),{x0});
      const pull=w("cord","pull",-0.25),reach=ag_io(tt,pull,pull+1.6,0.35),pk=ag_io(tt,pull+0.45,pull+1.2,0.25),tl=c.teams+1.4,tl2=pull+0.8;
      fb_cord(x,[620,pk]);fb_lamps(x,1,ag_in(tt,pull+0.6,0.25));
      const l1={x0:1990,x1:1130,t0:tl,t1:tl+2.8,floor:fb_path(1990,866,1130,850),h:fb_hH,then:"stand"},l2={x0:1130,x1:600,t0:tl2,t1:tl2+2.2,floor:fb_path(1130,850,600,846),h:fb_hH,before:"stand",then:"stand"},
        J1={x0:520,x1:400,t0:l2.t1-1.1,t1:l2.t1-0.1,floor:800,h:fb_hH,before:"stand",then:"listen"},off=ag_in(tt,J1.t0-0.4,0.3),turn=ag_io(tt,l1.t1-0.4,l1.t1+2.6,0.5);
      const Jo=fb_atCar(cars,520,tt,1),Ry=fb_atCar(cars,940,tt,1),Ni=fb_atCar(cars,1640,tt,-1),L=fb_atCar(cars,600,tt,1),hj=fb_hands(Jo,fb_pullAt(620,pk),reach),
        help=ag_in(tt,l2.t1+0.3,0.5)*L.k;
      // Joe pulls the cord; when she comes, he steps aside for her and looks on
      PK.walk(x,fb84("joe"),tt,J1,Object.assign({flip:ag_in(tt,J1.t0-0.2,0.3)*(1-ag_in(tt,J1.t1-0.1,0.5))},hj,{reachNk:hj.reachNk*(1-off),reachFk:hj.reachFk*(1-off)},
        PK.face(tt,{expr:"neutral",gaze:[1,0.45-0.9*reach]},[[pull-0.4,"worry",stop+1.0-pull],[J1.t1+0.2,"look",Infinity,[1,0.4]],[stop+1.4,"relief",Infinity]])));
      // Ray at work; he turns to the team leader as she stops by him, then works on
      PK.person(x,fb84("ray"),940,812,fb_hH(812),"stand",Object.assign({t:tt+1,flip:0.85*turn,reachN:Ry.n,reachNk:Ry.k*(1-turn),reachF:Ry.f,reachFk:0.8*Ry.k*(1-turn)},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},
        [[l1.t1-0.4,"look",3.0,[1,0.05]],[l1.t1+0.2,"say",1.4],[l1.t1+2.4,"nods"],[pull+0.8,"look",2.2,[-1,-0.1]]])));
      PK.walk(x,fb84("lupe"),tt,tt<l2.t0?l1:l2,Object.assign({flip:tt<l2.t1-0.1?1:1-ag_in(tt,l2.t1-0.1,0.5),reachN:L.n,reachNk:help,reachF:L.f,reachFk:0.8*help},PK.face(tt,{expr:"listen",gaze:[1,0.1]},
        [[l1.t1+0.9,"nod"],[l1.t1+1.7,"say",1.0],[tl2-0.6,"look",1.4,[1,-0.1]],[l2.t1+0.4,"look",Infinity,[1,0.45]],[l2.t1+1.0,"say",1.2],[stop+1.2,"smile",3.0]])));
      // Nita, downstream, nearest us
      PK.person(x,fb84("nita"),1640,880,fb_hH(880),"stand",Object.assign({t:tt+2,flip:true,reachN:Ni.n,reachNk:Ni.k,reachF:Ni.f,reachFk:0.8*Ni.k},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},[[pull+0.9,"look",2.6,[-1,-0.2]],[stop+0.4,"nod"]])));}},
    // within two years: about as few faults as Toyota's cars built in Japan
    {at:tQ,place:"fbHall84",later:true,keys:[[tQ,960,540,1.0],[c.quality+1.0,1010,560,1.08]],d:2.6,draw:(x,tt,cam)=>{
      const cars=fb_line(x,fb_moved(tt),{x0:-300});fb_cord(x,null);
      const Jo=fb_atCar(cars,520,tt,1),Ry=fb_atCar(cars,940,tt,1);
      PK.person(x,fb84("joe"),520,800,fb_hH(800),"stand",Object.assign({t:tt,reachN:Jo.n,reachNk:Jo.k,reachF:Jo.f,reachFk:0.8*Jo.k},PK.face(tt,{expr:"neutral",gaze:[1,0.45]},[[c.quality+2.4,"smile",3.0]])));
      PK.person(x,fb84("ray"),940,812,fb_hH(812),"stand",Object.assign({t:tt+1,reachN:Ry.n,reachNk:Ry.k,reachF:Ry.f,reachFk:0.8*Ry.k},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},[[c.quality+1.4,"look",2.0,[1,0.1]],[c.quality+3.2,"smile",2.8]])));
      // the inspector at the end of the line looks each car over, and ticks it
      const tick=ag_io(tt,w("quality","faults",-0.4),w("quality","Toyota",0.4),0.4);
      PK.person(x,K.lead,1380,852,fb_hH(852),"stand",Object.assign({t:tt+2,flip:true,hold:fb_clip,holds:true,reachN:[1312,600],reachNk:0.7,reachF:[1290,620],reachFk:tick},
        PK.face(tt,{expr:"think",gaze:[1,0.35]},[[c.quality+0.4,"look",2.6,[1,0.1]],[c.quality+3.4,"nod"],[w("quality","Toyota",0.6),"smile",2.6]])));
      PK.person(x,fb84("nita"),1680,884,fb_hH(884),"listen",Object.assign({t:tt+3,flip:true},PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[c.quality+2.0,"look",2.0,[1,0.4]],[c.quality+4.4,"nod"]])));}},
    // absence and complaints fall steeply: the morning shift comes in, all of it
    {at:tF,cut:true,place:"fbGate84",keys:[[tF,960,540,1.0],[tF+0.3,960,556,1.06]],d:3,draw:(x,tt,cam)=>{
      fb_gate(x,0);const t0=tF;
      for(const [who,a,b,sx,sf,gx,ph] of [[fb_x84(31),-1.2,3.6,1500,742,1120,0.2],[fb_x84(33),0.4,6.0,240,770,800,0.6],[fb84("nita"),1.6,7.4,1820,820,1060,0.1],[fb_x84(36),2.8,8.6,-120,820,860,0.8],
          [fb84("joe"),4.2,9.8,1960,864,1000,0.3]])fb_toGate(x,who,tt,t0+a,t0+b,sx,sf,gx,{expr:"smile",phase:ph});
      // Ray and Dale come in together, talking
      const rd={x0:-140,x1:900,t0:t0-0.6,t1:t0+8.6,floor:fb_path(-140,902,900,700),h:fb_hG,arms:{aN:[3,5,"grip"]}};
      PK.walk(x,fb84("dale"),tt,Object.assign({},rd,{x0:-40,x1:980,floor:fb_path(-40,862,980,690),phase:0.5}),Object.assign({},PK.face(tt,{expr:"smile",gaze:[1,0]},[[t0+1.0,"look",2.0,[-1,0.1]],[t0+2.4,"say",1.4],[t0+5.6,"nod"]])));
      PK.walk(x,fb84("ray"),tt,rd,Object.assign({hold:fb_lunch(),flip:false},PK.face(tt,{expr:"smile",gaze:[1,0]},[[t0+0.8,"say",1.6],[t0+3.6,"nod"],[t0+5.0,"glad",2.4]])));}},
    // both were right about what they saw: the manager saw the absences; the worker saw a line that never stopped, and nobody to help
    {at:tB,cut:true,place:"fbHall82",keys:[[tB,1063,556,1.12],[w("right","Workers",-0.6),857,566,1.12],[w("right","Both",-0.4),960,540,1.0]],d:2.2,draw:(x,tt,cam)=>{
      for(const sx of [380,1060,1360])fb_station(x,sx);
      const cars=fb_line(x,fb_moved(tt),{cars:fb_cars82,x0:-180});fb_tool(x,1060,330,Math.sin(tt*0.9)*0.05);
      const D=fb_atCar(cars,380,tt,1),tb=w("right","Both",0),wr=ag_io(tt,c.right+0.3,w("right","Workers",-0.4),0.5);
      PK.person(x,K.mgr,1180,846,fb_hH(846),"stand",Object.assign({t:tt,flip:true,hold:fb_clip,holds:true,reachN:[1110,594],reachNk:0.7,reachF:[1090,612],reachFk:wr},
        PK.face(tt,{expr:"think",gaze:[1,0.35]},[[c.right+0.2,"look",2.4,[1,-0.1]],[c.right+2.8,"nod"],[tb+0.2,"look",Infinity,[1,0.05]]])));
      PK.person(x,K.dale,380,800,fb_hH(800),"stand",Object.assign({t:tt+1,reachN:D.n,reachNk:D.k,reachF:D.f,reachFk:0.8*D.k},PK.face(tt,{expr:"worry",gaze:[1,0.5]},
        [[w("right","nobody",-0.6),"look",1.4,[-1,0]],[w("right","nobody",0.9),"look",1.4,[1,-0.1]],[tb+0.3,"look",Infinity,[1,0.1]]])));}},
    // the same people, in another system, did some of the best work in the country
    {at:tS,place:"fbHall84",later:true,keys:[[tS,960,540,1.0],[c.same+0.6,860,566,1.1]],d:2.6,draw:(x,tt,cam)=>{
      const cars=fb_line(x,fb_moved(tt),{x0:-400});fb_cord(x,null);
      const D=fb_atCar(cars,380,tt,1),Ry=fb_atCar(cars,940,tt,1);
      PK.person(x,fb84("dale"),380,800,fb_hH(800),"stand",Object.assign({t:tt,reachN:D.n,reachNk:D.k,reachF:D.f,reachFk:0.8*D.k},PK.face(tt,{expr:"smile",gaze:[1,0.45]},
        [[c.same+1.0,"look",2.2,[1,0]],[c.same+1.6,"say",1.4],[c.same+3.6,"glad",2.2]])));
      PK.person(x,fb84("ray"),940,812,fb_hH(812),"stand",Object.assign({t:tt+1,reachN:Ry.n,reachNk:Ry.k,reachF:Ry.f,reachFk:0.8*Ry.k},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},[[c.same+2.0,"smile",3.0]])));
      PK.person(x,fb84("lupe"),680,880,fb_hH(880),"listen",Object.assign({t:tt+2,flip:true},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[c.same+2.4,"nods"],[c.same+3.4,"say",1.2]])));}},
    // the same in data work: Tomás at his desk, a year from now. What he was taught (the old warehouse's tool on his screen), what's
    // in his way (its reports, in binders by his elbow), and what he is asked to do (the team's board, its reports moving across)
    {at:tU,place:"fbTeam",dis:1.0,keys:[[tU,857,560,1.12],[c.around-0.2,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      fb_team(x,tt,{clock:9.1,notes:0.25,binders:1,show:fb_scrOld,tomas:Object.assign({work:1-0.8*ag_in(tt,c.around-0.3,0.6)},
        PK.face(tt,{expr:"think",gaze:[1,0.3]},[[w("around","taught",-0.3),"look",1.8,[1,0.2]],[w("around","way",-0.4),"look",2.0,[-1,0.55]],[w("around","asked",-0.3),"look",Infinity,[-1,-0.35]]]))});}}
  ]);
  fb_card(ctx,S,t,c.when-0.2,c.name-0.9,{kick:"California",title:"Fremont, 1982",sub:"General Motors' car plant"},{y:84});
  fb_card(ctx,S,t,c.absent+0.1,c.cars-0.6,{kick:"On a normal day",title:"One worker in five, absent",sub:"and complaints in the thousands",col:PK.C.amber},{y:84});
  fb_card(ctx,S,t,c.reopen+0.2,c.hire-0.6,{kick:"1984",title:"NUMMI",sub:"General Motors and Toyota, together"},{y:84});
  fb_card(ctx,S,t,c.hire+0.1,tJ-0.45,{kick:"NUMMI's new workers",title:"More than 8 in 10",sub:"the same people, hired back",col:PK.C.green},{y:84});
  fb_card(ctx,S,t,c.japan+0.2,tT-0.45,{kick:"1984",title:"A Toyota plant in Japan",sub:"Groups of 30, for two weeks"},{y:84});
  fb_card(ctx,S,t,c.quality+0.1,tF-0.45,{kick:"Within two years",title:"About as few faults",sub:"as Toyota's cars built in Japan",col:PK.C.green},{y:84});
  fb_card(ctx,S,t,w("fell","One study",-0.2),tB-0.45,{kick:"One study found",title:"Half as many workers again",sub:"the old way needed, for the same car",col:PK.C.amber},{y:84});
  fb_imagined(ctx,S,t,tU+0.8,c.breath-0.2);
  PK.title(ctx,S,t,c.breath+0.2,"When someone falls behind","Find the cause before you judge","Leading data people · Ownership and performance",{side:"right",size:58});
});

/* ---------------------------------------------------------------- the university: what its chapters share */
// Jun, pairing with Tomás: on a chair just behind his shoulder, turned to his screen (drawn before him: PK.seated)
const FB_PAIR={mode:"sit",lean:12,head:5,aN:[24,72],aF:[28,78],lN:[86,4],lF:[82,-4]};
const fb_pair=(cx,tt,o)=>PK.seated(cx,"jun",712,864,fb_hT(864),FB_PAIR,Object.assign({t:tt+3,flip:true},o||{}));
// Tomás at his desk, on the phone to someone who reads an old report: one hand at his ear, the other on the keys
const FB_PHONE={mode:"sit",lean:4,head:-3,aN:[38,166,"grip"],aF:[28,78],lN:[86,3],lF:[82,-5]};
// carrying a mug, and standing with it
const FB_MUG={lean:0,head:0,aN:[18,96,"grip"],aF:[4,14],lN:[-2,-2],lF:[5,4]};
// the team's room: the desk end where Tomás's binders stand, and where a hand meets someone at his right
const FB_TOP=FB_T.mid-0.43*FB_HT,FB_BIND=[FB_BINDX,FB_T.mid-0.43*FB_HT-17],FB_GIVE=[690,606];
// Tomás's face as chapter 1 leaves him: thinking, looking back at the board
const fb_back=tt=>PK.face(tt,{expr:"think",gaze:[1,0.3]},[[-2,"look",2.4,[-1,-0.35]]]);

/* ---------------------------------------------------------------- 2. Behind the team */
scene("behind",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,e=sc.ends;
  const tH=c.helena-0.5,tA=c.ask-0.8,q=fb_stickyAt(0.25),hA=fb_stickyHand(q.from),hB=fb_stickyHand(q.to),tTake=4.0,tPut=6.1,tG=25.2,tOff=e.days+0.8;
  ag_shots(ctx,S,t,sc.dur,[
    // the room chapter 1 ends in. Helena moves a report's note from the old warehouse's side of the board to the platform's; Sam
    // writes a report as code and Jun reviews it; Helena reads the team's days over Sam's shoulder, and goes. Graham comes by with a
    // printout, and Tomás knows who reads it. Then his own weeks, some kept pace and some went back
    {at:0,place:"fbTeam",keys:[[0,960,540,1.0],[c.code-0.6,1014,520,1.06],[c.days-0.6,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const W1={x0:2030,x1:720,t0:0.4,t1:3.4,floor:866,h:fb_hT,then:"stand"},W2={x0:720,x1:900,t0:4.6,t1:5.6,floor:866,h:fb_hT,before:"stand",then:"stand"},
        W3={x0:900,x1:1130,t0:7.4,t1:8.6,floor:866,h:fb_hT,before:"stand",then:"stand"},W4={x0:1130,x1:2040,t0:tOff,t1:tOff+2.3,floor:866,h:fb_hT,before:"stand"},
        wk=tt<W2.t0?W1:tt<W3.t0?W2:tt<W4.t0?W3:W4,held=tt>=tTake&&tt<tPut,xx=PK.walkAt(tt,wk).x,carry=[xx+52,590];
      let hand,hk;const dn1=ag_in(tt,tTake+0.1,0.4),up2=ag_in(tt,tPut-0.5,0.4);
      if(tt<tTake+0.1){hand=hA;hk=ag_in(tt,3.6,0.4);}else if(tt<tPut-0.5){hand=[U.lerp(hA[0],carry[0],dn1),U.lerp(hA[1],carry[1],dn1)];hk=1;}
      else{hand=[U.lerp(carry[0],hB[0],up2),U.lerp(carry[1],hB[1],up2)];hk=1-ag_in(tt,tPut+0.1,0.4);}
      const rev=w("code","reviewed",0.2),t41=w("days","41",-0.2),t24=w("days","24",0.2),p=ag_in(tt,t41,t24-t41),gk=w("tomas","who reads",-0.2);
      const G1={x0:2040,x1:828,t0:tG,t1:tG+2.3,floor:905,h:fb_hT,then:"stand"},G2={x0:828,x1:2040,t0:33.0,t1:35.4,floor:905,h:fb_hT,before:"stand"},
        turn=ag_io(tt,tG+2.0,33.2,0.5),wk2=ag_in(tt,c.less+0.2,0.6);
      const R=fb_team(x,tt,{clock:9.1,notes:tt<tPut?0.25:0.375,lift:held?0.5:null,binders:1,show:fb_scrOld,
        sam:Object.assign({work:1-0.5*ag_io(tt,rev+0.3,c.days+3.0,0.5)},PK.face(tt,{expr:"think",gaze:[1,0.2]},[[rev+0.4,"look",2.4,[1,0.05]],[rev+0.6,"smile",2.6],[c.days+0.8,"look",1.8,[-1,-0.1]],[t24,"smile",2.4]])),
        jun:Object.assign({work:1},PK.face(tt,{expr:"think",gaze:[1,0.25]},[[W3.t1+0.4,"look",1.8,[1,0.0]],[rev+0.6,"look",2.2,[1,0.05]],[rev+0.8,"smile",2.6],[tOff+0.3,"look",1.6,[1,-0.05]],
          [tG+0.4,"look",1.8,[-1,-0.05]],[w("tomas","who reads",0.2),"look",2.6,[1,0.0]],[31.0,"nod"],[c.less+1.4,"look",1.6,[1,0.1]],[c.less+5.6,"smile",1.8]])),
        tomas:Object.assign({work:Math.min(U.lerp(0.2,1,ag_in(tt,1.6,0.8)),1-turn),turn},PK.face(tt,{expr:"think",gaze:[1,0.3]},
          [[-2,"look",2.4,[-1,-0.35]],[tG+2.2,"look",8.0,[1,-0.05]],[gk+0.6,"say",2.4],[c.less+0.6,"neutral",2.6],[w("less","others",-0.2),"worry",Infinity]])),
        behind:cx=>{
          const Jh=PK.walk(cx,"helena",tt,wk,Object.assign({flip:tt<W1.t1+0.3?1-ag_in(tt,W1.t1-0.1,0.4):0,hold:held?fb_stickyHold(q.col):null,holds:held,reachN:hand,reachNk:hk},
            PK.face(tt,{expr:"smile",gaze:[1,-0.45]},[[7.0,"look",1.6,[1,0.2]],[W3.t1,"look",12.6,[1,0.45]],[rev+0.2,"nod"],[t24-0.2,"glad",2.6]])));},
        front:cx=>{if(tt<tG-0.1||tt>G2.t1)return;
          const Jg=PK.walk(cx,"graham",tt,tt<G2.t0?G1:G2,Object.assign({hold:fb_print,holds:true,reachN:[790,640],reachNk:ag_io(tt,G1.t1-0.2,G2.t0,0.4)},
            PK.face(tt,{expr:"neutral",gaze:[1,0.15]},[[G1.t1+0.3,"say",2.2],[31.2,"nod"],[31.6,"smile",1.6]])));
          fb_say(cx,Jg,tt,G1.t1+0.2,30.0,["Who else reads this one?"],cam);}});
      fb_say(x,R.tomas,tt,30.1,32.8,["Mei's team, every Monday."],cam,{dx:-250});
      PK.nameTag(x,R.tomas.hc[0],R.tomas.hc[1]-150,"Tomás Ortega","Report developer",ag_io(tt,w("tomas","Tomás",-0.2),G1.t1-0.6,0.4));
      // a review, from Jun's laptop; the team's days, from Sam's; Tomás's weeks, from his screen
      PK.callout(x,1330,262,520,104,[1640,540],ag_io(tt,rev-0.1,c.days-0.6,0.4),(cc,bx,by,bw,bh)=>fb_reviewCard(cc,bx,by,bw,bh,true,ag_in(tt,rev,0.4)));
      PK.callout(x,1290,80,560,300,[1400,540],ag_io(tt,c.days-0.1,e.days+0.2,0.4),(cc,bx,by,bw,bh)=>fb_daysCard(cc,bx,by,bw,bh,p));
      PK.callout(x,40,150,520,250,[205,474],ag_io(tt,c.less+0.3,tH-0.2,0.4),(cc,bx,by,bw,bh)=>fb_weeksCard(cc,bx,by,bw,bh,ag_in(tt,w("less","some weeks",-0.2),w("less","changes",0.3)-w("less","some weeks",-0.2))));}},
    // Helena, at her round table, first reads the team as a whole: its shared work is going well, and one person's is behind it
    {at:tH,cut:true,place:"fbCorner",keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=fb_corner(x,tt,{tomas:null,laptop:1,type:1-0.6*ag_in(tt,c.shared-0.2,0.6),t0:tH,
        hf:PK.face(tt,{expr:"think",gaze:[1,0.65]},[[w("helena","first read",0),"nod"],[w("shared","going well",0),"smile",1.4],[w("shared","falling behind",0),"worry",Infinity]])});
      PK.nameTag(x,R.helena.hc[0],R.helena.hc[1]-150,"Helena Novak","Data manager",ag_io(tt,w("helena","Helena",-0.2),w("helena","as The team",-0.4),0.4));
      PK.callout(x,1200,80,640,400,R.laptop,ag_io(tt,c.shared-0.3,tA-0.2,0.4),(cc,bx,by,bw,bh)=>fb_gapCard(cc,bx,by,bw,bh,{name:"One person",to:"june",
        team:[ag_in(tt,w("shared","shared",-0.2),0.4),ag_in(tt,w("shared","going well",-0.2),0.8)],tom:[ag_in(tt,w("shared","One person's",-0.2),0.4),ag_in(tt,w("shared","One person's",0.2),0.8)],
        gap:ag_in(tt,w("shared","falling behind",0),0.6)}));}},
    // before she judges, she asks: she comes to his desk
    {at:tA,cut:true,place:"fbTeam",keys:[[tA,960,540,1.0],[tA+1.0,760,580,1.12]],d:2.2,draw:(x,tt,cam)=>{
      const turn=ag_in(tt,tA+2.0,0.5),W={x0:2040,x1:790,t0:tA,t1:tA+2.6,floor:905,h:fb_hT,then:"stand"};let Jh=null;
      const R=fb_team(x,tt,{clock:11.2,notes:0.375,binders:1,show:fb_scrOld,
        tomas:Object.assign({work:1-turn,turn},PK.face(tt,{expr:"neutral",gaze:[1,0.3]},[[tA+2.2,"look",Infinity,[1,-0.05]],[tA+2.9,"listen",1.6],[tA+4.6,"smile",Infinity]])),
        front:cx=>{Jh=PK.walk(cx,"helena",tt,W,PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[W.t1+0.1,"say",1.8],[tA+4.8,"nod"]]));}});
      fb_say(x,Jh,tt,W.t1+0.1,tA+4.4,["Can we talk on Wednesday?"],cam);
      fb_say(x,R.tomas,tt,tA+4.6,1e9,["Of course."],cam,{dx:-70});}}
  ]);
  fb_card(ctx,S,t,w("move","the data team",-0.3),c.code-0.5,{kick:"The data team",title:"Moving the reports",sub:"off the old warehouse",col:PK.C.blue});
  fb_card(ctx,S,t,w("helena","as The team",-0.3),c.shared-0.6,{kick:"An earlier film",title:"The team comes first",col:PK.C.blue},{right:true});
  fb_imagined(ctx,S,t,0.2,7.5);fb_kick(ctx,S,ag_in(t,1.0,0.6)*(1-Math.max(ag_io(t,c.less+0.1,tH-0.05,0.3),ag_in(t,tA+2.2,0.3))));
});

/* ---------------------------------------------------------------- 3. Find the cause */
scene("cause",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,e=sc.ends;
  const tM=c.mager-0.4,tG=c.gilbert-0.4,tI=w("gilbert","information",-0.6),tW=c.wed-0.4,tL=c.learned-0.4,tP=c.pair-0.6,tTh=w("pair","Thursday",-0.5),
    tF=c.fit-0.4,tR=c.readers-0.4,tH=c.hard-0.4,tS=w("patience","For two months",-0.4),tC=c.cord-0.4,tX=w("cord","Helena's part",-0.6),tB=c.safe-0.4;
  const BA=PK.pace(ctx,"carmen",fb_boardA(sc,w)),BB=PK.pace(ctx,"carmen",fb_boardB(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // that week, a seminar for the university's managers: Carmen Vidal, by the board, with two old books on the table
    {at:0,place:"fbSeminar",keys:[[0,960,540,1.0],[0.4,900,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const R=fb_session(x,tt,{rows:BA,say:[[c.books,e.books+0.3]],events:[[0.4,"smile",2.4]]});
      PK.nameTag(x,R.carmen.hc[0],R.carmen.hc[1]-150,"Carmen Vidal","Consultant",ag_io(tt,0.6,tM-0.3,0.4));}},
    // the board, close enough to read: Mager and Pipe's question
    {at:tM,cut:true,place:"fbBoard",keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.mager,e.mager]]});}},
    // the room: Helena writes it down as Carmen starts on Gilbert
    {at:tG,cut:true,place:"fbSeminar",keys:[[tG,900,560,1.06]],d:2,draw:(x,tt,cam)=>{
      fb_session(x,tt,{rows:BA,say:[[c.gilbert,e.gilbert]],note:ag_io(tt,tG+0.3,tI-0.1,0.5),m1:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[tG+1.2,"nod"]])});}},
    // the board: what surrounds the work
    {at:tI,cut:true,place:"fbBoard",keys:[[tI,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.gilbert,e.gilbert]]});}},
    // Wednesday 26 May, at her round table: she asks what's in his way, and he says
    {at:tW,cut:true,place:"fbCorner",keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const ask=w("wed","Helena asks",0.1),up=ag_in(tt,ask+0.6,0.7);
      const R=fb_corner(x,tt,{lean:ag_io(tt,ask-0.3,c.skill+0.8,0.6),ask:ag_io(tt,ask,c.skill+0.4,0.5),up,t0:tW,
        hf:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[ask,"say",2.2],[w("skill","nobody",0.4),"nod"],[w("skill","nobody",0.6),"think",3.0]]),
        tf:PK.face(tt,{expr:"neutral",gaze:[1,U.lerp(0.9,-0.1,up)]},[[w("skill","The tools",-0.2),"say",2.2]])});
      fb_say(x,R.helena,tt,ask+0.1,c.skill+0.5,["What's getting in your way?"],cam);
      fb_say(x,R.tomas,tt,w("skill","The tools",-0.3),tL-0.3,["Nobody taught me the new tools."],cam);}},
    // the others learned by doing, together; Tomás kept the old reports running, on the phone to someone who reads one
    {at:tL,cut:true,place:"fbTeam",keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const ph=ag_io(tt,tL+0.5,tP-0.9,0.5);
      fb_team(x,tt,{clock:10.4,notes:0.5,binders:1,show:fb_scrOld,
        sam:PK.face(tt,{expr:"think",gaze:[1,0.2]},[[tL+0.8,"look",2.4,[1,0.05]],[tL+1.2,"say",1.6],[tL+3.4,"smile",2.0]]),
        jun:Object.assign({work:U.lerp(1,0.4,ag_io(tt,tL+0.6,tL+4.0,0.5))},PK.face(tt,{expr:"listen",gaze:[1,0.1]},[[tL+0.9,"look",3.0,[1,0.05]],[tL+2.8,"nod"],[tL+3.6,"smile",1.6]])),
        tomas:Object.assign({work:1-ph,pose:FB_PHONE,hold:ph>0.5?PK.inHand.phone({}):null,holds:ph>0.5},PK.face(tt,{expr:"neutral",gaze:[1,0.35]},[[tL+1.0,"say",1.4],[tL+2.8,"nod"],[tL+3.6,"say",1.2]]))});}},
    // twice a week, he pairs with Jun
    {at:tP,place:"fbTeam",later:true,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      let Jj=null;fb_team(x,tt,{clock:14.2,notes:0.5,binders:1,show:fb_scrCode(ag_in(tt,tP+0.6,2.4)),jun:null,
        behind:cx=>{Jj=fb_pair(cx,tt,PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[tP+1.0,"say",1.4],[tP+2.4,"nod"]]));},
        tomas:Object.assign({work:1},PK.face(tt,{expr:"think",gaze:[1,0.3]},[[tP+1.6,"nod"],[tP+2.2,"smile",1.6]]))});
      PK.nameTag(x,Jj.hc[0],Jj.hc[1]-150,"Jun Park","Analytics engineer",ag_io(tt,w("pair","Jun",-0.2),tTh-0.3,0.4));}},
    // Thursdays: his learning time, kept clear. He'd been giving it up to clear his list
    {at:tTh,place:"fbTeam",later:true,keys:[[tTh,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      fb_team(x,tt,{clock:15.0,notes:0.5,binders:1,show:fb_scrLesson(ag_in(tt,tTh+0.4,6.0)),
        sam:{work:1},jun:{work:1},tomas:Object.assign({work:0.15},PK.face(tt,{expr:"listen",gaze:[1,0.35]},[[w("pair","giving it up",-0.2),"look",1.8,[1,0.75]],[w("pair","his list",0.4),"smile",2.4]]))});}},
    // the second cause: fit for the role. His strength is the people who read the reports
    {at:tF,cut:true,place:"fbCorner",keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const sp=w("fit","His strength",-0.1),R=fb_corner(x,tt,{lean:ag_io(tt,sp-0.4,tR-0.6,0.6),up:1,t0:tF,
        hf:PK.face(tt,{expr:"smile",gaze:[1,0.15]},[[sp,"say",2.6]]),tf:PK.face(tt,{expr:"neutral",gaze:[1,-0.1]},[[w("fit","more than",0),"glad",Infinity],[w("fit","behind them",0.2),"nod"]])});
      fb_say(x,R.helena,tt,sp,tR-0.3,["You're best with the people","who read them."],cam,{dx:90});}},
    // so the readers' release notes and their training become his: he trains them, Graham and Mei among them
    {at:tR,cut:true,place:"fbRoom",keys:[[tR,960,540,1.0],[tR+0.4,1060,560,1.06]],d:3,draw:(x,tt,cam)=>{fb_training(x,tt,{n:7});}},
    // June, at her round table: he tells her he's having a hard time at home. What he says stays between them
    {at:tH,cut:true,place:"fbCorner",keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const tk=w("patience","That's a good",0),R=fb_corner(x,tt,{lean:ag_io(tt,tk-0.2,tS-0.2,0.6),up:ag_io(tt,c.hard+0.2,c.hard+3.6,0.6),t0:tH,
        hf:PK.face(tt,{expr:"listen",gaze:[1,0.15]},[[c.hard+1.4,"worry",2.6],[w("hard","Nobody",0),"nod"],[c.patience+0.4,"say",2.0],[c.patience+0.4,"smile",Infinity]]),
        tf:PK.face(tt,{expr:"worry",gaze:[1,0.4]},[[c.hard+0.4,"say",3.0],[c.patience+2.0,"relief",Infinity]])});
      fb_say(x,R.helena,tt,c.patience+0.3,tS-0.2,["Take the time you need."],cam);}},
    // for two months his load is lighter: Sam takes a report off him, and nobody asks for more
    {at:tS,cut:true,place:"fbTeam",keys:[[tS,960,540,1.0],[tS+0.5,820,570,1.1]],d:2.2,draw:(x,tt,cam)=>{
      const tA=tS+1.6,tGv=tA+1.0,turn=ag_io(tt,tA-0.4,tC-0.6,0.5),gave=tt>=tGv,W1={x0:1240,x1:780,t0:tS,t1:tA,floor:fb_path(1240,860,780,905),h:fb_hT,before:"stand",then:"stand"},
        W2={x0:780,x1:2040,t0:tGv+1.3,t1:tGv+4.0,floor:905,h:fb_hT,before:"stand"},give=ag_io(tt,tGv-0.6,tGv+0.3,0.3);let Js=null;
      const R=fb_team(x,tt,{clock:11.6,notes:0.625,binders:1,sam:null,show:fb_scrOld,
        tomas:Object.assign({turn,work:0,hold:gave?null:fb_print,holds:!gave,reachN:[U.lerp(470,FB_GIVE[0],turn),U.lerp(600,FB_GIVE[1]+10,turn)],reachNk:gave?1-ag_in(tt,tGv,0.4):1},
          PK.face(tt,{expr:"think",gaze:[1,0.5]},[[tA-0.3,"look",Infinity,[1,-0.05]],[tA+0.9,"relief",Infinity],[tGv+0.6,"nod"]])),
        front:cx=>{Js=PK.walk(cx,"sam",tt,tt<W2.t0?W1:W2,Object.assign({flip:tt<W2.t0?1-ag_in(tt,tGv+0.8,0.4):0,hold:gave?fb_print:null,holds:gave,reachN:[FB_GIVE[0]+16,FB_GIVE[1]+12],reachNk:Math.max(give,gave?1-ag_in(tt,W2.t0-0.4,0.4):0)},
          PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[tA+0.1,"say",1.6]])));}});
      fb_say(x,Js,tt,tA,tGv+0.5,["I'll take this one."],cam);}},
    // at NUMMI, pulling the cord brought help, not blame
    {at:tC,cut:true,place:"fbHall84",keys:[[tC,900,540,1.06]],d:2,draw:(x,tt,cam)=>{
      const pull=w("cord","pulling",0),reach=ag_io(tt,pull-0.2,pull+1.4,0.35),pk=ag_io(tt,pull+0.25,pull+1.0,0.25),cars=fb_line(x,fb_moved(tt),{x0:760-fb_moved(tC)});
      fb_cord(x,[620,pk]);fb_lamps(x,1,ag_in(tt,pull+0.4,0.25));
      const Jo=fb_atCar(cars,520,tt,1),Ry=fb_atCar(cars,940,tt,1),Ni=fb_atCar(cars,1640,tt,-1),hj=fb_hands(Jo,fb_pullAt(620,pk),reach),L={x0:1300,x1:720,t0:pull+0.8,t1:pull+3.2,floor:fb_path(1300,850,720,846),h:fb_hH,before:"stand"};
      PK.person(x,fb84("joe"),520,800,fb_hH(800),"stand",Object.assign({t:tt},hj,PK.face(tt,{expr:"worry",gaze:[1,0.45-0.9*reach]},[[pull+1.4,"look",Infinity,[1,0.05]]])));
      PK.person(x,fb84("ray"),940,812,fb_hH(812),"stand",Object.assign({t:tt+1,reachN:Ry.n,reachNk:Ry.k,reachF:Ry.f,reachFk:0.8*Ry.k},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},[[pull+0.6,"look",2.0,[-1,-0.1]]])));
      PK.walk(x,fb84("lupe"),tt,L,Object.assign({flip:1},PK.face(tt,{expr:"listen",gaze:[1,0.1]},[[pull+0.4,"look",Infinity,[1,-0.2]]])));
      PK.person(x,fb84("nita"),1640,880,fb_hH(880),"stand",Object.assign({t:tt+2,flip:true,reachN:Ni.n,reachNk:Ni.k,reachF:Ni.f,reachFk:0.8*Ni.k},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},[])));}},
    // Helena's part is the same: clear what's in the way. She comes for the old warehouse's reports, and he hands them over
    {at:tX,cut:true,place:"fbTeam",keys:[[tX,960,540,1.0],[tX+0.3,820,580,1.1]],d:2.4,draw:(x,tt,cam)=>{
      const tA=tX+1.4,tR0=tA+0.1,tLift=tR0+0.6,tTurn=tLift+0.1,tGv=tTurn+0.8,tGo=tB+5,reach=ag_in(tt,tR0,0.5),turn=ag_in(tt,tTurn,0.6),gave=tt>=tGv,
        W1={x0:1460,x1:800,t0:tX-0.4,t1:tA,floor:905,h:fb_hT,then:PK.poseMix("stand","armful",ag_in(tt,tGv,0.4))},
        W2={x0:800,x1:2040,t0:tGo,t1:tGo+3.0,floor:905,h:fb_hT,before:"armful",arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4}};
      fb_team(x,tt,{clock:16.2,notes:0.625,binders:tt<tLift?1:0,show:fb_scrOld,
        tomas:Object.assign({turn,work:1-reach,reachN:[U.lerp(FB_BIND[0],FB_GIVE[0],turn),U.lerp(FB_BIND[1],FB_GIVE[1],turn)],reachNk:gave?1-ag_in(tt,tGv,0.4):reach,
          hold:tt>=tLift&&!gave?fb_bindersHold:null,holds:tt>=tLift&&!gave},PK.face(tt,{expr:"neutral",gaze:[1,0.4]},[[tA-0.4,"look",1.0,[-1,-0.1]],[tTurn+0.4,"look",Infinity,[1,-0.05]],[tGv,"relief",Infinity]])),
        front:cx=>{const hk=gave?1-ag_in(tt,tGv,0.45):ag_in(tt,tGv-0.6,0.4);PK.walk(cx,"helena",tt,tt<W2.t0?W1:W2,Object.assign({flip:tt<W2.t0?1-ag_in(tt,tGo-0.4,0.4):0,hold:gave?fb_bindersArms:null,holds:gave,
          reachN:[FB_GIVE[0]+40,FB_GIVE[1]],reachNk:hk,reachF:[FB_GIVE[0]-40,FB_GIVE[1]+4],reachFk:hk},PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[tA,"say",1.2],[tGv+0.2,"nod"]])));}});}},
    // why people say what's wrong: the board
    {at:tB,cut:true,place:"fbBoard",keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.safe,e.safe]]});}}
  ]);
  fb_card(ctx,S,t,0.8,tM-0.4,{kick:"That week",title:"A seminar for managers",col:PK.C.blue});
  fb_card(ctx,S,t,c.wed+0.2,w("wed","Helena asks",-0.4),{kick:"Wednesday 26 May",title:"Tomás's one-to-one",col:PK.C.blue});
  fb_card(ctx,S,t,tTh+0.6,tF-0.5,{kick:"Thursdays",title:"His learning time, kept clear",col:PK.C.green});
  fb_card(ctx,S,t,c.hard+0.2,c.hard+3.6,{kick:"June",title:"Tomás's one-to-one",col:PK.C.blue});
  fb_kick(ctx,S,ag_in(t,0.8,0.6)*(1-fb_apart(t,[[tM,tG],[tI,tW],[tS+1.6,tS+3.8],[tB,1e9]])));
});

/* ---------------------------------------------------------------- 4. Against the team's own change */
scene("gap",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,e=sc.ends;
  const tF=c.feb-0.4,tO=c.own-0.4,tT=w("own","Helena",-0.1),tN=c.plan-0.4,tE=e.plan+1.6;
  const BC=PK.pace(ctx,"carmen",fb_boardC(sc,w)),NP=PK.pace(ctx,null,fb_plan(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the board: how far behind
    {at:0,place:"fbBoard",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.far,e.far]]});}},
    // at her table, the numbers: February, then June, and the gap
    {at:tF,cut:true,place:"fbCorner",keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=fb_corner(x,tt,{tomas:null,laptop:1,type:0.4+0.3*ag_io(tt,c.own-6.0,c.own-1.6,0.6),t0:tF,hf:PK.face(tt,{expr:"think",gaze:[1,0.65]},[[w("feb","40",0.1),"nod"],[w("feb","41",0.2),"look",1.6,[1,0.5]],
        [w("june","24",0.2),"smile",1.8],[w("june","35",0.3),"worry",2.6],[w("faster","He had",0),"nod"],[w("faster","because",0),"look",2.0,[1,0.4]],[e.faster+0.6,"think",2.4]])});
      PK.callout(x,1200,80,640,400,R.laptop,ag_io(tt,c.feb+0.3,tO-0.2,0.4),(cc,bx,by,bw,bh)=>fb_gapCard(cc,bx,by,bw,bh,{to:"june",
        tom:[ag_in(tt,w("feb","40",-0.1),0.4),ag_in(tt,w("june","35",-0.1),0.7)],team:[ag_in(tt,w("feb","41",-0.1),0.4),ag_in(tt,w("june","24",-0.1),0.7)],gap:ag_in(tt,w("faster","faster",-0.1),0.6)}));}},
    // the board: against the team's own change, never against a colleague
    {at:tO,cut:true,place:"fbBoard",keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.own,e.own]]});}},
    // it stays between him and Helena; he starts his own plan
    {at:tT,cut:true,place:"fbCorner",keys:[[tT,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const wr=ag_in(tt,tN-1.2,0.6);
      fb_corner(x,tt,{up:1-wr,write:wr,t0:tT,hf:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[tT+0.6,"say",1.4],[tN-1.4,"look",Infinity,[1,0.5]]]),
        tf:Object.assign(PK.face(tt,{expr:"neutral"},[[tT+1.6,"nod"],[tT+2.2,"smile",Infinity]]),{gaze:[1,U.lerp(-0.1,0.9,wr)]})});}},
    // his plan, in his hand
    {at:tN,place:"fbNotesT",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"tomas",tt,NP,{});}},
    // Helena agrees it; they'll read it together, every first Wednesday
    {at:tE,place:"fbCorner",dis:0.6,keys:[[tE,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const rd=ag_in(tt,tE+0.3,0.8),R=fb_corner(x,tt,{write:0,book:1,read:rd,up:1,t0:tE,
        hf:PK.face(tt,{expr:"smile"},[[tE+0.5,"say",0.8],[tE+1.4,"nod"]]),tf:PK.face(tt,{expr:"glad"},[[tE+1.6,"nod"]])});
      fb_say(x,R.helena,tt,tE+0.4,c.month+0.6,["Agreed."],cam);}}
  ]);
  fb_card(ctx,S,t,c.month+0.2,sc.dur,{kick:"Every first Wednesday",title:"Reading the plan together",col:PK.C.blue},{right:true,y:84});
  fb_kick(ctx,S,1-fb_apart(t,[[-1,tF],[tO,tT],[tN,tE]]));
});

/* ---------------------------------------------------------------- 5. Give it time */
scene("time",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,e=sc.ends;
  const tO=w("uneven","In October",-0.2),j1=w("uneven","goes back",-0.2),j2=w("uneven","twice",-0.1),ta=e.uneven+1.6,tC=ta+0.3,tb=c.dec-1.6,tD=c.dec-0.4,tH=c.honest-0.5,tY=c.years-0.4;
  const N1=PK.pace(ctx,null,fb_note1(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // September: he pairs with Jun, and a review comes back approved
    {at:0,place:"fbTeam",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const ok=w("uneven","September",-0.4);
      fb_team(x,tt,{clock:10.0,notes:0.75,binders:0,show:fb_scrCode(ag_in(tt,0.4,2.4)),jun:null,
        behind:cx=>{fb_pair(cx,tt,PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[ok+0.3,"glad",2.0],[ok+0.5,"nod"]]));},
        tomas:Object.assign({work:1-0.6*ag_in(tt,ok+0.2,0.5)},PK.face(tt,{expr:"think",gaze:[1,0.3]},[[ok+0.3,"glad",Infinity]]))});
      PK.callout(x,40,290,520,104,[205,474],ag_io(tt,ok,tO-0.2,0.4),(cc,bx,by,bw,bh)=>fb_reviewCard(cc,bx,by,bw,bh,true,ag_in(tt,ok+0.1,0.4)));}},
    // October: Jun sends a report back twice, from wherever she is, and he answers
    {at:tO,place:"fbTeam",later:true,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const CH=fb_chat(j1,j2,ta),cs=PK.chatSize(x,CH,{size:28}),on=ag_in(tt,j1-0.5,0.4),sent=[j1,j2,ta].filter(q=>tt>=q).length;
      fb_team(x,tt,{clock:15.2,notes:0.875,binders:0,jun:null,
        show:(cc,sx,sy,sw,sh)=>{fb_scrCode(1)(cc,sx,sy,sw,sh);if(on>0.004){cc.save();cc.globalAlpha*=on;PK.onScreen.chat(sent/3,{rows:[[0.44,0.5,1],[0.52,0.42,1],[0.4,0.54,1]]})(cc,sx,sy,sw,sh);cc.restore();}},
        tomas:Object.assign({work:U.lerp(0.4,1,ag_in(tt,ta-1.6,0.5))},PK.face(tt,{expr:"neutral",gaze:[1,0.3]},[[j1+0.3,"worry",Infinity],[ta-0.2,"relief",Infinity]]))});
      PK.callout(x,20,458-cs.h,cs.w,cs.h,[205,474],on,(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}},
    // on the campus, Jun reads his answer on her phone, and answers
    {at:tC,cut:true,place:"fbCampus",keys:[[tC,900,570,1.1]],d:2,draw:(x,tt,cam)=>{
      const CH2=fb_chat2(tb),cs=PK.chatSize(x,CH2,{}),hc=PK.hAt(FB_CA.near,FB_CA.eye);
      PK.walk(x,PK.extra(16),tt,{x0:2040,x1:-140,t0:tC-3.0,t1:tC+13.0,floor:720,h:PK.hAt(720,FB_CA.eye)},{shade:0});
      const Jj=PK.person(x,"jun",1010,FB_CA.near,hc,"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone({back:true}),holds:true},PK.face(tt,{expr:PK.exprMix("think","smile",ag_in(tt,tb-0.9,0.6)),gaze:[1,0.9]},[])));
      PK.callout(x,300,250,cs.w,cs.h,[Jj.hdN[0]-20,Jj.hdN[1]-30],ag_in(tt,tC+0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH2,tt,{}));}},
    // December, at her table in the evening: the team at 14 days, Tomás at 20; the gap has closed by about half
    {at:tD,cut:true,place:"fbCornerDec",keys:[[tD,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=fb_corner(x,tt,{dec:true,tomas:null,laptop:1,type:0.4,t0:tD,hf:PK.face(tt,{expr:"think",gaze:[1,0.65]},[[w("dec","closed",0.2),"smile",Infinity]])});
      PK.callout(x,1200,80,640,400,R.laptop,ag_io(tt,c.dec+0.2,tH-0.2,0.4),(cc,bx,by,bw,bh)=>fb_gapCard(cc,bx,by,bw,bh,{to:"dec",
        tom:[1,1,ag_in(tt,w("dec","20",-0.1),0.7)],team:[1,1,ag_in(tt,w("dec","14",-0.1),0.7)],gap:ag_in(tt,w("dec","closed",-0.1),0.6)}));}},
    // Wednesday 15 December: she says it plainly, and he hears it now
    {at:tH,place:"fbCornerDec",later:true,keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const s1=w("honest","plainly",-0.1),s2=w("role","stops",-0.2),s3=w("role","He hears",-0.2),R=fb_corner(x,tt,{dec:true,lean:ag_io(tt,s1-0.3,s3,0.6),up:1,t0:tH,
        hf:PK.face(tt,{expr:"smile",gaze:[1,0.15]},[[s1,"say",2.2],[s2,"say",3.4],[s3+0.6,"nod"]]),
        tf:PK.face(tt,{expr:"listen",gaze:[1,-0.1]},[[s1+1.0,"nod"],[s2+1.6,"think",2.4],[s3,"say",2.0],[s3,"smile",Infinity]])});
      fb_say(x,R.helena,tt,s1,c.role-0.3,["Your plan goes on into 2028."],cam);
      fb_say(x,R.helena,tt,s2,s3-0.2,["If another role fits you better,","we'll talk about it."],cam,{dx:90});
      fb_say(x,R.tomas,tt,s3,tY-0.2,["Thank you for saying it now."],cam);}},
    // what she keeps, in her notebook
    {at:tY,place:"fbNotesH",dis:0.6,keys:[[tY,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N1,{});}}
  ]);
  fb_card(ctx,S,t,0.6,tO-0.4,{kick:"September",title:"Pairing with Jun",col:PK.C.green},{right:true});
  fb_card(ctx,S,t,tO+0.6,tC-0.3,{kick:"October",title:"A report goes back",col:PK.C.amber},{right:true});
  fb_card(ctx,S,t,c.honest+0.2,c.role-0.4,{kick:"Wednesday 15 December",title:"Tomás's one-to-one",col:PK.C.blue},{right:true});
  fb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-Math.max(ag_io(t,j1-0.9,tC-0.05,0.3),fb_apart(t,[[tY,1e9]]))));
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,e=sc.ends;
  const t84=w("back","What surrounded",-0.5),tH=c.helena-0.4,tN=c.team-0.8,tP=c.plan-0.4,tE=e.plan+0.9,tE2=c.breath+0.6;
  const N2=PK.pace(ctx,null,fb_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // at NUMMI, the people didn't change first: Dale, alone at the line in 1982 ...
    {at:0,place:"fbHall82",keys:[[0,1000,556,1.08]],d:2,draw:(x,tt,cam)=>{
      for(const sx of [380,1060,1360])fb_station(x,sx);
      const cars=fb_line(x,fb_moved(tt),{cars:fb_cars82,x0:-240});fb_tool(x,1060,330,Math.sin(tt*0.9)*0.05);const D=fb_atCar(cars,380,tt,1);
      PK.person(x,FB_CAST.dale,380,800,fb_hH(800),"stand",Object.assign({t:tt,reachN:D.n,reachNk:D.k,reachF:D.f,reachFk:0.8*D.k},PK.face(tt,{expr:"worry",gaze:[1,0.5]},[[1.0,"look",1.4,[-1,0]]])));}},
    // ... and in 1984: what surrounded them changed, and then their work did
    {at:t84,place:"fbHall84",later:true,keys:[[t84,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const cars=fb_line(x,fb_moved(tt),{x0:-20});fb_cord(x,null);const D=fb_atCar(cars,380,tt,1),Ry=fb_atCar(cars,940,tt,1),wk=w("back","their work",-0.2);
      PK.person(x,fb84("dale"),380,800,fb_hH(800),"stand",Object.assign({t:tt,reachN:D.n,reachNk:D.k,reachF:D.f,reachFk:0.8*D.k},PK.face(tt,{expr:"neutral",gaze:[1,0.45]},[[t84+1.0,"look",1.8,[1,0]],[wk,"smile",Infinity]])));
      PK.person(x,fb84("ray"),940,812,fb_hH(812),"stand",Object.assign({t:tt+1,reachN:Ry.n,reachNk:Ry.k,reachF:Ry.f,reachFk:0.8*Ry.k},PK.face(tt,{expr:"neutral",gaze:[1,0.5]},[[wk+0.4,"smile",Infinity]])));
      PK.person(x,fb84("lupe"),1500,880,fb_hH(880),"listen",Object.assign({t:tt+2,flip:true},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[t84+1.2,"say",1.4],[wk,"nods"]])));}},
    // Helena did the same: she comes in with her coffee. The board's notes have all moved, the binders are gone, and Jun pairs with Tomás
    {at:tH,cut:true,place:"fbTeam",keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const W={x0:2040,x1:1000,t0:tH,t1:tH+2.6,floor:866,h:fb_hT,arms:{aN:FB_MUG.aN},then:FB_MUG};
      fb_team(x,tt,{clock:9.0,notes:1,binders:0,show:fb_scrCode(ag_in(tt,tH+0.4,3.0)),jun:null,
        behind:cx=>{fb_pair(cx,tt,PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[tH+3.0,"say",1.4]]));
          PK.walk(cx,"helena",tt,W,Object.assign({hold:fb_mugHold(tt),holds:true},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[W.t1,"look",2.4,[1,-0.45]],[W.t1+2.6,"look",Infinity,[1,0.3]]])));},
        tomas:Object.assign({work:1},PK.face(tt,{expr:"smile",gaze:[1,0.3]},[[tH+3.6,"nod"]]))});}},
    // what she'd tell a manager on Monday, in her notebook
    {at:tN,place:"fbNotesH",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N2,{});}},
    // let them write the plan, and read it each month: at her table, over his plan, she says plainly where it's going
    {at:tP,place:"fbCorner",dis:0.6,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const sh=w("plan","say honestly",-0.1);
      fb_corner(x,tt,{write:0,book:1,read:ag_io(tt,tP+0.2,sh-0.2,0.7),up:1,t0:tP,
        hf:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[w("plan","read it",0),"nod"],[sh,"say",1.8]]),tf:PK.face(tt,{expr:"neutral",gaze:[1,0.0]},[[w("plan","each month",0),"glad",Infinity],[sh+1.2,"nod"]])});}},
    // and back to his desk: the next film follows the everyday case
    {at:tE,cut:true,place:"fbTeam",keys:[[tE,960,540,1.0],[tE+0.4,760,580,1.12]],d:3,draw:(x,tt,cam)=>{
      fb_team(x,tt,{clock:11.4,notes:1,binders:0,show:fb_scrCode(1),
        tomas:Object.assign({turn:1,work:0},PK.face(tt,{expr:"smile",gaze:[1,-0.05]},[[tE+1.2,"say",1.6],[tE+4.2,"nod"],[tE+6.4,"say",1.2]])),
        front:cx=>{PK.person(cx,"helena",790,905,fb_hT(905),FB_MUG,Object.assign({t:tt,flip:true,hold:fb_mugHold(tt),holds:true},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[tE+0.4,"say",1.4],[tE+3.0,"nod"],[tE+5.0,"say",1.6]])));}});}}
  ]);
  fb_card(ctx,S,t,c.next+0.3,c.take-0.5,{kick:"The next film",title:"Growing people",col:PK.C.blue},{right:true});
  fb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-fb_apart(t,[[tN,tP],[tE2,1e9]])));
  PK.end(ctx,S,t,tE2,"When someone falls behind",FB_LAST,"Film 3 of 4","Ownership and performance",{side:"right"});
});
// each university chapter opens on what the one before ends on: a cut, or a glide in one room
ag_cutInto(["behind","cause","gap","time"]);
