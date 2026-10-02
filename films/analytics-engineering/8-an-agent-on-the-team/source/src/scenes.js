/* ===== An agent on the team: scenes =====
   Eight chapters, as in ../script.md. England, 1766: the almanac computed twice and compared before printing, and the
   comparer's desk drifting into the present as Jun's, with the agent beside it (the title). Then what's written down for
   the agent, its least access, its evidence, the shortcut a review stopped, the reconciliation and the diff, review and
   ship, and the metadata review that hands to the next film.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts, things arrive with a spring, dust gives depth,
   and what two chapters share carries across the cut: the orb throughout, the evidence cards (4 → 5), the draft pull
   request (5 → 7 → 8), the reconciliation and the diff (6 → 7's evidence).
   Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. Computed twice ---------- */
scene("almanac",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const cP=c("posted"),cT=c("twice"),cB=c("bridge"),pres=fin(t,cB+0.2,2.2);
  histBg(ctx,S,t);if(pres>0){setScreen(ctx,S);withA(ctx,pres,()=>{bg2(ctx);motes(ctx,t);});}
  ctx.save();drift(ctx,t,sc,{z:0.04,y:460});
  yearTag(ctx,110,96,"1766 · England",CLAY,fin(t,0.3,0.6)*(1-pres));
  // the almanac's page draws itself, column by column; then it steps aside for the map
  const side=ease(fin(t,cP-0.4,1.2)),pgA=1-fin(t,cT-1.0,0.6);
  if(pgA>0)arrive(ctx,960,520,t,0.4,()=>ag_page(ctx,lerp(640,150,side),lerp(160,250,side),lerp(620,420,side),lerp(700,474,side),t,{a:pgA,p:clamp((t-1.0)/7.0,0,1),seed:2,slant:0}),{d:1.0,from:0.94});
  ag_tag(ctx,1580,380,"the Nautical Almanac",PARCH,fin(t,w("first","Nautical Almanac")-0.2,0.5)*(1-side),{size:22});
  ag_tag(ctx,1580,450,"longitude at sea",PARCH,fin(t,w("first","longitude"),0.5)*(1-side),{size:22});
  // the map of England; instructions posted from Greenwich, far west and far north, to computers working at home
  const mA=fin(t,cP-0.2,0.6)*(1-fin(t,cT-1.0,0.6)),mx=1180,my=240,ms=95;
  if(mA>0){ag_map(ctx,mx,my,ms,t,{a:mA,p:clamp((t-cP+0.1)/1.4,0,1),scot:mA});
    const[gx,gy]=ag_ll(0,51.48,mx,my,ms),D=[ag_ll(-5.05,50.26,mx,my,ms),ag_ll(-3.0,54.62,mx,my,ms)],t0=w("posted","instructions")-0.2,u=ease(fin(t,t0+0.5,1.6));
    withA(ctx,mA,()=>{glow(ctx,gx,gy,26,TRUST,0.5);ctx.fillStyle="rgba(70,40,24,1)";ctx.beginPath();ctx.arc(gx,gy,6,0,TAU);ctx.fill();T(ctx,"Greenwich",gx+12,gy+26,{w:700,size:18,color:"rgba(60,40,24,0.95)"});
      D.forEach(([dx,dy],i)=>{const tt=fin(t,t0,0.4);if(tt<=0)return;const bx=(gx+dx)/2+(i?-90:-40),by=(gy+dy)/2+(i?20:-90),px=(1-u)*(1-u)*gx+2*(1-u)*u*bx+u*u*dx,py=(1-u)*(1-u)*gy+2*(1-u)*u*by+u*u*dy;
        ctx.save();ctx.setLineDash([5,7]);ctx.strokeStyle="rgba(90,50,30,0.6)";ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<=24*u;k++){const v=k/24;ctx.lineTo((1-v)*(1-v)*gx+2*(1-v)*v*bx+v*v*dx,(1-v)*(1-v)*gy+2*(1-v)*v*by+v*v*dy);}ctx.stroke();ctx.restore();
        ag_cottage(ctx,dx,dy+6,1.3,fin(t,w("posted","at home")-0.2+i*0.25,0.5),t);ag_letter(ctx,px,py,0.7,(i?-0.3:0.4)*u,tt*(1-fin(t,t0+2.1,0.4)));});});}
  ag_tag(ctx,870,560,"instructions, by post",PARCH,fin(t,w("posted","instructions"),0.5)*mA,{size:22});
  ag_tag(ctx,870,630,"computers, at home",PARCH,fin(t,w("posted","computers"),0.5)*mA,{size:22});
  // twice: two sheets at the edges of the frame, two quills writing the same column, each in its own hand
  const cC=w("twice","A comparer")-0.3,mv=ease(fin(t,cC,1.4)),sA=fin(t,cT-0.3,0.6),q=clamp((t-cT-0.3)/4.6,0,1),cP2=w("twice","printed");
  const SH=[[lerp(70,520,mv),lerp(230,210,mv),-0.12,7],[lerp(1450,1000,mv),lerp(230,210,mv),0.08,11]],sw=lerp(400,380,mv),shh=lerp(520,500,mv);
  const bridge=ease(fin(t,cB-0.2,1.8));
  // the comparer's desk, under both sheets; on the bridge line it drifts right, towards the present
  const dA=fin(t,cC-0.2,0.8),dx_=lerp(420,1120,bridge);
  if(dA>0){withA(ctx,1-pres,()=>ag_desk(ctx,dx_,lerp(650,700,bridge),lerp(1080,640,bridge),220,dA));}
  const pencilT=w("twice","checked"),pr=clamp((t-pencilT)/1.8,0,1),circ=fin(t,pencilT+1.8,0.7),fix=fin(t,pencilT+2.6,0.8);
  const back=ease(fin(t,cB-0.2,1.6));let posL=null;
  SH.forEach(([x,y,sl,sd],i)=>{if(sA<=0)return;const bx=lerp(x,i?380:110,back),by=lerp(y,320,back),bw=lerp(sw,250,back),bh=lerp(shh,330,back);
    const pos=ag_page(ctx,bx,by,bw,bh,t,{a:sA,p:mv>0?1:q,cols:2,seed:sd,slant:sl,title:"JANUARY 1767",wrong:i===0?[4,1]:null,bad:"109.06.74",fix:i===0?fix:0,curl:0.4});if(i===0)posL=pos;
    if(mv<=0&&q<1){const n=q*2*7,cc=Math.min(1,Math.floor(n/7)),r=Math.min(6,Math.floor(n%7)),[nx,ny]=pos(r,cc),fr=n%1;ag_quill(ctx,nx-30+fr*60,ny+2,0.62,t,{rot:0.42,seed:i*2,speed:9});}
    if(i===0&&circ>0){const[cx,cy]=pos(4,1);ag_circle(ctx,cx,cy-6,62*bw/620*1.1,20*bw/620*1.3,circ*(1-back),"rgba(64,64,72,0.9)");}});
  // the comparer's pencil runs down both columns and stops at the figure that differs
  if(posL&&mv>0.9&&pr>0&&back<0.3){const k=Math.min(pr*6,4),r0=Math.floor(k),[ax,ay]=posL(r0,1),[bx,by]=posL(Math.min(6,r0+1),1),f=k-r0,px=lerp(ax,bx,f)+50,py=lerp(ay,by,f)-4;withA(ctx,1-back*3,()=>ag_pencil(ctx,px,py,0.9,1,-2.5));}
  ag_tag(ctx,960,150,"computed twice",PARCH,fin(t,w("twice","twice"),0.5)*(1-fin(t,cC-0.6,0.4)),{size:24});
  if(sA>0&&mv<1){const fa=fin(t,w("twice","far apart"),0.6)*(1-mv);withA(ctx,fa,()=>{ctx.save();ctx.setLineDash([10,10]);ctx.strokeStyle="rgba(238,224,196,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(560,520);ctx.lineTo(1360,520);ctx.stroke();ctx.restore();
    arrowTo(ctx,960,520,540,520,PARCH,0.8,{head:14});arrowTo(ctx,960,520,1380,520,PARCH,0.8,{head:14});tag(ctx,960,520,"far apart",PARCH,{align:"center",size:22});});}
  ag_tag(ctx,960,150,"the comparer",PARCH,fin(t,w("twice","comparer")+0.1,0.5)*(1-back),{size:24});
  // the press takes the checked page
  const prA=fin(t,cP2-0.6,0.6)*(1-fin(t,cB-0.2,1.2)*0.7),down=fin(t,cP2,0.9)-fin(t,cP2+1.4,0.8);
  if(prA>0){const px=lerp(1640,800,back),py=lerp(500,560,back);ag_press(ctx,px,py,lerp(0.78,0.6,back),down,t,prA);
    const pa=fin(t,cP2-0.3,0.6),pin=ease(fin(t,cP2-0.3,0.6));if(pa>0)ag_page(ctx,px-90*lerp(0.78,0.6,back),py+(lerp(0.78,0.6,back))*(118-pin*6),180*lerp(0.78,0.6,back),26*lerp(0.78,0.6,back)+0*pin,t,{a:pa*prA,p:0,head:0,curl:0,seed:5});}
  ag_tag(ctx,1640,250,"checked before printing",PARCH,fin(t,w("twice","before anything"),0.5)*(1-back),{size:22});
  // the bridge: the desk becomes Jun's, and the agent settles beside it
  if(pres>0){const ja=fin(t,cB+0.6,0.8);
    arrive(ctx,1440,620,t,cB+0.6,()=>{person(ctx,"jun",1440,800,0.5,{pose:"stand",expr:"calm",t});
      glass(ctx,1160,690,580,110,12,[150,190,255],{glow:10,ea:0.6,fill:"rgba(10,16,30,0.98)"});
      glass(ctx,1190,560,190,128,10,[150,190,255],{glow:12,ea:0.7,fill:"rgba(6,10,20,0.97)"});for(let i=0;i<4;i++){ctx.fillStyle=rgba([150,190,255],0.3);rr(ctx,1206,582+i*24,60+hash(i,4)*100,8,3);ctx.fill();}},{d:0.9,from:0.94,dy:20});
    withA(ctx,ja,()=>ag_role(ctx,1440,836,"jun"));
    const oa=fin(t,w("bridge","an AI agent")-0.3,0.6),oy=lerp(380,540,ease(fin(t,w("bridge","an AI agent")-0.3,1.6)));kt_agent(ctx,1700,oy,30,t,{a:oa});
    ag_tag(ctx,1700,oy-90,"an AI agent",KT_AI,fin(t,w("bridge","an AI agent"),0.5)*oa,{size:22});
    ag_tag(ctx,1440,170,"a computer on the team, all along",WEED,fin(t,w("bridge","computer"),0.5),{size:24});
    ag_tag(ctx,960,250,"build the checking in",TRUST,fin(t,w("bridge","checking"),0.5),{size:22});}
  ctx.restore();weedsTitle(ctx,S,t,B,"An agent on the team","the agent drafts and checks; people approve",WEED);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Written down ---------- */
