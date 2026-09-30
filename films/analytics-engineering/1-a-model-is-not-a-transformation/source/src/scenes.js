/* ===== A model is not a transformation: scenes =====
   Eleven chapters, as in ../script.md. A blueprint lays no bricks; data has blueprints too (the recap of From words to data);
   many shapes hold the same four answers, and the series takes a middle way; someone has to build it: Jun, with dbt, one tool
   among several; dbt calls each query a model, but the model is the blueprint; a project of three hundred files, where the
   model lives, the ten steps, the films to come, and the pull back. */

/* ---------- 1. A plan is not a building ---------- */
scene("plan",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t);
  const cE=c("exact"),cB=c("brick"),ex=fin(t,0.8,1.2),u=clamp((t-1.6)/4.2,0,1),tr=fin(t,w("copy","one copy"),0.8)*(1-fin(t,cE-0.4,0.7));
  // the sheet on its frame, in the light; later it's held up over an empty site
  const lift=fin(t,cB-0.2,1.2),bw=lerp(lerp(980,760,tr),720,lift),bh=bw*0.62,bx=lerp(lerp(470,220,tr),600,lift),by=lerp(150,100,lift);
  yearTag(ctx,120,110,"1870s · a blueprint",CLAY,fin(t,0.3,0.6));
  const sun=fin(t,0.6,1.0)*(1-fin(t,cE,1.0));if(sun>0){const g=ctx.createRadialGradient(bx+bw/2,by-120,20,bx+bw/2,by+bh/2,bw*0.9);g.addColorStop(0,"rgba(255,236,190,"+(0.28*sun)+")");g.addColorStop(1,"rgba(255,236,190,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  mt_site(ctx,760,t,lift);
  withA(ctx,ex,()=>mt_print(ctx,bx,by,bw,bh,u,t,{frame:lift<0.5&&tr<0.5,title:"HOUSE · PLAN",sub:"sheet 1 of 4",p:clamp((t-0.9)/3.2,0,1),
    hl:{wall:fin(t,w("exact","every wall"),0.5)*(1-lift),thick:fin(t,w("exact","how thick"),0.5)*(1-lift),beam:fin(t,w("exact","what it carries"),0.5)*(1-lift)}}));
  withA(ctx,fin(t,w("copy","white lines"),0.6)*(1-tr)*(1-fin(t,cE-0.3,0.4)),()=>tag(ctx,bx+bw/2,by+bh+60,"white lines on blue paper",BPL,{align:"center",size:20}));
  // one copy for every trade
  const cg=1-fin(t,cE-0.9,0.5);mt_copy(ctx,1120,170,300,"mason",fin(t,w("copy","one copy"),0.6)*cg,t);mt_copy(ctx,1480,230,300,"carpenter",fin(t,w("copy","every trade"),0.6)*cg,t);
  withA(ctx,fin(t,w("exact","exactly"),0.5)*(1-lift),()=>T(ctx,"exactly what the building will be",bx+bw/2,by+bh+74,{w:700,size:26,align:"center",color:rgba(PARCH,1)}));
  withA(ctx,fin(t,w("brick","single brick"),0.6),()=>tag(ctx,960,1000,"no bricks laid",CLAY,{align:"center",size:24}));
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Where we left off ---------- */
scene("recap",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  const cO=c("offices"),cA=c("agreed"),cF=c("four"),cN=c("names"),cV=c("v3"),cS=c("series");
  withA(ctx,fin(t,0.2,0.6)*(1-fin(t,cO-0.1,0.5)),()=>T(ctx,"Data has blueprints too.",960,500,{w:800,size:52,align:"center"}));
  // four offices, four answers; then one agreed definition
  const oA=fin(t,cO+0.8,0.5)*(1-fin(t,cA+2.2,0.7)),K=["reg","short","careers","lms"],N=["7,420","10,600","14,650","26,900"];
  withA(ctx,fin(t,w("offices","how many"),0.5)*(1-fin(t,cA+2.2,0.7)),()=>T(ctx,"How many credentials did we award?",960,150,{w:800,size:38,align:"center",color:rgba(TRUST,1)}));
  K.forEach((k,i)=>officeCard(ctx,150+i*420,220,360,k,N[i],{a:oA*fin(t,cO+1.0+i*0.25,0.5),h:190,big:60,hi:pulseAt(t,cO+1.2+i*0.25,1.0)}));
  const dA=fin(t,w("agreed","agreed"),0.6)*(1-fin(t,cA+2.2,0.7));withA(ctx,dA,()=>{glass(ctx,560,470,800,110,18,TRUST,{glow:18,ea:0.85,fill:"rgba(7,12,24,0.95)"});
    T(ctx,"credential",600,514,{f:"mono",w:500,size:20,color:rgba(TRUST,1)});T(ctx,"a trusted, checkable claim about what someone knows",600,556,{w:700,size:24});tag(ctx,960,470,"one definition · agreed",TRUST,{align:"center",size:18});});
  // the model: learner, credential, award; then the four questions it answers
  const mA=fin(t,w("agreed","wrote it down"),0.8);bpModel(ctx,960,lerp(700,380,fin(t,cA+2.2,1.0)),1,{a:mA,p:clamp((t-w("agreed","wrote it down"))/1.6,0,1),hi:{cred:pulseAt(t,cV,1.6)}});
  const Q=[["What a thing is","What a thing"],["What makes it the same one everywhere","What makes"],["What one row holds","What one row"],["When each thing was true","when each"]];
  Q.forEach(([s,k],j)=>{const x=300+j*440,y=620,qa=fin(t,w("four",k)-0.2,0.5),na=fin(t,cN+j*0.35,0.4);kt_four(ctx,j,x,y,34,qa);
    withA(ctx,qa*(1-na),()=>wrapT(ctx,s,x,y+70,300,{w:700,size:22,align:"center"}));
    withA(ctx,na,()=>{T(ctx,KT_FOUR[j][0],x,y+76,{w:800,size:30,align:"center",color:rgba(KT_FOUR[j][2],1)});});});
  // version three, approved
  kt_rstamp(ctx,1640,220,"v3 · approved",TRUST,fin(t,cV-0.1,0.3),fin(t,w("v3","approved")-0.2,0.35),{size:30,rot:-0.1});
  withA(ctx,fin(t,cS,0.6),()=>{glass(ctx,1340,860,480,120,18,KIND,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,"The whole story",1370,904,{w:600,size:18,color:rgba(SOFT,1)});
    T(ctx,"From words to data",1370,944,{w:800,size:28,color:rgba(KIND,1)});T(ctx,"seven films",1790,944,{w:600,size:18,align:"right",color:rgba(SOFT,1)});});
  vign(ctx,S);});

/* ---------- 3. Many shapes, one model ---------- */
scene("shapes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  const cM=c("middle"),fold=fin(t,w("middle","middle way")+0.2,1.0),keys=["normalised","stars","vault","anchors","hooks","wide"];
  withA(ctx,fin(t,0.3,0.6),()=>T(ctx,"Many shapes, one model",960,150,{w:800,size:40,align:"center"}));
  keys.forEach((k,i)=>{const a=fin(t,w("many",k)-0.2,0.5),x=lerp(90+i*296,960-130,fold),y=lerp(250,270,fold)+Math.sin(t*0.8+i)*3;
    const fr=[fin(t,w("same","same four")+0.0+i*0.08,0.4),fin(t,w("same","same four")+0.3+i*0.08,0.4),fin(t,w("same","four answers")+i*0.08,0.4),fin(t,w("same","answers")+0.2+i*0.08,0.4)];
    mt_shapeCard(ctx,i,x,y,260,300,t,{a:a*(1-fold),four:fr});});
  withA(ctx,fin(t,w("same","champions"),0.5)*(1-fold),()=>T(ctx,"each has its champions",960,640,{w:600,size:24,align:"center",color:rgba(SOFT,1)}));
  withA(ctx,fin(t,w("same","same four")+0.8,0.6)*(1-fold),()=>{KT_FOUR.forEach((f,j)=>{T(ctx,f[0],640+j*214,720,{w:800,size:26,align:"center",color:rgba(f[2],1)});});T(ctx,"the same four answers, in every shape",960,780,{w:600,size:22,align:"center",color:rgba(SOFT,1)});});
  // the middle way, in three stages
  withA(ctx,fold,()=>tag(ctx,960,300,"this series: a middle way",WEED,{align:"center",size:22}));
  mt_middle(ctx,160,420,1600,{a:fold,q:[fin(t,w("middle","business keys")-0.1,0.5),fin(t,w("middle","every version")-0.1,0.5),fin(t,w("middle","one wide row")-0.1,0.5)]});
  vign(ctx,S);});

