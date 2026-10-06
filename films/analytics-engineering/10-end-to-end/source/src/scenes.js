/* ===== End to end: scenes =====
   Twelve chapters, as in ../script.md. York, the fourteenth century: a window drawn full size on a plaster floor, carved, and drawn
   over; then one new consumer, Finance, taken through the ten steps in the example project, one commit per step; and the whole
   building at the end: every file in a home named for its domain, every file with a lifetime, and the series, closed.
   Every present-day chapter carries the ten commits along the top (ee_ledger), still while the camera drifts, and the step's
   commit on the left, its files appearing as they're named: + added, ~ changed, − deleted; temporary files dashed.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts slowly (drift), things arrive with a spring (arrive),
   dust gives depth (motes). Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here. */

// the commit card's place, and the cards' place on the right
const EE_CX=60,EE_CW=600,EE_RX=700,EE_RW=1160;
// one step's frame: the background, and the drift starts; ee_top draws the ledger, still, after the drift is undone
function ee_bg(ctx,S,t,sc,o){setScreen(ctx,S);bg2(ctx);motes(ctx,t);ctx.save();drift(ctx,t,sc,o||{z:0.025,y:520});}
function ee_top(ctx,S,t,step,counted){ctx.restore();setScreen(ctx,S);ee_ledger(ctx,t,{cur:step,counted,a:fin(t,0,0.6)});vign(ctx,S);}

/* ---------- 1. The tracing floor ---------- */
const EE_FL={x:150,y:150,w:1010,h:720},EE_WC=[655,820,150];
scene("floor",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.04,y:500});
  const cT=c("templates"),cO=c("over"),cS=c("stayed"),cB=c("bridge"),F=EE_FL,[wx,wy,ws]=EE_WC;
  const flA=fin(t,0.2,0.8)*(1-fin(t,cB+0.4,0.8)),slide=-120*ease(fin(t,cS-0.4,1.2));
  yearTag(ctx,120,100,"14th century · York Minster",CLAY,fin(t,0.3,0.6)*(1-fin(t,cB,0.6)));
  ctx.save();ctx.translate(slide,0);
  ee_plaster(ctx,F.x,F.y,F.w,F.h,t,{a:flA});
  // the window, drawn full size with dividers, its lines cut into the plaster
  const pW=clamp((t-0.9)/(cT-1.2),0,1),fresh=clamp((t-w("over","plastered again")+0.2)/2.0,0,1);
  if(flA>0.01){const tip=ee_cut(ctx,EE_WIN,wx,wy,ws,pW,{a:flA*(1-0.82*fresh)});
    if(tip&&pW<1&&tip.seg[0]!=="l"){const sg=tip.seg;ee_dividers(ctx,tip.X(sg[1]),tip.Y(sg[2]),tip.x,tip.y,flA);}
    // the next drawing, over the first: a rose
    const pR=clamp((t-cO-0.2)/(w("over","plastered again")-cO-0.4),0,1);
    const tipR=ee_cut(ctx,EE_ROSE,780,450,150,pR,{a:flA*(1-0.82*fresh),dark:rgba(mix(EE_INC,[150,60,40],0.35),0.82)});
    if(tipR&&pR<1&&tipR.seg[0]!=="l"){const sg=tipR.seg;ee_dividers(ctx,tipR.X(sg[1]),tipR.Y(sg[2]),tipR.x,tipR.y,flA);}
    ee_fresh(ctx,F.x,F.y,F.w,F.h,fresh,flA,{cover:0.86});
    withA(ctx,flA,()=>{arrive(ctx,F.x+170,F.y+F.h-40,t,w("drew","full size"),()=>withA(ctx,1-fin(t,cT,0.5),()=>tag(ctx,F.x+170,F.y+F.h-40,"full size, on plaster",CLAY,{align:"center",size:20})),{dy:12});
      arrive(ctx,F.x+F.w-190,F.y+50,t,w("over","drawn over"),()=>withA(ctx,1-fin(t,cS,0.5),()=>tag(ctx,F.x+F.w-190,F.y+50,"the next, drawn over it",CLAY,{align:"center",size:20})),{dy:12});
      arrive(ctx,F.x+F.w/2,F.y+F.h-40,t,w("over","plastered again"),()=>withA(ctx,1-fin(t,cB,0.5),()=>tag(ctx,F.x+F.w/2,F.y+F.h-40,"plastered again · the old lines faint beneath",CLAY,{align:"center",size:20})),{dy:12});});}
  ctx.restore();
  // a template cut from the drawing, the stone carved to match it
  const tT=w("templates","wooden template")-0.3,lift=ease(fin(t,tT,1.2)),carve=clamp((t-w("templates","carved")+0.2)/2.2,0,1),stA=fin(t,cT,0.7)*(1-fin(t,cS-0.3,0.6));
  if(stA>0.01){withA(ctx,stA,()=>{ee_stone(ctx,1290,600,380,220,carve,t,1);
    ee_template(ctx,lerp(wx-20,1480,lift),lerp(wy-470,500,lift),lerp(0.9,0.85,lift),1,lerp(0.4,0,lift));
    arrive(ctx,1480,440,t,tT+0.6,()=>tag(ctx,1480,440,"a wooden template",PARCH,{align:"center",size:20}),{dy:12});
    arrive(ctx,1480,880,t,w("templates","carved"),()=>tag(ctx,1480,880,"the stone, carved to match",PARCH,{align:"center",size:20}),{dy:12});});}
  // what stayed: the window, in stone, with light through its glass
  const wA=fin(t,cS-0.2,1.0)*(1-fin(t,cB+0.4,0.8));
  if(wA>0.01){arrive(ctx,1440,560,t,cS-0.2,()=>withA(ctx,wA,()=>{ee_window(ctx,1440,880,170,t,1);}),{d:1.2,dy:40,from:0.9});
    arrive(ctx,1440,150,t,w("stayed","The windows"),()=>withA(ctx,wA,()=>tag(ctx,1440,150,"what stayed",TRUST,{align:"center",size:22})),{dy:12});
    arrive(ctx,560,110,t,w("stayed","drawings"),()=>withA(ctx,wA,()=>tag(ctx,700,110,"for the work",EE_TMP,{align:"center",size:22})),{dy:12});}
  // the bridge: files for the work, dashed, and files that stay
  if(t>cB-0.3){const bA=fin(t,cB,0.8)*(1-fin(t,B-0.6,0.6));withA(ctx,bA,()=>{
    T(ctx,"a project has both",960,190,{w:800,size:40,align:"center",color:rgba(PARCH,1)});
    const work=["_finance__requirements.yml","Q-FIN-01","REQ-FIN-02"],stay=["_finance__conceptual.yml","_finance__decisions.yml","mart_finance__tuition_forgone.sql"];
    work.forEach((s,i)=>{const t0=w("bridge","files for the work")+i*0.25,gone=fin(t,w("bridge","deleted")+i*0.2,0.6);arrive(ctx,560,330+i*90,t,t0,()=>withA(ctx,1-0.5*gone,()=>{ee_node(ctx,330,330+i*90,s,EE_TMP,{dash:1,on:0.3});
      if(gone>0){const ww=tw(ctx,s,18,500,"mono");ctx.strokeStyle=rgba(EE_DEL,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(346,330+i*90);ctx.lineTo(346+(ww+8)*ease(gone),330+i*90);ctx.stroke();}}),{dy:16});});
    stay.forEach((s,i)=>{arrive(ctx,1360,330+i*90,t,w("bridge","files that stay")+i*0.25,()=>ee_node(ctx,1130,330+i*90,s,TRUST,{on:0.6}),{dy:16});});
    arrive(ctx,560,640,t,w("bridge","files for the work"),()=>tag(ctx,560,640,"for the work · deleted when it's done",EE_TMP,{align:"center",size:20}),{dy:12});
    arrive(ctx,1360,640,t,w("bridge","files that stay"),()=>tag(ctx,1360,640,"what stays",TRUST,{align:"center",size:20}),{dy:12});
    arrive(ctx,960,760,t,w("bridge","one new question"),()=>T(ctx,"one new question, from start to end",960,770,{w:700,size:30,align:"center",color:rgba(PARCH,1)}),{dy:14});});}
  ctx.restore();weedsTitle(ctx,S,t,B,"End to end","one question, every file it touches, and the ones that leave",WEED);
  if(t>B){ctx.save();drift(ctx,t,sc,{z:0.04,y:500});withA(ctx,0.5*fin(t,B+0.3,1.0),()=>ee_window(ctx,960,1056,58,t,1));ctx.restore();}
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. A new question (step 1: scope) ---------- */
const EE_R1=[["+","_finance__conceptual.yml","models/marts/finance/",""],["+","_finance__conceptual.md","models/marts/finance/",""],["+","_finance__decisions.yml","models/marts/finance/",""],
  ["+","_finance__definitions.md","models/marts/finance/","gen"],["+","_finance__exposures.yml","exposures/finance/",""],["+","_finance__requirements.yml","requirements/exposures/finance/","tmp"],
  ["~","_groups.yml","models/",""],["~","_shared__conceptual.yml","models/_shared/",""],["~","_shared__conceptual.md","models/_shared/","gen"],["~","decisions.md","docs/","gen"]];
const EE_Q1=["question:","  asked_by: Finance","  text: >","    How much tuition does recognised credit save learners, by faculty, as at census date?","  decision: >","    Next year's revenue forecast, and the price of microcredentials."];
const EE_D1=["  - id: DEC-FIN-01","    step: scope","    title: Recognised credit only, on the public core","    …","    decided_by: Finance, with Noor, data architect","    decided_on: 2026-10-19"];
const EE_REQ1=["  - id: REQ-FIN-01","    type: requirement","    title: Match Finance's own number","    …","    status: open","    done_when: >","      A reconciliation test compares the mart with Finance's tuition report, faculty by faculty,","      and passes on every build."];
scene("question",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cA=c("asks"),cK=c("kind"),cF=c("files"),cO=c("open"),E=sc.dur;
  // Finance arrives, as a team, with its question
  const qA=1-fin(t,cF-0.5,0.6);
  arrive(ctx,1640,250,t,0.4,()=>withA(ctx,qA,()=>{ee_team(ctx,1640,230,1.1,EE_FIN,t);T(ctx,"Finance",1640,370,{w:800,size:24,align:"center"});T(ctx,"a new consumer",1640,398,{w:600,size:19,align:"center",color:rgba(SOFT,1)});}),{dy:24});
  arrive(ctx,1010,250,t,w("arrives","Finance")-0.2,()=>withA(ctx,qA,()=>ee_qcard(ctx,EE_RX,200,520,"finance","a new question","from Finance",1)),{dy:20});
  arrive(ctx,1180,410,t,cA,()=>withA(ctx,qA,()=>wrapT(ctx,"How much tuition does recognised credit save learners, by faculty, as at census date?",EE_RX,380,840,{w:800,size:34,lh:44})),{dy:16,from:0.95});
  arrive(ctx,1180,520,t,c("decides"),()=>withA(ctx,qA,()=>wrapT(ctx,"It sets next year's revenue forecast, and the price of microcredentials.",EE_RX,530,860,{w:600,size:24,color:rgba(SOFT,1)})),{dy:12});
  // the three kinds of domain; Finance is a business domain, with folders named for it
  const kA=fin(t,cK-0.2,0.6)*qA;if(kA>0.01)withA(ctx,kA,()=>{[["application","a system and its team",[110,170,255]],["data","what the facts mean",TRUST],["business","who decides with the data",EE_FIN]].forEach(([k,d,col],i)=>{
      const x=EE_RX+i*390,on=i===2?fin(t,w("kind","business domain"),0.5):0;withA(ctx,0.45+0.55*(i===2?on:0.4),()=>{glass(ctx,x,620,370,92,14,col,{glow:6+12*on,ea:0.75,fill:"rgba(7,12,24,0.95)"});
        T(ctx,k+" domain",x+20,656,{w:800,size:22,color:rgba(col,1)});T(ctx,d,x+20,690,{w:600,size:19,color:rgba(SOFT,1)});});});
    [["models/marts/finance/",EE_FIN],["exposures/finance/",EE_FIN]].forEach(([s,col],i)=>arrive(ctx,EE_RX+800+i*0,770+i*62,t,w("kind","folders")+i*0.3,()=>ee_folder(ctx,EE_RX+780,766+i*60,s,col,{on:0.6}),{dy:12}));});
  // step one: the conceptual model holds the question; the decision log, the first decision; and the open requirements, dashed
  const fA=fin(t,cF-0.3,0.6);
  if(fA>0.01){arrive(ctx,EE_RX+EE_RW/2,260,t,cF-0.2,()=>ee_code(ctx,EE_RX,150,EE_RW,"models/marts/finance/_finance__conceptual.yml",EE_Q1,{size:19,lh:30,wrap:92,edge:BPL,p:clamp((t-cF)/1.6,0,1),lit:{3:fin(t,w("files","holds the question"),0.5)}}),{dy:24});
    arrive(ctx,EE_RX+280,560,t,w("files","decision log")-0.2,()=>ee_code(ctx,EE_RX,440,560,"_finance__decisions.yml",EE_D1,{size:18,lh:28,wrap:46,edge:KIND,p:clamp((t-w("files","decision log"))/1.4,0,1),lit:{2:fin(t,w("files","recognised credit"),0.5)}}),{dy:24});}
  if(t>cO-0.4)arrive(ctx,EE_RX+870,600,t,cO-0.1,()=>ee_code(ctx,EE_RX+590,440,570,"_finance__requirements.yml",EE_REQ1,{tmp:1,size:18,lh:28,wrap:47,p:clamp((t-cO)/1.6,0,1),lit:{2:fin(t,w("open","match Finance"),0.5)},litCol:EE_TMP}),{dy:24});
  // the work itself lives in the backlog tool; the project keeps only what's still open
  if(t>c("backlog")-0.4){arrive(ctx,EE_RX+260,842,t,c("backlog"),()=>tag(ctx,EE_RX,842,"the backlog tool · who, when, how big",KIND,{size:20}),{dy:12});
    arrive(ctx,EE_RX+860,842,t,w("backlog","only what's still open"),()=>tag(ctx,EE_RX+590,842,"requirements/ · only what's still open",EE_TMP,{size:20}),{dy:12});}
  // the commit, its files appearing as they're named
  const on=[w("files","conceptual model"),w("files","conceptual model")+0.3,w("files","decision log"),w("files","decision log")+0.4,w("kind","folders"),w("open","Finance's open"),w("kind","folders")+0.4,w("files","conceptual model")+0.6,w("files","conceptual model")+0.9,w("files","decision log")+0.6].map(x=>fin(t,x,0.4));
  arrive(ctx,EE_CX+EE_CW/2,450,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,0,"the question, and a new business domain",EE_R1,{on,hi:{5:pulseAt(t,w("open","won't last"),2.4)}}),{dy:24});
  ee_top(ctx,S,t,0,fin(t,E-1.6,0.6));});

