/* ===== How value reaches people: scenes =====
   Ten chapters, as in ../script.md. Mumbai's dabbawalas: a lunch crosses the city by bicycle, train and on foot, with the detail at the
   hand-offs and three stages from the customer's side; a storm on Hill Street and one household's call; the night drawn from the
   household's side, as a value stream; the capabilities under its stages, and three teams in swimlanes, where the hand-offs hurt; the
   process map in four groups; process levels, down to seven steps; the process's edges, as a SIPOC; who goes first, drawn in BPMN, and
   three faults put through it; the facts the rule needs, and where each comes from; and the lights back on, confirmed.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera moves in on the kitchen and the first
   hand-off in chapter 1, then pulls back to the whole route. Motion (In the weeds of data crafting's helpers): every shot drifts slowly and
   things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep
   the two in step. */

const D5_STAGES=["acknowledge","dispatch","restore","explain"],D5_VALUE=["someone knows","help on the way","the lights are back","an answer"];
const D5_CAPS=["find faults","dispatch crews","restore supply","inform customers"];
const D5_STEPS=["take the call","find the fault","decide who goes first","send the crew","repair","switch back on","confirm"];
const D5_WARM=[255,214,150];

/* ---------- 1. Lunch, across the city ---------- */
// where the hero tin is, as it crosses the city: [time, x, y] keys, with an arc between keys marked as a hand-off
function d5_lerpKeys(t,K){if(t<=K[0][0])return[K[0][1],K[0][2]];for(let i=1;i<K.length;i++)if(t<K[i][0]){const[a,x0,y0]=K[i-1],[b,x1,y1,arc]=K[i],u=(t-a)/(b-a),e=arc?ease(u):u;return[lerp(x0,x1,e),lerp(y0,y1,e)-(arc?Math.sin(Math.PI*u)*arc:0)];}const L=K[K.length-1];return[L[1],L[2]];}
// a small lid, seen from above, with a red cross and a blue mark: the marks read at a hand-off (texture: no words in it)
function d5_miniLid(ctx,x,y,r,a){withA(ctx,a,()=>{ctx.fillStyle="#c9cfd3";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.strokeStyle="rgba(196,52,44,0.95)";ctx.lineWidth=r*0.18;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x-r*0.55,y-r*0.45);ctx.lineTo(x-r*0.15,y-r*0.05);ctx.moveTo(x-r*0.15,y-r*0.45);ctx.lineTo(x-r*0.55,y-r*0.05);ctx.stroke();ctx.fillStyle="rgba(40,60,140,0.95)";ctx.fillRect(x+r*0.05,y-r*0.2,r*0.22,r*0.62);ctx.fillRect(x+r*0.35,y+r*0.1,r*0.22,r*0.32);});}
scene("lunch",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const T0=w("hands","By"),tH1=w("kitchen","the tin to")-0.2,tSc=c("scale"),tD=c("detail"),tC=c("customer"),pm=fin(t,w("customer","comes back")-0.4,2.0),relit=fin(t,B,1.4);
  d5_sky(ctx,S,pm);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:640});focus(ctx,t,[[0,330,650,1.7],[T0-0.9,960,590,1.1]]);
  d5_skyline(ctx,pm);d5_ground(ctx);d5_home(ctx,90,760,t,1);d5_tower(ctx,1650,760,230,560,fin(t,T0+6.8,0.6));
  d5_canopy(ctx,560,920);d5_canopy(ctx,1150,1510);
  // the train: waiting at the first station, then across to the second, with the crate in its door
  const tx=lerp(740,1330,ease(clamp((t-T0-2.2)/2.2,0,1)));d5_train(ctx,tx,{crate:true});d5_platform(ctx,540,940);d5_platform(ctx,1130,1530);
  // the sorters on the platforms
  [[600,1,0],[690,-1,1],[1240,1,2],[1440,-1,3]].forEach(([x,dir,k])=>d5_man(ctx,x,680,1,{mode:"sort",dir,t,seed:k}));
  // the cyclist, then the walker with the crate on his head
  const bx=lerp(430,520,ease(clamp((t-T0+0.2)/1.8,0,1))),cr=(t<T0-0.2?0:t>T0+1.6?(T0+1.8-T0+0.2)*7:(t-T0+0.2)*7);
  d5_cyclist(ctx,bx,804,1,cr,{t,n:2});
  const wx=lerp(1560,1730,clamp((t-T0-5.0)/1.6,0,1)),wk=t>T0+5.0&&t<T0+6.6?1:0;d5_man(ctx,wx,806,1,{mode:"carry",ph:(wx-1560)/14,go:wk,t,seed:2,n:3});
  // the lunch: from the kitchen window to the cyclist, to the platform, into the train, to the walker's crate, to a lit window
  const K=[[0,151,700],[tH1,151,700],[tH1+0.7,bx+34,764,60],[T0-0.2,430+34,764],[T0+1.6,520+34,764],[T0+2.15,tx-127,662,70],[T0+4.4,1330-127,662],[T0+5.0,wx,654,80],[T0+6.6,1730,654],[T0+7.2,1785,404,90]];
  let[hx,hy]=d5_lerpKeys(t,K);if(t>T0-0.2&&t<T0+1.6){hx=bx+34;hy=764;}if(t>T0+2.15&&t<T0+4.4){hx=tx-127;}if(t>T0+5.0&&t<T0+6.6){hx=wx;}
  const ga=1-0.6*fin(t,tSc-0.3,0.6)*(1-fin(t,tC,0.6));d5_tin(ctx,hx,hy,1.25,{hi:ga,mark:[200,60,50],a:1-fin(t,T0+7.6,0.6)});
  // the hand-offs: a ring at each, glowing as the lunch passes; at "detail", all four glow and show their marks
  const HO=[[480,722,tH1+0.7],[612,640,T0+2.15],[1560,616,T0+5.0],[1785,380,T0+7.2]],dg=fin(t,tD,0.6)*(1-fin(t,tC+0.4,0.6));
  HO.forEach(([x,y,t0])=>{const g=Math.max(pulseAt(t,t0-0.1,1.4),dg);if(t>t0-0.3||dg>0)d5_ring(ctx,x,y,g);d5_miniLid(ctx,x+40,y-40,22,dg);});
  // the city at work: many lunches on the move
  const sw=fin(t,tSc,0.8)*(1-0.5*fin(t,tD,0.6));if(sw>0){const R=mk([[150,700],[480,740],[612,650],[1203,650],[1560,640],[1785,404]].map(([x,y])=>P(x,y)));
    for(let k=0;k<44;k++){const u=((t*0.07+hash(k,90))%1);const q=at(R,u),dy=(hash(k,91)-0.5)*40;withA(ctx,sw*sstep(0,0.05,u)*(1-sstep(0.95,1,u)),()=>{glow(ctx,q.x,q.y+dy,18,D5_WARM,0.5);ctx.fillStyle="rgba(230,234,236,0.95)";ctx.beginPath();ctx.arc(q.x,q.y+dy,4.5,0,TAU);ctx.fill();});}}
  // the empty tin home again, high over the route, in the afternoon
  const back=clamp((t-w("customer","comes back")+0.2)/1.8,0,1);if(back>0&&back<1){const x=lerp(1785,151,ease(back)),y=520-Math.sin(Math.PI*back)*180;d5_tin(ctx,x,y,0.9,{hi:0.6});}
  ctx.restore();
  // the lid, close up
  const lp=fin(t,c("code")-0.3,0.5)*(1-fin(t,T0-0.9,0.5));if(lp>0)withA(ctx,lp,()=>{glass(ctx,1180,130,660,440,22,[200,210,230],{glow:14,ea:0.7,fill:"rgba(16,14,14,0.94)"});
    d5_lid(ctx,1470,350,140,clamp((t-c("code"))/1.6,0,1),fin(t,w("code","the station")-0.2,0.5));});
  eaYear(ctx,90,90,"Mumbai · a weekday morning",CLAY,fin(t,0.3,0.6)*(1-fin(t,tSc-0.4,0.4)));
  arrive(ctx,1700,150,t,T0+7.0,()=>withA(ctx,1-fin(t,tSc-0.3,0.4),()=>tag(ctx,1700,150,"by lunchtime",D5_WARM,{align:"center",size:32})),{dy:10});
  [["before 2020: about 5,000 dabbawalas","five thousand",130],["some 200,000 lunches a day","two hundred",200],["almost no errors","almost no",270]].forEach(([s_,k,y])=>arrive(ctx,960,y,t,w("scale",k),()=>withA(ctx,1-fin(t,tD-0.4,0.4),()=>tag(ctx,960,y,s_,D5_WARM,{align:"center",size:32})),{dy:10}));
  arrive(ctx,960,150,t,w("detail","change hands"),()=>withA(ctx,1-fin(t,tC-0.3,0.4),()=>tag(ctx,960,150,"the detail: where the tins change hands",D5_WARM,{align:"center",size:32})),{dy:10});
  // what the customer sees: three stages
  d5_stream(ctx,t,180,110,560,100,["lunch leaves home","lunch arrives","the tin comes back"],{t0:[w("customer","lunch leaves"),w("customer","lunch arrives"),w("customer","the tin")],size:32,glyph:true,hi:[0,0,0]});
  fadeIn(ctx,S,t);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"How value reaches people","the customer's view, and detail only where it matters",EAC,"Film 5 of 11 · enterprise architecture, for data");});