/* ---------- 4. Someone has to build it ---------- */
scene("build",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  const cA=c("arrive"),cT=c("turn"),cJ=c("jun"),b=fin(t,w("still","blueprint")-0.4,1.0);
  // the approved model, turning into a blueprint
  bpPaper(ctx,500,70,920,300,b,{title:"CREDENTIAL MODEL · v3",sub:"approved"});bpModel(ctx,960,290,0.82,{b});
  withA(ctx,fin(t,0.3,0.5)*(1-b),()=>kt_rstamp(ctx,1340,120,"v3 · approved",TRUST,1,1,{size:22,rot:-0.1}));
  // the data as it arrives: three systems into bronze, one learner under three keys, three codes, every version
  const sA=[0,1,2].map(i=>fin(t,cA+0.3+i*0.35,0.5));SRC3.forEach((s,i)=>srcCard(ctx,80,560+i*110,330,i,{a:sA[i]}));
  const brA=fin(t,cA+0.6,0.6);withA(ctx,brA,()=>{glass(ctx,520,540,780,360,20,[205,140,80],{glow:14,ea:0.7,fill:"rgba(16,10,6,0.9)"});T(ctx,"bronze · as it arrived",550,580,{w:800,size:22,color:rgba([225,165,100],1)});});
  SRC3.forEach((s,i)=>arrowTo(ctx,410,592+i*110,520,600+i*100,s[1],sA[i]*0.8,{p:sA[i],head:12}));
  const rows=[[SRC3[0][1],"S-20417","ENR",4],[SRC3[1][1],"u-88213","active",3],[SRC3[2][1],"aisha.k@mail.com","1",2]];
  rows.forEach(([col,key,code,nv],i)=>{const ra=fin(t,w("arrive","its own keys")-0.3+i*0.25,0.4),y=640+i*86;withA(ctx,ra,()=>{
    for(let v=nv-1;v>0;v--){withA(ctx,fin(t,w("arrive","every version")+v*0.15,0.4),()=>{ctx.fillStyle="rgba(10,14,24,0.95)";rr(ctx,560+v*10,y-26-v*9,700,52,10);ctx.fill();ctx.strokeStyle=rgba(col,0.3);ctx.lineWidth=1.5;rr(ctx,560+v*10,y-26-v*9,700,52,10);ctx.stroke();});}
    ctx.fillStyle="rgba(10,14,24,0.98)";rr(ctx,560,y-26,700,52,10);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;rr(ctx,560,y-26,700,52,10);ctx.stroke();
    T(ctx,"Aisha Khan",584,y+8,{w:700,size:20});T(ctx,key,800,y+8,{f:"mono",w:500,size:20,color:rgba(col,1)});
    withA(ctx,fin(t,w("arrive","its own codes")+i*0.2,0.4),()=>T(ctx,"status: "+code,1080,y+8,{f:"mono",w:500,size:18,color:rgba(SOFT,1)}));});});
  withA(ctx,fin(t,w("arrive","every version")+0.5,0.5),()=>tag(ctx,1300,560,"every version",[200,160,255],{align:"center",size:17}));
  // the gap between what arrives and what was agreed
  const gA=fin(t,cT,0.6);withA(ctx,gA,()=>{ctx.save();ctx.setLineDash([10,10]);ctx.strokeStyle=rgba(EDGE_,0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(910,380);ctx.lineTo(910,530);ctx.stroke();ctx.restore();
    arrowTo(ctx,880,520,880,392,EDGE_,1,{p:fin(t,cT+0.4,0.8),head:14,dash:[8,8]});tag(ctx,940,455,"what arrives → what was agreed",EDGE_,{size:20});
    withA(ctx,fin(t,w("turn","show that it matches"),0.5),()=>tag(ctx,940,505,"and show that it matches",EDGE_,{size:18}));});
  // Noor hands the blueprint to Jun
  const pA=fin(t,cJ-0.3,0.7),hand=fin(t,w("jun","At the"),1.2);withA(ctx,pA,()=>{person(ctx,"noor",1480,1000,0.62,{pose:"explain",t});person(ctx,"jun",1760,1000,0.62,{pose:hand>0.6?"explain":"stand",expr:"calm",t});
    roleTag(ctx,1480,1036,"noor");roleTag(ctx,1760,1036,"jun");
    const px=lerp(1560,1700,ease(hand)),py=lerp(640,600,ease(hand))-Math.sin(Math.PI*hand)*40;bpPaper(ctx,px-60,py-38,120,76,1,{});bpModel(ctx,px,py+10,0.12,{b:1});});
  withA(ctx,fin(t,w("jun","analytics engineer")-0.2,0.5),()=>tag(ctx,1620,500,"analytics engineer",TECH,{align:"center",size:22}));
  vign(ctx,S);});

