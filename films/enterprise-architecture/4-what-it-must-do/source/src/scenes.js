/* ===== What it must be able to do: scenes =====
   Ten chapters, as in ../script.md. The Inca's relay runners: the runners changed and the roads were rebuilt, and the ability to move
   a message stayed; Tomás's first capability map, which is the org chart again; a team is who, and it changes; a system is with what
   and a process is how, and under them an ability; three levels; an owner for each; a heat map with evidence; going deeper only where
   it hurts; capabilities as the spine of the map, where measures and data rules will hang; and an answer, for now.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera moves in on one relay post in chapter 1,
   then pulls back to the whole road. Motion (In the weeds of data crafting's helpers): every shot drifts slowly and things arrive with
   a spring. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- the capabilities of the utility, at level 1 ---------- */
// name, owner, and where it sits on the grid of chapters 6 to 8 (four across, two down)
const D4_L1=[["plan the network","Grace"],["operate the network","Grace"],["maintain assets","Grace"],["connect customers","Grace"],
  ["generate power",null],["sell energy","head of retail"],["serve customers","head of retail"],["meet obligations","Ama"]];
const d4_at=i=>[[270,720,1170,1620][i%4],[330,640][Math.floor(i/4)]];
// how each works today, with its evidence and a line to say so (chapter 7)
const D4_HEAT=[["g"],["g","outage reports","fixed within target"],["a","inspection records","2 in 5 poles uninspected"],["r","connection log","34 working days"],["n"],["g"],["g"],["g"]];