/* ---------- 2. The lights go out ---------- */
scene("storm",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tX=c("branch")-0.8,xA=fin(t,tX,0.8),tF=w("branch","falls"),tDk=w("branch","Forty")-0.6,tC=c("call"),tT=c("teams");
  // the wall, and Tomás's note
  if(xA<1)withA(ctx,1-xA,()=>{wallBg(ctx,S,t);ctx.save();drift(ctx,t,sc,{z:0.03,y:420});person(ctx,"tomas",360,1030,0.8,{t,pose:t<c("note")+2.2?"explain":"stand"});
    arrive(ctx,1000,420,t,0.3,()=>sticky(ctx,1000,420,640,200,"How does value reach people?",{col:NOTEC[0],size:44,st:0,rot:-0.02}),{dy:-30});ctx.restore();vign(ctx,S);});
  // Hill Street, in the storm
  if(xA>0)withA(ctx,xA,()=>{setScreen(ctx,S);ctx.save();drift(ctx,t,sc,{z:0.025,y:600});focus(ctx,t,[[0,960,560,1],[tF-0.6,640,600,1.22],[tC+0.2,960,560,1]]);
    d5_street(ctx,t,{off:i=>fin(t,tDk+Math.abs(i-1.5)*0.14,0.3),br:clamp((t-tF)/0.9,0,1),wd:clamp((t-tF-0.7)/0.6,0,1),flash:pulseAt(t,tF+0.85,0.7)});
    // a phone lights up in one window
    const ph=fin(t,tC,0.4);if(ph>0){glow(ctx,395,760,40,[150,200,255],0.6*ph);ctx.fillStyle=rgba([170,210,255],ph);ctx.fillRect(388,748,12,20);}
    ctx.restore();
    eaYear(ctx,90,90,"2:10 a.m. · Hill Street",CLAY,fin(t,c("branch"),0.6));
    d5_phone(ctx,1450,120,360,520,[["2:14 a.m.",30,rgba(SOFT,1)],["calling",36],["the faults line",36,rgba(EAC,1)]],{a:fin(t,w("call","calls")-0.2,0.5),ring:fin(t,w("call","calls"),0.4)*(1-fin(t,tT,0.6)),t});
    arrive(ctx,700,150,t,w("branch","Forty"),()=>withA(ctx,1-fin(t,tT-0.3,0.4),()=>tag(ctx,700,150,"40 homes dark",[255,140,120],{align:"center",size:34})),{dy:10});
    arrive(ctx,700,150,t,w("teams","three teams"),()=>tag(ctx,700,150,"three teams",PARCH,{align:"center",size:32}),{dy:10});
    arrive(ctx,700,222,t,w("teams","a rule"),()=>tag(ctx,700,222,"a rule nobody has written down",[255,140,120],{align:"center",size:32}),{dy:10});
    vign(ctx,S);});});

