/* ===== One row of what, and when: scenes =====
   Eight chapters, as in ../script.md. The 1890 census counts everyone as they were on one day, one card per person; Jun's
   table for Planning gets its grain in one sentence, and the sentence becomes a test; a renamed award doubles the rows of a
   join on its key alone; every version is kept, and the core builds Aisha's credit as versions; Planning asks about census day
   and the wallet about today, twelve and nine, both right; three systems' versions cut and stitched into one timeline;
   Priya's late withdrawal, dated by when it took effect; and the hand-off to the contracts.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts (drift), things arrive with a spring (arrive), dust
   gives depth (motes), and what two chapters share travels across the cut: the two words lifted from the 1890 card become
   the grain sentence (1 → 2), the grain test goes from the mart's YAML to the fan-out (2 → 3), and Aisha's staircase of
   versions splits into the two consumers' views (4 → 5).
   Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. One card, one day ---------- */
const RW_STK=[1290,700,300,136],RW_HOLDER=[1380,404,300,136];
// where the stylus is while the five holes are punched: k is the hole, u (0..1) through its moment
function rw_punchAt(t,t0){const per=0.32,k=clamp(Math.floor((t-t0)/per),0,RW_HOLES.length-1),u=clamp((t-t0)/per-k,0,1),hp=RW_HOLES.map((_,i)=>clamp((t-t0-i*per-0.12)/0.1,0,1));
  const P=i=>[RW_HOLES[i][0]/11,RW_HOLES[i][1]/4],a=P(k),b=P(Math.min(k+1,RW_HOLES.length-1)),mv=ease(clamp((u-0.45)/0.55,0,1));
  return{at:t<t0?[0.9,0.1]:[lerp(a[0],b[0],mv),lerp(a[1],b[1],mv)],press:t>=t0&&u<0.4?Math.sin(Math.PI*u/0.4):0,hp};}
scene("card",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.04,x:900,y:520});
  const cD=c("day"),cP=c("punch"),cR=c("bridge"),away=ease(fin(t,cP-0.3,1.3)),left=1-fin(t,cP-0.3,0.8);
  const tL=w("punch","Each person")-0.1,tW=w("punch","punched"),tF=w("punch","Hollerith")-0.3,tD=tF+0.9;
  // the calendar page, pinned at June 1; the days of June run past under it
  arrive(ctx,280,330,t,w("day","first of June")-0.3,()=>rw_calendar(ctx,150,180,260,300,t,{}),{d:1.0,from:0.9});
  [2,9,16,23,30].forEach((d,i)=>{const t0=w("born","Counting took weeks")+i*0.6,u=(t-t0)/2.0;if(u<=0||u>=1)return;rw_leaf(ctx,lerp(470,100,u),545,d,Math.sin(Math.PI*u)*left);});
  arrive(ctx,280,625,t,w("born","weeks")+0.3,()=>withA(ctx,left,()=>tag(ctx,280,625,"weeks of counting, one day described",CLAY,{align:"center",size:18})),{dy:12});
  // a baby born after the first: a cradle, set aside
  const aside=ease(fin(t,w("born","wasn't counted"),0.8));
  withA(ctx,left,()=>{arrive(ctx,290,790,t,w("born","a baby")-0.2,()=>rw_cradle(ctx,290-40*aside,790,0.85,t,1-0.45*aside),{dy:20});
    arrive(ctx,290,700,t,w("born","born after"),()=>tag(ctx,290,700,"born after June 1: not counted",CLAY,{align:"center",size:18}),{dy:12});});
  // the family's schedule: one column of answers per person, written at the door
  const wr=[0,1,2,3].map(i=>clamp((t-(cD+0.9+i*1.15))/1.05,0,1)),dA=w("born","Someone who died");
  arrive(ctx,860,440,t,cD+0.2,()=>rw_schedule(ctx,540,170,640,540,t,{wr,lift:t>tL?0:-1,note:clamp((t-dA)/0.9,0,1),hiCol:3,hi:fin(t,dA,0.5)*left}),{d:1.0,from:0.94,dy:20});
  arrive(ctx,1100,745,t,w("born","died after")+0.1,()=>withA(ctx,left,()=>tag(ctx,1100,745,"died after June 1: counted",CLAY,{align:"center",size:18})),{dy:12});
  // the house and the census taker; they leave for Washington
  withA(ctx,1-away,()=>{ctx.save();ctx.translate(away*420,0);
    arrive(ctx,1560,520,t,0.6,()=>rw_house(ctx,1290,230,540,590,t,1),{d:1.2,from:0.96});
    arrive(ctx,1450,700,t,w("day","United States")-0.4,()=>rw_taker(ctx,1450,862,1,t,{write:(wr[0]+wr[1]+wr[2]+wr[3])/4}),{dy:30,d:0.9});
    ctx.restore();});
  // Washington: the clerk's punch, one hole per answer
  const pOut=1-fin(t,cR-0.3,0.8),pk=rw_punchAt(t,tW+0.1),[sx,sy]=rw_stylus(1250,220,pk.at,pk.press);
  arrive(ctx,1530,370,t,cP+0.1,()=>withA(ctx,pOut,()=>{rw_punch(ctx,1250,220,t,{at:pk.at,press:pk.press});rw_clerkHand(ctx,sx+12,sy-16,t,1,pk.press);}),{d:0.9,from:0.94,dy:24});
  arrive(ctx,1530,170,t,cP+0.4,()=>withA(ctx,pOut,()=>tag(ctx,1530,170,"Washington · the census office",CLAY,{align:"center",size:18})),{dy:10});
  // William's column lifts from the sheet and becomes a card; punched; then it lands on the stack
  const m=ease(fin(t,tL,0.9)),fl=ease(fin(t,tF,0.9)),col=rw_schCol(540,170,0),n=6;
  arrive(ctx,1440,768,t,cP+0.5,()=>rw_stack(ctx,RW_STK[0],RW_STK[1],RW_STK[2],RW_STK[3],n,1),{dy:20});
  if(t>tL){const top=[RW_STK[0],RW_STK[1]-n*3.2],x=lerp(lerp(col[0],RW_HOLDER[0],m),top[0],fl),y=lerp(lerp(col[1],RW_HOLDER[1],m),top[1],fl),cw=lerp(col[2],RW_HOLDER[2],m),ch=lerp(col[3],RW_HOLDER[3],m);
    rw_card(ctx,x,y,cw,ch,{holes:RW_HOLES,hp:pk.hp,grid:m>0.6});}
  // the tabulator's dial advances as the card passes
  const adv=fin(t,tD,0.5);arrive(ctx,1700,770,t,cP+0.7,()=>{glow(ctx,1700,770,120,[255,210,140],0.15*pulseAt(t,tD,1.0));rw_dial(ctx,1700,770,80,46+adv,1);},{from:0.9});
  arrive(ctx,1700,640,t,w("punch","Hollerith"),()=>tag(ctx,1700,640,"Hollerith's tabulator",CLAY,{align:"center",size:18}),{dy:10});
  arrive(ctx,1440,640,t,tD,()=>tag(ctx,1440,640,"one card per person",CLAY,{align:"center",size:18}),{dy:10});
  // the bridge: two phrases lift from the card and drift right, towards the present, until the cut (they end at x 1460, where chapter 2 picks them up)
  const br=ease(fin(t,cR+0.1,1.8));if(t>cR){[["one per person",690,360],["as at June 1",720,440]].forEach(([s,y0,y1],i)=>{const q=ease(fin(t,cR+0.1+i*0.25,1.8)),x=lerp(1440,1340,q)+120*ease(fin(t,cR+0.6,sc.dur-cR-0.6)),y=lerp(y0,y1,q),sz=lerp(22,34,q),cl=mix(CLAY,i?RW_TIME:WEED,q);
    withA(ctx,fin(t,cR+i*0.25,0.4),()=>{glow(ctx,x,y-10,sz*3,cl,0.25*q);T(ctx,s,x,y,{w:800,size:sz,align:"center",color:rgba(cl,1)});});});}
  ctx.restore();yearTag(ctx,120,110,"1890 · United States",CLAY,fin(t,0.3,0.6));
  weedsTitle(ctx,S,t,B,"One row of what, and when","grain and time, declared before any SQL",WEED);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. One sentence ---------- */