/* ---------- 1. The runners ---------- */
// where the message is along the road (0..1) at time t: keys [time, u], straight between them, so a runner keeps his pace
function d4_msgU(t,K){if(t<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(t<K[i][0]){const[a,ua]=K[i-1],[b,ub]=K[i];return lerp(ua,ub,(t-a)/(b-a));}return K[K.length-1][1];}
// the runners' tunics, before and after the turn changes: natural wool and plant dyes
const D4_TUN=[[[170,72,52],[196,150,82],[112,120,74],[84,98,140],[214,198,166]],[[120,84,60],[176,96,70],[208,182,120],[96,112,90],[150,70,64]]];
scene("runners",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t,{light:0.07});
  const tP=w("posts","small post"),tR=w("posts","chasqui"),R0=w("passed","ran"),tD=w("day","Relay"),tT=w("turn","Runners"),tRb=w("turn","Roads"),tL=w("lasted","ability"),relit=fin(t,B,1.4);
  const K=[[0,0.15],[tP-1.4,0.15],[tR-0.1,D4_PU[1]],[R0+0.2,D4_PU[1]],[R0+3.4,D4_PU[2]],[tD,D4_PU[2]],[tD+1.5,D4_PU[3]],[tD+3.0,D4_PU[4]],[tD+4.6,1.03]];
  const mu=d4_msgU(t,K),sp=Math.abs(d4_msgU(t+0.06,K)-d4_msgU(t-0.06,K))>1e-4?1:0;
  eaYear(ctx,90,90,"1400s · the Andes",CLAY,fin(t,0.3,0.6)*(1-relit));
  ctx.save();drift(ctx,t,sc,{z:0.02,y:640});const p1=at(D4_ROAD,D4_PU[1]),CK=[[0,960,560,1],[tP-1.8,p1.x+150,p1.y-130,1.6],[tD-0.2,960,600,1]];focus(ctx,t,CK);
  d4_andes(ctx,t,{a:fin(t,0,1.2)});
  d4_road(ctx,clamp((t-0.6)/3.2,0,1),{});
  if(t>tRb)d4_rebuild(ctx,0.52,0.62,clamp((t-tRb-0.1)/2.2,0,1),1);
  // the ability: the whole road lit as one line, and messages running along it, whoever carries them
  const ab=fin(t,tL,1.2);if(ab>0){ctx.save();ctx.globalAlpha*=ab;ctx.strokeStyle="rgba(255,214,150,0.5)";ctx.lineWidth=6;ctx.shadowColor="rgba(255,200,120,0.9)";ctx.shadowBlur=22;ctx.lineCap="round";ctx.beginPath();
    for(let i=0;i<=160;i++){const q=at(D4_ROAD,i/160);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}ctx.stroke();ctx.restore();
    for(let k=0;k<14;k++){const u=(t-tL-k*1.1)/5.2;if(u<0||u>1)continue;const q=at(D4_ROAD,u);glow(ctx,q.x,q.y-10,40,[255,214,150],0.6*ab);ctx.fillStyle=rgba([255,236,200],ab);ctx.beginPath();ctx.arc(q.x,q.y-10,6,0,TAU);ctx.fill();}}
  // the trail of the first message, once the camera pulls back
  const tr=fin(t,tD,0.6)*(1-ab);if(tr>0&&mu>D4_PU[1]){ctx.save();ctx.globalAlpha*=tr;ctx.strokeStyle="rgba(255,206,140,0.55)";ctx.lineWidth=5;ctx.shadowColor="rgba(255,200,120,0.8)";ctx.shadowBlur=14;ctx.lineCap="round";ctx.beginPath();
    for(let i=0;i<=60;i++){const q=at(D4_ROAD,lerp(D4_PU[1],Math.min(mu,1),i/60));i?ctx.lineTo(q.x,q.y-4):ctx.moveTo(q.x,q.y-4);}ctx.stroke();ctx.restore();}
  D4_PU.forEach((u,i)=>d4_post(ctx,u,0.9,fin(t,tP-0.6+i*0.15,0.6)));
  // the runners: one per stretch. He waits at his post, runs his stretch with the message, then rests at the next post.
  // At the turn, those at the posts are replaced by others.
  const gen=fin(t,tT+0.3,1.0),fadeR=1-0.65*ab;
  for(let k=0;k<5;k++){const u0=k===0?0.15:D4_PU[k],u1=k<4?D4_PU[k+1]:1.03,seed=k*3+1;
    let u,run=0,dir=1,dx=0,msg=0;if(mu<u0){u=u0;dx=k===0?0:22;}else if(mu<u1){u=mu;run=sp;msg=1;}else{u=Math.min(u1,0.99);dir=-1;dx=-30;}
    if(k===4&&mu>=u1)continue;const q=at(D4_ROAD,u),ph=u*D4_ROAD.total/17;
    const ra=k===0?fin(t,0.6,0.8):fin(t,tP-0.4+k*0.15,0.6);
    const draw=(g,a)=>d4_runner(ctx,q.x+dx,q.y-2,0.95+0.06*hash(k,g+2),run?ph:0,D4_TUN[g][k],{run,dir,t,seed,msg,a:a*fadeR*ra});
    if(run)draw(0,1);else{draw(0,1-gen);draw(1,gen);}}
  // the stretch's runners are named once, close up
  withA(ctx,fin(t,tR-0.2,0.5)*(1-fin(t,tD-0.6,0.5)),()=>{const q=at(D4_ROAD,D4_PU[1]);T(ctx,"a chasqui",q.x+30,q.y-150,{w:800,size:28,align:"center",color:rgba(PARCH,1)});
    ctx.strokeStyle=rgba(PARCH,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(q.x+28,q.y-138);ctx.lineTo(q.x+24,q.y-118);ctx.stroke();});
  withA(ctx,fin(t,tP,0.5)*(1-fin(t,tR-0.4,0.4)),()=>{const q=at(D4_ROAD,D4_PU[1]);T(ctx,"a post",q.x-6,q.y-118,{w:800,size:28,align:"center",color:rgba(PARCH,1)});});
  ctx.restore();
  // the khipu, close up: what a message could be knotted into
  const kp=fin(t,w("passed","knotted")-0.3,0.5)*(1-fin(t,tD-0.3,0.5));
  if(kp>0)withA(ctx,kp,()=>{glass(ctx,1250,130,600,420,22,CLAY,{glow:14,ea:0.8,fill:"rgba(26,16,10,0.93)"});d4_khipu(ctx,1340,210,420,t,clamp((t-w("passed","knotted")+0.1)/1.4,0,1),1);
    T(ctx,"khipu: knotted cords",1550,516,{w:800,size:30,align:"center",color:rgba(PARCH,1)});});
  arrive(ctx,960,170,t,w("day","two hundred"),()=>withA(ctx,1-fin(t,tT-0.4,0.4),()=>tag(ctx,960,170,"200+ km in a day",[255,206,140],{align:"center",size:34})),{dy:12});
  arrive(ctx,620,170,t,tT+0.2,()=>withA(ctx,1-fin(t,tL-0.4,0.4),()=>tag(ctx,620,170,"runners changed",PARCH,{align:"center",size:30})),{dy:12});
  arrive(ctx,1300,170,t,tRb,()=>withA(ctx,1-fin(t,tL-0.4,0.4),()=>tag(ctx,1300,170,"roads rebuilt",PARCH,{align:"center",size:30})),{dy:12});
  arrive(ctx,960,170,t,tL,()=>withA(ctx,1-relit,()=>tag(ctx,960,170,t>w("lasted","whoever")-0.1?"what stayed: moving a message, whoever carried it":"what stayed: moving a message",[255,214,150],{align:"center",size:32})),{dy:12});
  fadeIn(ctx,S,t);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"What it must be able to do","the things that stay, whoever does them",EAC,"Film 4 of 11 · enterprise architecture, for data");});

