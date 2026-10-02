/* ===== Promises and proofs: scenes =====
   Eight chapters, as in ../script.md. London from 1300: tested before it's marked; the gap register and its decisions; the
   enterprise contract on the core; two consumer contracts with their exposures; the tests, before the code they check; a unit
   test on the credit rule; warn or stop; and every test waiting, on purpose.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts (drift), things arrive with a spring (arrive), dust
   gives depth (motes), and what two chapters share carries across the cut: the hallmark becomes the hollow seal (1 → 8),
   the register comes back after gap 1 (2), the core band moves from the layers to under the marts (3 → 4), the outlines of the
   models carry into the unit test (5 → 6), and Jordan's revoked badge returns for the unit test's dates (2 → 6).
   Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. Tested before it's marked ---------- */
scene("assay",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t,{light:0.13});
  ctx.save();drift(ctx,t,sc,{z:0.04,y:520});
  const Ha=c("hall"),Bu=c("buyer"),Br=c("bridge"),BY=780;
  pp_bench(ctx,BY,t);
  // where and when: 1300, then 1478 at the Hall
  const yr=fin(t,w("hall","fourteen")-0.1,0.5);yearTag(ctx,120,96,"1300 · London",CLAY,fin(t,0.3,0.6)*(1-yr));yearTag(ctx,120,96,"1478 · Goldsmiths' Hall",CLAY,yr);
  // the standard, unrolled, then the Hall in its place
  pp_scroll(ctx,150,170,520,250,clamp((t-w("law","one standard")+0.3)/1.4,0,1),t,{a:1-fin(t,Ha-0.2,0.6)});
  arrive(ctx,430,330,t,w("hall","fourteen")+0.1,()=>{pp_hall(ctx,160,150,480,300,t,1);T(ctx,"Goldsmiths' Hall",400,490,{w:700,size:22,align:"center",color:rgba(PARCH,1)});},{d:1.0,from:0.92});
  const hm=fin(t,w("hall","hallmark")-0.1,0.5)*(1-fin(t,Bu+0.6,0.6)),hl=fin(t,w("hall","the hall")-0.1,0.4);
  withA(ctx,hm,()=>{const a1="hall",a2="mark",sz=60,w1=tw(ctx,a1,sz,800),w2=tw(ctx,a2,sz,800),x0=430-(w1+w2)/2;if(hl>0)glow(ctx,x0+w1/2,600,90,TRUST,0.35*hl);
    T(ctx,a1,x0,620,{w:800,size:sz,color:rgba(mix(PARCH,TRUST,hl),1)});T(ctx,a2,x0+w1,620,{w:800,size:sz,color:rgba(PARCH,0.85)});});
  // the balance, waiting with its weight; the sliver lands and it settles level
  const tS=w("test","leave"),land=tS+0.85,u=Math.max(0,t-land),tilt=t<land?0.13:0.13*Math.exp(-2.6*u)*Math.cos(7.5*u),bA=fin(t,0.9,0.8)*(1-fin(t,Br-0.4,0.6));
  arrive(ctx,1470,BY-110,t,0.9,()=>pp_balance(ctx,1470,BY,1,tilt,t,{a:bA,sliver:t>=land?1:0,weight:1}),{from:0.94});
  withA(ctx,fin(t,w("test","tested")-0.1,0.5)*(1-fin(t,Ha+1.2,0.6)),()=>tag(ctx,1470,450,"tested",PARCH,{align:"center",size:22}));
  // the cup: on the bench, then lifted by a buyer and set in a basket
  const g0=w("buyer","Buyers")-0.3,reach=ease(fin(t,g0,1.0)),lift=ease(fin(t,g0+1.1,0.9)),move=ease(fin(t,g0+2.0,1.4)),lower=ease(fin(t,g0+3.4,0.6));
  const BX=800,cx=lerp(960,BX,move),cy=BY-lift*150+move*20+lower*(-40+130)-lerp(0,40,move),rot=Math.sin(Math.PI*clamp((t-g0-1.2)/1.4,0,1))*0.12;
  // the mark lifts off the cup on the bridge (fly), leaving only the faint recess where it was struck
  const tM=w("test","marked")+0.05,fly=ease(fin(t,w("bridge","same promise")-0.2,1.8)),mk=t>=tM?1-0.65*fly:0;
  pp_basket(ctx,BX,BY+4,0.9,fin(t,g0+1.4,0.6),"back");
  arrive(ctx,960,BY-150,t,0.6,()=>pp_cup(ctx,cx,cy,1.1,t,{mark:mk,scrape:fin(t,tS,0.3),rot,lifted:lift>0.05}),{d:1.0,from:0.9});
  pp_basket(ctx,BX,BY+4,0.9,fin(t,g0+1.4,0.6),"front");
  // the scraper: a hand from the right takes a sliver from the foot
  // (the hand comes from the lower right; its forearm is short and fades into the bench's shadow above the captions)
  const sIn=ease(fin(t,tS-1.3,0.9))*(1-ease(fin(t,tS+0.6,0.7))),scr=Math.sin(clamp((t-tS+0.4)/0.5,0,1)*Math.PI*2)*6;
  if(sIn>0.01)pp_hand(ctx,lerp(1300,1060,sIn)+scr,lerp(870,728,sIn),0.62,t,{a:Math.min(1,sIn*2),tool:"scraper",rot:0.9,sleeve:[92,70,52],skin:[214,170,132],seed:1,len:400});
  // the sliver's flight to the pan
  const fl=clamp((t-tS-0.05)/0.8,0,1);if(fl>0&&fl<1){const sx=lerp(1000,1340,fl),sy=lerp(BY-10,BY-104,fl)-Math.sin(Math.PI*fl)*120;ctx.fillStyle="#f2f0ea";ctx.beginPath();ctx.ellipse(sx,sy,9,3,fl*4,0,TAU);ctx.fill();}
  // the punch, stood upright on the bowl; the hammer comes down on it (a thud, score.py: press at 'marked' +0.05), the
  // punch jolts, then both lift away and leave the leopard's head behind
  const pIn=ease(fin(t,tM-1.3,0.7)),pOut=ease(fin(t,tM+0.35,0.7)),jolt=t>tM&&t<tM+0.25?Math.sin(Math.PI*(t-tM)/0.25):0;
  if(pIn>0.01&&pOut<0.99)pp_punch(ctx,cx+24+260*(1-pIn)+300*pOut,cy-176-460*(1-pIn)-500*pOut+5*jolt,1,fin(t,tM-0.5,0.5),t,{a:Math.min(pIn*1.4,1)});
  withA(ctx,fin(t,tM+0.7,0.5)*(1-fin(t,Ha+1.2,0.6)),()=>tag(ctx,960,410,"then marked",PARCH,{align:"center",size:22}));
  withA(ctx,fin(t,tM+0.8,0.5)*(1-fin(t,Bu-0.4,0.5)),()=>{const lw_=tw(ctx,"leopard's head",20,700)+26;ctx.strokeStyle=rgba(PARCH,0.7);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx+10,cy-172);ctx.lineTo(870,560);ctx.stroke();tag(ctx,870-lw_,560,"leopard's head",PARCH,{size:20});});
  arrive(ctx,1250,440,t,w("buyer","without testing")-0.2,()=>withA(ctx,1-fin(t,Br-0.3,0.5),()=>tag(ctx,1250,440,"trusted without testing again",PARCH,{align:"center",size:22})),{dy:16});
  // the buyer's hand, from the left along its own forearm, round the stem; the forearm runs low, under "hallmark", and leaves
  // the frame on the left above the captions. The basket only comes once the cup is lifted, so the hand never reaches past it
  const hA=fin(t,g0,0.4)*(1-fin(t,g0+4.2,0.6)),hR=0.1,hD=(1-reach)*1100;
  if(hA>0)pp_hand(ctx,cx-6-hD*Math.cos(hR),cy-70+hD*Math.sin(hR),0.5,t,{flip:true,a:hA,sleeve:[58,66,92],skin:[234,198,166],seed:2,rot:hR,len:1900});
  // the bridge: the present opens on the right; the mark lifts off and waits there as a hollow seal beside the core
  const pr=fin(t,Br-0.2,0.9);
  withA(ctx,pr,()=>{glass(ctx,1240,150,560,620,22,TRUST,{glow:14,ea:0.5,fill:"rgba(5,8,16,0.96)"});pp_layers(ctx,1290,190,460,260,{core:fin(t,w("bridge","core model"),0.6),dim:0.6});});
  const mx=lerp(cx+24,1520,fly),my=lerp(cy-176,600,fly)-Math.sin(Math.PI*fly)*60;
  if(fly>0&&fly<1)pp_leopard(ctx,mx,my,lerp(19,30,fly),TRUST,1);
  pp_seal(ctx,1520,600,48,t,{a:fin(t,w("bridge","same promise")+1.5,0.5)});
  arrive(ctx,1520,724,t,w("bridge","assay")-0.1,()=>tag(ctx,1520,724,"the tests are the assay",TRUST,{align:"center",size:22}),{dy:14});
  ctx.restore();weedsTitle(ctx,S,t,B,"Promises and proofs","contracts say what's promised; tests prove it",WEED);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. The gap register ---------- */