/* ---------- 3. What the core holds (step 2: source reality) ---------- */
const EE_R2=[["+","profile_credit_across_awards.sql","analyses/profiling/",""],["~","_finance__requirements.yml","requirements/exposures/finance/","tmp"],["+","tuition_rates.csv","seeds/reference/finance/",""],
  ["+","_finance__seeds.yml","seeds/reference/finance/",""],["~","dbt_project.yml","",""]];
const EE_PROF=["-- Evidence: recognised credit counts towards every award it could count towards, so one","-- microcredential can be counted against two or three awards.","…","    sum(credit_at_census.credit_points_from_microcredentials) as credit_points_across_awards,","    sum(","        case","            when learners_at_census.enrolled_award_key = credit_at_census.award_key","                then credit_at_census.credit_points_from_microcredentials","…"];
const EE_QF=["  - id: Q-FIN-01","    type: question","    title: The award recognised credit saves tuition in","    …","    owner: Finance","    status: open","    evidence: [analyses/profiling/profile_credit_across_awards.sql]"];
const EE_RATES=["award_type,rate_year,rate_per_credit_point,currency,published_by,published_on","graduate certificate,2025,400,AUD,Finance,2024-10-31","master,2025,455,AUD,Finance,2024-10-31","graduate certificate,2026,420,AUD,Finance,2025-10-31","master,2026,480,AUD,Finance,2025-10-31"];
scene("sources",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cA=c("across"),cN=c("numbers"),cW=c("which"),cR=c("rates"),E=sc.dur;
  // the agent profiles the core, not the sources
  const pA=1-fin(t,cA-0.3,0.5);
  kt_agent(ctx,EE_RX+40,190,22,t,{a:fin(t,0.4,0.6)*(1-fin(t,cW-0.5,0.4)),busy:1-fin(t,cN,1)});
  arrive(ctx,EE_RX+640,420,t,w("profile","profiles the core")-0.6,()=>withA(ctx,pA,()=>ee_code(ctx,EE_RX+90,160,EE_RW-90,"analyses/profiling/profile_credit_across_awards.sql",EE_PROF,{size:18,lh:29,p:clamp((t-w("profile","profiles the core")+0.4)/1.6,0,1)})),{dy:24});
  arrive(ctx,EE_RX+400,780,t,w("profile","not the sources"),()=>withA(ctx,pA,()=>{ee_folder(ctx,EE_RX+90,780,"sources/",[110,170,255],{a:0.5});ee_folder(ctx,EE_RX+330,780,"models/core/",TRUST,{on:1});
      arrowTo(ctx,EE_RX+520,840,EE_RX+520,880,TRUST,0.0,{});tag(ctx,EE_RX+640,780,"the core: what Finance reads",TRUST,{size:20});}),{dy:12});
  // Aisha's credit: one learner, recognised credit counted towards three awards
  const aA=fin(t,cA-0.2,0.6)*(1-fin(t,cW-0.4,0.6));if(aA>0.01)withA(ctx,aA,()=>{
    arrive(ctx,EE_RX+170,420,t,cA-0.1,()=>{glass(ctx,EE_RX+20,360,330,120,18,KIND,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.96)"});T(ctx,"Aisha",EE_RX+44,404,{w:800,size:26});T(ctx,"SIS|S-20417",EE_RX+44,440,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});
      T(ctx,"recognised credit",EE_RX+44,466,{w:600,size:18,color:rgba(SOFT,1)});},{dy:20});
    [["GCDA","Graduate Certificate in Data Analytics",15],["MDA","Master of Data Analytics",10],["GCCS","Graduate Certificate in Cyber Security",5]].forEach(([code,nm,cp],i)=>{const y=270+i*130,t0=w("across","counts towards three")+i*0.3;
      arrive(ctx,EE_RX+760,y,t,t0,()=>{glass(ctx,EE_RX+560,y-46,560,92,14,KIND,{glow:8,ea:0.75,fill:"rgba(7,12,24,0.95)"});T(ctx,code,EE_RX+584,y-8,{f:"mono",w:500,size:22,color:rgba(KIND,1)});
        T(ctx,nm,EE_RX+690,y-8,{w:600,size:18,color:rgba(SOFT,1)});T(ctx,cp+" credit points",EE_RX+584,y+26,{f:"mono",w:500,size:18});},{dy:16});
      arrowTo(ctx,EE_RX+360,420,EE_RX+550,y,KIND,fin(t,t0,0.4),{p:fin(t,t0,0.6),head:12,bend:0.05*(1-i)});});
    arrive(ctx,EE_RX+900,700,t,w("numbers","Added up"),()=>{T(ctx,"385",EE_RX+580,720,{w:800,size:54,color:rgba(EE_AMB,1)});T(ctx,"credit points, added up across awards",EE_RX+700,712,{w:600,size:20,color:rgba(SOFT,1)});},{dy:14});
    arrive(ctx,EE_RX+900,790,t,w("numbers","enrolled in"),()=>{T(ctx,"160",EE_RX+580,810,{w:800,size:54,color:rgba(TRUST,1)});T(ctx,"in the award each learner is enrolled in",EE_RX+700,802,{w:600,size:20,color:rgba(SOFT,1)});},{dy:14});});
  // the question opens, with the query as evidence; Finance's rates arrive as its own reference data
  const qA=fin(t,cW-0.2,0.6)*(1-fin(t,cR-0.3,0.5));
  if(qA>0.01){arrive(ctx,EE_RX+580,380,t,cW,()=>withA(ctx,qA,()=>ee_code(ctx,EE_RX,180,EE_RW,"requirements/exposures/finance/_finance__requirements.yml",EE_QF,{tmp:1,size:19,lh:30,p:clamp((t-cW)/1.6,0,1),lit:{2:fin(t,w("which","Which one"),0.5),6:fin(t,w("which","evidence"),0.5)},litCol:EE_TMP})),{dy:24});
    arrive(ctx,EE_RX+300,620,t,w("which","Finance owns"),()=>withA(ctx,qA,()=>{ee_badge(ctx,EE_RX+60,640,30,"finance",null,{});tag(ctx,EE_RX+110,640,"Finance owns the answer",EE_FIN,{size:20});}),{dy:12});
    arrive(ctx,EE_RX+840,640,t,w("which","No rule"),()=>withA(ctx,qA,()=>tag(ctx,EE_RX+640,640,"no rule can say",SOFT,{size:20})),{dy:12});}
  const rA=fin(t,cR-0.2,0.6);
  if(rA>0.01){arrive(ctx,EE_RX+EE_RW/2,300,t,cR,()=>ee_code(ctx,EE_RX,180,EE_RW,"seeds/reference/finance/tuition_rates.csv",EE_RATES,{size:19,lh:32,edge:EE_FIN,p:clamp((t-cR-0.2)/1.4,0,1),lit:{3:fin(t,w("rates","tuition rates"),0.5),4:fin(t,w("rates","tuition rates")+0.2,0.5)},litCol:EE_FIN}),{dy:24});
    arrive(ctx,EE_RX+500,520,t,w("rates","reference data"),()=>{tag(ctx,EE_RX,520,"reference data · owned by Finance",EE_FIN,{size:20});tag(ctx,EE_RX+400,520,"meta: {owner: Finance, domain: finance}",SOFT,{size:18});},{dy:12});}
  const on=[w("profile","profiles the core")-0.3,cW+0.2,w("rates","tuition rates"),w("rates","reference data"),w("rates","its own")].map(x=>fin(t,x,0.4));
  arrive(ctx,EE_CX+EE_CW/2,320,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,1,"credit counted towards several awards",EE_R2,{on,hi:{1:pulseAt(t,cW+0.4,2.4)}}),{dy:24});
  ee_top(ctx,S,t,1,fin(t,E-1.6,0.6));});