/* ---------- 2. A familiar map ---------- */
scene("orgchart",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tS=w("start","org chart"),tE=w("each","Each box"),tG=w("again","org chart"),OX=240,OY=170,OW=1620,OH=330,A=d4_orgAt(OX,OY,OW,OH);
  person(ctx,"tomas",130,1030,0.72,{t,pose:(t>c("note")&&t<c("note")+2.2)||(t>tE&&t<tE+2.2)?"explain":"stand"});
  arrive(ctx,1660,95,t,0.3,()=>sticky(ctx,1640,95,470,104,"What must it be able to do?",{col:NOTEC[0],size:30,st:0,rot:-0.02}),{dy:-30});
  const names=["Network Operations","Customer Service","Finance","Technology","Regulatory Affairs"];
  arrive(ctx,1050,335,t,tS-0.2,()=>d4_org(ctx,OX,OY,OW,OH,{p:clamp((t-tS+0.2)/1.6,0,1),lit:names.map(n=>pulseAt(t,w("boxes",n)-0.1,1.3))}),{dy:20,from:0.97});
  // each box of the org chart drops to the wall as a note: the first capability map
  A.kids.forEach(([kx,ky],i)=>arrive(ctx,kx,690,t,tE+0.4+i*0.25,()=>sticky(ctx,kx,690,A.bw,130,D4_ORG[i],{col:CAPP,size:30,st:0.5,rot:(i-2)*0.012}),{dy:ky-690,from:0.92,d:0.9}));
  arrive(ctx,1050,570,t,w("each","capability"),()=>{tag(ctx,1050,570,"capability map · draft one",STR,{align:"center",size:30});
    withA(ctx,fin(t,w("again","complete"),0.4),()=>tick_(ctx,1310,568,30,[120,210,130],1));},{dy:10});
  // and the org chart, laid over it, fits exactly
  const ov=ease(fin(t,tG-0.5,1.2));if(ov>0)withA(ctx,fin(t,tG-0.5,0.3),()=>A.kids.forEach(([kx,ky])=>d4_obox(ctx,kx,lerp(ky,690,ov),A.bw+16,lerp(92,146,ov),"",{dash:[12,8],edge:rgba(TECH,0.95),lw:3.2})));
  ctx.restore();
  arrive(ctx,1050,880,t,tG+0.5,()=>tag(ctx,1050,880,"the org chart again",[255,140,120],{align:"center",size:34}),{dy:12});
  vign(ctx,S);});

/* ---------- 3. A team is who ---------- */
// the network's part of the org chart, then, now and next: [label, boxes [name, x, w], an outer box [name, x0, x1] or none]
const D4_RE={now:["today",[["Network Operations",960,420]],null],then:["two years ago",[["Network Control",760,360],["Field Services",1160,360]],null],
  next:["next year?",[["Network Operations",820,330],["Major Projects",1140,300]],["Infrastructure",600,1320]]};
scene("who",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tG=w("grace","Grace"),tW=w("team","Two years"),tN=w("team","Next year"),tC=w("changes","changes"),tM=w("changes","What the network"),tH=c("whoever");
  person(ctx,"tomas",140,1030,0.74,{t,pose:"stand"});
  arrive(ctx,1770,800,t,tG-0.3,()=>{person(ctx,"grace",1770,1030,0.78,{t,pose:(t>c("team")&&t<c("team")+2.4)||(t>tH&&t<tH+2.2)?"explain":"stand"});tag(ctx,1700,540,"Grace · network operations",TRUST,{align:"center",size:28});},{dy:20,from:0.96});
  // the org chart's states, one after another; while "the org chart changes", it keeps changing, then settles
  const KS=[[0,"now"],[tW,"then"],[tN,"next"],[tC,"then"],[tC+1.3,"now"],[tC+2.6,"next"],[tH-0.2,"now"]];let ki=0;KS.forEach((k,i)=>{if(t>=k[0])ki=i;});
  const drawRe=(key,a,t0)=>{const[lab,boxes,outer]=D4_RE[key];arrive(ctx,960,290,t,t0,()=>withA(ctx,a,()=>{
      if(outer){d4_obox(ctx,(outer[1]+outer[2])/2,290,outer[2]-outer[1],230,"",{dash:[12,8],edge:"rgba(238,224,196,0.8)",lw:2.6});T(ctx,outer[0],outer[1]+20,212,{w:800,size:28,color:rgba(PARCH,0.95)});}
      boxes.forEach(([n,x,bw])=>d4_obox(ctx,x,outer?306:290,bw,110,n,{size:32}));
      tag(ctx,960,128,lab,PARCH,{align:"center",size:30});}),{dy:14,from:0.96,d:0.6});};
  if(t>tG-0.4){const f=ki>0?fin(t,KS[ki][0],0.25):1;if(ki>0&&f<1)drawRe(KS[ki-1][1],1-f,-9);drawRe(KS[ki][1],1,ki>0?KS[ki][0]+0.2:tG-0.4);}
  // what the network must be able to do, steady underneath
  arrive(ctx,1000,560,t,tM,()=>T(ctx,"what the network must be able to do",1000,568,{w:800,size:32,align:"center",color:rgba(STR,1)}),{dy:10});
  [["operate the network",560],["maintain assets",1000],["connect customers",1440]].forEach(([n,x],i)=>arrive(ctx,x,670,t,w("changes","able to do")+i*0.18,()=>archEl(ctx,x-200,615,400,110,n,STR,"capability",{size:32,gs:17,hi:0.3+0.2*Math.sin(t*1.3+i)}),{dy:16}));
  ctx.restore();
  arrive(ctx,960,440,t,w("whoever","who does"),()=>tag(ctx,960,440,"team: who does the work",PARCH,{align:"center",size:30}),{dy:10});
  arrive(ctx,1000,820,t,w("whoever","A capability"),()=>tag(ctx,1000,820,"capability: what must be done, whoever does it",STR,{align:"center",size:30}),{dy:10});
  vign(ctx,S);});