/* ---------- 3. From the household's side ---------- */
scene("side",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tF=w("farah","Farah"),tS=w("sees","no teams"),tG=c("gets"),tV=w("stream","value stream"),tHf=c("handful");
  arrive(ctx,1760,800,t,tF-0.3,()=>{person(ctx,"farah",1760,1030,0.8,{t,pose:(t>tF+0.4&&t<tF+2.4)||(t>tV&&t<tV+2.2)?"explain":"stand"});tag(ctx,1660,540,"Farah · customer advocate",TRUST,{align:"center",size:28});},{dy:20,from:0.96});
  // the household, sketched while Farah starts, and what it doesn't see
  arrive(ctx,835,560,t,tF+0.3,()=>d5_household(ctx,835,560,t,1-fin(t,c("list")-0.4,0.5)),{dy:-20,from:0.96});
  const gh=fin(t,tS,0.5)*(1-fin(t,c("list")+0.5,0.6));if(gh>0)withA(ctx,gh*0.75,()=>[["contact centre",420],["control room",835],["outage system",1250]].forEach(([s_,x])=>{tag(ctx,x,770,s_,SOFT,{align:"center",size:30});
    const sk=fin(t,w("sees","no systems")+0.2,0.4);if(sk>0){ctx.strokeStyle="rgba(232,110,96,0.9)";ctx.lineWidth=4;const hw=tw(ctx,s_,30,700)/2+14;ctx.beginPath();ctx.moveTo(x-hw,770);ctx.lineTo(x-hw+2*hw*sk,770);ctx.stroke();}}));
  // the stages, in order, and what the household gets at each
  const C=d5_stream(ctx,t,80,260,410,140,D5_STAGES,{t0:[w("list","Someone"),w("list","Help"),w("list","lights"),w("list","And someone")],size:34});
  D5_VALUE.forEach((v,i)=>{const t0=[w("list","Someone"),w("list","Help"),w("list","lights"),w("list","And someone")][i]+0.3;
    arrive(ctx,C[i][0],480,t,t0,()=>{const g=pulseAt(t,tG+i*0.2,1.2);ctx.strokeStyle=rgba(D5_WARM,0.5+0.4*g);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(C[i][0],402);ctx.lineTo(C[i][0],452);ctx.stroke();tag(ctx,C[i][0],480,v,D5_WARM,{align:"center",size:30});},{dy:10});});
  ctx.restore();
  arrive(ctx,835,130,t,tS+0.6,()=>tag(ctx,835,130,t>tV-0.2?"value stream · get the power back":"the household's view: a few stages, in order",t>tV-0.2?STR:PARCH,{align:"center",size:34}),{dy:10});
  arrive(ctx,835,600,t,tG,()=>withA(ctx,1-fin(t,tV-0.3,0.4),()=>tag(ctx,835,600,"each stage: something the household gets",D5_WARM,{align:"center",size:30})),{dy:10});
  arrive(ctx,835,600,t,tV+0.4,()=>tag(ctx,835,600,"how value reaches a customer, seen from their side",STR,{align:"center",size:30}),{dy:10});
  // another value stream
  arrive(ctx,200,790,t,w("handful","meter to cash")-0.2,()=>T(ctx,"meter to cash",200,800,{w:800,size:32,align:"center",color:rgba(STR,1)}),{dy:10});
  d5_stream(ctx,t,400,740,300,100,["read","bill","paid"],{t0:[w("handful","meter to cash"),w("handful","meter to cash")+0.2,w("handful","meter to cash")+0.4],size:30});
  arrive(ctx,1430,790,t,w("handful","only a handful"),()=>tag(ctx,1430,790,"a handful of value streams",PARCH,{align:"center",size:28}),{dy:10});
  vign(ctx,S);});