/* ---------- 4. One row of what (step 3: consumer output) ---------- */
const EE_R3=[["~","_finance__conceptual.yml","models/marts/finance/",""],["~","_finance__decisions.yml","models/marts/finance/",""],["~","_finance__requirements.yml","requirements/exposures/finance/","tmp"],
  ["~","_finance__definitions.md","models/marts/finance/","gen"],["~","decisions.md","docs/","gen"]];
const EE_RULE=["    rules:","      - As at census date (var census_date) - every entity is read at its version valid that day.","      - Recognised credit only (microcredentials and short-course certificates a faculty recognises); units passed are paid for.","      - Only in the award the learner is enrolled in on census day. Credit that counts towards other awards saves nothing there yet."];
const EE_D2=["  - id: DEC-FIN-02","    step: consumer_output","    title: Tuition is saved in the enrolled award only","    …","    decided_by: Finance","    was: Q-FIN-01"];
const EE_REQ3=["  - id: Q-FIN-01","    type: question","    title: The award recognised credit saves tuition in","  - id: REQ-FIN-02","    type: requirement","    title: The rows and columns the forecast needs","    status: open"];
scene("output",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cM=c("moves"),cD=c("deleted"),cG=c("grain"),cU=c("until"),E=sc.dur;
  // Finance answers: Aisha's credit saves tuition in GCDA, the award she's enrolled in
  const ansA=1-fin(t,cM-0.4,0.6);
  arrive(ctx,EE_RX+400,260,t,0.5,()=>withA(ctx,ansA,()=>{ee_badge(ctx,EE_RX+50,250,34,"finance",null,{});glass(ctx,EE_RX+110,200,1040,104,20,EE_FIN,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.96)"});
    wrapT(ctx,"Only the award the learner is enrolled in, on census day.",EE_RX+136,262,980,{w:800,size:28});}),{dy:16});
  if(ansA>0.01)withA(ctx,ansA,()=>[["GCDA",15,1],["MDA",10,0],["GCCS",5,0]].forEach(([code,cp,on],i)=>{const x=EE_RX+110+i*350,q=fin(t,w("answer","enrolled in")+0.3,0.6);
    arrive(ctx,x+150,460,t,w("answer","First")+i*0.2,()=>{glass(ctx,x,410,320,100,14,on?TRUST:KIND,{glow:on?18*q:6,ea:0.75,fill:"rgba(7,12,24,0.95)"});withA(ctx,on?1:1-0.6*q,()=>{T(ctx,code,x+24,452,{f:"mono",w:500,size:22,color:rgba(on?TRUST:KIND,1)});T(ctx,cp+" credit points",x+24,486,{f:"mono",w:500,size:18});});
      if(on)withA(ctx,q,()=>tag(ctx,x+160,540,"Aisha is enrolled here",TRUST,{align:"center",size:20}));},{dy:16});}));
  // the answer moves where it lasts: a rule in the conceptual model, a decision in the log; the question is deleted
  const mA=fin(t,cM-0.3,0.6)*(1-fin(t,cG-0.4,0.6));
  if(mA>0.01)withA(ctx,mA,()=>{arrive(ctx,EE_RX+EE_RW/2,250,t,cM-0.2,()=>ee_code(ctx,EE_RX,150,EE_RW,"models/marts/finance/_finance__conceptual.yml",EE_RULE,{size:18,lh:28,wrap:100,edge:BPL,lit:{3:fin(t,w("moves","a rule"),0.5)},litCol:TRUST}),{dy:24});
    arrive(ctx,EE_RX+280,600,t,w("moves","a decision"),()=>ee_code(ctx,EE_RX,470,560,"_finance__decisions.yml",EE_D2,{size:18,lh:28,wrap:46,edge:KIND,lit:{5:fin(t,w("deleted","where it came from"),0.5)}}),{dy:24});
    arrive(ctx,EE_RX+870,600,t,w("moves","a decision")+0.2,()=>ee_code(ctx,EE_RX+590,470,570,"_finance__requirements.yml",EE_REQ3.slice(0,3),{tmp:1,size:18,lh:28,wrap:47,strike:{0:fin(t,w("deleted","question is deleted"),0.6),1:fin(t,w("deleted","question is deleted")+0.15,0.6),2:fin(t,w("deleted","question is deleted")+0.3,0.6)}}),{dy:24});
    arrive(ctx,EE_RX+870,830,t,w("deleted","Git keeps"),()=>tag(ctx,EE_RX+870,830,"git keeps it · the decision says where it came from",SOFT,{align:"center",size:19}),{dy:12});});
  // then the output, before any code: the grain in one sentence, a requirement until a contract enforces it
  const gA=fin(t,cG-0.2,0.6);
  if(gA>0.01){arrive(ctx,EE_RX+EE_RW/2,260,t,cG,()=>{T(ctx,"one row per learner per award they're enrolled in,",EE_RX+EE_RW/2,250,{w:800,size:34,align:"center"});T(ctx,"as at census date",EE_RX+EE_RW/2,300,{w:800,size:34,align:"center",color:rgba(EE_FIN,1)});},{dy:16,from:0.92});
    arrive(ctx,EE_RX+EE_RW/2,560,t,cU-0.1,()=>ee_code(ctx,EE_RX+200,400,EE_RW-400,"_finance__requirements.yml",EE_REQ3.slice(3),{tmp:1,size:19,lh:30,p:clamp((t-cU)/1.2,0,1),lit:{2:fin(t,w("until","until a contract"),0.5)},litCol:EE_TMP}),{dy:24});
    arrive(ctx,EE_RX+EE_RW/2,700,t,w("until","until a contract"),()=>tag(ctx,EE_RX+EE_RW/2,700,"open until a contract enforces it",EE_TMP,{align:"center",size:20}),{dy:12});}
  const on=[w("moves","a rule"),w("moves","a decision"),w("deleted","question is deleted"),w("moves","a rule")+0.5,w("moves","a decision")+0.5].map(x=>fin(t,x,0.4));
  arrive(ctx,EE_CX+EE_CW/2,320,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,2,"one award, and the rows Finance needs",EE_R3,{on,hi:{2:pulseAt(t,w("deleted","question is deleted"),2.4)}}),{dy:24});
  ee_top(ctx,S,t,2,fin(t,E-1.6,0.6));});