/* ---------- 4. Not how, not with what ---------- */
// the three traps: a team (who), a system (with what), a process (how), each with ArchiMate's glyph for what it really is
const D4_TRAP=[["Network Operations","role","who",400],["run the outage system","component","with what",960],["dispatch through the control room","process","how",1520]];
scene("how",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tU=w("under","Under"),tM=w("under","manage outages"),tT=c("test"),hold=fin(t,tU,0.6);
  const T0=[0.3,w("system","Run")-0.2,w("process","Dispatch")-0.2],P0=[0,w("system","with what"),w("process","how")];
  // the capability under the two, which every change leaves standing
  const shake=["restructure","new system","new process"].reduce((s,k)=>s+pulseAt(t,w("test",k),0.5),0);
  D4_TRAP.forEach(([n,g,st,x],i)=>{const dim=i===0?0.55:1-0.45*hold;
    if(i>0){const q=fin(t,tU+0.1,0.7);if(q>0)arrowTo(ctx,x,410,lerp(x,960,0.65),560,STR,0.8,{p:q,lw:3,head:14,dash:[8,7]});}
    arrive(ctx,x,300,t,T0[i],()=>withA(ctx,dim,()=>{sticky(ctx,x,300,460,180,"",{col:NOTEC[0],rot:(i-1)*0.02});archGlyph(ctx,g,x-190,246,20,INKD);
      wrapT(ctx,n,x,300,400,{size:32,w:800,align:"center",color:rgba(INKD,0.94),lh:38});
      kt_rstamp(ctx,x+130,392,st,[200,60,60],1,i===0?1:fin(t,P0[i]-0.15,0.3),{size:34,rot:-0.1});}),{dy:-24,from:1.06});});
  arrive(ctx,960,640,t,tM-0.2,()=>{ctx.save();ctx.translate(Math.sin(t*40)*5*shake,0);archEl(ctx,680,570,560,140,"manage outages",STR,"capability",{size:40,gs:20,hi:0.5+0.5*pulseAt(t,tM,1.4)});ctx.restore();},{dy:20});
  // the test: it survives each change
  [["a restructure","restructure",500],["a new system","new system",960],["a new process","new process",1420]].forEach(([s_,k,x])=>arrive(ctx,x,830,t,w("test",k)-0.1,()=>{tag(ctx,x-20,830,s_,PARCH,{align:"center",size:30});
    tick_(ctx,x+tw(ctx,s_,30,700)/2+16,828,30,[120,210,130],fin(t,w("test",k)+0.3,0.3));},{dy:12}));
  ctx.restore();
  arrive(ctx,960,90,t,tM+0.4,()=>tag(ctx,960,90,"a capability: what, not who, how or with what",STR,{align:"center",size:30}),{dy:10});
  vign(ctx,S);});

