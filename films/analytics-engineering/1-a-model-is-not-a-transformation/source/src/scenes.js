/* ===== A model is not a transformation: scenes =====
   Eleven chapters, as in ../script.md. A blueprint lays no bricks; data has blueprints too (the recap of From words to data);
   many shapes hold the same four answers, and the series takes a middle way; someone has to build it: Jun, with dbt, one tool
   among several; dbt calls each query a model, but the model is the blueprint; a project of three hundred files, where the
   model lives, the ten steps, the films to come, and the pull back.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts slowly (drift), things arrive with a spring (arrive),
   dust gives depth (motes), and where two chapters share a thing it carries across the cut instead of fading: the model
   (2 → 4), the code file (5 → 6), the lineage graph (7 → 8) and the loop of ten steps (9 → 10).
   Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. A plan is not a building ---------- */
scene("plan",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.04,y:420});
  const cE=c("exact"),cB=c("brick"),u=clamp((t-1.6)/4.2,0,1),tr=fin(t,w("copy","one copy"),0.8)*(1-fin(t,cE-0.4,0.7));
  // the sheet on its frame, in the light; later it's held up over an empty site
  const lift=ease(fin(t,cB-0.2,1.4)),bw=lerp(lerp(980,760,ease(tr)),720,lift),bh=bw*0.62,bx=lerp(lerp(470,220,ease(tr)),600,lift),by=lerp(150,90,lift);
  yearTag(ctx,120,110,"1870s · a blueprint",CLAY,fin(t,0.3,0.6));
  const sun=fin(t,0.6,1.0)*(1-fin(t,cE,1.0));if(sun>0){const g=ctx.createRadialGradient(bx+bw/2,by-120,20,bx+bw/2,by+bh/2,bw*0.9);g.addColorStop(0,"rgba(255,236,190,"+(0.28*sun)+")");g.addColorStop(1,"rgba(255,236,190,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  mt_site(ctx,lerp(900,760,lift),t,lift);
  arrive(ctx,bx+bw/2,by+bh/2,t,0.8,()=>mt_print(ctx,bx,by,bw,bh,u,t,{frame:lift<0.5&&tr<0.5,title:"HOUSE · PLAN",sub:"sheet 1 of 4",p:clamp((t-0.9)/3.2,0,1),
    hl:{wall:fin(t,w("exact","every wall"),0.5)*(1-lift),thick:fin(t,w("exact","how thick"),0.5)*(1-lift),beam:fin(t,w("exact","what it carries"),0.5)*(1-lift)}}),{d:1.1,from:0.92});
  withA(ctx,fin(t,w("copy","white lines"),0.6)*(1-tr)*(1-fin(t,cE-0.3,0.4)),()=>tag(ctx,bx+bw/2,by+bh+60,"white lines on blue paper",BPL,{align:"center",size:20}));
  // one copy for every trade
  const cg=1-fin(t,cE-0.9,0.5);
  withA(ctx,cg,()=>{arrive(ctx,1270,265,t,w("copy","one copy")+0.6,()=>mt_copy(ctx,1120,170,300,"mason",1,t),{dy:40});arrive(ctx,1630,325,t,w("copy","every trade")+0.6,()=>mt_copy(ctx,1480,230,300,"carpenter",1,t),{dy:40});});
  withA(ctx,fin(t,w("exact","exactly"),0.5)*(1-lift),()=>T(ctx,"exactly what the building will be",bx+bw/2,by+bh+74,{w:700,size:26,align:"center",color:rgba(PARCH,1)}));
  arrive(ctx,960,1000,t,w("brick","single brick"),()=>tag(ctx,960,1000,"no bricks laid",CLAY,{align:"center",size:24}),{dy:16});
  ctx.restore();fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Where we left off ---------- */
scene("recap",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:380});
  const cO=c("offices"),cA=c("agreed"),cN=c("names"),cV=c("v3"),cS=c("series");
  arrive(ctx,960,490,t,0.2,()=>withA(ctx,1-fin(t,cO-0.1,0.5),()=>T(ctx,"Data has blueprints too.",960,500,{w:800,size:52,align:"center"})),{d:1.0,from:0.94});
  // four offices, four answers; then one agreed definition
  const out=1-fin(t,cA+2.2,0.7),K=["reg","short","careers","lms"],N=["7,420","10,600","14,650","26,900"];
  withA(ctx,fin(t,w("offices","how many"),0.5)*out,()=>T(ctx,"How many credentials did we award?",960,150,{w:800,size:38,align:"center",color:rgba(TRUST,1)}));
  K.forEach((k,i)=>arrive(ctx,330+i*420,315,t,cO+1.0+i*0.25,()=>officeCard(ctx,150+i*420,220,360,k,N[i],{a:out,h:190,big:60,hi:pulseAt(t,cO+1.2+i*0.25,1.0)}),{dy:36}));
  arrive(ctx,960,525,t,w("agreed","agreed"),()=>withA(ctx,out,()=>{glass(ctx,560,470,800,110,18,TRUST,{glow:18,ea:0.85,fill:"rgba(7,12,24,0.95)"});
    T(ctx,"credential",600,514,{f:"mono",w:500,size:20,color:rgba(TRUST,1)});T(ctx,"a trusted, checkable claim about what someone knows",600,556,{w:700,size:24});tag(ctx,960,470,"one definition · agreed",TRUST,{align:"center",size:18});}),{dy:24});
  // the model: learner, credential, award (it rises into place, and carries into chapter 4); then the four questions it answers
  const mA=fin(t,w("agreed","wrote it down"),0.8);bpModel(ctx,960,lerp(700,380,ease(fin(t,cA+2.2,1.2))),1,{a:mA,p:clamp((t-w("agreed","wrote it down"))/1.6,0,1),hi:{cred:pulseAt(t,cV,1.6)}});
  const Q=[["What a thing is","What a thing"],["What makes it the same one everywhere","What makes"],["What one row holds","What one row"],["When each thing was true","when each"]];
  Q.forEach(([s,k],j)=>{const x=300+j*440,y=620,t0=w("four",k)-0.2,na=fin(t,cN+j*0.35,0.4);arrive(ctx,x,y+40,t,t0,()=>{kt_four(ctx,j,x,y,34,1);
    withA(ctx,1-na,()=>wrapT(ctx,s,x,y+70,300,{w:700,size:22,align:"center"}));
    withA(ctx,na,()=>{T(ctx,KT_FOUR[j][0],x,y+76,{w:800,size:30,align:"center",color:rgba(KT_FOUR[j][2],1)});});},{dy:24});});
  // version three, approved
  kt_rstamp(ctx,1640,220,"v3 · approved",TRUST,fin(t,cV-0.1,0.3),fin(t,w("v3","approved")-0.2,0.35),{size:30,rot:-0.1});
  arrive(ctx,1580,920,t,cS,()=>{glass(ctx,1340,860,480,120,18,KIND,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,"The whole story",1370,904,{w:600,size:18,color:rgba(SOFT,1)});
    T(ctx,"From words to data",1370,944,{w:800,size:28,color:rgba(KIND,1)});T(ctx,"seven films",1790,944,{w:600,size:18,align:"right",color:rgba(SOFT,1)});},{dy:30});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Many shapes, one model ---------- */
// where each shape goes when the cards fold into the middle way: keys, versions, or the wide row and its star
const MT_TO=[1,2,0,1,0,2];
scene("shapes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const f0=w("middle","middle way")+0.2,keys=["normalised","stars","vault","anchors","hooks","wide"],stage=[384,960,1536];
  withA(ctx,fin(t,0.3,0.6),()=>T(ctx,"Many shapes, one model",960,150,{w:800,size:40,align:"center"}));
  // each card arrives as it's named; then they fly, one after another, into the stage they feed, shrinking as they go
  keys.forEach((k,i)=>{const fold=ease(fin(t,f0+i*0.07,1.0)),cx0=90+i*296+130,cy0=400,cx1=stage[MT_TO[i]],cy1=510,cx=lerp(cx0,cx1,fold),cy=lerp(cy0,cy1,fold),sc_=lerp(1,0.22,fold);
    const fr=[fin(t,w("same","same four")+i*0.08,0.4),fin(t,w("same","same four")+0.3+i*0.08,0.4),fin(t,w("same","four answers")+i*0.08,0.4),fin(t,w("same","answers")+0.2+i*0.08,0.4)];
    ctx.save();ctx.translate(cx,cy+Math.sin(t*0.8+i)*3*(1-fold));ctx.scale(sc_,sc_);ctx.translate(-cx0,-cy0);
    arrive(ctx,cx0,cy0,t,w("many",k)-0.2,()=>mt_shapeCard(ctx,i,cx0-130,cy0-150,260,300,t,{a:1-fold*fold,four:fr}),{dy:40});ctx.restore();});
  withA(ctx,fin(t,w("same","champions"),0.5)*(1-fin(t,f0-0.3,0.4)),()=>T(ctx,"each has its champions",960,640,{w:600,size:24,align:"center",color:rgba(SOFT,1)}));
  withA(ctx,fin(t,w("same","same four")+0.8,0.6)*(1-fin(t,f0-0.3,0.4)),()=>{KT_FOUR.forEach((f,j)=>{T(ctx,f[0],640+j*214,720,{w:800,size:26,align:"center",color:rgba(f[2],1)});});T(ctx,"the same four answers, in every shape",960,780,{w:600,size:22,align:"center",color:rgba(SOFT,1)});});
  // the middle way, in three stages
  arrive(ctx,960,300,t,f0,()=>tag(ctx,960,300,"this series: a middle way",WEED,{align:"center",size:22}),{dy:16});
  mt_middle(ctx,160,420,1600,{a:fin(t,f0,0.4),q:[fin(t,w("middle","business keys")-0.1,0.5),fin(t,w("middle","every version")-0.1,0.5),fin(t,w("middle","one wide row")-0.1,0.5)]});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Someone has to build it ---------- */
scene("build",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:600});
  const cA=c("arrive"),cT=c("turn"),cJ=c("jun"),b=fin(t,w("still","blueprint")-0.4,1.0),m=ease(fin(t,0,1.4));
  // the approved model, carried from the last chapter, settles and turns into a blueprint
  bpPaper(ctx,500,70,920,300,b,{title:"CREDENTIAL MODEL · v3",sub:"approved"});bpModel(ctx,960,lerp(380,290,m),lerp(1,0.82,m),{b});
  withA(ctx,1-b,()=>kt_rstamp(ctx,lerp(1640,1340,m),lerp(220,120,m),"v3 · approved",TRUST,1,1,{size:lerp(30,22,m),rot:-0.1}));
  // the data as it arrives: three systems into bronze, one learner under three keys, three codes, every version
  SRC3.forEach((s,i)=>{const t0=cA+0.3+i*0.35;arrive(ctx,245,592+i*110,t,t0,()=>srcCard(ctx,80,560+i*110,330,i,{}),{dy:0,from:0.8});arrowTo(ctx,410,592+i*110,520,600+i*100,s[1],fin(t,t0,0.5)*0.8,{p:fin(t,t0,0.5),head:12});});
  arrive(ctx,910,720,t,cA+0.6,()=>{glass(ctx,520,540,780,360,20,[205,140,80],{glow:14,ea:0.7,fill:"rgba(16,10,6,0.9)"});T(ctx,"bronze · as it arrived",550,580,{w:800,size:22,color:rgba([225,165,100],1)});},{from:0.95});
  const rows=[[SRC3[0][1],"S-20417","ENR",4],[SRC3[1][1],"u-88213","active",3],[SRC3[2][1],"aisha.k@mail.example","1",2]];
  rows.forEach(([col,key,code,nv],i)=>{const y=640+i*86;arrive(ctx,910,y,t,w("arrive","its own keys")-0.3+i*0.25,()=>{
    for(let v=nv-1;v>0;v--){withA(ctx,fin(t,w("arrive","every version")+v*0.15,0.4),()=>{ctx.fillStyle="rgba(10,14,24,0.95)";rr(ctx,560+v*10,y-26-v*9,700,52,10);ctx.fill();ctx.strokeStyle=rgba(col,0.3);ctx.lineWidth=1.5;rr(ctx,560+v*10,y-26-v*9,700,52,10);ctx.stroke();});}
    ctx.fillStyle="rgba(10,14,24,0.98)";rr(ctx,560,y-26,700,52,10);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;rr(ctx,560,y-26,700,52,10);ctx.stroke();
    T(ctx,"Aisha Khan",584,y+8,{w:700,size:20});T(ctx,key,800,y+8,{f:"mono",w:500,size:20,color:rgba(col,1)});
    withA(ctx,fin(t,w("arrive","its own codes")+i*0.2,0.4),()=>T(ctx,"status: "+code,1080,y+8,{f:"mono",w:500,size:18,color:rgba(SOFT,1)}));},{from:0.96});});
  arrive(ctx,1190,580,t,w("arrive","every version")+0.5,()=>tag(ctx,1190,580,"every version",[200,160,255],{align:"center",size:17}),{from:0.8});
  // the gap between what arrives and what was agreed
  const gA=fin(t,cT,0.6);withA(ctx,gA,()=>{ctx.save();ctx.setLineDash([10,10]);ctx.strokeStyle=rgba(EDGE_,0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(910,380);ctx.lineTo(910,530);ctx.stroke();ctx.restore();
    arrowTo(ctx,880,520,880,392,EDGE_,1,{p:fin(t,cT+0.4,0.8),head:14,dash:[8,8]});tag(ctx,940,455,"what arrives → what was agreed",EDGE_,{size:20});
    withA(ctx,fin(t,w("turn","show that it matches"),0.5),()=>tag(ctx,940,505,"and show that it matches",EDGE_,{size:18}));});
  // Noor hands the blueprint to Jun, at chest height, between them
  const hand=fin(t,w("jun","At the"),1.2);
  arrive(ctx,1620,820,t,cJ-0.3,()=>{person(ctx,"noor",1480,1000,0.62,{pose:"explain",t});person(ctx,"jun",1760,1000,0.62,{pose:hand>0.6?"explain":"stand",expr:"calm",t});
    roleTag(ctx,1480,1036,"noor");roleTag(ctx,1760,1036,"jun");
    const px=lerp(1545,1695,ease(hand)),py=790-Math.sin(Math.PI*hand)*24;bpPaper(ctx,px-50,py-32,100,64,1,{});bpModel(ctx,px,py+8,0.1,{b:1});},{d:0.9,from:0.94,dy:20});
  arrive(ctx,1620,560,t,w("jun","analytics engineer")-0.2,()=>tag(ctx,1620,560,"analytics engineer",TECH,{align:"center",size:22}),{dy:16});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. The building work ---------- */
const MT_F1=["-- one query, in its own file","select","    upper(trim(student_id)) as student_id,","    nullif(lower(trim(email)), '') as email,","    trim(status_code) as status_code","from {{ source('student_system', 'learners') }}"];
scene("work",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cF=c("file"),cO=c("order");
  arrive(ctx,960,120,t,0.3,()=>T(ctx,"transformation",960,120,{w:800,size:44,align:"center"}),{from:0.92});
  ["select","join","clean","reshape"].forEach((s,i)=>arrive(ctx,660+i*200,180,t,w("transform",s)-0.1,()=>tag(ctx,660+i*200,180,s,[150,190,255],{align:"center",size:20}),{from:0.7}));
  // four ways to do it; dbt lights, and moves up out of the way of the code
  const dbtOn=fin(t,w("tools","dbt")-0.1,0.5),up=ease(fin(t,cF-0.4,0.9));
  [["notebooks"],["stored procedures"],["pipeline tools"],["dbt"]].forEach(([n],i)=>{const y=lerp(250,90,up),x=120+i*430;
    arrive(ctx,x+190,y+45,t,w("tools",i<3?n:"dbt")-0.2,()=>mt_tool(ctx,x,y,380,90,n,i,{a:1-up*(i<3?1:0),on:i===3?dbtOn:0,dim:i<3?dbtOn:0}),{dy:24});});
  withA(ctx,fin(t,w("tools","widely used"),0.5)*(1-up),()=>T(ctx,"Jun's team: dbt",1600,400,{w:700,size:22,align:"center",color:rgba([255,160,110],1)}));
  // one query, one file; then another that refers to it; dbt works out the order
  const f2=["matched_keys as (","    select * from {{ ref('int_learner_keys_matched') }}","),","learner_keys as (","    select * from {{ ref('int_learner_keys') }}"];
  arrive(ctx,480,350,t,cF-0.3,()=>codeFile(ctx,100,240,760,"models/staging/stg_student_system__learners.sql",MT_F1,{p:clamp((t-cF)/2.4,0,1),edge:LAYER4[0][1]}),{dy:30});
  arrive(ctx,480,640,t,cO-0.2,()=>codeFile(ctx,100,560,760,"models/intermediate/int_learners.sql",f2,{p:clamp((t-cO)/2.0,0,1),edge:LAYER4[1][1],lit:{1:fin(t,w("order","refer to each other"),0.5),4:fin(t,w("order","refer to each other"),0.5)}}),{dy:30});
  withA(ctx,fin(t,w("order","refer to each other"),0.5),()=>{arrowTo(ctx,880,420,880,640,[255,160,110],1,{p:fin(t,w("order","refer to each other"),0.8),bend:-0.25,head:14});tag(ctx,960,540,"ref() sets the order",[255,160,110],{size:18});});
  // what dbt builds on the platform, and the tests and docs beside the code
  arrive(ctx,1500,460,t,w("order","builds each result"),()=>{glass(ctx,1180,250,640,420,20,[120,160,220],{glow:12,ea:0.6,fill:"rgba(7,12,24,0.9)"});T(ctx,"on the platform",1210,290,{w:800,size:22,color:rgba(SOFT,1)});
    [["stg_student_system__learners","view",LAYER4[0][1]],["int_learners","table",LAYER4[1][1]]].forEach(([n,k,col],i)=>{const y=340+i*130;arrive(ctx,1500,y+48,t,w("order",i?"a table":"a view")-0.1,()=>{
      glass(ctx,1210,y,580,96,14,col,{glow:10,ea:0.7,fill:"rgba(8,14,28,0.96)"});for(let r=0;r<3;r++){ctx.fillStyle=rgba(col,0.18+0.06*r);rr(ctx,1230,y+44+r*14,300,8,3);ctx.fill();}
      T(ctx,n,1230,y+34,{f:"mono",w:500,size:18,color:rgba(col,1)});tag(ctx,1700,y+48,k,col,{align:"center",size:18});},{from:0.9});});},{dy:30});
  const tY=w("order","tests and documentation");
  arrive(ctx,1500,790,t,tY,()=>codeFile(ctx,1180,700,640,"models/intermediate/_int_models.yml",["- name: int_learners","  columns:","    - name: learner_key","      description: '{{ doc(\"learner_key\") }}'","      data_tests: [unique, not_null]"],{p:clamp((t-tY)/1.6,0,1),edge:TRUST,size:17,lh:30}),{dy:30});
  kt_gtick(ctx,1770,870,14,fin(t,w("order","documentation")+0.8,0.3));
  ctx.restore();vign(ctx,S);});

/* ---------- 6. The name that misleads ---------- */
scene("name",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cA=c("apart"),mv=fin(t,w("step","The model is")-0.3,1.3),rl=fin(t,w("step","The model is")+0.2,0.6),m=ease(fin(t,0,1.3));
  // the staging file, carried from the last chapter, moves to its place; the blueprint arrives beside it
  const fx=lerp(100,120,m),fy=lerp(240,330,m),fw=lerp(760,740,m);
  codeFile(ctx,fx,fy,fw,"stg_student_system__learners.sql",MT_F1.slice(1),{edge:LAYER4[0][1]});
  arrive(ctx,1410,460,t,0.3,()=>{bpPaper(ctx,1000,250,820,420,1,{title:"CREDENTIAL MODEL · v3",sub:"the blueprint"});bpModel(ctx,1410,520,0.62,{b:1,hi:{learner:fin(t,cA,0.6)}});},{d:1.0,from:0.9});
  // the label "model" lifts from the file and lands on the blueprint; the file becomes "transformation"
  const k=spring(mv*1.2),lx=lerp(490,1410,k),ly=lerp(300,212,k)-Math.sin(Math.PI*clamp(mv,0,1))*90,warn=pulseAt(t,w("calls","misleading"),1.4);
  arrive(ctx,lx,ly,t,w("calls","a model")-0.2,()=>{glow(ctx,lx,ly,70,EDGE_,0.25*warn);tag(ctx,lx,ly,mv<0.5?"model?":"model",mv<0.5?mix(TRUST,EDGE_,warn):BPL,{align:"center",size:26});},{from:0.6});
  arrive(ctx,490,300,t,w("step","The model is")+0.2,()=>tag(ctx,490,300,"transformation",[150,190,255],{align:"center",size:24}),{from:0.6});
  withA(ctx,fin(t,w("step","one step"),0.5),()=>T(ctx,"one step of the building work",490,610,{w:600,size:22,align:"center",color:rgba(SOFT,1)}));
  withA(ctx,fin(t,w("step","blueprint")-0.1,0.5),()=>T(ctx,"the model",1410,720,{w:800,size:26,align:"center",color:rgba(BPL,1)}));
  // a thin line from the file to the part of the blueprint it builds
  const ln=fin(t,w("apart","connecting"),0.8);if(ln>0){ctx.save();ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=2;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(860,420);ctx.bezierCurveTo(960,420,1040,470,lerp(860,1110,ln),lerp(420,470,ln));ctx.stroke();ctx.restore();}
  arrive(ctx,960,820,t,w("apart","keeping the two apart"),()=>T(ctx,"keep them apart · connect them",960,820,{w:700,size:26,align:"center",color:rgba(TRUST,1)}),{dy:16});
  arrive(ctx,960,900,t,w("apart","analytics engineers"),()=>tag(ctx,960,900,"for analytics engineers · into the weeds",WEED,{align:"center",size:20}),{dy:16});
  ctx.restore();weedsTitle(ctx,S,t,B,"A model is not a transformation","the model is what you declare; a dbt model is how you make it",WEED);
  vign(ctx,S);});