/* ---------- 4. Three teams, one stream ---------- */
// the work's path through the lanes, and its hand-offs from one team to the next
const D5_PATH=[[330,510],[560,650],[800,650],[1040,790],[1280,650],[1520,510],[1760,510]],D5_HAND=[[445,580],[920,720],[1160,720],[1400,580]];
scene("teams",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tTh=c("three"),tS=c("sees"),tTi=c("tins"),wrong=fin(t,w("sees","go wrong")-0.3,0.4);
  const gl=ease(fin(t,0.1,1.3)),C=d5_stream(ctx,t,80,lerp(260,110,gl),410,lerp(140,110,gl),D5_STAGES,{size:Math.round(lerp(34,30,gl))});
  D5_CAPS.forEach((n,i)=>{const t0=w("caps",["Finding","Dispatching","Restoring","Informing"][i])-0.1,q=fin(t,t0,0.5);if(q>0)withA(ctx,q,()=>{ctx.strokeStyle=rgba(STR,0.6);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(C[i][0],222);ctx.lineTo(C[i][0],266);ctx.stroke();ctx.setLineDash([]);});
    arrive(ctx,C[i][0],320,t,t0,()=>archEl(ctx,C[i][0]-170,270,340,100,n,STR,"capability",{size:30,gs:15,hi:pulseAt(t,t0+0.2,1.4)}),{dy:-14});});
  // the teams, and the work passing between them
  const la=fin(t,w("three","three teams")-0.2,0.6);d5_lanes(ctx,40,440,1840,140,["contact centre","control room","field crews"],la);
  const pp=clamp((t-w("three","contact centre"))/3.6,0,1);if(pp>0){const L=mk(D5_PATH.map(([x,y])=>P(x,y)));ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=rgba(BUS,0.85);ctx.lineWidth=4;ctx.beginPath();
    for(let i=0;i<=80;i++){const u=i/80*pp,q=at(L,u);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}ctx.stroke();ctx.restore();
    D5_PATH.forEach(([x,y],i)=>{if(at(L,pp).x>=x-2||i===0){ctx.fillStyle=rgba(BUS,1);ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();}});
    D5_HAND.forEach(([x,y],i)=>{if(at(L,pp).x<x)return;const bad=i===1?wrong:0;d5_ring(ctx,x,y,Math.max(pulseAt(t,tS+0.3+i*0.25,1.0)*0.8,fin(t,tTi,0.5)),bad>0?mix(D5_WARM,[232,92,80],bad):D5_WARM);
      if(bad>0)withA(ctx,bad,()=>{glow(ctx,x,y,70,[232,92,80],0.4);cross_(ctx,x,y,26,[232,92,80],1);});
      d5_tin(ctx,x+30,y-12,0.7,{a:fin(t,tTi+0.2+i*0.15,0.4),mark:[200,60,50]});});}
  ctx.restore();
  arrive(ctx,960,405,t,w("tins","detail"),()=>tag(ctx,960,405,"the detail belongs where the work changes hands",D5_WARM,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 5. Four kinds of process ---------- */
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tG=c("grace"),tR=c("restore"),mp=clamp((t-w("grace","process map")+0.2)/1.6,0,1),rh=fin(t,w("restore","Restoring"),0.5),mh=fin(t,w("restore","Evaluation"),0.5);
  arrive(ctx,1810,800,t,tG-0.3,()=>person(ctx,"grace",1810,1030,0.72,{t,pose:t>tG&&t<tG+2.4?"explain":"stand"}),{dy:20,from:0.96});
  // what each one shows
  const vs=fin(t,0.2,0.5)*(1-fin(t,w("grace","process map")-0.4,0.5));if(vs>0)withA(ctx,vs,()=>{d5_stream(ctx,t,400,250,300,100,D5_STAGES,{size:28});T(ctx,"a value stream: what reaches the customer",900,400,{w:700,size:30,align:"center",color:rgba(STR,1)});
    D5_STEPS.forEach((s_,i)=>{if(i>4)return;d5_step(ctx,400+i*250,600,230,110,s_,{});});T(ctx,"a process: how the work gets done",900,710,{w:700,size:30,align:"center",color:rgba(BUS,1)});});
  const band=["Strategic","Operational","Support","Evaluation"].map(k=>pulseAt(t,w("groups",k)-0.1,1.6));
  const pos=d5_pmap(ctx,200,100,1360,700,{a:fin(t,w("grace","process map")-0.2,0.5),p:mp,band,hi:{"restore supply":rh,"measure reliability":mh}});
  if(mp>0)withA(ctx,mp,()=>{[["customer needs",40],["customer served",1575]].forEach(([s_,x])=>{glass(ctx,x,330,150,150,16,[200,210,230],{glow:8,ea:0.6,fill:"rgba(10,14,26,0.94)"});wrapT(ctx,s_,x+75,393,130,{size:28,w:700,align:"center",lh:32});});});
  if(pos&&mh>0){const[a,b,c_,d]=pos["restore supply"],[e,f,g,h]=pos["measure reliability"];arrowTo(ctx,a+c_/2,b+d,e+g/2,f-6,BUS,0.8*mh,{p:mh,lw:3,head:12,dash:[8,7],bend:-0.15});}
  ctx.restore();
  arrive(ctx,880,850,t,w("restore","how long"),()=>tag(ctx,880,850,"measured: how long, and how often, customers are without power",BUS,{align:"center",size:28}),{dy:10});
  vign(ctx,S);});

/* ---------- 6. Levels, again ---------- */
scene("levels",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const t1=w("two","Level one"),t2=w("two","Level two"),t3=w("three","Level three"),tE=c("enough");
  [["level 1",210,t1],["level 2",470,t2],["level 3",562,t3]].forEach(([s_,y,t0])=>arrive(ctx,120,y,t,t0-0.2,()=>T(ctx,s_,60,y,{f:"mono",w:600,size:30,color:rgba(BUS,1)}),{dy:8}));
  // level 1: the whole map, small; level 2: one process; level 3: its steps
  let rs=null;arrive(ctx,545,240,t,t1-0.1,()=>{ctx.save();ctx.translate(260,90);ctx.scale(0.42,0.42);const pos=d5_pmap(ctx,0,0,1360,700,{deco:true,hi:{"restore supply":fin(t,t2-0.3,0.4)}});ctx.restore();
    const[a,b,c_,d]=pos["restore supply"];rs=[260+a*0.42,90+b*0.42,c_*0.42,d*0.42];},{dy:-12});
  const z2=fin(t,t2,0.6);if(z2>0&&rs)withA(ctx,z2,()=>{ctx.strokeStyle=rgba(BUS,0.45);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(rs[0],rs[1]+rs[3]);ctx.lineTo(260,410);ctx.moveTo(rs[0]+rs[2],rs[1]+rs[3]);ctx.lineTo(700,410);ctx.stroke();ctx.setLineDash([]);});
  arrive(ctx,480,460,t,t2+0.1,()=>archEl(ctx,260,410,440,100,"restore supply",BUS,"process",{size:34,gs:15,hi:fin(t,t3-0.3,0.4)*0.6}),{dy:-12});
  const z3=fin(t,t3,0.6);if(z3>0)withA(ctx,z3,()=>{ctx.strokeStyle=rgba(BUS,0.45);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(260,510);ctx.lineTo(220,580);ctx.moveTo(700,510);ctx.lineTo(1854,580);ctx.stroke();ctx.setLineDash([]);});
  D5_STEPS.forEach((s_,i)=>{const x=186+i*258,t0=w("three",["Take","Find","Decide","Send","Repair","Switch","Confirm"][i])-0.1;
    if(i>0){const q=fin(t,t0,0.4);if(q>0)arrowTo(ctx,x-258+122,650,x-124,650,BUS,0.7,{p:q,lw:2.5,head:10});}
    arrive(ctx,x,650,t,t0,()=>{d5_step(ctx,x,650,236,120,s_,{hi:i===2?fin(t,tE+0.8,0.5):0,hiCol:[232,110,96]});
      if(i!==2)tick_(ctx,x+92,610,26,[120,210,130],fin(t,tE+0.2+i*0.08,0.3));else withA(ctx,fin(t,tE+0.8,0.5),()=>T(ctx,"?",x+96,624,{w:800,size:44,align:"center",color:"rgba(232,110,96,1)"}));},{dy:-14});});
  ctx.restore();
  arrive(ctx,960,820,t,w("enough","a box"),()=>tag(ctx,960,820,"for most steps, a box and an arrow say enough",BUS,{align:"center",size:30}),{dy:10});
  vign(ctx,S);});