/* ---------- 5. The building work ---------- */
scene("work",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  const cT=c("tools"),cF=c("file"),cO=c("order");
  withA(ctx,fin(t,0.3,0.5),()=>{T(ctx,"transformation",960,120,{w:800,size:44,align:"center"});
    ["select","join","clean","reshape"].forEach((s,i)=>withA(ctx,fin(t,w("transform",s)-0.1,0.4),()=>tag(ctx,660+i*200,180,s,[150,190,255],{align:"center",size:20})));});
  // four ways to do it; dbt lights
  const dbtOn=fin(t,w("tools","dbt")-0.1,0.5),up=fin(t,cF-0.4,0.8);
  [["notebooks"],["stored procedures"],["pipeline tools"],["dbt"]].forEach(([n],i)=>mt_tool(ctx,120+i*430,lerp(250,90,up),380,90,n,i,{a:fin(t,w("tools",i<3?n:"dbt")-0.2,0.5)*(1-up*(i<3?1:0)),on:i===3?dbtOn:0,dim:i<3?dbtOn:0}));
  withA(ctx,fin(t,w("tools","widely used"),0.5)*(1-up),()=>T(ctx,"Jun's team: dbt",1510,420,{w:700,size:22,align:"center",color:rgba([255,160,110],1)}));
  // one query, one file; then another that refers to it; dbt works out the order
  const f1=["-- one query, in its own file","select","    student_id,","    lower(trim(email)) as email,","    status_code","from {{ source('student_system', 'learners') }}"];
  const f2=["select","    l.student_id,","    k.learner_key","from {{ ref('stg_student_system__learners') }} as l","join {{ ref('int_learner_keys') }} as k using (email)"];
  codeFile(ctx,100,240,760,"models/staging/stg_student_system__learners.sql",f1,{a:fin(t,cF-0.3,0.5),p:clamp((t-cF)/2.4,0,1),edge:LAYER4[0][1]});
  const r2=fin(t,cO-0.2,0.5);codeFile(ctx,100,560,760,"models/intermediate/int_learners.sql",f2,{a:r2,p:clamp((t-cO)/2.0,0,1),edge:LAYER4[1][1],lit:{3:fin(t,w("order","refer to each other"),0.5)}});
  withA(ctx,fin(t,w("order","refer to each other"),0.5),()=>{arrowTo(ctx,880,420,880,640,[255,160,110],1,{p:fin(t,w("order","refer to each other"),0.8),bend:-0.25,head:14});tag(ctx,960,540,"ref() sets the order",[255,160,110],{size:18});});
  // what dbt builds on the platform, and the tests and docs beside the code
  const bA=fin(t,w("order","builds each result"),0.6);withA(ctx,bA,()=>{glass(ctx,1180,250,640,420,20,[120,160,220],{glow:12,ea:0.6,fill:"rgba(7,12,24,0.9)"});T(ctx,"on the platform",1210,290,{w:800,size:22,color:rgba(SOFT,1)});
    [["stg_student_system__learners","view",LAYER4[0][1]],["int_learners","table",LAYER4[1][1]]].forEach(([n,k,col],i)=>withA(ctx,fin(t,w("order",i?"a table":"a view")-0.1,0.5),()=>{const y=340+i*130;
      glass(ctx,1210,y,580,96,14,col,{glow:10,ea:0.7,fill:"rgba(8,14,28,0.96)"});for(let r=0;r<3;r++){ctx.fillStyle=rgba(col,0.18+0.06*r);rr(ctx,1230,y+44+r*14,300,8,3);ctx.fill();}
      T(ctx,n,1230,y+34,{f:"mono",w:500,size:18,color:rgba(col,1)});tag(ctx,1700,y+48,k,col,{align:"center",size:18});}));});
  const yA=fin(t,w("order","tests and documentation"),0.5);codeFile(ctx,1180,700,640,"models/intermediate/_int_models.yml",["- name: int_learners","  description: '{{ doc(\"learner\") }}'","  columns:","    - name: learner_key","      data_tests: [unique, not_null]"],{a:yA,p:clamp((t-w("order","tests and documentation"))/1.6,0,1),edge:TRUST,size:17,lh:30});
  [0,1].forEach(i=>kt_gtick(ctx,1770,870+i*0,14,fin(t,w("order","documentation")+0.8+i*0.4,0.3)*(i?0:1)));
  vign(ctx,S);});