const RW_Y2=["  - name: mart_planning__near_award","    …","    config:","      meta:","        grain: One row per learner per award, as at census date","    …","    data_tests:","      # the grain, tested as a key","      - unique_combination:","          arguments:","            columns: [learner_key, award_key]"];
const RW_TEST2=[1080,800,740,56],RW_TEST3=[100,672,660,56];
const RW_REPORT=["census_date","faculty_code","faculty_name","learners_near_graduate_certificate","published_by","published_on"];
scene("grain",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cS=c("sentence"),cN=c("name"),cA=c("agent"),cT=c("test"),dS=sc.ends.sentence-cS,SZ=44,
    SY=lerp(420,320,ease(fin(t,w("agent","Planning's question")-1.0,1.1)));  // the sentence sits low while it is alone, and rises as the agent's sources arrive
  arrive(ctx,190,124,t,0.3,()=>{rw_loop(ctx,190,124,108,58,t,STEPS10.map((_,i)=>i===2?fin(t,0.8,0.6):0),1);tag(ctx,332,124,"step 3 · what each consumer needs",WEED,{size:20});},{from:0.85});
  arrive(ctx,1720,130,t,w("before","for Planning")-0.3,()=>rw_badge(ctx,1720,130,44,"planning","Planning",{hi:pulseAt(t,w("before","for Planning"),1.2)}),{dy:20});
  // the sentence: the two words from 1890 settle into it, then it writes itself
  const cardA=fin(t,w("before","one sentence")-0.2,0.6),p1=clamp((t-cS)/(0.6*dS),0,1),p2=clamp((t-cS-0.6*dS)/(0.4*dS),0,1);
  const pos=rw_sentence(ctx,960,SY,SZ,{a:cardA,p1,p2,hi:pulseAt(t,cS,2.6)});
  [["one per person",360,WEED],["as at June 1",440,RW_TIME]].forEach(([s,y0,cl],i)=>{const q=ease(fin(t,0.1,1.8)),x=lerp(1460,pos[i][0],q),y=lerp(y0,SY+12,q),a=1-fin(t,cS-0.5,0.4);
    if(a>0)withA(ctx,a,()=>{glow(ctx,x,y-10,90,cl,0.2);T(ctx,s,x,y,{w:800,size:lerp(34,30,q),align:"center",color:rgba(cl,1)});});});
  const cw=tw(ctx,RW_GRAIN+", "+RW_ASAT,SZ,800)+80,cTop=SY-SZ*1.2-SZ*0.3;
  arrive(ctx,960,SY-98,t,w("name","the grain")-0.1,()=>tag(ctx,960,SY-98,"the grain",WEED,{align:"center",size:20}),{dy:10});
  arrive(ctx,pos[0][0],SY+80,t,w("name","what a row is")-0.1,()=>tag(ctx,pos[0][0],SY+80,"what a row is",INK,{align:"center",size:20}),{dy:10});
  arrive(ctx,pos[1][0],SY+80,t,w("name","which day")-0.1,()=>tag(ctx,pos[1][0],SY+80,"which day",RW_TIME,{align:"center",size:20}),{dy:10});
  // the agent drafts it from Planning's question and the census report; Noor approves it
  const out=1-fin(t,cT-0.5,0.6);withA(ctx,out,()=>{
    arrive(ctx,470,530,t,w("agent","Planning's question")-0.3,()=>{glass(ctx,120,470,700,124,18,RW_CON,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,"Planning's question",146,504,{w:700,size:18,color:rgba(RW_CON,1)});
      wrapT(ctx,"learners within 15 credit points of a graduate certificate, by faculty, as at census date",146,540,650,{w:700,size:22});},{dy:20});
    arrive(ctx,470,710,t,w("agent","census report")-0.3,()=>{glass(ctx,120,620,700,170,18,[150,180,220],{glow:10,ea:0.7,fill:"rgba(7,12,24,0.95)"});T(ctx,"seeds/expected/planning/census_report.csv",146,654,{f:"mono",w:500,size:18,color:rgba([150,180,220],1)});
      T(ctx,"one row per faculty",794,654,{w:700,size:18,align:"right",color:rgba(SOFT,1)});RW_REPORT.forEach((s,i)=>T(ctx,s,146+(i>2?250:0),698+(i%3)*30,{f:"mono",w:500,size:18,color:rgba(INK,0.9)}));},{dy:20});
    const ag=fin(t,cA-0.2,0.5),dr=fin(t,w("agent","drafts")-0.1,0.9);
    arrive(ctx,960,640,t,cA-0.2,()=>{kt_agent(ctx,960,640,34,t,{busy:dr*(1-fin(t,w("agent","Noor"),0.6))});
      arrowTo(ctx,826,532,920,624,KT_AI,0.8,{p:fin(t,w("agent","Planning's question"),0.6),head:12,dash:[6,6]});arrowTo(ctx,826,705,920,656,KT_AI,0.8,{p:fin(t,w("agent","census report"),0.6),head:12,dash:[6,6]});
      arrowTo(ctx,960,598,960,cTop+SZ*2.4+8,KT_AI,0.9,{p:dr,head:14});tag(ctx,960,712,"drafted · the agent",KT_AI,{align:"center",size:20});},{from:0.8});
    arrive(ctx,1480,620,t,w("agent","Noor")-0.2,()=>{rw_face(ctx,"noor",1480,620,74,1,{t});T(ctx,"Noor",1480,728,{w:800,size:24,align:"center"});T(ctx,"Data architect · owns the model",1480,756,{w:600,size:18,align:"center",color:rgba(SOFT,1)});},{dy:20});
    arrive(ctx,1480,520,t,w("agent","approves it"),()=>tag(ctx,1480,520,"approved · Noor",TRUST,{align:"center",size:20}),{dy:10});});
  kt_gtick(ctx,960+cw/2-8,cTop+4,18,fin(t,w("agent","approves it"),0.4));
  // then it becomes a test: the mart's YAML, the convention, Aisha's three rows, and the test passing
  const yp=clamp((t-cT+0.2)/1.4,0,1),lt=fin(t,w("test","no two rows"),0.5);
  arrive(ctx,570,670,t,cT-0.3,()=>rw_code(ctx,120,470,900,"models/marts/planning/_planning__models.yml",RW_Y2,{p:yp,size:19,lh:30,lit:{4:fin(t,cT+0.6,0.5),8:lt,9:lt,10:lt},seg:[[4,"as at census date",fin(t,cT+0.6,0.5),RW_TIME]]}),{dy:30});
  arrive(ctx,1450,540,t,w("test","becomes a test"),()=>rw_code(ctx,1080,470,740,"docs/conventions.md",["- Every model's grain (`meta.grain`) is tested as a key: `unique`, or …"],{wrap:62,size:18,lh:28,p:clamp((t-w("test","becomes a test"))/1.0,0,1),edge:KIND}),{dy:20});
  const rows=[["0905e6e2…","GCDA","45"],["0905e6e2…","MDA","10"],["0905e6e2…","GCCS","5"]];
  arrive(ctx,1340,700,t,w("test","no two rows")-0.3,()=>{rw_table(ctx,1080,630,[["learner_key",200,"l"],["award_code",170,"l"],["credit",110,"r"]],rows,{on:rows.map((_,i)=>fin(t,w("test","no two rows")+i*0.22,0.3)),lh:30});
    tag(ctx,1720,690,"Aisha",INK,{align:"center",size:20});T(ctx,"three awards",1720,740,{w:600,size:18,align:"center",color:rgba(SOFT,1)});},{dy:20});
  const ok=fin(t,w("test","same award")+0.3,0.4);
  arrive(ctx,1450,828,t,w("test","no two rows"),()=>rw_test(ctx,RW_TEST2[0],RW_TEST2[1],RW_TEST2[2],"unique_combination",ok>0.5?"3 rows · 1 learner · 3 awards":"",ok,{h:RW_TEST2[3]}),{dy:16});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Fan-out ---------- */
const RW_E1=["every_version as (","    select awards.award_code, credit.learner_key, credit.credit_points_earned","    from credit","    inner join awards on awards.award_key = credit.award_key","),"];
const RW_E2=["version_at_census as (","    select awards.award_code, credit.learner_key, credit.credit_points_earned","    from credit","    inner join awards","        on awards.award_key = credit.award_key","        and {{ valid_at(census_date(), 'awards.valid_from', 'awards.valid_to') }}",")"];
// the rows a join returns: each learner meets the old name and the new one; fold (0..1) folds the doubles back
function rw_joined(ctx,x,y,w,t,o){const on=o.on,fold=o.fold||0,fo=clamp(fold*2.5,0,1),fp=ease(clamp((fold-0.4)/0.6,0,1)),lh=27,n=8+8*(1-fp),h=96+n*lh;let rows=0,cr=0;  // the doubles fade out first (fo), then the rows close up (fp)
  RW_FAN.forEach(([k,v],i)=>{rows+=(on[2*i]||0)+(on[2*i+1]||0)*(1-fo);cr+=v*((on[2*i]||0)+(on[2*i+1]||0)*(1-fo));});rows=Math.round(rows);cr=Math.round(cr);
  const bad=rows>8,col=bad?RW_AMB:fold>0.5?GOOD:[150,180,220];
  glass(ctx,x,y,w,h,14,mix([150,180,220],col,fold>0.5||bad?0.6:0),{glow:10,ea:0.65,fill:"rgba(6,10,20,0.95)"});
  T(ctx,fold<0.5?"joined on the key alone":"joined at the version valid on census day",x+20,y+32,{w:700,size:19,color:rgba(fold<0.5?SOFT:GOOD,1)});
  if(rows>0)T(ctx,rows+" rows · "+cr+" credit points",x+w-20,y+32,{w:800,size:20,align:"right",color:rgba(bad?RW_AMB:fold>0.5?GOOD:INK,1)});
  [["learner_key",0],["award version",250]].forEach(([s,dx])=>T(ctx,s,x+20+dx,y+70,{f:"mono",w:500,size:18,color:rgba(SOFT,0.9)}));T(ctx,"credit",x+w-20,y+70,{f:"mono",w:500,size:18,align:"right",color:rgba(SOFT,0.9)});
  ctx.fillStyle="rgba(170,200,245,0.16)";ctx.fillRect(x+14,y+82,w-28,1.2);
  RW_FAN.forEach(([k,v],i)=>[0,1].forEach(j=>{const r=2*i+j,q=on[r]||0;if(q<=0.01)return;const a=q*(j?1-fo:1),yi=lerp(r,i,fp),yy=y+96+yi*lh+lh*0.62;if(a<=0.01)return;
    withA(ctx,a,()=>{T(ctx,k,x+20,yy,{f:"mono",w:500,size:18,color:rgba(INK,0.95)});T(ctx,RW_GCHI[j][2],x+270,yy,{w:600,size:18,color:rgba(j?mix(KIND,INK,0.3):KIND,1)});T(ctx,String(v),x+w-20,yy,{f:"mono",w:500,size:18,align:"right",color:rgba(INK,0.95)});});}));
  return h;}
scene("fan",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,x:1100});
  const cJ=c("join"),cD=c("double"),cQ=c("quiet"),cF=c("fix"),fx=fin(t,w("fix","valid on census day")-0.2,0.6),fold=ease(fin(t,w("fix","eight rows")-0.3,0.9)),
    tFx=w("fix","valid on census day")-0.2,eOut=1-fin(t,tFx,0.4),eIn=fin(t,tFx+0.55,0.4),jf=ease(fin(t,tFx,0.9)),jp=ease(clamp((jf-0.4)/0.6,0,1));  // E1 leaves before E2 comes; the doubles fold away as the join changes
  // the award, renamed in July: two versions
  const split=fin(t,w("two","two versions")-0.2,0.8);
  // first large, in the middle of the frame; it settles into its corner as the join begins
  const big=1-ease(fin(t,cJ-1.7,1.0)),aS=lerp(1,1.45,big),aX=lerp(100,960-330*aS,big),aY=lerp(110,300,big);
  arrive(ctx,960,400,t,w("why","graduate certificate")-0.3,()=>{ctx.save();ctx.translate(aX,aY);ctx.scale(aS,aS);rw_award(ctx,0,0,660,{split,lit:[fx,0],dim:[0,fx]});
    withA(ctx,(1-split)*fin(t,w("why","changed its name"),0.4),()=>tag(ctx,330,-36,"renamed · 2 Jul 2026",RW_TIME,{align:"center",size:18}));ctx.restore();},{dy:20});
  // the credit Health's eight learners held at census
  const rOn=RW_FAN.map((_,i)=>fin(t,cJ-0.6+i*0.08,0.3));
  arrive(ctx,430,480,t,cJ-0.7,()=>rw_table(ctx,100,300,[["learner_key",300,"l"],["credit_points_earned",320,"r"]],RW_FAN.map(([k,v])=>[k,String(v)]),{on:rOn,title:"credit at census · Health",label:"8 learners · 185 points",lh:32}),{dy:20});
  // the join: every learner meets both versions, and the rows double
  const jOn=[];RW_FAN.forEach((_,i)=>{jOn.push(fin(t,w("join","every learner")+i*0.14,0.3));jOn.push(fin(t,w("double","become sixteen")+i*0.16,0.3));});
  const jy=lerp(360,392,clamp(jp*2.5,0,1)),eA=eOut;
  arrive(ctx,1330,220,t,cJ-0.2,()=>{rw_code(ctx,840,110,980,"analyses/design/fan_out_without_point_in_time.sql",RW_E1,{a:eA,p:clamp((t-cJ)/1.4,0,1),size:18,lh:28,lit:{3:fin(t,w("join","key alone"),0.4)*(1-fx)},litCol:RW_AMB});
    rw_code(ctx,840,110,980,"analyses/design/fan_out_without_point_in_time.sql",RW_E2,{a:eIn,size:18,lh:28,lit:{5:fin(t,w("fix","valid on census day"),0.5)},litCol:RW_TIME,seg:[[5,"valid_at(census_date()",fin(t,w("fix","valid on census day"),0.5),RW_TIME]]});},{dy:20});
  arrive(ctx,1330,600,t,w("join","every learner")-0.2,()=>rw_joined(ctx,840,jy,980,t,{on:jOn,fold:jf}),{dy:20});
  // threads from each learner to its rows, while they double
  const th=fin(t,w("join","every learner"),0.4)*(1-fin(t,cQ,0.8));if(th>0)RW_FAN.forEach((_,i)=>{const y0=300+44+56+i*32+16;[0,1].forEach(j=>{const q=jOn[2*i+j];if(q<=0)return;const y1=jy+96+(2*i+j)*27+14;
    ctx.strokeStyle=rgba(j?RW_AMB:KIND,0.45*th*q);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(762,y0);ctx.bezierCurveTo(800,y0,800,y1,lerp(762,838,q),y1);ctx.stroke();});});
  // nothing errors; only the grain test notices
  const red=fin(t,w("quiet","Only the test"),0.4)*(1-fold),green=fold,m=ease(fin(t,0,1.2)),T2=RW_TEST2,T3=RW_TEST3;
  const tx=lerp(T2[0],T3[0],m),ty=lerp(T2[1],T3[1],m),tw_=lerp(T2[2],T3[2],m),st=(1-m)*1-red+green;
  rw_test(ctx,tx,ty,tw_,"unique_combination",m<0.3?"3 rows · 1 learner · 3 awards":red>0.5?"16 rows · 8 learners":green>0.5?"8 rows · 8 learners":"",clamp(st,-1,1),{h:56});
  arrive(ctx,430,764,t,w("quiet","Nothing errors"),()=>withA(ctx,1-fin(t,cF,0.5),()=>tag(ctx,430,764,"no error · every row looks right",SOFT,{align:"center",size:20})),{dy:10});
  // what dbt show returns for the two joins
  arrive(ctx,1198,800,t,w("fix","eight rows")+0.3,()=>rw_table(ctx,840,722,[["joined_to",245,"l"],["rows_returned",160,"r"],["learners",110,"r"],["credit_points",160,"r"]],[["every version","16","8","370"],["the version at census","8","8","185"]],{size:18,lh:29,lit:{0:RW_AMB,1:GOOD},title:"dbt show · fan_out_without_point_in_time",titleMono:true}),{dy:16});
  // census day on the award's versions: a date line beside them lights the version valid then
  withA(ctx,fx*(1-big),()=>{const lx=792;ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(RW_TIME,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(lx,104);ctx.lineTo(lx,282);ctx.stroke();ctx.restore();
    ctx.strokeStyle=rgba(RW_TIME,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lx,147);ctx.lineTo(766,147);ctx.stroke();ctx.fillStyle=rgba(RW_TIME,1);ctx.beginPath();ctx.arc(lx,147,5,0,TAU);ctx.fill();
    T(ctx,"31 Mar 2026",lx,90,{f:"mono",w:500,size:18,align:"center",color:rgba(RW_TIME,1)});});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Every version kept ---------- */
const RW_DOC=["| Column | What it records |","|---|---|","| `_valid_from` | When ingestion recorded this version |","| `_valid_to` | When ingestion recorded the next version, or saw the row disappear. … |","| `_is_current` | `true` for the version that holds now |","| `_loaded_at` | When ingestion last wrote this row: … |","",
  "These dates record when the platform saw a change, not when it was true. Where a system says when","something was true (the student system's `effective_date` and `result_date`), the model uses that."];
const RW_Y4=["  - name: core_credit_towards_award","    …","      meta:","        grain: One row per learner per award per version","    …","    data_tests:","      - unique_combination:","          arguments:","            columns: [learner_key, award_key, valid_from]","      - versions_do_not_overlap:","          arguments:","            key_columns: [learner_key, award_key]"];
const RW_STAIR4=[200,260,860,440];
// when each of Aisha's six versions appears, as the voice counts them
function rw_stepT(sc,w){const a=w("aisha","Five points"),b=w("aisha","forty-five"),z=w("aisha","sixty");return[a,b-1.1,b-0.75,b-0.4,b,z];}
scene("versions",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cK=c("kept"),cSe=c("seen"),cA=c("aisha"),cC=c("core"),out1=1-fin(t,cA-0.2,0.7),saw=fin(t,w("seen","saw a change"),0.5),tru=fin(t,w("seen","when it was true"),0.5);
  // three sources, each keeping every version as stacked cards
  withA(ctx,out1,()=>{[200,370,540].forEach((y,k)=>{arrive(ctx,410,y+42,t,cK+0.2+k*0.35,()=>rw_srcStack(ctx,100,y,620,k,4,t,{p:clamp((t-w("kept","new row"))/0.9,0,1),cols:[fin(t,w("kept","date it started"),0.4)+saw,fin(t,w("kept","date it ended"),0.4),0,0]}),{dy:20});
      rw_eye(ctx,72,y+62,12,[150,190,255],saw);});
    arrive(ctx,100,700,t,w("seen","saw a change"),()=>tag(ctx,100,700,"_valid_from: when the platform saw it",[150,190,255],{size:20}),{dy:10});
    arrive(ctx,100,760,t,w("seen","model uses that"),()=>tag(ctx,100,760,"when it was true: the effective date wins",RW_TIME,{size:20}),{dy:10});
    arrive(ctx,1310,310,t,w("kept","Nothing is overwritten")-0.3,()=>rw_code(ctx,800,110,1020,"models/_shared/_shared__columns.md",RW_DOC,{wrap:88,hang:0,balance:true,size:18,lh:30,edge:KIND,p:clamp((t-w("kept","Nothing is overwritten"))/2.4,0,1),
      lit:{2:saw},litCol:[150,190,255],seg:[[7,"saw a change",saw,[150,190,255]],[7,"when it was true",tru,RW_TIME],[8,"`effective_date`",tru,RW_TIME],[8,"`result_date`",tru,RW_TIME]]}),{dy:24});
    rw_eye(ctx,780,244,12,[150,190,255],saw);rw_clock(ctx,780,454,13,RW_TIME,tru);});
  // the core builds its own versions: Aisha's credit as a staircase, and the rows it makes
  const ts=rw_stepT(sc,w),p=ts.reduce((s,x)=>s+fin(t,x,0.6),0),kinds=ts.map(x=>fin(t,x,0.3));
  arrive(ctx,630,480,t,cA-0.2,()=>{T(ctx,"Aisha · Graduate Certificate in Data Analytics",200,205,{w:800,size:26});tag(ctx,200,150,"built from dated facts",KIND,{size:20});
    rw_stair(ctx,...RW_STAIR4,t,{p,kinds});
    // the dated facts it builds from: a result (blue) or a credential (amber) drops in at its date; each becomes a step
    const[sx0,sy0,sw0,sh0]=RW_STAIR4,tb=w("aisha","builds");
    RW_STEPS.forEach(([f,,v,k],i)=>{const q=ease(fin(t,tb+i*0.22,0.5)),u=ease(fin(t,ts[i]-0.1,0.5));if(q<=0||u>=1)return;const x=sx0+sw0*rw_day(f)/365,y=lerp(lerp(sy0+sh0-120,sy0+sh0-46,q),sy0+sh0-sh0*v/60,u),cl=k==="result"?SRC3[0][1]:RW_KC;
      withA(ctx,q*(1-u),()=>{ctx.fillStyle="rgba(7,12,24,0.96)";rr(ctx,x-14,y-18,28,36,5);ctx.fill();ctx.strokeStyle=rgba(cl,1);ctx.lineWidth=2;rr(ctx,x-14,y-18,28,36,5);ctx.stroke();
        if(k==="result"){ctx.fillStyle=rgba(cl,0.8);for(let j=0;j<3;j++)ctx.fillRect(x-8,y-9+j*8,16,2.5);}else{ctx.fillStyle=rgba(cl,1);ctx.beginPath();ctx.arc(x,y-2,6,0,TAU);ctx.fill();ctx.fillRect(x-4,y+4,3,9);ctx.fillRect(x+1,y+4,3,9);}});});
    [["result · +15",SRC3[0][1]],["credential · +5",RW_KC]].forEach(([s,cl],i)=>{ctx.fillStyle=rgba(cl,1);ctx.beginPath();ctx.arc(236,300+i*32,6,0,TAU);ctx.fill();T(ctx,s,252,306+i*32,{w:600,size:18,color:rgba(SOFT,1)});});},{d:1.0,from:0.94});
  const vr=RW_STEPS.map(([f,to,v])=>[f,to,String(v)]);
  arrive(ctx,1460,316,t,cA+0.3,()=>rw_table(ctx,1120,160,[["valid_from",180,"l"],["valid_to",180,"l"],["credit_points_earned",280,"r"]],vr,{on:ts.map(x=>fin(t,x,0.4)),title:"core_credit_towards_award_v1 · Aisha, GCDA",titleMono:true,lh:32,edge:TRUST}),{dy:20});
  // the core's grain, and the test that no two versions overlap
  const lg=fin(t,w("core","one row per learner"),0.5),lo=fin(t,w("core","overlap")-0.3,0.5);
  arrive(ctx,1470,660,t,cC-0.3,()=>rw_code(ctx,1120,468,700,"models/core/student/_core_student__models.yml",RW_Y4,{p:clamp((t-cC)/1.4,0,1),size:18,lh:26,edge:TRUST,lit:{3:lg,9:lo,10:lo,11:lo},seg:[[3,"per version",lg,RW_TIME]]}),{dy:24});
  arrive(ctx,630,828,t,w("core","A test"),()=>rw_test(ctx,200,800,860,"versions_do_not_overlap",lo>0.5?"no two versions overlap":"",fin(t,w("core","overlap")+0.3,0.4),{h:56}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. As it was, as it is ---------- */
const RW_FACS=[["Arts and Education","2","0"],["Business","3","1"],["Engineering and IT","5","6"],["Health","2","2"]];
const RW_TIME5=["{#-","    True for the version that was valid on a date: valid_from is inclusive, valid_to exclusive,","    and a null valid_to means the version is still current. Used for every point-in-time join.","-#}",
  "{% macro valid_at(as_at, valid_from='valid_from', valid_to='valid_to') -%}","    ({{ valid_from }} <= {{ as_at }} and ({{ valid_to }} is null or {{ valid_to }} > {{ as_at }}))","{%- endmacro %}"];
const RW_MART5=["-- as it was: each entity's version on the census date","learners_at_census as (","    select * from learners","    where {{ valid_at(census_date()) }}","),","…","credit_at_census as (","    select * from credit","    where {{ valid_at(census_date()) }}","),"];
scene("was",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cC=c("census"),cTd=c("today"),cTo=c("totals"),cB=c("both"),cDc=c("declare"),m=ease(fin(t,0,1.3)),close=ease(fin(t,cTo-0.4,1.0)),dc=ease(fin(t,cDc-0.3,1.0)),sp=1-close;
  // the split: Planning on the left, as at census day; the wallet on the right, as at today
  withA(ctx,sp*fin(t,0.4,0.8),()=>{ctx.strokeStyle=rgba(SOFT,0.3);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(960,110);ctx.lineTo(960,840);ctx.stroke();});
  const L=[lerp(RW_STAIR4[0],120,m),lerp(RW_STAIR4[1],300,m),lerp(RW_STAIR4[2],740,m),lerp(RW_STAIR4[3],360,m)],atL=fin(t,w("census","census day"),0.6);
  withA(ctx,sp,()=>{rw_stair(ctx,...L,t,{at:"2026-03-31",atA:atL,upTo:atL>0.5?"2026-03-31":null,labels:true,size:19});
    arrive(ctx,1430,480,t,w("days","different days")-0.6,()=>rw_stair(ctx,1060,300,740,360,t,{at:"2026-09-30",atA:fin(t,w("today","about today"),0.6),size:19}),{from:0.92});
    arrive(ctx,560,160,t,w("census","thirty-first"),()=>rw_pin(ctx,560,160,"31 Mar 2026",1),{dy:12});
    arrive(ctx,1500,160,t,w("today","about today"),()=>rw_pin(ctx,1500,160,"30 Sep 2026 · today",1),{dy:12});
    arrive(ctx,490,764,t,w("census","forty-five"),()=>tag(ctx,490,764,"45 of 60 · 15 to go",RW_TIME,{align:"center",size:22}),{dy:12});
    arrive(ctx,490,826,t,w("census","She counts"),()=>{tag(ctx,476,826,"counted",GOOD,{align:"center",size:22});tick_(ctx,560,826,24,GOOD,1);},{dy:12});
    arrive(ctx,1430,780,t,w("today","finished in July"),()=>{glass(ctx,1060,710,740,140,18,RW_CON,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.96)"});T(ctx,"Aisha · completed",1090,752,{w:800,size:26});
      T(ctx,"5 credentials: 1 award · 3 microcredentials · 1 badge · 0 revoked",1090,789,{w:600,size:19,color:rgba(INK,0.9)});T(ctx,"not counted: she's there",1090,825,{w:700,size:19,color:rgba(SOFT,1)});},{dy:20});});
  // the two badges: at the top of each half, then beside the table, then over the code
  const bP=[[150,160],[250,430],[130,170]],bW=[[1090,160],[1670,430],[1010,170]],at=(P)=>[lerp(lerp(P[0][0],P[1][0],close),P[2][0],dc),lerp(lerp(P[0][1],P[1][1],close),P[2][1],dc)];
  const[px,py]=at(bP),[wx,wy]=at(bW),ga=fin(t,cB+0.4,0.6);
  arrive(ctx,150,160,t,0.3,()=>{rw_badge(ctx,px,py,40,"planning",null,{});withA(ctx,sp,()=>{T(ctx,"Planning",206,158,{w:800,size:22});T(ctx,"asks about census day",206,184,{w:600,size:18,color:rgba(SOFT,1)});});},{dy:16});
  arrive(ctx,1090,160,t,w("days","two consumers"),()=>{rw_badge(ctx,wx,wy,40,"wallet",null,{});withA(ctx,sp,()=>{T(ctx,"Wallet app",1146,158,{w:800,size:22});T(ctx,"asks about today",1146,184,{w:600,size:18,color:rgba(SOFT,1)});});},{dy:16});
  withA(ctx,close*(1-dc),()=>{T(ctx,"Planning",px,py+74,{w:800,size:22,align:"center"});T(ctx,"Wallet app",wx,wy+74,{w:800,size:22,align:"center"});
    withA(ctx,ga,()=>{wrapT(ctx,"One row per learner per award, as at census date",px,py+110,330,{w:700,size:20,align:"center",color:rgba(RW_TIME,1)});wrapT(ctx,"One row per learner, as it is now",wx,wy+110,330,{w:700,size:20,align:"center",color:rgba(RW_TIME,1)});});});
  withA(ctx,dc,()=>{T(ctx,"Planning",186,160,{w:800,size:22});T(ctx,"One row per learner per award, as at census date",186,190,{w:600,size:19,color:rgba(RW_TIME,1)});
    T(ctx,"Wallet app",1066,160,{w:800,size:22});T(ctx,"One row per learner, as it is now",1066,190,{w:600,size:19,color:rgba(RW_TIME,1)});});
  // the same question, asked about two days: faculty by faculty
  withA(ctx,close*(1-dc),()=>{const tq=w("totals","Ask Planning's question");
    arrive(ctx,960,155,t,tq-0.3,()=>{glass(ctx,360,110,1200,90,20,RW_CON,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,"learners within 15 points of a graduate certificate, by faculty",960,166,{w:700,size:28,align:"center"});},{dy:16});
    arrive(ctx,960,450,t,tq,()=>{const lit=fin(t,cB,0.5);glass(ctx,560,230,800,440,18,[150,180,220],{glow:10,ea:0.6,fill:"rgba(6,10,20,0.95)"});
      [[1080,"as at census","31 Mar 2026",tq+0.6],[1260,"now","30 Sep 2026",w("totals","Ask it today")]].forEach(([x,h1,h2,t0],j)=>{if(lit>0)withA(ctx,lit,()=>{glow(ctx,x,450,160,j?RW_CON:RW_TIME,0.12);ctx.fillStyle=rgba(j?RW_CON:RW_TIME,0.07);rr(ctx,x-80,244,160,412,12);ctx.fill();});
        T(ctx,h1,x,270,{w:700,size:20,align:"center",color:rgba(j?RW_CON:RW_TIME,1)});T(ctx,h2,x,298,{f:"mono",w:500,size:18,align:"center",color:rgba(SOFT,1)});
        RW_FACS.forEach((r,i)=>withA(ctx,fin(t,t0+0.3+i*0.3,0.3),()=>T(ctx,r[1+j],x,370+i*58,{f:"mono",w:500,size:30,align:"center"})));
        withA(ctx,fin(t,w("totals",j?"nine":"twelve")-0.1,0.3),()=>T(ctx,j?"9":"12",x,640,{w:800,size:44,align:"center",color:rgba(j?RW_CON:RW_TIME,1)}));});
      T(ctx,"faculty",600,284,{w:700,size:20,color:rgba(SOFT,1)});RW_FACS.forEach((r,i)=>withA(ctx,fin(t,tq+0.6+0.3+i*0.3,0.3),()=>T(ctx,r[0],600,370+i*58,{w:700,size:24})));
      ctx.fillStyle="rgba(170,200,245,0.25)";ctx.fillRect(590,586,750,1.5);T(ctx,"in all",600,640,{w:700,size:22,color:rgba(SOFT,1)});},{dy:20});
    arrive(ctx,960,712,t,w("both","Both are right"),()=>tag(ctx,960,712,"the same question · two days · both right",INK,{align:"center",size:22}),{dy:12});});
  // each output declares its day; one macro picks the version valid on it
  const lm=fin(t,w("declare","one small macro"),0.5);
  arrive(ctx,540,480,t,w("declare","one small macro")-0.3,()=>rw_code(ctx,100,300,880,"macros/shared/time.sql",RW_TIME5,{wrap:76,size:18,lh:28,p:clamp((t-w("declare","one small macro"))/1.4,0,1),edge:RW_TIME,
    seg:[[1,"valid_from is inclusive",lm,RW_TIME],[1,"valid_to exclusive",lm,RW_TIME],[4,"valid_at",lm,RW_TIME]]}),{dy:24});
  arrive(ctx,1415,490,t,w("declare","one small macro")+0.3,()=>rw_code(ctx,1010,300,810,"models/marts/planning/mart_planning__near_award.sql",RW_MART5,{size:18,lh:28,p:clamp((t-w("declare","one small macro")-0.5)/1.4,0,1),edge:LAYER4[3][1],lit:{3:lm,8:lm},litCol:RW_TIME}),{dy:24});
  const tD=w("declare","valid on it")+0.2;
  arrive(ctx,960,770,t,tD,()=>{rw_code(ctx,100,716,1720,"models/marts/{planning,wallet}/_*__decisions.yml",["    text: Planning's mart is as it was at census, dated by when things took effect.","    text: The wallet's marts are as they are now."],{size:18,lh:28,edge:TRUST,p:clamp((t-tD)/1.0,0,1)});kt_gtick(ctx,1806,716,16,fin(t,tD+1.0,0.4));},{dy:16});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. One timeline ---------- */
const RW_TLC=["-- every date on which any source changed","change_dates as (","    select learner_key, valid_from as changed_on from versions","    union","    select learner_key, valid_to from versions where valid_to is not null","),","…",
  "-- one value per attribute: the student system first, then the learning platform, then short courses","resolved as (","    select","        …","        coalesce(student_email, platform_email, customer_email) as email,"];
// which source holds a value in each segment of the stitched timeline (blue, green, pink), and which one wins
const RW_SEG=[[[0,1,0],1],[[1,1,0],0],[[1,1,1],0],[[1,1,1],0]],RW_SEGV=["studying","studying · enrolled","no change","completed"];
scene("stitch",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,x:700});
  const cT=c("three"),cDt=c("dates"),cCu=c("cut"),cW=c("wins"),cSa=c("same"),YB=[320,420,520],YW=680,mg0=()=>ease(fin(t,w("same","makes no new version"),0.9));
  // the dates on a shared axis (schematic: two of them are six days apart)
  withA(ctx,fin(t,0.3,0.6),()=>{ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(RW_TLX[0],250);ctx.lineTo(RW_TLX[1],250);ctx.stroke();T(ctx,"dates not to scale",RW_TLX[1],200,{w:600,size:18,align:"right",color:rgba(SOFT,0.85)});});
  const dT=[w("dates","platform account"),w("dates","student record"),w("dates","short-course"),w("cut","every date")+0.75];
  RW_TL.forEach(([d,x],i)=>arrive(ctx,x,236,t,dT[i]-0.1,()=>T(ctx,d,x,236,{f:"mono",w:500,size:18,align:"center",color:rgba(INK,0.95)}),{dy:8}));
  // three systems, each with its own versions
  [["student system",0],["learning platform",1],["short-course platform",2]].forEach(([n,k],i)=>arrive(ctx,100,YB[i],t,cT+0.2+i*0.25,()=>T(ctx,n,100,YB[i]+7,{w:700,size:20,color:rgba(SRC3[k][1],1)}),{dy:10}));
  withA(ctx,1-fin(t,cCu-0.9,0.6),()=>[0,1,2].forEach(k=>arrive(ctx,1470,312+k*120,t,cT+0.3+k*0.3,()=>rw_srcStack(ctx,1190,270+k*120,560,k,3,t,{p:clamp((t-cT-0.6-k*0.3)/0.8,0,1)}),{dy:16})));
  // cut at every change date: drawn under the bands, and gapped where a label sits (the tag; the merged segment once 6 Jan folds away)
  const tgA=fin(t,w("same","makes no new version"),0.4);
  RW_TL.forEach(([d,x],i)=>{const q=ease(fin(t,w("cut","every date")+i*0.25,0.6));if(q<=0)return;const ye=lerp(256,YW+30,q);
    const gaps=[];if(x>660&&x<940)gaps.push([576,624,tgA]);if(i===2)gaps.push([YW-30,YW+30,mg0()]);
    ctx.save();ctx.setLineDash([7,7]);ctx.lineWidth=2;let y0=256;const seg=(ya,yb,al)=>{if(yb<=ya||al<=0.01)return;ctx.strokeStyle=rgba(INK,0.6*al);ctx.beginPath();ctx.moveTo(x,ya);ctx.lineTo(x,yb);ctx.stroke();};
    gaps.forEach(([ga,gb,ka])=>{seg(y0,Math.min(ga,ye),1);seg(Math.max(ga,y0),Math.min(gb,ye),1-ka);y0=Math.max(y0,gb);});seg(y0,ye,1);ctx.restore();});
  rw_band(ctx,YB[0],0,[[480,"ENR",590],[900,"CMP"]],fin(t,dT[1],1.2),fin(t,dT[1],0.3));
  rw_band(ctx,YB[1],1,[[340,"active",590]],fin(t,dT[0],1.4),fin(t,dT[0],0.3));
  rw_band(ctx,YB[2],2,[[700,"1",800]],fin(t,dT[2],1.0),fin(t,dT[2],0.3));
  // one timeline, stitched segment by segment; the segment of 6 Jan changes nothing the model holds, and merges back
  const mg=ease(fin(t,w("same","makes no new version"),0.9));
  arrive(ctx,100,YW,t,w("cut","stitches")-0.2,()=>T(ctx,"one timeline",100,YW+7,{w:700,size:20}),{dy:10});
  const bx=[RW_TL[0][1],RW_TL[1][1],RW_TL[2][1],RW_TL[3][1],RW_TLX[1]];
  for(let k=0;k<4;k++){const t0=w("cut","stitches")+k*0.35,q=fin(t,t0,0.5);if(q<=0)continue;const x0=bx[k],xe=k===1?lerp(bx[2],bx[3],mg):bx[k+1],x1=Math.max(x0+26,lerp(x0,xe,ease(q)));if(k===2&&mg>0.98)continue;
    ctx.fillStyle="rgba(236,243,255,0.16)";rr(ctx,x0+2,YW-28,x1-x0-4,56,10);ctx.fill();ctx.strokeStyle=rgba(INK,k===2?0.9*(1-mg):0.9);ctx.lineWidth=2;rr(ctx,x0+2,YW-28,x1-x0-4,56,10);ctx.stroke();
    // which source's value wins here: a small stack under the segment
    const[has,win]=RW_SEG[k],cx=(x0+bx[k+1])/2,wa=fin(t,w("wins","wins")+k*0.15,0.4);
    withA(ctx,q*wa*(k===2?1-mg:1),()=>[0,1,2].forEach(j=>{const yy=YW+44+j*14,cl=SRC3[j][1],on=j===win?1:has[j]?0.35:0;ctx.strokeStyle=rgba(cl,0.6);ctx.lineWidth=1.2;rr(ctx,cx-22,yy,44,10,3);ctx.stroke();if(on>0){ctx.fillStyle=rgba(cl,on);rr(ctx,cx-22,yy,44,10,3);ctx.fill();}}));}
  // the segments' values, with the merged one folding into the version before it
  const vA=k=>fin(t,w("cut","stitches")+k*0.35+0.4,0.4);
  withA(ctx,vA(0),()=>T(ctx,"① studying",(bx[0]+bx[1])/2,YW+7,{w:700,size:19,align:"center"}));
  withA(ctx,vA(1)*(1-mg),()=>T(ctx,"② studying · enrolled",(bx[1]+bx[2])/2,YW+7,{w:700,size:19,align:"center"}));
  withA(ctx,vA(2)*(1-mg),()=>T(ctx,"no change",(bx[2]+bx[3])/2,YW+7,{w:600,size:19,align:"center",color:rgba(SOFT,1)}));
  withA(ctx,mg,()=>T(ctx,"② studying · enrolled",(bx[1]+bx[2])/2,YW+7,{w:700,size:19,align:"center"}));
  withA(ctx,vA(3),()=>T(ctx,"③ completed",(bx[3]+bx[4])/2,YW+7,{w:700,size:19,align:"center"}));
  arrive(ctx,800,600,t,w("same","makes no new version"),()=>tag(ctx,800,600,"no change, no version",SOFT,{align:"center",size:20}),{dy:10});
  arrive(ctx,690,812,t,w("same","Four dates"),()=>tag(ctx,690,812,"four dates → three versions",INK,{align:"center",size:22}),{dy:12});
  // Jun, who stitches it
  arrive(ctx,190,790,t,w("cut","Jun")-0.2,()=>{rw_face(ctx,"jun",190,790,40,1,{t});T(ctx,"Jun",190,860,{w:800,size:22,align:"center"});},{dy:14});
  // the code: the change dates, then one value per attribute, the student system first
  const lC=fin(t,w("cut","every date"),0.5),lW=fin(t,w("wins","student system's"),0.5);
  arrive(ctx,1485,380,t,cCu-0.2,()=>rw_code(ctx,1150,110,670,"models/intermediate/student/int_learner_timeline.sql",RW_TLC,{wrap:56,size:18,lh:28,edge:LAYER4[1][1],p:clamp((t-cCu)/2.0,0,1),lit:{1:lC,2:lC,4:lC,11:lW},seg:[[11,"student_email",lW,SRC3[0][1]],[11,"platform_email",lW,SRC3[1][1]],[11,"customer_email",lW,SRC3[2][1]]]}),{dy:24});
  [["1  student system",0,"wins"],["2  learning platform",1,"then the platform's"],["3  short courses",2,"short course's"]].forEach(([s,k,wd],i)=>arrive(ctx,1160,760+i*40,t,w("wins",wd)-0.1,()=>{ctx.fillStyle=rgba(SRC3[k][1],1);rr(ctx,1160,746+i*40,30,12,3);ctx.fill();T(ctx,s,1204,758+i*40,{w:700,size:20});},{dy:8}));
  arrive(ctx,1160,712,t,w("wins","On each date"),()=>T(ctx,"on each date, a value comes from",1160,716,{w:600,size:18,color:rgba(SOFT,1)}),{dy:8});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Late news ---------- */
const RW_PROF=["select","    *,","    {{ dbt.datediff('took_effect', 'recorded_on', 'day') }} as days_late","from versions","where {{ dbt.datediff('took_effect', 'recorded_on', 'day') }} > 1","order by days_late desc"];
const RW_RULE=["-- the student system says when each version took effect: that date, not the date it was recorded","student_versions as (","    select","        …","        student_records.effective_date as valid_from,","        …","        student_records.recorded_from as recorded_at,"];
const RW_GAP=["          - id: LIM-STU-07","            text: >","              Platform dates are the day the platform recorded a change, not the day it happened.","              Only the student system says when a change took effect."];  // the gap, accepted: a known limitation on core_learner
function rw_lx(d){return 140+d*54;}  // days after 20 March, on the axis
scene("late",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,x:700});
  const cPr=c("priya"),cWk=c("week"),cRe=c("recorded"),cEf=c("effect"),cG=c("gap"),AY=360,dm=ease(fin(t,w("effect","took effect")-0.2,1.1)),rule=fin(t,w("effect","took effect"),0.7),
    tRu=w("effect","took effect"),rOut=1-fin(t,tRu,0.3),rIn=fin(t,tRu+0.35,0.4),dO=1-clamp(dm*2.2,0,1),dI=clamp(dm*2.2-1.2,0,1);  // swaps in sequence: the old leaves before the new comes
  // Priya's row: keys only
  arrive(ctx,600,150,t,cPr,()=>{glass(ctx,100,110,1000,80,18,SRC3[0][1],{glow:12,ea:0.8,fill:"rgba(7,12,24,0.96)"});T(ctx,"SIS|S-20431",124,158,{f:"mono",w:500,size:20,color:rgba(SRC3[0][1],1)});
    T(ctx,"Graduate Certificate in Business Administration",290,158,{w:700,size:20});T(ctx,"45 of 60",1080,158,{f:"mono",w:500,size:20,align:"right",color:rgba(RW_TIME,1)});tag(ctx,1060,110,"Priya",INK,{align:"center",size:18});},{dy:20});
  // the days around census, and the census line
  withA(ctx,fin(t,cPr+0.6,0.8),()=>{ctx.strokeStyle=rgba(SOFT,0.5);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(rw_lx(0),AY);ctx.lineTo(rw_lx(17),AY);ctx.stroke();
    for(let d=0;d<=17;d++){ctx.beginPath();ctx.moveTo(rw_lx(d),AY-5);ctx.lineTo(rw_lx(d),AY+5);ctx.stroke();}
    [[0,"20 Mar"],[7,"27 Mar"],[14,"3 Apr"]].forEach(([d,s])=>T(ctx,s,rw_lx(d),AY+34,{f:"mono",w:500,size:18,align:"center",color:rgba(SOFT,1)}));});
  const xc=rw_lx(11);withA(ctx,fin(t,w("priya","before census"),0.6),()=>{ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(RW_TIME,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(xc,246);ctx.lineTo(xc,450);ctx.stroke();ctx.restore();tag(ctx,xc,222,"census · 31 Mar",RW_TIME,{align:"center",size:18});});
  // Priya's status along the days: studying until the withdrawal is dated, withdrawn after it
  const tA=w("week","recorded it")-0.3,inn=ease(fin(t,tA,0.9)),xd=lerp(rw_lx(17),lerp(rw_lx(14),rw_lx(7),dm),inn),stA=fin(t,cPr+1.4,0.6),onA=fin(t,cRe-0.2,0.6);
  withA(ctx,stA,()=>{ctx.fillStyle=rgba(SRC3[0][1],0.35);rr(ctx,rw_lx(0),410,xd-rw_lx(0),30,6);ctx.fill();if(rw_lx(17)-xd>4){ctx.fillStyle=rgba(SOFT,0.2);rr(ctx,xd,410,rw_lx(17)-xd,30,6);ctx.fill();}
    T(ctx,"studying",rw_lx(0)+12,432,{w:700,size:18,color:rgba(INK,0.9)});if(rw_lx(17)-xd>150)T(ctx,"withdrawn",rw_lx(17)-12,432,{w:700,size:18,align:"right",color:rgba(SOFT,1)});
    withA(ctx,onA,()=>{withA(ctx,dO,()=>tag(ctx,xc,482,"on census day: studying · 15 to go",RW_AMB,{align:"center",size:20}));withA(ctx,dI,()=>tag(ctx,xc,482,"on census day: withdrawn",GOOD,{align:"center",size:20}));});});
  // the withdrawal arrives late, from the side, and lands where it was recorded; then it moves to when it took effect
  const cx=lerp(980,lerp(rw_lx(14),rw_lx(7),dm),inn),cy=298;
  if(t>tA){withA(ctx,fin(t,tA,0.3),()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate((1-inn)*0.08);
    glass(ctx,-140,-46,280,92,14,EDGE_,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.97)"});T(ctx,"WD · took effect 27 Mar",0,-8,{w:700,size:20,align:"center"});
    ctx.fillStyle=rgba(EDGE_,0.35);ctx.fillRect(-120,6,240,1.2);T(ctx,"recorded 3 Apr",0,32,{w:700,size:18,align:"center",color:rgba(EDGE_,1)});
    ctx.restore();ctx.strokeStyle=rgba(EDGE_,0.7*inn);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy+46);ctx.lineTo(cx,AY);ctx.stroke();ctx.fillStyle=rgba(EDGE_,inn);ctx.beginPath();ctx.arc(cx,AY,5,0,TAU);ctx.fill();});}
  arrive(ctx,rw_lx(10.5),AY-60,t,w("week","a week late"),()=>withA(ctx,1-clamp(dm*4,0,1),()=>tag(ctx,rw_lx(10.5)-160,AY-50,"7 days late",EDGE_,{align:"center",size:18})),{dy:8});
  // Business: our count against the census report
  const tB=w("recorded","Business would count"),tR=w("recorded","census report says");
  arrive(ctx,560,585,t,tB-0.2,()=>{[[160,"Business · our count",tB],[640,"Business · census report",tR]].forEach(([x,s,t0],i)=>withA(ctx,fin(t,t0-0.2,0.5),()=>{const col=i?SOFT:mix(RW_AMB,GOOD,dm);
      glass(ctx,x,530,320,110,16,col,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.95)"});T(ctx,s,x+20,562,{w:700,size:18,color:rgba(SOFT,1)});
      if(i)T(ctx,"3",x+160,624,{w:800,size:50,align:"center"});else{withA(ctx,dO,()=>T(ctx,"4",x+160,624,{w:800,size:50,align:"center",color:rgba(RW_AMB,1)}));withA(ctx,dI,()=>T(ctx,"3",x+160,624,{w:800,size:50,align:"center",color:rgba(GOOD,1)}));}}));
    cross_(ctx,560,588,30,RW_RED,fin(t,tR+0.3,0.3)*dO);tick_(ctx,560,588,34,GOOD,dI);
    withA(ctx,fin(t,tB,0.4),()=>{T(ctx,dm<0.5?"dated by when it was recorded":"dated by when it took effect",560,672,{w:700,size:20,align:"center",color:rgba(dm<0.5?RW_AMB:GOOD,1)});});},{dy:16});
  // the evidence, then the rule
  arrive(ctx,1480,280,t,w("week","recorded it")+0.2,()=>{rw_code(ctx,1140,110,680,"analyses/profiling/profile_late_changes.sql",RW_PROF,{a:rOut,wrap:58,size:18,lh:28,p:clamp((t-w("week","recorded it")-0.2)/1.4,0,1)});
    rw_table(ctx,1140,460,[["student_id",125,"l"],["status_code",130,"l"],["took_effect",140,"l"],["recorded_on",140,"l"],["days_late",105,"r"]],[["S-20431","WD","2026-03-27","2026-04-03","7"]],{a:fin(t,w("week","a week late"),0.4)*rOut,size:18,lh:32});
    rw_code(ctx,1140,110,680,"models/intermediate/student/int_learner_timeline.sql",RW_RULE,{a:rIn,wrap:58,size:18,lh:28,edge:LAYER4[1][1],lit:{4:fin(t,w("effect","describes the day"),0.5),6:fin(t,w("effect","written down"),0.5)},litCol:RW_TIME});},{dy:24});
  arrive(ctx,1480,476,t,w("effect","written down"),()=>tag(ctx,1480,476,"when it was true · when it was recorded: both kept",RW_TIME,{align:"center",size:18}),{dy:10});
  // as in 1890: the page of June 1, for a moment
  const fl=pulseAt(t,w("effect","As in")-0.2,2.6);if(fl>0)rw_calendar(ctx,1400,560,190,220,t,{a:0.9*fl});
  // gap 6, written down
  const tG=w("gap","platforms")-0.3;arrive(ctx,1480,680,t,tG,()=>rw_code(ctx,1040,530,780,"models/core/student/_core_student__models.yml",RW_GAP,{wrap:66,size:18,lh:28,edge:EDGE_,p:clamp((t-tG)/2.2,0,1),seg:[[2,"Platform dates are the day the platform",fin(t,w("gap","accepted"),0.5),TRUST],[3,"Only the student system",fin(t,w("gap","accepted"),0.5),TRUST]]}),{dy:20});
  arrive(ctx,1480,822,t,w("gap","accepted"),()=>{tag(ctx,1430,822,"accepted, and written down: a known limitation",TRUST,{align:"center",size:20});},{dy:10});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. A promise to write ---------- */
scene("next",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cW=c("what"),cP=c("promise"),lp=fin(t,w("promise","write down"),0.6);
  arrive(ctx,190,124,t,0.3,()=>{rw_loop(ctx,190,124,108,58,t,STEPS10.map((_,i)=>i===2?1:(i===3||i===4)?lp:0),1);tag(ctx,332,124,lp>0.5?"next · steps 4 and 5":"step 3",WEED,{size:20});},{from:0.85});
  // the core, with its versions stacked behind it
  arrive(ctx,960,610,t,0.4,()=>{for(let v=3;v>0;v--){withA(ctx,0.5,()=>{ctx.fillStyle="rgba(10,14,24,0.95)";rr(ctx,760+v*12,560-v*12,400,110,14);ctx.fill();ctx.strokeStyle=rgba(TRUST,0.35);ctx.lineWidth=1.5;rr(ctx,760+v*12,560-v*12,400,110,14);ctx.stroke();});}
    glow(ctx,960,615,260,TRUST,0.15);glass(ctx,760,560,400,110,14,TRUST,{glow:18,ea:0.85,fill:"rgba(7,12,24,0.97)"});T(ctx,"core",960,606,{w:800,size:32,align:"center",color:rgba(TRUST,1)});T(ctx,"every version kept",960,644,{w:600,size:20,align:"center",color:rgba(SOFT,1)});},{d:1.0,from:0.9});
  // two consumers, each with its grain and its day; below, the contract still to write
  [[260,"planning","Planning","as it was · one row per learner per award",cW+0.4],[1040,"wallet","Wallet app","as it is · one row per learner",cW+0.8]].forEach(([x,k,n,g,t0])=>{
    arrowTo(ctx,960,556,x+310,446,RW_CON,0.7*fin(t,t0,0.6),{p:fin(t,t0,0.8),head:12});
    arrive(ctx,x+310,330,t,t0,()=>{glass(ctx,x,220,620,220,18,RW_CON,{glow:12+10*lp,ea:0.8,fill:"rgba(7,12,24,0.96)"});rw_badge(ctx,x+60,270,30,k,null,{});T(ctx,n,x+108,262,{w:800,size:26});T(ctx,g,x+108,294,{w:600,size:20,color:rgba(RW_TIME,1)});
      ctx.save();ctx.setLineDash([6,8]);ctx.strokeStyle=rgba(SOFT,0.35+0.4*lp);ctx.lineWidth=1.5;[350,392].forEach(y=>{ctx.beginPath();ctx.moveTo(x+30,y);ctx.lineTo(x+590,y);ctx.stroke();});ctx.restore();
      withA(ctx,lp,()=>T(ctx,"what it's promised: to be written",x+30,338,{w:600,size:18,color:rgba(SOFT,1)}));},{dy:20});});
  arrive(ctx,960,760,t,w("what","Declared"),()=>tag(ctx,960,760,"one row of what · and when · declared · tested",WEED,{align:"center",size:22}),{dy:10});
  arrive(ctx,960,822,t,w("promise","one core"),()=>tag(ctx,960,822,"two consumers · one core",RW_CON,{align:"center",size:22}),{dy:10});
  ctx.restore();weedsEnd(ctx,S,t,B,"One row of what, and when",WEED,"Say what one row is, and which day it describes, before any SQL.");
  fadeIn(ctx,S,t,0.01);vign(ctx,S);});