const AG_AGENTS=["# Working here as an AI agent","","This project builds the university's credential model with dbt. An agent is welcome to help at","every step: profiling sources, drafting models and tests, reconciling, reviewing metadata. At","every step, a person approves. This page says what an agent may and may not do.","","## Read first","","- [`docs/process.md`](docs/process.md): the ten steps, what each produces, your part in it, and who approves it.","…","- [`skills/`](skills/): how to do the five jobs agents do most here: …"];
const AG_SKILLS=[["draft-the-conceptual-model","draft the conceptual model"],["profile-a-source","profile a source"],["draft-a-model","draft a model"],["reconcile-and-diff","reconcile and diff"],["review-metadata","review the metadata"]];
const AG_SK1=["---","name: draft-a-model","description: Draft a dbt model to pass the tests and contract written for it first. Use when a","  model's grain, contract and tests exist, or should, and the SQL doesn't yet.","---"];
const AG_SK2=["---","name: reconcile-and-diff","description: Validate a change before sign-off, by reconciling with the census report and","  diffing against the previous version. …","---"];
scene("skills",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cA=c("agents"),cF=c("five"),cPr=c("process"),cFi=c("files"),ph2=ease(fin(t,cF-0.3,1.0)),ph3=ease(fin(t,cPr-0.3,1.0)),ph4=ease(fin(t,cFi-0.3,1.0));
  // the project, its graph dim behind everything; the agent over it
  const gA=1-0.65*fin(t,cA-0.3,0.8);withA(ctx,fin(t,0,0.8)*gA,()=>{ctx.save();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(WEED,0.45);ctx.lineWidth=2;rr(ctx,100,120,1720,780,26);ctx.stroke();ctx.restore();
    withA(ctx,1-ph3,()=>T(ctx,"the credential project",130,160,{w:700,size:20,color:rgba(WEED,0.9)}));lineageGraph(ctx,240,240,1440,600,t,{dim:0.55,heads:0.7,core:0.35});});
  const ox=lerp(lerp(lerp(960,1640,fin(t,cA-0.3,1.0)),300,ph2),1760,ph3),oy=lerp(lerp(lerp(520,330,fin(t,cA-0.3,1.0)),700,ph2),840,ph3);
  kt_agent(ctx,ox,oy,ph4>0?lerp(30,24,ph4):30,t,{a:fin(t,0.2,0.6)*(1-ph4)});
  [["read the project","read",700,650],["run dbt","run dbt",960,720],["draft on a branch","draft",1220,650]].forEach(([s,k,x,y])=>ag_tag(ctx,x,y,s,KT_AI,fin(t,w("can",k),0.5)*(1-fin(t,cA-0.3,0.5)),{size:22}));
  // AGENTS.md opens; may and must not
  const aA=fin(t,cA-0.2,0.6)*(1-ph2);if(aA>0)arrive(ctx,730,330,t,cA-0.2,()=>ag_code(ctx,90,150,1280,"AGENTS.md",AG_AGENTS,{a:aA,p:clamp((t-cA)/2.2,0,1),edge:KT_AI,lit:{4:fin(t,w("agents","may do"),0.5)}}),{dy:30});
  ag_tag(ctx,1640,480,"may",AG_GRN,fin(t,w("agents","may do"),0.5)*(1-ph2),{size:24});ag_tag(ctx,1640,550,"must not",AG_RED,fin(t,w("agents","must not"),0.5)*(1-ph2),{size:24});
  // five skills, one file each; two open far enough to show their heads; then a row of chips at the top, then a column
  const row=[["AGENTS.md",KT_AI]].concat(AG_SKILLS.map(s=>[s[0],KT_AI])).concat([["docs/process.md",[170,205,255]]]);let rx=100;const RX=row.map(([s])=>{const x=rx;rx+=tw(ctx,s,18,500,"mono")+44+14;return x;});
  row.forEach(([s,col],i)=>{const t0=i===0?cF-0.3:i<6?w("five",AG_SKILLS[i-1][1])-0.2:cFi-0.2,a=fin(t,t0,0.5);if(a<=0)return;
    const x2=i===0?100:100,y2=i===0?190:250+(i-1)*62,x3=RX[i],y3=110,x4=1000,y4=250+i*72,xx=lerp(lerp(x2,x3,ph3),x4,ph4),yy=lerp(lerp(y2,y3,ph3),y4,ph4);
    if(i===6&&ph4<0.01)return;arrive(ctx,xx+100,yy,t,t0,()=>ag_chip(ctx,xx,yy,s,col,1,{hi:pulseAt(t,t0+0.2,1.0),size:lerp(22,18,Math.max(ph3,ph4))}),{from:0.8});
    if(ph4>0){const vA=fin(t,w("files","Versioned")+i*0.08,0.4),tA=fin(t,w("files","reviewed")+i*0.1,0.4),cw=tw(ctx,s,18,500,"mono")+44;
      withA(ctx,vA,()=>T(ctx,"v"+[14,6,4,9,5,3,11][i],xx+cw+16,yy+7,{f:"mono",w:500,size:18,color:rgba(SOFT,1)}));kt_gtick(ctx,xx+cw+76,yy,13,tA);}});
  ag_tag(ctx,300,190,"five skills · one file each",KT_AI,fin(t,w("five","five skills"),0.5)*(1-ph3),{size:20,align:"left"});
  arrive(ctx,1285,355,t,w("five","draft a model")-0.1,()=>ag_code(ctx,730,250,1110,"skills/draft-a-model/SKILL.md",AG_SK1,{a:1-ph3,edge:KT_AI,p:clamp((t-w("five","draft a model"))/1.2,0,1)}),{dy:24});
  arrive(ctx,1285,595,t,w("five","reconcile and diff")-0.1,()=>ag_code(ctx,730,490,1110,"skills/reconcile-and-diff/SKILL.md",AG_SK2,{a:1-ph3,edge:KT_AI,p:clamp((t-w("five","reconcile and diff"))/1.2,0,1)}),{dy:24});
  // the process: the agent's part lights teal, who approves gold, row by row; validate and review stay lit
  const pA=fin(t,cPr-0.1,0.6)*(1-ph4);if(pA>0){const ag=[],ap=[],dimT=c("files")-0.4;for(let i=0;i<10;i++){const keep=i===6||i===7?1:1-0.7*fin(t,dimT,0.6);ag.push(fin(t,w("process","the agent's part")+i*0.1,0.3)*keep);ap.push(fin(t,w("process","who approves")+i*0.1,0.3)*keep);}
    arrive(ctx,960,460,t,cPr-0.1,()=>ag_process(ctx,100,160,1720,{a:pA,agent:ag,appr:ap,p:clamp((t-cPr)/1.0,0,1)}),{dy:30,from:0.94});}
  // files in the project, not a long prompt: versioned, reviewed, and read the same way by people and by agents
  const lp=fin(t,cFi,0.6)*(1-fin(t,w("files","not a long prompt")+0.6,1.6));ag_prompt(ctx,140,230,560,560,t,lp);if(lp>0)withA(ctx,lp,()=>cross_(ctx,420,520,90,AG_RED,fin(t,w("files","not a long prompt"),0.5)));
  ag_tag(ctx,960,150,"files, not a prompt",WEED,fin(t,w("files","not a long prompt"),0.5),{size:24});
  ag_tag(ctx,1640,250,"versioned",SOFT,fin(t,w("files","Versioned"),0.5),{size:22});ag_tag(ctx,1640,320,"reviewed",TRUST,fin(t,w("files","reviewed"),0.5),{size:22});
  const shA=fin(t,w("files","read the same way")-0.2,0.6);if(shA>0){arrive(ctx,420,640,t,w("files","read the same way")-0.2,()=>{person(ctx,"jun",340,820,0.42,{pose:"stand",t});kt_agent(ctx,560,620,26,t,{});ag_role(ctx,340,846,"jun");},{dy:20});
    ag_tag(ctx,1640,420,"shared by people and agents",WEED,fin(t,w("files","people"),0.5),{size:22});
    withA(ctx,shA,()=>{ctx.save();ctx.setLineDash([4,8]);ctx.strokeStyle=rgba(WEED,0.5);ctx.lineWidth=1.6;[[400,560],[590,600]].forEach(([x0,y0])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(990,lerp(250,680,0.5));ctx.stroke();});ctx.restore();});}
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Least access ---------- */
const AG_GRANTS=["grant use catalog on catalog <production catalog> to `<agent service principal>`;","grant use schema, select on schema <production catalog>.<schema>_core to `<agent service principal>`;","grant use schema, select on schema <production catalog>.<schema>_marts to `<agent service principal>`;","grant all privileges on schema <development catalog>.<agent's schema> to `<agent service principal>`;"];
const AG_BULK=["- **Pull bulk personal data.** Work with aggregates and small samples (`dbt show --limit 20`).","  Never copy names, emails or student IDs out of the project, into a prompt, a log or a pull","  request, beyond the sample a claim needs."];
scene("least",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:400});
  const cR=c("reads"),cS=c("samples"),cX=c("stays");
  // the agent and its own key card; a person's badge, crossed
  kt_agent(ctx,330,300,30,t,{a:fin(t,0.1,0.6)});
  arrive(ctx,330,440,t,w("principal","service principal")-0.2,()=>ag_key(ctx,330,440,1,1,{}),{dy:30});
  arrive(ctx,330,560,t,w("principal","never as a person")-0.2,()=>ag_key(ctx,330,560,1,1-fin(t,cS-0.4,0.5),{title:"a person's badge",sub:"jun.park",col:AG_GREY,cross:fin(t,w("principal","never as a person")+0.3,0.4)}),{dy:20});
  ag_tag(ctx,330,180,"never a person",KT_AI,fin(t,w("principal","never"),0.5)*(1-fin(t,cS,0.5)),{size:22});
  // production, read-only: three doors; the agent's own wing of development schemas
  const wA=fin(t,0.4,0.8);withA(ctx,wA,()=>{glass(ctx,640,120,820,400,20,[150,176,214],{glow:10,ea:0.5,fill:"rgba(8,12,22,0.9)"});T(ctx,"production",664,158,{w:800,size:20,color:rgba(SOFT,1)});
    glass(ctx,1500,190,360,330,20,KT_AI,{glow:10,ea:0.5,fill:"rgba(6,14,18,0.9)"});T(ctx,"development schemas",1680,172,{w:800,size:20,align:"center",color:rgba(KT_AI,1)});});
  const DO=[["sources",SRC3[0][1],"sources"],["core",TRUST,"core"],["marts",LAYER4[3][1],"marts"]];
  DO.forEach(([n,col,k],i)=>{const x=700+i*260,op=fin(t,w("reads",k)-0.1,0.9);ag_door(ctx,x,230,180,250,n,col,op*0.8,t,{a:wA});
    if(op>0)withA(ctx,op,()=>{ctx.save();ctx.setLineDash([3,7]);ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(368,300);ctx.bezierCurveTo(520,250+i*10,x-60,260,x+90,355);ctx.stroke();ctx.restore();T(ctx,"read-only",x+90,505,{w:700,size:18,align:"center",color:rgba(col,0.95)});});});
  const wr=fin(t,w("reads","writes")-0.1,0.8);["staging","intermediate","core","marts"].forEach((n,i)=>{const x=1520+(i%2)*170,y=220+Math.floor(i/2)*140,col=LAYER4[i][1];withA(ctx,wA,()=>{
    ctx.fillStyle=rgba(mix([6,12,20],KT_AI,0.12*wr),1);rr(ctx,x,y,150,120,10);ctx.fill();ctx.strokeStyle=rgba(mix(col,KT_AI,wr*0.5),0.4+0.5*wr);ctx.lineWidth=2;rr(ctx,x,y,150,120,10);ctx.stroke();
    T(ctx,n,x+75,y+30,{w:700,size:18,align:"center",color:rgba(col,1)});});});
  if(wr>0)withA(ctx,wr,()=>{arrowTo(ctx,360,280,1500,262,KT_AI,0.9,{p:wr,bend:-0.4,head:14});});
  ag_tag(ctx,1050,575,"reads: sources, core, marts",SOFT,fin(t,w("reads","It reads"),0.5)*(1-fin(t,cS-0.2,0.5)),{size:22});
  ag_tag(ctx,1680,575,"writes: its own development schemas",KT_AI,fin(t,w("reads","writes"),0.5)*(1-fin(t,cX-0.2,0.5)),{size:20});
  // the grants that say so (Databricks only)
  const gA=fin(t,w("reads","writes")+0.6,0.6)*(1-fin(t,cS-0.3,0.5));if(gA>0)arrive(ctx,690,710,t,w("reads","writes")+0.6,()=>ag_code(ctx,100,630,1180,"AGENTS.md",AG_GRANTS,{a:gA,label:AG_DBX,edge:[150,176,214],p:clamp((t-w("reads","writes")-0.7)/1.4,0,1),lit:{3:fin(t,w("reads","writes")+2.2,0.5)},litCol:KT_AI}),{dy:30});
  // counts and small samples pass through a glass wall; names, emails and student IDs stay behind it
  const sA=fin(t,cS-0.1,0.6);if(sA>0){withA(ctx,sA,()=>{glass(ctx,100,590,460,270,16,[150,176,214],{glow:8,ea:0.5,fill:"rgba(8,12,22,0.95)"});T(ctx,"the database",124,624,{w:700,size:18,color:rgba(SOFT,1)});
      ctx.save();ctx.filter="blur(3.5px)";["Linh Nguyen · nguyen.family@…","Priya Nair · S-20431","Daniel Kim · d.kim@…","Aisha K. · S-20417","Jordan Lee · S-20422","Minh Nguyen · nguyen.family@…"].forEach((s,i)=>T(ctx,s,130,670+i*30,{f:"mono",w:500,size:18,color:rgba(SOFT,0.7)}));ctx.restore();
      const wl=ctx.createLinearGradient(590,0,630,0);wl.addColorStop(0,"rgba(150,220,255,0.06)");wl.addColorStop(0.5,"rgba(150,220,255,0.22)");wl.addColorStop(1,"rgba(150,220,255,0.06)");ctx.fillStyle=wl;ctx.fillRect(590,590,40,270);ctx.strokeStyle="rgba(170,225,255,0.6)";ctx.lineWidth=1.5;ctx.strokeRect(590,590,40,270);});
    ["42","4","12","2"].forEach((n,i)=>{const t0=w("samples","counts")+i*0.45,u=ease(fin(t,t0,1.2));if(u<=0)return;const x=lerp(470,690,u),y=650+i*52;withA(ctx,sA,()=>{tag(ctx,x,y,n,AG_GRN,{align:"center",size:20});});});
    ag_tag(ctx,330,552,"personal data stays in the database",SOFT,fin(t,w("samples","Names"),0.5),{size:20});
    ag_tag(ctx,700,552,"counts · small samples",AG_GRN,fin(t,w("samples","counts"),0.5),{size:20});}
  const bA=fin(t,w("samples","small samples")-0.2,0.6);if(bA>0)arrive(ctx,1320,685,t,w("samples","small samples")-0.2,()=>ag_code(ctx,790,618,1080,"AGENTS.md",AG_BULK,{a:bA,p:clamp((t-w("samples","small samples"))/1.4,0,1),edge:KT_AI,lit:{0:fin(t,w("samples","Names"),0.5),1:fin(t,w("samples","Names")+0.2,0.5)},litCol:AG_RED}),{dy:30});
  // whatever it gets wrong stays in its own room; production doesn't flicker
  ag_scribble(ctx,1765,300,60,clamp((t-w("stays","gets wrong"))/1.0,0,1));
  ag_tag(ctx,1680,575,"mistakes stay in its own room",AG_RED,fin(t,w("stays","stays"),0.5),{size:20});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Evidence ---------- */