/* ---------- 7. The edges ---------- */
// a SIPOC's columns: letter, name, x, and its items [text, the word that brings it]
const D5_SIPOC=[["S","suppliers",240,[["households","in","calls"],["smart meters","in","alarms"],["crew vans","in","where each crew"]],NOTEC[2]],
  ["I","inputs",600,[["calls","in","calls"],["meter alarms","in","alarms"],["crew locations","in","where each crew"]],INFP],
  ["P","process",960,[],null],
  ["O","outputs",1320,[["power back on","out","power back"],["a time to tell customers","out","a time"],["a fault record","out","fault record"]],INFP],
  ["C","customers",1680,[["households","out","power back"],["the contact centre","out","a time"],["the regulator","out","fault record"]],NOTEC[2]]];
scene("edges",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tR=c("record"),fr=fin(t,w("record","fault record")-0.1,0.5);
  const TH=[w("sipoc","Who supplies"),w("sipoc","what comes in"),w("edges","edges"),w("sipoc","what goes out"),w("sipoc","to whom")];
  D5_SIPOC.forEach(([L,n,x,items,col],k)=>{arrive(ctx,x,170,t,TH[k]-0.1,()=>d5_sipocHead(ctx,x,170,L,n,1),{dy:-10});
    if(k<4){const q=fin(t,Math.max(TH[k],TH[k+1])+0.2,0.4);if(q>0)arrowTo(ctx,x+60,150,x+300,150,SOFT,0.6,{p:q,lw:2.5,head:11});}
    items.forEach(([s_,lid,word],j)=>{const t0=w(lid,word)-0.1,y=330+j*130,isRec=k===3&&j===2;arrive(ctx,x,y,t,t0,()=>sticky(ctx,x,y,320,104,s_,{col,size:28,rot:(j-1)*0.015}),{dy:-14});
      if(isRec&&fr>0)withA(ctx,fr,()=>{ctx.save();ctx.strokeStyle=rgba(INF,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(INF,0.8);ctx.shadowBlur=14;rr(ctx,x-168,y-60,336,120,12);ctx.stroke();ctx.restore();});});});
  arrive(ctx,960,460,t,TH[2],()=>{archEl(ctx,800,380,320,150,"restore supply",BUS,"process",{size:32,gs:15});T(ctx,"seven steps",960,575,{w:700,size:28,align:"center",color:rgba(SOFT,1)});},{dy:-14});
  // the fault record, and where it goes
  arrive(ctx,1120,750,t,w("record","start"),()=>{const h=ruleCard(ctx,860,690,520,"start 2:10 · end 3:40 · cause: a branch",{kicker:"fault record",col:INF,size:28});
    arrowTo(ctx,1380,720,1600,650,INF,0.8*fin(t,w("record","regulator"),0.5),{p:fin(t,w("record","regulator"),0.5),lw:3,head:12,bend:0.15});},{dy:14});
  ctx.restore();
  vign(ctx,S);});