/* ---------- 6. The name that misleads ---------- */
scene("name",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cS=c("step"),cA=c("apart"),mv=fin(t,w("step","The model is")-0.3,1.2),rl=fin(t,w("step","The model is")+0.2,0.6);
  const f1=["select","    student_id,","    lower(trim(email)) as email,","    status_code","from {{ source('student_system', 'learners') }}"];
  codeFile(ctx,120,330,740,"stg_student_system__learners.sql",f1,{edge:LAYER4[0][1]});
  bpPaper(ctx,1000,250,820,420,1,{title:"CREDENTIAL MODEL · v3",sub:"the blueprint"});bpModel(ctx,1410,520,0.62,{b:1,hi:{learner:fin(t,cA,0.6)}});
  // the label "model" moves from the file to the blueprint; the file becomes "transformation"
  const lx=lerp(490,1410,ease(mv)),ly=lerp(300,236,ease(mv))-Math.sin(Math.PI*mv)*80,warn=pulseAt(t,w("calls","misleading"),1.4);
  withA(ctx,fin(t,w("calls","a model")-0.2,0.4),()=>{glow(ctx,lx,ly,70,EDGE_,0.25*warn);tag(ctx,lx,ly,mv<0.5?"model?":"model",mv<0.5?mix(TRUST,EDGE_,warn):BPL,{align:"center",size:26});});
  withA(ctx,rl,()=>tag(ctx,490,300+(mv>0.3?0:40*(1-rl)),"transformation",[150,190,255],{align:"center",size:24}));
  withA(ctx,fin(t,w("step","one step"),0.5),()=>T(ctx,"one step of the building work",490,610,{w:600,size:22,align:"center",color:rgba(SOFT,1)}));
  withA(ctx,fin(t,w("step","blueprint")-0.1,0.5),()=>T(ctx,"the model",1410,720,{w:800,size:26,align:"center",color:rgba(BPL,1)}));
  // a thin line from the file to the part of the blueprint it builds
  const ln=fin(t,w("apart","connecting"),0.8);if(ln>0){ctx.save();ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=2;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(860,420);ctx.bezierCurveTo(960,420,1040,470,lerp(860,1110,ln),lerp(420,470,ln));ctx.stroke();ctx.restore();}
  withA(ctx,fin(t,w("apart","keeping the two apart"),0.5),()=>T(ctx,"keep them apart · connect them",960,820,{w:700,size:26,align:"center",color:rgba(TRUST,1)}));
  withA(ctx,fin(t,w("apart","analytics engineers"),0.5),()=>tag(ctx,960,900,"for analytics engineers · into the weeds",WEED,{align:"center",size:20}));
  weedsTitle(ctx,S,t,B,"A model is not a transformation","the model is what you declare; a dbt model is how you make it",WEED);
  vign(ctx,S);});