const AG_EVID=["> 4 of 42 current learning platform accounts have no student ID.","> `dbt show --select profile_null_keys --profiles-dir .` → `learning_platform.users | student_id | 42 | 4`","","A claim without its query is a guess, and reviewers treat it as one."];
const AG_SHOW=["profile_shared_emails   student_system    | nguyen.family@mai… | 2","                        learning_platform | nguyen.family@mai… | 2","profile_late_changes    S-20431 | WD | 2026-03-27 | 2026-04-03 | 7"];
const AG_DEC=["decision_id,qualified_key,decision,other_qualified_key,decided_by,decided_on,…","D-001,SC|nguyen.family@mai…,same,SIS|S-20436,\"Mei Tanaka, registrar's office\",2026-10-06,…"];
scene("evidence",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cF=c("four"),cM=c("more"),cE=c("mei"),cG=c("guess");
  const ox=lerp(1780,1740,fin(t,cM,1)),oy=lerp(330,150,ease(fin(t,cM-0.3,1.2)));kt_agent(ctx,ox,oy,28,t,{a:fin(t,0,0.6)});
  // every claim, with its query and its result
  const gA=fin(t,0.6,0.6)*(1-fin(t,w("four","no student ID")-0.9,0.6));if(gA>0)arrive(ctx,960,470,t,0.6,()=>ag_claim(ctx,520,400,880,"something true about the data","query: the query that shows it","result: what it returned",{a:gA,clip:fin(t,w("claim","the query")-0.1,0.7)}),{dy:30});
  ag_tag(ctx,960,320,"claim · query · result",KT_AI,fin(t,w("claim","result"),0.5)*gA,{size:22});
  // seen before: three claims from the earlier films
  const E3=["4 of 42 · no student ID","one email, two learners, two systems","recorded 7 days late"],fade3=fin(t,cM-0.8,0.6);
  const up3=0;E3.forEach((s,i)=>{const t0=w("four",["no student ID","shared family email","a week late"][i])-0.3,x=100+i*580,yy=lerp(440,130,up3);arrive(ctx,x+260,yy+40,t,t0,()=>withA(ctx,1-fade3,()=>{glass(ctx,x,yy,520,80,14,KT_AI,{glow:12,ea:0.8,fill:"rgba(6,16,18,0.96)"});
    T(ctx,"claim",x+20,yy+50,{w:800,size:18,color:rgba(KT_AI,1)});T(ctx,s,x+86,yy+50,{w:700,size:21});}),{dy:24});});
  ag_tag(ctx,960,lerp(380,250,up3),"seen before",SOFT,fin(t,w("four","seen"),0.5)*(1-fade3),{size:20});
  // now a rule, in the agent's page, with an example to copy: the claim, its query and its result clip together
  const rA=fin(t,cM-0.2,0.6);if(rA>0)arrive(ctx,710,350,t,cM-0.2,()=>ag_code(ctx,100,260,1220,"AGENTS.md",AG_EVID,{a:rA,edge:KT_AI,p:clamp((t-cM)/1.2,0,1),lit:{0:fin(t,cM+0.6,0.5),1:fin(t,cM+1.2,0.5),3:fin(t,w("guess","goes back"),0.5)},litCol:KT_AI}),{dy:30});
  ag_tag(ctx,1560,330,"now a rule · AGENTS.md",KT_AI,fin(t,w("more","a rule"),0.5)*(1-fin(t,cG-0.2,0.4)),{size:22});
  const dA=fin(t,w("more","example")-0.4,0.6);if(dA>0)arrive(ctx,500,550,t,w("more","example")-0.4,()=>ag_code(ctx,100,480,820,"dbt show",AG_SHOW,{a:dA,edge:[170,205,255],p:clamp((t-w("more","example")+0.3)/1.2,0,1),lit:{0:fin(t,w("mei","shared email"),0.5),1:fin(t,w("mei","shared email")+0.1,0.5)}}),{dy:30});
  const exA=fin(t,w("more","example")-0.2,0.6)*(1-fin(t,cE-0.4,0.5));if(exA>0)arrive(ctx,1250,560,t,w("more","example")-0.2,()=>ag_claim(ctx,980,480,600,"4 of 42 · no student ID","dbt show --select profile_null_keys","learning_platform.users | student_id | 42 | 4",{a:exA,clip:fin(t,w("more","example")+0.3,0.7)}),{dy:24});
  // where rules can't decide, Mei decides, and records it
  const mA=fin(t,cE-0.1,0.7);if(mA>0){arrive(ctx,1640,700,t,cE-0.1,()=>{person(ctx,"mei",1640,850,0.5,{pose:fin(t,w("mei","records"),0.3)>0.5?"explain":"stand",t});},{dy:20,d:0.9});withA(ctx,mA,()=>ag_role(ctx,1640,878,"mei"));
    const ar=fin(t,w("mei","asks Mei"),0.8);if(ar>0)arrowTo(ctx,930,540,1520,620,TRUST,0.85,{p:ar,bend:0.12,head:14});}
  ag_tag(ctx,1640,470,"Mei decides · D-001",TRUST,fin(t,w("mei","records a decision"),0.5),{size:22});
  ag_tag(ctx,1230,480,"rules can't decide",AG_AMB,fin(t,w("mei","rules can't decide"),0.5)*(1-fin(t,cG,0.5)),{size:20});
  const kA=fin(t,w("mei","records")-0.2,0.6);if(kA>0){arrive(ctx,630,720,t,w("mei","records")-0.2,()=>ag_code(ctx,100,656,1160,"seeds/learner_identity_decisions.csv",AG_DEC,{a:kA,edge:TRUST,p:clamp((t-w("mei","records"))/1.4,0,1),lit:{1:fin(t,w("mei","records a decision")+0.4,0.5)}}),{dy:30});
    kt_gtick(ctx,1232,768,16,fin(t,w("mei","records a decision")+0.5,0.35));ag_tag(ctx,300,820,"SC: short courses",SRC3[2][1],fin(t,w("mei","records a decision")+0.8,0.5),{size:18});}
  // a claim with no query goes back to the agent, unread
  const g0=cG-0.1,gb=ease(fin(t,w("guess","goes back"),1.4));if(t>g0){const gx=lerp(1390,ox-60,gb),gy=lerp(220,oy,gb),ga=1-fin(t,w("guess","goes back")+1.0,0.5);
    arrive(ctx,gx+230,gy+32,t,g0,()=>{ctx.save();ctx.translate(gx,gy);ctx.scale(1-0.6*gb,1-0.6*gb);ag_claim(ctx,0,0,470,"emails are unique","","",{noq:true,grey:fin(t,w("guess","goes back")-0.4,0.5),a:ga});ctx.restore();},{dy:20});}
  ag_tag(ctx,1560,330,"no query: sent back",AG_GREY,fin(t,w("guess","goes back")+0.4,0.5),{size:22});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. The shortcut ---------- */
const AG_TL=["-- the student system says when each version took effect: that date, not the date it was recorded","student_versions as (","    select","        …","        student_records.effective_date as valid_from,","        coalesce(","            lead(student_records.effective_date) over (","                …","            ),","            …","        ) as valid_to,"];
const AG_TLD=["-        student_records.effective_date as valid_from,","-        coalesce(","-            lead(student_records.effective_date) over (","-            …","-        ) as valid_to,","+        cast(student_records.recorded_from as date) as valid_from,","+        cast(student_records.recorded_to as date) as valid_to,"];
const AG_SEV=["   - name: reconcile_planning_with_census_report","     …","     config:","       meta: {owner: Planning}","+      severity: warn"];
const AG_RULE=["- **Weaken a test to make it pass.** Don't delete, disable or skip a test, lower its severity,","  raise its thresholds, or narrow it with a `where`. A failing test is news: report it, with its","  failing rows, and propose a fix to the data or the code."];
const AG_DESC=["  - name: reconcile_planning_with_census_report","    description: >","      The Planning mart gives the census team's published number, faculty by faculty. If it","      doesn't, the mart is wrong or the report is; either way, nobody ships until someone knows","      which. …","    config:","      meta: {owner: Planning}"];
// the build's output: a few tests passing, then the reconciliation's row, its failing rows, and the summary
function ag_build(ctx,x,y,w,t,o){o=o||{};const st=o.state||0,warn=fin(st,0,1)*(st<1.5?1:0),pass=st>=2?1:0;
  // a passing test returns no rows, so the passing build shows only its line and the summary
  const L=pass?["PASS not_null_int_learner_timeline_learner_key","PASS versions_do_not_overlap_int_learner_timeline_learner_key","PASS versions_do_not_overlap_core_learner_v1_learner_key",
    "PASS reconcile_planning_with_census_report","PASS=143 WARN=1 ERROR=0"]:["PASS not_null_int_learner_timeline_learner_key","PASS versions_do_not_overlap_int_learner_timeline_learner_key","PASS versions_do_not_overlap_core_learner_v1_learner_key",
    warn>0.5?"WARN 1 reconcile_planning_with_census_report":"FAIL 1 reconcile_planning_with_census_report","faculty_code | in_the_mart | in_the_census_report","BUS          |           4 |                    3",
    warn>0.5?"PASS=142 WARN=2 ERROR=0":"PASS=142 WARN=1 ERROR=1"];
  const rc=pass?AG_GRN:mix(AG_RED,AG_AMB,warn),sm=pass?4:6,lc={0:AG_GRN,1:AG_GRN,2:AG_GRN,3:rc,[sm]:pass?AG_GRN:warn>0.5?AG_AMB:AG_RED};if(!pass)lc[5]=rc;
  const lit={3:o.lit||0,[sm]:o.lit6||0};if(!pass)lit[5]=o.lit||0;
  return ag_code(ctx,x,y,w,"dbt build",L,{a:o.a,p:o.p,edge:rc,lineCol:lc,lit,litCol:rc,dim:{0:0.3,1:0.3,2:0.3}});}
scene("shortcut",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cF=c("fails"),cY=c("why"),cW=c("warn"),cS=c("stop"),cN=c("news"),cX=c("fix"),rec=w("refactor","by when it was recorded");
  // the timeline's model: the lines that date the student system's versions, and their comment
  const tlA=fin(t,0.4,0.6)*(1-fin(t,cF-1.0,0.5));if(tlA>0)arrive(ctx,690,290,t,0.4,()=>ag_code(ctx,100,110,1180,"models/intermediate/int_learner_timeline.sql",AG_TL,{a:tlA,edge:LAYER4[1][1],p:clamp((t-0.5)/1.8,0,1),lit:{0:fin(t,w("refactor","dates every version"),0.5),4:fin(t,w("refactor","dates every version"),0.5),5:fin(t,w("refactor","dates every version")+0.1,0.5),6:fin(t,w("refactor","dates every version")+0.1,0.5),10:fin(t,w("refactor","dates every version")+0.2,0.5)}}),{dy:30});
  ag_tag(ctx,1560,160,"tidy the timeline",KT_AI,fin(t,w("refactor","tidies"),0.5)*(1-fin(t,cF-1.0,0.5)),{size:22});
  // the agent's draft: both dates from when the change was recorded
  const up=ease(fin(t,cF-0.4,1.0)),dfA=fin(t,rec-0.3,0.6)*(1-fin(t,cS+0.2,0.6));
  const orbX=lerp(lerp(1560,1000,fin(t,rec-0.5,1.0)),1000,up),orbY=lerp(lerp(300,600,fin(t,rec-0.5,1.0)),520,up);kt_agent(ctx,orbX,orbY,26,t,{a:fin(t,0.2,0.6)*(1-fin(t,cS,0.6)),busy:pulseAt(t,rec,1.6)});
  if(dfA>0)arrive(ctx,500,660,t,rec-0.3,()=>ag_code(ctx,100,lerp(520,110,up),800,"models/intermediate/int_learner_timeline.sql",AG_TLD,{a:dfA,label:AG_DRAFT,diff:true,p:clamp((t-rec)/1.6,0,1)}),{dy:30});
  ag_tag(ctx,1460,640,"one date for every version: when it was recorded",KT_AI,fin(t,rec+0.4,0.5)*(1-fin(t,cF-0.4,0.5)),{size:20});
  // the build: green, then one row red; Business 4 against 3
  const bState=fin(t,w("warn","The build passes")-0.3,0.6)*1;const bA=fin(t,cF-0.2,0.6)*(1-fin(t,cS-0.8,0.5));
  if(bA>0)arrive(ctx,1460,240,t,cF-0.2,()=>ag_build(ctx,1080,110,760,t,{a:bA,p:clamp((t-cF)/1.4,0,1),state:bState,lit:fin(t,cF+1.3,0.4),lit6:fin(t,w("warn","The build passes"),0.5)}),{dy:30});
  const nA=fin(t,w("fails","Business"),0.5)*(1-fin(t,cS-0.8,0.5));if(nA>0)withA(ctx,nA,()=>{const col=mix(AG_RED,AG_AMB,bState);glass(ctx,1080,420,760,110,16,col,{glow:14,ea:0.8,fill:"rgba(16,8,10,0.95)"});
    T(ctx,"Business",1110,488,{w:700,size:24,color:rgba(SOFT,1)});T(ctx,"4",1260,494,{w:800,size:54,color:rgba(col,1)});withA(ctx,fin(t,w("fails","The report"),0.5),()=>{T(ctx,"the report says",1380,488,{w:700,size:24,color:rgba(SOFT,1)});T(ctx,"3",1580,494,{w:800,size:54,color:rgba(PARCH,1)});});
    withA(ctx,fin(t,w("fails","fails"),0.4),()=>T(ctx,bState>0.5?"WARN 1":"FAIL 1",1810,486,{w:800,size:22,align:"right",color:rgba(col,1)}));});
  // seven days late: took effect 27 March, recorded 3 April; census day between them
  const cA=fin(t,cY-0.2,0.6)*(1-fin(t,cW-0.4,0.5));if(cA>0)withA(ctx,cA,()=>{const x0=340,dx=100,day=d=>x0+(d-24)*dx,yA=800;
    glass(ctx,100,600,1740,290,18,[170,205,255],{glow:8,ea:0.4,fill:"rgba(7,12,24,0.9)"});
    ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0-40,yA);ctx.lineTo(day(37)+40,yA);ctx.stroke();
    for(let d=24;d<=37;d++){const x=day(d);ctx.beginPath();ctx.moveTo(x,yA-6);ctx.lineTo(x,yA+6);ctx.stroke();T(ctx,String(d>31?d-31:d),x,yA+32,{f:"mono",w:500,size:18,align:"center",color:rgba(SOFT,0.9)});}
    T(ctx,"March",day(24),yA+62,{w:700,size:18,color:rgba(SOFT,1)});T(ctx,"April",day(32),yA+62,{w:700,size:18,color:rgba(SOFT,1)});
    const cx=day(31);glow(ctx,cx,700,60,TRUST,0.25);ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,640);ctx.lineTo(cx,yA);ctx.stroke();T(ctx,"census 31 Mar",cx,634,{w:800,size:20,align:"center",color:rgba(TRUST,1)});
    // Priya, by key: studying, then withdrawn; dated by recording, the withdrawal moves past census day
    const sl=ease(fin(t,w("why","now looks like"),1.4)),wx=lerp(day(27),day(34),sl),by=700;T(ctx,"SIS|S-20431",124,by+8,{f:"mono",w:500,size:18,color:rgba(SRC3[0][1],1)});
    ctx.fillStyle=rgba(AG_GRN,0.5);rr(ctx,day(24)+30,by-16,wx-day(24)-30,32,8);ctx.fill();ctx.fillStyle=rgba(AG_RED,0.45);rr(ctx,wx,by-16,day(37)-wx,32,8);ctx.fill();
    T(ctx,"studying",day(24)+44,by+7,{w:700,size:18});T(ctx,"withdrawn",wx+14,by+7,{w:700,size:18});
    [[27,"took effect 27 Mar",SRC3[0][1],-1],[34,"recorded 3 Apr",AG_AMB,1]].forEach(([d,s,col,sd])=>{const x=day(d);withA(ctx,fin(t,cY+(sd>0?1:0.3),0.5),()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,yA,8,0,TAU);ctx.fill();T(ctx,s,x,yA-22,{w:700,size:18,align:"center",color:rgba(col,1)});});});
    withA(ctx,fin(t,w("why","still studying"),0.5),()=>tag(ctx,cx+200,640,"studying on census day",AG_RED,{size:18}));});
  // the agent's second draft: the test set to warn
  const svA=fin(t,cW-0.3,0.6)*(1-fin(t,cX-0.9,0.5));if(svA>0)arrive(ctx,510,700,t,cW-0.3,()=>ag_code(ctx,100,600,820,"tests/_singular_tests.yml",AG_SEV,{a:svA,label:AG_DRAFT,diff:true,p:clamp((t-cW)/1.0,0,1),strike:{4:fin(t,w("stop","stops it"),0.6)}}),{dy:30});
  ag_tag(ctx,1460,580,"the build passes",AG_AMB,fin(t,w("warn","The build passes"),0.5)*(1-fin(t,cS-0.8,0.5)),{size:22});
  // Jun's review of the draft pull request stops it; the rule, written down
  const prA=fin(t,cS-0.1,0.6);if(prA>0){arrive(ctx,1590,260,t,cS-0.1,()=>{ag_pr(ctx,1340,110,500,330,t,{});
      withA(ctx,fin(t,w("stop","stops it")-0.3,0.5),()=>{glass(ctx,1364,250,452,170,12,AG_RED,{glow:10,ea:0.7,fill:"rgba(20,8,10,0.95)"});T(ctx,"Jun · changes requested",1384,284,{w:800,size:19,color:rgba(AG_RED,1)});
        wrapT(ctx,"Never weaken a test to make it pass. Report the failing row.",1384,320,410,{w:600,size:19,lh:28});});},{dy:24});
    arrive(ctx,1590,700,t,cS,()=>person(ctx,"jun",1590,860,0.5,{pose:fin(t,w("stop","stops it"),0.3)>0.5?"explain":"stand",expr:"concerned",t}),{dy:20,d:0.9});withA(ctx,fin(t,cS,0.6),()=>ag_role(ctx,1590,886,"jun",1));}
  const ruA=fin(t,w("stop","The rule")-0.3,0.6)*(1-fin(t,cX-0.9,0.5));if(ruA>0)arrive(ctx,690,190,t,w("stop","The rule")-0.3,()=>ag_code(ctx,100,110,1180,"AGENTS.md",AG_RULE,{a:ruA,edge:KT_AI,p:clamp((t-w("stop","The rule"))/1.2,0,1),lit:{0:fin(t,w("stop","never weaken"),0.5),1:fin(t,w("news","A failing test"),0.5),2:fin(t,w("news","failing rows"),0.5)},litCol:AG_RED}),{dy:30});
  const deA=fin(t,cN-0.2,0.6)*(1-fin(t,cX-0.9,0.5));if(deA>0)arrive(ctx,690,430,t,cN-0.2,()=>ag_code(ctx,100,300,1180,"tests/_singular_tests.yml",AG_DESC,{a:deA,edge:LAYER4[3][1],p:clamp((t-cN)/1.4,0,1),lit:{3:fin(t,w("news","let a person decide"),0.5),6:fin(t,w("news","let a person decide")+0.4,0.5)},litCol:TRUST}),{dy:30});
  // the fix: both lines return; the build runs; Business 3, green
  const fxA=fin(t,cX-0.3,0.6);if(fxA>0){arrive(ctx,690,290,t,cX-0.3,()=>ag_code(ctx,100,110,1180,"models/intermediate/int_learner_timeline.sql",AG_TL,{a:fxA,edge:LAYER4[1][1],lit:{4:fin(t,cX+0.2,0.5),5:fin(t,cX+0.3,0.5),6:fin(t,cX+0.3,0.5),10:fin(t,cX+0.4,0.5)},litCol:AG_GRN}),{dy:30});
    const b2=w("fix","Business");arrive(ctx,550,640,t,b2-0.4,()=>ag_build(ctx,100,520,900,t,{state:2,p:clamp((t-b2+0.3)/1.2,0,1),lit:fin(t,b2+0.4,0.4),lit6:fin(t,b2+0.6,0.4)}),{dy:30});
    arrive(ctx,1170,640,t,b2,()=>{glass(ctx,1040,580,260,120,16,AG_GRN,{glow:16,ea:0.85,fill:"rgba(6,18,12,0.95)"});T(ctx,"Business",1170,622,{w:700,size:22,align:"center",color:rgba(SOFT,1)});T(ctx,"3",1170,682,{w:800,size:52,align:"center",color:rgba(AG_GRN,1)});},{d:0.9});
    ag_tag(ctx,550,830,"the fix: when each change took effect",AG_GRN,fin(t,w("fix","took effect"),0.5),{size:22});}
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Reconcile and diff ---------- */
const AG_REC=["census_date | faculty_name               | in_the_mart | in_the_census_report | difference","2026-03-31  | Faculty of Arts and Educ…  |           2 |                    2 |          0","2026-03-31  | Faculty of Business        |           3 |                    3 |          0","2026-03-31  | Faculty of Engineering a…  |           5 |                    5 |          0","2026-03-31  | Faculty of Health          |           2 |                    2 |          0"];
const AG_DIFFSK=["1. Build the main branch, and keep its database; then build your branch with `--full-refresh`:","   ```sh","   git switch main && dbt build --profiles-dir . && cp target/credentials.duckdb target/main.duckdb","   git switch - && dbt build --full-refresh --profiles-dir .","   ```","   `--full-refresh` matters: `core_credential` is incremental, so a plain build merges only","   credentials whose source rows changed, and a change to the logic never reaches the rows","   already built. The diff would say nothing changed."];
const AG_D1=["the shortcut                                       the fix","dev_marts.mart_planning__near_award,               dev_marts.mart_planning__near_award,","  by learner_award_key                               by learner_award_key","  keys only in this branch: 0                        keys only in this branch: 0","  keys only in main:        0                        keys only in main:        0","  learner_status: 1 rows changed","  is_near_award: 1 rows changed"];
const AG_D2=["the shortcut                                       the fix","dev_core.core_learner_v1,                          dev_core.core_learner_v1,","  by learner_key,valid_from                          by learner_key,valid_from","  keys only in this branch: 55                       keys only in this branch: 0","  keys only in main:        55                       keys only in main:        0","  valid_to: 38 rows changed"];
scene("validate",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cR=c("reconcile"),cD=c("diff"),cS=c("scratch"),cN=c("none");
  // two checks before sign-off
  const hA=1-fin(t,cR-0.2,0.6);ag_tag(ctx,960,420,"two checks before sign-off",WEED,fin(t,0.6,0.5)*hA,{size:26});
  ag_tag(ctx,800,520,"reconcile",TRUST,fin(t,w("two","two checks")-0.1,0.5)*hA,{size:24});ag_tag(ctx,1120,520,"diff",KT_AI,fin(t,w("two","two checks")+0.2,0.5)*hA,{size:24});
  kt_agent(ctx,lerp(960,1780,fin(t,cR-0.3,1.0)),lerp(300,150,fin(t,cR-0.3,1.0)),24,t,{a:fin(t,0.2,0.6)*(1-fin(t,cN-0.3,0.6))});
  // reconcile: the mart against the census report, faculty by faculty; the scale levels as each difference lands on zero
  const RW=["Two","three","five","and two"],rA=fin(t,cR-0.2,0.6)*(1-fin(t,cD-0.3,0.6));
  if(rA>0){const land=RW.map(k=>fin(t,w("reconcile",k),0.4)),lv=land.reduce((s,x)=>s+x,0)/4;
    arrive(ctx,420,520,t,cR-0.2,()=>ag_scale(ctx,420,560,1,0.7*(1-lv)+0.03*Math.sin(t*1.3)*(1-lv),t,{a:rA,left:"Planning's mart",right:"census report"}),{d:1.0,from:0.92});
    arrive(ctx,1290,400,t,cR-0.1,()=>ag_code(ctx,760,300,1080,"dbt show --select reconcile_census_report",AG_REC,{a:rA,edge:TRUST,p:0.2+0.8*lv,lit:{1:land[0],2:land[1],3:land[2],4:land[3]},litCol:AG_GRN}),{dy:30});
    ag_tag(ctx,1300,580,"difference 0, everywhere",AG_GRN,fin(t,w("reconcile","zero"),0.5)*rA,{size:22});}
  // diff: main, then the branch from scratch, compared key by key; counts only
  const dA=fin(t,cD-0.2,0.6)*(1-fin(t,cN-0.3,0.6));if(dA>0){
    ag_db(ctx,400,250,170,110,"main",[150,176,214],fin(t,w("diff","build main"),0.5)*dA,{sub:"target/main.duckdb"});
    ag_db(ctx,920,250,170,110,"the branch",KT_AI,fin(t,w("diff","the branch"),0.5)*dA,{sub:"--full-refresh",hi:pulseAt(t,w("diff","from scratch"),1.2)});
    const kb=fin(t,w("diff","key by key"),0.8);withA(ctx,dA,()=>{for(let i=0;i<4;i++){const y=210+i*26,q=clamp(kb*4-i,0,1);if(q<=0)continue;ctx.save();ctx.setLineDash([4,6]);ctx.strokeStyle=rgba(KT_AI,0.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(495,y);ctx.lineTo(lerp(495,825,q),y);ctx.stroke();ctx.restore();}});
    ag_tag(ctx,660,150,"key by key",KT_AI,kb*dA,{size:20});
    arrive(ctx,690,610,t,cD+0.4,()=>ag_code(ctx,100,470,1180,"skills/reconcile-and-diff/SKILL.md",AG_DIFFSK,{a:dA,edge:KT_AI,p:clamp((t-cD-0.5)/2.0,0,1),lit:{2:fin(t,w("diff","build main"),0.5),3:fin(t,w("diff","the branch"),0.5),5:fin(t,cS,0.5),6:fin(t,cS+0.2,0.5),7:fin(t,cS+0.4,0.5)},litCol:KT_AI}),{dy:30});
    ag_tag(ctx,660,440,"counts only · no personal data leaves",AG_GRN,fin(t,w("diff","Counts only"),0.5)*dA,{size:20});
    // from scratch: an incremental table only takes new rows on top, so a changed rule never reaches the old ones
    const stA=fin(t,cS-0.2,0.6)*dA;if(stA>0){arrive(ctx,1580,400,t,cS-0.2,()=>ag_stack(ctx,1380,300,300,t,{a:stA,newRows:fin(t,cS+0.4,0.4)>0.5?1:0,rule:clamp((t-w("scratch","incremental"))/2.0,0,1),refresh:fin(t,w("scratch","change in logic")+0.4,1.2)}),{dy:24});
      ag_tag(ctx,1560,650,"incremental hides a change in logic",AG_AMB,fin(t,w("scratch","would hide"),0.5)*stA,{size:20});
      ag_tag(ctx,1560,710,"--full-refresh rebuilds it all",KT_AI,fin(t,w("scratch","change in logic")+0.4,0.5)*stA,{size:20});}}
  // the diffs: the shortcut moved one row of the mart and 55 versions in the core; with the fix, nothing
  const nA=fin(t,cN-0.2,0.6);if(nA>0){const fx=fin(t,w("none","With the fix"),0.7);
    const sh=(y,h)=>withA(ctx,fx,()=>{glow(ctx,960,y+h/2,300,AG_GRN,0.12);ctx.fillStyle=rgba(AG_GRN,0.08);rr(ctx,660,y+60,600,h-70,10);ctx.fill();ctx.strokeStyle=rgba(AG_GRN,0.5);ctx.lineWidth=1.5;rr(ctx,660,y+60,600,h-70,10);ctx.stroke();});
    arrive(ctx,690,240,t,cN-0.2,()=>{ag_code(ctx,100,110,1180,"scripts/diff_against_main.py",AG_D1,{a:nA,edge:KT_AI,p:clamp((t-cN)/1.2,0,1),lit:{5:fin(t,w("none","one learner's"),0.5),6:fin(t,w("none","one learner's")+0.1,0.5)},litCol:AG_AMB});sh(110,263);},{dy:30});
    const c2=w("none","In the core")-0.2;arrive(ctx,690,530,t,c2,()=>{ag_code(ctx,100,410,1180,"scripts/diff_against_main.py",AG_D2,{a:nA,edge:KT_AI,p:clamp((t-c2)/1.2,0,1),lit:{3:fin(t,w("none","fifty-five"),0.5),4:fin(t,w("none","fifty-five"),0.5),5:fin(t,w("none","fifty-five")+0.2,0.5)},litCol:AG_AMB});sh(410,236);},{dy:30});
    ag_tag(ctx,1560,240,"the mart: 1 row changed",AG_AMB,fin(t,w("none","one learner's"),0.5),{size:22});
    ag_tag(ctx,1560,520,"the core: 55 versions moved",AG_AMB,fin(t,w("none","fifty-five"),0.5),{size:22});
    ag_tag(ctx,960,740,"the fix: the diff is empty",AG_GRN,fin(t,w("none","the diff is empty"),0.5),{size:24});}
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Review and ship ---------- */
const AG_WF=["      - name: Build and test on DuckDB","        run: dbt build --profiles-dir .","","      - name: Doc blocks and key sets match the conceptual model","        run: python scripts/definitions.py --check","","      - name: Physical diagram matches the YAML","        run: python scripts/diagrams.py --check","","      - name: The metric gives the census report's number","        run: |","          …","          python scripts/check_metric.py"];
const AG_README=["… With dbt Cloud, a CI job does the same, and builds only the changed models","and what depends on them:","`dbt build --select state:modified+ --defer --state <production artifacts>`,","where the artifacts are the `manifest.json` of the last production run."];
const AG_WHO=["| Change | Approves |","|---|---|","| Meaning: a definition, a key, an identity rule, a business rule | Mei Tanaka, … |","| The model: grain, entities, relationships, versions | Noor, data architect |","| The code: models, tests, macros | Jun Park, analytics engineer, in review |","| A consumer contract | Its consumer: Planning, or the wallet app team |","","The agent recommends; people approve."];
const AG_CHECKS=["Build and test on DuckDB","Doc blocks and key sets match the conceptual model","Physical diagram matches the YAML","The metric gives the census report's number","Parse for Databricks"];
// what depends on the timeline: its node in the project's graph and everything downstream of it
const AG_DOWN=(()=>{const down=k0=>{const set=new Set([k0]);let grown=true;while(grown){grown=false;LG.edges.forEach(([i,j])=>{if(set.has(i)&&!set.has(j)){set.add(j);grown=true;}});}return[...set];};let best=[];LG.col[1].slice(60,80).forEach(k=>{const d=down(k);if(d.length>best.length)best=d;});return best;})();
// the pull request, filled in: four sections, the evidence from the last chapter, the checks, and the merge button
function ag_prFull(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ag_pr(ctx,x,y,w,h,t,{ready:o.ready,merged:o.merged});
  [["What changed",o.s[0]],["Why",o.s[1]],["What was checked",o.s[2]],["Evidence",o.s[3]]].forEach(([s,q],i)=>{if(q<=0)return;const yy=y+156+i*66;withA(ctx,q,()=>{T(ctx,"## "+s,x+24,yy,{f:"mono",w:500,size:19,color:rgba(INK,0.95)});
    if(i<3){for(let k=0;k<2;k++){ctx.fillStyle=rgba(SOFT,0.25);rr(ctx,x+24,yy+14+k*16,(w-60)*(k?0.55:0.85)*clamp(q*1.4-k*0.3,0,1),7,3);ctx.fill();}}
    else{glass(ctx,x+24,yy+12,(w-64)/2,56,10,TRUST,{glow:6,ea:0.6,fill:"rgba(8,12,22,0.96)"});T(ctx,"reconcile: 0 in every faculty",x+38,yy+46,{w:700,size:18,color:rgba(AG_GRN,1)});
      glass(ctx,x+40+(w-64)/2,yy+12,(w-64)/2,56,10,KT_AI,{glow:6,ea:0.6,fill:"rgba(8,12,22,0.96)"});T(ctx,"diff against main: empty",x+54+(w-64)/2,yy+46,{w:700,size:18,color:rgba(AG_GRN,1)});}});});
  const cy=y+452;withA(ctx,o.chk?1:0,()=>{T(ctx,"Checks",x+24,cy,{w:800,size:20,color:rgba(SOFT,1)});});
  AG_CHECKS.forEach((s,i)=>{const q=o.chk?o.chk[i]||0:0;if(q<=0)return;const yy=cy+38+i*36;withA(ctx,q,()=>{glow(ctx,x+40,yy-6,18,AG_GRN,0.3*q);ctx.fillStyle=rgba(AG_GRN,0.2);ctx.beginPath();ctx.arc(x+40,yy-6,13,0,TAU);ctx.fill();tick_(ctx,x+40,yy-6,16,AG_GRN,1);T(ctx,s,x+64,yy,{w:600,size:19});});});
  const by=y+h-62,mg=o.merged||0;glass(ctx,x+24,by,190,44,10,mg>0.5?[178,156,255]:AG_GREY,{glow:6+10*mg,ea:0.6,fill:"rgba(12,14,22,0.96)"});T(ctx,mg>0.5?"Merged":"Merge",x+119,by+29,{w:800,size:20,align:"center",color:rgba(mg>0.5?[178,156,255]:AG_GREY,1)});});}