/* ---------- 5. Three levels ---------- */
const D4_L2=["monitor the network","control the network","manage outages"],D4_L3=["find faults","dispatch crews","restore supply","inform customers"];
const D4_LY=i=>200+i*82;
scene("levels",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const t1=w("one","Level one"),t2=w("two","Level two"),t3=w("three","Level three"),tS=c("stop");
  arrive(ctx,1760,800,t,0.3,()=>person(ctx,"grace",1760,1030,0.76,{t,pose:(t>c("lay")&&t<c("lay")+2)||(t>t2&&t<t2+2)||(t>tS&&t<tS+2)?"explain":"stand"}),{dy:20,from:0.96});
  const L1y=D4_LY,L2y=i=>282+(i-1)*82,L3y=i=>364+(i-1.5)*82;
  [["level 1",250,t1],["level 2",750,t2],["level 3",1250,t3]].forEach(([s_,x,t0])=>arrive(ctx,x,140,t,t0-0.2,()=>T(ctx,s_,x,150,{f:"mono",w:600,size:32,align:"center",color:rgba(STR,1)}),{dy:10}));
  D4_L1.forEach(([n],i)=>arrive(ctx,250,L1y(i),t,t1+0.1+i*0.12,()=>d4_cap(ctx,250,L1y(i),380,70,n,{kind:false,size:28,st:0.5,hi:i===1?fin(t,t2,0.4)*(1-fin(t,t3,0.4))*0.9:0}),{dy:-14}));
  arrive(ctx,60,850,t,w("one","support"),()=>tag(ctx,60,850,"support, beneath: people · money · technology",SOFT,{size:28}),{dy:10});
  const br=(x0,y0,x1,ys,p)=>{if(p<=0)return;withA(ctx,p,()=>{ctx.save();ctx.strokeStyle=rgba(STR,0.7);ctx.lineWidth=2.6;const xm=(x0+x1)/2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xm,y0);ys.forEach(y=>{ctx.moveTo(xm,y0);ctx.lineTo(xm,y);ctx.lineTo(x1,y);});ctx.stroke();ctx.restore();});};
  br(440,L1y(1),560,D4_L2.map((_,i)=>L2y(i)),fin(t,t2+0.2,0.6));
  D4_L2.forEach((n,i)=>arrive(ctx,750,L2y(i),t,w("two",["monitoring","controlling","managing"][i])-0.1,()=>d4_cap(ctx,750,L2y(i),380,70,n,{kind:false,size:28,st:0.5,hi:i===2?fin(t,t3,0.4)*0.9:0}),{dy:-14}));
  br(940,L2y(2),1060,D4_L3.map((_,i)=>L3y(i)),fin(t,w("three","finding")-0.4,0.6));
  D4_L3.forEach((n,i)=>arrive(ctx,1250,L3y(i),t,w("three",["finding","dispatching","restoring","keeping"][i])-0.1,()=>d4_cap(ctx,1250,L3y(i),380,70,n,{kind:false,size:28,st:0.5}),{dy:-14}));
  // level 4: not drawn, on purpose
  arrive(ctx,1560,140,t,w("stop","Deeper")-0.2,()=>{T(ctx,"level 4",1560,150,{f:"mono",w:600,size:32,align:"center",color:rgba(SOFT,0.8)});const sk=fin(t,w("stop","nobody"),0.4);if(sk>0){ctx.save();ctx.strokeStyle="rgba(232,92,80,0.95)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(1484,140);ctx.lineTo(lerp(1484,1636,sk),140);ctx.stroke();ctx.restore();}},{dy:10});
  ctx.restore();
  arrive(ctx,1250,640,t,w("stop","enough"),()=>tag(ctx,1250,640,t>w("stop","Deeper")?"three levels: deeper, and nobody reads it":"three levels are enough",STR,{align:"center",size:30}),{dy:10});
  vign(ctx,S);});

/* ---------- 6. An owner for each ---------- */
scene("owners",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tO=[w("grace","Grace"),w("grace","Grace")+0.18,w("grace","Grace")+0.36,w("grace","Grace")+0.54,w("none","Generating"),w("retail","head of retail"),w("retail","head of retail")+0.2,w("grace","Ama")];
  D4_L1.forEach(([n,ow],i)=>{const[x,y]=d4_at(i),oa=fin(t,tO[i],0.5);
    arrive(ctx,x,y,t,0.2+i*0.1,()=>{d4_cap(ctx,x,y,400,180,n,{st:ow?0.5*oa:0,owner:ow||"no owner yet",ownerA:oa,ownerCol:ow?TRUST:[232,110,96],noOwner:ow?0:oa,hi:pulseAt(t,tO[i],1.4)});
      if(!ow)kt_rstamp(ctx,x,y-108,"a guess",[200,60,60],1,fin(t,w("none","guess")-0.15,0.3),{size:34,rot:-0.12});},{dy:-18});});
  ctx.restore();
  arrive(ctx,960,110,t,w("each","owner"),()=>tag(ctx,960,110,t>w("person","person")?"owner: a person, not a team":"an owner for each",TRUST,{align:"center",size:32}),{dy:10});
  arrive(ctx,960,880,t,w("person","yes"),()=>tag(ctx,960,880,"someone who can say: yes, that's right",TRUST,{align:"center",size:30}),{dy:12});
  vign(ctx,S);});