/* ---------- 7. Three hundred models ---------- */
scene("models",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  const cS=c("steps"),cC=c("core"),cW=c("which"),gp=clamp((t-0.6)/(w("year","four layers")+0.8),0,1),GX=180,GY=190,GW=1560,GH=760;
  withA(ctx,fin(t,w("year","three hundred")-0.2,0.5),()=>T(ctx,"300 files",960,100,{w:800,size:40,align:"center"}));
  const picks=[[LG.col[0][37],"tidy a source",w("steps","tidies")],[LG.col[1][22],"match three keys",w("steps","matches")],[LG.col[1][71],"one timeline",w("steps","stitches")]];
  const pick={};picks.forEach(([k,,tt])=>pick[k]=fin(t,tt-0.2,0.5)*(1-fin(t,cC,0.6)));
  const coreG=fin(t,w("core","core")-0.2,0.6),dim=fin(t,w("which","data model"),0.8);
  const pos=lineageGraph(ctx,GX,GY,GW,GH,t,{p:gp,core:coreG*(1-dim),pick,dim});
  picks.forEach(([k,lab,tt])=>{const a=pick[k];if(a<=0)return;const[px,py]=pos(k);withA(ctx,a,()=>{ctx.strokeStyle=rgba(INK,0.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+40,py-40);ctx.stroke();tag(ctx,px+40,py-40,lab,INK,{size:19});});});
  // the core holds what the blueprint names; the marts serve each consumer
  const cn=[["learner",2],["credential",8],["award",14]];cn.forEach(([n,i],j)=>{const k=LG.col[2][i],[px,py]=pos(k);withA(ctx,fin(t,w("core",n)-0.1,0.5)*(1-dim),()=>tag(ctx,px+26,py,n,TRUST,{size:19}));});
  [["for planning",10],["for the wallet",36]].forEach(([n,i])=>{const k=LG.col[3][i],[px,py]=pos(k);withA(ctx,fin(t,w("core","each consumer")+(i>20?0.3:0),0.5)*(1-dim),()=>{glow(ctx,px,py,24,LAYER4[3][1],0.5);tag(ctx,px-30,py,n,LAYER4[3][1],{size:18,align:"center"});});});
  withA(ctx,fin(t,cW,0.5),()=>{glass(ctx,560,480,800,150,22,EDGE_,{glow:20,ea:0.85,fill:"rgba(7,12,24,0.96)"});T(ctx,"Which file is the data model?",960,540,{w:800,size:38,align:"center"});
    withA(ctx,fin(t,w("which","None"),0.4),()=>T(ctx,"none of them",960,596,{w:800,size:30,align:"center",color:rgba(EDGE_,1)}));});
  vign(ctx,S);});