/* ---------- 8. Who goes first ---------- */
const D5_FAULT=[["Hill Street","wire down","40 homes","wire",340,[255,150,110]],["Riverside","life support","12 homes","life",960,[255,130,170]],["East side","1,200 homes",null,"homes",1580,[255,206,120]]];
scene("first",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tF=[w("faults","Hill Street"),w("faults","Riverside"),w("faults","east side")],tHb=c("habit"),tR=c("rule"),tO=c("order"),ru=[w("rule","wires down"),w("rule","Then life"),w("rule","most homes")];
  // the step, close up, until the night's faults arrive
  arrive(ctx,960,560,t,0.3,()=>withA(ctx,1-fin(t,tF[0]-0.4,0.5),()=>d5_step(ctx,960,560,460,170,"decide who goes first",{size:38,hi:0.6+0.4*Math.sin(t*2),hiCol:[232,110,96]})),{dy:-14});
  D5_FAULT.forEach(([n,l1,l2,ic,x,col],i)=>arrive(ctx,x,210,t,tF[i]-0.1,()=>d5_fault(ctx,x,210,440,180,n,l1,l2,ic,{col,t,hi:pulseAt(t,ru[i],1.2)}),{dy:-16}));
  // two crews are free; habit would send both to the biggest fault
  const hb=fin(t,w("tonight","two crews"),0.5)*(1-fin(t,tR,0.5));if(hb>0)withA(ctx,hb,()=>{[1420,1720].forEach((x,k)=>{d5_van(ctx,x,440,0.9,"crew "+(k+1),{t});arrowTo(ctx,x,380,x>1580?1640:1520,306,[232,110,96],0.8,{p:fin(t,w("habit","biggest"),0.5),lw:3,head:12,dash:[8,7]});});
    const xx=fin(t,w("habit","biggest")+0.6,0.4);if(xx>0){cross_(ctx,1570,440,80,[232,110,96],xx);tag(ctx,1570,540,"by habit: the biggest first",[255,140,120],{align:"center",size:28});}});
  // the rule, drawn in BPMN, and the three faults put through it
  const A=d5_bpmn(ctx,0,{a:fin(t,tR-0.2,0.5),p:clamp((t-tR+0.2)/1.6,0,1),hi:{"wire down?":pulseAt(t,ru[0]+0.8,1.2),"life support?":pulseAt(t,ru[1]+1.2,1.2)}});
  const TP=[[[340,300],A.start,A.g1,[A.t1[0],A.t1[1]-58]],[[960,300],A.start,A.g1,A.g2,[A.t2[0],A.t2[1]-58]],[[1580,300],A.start,A.g1,A.g2,[A.t3[0]-150,A.t3[1]],A.t3,A.end]];
  TP.forEach((pts,i)=>{const u=clamp((t-ru[i])/(2.0+i*0.4),0,1);d5_token(ctx,pts,u,D5_FAULT[i][5],null,u>0?1-0.6*fin(t,ru[i]+2.6+i*0.4,0.5):0);});
  // the crews go where the rule says, then drive off in its order
  [[A.t1,ru[0]+2.0,"crew 1"],[A.t2,ru[1]+2.4,"crew 2"]].forEach(([p,t0,lab],k)=>{const go=ease(clamp((t-B-0.2-k*0.6)/1.4,0,1));
    arrive(ctx,p[0],p[1]+124,t,t0,()=>d5_van(ctx,p[0]+go*160,p[1]+124,0.9,lab,{t,a:1-go}),{dy:12});});
  arrive(ctx,1620,600,t,ru[2]+2.6,()=>tag(ctx,1620,600,"East side: the next crew",[255,206,120],{align:"center",size:28}),{dy:10});
  ctx.restore();
  arrive(ctx,150,420,t,w("order","BPMN"),()=>tag(ctx,150,420,"BPMN",[200,214,240],{align:"center",size:28}),{dy:8});
  arrive(ctx,1420,860,t,w("order","Order"),()=>tag(ctx,1420,860,"order and state: where a process earns its detail",[200,214,240],{align:"center",size:30}),{dy:10});
  vign(ctx,S);});