scene("gaps",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:480});
  const Rg=c("register"),Rv=c("revoked"),Th=c("three"),Bo=c("both"),Jo=c("jordan"),Tn=c("ten");
  // the loop of ten steps steps aside while the wide gap-1 card is up, and comes back with the register
  const dA=fin(t,c("revoked"),0.5)*(1-fin(t,c("ten")-0.65,0.55));
  pp_loop(ctx,1720,112,1,t,STEPS10.map((_,i)=>i===3?fin(t,0.4,0.6):0.2),fin(t,0.2,0.6)*(1-fin(t,c("revoked")-0.3,0.4)*(1-fin(t,c("ten")-0.1,0.5))));
  arrive(ctx,140,100,t,0.3,()=>{T(ctx,"step 4",140,100,{w:800,size:22,color:rgba(WEED,1)});T(ctx,"the gap register",230,100,{w:800,size:30});},{from:0.9});
  // the register: drafted by the agent, one line per gap; it steps back for gap 1 and returns for the ten decisions
  const away=fin(t,Rv-0.5,0.5)*(1-fin(t,Tn-0.05,0.6)),regA=fin(t,Rg-0.2,0.5)*(1-away);
  const p=clamp((t-w("register","register")-0.3)/0.42,0,10),tags=clamp((t-w("ten","ten decisions")+0.4)/1.2,0,1),ink=fin(t,w("ten","May")+0.2,0.8);
  const hiRow={4:pulseAt(t,w("ten","ten decisions")+1.0,1.6),9:pulseAt(t,w("ten","ten decisions")+1.0,1.6)},meaning=[0,6,8];
  const ticks={};for(let i=0;i<10;i++)ticks[i]=fin(t,w("ten","approves")+(meaning.includes(i)?meaning.indexOf(i)*0.25:1.0+i*0.08),0.3);
  arrive(ctx,840,500,t,Rg-0.2,()=>pp_register(ctx,t,{a:regA,p,tags,ink,hiRow,ticks}),{d:0.9,from:0.96,dy:24});
  kt_agent(ctx,1610,240,22,t,{a:fin(t,Rg-0.2,0.5)*(1-fin(t,w("register","one line per gap")+4.4,0.6))*(1-away),busy:1});
  // gap 1, as the file has it
  arrive(ctx,960,290,t,Rv,()=>pp_gap1(ctx,150,160,t,{a:dA,lit:{exp:fin(t,w("revoked","expects"),0.4),real:fin(t,w("revoked","deletes"),0.4),dec:fin(t,Bo,0.4)}}),{dy:30,from:0.95});
  // three decisions drop in; gap 1 takes two of them
  const X=[560,960,1360],T3=[w("three","Fix it"),w("three","Write a rule"),w("three","Or accept")],toR=ease(fin(t,w("both","Anything")-0.2,0.9)),toF=ease(fin(t,w("both","asked")-0.2,0.9));
  const tx=[lerp(X[0],1290,toF),lerp(X[1],1074,toR),X[2]],ty=[lerp(500,452,toF),lerp(500,452,toR),500];
  [0,1,2].forEach(k=>{const a=fin(t,T3[k]-0.1,0.3)*dA*(k===2?1-0.65*fin(t,Bo,0.6):1),y0=ty[k]-(1-pp_sp(t,T3[k]-0.1,0.6))*50;if(a>0)pp_dtag(ctx,tx[k],y0,k,a,{align:"center",size:22,hi:k<2?pulseAt(t,k?w("both","Anything"):w("both","asked"),1.2):0});});
  // Jordan's microcredential: deleted on 12 August, and read as revoked from that day
  const bA=fin(t,w("revoked","deletes")-0.3,0.6)*(1-fin(t,Tn-0.65,0.55)),del=fin(t,w("jordan","twelfth"),0.8),back=fin(t,w("jordan","From that day")-0.1,1.0);
  withA(ctx,bA,()=>T(ctx,"the learning platform · badges",420,592,{w:700,size:20,color:rgba(PP_LMS,1)}));
  [["LMS|B-5010","SQL for Analysis",420],["LMS|B-5025","Python Foundations",800]].forEach(([k,n,x],i)=>arrive(ctx,x+160,700,t,w("revoked","deletes")-0.3+i*0.15,()=>pp_cred(ctx,x,610,320,184,k,n,{a:bA*0.75}),{dy:30}));
  arrive(ctx,1340,700,t,w("revoked","deletes")+0.0,()=>pp_cred(ctx,1180,610,320,184,"LMS|B-5028","Data Visualisation",{a:bA,fade:del,back,hi:pulseAt(t,Jo,1.4)}),{dy:30});
  withA(ctx,bA*fin(t,Jo,0.5),()=>{T(ctx,"Jordan's",1340,594,{w:800,size:22,align:"center",color:rgba(PP_LMS,1)});withA(ctx,fin(t,w("jordan","twelfth")-0.1,0.4),()=>tag(ctx,1590,702,"12 Aug",SOFT,{size:20}));});
  if(back>0)withA(ctx,bA*(1-fin(t,Jo+5.6,0.6)),()=>arrowTo(ctx,1110,478,1300,602,PP_DEC[1][1],0.85,{p:back,bend:-0.15,dash:[6,6],head:12}));
  // Mei approves the decisions about meaning
  arrive(ctx,1700,520,t,w("ten","May")-0.2,()=>{pp_face(ctx,"mei",1700,520,64,t,{name:"Mei",role:"approves meaning"});},{from:0.85});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. The enterprise contract ---------- */