/* ---------- 8. Where the model lives ---------- */
scene("lives",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  const cY=c("yaml"),cM=c("md"),cC=c("check");
  withA(ctx,fin(t,0.2,0.5),()=>{T(ctx,"The model lives beside the code",960,110,{w:800,size:40,align:"center"});lineageGraph(ctx,70,250,560,560,t,{core:1,dim:0.5,heads:0.8});});
  // YAML: grain, key, relationships, contract
  const Y=["models:","  - name: core_credential","    description: '{{ doc(\"credential\") }}'","    config:","      access: public","      contract: {enforced: true}","      meta: {grain: one row per credential}","    columns:","      - name: credential_key","        data_tests: [unique, not_null]","      - name: learner_key","        data_tests:","          - relationships:","              arguments: {to: ref('core_learner'), field: learner_key}"];
  const lit={6:fin(t,w("yaml","one row"),0.4),8:fin(t,w("yaml","which key"),0.4),9:fin(t,w("yaml","unique"),0.4),12:fin(t,w("yaml","relates"),0.4),13:fin(t,w("yaml","relates"),0.4),5:fin(t,w("yaml","contract"),0.4),4:fin(t,w("yaml","contract")+0.2,0.4)};
  codeFile(ctx,648,190,728,"models/core/_core_models.yml",Y,{a:fin(t,cY-0.3,0.5),p:clamp((t-cY+0.2)/1.6,0,1),edge:TRUST,size:16,lh:29,lit,label:"YAML",labelCol:TRUST});
  // Markdown: meaning, a diagram anyone can read, and why
  const mA=fin(t,cM-0.2,0.5);withA(ctx,mA,()=>{const x=1392,y=190,wd=462,h=610;glass(ctx,x,y,wd,h,14,KIND,{glow:12,ea:0.65,fill:"rgba(6,10,20,0.95)"});T(ctx,"docs/credential.md",x+36,y+27,{f:"mono",w:500,size:16,color:rgba(KIND,1)});T(ctx,"Markdown",x+wd-18,y+27,{w:700,size:15,align:"right",color:rgba(KIND,1)});
    T(ctx,"# Credential",x+24,y+82,{f:"mono",w:500,size:20,color:rgba(INK,0.95)});wrapT(ctx,"A trusted, checkable claim about what someone knows, issued by the university: a degree, a microcredential or a badge.",x+24,y+120,wd-48,{w:600,size:18,color:rgba(SOFT,1)});
    withA(ctx,fin(t,w("md","diagram"),0.5),()=>{T(ctx,"```mermaid",x+24,y+212,{f:"mono",w:500,size:15,color:rgba(SOFT,0.7)});bpModel(ctx,x+wd/2,y+306,0.36,{b:0});});
    withA(ctx,fin(t,w("md","why"),0.5),()=>{T(ctx,"## Decisions",x+24,y+400,{f:"mono",w:500,size:18,color:rgba(INK,0.95)});wrapT(ctx,"A microcredential is a kind of credential. Agreed 2 Oct 2026 · Mei, registrar's office",x+24,y+438,wd-48,{w:600,size:17,color:rgba(TRUST,0.95)});});});
  // the tests check that the tables are what the YAML and the Markdown say
  const tA=fin(t,w("check","the tests"),0.5);withA(ctx,tA,()=>{["unique","not_null","relationships","contract"].forEach((s,i)=>{const x=760+i*260,y=940,ok=fin(t,w("check","the tests")+0.3+i*0.35,0.3);glass(ctx,x-110,y-30,220,60,14,GOOD,{glow:8+10*ok,ea:0.6,fill:"rgba(7,12,24,0.95)"});T(ctx,s,x-10,y+7,{f:"mono",w:500,size:18,align:"center"});tick_(ctx,x+84,y,24,GOOD,ok);});
    T(ctx,"tables  ←  the tests check  →  what the model says",960,880,{w:700,size:20,align:"center",color:rgba(SOFT,1)});});
  vign(ctx,S);});

