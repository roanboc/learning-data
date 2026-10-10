/* ===== Who does it, and where meaning changes: scenes =====
   Ten chapters, as in ../script.md. Japan's two frequencies: Tokyo's generators at fifty cycles and Osaka's at sixty, the grids that
   meet at a line, and in 2011 power piling up in the west with only a thin stream crossing through the converters; then a name on each
   step of the night on Hill Street, crossed out for roles, with actors assigned to them; the utility's teams, a partner and its
   contract; the AI agent, its triage and its rights; two answers to "how many customers?"; the wall between the network and retail;
   the two domains, each with its customers, capabilities and words; the one-definition trap, and the translation at the edge instead;
   where that translation fails; and the roles, the edge and the agent's rights confirmed.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera moves in on Japan's line in chapter 1,
   then pulls back. Motion (In the weeds of data crafting's helpers): every shot drifts slowly and things arrive with a spring. Sound:
   every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. Two frequencies ---------- */
scene("two",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tT=c("tokyo"),tO=c("osaka"),tG=c("grow"),tQ=c("quake"),tC=c("convert"),tK=c("costly"),tE=c("edge");
  setScreen(ctx,S);ctx.save();drift(ctx,t,sc,{z:0.02,y:600});
  const K=[[0,960,560,1],[tQ+1.2,1000,690,1.9],[tK,990,640,1.45],[B-0.4,960,560,1]];focus(ctx,t,K,1.8);
  d6_japan(ctx,t,{land:fin(t,0.2,1.2),tokyo:fin(t,w("tokyo","Tokyo")-0.2,0.5),osaka:fin(t,w("osaka","Osaka")-0.2,0.5),east:fin(t,w("tokyo","fifty"),0.8),west:fin(t,w("osaka","sixty"),0.8),
    ge:clamp((t-w("grow","grids"))/3.0,0,1),gw:clamp((t-w("grow","grids"))/3.0,0,1),lines:clamp((t-w("grow","meet"))/1.4,0,1),lineHi:pulseAt(t,w("grow","can't"),1.4)+fin(t,tE,0.6),
    plants:fin(t,tQ-0.2,0.6),out:clamp((t-w("quake","loses"))/1.6,0,1),flow:fin(t,w("quake","west has"),0.8),conv:fin(t,w("convert","converter")-0.2,0.6),cross:fin(t,w("convert","about one"),0.6),
    hz:fin(t,w("grow","can't")-0.3,0.6),roll:fin(t,w("convert","Around Tokyo"),0.5)*(1-fin(t,tK+0.5,0.6)),more:fin(t,w("costly","more converters")-0.1,0.6)});
  ctx.restore();
  eaYear(ctx,90,90,t<tQ-0.4?"1890s · Japan":"March 2011 · Japan",CLAY,fin(t,0.3,0.6)*(t<tQ-0.4?1-fin(t,tQ-0.9,0.4):fin(t,tQ-0.4,0.4)));
  // the two generators, each with its wave
  const gOut=1-fin(t,tG+0.8,0.6);
  d6_genPanel(ctx,1270,520,D6_E50,"Tokyo · from Germany",5,"50 cycles a second",t,clamp((t-w("tokyo","fifty"))/0.8,0,1),fin(t,w("tokyo","Germany")-0.3,0.6)*gOut);
  d6_genPanel(ctx,60,170,D6_W60,"Osaka · from America",6,"60 cycles a second",t,clamp((t-w("osaka","sixty"))/0.8,0,1),fin(t,w("osaka","American")-0.3,0.6)*gOut);
  arrive(ctx,960,160,t,w("grow","can't"),()=>withA(ctx,1-fin(t,tQ-0.5,0.4),()=>tag(ctx,960,160,"both called power · they can't simply be joined",PARCH,{align:"center",size:32})),{dy:10});
  // 2011: the east short, the west with power to spare, and the converters between
  arrive(ctx,1500,300,t,w("quake","loses"),()=>withA(ctx,1-fin(t,tC-0.3,0.4),()=>tag(ctx,1500,300,"east: power stations offline",D6_E50,{align:"center",size:30})),{dy:10});
  arrive(ctx,420,300,t,w("quake","west has"),()=>withA(ctx,1-fin(t,tC-0.3,0.4),()=>tag(ctx,420,300,"west: power to spare",D6_W60,{align:"center",size:30})),{dy:10});
  d6_convPanel(ctx,60,140,t,fin(t,w("convert","converter")-0.2,0.6)*(1-fin(t,w("convert","Around Tokyo")-0.2,0.5)));
  arrive(ctx,1500,300,t,w("convert","about one"),()=>withA(ctx,1-fin(t,tK-0.3,0.4),()=>tag(ctx,1500,300,"through the converters: about 1 GW",[220,230,255],{align:"center",size:30})),{dy:10});
  arrive(ctx,1500,372,t,w("convert","Around Tokyo"),()=>withA(ctx,1-fin(t,tK-0.3,0.4),()=>tag(ctx,1500,372,"around Tokyo: power cut in turns",D6_RED,{align:"center",size:30})),{dy:10});
  arrive(ctx,960,160,t,w("costly","far too"),()=>withA(ctx,1-fin(t,tE-0.3,0.4),()=>tag(ctx,960,160,"one side made to match: far too costly",PARCH,{align:"center",size:30})),{dy:10});
  arrive(ctx,960,232,t,w("costly","more converters"),()=>withA(ctx,1-fin(t,tE-0.3,0.4),()=>tag(ctx,960,232,"so: more converters",[220,230,255],{align:"center",size:30})),{dy:10});
  arrive(ctx,960,160,t,w("edge","same word"),()=>tag(ctx,960,160,"one word, a different meaning on each side",PARCH,{align:"center",size:32}),{dy:10});
  arrive(ctx,960,232,t,w("edge","translated"),()=>tag(ctx,960,232,"translated at the edge, where it can fail",[220,230,255],{align:"center",size:30}),{dy:10});
  fadeIn(ctx,S,t);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"Who does it, and where meaning changes","roles, actors, and the edges between domains",EAC,"Film 6 of 11 · enterprise architecture, for data");});