/* ---------- 5. The promise (step 4: gaps and contracts) ---------- */
const EE_R4=[["+","_finance__models.yml","models/marts/finance/",""],["+","mart_finance__tuition_forgone.sql","models/marts/finance/",""],["+","_finance__physical.md","models/marts/finance/","gen"],
  ["~","_finance__exposures.yml","exposures/finance/",""],["~","_finance__decisions.yml","models/marts/finance/",""],["~","_finance__requirements.yml","requirements/exposures/finance/","tmp"],["~","dbt_project.yml","",""],["~","decisions.md","docs/","gen"]];
const EE_COLS=[["learner_award_key","string"],["census_date","date"],["learner_key","string"],["award_key","string"],["award_type","string"],["faculty_code","string"],["credit_points_recognised","int"],["rate_per_credit_point","int"],["tuition_forgone","int"]];
const EE_EXP=["  - name: revenue_forecast","    label: Revenue forecast","    type: analysis","    …","    depends_on:","      - ref('mart_finance__tuition_forgone')"];
const EE_LIM=["        limitations:","          - id: LIM-FIN-01","            text: >","              Tuition forgone is worked out at the published rate per credit point, not from what","              each learner was charged: scholarships, discounts and fee waivers aren't in. Finance","              adjusts for them in the forecast itself."];
scene("promise",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cE=c("empty"),cG=c("gap"),cA=c("accept"),E=sc.dur;
  // the contract: the columns and types, enforced; for now, an empty table of that shape
  const kA=1-fin(t,cG-0.4,0.6);
  if(kA>0.01)withA(ctx,kA,()=>{arrive(ctx,EE_RX+290,480,t,0.5,()=>{glass(ctx,EE_RX,150,580,96+EE_COLS.length*40,16,TRUST,{glow:12,ea:0.8,fill:"rgba(6,10,20,0.95)"});
      T(ctx,"mart_finance__tuition_forgone",EE_RX+24,190,{f:"mono",w:500,size:20,color:rgba(TRUST,1)});T(ctx,"contract: enforced",EE_RX+24,222,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});
      EE_COLS.forEach(([cn,ty],i)=>{const q=fin(t,w("contract","columns")+i*0.12,0.3);withA(ctx,q,()=>{T(ctx,cn,EE_RX+24,270+i*40,{f:"mono",w:500,size:18});T(ctx,ty,EE_RX+556,270+i*40,{f:"mono",w:500,size:18,align:"right",color:rgba(KIND,1)});});});},{dy:24});
    arrive(ctx,EE_RX+290,860,t,w("contract","enforced"),()=>tag(ctx,EE_RX+290,860,"the promise, before the logic",TRUST,{align:"center",size:20}),{dy:12});
    // the empty table: its header, no rows
    const eA=fin(t,cE-0.1,0.6);arrive(ctx,EE_RX+870,300,t,cE,()=>withA(ctx,eA,()=>ee_table(ctx,EE_RX+620,180,["faculty_code","credit_points_recognised","tuition_forgone"],[],{empty:"no rows, yet",edge:TRUST})),{dy:20});
    arrive(ctx,EE_RX+870,420,t,w("empty","right shape"),()=>tag(ctx,EE_RX+870,420,"the right shape · no rows",SOFT,{align:"center",size:20}),{dy:12});
    arrive(ctx,EE_RX+870,620,t,w("empty","the forecast"),()=>ee_code(ctx,EE_RX+620,500,540,"exposures/finance/_finance__exposures.yml",EE_EXP,{size:18,lh:28,edge:EE_FIN,lit:{5:fin(t,w("empty","depends on it"),0.5)},litCol:EE_FIN}),{dy:24});});
  // a gap, accepted: a known limitation on the mart, and a decision that says why
  const gA=fin(t,cG-0.2,0.6);
  if(gA>0.01){arrive(ctx,EE_RX+EE_RW/2,250,t,cG,()=>{glass(ctx,EE_RX,170,EE_RW,150,18,EE_AMB,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.96)"});T(ctx,"a gap",EE_RX+28,214,{w:800,size:22,color:rgba(EE_AMB,1)});
      T(ctx,"expects:",EE_RX+28,256,{w:700,size:20,color:rgba(SOFT,1)});T(ctx,"what each learner was charged",EE_RX+140,256,{w:700,size:22});
      T(ctx,"holds:",EE_RX+28,296,{w:700,size:20,color:rgba(SOFT,1)});T(ctx,"the published rate, per credit point",EE_RX+140,296,{w:700,size:22});
      withA(ctx,fin(t,w("gap","Scholarships"),0.5),()=>tag(ctx,EE_RX+900,214,"scholarships · discounts",EE_AMB,{size:19}));},{dy:20});
    arrive(ctx,EE_RX+EE_RW/2,500,t,cA,()=>ee_code(ctx,EE_RX,370,EE_RW,"models/marts/finance/_finance__models.yml",EE_LIM,{size:18,lh:28,edge:TRUST,lit:{1:fin(t,w("accept","known limitation"),0.5)},p:clamp((t-cA)/1.4,0,1)}),{dy:24});
    arrive(ctx,EE_RX+EE_RW/2,700,t,w("accept","Finance accepts"),()=>{ee_badge(ctx,EE_RX+60,720,28,"finance",null,{});kt_gtick(ctx,EE_RX+84,696,13,fin(t,w("accept","Finance accepts")+0.4,0.3));
      tag(ctx,EE_RX+110,720,"accepted: LIM-FIN-01, on the mart · DEC-FIN-03, in the log, says why",TRUST,{size:20});},{dy:12});}
  const on=[w("contract","contract"),cE,w("contract","enforced")+0.3,w("empty","the forecast"),w("accept","decision"),w("contract","columns"),w("contract","enforced"),w("accept","decision")+0.3].map(x=>fin(t,x,0.4));
  arrive(ctx,EE_CX+EE_CW/2,400,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,3,"the promise, before the logic",EE_R4,{on}),{dy:24});
  ee_top(ctx,S,t,3,fin(t,E-1.6,0.6));});

/* ---------- 6. Tests first (step 5) ---------- */
const EE_R5=[["+","reconcile_finance_with_tuition_report.sql","tests/reconciliation/",""],["+","tuition_report.csv","seeds/expected/finance/",""],["+","_finance__seeds.yml","seeds/expected/finance/",""],
  ["~","_finance__models.yml","models/marts/finance/",""],["~","mart_finance__tuition_forgone.sql","models/marts/finance/",""],["~","_reconciliation__tests.yml","tests/reconciliation/",""],
  ["~","_finance__requirements.yml","requirements/exposures/finance/","tmp"],["~","_finance__physical.md","models/marts/finance/","gen"],["~","dbt_project.yml","",""]];