/* ---------- 7. Where it hurts ---------- */
scene("heat",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tH=[w("colour","colour"),w("operate","green"),w("assets","amber"),w("connect","red")],own=1-fin(t,0.6,0.6),tM=c("money");
  D4_L1.forEach(([n,ow],i)=>{const[x,y]=d4_at(i),[hk,src,line]=D4_HEAT[i],t0=i>=1&&i<=3?tH[i]:tH[0]+0.3+i*0.08,ha=fin(t,t0,0.5);
    d4_cap(ctx,x,y,400,180,n,{st:ow?0.5:0,heat:hk,heatA:ha,line:line&&ha>0.5?line:null,src,srcA:fin(t,t0+0.4,0.4),owner:ow||"no owner yet",ownerA:own,ownerCol:ow?TRUST:[232,110,96],
      hi:i===3?fin(t,tM,0.5)*0.9:0,hiCol:HEAT.r});
    if(hk==="n")withA(ctx,ha,()=>T(ctx,"?",x+150,y+20,{w:800,size:56,align:"center",color:rgba(HEAT.n,1)}));});
  // the goal the board is weighing, from Why it moves: the outcome connecting customers misses
  const gp=fin(t,w("connect","The goal")-0.2,0.5);if(gp>0){arrive(ctx,1620,112,t,w("connect","The goal")-0.2,()=>archEl(ctx,1420,66,400,92,"solar connected in 10 days",MOT,"outcome",{size:28,gs:15}),{dy:-12});
    arrowTo(ctx,1620,162,1620,226,MOT,0.85*gp,{p:gp,lw:3,head:12,dash:[7,6]});}
  ctx.restore();
  arrive(ctx,760,110,t,w("now","hurts"),()=>tag(ctx,760,110,"where it hurts",[255,140,120],{align:"center",size:32}),{dy:10});
  // a key, then what it's for
  const lg=fin(t,tH[0],0.5)*(1-fin(t,tM-0.3,0.4));if(lg>0)withA(ctx,lg,()=>[["works",HEAT.g,640],["strained",HEAT.a,960],["hurts",HEAT.r,1280]].forEach(([s_,col,x])=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x-70,866,12,0,TAU);ctx.fill();T(ctx,s_,x-48,876,{w:700,size:30,color:rgba(col,1)});}));
  arrive(ctx,960,870,t,w("money","money")-0.2,()=>tag(ctx,960,870,"where it hurts is where the money should go",TRUST,{align:"center",size:30}),{dy:12});
  vign(ctx,S);});