/* ---------- 2. A name on each step ---------- */
const D6_STEPS=["take the call","find the fault","decide who goes first","send the crew","repair","switch back on","confirm"];
const D6_NAMES=["Priya","Sam","Sam","Ben's crew","Ben's crew","Sam","Priya"];
// the steps each role does, as runs of steps under a bracket: [first step, last step, role]
const D6_RUNS=[[0,0,0,0],[1,2,1,0],[3,4,2,0],[5,5,1,1],[6,6,0,0]],D6_RN=["call-taker","duty controller","crew leader"];
// the roles, and the actor who filled each that night
const D6_ROLES=[["call-taker",320,"Priya"],["duty controller",880,"Sam"],["crew leader",1440,"Ben's crew"]];
const d6_sx=i=>270+i*222;
scene("names",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tN=c("night"),tGr=w("grace","Grace"),tX=w("grace","crosses"),tW=w("grace","Next week"),tR=c("role"),tA=c("actor"),nt=fin(t,tN-0.4,0.7);
  // the note, large, then up into the corner
  const u=ease(nt);arrive(ctx,960,420,t,0.3,()=>{ctx.save();ctx.translate(lerp(960,1560,u),lerp(420,140,u));ctx.scale(lerp(1,0.62,u),lerp(1,0.62,u));sticky(ctx,0,0,760,220,"Who does it, and where does meaning change?",{col:NOTEC[0],size:46,st:0,rot:-0.02});ctx.restore();},{dy:-30});
  withA(ctx,1-fin(t,tN+0.6,0.6),()=>person(ctx,"tomas",300,1030,0.8,{t,pose:t<c("note")+2.2?"explain":"stand"}));
  // the night's steps, each with a name pencilled under it, then struck out
  const up=ease(fin(t,tR-0.5,0.9)),sy=lerp(380,300,up);
  D6_STEPS.forEach((s_,i)=>{const t0=tN+0.1+i*0.16,x=d6_sx(i);arrive(ctx,x,sy,t,t0,()=>d6_step(ctx,x,sy,204,118,s_,{size:28,rot:(hash(i,640)-0.5)*0.04}),{dy:-14});
    const nameT=i===0?w("night","Priya"):i===2?w("night","Sam"):w("night","writes")+0.25*i,hiN=i===0?pulseAt(t,w("night","Priya"),1.2):i===2?pulseAt(t,w("night","Sam"),1.2):0;
    d6_slip(ctx,x,sy+108,D6_NAMES[i],clamp((t-nameT)/0.6,0,1),clamp((t-tX-i*0.18)/0.4,0,1),{a:1-fin(t,tR-0.5,0.5),rot:(hash(i,641)-0.5)*0.08});
    if(hiN>0)glow(ctx,x,sy+108,70,TRUST,0.35*hiN);});
  arrive(ctx,d6_sx(2),560,t,tW,()=>withA(ctx,1-fin(t,tR-0.5,0.5),()=>tag(ctx,d6_sx(2),560,"next week: someone else",PARCH,{align:"center",size:28})),{dy:8});
  // the roles: a bracket under the steps each one does, named as the narration names it
  D6_RUNS.forEach(([i0,i1,r,low])=>{const t0=w("role",D6_RN[r])-0.1,q=fin(t,t0,0.5);if(q<=0)return;const x0=d6_sx(i0)-96,x1=d6_sx(i1)+96,by=sy+80;
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(BUS,0.85);ctx.lineWidth=3;ctx.lineCap="round";const m=(x0+x1)/2,hw=(x1-x0)/2*ease(q);ctx.beginPath();ctx.moveTo(m-hw,by);ctx.lineTo(m-hw,by+14);ctx.lineTo(m+hw,by+14);ctx.lineTo(m+hw,by);ctx.moveTo(m,by+14);ctx.lineTo(m,by+26+low*38);ctx.stroke();ctx.restore();
      archGlyph(ctx,"role",m-tw(ctx,D6_RN[r],28,800)/2-22,by+56+low*38,11,BUS);T(ctx,D6_RN[r],m+8,by+66+low*38,{w:800,size:28,align:"center",color:rgba(BUS,1)});
      const hi=pulseAt(t,t0+0.1,1.2);if(hi>0)glow(ctx,m,by+56,90,BUS,0.25*hi);});});
  // each role once, with the actor who filled it that night; actors come and go
  D6_ROLES.forEach(([r,x,who],k)=>{const t0=w("actor","Whoever")+k*0.2,ta=w("actor","an actor")+k*0.25,swap=who==="Sam"&&t>w("actor","come and go")+0.4,sw=who==="Sam"?pulseAt(t,w("actor","come and go")+0.4,1.0):0;
    arrive(ctx,x,560,t,t0,()=>archEl(ctx,x-190,510,380,96,r,BUS,"role",{size:32,gs:15}),{dy:-12});
    arrive(ctx,x,740,t,ta,()=>{archEl(ctx,x-160,700,320,84,swap?"Ana":who,BUS,"actor",{size:30,gs:14,hi:sw});d6_assign(ctx,x,700,x,610,BUS,clamp((t-ta-0.2)/0.4,0,1),1);},{dy:12});
    if(who==="Sam"&&sw>0)withA(ctx,sw,()=>T(ctx,"next week",x+176,752,{w:700,size:28,color:rgba(PARCH,0.95)}));});
  ctx.restore();
  arrive(ctx,560,150,t,w("role","role")-0.1,()=>withA(ctx,1-fin(t,tA-0.2,0.4),()=>tag(ctx,560,150,"a step is done by a role",BUS,{align:"center",size:30})),{dy:8});
  arrive(ctx,560,150,t,w("actor","a person"),()=>tag(ctx,560,150,"an actor fills a role: a person, or a team",BUS,{align:"center",size:30}),{dy:8});
  arrive(ctx,1700,800,t,tGr-0.3,()=>person(ctx,"grace",1800,1030,0.74,{t,pose:t>tGr&&t<tGr+2.2?"explain":"stand"}),{dy:20,from:0.96});
  vign(ctx,S);});