const EE_TESTS=["    data_tests:","      # the grain, tested as a key","      - unique_combination:","          arguments:","            columns: [learner_key, award_key]","…","          - relationships:","              arguments:","                to: ref('core_learner')","…","          - accepted_values:","              arguments:","                values: [graduate certificate, master]"];
const EE_UNIT=["  - name: recognised_credit_saves_tuition_in_the_enrolled_award_only","    …","    expect:","      format: csv","      rows: |","        learner_key,award_key,credit_points_recognised,rate_per_credit_point,tuition_forgone","        L1,A1,10,420,4200","        L2,A1,0,420,0"];
const EE_REPORT=["census_date,faculty_code,faculty_name,tuition_forgone,published_by,published_on","2026-03-31,AED,Faculty of Arts and Education,2100,Finance,2026-10-16","2026-03-31,BUS,Faculty of Business,10800,Finance,2026-10-16","2026-03-31,EIT,Faculty of Engineering and IT,42300,Finance,2026-10-16","2026-03-31,HLT,Faculty of Health,12600,Finance,2026-10-16"];
const EE_FAIL=["FAIL 1 mart_finance__tuition_forgone::recognised_credit_saves_tuition_in_the_enrolled_award_only","…","Done. PASS=150 WARN=1 ERROR=1 SKIP=7 NO-OP=2 REUSED=0 TOTAL=161"];
scene("tests",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cG=c("grain"),cU=c("unit"),cR=c("report"),cF=c("fail"),cD=c("done"),E=sc.dur;
  // the data tests, the unit test, Finance's report as an expected seed, one after another
  const tA=1-fin(t,cU-0.4,0.6);
  if(tA>0.01)arrive(ctx,EE_RX+EE_RW/2,420,t,cG-0.3,()=>withA(ctx,tA,()=>ee_code(ctx,EE_RX,150,EE_RW,"models/marts/finance/_finance__models.yml",EE_TESTS,{size:18,lh:27,edge:TRUST,p:clamp((t-cG+0.2)/2.4,0,1),
    lit:{2:fin(t,w("grain","tested as a key"),0.5),4:fin(t,w("grain","tested as a key"),0.5),8:fin(t,w("grain","Learners that exist"),0.5),12:fin(t,w("grain","award types"),0.5)}})),{dy:24});
  const uA=fin(t,cU-0.2,0.6)*(1-fin(t,cR-0.4,0.6));
  if(uA>0.01)arrive(ctx,EE_RX+EE_RW/2,360,t,cU,()=>withA(ctx,uA,()=>{ee_code(ctx,EE_RX,150,EE_RW,"models/marts/finance/_finance__models.yml · unit_tests",EE_UNIT,{size:18,lh:29,edge:TRUST,lit:{6:fin(t,w("unit","still saves"),0.5),7:fin(t,w("unit","still saves")+0.3,0.5)}});
    tag(ctx,EE_RX+EE_RW/2,560,"credit that counts towards two awards · saved once",TRUST,{align:"center",size:20});}),{dy:24});
  const rA=fin(t,cR-0.2,0.6)*(1-fin(t,cF-0.4,0.6));
  if(rA>0.01)withA(ctx,rA,()=>{arrive(ctx,EE_RX+EE_RW/2,280,t,cR,()=>ee_code(ctx,EE_RX,150,EE_RW,"seeds/expected/finance/tuition_report.csv",EE_REPORT,{size:18,lh:29,edge:EE_FIN,p:clamp((t-cR)/1.4,0,1)}),{dy:24});
    arrive(ctx,EE_RX+EE_RW/2,500,t,w("report","no model may read"),()=>tag(ctx,EE_RX+EE_RW/2,500,"an expected seed · no model may read it",EE_FIN,{align:"center",size:20}),{dy:12});
    arrive(ctx,EE_RX+EE_RW/2,640,t,w("report","reconciliation"),()=>{ee_node(ctx,EE_RX+80,640,"mart_finance__tuition_forgone",TRUST,{});ee_node(ctx,EE_RX+760,640,"tuition_report",EE_FIN,{});
      tag(ctx,EE_RX+EE_RW/2+60,710,"reconcile_finance_with_tuition_report",KIND,{align:"center",size:19});arrowTo(ctx,EE_RX+460,640,EE_RX+750,640,KIND,1,{head:12});},{dy:12});});
  // nothing can pass yet: the unit test fails, and dbt skips the mart
  const fA=fin(t,cF-0.2,0.6);
  if(fA>0.01){arrive(ctx,EE_RX+EE_RW/2,250,t,cF,()=>ee_code(ctx,EE_RX,150,EE_RW,"dbt build",EE_FAIL,{size:18,lh:30,wrap:98,edge:BAD,label:EE_RUN,lineCol:{0:BAD},lit:{2:fin(t,w("fail","doesn't even build"),0.5)},litCol:BAD}),{dy:24});
    arrive(ctx,EE_RX+300,470,t,w("fail","unit test fails"),()=>{ee_ci(ctx,EE_RX,430,560,"unit test",1,"");},{dy:16});
    arrive(ctx,EE_RX+880,470,t,w("fail","doesn't even build"),()=>{glass(ctx,EE_RX+600,430,560,60,14,SOFT,{glow:4,ea:0.6,fill:"rgba(7,12,24,0.95)"});T(ctx,"SKIP",EE_RX+624,468,{f:"mono",w:500,size:20,color:rgba(SOFT,1)});T(ctx,"mart_finance__tuition_forgone",EE_RX+700,468,{f:"mono",w:500,size:18});},{dy:16});
    arrive(ctx,EE_RX+EE_RW/2,560,t,w("fail","Nothing can pass"),()=>tag(ctx,EE_RX+EE_RW/2,560,"on purpose: nothing can pass until the logic is built",SOFT,{align:"center",size:20}),{dy:12});
    // the output requirement is done, and deleted
    arrive(ctx,EE_RX+EE_RW/2,720,t,cD-0.1,()=>ee_code(ctx,EE_RX+200,620,EE_RW-400,"_finance__requirements.yml",["  - id: REQ-FIN-02","    title: The rows and columns the forecast needs"],{tmp:1,size:19,lh:30,strike:{0:fin(t,w("done","deleted"),0.6),1:fin(t,w("done","deleted")+0.2,0.6)}}),{dy:20});
    arrive(ctx,EE_RX+EE_RW/2,840,t,w("done","grain is tested"),()=>tag(ctx,EE_RX+EE_RW/2,840,"grain tested · contract enforced · REQ-FIN-02 done",GOOD,{align:"center",size:19}),{dy:12});}
  const on=[w("report","reconciliation"),w("report","expected seed"),w("report","expected seed")+0.3,cG,w("fail","the mart"),w("report","reconciliation")+0.3,w("done","deleted"),cG+0.4,w("report","expected seed")+0.6].map(x=>fin(t,x,0.4));
  arrive(ctx,EE_CX+EE_CW/2,420,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,4,"the proofs, before the code",EE_R5,{on,hi:{6:pulseAt(t,w("done","deleted"),2.4)}}),{dy:24});
  ee_top(ctx,S,t,4,fin(t,E-1.6,0.6));});

/* ---------- 7. The build (step 6) ---------- */
const EE_R6=[["~","mart_finance__tuition_forgone.sql","models/marts/finance/",""]];
const EE_SQL=["-- as it was: each entity's version on the census date","learners_at_census as (","    select * from learners","    where {{ valid_at(census_date()) }}","…","-- the award each learner was enrolled in on the census date, and only that one (DEC-FIN-02)","enrolled as (","    select","        learner_key,","        learner_bk,","        enrolled_award_key as award_key","…","    joined.credit_points_recognised * rates_for_census.rate_per_credit_point as tuition_forgone"];
const EE_FAC=[["AED",2100,"2,100"],["BUS",10800,"10,800"],["EIT",42300,"42,300"],["HLT",12600,"12,600"]];
scene("build",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cR=c("reads"),cO=c("only"),cG=c("green"),E=sc.dur;
  // the logic, typed in steps
  const sA=1-fin(t,cO-0.3,0.6);
  if(sA>0.01)arrive(ctx,EE_RX+EE_RW/2,420,t,0.4,()=>withA(ctx,sA,()=>ee_code(ctx,EE_RX,150,EE_RW,"models/marts/finance/mart_finance__tuition_forgone.sql",EE_SQL,{size:18,lh:28,edge:EE_FIN,p:clamp((t-0.6)/(cO-1.2),0,1),
    lit:{3:fin(t,w("reads","as it was"),0.5),5:fin(t,w("reads","keeps the award"),0.5),10:fin(t,w("reads","keeps the award")+0.2,0.5),12:fin(t,w("reads","prices the credit"),0.5)},litCol:EE_FIN})),{dy:24});
  // it reads nothing but the public core and Finance's rates; no other model changes
  const lA=fin(t,cO-0.2,0.6)*(1-fin(t,cG-0.3,0.6));
  if(lA>0.01)withA(ctx,lA,()=>{const core=[["core_learner",250],["core_award",340],["core_credit_towards_award",430]];
    core.forEach(([n,y],i)=>{arrive(ctx,EE_RX+180,y,t,cO+i*0.15,()=>ee_node(ctx,EE_RX,y,n,TRUST,{on:0.5}),{dy:12});ee_flow(ctx,[[EE_RX+(n.length*10.8+44),y],[EE_RX+640,y],[EE_RX+700,560]],t,fin(t,cO+0.4,0.5),TRUST,{p:fin(t,cO+0.4,0.8),n:3});});
    arrive(ctx,EE_RX+180,560,t,cO+0.5,()=>ee_node(ctx,EE_RX,560,"tuition_rates",EE_FIN,{on:0.5}),{dy:12});ee_flow(ctx,[[EE_RX+190,560],[EE_RX+700,560]],t,fin(t,cO+0.6,0.5),EE_FIN,{p:fin(t,cO+0.6,0.8),n:3});
    arrive(ctx,EE_RX+900,560,t,cO+0.8,()=>ee_node(ctx,EE_RX+710,560,"mart_finance__tuition_forgone",EE_FIN,{on:1}),{dy:12});
    arrive(ctx,EE_RX+400,180,t,w("only","public core"),()=>tag(ctx,EE_RX,180,"the public core · Finance's own rates",TRUST,{size:20}),{dy:12});
    [["mart_planning__near_award",EE_PLN],["mart_wallet__learners",EE_WAL]].forEach(([n,col],i)=>arrive(ctx,EE_RX+900,720+i*64,t,w("only","No other team"),()=>{ee_node(ctx,EE_RX+640,720+i*64,n,col,{dark:0.6});},{dy:12}));
    arrive(ctx,EE_RX+300,752,t,w("only","No other team"),()=>tag(ctx,EE_RX,752,"no other team's model changes",SOFT,{size:20}),{dy:12});
    arrive(ctx,EE_RX+400,646,t,w("short","hard parts"),()=>tag(ctx,EE_RX,646,"the core did the hard parts: identity · timelines · credit",TRUST,{size:20}),{dy:12});});
  // every test passes; Finance's number, by faculty
  const gA=fin(t,cG-0.2,0.6);
  if(gA>0.01){arrive(ctx,EE_RX+EE_RW/2,210,t,cG,()=>ee_ci(ctx,EE_RX,170,EE_RW,"dbt build",2,"Done. PASS=157 WARN=1 ERROR=0 SKIP=0 NO-OP=3 REUSED=0 TOTAL=161"),{dy:16});
    arrive(ctx,EE_RX+500,520,t,w("green","dollars")-0.4,()=>{T(ctx,"tuition forgone, as at census date",EE_RX,350,{w:700,size:22,color:rgba(SOFT,1)});ee_bars(ctx,EE_RX,420,EE_RW-160,EE_FAC,42300,clamp((t-w("green","dollars")+0.3)/1.6,0,1),EE_FIN);
      withA(ctx,fin(t,w("green","four faculties"),0.5),()=>{T(ctx,"67,800",EE_RX+EE_RW-20,690,{w:800,size:54,align:"right",color:rgba(EE_FIN,1)});T(ctx,"dollars, across four faculties",EE_RX+EE_RW-20,726,{w:600,size:20,align:"right",color:rgba(SOFT,1)});});},{dy:16});}
  arrive(ctx,EE_CX+EE_CW/2,220,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,5,"the logic, on the public core",EE_R6,{on:[fin(t,0.6,0.4)],hi:{0:pulseAt(t,0.8,2.4)}}),{dy:24});
  ee_top(ctx,S,t,5,fin(t,E-1.6,0.6));});