const PP_PROJ=["    core:","      +materialized: table","      +schema: core","      +group: credential_model","      +access: public","      +contract:","        enforced: true"];
const PP_CRED=["  - name: core_credential","    …","    config:","      meta:","        grain: One row per credential","        owner: Mei Tanaka, registrar's office","    …","    columns:","      - name: credential_key","        …","        data_type: string","        constraints: [{type: not_null}]","        data_tests: [unique, not_null]","      …","      - name: credit_points","        …","        data_type: int"];
scene("enterprise",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:460});
  const Fo=c("folder"),Co=c("columns"),St=c("stops"),No=c("noor");
  // the model, as a blueprint, above the four layers it's built in; the core lit
  arrive(ctx,520,165,t,0.2,()=>{bpPaper(ctx,110,50,820,240,1,{});bpModel(ctx,520,206,0.74,{b:1,hi:{cred:fin(t,c("columns"),0.6)}});T(ctx,"the blueprint",130,282-14,{w:700,size:18,color:rgba(BPL,0.9)});},{from:0.94});
  const core=fin(t,w("contracts","core"),0.6),latch=fin(t,w("folder","enforced"),0.35);
  arrive(ctx,1250,165,t,0.5,()=>pp_layers(ctx,980,60,540,210,{core,latch:t<w("folder","enforced")?0:latch,latchA:fin(t,Fo,0.5)}),{from:0.94});
  arrive(ctx,1250,296,t,w("contracts","strongest"),()=>T(ctx,"the strongest promise",1250,302,{w:700,size:22,align:"center",color:rgba(TRUST,1)}),{dy:12});
  // the core folder's two settings
  const lA={4:fin(t,w("folder","Public"),0.4),5:fin(t,w("folder","contract, enforced"),0.4),6:fin(t,w("folder","enforced"),0.4)};
  arrive(ctx,430,460,t,Fo-0.3,()=>pp_code(ctx,80,330,700,"dbt_project.yml",PP_PROJ,{p:clamp((t-Fo)/1.4,0,1),lit:lA,edge:TRUST}),{dy:30});
  withA(ctx,fin(t,w("folder","Public"),0.4)*(1-fin(t,Co-0.9,0.4)),()=>tag(ctx,800,525,"other projects may build on it",TRUST,{size:18}));
  // the credential's contract: every column, its type, what can't be empty; then its grain
  const flip=fin(t,w("stops","disagree"),0.4)*(1-fin(t,No,0.5)),bLit={7:fin(t,w("columns","every column"),0.4),10:fin(t,w("columns","its type"),0.4),16:Math.max(fin(t,w("columns","its type"),0.4),flip),11:fin(t,w("columns","can't be empty"),0.4),4:fin(t,w("columns","grain"),0.4)};
  arrive(ctx,1350,580,t,Co-0.4,()=>pp_code(ctx,880,330,940,"models/core/_core__models.yml",PP_CRED,{size:18,lh:27,p:clamp((t-Co+0.2)/1.8,0,1),lit:bLit,litCols:{16:flip>0.5?BAD:TRUST},edge:TRUST,swap:{16:["        data_type: string",flip,BAD]}}),{dy:30});
  // the query and the contract disagree: the build stops before the table is made
  const run=clamp((t-w("stops","build")+0.8)/0.8,0,1),red=fin(t,w("stops","stops"),0.3),ok=fin(t,No+0.2,0.6),eA=fin(t,w("stops","build")-0.9,0.5);
  arrive(ctx,470,740,t,w("stops","build")-0.9,()=>{const col=mix(mix([150,180,220],BAD,red),GOOD,ok);glass(ctx,80,620,780,250,16,col,{glow:14,ea:0.85,fill:"rgba(10,8,14,0.96)"});
    T(ctx,"dbt build --select core_credential",104,658,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});withA(ctx,red*(1-ok),()=>T(ctx,"stopped before the table is made",104,852,{w:700,size:20,color:rgba(BAD,1)}));
    ctx.fillStyle="rgba(255,255,255,0.08)";rr(ctx,104,676,732,14,7);ctx.fill();ctx.fillStyle=rgba(col,1);rr(ctx,104,676,732*(ok>0?lerp(Math.min(run,0.55),1,ok):Math.min(run,0.55)),14,7);ctx.fill();
    withA(ctx,red*(1-ok),()=>{T(ctx,"This model has an enforced contract that failed.",104,724,{f:"mono",w:500,size:18,color:rgba(mix(INK,BAD,0.3),1)});
      pp_table(ctx,100,742,[170,182,170,218],[["column_name","definition_type","contract_type","mismatch_reason"],["credit_points","INTEGER","VARCHAR","data type mismatch"]],{size:18,rh:40,col:BAD,mono:[1,1,1,1]});});
    withA(ctx,ok,()=>{T(ctx,"contract and query agree · the table is made",104,736,{w:700,size:22,color:rgba(GOOD,1)});T(ctx,"checked at every build",104,776,{w:700,size:22,color:rgba(INK,0.95)});});},{dy:20});
  // Noor approves
  arrive(ctx,1690,150,t,No+0.3,()=>pp_face(ctx,"noor",1690,140,56,t,{name:"Noor",role:"approves"}),{from:0.85});
  kt_gtick(ctx,1736,186,16,fin(t,w("noor","approves")+0.2,0.35));
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Two consumer contracts ---------- */
const PP_MARTS=["    marts:","      +materialized: table","      +schema: marts","      +access: protected","      +contract:","        enforced: true"];
const PP_EXP_P=["exposures:","","  - name: census_dashboard","    label: Census dashboard","    type: dashboard","    maturity: high","    …","    owner:","      name: Planning","      email: planning@uni.example","    depends_on:","      - ref('mart_planning__near_award')","      - metric('learners_near_graduate_certificate')"];
const PP_EXP_W=["exposures:","","  - name: wallet_app","    label: Learner wallet app","    type: application","    maturity: medium","    …","    owner:","      name: Wallet app team","      email: wallet@uni.example","    depends_on:","      - ref('mart_wallet__learners')","      - ref('mart_wallet__credentials')"];
scene("consumer",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:500});
  const Ow=c("own"),Pr=c("protected"),Ex=c("exposure"),Te=c("tell"),Ap=c("approve");
  // the core band comes down from the layers of the last chapter, and the two marts rise on it
  const m=ease(fin(t,0,1.4)),bandY=lerp(140,808,m),bandX=lerp(980,140,m),bandW=lerp(540,1640,m),tell=fin(t,Te,0.5);
  const P=pp_core(ctx,bandX,bandY,bandW,64,{chips:fin(m,0.75,0.25),pulse:{core_credential:Math.max(pulseAt(t,Te,1.6),tell*(1-fin(t,Ap,0.6))*0.7)}});
  const feeds=[["core_learner","planning"],["core_award","planning"],["core_credit_towards_award","planning"],["core_learner","wallet"],["core_credential","wallet"],["core_credit_towards_award","wallet"]];
  withA(ctx,fin(t,Ow,0.8),()=>feeds.forEach(([k,mk])=>{const[x0,y0]=P[k],x1=mk==="planning"?510:1410;ctx.strokeStyle=rgba(TRUST,0.16);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0-16);ctx.bezierCurveTo(x0,y0-300,x1,500,x1,330);ctx.stroke();}));
  const gr=[clamp((t-w("grains","Planning's"))/1.6,0,1),clamp((t-w("grains","the wallet's"))/1.2,0,1)],ch=fin(t,w("protected","enforced"),0.4),hiW=fin(t,Te+1.6,0.5)*(1-fin(t,Ap,0.5));
  arrive(ctx,510,225,t,Ow+0.1,()=>pp_mart(ctx,140,120,740,210,"planning",t,{g:gr[0],chips:ch}),{dy:60});
  arrive(ctx,1410,225,t,Ow+0.5,()=>pp_mart(ctx,1040,120,740,210,"wallet",t,{g:gr[1],chips:ch,hi:hiW}),{dy:60});
  // protected: a ring closes round both
  const rg=fin(t,w("protected","protected")-0.2,0.8);
  if(rg>0){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(PP_MART,0.8*rg);ctx.lineWidth=2.4;rr(ctx,lerp(60,110,rg),lerp(50,94,rg),lerp(1800,1700,rg),lerp(330,262,rg),24);ctx.stroke();ctx.restore();
    withA(ctx,rg,()=>tag(ctx,960,94,"protected · only this project can build on them",PP_MART,{align:"center",size:20}));}
  const mA=fin(t,Pr-0.3,0.5)*(1-fin(t,Ex-0.7,0.4));
  arrive(ctx,960,520,t,Pr-0.3,()=>pp_code(ctx,620,400,680,"dbt_project.yml",PP_MARTS,{a:mA,p:clamp((t-Pr)/1.2,0,1),edge:PP_MART,lit:{3:fin(t,w("protected","protected"),0.4),4:fin(t,w("protected","enforced"),0.4),5:fin(t,w("protected","enforced"),0.4)}}),{dy:30});
  // each declares an exposure: who reads it, with an owner and an email
  const dimE=1-fin(t,Te+0.8,0.6)*(1-fin(t,Ap,0.6)),lit=(tt)=>({4:fin(t,tt,0.4),7:fin(t,w("exposure","owner"),0.4),8:fin(t,w("exposure","owner"),0.4),9:fin(t,w("exposure","email"),0.4)});
  arrive(ctx,510,610,t,Ex-0.2,()=>pp_code(ctx,140,368,740,"models/marts/planning/_planning__models.yml",PP_EXP_P,{a:dimE,size:18,lh:24,p:clamp((t-Ex)/1.6,0,1),edge:PP_MART,lit:lit(w("exposure","dashboard"))}),{dy:30});
  arrive(ctx,1410,610,t,w("exposure","app")-0.3,()=>pp_code(ctx,1040,368,740,"models/marts/wallet/_wallet__models.yml",PP_EXP_W,{a:dimE,size:18,lh:24,p:clamp((t-w("exposure","app")+0.1)/1.4,0,1),edge:PP_MART,lit:lit(w("exposure","app"))}),{dy:30});
  // change the credential: the lineage reaches one exposure, the wallet app
  const run=fin(t,Te+0.2,1.4);if(run>0&&bandY>800){const[x0,y0]=P.core_credential,pts=[];for(let i=0;i<=40;i++){const u=i/40*run,v=1-u;pts.push([v*v*v*x0+3*v*v*u*x0+3*v*u*u*1410+u*u*u*1410,v*v*v*(y0-16)+3*v*v*u*(y0-320)+3*v*u*u*500+u*u*u*332]);}
    withA(ctx,1-fin(t,Ap-0.4,0.4),()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,1);ctx.lineWidth=4;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=14;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.restore();});}
  const lsA=fin(t,Te+1.6,0.5)*(1-fin(t,Ap-0.4,0.4));
  // the dbt ls card sits on the left, clear of the lit path; "who to tell" waits beside the wallet mart, where the path ends
  arrive(ctx,610,545,t,Te+1.6,()=>withA(ctx,1-fin(t,Ap-0.4,0.4),()=>{glass(ctx,260,470,700,150,14,TRUST,{glow:16,ea:0.9,fill:"rgba(8,10,18,0.97)"});
    T(ctx,"dbt ls --select core_credential+",284,512,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});T(ctx,"   --resource-type exposure",284,540,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});
    T(ctx,"exposure:credentials.wallet_app",284,588,{f:"mono",w:500,size:22,color:rgba(TRUST,1)});}),{dy:20});
  arrive(ctx,1600,400,t,w("tell","who to tell")-0.1,()=>withA(ctx,1-fin(t,Ap-0.4,0.4),()=>tag(ctx,1600,400,"who to tell",TRUST,{align:"center",size:22})),{dy:14});
  withA(ctx,lsA,()=>T(ctx,"not reached",860,300,{w:700,size:18,align:"right",color:rgba(SOFT,0.95)}));
  // each consumer approves its own
  kt_gtick(ctx,840,170,16,fin(t,w("approve","Planning"),0.35));kt_gtick(ctx,1740,170,16,fin(t,w("approve","wallet team"),0.35));
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Tests first ---------- */
// the models the tests will check, as outlines: [column, row] in four layers
const PP_OUT=[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1]];
const pp_outPos=(k,x,y)=>{const[c_,r]=PP_OUT[k];return[x+c_*156,y+r*58];};
function pp_outlines(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{LAYER4.forEach(([nm,col],i)=>T(ctx,nm,x+i*156+66,y-14,{w:800,size:18,align:"center",color:rgba(col,0.95)}));
  PP_OUT.forEach((pp,k)=>{const[px,py]=pp_outPos(k,x,y),q=o.p==null?1:clamp(o.p*PP_OUT.length-k,0,1);if(q>0&&k!==o.skip)pp_outline(ctx,px,py,132,42,"",LAYER4[pp[0]][1],{a:q*(1-(o.dim||0)*0.7),fill:0.5});});});}