/* ---------- 7. Three hundred models ---------- */
scene("models",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.045,x:1100,y:560});
  const cC=c("core"),cW=c("which"),gp=clamp((t-0.6)/(w("year","four layers")+0.8),0,1),GX=180,GY=190,GW=1560,GH=760;
  arrive(ctx,960,100,t,w("year","three hundred")-0.2,()=>T(ctx,"300 files",960,100,{w:800,size:40,align:"center"}),{from:0.9});
  const picks=[[LG.col[0][37],"tidy a source",w("steps","tidies")],[LG.col[1][22],"match three keys",w("steps","matches")],[LG.col[1][71],"one timeline",w("steps","stitches")]];
  const pick={};picks.forEach(([k,,tt])=>pick[k]=fin(t,tt-0.2,0.5)*(1-fin(t,cC,0.6)));
  const coreG=fin(t,w("core","core")-0.2,0.6),dim=fin(t,w("which","data model"),0.8);
  const pos=lineageGraph(ctx,GX,GY,GW,GH,t,{p:gp,core:coreG*(1-dim),pick,dim});
  picks.forEach(([k,lab,tt])=>{const a=pick[k];if(a<=0)return;const[px,py]=pos(k);withA(ctx,a,()=>{ctx.strokeStyle=rgba(INK,0.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+40,py-40);ctx.stroke();});arrive(ctx,px+40,py-40,t,tt-0.2,()=>withA(ctx,a,()=>tag(ctx,px+40,py-40,lab,INK,{size:19})),{from:0.7});});
  // the core holds what the blueprint names; the marts serve each consumer
  [["learner",2],["credential",8],["award",14]].forEach(([n,i])=>{const k=LG.col[2][i],[px,py]=pos(k);arrive(ctx,px+26,py,t,w("core",n)-0.1,()=>withA(ctx,1-dim,()=>tag(ctx,px+26,py,n,TRUST,{size:19})),{from:0.7});});
  [["for planning",10],["for the wallet",36]].forEach(([n,i])=>{const k=LG.col[3][i],[px,py]=pos(k);arrive(ctx,px-30,py,t,w("core","each consumer")+(i>20?0.3:0),()=>withA(ctx,1-dim,()=>{glow(ctx,px,py,24,LAYER4[3][1],0.5);tag(ctx,px-30,py,n,LAYER4[3][1],{size:18,align:"center"});}),{from:0.7});});
  ctx.restore();
  // the question stands still, over the drifting graph
  setScreen(ctx,S);arrive(ctx,960,555,t,cW,()=>{glass(ctx,560,480,800,150,22,EDGE_,{glow:20,ea:0.85,fill:"rgba(7,12,24,0.96)"});T(ctx,"Which file is the data model?",960,540,{w:800,size:38,align:"center"});
    withA(ctx,fin(t,w("which","None"),0.4),()=>T(ctx,"none of them",960,596,{w:800,size:30,align:"center",color:rgba(EDGE_,1)}));},{d:0.9});
  vign(ctx,S);});