/* ---------- 8. Nothing else moved (step 7: validate) ---------- */
const EE_R7=[["+","reconcile_tuition_report.sql","analyses/validation/",""]];
const EE_DIFF=[["core_learner_v1","0","0","0"],["core_award_v1","0","0","0"],["core_credential_v1","0","0","0"],["core_credential_v2","0","0","0"],["core_credit_towards_award_v1","0","0","0"],["mart_planning__near_award","0","0","0"],["mart_wallet__learners","0","0","0"],["mart_wallet__credentials","0","0","0"]];
scene("validate",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cD=c("diff"),cN=c("nothing"),E=sc.dur;
  // faculty by faculty, against Finance's report: zero difference
  const rA=1-fin(t,cD-0.3,0.6);
  if(rA>0.01)arrive(ctx,EE_RX+EE_RW/2,350,t,0.4,()=>withA(ctx,rA,()=>{ee_table(ctx,EE_RX+60,190,["faculty","in the mart","in Finance's report","difference"],[["Arts and Education","2,100","2,100","0"],["Business","10,800","10,800","0"],["Engineering and IT","42,300","42,300","0"],["Health","12,600","12,600","0"]],
      {size:20,lh:46,edge:EE_FIN,on:[0,1,2,3].map(i=>fin(t,0.8+i*0.3,0.3)),lit:{0:fin(t,w("reconcile","is zero"),0.5),1:fin(t,w("reconcile","is zero")+0.1,0.5),2:fin(t,w("reconcile","is zero")+0.2,0.5),3:fin(t,w("reconcile","is zero")+0.3,0.5)},litCol:GOOD,colCol:{3:GOOD}});
    T(ctx,"analyses/validation/reconcile_tuition_report.sql",EE_RX+60,500,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});
    arrive(ctx,EE_RX+EE_RW/2,600,t,w("reconcile","is zero"),()=>tag(ctx,EE_RX+EE_RW/2,600,"difference: 0, in every faculty",GOOD,{align:"center",size:22}),{dy:12});}),{dy:24});
  // the diff against main, built from scratch: every core table, Planning's mart, the wallet's
  const dA=fin(t,cD-0.2,0.6);
  if(dA>0.01){arrive(ctx,EE_RX+EE_RW/2,420,t,cD,()=>ee_table(ctx,EE_RX,170,["diff against main","keys only here","keys only in main","columns changed"],EE_DIFF,
      {size:18,lh:42,edge:KT_AI,on:EE_DIFF.map((_,i)=>fin(t,cD+0.4+i*0.25,0.3)),lit:Object.fromEntries(EE_DIFF.map((_,i)=>[i,fin(t,w("nothing","No key added")+i*0.08,0.4)])),litCol:GOOD,colCol:{1:GOOD,2:GOOD,3:GOOD}}),{dy:24});
    kt_agent(ctx,EE_RX+EE_RW-40,130,20,t,{a:dA*(1-fin(t,cN+1,0.6)),busy:1-fin(t,cN,1)});
    const so=fin(t,c("signoff")-0.3,0.5);
    arrive(ctx,EE_RX+EE_RW/2,620,t,w("nothing","A new consumer"),()=>withA(ctx,1-so,()=>T(ctx,"a new consumer moved nobody else's numbers",EE_RX+EE_RW/2,620,{w:800,size:30,align:"center",color:rgba(GOOD,1)})),{dy:14});
    arrive(ctx,EE_RX+EE_RW/2,680,t,w("nothing","A new consumer")+0.4,()=>withA(ctx,1-so,()=>tag(ctx,EE_RX+EE_RW/2,678,"only new: mart_finance__tuition_forgone",EE_FIN,{align:"center",size:19})),{dy:12});
    arrive(ctx,EE_RX+EE_RW/2,640,t,c("signoff"),()=>{ee_badge(ctx,EE_RX+330,640,34,"finance",null,{});kt_gtick(ctx,EE_RX+358,612,14,fin(t,w("signoff","signs off")+0.3,0.3));
      T(ctx,"Finance signs off, with every row in front of it",EE_RX+384,648,{w:700,size:24});},{dy:14});}
  arrive(ctx,EE_CX+EE_CW/2,220,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,6,"Finance's number, and nothing else moved",EE_R7,{on:[fin(t,0.8,0.4)]}),{dy:24});
  ee_top(ctx,S,t,6,fin(t,E-1.6,0.6));});

/* ---------- 9. Review and ship (step 8) ---------- */
const EE_R8=[["−","_finance__requirements.yml","requirements/exposures/finance/","tmp"]];
const EE_CHECKS=["Build and test on DuckDB","Doc blocks and key sets match the conceptual model","Physical diagram matches the YAML","Decision logs are valid and indexed","Requirements hold only what's open"];
scene("ship",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cL=c("last"),cG=c("gone"),cC=c("check"),cA=c("approve"),E=sc.dur;
  // the pull request, ready for review
  arrive(ctx,EE_RX+290,200,t,0.4,()=>{glass(ctx,EE_RX,150,560,104,18,KT_AI,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.96)"});T(ctx,"Pull request",EE_RX+24,190,{w:800,size:24});T(ctx,"Finance's tuition forgone, steps 1 to 10",EE_RX+24,224,{w:600,size:19,color:rgba(SOFT,1)});
    tag(ctx,EE_RX+430,190,"ready",GOOD,{size:18});},{dy:16});
  // the last open item: done, so deleted, with its file and its folder
  const rq=fin(t,cL-0.2,0.6),gone=fin(t,w("gone","deleted"),1.0),fold=fin(t,w("gone","its folder"),0.8);
  if(rq>0.01)withA(ctx,rq,()=>{ee_code(ctx,EE_RX,300,560,"_finance__requirements.yml",["scope: {kind: consumer, name: finance, code: FIN}","","items:","","  - id: REQ-FIN-01","    title: Match Finance's own number","    status: open"],
      {tmp:1,size:17,lh:28,strike:{4:fin(t,w("last","is done"),0.6),5:fin(t,w("last","is done")+0.2,0.6),6:fin(t,w("last","is done")+0.4,0.6)},gone:fin(t,w("gone","Finance's requirements file"),0.8)});
    arrive(ctx,EE_RX+290,610,t,w("last","the reconciliation"),()=>tag(ctx,EE_RX+290,610,"done: the reconciliation enforces it, on every build",GOOD,{align:"center",size:19}),{dy:12});
    arrive(ctx,EE_RX+260,700,t,w("gone","its folder")-0.3,()=>ee_folder(ctx,EE_RX+60,700,"requirements/exposures/finance/",EE_TMP,{dash:1,strike:fold,a:1-0.6*fold}),{dy:12});});
  // CI: the checks land one by one; the last makes sure nothing stays in requirements unless it's still open
  const ckA=fin(t,cC-0.6,0.6);
  if(ckA>0.01)EE_CHECKS.forEach((s,i)=>{const t0=cC-0.4+i*0.25;arrive(ctx,EE_RX+880,180+i*96,t,t0,()=>ee_ci(ctx,EE_RX+600,150+i*96,560,s,fin(t,t0+0.3,0.2)*2,"",{a:i===4?1:0.85,size:18}),{dy:14});});
  if(ckA>0.01)arrive(ctx,EE_RX+880,660,t,w("check","nothing stays"),()=>{T(ctx,"python scripts/check/requirements.py",EE_RX+620,656,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});tag(ctx,EE_RX+620,700,"3 requirements open · none of them Finance's",GOOD,{size:19});},{dy:12});
  // people approve; the agent never merges
  const apA=fin(t,cA-0.2,0.6);
  if(apA>0.01){arrive(ctx,EE_RX+120,800,t,w("approve","Jun approves"),()=>{ee_face(ctx,"jun",EE_RX+60,800,40,1,{t});kt_gtick(ctx,EE_RX+92,770,13,fin(t,w("approve","Jun approves")+0.4,0.3));T(ctx,"Jun · the code",EE_RX+114,808,{w:700,size:20});},{from:0.8});
    arrive(ctx,EE_RX+460,800,t,w("approve","Finance its number"),()=>{ee_badge(ctx,EE_RX+380,800,36,"finance",null,{});kt_gtick(ctx,EE_RX+410,770,13,fin(t,w("approve","Finance its number")+0.4,0.3));T(ctx,"Finance · its number",EE_RX+430,808,{w:700,size:20});},{from:0.8});
    arrive(ctx,EE_RX+900,800,t,w("approve","never merges"),()=>{kt_agent(ctx,EE_RX+760,800,20,t,{});tag(ctx,EE_RX+800,800,"the agent never merges",KT_AI,{size:20});},{from:0.8});}
  arrive(ctx,EE_CX+EE_CW/2,220,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,7,"the last open item is done, and deleted",EE_R8,{on:[fin(t,w("gone","deleted"),0.4)],hi:{0:pulseAt(t,w("gone","deleted"),2.4)}}),{dy:24});
  ee_top(ctx,S,t,7,fin(t,E-1.6,0.6));});