/* ---------- 9. Ten steps ---------- */
scene("steps",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  const cA=c("agent"),K=[["s1","Start"],["s1","Learn"],["s1","Define"],["s4","Name"],["s4","Write the tests"],["s4","Build"],["s7","Validate"],["s7","Review"],["s7","Keep"],["s7","evolve"]];
  const on=K.map(([id,s])=>fin(t,w(id,s)-0.1,0.4));const ag=clamp((t-cA-0.2)/4.4,0,1)*10,agA=fin(t,cA-0.2,0.5);
  const teal=on.map((_,i)=>fin(t,cA+0.2+(i+0.6)*0.44,0.3)),ticks=on.map((_,i)=>fin(t,w("agent","person approves")-0.4+i*0.12,0.3));
  withA(ctx,fin(t,0.2,0.5),()=>{T(ctx,"Ten steps",960,560,{w:800,size:46,align:"center"});T(ctx,"Jun's process",960,604,{w:600,size:22,align:"center",color:rgba(SOFT,1)});});
  stepLoop(ctx,960,560,640,360,t,{on,agent:ag,agentA:agA,teal,ticks});
  withA(ctx,fin(t,w("agent","agent"),0.5),()=>{tag(ctx,760,680,"an agent helps",KT_AI,{align:"center",size:20});});
  withA(ctx,fin(t,w("agent","person approves")-0.2,0.5),()=>tag(ctx,1160,680,"a person approves",TRUST,{align:"center",size:20}));
  vign(ctx,S);});