/* ---------- 9. What the rule needs ---------- */
scene("needs",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tW=c("wires"),tL=c("life"),tHm=c("homes"),tWh=c("where");
  const A=d5_bpmn(ctx,0,{hi:{"wire down?":fin(t,tW,0.4)*(1-fin(t,tL,0.4)),"life support?":fin(t,tL,0.4)*(1-fin(t,tHm,0.4)),"rank by homes cut off":fin(t,tHm,0.4)*(1-fin(t,tWh,0.4))}});
  // each fact, from where it comes
  [[A.g1,"which wires are down","from the calls",tW,0],[A.g2,"who is on life support","from a register",tL,0],[A.t3,"homes each fault cuts off","from the network model",tHm,1]].forEach(([p,s_,l,t0,qq],i)=>{
    const x=p[0]-190;arrive(ctx,p[0],190,t,t0,()=>{d5_data(ctx,x,110,380,170,s_,l,{q:qq?fin(t,w("homes","isn't sure"),0.5):0});
      ctx.strokeStyle=rgba(INF,0.7);ctx.lineWidth=2.4;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(p[0],282);ctx.lineTo(p[0],i===2?p[1]-48:p[1]-96);ctx.stroke();ctx.setLineDash([]);},{dy:-14});});
  ctx.restore();
  arrive(ctx,1600,340,t,w("homes","which homes hang"),()=>tag(ctx,1600,340,"which homes hang off which transformer?",[255,140,120],{align:"center",size:28}),{dy:8});
  arrive(ctx,1100,870,t,w("where","order"),()=>tag(ctx,1100,870,"order, state, timing: where the data rules are",INF,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 10. Back on ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tX=c("confirm")-0.7,xA=fin(t,tX,0.8),tB=w("back","lights")-0.3,tF=w("confirm","Farah")+0.2,tG=w("confirm","Grace"),tRu=w("rule","written"),cA=c("answer");
  // Hill Street: the lights come back, and the household gets its message
  if(xA<1)withA(ctx,1-xA,()=>{setScreen(ctx,S);ctx.save();drift(ctx,t,sc,{z:0.025,y:600});
    d5_street(ctx,t,{off:i=>1-fin(t,tB+Math.abs(i-1.5)*0.14,0.3),br:1,wd:1,fixed:1,branchA:0,van:1,wind:0.35,rain:0.25});ctx.restore();
    eaYear(ctx,90,90,"3:40 a.m. · Hill Street",CLAY,fin(t,0.2,0.6));
    d5_phone(ctx,1450,120,360,560,[["3:40 a.m.",30,rgba(SOFT,1)],["Power back on",36],["Hill Street",32,rgba(EAC,1)],["a branch on the line, now cleared",30,rgba(SOFT,1)]],{a:fin(t,w("back","message")-0.2,0.5),t});
    vign(ctx,S);});
  // the wall: what's confirmed, the rule written down, and the next question
  if(xA>0)withA(ctx,xA,()=>{wallBg(ctx,S,t);ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
    const gF=fin(t,tF,0.8),gG=fin(t,tG,0.8);
    d5_stream(ctx,t,60,170,300,100,D5_STAGES,{size:28,glass:[gF,gF,gF,gF]});
    if(gF>0)withA(ctx,gF,()=>{kt_gtick(ctx,90,340,22,1);T(ctx,"confirmed · Farah",126,350,{w:700,size:28,color:rgba(TRUST,1)});});
    arrive(ctx,280,450,t,0.3,()=>{sticky(ctx,280,450,440,96,"",{col:NOTEC[0],edge:BUS,glass:gG,rot:0});archGlyph(ctx,"process",86,425,12,gG>0.5?BUS:[120,96,20]);
      T(ctx,"restore supply · 7 steps",280,460,{w:800,size:28,align:"center",color:rgba(gG>0.5?INK:INKD,0.95)});},{dy:-14});
    if(gG>0)withA(ctx,gG,()=>{kt_gtick(ctx,560,450,22,1);T(ctx,"confirmed · Grace",596,460,{w:700,size:28,color:rgba(TRUST,1)});});
    arrive(ctx,440,640,t,tRu-0.2,()=>{ruleCard(ctx,60,560,760,"wires down first, then life support, then the most homes",{kicker:"rule · who goes first",col:BUS,size:30});
      withA(ctx,fin(t,w("rule","Grace owns"),0.5),()=>tag(ctx,60,760,"owner: Grace",TRUST,{size:28}));},{dy:14});
    person(ctx,"grace",1100,1030,0.76,{t,pose:t>tG&&t<tG+2.0?"explain":"stand"});
    person(ctx,"tomas",1800,1030,0.78,{t,pose:t>cA&&t<cA+2.2?"explain":"stand"});
    arrive(ctx,1560,150,t,0.4,()=>sticky(ctx,1560,150,470,120,"How does value reach people?",{col:NOTEC[0],size:30,st:fin(t,cA+1.4,0.5)*0.5,rot:-0.03}),{dy:-20});
    arrive(ctx,1600,400,t,cA,()=>sticky(ctx,1600,400,440,260,"A few stages, from the customer's side. Detail at one step: who goes first.",{col:NOTEC[0],size:30,p:clamp((t-cA-0.2)/2.2,0,1),rot:0.015}),{dy:-30,from:1.06});
    arrive(ctx,1480,700,t,w("next","who does"),()=>sticky(ctx,1480,700,430,150,"Who does it, and where does meaning change?",{col:NOTEC[0],size:30,st:0,rot:0.03}),{dy:-30,from:1.06});
    ctx.restore();vign(ctx,S);});
  eaEnd(ctx,S,t,B+0.8,"How value reaches people",EAC,"See it from the customer's side. Go deep only where it matters.","Film 5 of 11");});