/* ---------- 10. Written once (step 9) ---------- */
const EE_R9=[["~","_course__columns.md","models/core/course/",""],["~","_core_course__models.yml","models/core/course/",""],["~","_finance__models.yml","models/marts/finance/",""],["~","_planning__models.yml","models/marts/planning/",""]];
const EE_REP=["$ python skills/review-metadata/find_repeats.py","2x  The award's code.","      models/marts/finance/_finance__models.yml: award_code","      models/marts/planning/_planning__models.yml: award_code","2x  The award's name on the census date.","      models/marts/finance/_finance__models.yml: award_name","      models/marts/planning/_planning__models.yml: award_name","2 description(s) written more than once"];
const EE_DOCS=["{% docs award_code %}","The registrar's code for the award, like `GCDA`.","{% enddocs %}","","{% docs award_name %}","The award's name.","{% enddocs %}"];
const EE_USE=["      - name: award_code","        description: '{{ doc(\"award_code\") }}'","      - name: award_name","        description: '{{ doc(\"award_name\") }} On the census date.'"];
scene("once",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cT=c("two"),cH=c("home"),cZ=c("zero"),E=sc.dur;
  // the agent's review finds two descriptions written twice, in Finance's YAML and Planning's
  const rA=1-fin(t,cH-0.3,0.6);kt_agent(ctx,EE_RX+30,190,22,t,{a:fin(t,0.4,0.6)*rA,busy:1-fin(t,cT,1)});
  if(rA>0.01)arrive(ctx,EE_RX+EE_RW/2,420,t,0.6,()=>withA(ctx,rA,()=>ee_code(ctx,EE_RX+80,150,EE_RW-80,"review-metadata",EE_REP,{size:18,lh:30,edge:KT_AI,p:clamp((t-0.8)/(cT+1-0.8),0,1),
    lit:{1:fin(t,w("two","the award's code"),0.5),4:fin(t,w("two","its name"),0.5),7:fin(t,w("two","written twice"),0.5)},litCol:EE_AMB})),{dy:24});
  // each becomes one doc block in the course domain, which owns the award; Finance and Planning show it with doc()
  const hA=fin(t,cH-0.2,0.6)*(1-fin(t,cZ-0.3,0.6));
  if(hA>0.01)withA(ctx,hA,()=>{arrive(ctx,EE_RX+280,330,t,cH,()=>ee_code(ctx,EE_RX,150,560,"models/core/course/_course__columns.md",EE_DOCS,{size:18,lh:28,edge:KIND,lit:{0:fin(t,w("home","one doc block"),0.5),4:fin(t,w("home","one doc block")+0.2,0.5)}}),{dy:24});
    arrive(ctx,EE_RX+280,560,t,w("home","course domain"),()=>tag(ctx,EE_RX+280,560,"the course domain owns the award",KIND,{align:"center",size:20}),{dy:12});
    [["models/marts/finance/_finance__models.yml",EE_FIN],["models/marts/planning/_planning__models.yml",EE_PLN]].forEach(([p,col],i)=>arrive(ctx,EE_RX+880,260+i*250,t,w("home","shown everywhere")+i*0.3,()=>ee_code(ctx,EE_RX+590,170+i*250,570,p,EE_USE,{size:17,lh:27,wrap:56,edge:col,seg:[[-1,'doc("award_code")',1,KIND],[-1,'doc("award_name")',1,KIND]]}),{dy:20}));});
  // zero written twice; the generated pages keep up on their own
  const zA=fin(t,cZ-0.2,0.6);
  if(zA>0.01){arrive(ctx,EE_RX+EE_RW/2,230,t,cZ,()=>ee_ci(ctx,EE_RX,180,EE_RW,"the agent's review, again",2,"0 description(s) written more than once"),{dy:16});
    [["_finance__definitions.md","models/marts/finance/"],["_finance__physical.md","models/marts/finance/"],["decisions.md","docs/"]].forEach(([f,d],i)=>{const t0=w("zero","generated pages")+i*0.3;
      arrive(ctx,EE_RX+EE_RW/2,420+i*96,t,t0,()=>{glass(ctx,EE_RX+180,380+i*96,EE_RW-360,76,14,[170,205,255],{glow:8,ea:0.7,fill:"rgba(7,12,24,0.95)"});ee_cog(ctx,EE_RX+222,418+i*96,12,t,SOFT,1,1);
        T(ctx,f,EE_RX+260,412+i*96,{f:"mono",w:500,size:20});T(ctx,d,EE_RX+260,442+i*96,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});T(ctx,"generated · up to date",EE_RX+EE_RW-200,426+i*96,{w:700,size:19,align:"right",color:rgba(GOOD,1)});},{dy:14});});}
  const on=[w("home","one doc block"),w("home","one doc block")+0.3,w("home","shown everywhere"),w("home","shown everywhere")+0.3].map(x=>fin(t,x,0.4));
  arrive(ctx,EE_CX+EE_CW/2,320,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,8,"two descriptions, written once",EE_R9,{on}),{dy:24});
  ee_top(ctx,S,t,8,fin(t,E-1.6,0.6));});

/* ---------- 11. Ready to move (step 10: operate and evolve) ---------- */
const EE_R10=[["~","mart_finance__tuition_forgone.sql","models/marts/finance/",""],["~","_finance__models.yml","models/marts/finance/",""],["~","_finance__exposures.yml","exposures/finance/",""],["~","conventions.md","docs/",""],["~","README.md","",""]];
const EE_PIN=["learners as (","    select * from {{ ref('core_learner', v=1) }}","…","    select * from {{ ref('core_award', v=1) }}","…","    select * from {{ ref('core_credit_towards_award', v=1) }}"];
const EE_TAKE=["reconcile_finance_with_tuition_report.sql","profile_credit_across_awards.sql","reconcile_tuition_report.sql"];
const EE_MOVE=[["models/marts/finance/",EE_FIN],["exposures/finance/",EE_FIN],["seeds/reference/finance/",EE_FIN],["seeds/expected/finance/",EE_FIN],["_finance__decisions.yml",KIND]];
scene("evolve",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);ee_bg(ctx,S,t,sc);
  const cC=c("choice"),cM=c("move"),cL=c("list"),E=sc.dur;
  // Finance pins the versions of the core it reads
  const pA=1-fin(t,cM-0.3,0.6);
  if(pA>0.01)withA(ctx,pA,()=>{arrive(ctx,EE_RX+EE_RW/2,280,t,0.4,()=>ee_code(ctx,EE_RX,150,EE_RW,"models/marts/finance/mart_finance__tuition_forgone.sql",EE_PIN,{size:19,lh:30,edge:EE_FIN,seg:[[-1,"v=1",fin(t,w("pin","pins"),0.5),EE_AMB]]}),{dy:24});
    // a new version arrives as a choice with a date; the lineage names Finance among who to tell
    const lA=fin(t,cC-0.2,0.6);withA(ctx,lA,()=>{[["core_credit_towards_award v1",520],["core_credit_towards_award v2",620]].forEach(([n,y],i)=>arrive(ctx,EE_RX+200,y,t,cC+i*0.4,()=>{ee_node(ctx,EE_RX,y,n,TRUST,{on:i?0.3:0.6,dash:i});
        if(i)tag(ctx,EE_RX+430,y,"a choice, with a date",EE_AMB,{size:19});},{dy:12}));
      arrive(ctx,EE_RX+840,520,t,cC+0.3,()=>{ee_node(ctx,EE_RX+520,520,"mart_finance__tuition_forgone",EE_FIN,{on:0.5});},{dy:12});
      arrive(ctx,EE_RX+1000,620,t,w("choice","who to tell"),()=>{ee_badge(ctx,EE_RX+580,640,26,"finance",null,{});tag(ctx,EE_RX+620,640,"revenue_forecast · who to tell",EE_FIN,{size:19});},{dy:12});
      arrowTo(ctx,EE_RX+340,520,EE_RX+510,520,TRUST,fin(t,cC+0.4,0.4),{head:11,p:fin(t,cC+0.4,0.6)});});});
  // Finance can move out to a project of its own, whole: its paths gather into one box
  const mA=fin(t,cM-0.2,0.6);
  if(mA>0.01){const g=ease(fin(t,w("list","Its marts")-0.2,1.6));
    arrive(ctx,EE_RX+EE_RW/2,500,t,cM,()=>{withA(ctx,g,()=>{glass(ctx,EE_RX+560,190,600,610,20,EE_FIN,{glow:18,ea:0.85,fill:"rgba(7,12,24,0.94)"});T(ctx,"Finance's own project",EE_RX+590,236,{w:800,size:24,color:rgba(EE_FIN,1)});
        T(ctx,"refs the public core across projects",EE_RX+590,268,{w:600,size:19,color:rgba(SOFT,1)});});
      EE_MOVE.forEach(([p,col],i)=>{const x0=EE_RX,y0=220+i*100,x1=EE_RX+590,y1=320+i*66,q=fin(t,cM+0.2+i*0.18,0.4);ee_folder(ctx,lerp(x0,x1,g),lerp(y0,y1,g),p,col,{a:q,on:0.4*q});});
      withA(ctx,1-g,()=>tag(ctx,EE_RX,740,"Finance's folders, named for it from the first commit",EE_FIN,{size:20}));},{dy:20});
    // and the one test and two analyses it was built with: split by purpose, so they're named one by one
    EE_TAKE.forEach((f,i)=>arrive(ctx,EE_RX+860,650+i*54,t,w("list","the test and")+i*0.25,()=>ee_node(ctx,EE_RX+600,650+i*54,f,i?SOFT:TRUST,{on:0.4}),{dy:12}));}
  const on=[w("pin","pins"),w("choice","choice"),w("choice","who to tell"),w("move","folders were named"),w("move","project of its own")].map(x=>fin(t,x,0.4));
  arrive(ctx,EE_CX+EE_CW/2,320,t,0.3,()=>ee_commit(ctx,EE_CX,150,EE_CW,9,"pinned, and ready to move out",EE_R10,{on}),{dy:24});
  ee_top(ctx,S,t,9,fin(t,E-1.6,0.6));});

/* ---------- 12. The whole building ---------- */
const EE_LOG=["39cd815 Finance, step 10 of 10 (operate and evolve): pinned, and ready to move out","43f3f76 Finance, step 9 of 10 (written once): two descriptions, written once","4efec1f Finance, step 8 of 10 (review and ship): the last open item is done, and deleted",
  "130a72c Finance, step 7 of 10 (validate): Finance's number, and nothing else moved","f761664 Finance, step 6 of 10 (build): the logic, on the public core","254da73 Finance, step 5 of 10 (tests): the proofs, before the code",
  "d4cf5d1 Finance, step 4 of 10 (gaps and contracts): the promise, before the logic","ea693b7 Finance, step 3 of 10 (consumer output): one award, and the rows Finance needs","8e325c8 Finance, step 2 of 10 (source reality): credit counted towards several awards",
  "9731784 Finance, step 1 of 10 (scope): the question, and a new business domain"];