/* ---------- 8. Where the model lives ---------- */
scene("lives",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,x:1100});
  const cY=c("yaml"),cM=c("md"),m=ease(fin(t,0,1.4));
  // the graph, carried from the last chapter, shrinks to the left to make room for the model's files
  arrive(ctx,960,110,t,0.4,()=>T(ctx,"The model lives beside the code",960,110,{w:800,size:40,align:"center"}),{from:0.92});
  lineageGraph(ctx,lerp(180,70,m),lerp(190,250,m),lerp(1560,560,m),lerp(760,560,m),t,{core:lerp(0,1,m),dim:lerp(1,0.5,m),heads:m*0.8});
  // YAML: grain, key, relationships, contract
  const Y=["models:","  - name: core_credential","    description: '{{ doc(\"credential\") }}'","    config:","      access: public","      contract: {enforced: true}","      meta: {grain: one row per credential}","    columns:","      - name: credential_key","        data_tests: [unique, not_null]","      - name: learner_key","        data_tests:","          - relationships:","              arguments: {to: ref('core_learner'), field: learner_key}"];
  const lit={6:fin(t,w("yaml","one row"),0.4),8:fin(t,w("yaml","which key"),0.4),9:fin(t,w("yaml","unique"),0.4),12:fin(t,w("yaml","relates"),0.4),13:fin(t,w("yaml","relates"),0.4),5:fin(t,w("yaml","contract"),0.4),4:fin(t,w("yaml","contract")+0.2,0.4)};
  arrive(ctx,1012,420,t,cY-0.3,()=>codeFile(ctx,648,190,728,"models/core/_core_models.yml",Y,{p:clamp((t-cY+0.2)/1.6,0,1),edge:TRUST,size:16,lh:29,lit,label:"YAML",labelCol:TRUST}),{dy:30});
  // Markdown: meaning, a diagram anyone can read, and why
  arrive(ctx,1623,495,t,cM-0.2,()=>{const x=1392,y=190,wd=462;glass(ctx,x,y,wd,610,14,KIND,{glow:12,ea:0.65,fill:"rgba(6,10,20,0.95)"});T(ctx,"docs/credential.md",x+36,y+27,{f:"mono",w:500,size:16,color:rgba(KIND,1)});T(ctx,"Markdown",x+wd-18,y+27,{w:700,size:15,align:"right",color:rgba(KIND,1)});
    T(ctx,"# Credential",x+24,y+82,{f:"mono",w:500,size:20,color:rgba(INK,0.95)});wrapT(ctx,"A trusted, checkable claim about what someone knows, issued by the university: a degree, a microcredential or a badge.",x+24,y+120,wd-48,{w:600,size:18,color:rgba(SOFT,1)});
    withA(ctx,fin(t,w("md","diagram"),0.5),()=>{T(ctx,"```mermaid",x+24,y+212,{f:"mono",w:500,size:15,color:rgba(SOFT,0.7)});bpModel(ctx,x+wd/2,y+306,0.36,{b:0});});
    withA(ctx,fin(t,w("md","why"),0.5),()=>{T(ctx,"## Decisions",x+24,y+400,{f:"mono",w:500,size:18,color:rgba(INK,0.95)});wrapT(ctx,"A microcredential is a kind of credential. Agreed 2 Oct 2026 · Mei, registrar's office",x+24,y+438,wd-48,{w:600,size:17,color:rgba(TRUST,0.95)});});},{dy:30});
  // the tests check that the tables are what the YAML and the Markdown say
  const tT=w("check","the tests");withA(ctx,fin(t,tT,0.5),()=>T(ctx,"tables  ←  the tests check  →  what the model says",960,880,{w:700,size:20,align:"center",color:rgba(SOFT,1)}));
  ["unique","not_null","relationships","contract"].forEach((s,i)=>{const x=760+i*260,y=940,ok=fin(t,tT+0.3+i*0.35,0.3);arrive(ctx,x,y,t,tT+i*0.12,()=>{glass(ctx,x-110,y-30,220,60,14,GOOD,{glow:8+10*ok,ea:0.6,fill:"rgba(7,12,24,0.95)"});T(ctx,s,x-10,y+7,{f:"mono",w:500,size:18,align:"center"});tick_(ctx,x+84,y,24,GOOD,ok);},{dy:20});});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. Ten steps ---------- */