/* ---------- 8. Deep only where it hurts ---------- */
const D4_CONN=[["assess network capacity","26 days","r"],["approve connections","5 days","g"],["install meters","3 days","g"]];
scene("deep",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tO=w("every","open every"),tG=w("every","Grace opens"),mv=ease(fin(t,tG,1.2)),tQ=w("quick","quick"),tW=w("quick","The wait"),tB=w("oneway","built"),tN=w("oneway","Nobody"),tM=w("money","money"),lone=fin(t,B,1.0);
  // the grid, where Tomás would open every box; Grace opens only the red one
  D4_L1.forEach(([n,ow],i)=>{if(i===3)return;const[x,y]=d4_at(i),[hk]=D4_HEAT[i],a=1-fin(t,tG,0.8);if(a<=0.01)return;
    d4_cap(ctx,x,y-40*mv,400,180,n,{a,st:ow?0.5:0,heat:hk,heatA:1});withA(ctx,a*fin(t,tO+i*0.06,0.3),()=>{ctx.fillStyle="rgba(20,16,12,0.9)";ctx.beginPath();ctx.arc(x+170,y-60,20,0,TAU);ctx.fill();T(ctx,"+",x+170,y-49,{w:800,size:32,align:"center",color:rgba(STR,1)});});});
  const[rx0,ry0]=d4_at(3),rx=lerp(rx0,330,mv),ry=lerp(ry0,540,mv),rw=lerp(400,460,mv),rh=lerp(180,220,mv);
  withA(ctx,1-0.5*lone,()=>d4_cap(ctx,rx,ry,rw,rh,"connect customers",{st:0.5,heat:"r",heatA:1,line:"34 working days"}));
  withA(ctx,fin(t,tO+0.18,0.3)*(1-fin(t,tG,0.4)),()=>{ctx.fillStyle="rgba(20,16,12,0.9)";ctx.beginPath();ctx.arc(rx0+170,ry0-60,20,0,TAU);ctx.fill();T(ctx,"+",rx0+170,ry0-49,{w:800,size:32,align:"center",color:rgba(STR,1)});});
  // its three abilities, with how long each takes
  const br=fin(t,w("three","three")-0.1,0.6);if(br>0)withA(ctx,br*(1-0.5*lone),()=>{ctx.save();ctx.strokeStyle=rgba(STR,0.7);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(560,540);ctx.lineTo(620,540);[330,540,750].forEach(y=>{ctx.moveTo(620,540);ctx.lineTo(620,y);ctx.lineTo(680,y);});ctx.stroke();ctx.restore();});
  D4_CONN.forEach(([n,d,hk],i)=>{const y=[330,540,750][i],t0=w("three",["assessing","approving","installing"][i])-0.1,ha=fin(t,i===0?tW:tQ,0.5),dim=i===0?1:1-0.7*lone;
    arrive(ctx,930,y,t,t0,()=>withA(ctx,dim,()=>d4_cap(ctx,930,y,500,150,n,{kind:false,size:30,st:0.5,heat:hk,heatA:ha,line:ha>0.5?d:null,hi:i===0?fin(t,tM,0.5):0,hiCol:TRUST})),{dy:-16});});
  // why the wait: a street the network was built to feed, whose rooftops now feed it back
  arrive(ctx,1555,500,t,tB-0.2,()=>withA(ctx,1-0.7*lone,()=>d4_street(ctx,1250,260,620,460,t,fin(t,w("oneway","flows"),1.2),fin(t,tN,0.5))),{dy:20,from:0.96});
  ctx.restore();
  arrive(ctx,1555,800,t,tN,()=>withA(ctx,1-0.7*lone,()=>tag(ctx,1555,800,"how much solar can each street take?",[255,140,120],{align:"center",size:28})),{dy:12});
  arrive(ctx,930,900,t,tM,()=>tag(ctx,930,900,"the money goes to one capability",TRUST,{align:"center",size:30}),{dy:12});
  vign(ctx,S);});