const PP_TL=[["unique",0],["not_null",1],["relationships",2],["accepted_values",3],["versions_do_not_overlap",4],["reconcile_planning_with_census_report",5]];
const PP_AWARD=["      - name: award_type","        description: '{{ doc(\"award_type\") }}'","        data_type: string","        data_tests:","          - accepted_values:","              arguments:","                values: [graduate certificate, master]"];
const PP_VER=["{#-","    A timeline, tested: for each key, every version ends after it starts, and ends no later","    than the next one starts. Only the last version may be open (valid_to null).","    Fails with one row per version that breaks the rule.","-#}"];
const PP_REC=["-- Planning's number, reconciled with the census report, faculty by faculty.","-- Fails with one row per faculty where they differ, or that the report doesn't cover.","…","select *","from compared","where in_the_census_report is null","   or in_the_mart <> in_the_census_report"];
scene("tests",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:480});
  const Va=c("values"),Tr=c("trusted"),Re=c("reconcile"),Ag=c("agent");
  pp_loop(ctx,204,122,1,t,STEPS10.map((_,i)=>i===4?fin(t,w("step","Step five"),0.6):i===3?0.5:0.2),fin(t,0.1,0.5));
  arrive(ctx,500,110,t,0.3,()=>{T(ctx,"step 5",390,104,{w:800,size:22,color:rgba(WEED,1)});T(ctx,"tests, before the code",480,104,{w:800,size:30});},{from:0.9});
  // the models, outlines only: not built yet
  pp_outlines(ctx,80,250,t,{p:clamp((t-0.6)/1.6,0,1)});
  withA(ctx,fin(t,1.6,0.6),()=>T(ctx,"not built yet",390,452,{w:600,size:18,align:"center",color:rgba(SOFT,1)}));
  // the test list types itself, a kind per line, each with its glyph; the agent's draft is teal until Jun reviews it
  const TT=[w("keys","unique"),w("keys","never empty"),w("keys","relationship"),w("values","closed list"),w("values","never overlap"),w("reconcile","compares")],rev=fin(t,w("agent","Joon")+0.3,0.8);
  arrive(ctx,390,700,t,c("step")+1.2,()=>{glass(ctx,80,500,620,380,16,mix(KT_AI,[170,205,255],rev),{glow:12,ea:0.65,fill:"rgba(6,10,20,0.96)"});T(ctx,"what done looks like",104,540,{w:800,size:22});T(ctx,"data_tests",680,540,{f:"mono",w:500,size:18,align:"right",color:rgba(SOFT,1)});
    PP_TL.forEach(([nm,k],i)=>{const a=fin(t,TT[i]-0.1,0.3);if(a<=0)return;const yy=592+i*52,col=mix(KT_AI,INK,rev);pp_tglyph(ctx,Math.min(k,4),124,yy-6,mix(KT_AI,[170,205,255],rev),a);
      withA(ctx,a,()=>T(ctx,typeOn(nm,clamp((t-TT[i]+0.1)/0.5,0,1)),156,yy,{f:"mono",w:500,size:18,color:rgba(col,1)}));});},{dy:30});
  kt_agent(ctx,664,604,16,t,{a:fin(t,w("keys","unique")-0.4,0.5)*(1-rev),busy:1});
  // the order: the tests first, then the code they check (which isn't written yet)
  const oA=1-fin(t,w("values","agreed values")-1.0,0.5);
  pp_flow(ctx,1290,330,[["the tests",WEED,false],["the code they check",SOFT,true]],[fin(t,w("step","the tests")-0.1,0.5),fin(t,w("step","before the code")+0.1,0.5)],{a:oA,size:24});
  withA(ctx,fin(t,w("step","done looks like")-0.1,0.5)*oA,()=>T(ctx,"they say what done looks like",1290,440,{w:700,size:22,align:"center",color:rgba(SOFT,1)}));
  // agreed values, and the rule that versions never overlap
  const vOut=fin(t,Tr-0.8,0.5);
  arrive(ctx,1290,290,t,w("values","agreed values")-0.4,()=>pp_code(ctx,760,150,1060,"models/core/_core__models.yml",PP_AWARD,{a:1-vOut,p:clamp((t-w("values","agreed values")+0.2)/1.2,0,1),edge:TRUST,lit:{6:fin(t,w("values","agreed values")+0.4,0.4),4:fin(t,w("values","agreed values")+0.4,0.4)}}),{dy:30});
  arrive(ctx,1290,560,t,w("values","never overlap")-0.4,()=>pp_code(ctx,760,460,1060,"tests/generic/versions_do_not_overlap.sql",PP_VER,{a:1-vOut,size:18,lh:27,p:clamp((t-w("values","never overlap")+0.2)/1.0,0,1),edge:PP_INT}),{dy:30});
  // a number people already trust: the census report, weighed against the mart that isn't built yet
  const cA=fin(t,Tr-0.1,0.5);
  arrive(ctx,1000,280,t,Tr-0.1,()=>{T(ctx,"seeds/census_report.csv",780,150,{f:"mono",w:500,size:18,color:rgba(TRUST,1)});tag(ctx,1046,144,PP_RUN,WEED,{size:18});
    pp_table(ctx,780,172,[300,140],[["faculty","learners"],["Arts and Education",2],["Business",3],["Engineering and IT",5],["Health",2],["total",12]],{size:20,rh:42,col:TRUST,align:[0,"right"],lit:{5:fin(t,w("trusted","twelve"),0.4)}});},{dy:30,a:cA});
  arrive(ctx,1530,420,t,w("trusted","trust")-0.2,()=>pp_scale(ctx,1530,440,0.9,-0.1+0.02*Math.sin(t*1.2),{left:"12",leftLab:"census report",rightLab:"the mart",col:TRUST}),{from:0.9});
  arrive(ctx,1290,590,t,Re-0.3,()=>pp_code(ctx,760,460,1060,"tests/reconcile_planning_with_census_report.sql",PP_REC,{size:18,lh:27,p:clamp((t-Re)/1.4,0,1),edge:TRUST,lit:{5:fin(t,w("reconcile","fails"),0.4),6:fin(t,w("reconcile","fails"),0.4)}}),{dy:30});
  withA(ctx,fin(t,w("reconcile","faculty"),0.4),()=>tag(ctx,1300,766,"faculty by faculty",TRUST,{align:"center",size:20}));
  // the agent drafts; Jun reviews (both kept clear of the two-line captions)
  arrive(ctx,1010,830,t,Ag-0.2,()=>{kt_agent(ctx,800,820,14,t,{});T(ctx,"the agent drafts, from the contracts and the register",832,828,{w:700,size:20,color:rgba(KT_AI,1)});},{dy:12});
  arrive(ctx,1690,820,t,w("agent","Joon")-0.2,()=>pp_face(ctx,"jun",1610,820,40,t,{side:1,name:"Jun",role:"reviews"}),{from:0.85});
  kt_gtick(ctx,700,500,16,fin(t,w("agent","reviews")+0.2,0.35));
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Logic, tested alone ---------- */
const PP_GIVEN=["  - name: revoked_microcredential_stops_counting_the_day_it_is_revoked","    …","    given:","      - input: ref('int_credit_items')","        …","        rows: |","          learner_key,award_key,item_kind,item_bk,grade,credit_points,counts_from,counts_to","          L1,A1,unit,R1,C,15,2026-01-10,","          L1,A1,microcredential,M1,,5,2026-02-02,2026-08-12"];
const PP_EXPECT=["    expect:","      …","      rows: |","        valid_from,valid_to,credit_points_earned","        2026-01-10,2026-02-02,15","        2026-02-02,2026-08-12,20","        2026-08-12,,15"];
scene("unit",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:500});
  const Ro=c("rows"),Ex=c("expect"),Be=c("before");
  // the outlines from the last chapter dim; one intermediate model is lifted out on its own
  const tL=w("alone","on its own")-0.3,m=ease(fin(t,tL,1.4));pp_outlines(ctx,80,250,t,{a:1-fin(t,tL,1.2),skip:4});
  withA(ctx,fin(t,0.6,0.5)*(1-fin(t,tL,0.6)),()=>{PP_OUT.forEach((pp,k)=>{if(k===4)return;const[px,py]=pp_outPos(k,80,250);ring(ctx,px+118,py+21,8,GOOD,0.8,1.6);});T(ctx,"data tests check the tables",390,470,{w:700,size:22,align:"center",color:rgba(INK,1)});});
  const[ox,oy]=pp_outPos(4,80,250),bx=lerp(ox,100,m),by=lerp(oy,130,m),bw=lerp(132,540,m),bh=lerp(42,62,m);
  pp_outline(ctx,bx,by,bw,bh,m>0.5?"int_credit_towards_award":"",PP_INT,{fill:0.9,hi:m*0.4,size:20});
  arrive(ctx,370,240,t,tL+1.0,()=>T(ctx,"data tests: the tables",100,246,{w:700,size:22,color:rgba(SOFT,1)}),{from:0.92});
  // a few rows, made up for the purpose
  const mk=fin(t,w("alone","a few rows")-0.1,0.5)*(1-fin(t,w("rows","credit rule")-0.4,0.5));
  [["L1 · A1 · unit · 15",0],["L1 · A1 · microcredential · 5",1]].forEach(([s_,i])=>arrive(ctx,330,360+i*56,t,w("alone","a few rows")+i*0.2,()=>withA(ctx,mk,()=>{glass(ctx,100,334+i*56,460,48,10,PP_INT,{glow:8,ea:0.7,fill:"rgba(8,10,20,0.95)"});T(ctx,s_,122,366+i*56,{f:"mono",w:500,size:18,color:rgba(mix(INK,PP_INT,0.3),1)});}),{dy:16}));
  withA(ctx,mk,()=>T(ctx,"made up",572,394,{w:700,size:18,color:rgba(SOFT,1)}));
  arrive(ctx,370,284,t,w("alone","unit test")-0.1,()=>T(ctx,"unit tests: the logic",100,290,{w:800,size:24,color:rgba(PP_INT,1)}),{from:0.92});
  // what a unit test is: made-up rows in, the model's logic, the rows expected out
  const fA=1-fin(t,w("rows","credit rule")-0.9,0.5);
  pp_flow(ctx,1270,300,[["given: made-up rows",PP_INT,false],["the model's logic",PP_INT,true],["expect: these rows",GOOD,false]],[fin(t,w("alone","a few rows")-0.1,0.5),fin(t,w("alone","purpose")-0.1,0.5),fin(t,w("alone","unit test")-0.1,0.5)],{a:fA,size:22,gap:70});
  // given: two made-up rows; then expect: three versions
  const sw=ease(fin(t,Ex-0.3,0.8));
  arrive(ctx,1270,270,t,w("rows","credit rule")-0.4,()=>pp_code(ctx,720,lerp(110,-260,sw),1100,"models/intermediate/_int_models.yml",PP_GIVEN,{a:1-sw,size:18,lh:27,p:clamp((t-w("rows","credit rule"))/1.4,0,1),edge:PP_INT,lit:{7:fin(t,w("rows","passed unit"),0.4),8:fin(t,w("rows","microcredential counts"),0.4)}}),{dy:30});
  const E3=[w("expect","fifteen"),w("expect","twenty"),w("expect","fifteen again")],ok=fin(t,w("before","proved"),0.35);
  if(sw>0)pp_code(ctx,720,lerp(460,110,sw),1100,"models/intermediate/_int_models.yml",PP_EXPECT,{a:sw,size:18,lh:27,edge:mix(PP_INT,GOOD,ok),lit:{4:fin(t,E3[0],0.3),5:fin(t,E3[1],0.3),6:fin(t,E3[2],0.3)},litCol:GOOD});
  if(ok>0)withA(ctx,ok,()=>{glow(ctx,1790,412,40,GOOD,0.4);ctx.fillStyle="rgba(8,20,14,0.96)";ctx.beginPath();ctx.arc(1790,412,20,0,TAU);ctx.fill();ring(ctx,1790,412,20,GOOD,1,2.5);tick_(ctx,1790,413,24,GOOD,1);});
  // the timeline of the two rows, and the credit they add up to (kept above the captions)
  const X=d=>200+d/273*1520,aA=fin(t,Ro-0.2,0.6),AX=770,MB=652,UB=712;
  withA(ctx,aA,()=>{ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(180,AX);ctx.lineTo(1740,AX);ctx.stroke();
    ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"].forEach((mn,i)=>{const d=[0,31,59,90,120,151,181,212,243][i],x=X(d);ctx.fillStyle=rgba(SOFT,0.7);ctx.fillRect(x,AX-8,2,16);T(ctx,mn,x+6,AX+30,{w:600,size:18,color:rgba(SOFT,1)});});});
  const uB=fin(t,w("rows","tenth of January")-0.1,0.8),mB=clamp((t-w("rows","second of February")+0.1)/(w("rows","twelfth of August")-w("rows","second of February")+0.2),0,1),jH=pulseAt(t,w("before","Jordan's")+0.4,1.8);
  if(uB>0){ctx.fillStyle=rgba(PP_SIS,0.85);rr(ctx,X(9),UB,(X(273)-X(9))*ease(uB),24,8);ctx.fill();withA(ctx,uB,()=>{T(ctx,"a passed unit · 15",X(120),UB-10,{w:700,size:20,color:rgba(PP_SIS,1)});T(ctx,"10 Jan",X(9)-8,UB+20,{w:700,size:18,align:"right",color:rgba(INK,1)});});}
  if(mB>0){ctx.fillStyle=rgba(PP_LMS,0.85);rr(ctx,X(32),MB,(X(223)-X(32))*mB,24,8);ctx.fill();withA(ctx,fin(mB,0,0.2),()=>{T(ctx,"a microcredential · 5",X(100),MB-10,{w:700,size:20,color:rgba(PP_LMS,1)});T(ctx,"2 Feb",X(32),MB+46,{w:700,size:18,align:"center",color:rgba(mix(INK,PP_LMS,jH),1)});});
    withA(ctx,fin(mB,0.95,0.05),()=>T(ctx,"12 Aug",X(223),MB+46,{w:700,size:18,align:"center",color:rgba(mix(INK,PP_LMS,jH),1)}));}
  // the credit line steps 15 → 20 → 15: three versions
  const Y=v=>v===20?566:612,sp=clamp((t-Ex+0.2)/2.4,0,1);if(sp>0){const pts=[[X(9),Y(15)],[X(32),Y(15)],[X(32),Y(20)],[X(223),Y(20)],[X(223),Y(15)],[X(273),Y(15)]];
    ctx.save();ctx.strokeStyle=rgba(GOOD,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(GOOD,0.6);ctx.shadowBlur=10;ctx.beginPath();let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
    let left=L*sp;ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length&&left>0;i++){const f=Math.min(1,left/seg[i-1]);ctx.lineTo(lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f));left-=seg[i-1];}ctx.stroke();ctx.restore();
    [[X(9)+20,"15",0],[X(128),"20",1],[X(223)+20,"15",2]].forEach(([x,s_,i])=>withA(ctx,fin(t,E3[i],0.3),()=>{T(ctx,s_,x,Y(i===1?20:15)-14,{w:800,size:28,color:rgba(GOOD,1)});}));
    withA(ctx,fin(t,E3[2]+0.3,0.4),()=>T(ctx,"three versions",X(273)-10,Y(15)-60,{w:800,size:22,align:"right",color:rgba(GOOD,1)}));}
  // the microcredential's dates are Jordan's: the revoked badge from the register comes back; its red arrow arcs over the
  // "20" to the step down on 12 Aug
  const jA=fin(t,w("before","Jordan's")-0.3,0.6);
  arrive(ctx,310,452,t,w("before","Jordan's")-0.3,()=>{T(ctx,"the dates are Jordan's",100,346,{w:800,size:22,color:rgba(PP_LMS,1)});pp_cred(ctx,100,362,420,184,"LMS|B-5028","Data Visualisation",{back:1});},{dy:20});
  if(jA>0)withA(ctx,jA,()=>{arrowTo(ctx,520,470,X(32)+30,MB-4,PP_LMS,0.7,{p:fin(t,w("before","Jordan's"),0.8),bend:-0.12,dash:[6,6],head:12});arrowTo(ctx,520,490,X(223)-10,Y(20)-10,BAD,0.7,{p:fin(t,w("before","Jordan's")+0.3,0.8),bend:-0.1,dash:[6,6],head:12});});
  arrive(ctx,1270,412,t,w("before","proved")-0.1,()=>tag(ctx,1270,412,"proved before real data",GOOD,{align:"center",size:22}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Warn or stop ---------- */
const PP_SCY=["      - name: customer_bk","        description: >","          The customer who enrolled, by email. An enrolment with no email can't be matched to a","          learner. The learning team agreed: warn when any current enrolment has none, stop the","          build when more than five do (see docs/gaps.md).","        data_tests:","          - not_null:","              config:","                where: is_current_version","                warn_if: \">0\"","                error_if: \">5\""];
const PP_FRESH=["      loaded_at_field: \"cast(_loaded_at as timestamp)\"","      freshness:","        warn_after: {count: 1, period: day}","        error_after: {count: 3, period: day}"];
scene("levels",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:480});
  const Wa=c("walkin"),Ag=c("agreed"),To=c("today"),Fr=c("fresh"),Ow=c("owner");
  arrive(ctx,200,96,t,w("not","warn")-0.1,()=>tag(ctx,140,96,"warn",PP_AMB,{size:24}),{from:0.8});
  arrive(ctx,330,96,t,w("not","stop the build")-0.1,()=>tag(ctx,250,96,"stop the build",BAD,{size:24}),{from:0.8});
  // what each level does, before the example arrives
  const lvA=1-fin(t,Wa-0.5,0.5);
  arrive(ctx,1180,330,t,w("not","warn")-0.1,()=>withA(ctx,lvA,()=>{glass(ctx,760,270,840,110,16,PP_AMB,{glow:12,ea:0.85,fill:"rgba(16,12,4,0.95)"});T(ctx,"warn",790,318,{w:800,size:28,color:rgba(PP_AMB,1)});T(ctx,"the build reports it, and carries on",790,356,{w:600,size:22,color:rgba(INK,0.95)});}),{dy:20});
  arrive(ctx,1180,470,t,w("not","stop the build")-0.1,()=>withA(ctx,lvA,()=>{glass(ctx,760,410,840,110,16,BAD,{glow:12,ea:0.85,fill:"rgba(16,6,8,0.95)"});T(ctx,"stop",790,458,{w:800,size:28,color:rgba(BAD,1)});T(ctx,"the build fails, and what depends on it is skipped",790,496,{w:600,size:22,color:rgba(INK,0.95)});}),{dy:20});
  // the short-course stream, and the one enrolment with no email
  withA(ctx,fin(t,0.4,0.6),()=>{const g=ctx.createLinearGradient(0,160,0,520);g.addColorStop(0,rgba(PP_SC,0));g.addColorStop(0.3,rgba(PP_SC,0.6));g.addColorStop(1,rgba(PP_SC,0));ctx.fillStyle=g;rr(ctx,104,150,14,380,7);ctx.fill();
    T(ctx,"short-course platform",140,170,{w:700,size:20,color:rgba(PP_SC,1)});});
  arrive(ctx,400,270,t,Wa-0.3,()=>{glass(ctx,140,190,520,170,16,PP_SC,{glow:12,ea:0.85,fill:"rgba(12,8,14,0.96)"});T(ctx,"SC|E-7010",164,236,{f:"mono",w:500,size:22,color:rgba(PP_SC,1)});T(ctx,"Excel for Everyone · completed",164,268,{w:600,size:18,color:rgba(SOFT,1)});
    T(ctx,"email",164,318,{w:700,size:18,color:rgba(SOFT,1)});const e=pulseAt(t,w("walkin","no email"),1.4);ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(mix(SOFT,PP_AMB,e),0.9);ctx.lineWidth=2;rr(ctx,230,296,300,34,8);ctx.stroke();ctx.restore();},{dy:24});
  arrive(ctx,580,390,t,w("walkin","walk-in")-0.1,()=>tag(ctx,580,390,"a walk-in",PP_SC,{align:"center",size:20}),{dy:12});
  // the count of missing emails runs 0 → 5 → 6, and the light follows; today it settles on one
  const t0=w("agreed","warn"),t5=w("agreed","stop"),t6=w("agreed","more than five");let n=0;
  if(t>=t0-0.6)n=0;if(t>=t0)n=1+Math.floor(clamp((t-t0)/Math.max(0.5,t5-t0),0,0.999)*5);if(t>=t6)n=6;if(t>=To-0.2)n=1;const nA=fin(t,t0-0.8,0.5);
  const lit=n===0?0:n<=5?1:2,lt=t<t0-0.6?(t<w("not","warn")?0.0:t<w("not","stop the build")?1:t<w("walkin","walk-in")?2:0):lit;
  arrive(ctx,250,600,t,w("not","warn")-0.6,()=>pp_light(ctx,250,600,0.88,lt,1),{from:0.9});
  withA(ctx,nA,()=>{T(ctx,"current enrolments",380,500,{w:700,size:18,color:rgba(SOFT,1)});T(ctx,"with no email",380,524,{w:700,size:18,color:rgba(SOFT,1)});T(ctx,String(n),380,604,{w:800,size:72,color:rgba([GOOD,PP_AMB,BAD][lit],1)});
    tag(ctx,380,664,"warn if > 0",PP_AMB,{size:20,hi:0});tag(ctx,380,714,"stop if > 5",BAD,{size:20});});
  // the test, its levels lighting as they're named
  const fOut=fin(t,Fr-0.3,0.6);
  arrive(ctx,1255,300,t,Wa+0.6,()=>pp_code(ctx,700,120,1110,"models/staging/short_courses/_short_courses__models.yml",PP_SCY,{a:1-fOut,size:18,lh:27,p:clamp((t-Wa-0.8)/1.8,0,1),edge:PP_SC,lit:{9:fin(t,t0,0.4),10:fin(t,t5,0.4),3:fin(t,w("agreed","learning team"),0.4)},litCol:PP_AMB}),{dy:30});
  // the learning team's decision, from the decisions log
  arrive(ctx,1250,640,t,w("agreed","learning team")-0.2,()=>{pp_face(ctx,"tom",760,650,46,t,{name:"",role:""});T(ctx,"the learning team · docs/decisions.md",830,624,{w:800,size:22,color:rgba(TRUST,1)});
    wrapT(ctx,"9 Oct 2026 · An enrolment with no email: warn when there's any, stop the build when more than five.",830,660,940,{w:600,size:20,color:rgba(INK,0.95)});},{dy:20});
  kt_gtick(ctx,1790,612,15,fin(t,w("agreed","learning team")+0.6,0.35));
  // today's build: one warning, and it carries on
  arrive(ctx,1060,546,t,To-0.1,()=>{glass(ctx,700,518,850,56,12,PP_AMB,{glow:14,ea:0.9,fill:"rgba(16,12,4,0.96)"});T(ctx,"today",722,554,{w:800,size:18,color:rgba(SOFT,1)});T(ctx,"WARN 1 not_null_stg_short_courses__enrolments_customer_bk",790,554,{f:"mono",w:500,size:18,color:rgba(PP_AMB,1)});},{dy:16});
  // freshness works the same way: a clock on the student system's stream
  arrive(ctx,1255,210,t,Fr-0.2,()=>pp_code(ctx,700,120,1110,"models/staging/student_system/_student_system__sources.yml",PP_FRESH,{p:clamp((t-Fr)/1.0,0,1),edge:PP_SIS,lit:{2:fin(t,w("fresh","a day late"),0.4),3:fin(t,w("fresh","fail at three"),0.4)},litCol:PP_AMB}),{dy:30});
  arrive(ctx,960,370,t,Fr+0.4,()=>{glass(ctx,700,336,560,68,14,PP_SIS,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.fillStyle=rgba(PP_SIS,1);rr(ctx,716,354,6,32,3);ctx.fill();T(ctx,"student system",736,378,{w:700,size:21});
    pp_clock(ctx,1222,370,24,clamp((t-Fr-0.4)/3,0,1)*1.6,PP_SIS,1);},{dy:16});
  withA(ctx,fin(t,w("fresh","a day late"),0.4),()=>tag(ctx,1284,370,"warn after a day",PP_AMB,{size:20}));
  withA(ctx,fin(t,w("fresh","fail at three"),0.4),()=>tag(ctx,1500,370,"error after three",BAD,{size:20}));
  // who sets the level
  arrive(ctx,1250,800,t,w("owner","The data's owner")-0.1,()=>tag(ctx,1250,800,"the owner sets the level · the reason, written down",TRUST,{align:"center",size:22}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Waiting, on purpose ---------- */
const PP_COUNT=[[36,"not_null"],[20,"relationships"],[18,"accepted_values"],[18,"unique_combination"],[12,"unique"],[5,"versions_do_not_overlap"],[2,"singular"]];
scene("next",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:480});
  const Re=c("red"),Gr=c("green");
  // every test, in a column of hollow dots: written, reviewed, not yet run
  arrive(ctx,480,480,t,0.3,()=>{glass(ctx,90,100,800,760,18,[170,205,255],{glow:12,ea:0.6,fill:"rgba(6,10,20,0.95)"});},{from:0.96});
  arrive(ctx,120,160,t,w("count","hundred")-0.2,()=>{T(ctx,"111",122,176,{w:800,size:52,color:rgba(INK,1)});T(ctx,"data tests",232,176,{w:700,size:28,color:rgba(SOFT,1)});},{from:0.9});
  PP_COUNT.forEach(([n,nm],i)=>{const y=242+i*66,t0=w("count","hundred")+0.3+i*0.22,a=fin(t,t0,0.4);if(a<=0)return;withA(ctx,a,()=>{T(ctx,String(n),170,y,{f:"mono",w:500,size:22,align:"right",color:rgba(INK,1)});T(ctx,nm,190,y,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});
    pp_dots(ctx,476,y-14,n,[170,205,255],clamp((t-t0)/0.8,0,1),{per:36,gap:11,r:4});});});
  arrive(ctx,120,720,t,w("count","Four unit")-0.2,()=>{T(ctx,"4",170,736,{f:"mono",w:500,size:22,align:"right",color:rgba(INK,1)});T(ctx,"unit tests",190,736,{w:700,size:22,color:rgba(PP_INT,1)});pp_dots(ctx,476,722,4,PP_INT,clamp((t-w("count","Four unit"))/0.6,0,1),{gap:14,r:5});},{from:0.9});
  withA(ctx,fin(t,w("count","Every promise"),0.5),()=>T(ctx,"hollow: written, reviewed, not yet run",120,820,{w:600,size:20,color:rgba(SOFT,1)}));
  // the models they check, waiting, empty
  arrive(ctx,1390,300,t,0.6,()=>{LAYER4.forEach(([nm,col],i)=>{const x=1010+i*196;T(ctx,nm,x+86,160,{w:800,size:20,align:"center",color:rgba(col,1)});[0,1,2].forEach(r=>pp_outline(ctx,x+10,186+r*74,152,50,"",col,{fill:0.5}));});},{from:0.95});
  arrive(ctx,1390,140,t,w("count","Every promise")-0.1,()=>tag(ctx,1390,100,"every promise, with its proof",TRUST,{align:"center",size:22}),{dy:12});
  arrive(ctx,1390,470,t,w("red","written before")-0.1,()=>T(ctx,"written before the code",1390,478,{w:700,size:24,align:"center",color:rgba(INK,1)}),{dy:12});
  arrive(ctx,1390,520,t,w("red","can't pass")-0.1,()=>T(ctx,"none can pass yet",1390,524,{w:700,size:24,align:"center",color:rgba(SOFT,1)}),{dy:12});
  arrive(ctx,1390,570,t,w("red","on purpose")-0.1,()=>tag(ctx,1390,572,"on purpose",WEED,{align:"center",size:22}),{dy:12});
  // the hollow seal from the opening, beside the core, not yet struck
  pp_seal(ctx,1494,680,44,t,{a:fin(t,1.0,0.8)});
  // the loop: the next step glows faintly
  pp_loop(ctx,1722,800,1,t,STEPS10.map((_,i)=>i===5?0.45+0.3*fin(t,Gr,0.6):i<5?0.5:0.15),fin(t,0.8,0.6));
  arrive(ctx,1310,808,t,Gr-0.1,()=>T(ctx,"next: the least code that turns them green",1310,816,{w:700,size:22,align:"center",color:rgba(GOOD,1)}),{dy:12});
  ctx.restore();weedsEnd(ctx,S,t,B,"Promises and proofs",WEED,"Promise it in a contract. Prove it with a test, first.");
  fadeIn(ctx,S,t,0.01);vign(ctx,S);});