const EE_STAY=["_finance__conceptual.yml","_finance__decisions.yml","_finance__models.yml","reconcile_finance_with_tuition_report.sql","mart_finance__tuition_forgone.sql","_finance__exposures.yml"];
const EE_WORK=["Q-FIN-01","REQ-FIN-02","REQ-FIN-01","_finance__requirements.yml"];
const EE_KINDS=[["application domains","a system, and its team",[110,170,255],["sources/student_system/","sources/learning_platform/","sources/short_courses/","models/staging/<system>/"]],
  ["data domains","what the facts mean",TRUST,["models/core/student/","models/core/course/","models/intermediate/student/","seeds/reference/student/"]],
  ["business domains","who decides with the data",EE_FIN,["models/marts/planning/","models/marts/wallet/","models/marts/finance/","exposures/<consumer>/"]]];
const EE_SERIES=["A question","the sources","the consumers","promises","proofs","layers","trusted number","an agent","written once","change"];
scene("building",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:500});
  const cS=c("stay"),cW=c("work"),cH=c("homes"),cL=c("lives"),cN=c("next"),cR=c("series"),cP=c("blueprint"),cD=c("declare");
  // ten steps, ten commits: the log
  const gA=fin(t,0.3,0.6)*(1-fin(t,cS-0.4,0.6));
  if(gA>0.01)arrive(ctx,960,470,t,0.3,()=>withA(ctx,gA,()=>{ee_code(ctx,180,170,1560,"git log --oneline",EE_LOG,{size:19,lh:31,edge:WEED,label:"",p:clamp((t-0.5)/1.8,0,1)});
    tag(ctx,960,690,"replay them, one by one, in the repository",WEED,{align:"center",size:22});}),{dy:24});
  // what arrived to stay, and what was for the work
  const sA=fin(t,cS-0.2,0.6)*(1-fin(t,cH-0.4,0.6));
  if(sA>0.01)withA(ctx,sA,()=>{T(ctx,"arrived to stay",520,200,{w:800,size:28,align:"center",color:rgba(TRUST,1)});
    EE_STAY.forEach((s,i)=>arrive(ctx,520,270+i*80,t,cS+0.1+i*0.2,()=>{const nw=tw(ctx,s,18,500,"mono")+40;ee_node(ctx,520-nw/2,270+i*80,s,TRUST,{on:0.4});},{dy:14}));
    const wA=fin(t,cW-0.2,0.6);withA(ctx,wA,()=>{T(ctx,"for the work",1400,200,{w:800,size:28,align:"center",color:rgba(EE_TMP,1)});
      EE_WORK.forEach((s,i)=>{const gone=fin(t,w("work","They're gone")+i*0.15,0.7),nw=tw(ctx,s,18,500,"mono")+40;arrive(ctx,1400,270+i*80,t,cW+0.1+i*0.2,()=>withA(ctx,1-0.7*gone,()=>{ee_node(ctx,1400-nw/2,270+i*80,s,EE_TMP,{dash:1});
        if(gone>0){ctx.strokeStyle=rgba(EE_DEL,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(1400-nw/2+16,270+i*80);ctx.lineTo(1400-nw/2+16+(nw-30)*ease(gone),270+i*80);ctx.stroke();}}),{dy:14});});
      arrive(ctx,1400,640,t,w("work","only what's still open"),()=>tag(ctx,1400,640,"git keeps them · the project says only what's open",EE_TMP,{align:"center",size:20}),{dy:12});});});
  // every file has a home: three kinds of domain; and a lifetime
  const hA=fin(t,cH-0.2,0.6)*(1-fin(t,cN-0.4,0.6));
  if(hA>0.01)withA(ctx,hA,()=>{EE_KINDS.forEach(([nm,d,col,fs],i)=>{const x=150+i*560,t0=w("homes",["Sources by system","The core by meaning","Marts and exposures"][i])-0.2,q=fin(t,t0,0.5);
      arrive(ctx,x+250,400,t,t0,()=>{glass(ctx,x,170,500,470,18,col,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,nm,x+26,214,{w:800,size:26,color:rgba(col,1)});T(ctx,d,x+26,248,{w:600,size:20,color:rgba(SOFT,1)});
        fs.forEach((f,k)=>ee_folder(ctx,x+26,312+k*80,f,col,{a:fin(t,t0+0.3+k*0.15,0.4),on:f.indexOf("finance")>=0?1:0}));},{dy:24});});
    const lA=fin(t,cL-0.2,0.6);withA(ctx,lA,()=>{[["written by hand","the conceptual models, decision logs, models, tests",TRUST,""],["generated","definitions, diagrams, the decisions index",[170,205,255],"gen"],["only while the work goes on","requirements",EE_TMP,"tmp"]].forEach(([nm,ex,col,k],i)=>{
      const x=150+i*560,q=fin(t,w("lives",["written by hand","generated","kept only"][i])-0.1,0.4);withA(ctx,q,()=>{glass(ctx,x,680,500,110,16,col,{glow:8,ea:0.8,fill:"rgba(7,12,24,0.95)"});
        if(k==="gen")ee_cog(ctx,x+34,722,12,t,SOFT,1,1);if(k==="tmp"){ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(EE_TMP,0.9);ctx.lineWidth=2;rr(ctx,x-6,674,512,122,20);ctx.stroke();ctx.restore();}
        T(ctx,nm,x+(k==="gen"?60:26),730,{w:800,size:22,color:rgba(col,1)});wrapT(ctx,ex,x+26,764,460,{w:600,size:18,color:rgba(SOFT,1)});});});});});
  // the next question starts the same way: folders of its own, and one file that won't last
  const nA=fin(t,cN-0.2,0.6)*(1-fin(t,cR-0.4,0.6));
  if(nA>0.01)withA(ctx,nA,()=>{arrive(ctx,960,300,t,cN,()=>{glass(ctx,660,250,600,100,18,WEED,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.96)"});T(ctx,"the next question",960,296,{w:800,size:28,align:"center",color:rgba(WEED,1)});
      T(ctx,"from anyone, at any time",960,330,{w:600,size:20,align:"center",color:rgba(SOFT,1)});},{dy:16});
    arrive(ctx,960,460,t,w("next","folders of its own"),()=>{const fw=ee_folder(ctx,0,0,"models/marts/<consumer>/",EE_FIN,{a:0});ee_folder(ctx,960-fw/2,460,"models/marts/<consumer>/",EE_FIN,{on:0.5});},{dy:12});
    arrive(ctx,960,540,t,w("next","folders of its own")+0.3,()=>{const fw=ee_folder(ctx,0,0,"exposures/<consumer>/",EE_FIN,{a:0});ee_folder(ctx,960-fw/2,540,"exposures/<consumer>/",EE_FIN,{on:0.5});},{dy:12});
    arrive(ctx,960,640,t,w("next","one file"),()=>{const fw=ee_folder(ctx,0,0,"requirements/exposures/<consumer>/",EE_TMP,{a:0});ee_folder(ctx,960-fw/2,640,"requirements/exposures/<consumer>/",EE_TMP,{dash:1});
      tag(ctx,960,710,"one file that won't last",EE_TMP,{align:"center",size:20});},{dy:12});});
  // the series: the ten steps, each lit as it's named
  const rA=fin(t,cR-0.2,0.6)*(1-fin(t,cP-0.4,0.8));
  if(rA>0.01){const on=EE_SERIES.map(s=>fin(t,w("series",s)-0.1,0.4));stepLoop(ctx,960,440,620,280,t,{a:rA,on,ticks:on.map((q,i)=>fin(t,w("series","change")+0.6+i*0.08,0.3)),teal:on.map((q,i)=>fin(t,w("series","change")+0.4+i*0.08,0.3))});
    arrive(ctx,960,440,t,cR,()=>withA(ctx,rA,()=>{T(ctx,"In the weeds of data crafting",960,426,{w:800,size:30,align:"center",color:rgba(WEED,1)});T(ctx,"ten films · ten steps",960,464,{w:600,size:22,align:"center",color:rgba(SOFT,1)});}),{from:0.9});}
  // the blueprint over the lineage graph; declare it, then build it
  const dA=fin(t,cP-0.3,0.9);if(dA>0.01)withA(ctx,dA,()=>{lineageGraph(ctx,260,540,1400,360,t,{core:1,dim:0.35,heads:0.8});
    arrive(ctx,960,260,t,cP-0.1,()=>{bpPaper(ctx,560,110,800,280,1,{title:"CREDENTIAL MODEL · v3"});bpModel(ctx,960,290,0.62,{b:1});},{d:1.1,from:0.9,dy:-20});
    const swap=fin(t,cD-0.3,0.4);arrive(ctx,960,450,t,w("blueprint","dbt is how"),()=>withA(ctx,1-swap,()=>T(ctx,"the model is the blueprint · dbt is how you build it",960,450,{w:700,size:28,align:"center",color:rgba(SOFT,1)})),{dy:12});
    arrive(ctx,960,458,t,cD,()=>T(ctx,"Declare it. Then build it.",960,460,{w:800,size:38,align:"center"}),{dy:14});});
  ctx.restore();setScreen(ctx,S);ee_ledger(ctx,t,{cur:9,all:1,a:fin(t,0,0.6)*(1-fin(t,cR-0.6,0.6))});
  weedsEnd(ctx,S,t,B,"End to end",WEED,"Every file in its place, for as long as it's needed.");
  vign(ctx,S);});