scene("steps",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cA=c("agent"),K=[["s1","Start"],["s1","Learn"],["s1","Define"],["s4","Name"],["s4","Write the tests"],["s4","Build"],["s7","Validate"],["s7","Review"],["s7","Keep"],["s7","evolve"]];
  const on=K.map(([id,s])=>fin(t,w(id,s)-0.1,0.4));const ag=clamp((t-cA-0.2)/4.4,0,1)*10,agA=fin(t,cA-0.2,0.5);
  const teal=on.map((_,i)=>fin(t,cA+0.2+(i+0.6)*0.44,0.3)),ticks=on.map((_,i)=>fin(t,w("agent","person approves")-0.4+i*0.12,0.3));
  arrive(ctx,960,580,t,0.2,()=>{T(ctx,"Ten steps",960,560,{w:800,size:46,align:"center"});T(ctx,"Jun's process",960,604,{w:600,size:22,align:"center",color:rgba(SOFT,1)});},{from:0.9});
  arrive(ctx,960,560,t,0.0,()=>stepLoop(ctx,960,560,640,360,t,{on,agent:ag,agentA:agA,teal,ticks}),{d:1.2,from:0.9});
  arrive(ctx,760,680,t,w("agent","agent"),()=>tag(ctx,760,680,"an agent helps",KT_AI,{align:"center",size:20}),{dy:14});
  arrive(ctx,1160,680,t,w("agent","person approves")-0.2,()=>tag(ctx,1160,680,"a person approves",TRUST,{align:"center",size:20}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. The series ---------- */
scene("series",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  // the loop, carried from the last chapter, shrinks to make room for the films, and its labels give way to theirs
  const m=ease(fin(t,0,1.4)),cx=960,cy=lerp(560,570,m),rx=lerp(640,400,m),ry=lerp(360,250,m),words=["question","same one","Grain","Contracts","layers","owns","agent","written"],ids=["list1","list1","list1","list2","list2","list2","list2","list2"];
  stepLoop(ctx,cx,cy,rx,ry,t,{on:STEPS10.map(()=>lerp(1,0.35,m)),labA:1-fin(t,0,0.7)});
  arrive(ctx,cx,cy,t,1.0,()=>{glass(ctx,cx-200,cy-54,400,108,20,WEED,{glow:18,ea:0.85,fill:"rgba(7,12,24,0.96)"});T(ctx,"1 · this film",cx,cy-12,{f:"mono",w:500,size:18,align:"center",color:rgba(WEED,1)});T(ctx,"A model is not a transformation",cx,cy+24,{w:800,size:22,align:"center"});});
  arrive(ctx,960,90,t,0.4,()=>T(ctx,"The next eight films",960,90,{w:800,size:36,align:"center"}),{from:0.9});
  // each film arrives in its place, beside the steps it takes, and a line joins it to them
  MT_FILMS.forEach(([n,title,st],i)=>{const t0=w(ids[i],words[i])-0.2,a=fin(t,t0,0.5),an=-Math.PI/2+(st.reduce((s,x)=>s+x,0)/st.length)/10*TAU,px=cx+Math.cos(an)*(rx+300),py=cy+Math.sin(an)*(ry+120);
    st.forEach(k=>{const[sx,sy]=stepPos(k,cx,cy,rx,ry),q=fin(t,t0+0.2,0.6);withA(ctx,a,()=>{ctx.strokeStyle=rgba(WEED,0.5);ctx.lineWidth=1.5;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(lerp(sx,px,q),lerp(sy,py,q));ctx.stroke();ctx.setLineDash([]);glow(ctx,sx,sy,50,WEED,0.3);});});
    arrive(ctx,px,py,t,t0,()=>mt_filmCard(ctx,px,py,n,title,1,pulseAt(t,t0+0.2,1.2)),{from:0.75});});
  // the films' code and data are real: the example project runs on dbt Core with DuckDB
  arrive(ctx,960,150,t,w("real","real code")-0.1,()=>tag(ctx,960,150,"real code · real data · runs on dbt Core · DuckDB",WEED,{align:"center",size:20}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 11. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const cD=c("data");histBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  // the past: the 1870s blueprint over a finished building, which rises from the ground as it's named
  withA(ctx,fin(t,0.2,0.6),()=>{ctx.save();ctx.beginPath();ctx.rect(0,0,W/2,H);ctx.clip();const t0=w("bp","makes it true"),bx=230,by=600,bw=500,bh=300;
    ctx.fillStyle="rgba(90,64,40,0.9)";ctx.fillRect(0,900,W/2,H-900);
    ctx.save();ctx.beginPath();ctx.rect(0,0,W/2,900);ctx.clip();const rise=(1-spring(fin(t,t0,1.4)*1.3))*460;ctx.translate(0,rise);
    withA(ctx,fin(t,t0,0.3),()=>{ctx.fillStyle="rgba(150,84,54,1)";ctx.fillRect(bx,by,bw,bh);for(let r=0;r<15;r++)for(let k=0;k<13;k++){ctx.strokeStyle="rgba(70,36,22,0.5)";ctx.lineWidth=1;ctx.strokeRect(bx+k*40-(r%2)*20,by+r*20,40,20);}
      ctx.fillStyle="rgba(60,40,30,1)";ctx.beginPath();ctx.moveTo(bx-30,by);ctx.lineTo(bx+bw/2,by-150);ctx.lineTo(bx+bw+30,by);ctx.closePath();ctx.fill();
      [[300,by+80],[600,by+80]].forEach(([wx,wy])=>{ctx.fillStyle="rgba(255,220,150,0.8)";ctx.fillRect(wx,wy,70,80);});ctx.fillStyle="rgba(50,30,20,1)";ctx.fillRect(450,by+160,70,140);});ctx.restore();
    mt_print(ctx,250,90,460,285,1,t,{});yearTag(ctx,60,60,"1870s",CLAY,1);ctx.restore();});
  // the present: the credential blueprint over the lineage graph, its core lit
  const rA=fin(t,cD-0.2,0.8);withA(ctx,rA,()=>{ctx.save();ctx.beginPath();ctx.rect(W/2,0,W/2,H);ctx.clip();ctx.fillStyle="#05080f";ctx.fillRect(W/2,0,W/2,H);motes(ctx,t,{n:30});
    lineageGraph(ctx,1030,520,820,400,t,{core:1,dim:0.35,heads:0.7});bpPaper(ctx,1080,90,720,280,1,{title:"CREDENTIAL MODEL · v3"});bpModel(ctx,1440,260,0.6,{b:1});
    arrive(ctx,1440,440,t,w("data","dbt"),()=>tag(ctx,1440,440,"built with dbt",[255,160,110],{align:"center",size:20}),{from:0.7});ctx.restore();});
  ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fillRect(W/2-1,0,2,H);
  arrive(ctx,480,415,t,w("bp","blueprint"),()=>tag(ctx,480,415,"the blueprint",BPL,{align:"center",size:20}),{from:0.7});arrive(ctx,480,960,t,w("bp","building work"),()=>tag(ctx,480,960,"the building work",CLAY,{align:"center",size:20}),{from:0.7});
  withA(ctx,rA,()=>{tag(ctx,1440,50,"the model",BPL,{align:"center",size:20});tag(ctx,1440,975,"the building work: transformations",[255,160,110],{align:"center",size:20});});
  ctx.restore();weedsEnd(ctx,S,t,B,"A model is not a transformation",WEED,"Declare it. Then build it.");
  fadeIn(ctx,S,t,0.01);vign(ctx,S);});