scene("ship",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cC=c("ci"),cL=c("cloud"),cP=c("people"),cA=c("approve");
  // the draft from chapter 5 is marked ready for review, and fills in as it's voiced
  const chk=[w("ci","builds the project"),w("ci","generated docs"),w("ci","generated docs")+0.7,w("ci","metric"),w("cloud","parses")].map(x=>fin(t,x,0.4));
  const mergeT=sc.ends["approve"]+0.5;
  arrive(ctx,480,470,t,0.2,()=>ag_prFull(ctx,80,90,800,720,t,{ready:fin(t,w("pr","ready"),0.3),merged:fin(t,mergeT,0.3),s:[fin(t,w("pr","what it changed"),0.5),fin(t,w("pr","why"),0.5),fin(t,w("pr","what it checked"),0.5),fin(t,w("pr","the evidence"),0.5)],chk:fin(t,cC,0.3)>0?chk:null}),{d:0.9,from:0.95});
  // the evidence from the last chapter, carried across the cut: it shrinks into the pull request's evidence section
  const ev=ease(fin(t,w("pr","the evidence")-0.3,1.1)),evA=fin(t,0.6,0.5)*(1-fin(t,w("pr","the evidence")+0.5,0.4));if(evA>0)withA(ctx,evA,()=>{
    [[940,100,104,480,"dbt show --select reconcile_census_report",AG_REC.map(l=>l.slice(14)),TRUST],[940,360,488,480,"scripts/diff_against_main.py",AG_D1.slice(0,5).map(l=>l.slice(51)),KT_AI]].forEach(([x0,y0,x1,y1,nm,L,col])=>{
      const k=lerp(1,368/900,ev);ctx.save();ctx.translate(lerp(x0,x1,ev),lerp(y0,y1,ev));ctx.scale(k,k);ag_code(ctx,0,0,900,nm,L,{edge:col,lit:nm[0]==="d"?{1:1,2:1,3:1,4:1}:{3:1,4:1},litCol:AG_GRN});ctx.restore();});});
  // CI: the checks that run on every pull request, from the workflow
  const wA=fin(t,cC-0.2,0.6)*(1-fin(t,w("cloud","On dbt Cloud")-0.4,0.5));if(wA>0)arrive(ctx,1390,310,t,cC-0.2,()=>ag_code(ctx,940,100,900,".github/workflows/credential-project.yml",AG_WF,{a:wA,edge:[170,205,255],p:clamp((t-cC)/1.6,0,1),lit:{0:chk[0],1:chk[0],3:chk[1],4:chk[1],6:chk[2],7:chk[2],9:chk[3],12:chk[3]},litCol:AG_GRN}),{dy:30});
  ag_tag(ctx,1390,580,"CI: the checks that run on every pull request",SOFT,fin(t,w("ci","the checks"),0.5)*wA,{size:20});
  ag_tag(ctx,1390,650,"parse for Databricks",[150,176,214],fin(t,w("cloud","parses"),0.5)*(1-fin(t,w("cloud","On dbt Cloud")-0.4,0.5)),{size:20});
  // dbt Cloud: only what changed, and what depends on it
  const rA=fin(t,w("cloud","On dbt Cloud")-0.2,0.6)*(1-fin(t,cP-0.3,0.5));if(rA>0){arrive(ctx,1380,190,t,w("cloud","On dbt Cloud")-0.2,()=>ag_code(ctx,910,100,940,"README.md",AG_README,{a:rA,edge:[170,205,255],p:clamp((t-w("cloud","On dbt Cloud"))/1.2,0,1),lit:{2:fin(t,w("cloud","only what changed"),0.5)}}),{dy:30});
    ag_tag(ctx,1380,330,"Databricks · dbt Cloud",[150,176,214],fin(t,w("cloud","dbt Cloud"),0.5)*rA*0.85,{size:20});
    const pk={},lit=fin(t,w("cloud","only what changed"),0.6);AG_DOWN.forEach(k=>pk[k]=lit);withA(ctx,rA,()=>lineageGraph(ctx,960,420,840,380,t,{dim:0.6*lit,pick:pk,heads:0.8}));
    ag_tag(ctx,1380,860,"only what changed · state:modified+",KT_AI,fin(t,w("cloud","what depends"),0.5)*rA,{size:20});}
  // then people: Jun the code, Noor the model, Planning its number
  const pA=fin(t,cP-0.2,0.6);if(pA>0){const P=[["jun",1100,"Jun","code"],["noor",1400,"Noor","model"],["plan",1700,"Planning","number"]];
    P.forEach(([id,x,nm,word],i)=>{const t0=cP+i*0.3;arrive(ctx,x,350,t,t0,()=>{if(id==="plan"){ag_team(ctx,x,300,1.15,AG_PLN,t,{});T(ctx,"Planning",x,470,{w:800,size:24,align:"center"});T(ctx,"Consumer",x,497,{w:600,size:18,align:"center",color:rgba(SOFT,1)});}
      else{person(ctx,id,x,450,0.42,{pose:"stand",t});ag_role(ctx,x,476,id);}},{dy:20});
      const tk=w("people",word==="code"?"the code":word==="model"?"the model":"its number");kt_gtick(ctx,x+70,200,18,fin(t,tk-0.1,0.35));
      ag_tag(ctx,x,560,nm+": "+(word==="number"?"its number":"the "+word),TRUST,fin(t,tk,0.5),{size:20});});}
  // the agent never merges or approves its own work: the button stays grey for it
  const reach=ease(fin(t,w("approve","never merges")-0.6,1.2));kt_agent(ctx,lerp(1860,420,reach),lerp(720,770,reach),24,t,{a:fin(t,0.2,0.6)});
  ag_tag(ctx,490,770,"the agent never merges",AG_GREY,fin(t,w("approve","never merges")+0.6,0.5),{size:20,align:"left"});
  const aT=w("approve","recommends")-0.7,aA=fin(t,aT,0.6);if(aA>0)arrive(ctx,1370,750,t,aT,()=>ag_code(ctx,900,610,940,"AGENTS.md",AG_WHO,{a:aA,edge:TRUST,p:clamp((t-aT)/1.0,0,1),lit:{7:fin(t,aT+1.1,0.5)},litCol:TRUST}),{dy:30});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. The same words, four places ---------- */
const AG_REV=["---","name: review-metadata","description: Review the project's YAML and Markdown for facts written twice, drifted copies and","  missing metadata. …","---"];
const AG_FOUR=[["wiki","An award is a qualification the university confers on paper, for a set number of credit points.",1],["YAML description","An award is a qualification the university confers, such as a graduate certificate or a master.",1],["catalog","An award is a degree the university confers, for a set number of credit points.",1],["dashboard tooltip","An award is a qualification the university confers, for a set number of credit points.",0]];
scene("next",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cM=c("metadata"),cA=c("award");
  // the merged pull request carries across the cut where chapter 7 left it (that chapter's camera ends 2.5% in, around the
  // centre), holds while the old picture fades (0.8 s), then folds into the project's graph, all green; the graph and the loop of
  // ten, steps 7 and 8 lit, arrive once it has moved clear. Everything fades before the end card.
  const out=1-fin(t,B-0.6,0.6),z7=1.025,fold=ease(fin(t,0.9,1.4)),zz=lerp(z7,1,fold);
  if(fold<1)withA(ctx,(1-fold)*out,()=>{ctx.save();ctx.translate(960,540);ctx.scale(zz,zz);ctx.translate(-960,-540);ctx.translate(lerp(480,800,fold),lerp(470,600,fold));ctx.scale(1-0.9*fold,1-0.9*fold);ctx.translate(-480,-470);ag_prFull(ctx,80,90,800,720,t,{ready:1,merged:1,s:[1,1,1,1],chk:[1,1,1,1,1]});ctx.restore();});
  const gA=fin(t,1.6,0.8)*out,g4=1-fin(t,w("award","four places")-0.6,0.6);withA(ctx,gA,()=>{const bx=fin(t,cM+0.6,0.8)*g4;ctx.save();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(WEED,0.5*bx);ctx.lineWidth=2;rr(ctx,260,350,1080,520,24);ctx.stroke();ctx.restore();
    withA(ctx,bx,()=>T(ctx,"the project",284,388,{w:700,size:20,color:rgba(WEED,0.9)}));const pk={};LG.nodes.forEach((n,k)=>{if(k%3===0)pk[k]=0.6*fin(t,1.8+hash(k,5)*1.2,0.4);});
    withA(ctx,1-0.88*(1-g4),()=>lineageGraph(ctx,320,452,960,388,t,{pick:pk,heads:0.8*g4,core:0.7}));});
  ag_tag(ctx,800,200,"merged · tested · signed off",AG_GRN,fin(t,Math.max(w("merged","merged"),1.9),0.5)*(1-fin(t,cM+0.4,0.5)),{size:24});
  const lA=fin(t,0.9,0.6)*out;if(lA>0){const on=STEPS10.map((_,i)=>i===6||i===7?1:0.3);ag_stepLoop(ctx,1620,190,215,120,t,{a:lA,on,r:34,teal:on.map((_,i)=>i===6||i===7?fin(t,1.0+i*0.05,0.4):0),ticks:on.map((_,i)=>i===6||i===7?fin(t,1.4+i*0.1,0.4):0)});
    ag_tag(ctx,1620,190,"validate · review and ship",WEED,lA,{size:18});}
  // the agent: carried across the cut from where chapter 7 left it, beside the Merge button; then it opens its fifth skill
  withA(ctx,out,()=>{
  const cr=ease(fin(t,0.9,1.4)),ox=lerp(lerp(960+(420-960)*1.025,1100,cr),1400,fin(t,cM-0.3,1.0)),oy=lerp(lerp(540+(770-540)*1.025,260,cr),440,fin(t,cM-0.3,1.0));kt_agent(ctx,ox,oy,26,t,{busy:pulseAt(t,cM,1.6)});
  const kA=fin(t,cM-0.2,0.6)*(1-fin(t,cA-0.2,0.5));if(kA>0)arrive(ctx,690,210,t,cM-0.2,()=>ag_code(ctx,100,100,1180,"skills/review-metadata/SKILL.md",AG_REV,{a:kA,edge:KT_AI,p:clamp((t-cM)/1.2,0,1)}),{dy:30});
  ag_tag(ctx,690,200,"review the metadata",KT_AI,fin(t,cA-0.2,0.5),{size:24});
  [["wiki",470],["catalog",620],["dashboards",770]].forEach(([n,y],i)=>{const t0=w("metadata","beyond it")+i*0.25,a=fin(t,t0,0.5);if(a<=0)return;arrive(ctx,1670,y,t,t0,()=>{glass(ctx,1500,y-44,340,88,14,[170,205,255],{glow:8,ea:0.6,fill:"rgba(8,12,22,0.95)"});T(ctx,n,1670,y+8,{w:800,size:22,align:"center"});},{dy:16});
    withA(ctx,a,()=>{ctx.save();ctx.setLineDash([3,7]);ctx.strokeStyle=rgba(KT_AI,0.7);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ox+20,oy+20);ctx.lineTo(1500,y);ctx.stroke();ctx.restore();});});
  ag_tag(ctx,1670,400,"in the project and beyond · read-only",KT_AI,fin(t,w("metadata","beyond it"),0.5),{size:18});
  ag_tag(ctx,1670,880,"something no test checks",AG_AMB,fin(t,w("metadata","no test checks"),0.5),{size:20});
  // one definition, four places; three of them drift
  AG_FOUR.forEach(([k,s,dr],i)=>{const t0=w("award","four places")+i*0.25,x=300+(i%2)*530,y=430+Math.floor(i/2)*200;
    arrive(ctx,x+240,y+70,t,t0,()=>ag_copy(ctx,x,y,480,k,s,dr?AG_AMB:TRUST,t,{drift:dr*fin(t,w("award","three"),0.8),seed:i,mark:dr*fin(t,w("award","wrong"),0.5),h:150}),{dy:20});});
  ag_tag(ctx,800,330,"award · four places · three wrong",AG_AMB,fin(t,w("award","three"),0.5),{size:22});
  });
  ctx.restore();weedsEnd(ctx,S,t,B,"An agent on the team",WEED,"The agent drafts and checks, with evidence. People approve.");
  fadeIn(ctx,S,t,0.01);vign(ctx,S);});