/* ---------- 10. The series ---------- */
scene("series",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  const cx=960,cy=570,rx=400,ry=250,words=["question","same one","Grain","Contracts","layers","owns","agent","written"],ids=["list1","list1","list1","list2","list2","list2","list2","list2"];
  stepLoop(ctx,cx,cy,rx,ry,t,{a:1,on:STEPS10.map(()=>0.35),noLabels:1});
  withA(ctx,1,()=>{glass(ctx,cx-200,cy-54,400,108,20,WEED,{glow:18,ea:0.85,fill:"rgba(7,12,24,0.96)"});T(ctx,"1 · this film",cx,cy-12,{f:"mono",w:500,size:18,align:"center",color:rgba(WEED,1)});T(ctx,"A model is not a transformation",cx,cy+24,{w:800,size:22,align:"center"});});
  withA(ctx,fin(t,0.2,0.5),()=>T(ctx,"The next eight films",960,90,{w:800,size:36,align:"center"}));
  MT_FILMS.forEach(([n,title,st],i)=>{const a=fin(t,w(ids[i],words[i])-0.2,0.5),an=-Math.PI/2+(st.reduce((s,x)=>s+x,0)/st.length)/10*TAU,px=cx+Math.cos(an)*(rx+300),py=cy+Math.sin(an)*(ry+120);
    const lit=st.map(k=>k),ox=lerp(cx,px,ease(a)),oy=lerp(cy,py,ease(a));
    lit.forEach(k=>{const[sx,sy]=stepPos(k,cx,cy,rx,ry);withA(ctx,a,()=>{ctx.strokeStyle=rgba(WEED,0.5);ctx.lineWidth=1.5;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ox,oy);ctx.stroke();ctx.setLineDash([]);glow(ctx,sx,sy,50,WEED,0.3);});});
    mt_filmCard(ctx,ox,oy,n,title,a,pulseAt(t,w(ids[i],words[i]),1.2));});
  vign(ctx,S);});

/* ---------- 11. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const cD=c("data");histBg(ctx,S,t);
  // the past: the 1870s blueprint over a finished building
  withA(ctx,fin(t,0.2,0.6),()=>{ctx.save();ctx.beginPath();ctx.rect(0,0,W/2,H);ctx.clip();const bu=fin(t,w("bp","makes it true"),1.2);
    ctx.fillStyle="rgba(90,64,40,0.9)";ctx.fillRect(0,820,W/2,H-820);
    withA(ctx,bu,()=>{const bx=230,by=520,bw=500,bh=300;ctx.fillStyle="rgba(150,84,54,1)";ctx.fillRect(bx,by,bw,bh);for(let r=0;r<15;r++)for(let k=0;k<13;k++){ctx.strokeStyle="rgba(70,36,22,0.5)";ctx.lineWidth=1;ctx.strokeRect(bx+k*40-(r%2)*20,by+r*20,40,20);}
      ctx.fillStyle="rgba(60,40,30,1)";ctx.beginPath();ctx.moveTo(bx-30,by);ctx.lineTo(bx+bw/2,by-150);ctx.lineTo(bx+bw+30,by);ctx.closePath();ctx.fill();
      [[300,600],[600,600]].forEach(([wx,wy])=>{ctx.fillStyle="rgba(255,220,150,0.8)";ctx.fillRect(wx,wy,70,80);});ctx.fillStyle="rgba(50,30,20,1)";ctx.fillRect(450,680,70,140);});
    mt_print(ctx,250,100,460,285,1,t,{});yearTag(ctx,60,60,"1870s",CLAY,1);ctx.restore();});
  // the present: the credential blueprint over the lineage graph, its core lit
  const rA=fin(t,cD-0.2,0.8);withA(ctx,rA,()=>{ctx.save();ctx.beginPath();ctx.rect(W/2,0,W/2,H);ctx.clip();ctx.fillStyle="#05080f";ctx.fillRect(W/2,0,W/2,H);
    lineageGraph(ctx,1030,520,820,400,t,{core:1,dim:0.35,heads:0.7});bpPaper(ctx,1080,90,720,280,1,{title:"CREDENTIAL MODEL · v3"});bpModel(ctx,1440,260,0.6,{b:1});
    withA(ctx,fin(t,w("data","dbt"),0.5),()=>tag(ctx,1440,440,"built with dbt",[255,160,110],{align:"center",size:20}));ctx.restore();});
  ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fillRect(W/2-1,0,2,H);
  withA(ctx,fin(t,w("bp","blueprint"),0.5),()=>tag(ctx,480,440,"the blueprint",BPL,{align:"center",size:20}));withA(ctx,fin(t,w("bp","building work"),0.5),()=>tag(ctx,480,900,"the building work",CLAY,{align:"center",size:20}));
  withA(ctx,rA,()=>{tag(ctx,1440,60,"the model",BPL,{align:"center",size:20});tag(ctx,1440,975,"the building work: transformations",[255,160,110],{align:"center",size:20});});
  weedsEnd(ctx,S,t,B,"A model is not a transformation",WEED,"Declare it. Then build it.");
  fadeIn(ctx,S,t,0.01);vign(ctx,S);});