/* ---------- 9. The spine ---------- */
const D4_G=[["replace assets before they fail",70],["connect renewable power",500],["keep bills affordable",930]];
const D4_C=[["maintain assets",70],["connect customers",410],["operate the network",750],["serve customers",1090]];
// the work underneath, which changes: [kind, before, after, x]
const D4_WORK=[["who","Network Operations","Infrastructure",220],["how","dispatch through the control room","dispatch by app",700],["with what","the outage system","a new outage system",1180]];
scene("spine",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tF=w("fill","capabilities"),tA=w("above","goals"),tB=w("above","Below"),tC=w("stay","change"),tSp=w("stay","spine"),tD=c("data"),tQ=w("street","how much"),wk=1-fin(t,tD-0.2,0.6);
  const R=layerStack(ctx,1500,150,340,{sh:58,gap:14,p:clamp((t-0.3)/1.6,0,1),fill:[1,fin(t,tF+0.3,1.2)],hi:[fin(t,tA,0.6)*(1-fin(t,tB,0.6))*0.7,0.5*fin(t,tSp,0.6),fin(t,tB,0.6)*wk*0.6,0.7*fin(t,tQ,0.8),0.4*fin(t,tB,0.6)*wk,0.3*fin(t,tB,0.6)*wk]});
  // above: the goals from Why it moves
  D4_G.forEach(([n,x],i)=>arrive(ctx,x+200,145,t,tA-0.1+i*0.15,()=>archEl(ctx,x,100,400,90,n,MOT,"goal",{size:28,gs:15}),{dy:-12}));
  // the spine: what it must be able to do
  const glowS=fin(t,tSp,0.6);
  D4_C.forEach(([n,x],i)=>{const t0=tF+0.1+i*0.15;arrive(ctx,x+155,385,t,t0,()=>archEl(ctx,x,330,310,110,n,STR,"capability",{size:30,gs:16,hi:0.4*glowS+(i===1?0.5*fin(t,tQ,0.6):0)}),{dy:16});
    const g=[0,1,2,2][i],q=fin(t,tA+0.4+i*0.1,0.6);if(q>0)arrowTo(ctx,x+155,330,D4_G[g][1]+200,192,MOT,0.6,{p:q,lw:2.4,head:11,dash:[7,6]});});
  if(glowS>0)withA(ctx,glowS,()=>{ctx.save();ctx.strokeStyle=rgba(STR,0.5);ctx.lineWidth=3;ctx.shadowColor=rgba(STR,0.9);ctx.shadowBlur=24;rr(ctx,50,312,1370,146,24);ctx.stroke();ctx.restore();});
  arrive(ctx,735,494,t,tSp-0.1,()=>tag(ctx,735,494,"the spine: what it must be able to do",STR,{align:"center",size:30}),{dy:10});
  // below: who, how and with what, which keep changing
  if(wk>0.01)withA(ctx,wk,()=>D4_WORK.forEach(([k,a0,a1,x],i)=>{const t0=tB+0.3+i*0.2;if(t<t0)return;const sw=t>tC?Math.floor((t-tC)/1.5+i*0.33)%2:0,f=t>tC?fin((t-tC)%1.5,0,0.35):1;
    arrive(ctx,x,690,t,t0,()=>{const nm=sw?a1:a0;sticky(ctx,x,690,420,130,nm,{col:NOTEC[0],size:28,rot:(i-1)*0.02,a:t>tC?0.4+0.6*f:1});T(ctx,k,x,600,{f:"mono",w:600,size:28,align:"center",color:rgba(SOFT,1)});},{dy:16});
    const q=fin(t,t0+0.3,0.5);if(q>0)arrowTo(ctx,x,612,D4_C[2][1]+95+i*60,448,STR,0.5,{p:q,lw:2,head:10,dash:[6,6]});}));
  // where data will hang: a measure and a data rule, and a number nobody has yet
  arrive(ctx,565,640,t,w("data","measure"),()=>ruleCard(ctx,330,580,470,"days to connect new solar",{kicker:"measure",col:[255,186,150],size:30}),{dy:16});
  arrive(ctx,1080,640,t,w("data","data rule"),()=>ruleCard(ctx,830,580,520,"every outage has a start, an end and a cause",{kicker:"data rule",col:[255,186,150],size:30}),{dy:16});
  arrive(ctx,1060,820,t,tQ-0.1,()=>{tag(ctx,1060,830,"how much solar can each street take?",[255,186,150],{align:"center",size:30});ctx.strokeStyle="rgba(255,186,150,0.5)";ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(565,448);ctx.lineTo(300,600);ctx.lineTo(300,808);ctx.lineTo(760,830);ctx.stroke();ctx.setLineDash([]);},{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. Confirmed, for now ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const tC=w("confirms","confirms")+0.2,tAm=w("confirms","Ama"),tR=w("confirms","head of retail"),tD=w("draft","draft"),cA=c("answer");
  const conf=[tC,tC+0.15,tC+0.3,tC+0.45,null,tR,tR+0.15,tAm];
  D4_L1.forEach(([n],i)=>{const x=160+(i%4)*280,y=[180,330][Math.floor(i/4)],g=conf[i]==null?0:fin(t,conf[i],0.8);
    arrive(ctx,x,y,t,0.2+i*0.08,()=>d4_cap(ctx,x,y,260,120,n,{kind:false,size:28,glass:g,st:conf[i]==null?0:0.5+0.5*g,heat:i===3?"r":null,heatA:i===3?1:0,noOwner:conf[i]==null?fin(t,tD,0.5):0}),{dy:-16});});
  arrive(ctx,580,470,t,tC+0.4,()=>{kt_gtick(ctx,330,470,24,1);T(ctx,"confirmed by their owners",370,481,{w:700,size:30,color:rgba(TRUST,1)});},{dy:10});
  arrive(ctx,580,550,t,tD-0.1,()=>tag(ctx,160,550,"generate power: a draft, until its owner is found",[232,110,96],{size:28}),{dy:10});
  person(ctx,"grace",1260,1030,0.76,{t,pose:t>tC-0.2&&t<tC+2.0?"explain":"stand"});
  person(ctx,"tomas",1800,1030,0.78,{t,pose:t>cA&&t<cA+2.2?"explain":"stand"});
  arrive(ctx,1560,150,t,0.4,()=>sticky(ctx,1560,150,470,120,"What must it be able to do?",{col:NOTEC[0],size:30,st:fin(t,cA+1.4,0.5)*0.5,rot:-0.03}),{dy:-20});
  arrive(ctx,1600,400,t,cA,()=>sticky(ctx,1600,400,440,250,"Eight capabilities, seven owners, and one that hurts: connecting solar.",{col:NOTEC[0],size:30,p:clamp((t-cA-0.2)/2.2,0,1),rot:0.015}),{dy:-30,from:1.06});
  arrive(ctx,1500,690,t,w("next","power cut"),()=>sticky(ctx,1500,690,400,140,"How does value reach people?",{col:NOTEC[0],size:30,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"What it must be able to do",EAC,"Know what it must be able to do, whoever does it.","Film 4 of 11");});