/* ---------- 3. A partner, and a contract ---------- */
scene("partner",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tU=c("units"),tC=c("crew"),tK=c("contract"),tN=c("next"),swap=fin(t,w("next","Partners change")+0.3,0.5);
  // the utility, its two teams, and the roles in them
  d6_group(ctx,70,170,1080,450,"the utility",BUS,{a:fin(t,0.2,0.6)});
  [["contact centre",330,"call-taker",w("units","contact centre")],["control room",880,"duty controller",w("units","control room")]].forEach(([u_,x,r,t0])=>{
    arrive(ctx,x,330,t,t0-0.1,()=>{archEl(ctx,x-220,260,440,110,u_,BUS,"actor",{size:34,gs:16,hi:pulseAt(t,t0+0.1,1.2)});archEl(ctx,x-170,470,340,92,r,BUS,"role",{size:30,gs:14});d6_assign(ctx,x,370,x,466,BUS,1,1);},{dy:-14});});
  // the crews: a contractor's, outside the utility
  const cx=1590;arrive(ctx,cx,330,t,w("crew","contractor")-0.1,()=>{const nm=swap>0.5?"contractor B":"contractor A";archEl(ctx,cx-220,260,440,110,nm,BUS,"actor",{size:34,gs:16,hi:pulseAt(t,w("next","Partners change")+0.3,1.0)});
    archEl(ctx,cx-170,470,340,92,"crew leader",BUS,"role",{size:30,gs:14});d6_assign(ctx,cx,370,cx,466,BUS,1,1);},{dy:-14});
  arrive(ctx,cx,200,t,w("crew","a partner"),()=>tag(ctx,cx,200,"a partner",TRUST,{align:"center",size:30}),{dy:8});
  // the contract between them
  const kp=clamp((t-w("contract","contract"))/1.6,0,1);arrive(ctx,1240,720,t,w("contract","written")-0.2,()=>{d6_contract(ctx,1060,580,520,280,["on site within 2 hours","under the utility's safety rules"],{p:kp,hi:fin(t,w("next","contract goes"),0.5)});
    ctx.save();ctx.strokeStyle=rgba(PARCH,0.6);ctx.lineWidth=2.5;ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(1060,700);ctx.lineTo(880,566);ctx.moveTo(1500,590);ctx.lineTo(cx,566);ctx.stroke();ctx.setLineDash([]);ctx.restore();},{dy:14});
  ctx.restore();
  arrive(ctx,560,720,t,w("next","next one"),()=>tag(ctx,560,720,"the contract says what the next one must do",TRUST,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 4. An agent on the night shift ---------- */
const D6_REP=[["call","Hill Street",0],["text","East side",2],["meter","East side",2],["call","Riverside",1],["meter","East side",2],["text","Hill Street",0],["call","East side",2],["meter","Riverside",1],["call","East side",2]];
const D6_GRP=[["Hill Street","wire down",[255,150,110],250],["Riverside","life support",[255,130,170],420],["East side","1,200 homes",[255,206,120],590]];
scene("agent",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tR=c("reads"),tG=c("groups"),tRi=c("rights"),tE=c("escalate"),AX=840,AY=420;
  const ag=fin(t,0.4,0.8);kt_agent(ctx,AX,AY,74,t,{a:ag,busy:fin(t,tR,0.5)*(1-fin(t,tRi,0.6))});
  arrive(ctx,AX,580,t,w("one","isn't a person"),()=>withA(ctx,1-fin(t,tRi-0.2,0.4),()=>tag(ctx,AX,580,"an actor: an AI agent",KT_AI,{align:"center",size:30})),{dy:8});
  // reports arrive from the left, and go into the agent
  D6_REP.forEach(([k,st,g],i)=>{const t0=tR+0.2+i*0.34,u=clamp((t-t0)/2.2,0,1);if(u<=0)return;const y0=170+(i%5)*120,x=lerp(150,AX-40,ease(u)),y=lerp(y0,AY,ease(u)*ease(u));
    d6_report(ctx,x,y,k,st,{a:(1-sstep(0.75,1,u))*(1-fin(t,tRi-0.2,0.4))});});
  // grouped into faults, with a proposed order
  D6_GRP.forEach(([n,l,col,y],i)=>{const t0=w("groups","faults")+i*0.3,n_=D6_REP.filter(r=>r[2]===i).length;arrive(ctx,1360,y,t,t0,()=>{const ex=i<2?fin(t,w("escalate",i?"life support":"wire down"),0.5):0;
      glass(ctx,1150,y-62,440,124,16,mix(col,TRUST,ex*0.6),{glow:10+14*ex,ea:0.8,fill:"rgba(8,12,24,0.95)"});T(ctx,n,1180,y-14,{w:800,size:32,color:rgba(col,1)});T(ctx,n_+" reports · "+l,1180,y+36,{w:700,size:28,color:rgba(INK,0.9)});
      const pr=fin(t,w("groups","proposes")+i*0.15,0.4);if(pr>0)withA(ctx,pr,()=>{const rank=[2,3,1][i];glass(ctx,1610,y-30,60,60,30,KT_AI,{glow:8,ea:0.8,fill:"rgba(6,12,20,0.95)"});T(ctx,""+rank,1640,y+11,{w:800,size:32,align:"center",color:rgba(KT_AI,1)});});},{dy:-12});
    if(t>t0){const q=fin(t,t0,0.5);arrowTo(ctx,AX+90,AY,1140,y,KT_AI,0.5*q*(1-fin(t,tRi-0.2,0.4)),{p:q,lw:2.5,head:10});}});
  arrive(ctx,1400,120,t,w("groups","proposes"),()=>withA(ctx,1-fin(t,tE+0.4,0.4),()=>tag(ctx,1400,120,"proposed: which matters most",KT_AI,{align:"center",size:28})),{dy:8});
  // its rights, written down, and the duty controller it hands the hard cases to
  arrive(ctx,420,700,t,tRi+0.2,()=>d6_rights(ctx,60,560,720,{rows:[fin(t,w("rights","It may"),0.4),fin(t,w("rights","may not"),0.4),fin(t,tE,0.4)],hi:pulseAt(t,tE,1.2)}),{dy:14});
  const dc=fin(t,w("escalate","duty controller")-0.2,0.5);if(dc>0){withA(ctx,dc,()=>archEl(ctx,1160,720,420,100,"duty controller",BUS,"role",{size:32,gs:15,hi:pulseAt(t,w("escalate","duty controller"),1.2)}));
    [0,1].forEach(i=>arrowTo(ctx,1150,D6_GRP[i][3],1190+i*50,716,TRUST,0.85*dc,{p:dc,lw:3,head:12,bend:0.6-i*0.2}));}
  ctx.restore();
  arrive(ctx,1370,862,t,w("escalate","recommends"),()=>tag(ctx,1370,862,"the agent recommends; a person decides",TRUST,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 5. How many customers? ---------- */
scene("count",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tA=c("ask"),tRt=c("retail"),tN=c("network"),tM=c("move"),tB=c("both"),mv=t-w("move","moves out");
  arrive(ctx,960,130,t,w("ask","how many")-0.3,()=>withA(ctx,1-fin(t,w("both","different")-0.3,0.4),()=>sticky(ctx,960,130,640,120,"How many customers do we have?",{col:NOTEC[0],size:36,rot:-0.015})),{dy:-20});
  withA(ctx,1-fin(t,tRt+0.4,0.6),()=>person(ctx,"tomas",300,1030,0.8,{t,pose:t<tA+2.4?"explain":"stand"}));
  const lift=ease(fin(t,tM-0.6,0.8)),cy=lerp(420,330,lift);
  arrive(ctx,440,cy,t,w("retail","Retail")-0.1,()=>d6_count(ctx,440,cy,"retail","310,000","people and businesses with an account",D6_RET,{hi:pulseAt(t,w("retail","three"),1.4)+fin(t,tB,0.5)}),{dy:-14});
  arrive(ctx,1480,cy,t,w("network","network")-0.1,()=>d6_count(ctx,1480,cy,"network","540,000","connection points: where power is delivered",D6_NET,{hi:pulseAt(t,w("network","five"),1.4)+fin(t,tB,0.5)}),{dy:-14});
  // number fourteen: one family moves out, another moves in; the account changes, the connection point doesn't
  const hA=fin(t,tM-0.4,0.6);if(hA>0){const hy=660;d6_house(ctx,960,hy,t,{a:hA,meter:fin(t,w("move","connection point"),0.5)});
    const vx=mv<0?720:mv<2.2?720-ease(mv/2.2)*900:mv<3.0?-400:lerp(1500,1220,ease(clamp((mv-3.0)/1.8,0,1)));d6_movevan(ctx,vx,hy+178,0.9,mv<2.6?-1:-1,hA*(mv<2.2||mv>3.0?1:0));
    const closed=fin(t,w("move","closes"),0.4),opened=fin(t,w("move","opens"),0.4);
    withA(ctx,closed*(1-opened),()=>tag(ctx,440,620,"account 20417 · closed",D6_RET,{align:"center",size:28}));
    withA(ctx,opened,()=>tag(ctx,440,620,"account 31882 · opened",D6_RET,{align:"center",size:28}));
    withA(ctx,fin(t,w("move","connection point"),0.4),()=>{tag(ctx,1480,620,"connection point 7001 2345",D6_NET,{align:"center",size:28});tick_(ctx,1480,690,34,[120,210,130],fin(t,w("move","doesn't"),0.4));});}
  ctx.restore();
  arrive(ctx,960,130,t,w("both","different"),()=>tag(ctx,960,130,"both right: two different things, one word",PARCH,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});
/* ---------- 6. A wall between them ---------- */
const D6_SOLAR=["14 Hill Street","22 Hill Street","3 Oak Road","9 Mill Lane"];
scene("wall",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tRu=c("rules"),tS=c("solar"),tM=c("must"),hit=w("must","cross"),sl=t<hit-0.7?0:t<hit?ease((t-hit+0.7)/0.7):1-ease(clamp((t-hit)/0.9,0,1))*0.6;
  d6_sides(ctx,{a:fin(t,0.2,0.6)});
  d6_wall(ctx,t,{p:clamp((t-w("rules","separate"))/1.2,0,1),red:pulseAt(t,hit,1.4)});
  // the utility's own principle, across both sides
  arrive(ctx,960,330,t,w("rules","The utility's")-0.1,()=>ruleCard(ctx,520,260,880,"customer information stays with the business that collected it",{kicker:"principle 3",col:MOT,size:32,hi:pulseAt(t,w("rules","customer information"),1.4)}),{dy:-12});
  // what the network knows, and what it would mean to a retailer
  arrive(ctx,420,640,t,w("solar","applied")-0.2,()=>{ctx.save();ctx.translate(sl*240,0);d6_list(ctx,160,500,520,"applied to connect solar",D6_SOLAR,{p:clamp((t-w("solar","applied"))/1.2,0,1)});ctx.restore();},{dy:14});
  arrive(ctx,1440,600,t,w("solar","To a retailer"),()=>{d6_battery(ctx,1440,570,1.4,D6_RET,1);tag(ctx,1440,660,"people to sell batteries to",D6_RET,{align:"center",size:30});},{dy:10});
  const xx=fin(t,hit,0.4);if(xx>0){cross_(ctx,960,640,90,D6_RED,xx);}
  ctx.restore();
  arrive(ctx,960,190,t,w("rules","separate"),()=>tag(ctx,960,190,"in many markets: kept apart, even inside one group",PARCH,{align:"center",size:30}),{dy:8});
  arrive(ctx,960,870,t,hit,()=>tag(ctx,960,870,"it must not cross",D6_RED,{align:"center",size:32}),{dy:8});
  arrive(ctx,1700,800,t,0.3,()=>{person(ctx,"ama",1790,1030,0.74,{t,pose:t>c("ama")&&t<c("ama")+2.2||(t>tRu&&t<tRu+2.0)?"explain":"stand"});tag(ctx,1720,520,"Ama · regulatory lead",TRUST,{align:"center",size:28});},{dy:20,from:0.96});
  vign(ctx,S);});

/* ---------- 7. Two organisations in one ---------- */
const D6_DOM=[{x:60,col:D6_NET,name:"network · a domain",cust:"its customers: connection points",caps:["plan the network","operate the network","maintain assets","connect customers"],words:[["connection point",270],["feeder",530],["outage",730]],t:"the network",say:"a connection point"},
  {x:1020,col:D6_RET,name:"retail · a domain",cust:"its customers: account holders",caps:["sell energy","serve customers"],words:[["account",1170],["tariff",1410],["bill",1630]],t:"retail",say:"an account holder"}];
scene("domains",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tD=c("domain"),tO=c("own"),tMe=c("meaning");
  d6_wall(ctx,t,{a:0.55,hi:fin(t,tMe,0.6)});
  D6_DOM.forEach((d,k)=>{const t0=w("draw",d.t)-0.1;d6_group(ctx,d.x,190,840,520,d.name,d.col,{a:fin(t,t0,0.6),hi:pulseAt(t,w("domain","domain"),1.4)+fin(t,tMe,0.6)*0.6});
    arrive(ctx,d.x+420,290,t,w("domain","organisation in")+k*0.25,()=>archEl(ctx,d.x+40,245,760,90,d.cust,BUS,"role",{size:30,gs:14}),{dy:-10});
    d.caps.forEach((cp,i)=>{const cx_=d.x+40+(i%2)*390,cy_=370+Math.floor(i/2)*112;arrive(ctx,cx_+185,cy_+45,t,w("own","capabilities")-0.1+i*0.12+k*0.2,()=>archEl(ctx,cx_,cy_,370,92,cp,STR,"capability",{size:28,gs:13}),{dy:-10});});
    d.words.forEach(([wd,x],i)=>{const t0=k===0?w("own",["connection point","feeder","outage"][i]):w("own",["account","tariff","bill"][i]);arrive(ctx,x,650,t,t0-0.1,()=>tag(ctx,x,650,wd,d.col,{align:"center",size:28}),{dy:8});});});
  // one word, two things
  const cu=fin(t,w("meaning","Customer")-0.1,0.5);if(cu>0){withA(ctx,cu,()=>{tag(ctx,960,800,"customer",PARCH,{align:"center",size:34});});
    D6_DOM.forEach((d,k)=>{const q=fin(t,w("meaning","two things")-0.2+k*0.2,0.5);arrowTo(ctx,k?1060:860,800,k?1260:660,800,d.col,0.9*q,{p:q,lw:3,head:12});withA(ctx,q,()=>tag(ctx,k?1460:460,800,d.say,d.col,{align:"center",size:30}));});}
  ctx.restore();
  arrive(ctx,960,110,t,w("domain","a part"),()=>tag(ctx,960,110,"domain: a part of the organisation, modelled as an organisation in its own right",PARCH,{align:"center",size:28}),{dy:8});
  arrive(ctx,960,880,t,w("meaning","Meaning"),()=>tag(ctx,960,880,"meaning changes at a domain's edge",[220,230,255],{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 8. One definition for everyone? ---------- */
const D6_CROSS=["which connection point","which retailer serves it","planned outages","life support at this address"];
scene("one",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tF=c("fit"),tI=c("instead"),tL=c("list"),gone=fin(t,tI-0.3,0.6),gate=fin(t,w("instead","translation")-0.3,0.8),car=w("fit","carry");
  d6_sides(ctx,{});d6_wall(ctx,t,{gate,gy:470,red:pulseAt(t,car+0.9,1.4)});
  // the one definition, and everything both sides try to put in it
  const one=fin(t,w("tempt","one definition")-0.2,0.5)*(1-gone);if(one>0)withA(ctx,one,()=>{const sh=pulseAt(t,w("fit","neither"),0.8)*Math.sin(t*40)*6;ctx.save();ctx.translate(sh,0);
    glass(ctx,560,240,800,340,22,PARCH,{glow:14,ea:0.8,fill:"rgba(10,12,22,0.96)"});T(ctx,"customer",960,310,{w:800,size:52,align:"center"});T(ctx,"one definition, for everyone, in one place",960,360,{w:700,size:28,align:"center",color:rgba(SOFT,1)});
    [["connection point?",700,480,D6_NET,0],["feeder?",880,540,D6_NET,1],["account?",1060,480,D6_RET,2],["tariff?",1210,540,D6_RET,3]].forEach(([s_,x,y,col,i])=>{const q=clamp((t-tF+0.6-i*0.25)/0.6,0,1);if(q>0){const sx=i<2?200:1720;withA(ctx,q,()=>tag(ctx,lerp(sx,x,ease(q)),y,s_,col,{align:"center",size:28}));}});
    ctx.restore();kt_rstamp(ctx,960,418,"fits neither side",D6_RED,1,clamp((t-w("fit","neither"))/0.4,0,1),{size:32});});
  // and it would carry what the network knows across the wall
  const cq=clamp((t-car)/1.0,0,1)*(1-gone);if(cq>0){withA(ctx,1,()=>d6_list(ctx,90,620,420,"applied to connect solar",D6_SOLAR.slice(0,2),{a:cq}));arrowTo(ctx,520,700,1420,700,D6_RED,0.9*cq,{p:cq,lw:4,head:16});withA(ctx,fin(t,car+0.9,0.4)*(1-gone),()=>{cross_(ctx,960,700,80,D6_RED,1);});}
  // instead: each side keeps its meaning, and the edge gets a translation
  [[260,"customer: a connection point",D6_NET,0],[1140,"customer: an account holder",D6_RET,1]].forEach(([x,s_,col,k])=>arrive(ctx,x+260,320,t,w("instead","each domain")+k*0.3,()=>{glass(ctx,x,260,520,120,18,col,{glow:12,ea:0.8,fill:"rgba(8,12,24,0.95)"});T(ctx,s_,x+260,332,{w:800,size:30,align:"center",color:rgba(col,1)});},{dy:-12}));
  arrive(ctx,960,580,t,w("instead","a short")-0.1,()=>{const rows=D6_CROSS.map((r,i)=>r);d6_list(ctx,640,560,640,"what crosses, and how",rows,{p:["Which connection","Which retailer","Planned","life support"].reduce((a_,k)=>a_+clamp((t-w("list",k)+0.1)/0.4,0,1),0)/4,rot:0.004});},{dy:12});
  // the list crossing, both ways, in the wordless moment
  if(t>B-0.2)for(let k=0;k<4;k++){const v=((t-B)*0.45+k*0.25)%1,dir=k%2?1:-1,x=dir>0?lerp(720,1200,v):lerp(1200,720,v);d6_msg(ctx,x,470+(k%2?-30:30),0.8,dir>0?D6_NET:D6_RET,fin(t,B,0.5)*sstep(0,0.12,v)*(1-sstep(0.88,1,v)));}
  ctx.restore();
  arrive(ctx,960,170,t,w("instead","translation"),()=>tag(ctx,960,170,"at the edge: a translation",[220,230,255],{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 9. Where it can fail ---------- */
scene("fails",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tC=c("cross"),tLt=c("late"),tLk=c("like"),mv=t-w("movein","moves"),late=fin(t,tLt,0.5);
  d6_sides(ctx,{});d6_wall(ctx,t,{gate:1,gy:470,hi:fin(t,tLk,0.6)});
  // retail hears first: someone on life support moves into number fourteen
  d6_house(ctx,1440,400,t,{a:fin(t,0.3,0.6),life:fin(t,w("movein","life support"),0.5)});
  d6_movevan(ctx,lerp(2100,1760,ease(clamp(mv/1.6,0,1))),578,0.8,-1,fin(t,0.3,0.4));
  arrive(ctx,1440,720,t,w("movein","retail hears"),()=>ruleCard(ctx,1100,650,680,"14 Hill Street · life support",{kicker:"retail: told first",col:D6_RET,size:30}),{dy:12});
  // the network's list, which the rule for who goes first works from
  arrive(ctx,400,640,t,tC-0.1,()=>d6_list(ctx,120,560,560,"who is on life support",["3 Riverside Road","8 Mill Lane",late>0.5?"14 Hill Street?":"14 Hill Street"],{p:t<tLt?0.67:1,miss:[0,0,late>0.5]}),{dy:12});
  arrive(ctx,400,440,t,w("cross","rule"),()=>tag(ctx,400,440,"the rule for who goes first reads this list",BUS,{align:"center",size:28}),{dy:8});
  d6_cloud(ctx,330,250,0.9,t,pulseAt(t,w("late","late")+0.4,0.5)+pulseAt(t,w("late","wrong list"),0.5),fin(t,w("cross","storm")-0.2,0.6));
  // the message, from retail to the edge, where it waits
  const mq=clamp((t-w("movein","retail hears")-0.6)/1.6,0,1),mx=lerp(1300,1020,ease(mq)),my=lerp(650,470,ease(mq));if(mq>0)d6_msg(ctx,mx,my,1.1,D6_RET,1);
  if(late>0)withA(ctx,late,()=>{glow(ctx,1030,470,70,D6_RED,0.3*(0.6+0.4*Math.sin(t*4)));tag(ctx,1180,400,"late",D6_RED,{align:"center",size:30});});
  ctx.restore();
  arrive(ctx,400,848,t,w("late","wrong list"),()=>tag(ctx,400,848,"the rule works from the wrong list",D6_RED,{align:"center",size:30}),{dy:8});
  arrive(ctx,960,170,t,w("like","the edge"),()=>tag(ctx,960,170,"the edge: where the translation is built, and where it can fail",[220,230,255],{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 10. Drawn, for now ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const gN=fin(t,w("confirm","Grace"),0.8),gR=fin(t,w("confirm","head of retail")+0.4,0.8),gA=fin(t,w("confirm","Ama"),0.8),cA=c("answer");
  // the network's roles and retail's, turning from paper to glass as their owners confirm them
  T(ctx,"network",250,120,{w:800,size:32,align:"center",color:rgba(D6_NET,1)});T(ctx,"retail",700,120,{w:800,size:32,align:"center",color:rgba(D6_RET,1)});
  ["call-taker","duty controller","crew leader"].forEach((r,i)=>arrive(ctx,250,190+i*92,t,0.3+i*0.1,()=>sticky(ctx,250,190+i*92,340,78,r,{col:NOTEC[0],edge:BUS,glass:gN,size:28,rot:0}),{dy:-12}));
  ["sales adviser","billing officer"].forEach((r,i)=>arrive(ctx,700,190+i*92,t,0.5+i*0.1,()=>sticky(ctx,700,190+i*92,340,78,r,{col:NOTEC[0],edge:BUS,glass:gR,size:28,rot:0}),{dy:-12}));
  if(gN>0)withA(ctx,gN,()=>{kt_gtick(ctx,110,460,20,1);T(ctx,"confirmed · Grace",142,470,{w:700,size:28,color:rgba(TRUST,1)});});
  if(gR>0)withA(ctx,gR,()=>{kt_gtick(ctx,560,368,20,1);T(ctx,"confirmed · head of retail",592,378,{w:700,size:28,color:rgba(TRUST,1)});});
  // the edge, and what may cross it
  arrive(ctx,480,560,t,0.7,()=>sticky(ctx,480,560,780,96,"the edge · network | retail · four things may cross",{col:NOTEC[2],edge:[220,230,255],glass:gA,size:28,rot:0}),{dy:-12});
  if(gA>0)withA(ctx,gA,()=>{kt_gtick(ctx,110,646,20,1);T(ctx,"confirmed · Ama",142,656,{w:700,size:28,color:rgba(TRUST,1)});});
  // the agent's rights, with an owner
  arrive(ctx,300,740,t,c("agent"),()=>{kt_agent(ctx,140,740,30,t,{});T(ctx,"the agent's rights",200,732,{w:800,size:28,color:rgba(KT_AI,1)});withA(ctx,fin(t,w("agent","owner"),0.5),()=>tag(ctx,200,778,"owner: Grace",TRUST,{size:28}));},{dy:12});
  person(ctx,"grace",1000,1030,0.72,{t,pose:t>w("confirm","Grace")&&t<w("confirm","Grace")+1.8?"explain":"stand"});
  person(ctx,"ama",1190,1030,0.72,{t,pose:t>w("confirm","Ama")&&t<w("confirm","Ama")+1.8?"explain":"stand"});
  person(ctx,"tomas",1820,1030,0.78,{t,pose:t>cA&&t<cA+2.2?"explain":"stand"});
  arrive(ctx,1560,140,t,0.4,()=>sticky(ctx,1560,140,500,120,"Who does it, and where does meaning change?",{col:NOTEC[0],size:30,st:fin(t,cA+1.4,0.5)*0.5,rot:-0.03}),{dy:-20});
  arrive(ctx,1580,420,t,cA,()=>sticky(ctx,1580,420,500,320,"Roles do the work; people, partners and agents fill them. Customer: two meanings, a wall, a translation at the edge.",{col:NOTEC[0],size:30,p:clamp((t-cA-0.2)/3.2,0,1),rot:0.015}),{dy:-30,from:1.06});
  arrive(ctx,1500,720,t,w("next","opens"),()=>sticky(ctx,1500,720,440,140,"What runs it today, and where is it going?",{col:NOTEC[0],size:30,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"Who does it, and where meaning changes",EAC,"Know who does the work. Translate at the edges.","Film 6 of 11");});
